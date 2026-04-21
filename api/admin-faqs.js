'use strict';

const { Router } = require('express');
const admin = require('./firebase-admin');

const router = Router();
const db = () => admin.firestore();

async function requireAdmin(req, res) {
  const auth = req.headers.authorization || '';
  const token = auth.startsWith('Bearer ') ? auth.slice(7) : null;
  if (!token) { res.status(401).json({ error: 'Unauthorised' }); return null; }
  try {
    const decoded = await admin.auth().verifyIdToken(token);
    if (decoded.role !== 'admin' && decoded.role !== 'super_admin') {
      res.status(403).json({ error: 'Forbidden' }); return null;
    }
    return decoded;
  } catch {
    res.status(401).json({ error: 'Invalid token' }); return null;
  }
}

/** Fetch all FAQs for a page. Uses only a single-field where() — no composite index needed. */
async function getPageFaqs(page) {
  const snap = await db().collection('faqs').where('page', '==', page).get();
  return snap.docs.map(d => ({ id: d.id, ref: d.ref, ...d.data() }));
}

// ─── POST / — create ─────────────────────────────────────────────────────────
router.post('/', async (req, res) => {
  if (!await requireAdmin(req, res)) return;
  const { page, question, answer, displayOrder, visible = true } = req.body || {};
  if (!page || !question || !answer) {
    return res.status(400).json({ error: 'page, question, answer required' });
  }
  const ref = await db().collection('faqs').add({
    page,
    question: question.trim(),
    answer: answer.trim(),
    displayOrder: Number(displayOrder) || 1,
    visible,
  });
  res.json({ id: ref.id });
});

// ─── PATCH /:id — update fields or reorder ───────────────────────────────────
//
// If displayOrder is NOT in the body → simple field update (question, answer, visible).
// If displayOrder IS in the body → treat as a reorder:
//   Moving up   (new < old): shift FAQs in [new, old) down by 1, place target at new.
//   Moving down (new > old): shift FAQs in (old, new] up by 1, place target at new.
//   Conflict (another FAQ already at new): absorbed by the shift — no two FAQs
//   end up with the same number, and the moved FAQ always wins its target slot.
//
router.patch('/:id', async (req, res) => {
  if (!await requireAdmin(req, res)) return;
  const { id } = req.params;
  const body = req.body || {};

  // ── Non-order fields ──
  if (!('displayOrder' in body)) {
    const allowed = ['question', 'answer', 'visible'];
    const update = {};
    for (const key of allowed) {
      if (key in body) update[key] = body[key];
    }
    if (!Object.keys(update).length) return res.status(400).json({ error: 'Nothing to update' });
    if (update.question) update.question = String(update.question).trim();
    if (update.answer)   update.answer   = String(update.answer).trim();
    await db().collection('faqs').doc(id).update(update);
    return res.json({ ok: true });
  }

  // ── Reorder ──
  const newOrder = Number(body.displayOrder);
  if (!Number.isInteger(newOrder) || newOrder < 1) {
    return res.status(400).json({ error: 'displayOrder must be a positive integer' });
  }

  const docRef = db().collection('faqs').doc(id);
  const snap = await docRef.get();
  if (!snap.exists) return res.status(404).json({ error: 'Not found' });

  const { page, displayOrder: oldOrder } = snap.data();
  if (newOrder === oldOrder) return res.json({ ok: true });

  const pageFaqs = await getPageFaqs(page);
  const batch = db().batch();

  if (newOrder < oldOrder) {
    // Moving up: push everything in [newOrder, oldOrder) one step down
    pageFaqs
      .filter(f => f.id !== id && f.displayOrder >= newOrder && f.displayOrder < oldOrder)
      .forEach(f => batch.update(f.ref, { displayOrder: f.displayOrder + 1 }));
  } else {
    // Moving down: pull everything in (oldOrder, newOrder] one step up
    pageFaqs
      .filter(f => f.id !== id && f.displayOrder > oldOrder && f.displayOrder <= newOrder)
      .forEach(f => batch.update(f.ref, { displayOrder: f.displayOrder - 1 }));
  }

  batch.update(docRef, { displayOrder: newOrder });
  await batch.commit();
  res.json({ ok: true });
});

// ─── DELETE /:id — delete and compact ────────────────────────────────────────
//
// After deleting, every FAQ on the same page with a higher displayOrder
// is decremented by 1 so the sequence stays contiguous.
//
router.delete('/:id', async (req, res) => {
  if (!await requireAdmin(req, res)) return;
  const { id } = req.params;

  const docRef = db().collection('faqs').doc(id);
  const snap = await docRef.get();
  if (!snap.exists) return res.status(404).json({ error: 'Not found' });

  const { page, displayOrder } = snap.data();
  await docRef.delete();

  const pageFaqs = await getPageFaqs(page);
  const toShift = pageFaqs.filter(f => f.displayOrder > displayOrder);

  if (toShift.length) {
    const batch = db().batch();
    toShift.forEach(f => batch.update(f.ref, { displayOrder: f.displayOrder - 1 }));
    await batch.commit();
  }

  res.json({ ok: true });
});

// ─── POST /seed — bulk import ─────────────────────────────────────────────────
router.post('/seed', async (req, res) => {
  if (!await requireAdmin(req, res)) return;
  const { faqs, clear } = req.body || {};
  if (!Array.isArray(faqs)) return res.status(400).json({ error: 'faqs array required' });
  const col = db().collection('faqs');
  if (clear) {
    const existing = await col.get();
    await Promise.all(existing.docs.map(d => d.ref.delete()));
  }
  await Promise.all(faqs.map(faq => col.add({ ...faq, visible: faq.visible !== false })));
  res.json({ ok: true, count: faqs.length });
});

module.exports = router;

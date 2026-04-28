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

/** Fetch all partners. The whole collection is one page's data — no filter needed. */
async function getPartners() {
  const snap = await db().collection('sfh_partners').get();
  return snap.docs.map(d => ({ id: d.id, ref: d.ref, ...d.data() }));
}

// ─── POST / — create ─────────────────────────────────────────────────────────
router.post('/', async (req, res) => {
  if (!await requireAdmin(req, res)) return;
  const { category, name, location, displayOrder, visible = true } = req.body || {};
  if (!category || !name || !location) {
    return res.status(400).json({ error: 'category, name, location required' });
  }
  const ref = await db().collection('sfh_partners').add({
    category: String(category).trim(),
    name: String(name).trim(),
    location: String(location).trim(),
    displayOrder: Number(displayOrder) || 1,
    visible,
  });
  res.json({ id: ref.id });
});

// ─── PATCH /:id — update fields or reorder ───────────────────────────────────
//
// If displayOrder is NOT in the body → simple field update (category, name, location, visible).
// If displayOrder IS in the body → treat as a reorder:
//   Moving up   (new < old): shift partners in [new, old) down by 1, place target at new.
//   Moving down (new > old): shift partners in (old, new] up by 1, place target at new.
//
router.patch('/:id', async (req, res) => {
  if (!await requireAdmin(req, res)) return;
  const { id } = req.params;
  const body = req.body || {};

  // ── Non-order fields ──
  if (!('displayOrder' in body)) {
    const allowed = ['category', 'name', 'location', 'visible'];
    const update = {};
    for (const key of allowed) {
      if (key in body) update[key] = body[key];
    }
    if (!Object.keys(update).length) return res.status(400).json({ error: 'Nothing to update' });
    if (update.category) update.category = String(update.category).trim();
    if (update.name)     update.name     = String(update.name).trim();
    if (update.location) update.location = String(update.location).trim();
    await db().collection('sfh_partners').doc(id).update(update);
    return res.json({ ok: true });
  }

  // ── Reorder ──
  const newOrder = Number(body.displayOrder);
  if (!Number.isInteger(newOrder) || newOrder < 1) {
    return res.status(400).json({ error: 'displayOrder must be a positive integer' });
  }

  const docRef = db().collection('sfh_partners').doc(id);
  const snap = await docRef.get();
  if (!snap.exists) return res.status(404).json({ error: 'Not found' });

  const { displayOrder: oldOrder } = snap.data();
  if (newOrder === oldOrder) return res.json({ ok: true });

  const partners = await getPartners();
  const batch = db().batch();

  if (newOrder < oldOrder) {
    // Moving up: push everything in [newOrder, oldOrder) one step down
    partners
      .filter(p => p.id !== id && p.displayOrder >= newOrder && p.displayOrder < oldOrder)
      .forEach(p => batch.update(p.ref, { displayOrder: p.displayOrder + 1 }));
  } else {
    // Moving down: pull everything in (oldOrder, newOrder] one step up
    partners
      .filter(p => p.id !== id && p.displayOrder > oldOrder && p.displayOrder <= newOrder)
      .forEach(p => batch.update(p.ref, { displayOrder: p.displayOrder - 1 }));
  }

  batch.update(docRef, { displayOrder: newOrder });
  await batch.commit();
  res.json({ ok: true });
});

// ─── DELETE /:id — delete and compact ────────────────────────────────────────
//
// After deleting, every partner with a higher displayOrder is decremented
// by 1 so the sequence stays contiguous.
//
router.delete('/:id', async (req, res) => {
  if (!await requireAdmin(req, res)) return;
  const { id } = req.params;

  const docRef = db().collection('sfh_partners').doc(id);
  const snap = await docRef.get();
  if (!snap.exists) return res.status(404).json({ error: 'Not found' });

  const { displayOrder } = snap.data();
  await docRef.delete();

  const partners = await getPartners();
  const toShift = partners.filter(p => p.displayOrder > displayOrder);

  if (toShift.length) {
    const batch = db().batch();
    toShift.forEach(p => batch.update(p.ref, { displayOrder: p.displayOrder - 1 }));
    await batch.commit();
  }

  res.json({ ok: true });
});

module.exports = router;

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

/** Fetch all events. The whole collection is one page's data — no filter needed. */
async function getEvents() {
  const snap = await db().collection('sfh_events').get();
  return snap.docs.map(d => ({ id: d.id, ref: d.ref, ...d.data() }));
}

// ─── POST / — create ─────────────────────────────────────────────────────────
router.post('/', async (req, res) => {
  if (!await requireAdmin(req, res)) return;
  const { region, name, month, displayOrder, visible = true } = req.body || {};
  if (!region || !name || !month) {
    return res.status(400).json({ error: 'region, name, month required' });
  }
  const ref = await db().collection('sfh_events').add({
    region: String(region).trim(),
    name: String(name).trim(),
    month: String(month).trim(),
    displayOrder: Number(displayOrder) || 1,
    visible,
  });
  res.json({ id: ref.id });
});

// ─── PATCH /:id — update fields or reorder ───────────────────────────────────
//
// If displayOrder is NOT in the body → simple field update (region, name, month, visible).
// If displayOrder IS in the body → treat as a reorder:
//   Moving up   (new < old): shift events in [new, old) down by 1, place target at new.
//   Moving down (new > old): shift events in (old, new] up by 1, place target at new.
//
router.patch('/:id', async (req, res) => {
  if (!await requireAdmin(req, res)) return;
  const { id } = req.params;
  const body = req.body || {};

  // ── Non-order fields ──
  if (!('displayOrder' in body)) {
    const allowed = ['region', 'name', 'month', 'visible'];
    const update = {};
    for (const key of allowed) {
      if (key in body) update[key] = body[key];
    }
    if (!Object.keys(update).length) return res.status(400).json({ error: 'Nothing to update' });
    if (update.region) update.region = String(update.region).trim();
    if (update.name)   update.name   = String(update.name).trim();
    if (update.month)  update.month  = String(update.month).trim();
    await db().collection('sfh_events').doc(id).update(update);
    return res.json({ ok: true });
  }

  // ── Reorder ──
  const newOrder = Number(body.displayOrder);
  if (!Number.isInteger(newOrder) || newOrder < 1) {
    return res.status(400).json({ error: 'displayOrder must be a positive integer' });
  }

  const docRef = db().collection('sfh_events').doc(id);
  const snap = await docRef.get();
  if (!snap.exists) return res.status(404).json({ error: 'Not found' });

  const { displayOrder: oldOrder } = snap.data();
  if (newOrder === oldOrder) return res.json({ ok: true });

  const events = await getEvents();
  const batch = db().batch();

  if (newOrder < oldOrder) {
    // Moving up: push everything in [newOrder, oldOrder) one step down
    events
      .filter(e => e.id !== id && e.displayOrder >= newOrder && e.displayOrder < oldOrder)
      .forEach(e => batch.update(e.ref, { displayOrder: e.displayOrder + 1 }));
  } else {
    // Moving down: pull everything in (oldOrder, newOrder] one step up
    events
      .filter(e => e.id !== id && e.displayOrder > oldOrder && e.displayOrder <= newOrder)
      .forEach(e => batch.update(e.ref, { displayOrder: e.displayOrder - 1 }));
  }

  batch.update(docRef, { displayOrder: newOrder });
  await batch.commit();
  res.json({ ok: true });
});

// ─── DELETE /:id — delete and compact ────────────────────────────────────────
//
// After deleting, every event with a higher displayOrder is decremented
// by 1 so the sequence stays contiguous.
//
router.delete('/:id', async (req, res) => {
  if (!await requireAdmin(req, res)) return;
  const { id } = req.params;

  const docRef = db().collection('sfh_events').doc(id);
  const snap = await docRef.get();
  if (!snap.exists) return res.status(404).json({ error: 'Not found' });

  const { displayOrder } = snap.data();
  await docRef.delete();

  const events = await getEvents();
  const toShift = events.filter(e => e.displayOrder > displayOrder);

  if (toShift.length) {
    const batch = db().batch();
    toShift.forEach(e => batch.update(e.ref, { displayOrder: e.displayOrder - 1 }));
    await batch.commit();
  }

  res.json({ ok: true });
});

module.exports = router;

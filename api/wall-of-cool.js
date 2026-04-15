'use strict';

const express = require('express');
const admin = require('./firebase-admin');

const router = express.Router();

async function requireAdmin(req, res, next) {
  const header = req.headers.authorization || '';
  const token = header.replace('Bearer ', '').trim();
  if (!token) return res.status(401).json({ error: 'Unauthorized' });
  try {
    const decoded = await admin.auth().verifyIdToken(token);
    if (decoded.role !== 'admin' && decoded.role !== 'super_admin') {
      return res.status(403).json({ error: 'Forbidden' });
    }
    next();
  } catch {
    return res.status(401).json({ error: 'Unauthorized' });
  }
}

// POST /api/wall-of-cool — user submission (image or video, no personal info)
router.post('/', async (req, res) => {
  try {
    const { imageUrl, videoUrl, type } = req.body;
    if (!type || !['image', 'video'].includes(type)) {
      return res.status(400).json({ error: 'type must be "image" or "video"' });
    }
    if (type === 'image' && !imageUrl) {
      return res.status(400).json({ error: 'imageUrl required for image submissions' });
    }
    if (type === 'video' && !videoUrl) {
      return res.status(400).json({ error: 'videoUrl required for video submissions' });
    }
    const url = type === 'image' ? imageUrl : videoUrl;
    if (!String(url).startsWith('https://firebasestorage.googleapis.com/')) {
      return res.status(400).json({ error: 'URL must be a Firebase Storage URL' });
    }
    const data = {
      type,
      source: 'user',
      status: 'pending',
      submittedAt: admin.firestore.FieldValue.serverTimestamp(),
    };
    if (type === 'image') data.imageUrl = String(imageUrl).slice(0, 500);
    if (type === 'video') data.videoUrl = String(videoUrl).slice(0, 500);
    const ref = await admin.firestore().collection('wall_of_cool').add(data);
    return res.json({ id: ref.id });
  } catch (err) {
    console.error('Wall of Cool submission error:', err);
    return res.status(500).json({ error: 'Failed to record submission' });
  }
});

// POST /api/wall-of-cool/admin — admin direct image upload, goes straight to approved
router.post('/admin', requireAdmin, async (req, res) => {
  try {
    const { imageUrl, caption, alt } = req.body;
    if (!imageUrl) return res.status(400).json({ error: 'imageUrl required' });
    if (!String(imageUrl).startsWith('https://firebasestorage.googleapis.com/')) {
      return res.status(400).json({ error: 'imageUrl must be a Firebase Storage URL' });
    }
    // Note: two simultaneous admin uploads could compute the same maxOrder.
    // Acceptable given admin-only usage — no transaction needed at this scale.
    // Find the current max order value so new image is appended
    const snap = await admin.firestore()
      .collection('wall_of_cool')
      .where('status', '==', 'approved')
      .where('type', '==', 'image')
      .get();
    let maxOrder = -1;
    snap.forEach((d) => {
      const o = d.data().order;
      if (typeof o === 'number' && o > maxOrder) maxOrder = o;
    });
    const ref = await admin.firestore().collection('wall_of_cool').add({
      type: 'image',
      source: 'admin',
      status: 'approved',
      imageUrl: String(imageUrl).slice(0, 500),
      caption: String(caption || '').slice(0, 500),
      alt: String(alt || '').slice(0, 200),
      order: maxOrder + 1,
      submittedAt: admin.firestore.FieldValue.serverTimestamp(),
    });
    return res.json({ id: ref.id });
  } catch (err) {
    console.error('Wall of Cool admin upload error:', err);
    return res.status(500).json({ error: 'Failed to create entry' });
  }
});

// PATCH /api/wall-of-cool/reorder — batch update order fields on approved images
// MUST be defined before /:id so Express doesn't treat "reorder" as an id
router.patch('/reorder', requireAdmin, async (req, res) => {
  try {
    const items = req.body; // [{ id, order }, ...]
    if (!Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ error: 'Body must be a non-empty array of { id, order }' });
    }
    if (items.length > 500) {
      return res.status(400).json({ error: 'Reorder payload exceeds Firestore batch limit of 500 items' });
    }
    for (const item of items) {
      if (!item.id || typeof item.order !== 'number') {
        return res.status(400).json({ error: `Invalid item in reorder payload: ${JSON.stringify(item)}` });
      }
    }
    const db = admin.firestore();
    const batch = db.batch();
    for (const item of items) {
      batch.update(db.collection('wall_of_cool').doc(item.id), { order: item.order });
    }
    await batch.commit();
    return res.json({ ok: true });
  } catch (err) {
    console.error('Wall of Cool reorder error:', err);
    return res.status(500).json({ error: 'Failed to reorder' });
  }
});

// PATCH /api/wall-of-cool/:id — approve/reject/reset + optionally set caption, alt, order
router.patch('/:id', requireAdmin, async (req, res) => {
  try {
    const { status, caption, alt, order } = req.body;
    if (status !== undefined && !['approved', 'rejected', 'pending'].includes(status)) {
      return res.status(400).json({ error: 'Invalid status' });
    }
    const update = {};
    if (status !== undefined) update.status = status;
    if (caption !== undefined) update.caption = String(caption).slice(0, 500);
    if (alt !== undefined) update.alt = String(alt).slice(0, 200);
    if (typeof order === 'number') update.order = order;
    if (Object.keys(update).length === 0) {
      return res.status(400).json({ error: 'No valid fields to update' });
    }
    await admin.firestore().collection('wall_of_cool').doc(req.params.id).update(update);
    return res.json({ ok: true });
  } catch (err) {
    console.error('Wall of Cool update error:', err);
    return res.status(500).json({ error: 'Failed to update' });
  }
});

module.exports = router;

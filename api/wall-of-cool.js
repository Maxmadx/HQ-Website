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

// POST /api/wall-of-cool — record a submission after client uploads to Storage
router.post('/', async (req, res) => {
  try {
    const { imageUrl, userName, caption } = req.body;
    if (!imageUrl || !userName) {
      return res.status(400).json({ error: 'imageUrl and userName are required' });
    }
    // Validate it's a Firebase Storage URL
    if (!imageUrl.startsWith('https://firebasestorage.googleapis.com/')) {
      return res.status(400).json({ error: 'imageUrl must be a Firebase Storage URL' });
    }
    const ref = await admin.firestore().collection('wall_of_cool').add({
      imageUrl: String(imageUrl).slice(0, 500),
      userName: String(userName).slice(0, 100),
      caption: String(caption || '').slice(0, 500),
      status: 'pending',
      submittedAt: admin.firestore.FieldValue.serverTimestamp(),
    });
    return res.json({ id: ref.id });
  } catch (err) {
    console.error('Wall of Cool submission error:', err);
    return res.status(500).json({ error: 'Failed to record submission' });
  }
});

// PATCH /api/wall-of-cool/:id — approve or reject
router.patch('/:id', requireAdmin, async (req, res) => {
  try {
    const { status } = req.body;
    if (!['approved', 'rejected', 'pending'].includes(status)) {
      return res.status(400).json({ error: 'Invalid status' });
    }
    await admin.firestore().collection('wall_of_cool').doc(req.params.id).update({ status });
    return res.json({ ok: true });
  } catch (err) {
    console.error('Wall of Cool update error:', err);
    return res.status(500).json({ error: 'Failed to update submission' });
  }
});

module.exports = router;

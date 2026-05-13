'use strict';

const { Router } = require('express');
const { rateLimit, ipKeyGenerator } = require('express-rate-limit');
const admin = require('./firebase-admin');
const logger = require('./lib/logger.js');

const router = Router();

const pressClickLimiter = rateLimit({
  windowMs: 60 * 1000,
  max: 10,
  standardHeaders: true,
  legacyHeaders: false,
  keyGenerator: (req) => ipKeyGenerator(req),
  handler: (_req, res) => res.status(429).json({ error: 'Too many requests' }),
});

// POST /api/press-click
// body: { id: string } — Firestore document ID of the press link
router.post('/', pressClickLimiter, async (req, res) => {
  const { id } = req.body || {};

  if (!id || typeof id !== 'string' || id.length > 100) {
    return res.status(400).json({ error: 'Invalid id' });
  }

  const db = admin.firestore();
  const ref = db.collection('press_links').doc(id);

  try {
    const snap = await ref.get();
    if (!snap.exists) {
      return res.status(404).json({ error: 'Not found' });
    }
    await ref.update({
      clicks: admin.firestore.FieldValue.increment(1),
    });
    return res.json({ ok: true });
  } catch (err) {
    logger.error({ err }, 'press-click error');
    return res.status(500).json({ error: 'Failed to record click' });
  }
});

module.exports = router;

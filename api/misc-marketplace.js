'use strict';

const express = require('express');
const rateLimit = require('express-rate-limit');
const admin = require('./firebase-admin');

const router = express.Router();

const enquiryLimiter = rateLimit({
  windowMs: 10 * 60 * 1000,
  max: 5,
  standardHeaders: true,
  legacyHeaders: false,
  keyGenerator: (req) => req.ip || 'unknown',
  handler: (_req, res) => res.status(429).json({ error: 'Too many requests' }),
});

// POST /api/misc-enquiry — public, rate-limited
router.post('/', enquiryLimiter, async (req, res) => {
  try {
    const { name, email, phone, message, itemId, itemName } = req.body || {};
    if (!name || !email || !itemId || !itemName) {
      return res.status(400).json({ error: 'name, email, itemId, itemName are required' });
    }
    if (!email.includes('@') || email.length < 5) {
      return res.status(400).json({ error: 'Invalid email address' });
    }
    const db = admin.firestore();
    await db.collection('misc_marketplace').add({
      type: 'enquiry',
      status: 'new',
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
      itemId: String(itemId).slice(0, 100),
      itemName: String(itemName).slice(0, 200),
      customerName: String(name).slice(0, 200),
      customerEmail: String(email).slice(0, 200),
      customerPhone: String(phone || '').slice(0, 50),
      message: String(message || '').slice(0, 5000),
    });
    return res.json({ ok: true });
  } catch (err) {
    console.error('[misc-enquiry] error:', err);
    return res.status(500).json({ error: 'Failed to submit enquiry' });
  }
});

module.exports = router;

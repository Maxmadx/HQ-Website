'use strict';

const express = require('express');
const { rateLimit, ipKeyGenerator } = require('express-rate-limit');
const admin = require('./firebase-admin');

const router = express.Router();

// Rate limiter: 5 requests per 10 minutes per IP on the POST endpoint
const leadsLimiter = rateLimit({
  windowMs: 10 * 60 * 1000,
  max: 5,
  standardHeaders: true,
  legacyHeaders: false,
  keyGenerator: (req) => ipKeyGenerator(req),
  handler: (_req, res) => res.status(429).json({ error: 'Too many requests' }),
});

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

// POST /api/leads — public endpoint, captures a new lead
router.post('/', leadsLimiter, async (req, res) => {
  try {
    const { name, email, phone, subject, message, source } = req.body;
    if (!name || !email) {
      return res.status(400).json({ error: 'name and email are required' });
    }
    const db = admin.firestore();
    const ref = await db.collection('leads').add({
      name: String(name).slice(0, 200),
      email: String(email).slice(0, 200),
      phone: String(phone || '').slice(0, 50),
      subject: String(subject || '').slice(0, 300),
      message: String(message || '').slice(0, 5000),
      source: String(source || '').slice(0, 300),
      status: 'new',
      notes: '',
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
      updatedAt: admin.firestore.FieldValue.serverTimestamp(),
    });

    return res.json({ id: ref.id });
  } catch (err) {
    console.error('Lead capture error:', err);
    return res.status(500).json({ error: 'Failed to capture lead' });
  }
});

// PATCH /api/leads/:id — update status or notes
router.patch('/:id', requireAdmin, async (req, res) => {
  try {
    const { status, notes } = req.body;
    const allowed = ['new', 'contacted', 'qualified', 'closed'];
    const update = { updatedAt: admin.firestore.FieldValue.serverTimestamp() };
    if (status !== undefined) {
      if (!allowed.includes(status)) return res.status(400).json({ error: 'Invalid status' });
      update.status = status;
    }
    if (notes !== undefined) update.notes = String(notes).slice(0, 5000);
    await admin.firestore().collection('leads').doc(req.params.id).update(update);
    return res.json({ ok: true });
  } catch (err) {
    console.error('Lead update error:', err);
    return res.status(500).json({ error: 'Failed to update lead' });
  }
});

module.exports = router;

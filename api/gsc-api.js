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
    req.adminUid = decoded.uid;
    next();
  } catch {
    return res.status(401).json({ error: 'Unauthorized' });
  }
}

function dateNDaysAgo(n) {
  const d = new Date(Date.now() - n * 24 * 3600 * 1000);
  return d.toISOString().slice(0, 10);
}

// GET /api/gsc/daily?days=30
router.get('/daily', requireAdmin, async (req, res) => {
  const days = Math.max(1, Math.min(365, parseInt(req.query.days, 10) || 30));
  const since = dateNDaysAgo(days);
  try {
    const snap = await admin.firestore()
      .collection('gsc_daily')
      .where('date', '>=', since)
      .orderBy('date', 'desc')
      .orderBy('clicks', 'desc')
      .limit(20000)
      .get();
    const rows = snap.docs.map((d) => d.data());
    return res.json({ rows, sinceDate: since });
  } catch (err) {
    console.error('[gsc-api] daily error:', err.message);
    return res.status(500).json({ error: 'Failed to load GSC data' });
  }
});

module.exports = router;

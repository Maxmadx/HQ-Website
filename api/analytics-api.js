'use strict';

const express = require('express');
const admin = require('./firebase-admin');

const router = express.Router();

const ALLOWED_TYPES = ['pageview', 'cta_click', 'form_submit', 'image_view'];

// POST /api/analytics
router.post('/', async (req, res) => {
  try {
    const { sessionId, page, eventType, elementId, referrer } = req.body;
    if (!ALLOWED_TYPES.includes(eventType)) {
      return res.status(400).json({ error: 'Invalid eventType' });
    }
    await admin.firestore().collection('page_events').add({
      sessionId: String(sessionId || '').slice(0, 64),
      page: String(page || '').slice(0, 300),
      eventType,
      elementId: elementId ? String(elementId).slice(0, 100) : null,
      referrer: String(referrer || '').slice(0, 300),
      userAgent: String(req.headers['user-agent'] || '').slice(0, 300),
      timestamp: admin.firestore.FieldValue.serverTimestamp(),
    });
    return res.json({ ok: true });
  } catch (err) {
    console.error('Analytics ingest error:', err);
    return res.status(500).json({ error: 'Failed to record event' });
  }
});

module.exports = router;

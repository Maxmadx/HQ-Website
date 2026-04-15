'use strict';

const express = require('express');
const rateLimit = require('express-rate-limit');
const admin = require('./firebase-admin');

const router = express.Router();

const ALLOWED_TYPES = ['pageview', 'cta_click', 'form_submit', 'image_view', 'scroll_depth', 'page_exit'];

// Private / loopback IPs — skip geo lookup for these
const PRIVATE_IP_RE = /^(127\.|::1$|10\.|192\.168\.|172\.(1[6-9]|2\d|3[01])\.)/;

// Rate limiter: 60 requests per IP per minute on the ingest endpoint
const analyticsLimiter = rateLimit({
  windowMs: 60 * 1000,
  max: 60,
  standardHeaders: true,
  legacyHeaders: false,
  keyGenerator: (req) => req.ip || 'unknown',
  handler: (_req, res) => res.status(429).json({ error: 'Too many requests' }),
});

// Resolve IP → country/city using ip-api.com (free, no key, HTTP only)
// Returns null fields on failure — never throws
async function geoLookup(ip) {
  if (!ip || PRIVATE_IP_RE.test(ip)) {
    return { country: null, countryCode: null, city: null };
  }
  try {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), 2000);
    const res = await fetch(
      `http://ip-api.com/json/${ip}?fields=status,country,countryCode,city`,
      { signal: controller.signal }
    );
    clearTimeout(timer);
    if (!res.ok) return { country: null, countryCode: null, city: null };
    const data = await res.json();
    if (data.status !== 'success') return { country: null, countryCode: null, city: null };
    return {
      country: data.country || null,
      countryCode: data.countryCode || null,
      city: data.city || null,
    };
  } catch {
    return { country: null, countryCode: null, city: null };
  }
}

// Auth middleware — same pattern as api/leads.js
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

// GET /api/analytics/config — returns admin-excluded IPs (auth required)
router.get('/config', requireAdmin, (req, res) => {
  const excludedIps = (process.env.ADMIN_IP || '')
    .split(',')
    .map((s) => s.trim())
    .filter(Boolean);
  res.json({ excludedIps });
});

// POST /api/analytics — ingest a tracking event
router.post('/', analyticsLimiter, async (req, res) => {
  try {
    const {
      sessionId, page, eventType, elementId, referrer,
      utmSource, utmMedium, utmCampaign, utmTerm, utmContent,
    } = req.body;

    if (!ALLOWED_TYPES.includes(eventType)) {
      return res.status(400).json({ error: 'Invalid eventType' });
    }

    const ip = req.ip || null;
    const geo = await geoLookup(ip || '');

    await admin.firestore().collection('page_events').add({
      sessionId: String(sessionId || '').slice(0, 64),
      page: String(page || '').slice(0, 300),
      eventType,
      elementId: elementId ? String(elementId).slice(0, 100) : null,
      referrer: String(referrer || '').slice(0, 300),
      userAgent: String(req.headers['user-agent'] || '').slice(0, 300),
      ip,
      country: geo.country,
      countryCode: geo.countryCode,
      city: geo.city,
      utmSource: utmSource ? String(utmSource).slice(0, 100) : null,
      utmMedium: utmMedium ? String(utmMedium).slice(0, 100) : null,
      utmCampaign: utmCampaign ? String(utmCampaign).slice(0, 100) : null,
      utmTerm: utmTerm ? String(utmTerm).slice(0, 100) : null,
      utmContent: utmContent ? String(utmContent).slice(0, 100) : null,
      timestamp: admin.firestore.FieldValue.serverTimestamp(),
    });

    return res.json({ ok: true });
  } catch (err) {
    console.error('Analytics ingest error:', err);
    return res.status(500).json({ error: 'Failed to record event' });
  }
});

module.exports = router;

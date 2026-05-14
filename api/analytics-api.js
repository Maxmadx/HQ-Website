'use strict';

const express = require('express');
const { rateLimit, ipKeyGenerator } = require('express-rate-limit');
const admin = require('./firebase-admin');
const logger = require('./lib/logger.js');
const { truncateIp } = require('./lib/ipTruncate.js');

const router = express.Router();

const ALLOWED_TYPES = [
  'pageview', 'cta_click', 'form_submit', 'image_view', 'scroll_depth', 'page_exit',
  'view_item', 'begin_checkout', 'add_payment_info', 'purchase',
  'share_referral', 'upgrade_completed',
];

// Referral codes use a visually-unambiguous alphabet (see src/lib/referralCodes.js);
// 6–16 chars allows headroom over the current 8-char length without coupling to it.
const REFERRAL_CODE_RE = /^[ABCDEFGHJKLMNPQRSTUVWXYZ23456789]{6,16}$/;

// Private / loopback IPs (IPv4 + IPv6) — skip geo lookup for these
const PRIVATE_IP_RE = /^(127\.|::1$|::ffff:127\.|10\.|192\.168\.|172\.(1[6-9]|2\d|3[01])\.|fc[0-9a-f]{2}:|fd[0-9a-f]{2}:|fe80:)/i;

// Rate limiter: 60 requests per IP per minute on the ingest endpoint
const analyticsLimiter = rateLimit({
  windowMs: 60 * 1000,
  max: 60,
  standardHeaders: true,
  legacyHeaders: false,
  keyGenerator: (req) => ipKeyGenerator(req),
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

// GET /api/analytics/referrals?days=N — referral conversions + referrer names (auth required).
// The referrer-name join needs the Admin SDK, so it lives server-side rather than
// being done client-side in AdminAnalytics.
router.get('/referrals', requireAdmin, async (req, res) => {
  try {
    const days = Math.min(Math.max(parseInt(req.query.days, 10) || 30, 1), 365);
    const since = new Date(Date.now() - days * 86400 * 1000);

    // Bookings made in range that used someone's referral code.
    const snap = await admin.firestore()
      .collection('bookings')
      .where('createdAt', '>=', since)
      .orderBy('createdAt', 'desc')
      .get();

    const friendBookings = [];
    for (const doc of snap.docs) {
      const b = doc.data();
      if (!b.referredByCode) continue;
      friendBookings.push({
        paymentIntentId: doc.id,
        referredByCode: b.referredByCode,
        amountPence: b.totalAmountPence || b.amount || 0,
        createdAt: b.createdAt && typeof b.createdAt.toMillis === 'function' ? b.createdAt.toMillis() : null,
      });
    }

    // Join each distinct code → referral_codes doc → owner's booking for the name.
    const referrers = {};
    const codes = [...new Set(friendBookings.map((f) => f.referredByCode))];
    await Promise.all(codes.map(async (code) => {
      try {
        const codeDoc = await admin.firestore().collection('referral_codes').doc(code).get();
        if (!codeDoc.exists) return;
        const cd = codeDoc.data();
        let name = '';
        if (cd.ownerPaymentIntentId) {
          const ownerSnap = await admin.firestore().collection('bookings').doc(cd.ownerPaymentIntentId).get();
          if (ownerSnap.exists) name = ownerSnap.data().customerName || '';
        }
        referrers[code] = { name, email: cd.ownerEmail || '' };
      } catch {
        // Skip a code we can't resolve — the funnel count still stands.
      }
    }));

    res.json({ friendBookings, referrers });
  } catch (err) {
    logger.error({ err }, 'Analytics referrals query error');
    res.status(500).json({ error: 'Failed to load referral data' });
  }
});

// POST /api/analytics — ingest a tracking event
router.post('/', analyticsLimiter, async (req, res) => {
  try {
    const {
      sessionId, visitorId, page, eventType, elementId, referrer, referralRefCode,
      utmSource, utmMedium, utmCampaign, utmTerm, utmContent,
      items, value, currency, transactionId, itemCategory,
    } = req.body;

    if (!ALLOWED_TYPES.includes(eventType)) {
      return res.status(400).json({ error: 'Invalid eventType' });
    }

    // Full IP is used in-memory for geo lookup only; a truncated form is what
    // gets persisted (GDPR data minimisation).
    const ip = req.ip || null;
    const geo = await geoLookup(ip);
    const storedIp = truncateIp(ip);

    // Referral code: only persist if it matches the code format (alphabet + length).
    // Anything else is junk from a hand-edited URL — drop it silently.
    const safeRefCode = REFERRAL_CODE_RE.test(String(referralRefCode || ''))
      ? String(referralRefCode)
      : null;

    // Items: accept partial data — cap at 20 entries, drop non-object entries
    // and entries whose stringified form is >500 chars. We do NOT reject the
    // whole event; partial ecommerce data is better than no event at all.
    let safeItems = null;
    if (Array.isArray(items)) {
      safeItems = items
        .slice(0, 20)
        .filter((it) => {
          if (!it || typeof it !== 'object' || Array.isArray(it)) return false;
          try {
            return JSON.stringify(it).length <= 500;
          } catch {
            return false;
          }
        });
    }

    await admin.firestore().collection('page_events').add({
      sessionId: String(sessionId || '').slice(0, 64),
      visitorId: visitorId ? String(visitorId).slice(0, 64) : null,
      page: String(page || '').slice(0, 300),
      eventType,
      elementId: elementId ? String(elementId).slice(0, 100) : null,
      referrer: String(referrer || '').slice(0, 300),
      referralRefCode: safeRefCode,
      userAgent: String(req.headers['user-agent'] || '').slice(0, 300),
      ip: storedIp,
      country: geo.country,
      countryCode: geo.countryCode,
      city: geo.city,
      utmSource: utmSource ? String(utmSource).slice(0, 100) : null,
      utmMedium: utmMedium ? String(utmMedium).slice(0, 100) : null,
      utmCampaign: utmCampaign ? String(utmCampaign).slice(0, 100) : null,
      utmTerm: utmTerm ? String(utmTerm).slice(0, 100) : null,
      utmContent: utmContent ? String(utmContent).slice(0, 100) : null,
      items: safeItems,
      value: typeof value === 'number' ? value : null,
      currency: currency ? String(currency).slice(0, 8) : null,
      transactionId: transactionId ? String(transactionId).slice(0, 100) : null,
      itemCategory: itemCategory ? String(itemCategory).slice(0, 64) : null,
      timestamp: admin.firestore.FieldValue.serverTimestamp(),
    });

    return res.json({ ok: true });
  } catch (err) {
    logger.error({ err }, 'Analytics ingest error');
    return res.status(500).json({ error: 'Failed to record event' });
  }
});

module.exports = router;

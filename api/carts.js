'use strict';

const express = require('express');
const crypto = require('crypto');
const { rateLimit, ipKeyGenerator } = require('express-rate-limit');
const admin = require('./firebase-admin');
const { CartUpsertSchema } = require('./lib/cartValidation');
const { repriceCart } = require('./lib/cartPricing');

const router = express.Router();

// Rate limit: 30 writes/min/IP — half of analytics rate
const cartLimiter = rateLimit({
  windowMs: 60 * 1000,
  max: 30,
  standardHeaders: true,
  legacyHeaders: false,
  keyGenerator: (req) => ipKeyGenerator(req),
  handler: (_req, res) => res.status(429).json({ error: 'Too many requests' }),
});

function newRecoveryToken() {
  return crypto.randomBytes(24).toString('base64url');
}

function isAdminEmail(email) {
  if (!email) return false;
  const list = (process.env.ADMIN_EMAIL || '').split(',').map((s) => s.trim().toLowerCase()).filter(Boolean);
  return list.includes(email.toLowerCase());
}

// POST /api/carts — upsert by sessionId
router.post('/', cartLimiter, async (req, res) => {
  try {
    // Honeypot: silently swallow bot submissions (return 200 so they don't retry)
    if (req.body && typeof req.body.company === 'string' && req.body.company.length > 0) {
      return res.json({ ok: true });
    }

    const parsed = CartUpsertSchema.safeParse(req.body);
    if (!parsed.success) {
      return res.status(400).json({ error: 'Invalid payload', details: parsed.error.issues });
    }
    const data = parsed.data;

    const db = admin.firestore();

    // Find existing non-completed cart by sessionId
    const existingSnap = await db.collection('carts')
      .where('sessionId', '==', data.sessionId)
      .where('status', 'in', ['active', 'checkout_initiated', 'abandoned'])
      .limit(1)
      .get();

    // Reprice from server-side pricing (never trust client totals)
    let priced = { flight: null, addons: [], totalP: 0 };
    if (data.flight || (data.addons && data.addons.length)) {
      priced = await repriceCart({ flight: data.flight, addons: data.addons });
    }

    const now = admin.firestore.FieldValue.serverTimestamp();
    const baseFields = {
      sessionId: data.sessionId,
      email: data.email || null,
      emailSource: data.email ? 'typed' : null,
      flight: priced.flight,
      addons: priced.addons,
      fulfilment: data.fulfilment || null,
      shippingAddress: data.shippingAddress || null,
      totalP: priced.totalP,
      currency: 'gbp',
      utm: data.utm || { source: null, medium: null, campaign: null, term: null, content: null },
      referrer: data.referrer || null,
      excludedFromAnalytics: isAdminEmail(data.email),
      lawfulBasis: 'legitimate_interest',
      updatedAt: now,
    };

    if (!existingSnap.empty) {
      const doc = existingSnap.docs[0];
      await doc.ref.set(baseFields, { merge: true });
      return res.json({ ok: true, cartId: doc.id });
    }

    // Create new cart
    const docRef = await db.collection('carts').add({
      ...baseFields,
      status: 'active',
      stripeSessionId: null,
      stripePaymentIntentId: null,
      recoveryToken: newRecoveryToken(),
      recoveryEmailsSent: [],
      noEmail: false,
      countryCode: null,
      createdAt: now,
      completedAt: null,
      abandonedAt: null,
    });

    return res.json({ ok: true, cartId: docRef.id });
  } catch (err) {
    if (err.statusCode === 400) {
      return res.status(400).json({ error: err.message });
    }
    console.error('[carts] upsert error:', err.message);
    return res.status(500).json({ error: 'Failed to upsert cart' });
  }
});

// GET /api/carts/by-token?t=<token> — rehydrate cart from recovery link
router.get('/by-token', async (req, res) => {
  const token = String(req.query.t || '').trim();
  if (!token || token.length < 16) {
    return res.status(400).json({ error: 'Missing or invalid token' });
  }
  try {
    const snap = await admin.firestore()
      .collection('carts')
      .where('recoveryToken', '==', token)
      .limit(1)
      .get();
    if (snap.empty) return res.status(404).json({ error: 'Cart not found' });

    const doc = snap.docs[0];
    const cart = doc.data();

    // Don't resume a completed cart — would re-charge the customer
    if (cart.status === 'completed') {
      return res.status(410).json({ error: 'This booking is already complete' });
    }

    // Return only the rehydration-relevant fields (no PII beyond what's needed)
    return res.json({
      cartId: doc.id,
      email: cart.email || null,
      flight: cart.flight || null,
      addons: cart.addons || [],
      fulfilment: cart.fulfilment || null,
      shippingAddress: cart.shippingAddress || null,
      totalP: cart.totalP || 0,
      currency: cart.currency || 'gbp',
    });
  } catch (err) {
    console.error('[carts] by-token error:', err.message);
    return res.status(500).json({ error: 'Failed to load cart' });
  }
});

module.exports = router;

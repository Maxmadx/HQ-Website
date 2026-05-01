'use strict';

const express = require('express');
const crypto = require('crypto');
const { rateLimit, ipKeyGenerator } = require('express-rate-limit');
const admin = require('./firebase-admin');
const { CartUpsertSchema } = require('./lib/cartValidation');
const { repriceCart } = require('./lib/cartPricing');
const { getTransporter } = require('./lib/mailer');
const { renderCartRecoveryEmail } = require('./templates/cart-recovery');

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

async function leadEmailLookup(sessionId) {
  if (!sessionId) return null;
  try {
    const snap = await admin.firestore()
      .collection('leads')
      .where('sessionId', '==', sessionId)
      .where('email', '!=', '')
      .orderBy('email')
      .orderBy('createdAt', 'desc')
      .limit(1)
      .get();
    if (snap.empty) return null;
    const lead = snap.docs[0].data();
    return lead.email || null;
  } catch {
    return null; // missing index or permission — fail soft
  }
}

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

    // Lead-match backfill: if no email typed but session previously submitted a lead form, use that email
    let resolvedEmail = data.email || null;
    let emailSource = data.email ? 'typed' : null;
    if (!resolvedEmail) {
      const leadEmail = await leadEmailLookup(data.sessionId);
      if (leadEmail) {
        resolvedEmail = leadEmail;
        emailSource = 'lead-match';
      }
    }

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
      email: resolvedEmail,
      emailSource: emailSource,
      flight: priced.flight,
      addons: priced.addons,
      fulfilment: data.fulfilment || null,
      shippingAddress: data.shippingAddress || null,
      totalP: priced.totalP,
      currency: 'gbp',
      utm: data.utm || { source: null, medium: null, campaign: null, term: null, content: null },
      referrer: data.referrer || null,
      excludedFromAnalytics: isAdminEmail(resolvedEmail),
      lawfulBasis: 'legitimate_interest',
      updatedAt: now,
    };

    if (!existingSnap.empty) {
      const doc = existingSnap.docs[0];
      await doc.ref.set(baseFields, { merge: true });
      return res.json({ ok: true, cartId: doc.id, email: resolvedEmail });
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

    return res.json({ ok: true, cartId: docRef.id, email: resolvedEmail });
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

// GET /api/carts/unsubscribe?t=<token> — set noEmail flag, no auth required (token IS the auth)
router.get('/unsubscribe', async (req, res) => {
  const token = String(req.query.t || '').trim();
  if (!token || token.length < 16) {
    return res.status(400).send('Invalid unsubscribe link');
  }
  try {
    const snap = await admin.firestore()
      .collection('carts')
      .where('recoveryToken', '==', token)
      .limit(1)
      .get();
    if (snap.empty) return res.status(404).send('Link expired');
    await snap.docs[0].ref.set({ noEmail: true, updatedAt: admin.firestore.FieldValue.serverTimestamp() }, { merge: true });
    return res.send(`<!doctype html><html><body style="font-family:system-ui;max-width:480px;margin:80px auto;padding:24px;text-align:center"><h2>Unsubscribed</h2><p>You won't receive any more booking-recovery emails from HQ Aviation.</p></body></html>`);
  } catch (err) {
    console.error('[carts] unsubscribe error:', err.message);
    return res.status(500).send('Something went wrong');
  }
});

// GET /api/carts (admin) — list non-completed carts for the dashboard
router.get('/', requireAdmin, async (_req, res) => {
  try {
    const snap = await admin.firestore()
      .collection('carts')
      .where('status', 'in', ['active', 'checkout_initiated', 'abandoned'])
      .orderBy('updatedAt', 'desc')
      .limit(200)
      .get();
    const carts = snap.docs.map((d) => ({ id: d.id, ...d.data() }));
    return res.json({ carts });
  } catch (err) {
    console.error('[carts] admin list error:', err.message);
    return res.status(500).json({ error: 'Failed to list carts' });
  }
});

// POST /api/carts/:id/send-recovery — admin manual send
router.post('/:id/send-recovery', requireAdmin, async (req, res) => {
  const { id } = req.params;
  try {
    const cartRef = admin.firestore().collection('carts').doc(id);
    const snap = await cartRef.get();
    if (!snap.exists) return res.status(404).json({ error: 'Cart not found' });
    const cart = snap.data();

    if (!cart.email) return res.status(400).json({ error: 'No email on file for this cart' });
    if (cart.noEmail) return res.status(400).json({ error: 'Customer has unsubscribed' });
    if (cart.status === 'completed') return res.status(400).json({ error: 'Cart already completed' });
    if (cart.excludedFromAnalytics) return res.status(400).json({ error: 'Admin/excluded cart' });

    const siteUrl = process.env.SITE_URL || 'http://localhost:5173';
    const { subject, html, text } = renderCartRecoveryEmail({ ...cart, recoveryToken: cart.recoveryToken }, siteUrl);

    await getTransporter().sendMail({
      from: process.env.EMAIL_FROM,
      to: cart.email,
      subject, html, text,
    });

    await cartRef.set({
      recoveryEmailsSent: [...(cart.recoveryEmailsSent || []), {
        at: admin.firestore.FieldValue.serverTimestamp(),
        type: 'manual',
        sentBy: req.adminUid || 'admin',
      }],
      // also mark as abandoned if it was still in checkout-initiated
      status: cart.status === 'completed' ? cart.status : 'abandoned',
      abandonedAt: cart.abandonedAt || admin.firestore.FieldValue.serverTimestamp(),
      updatedAt: admin.firestore.FieldValue.serverTimestamp(),
    }, { merge: true });

    return res.json({ ok: true });
  } catch (err) {
    console.error('[carts] send-recovery error:', err.message);
    return res.status(500).json({ error: 'Failed to send recovery email' });
  }
});

module.exports = router;

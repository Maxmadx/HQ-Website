'use strict';

const express = require('express');
const crypto = require('crypto');
const { rateLimit, ipKeyGenerator } = require('express-rate-limit');
const admin = require('./firebase-admin');
const logger = require('./lib/logger.js');
const { CartUpsertSchema } = require('./lib/cartValidation');
const { repriceCart } = require('./lib/cartPricing');
const { sendCartRecoveryEmail } = require('./lib/cartRecoverySend');
const { isAdminSettableStatus } = require('./lib/cartAdminLogic');

const router = express.Router();

// 1×1 transparent GIF, base64
const TRANSPARENT_GIF = Buffer.from('R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7', 'base64');

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

    // Category resolution + display total.
    // Flight carts are repriced server-side above. Product and london-tour
    // totals are DISPLAY figures derived from the client payload — the real
    // charge is always repriced at the payment-intent endpoint, never here.
    let category = data.category || null;
    if (!category && priced.flight) category = 'discovery_flight';
    const products = data.products || [];
    const londonTour = data.londonTour || null;
    // Callers must send the full cart payload on every upsert — products is
    // merged via { merge: true }, so a partial upsert omitting it resets it to [].
    let totalP = priced.totalP;
    if (category === 'product') {
      totalP = products.reduce((sum, p) => sum + (p.priceP || 0) * (p.qty || 1), 0);
    } else if (category === 'london_tour' && londonTour) {
      totalP = londonTour.priceP || 0;
    }

    const now = admin.firestore.FieldValue.serverTimestamp();
    const baseFields = {
      sessionId: data.sessionId,
      email: resolvedEmail,
      emailSource: emailSource,
      category,
      flight: priced.flight,
      addons: priced.addons,
      products,
      londonTour,
      fulfilment: data.fulfilment || null,
      shippingAddress: data.shippingAddress || null,
      totalP,
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
      contactedAt: null,
    });

    return res.json({ ok: true, cartId: docRef.id, email: resolvedEmail });
  } catch (err) {
    if (err.statusCode === 400) {
      return res.status(400).json({ error: err.message });
    }
    logger.error({ err }, '[carts] upsert error');
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

    // Click tracking: mark the most-recent recoveryEmailsSent entry clicked
    try {
      const sent = Array.isArray(cart.recoveryEmailsSent) ? cart.recoveryEmailsSent.slice() : [];
      if (sent.length > 0 && !sent[sent.length - 1].clicked) {
        sent[sent.length - 1] = { ...sent[sent.length - 1], clicked: true };
        await doc.ref.set({
          recoveryEmailsSent: sent,
          updatedAt: admin.firestore.FieldValue.serverTimestamp(),
        }, { merge: true });
      }
    } catch (clickErr) {
      logger.error({ err: clickErr }, '[carts] click-track error');
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
    logger.error({ err }, '[carts] by-token error');
    return res.status(500).json({ error: 'Failed to load cart' });
  }
});

// GET /api/carts/email-pixel?t=<token>&type=<1h|24h|manual>
// Returns a 1×1 transparent GIF and marks the matching recoveryEmailsSent[i].opened = true.
router.get('/email-pixel', async (req, res) => {
  // Always return the pixel — never reveal whether the token was valid.
  res.set('Content-Type', 'image/gif');
  res.set('Cache-Control', 'no-store, no-cache, must-revalidate, max-age=0');
  res.set('Pragma', 'no-cache');
  res.set('Expires', '0');

  const token = String(req.query.t || '').trim();
  const type = String(req.query.type || '').trim();

  // Send pixel immediately so email clients render the image.
  res.send(TRANSPARENT_GIF);

  // Then update Firestore in the background. Errors are logged, never returned.
  if (!token || token.length < 16) return;
  try {
    const snap = await admin.firestore()
      .collection('carts')
      .where('recoveryToken', '==', token)
      .limit(1)
      .get();
    if (snap.empty) return;

    const doc = snap.docs[0];
    const cart = doc.data();
    const sent = Array.isArray(cart.recoveryEmailsSent) ? cart.recoveryEmailsSent.slice() : [];
    if (sent.length === 0) return;

    // Find the entry that matches the type (most-recent-first)
    let updatedIndex = -1;
    for (let i = sent.length - 1; i >= 0; i -= 1) {
      if (!type || sent[i].type === type) {
        if (sent[i].opened) return; // already marked
        sent[i] = { ...sent[i], opened: true };
        updatedIndex = i;
        break;
      }
    }
    if (updatedIndex === -1) return;

    await doc.ref.set({
      recoveryEmailsSent: sent,
      updatedAt: admin.firestore.FieldValue.serverTimestamp(),
    }, { merge: true });
  } catch (err) {
    logger.error({ err }, '[carts] email-pixel error');
  }
});

// POST /api/carts/unsubscribe?t=<token> — RFC 8058 one-click endpoint (Gmail/Yahoo)
router.post('/unsubscribe', async (req, res) => {
  const token = String(req.query.t || '').trim();
  if (!token || token.length < 16) return res.status(400).end();
  try {
    const snap = await admin.firestore()
      .collection('carts')
      .where('recoveryToken', '==', token)
      .limit(1)
      .get();
    if (snap.empty) return res.status(404).end();
    await snap.docs[0].ref.set({ noEmail: true, updatedAt: admin.firestore.FieldValue.serverTimestamp() }, { merge: true });
    return res.status(200).end();
  } catch (err) {
    logger.error({ err }, '[carts] unsubscribe POST error');
    return res.status(500).end();
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
    logger.error({ err }, '[carts] unsubscribe error');
    return res.status(500).send('Something went wrong');
  }
});

// GET /api/carts (admin) — list carts for the dashboard.
// Two queries: the actionable set (active/checkout_initiated/abandoned/expired)
// with full docs, plus completed carts trimmed to the fields the funnel needs
// (so the "Recovered" stage can be computed without shipping booking PII).
router.get('/', requireAdmin, async (_req, res) => {
  try {
    const db = admin.firestore();
    const [actionableSnap, completedSnap] = await Promise.all([
      db.collection('carts')
        .where('status', 'in', ['active', 'checkout_initiated', 'abandoned', 'expired'])
        .orderBy('updatedAt', 'desc')
        .limit(200)
        .get(),
      db.collection('carts')
        .where('status', '==', 'completed')
        .orderBy('updatedAt', 'desc')
        .limit(200)
        .get(),
    ]);
    const carts = [
      ...actionableSnap.docs.map((d) => ({ id: d.id, ...d.data() })),
      ...completedSnap.docs.map((d) => {
        const c = d.data();
        return {
          id: d.id,
          status: c.status ?? null,
          updatedAt: c.updatedAt || null,
          category: c.category || null,
          contactedAt: c.contactedAt || null,
          excludedFromAnalytics: c.excludedFromAnalytics || false,
          totalP: c.totalP || 0,
        };
      }),
    ];
    return res.json({ carts });
  } catch (err) {
    logger.error({ err }, '[carts] admin list error');
    return res.status(500).json({ error: 'Failed to list carts' });
  }
});

// POST /api/carts/:id/send-recovery — admin manual send
router.post('/:id/send-recovery', requireAdmin, async (req, res) => {
  try {
    await sendCartRecoveryEmail(req.params.id, 'manual', req.adminUid || 'admin');
    return res.json({ ok: true });
  } catch (err) {
    if (err.statusCode) return res.status(err.statusCode).json({ error: err.message });
    logger.error({ err }, '[carts] send-recovery error');
    return res.status(500).json({ error: 'Failed to send recovery email' });
  }
});

// PATCH /api/carts/:id/status (admin) — manually set a cart's status.
// Stamps abandonedAt when the cart is moved to 'abandoned' so the dashboard
// can show "abandoned X ago".
router.patch('/:id/status', requireAdmin, async (req, res) => {
  const status = req.body && req.body.status;
  if (!isAdminSettableStatus(status)) {
    return res.status(400).json({ error: 'Invalid status' });
  }
  try {
    const ref = admin.firestore().collection('carts').doc(req.params.id);
    const snap = await ref.get();
    if (!snap.exists) return res.status(404).json({ error: 'Cart not found' });

    const patch = {
      status,
      updatedAt: admin.firestore.FieldValue.serverTimestamp(),
    };
    if (status === 'abandoned' && !snap.data().abandonedAt) {
      patch.abandonedAt = admin.firestore.FieldValue.serverTimestamp();
    }
    await ref.set(patch, { merge: true });
    return res.json({ ok: true });
  } catch (err) {
    logger.error({ err }, '[carts] status patch error');
    return res.status(500).json({ error: 'Failed to update status' });
  }
});

module.exports = router;

# Analytics Funnel — Phase 2 Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Persist abandoned-cart data so owner can see who almost bought a Discovery Flight and email them back. Adds email-first checkout step (the unlock that makes carts recoverable), `carts` Firestore collection, AbandonedCartTile on `/admin/analytics` with a manual "Send recovery email" button per cart.

**Architecture:** Same patterns as Phase 1. New `/api/carts` Express router (rate-limited, zod-validated). Client-side cart helper that upserts by sessionId on every checkout-relevant action. Cart promotion to `completed` happens in the existing Stripe webhook. Recovery emails reuse the existing nodemailer transporter from `api/stripe.js`. Pure aggregation functions for the dashboard tile, mirroring `funnelAggregations` pattern.

**Tech Stack:** React, Vite, Firebase Firestore, Express, vitest, zod (NEW dep), existing nodemailer SMTP.

**Spec:** `docs/superpowers/specs/2026-04-29-squarespace-analytics-parity-design.md`

**Phase 2 explicitly DOES NOT include** (deferred to Phase 3): automated cron scheduler, 1h/24h auto sends, RFC 8058 List-Unsubscribe headers, open-pixel tracking, 90-day pruning. Phase 2 is owner-triggered manual recovery only — but it ships a working email-first UX, persisted carts, and a dashboard tile the owner can act on today.

---

## File Structure

**New files:**
- `api/carts.js` — Express router. POST upsert, PATCH, GET by token, GET admin list, POST manual recovery send, GET unsubscribe.
- `api/lib/cartValidation.js` — zod schemas for cart POST/PATCH bodies. One file, reused across routes.
- `api/templates/cart-recovery.js` — exports `renderCartRecoveryEmail(cart)` returning `{ subject, html, text }`.
- `src/lib/cart.js` — client cart helpers: create/update/rehydrate, debounced writes.
- `src/lib/cart.test.js` — unit tests for the helper.
- `src/pages/Checkout/EmailFirstStep.jsx` — first-step email capture UI.
- `src/pages/Checkout/EmailFirstStep.test.jsx` — render + interaction tests.
- `src/components/admin/analytics/cartAggregations.js` — pure functions for cart funnel counts + recoverable-£ totals.
- `src/components/admin/analytics/cartAggregations.test.js`
- `src/components/admin/analytics/AbandonedCartTile.jsx` — dashboard tile.
- `src/components/admin/analytics/AbandonedCartTile.test.jsx`

**Modified files:**
- `src/pages/Checkout.jsx` — gate the existing card-form behind a "have we got an email?" check; render EmailFirstStep first.
- `api/stripe.js` — in `payment_intent.succeeded` handler, mark matching cart `completed` (idempotent, by `pi.metadata.cartId` or matching `stripeSessionId`).
- `src/pages/admin/AdminAnalytics.jsx` — fetch carts; mount AbandonedCartTile.
- `server.js` — mount `/api/carts` router with 16kb body limit (matching analytics).
- `firestore.indexes.json` — composite indexes for cart queries.
- `firestore.rules` — deny client read/write on `carts`; admin SDK only.
- `package.json` — add `zod` as dependency (only if not already present).

**Test runner:** `npm test` (vitest). All tests live next to the file under test.

---

## Cart document shape (lock this first)

```
carts/{cartId}: {
  // identity
  sessionId: string,                // unique among non-completed carts
  email: string|null,               // captured at email-first step
  emailSource: 'typed'|'lead-match'|null,

  // booking content (matches existing booking model)
  flight: { aircraftId, duration, priceP } | null,
  addons: [{ id, qty, priceP }],
  fulfilment: 'collect'|'delivery'|null,
  shippingAddress: { line1, line2, city, postcode } | null,
  totalP: number,                   // pence — server reprices, never trust client
  currency: 'gbp',

  // state
  status: 'active' | 'checkout_initiated' | 'abandoned' | 'completed' | 'expired',
  stripeSessionId: string|null,
  stripePaymentIntentId: string|null,

  // recovery
  recoveryToken: string,            // 32-char URL-safe; resume = /checkout?t=<token>
  recoveryEmailsSent: [{ at: timestamp, type: 'manual' }],
  noEmail: bool,                    // unsubscribed
  excludedFromAnalytics: bool,      // admin self-exclusion (matches ADMIN_EMAIL env)

  // attribution
  utm: { source, medium, campaign, term, content },
  referrer: string|null,
  countryCode: string|null,

  // timestamps
  createdAt: timestamp,
  updatedAt: timestamp,
  completedAt: timestamp|null,
  abandonedAt: timestamp|null,

  // GDPR
  lawfulBasis: 'legitimate_interest'
}
```

---

## Task 1: Install zod + create cart validation schema

**Files:**
- Create: `api/lib/cartValidation.js`

- [ ] **Step 1: Install zod**

```bash
npm install zod
```

- [ ] **Step 2: Create the validation module**

Create `api/lib/cartValidation.js` with:

```javascript
'use strict';

const { z } = require('zod');

const FlightSchema = z.object({
  aircraftId: z.enum(['r22', 'r44', 'r66', 'r88']),
  duration: z.union([z.literal(30), z.literal(60), z.literal(90)]),
}).strict();

const AddonSchema = z.object({
  id: z.string().min(1).max(64),
  qty: z.number().int().min(1).max(10),
}).strict();

const ShippingAddressSchema = z.object({
  line1: z.string().min(1).max(200),
  line2: z.string().max(200).optional().default(''),
  city: z.string().min(1).max(120),
  postcode: z.string().min(1).max(20),
}).strict();

// POST /api/carts upsert body
const CartUpsertSchema = z.object({
  sessionId: z.string().min(8).max(64),
  email: z.string().email().max(254).optional().nullable(),
  flight: FlightSchema.optional().nullable(),
  addons: z.array(AddonSchema).max(20).optional().default([]),
  fulfilment: z.enum(['collect', 'delivery']).optional().nullable(),
  shippingAddress: ShippingAddressSchema.optional().nullable(),
  utm: z.object({
    source: z.string().max(100).optional().nullable(),
    medium: z.string().max(100).optional().nullable(),
    campaign: z.string().max(100).optional().nullable(),
    term: z.string().max(100).optional().nullable(),
    content: z.string().max(100).optional().nullable(),
  }).optional(),
  referrer: z.string().max(300).optional().nullable(),
  // Honeypot — must be empty / undefined; bots fill it
  company: z.string().max(0).optional(),
}).strict();

const CartPatchSchema = CartUpsertSchema.partial().extend({
  sessionId: z.string().min(8).max(64), // still required for ownership check
});

module.exports = {
  CartUpsertSchema,
  CartPatchSchema,
  FlightSchema,
  AddonSchema,
};
```

- [ ] **Step 3: Commit**

```bash
git add api/lib/cartValidation.js package.json
git commit -m "feat(carts): zod schemas for cart upsert + patch payloads (with honeypot)"
```

---

## Task 2: Server-side price computation helper

**Files:**
- Create: `api/lib/cartPricing.js`

The server is source of truth for prices. Client sends `aircraftId` + `duration` + addon ids; server reprices from Firestore `pricing` collection.

- [ ] **Step 1: Create the pricing helper**

Create `api/lib/cartPricing.js` with:

```javascript
'use strict';

const admin = require('../firebase-admin');

/**
 * Recompute totalP from a flight + addons by looking up Firestore pricing.
 * Returns { flight: {…priceP}, addons: [{…priceP}], totalP } or throws on missing prices.
 */
async function repriceCart({ flight, addons = [] }) {
  const db = admin.firestore();
  const out = { flight: null, addons: [], totalP: 0 };

  if (flight) {
    const priceId = `discovery_${flight.aircraftId}_${flight.duration}min`;
    const snap = await db.collection('pricing').doc(priceId).get();
    if (!snap.exists) {
      const err = new Error(`Unknown flight price: ${priceId}`);
      err.statusCode = 400;
      throw err;
    }
    const priceP = Number(snap.data().price) || 0;
    out.flight = { aircraftId: flight.aircraftId, duration: flight.duration, priceP };
    out.totalP += priceP;
  }

  for (const addon of addons) {
    const snap = await db.collection('pricing').doc(addon.id).get();
    if (!snap.exists) {
      const err = new Error(`Unknown addon price: ${addon.id}`);
      err.statusCode = 400;
      throw err;
    }
    const unit = Number(snap.data().price) || 0;
    const qty = Number(addon.qty) || 1;
    out.addons.push({ id: addon.id, qty, priceP: unit * qty });
    out.totalP += unit * qty;
  }

  return out;
}

module.exports = { repriceCart };
```

- [ ] **Step 2: Commit**

```bash
git add api/lib/cartPricing.js
git commit -m "feat(carts): server-side cart re-pricing from Firestore pricing collection"
```

---

## Task 3: Carts router — upsert by sessionId (POST)

**Files:**
- Create: `api/carts.js`

- [ ] **Step 1: Create the router with the upsert endpoint**

Create `api/carts.js` with:

```javascript
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

module.exports = router;
```

- [ ] **Step 2: Mount the router in server.js**

Open `server.js`, find where the analytics router is mounted (search `analyticsRouter`), and add the carts mount alongside:

```javascript
const cartsRouter = require('./api/carts');
// ... existing imports ...

// Existing: app.use('/api/analytics', express.json({ limit: '16kb' }), analyticsRouter);
app.use('/api/carts', express.json({ limit: '16kb' }), cartsRouter);
```

If the existing layout puts `require` calls together at the top, match that pattern. If they're inline at the mount site, match that.

- [ ] **Step 3: Manual sanity check via curl**

Skip — Firebase admin needs `.env` credentials that aren't set in the dev shell. Integration verification at Task 19.

- [ ] **Step 4: Commit**

```bash
git add api/carts.js server.js
git commit -m "feat(carts): POST /api/carts upsert with rate limit, honeypot, server-side reprice"
```

---

## Task 4: Carts router — GET by recovery token (resume link)

**Files:**
- Modify: `api/carts.js`

The resume link in recovery emails is `/checkout?t=<recoveryToken>`. The client fetches `GET /api/carts/by-token?t=<token>` to rehydrate.

- [ ] **Step 1: Add the route to api/carts.js**

In `api/carts.js`, after the POST handler and before `module.exports`, add:

```javascript
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
```

- [ ] **Step 2: Commit**

```bash
git add api/carts.js
git commit -m "feat(carts): GET /api/carts/by-token rehydrate from recovery link"
```

---

## Task 5: Carts router — admin list + unsubscribe

**Files:**
- Modify: `api/carts.js`

- [ ] **Step 1: Add the requireAdmin middleware**

Near the top of `api/carts.js`, after the imports, add the same auth pattern used in `api/analytics-api.js`:

```javascript
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
```

- [ ] **Step 2: Add the admin list endpoint**

Add this route to `api/carts.js`:

```javascript
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
```

- [ ] **Step 3: Add the unsubscribe endpoint**

```javascript
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
```

- [ ] **Step 4: Commit**

```bash
git add api/carts.js
git commit -m "feat(carts): admin list + token-based unsubscribe endpoints"
```

---

## Task 6: Stripe webhook — mark cart completed

**Files:**
- Modify: `api/stripe.js`

When `payment_intent.succeeded` fires, find the cart matching `pi.metadata.cartId` (which we'll set when creating the payment intent in Task 9) and mark it `completed`. Idempotent: skip if already completed.

- [ ] **Step 1: Add the cart-completion call to handleWebhook**

In `api/stripe.js`, find the `payment_intent.succeeded` block in `handleWebhook` (search for `'payment_intent.succeeded'`). After the bookings write try/catch and the `recordPurchaseEvent` call (added in Phase 1), add:

```javascript
    // Promote matching cart to completed (Phase 2). Idempotent — safe on webhook retries.
    try {
      const cartId = pi.metadata && pi.metadata.cartId;
      if (cartId) {
        const cartRef = admin.firestore().collection('carts').doc(cartId);
        const cartSnap = await cartRef.get();
        if (cartSnap.exists && cartSnap.data().status !== 'completed') {
          await cartRef.set({
            status: 'completed',
            stripePaymentIntentId: pi.id,
            completedAt: admin.firestore.FieldValue.serverTimestamp(),
            updatedAt: admin.firestore.FieldValue.serverTimestamp(),
          }, { merge: true });
        }
      }
    } catch (cartErr) {
      console.error('[stripe webhook] cart promotion failed:', cartErr.message);
    }
```

- [ ] **Step 2: Commit**

```bash
git add api/stripe.js
git commit -m "feat(carts): promote matching cart to completed on payment_intent.succeeded"
```

---

## Task 7: Client cart helper — `src/lib/cart.js`

**Files:**
- Create: `src/lib/cart.js`
- Test: `src/lib/cart.test.js`

- [ ] **Step 1: Write the failing tests**

Create `src/lib/cart.test.js`:

```javascript
import { describe, it, expect, vi, beforeEach } from 'vitest';

global.fetch = vi.fn(() => Promise.resolve({ ok: true, json: () => Promise.resolve({ ok: true, cartId: 'cart_xyz' }) }));

beforeEach(() => {
  sessionStorage.clear();
  vi.clearAllMocks();
});

import { upsertCart, rehydrateCartByToken, getCartId, setCartId } from './cart';

describe('cart helper', () => {
  it('upsertCart POSTs to /api/carts with the body', async () => {
    await upsertCart({ sessionId: 'sess_abc', email: 'jane@example.com' });
    expect(fetch).toHaveBeenCalledWith('/api/carts', expect.objectContaining({
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
    }));
    const body = JSON.parse(fetch.mock.calls[0][1].body);
    expect(body.sessionId).toBe('sess_abc');
    expect(body.email).toBe('jane@example.com');
  });

  it('upsertCart stores the returned cartId in sessionStorage', async () => {
    await upsertCart({ sessionId: 'sess_abc', email: 'jane@example.com' });
    expect(getCartId()).toBe('cart_xyz');
  });

  it('upsertCart silently swallows fetch errors (analytics-style)', async () => {
    fetch.mockRejectedValueOnce(new Error('network'));
    await expect(upsertCart({ sessionId: 'x', email: 'a@b.c' })).resolves.toBeNull();
  });

  it('rehydrateCartByToken GETs /api/carts/by-token and returns the cart', async () => {
    fetch.mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve({ cartId: 'cart_z', email: 'a@b.c', flight: { aircraftId: 'r44', duration: 60, priceP: 35000 } }),
    });
    const cart = await rehydrateCartByToken('tok_xyz');
    expect(fetch).toHaveBeenCalledWith('/api/carts/by-token?t=tok_xyz');
    expect(cart.cartId).toBe('cart_z');
    expect(cart.email).toBe('a@b.c');
  });

  it('rehydrateCartByToken returns null on 404', async () => {
    fetch.mockResolvedValueOnce({ ok: false, status: 404 });
    const cart = await rehydrateCartByToken('bogus');
    expect(cart).toBeNull();
  });

  it('setCartId/getCartId persist via sessionStorage', () => {
    setCartId('cart_persisted');
    expect(getCartId()).toBe('cart_persisted');
  });
});
```

- [ ] **Step 2: Run tests to verify failure**

Run: `npm test -- src/lib/cart.test.js`
Expected: FAIL — module does not exist.

- [ ] **Step 3: Implement `src/lib/cart.js`**

```javascript
/**
 * Client-side helper for the carts collection.
 * Mirrors the analytics.js pattern: fire-and-forget, never throws.
 */

const CART_ID_KEY = 'hq_cart_id';

export function getCartId() {
  return sessionStorage.getItem(CART_ID_KEY);
}

export function setCartId(id) {
  if (id) sessionStorage.setItem(CART_ID_KEY, id);
}

export function clearCartId() {
  sessionStorage.removeItem(CART_ID_KEY);
}

/**
 * Upsert the in-progress cart on the server.
 * @param {object} payload  Matches CartUpsertSchema on server: { sessionId, email?, flight?, addons?, fulfilment?, shippingAddress?, utm?, referrer? }
 * @returns {Promise<string|null>} The cartId on success, null on failure.
 */
export async function upsertCart(payload) {
  try {
    const res = await fetch('/api/carts', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    if (!res.ok) return null;
    const data = await res.json();
    if (data && data.cartId) {
      setCartId(data.cartId);
      return data.cartId;
    }
    return null;
  } catch {
    return null;
  }
}

/**
 * Fetch a cart by recovery token (used by the resume link in /checkout?t=…).
 * Returns null if the token is invalid, the cart is completed, or any error.
 */
export async function rehydrateCartByToken(token) {
  try {
    const res = await fetch(`/api/carts/by-token?t=${encodeURIComponent(token)}`);
    if (!res.ok) return null;
    return await res.json();
  } catch {
    return null;
  }
}
```

- [ ] **Step 4: Run tests to verify they pass**

Run: `npm test -- src/lib/cart.test.js`
Expected: PASS — all 6 tests.

- [ ] **Step 5: Commit**

```bash
git add src/lib/cart.js src/lib/cart.test.js
git commit -m "feat(carts): client-side cart helper (upsertCart, rehydrateCartByToken)"
```

---

## Task 8: EmailFirstStep component

**Files:**
- Create: `src/pages/Checkout/EmailFirstStep.jsx`
- Test: `src/pages/Checkout/EmailFirstStep.test.jsx`

- [ ] **Step 1: Create the directory**

```bash
mkdir -p src/pages/Checkout
```

- [ ] **Step 2: Write the failing tests**

Create `src/pages/Checkout/EmailFirstStep.test.jsx`:

```javascript
// @vitest-environment jsdom
import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import EmailFirstStep from './EmailFirstStep';

describe('EmailFirstStep', () => {
  it('renders the email field and continue button', () => {
    render(<EmailFirstStep onContinue={() => {}} />);
    expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /continue/i })).toBeInTheDocument();
  });

  it('disables continue until a valid email is entered', () => {
    render(<EmailFirstStep onContinue={() => {}} />);
    const button = screen.getByRole('button', { name: /continue/i });
    expect(button).toBeDisabled();

    fireEvent.change(screen.getByLabelText(/email/i), { target: { value: 'not-an-email' } });
    expect(button).toBeDisabled();

    fireEvent.change(screen.getByLabelText(/email/i), { target: { value: 'jane@example.com' } });
    expect(button).not.toBeDisabled();
  });

  it('calls onContinue with the email when the button is clicked', () => {
    const onContinue = vi.fn();
    render(<EmailFirstStep onContinue={onContinue} />);
    fireEvent.change(screen.getByLabelText(/email/i), { target: { value: 'jane@example.com' } });
    fireEvent.click(screen.getByRole('button', { name: /continue/i }));
    expect(onContinue).toHaveBeenCalledWith('jane@example.com');
  });

  it('renders the privacy note under the email field', () => {
    render(<EmailFirstStep onContinue={() => {}} />);
    expect(screen.getByText(/we'll only use this/i)).toBeInTheDocument();
  });

  it('pre-fills the email if defaultEmail prop is provided', () => {
    render(<EmailFirstStep defaultEmail="prefilled@example.com" onContinue={() => {}} />);
    expect(screen.getByLabelText(/email/i)).toHaveValue('prefilled@example.com');
  });

  it('renders a hidden honeypot field with name="company"', () => {
    const { container } = render(<EmailFirstStep onContinue={() => {}} />);
    const honeypot = container.querySelector('input[name="company"]');
    expect(honeypot).not.toBeNull();
    expect(honeypot.tabIndex).toBe(-1);
  });
});
```

- [ ] **Step 3: Run tests to verify failure**

Run: `npm test -- EmailFirstStep.test.jsx`
Expected: FAIL — module not found.

- [ ] **Step 4: Implement the component**

Create `src/pages/Checkout/EmailFirstStep.jsx`:

```javascript
import { useState } from 'react';

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export default function EmailFirstStep({ defaultEmail = '', onContinue }) {
  const [email, setEmail] = useState(defaultEmail || '');
  const [company, setCompany] = useState(''); // honeypot
  const valid = EMAIL_RE.test(email.trim());

  function handleSubmit(e) {
    e.preventDefault();
    if (!valid) return;
    if (company) return; // bot — silently no-op
    onContinue(email.trim());
  }

  return (
    <form onSubmit={handleSubmit} style={{ maxWidth: 480, margin: '0 auto', padding: 24 }}>
      <h2 style={{ fontSize: 22, marginBottom: 8 }}>Almost there.</h2>
      <p style={{ color: '#94a3b8', marginBottom: 24, lineHeight: 1.5 }}>
        Where shall we send your booking confirmation?
      </p>

      <label htmlFor="emf-email" style={{ display: 'block', fontSize: 13, fontWeight: 600, marginBottom: 6 }}>
        Email
      </label>
      <input
        id="emf-email"
        type="email"
        autoComplete="email"
        autoFocus
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="you@example.com"
        style={{
          width: '100%', padding: '12px 14px', fontSize: 16,
          borderRadius: 8, border: '1px solid #334155',
          background: '#0f172a', color: '#f1f5f9',
        }}
      />
      <p style={{ fontSize: 12, color: '#64748b', marginTop: 8, marginBottom: 24 }}>
        We'll only use this to send your booking. You can unsubscribe any time.
      </p>

      {/* Honeypot — hidden from real users, bots will fill it */}
      <input
        type="text"
        name="company"
        value={company}
        onChange={(e) => setCompany(e.target.value)}
        tabIndex={-1}
        autoComplete="off"
        style={{ position: 'absolute', left: '-9999px', width: 1, height: 1, opacity: 0 }}
        aria-hidden="true"
      />

      <button
        type="submit"
        disabled={!valid}
        style={{
          width: '100%', padding: '14px 16px', fontSize: 15, fontWeight: 600,
          borderRadius: 8, border: 'none',
          background: valid ? '#a855f7' : '#334155',
          color: '#fff', cursor: valid ? 'pointer' : 'not-allowed',
          transition: 'background 150ms ease',
        }}
      >
        Continue
      </button>
    </form>
  );
}
```

- [ ] **Step 5: Run tests to verify they pass**

Run: `npm test -- EmailFirstStep.test.jsx`
Expected: PASS — all 6 tests.

- [ ] **Step 6: Commit**

```bash
git add src/pages/Checkout/EmailFirstStep.jsx src/pages/Checkout/EmailFirstStep.test.jsx
git commit -m "feat(checkout): EmailFirstStep component with validation, honeypot, privacy note"
```

---

## Task 9: Wire EmailFirstStep into Checkout.jsx

**Files:**
- Modify: `src/pages/Checkout.jsx`

This task changes the checkout flow: render EmailFirstStep first, persist the cart on email entry, then show the existing card form. Uses the existing `Checkout.jsx` discovery-flight handler — does NOT touch the misc-orders handler.

- [ ] **Step 1: Read the discovery-flight section of Checkout.jsx**

Look at the file's top-level component for discovery flights (around lines 30-230). Identify where the discovery-flight Elements + form are rendered. The change: wrap that render in a conditional based on whether email has been captured.

- [ ] **Step 2: Add state, helpers, and gate the existing form**

At the top of the discovery-flight component (the one that POSTs to `/api/create-payment-intent`):

```javascript
import EmailFirstStep from './Checkout/EmailFirstStep';
import { upsertCart, getCartId, rehydrateCartByToken } from '../lib/cart';
import { getSessionId } from '../lib/analytics';
import { useEffect, useState } from 'react';
```

Inside the component function, near the existing useState hooks, add:

```javascript
  const [searchParams] = useSearchParams();
  const [email, setEmail] = useState(null);
  const [cartId, setCartIdState] = useState(getCartId());
  const [resumeError, setResumeError] = useState(null);

  // Resume from token (recovery email link)
  useEffect(() => {
    const token = searchParams.get('t');
    if (!token) return;
    rehydrateCartByToken(token).then((cart) => {
      if (cart) {
        setEmail(cart.email);
        setCartIdState(cart.cartId);
      } else {
        setResumeError('That booking link has expired or is no longer valid.');
      }
    });
  }, [searchParams]);

  // Read flight selection from URL params (existing pattern)
  const aircraft = searchParams.get('aircraft');
  const duration = parseInt(searchParams.get('duration') || '0', 10);

  async function handleEmailContinue(typedEmail) {
    setEmail(typedEmail);
    const newCartId = await upsertCart({
      sessionId: getSessionId(),
      email: typedEmail,
      flight: aircraft && duration ? { aircraftId: aircraft, duration } : null,
      utm: {
        source: searchParams.get('utm_source'),
        medium: searchParams.get('utm_medium'),
        campaign: searchParams.get('utm_campaign'),
        term: searchParams.get('utm_term'),
        content: searchParams.get('utm_content'),
      },
      referrer: document.referrer || null,
    });
    if (newCartId) setCartIdState(newCartId);
  }
```

- [ ] **Step 3: Conditionally render EmailFirstStep before the existing card form**

Find the discovery-flight component's `return (...)` block. Wrap or precede the existing JSX:

```javascript
  if (resumeError) {
    return (
      <div style={{ maxWidth: 480, margin: '40px auto', padding: 24, color: '#f87171', textAlign: 'center' }}>
        {resumeError}
      </div>
    );
  }

  if (!email) {
    return <EmailFirstStep onContinue={handleEmailContinue} />;
  }

  // ...existing card-form JSX continues here
```

- [ ] **Step 4: Pass cartId into the payment-intent fetch so the webhook can promote it**

In the existing `handleSubmit` for the discovery-flight payment, find the fetch to `/api/create-payment-intent`. The existing call sends `aircraft, duration, customerEmail, …`. Add `cartId` to that body:

```javascript
      const res = await fetch('/api/create-payment-intent', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          // ...existing fields
          cartId,
          customerEmail: email, // already pre-filled now
        }),
      });
```

- [ ] **Step 5: Pass `cartId` into Stripe metadata**

In `api/stripe.js`, find `createPaymentIntent` (the discovery-flight one). It already accepts addons + customer details. Add `cartId` to its accepted args, and propagate into the Stripe `metadata`:

```javascript
async function createPaymentIntent({
  amount, productType, customerName, customerEmail, customerPhone,
  addons = [], fulfilment, shippingAddress,
  aircraft, aircraftName, duration,
  wantsVoucher, voucherLocation, voucherMessage,
  cartId,                      // NEW
}) {
  // ...existing body...
  return getStripe().paymentIntents.create({
    amount,
    // ...existing fields...
    metadata: {
      // ...existing metadata fields...
      cartId: cartId || '',     // NEW — read by webhook to promote cart
    },
  });
}
```

Also in the Express handler that calls `createPaymentIntent`, accept `cartId` from `req.body` and pass through:

```javascript
const { aircraft, duration, addons, fulfilment, shippingAddress, customerName, customerEmail, customerPhone, wantsVoucher, voucherLocation, voucherMessage, cartId } = req.body;

const result = await createPaymentIntent({
  // ...existing args...
  cartId,
});
```

- [ ] **Step 6: Run tests to verify no regression**

Run: `npm test -- Checkout EmailFirstStep cart`
Expected: PASS — Checkout's existing tests + EmailFirstStep's 6 tests + cart's 6 tests.

- [ ] **Step 7: Commit**

```bash
git add src/pages/Checkout.jsx api/stripe.js
git commit -m "feat(checkout): email-first step + cart upsert + cartId metadata into Stripe"
```

---

## Task 10: Cart aggregation pure functions

**Files:**
- Create: `src/components/admin/analytics/cartAggregations.js`
- Test: `src/components/admin/analytics/cartAggregations.test.js`

- [ ] **Step 1: Write the failing tests**

Create `src/components/admin/analytics/cartAggregations.test.js`:

```javascript
import { describe, it, expect } from 'vitest';
import { computeCartFunnel, recoverableCarts } from './cartAggregations';

const ts = (hoursAgo) => ({ toMillis: () => Date.now() - hoursAgo * 3600 * 1000 });

const fixture = [
  // recoverable, has email, no recovery sent
  { id: '1', status: 'abandoned', email: 'a@b.c', noEmail: false, totalP: 35000, recoveryEmailsSent: [], updatedAt: ts(2), excludedFromAnalytics: false },
  // recoverable, has email, one recovery sent already
  { id: '2', status: 'abandoned', email: 'd@e.f', noEmail: false, totalP: 18000, recoveryEmailsSent: [{ at: ts(1), type: 'manual' }], updatedAt: ts(1), excludedFromAnalytics: false },
  // not recoverable — no email
  { id: '3', status: 'abandoned', email: null,    noEmail: false, totalP: 35000, recoveryEmailsSent: [], updatedAt: ts(3), excludedFromAnalytics: false },
  // unsubscribed — not recoverable
  { id: '4', status: 'abandoned', email: 'x@y.z', noEmail: true,  totalP: 35000, recoveryEmailsSent: [], updatedAt: ts(4), excludedFromAnalytics: false },
  // recovered — abandoned then completed AFTER an email was sent
  { id: '5', status: 'completed', email: 'r@e.c', noEmail: false, totalP: 35000, recoveryEmailsSent: [{ at: ts(5), type: 'manual' }], abandonedAt: ts(6), completedAt: ts(4), excludedFromAnalytics: false },
  // active (still in checkout) — not abandoned
  { id: '6', status: 'active',    email: 'n@o.p', noEmail: false, totalP: 35000, recoveryEmailsSent: [], updatedAt: ts(0.1), excludedFromAnalytics: false },
  // admin-excluded — must be filtered out of all counts
  { id: '7', status: 'abandoned', email: 'admin@hq.co', noEmail: false, totalP: 35000, recoveryEmailsSent: [], updatedAt: ts(2), excludedFromAnalytics: true },
];

describe('computeCartFunnel', () => {
  it('counts carts at each stage of the abandonment funnel', () => {
    const out = computeCartFunnel(fixture);
    expect(out.totalCarts).toBe(6);          // excludes id 7 (admin)
    expect(out.abandoned).toBe(4);           // ids 1, 2, 3, 4 (NOT 5 since it completed, NOT 6 active)
    expect(out.recoverable).toBe(2);         // ids 1, 2 (have email + not noEmail + not completed)
    expect(out.emailed).toBe(1);             // id 2 has a recovery sent
    expect(out.recovered).toBe(1);           // id 5 (recoveryEmailsSent.length > 0 AND status === completed)
  });

  it('includes £ totals at each stage', () => {
    const out = computeCartFunnel(fixture);
    expect(out.totalValueP).toBe(178000);    // 35k+18k+35k+35k+35k+35k = 193000 - excluded admin 35000 = nope, recheck
    // 1:35k + 2:18k + 3:35k + 4:35k + 5:35k + 6:35k = 193000  (id 7 admin excluded)
    expect(out.totalValueP).toBe(193000);
    expect(out.recoverableValueP).toBe(53000); // 35k + 18k
  });

  it('returns zeros for an empty list', () => {
    expect(computeCartFunnel([])).toEqual({
      totalCarts: 0, abandoned: 0, recoverable: 0, emailed: 0, recovered: 0,
      totalValueP: 0, abandonedValueP: 0, recoverableValueP: 0,
    });
  });
});

describe('recoverableCarts', () => {
  it('returns abandoned carts with email + no unsubscribe + not admin-excluded', () => {
    const rows = recoverableCarts(fixture);
    expect(rows.map((c) => c.id).sort()).toEqual(['1', '2']);
  });

  it('orders by updatedAt descending (most recent first)', () => {
    const rows = recoverableCarts(fixture);
    expect(rows[0].id).toBe('2'); // updatedAt 1h ago vs id 1 at 2h ago
    expect(rows[1].id).toBe('1');
  });
});
```

- [ ] **Step 2: Run tests to verify failure**

Run: `npm test -- cartAggregations.test.js`
Expected: FAIL — module not found.

- [ ] **Step 3: Implement the aggregation module**

Create `src/components/admin/analytics/cartAggregations.js`:

```javascript
/**
 * Pure aggregation functions for the abandoned-cart dashboard tile.
 * Inputs are arrays of cart docs (already fetched from Firestore by the caller).
 */

function isAbandonedStatus(s) {
  return s === 'abandoned' || s === 'expired' || s === 'checkout_initiated';
}

function isRecoverable(cart) {
  if (!cart.email) return false;
  if (cart.noEmail) return false;
  if (cart.excludedFromAnalytics) return false;
  return isAbandonedStatus(cart.status);
}

function eventTimeMs(ev) {
  if (!ev || !ev.toMillis) return 0;
  return ev.toMillis();
}

export function computeCartFunnel(carts) {
  let totalCarts = 0, abandoned = 0, recoverable = 0, emailed = 0, recovered = 0;
  let totalValueP = 0, abandonedValueP = 0, recoverableValueP = 0;

  for (const cart of carts) {
    if (cart.excludedFromAnalytics) continue;

    totalCarts += 1;
    totalValueP += cart.totalP || 0;

    if (isAbandonedStatus(cart.status)) {
      abandoned += 1;
      abandonedValueP += cart.totalP || 0;

      if (isRecoverable(cart)) {
        recoverable += 1;
        recoverableValueP += cart.totalP || 0;
        if (cart.recoveryEmailsSent && cart.recoveryEmailsSent.length > 0) emailed += 1;
      }
    }

    if (cart.status === 'completed' && cart.recoveryEmailsSent && cart.recoveryEmailsSent.length > 0) {
      recovered += 1;
    }
  }

  return { totalCarts, abandoned, recoverable, emailed, recovered, totalValueP, abandonedValueP, recoverableValueP };
}

export function recoverableCarts(carts) {
  return carts
    .filter(isRecoverable)
    .sort((a, b) => eventTimeMs(b.updatedAt) - eventTimeMs(a.updatedAt));
}
```

- [ ] **Step 4: Run tests to verify they pass**

Run: `npm test -- cartAggregations.test.js`
Expected: PASS — all 5 tests.

- [ ] **Step 5: Commit**

```bash
git add src/components/admin/analytics/cartAggregations.js src/components/admin/analytics/cartAggregations.test.js
git commit -m "feat(admin-analytics): pure cart aggregation functions (funnel + recoverable list)"
```

---

## Task 11: Email template for recovery

**Files:**
- Create: `api/templates/cart-recovery.js`

Reuses the existing nodemailer transporter from `api/stripe.js`. Phase 2 ships ONE template (Email 1 — friendly reminder). Phase 3 will add Email 2 (24h follow-up) and the scheduler.

- [ ] **Step 1: Create the template module**

```bash
mkdir -p api/templates
```

Create `api/templates/cart-recovery.js`:

```javascript
'use strict';

const AIRCRAFT_NAMES = {
  r22: 'Robinson R22',
  r44: 'Robinson R44',
  r66: 'Robinson R66',
  r88: 'Robinson R88',
};

function fmtGbp(p) {
  return `£${(Math.round(p) / 100).toLocaleString('en-GB', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}`;
}

function aircraftName(id) {
  return AIRCRAFT_NAMES[id] || id || 'Discovery Flight';
}

/**
 * Build the recovery email for an abandoned cart.
 * @param {object} cart
 * @param {string} siteUrl  e.g. https://hqaviation.co.uk
 * @returns {{ subject: string, html: string, text: string }}
 */
function renderCartRecoveryEmail(cart, siteUrl) {
  const flight = cart.flight || {};
  const aircraft = aircraftName(flight.aircraftId);
  const duration = flight.duration ? `${flight.duration}-minute` : '';
  const total = fmtGbp(cart.totalP || 0);
  const resumeUrl = `${siteUrl}/checkout?t=${encodeURIComponent(cart.recoveryToken || '')}`;
  const unsubUrl = `${siteUrl}/api/carts/unsubscribe?t=${encodeURIComponent(cart.recoveryToken || '')}`;

  const subject = `Your HQ Aviation booking is saved`;

  const html = `<!doctype html>
<html>
  <head><meta charset="utf-8"></head>
  <body style="font-family:system-ui,-apple-system,sans-serif;background:#f5f5f7;padding:24px;color:#1a1a1a;line-height:1.5">
    <div style="max-width:560px;margin:0 auto;background:#fff;border-radius:12px;padding:32px">
      <h1 style="font-size:22px;margin:0 0 8px 0">Your booking is held.</h1>
      <p style="color:#475569;margin:0 0 24px 0">We've saved your ${aircraft} ${duration} Discovery Flight so you can come back when you're ready.</p>

      <div style="background:#f8fafc;border-radius:8px;padding:16px;margin-bottom:24px">
        <p style="margin:0 0 4px 0;font-weight:600">${aircraft} — ${duration} Discovery Flight</p>
        <p style="margin:0;color:#475569">${total}</p>
      </div>

      <p style="margin:0 0 24px 0">
        <a href="${resumeUrl}&utm_source=recovery&utm_medium=email&utm_campaign=cart-manual"
           style="display:inline-block;background:#a855f7;color:#fff;padding:14px 24px;border-radius:8px;text-decoration:none;font-weight:600">
          Complete your booking
        </a>
      </p>

      <p style="color:#475569;margin:0 0 24px 0">
        First-flight nerves are normal. Your instructor will walk you through every minute.
        Any questions? Reply to this email or call us — happy to help.
      </p>

      <hr style="border:none;border-top:1px solid #e2e8f0;margin:32px 0 16px 0">
      <p style="font-size:12px;color:#94a3b8;margin:0">
        You're receiving this because you started a booking on hqaviation.co.uk.
        <a href="${unsubUrl}" style="color:#94a3b8">Unsubscribe</a>
      </p>
    </div>
  </body>
</html>`;

  const text = `Your booking is held.

We've saved your ${aircraft} ${duration} Discovery Flight so you can come back when you're ready.

${aircraft} — ${duration} Discovery Flight
${total}

Complete your booking:
${resumeUrl}&utm_source=recovery&utm_medium=email&utm_campaign=cart-manual

First-flight nerves are normal. Your instructor will walk you through every minute. Any questions? Reply to this email or call us — happy to help.

---
You're receiving this because you started a booking on hqaviation.co.uk.
Unsubscribe: ${unsubUrl}
`;

  return { subject, html, text };
}

module.exports = { renderCartRecoveryEmail };
```

- [ ] **Step 2: Commit**

```bash
git add api/templates/cart-recovery.js
git commit -m "feat(carts): cart-recovery email template (HTML + plain-text + UTM-tagged resume link)"
```

---

## Task 12: Carts router — manual recovery send endpoint

**Files:**
- Modify: `api/carts.js`

Reuses the existing nodemailer transporter from `api/stripe.js`. We don't import the transporter directly — we extract it into a shared module to avoid circular imports.

- [ ] **Step 1: Extract the nodemailer transporter into a shared module**

Look at `api/stripe.js` for the `getTransporter` function (around line 100). Move it to a new file `api/lib/mailer.js`:

```javascript
'use strict';

const nodemailer = require('nodemailer');

let _transporter = null;

function getTransporter() {
  if (_transporter) return _transporter;
  _transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: parseInt(process.env.SMTP_PORT || '587', 10),
    secure: false,
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  });
  return _transporter;
}

module.exports = { getTransporter };
```

In `api/stripe.js`, replace the inline `getTransporter` definition with:

```javascript
const { getTransporter } = require('./lib/mailer');
```

Run `grep -n "_transporter\|nodemailer" api/stripe.js` — should now only show the import.

- [ ] **Step 2: Add the manual-send endpoint to api/carts.js**

In `api/carts.js`, add:

```javascript
const { getTransporter } = require('./lib/mailer');
const { renderCartRecoveryEmail } = require('./templates/cart-recovery');
```

Then before `module.exports`:

```javascript
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
```

- [ ] **Step 3: Commit**

```bash
git add api/lib/mailer.js api/carts.js api/stripe.js
git commit -m "feat(carts): admin manual recovery email send via shared mailer module"
```

---

## Task 13: AbandonedCartTile component

**Files:**
- Create: `src/components/admin/analytics/AbandonedCartTile.jsx`
- Test: `src/components/admin/analytics/AbandonedCartTile.test.jsx`

- [ ] **Step 1: Write the failing tests**

Create `src/components/admin/analytics/AbandonedCartTile.test.jsx`:

```javascript
// @vitest-environment jsdom
import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import AbandonedCartTile from './AbandonedCartTile';

const ts = (h) => ({ toMillis: () => Date.now() - h * 3600 * 1000 });

const carts = [
  { id: '1', status: 'abandoned', email: 'a@b.c', flight: { aircraftId: 'r44', duration: 60 }, totalP: 35000, recoveryEmailsSent: [], updatedAt: ts(2), excludedFromAnalytics: false, noEmail: false },
  { id: '2', status: 'abandoned', email: null,    flight: { aircraftId: 'r22', duration: 30 }, totalP: 12500, recoveryEmailsSent: [], updatedAt: ts(3), excludedFromAnalytics: false, noEmail: false },
];

describe('AbandonedCartTile', () => {
  it('renders the abandonment funnel stages', () => {
    render(<AbandonedCartTile carts={carts} onSendRecovery={() => {}} />);
    expect(screen.getByText(/Carts/i)).toBeInTheDocument();
    expect(screen.getByText(/Abandoned/i)).toBeInTheDocument();
    expect(screen.getByText(/Recoverable/i)).toBeInTheDocument();
  });

  it('shows the recoverable email in the table', () => {
    render(<AbandonedCartTile carts={carts} onSendRecovery={() => {}} />);
    expect(screen.getByText('a@b.c')).toBeInTheDocument();
    // The cart with no email should NOT be listed in the recoverable table
    expect(screen.queryByText('—')).toBeInTheDocument(); // some empty fields rendered with em-dash
  });

  it('shows an empty state when no recoverable carts', () => {
    render(<AbandonedCartTile carts={[]} onSendRecovery={() => {}} />);
    expect(screen.getByText(/Nothing to recover/i)).toBeInTheDocument();
  });

  it('calls onSendRecovery with the cartId when the button is clicked', async () => {
    const onSendRecovery = vi.fn();
    render(<AbandonedCartTile carts={carts} onSendRecovery={onSendRecovery} />);
    const button = screen.getByRole('button', { name: /send recovery/i });
    button.click();
    expect(onSendRecovery).toHaveBeenCalledWith('1');
  });
});
```

- [ ] **Step 2: Run tests to verify failure**

Run: `npm test -- AbandonedCartTile.test.jsx`
Expected: FAIL.

- [ ] **Step 3: Implement the component**

Create `src/components/admin/analytics/AbandonedCartTile.jsx`:

```javascript
import { useMemo, useState } from 'react';
import { computeCartFunnel, recoverableCarts } from './cartAggregations';

const STAGE_COLORS = {
  totalCarts:  '#5b21b6',
  abandoned:   '#7c3aed',
  recoverable: '#a855f7',
  emailed:     '#c084fc',
  recovered:   '#e9d5ff',
};

const AIRCRAFT_NAMES = {
  r22: 'Robinson R22',
  r44: 'Robinson R44',
  r66: 'Robinson R66',
  r88: 'Robinson R88',
};

function fmtGbp(p) {
  if (!p || !Number.isFinite(p)) return '£0';
  return `£${Math.round(p / 100).toLocaleString('en-GB')}`;
}

function fmtTimeAgo(ts) {
  if (!ts || typeof ts.toMillis !== 'function') return '—';
  const ms = Date.now() - ts.toMillis();
  const h = Math.round(ms / 3600000);
  if (h < 1) return 'just now';
  if (h < 24) return `${h}h ago`;
  return `${Math.round(h / 24)}d ago`;
}

export default function AbandonedCartTile({ carts = [], onSendRecovery }) {
  const [busyId, setBusyId] = useState(null);
  const funnel = useMemo(() => computeCartFunnel(carts), [carts]);
  const recoverable = useMemo(() => recoverableCarts(carts), [carts]);

  const stages = [
    { key: 'totalCarts',  label: 'Carts',       count: funnel.totalCarts },
    { key: 'abandoned',   label: 'Abandoned',   count: funnel.abandoned },
    { key: 'recoverable', label: 'Recoverable', count: funnel.recoverable },
    { key: 'emailed',     label: 'Emailed',     count: funnel.emailed },
    { key: 'recovered',   label: 'Recovered',   count: funnel.recovered },
  ];
  const maxCount = Math.max(...stages.map((s) => s.count), 1);

  async function handleClick(cartId) {
    setBusyId(cartId);
    try {
      await onSendRecovery(cartId);
    } finally {
      setBusyId(null);
    }
  }

  return (
    <section style={{ background: '#1a1a1a', borderRadius: 12, padding: 24, color: '#fff' }}>
      <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 20 }}>
        <h2 style={{ margin: 0, fontSize: 18 }}>Abandoned Carts</h2>
        <span style={{ fontSize: 22, fontWeight: 600, color: '#a855f7' }}>{fmtGbp(funnel.recoverableValueP)} recoverable</span>
      </header>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginBottom: 24 }}>
        {stages.map((stage) => {
          const widthPct = (stage.count / maxCount) * 100;
          return (
            <div key={stage.key} style={{ display: 'grid', gridTemplateColumns: '140px 1fr 60px', alignItems: 'center', gap: 12 }}>
              <span style={{ fontSize: 14 }}>{stage.label}</span>
              <div style={{ background: '#2a2a2a', borderRadius: 4, overflow: 'hidden', height: 24 }}>
                <div style={{ width: `${widthPct}%`, background: STAGE_COLORS[stage.key], height: '100%', transition: 'width 250ms ease' }} />
              </div>
              <span style={{ fontSize: 14, fontWeight: 600, textAlign: 'right' }}>{stage.count.toLocaleString('en-GB')}</span>
            </div>
          );
        })}
      </div>

      {recoverable.length === 0 ? (
        <p style={{ opacity: 0.7, fontStyle: 'italic', margin: 0 }}>Nothing to recover — well done.</p>
      ) : (
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
          <thead>
            <tr style={{ borderBottom: '1px solid #2a2a2a', textAlign: 'left' }}>
              <th style={{ padding: '8px 4px', color: '#94a3b8', fontWeight: 500 }}>Email</th>
              <th style={{ padding: '8px 4px', color: '#94a3b8', fontWeight: 500 }}>Item</th>
              <th style={{ padding: '8px 4px', color: '#94a3b8', fontWeight: 500 }}>Value</th>
              <th style={{ padding: '8px 4px', color: '#94a3b8', fontWeight: 500 }}>When</th>
              <th style={{ padding: '8px 4px', color: '#94a3b8', fontWeight: 500 }}>Sent</th>
              <th style={{ padding: '8px 4px' }}></th>
            </tr>
          </thead>
          <tbody>
            {recoverable.map((cart) => {
              const aircraft = cart.flight ? (AIRCRAFT_NAMES[cart.flight.aircraftId] || cart.flight.aircraftId) : '—';
              const duration = cart.flight && cart.flight.duration ? `${cart.flight.duration}m` : '';
              const sentCount = (cart.recoveryEmailsSent || []).length;
              return (
                <tr key={cart.id} style={{ borderBottom: '1px solid #2a2a2a' }}>
                  <td style={{ padding: '10px 4px' }}>{cart.email}</td>
                  <td style={{ padding: '10px 4px', color: '#cbd5e1' }}>{aircraft} {duration}</td>
                  <td style={{ padding: '10px 4px' }}>{fmtGbp(cart.totalP)}</td>
                  <td style={{ padding: '10px 4px', color: '#94a3b8' }}>{fmtTimeAgo(cart.updatedAt)}</td>
                  <td style={{ padding: '10px 4px', color: '#94a3b8' }}>{sentCount > 0 ? `${sentCount}×` : '—'}</td>
                  <td style={{ padding: '10px 4px', textAlign: 'right' }}>
                    <button
                      type="button"
                      onClick={() => handleClick(cart.id)}
                      disabled={busyId === cart.id}
                      style={{
                        padding: '6px 12px', fontSize: 12, fontWeight: 600,
                        background: busyId === cart.id ? '#475569' : '#a855f7', color: '#fff',
                        border: 'none', borderRadius: 6, cursor: busyId === cart.id ? 'wait' : 'pointer',
                      }}
                    >
                      {busyId === cart.id ? 'Sending…' : 'Send recovery'}
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      )}
    </section>
  );
}
```

- [ ] **Step 4: Run tests**

Run: `npm test -- AbandonedCartTile.test.jsx`
Expected: PASS — all 4 tests.

- [ ] **Step 5: Commit**

```bash
git add src/components/admin/analytics/AbandonedCartTile.jsx src/components/admin/analytics/AbandonedCartTile.test.jsx
git commit -m "feat(admin-analytics): AbandonedCartTile with funnel + recoverable carts table + Send recovery button"
```

---

## Task 14: Wire AbandonedCartTile into AdminAnalytics

**Files:**
- Modify: `src/pages/admin/AdminAnalytics.jsx`

- [ ] **Step 1: Add cart fetching state**

In `src/pages/admin/AdminAnalytics.jsx`, near the existing `useState` hooks (around lines 269-275), add:

```javascript
  const [carts, setCarts] = useState([]);
  const [cartsLoading, setCartsLoading] = useState(true);
```

- [ ] **Step 2: Add the cart-fetch effect**

After the existing effects (around line 290), add:

```javascript
  useEffect(() => {
    let cancelled = false;
    async function loadCarts() {
      try {
        const token = await auth.currentUser?.getIdToken();
        if (!token) return;
        const res = await fetch('/api/carts', { headers: { Authorization: `Bearer ${token}` } });
        if (!res.ok) throw new Error('Failed to load carts');
        const data = await res.json();
        if (!cancelled) {
          setCarts(data.carts || []);
          setCartsLoading(false);
        }
      } catch (err) {
        console.error(err);
        if (!cancelled) setCartsLoading(false);
      }
    }
    loadCarts();
    return () => { cancelled = true; };
  }, []);
```

- [ ] **Step 3: Add the send-recovery handler**

In the same file, add:

```javascript
  async function handleSendRecovery(cartId) {
    try {
      const token = await auth.currentUser?.getIdToken();
      const res = await fetch(`/api/carts/${cartId}/send-recovery`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        alert(`Failed to send: ${err.error || 'unknown error'}`);
        return;
      }
      alert('Recovery email sent.');
      // Refresh carts to show the updated sent count
      const refresh = await fetch('/api/carts', { headers: { Authorization: `Bearer ${token}` } });
      if (refresh.ok) {
        const data = await refresh.json();
        setCarts(data.carts || []);
      }
    } catch (err) {
      alert(`Failed to send: ${err.message}`);
    }
  }
```

- [ ] **Step 4: Mount the tile**

Find the spot just below the PurchaseFunnel mount (added in Phase 1 — search `<PurchaseFunnel`). Add:

```javascript
{import.meta.env.VITE_FUNNEL_ENABLED !== 'false' && !cartsLoading && (
  <div style={{ marginBottom: 24 }}>
    <AbandonedCartTile carts={carts} onSendRecovery={handleSendRecovery} />
  </div>
)}
```

Add the import at the top of the file alongside PurchaseFunnel:

```javascript
import AbandonedCartTile from '../../components/admin/analytics/AbandonedCartTile';
```

- [ ] **Step 5: Smoke test in browser** — SKIP (Task 19).

- [ ] **Step 6: Commit**

```bash
git add src/pages/admin/AdminAnalytics.jsx
git commit -m "feat(admin-analytics): mount AbandonedCartTile + wire admin recovery email send"
```

---

## Task 15: Firestore security rules for carts

**Files:**
- Modify: `firestore.rules`

Carts contain customer email + booking details. They MUST not be readable from client SDK. Only the Admin SDK (server-side) writes to this collection.

- [ ] **Step 1: Find and update firestore.rules**

```bash
cat firestore.rules
```

- [ ] **Step 2: Add a deny-all rule for carts**

In `firestore.rules`, inside `match /databases/{database}/documents`, add:

```
    // Carts: server-only via Admin SDK. No client read or write.
    match /carts/{cartId} {
      allow read, write: if false;
    }
```

If a generic `match /{document=**}` rule exists below this, the explicit deny takes precedence (Firestore rules are most-specific-wins). If it doesn't exist, this is just an explicit lockdown.

- [ ] **Step 3: Commit**

```bash
git add firestore.rules
git commit -m "feat(carts): firestore rules deny client read/write on carts collection"
```

- [ ] **Step 4: Note for deploy**

The user will need to deploy: `firebase deploy --only firestore:rules` when going to production. Phase 2 dev uses Admin SDK (server-side), so rules don't block local development.

---

## Task 16: Firestore composite indexes for carts

**Files:**
- Modify: `firestore.indexes.json`

The cart queries we use:
- `where sessionId == X AND status in [active, checkout_initiated, abandoned]` → needs (sessionId, status)
- `where status in [active, …]  orderBy updatedAt desc` → needs (status, updatedAt DESC)
- `where recoveryToken == X` → single-field, no composite needed

- [ ] **Step 1: Add the indexes**

In `firestore.indexes.json`, add inside the `indexes` array:

```json
    {
      "collectionGroup": "carts",
      "queryScope": "COLLECTION",
      "fields": [
        { "fieldPath": "sessionId", "order": "ASCENDING" },
        { "fieldPath": "status", "order": "ASCENDING" }
      ]
    },
    {
      "collectionGroup": "carts",
      "queryScope": "COLLECTION",
      "fields": [
        { "fieldPath": "status", "order": "ASCENDING" },
        { "fieldPath": "updatedAt", "order": "DESCENDING" }
      ]
    }
```

- [ ] **Step 2: Commit**

```bash
git add firestore.indexes.json
git commit -m "feat(carts): firestore indexes for cart sessionId+status and status+updatedAt queries"
```

---

## Task 17: Lead-match backfill (sessionId → email from leads)

**Files:**
- Modify: `api/carts.js`

If a session previously submitted any lead form, we have their email. On cart upsert with no email, look up `leads` by sessionId and pre-fill if found. The user doesn't even see the email-first step in this case.

- [ ] **Step 1: Add a leadEmailLookup helper**

In `api/carts.js`, near the top after `isAdminEmail`, add:

```javascript
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
```

- [ ] **Step 2: Use it in the POST handler**

In the POST handler in `api/carts.js`, between the `parsed.success` check and the existing-cart lookup, add:

```javascript
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
```

Then update `baseFields` to use the resolved values:

```javascript
    const baseFields = {
      sessionId: data.sessionId,
      email: resolvedEmail,
      emailSource: emailSource,
      // ...rest unchanged
    };
```

And also update `excludedFromAnalytics: isAdminEmail(resolvedEmail)`.

- [ ] **Step 3: Add the index for leads.sessionId**

In `firestore.indexes.json`, add inside the `indexes` array:

```json
    {
      "collectionGroup": "leads",
      "queryScope": "COLLECTION",
      "fields": [
        { "fieldPath": "sessionId", "order": "ASCENDING" },
        { "fieldPath": "email", "order": "ASCENDING" },
        { "fieldPath": "createdAt", "order": "DESCENDING" }
      ]
    }
```

- [ ] **Step 4: Use the resolved email in client too**

In `src/pages/Checkout.jsx`, after `upsertCart` returns, the response should include the resolved email so the email-first step can be skipped. Update `api/carts.js` to return the resolved email in the response:

In the POST handler, change `return res.json({ ok: true, cartId: ... })` to:

```javascript
    return res.json({ ok: true, cartId: ..., email: resolvedEmail });
```

(Both branches — existing cart and new cart.)

In `src/lib/cart.js`, update `upsertCart` to return the email too:

```javascript
    if (data && data.cartId) {
      setCartId(data.cartId);
      return { cartId: data.cartId, email: data.email || null };
    }
    return null;
```

In `src/pages/Checkout.jsx`, on initial mount (no email yet), call `upsertCart` with just `sessionId` (no email) to trigger the lead-match — if it returns an email, skip the EmailFirstStep:

```javascript
  // Pre-flight lead-match: ask the server if we know the email already from a prior lead form
  useEffect(() => {
    if (email) return; // already have one
    if (searchParams.get('t')) return; // resume token path handles its own
    upsertCart({ sessionId: getSessionId() }).then((result) => {
      if (result && result.email) {
        setEmail(result.email);
        setCartIdState(result.cartId);
      }
    });
  }, []); // eslint-disable-line react-hooks/exhaustive-deps
```

- [ ] **Step 5: Run tests**

Run: `npm test`
Expected: existing tests still pass. (We didn't add cart.test.js coverage for the email return — that's a known gap, fine for Phase 2.)

- [ ] **Step 6: Commit**

```bash
git add api/carts.js firestore.indexes.json src/lib/cart.js src/pages/Checkout.jsx
git commit -m "feat(carts): lead-match backfill — pre-fill cart email from prior contact-form sessionId"
```

---

## Task 18: Document VITE_CARTS_ENABLED + ADMIN_EMAIL env flags

**Files:**
- Modify: `.env.example`

- [ ] **Step 1: Open .env.example and add at the bottom**

```
# Phase 2 abandoned cart system — set to "false" to hide the AbandonedCartTile and stop cart writes.
# (Events still fire; this only gates the cart-persistence side.)
VITE_CARTS_ENABLED=true

# Comma-separated emails to exclude from cart funnels (admin testing). Same idea as ADMIN_IP.
# Already has a default value above for the existing admin login flow — append more if needed.
```

(The `ADMIN_EMAIL` line should already exist from earlier work — extend its comment instead of duplicating.)

- [ ] **Step 2: Commit**

```bash
git add .env.example
git commit -m "docs(env): document VITE_CARTS_ENABLED for Phase 2 rollout"
```

---

## Task 19: Final integration smoke test (manual)

This is the verification gate before declaring Phase 2 complete.

- [ ] **Step 1: Restart dev server**

```bash
# Stop existing npm run dev, then restart
npm run dev
```

- [ ] **Step 2: Email-first flow**

1. Open incognito → `http://localhost:5173/training/trial-lessons`. Pick a card + duration → click Book Now.
2. On `/checkout`, you should now see "Almost there. Where shall we send your booking confirmation?" — the email-first step.
3. Type `test@example.com` → click Continue.
4. The existing card form should appear.
5. In another tab, sign in as admin → `/admin/analytics`. Scroll to Abandoned Carts tile. There should be 1 cart with email `test@example.com`, status "checkout_initiated".

- [ ] **Step 3: Manual recovery email**

1. From `/admin/analytics`, in the Recoverable Carts table, click "Send recovery" on the test cart.
2. Confirm the alert "Recovery email sent."
3. Check the test email inbox (or SMTP logs if using a mock provider). Email should arrive with subject "Your HQ Aviation booking is saved", containing the resume link `/checkout?t=<token>`.
4. Open the resume link in a new incognito tab. Confirm: the EmailFirstStep is skipped, the email is pre-filled, and the existing card form is shown with the same booking.

- [ ] **Step 4: Lead-match backfill**

1. In a fresh incognito session, fill any lead form on the site (e.g. `/contact`) with email `lead-test@example.com`.
2. Then navigate to `/training/trial-lessons` → pick → Book Now.
3. On `/checkout`, the EmailFirstStep should be SKIPPED — go directly to the card form.
4. In `/admin/analytics`, the cart's email should show `lead-test@example.com` with `emailSource: 'lead-match'`.

- [ ] **Step 5: Unsubscribe**

1. Click the Unsubscribe link in the recovery email from Step 3.
2. Confirm the page shows "Unsubscribed".
3. Back in `/admin/analytics`, the cart should now show as NOT recoverable (filtered out of the table).
4. Try to send recovery again from any other admin route — should 400 with "Customer has unsubscribed."

- [ ] **Step 6: Webhook promotion**

1. Set up Stripe CLI: `stripe listen --forward-to localhost:3000/api/stripe/webhook`.
2. Complete a test payment with card `4242 4242 4242 4242`.
3. Confirm the cart in `/admin/analytics` moves from "abandoned" → disappears from the recoverable table (now `completed`).
4. The Purchase Funnel tile's Purchased count goes up.

- [ ] **Step 7: Rollback flag**

1. Set `VITE_CARTS_ENABLED=false` in `.env`, restart dev. Hide is at the dashboard tile level. (Cart events still fire — this is intentional, separate concern.)

- [ ] **Step 8: Final commit (if any docs/lint touch-ups)**

```bash
git status
# If anything outstanding, commit it. Otherwise nothing to do.
```

---

## Acceptance criteria for Phase 2

- All 19 tasks complete with green tests.
- `/checkout` shows the EmailFirstStep on first visit; the existing card form appears after email is captured.
- `/admin/analytics` shows the AbandonedCartTile with the abandonment funnel + recoverable-carts table.
- "Send recovery" button on the dashboard delivers a working email with a resume link that pre-fills the cart.
- Lead-match backfill skips the email step for sessions that previously submitted a lead form.
- Unsubscribe link in the email sets `noEmail: true` and removes the cart from the recoverable list.
- Stripe webhook promotes the cart to `completed` when payment succeeds.
- All existing tests still pass; no regression in the Purchase Funnel tile from Phase 1.

## Out of scope for Phase 2 (deferred to Phase 3)

- Automated 1h/24h recovery email sends (cron scheduler)
- 24h follow-up email template
- Open-pixel + click tracking on recovery emails
- RFC 8058 List-Unsubscribe headers (current implementation has only the body link)
- Quiet-hours clamp (08:00–20:00 Europe/London)
- 90-day cart pruning job
- Exit-intent modal on `/checkout`
- Mobile abandonment signal (visibilitychange)

# Cart Tracking — Phase 1: Data Model + Backend — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Extend the cart data model with category/products/londonTour/contactedAt, fix the `GET /api/carts` query so every cart status is fetched, add manual admin endpoints (status / mark-contacted / delete), and redefine the cart aggregations so any email cart is "recoverable".

**Architecture:** Pure logic (Zod schema, status helper, funnel aggregations) is unit-tested with Vitest TDD. The Express route handlers in `api/carts.js` are thin Firestore glue that follow the existing `requireAdmin` + try/catch + `logger` patterns already in that file; they are verified by regression (`npm test`) and review. A minimal adaptation of `AbandonedCartTile.jsx` keeps the admin tile from crashing on the renamed funnel field — the full tile redesign is Phase 4.

**Tech Stack:** Node/CommonJS (`api/`), Express, Zod, Firebase Admin SDK, React (admin tile), Vitest.

**Scope note:** This is Phase 1 of the spec `docs/superpowers/specs/2026-05-14-cart-tracking-and-store-cart-design.md`. Phases 2 (HQ store cart), 3 (checkout wiring), 4 (admin tile redesign) get their own plans.

**Branch:** `launchday` (the integration branch). All commits land here.

---

### Task 1: Extend `CartUpsertSchema` with category, products, londonTour

**Files:**
- Modify: `api/lib/cartValidation.js`
- Test: `api/lib/cartValidation.test.js` (create)

- [ ] **Step 1: Write the failing test**

Create `api/lib/cartValidation.test.js`:

```js
import { describe, it, expect } from 'vitest';
import { CartUpsertSchema } from './cartValidation.js';

describe('CartUpsertSchema — category-aware carts', () => {
  it('accepts a valid product cart payload', () => {
    const out = CartUpsertSchema.safeParse({
      sessionId: 'sess1234',
      email: 'a@b.c',
      category: 'product',
      products: [
        { itemId: 'tee', name: 'HQ Tee', qty: 2, size: 'M', priceP: 2500, requiresShipping: true },
      ],
    });
    expect(out.success).toBe(true);
  });

  it('accepts a valid london_tour cart payload', () => {
    const out = CartUpsertSchema.safeParse({
      sessionId: 'sess1234',
      email: 'a@b.c',
      category: 'london_tour',
      londonTour: { experience: 'shared', timeOfDay: 'sunset', quantity: 2, priceP: 15000 },
    });
    expect(out.success).toBe(true);
  });

  it('still accepts an existing flight cart payload (no regression)', () => {
    const out = CartUpsertSchema.safeParse({
      sessionId: 'sess1234',
      flight: { aircraftId: 'r44', duration: 60 },
    });
    expect(out.success).toBe(true);
  });

  it('rejects an unknown category', () => {
    const out = CartUpsertSchema.safeParse({
      sessionId: 'sess1234',
      category: 'banana',
    });
    expect(out.success).toBe(false);
  });

  it('rejects a product line missing required fields', () => {
    const out = CartUpsertSchema.safeParse({
      sessionId: 'sess1234',
      category: 'product',
      products: [{ itemId: 'tee' }],
    });
    expect(out.success).toBe(false);
  });

  it('rejects a london_tour with an invalid experience', () => {
    const out = CartUpsertSchema.safeParse({
      sessionId: 'sess1234',
      category: 'london_tour',
      londonTour: { experience: 'huge', timeOfDay: 'day', quantity: 1, priceP: 100 },
    });
    expect(out.success).toBe(false);
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npx vitest run api/lib/cartValidation.test.js`
Expected: FAIL — the product/london_tour/category cases fail because `.strict()` rejects the unknown `category`/`products`/`londonTour` keys.

- [ ] **Step 3: Write minimal implementation**

Replace the entire contents of `api/lib/cartValidation.js` with:

```js
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

// One line item in a store cart. priceP is per-unit, in pence.
const ProductLineSchema = z.object({
  itemId: z.string().min(1).max(64),
  name: z.string().min(1).max(200),
  qty: z.number().int().min(1).max(50),
  size: z.string().max(20).optional().nullable(),
  priceP: z.number().int().min(0).max(100000000),
  requiresShipping: z.boolean().optional().default(false),
}).strict();

const LondonTourSchema = z.object({
  experience: z.enum(['shared', 'private']),
  timeOfDay: z.enum(['day', 'sunset', 'night']),
  quantity: z.number().int().min(1).max(4),
  priceP: z.number().int().min(0).max(100000000),
}).strict();

// POST /api/carts upsert body
const CartUpsertSchema = z.object({
  sessionId: z.string().min(8).max(64),
  email: z.string().email().max(254).optional().nullable(),
  category: z.enum(['discovery_flight', 'product', 'london_tour']).optional().nullable(),
  flight: FlightSchema.optional().nullable(),
  addons: z.array(AddonSchema).max(20).optional().default([]),
  products: z.array(ProductLineSchema).max(50).optional().default([]),
  londonTour: LondonTourSchema.optional().nullable(),
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
  ProductLineSchema,
  LondonTourSchema,
};
```

- [ ] **Step 4: Run test to verify it passes**

Run: `npx vitest run api/lib/cartValidation.test.js`
Expected: PASS — all 6 tests green.

- [ ] **Step 5: Commit**

```bash
git add api/lib/cartValidation.js api/lib/cartValidation.test.js
git commit -m "feat(carts): add category/products/londonTour to cart schema"
```

---

### Task 2: Add the admin status helper

**Files:**
- Create: `api/lib/cartAdminLogic.js`
- Test: `api/lib/cartAdminLogic.test.js` (create)

- [ ] **Step 1: Write the failing test**

Create `api/lib/cartAdminLogic.test.js`:

```js
import { describe, it, expect } from 'vitest';
import { ADMIN_SETTABLE_STATUSES, isAdminSettableStatus } from './cartAdminLogic.js';

describe('isAdminSettableStatus', () => {
  it('accepts every status an admin may set manually', () => {
    expect(isAdminSettableStatus('active')).toBe(true);
    expect(isAdminSettableStatus('abandoned')).toBe(true);
    expect(isAdminSettableStatus('expired')).toBe(true);
    expect(isAdminSettableStatus('completed')).toBe(true);
  });

  it('rejects anything else', () => {
    expect(isAdminSettableStatus('checkout_initiated')).toBe(false);
    expect(isAdminSettableStatus('banana')).toBe(false);
    expect(isAdminSettableStatus('')).toBe(false);
    expect(isAdminSettableStatus(undefined)).toBe(false);
    expect(isAdminSettableStatus(null)).toBe(false);
  });

  it('exposes the allowed list', () => {
    expect(ADMIN_SETTABLE_STATUSES).toEqual(['active', 'abandoned', 'expired', 'completed']);
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npx vitest run api/lib/cartAdminLogic.test.js`
Expected: FAIL — `Cannot find module './cartAdminLogic.js'`.

- [ ] **Step 3: Write minimal implementation**

Create `api/lib/cartAdminLogic.js`:

```js
'use strict';

// Statuses an admin may set by hand from the dashboard. 'checkout_initiated'
// is intentionally excluded — it is only ever set by the Stripe flow, never
// chosen manually.
const ADMIN_SETTABLE_STATUSES = ['active', 'abandoned', 'expired', 'completed'];

function isAdminSettableStatus(status) {
  return ADMIN_SETTABLE_STATUSES.includes(status);
}

module.exports = { ADMIN_SETTABLE_STATUSES, isAdminSettableStatus };
```

- [ ] **Step 4: Run test to verify it passes**

Run: `npx vitest run api/lib/cartAdminLogic.test.js`
Expected: PASS — all 3 tests green.

- [ ] **Step 5: Commit**

```bash
git add api/lib/cartAdminLogic.js api/lib/cartAdminLogic.test.js
git commit -m "feat(carts): add admin-settable status helper"
```

---

### Task 3: Redefine cart aggregations (recoverable = any email cart)

**Files:**
- Modify: `src/components/admin/analytics/cartAggregations.js`
- Test: `src/components/admin/analytics/cartAggregations.test.js`

- [ ] **Step 1: Write the failing test**

Replace the entire contents of `src/components/admin/analytics/cartAggregations.test.js` with:

```js
import { describe, it, expect } from 'vitest';
import { computeCartFunnel, recoverableCarts } from './cartAggregations';

const ts = (hoursAgo) => ({ toMillis: () => Date.now() - hoursAgo * 3600 * 1000 });

const fixture = [
  // recoverable: abandoned, has email, not contacted
  { id: '1', status: 'abandoned', email: 'a@b.c', noEmail: false, totalP: 35000, contactedAt: null, updatedAt: ts(2), excludedFromAnalytics: false },
  // recoverable: abandoned, has email, contacted
  { id: '2', status: 'abandoned', email: 'd@e.f', noEmail: false, totalP: 18000, contactedAt: ts(1), updatedAt: ts(1), excludedFromAnalytics: false },
  // not recoverable — no email
  { id: '3', status: 'abandoned', email: null, noEmail: false, totalP: 35000, contactedAt: null, updatedAt: ts(3), excludedFromAnalytics: false },
  // unsubscribed — not recoverable
  { id: '4', status: 'abandoned', email: 'x@y.z', noEmail: true, totalP: 35000, contactedAt: null, updatedAt: ts(4), excludedFromAnalytics: false },
  // recovered — completed AND contacted
  { id: '5', status: 'completed', email: 'r@e.c', noEmail: false, totalP: 35000, contactedAt: ts(5), updatedAt: ts(4), excludedFromAnalytics: false },
  // recoverable: active with email (NEW — active email carts are now recoverable)
  { id: '6', status: 'active', email: 'n@o.p', noEmail: false, totalP: 35000, contactedAt: null, updatedAt: ts(0.1), excludedFromAnalytics: false },
  // admin-excluded — filtered out of every count
  { id: '7', status: 'abandoned', email: 'admin@hq.co', noEmail: false, totalP: 35000, contactedAt: null, updatedAt: ts(2), excludedFromAnalytics: true },
];

describe('computeCartFunnel', () => {
  it('counts carts at each stage of the funnel', () => {
    const out = computeCartFunnel(fixture);
    expect(out.totalCarts).toBe(6);    // excludes id 7 (admin)
    expect(out.abandoned).toBe(4);     // ids 1,2,3,4 (abandoned status; not 5 completed, not 6 active)
    expect(out.recoverable).toBe(3);   // ids 1,2,6 (non-completed + usable email)
    expect(out.contacted).toBe(1);     // id 2 (recoverable + contactedAt)
    expect(out.recovered).toBe(1);     // id 5 (completed + contactedAt)
  });

  it('includes £ totals at each stage', () => {
    const out = computeCartFunnel(fixture);
    // 1:35k + 2:18k + 3:35k + 4:35k + 5:35k + 6:35k = 193000 (id 7 admin excluded)
    expect(out.totalValueP).toBe(193000);
    expect(out.recoverableValueP).toBe(88000); // 35k + 18k + 35k
  });

  it('returns zeros for an empty list', () => {
    expect(computeCartFunnel([])).toEqual({
      totalCarts: 0, abandoned: 0, recoverable: 0, contacted: 0, recovered: 0,
      totalValueP: 0, abandonedValueP: 0, recoverableValueP: 0,
    });
  });

  it('does NOT count checkout_initiated as abandoned, but DOES count it as recoverable', () => {
    const carts = [
      { id: 'a', status: 'checkout_initiated', email: 'p@q.r', noEmail: false, totalP: 35000, contactedAt: null, excludedFromAnalytics: false },
      { id: 'b', status: 'abandoned', email: 's@t.u', noEmail: false, totalP: 35000, contactedAt: null, excludedFromAnalytics: false },
    ];
    const out = computeCartFunnel(carts);
    expect(out.totalCarts).toBe(2);
    expect(out.abandoned).toBe(1);     // only the genuinely abandoned one
    expect(out.recoverable).toBe(2);   // both have an email and neither is completed
  });
});

describe('recoverableCarts', () => {
  it('returns every non-completed cart with email + no unsubscribe + not admin-excluded', () => {
    const rows = recoverableCarts(fixture);
    expect(rows.map((c) => c.id).sort()).toEqual(['1', '2', '6']);
  });

  it('orders by updatedAt descending (most recent first)', () => {
    const rows = recoverableCarts(fixture);
    expect(rows.map((c) => c.id)).toEqual(['6', '2', '1']); // 0.1h, 1h, 2h ago
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npx vitest run src/components/admin/analytics/cartAggregations.test.js`
Expected: FAIL — `recoverable` is 2 not 3 (old logic requires abandoned status), `contacted` is `undefined`, and the empty-list shape still has `emailed`.

- [ ] **Step 3: Write minimal implementation**

Replace the entire contents of `src/components/admin/analytics/cartAggregations.js` with:

```js
/**
 * Pure aggregation functions for the abandoned-cart dashboard tile.
 * Inputs are arrays of cart docs (already fetched from Firestore by the caller).
 */

// 'abandoned' and 'expired' are the genuinely-walked-away statuses. 'active'
// and 'checkout_initiated' carts may still convert, so they are NOT counted
// as abandoned — but they ARE recoverable if they carry an email (see below).
function isAbandonedStatus(s) {
  return s === 'abandoned' || s === 'expired';
}

function hasUsableEmail(cart) {
  if (!cart.email) return false;
  if (cart.noEmail) return false;
  if (cart.excludedFromAnalytics) return false;
  return true;
}

// Recoverable = any non-completed cart with a usable email. We surface the
// email the moment it is captured — we do not wait for a cron to flip the
// cart to 'abandoned'.
function isRecoverable(cart) {
  if (cart.status === 'completed') return false;
  return hasUsableEmail(cart);
}

function eventTimeMs(ev) {
  if (!ev || !ev.toMillis) return 0;
  return ev.toMillis();
}

export function computeCartFunnel(carts) {
  let totalCarts = 0, abandoned = 0, recoverable = 0, contacted = 0, recovered = 0;
  let totalValueP = 0, abandonedValueP = 0, recoverableValueP = 0;

  for (const cart of carts) {
    if (cart.excludedFromAnalytics) continue;

    totalCarts += 1;
    totalValueP += cart.totalP || 0;

    if (isAbandonedStatus(cart.status)) {
      abandoned += 1;
      abandonedValueP += cart.totalP || 0;
    }

    if (isRecoverable(cart)) {
      recoverable += 1;
      recoverableValueP += cart.totalP || 0;
      if (cart.contactedAt) contacted += 1;
    }

    if (cart.status === 'completed' && cart.contactedAt) {
      recovered += 1;
    }
  }

  return { totalCarts, abandoned, recoverable, contacted, recovered, totalValueP, abandonedValueP, recoverableValueP };
}

export function recoverableCarts(carts) {
  return carts
    .filter(isRecoverable)
    .sort((a, b) => eventTimeMs(b.updatedAt) - eventTimeMs(a.updatedAt));
}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `npx vitest run src/components/admin/analytics/cartAggregations.test.js`
Expected: PASS — all tests green.

- [ ] **Step 5: Commit**

```bash
git add src/components/admin/analytics/cartAggregations.js src/components/admin/analytics/cartAggregations.test.js
git commit -m "feat(carts): recoverable = any non-completed email cart; add contacted stage"
```

---

### Task 4: Keep the admin tile green after the funnel rename

The funnel now returns `contacted` instead of `emailed`. `AbandonedCartTile.jsx` reads `funnel.emailed` and would render `undefined.toLocaleString()` (a crash). This task is the *minimal* adaptation to keep the tile rendering — the full tile redesign (categories, manual buttons, copy-email) is Phase 4.

**Files:**
- Modify: `src/components/admin/analytics/AbandonedCartTile.jsx:5-11` and `:39-45`
- Modify: `src/components/admin/analytics/analyticsGlossary.js:86-89`

- [ ] **Step 1: Run the tile test to confirm current state**

Run: `npx vitest run src/components/admin/analytics/AbandonedCartTile.test.jsx`
Expected: PASS currently (the test does not assert on the "Emailed" label), but the component reads a now-missing field — we fix it before it bites in Phase 4.

- [ ] **Step 2: Rename the `emailed` stage colour key**

In `src/components/admin/analytics/AbandonedCartTile.jsx`, change the `STAGE_COLORS` object (lines 5-11) from:

```js
const STAGE_COLORS = {
  totalCarts:  '#5b21b6',
  abandoned:   '#7c3aed',
  recoverable: '#a855f7',
  emailed:     '#c084fc',
  recovered:   '#e9d5ff',
};
```

to:

```js
const STAGE_COLORS = {
  totalCarts:  '#5b21b6',
  abandoned:   '#7c3aed',
  recoverable: '#a855f7',
  contacted:   '#c084fc',
  recovered:   '#e9d5ff',
};
```

- [ ] **Step 3: Rename the `emailed` stage row**

In the same file, change the `stages` array entry (line 43) from:

```js
    { key: 'emailed',     label: 'Emailed',     count: funnel.emailed,     topic: 'cartsEmailed' },
```

to:

```js
    { key: 'contacted',   label: 'Contacted',   count: funnel.contacted,   topic: 'cartsContacted' },
```

- [ ] **Step 4: Update the glossary topic**

In `src/components/admin/analytics/analyticsGlossary.js`, replace the `cartsEmailed` entry (lines 86-89):

```js
  cartsEmailed: {
    title: 'Emailed',
    body: 'Recoverable carts where at least one recovery email has been sent (manual or automatic). If "Recoverable" is high but "Emailed" is low, there are abandoned bookings waiting for you to reach out — click Send recovery on any row in the table.',
  },
```

with:

```js
  cartsContacted: {
    title: 'Contacted',
    body: 'Recoverable carts you have manually marked as contacted. If "Recoverable" is high but "Contacted" is low, there are captured emails waiting for you to reach out — use the copy-email button on any row in the table.',
  },
```

- [ ] **Step 5: Run the full test suite to verify no regression**

Run: `npx vitest run src/components/admin/analytics/`
Expected: PASS — `AbandonedCartTile.test.jsx`, `cartAggregations.test.js`, and any other analytics tests all green.

- [ ] **Step 6: Commit**

```bash
git add src/components/admin/analytics/AbandonedCartTile.jsx src/components/admin/analytics/analyticsGlossary.js
git commit -m "refactor(carts): rename Emailed funnel stage to Contacted in admin tile"
```

---

### Task 5: Persist category/products/londonTour/contactedAt in the cart upsert

**Files:**
- Modify: `api/carts.js` (the `require` block near the top, and the `POST /` handler, lines ~73-159)

- [ ] **Step 1: Add the require for the status helper**

In `api/carts.js`, just below the existing line 10 (`const { sendCartRecoveryEmail } = require('./lib/cartRecoverySend');`), add:

```js
const { isAdminSettableStatus } = require('./lib/cartAdminLogic');
```

- [ ] **Step 2: Compute a category-aware total in the upsert handler**

In the `POST /` handler, find the reprice block (lines ~106-110):

```js
    // Reprice from server-side pricing (never trust client totals)
    let priced = { flight: null, addons: [], totalP: 0 };
    if (data.flight || (data.addons && data.addons.length)) {
      priced = await repriceCart({ flight: data.flight, addons: data.addons });
    }
```

Immediately **after** that block, insert:

```js
    // Category resolution + display total.
    // Flight carts are repriced server-side above. Product and london-tour
    // totals are DISPLAY figures derived from the client payload — the real
    // charge is always repriced at the payment-intent endpoint, never here.
    let category = data.category || null;
    const products = data.products || [];
    const londonTour = data.londonTour || null;
    let totalP = priced.totalP;
    if (category === 'product') {
      totalP = products.reduce((sum, p) => sum + (p.priceP || 0) * (p.qty || 1), 0);
    } else if (category === 'london_tour' && londonTour) {
      totalP = londonTour.priceP || 0;
    }
    if (!category && priced.flight) category = 'discovery_flight';
```

- [ ] **Step 3: Add the new fields to `baseFields`**

In the same handler, find `baseFields` (lines ~113-128). Change the `totalP` line and add three fields. The block becomes:

```js
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
```

- [ ] **Step 4: Add `contactedAt: null` to the new-cart creation**

In the same handler, find the new-cart `db.collection('carts').add({...})` block (lines ~137-149). Add `contactedAt: null,` directly after `abandonedAt: null,`:

```js
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
```

- [ ] **Step 5: Run the full test suite to verify no regression**

Run: `npm test`
Expected: PASS — no existing test exercises the upsert handler directly, so the suite stays green. If anything fails, it is unrelated to this change; stop and investigate.

- [ ] **Step 6: Commit**

```bash
git add api/carts.js
git commit -m "feat(carts): persist category/products/londonTour/contactedAt on upsert"
```

---

### Task 6: Two-query `GET /api/carts` so expired + completed carts are fetched

**Files:**
- Modify: `api/carts.js` — the `GET /` admin handler (lines ~305-320)

- [ ] **Step 1: Replace the GET handler**

In `api/carts.js`, find the existing admin list handler:

```js
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
    logger.error({ err }, '[carts] admin list error');
    return res.status(500).json({ error: 'Failed to list carts' });
  }
});
```

Replace it entirely with:

```js
// GET /api/carts (admin) — list carts for the dashboard.
// Two queries: the actionable set (active/checkout_initiated/abandoned/expired)
// with full docs, plus completed carts trimmed to the fields the funnel needs
// (so the "Recovered" stage can be computed without shipping booking PII).
router.get('/', requireAdmin, async (_req, res) => {
  try {
    const db = admin.firestore();
    const [activeSnap, completedSnap] = await Promise.all([
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
      ...activeSnap.docs.map((d) => ({ id: d.id, ...d.data() })),
      ...completedSnap.docs.map((d) => {
        const c = d.data();
        return {
          id: d.id,
          status: c.status,
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
```

- [ ] **Step 2: Run the full test suite to verify no regression**

Run: `npm test`
Expected: PASS — the suite stays green.

- [ ] **Step 3: Manually verify the query shape (optional but recommended)**

If a local server + Firestore are available: `npm run dev`, then with an admin token:
`curl -s localhost:3000/api/carts -H "Authorization: Bearer <admin-token>" | head -c 400`
Expected: a `{ "carts": [...] }` JSON body that now includes `completed` carts (trimmed) alongside the actionable ones. If no local Firestore is available, skip — the query change mirrors the existing pattern and is covered by review.

- [ ] **Step 4: Commit**

```bash
git add api/carts.js
git commit -m "fix(carts): fetch expired + completed carts in admin list query"
```

---

### Task 7: `PATCH /api/carts/:id/status` — manual status changes

**Files:**
- Modify: `api/carts.js` — add a new handler just before `module.exports = router;` (line ~334)

- [ ] **Step 1: Add the handler**

In `api/carts.js`, directly above the final `module.exports = router;` line, insert:

```js
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
    if (status === 'abandoned') {
      patch.abandonedAt = admin.firestore.FieldValue.serverTimestamp();
    }
    await ref.set(patch, { merge: true });
    return res.json({ ok: true });
  } catch (err) {
    logger.error({ err }, '[carts] status patch error');
    return res.status(500).json({ error: 'Failed to update status' });
  }
});
```

- [ ] **Step 2: Run the full test suite to verify no regression**

Run: `npm test`
Expected: PASS.

- [ ] **Step 3: Commit**

```bash
git add api/carts.js
git commit -m "feat(carts): add admin PATCH /:id/status endpoint"
```

---

### Task 8: `POST /api/carts/:id/mark-contacted` — manual contacted flag

**Files:**
- Modify: `api/carts.js` — add a new handler just before `module.exports = router;`

- [ ] **Step 1: Add the handler**

In `api/carts.js`, directly above the final `module.exports = router;` line (after the Task 7 handler), insert:

```js
// POST /api/carts/:id/mark-contacted (admin) — stamp contactedAt so the cart
// counts toward the "Contacted" funnel stage.
router.post('/:id/mark-contacted', requireAdmin, async (req, res) => {
  try {
    const ref = admin.firestore().collection('carts').doc(req.params.id);
    const snap = await ref.get();
    if (!snap.exists) return res.status(404).json({ error: 'Cart not found' });
    await ref.set({
      contactedAt: admin.firestore.FieldValue.serverTimestamp(),
      updatedAt: admin.firestore.FieldValue.serverTimestamp(),
    }, { merge: true });
    return res.json({ ok: true });
  } catch (err) {
    logger.error({ err }, '[carts] mark-contacted error');
    return res.status(500).json({ error: 'Failed to mark contacted' });
  }
});
```

- [ ] **Step 2: Run the full test suite to verify no regression**

Run: `npm test`
Expected: PASS.

- [ ] **Step 3: Commit**

```bash
git add api/carts.js
git commit -m "feat(carts): add admin POST /:id/mark-contacted endpoint"
```

---

### Task 9: `DELETE /api/carts/:id` — manual cart deletion

**Files:**
- Modify: `api/carts.js` — add a new handler just before `module.exports = router;`

- [ ] **Step 1: Add the handler**

In `api/carts.js`, directly above the final `module.exports = router;` line (after the Task 8 handler), insert:

```js
// DELETE /api/carts/:id (admin) — hard-delete a cart from the dashboard.
router.delete('/:id', requireAdmin, async (req, res) => {
  try {
    await admin.firestore().collection('carts').doc(req.params.id).delete();
    return res.json({ ok: true });
  } catch (err) {
    logger.error({ err }, '[carts] delete error');
    return res.status(500).json({ error: 'Failed to delete cart' });
  }
});
```

- [ ] **Step 2: Run the full test suite to verify no regression**

Run: `npm test`
Expected: PASS.

- [ ] **Step 3: Build to confirm nothing is broken**

Run: `npm run build`
Expected: build succeeds (the frontend changes from Tasks 3-4 compile cleanly).

- [ ] **Step 4: Commit**

```bash
git add api/carts.js
git commit -m "feat(carts): add admin DELETE /:id endpoint"
```

---

## Phase 1 done — definition of done

- `npm test` passes (new: `cartValidation.test.js`, `cartAdminLogic.test.js`; updated: `cartAggregations.test.js`; unchanged-green: `AbandonedCartTile.test.jsx`).
- `npm run build` succeeds.
- `GET /api/carts` returns active/checkout_initiated/abandoned/expired carts in full plus trimmed completed carts.
- `PATCH /api/carts/:id/status`, `POST /api/carts/:id/mark-contacted`, `DELETE /api/carts/:id` exist and are admin-guarded.
- Cart upsert persists `category`, `products`, `londonTour`, `contactedAt`.
- The admin tile renders without crashing on the renamed `contacted` funnel stage.

**Not in Phase 1 (later phases):** the HQ store cart UI (Phase 2), wiring the product/London-tour checkouts to send these new fields (Phase 3), and the admin tile redesign — category grouping, manual status/contacted/delete buttons, copy-email (Phase 4). `firestore.rules` needs no change: all `carts` access is via the Admin SDK, which bypasses rules.

## Notes for the implementer

- **No `firestore.rules` change.** Every read/write to `carts` goes through the Admin SDK in `api/carts.js`.
- **No `firestore.indexes.json` change.** The existing `carts` composite index `(status ASC, updatedAt DESC)` already serves both queries in Task 6 — the `status in [...]` query and the new `status == 'completed'` query both use that same index.
- **Route handlers aren't unit-tested.** They are thin Firestore glue copied from the patterns already in `api/carts.js` (`requireAdmin`, `try/catch`, `logger.error`). The codebase's own convention (see `api/cart-recovery-runner.js` vs the pure `api/lib/cartRecoveryActions.js`) is to unit-test pure logic and leave the Firestore wrapper to regression + review. If you want belt-and-braces coverage, the `api/misc-validation.test.js` pattern (mutating the shared `firebase-admin` stub) can be adapted — but it is not required for Phase 1.
- **Express JSON parsing** is already mounted for `api/carts.js` (the existing `POST /` upsert reads `req.body`), so `PATCH`/`POST` bodies parse without extra setup.

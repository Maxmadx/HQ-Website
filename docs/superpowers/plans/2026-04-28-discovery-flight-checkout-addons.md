# Discovery Flight Checkout Add-ons Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Let buyers add HQ Store items as discounted add-ons during the Discovery Flight checkout, billed in a single Stripe charge alongside the flight, with collect-on-the-day or delivery fulfilment.

**Architecture:** Two new fields (`discoveryAddon: bool`, `discoveryAddonDiscountPct: 0–100`) on each `misc_items` Firestore doc. Admin form gains a section to flag/discount items when `priceType === 'fixed'`. The DF checkout page fetches flagged items, renders cards with qty selectors and a basket-wide fulfilment toggle, then posts `{addons, fulfilment, shippingAddress?}` to `/api/create-payment-intent`. Server validates flag/qty/price from Firestore (never trusts client prices), sums flight + addon totals into one PaymentIntent, and records add-ons + fulfilment on the booking + confirmation email.

**Tech Stack:** React + react-router-dom, Firebase Firestore, Stripe (Node SDK), Vitest. CommonJS in `api/`, ESM in `src/`. No RTL — hook tests manually mock React + Firestore (matching `src/hooks/useDocument.test.js`).

**Spec:** `docs/superpowers/specs/2026-04-28-discovery-flight-checkout-addons-design.md`

---

## File Structure

| Path | Status | Responsibility |
| --- | --- | --- |
| `src/lib/discoveryAddons.js` | Create | Pure helpers: `computeLineTotal`, `computeAddonsTotal`. No I/O. |
| `src/lib/discoveryAddons.test.js` | Create | Vitest unit tests for the helpers. |
| `src/hooks/useDiscoveryAddons.js` | Create | Subscribes to `misc_items where discoveryAddon == true`, returns `{ items, loading }`. |
| `src/hooks/useDiscoveryAddons.test.js` | Create | Vitest test, mocks Firestore + React (mirrors `useDocument.test.js`). |
| `src/components/checkout/DiscoveryAddons.jsx` | Create | Cards (image, name, price, qty), fulfilment radios, address fields. Lifts state via `value`/`onChange`. |
| `src/pages/Checkout.jsx` | Modify | Owns `addonsState`. In DF mode, renders `<DiscoveryAddons />` and passes `addonsState` into `CheckoutForm` POST body. Updates Order Summary total live. |
| `src/pages/admin/AdminMiscItemEdit.jsx` | Modify | Adds DF Add-on form block (toggle + discount %). Forces `discoveryAddonDiscountPct=0` and `discoveryAddon=false` when `priceType='poa'`. |
| `src/pages/admin/AdminMiscItems.jsx` | Modify | Renders a "DF" pill on list rows where `discoveryAddon === true`. |
| `api/stripe.js` | Modify | New helpers `applyDiscountPence`, `priceAddons`. Extend `createPaymentIntent` (sum flight + addons; force delivery on voucher). Extend `recordBooking` (write addons, fulfilment, shippingAddress). Update DF confirmation email template. |
| `api/stripe.test.js` | Modify | Vitest tests for `applyDiscountPence` and `priceAddons`. |

---

## Task 1 — Pure helpers in `src/lib/discoveryAddons.js`

**Files:**
- Create: `src/lib/discoveryAddons.js`
- Test: `src/lib/discoveryAddons.test.js`

These are the same arithmetic the server runs, but used purely for the live UI total. Server still recomputes from Firestore — UI numbers are cosmetic.

- [ ] **Step 1: Write the failing tests**

`src/lib/discoveryAddons.test.js`:

```js
import { describe, it, expect } from 'vitest';
import { computeLineTotal, computeAddonsTotal } from './discoveryAddons';

describe('computeLineTotal', () => {
  it('returns price × qty when discount is 0', () => {
    expect(computeLineTotal({ price: 2500, qty: 3, discountPct: 0 })).toBe(7500);
  });

  it('applies a percentage discount and rounds to nearest pence', () => {
    // 2500 × 1 × (1 - 0.30) = 1750
    expect(computeLineTotal({ price: 2500, qty: 1, discountPct: 30 })).toBe(1750);
    // 333 × 1 × 0.7 = 233.1 → 233
    expect(computeLineTotal({ price: 333, qty: 1, discountPct: 30 })).toBe(233);
  });

  it('treats missing discountPct as 0', () => {
    expect(computeLineTotal({ price: 1000, qty: 2 })).toBe(2000);
  });

  it('returns 0 when qty is 0', () => {
    expect(computeLineTotal({ price: 5000, qty: 0, discountPct: 50 })).toBe(0);
  });

  it('clamps negative discount to 0 and >100 to 100', () => {
    expect(computeLineTotal({ price: 1000, qty: 1, discountPct: -10 })).toBe(1000);
    expect(computeLineTotal({ price: 1000, qty: 1, discountPct: 200 })).toBe(0);
  });
});

describe('computeAddonsTotal', () => {
  it('sums line totals across multiple items', () => {
    const items = [
      { price: 2500, qty: 2, discountPct: 0 },   // 5000
      { price: 1000, qty: 1, discountPct: 30 },  // 700
    ];
    expect(computeAddonsTotal(items)).toBe(5700);
  });

  it('returns 0 for an empty array', () => {
    expect(computeAddonsTotal([])).toBe(0);
  });
});
```

- [ ] **Step 2: Run the test to confirm it fails**

```bash
npx vitest run src/lib/discoveryAddons.test.js
```
Expected: FAIL — module not found.

- [ ] **Step 3: Implement the helpers**

`src/lib/discoveryAddons.js`:

```js
export function computeLineTotal({ price, qty, discountPct = 0 }) {
  const pct = Math.max(0, Math.min(100, Number(discountPct) || 0));
  return Math.round(Number(price) * Number(qty) * (1 - pct / 100));
}

export function computeAddonsTotal(items) {
  return items.reduce((sum, it) => sum + computeLineTotal(it), 0);
}
```

- [ ] **Step 4: Run the test, expect PASS**

```bash
npx vitest run src/lib/discoveryAddons.test.js
```

- [ ] **Step 5: Commit**

```bash
git add src/lib/discoveryAddons.js src/lib/discoveryAddons.test.js
git commit -m "feat(checkout): pure helpers for DF add-on line totals"
```

---

## Task 2 — Server: `applyDiscountPence` helper

**Files:**
- Modify: `api/stripe.js` (add helper near top, before `getPrice`)
- Modify: `api/stripe.test.js` (add a `describe` block at the bottom)

- [ ] **Step 1: Write the failing test**

Append to `api/stripe.test.js`:

```js
import { applyDiscountPence } from './stripe.js';

describe('applyDiscountPence', () => {
  it('returns price × qty when pct is 0', () => {
    expect(applyDiscountPence(2500, 3, 0)).toBe(7500);
  });

  it('applies the discount and rounds to integer pence', () => {
    expect(applyDiscountPence(2500, 1, 30)).toBe(1750);
    expect(applyDiscountPence(333, 1, 30)).toBe(233);
  });

  it('clamps invalid pct values', () => {
    expect(applyDiscountPence(1000, 1, -10)).toBe(1000);
    expect(applyDiscountPence(1000, 1, 200)).toBe(0);
  });
});
```

- [ ] **Step 2: Run, confirm fails**

```bash
npx vitest run api/stripe.test.js
```
Expected: FAIL — `applyDiscountPence is not a function`.

- [ ] **Step 3: Implement in `api/stripe.js`**

After `function getStripe() { … }`, add:

```js
function applyDiscountPence(pricePence, qty, discountPct) {
  const pct = Math.max(0, Math.min(100, Number(discountPct) || 0));
  return Math.round(Number(pricePence) * Number(qty) * (1 - pct / 100));
}
```

Update the `module.exports` line at the bottom of the file:

```js
module.exports = { getPrice, applyDiscountPence, createPaymentIntent, getLondonTourPrice, createLondonTourPaymentIntent, createMiscPaymentIntent, handleWebhook, recordBooking };
```

- [ ] **Step 4: Run, expect PASS**

```bash
npx vitest run api/stripe.test.js
```

- [ ] **Step 5: Commit**

```bash
git add api/stripe.js api/stripe.test.js
git commit -m "feat(api): applyDiscountPence helper for DF add-ons"
```

---

## Task 3 — Server: `priceAddons(addons)` validates + prices addons against Firestore

**Files:**
- Modify: `api/stripe.js`
- Modify: `api/stripe.test.js`

This function takes `[{ itemId, qty }]`, fetches each `misc_items` doc, validates, and returns `{ lineItems, total }`. Throws `Error` with `statusCode = 400` on invalid input.

- [ ] **Step 1: Write the failing test**

Append to `api/stripe.test.js` (at top, expand the imports and Firestore mock to allow per-doc fetches):

```js
import { priceAddons } from './stripe.js';

describe('priceAddons', () => {
  it('returns total 0 and empty lineItems for an empty array', async () => {
    const result = await priceAddons([]);
    expect(result).toEqual({ lineItems: [], total: 0 });
  });

  // Note: the live Firestore-backed branches are exercised via integration
  // through createPaymentIntent below; pure unit testing of those branches
  // is out of scope here because they require a Firestore mock that
  // mirrors the production admin SDK shape used in stripe.js.
});
```

- [ ] **Step 2: Run, confirm fails**

```bash
npx vitest run api/stripe.test.js -t "priceAddons"
```
Expected: FAIL — `priceAddons is not a function`.

- [ ] **Step 3: Implement `priceAddons` in `api/stripe.js`**

Add after `applyDiscountPence`:

```js
async function priceAddons(addons) {
  if (!Array.isArray(addons) || addons.length === 0) {
    return { lineItems: [], total: 0 };
  }

  const lineItems = [];
  let total = 0;

  for (const entry of addons) {
    const itemId = entry && entry.itemId;
    const qty = Number(entry && entry.qty);

    if (!itemId || !Number.isInteger(qty) || qty < 1 || qty > 10) {
      const err = new Error(`Invalid add-on entry: ${JSON.stringify(entry)}`);
      err.statusCode = 400;
      throw err;
    }

    const snap = await admin.firestore().collection('misc_items').doc(itemId).get();
    if (!snap.exists) {
      const err = new Error(`Add-on not found: ${itemId}`);
      err.statusCode = 400;
      throw err;
    }
    const data = snap.data();
    if (data.discoveryAddon !== true) {
      const err = new Error(`Add-on is no longer available: ${itemId}`);
      err.statusCode = 400;
      throw err;
    }
    if (data.priceType !== 'fixed' || !(Number(data.price) > 0)) {
      const err = new Error(`Add-on misconfigured: ${itemId}`);
      err.statusCode = 400;
      throw err;
    }

    const lineTotal = applyDiscountPence(data.price, qty, data.discoveryAddonDiscountPct);
    total += lineTotal;
    lineItems.push({
      itemId,
      name: data.name,
      qty,
      unitPrice: data.price,
      discountPct: Number(data.discoveryAddonDiscountPct) || 0,
      lineTotal,
    });
  }

  return { lineItems, total };
}
```

Update `module.exports`:

```js
module.exports = { getPrice, applyDiscountPence, priceAddons, createPaymentIntent, getLondonTourPrice, createLondonTourPaymentIntent, createMiscPaymentIntent, handleWebhook, recordBooking };
```

- [ ] **Step 4: Run, expect PASS**

```bash
npx vitest run api/stripe.test.js -t "priceAddons"
```

- [ ] **Step 5: Commit**

```bash
git add api/stripe.js api/stripe.test.js
git commit -m "feat(api): priceAddons validates and prices DF add-ons from Firestore"
```

---

## Task 4 — Server: extend `createPaymentIntent` to accept addons + fulfilment

**Files:**
- Modify: `api/stripe.js` (function at line ~95)

- [ ] **Step 1: Replace the function signature and body**

Locate `async function createPaymentIntent(...)` and replace it with:

```js
async function createPaymentIntent({
  aircraft, duration, customerName, customerEmail, customerPhone,
  wantsVoucher, voucherLocation, voucherMessage,
  addons = [], fulfilment, shippingAddress,
}) {
  const flightAmount = await getPrice(aircraft, duration);
  if (flightAmount === null) {
    const err = new Error(`Invalid aircraft or duration: ${aircraft} / ${duration}`);
    err.statusCode = 400;
    throw err;
  }

  const { lineItems, total: addonsAmount } = await priceAddons(addons);

  // Fulfilment is only relevant when there are add-ons. Voucher buyers
  // must pick delivery — recipient redeems the flight later.
  let resolvedFulfilment = null;
  let resolvedAddress = null;
  if (lineItems.length > 0) {
    resolvedFulfilment = wantsVoucher ? 'delivery' : (fulfilment || 'collect');
    if (resolvedFulfilment !== 'collect' && resolvedFulfilment !== 'delivery') {
      const err = new Error(`Invalid fulfilment: ${fulfilment}`);
      err.statusCode = 400;
      throw err;
    }
    if (resolvedFulfilment === 'delivery') {
      const a = shippingAddress || {};
      if (!a.line1 || !a.city || !a.postcode) {
        const err = new Error('Delivery address is required (line1, city, postcode)');
        err.statusCode = 400;
        throw err;
      }
      resolvedAddress = {
        line1: String(a.line1),
        line2: String(a.line2 || ''),
        city: String(a.city),
        postcode: String(a.postcode),
      };
    }
  }

  const amount = flightAmount + addonsAmount;

  // Stripe metadata values are capped at 500 chars. Try the rich form first,
  // fall back to a compact form keyed on itemId+qty.
  const richAddons = JSON.stringify(lineItems);
  const compactAddons = JSON.stringify(lineItems.map((l) => ({ id: l.itemId, q: l.qty })));
  const addonsMeta = richAddons.length <= 500 ? richAddons : compactAddons;

  const paymentIntent = await getStripe().paymentIntents.create({
    amount,
    currency: 'gbp',
    metadata: {
      productType: 'discovery-flight',
      aircraft,
      aircraftName: AIRCRAFT_NAMES[aircraft],
      duration: String(duration),
      customerName,
      customerEmail,
      customerPhone,
      wantsVoucher: wantsVoucher ? 'true' : 'false',
      voucherLocation: voucherLocation || '',
      voucherMessage: voucherMessage || '',
      addons: lineItems.length > 0 ? addonsMeta : '',
      fulfilment: resolvedFulfilment || '',
      shippingLine1: resolvedAddress ? resolvedAddress.line1 : '',
      shippingLine2: resolvedAddress ? resolvedAddress.line2 : '',
      shippingCity: resolvedAddress ? resolvedAddress.city : '',
      shippingPostcode: resolvedAddress ? resolvedAddress.postcode : '',
    },
  });

  return paymentIntent;
}
```

- [ ] **Step 2: Run all stripe tests**

```bash
npx vitest run api/stripe.test.js
```
Expected: PASS — existing `getPrice` and new helper tests still green.

- [ ] **Step 3: Commit**

```bash
git add api/stripe.js
git commit -m "feat(api): include DF add-ons + fulfilment in payment intent"
```

---

## Task 5 — Server: extend `recordBooking` to persist addons + fulfilment

**Files:**
- Modify: `api/stripe.js` — `recordBooking` (around line 594)

- [ ] **Step 1: Read the existing function**

Read `api/stripe.js` around the `recordBooking` function. Identify where the booking doc is built from `paymentIntent.metadata`.

- [ ] **Step 2: Add addons + fulfilment to the booking doc**

Inside `recordBooking`, after the existing fields are assembled, add:

```js
const addonsCount = parseInt(paymentIntent.metadata.addonsCount || '0', 10) || 0;
const parsedAddons = [];
for (let i = 0; i < addonsCount; i++) {
  const raw = paymentIntent.metadata[`addon_${i}`];
  if (!raw) continue;
  try {
    const item = JSON.parse(raw);
    if (item && typeof item === 'object') parsedAddons.push(item);
  } catch (_) {
    // skip malformed entry, continue with the rest
  }
}

const fulfilment = paymentIntent.metadata.fulfilment || null;
const shippingAddress = fulfilment === 'delivery'
  ? {
      line1: paymentIntent.metadata.shippingLine1 || '',
      line2: paymentIntent.metadata.shippingLine2 || '',
      city: paymentIntent.metadata.shippingCity || '',
      postcode: paymentIntent.metadata.shippingPostcode || '',
    }
  : null;
```

Then merge these into the object that gets written to Firestore:

```js
addons: parsedAddons,
fulfilment,
shippingAddress,
```

- [ ] **Step 3: Run all server tests**

```bash
npx vitest run api/stripe.test.js
```
Expected: PASS.

- [ ] **Step 4: Commit**

```bash
git add api/stripe.js
git commit -m "feat(api): record DF add-ons + fulfilment on booking"
```

---

## Task 6 — Server: list addons + fulfilment in confirmation email

**Files:**
- Modify: `api/stripe.js` — `sendConfirmationEmail` (around line 185)

- [ ] **Step 1: Inspect the existing template**

Open `api/stripe.js` and read `sendConfirmationEmail`. Identify the existing HTML body block.

- [ ] **Step 2: Pass addons + fulfilment through and render them**

Update the function signature and call sites so addons/fulfilment/shippingAddress flow in. Inside the body, before the closing tags, insert:

```js
const addonsHtml = (addons && addons.length > 0)
  ? `
    <h3 style="margin-top:24px">Add-ons</h3>
    <ul style="padding-left:20px">
      ${addons.map((a) => {
        const unit = (a.unitPrice / 100).toFixed(2);
        const line = (a.lineTotal / 100).toFixed(2);
        const disc = a.discountPct > 0 ? ` (${a.discountPct}% off)` : '';
        return `<li>${escapeHtml(a.name)} × ${a.qty} — £${unit}${disc} = £${line}</li>`;
      }).join('')}
    </ul>
    <p><strong>Fulfilment:</strong> ${
      fulfilment === 'delivery'
        ? `Delivery to ${escapeHtml([shippingAddress.line1, shippingAddress.line2, shippingAddress.city, shippingAddress.postcode].filter(Boolean).join(', '))}`
        : 'Collect at Denham on the day of your flight.'
    }</p>
  `
  : '';
```

Then concatenate `addonsHtml` into the existing HTML body string.

Where `recordBooking` (or wherever `sendConfirmationEmail` is invoked) calls this function, pass the parsed `addons`, `fulfilment`, and `shippingAddress` through.

- [ ] **Step 3: Smoke test by running all server tests**

```bash
npx vitest run api/stripe.test.js
```

- [ ] **Step 4: Commit**

```bash
git add api/stripe.js
git commit -m "feat(api): include add-ons + fulfilment in DF confirmation email"
```

---

## Task 7 — Admin: extend `AdminMiscItemEdit` form

**Files:**
- Modify: `src/pages/admin/AdminMiscItemEdit.jsx`

- [ ] **Step 1: Add fields to `EMPTY`**

Replace the `EMPTY` const at the top:

```js
const EMPTY = {
  name: '',
  category: '',
  priceType: 'poa',
  price: 0,
  priceDisplay: 'POA',
  hasQuantity: false,
  stock: 1,
  requiresShipping: false,
  condition: 'new',
  description: '',
  images: [],
  discoveryAddon: false,
  discoveryAddonDiscountPct: 0,
};
```

- [ ] **Step 2: Force the fields off when not applicable on save**

In `handleSubmit`, modify the `payload` build so POA items / unflagged items can never carry a discount. Replace the existing `payload` line with:

```js
const isAddon = form.priceType === 'fixed' && form.discoveryAddon === true;
const payload = {
  ...form,
  priceDisplay,
  ...(form.priceType === 'poa' ? { price: 0, hasQuantity: false, stock: 1, requiresShipping: false } : {}),
  discoveryAddon: isAddon,
  discoveryAddonDiscountPct: isAddon ? Math.max(0, Math.min(100, parseInt(form.discoveryAddonDiscountPct, 10) || 0)) : 0,
};
```

- [ ] **Step 3: Add the form section UI**

Inside the form, immediately after the existing `Shipping` checkbox block (the one that sets `requiresShipping`), insert (only renders when `priceType === 'fixed'`):

```jsx
{form.priceType === 'fixed' && (
  <div>
    <label style={labelStyle}>Discovery Flight Add-on</label>
    <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer', fontSize: '0.875rem', color: '#374151', marginBottom: '0.5rem' }}>
      <input
        type="checkbox"
        checked={form.discoveryAddon}
        onChange={(e) => set('discoveryAddon', e.target.checked)}
      />
      Show on Discovery Flight checkout
    </label>
    {form.discoveryAddon && (
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginTop: '0.5rem' }}>
        <label style={{ ...labelStyle, margin: 0, textTransform: 'none', letterSpacing: 0, fontSize: '0.8rem' }}>
          Discount on Discovery Flight checkout:
        </label>
        <input
          style={{ ...fieldStyle, width: '80px' }}
          type="number"
          min="0"
          max="100"
          step="1"
          value={form.discoveryAddonDiscountPct}
          onChange={(e) => set('discoveryAddonDiscountPct', e.target.value)}
        />
        <span style={{ fontSize: '0.85rem', color: '#374151' }}>%</span>
        <span style={{ fontSize: '0.75rem', color: '#6b7280' }}>Leave as 0 for no discount.</span>
      </div>
    )}
  </div>
)}
```

- [ ] **Step 4: Sanity-check by starting the dev server**

```bash
npm run dev
```
Then open `http://localhost:5173/admin/misc/<existing-id>` and confirm:
- POA items: no DF Add-on section visible.
- Fixed items: section appears, toggle works, discount input revealed only when toggle on.
- Save reloads with values persisted.

Stop the dev server when done.

- [ ] **Step 5: Commit**

```bash
git add src/pages/admin/AdminMiscItemEdit.jsx
git commit -m "feat(admin): add DF add-on toggle + discount field to misc item editor"
```

---

## Task 8 — Admin: DF pill on `AdminMiscItems` list rows

**Files:**
- Modify: `src/pages/admin/AdminMiscItems.jsx`

- [ ] **Step 1: Locate the row template**

Open `src/pages/admin/AdminMiscItems.jsx` and find where each row's name + meta is rendered.

- [ ] **Step 2: Add the pill**

Next to the row name (or in the right-side meta cluster), insert:

```jsx
{item.discoveryAddon && (
  <span style={{
    display: 'inline-block',
    fontSize: '0.65rem',
    fontWeight: 700,
    letterSpacing: '0.05em',
    background: '#1a1a1a',
    color: '#fff',
    padding: '2px 6px',
    borderRadius: '3px',
    marginLeft: '0.5rem',
  }}>DF</span>
)}
```

- [ ] **Step 3: Visual check**

```bash
npm run dev
```
Open `/admin/misc`. Toggle DF on a fixed-price item → list should show the `DF` pill. Stop the server.

- [ ] **Step 4: Commit**

```bash
git add src/pages/admin/AdminMiscItems.jsx
git commit -m "feat(admin): show DF pill on misc items flagged as add-ons"
```

---

## Task 9 — Hook: `useDiscoveryAddons`

**Files:**
- Create: `src/hooks/useDiscoveryAddons.js`
- Create: `src/hooks/useDiscoveryAddons.test.js`

- [ ] **Step 1: Write the failing test**

`src/hooks/useDiscoveryAddons.test.js` (mirroring `useDocument.test.js`):

```js
import { describe, it, expect, vi } from 'vitest';

const { mockOnSnapshot, mockQuery, mockWhere } = vi.hoisted(() => ({
  mockOnSnapshot: vi.fn(() => () => {}),
  mockQuery: vi.fn((...args) => args),
  mockWhere: vi.fn(() => 'where-clause'),
}));

const { mockUseState, mockUseEffect } = vi.hoisted(() => ({
  mockUseState: vi.fn(),
  mockUseEffect: vi.fn(),
}));

vi.mock('react', () => ({
  useState: mockUseState,
  useEffect: mockUseEffect,
}));

vi.mock('../lib/firebase', () => ({ db: {} }));

vi.mock('firebase/firestore', () => ({
  collection: vi.fn(() => 'col-ref'),
  query: mockQuery,
  where: mockWhere,
  onSnapshot: mockOnSnapshot,
}));

import { useDiscoveryAddons } from './useDiscoveryAddons';

describe('useDiscoveryAddons', () => {
  it('queries misc_items where discoveryAddon == true and subscribes', () => {
    mockUseState.mockImplementation((initial) => [initial, () => {}]);
    mockUseEffect.mockImplementation((fn) => fn());

    useDiscoveryAddons();

    expect(mockWhere).toHaveBeenCalledWith('discoveryAddon', '==', true);
    expect(mockOnSnapshot).toHaveBeenCalled();
  });
});
```

- [ ] **Step 2: Run, confirm fails**

```bash
npx vitest run src/hooks/useDiscoveryAddons.test.js
```
Expected: FAIL — module not found.

- [ ] **Step 3: Implement the hook**

`src/hooks/useDiscoveryAddons.js`:

```js
import { useState, useEffect } from 'react';
import { collection, query, where, onSnapshot } from 'firebase/firestore';
import { db } from '../lib/firebase';

export function useDiscoveryAddons() {
  const [state, setState] = useState({ items: [], loading: true });

  useEffect(() => {
    const q = query(collection(db, 'misc_items'), where('discoveryAddon', '==', true));
    const unsub = onSnapshot(q, (snap) => {
      const items = snap.docs.map((d) => ({ id: d.id, ...d.data() }));
      items.sort((a, b) => {
        const da = Number(b.discoveryAddonDiscountPct) || 0;
        const db_ = Number(a.discoveryAddonDiscountPct) || 0;
        if (da !== db_) return da - db_;
        return String(a.name || '').localeCompare(String(b.name || ''));
      });
      setState({ items, loading: false });
    });
    return () => unsub();
  }, []);

  return state;
}
```

- [ ] **Step 4: Run, expect PASS**

```bash
npx vitest run src/hooks/useDiscoveryAddons.test.js
```

- [ ] **Step 5: Commit**

```bash
git add src/hooks/useDiscoveryAddons.js src/hooks/useDiscoveryAddons.test.js
git commit -m "feat(checkout): useDiscoveryAddons hook subscribes to flagged store items"
```

---

## Task 10 — Component: `DiscoveryAddons`

**Files:**
- Create: `src/components/checkout/DiscoveryAddons.jsx`

This is a controlled component:
- `value`: `{ qtyByItemId: { [itemId]: number }, fulfilment: 'collect'|'delivery', shippingAddress: { line1, line2, city, postcode } }`
- `onChange(next)`: parent updates state.
- `voucherActive`: boolean. When true, fulfilment locks to delivery and the collect radio is disabled.

- [ ] **Step 1: Create the component**

`src/components/checkout/DiscoveryAddons.jsx`:

```jsx
import React, { useEffect } from 'react';
import { useDiscoveryAddons } from '../../hooks/useDiscoveryAddons';
import { computeLineTotal } from '../../lib/discoveryAddons';

const fmtGbp = (pence) => `£${(Number(pence) / 100).toLocaleString('en-GB', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

export default function DiscoveryAddons({ value, onChange, voucherActive = false }) {
  const { items, loading } = useDiscoveryAddons();

  // Force fulfilment to delivery whenever voucher becomes active.
  useEffect(() => {
    if (voucherActive && value.fulfilment !== 'delivery') {
      onChange({ ...value, fulfilment: 'delivery' });
    }
  }, [voucherActive, value, onChange]);

  if (loading) return null;
  if (items.length === 0) return null;

  const qtyByItemId = value.qtyByItemId || {};
  const anyInBasket = Object.values(qtyByItemId).some((q) => q > 0);

  const setQty = (itemId, qty) => {
    const next = { ...qtyByItemId, [itemId]: qty };
    if (qty <= 0) delete next[itemId];
    const stillAny = Object.values(next).some((q) => q > 0);
    onChange({
      ...value,
      qtyByItemId: next,
      ...(stillAny ? {} : { fulfilment: 'collect', shippingAddress: { line1: '', line2: '', city: '', postcode: '' } }),
    });
  };

  const setFulfilment = (fulfilment) => {
    if (voucherActive && fulfilment === 'collect') return;
    onChange({ ...value, fulfilment });
  };

  const setAddress = (patch) => {
    onChange({ ...value, shippingAddress: { ...(value.shippingAddress || {}), ...patch } });
  };

  return (
    <div style={S.box}>
      <h3 style={S.title}>Add to your booking</h3>
      <p style={S.intro}>Get more from your discovery flight.</p>

      <ul style={S.list}>
        {items.map((item) => {
          const primary = (item.images || []).find((i) => i.isPrimary) || (item.images || [])[0];
          const qty = qtyByItemId[item.id] || 0;
          const pct = Number(item.discoveryAddonDiscountPct) || 0;
          const discountedUnit = computeLineTotal({ price: item.price, qty: 1, discountPct: pct });

          return (
            <li key={item.id} style={S.row}>
              {primary && <img src={primary.url} alt={item.name} style={S.thumb} />}
              <div style={S.info}>
                <div style={S.nameRow}>
                  <span style={S.name}>{item.name}</span>
                  {pct > 0 && <span style={S.pill}>{pct}% OFF</span>}
                </div>
                <div style={S.priceRow}>
                  {pct > 0 ? (
                    <>
                      <span style={S.priceStrike}>{fmtGbp(item.price)}</span>
                      <span style={S.priceFinal}>{fmtGbp(discountedUnit)}</span>
                    </>
                  ) : (
                    <span style={S.priceFinal}>{fmtGbp(item.price)}</span>
                  )}
                </div>
              </div>
              <div style={S.qty}>
                <button type="button" onClick={() => setQty(item.id, Math.max(0, qty - 1))} style={S.qtyBtn}>−</button>
                <span style={S.qtyN}>{qty}</span>
                <button type="button" onClick={() => setQty(item.id, Math.min(10, qty + 1))} style={S.qtyBtn}>+</button>
              </div>
            </li>
          );
        })}
      </ul>

      {anyInBasket && (
        <div style={S.fulfil}>
          <span style={S.fulfilLabel}>Fulfilment:</span>
          <label style={{ ...S.radio, opacity: voucherActive ? 0.5 : 1 }}>
            <input
              type="radio"
              name="df-fulfilment"
              value="collect"
              checked={value.fulfilment === 'collect' && !voucherActive}
              onChange={() => setFulfilment('collect')}
              disabled={voucherActive}
            />
            Collect on the day
          </label>
          <label style={S.radio}>
            <input
              type="radio"
              name="df-fulfilment"
              value="delivery"
              checked={value.fulfilment === 'delivery' || voucherActive}
              onChange={() => setFulfilment('delivery')}
            />
            Delivery
          </label>
          {voucherActive && (
            <span style={S.note}>Required because the recipient redeems the flight later.</span>
          )}

          {(value.fulfilment === 'delivery' || voucherActive) && (
            <div style={S.addr}>
              <input style={S.input} placeholder="Address line 1" value={value.shippingAddress?.line1 || ''} onChange={(e) => setAddress({ line1: e.target.value })} required />
              <input style={S.input} placeholder="Address line 2 (optional)" value={value.shippingAddress?.line2 || ''} onChange={(e) => setAddress({ line2: e.target.value })} />
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
                <input style={S.input} placeholder="City" value={value.shippingAddress?.city || ''} onChange={(e) => setAddress({ city: e.target.value })} required />
                <input style={S.input} placeholder="Postcode" value={value.shippingAddress?.postcode || ''} onChange={(e) => setAddress({ postcode: e.target.value })} required />
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

const S = {
  box: { border: '1px solid #e8e6e2', borderRadius: 8, padding: 16, background: '#faf9f6', marginBottom: 16 },
  title: { fontSize: '1rem', fontWeight: 700, margin: '0 0 4px', textTransform: 'uppercase', letterSpacing: '0.05em' },
  intro: { fontSize: '0.85rem', color: '#666', margin: '0 0 12px' },
  list: { listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: 12 },
  row: { display: 'grid', gridTemplateColumns: '64px 1fr auto', gap: 12, alignItems: 'center' },
  thumb: { width: 64, height: 64, objectFit: 'cover', borderRadius: 6, border: '1px solid #e8e6e2' },
  info: { minWidth: 0 },
  nameRow: { display: 'flex', alignItems: 'center', gap: 8 },
  name: { fontWeight: 600, fontSize: '0.9rem' },
  pill: { fontSize: '0.6rem', fontWeight: 700, background: '#1a1a1a', color: '#fff', padding: '2px 6px', borderRadius: 3, letterSpacing: '0.05em' },
  priceRow: { fontSize: '0.85rem', display: 'flex', gap: 8, alignItems: 'baseline' },
  priceStrike: { color: '#999', textDecoration: 'line-through' },
  priceFinal: { color: '#1a1a1a', fontWeight: 700 },
  qty: { display: 'inline-flex', alignItems: 'center', gap: 8 },
  qtyBtn: { width: 28, height: 28, border: '1px solid #d1d5db', background: '#fff', cursor: 'pointer', borderRadius: 4, fontSize: '1rem' },
  qtyN: { minWidth: 20, textAlign: 'center', fontVariantNumeric: 'tabular-nums' },
  fulfil: { marginTop: 16, paddingTop: 16, borderTop: '1px solid #e8e6e2', display: 'flex', flexDirection: 'column', gap: 8 },
  fulfilLabel: { fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.1em', color: '#374151' },
  radio: { display: 'inline-flex', alignItems: 'center', gap: 6, cursor: 'pointer', fontSize: '0.875rem' },
  note: { fontSize: '0.75rem', color: '#6b7280', fontStyle: 'italic' },
  addr: { display: 'flex', flexDirection: 'column', gap: 8, marginTop: 8 },
  input: { padding: '8px 10px', border: '1px solid #d1d5db', borderRadius: 6, fontSize: '0.875rem', boxSizing: 'border-box', width: '100%' },
};
```

- [ ] **Step 2: Quick syntax check**

```bash
npx vite build --mode development 2>&1 | tail -20
```
Expected: builds without errors related to the new file (warnings about other files OK).

- [ ] **Step 3: Commit**

```bash
git add src/components/checkout/DiscoveryAddons.jsx
git commit -m "feat(checkout): DiscoveryAddons component (cards, qty, fulfilment, address)"
```

---

## Task 11 — Wire `DiscoveryAddons` into `Checkout.jsx`

**Files:**
- Modify: `src/pages/Checkout.jsx`

- [ ] **Step 1: Add state in `Checkout` component**

After the existing `wantsVoucher`/`voucherLocation`/`voucherMessage` state (around line 366), add:

```jsx
const [addonsState, setAddonsState] = useState({
  qtyByItemId: {},
  fulfilment: 'collect',
  shippingAddress: { line1: '', line2: '', city: '', postcode: '' },
});
```

- [ ] **Step 2: Import the component + helpers**

At the top of the file, alongside existing imports:

```jsx
import DiscoveryAddons from '../components/checkout/DiscoveryAddons';
import { computeAddonsTotal, computeLineTotal } from '../lib/discoveryAddons';
import { useDiscoveryAddons } from '../hooks/useDiscoveryAddons';
```

- [ ] **Step 3: Compute live total in DF mode**

Inside the DF branch of the JSX (after `{wantsVoucher && (...)}` block in the Order Summary), call `useDiscoveryAddons` once at the top of `Checkout()` and derive the total. Add at the top of the component (after the existing `useState` calls):

```jsx
const { items: allAddons } = useDiscoveryAddons();

const basketAddons = (allAddons || []).flatMap((it) => {
  const qty = addonsState.qtyByItemId[it.id] || 0;
  if (qty <= 0) return [];
  return [{
    itemId: it.id,
    name: it.name,
    qty,
    price: it.price,
    discountPct: Number(it.discoveryAddonDiscountPct) || 0,
    lineTotal: computeLineTotal({ price: it.price, qty, discountPct: it.discoveryAddonDiscountPct }),
  }];
});

const addonsTotalPence = computeAddonsTotal(
  basketAddons.map((a) => ({ price: a.price, qty: a.qty, discountPct: a.discountPct }))
);
const addonsTotalPounds = addonsTotalPence / 100;

const flightPricePounds = Number(price) || 0;
const grandTotalPounds = flightPricePounds + addonsTotalPounds;
```

(Note: the existing flight `price` query param is in pounds; addon prices in Firestore are in pence. The summary stays in pounds.)

- [ ] **Step 4: Render the component in DF mode**

In the DF Order Summary `<>...</>` fragment, just BEFORE the existing total row, render the addons component and a list of line items, then update the total row:

```jsx
{/* DF Add-ons (shown after voucher line) */}
<DiscoveryAddons
  value={addonsState}
  onChange={setAddonsState}
  voucherActive={wantsVoucher}
/>

{basketAddons.length > 0 && basketAddons.map((a) => (
  <div key={a.itemId} style={styles.summaryRow}>
    <span style={styles.summaryLabel}>{a.name} × {a.qty}{a.discountPct > 0 ? ` (${a.discountPct}% off)` : ''}</span>
    <span style={styles.summaryValue}>£{fmt(a.lineTotal / 100)}</span>
  </div>
))}

<div style={{ ...styles.summaryRow, borderTop: '1px solid #e8e8e8', paddingTop: '16px', marginTop: '8px' }}>
  <span style={{ ...styles.summaryLabel, fontWeight: 700, color: '#1a1a1a' }}>Total</span>
  <span style={{ ...styles.summaryValue, fontWeight: 700, fontSize: '1.25rem' }}>£{fmt(grandTotalPounds)}</span>
</div>
```

(Replace the existing total row in the DF branch — the misc branch is unchanged.)

- [ ] **Step 5: Commit**

```bash
git add src/pages/Checkout.jsx
git commit -m "feat(checkout): wire DiscoveryAddons into DF checkout summary"
```

---

## Task 12 — Pass addons through the payment payload + update Pay button total

**Files:**
- Modify: `src/pages/Checkout.jsx`

- [ ] **Step 1: Extend `CheckoutForm`'s props**

Update the `CheckoutForm` component signature (around line 30) to accept `addons` and `addonsTotalPence` and `wantsVoucher` (already there) and `addonsState`:

```jsx
function CheckoutForm({
  aircraft, duration, price,
  wantsVoucher, setWantsVoucher, voucherLocation, setVoucherLocation, voucherMessage, setVoucherMessage,
  addons, addonsState, addonsTotalPence,
}) {
```

In its `handleSubmit` body, change the body of the POST to `/api/create-payment-intent` to include addons and fulfilment:

```js
body: JSON.stringify({
  aircraft,
  duration: Number(duration),
  customerName: name,
  customerEmail: email,
  customerPhone: phone,
  wantsVoucher,
  voucherLocation: wantsVoucher ? voucherLocation : '',
  voucherMessage: wantsVoucher ? voucherMessage : '',
  addons: addons.map((a) => ({ itemId: a.itemId, qty: a.qty })),
  fulfilment: addons.length > 0 ? (wantsVoucher ? 'delivery' : addonsState.fulfilment) : null,
  shippingAddress: (addons.length > 0 && (addonsState.fulfilment === 'delivery' || wantsVoucher))
    ? addonsState.shippingAddress
    : null,
}),
```

Update the Pay button label so it includes the addons total:

```jsx
{loading ? 'Processing…' : `Pay £${fmt(Number(price) + (Number(addonsTotalPence) || 0) / 100)}`}
```

- [ ] **Step 2: Pass new props from `Checkout` to `CheckoutForm`**

Where `<CheckoutForm ... />` is rendered in the DF branch (around line 494), add:

```jsx
<CheckoutForm
  aircraft={aircraft}
  duration={duration}
  price={price}
  wantsVoucher={wantsVoucher}
  setWantsVoucher={setWantsVoucher}
  voucherLocation={voucherLocation}
  setVoucherLocation={setVoucherLocation}
  voucherMessage={voucherMessage}
  setVoucherMessage={setVoucherMessage}
  addons={basketAddons}
  addonsState={addonsState}
  addonsTotalPence={addonsTotalPence}
/>
```

- [ ] **Step 3: Commit**

```bash
git add src/pages/Checkout.jsx
git commit -m "feat(checkout): include add-ons + fulfilment in DF payment request"
```

---

## Task 13 — End-to-end manual QA

No code changes — verify the feature against the spec acceptance criteria.

- [ ] **Step 1: Start the dev environment**

```bash
npm run dev
```

- [ ] **Step 2: Walk the admin path**

1. `/admin/misc` → confirm rows render. No DF pill yet on any item.
2. Open one fixed-price item, toggle "Show on Discovery Flight checkout", set discount = 30, save.
3. Reload `/admin/misc` → that row now shows `DF` pill.
4. Open a POA item → confirm DF Add-on section is hidden.
5. Add 1–2 more flagged items (one with discount 0, one with discount > 0) so the checkout has variety.

- [ ] **Step 3: Empty-state check**

Untoggle DF on every flagged item. Visit `/training/trial-lessons`, pick a flight, proceed to checkout. The add-ons section must NOT render — no header, no spacing.

Re-flag the items.

- [ ] **Step 4: Discount styling rule**

On the checkout, confirm:
- Items with discount = 0: single price, no strikethrough, no pill.
- Items with discount > 0: strikethrough original + bold discounted + "X% OFF" pill.

- [ ] **Step 5: Qty + total**

Increase qty on two items. Confirm the Order Summary line items appear and the Total row + Pay button label both update live.

- [ ] **Step 6: Fulfilment toggle**

- All qtys at 0 → no fulfilment toggle visible.
- One qty > 0 → fulfilment toggle appears, default "Collect on the day", no address fields.
- Switch to Delivery → address fields appear, required.
- All qtys back to 0 → toggle and address fields disappear and reset.

- [ ] **Step 7: Voucher lock**

With at least one add-on in basket, toggle "Add a physical gift voucher" ON.
- Fulfilment auto-switches to Delivery.
- Collect radio is disabled.
- Address fields visible and required.
- Toggle voucher OFF → fulfilment stays Delivery (manual switch back works).

- [ ] **Step 8: Live Stripe test (test mode)**

Configure dev `.env` with the Stripe test key. Complete a full purchase with one flight + 2 add-ons + delivery address using card `4242 4242 4242 4242`.
- Stripe dashboard shows ONE payment for the combined amount.
- Booking doc in Firestore has `addons: [...]`, `fulfilment: 'delivery'`, `shippingAddress: {...}`.
- Confirmation email lists the add-ons + delivery address.

Repeat with `fulfilment = 'collect'`. Confirmation email says "Collect at Denham on the day of your flight."

- [ ] **Step 9: Negative path**

Open Checkout, manipulate the network request (DevTools → Edit & Resend) to send `addons: [{ itemId: '<unflagged-id>', qty: 1 }]`. Server should return 400; UI surfaces the error.

- [ ] **Step 10: Sticky-blur smoke check**

Scroll `/training/trial-lessons` on desktop (≥901px). When `.df-expect` reaches its sticky position (top hits header bottom OR bottom hits viewport bottom — whichever is later), it pins and `.df-location-faq` rises over it with progressive blur. Verify on a tall viewport (sticks at header) and short viewport (sticks at viewport bottom first).

- [ ] **Step 11: All tests still pass**

```bash
npm test
```
Expected: all green.

- [ ] **Step 12: Final commit (if any cleanup)**

```bash
git status
# If clean: nothing to commit; stop.
# Else:
git add <changed files>
git commit -m "chore: post-QA cleanup for DF add-ons"
```

---

## Acceptance Criteria — Self-Check

Match the spec's acceptance criteria one-by-one:

- [x] Admin can mark fixed-price `misc_items` doc as DF add-on + set discount → **Task 7**.
- [x] POA items show no DF Add-on section in admin → **Task 7, Step 3** (`{form.priceType === 'fixed' && (...)}`).
- [x] Empty list ⇒ no section → **Task 10** (`if (items.length === 0) return null`).
- [x] Discount = 0 → no discount-related styling → **Task 10** (`pct > 0` guards on strikethrough + pill).
- [x] Discount > 0 → strikethrough + bold + "X% OFF" pill → **Task 10**.
- [x] Qty 0–10, total updates live → **Tasks 10, 11**.
- [x] Fulfilment toggle (collect default, delivery reveals address) → **Task 10**.
- [x] Voucher locks fulfilment to delivery → **Tasks 10, 4**.
- [x] Server validates add-ons from Firestore, single PaymentIntent for `flight + Σ(addons)` → **Tasks 3, 4**.
- [x] Booking doc + email include add-ons + fulfilment + address → **Tasks 5, 6**.

---

## Execution Notes

- Each task ends in a commit. Don't squash.
- TDD tasks (1, 2, 3, 9) must show RED → GREEN. If a test passes before implementation, the test is wrong — rewrite it.
- The pure helpers in `src/lib/discoveryAddons.js` and the server-side `applyDiscountPence` MUST stay in sync arithmetically. Both are tested independently with the same inputs.
- Server is the source of truth for amounts. The UI total is cosmetic — confirm the post-payment screen reflects what Stripe charged.

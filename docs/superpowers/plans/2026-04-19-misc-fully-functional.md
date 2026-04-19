# Misc Marketplace — Fully Functional Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Make the `/misc` catalogue fully transactional — POA items trigger an enquiry stored in a new `misc_marketplace` Firestore collection, fixed-price items go through a Stripe checkout, and admins manage everything from a new `/admin/misc-marketplace` tab.

**Architecture:** New `api/misc-marketplace.js` router handles the POA enquiry endpoint. `api/stripe.js` gets a `createMiscPaymentIntent` function and a webhook branch for `productType: 'misc'`. `Checkout.jsx` branches on `?type=misc`. A new `MiscItemDetail.jsx` page at `/misc/:id` is the hub — gallery left, details + CTA right, mirroring `UsedAircraftDetail.jsx`. `AdminMiscItemEdit.jsx` gets pricing-type and stock fields. `AdminMiscMarketplace.jsx` mirrors `AdminBookings.jsx` for the new collection.

**Tech Stack:** React, React Router v6, Firebase Firestore (client SDK + Admin SDK), Firebase Storage, Stripe Elements (`@stripe/react-stripe-js`), Express, nodemailer (SMTP already configured), Space Grotesk + Share Tech Mono fonts.

**Spec:** `docs/superpowers/specs/2026-04-19-misc-fully-functional-design.md`

---

## File Map

| File | Action | Purpose |
|------|--------|---------|
| `api/misc-marketplace.js` | **Create** | POST /api/misc-enquiry — rate-limited, writes to `misc_marketplace` |
| `api/stripe.js` | **Modify** | Add `createMiscPaymentIntent` + misc branch in `handleWebhook` |
| `server.js` | **Modify** | Mount misc-marketplace router + `POST /api/create-misc-payment-intent` |
| `firestore.rules` | **Modify** | Add `misc_marketplace` rule |
| `src/pages/admin/AdminMiscItemEdit.jsx` | **Modify** | Price-type toggle, pence price field, hasQuantity + stock fields |
| `src/pages/Misc.jsx` | **Modify** | "Enquire" → "View Details" linking to `/misc/:id` |
| `src/pages/MiscItemDetail.jsx` | **Create** | Public detail page — gallery + POA form / fixed-price CTA |
| `src/pages/Checkout.jsx` | **Modify** | Add `MiscCheckoutForm` + `type=misc` branching |
| `src/pages/BookingConfirmed.jsx` | **Modify** | Handle `type=misc` param to show "Purchase Confirmed" |
| `src/pages/admin/AdminMiscMarketplace.jsx` | **Create** | Admin tab — enquiries + orders from `misc_marketplace` |
| `src/App.jsx` | **Modify** | Add `/misc/:id` and `/admin/misc-marketplace` routes |
| `src/components/admin/AdminLayout.jsx` | **Modify** | Add Marketplace nav entry + new-item badge |

---

## Task 1: Create `api/misc-marketplace.js` enquiry endpoint

**Files:**
- Create: `api/misc-marketplace.js`

- [ ] **Step 1: Create the file**

```js
'use strict';

const express = require('express');
const rateLimit = require('express-rate-limit');
const admin = require('./firebase-admin');

const router = express.Router();

const enquiryLimiter = rateLimit({
  windowMs: 10 * 60 * 1000,
  max: 5,
  standardHeaders: true,
  legacyHeaders: false,
  keyGenerator: (req) => req.ip || 'unknown',
  handler: (_req, res) => res.status(429).json({ error: 'Too many requests' }),
});

// POST /api/misc-enquiry — public, rate-limited
router.post('/', enquiryLimiter, async (req, res) => {
  try {
    const { name, email, phone, message, itemId, itemName } = req.body || {};
    if (!name || !email || !itemId || !itemName) {
      return res.status(400).json({ error: 'name, email, itemId, itemName are required' });
    }
    if (!email.includes('@') || email.length < 5) {
      return res.status(400).json({ error: 'Invalid email address' });
    }
    const db = admin.firestore();
    await db.collection('misc_marketplace').add({
      type: 'enquiry',
      status: 'new',
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
      itemId: String(itemId).slice(0, 100),
      itemName: String(itemName).slice(0, 200),
      customerName: String(name).slice(0, 200),
      customerEmail: String(email).slice(0, 200),
      customerPhone: String(phone || '').slice(0, 50),
      message: String(message || '').slice(0, 5000),
    });
    return res.json({ ok: true });
  } catch (err) {
    console.error('[misc-enquiry] error:', err.message);
    return res.status(500).json({ error: 'Failed to submit enquiry' });
  }
});

module.exports = router;
```

- [ ] **Step 2: Commit**

```bash
git add api/misc-marketplace.js
git commit -m "feat(misc): add misc-marketplace enquiry API router"
```

---

## Task 2: Extend `api/stripe.js` — `createMiscPaymentIntent` + webhook branch

**Files:**
- Modify: `api/stripe.js`

- [ ] **Step 1: Add `createMiscPaymentIntent` function**

Open `api/stripe.js`. Find the line just before `module.exports` (line 563). Insert this entire function immediately before it:

```js
/**
 * Creates a Stripe PaymentIntent for a misc item purchase.
 * Price is read from Firestore server-side — the client-supplied amount is never trusted.
 */
async function createMiscPaymentIntent({ itemId, qty, customerName, customerEmail, customerPhone }) {
  const snap = await admin.firestore().collection('misc_items').doc(itemId).get();
  if (!snap.exists) {
    const err = new Error(`Misc item not found: ${itemId}`);
    err.statusCode = 400;
    throw err;
  }
  const item = snap.data();
  if (item.priceType !== 'fixed' || !item.price || item.price <= 0) {
    const err = new Error('This item is not available for purchase');
    err.statusCode = 400;
    throw err;
  }

  const qtyNum = Number(qty);
  if (!Number.isInteger(qtyNum) || qtyNum < 1) {
    const err = new Error('Invalid quantity');
    err.statusCode = 400;
    throw err;
  }
  if (item.hasQuantity) {
    if (qtyNum > (item.stock || 1)) {
      const err = new Error(`Quantity exceeds available stock (${item.stock})`);
      err.statusCode = 400;
      throw err;
    }
  } else if (qtyNum !== 1) {
    const err = new Error('This item does not support multiple quantities');
    err.statusCode = 400;
    throw err;
  }

  const amount = item.price * qtyNum;

  const paymentIntent = await getStripe().paymentIntents.create({
    amount,
    currency: 'gbp',
    metadata: {
      productType: 'misc',
      itemId,
      itemName: String(item.name || '').slice(0, 500),
      qty: String(qtyNum),
      customerName,
      customerEmail,
      customerPhone,
    },
  });

  return paymentIntent;
}
```

- [ ] **Step 2: Add misc branch to the webhook handler**

In `api/stripe.js`, find the `handleWebhook` function. Inside it, find the `if (event.type === 'payment_intent.succeeded')` block. After the existing `try { const bookingData = {...}` block that writes to Firestore (ending around line 528), there is already a check:

```js
if (productType === 'london-tour') {
```

The full `bookingData` block builds and writes to `bookings`. Find the line:

```js
await admin.firestore().collection('bookings').doc(pi.id).set(bookingData);
```

Immediately AFTER this line (still inside the same `try` block), add:

```js
      // Also write misc orders to the misc_marketplace collection
      if (productType === 'misc') {
        const { itemId, itemName, qty } = pi.metadata;
        await admin.firestore().collection('misc_marketplace').doc(pi.id).set({
          type: 'order',
          status: 'new',
          createdAt: admin.firestore.FieldValue.serverTimestamp(),
          ref: pi.id,
          amount: pi.amount,
          itemId: itemId || '',
          itemName: itemName || '',
          qty: Number(qty) || 1,
          customerName: customerName || '',
          customerEmail: customerEmail || '',
          customerPhone: customerPhone || '',
        });
      }
```

- [ ] **Step 3: Export `createMiscPaymentIntent`**

Find the `module.exports` line at the bottom of `api/stripe.js`:

```js
module.exports = { getPrice, createPaymentIntent, getLondonTourPrice, createLondonTourPaymentIntent, handleWebhook };
```

Replace it with:

```js
module.exports = { getPrice, createPaymentIntent, getLondonTourPrice, createLondonTourPaymentIntent, createMiscPaymentIntent, handleWebhook };
```

- [ ] **Step 4: Commit**

```bash
git add api/stripe.js
git commit -m "feat(misc): add createMiscPaymentIntent and misc webhook branch"
```

---

## Task 3: Mount router + add payment endpoint in `server.js`

**Files:**
- Modify: `server.js`

- [ ] **Step 1: Import the new router and function**

Find line 23 in `server.js`:

```js
const { createPaymentIntent, createLondonTourPaymentIntent, handleWebhook } = require('./api/stripe');
```

Replace with:

```js
const { createPaymentIntent, createLondonTourPaymentIntent, createMiscPaymentIntent, handleWebhook } = require('./api/stripe');
```

- [ ] **Step 2: Mount the misc-marketplace router**

Find the ADMIN FAQ ROUTES section near the end of `server.js`. Add after the ADMIN FAQ ROUTES block (or after the existing press-click section) — place it near the other API routes, before the static file serving. Add:

```js
// ============================================
// MISC MARKETPLACE ROUTES
// ============================================
const miscMarketplaceRouter = require('./api/misc-marketplace');
app.use('/api/misc-enquiry', express.json(), miscMarketplaceRouter);
```

- [ ] **Step 3: Add the `POST /api/create-misc-payment-intent` endpoint**

Find the `POST /api/create-london-tour-payment-intent` endpoint. Add the following immediately after it (after its closing `});`):

```js
// POST /api/create-misc-payment-intent
// Creates a Stripe PaymentIntent for a misc item purchase. Price validated server-side.
app.post('/api/create-misc-payment-intent', express.json(), async (req, res) => {
  const { itemId, qty, customerName, customerEmail, customerPhone } = req.body || {};

  if (!itemId || !customerName || !customerEmail || !customerPhone) {
    return res.status(400).json({ error: 'Missing required fields' });
  }
  if (!customerEmail.includes('@') || customerEmail.length < 5) {
    return res.status(400).json({ error: 'Invalid email address' });
  }
  const qtyNum = Number(qty);
  if (!Number.isInteger(qtyNum) || qtyNum < 1) {
    return res.status(400).json({ error: 'Invalid quantity' });
  }

  const sanitisedPhone = String(customerPhone).replace(/[^\d\s+\-()]/g, '').slice(0, 20);

  try {
    const paymentIntent = await createMiscPaymentIntent({
      itemId,
      qty: qtyNum,
      customerName,
      customerEmail,
      customerPhone: sanitisedPhone,
    });
    res.json({ clientSecret: paymentIntent.client_secret });
  } catch (err) {
    const status = err.statusCode || 500;
    res.status(status).json({ error: err.message });
  }
});
```

- [ ] **Step 4: Commit**

```bash
git add server.js
git commit -m "feat(misc): mount misc-marketplace router and misc payment intent endpoint"
```

---

## Task 4: Add `misc_marketplace` Firestore rule

**Files:**
- Modify: `firestore.rules`

- [ ] **Step 1: Add the rule**

Find the end of `firestore.rules`, just before the final two closing `}` characters. The last rule before them is:

```
    // Bookings — written server-side via Admin SDK on payment success, admin read/update
    match /bookings/{id} {
      allow read, update, delete: if isAdmin();
    }
  }
}
```

Insert the `misc_marketplace` rule before the final `}` of the documents block:

```
    // Misc marketplace — server-only creates, admin read/update/delete
    match /misc_marketplace/{id} {
      allow read, update, delete: if isAdmin();
      allow create: if false;
    }
```

The tail of the file should now read:

```
    // Bookings — written server-side via Admin SDK on payment success, admin read/update
    match /bookings/{id} {
      allow read, update, delete: if isAdmin();
    }

    // Misc marketplace — server-only creates, admin read/update/delete
    match /misc_marketplace/{id} {
      allow read, update, delete: if isAdmin();
      allow create: if false;
    }
  }
}
```

- [ ] **Step 2: Commit**

```bash
git add firestore.rules
git commit -m "feat(misc): add misc_marketplace Firestore security rule"
```

---

## Task 5: Update `AdminMiscItemEdit.jsx` — pricing type + stock fields

**Files:**
- Modify: `src/pages/admin/AdminMiscItemEdit.jsx`

- [ ] **Step 1: Update the `EMPTY` constant**

Find:

```js
const EMPTY = {
  name: '',
  category: '',
  priceDisplay: '',
  condition: 'new',
  description: '',
  images: [],
};
```

Replace with:

```js
const EMPTY = {
  name: '',
  category: '',
  priceType: 'poa',
  price: 0,
  priceDisplay: 'POA',
  hasQuantity: false,
  stock: 1,
  condition: 'new',
  description: '',
  images: [],
};
```

- [ ] **Step 2: Update `handleSubmit` to compute `priceDisplay` and clean POA fields**

Find:

```js
  async function handleSubmit(e) {
    e.preventDefault();
    setSaving(true);
    setError('');
    try {
      if (isNew) {
        const newId = await createDoc('misc_items', form);
        navigate(`/admin/misc/${newId}`);
      } else {
        await updateDocById('misc_items', id, form);
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  }
```

Replace with:

```js
  async function handleSubmit(e) {
    e.preventDefault();
    setSaving(true);
    setError('');
    try {
      const priceDisplay = form.priceType === 'fixed' && form.price > 0
        ? `£${(form.price / 100).toLocaleString('en-GB', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
        : 'POA';
      const payload = {
        ...form,
        priceDisplay,
        ...(form.priceType === 'poa' ? { price: 0, hasQuantity: false, stock: 1 } : {}),
      };
      if (isNew) {
        const newId = await createDoc('misc_items', payload);
        navigate(`/admin/misc/${newId}`);
      } else {
        await updateDocById('misc_items', id, payload);
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  }
```

- [ ] **Step 3: Replace the price/condition grid row with the new pricing section**

Find this block in the form JSX (the two-column grid containing Price Display and Condition):

```jsx
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div>
              <label style={labelStyle}>Name</label>
              <input style={fieldStyle} value={form.name} onChange={(e) => set('name', e.target.value)} required placeholder="e.g. R22 Helicopter Cover" />
            </div>
            <div>
              <label style={labelStyle}>Category</label>
              <input style={fieldStyle} value={form.category} onChange={(e) => set('category', e.target.value)} placeholder="e.g. Apparel, Ground Equipment" />
            </div>
            <div>
              <label style={labelStyle}>Price Display</label>
              <input style={fieldStyle} value={form.priceDisplay} onChange={(e) => set('priceDisplay', e.target.value)} placeholder="e.g. £250 or POA" />
            </div>
            <div>
              <label style={labelStyle}>Condition</label>
              <select style={fieldStyle} value={form.condition} onChange={(e) => set('condition', e.target.value)}>
                <option value="new">New</option>
                <option value="used">Used</option>
              </select>
            </div>
          </div>
```

Replace with:

```jsx
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div>
              <label style={labelStyle}>Name</label>
              <input style={fieldStyle} value={form.name} onChange={(e) => set('name', e.target.value)} required placeholder="e.g. R22 Helicopter Cover" />
            </div>
            <div>
              <label style={labelStyle}>Category</label>
              <input style={fieldStyle} value={form.category} onChange={(e) => set('category', e.target.value)} placeholder="e.g. Apparel, Ground Equipment" />
            </div>
          </div>

          {/* Pricing */}
          <div>
            <label style={labelStyle}>Pricing</label>
            <div style={{ display: 'flex', gap: '1.5rem', marginBottom: '0.75rem' }}>
              {['poa', 'fixed'].map((pt) => (
                <label key={pt} style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', cursor: 'pointer', fontSize: '0.875rem', color: '#374151' }}>
                  <input
                    type="radio"
                    name="priceType"
                    value={pt}
                    checked={form.priceType === pt}
                    onChange={() => set('priceType', pt)}
                  />
                  {pt === 'poa' ? 'Price on Application' : 'Fixed Price'}
                </label>
              ))}
            </div>
            {form.priceType === 'fixed' && (
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <span style={{ fontSize: '0.9rem', color: '#374151', fontWeight: 600 }}>£</span>
                <input
                  style={{ ...fieldStyle, width: '140px' }}
                  type="number"
                  step="0.01"
                  min="0"
                  placeholder="0.00"
                  value={form.price > 0 ? (form.price / 100).toFixed(2) : ''}
                  onChange={(e) => set('price', Math.round(parseFloat(e.target.value || 0) * 100))}
                />
                {form.price > 0 && (
                  <span style={{ fontSize: '0.8rem', color: '#6b7280' }}>
                    → displays as £{(form.price / 100).toLocaleString('en-GB', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                  </span>
                )}
              </div>
            )}
          </div>

          <div>
            <label style={labelStyle}>Condition</label>
            <select style={{ ...fieldStyle, width: '160px' }} value={form.condition} onChange={(e) => set('condition', e.target.value)}>
              <option value="new">New</option>
              <option value="used">Used</option>
            </select>
          </div>

          {form.priceType === 'fixed' && (
            <div>
              <label style={labelStyle}>Quantity</label>
              <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer', fontSize: '0.875rem', color: '#374151', marginBottom: '0.5rem' }}>
                <input
                  type="checkbox"
                  checked={form.hasQuantity}
                  onChange={(e) => set('hasQuantity', e.target.checked)}
                />
                Allow quantity selection on product page
              </label>
              {form.hasQuantity && (
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                  <label style={{ ...labelStyle, margin: 0, textTransform: 'none', letterSpacing: 0, fontSize: '0.8rem' }}>Stock available:</label>
                  <input
                    style={{ ...fieldStyle, width: '80px' }}
                    type="number"
                    min="1"
                    step="1"
                    value={form.stock}
                    onChange={(e) => set('stock', Math.max(1, parseInt(e.target.value || 1, 10)))}
                  />
                </div>
              )}
            </div>
          )}
```

- [ ] **Step 4: Verify in browser**

Navigate to `/admin/misc/new`. Confirm:
- "Price on Application" is selected by default — no price field visible
- Select "Fixed Price" — price input appears with `£` prefix
- Enter `250` — preview shows `→ displays as £250.00`
- Check "Allow quantity selection" — stock field appears
- Create the item — verify it saves with `priceType: 'fixed'`, `price: 25000`, `priceDisplay: '£250.00'`, `hasQuantity: true` in Firestore
- Open an existing item — confirm it loads without errors (old items without new fields default to POA)

- [ ] **Step 5: Commit**

```bash
git add src/pages/admin/AdminMiscItemEdit.jsx
git commit -m "feat(misc): add priceType, price, hasQuantity, stock fields to AdminMiscItemEdit"
```

---

## Task 6: Update `Misc.jsx` — "View Details" button

**Files:**
- Modify: `src/pages/Misc.jsx`

- [ ] **Step 1: Replace the Enquire link**

Find:

```jsx
                            <Link to="/contact" className="misc-card__enquire">Enquire</Link>
```

Replace with:

```jsx
                            <Link to={`/misc/${item.id}`} className="misc-card__enquire">View Details</Link>
```

- [ ] **Step 2: Commit**

```bash
git add src/pages/Misc.jsx
git commit -m "feat(misc): replace Enquire with View Details linking to detail page"
```

---

## Task 7: Create `MiscItemDetail.jsx`

**Files:**
- Create: `src/pages/MiscItemDetail.jsx`

- [ ] **Step 1: Create the file**

```jsx
import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { doc, getDoc } from 'firebase/firestore';
import FinalDraftHeader from '../components/FinalDraftHeader';
import FooterMinimal from '../components/FooterMinimal';
import { db } from '../lib/firebase';

const CSS = `
  .mid-page {
    font-family: 'Space Grotesk', -apple-system, sans-serif;
    background: #fff;
    color: #1a1a1a;
    -webkit-font-smoothing: antialiased;
  }
  .mid-wrapper {
    display: flex;
    min-height: 100vh;
    padding-top: 60px;
  }
  .mid-left {
    width: 45%;
    max-width: 600px;
    position: sticky;
    top: 60px;
    height: calc(100vh - 60px);
    display: flex;
    flex-direction: column;
    border-right: 1px solid #eee;
  }
  .mid-back {
    display: inline-flex;
    align-items: center;
    gap: 8px;
    color: #888;
    text-decoration: none;
    font-size: 0.75rem;
    padding: 20px 30px;
    text-transform: uppercase;
    letter-spacing: 0.1em;
    font-weight: 500;
    font-family: 'Share Tech Mono', monospace;
  }
  .mid-back:hover { color: #1a1a1a; }
  .mid-image-section { flex: 1; display: flex; flex-direction: column; }
  .mid-main-image {
    flex: 0 0 auto;
    height: 45vh;
    overflow: hidden;
    margin: 0 30px;
    position: relative;
    display: flex;
    align-items: center;
    justify-content: center;
    background: #f5f4f0;
  }
  .mid-carousel { position: relative; width: 100%; height: 100%; }
  .mid-slide {
    position: absolute; top: 0; left: 0;
    width: 100%; height: 100%;
    opacity: 0; transition: opacity 0.4s ease;
    display: flex; align-items: center; justify-content: center;
  }
  .mid-slide--active { opacity: 1; z-index: 1; }
  .mid-slide img { max-width: 100%; max-height: 100%; object-fit: contain; }
  .mid-arrow {
    position: absolute; top: 50%; transform: translateY(-50%);
    z-index: 10; width: 36px; height: 36px;
    background: rgba(255,255,255,0.95); border: none; border-radius: 50%;
    cursor: pointer; display: flex; align-items: center; justify-content: center;
    opacity: 0; transition: opacity 0.3s, transform 0.2s;
    box-shadow: 0 2px 8px rgba(0,0,0,0.15);
  }
  .mid-main-image:hover .mid-arrow { opacity: 1; }
  .mid-arrow:hover { transform: translateY(-50%) scale(1.1); }
  .mid-arrow svg { width: 18px; height: 18px; stroke: #333; stroke-width: 2; fill: none; }
  .mid-arrow--prev { left: 12px; }
  .mid-arrow--next { right: 12px; }
  .mid-placeholder {
    width: 100%; height: 100%;
    display: flex; align-items: center; justify-content: center;
    background: linear-gradient(135deg, #f5f4f0, #eae8e2);
  }
  .mid-thumbs {
    display: flex; justify-content: center; gap: 8px; padding: 16px 30px;
  }
  .mid-thumb {
    width: 65px; height: 45px; overflow: hidden;
    cursor: pointer; opacity: 0.4; transition: all 0.2s;
    border: 2px solid transparent; background: none; padding: 0;
  }
  .mid-thumb:hover, .mid-thumb--active { opacity: 1; border-color: #1a1a1a; }
  .mid-thumb img { width: 100%; height: 100%; object-fit: cover; }
  .mid-right {
    flex: 1; overflow-y: auto; padding: 40px 50px 80px;
  }
  .mid-eyebrow {
    font-family: 'Share Tech Mono', monospace;
    font-size: 0.65rem; text-transform: uppercase;
    letter-spacing: 0.15em; color: #999; display: block; margin-bottom: 8px;
  }
  .mid-name {
    font-size: clamp(1.6rem, 3vw, 2.2rem); font-weight: 700;
    letter-spacing: -0.5px; margin: 0 0 12px; text-transform: uppercase;
  }
  .mid-condition {
    display: inline-flex; align-items: center;
    padding: 4px 12px; font-size: 0.6rem; font-weight: 700;
    text-transform: uppercase; letter-spacing: 0.1em;
    font-family: 'Share Tech Mono', monospace; border-radius: 3px; margin-bottom: 20px;
  }
  .mid-condition--new { background: #f0fdf4; color: #166534; }
  .mid-condition--used { background: #fef3c7; color: #92400e; }
  .mid-description {
    font-size: 0.9rem; line-height: 1.8; color: #555;
    margin-bottom: 30px; padding-bottom: 30px; border-bottom: 1px solid #eee;
  }
  .mid-section-title {
    font-size: 0.65rem; font-weight: 700; text-transform: uppercase;
    letter-spacing: 0.15em; color: #999; margin-bottom: 20px;
    display: flex; align-items: center; gap: 12px;
    font-family: 'Share Tech Mono', monospace;
  }
  .mid-section-title::after { content: ''; flex: 1; height: 1px; background: #eee; }
  .mid-price {
    font-family: 'Share Tech Mono', monospace; font-size: 2rem;
    font-weight: 700; margin-bottom: 24px;
  }
  .mid-poa-label {
    font-family: 'Share Tech Mono', monospace; font-size: 1.4rem;
    color: #888; margin-bottom: 24px;
  }
  .mid-qty {
    display: flex; align-items: center; gap: 0; margin-bottom: 20px;
  }
  .mid-qty__label {
    font-size: 0.75rem; color: #666; margin-right: 12px;
    font-family: 'Share Tech Mono', monospace;
    text-transform: uppercase; letter-spacing: 0.08em;
  }
  .mid-qty__btn {
    width: 36px; height: 36px;
    border: 1px solid #e8e6e2; background: #fff; cursor: pointer;
    font-size: 1.1rem; color: #1a1a1a;
    display: flex; align-items: center; justify-content: center;
    transition: background 0.15s;
  }
  .mid-qty__btn:first-of-type { border-radius: 4px 0 0 4px; }
  .mid-qty__btn:last-of-type { border-radius: 0 4px 4px 0; }
  .mid-qty__btn:hover:not(:disabled) { background: #f5f4f0; }
  .mid-qty__btn:disabled { opacity: 0.3; cursor: default; }
  .mid-qty__val {
    width: 48px; height: 36px;
    border: 1px solid #e8e6e2; border-left: none; border-right: none;
    display: flex; align-items: center; justify-content: center;
    font-family: 'Share Tech Mono', monospace; font-size: 0.9rem; font-weight: 700;
  }
  .mid-buy-btn {
    display: block; width: 100%; padding: 14px 24px;
    background: #1a1a1a; color: #fff; border: none; border-radius: 4px;
    font-family: 'Space Grotesk', sans-serif; font-size: 0.9rem; font-weight: 600;
    text-transform: uppercase; letter-spacing: 0.06em;
    cursor: pointer; transition: background 0.2s;
  }
  .mid-buy-btn:hover { background: #333; }
  .mid-enquiry-form { display: flex; flex-direction: column; gap: 14px; }
  .mid-field-label {
    display: block; font-size: 0.72rem; font-weight: 600;
    text-transform: uppercase; letter-spacing: 0.06em; color: #555; margin-bottom: 4px;
  }
  .mid-field-input {
    width: 100%; padding: 10px 14px;
    border: 1px solid #e8e6e2; border-radius: 4px;
    font-size: 0.9rem; font-family: 'Space Grotesk', sans-serif;
    color: #1a1a1a; box-sizing: border-box; transition: border-color 0.15s;
  }
  .mid-field-input:focus { outline: none; border-color: #1a1a1a; }
  .mid-field-textarea { resize: vertical; min-height: 80px; line-height: 1.5; }
  .mid-submit-btn {
    padding: 12px 24px; background: #1a1a1a; color: #fff;
    border: none; border-radius: 4px;
    font-family: 'Space Grotesk', sans-serif; font-size: 0.85rem; font-weight: 600;
    cursor: pointer; transition: background 0.2s; align-self: flex-start;
  }
  .mid-submit-btn:hover:not(:disabled) { background: #333; }
  .mid-submit-btn:disabled { opacity: 0.5; cursor: default; }
  .mid-success {
    padding: 20px; background: #f0fdf4;
    border: 1px solid #bbf7d0; border-radius: 6px;
    font-size: 0.9rem; color: #166534; line-height: 1.6;
  }
  .mid-error {
    padding: 12px; background: #fef2f2;
    border: 1px solid #fecaca; border-radius: 6px;
    font-size: 0.85rem; color: #991b1b;
  }
  .mid-not-found {
    padding: 80px 40px; text-align: center;
    font-family: 'Space Grotesk', sans-serif;
  }
  @media (max-width: 768px) {
    .mid-wrapper { flex-direction: column; }
    .mid-left {
      width: 100%; max-width: 100%;
      position: relative; top: auto;
      height: auto; border-right: none; border-bottom: 1px solid #eee;
    }
    .mid-main-image { height: 50vw; min-height: 200px; margin: 0; }
    .mid-right { padding: 30px 24px 60px; }
  }
`;

export default function MiscItemDetail() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [item, setItem] = useState(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  // Gallery
  const [activeSlide, setActiveSlide] = useState(0);

  // Qty selector
  const [qty, setQty] = useState(1);

  // Enquiry form
  const [enquiry, setEnquiry] = useState({ name: '', email: '', phone: '', message: '' });
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [enquiryError, setEnquiryError] = useState('');

  useEffect(() => {
    getDoc(doc(db, 'misc_items', id)).then((snap) => {
      if (snap.exists()) {
        setItem({ id: snap.id, ...snap.data() });
      } else {
        setNotFound(true);
      }
      setLoading(false);
    });
  }, [id]);

  const images = item?.images || [];

  function prevSlide() {
    setActiveSlide((i) => (i - 1 + images.length) % images.length);
  }
  function nextSlide() {
    setActiveSlide((i) => (i + 1) % images.length);
  }

  function handleBuyNow() {
    navigate(
      `/checkout?type=misc` +
      `&itemId=${id}` +
      `&itemName=${encodeURIComponent(item.name)}` +
      `&price=${(item.price / 100).toFixed(2)}` +
      `&qty=${qty}`
    );
  }

  async function handleEnquirySubmit(e) {
    e.preventDefault();
    setSubmitting(true);
    setEnquiryError('');
    try {
      const res = await fetch('/api/misc-enquiry', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: enquiry.name,
          email: enquiry.email,
          phone: enquiry.phone,
          message: enquiry.message,
          itemId: id,
          itemName: item.name,
        }),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error || 'Request failed');
      }
      setSubmitted(true);
    } catch (err) {
      setEnquiryError(err.message || 'Something went wrong. Please try again.');
    } finally {
      setSubmitting(false);
    }
  }

  if (loading) {
    return (
      <>
        <style>{CSS}</style>
        <FinalDraftHeader />
        <div style={{ padding: '120px 40px', textAlign: 'center', fontFamily: "'Space Grotesk', sans-serif", color: '#888' }}>
          Loading…
        </div>
      </>
    );
  }

  if (notFound || !item) {
    return (
      <>
        <style>{CSS}</style>
        <FinalDraftHeader />
        <div className="mid-not-found">
          <p style={{ color: '#888', marginBottom: '16px' }}>Item not found.</p>
          <Link to="/misc" style={{ color: '#1a1a1a', fontFamily: "'Share Tech Mono', monospace", fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.1em' }}>
            ← Back to Miscellaneous
          </Link>
        </div>
        <FooterMinimal />
      </>
    );
  }

  const isFixed = item.priceType === 'fixed';
  const stock = item.stock || 1;

  return (
    <>
      <style>{CSS}</style>
      <div className="mid-page">
        <FinalDraftHeader />
        <div className="mid-wrapper">

          {/* ── LEFT: Gallery ── */}
          <div className="mid-left">
            <Link to="/misc" className="mid-back">← Back to Miscellaneous</Link>

            <div className="mid-image-section">
              <div className="mid-main-image">
                {images.length > 0 ? (
                  <div className="mid-carousel">
                    {images.map((img, i) => (
                      <div key={i} className={`mid-slide ${i === activeSlide ? 'mid-slide--active' : ''}`}>
                        <img src={img.url} alt={img.alt || item.name} />
                      </div>
                    ))}
                    {images.length > 1 && (
                      <>
                        <button className="mid-arrow mid-arrow--prev" onClick={prevSlide} aria-label="Previous image">
                          <svg viewBox="0 0 24 24"><polyline points="15,18 9,12 15,6" /></svg>
                        </button>
                        <button className="mid-arrow mid-arrow--next" onClick={nextSlide} aria-label="Next image">
                          <svg viewBox="0 0 24 24"><polyline points="9,18 15,12 9,6" /></svg>
                        </button>
                      </>
                    )}
                  </div>
                ) : (
                  <div className="mid-placeholder">
                    <i className="fas fa-box" style={{ fontSize: '4rem', color: '#ccc' }}></i>
                  </div>
                )}
              </div>

              {images.length > 1 && (
                <div className="mid-thumbs">
                  {images.map((img, i) => (
                    <button
                      key={i}
                      className={`mid-thumb ${i === activeSlide ? 'mid-thumb--active' : ''}`}
                      onClick={() => setActiveSlide(i)}
                      aria-label={`Image ${i + 1}`}
                    >
                      <img src={img.url} alt={img.alt || `${item.name} ${i + 1}`} />
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* ── RIGHT: Details ── */}
          <div className="mid-right">
            {item.category && <span className="mid-eyebrow">{item.category}</span>}
            <h1 className="mid-name">{item.name}</h1>
            <span className={`mid-condition mid-condition--${item.condition || 'new'}`}>
              {item.condition === 'used' ? 'Used' : 'New'}
            </span>

            {item.description && (
              <p className="mid-description">{item.description}</p>
            )}

            {isFixed ? (
              /* ── Fixed price branch ── */
              <>
                <p className="mid-section-title">Purchase</p>
                <p className="mid-price">£{(item.price / 100).toLocaleString('en-GB', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>

                {item.hasQuantity && (
                  <div className="mid-qty">
                    <span className="mid-qty__label">Qty</span>
                    <button
                      className="mid-qty__btn"
                      onClick={() => setQty((q) => Math.max(1, q - 1))}
                      disabled={qty <= 1}
                    >
                      −
                    </button>
                    <div className="mid-qty__val">{qty}</div>
                    <button
                      className="mid-qty__btn"
                      onClick={() => setQty((q) => Math.min(stock, q + 1))}
                      disabled={qty >= stock}
                    >
                      +
                    </button>
                  </div>
                )}

                <button className="mid-buy-btn" onClick={handleBuyNow}>
                  Buy Now{item.hasQuantity && qty > 1 ? ` — £${((item.price / 100) * qty).toLocaleString('en-GB', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}` : ''}
                </button>
              </>
            ) : (
              /* ── POA enquiry branch ── */
              <>
                <p className="mid-section-title">Enquire</p>
                <p className="mid-poa-label">Price on Application</p>

                {submitted ? (
                  <div className="mid-success">
                    Thanks — we'll be in touch shortly about the {item.name}.
                  </div>
                ) : (
                  <form className="mid-enquiry-form" onSubmit={handleEnquirySubmit}>
                    <div>
                      <label className="mid-field-label">Name *</label>
                      <input
                        className="mid-field-input"
                        type="text"
                        required
                        placeholder="Your full name"
                        value={enquiry.name}
                        onChange={(e) => setEnquiry((f) => ({ ...f, name: e.target.value }))}
                      />
                    </div>
                    <div>
                      <label className="mid-field-label">Email *</label>
                      <input
                        className="mid-field-input"
                        type="email"
                        required
                        placeholder="your@email.com"
                        value={enquiry.email}
                        onChange={(e) => setEnquiry((f) => ({ ...f, email: e.target.value }))}
                      />
                    </div>
                    <div>
                      <label className="mid-field-label">Phone</label>
                      <input
                        className="mid-field-input"
                        type="tel"
                        placeholder="+44 7700 900000"
                        value={enquiry.phone}
                        onChange={(e) => setEnquiry((f) => ({ ...f, phone: e.target.value }))}
                      />
                    </div>
                    <div>
                      <label className="mid-field-label">Message</label>
                      <textarea
                        className="mid-field-input mid-field-textarea"
                        placeholder="Any additional questions…"
                        value={enquiry.message}
                        onChange={(e) => setEnquiry((f) => ({ ...f, message: e.target.value }))}
                      />
                    </div>
                    {enquiryError && <div className="mid-error">{enquiryError}</div>}
                    <button className="mid-submit-btn" type="submit" disabled={submitting}>
                      {submitting ? 'Sending…' : 'Send Enquiry'}
                    </button>
                  </form>
                )}
              </>
            )}
          </div>
        </div>
        <FooterMinimal />
      </div>
    </>
  );
}
```

- [ ] **Step 2: Verify in browser (requires Task 6 backend endpoints and a test item)**

After wiring the route (Task 10), create a POA item and a fixed-price item via admin. Then:
- Navigate to `/misc` — "View Details" links to `/misc/:id`
- POA item detail page: shows enquiry form; submit → success message, doc appears in `misc_marketplace` in Firestore console
- Fixed price item: shows price + Buy Now button, clicking navigates to checkout with correct params
- Fixed price + hasQuantity: qty stepper appears, capped at stock; total updates in Buy Now button
- No image item: placeholder icon shown

- [ ] **Step 3: Commit**

```bash
git add src/pages/MiscItemDetail.jsx
git commit -m "feat(misc): add MiscItemDetail page with gallery, enquiry form, and buy flow"
```

---

## Task 8: Extend `Checkout.jsx` for `type=misc`

**Files:**
- Modify: `src/pages/Checkout.jsx`

- [ ] **Step 1: Add `MiscCheckoutForm` component**

Open `src/pages/Checkout.jsx`. Find the line that ends the `CheckoutForm` component:

```jsx
}

// ─── Page ────────────────────────────────────────────────────────────────────
```

Insert the new `MiscCheckoutForm` component in the gap between `CheckoutForm` and the `// ─── Page` comment:

```jsx
// ─── Misc Payment Form ───────────────────────────────────────────────────────
function MiscCheckoutForm({ itemId, itemName, qty, price }) {
  const stripe = useStripe();
  const elements = useElements();
  const navigate = useNavigate();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const total = (Number(price) * Number(qty)).toFixed(2);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!stripe || !elements) return;
    setLoading(true);
    setError('');

    let clientSecret;
    try {
      const res = await fetch('/api/create-misc-payment-intent', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          itemId,
          qty: Number(qty),
          customerName: name,
          customerEmail: email,
          customerPhone: phone,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to initiate payment.');
      clientSecret = data.clientSecret;
    } catch (err) {
      setError(err.message || 'Something went wrong. Please try again.');
      setLoading(false);
      return;
    }

    const result = await stripe.confirmCardPayment(clientSecret, {
      payment_method: {
        card: elements.getElement(CardNumberElement),
        billing_details: { name, email, phone },
      },
    });

    setLoading(false);

    if (result.error) {
      setError(result.error.message);
    } else if (result.paymentIntent.status === 'succeeded') {
      navigate(
        `/booking-confirmed?ref=${result.paymentIntent.id}` +
        `&type=misc` +
        `&itemName=${encodeURIComponent(itemName)}` +
        `&name=${encodeURIComponent(name)}`
      );
    }
  };

  return (
    <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
      <div style={styles.fieldGroup}>
        <label style={styles.label}>Full Name</label>
        <input style={styles.input} type="text" placeholder="Jane Smith" value={name} onChange={(e) => setName(e.target.value)} required />
      </div>
      <div style={styles.fieldGroup}>
        <label style={styles.label}>Email Address</label>
        <input style={styles.input} type="email" placeholder="jane@example.com" value={email} onChange={(e) => setEmail(e.target.value)} required />
      </div>
      <div style={styles.fieldGroup}>
        <label style={styles.label}>Phone Number</label>
        <input style={styles.input} type="tel" placeholder="+44 7700 900000" value={phone} onChange={(e) => setPhone(e.target.value)} required />
      </div>

      <div style={styles.fieldGroup}>
        <label style={styles.label}>Card Number</label>
        <div style={styles.stripeInput}><CardNumberElement options={CARD_FIELD_STYLE} /></div>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
        <div style={styles.fieldGroup}>
          <label style={styles.label}>Expiry</label>
          <div style={styles.stripeInput}><CardExpiryElement options={CARD_FIELD_STYLE} /></div>
        </div>
        <div style={styles.fieldGroup}>
          <label style={styles.label}>CVC</label>
          <div style={styles.stripeInput}><CardCvcElement options={CARD_FIELD_STYLE} /></div>
        </div>
      </div>

      {error && <div style={{ color: '#e74c3c', fontSize: '14px', padding: '10px', background: '#fef2f2', borderRadius: '6px' }}>{error}</div>}

      <button type="submit" disabled={!stripe || loading} style={loading ? { ...styles.btn, ...styles.btnDisabled } : styles.btn}>
        {loading ? 'Processing…' : `Pay £${total}`}
      </button>

      <p style={styles.secureNote}>🔒 Payments are processed securely by Stripe. HQ Aviation never sees your card details.</p>
    </form>
  );
}
```

- [ ] **Step 2: Add misc param detection to the `Checkout` page component**

Find the `Checkout` function starting at:

```js
export default function Checkout() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const aircraft = searchParams.get('aircraft');
  const duration = searchParams.get('duration');
  const price = searchParams.get('price');

  const [wantsVoucher, setWantsVoucher] = useState(false);
  const [voucherLocation, setVoucherLocation] = useState('');
  const [voucherMessage, setVoucherMessage] = useState('');

  const isValid = aircraft && duration && Number(price) > 0 && AIRCRAFT_NAMES[aircraft];

  // Redirect back if params are missing, unrecognised, or price is non-numeric.
  // useEffect prevents calling navigate() during render (React anti-pattern).
  useEffect(() => {
    if (!isValid) {
      navigate('/training/trial-lessons', { replace: true });
    }
  }, [isValid, navigate]);

  if (!isValid) return null;
```

Replace this opening section with:

```js
export default function Checkout() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const type = searchParams.get('type');

  // Misc params
  const itemId = searchParams.get('itemId');
  const itemName = searchParams.get('itemName');
  const qty = searchParams.get('qty') || '1';

  // Flight params (existing)
  const aircraft = searchParams.get('aircraft');
  const duration = searchParams.get('duration');
  const price = searchParams.get('price');

  const [wantsVoucher, setWantsVoucher] = useState(false);
  const [voucherLocation, setVoucherLocation] = useState('');
  const [voucherMessage, setVoucherMessage] = useState('');

  const isMisc = type === 'misc';
  const isMiscValid = isMisc && !!itemId && !!itemName && Number(price) > 0 && Number(qty) >= 1;
  const isFlightValid = !isMisc && !!aircraft && !!duration && Number(price) > 0 && !!AIRCRAFT_NAMES[aircraft];
  const isValid = isMiscValid || isFlightValid;

  useEffect(() => {
    if (!isValid) {
      navigate(isMisc ? '/misc' : '/training/trial-lessons', { replace: true });
    }
  }, [isValid, navigate, isMisc]);

  if (!isValid) return null;
```

- [ ] **Step 3: Replace the back link, heading, subheading, order summary, and payment form JSX**

Find:

```jsx
        {/* Back link */}
        <Link to="/training/trial-lessons" style={styles.back}>← Back</Link>

        <h1 style={styles.heading} className="co-page-heading">Complete Your Booking</h1>
        <p style={styles.subheading} className="co-page-subheading">Pay now — we'll call you to schedule your flight.</p>

        <div className="co-layout">

          {/* Order Summary */}
          <div style={styles.summary} className="co-summary">
            <h2 style={styles.summaryHeading}>Order Summary</h2>
            <div style={styles.summaryRow}>
              <span style={styles.summaryLabel}>Aircraft</span>
              <span style={styles.summaryValue}>{AIRCRAFT_NAMES[aircraft]}</span>
            </div>
            <div style={styles.summaryRow}>
              <span style={styles.summaryLabel}>Experience</span>
              <span style={styles.summaryValue}>{duration} Minute Discovery Flight</span>
            </div>
            {wantsVoucher && (
              <div style={styles.summaryRow}>
                <span style={styles.summaryLabel}>Physical voucher</span>
                <span style={{ ...styles.summaryValue, color: '#2d7a4f', fontSize: '13px' }}>Included</span>
              </div>
            )}
            <div style={{ ...styles.summaryRow, borderTop: '1px solid #e8e8e8', paddingTop: '16px', marginTop: '8px' }}>
              <span style={{ ...styles.summaryLabel, fontWeight: 700, color: '#1a1a1a' }}>Total</span>
              <span style={{ ...styles.summaryValue, fontWeight: 700, fontSize: '1.25rem' }}>£{price}</span>
            </div>
            <p style={styles.summaryNote}>
              After payment, a member of the HQ Aviation team will contact you to arrange a date and time.
            </p>
          </div>

          {/* Payment Form */}
          <div style={styles.formPanel} className="co-form">
            <h2 style={styles.formHeading}>Your Details &amp; Payment</h2>
            <Elements stripe={stripePromise}>
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
              />
            </Elements>
          </div>
```

Replace with:

```jsx
        {/* Back link */}
        <Link to={isMisc ? `/misc/${itemId}` : '/training/trial-lessons'} style={styles.back}>← Back</Link>

        <h1 style={styles.heading} className="co-page-heading">
          {isMisc ? 'Complete Your Purchase' : 'Complete Your Booking'}
        </h1>
        <p style={styles.subheading} className="co-page-subheading">
          {isMisc ? 'Pay securely — the HQ team will be in touch about your order.' : "Pay now — we'll call you to schedule your flight."}
        </p>

        <div className="co-layout">

          {/* Order Summary */}
          <div style={styles.summary} className="co-summary">
            <h2 style={styles.summaryHeading}>Order Summary</h2>
            {isMisc ? (
              <>
                <div style={styles.summaryRow}>
                  <span style={styles.summaryLabel}>Item</span>
                  <span style={styles.summaryValue}>{itemName}</span>
                </div>
                {Number(qty) > 1 && (
                  <div style={styles.summaryRow}>
                    <span style={styles.summaryLabel}>Quantity</span>
                    <span style={styles.summaryValue}>{qty}</span>
                  </div>
                )}
                <div style={{ ...styles.summaryRow, borderTop: '1px solid #e8e8e8', paddingTop: '16px', marginTop: '8px' }}>
                  <span style={{ ...styles.summaryLabel, fontWeight: 700, color: '#1a1a1a' }}>Total</span>
                  <span style={{ ...styles.summaryValue, fontWeight: 700, fontSize: '1.25rem' }}>
                    £{(Number(price) * Number(qty)).toFixed(2)}
                  </span>
                </div>
                <p style={styles.summaryNote}>
                  After payment, the HQ Aviation team will be in touch to arrange your order.
                </p>
              </>
            ) : (
              <>
                <div style={styles.summaryRow}>
                  <span style={styles.summaryLabel}>Aircraft</span>
                  <span style={styles.summaryValue}>{AIRCRAFT_NAMES[aircraft]}</span>
                </div>
                <div style={styles.summaryRow}>
                  <span style={styles.summaryLabel}>Experience</span>
                  <span style={styles.summaryValue}>{duration} Minute Discovery Flight</span>
                </div>
                {wantsVoucher && (
                  <div style={styles.summaryRow}>
                    <span style={styles.summaryLabel}>Physical voucher</span>
                    <span style={{ ...styles.summaryValue, color: '#2d7a4f', fontSize: '13px' }}>Included</span>
                  </div>
                )}
                <div style={{ ...styles.summaryRow, borderTop: '1px solid #e8e8e8', paddingTop: '16px', marginTop: '8px' }}>
                  <span style={{ ...styles.summaryLabel, fontWeight: 700, color: '#1a1a1a' }}>Total</span>
                  <span style={{ ...styles.summaryValue, fontWeight: 700, fontSize: '1.25rem' }}>£{price}</span>
                </div>
                <p style={styles.summaryNote}>
                  After payment, a member of the HQ Aviation team will contact you to arrange a date and time.
                </p>
              </>
            )}
          </div>

          {/* Payment Form */}
          <div style={styles.formPanel} className="co-form">
            <h2 style={styles.formHeading}>Your Details &amp; Payment</h2>
            <Elements stripe={stripePromise}>
              {isMisc ? (
                <MiscCheckoutForm itemId={itemId} itemName={itemName} qty={qty} price={price} />
              ) : (
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
                />
              )}
            </Elements>
          </div>
```

- [ ] **Step 4: Commit**

```bash
git add src/pages/Checkout.jsx
git commit -m "feat(misc): extend Checkout page with MiscCheckoutForm and type=misc branching"
```

---

## Task 9: Update `BookingConfirmed.jsx` for misc purchases

**Files:**
- Modify: `src/pages/BookingConfirmed.jsx`

- [ ] **Step 1: Add misc detection**

Open `src/pages/BookingConfirmed.jsx`. Find:

```js
  const ref = searchParams.get('ref');
  const aircraft = searchParams.get('aircraft');
  const duration = searchParams.get('duration');
  const price = searchParams.get('price');
  const name = searchParams.get('name');

  const aircraftName = AIRCRAFT_NAMES[aircraft] || aircraft || 'Discovery Flight';
```

Replace with:

```js
  const ref = searchParams.get('ref');
  const type = searchParams.get('type');
  const aircraft = searchParams.get('aircraft');
  const duration = searchParams.get('duration');
  const price = searchParams.get('price');
  const name = searchParams.get('name');
  const itemName = searchParams.get('itemName');

  const isMisc = type === 'misc';
  const aircraftName = AIRCRAFT_NAMES[aircraft] || aircraft || 'Discovery Flight';
```

- [ ] **Step 2: Update the heading and subheading**

Find:

```jsx
        <h1 style={styles.heading}>Booking Confirmed</h1>
        <p style={styles.subheading}>
          {name ? `Thank you, ${name}.` : 'Thank you.'} Your Discovery Flight has been booked.
        </p>
```

Replace with:

```jsx
        <h1 style={styles.heading}>{isMisc ? 'Purchase Confirmed' : 'Booking Confirmed'}</h1>
        <p style={styles.subheading}>
          {name ? `Thank you, ${name}.` : 'Thank you.'}{' '}
          {isMisc
            ? 'Your order has been placed. The HQ team will be in touch shortly.'
            : 'Your Discovery Flight has been booked.'}
        </p>
```

- [ ] **Step 3: Update the summary card to show item details for misc**

Find the Booking Summary card section. It currently shows:

```jsx
          <div style={styles.row}>
            <span style={styles.label}>Aircraft</span>
            <span style={styles.value}>{aircraftName}</span>
          </div>
```

Wrap the aircraft/duration rows in a conditional so they only show for flights:

```jsx
          {isMisc ? (
            itemName && (
              <div style={styles.row}>
                <span style={styles.label}>Item</span>
                <span style={styles.value}>{itemName}</span>
              </div>
            )
          ) : (
            <>
              <div style={styles.row}>
                <span style={styles.label}>Aircraft</span>
                <span style={styles.value}>{aircraftName}</span>
              </div>
```

Then find the closing of those rows (after duration and price rows) and close the conditional. Read the full BookingConfirmed.jsx to find the exact extent of the summary rows — wrap just the flight-specific rows.

- [ ] **Step 4: Commit**

```bash
git add src/pages/BookingConfirmed.jsx
git commit -m "feat(misc): update BookingConfirmed to show purchase messaging for misc type"
```

---

## Task 10: Create `AdminMiscMarketplace.jsx`

**Files:**
- Create: `src/pages/admin/AdminMiscMarketplace.jsx`

- [ ] **Step 1: Create the file**

```jsx
import { useState } from 'react';
import AdminLayout from '../../components/admin/AdminLayout';
import { useCollection, updateDocById } from '../../hooks/useFirestore';

const ENQUIRY_STATUSES = {
  new:       { label: 'New',       bg: '#fef3c7', color: '#92400e' },
  contacted: { label: 'Contacted', bg: '#e0f2fe', color: '#0369a1' },
  closed:    { label: 'Closed',    bg: '#f3f4f6', color: '#374151' },
};

const ORDER_STATUSES = {
  new:       { label: 'New',       bg: '#fef3c7', color: '#92400e' },
  fulfilled: { label: 'Fulfilled', bg: '#d1fae5', color: '#065f46' },
};

function displayAmount(pence) {
  return '£' + (pence / 100).toLocaleString('en-GB', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

function formatDate(ts) {
  if (!ts) return '—';
  const d = ts.toDate ? ts.toDate() : new Date(ts);
  return d.toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' });
}

function Detail({ label, value }) {
  return (
    <div style={{ background: '#f9fafb', border: '1px solid #e5e7eb', borderRadius: '6px', padding: '0.4rem 0.6rem' }}>
      <div style={{ fontSize: '0.65rem', color: '#9ca3af', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '2px' }}>{label}</div>
      <div style={{ fontSize: '0.8rem', color: '#111827', fontWeight: 600, wordBreak: 'break-word' }}>{value || '—'}</div>
    </div>
  );
}

export default function AdminMiscMarketplace() {
  const { docs: entries, loading } = useCollection('misc_marketplace', 'createdAt');
  const [updating, setUpdating] = useState(null);
  const [expanded, setExpanded] = useState(null);

  async function setStatus(id, status) {
    setUpdating(id);
    try { await updateDocById('misc_marketplace', id, { status }); }
    finally { setUpdating(null); }
  }

  const newCount = entries.filter((e) => e.status === 'new').length;

  return (
    <AdminLayout>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
        <div>
          <h1 style={{ fontSize: '1.5rem', fontWeight: 700, color: '#111827', margin: 0 }}>
            Marketplace
            {newCount > 0 && (
              <span style={{ marginLeft: 10, fontSize: '0.75rem', fontWeight: 700, background: '#ef4444', color: '#fff', borderRadius: 99, padding: '2px 8px' }}>
                {newCount} new
              </span>
            )}
          </h1>
          <p style={{ fontSize: '0.78rem', color: '#6b7280', margin: '4px 0 0' }}>
            Misc item enquiries and purchases.
          </p>
        </div>
      </div>

      {loading ? (
        <p style={{ color: '#6b7280' }}>Loading…</p>
      ) : entries.length === 0 ? (
        <p style={{ color: '#6b7280' }}>No entries yet.</p>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
          {entries.map((entry) => {
            const isOpen = expanded === entry.id;
            const isOrder = entry.type === 'order';
            const statuses = isOrder ? ORDER_STATUSES : ENQUIRY_STATUSES;
            const statusCfg = statuses[entry.status] || statuses.new;

            return (
              <div
                key={entry.id}
                style={{ background: '#fff', border: `1px solid ${entry.status === 'new' ? '#fbbf24' : '#e5e7eb'}`, borderRadius: '8px', overflow: 'hidden' }}
              >
                {/* Header row */}
                <div
                  onClick={() => setExpanded(isOpen ? null : entry.id)}
                  style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '0.85rem 1rem', cursor: 'pointer', userSelect: 'none' }}
                >
                  {/* Type badge */}
                  <span style={{
                    fontSize: '0.65rem', fontWeight: 700,
                    background: isOrder ? '#d1fae5' : '#fef3c7',
                    color: isOrder ? '#065f46' : '#92400e',
                    padding: '2px 7px', borderRadius: 99, textTransform: 'uppercase', letterSpacing: '0.06em', whiteSpace: 'nowrap',
                  }}>
                    {isOrder ? 'Order' : 'Enquiry'}
                  </span>

                  {/* Customer name */}
                  <span style={{ fontWeight: 600, fontSize: '0.9rem', color: '#111827', flex: 1, minWidth: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                    {entry.customerName}
                  </span>

                  {/* Item name */}
                  <span style={{ fontSize: '0.8rem', color: '#6b7280', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', maxWidth: '200px' }}>
                    {entry.itemName}
                  </span>

                  {/* Amount (orders only) */}
                  {isOrder && (
                    <span style={{ fontWeight: 700, fontSize: '0.9rem', color: '#111827', whiteSpace: 'nowrap' }}>
                      {displayAmount(entry.amount)}
                    </span>
                  )}

                  {/* Date */}
                  <span style={{ fontSize: '0.75rem', color: '#9ca3af', whiteSpace: 'nowrap' }}>{formatDate(entry.createdAt)}</span>

                  {/* Status badge */}
                  <span style={{ fontSize: '0.65rem', fontWeight: 700, background: statusCfg.bg, color: statusCfg.color, padding: '2px 8px', borderRadius: 99, whiteSpace: 'nowrap' }}>
                    {statusCfg.label}
                  </span>

                  {/* Chevron */}
                  <span style={{ color: '#9ca3af', fontSize: '0.75rem', transition: 'transform 0.15s', transform: isOpen ? 'rotate(180deg)' : 'none' }}>▼</span>
                </div>

                {/* Expanded details */}
                {isOpen && (
                  <div style={{ borderTop: '1px solid #e5e7eb', padding: '1rem' }}>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '0.5rem', marginBottom: '0.5rem' }}>
                      <Detail label="Email" value={entry.customerEmail} />
                      <Detail label="Phone" value={entry.customerPhone} />
                      <Detail label="Item" value={entry.itemName} />
                    </div>

                    {isOrder ? (
                      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '0.5rem', marginTop: '0.5rem' }}>
                        <Detail label="Qty" value={String(entry.qty || 1)} />
                        <Detail label="Amount" value={displayAmount(entry.amount)} />
                        <Detail label="Stripe Ref" value={entry.ref} />
                      </div>
                    ) : (
                      entry.message && (
                        <div style={{ marginTop: '0.5rem', background: '#f9fafb', border: '1px solid #e5e7eb', borderRadius: '6px', padding: '0.75rem' }}>
                          <div style={{ fontSize: '0.65rem', color: '#9ca3af', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '4px' }}>Message</div>
                          <div style={{ fontSize: '0.85rem', color: '#374151', lineHeight: 1.6, whiteSpace: 'pre-line' }}>{entry.message}</div>
                        </div>
                      )
                    )}

                    {/* Status actions */}
                    <div style={{ display: 'flex', gap: '0.5rem', marginTop: '1rem', alignItems: 'center' }}>
                      <span style={{ fontSize: '0.75rem', color: '#6b7280', marginRight: '0.25rem' }}>Mark as:</span>
                      {Object.entries(statuses).map(([key, cfg]) => (
                        <button
                          key={key}
                          disabled={entry.status === key || updating === entry.id}
                          onClick={() => setStatus(entry.id, key)}
                          style={{
                            padding: '3px 10px', border: '1px solid #d1d5db', borderRadius: 99,
                            fontSize: '0.72rem', fontWeight: 600,
                            cursor: entry.status === key ? 'default' : 'pointer',
                            background: entry.status === key ? cfg.bg : '#fff',
                            color: entry.status === key ? cfg.color : '#374151',
                            opacity: updating === entry.id ? 0.5 : 1,
                          }}
                        >
                          {cfg.label}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </AdminLayout>
  );
}
```

- [ ] **Step 2: Commit**

```bash
git add src/pages/admin/AdminMiscMarketplace.jsx
git commit -m "feat(misc): add AdminMiscMarketplace page with enquiry and order management"
```

---

## Task 11: Wire `App.jsx` + `AdminLayout.jsx`

**Files:**
- Modify: `src/App.jsx`
- Modify: `src/components/admin/AdminLayout.jsx`

- [ ] **Step 1: Add imports to `App.jsx`**

Find:

```js
import Misc from './pages/Misc';
```

Add immediately after it:

```js
import MiscItemDetail from './pages/MiscItemDetail';
```

Find:

```js
import AdminMiscItems from './pages/admin/AdminMiscItems';
import AdminMiscItemEdit from './pages/admin/AdminMiscItemEdit';
```

Add immediately after:

```js
import AdminMiscMarketplace from './pages/admin/AdminMiscMarketplace';
```

- [ ] **Step 2: Add public route to `App.jsx`**

Find:

```jsx
        <Route path="/misc" element={<Misc />} />
```

Add immediately after:

```jsx
        <Route path="/misc/:id" element={<MiscItemDetail />} />
```

- [ ] **Step 3: Add admin route to `App.jsx`**

Find:

```jsx
        <Route path="/admin/misc/:id" element={<AdminRoute><AdminMiscItemEdit /></AdminRoute>} />
```

Add immediately after:

```jsx
        <Route path="/admin/misc-marketplace" element={<AdminRoute><AdminMiscMarketplace /></AdminRoute>} />
```

- [ ] **Step 4: Add Marketplace nav entry to `AdminLayout.jsx`**

Find the `NAV_ITEMS` array. Find:

```js
  { to: '/admin/misc', icon: '🛒', label: 'Misc Items' },
```

Add immediately after:

```js
  { to: '/admin/misc-marketplace', icon: '🛍️', label: 'Marketplace' },
```

- [ ] **Step 5: Add `newMarketplaceCount` state and subscription to `AdminLayout.jsx`**

Find:

```js
  const [newBookingCount, setNewBookingCount] = useState(0);
```

Add immediately after:

```js
  const [newMarketplaceCount, setNewMarketplaceCount] = useState(0);
```

Find the second `useEffect` block (the one for bookings):

```js
  useEffect(() => {
    const q = query(collection(db, 'bookings'), where('status', '==', 'new'));
    const unsub = onSnapshot(q, (snap) => setNewBookingCount(snap.size), () => {});
    return unsub;
  }, []);
```

Add a new `useEffect` immediately after it:

```js
  useEffect(() => {
    const q = query(collection(db, 'misc_marketplace'), where('status', '==', 'new'));
    const unsub = onSnapshot(q, (snap) => setNewMarketplaceCount(snap.size), () => {});
    return unsub;
  }, []);
```

- [ ] **Step 6: Add the badge to the Marketplace nav item**

Find:

```jsx
              {item.to === '/admin/bookings' && newBookingCount > 0 && (
                <span style={{
                  background: '#ef4444', color: '#fff', borderRadius: '10px',
                  fontSize: '0.65rem', fontWeight: 700, padding: '1px 6px',
                  minWidth: '18px', textAlign: 'center', lineHeight: '18px',
                }}>
                  {newBookingCount > 99 ? '99+' : newBookingCount}
                </span>
              )}
```

Add immediately after it:

```jsx
              {item.to === '/admin/misc-marketplace' && newMarketplaceCount > 0 && (
                <span style={{
                  background: '#ef4444', color: '#fff', borderRadius: '10px',
                  fontSize: '0.65rem', fontWeight: 700, padding: '1px 6px',
                  minWidth: '18px', textAlign: 'center', lineHeight: '18px',
                }}>
                  {newMarketplaceCount > 99 ? '99+' : newMarketplaceCount}
                </span>
              )}
```

- [ ] **Step 7: End-to-end verification**

With the dev server running (`npm run dev`):

**POA enquiry flow:**
1. Create a POA item in `/admin/misc`
2. Navigate to `/misc` — card shows "View Details"
3. Click "View Details" → `/misc/:id` — shows enquiry form, no price
4. Submit the form — success message shown in-place
5. Navigate to `/admin/misc-marketplace` — enquiry appears with "Enquiry" badge and "New" status
6. Expand it — customer details + message visible
7. Mark as "Contacted" — status badge updates

**Fixed price flow (requires Stripe test keys):**
1. Create a fixed-price item (£10.00, hasQuantity=true, stock=3)
2. Navigate to its detail page — shows £10.00 price, qty stepper (1–3)
3. Set qty to 2, click "Buy Now" → redirected to `/checkout?type=misc&itemId=...&itemName=...&price=10.00&qty=2`
4. Checkout page shows "Complete Your Purchase", order summary with £20.00 total
5. Pay with Stripe test card `4242 4242 4242 4242` → redirected to `/booking-confirmed?type=misc&itemName=...`
6. BookingConfirmed shows "Purchase Confirmed"
7. Navigate to `/admin/misc-marketplace` — order appears with "Order" badge, £20.00 amount

**Admin sidebar:**
- "Marketplace" entry appears between "Misc Items" and "Images"
- Red badge appears when new entries exist

- [ ] **Step 8: Commit**

```bash
git add src/App.jsx src/components/admin/AdminLayout.jsx
git commit -m "feat(misc): wire MiscItemDetail route and AdminMiscMarketplace into app and admin nav"
```

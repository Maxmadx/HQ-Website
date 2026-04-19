# Misc Marketplace — Shipping Address Design Spec

**Date:** 2026-04-19
**Status:** Approved

---

## Overview

Add optional shipping address collection to the misc marketplace checkout. When a fixed-price misc item requires physical delivery, the admin marks it with `requiresShipping: true`. Customers then see delivery address fields in the checkout flow. The address is stored in the order document and displayed in the admin marketplace tab.

This feature does NOT apply to POA items — shipping is only relevant for fixed-price purchases.

---

## Part 1 — Data Model (`misc_items`)

### New field

| Field | Type | Default | Notes |
|-------|------|---------|-------|
| `requiresShipping` | boolean | `false` | Only meaningful when `priceType === 'fixed'` |

### Updated empty shape

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
};
```

---

## Part 2 — Admin Form (`AdminMiscItemEdit.jsx`)

Inside the existing `priceType === 'fixed'` conditional block (same section as `hasQuantity` and `stock`), add a checkbox:

```jsx
<label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer', fontSize: '0.875rem', color: '#374151' }}>
  <input
    type="checkbox"
    checked={form.requiresShipping}
    onChange={(e) => set('requiresShipping', e.target.checked)}
  />
  Requires delivery address at checkout
</label>
```

The existing `handleSubmit` POA cleanup spreads `{ price: 0, hasQuantity: false, stock: 1 }` over the payload when `priceType === 'poa'`. Extend this to also zero out `requiresShipping`:

```js
...(form.priceType === 'poa' ? { price: 0, hasQuantity: false, stock: 1, requiresShipping: false } : {}),
```

---

## Part 3 — Detail Page (`MiscItemDetail.jsx`)

`handleBuyNow` appends `&requiresShipping=1` to the checkout URL when `item.requiresShipping === true`:

```js
function handleBuyNow() {
  navigate(
    `/checkout?type=misc` +
    `&itemId=${id}` +
    `&itemName=${encodeURIComponent(item.name)}` +
    `&price=${(item.price / 100).toFixed(2)}` +
    `&qty=${qty}` +
    (item.requiresShipping ? `&requiresShipping=1` : '')
  );
}
```

---

## Part 4 — Checkout (`Checkout.jsx` + `MiscCheckoutForm`)

### `Checkout` function

Read the new param:
```js
const requiresShipping = searchParams.get('requiresShipping') === '1';
```

Pass it to `MiscCheckoutForm`:
```jsx
<MiscCheckoutForm
  itemId={itemId}
  itemName={itemName}
  qty={qty}
  price={price}
  requiresShipping={requiresShipping}
/>
```

### `MiscCheckoutForm` address fields

When `requiresShipping` prop is `true`, render four fields below the Phone field:

| Field | Required | Placeholder |
|-------|----------|-------------|
| Address Line 1 | Yes | `12 Example Street` |
| Address Line 2 | No | `Flat 2 (optional)` |
| City | Yes | `London` |
| Postcode | Yes | `SW1A 1AA` |

State:
```js
const [shippingAddress, setShippingAddress] = useState({ line1: '', line2: '', city: '', postcode: '' });
```

These fields are only rendered and validated when `requiresShipping === true`. When `requiresShipping` is false, `shippingAddress` is not sent to the server.

### API call

When submitting, include `shippingAddress` in the body (only when `requiresShipping`):
```js
body: JSON.stringify({
  itemId,
  qty: Number(qty),
  customerName: name,
  customerEmail: email,
  customerPhone: phone,
  ...(requiresShipping ? { shippingAddress } : {}),
}),
```

---

## Part 5 — Server (`server.js` + `api/stripe.js`)

### `POST /api/create-misc-payment-intent` (`server.js`)

Accept `shippingAddress` from the request body and pass it through to `createMiscPaymentIntent`. No address validation here — `server.js` does not read Firestore, so item-level validation happens inside `createMiscPaymentIntent`.

### `createMiscPaymentIntent` (`api/stripe.js`) — address validation

After reading the item from Firestore, if `item.requiresShipping === true`, validate that `shippingAddress` was provided with non-empty `line1`, `city`, and `postcode`. Return `400` if missing:

```js
if (item.requiresShipping) {
  if (!shippingAddress?.line1 || !shippingAddress?.city || !shippingAddress?.postcode) {
    const err = new Error('Delivery address is required for this item');
    err.statusCode = 400;
    throw err;
  }
}
```

### `createMiscPaymentIntent` (`api/stripe.js`)

When `shippingAddress` is provided, include it in PaymentIntent metadata:
```js
metadata: {
  productType: 'misc',
  itemId,
  itemName: String(item.name || '').slice(0, 500),
  qty: String(qtyNum),
  customerName,
  customerEmail,
  customerPhone,
  // Shipping (only when requiresShipping)
  shippingLine1: shippingAddress?.line1 || '',
  shippingLine2: shippingAddress?.line2 || '',
  shippingCity: shippingAddress?.city || '',
  shippingPostcode: shippingAddress?.postcode || '',
}
```

### Webhook (`api/stripe.js` — `payment_intent.succeeded`)

In the `productType === 'misc'` branch, extract and write shipping fields:
```js
const { itemId, itemName, qty, shippingLine1, shippingLine2, shippingCity, shippingPostcode } = pi.metadata;
await admin.firestore().collection('misc_marketplace').doc(pi.id).set({
  type: 'order',
  status: 'new',
  createdAt: admin.firestore.FieldValue.serverTimestamp(),
  ref: pi.id,
  amount: pi.amount,
  itemId: itemId || '',
  itemName: itemName || '',
  qty: Number(qty),
  customerName,
  customerEmail,
  customerPhone,
  // Only written when non-empty
  ...(shippingLine1 ? { shippingLine1, shippingLine2: shippingLine2 || '', shippingCity, shippingPostcode } : {}),
});
```

---

## Part 6 — Admin Marketplace (`AdminMiscMarketplace.jsx`)

In the expanded order view, when `entry.shippingLine1` is present, render a "Delivery Address" block below the Qty/Amount/Stripe Ref row:

```jsx
{entry.shippingLine1 && (
  <div style={{ marginTop: '0.5rem', background: '#f9fafb', border: '1px solid #e5e7eb', borderRadius: '6px', padding: '0.75rem' }}>
    <div style={{ fontSize: '0.65rem', color: '#9ca3af', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '4px' }}>Delivery Address</div>
    <div style={{ fontSize: '0.85rem', color: '#374151', lineHeight: 1.6 }}>
      {entry.shippingLine1}<br />
      {entry.shippingLine2 && <>{entry.shippingLine2}<br /></>}
      {entry.shippingCity}<br />
      {entry.shippingPostcode}
    </div>
  </div>
)}
```

---

## File Map

| File | Change |
|------|--------|
| `src/pages/admin/AdminMiscItemEdit.jsx` | Add `requiresShipping` to EMPTY, checkbox in fixed-price section, POA cleanup |
| `src/pages/MiscItemDetail.jsx` | Append `&requiresShipping=1` to Buy Now URL when applicable |
| `src/pages/Checkout.jsx` | Read `requiresShipping` param; pass to `MiscCheckoutForm`; show address fields; send in body |
| `server.js` | Validate `shippingAddress` when item `requiresShipping`; pass to `createMiscPaymentIntent` |
| `api/stripe.js` | Store shipping fields in PI metadata; write to `misc_marketplace` doc in webhook |
| `src/pages/admin/AdminMiscMarketplace.jsx` | Show delivery address block in expanded order view |

---

## Success Criteria

1. Admin can tick "Requires delivery address at checkout" on any fixed-price misc item
2. Buy Now URL includes `requiresShipping=1` when set
3. Checkout shows four address fields (line1 required, line2 optional, city required, postcode required) only when `requiresShipping=1`
4. Server validates address presence server-side when item has `requiresShipping: true`
5. Order doc in `misc_marketplace` contains `shippingLine1/2/city/postcode` fields
6. Admin marketplace shows the delivery address in the expanded order view
7. Items without `requiresShipping` continue to work exactly as before

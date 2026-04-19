# Misc Marketplace — Fully Functional Design Spec

**Date:** 2026-04-19
**Status:** Approved

---

## Overview

Extend the existing `/misc` catalogue into a fully functional marketplace. Items are either **POA** (price on application — enquiry flow) or **Fixed Price** (purchasable via Stripe). A new `/misc/:id` detail page replaces the grid's "Enquire" button. A dedicated admin tab (`/admin/misc-marketplace`) shows enquiries and orders separately from the main leads panel.

---

## Part 1 — Data Model Changes to `misc_items`

### New fields

| Field | Type | Default | Notes |
|-------|------|---------|-------|
| `priceType` | `'poa' \| 'fixed'` | `'poa'` | Determines the CTA shown on the detail page |
| `price` | number (pence) | `0` | Only meaningful when `priceType === 'fixed'` |
| `hasQuantity` | boolean | `false` | Whether a qty stepper appears on the detail page |
| `stock` | number | `1` | Max selectable qty; only relevant when `hasQuantity: true` |

`priceDisplay` continues to be stored. When `priceType === 'fixed'`, the admin form auto-derives it as `£X` from the `price` field (no manual entry needed). When `priceType === 'poa'`, it stays `'POA'`.

### Empty shape

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

---

## Part 2 — Admin Form Changes (`AdminMiscItemEdit.jsx`)

### Pricing section

Replace the existing free-text `priceDisplay` input with:

1. **Radio group:** "Price on Application" / "Fixed Price"
2. **When Fixed Price selected:**
   - Numeric price input (pounds, e.g. `250.00`) — stored as pence on save
   - `priceDisplay` auto-set to `£X` (derived, not editable)
3. **When POA selected:**
   - No price fields shown
   - `priceDisplay` auto-set to `'POA'`

### Quantity section (shown only when `priceType === 'fixed'`)

- Checkbox: **"Allow quantity selection"** (`hasQuantity`)
- When checked: **"Stock available"** number input (`stock`, min 1)

---

## Part 3 — Public `/misc` Grid Change (`Misc.jsx`)

Single change: replace the `<Link to="/contact" className="misc-card__enquire">Enquire</Link>` with:

```jsx
<Link to={`/misc/${item.id}`} className="misc-card__enquire">View Details</Link>
```

No other changes to the grid, CSS, or layout.

---

## Part 4 — New Detail Page (`MiscItemDetail.jsx` at `/misc/:id`)

### Layout

Split-panel matching `UsedAircraftDetail.jsx`:

```
┌──────────────────────────────────────────────────────────┐
│  FinalDraftHeader                                         │
├────────────────────────┬─────────────────────────────────┤
│  LEFT (sticky, 45%)    │  RIGHT (scrollable)              │
│  ← Back to Misc (→/misc) │  Category eyebrow (mono)      │
│  Image carousel        │  Item name (large, bold)         │
│  Thumbnail row         │  Condition badge                 │
│                        │  Description                     │
│                        │  ─────────────────────────────  │
│                        │  [POA branch]                    │
│                        │    "Price on Application"        │
│                        │    Enquiry form                  │
│                        │      Name, Email, Phone, Message │
│                        │      [Send Enquiry]              │
│                        │    → success message in-place    │
│                        │  [Fixed price branch]            │
│                        │    £X price display              │
│                        │    [─ 1 +] qty stepper (if       │
│                        │      hasQuantity, capped at stock)│
│                        │    [Buy Now] → /checkout?...     │
└────────────────────────┴─────────────────────────────────┘
│  FooterMinimal                                            │
└──────────────────────────────────────────────────────────┘
```

### Data loading

```js
const { id } = useParams();
// Load on mount via getDoc(doc(db, 'misc_items', id))
```

If doc doesn't exist: show "Item not found" with link back to `/misc`.

### POA enquiry form

Fields: Name, Email, Phone, Message (optional).

On submit: `POST /api/misc-enquiry` with:
```js
{ name, email, phone, message, itemId: id, itemName: item.name }
```

On success: replace form with in-place success message ("Thanks — we'll be in touch."). No redirect.
On error: show error message inline.

### Fixed price CTA

- Display: `£X` derived from `item.price / 100`
- Qty stepper: visible only if `item.hasQuantity === true`, range 1–`item.stock`
- Buy Now button navigates to:
  ```
  /checkout?type=misc&itemId={id}&itemName={encodeURIComponent(item.name)}&price={item.price}&qty={qty}
  ```

### Image gallery

Identical to `UsedAircraftDetail.jsx`: main image with prev/next arrows, thumbnail row below, click to advance. If no images: centred placeholder icon.

---

## Part 5 — New Firestore Collection: `misc_marketplace`

Holds both POA enquiries and fixed-price orders from customers.

### Enquiry document shape

```js
{
  type: 'enquiry',
  status: 'new',           // new → contacted → closed
  createdAt: serverTimestamp(),
  itemId: string,
  itemName: string,
  customerName: string,
  customerEmail: string,
  customerPhone: string,
  message: string,
}
```

### Order document shape

```js
{
  type: 'order',
  status: 'new',           // new → fulfilled
  createdAt: serverTimestamp(),
  ref: string,             // Stripe PaymentIntent ID
  amount: number,          // pence
  itemId: string,
  itemName: string,
  qty: number,
  customerName: string,
  customerEmail: string,
  customerPhone: string,
}
```

### Firestore rules

```
match /misc_marketplace/{id} {
  allow read: if isAdmin();
  allow write: if false;   // server-only writes
}
```

---

## Part 6 — Server Changes (`server.js` + `api/stripe.js`)

### New endpoint: `POST /api/misc-enquiry`

```
Body: { name, email, phone, message, itemId, itemName }
```

- Validates presence of `name`, `email`, `itemId`, `itemName`
- Basic email format check
- Writes to `misc_marketplace` collection via admin SDK
- Returns `200 { ok: true }` or `400/500 { error: '...' }`

### New endpoint: `POST /api/create-misc-payment-intent`

```
Body: { itemId, qty, customerName, customerEmail, customerPhone }
```

- Validates all fields present
- Validates `qty` is integer ≥ 1
- Looks up `misc_items/{itemId}` via admin SDK — reads `price` and `name` server-side (client-supplied price is **never trusted**)
- Validates item exists and `priceType === 'fixed'` and `price > 0`
- Validates `qty ≤ item.stock` (if `hasQuantity`) or `qty === 1`
- Creates PaymentIntent for `price × qty` with metadata:
  ```js
  {
    productType: 'misc',
    itemId,
    itemName: item.name,
    qty: String(qty),
    customerName, customerEmail, customerPhone,
  }
  ```
- Returns `{ clientSecret }`

### Stripe webhook extension (`api/stripe.js`)

In `payment_intent.succeeded` handler, add `productType === 'misc'` branch:

```js
if (productType === 'misc') {
  const { itemId, itemName, qty } = pi.metadata;
  await admin.firestore().collection('misc_marketplace').doc(pi.id).set({
    type: 'order',
    status: 'new',
    createdAt: admin.firestore.FieldValue.serverTimestamp(),
    ref: pi.id,
    amount: pi.amount,
    itemId,
    itemName,
    qty: Number(qty),
    customerName, customerEmail, customerPhone,
  });
}
```

---

## Part 7 — Checkout Extension (`Checkout.jsx`)

### Detection

When `searchParams.get('type') === 'misc'`, read: `itemId`, `itemName`, `price` (pence, display only), `qty`.

Validity check:
```js
const isMiscValid = type === 'misc' && itemId && itemName && Number(price) > 0 && Number(qty) >= 1;
```

Invalid → redirect to `/misc`.

### Order summary (misc branch)

```
Order Summary
─────────────
Item        R22 Helicopter Cover
Qty         2
Total       £500
```

### Payment form (misc branch)

Same Stripe card form (CardNumber, CardExpiry, CardCvc), same Name/Email/Phone fields. On submit: calls `/api/create-misc-payment-intent` with `{ itemId, qty, customerName, customerEmail, customerPhone }`. On success: redirects to `/booking-confirmed?ref=...&name=...` (same confirmation page).

---

## Part 8 — New Admin Page (`AdminMiscMarketplace.jsx` at `/admin/misc-marketplace`)

### Pattern

Identical expandable-card pattern to `AdminBookings.jsx`.

### List item (collapsed)

- Type badge: "Enquiry" (amber) or "Order" (green)
- Customer name
- Item name
- Amount (orders only, `—` for enquiries)
- Date
- Status badge
- Chevron

### Expanded detail

**Enquiry:**
- Email, Phone, Item, Message

**Order:**
- Email, Phone, Item, Qty, Amount, Stripe Ref

### Status actions

- Enquiry: `new → contacted → closed`
- Order: `new → fulfilled`

Status updates via `updateDocById('misc_marketplace', id, { status })`.

### Sidebar

- Nav entry: `{ to: '/admin/misc-marketplace', icon: '🛍️', label: 'Marketplace' }` — added after the existing `Misc Items` entry
- Badge showing count of `new` items (same pattern as bookings badge in `AdminLayout.jsx`)

---

## App.jsx changes

```jsx
import MiscItemDetail from './pages/MiscItemDetail';
import AdminMiscMarketplace from './pages/admin/AdminMiscMarketplace';

// Public routes
<Route path="/misc/:id" element={<MiscItemDetail />} />

// Admin routes
<Route path="/admin/misc-marketplace" element={<AdminRoute><AdminMiscMarketplace /></AdminRoute>} />
```

---

## Firestore Rules additions

```
match /misc_marketplace/{id} {
  allow read: if isAdmin();
  allow write: if false;
}
```

---

## Success Criteria

1. "View Details" replaces "Enquire" in the `/misc` grid — links to `/misc/:id`
2. Detail page loads item from Firestore; gallery, condition badge, description all render
3. POA items show enquiry form; submission creates a doc in `misc_marketplace` and shows in-place success
4. Fixed-price items show price + optional qty stepper + Buy Now
5. Buy Now → checkout shows correct order summary; payment creates `misc_marketplace` order doc via webhook
6. `/admin/misc-marketplace` shows all enquiries and orders with status management
7. Marketplace badge in admin sidebar increments for new items
8. Admin can set `priceType`, `price`, `hasQuantity`, `stock` on any misc item
9. Server-side price validation — client cannot tamper with the charge amount

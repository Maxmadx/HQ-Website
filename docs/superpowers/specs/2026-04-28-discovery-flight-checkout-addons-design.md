# Discovery Flight Checkout Add-ons — Design

**Date:** 2026-04-28
**Status:** Draft
**Scope:** `/checkout` (DF flow), `AdminMiscItemEdit`, `AdminMiscItems`, `api/stripe.js`

## Goal

On the Discovery Flight checkout, surface a curated list of HQ Store items as
add-ons so buyers can grow their basket while paying for the flight. Each item
can carry an optional discount that applies on this page only. One Stripe
charge covers the flight plus add-ons.

## Non-goals

- No changes to the standalone HQ Store checkout (`/checkout?type=misc`).
- No site-wide discount engine. The discount field is per-item, scoped to the
  DF checkout.
- No inventory tracking for DF add-ons. Items shown here are assumed to be in
  stock indefinitely.
- No POA items as add-ons. Admin UI prevents the configuration; no runtime
  defence beyond that.

## Data model

Two fields added to each `misc_items` Firestore doc:

```js
discoveryAddon: false,            // boolean — appear on DF checkout?
discoveryAddonDiscountPct: 0,     // integer 0–100, applied at DF checkout
```

Defaults are `false` and `0`. Existing docs without these fields are treated
as not-an-add-on (no migration needed; reads default to falsy).

The existing `requiresShipping`, `hasQuantity`, and `stock` fields remain in
the schema but are unused on the DF flow — fulfilment is buyer-chosen at
checkout, and DF add-ons are not stock-limited.

## Admin UI — `AdminMiscItemEdit.jsx`

A new "Discovery Flight Add-on" section appears in the form body, but only
when `priceType === 'fixed'`. POA items hide the section entirely.

Layout:

- Checkbox: "Show on Discovery Flight checkout" → `discoveryAddon`.
- When checked, reveal a percent input below: "Discount on Discovery Flight
  checkout: __ %" → `discoveryAddonDiscountPct`. Inline help: "Leave as 0 for
  full price."
- Input is integer 0–100, step 1.
- On save, when `discoveryAddon === false`, force `discoveryAddonDiscountPct`
  to 0.

`AdminMiscItems.jsx` (the list view): each row gains a small "DF" pill on
the right when `discoveryAddon === true`, so it's scannable at a glance. No
filter or sort changes.

## Checkout UI — `Checkout.jsx` (DF mode only)

Mounted between the existing aircraft summary and the payment fields, only
when the page is in DF mode (i.e. not the misc-item path).

### Data fetch

On mount, query Firestore: `misc_items where discoveryAddon == true`. While
loading, render nothing (no skeleton, no header). When the result is empty,
the entire add-ons section never appears — no header, no spacing.

### Item card

Each add-on renders as a horizontal card:

```
┌──────┐  Item name                                       
│ img  │  Short description (optional)                    
└──────┘  £original  £discounted   [-] N [+]              
            └ "X% OFF" pill (only when discount > 0)
```

Discount styling rule (strict): if `discoveryAddonDiscountPct === 0`, render
a single price with no strikethrough, no badge, and no "X% off" text. If
`discoveryAddonDiscountPct > 0`, render the original struck-through, the
discounted price bold, and a small "X% OFF" pill.

Quantity selector: `[-] N [+]`, starts at 0. Soft cap at 10 per item. Item
counts as "in basket" when its qty > 0 — no separate Add button. No stock
validation.

Items sort by `discoveryAddonDiscountPct` desc, then `name` asc, so the
biggest discounts lead.

### Fulfilment toggle

Appears only when at least one add-on has qty > 0:

```
Fulfilment:  ◉ Collect on the day      ○ Delivery
```

- Default: **Collect on the day**. No address required.
- Selecting **Delivery** reveals four required address fields below (Line 1,
  Line 2 optional, City, Postcode), shape identical to the existing
  `MiscCheckoutForm` shipping block.
- When the existing voucher toggle is ON, the fulfilment radio locks to
  Delivery, the Collect option is disabled, and helper text reads "Required
  because the recipient redeems the flight later."
- When the buyer toggles voucher off after picking Delivery, the choice
  stays Delivery (no surprise resets). They can switch back to Collect
  manually.
- When all add-on qtys return to 0, the fulfilment toggle and address fields
  disappear and reset to defaults.

### Live total

The Pay button label shows the running total:
`Pay £<flight + Σ(addonPrice × qty × (1 − discountPct / 100))>`.
This is cosmetic. The real total is the server's response.

## Server / payment flow — `api/stripe.js`

`createPaymentIntent` extends to accept add-ons. Client never supplies prices.

### Request body adds

```js
addons: [{ itemId: '<misc_items doc id>', qty: 2 }, ...],   // [] if none
fulfilment: 'collect' | 'delivery',                          // required if addons.length > 0
shippingAddress: { line1, line2, city, postcode }            // required if fulfilment === 'delivery'
```

### Server logic

1. Compute flight price via existing `getPrice(aircraft, duration)`.
2. For each addon entry:
   - Fetch its `misc_items` doc.
   - Validate `discoveryAddon === true` (else 400 — "this add-on is no
     longer available, please refresh").
   - Validate `priceType === 'fixed'` and `price > 0` (else 400 — internal
     misconfiguration).
   - Validate `qty` is an integer ≥ 1 and ≤ 10 (matches UI cap).
   - Compute line total in pence:
     `Math.round(price × qty × (1 − discoveryAddonDiscountPct / 100))`.
3. If `addons.length > 0` and `wantsVoucher === true`, force
   `fulfilment = 'delivery'` and validate `shippingAddress` is present and
   non-empty. (Mirrors the UI lock.) When `addons.length === 0`, fulfilment
   and address are ignored entirely.
4. Final amount = flight + Σ(line totals). One PaymentIntent, currency `gbp`.

### Stripe PaymentIntent metadata

Existing fields stay. New fields:

- `fulfilment`: `'collect'` or `'delivery'`.
- `shippingLine1`, `shippingLine2`, `shippingCity`, `shippingPostcode`: only
  when delivery.
- `addons`: JSON-stringified `[{ itemId, name, qty, unitPrice, discountPct,
  lineTotal }]`. Stripe limits each metadata value to 500 chars; if the
  encoded string exceeds that, fall back to a compact form
  `[{ itemId, qty }]` and rely on the booking record + Firestore lookup for
  display details.

### Webhook & booking record — `recordBooking`

Parses `metadata.addons`, plus fulfilment + address fields, and writes them
onto the booking doc:

```js
addons: [{ itemId, name, qty, unitPrice, discountPct, lineTotal }],
fulfilment: 'collect' | 'delivery',
shippingAddress: { line1, line2, city, postcode } | null
```

No stock decrement — DF add-ons aren't stock-limited.

### Confirmation email

Extends the existing DF confirmation email template:

- Adds an "Add-ons" section listing each add-on as `qty × unit (discount%) =
  line total`.
- Adds a "Fulfilment" line:
  - Collect: "Collect at Denham on the day of your flight."
  - Delivery: full shipping address.

## Edge cases

- **No add-ons configured.** Firestore query returns 0 docs; the section
  never mounts.
- **Item gets unflagged mid-checkout.** Server returns 400; the checkout
  surfaces the error, removes the item from the basket, and lets the buyer
  retry.
- **Discount changed mid-checkout.** Server uses the latest Firestore
  value; UI total is purely cosmetic. The booking-confirmed page shows the
  server's actual total.
- **Voucher toggled on after picking Collect.** Fulfilment auto-switches to
  Delivery and locks; address block reveals empty and required.
- **Voucher toggled off after Delivery.** Choice stays Delivery; buyer can
  switch back to Collect manually.
- **All qtys return to 0.** Fulfilment toggle + address fields disappear and
  reset to defaults.

## Acceptance criteria

- An admin can mark a fixed-price `misc_items` doc as a DF add-on and set a
  discount percent in the admin form.
- POA items show no DF add-on section in the admin form.
- The DF checkout shows the add-ons section only when at least one item is
  flagged. Empty list ⇒ no section, no header.
- Items with discount = 0 render with a single price and no discount-related
  visual treatment.
- Items with discount > 0 render strikethrough original + bold discounted +
  "X% OFF" pill.
- Qty selector lets buyers pick 0–10 per item; total updates live.
- Fulfilment toggle defaults to Collect, switches to Delivery on demand,
  reveals required address fields.
- Voucher toggle locks fulfilment to Delivery.
- Server validates all add-on data from Firestore. Final charge is one
  Stripe PaymentIntent for `flight + Σ(addons)`.
- Booking doc and confirmation email include the add-ons, fulfilment, and
  address (when delivery).

## Out of scope (explicit)

- Inventory tracking for DF add-ons.
- POA items as add-ons.
- Per-item shipping selection. Fulfilment is a single choice for the basket.
- Edits to the standalone misc store checkout.
- Marketing copy variations (e.g. "with the purchase of a discovery flight
  get 30% off"). Discount % is per-item, not advertised as a blanket promise.

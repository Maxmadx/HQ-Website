# Cart Tracking & HQ Store Cart — Design

**Date:** 2026-05-14
**Status:** Approved (design)
**Branch:** launchday

## Problem

Two connected problems with the `carts` system and the `/admin` Abandoned Carts tile:

1. **Captured emails aren't visible.** When a customer enters their email on the
   flight checkout, `upsertCart` writes a cart with `status: 'active'`. But the
   admin tile's action table only shows carts the recovery cron has flipped to
   `abandoned`/`expired`. The cron is gated off by default (`CART_RECOVERY_AUTO`),
   so in practice carts stay `active` forever and never surface — the admin can't
   see or target captured emails.

2. **Other checkouts don't create carts at all.** The HQ store (products) and the
   London tour checkout never call `upsertCart`. Products go through `Checkout.jsx`
   with `type=misc` but every cart hook is explicitly bypassed (`if (isMisc) return`).
   London tour is a separate component with no cart wiring.

Underneath problem 2 is a bigger gap: **the HQ store has no real cart.** Each product
is bought one at a time via a `/checkout?type=misc&itemId=…` redirect — there is no
way to add multiple items or keep shopping.

The query layer also has a latent bug: `GET /api/carts` only fetches
`['active','checkout_initiated','abandoned']`, so `expired` and `completed` carts are
never returned — the "Recovered" funnel stage can never be non-zero.

## Goals

- Every cart with an email is immediately visible and targetable in `/admin`,
  regardless of status.
- All three checkout types (discovery flight, product, London tour) create carts
  and capture the email the moment it's entered, using the same email-first +
  exit-intent pattern.
- The HQ store gets a real multi-item shopping cart (add to cart, keep shopping,
  persist, review, multi-line checkout).
- Carts are categorised (discovery flight / product / London tour) in `/admin`,
  and product carts remember the actual products.
- Cart lifecycle is **fully manual** for now — the admin changes status, marks
  contacted, and deletes via buttons. Automated recovery emails stay off.
- Fix the `GET /api/carts` query so `expired`/`completed` carts are fetched.

## Non-goals (deferred)

- Automated recovery emails (1h/24h cron). The cron stays gated off
  (`CART_RECOVERY_AUTO`). The user will revert to automated sending later.
- In-app "Send recovery" button and per-category email templates. Outreach is
  manual (copy email) for now.
- Per-category funnels. One overall funnel; the action table is categorised.

## Decisions

| Question | Decision |
|---|---|
| Active-with-email carts | Show immediately as targetable in the action table |
| Admin emails | Keep excluding (`excludedFromAnalytics`) — test with a non-admin email |
| Backend strategy | Approach A: two-query `GET /api/carts`, client-side aggregation |
| Cart lifecycle | Fully manual — admin status buttons, "Mark contacted", delete |
| Outreach | Copy-email for every category; no in-app send button |
| `Recoverable` definition | Any non-completed cart with a usable email |
| Store cart view | Hybrid — slide-out drawer on desktop, `/cart` page on mobile |
| Product cart shape | Multi-item `products[]` array |
| Funnel stages | Carts / Abandoned / Recoverable / Contacted / Recovered |

## Section 1 — Data model

Cart docs and `CartUpsertSchema` (`api/lib/cartValidation.js`) gain:

- **`category`** — `'discovery_flight' | 'product' | 'london_tour'`. Set explicitly
  by each checkout flow.
- **`products[]`** — `[{ itemId, name, qty, size, priceP, requiresShipping }]`.
  This array *is* the store cart. Empty for non-product carts.
- **`londonTour`** — `{ experience, timeOfDay, quantity } | null`.
- **`flight`** — unchanged, `{ aircraftId, duration } | null`, discovery flight only.
- **`addons[]`** — unchanged, discovery-flight add-ons.
- **`contactedAt`** — timestamp, set by the admin "Mark contacted" button. Null otherwise.

**Pricing.** Flight carts keep server-side repricing (`repriceCart`). For product and
London-tour carts, `totalP` is stored from the client figure as a **display-only**
value (action table "Value" column). The *actual charge* is always repriced
server-side at the payment-intent endpoint — the cart doc is for analytics/recovery
only, never for charging.

**Status** values are unchanged (`active | checkout_initiated | abandoned | expired
| completed`), but all transitions are admin-manual (Section 5), not cron-driven.

## Section 2 — HQ Store cart (customer-facing)

- **Cart state:** a `CartContext` holding `products[]`, persisted to `localStorage`
  (`hq_store_cart`). Source of truth for the UI; survives refresh and return visits.
  Tolerates corrupt/missing data by resetting to empty.
- **Server sync:** every add/update/remove fires a debounced
  `upsertCart({ sessionId, category: 'product', products })`. This is what makes an
  abandoned store cart appear in the `/admin` tile.
- **Header:** cart icon + item-count badge across store pages.
- **Add to cart:** `MiscItemDetail.jsx`'s buy button becomes "Add to Cart" (carries
  `qty` + `size`). POA / enquiry-only items (no fixed price) keep the existing
  enquiry flow — they cannot enter the cart.
- **Cart view (hybrid):** slide-out drawer on desktop, dedicated `/cart` page on
  mobile. Both list line items with qty steppers, remove, subtotal, and
  "Checkout" + "Keep shopping" actions.
- **Checkout:** `/checkout` reads the multi-item store cart, renders every line in
  the Order Summary. Replaces today's single-item `?type=misc&itemId=…` URL.

Rationale for hybrid: A/B research shows cart drawers lift desktop conversion but
hurt mobile, especially for small catalogues — drawer on desktop, page on mobile is
the safest split.

## Section 3 — Checkout flows (email capture)

- **Shared component:** extract `Checkout.jsx`'s `InlineEmailStep` + exit-intent
  wiring (`useExitIntent`, `useTabReturn`, the dark/bigger morph) into a reusable
  `<EmailFirstGate>` used by all three flows.
- **Products** (`Checkout.jsx`): remove the three `isMisc` bypasses (upsert mount
  effect, `needsEmail`, exit-intent `enabled`). It reads the multi-item store cart
  instead of URL params, renders every line in the Order Summary, and on email
  submit calls `upsertCart({ category: 'product', products })`.
- **London tour** (`LondonTourCheckout.jsx`): restructure the single combined form
  into email-first → details/payment via `<EmailFirstGate>`, add exit-intent, and
  `upsertCart({ category: 'london_tour', londonTour })` on email submit. The
  existing `/api/create-london-tour-payment-intent` path is untouched.

## Section 4 — Backend (Approach A)

- **`GET /api/carts`** (admin): two Firestore queries —
  (1) `status in [active, checkout_initiated, abandoned, expired]`, `orderBy
  updatedAt desc`, `limit 200`;
  (2) `status == 'completed'`, `orderBy updatedAt desc`, `limit 200`, trimmed to
  funnel-only fields (`status`, `contactedAt`, `excludedFromAnalytics`, `totalP`,
  `category`).
  Merge and return.
- **`PATCH /api/carts/:id/status`** (admin): set status manually; stamps
  `abandonedAt` when moved to `abandoned`. Validates against the allowed status set.
- **`POST /api/carts/:id/mark-contacted`** (admin): stamps `contactedAt`.
- **`DELETE /api/carts/:id`** (admin): hard delete.
- **Schema:** `CartUpsertSchema` extended with `category`, `products[]`,
  `londonTour`. Product/London-tour `totalP` accepted as a sanitised display figure.
- **Misc payment intent:** generalised to accept `products[]` and reprice each line
  server-side against the product catalogue.
- **Cron:** no change — stays gated off via `CART_RECOVERY_AUTO`. The existing
  `POST /api/carts/:id/send-recovery` endpoint remains in the API but is no longer
  called by the tile.

## Section 5 — Admin tile (categories + manual controls)

- The tile reads **all email carts**; the action table is **grouped by category** —
  Discovery Flights / Products / London Tours — with category-appropriate row
  detail (aircraft+duration / product names+qty / experience+time).
- **Per-row controls:** status buttons (Active / Abandoned / Expired / Completed —
  the active button indicates current status, so no separate read-only column), a
  **"Mark contacted"** button, a **Delete** button, and the email shown with
  copy-to-clipboard.
- **"Abandoned X ago":** time-ago from `abandonedAt` (stamped when the admin marks
  it abandoned), falling back to `updatedAt`.
- **Funnel:** Carts / Abandoned / Recoverable / Contacted / Recovered — every stage
  driven by manual actions.

## Section 6 — Aggregations & tests

- `cartAggregations.js`:
  - `isRecoverable` = has email + not `noEmail` + not `excludedFromAnalytics` +
    status !== `completed`.
  - `computeCartFunnel`: `abandoned` = abandoned+expired; `recoverable` =
    `isRecoverable`; `contacted` = recoverable + `contactedAt`; `recovered` =
    `completed` + `contactedAt`.
  - `recoverableCarts` uses the new `isRecoverable`, sorted by `updatedAt desc`;
    the component groups by `category`.
- **Error handling:** `upsertCart` stays fire-and-forget (never blocks checkout);
  admin status/delete/contacted actions show inline failure and re-fetch on
  success; the localStorage cart resets to empty on corrupt/missing data.
- **Tests:** update `cartAggregations.test.js` and `AbandonedCartTile.test.jsx`;
  new tests for the `PATCH`/`DELETE`/`mark-contacted` endpoints, `CartContext`
  (add/update/remove/persist), and multi-item misc payment-intent repricing.

## Staged implementation

One spec, four implementation phases (the data model couples everything, so it
lands first):

1. **Data model + backend** — schema changes, two-query `GET`, `PATCH`/`DELETE`/
   `mark-contacted` endpoints, `cartAggregations.js` redefinition + tests.
2. **HQ store cart** — `CartContext` + localStorage, header cart icon, add-to-cart
   on `MiscItemDetail.jsx`, hybrid drawer/`/cart` page.
3. **Checkout wiring** — shared `<EmailFirstGate>`, products multi-item in
   `Checkout.jsx`, London tour restructure, misc payment-intent generalisation.
4. **Admin tile** — categorised grouping, manual status/contacted/delete controls,
   copy-email, "abandoned X ago", funnel redefinition.

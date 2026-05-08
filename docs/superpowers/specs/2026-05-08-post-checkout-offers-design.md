# Post-Checkout Offers, Referral Attribution, R22→R44 Upgrade & Apparel Sizes

**Date:** 2026-05-08
**Status:** Design — pending implementation plan
**Scope:** Single shippable unit covering four interrelated pieces of work.

---

## 1. Goals

1. Add a "two-offer" block to `/booking-confirmed` for Discovery Flight bookers.
2. Introduce an **invisible** referral attribution system so a booker can earn a free HQ item when a friend they shared a link with completes a Discovery Flight booking.
3. Allow R22 bookers to upgrade to an R44 (with their choice of 30 or 60 min) by paying only the price difference, claimable from the confirmation page or via a link in the confirmation email.
4. Add **apparel + size selection** to the public `/store` purchase path, including admin support.

The four pieces ship together as one spec (per user decision).

---

## 2. Non-Goals (Out of Scope)

- Email-link upgrades after the first claim (only one upgrade attempt per booking).
- Stock tracking per size on apparel items.
- Referral chains (referee subsequently referring others).
- A booker-facing dashboard to track referral status.
- Tiered upgrades (R44 → R66 not offered).
- Retroactively granting referral codes to bookings made before this feature ships.
- A visible referral-code field on the normal Discovery Flight checkout. Referral attribution is **invisible** to anyone who didn't arrive via a share link.

---

## 3. Architecture Overview

Four logical pieces, one shippable unit:

**(a) Post-checkout offers block** on `/booking-confirmed`. Two cards: "Refer a friend → free [HQ Item]" first, "Bring 2 extra friends — upgrade to R44" second. Visible only when the booking is a Discovery Flight (not a misc purchase, not a voucher-only flow). The upgrade card is hidden for R44/R66 bookers.

**(b) Invisible referral attribution.** A short alphanumeric code is generated server-side at PI creation and stored on the booking record + a fast-lookup `referral_codes` collection. The booker only ever sees a *share link* (containing the code as a query param). When a friend opens the link, JS captures `?ref=…` silently and sends it with the friend's create-PI call. On the friend's `payment_intent.succeeded`, a webhook flips the original booker's record to `referralCompleted=true` and emails the HQ team to fulfil. The original booker never sees the bare code; the friend's checkout has no referral UI whatsoever.

**(c) R22 → R44 upgrade flow.** A standalone `<UpgradePanel>` component reused on `/booking-confirmed` (inline) and `/upgrade?ref=<originalPaymentIntentId>` (standalone page from email link). User picks 30 or 60 min, sees live diff math vs already-paid-flight-amount, pays via inline Stripe Elements card form. New PI is created for the diff only; on webhook success, original booking record is updated in place (`aircraft`, `duration` overwritten; `originalAircraft`, `originalDuration` preserved; `upgrade { … }` populated). Add-ons and voucher are untouched.

**(d) Apparel + sizes for `/store`.** Two new admin fields on `misc_items`: `apparel: bool` and `sizes: string[]`. When both are present, the public product page (`MiscItemDetail`) shows a required size selector. The chosen size is sent to `create-misc-payment-intent`, stored in PI metadata, and surfaced in the order confirmation email.

**Cross-cutting changes:**
- Confirmation email gains a referral-link CTA block (all Discovery Flight bookings) and an upgrade CTA block (R22 only).
- `AdminMiscItemEdit` gains an "Apparel" section (checkbox + sizes editor) and a "Free referral offer" toggle (single-of enforcement on save).

---

## 4. Data Model

### 4.1 Firestore: `misc_items` (additive)

| Field | Type | Default | Notes |
|---|---|---|---|
| `apparel` | `boolean` | `false` | Enables the size selector on the public product page. |
| `sizes` | `string[]` | `[]` | Order-preserved list, e.g. `["S","M","L","XL"]`. Only meaningful when `apparel=true`. |
| `freeReferralOffer` | `boolean` | `false` | At most one document in the collection may have this set to `true` (server-enforced via transaction). |

### 4.2 Firestore: `bookings` (new — extends current Stripe-metadata-only model)

Doc ID: `paymentIntentId` of the original booking (so upgrade lookups are O(1)).

| Field | Type | Notes |
|---|---|---|
| `paymentIntentId` | `string` | Doc ID. |
| `customerEmail` | `string` | |
| `customerName` | `string` | |
| `aircraft` | `'r22'\|'r44'\|'r66'` | Updated in place after upgrade. |
| `duration` | `30\|60` | Updated in place after upgrade. |
| `flightAmountPence` | `number` | Original flight portion only — used for upgrade diff math. |
| `totalAmountPence` | `number` | Flight + add-ons. |
| `addons` | `array` | |
| `voucher` | `{ active, location, message } \| null` | |
| `referralCode` | `string` | Owner's code, 8 chars, uppercase, no `I/O/0/1`. |
| `referredByCode` | `string \| null` | If this booking arrived via a share link. |
| `referralCompleted` | `boolean` | `true` once the first qualifying redemption fires (one credit per booking). |
| `referralFulfilledAt` | `timestamp \| null` | Set by HQ team admin action when the free item is handed over. |
| `upgrade` | `{ newAircraft, newDuration, upgradePaymentIntentId, upgradedAt } \| null` | |
| `originalAircraft` | `'r22'\|'r44'\|'r66' \| null` | Populated only after upgrade. |
| `originalDuration` | `30\|60 \| null` | Populated only after upgrade. |
| `createdAt` | `timestamp` | |
| `updatedAt` | `timestamp` | |

### 4.3 Firestore: `referral_codes` (new)

Doc ID: the code itself (uppercase). Enables O(1) lookup at friend's checkout.

| Field | Type | Notes |
|---|---|---|
| `code` | `string` | Doc ID. |
| `ownerPaymentIntentId` | `string` | Pointer back to `bookings/<id>`. |
| `ownerEmail` | `string` | Used for self-referral guard. |
| `createdAt` | `timestamp` | |

Written transactionally with the booking record at create-PI time.

### 4.4 Stripe metadata (PaymentIntent)

**Discovery Flight PIs (existing fields plus):**
- `referralCode` — owner's own code.
- `referredByCode` — code captured from URL, if any.

**Upgrade PIs (new `productType` value):**
- `productType: 'discovery-flight-upgrade'`
- `originalPaymentIntentId`
- `newAircraft: 'r44'`
- `newDuration: '30' | '60'`

**Misc PIs (existing fields plus, when applicable):**
- `apparelSize: 'S'|'M'|...` — present when the misc item is apparel.

---

## 5. Frontend

### 5.1 `/booking-confirmed` (`src/pages/BookingConfirmed.jsx`)

- On mount, fetch `bookings/<paymentIntentId>` from Firestore (so the page can render server-truth data: referral code, upgrade state).
- Renders the existing summary card unchanged.
- New `<PostCheckoutOffers booking={…} freeReferralItem={…} />` block between the summary card and the "Return to HQ Aviation" link.
- Below the offers: `These offers are also in your confirmation email — claim later if you'd rather think about it.`
- Offers block hidden when:
  - `type === 'misc'`, or
  - the booking has `voucher.active === true && addons.length === 0 && flightAmountPence === 0` (voucher-only edge case), or
  - the booking has been fully refunded.

### 5.2 `<PostCheckoutOffers>` (new — `src/components/booking/PostCheckoutOffers.jsx`)

- Props: `{ booking, freeReferralItem }` where `freeReferralItem` is the `misc_items` doc with `freeReferralOffer === true` (or `null`).
- Renders `<ReferralOfferCard>` always (or omits gracefully when `freeReferralItem` is null).
- Renders `<UpgradeOfferCard>` only when `booking.aircraft === 'r22'` and `booking.upgrade == null`.
- Two-column grid on viewports ≥768px, stacked on mobile. Order: referral card first, upgrade second.

### 5.3 `<ReferralOfferCard>` (new)

- Free-item presentation: thumb (or thumb placeholder), name, original price struck through, green "FREE" pill.
- Click-through opens `<ProductInfoModal>` with description, image carousel, and a single close button. **No size selector** (free item is collect-at-HQ only).
- Subtitle: `Share with a friend. When they book a Discovery Flight using your link, this is yours — collect at HQ.`
- Single primary action: **"Copy share link"** button. Copies `https://<host>/training/trial-lessons?ref=<code>`. Toast confirmation.
- Optional secondary action: native share sheet ("Share via…") on mobile via `navigator.share` if available.
- The bare referral code is **not** displayed on the customer-facing UI.

### 5.4 `<UpgradeOfferCard>` (new — used inline on `/booking-confirmed` AND on `/upgrade`)

- Title: `Bring 2 extra friends — upgrade to Robinson R44`.
- Two duration pill-buttons: `30 min` / `60 min`. Pre-selected to whatever the booker originally booked.
- Live diff math under the buttons:
  ```
  R44 30 min: £305
    − £180 already paid
    = £125 to upgrade
  ```
- Prominent line: `You've already paid £<X> for your R22 flight. Today you only pay the difference.`
- Inline Stripe Elements card form (`CardNumberElement`, `CardExpiryElement`, `CardCvcElement`).
- Pay button: `Pay £125 to upgrade` (live).
- Above the panel: `This option is also in your confirmation email — no rush deciding now.`
- On success: success toast → re-fetch booking → summary card re-renders with R44 + new duration + new total. Upgrade card replaced by a small "Upgraded — see you at HQ" confirmation row.
- Diff math reads `flightAmountPence` from the booking record, not the URL `price` param (which includes addons/voucher).

### 5.5 `/upgrade` route (new — `src/pages/Upgrade.jsx`)

- Reached via the email's upgrade CTA: `/upgrade?ref=<originalPaymentIntentId>`.
- Server-truth fetch: `GET /api/booking/:paymentIntentId`.
- Validates: PI exists, `aircraft === 'r22'`, `upgrade == null`. Fail states render a friendly message:
  - Already upgraded → `You've already upgraded to an R44 — see you at HQ.`
  - Not R22 → 404-ish.
  - Missing/invalid ref → `Link expired or invalid. Contact HQ.`
- Renders a recap of the original booking + the same `<UpgradeOfferCard>`.
- On success: navigates to `/booking-confirmed?ref=<originalPaymentIntentId>` (which now reflects the upgraded state).

### 5.6 `<ProductInfoModal>` (new — `src/components/booking/ProductInfoModal.jsx`)

- Lightweight modal: image carousel (extract/reuse the carousel logic from `MiscItemDetail`), name, description.
- No size selector. No CTA beyond a close button.
- Reusable in case other parts of the app want to surface a misc item without a full page navigation.

### 5.7 Discovery Flight checkout (`src/pages/Checkout.jsx`)

- On mount, read `?ref=<CODE>` from `useSearchParams`. If present, store in component state and pass to `create-payment-intent` as `referredByCode`.
- **No UI change** — no field, no expander, no hint that referral attribution exists. The friend's checkout looks identical to today's.
- If the code is invalid, expired, or self-referring, the server silently drops it; the booking still succeeds.

### 5.8 Public store (`src/pages/MiscItemDetail.jsx`)

- When `item.apparel === true && item.sizes.length > 0`:
  - Render a "Size" segmented control (one button per size, mobile-friendly) above the qty/buy area.
  - Selection is required before checkout; the buy button is disabled until a size is chosen.
- The chosen size is included in the `create-misc-payment-intent` payload.
- If `item.apparel === true && item.sizes.length === 0`: gracefully degrade to current behavior (no selector, treat as non-apparel) — admin warning at edit time prevents this in practice.

### 5.9 Admin (`src/pages/admin/AdminMiscItemEdit.jsx`)

- New section **"Apparel"**:
  - Checkbox: `Apparel item (size selection on store)`.
  - When ticked, a chip-style sizes editor appears: typed input + Enter to add, X to remove. Reorderable via drag (nice-to-have; can be MVP-skipped).
  - Validation on save: `apparel === true` requires `sizes.length >= 1`. Submit blocked with inline error otherwise.
- New section **"Free referral offer"**:
  - Checkbox: `Show as the free reward for referrals`.
  - On save, server enforces single-of: if another item already has the flag, that one is unset in the same transaction. Toast on success: `Replaced previous referral free-item: <name>` (or `Set as referral free-item.`).

---

## 6. Backend

### 6.1 New endpoint: `GET /api/booking/:paymentIntentId`

Returns the booking record (sans sensitive Stripe internals). Used by `/booking-confirmed` and `/upgrade` to render server-truth state. No auth required (the PI ID itself is the access token; same model as the email link).

### 6.2 `POST /api/create-payment-intent` (existing — extended)

- Accepts new optional `referredByCode` (uppercased server-side).
- Generates a fresh `referralCode` for the new booking (8 uppercase alphanumeric chars excluding `I/O/0/1`, retry-on-collision against `referral_codes` collection up to 5 times).
- Writes `referral_codes/<code>` and `bookings/<paymentIntentId>` in the same transaction as the PI metadata is set.
- Validates `referredByCode` if present:
  - exists in `referral_codes`
  - `ownerEmail !== customerEmail` (self-referral guard)
  - owner's PI is not refunded/cancelled at lookup time
  - if any check fails: silently drop (do not error).

### 6.3 `POST /api/create-misc-payment-intent` (existing — extended)

- Accepts new optional `size`.
- Server-side validation: if the misc item has `apparel === true && sizes.length > 0`, then `size` must be present and must appear in the item's `sizes` array. Reject with 400 otherwise.
- Stores `apparelSize` in PI metadata.

### 6.4 New endpoint: `POST /api/create-upgrade-payment-intent`

Body: `{ originalPaymentIntentId, newDuration }`.

Logic:
1. Fetch `bookings/<originalPaymentIntentId>`. 404 if missing.
2. Validate: `aircraft === 'r22'`, `upgrade == null`. 400 otherwise with explicit reason.
3. Look up R44 price for `newDuration` from Firestore `pricing` collection (existing pattern from `getPrice`).
4. `diffPence = r44Price − booking.flightAmountPence`. Reject if `<= 0` (sanity guard).
5. Create a new Stripe PI for `diffPence` with metadata:
   - `productType: 'discovery-flight-upgrade'`
   - `originalPaymentIntentId`
   - `newAircraft: 'r44'`
   - `newDuration: String(newDuration)`
   - `customerName`, `customerEmail`, `customerPhone` (copied)
6. Return `{ clientSecret }` to the frontend.

### 6.5 Stripe webhook (existing — extended)

Two new metadata branches in `payment_intent.succeeded`:

**(a) `referredByCode` present on a Discovery Flight PI:**
1. Look up `referral_codes/<referredByCode>`.
2. Read `bookings/<ownerPaymentIntentId>`. Skip if owner's PI is refunded or `referralCompleted === true` (idempotent + single-credit).
3. Atomic update: `referralCompleted = true`, `referralCompletedAt = now`, `referralCompletedByPaymentIntentId = <Y's PI>`.
4. Send HQ-team email: `Referral redeemed: ship "<freeItemName>" to <ownerName> (<ownerEmail>) — pickup at HQ. Credit booking: <ownerPaymentIntentId>. Redemption booking: <Y's PI>.`

**(b) `productType === 'discovery-flight-upgrade'`:**
1. Look up `bookings/<originalPaymentIntentId>` from PI metadata.
2. Skip if `upgrade != null` (idempotent guard for webhook retries).
3. Atomic update:
   - `aircraft = 'r44'`, `duration = newDuration`
   - `originalAircraft = <prev aircraft>`, `originalDuration = <prev duration>`
   - `upgrade = { newAircraft, newDuration, upgradePaymentIntentId, upgradedAt }`
   - `flightAmountPence` updated to the new R44 price
   - `totalAmountPence` recomputed
4. Send upgrade-confirmation email to the customer.

### 6.6 Admin save-side enforcement of single-active `freeReferralOffer`

- Admin page calls a server endpoint (or Cloud Function callable) to save the misc item.
- If the incoming payload has `freeReferralOffer === true`, run a Firestore transaction:
  1. Query `misc_items` where `freeReferralOffer == true` and id != incoming.id.
  2. For each match (should be ≤ 1 in steady state), set `freeReferralOffer: false`.
  3. Write the incoming doc.
- Return the displaced item's name (if any) so the client can show a toast.

### 6.7 Confirmation email template (`api/templates/...`)

- All Discovery Flight bookings: a "Refer a friend" block with a primary CTA button (`Share with a friend`) linking to `/training/trial-lessons?ref=<code>` and a copy-friendly URL underneath. Brief explainer: free HQ item on referral, collect at HQ.
- R22 bookings only: an additional "Upgrade to R44" block with a CTA button → `/upgrade?ref=<paymentIntentId>`. Includes the diff for both 30 and 60 min.

---

## 7. Edge Cases & Error Handling

- **Friend's URL has invalid/unknown code** → silently dropped server-side; booking proceeds without referral credit.
- **Friend's URL has the booker's own code (self-referral)** → server detects via `ownerEmail === customerEmail`; silently dropped.
- **Friend's URL → checkout, but the original booker's PI was refunded between linking and friend's checkout** → server detects via Stripe API call at validation time; silently dropped.
- **Multiple friends use the same code** → first redemption flips `referralCompleted=true` + sends HQ email. Subsequent redemptions are still recorded on Y's PI metadata for analytics, but produce no additional credit/email.
- **Booker tries to upgrade twice (page + email)** → second attempt fails the "already upgraded" check; UI shows "You've already upgraded to R44 — see you at HQ."
- **Booker booked R22 30min, upgrades to R44 30min, later wants R44 60min** → second upgrade is blocked. Manual support flow only. (Future enhancement: separate "extend duration" upgrade.)
- **Apparel item with `sizes: []`** → admin save is blocked with `Add at least one size to enable apparel mode.` Public store falls back to non-apparel rendering if a doc somehow slips through.
- **Two admin tabs simultaneously toggling `freeReferralOffer`** → Firestore transaction enforces last-write-wins. The losing tab will show stale state on next refresh; the toast on the winning tab confirms the swap.
- **Free-item misc doc is deleted between offer-display and friend's redemption** → the referral webhook still fires, but the HQ-team email contains the snapshot of the item name/ID at code-generation time (we store it on `bookings/<id>` as `referralFreeItemSnapshot` at create-PI time so the email is still actionable). The `<ProductInfoModal>` on the booker's page handles a missing item by hiding the click-to-open behavior.
- **Pre-existing R22 bookings made before this feature ships** → no `referralCode` field. `/booking-confirmed` hides the offers section if `referralCode` is missing on the doc. The original confirmation email's old CTA is unchanged.
- **Webhook missed/delayed** → existing client-side `record-booking` ping handles flight-side state; referral redemption is webhook-only and re-processable via `stripe trigger payment_intent.succeeded` if needed.
- **R22 booker upgrades when add-ons or voucher were on the original** → upgrade diff is `R44_<dur>_price − flightAmountPence` only. Add-ons and voucher are NOT recharged or invalidated.
- **Page refresh during upgrade Stripe confirmation** → standard Stripe SDK uses the PI client_secret; no special handling needed.

User-visible errors:
- `/upgrade?ref=…` with bad/missing PI: full-page friendly message + Contact HQ link.
- Upgrade payment fails: error inside the panel, original booking unchanged, retry button.

---

## 8. Testing

Vitest (component + unit) following existing patterns in the repo.

| File | Coverage |
|---|---|
| `src/lib/referralCodes.test.js` | Generator: alphabet correctness, length, no I/O/0/1, collision retry. |
| `api/stripe.test.js` (extend) | `referredByCode` validation paths (valid, invalid, self-ref, refunded owner). Webhook handler flips `referralCompleted` exactly once; idempotent on retry. |
| `api/upgrade.test.js` (new) | Upgrade diff math: R22 30→R44 30, R22 30→R44 60, R22 60→R44 60. With/without addons/voucher present. Already-upgraded blocks a second attempt. |
| `src/pages/admin/AdminMiscItemEdit.test.jsx` (new) | Single-of enforcement on `freeReferralOffer` (toast shown). Apparel + sizes UI roundtrip. Validation: apparel without sizes blocks save. |
| `src/pages/MiscItemDetail.test.jsx` (new) | Size selector required for apparel; payload includes size; non-apparel unchanged. |
| `src/pages/BookingConfirmed.test.jsx` (new) | Offers shown only for Discovery Flight (not misc, not voucher-only). Upgrade card hidden for non-R22. Hidden after upgrade. |
| `src/pages/Upgrade.test.jsx` (new) | Renders for valid R22 booking. Blocks already-upgraded. Blocks bad ref. |
| `src/pages/Checkout.test.jsx` (extend) | `?ref=…` is captured from URL silently and sent in PI creation payload. No referral UI rendered. |
| `src/components/booking/PostCheckoutOffers.test.jsx` (new) | Both cards shown for R22, only referral for R44, neither for misc. |

---

## 9. Migration / Rollout

- Backwards-compatible writes: new fields default sensibly; existing `misc_items` and `bookings` (if any pre-existed) work without rewrite.
- Existing bookings before deploy don't get retroactive referral codes — acceptable per non-goals.
- Admin UI: a one-time admin task to flag the chosen HQ item as `freeReferralOffer = true` after deploy. Until that's done, the referral card on `/booking-confirmed` is hidden gracefully.
- Email template: deploy alongside the code; the new blocks render only when the relevant data is present (referral code; R22 booking).

---

## 10. Open Questions / Future Enhancements

- Tiered upgrade (R44 → R66) — explicitly out of scope; revisit if data shows demand.
- Booker dashboard: "How many friends have used your code?" — out of scope, but the `bookings` and `referral_codes` schema supports it.
- Email-link upgrade after first claim — could allow an "extend duration" variant later.
- Stock tracking per apparel size — out of scope; deferred until the store volume justifies it.
- Referral abuse rate-limiting (e.g., one IP making many free-link bookings) — monitor in analytics; tackle if it materializes.

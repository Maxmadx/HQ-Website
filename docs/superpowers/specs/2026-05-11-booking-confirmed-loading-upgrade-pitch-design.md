# Booking-Confirmed Loading Window + Prominent R44 Upgrade Pitch

**Date:** 2026-05-11
**Status:** Design — pending implementation plan
**Scope:** Single shippable unit. Replaces the awkward "Processing…" stall on the checkout page with a 4-second pitch window on `/booking-confirmed` that displays a hero R44 upgrade card.

---

## 1. Goals

1. Remove the "Processing…" button stall on `/checkout` after Stripe success — navigate immediately to `/booking-confirmed`.
2. On `/booking-confirmed`, run a deliberate ~4-second loading window during which a hero R44 upgrade card is shown to R22 bookers (maximising upgrade conversion).
3. After the loading window completes (and `record-booking` has succeeded server-side), reveal the standard confirmed-booking layout (✓ checkmark, thank-you copy, Booking Summary card with the existing compact upgrade row).
4. Fail gracefully — if `record-booking` errors, navigate back to `/checkout` with the error surfaced.

The 4-second floor is a deliberate UX choice: it gives the upgrade pitch real airtime instead of flashing past.

---

## 2. Non-goals

- Skipping the wait via a "No thanks" button. The R22 booker sees the pitch for the full window.
- Adding new payment paths or pricing models. This is purely about WHEN the existing confirmation UI renders and what's shown during the gap.
- Changing the modal-based upgrade flow itself (`UpgradeOfferCard` modal is unchanged).
- Changing the apparel, misc, or london-tour confirmation behaviour. This spec only affects Discovery Flight bookings.
- New tests beyond what's required to keep existing tests green and add coverage for the new state machine.

---

## 3. Architecture overview

Single page with two visual phases.

```
Stripe success in CheckoutForm
        │
        ▼  (navigate immediately — no Processing… stall)
/booking-confirmed?ref=…&aircraft=r22&duration=30&…
        │
        ├─ Mount: fire POST /api/record-booking
        ├─ Mount: start 4-second timer
        │
        ▼
   PHASE 1: Confirming
   - spinner (animated)
   - "Confirming Booking"
   - <BigUpgradeCard> if eligible (R22 + no upgrade yet)
        │
        ▼  (both: timer ≥ 4s AND record-booking 200)
   PHASE 2: Confirmed
   - ✓ checkmark
   - "Booking Confirmed"
   - thank-you subtitle
   - Booking Summary card (with compact green upgrade row inside)
   - PostCheckoutOffers (referral card)
   - Return to HQ Aviation
```

**Eligibility for `<BigUpgradeCard>`**: same as the compact row — `booking.aircraft === 'r22' && !booking.upgrade && upgradeDiffPence > 0`. Computed server-side and returned via `/api/booking/:pid` (already exists from prior work).

For non-R22 bookers, the loading window still runs (consistent UX), just without the upgrade card — just spinner + "Confirming Booking" for 4 seconds.

For misc bookings: this spec does not apply — `/booking-confirmed?type=misc` keeps its current immediate-render behaviour.

---

## 4. Components

### 4.1 `src/components/booking/BigUpgradeCard.jsx` — new

A hero-style card optimised for the 4-second pitch window. Shown only during Phase 1 and only when the booker is R22 + not yet upgraded.

**Layout (Option A from brainstorming):**

```
┌─────────────────────────────────────────┐
│                                         │
│   [R44 photo — edge to edge, ~240px]    │
│                                         │
├─────────────────────────────────────────┤
│  UPGRADE TO THE R44                     │
│                                         │
│  You at the controls.                   │
│  Two mates in the back.                 │
│                                         │
│  £116 to upgrade                        │
│                                         │
│  [   Upgrade now →   ]                  │
└─────────────────────────────────────────┘
```

**Behaviour:**
- Photo: R44 marketing image. Source: the existing R44 hero used on `/aircraft-sales` and `/training/trial-lessons`. Exact asset path resolved during implementation via grep.
- "Upgrade now →" CTA opens the existing `<UpgradeOfferCard>` modal (the cream/green compact row's modal is the same one — reuse it).
- No "No thanks" / dismiss button. Card disappears on its own when Phase 2 fires.
- £116 is dynamic — derived from `booking.upgradeDiffPence` (server-computed, honours admin override). Falls back to local computation if missing.
- Same `if (!booking || booking.aircraft !== 'r22' || booking.upgrade) return null` guards as the compact row.

**Props:** `{ booking, onUpgraded }`

**Internal state:** `{ modalOpen: boolean }`

### 4.2 `src/pages/BookingConfirmed.jsx` — modified

Add a `phase` state with values `'confirming' | 'confirmed'`. Failure paths navigate away rather than entering an error phase.

**On mount:**
- If `isMisc`: skip the new flow entirely (render immediately as today).
- Else:
  - Set `phase = 'confirming'`.
  - Fire `POST /api/record-booking` in parallel.
  - Start a 4-second timer.
  - When `Promise.all([recordBookingPromise, timerPromise])` resolves AND `record-booking` returned 2xx (or no-op success — see § 6): set `phase = 'confirmed'`.
  - If `record-booking` rejects with 4xx/5xx: `navigate('/checkout?ref=…&error=…')` carrying the original URL params + the error message.

**Render:**

- Header symbol slot: spinner during `confirming`, checkmark during `confirmed`.
- Title: "Confirming Booking" → "Booking Confirmed".
- Subtitle: rendered only when `confirmed`.
- Booking Summary card: rendered only when `confirmed` AND `booking` (state) is loaded.
- `<BigUpgradeCard>`: rendered only when `confirming` AND `booking` is loaded AND eligibility passes.
- `<PostCheckoutOffers>`: rendered only when `confirmed`.
- Return link: rendered only when `confirmed`.

The existing `booking` fetch (which retries up to 12 × 700ms = ~8.4s) continues to drive the Summary card data. The phase state machine is independent of `booking` — both must be satisfied before Phase 2 renders the Summary.

### 4.3 `src/pages/Checkout.jsx` — modified

**Remove `record-booking` call from `CheckoutForm.handleSubmit`** (the Discovery Flight one). Replace with: immediate `navigate(…)` — `record-booking` is now fired from `BookingConfirmed.jsx`'s mount effect.

**`MiscCheckoutForm` keeps its current fire-and-forget `record-booking` call.** Misc bookings don't enter the Phase 1/2 state machine on `/booking-confirmed` (they short-circuit to the existing immediate-render path), so they still need the checkout-side call to ensure the doc gets written in dev.

**Add error-banner support on mount:**
- If `?error=<msg>` is present in the URL, show a banner at the top of the checkout: "We couldn't confirm your booking: {msg}. Please try again or contact HQ."
- The error param is stripped from the URL after first render (via `setSearchParams`) so refreshing doesn't re-show the banner.

### 4.4 No changes to:
- `UpgradeOfferCard.jsx` (the compact row + modal stay as they are; reused by both Summary card and BigUpgradeCard).
- `PostCheckoutOffers.jsx` (referral card stays).
- API endpoints (`/api/record-booking`, `/api/booking/:pid`, `/api/create-upgrade-payment-intent`).
- Webhook handler (`handleWebhook`).
- Pricing logic / `getUpgradeDiffPence` helper.

---

## 5. State machine details

```
[mount]
    ├──► (isMisc) ──► render immediately, skip phases
    │
    └──► phase='confirming'
           │
           ├──► fetch /api/booking/:pid (with retry, existing logic)  ── sets `booking`
           │
           ├──► POST /api/record-booking
           │    ├─ 2xx ──► recordBookingDone = true
           │    └─ 4xx/5xx ──► navigate('/checkout?error=…')
           │
           ├──► setTimeout(4000) ──► timerDone = true
           │
           └──► when recordBookingDone && timerDone:
                phase='confirmed'
```

The booking fetch (which can take longer than 4s in rare cases) does NOT gate Phase 2 — but the Summary card content depends on it. So in the edge case where Phase 2 fires before `booking` is loaded, the page shows the checkmark + "Booking Confirmed" + subtitle, with a placeholder/loading state for the Summary card (or it simply doesn't render until `booking` arrives). Acceptable degradation.

---

## 6. Idempotency / `record-booking` semantics

`record-booking` is already idempotent:
- It writes `bookings/<pi.id>` with `{ merge: true }` semantics (existing-doc check preserves status).
- It writes `misc_marketplace/<pi.id>` only if it doesn't already exist (the new fix from earlier).

A second call from `BookingConfirmed.jsx` (after the user already called it from `CheckoutForm.handleSubmit` in a past version) is harmless. But moving the call to the success page removes the duplicate entirely — there's only one call per booking now.

If the **webhook beats the client to it** (rare in dev, possible in prod), the same idempotency applies — the doc just gets updated/merged once and `record-booking` returns the same shape.

---

## 7. Error handling

| Scenario | Behaviour |
|---|---|
| Stripe `confirmCardPayment` fails on checkout | Stays on checkout (existing — no change). |
| `record-booking` returns 4xx (PI status still not `succeeded` after the 1.6s retry built into recordBooking) | Navigate back to `/checkout?error={msg}&ref=…&aircraft=…&duration=…&price=…` — checkout shows an error banner. |
| `record-booking` returns 5xx (server/Firestore error) | Same — back to checkout with the error. |
| `record-booking` request never returns (network hang) | Client-side 15-second `Promise.race` timeout. On timeout: navigate back to checkout with `error=Network error — please try again`. |
| `record-booking` succeeds but `/api/booking/:pid` 404s permanently | Phase 2 fires (since `record-booking` was OK), checkmark shows, but Summary card stays blank until booking loads. Compact upgrade row + offers don't render. Acceptable degradation; user has the checkmark + ref number + can refresh. |
| 4-second timer fires before `record-booking` returns | Phase stays `confirming` — both must be ready. |
| `record-booking` returns before 4 seconds | Wait the remaining time, then flip. |

---

## 8. Visual / animation details

- **Spinner**: 64px circle, same position as the current ✓. Border-only circle (~3px stroke) with a gradient or fixed segment rotating. Plain CSS keyframes — no library needed.
- **Title swap**: instant text change. No fade.
- **Subtitle + Summary card + offers**: fade-in on Phase 2. ~250ms `opacity` transition.
- **BigUpgradeCard appear**: no animation on initial show (it's there from mount). On Phase 2 transition it should fade out OR snap removed — cleaner just to unmount it.
- **Layout shift**: the BigUpgradeCard takes roughly the same vertical space as the Summary card. To avoid a jarring shift, both occupy a fixed-min-height container that holds whichever is rendered.

---

## 9. Testing

New tests:

- `src/pages/BookingConfirmed.test.jsx` (extend):
  - Phase 1: renders spinner + "Confirming Booking" + BigUpgradeCard for R22 booking.
  - Phase 2 fires after 4s timer + record-booking success: renders ✓ + "Booking Confirmed" + Summary card.
  - Failure path: record-booking 400 → navigates back to checkout with `?error=…`.
  - Misc bookings skip the phases entirely.
  - Non-R22 bookings show spinner + title only (no BigUpgradeCard) during Phase 1.

- `src/components/booking/BigUpgradeCard.test.jsx` (new):
  - Renders for R22 + no upgrade + positive diff.
  - Returns null for non-R22 / already-upgraded.
  - Click "Upgrade now" opens the existing UpgradeOfferCard modal.

- `src/pages/Checkout.test.jsx` (extend):
  - On mount with `?error=…`, shows the error banner.
  - Error param is stripped from URL after first render.

Use `vi.useFakeTimers()` + `vi.advanceTimersByTime(4000)` to test the 4s floor.

---

## 10. Migration / rollout

No schema changes. No env changes. No new env vars. Backwards-compatible:
- Old bookings still work — they hit the existing `/api/booking/:pid` endpoint.
- The `record-booking` call site moved from checkout to booking-confirmed — no API contract change.
- Stale URL params from old checkout flows still work.

Existing tests that rely on the immediate render of `/booking-confirmed` may need adjustment — see § 9.

---

## 11. Out of scope / future enhancements

- Tracking how many R22 bookers actually convert via the BigUpgradeCard vs. the compact row — would need an analytics event. Not in this spec.
- A/B testing different upgrade card copy / images. Possible later but adds complexity (variant assignment, persistence).
- Showing the BigUpgradeCard to existing bookers who revisit `/booking-confirmed` later (currently they'd just see the compact row). Out of scope.
- Animating the price (e.g., counting up). Out of scope.
- Touch / mobile-specific gestures on the BigUpgradeCard. Standard tap-to-modal is sufficient.

# Squarespace Analytics Parity — Purchase Funnel, Abandoned Cart, Search Keywords, Geography

**Date:** 2026-04-29
**Status:** Design

## Goal

Bring `/admin/analytics` to feature parity with Squarespace's most useful analytics tiles. Specifically: a purchase funnel for the Discovery Flight booking flow, an abandoned-cart system with email recovery, a Google Search Console keyword view, and a geography map. The Discovery Flight funnel is the priority because that page (`/training/trial-lessons` and `/training/discovery-flights`) is the primary revenue path.

## Non-goals

- Replacing GA4 or any third-party analytics tool — this is a self-hosted dashboard for the owner, not a public product.
- Marketing-grade email automation (drip sequences, segmentation, A/B subject lines). Recovery emails are transactional only.
- Funnel analysis for non-purchase flows (lead-form drop-off, etc.) — those can come later.

## Subsystems (single spec, phased implementation)

A. Purchase Funnel — events + dashboard tile
B. Abandoned Cart — `carts` collection + recovery emails + dashboard tile
C. Email-first checkout step — captures email before card details
D. Google Search Console — nightly sync + dashboard tile
E. Geography map + Top Pageviews tile — repackages existing data

## End-to-end flow (visitor's perspective)

1. Visitor lands on `/training/trial-lessons`. We fire `viewed_product` (in addition to the existing `pageview`).
2. They pick a card + duration and click Book Now. We fire `started_checkout` and navigate to `/checkout` (existing route).
3. On `/checkout`, the first thing we ask is **"Where shall we send your booking confirmation?"** — single email field, framed as confirmation delivery, not gating. The moment a valid email is entered and the field blurs, we POST to `/api/carts` and create a Firestore `carts` doc.
4. They fill card details and pay. The existing Stripe webhook (`payment_intent.succeeded`) fires `purchased`, marks the cart `completed`, and writes the existing `bookings` doc.
5. If they walk away, the cart sits as `active` or `checkout_initiated`. A scheduled job runs every 15 minutes and:
   - After 1h idle → mark `abandoned`, send recovery email #1 ("your booking is saved, come back" + resume link)
   - After 24h idle → send recovery email #2 (final reminder)
   - After 7 days → mark `expired`, no further emails
6. The recovery link `/checkout?cart={cartId}` rehydrates the basket so they land back at the same step.
7. **Backfill:** if the same `sessionId` previously submitted any contact/lead form, we look up the email from the `leads` collection and pre-fill the email step (or skip it entirely).
8. **Exit-intent (desktop only):** if the cursor leaves `/checkout` toward the top edge before payment AND we don't have an email yet, show a modal: "Save your booking — we'll email it to you so you can come back later."

## Data model

### New event types in `page_events`

Extend the `ALLOWED_TYPES` allowlist in `api/analytics-api.js`:

- `viewed_product` — `elementId` = product category (e.g. `'discovery-flight'`)
- `started_checkout` — `elementId` = product/aircraft id (e.g. `'r44-60'`)
- `payment_started` — fired when card form is submitted
- `purchased` — fired from the Stripe webhook AND from the `BookingConfirmed` page (idempotent via `sessionId` + `stripeSessionId`)

### New `carts` collection

```
carts/{cartId}: {
  sessionId: string,            // links to page_events.sessionId
  email: string,                // captured at email-first step
  items: [
    { type: 'discovery-flight', aircraftId: 'r44', duration: 60, priceP: 35000 }
  ],
  totalP: number,               // pence
  status: 'active' | 'checkout_initiated' | 'abandoned' | 'completed' | 'expired',
  stripeSessionId: string|null,
  recoveryEmailsSent: [{ at: timestamp, type: '1h' | '24h' }],
  createdAt: timestamp,
  updatedAt: timestamp
}
```

### New `gsc_daily` collection (Search Console sync)

```
gsc_daily/{YYYY-MM-DD_query_page}: {
  date: 'YYYY-MM-DD',
  query: string,                // search keyword
  page: string,                 // landing page path
  clicks: number,
  impressions: number,
  ctr: number,                  // 0.0234 = 2.34%
  position: number,
  syncedAt: timestamp
}
```

## Components / files

### New files

- `api/carts.js` — Express router. Endpoints:
  - `POST /api/carts` — create or update cart by sessionId. Public (rate-limited like analytics).
  - `PATCH /api/carts/:id` — update status, items, stripeSessionId.
  - `GET /api/carts/:id` — used by the resume link to rehydrate the basket. No auth, but returns 404 if status === completed.
  - `GET /api/carts` (admin only) — list recoverable carts for the dashboard.
  - `POST /api/carts/:id/send-recovery` (admin only) — manually trigger a recovery email from the dashboard.
- `api/cart-recovery-job.js` — exported function; the abandonment scanner. Runs from a scheduler (see below).
- `api/gsc-sync.js` — nightly sync from Google Search Console API into `gsc_daily`. Uses a service-account JSON in env.
- `src/pages/Checkout/EmailFirstStep.jsx` — the single-field email capture step.
- `src/pages/Checkout/ExitIntentModal.jsx` — desktop-only exit-intent prompt.
- `src/lib/cart.js` — client-side cart helper: create/update/rehydrate cart, debounced writes.
- `src/components/admin/PurchaseFunnel.jsx` — the funnel tile.
- `src/components/admin/AbandonedCartTile.jsx` — the abandoned-cart funnel + recoverable-carts table.
- `src/components/admin/SearchKeywords.jsx` — GSC tile with the chart + by-keyword/by-page tabs.
- `src/components/admin/GeographyMap.jsx` — SVG world map tile.
- `src/lib/funnelAggregations.js` — pure functions to compute funnel counts from page_events + carts.
- Email templates: `api/templates/cart-recovery-1h.html`, `cart-recovery-24h.html`.

### Modified files

- `api/analytics-api.js` — extend `ALLOWED_TYPES` with the four new event types.
- `src/lib/analytics.js` — no change needed (`trackEvent` is generic).
- `src/pages/DiscoveryFlight.jsx` — fire `viewed_product` on mount, `started_checkout` on Book Now click.
- `src/pages/Checkout.jsx` — insert `EmailFirstStep` as step 1, mount `ExitIntentModal`, integrate `cart.js` writes.
- `api/stripe.js` — in the webhook, after writing the `bookings` doc, mark the matching `carts` doc as `completed` and fire `purchased` event.
- `src/pages/admin/AdminAnalytics.jsx` — register four new tiles (Purchase Funnel, Abandoned Cart, Search Keywords, Geography).
- `server.js` — mount `/api/carts` router; register the cart-recovery scheduler.

### Scheduler

Two options, decide at implementation time based on the deploy target:

- **If on Cloud Functions / Firebase**: use `onSchedule('every 15 minutes')` for `cart-recovery-job` and `onSchedule('every day 03:00')` for `gsc-sync`.
- **If on a long-running Node server**: use `node-cron` inside `server.js`, same cadences.

The job logic itself is identical either way and lives in `api/cart-recovery-job.js` / `api/gsc-sync.js`.

## Funnel computation

Aggregations are computed at read time on the dashboard from `page_events` (and `carts` for purchased counts), filterable by date range and product. No precomputed materialised counters in v1 — at current volume it's fine to query Firestore directly with a date-range filter. If volume grows, we move to a daily rollup collection later.

Funnel logic (per product, per day range):

- **Visits** = unique `sessionId`s that fired any event in range.
- **Viewed Product** = unique `sessionId`s that fired `viewed_product` with the product's category.
- **Started Checkout** = unique `sessionId`s that fired `started_checkout` for the product.
- **Purchased** = unique `sessionId`s that fired `purchased` for the product. (After Phase 2, this can also be cross-checked against `carts` with `status === 'completed'`.)

Squarespace shows percentages between adjacent stages (Visits→Viewed = 25%, Viewed→Checkout = 19%, etc.). Mirror that.

## Abandoned-cart computation

- **Carts** = total carts created in range
- **Abandoned** = `status` in `['abandoned', 'expired']`
- **Recoverable** = abandoned AND `email` is non-empty
- **Emailed** = recoverable AND `recoveryEmailsSent.length > 0`
- **Recovered** = was abandoned, then transitioned to `completed`, AND a recovery email was sent before completion

The dashboard also lists individual recoverable carts in a table with a "Send recovery email" button for manual sends.

## Email-first UX detail

```
┌─────────────────────────────────────────┐
│  Almost there — your trial lesson        │
│                                          │
│  Where shall we send your booking?      │
│  ┌──────────────────────────────────┐   │
│  │ you@email.com                    │   │
│  └──────────────────────────────────┘   │
│  We'll only use this to send your booking│
│                                          │
│  [    Continue    ]                      │
└─────────────────────────────────────────┘
```

- Field validates on blur; persists to `carts` on first valid blur.
- If `sessionId` matches a prior `leads` doc, we pre-fill the email and auto-advance — they don't see this step at all.
- The same write path is used by the exit-intent modal.
- One-line privacy note prevents the form from feeling like a marketing capture.

## Search Keywords tile

- Auth: Google Search Console API via service account. Credentials in env (`GSC_SERVICE_ACCOUNT_JSON` base64-encoded).
- Sync: nightly job pulls last 16 months of data on first run, then last 7 days each subsequent night.
- Display matches Squarespace's screenshot:
  - Top row: Clicks / Impressions / CTR / Avg. Position
  - Line chart: monthly trend, top 4 keywords overlaid
  - Tabs: By Page (default) and By Keyword — sortable table
- Filters: Last 7 days / 30 days / 90 days / 12 months.

## Geography tile

- Reads `country` and `countryCode` from `page_events` (already populated).
- SVG world map (use `react-simple-maps` or hand-rolled). Country shading by visit count.
- Below the map: list of countries with visit counts, sorted descending.

## Privacy / GDPR

- Email captured at email-first step is treated as transactional consent. The on-screen helper text ("We'll only use this to send your booking") establishes scope.
- Recovery emails include a one-click unsubscribe link (`/api/carts/:id/unsubscribe`) that sets a `noEmail: true` flag on the cart.
- IP truncation decision noted in the existing analytics-upgrade spec is unchanged here — that's a separate pre-prod task.
- Carts older than 90 days are pruned by a separate housekeeping job that runs daily and deletes `carts` docs where `status` is `'expired'` or `'completed'` and `updatedAt` is more than 90 days old. Lives alongside the recovery scheduler.

## Error handling

- Cart write failures are silent on the client (don't block checkout). The Stripe flow is the source of truth for the actual purchase.
- Recovery email failures are retried up to 3 times by the scheduler before being marked `email_failed` on the cart record.
- GSC sync failures log to `gsc_sync_errors` collection and surface a banner on the dashboard if the latest sync is >48h old.

## Testing

- Unit tests for `funnelAggregations.js` — pure functions with fixture data.
- Unit tests for the recovery-job state transitions (1h, 24h, 7d boundaries).
- Integration test for `POST /api/carts` (rate limit, validation, sessionId backfill).
- E2E happy path: visit → book → email step → pay → cart marked completed → no recovery email sent.
- E2E abandoned path: visit → book → email step → close → wait (mocked clock) → recovery email queued.

## Implementation phasing

Recommended order (each phase ships independently):

1. **Phase 1 — Funnel events + dashboard tile (subsystem A).** Add the four new event types, fire them from DiscoveryFlight + Checkout + webhook, build PurchaseFunnel tile. No new collection yet. Ships value immediately.
2. **Phase 2 — Carts collection + email-first step (subsystems B + C, no automated emails).** Adds the email-first UX, persists carts, builds the AbandonedCartTile so the owner can see and manually email recoverable carts.
3. **Phase 3 — Automated recovery emails.** Wire the scheduler, write templates.
4. **Phase 4 — Search Keywords (subsystem D).** GSC integration + tile.
5. **Phase 5 — Geography map + Top Pageviews tile (subsystem E).** Pure UI work over existing data.

## Success criteria

- Owner can open `/admin/analytics` and see, for any chosen date range, the Discovery Flight funnel and abandoned-cart counts that match Squarespace's tile structure exactly.
- An abandoned cart with an email is reachable via "Send recovery email" from the dashboard within one click.
- Automated recovery emails fire at 1h and 24h boundaries with ±5 min accuracy.
- Search Keywords tile shows the same metrics Squarespace shows, refreshed within 24h.
- No regression in existing checkout conversion (measured by comparing 14-day pre/post `purchased` counts).

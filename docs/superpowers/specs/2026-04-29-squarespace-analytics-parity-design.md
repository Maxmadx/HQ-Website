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

1. Visitor lands on `/training/trial-lessons`. We fire `view_item` (GA4-canonical; in addition to the existing `pageview`).
2. They pick a card + duration and click Book Now. We fire `begin_checkout` and navigate to `/checkout` (existing route).
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

**Use the GA4 canonical event names**, not custom ones. Even though we're not (yet) sending to GA4, the names are an industry standard recognised by every analyst, every tool, and every future integration. Required params per GA4: `transaction_id`, `value`, `currency` (on `purchase`); `items[]` array on each ecommerce event.

Extend the `ALLOWED_TYPES` allowlist in `api/analytics-api.js`:

- `view_item` — fired on Discovery Flight page mount. Params: `items: [{item_id, item_name, item_category, price, currency}]`
- `begin_checkout` — fired on Book Now click before navigate. Params: `items[]`, `value`, `currency`, `coupon` (null for now)
- `add_payment_info` — fired when card form is submitted. Same params as `begin_checkout`
- `purchase` — fired ONLY from the Stripe webhook (server-side, single source of truth). Params: `transaction_id` (= Stripe `payment_intent.id`), `value`, `currency`, `items[]`. **Dedup is automatic** because the `transaction_id` is unique per payment intent and writes are guarded by `status !== 'completed'`.

This naming choice is the unlock that makes the data portable: if the owner ever wants to wire up GA4 or GTM later, the events already map 1:1.

### New `carts` collection

Mirrors the existing `bookings` doc shape so the cart can be promoted in place when payment succeeds. Cart is **upserted by `sessionId`** — there is at most one active cart per session, so repeated Book Now clicks update rather than duplicate.

```
carts/{cartId}: {
  sessionId: string,                // links to page_events.sessionId; unique among non-completed carts
  email: string|null,               // captured at email-first step; null until then
  emailSource: 'typed'|'lead-match'|'exit-intent'|null,

  // booking shape — matches existing recordBooking() in api/stripe.js
  flight: { aircraftId, duration, priceP },
  addons: [{ id, qty, priceP }],    // existing add-on schema
  fulfilment: 'collect'|'delivery',
  shippingAddress: { line1, line2, city, postcode } | null,

  totalP: number,                   // sum of flight.priceP + addons; pence
  currency: 'gbp',

  status: 'active' | 'checkout_initiated' | 'abandoned' | 'completed' | 'expired',
  stripeSessionId: string|null,
  stripePaymentIntentId: string|null,

  recoveryToken: string,            // random 32-char URL-safe token; resume link = /checkout?t={token}
  recoveryEmailsSent: [{ at: timestamp, type: '1h'|'24h', messageId, opened: bool, clicked: bool }],
  noEmail: bool,                    // unsubscribed from recovery emails
  excludedFromAnalytics: bool,      // admin self-exclusion (matched email or IP)

  utm: { source, medium, campaign, term, content },  // captured from session at cart creation
  referrer: string,
  countryCode: string|null,

  createdAt: timestamp,
  updatedAt: timestamp,
  completedAt: timestamp|null,
  abandonedAt: timestamp|null
}
```

**Why a recovery token, not the doc id:** doc ids appear in URLs and server logs; a separate random token in the resume link prevents enumeration and lets us rotate or revoke without touching the cart.

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
- `api/templates/cart-recovery.js` — exports `cartRecoveryEmail(cart, type)` returning `{ subject, html, text }`. Reuses the nodemailer transporter already initialised in `api/stripe.js` (existing booking-confirmation infra; no new ESP needed).
- `api/lib/cartValidation.js` — zod schema for `POST /api/carts` body (rejects malformed payloads at the boundary).

### Modified files

- `api/analytics-api.js` — extend `ALLOWED_TYPES` with the four new event types.
- `src/lib/analytics.js` — no change needed (`trackEvent` is generic).
- `src/pages/DiscoveryFlight.jsx` — fire `view_item` on mount, `begin_checkout` on Book Now click.
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

Funnel logic (per product, per day range, mirroring GA4 funnel exploration semantics — sessions → product views → begin checkout → purchase):

- **Visits** = unique `sessionId`s that fired any event in range.
- **Viewed Product** = unique `sessionId`s that fired `view_item` with matching `item_category`.
- **Started Checkout** = unique `sessionId`s that fired `begin_checkout` matching the product.
- **Purchased** = unique `transaction_id`s on `purchase` events for the product. Using `transaction_id` (not `sessionId`) here is the canonical GA4 dedup pattern and survives webhook double-fires automatically.

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

## Recovery email content & deliverability (researched best-practice)

Drawing on 2026 Shopify/Omnisend/Baymard guidance and Gmail/Yahoo bulk-sender requirements.

### Cadence

Two emails by default — Email 1 at 1h, Email 2 at 24h. The third 72h-discount email common in mass ecommerce is intentionally omitted: HQ Aviation is a high-AOV considered purchase ([luxury and high-ticket cart-abandonment is 82.84%](https://mailmend.io/blogs/cart-abandonment-recovery-statistics) and luxury-brand best-practice is no discounts in recovery). A `CART_RECOVERY_THIRD_EMAIL` flag exists if we ever want to A/B-test a 72h follow-up.

### No-discount stance

Recovery emails do **not** offer a discount. Rationale, per researched best practice:
- Discounting a £350 first flight teaches buyers to abandon and wait.
- For luxury/high-AOV, [brand storytelling and assurance outperform discounts](https://www.shopify.com/blog/abandoned-cart-emails) (Shopify, To'ak Chocolate cited as the canonical example).
- The right levers for HQ are: photography, social proof (real customer testimonials, expert endorsements, awards), reassurance (safety record, instructor pedigree), and frictionless return-to-checkout via the resume link.

If at some point the owner wants to test an incentive, the right one is **not** £-off: it's a value-add — e.g. "complimentary in-flight photos" or "logbook entry signed by your instructor." Built behind a flag for later.

### Subject lines

Research consensus ([Popupsmart 2026](https://popupsmart.com/blog/abandoned-cart-subject-lines), [Funnelkit](https://funnelkit.com/abandoned-cart-subject-lines/)):
- Straightforward subjects with the word "cart" / "booking" + brand name convert highest (~33% click-to-open).
- Curiosity-driven subjects open highest (~66%) but convert worse.
- Personalised subjects (with first name if known) open ~22% better than generic.
- Mentioning "cart" specifically is +10% opens vs. not mentioning it.

V1 subject lines (configurable via Firestore so owner can edit without redeploy):

- Email 1 (1h): `"{firstName}, your HQ Aviation booking is saved"` — straightforward, personalised, mentions booking.
- Email 2 (24h): `"Still thinking it over, {firstName}?"` — curiosity-tilted, brand-aligned ("we know it's a big day").

### Email body — Email 1 (1h)

Single-purpose: remind, reassure, link back. No urgency, no discount, no upsell.

Structure:
1. Hero photo of the chosen aircraft (R22 / R44 / R66) — photography is the brand.
2. "Your booking is held: R44 60-minute Trial Lesson — £350"
3. Itemised summary (flight + add-ons + fulfilment) with prices.
4. **Resume button**: "Complete your booking" → resume link (UTM-tagged).
5. One-line reassurance: "First-flight nerves are normal. Your instructor will walk you through every minute."
6. Footer with phone number (manned by office) — for the buyer who'd rather speak to a human.
7. Plain-text alternative populated by template.

### Email body — Email 2 (24h)

Different angle: social proof + assurance, not repetition.

Structure:
1. Customer testimonial (rotate from Wall of Cool / Reviews collection).
2. "Your trial lesson is still saved."
3. Same itemised summary + Resume button.
4. Brief paragraph addressing common hesitations ("not sure about the weather? We reschedule for free." / "gift voucher? Yes — let us know at checkout.").
5. Footer + phone.

### Email infrastructure (RFC 8058 + Gmail/Yahoo 2026 requirements)

Even though HQ is far below the 5,000 emails/day bulk-sender threshold, [Gmail & Yahoo require RFC 8058 one-click unsubscribe headers on promotional mail](https://emailwarmup.com/blog/gmail-and-yahoo-bulk-sender-requirements/) and Google moved to permanent rejections from November 2025. Implementing now means we never get caught when volume grows.

Headers on every recovery email:

- `List-Unsubscribe: <mailto:unsubscribe@hq-domain>, <{API_BASE}/api/carts/unsubscribe?t={token}>`
- `List-Unsubscribe-Post: List-Unsubscribe=One-Click`
- DKIM signature **must cover both List-Unsubscribe headers** (RFC 8058 hard requirement).
- `Precedence: bulk` header so auto-replies don't bounce back.
- `X-Auto-Response-Suppress: All` to suppress out-of-office replies.

Deliverability checklist:

- SPF + DKIM + DMARC already in place for the existing booking-confirmation domain (verify before Phase 3 ships — check via `dig TXT` on the sending domain).
- One-click unsubscribe must be processed within 48h ([Gmail policy](https://support.google.com/a/answer/81126)) — our handler is synchronous, well under.
- Plain-text alternative on every send (no open-pixel in plain-text variant).
- Visible body unsubscribe link in addition to header (operationally required even with RFC 8058).
- Send rate cap: ≤ 50/tick, ≤ 200/h.

### GDPR / PECR (UK)

Per UK ICO and 2026 sources ([Snowplow](https://snowplow.io/blog/abandoned-cart-emails-gdpr), [Frizbit](https://frizbit.com/blog/are-cart-abandonment-emails-gdpr-compliant/), [Sprintlaw](https://sprintlaw.co.uk/articles/gdpr-email-marketing-in-the-uk/)), cart-recovery emails are permissible without explicit marketing consent provided **all four** soft-opt-in conditions are met:

1. **Email collected during a transactional context** — yes, at the email-first checkout step.
2. **Marketing is for similar products/services** — yes, completing the booking they were already making.
3. **Clear opt-out at point of collection** — yes, helper text under the email field: "We'll only use this to send your booking. You can unsubscribe any time."
4. **Opt-out in every subsequent message** — yes, body link + RFC 8058 header.

Lawful basis recorded as **legitimate interest** (Article 6(1)(f)) on each `carts` doc: `lawfulBasis: 'legitimate_interest'` for audit. If it's ever escalated to marketing-style content (newsletters, promotions), basis must change to consent — but that's out of scope.

### Open / click measurement (privacy-aware)

- Open pixel is `<img>` only in HTML variant; absent in plain-text alternative.
- Pixel hit and resume-link click both write to the cart's `recoveryEmailsSent[i]` entry — no separate tracking collection, no cross-session profile building.
- No third-party tracking pixels (no Facebook, no Google), only first-party.

## Best-practice hardening

The features below are what take this from "Squarespace clone" to "actually load-bearing analytics for the business." Each is small in isolation, but together they're the difference between a dashboard you trust and one you don't.

### Cart correctness

- **Upsert by `sessionId`.** `POST /api/carts` is an upsert: if a non-completed cart with this `sessionId` exists, update it; otherwise create. Repeated Book Now clicks don't multiply carts. A Firestore `cartBySessionId/{sessionId}` index doc points at the active cart for O(1) lookup.
- **Idempotent webhook → cart promotion.** When `payment_intent.succeeded` fires, mark the matching cart `completed` only if `status !== 'completed'`. The Stripe webhook can fire twice; the cart promotion must be a no-op the second time.
- **Server is source of truth for prices.** Client sends `aircraftId` + `duration` + `addonIds` only; server re-prices from Firestore `pricing` collection before storing `totalP`. Prevents tampering and matches the existing `priceAddons()` pattern in `api/stripe.js`.
- **Schema validation at the boundary.** `POST /api/carts` body validated by zod (`api/lib/cartValidation.js`); 400 on malformed input. Same for `PATCH /api/carts/:id`.
- **Cart expiry is explicit.** Carts inactive >7 days move to `expired`. Carts older than 90 days (any status) are deleted by the housekeeping job. No silent infinite growth.

### Security & abuse

- **Rate limit `POST /api/carts` to 30/min/IP** (half the analytics rate; cart writes happen less). Same `express-rate-limit` pattern as `api/analytics-api.js`.
- **Honeypot field on the email step.** Hidden `<input name="company">` field; any cart submission with it filled is dropped server-side without a 400 (don't tell bots they failed).
- **Email format validation server-side** (regex + DNS MX check via a debounced lookup). Stops `asdf@asdf` from cluttering recoverable carts.
- **Resume token unguessability.** 32-char URL-safe random token (`crypto.randomBytes(24).toString('base64url')`). Tokens are single-use after `completed`; revoked tokens 410.
- **Unsubscribe is one-click and doesn't require auth.** `GET /api/carts/unsubscribe?t={token}` sets `noEmail: true`. Required by GDPR/CAN-SPAM; same token type as resume.

### Email deliverability

- **Reuse existing nodemailer transporter** from `api/stripe.js`. Same sending domain → SPF/DKIM/DMARC already established for booking confirmations carries over to recovery emails.
- **Plain-text alternative on every recovery email.** `text:` field populated by template. Improves inbox placement.
- **List-Unsubscribe header.** Add `List-Unsubscribe: <{API_BASE}/api/carts/unsubscribe?t={token}>` and `List-Unsubscribe-Post: List-Unsubscribe=One-Click` to recovery emails. Gmail and Apple Mail show a native unsubscribe button — drastically reduces spam reports.
- **Send rate cap.** Recovery job sends ≤ 50 emails per scheduler tick (≤ 200/h). Volume is far below this; the cap is a runaway-loop guard.

### Recovery email tracking

- **UTM-tagged resume link.** Recovery email link is `/checkout?t={token}&utm_source=recovery&utm_medium=email&utm_campaign=cart-1h` (or `-24h`). The funnel can then attribute "Recovered" carts back to the email that worked.
- **Open tracking via 1×1 pixel.** `<img src="{API_BASE}/api/carts/email-pixel?t={token}&type=1h">`. Marks the matching `recoveryEmailsSent` entry's `opened: true`. Disable in plain-text alternative. Document in privacy section.
- **Click tracking via the resume link itself** — the resume endpoint sets `clicked: true` on the matching `recoveryEmailsSent` entry before redirecting.

### Self-exclusion (admin doesn't pollute their own data)

- **Existing `ADMIN_IP` env var** already excludes admin IPs from `page_events` reads. Reuse the same list in funnel aggregations and cart counts.
- **`ADMIN_EMAIL` env var** (comma-separated) — any cart whose email matches gets `excludedFromAnalytics: true` and is filtered from the dashboard tiles. Admin testing the funnel doesn't show as a real visitor.
- **No recovery emails to admin emails.** Same list short-circuits the recovery job.

### Time zones

- **Date-range filters use Europe/London.** "Last 7 days" ends at end-of-day London time, not UTC. Owner sees today's data when they expect to. `dayjs` with `tz` plugin (already a dep, check) — otherwise use `Intl.DateTimeFormat` with `timeZone: 'Europe/London'`.
- **Recovery email send times are clamped to 08:00–20:00 Europe/London.** A cart abandoned at 23:30 doesn't get a recovery email at 00:30; it queues for 08:00 next morning. Better deliverability, fewer "why are they emailing me at 1am" complaints.

### Mobile abandonment signal

Exit-intent doesn't work on mobile (no mouse). Replacement: on `/checkout`, listen for `visibilitychange` → `hidden` AND `pagehide`. If we don't yet have an email and the cart has at least one item, fire the same email-prompt modal *next time* the page becomes visible (i.e. they come back to the tab). For sessions that never return, we have no email and the cart simply expires — that's accepted.

### Conversion value alongside count

The dashboard tiles show **£ revenue alongside counts** — a funnel without value is half the picture. Every customer is treated the same; £ totals are shown for transparency, not to triage who deserves attention.

For each funnel stage and each abandoned-cart row:

- Show count AND total £ value.
- Show **AOV** (average cart value) in the funnel header.
- "Recoverable" tile shows total recoverable £ at the top alongside the count.

Recovery emails and follow-up cadence are identical regardless of cart value — every booking is treated the same way.

### Source-segmented funnel

The single most useful filter Squarespace **doesn't** show: split the funnel by traffic source (UTM source / referrer category). Owner immediately sees that Google Organic converts at 6% but Instagram at 0.5%. Filter dropdown in the Funnel tile: All / Google / Instagram / Facebook / Direct / Email / Other. Already-tracked UTM data makes this nearly free.

### Time-to-conversion

Add one number to the funnel tile: **median hours from first `pageview` to `purchased`** within the date range. Tells the owner whether buyers convert same-day or after a week of consideration — radically different marketing implications.

### Empty states

- "No abandoned carts in this range" → "Nothing to recover — well done."
- "No GSC data yet" → setup CTA with a link to the env-var doc.
- "No purchases this period" → don't show 0% / 0% / 0% misleadingly; show "Awaiting first purchase."

### Audit log for admin actions

`admin_audit/{id}: { actor, action, target, at, meta }` — written whenever an admin manually sends a recovery email, marks a cart as completed, or unsubscribes a cart. Cheap insurance; lets the owner verify "did I email this person already?" instead of guessing from the cart record.

### Data retention

- `page_events`: rolled into `daily_rollups` (one doc per day per page) by a nightly job. Raw events older than 180 days are deleted. Funnel and overview tiles read rollups for ranges >30 days; raw events for ranges ≤30 days. Caps Firestore growth and read costs without losing historical trend data.
- `carts`: deleted after 90 days regardless of status (housekeeping job described above).
- `gsc_daily`: kept indefinitely (small, slow-growing).

### Observability

- Recovery job logs structured events: `{job: 'cart-recovery', tick: ts, scanned, abandoned, queued, sent, failed}`. Log to stdout (existing pattern); a future Cloud Logging hookup can pick this up.
- GSC sync logs `{job: 'gsc-sync', date, rowsFetched, rowsWritten, durationMs, error}`.
- Dashboard surfaces a small "Last sync: 3h ago" indicator on each tile that depends on a job.

### Rollout / migration

- Phase 1 ships behind a `FUNNEL_ENABLED` env flag (default true) so it can be killed instantly if the new `view_item` / `begin_checkout` events misbehave.
- Phase 2 (email-first step) ships behind `EMAIL_FIRST_CHECKOUT` flag — owner can A/B-toggle to confirm no conversion regression.
- Phase 3 (auto recovery emails) is initially **disabled by default** and turned on by setting `CART_RECOVERY_AUTO=true` in env. First week the owner manually sends from the dashboard, watches deliverability, then flips the flag.
- Phase 4 (GSC) requires service-account JSON in env; tile shows setup CTA when missing.

### Testing matrix

In addition to the items already listed:

- Unit: cart upsert idempotency (10 rapid Book Now clicks → 1 cart).
- Unit: recovery job clock boundaries (59m vs 61m, 23h59 vs 24h01, 6d23h vs 7d01h).
- Unit: webhook double-fire → cart marked completed once, `purchased` event fired once.
- Unit: admin email/IP exclusion (cart created from admin IP doesn't appear in funnel counts).
- Unit: zod schema rejects malformed payloads with 400.
- Integration: resume token round-trip (email link → checkout state restored → pay → cart completed).
- Integration: unsubscribe link sets `noEmail: true` and short-circuits future recovery sends.
- E2E (Playwright): full happy + abandoned paths, mobile + desktop.
- Load: 1000 carts created in 1 minute → rate limiter holds, no Firestore quota errors.

## Success criteria

- Owner can open `/admin/analytics` and see, for any chosen date range, the Discovery Flight funnel and abandoned-cart **counts AND £ values** that match Squarespace's tile structure exactly, plus AOV, time-to-conversion, and source segmentation that Squarespace doesn't show.
- An abandoned cart with an email is reachable via "Send recovery email" from the dashboard within one click; admin manual sends are recorded in `admin_audit`.
- Automated recovery emails fire at 1h and 24h boundaries (±5 min), respect quiet hours (08:00–20:00 Europe/London), respect unsubscribe and admin exclusion lists, and are delivered with one-click `List-Unsubscribe`.
- Search Keywords tile shows the same metrics Squarespace shows, refreshed within 24h, with a visible "last sync" indicator.
- Funnel correctness verified end-to-end: 10 rapid Book Now clicks produce 1 cart; webhook double-fires produce 1 `purchased` event; admin IP/email never appears in tiles.
- No regression in existing checkout conversion (measured by comparing 14-day pre/post `purchase` counts; `EMAIL_FIRST_CHECKOUT` flag enables instant rollback).

## Standards & references

This spec is grounded in 2026 best practice from the following sources:

**Event naming & funnel structure**
- [GA4 recommended events](https://support.google.com/analytics/answer/9267735) — canonical `view_item`, `begin_checkout`, `add_payment_info`, `purchase` event names and their `items[]` parameter shape.
- [GA4 ecommerce measurement](https://developers.google.com/analytics/devguides/collection/ga4/ecommerce) — required params (`transaction_id`, `value`, `currency`).
- [GA4 funnel exploration](https://www.analyticsmania.com/post/funnel-analysis-report-in-google-analytics-4/) — Sessions → Product Views → Begin Checkout → Purchase funnel structure.
- [GA4 transaction_id deduplication](https://support.google.com/analytics/answer/12313109) — using a stable transaction id (Stripe `payment_intent.id`) for natural webhook double-fire dedup.

**Cart recovery email content & cadence**
- [Shopify abandoned cart email best practices 2026](https://www.shopify.com/blog/abandoned-cart-emails) — 1h / 24h / 72h sequence; luxury brands skip discounts and use brand storytelling.
- [Omnisend abandoned cart timing](https://www.omnisend.com/blog/abandoned-cart-email/) — first email 1h is the universal minimum.
- [Top Growth Marketing 2026 strategies](https://topgrowthmarketing.com/ecommerce-abandoned-cart-recovery-strategies/) — for high-AOV categories, extend timing and emphasise assurance over discount.
- [Mailmend cart abandonment statistics 2026](https://mailmend.io/blogs/cart-abandonment-recovery-statistics) — luxury/jewelry abandonment 82.84%; recovery is critical.
- [Popupsmart subject lines 2026](https://popupsmart.com/blog/abandoned-cart-subject-lines) — straightforward subjects with "cart" convert highest at 32.73%; curiosity subjects open highest at 66.28%.
- [Funnelkit subject lines](https://funnelkit.com/abandoned-cart-subject-lines/) — personalised subjects boost opens ~22%; mentioning "cart" +10% opens.

**Email infrastructure & deliverability**
- [Gmail sender guidelines](https://support.google.com/a/answer/81126) — RFC 8058 one-click unsubscribe required for bulk senders; 48h processing window.
- [DMARCPal RFC 8058 setup](https://dmarcpal.com/learn/one-click-unsubscribe-gmail-yahoo) — `List-Unsubscribe` + `List-Unsubscribe-Post: List-Unsubscribe=One-Click`; DKIM must cover both headers.
- [Mailgun RFC 8058 explainer](https://www.mailgun.com/blog/deliverability/what-is-rfc-8058/) — implementation pattern for transactional senders.
- [Email Warmup 2026 bulk sender requirements](https://emailwarmup.com/blog/gmail-and-yahoo-bulk-sender-requirements/) — Google moved to permanent rejections from November 2025; threshold is 5,000/day to personal accounts.

**Privacy / GDPR / PECR**
- [Snowplow on cart recovery + GDPR](https://snowplow.io/blog/abandoned-cart-emails-gdpr) — soft opt-in pathway for transactional cart recovery.
- [Frizbit on PECR-compliant cart emails](https://frizbit.com/blog/are-cart-abandonment-emails-gdpr-compliant/) — four conditions for legitimate-interest basis.
- [WDPS transactional vs marketing under PECR](https://wdps.co.uk/transactional-vs-marketing-emails-pecr/) — service emails are exempt from consent; cart recovery walks the line and needs the legitimate-interest record.
- [Sprintlaw UK GDPR email guide](https://sprintlaw.co.uk/articles/gdpr-email-marketing-in-the-uk/) — UK-specific implementation guidance.

**Conversion benchmarks (for success-criteria framing)**
- [Baymard cart-abandonment research](https://baymard.com/learn/ecommerce-cro) — global average abandonment 70.22%.
- [Shopify ecommerce conversion rates 2026](https://blendcommerce.com/blogs/shopify/ecommerce-conversion-rate-benchmarks-2026) — Shopify-store baseline conversion 1.4–3.2%.

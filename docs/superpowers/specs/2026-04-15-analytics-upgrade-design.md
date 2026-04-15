# Analytics Upgrade — Design Spec
**Date:** 2026-04-15
**Status:** Approved

---

## Overview

Upgrade the existing analytics system with five capabilities:
1. **IP capture + admin filtering** — capture visitor IPs on every event, exclude the site owner's IP from all dashboard metrics via env var
2. **Geo enrichment** — resolve IP → country/city at event write time using ip-api.com (free, no key)
3. **Seven new tracking dimensions** — scroll depth, time on page, device/browser, traffic sources, bounce rate, geographic breakdown, user journeys
4. **UTM parameter tracking** — capture campaign attribution on pageviews for ad/email/social campaigns
5. **Hardening** — rate limiting, Firestore composite indexes, data retention policy

---

## 1. Data Layer

### New fields on every `page_events` Firestore document

```
ip:          String   — raw IP from req.ip (Express trust proxy enabled)
country:     String   — from ip-api.com geo lookup (e.g. "United Kingdom"), null on failure
countryCode: String   — ISO 3166-1 alpha-2 (e.g. "GB"), null on failure
city:        String   — from ip-api.com (e.g. "London"), null on failure
```

### New event types (added to server whitelist)

| eventType     | elementId value         | Meaning                              |
|---------------|-------------------------|--------------------------------------|
| `scroll_depth`| `"25"` / `"50"` / `"75"` / `"100"` | % of page height scrolled |
| `page_exit`   | e.g. `"47"`             | Seconds spent on page before leaving |

Existing types unchanged: `pageview`, `cta_click`, `form_submit`, `image_view`

### Admin IP filtering

- `ADMIN_IP` in `.env` — comma-separated, e.g. `ADMIN_IP=82.41.1.2,10.0.0.1`
- A new auth-protected endpoint `GET /api/analytics/config` returns `{ excludedIps: [...] }` to the dashboard
- Dashboard fetches config on load and filters all events client-side before aggregation
- IP is never embedded in the client bundle

---

## 2. Server Changes (`api/analytics-api.js`)

### IP capture
- Enable `trust proxy` in Express (`server.js`) so `req.ip` reads through `X-Forwarded-For` correctly
- Extract `req.ip` on every incoming analytics event

### Geo enrichment (Approach A — enrich at write time)
- After validating the event, call `http://ip-api.com/json/{ip}?fields=country,countryCode,city` with a 2-second timeout
- Free tier: 45 req/min, HTTP only — sufficient at current traffic levels
- Await the geo result, then write the full enriched document to Firestore in one operation
- On failure (timeout, private IP, rate limit, network error): store `null` for geo fields and write the document anyway — analytics is never dropped
- Skip geo lookup entirely for private/loopback IPs (`127.x`, `::1`, `10.x`, `192.168.x`, `172.16-31.x`) — write immediately with `null` geo fields

### New `/api/analytics/config` endpoint
- `GET /api/analytics/config`
- Requires Firebase Admin auth token (same middleware pattern as other admin routes)
- Returns `{ excludedIps: process.env.ADMIN_IP?.split(',').map(s => s.trim()) ?? [] }`

### Rate limiting on `POST /api/analytics`
- In-memory sliding window: max 60 requests per IP per minute
- Use `express-rate-limit` package (already common in Express stacks) with `windowMs: 60_000, max: 60`
- On limit exceeded: return `429` silently — client already swallows errors, no UX impact
- Keyed by `req.ip` (same as the IP capture, benefits from `trust proxy`)

---

## 3. Client-Side Tracking (`src/lib/analytics.js` + `src/components/PageTracker.jsx`)

### Scroll depth (in `PageTracker.jsx`)
- On each route mount, attach a `scroll` event listener (throttled, ~200ms)
- Track max scroll percentage reached: `(scrollY + innerHeight) / documentElement.scrollHeight * 100`
- Fire `trackEvent('scroll_depth', threshold, page)` at 25%, 50%, 75%, 100% — once per threshold per page visit
- Remove listener and reset thresholds on route change

### Time on page / page exit (in `PageTracker.jsx`)
- Record `Date.now()` when a pageview fires
- On route change: calculate elapsed seconds, fire `trackEvent('page_exit', String(seconds), prevPage)`
- Also fire on `document.visibilitychange` → `hidden` (handles tab close / mobile backgrounding)
- Guard against duplicate fires (flag once sent)

### Device & browser
- No new events needed — `userAgent` already stored on every event
- Parsed client-side in the dashboard using `ua-parser-js`

### Traffic sources
- No new events needed — `referrer` already stored
- Categorised in dashboard: Direct (empty) / Search (google, bing, yahoo, duckduckgo) / Social (facebook, instagram, twitter, x.com, linkedin, tiktok) / Referral (everything else)

### UTM parameter tracking (in `PageTracker.jsx`)
- On each pageview, read `utm_source`, `utm_medium`, `utm_campaign`, `utm_term`, `utm_content` from `window.location.search`
- Pass non-null UTM values as extra fields on the analytics POST body
- Server stores them on the Firestore document: `utmSource`, `utmMedium`, `utmCampaign`, `utmTerm`, `utmContent` (all nullable strings)
- Dashboard: new **Campaigns** section showing top `utmCampaign` values by session count, with `utmSource` and `utmMedium` breakdown
- UTM data enhances (not replaces) the traffic source categorisation — a visit with `utm_source=google&utm_medium=cpc` shows in Search AND in Campaigns

### Returning vs new — not included in this spec (localStorage approach deferred)

---

## 4. Dashboard (`src/pages/admin/AdminAnalytics.jsx`)

### On load
1. Fetch excluded IPs from `/api/analytics/config`
2. Fetch `page_events` from Firestore for selected time range
3. Filter out events where `event.ip` is in excluded IPs
4. Run all aggregations on the filtered set

### New dependency
- `ua-parser-js` — parse `userAgent` into device type, browser, OS

### Layout (top to bottom)

**Header** — title + 7d / 14d / 30d time filter buttons + IP filter status banner

**Area chart** — daily page views + sessions over selected period (SVG, rendered from bucketed event counts by day)

**Overview row** (4 cards with sparklines) — Page Views, Unique Sessions, CTA Clicks, Form Submits

**Engagement row** (3 cards with sparklines) — Bounce Rate, Avg. Time on Page, Avg. Scroll Depth

**Acquisition row** (2 cols) — Top Pages table with inline bars | Traffic Sources donut chart

**Audience row** (2 cols) — Devices donut + Browser bars | Top Countries with bars + Sessions by hour histogram

**Behaviour row** (2 cols) — Scroll Depth by page (horizontal bars, 4 thresholds) | Top User Journeys

**Campaigns row** (2 cols) — Top UTM Campaigns table | UTM Source + Medium breakdown

**Interactions row** (2 cols) — Top CTA Clicks | Top Form Submit pages

### Computed metrics

| Metric | Computation |
|--------|-------------|
| Bounce rate | Sessions with exactly 1 pageview / total sessions × 100 |
| Avg time on page | Mean of `page_exit` events' `elementId` (seconds), per page or globally |
| Avg scroll depth | Mean of max scroll threshold reached per page session (25→25, 50→50, etc.) |
| Scroll depth by page | For each top page: % of pageview sessions reaching each threshold |
| User journeys | Group pageviews by sessionId, sort by timestamp, stringify page sequence, count top 5 |
| Sessions by hour | Group pageviews by `timestamp.toDate().getUTCHours()`, count per hour |
| Daily chart data | Group pageviews + sessions by date string (YYYY-MM-DD), count per day |
| Traffic sources | Categorise `referrer` field, group by category |
| Devices / Browsers | Parse `userAgent` with ua-parser-js, group by device.type and browser.name |
| Countries | Group by `country` field, top 8 |
| UTM campaigns | Group pageviews by `utmCampaign` (non-null), count sessions, top 10 |
| UTM source/medium | Group by `utmSource` + `utmMedium` pair, count sessions |

---

## 5. Firestore Indexes

New composite indexes to declare in `firestore.indexes.json`:

| Collection | Fields | Purpose |
|------------|--------|---------|
| `page_events` | `timestamp` ASC | Existing time-range queries (already works) |
| `page_events` | `ip` ASC, `timestamp` ASC | IP filtering queries |
| `page_events` | `country` ASC, `timestamp` ASC | Country breakdown queries |
| `page_events` | `utmCampaign` ASC, `timestamp` ASC | Campaign breakdown queries |

Single-field indexes on `eventType` and `sessionId` are auto-created by Firestore.

---

## 6. Data Retention

- Firestore TTL policy on `page_events` collection: delete documents where `timestamp` is older than **12 months**
- Configured via Firebase console (Firestore → TTL policies) — no code change needed
- Document this in `.env.example` / README so it's not forgotten on new deployments

---

## 7. Dependencies

| Package | Purpose | Where |
|---------|---------|-------|
| `ua-parser-js` | Parse userAgent into device/browser/OS | Dashboard (client) |
| `express-rate-limit` | Per-IP rate limiting on analytics endpoint | Server |

ip-api.com called via native `fetch` — no additional package needed.

---

## 8. Environment Variables

| Variable | Example | Purpose |
|----------|---------|---------|
| `ADMIN_IP` | `82.41.1.2,10.0.0.1` | IPs excluded from all analytics display |

---

## 9. Out of Scope

- Returning vs new visitor tracking (localStorage-based) — deferred
- Click heatmap (X/Y coordinates) — not selected
- Conversion funnel — not selected
- Geolocation map visualisation — table view sufficient for now
- Aggregation jobs / pre-computation — current volume doesn't require it

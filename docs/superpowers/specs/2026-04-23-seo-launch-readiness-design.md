# SEO Launch Readiness — Design

**Date:** 2026-04-23
**Status:** Draft for review
**Production domain:** `https://hqaviation.com` (pre-launch)

## Goals

1. Take the HQ Aviation site from its current SPA-with-no-per-route-meta state to launch-ready SEO baseline.
2. Ship a sophisticated SEO admin tab at `/admin/seo/*` so the owner can monitor SEO health, keyword rankings, Core Web Vitals, AI/LLM visibility, and a prioritized action queue — without paid third-party APIs.
3. Architect for a future paid SERP API drop-in (e.g. DataForSEO) without rework.

## Non-goals

- Multi-locale/i18n. English-only (`en-GB`) for now.
- Rewriting page bodies. Per-page tuning covers titles, meta descriptions, H1s, internal-link suggestions only.
- Backlink monitoring. Out of scope until a paid API is added.
- Daily auto-crawls. On-demand only at launch; can add a scheduler later.

## Scope summary

**Scope C** (chosen): measurement tool + foundational fixes + per-page tuning for top 12 pages.

**Data sources** (free tier):
- Google Search Console API (real ranking data for HQ's site)
- PageSpeed Insights API (Core Web Vitals)
- Local Puppeteer-based on-page audit crawler
- Anthropic Claude API for AI visibility tracking + recommendation fixes

---

## Architecture

```
┌─ Frontend (React, /admin/seo/*) ─────────────────────────────┐
│  AdminSeoOverview      → composite score + alerts            │
│  AdminSeoAudit         → per-page on-page audit table        │
│  AdminSeoAuditDetail   → one page's full audit + fix CTAs    │
│  AdminSeoKeywords      → GSC queries + target-keyword tracker│
│  AdminSeoPages         → per-page GSC performance            │
│  AdminSeoVitals        → Core Web Vitals (PSI cached)        │
│  AdminSeoAiVisibility  → LLM mention tracker                 │
│  AdminSeoRecommendations → prioritized action queue          │
│  AdminSeoSettings      → target keywords, competitors, GSC   │
└──────────────────────────────────────────────────────────────┘
                              ▲
                              │  reads from Firestore + calls API
                              ▼
┌─ Backend (Express, /api/seo/*, all admin-guarded) ───────────┐
│  POST /api/seo/audit/run        → crawl site, write results  │
│  POST /api/seo/audit/run/:slug  → re-audit a single page     │
│  POST /api/seo/vitals/refresh   → call PageSpeed Insights    │
│  POST /api/seo/gsc/sync         → pull GSC data into FS      │
│  POST /api/seo/ai/check         → run AI visibility prompts  │
│  POST /api/seo/fix/suggest      → call Claude with skill     │
│  GET  /api/seo/health           → connection statuses        │
└──────────────────────────────────────────────────────────────┘
                              ▲
                              │
                ┌─────────────┼──────────────┐
                ▼             ▼              ▼
        Local crawler   Google APIs    Firestore writes
        (puppeteer +    (search-       (seo_* collections)
         cheerio)        console,
                         pagespeed)
```

**Public site additions:**
- `GET /sitemap.xml` (dynamic, Express-served, 1h in-memory cache)
- `GET /robots.txt` (static, in `public/`)

### Why these choices

- **Multi-route under `/admin/seo/*`** rather than one page with tabs: each domain (audit, GSC, vitals, AI) fetches different data and warrants its own component. Avoids a 3000-line file.
- **Server-side crawler with Puppeteer** rather than client-side fetch: SPA shell HTML is empty without hydration; only headless Chromium reflects what Googlebot actually sees.
- **All data in Firestore** for consistency with the existing admin app and free-tier economics.
- **On-demand crawling** rather than cron: simpler infra (no scheduler), and audits are run before deploys, not on a clock.
- **Service account for GSC** rather than OAuth: single-admin app, no token refresh, identical UX once one-time setup is done.

---

## Firestore schema

All collections admin-read-only via Firestore rules; server-only writes via Admin SDK.

| Collection | Doc shape | Purpose |
|---|---|---|
| `seo_audits` | `{slug, url, runId, runAt, score, issues[{rule,severity,message,fixHint}], passes[], renderedHtmlHash}` | One doc per page per crawl |
| `seo_audit_runs` | `{runId, runAt, pagesCrawled, pagesPassed, pagesFailed, summary}` | Index of crawl runs |
| `seo_vitals` | `{url, mobile:{lcp,inp,cls,perfScore,...}, desktop:{...}, refreshedAt, source:'field'\|'lab'}` | One doc per URL |
| `seo_gsc_queries` | `{date, query, page, position, impressions, clicks, ctr}` | Daily snapshots, partitioned by date |
| `seo_gsc_pages` | `{date, page, position, impressions, clicks, ctr}` | Daily snapshots, partitioned by date |
| `seo_target_keywords` | `{keyword, intent, targetPage, notes, addedAt}` | User-defined target keywords |
| `seo_competitors` | `{name, domain, notes}` | User-defined competitor URLs |
| `seo_ai_test_prompts` | `{prompt, category, addedAt}` | Prompts used for AI visibility checks |
| `seo_ai_mentions` | `{date, model, prompt, mentioned, sentiment, excerpt, competitorsMentioned[]}` | Results of AI checks |
| `seo_recommendations` | `{id, source, severity, title, page, body, status, createdAt, updatedAt}` | Action queue (status: open/in-progress/done/wont-fix) |
| `seo_sync_meta` | `{lastGscSync, lastPsiSync, lastAuditRun, lastAiCheck}` | Single doc tracking sync timestamps |

---

## On-page audit rules

Each rule is a pure function `(renderedHtml, url, pageType) → {pass|warn|fail, message, fixHint, weight}`. Score per page = `sum(weight * passWeight) / sum(weight) * 100`.

### Meta & head
- `<title>` exists, 30–60 chars, unique across site
- `<meta description>` exists, 70–160 chars, unique
- `<link rel="canonical">` exists and self-references
- `og:title`, `og:description`, `og:image`, `og:url`, `og:type` present
- `twitter:card`, `twitter:title`, `twitter:description`, `twitter:image` present
- `<html lang>` set
- `viewport` meta present

### Content structure
- Exactly one `<h1>`
- Heading hierarchy intact (no skipped levels)
- Word count ≥ 300 (warn under, fail under 100)
- ≥ 3 internal links

### Images
- Every `<img>` has non-empty `alt`
- Every `<img>` has explicit `width`/`height`
- File-size warning >200KB without lazy loading

### Structured data
- ≥ 1 valid JSON-LD `<script>` block
- Schema validates against expected types per page type

### Technical
- HTTP 200
- Page response time
- Rendered HTML size
- No accidental `noindex` on public pages
- Sample of `<a>` links checked for 404s

### Per-page-type rules
- Aircraft pages → `Product` schema with name/image/brand/description
- Blog posts → `Article` schema with author/datePublished
- Landing → `Organization` + `WebSite` with `SearchAction`
- Contact → `LocalBusiness` with address/geo/openingHours
- FAQ-bearing pages → `FAQPage` schema

### Crawl scope
Defined in `src/lib/seoRoutes.js` — single source of truth used by:
- The crawler (decides what to audit)
- `sitemap.xml` generator (decides what to include)
- `robots.txt` generator (decides what to disallow)
- Per-page-type tagging (decides which JSON-LD template applies)

Public routes to crawl: `/`, `/aircraft`, `/aircraft/r22|r44|r66|r88|h500`, `/sales/pre-owned/:id` (used aircraft detail), `/training/ppl|cpl|type-rating|night-rating|trial-lessons`, `/maintenance`, `/sales`, `/expeditions`, `/contact`, `/about`, `/blog`, `/blog/:postId`, plus a few others identified during implementation.

**Duplicate-URL handling:** the codebase exposes each aircraft model at two URLs (e.g. `/aircraft/r66` and `/aircraft-sales/new/r66`). The audit treats the `/aircraft/...` form as canonical; the duplicate gets a `<link rel="canonical">` pointing to the canonical and is excluded from the sitemap. This collapses duplicate-content risk without removing either route.

Routes to exclude (denylist): all `*-test`, `*-picker`, `*-variations`, `wireframes`, `final-draft`, `experimentation-2`, `endofmarchversion`, `component-showcase`, `hero-*`, `sfh*`, `journey-*`, `parallax-*`, `arrow-picker`, `ownership-picker`, `ppl-picker`, `scroll-path-test`, `/admin/*`, `/checkout`, `/booking-confirmed`, `/london-tour-checkout`, `/london-tour-confirmed`.

---

## Foundational SEO fixes (Phase 1 + 2)

### Per-route meta via `react-helmet-async`

- Add `<HelmetProvider>` at root of `App.jsx`
- New component `src/components/seo/Seo.jsx`:

  ```jsx
  <Seo
    title="..."
    description="..."
    canonical="..."          // optional, auto-generated from pathname if omitted
    ogImage="..."            // optional, falls back to default
    ogType="website|article|product"
    jsonLd={...}             // optional, can be an array
    noindex={false}
  />
  ```

- `src/lib/seoDefaults.js` holds site-wide defaults: default OG image (`/og-default.png`), Twitter handle, organization name, default lang.
- `index.html` keeps a generic baseline so JS-disabled crawlers see something sane.

### `public/robots.txt`

```
User-agent: *
Allow: /
Disallow: /admin
Disallow: /admin/*
Disallow: /checkout
Disallow: /booking-confirmed
Disallow: /london-tour-checkout
Disallow: /london-tour-confirmed
[+ all denylist routes from seoRoutes.js]

Sitemap: https://hqaviation.com/sitemap.xml
```

### Dynamic `sitemap.xml`

Express route `GET /sitemap.xml` in `server.js`. Composed from:
1. Static routes — from `src/lib/seoRoutes.js`
2. `/sales/pre-owned/:id` — every active used-aircraft listing in Firestore
3. `/blog/:postId` — every published blog post (static index + Firestore-published)

Returns `<urlset>` with `<lastmod>` from Firestore `updatedAt` where available. 1-hour in-memory cache.

### Hard-gate dev/test routes

In `App.jsx`:

```jsx
const SHOW_DEV_ROUTES = import.meta.env.DEV;
…
{SHOW_DEV_ROUTES && (
  <>
    <Route path="/hero-test" element={<HeroTest />} />
    {/* …all dev routes */}
  </>
)}
```

Vite dead-codes the entire branch in production. Reduces bundle size 15–30% (estimate). Single flag for opt-in re-enable.

### JSON-LD coverage

- **Site-wide** (in root layout via `<Seo>`): `Organization`, `WebSite` with `SearchAction`
- **Landing**: + `LocalBusiness` (Denham Aerodrome, geo, opening hours, phone)
- **Aircraft pages**: `Product` (name, image, brand="Robinson Helicopters", description, offers="POA")
- **Blog posts**: `Article` (author, datePublished, dateModified, image, headline)
- **Contact**: full `LocalBusiness` with `contactPoint`
- **FAQ-bearing pages**: `FAQPage` from existing accordion data
- **Nested pages**: `BreadcrumbList` auto-generated from route

Generated using `searchfit-seo:schema-markup` for accuracy.

### Per-page tuning (top 12)

Pages: `/`, `/aircraft`, `/aircraft/r22|r44|r66|r88`, `/training/ppl|cpl|type-rating|trial-lessons`, `/maintenance`, `/contact`, `/expeditions`.

For each, deliverable: target primary + secondary keywords, recommended title (≤60 chars), meta description (≤160 chars), H1, 2–3 internal-link suggestions.

Drafted using `searchfit-seo:on-page-seo` + `:keyword-clustering`. Presented as `docs/seo/per-page-tuning.md` for owner approval **before** edits to page files.

---

## Admin SEO tab — UI specification

### `/admin/seo` (Overview)
- Composite site score (0–100) with weekly delta + sparkline
- Health strip (GSC / PSI / last audit timestamps with status dots)
- 28-day GSC headline metrics: impressions, clicks, avg position, indexed pages
- Critical issues panel (top 3–5 high-severity items from `seo_recommendations`)
- Quick wins panel (top 5 medium-severity items)
- Recently audited pages table (top 10 by score-needs-attention)
- Action buttons: Run full audit, Sync GSC, Refresh vitals

### `/admin/seo/audit`
- Table of every audited page: URL, score, issue counts (high/med/low), last audited
- Sortable, filterable by URL pattern
- Click a row → `/admin/seo/audit/:slug` (full audit detail with each rule's pass/warn/fail and fix CTA)

### `/admin/seo/keywords`
- Top 50 GSC queries by impressions (28d), with sparkline of position
- Filters: "rank 4–10" (lowest-effort wins), "rank 1–3 with low CTR" (title/description tuning)
- Search box for any query
- Click a query → drilldown: which page ranks, position history, GSC clicks/impressions
- Target keywords sub-table: user-defined, shows current GSC position or "Not appearing yet"

### `/admin/seo/pages`
- Table of every URL with 28d GSC impressions, clicks, avg position
- Sortable, filterable by URL pattern
- Click a page → drilldown: top queries, position history chart

### `/admin/seo/vitals`
- Site-wide Core Web Vitals scorecard (mobile + desktop tabs)
- Per-page table sorted by worst LCP first
- Click a page → full PSI report + Lighthouse opportunities
- Field data labeled separately from lab data
- "Refresh" button (per-page + bulk)

### `/admin/seo/ai-visibility`
- Mention rate per model (Claude initially, expandable to Perplexity/Gemini/ChatGPT)
- Sentiment trend over time
- Competitor mention comparison
- Test prompt management (CRUD)
- Full transcripts of recent runs
- "Run check" button (~$0.60 per run for 30 prompts)

### `/admin/seo/recommendations`
- Prioritized action queue from all sources (audit/GSC/PSI/AI)
- Each row: title, page, severity, source, status (open/in-progress/done/wont-fix), estimated impact
- Status updates inline
- "Get fix" button → calls Claude server-side with appropriate `searchfit-seo` skill, surfaces concrete recommendation

### `/admin/seo/settings`
- Target keywords (CRUD)
- Competitor URLs (CRUD)
- AI test prompts (CRUD)
- Service account JSON status (read-only — set via `.env`)
- Crawl denylist (read-only — `src/lib/seoRoutes.js`)
- "Regenerate sitemap" button
- "Submit sitemap to GSC" button (one-time post-launch)

---

## Google API integration

### One-time setup (pre-launch checklist for owner)
1. Generate Google Cloud service account JSON key — added to `.env` as `GOOGLE_SERVICE_ACCOUNT_KEY` (escaped newlines, same pattern as Firebase key).
2. Owner verifies `hqaviation.com` in Google Search Console (DNS TXT record or HTML file). Setup doc with screenshots provided.
3. In GSC → Settings → Users → add the service account email as `Restricted` user.
4. Enable two APIs in Google Cloud Console: **Search Console API** + **PageSpeed Insights API**.
5. (Optional) Add `ANTHROPIC_API_KEY` to `.env` for AI visibility tracking.

### GSC sync
- `POST /api/seo/gsc/sync` — pulls last 90 days on first run, incremental thereafter
- Two queries: queries report + pages report
- Writes to `seo_gsc_queries` and `seo_gsc_pages`, partitioned by date
- Auto-trigger on opening `/admin/seo` if last sync >24h
- Manual "Sync now" button always available

### PageSpeed Insights
- `POST /api/seo/vitals/refresh` — one call per URL per device (mobile + desktop)
- Pulls Core Web Vitals (LCP, INP, CLS) + Lighthouse scores
- Cached in `seo_vitals` for 7 days
- Field data preferred where available, falls back to lab data

### Cost
- All Google APIs: **free**
- Claude API for AI visibility: ~$0.60 per 30-prompt check (recommend monthly cadence)
- Total monthly added cost: **<$5/mo** at expected usage

---

## AI Visibility tracking

- Owner-defined test prompts (e.g. *"Best helicopter flight school in London"*)
- `POST /api/seo/ai/check` loops each prompt through Claude API:
  - Step 1: ask the model to answer naturally
  - Step 2: ask whether HQ Aviation was mentioned + extract excerpt + identify any competitors mentioned
- Writes to `seo_ai_mentions`
- Uses `searchfit-seo:ai-visibility` skill prompts
- Uses prompt caching (per `claude-api` skill guidance) for cost efficiency
- Future expansion: same data shape works for Perplexity API, Gemini API

---

## Recommendation queue

Single inbox for all action items. Items generated automatically:

| Source | Trigger | Example |
|---|---|---|
| Audit | Each crawl run | "Page /aircraft/r66 has no `<h1>`" |
| GSC | Each sync | "Rank #4 for 'helicopter training London' (1.2k impr/mo) — push to top 3" |
| PSI | Each refresh | "LCP on /aircraft/r66 is 4.2s (poor)" |
| AI | Each check | "0/5 'helicopter sales UK' prompts mentioned HQ" |

Each row: title, page, severity (high/med/low), source, estimated impact, status, "Get fix" CTA.

"Get fix" calls `POST /api/seo/fix/suggest` server-side, which dispatches to the right `searchfit-seo` skill (`:on-page-seo`, `:schema-markup`, `:technical-seo`, etc.) via Claude API and returns a concrete recommendation (proposed title, schema JSON block, etc.).

---

## Security

- All `/api/seo/*` endpoints require admin Firebase token (existing `requireAdmin` middleware)
- All `seo_*` Firestore collections: read = admin only, write = server only (rules update required)
- Service account JSON in `.env` only — never in client bundle
- `/sitemap.xml` and `/robots.txt` are public (correct)
- Anthropic API key in `.env` server-side
- Rate-limit `POST /api/seo/audit/run` to 1 concurrent crawl (Puppeteer is heavy)
- Per-route express rate limit on AI check endpoint to prevent runaway cost

---

## Testing

- Unit tests for the audit rule engine (each rule is pure: `(html, url, pageType) → result`) — vitest, fits existing setup
- Integration test for sitemap.xml generation against fixture Firestore data
- Snapshot test for each `<Seo>` configuration on top 12 pages
- Manual verification checklist included in setup doc
- No E2E for admin dashboard (consistent with rest of admin app)

---

## Implementation phasing

Each phase independently shippable.

### Phase 1 — Foundational SEO infrastructure (ship-blocker)
- `react-helmet-async` + `<Seo>` component + defaults
- `robots.txt` + dynamic `sitemap.xml`
- `src/lib/seoRoutes.js` single source of truth
- Hard-gate dev/test routes
- Site-wide JSON-LD (Organization + WebSite + LocalBusiness)
- Default OG image (existing hero crop, swappable)

### Phase 2 — Per-page meta tuning (ship-blocker)
- Wire `<Seo>` on every public page (final list resolved during planning) with audit-driven defaults
- Hand-tuned titles/descriptions/H1s for top 12 pages (owner-approved)
- Per-page-type JSON-LD (Product, Article, FAQPage, BreadcrumbList)
- First static `docs/seo/seo-audit.md` written by hand

### Phase 3 — Admin SEO tab (post-launch acceptable but ideally pre-launch)
- All 8 admin sub-routes + components
- All `/api/seo/*` endpoints
- Puppeteer crawler + audit rule engine
- GSC + PSI integrations
- Recommendation queue (without "Get fix" Claude integration)
- Firestore collections + rules
- Audit doc regenerated from this phase forward

### Phase 4 — AI visibility + Claude-powered fixes (post-launch)
- AI visibility tracker (Claude API + `searchfit-seo:ai-visibility`)
- "Get fix" buttons calling Claude with appropriate skills
- Optional: weekly email digest

---

## Deliverables

1. **Code** — phases 1–4 committed
2. **`docs/seo/seo-audit.md`** — standing audit doc (regenerated by dashboard from Phase 3; first version hand-written in Phase 2)
3. **`docs/seo/setup.md`** — one-time setup guide (GSC verification, service account creation, env vars)
4. **`docs/seo/per-page-tuning.md`** — proposed titles/descriptions/H1s for top 12 pages, presented for owner approval before page edits
5. **Implementation plan** (output of `writing-plans` skill, next step) — broken-down task list with verification steps

---

## Open assumptions (calling out for the record)

- Audit `.md` lives at `docs/seo/` (parallel to `docs/superpowers/`)
- Audit cadence: on-demand only at launch
- Per-page tuning scope: titles, meta, H1s, internal-link suggestions only — not body copy rewrites
- English-only (`en-GB`)
- Default OG image: existing hero crop in Phase 1, owner swaps file later (no code change)

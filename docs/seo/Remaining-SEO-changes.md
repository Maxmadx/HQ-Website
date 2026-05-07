# Remaining SEO Changes — execution plan

**Date:** 2026-04-25
**Status:** Tranches 1–6 shipped (60 changes, browser-verified, 23/23 tests passing). This document covers everything still to do, in priority order.
**Companion docs:** `docs/seo/per-page-tuning.md` (v3 strategy, research-grounded), `docs/seo/per-page-tuning-v2-archived.md` (superseded), `docs/seo/seo-audit.md` (foundational audit).

---

## What's already shipped (so this plan starts from the right baseline)

| Tranche | Coverage | Tests |
|---|---|---|
| 1 | title + meta on landing, /sales/new, /aircraft/r66, /maintenance, /training/ppl | passing |
| 2 | title + meta on /aircraft/r22, r44, r88, /training/type-rating, /training/trial-lessons | passing |
| 3 | title + meta on /training/commercial, /expeditions; sr-only H1 on 4 hero pages | passing |
| 4 | sr-only H1 on remaining 8 priority pages; `buildProduct()` POA bug fixed; `buildCourse()` added | passing |
| 5 | JSON-LD wired on 9 pages (Product/Course/Service + BreadcrumbList); `buildService()` + `buildItemList()` added | passing |
| 6 | Live `usePricing()`-driven Offer schema × 6 on /training/trial-lessons; ItemList on /sales/new; FAQPage on /training/ppl; R88 PreOrder Offer; per-page OG images on 5 hero pages; `og:image` and `og:title` dedup bugs fixed in `Seo.jsx` | 23 passing |

**Verification method:** every tranche browser-tested via Playwright probe against Vite dev server. Fixes for two real bugs (duplicate `<meta name="description">` from `index.html`; App-level Seo overriding page-level og:title and og:image) shipped during T6 verification.

**Coverage:** all 12 priority pages have title + meta + sr-only H1 + JSON-LD. `/contact` was excluded by owner from initial scope.

---

## Tranche 7 — visible content (HIGHEST unrealized impact)

This is the work that turns rank #2/#3 into rank #1. Every priority page where HQ ranks page-1-not-top-3 today has a competitor that wins on visible content depth — not on title/meta. Specifically: pricing transparency above the fold, named credentials, operational specifics.

**Estimated effort:** ~1 dev-day for the items that don't need owner-supplied content; ~2 days if including operating-economics blocks. Single tranche.

### 7.1 Above-fold pricing card on `/training/ppl`

- **What:** Add a visible pricing block above the fold on `FinalPPL.jsx` that pulls from the existing admin/Firestore pricing via `usePricing()`. Show: hourly aircraft rate (R22 `training_r22_hr`, R44 `training_r44_hr`, R66 `training_r66_hr`), CAA Class 2 medical (£180–£280), PPL(H) skills test (~£350 examiner fee + aircraft hire), total typical cost band (`costs_total_from`–`costs_total_to`).
- **Why:** Elstree Helicopters currently ranks #1 for *"ppl helicopter london"*; their winning move is visible above-fold pricing. HQ has the data (admin panel) and the SEO bones (Tranche 6 schema). What's missing is the visible UI block. This is the single largest unrealized rank-conversion lever from v3 Part 6.7.
- **Source:** `src/hooks/usePricing.js` exposes all the keys needed; `FinalPPL.jsx` already imports `usePricing`.
- **Open question:** styling. Mirror the `fd-pricing` component pattern used on `/training/trial-lessons` for consistency.

### 7.2 Above-fold cost transparency on `/training/commercial`

- **What:** Same pattern — admin pricing + visible block. Use `costs_training_from`/`costs_training_to`, `costs_exams_from/to`, `costs_medical_from/to`, `costs_total_from/to` from `usePricing()`. Plus the modular path: PPL → hour-building → CPL theory → skills test → first job.
- **Why:** CPL students search on cost more than any other variable. HQ should be the page that answers "how much does CPL(H) cost in the UK?" with the specific bands.
- **Source:** keys already in `usePricing.FALLBACK`.

### 7.3 `/maintenance` FAQ section + FAQPage schema

- **What:** Add a FAQ section to `FinalMaintenance.jsx` (currently has no FAQ block at all). 6–8 Q/A entries covering common owner-pilot searches: 50/100hr inspection turnaround, 12-year overhaul cost band, AOG response time, R66/RR300 servicing, parts inventory, hangarage availability. Then wire `buildFAQPage()` into the JSON-LD array on the page's `<Seo>` (mirror what's done on `/training/ppl`).
- **Why:** Owner-pilots search "robinson maintenance cost", "12 year overhaul", "AOG response". Structured Q&A on the page is both human-helpful and gives Google explicit signals for those queries.
- **Source:** content needs to be authored. `useFaqs` hook already supports `pageKey: 'maintenance'` if the FAQs are added to Firestore via the admin panel.
- **Owner action:** decide whether FAQ content goes in admin (preferred — editable) or static in JSX.

### 7.4 `/sales/new` fleet comparison table

- **What:** Add a visible table to `Sales.jsx`: model · seats · cruise speed · range · typical use · indicative price band. Three rows: R22, R44 Raven II, R66 Turbine. Optionally a fourth row for R88 with "register interest" instead of price.
- **Why:** Buyers comparing helicopters land on this page expecting comparison content. Currently the page is more visual than informational; adding a structured table addresses both buyer intent and helpful-content signals.
- **Source:** spec data from Robinson's official pages (already cited in v3 doc Part 6.3–6.5).
- **Owner decision:** publish indicative GBP price bands or omit the price column? See v3 Part 14 question #1.

### 7.5 Operating economics block per aircraft (R22, R44, R66)

- **What:** A standardised section on each `/aircraft/{model}` leaf showing: fuel burn (litres/hr + imperial), maintenance interval summary, indicative £/hr running cost, insurance band. Mirror across all three current-production leaves; skip R88 (pre-cert).
- **Why:** No UK competitor publishes operating economics on a public page. Original first-hand content is a major Helpful Content signal and gives buyers something competitors can't match.
- **Owner inputs needed:** real numbers per aircraft. Without owner data, this section can't ship.

---

## Tranche 8 — image audit (mechanical, CWV-driven)

**Estimated effort:** half a day per priority page. Mechanical work, no content decisions.

### What

For every `<img>` on the 12 priority pages:
- `width` + `height` attributes (kills cumulative layout shift)
- `loading="lazy"` below the fold; `fetchpriority="high"` on the LCP hero image
- `srcset` at 480w / 768w / 1200w / 1920w, served as WebP with JPEG fallback
- Descriptive `alt` text per the convention in v3 doc Part 9 — e.g. `"Robinson R66 Turbine exterior at Denham Aerodrome"`, not keyword-stuffed
- `ImageObject` schema in the existing Product JSON-LD on aircraft galleries (top 3–5 images per leaf)

### Why

- **CLS** — currently most images have no width/height, causing layout shifts as images load. CLS >0.1 is a Core Web Vitals fail and a ranking signal.
- **LCP** — hero images on landing/aircraft/training pages are large; without `fetchpriority="high"` and proper preload, LCP misses Google's 2.5s threshold.
- **Google Images traffic** — aircraft sales is a visually-driven category; descriptive alt + `ImageObject` schema unlocks a real referral channel competitors don't optimise.
- **WebP** — cuts page weight ~30% vs JPEG, helps both LCP and bandwidth.

### Priority order

1. `/aircraft/r66` — biggest winnable sales SERP
2. `/aircraft/r44`, `/aircraft/r22` — next sales SERPs
3. Landing `/` — animation-heavy, biggest LCP risk
4. `/training/ppl`, `/training/trial-lessons` — gallery-heavy
5. Remaining priority pages

---

## Tranche 9 — supporting content cluster (12 blog posts)

**Estimated effort:** 1–2 weeks per post if done in-house, 1 day per post if outsourced to a copywriter. Total: 12 posts.

### Why

For commercial pages to climb past competitors with stronger domain authority, supporting editorial content is the cheapest authority-building channel. Each post is 1200–1800 words, links 2–3× back to its target commercial page, and uses the existing `buildArticle()` schema builder. Publication cadence: 1 post/week for 12 weeks.

### The 12 posts (mapped 1:1 to commercial pages)

| # | Post title | Supports | Primary query |
|---|---|---|---|
| 1 | How much does PPL(H) cost in the UK? (2026 breakdown) | `/training/ppl` | ppl h cost uk |
| 2 | How long does a helicopter licence take? | `/training/ppl` | how long helicopter licence uk |
| 3 | R44 vs R66 — which Robinson suits your mission? | `/aircraft/r44`, `/aircraft/r66` | r44 vs r66 |
| 4 | Robinson R66 running costs — fuel, maintenance, insurance | `/aircraft/r66` | r66 running cost |
| 5 | Moving up from R22 to R44 — what the type rating covers | `/training/type-rating`, `/aircraft/r44` | r22 to r44 type rating |
| 6 | CPL(H) career paths — instructor, offshore, corporate, tours | `/training/commercial` | helicopter pilot career uk |
| 7 | Trial helicopter lesson — what to expect, what to bring | `/training/trial-lessons` | what to expect helicopter lesson |
| 8 | Helicopter gift voucher UK — what to know before you buy | `/training/trial-lessons` | helicopter gift voucher uk |
| 9 | CAA Part-145 explained — what owner-pilots should check | `/maintenance` | caa part 145 helicopter |
| 10 | Getting to Denham Aerodrome from central London | `/contact`, `/training/ppl`, `/training/trial-lessons` | denham aerodrome london |
| 11 | Robinson R88 — what we know about the eight-seat turbine (note: actually 10-seat) | `/aircraft/r88` | robinson r88 |
| 12 | Helicopter expedition planning — fuel, customs, routing | `/expeditions` | helicopter expedition planning |

### Per-post implementation

- 1200–1800 words
- H1 = primary query
- 2–3 outbound internal links to the supported commercial page(s)
- `Article` schema via existing `buildArticle()` (already in `jsonLd.js`)
- Author byline (Tranche 12 — once owner provides named CFI / authors)
- 1 hero image at 1200×630 with descriptive alt
- Publish cadence: 1/week

---

## Tranche 10 — `/helicopter-experience-london` new URL

**Estimated effort:** 2–3 dev-days (new route + component + content + images + schema). Speculative impact.

### What

New page at `/helicopter-experience-london` distinct from `/training/trial-lessons`. Same fleet (R22/R44/R66) but framed entirely as gift-buyer / one-time-experience product, not as pilot-training entry point. Voucher-first conversion funnel, commerce-style schema.

### Why

The query *"helicopter experience london"* is one of the highest-volume helicopter SERPs, currently dominated by aggregators (Adventure001, BuyAGift, IntoTheBlue, Trustpilot) plus The London Helicopter (Redhill). HQ is absent from top 5. A dedicated page with exact-match URL slug and commerce-schema parity with the aggregators is the only realistic shot at entering this SERP.

### Why a separate URL, not a canonical to `/training/trial-lessons`

- Distinct intent — gift buyer, not pilot prospect
- Distinct SERP — aggregators vs training schools
- Distinct conversion funnel — voucher-first, experience-focused
- Canonical to a different-angle page = Google picks its own canonical and we lose both

### Schema

- `Service` with `serviceType: "Helicopter Experience"` + `areaServed: "London"`
- `Offer` per experience tier with **live prices** matching DOM (same `usePricing()` integration as Tranche 6 Change 1)
- `Product` for gift voucher SKUs
- `BreadcrumbList`: Home → Helicopter Experience London

### Internal linking

Inbound from `/training/trial-lessons`, landing `/`, footer. Outbound to `/training/ppl` ("continue to full training") and `/contact`.

### Risks

Aggregator SERPs are difficult — even position 5–8 is realistic but not guaranteed. Worth planning as a sprint of its own rather than rolled into another tranche.

---

## Tranche 11 — operational rollout (post-deploy)

**Estimated effort:** ~2 hours owner action; recurring 30/60/90 day measurement.

Code work is done; this tranche turns shipped code into measurable outcomes. None of these are dev-team tasks.

### 11.1 GSC verification

Verify ownership of `hqaviation.com` in Google Search Console. DNS TXT or HTML file method — owner picks.

### 11.2 Sitemap submission

Submit `https://hqaviation.com/sitemap.xml` to GSC. Sitemap is already shipped (per `seo-audit.md`) — dynamic, generated from `seoRoutes.PUBLIC_ROUTES` + Firestore listings + blog posts, 1-hour cache.

### 11.3 Rich Results Test per page

Run each of the 12 priority URLs through [Google's Rich Results Test](https://search.google.com/test/rich-results). Confirm Product/Course/Service/FAQPage/BreadcrumbList all validate without warnings. Fix any validation errors that surface.

### 11.4 Baseline rank snapshot

Before measurable SEO impact accrues, log baseline ranks for the 14 target queries from v3 Part 3:
- "robinson helicopter dealer uk", "helicopter dealer near london", "ppl helicopter london", "robinson helicopter maintenance uk", "helicopter school denham", "robinson r66 for sale uk", "robinson r44 for sale uk", "helicopter experience london", "helicopter trial lesson uk", "robinson type rating uk", and the new ones: "robinson r22 for sale uk", "cpl helicopter training uk", "helicopter expeditions", and "new robinson r88".

Tool: GSC "Queries" report once 7+ days of data exists post-deploy. Until then, dated incognito spot-checks from a London IP.

### 11.5 30/60/90 day measurement

- **30 days:** all priority pages indexed in GSC. Baseline impressions + CTR per page.
- **60 days:** rank tracking for the 14 target queries. CTR audit on positions 4–10 (adjust meta descriptions if CTR <2%).
- **90 days:** organic sessions to priority pages (GA4); business KPIs (trial-lesson bookings, contact-form submissions tagged sales/maintenance, R88 register-interest); rank delta vs baseline.

### 11.6 Kill / escalate criteria

- Page stuck >position 20 after 90 days for its primary query → re-evaluate target query OR re-evaluate page structure (potentially cannibalised).
- Page drops out of existing top-10 post-deploy → roll back the title/meta change for that page within 48 hours. Tranche 1–6 changes are atomic per page so easy to revert.

---

## Tranche 12 — authority signals (owner inputs)

**Estimated effort:** half a day to wire once owner provides values.

These are placeholders the v3 doc identified that the SEO content layer needs to fill in for full E-E-A-T signal. Some I researched and resolved (RR300 ASC status, founder experience, Companies House); others are owner-only.

### Genuinely owner-only inputs

| Signal | Pages affected | Format |
|---|---|---|
| HQ's CAA Part-FCL ATO number | /training/ppl, /training/commercial, /training/type-rating | `GBR.ATO.XXXX` (extractable from [CAA Doc 31 PDF](https://www.caa.co.uk/publication/download/13488) — Cmd-F "HQ Aviation") |
| HQ's CAA Part-145 AMO number | /maintenance | `UK.145.XXXXX` (extractable from CAA Part-145 register PDF) |
| Named Chief Flying Instructor | /training/ppl | name, bio (with consent), CAA examiner authorisation reference (no public CAA pilot register exists — display authorisation number on-page) |
| Year HQ became authorised Robinson dealer | /, /sales/new (optional) | `YYYY` (Companies House shows incorp 2011; dealer-appointment year not publicly stated) |
| Decision: publish price bands on aircraft leaves? | /sales/new, /aircraft/* | (a) GBP band with "POA / subject to FX" qualifier, (b) link out to Robinson's USD PDFs, (c) omit price column |
| R88 order status — does HQ have any R88 orders in hand? | /aircraft/r88 | Y/N + count if Y |
| Exact opening hours | /contact (when in scope) | hours string |
| what3words for Denham Aerodrome | /contact | 3-word triplet from official what3words app |

### Already resolved by research (no owner action)

These were bracketed placeholders in v3 that I closed via public research; values now baked into the doc:
- Robinson Authorised Service Center status — confirmed via [Robinson's dealer/service-centre directory](https://www.robinsonheli.com/dealers-and-service-centers)
- Rolls-Royce RR300 Authorised Service Center — confirmed via [HeliHub 2019](https://www.helihub.com/2019/04/08/hq-aviation-gains-approval-as-rr300-authorized-service-center/)
- Robinson authorised dealer — confirmed (HQ is one of ~3 UK dealers; not "the" or "first")
- HQ Aviation Ltd incorporated 2011 — Companies House #07587658
- Founder Quentin Smith 55 years aviation experience — hqaviation.com
- R88 facts (10-seat, Safran Arriel 2W, FAA target 2028–2029, USD $3.3M) — Robinson press release + Vertical Mag + Flight Global
- Aircraft engine specs (R22 O-360, R44 IO-540 Raven II / O-540 Cadet, R66 RR300) — Robinson product pages

---

## Recommended execution order

If continuing solo:

1. **Tranche 11 (operational)** — do this regardless of next code tranche. Without GSC + sitemap + Rich Results Test, no SEO work is measurable.
2. **Tranche 7 (visible content)** — biggest unrealized rank-conversion lever. Requires owner inputs for 7.5 only.
3. **Tranche 8 (image audit)** — mechanical CWV/Google Images work. Independent of content.
4. **Tranche 12 (authority signals)** — wire as soon as owner supplies values.
5. **Tranche 9 (blog cluster)** — slowest payoff; start in parallel with everything else.
6. **Tranche 10 (`/helicopter-experience-london`)** — speculative; wait until measurement from T11 confirms which queries warrant the investment.

If outsourcing content (T9 posts) to a copywriter, that can run fully in parallel — only the schema wiring per post needs dev time.

---

## Files and helpers ready to use

When picking up any of the remaining tranches, these are already shipped and tested:

- **`<Seo>` component** (`src/components/seo/Seo.jsx`) — accepts `title`, `description`, `canonical`, `ogImage`, `ogType`, `jsonLd`, `noindex`. Conditional emission of og:title and og:image (won't clobber when a page-level `<Seo>` provides them).
- **Schema builders** (`src/components/seo/jsonLd.js`):
  - `buildOrganization()`, `buildWebSite()`, `buildLocalBusiness()` — site-wide, wired in `App.jsx`
  - `buildBreadcrumbList(items)` — `items: [{ name, path }]`
  - `buildProduct({ name, description, image, brand, url, offers })` — `offers` optional, omits when absent
  - `buildArticle({ headline, description, image, datePublished, dateModified, authorName, url })` — for blog (Tranche 9)
  - `buildFAQPage(items)` — `items: [{ q, a }]`
  - `buildCourse({ name, description, provider, url, courseInstance, offers })` — `offers` accepted as array
  - `buildService({ name, serviceType, description, url, areaServed, provider })`
  - `buildItemList({ name, items })` — `items: [{ name, url }]`
- **Hooks already imported in pages:**
  - `usePricing()` returns `{ p: (id) => pence, fmt: (id) => string, prices, loading }`. Used for live-pricing schema + visible price blocks.
  - `useFaqs(pageKey, { visibleOnly })` returns `{ faqs, loading }`. Used for FAQPage schema (Tranche 6 PPL, Tranche 7 maintenance).
- **23 tests passing** in `src/components/seo/jsonLd.test.js` and `Seo.test.jsx`.
- **v3 strategy doc** (`docs/seo/per-page-tuning.md`) carries the full research-backed reasoning behind every per-page decision. Read alongside this plan.

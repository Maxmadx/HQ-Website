# SEO Refinements — Design

**Date:** 2026-04-30
**Status:** Draft for review
**Production domain:** `https://hqaviation.com`
**Depends on:** PR #1 (`seo-launch-readiness` → `main`) must merge first.

## Goal

Layer best-within-reason SEO refinements on top of the Phase 1 + 2 foundations (PR #1). Targets the gaps Phase 1 + 2 left:
- Social-media scrapers (Facebook, Twitter, LinkedIn, iMessage, Slack) and Bing don't run JS, so they can't see client-side meta tags. Today every link share previews as the same generic homepage card.
- Several canonical URL forms compete for the same content (www / no-www, trailing-slash, HTTP, plus seven legacy duplicate routes).
- The `/misc` URL is the wrong slug for a customer-facing store.
- JSON-LD coverage is missing the right type for service / training / tourism / store / parts pages.
- Images can lack explicit dimensions, causing Cumulative Layout Shift — a direct Core Web Vitals ranking factor.

## Non-goals

- Framework migration (Next.js / Remix / Astro) — explicitly evaluated and rejected today as a separate, much larger effort.
- Phase 3 of the original SEO spec (admin SEO dashboard).
- Phase 4 of the original SEO spec (AI visibility tracking).
- Per-page copy rewrites — that's the content-audit Sub-project 2.
- Image weight compression (the 40MB facility photos) — also Sub-project 2.

## Scope summary

Eight discrete deliverables, all shippable as one PR (`feat/seo-refinements`) that branches off `main` *after* PR #1 lands.

| # | Deliverable | Why | Effort |
|---|---|---|---|
| 1 | Server-side meta injection for raw HTML | Social scrapers + Bing see correct meta in raw HTML, not just after JS hydration | M |
| 2 | URL canonicalisation (non-www, no trailing slash, HTTPS) + emit `<link rel="canonical">` site-wide | Prevent duplicate-content fragmentation of ranking signals | S |
| 3 | 301 redirects for 7 legacy duplicate URLs | Consolidate ranking signals on the canonical URL | S |
| 4 | `/misc` → `/store` rename (URLs, components, admin, UI copy; Firestore collection name unchanged) | Better SEO slug, clearer customer-facing label | M |
| 5 | Drop Product schema from `/aircraft/h500` (informational page, not for sale new) | Avoid lying to Google about availability | XS |
| 6 | Add JSON-LD types: `Course`, `Service`, `TouristTrip`, expanded `Product` for store / parts / discovery flights / London tour | Match each page's actual semantics, unlock relevant rich results | M |
| 7 | Image CLS hygiene: explicit `width`/`height` (or `aspect-ratio`) on every `<img>` | Direct Core Web Vitals ranking factor; cheap layout-stability win | M |
| 8 | Accurate `<lastmod>` from Firestore `updatedAt` in sitemap; verify robots strategy | Tells search engines what to recrawl; ensures `noindex` on dev/transactional routes is actually visible to crawlers (don't block in `robots.txt`) | S |

---

## Architecture

PR #1 already established the SEO infrastructure: `<Seo>` component, `seoRoutes.js` SSOT, dynamic `sitemap.xml`, `robots.txt`, JSON-LD builders for the original 7 schema types. This PR extends each of those, plus adds new modules where new patterns are needed.

### 1. Server-side meta injection (the central piece)

```
Request → Express middleware → look up route metadata → string-replace <head> in index.html → respond
```

**Where:** new `api/seoMetaInjection.js` middleware, mounted in `server.js` *before* the static-file fallthrough.

**How:**
- Read the requested path.
- For static canonical routes: look up `{ title, description, ogImage, canonicalUrl, jsonLd[] }` from `src/lib/seoRoutes.js` (extend the existing SSOT — don't duplicate).
- For dynamic routes (`/blog/:slug`, `/sales/pre-owned/:id`, `/store/:id` post-rename), fetch the document from Firestore via Admin SDK (already wired by PR #1's sitemap), pull title/description/coverImage/updatedAt fields, build the head fragment.
- Inject by string-replacing a sentinel in `index.html` (e.g., `<!--SSR_HEAD-->`) that we add as part of this PR.
- 5-minute LRU cache keyed by path; invalidates on any process restart. (Same cache horizon as PR #1's sitemap cache.)

**Why string-replace, not full SSR:** matches the rejected-Next.js conclusion. We want the meta correct in raw HTML; we don't need to render the body server-side.

**What stays client-side:** PR #1's `<Seo>` component still renders during hydration. After hydration, react-helmet-async takes over, so client-side navigation updates the head correctly. Server injection only matters for the *first* request to each URL (which is exactly when crawlers and link-preview bots arrive).

### 2. URL canonicalisation

Three Express middlewares, mounted before everything else in `server.js`:

```js
// Force HTTPS (skip in dev)
// Strip www → non-www (301)
// Strip trailing slash (301; except root "/")
```

Plus emit `<link rel="canonical">` from the SSR head injection (#1 above) — value is `https://hqaviation.com${normalisedPath}`. PR #1's `<Seo>` already emits a canonical link client-side; the SSR version covers crawlers that don't run JS.

**Question to verify during implementation:** is HTTPS already being enforced upstream (CDN / Cloudflare / hosting provider)? If yes, skip the Express HTTPS middleware to avoid double-handling. Cheap to check, expensive to break.

### 3. 301 redirects

Add to `server.js` before any other route handling, ordered most-specific first:

| Old | → | Canonical |
|---|---|---|
| `/home` | → | `/` |
| `/final-ppl` | → | `/training/ppl` |
| `/type-rating` | → | `/training/type-rating` |
| `/aircraft-sales/new/r22` | → | `/aircraft/r22` |
| `/aircraft-sales/new/r44` | → | `/aircraft/r44` |
| `/aircraft-sales/new/r66` | → | `/aircraft/r66` |
| `/aircraft-sales/new/r88` | → | `/aircraft/r88` |

Implement as a static lookup table — these aren't going to grow.

**Interaction with PR #1:** PR #1 used `<link rel="canonical">` instead of redirects to handle the `/aircraft-sales/new/*` duplicates. This PR replaces that approach with hard 301s — stronger signal to search engines, simpler model. The canonical-link approach can stay in `<Seo>` for any other duplicate scenarios.

### 4. `/misc` → `/store` rename

Single-commit, single-direction migration:

- React Router routes: `/misc` → `/store`, `/misc/:id` → `/store/:id`
- Component files: `src/pages/Misc.jsx` → `Store.jsx`, `MiscItemDetail.jsx` → `StoreItemDetail.jsx`. All imports updated.
- Admin routes: `/admin/misc`, `/admin/misc/:id`, `/admin/misc-marketplace` → `/admin/store`, `/admin/store/:id`, `/admin/store-marketplace`. All admin component files renamed accordingly.
- Internal links: every `<Link to="/misc...">` and any string literal pointing to `/misc`.
- Seed script: `scripts/seed-misc-items.js` → `scripts/seed-store-items.js`.
- UI copy: "Misc" → "Store" (or "HQ Store") in nav, headings, button labels.
- 301 redirect added in #3: `/misc → /store`, `/misc/:id → /store/:id`.

**Firestore collection name stays unchanged.** Renaming a Firestore collection requires a data migration (copy docs, dual-write, cut over, delete old) and risks losing in-flight orders. The collection is internal — users never see it. The codebase will reference it by its current name (let's say `miscItems` — to be confirmed during implementation by reading the actual hook). Add a comment at the read/write site noting the URL says "store" but the collection is historical.

### 5. Drop Product schema from `/aircraft/h500`

`/aircraft/h500` is informational — HQ doesn't sell new H500s. Today PR #1 wires Product schema across all `/aircraft/*` pages uniformly. This PR makes the wiring conditional on a `forSaleNew` flag in `seoRoutes.js`; H500 is the only entry where it's `false`. The page still renders normally with sitewide Organization + BreadcrumbList.

### 6. Expanded JSON-LD coverage

PR #1 has builders for: Organization, WebSite, LocalBusiness, Product, Article (BlogPosting), FAQPage, BreadcrumbList.

Add to `src/components/seo/jsonLd.js`:

- `buildCourse(courseData)` — for `/training/ppl`, `/training/type-rating`, `/training/night-rating`, `/training/advanced`, `/training/commercial`. Course schema fields: `name`, `description`, `provider` (HQ Aviation), `educationalCredentialAwarded`, `hasCourseInstance` with `courseMode` and location.
- `buildService(serviceData)` — for `/maintenance`, `/aircraft-consulting`, `/leaseback`, `/self-fly-hire`, `/superyacht-ops`, `/expeditions`. Service schema: `name`, `description`, `provider`, `serviceType`, `areaServed`.
- `buildTouristTrip(tripData)` — for `/helicopter-tour-of-london`. Paired with Product (via `@type: ["Product", "TouristTrip"]`) since the tour is both an experience and a fixed-price purchase.

Expand Product schema usage:
- `/sales/pre-owned/:id` — already gets Product (PR #1). Confirm.
- `/store` and `/store/:id` (post-rename) — Product per item. Read price/image/availability from Firestore.
- `/parts` — Product per item.
- `/training/trial-lessons` (DiscoveryFlight) — Product (one-off experience purchase, not a Course). Note: this changes how this page is treated relative to the rest of `/training/*`.

### 7. Image CLS hygiene

Goal: every `<img>` in the canonical-page render path has explicit `width` + `height` attributes (or `aspect-ratio` CSS).

Approach:
- Audit script (`scripts/audit-img-dimensions.js`) walks `src/pages/` + `src/components/` for `<img>` elements without dimensions. Reports the offenders.
- Fix in source files. For images sourced from CMS/Firestore where the dimensions aren't known at write time, store `width`/`height` in Firestore alongside the URL (one-time backfill script needed for existing data).
- Add a vitest unit test that fails CI if any `<img>` in `src/pages/*.jsx` (excluding experimental/dev pages, identified by the existing `SHOW_DEV_ROUTES` heuristic) lacks dimensions.

**Out of scope here:** image *weight* optimisation (the 40MB facility photos). That's content-audit Sub-project 2 — different exercise, different tools (sharp, etc.).

### 8. Sitemap `<lastmod>` + robots verification

PR #1 already builds dynamic `sitemap.xml`. Two refinements:
- For dynamic entries, derive `<lastmod>` from the Firestore `updatedAt` timestamp (read in the same query that builds the URL). For static entries, use the build/deploy timestamp (capture at server start).
- Verify `robots.txt` allows `User-agent: *` for all canonical AND experimental/transactional paths — i.e., crawlers can *fetch* them. The blocking happens via per-page `<meta name="robots" content="noindex,follow">` (already PR #1's pattern) on experimental/transactional routes. Common mistake we want to avoid: `Disallow: /admin` in robots.txt prevents Google from ever fetching the page, which means Google can't see the `noindex` meta, which means the page can stay indexed indefinitely from external links. Confirm PR #1 doesn't make this mistake; if it does, fix here.

---

## Implementation phasing

One PR. Internally, two commits per deliverable (test + impl) where vitest applies; otherwise one. The 8 deliverables are mostly independent so they can land in any order, but a sensible sequence is:

1. **Foundations:** #2 URL canonicalisation, #3 redirects (cheap, low-risk, makes everything else talk to canonical URLs).
2. **Big rename:** #4 `/misc → /store` (own discrete commit; touches lots of files but mechanical).
3. **Schema work:** #5 H500 conditional, #6 JSON-LD additions (extends PR #1's `jsonLd.js`).
4. **Server-side injection:** #1 (the main architectural piece; depends on #2 for canonical URL string).
5. **Sitemap accuracy:** #8 (`<lastmod>`, robots verification).
6. **Image CLS:** #7 (largest blast radius — touches many components).

---

## Testing

- **Unit:** vitest covers JSON-LD builders (each is a pure function), URL canonicalisation middleware (request → expected redirect or pass), 301 redirect table.
- **Integration:** `curl -I https://hqaviation.com/aircraft/r44` shows correct `<title>` + `<meta description>` + `<link rel="canonical">` + JSON-LD in the raw HTML response (no JS execution). Run against the dev server in CI; against staging post-deploy.
- **Image CLS:** vitest snapshot test that no `<img>` in the canonical-page tree lacks dimensions.
- **Manual:** share a link to `/blog/r44-buyers-guide` on Slack, LinkedIn, Twitter — preview card shows the post's cover image, title, description (the social-scraper test that motivated #1).

---

## Open assumptions (calling out for the record)

- **Canonical URL form:** non-www, no trailing slash, HTTPS. Same as my recommendation today; confirmed.
- **HTTPS enforcement:** assumed not yet handled upstream (Cloudflare etc.). Implementation will check and skip the middleware if it is.
- **Firestore collection for `/store`:** keeps current name (likely `miscItems`). To be verified by reading the relevant hook during implementation.
- **`/training/trial-lessons` as Product not Course:** confirmed today. Discovery flights are one-off experience purchases, not a qualification.
- **Per-page copy:** comes from the existing PR #1 per-page tuning doc (`docs/seo/per-page-tuning.md` v2 — research-grounded, London + HNW commuter belt). This PR does not rewrite copy.
- **Default OG image fallback:** PR #1's `/og-default.png` (R66 hero crop). Dynamic routes use their own (blog cover, listing image, store item image).

---

## Deliverables

1. **Code:** `feat/seo-refinements` PR off `main` (after PR #1 merges).
2. **Updated docs:**
   - `docs/seo/canonical-rules.md` — short reference (one page) for canonical URL form, redirect table, robots strategy.
   - Existing `docs/seo/per-page-tuning.md` — extended only where new schema types affect copy guidance.
3. **Implementation plan** (output of `writing-plans` skill, next step) — broken-down task list with verification steps.

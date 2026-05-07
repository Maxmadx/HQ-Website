# HQ Aviation SEO Audit — Pre-Launch Baseline

**Date:** 2026-04-23
**Auditor:** hand-written initial baseline
**Production domain:** `https://hqaviation.com` (pre-launch)

## How to use this document

This is the **standing audit** the admin SEO tab (Plan 2) will regenerate
after every audit run. The version below is the by-hand baseline, written
once the foundational SEO infrastructure (Tasks 1–14) is in place but
before per-page meta tuning (Tasks 17–21) is applied. Re-read after
Plan 2 ships for the live data-driven version.

## Foundational infrastructure status

| Item | Status | Notes |
|------|--------|-------|
| Per-route `<title>` and `<meta description>` | ✓ infrastructure shipped | Each public page wires `<Seo …>` in Tasks 17–21 |
| Canonical URLs | ✓ shipped | Auto from `window.location.pathname`; manual override supported |
| `robots.txt` | ✓ shipped | `public/robots.txt` |
| `sitemap.xml` | ✓ shipped | Dynamic at `GET /sitemap.xml`, 1 h cache, composes from `seoRoutes.PUBLIC_ROUTES` + Firestore listings + Firestore blog posts |
| Open Graph + Twitter card baseline | ✓ shipped | `index.html` baseline + per-page overrides via `<Seo>` |
| Default OG image (1200×630) | ✓ shipped | `public/og-default.jpg`, R66 hero crop, 233 KB |
| JSON-LD: Organization | ✓ site-wide | Wired in `App.jsx` |
| JSON-LD: WebSite | ✓ site-wide | Wired in `App.jsx` |
| JSON-LD: LocalBusiness | ✓ site-wide | Wired in `App.jsx` |
| JSON-LD: Product (aircraft pages) | ⏳ pending Task 18 | Builder ready (`buildProduct`) |
| JSON-LD: Article (blog posts) | ⏳ pending Task 20 | Builder ready (`buildArticle`) |
| JSON-LD: FAQPage | ⏳ pending Task 19 | Builder ready (`buildFAQPage`) |
| JSON-LD: BreadcrumbList | ⏳ pending Tasks 18–20 | Builder ready (`buildBreadcrumbList`) |
| Dev/test routes hard-gated | ✓ shipped | Bundle dropped 9,144 → 4,093 KB (-55%) |
| Duplicate aircraft URLs canonicalised | ⏳ pending Task 21 | Will set explicit `canonical` on R22/R44/R66/R88 pages |

## Bundle / performance baseline

| Metric | Pre-Task-9 | Post-Task-9 | Change |
|--------|------------|-------------|--------|
| Main JS chunk (raw) | 9,144 KB | 4,093 KB | **-55%** |
| Main JS chunk (gzip) | 1,535 KB | 852 KB | **-44%** |
| Build time | 1.84 s | 1.47 s | -20% |

The remaining chunk size is dominated by Framer Motion + the page components
themselves. Further reduction would require route-based code splitting
(out of scope for Plan 1).

## Site architecture

- **Total public routes (static):** 31 (defined in `src/lib/seoRoutes.js#PUBLIC_ROUTES`)
- **Dynamic templates:** 3 (used aircraft listings, blog posts, misc items)
- **Noindex routes:** 6 (checkout, confirmations, account, internal sitemap)
- **Canonical redirects:** 6 (4 duplicate aircraft URLs + 2 legacy training URLs)
- **Dev/test routes:** 36 (gated to dev mode only)

## Per-page audit (post-launch — populated by Plan 2)

The admin SEO tab will populate the table below per audit run. Until then,
verify by hand by visiting each URL post-Tasks 17–21 and viewing source.

| URL | Title | Description | H1 | Score |
|-----|-------|-------------|----|----|
| / | (post Task 17) | | | |
| /sales/new | (post Task 17) | | | |
| /aircraft/r22 | (post Task 18) | | | |
| /aircraft/r44 | (post Task 18) | | | |
| /aircraft/r66 | (post Task 18) | | | |
| /aircraft/r88 | (post Task 18) | | | |
| /training/ppl | (post Task 19) | | | |
| /training/commercial | (post Task 19) | | | |
| /training/type-rating | (post Task 19) | | | |
| /training/trial-lessons | (post Task 19) | | | |
| /maintenance | (post Task 19) | | | |
| /contact | (post Task 19) | | | |
| /expeditions | (post Task 19) | | | |
| (~18 other public pages) | (post Task 20) | | | |

## Critical issues (live findings — fill in during Task 22)

After Tasks 17–21 ship, walk every public route and record any of:
- Pages with duplicate titles or descriptions across the site
- Pages with multiple `<h1>` or no `<h1>`
- Images missing `alt`
- Word count below 100
- JSON-LD that fails Google's Rich Results Test

## Quick wins to revisit post-launch

These rely on real Google Search Console data, which only accumulates
after the site has been verified in GSC and crawled. Revisit ~4 weeks
after launch.

- Pages currently ranking 4–10 for tracked queries — title/H1 nudges
- Pages with high impressions and low CTR — meta description tuning
- Pages indexed by Google but not in our sitemap, or vice versa

## Related documents

- `docs/seo/per-page-tuning.md` — proposed top-12 page tunings (owner-approval gate before Task 17 page edits begin)
- `docs/seo/setup.md` — one-time setup guide for GSC verification, service account, env vars (will be authored as part of Plan 2)
- `docs/superpowers/specs/2026-04-23-seo-launch-readiness-design.md` — full design spec
- `docs/superpowers/plans/2026-04-23-seo-launch-readiness.md` — Plan 1 implementation plan

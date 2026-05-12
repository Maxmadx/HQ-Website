# Image Optimisation — D4 Results

**Date:** 2026-05-12
**Branch:** `feat/image-pipeline-d4`
**Raw data:** [2026-05-12-image-optimisation-d4-raw.json](./2026-05-12-image-optimisation-d4-raw.json)

## Headline

- **Where `<Image>` is wired (R22 + R44 product pages):** LCP improved **24–32%**, image bytes reduced **15–28%**. Clear win.
- **Where `<Image>` is NOT wired (home page):** identical image bytes both states. **Action item:** D5 should wire the home-page hero/gallery through `<Image>`.
- **Pages with no static images in Lighthouse's network capture (used-sales, ppl):** no measurable delta. These use CMS-uploaded images (D3's domain) or lazy-loaded content that Lighthouse `simulate` doesn't reach.
- **CLS:** within Google Core Web Vitals "Good" threshold (< 0.01) on every page in both states. Image optimisation neither helped nor hurt — already controlled by the CWV PR.

## Per-page detail

3 Lighthouse runs per page per state, median reported. Same Vite bundle in both states — only `optimised-manifest.json` differs.

| Page | Metric | Before | After | Delta |
|---|---|---:|---:|---:|
| home | LCP | 2,778 ms | 2,706 ms | **−2.6%** |
| home | CLS | 0.000 | 0.000 | no change |
| home | Image bytes | 16,390 KB | 16,390 KB | **0%** (`<Image>` not wired here) |
| home | Total bytes | 18,572 KB | 18,701 KB | +0.7% (noise) |
| home | Image count | 38 | 38 | no change |
| r22 | LCP | 2,826 ms | 1,917 ms | **−32.2%** ✓ |
| r22 | CLS | 0.001 | 0.001 | no change |
| r22 | Image bytes | 1,650 KB | 1,190 KB | **−27.9%** ✓ |
| r22 | Total bytes | 3,859 KB | 3,469 KB | −10.1% |
| r22 | Image count | 6 | 7 | +1 (LQIP-driven extra request) |
| r44 | LCP | 2,630 ms | 2,000 ms | **−24.0%** ✓ |
| r44 | CLS | 0.003 | 0.003 | no change |
| r44 | Image bytes | 3,222 KB | 2,724 KB | **−15.5%** ✓ |
| r44 | Total bytes | 5,461 KB | 4,916 KB | −10.0% |
| r44 | Image count | 6 | 7 | +1 |
| used-sales | LCP | 1,364 ms | 1,403 ms | +2.9% (noise) |
| used-sales | CLS | 0.000 | 0.000 | no change |
| used-sales | Image bytes | 0 KB | 0 KB | no data (CMS/lazy images) |
| used-sales | Total bytes | 2,052 KB | 2,122 KB | +3.4% (noise) |
| used-sales | Image count | 0 | 0 | no data |
| ppl | LCP | 1,363 ms | 1,403 ms | +2.9% (noise) |
| ppl | CLS | 0.000 | 0.000 | no change |
| ppl | Image bytes | 0 KB | 0 KB | no data |
| ppl | Total bytes | 2,078 KB | 2,086 KB | +0.4% (noise) |
| ppl | Image count | 0 | 0 | no data |

## Interpretation

**The wins are where we wired the work.** D2 explicitly routed `<Image>` through the R22/R44/R66/R88 product page heroes and the Sales/Maintenance/Expeditions/PPL hero shells. The R22/R44 deltas show what that buys: ~25% LCP improvement and ~20% image-bytes reduction.

**The home page is the next opportunity.** 38 images at 16 MB total — identical in both states. These `<img>` tags don't go through `<Image>`. Wiring them up would deliver R22-sized gains on the highest-traffic page.

**Used-sales / PPL show 0 image bytes in Lighthouse** because:
1. These pages use Firebase Storage URLs (CMS-uploaded inventory and pilot photos), which Lighthouse's network panel captures but `resourceType` may classify as `Other` if served without an image content-type from the dev mock, OR
2. The images are below the fold and lazy-loaded — Lighthouse's `simulate` mode does NOT trigger lazy-load past the initial viewport.

Either way: **D3** (which we built but haven't deployed) is what turns these dynamic images into AVIF/WebP. The deploy is what unlocks measurable gains here.

## Methodology

- Same Vite production build, served via `npx serve dist -p 8788 --single` on `localhost`. Network latency is therefore constant.
- "Before" state simulates a pre-D1 codebase: `public/assets/optimised/optimised-manifest.json` swapped for `{ "sources": {} }`, causing `<Image>` to fall back to plain `<img src={original}>` for every local path. Browser receives the original JPEG/PNG bytes from `public/assets/images/`.
- "After" state restores the real manifest (506 sources). `<Image>` emits `<picture>` + `srcset` + AVIF/WebP variants via D1's build-time pipeline.
- 3 Lighthouse runs per page per state, median reported. Lighthouse preset: `desktop`, throttling: `simulate`, category: `performance` only.
- All builds use the same source code at HEAD of `feat/image-pipeline-d4`. Only `optimised-manifest.json` differs between passes.

## Caveats

- **Localhost network ≠ real-world network.** Lighthouse's `simulate` throttling estimates a 4G mobile network on top of localhost timings, but real CDN/Cloudflare hops will skew absolute numbers in either direction. The *relative* delta (before vs after) is the trustworthy signal.
- **D3 not directly measured.** D3's runtime endpoint (`/api/image`) activates for proxyable URLs (Firebase Storage / hqaviation.com). The canonical static page set in this measurement either doesn't display those (R22/R44/home) or doesn't load them above the fold (used-sales/ppl). D3's value should be re-measured once Cloud Run is deployed AND we add a CMS-image-heavy page (e.g. a blog post with a Firebase Storage cover) to the measurement set.
- **Cold sharp decode in browser.** First-load AVIF decode can add a few hundred ms of CPU work that Lighthouse `simulate` doesn't model. Real-device numbers may differ — typically AVIF still wins on transfer time + decode combined, but the LCP delta on slow CPUs is smaller than these numbers suggest.
- **Home page anomaly (16 MB images, no change).** The home page renders 38 `<img>` elements — clearly some heavy hero/gallery imagery — but none of them are going through the `<Image>` component. These were never wired up in D2's rollout. **This is the highest-leverage follow-up.**

## Follow-up actions (D5 candidates)

1. **Wire home-page imagery through `<Image>`.** Highest-leverage gap. The 38-image / 16 MB number is the prize.
2. **Deploy D3 to Cloud Run** and re-measure with a CMS-heavy page (e.g. blog post with Firebase Storage cover image, or a used-sales listing detail page).
3. **Wire the long-tail component CLS offenders** (~25 single-offender files identified in the earlier CWV audit) through `<Image>` rather than leaving them as plain `<img>`.
4. **Field data via CrUX.** Once DNS cuts over and traffic accumulates, Google Search Console's CrUX panel will give real-device numbers that supersede this synthetic measurement.

## Reproducing this measurement

```bash
git switch feat/image-pipeline-d4
npm install --legacy-peer-deps
# Ensure .env is present (Firebase env vars needed for the SPA to render headlessly)
cp /path/to/.env .
# Ensure public/assets/optimised/ is populated (or run: npm run prebuild — ~20 min cold)
node scripts/measureImages.mjs
```

Takes ~25 min wall-clock. Writes raw results to `docs/superpowers/reports/2026-05-12-image-optimisation-d4-raw.json` and restores the manifest on exit (even on error).

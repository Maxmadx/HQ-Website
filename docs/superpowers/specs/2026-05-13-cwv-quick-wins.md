# Core Web Vitals — quick wins (Phase 6 starter)

**Status:** ready to implement (4 changes, all additive)
**Date:** 2026-05-13
**Estimated effort:** 4-6 hr (split across 4 small PRs)
**Why now:** Production bundle is **985 KB gzipped** in a single chunk (`dist/assets/index-DGP2WrLt.js` ≈ 4.5 MB raw). Vite explicitly warns about this on every build. Google Core Web Vitals (LCP, INP, CLS) will all suffer on mobile 4G — and CWV directly affects search ranking.

## Current baseline

```
dist/assets/index-DGP2WrLt.js   4,526.65 kB │ gzip: 985.73 kB
```

Plus ~50 small per-route chunks (already code-split by Vite's default route-level splitting) of 5-30 KB each.

**The problem:** the main chunk loads every page's CSS / shared components / framer-motion / firebase / react / route definitions. The per-route chunks help, but the initial paint blocks on the 985 KB main bundle.

## Wins to ship (priority order)

### Win 1 — Migrate route imports to `React.lazy()` (2 hr, biggest impact)

`src/App.jsx` currently uses ~120 static `import` statements for page components. Vite already code-splits these at build (each page becomes its own chunk), but they're still tied to the main bundle via the static import graph.

Migrate the bulkiest routes to `React.lazy()`:

```diff
- import DiscoveryFlight from './pages/DiscoveryFlight';
+ const DiscoveryFlight = React.lazy(() => import('./pages/DiscoveryFlight'));
```

Wrap `<Routes>` in `<Suspense fallback={<RouteLoader />}>`. Build a minimal `RouteLoader` component (full-viewport skeleton, no animations to keep CLS clean).

**Bulkiest candidates** (run `grep -E "^import [A-Z]" src/App.jsx | wc -l` to confirm 120+; pick the 20 heaviest):
- All `WallOfCool*` variations (8 files)
- `Experimentation.jsx` (it's the homepage route — keep eager OR add `<link rel="prefetch">` hint)
- All `*Picker.jsx` (dev/test pages — could be hard-gated by `import.meta.env.DEV` AND lazy)
- `Checkout`, `BookingConfirmed`, `LondonTour*` (low-frequency commerce flows)
- All admin pages — hard-gate by AdminRoute and lazy

**Expected impact:** main bundle drops to 300-400 KB gzip. Each route's first-paint cost = main chunk + that route's chunk.

### Win 2 — `manualChunks` in vite.config.js (1 hr)

Group dependencies into stable vendor chunks so they cache across deploys:

```js
// vite.config.js
build: {
  rollupOptions: {
    output: {
      manualChunks: {
        'react': ['react', 'react-dom', 'react-router-dom'],
        'framer': ['framer-motion'],
        'firebase': ['firebase/app', 'firebase/firestore', 'firebase/auth', 'firebase/storage'],
        'maps': ['react-simple-maps', 'd3-scale', 'world-atlas'],
        'stripe': ['@stripe/stripe-js', '@stripe/react-stripe-js'],
      },
    },
  },
}
```

**Expected impact:** repeat-visitors get firebase/framer/react from cache across deploys (only the changed chunk is re-downloaded). First-visit cost is the same; return-visit is dramatically faster.

### Win 3 — Preload LCP image per route (1 hr)

The current Seo component injects `<link rel="canonical">` and JSON-LD via Helmet but doesn't preload the LCP image. Each route knows its hero image (often passed to `Seo ogImage="..."` already).

Augment `<Seo>` to take an optional `lcpImage` prop and emit:

```jsx
{lcpImage && <link rel="preload" as="image" href={absoluteUrl(lcpImage)} fetchpriority="high" />}
```

Wire `lcpImage` on the 5 highest-traffic pages first:
- `/` (homepage hero)
- `/training/trial-lessons` (R66 hero)
- `/aircraft/r44` (R44 hero)
- `/aircraft/r66` (R66 hero)
- `/sales/pre-owned` (likely first listing image)

**Expected impact:** LCP drops 200-500 ms on routes where the hero is below the viewport (HTML parses first, then image starts loading in parallel with main JS instead of after).

### Win 4 — Baseline measurement (30 min) — do this FIRST

Before any of the above, capture current PageSpeed Insights scores so wins are measurable:

```bash
# Mobile + desktop, 5 pages, save to docs/perf/
for url in / /training/trial-lessons /aircraft/r44 /aircraft/r66 /sales/pre-owned; do
  curl -s "https://www.googleapis.com/pagespeedonline/v5/runPagespeed?url=https://hqaviation.com${url}&strategy=mobile&category=performance&category=seo" \
    > "docs/perf/baseline-2026-05-13-mobile-$(echo $url | tr / _).json"
done
```

Document the key metrics in `docs/perf/baseline-2026-05-13.md`:
- LCP, INP, CLS per page (mobile + desktop)
- Performance score
- SEO score
- Total Blocking Time
- Render-blocking resource count

Re-run after each win and diff. Helps argue ROI of each change.

## Acceptance criteria

After all 4 wins:
- [ ] Main bundle gzipped < **500 KB**
- [ ] Mobile LCP < **2.5s** on `/`, `/training/trial-lessons`, `/aircraft/r66`
- [ ] CLS < **0.1** on all canonical routes (existing CLS work is mostly done — re-verify)
- [ ] INP < **200ms** on interactive elements (Stripe checkout, contact form)
- [ ] No regression in functional test suite (50+ test files, 450+ tests)
- [ ] Lighthouse SEO score ≥ **95** on `/` (currently around 80-85 per pre-cutover audit)

## Lighthouse CI in GitHub Actions (follow-up)

After the wins land, add `lhci autorun` to the GitHub Actions PR check:

```yaml
# .github/workflows/lighthouse.yml
- name: Lighthouse CI
  run: |
    npm install -g @lhci/cli
    lhci autorun --collect.url=https://hqaviation.com/ \
                 --collect.url=https://hqaviation.com/training/trial-lessons \
                 --assert.preset=lighthouse:no-pwa
```

Catches future regressions before they ship. Out of scope for this spec; add as a separate PR.

## Order of execution (recommended)

1. Win 4 (baseline) — 30 min
2. Win 2 (manualChunks) — 1 hr — measure
3. Win 1 (React.lazy) — 2 hr — measure
4. Win 3 (LCP preload) — 1 hr — measure
5. Re-baseline + diff → write retrospective in `docs/perf/2026-05-13-cwv-results.md`

Each win is independently mergeable. Land one, measure, decide if next still has ROI before doing it.

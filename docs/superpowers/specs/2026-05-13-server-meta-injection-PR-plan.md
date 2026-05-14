# Spec #18 — Server meta injection re-arch — concrete PR plan

**Status:** ready to implement (companion to `docs/superpowers/specs/2026-05-12-server-meta-injection-rearch.md`)
**Date:** 2026-05-13
**Estimated effort:** 4 dev-days (split across 3 PRs)

The parent spec covers WHAT and WHY. This is the WHEN/HOW — the concrete PR sequence a dev can pick up and execute without re-deriving design decisions.

## Why this unblocks everything

Right now Firebase Hosting's catch-all rewrite (`** → /index.html`) bypasses Cloud Run, so the `seoMetaInjection` middleware never runs. The SPA shell hits crawlers with `<title>HQ Aviation</title>` and no per-route meta. Once this re-arch lands:

- Per-page schema (Captain Q `Person`, Course, FAQPage, Service) has live impact
- Soft-404s return real 404s for unknown paths
- Lighthouse SEO scores climb (per-route meta = first-paint signal)
- Social link previews work correctly site-wide

## Sequencing — 3 PRs

### PR 1 — Foundations (1.5 days, no behaviour change)

Goal: build the pieces server-side meta injection needs, without changing routing yet. Everything additive; can ship and sit dormant.

**Files:**

1. **NEW `api/spaRouteMatcher.js` (CJS)** — mirrors `seoRoutes.js#PUBLIC_ROUTES + DYNAMIC_ROUTE_TEMPLATES` for use in the catch-all SPA handler. Function signature:
   ```js
   module.exports = {
     isKnownStaticRoute(path),           // -> boolean
     resolveDynamicRoute(path),          // -> { collection, id } | null
   };
   ```
   Same dual-CJS-ESM concern as `getMetaForPath.js`. Add a fixture-shared test (`api/spaRouteMatcher.test.js`) that loads both `seoRoutes.js` (ESM) and this file (CJS) and asserts the route sets match.

2. **NEW `api/jsonLdBuilders.js` (CJS)** — server-side mirror of `src/components/seo/jsonLd.js` (Organization, WebSite, LocalBusiness, BreadcrumbList, Product, Article, FAQPage, Course, Service, ItemList, TouristTrip). Same fixture-shared test pattern to keep the two in sync.

3. **MODIFY `api/seoMetaInjection.js`** — relax the fail-soft early-return. The current code returns `next()` if `index.html` can't be read; under the new arch, `index.html` is always present, so failing to read it should be a hard error (and tested). Add JSON-LD injection support — read meta from `getMetaForStaticPath`, generate JSON-LD via the new `api/jsonLdBuilders.js`, append to the head block.

4. **NEW `api/spaHandler.js`** — the actual catch-all handler, but **NOT YET MOUNTED**:
   ```js
   // Mounted by server.js after all /api/* routes. Catches anything else
   // and serves dist/index.html with meta injection, or 404s on unknown.
   const fs = require('fs');
   const path = require('path');
   const { isKnownStaticRoute, resolveDynamicRoute } = require('./spaRouteMatcher');
   const seoMetaInjection = require('./seoMetaInjection');

   function spaHandler({ distDir, getMetaForStaticPath, getMetaForDynamicPath }) {
     const indexHtmlPath = path.join(distDir, 'index.html');
     const injector = seoMetaInjection({ indexHtmlPath, getMetaForStaticPath, getMetaForDynamicPath });

     return async function(req, res, next) {
       // Skip /api, /sitemap.xml, asset paths
       if (req.path.startsWith('/api/') || req.path === '/sitemap.xml') return next();
       if (req.path.includes('.')) return next();  // .css, .js, .png etc.

       const isKnown = isKnownStaticRoute(req.path);
       const dyn = isKnown ? null : await resolveDynamicRoute(req.path);

       if (!isKnown && !dyn) {
         // SOFT 404 FIX — return real 404 with the SPA shell so React renders NotFound
         res.status(404);
       }

       return injector(req, res, next);
     };
   }

   module.exports = spaHandler;
   ```

5. **MODIFY `Dockerfile`** — `COPY dist/ ./dist/` at the appropriate stage. Verify locally:
   ```bash
   docker build -t test . && docker run --rm test ls /app/dist/ | head
   ```

**Acceptance:** all new code is in place, all new tests pass, but production behaviour is unchanged because `spaHandler.js` is not yet mounted in `server.js`.

---

### PR 2 — Wire the handler + atomic deploy choreography (1 day)

Goal: turn the new infrastructure on.

**Files:**

1. **MODIFY `server.js`** — mount the catch-all handler AFTER all `/api/*` routes and AFTER `/sitemap.xml`:
   ```js
   const spaHandler = require('./api/spaHandler');
   // ... after other route registrations:
   app.use(spaHandler({
     distDir: path.join(__dirname, 'dist'),
     getMetaForStaticPath: getMetaForPath,
     getMetaForDynamicPath: async (reqPath) => { /* Firestore lookup for /blog/:id etc. */ },
   }));
   ```

2. **MODIFY `firebase.json`** — change the catch-all rewrite from `destination: /index.html` to Cloud Run:
   ```json
   {
     "source": "**",
     "run": { "serviceId": "hq-aviation-server", "region": "europe-west2" }
   }
   ```
   Asset paths (anything matching `.css`/`.js`/`.png`/`.jpg`/`.svg` etc.) are matched as static files BEFORE rewrite eval, so they keep the Hosting CDN fast path.

3. **MODIFY `package.json#scripts.deploy:server`** — must `npm run build` BEFORE the docker build so the `dist/` copied into the container matches what Hosting will serve. Add a combined deploy script:
   ```json
   "deploy:all": "npm run build && firebase deploy --only hosting && npm run deploy:server"
   ```
   This is the choreography that keeps Hosting CDN's dist + Cloud Run container's dist in sync. **Never run them out of order** — Cloud Run will serve a SPA shell referencing a different JS bundle hash than Hosting has.

**Acceptance:**
- `curl https://hqaviation.com/aircraft/r22 | grep '<title>'` returns the R22-specific title, NOT the default fallback
- `curl https://hqaviation.com/this-path-does-not-exist -o /dev/null -w '%{http_code}'` returns `404`
- Facebook Sharing Debugger (https://developers.facebook.com/tools/debug/) shows correct og:title + og:image + og:description on `/`, `/aircraft/r44`, `/training/trial-lessons`
- No regression on existing test suite

### PR 3 — Polish + soak (1 day)

1. **Cache strategy tuning** — Cloud Run sets `Cache-Control: public, max-age=60` on injected HTML. Verify Hosting CDN respects it. Measure cache hit rate via Firebase Hosting logs. Tune up if needed.

2. **Latency baseline** — measure p50/p95 SPA route latency before/after. Spec says "+50-200ms typical, max 1s cold start." Confirm. If p95 > 500ms warm, investigate Cloud Run min-instances + concurrency settings.

3. **Soft-404 audit** — crawl every URL in `sitemap.xml` and assert 200. Crawl a list of plausibly-typoed URLs and assert 404. Document in `docs/perf/2026-05-13-spa-handler-soak.md`.

4. **Rollback drill** — practice reverting `firebase.json` rewrite back to `destination: /index.html`. Time it. Document in a runbook entry. This is the safety net per the parent spec.

## Risks & mitigations

| Risk | Mitigation |
|---|---|
| Cloud Run cold start adds 1-3s on rare requests | Set Cloud Run `min-instances: 1` for the SPA-serving service. ~£5-10/month. |
| `dist/` in container diverges from `dist/` on Hosting | Atomic deploy script (PR 2 item 3). Pre-deploy diff check (assert SHA of `dist/index.html` matches between local + container). |
| `getMetaForDynamicPath` Firestore reads add latency on `/blog/*` etc. | Add 60s in-memory cache (already exists in `seoMetaInjection.js` via `seoMetaCache`). |
| Container `dist/` gets stale (forget to `npm run build` before docker build) | The `deploy:all` script chains everything. Document loudly in CONTRIBUTING. |

## Out-of-scope explicitly

- Full SSR (rendering React tree server-side) — spec parent rejects, too expensive
- Edge Workers / Cloudflare migration — spec parent rejects, infra complexity
- Build-time SSG / prerender — spec parent rejects (and the prerender.mjs attempt earlier in May was reverted for that reason)

## What ships next AFTER this lands

This unblocks the Phase 4 schema deepening work that's been queued:
- Captain Q `Person` schema on `/about-us/captain-q`
- `FAQPage` on every page with a visible FAQ
- `Service` on `/maintenance`, `/aircraft-consulting`, `/superyacht-ops`, `/pilot-provisioning`
- Enriched `Product + AggregateOffer` on `/sales/new` and per-listing on `/sales/pre-owned/*`
- Global `BreadcrumbList` on every depth-2+ route

Each is a 1-2 hr PR. Sequence them in order of commercial intent (aircraft/training first).

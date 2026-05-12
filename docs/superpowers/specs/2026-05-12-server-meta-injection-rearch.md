# Server Meta Injection Re-architecture — Spec

**Status:** draft
**Date:** 2026-05-12
**Implementation plan:** TBD

## Problem

Per-route SEO meta tags (title, description, og:*, twitter:*, JSON-LD) are currently injected client-side via `react-helmet-async` after the SPA bundle loads. Server-side meta injection exists (`api/seoMetaInjection.js`) but only fires for requests that hit Cloud Run — i.e. `/api/**` and `/sitemap.xml`.

The Firebase Hosting catch-all rewrite `** → /index.html` serves the SPA shell directly from Hosting CDN, **bypassing Cloud Run entirely**. So when Googlebot fetches `https://hqaviation.com/aircraft/r22`, it receives the raw `index.html` shell with the default `<title>HQ Aviation</title>` and no per-route meta. Googlebot does execute JS and pick up Helmet's runtime meta, but:

1. First-render meta tags are what social-media crawlers (Facebook, Twitter, LinkedIn) use — they don't execute JS. So Open Graph previews are broken site-wide.
2. Google's render queue can delay JS-executed meta by days, hurting fresh-content indexing.
3. Lighthouse SEO score penalises pages without server-rendered meta.

## Goals

Inject per-route meta into the HTML response body BEFORE it reaches the client, regardless of whether the request was served via Cloud Run or Hosting CDN.

## Non-goals

- Full SSR (server-rendered React component tree). Out of scope; too expensive for current scale.
- Per-route static prebuilding (SSG). Considered but adds build complexity.
- Edge worker SSR. Cloudflare Workers / Firebase Functions adds infra complexity.

## Proposed solution

### Approach: route ALL non-asset requests through Cloud Run

Change `firebase.json` rewrites:

```json
"rewrites": [
  { "source": "/api/**", "run": { "serviceId": "hq-aviation-server", "region": "europe-west2" } },
  { "source": "/sitemap.xml", "run": { ... } },
  { "source": "/admin/**", "destination": "/admin/index.html" },
  { "source": "**", "run": { "serviceId": "hq-aviation-server", "region": "europe-west2" } }
]
```

Static assets (CSS, JS, images, fonts) still match Hosting CDN BEFORE rewrite eval, so they keep their fast path. Only SPA route paths fall through to Cloud Run.

### Server-side handling

Cloud Run `server.js` gets a catch-all SPA handler:

1. Read `dist/index.html` from container disk (Dockerfile must `COPY dist/ ./dist/` — currently it doesn't)
2. Compute meta for `req.path` via the existing `getMetaForPath` (made CJS-accessible)
3. Inject `<title>`, `<meta name="description">`, og:*, twitter:*, JSON-LD into the `<head>` (replace the `<!--SSR_HEAD-->` placeholder already in index.html)
4. Set HTTP status: 200 if path matches a known route, **404 if not** — solves spec deferred soft-404 problem too
5. Send response

### Performance impact

- Each SPA page load: +50-200ms latency (Cloud Run cold start max ~1s, warm <100ms)
- Hosting CDN no longer caches the HTML response. Mitigated by `Cache-Control: public, max-age=60` from Cloud Run → Hosting CDN caches at edge anyway.
- Cost: more Cloud Run invocations. At ~10k pageviews/day, est. £5-10/month additional Cloud Run cost.

### Soft 404 bonus

This re-arch automatically delivers spec-deferred soft-404 fix: unknown paths return HTTP 404 from server.js. Closes the SEO gap that `noindex` only partially mitigated.

## Files (new / modified)

| Path | Action | Why |
|---|---|---|
| `firebase.json` | Modify | Add `**` Cloud Run rewrite |
| `Dockerfile` | Modify | `COPY dist/ ./dist/` after build stage |
| `server.js` | Modify | Catch-all SPA handler with meta injection + 404 |
| `api/seoMetaInjection.js` | Modify | Lift current logic into the catch-all path |
| `api/spaRouteMatcher.js` | New (CJS) | Mirrors `seoRoutes.js#STATIC_ROUTES + DYNAMIC_ROUTE_TEMPLATES` for known-route check |
| `package.json` deploy:server | Modify | Run `npm run build` BEFORE docker build so `dist/` is fresh |

## Architecture

```
Browser → hqaviation.com/aircraft/r22
       ↓
Firebase Hosting
   ├─ Static asset match (e.g. /assets/index-xxx.js) → serve from CDN
   └─ No match → rewrite to Cloud Run
                        ↓
                Cloud Run: hq-aviation-server
                   ├─ /api/* → existing handlers
                   └─ /** SPA handler:
                         1. Read dist/index.html
                         2. getMetaForPath(req.path)
                         3. Inject meta + JSON-LD into <head>
                         4. Status 200 (known) | 404 (unknown)
                         5. Send HTML
```

## Open questions

1. **Dist freshness.** Container ships with dist baked in at image build time. Hosting deploy ships dist to CDN. If they go out of sync (deploys happen at different times), the SPA bundle hash referenced in Cloud Run's index.html may not match what Hosting serves. **Recommend:** combined deploy script that builds dist once, deploys Hosting + builds container + deploys Cloud Run as one atomic step.
2. **Edge cache invalidation.** Cloud Run sets `Cache-Control: max-age=60`. Hosting CDN respects it. After admin changes meta (via spec #15), there's a 60s lag. **Acceptable.**
3. **JSON-LD injection.** Currently built dynamically via React components. Server-side equivalent needs a CJS-friendly builder. **Recommend:** mirror `src/components/seo/jsonLd.js` builders into `api/jsonLdBuilders.js` (CJS), keep both files in sync via shared types / fixture tests.
4. **Backward compat.** `api/seoMetaInjection.js` was originally added to fail-soft when index.html was missing. With this rearch, index.html is always present. Fail-soft can be relaxed back to hard error.

## Acceptance criteria

- [ ] `curl https://hqaviation.com/aircraft/r22 | grep '<title>'` returns the R22-specific title, NOT the default fallback
- [ ] Facebook Sharing Debugger shows correct OG image + title + description
- [ ] Lighthouse SEO score = 100 on all canonical pages
- [ ] `curl https://hqaviation.com/this-doesnt-exist` returns HTTP 404 (soft 404 fix)
- [ ] No regression on existing 757-test suite
- [ ] LCP / total page weight regression <5% (Cloud Run latency)

## Effort

- Implementation: 2-3 days
- Testing (esp. ensuring dist + container stay in sync): 1 day
- Deploy choreography + smoke: 0.5 day
- **Total: ~4 days**

## Sequencing

- Should land BEFORE Spec #15 (admin dashboard) — the dashboard's overrides are most useful when SSR-injected. If admin dashboard ships first, its edits only affect runtime Helmet (no first-paint benefit).
- Spec #17 (alt-text / content audit) can ship in parallel.

## Rollback plan

If Cloud Run latency becomes a problem post-launch:
1. Revert firebase.json `**` rewrite back to `destination: /index.html`
2. Hosting CDN serves static shell again
3. Helmet still injects runtime meta as before
4. Soft 404 reverts to noindex-only

Single-file revert. Low blast radius.

# Infrastructure Decisions

> Locked-in choices that the site-hardening roadmap (§4 Phase 0 → §7 Phase 3)
> depends on. Each row: chosen option, alternatives considered, why we chose,
> who decided, when. If a decision changes, edit in place and add a
> "Revised YYYY-MM-DD: …" line — don't replace history.
>
> Updated 2026-05-12.

## 1. Error reporting

**Chosen:** Sentry (`@sentry/node` v10.52.0 for Express, `@sentry/react` v10.52.0 for the SPA), free tier to start; upgrade to Team plan if monthly events exceed the free quota.

**Alternatives considered:**
- **GCP Cloud Error Reporting** — free, auto-aggregates Cloud Run stdout errors. Rejected: weak DX, no sourcemap upload story for the React bundle, no React-component-error capture.
- **Datadog APM** — too expensive for current scale.

**Why:** Sourcemap upload (for unminifying the React stack traces), React Error Boundary integration, release tagging via `git rev-parse HEAD` injected at build, alerting + Slack/email out of the box.

**Decided:** Max Smith, 2026-05-12.

## 2. Staging environment

**Chosen:** Dedicated Firebase project `hq-aviation-staging` with:
- Its own Firestore database
- Its own Firebase Auth tenant
- Its own Cloud Run service `hq-aviation-server-staging` in `europe-west2`
- Stripe **test mode** API key + a distinct webhook endpoint pointed at the staging Cloud Run URL
- DNS: `staging.<production-domain>` (subdomain decided when prod domain is locked)
- Secrets in Google Secret Manager scoped to the staging GCP project

**Alternatives considered:**
- **Single Firebase project, collection-namespaced data** (e.g. `staging_bookings` vs `bookings`) — rejected: Firestore rules cannot scope by collection-prefix safely; one bad ruleset leaks staging into prod.
- **No staging API, frontend-only previews on Firebase Hosting** — current state; rejected as the root cause of "API changes get tested against production Firestore."

**Why:** Real test coverage of payment flows, webhooks, and Firestore rules without risking production data; clean Lighthouse baselines without ad-blocker / CDN-cache interference; the cost (~$5–$20/mo) is dwarfed by one prevented data-corruption incident.

**Decided:** Max Smith, 2026-05-12.

## 3. Typecheck strategy

**Chosen:** Stay on `.jsx`. Add `tsconfig.json` with `"checkJs": true` and `"allowJs": true`; gate CI on `tsc --noEmit`. Annotate types via JSDoc as files are touched (no big-bang migration).

**Alternatives considered:**
- **Full TypeScript migration** — rejected: estimated 2–4 engineer-weeks of code churn for marginal current benefit; large files (`Experimentation.jsx` 17 919 LoC) make the migration risky.
- **No typecheck** — rejected: current state, allows obvious type bugs to merge.

**Why:** Catches the highest-value class of bugs (wrong call signatures, missing properties) at near-zero migration cost. Files touched by later phases will accrue JSDoc types organically.

**Decided:** Max Smith, 2026-05-12.

## 4. Legacy `/images/` directory cleanup

**Chosen:** `git rm -r images/` on `main` in a single commit during Phase 3. **No** `git filter-repo` / history rewrite.

**Alternatives considered:**
- **Rewrite git history with `git filter-repo`** — reclaims ~90 MB from every clone retroactively. Rejected: invalidates every open branch (notably the 100-commit `feat/plan-c-r22-r44-upgrade`), every fork, every existing checkout; breaks PR review comments that anchor to old SHAs.
- **Leave in place** — rejected; the audit flagged it.

**Why:** Pay the 90 MB clone tax once on `main` going forward, never break anyone's local state. Cost of the history rewrite is higher than the recurring clone cost.

**Pre-deletion verification (required before the delete commit):**
```
grep -rE "/images/" src/ public/ server.js api/ index.html | grep -v node_modules
```
Any hit must be resolved (file moved to `public/assets/` or reference updated) before deletion.

**Decided:** Max Smith, 2026-05-12.

## 5. Node target

**Chosen:** `package.json` `"engines": { "node": ">=20.0.0" }`. Dockerfile pinned to `node:20-slim` (already in use per audit).

**Alternatives considered:**
- **Node 22** — too new for some transitive deps; revisit in late 2026.
- **Keep `>=14`** — rejected; EOL 2023.

**Why:** Cloud Run already runs 20; the package.json claim is the misleading thing.

**Decided:** Max Smith, 2026-05-12.

## 6. CSP policy template

**Chosen:** report-only initially (one week), then enforce. The directive set, authored here so Phase 1 just installs:

```
Content-Security-Policy:
  default-src 'self';
  script-src 'self' https://js.stripe.com https://www.googletagmanager.com;
  connect-src 'self' https://api.stripe.com https://*.googleapis.com https://*.firebaseio.com https://o*.ingest.sentry.io;
  frame-src 'self' https://js.stripe.com https://hooks.stripe.com;
  img-src 'self' data: https:;
  style-src 'self' 'unsafe-inline' https://fonts.googleapis.com;
  font-src 'self' https://fonts.gstatic.com data:;
  object-src 'none';
  base-uri 'self';
  form-action 'self';
  frame-ancestors 'self';
  upgrade-insecure-requests
```

**HSTS:** `Strict-Transport-Security: max-age=31536000; includeSubDomains; preload`.

**Alternatives considered:**
- **`'unsafe-inline'` in `script-src`** — rejected for production; only allowed in `style-src` because the React bundle inlines emotion-style critical CSS.
- **Nonce-based CSP** — overkill at current scale; revisit if the script-src list grows.

**Why:** `'self'` baseline blocks the long tail of injected-script attacks. Stripe / Firebase / Sentry are the only required third-party origins, all explicitly listed. Google Fonts is the one remaining external font origin.

**Decided:** Max Smith, 2026-05-12.

## 7. Release tagging

**Chosen:** Inject `process.env.GIT_REV = git rev-parse --short HEAD` at Docker build time (Dockerfile `ARG GIT_REV` + `ENV`). Server reads it on boot; Sentry uses it as the `release` field; logs prefix every line with it.

**Why:** Without release tags, every bug is "happened sometime". With tags, error reports point to a 6-character commit SHA.

**Decided:** Max Smith, 2026-05-12.

## Revisions

_None yet._

# HQ Aviation — Pre-production hardening & codebase-health roadmap

**Date:** 2026-05-12
**Status:** Draft — awaiting user review
**Author:** Claude (Opus 4.7) + Max Smith
**Type:** Roadmap spec (multi-phase). Each phase is implemented through its own `writing-plans` cycle.

---

## 1. Context

The HQ Aviation site is a React 19 + Vite SPA fronted by an Express server (`server.js`, ~21 KB) and deployed to Google Cloud Run with Firebase Hosting in front. It handles real revenue (Stripe checkout for discovery flights, apparel, misc marketplace), captures real leads (Firestore), runs an admin panel, an analytics surface, and is mid-flight on an image-optimisation pipeline (D0–D3 shipped; D4 measurement queued).

A four-pass audit (frontend / backend-security / testing-CI-deploy / plans-and-debt) on 2026-05-12 surfaced enough work to fill 6+ months. This roadmap commits to two strategic slices and leaves the third (conversion / revenue features) as out-of-scope follow-on.

The audit report itself is preserved in the assistant's session context that produced this spec; the discrete findings are summarised in **§8 References**.

## 2. Goals

By the end of the roadmap, the site:

1. **Will not embarrass the business if a customer hits a bug** — webhook failures, payment errors, and form submissions surface in monitoring; nothing dies silently.
2. **Survives being put in front of real ad-driven traffic** — bundle size, CLS, LCP, and CSP are within Lighthouse-green territory on the home + discovery-flight + R66 routes.
3. **Can be edited by a future engineer (or future Claude) without ten-thousand-line files getting in the way** — the megafiles are decomposed; dead artefacts are gone; the docs match reality.
4. **Has merge gates that catch regressions** — `npm test`, lint, and (per Phase 0 decision) typecheck run on every PR and block on failure.

## 3. Non-goals

These are deliberately excluded so the roadmap stays buildable. Each is a known follow-on, tracked but unscheduled here.

- **R22 → R44 upgrade upsell** — `feat/plan-c-r22-r44-upgrade` has 100 unmerged commits, last touched 2026-05-12. Merge-or-kill decision happens **before** Phase 2 starts (it touches checkout-confirmed code that Phase 2 will be editing). Whichever choice, it's not implemented here.
- **Aircraft Sales enquiry / quote CTA** — the highest-margin product (`AircraftSales.jsx`) has no captured-lead funnel. Real conversion gap; needs its own brainstorming + spec cycle.
- **Analytics-funnel rebuild** — five abandoned plans (Apr 29 – May 1) replaced by zero code. Out of scope; Phase 0 archives the dead plans to remove cognitive drag.
- **Full TypeScript migration** — Phase 0 decides JSDoc-typecheck vs. TS for the `tsc --noEmit` CI gate. Either way, no full migration in this roadmap.
- **Megafile rewrites** — `Experimentation.jsx` (17,919 LoC) and friends are decomposed by *extraction*, never by rewrite.
- **New customer-facing features** of any kind.

## 4. Phase 0 — Decide & document

**Goal:** produce the docs and locked-in decisions the later phases depend on. No production code changes.

**Deliverables**

- Rewritten **`PRD.md`** that reflects 2026-05-12 reality: React 19 SPA, Vite build, Express/Cloud Run backend, Firestore data model, Stripe checkout, Firebase Hosting + Auth, admin panel scope, in-flight image pipeline state. The Feb-2026 PRD's "no database" and "e-commerce out of scope" claims are removed.
- Rewritten **`README.md`** — getting-started, run commands, deploy guide, env-vars summary. Strip the security-headers paragraph that overstates what's actually set.
- New **`docs/user-flows.md`** — sequence diagrams for the live customer journeys: discovery-flight booking → Stripe → recordBooking → confirmation email → upsell pill; misc-marketplace purchase; apparel purchase; parts enquiry; lead-form submission; admin auth → FAQ/SFH/comparables CRUD; cart-recovery cron. One section per flow with the touchpoints (route → API → Firestore collection → email).
- New **`docs/infra-decisions.md`** — single page locking in: error-reporting vendor, staging-environment strategy, typecheck strategy (TS migration vs. JSDoc + checkJs vs. neither), Node version target, `/images` deletion + git-history-rewrite decision, helmet/CSP policy template. Each decision: chosen option, alternatives considered, rationale, who decided, date.
- New **`docs/superpowers/plans/archived/`** — move the five abandoned analytics-funnel plans (`2026-04-29-analytics-funnel-phase-1.md` through `2026-05-01-analytics-info-tooltips.md`) and any other plans audited as abandoned. Add a one-line note in each file: `# ARCHIVED 2026-05-12 — replaced by …` or `# ARCHIVED 2026-05-12 — abandoned, see roadmap §3`.
- Updated **plan-folder index** — a short `docs/superpowers/plans/README.md` (new) listing each remaining plan with status (shipped / in-flight / queued) so the folder reads like a backlog instead of a graveyard.

**Open decisions Phase 0 must close**

| Decision | Default if user has no preference |
|---|---|
| Error-reporting vendor | **Sentry** (managed, generous free tier, JS + Node SDK, sourcemaps) over GCP Error Reporting (free, but worse DX and no sourcemap support out of the box) |
| Staging environment | **Separate Firebase project** (`hq-aviation-staging`) with its own Firestore, Stripe test-mode key, and Cloud Run service, fronted by `staging.hqaviation.…` host. Alternatives: shared project with collection-namespaced data (rejected — Firestore rules cannot scope by collection-prefix safely); no staging (rejected — current state is the bug) |
| Typecheck in CI | **JSDoc + `checkJs: true` via tsconfig** — keeps `.jsx`, gates on `tsc --noEmit`, no migration cost. Full TS migration deferred |
| `/images` (90 MB) deletion | **Delete from `main`; do not rewrite git history.** Repo size impact is paid once on clone; history rewrite breaks every open branch and worktree |
| Node version | **`>=20` (Cloud Run runtime)**, drop `>=14` |
| CSP policy | **`default-src 'self'`** with explicit allowlist for Stripe (`js.stripe.com`, `api.stripe.com`, `hooks.stripe.com`), Firebase (`*.firebaseio.com`, `*.googleapis.com`), Google Fonts, and any third-party analytics. Authored as a template in Phase 0 so Phase 1 just installs it |

**Exit criterion for Phase 0:** all four docs committed; `infra-decisions.md` has every row filled with an explicit chosen option; user signs off on the doc before Phase 1 starts.

## 5. Phase 1 — Pre-production hardening

**Goal:** stop bleeding before the site sees real ad-driven traffic. Customer-invisible. Each item below becomes a task (or its own writing-plans cycle if non-trivial).

**Security**

1. **Stripe live-mode guardrail.** At boot, `assert STRIPE_SECRET_KEY.startsWith('sk_live_') when NODE_ENV === 'production'`. Fail loud, exit non-zero. Mirror for `STRIPE_WEBHOOK_SECRET` prefix.
2. **Webhook signature presence check.** In `api/stripe.js:803`, refuse the request with HTTP 400 if `stripe-signature` header is absent, *before* invoking `stripe.webhooks.constructEvent`. Do not echo the header value in the error response.
3. **Rate limit payment endpoints.** Apply `express-rate-limit` to `/api/create-payment-intent`, `/api/create-london-tour-payment-intent`, `/api/create-misc-payment-intent`. Limit: 10 req / min / IP (tunable). Existing limiter pattern on `/api/leads` and `/api/carts` is the template.
4. **helmet + CSP.** Install `helmet`, mount with the CSP from Phase 0's policy template. Add HSTS (1 year, `includeSubDomains`, `preload`). Remove the manually-set X-Frame-Options etc. that helmet now owns.
5. **Firestore rules tightening.** Explicit `allow read, write: if false` on `referral_codes` and any other server-only-via-Admin-SDK collection. Field-level validation on `bookings`, `leads`, `carts`, `misc_marketplace`: require expected shape, reject unknown keys.
6. **Firestore rules tests.** Adopt `@firebase/rules-unit-testing`; write the test suite covering: public read of `helicopters`, public create of `enquiries`, unauthenticated denial of `bookings`, role-gating of admin paths.
7. **Email template escaping.** Audit `api/templates/*` and `api/lib/cartRecoverySend.js` for any unescaped user fields injected into HTML; route through DOMPurify or the framework's auto-escape. Add a unit test that injects `<script>` into a cart `name` field and asserts the email body contains the escaped form.

**Reliability**

8. **Graceful shutdown.** Replace `process.exit(0)` on `SIGTERM` in `server.js:617` with `server.close(() => process.exit(0))` + a 30 s drain timeout. Ensures Cloud Run revision swaps don't drop in-flight webhooks.
9. **Boot-time env-var assertions** — extend `server.js:11–15` to fail loud on any required var missing in production. Audit all `process.env.X` usages; add the canonical list to `.env.example` and assert each.
10. **Cloud Run health check.** Add `/api/health` to the Dockerfile `HEALTHCHECK` directive (or Cloud Run startup probe). Ensures revisions roll back if the server can't open the port.

**Observability**

11. **Error reporting wired in.** Per Phase 0 decision (Sentry default). Initialise on server boot before any other middleware; capture in React via Sentry's React SDK; tag each release with `git rev-parse HEAD` injected at build time.
12. **Structured logging.** Replace `console.log` / `console.error` in `server.js` and `api/*.js` with a tiny logger (e.g. `pino` or a hand-rolled JSON writer) that emits `{level, msg, route, requestId, latencyMs, …}`. Cloud Run picks JSON up automatically and indexes it.
13. **Stripe-webhook failure alert.** Sentry alert: any 5xx on `/api/webhook` pages the owner.

**CI**

14. **Test gate on PR + merge.** Update `.github/workflows/firebase-hosting-pull-request.yml` and `firebase-hosting-merge.yml` to run `npm test` after `npm ci`, before `npm run build`. PRs that fail block. Same gate on push to `main`.
15. **Node engine bump.** `package.json:29` → `"node": ">=20.0.0"`. Update Dockerfile base image if needed (`node:20-slim` already in use per audit).

**Staging environment**

16. **Stand up the staging environment** per the Phase 0 decision. This is the heaviest single item in Phase 1: separate Firebase project (`hq-aviation-staging`) with its own Firestore + Auth + Storage, separate Cloud Run service in the same region, Stripe test-mode credentials + a distinct webhook endpoint and secret, `staging.<domain>` DNS, secrets in Google Secret Manager scoped to the staging project. Deploy script gains a `--staging` flag; document the promotion path (commit on `main` → deploy to staging → manual gate → deploy to prod). Without this, the rest of Phase 1's security changes can only be validated in production, and Phase 2's Lighthouse measurements have no clean baseline.

**Exit criteria for Phase 1**

- All P0 items from §8 are closed or have a tracked deferral with reason.
- A fresh `git push` to `main` runs the test suite; a failing test blocks merge.
- A deliberately-broken Stripe webhook surfaces in Sentry within 60 s.
- `npm start` with `NODE_ENV=production` and a test Stripe key exits with a non-zero status.

## 6. Phase 2 — Performance & customer-facing quality

**Goal:** the first phase a customer feels. Builds on D0-D3 image work already on `main`.

**Performance**

1. **Route-level code splitting in `src/App.jsx`.** Convert eager imports (`src/App.jsx:7-133`) to `React.lazy()`; wrap the `<Routes>` block in `<Suspense fallback={<RouteSkeleton/>}>`. Split admin routes into a separate chunk via comment-hint `webpackChunkName: 'admin'` or Vite equivalent. Target: home route JS ≤ 600 KB gzipped.
2. **CSS slimming.** Audit `src/assets/css/*` for unused stylesheets; remove imports of legacy Squarespace CSS still entrained via root-level folders. Extract critical CSS for `/` and `/discovery-flights` via Vite plugin or hand-rolled inlining. Target: render-blocking CSS ≤ 50 KB.
3. **Font loading.** Add `<link rel="preload">` for the one primary display font; `font-display: swap` on every `@font-face`. Drop Typekit if Playfair Display is the only consumer; self-host instead.
4. **Ship Image-D4 Lighthouse measurement.** Merge `feat/image-pipeline-d4`, run the existing `lighthouseRunner.js` against home + discovery-flight + R66 + apparel pre- and post-Phase-2, commit the report to `docs/superpowers/reports/2026-MM-DD-lighthouse-phase2.md`. This *is* the proof Phase 2 worked.

**SEO depth**

5. **Per-page `<Seo>` audit.** Script-driven check (`scripts/audit-seo-coverage.js`) that imports every route component and asserts `<Seo>` is rendered with a title, description, canonical, and `og:image`. Fail CI if any route is missing required fields.
6. **Structured data.** `Product` schema on aircraft pages (R44/R66/R88 variants and `used-aircraft` listings), `LocalBusiness` on contact/about, `BreadcrumbList` on nested routes. Hook into the existing `Seo` `jsonLd` prop.

**Resilience**

7. **React error boundaries.** Add `<ErrorBoundary>` wrappers at: app root, every modal portal, admin shell, checkout flow, blog reader. The boundary reports to Sentry and renders a graceful fallback with a retry CTA.

**Accessibility (forms + modals only — full a11y is out of scope)**

8. **Modal a11y baseline.** Apply a `<Modal>` primitive with `role="dialog"`, `aria-modal="true"`, `aria-labelledby` wired to the heading, focus trap on mount, focus restoration on unmount, ESC handler, labelled close button. Migrate `EnquireModal.jsx`, `ProductInfoModal`, and any sibling modal to use it.
9. **Form validation + error UX.** Adopt Zod schemas (already in deps) on `EnquireModal`, parts-enquiry, contact, discovery-flight booking. Inline field errors, server-error toast, optimistic submit-disabled state. No client-side regex hand-rolling.

**Exit criteria for Phase 2**

- Lighthouse mobile scores on `/`, `/discovery-flights`, `/r66`: Performance ≥ 90, Accessibility ≥ 95, Best Practices ≥ 95, SEO ≥ 95.
- D4 report committed.
- `scripts/audit-seo-coverage.js` passes in CI.

## 7. Phase 3 — Codebase health & dev velocity

**Goal:** make the next year of changes cheap. Invisible to customers.

**Debris**

1. **Delete dead artefacts** in one commit (per Phase 0 decision, on `main`, no history rewrite):
   - `/images/` (~90 MB, orphaned)
   - `/css/`, `/js/` (legacy Squarespace mirrors)
   - `/fix-all-pages.js`, `/fix-fonts.js`, `/fix-images.js`, `/fix-index.js`, `/fix-logo-srcset.js`, `/minimal-fix.js`, `/cleanup-comments.js`, `/remove-squarespace-references.js`
   - `/nav-new.html`, `/nav-simple.html`, `/menu-test-simple.html`, `/test-nav-standalone.html`
   - `/websitenotes.pdf`
   - `src/hero-variants/` (verify zero imports first)
   - Any `public/*.html` that the audit flagged as test/diagnostic (`nav-test`, `menu-test`, `menu-working-test`, `diagnostic`, `index.html.menutest`)
   - Verify-then-delete the root-level `HQ-website-images/`, `R44-Claude/`, `R88-Robinson/`, `Shyam Maintenance Photos/`, `eyeinthesky-robbie/`, `recently-sold-aircraft/`, `used-aircraft/`, `r66/`, `discovery-flight-1/`, `apparel/`, `claude-reference/`, `claude-reference HERE/`, `assets-source/` — keep what's still referenced from `src/` or `public/`, delete the rest. Use `grep -r` to verify each before deleting.
2. **Dev pages namespaced.** Move dev/picker pages out of `src/pages/` into `src/dev-pages/` (or similar). Verify Vite excludes the directory from production chunks; add a build-time assertion if it's accidentally entrained.

**Megafile decomposition (extraction, not rewrite)**

3. **`Experimentation.jsx` (17,919 LoC).** Phase 3 ships *the framework*: each section currently inlined as a sub-render becomes a file under `src/pages/Experimentation/sections/<Section>.jsx` with the parent importing them. One PR per ~10 sections. No behavioural changes. Add a snapshot test before each move.
4. **`OwnershipBenefitsPicker.jsx` (6,778 LoC).** Same pattern — extract subcomponents to `src/components/ownership-benefits/`.
5. **`HeroVariations.jsx` (3,423 LoC, 30 exports).** Split into 30 files under `src/components/hero/variants/`. Re-export from an `index.js` so existing imports stay valid.

**Testing**

6. **Component-test scaffolding.** RTL + jsdom is already configured. Seed tests for: discovery-flight booking flow (mocked Stripe), admin auth gate, cart checkout success + failure, modal a11y contract (the `<Modal>` primitive from Phase 2 must pass an a11y test suite).
7. **Server.js integration tests.** Use `supertest` (already in deps) against an in-process Express instance: canonical redirects, clean-URL routing, security headers, 404 behaviour, health endpoint.

**Tooling**

8. **Lint as a CI gate.** `npm run lint` added; flat ESLint config gets `react-hooks/exhaustive-deps`, `import/no-unresolved`, and the project's no-unused-vars pattern. CI runs it on every PR.
9. **Typecheck as a CI gate.** Per Phase 0 decision: either `tsc --noEmit` on a JSDoc-annotated codebase (default) or after a TS migration. Wired into both workflows.
10. **Pre-commit hook (husky).** Run lint + vitest on changed files only. Soft gate (warns); hard gate is CI.

**Exit criteria for Phase 3**

- Repo size on fresh clone < 50 MB.
- No source file > 2,000 LoC outside `dist/`.
- `npm run lint && npm run typecheck && npm test` all green and gating CI.
- A change pushed to a branch deploys to staging automatically; `main` deploys to production.

## 8. References — audit findings provenance

The audit pass that generated this roadmap covered four angles. Each finding cited in this spec maps to one of them.

- **Frontend / UX / perf / a11y**: bundle size, code-splitting absence, megafile inventory, error-boundary absence, modal a11y, font/CSS loading, hero-variants cruft, dev-route bundling.
- **Backend / API / security**: Stripe live-mode guardrail, webhook signature check, payment-endpoint rate limiting, helmet/CSP absence, Firestore rule gaps (`referral_codes` explicit deny, field-level validation), graceful shutdown, email template escaping, Node engine pin.
- **Testing / CI/CD / deploy / observability**: CI workflows do not run `npm test`, component-test gap, no error reporting, no staging environment, no structured logging, no Firestore rules tests, manual deploy.
- **Plans / dead code / business gaps**: `/images` 90 MB orphan, abandoned analytics-funnel plans, fix-`*`.js + nav-`*`.html debris, stale PRD/README, Squarespace residue audit results, plan-to-reality drift summary.

The full audit transcripts are not preserved in this spec — they live in the conversation that produced it. Future Claude sessions reading this spec should treat it as authoritative and re-run targeted audits as needed.

## 9. Open questions to resolve in Phase 0

Listed here so they don't slip:

1. **Sentry vs. GCP Error Reporting** — defaults to Sentry; user confirms in Phase 0.
2. **Staging strategy** — defaults to separate Firebase project; user confirms.
3. **TS vs. JSDoc** — defaults to JSDoc + `checkJs`; user confirms.
4. **`/images` deletion + git history** — defaults to "delete on `main`, no history rewrite"; user confirms.
5. **What does the user-flow doc need to cover beyond the live flows?** Aircraft buyer flow that doesn't yet exist — is that an "as-is" doc (empty section) or a future-state doc?
6. **Megafile decomposition order** — `Experimentation.jsx` first (highest debt) or `HeroVariations.jsx` first (lowest risk)?

## 10. Risks

- **Phase 3 megafile extraction can regress** the live home route (Experimentation = `/`). Mitigate with snapshot tests before each extraction PR + a manual smoke pass.
- **Staging env adds a recurring GCP cost** (~$5–$20/mo). User accepts in Phase 0.
- **The `/images` deletion** could break a page we missed. Mitigate with grep-verify + a 24-hour soak on staging before main.
- **`R22 → R44 upgrade` branch staleness** — every week Phase 0/1 runs, the 100-commit branch drifts further from `main`. Owner must make the merge-or-kill decision before Phase 2 starts, since Phase 2 will edit the same booking-confirmed code.

## 11. Success criteria for the whole roadmap

- Owner is comfortable pointing paid traffic at the site.
- A junior engineer can be onboarded from the docs in a day.
- A failing build can't reach production.
- A failing payment surfaces in monitoring within a minute.
- The repo, fresh-cloned, is under 50 MB and builds cleanly.

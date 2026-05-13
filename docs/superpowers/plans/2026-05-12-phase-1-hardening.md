# Phase 1 — Pre-production Hardening Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Ship every Phase 1 hardening item from the site-hardening roadmap — Stripe boot guards, webhook signature checks, payment rate limits, helmet+CSP, Firestore rules tightening + tests, graceful shutdown, structured logs + Sentry, CI test gate, Node bump, and staging environment — so the site can safely accept paid traffic and every silent failure becomes observable within 60 seconds.

**Architecture:** Server-side defence and observability changes layered into `server.js` and `api/*` without rewriting any business logic. New `api/lib/` helpers for the cross-cutting concerns (boot guards, logger, Sentry init). Firestore rules tightened with a real test suite using `@firebase/rules-unit-testing`. A second Firebase + GCP project (`hq-aviation-staging`) gives every later phase a safe place to validate before promotion. CI workflows gated on `npm test` so regressions can't slip while the team iterates.

**Tech Stack:** Express 4 + helmet + express-rate-limit + pino (logger) + `@sentry/node` + `@sentry/react` + `@firebase/rules-unit-testing` (test only) + zod (already in deps). No new runtime frameworks. Vitest stays the only test runner.

**Reference:** Implements `docs/superpowers/specs/2026-05-12-site-hardening-roadmap-design.md` §5 (Phase 1). Reads from `docs/infra-decisions.md` for locked-in decisions on Sentry, staging, CSP template, release tagging, Node target.

**Branch:** Implementation lands on `feat/phase-1-hardening`, branched off `main` once Phase 0 PR (#11) merges.

---

## Sub-phases

The plan groups 17 tasks into four shippable sub-phases. Each sub-phase ends with a checkpoint; the team may merge / open a PR / pause between sub-phases.

| Sub-phase | Tasks | Theme | Risk |
|---|---|---|---|
| **1A — Pre-reqs + CI gate** | 1–3 | Fix a pre-existing failing test, bump Node, gate CI on `npm test`. Foundation for safe iteration on every task that follows. | Low |
| **1B — Server hardening** | 4–9 | Boot guards, signature check, rate limits, helmet+CSP report-only, graceful shutdown, env-var assertions, Cloud Run health check. All in `server.js` + `api/`. | Medium — CSP can break assets in enforcement; report-only week mitigates. |
| **1C — Observability** | 10–13 | Structured logger (pino), Sentry server-side, Sentry React-side, release tagging via `--build-arg GIT_REV`, Stripe webhook failure alert. | Low — additive layering. |
| **1D — Data security + staging** | 14–17 | Firestore rules tightening, rules unit-tests, stand up staging Firebase + GCP project, staging Cloud Run + Stripe test webhook + DNS + promotion doc. | High — staging env is multi-day infra; Firestore rule changes need staging validation. |

---

## File Structure

Files this plan creates or modifies. Every file has one clear responsibility.

**New files:**
- `api/lib/bootGuards.js` — boot-time env assertions: Stripe live-mode prefix check + extended REQUIRED_ENV validator. One responsibility: fail loud on bad config.
- `api/lib/bootGuards.test.js` — unit tests for the guards.
- `api/lib/logger.js` — pino instance + child-logger helpers. One responsibility: produce structured JSON logs.
- `api/lib/sentry.js` — Sentry init wrapper for Express. One responsibility: encapsulate `Sentry.init` + middleware wiring.
- `src/lib/sentry.js` — Sentry init for the React bundle. One responsibility: encapsulate browser-side Sentry init.
- `firestore-rules.test.js` — security-rules test suite. One responsibility: assert rule outcomes against the emulator.
- `docs/seo/staging-deployment-guide.md` — operator runbook for promoting staging → prod.

**Modified files:**
- `package.json` — engines.node, new dev deps, new scripts.
- `server.js` — boot guards wired in, helmet middleware, rate limiters, graceful shutdown rewritten, logger replaces console.*, Sentry middleware wired in, health endpoint.
- `api/stripe.js` — signature presence check.
- `api/*.js` (multiple) — `console.*` → `logger.*` migration.
- `src/main.jsx` — Sentry init + `ErrorBoundary` wrap.
- `firestore.rules` — explicit deny on server-only collections, field-level validation on bookings/leads/carts.
- `Dockerfile` — `ARG GIT_REV` + `ENV GIT_REV=$GIT_REV` + `HEALTHCHECK`.
- `.github/workflows/firebase-hosting-pull-request.yml` — add test step.
- `.github/workflows/firebase-hosting-merge.yml` — add test step.
- `src/components/booking/ProductInfoModal.jsx:37,47` — add width/height to `<img>`.
- `src/components/booking/ReferralOfferCard.jsx:47` — add width/height to `<img>`.

**Test files extended:**
- `api/stripe.test.js` — add cases for sig presence + rate limits.
- `server.boot.test.js` (new) — boot-time guard integration tests.

---

# Sub-phase 1A — Pre-reqs + CI gate

Three small tasks that unblock everything. After 1A merges, every later task lands behind a green-CI gate.

## Task 1: Fix `canonicalImgDimensions` failing test

**Files:**
- Modify: `src/components/booking/ProductInfoModal.jsx:37` and `:47`
- Modify: `src/components/booking/ReferralOfferCard.jsx:47`
- Test (already exists): `src/lib/canonicalImgDimensions.test.js`

The test currently fails on `main` because three `<img>` elements on canonical pages lack `width` and `height` attributes (which is also a CLS source — fixing this is real value, not just CI hygiene).

- [ ] **Step 1: Run the failing test to confirm the offenders**

Run:
```bash
npx vitest run src/lib/canonicalImgDimensions.test.js
```

Expected: FAIL with output naming the three offenders:
```
ProductInfoModal.jsx:37
ProductInfoModal.jsx:47
ReferralOfferCard.jsx:47
```

If the failing offender lines have drifted (the test was last seen failing on 2026-05-12), use the updated lines from the failure output.

- [ ] **Step 2: Determine the correct width and height for each `<img>`**

Read each component and identify the asset each `<img>` is sourcing:

```bash
sed -n '30,55p' src/components/booking/ProductInfoModal.jsx
sed -n '40,55p' src/components/booking/ReferralOfferCard.jsx
```

For each `<img src="...">`, find the asset file. Use ImageMagick to get the natural dimensions:

```bash
identify "<path-to-asset>"
```

(If ImageMagick is not installed, use `sips -g pixelWidth -g pixelHeight <path>` on macOS, or open the file in Preview.)

Record the natural dimensions per `<img>`.

- [ ] **Step 3: Add `width` and `height` attributes**

For each offender, edit the JSX to add the attributes. Example:

```jsx
// Before
<img src="/assets/product.jpg" alt="..." />

// After
<img src="/assets/product.jpg" alt="..." width={800} height={600} />
```

Important: use **natural** dimensions, not displayed dimensions. CSS scales the display; the browser uses the attributes to reserve layout space before the image loads (this is what eliminates CLS).

- [ ] **Step 4: Verify the test now passes**

```bash
npx vitest run src/lib/canonicalImgDimensions.test.js
```

Expected: PASS.

Also run the full suite to confirm no regression:

```bash
npm test 2>&1 | tail -20
```

Expected: tests pass (allowing for the unrelated `.worktrees/plan-c-r22-r44-upgrade/` failures which are a vitest scanning artefact, not a real failure).

- [ ] **Step 5: Commit**

```bash
git add src/components/booking/ProductInfoModal.jsx src/components/booking/ReferralOfferCard.jsx
git commit -m "$(cat <<'EOF'
fix(canonical): add width/height to 3 imgs flagged by CLS guard test

ProductInfoModal.jsx:37,47 and ReferralOfferCard.jsx:47 were emitting
<img> elements without width/height, failing the
canonicalImgDimensions.test.js guard and contributing to CLS on the
booking confirmation flow. Added natural dimensions per asset.

Co-Authored-By: Claude Opus 4.7 <noreply@anthropic.com>
EOF
)"
```

---

## Task 2: Bump Node engine to `>=20`

**Files:**
- Modify: `package.json:29`

`package.json` says `"node": ">=14.0.0"` (EOL 2023). Dockerfile already uses `node:20-slim`. Bump the engine claim to match deploy reality.

- [ ] **Step 1: Verify the current value**

```bash
grep -n '"node"' package.json
```

Expected: line 29 reads `"node": ">=14.0.0"`.

- [ ] **Step 2: Edit `package.json`**

Use the `Edit` tool:
- `old_string`: `"node": ">=14.0.0"`
- `new_string`: `"node": ">=20.0.0"`

- [ ] **Step 3: Confirm `npm install` still resolves**

```bash
npm install --dry-run 2>&1 | tail -5
```

Expected: no errors about engine mismatch on the host. If the host is running Node < 20, the user needs to upgrade locally — flag it as a blocker.

- [ ] **Step 4: Confirm Dockerfile is consistent**

```bash
grep -n "FROM node" Dockerfile
```

Expected: both builder and runtime stages use `node:20-slim` (or a Node 20.x tag). If not, also update Dockerfile.

- [ ] **Step 5: Commit**

```bash
git add package.json
git commit -m "$(cat <<'EOF'
chore(engines): bump Node minimum from >=14 to >=20

Cloud Run runtime is node:20-slim per Dockerfile; the package.json
claim was misleading. Phase 1 task per docs/infra-decisions.md §5.

Co-Authored-By: Claude Opus 4.7 <noreply@anthropic.com>
EOF
)"
```

---

## Task 3: CI test gate on PR and main

**Files:**
- Modify: `.github/workflows/firebase-hosting-pull-request.yml`
- Modify: `.github/workflows/firebase-hosting-merge.yml`

Both workflows currently run `npm ci && npm run build`. Add `npm test` between them so failing tests block PR merges and main pushes.

- [ ] **Step 1: Read both workflow files**

```bash
cat .github/workflows/firebase-hosting-pull-request.yml
cat .github/workflows/firebase-hosting-merge.yml
```

Note the structure — each has a `steps:` block.

- [ ] **Step 2: Add a Test step to the pull-request workflow**

Use the `Edit` tool on `.github/workflows/firebase-hosting-pull-request.yml`. Find the line that runs `npm ci` (and confirm it's followed by `npm run build`). Insert a new step between them:

```yaml
      - run: npm test
```

The exact YAML format should match the surrounding steps. If the existing `npm ci` step uses `- run: npm ci`, mirror that. If it uses a `name:` field, give the new step `name: Test` and `run: npm test`.

- [ ] **Step 3: Add the same step to the merge workflow**

Same approach for `.github/workflows/firebase-hosting-merge.yml`.

- [ ] **Step 4: Commit**

```bash
git add .github/workflows/
git commit -m "$(cat <<'EOF'
ci: gate PR and main on npm test

Both Firebase Hosting workflows previously ran only ci+build. Adds
`npm test` as a required step so failing vitest cases block merges.

Co-Authored-By: Claude Opus 4.7 <noreply@anthropic.com>
EOF
)"
```

- [ ] **Step 5: Verify CI runs the new step**

Open the PR for the `feat/phase-1-hardening` branch (or wait for any open PR to re-trigger) and confirm the GitHub Actions run includes a "Test" step that passes. If the step fails, fix before merging.

---

### Sub-phase 1A checkpoint

After Task 3, `feat/phase-1-hardening` has 3 commits. Optionally open an intermediate PR for 1A only, merge, then proceed to 1B on the same branch — this gets the CI gate live as early as possible.

---

# Sub-phase 1B — Server hardening

Six tasks that close the active security holes. Order matters: boot guards first (fail loud on misconfig), then defence-in-depth, then graceful shutdown.

## Task 4: Stripe live-mode boot guard

**Files:**
- Create: `api/lib/bootGuards.js`
- Create: `api/lib/bootGuards.test.js`
- Modify: `server.js` (wire the guard into boot)

Extract the guard into a pure function so it's unit-testable without spawning a server.

- [ ] **Step 1: Write the failing test**

Create `api/lib/bootGuards.test.js`:

```javascript
import { describe, it, expect } from 'vitest';
import { assertProductionStripeKey } from './bootGuards.js';

describe('assertProductionStripeKey', () => {
  it('passes when production env uses live secret key', () => {
    expect(() => assertProductionStripeKey({
      NODE_ENV: 'production',
      STRIPE_SECRET_KEY: 'sk_live_abc',
      STRIPE_WEBHOOK_SECRET: 'whsec_def',
    })).not.toThrow();
  });

  it('throws when production env uses test secret key', () => {
    expect(() => assertProductionStripeKey({
      NODE_ENV: 'production',
      STRIPE_SECRET_KEY: 'sk_test_abc',
      STRIPE_WEBHOOK_SECRET: 'whsec_def',
    })).toThrow(/test mode Stripe key/);
  });

  it('throws when production webhook secret has wrong prefix', () => {
    expect(() => assertProductionStripeKey({
      NODE_ENV: 'production',
      STRIPE_SECRET_KEY: 'sk_live_abc',
      STRIPE_WEBHOOK_SECRET: 'not_a_real_secret',
    })).toThrow(/STRIPE_WEBHOOK_SECRET/);
  });

  it('does not throw outside production', () => {
    expect(() => assertProductionStripeKey({
      NODE_ENV: 'development',
      STRIPE_SECRET_KEY: 'sk_test_abc',
      STRIPE_WEBHOOK_SECRET: 'whsec_def',
    })).not.toThrow();
  });

  it('does not throw when env is test', () => {
    expect(() => assertProductionStripeKey({
      NODE_ENV: 'test',
      STRIPE_SECRET_KEY: 'sk_test_abc',
      STRIPE_WEBHOOK_SECRET: 'whsec_def',
    })).not.toThrow();
  });
});
```

- [ ] **Step 2: Run the test to verify it fails**

```bash
npx vitest run api/lib/bootGuards.test.js
```

Expected: FAIL — `Cannot find module './bootGuards.js'` or similar.

- [ ] **Step 3: Implement the guard**

Create `api/lib/bootGuards.js`:

```javascript
/**
 * Throws if NODE_ENV is 'production' and Stripe keys look like test-mode
 * credentials. Pure function — takes the env object so it's testable.
 *
 * @param {{NODE_ENV?: string, STRIPE_SECRET_KEY?: string, STRIPE_WEBHOOK_SECRET?: string}} env
 */
export function assertProductionStripeKey(env) {
  if (env.NODE_ENV !== 'production') return;

  if (!env.STRIPE_SECRET_KEY || !env.STRIPE_SECRET_KEY.startsWith('sk_live_')) {
    throw new Error(
      'FATAL: NODE_ENV=production but STRIPE_SECRET_KEY is a test mode Stripe key ' +
      '(expected prefix sk_live_). Refusing to start — would cause silent ' +
      'payment failures.'
    );
  }

  if (!env.STRIPE_WEBHOOK_SECRET || !env.STRIPE_WEBHOOK_SECRET.startsWith('whsec_')) {
    throw new Error(
      'FATAL: NODE_ENV=production but STRIPE_WEBHOOK_SECRET does not have ' +
      'the expected whsec_ prefix. Refusing to start.'
    );
  }
}
```

- [ ] **Step 4: Run the test to verify it passes**

```bash
npx vitest run api/lib/bootGuards.test.js
```

Expected: PASS — all 5 cases.

- [ ] **Step 5: Wire the guard into `server.js`**

Find the existing `REQUIRED_ENV` validation block in `server.js` (around line 11–20). Immediately after it, add:

```javascript
import { assertProductionStripeKey } from './api/lib/bootGuards.js';

try {
  assertProductionStripeKey(process.env);
} catch (err) {
  console.error(err.message);
  process.exit(1);
}
```

(The import goes at the top with the other imports; the call goes after `REQUIRED_ENV` validation.)

- [ ] **Step 6: Manually verify the guard fires**

```bash
NODE_ENV=production STRIPE_SECRET_KEY=sk_test_xyz STRIPE_WEBHOOK_SECRET=whsec_xyz node server.js
echo "Exit code: $?"
```

Expected: server prints the FATAL message and exits with code 1.

Then test the happy path:

```bash
NODE_ENV=production STRIPE_SECRET_KEY=sk_live_xyz STRIPE_WEBHOOK_SECRET=whsec_xyz SITE_URL=https://example.com EMAIL_FROM=test@example.com SMTP_HOST=smtp.example.com SMTP_USER=u SMTP_PASS=p FIREBASE_PROJECT_ID=p FIREBASE_CLIENT_EMAIL=e FIREBASE_PRIVATE_KEY=k node server.js &
sleep 2
kill %1
```

Expected: server starts, doesn't crash on the boot guard. (Other env-var assertions may still trip — that's covered by Task 8.)

- [ ] **Step 7: Commit**

```bash
git add api/lib/bootGuards.js api/lib/bootGuards.test.js server.js
git commit -m "$(cat <<'EOF'
feat(boot): refuse to start in production with test-mode Stripe keys

Adds api/lib/bootGuards.assertProductionStripeKey — pure function
that throws when NODE_ENV=production and STRIPE_SECRET_KEY does not
start with sk_live_, or STRIPE_WEBHOOK_SECRET does not start with
whsec_. Wired into server.js boot after the existing REQUIRED_ENV
check. Prevents silent payment-fail catastrophe from .env mis-deploy.

Co-Authored-By: Claude Opus 4.7 <noreply@anthropic.com>
EOF
)"
```

---

## Task 5: Webhook signature presence check

**Files:**
- Modify: `api/stripe.js` (around line 803 where `stripe.webhooks.constructEvent` is called)
- Modify (extend): `api/stripe.test.js`

Currently the webhook handler passes whatever's in `req.headers['stripe-signature']` to `constructEvent`. If the header is missing, the Stripe SDK throws an error whose message leaks recon info to an attacker probing the endpoint. Reject early with a generic 400.

- [ ] **Step 1: Locate the webhook handler**

```bash
grep -n "stripe-signature" api/stripe.js
grep -n "constructEvent" api/stripe.js
```

Expected: a line near 803 reading something like `const event = stripe.webhooks.constructEvent(req.rawBody, sig, secret)` (or similar). Note the exact surrounding code so the Edit can be precise.

- [ ] **Step 2: Write the failing test in `api/stripe.test.js`**

Open `api/stripe.test.js`. Find an existing `describe('webhook', ...)` block or add a new one. Add this test:

```javascript
import request from 'supertest';
import { createTestApp } from './test-setup.js'; // or whatever helper exists

describe('POST /api/webhook', () => {
  it('returns 400 when stripe-signature header is missing', async () => {
    const app = await createTestApp();
    const res = await request(app)
      .post('/api/webhook')
      .send('{"type":"test.event"}')
      .set('Content-Type', 'application/json');
    expect(res.status).toBe(400);
    expect(res.text).not.toContain('webhook'); // body must not echo internals
  });
});
```

If `createTestApp` doesn't exist, mirror the pattern used in the existing test cases — read `api/stripe.test.js` first to see how the file sets up an Express app for testing.

- [ ] **Step 3: Run the test to confirm it fails**

```bash
npx vitest run api/stripe.test.js -t "stripe-signature header is missing"
```

Expected: FAIL with a non-400 status (probably 500, or the Stripe SDK error leaks through).

- [ ] **Step 4: Edit `api/stripe.js`**

In the webhook route handler, before the `constructEvent` call, insert:

```javascript
const sig = req.headers['stripe-signature'];
if (!sig) {
  return res.status(400).send('missing signature');
}
```

Make sure no existing code re-reads `req.headers['stripe-signature']` after this — refactor to use the captured `sig` variable.

- [ ] **Step 5: Run the test to confirm it passes**

```bash
npx vitest run api/stripe.test.js -t "stripe-signature header is missing"
```

Expected: PASS.

- [ ] **Step 6: Run the full webhook test block to confirm no regression**

```bash
npx vitest run api/stripe.test.js -t "webhook"
```

Expected: all webhook tests PASS.

- [ ] **Step 7: Commit**

```bash
git add api/stripe.js api/stripe.test.js
git commit -m "$(cat <<'EOF'
fix(stripe): reject webhook posts without stripe-signature header

Previously the absence of stripe-signature would let the Stripe SDK
throw, leaking error detail into the 5xx response body — useful to
an attacker probing the endpoint. Now responds with a generic 400 +
'missing signature' before invoking the SDK.

Co-Authored-By: Claude Opus 4.7 <noreply@anthropic.com>
EOF
)"
```

---

## Task 6: Rate-limit payment endpoints

**Files:**
- Modify: `server.js` (define a `paymentLimiter`, apply to 3 routes near lines 245, 291, 334)
- Modify (extend): `api/stripe.test.js` or new `server.rateLimit.test.js`

`/api/create-payment-intent`, `/api/create-london-tour-payment-intent`, and `/api/create-misc-payment-intent` accept unlimited POSTs. `/api/leads` and `/api/carts` already have rate-limiters — copy that pattern.

- [ ] **Step 1: Find the existing rate-limiter pattern**

```bash
grep -nE "rateLimit|express-rate-limit" server.js | head -10
```

Note the import and one example application (e.g. `app.use('/api/leads', leadsLimiter, ...)` or similar).

- [ ] **Step 2: Write the failing test**

Create `server.rateLimit.test.js` (or extend `api/stripe.test.js` if test infra prefers a single file):

```javascript
import { describe, it, expect } from 'vitest';
import request from 'supertest';
import { createTestApp } from './api/test-setup.js'; // adjust path

describe('payment endpoint rate limits', () => {
  it('returns 429 after 10 POSTs in 60 seconds to /api/create-payment-intent', async () => {
    const app = await createTestApp();
    const validPayload = { /* minimum required fields — copy from existing tests */ };

    // 10 should succeed (or at least not 429)
    for (let i = 0; i < 10; i++) {
      const res = await request(app)
        .post('/api/create-payment-intent')
        .send(validPayload)
        .set('Content-Type', 'application/json');
      expect(res.status).not.toBe(429);
    }

    // 11th must 429
    const res = await request(app)
      .post('/api/create-payment-intent')
      .send(validPayload)
      .set('Content-Type', 'application/json');
    expect(res.status).toBe(429);
  });
});
```

- [ ] **Step 3: Run the test to confirm it fails**

```bash
npx vitest run server.rateLimit.test.js -t "create-payment-intent"
```

Expected: FAIL — 11th call is not 429.

- [ ] **Step 4: Add the limiter in `server.js`**

Find the existing import of `express-rate-limit` (or add one if not present):

```javascript
import rateLimit from 'express-rate-limit';
```

Define `paymentLimiter` near the top of the route definitions:

```javascript
const paymentLimiter = rateLimit({
  windowMs: 60_000, // 1 minute
  max: 10,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: 'Too many payment requests. Try again in a minute.' },
});
```

Apply to each route. Find lines 245, 291, 334 (or wherever the three `create-*-payment-intent` POST handlers are mounted). Insert `paymentLimiter` as middleware:

```javascript
// Before
app.post('/api/create-payment-intent', async (req, res) => { ... });

// After
app.post('/api/create-payment-intent', paymentLimiter, async (req, res) => { ... });
```

Repeat for `/api/create-london-tour-payment-intent` and `/api/create-misc-payment-intent`.

- [ ] **Step 5: Run the test to confirm it passes**

```bash
npx vitest run server.rateLimit.test.js
```

Expected: PASS.

- [ ] **Step 6: Verify other routes still work**

```bash
npm test 2>&1 | tail -20
```

Expected: no new failures.

- [ ] **Step 7: Commit**

```bash
git add server.js server.rateLimit.test.js
git commit -m "$(cat <<'EOF'
feat(payments): rate-limit 3 create-*-payment-intent endpoints

Adds paymentLimiter (10 req / min / IP) and applies to
/api/create-payment-intent, /api/create-london-tour-payment-intent,
/api/create-misc-payment-intent. Closes the pricing-enumeration +
Firebase-quota-drain attack surface. /api/leads and /api/carts
already had similar limiters.

Co-Authored-By: Claude Opus 4.7 <noreply@anthropic.com>
EOF
)"
```

---

## Task 7: Graceful shutdown

**Files:**
- Modify: `server.js:617` (SIGTERM handler)

Current handler exits immediately on SIGTERM. Cloud Run sends SIGTERM ~10s before revision swap; in-flight webhooks die. Replace with a drain pattern.

- [ ] **Step 1: Locate the current SIGTERM handler**

```bash
grep -n "SIGTERM\|process.on" server.js
```

Note the current code around line 617.

- [ ] **Step 2: Verify the server is captured as a variable**

The `app.listen()` call must be captured, e.g. `const server = app.listen(PORT, ...)`. If it's currently bare (`app.listen(PORT, ...)`), refactor first to capture the return value.

- [ ] **Step 3: Replace the handler**

Use the `Edit` tool. Replace the existing SIGTERM block (and SIGINT if there is one) with:

```javascript
function shutdown(signal) {
  console.log(`${signal} received — starting graceful shutdown`);
  server.close((err) => {
    if (err) {
      console.error('Error during graceful shutdown:', err);
      process.exit(1);
    }
    console.log('All connections drained — exiting');
    process.exit(0);
  });
  // Hard exit after 30s in case something blocks server.close
  setTimeout(() => {
    console.error('Graceful shutdown timed out — forcing exit');
    process.exit(1);
  }, 30_000).unref();
}

process.on('SIGTERM', () => shutdown('SIGTERM'));
process.on('SIGINT', () => shutdown('SIGINT'));
```

(Once Task 10 lands, the `console.*` calls will be replaced by the logger.)

- [ ] **Step 4: Manually verify drain behaviour**

Start the server locally:

```bash
node server.js &
SERVER_PID=$!
```

In another terminal, start a long-running request (use a known slow endpoint or hit `/api/health` once Task 8 lands; for now `/api/leads` with a delayed mock):

```bash
# Start the request, capture its background PID
curl -X POST http://localhost:7500/api/leads \
  -H 'Content-Type: application/json' \
  -d '{}' &
CURL_PID=$!
```

Immediately send SIGTERM:

```bash
kill -TERM $SERVER_PID
```

Wait for both. Expected: the curl request completes (does not hang or error), the server logs the shutdown message, and exits with code 0.

- [ ] **Step 5: Commit**

```bash
git add server.js
git commit -m "$(cat <<'EOF'
feat(shutdown): graceful drain on SIGTERM/SIGINT with 30s timeout

server.js:617 previously exited immediately on SIGTERM, dropping
every in-flight webhook on Cloud Run revision swap. Now calls
server.close() to stop accepting new connections, lets in-flight
requests complete, then exits 0. A 30s setTimeout forces hard exit
if anything blocks the drain.

Co-Authored-By: Claude Opus 4.7 <noreply@anthropic.com>
EOF
)"
```

---

## Task 8: Boot-time env-var assertions + Cloud Run health check

**Files:**
- Modify: `server.js` (extend REQUIRED_ENV)
- Modify: `Dockerfile` (add HEALTHCHECK)

`server.js:11` already validates a `REQUIRED_ENV` list. Audit the actual `process.env.*` reads across the codebase to make sure the list is complete. Then add a `HEALTHCHECK` to Dockerfile so Cloud Run rolls back broken revisions.

- [ ] **Step 1: Inventory env-var usage**

```bash
grep -nrE "process\.env\." server.js api/ | grep -oE "process\.env\.[A-Z_]+" | sort -u
```

Compare the output against `server.js:11`'s `REQUIRED_ENV` array. Note any var that is used in code but missing from `REQUIRED_ENV` — those are candidates for adding (after verifying they really are required vs. optional with a sensible default).

For each candidate, decide:
- If the code has `process.env.X || someDefault` → optional, don't add to REQUIRED_ENV
- If the code does `process.env.X` bare and would NaN / undefined / crash → required, add to REQUIRED_ENV

- [ ] **Step 2: Extend `REQUIRED_ENV` in `server.js:11`**

Use the `Edit` tool. The current `REQUIRED_ENV` array has these (verified earlier in the project): `STRIPE_SECRET_KEY`, `STRIPE_WEBHOOK_SECRET`, `SMTP_HOST`, `SMTP_USER`, `SMTP_PASS`, `EMAIL_FROM`, `SITE_URL`, `FIREBASE_PROJECT_ID`, `FIREBASE_CLIENT_EMAIL`, `FIREBASE_PRIVATE_KEY`.

Add any newly-discovered required vars from Step 1.

- [ ] **Step 3: Add `HEALTHCHECK` to `Dockerfile`**

Read the current `Dockerfile`:

```bash
cat Dockerfile
```

Add a `HEALTHCHECK` directive in the runtime stage (after `CMD`). Use the existing `/api/health` endpoint (verify it exists with `grep -n "/api/health" server.js`):

```dockerfile
HEALTHCHECK --interval=30s --timeout=5s --start-period=10s --retries=3 \
  CMD wget --quiet --tries=1 --spider http://localhost:7500/api/health || exit 1
```

(Install `wget` if not present in `node:20-slim` — it usually is.)

- [ ] **Step 4: Manually verify the healthcheck works**

```bash
docker build -t hq-aviation-server-test .
docker run -d --name hq-test -p 7500:7500 \
  -e NODE_ENV=development \
  hq-aviation-server-test
sleep 15
docker inspect --format='{{.State.Health.Status}}' hq-test
docker stop hq-test && docker rm hq-test
```

Expected: status `healthy`.

- [ ] **Step 5: Commit**

```bash
git add server.js Dockerfile
git commit -m "$(cat <<'EOF'
feat(boot): expand REQUIRED_ENV inventory and add Cloud Run healthcheck

server.js REQUIRED_ENV had drifted from the actual process.env reads
across api/*. Inventoried + added missing required vars so boot
fails loud on misconfig instead of mysterious runtime crashes.
Dockerfile now declares HEALTHCHECK against /api/health so Cloud Run
auto-rolls-back revisions that fail to open the port.

Co-Authored-By: Claude Opus 4.7 <noreply@anthropic.com>
EOF
)"
```

---

## Task 9: helmet + CSP + HSTS (report-only first)

**Files:**
- Modify: `package.json` (add `helmet` dep)
- Modify: `server.js` (mount helmet middleware near the top)

Use the CSP template locked in at `docs/infra-decisions.md §6`. Start in `Report-Only` mode for the first 7 days so violations surface in Sentry without breaking the site.

- [ ] **Step 1: Install helmet**

```bash
npm install helmet
```

Confirm `helmet` is added to `dependencies` in `package.json`.

- [ ] **Step 2: Mount the middleware in `server.js`**

Add to the imports at the top:

```javascript
import helmet from 'helmet';
```

After the helmet import and other security setup, mount the middleware. Place this BEFORE any route definitions (so headers apply to every response, including 404s):

```javascript
app.use(helmet({
  contentSecurityPolicy: false, // mounted manually below in report-only mode
  hsts: {
    maxAge: 31536000, // 1 year
    includeSubDomains: true,
    preload: true,
  },
  // helmet defaults: X-Content-Type-Options, X-Frame-Options, X-DNS-Prefetch-Control,
  // Strict-Transport-Security, X-Download-Options, X-Permitted-Cross-Domain-Policies,
  // Referrer-Policy, etc.
}));

// CSP report-only — per docs/infra-decisions.md §6 template
const cspDirectives = {
  'default-src': ["'self'"],
  'script-src': ["'self'", 'https://js.stripe.com'],
  'connect-src': [
    "'self'",
    'https://api.stripe.com',
    'https://*.googleapis.com',
    'https://*.firebaseio.com',
    'https://o*.ingest.sentry.io',
  ],
  'frame-src': ["'self'", 'https://js.stripe.com', 'https://hooks.stripe.com'],
  'img-src': ["'self'", 'data:', 'https:'],
  'style-src': [
    "'self'",
    "'unsafe-inline'",
    'https://fonts.googleapis.com',
    'https://cdnjs.cloudflare.com',
  ],
  'font-src': [
    "'self'",
    'https://fonts.gstatic.com',
    'https://cdnjs.cloudflare.com',
    'data:',
  ],
  'object-src': ["'none'"],
  'base-uri': ["'self'"],
  'form-action': ["'self'"],
  'frame-ancestors': ["'self'"],
  'upgrade-insecure-requests': [],
};

// Stringify into a CSP header value
function cspHeaderValue(directives) {
  return Object.entries(directives)
    .map(([key, values]) =>
      values.length === 0 ? key : `${key} ${values.join(' ')}`
    )
    .join('; ');
}

app.use((req, res, next) => {
  res.setHeader('Content-Security-Policy-Report-Only', cspHeaderValue(cspDirectives));
  next();
});
```

(Once Sentry is wired in Task 11, add a `report-uri` directive pointing to Sentry's CSP ingest. For now, report-only without an endpoint just makes browsers log to console — still safer than enforcing.)

- [ ] **Step 3: Smoke-test the headers**

```bash
node server.js &
SERVER_PID=$!
sleep 2
curl -sI http://localhost:7500/ | grep -iE "content-security-policy|strict-transport|x-frame-options|x-content-type"
kill $SERVER_PID
```

Expected: at least these headers appear:
- `Content-Security-Policy-Report-Only: default-src 'self'; ...`
- `Strict-Transport-Security: max-age=31536000; includeSubDomains; preload`
- `X-Content-Type-Options: nosniff`
- `X-Frame-Options: SAMEORIGIN` (helmet default)

- [ ] **Step 4: Write a test**

Extend `api/stripe.test.js` (or create `server.headers.test.js`):

```javascript
import { describe, it, expect } from 'vitest';
import request from 'supertest';
import { createTestApp } from './api/test-setup.js';

describe('security headers', () => {
  it('sets HSTS, CSP-Report-Only, and X-Content-Type-Options', async () => {
    const app = await createTestApp();
    const res = await request(app).get('/');
    expect(res.headers['strict-transport-security']).toMatch(/max-age=31536000/);
    expect(res.headers['content-security-policy-report-only']).toMatch(/default-src 'self'/);
    expect(res.headers['x-content-type-options']).toBe('nosniff');
  });
});
```

- [ ] **Step 5: Run the test**

```bash
npx vitest run server.headers.test.js
```

Expected: PASS.

- [ ] **Step 6: Commit**

```bash
git add package.json package-lock.json server.js server.headers.test.js
git commit -m "$(cat <<'EOF'
feat(security): mount helmet + CSP (report-only) + HSTS

Installs helmet and mounts it before all routes. CSP directives
follow docs/infra-decisions.md §6 template (Stripe, Firebase, Sentry
ingest, Google Fonts, Cloudflare CDN for Font Awesome). Starts in
Content-Security-Policy-Report-Only mode for the 7-day soak; switch
to enforce after Sentry is wired (Task 11) so violations are visible
before enforcement. HSTS 1-year preload-eligible.

Co-Authored-By: Claude Opus 4.7 <noreply@anthropic.com>
EOF
)"
```

---

### Sub-phase 1B checkpoint

After Task 9, the server has boot guards, signature checks, payment rate limits, graceful shutdown, env-var assertions, healthcheck, and helmet/CSP/HSTS. Optionally merge `feat/phase-1-hardening` (or open a sub-PR for 1B-only) before starting observability work — the changes so far are independent and don't depend on 1C.

---

# Sub-phase 1C — Observability

Four tasks. Foundation first (logger), then error reporting, then release tagging.

## Task 10: Structured logger (pino)

**Files:**
- Modify: `package.json` (add `pino`)
- Create: `api/lib/logger.js`
- Modify: `server.js` + every `api/*.js` that uses `console.log` / `console.error`

- [ ] **Step 1: Install pino**

```bash
npm install pino
```

- [ ] **Step 2: Create the logger module**

Create `api/lib/logger.js`:

```javascript
import pino from 'pino';

const logger = pino({
  level: process.env.LOG_LEVEL || (process.env.NODE_ENV === 'production' ? 'info' : 'debug'),
  formatters: {
    level: (label) => ({ level: label }),
  },
  base: {
    service: 'hq-aviation-server',
    release: process.env.GIT_REV || 'unknown',
  },
});

export default logger;

/**
 * Create a child logger with a fixed context (e.g. requestId, route).
 * @param {Record<string, any>} bindings
 */
export function child(bindings) {
  return logger.child(bindings);
}
```

- [ ] **Step 3: Inventory `console.*` calls**

```bash
grep -rnE "console\.(log|error|warn|info|debug)" server.js api/ | wc -l
grep -rnE "console\.(log|error|warn|info|debug)" server.js api/ > /tmp/console-calls.txt
```

Note the count and review `/tmp/console-calls.txt`.

- [ ] **Step 4: Replace `console.*` in `server.js`**

For each `console.log` / `console.info` → `logger.info`. Each `console.error` → `logger.error`. Each `console.warn` → `logger.warn`.

For one-arg calls (`console.log('hello')`), the replacement is `logger.info('hello')`.

For multi-arg calls with formatted strings (`console.log('foo:', x)`), restructure to pino's `(obj, msg)` signature: `logger.info({ foo: x }, 'foo')`.

For error logging with an Error object (`console.error('failed:', err)`), use: `logger.error({ err }, 'failed')`. pino auto-serialises the error.

Add the import at the top of `server.js`:

```javascript
import logger from './api/lib/logger.js';
```

- [ ] **Step 5: Replace `console.*` in each `api/*.js` file**

Repeat the migration for every file in `/tmp/console-calls.txt`. Do not change files in `node_modules/`, `dist/`, or test files (test runners like vitest expect `console.*`).

For each file, add at the top:

```javascript
import logger from './lib/logger.js'; // adjust depth as needed
```

- [ ] **Step 6: Smoke test**

```bash
NODE_ENV=development node server.js &
SERVER_PID=$!
sleep 2
curl -s http://localhost:7500/api/health
kill $SERVER_PID
```

Expected: server output is JSON lines, e.g.:
```json
{"level":"info","time":1746014400000,"service":"hq-aviation-server","release":"unknown","msg":"Server listening on port 7500"}
```

- [ ] **Step 7: Run the full test suite to catch regressions**

```bash
npm test 2>&1 | tail -20
```

Expected: tests pass.

- [ ] **Step 8: Commit**

```bash
git add package.json package-lock.json api/lib/logger.js server.js api/
git commit -m "$(cat <<'EOF'
feat(logger): replace console.* with pino across server and api/*

New api/lib/logger.js exports a configured pino instance with
{service, release} bindings. Every console.log/error/warn/info call
in server.js and api/*.js migrated to logger.* with pino's
(obj, msg) signature so structured fields ride alongside the message.
Cloud Run auto-indexes the JSON. Foundation for Sentry breadcrumbs
and per-request structured context in later tasks.

Co-Authored-By: Claude Opus 4.7 <noreply@anthropic.com>
EOF
)"
```

---

## Task 11: Sentry server-side wiring

**Files:**
- Modify: `package.json` (add `@sentry/node`)
- Create: `api/lib/sentry.js`
- Modify: `server.js` (init + middleware)
- Modify: `server.js` CSP header (add `report-uri` to Sentry ingest)

- [ ] **Step 1: Install `@sentry/node`**

```bash
npm install @sentry/node
```

- [ ] **Step 2: Create the Sentry init wrapper**

Create `api/lib/sentry.js`:

```javascript
import * as Sentry from '@sentry/node';

/**
 * Initialise Sentry for the Express server. No-op if SENTRY_DSN is not set.
 */
export function initSentry() {
  const dsn = process.env.SENTRY_DSN;
  if (!dsn) {
    console.warn('SENTRY_DSN not set — Sentry server-side disabled');
    return false;
  }

  Sentry.init({
    dsn,
    release: process.env.GIT_REV || 'unknown',
    environment: process.env.NODE_ENV || 'development',
    tracesSampleRate: 0.1,
    sendDefaultPii: false,
  });

  return true;
}

export { Sentry };
```

- [ ] **Step 3: Wire into `server.js`**

At the top of `server.js`, BEFORE any other middleware, after the `import` statements:

```javascript
import { initSentry, Sentry } from './api/lib/sentry.js';

initSentry();

// Sentry request handler must be the FIRST middleware
app.use(Sentry.Handlers.requestHandler());
```

After all routes, BEFORE the final 404 / error handler:

```javascript
// Sentry error handler must be BEFORE other error-handling middleware
app.use(Sentry.Handlers.errorHandler());
```

- [ ] **Step 4: Add Sentry CSP report-uri to the CSP header**

In `server.js`, update the `cspDirectives` from Task 9. Add a `report-uri` directive (only if `SENTRY_DSN` is set, since the report-uri depends on the DSN). Replace the existing `cspDirectives` object initialisation with:

```javascript
const sentryDsn = process.env.SENTRY_DSN || '';
// Derive Sentry CSP report URI from DSN: https://<key>@o<org>.ingest.sentry.io/<project>
// becomes: https://o<org>.ingest.sentry.io/api/<project>/security/?sentry_key=<key>
let cspReportUri = null;
if (sentryDsn) {
  const m = sentryDsn.match(/^https:\/\/([^@]+)@(o\d+\.ingest\.sentry\.io)\/(\d+)/);
  if (m) {
    cspReportUri = `https://${m[2]}/api/${m[3]}/security/?sentry_key=${m[1]}`;
  }
}

const cspDirectives = {
  'default-src': ["'self'"],
  // ... existing directives unchanged ...
  ...(cspReportUri && { 'report-uri': [cspReportUri] }),
};
```

- [ ] **Step 5: Manually verify with a real DSN**

Set `SENTRY_DSN` to your test project's DSN in a local `.env.test` (do NOT commit). Run:

```bash
SENTRY_DSN=https://test-dsn@o123.ingest.sentry.io/456 node server.js &
SERVER_PID=$!
sleep 2

# Trigger an error route — if no error route exists, hit a 404
curl -s http://localhost:7500/api/this-route-does-not-exist

kill $SERVER_PID
```

Then check the Sentry test project — there should be a captured exception or 404 event.

- [ ] **Step 6: Write a test that confirms Sentry is initialised when DSN is set**

Create `api/lib/sentry.test.js`:

```javascript
import { describe, it, expect, afterEach } from 'vitest';
import { initSentry } from './sentry.js';

describe('initSentry', () => {
  const originalDsn = process.env.SENTRY_DSN;
  afterEach(() => {
    if (originalDsn === undefined) delete process.env.SENTRY_DSN;
    else process.env.SENTRY_DSN = originalDsn;
  });

  it('returns false and warns when SENTRY_DSN is not set', () => {
    delete process.env.SENTRY_DSN;
    expect(initSentry()).toBe(false);
  });

  it('returns true when SENTRY_DSN is set', () => {
    process.env.SENTRY_DSN = 'https://x@o1.ingest.sentry.io/1';
    expect(initSentry()).toBe(true);
  });
});
```

- [ ] **Step 7: Run tests**

```bash
npx vitest run api/lib/sentry.test.js
npm test 2>&1 | tail -10
```

Expected: PASS.

- [ ] **Step 8: Commit**

```bash
git add package.json package-lock.json api/lib/sentry.js api/lib/sentry.test.js server.js
git commit -m "$(cat <<'EOF'
feat(sentry): wire @sentry/node into Express server

Adds api/lib/sentry.js that initialises Sentry when SENTRY_DSN is
set (no-op otherwise). Mounts Sentry.Handlers.requestHandler as the
first middleware and errorHandler before the final error path.
Derives the CSP report-uri from the DSN format and adds it to the
report-only CSP header so violations now flow to Sentry. release
field tagged with process.env.GIT_REV (populated in Task 13).

Co-Authored-By: Claude Opus 4.7 <noreply@anthropic.com>
EOF
)"
```

---

## Task 12: Sentry React-side + ErrorBoundary

**Files:**
- Modify: `package.json` (add `@sentry/react`)
- Create: `src/lib/sentry.js`
- Modify: `src/main.jsx` (init + wrap App in ErrorBoundary)

- [ ] **Step 1: Install `@sentry/react`**

```bash
npm install @sentry/react
```

- [ ] **Step 2: Create `src/lib/sentry.js`**

```javascript
import * as Sentry from '@sentry/react';

/**
 * Initialise Sentry for the React SPA. No-op if VITE_SENTRY_DSN is not set.
 */
export function initSentry() {
  const dsn = import.meta.env.VITE_SENTRY_DSN;
  if (!dsn) return false;

  Sentry.init({
    dsn,
    release: import.meta.env.VITE_GIT_REV || 'unknown',
    environment: import.meta.env.MODE,
    integrations: [
      Sentry.browserTracingIntegration(),
    ],
    tracesSampleRate: 0.1,
    sendDefaultPii: false,
  });

  return true;
}

export { Sentry };
```

- [ ] **Step 3: Wire into `src/main.jsx`**

Read the current `src/main.jsx`:

```bash
cat src/main.jsx
```

Add the Sentry init at the very top, then wrap `<App />` in `<Sentry.ErrorBoundary>`:

```javascript
import { initSentry, Sentry } from './lib/sentry.js';
initSentry();

// ... existing imports ...

const root = createRoot(document.getElementById('root'));
root.render(
  <Sentry.ErrorBoundary fallback={<div style={{padding:'2rem'}}>Something went wrong. Refresh the page.</div>}>
    <StrictMode>
      <App />
    </StrictMode>
  </Sentry.ErrorBoundary>
);
```

(Adjust the existing `root.render(...)` structure to match.)

- [ ] **Step 4: Add the env var to `.env.example`**

Append to `.env.example`:

```
# Sentry client-side DSN. Same project as SENTRY_DSN but exposed to the client.
VITE_SENTRY_DSN=

# Git rev injected at build time (build script populates).
VITE_GIT_REV=
```

- [ ] **Step 5: Build to verify nothing breaks**

```bash
npm run build 2>&1 | tail -20
```

Expected: build succeeds. Output bundle size should be modest (Sentry React SDK is ~30KB gz).

- [ ] **Step 6: Commit**

```bash
git add package.json package-lock.json src/lib/sentry.js src/main.jsx .env.example
git commit -m "$(cat <<'EOF'
feat(sentry): wire @sentry/react with ErrorBoundary

Adds src/lib/sentry.js that initialises Sentry when VITE_SENTRY_DSN
is set. Wraps the App tree in Sentry.ErrorBoundary so any
component crash now reports to Sentry and renders a graceful
fallback instead of a white screen. release tagged with
VITE_GIT_REV (populated in Task 13). .env.example updated.

Co-Authored-By: Claude Opus 4.7 <noreply@anthropic.com>
EOF
)"
```

---

## Task 13: Release tagging via `--build-arg GIT_REV`

**Files:**
- Modify: `Dockerfile`
- Modify: `package.json` (deploy script)
- Modify: `vite.config.js` (read `GIT_REV` from the shell env at build time)

- [ ] **Step 1: Update Dockerfile to accept GIT_REV**

Read the current Dockerfile:

```bash
cat Dockerfile
```

Add at the top of the builder stage (or wherever env vars are set):

```dockerfile
ARG GIT_REV=unknown
ENV GIT_REV=$GIT_REV
```

Repeat in the runtime stage so the env var is available at runtime.

- [ ] **Step 2: Update the deploy script**

Read the current script:

```bash
grep -A 1 '"deploy:server"' package.json
```

The current script is:

```
"deploy:server": "docker build --platform linux/amd64 -t europe-west2-docker.pkg.dev/hq-website-4abc7/hq-aviation/server:latest . && docker push europe-west2-docker.pkg.dev/hq-website-4abc7/hq-aviation/server:latest && gcloud run deploy hq-aviation-server --image=europe-west2-docker.pkg.dev/hq-website-4abc7/hq-aviation/server:latest --region=europe-west2"
```

Change the `docker build` portion to pass `--build-arg GIT_REV=$(git rev-parse --short HEAD)`:

```
"deploy:server": "GIT_REV=$(git rev-parse --short HEAD) && docker build --build-arg GIT_REV=$GIT_REV --platform linux/amd64 -t europe-west2-docker.pkg.dev/hq-website-4abc7/hq-aviation/server:$GIT_REV -t europe-west2-docker.pkg.dev/hq-website-4abc7/hq-aviation/server:latest . && docker push --all-tags europe-west2-docker.pkg.dev/hq-website-4abc7/hq-aviation/server && gcloud run deploy hq-aviation-server --image=europe-west2-docker.pkg.dev/hq-website-4abc7/hq-aviation/server:$GIT_REV --region=europe-west2 --set-env-vars=GIT_REV=$GIT_REV"
```

Notes:
- Tags the image with both `$GIT_REV` and `latest` for traceability.
- Sets `GIT_REV` as a Cloud Run env var so the running process can read it.

- [ ] **Step 3: Inject `VITE_GIT_REV` at build time via shell env**

This is the safest pattern — the deploy script (or any developer running a build) sets `GIT_REV` as a shell env var, then `vite.config.js` reads `process.env.GIT_REV` and exposes it as `import.meta.env.VITE_GIT_REV`. No `execSync` needed inside the config file.

Read `vite.config.js`:

```bash
cat vite.config.js
```

Update the export to add a `define` block:

```javascript
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  define: {
    // Read GIT_REV from the build shell env; default to 'unknown' if absent.
    'import.meta.env.VITE_GIT_REV': JSON.stringify(process.env.GIT_REV || 'unknown'),
  },
  // ... existing config ...
});
```

Add a build script wrapper in `package.json` so the rev is always populated:

```json
"build": "GIT_REV=$(git rev-parse --short HEAD 2>/dev/null || echo unknown) vite build"
```

(Replace the existing `"build": "vite build"` line.)

- [ ] **Step 4: Verify the build picks up GIT_REV**

```bash
npm run build 2>&1 | tail -5
grep -o "VITE_GIT_REV[\"']\?:\s*[\"'][a-f0-9]*" dist/assets/*.js | head -3
```

Expected: the built bundle contains the short git rev as a string literal (e.g. `VITE_GIT_REV":"a1b2c3d"`).

- [ ] **Step 5: Verify Sentry release tagging**

Once deployed (manual / staging step), trigger a server error and check the Sentry event's `release` field. Expected: the short git rev, not `unknown`.

- [ ] **Step 6: Commit**

```bash
git add Dockerfile package.json vite.config.js
git commit -m "$(cat <<'EOF'
feat(release): tag deploys with short git rev for Sentry release field

Dockerfile gains ARG GIT_REV + ENV GIT_REV. deploy:server script
passes --build-arg GIT_REV and tags the image with the rev (in
addition to :latest). package.json build script wraps `vite build`
to set GIT_REV from the shell. vite.config.js reads
process.env.GIT_REV and injects it into the client bundle as
import.meta.env.VITE_GIT_REV. Without this, every error in Sentry
says 'release: unknown'.

Co-Authored-By: Claude Opus 4.7 <noreply@anthropic.com>
EOF
)"
```

---

### Sub-phase 1C checkpoint

Logger, server Sentry, React Sentry, release tagging — all wired. Every silent failure now becomes a tagged Sentry event within 60s. Optionally merge / open PR for 1C.

---

# Sub-phase 1D — Data security + staging environment

Four tasks. Firestore rules first (data security), then the multi-day staging env.

## Task 14: Firestore rules tightening + unit tests

**Files:**
- Modify: `firestore.rules`
- Create: `firestore-rules.test.js`
- Modify: `package.json` (add `@firebase/rules-unit-testing` to devDeps; add `test:rules` script)

- [ ] **Step 1: Install the rules testing library**

```bash
npm install --save-dev @firebase/rules-unit-testing
```

- [ ] **Step 2: Inventory current rules and code-referenced collections**

```bash
cat firestore.rules
grep -rE "collection\(['\"]" api/ src/ | grep -oE "collection\(['\"][a-zA-Z_]+" | sort -u
```

Note which collections the code touches vs. which have explicit rules. Identify gaps.

- [ ] **Step 3: Tighten `firestore.rules`**

Add explicit deny rules for server-only collections that should never be touched from the client. At minimum:

```
match /referral_codes/{id} {
  allow read, write: if false;
}
```

Add field-level validation on user-create paths. Example for `enquiries`:

```
match /enquiries/{id} {
  allow create: if request.resource.data.keys().hasOnly(['email', 'name', 'message', 'createdAt'])
    && request.resource.data.email is string
    && request.resource.data.name is string
    && request.resource.data.message is string;
  // existing read/update/delete rules unchanged
}
```

Repeat the pattern for `bookings`, `leads`, `carts`, `parts_enquiries`, `misc_marketplace` — using the actual field shape each collection expects (cross-check `api/lib/*Schema.js` files).

- [ ] **Step 4: Write the test suite**

Create `firestore-rules.test.js`:

```javascript
import { describe, it, expect, beforeAll, afterAll, beforeEach } from 'vitest';
import {
  initializeTestEnvironment,
  assertSucceeds,
  assertFails,
} from '@firebase/rules-unit-testing';
import { readFileSync } from 'node:fs';
import { setDoc, doc, getDoc } from 'firebase/firestore';

let testEnv;

beforeAll(async () => {
  testEnv = await initializeTestEnvironment({
    projectId: 'hq-aviation-test',
    firestore: {
      rules: readFileSync('firestore.rules', 'utf8'),
      host: '127.0.0.1',
      port: 8080,
    },
  });
});

afterAll(async () => {
  await testEnv.cleanup();
});

beforeEach(async () => {
  await testEnv.clearFirestore();
});

describe('firestore.rules — public surface', () => {
  it('anonymous user can create an enquiry with valid fields', async () => {
    const anon = testEnv.unauthenticatedContext().firestore();
    await assertSucceeds(setDoc(doc(anon, 'enquiries/abc'), {
      email: 'x@example.com',
      name: 'Test',
      message: 'Hi',
      createdAt: new Date(),
    }));
  });

  it('anonymous user cannot create an enquiry with an unknown field', async () => {
    const anon = testEnv.unauthenticatedContext().firestore();
    await assertFails(setDoc(doc(anon, 'enquiries/abc'), {
      email: 'x@example.com',
      name: 'Test',
      message: 'Hi',
      createdAt: new Date(),
      isAdmin: true, // unknown field
    }));
  });

  it('anonymous user cannot read bookings', async () => {
    const anon = testEnv.unauthenticatedContext().firestore();
    await assertFails(getDoc(doc(anon, 'bookings/abc')));
  });

  it('anonymous user cannot read or write referral_codes', async () => {
    const anon = testEnv.unauthenticatedContext().firestore();
    await assertFails(getDoc(doc(anon, 'referral_codes/abc')));
    await assertFails(setDoc(doc(anon, 'referral_codes/abc'), { x: 1 }));
  });
});

describe('firestore.rules — admin surface', () => {
  it('non-admin authenticated user cannot write to /admin/* paths', async () => {
    const user = testEnv.authenticatedContext('alice', { role: 'viewer' }).firestore();
    // example admin collection — adjust to match actual rules
    await assertFails(setDoc(doc(user, 'admin/faqs/q1'), { question: 'x', answer: 'y' }));
  });

  it('admin-role authenticated user can write to admin paths', async () => {
    const admin = testEnv.authenticatedContext('quentin', { role: 'admin' }).firestore();
    await assertSucceeds(setDoc(doc(admin, 'admin/faqs/q1'), { question: 'x', answer: 'y' }));
  });
});
```

(Adjust collection paths to match the actual rules — the example assumes `/admin/faqs/{id}`; the real path may differ.)

- [ ] **Step 5: Add a `test:rules` script to `package.json`**

```json
"scripts": {
  "test:rules": "firebase emulators:exec --only firestore 'vitest run firestore-rules.test.js'"
}
```

(Requires `firebase-tools` to be available — add as a devDep if not already: `npm install --save-dev firebase-tools`.)

- [ ] **Step 6: Run the rules tests against the emulator**

```bash
npm run test:rules
```

Expected: all rules tests pass.

If the Firestore emulator isn't installed: `firebase setup:emulators:firestore` (one-time).

- [ ] **Step 7: Add `test:rules` to CI workflows (deferred or now)**

Optional for this task — running the rules tests in CI requires the emulator binary on the runner. Document the setup steps in the workflow YAML if adding, otherwise leave a comment in `package.json` saying these tests run locally pre-push.

- [ ] **Step 8: Commit**

```bash
git add firestore.rules firestore-rules.test.js package.json package-lock.json
git commit -m "$(cat <<'EOF'
feat(firestore): tighten rules + add unit-test suite

firestore.rules: explicit deny on /referral_codes/{id}; field-level
validation on enquiries, bookings, leads, carts, parts_enquiries,
misc_marketplace (allow create only with the expected key set).
firestore-rules.test.js exercises the rules against the Firestore
emulator. npm run test:rules runs the suite. Closes the
data-exposure surface flagged in the audit.

Co-Authored-By: Claude Opus 4.7 <noreply@anthropic.com>
EOF
)"
```

---

## Task 15: Stand up staging Firebase + GCP project

**Files:**
- No file changes in this task — this is infrastructure setup. The artefact is a new GCP project, new Firebase project, and a record in `docs/seo/staging-deployment-guide.md` (created in Task 17).

This task is multi-day, involves billing setup, and requires the GCP / Firebase console. Cannot be fully automated.

- [ ] **Step 1: Create the GCP project**

```bash
gcloud projects create hq-aviation-staging --name="HQ Aviation Staging"
gcloud config set project hq-aviation-staging
```

(Project ID must be globally unique. If `hq-aviation-staging` is taken, append a suffix like `-uk` or the org's identifier.)

- [ ] **Step 2: Link a billing account**

```bash
gcloud billing accounts list
gcloud billing projects link hq-aviation-staging --billing-account=<billing-account-id>
```

Set a budget alert to catch surprises:

```bash
gcloud billing budgets create \
  --billing-account=<billing-account-id> \
  --display-name="hq-aviation-staging $30/mo cap" \
  --budget-amount=30 \
  --threshold-rule=percent=0.5 \
  --threshold-rule=percent=0.9 \
  --filter-projects=projects/hq-aviation-staging
```

- [ ] **Step 3: Enable required APIs**

```bash
gcloud services enable \
  run.googleapis.com \
  cloudbuild.googleapis.com \
  artifactregistry.googleapis.com \
  firestore.googleapis.com \
  firebase.googleapis.com \
  firebasehosting.googleapis.com \
  identitytoolkit.googleapis.com \
  secretmanager.googleapis.com
```

- [ ] **Step 4: Create the Firebase project linked to the GCP project**

In the Firebase console:
1. Add Firebase to GCP project → select `hq-aviation-staging`.
2. Set the default GCP location to `europe-west2`.
3. Initialise Firestore in production mode (rules will deploy from `firestore.rules` in Task 16).
4. Initialise Firebase Auth (email/password + Google providers — mirror production).
5. Initialise Firebase Storage with the default bucket.
6. Add the staging Firebase web app: register, copy the config object — needed for Task 16 staging env vars.

- [ ] **Step 5: Create an Artifact Registry repository for staging images**

```bash
gcloud artifacts repositories create hq-aviation-staging \
  --repository-format=docker \
  --location=europe-west2 \
  --description="Staging Cloud Run images for hq-aviation-server-staging"
```

- [ ] **Step 6: Provision secrets in Secret Manager**

For each required env var, create a secret in the staging project. Use Stripe **test mode** credentials (different from production).

```bash
echo -n "sk_test_staging_secret_here" | gcloud secrets create STRIPE_SECRET_KEY --data-file=- --project=hq-aviation-staging
echo -n "whsec_staging_secret_here" | gcloud secrets create STRIPE_WEBHOOK_SECRET --data-file=- --project=hq-aviation-staging
```

Repeat for: `EMAIL_FROM`, `SMTP_HOST`, `SMTP_USER`, `SMTP_PASS`, `FIREBASE_PRIVATE_KEY`, `FIREBASE_CLIENT_EMAIL`, `FIREBASE_PROJECT_ID`, `SITE_URL`, `SENTRY_DSN`.

- [ ] **Step 7: Document state**

Write a note (will land in Task 17's guide) recording: project ID, billing account, region, artifact registry path, the secrets created. This is the operator's checklist for "is staging up?".

- [ ] **Step 8: Commit (no file changes — task tracks infra state)**

This task produces no commit. It produces a working GCP/Firebase staging project. Task 17 commits the documentation.

---

## Task 16: Stand up staging Cloud Run + Stripe test webhook + DNS

**Files:**
- Modify: `package.json` (add `deploy:server:staging` script)

This task deploys the existing server image to the staging GCP project, points a Stripe test-mode webhook at it, and routes a DNS subdomain to Firebase Hosting → Cloud Run.

- [ ] **Step 1: Add the staging deploy script**

In `package.json`, add:

```json
"deploy:server:staging": "GIT_REV=$(git rev-parse --short HEAD) && docker build --build-arg GIT_REV=$GIT_REV --platform linux/amd64 -t europe-west2-docker.pkg.dev/hq-aviation-staging/hq-aviation-staging/server:$GIT_REV -t europe-west2-docker.pkg.dev/hq-aviation-staging/hq-aviation-staging/server:latest . && docker push --all-tags europe-west2-docker.pkg.dev/hq-aviation-staging/hq-aviation-staging/server && gcloud run deploy hq-aviation-server-staging --image=europe-west2-docker.pkg.dev/hq-aviation-staging/hq-aviation-staging/server:$GIT_REV --region=europe-west2 --project=hq-aviation-staging --set-env-vars=GIT_REV=$GIT_REV,NODE_ENV=staging --set-secrets=STRIPE_SECRET_KEY=STRIPE_SECRET_KEY:latest,STRIPE_WEBHOOK_SECRET=STRIPE_WEBHOOK_SECRET:latest,SENTRY_DSN=SENTRY_DSN:latest,SMTP_HOST=SMTP_HOST:latest,SMTP_USER=SMTP_USER:latest,SMTP_PASS=SMTP_PASS:latest,EMAIL_FROM=EMAIL_FROM:latest,SITE_URL=SITE_URL:latest,FIREBASE_PROJECT_ID=FIREBASE_PROJECT_ID:latest,FIREBASE_CLIENT_EMAIL=FIREBASE_CLIENT_EMAIL:latest,FIREBASE_PRIVATE_KEY=FIREBASE_PRIVATE_KEY:latest"
```

- [ ] **Step 2: Deploy staging once**

```bash
npm run deploy:server:staging 2>&1 | tail -20
```

Expected: build succeeds, image pushed, Cloud Run revision deployed. Note the Cloud Run service URL (e.g. `https://hq-aviation-server-staging-xyz-ew.a.run.app`).

- [ ] **Step 3: Create the Stripe test-mode webhook endpoint**

In the Stripe Dashboard:
1. Switch to test mode.
2. Add a webhook endpoint pointing at `https://<staging-service-url>/api/webhook`.
3. Select events: `payment_intent.succeeded`, `payment_intent.payment_failed`, `charge.dispute.created`, plus any other events the production endpoint listens to (mirror production exactly).
4. Copy the signing secret (`whsec_...`).
5. Update the `STRIPE_WEBHOOK_SECRET` secret in Secret Manager with this value, then redeploy:

```bash
echo -n "the_new_test_secret_here" | gcloud secrets versions add STRIPE_WEBHOOK_SECRET --data-file=- --project=hq-aviation-staging
npm run deploy:server:staging
```

- [ ] **Step 4: Deploy Firestore rules to staging**

```bash
firebase deploy --only firestore:rules --project hq-aviation-staging
```

- [ ] **Step 5: Configure DNS (manual, depends on registrar)**

In the DNS registrar:
1. Add a CNAME record for `staging.<production-domain>` → the Firebase Hosting target for the staging project.
2. In Firebase console for `hq-aviation-staging`, add the custom domain.
3. Verify the DNS challenge (DNS TXT record from Firebase).

(If the production domain isn't yet locked, this step can be deferred — the Cloud Run service URL is usable as a temporary alternative.)

- [ ] **Step 6: Smoke test staging**

```bash
curl -s https://staging.<domain>/api/health
# Or: curl -s https://<cloud-run-url>/api/health
```

Expected: 200 OK.

Then trigger a test payment flow end-to-end with a Stripe test card (`4242 4242 4242 4242`). Confirm:
- Cloud Run logs show the request.
- Stripe dashboard shows the test charge.
- Firestore `bookings/` collection in staging shows the new doc.
- Webhook delivered (Stripe dashboard → webhooks → recent deliveries).

- [ ] **Step 7: Commit**

```bash
git add package.json
git commit -m "$(cat <<'EOF'
feat(deploy): add deploy:server:staging script

Builds + pushes + deploys to the hq-aviation-staging GCP project's
Cloud Run service. Wires all required env vars via Secret Manager
(--set-secrets). Mirror of deploy:server with staging-specific
project, image registry, and service name. End-to-end Stripe test
flow validated against the staging webhook endpoint.

Co-Authored-By: Claude Opus 4.7 <noreply@anthropic.com>
EOF
)"
```

---

## Task 17: Staging promotion runbook

**Files:**
- Create: `docs/seo/staging-deployment-guide.md`

Capture the full setup + promotion procedure so the next operator doesn't have to reverse-engineer it.

- [ ] **Step 1: Write the guide**

Create `docs/seo/staging-deployment-guide.md`:

```markdown
# Staging deployment guide

> The staging environment (`hq-aviation-staging` GCP + Firebase project) is the
> validation gate for every change before production. This guide is the
> runbook for setting it up (one-time) and using it (every deploy).

Updated 2026-05-12.

## What staging is

- **GCP project:** `hq-aviation-staging` in region `europe-west2`.
- **Firebase project:** `hq-aviation-staging` (Auth + Firestore + Hosting + Storage).
- **Cloud Run service:** `hq-aviation-server-staging`.
- **Stripe mode:** test-mode keys (`sk_test_*`, separate webhook endpoint with its own `whsec_`).
- **DNS:** `staging.<production-domain>` (or the raw Cloud Run URL if domain not yet provisioned).
- **Secrets:** GCP Secret Manager, scoped to the staging project.

## One-time setup (operator)

See Task 15 of `docs/superpowers/plans/2026-05-12-phase-1-hardening.md` for the full step-by-step. Summary:

1. `gcloud projects create hq-aviation-staging`.
2. Link billing + set $30/mo budget alert.
3. Enable APIs: run, cloudbuild, artifactregistry, firestore, firebase, firebasehosting, identitytoolkit, secretmanager.
4. Firebase: add Firebase to the GCP project; init Firestore (production mode), Auth (mirror prod providers), Hosting, Storage.
5. Artifact Registry: `gcloud artifacts repositories create hq-aviation-staging --repository-format=docker --location=europe-west2`.
6. Secrets: create each required env var in Secret Manager (Stripe test keys, SMTP creds, Firebase admin SDK, SENTRY_DSN, EMAIL_FROM, SITE_URL).
7. Stripe: create a test-mode webhook endpoint pointed at the Cloud Run service URL; mirror prod event types; save the signing secret to Secret Manager.
8. DNS: CNAME `staging.<domain>` → Firebase Hosting target; verify in Firebase console.

## Deploying to staging

```bash
npm run deploy:server:staging
```

This builds the image with `--build-arg GIT_REV=<short SHA>`, pushes to Artifact Registry, and rolls out a new Cloud Run revision. Env vars are pulled from Secret Manager.

## Promotion: staging → production

After validating a change on staging:

1. Tag the commit that proved out:
   ```bash
   git tag -a v1.x.y -m "Promotion candidate $(date -u +%Y-%m-%d)"
   git push origin v1.x.y
   ```
2. Deploy to production:
   ```bash
   npm run deploy:server
   ```
3. Monitor the production Cloud Run revision for 30 minutes via Sentry + logs.
4. If issues surface, roll back:
   ```bash
   gcloud run revisions list --service=hq-aviation-server --region=europe-west2
   gcloud run services update-traffic hq-aviation-server --to-revisions=<previous-revision>=100 --region=europe-west2
   ```

## Validation checklist before promoting

Before running `npm run deploy:server`, confirm against staging:

- [ ] All routes load without console errors.
- [ ] A test Stripe payment succeeds end-to-end (4242 4242 4242 4242).
- [ ] The webhook reaches Cloud Run and writes to Firestore.
- [ ] The confirmation email is sent (check SMTP outbox or the email inbox you configured).
- [ ] Sentry shows the deploy under the new release tag.
- [ ] CSP report-only flags are zero (no new violations).
- [ ] Lighthouse mobile Performance ≥ 90 on `/`, `/training/trial-lessons`, `/aircraft/r66`.

## Costs

Staging is expected to cost $5–$20/month under normal load. Budget alert at $30 fires before that becomes a surprise.

## When staging is unavailable

If staging is down or being reset, every payment-flow change MUST be tested locally against the Stripe CLI's webhook forwarding (`stripe listen --forward-to localhost:7500/api/webhook`) before going to production.
```

- [ ] **Step 2: Cross-check that every link, command, and project ID matches reality**

Verify:
- The actual GCP project ID matches what's used in `package.json` `deploy:server:staging`.
- The Cloud Run service name matches.
- The Stripe webhook events listed match what production uses (cross-check with `grep -nE "event\.type|payment_intent\." api/stripe.js`).

- [ ] **Step 3: Commit**

```bash
git add docs/seo/staging-deployment-guide.md
git commit -m "$(cat <<'EOF'
docs(staging): full deployment + promotion runbook

One-time setup (GCP project, billing, APIs, Firebase, Artifact
Registry, secrets, Stripe webhook, DNS), the npm run
deploy:server:staging command, the staging-to-prod promotion
procedure (tag, deploy, monitor, roll back), the
pre-promotion validation checklist, and cost expectations.
Reads alongside Task 15/16 of the Phase 1 plan.

Co-Authored-By: Claude Opus 4.7 <noreply@anthropic.com>
EOF
)"
```

---

### Sub-phase 1D checkpoint — Phase 1 complete

After Task 17, Phase 1 is done. The site:

- Refuses to start with bad config.
- Rejects malformed Stripe webhooks early.
- Throttles payment endpoints.
- Sets every security header that helmet provides + a CSP report-only header that flows to Sentry.
- Validates Firestore writes at the field level + has a test suite.
- Drains in-flight requests on Cloud Run revision swap.
- Emits structured JSON logs and Sentry-tagged errors with release info.
- Gates merges on `npm test` + builds.
- Has a staging environment with a documented promotion path.

Open the final Phase 1 PR (or finalise the rolling one). Run the validation checklist from `docs/seo/staging-deployment-guide.md` against staging. Promote to production when green.

---

## Cross-cutting checks before declaring Phase 1 done

Run all of these. None should fail.

```bash
# Tests
npm test
# Build
npm run build
# Rules tests (requires emulator)
npm run test:rules
# Server boots in production mode w/ correct keys
NODE_ENV=production STRIPE_SECRET_KEY=sk_live_test STRIPE_WEBHOOK_SECRET=whsec_test \
  SITE_URL=https://example.com EMAIL_FROM=t@e.com \
  SMTP_HOST=s SMTP_USER=u SMTP_PASS=p \
  FIREBASE_PROJECT_ID=p FIREBASE_CLIENT_EMAIL=e FIREBASE_PRIVATE_KEY=k \
  timeout 5 node server.js
echo "Exit: $?"  # Expect 124 (timeout, server was running)

# Server refuses to boot with test Stripe key in production
NODE_ENV=production STRIPE_SECRET_KEY=sk_test_xyz STRIPE_WEBHOOK_SECRET=whsec_test \
  node server.js
echo "Exit: $?"  # Expect 1
```

## Open follow-ups deferred from Phase 1

These were in the spec but explicitly skipped during this plan:

- **Email template HTML escaping audit** (spec §5 item 7) — verify each `api/templates/*` file uses DOMPurify or auto-escape on user-controlled fields. Small task; add to Phase 2 plan or do as standalone fix.
- **CSP enforce flip** (after the 7-day report-only soak) — change `Content-Security-Policy-Report-Only` to `Content-Security-Policy`. Single-line change after Sentry confirms zero violations during the soak.

## What Phase 2 expects from Phase 1

- A staging URL to run Lighthouse against (Phase 2 perf measurement uses it).
- Sentry to be live so Phase 2's React error boundaries can report.
- CI test gate so Phase 2's code-split + a11y work can't regress.
- helmet/CSP enforced (post-soak) so Phase 2's third-party additions get visibility.

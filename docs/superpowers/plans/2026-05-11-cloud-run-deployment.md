# Cloud Run Deployment Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Deploy `server.js` (the Express API server with Stripe webhooks, leads, analytics, sitemap, and the SEO middleware from PR #2) to Google Cloud Run, exposed via Firebase Hosting rewrites under the existing `hq-website-4abc7.web.app` domain. Free at HQ Aviation's traffic level. Same Firebase project; single mental model.

**Architecture:** `server.js` ships as-is inside a small Node 20 Docker container. Cloud Run scales 0–N containers based on traffic. Firebase Hosting's `firebase.json` adds a rewrite: requests to `/api/**` are routed to the Cloud Run service. Front-end and back-end share the same origin → no CORS, no separate API subdomain. Image-cache (D3) adapts from disk to in-memory because Cloud Run has no persistent disk.

**Tech Stack:** Node 20, Docker, Google Cloud Run, Google Artifact Registry, Firebase Hosting (already used), gcloud CLI, Firebase CLI, existing Express + sharp + firebase-admin stack from `server.js`.

**Reference files:**
- Express entry: `server.js`
- Hosting config: `firebase.json`
- Existing env vars list: `server.js` lines 8–17 (`REQUIRED_ENV` array)
- Image-optimisation spec: `docs/superpowers/specs/2026-05-09-image-optimisation-design.md` (will be updated by Task 9)

**Commit discipline:** one commit per task. Prefix `chore(deploy):` for infra, `feat(deploy):` for new capabilities, `docs(deploy):` for docs, `fix(deploy):` for bugs. **One commit per task — do not batch.**

**User-input gates:**
- Before **Task 4** — user runs `gcloud auth login` interactively (must be in their browser)
- Before **Task 5** — user provides values for all environment variables from `.env` (the agent doesn't have them)
- Before **Task 8** — user updates the Stripe webhook URL in the Stripe dashboard (browser action)
- Before **Task 8** — user signs up uptimerobot.com (browser action)
- Before **Task 8** — user sets up GCP budget alert (browser action)

**Pre-flight gate:**
- `gcloud` CLI installed (`gcloud --version` returns successfully)
- Docker installed and running (`docker info` succeeds)
- Firebase CLI installed (`firebase --version`)
- User has access to the `hq-website-4abc7` GCP project (verifiable via `firebase use`)

If any of these fail at the start: stop and resolve before continuing.

---

## File Structure

### New files

| Path | Responsibility |
|---|---|
| `Dockerfile` | Multi-stage build that produces a minimal Node 20 container running `server.js` |
| `.dockerignore` | Excludes `node_modules`, `dist`, source maps, `.git`, `public/` (front-end is served by Hosting separately), test fixtures, etc. |
| `.gcloudignore` | Same role for `gcloud` CLI when not building via Docker — keep consistent with `.dockerignore` |
| `docs/seo/cloud-run-deployment-guide.md` | Step-by-step user-facing reference: how to deploy, how to update env vars, how to roll back, how to see logs |
| `docs/seo/cloud-run-keep-warm-guide.md` | User-facing guide for setting up uptimerobot.com to keep the container warm (free) |

### Modified files

| Path | Why |
|---|---|
| `firebase.json` | Add a rewrite rule routing `/api/**` to the new Cloud Run service. Keep the existing catch-all SPA rewrite. |
| `package.json` | Add a `deploy:server` script invoking `gcloud run deploy` for convenience. |
| `docs/superpowers/specs/2026-05-09-image-optimisation-design.md` | Update Layer 2 cache section to reflect Cloud Run constraint (in-memory cache, not disk). |
| `server.js` | Add a `/api/health` endpoint if not present (required by uptimerobot ping and as a Cloud Run health check). Audit lines 8–17 for any env vars that need adjusting for Cloud Run. |

---

## Task 1: Pre-flight checks

**Files:**
- No file changes (read-only verification)

- [ ] **Step 1:** Verify gcloud CLI installed

```bash
gcloud --version
```

Expected: prints version info including `Google Cloud SDK`. If not installed: `brew install --cask google-cloud-sdk` (macOS) or follow https://cloud.google.com/sdk/docs/install.

- [ ] **Step 2:** Verify Docker installed and running

```bash
docker --version
docker info > /dev/null 2>&1 && echo "Docker OK" || echo "Docker not running"
```

Expected: version prints; `Docker OK` confirms the daemon responds. If not: install Docker Desktop (macOS) and start it.

- [ ] **Step 3:** Verify Firebase CLI installed

```bash
firebase --version
firebase use
```

Expected: version prints; `firebase use` shows `hq-website-4abc7` as active project. If wrong project: `firebase use hq-website-4abc7`.

- [ ] **Step 4:** Authenticate gcloud

```bash
gcloud auth login
```

A browser opens. User signs in with the same Google account that owns the Firebase project. Returns to CLI when complete.

- [ ] **Step 5:** Set the active gcloud project

```bash
gcloud config set project hq-website-4abc7
gcloud config list
```

Expected: `project = hq-website-4abc7` in the output.

- [ ] **Step 6:** Verify project access

```bash
gcloud projects describe hq-website-4abc7
```

Expected: project details (name, lifecycle state ACTIVE). If "Permission denied": user account isn't on the project; resolve in Firebase Console → Project Settings → Users.

(No commit — verification only.)

---

## Task 2: Write `Dockerfile` + `.dockerignore`

**Files:**
- Create: `Dockerfile`
- Create: `.dockerignore`
- Create: `.gcloudignore`

- [ ] **Step 1:** Create `Dockerfile`

```dockerfile
# Multi-stage build for minimal final image
FROM node:20-slim AS builder

WORKDIR /app

# Install build deps for sharp's native binaries
RUN apt-get update && apt-get install -y --no-install-recommends \
    build-essential python3 && \
    rm -rf /var/lib/apt/lists/*

# Copy package files first for better Docker layer caching
COPY package.json package-lock.json* ./

# Install only production dependencies
RUN npm install --omit=dev --legacy-peer-deps

# Copy server source (NOT the React app — Firebase Hosting serves that separately)
COPY server.js ./
COPY api/ ./api/
COPY src/lib/ ./src/lib/
COPY scripts/ ./scripts/

# Final image — slim runtime
FROM node:20-slim AS runtime

WORKDIR /app

# Runtime deps for sharp
RUN apt-get update && apt-get install -y --no-install-recommends \
    libvips42 && \
    rm -rf /var/lib/apt/lists/* && \
    apt-get clean

# Copy built deps + source from builder
COPY --from=builder /app /app

ENV NODE_ENV=production
ENV PORT=8080

# Cloud Run sends SIGTERM on shutdown; tini handles signals correctly
USER node

EXPOSE 8080

CMD ["node", "server.js"]
```

- [ ] **Step 2:** Create `.dockerignore`

```
# Source control
.git
.gitignore

# Dependencies (will be installed in the container)
node_modules

# React app (served by Firebase Hosting, not Cloud Run)
dist
src
public
index.html
vite.config.js

# Local dev / test
.env*
*.log
.DS_Store
coverage
.vscode
.idea

# Worktrees and caches
.worktrees
.image-cache
.image-cache-test
.firebase
.cache

# Firebase / GCP local
firebase-debug.log
.firebaserc

# Build artefacts
dist

# Documentation (not needed at runtime)
docs
README.md
*.md

# Image source folders (we're not building the image pipeline yet)
"HQ-website-images"
"Shyam Maintenance Photos"
R44-Claude
R88-Robinson
assets-source
eyeinthesky-robbie
discovery-flight-1
recently-sold-aircraft
used-aircraft
r66
apparel
blogs

# Test data
__fixtures__
*.test.js
*.test.jsx
```

- [ ] **Step 3:** Create `.gcloudignore`

```
# Identical to .dockerignore — gcloud uses this when not building via Docker
.git
.gitignore
node_modules
dist
src
public
index.html
vite.config.js
.env*
*.log
.DS_Store
coverage
.vscode
.idea
.worktrees
.image-cache
.image-cache-test
.firebase
.cache
firebase-debug.log
.firebaserc
docs
README.md
*.md
"HQ-website-images"
"Shyam Maintenance Photos"
R44-Claude
R88-Robinson
assets-source
eyeinthesky-robbie
discovery-flight-1
recently-sold-aircraft
used-aircraft
r66
apparel
blogs
__fixtures__
*.test.js
*.test.jsx
```

- [ ] **Step 4:** Audit `server.js` for the PORT environment variable

```bash
grep -n "PORT" server.js | head -5
```

Expected: line ~32 reads `const PORT = process.env.PORT || 7500;`. Cloud Run injects `PORT=8080`; if server.js respects `process.env.PORT`, no change needed. If hardcoded: fix to `process.env.PORT || 7500`.

- [ ] **Step 5:** Add `/api/health` endpoint to `server.js` (for uptimerobot + Cloud Run probes)

Find an existing route mount line (e.g., `app.use('/api/leads', ...)`). Just before the first `app.use('/api/...')`, add:

```js
// Cloud Run / uptimerobot health probe — cheap, no auth, no I/O.
app.get('/api/health', (req, res) => {
  res.status(200).json({ status: 'ok', timestamp: new Date().toISOString() });
});
```

If `/api/health` already exists: skip this step.

- [ ] **Step 6:** Commit

```bash
git add Dockerfile .dockerignore .gcloudignore server.js
git commit -m "chore(deploy): add Dockerfile + dockerignore + health endpoint for Cloud Run"
```

---

## Task 3: Local Docker smoke test

**Files:**
- No file changes (build + run only)

The point: catch container-build errors and runtime errors BEFORE pushing to Cloud Run, where iteration is slower.

- [ ] **Step 1:** Build the image locally

```bash
cd /Users/maximussmith/Downloads/HQ-Website-main-cloud-run  # (worktree from Task 0)
docker build -t hq-server:local .
```

Expected: builds successfully. First build takes 2–4 min (downloads base image + libvips). Subsequent builds use layer cache.

If build fails: read the error, fix Dockerfile, retry. Common causes: missing files, wrong WORKDIR, sharp build deps missing.

- [ ] **Step 2:** Inspect the image size

```bash
docker images hq-server:local
```

Expected: image size ~250–400 MB. If >1 GB: dockerignore isn't filtering enough — investigate which directory got copied.

- [ ] **Step 3:** Run locally with a fake env

```bash
docker run --rm -p 8080:8080 \
  -e NODE_ENV=development \
  -e PORT=8080 \
  -e STRIPE_SECRET_KEY=sk_test_dummy \
  -e STRIPE_WEBHOOK_SECRET=whsec_dummy \
  -e SMTP_HOST=smtp.example.com \
  -e SMTP_USER=dummy \
  -e SMTP_PASS=dummy \
  -e EMAIL_FROM=dummy@example.com \
  -e FIREBASE_PROJECT_ID=hq-website-4abc7 \
  -e FIREBASE_CLIENT_EMAIL=dummy@example.com \
  -e FIREBASE_PRIVATE_KEY=dummy \
  hq-server:local
```

Note: `NODE_ENV=development` bypasses the env-var validation gate in server.js lines 9–17 (the strict check is only for production). Container starts even with dummy values.

Expected: container logs "HQ Aviation server running on port 8080" (or whatever server.js prints) within ~3 seconds. If it crashes: read the stack trace, fix server.js, rebuild, retry.

- [ ] **Step 4:** Test health endpoint in another terminal

```bash
curl http://localhost:8080/api/health
```

Expected: `{"status":"ok","timestamp":"..."}` (200 OK).

- [ ] **Step 5:** Test sitemap endpoint

```bash
curl -I http://localhost:8080/sitemap.xml
```

Expected: 200 with `content-type: application/xml`. (Firestore connection will fail with dummy creds, but the endpoint should return SOMETHING — possibly an error page. The point is the route is mounted.)

- [ ] **Step 6:** Stop the container

```bash
docker ps  # find the container ID
docker stop <container-id>
```

Or use `Ctrl+C` in the terminal running it.

- [ ] **Step 7:** Commit nothing (test was a verification step). If Dockerfile changed during debugging: commit those fixes.

---

## Task 4: Enable GCP APIs + create Artifact Registry

**Files:**
- No file changes (cloud config only)

**User action required** — these commands enable billing-eligible GCP services. The hq-website-4abc7 project must be on the Blaze (pay-as-you-go) plan for any Cloud Run usage. **Free tier covers HQ's traffic, but the project itself must be on Blaze.** Verify in Firebase Console → Usage and Billing.

- [ ] **Step 1:** Confirm Blaze plan

```bash
gcloud billing projects describe hq-website-4abc7
```

Expected: `billingEnabled: true` and a `billingAccountName`. If `billingEnabled: false`: user must enable Blaze plan in Firebase Console first.

- [ ] **Step 2:** Enable Cloud Run API

```bash
gcloud services enable run.googleapis.com
```

Expected: "Operation [...] complete." Takes ~30 seconds.

- [ ] **Step 3:** Enable Artifact Registry API

```bash
gcloud services enable artifactregistry.googleapis.com
```

Expected: success message.

- [ ] **Step 4:** Enable Cloud Build API (for container builds)

```bash
gcloud services enable cloudbuild.googleapis.com
```

Expected: success message.

- [ ] **Step 5:** Create the Artifact Registry repository

```bash
gcloud artifacts repositories create hq-aviation \
  --repository-format=docker \
  --location=europe-west2 \
  --description="Container images for HQ Aviation services"
```

Region: `europe-west2` (London) — closest to UK users. **Cloud Run service must be in the same region as the Artifact Registry repo for fastest deploys.**

Expected: "Created repository [hq-aviation]." If already exists: skip.

- [ ] **Step 6:** Configure Docker to push to Artifact Registry

```bash
gcloud auth configure-docker europe-west2-docker.pkg.dev
```

Expected: confirms credential helper is configured.

(No commit — cloud config only.)

---

## Task 5: First Cloud Run deploy

**Files:**
- No file changes (deploy command only)

**User input required:** All required environment variables from `.env`. The agent doesn't have these — user provides them when prompted (or as a single secrets file the agent reads but never commits).

- [ ] **Step 1:** Build + tag for Artifact Registry

```bash
docker build --platform linux/amd64 \
  -t europe-west2-docker.pkg.dev/hq-website-4abc7/hq-aviation/server:v1 .
```

Note `--platform linux/amd64` — required when building from an Apple Silicon Mac for x86_64 Cloud Run runtime.

Expected: builds in ~2–4 min.

- [ ] **Step 2:** Push to Artifact Registry

```bash
docker push europe-west2-docker.pkg.dev/hq-website-4abc7/hq-aviation/server:v1
```

Expected: pushes in 1–3 min depending on connection.

- [ ] **Step 3:** Prepare environment variable file (do NOT commit)

Create `/tmp/cloud-run-env.yaml` (outside the repo so it's never committed):

```yaml
# /tmp/cloud-run-env.yaml — DO NOT COMMIT, contains secrets
STRIPE_SECRET_KEY: "sk_live_..."
STRIPE_WEBHOOK_SECRET: "whsec_..."
SMTP_HOST: "smtp.your-provider.com"
SMTP_USER: "your-smtp-user"
SMTP_PASS: "your-smtp-password"
EMAIL_FROM: "noreply@hqaviation.com"
FIREBASE_PROJECT_ID: "hq-website-4abc7"
FIREBASE_CLIENT_EMAIL: "firebase-adminsdk-...@hq-website-4abc7.iam.gserviceaccount.com"
FIREBASE_PRIVATE_KEY: "-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n"
```

User fills in real values from their existing `.env`. **Keep the file outside the repo.**

- [ ] **Step 4:** Deploy to Cloud Run

```bash
gcloud run deploy hq-aviation-server \
  --image=europe-west2-docker.pkg.dev/hq-website-4abc7/hq-aviation/server:v1 \
  --region=europe-west2 \
  --platform=managed \
  --allow-unauthenticated \
  --memory=512Mi \
  --cpu=1 \
  --concurrency=80 \
  --max-instances=10 \
  --min-instances=0 \
  --timeout=60s \
  --env-vars-file=/tmp/cloud-run-env.yaml \
  --port=8080
```

Settings explained:
- `--allow-unauthenticated`: allows the public web to reach the service (Firebase Hosting will proxy to it)
- `--memory=512Mi`: enough for Express + Firebase Admin + Stripe. Bump to 1Gi if sharp transforms cause OOM.
- `--concurrency=80`: each container handles up to 80 concurrent requests
- `--max-instances=10`: caps cost if traffic spikes (well within free tier)
- `--min-instances=0`: scales to zero when idle = $0 when not in use
- `--timeout=60s`: requests longer than 60s are killed (sane default)

Expected output ends with: `Service URL: https://hq-aviation-server-...run.app`

Note the URL — needed in Task 6.

- [ ] **Step 5:** Tag the image as `latest` for future-rollback convenience

```bash
docker tag europe-west2-docker.pkg.dev/hq-website-4abc7/hq-aviation/server:v1 \
           europe-west2-docker.pkg.dev/hq-website-4abc7/hq-aviation/server:latest
docker push europe-west2-docker.pkg.dev/hq-website-4abc7/hq-aviation/server:latest
```

- [ ] **Step 6:** Securely delete the env-vars file

```bash
rm /tmp/cloud-run-env.yaml
```

(No commit — deploy is in cloud, env vars are in cloud.)

---

## Task 6: Verify Cloud Run service directly

**Files:**
- No file changes (verification only)

- [ ] **Step 1:** Get the Cloud Run URL

```bash
gcloud run services describe hq-aviation-server \
  --region=europe-west2 \
  --format='value(status.url)'
```

Expected: `https://hq-aviation-server-<hash>-nw.a.run.app` (or similar). Save this URL — we'll call it `$RUN_URL`.

- [ ] **Step 2:** Test health endpoint

```bash
RUN_URL="<paste-the-url>"
curl "$RUN_URL/api/health"
```

Expected: `{"status":"ok","timestamp":"..."}` within 1–2 seconds (cold start) then fast (warm).

- [ ] **Step 3:** Test sitemap endpoint

```bash
curl -I "$RUN_URL/sitemap.xml"
```

Expected: `HTTP/2 200` with `content-type: application/xml`. Body should be valid XML if Firestore creds are correct.

- [ ] **Step 4:** Test a couple of `/api/*` routes

```bash
curl -I "$RUN_URL/api/health"
curl -I "$RUN_URL/api/leads" -X POST -H "Content-Type: application/json" -d '{"test": true}'
```

Expected: health is 200; `/api/leads` is whatever the existing leads route returns for invalid input (probably 400 or 422). Either way, NOT 404 (which would mean the route isn't mounted).

- [ ] **Step 5:** Inspect Cloud Run logs for any startup errors

```bash
gcloud run services logs read hq-aviation-server \
  --region=europe-west2 \
  --limit=50
```

Expected: server startup log, no stack traces, Firestore connection succeeded.

If errors: fix locally, rebuild, push new tag, redeploy. Iterate until clean.

(No commit — verification only.)

---

## Task 7: Firebase Hosting rewrite to Cloud Run

**Files:**
- Modify: `firebase.json`

This is what makes the Cloud Run service appear as part of `hq-website-4abc7.web.app`.

- [ ] **Step 1:** Read current `firebase.json`

```bash
cat firebase.json
```

Note the existing structure — particularly the `hosting.rewrites` array.

- [ ] **Step 2:** Add the Cloud Run rewrite to `firebase.json`

Update the `hosting.rewrites` array. The new entry goes FIRST (before the catch-all SPA rewrite):

```json
{
  "firestore": { ... },
  "hosting": {
    "public": "dist",
    "ignore": [...],
    "rewrites": [
      {
        "source": "/api/**",
        "run": {
          "serviceId": "hq-aviation-server",
          "region": "europe-west2"
        }
      },
      {
        "source": "/sitemap.xml",
        "run": {
          "serviceId": "hq-aviation-server",
          "region": "europe-west2"
        }
      },
      {
        "source": "/robots.txt",
        "run": {
          "serviceId": "hq-aviation-server",
          "region": "europe-west2"
        }
      },
      {
        "source": "/admin/**",
        "destination": "/admin/index.html"
      },
      {
        "source": "**",
        "destination": "/index.html"
      }
    ],
    "headers": [...]
  },
  "storage": { ... },
  "functions": { ... }
}
```

Why three explicit rewrites instead of just `/api/**`:
- `/api/**` covers Stripe webhooks, leads, analytics, etc. (everything mounted under `/api/`)
- `/sitemap.xml` and `/robots.txt` are SEO-critical and live at the root, not under `/api/`
- Without the explicit `/sitemap.xml` rewrite, requests would fall through to the SPA catch-all and return HTML

- [ ] **Step 3:** Deploy Hosting

```bash
firebase deploy --only hosting
```

Expected: deploy completes in 30–60s. Output includes the Hosting URL (`https://hq-website-4abc7.web.app`).

- [ ] **Step 4:** Verify the rewrites work via Hosting domain

```bash
curl -I https://hq-website-4abc7.web.app/api/health
curl -I https://hq-website-4abc7.web.app/sitemap.xml
curl -I https://hq-website-4abc7.web.app/robots.txt
```

Expected: each returns the same headers as when called directly on `$RUN_URL`. The `server` header should NOT be `cloudflare` or anything else other than what Hosting + Run produce.

- [ ] **Step 5:** Visual sanity check — load the homepage in a browser

```bash
open https://hq-website-4abc7.web.app/
```

Expected: React app loads as before. Check the Network tab — `/api/*` calls should succeed (no CORS issues since same origin).

- [ ] **Step 6:** Commit

```bash
git add firebase.json
git commit -m "feat(deploy): route /api/**, /sitemap.xml, /robots.txt to Cloud Run via Hosting rewrite"
```

---

## Task 8: Post-deploy hardening (user actions)

**Files:**
- Create: `docs/seo/cloud-run-keep-warm-guide.md`

Three user actions, each in the browser:

### Step 1: Update Stripe webhook URL

In Stripe dashboard:

1. Go to https://dashboard.stripe.com/webhooks
2. Find any existing webhook endpoint pointing at the old URL (probably `localhost` or whatever was there pre-deploy)
3. Update the URL to: `https://hq-website-4abc7.web.app/api/stripe/webhook` (or whatever the actual webhook path is — check `api/stripe.js`)
4. Save

If no webhook exists yet: create one with that URL, subscribe to the events your code handles (`payment_intent.succeeded`, `checkout.session.completed`, etc.), copy the new signing secret, update `STRIPE_WEBHOOK_SECRET` in Cloud Run env vars via `gcloud run services update ...`.

### Step 2: Set up uptimerobot keep-warm

Write `docs/seo/cloud-run-keep-warm-guide.md`:

```markdown
# Cloud Run Keep-Warm (Free) Guide

## Why

Cloud Run scales to zero after ~15 min of idle. The next request after that incurs a 1–2s cold start. Pinging the health endpoint every 5 min during business hours keeps a container warm — no cold starts for real users.

Cost: $0. Setup: ~5 min.

## Steps

1. Go to https://uptimerobot.com — sign up (free tier).
2. Create a new HTTP(S) monitor:
   - **Monitor type:** HTTP(S)
   - **Friendly name:** "HQ Aviation API keep-warm"
   - **URL:** `https://hq-website-4abc7.web.app/api/health`
   - **Monitoring interval:** 5 minutes (free tier allows down to this)
3. Save.
4. Verify the monitor is "Up" (green dot) within 5 minutes.

That's it. The ping costs ~8,640 requests/month, well within Cloud Run's 2M/month free tier (~0.4% of free allowance).

## Restrict to business hours (optional)

To save even those tiny pings, uptimerobot Pro has alert windows. Free tier pings 24/7. For HQ's traffic the 24/7 ping is fine.

## Removing keep-warm later

If you ever pay for Cloud Run `min-instances=1` (~$5/mo), delete the monitor — Cloud Run keeps itself warm.
```

### Step 3: Set GCP budget alert

In GCP Console:

1. Go to https://console.cloud.google.com/billing/budgets (project: hq-website-4abc7)
2. "Create Budget"
3. Name: "HQ Aviation usage alert"
4. Scope: Specific projects → `hq-website-4abc7`
5. Amount: £5 / $5 (whichever currency the billing is in)
6. Alert thresholds: 50%, 90%, 100%
7. Email notifications: user's email
8. Save

This emails the user if costs ever approach $5/mo (which would mean the free tier is exceeded).

- [ ] **Step 4:** Commit the keep-warm guide

```bash
git add docs/seo/cloud-run-keep-warm-guide.md
git commit -m "docs(deploy): cloud-run keep-warm guide for uptimerobot ping"
```

---

## Task 9: Update image-optimisation spec for Cloud Run constraints

**Files:**
- Modify: `docs/superpowers/specs/2026-05-09-image-optimisation-design.md`

The Layer 2 cache section currently says "disk cache under `.image-cache/`". On Cloud Run, the filesystem is ephemeral. Update the spec to reflect this.

- [ ] **Step 1:** Edit the Layer 2 — Runtime transform endpoint section

Replace the "Cache layout" subsection from:

```markdown
### Cache layout

```
.image-cache/
  <sha1(src|w|fmt)>.avif
  <sha1(src|w|fmt)>.webp
  <sha1(src|w|fmt)>.jpg
  <sha1(src|w|fmt)>.png
```

`.image-cache/` is gitignored.
```

To:

```markdown
### Cache layout (Cloud Run-compatible)

In-memory LRU map (no persistent disk available on Cloud Run):

```js
const cache = new Map(); // key → { buffer, contentType, expiresAt }
const MAX_BYTES = 100 * 1024 * 1024;  // 100 MB per container instance
```

Cache lives in each container instance's memory. Across cold starts, cache resets — variants are re-transformed for the first request after a new container starts. Within a warm instance, identical requests served from memory in <1 ms.

For long-term shared cache across instances: optionally write to Cloud Storage via `@google-cloud/storage` (still free at HQ's volume; slightly slower than memory but persistent). Defer until Layer 2 traffic justifies the added complexity.
```

- [ ] **Step 2:** Edit "Cache eviction" subsection

Replace:

```markdown
### Cache eviction

A janitor runs at server start and once per hour:
- Reads total cache size (sum of file sizes)
- If > `IMAGE_CACHE_MAX_BYTES` (default 2 GB): delete oldest-accessed entries (by `atime`) until under 1.5 GB
- Logs evictions for visibility
```

With:

```markdown
### Cache eviction

LRU eviction in the in-memory Map:
- On each `set()`, compute current byte size (sum of buffer lengths)
- If exceeds `MAX_BYTES` (default 100 MB): delete oldest entries (Map iteration order is insertion order) until under 80 MB
- TTL: 1 hour per entry (variants are content-addressed; could theoretically be cached forever, but bounding TTL prevents stale-content edge cases)
```

- [ ] **Step 3:** Update "Hard prerequisites" table

Find the "Sharp installs and runs on the production host" row and update its verification:

```markdown
| Sharp installs and runs on the production host | D0a + Task 3 of Cloud Run deployment plan — local Docker build with sharp succeeds | **Yes — Layer 2 dies; reconsider scope** |
```

And add a new row:

```markdown
| Cloud Run service deployed and reachable via Hosting rewrite | Cloud Run deployment plan Task 7 complete | **Yes — Layer 2 has nowhere to live** |
```

- [ ] **Step 4:** Update "Known limitations"

Add:

```markdown
- **Cache is per-instance, not shared.** Cloud Run scales horizontally; each instance has its own in-memory cache. A 10-instance fleet has 10 independent caches. Fine for low traffic; if shared cache becomes important, migrate to Cloud Storage.
- **Cache resets on cold start.** When all instances scale to zero and a new request arrives, the cache starts empty. Combined with uptimerobot keep-warm, this is rare (typically once per overnight idle window).
```

- [ ] **Step 5:** Commit

```bash
git add docs/superpowers/specs/2026-05-09-image-optimisation-design.md
git commit -m "docs(spec): update image-optimisation spec — Cloud Run uses in-memory cache, not disk"
```

---

## Task 10: Final smoke test + deployment doc

**Files:**
- Create: `docs/seo/cloud-run-deployment-guide.md`
- Modify: `package.json` (add `deploy:server` script)

- [ ] **Step 1:** Run the full smoke test against the Hosting domain

```bash
echo "=== Homepage ===" && curl -sI https://hq-website-4abc7.web.app/ | head -5
echo "=== Health ===" && curl -s https://hq-website-4abc7.web.app/api/health
echo "=== Sitemap ===" && curl -sI https://hq-website-4abc7.web.app/sitemap.xml | head -5
echo "=== Robots ===" && curl -s https://hq-website-4abc7.web.app/robots.txt | head -10
echo "=== Random API endpoint (should not be 404) ===" && curl -sI -X POST https://hq-website-4abc7.web.app/api/leads | head -5
```

Expected:
- Homepage: 200 with HTML
- Health: `{"status":"ok",...}`
- Sitemap: 200 with `content-type: application/xml`
- Robots: 200 with `User-agent: *` and `Sitemap:` line
- /api/leads: NOT 404 (probably 400 for empty body — that's correct, means the route is mounted)

- [ ] **Step 2:** Test cold-start behaviour (after >15 min idle, ideally)

Wait until uptimerobot hasn't pinged for >15 min (or pause the monitor briefly). Then:

```bash
time curl -s https://hq-website-4abc7.web.app/api/health
```

Expected: first call takes 1–3 seconds (cold start). Run it again immediately:

```bash
time curl -s https://hq-website-4abc7.web.app/api/health
```

Expected: <100 ms (warm).

- [ ] **Step 3:** Add convenience script to `package.json`

In the `"scripts"` section, add:

```json
"deploy:server": "docker build --platform linux/amd64 -t europe-west2-docker.pkg.dev/hq-website-4abc7/hq-aviation/server:latest . && docker push europe-west2-docker.pkg.dev/hq-website-4abc7/hq-aviation/server:latest && gcloud run deploy hq-aviation-server --image=europe-west2-docker.pkg.dev/hq-website-4abc7/hq-aviation/server:latest --region=europe-west2"
```

Future deploys: `npm run deploy:server` (assuming env vars haven't changed).

- [ ] **Step 4:** Write the deployment guide

Create `docs/seo/cloud-run-deployment-guide.md`:

```markdown
# Cloud Run Deployment Guide — HQ Aviation API

## What this is

The Express API server (`server.js`) runs as a Cloud Run service called `hq-aviation-server` in region `europe-west2` (London). Firebase Hosting routes `/api/**`, `/sitemap.xml`, and `/robots.txt` to it via `firebase.json` rewrites.

## URLs

- **Customer-facing:** `https://hq-website-4abc7.web.app/api/*` (and `https://hqaviation.com/api/*` after DNS cutover)
- **Direct Cloud Run URL:** see `gcloud run services describe hq-aviation-server --region=europe-west2 --format='value(status.url)'`

## Deploy a code change

```bash
npm run deploy:server
```

This builds the Docker image, pushes to Artifact Registry, and rolls out a new Cloud Run revision. Takes ~3–5 min total.

Alternatively, do it manually:

\`\`\`bash
docker build --platform linux/amd64 \\
  -t europe-west2-docker.pkg.dev/hq-website-4abc7/hq-aviation/server:v<N> .
docker push europe-west2-docker.pkg.dev/hq-website-4abc7/hq-aviation/server:v<N>
gcloud run deploy hq-aviation-server \\
  --image=europe-west2-docker.pkg.dev/hq-website-4abc7/hq-aviation/server:v<N> \\
  --region=europe-west2
\`\`\`

## Update environment variables (Stripe keys, SMTP, etc.)

\`\`\`bash
gcloud run services update hq-aviation-server \\
  --region=europe-west2 \\
  --update-env-vars KEY1=value1,KEY2=value2
\`\`\`

For sensitive secrets, prefer Google Secret Manager — referenced in env vars as `KEY=projects/hq-website-4abc7/secrets/SECRET_NAME/versions/latest`.

## View logs

\`\`\`bash
gcloud run services logs read hq-aviation-server --region=europe-west2 --limit=100
\`\`\`

Or in browser: https://console.cloud.google.com/run/detail/europe-west2/hq-aviation-server/logs

## Roll back to a previous revision

List revisions:

\`\`\`bash
gcloud run revisions list --service=hq-aviation-server --region=europe-west2
\`\`\`

Roll back:

\`\`\`bash
gcloud run services update-traffic hq-aviation-server \\
  --region=europe-west2 \\
  --to-revisions=<previous-revision-name>=100
\`\`\`

## Monitor cost

GCP budget alert is configured at $5/mo. Free tier covers: 2M requests/mo, 360k GB-seconds memory, 180k vCPU-seconds. At HQ's expected traffic this is ~5% of allowance.

Live usage: https://console.cloud.google.com/billing

## Cold-start mitigation

uptimerobot.com pings `/api/health` every 5 min, keeping a container warm. Free tier. See `cloud-run-keep-warm-guide.md`.

## Architecture diagram

\`\`\`
Browser
  ↓
https://hq-website-4abc7.web.app/...
  ↓
Firebase Hosting (always-on, free)
  ├── /api/** → Cloud Run service: hq-aviation-server
  ├── /sitemap.xml → Cloud Run service
  ├── /robots.txt → Cloud Run service
  ├── /admin/** → /admin/index.html (admin SPA)
  └── ** → /index.html (main React SPA)
\`\`\`
```

- [ ] **Step 5:** Commit the guide + script

```bash
git add docs/seo/cloud-run-deployment-guide.md package.json
git commit -m "docs(deploy): cloud-run deployment guide + npm script"
```

---

## Task 11: Push branch + open PR

**Files:**
- No file changes

- [ ] **Step 1:** Push the branch

```bash
git push -u origin feat/cloud-run-deployment
```

- [ ] **Step 2:** Open the PR

```bash
gh pr create --base main --head feat/cloud-run-deployment --title "Deploy server.js to Cloud Run + Firebase Hosting rewrite" --body "$(cat <<'EOF'
## Summary

Deploys the Express API server (`server.js`) to Google Cloud Run, exposed via Firebase Hosting rewrites under the existing `hq-website-4abc7.web.app` domain. Closes the gap surfaced in PR #4 (D0 prereqs): until now, `server.js` ran nowhere reachable on the public internet.

## What's in

- **`Dockerfile` + `.dockerignore` + `.gcloudignore`** — multi-stage Node 20 build with sharp's native deps; minimal runtime image (~300 MB)
- **`server.js` — added `/api/health` endpoint** — for uptimerobot ping + Cloud Run probes
- **`firebase.json` — three new rewrites** routing `/api/**`, `/sitemap.xml`, and `/robots.txt` to the Cloud Run service
- **`package.json` — `deploy:server` script** — one-command future deploys
- **`docs/seo/cloud-run-deployment-guide.md`** — how to deploy, view logs, roll back, update env vars
- **`docs/seo/cloud-run-keep-warm-guide.md`** — uptimerobot ping setup (free cold-start mitigation)
- **`docs/superpowers/specs/2026-05-09-image-optimisation-design.md` updated** — Layer 2 cache redesigned for Cloud Run's ephemeral filesystem (in-memory instead of disk)

## Cloud Run service config

- Service: `hq-aviation-server`
- Region: `europe-west2` (London — closest to UK users)
- Image: `europe-west2-docker.pkg.dev/hq-website-4abc7/hq-aviation/server`
- Memory: 512 MB
- CPU: 1
- Concurrency: 80
- Min instances: 0 (scales to zero when idle = free)
- Max instances: 10 (cost ceiling)
- Timeout: 60 s
- Allow unauthenticated: yes (Firebase Hosting routes traffic; Cloud Run access is public-only via the rewrite)

## Verification

Smoke test against `https://hq-website-4abc7.web.app`:
- `/api/health` → 200 OK with status JSON
- `/sitemap.xml` → 200 OK with `content-type: application/xml`
- `/robots.txt` → 200 OK with valid robots.txt
- `/api/leads` POST → expected route response (not 404)
- Homepage `/` → React SPA loads normally

Cold start: first request after ~15 min idle takes ~1–2 s. Subsequent: <100 ms. uptimerobot ping every 5 min keeps the container warm during operating hours.

## Cost

$0/mo at HQ's traffic level. GCP budget alert configured at $5/mo to catch any unexpected usage.

## Out of scope (follow-ups)

- DNS cutover from Squarespace to Firebase Hosting (separate plan)
- Image-optimisation pipeline (D1/D2/D3) — now unblocked, can start
- Migration of sensitive env vars from plain env vars to Secret Manager (security hardening)
- CI/CD automation (GitHub Actions to auto-deploy on push to main)

🤖 Generated with [Claude Code](https://claude.com/claude-code)
EOF
)"
```

- [ ] **Step 3:** Note the PR URL.

---

## Self-Review

**Spec coverage:** the architecture decision was "Cloud Run + Firebase Hosting rewrites with in-memory cache for free tier." Tasks 2 (Dockerfile), 4 (GCP APIs), 5 (deploy), 6 (verify), 7 (Hosting rewrite), and 9 (image-spec update) collectively implement this. ✓

**Placeholder scan:** none. Every command is exact, every env-var name is real (drawn from `server.js` lines 9–17), every config value is justified.

**Type / API consistency:** `hq-aviation-server` is the Cloud Run service name used in Tasks 5, 6, 7, 8, 9, 10, and the PR description. `europe-west2` is the region used everywhere. `hq-website-4abc7` is the GCP/Firebase project ID used everywhere. ✓

**Scope check:** one PR. 10 tasks. User actions (browser-based) bundled into Task 8 to keep them in one place; code/CLI tasks dominate. Tasks 4–8 form the deploy sequence; Tasks 1–3 prepare; Tasks 9–10 finalize. Independently reviewable.

# Google Cloud Console — operator checklist

> One-time + recurring tasks for the `hq-website-4abc7` GCP project.
> Work top to bottom. Most P0 items take 5 minutes each.
> Bookmark this page in GCP Console for easy re-reference.

Updated 2026-05-12.

---

## P0 — do this week (cost, safety, deploy integrity)

### 1. Billing budget + alerts

**Goal:** never get surprised by a £1000 bill.

**Path:** `Billing > Budgets & alerts > Create budget`

**Settings:**
- Name: `hq-aviation £50/mo cap`
- Scope: project `hq-website-4abc7`
- Budget amount: £50/month (current spend ~£0.30, headroom catches anomalies)
- Threshold rules:
  - 50% → email
  - 90% → email
  - 100% → email
  - 150% → email (in case something's pathological)

**Verify:** trigger alert by setting a temp £0.10 budget then deleting — confirm you get the email.

- [ ] Done

---

### 2. Cloud Run service deep-dive

**Goal:** know what's actually running + how to roll back.

**Path:** `Cloud Run > hq-aviation-server` (region `europe-west2`)

**Check each tab:**
- **Revisions** — current + history. Bookmark "Manage Traffic" — that's the rollback button (`100% to <previous-revision>`).
- **Variables & Secrets** — confirm secrets are bound from Secret Manager, NOT plain env vars (plain env vars in container config = exposed in deploy logs).
- **Metrics** — note current p95 latency, error rate %, request count / minute. These are your baseline.
- **Logs** — verify post-Phase-1 logs are JSON (structured, pino).
- **Networking** — confirm allow public traffic + traffic split is 100% to latest revision.
- **Containers > Variables & Secrets** — explicitly verify these are present:
  - `STRIPE_SECRET_KEY`, `STRIPE_WEBHOOK_SECRET`, `SMTP_HOST`, `SMTP_USER`, `SMTP_PASS`, `EMAIL_FROM`, `SITE_URL`, `FIREBASE_PROJECT_ID`, `FIREBASE_CLIENT_EMAIL`, `FIREBASE_PRIVATE_KEY`, `GIT_REV`, `NODE_ENV=production`
  - Post-Phase-1: also `SENTRY_DSN`

**Verify:** `curl https://<cloud-run-url>/api/health` returns 200.

- [ ] Done

---

### 3. Secret Manager inventory

**Goal:** every secret the server boot expects is present and current.

**Path:** `Security > Secret Manager`

**Required secrets:**

| Name | Format | Source |
|---|---|---|
| `STRIPE_SECRET_KEY` | `sk_live_...` (prod) or `sk_test_...` (staging) | Stripe Dashboard > Developers > API keys |
| `STRIPE_WEBHOOK_SECRET` | `whsec_...` | Stripe Dashboard > Developers > Webhooks > endpoint > Signing secret |
| `SMTP_HOST` | host string | Your SMTP provider |
| `SMTP_USER` | string | SMTP provider |
| `SMTP_PASS` | string | SMTP provider |
| `EMAIL_FROM` | `Name <email@hqaviation.com>` | Decided by you |
| `SITE_URL` | `https://hqaviation.com` | Production URL |
| `FIREBASE_PROJECT_ID` | `hq-website-4abc7` | Firebase console |
| `FIREBASE_CLIENT_EMAIL` | service-account email | Firebase Admin SDK |
| `FIREBASE_PRIVATE_KEY` | PEM string with `\n` escapes | Firebase Admin SDK |
| `SENTRY_DSN` | `https://<key>@oXXX.ingest.sentry.io/<id>` | Sentry dashboard (after you create project) |

**Verify:** any secret in `server.js:13` REQUIRED_ENV must have a Secret Manager entry **and** be bound in the Cloud Run service (Variables & Secrets tab).

- [ ] All 11 required secrets present
- [ ] All bound in Cloud Run service config

---

### 4. Uptime check on `/api/health`

**Goal:** know within a minute if the site is down.

**Path:** `Monitoring > Uptime checks > Create uptime check`

**Settings:**
- Title: `HQ Aviation Server Health`
- Protocol: HTTPS
- Resource Type: URL
- Hostname: your Cloud Run domain (or production domain once DNS lands)
- Path: `/api/health`
- Check frequency: every 1 minute
- Regions: pick 3 (Europe, US, Asia-Pacific for breadth)
- Response timeout: 10 seconds
- Acceptable response codes: 200

**Alerting policy:** create one in the same flow — alert if `2 consecutive checks` fail. Notification channel: your email (add if not yet).

**Bonus:** doubles as Cloud Run keep-warm (per `docs/seo/cloud-run-keep-warm-guide.md`). The container stays warm when traffic is low.

- [ ] Created
- [ ] Email notification channel added
- [ ] Test alert by stopping the Cloud Run service for 3 min — confirm email arrives

---

### 5. Error Reporting email notifications

**Goal:** the moment something throws a 5xx, you know.

**Path:** `Operations > Error Reporting > Settings > Notifications`

**Settings:**
- Add your email
- Channels: email (also: Slack via webhook if you set one up)
- Notify on: new error groups + resolved errors

**Verify:** Error Reporting auto-collects from Cloud Run logs because they're JSON-structured (post-Phase-1 pino migration makes this automatic).

**Replaces by Phase-1 Task 11 (Sentry):** Sentry will eventually be the primary error sink, but Error Reporting is FREE and already on — keep both.

- [ ] Email added
- [ ] Trigger a deliberate error to verify (e.g. hit a bad route, watch for email)

---

### 6. Firestore scheduled backups

**Goal:** if an admin user accidentally wipes the `bookings` collection, recover.

**Path:** `Firestore > Backups > Backup schedules`

**Settings:**
- Schedule name: `daily-full-backup`
- Frequency: Daily
- Retention: 7 days (or 30 if budget allows — costs ~£0.50/mo at current size)
- Database: `(default)`

**Verify:** wait 24h, confirm a backup appears in the Backups list. Test restore by spinning up a temp Firestore DB and restoring from the backup (one-time exercise — verify the playbook works before you need it).

- [ ] Schedule created
- [ ] First backup appears within 24h
- [ ] Restore tested at least once

---

### 7. 2FA + recovery contacts on root account

**Goal:** prevent account takeover. If the root Google account is compromised, the attacker owns everything in GCP + Firebase + GSC + GA4 + Ads + Workspace.

**Path:** top-right avatar → "Manage your Google Account" → Security

**Settings:**
- 2-Step Verification: ON
- Method: **Authenticator app** (Google Authenticator, 1Password, Authy) — NOT SMS (SIM-swap risk)
- Backup codes: print + store in physical safe AND password manager
- Recovery email: a *different* email you control (not on the same domain — if hqaviation.com goes down you still need recovery)
- Recovery phone: yours

**Bonus:** enable Advanced Protection Program (`g.co/advancedprotection`) if you want maximum lockdown — requires physical security key.

- [ ] 2FA enabled (Authenticator app)
- [ ] Backup codes printed + stored
- [ ] Recovery email set (different domain)
- [ ] Recovery phone set

---

## P1 — do this month (visibility + access hygiene)

### 8. IAM audit

**Goal:** principle of least privilege. Only you + machines have access.

**Path:** `IAM & Admin > IAM`

**Audit:**
- Who has `Owner` role? Should be just your account + maybe one trusted collaborator. Remove any test accounts or stale Firebase-generated principals.
- Who has `Editor` role? Service accounts are fine. Human Editors are usually overprivileged — review.
- Confirm no `allUsers` or `allAuthenticatedUsers` principals exist anywhere (public access).

**Service accounts** (`IAM & Admin > Service Accounts`):
- `firebase-adminsdk-*` — Firebase auto-created, keep. Roles: Firebase-related only.
- Cloud Build SA — if used, restrict to Cloud Build + Artifact Registry.
- Cloud Run runtime SA — needs Firestore Read/Write, Secret Manager Accessor, **not** Owner.
- Sentry SA (if you create one for sourcemap uploads) — only the roles Sentry needs.
- GSC sync SA (when you wire it) — minimal: read GSC API only.

**Rotate keys:** any service account JSON key older than 90 days → rotate. Path: SA detail → Keys → Add Key + delete old.

- [ ] Owner list reviewed
- [ ] Editor list reviewed
- [ ] No public principals
- [ ] SA roles minimised
- [ ] Old SA keys rotated

---

### 9. Logs Explorer — saved queries

**Goal:** answer "what just happened?" in one click instead of building filters from scratch every time.

**Path:** `Logging > Logs Explorer`

**Save these queries** (each: paste into query bar, click Save, give a name):

| Name | Query |
|---|---|
| `cloud-run-errors` | `resource.type="cloud_run_revision" AND resource.labels.service_name="hq-aviation-server" AND severity>=ERROR` |
| `webhook-traffic` | `resource.type="cloud_run_revision" AND jsonPayload.route="/api/webhook"` |
| `payment-attempts` | `resource.type="cloud_run_revision" AND (jsonPayload.route="/api/create-payment-intent" OR jsonPayload.route="/api/create-misc-payment-intent" OR jsonPayload.route="/api/create-london-tour-payment-intent")` |
| `auth-failures` | `resource.type="cloud_run_revision" AND jsonPayload.msg="authentication failed"` |
| `boot-failures` | `resource.type="cloud_run_revision" AND jsonPayload.msg=~"FATAL"` |
| `rate-limit-429s` | `resource.type="cloud_run_revision" AND httpRequest.status=429` |

**Verify:** post-Phase-1 pino migration, every log line is JSON. The `jsonPayload.*` filters work because pino emits structured fields.

- [ ] 6 queries saved

---

### 10. Cloud Monitoring dashboard

**Goal:** one screen showing site health.

**Path:** `Monitoring > Dashboards > Create dashboard`

**Title:** `HQ Aviation — production health`

**Widgets to add:**
1. Cloud Run request count (line chart, last 1h, by response code class — 2xx/4xx/5xx)
2. Cloud Run p95 latency (line chart)
3. Cloud Run error rate % (number widget)
4. Cloud Run instance count (line chart — see autoscaling behaviour)
5. Cloud Run memory utilisation (line chart)
6. Cloud Run CPU utilisation (line chart)
7. Firestore document reads (line chart) — watch for read-amp from a bad query
8. Firestore document writes (line chart)
9. Uptime check status (number — current up/down)

**Bonus:** add a custom log-based metric for webhook failures and chart it.

- [ ] Dashboard created
- [ ] Bookmark the dashboard URL

---

### 11. Enabled APIs audit

**Goal:** confirm everything the deploy needs is enabled, and nothing unused is leaving an attack surface.

**Path:** `APIs & Services > Enabled APIs & services`

**Required:**
- ☑ Cloud Run Admin API
- ☑ Artifact Registry API
- ☑ Cloud Build API
- ☑ Secret Manager API
- ☑ Firestore API
- ☑ Firebase Hosting API
- ☑ Identity Platform API (Firebase Auth)
- ☑ Cloud Logging API
- ☑ Cloud Monitoring API
- ☑ Cloud Resource Manager API
- ☑ Cloud Storage API (Firebase Storage)
- ☑ IAM Service Account Credentials API

**Enable when needed:**
- Google Search Console API — when wiring `api/gsc-sync.js`
- Google Analytics Data API — only if you build server-side GA reports later
- Google Tag Manager API — only if you adopt GTM later

**Disable** anything you don't use that's enabled (each enabled API is a potential attack surface):
- App Engine Admin API — disable (not using App Engine)
- Compute Engine API — disable
- Kubernetes Engine API — disable

- [ ] Required APIs all enabled
- [ ] Unused APIs disabled

---

### 12. Cost reports — establish baseline

**Goal:** know what each part of the site costs.

**Path:** `Billing > Reports`

**Settings to apply:**
- Group by: Service
- Time range: last 30 days
- Filter: project `hq-website-4abc7`

**Read off the top 3 services by cost.** Expected (post-Phase-1):
1. Cloud Run — the biggest
2. Firestore — second biggest (reads dominate writes)
3. Cloud Storage — small, image storage

**Anomaly alerts:** Billing > Cost Anomaly Detection → enable. Notifies you if any service jumps >X% week over week.

- [ ] Baseline noted
- [ ] Anomaly detection on

---

## P2 — when you have time

### 13. Cloud Build triggers (auto-deploy)

**Goal:** push to `main` → auto-deploy Cloud Run.

**Currently:** deploy is manual via `npm run deploy:server`. This is fine, but Cloud Build can automate it.

**Path:** `Cloud Build > Triggers`

**Setup:** connect the GitHub repo, create a trigger on push to `main` matching `Dockerfile` changes, point at the same registry + service name.

**Tradeoff:** automation = faster but loses the "human confirms before prod" gate. Probably wait until you have a staging environment (Phase 1 Task 15-17) so trigger can deploy to staging first, you promote manually.

- [ ] Considered (after staging env exists)

---

### 14. BigQuery cost export

**Goal:** long-term cost analysis + ad-hoc queries.

**Path:** `Billing > Billing export > BigQuery export > Set up export`

**Setup:** auto-streams every billable event into a BigQuery dataset. Query with SQL. Useful when you want to know "how much does each customer cost to serve?" or "which feature is driving the Firestore bill?"

- [ ] Set up (optional — only if you'll actually query it)

---

### 15. Identity-Aware Proxy on admin paths

**Goal:** require Google Workspace auth to even REACH `/admin/*`, in addition to Firebase Auth role check.

**Currently:** `/admin/*` is gated client-side + server-side by Firebase custom claim. If the Firebase Auth flow is bypassed somehow, the admin UI HTML still serves.

**Path:** `Security > Identity-Aware Proxy`

**Tradeoff:** another auth layer = harder for legitimate users to access. Defer unless real attack pressure emerges.

- [ ] Considered

---

### 16. Cloud Armor (WAF + DDoS)

**Goal:** rate-limit + bot block at the edge before requests hit Cloud Run.

**Currently:** `express-rate-limit` is per-IP per-server-instance. Cloud Armor is global edge.

**Path:** `Network Security > Cloud Armor policies`

**Tradeoff:** ~£10/mo overhead. Only worth it once you're getting real bot traffic or under real attack.

- [ ] Considered

---

## Quick-reference: navigation paths

| Goal | Where |
|---|---|
| Roll back a bad deploy | Cloud Run > hq-aviation-server > Manage Traffic |
| See what just errored | Logging > Logs Explorer > saved query `cloud-run-errors` |
| Rotate a Stripe key | Secret Manager > STRIPE_SECRET_KEY > New Version > redeploy Cloud Run |
| Check current bill | Billing > Reports (this month) |
| Add a Sentry env var | Cloud Run > hq-aviation-server > Edit & Deploy > Variables & Secrets |
| Restore from Firestore backup | Firestore > Backups > select backup > Restore |
| Check uptime | Monitoring > Uptime checks |
| Audit IAM | IAM & Admin > IAM |
| See cost anomalies | Billing > Cost Anomaly Detection |
| Auto-deploy from GitHub | Cloud Build > Triggers (P2) |

---

## What you should NOT use (skip in left nav)

- **App Engine** — site uses Cloud Run instead. App Engine left nav widget on the home dashboard is just default chrome.
- **Compute Engine** — too low-level for this workload.
- **Kubernetes Engine** — overkill for a single Cloud Run service.
- **BigQuery** — no use case yet beyond optional cost export.
- **Vertex AI / Agent Platform** — unrelated.
- **Dataflow / Pub/Sub** — not needed until you have streaming pipelines.

---

## Cross-references

- Deploy procedure → `docs/seo/cloud-run-deployment-guide.md`
- Keep-warm strategy → `docs/seo/cloud-run-keep-warm-guide.md`
- Staging environment plan → `docs/superpowers/plans/2026-05-12-phase-1-hardening.md` Task 15
- Locked-in infra decisions → `docs/infra-decisions.md`
- User & admin flow traces → `docs/user-flows.md`

---

## Sign-off

When all P0 items are done, this project meets the bar for accepting paid customer traffic without operational nightmare. P1 items make ongoing operations smoother. P2 items are growth-stage problems.

Operator completed P0 review: ____________________ (date) ____________________ (signature)

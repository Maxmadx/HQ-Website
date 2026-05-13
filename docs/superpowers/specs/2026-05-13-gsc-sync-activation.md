# Google Search Console API sync — activation guide

**Status:** ready for activation (code exists; ops + env vars needed)
**Date:** 2026-05-13
**Estimated effort:** 30 min ops + 30 min smoke test
**Why now:** `api/gsc-sync.js` is already implemented (committed pre-this-session). It pulls 90 days of GSC query/click/impression data into Firestore `gsc_daily` for analytics dashboards. Gated by `GSC_SYNC_AUTO=false`. This guide flips it to `true` once the service account is provisioned.

## Current state

| Item | State |
|---|---|
| `api/gsc-sync.js` | Implemented; reads `GSC_SITE_URL`, `GSC_SERVICE_ACCOUNT_JSON`, gated by `GSC_SYNC_AUTO` |
| `api/gsc-api.js` | Implemented; serves `/api/admin/gsc/*` endpoints for dashboard reads |
| Cron schedule | `server.js` registers a node-cron job at 03:00 London when `GSC_SYNC_AUTO=true` |
| `gsc_daily` Firestore collection | Will be created on first successful sync |
| Service account at GCP | **NOT YET CREATED** — this is the activation gate |
| GSC user permissions | **NOT YET GRANTED** to service account |
| Cloud Run env vars | `GSC_SITE_URL`, `GSC_SERVICE_ACCOUNT_JSON`, `GSC_SYNC_AUTO` — all unset |

## Activation steps

### 1. Create GCP service account (5 min) — you

Console: https://console.cloud.google.com/iam-admin/serviceaccounts?project=hq-website-4abc7

1. Click **+ Create service account**
2. Name: `gsc-reader`
3. Description: `Read-only Search Console API access for analytics sync`
4. **Grant project roles:** none (read-only access is granted per-property in step 3, not at GCP level)
5. Click **Done**
6. From the service accounts list, click `gsc-reader@hq-website-4abc7.iam.gserviceaccount.com`
7. **Keys** tab → **Add Key** → **Create new key** → **JSON** → Create
8. JSON file downloads — save it. **Do not commit to git.**

### 2. Base64-encode the JSON (1 min) — you

In a terminal:
```bash
cat ~/Downloads/hq-website-4abc7-XXXXXXXX.json | base64 | tr -d '\n' | pbcopy
```
(Copies the base64 string to clipboard. The newline-strip avoids env-var parsing issues.)

### 3. Grant Search Console access (3 min) — you

1. Go to https://search.google.com/search-console
2. Select the `hqaviation.com` property
3. **Settings** (left sidebar) → **Users and permissions**
4. **Add user**:
   - Email: `gsc-reader@hq-website-4abc7.iam.gserviceaccount.com` (your service account email from step 1)
   - Permission: **Restricted** (read-only — sufficient for sync; do NOT grant Owner)
5. Click **Add**

### 4. Set Cloud Run env vars (5 min) — you

```bash
gcloud run services update hq-aviation-server \
  --region=europe-west2 \
  --update-env-vars \
GSC_SITE_URL='https://hqaviation.com/',\
GSC_SYNC_AUTO=true,\
GSC_SERVICE_ACCOUNT_JSON='<paste-base64-from-step-2-here>'
```

(Note `GSC_SITE_URL` — if you verified the **Domain property** in Search Console, use `sc-domain:hqaviation.com` instead of the URL-prefix form. The `api/gsc-sync.js` accepts either.)

### 5. Smoke test (10 min)

```bash
# Trigger a manual sync to verify auth + writes work
curl -X POST https://hqaviation.com/api/admin/gsc/sync \
  -H "Authorization: Bearer <admin-jwt>" \
  -H "Content-Type: application/json" \
  -d '{"days": 7}'
```

Expected response: `{ rowsFetched: N, rowsWritten: N, errors: [] }`.

Then check Firestore:
- https://console.firebase.google.com/project/hq-website-4abc7/firestore/data
- Collection `gsc_daily` should now exist with N documents (one per day × query × page × device × country combination)

### 6. Confirm cron fires (next day)

Cron runs daily at 03:00 Europe/London. After the first scheduled run:
- Cloud Run logs should show `[gsc-sync] completed` with row counts
- `gsc_daily` should grow by ~1 day's worth of rows

## Failure modes & resolutions

| Symptom | Likely cause | Fix |
|---|---|---|
| `GSC_SITE_URL not configured` in logs | Env var unset on Cloud Run | Re-run step 4 |
| `403 Forbidden` from googleapis | Service account not added to GSC property | Re-run step 3; double-check email exactly matches |
| `Invalid grant: account not found` | JSON key revoked or wrong project | Create new key in step 1, re-run step 4 |
| `gsc_daily` collection empty after sync | Date range has no data (new property) | Wait 2-3 days; GSC data has 2-3-day reporting lag |
| Cron not firing | `GSC_SYNC_AUTO != 'true'` | Re-run step 4; restart Cloud Run after env change |

## Acceptance criteria

- [ ] Manual `POST /api/admin/gsc/sync` returns `{ errors: [] }` and writes to Firestore
- [ ] Daily cron at 03:00 London runs successfully (check logs day 2)
- [ ] `gsc_daily` collection grows by ~1 day's rows daily
- [ ] No service-account JSON committed to git (verify `.gitignore`)

## Why this isn't more code

`api/gsc-sync.js` already handles everything: auth, pagination, idempotent upserts, error handling, logging. This is pure ops work. The only "code change" needed is the env var configuration on Cloud Run.

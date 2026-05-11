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

```bash
docker build --platform linux/amd64 \
  -t europe-west2-docker.pkg.dev/hq-website-4abc7/hq-aviation/server:v<N> .
docker push europe-west2-docker.pkg.dev/hq-website-4abc7/hq-aviation/server:v<N>
gcloud run deploy hq-aviation-server \
  --image=europe-west2-docker.pkg.dev/hq-website-4abc7/hq-aviation/server:v<N> \
  --region=europe-west2
```

## Update environment variables (Stripe keys, SMTP, etc.)

```bash
gcloud run services update hq-aviation-server \
  --region=europe-west2 \
  --update-env-vars KEY1=value1,KEY2=value2
```

For sensitive secrets, prefer Google Secret Manager — referenced in env vars as `KEY=projects/hq-website-4abc7/secrets/SECRET_NAME/versions/latest`.

## View logs

```bash
gcloud run services logs read hq-aviation-server --region=europe-west2 --limit=100
```

Or in browser: https://console.cloud.google.com/run/detail/europe-west2/hq-aviation-server/logs

## Roll back to a previous revision

List revisions:

```bash
gcloud run revisions list --service=hq-aviation-server --region=europe-west2
```

Roll back:

```bash
gcloud run services update-traffic hq-aviation-server \
  --region=europe-west2 \
  --to-revisions=<previous-revision-name>=100
```

## Monitor cost

GCP budget alert is configured at $5/mo. Free tier covers: 2M requests/mo, 360k GB-seconds memory, 180k vCPU-seconds. At HQ's expected traffic this is ~5% of allowance.

Live usage: https://console.cloud.google.com/billing

## Cold-start mitigation

uptimerobot.com pings `/api/health` every 5 min, keeping a container warm. Free tier. See `cloud-run-keep-warm-guide.md`.

## Architecture

```
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
```

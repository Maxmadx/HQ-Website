# HQ Aviation Website

Production site for HQ Aviation — Robinson helicopter sales (R22 / R44 / R66 / R88), pilot training (PPL(H), discovery flights, self-fly hire), maintenance, parts, and apparel.

## Architecture

- **Frontend:** React 19 SPA, Vite build, deployed to Firebase Hosting.
- **Backend:** Express server (`server.js`) running on Google Cloud Run (region `europe-west2`). Handles the `/api/*` surface, server-side SEO meta injection, sitemap, robots, and Stripe webhooks.
- **Data:** Firebase Auth + Firestore + Storage. See `firestore.rules` and `firestore.indexes.json`.
- **Payments:** Stripe checkout for discovery flights, apparel, and misc-marketplace items. Live + test modes selected via `STRIPE_SECRET_KEY` prefix.
- **Mail:** Nodemailer over SMTP for transactional email (booking confirmations, cart recovery, lead notifications).
- **Background:** `node-cron` jobs for cart-recovery sweeps and GSC sync.

For a deeper architectural view, see [`PRD.md`](PRD.md). For locked-in infra choices, see [`docs/infra-decisions.md`](docs/infra-decisions.md). For step-by-step traces of each customer & admin flow, see [`docs/user-flows.md`](docs/user-flows.md).

## Getting started

### Prerequisites

- Node.js ≥ 20.
- A `.env` file populated from `.env.example`. The Stripe test keys, SMTP credentials, and Firebase service-account JSON must be filled in; the server fails to boot otherwise.

### Install

```bash
npm install
```

### Run locally

```bash
npm run dev
```

Starts Vite on its default port and the Express API server on port `7500` concurrently. The React app proxies `/api/*` to the Express server.

To run only the API (e.g. when testing webhooks against a tunnel):

```bash
node server.js
```

### Build for production

```bash
npm run build
```

Emits the static SPA bundle to `dist/`.

### Production server (Docker image used by Cloud Run)

```bash
NODE_ENV=production npm start
```

## Test

```bash
npm test
```

Vitest in run mode. Covers `api/*`, `api/lib/*`, server-side SEO injection, sitemap, Stripe pricing helpers, referral attribution, parts-enquiry validation, and selected React components. See `docs/superpowers/specs/2026-05-12-site-hardening-roadmap-design.md` §5 / §7 for the coverage roadmap.

## Deploy

The site has two deploy surfaces:

- **Firebase Hosting** — static SPA. Deployed by the workflow in `.github/workflows/firebase-hosting-merge.yml` on every push to `main`. PRs get auto-generated preview URLs via `firebase-hosting-pull-request.yml`.
- **Cloud Run** — Express server. Deployed manually via:

  ```bash
  npm run deploy:server
  ```

  This builds the Docker image, pushes it to Artifact Registry, and rolls out a new Cloud Run revision in `europe-west2`. See [`docs/seo/cloud-run-deployment-guide.md`](docs/seo/cloud-run-deployment-guide.md) for the full procedure including secret rotation and rollback.

Firebase Hosting rewrites `/api/**`, `/sitemap.xml`, and `/robots.txt` to the Cloud Run service; everything else is served from the static bundle.

## Environment variables

Required vars (server boot will fail if any are missing in `NODE_ENV=production`):

- `STRIPE_SECRET_KEY` — must start with `sk_live_` in production.
- `STRIPE_WEBHOOK_SECRET` — used to verify webhook signatures.
- `FIREBASE_PROJECT_ID`, `FIREBASE_CLIENT_EMAIL`, `FIREBASE_PRIVATE_KEY` — admin SDK service account.
- `SMTP_HOST`, `SMTP_PORT`, `SMTP_USER`, `SMTP_PASS`, `SMTP_FROM` — transactional email.
- `PORT` — defaults to `7500`.

The full canonical list (with descriptions) lives in `.env.example`. `VITE_*` prefixed vars are the only ones exposed to the client bundle.

## Repository layout

```
src/                    React SPA (App.jsx + pages/ + components/ + hooks/ + lib/)
api/                    Server-side route handlers, validation, email templates
api/lib/                Shared server helpers (analytics, cart, schemas, canonical URL)
server.js               Express entry point — middleware, route mounts, graceful shutdown
public/                 Static assets served verbatim under /
scripts/                Build, seed, backfill, and operational utilities
firestore.rules         Firestore security rules
firestore.indexes.json  Firestore composite indexes
firebase.json           Firebase Hosting + rewrite config
Dockerfile              Multi-stage build for the Cloud Run image
docs/                   Architecture + SEO + plans + specs + flows
```

## Status

The site is in active development. The current improvement roadmap lives in [`docs/superpowers/specs/2026-05-12-site-hardening-roadmap-design.md`](docs/superpowers/specs/2026-05-12-site-hardening-roadmap-design.md). Phase 0 (this doc rewrite is part of it) is the first phase.

## Licence

UNLICENSED — private project.

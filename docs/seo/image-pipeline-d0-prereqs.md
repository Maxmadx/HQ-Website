# Image Pipeline — Phase D0 Pre-flight Prereqs Report

**Date:** 2026-05-09
**Spec:** docs/superpowers/specs/2026-05-09-image-optimisation-design.md
**Branch:** feat/image-pipeline-d0

## Summary

**Conditional GREEN-light:** the build-time pipeline (D1) and component layer (D2) ship as designed. The runtime endpoint (D3) is **GREEN provided the API host (`server.js`) runs as a long-lived Node process with persistent disk** — that fact needs user confirmation, because the front-end deploys via Firebase Hosting (static-only) while `server.js` runs the dynamic API on a separate, repo-undocumented host.

## D0a — Production deploy target

**Identified host:** Firebase Hosting for the static front-end (`dist/`); **API host (`server.js`) is unknown — needs user input.**

**Evidence:**
- `firebase.json` configures Hosting (`"public": "dist"`), Firestore, Storage, and Cloud Functions (nodejs20).
- `.firebaserc` → project `hq-website-4abc7`.
- `.github/workflows/firebase-hosting-merge.yml` runs `npm ci && npm run build` then `FirebaseExtended/action-hosting-deploy@v0` to channel `live`. So the front-end deploys via Firebase Hosting on push to `main`.
- `functions/` exists but has minimal deps (`firebase-admin`, `firebase-functions`, `nodemailer`) — does **not** import `server.js`; it's not the API host.
- `server.js` (513 lines) is a full Express API server: Stripe payment intents + webhooks, leads, analytics, carts, press-click, sitemap, GSC sync, cart-recovery cron. Listens on `process.env.PORT || 7500`. Started by `npm start` (`NODE_ENV=production node server.js`). Production fail-fast on `STRIPE_*`, `SMTP_*`, `FIREBASE_*`, `SITE_URL` env vars.
- No `vercel.json`, `render.yaml`, `fly.toml`, `app.yaml`, `Procfile`, `Dockerfile`, or `docker-compose.yml`.
- No GitHub Action that deploys `server.js` to any service.

**Implication for Layer 2:**
- Sharp can run there: **conditional Y** — sharp is a healthy npm package with no platform-specific blockers, but the actual host architecture (linux x64? arm64?) is unknown. Re-run `node scripts/d0-verify-sharp.js` on the production host once identified.
- Disk is writable: **conditional Y** — assumed on a traditional VPS / Render / Fly host. If the host is serverless (Cloud Run, Lambda) only `/tmp` is writable and disk cache won't survive cold starts.
- If serverless: cold-start tolerable: **TBD** — design spec assumes warm-cache hits dominate, which holds on a continuous-Node host but breaks on cold-start-per-request serverless. Mitigation if needed: rely on Cloudflare CDN caching + skip the local disk tier.

## D0a — Sharp spike result

**Result: PASS** (on macOS dev — must be re-run on production host)

Spike script: `scripts/d0-verify-sharp.js` (committed for re-use).

Sharp 0.34.5, with all needed codecs:
- libvips 8.17.3, aom 3.13.1 (AVIF), webp 1.6.0, mozjpeg, png 1.6.50.

First sample (small PNG with alpha, 405×245, used as logo):
```
Metadata: format=png width=405 height=245 hasAlpha=true
  avif: 5835 bytes, 405x245
  webp: 8566 bytes, 405x245
  png:  6235 bytes, 405x245
Disk cache write test: OK
```

Second sample (large fleet JPG, 1798×1140, 578 KB source) — to demonstrate downscaling at width 800:
```
  avif: 27,245 bytes, 800x507  (21.2x smaller than source)
  webp: 40,342 bytes, 800x507  (14.3x smaller)
  jpg:  66,202 bytes, 800x507  (8.7x smaller)
```

Compression ratios match the design spec's expectations.

**Implication for Layer 2:** Layer 2 ships as designed conditional on the production host being a continuous Node process with writable disk. **The committed spike script lets the user re-run this verification on the actual API host as the first action of D1.**

## D0b — Source filename audit

**Total sources:** 506 (~230 MB combined under `public/assets/images/`)

**By extension:**
- jpg: 385
- png: 84
- jpeg: 20
- webp: 17

**Sources < 50 KB (will be copied unchanged):** 82

**Sources > 1 MB (Layer 1's highest-impact wins):** 37

Top offenders:
- 14.78 MB — `public/assets/images/fleet/r66-g-tlmi.png`
- 8.24 MB — `public/assets/images/icons/fai-gold-rotorcraft-award.png`
- 6.88 MB — `public/assets/images/new-aircraft/r44/r44-raven-i-front-alpha.png`
- 5.61 MB — `public/assets/images/team/engineering-team-fleet.png`
- 5.49 MB — `public/assets/images/facility/hangar.png`
- 4.49 MB — `public/assets/images/facility/shyam-9427.jpg`
- 4.48 MB — `public/assets/images/facility/shyam-8662.jpg`
- 4.02 MB — `public/assets/images/facility/shyam-7319.jpg`
- 3.92 MB — `public/assets/images/facility/shyam-9017.jpg`
- 3.67 MB — `public/assets/images/facility/shyam-2183.jpg`

**Problematic filenames:**
- With spaces: 2 — `r66-icon-transparent going right.png`, `hq-aviation-logo-black copy.png`
- Non-ASCII: 0
- Variant-pattern-shaped: 214 (e.g. `hq-0007.jpg`, `hq-0153-1.jpg`) — but these are photographer-numbered sources, not pipeline variants. The Layer 1 spec uses `-WIDTH.ext` suffixes (`-400.avif`, `-800.webp`), so there is no naming collision risk.
- Path > 200 chars: 0

**Implication for Layer 1:** Minor renames recommended (rename the 2 space-bearing files for hygiene, no functional blocker). No other issues. The audit numbers also confirm Layer 1's payoff: ~37 large sources × 21x compression at AVIF q50 ≈ ~120-160 MB single-deploy bandwidth saving on first encode.

## D0c — CMS image URL audit

**Origins observed in code:**
- `firebasestorage.googleapis.com` — 8 references (admin uploads, validation in `api/wall-of-cool.js`)
- `storage.googleapis.com` — 1 reference (`scripts/migrate-images-to-storage.js` returns this form via `bucket.publicUrl()`)
- `cdn.jsdelivr.net` — 1 reference (world-atlas GeoJSON, NOT an image)
- `cdn.example.com` — 1 reference (test fixture only)
- `hqaviation.com` (self) — 17 references (canonical URLs / JSON-LD / sitemap; not third-party images)
- `cloudfront.net`, `amazonaws.com`, `imgix.net`, `cloudinary.com` — 0 references

**Allowlist required for Layer 2:**
- `firebasestorage.googleapis.com` — **YES**
- `storage.googleapis.com` — **YES**
- `hqaviation.com` — **NO** (Layer 2 doesn't proxy site-relative URLs)
- Other origins — **NO** (none observed in production code)

**Storage upload locations in code (27 grep hits across these files):**
- `src/components/WallOfCoolGr11.jsx`
- `src/components/AwesomeComponents/EditorialGrid.jsx`
- `src/lib/mediaLibrary.js` (central upload helper)
- `src/lib/imageHelpers.js`
- `src/pages/admin/AdminBlogEdit.jsx`
- `scripts/migrate-images-to-storage.js`

All upload to the project's Firebase Storage bucket (`hq-website-4abc7.firebasestorage.app`) via the `firebase/storage` SDK or admin SDK.

**Implication for Layer 2:** Allowlist as specced is sufficient. The validation pattern in `api/wall-of-cool.js:37` (`startsWith('https://firebasestorage.googleapis.com/')`) is a useful precedent — Layer 2 should use the same shape of literal-prefix check, not a regex that could be partially bypassed (e.g. by `firebasestorage.googleapis.com.evil.example`).

## D0d — Cloudflare DNS

Status: Guide written, awaiting user execution.
User-facing guide: `docs/seo/image-pipeline-cloudflare-dns-guide.md`

## Green-light decision

| Phase | Status | Reason |
|---|---|---|
| D1 (build-time pipeline) | **GREEN** | Sharp passes, codecs present, source corpus clean, big payoff (37 files >1MB). |
| D2 (`<Image>` component + rollout) | **GREEN** | No external dependency; consumes D1's output. |
| D3 (runtime endpoint) | **GREEN-conditional** | Sharp + disk-cache OK if API host is continuous-Node-with-disk; needs user confirmation of where `server.js` runs. If serverless: redesign per spec's stated fallback (skip Layer 2, rely on Cloudflare). |
| D4 (validation) | **GREEN** | No D0-level blockers. |

## Required scope changes

None — spec ships as designed, with one explicit conditional on D3. Required user actions before D3 can ship:

1. **Confirm the API host of `server.js`.** Tell the implementer whether it's a VPS, Render, Fly, Cloud Run, App Engine, or other.
2. **If serverless:** redesign Layer 2 per the spec's documented fallback (drop disk cache, lean on Cloudflare). If continuous-Node: ship as designed.
3. (Cosmetic, optional) Rename the 2 space-bearing source files before D1.
4. **(Parallel) Execute the Cloudflare DNS migration.** Doesn't block any phase but multiplies the wins from each.

## Next steps

- User confirms `server.js` host, executes Cloudflare migration in parallel.
- Once host confirmed: invoke `superpowers:writing-plans` to produce the D1 implementation plan.
- D1's first concrete task should be re-running `scripts/d0-verify-sharp.js` on the production API host before any other code lands.

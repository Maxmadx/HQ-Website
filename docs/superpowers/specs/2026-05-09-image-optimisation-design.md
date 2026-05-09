# Image Optimisation — Design

**Date:** 2026-05-09
**Status:** Draft for review
**Production domain:** `https://hqaviation.com`
**Depends on:** PR #2 (SEO refinements) and PR #3 (image CLS) — independent of merge order, but ideally land both first to keep PR scope focused.

## Goal

Cut image bytes shipped per page by 5–10× via a free, self-hosted equivalent of Cloudflare Images. Every `<img>` in the site emits responsive `<picture>` markup with AVIF / WebP / JPEG variants at multiple widths so:

- Modern browsers get the smallest format they can render
- Phones download phone-sized images, not desktop-sized
- Old browsers still get a working JPEG fallback
- New CMS uploads (via the admin app) get the same treatment automatically — no redeploy needed

Specifically targets:
- **LCP** (Largest Contentful Paint) — the dominant Core Web Vitals signal for image-heavy pages. Currently degraded by 1–4 MB hero/facility photos.
- **"Properly size images"** + **"Serve images in next-gen formats"** Lighthouse diagnostics — eliminate both.
- **Total page weight** — currently 8–40 MB on image-heavy pages. Target: ≤3 MB on mobile for any canonical page.

## Non-goals

- A paid CDN (Cloudflare Images, imgix, Cloudinary, BunnyCDN Optimizer) — explicitly rejected by user.
- Migrating asset hosting to a different platform.
- Replacing the existing Firebase Storage flow for CMS uploads.
- SVG optimisation (already vector — separate concern; svgo can be added later).
- Animated GIF replacement with WebM/MP4 (separate concern).
- Image quality auditing or content-aware cropping.

## Constraints

- **Free** — no monthly recurring fees.
- **Vite + Express + Firebase stack** — fits existing topology.
- **CMS-friendly** — admin uploads via Firebase Storage must benefit without redeploy.
- **Backwards-compatible** — existing `<img>` tags continue to work; new `<Image>` component is opt-in.

## Architecture summary

Three layers, working together:

```
┌─ Layer 1: Build-time pipeline (sharp script) ──────────────────────────┐
│  npm run build → scripts/optimize-images.js                            │
│  Walks public/assets/images/, generates 5 widths × 3 formats per src   │
│  Output: hero.jpg → hero-{400,800,1200,1600,2400}.{avif,webp,jpg}      │
│  Skipped if variant's mtime > source's mtime (incremental)             │
└────────────────────────────────────────────────────────────────────────┘
┌─ Layer 2: Runtime endpoint (Express + sharp + disk cache) ─────────────┐
│  GET /api/image?src=<encoded>&w=800&fmt=avif                           │
│  Allowlist origins (Firebase Storage, hqaviation.com)                  │
│  Cache .image-cache/<sha1>.<fmt> with size-capped LRU eviction         │
│  First request: fetch → transform → cache → stream                     │
│  Subsequent: stream from cache (static-file speed)                     │
└────────────────────────────────────────────────────────────────────────┘
┌─ Layer 3: <Image> React component ─────────────────────────────────────┐
│  Single API for both sources:                                          │
│    <Image src={localPathOrFirestoreUrl} alt sizes width height />      │
│  Detects source type, builds <picture> with srcset for each format     │
│  Local /assets/* → Layer 1 variants                                    │
│  Firebase Storage / external → Layer 2 endpoint                        │
└────────────────────────────────────────────────────────────────────────┘
```

### Why hybrid build-time + runtime

- **Build-time covers the 80% case** (every image checked into the repo). Variants are static files — zero runtime CPU, served by the existing static handler at full disk speed.
- **Runtime covers CMS uploads** (images that arrive after deploy via admin). Without it, future uploads stay un-optimised. With it, the system is future-proof.
- Either layer alone is incomplete. Together they're the equivalent of a paid CDN's behaviour.

### Why not just one or the other

- **Build-time only**: every CMS upload requires a redeploy to optimise. Bad UX for an active site.
- **Runtime only**: every static image transformation costs CPU on first request even though it could have been pre-rendered. Wasteful when 80% of bytes are predictable.

---

## Layer 1 — Build-time pipeline

### File output

For each source image at `public/assets/images/<path>/<name>.<ext>`, generate variants alongside it:

```
public/assets/images/r66/hero.jpg          (kept, original quality)
public/assets/images/r66/hero-400.avif    (new)
public/assets/images/r66/hero-400.webp    (new)
public/assets/images/r66/hero-400.jpg     (new — re-encoded, smaller than original)
public/assets/images/r66/hero-800.avif    (new)
... etc through 1200, 1600, 2400 widths
```

**Variant skipping:** if source width < target width, skip that variant (don't upscale). E.g., a 1500-wide source produces 400/800/1200 variants only; no 1600 or 2400.

**Naming:** `<basename>-<width>.<format>` where basename is the source filename minus extension.

### Configuration

```js
const SIZES = [400, 800, 1200, 1600, 2400];
const FORMATS = [
  { ext: 'avif', sharp: 'avif', options: { quality: 50, effort: 6 } },
  { ext: 'webp', sharp: 'webp', options: { quality: 75 } },
  { ext: 'jpg',  sharp: 'jpeg', options: { quality: 80, progressive: true, mozjpeg: true } },
];
const SOURCE_EXTS = /\.(jpe?g|png|webp)$/i; // skip svg, gif, ico
const SKIP_DIRS = ['optimised', 'thumbs', 'logos/icons']; // already optimal
```

### Quality rationale

- **AVIF q=50** — visually indistinguishable from JPEG q=85, ~50% smaller than WebP at equal perceived quality. The sweet spot today.
- **WebP q=75** — universally supported (94% browsers), ~25–35% smaller than JPEG.
- **JPEG q=80 + mozjpeg + progressive** — fallback for Safari < 14 and older browsers. mozjpeg is ~10% smaller than libjpeg at the same quality.

### Incremental build

Compare source `mtime` vs each variant's `mtime`. If all variants newer than source, skip. Otherwise regenerate all variants for that source. Avoids re-doing 1500 transforms on every build when nothing's changed.

### Build wiring

```json
// package.json scripts
"build": "node scripts/optimize-images.js && vite build"
```

Sharp uses a thread pool by default; explicitly cap at `os.cpus().length` to avoid memory spikes on small build machines.

### Estimated build time impact

Cold build: ~100 sources × 15 variants × ~50 ms = ~75 seconds added on first run.
Warm build (no source changes): <500 ms (mtime comparison only).

Acceptable.

### Storage impact

15 variants per source vs. 1 original. Variant total disk usage typically ~80% of one original (because variants are smaller individually). The 40 MB Shyam folder becomes ~30 MB on disk. Net wash — but bytes *served per request* drop dramatically because users only fetch 1-2 variants per image, not all 15.

### Variants tracked in git?

**Variants are gitignored.** Source originals stay in git as the truth; variants are reproducible build artefacts. `.gitignore` adds:

```
# Optimised image variants — regenerated on build
public/assets/images/**/*-[0-9]*.avif
public/assets/images/**/*-[0-9]*.webp
public/assets/images/**/*-[0-9]*.jpg
public/assets/images/**/*-[0-9]*.jpeg
```

The pattern matches `<basename>-<digits>.<ext>` — so source files keep their unsuffixed names, variants get filtered out.

**Caveat:** check that no existing source filename matches the pattern (e.g., a real source called `r22-2024.jpg`). If any do, rename them or refine the pattern. Audit step in implementation plan.

---

## Layer 2 — Runtime transform endpoint

### Endpoint

`GET /api/image?src=<encoded-url>&w=<width>&fmt=<format>`

### Validation

- `src`: must be an absolute URL whose origin is in an allowlist:
  - `https://firebasestorage.googleapis.com`
  - `https://storage.googleapis.com`
  - `https://hqaviation.com`
  - (extended only by config — never by user input)
- `w`: must be an integer in `[400, 800, 1200, 1600, 2400]` (same set as Layer 1)
- `fmt`: must be `avif` | `webp` | `jpg`

Anything else → 400 Bad Request.

### Cache layout

```
.image-cache/
  <sha1(src|w|fmt)>.avif
  <sha1(src|w|fmt)>.webp
  <sha1(src|w|fmt)>.jpg
```

SHA1 because we need a deterministic safe filename from arbitrary URLs. Collisions astronomically unlikely at this scale.

### Cache eviction

A janitor runs at server start and once an hour:
- Reads cache size
- If > 2 GB, deletes oldest-accessed entries (by `atime`) until under 1.5 GB
- Configurable via env var `IMAGE_CACHE_MAX_BYTES`

### Response

- `Content-Type: image/avif | image/webp | image/jpeg`
- `Cache-Control: public, max-age=31536000, immutable` — cache for a year, never refetch
- `ETag: <sha1>`

### Fetching the source

If source is local (`hqaviation.com/assets/...`): read from `public/`.
If source is Firebase Storage: HTTP fetch with 10-second timeout, max 5 MB response size.

If fetch fails: 502 with a 1-pixel transparent fallback (so the broken image doesn't cause CLS).

### Rate limiting

Reuse existing `express-rate-limit`. Limit: 1000 transforms per IP per hour. The cache absorbs subsequent requests for the same variant.

### Security considerations

- Allowlist prevents using your server as a free image-transform service for arbitrary internet URLs (otherwise: SSRF + DoS surface).
- Width is constrained to the fixed set — prevents `w=99999` resource exhaustion.
- Source-fetch size cap (5 MB) prevents memory exhaustion from huge sources.
- Sharp is run with `unlimited: false` (default) — caps memory per operation.

---

## Layer 3 — `<Image>` React component

### API

```jsx
<Image
  src="/assets/images/r66/hero.jpg"      // or Firebase Storage URL
  alt="Robinson R66 hero"                 // required
  width={2400}                            // intrinsic dimensions for CLS
  height={1600}
  sizes="(max-width: 768px) 100vw, 60vw"  // optional; sensible default if omitted
  priority={false}                        // true for LCP image, false otherwise
  className="..."
  loading="lazy"                          // overrideable; defaults based on priority
/>
```

### Output (via `<picture>`)

```html
<picture>
  <source type="image/avif"
          srcset="/assets/images/r66/hero-400.avif 400w, .../hero-800.avif 800w, ..."
          sizes="(max-width: 768px) 100vw, 60vw">
  <source type="image/webp"
          srcset="/assets/images/r66/hero-400.webp 400w, .../hero-800.webp 800w, ..."
          sizes="(max-width: 768px) 100vw, 60vw">
  <img src="/assets/images/r66/hero-1200.jpg"
       srcset="/assets/images/r66/hero-400.jpg 400w, .../hero-800.jpg 800w, ..."
       sizes="(max-width: 768px) 100vw, 60vw"
       width="2400" height="1600"
       alt="Robinson R66 hero"
       loading="lazy"
       decoding="async">
</picture>
```

### Source detection

```js
function isLocalPath(src) {
  return src.startsWith('/');
}

function isProxyableUrl(src) {
  if (!/^https?:\/\//.test(src)) return false;
  const ALLOW = [
    'firebasestorage.googleapis.com',
    'storage.googleapis.com',
    'hqaviation.com',
  ];
  try {
    const host = new URL(src).host;
    return ALLOW.some((h) => host === h || host.endsWith(`.${h}`));
  } catch {
    return false;
  }
}
```

- Local path → build-time variants: `<basename>-<width>.<fmt>` constructed from path
- Proxyable URL → runtime endpoint: `/api/image?src=...&w=<width>&fmt=<fmt>`
- Otherwise → render plain `<img src={src}>` (external image, no transform)

### Priority handling

- `priority={true}`:
  - `loading="eager"`
  - `fetchpriority="high"`
  - Reserved for the LCP image of each page (hero, above-fold thumbnail)
- `priority={false}` (default):
  - `loading="lazy"`
  - `fetchpriority="auto"`

### Defaults

- `sizes` default: `"(max-width: 768px) 100vw, 1200px"` — works for typical content widths
- `loading` derived from `priority` unless explicitly set
- `decoding="async"` always — never block parsing on image decode

### Component file location

`src/components/Image.jsx` + `src/components/Image.test.jsx`

### Migration policy

- New `<img>` instances should use `<Image>` going forward.
- Existing `<img>` instances stay until touched. Don't bulk-replace.
- Highest-traffic / LCP images get migrated first (homepage hero, aircraft heroes, blog covers).

---

## Adjunct — Free Cloudflare CDN in front of origin

Independent of this work but multiplies its benefit:

- Sign up Cloudflare's **free tier** (no Images plan, just regular CDN).
- Point `hqaviation.com` DNS at Cloudflare.
- Get HTTP/3, Brotli, edge caching of your origin's responses, free.
- Doesn't touch this spec but worth doing once and for all.

Out of scope for this spec but recommend tracking as a separate ~30-min task.

---

## Phasing — three PRs

Each independently shippable, each gives measurable improvement.

### PR D1 — Build-time pipeline

**Files:**
- Add: `scripts/optimize-images.js`
- Add: `sharp` as `devDependency`
- Modify: `package.json` (`build` script)
- Modify: `.gitignore` (variant pattern)
- Verify: no source filenames collide with variant pattern

**Outcome:** running `npm run build` generates 15 variants per `public/assets/images/` source. Total bytes ready to serve drop ~5×. Components don't yet use them.

**Estimate:** 1–2 days.

### PR D2 — `<Image>` component + canonical-page rollout

**Files:**
- Add: `src/components/Image.jsx`
- Add: `src/components/Image.test.jsx`
- Modify: highest-traffic canonical pages (`Home`, `AircraftR{22,44,66,88}`, `FinalMaintenance`, `FinalExpeditions`, `FinalPPL`, blog post pages, sales index)
- Replace `<img>` with `<Image>` for hero / above-fold images; mark hero with `priority`

**Outcome:** Lighthouse "Properly size images" and "Serve images in next-gen formats" diagnostics disappear on rolled-out pages. LCP drops measurably. PR description includes before/after PageSpeed Insights screenshots from a representative page.

**Estimate:** 2–3 days.

### PR D3 — Runtime endpoint for CMS images

**Files:**
- Add: `api/image.js` (Express handler)
- Add: `api/image.test.js`
- Add: `sharp` as `dependency` (was devDependency in PR D1; promote)
- Modify: `server.js` (mount endpoint, mount cache janitor)
- Add: `.gitignore` for `.image-cache/`
- Modify: `src/components/Image.jsx` to wire CMS sources through endpoint

**Outcome:** Firestore-driven images (blog covers, aircraft listings, store items) get the same treatment as build-time variants. Future admin uploads automatic.

**Estimate:** 1–2 days.

### Total

5–7 days of focused work. Equivalent to a paid CDN for image bytes shipped per request, $0/month, owned in-house.

---

## Testing strategy

### PR D1
- Unit: `optimize-images.js` exports a pure function `(srcPath, outDir, opts) → Promise<{ written: string[] }>`. Test with fixture images.
- Integration: run the script on a tiny fixture directory, assert the 15 variants exist, assert their pixel widths match expectations via `sharp().metadata()`.
- Smoke: run on the real `public/assets/images/` and confirm no errors, total disk size as expected.

### PR D2
- Unit: `<Image>` component snapshot tests for various input shapes (local, Firebase URL, external URL, with/without priority).
- Integration: render in jsdom, confirm correct `<source>` + `<img>` markup.
- Manual: Lighthouse before/after on `/aircraft/r44`. Capture in PR description.

### PR D3
- Unit: `api/image.js` allowlist validation (rejects external origins, accepts Firebase Storage), parameter validation (rejects invalid `w` and `fmt`).
- Integration: real request through the endpoint to a fixture source — confirm transformed output is valid AVIF/WebP/JPEG and dimensions match request.
- Cache: hit endpoint twice; second hit must be served from cache (no transform call).
- Eviction: fill cache past size cap, confirm janitor evicts oldest entries.
- Rate limit: confirm 429 after threshold.

---

## Open assumptions / decisions to verify during implementation

| Assumption | How to verify |
|---|---|
| No existing source filename in `public/assets/images/` matches the variant pattern `<name>-<digits>.<ext>` | First step of PR D1: run `find public/assets/images -regex '.*-[0-9]+\.\(jpe?g\|png\|webp\|avif\)$'` and rename any conflicts |
| Firebase Storage origin allowlist (`firebasestorage.googleapis.com`) covers all CMS upload destinations | Inspect `src/lib/firebase.js` and admin upload code paths |
| `npm install sharp` works on the deploy host (sharp has native binaries) | Test in CI / Firebase Hosting deploy. Alternative: pre-built binaries are available for all major platforms |
| Cache directory has writable disk on the production host | Verify Firebase Hosting allows local FS writes (or migrate cache to Firebase Storage / use in-memory only) |
| Bandwidth from Firebase Storage to the Express server doesn't dominate runtime endpoint latency | Measure during PR D3 implementation. If slow, add a memory-aware in-process LRU layer in front of disk cache |
| The 5 chosen widths (400/800/1200/1600/2400) match real layout breakpoints | Audit existing CSS during PR D2 — adjust if a major breakpoint exists outside these |

---

## Deliverables

1. **Code** — three PRs (D1, D2, D3) merged sequentially.
2. **Documentation** — `docs/seo/image-pipeline.md` summarising:
   - How to add a new image to the system
   - How `<Image>` works
   - Quality / size knobs
   - How to invalidate the cache
3. **Implementation plans** — produced by `writing-plans` skill, one per PR, after this spec is approved.
4. **PageSpeed Insights before/after** — captured in PR D2 description for at least 3 canonical pages.

---

## Success criteria

- LCP on `/aircraft/r44` drops from current state to ≤2.5s on Mobile (Slow 3G profile in PageSpeed Insights).
- Lighthouse Performance score on `/` improves by ≥15 points.
- No "Properly size images" or "Serve images in next-gen formats" warnings on any canonical page.
- Total mobile transfer size for `/aircraft/r44` drops from current → ≤1.5 MB.
- New CMS uploads via admin appear correctly sized + format-negotiated without redeploy.
- Zero monthly recurring fees beyond existing infrastructure.

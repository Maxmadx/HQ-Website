# Image Optimisation — Design (Revised)

**Date:** 2026-05-09
**Status:** Draft for review
**Production domain:** `https://hqaviation.com`
**Depends on:** PR #2 (SEO refinements) and PR #3 (image CLS) — independent of merge order, ideally land both first to keep PR scope focused.
**Revision:** Senior-dev review surfaced 5 critical issues + 4 best-practice gaps in v1. This revision addresses all of them.

## Goal

Cut image bytes shipped per page by 5–10× via a free, self-hosted equivalent of a paid image CDN. Every `<img>` in the site emits responsive `<picture>` markup with AVIF / WebP / JPEG-or-PNG variants at multiple widths so:

- Modern browsers get the smallest format they can render
- Phones download phone-sized images, not desktop-sized
- Old browsers still get a working fallback that respects transparency
- New CMS uploads (via the admin app) get the same treatment automatically — no redeploy needed
- Above-fold images render with a blurry placeholder before the real bytes arrive

Targets:
- **LCP** (Largest Contentful Paint) ≤ 2.5s on Mobile Slow-3G profile for every canonical page
- **"Properly size images" + "Serve images in next-gen formats"** Lighthouse warnings eliminated sitewide
- **Mobile total transfer** ≤ 3 MB on any canonical page

## Non-goals

- Paid image CDN (Cloudflare Images, imgix, Cloudinary, BunnyCDN Optimizer) — explicitly rejected by user
- Migrating asset hosting to a different platform
- Replacing the existing Firebase Storage flow for CMS uploads
- SVG optimisation (already vector — separate concern; svgo can be added later)
- Animated GIF replacement with WebM / MP4 (separate concern)
- Image quality auditing or content-aware cropping
- Art direction (different crops per breakpoint via `<picture media>`) — not used at HQ Aviation today

## Constraints

- **Free** — no monthly recurring fees
- **Vite + Express + Firebase stack** — fits existing topology
- **CMS-friendly** — admin uploads via Firebase Storage must benefit without redeploy
- **Backwards-compatible** — existing `<img>` tags continue to work; new `<Image>` component is opt-in
- **Sharp must work on the production host** — verified before any other work begins (see Phase D0)

---

## Considered alternatives

### `vite-imagetools` (Vite-native plugin)

Considered. **Rejected** because:
- Requires migrating call sites from `<img src="/assets/images/foo.jpg">` strings to `import foo from './foo.jpg?w=400&format=avif'` imports. ~200+ call-site rewrites, more invasive than introducing a new `<Image>` component.
- Doesn't help with CMS images at all — they're runtime URLs, not import-time references.
- The `<Image>` component approach gives a unified API across both static and CMS sources.

### Cloudflare Polish (Cloudflare Pro plan, $20/mo)

Considered. **Rejected** because the user constraint is no monthly fees. Polish is the closest paid feature to free CDNs that gives auto-WebP and lossless / lossy compression at the edge.

### Pure runtime (only Layer 2, no build-time)

Considered. **Rejected** because static images that ship in the repo can be optimised once at build time and served as static files thereafter — zero runtime CPU. Going pure-runtime wastes CPU repeatedly for predictable transformations.

### Pure build-time (only Layer 1, no runtime endpoint)

Considered. **Rejected** because every CMS upload would require a redeploy to be optimised. Bad UX for a site with active admin uploads.

---

## Architecture summary

Three layers + a free-tier CDN companion:

```
┌─ Layer 1: Build-time pipeline (sharp script) ──────────────────────────┐
│  npm run build → scripts/optimize-images.js                            │
│  Walks public/assets/images/, outputs to public/assets/optimised/      │
│  (mirror directory — eliminates filename collision risk)               │
│  5 widths × 3 formats per source, plus an LQIP placeholder             │
│  Alpha-aware: PNG sources with transparency fall back to PNG, not JPEG │
│  Skip-by-size: sources < 50 KB are copied unchanged                    │
└────────────────────────────────────────────────────────────────────────┘
┌─ Layer 2: Runtime endpoint (Express + sharp + disk cache) ─────────────┐
│  GET /api/image?src=<encoded>&w=800&fmt=avif                           │
│  Allowlist origins; rate limit; size-capped LRU disk cache             │
│  First request: fetch → transform → cache → stream                     │
│  Subsequent: stream from cache (static-file speed)                     │
└────────────────────────────────────────────────────────────────────────┘
┌─ Layer 3: <Image> React component ─────────────────────────────────────┐
│  Single API for both layers; emits <picture> with srcset               │
│  Local /assets/* → Layer 1 variants                                    │
│  Firebase Storage / hqaviation.com → Layer 2 endpoint                  │
│  Dev mode → plain <img src> (no <picture>, variants don't exist yet)   │
│  priority={true} → <link rel="preload"> via react-helmet-async         │
│  Build-time variants only → LQIP background placeholder                │
└────────────────────────────────────────────────────────────────────────┘
┌─ Phase D0: Cloudflare free-tier DNS / CDN ─────────────────────────────┐
│  Free, no Images plan — just regular CDN.                              │
│  Gives HTTP/3, Brotli, edge caching of origin's optimised files.       │
│  ~30 min DNS change. Multiplies the benefit of all three layers.       │
└────────────────────────────────────────────────────────────────────────┘
```

---

## Layer 1 — Build-time pipeline

### Output structure

Variants live in a parallel directory mirroring source structure. **No inline naming collisions possible.**

```
public/
  assets/
    images/
      r66/
        hero.jpg                       ← source (untouched)
    optimised/
      r66/
        hero-400.avif                  ← variants
        hero-400.webp
        hero-400.jpg
        hero-800.avif
        hero-800.webp
        hero-800.jpg
        hero-1200.avif
        ...
        hero-2400.avif
        hero-2400.webp
        hero-2400.jpg
        hero-lqip.txt                  ← base64-encoded blurry placeholder
```

`.gitignore` adds `public/assets/optimised/` — variants are reproducible build artefacts.

### URL pattern

The `<Image>` component constructs URLs from a known transformation rule:

```js
// /assets/images/r66/hero.jpg → /assets/optimised/r66/hero-{800}.{avif}
function variantUrl(srcPath, width, fmt) {
  const noExt = srcPath.replace(/\.[^.]+$/, '');
  return noExt.replace('/assets/images/', '/assets/optimised/') + `-${width}.${fmt}`;
}
```

Predictable and deterministic — no runtime manifest lookup needed.

### Configuration

```js
const SIZES = [400, 800, 1200, 1600, 2400];
const SOURCE_EXTS = /\.(jpe?g|png|webp)$/i; // skip .svg, .gif, .ico
const SKIP_DIRS = ['logos/icons', 'optimised']; // already optimal / output dir
const SKIP_BELOW_BYTES = 50 * 1024;            // <50 KB: copy unchanged

// Per-format quality settings; tuned for photographic content
const FORMATS = {
  avif: { quality: 50, effort: 6 },          // visually = JPEG q=85, ~half the bytes
  webp: { quality: 75 },                     // sweet spot for WebP
  jpeg: { quality: 80, mozjpeg: true, progressive: true },
  png:  { compressionLevel: 9, palette: true }, // for alpha-channel sources
};
```

### Alpha-channel handling

Before generating variants, sharp inspects the source via `metadata()`:

- **No alpha** (typical JPEG, opaque PNG): emit AVIF + WebP + JPEG variants
- **Has alpha** (transparent PNG, transparent WebP): emit AVIF + WebP + **PNG** variants — JPEG would render transparency as black/white

The `<Image>` component picks the right type for the `<source>` MIME based on what variants exist. Manifest: a tiny JSON file `optimised-manifest.json` lists which source had alpha, so the component knows whether to emit a JPEG `<source>` or PNG `<source>` for the fallback.

### Skip-by-size

Sources < 50 KB skip the variant pipeline. They're copied unchanged to the mirror directory:

```
public/assets/images/logo.png (12 KB) → public/assets/optimised/logo.png (12 KB, same bytes)
```

Reason: aggressive recompression on already-small files yields negligible bytes saved and risks visible quality loss on UI elements (logos, icons, badges).

### LQIP (low-quality image placeholder) generation

For each source ≥ 50 KB, generate a 16×16 px AVIF placeholder, base64-encode it, write to `<basename>-lqip.txt`:

```
data:image/avif;base64,AAAAHGZ0eXBhdmlmAAAAAGF2aWZtaWYxbWlhZk1BMUIAAA…
```

Component reads this string at build (via Vite `?raw` import or a generated TS module) and renders it as a CSS background placeholder.

### Incremental build

For each source: compare `mtime` against any one of its variants. If all variants are newer, skip. Avoids re-doing 1500 transforms on every build when no source changed. Cold builds stay slow; warm builds stay fast.

### Variant garbage collection

After variant generation, walk `public/assets/optimised/` and remove any variant whose corresponding source no longer exists:

```js
// For each variant <basename>-<width>.<format>:
// Check public/assets/images/<...>/<basename>.<sourceExt> exists.
// If not: delete the variant.
```

Prevents accumulation of orphaned variants over time as sources are renamed or removed.

### Build wiring

```json
// package.json scripts
"build": "node scripts/optimize-images.js && vite build",
"prebuild": "node scripts/verify-sharp.js"  // Phase D0 prerequisite
```

Sharp uses a worker pool capped at `os.cpus().length` to avoid memory spikes.

### Estimated build time

Cold (first build): ~100 sources × 15 variants × ~50 ms ≈ 75 s added.
Warm (no source changes): < 500 ms (mtime check only).
Acceptable for both interactive and CI builds.

### Storage impact

15 variants per source ≈ 80 % of one original by total bytes (variants are individually smaller). Net disk usage: similar to current. Net bytes served per request: 5–10× lower because each user only fetches 1–2 variants per image, not all 15.

---

## Layer 2 — Runtime transform endpoint

### Endpoint

```
GET /api/image?src=<encoded-url>&w=<width>&fmt=<format>
```

### Validation

- `src`: absolute URL whose origin is in a hard-coded allowlist:
  - `firebasestorage.googleapis.com`
  - `storage.googleapis.com`
  - `hqaviation.com` (and `www.hqaviation.com`)
- `w`: integer in `[400, 800, 1200, 1600, 2400]` (same set as Layer 1)
- `fmt`: `avif | webp | jpg | png`

Anything else → `400 Bad Request`.

The allowlist is explicitly hard-coded (not user-input-driven) to prevent SSRF + DoS abuse — without it, a stranger could use your server to transform arbitrary internet images at your CPU expense.

### Cache layout

```
.image-cache/
  <sha1(src|w|fmt)>.avif
  <sha1(src|w|fmt)>.webp
  <sha1(src|w|fmt)>.jpg
  <sha1(src|w|fmt)>.png
```

`.image-cache/` is gitignored.

### Cache eviction

A janitor runs at server start and once per hour:
- Reads total cache size (sum of file sizes)
- If > `IMAGE_CACHE_MAX_BYTES` (default 2 GB): delete oldest-accessed entries (by `atime`) until under 1.5 GB
- Logs evictions for visibility

### Response headers

```
Content-Type: image/avif | image/webp | image/jpeg | image/png
Cache-Control: public, max-age=31536000, immutable
ETag: "<sha1>"
```

Year-long immutable caching — variants are content-addressed (different params produce different cache keys), so they never need invalidation.

### Source fetching

- Origin in allowlist → HTTP fetch with 10s timeout, max 5 MB response size
- If fetch fails → 502 with a 1×1 transparent PNG body (so the broken image doesn't introduce CLS)

### Rate limiting

Reuse existing `express-rate-limit`. Limit: 1000 transforms per IP per hour. Cache absorbs the long tail.

### Security checklist

- Allowlist enforced at parse time
- Source-fetch byte cap (5 MB) prevents memory exhaustion
- Width set is fixed — no `w=99999` resource exhaustion vector
- Sharp run with default operation memory caps (`failOn: 'truncated'`)
- Cache dir has restricted permissions (700) — prevents other processes reading it

---

## Layer 3 — `<Image>` React component

### API

```jsx
<Image
  src="/assets/images/r66/hero.jpg"      // local path OR Firebase Storage URL
  alt="Robinson R66 hero"                 // required
  width={2400}                            // intrinsic dimensions (CLS prevention)
  height={1600}
  sizes="(max-width: 768px) 100vw, 60vw"  // optional but recommended
  priority={false}                        // true ONLY for LCP image of the page
  className="..."
/>
```

### Output (production, build-time variants)

```html
<picture>
  <source type="image/avif"
          srcset="/assets/optimised/r66/hero-400.avif 400w, ..., /assets/optimised/r66/hero-2400.avif 2400w"
          sizes="(max-width: 768px) 100vw, 60vw">
  <source type="image/webp"
          srcset="/assets/optimised/r66/hero-400.webp 400w, ..."
          sizes="(max-width: 768px) 100vw, 60vw">
  <img src="/assets/optimised/r66/hero-1200.jpg"
       srcset="/assets/optimised/r66/hero-400.jpg 400w, ..., /assets/optimised/r66/hero-2400.jpg 2400w"
       sizes="(max-width: 768px) 100vw, 60vw"
       width="2400" height="1600"
       alt="Robinson R66 hero"
       loading="lazy"
       decoding="async"
       style="background:url(data:image/avif;base64,AAAA...) center/cover">
</picture>
```

### Output (production, runtime endpoint for CMS source)

Same `<picture>` shape, but each variant URL points at `/api/image?src=<encoded>&w=...&fmt=...`. No LQIP placeholder (Layer 2 doesn't generate them — limitation, see "Soft assumptions" below).

### Output (development)

Plain `<img>`, no `<picture>`, no srcset:

```html
<img src="/assets/images/r66/hero.jpg" width="2400" height="1600" alt="..." loading="lazy">
```

Determined at render time via `import.meta.env.DEV`. Variants don't exist in dev (no build step has run); the unmodified source is served directly. Skips optimisation in dev — fine, dev isn't perf-critical.

### Source detection

```js
function isLocalPath(src) {
  return src.startsWith('/assets/images/');
}

function isProxyableUrl(src) {
  if (!/^https?:\/\//.test(src)) return false;
  const ALLOWED_HOSTS = [
    'firebasestorage.googleapis.com',
    'storage.googleapis.com',
    'hqaviation.com',
    'www.hqaviation.com',
  ];
  try {
    return ALLOWED_HOSTS.includes(new URL(src).host);
  } catch {
    return false;
  }
}
```

- Local path → Layer 1 build-time variants in `/assets/optimised/<...>`
- Proxyable URL → Layer 2 runtime endpoint
- Neither → render plain `<img src={src}>` (external image, no transform)

### Priority handling — tuned per [web.dev LCP guidance](https://web.dev/articles/lcp-image-element)

| `priority` | `loading` | `fetchpriority` | `decoding` | Preload `<link>` |
|---|---|---|---|---|
| `true` (LCP) | `eager` | `high` | (omitted — sync default) | yes |
| `false` (default) | `lazy` | (omitted — auto) | `async` | no |

`decoding="sync"` (omitted) on the LCP image avoids a render delay between download and paint. `decoding="async"` on every other image avoids blocking parsing on image decode.

### LCP preload via react-helmet-async

When `priority={true}`, the component emits a preload link in `<head>` via the existing react-helmet-async setup from PR #1:

```jsx
import { Helmet } from 'react-helmet-async';

{priority && (
  <Helmet>
    <link rel="preload" as="image"
          imagesrcset={buildSrcSet('avif')}
          imagesizes={sizes}
          type="image/avif" />
  </Helmet>
)}
```

Lets the browser start fetching the LCP image during HTML parsing, before discovering the `<picture>` tag in the body. **Single biggest LCP-specific optimisation** — typically saves 100–500 ms of LCP time on slow networks.

Only ONE image per page should have `priority={true}`. Document this in the component's JSDoc.

### LQIP background

For build-time variants only, the component reads the LQIP base64 string at build time (via Vite `?raw` import generated by Layer 1) and renders it as a CSS background:

```jsx
style={{
  ...rest,
  backgroundImage: lqip ? `url("${lqip}")` : undefined,
  backgroundSize: 'cover',
  backgroundPosition: 'center',
}}
```

Browser shows the blurry placeholder immediately; real image swaps in when it loads. ~400 bytes per image in HTML, big perceived-speed win.

### Defaults

- `sizes` default: `"(max-width: 768px) 100vw, 1200px"` — covers typical content widths. Override per-call-site for hero / full-width images.
- `loading` derived from `priority` unless explicitly set.
- `decoding` derived from `priority`.

### Migration policy

- New `<img>` instances should use `<Image>` going forward.
- Existing `<img>` instances stay until touched. Don't bulk-replace.
- Highest-traffic / LCP images get migrated first (homepage hero, aircraft page heroes, blog covers).

### Component file location

`src/components/Image.jsx` + `src/components/Image.test.jsx`

---

## Phasing — five PRs

### Phase D0 — Pre-flight & DNS *(half day)*

Before any code is written:

**D0a — Verify sharp on production host.** Run a one-line spike on the actual deploy target:

```bash
node -e "console.log(require('sharp')('public/assets/images/hq-aviation-logo.png').metadata().then(m => console.log(m.width, m.height)))"
```

If sharp installs and runs: green-light D1.
If it doesn't (e.g., serverless platform without native binary support): redesign Layer 2 (or skip Layer 2 entirely and accept that CMS uploads stay un-optimised until redeploy).

**D0b — Audit source filenames.** Run `find public/assets/images -type f | sort > /tmp/sources.txt` and inspect for any oddities (non-ASCII names, very long names, etc.) that might trip up the sharp pipeline.

**D0c — Verify allowlist matches reality.** Grep the codebase for image URL patterns coming from CMS:

```bash
grep -rE "firebasestorage|storage.googleapis" src/ api/
```

Confirm `firebasestorage.googleapis.com` and `storage.googleapis.com` are the only origins in use. Add others to the allowlist if found.

**D0d — Cloudflare free-tier DNS** *(30 min)*. Sign up Cloudflare (free), add `hqaviation.com`, change nameservers at the registrar. Get HTTP/3, Brotli, edge caching of origin responses for free. Doesn't block other phases — can be done in parallel.

### Phase D1 — Build-time pipeline *(1–2 days)*

**Files:**
- Add: `scripts/optimize-images.js` (sharp variant generator + LQIP + manifest + GC)
- Add: `scripts/verify-sharp.js` (D0a one-liner formalised)
- Add: `sharp` as `devDependency`
- Modify: `package.json` (`build` + `prebuild` scripts)
- Modify: `.gitignore` (`public/assets/optimised/`)
- Add: `public/assets/optimised/optimised-manifest.json` (alpha info per source)

**Outcome:** running `npm run build` regenerates `public/assets/optimised/`. Total served bytes per request expected to drop ~5× once components consume them. Components don't yet use them.

### Phase D2 — `<Image>` component + canonical-page rollout *(2–3 days)*

**Files:**
- Add: `src/components/Image.jsx`
- Add: `src/components/Image.test.jsx`
- Add: `src/lib/imageVariantUrl.js` + tests (the `variantUrl` helper)
- Add: `docs/seo/lighthouse-baseline-2026-05-09.md` (BEFORE measurements — required Task 1)
- Modify: highest-traffic canonical pages — `Home`, `AircraftR{22,44,66,88}`, `FinalMaintenance`, `FinalExpeditions`, `FinalPPL`, blog post pages, sales index
- Replace `<img>` with `<Image>` for hero / above-fold images; mark hero images with `priority={true}`

**Task 1 (mandatory):** capture Lighthouse Mobile baseline for 5 representative URLs (Home, R44, R66, training/PPL, maintenance). Record Performance / LCP / CLS / total transferred. Commit to the baseline doc. Without this, success can't be verified.

**Outcome:** Lighthouse "Properly size images" and "Serve images in next-gen formats" warnings disappear on rolled-out pages. LCP measurably drops vs baseline.

### Phase D3 — Runtime endpoint for CMS images *(1–2 days)*

**Files:**
- Add: `api/image.js` (Express handler)
- Add: `api/image.test.js`
- Add: `api/imageCacheJanitor.js` (size-capped LRU eviction)
- Modify: `package.json` — promote `sharp` from `devDependencies` to `dependencies`
- Modify: `server.js` — mount endpoint, mount janitor
- Modify: `.gitignore` — add `.image-cache/`
- Modify: `src/components/Image.jsx` — wire CMS sources through `/api/image`

**Outcome:** Firestore-driven images (blog covers, aircraft listings, store items) get the same treatment as build-time variants. Future admin uploads handled automatically.

### Phase D4 — Validation & measurement *(half day)*

**Files:**
- Modify: `docs/seo/lighthouse-baseline-2026-05-09.md` — append AFTER measurements

**Tasks:**
1. Re-run Lighthouse Mobile on the 5 baseline pages
2. Compare against D2's recorded baseline
3. For each page:
   - Performance score delta
   - LCP delta
   - CLS delta (should be unchanged — already addressed in PR #3)
   - Total transferred delta
4. If any page misses the success criteria: open a follow-up issue with specifics
5. Update success criteria with concrete numbers

Without this phase, the work is "done" but the value is unproven. Half-day, non-negotiable.

### Total

5 PRs over ~5–7 days of focused work. Equivalent to a paid CDN at $0/month, owned in-house.

---

## Testing strategy

### Unit
- `optimize-images.js` — pure function `(srcPath, outDir, opts) → Promise<{ written, lqip }>`. Test with fixture images including alpha and < 50 KB cases.
- `Image.jsx` — snapshot tests for: local path, Firebase URL, external URL, with/without priority, with/without LQIP, dev mode.
- `imageVariantUrl.js` — pure URL construction. Test edge cases (subdirs, hyphens in name, unusual extensions).
- `api/image.js` — allowlist validation (rejects external origins), parameter validation (rejects invalid `w` and `fmt`), 404 on missing source.

### Integration
- Run `optimize-images.js` against a fixture directory containing photographic JPEG, transparent PNG, < 50 KB logo. Assert correct variants produced for each.
- Real request through `/api/image` to a fixture source. Assert valid AVIF/WebP/JPEG/PNG output and dimensions match request.
- Cache hit: hit endpoint twice, second hit must be served from cache (no transform call). Assert via spy on sharp.
- Eviction: fill cache past size cap, confirm janitor evicts oldest entries.
- Rate limit: confirm 429 after threshold.

### Manual
- Lighthouse Mobile before/after on 5 baseline pages (Phase D2 Task 1, Phase D4)
- Visual smoke check: load `/aircraft/r66`, `/maintenance`, `/blog/<post>` in Chrome with throttled network. Confirm LQIP placeholder appears immediately, real image swaps in cleanly, no layout shift.
- Browser support spot-check: load `/` in Safari (latest), Chrome (latest), Firefox (latest). Confirm AVIF served to all three. Older Safari (≤14) gets WebP/JPEG fallback — verify with a UA spoof if needed.

### Recommended (not required) follow-ups
- Visual regression with Playwright + Percy or backstop.js
- Lighthouse CI on every PR (catches Performance / LCP regressions)
- Memory leak testing on the runtime endpoint via `clinic.js` heap snapshots

---

## Hard prerequisites — must verify before D1 begins

| Prereq | Verification | Blocker if fails? |
|---|---|---|
| Sharp installs and runs on the production host | D0a — one-line spike | **Yes — Layer 2 dies; reconsider scope** |
| No source filename in `public/assets/images/` collides with the variant pattern (impossible with separate `optimised/` dir but worth checking the source inventory) | D0b — `find` audit | No (mirror dir eliminates collision) but worth confirming source hygiene |
| Allowlist origins match real CMS upload patterns | D0c — grep audit of `src/` and `api/` | Yes — Layer 2 will 400 valid CMS images otherwise |
| Disk is writable on production host | D0a — same spike, write test file to `.image-cache/` | Yes for Layer 2; if read-only host, switch cache to memory or skip Layer 2 |

---

## Soft assumptions — verify during implementation

| Assumption | How to verify |
|---|---|
| The 5 chosen widths (400 / 800 / 1200 / 1600 / 2400) match real CSS breakpoints | Phase D2 — grep `src/**/*.css` for `@media (max-width:` and reconcile |
| 2 GB cache size cap is appropriate for traffic | Monitor cache fill rate post-D3 launch; tune `IMAGE_CACHE_MAX_BYTES` env var if needed |
| Sharp build-time concurrency at `os.cpus().length` doesn't trip CI memory limits | Test in CI with `vite build` integrated. Reduce to `os.cpus().length / 2` if it does |
| LQIP base64 strings (~400 B each) don't materially bloat HTML for image-heavy pages | Measure HTML transfer size on a worst-case page (probably `/maintenance`); if > +5%, switch to lazy LQIP via `lazyloading` polyfill |
| react-helmet-async correctly handles concurrent `<link rel="preload">` from multiple `<Image priority>` calls | Phase D2 — render two priority images in a test render, confirm only ONE preload link emitted in head (or document the duplicate as harmless) |

### Known limitations

- **LQIP only available for build-time (Layer 1) variants.** CMS images via Layer 2 don't get a placeholder — they render with a blank box until loaded. Acceptable trade-off; could add LQIP to Layer 2 in a future enhancement.
- **Variants don't exist in dev mode** — `<Image>` component falls back to plain `<img>` in dev. Optimisation visible only in production / `vite preview` after a build.
- **Single Express instance assumption** — disk cache is local. Horizontally scaled instances each have their own cache. Acceptable for current scale; switch to shared cache (Redis / Firestore-backed) if scaling out.

---

## Deliverables

1. **Code** — five PRs (D0a/b/c, D0d, D1, D2, D3, D4) merged sequentially. D0a/b/c can be a single small "preflight" PR; D0d is a separate task (DNS change, no code).
2. **Documentation:**
   - `docs/seo/image-pipeline.md` — how to add new images, how `<Image>` works, quality knobs, cache management
   - `docs/seo/lighthouse-baseline-2026-05-09.md` — before / after numbers for the 5 baseline pages
3. **Implementation plans** — produced by `writing-plans`, one per code PR (D1, D2, D3), after this spec is approved.
4. **PageSpeed Insights screenshots** — captured in PR D2 description (rolled-out pages) and PR D4 description (final state).

---

## Success criteria

- LCP on `/aircraft/r44` ≤ 2.5 s on Lighthouse Mobile (Slow 3G profile) — measured against baseline captured in D2 Task 1.
- Lighthouse Performance score on `/` improves by ≥ 15 points vs. baseline.
- No "Properly size images" or "Serve images in next-gen formats" Lighthouse warnings on any of the 5 baseline pages.
- Total mobile transfer for `/aircraft/r44` ≤ 1.5 MB (vs. an estimated 6–10 MB pre-implementation).
- New CMS uploads via admin appear correctly sized + format-negotiated without redeploy (verified by uploading a test image to a blog post and inspecting `/blog/<id>` source).
- Zero monthly recurring fees beyond existing infrastructure.
- All hard prerequisites pass at D0; if any fail, scope renegotiated before D1 starts.

---

## Out-of-scope follow-ups (track separately)

- **Image XML sitemap** (`<image:image>` extension) — helps Google discover images. ~30 min add to existing `api/sitemap.js`. Marginal SEO benefit. Track as a follow-up task.
- **Visual regression CI** — backstop.js / Percy. Adds CI complexity. Worth doing for a perf-focused codebase.
- **Lighthouse CI** — automated regression catch on every PR.
- **Art direction** (`<picture media="...">`) — different crops per breakpoint. Not currently used at HQ Aviation; revisit when needed.
- **LQIP for Layer 2** — runtime endpoint also generates blur placeholders. Currently a known limitation.
- **`<image:image>` in sitemap.xml** for image discovery
- **SVG optimisation** via svgo as part of build pipeline
- **Animated GIF replacement** with WebM / MP4 (separate concern — much smaller, smoother)

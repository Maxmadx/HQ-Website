# Image Optimisation — Phase D2 (`<Image>` Component + Canonical-Page Rollout) Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build an `<Image>` React component that consumes D1's variants (AVIF/WebP/JPEG/PNG at 5 widths + LQIP placeholders) via `<picture>` markup, then roll it out onto the highest-traffic canonical pages (Home, four aircraft pages, three Final* pages, blog posts) replacing existing `<img>` tags at hero / above-fold locations. Components below the fold keep their existing `<img>` tags (already have width/height from PR #3) — full sweep is a follow-up.

**Architecture:** Single React component `src/components/Image.jsx` with three rendering modes — production (`<picture>` + srcset + LQIP background), dev (plain `<img>` falling through to source — variants only exist after build), and external/unsupported source (also plain `<img>`). Pure helpers in `src/lib/imageVariantUrl.js` build variant URLs deterministically from the predictable pattern D1 established. Manifest from D1 is consumed at build time via Vite's ESM JSON import. Priority images emit `<link rel="preload">` via the existing react-helmet-async setup from PR #1. Lighthouse baseline captured BEFORE any component rollout so D4 can measure deltas honestly.

**Tech Stack:** React 19 + react-helmet-async (PR #1), vitest 4 + jsdom + @testing-library/react (existing), Vite 8 (ESM JSON imports), the manifest written by D1.

**Reference files:**
- Spec: `docs/superpowers/specs/2026-05-09-image-optimisation-design.md` (revised — D2 section)
- D1 manifest schema: `src/lib/imageOptimisation.js` (the `manifestEntry` shape in `processOneSource`)
- D1 variant URL pattern: `/assets/optimised/<path>/<basename>-<width>.<format>`
- Existing component test pattern: `src/pages/NotFound.test.jsx`
- Existing react-helmet-async usage: `src/components/seo/Seo.jsx`

**Commit discipline:** one commit per task. Prefix `feat(images):` for new behaviour, `chore(images):` for infra, `docs(images):` for docs, `test(images):` for test-only. **One commit per task — do not batch.**

**Pre-flight gate:**
- **PR #6 (D1) merged to main.** Without that, no manifest, no variants, nothing to consume.
- Variants exist on disk in worktree after first `npm run build` (the prebuild hook triggers D1 pipeline).
- Existing PR #3 regression test `src/lib/canonicalImgDimensions.test.js` still passes.

**User-input gates:**
- None for the code work. Lighthouse baseline measurement in Task 2 can be either user-run (PageSpeed Insights browser) OR scripted with `lighthouse` npm package — see Task 2 options.

---

## File Structure

### New files

| Path | Responsibility |
|---|---|
| `src/lib/imageVariantUrl.js` | Pure helpers: `variantUrl(srcPath, width, fmt)`, `isLocalPath(src)`, `isProxyableUrl(src)`, `buildSrcSet(srcPath, format, widths)` |
| `src/lib/imageVariantUrl.test.js` | Vitest tests for the URL builders |
| `src/lib/optimisedManifest.js` | Single export: the parsed manifest loaded via Vite's JSON import. Wraps `import manifest from '...'` so call-sites are clean. |
| `src/components/Image.jsx` | The `<Image>` component — three modes (production / dev / passthrough) |
| `src/components/Image.test.jsx` | Snapshot + behaviour tests for `<Image>` |
| `docs/seo/lighthouse-baseline-2026-05-11.md` | BEFORE Lighthouse measurements for the 5 baseline pages — committed in Task 2 BEFORE any rollout begins |

### Modified files

| Path | Why |
|---|---|
| `src/pages/Home.jsx` | Replace hero `<img>` with `<Image priority>` |
| `src/pages/AircraftR22.jsx` | Same for hero |
| `src/pages/AircraftR44.jsx` | Same |
| `src/pages/AircraftR66.jsx` | Same |
| `src/pages/AircraftR88.jsx` | Same |
| `src/pages/FinalMaintenance.jsx` | Hero + key above-fold imgs |
| `src/pages/FinalExpeditions.jsx` | Hero + key above-fold imgs |
| `src/pages/FinalPPL.jsx` | Hero + key above-fold imgs |
| `src/pages/blog/*.jsx` (13 files) | Cover image at top of each blog post |
| `src/pages/Sales.jsx` | Hero |

(Below-fold and gallery images stay as `<img>` in this PR — they already have width/height from PR #3.)

---

## Task 1: Set up D2 worktree

**Files:**
- No code changes (worktree setup)

- [ ] **Step 1:** Confirm PR #6 merged

```bash
cd /Users/maximussmith/Downloads/HQ-Website-main
git fetch origin
git log origin/main --oneline | grep -m1 "D1 — build-time variant pipeline" && echo "PR #6 merged" || echo "PR #6 NOT merged — stop"
```

Expected: prints "PR #6 merged". If not: stop, merge PR #6 first.

- [ ] **Step 2:** Sync main and create worktree

```bash
git switch main
git pull origin main
git worktree add ../HQ-Website-main-img-d2 -b feat/image-pipeline-d2
cd ../HQ-Website-main-img-d2
```

- [ ] **Step 3:** Install deps + run first build (will trigger D1 prebuild to generate variants)

```bash
npm install --legacy-peer-deps 2>&1 | tail -3
npm run build 2>&1 | tail -5
```

Expected: prebuild runs optimize-images.js (cached, <1s if variants from earlier branch carried over via shared `public/assets/optimised/`), then vite build succeeds. If variants don't exist yet in the worktree: prebuild takes ~20 min cold.

- [ ] **Step 4:** Confirm the manifest is in place

```bash
ls -lh public/assets/optimised/optimised-manifest.json
head -20 public/assets/optimised/optimised-manifest.json
```

Expected: file exists, ~398 KB, valid JSON with `{ "version": 1, "sources": {...} }` shape.

(No commit — setup only.)

---

## Task 2: Capture Lighthouse baseline for 5 canonical pages

**Files:**
- Create: `docs/seo/lighthouse-baseline-2026-05-11.md`

This is MANDATORY before any component rollout. Without recorded "before" numbers, the success criteria in the spec become vibes. D4 will compare against this.

**Option A — Browser (recommended for accuracy):**

For each URL below, open https://pagespeed.web.dev, paste the URL, click **Analyze**, wait for the report, capture Mobile-tab numbers:

URLs to test:
- `https://hq-website-4abc7.web.app/`
- `https://hq-website-4abc7.web.app/aircraft/r44`
- `https://hq-website-4abc7.web.app/aircraft/r66`
- `https://hq-website-4abc7.web.app/training/ppl`
- `https://hq-website-4abc7.web.app/maintenance`

Record (per page, Mobile tab):
- Performance score (0–100)
- LCP (seconds)
- CLS (number)
- INP / TBT (whichever shown)
- Total transferred (KB) — from the "Properly size images" or "Network requests" section
- "Properly size images" estimated savings (KB)
- "Serve images in next-gen formats" estimated savings (KB)

**Option B — Lighthouse CLI (scripted, less accurate per-run but reproducible):**

```bash
npx --yes lighthouse https://hq-website-4abc7.web.app/ --output=json --output-path=/tmp/lh-home.json --preset=desktop --quiet
npx --yes lighthouse https://hq-website-4abc7.web.app/ --output=json --output-path=/tmp/lh-home-mobile.json --emulated-form-factor=mobile --quiet
# ... repeat per URL
```

Then parse each JSON file for the metrics.

- [ ] **Step 1:** Run measurements (whichever option)

- [ ] **Step 2:** Create `docs/seo/lighthouse-baseline-2026-05-11.md` with this template, replacing all `<...>` placeholders with real values:

```markdown
# Lighthouse Baseline — Before Image Optimisation D2

**Date captured:** 2026-05-11 (UTC)
**Method:** PageSpeed Insights (lab data, Mobile tab) [OR: Lighthouse CLI v<X>]
**Network profile:** PSI default (simulated Slow 4G)
**Device:** Moto G Power emulated

## Per-page (Mobile)

| URL | Perf | LCP (s) | CLS | INP/TBT | Total KB | Properly-size savings (KB) | Next-gen savings (KB) |
|---|---|---|---|---|---|---|---|
| `/` | <N> | <N>s | <N> | <N>ms | <N> | <N> | <N> |
| `/aircraft/r44` | <N> | <N>s | <N> | <N>ms | <N> | <N> | <N> |
| `/aircraft/r66` | <N> | <N>s | <N> | <N>ms | <N> | <N> | <N> |
| `/training/ppl` | <N> | <N>s | <N> | <N>ms | <N> | <N> | <N> |
| `/maintenance` | <N> | <N>s | <N> | <N>ms | <N> | <N> | <N> |

## Per-page (Desktop) — for context, not the primary metric

| URL | Perf | LCP (s) | CLS | Total KB |
|---|---|---|---|---|
| `/` | <N> | <N>s | <N> | <N> |
| `/aircraft/r44` | <N> | <N>s | <N> | <N> |

## Success criteria

D4 measures the SAME URLs after rollout and compares deltas:

- LCP improvement ≥ 30% (target: any page currently > 2.5s drops to ≤ 2.5s)
- Performance score improvement ≥ 15 points on at least 3 of 5 pages
- "Properly size images" savings drop to ≤ 50 KB (currently <N> KB)
- "Serve images in next-gen formats" savings drop to 0

## Notes / context

[Any caveats from the measurement — e.g. one-run-vs-average, network blip, etc.]
```

- [ ] **Step 3:** Commit

```bash
git add docs/seo/lighthouse-baseline-2026-05-11.md
git commit -m "docs(images): Lighthouse baseline before D2 rollout — 5 canonical pages, Mobile + Desktop"
```

---

## Task 3: `variantUrl` + source detection helpers

**Files:**
- Create: `src/lib/imageVariantUrl.js`
- Create: `src/lib/imageVariantUrl.test.js`

- [ ] **Step 1:** Write the failing tests

```js
// src/lib/imageVariantUrl.test.js
import { describe, it, expect } from 'vitest';
import {
  variantUrl,
  isLocalPath,
  isProxyableUrl,
  buildSrcSet,
} from './imageVariantUrl';

describe('variantUrl', () => {
  it('rewrites a local source path to the variant pattern', () => {
    expect(variantUrl('/assets/images/r66/hero.jpg', 800, 'avif'))
      .toBe('/assets/optimised/r66/hero-800.avif');
  });

  it('handles nested directories', () => {
    expect(variantUrl('/assets/images/expeditions/gallery/shot.png', 1200, 'webp'))
      .toBe('/assets/optimised/expeditions/gallery/shot-1200.webp');
  });

  it('strips the source extension and applies the new one', () => {
    expect(variantUrl('/assets/images/foo.webp', 400, 'avif'))
      .toBe('/assets/optimised/foo-400.avif');
  });

  it('maps jpeg requests to .jpg files (sharp convention)', () => {
    expect(variantUrl('/assets/images/foo.jpg', 800, 'jpeg'))
      .toBe('/assets/optimised/foo-800.jpg');
  });
});

describe('isLocalPath', () => {
  it('accepts /assets/images/* paths', () => {
    expect(isLocalPath('/assets/images/r66/hero.jpg')).toBe(true);
  });
  it('rejects external URLs', () => {
    expect(isLocalPath('https://firebasestorage.googleapis.com/x')).toBe(false);
  });
  it('rejects other absolute paths', () => {
    expect(isLocalPath('/other/path.jpg')).toBe(false);
  });
});

describe('isProxyableUrl', () => {
  it('accepts Firebase Storage URLs', () => {
    expect(isProxyableUrl('https://firebasestorage.googleapis.com/v0/b/x/o/y')).toBe(true);
  });
  it('accepts storage.googleapis.com', () => {
    expect(isProxyableUrl('https://storage.googleapis.com/x')).toBe(true);
  });
  it('accepts hqaviation.com', () => {
    expect(isProxyableUrl('https://hqaviation.com/img.jpg')).toBe(true);
  });
  it('accepts www.hqaviation.com', () => {
    expect(isProxyableUrl('https://www.hqaviation.com/img.jpg')).toBe(true);
  });
  it('rejects other origins', () => {
    expect(isProxyableUrl('https://example.com/img.jpg')).toBe(false);
    expect(isProxyableUrl('https://cdn.imgur.com/x')).toBe(false);
  });
  it('rejects non-HTTP schemes', () => {
    expect(isProxyableUrl('/assets/images/r66/hero.jpg')).toBe(false);
    expect(isProxyableUrl('data:image/png;base64,xx')).toBe(false);
  });
});

describe('buildSrcSet', () => {
  it('emits comma-separated entries with width descriptors', () => {
    const set = buildSrcSet('/assets/images/r66/hero.jpg', 'avif', [400, 800, 1200]);
    expect(set).toBe(
      '/assets/optimised/r66/hero-400.avif 400w, ' +
      '/assets/optimised/r66/hero-800.avif 800w, ' +
      '/assets/optimised/r66/hero-1200.avif 1200w'
    );
  });

  it('returns empty string for empty widths', () => {
    expect(buildSrcSet('/assets/images/foo.jpg', 'webp', [])).toBe('');
  });
});
```

- [ ] **Step 2:** Run — expect failure

```bash
npx vitest run src/lib/imageVariantUrl.test.js
```

- [ ] **Step 3:** Implement

```js
// src/lib/imageVariantUrl.js

const ALLOWED_PROXY_HOSTS = [
  'firebasestorage.googleapis.com',
  'storage.googleapis.com',
  'hqaviation.com',
  'www.hqaviation.com',
];

/**
 * Convert a source path to its optimised-variant URL.
 *
 * Example:
 *   variantUrl('/assets/images/r66/hero.jpg', 800, 'avif')
 *     → '/assets/optimised/r66/hero-800.avif'
 *
 * Maps the `jpeg` format to a `.jpg` file extension (sharp convention used in D1).
 */
export function variantUrl(srcPath, width, format) {
  const ext = format === 'jpeg' ? 'jpg' : format;
  const noExt = srcPath.replace(/\.[^.]+$/, '');
  return noExt.replace('/assets/images/', '/assets/optimised/') + `-${width}.${ext}`;
}

/**
 * Does the source live in the local build-time-optimised tree?
 */
export function isLocalPath(src) {
  return typeof src === 'string' && src.startsWith('/assets/images/');
}

/**
 * Is the source URL one Layer 2 (runtime endpoint) is allowed to proxy?
 * Only same-origin or Firebase Storage URLs are allowed — others render as plain <img>.
 */
export function isProxyableUrl(src) {
  if (typeof src !== 'string' || !/^https?:\/\//i.test(src)) return false;
  try {
    return ALLOWED_PROXY_HOSTS.includes(new URL(src).host);
  } catch {
    return false;
  }
}

/**
 * Build a srcset string for the given format across the given widths.
 * Returns the empty string when widths is empty.
 */
export function buildSrcSet(srcPath, format, widths) {
  return widths.map(w => `${variantUrl(srcPath, w, format)} ${w}w`).join(', ');
}
```

- [ ] **Step 4:** Run — expect pass

```bash
npx vitest run src/lib/imageVariantUrl.test.js
```

- [ ] **Step 5:** Commit

```bash
git add src/lib/imageVariantUrl.js src/lib/imageVariantUrl.test.js
git commit -m "feat(images): variantUrl + isLocalPath + isProxyableUrl + buildSrcSet helpers"
```

---

## Task 4: Manifest loader (Vite JSON import)

**Files:**
- Create: `src/lib/optimisedManifest.js`

- [ ] **Step 1:** Implement

```js
// src/lib/optimisedManifest.js
//
// Loads the build-time-generated optimised manifest as an ESM object.
// Vite resolves JSON imports natively. The shape is what D1's
// scripts/optimize-images.js writes.

import manifest from '../../public/assets/optimised/optimised-manifest.json';

export default manifest;

/**
 * Lookup helper: given a source URL like '/assets/images/r66/hero.jpg',
 * return the manifest entry for that source (or null if not in manifest).
 */
export function getManifestEntry(srcPath) {
  if (!srcPath || typeof srcPath !== 'string') return null;
  const rel = srcPath.replace(/^\/assets\/images\//, '');
  return manifest.sources?.[rel] ?? null;
}
```

- [ ] **Step 2:** Smoke test the import works via vitest (which uses Vite's import pipeline)

```bash
cat > /tmp/manifest-smoke.test.js <<'EOF'
import { describe, it, expect } from 'vitest';
import manifest, { getManifestEntry } from '../../HQ-Website-main-img-d2/src/lib/optimisedManifest.js';

describe('manifest loads via Vite JSON import', () => {
  it('has a sources object', () => {
    expect(manifest.sources).toBeTruthy();
    expect(Object.keys(manifest.sources).length).toBeGreaterThan(0);
  });
  it('getManifestEntry returns null for unknown source', () => {
    expect(getManifestEntry('/assets/images/does-not-exist.jpg')).toBeNull();
  });
});
EOF
npx vitest run /tmp/manifest-smoke.test.js 2>&1 | tail -5
rm /tmp/manifest-smoke.test.js
```

Expected: passes. If Vite can't resolve `../../public/...` from a `src/lib/` file (sometimes Vite restricts paths to within `src/`): work around by adding a Vite config alias OR by copying the manifest into `src/lib/` as part of the prebuild.

- [ ] **Step 3:** Commit

```bash
git add src/lib/optimisedManifest.js
git commit -m "feat(images): optimisedManifest loader + getManifestEntry lookup helper"
```

---

## Task 5: `<Image>` component — production mode (`<picture>` + srcset)

**Files:**
- Create: `src/components/Image.jsx`
- Create: `src/components/Image.test.jsx`

- [ ] **Step 1:** Write failing tests

```jsx
// src/components/Image.test.jsx
import { render, screen } from '@testing-library/react';
import { HelmetProvider } from 'react-helmet-async';
import { describe, it, expect, vi, beforeEach } from 'vitest';

vi.mock('../lib/optimisedManifest', () => ({
  default: {
    version: 1,
    sources: {
      '__test__/opaque.jpg': {
        hasAlpha: false,
        variantWidths: [400, 800, 1200, 1600, 2400],
        variantFormats: ['avif', 'webp', 'jpeg'],
        lqip: 'data:image/avif;base64,XXXX',
      },
      '__test__/alpha.png': {
        hasAlpha: true,
        variantWidths: [400, 800],
        variantFormats: ['avif', 'webp', 'png'],
        lqip: 'data:image/avif;base64,YYYY',
      },
    },
  },
  getManifestEntry: (srcPath) => {
    const rel = srcPath.replace(/^\/assets\/images\//, '');
    const entries = {
      '__test__/opaque.jpg': {
        hasAlpha: false,
        variantWidths: [400, 800, 1200, 1600, 2400],
        variantFormats: ['avif', 'webp', 'jpeg'],
        lqip: 'data:image/avif;base64,XXXX',
      },
      '__test__/alpha.png': {
        hasAlpha: true,
        variantWidths: [400, 800],
        variantFormats: ['avif', 'webp', 'png'],
        lqip: 'data:image/avif;base64,YYYY',
      },
    };
    return entries[rel] ?? null;
  },
}));

import Image from './Image';

function renderInProvider(node) {
  return render(<HelmetProvider>{node}</HelmetProvider>);
}

describe('<Image> — production mode', () => {
  it('emits a <picture> with AVIF and WebP <source> tags for a local opaque source', () => {
    renderInProvider(
      <Image
        src="/assets/images/__test__/opaque.jpg"
        alt="opaque"
        width={2400}
        height={1600}
        sizes="100vw"
        __forceProd
      />
    );
    const picture = screen.getByAltText('opaque').closest('picture');
    expect(picture).toBeTruthy();
    const sources = picture.querySelectorAll('source');
    expect(sources.length).toBeGreaterThanOrEqual(2);
    const types = Array.from(sources).map(s => s.getAttribute('type'));
    expect(types).toContain('image/avif');
    expect(types).toContain('image/webp');
  });

  it('emits PNG (not JPEG) fallback for sources flagged hasAlpha in the manifest', () => {
    renderInProvider(
      <Image
        src="/assets/images/__test__/alpha.png"
        alt="alpha"
        width={1000}
        height={1000}
        sizes="100vw"
        __forceProd
      />
    );
    const img = screen.getByAltText('alpha');
    expect(img.getAttribute('src')).toMatch(/\.png$/);
  });

  it('falls back to plain <img> for proxyable but uncached URLs (no manifest entry)', () => {
    renderInProvider(
      <Image
        src="https://firebasestorage.googleapis.com/some/path.jpg"
        alt="cms"
        width={800}
        height={600}
        sizes="100vw"
        __forceProd
      />
    );
    const img = screen.getByAltText('cms');
    expect(img.tagName).toBe('IMG');
    expect(img.closest('picture')).toBeNull();
  });

  it('falls back to plain <img> for external URLs', () => {
    renderInProvider(
      <Image
        src="https://example.com/some.jpg"
        alt="external"
        width={800}
        height={600}
        sizes="100vw"
        __forceProd
      />
    );
    const img = screen.getByAltText('external');
    expect(img.tagName).toBe('IMG');
    expect(img.getAttribute('src')).toBe('https://example.com/some.jpg');
  });

  it('preserves width, height, alt, and className', () => {
    renderInProvider(
      <Image
        src="/assets/images/__test__/opaque.jpg"
        alt="opaque"
        width={2400}
        height={1600}
        sizes="100vw"
        className="hero"
        __forceProd
      />
    );
    const img = screen.getByAltText('opaque');
    expect(img.getAttribute('width')).toBe('2400');
    expect(img.getAttribute('height')).toBe('1600');
    expect(img.classList.contains('hero')).toBe(true);
  });
});
```

- [ ] **Step 2:** Run — expect failure (no Image.jsx yet)

```bash
npx vitest run src/components/Image.test.jsx
```

- [ ] **Step 3:** Implement

```jsx
// src/components/Image.jsx
import { buildSrcSet, isLocalPath, isProxyableUrl, variantUrl } from '../lib/imageVariantUrl';
import { getManifestEntry } from '../lib/optimisedManifest';

const DEV_MODE = import.meta.env.DEV;

function isDevMode(props) {
  // __forceProd / __forceDev test hooks let unit tests pin behaviour independent of vitest env
  if (props.__forceProd) return false;
  if (props.__forceDev) return true;
  return DEV_MODE;
}

export default function Image(props) {
  const {
    src,
    alt,
    width,
    height,
    sizes = '(max-width: 768px) 100vw, 1200px',
    priority = false,
    className,
    loading,
    ...rest
  } = props;

  // Pop the test-only overrides so we don't pass them to the DOM
  delete rest.__forceProd;
  delete rest.__forceDev;

  // Dev mode: render plain <img>. Variants don't exist until npm run build.
  if (isDevMode(props)) {
    return (
      <img
        src={src}
        alt={alt}
        width={width}
        height={height}
        loading={loading ?? (priority ? 'eager' : 'lazy')}
        className={className}
        {...rest}
      />
    );
  }

  // Local source with manifest entry → emit <picture> with full srcset
  if (isLocalPath(src)) {
    const entry = getManifestEntry(src);
    if (entry && !entry.skipped) {
      const widths = entry.variantWidths;
      const formats = entry.variantFormats; // typically ['avif', 'webp', 'jpeg' OR 'png']
      const fallbackFormat = formats[formats.length - 1]; // jpeg or png
      const fallbackWidth = widths.includes(1200) ? 1200 : widths[Math.floor(widths.length / 2)];

      const lqipBgStyle = entry.lqip
        ? { backgroundImage: `url("${entry.lqip}")`, backgroundSize: 'cover', backgroundPosition: 'center' }
        : undefined;

      return (
        <picture>
          {formats.map((fmt) => (
            <source
              key={fmt}
              type={`image/${fmt === 'jpeg' ? 'jpeg' : fmt}`}
              srcSet={buildSrcSet(src, fmt, widths)}
              sizes={sizes}
            />
          ))}
          <img
            src={variantUrl(src, fallbackWidth, fallbackFormat)}
            srcSet={buildSrcSet(src, fallbackFormat, widths)}
            sizes={sizes}
            width={width}
            height={height}
            alt={alt}
            loading={loading ?? (priority ? 'eager' : 'lazy')}
            decoding={priority ? undefined : 'async'}
            fetchpriority={priority ? 'high' : undefined}
            className={className}
            style={lqipBgStyle}
            {...rest}
          />
        </picture>
      );
    }
    // Local source NOT in manifest (e.g. skipped-by-size, or unknown path): render plain <img>
    return (
      <img src={src} alt={alt} width={width} height={height}
        loading={loading ?? (priority ? 'eager' : 'lazy')}
        className={className} {...rest} />
    );
  }

  // Proxyable URLs (Firebase Storage / hqaviation.com) — D3 will swap this for
  // /api/image?src=... markup once the runtime endpoint ships. Until then, plain <img>.
  if (isProxyableUrl(src)) {
    return (
      <img src={src} alt={alt} width={width} height={height}
        loading={loading ?? (priority ? 'eager' : 'lazy')}
        className={className} {...rest} />
    );
  }

  // External URLs — no optimisation possible, plain <img>
  return (
    <img src={src} alt={alt} width={width} height={height}
      loading={loading ?? (priority ? 'eager' : 'lazy')}
      className={className} {...rest} />
  );
}
```

- [ ] **Step 4:** Run — expect pass

```bash
npx vitest run src/components/Image.test.jsx
```

- [ ] **Step 5:** Commit

```bash
git add src/components/Image.jsx src/components/Image.test.jsx
git commit -m "feat(images): <Image> component — production <picture> + dev <img> fallback"
```

---

## Task 6: `<Image priority>` — LCP preload via react-helmet-async

**Files:**
- Modify: `src/components/Image.jsx`
- Modify: `src/components/Image.test.jsx`

- [ ] **Step 1:** Append failing tests

```jsx
describe('<Image priority>', () => {
  beforeEach(() => {
    // Reset head preload links between tests (safe DOM method, not innerHTML)
    document.head.querySelectorAll('link[rel="preload"][as="image"]').forEach((el) => el.remove());
  });

  it('emits a <link rel="preload"> in <head> when priority is true', async () => {
    renderInProvider(
      <Image
        src="/assets/images/__test__/opaque.jpg"
        alt="hero"
        width={2400}
        height={1600}
        sizes="100vw"
        priority
        __forceProd
      />
    );
    await new Promise(r => setTimeout(r, 50)); // helmet writes async
    const link = document.head.querySelector('link[rel="preload"][as="image"]');
    expect(link).toBeTruthy();
    expect(link.getAttribute('imagesrcset')).toContain('-400.avif');
    expect(link.getAttribute('imagesrcset')).toContain('-2400.avif');
    expect(link.getAttribute('imagesizes')).toBe('100vw');
    expect(link.getAttribute('type')).toBe('image/avif');
  });

  it('does NOT emit a preload link when priority is false', async () => {
    renderInProvider(
      <Image src="/assets/images/__test__/opaque.jpg" alt="below"
        width={400} height={300} sizes="100vw" __forceProd />
    );
    await new Promise(r => setTimeout(r, 50));
    const link = document.head.querySelector('link[rel="preload"][as="image"]');
    expect(link).toBeNull();
  });
});
```

- [ ] **Step 2:** Run — expect failure

- [ ] **Step 3:** Add Helmet preload to the component

At the top of `Image.jsx`:

```jsx
import { Helmet } from 'react-helmet-async';
```

In the local-path-with-manifest branch (before the `return <picture>...`), build the preload markup. Refactor the return like so:

```jsx
const avifSrcSet = buildSrcSet(src, 'avif', widths);

return (
  <>
    {priority && (
      <Helmet>
        <link
          rel="preload"
          as="image"
          imageSrcSet={avifSrcSet}
          imageSizes={sizes}
          type="image/avif"
        />
      </Helmet>
    )}
    <picture>
      {/* existing <source> + <img> markup */}
    </picture>
  </>
);
```

(react-helmet-async expects camelCase prop names like `imageSrcSet`; it renders them as the DOM attributes `imagesrcset` and `imagesizes`.)

- [ ] **Step 4:** Run — expect pass

- [ ] **Step 5:** Commit

```bash
git add src/components/Image.jsx src/components/Image.test.jsx
git commit -m "feat(images): priority={true} emits <link rel=preload> via react-helmet-async"
```

---

## Task 7: Wire `<Image>` on Home.jsx hero

**Files:**
- Modify: `src/pages/Home.jsx`

- [ ] **Step 1:** Identify the hero image

```bash
grep -n "<img" src/pages/Home.jsx | head -10
```

Pick the first/largest image visible above the fold — typically the homepage hero.

- [ ] **Step 2:** Replace it with `<Image>`

Add the import at the top of `Home.jsx`:

```jsx
import Image from '../components/Image';
```

Replace the hero `<img>` with `<Image>`, setting `priority` (because it's the LCP candidate on the homepage) and an appropriate `sizes` value. Example:

```jsx
// Before
<img
  src="/assets/images/r66/hero.jpg"
  alt="..."
  width={2400}
  height={1600}
  className="hero"
/>

// After
<Image
  src="/assets/images/r66/hero.jpg"
  alt="..."
  width={2400}
  height={1600}
  sizes="100vw"
  priority
  className="hero"
/>
```

Keep `<img>` tags below the fold for now — only the LCP-candidate hero in this commit.

- [ ] **Step 3:** Build + smoke

```bash
npm run build 2>&1 | tail -5
```

Expected: build succeeds. Manually load the production build (or PSI) and inspect the homepage HTML — the hero should now be wrapped in `<picture>`.

- [ ] **Step 4:** Commit

```bash
git add src/pages/Home.jsx
git commit -m "feat(images): wire <Image priority> on Home hero"
```

---

## Task 8: Wire `<Image>` on Aircraft R22/R44/R66/R88 heroes

**Files:**
- Modify: `src/pages/AircraftR22.jsx`
- Modify: `src/pages/AircraftR44.jsx`
- Modify: `src/pages/AircraftR66.jsx`
- Modify: `src/pages/AircraftR88.jsx`

For each of the 4 files, perform the same hero replacement as Task 7:

- [ ] **Step 1:** Add `import Image from '../components/Image';` at top
- [ ] **Step 2:** Replace the hero `<img>` with `<Image priority sizes="100vw" ...>`
- [ ] **Step 3:** Build to verify no breakage
- [ ] **Step 4:** Commit ALL FOUR in one commit (they're a unit):

```bash
git add src/pages/AircraftR22.jsx src/pages/AircraftR44.jsx src/pages/AircraftR66.jsx src/pages/AircraftR88.jsx
git commit -m "feat(images): wire <Image priority> on R22/R44/R66/R88 hero images"
```

---

## Task 9: Wire `<Image>` on FinalMaintenance / FinalExpeditions / FinalPPL heroes

**Files:**
- Modify: `src/pages/FinalMaintenance.jsx`
- Modify: `src/pages/FinalExpeditions.jsx`
- Modify: `src/pages/FinalPPL.jsx`

Same pattern as Task 8. Add import, replace hero, build, commit.

- [ ] **Step 1:** Replace heroes in all 3 files

- [ ] **Step 2:** Build to verify

- [ ] **Step 3:** Commit

```bash
git add src/pages/FinalMaintenance.jsx src/pages/FinalExpeditions.jsx src/pages/FinalPPL.jsx
git commit -m "feat(images): wire <Image priority> on FinalMaintenance/FinalExpeditions/FinalPPL heroes"
```

---

## Task 10: Wire `<Image>` on blog post pages (cover images)

**Files:**
- Modify: `src/pages/blog/*.jsx` (13 files)

Each blog post has a cover image near the top. Replace those with `<Image priority>` (cover image is the LCP candidate on each blog post page).

- [ ] **Step 1:** List the blog post files

```bash
ls src/pages/blog/*.jsx
```

Expected: 13 files (Autorotations, ConfinedAreas, CrossChannel, FlyToLunch, FuelManagement, LTEAwareness, LondonHeliLanes, MasteringTheHover, PreFlightWalkaround, R22FirstSolo, R44BuyersGuide, SuperyachtOperations, WhyWeFly).

- [ ] **Step 2:** Per file, replace the cover `<img>` with `<Image priority sizes="(max-width: 768px) 100vw, 60vw">`. Keep below-fold content imgs as-is.

If your blog posts use a shared layout component for the cover (`<BlogCover>` or similar): replace the `<img>` in the SHARED component instead. Saves repetitive edits.

- [ ] **Step 3:** Build to verify

```bash
npm run build 2>&1 | tail -5
```

- [ ] **Step 4:** Commit

```bash
git add src/pages/blog/
git commit -m "feat(images): wire <Image priority> on blog post cover images (13 files)"
```

---

## Task 11: Wire `<Image>` on Sales.jsx hero

**Files:**
- Modify: `src/pages/Sales.jsx`

- [ ] **Step 1:** Find + replace hero `<img>` with `<Image priority sizes="100vw">`

- [ ] **Step 2:** Build + commit

```bash
git add src/pages/Sales.jsx
git commit -m "feat(images): wire <Image priority> on Sales hero"
```

---

## Task 12: Full smoke test + PR

**Files:**
- No file changes for smoke test
- Push branch + open PR

- [ ] **Step 1:** Full test suite

```bash
npm test 2>&1 | tail -10
```

Expected: PASS — pre-existing failures only (Firebase env-key in ExpeditionBarcode.test, react-simple-maps in GeographyMap.test). All new Image-related tests green.

- [ ] **Step 2:** Production build

```bash
npm run build 2>&1 | tail -10
```

Expected: prebuild runs (cached), vite build succeeds.

- [ ] **Step 3:** Inspect built output for a sample page

```bash
grep -A 5 '<picture>' dist/index.html 2>&1 | head -20
```

Expected: the homepage HTML contains `<picture>` markup with multiple `<source>` tags for the hero image.

- [ ] **Step 4:** Push and open PR

```bash
git push -u origin feat/image-pipeline-d2 2>&1 | tail -3

gh pr create --base main --head feat/image-pipeline-d2 --title "Image optimisation Phase D2 — <Image> component + canonical-page rollout" --body "$(cat <<'EOF'
## Summary

Phase D2 of the image-optimisation work. Builds the `<Image>` React component that consumes D1's optimised variants via `<picture>` markup with format negotiation (AVIF → WebP → JPEG/PNG fallback), responsive `srcset`, and LQIP blur-up placeholders. Wires it onto the highest-traffic canonical pages at hero / LCP positions, with `<link rel="preload">` for priority images.

Below-fold imgs stay as `<img>` for now (they already have width/height from PR #3) — a future PR can sweep the rest if measurement justifies the effort.

## What's in

- **`src/lib/imageVariantUrl.js`** + tests — pure helpers: `variantUrl`, `isLocalPath`, `isProxyableUrl`, `buildSrcSet`
- **`src/lib/optimisedManifest.js`** — Vite ESM JSON import of D1's manifest with `getManifestEntry` lookup
- **`src/components/Image.jsx`** + tests — three rendering modes: production (`<picture>` + srcset + LQIP), dev (plain `<img>`), passthrough (proxyable / external)
- **LCP preload via react-helmet-async** — `priority={true}` emits `<link rel="preload" as="image" type="image/avif" imagesrcset="...">`
- **Wiring across canonical pages** — Home, AircraftR22/R44/R66/R88, FinalMaintenance, FinalExpeditions, FinalPPL, 13 blog posts, Sales

## Lighthouse baseline + expected impact

Baseline captured in `docs/seo/lighthouse-baseline-2026-05-11.md` BEFORE rollout. D4 measures the same URLs after this PR lands.

Expected (per spec success criteria):
- LCP improvement ≥ 30% on hero-driven pages
- Performance score improvement ≥ 15 points on at least 3 of 5 baseline pages
- "Properly size images" + "Serve images in next-gen formats" Lighthouse warnings disappear on rolled-out pages

## Out of scope (Phase D3 + D4)

- Runtime endpoint for CMS-uploaded images (Layer 2 from spec)
- Sweep of below-fold and gallery imgs
- Post-rollout Lighthouse measurement + comparison vs baseline (D4)

## Test plan

- [ ] Open `https://hq-website-4abc7.web.app/` after deploy; inspect Network tab — hero image should be AVIF on modern browsers, ~30 KB instead of ~600 KB
- [ ] PageSpeed Insights re-run on the 5 baseline URLs from `lighthouse-baseline-2026-05-11.md`; record post-rollout numbers
- [ ] Verify in Chrome DevTools that `<link rel="preload">` is in `<head>` of pages with priority images
- [ ] Open `/aircraft/r66` on mobile (real device or DevTools throttling) — LQIP placeholder visible immediately, real image swaps in cleanly with no layout shift
- [ ] Test in Safari (older WebKit fallback path) — should serve WebP or JPEG variants

🤖 Generated with [Claude Code](https://claude.com/claude-code)
EOF
)" 2>&1 | tail -3
```

- [ ] **Step 5:** Note the PR URL.

---

## Self-Review

**Spec coverage (Phase D2 from `2026-05-09-image-optimisation-design.md`):**
- `<Image>` component with three modes → Task 5, 6 ✓
- `priority={true}` semantics → Task 6 ✓
- LQIP background via CSS → Task 5 ✓
- LCP preload via react-helmet-async → Task 6 ✓
- Source detection (local / proxyable / external) → Task 3 ✓
- Variant URL pattern → Task 3 ✓
- Canonical-page rollout (Home, aircraft, training, expeditions, maintenance, blog, sales) → Tasks 7–11 ✓
- Lighthouse baseline measurement before rollout → Task 2 (mandatory) ✓

**Placeholder scan:** none. Every test has full assertions, every implementation has full code.

**Type / API consistency:** `variantUrl(srcPath, width, format)` matches between definition (Task 3) and call sites (Task 5). `getManifestEntry(srcPath)` shape matches between definition (Task 4) and consumer (Task 5). `buildSrcSet(srcPath, format, widths)` consistent.

**Scope check:** one PR. 12 tasks. Foundations (1, 2) → pure helpers (3, 4) → component (5, 6) → page rollout (7–11) → smoke + PR (12). Each independently sequenceable; later tasks depend on earlier ones via direct imports.

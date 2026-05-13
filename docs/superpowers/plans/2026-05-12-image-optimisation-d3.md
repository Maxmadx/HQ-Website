# Image Optimisation — Phase D3 (Runtime Endpoint for CMS Images) Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add a `/api/image?src=<encoded>&w=<width>&fmt=<format>` Express endpoint that fetches CMS-uploaded images (Firebase Storage URLs, hqaviation.com URLs) and serves AVIF/WebP/JPEG variants on demand via `sharp`. Wire the existing `<Image>` component (PR #7) to emit `<picture>` markup pointing at this endpoint for proxyable sources, so admin-uploaded images get the same treatment as D1's build-time-optimised static images.

**Architecture:** Five small CJS modules under `api/` — an in-memory LRU cache (Cloud Run has no persistent disk, so memory only), source URL validation against a hard-coded allowlist (no SSRF), source fetching with byte/timeout caps, a sharp-driven transform pipeline, and the Express handler that composes them. Rate-limited via the existing `express-rate-limit` middleware. The component-side change extends `<Image>`'s proxyable-URL branch from "render plain `<img>`" to "render `<picture>` with srcset pointing at `/api/image?...`".

**Tech Stack:** Express 4 (CJS), `sharp` (promoted from devDep to runtime), `express-rate-limit` (already in deps), Node 20's built-in `fetch`, vitest 4 + supertest (existing test pattern from `api/seoMetaInjection.test.js`).

**Reference files:**
- Spec: `docs/superpowers/specs/2026-05-09-image-optimisation-design.md` (Layer 2 section)
- Existing api-side pattern: `api/seoMetaInjection.js`, `api/seoMetaCache.js`
- Existing rate-limit usage: search for `express-rate-limit` in `api/`
- `<Image>` component to extend: `src/components/Image.jsx` (PR #7)
- Allowlist source-of-truth: `src/lib/imageVariantUrl.js#ALLOWED_PROXY_HOSTS` (mirror this — api/ is CJS)
- Cloud Run deploy: `package.json` script `deploy:server` (rebuild + push + deploy after PR merges)

**Commit discipline:** one commit per task. Prefix `feat(images):` for new behaviour, `chore(images):` for infra, `test(images):` for test-only. **One commit per task — do not batch.**

**Pre-flight gate:**
- PR #7 (D2) merged or about-to-be-merged. The component changes in Task 9 require D2's component to exist.
- Sharp working on the host (confirmed in D0/D1).
- Cloud Run service `hq-aviation-server` running (confirmed by uptimerobot keep-warm).

**User-input gates:**
- After merge — user (or agent in a future session) runs `npm run deploy:server` from main to push the new container revision to Cloud Run. The endpoint isn't live until that happens.

---

## File Structure

### New files (all CJS under `api/`)

| Path | Responsibility |
|---|---|
| `api/imageCache.js` | In-memory LRU Map with byte-size cap (100 MB default) and per-entry TTL (1 hour). Exports `get(key)`, `set(key, value, bytes)`, `flush()`, `stats()`. |
| `api/imageValidation.js` | Pure: `validateSrc(src)`, `validateWidth(w)`, `validateFormat(fmt)`. Allowlist hard-coded, width set fixed `[400, 800, 1200, 1600, 2400]`, format set `['avif', 'webp', 'jpeg', 'png']`. |
| `api/imageFetch.js` | Fetch source URL via Node `fetch`, with 10s timeout + 5 MB max response. Returns `{ buffer, contentType }`. |
| `api/imageTransform.js` | Sharp wrapper: `transform({ buffer, width, format })` → returns `{ buffer, contentType }`. Handles alpha-aware fallback if requested format is JPEG but source has alpha. |
| `api/image.js` | Express handler. Composes the four modules. Mounted as `app.get('/api/image', ...)` in server.js. |
| `api/imageCache.test.js`, `api/imageValidation.test.js`, `api/imageFetch.test.js`, `api/imageTransform.test.js`, `api/image.test.js` | One test file per module. |

### Modified files

| Path | Why |
|---|---|
| `package.json` | Promote `sharp` from `devDependencies` to `dependencies` so it ships in the Cloud Run container at runtime. |
| `server.js` | Add a single line wiring the new handler with rate limiting. |
| `src/components/Image.jsx` | Extend the proxyable-URL branch to emit `<picture>` with srcset pointing at `/api/image?src=...`. |
| `src/components/Image.test.jsx` | Add tests for the new proxyable-URL behaviour. |

---

## Task 1: Set up D3 worktree

**Files:**
- No code changes

- [ ] **Step 1:** Confirm PR #7 merged

```bash
cd /Users/maximussmith/Downloads/HQ-Website-main
git fetch origin
git log origin/main --oneline | grep -m1 "D2 — <Image> component" && echo "PR #7 merged" || echo "PR #7 NOT merged"
```

If `PR #7 NOT merged`: either merge it first OR branch off `feat/image-pipeline-d2` directly so D3 builds on top of D2. **For this plan: assume PR #7 is merged to main.**

- [ ] **Step 2:** Sync main and create worktree

```bash
git switch main
git pull origin main
git worktree add ../HQ-Website-main-img-d3 -b feat/image-pipeline-d3
cd ../HQ-Website-main-img-d3
```

- [ ] **Step 3:** Install deps + run baseline tests

```bash
npm install --legacy-peer-deps 2>&1 | tail -3
npm test -- api/seoMetaInjection.test.js 2>&1 | tail -5  # sanity-check supertest is installed
```

Expected: install completes; seoMetaInjection tests pass.

If `supertest` is missing (added in PR #2): re-install:

```bash
npm install --legacy-peer-deps --save-dev supertest
```

(No commit — setup only.)

---

## Task 2: Promote `sharp` to runtime dependency

**Files:**
- Modify: `package.json`

After PR #6 (D1), `sharp` is in `devDependencies` because the build-time pipeline runs at build, not runtime. D3 calls sharp at request-time inside the Cloud Run container, so it must be a runtime dependency.

- [ ] **Step 1:** Check current placement

```bash
node -e "const p=require('./package.json'); console.log('dependencies has sharp:', !!p.dependencies?.sharp, '| devDependencies has sharp:', !!p.devDependencies?.sharp);"
```

Expected: `dependencies has sharp: false | devDependencies has sharp: true`.

- [ ] **Step 2:** Move sharp from devDependencies to dependencies

Edit `package.json` directly (move the `"sharp": "..."` line from the `devDependencies` block to the `dependencies` block — preserve the version specifier exactly).

Or use a Node script:

```bash
node -e "
const fs = require('fs');
const pkg = JSON.parse(fs.readFileSync('package.json', 'utf8'));
const ver = pkg.devDependencies.sharp;
if (!ver) { console.error('sharp not in devDependencies'); process.exit(1); }
delete pkg.devDependencies.sharp;
pkg.dependencies.sharp = ver;
// Sort dependencies keys for tidiness
pkg.dependencies = Object.fromEntries(Object.entries(pkg.dependencies).sort());
pkg.devDependencies = Object.fromEntries(Object.entries(pkg.devDependencies).sort());
fs.writeFileSync('package.json', JSON.stringify(pkg, null, 2) + '\n');
console.log('Moved sharp to dependencies');
"
```

- [ ] **Step 3:** Verify

```bash
node -e "const p=require('./package.json'); console.log('dependencies has sharp:', !!p.dependencies?.sharp, '| devDependencies has sharp:', !!p.devDependencies?.sharp);"
```

Expected: `dependencies has sharp: true | devDependencies has sharp: false`.

- [ ] **Step 4:** Reinstall to ensure node_modules is consistent

```bash
npm install --legacy-peer-deps 2>&1 | tail -3
```

- [ ] **Step 5:** Commit

```bash
git add package.json
git commit -m "chore(images): promote sharp from devDependencies to dependencies (D3 runtime)"
```

---

## Task 3: `api/imageCache.js` — in-memory LRU with byte-size cap + TTL

**Files:**
- Create: `api/imageCache.js`
- Create: `api/imageCache.test.js`

- [ ] **Step 1:** Write failing tests

```js
// api/imageCache.test.js
const { describe, it, expect, beforeEach, vi } = require('vitest');
const { createCache } = require('./imageCache');

describe('imageCache', () => {
  it('returns null for missing keys', () => {
    const cache = createCache({ maxBytes: 1024, ttlMs: 1000 });
    expect(cache.get('missing')).toBeNull();
  });

  it('stores and retrieves an entry', () => {
    const cache = createCache({ maxBytes: 1024, ttlMs: 1000 });
    cache.set('a', { foo: 'bar' }, 100);
    expect(cache.get('a')).toEqual({ foo: 'bar' });
  });

  it('expires entries past TTL', () => {
    vi.useFakeTimers();
    const cache = createCache({ maxBytes: 1024, ttlMs: 1000 });
    cache.set('a', { foo: 'bar' }, 100);
    expect(cache.get('a')).toEqual({ foo: 'bar' });
    vi.advanceTimersByTime(1001);
    expect(cache.get('a')).toBeNull();
    vi.useRealTimers();
  });

  it('evicts oldest entries when byte limit exceeded', () => {
    const cache = createCache({ maxBytes: 300, ttlMs: 60000 });
    cache.set('a', 'A', 100);
    cache.set('b', 'B', 100);
    cache.set('c', 'C', 100);
    expect(cache.get('a')).toBe('A'); // not yet evicted
    cache.set('d', 'D', 100); // now at 400 > 300
    expect(cache.get('a')).toBeNull(); // 'a' evicted (oldest insertion)
    expect(cache.get('d')).toBe('D'); // 'd' still there
  });

  it('reports stats', () => {
    const cache = createCache({ maxBytes: 1024, ttlMs: 1000 });
    cache.set('a', 'A', 100);
    cache.set('b', 'B', 200);
    const s = cache.stats();
    expect(s.entries).toBe(2);
    expect(s.bytes).toBe(300);
  });

  it('flush() empties the cache', () => {
    const cache = createCache({ maxBytes: 1024, ttlMs: 1000 });
    cache.set('a', 'A', 100);
    cache.flush();
    expect(cache.get('a')).toBeNull();
    expect(cache.stats().entries).toBe(0);
  });

  it('updating an existing key replaces the entry and adjusts bytes', () => {
    const cache = createCache({ maxBytes: 1024, ttlMs: 1000 });
    cache.set('a', 'first', 100);
    cache.set('a', 'second', 200);
    expect(cache.get('a')).toBe('second');
    expect(cache.stats().bytes).toBe(200);
  });
});
```

- [ ] **Step 2:** Run — expect failure

```bash
npx vitest run api/imageCache.test.js
```

Expected: FAIL with "Cannot find module './imageCache'".

- [ ] **Step 3:** Implement

```js
// api/imageCache.js
'use strict';

/**
 * createCache({ maxBytes, ttlMs }) → { get, set, flush, stats }
 *
 * In-memory LRU cache for image variants. Cloud Run has no persistent
 * disk, so this is the only cache layer. Each entry tracks its own byte
 * count for accurate eviction. TTL ensures stale variants get re-fetched
 * eventually even if the cache is hot.
 *
 * Map iteration order is insertion order in JavaScript; LRU eviction
 * deletes from the head of the map.
 */
function createCache({ maxBytes, ttlMs }) {
  const store = new Map();
  let totalBytes = 0;

  function evictExpired() {
    const now = Date.now();
    for (const [k, entry] of store) {
      if (now >= entry.expiresAt) {
        store.delete(k);
        totalBytes -= entry.bytes;
      } else {
        break; // entries are inserted in order — if this one isn't expired, later ones aren't either
      }
    }
  }

  function evictToFit(neededBytes) {
    while (totalBytes + neededBytes > maxBytes && store.size > 0) {
      const oldestKey = store.keys().next().value;
      const oldest = store.get(oldestKey);
      store.delete(oldestKey);
      totalBytes -= oldest.bytes;
    }
  }

  return {
    get(key) {
      evictExpired();
      const entry = store.get(key);
      if (!entry) return null;
      if (Date.now() >= entry.expiresAt) {
        store.delete(key);
        totalBytes -= entry.bytes;
        return null;
      }
      return entry.value;
    },

    set(key, value, bytes) {
      if (store.has(key)) {
        totalBytes -= store.get(key).bytes;
        store.delete(key);
      }
      evictToFit(bytes);
      store.set(key, { value, bytes, expiresAt: Date.now() + ttlMs });
      totalBytes += bytes;
    },

    flush() {
      store.clear();
      totalBytes = 0;
    },

    stats() {
      return { entries: store.size, bytes: totalBytes };
    },
  };
}

module.exports = { createCache };
```

- [ ] **Step 4:** Run — expect pass

```bash
npx vitest run api/imageCache.test.js
```

Expected: PASS, 7/7 tests green.

- [ ] **Step 5:** Commit

```bash
git add api/imageCache.js api/imageCache.test.js
git commit -m "feat(images): imageCache — in-memory LRU with byte-size cap + TTL for D3 runtime"
```

---

## Task 4: `api/imageValidation.js` — query param validation

**Files:**
- Create: `api/imageValidation.js`
- Create: `api/imageValidation.test.js`

- [ ] **Step 1:** Write failing tests

```js
// api/imageValidation.test.js
const { describe, it, expect } = require('vitest');
const {
  validateSrc,
  validateWidth,
  validateFormat,
  ALLOWED_PROXY_HOSTS,
  ALLOWED_WIDTHS,
  ALLOWED_FORMATS,
} = require('./imageValidation');

describe('validateSrc', () => {
  it('accepts Firebase Storage URLs', () => {
    const r = validateSrc('https://firebasestorage.googleapis.com/v0/b/x/o/y');
    expect(r.ok).toBe(true);
    expect(r.url).toBe('https://firebasestorage.googleapis.com/v0/b/x/o/y');
  });
  it('accepts storage.googleapis.com', () => {
    expect(validateSrc('https://storage.googleapis.com/x').ok).toBe(true);
  });
  it('accepts hqaviation.com + www', () => {
    expect(validateSrc('https://hqaviation.com/img.jpg').ok).toBe(true);
    expect(validateSrc('https://www.hqaviation.com/img.jpg').ok).toBe(true);
  });
  it('rejects other origins', () => {
    expect(validateSrc('https://example.com/img.jpg').ok).toBe(false);
  });
  it('rejects http (must be https)', () => {
    expect(validateSrc('http://firebasestorage.googleapis.com/x').ok).toBe(false);
  });
  it('rejects non-URL inputs', () => {
    expect(validateSrc(null).ok).toBe(false);
    expect(validateSrc('').ok).toBe(false);
    expect(validateSrc('not a url').ok).toBe(false);
    expect(validateSrc(123).ok).toBe(false);
  });
});

describe('validateWidth', () => {
  it('accepts allowed widths as strings or numbers', () => {
    for (const w of [400, 800, 1200, 1600, 2400]) {
      expect(validateWidth(w).ok).toBe(true);
      expect(validateWidth(String(w)).ok).toBe(true);
    }
  });
  it('returns the parsed integer', () => {
    expect(validateWidth('800').value).toBe(800);
  });
  it('rejects out-of-set widths', () => {
    expect(validateWidth(100).ok).toBe(false);
    expect(validateWidth(401).ok).toBe(false);
    expect(validateWidth(99999).ok).toBe(false);
  });
  it('rejects garbage', () => {
    expect(validateWidth('abc').ok).toBe(false);
    expect(validateWidth(null).ok).toBe(false);
    expect(validateWidth('').ok).toBe(false);
  });
});

describe('validateFormat', () => {
  it('accepts allowed formats', () => {
    for (const f of ['avif', 'webp', 'jpeg', 'png']) {
      expect(validateFormat(f).ok).toBe(true);
      expect(validateFormat(f).value).toBe(f);
    }
  });
  it('normalises jpg to jpeg', () => {
    expect(validateFormat('jpg').ok).toBe(true);
    expect(validateFormat('jpg').value).toBe('jpeg');
  });
  it('is case-insensitive', () => {
    expect(validateFormat('AVIF').ok).toBe(true);
    expect(validateFormat('AVIF').value).toBe('avif');
  });
  it('rejects others', () => {
    expect(validateFormat('gif').ok).toBe(false);
    expect(validateFormat('bmp').ok).toBe(false);
    expect(validateFormat(null).ok).toBe(false);
  });
});

describe('constants exported for reference', () => {
  it('exports allowlists', () => {
    expect(Array.isArray(ALLOWED_PROXY_HOSTS) || ALLOWED_PROXY_HOSTS instanceof Set).toBeTruthy();
    expect(Array.isArray(ALLOWED_WIDTHS) || ALLOWED_WIDTHS instanceof Set).toBeTruthy();
    expect(Array.isArray(ALLOWED_FORMATS) || ALLOWED_FORMATS instanceof Set).toBeTruthy();
  });
});
```

- [ ] **Step 2:** Run — expect failure

- [ ] **Step 3:** Implement

```js
// api/imageValidation.js
'use strict';

const ALLOWED_PROXY_HOSTS = new Set([
  'firebasestorage.googleapis.com',
  'storage.googleapis.com',
  'hqaviation.com',
  'www.hqaviation.com',
]);

const ALLOWED_WIDTHS = new Set([400, 800, 1200, 1600, 2400]);
const ALLOWED_FORMATS = new Set(['avif', 'webp', 'jpeg', 'png']);

function validateSrc(src) {
  if (typeof src !== 'string' || !src) return { ok: false, error: 'src must be a string' };
  let url;
  try {
    url = new URL(src);
  } catch {
    return { ok: false, error: 'src must be a valid URL' };
  }
  if (url.protocol !== 'https:') return { ok: false, error: 'src must use https' };
  if (!ALLOWED_PROXY_HOSTS.has(url.host)) return { ok: false, error: `src host not allowed: ${url.host}` };
  return { ok: true, url: url.toString() };
}

function validateWidth(w) {
  const n = typeof w === 'number' ? w : Number(w);
  if (!Number.isInteger(n)) return { ok: false, error: 'width must be an integer' };
  if (!ALLOWED_WIDTHS.has(n)) return { ok: false, error: `width must be one of ${[...ALLOWED_WIDTHS].join(', ')}` };
  return { ok: true, value: n };
}

function validateFormat(fmt) {
  if (typeof fmt !== 'string') return { ok: false, error: 'format must be a string' };
  const lower = fmt.toLowerCase();
  const normalized = lower === 'jpg' ? 'jpeg' : lower;
  if (!ALLOWED_FORMATS.has(normalized)) return { ok: false, error: `format must be one of ${[...ALLOWED_FORMATS].join(', ')}` };
  return { ok: true, value: normalized };
}

module.exports = {
  validateSrc,
  validateWidth,
  validateFormat,
  ALLOWED_PROXY_HOSTS,
  ALLOWED_WIDTHS,
  ALLOWED_FORMATS,
};
```

- [ ] **Step 4:** Run — expect pass

- [ ] **Step 5:** Commit

```bash
git add api/imageValidation.js api/imageValidation.test.js
git commit -m "feat(images): imageValidation — src allowlist + width set + format normalisation"
```

---

## Task 5: `api/imageFetch.js` — source fetch with caps

**Files:**
- Create: `api/imageFetch.js`
- Create: `api/imageFetch.test.js`

- [ ] **Step 1:** Write failing tests

```js
// api/imageFetch.test.js
const { describe, it, expect, vi, beforeEach, afterEach } = require('vitest');
const { fetchSource, MAX_BYTES, TIMEOUT_MS } = require('./imageFetch');

describe('fetchSource', () => {
  let originalFetch;
  beforeEach(() => { originalFetch = globalThis.fetch; });
  afterEach(() => { globalThis.fetch = originalFetch; });

  it('returns buffer + content-type on success', async () => {
    const payload = new Uint8Array([1, 2, 3, 4]);
    globalThis.fetch = vi.fn().mockResolvedValue({
      ok: true,
      headers: new Map([['content-type', 'image/jpeg']]),
      arrayBuffer: () => Promise.resolve(payload.buffer),
    });
    const r = await fetchSource('https://example.com/x.jpg');
    expect(r.contentType).toBe('image/jpeg');
    expect(Buffer.isBuffer(r.buffer) || r.buffer instanceof Uint8Array).toBe(true);
    expect(r.buffer.length).toBe(4);
  });

  it('throws if response is not ok', async () => {
    globalThis.fetch = vi.fn().mockResolvedValue({ ok: false, status: 404 });
    await expect(fetchSource('https://example.com/missing.jpg')).rejects.toThrow(/404/);
  });

  it('throws if content-length exceeds MAX_BYTES', async () => {
    globalThis.fetch = vi.fn().mockResolvedValue({
      ok: true,
      headers: new Map([
        ['content-type', 'image/jpeg'],
        ['content-length', String(MAX_BYTES + 1)],
      ]),
      arrayBuffer: () => Promise.resolve(new ArrayBuffer(8)),
    });
    await expect(fetchSource('https://example.com/big.jpg')).rejects.toThrow(/too large/);
  });

  it('throws if buffer exceeds MAX_BYTES even when content-length missing', async () => {
    globalThis.fetch = vi.fn().mockResolvedValue({
      ok: true,
      headers: new Map([['content-type', 'image/jpeg']]),
      arrayBuffer: () => Promise.resolve(new ArrayBuffer(MAX_BYTES + 100)),
    });
    await expect(fetchSource('https://example.com/big.jpg')).rejects.toThrow(/too large/);
  });
});
```

- [ ] **Step 2:** Run — expect failure

- [ ] **Step 3:** Implement

```js
// api/imageFetch.js
'use strict';

const MAX_BYTES = 5 * 1024 * 1024; // 5 MB
const TIMEOUT_MS = 10_000; // 10 seconds

/**
 * Fetch an image from a remote URL with size + timeout caps.
 * Returns { buffer: Buffer, contentType: string } on success.
 * Throws on HTTP error, timeout, or oversize response.
 *
 * MUST be called only after validateSrc() — this function trusts the URL.
 */
async function fetchSource(url) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), TIMEOUT_MS);

  let res;
  try {
    res = await fetch(url, { signal: controller.signal });
  } finally {
    clearTimeout(timer);
  }

  if (!res.ok) {
    throw new Error(`source fetch failed: ${res.status}`);
  }

  const contentLength = Number(res.headers.get('content-length'));
  if (Number.isFinite(contentLength) && contentLength > MAX_BYTES) {
    throw new Error(`source too large: ${contentLength} bytes`);
  }

  const ab = await res.arrayBuffer();
  if (ab.byteLength > MAX_BYTES) {
    throw new Error(`source too large: ${ab.byteLength} bytes`);
  }

  return {
    buffer: Buffer.from(ab),
    contentType: res.headers.get('content-type') || 'application/octet-stream',
  };
}

module.exports = { fetchSource, MAX_BYTES, TIMEOUT_MS };
```

- [ ] **Step 4:** Run — expect pass

- [ ] **Step 5:** Commit

```bash
git add api/imageFetch.js api/imageFetch.test.js
git commit -m "feat(images): imageFetch — bounded source fetch with 5 MB / 10s caps"
```

---

## Task 6: `api/imageTransform.js` — sharp wrapper

**Files:**
- Create: `api/imageTransform.js`
- Create: `api/imageTransform.test.js`

- [ ] **Step 1:** Write failing tests

```js
// api/imageTransform.test.js
const { describe, it, expect } = require('vitest');
const sharp = require('sharp');
const { transform } = require('./imageTransform');

async function makeOpaqueBuffer(w, h) {
  return sharp({ create: { width: w, height: h, channels: 3, background: { r: 100, g: 150, b: 200 } } })
    .jpeg({ quality: 80 })
    .toBuffer();
}

async function makeAlphaBuffer(w, h) {
  return sharp({ create: { width: w, height: h, channels: 4, background: { r: 255, g: 0, b: 0, alpha: 0.5 } } })
    .png()
    .toBuffer();
}

describe('transform', () => {
  it('produces an AVIF buffer at the requested width', async () => {
    const src = await makeOpaqueBuffer(2000, 1500);
    const out = await transform({ buffer: src, width: 800, format: 'avif' });
    expect(out.contentType).toBe('image/avif');
    const meta = await sharp(out.buffer).metadata();
    expect(meta.format).toBe('heif'); // sharp reports avif as heif
    expect(meta.width).toBe(800);
  });

  it('produces a WebP buffer', async () => {
    const src = await makeOpaqueBuffer(2000, 1500);
    const out = await transform({ buffer: src, width: 400, format: 'webp' });
    expect(out.contentType).toBe('image/webp');
    const meta = await sharp(out.buffer).metadata();
    expect(meta.width).toBe(400);
  });

  it('produces a JPEG buffer', async () => {
    const src = await makeOpaqueBuffer(1200, 800);
    const out = await transform({ buffer: src, width: 800, format: 'jpeg' });
    expect(out.contentType).toBe('image/jpeg');
  });

  it('produces a PNG buffer that preserves alpha', async () => {
    const src = await makeAlphaBuffer(800, 800);
    const out = await transform({ buffer: src, width: 400, format: 'png' });
    expect(out.contentType).toBe('image/png');
    const meta = await sharp(out.buffer).metadata();
    expect(meta.hasAlpha).toBe(true);
  });

  it('switches JPEG request to PNG when source has alpha (preserves transparency)', async () => {
    const src = await makeAlphaBuffer(800, 800);
    const out = await transform({ buffer: src, width: 400, format: 'jpeg' });
    expect(out.contentType).toBe('image/png');
  });

  it('does not upscale beyond source width', async () => {
    const src = await makeOpaqueBuffer(500, 400);
    const out = await transform({ buffer: src, width: 1200, format: 'webp' });
    const meta = await sharp(out.buffer).metadata();
    expect(meta.width).toBe(500); // clamped
  });
}, { timeout: 30000 });
```

- [ ] **Step 2:** Run — expect failure

- [ ] **Step 3:** Implement

```js
// api/imageTransform.js
'use strict';

const sharp = require('sharp');

const QUALITY = {
  avif: { quality: 50, effort: 4 }, // lower effort than build-time for speed
  webp: { quality: 75 },
  jpeg: { quality: 80, mozjpeg: true, progressive: true },
  png: { compressionLevel: 8, palette: true }, // lower compression than build-time
};

/**
 * Transform a source image buffer to the requested width and format.
 * Returns { buffer, contentType }.
 *
 * If format is 'jpeg' but the source has an alpha channel, output PNG instead
 * to preserve transparency. The caller's HTTP response content-type reflects
 * the actual format produced.
 */
async function transform({ buffer, width, format }) {
  const meta = await sharp(buffer).metadata();
  let effectiveFormat = format;
  if (format === 'jpeg' && meta.hasAlpha) {
    effectiveFormat = 'png';
  }
  const pipeline = sharp(buffer).resize({ width, withoutEnlargement: true });
  const opts = QUALITY[effectiveFormat];
  const outBuffer = await pipeline[effectiveFormat](opts).toBuffer();
  const contentType = `image/${effectiveFormat === 'jpeg' ? 'jpeg' : effectiveFormat}`;
  return { buffer: outBuffer, contentType };
}

module.exports = { transform, QUALITY };
```

- [ ] **Step 4:** Run — expect pass

- [ ] **Step 5:** Commit

```bash
git add api/imageTransform.js api/imageTransform.test.js
git commit -m "feat(images): imageTransform — sharp wrapper with alpha-aware fallback"
```

---

## Task 7: `api/image.js` — Express handler composing all modules

**Files:**
- Create: `api/image.js`
- Create: `api/image.test.js`

- [ ] **Step 1:** Write failing tests

```js
// api/image.test.js
const { describe, it, expect, vi, beforeEach } = require('vitest');
const request = require('supertest');
const express = require('express');
const sharp = require('sharp');
const imageRouter = require('./image');
const { _cache } = require('./image'); // exposed for tests

async function makeOpaqueBuffer(w, h) {
  return sharp({ create: { width: w, height: h, channels: 3, background: { r: 100, g: 150, b: 200 } } })
    .jpeg({ quality: 80 })
    .toBuffer();
}

beforeEach(() => { _cache.flush(); });

function makeApp() {
  const app = express();
  app.use('/api/image', imageRouter);
  return app;
}

describe('GET /api/image', () => {
  it('400 on missing src', async () => {
    const res = await request(makeApp()).get('/api/image?w=400&fmt=avif');
    expect(res.status).toBe(400);
  });

  it('400 on disallowed origin', async () => {
    const res = await request(makeApp())
      .get('/api/image?src=' + encodeURIComponent('https://example.com/x.jpg') + '&w=400&fmt=avif');
    expect(res.status).toBe(400);
  });

  it('400 on disallowed width', async () => {
    const res = await request(makeApp())
      .get('/api/image?src=' + encodeURIComponent('https://firebasestorage.googleapis.com/x') + '&w=999&fmt=avif');
    expect(res.status).toBe(400);
  });

  it('400 on disallowed format', async () => {
    const res = await request(makeApp())
      .get('/api/image?src=' + encodeURIComponent('https://firebasestorage.googleapis.com/x') + '&w=400&fmt=gif');
    expect(res.status).toBe(400);
  });

  it('502 when source fetch fails', async () => {
    globalThis.fetch = vi.fn().mockResolvedValue({ ok: false, status: 404 });
    const res = await request(makeApp())
      .get('/api/image?src=' + encodeURIComponent('https://firebasestorage.googleapis.com/missing.jpg') + '&w=400&fmt=avif');
    expect(res.status).toBe(502);
  });

  it('200 + AVIF body when source fetch succeeds', async () => {
    const srcBuf = await makeOpaqueBuffer(1200, 800);
    globalThis.fetch = vi.fn().mockResolvedValue({
      ok: true,
      headers: new Map([['content-type', 'image/jpeg'], ['content-length', String(srcBuf.length)]]),
      arrayBuffer: () => Promise.resolve(srcBuf.buffer.slice(srcBuf.byteOffset, srcBuf.byteOffset + srcBuf.byteLength)),
    });
    const res = await request(makeApp())
      .get('/api/image?src=' + encodeURIComponent('https://firebasestorage.googleapis.com/x.jpg') + '&w=400&fmt=avif');
    expect(res.status).toBe(200);
    expect(res.headers['content-type']).toBe('image/avif');
    expect(res.headers['cache-control']).toMatch(/immutable/);
    expect(res.body.length).toBeGreaterThan(0);
  });

  it('serves second request from cache (no second fetch call)', async () => {
    const srcBuf = await makeOpaqueBuffer(1200, 800);
    const fetchSpy = vi.fn().mockResolvedValue({
      ok: true,
      headers: new Map([['content-type', 'image/jpeg']]),
      arrayBuffer: () => Promise.resolve(srcBuf.buffer.slice(srcBuf.byteOffset, srcBuf.byteOffset + srcBuf.byteLength)),
    });
    globalThis.fetch = fetchSpy;
    const url = '/api/image?src=' + encodeURIComponent('https://firebasestorage.googleapis.com/x.jpg') + '&w=400&fmt=webp';
    await request(makeApp()).get(url);
    await request(makeApp()).get(url);
    expect(fetchSpy).toHaveBeenCalledTimes(1);
  });
}, { timeout: 30000 });
```

- [ ] **Step 2:** Run — expect failure

- [ ] **Step 3:** Implement

```js
// api/image.js
'use strict';

const express = require('express');
const crypto = require('crypto');
const { createCache } = require('./imageCache');
const { validateSrc, validateWidth, validateFormat } = require('./imageValidation');
const { fetchSource } = require('./imageFetch');
const { transform } = require('./imageTransform');

const CACHE_MAX_BYTES = Number(process.env.IMAGE_CACHE_MAX_BYTES) || 100 * 1024 * 1024;
const CACHE_TTL_MS = Number(process.env.IMAGE_CACHE_TTL_MS) || 60 * 60 * 1000;

const cache = createCache({ maxBytes: CACHE_MAX_BYTES, ttlMs: CACHE_TTL_MS });

function cacheKey(src, width, format) {
  return crypto.createHash('sha1').update(`${src}|${width}|${format}`).digest('hex');
}

const router = express.Router();

router.get('/', async (req, res) => {
  const { src, w, fmt } = req.query;

  const srcCheck = validateSrc(src);
  if (!srcCheck.ok) return res.status(400).json({ error: srcCheck.error });

  const widthCheck = validateWidth(w);
  if (!widthCheck.ok) return res.status(400).json({ error: widthCheck.error });

  const formatCheck = validateFormat(fmt);
  if (!formatCheck.ok) return res.status(400).json({ error: formatCheck.error });

  const url = srcCheck.url;
  const width = widthCheck.value;
  const format = formatCheck.value;
  const key = cacheKey(url, width, format);

  const hit = cache.get(key);
  if (hit) {
    res.set('Content-Type', hit.contentType);
    res.set('Cache-Control', 'public, max-age=31536000, immutable');
    res.set('ETag', `"${key}"`);
    return res.send(hit.buffer);
  }

  try {
    const source = await fetchSource(url);
    const result = await transform({ buffer: source.buffer, width, format });
    cache.set(key, result, result.buffer.length);
    res.set('Content-Type', result.contentType);
    res.set('Cache-Control', 'public, max-age=31536000, immutable');
    res.set('ETag', `"${key}"`);
    return res.send(result.buffer);
  } catch (err) {
    const isFetch = /source fetch|source too large/.test(err.message || '');
    const status = isFetch ? 502 : 500;
    return res.status(status).json({ error: err.message || 'transform failed' });
  }
});

module.exports = router;
module.exports._cache = cache; // exposed for tests
```

- [ ] **Step 4:** Run — expect pass

```bash
npx vitest run api/image.test.js
```

- [ ] **Step 5:** Commit

```bash
git add api/image.js api/image.test.js
git commit -m "feat(images): /api/image runtime endpoint — composes validation + fetch + transform + cache"
```

---

## Task 8: Mount `/api/image` in `server.js` with rate limiting

**Files:**
- Modify: `server.js`

- [ ] **Step 1:** Find an existing rate-limit usage (search the file for `rateLimit` or `express-rate-limit`)

```bash
grep -n "rate-limit\|rateLimit" server.js | head -5
```

If existing pattern found: mirror it. If not: import + configure inline.

- [ ] **Step 2:** Add the require near the top with other route requires (alphabetical)

```js
const imageRouter = require('./api/image');
```

- [ ] **Step 3:** Add the route mount near the other `/api/*` mounts. Use a 60-rpm rate limit per IP:

```js
const rateLimit = require('express-rate-limit');

const imageRateLimit = rateLimit({
  windowMs: 60 * 1000,         // 1 minute window
  max: 60,                     // 60 requests per minute per IP
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: 'rate-limited' },
});

app.use('/api/image', imageRateLimit, imageRouter);
```

(If `express-rate-limit` is already required elsewhere in `server.js`, reuse the existing import instead of duplicating it. Just create a new limiter instance with the values above.)

Position: near the other `/api/*` mounts. Order shouldn't matter for `/api/image` specifically.

- [ ] **Step 4:** Smoke test — run server locally with dummy env, curl the endpoint

```bash
NODE_ENV=development STRIPE_SECRET_KEY=sk_test_dummy node server.js &
SERVER_PID=$!
sleep 2

# 400 on missing src
curl -sI http://localhost:7500/api/image | head -5

# 400 on disallowed origin
curl -sI "http://localhost:7500/api/image?src=https%3A%2F%2Fexample.com%2Fa.jpg&w=400&fmt=avif" | head -5

kill $SERVER_PID 2>/dev/null
```

Expected: both return `HTTP/1.1 400`.

- [ ] **Step 5:** Commit

```bash
git add server.js
git commit -m "feat(images): mount /api/image route in server.js with 60-rpm rate limit"
```

---

## Task 9: Extend `<Image>` component to use `/api/image` for proxyable URLs

**Files:**
- Modify: `src/components/Image.jsx`
- Modify: `src/components/Image.test.jsx`

Currently the component renders plain `<img>` for proxyable URLs. With `/api/image` live, it should emit `<picture>` with srcset pointing at the endpoint.

- [ ] **Step 1:** Append failing tests to `src/components/Image.test.jsx`

```jsx
describe('<Image> — proxyable URL (Firebase Storage / hqaviation.com)', () => {
  it('emits <picture> with srcset pointing at /api/image for Firebase Storage URLs', () => {
    renderInProvider(
      <Image
        src="https://firebasestorage.googleapis.com/v0/b/x/o/y.jpg"
        alt="cms"
        width={800}
        height={600}
        sizes="100vw"
        __forceProd
      />
    );
    const picture = screen.getByAltText('cms').closest('picture');
    expect(picture).toBeTruthy();
    const sources = picture.querySelectorAll('source');
    const allSrcSet = Array.from(sources).map(s => s.getAttribute('srcset')).join(' ');
    expect(allSrcSet).toContain('/api/image?src=');
    expect(allSrcSet).toContain('&w=400');
    expect(allSrcSet).toContain('&w=2400');
    expect(allSrcSet).toContain('&fmt=avif');
    expect(allSrcSet).toContain('&fmt=webp');
  });

  it('falls back to plain <img> for external (non-proxyable) URLs', () => {
    renderInProvider(
      <Image
        src="https://example.com/x.jpg"
        alt="external"
        width={800}
        height={600}
        sizes="100vw"
        __forceProd
      />
    );
    expect(screen.getByAltText('external').closest('picture')).toBeNull();
  });
});
```

- [ ] **Step 2:** Run — expect failure

- [ ] **Step 3:** Update `src/components/Image.jsx`

Replace the existing proxyable-URL branch (currently renders plain `<img>`) with a new branch that emits `<picture>`. The widths and formats are fixed for runtime (we don't know source alpha at render time, so always emit AVIF/WebP/JPEG):

```jsx
const RUNTIME_WIDTHS = [400, 800, 1200, 1600, 2400];
const RUNTIME_FORMATS = ['avif', 'webp', 'jpeg'];

function buildRuntimeSrcSet(srcUrl, format, widths) {
  const encoded = encodeURIComponent(srcUrl);
  return widths
    .map(w => `/api/image?src=${encoded}&w=${w}&fmt=${format} ${w}w`)
    .join(', ');
}
```

(Add those at the top of the file after the existing imports.)

Then replace the existing `if (isProxyableUrl(src)) { return <img ... /> }` block with:

```jsx
if (isProxyableUrl(src)) {
  const fallbackFormat = 'jpeg';
  const fallbackWidth = 1200;
  const encoded = encodeURIComponent(src);
  const fallbackSrc = `/api/image?src=${encoded}&w=${fallbackWidth}&fmt=${fallbackFormat}`;
  return (
    <picture>
      {RUNTIME_FORMATS.map((fmt) => (
        <source
          key={fmt}
          type={`image/${fmt === 'jpeg' ? 'jpeg' : fmt}`}
          srcSet={buildRuntimeSrcSet(src, fmt, RUNTIME_WIDTHS)}
          sizes={sizes}
        />
      ))}
      <img
        src={fallbackSrc}
        srcSet={buildRuntimeSrcSet(src, fallbackFormat, RUNTIME_WIDTHS)}
        sizes={sizes}
        width={width}
        height={height}
        alt={alt}
        loading={loading ?? (priority ? 'eager' : 'lazy')}
        decoding={priority ? undefined : 'async'}
        fetchpriority={priority ? 'high' : undefined}
        className={className}
        {...rest}
      />
    </picture>
  );
}
```

Note: no LQIP for runtime images (D3 doesn't generate them; would require an extra round-trip). External / opaque URL handling stays unchanged.

- [ ] **Step 4:** Run — expect pass

```bash
npx vitest run src/components/Image.test.jsx
```

- [ ] **Step 5:** Commit

```bash
git add src/components/Image.jsx src/components/Image.test.jsx
git commit -m "feat(images): <Image> emits <picture> with /api/image srcset for proxyable URLs"
```

---

## Task 10: Full test suite + production build verification

**Files:**
- No file changes — verification only

- [ ] **Step 1:** Full test suite

```bash
cd /Users/maximussmith/Downloads/HQ-Website-main-img-d3
npm test 2>&1 | tail -10
```

Expected: all D3 tests pass (cache, validation, fetch, transform, image router, Image component proxyable branch). Pre-existing failures (Firebase env-key, react-simple-maps) remain — same as on main.

- [ ] **Step 2:** Production build

```bash
npm run build 2>&1 | tail -5
```

Expected: prebuild (D1 cached) runs in <2s, vite build succeeds. Bundle should still contain `/api/image?src=` template strings (means the runtime branch is reachable).

```bash
grep -c "/api/image" dist/assets/index-*.js
```

Expected: prints a number >0.

- [ ] **Step 3:** Local Docker build smoke (verify sharp ships in runtime container)

```bash
docker build --platform linux/amd64 -t hq-server-d3-local . 2>&1 | tail -5
```

Expected: builds. If sharp isn't in the runtime image (because we moved it from devDeps to deps in Task 2), the container will be slightly larger but the runtime will have it.

```bash
docker run --rm -e NODE_ENV=development -e PORT=8080 -p 18080:8080 hq-server-d3-local &
DOCKER_PID=$!
sleep 5
curl -sI http://localhost:18080/api/image 2>&1 | head -3
docker stop $(docker ps -q --filter ancestor=hq-server-d3-local) 2>/dev/null || true
```

Expected: `400` (missing src). Confirms the route is mounted and sharp loaded.

- [ ] **Step 4:** No commit — verification only.

---

## Task 11: Push branch + open PR

**Files:**
- No file changes

- [ ] **Step 1:** Push the branch

```bash
git push -u origin feat/image-pipeline-d3 2>&1 | tail -3
```

- [ ] **Step 2:** Open PR

```bash
gh pr create --base main --head feat/image-pipeline-d3 --title "Image optimisation Phase D3 — runtime endpoint for CMS images" --body "$(cat <<'EOF'
## Summary

Phase D3 of the image-optimisation work. Adds a runtime `/api/image` endpoint that fetches CMS-uploaded images (Firebase Storage URLs, hqaviation.com) and serves AVIF/WebP/JPEG variants on demand via `sharp`. Extends the `<Image>` component (PR #7) so proxyable URLs now render `<picture>` markup pointing at this endpoint — admin-uploaded images get the same treatment as D1's build-time-optimised static images.

## What's in

**API (5 new files):**
- `api/imageCache.js` — in-memory LRU cache with byte-size cap (100 MB default) and 1-hour TTL. Cloud Run has no persistent disk, so memory-only.
- `api/imageValidation.js` — hard-coded allowlist for origins (Firebase Storage, hqaviation.com), fixed width set [400, 800, 1200, 1600, 2400], format normalisation
- `api/imageFetch.js` — Node `fetch` with 10s timeout + 5 MB cap
- `api/imageTransform.js` — sharp wrapper with alpha-aware fallback (JPEG request on transparent source → PNG)
- `api/image.js` — Express router composing the above, with `Cache-Control: max-age=31536000, immutable` + ETag

**Mount:**
- `server.js` — mounts `/api/image` with 60-rpm-per-IP rate limit

**Component update:**
- `src/components/Image.jsx` — proxyable URLs now emit `<picture>` with srcset pointing at `/api/image?src=...&w=...&fmt=...`. Falls back to JPEG at 1200w.
- `src/components/Image.test.jsx` — new tests for the proxyable URL case

**Dep promotion:**
- `package.json` — `sharp` moved from `devDependencies` to `dependencies` (was build-only; now runtime too)

## Architecture (per spec)

```
Browser
  ↓ GET /api/image?src=<encoded>&w=800&fmt=avif
Firebase Hosting (rewrites /api/** to Cloud Run)
  ↓
Cloud Run: hq-aviation-server
  ↓ validate (allowlist + width set + format set)
  ↓ cache lookup (sha1(src|w|fmt))
  ↓ HIT → stream from in-memory LRU
  ↓ MISS → fetch source (5 MB / 10s cap)
  ↓        → sharp transform (width + format, alpha-aware)
  ↓        → store in cache → stream
```

## Security

- **Hard-coded allowlist** prevents SSRF / using your server as a free transform service for arbitrary internet URLs
- **Fixed width set** prevents `w=99999` resource exhaustion
- **5 MB source cap + 10s timeout** prevents memory blowup and slow-loris attacks
- **60-rpm-per-IP rate limit** smooths burst patterns; the cache absorbs the long tail

## Out of scope

- **Cloud Run deploy** — after PR merges, user (or scripted) runs `npm run deploy:server` from main to push the new container revision. The endpoint isn't live until that happens.
- **LQIP for runtime images** — not generated by D3. Would need an extra round-trip or a synchronous fetch+downscale during render; deferred until measurement justifies.
- **Cloud Storage shared cache** — current cache is per-instance. Cloud Run's auto-scaling means each container has its own cache. Acceptable at current traffic.
- **D4 — Lighthouse before/after measurement** — separate plan.

## Test plan

- [ ] After Cloud Run deploy: `curl -sI https://hq-website-4abc7.web.app/api/image?src=https%3A%2F%2Ffirebasestorage.googleapis.com%2Fv0%2Fb%2Fx%2Fo%2Fy.jpg&w=800&fmt=avif` returns 200 + `content-type: image/avif` (or 502 if the source path doesn't exist — that's correct behaviour)
- [ ] After deploy, open a blog post page with a Firebase-Storage cover image; inspect Network tab — should see `/api/image?...&fmt=avif` requested on modern browsers
- [ ] Cache hit: identical request twice from any client should produce identical ETag and `cf-cache-status` (if Cloudflare in front) / `age` header increasing
- [ ] Disallowed origin: `curl /api/image?src=https://example.com/x.jpg&w=400&fmt=avif` returns 400

🤖 Generated with [Claude Code](https://claude.com/claude-code)
EOF
)" 2>&1 | tail -3
```

- [ ] **Step 3:** Note the PR URL.

---

## Self-Review

**Spec coverage (Phase D3 from `2026-05-09-image-optimisation-design.md`):**
- Endpoint `/api/image?src=&w=&fmt=` → Task 7 ✓
- Allowlist (Firebase Storage, hqaviation.com) → Task 4 ✓
- Width set [400, 800, 1200, 1600, 2400] → Task 4 ✓
- Format set (avif, webp, jpeg, png) → Task 4 ✓
- 5 MB source fetch cap + 10s timeout → Task 5 ✓
- Sharp transform with alpha-aware fallback → Task 6 ✓
- In-memory LRU cache (Cloud Run constraint) with TTL → Task 3 ✓
- Cache-Control: max-age=31536000, immutable → Task 7 ✓
- Rate limiting → Task 8 ✓
- `<Image>` consumes runtime endpoint → Task 9 ✓

**Placeholder scan:** none.

**Type / API consistency:** `validateSrc(src)` returns `{ ok, url, error }`; `validateWidth(w)` returns `{ ok, value, error }`; `validateFormat(fmt)` returns `{ ok, value, error }` — consistent shape. `fetchSource(url) → { buffer, contentType }` and `transform({ buffer, width, format }) → { buffer, contentType }` — chainable contracts. `createCache({ maxBytes, ttlMs }) → { get, set, flush, stats }` consistent.

**Scope check:** one PR, 11 tasks. Foundations (1, 2) → CJS modules (3, 4, 5, 6) → Express handler (7) → wiring (8, 9) → verification (10) → ship (11). Each independently sequenceable; later tasks depend on earlier via require/import.

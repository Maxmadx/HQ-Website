# Image Optimisation — Phase D1 (Build-time Pipeline) Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Generate AVIF / WebP / JPEG-or-PNG variants at 5 widths (400/800/1200/1600/2400) plus an LQIP placeholder for every source image in `public/assets/images/`, output to a mirror directory `public/assets/optimised/`, all driven by `npm run build`. Component-side consumption is Phase D2.

**Architecture:** Pure-function library (`src/lib/imageOptimisation.js`) handles all the work: walks the source tree, classifies each source (alpha-channel, size threshold), generates variants via `sharp`, writes an LQIP base64 data URL, maintains a JSON manifest of source metadata, and garbage-collects variants whose source no longer exists. A thin CLI wrapper (`scripts/optimize-images.js`) calls into the library and is wired into `npm run prebuild` so every `vite build` regenerates variants. Output lives at `public/assets/optimised/<mirror>/<basename>-<width>.<format>` — predictable URLs so D2's `<Image>` component can construct them without a runtime lookup.

**Tech Stack:** Node 20, `sharp` (libvips wrapper, verified working on Apple Silicon dev + Cloud Run in D0), vitest 4 + jsdom (existing test pattern), `node:fs/promises`, `node:path`.

**Reference files:**
- Spec: `docs/superpowers/specs/2026-05-09-image-optimisation-design.md` (revised)
- D0 prereqs report: `docs/seo/image-pipeline-d0-prereqs.md`
- Sharp spike (proves sharp works on Apple Silicon): `scripts/d0-verify-sharp.js`
- Existing test patterns: `src/lib/canonicalUrl.test.js`, `src/components/seo/jsonLd.test.js`

**Commit discipline:** one commit per task. Prefix `feat(images):` for new behaviour, `chore(images):` for infra, `docs(images):` for docs, `test(images):` for test-only changes. **One commit per task — do not batch.**

**Pre-flight gate:**
- D0 prereqs report shows GREEN for D1 (✓ already)
- Sharp installs on this host (✓ verified in D0a)
- Cloud Run + Firebase Hosting integration live (✓ all PRs merged earlier today)

**User-input gates:**
- None. D1 is self-contained build-time work; no live-service changes, no env vars to provide.

---

## File Structure

### New files

| Path | Responsibility |
|---|---|
| `src/lib/imageOptimisation.js` | Pure-function library: `walkSources`, `classifySource`, `generateVariant`, `generateLqip`, `readManifest`, `writeManifest`, `collectOrphans`, `processOneSource`, `optimizeImages` orchestrator |
| `src/lib/imageOptimisation.test.js` | Vitest unit tests for every exported function |
| `scripts/optimize-images.js` | Thin CLI wrapper: calls `optimizeImages(sourceDir, optimisedDir)`, prints summary |
| `public/assets/optimised/.gitkeep` | Placeholder so the output directory exists in fresh clones (manifest will be the real first file) |

### Modified files

| Path | Why |
|---|---|
| `package.json` | Add `sharp` as `devDependency` (already a transitive dep from D0 spike; promote). Add `"prebuild": "node scripts/optimize-images.js"` so `npm run build` regenerates variants first. |
| `.gitignore` | Ignore `public/assets/optimised/**` EXCEPT the manifest (`optimised-manifest.json` is committed so the URL pattern is reproducible from git alone). Or ignore everything in `optimised/` — defer the decision to Step 1 of Task 11. |

### Output paths (generated, not committed except manifest)

```
public/assets/optimised/
  optimised-manifest.json              ← committed
  r66/
    hero-400.avif                      ← gitignored
    hero-400.webp
    hero-400.jpeg
    hero-800.avif
    ...
    hero-2400.avif
    hero-lqip.txt                      ← gitignored
  logos/
    hq/
      hq-aviation-logo-black.png       ← skip-by-size: copied unchanged
```

---

## Task 1: Set up D1 worktree

**Files:**
- No code changes (worktree setup only)

- [ ] **Step 1:** Confirm main is clean and synced

```bash
cd /Users/maximussmith/Downloads/HQ-Website-main
git fetch origin
git status --short | head -5
git log --oneline origin/main..HEAD | wc -l
```

Expected: short status (only pre-existing dirty files like `FinalPPL.jsx` allowed), and no local commits ahead of origin.

- [ ] **Step 2:** Create the worktree

```bash
git worktree add ../HQ-Website-main-img-d1 -b feat/image-pipeline-d1
cd ../HQ-Website-main-img-d1
```

Expected: new branch `feat/image-pipeline-d1` created, worktree at `../HQ-Website-main-img-d1`.

- [ ] **Step 3:** Install deps + verify baseline build

```bash
npm install --legacy-peer-deps 2>&1 | tail -3
npm run build 2>&1 | tail -3
```

Expected: install completes, vite build succeeds.

(No commit — setup only.)

---

## Task 2: Install `sharp` as devDependency + update .gitignore

**Files:**
- Modify: `package.json` (add `sharp` to `devDependencies`)
- Modify: `package-lock.json` (auto-generated; gitignored in this repo)
- Modify: `.gitignore`

- [ ] **Step 1:** Install sharp as devDependency

```bash
cd /Users/maximussmith/Downloads/HQ-Website-main-img-d1
npm install --legacy-peer-deps --save-dev sharp
```

Expected: `sharp@^0.34.x` added under `devDependencies` in `package.json`. Install completes in ~10 seconds (libvips binaries cached from D0 spike).

- [ ] **Step 2:** Verify sharp loads

```bash
node -e "console.log('sharp version:', require('sharp').versions.vips)"
```

Expected: prints a version like `sharp version: 8.17.3`.

- [ ] **Step 3:** Add output directory to `.gitignore`

Open `.gitignore` and append (preserve existing entries):

```
# Build-time image variants (generated by scripts/optimize-images.js)
public/assets/optimised/**
!public/assets/optimised/.gitkeep
!public/assets/optimised/optimised-manifest.json
```

This ignores all variants but keeps the directory's `.gitkeep` and the manifest in git.

- [ ] **Step 4:** Create the placeholder

```bash
mkdir -p public/assets/optimised
touch public/assets/optimised/.gitkeep
```

- [ ] **Step 5:** Commit

```bash
git add package.json .gitignore public/assets/optimised/.gitkeep
git commit -m "chore(images): install sharp + reserve public/assets/optimised/ for variants"
```

---

## Task 3: `walkSources` — recursively find source image files

**Files:**
- Create: `src/lib/imageOptimisation.js` (new file, exports `walkSources` for now)
- Create: `src/lib/imageOptimisation.test.js`

- [ ] **Step 1:** Write the failing test

```js
// src/lib/imageOptimisation.test.js
import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import fs from 'node:fs/promises';
import path from 'node:path';
import os from 'node:os';
import { walkSources } from './imageOptimisation';

let tmpDir;

beforeEach(async () => {
  tmpDir = await fs.mkdtemp(path.join(os.tmpdir(), 'img-opt-'));
});

afterEach(async () => {
  await fs.rm(tmpDir, { recursive: true, force: true });
});

async function makeFixture(files) {
  for (const [rel, content] of Object.entries(files)) {
    const full = path.join(tmpDir, rel);
    await fs.mkdir(path.dirname(full), { recursive: true });
    await fs.writeFile(full, content);
  }
}

describe('walkSources', () => {
  it('returns paths to all jpg/jpeg/png/webp files under rootDir', async () => {
    await makeFixture({
      'r66/hero.jpg': 'fake',
      'r66/gallery/shot.png': 'fake',
      'logos/HQ.webp': 'fake',
      'docs/README.md': 'fake',
      'r66/data.json': 'fake',
    });
    const sources = await walkSources(tmpDir);
    const rel = sources.map(p => path.relative(tmpDir, p)).sort();
    expect(rel).toEqual([
      'logos/HQ.webp',
      'r66/gallery/shot.png',
      'r66/hero.jpg',
    ]);
  });

  it('skips directories named in skipDirs', async () => {
    await makeFixture({
      'r66/hero.jpg': 'fake',
      'optimised/already.avif': 'fake',
      'optimised/already.jpg': 'fake',
    });
    const sources = await walkSources(tmpDir, { skipDirs: ['optimised'] });
    const rel = sources.map(p => path.relative(tmpDir, p));
    expect(rel).toEqual(['r66/hero.jpg']);
  });

  it('returns empty array when rootDir does not exist', async () => {
    const sources = await walkSources(path.join(tmpDir, 'does-not-exist'));
    expect(sources).toEqual([]);
  });

  it('handles uppercase extensions case-insensitively', async () => {
    await makeFixture({
      'r66/HERO.JPG': 'fake',
      'r66/Logo.PNG': 'fake',
    });
    const sources = await walkSources(tmpDir);
    expect(sources).toHaveLength(2);
  });
});
```

- [ ] **Step 2:** Run test — expect failure

```bash
npx vitest run src/lib/imageOptimisation.test.js
```

Expected: FAIL with "Cannot find module './imageOptimisation'" or similar.

- [ ] **Step 3:** Implement `walkSources`

Create `src/lib/imageOptimisation.js`:

```js
// src/lib/imageOptimisation.js
import fs from 'node:fs/promises';
import path from 'node:path';

export const SOURCE_EXTS = new Set(['.jpg', '.jpeg', '.png', '.webp']);

/**
 * Recursively walk `rootDir` and return absolute paths to all source image files.
 * Skips directories whose basename matches any entry in `skipDirs`.
 */
export async function walkSources(rootDir, { skipDirs = [] } = {}) {
  const skip = new Set(skipDirs);
  const results = [];

  async function walk(dir) {
    let entries;
    try {
      entries = await fs.readdir(dir, { withFileTypes: true });
    } catch (err) {
      if (err.code === 'ENOENT') return;
      throw err;
    }
    for (const entry of entries) {
      const full = path.join(dir, entry.name);
      if (entry.isDirectory()) {
        if (skip.has(entry.name)) continue;
        await walk(full);
      } else if (entry.isFile()) {
        const ext = path.extname(entry.name).toLowerCase();
        if (SOURCE_EXTS.has(ext)) results.push(full);
      }
    }
  }

  await walk(rootDir);
  return results;
}
```

- [ ] **Step 4:** Run test — expect pass

```bash
npx vitest run src/lib/imageOptimisation.test.js
```

Expected: PASS, 4/4 tests green.

- [ ] **Step 5:** Commit

```bash
git add src/lib/imageOptimisation.js src/lib/imageOptimisation.test.js
git commit -m "feat(images): walkSources — recursively list source image files"
```

---

## Task 4: `classifySource` — read metadata + decide skip-by-size

**Files:**
- Modify: `src/lib/imageOptimisation.js` (add `classifySource`)
- Modify: `src/lib/imageOptimisation.test.js` (add tests)

- [ ] **Step 1:** Append failing tests

Append to `src/lib/imageOptimisation.test.js`:

```js
import { classifySource, SKIP_BELOW_BYTES } from './imageOptimisation';
import sharp from 'sharp';

async function makeRealImage(rel, width, height, options = {}) {
  const full = path.join(tmpDir, rel);
  await fs.mkdir(path.dirname(full), { recursive: true });
  const channels = options.alpha ? 4 : 3;
  const buf = await sharp({
    create: {
      width, height, channels,
      background: options.alpha ? { r: 255, g: 0, b: 0, alpha: 0.5 } : { r: 100, g: 100, b: 100 },
    },
  })[options.format || 'jpeg']({ quality: options.quality ?? 80 }).toBuffer();
  await fs.writeFile(full, buf);
  return full;
}

describe('classifySource', () => {
  it('returns metadata for a normal JPEG source', async () => {
    const src = await makeRealImage('r66/hero.jpg', 1200, 800);
    const stats = await fs.stat(src);
    if (stats.size < SKIP_BELOW_BYTES) {
      // pad with extra encoded data to ensure > 50KB threshold case is testable
      // (this size depends on sharp output; small synthetic images compress tiny)
    }
    const meta = await classifySource(src);
    expect(meta.srcPath).toBe(src);
    expect(meta.width).toBe(1200);
    expect(meta.height).toBe(800);
    expect(meta.hasAlpha).toBe(false);
    expect(meta.sizeBytes).toBeGreaterThan(0);
    expect(typeof meta.skipReason === 'string' || meta.skipReason === null).toBe(true);
  });

  it('detects alpha channel on transparent PNG', async () => {
    const src = await makeRealImage('logos/transparent.png', 200, 200, { alpha: true, format: 'png' });
    const meta = await classifySource(src);
    expect(meta.hasAlpha).toBe(true);
  });

  it('marks sources < 50KB as skip-by-size', async () => {
    // 100×100 synthetic image will be well under 50KB
    const src = await makeRealImage('logos/small.png', 100, 100, { format: 'png' });
    const meta = await classifySource(src);
    expect(meta.skipReason).toBe('below-size-threshold');
  });

  it('does not mark large sources as skip', async () => {
    // 2400×1600 will be well over 50KB
    const src = await makeRealImage('r66/large.jpg', 2400, 1600);
    const meta = await classifySource(src);
    expect(meta.skipReason).toBeNull();
  });
});
```

- [ ] **Step 2:** Run test — expect failure

```bash
npx vitest run src/lib/imageOptimisation.test.js
```

Expected: FAIL with "classifySource is not a function".

- [ ] **Step 3:** Add implementation

Append to `src/lib/imageOptimisation.js`:

```js
import sharp from 'sharp';

export const SKIP_BELOW_BYTES = 50 * 1024;

/**
 * Inspect a source image and decide whether it should be optimised.
 * Returns: { srcPath, sizeBytes, mtimeMs, width, height, hasAlpha, format, skipReason }
 * skipReason is null if the source should be processed normally,
 * or a string explaining why it should be skipped (copied unchanged).
 */
export async function classifySource(srcPath) {
  const stat = await fs.stat(srcPath);
  const meta = await sharp(srcPath).metadata();
  const skipReason = stat.size < SKIP_BELOW_BYTES ? 'below-size-threshold' : null;
  return {
    srcPath,
    sizeBytes: stat.size,
    mtimeMs: stat.mtimeMs,
    width: meta.width,
    height: meta.height,
    hasAlpha: !!meta.hasAlpha,
    format: meta.format,
    skipReason,
  };
}
```

- [ ] **Step 4:** Run test — expect pass

```bash
npx vitest run src/lib/imageOptimisation.test.js
```

Expected: PASS, 8/8 tests green.

- [ ] **Step 5:** Commit

```bash
git add src/lib/imageOptimisation.js src/lib/imageOptimisation.test.js
git commit -m "feat(images): classifySource — read metadata + decide skip-by-size"
```

---

## Task 5: `generateVariant` — produce one width/format combination

**Files:**
- Modify: `src/lib/imageOptimisation.js`
- Modify: `src/lib/imageOptimisation.test.js`

- [ ] **Step 1:** Append failing tests

```js
import { generateVariant, FORMAT_CONFIG, SIZES } from './imageOptimisation';

describe('generateVariant', () => {
  it('generates an AVIF variant at the requested width', async () => {
    const src = await makeRealImage('r66/hero.jpg', 2000, 1500);
    const outDir = path.join(tmpDir, 'out');
    const result = await generateVariant(src, outDir, 800, 'avif');
    expect(result.outPath).toMatch(/hero-800\.avif$/);
    const outMeta = await sharp(result.outPath).metadata();
    expect(outMeta.format).toBe('heif'); // sharp reports avif as heif in metadata
    expect(outMeta.width).toBe(800);
  });

  it('generates a WebP variant', async () => {
    const src = await makeRealImage('r66/hero.jpg', 2000, 1500);
    const outDir = path.join(tmpDir, 'out');
    const result = await generateVariant(src, outDir, 400, 'webp');
    const outMeta = await sharp(result.outPath).metadata();
    expect(outMeta.format).toBe('webp');
    expect(outMeta.width).toBe(400);
  });

  it('preserves alpha when generating PNG variant from transparent source', async () => {
    const src = await makeRealImage('logo.png', 500, 500, { alpha: true, format: 'png' });
    const outDir = path.join(tmpDir, 'out');
    const result = await generateVariant(src, outDir, 400, 'png');
    const outMeta = await sharp(result.outPath).metadata();
    expect(outMeta.hasAlpha).toBe(true);
  });

  it('does not upscale beyond source width', async () => {
    const src = await makeRealImage('small.jpg', 600, 400); // source narrower than 800
    const outDir = path.join(tmpDir, 'out');
    const result = await generateVariant(src, outDir, 800, 'webp');
    const outMeta = await sharp(result.outPath).metadata();
    expect(outMeta.width).toBe(600); // sharp's withoutEnlargement clamped to source width
  });
});
```

- [ ] **Step 2:** Run — expect failure

```bash
npx vitest run src/lib/imageOptimisation.test.js
```

- [ ] **Step 3:** Implement

Append to `src/lib/imageOptimisation.js`:

```js
export const SIZES = [400, 800, 1200, 1600, 2400];

export const FORMAT_CONFIG = {
  avif: { quality: 50, effort: 6 },
  webp: { quality: 75 },
  jpeg: { quality: 80, mozjpeg: true, progressive: true },
  png: { compressionLevel: 9, palette: true },
};

/**
 * Generate one variant of `srcPath` at `width` in `format`, writing to
 * `outDir/<basename>-<width>.<ext>`. Returns { outPath, sizeBytes }.
 *
 * sharp's `withoutEnlargement: true` prevents upscaling — if the source
 * is narrower than the requested width, the output is clamped to source width.
 */
export async function generateVariant(srcPath, outDir, width, format) {
  const ext = format === 'jpeg' ? 'jpg' : format;
  const basename = path.basename(srcPath, path.extname(srcPath));
  const outPath = path.join(outDir, `${basename}-${width}.${ext}`);

  await fs.mkdir(outDir, { recursive: true });

  const config = FORMAT_CONFIG[format];
  if (!config) throw new Error(`Unknown format: ${format}`);

  const pipeline = sharp(srcPath).resize({ width, withoutEnlargement: true });
  await pipeline[format](config).toFile(outPath);

  const stat = await fs.stat(outPath);
  return { outPath, sizeBytes: stat.size };
}
```

- [ ] **Step 4:** Run — expect pass

```bash
npx vitest run src/lib/imageOptimisation.test.js
```

Expected: PASS, 12/12 tests green.

- [ ] **Step 5:** Commit

```bash
git add src/lib/imageOptimisation.js src/lib/imageOptimisation.test.js
git commit -m "feat(images): generateVariant — single width/format output via sharp"
```

---

## Task 6: `generateLqip` — base64 AVIF blur-up placeholder

**Files:**
- Modify: `src/lib/imageOptimisation.js`
- Modify: `src/lib/imageOptimisation.test.js`

- [ ] **Step 1:** Append failing tests

```js
import { generateLqip } from './imageOptimisation';

describe('generateLqip', () => {
  it('returns a base64 data URL string', async () => {
    const src = await makeRealImage('hero.jpg', 1600, 900);
    const lqip = await generateLqip(src);
    expect(lqip.startsWith('data:image/avif;base64,')).toBe(true);
    expect(lqip.length).toBeGreaterThan(50); // base64 of a real image is not empty
  });

  it('produces output smaller than 1KB for typical inputs', async () => {
    const src = await makeRealImage('hero.jpg', 2000, 1500);
    const lqip = await generateLqip(src);
    expect(lqip.length).toBeLessThan(2048); // generous upper bound
  });
});
```

- [ ] **Step 2:** Run — expect failure

- [ ] **Step 3:** Implement

```js
/**
 * Generate a 16×16 base64-encoded AVIF placeholder for the source.
 * Returns a data URL string like `data:image/avif;base64,...`.
 * Used as a CSS background placeholder shown before the real image loads.
 */
export async function generateLqip(srcPath) {
  const buf = await sharp(srcPath)
    .resize(16, 16, { fit: 'cover' })
    .avif({ quality: 30, effort: 4 })
    .toBuffer();
  return `data:image/avif;base64,${buf.toString('base64')}`;
}
```

- [ ] **Step 4:** Run — expect pass

- [ ] **Step 5:** Commit

```bash
git add src/lib/imageOptimisation.js src/lib/imageOptimisation.test.js
git commit -m "feat(images): generateLqip — 16x16 AVIF blur-up placeholder as base64 data URL"
```

---

## Task 7: Manifest read/write

**Files:**
- Modify: `src/lib/imageOptimisation.js`
- Modify: `src/lib/imageOptimisation.test.js`

- [ ] **Step 1:** Append failing tests

```js
import { readManifest, writeManifest } from './imageOptimisation';

describe('readManifest', () => {
  it('returns empty shape when file does not exist', async () => {
    const m = await readManifest(path.join(tmpDir, 'manifest.json'));
    expect(m).toEqual({ version: 1, sources: {} });
  });

  it('reads an existing manifest', async () => {
    const manifestPath = path.join(tmpDir, 'manifest.json');
    await fs.writeFile(manifestPath, JSON.stringify({
      version: 1,
      sources: {
        'r66/hero.jpg': { sourceMtimeMs: 1234, hasAlpha: false, lqip: 'data:...' },
      },
    }));
    const m = await readManifest(manifestPath);
    expect(m.sources['r66/hero.jpg'].sourceMtimeMs).toBe(1234);
  });

  it('returns empty shape on malformed JSON', async () => {
    const manifestPath = path.join(tmpDir, 'broken.json');
    await fs.writeFile(manifestPath, '{ this is not valid');
    const m = await readManifest(manifestPath);
    expect(m).toEqual({ version: 1, sources: {} });
  });
});

describe('writeManifest', () => {
  it('writes pretty-printed JSON', async () => {
    const manifestPath = path.join(tmpDir, 'out.json');
    await writeManifest(manifestPath, {
      version: 1,
      sources: { 'a.jpg': { sourceMtimeMs: 1 } },
    });
    const text = await fs.readFile(manifestPath, 'utf8');
    expect(text).toContain('"version": 1');
    expect(text).toContain('"a.jpg"');
    expect(text.endsWith('\n')).toBe(true);
  });
});
```

- [ ] **Step 2:** Run — expect failure

- [ ] **Step 3:** Implement

```js
/**
 * Read the optimised-manifest.json. Returns { version, sources } even if the
 * file doesn't exist or is malformed — callers should not have to handle either.
 */
export async function readManifest(manifestPath) {
  try {
    const text = await fs.readFile(manifestPath, 'utf8');
    const parsed = JSON.parse(text);
    if (!parsed.sources) return { version: 1, sources: {} };
    return parsed;
  } catch (err) {
    return { version: 1, sources: {} };
  }
}

/**
 * Write the manifest atomically (write to temp file, then rename).
 * Atomic write prevents partial writes if the process is killed mid-write.
 */
export async function writeManifest(manifestPath, manifest) {
  await fs.mkdir(path.dirname(manifestPath), { recursive: true });
  const tmp = `${manifestPath}.tmp`;
  await fs.writeFile(tmp, JSON.stringify(manifest, null, 2) + '\n');
  await fs.rename(tmp, manifestPath);
}
```

- [ ] **Step 4:** Run — expect pass

- [ ] **Step 5:** Commit

```bash
git add src/lib/imageOptimisation.js src/lib/imageOptimisation.test.js
git commit -m "feat(images): readManifest / writeManifest with atomic write + error tolerance"
```

---

## Task 8: `collectOrphans` — remove variants whose source no longer exists

**Files:**
- Modify: `src/lib/imageOptimisation.js`
- Modify: `src/lib/imageOptimisation.test.js`

- [ ] **Step 1:** Append failing tests

```js
import { collectOrphans } from './imageOptimisation';

describe('collectOrphans', () => {
  it('removes variant files whose source no longer exists', async () => {
    const sourceDir = path.join(tmpDir, 'src');
    const optDir = path.join(tmpDir, 'opt');
    await fs.mkdir(sourceDir, { recursive: true });
    await fs.mkdir(path.join(optDir, 'r66'), { recursive: true });

    // create orphan variant — no source
    await fs.writeFile(path.join(optDir, 'r66', 'ghost-400.webp'), 'fake');
    await fs.writeFile(path.join(optDir, 'r66', 'ghost-lqip.txt'), 'fake');

    // create kept variant — source exists
    await makeRealImage('src/r66/hero.jpg', 800, 600);
    await fs.writeFile(path.join(optDir, 'r66', 'hero-400.webp'), 'fake');

    const removed = await collectOrphans(optDir, sourceDir);
    const removedRel = removed.map(p => path.relative(optDir, p)).sort();
    expect(removedRel).toEqual([
      'r66/ghost-400.webp',
      'r66/ghost-lqip.txt',
    ]);

    // confirm files deleted from disk
    await expect(fs.stat(path.join(optDir, 'r66', 'ghost-400.webp'))).rejects.toThrow();
    // confirm kept variant remains
    await expect(fs.stat(path.join(optDir, 'r66', 'hero-400.webp'))).resolves.toBeTruthy();
  });

  it('returns empty array when no orphans exist', async () => {
    const sourceDir = path.join(tmpDir, 'src');
    const optDir = path.join(tmpDir, 'opt');
    await fs.mkdir(sourceDir, { recursive: true });
    await fs.mkdir(optDir, { recursive: true });
    const removed = await collectOrphans(optDir, sourceDir);
    expect(removed).toEqual([]);
  });

  it('preserves the manifest file', async () => {
    const sourceDir = path.join(tmpDir, 'src');
    const optDir = path.join(tmpDir, 'opt');
    await fs.mkdir(sourceDir, { recursive: true });
    await fs.mkdir(optDir, { recursive: true });
    await fs.writeFile(path.join(optDir, 'optimised-manifest.json'), '{}');
    await collectOrphans(optDir, sourceDir);
    await expect(fs.stat(path.join(optDir, 'optimised-manifest.json'))).resolves.toBeTruthy();
  });
});
```

- [ ] **Step 2:** Run — expect failure

- [ ] **Step 3:** Implement

```js
const VARIANT_NAME_RE = /^(.+)-(\d+|lqip)\.(avif|webp|jpg|jpeg|png|txt)$/i;
const MANIFEST_FILENAME = 'optimised-manifest.json';

/**
 * Walk `optimisedDir`, identify variant files whose corresponding source
 * (in `sourceDir`) no longer exists, delete them, and return their paths.
 * Preserves the manifest and any non-variant files.
 */
export async function collectOrphans(optimisedDir, sourceDir) {
  const removed = [];

  async function walk(dir) {
    let entries;
    try {
      entries = await fs.readdir(dir, { withFileTypes: true });
    } catch (err) {
      if (err.code === 'ENOENT') return;
      throw err;
    }
    for (const entry of entries) {
      const full = path.join(dir, entry.name);
      if (entry.isDirectory()) {
        await walk(full);
        continue;
      }
      if (entry.name === MANIFEST_FILENAME || entry.name === '.gitkeep') continue;
      if (!entry.isFile()) continue;

      const match = entry.name.match(VARIANT_NAME_RE);
      if (!match) continue;
      const [, basename] = match;
      const relDir = path.relative(optimisedDir, dir);

      // Look for a matching source — try each plausible source extension.
      let sourceExists = false;
      for (const ext of ['.jpg', '.jpeg', '.png', '.webp']) {
        const candidate = path.join(sourceDir, relDir, `${basename}${ext}`);
        try { await fs.stat(candidate); sourceExists = true; break; } catch { /* try next */ }
      }
      if (!sourceExists) {
        await fs.unlink(full);
        removed.push(full);
      }
    }
  }

  await walk(optimisedDir);
  return removed;
}
```

- [ ] **Step 4:** Run — expect pass

- [ ] **Step 5:** Commit

```bash
git add src/lib/imageOptimisation.js src/lib/imageOptimisation.test.js
git commit -m "feat(images): collectOrphans — delete variants whose source no longer exists"
```

---

## Task 9: `processOneSource` — orchestrate per-source work (with incremental mtime check)

**Files:**
- Modify: `src/lib/imageOptimisation.js`
- Modify: `src/lib/imageOptimisation.test.js`

- [ ] **Step 1:** Append failing tests

```js
import { processOneSource } from './imageOptimisation';

describe('processOneSource', () => {
  it('generates AVIF + WebP + JPEG variants for opaque source + LQIP + manifest entry', async () => {
    const src = await makeRealImage('src/r66/hero.jpg', 2000, 1500);
    const sourceDir = path.join(tmpDir, 'src');
    const optDir = path.join(tmpDir, 'opt');

    const result = await processOneSource(src, sourceDir, optDir, { version: 1, sources: {} });
    expect(result.skipped).toBe(false);
    expect(result.variants.length).toBe(SIZES.length * 3); // 5 widths × 3 formats
    expect(result.lqip).toMatch(/^data:image\/avif;base64,/);

    // Files exist on disk
    for (const v of result.variants) {
      await expect(fs.stat(v.outPath)).resolves.toBeTruthy();
    }

    // Manifest entry written
    expect(result.manifestEntry.hasAlpha).toBe(false);
    expect(result.manifestEntry.lqip).toBe(result.lqip);
  });

  it('emits PNG instead of JPEG variants when source has alpha', async () => {
    const src = await makeRealImage('src/logos/transparent.png', 800, 800, { alpha: true, format: 'png' });
    const sourceDir = path.join(tmpDir, 'src');
    const optDir = path.join(tmpDir, 'opt');

    const result = await processOneSource(src, sourceDir, optDir, { version: 1, sources: {} });
    expect(result.skipped).toBe(false);
    const formats = new Set(result.variants.map(v => v.format));
    expect(formats.has('png')).toBe(true);
    expect(formats.has('jpeg')).toBe(false);
    expect(formats.has('avif')).toBe(true);
    expect(formats.has('webp')).toBe(true);
  });

  it('copies skip-by-size sources unchanged into the optimised tree', async () => {
    // 100×100 PNG will be well under 50KB
    const src = await makeRealImage('src/logos/small.png', 100, 100, { format: 'png' });
    const sourceDir = path.join(tmpDir, 'src');
    const optDir = path.join(tmpDir, 'opt');

    const result = await processOneSource(src, sourceDir, optDir, { version: 1, sources: {} });
    expect(result.skipped).toBe(true);
    expect(result.skipReason).toBe('below-size-threshold');
    // Copy exists at mirrored path
    const copyPath = path.join(optDir, 'logos', 'small.png');
    const original = await fs.readFile(src);
    const copy = await fs.readFile(copyPath);
    expect(Buffer.compare(original, copy)).toBe(0);
  });

  it('skips work when source mtime matches the manifest entry (incremental build)', async () => {
    const src = await makeRealImage('src/r66/hero.jpg', 2000, 1500);
    const sourceDir = path.join(tmpDir, 'src');
    const optDir = path.join(tmpDir, 'opt');
    const stat = await fs.stat(src);

    const manifest = {
      version: 1,
      sources: {
        'r66/hero.jpg': { sourceMtimeMs: stat.mtimeMs, hasAlpha: false, variants: [], lqip: '...' },
      },
    };
    const result = await processOneSource(src, sourceDir, optDir, manifest);
    expect(result.cached).toBe(true);
    expect(result.variants).toEqual([]); // nothing regenerated
  });
});
```

- [ ] **Step 2:** Run — expect failure

- [ ] **Step 3:** Implement

```js
/**
 * Process one source image: classify, decide formats, generate variants + LQIP,
 * and produce a manifest entry. Returns { skipped, cached, variants, lqip, manifestEntry }.
 *
 * Incremental: if the manifest already has an entry for this source with a
 * matching mtime, skip all work and return cached=true.
 */
export async function processOneSource(srcPath, sourceDir, optimisedDir, manifest) {
  const relPath = path.relative(sourceDir, srcPath);

  const classification = await classifySource(srcPath);
  const existingEntry = manifest.sources?.[relPath];

  if (existingEntry && existingEntry.sourceMtimeMs === classification.mtimeMs) {
    return { skipped: false, cached: true, variants: [], lqip: existingEntry.lqip ?? null, manifestEntry: existingEntry };
  }

  const outDir = path.join(optimisedDir, path.dirname(relPath));
  await fs.mkdir(outDir, { recursive: true });

  if (classification.skipReason === 'below-size-threshold') {
    // Copy unchanged
    const dest = path.join(optimisedDir, relPath);
    await fs.copyFile(srcPath, dest);
    const manifestEntry = {
      sourceMtimeMs: classification.mtimeMs,
      sourceSizeBytes: classification.sizeBytes,
      hasAlpha: classification.hasAlpha,
      width: classification.width,
      height: classification.height,
      skipped: true,
      skipReason: classification.skipReason,
    };
    return { skipped: true, cached: false, skipReason: classification.skipReason, variants: [], lqip: null, manifestEntry };
  }

  const fallbackFormat = classification.hasAlpha ? 'png' : 'jpeg';
  const formats = ['avif', 'webp', fallbackFormat];

  const variants = [];
  for (const width of SIZES) {
    for (const format of formats) {
      // sharp.withoutEnlargement clamps to source width, so if width > source.width
      // we'll get a duplicate of the largest width. Avoid by checking up front:
      if (width > classification.width && width !== SIZES[0]) continue;
      const result = await generateVariant(srcPath, outDir, width, format);
      variants.push({ width, format, outPath: result.outPath, sizeBytes: result.sizeBytes });
    }
  }

  const lqip = await generateLqip(srcPath);

  const manifestEntry = {
    sourceMtimeMs: classification.mtimeMs,
    sourceSizeBytes: classification.sizeBytes,
    hasAlpha: classification.hasAlpha,
    width: classification.width,
    height: classification.height,
    skipped: false,
    variantWidths: [...new Set(variants.map(v => v.width))],
    variantFormats: formats,
    lqip,
  };

  return { skipped: false, cached: false, variants, lqip, manifestEntry };
}
```

- [ ] **Step 4:** Run — expect pass

- [ ] **Step 5:** Commit

```bash
git add src/lib/imageOptimisation.js src/lib/imageOptimisation.test.js
git commit -m "feat(images): processOneSource — orchestrate variants + LQIP + manifest with mtime cache"
```

---

## Task 10: `optimizeImages` — top-level orchestrator

**Files:**
- Modify: `src/lib/imageOptimisation.js`
- Modify: `src/lib/imageOptimisation.test.js`

- [ ] **Step 1:** Append failing test

```js
import { optimizeImages } from './imageOptimisation';

describe('optimizeImages', () => {
  it('processes a directory of sources end-to-end', async () => {
    await makeRealImage('src/r66/hero.jpg', 2000, 1500);
    await makeRealImage('src/logos/transparent.png', 800, 800, { alpha: true, format: 'png' });
    await makeRealImage('src/logos/tiny.png', 100, 100, { format: 'png' }); // skip-by-size

    const sourceDir = path.join(tmpDir, 'src');
    const optDir = path.join(tmpDir, 'opt');

    const summary = await optimizeImages(sourceDir, optDir);

    expect(summary.processed).toBeGreaterThanOrEqual(2);
    expect(summary.skipped).toBeGreaterThanOrEqual(1);
    expect(summary.totalVariants).toBeGreaterThan(0);

    // Manifest written
    const manifestPath = path.join(optDir, MANIFEST_FILENAME);
    const m = await readManifest(manifestPath);
    expect(Object.keys(m.sources)).toContain('r66/hero.jpg');
    expect(Object.keys(m.sources)).toContain('logos/transparent.png');
    expect(Object.keys(m.sources)).toContain('logos/tiny.png');
    expect(m.sources['logos/tiny.png'].skipped).toBe(true);
  });

  it('removes orphan variants after rerun with sources deleted', async () => {
    await makeRealImage('src/a.jpg', 1000, 1000);
    const sourceDir = path.join(tmpDir, 'src');
    const optDir = path.join(tmpDir, 'opt');

    await optimizeImages(sourceDir, optDir);
    // confirm variants exist
    const aVariants = await fs.readdir(optDir);
    expect(aVariants.some(f => f.startsWith('a-'))).toBe(true);

    // delete source, rerun
    await fs.rm(path.join(sourceDir, 'a.jpg'));
    await optimizeImages(sourceDir, optDir);

    // confirm variants gone
    const after = await fs.readdir(optDir);
    expect(after.some(f => f.startsWith('a-'))).toBe(false);
  });
});

// Import the constant for the test above
import { MANIFEST_FILENAME } from './imageOptimisation';
```

You'll also need to export `MANIFEST_FILENAME` from `src/lib/imageOptimisation.js`:

```js
// Change the existing line to:
export const MANIFEST_FILENAME = 'optimised-manifest.json';
```

- [ ] **Step 2:** Run — expect failure

- [ ] **Step 3:** Implement

```js
/**
 * Walk `sourceDir`, regenerate variants in `optimisedDir`, write the manifest,
 * and garbage-collect orphans. Returns a summary of work done.
 */
export async function optimizeImages(sourceDir, optimisedDir, { skipDirs = ['optimised'] } = {}) {
  await fs.mkdir(optimisedDir, { recursive: true });

  const manifestPath = path.join(optimisedDir, MANIFEST_FILENAME);
  const manifest = await readManifest(manifestPath);

  const sources = await walkSources(sourceDir, { skipDirs });

  let processed = 0;
  let cached = 0;
  let skipped = 0;
  let totalVariants = 0;
  const newSources = {};

  for (const srcPath of sources) {
    const relPath = path.relative(sourceDir, srcPath);
    try {
      const result = await processOneSource(srcPath, sourceDir, optimisedDir, manifest);
      newSources[relPath] = result.manifestEntry;
      if (result.cached) cached++;
      else if (result.skipped) skipped++;
      else { processed++; totalVariants += result.variants.length; }
    } catch (err) {
      console.error(`[optimize-images] ${relPath} failed: ${err.message}`);
    }
  }

  const newManifest = {
    version: 1,
    generatedAt: new Date().toISOString(),
    sources: newSources,
  };
  await writeManifest(manifestPath, newManifest);

  const removed = await collectOrphans(optimisedDir, sourceDir);

  return { processed, cached, skipped, totalVariants, removed: removed.length };
}
```

- [ ] **Step 4:** Run — expect pass

- [ ] **Step 5:** Commit

```bash
git add src/lib/imageOptimisation.js src/lib/imageOptimisation.test.js
git commit -m "feat(images): optimizeImages — end-to-end orchestrator with manifest + GC"
```

---

## Task 11: CLI wrapper `scripts/optimize-images.js`

**Files:**
- Create: `scripts/optimize-images.js`

- [ ] **Step 1:** Implement

```js
// scripts/optimize-images.js
//
// CLI wrapper: invokes the imageOptimisation library on
// public/assets/images → public/assets/optimised. Wired to `npm run prebuild`
// so `npm run build` regenerates variants first.
//
// Run manually with: node scripts/optimize-images.js

import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { optimizeImages } from '../src/lib/imageOptimisation.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const REPO_ROOT = path.resolve(__dirname, '..');
const SOURCE_DIR = path.join(REPO_ROOT, 'public', 'assets', 'images');
const OPTIMISED_DIR = path.join(REPO_ROOT, 'public', 'assets', 'optimised');

const t0 = Date.now();
console.log(`[optimize-images] sources: ${path.relative(REPO_ROOT, SOURCE_DIR)}`);
console.log(`[optimize-images] output:  ${path.relative(REPO_ROOT, OPTIMISED_DIR)}`);

try {
  const summary = await optimizeImages(SOURCE_DIR, OPTIMISED_DIR);
  const elapsed = ((Date.now() - t0) / 1000).toFixed(1);
  console.log(`[optimize-images] processed: ${summary.processed}, cached: ${summary.cached}, skipped: ${summary.skipped}, variants: ${summary.totalVariants}, orphans-removed: ${summary.removed}, time: ${elapsed}s`);
} catch (err) {
  console.error('[optimize-images] failed:', err);
  process.exit(1);
}
```

- [ ] **Step 2:** Smoke test by running once

```bash
cd /Users/maximussmith/Downloads/HQ-Website-main-img-d1
node scripts/optimize-images.js
```

Expected: ~60–120 seconds on first run (sharp processing 506 sources × 15 variants each). Output ends with summary line `processed: <N>, cached: 0, skipped: <M>, variants: <K>, orphans-removed: 0, time: <T>s`.

After first run, immediate second run should be near-instant (all cached):

```bash
node scripts/optimize-images.js
```

Expected: `processed: 0, cached: <N>, skipped: <M>, variants: 0, ...` in <2 seconds.

- [ ] **Step 3:** Verify file sizes dropped

```bash
du -sh public/assets/images public/assets/optimised
```

Expected: optimised directory is comparable in size to source (~80% of source — variant total per source ≈ source size, but ~5× fewer bytes served per request).

Spot-check a single image:

```bash
ls -lh public/assets/optimised/$(ls public/assets/optimised | head -1)/ 2>/dev/null | head -20
```

Should show variants like `hero-400.avif`, `hero-400.webp`, `hero-400.jpg`, etc.

- [ ] **Step 4:** Commit

```bash
git add scripts/optimize-images.js
git commit -m "feat(images): CLI wrapper scripts/optimize-images.js"
```

---

## Task 12: Wire into `npm run build` + final smoke + open PR

**Files:**
- Modify: `package.json` (add `prebuild` script)
- Push branch + open PR

- [ ] **Step 1:** Update `package.json` scripts section

Read current scripts:

```bash
grep -A 12 '"scripts"' package.json | head -15
```

Add `prebuild` ABOVE `build` in the scripts object:

```json
"prebuild": "node scripts/optimize-images.js",
"build": "vite build",
```

(npm automatically runs `prebuild` before `build` due to the `pre*` lifecycle hook convention.)

Validate JSON:

```bash
node -e "JSON.parse(require('fs').readFileSync('package.json', 'utf8'))" && echo "package.json OK"
```

- [ ] **Step 2:** Run full build and verify

```bash
npm run build 2>&1 | tail -20
```

Expected output includes the optimize-images summary (e.g., `[optimize-images] processed: 0, cached: 506, ...`) followed by vite build output. Both succeed.

- [ ] **Step 3:** Run full test suite

```bash
npm test 2>&1 | tail -15
```

Expected: existing pre-existing failures only (Firebase env-key in ExpeditionBarcode.test, react-simple-maps in GeographyMap.test). All new imageOptimisation tests pass.

- [ ] **Step 4:** Commit + push

```bash
git add package.json
git commit -m "chore(images): wire scripts/optimize-images.js into npm run build via prebuild hook"
git push -u origin feat/image-pipeline-d1 2>&1 | tail -3
```

- [ ] **Step 5:** Open the PR

```bash
gh pr create --base main --head feat/image-pipeline-d1 --title "Image optimisation Phase D1 — build-time variant pipeline" --body "$(cat <<'EOF'
## Summary

Phase D1 of the image-optimisation work (spec `2026-05-09-image-optimisation-design.md`). Every source image in `public/assets/images/` is now processed at build time into AVIF + WebP + JPEG-or-PNG variants at 5 widths (400/800/1200/1600/2400), plus a 16×16 base64 AVIF blur-up placeholder. Output lives in `public/assets/optimised/<mirror-path>/<basename>-<width>.<format>`. Manifest committed; variants gitignored. Components don't yet consume the variants — that's Phase D2.

## What's in

- **`src/lib/imageOptimisation.js`** — pure library: `walkSources`, `classifySource`, `generateVariant`, `generateLqip`, `readManifest`, `writeManifest`, `collectOrphans`, `processOneSource`, `optimizeImages`
- **`src/lib/imageOptimisation.test.js`** — vitest unit + integration tests for every exported function (~20 tests)
- **`scripts/optimize-images.js`** — thin CLI wrapper; reads from `public/assets/images/`, writes to `public/assets/optimised/`
- **`package.json`** — `prebuild` lifecycle hook runs the pipeline before every `vite build`
- **`.gitignore`** — variants ignored, manifest kept
- **`public/assets/optimised/optimised-manifest.json`** — committed alpha-channel / size / LQIP metadata per source

## Key behaviours

- **Alpha-aware**: transparent PNG sources emit AVIF + WebP + **PNG** variants (not JPEG) to preserve transparency
- **Skip-by-size**: sources < 50 KB are copied unchanged into the mirror tree (no recompression risk)
- **Incremental**: mtime comparison against manifest; only sources whose mtime changed get re-processed
- **Garbage collection**: variants whose source no longer exists are removed on each run
- **No upscaling**: `sharp.withoutEnlargement` clamps to source width

## Verification

- All `src/lib/imageOptimisation.test.js` tests pass
- `npm run build` succeeds end-to-end with the prebuild hook active
- First run: ~60–120s for 506 sources × 15 variants = ~7,500 file writes
- Subsequent runs: <2s (all cached via mtime check)
- Total bytes on disk: comparable to source originals (variants individually smaller)

## Out of scope (Phase D2)

- The `<Image>` React component that consumes these variants — separate PR
- Wiring `<Image>` onto canonical pages — separate PR

## Test plan

- [ ] Confirm `npm run build` produces variants for a sample of pages
- [ ] Inspect `public/assets/optimised/` and confirm variant filenames match the `<basename>-<width>.<format>` pattern
- [ ] Open `public/assets/optimised/optimised-manifest.json` and confirm it has sensible entries (one per source, with `hasAlpha`, `lqip`, etc.)
- [ ] Delete a source image temporarily, run `npm run build`, confirm its variants are removed from the optimised directory (GC works)
- [ ] Re-add the source, run again, confirm variants regenerate

🤖 Generated with [Claude Code](https://claude.com/claude-code)
EOF
)"
```

- [ ] **Step 6:** Note the PR URL.

---

## Self-Review

**Spec coverage** (Phase D1 from `2026-05-09-image-optimisation-design.md`):
- Output to mirror `public/assets/optimised/` directory → Task 2 (setup), used throughout
- 5 widths × 3 formats → Tasks 5, 9 (SIZES constant + processOneSource)
- AVIF q50 / WebP q75 / JPEG q80 mozjpeg / PNG palette → Task 5 (FORMAT_CONFIG)
- Alpha-channel handling → Task 9
- Skip-by-size threshold → Task 4, 9
- LQIP generation → Task 6
- Incremental build via mtime → Task 9
- Variant garbage collection → Task 8
- Build wiring via prebuild hook → Task 12
- Manifest file → Task 7, 10
- Gitignore variants, keep manifest → Task 2

**Placeholder scan:** none. Every test has full assertions, every implementation has full code.

**Type / API consistency:** function signatures match between definition and test call sites. `processOneSource(srcPath, sourceDir, optimisedDir, manifest)` is consistent. `optimizeImages(sourceDir, optimisedDir, opts?)` matches the CLI invocation. `MANIFEST_FILENAME` exported once, used everywhere.

**Scope check:** one PR. 12 tasks. Foundations (1, 2) → pure library functions (3–10) → CLI wrapper (11) → wiring + ship (12). Independently sequenceable; later tasks depend on earlier ones only via direct function calls.

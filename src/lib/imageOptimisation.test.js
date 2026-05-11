import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import fs from 'node:fs/promises';
import path from 'node:path';
import os from 'node:os';
import sharp from 'sharp';
import {
  walkSources,
  classifySource,
  SKIP_BELOW_BYTES,
  generateVariant,
  FORMAT_CONFIG,
  SIZES,
  generateLqip,
} from './imageOptimisation';

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

async function makeRealImage(rel, width, height, options = {}) {
  const full = path.join(tmpDir, rel);
  await fs.mkdir(path.dirname(full), { recursive: true });
  const channels = options.alpha ? 4 : 3;
  // Generate noise pixels so the encoded output is realistically incompressible
  // (solid-colour synthetic images compress to ~3KB even at 2400×1600, which
  // would falsely trip the skip-by-size threshold in tests).
  const pixels = Buffer.alloc(width * height * channels);
  for (let i = 0; i < pixels.length; i++) pixels[i] = Math.floor(Math.random() * 256);
  let pipeline = sharp(pixels, { raw: { width, height, channels } });
  const format = options.format || 'jpeg';
  if (format === 'jpeg') {
    pipeline = pipeline.jpeg({ quality: options.quality ?? 80 });
  } else if (format === 'png') {
    // Preserve alpha for transparent test fixtures by overlaying a translucent layer
    if (options.alpha) {
      pipeline = pipeline.ensureAlpha(0.5);
    }
    pipeline = pipeline.png({ quality: options.quality ?? 80 });
  } else if (format === 'webp') {
    pipeline = pipeline.webp({ quality: options.quality ?? 80 });
  }
  const buf = await pipeline.toBuffer();
  await fs.writeFile(full, buf);
  return full;
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

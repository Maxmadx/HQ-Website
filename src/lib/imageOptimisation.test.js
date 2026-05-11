import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import fs from 'node:fs/promises';
import path from 'node:path';
import os from 'node:os';
import sharp from 'sharp';
import { walkSources, classifySource, SKIP_BELOW_BYTES } from './imageOptimisation';

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

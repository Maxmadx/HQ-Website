// api/imageTransform.test.js
import { describe, it, expect } from 'vitest';
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

describe('transform', { timeout: 30000 }, () => {
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
});

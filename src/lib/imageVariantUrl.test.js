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

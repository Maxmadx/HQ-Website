// @vitest-environment jsdom
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

describe('<Image priority>', () => {
  beforeEach(() => {
    // Reset preload links between tests (safe DOM method, not innerHTML).
    // React 19 + react-helmet-async v3 in jsdom renders <link> into the
    // React tree location (body) rather than hoisting into <head>, so we
    // clean up across the whole document — same approach Seo.test.jsx uses
    // for <script> in this stack.
    document.querySelectorAll('link[rel="preload"][as="image"]').forEach((el) => el.remove());
  });

  it('emits a <link rel="preload"> when priority is true', async () => {
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
    const link = document.querySelector('link[rel="preload"][as="image"]');
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
    const link = document.querySelector('link[rel="preload"][as="image"]');
    expect(link).toBeNull();
  });
});

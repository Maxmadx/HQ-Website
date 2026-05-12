// scripts/lighthouseMetrics.test.mjs
import { describe, it, expect } from 'vitest';
import { extractMetrics, median } from './lighthouseMetrics.mjs';

const SAMPLE = {
  audits: {
    'largest-contentful-paint': { numericValue: 2500 },
    'cumulative-layout-shift':  { numericValue: 0.02 },
    'total-blocking-time':      { numericValue: 150 },
    'speed-index':              { numericValue: 3200 },
    'interactive':              { numericValue: 4100 },
    'network-requests': {
      details: {
        items: [
          { resourceType: 'Image',      transferSize: 100_000, url: '/a.avif' },
          { resourceType: 'Image',      transferSize: 80_000,  url: '/b.webp' },
          { resourceType: 'Script',     transferSize: 200_000, url: '/index.js' },
          { resourceType: 'Stylesheet', transferSize: 10_000,  url: '/index.css' },
          { resourceType: 'Document',   transferSize: 50_000,  url: '/' },
        ],
      },
    },
  },
};

describe('extractMetrics', () => {
  it('extracts LCP / CLS / TBT in their native units', () => {
    const m = extractMetrics(SAMPLE);
    expect(m.lcpMs).toBe(2500);
    expect(m.cls).toBeCloseTo(0.02);
    expect(m.tbtMs).toBe(150);
  });

  it('sums all network-request transfer sizes', () => {
    const m = extractMetrics(SAMPLE);
    expect(m.totalBytes).toBe(100_000 + 80_000 + 200_000 + 10_000 + 50_000);
  });

  it('sums image-only transfer sizes and counts images', () => {
    const m = extractMetrics(SAMPLE);
    expect(m.imageBytes).toBe(100_000 + 80_000);
    expect(m.imageCount).toBe(2);
  });

  it('returns 0s for missing audits without crashing', () => {
    const m = extractMetrics({ audits: {} });
    expect(m.lcpMs).toBe(0);
    expect(m.cls).toBe(0);
    expect(m.tbtMs).toBe(0);
    expect(m.totalBytes).toBe(0);
    expect(m.imageBytes).toBe(0);
    expect(m.imageCount).toBe(0);
  });
});

describe('median', () => {
  it('returns middle value for odd-length lists', () => {
    expect(median([1, 3, 2])).toBe(2);
    expect(median([7])).toBe(7);
  });

  it('returns average of two middle values for even-length lists', () => {
    expect(median([1, 2, 3, 4])).toBe(2.5);
  });

  it('does not mutate input', () => {
    const arr = [3, 1, 2];
    median(arr);
    expect(arr).toEqual([3, 1, 2]);
  });

  it('throws on empty array', () => {
    expect(() => median([])).toThrow();
  });
});

// @vitest-environment jsdom
import { describe, it, expect } from 'vitest';
import { generateBarcode } from './ExpeditionBarcode';

describe('generateBarcode', () => {
  it('returns an array of the requested length', () => {
    expect(generateBarcode('arctic', 25)).toHaveLength(25);
    expect(generateBarcode('arctic', 15)).toHaveLength(15);
  });

  it('returns only 0 or 1 values', () => {
    const bars = generateBarcode('iceland', 20);
    bars.forEach(b => expect([0, 1]).toContain(b));
  });

  it('is deterministic — same input produces same output', () => {
    expect(generateBarcode('norway', 25)).toEqual(generateBarcode('norway', 25));
  });
});

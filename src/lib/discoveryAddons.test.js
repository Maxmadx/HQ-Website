import { describe, it, expect } from 'vitest';
import { computeLineTotal, computeAddonsTotal } from './discoveryAddons';

describe('computeLineTotal', () => {
  it('returns price × qty when discount is 0', () => {
    expect(computeLineTotal({ price: 2500, qty: 3, discountPct: 0 })).toBe(7500);
  });

  it('applies a percentage discount and rounds to nearest pence', () => {
    // 2500 × 1 × (1 - 0.30) = 1750
    expect(computeLineTotal({ price: 2500, qty: 1, discountPct: 30 })).toBe(1750);
    // 333 × 1 × 0.7 = 233.1 → 233
    expect(computeLineTotal({ price: 333, qty: 1, discountPct: 30 })).toBe(233);
  });

  it('treats missing discountPct as 0', () => {
    expect(computeLineTotal({ price: 1000, qty: 2 })).toBe(2000);
  });

  it('returns 0 when qty is 0', () => {
    expect(computeLineTotal({ price: 5000, qty: 0, discountPct: 50 })).toBe(0);
  });

  it('clamps negative discount to 0 and >100 to 100', () => {
    expect(computeLineTotal({ price: 1000, qty: 1, discountPct: -10 })).toBe(1000);
    expect(computeLineTotal({ price: 1000, qty: 1, discountPct: 200 })).toBe(0);
  });
});

describe('computeAddonsTotal', () => {
  it('sums line totals across multiple items', () => {
    const items = [
      { price: 2500, qty: 2, discountPct: 0 },   // 5000
      { price: 1000, qty: 1, discountPct: 30 },  // 700
    ];
    expect(computeAddonsTotal(items)).toBe(5700);
  });

  it('returns 0 for an empty array', () => {
    expect(computeAddonsTotal([])).toBe(0);
  });
});

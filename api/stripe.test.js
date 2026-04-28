import { describe, it, expect } from 'vitest';

// firebase-admin is intercepted at the test boundary via api/test-setup.js
// (registered in vite.config.js test.setupFiles). This keeps production code
// free of any test-specific guards.

import { getPrice, applyDiscountPence } from './stripe.js';

describe('getPrice', () => {
  it('returns correct price in pence for r22 30 min', async () => {
    expect(await getPrice('r22', 30)).toBe(18000);
  });

  it('returns correct price in pence for r44 60 min', async () => {
    expect(await getPrice('r44', 60)).toBe(60500);
  });

  it('returns correct price in pence for r66 30 min', async () => {
    expect(await getPrice('r66', 30)).toBe(45000);
  });

  it('returns correct price in pence for r66 60 min', async () => {
    expect(await getPrice('r66', 60)).toBe(85000);
  });

  it('returns null for unknown aircraft', async () => {
    expect(await getPrice('r99', 30)).toBeNull();
  });

  it('returns null for unknown duration', async () => {
    expect(await getPrice('r22', 45)).toBeNull();
  });

  it('returns null for null inputs', async () => {
    expect(await getPrice(null, null)).toBeNull();
  });
});

describe('applyDiscountPence', () => {
  it('returns price × qty when pct is 0', () => {
    expect(applyDiscountPence(2500, 3, 0)).toBe(7500);
  });

  it('applies the discount and rounds to integer pence', () => {
    expect(applyDiscountPence(2500, 1, 30)).toBe(1750);
    expect(applyDiscountPence(333, 1, 30)).toBe(233);
  });

  it('clamps invalid pct values', () => {
    expect(applyDiscountPence(1000, 1, -10)).toBe(1000);
    expect(applyDiscountPence(1000, 1, 200)).toBe(0);
  });
});

import { describe, it, expect } from 'vitest';
import { getPrice } from './stripe.js';

describe('getPrice', () => {
  it('returns correct price in pence for r22 30 min', () => {
    expect(getPrice('r22', 30)).toBe(18000);
  });

  it('returns correct price in pence for r44 60 min', () => {
    expect(getPrice('r44', 60)).toBe(60500);
  });

  it('returns correct price in pence for r66 30 min', () => {
    expect(getPrice('r66', 30)).toBe(45000);
  });

  it('returns correct price in pence for r66 60 min', () => {
    expect(getPrice('r66', 60)).toBe(85000);
  });

  it('returns null for unknown aircraft', () => {
    expect(getPrice('r99', 30)).toBeNull();
  });

  it('returns null for unknown duration', () => {
    expect(getPrice('r22', 45)).toBeNull();
  });

  it('returns null for null inputs', () => {
    expect(getPrice(null, null)).toBeNull();
  });
});

import { describe, it, expect } from 'vitest';
import { CartUpsertSchema } from './cartValidation.js';

describe('CartUpsertSchema — category-aware carts', () => {
  it('accepts a valid product cart payload', () => {
    const out = CartUpsertSchema.safeParse({
      sessionId: 'sess1234',
      email: 'a@b.com',
      category: 'product',
      products: [
        { itemId: 'tee', name: 'HQ Tee', qty: 2, size: 'M', priceP: 2500, requiresShipping: true },
      ],
    });
    expect(out.success).toBe(true);
  });

  it('accepts a valid london_tour cart payload', () => {
    const out = CartUpsertSchema.safeParse({
      sessionId: 'sess1234',
      email: 'a@b.com',
      category: 'london_tour',
      londonTour: { experience: 'shared', timeOfDay: 'sunset', quantity: 2, priceP: 15000 },
    });
    expect(out.success).toBe(true);
  });

  it('still accepts an existing flight cart payload (no regression)', () => {
    const out = CartUpsertSchema.safeParse({
      sessionId: 'sess1234',
      flight: { aircraftId: 'r44', duration: 60 },
    });
    expect(out.success).toBe(true);
  });

  it('rejects an unknown category', () => {
    const out = CartUpsertSchema.safeParse({
      sessionId: 'sess1234',
      category: 'banana',
    });
    expect(out.success).toBe(false);
  });

  it('rejects a product line missing required fields', () => {
    const out = CartUpsertSchema.safeParse({
      sessionId: 'sess1234',
      category: 'product',
      products: [{ itemId: 'tee' }],
    });
    expect(out.success).toBe(false);
  });

  it('rejects a london_tour with an invalid experience', () => {
    const out = CartUpsertSchema.safeParse({
      sessionId: 'sess1234',
      category: 'london_tour',
      londonTour: { experience: 'huge', timeOfDay: 'day', quantity: 1, priceP: 100 },
    });
    expect(out.success).toBe(false);
  });
});

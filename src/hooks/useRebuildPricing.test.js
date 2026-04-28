// @vitest-environment jsdom
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, waitFor } from '@testing-library/react';

const { mockGetDocs } = vi.hoisted(() => ({
  mockGetDocs: vi.fn(),
}));

vi.mock('../lib/firebase', () => ({ db: {} }));

vi.mock('firebase/firestore', () => ({
  collection: vi.fn(() => 'col-ref'),
  getDocs: mockGetDocs,
}));

beforeEach(() => {
  vi.clearAllMocks();
  vi.resetModules();
});

describe('useRebuildPricing', () => {
  it('returns defaults when Firestore has no overrides', async () => {
    mockGetDocs.mockResolvedValueOnce({ forEach: (cb) => {} });
    const { useRebuildPricing } = await import('./useRebuildPricing');
    const { result } = renderHook(() => useRebuildPricing());

    // Default for R22 from — synchronous fallback before fetch resolves
    expect(result.current.getRebuildPrices('r22')).toEqual({
      from: 55000,
      donorMin: 80000,
      donorMax: 120000,
    });

    await waitFor(() => expect(result.current.loading).toBe(false));
    // Still defaults after empty fetch
    expect(result.current.getRebuildPrices('r66')).toEqual({
      from: 150000,
      donorMin: 350000,
      donorMax: 550000,
    });
  });

  it('returns Firestore overrides when present', async () => {
    const docs = [
      { id: 'rebuild_r22_from',      data: () => ({ category: 'rebuilds', price: 6000000 }) }, // £60,000
      { id: 'rebuild_r22_donor_min', data: () => ({ category: 'rebuilds', price: 9000000 }) }, // £90,000
    ];
    mockGetDocs.mockResolvedValueOnce({ forEach: (cb) => docs.forEach(cb) });
    const { useRebuildPricing } = await import('./useRebuildPricing');
    const { result } = renderHook(() => useRebuildPricing());

    await waitFor(() => expect(result.current.loading).toBe(false));

    expect(result.current.getRebuildPrices('r22')).toEqual({
      from: 60000,       // override
      donorMin: 90000,   // override
      donorMax: 120000,  // default
    });
  });

  it('ignores docs from other categories', async () => {
    const docs = [
      { id: 'rebuild_r22_from', data: () => ({ category: 'rebuilds', price: 6000000 }) },
      { id: 'discovery_r22_30min', data: () => ({ category: 'discovery', price: 17500 }) },
    ];
    mockGetDocs.mockResolvedValueOnce({ forEach: (cb) => docs.forEach(cb) });
    const { useRebuildPricing } = await import('./useRebuildPricing');
    const { result } = renderHook(() => useRebuildPricing());

    await waitFor(() => expect(result.current.loading).toBe(false));
    // Only the rebuilds doc applied
    expect(result.current.getRebuildPrices('r22').from).toBe(60000);
  });
});

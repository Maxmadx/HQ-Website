import { describe, it, expect, vi } from 'vitest';

const { mockOnSnapshot, mockQuery, mockWhere } = vi.hoisted(() => ({
  mockOnSnapshot: vi.fn(() => () => {}),
  mockQuery: vi.fn((...args) => args),
  mockWhere: vi.fn(() => 'where-clause'),
}));

const { mockUseState, mockUseEffect } = vi.hoisted(() => ({
  mockUseState: vi.fn(),
  mockUseEffect: vi.fn(),
}));

vi.mock('react', () => ({
  useState: mockUseState,
  useEffect: mockUseEffect,
}));

vi.mock('../lib/firebase', () => ({ db: {} }));

vi.mock('firebase/firestore', () => ({
  collection: vi.fn(() => 'col-ref'),
  query: mockQuery,
  where: mockWhere,
  onSnapshot: mockOnSnapshot,
}));

import { useDiscoveryAddons } from './useDiscoveryAddons';

describe('useDiscoveryAddons', () => {
  it('queries misc_items where discoveryAddon == true and subscribes', () => {
    mockUseState.mockImplementation((initial) => [initial, () => {}]);
    mockUseEffect.mockImplementation((fn) => fn());

    useDiscoveryAddons();

    expect(mockWhere).toHaveBeenCalledWith('discoveryAddon', '==', true);
    expect(mockOnSnapshot).toHaveBeenCalled();
  });
});

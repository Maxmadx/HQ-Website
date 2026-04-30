import { describe, it, expect, vi, beforeEach } from 'vitest';

const { mockOnSnapshot, mockDocRef } = vi.hoisted(() => {
  const mockDocRef = {};
  return {
    mockOnSnapshot: vi.fn(() => () => {}),
    mockDocRef,
  };
});

// Mock React so we can intercept useState/useEffect without a DOM renderer
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
  doc: vi.fn(() => mockDocRef),
  getDocs: vi.fn(),
  addDoc: vi.fn(),
  updateDoc: vi.fn(),
  deleteDoc: vi.fn(),
  serverTimestamp: vi.fn(() => 'SERVER_TS'),
  query: vi.fn((...args) => args[0]),
  orderBy: vi.fn(() => 'orderBy'),
  onSnapshot: mockOnSnapshot,
}));

import { useDocument } from './useFirestore';

/**
 * Helper: run useDocument with controllable state setters.
 * Returns { setData, setLoading, setError, runEffect }
 * where runEffect() triggers the captured useEffect callback.
 */
function setupHook(collectionName, id) {
  const setData = vi.fn();
  const setLoading = vi.fn();
  const setError = vi.fn();
  let callCount = 0;

  mockUseState.mockImplementation(() => {
    callCount++;
    if (callCount === 1) return [null, setData];
    if (callCount === 2) return [true, setLoading];
    return [null, setError];
  });

  let capturedEffect = null;
  mockUseEffect.mockImplementation((fn) => {
    capturedEffect = fn;
  });

  useDocument(collectionName, id);

  return {
    setData,
    setLoading,
    setError,
    runEffect: () => capturedEffect && capturedEffect(),
  };
}

beforeEach(() => {
  vi.clearAllMocks();
});

describe('useDocument hook', () => {
  it('calls onSnapshot with the doc ref when collectionName and id are provided', () => {
    const { runEffect } = setupHook('aircraft', 'r44');
    runEffect();

    expect(mockOnSnapshot).toHaveBeenCalledWith(
      mockDocRef,
      expect.any(Function),
      expect.any(Function),
    );
  });

  it('sets data to { id, ...fields } and loading to false when snapshot exists', () => {
    const { setData, setLoading, runEffect } = setupHook('aircraft', 'r44');
    runEffect();

    const successCb = mockOnSnapshot.mock.calls[0][1];
    const fakeSnap = {
      exists: () => true,
      id: 'r44',
      data: () => ({ name: 'Robinson R44', seats: 4 }),
    };
    successCb(fakeSnap);

    expect(setData).toHaveBeenCalledWith({ id: 'r44', name: 'Robinson R44', seats: 4 });
    expect(setLoading).toHaveBeenCalledWith(false);
  });

  it('sets data to null and loading to false when snapshot does not exist', () => {
    const { setData, setLoading, runEffect } = setupHook('aircraft', 'r44');
    runEffect();

    const successCb = mockOnSnapshot.mock.calls[0][1];
    const fakeSnap = { exists: () => false };
    successCb(fakeSnap);

    expect(setData).toHaveBeenCalledWith(null);
    expect(setLoading).toHaveBeenCalledWith(false);
  });

  it('sets error and loading to false when onSnapshot fires an error', () => {
    const { setError, setLoading, runEffect } = setupHook('aircraft', 'r44');
    runEffect();

    const errorCb = mockOnSnapshot.mock.calls[0][2];
    const fakeError = new Error('permission-denied');
    errorCb(fakeError);

    expect(setError).toHaveBeenCalledWith(fakeError);
    expect(setLoading).toHaveBeenCalledWith(false);
  });

  it('does not call onSnapshot when collectionName is missing', () => {
    const { setLoading, runEffect } = setupHook('', 'r44');
    runEffect();

    expect(mockOnSnapshot).not.toHaveBeenCalled();
    expect(setLoading).toHaveBeenCalledWith(false);
  });

  it('does not call onSnapshot when id is missing', () => {
    const { setLoading, runEffect } = setupHook('aircraft', '');
    runEffect();

    expect(mockOnSnapshot).not.toHaveBeenCalled();
    expect(setLoading).toHaveBeenCalledWith(false);
  });

  it('returns the unsubscribe function from onSnapshot for effect cleanup', () => {
    const unsub = vi.fn();
    mockOnSnapshot.mockReturnValueOnce(unsub);

    const { runEffect } = setupHook('aircraft', 'r44');
    const cleanup = runEffect();

    expect(cleanup).toBe(unsub);
  });
});

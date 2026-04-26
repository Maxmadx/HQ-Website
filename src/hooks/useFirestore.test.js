import { describe, it, expect, vi, beforeEach } from 'vitest';

const { mockAdd, mockUpdateDoc, mockDeleteDoc, mockGetDocs, mockDocRef, mockOnSnapshot } = vi.hoisted(() => {
  const mockDocRef = {};
  return {
    mockAdd: vi.fn(() => Promise.resolve({ id: 'new-id' })),
    mockUpdateDoc: vi.fn(() => Promise.resolve()),
    mockDeleteDoc: vi.fn(() => Promise.resolve()),
    mockGetDocs: vi.fn(() => Promise.resolve({ docs: [] })),
    mockDocRef,
    mockOnSnapshot: vi.fn(() => () => {}),
  };
});

vi.mock('../lib/firebase', () => ({ db: {} }));

vi.mock('firebase/firestore', () => ({
  collection: vi.fn(() => 'col-ref'),
  doc: vi.fn(() => mockDocRef),
  getDocs: mockGetDocs,
  addDoc: mockAdd,
  updateDoc: mockUpdateDoc,
  deleteDoc: mockDeleteDoc,
  serverTimestamp: vi.fn(() => 'SERVER_TS'),
  query: vi.fn((...args) => args[0]),
  orderBy: vi.fn(() => 'orderBy'),
  onSnapshot: mockOnSnapshot,
}));

import { createDoc, updateDocById, deleteDocById, getCollection } from './useFirestore';

beforeEach(() => vi.clearAllMocks());

describe('useFirestore helpers', () => {
  it('getCollection returns array', async () => {
    const result = await getCollection('listings');
    expect(Array.isArray(result)).toBe(true);
  });

  it('createDoc calls addDoc with timestamps', async () => {
    await createDoc('listings', { title: 'R44' });
    expect(mockAdd).toHaveBeenCalledWith(
      'col-ref',
      expect.objectContaining({ title: 'R44', createdAt: 'SERVER_TS' })
    );
  });

  it('updateDocById calls updateDoc with updatedAt', async () => {
    await updateDocById('listings', 'abc', { title: 'R22' });
    expect(mockUpdateDoc).toHaveBeenCalledWith(
      mockDocRef,
      expect.objectContaining({ title: 'R22', updatedAt: 'SERVER_TS' })
    );
  });

  it('deleteDocById calls deleteDoc', async () => {
    await deleteDocById('listings', 'abc');
    expect(mockDeleteDoc).toHaveBeenCalledWith(mockDocRef);
  });
});

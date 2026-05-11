// @vitest-environment jsdom
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import AdminMiscItemEdit from './AdminMiscItemEdit';

// Mock Firestore + storage
vi.mock('../../lib/firebase', () => ({
  db: {},
  storage: {},
}));
vi.mock('firebase/firestore', () => ({
  doc: vi.fn(),
  getDoc: vi.fn(() => Promise.resolve({ exists: () => false })),
}));
vi.mock('firebase/storage', () => ({
  ref: vi.fn(),
  uploadBytes: vi.fn(),
  getDownloadURL: vi.fn(),
}));

const createDocSpy = vi.fn(() => Promise.resolve('new-id'));
const updateDocByIdSpy = vi.fn(() => Promise.resolve());
vi.mock('../../hooks/useFirestore', () => ({
  createDoc: (...args) => createDocSpy(...args),
  updateDocById: (...args) => updateDocByIdSpy(...args),
}));

vi.mock('../../components/admin/AdminLayout', () => ({
  default: ({ children }) => <div>{children}</div>,
}));

function renderEditNew() {
  return render(
    <MemoryRouter initialEntries={['/admin/misc/new']}>
      <Routes>
        <Route path="/admin/misc/:id" element={<AdminMiscItemEdit />} />
      </Routes>
    </MemoryRouter>
  );
}

beforeEach(() => {
  createDocSpy.mockClear();
  updateDocByIdSpy.mockClear();
});

describe('AdminMiscItemEdit — apparel + sizes', () => {
  it('hides apparel section when priceType is poa', () => {
    renderEditNew();
    // Default priceType=poa
    expect(screen.queryByText(/Apparel item/i)).toBeNull();
  });

  it('shows sizes editor only when apparel is ticked', () => {
    renderEditNew();
    fireEvent.click(screen.getByLabelText(/Fixed Price/i));
    expect(screen.queryByText(/^Sizes$/i)).toBeNull();
    fireEvent.click(screen.getByLabelText(/Apparel item/i));
    expect(screen.getByText(/^Sizes$/i)).toBeInTheDocument();
  });

  it('adds a size on Enter and removes on ×', () => {
    renderEditNew();
    fireEvent.click(screen.getByLabelText(/Fixed Price/i));
    fireEvent.click(screen.getByLabelText(/Apparel item/i));
    const input = screen.getByTestId('size-input');
    fireEvent.change(input, { target: { value: 'm' } });
    fireEvent.keyDown(input, { key: 'Enter' });
    expect(screen.getByText('M')).toBeInTheDocument();
    fireEvent.click(screen.getByLabelText(/Remove size M/i));
    expect(screen.queryByText('M')).toBeNull();
  });

  it('blocks save when apparel=true and sizes is empty', async () => {
    renderEditNew();
    fireEvent.change(screen.getByPlaceholderText(/R22 Helicopter Cover/i), { target: { value: 'Test Cap' } });
    fireEvent.click(screen.getByLabelText(/Fixed Price/i));
    fireEvent.change(screen.getByPlaceholderText(/0\.00/i), { target: { value: '20.00' } });
    fireEvent.click(screen.getByLabelText(/Apparel item/i));
    fireEvent.click(screen.getByRole('button', { name: /Create Item/i }));
    await waitFor(() => {
      expect(screen.getByText(/Apparel items need at least one size/i)).toBeInTheDocument();
    });
    expect(createDocSpy).not.toHaveBeenCalled();
  });

  it('persists apparel + sizes in createDoc payload', async () => {
    renderEditNew();
    fireEvent.change(screen.getByPlaceholderText(/R22 Helicopter Cover/i), { target: { value: 'Test Cap' } });
    fireEvent.click(screen.getByLabelText(/Fixed Price/i));
    fireEvent.change(screen.getByPlaceholderText(/0\.00/i), { target: { value: '20.00' } });
    fireEvent.click(screen.getByLabelText(/Apparel item/i));
    const input = screen.getByTestId('size-input');
    fireEvent.change(input, { target: { value: 'S' } });
    fireEvent.keyDown(input, { key: 'Enter' });
    fireEvent.change(input, { target: { value: 'M' } });
    fireEvent.keyDown(input, { key: 'Enter' });
    fireEvent.click(screen.getByRole('button', { name: /Create Item/i }));
    await waitFor(() => {
      expect(createDocSpy).toHaveBeenCalledTimes(1);
    });
    const [, payload] = createDocSpy.mock.calls[0];
    expect(payload.apparel).toBe(true);
    expect(payload.sizes).toEqual(['S', 'M']);
  });
});

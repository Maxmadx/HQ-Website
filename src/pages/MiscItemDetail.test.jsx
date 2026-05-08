// @vitest-environment jsdom
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import MiscItemDetail from './MiscItemDetail';

const navigateSpy = vi.fn();
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return { ...actual, useNavigate: () => navigateSpy };
});

vi.mock('../lib/firebase', () => ({ db: {} }));

const mockGetDoc = vi.fn();
vi.mock('firebase/firestore', () => ({
  doc: vi.fn(),
  getDoc: (...args) => mockGetDoc(...args),
}));

vi.mock('../components/FinalDraftHeader', () => ({ default: () => null }));
vi.mock('../components/FooterMinimal', () => ({ default: () => null }));

function renderDetail() {
  return render(
    <MemoryRouter initialEntries={['/store/test-id']}>
      <Routes>
        <Route path="/store/:id" element={<MiscItemDetail />} />
      </Routes>
    </MemoryRouter>
  );
}

beforeEach(() => {
  navigateSpy.mockClear();
  mockGetDoc.mockReset();
});

describe('MiscItemDetail — apparel sizes', () => {
  it('renders no size selector for non-apparel items', async () => {
    mockGetDoc.mockResolvedValue({
      exists: () => true,
      id: 'test-id',
      data: () => ({ name: 'Helicopter Cover', priceType: 'fixed', price: 5000, apparel: false, images: [] }),
    });
    renderDetail();
    await waitFor(() => screen.getByText('Helicopter Cover'));
    expect(screen.queryByRole('radiogroup', { name: /Size/i })).toBeNull();
    expect(screen.getByTestId('buy-now')).not.toBeDisabled();
  });

  it('disables Buy Now until a size is selected for apparel items', async () => {
    mockGetDoc.mockResolvedValue({
      exists: () => true,
      id: 'test-id',
      data: () => ({ name: 'HQ Tee', priceType: 'fixed', price: 2500, apparel: true, sizes: ['S','M','L'], images: [] }),
    });
    renderDetail();
    await waitFor(() => screen.getByText('HQ Tee'));
    expect(screen.getByTestId('buy-now')).toBeDisabled();
    fireEvent.click(screen.getByRole('radio', { name: 'M' }));
    expect(screen.getByTestId('buy-now')).not.toBeDisabled();
  });

  it('encodes the selected size in the checkout URL', async () => {
    mockGetDoc.mockResolvedValue({
      exists: () => true,
      id: 'test-id',
      data: () => ({ name: 'HQ Tee', priceType: 'fixed', price: 2500, apparel: true, sizes: ['S','M','L'], images: [] }),
    });
    renderDetail();
    await waitFor(() => screen.getByText('HQ Tee'));
    fireEvent.click(screen.getByRole('radio', { name: 'M' }));
    fireEvent.click(screen.getByTestId('buy-now'));
    expect(navigateSpy).toHaveBeenCalledTimes(1);
    expect(navigateSpy.mock.calls[0][0]).toMatch(/&size=M/);
  });
});

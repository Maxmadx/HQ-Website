// @vitest-environment jsdom
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import Upgrade from './Upgrade';

vi.mock('@stripe/stripe-js', () => ({ loadStripe: () => Promise.resolve(null) }));
vi.mock('@stripe/react-stripe-js', () => ({
  Elements: ({ children }) => <>{children}</>,
  CardNumberElement: () => null,
  CardExpiryElement: () => null,
  CardCvcElement: () => null,
  useStripe: () => null,
  useElements: () => null,
}));
vi.mock('../components/FinalDraftHeader', () => ({ default: () => null }));

const fetchSpy = vi.spyOn(global, 'fetch');
beforeEach(() => {
  fetchSpy.mockReset();
  fetchSpy.mockResolvedValue({ ok: false, status: 500 });
});

function renderAt(search) {
  return render(
    <MemoryRouter initialEntries={[`/upgrade${search}`]}>
      <Routes><Route path="/upgrade" element={<Upgrade />} /></Routes>
    </MemoryRouter>
  );
}

describe('Upgrade page', () => {
  it('shows error when ref is missing', async () => {
    renderAt('');
    await waitFor(() => screen.getByText(/Link expired or invalid/i));
  });

  it('shows error on 404', async () => {
    fetchSpy.mockResolvedValue({ ok: false, status: 404 });
    renderAt('?ref=pi_x');
    await waitFor(() => screen.getByText(/Link expired or invalid/i));
  });

  it('shows already-upgraded notice when booking.upgrade exists', async () => {
    fetchSpy.mockResolvedValue({ ok: true, json: () => ({ aircraft: 'r44', duration: 30, upgrade: {} }) });
    renderAt('?ref=pi_x');
    await waitFor(() => screen.getByText(/already upgraded/i));
  });

  it('shows ineligibility for non-R22 bookings', async () => {
    fetchSpy.mockResolvedValue({ ok: true, json: () => ({ aircraft: 'r44', duration: 30 }) });
    renderAt('?ref=pi_x');
    await waitFor(() => screen.getByText(/Not eligible/i));
  });

  it('renders UpgradeOfferCard for valid R22 booking', async () => {
    fetchSpy.mockResolvedValue({ ok: true, json: () => ({ aircraft: 'r22', duration: 30, flightAmountPence: 18000, paymentIntentId: 'pi_x' }) });
    renderAt('?ref=pi_x');
    await waitFor(() => screen.getByText(/Bring 2 extra friends/i));
  });
});

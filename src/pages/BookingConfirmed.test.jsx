// @vitest-environment jsdom
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import BookingConfirmed from './BookingConfirmed';

vi.mock('../lib/firebase', () => ({ db: {} }));
vi.mock('firebase/firestore', () => ({
  collection: vi.fn(),
  query: vi.fn(),
  where: vi.fn(),
  getDocs: vi.fn(() => Promise.resolve({ empty: true, docs: [] })),
  doc: vi.fn(),
  getDoc: vi.fn(),
}));
vi.mock('../lib/analytics', () => ({ trackEvent: vi.fn() }));

const fetchSpy = vi.spyOn(global, 'fetch');

beforeEach(() => fetchSpy.mockReset());

function renderAt(search) {
  return render(
    <MemoryRouter initialEntries={[`/booking-confirmed${search}`]}>
      <BookingConfirmed />
    </MemoryRouter>
  );
}

describe('BookingConfirmed', () => {
  it('does not render PostCheckoutOffers for misc bookings', async () => {
    fetchSpy.mockResolvedValue({ ok: true, json: () => ({ productType: 'misc' }) });
    renderAt('?ref=pi_misc&type=misc&itemName=Cap');
    await waitFor(() => screen.getByText(/Purchase Confirmed/i));
    expect(screen.queryByText(/Refer a friend/i)).toBeNull();
  });

  it('does not render the referral card without a referralCode', async () => {
    fetchSpy.mockResolvedValue({ ok: true, json: () => ({ productType: 'discovery-flight', aircraft: 'r22', duration: 30, referralCode: null }) });
    renderAt('?ref=pi_x&aircraft=r22&duration=30&price=180&name=Max');
    await waitFor(() => screen.getByText(/Booking Confirmed/i));
    expect(screen.queryByText(/Refer a friend/i)).toBeNull();
  });
});

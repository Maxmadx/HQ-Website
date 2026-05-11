// @vitest-environment jsdom
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, waitFor, act } from '@testing-library/react';
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

vi.mock('@stripe/stripe-js', () => ({ loadStripe: () => Promise.resolve(null) }));
vi.mock('@stripe/react-stripe-js', () => ({
  Elements: ({ children }) => <>{children}</>,
  CardNumberElement: () => null,
  CardExpiryElement: () => null,
  CardCvcElement: () => null,
  useStripe: () => null,
  useElements: () => null,
}));

const fetchSpy = vi.spyOn(global, 'fetch');

beforeEach(() => {
  fetchSpy.mockReset();
  vi.useFakeTimers({ shouldAdvanceTime: true });
});

afterEach(() => {
  vi.useRealTimers();
});

function renderAt(search) {
  return render(
    <MemoryRouter initialEntries={[`/booking-confirmed${search}`]}>
      <BookingConfirmed />
    </MemoryRouter>
  );
}

describe('BookingConfirmed', () => {
  it('shows "Confirming Booking" + spinner during Phase 1 for R22 bookings', async () => {
    fetchSpy.mockImplementation((url) => {
      if (typeof url === 'string' && url.includes('/api/booking/')) {
        return Promise.resolve({ ok: true, json: () => Promise.resolve({ productType: 'discovery-flight', aircraft: 'r22', duration: 30, flightAmountPence: 18000, paymentIntentId: 'pi_x' }) });
      }
      if (typeof url === 'string' && url.includes('/api/record-booking')) {
        return Promise.resolve({ ok: true, json: () => Promise.resolve({ ok: true }) });
      }
      return Promise.resolve({ ok: false, status: 404 });
    });

    renderAt('?ref=pi_x&aircraft=r22&duration=30&price=180&name=Test');
    await waitFor(() => screen.getByText(/Confirming Booking/i));
    expect(screen.queryByText(/Booking Confirmed/i)).toBeNull();
    expect(screen.getByLabelText(/Confirming booking/i)).toBeInTheDocument();
  });

  it('flips to Phase 2 after the 4s floor + record-booking success', async () => {
    fetchSpy.mockImplementation((url) => {
      if (typeof url === 'string' && url.includes('/api/booking/')) {
        return Promise.resolve({ ok: true, json: () => Promise.resolve({ productType: 'discovery-flight', aircraft: 'r22', duration: 30, flightAmountPence: 18000, paymentIntentId: 'pi_x' }) });
      }
      if (typeof url === 'string' && url.includes('/api/record-booking')) {
        return Promise.resolve({ ok: true, json: () => Promise.resolve({ ok: true }) });
      }
      return Promise.resolve({ ok: false, status: 404 });
    });

    renderAt('?ref=pi_x&aircraft=r22&duration=30&price=180&name=Test');
    await waitFor(() => screen.getByText(/Confirming Booking/i));

    // Advance the timer past the 4-second floor
    await act(async () => {
      vi.advanceTimersByTime(4500);
    });

    await waitFor(() => screen.getByText(/^Booking Confirmed$/i));
    expect(screen.queryByText(/Confirming Booking/i)).toBeNull();
  });

  it('renders BigUpgradeCard during Phase 1 for an R22 booker', async () => {
    fetchSpy.mockImplementation((url) => {
      if (typeof url === 'string' && url.includes('/api/booking/')) {
        return Promise.resolve({ ok: true, json: () => Promise.resolve({ productType: 'discovery-flight', aircraft: 'r22', duration: 30, flightAmountPence: 18000, paymentIntentId: 'pi_x' }) });
      }
      if (typeof url === 'string' && url.includes('/api/record-booking')) {
        return Promise.resolve({ ok: true, json: () => Promise.resolve({ ok: true }) });
      }
      return Promise.resolve({ ok: false, status: 404 });
    });

    renderAt('?ref=pi_x&aircraft=r22&duration=30&price=180&name=Test');
    await waitFor(() => screen.getByText(/UPGRADE TO THE R44/i));
    expect(screen.getByText(/You at the controls\./i)).toBeInTheDocument();
  });

  it('misc bookings skip the phases entirely and render Booking Summary immediately', async () => {
    fetchSpy.mockImplementation((url) => {
      if (typeof url === 'string' && url.includes('/api/booking/')) {
        return Promise.resolve({ ok: true, json: () => Promise.resolve({ productType: 'misc' }) });
      }
      return Promise.resolve({ ok: false, status: 404 });
    });

    renderAt('?ref=pi_misc&type=misc&itemName=Cap');
    await waitFor(() => screen.getByText(/Purchase Confirmed/i));
    expect(screen.queryByText(/Confirming Booking/i)).toBeNull();
    expect(screen.queryByText(/UPGRADE TO THE R44/i)).toBeNull();
  });
});

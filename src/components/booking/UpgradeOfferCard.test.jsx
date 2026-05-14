// @vitest-environment jsdom
import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import UpgradeOfferCard from './UpgradeOfferCard';

vi.mock('@stripe/stripe-js', () => ({ loadStripe: () => Promise.resolve(null) }));
vi.mock('@stripe/react-stripe-js', () => ({
  Elements: ({ children }) => <div data-testid="elements">{children}</div>,
  CardNumberElement: () => <div data-testid="card-number" />,
  CardExpiryElement: () => <div data-testid="card-expiry" />,
  CardCvcElement: () => <div data-testid="card-cvc" />,
  useStripe: () => null,
  useElements: () => null,
}));

describe('UpgradeOfferCard', () => {
  it('returns null for non-R22 bookings', () => {
    const { container } = render(<UpgradeOfferCard booking={{ aircraft: 'r44', duration: 30, flightAmountPence: 30500 }} onUpgraded={() => {}} />);
    expect(container).toBeEmptyDOMElement();
  });

  it('returns null when already upgraded', () => {
    const { container } = render(<UpgradeOfferCard booking={{ aircraft: 'r22', duration: 30, flightAmountPence: 18000, upgrade: {} }} onUpgraded={() => {}} />);
    expect(container).toBeEmptyDOMElement();
  });

  it('renders compact row with auto-calculated diff for R22 30min booker', () => {
    render(<UpgradeOfferCard booking={{ aircraft: 'r22', duration: 30, flightAmountPence: 18000 }} onUpgraded={() => {}} />);
    // R44 30min (30500) - R22 30min paid (18000) = 12500 pence = £125
    expect(screen.getByRole('button', { name: /Upgrade to R44/i })).toBeInTheDocument();
    expect(screen.getByText(/£125/)).toBeInTheDocument();
    expect(screen.getByText(/Bring 2 extra friends/i)).toBeInTheDocument();
    // Modal not yet open
    expect(screen.queryByRole('dialog')).toBeNull();
  });

  it('opens modal with locked duration matching the original booking', () => {
    render(<UpgradeOfferCard booking={{ aircraft: 'r22', duration: 30, flightAmountPence: 18000 }} onUpgraded={() => {}} />);
    fireEvent.click(screen.getByRole('button', { name: /Upgrade to R44/i }));
    expect(screen.getByRole('dialog')).toBeInTheDocument();
    // No duration toggle — duration is locked to the booking's original
    expect(screen.queryByRole('radio')).toBeNull();
    // Summary shows R44 30 min upgrade (the locked option)
    expect(screen.getByText(/R44 30 min upgrade/i)).toBeInTheDocument();
    // Pay button shows the locked-duration diff
    expect(screen.getByRole('button', { name: /Pay £125\.00 to upgrade/i })).toBeInTheDocument();
  });

  it('shows the correct diff for R22 60min booker (locked to 60min upgrade)', () => {
    render(<UpgradeOfferCard booking={{ aircraft: 'r22', duration: 60, flightAmountPence: 36000 }} onUpgraded={() => {}} />);
    // R44 60min (60500) - R22 60min paid (36000) = 24500 pence = £245
    expect(screen.getByText(/£245/)).toBeInTheDocument();
    fireEvent.click(screen.getByRole('button', { name: /Upgrade to R44/i }));
    expect(screen.getByText(/R44 60 min upgrade/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Pay £245\.00 to upgrade/i })).toBeInTheDocument();
  });
});

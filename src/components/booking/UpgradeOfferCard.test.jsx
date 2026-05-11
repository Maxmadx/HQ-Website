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

  it('renders compact row with auto-calculated diff in title for R22 30min', () => {
    render(<UpgradeOfferCard booking={{ aircraft: 'r22', duration: 30, flightAmountPence: 18000 }} onUpgraded={() => {}} />);
    // R44 30min (30500) - R22 30min paid (18000) = 12500 pence = £125
    expect(screen.getByRole('button', { name: /Upgrade to R44/i })).toBeInTheDocument();
    expect(screen.getByText(/£125/)).toBeInTheDocument();
    expect(screen.getByText(/Bring 2 extra friends/i)).toBeInTheDocument();
    // Modal not yet open
    expect(screen.queryByRole('dialog')).toBeNull();
  });

  it('opens modal with duration toggle when row is clicked', () => {
    render(<UpgradeOfferCard booking={{ aircraft: 'r22', duration: 30, flightAmountPence: 18000 }} onUpgraded={() => {}} />);
    fireEvent.click(screen.getByRole('button', { name: /Upgrade to R44/i }));
    expect(screen.getByRole('dialog')).toBeInTheDocument();
    expect(screen.getByRole('radio', { name: /^30 min$/i })).toBeInTheDocument();
    expect(screen.getByRole('radio', { name: /^60 min$/i })).toBeInTheDocument();
  });

  it('disables the 30 min option in modal when the booker paid R22 60 min', () => {
    render(<UpgradeOfferCard booking={{ aircraft: 'r22', duration: 60, flightAmountPence: 36000 }} onUpgraded={() => {}} />);
    fireEvent.click(screen.getByRole('button', { name: /Upgrade to R44/i }));
    expect(screen.getByRole('radio', { name: /^30 min$/i })).toBeDisabled();
    expect(screen.getByRole('radio', { name: /^60 min$/i })).not.toBeDisabled();
  });

  it('shows the correct diff in modal summary when switching to 60 min', () => {
    render(<UpgradeOfferCard booking={{ aircraft: 'r22', duration: 30, flightAmountPence: 18000 }} onUpgraded={() => {}} />);
    fireEvent.click(screen.getByRole('button', { name: /Upgrade to R44/i }));
    fireEvent.click(screen.getByRole('radio', { name: /^60 min$/i }));
    // R44 60min (60500) - R22 30min paid (18000) = 42500 pence = £425.00
    expect(screen.getByRole('button', { name: /Pay £425\.00 to upgrade/i })).toBeInTheDocument();
  });
});

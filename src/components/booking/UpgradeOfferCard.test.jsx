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

  it('renders for an R22 booking with no upgrade', () => {
    render(<UpgradeOfferCard booking={{ aircraft: 'r22', duration: 30, flightAmountPence: 18000 }} onUpgraded={() => {}} />);
    expect(screen.getByText(/Bring 2 extra friends/i)).toBeInTheDocument();
    expect(screen.getByRole('radio', { name: /^30 min$/i })).toBeInTheDocument();
    expect(screen.getByRole('radio', { name: /^60 min$/i })).toBeInTheDocument();
  });

  it('disables the 30 min option when the booker paid R22 60 min', () => {
    render(<UpgradeOfferCard booking={{ aircraft: 'r22', duration: 60, flightAmountPence: 36000 }} onUpgraded={() => {}} />);
    expect(screen.getByRole('radio', { name: /^30 min$/i })).toBeDisabled();
    expect(screen.getByRole('radio', { name: /^60 min$/i })).not.toBeDisabled();
  });

  it('shows the correct diff math for R22 30 → R44 60', () => {
    render(<UpgradeOfferCard booking={{ aircraft: 'r22', duration: 30, flightAmountPence: 18000 }} onUpgraded={() => {}} />);
    fireEvent.click(screen.getByRole('radio', { name: /^60 min$/i }));
    expect(screen.getByText(/= £425\.00 to upgrade/)).toBeInTheDocument();
  });
});

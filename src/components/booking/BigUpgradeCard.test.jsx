// @vitest-environment jsdom
import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import BigUpgradeCard from './BigUpgradeCard';

vi.mock('@stripe/stripe-js', () => ({ loadStripe: () => Promise.resolve(null) }));
vi.mock('@stripe/react-stripe-js', () => ({
  Elements: ({ children }) => <div data-testid="elements">{children}</div>,
  CardNumberElement: () => <div data-testid="card-number" />,
  CardExpiryElement: () => <div data-testid="card-expiry" />,
  CardCvcElement: () => <div data-testid="card-cvc" />,
  useStripe: () => null,
  useElements: () => null,
}));

describe('BigUpgradeCard', () => {
  it('returns null for non-R22 bookings', () => {
    const { container } = render(<BigUpgradeCard booking={{ aircraft: 'r44', duration: 30, flightAmountPence: 30500 }} />);
    expect(container).toBeEmptyDOMElement();
  });

  it('returns null when already upgraded', () => {
    const { container } = render(<BigUpgradeCard booking={{ aircraft: 'r22', duration: 30, flightAmountPence: 18000, upgrade: {} }} />);
    expect(container).toBeEmptyDOMElement();
  });

  it('returns null when diff is non-positive', () => {
    // R22 with flightAmountPence > R44 fallback → diff non-positive → null
    const { container } = render(<BigUpgradeCard booking={{ aircraft: 'r22', duration: 60, flightAmountPence: 60500 }} />);
    expect(container).toBeEmptyDOMElement();
  });

  it('renders hero card for R22 booker with positive diff', () => {
    render(<BigUpgradeCard booking={{ aircraft: 'r22', duration: 30, flightAmountPence: 18000 }} />);
    expect(screen.getByText(/UPGRADE TO THE R44/i)).toBeInTheDocument();
    expect(screen.getByText(/You at the controls\./i)).toBeInTheDocument();
    expect(screen.getByText(/Two mates in the back\./i)).toBeInTheDocument();
    expect(screen.getByText(/£125 to upgrade/)).toBeInTheDocument();
    expect(screen.getByRole('img', { name: /Robinson R44/i })).toBeInTheDocument();
    // Modal not yet open
    expect(screen.queryByRole('dialog')).toBeNull();
  });

  it('uses server-computed upgradeDiffPence when provided', () => {
    // Admin override: £100 fixed (10000 pence). Should display this instead of the auto-calc.
    render(<BigUpgradeCard booking={{ aircraft: 'r22', duration: 30, flightAmountPence: 18000, upgradeDiffPence: 10000 }} />);
    expect(screen.getByText(/£100 to upgrade/)).toBeInTheDocument();
    expect(screen.queryByText(/£125 to upgrade/)).toBeNull();
  });

  it('opens the upgrade modal when the CTA is clicked', () => {
    render(<BigUpgradeCard booking={{ aircraft: 'r22', duration: 30, flightAmountPence: 18000 }} />);
    fireEvent.click(screen.getByRole('button', { name: /Upgrade now/i }));
    expect(screen.getByRole('dialog')).toBeInTheDocument();
  });
});

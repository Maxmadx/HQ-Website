// @vitest-environment jsdom
import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import PurchaseFunnel from './PurchaseFunnel';

const tsHoursAgo = (h) => ({ toMillis: () => Date.now() - h * 3600 * 1000 });

const events = [
  { sessionId: 'a', eventType: 'view_item', itemCategory: 'discovery-flight', timestamp: tsHoursAgo(2), utmSource: 'google' },
  { sessionId: 'a', eventType: 'begin_checkout', itemCategory: 'discovery-flight', timestamp: tsHoursAgo(1), value: 350, utmSource: 'google' },
  { sessionId: 'a', eventType: 'purchase', itemCategory: 'discovery-flight', timestamp: tsHoursAgo(1), value: 350, transactionId: 'pi_a' },
];

describe('PurchaseFunnel', () => {
  it('renders the three product-funnel stages with counts', () => {
    render(<PurchaseFunnel events={events} itemCategory="discovery-flight" />);
    expect(screen.getByText(/Viewed Product/i)).toBeInTheDocument();
    expect(screen.getByText(/Started Checkout/i)).toBeInTheDocument();
    expect(screen.getByText(/Purchased/i)).toBeInTheDocument();
    // Visits is intentionally NOT shown — most site visitors aren't here for a discovery flight
    expect(screen.queryByText(/^Visits$/i)).toBeNull();
  });

  it('renders the £ AOV and Revenue alongside the funnel', () => {
    render(<PurchaseFunnel events={events} itemCategory="discovery-flight" />);
    expect(screen.getByText(/AOV/i)).toBeInTheDocument();
    expect(screen.getByText(/Revenue/i)).toBeInTheDocument();
    // Both AOV and Revenue display £350 for this single-purchase fixture
    const matches = screen.getAllByText(/£350/);
    expect(matches.length).toBe(2);
  });

  it('shows an empty state when no events match', () => {
    render(<PurchaseFunnel events={[]} itemCategory="discovery-flight" />);
    expect(screen.getByText(/Awaiting first purchase/i)).toBeInTheDocument();
  });
});

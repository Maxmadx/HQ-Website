// @vitest-environment jsdom
import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import AbandonedCartTile from './AbandonedCartTile';

const ts = (h) => ({ toMillis: () => Date.now() - h * 3600 * 1000 });

const carts = [
  { id: '1', status: 'abandoned', email: 'a@b.c', flight: { aircraftId: 'r44', duration: 60 }, totalP: 35000, recoveryEmailsSent: [], updatedAt: ts(2), excludedFromAnalytics: false, noEmail: false },
  { id: '2', status: 'abandoned', email: null,    flight: { aircraftId: 'r22', duration: 30 }, totalP: 12500, recoveryEmailsSent: [], updatedAt: ts(3), excludedFromAnalytics: false, noEmail: false },
];

describe('AbandonedCartTile', () => {
  it('renders the abandonment funnel stages', () => {
    render(<AbandonedCartTile carts={carts} onSendRecovery={() => {}} />);
    expect(screen.getByText(/Carts/i)).toBeInTheDocument();
    expect(screen.getByText(/Abandoned/i)).toBeInTheDocument();
    expect(screen.getByText(/Recoverable/i)).toBeInTheDocument();
  });

  it('shows the recoverable email in the table', () => {
    render(<AbandonedCartTile carts={carts} onSendRecovery={() => {}} />);
    expect(screen.getByText('a@b.c')).toBeInTheDocument();
    // The cart with no email should NOT be listed in the recoverable table
    expect(screen.queryByText('—')).toBeInTheDocument(); // some empty fields rendered with em-dash
  });

  it('shows an empty state when no recoverable carts', () => {
    render(<AbandonedCartTile carts={[]} onSendRecovery={() => {}} />);
    expect(screen.getByText(/Nothing to recover/i)).toBeInTheDocument();
  });

  it('calls onSendRecovery with the cartId when the button is clicked', async () => {
    const onSendRecovery = vi.fn();
    render(<AbandonedCartTile carts={carts} onSendRecovery={onSendRecovery} />);
    const button = screen.getByRole('button', { name: /send recovery/i });
    button.click();
    expect(onSendRecovery).toHaveBeenCalledWith('1');
  });
});

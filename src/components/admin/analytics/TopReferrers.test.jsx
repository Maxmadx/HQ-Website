// @vitest-environment jsdom
import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import TopReferrers from './TopReferrers';

const friendBookings = [
  { paymentIntentId: 'pi_1', referredByCode: 'CODEAAAA', amountPence: 35000, createdAt: 1700000000000 },
  { paymentIntentId: 'pi_2', referredByCode: 'CODEAAAA', amountPence: 20000, createdAt: 1700100000000 },
];
const referrers = { CODEAAAA: { name: 'Jane Doe', email: 'jane@example.com' } };

describe('TopReferrers', () => {
  it('renders a referrer row with name, count and revenue', () => {
    render(<TopReferrers friendBookings={friendBookings} referrers={referrers} />);
    expect(screen.getByText('Jane Doe')).toBeInTheDocument();
    expect(screen.getByText('jane@example.com')).toBeInTheDocument();
    expect(screen.getByText('2')).toBeInTheDocument();
    expect(screen.getByText('£550')).toBeInTheDocument();
  });

  it('falls back to the code when the referrer name is unknown', () => {
    render(<TopReferrers friendBookings={friendBookings} referrers={{}} />);
    expect(screen.getByText(/Unknown \(CODEAAAA\)/i)).toBeInTheDocument();
  });

  it('shows an empty state when there are no referrals', () => {
    render(<TopReferrers friendBookings={[]} referrers={{}} />);
    expect(screen.getByText(/No completed referrals/i)).toBeInTheDocument();
  });
});

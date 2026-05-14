// @vitest-environment jsdom
import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import ReferralFunnel from './ReferralFunnel';

const pageEvents = [
  { eventType: 'pageview', page: '/booking-confirmed', sessionId: 's1' },
  { eventType: 'share_referral', sessionId: 's1' },
  { eventType: 'pageview', page: '/training/trial-lessons', sessionId: 's2', referralRefCode: 'AB3K9XQ7' },
];
const friendBookings = [
  { paymentIntentId: 'pi_1', referredByCode: 'AB3K9XQ7', amountPence: 35000, createdAt: 1000 },
];

describe('ReferralFunnel', () => {
  it('renders the four referral funnel stages', () => {
    render(<ReferralFunnel pageEvents={pageEvents} friendBookings={friendBookings} />);
    expect(screen.getByText(/Confirmation Viewed/i)).toBeInTheDocument();
    expect(screen.getByText(/Share Clicked/i)).toBeInTheDocument();
    expect(screen.getByText(/Friend Arrived/i)).toBeInTheDocument();
    expect(screen.getByText(/Friend Booked/i)).toBeInTheDocument();
  });

  it('shows an empty state when there is no referral activity', () => {
    render(<ReferralFunnel pageEvents={[]} friendBookings={[]} />);
    expect(screen.getByText(/No referral activity/i)).toBeInTheDocument();
  });
});

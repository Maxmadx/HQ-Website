import { describe, it, expect } from 'vitest';
import { computeReferralFunnel, computeTopReferrers } from './referralAggregations';

describe('computeReferralFunnel', () => {
  it('counts unique sessions at each stage', () => {
    const pageEvents = [
      { eventType: 'pageview', page: '/booking-confirmed', sessionId: 's1' },
      { eventType: 'pageview', page: '/booking-confirmed?ref=pi_x', sessionId: 's2' },
      { eventType: 'pageview', page: '/', sessionId: 's3' },
      { eventType: 'share_referral', sessionId: 's1' },
      { eventType: 'share_referral', sessionId: 's1' }, // same session, counts once
      { eventType: 'pageview', page: '/training/trial-lessons', sessionId: 's4', referralRefCode: 'AB3K9XQ7' },
      { eventType: 'scroll_depth', sessionId: 's4', referralRefCode: 'AB3K9XQ7' },
    ];
    const friendBookings = [
      { paymentIntentId: 'pi_1', referredByCode: 'AB3K9XQ7', amountPence: 35000, createdAt: 1000 },
    ];

    expect(computeReferralFunnel(pageEvents, friendBookings)).toEqual({
      confirmationsViewed: 2,
      shareClicked: 1,
      friendArrived: 1,
      friendBooked: 1,
    });
  });

  it('returns all-zero on empty input', () => {
    expect(computeReferralFunnel([], [])).toEqual({
      confirmationsViewed: 0,
      shareClicked: 0,
      friendArrived: 0,
      friendBooked: 0,
    });
  });

  it('ignores events with no sessionId', () => {
    const pageEvents = [
      { eventType: 'share_referral' },
      { eventType: 'pageview', page: '/booking-confirmed' },
    ];
    expect(computeReferralFunnel(pageEvents, [])).toMatchObject({
      confirmationsViewed: 0,
      shareClicked: 0,
    });
  });
});

describe('computeTopReferrers', () => {
  it('groups friend bookings by code with name join, sorted by count then revenue', () => {
    const friendBookings = [
      { paymentIntentId: 'pi_1', referredByCode: 'CODEAAAA', amountPence: 35000, createdAt: 2000 },
      { paymentIntentId: 'pi_2', referredByCode: 'CODEAAAA', amountPence: 20000, createdAt: 5000 },
      { paymentIntentId: 'pi_3', referredByCode: 'CODEBBBB', amountPence: 99000, createdAt: 3000 },
    ];
    const referrers = {
      CODEAAAA: { name: 'Jane Doe', email: 'jane@example.com' },
      CODEBBBB: { name: 'John Smith', email: 'john@example.com' },
    };

    const result = computeTopReferrers(friendBookings, referrers);
    expect(result).toHaveLength(2);
    expect(result[0]).toEqual({
      code: 'CODEAAAA',
      name: 'Jane Doe',
      email: 'jane@example.com',
      bookingsReferred: 2,
      revenuePence: 55000,
      lastBookingAt: 5000,
    });
    expect(result[1].code).toBe('CODEBBBB');
  });

  it('falls back to empty name/email when referrer not resolved', () => {
    const result = computeTopReferrers(
      [{ paymentIntentId: 'pi_1', referredByCode: 'CODEAAAA', amountPence: 1000, createdAt: 1 }],
      {}
    );
    expect(result[0]).toMatchObject({ code: 'CODEAAAA', name: '', email: '' });
  });

  it('returns empty array on no friend bookings', () => {
    expect(computeTopReferrers([], {})).toEqual([]);
  });
});

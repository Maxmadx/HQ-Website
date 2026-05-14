/**
 * Pure aggregation functions for the referral dashboard tiles.
 * Inputs are plain arrays/objects already fetched by the caller — no Firestore
 * access here, so everything is unit-testable with fixtures.
 *
 * Two data sources feed these:
 *  - page_events  (client-side Firestore query in AdminAnalytics)
 *  - /api/analytics/referrals  → { friendBookings, referrers }
 */

const CONFIRMATION_PATH = '/booking-confirmed';

/**
 * Four-stage referral funnel. Stages 1–2 are the referrer's journey, stages 3–4
 * the referred friend's — it's a flow, not a strict nested subset, so a later
 * stage can in principle exceed an earlier one.
 *
 *  1. Confirmations viewed — unique sessions that saw /booking-confirmed
 *  2. Share clicked        — unique sessions that used a share affordance
 *  3. Friend arrived       — unique sessions that landed with a ?ref code
 *  4. Friend booked        — bookings that used a referral code
 */
export function computeReferralFunnel(pageEvents = [], friendBookings = []) {
  const confirmations = new Set();
  const sharers = new Set();
  const arrivals = new Set();

  for (const ev of pageEvents) {
    if (!ev) continue;
    if (ev.eventType === 'pageview' && (ev.page || '').startsWith(CONFIRMATION_PATH) && ev.sessionId) {
      confirmations.add(ev.sessionId);
    }
    if (ev.eventType === 'share_referral' && ev.sessionId) {
      sharers.add(ev.sessionId);
    }
    if (ev.referralRefCode && ev.sessionId) {
      arrivals.add(ev.sessionId);
    }
  }

  return {
    confirmationsViewed: confirmations.size,
    shareClicked: sharers.size,
    friendArrived: arrivals.size,
    friendBooked: friendBookings.length,
  };
}

/**
 * Per-referrer leaderboard: who referred friends, how many, and how much revenue
 * those friend-bookings brought in. Sorted by bookings referred, then revenue.
 */
export function computeTopReferrers(friendBookings = [], referrers = {}) {
  const byCode = new Map();

  for (const fb of friendBookings) {
    if (!fb || !fb.referredByCode) continue;
    const code = fb.referredByCode;
    if (!byCode.has(code)) {
      byCode.set(code, { code, bookingsReferred: 0, revenuePence: 0, lastBookingAt: null });
    }
    const row = byCode.get(code);
    row.bookingsReferred += 1;
    row.revenuePence += typeof fb.amountPence === 'number' ? fb.amountPence : 0;
    if (typeof fb.createdAt === 'number' && (row.lastBookingAt === null || fb.createdAt > row.lastBookingAt)) {
      row.lastBookingAt = fb.createdAt;
    }
  }

  return Array.from(byCode.values())
    .map((row) => {
      const meta = referrers[row.code] || {};
      return {
        ...row,
        name: meta.name || '',
        email: meta.email || '',
      };
    })
    .sort((a, b) => b.bookingsReferred - a.bookingsReferred || b.revenuePence - a.revenuePence);
}

import { describe, it, expect } from 'vitest';
import { computeCartFunnel, recoverableCarts } from './cartAggregations';

const ts = (hoursAgo) => ({ toMillis: () => Date.now() - hoursAgo * 3600 * 1000 });

const fixture = [
  // recoverable: abandoned, has email, not contacted
  { id: '1', status: 'abandoned', email: 'a@b.c', noEmail: false, totalP: 35000, contactedAt: null, updatedAt: ts(2), excludedFromAnalytics: false },
  // recoverable: abandoned, has email, contacted
  { id: '2', status: 'abandoned', email: 'd@e.f', noEmail: false, totalP: 18000, contactedAt: ts(1), updatedAt: ts(1), excludedFromAnalytics: false },
  // not recoverable — no email
  { id: '3', status: 'abandoned', email: null, noEmail: false, totalP: 35000, contactedAt: null, updatedAt: ts(3), excludedFromAnalytics: false },
  // unsubscribed — not recoverable
  { id: '4', status: 'abandoned', email: 'x@y.z', noEmail: true, totalP: 35000, contactedAt: null, updatedAt: ts(4), excludedFromAnalytics: false },
  // recovered — completed AND contacted
  { id: '5', status: 'completed', email: 'r@e.c', noEmail: false, totalP: 35000, contactedAt: ts(5), updatedAt: ts(4), excludedFromAnalytics: false },
  // recoverable: active with email (NEW — active email carts are now recoverable)
  { id: '6', status: 'active', email: 'n@o.p', noEmail: false, totalP: 35000, contactedAt: null, updatedAt: ts(0.1), excludedFromAnalytics: false },
  // admin-excluded — filtered out of every count
  { id: '7', status: 'abandoned', email: 'admin@hq.co', noEmail: false, totalP: 35000, contactedAt: null, updatedAt: ts(2), excludedFromAnalytics: true },
];

describe('computeCartFunnel', () => {
  it('counts carts at each stage of the funnel', () => {
    const out = computeCartFunnel(fixture);
    expect(out.totalCarts).toBe(6);    // excludes id 7 (admin)
    expect(out.abandoned).toBe(4);     // ids 1,2,3,4 (abandoned status; not 5 completed, not 6 active)
    expect(out.recoverable).toBe(3);   // ids 1,2,6 (non-completed + usable email)
    expect(out.contacted).toBe(1);     // id 2 (recoverable + contactedAt)
    expect(out.recovered).toBe(1);     // id 5 (completed + contactedAt)
  });

  it('includes £ totals at each stage', () => {
    const out = computeCartFunnel(fixture);
    // 1:35k + 2:18k + 3:35k + 4:35k + 5:35k + 6:35k = 193000 (id 7 admin excluded)
    expect(out.totalValueP).toBe(193000);
    expect(out.recoverableValueP).toBe(88000); // 35k + 18k + 35k
    expect(out.abandonedValueP).toBe(123000); // ids 1,2,3,4 = 35k+18k+35k+35k
  });

  it('returns zeros for an empty list', () => {
    expect(computeCartFunnel([])).toEqual({
      totalCarts: 0, abandoned: 0, recoverable: 0, contacted: 0, recovered: 0,
      totalValueP: 0, abandonedValueP: 0, recoverableValueP: 0,
    });
  });

  it('does NOT count checkout_initiated as abandoned, but DOES count it as recoverable', () => {
    const carts = [
      { id: 'a', status: 'checkout_initiated', email: 'p@q.r', noEmail: false, totalP: 35000, contactedAt: null, excludedFromAnalytics: false },
      { id: 'b', status: 'abandoned', email: 's@t.u', noEmail: false, totalP: 35000, contactedAt: null, excludedFromAnalytics: false },
    ];
    const out = computeCartFunnel(carts);
    expect(out.totalCarts).toBe(2);
    expect(out.abandoned).toBe(1);     // only the genuinely abandoned one
    expect(out.recoverable).toBe(2);   // both have an email and neither is completed
  });
});

describe('recoverableCarts', () => {
  it('returns every non-completed cart with email + no unsubscribe + not admin-excluded', () => {
    const rows = recoverableCarts(fixture);
    expect(rows.map((c) => c.id).sort()).toEqual(['1', '2', '6']);
  });

  it('orders by updatedAt descending (most recent first)', () => {
    const rows = recoverableCarts(fixture);
    expect(rows.map((c) => c.id)).toEqual(['6', '2', '1']); // 0.1h, 1h, 2h ago
  });
});

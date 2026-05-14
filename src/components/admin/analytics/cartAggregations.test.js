import { describe, it, expect } from 'vitest';
import { computeCartFunnel, recoverableCarts } from './cartAggregations';

const ts = (hoursAgo) => ({ toMillis: () => Date.now() - hoursAgo * 3600 * 1000 });

const fixture = [
  // recoverable, has email, no recovery sent
  { id: '1', status: 'abandoned', email: 'a@b.c', noEmail: false, totalP: 35000, recoveryEmailsSent: [], updatedAt: ts(2), excludedFromAnalytics: false },
  // recoverable, has email, one recovery sent already
  { id: '2', status: 'abandoned', email: 'd@e.f', noEmail: false, totalP: 18000, recoveryEmailsSent: [{ at: ts(1), type: 'manual' }], updatedAt: ts(1), excludedFromAnalytics: false },
  // not recoverable — no email
  { id: '3', status: 'abandoned', email: null,    noEmail: false, totalP: 35000, recoveryEmailsSent: [], updatedAt: ts(3), excludedFromAnalytics: false },
  // unsubscribed — not recoverable
  { id: '4', status: 'abandoned', email: 'x@y.z', noEmail: true,  totalP: 35000, recoveryEmailsSent: [], updatedAt: ts(4), excludedFromAnalytics: false },
  // recovered — abandoned then completed AFTER an email was sent
  { id: '5', status: 'completed', email: 'r@e.c', noEmail: false, totalP: 35000, recoveryEmailsSent: [{ at: ts(5), type: 'manual' }], abandonedAt: ts(6), completedAt: ts(4), excludedFromAnalytics: false },
  // active (still in checkout) — not abandoned
  { id: '6', status: 'active',    email: 'n@o.p', noEmail: false, totalP: 35000, recoveryEmailsSent: [], updatedAt: ts(0.1), excludedFromAnalytics: false },
  // admin-excluded — must be filtered out of all counts
  { id: '7', status: 'abandoned', email: 'admin@hq.co', noEmail: false, totalP: 35000, recoveryEmailsSent: [], updatedAt: ts(2), excludedFromAnalytics: true },
];

describe('computeCartFunnel', () => {
  it('counts carts at each stage of the abandonment funnel', () => {
    const out = computeCartFunnel(fixture);
    expect(out.totalCarts).toBe(6);          // excludes id 7 (admin)
    expect(out.abandoned).toBe(4);           // ids 1, 2, 3, 4 (NOT 5 since it completed, NOT 6 active)
    expect(out.recoverable).toBe(2);         // ids 1, 2 (have email + not noEmail + not completed)
    expect(out.emailed).toBe(1);             // id 2 has a recovery sent
    expect(out.recovered).toBe(1);           // id 5 (recoveryEmailsSent.length > 0 AND status === completed)
  });

  it('includes £ totals at each stage', () => {
    const out = computeCartFunnel(fixture);
    // 1:35k + 2:18k + 3:35k + 4:35k + 5:35k + 6:35k = 193000  (id 7 admin excluded)
    expect(out.totalValueP).toBe(193000);
    expect(out.recoverableValueP).toBe(53000); // 35k + 18k
  });

  it('returns zeros for an empty list', () => {
    expect(computeCartFunnel([])).toEqual({
      totalCarts: 0, abandoned: 0, recoverable: 0, emailed: 0, recovered: 0,
      totalValueP: 0, abandonedValueP: 0, recoverableValueP: 0,
    });
  });

  it('does NOT count checkout_initiated as abandoned (user may still be paying)', () => {
    const carts = [
      { id: 'a', status: 'checkout_initiated', email: 'p@q.r', noEmail: false, totalP: 35000, recoveryEmailsSent: [], excludedFromAnalytics: false },
      { id: 'b', status: 'abandoned', email: 's@t.u', noEmail: false, totalP: 35000, recoveryEmailsSent: [], excludedFromAnalytics: false },
    ];
    const out = computeCartFunnel(carts);
    expect(out.totalCarts).toBe(2);    // both still counted in the total
    expect(out.abandoned).toBe(1);     // only the genuinely abandoned one
    expect(out.recoverable).toBe(1);
  });
});

describe('recoverableCarts', () => {
  it('returns abandoned carts with email + no unsubscribe + not admin-excluded', () => {
    const rows = recoverableCarts(fixture);
    expect(rows.map((c) => c.id).sort()).toEqual(['1', '2']);
  });

  it('orders by updatedAt descending (most recent first)', () => {
    const rows = recoverableCarts(fixture);
    expect(rows[0].id).toBe('2'); // updatedAt 1h ago vs id 1 at 2h ago
    expect(rows[1].id).toBe('1');
  });
});

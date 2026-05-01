import { describe, it, expect } from 'vitest';
import { computeRecoveryActions } from './cartRecoveryActions.js';

const tsHoursAgo = (now, h) => ({ toMillis: () => now.getTime() - h * 3600 * 1000 });
const tsDaysAgo = (now, d) => tsHoursAgo(now, d * 24);

// Pick a noon UTC weekday so quiet-hours don't interfere with the test cases (12:00 UTC = 13:00 BST in May, well inside the awake window)
const NOW = new Date('2026-05-15T12:00:00Z');

describe('computeRecoveryActions', () => {
  it('marks active carts as abandoned after 1h idle', () => {
    const carts = [{
      id: 'a', status: 'active', email: 'x@y.z', noEmail: false,
      recoveryEmailsSent: [], updatedAt: tsHoursAgo(NOW, 1.5), excludedFromAnalytics: false,
    }];
    const actions = computeRecoveryActions(carts, NOW);
    expect(actions).toContainEqual({ cartId: 'a', action: 'mark_abandoned' });
  });

  it('does NOT mark active carts as abandoned before 1h', () => {
    const carts = [{
      id: 'a', status: 'active', email: 'x@y.z', noEmail: false,
      recoveryEmailsSent: [], updatedAt: tsHoursAgo(NOW, 0.5), excludedFromAnalytics: false,
    }];
    expect(computeRecoveryActions(carts, NOW)).toEqual([]);
  });

  it('queues 1h email for an abandoned cart with email + no recovery sent', () => {
    const carts = [{
      id: 'b', status: 'abandoned', email: 'x@y.z', noEmail: false,
      recoveryEmailsSent: [], updatedAt: tsHoursAgo(NOW, 2), excludedFromAnalytics: false,
    }];
    const actions = computeRecoveryActions(carts, NOW);
    expect(actions).toContainEqual({ cartId: 'b', action: 'send_1h' });
  });

  it('does NOT queue 1h email if cart has noEmail or no email', () => {
    const carts = [
      { id: 'c1', status: 'abandoned', email: null,    noEmail: false, recoveryEmailsSent: [], updatedAt: tsHoursAgo(NOW, 2), excludedFromAnalytics: false },
      { id: 'c2', status: 'abandoned', email: 'x@y.z', noEmail: true,  recoveryEmailsSent: [], updatedAt: tsHoursAgo(NOW, 2), excludedFromAnalytics: false },
    ];
    expect(computeRecoveryActions(carts, NOW)).toEqual([]);
  });

  it('queues 24h email when 1h email was sent at least 24h ago', () => {
    const carts = [{
      id: 'd', status: 'abandoned', email: 'x@y.z', noEmail: false,
      recoveryEmailsSent: [{ at: tsHoursAgo(NOW, 25), type: '1h', opened: true, clicked: false }],
      updatedAt: tsHoursAgo(NOW, 25), excludedFromAnalytics: false,
    }];
    const actions = computeRecoveryActions(carts, NOW);
    expect(actions).toContainEqual({ cartId: 'd', action: 'send_24h' });
  });

  it('does NOT queue 24h email before 24h has passed', () => {
    const carts = [{
      id: 'd', status: 'abandoned', email: 'x@y.z', noEmail: false,
      recoveryEmailsSent: [{ at: tsHoursAgo(NOW, 23), type: '1h' }],
      updatedAt: tsHoursAgo(NOW, 23), excludedFromAnalytics: false,
    }];
    expect(computeRecoveryActions(carts, NOW)).toEqual([]);
  });

  it('does NOT queue a third email after 24h was sent', () => {
    const carts = [{
      id: 'e', status: 'abandoned', email: 'x@y.z', noEmail: false,
      recoveryEmailsSent: [
        { at: tsHoursAgo(NOW, 50), type: '1h' },
        { at: tsHoursAgo(NOW, 25), type: '24h' },
      ],
      updatedAt: tsHoursAgo(NOW, 25), excludedFromAnalytics: false,
    }];
    expect(computeRecoveryActions(carts, NOW)).toEqual([]);
  });

  it('marks abandoned cart as expired after 7 days', () => {
    const carts = [{
      id: 'f', status: 'abandoned', email: 'x@y.z', noEmail: false,
      recoveryEmailsSent: [{ at: tsDaysAgo(NOW, 6), type: '24h' }],
      updatedAt: tsDaysAgo(NOW, 7.5), excludedFromAnalytics: false,
    }];
    const actions = computeRecoveryActions(carts, NOW);
    expect(actions).toContainEqual({ cartId: 'f', action: 'mark_expired' });
  });

  it('queues prune for completed/expired carts older than 90 days', () => {
    const carts = [
      { id: 'g1', status: 'completed', updatedAt: tsDaysAgo(NOW, 100), excludedFromAnalytics: false, email: 'a@b.c', noEmail: false, recoveryEmailsSent: [] },
      { id: 'g2', status: 'expired',   updatedAt: tsDaysAgo(NOW, 100), excludedFromAnalytics: false, email: 'a@b.c', noEmail: false, recoveryEmailsSent: [] },
    ];
    const actions = computeRecoveryActions(carts, NOW);
    expect(actions.filter((a) => a.action === 'prune').map((a) => a.cartId).sort()).toEqual(['g1', 'g2']);
  });

  it('does NOT prune completed/expired carts younger than 90 days', () => {
    const carts = [{ id: 'h', status: 'completed', updatedAt: tsDaysAgo(NOW, 30), excludedFromAnalytics: false, email: 'a@b.c', noEmail: false, recoveryEmailsSent: [] }];
    expect(computeRecoveryActions(carts, NOW)).toEqual([]);
  });

  it('skips excluded-from-analytics carts entirely', () => {
    const carts = [{
      id: 'i', status: 'abandoned', email: 'admin@hq.co', noEmail: false,
      recoveryEmailsSent: [], updatedAt: tsHoursAgo(NOW, 2), excludedFromAnalytics: true,
    }];
    expect(computeRecoveryActions(carts, NOW)).toEqual([]);
  });

  it('caps the number of email actions per tick (default 50)', () => {
    const carts = [];
    for (let i = 0; i < 80; i += 1) {
      carts.push({
        id: `bulk-${i}`, status: 'abandoned', email: `u${i}@x.com`, noEmail: false,
        recoveryEmailsSent: [], updatedAt: tsHoursAgo(NOW, 2), excludedFromAnalytics: false,
      });
    }
    const actions = computeRecoveryActions(carts, NOW);
    const sends = actions.filter((a) => a.action === 'send_1h' || a.action === 'send_24h');
    expect(sends.length).toBeLessThanOrEqual(50);
  });
});

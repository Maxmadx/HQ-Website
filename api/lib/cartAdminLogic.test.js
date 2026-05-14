import { describe, it, expect } from 'vitest';
import { ADMIN_SETTABLE_STATUSES, isAdminSettableStatus } from './cartAdminLogic.js';

describe('isAdminSettableStatus', () => {
  it('accepts every status an admin may set manually', () => {
    expect(isAdminSettableStatus('active')).toBe(true);
    expect(isAdminSettableStatus('abandoned')).toBe(true);
    expect(isAdminSettableStatus('expired')).toBe(true);
    expect(isAdminSettableStatus('completed')).toBe(true);
  });

  it('rejects anything else', () => {
    expect(isAdminSettableStatus('checkout_initiated')).toBe(false);
    expect(isAdminSettableStatus('banana')).toBe(false);
    expect(isAdminSettableStatus('')).toBe(false);
    expect(isAdminSettableStatus(undefined)).toBe(false);
    expect(isAdminSettableStatus(null)).toBe(false);
  });

  it('exposes the allowed list', () => {
    expect(ADMIN_SETTABLE_STATUSES).toEqual(['active', 'abandoned', 'expired', 'completed']);
  });
});

import { describe, it, expect } from 'vitest';
import { truncateIp } from './ipTruncate.js';

describe('truncateIp', () => {
  it('truncates IPv4 to /24', () => {
    expect(truncateIp('81.111.222.123')).toBe('81.111.222.0');
    expect(truncateIp('1.2.3.4')).toBe('1.2.3.0');
  });

  it('truncates IPv4-mapped IPv6 down to IPv4 /24', () => {
    expect(truncateIp('::ffff:81.111.222.123')).toBe('81.111.222.0');
  });

  it('truncates IPv6 to /48', () => {
    expect(truncateIp('2001:0db8:85a3:0000:0000:8a2e:0370:7334')).toBe('2001:db8:85a3::');
  });

  it('truncates compressed IPv6 to /48', () => {
    expect(truncateIp('2001:db8::1')).toBe('2001:db8:0::');
    expect(truncateIp('2606:4700:4700::1111')).toBe('2606:4700:4700::');
  });

  it('returns null for empty or non-string input', () => {
    expect(truncateIp(null)).toBeNull();
    expect(truncateIp(undefined)).toBeNull();
    expect(truncateIp('')).toBeNull();
    expect(truncateIp('   ')).toBeNull();
    expect(truncateIp(12345)).toBeNull();
  });

  it('returns null for malformed addresses', () => {
    expect(truncateIp('999.1.1.1')).toBeNull();
    expect(truncateIp('1.2.3')).toBeNull();
    expect(truncateIp('not-an-ip')).toBeNull();
    expect(truncateIp('2001:db8::1::2')).toBeNull();
  });
});

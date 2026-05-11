import { describe, it, expect } from 'vitest';
import { generateReferralCode, REFERRAL_CODE_ALPHABET } from './referralCodes';

describe('generateReferralCode', () => {
  it('returns 8 uppercase characters from the safe alphabet', () => {
    for (let i = 0; i < 100; i++) {
      const code = generateReferralCode();
      expect(code).toMatch(/^[A-Z0-9]{8}$/);
      for (const ch of code) {
        expect(REFERRAL_CODE_ALPHABET).toContain(ch);
      }
    }
  });

  it('omits visually ambiguous characters I, O, 0, 1', () => {
    expect(REFERRAL_CODE_ALPHABET).not.toContain('I');
    expect(REFERRAL_CODE_ALPHABET).not.toContain('O');
    expect(REFERRAL_CODE_ALPHABET).not.toContain('0');
    expect(REFERRAL_CODE_ALPHABET).not.toContain('1');
  });

  it('returns sufficiently varied codes across many calls (probabilistic)', () => {
    const seen = new Set();
    for (let i = 0; i < 500; i++) seen.add(generateReferralCode());
    expect(seen.size).toBeGreaterThan(490); // ~500 with no collisions on 32^8 space
  });
});

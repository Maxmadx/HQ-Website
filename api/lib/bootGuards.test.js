import { describe, it, expect } from 'vitest';
import { assertProductionStripeKey } from './bootGuards.js';

describe('assertProductionStripeKey', () => {
  it('passes when production env uses live secret key', () => {
    expect(() => assertProductionStripeKey({
      NODE_ENV: 'production',
      STRIPE_SECRET_KEY: 'sk_live_abc',
      STRIPE_WEBHOOK_SECRET: 'whsec_def',
    })).not.toThrow();
  });

  it('throws when production env uses test secret key', () => {
    expect(() => assertProductionStripeKey({
      NODE_ENV: 'production',
      STRIPE_SECRET_KEY: 'sk_test_abc',
      STRIPE_WEBHOOK_SECRET: 'whsec_def',
    })).toThrow(/test mode Stripe key/);
  });

  it('throws when production webhook secret has wrong prefix', () => {
    expect(() => assertProductionStripeKey({
      NODE_ENV: 'production',
      STRIPE_SECRET_KEY: 'sk_live_abc',
      STRIPE_WEBHOOK_SECRET: 'not_a_real_secret',
    })).toThrow(/STRIPE_WEBHOOK_SECRET/);
  });

  it('does not throw outside production', () => {
    expect(() => assertProductionStripeKey({
      NODE_ENV: 'development',
      STRIPE_SECRET_KEY: 'sk_test_abc',
      STRIPE_WEBHOOK_SECRET: 'whsec_def',
    })).not.toThrow();
  });

  it('does not throw when env is test', () => {
    expect(() => assertProductionStripeKey({
      NODE_ENV: 'test',
      STRIPE_SECRET_KEY: 'sk_test_abc',
      STRIPE_WEBHOOK_SECRET: 'whsec_def',
    })).not.toThrow();
  });

  it('throws in production when STRIPE_SECRET_KEY is absent', () => {
    expect(() => assertProductionStripeKey({
      NODE_ENV: 'production',
      STRIPE_SECRET_KEY: undefined,
      STRIPE_WEBHOOK_SECRET: 'whsec_def',
    })).toThrow(/STRIPE_SECRET_KEY/);
  });

  it('throws in production when STRIPE_WEBHOOK_SECRET is absent', () => {
    expect(() => assertProductionStripeKey({
      NODE_ENV: 'production',
      STRIPE_SECRET_KEY: 'sk_live_abc',
      STRIPE_WEBHOOK_SECRET: undefined,
    })).toThrow(/STRIPE_WEBHOOK_SECRET/);
  });

  it('returns an empty array when production keys are valid', () => {
    expect(assertProductionStripeKey({
      NODE_ENV: 'production',
      STRIPE_SECRET_KEY: 'sk_live_abc',
      STRIPE_WEBHOOK_SECRET: 'whsec_def',
    })).toEqual([]);
  });

  it('escape hatch: returns warnings instead of throwing when ALLOW_TEST_STRIPE_IN_PROD=true', () => {
    const warnings = assertProductionStripeKey({
      NODE_ENV: 'production',
      STRIPE_SECRET_KEY: 'sk_test_abc',
      STRIPE_WEBHOOK_SECRET: 'whsec_def',
      ALLOW_TEST_STRIPE_IN_PROD: 'true',
    });
    expect(warnings).toHaveLength(1);
    expect(warnings[0]).toMatch(/ALLOW_TEST_STRIPE_IN_PROD override active/);
    expect(warnings[0]).toMatch(/test mode Stripe key/);
  });

  it('escape hatch only triggers on the exact string "true"', () => {
    expect(() => assertProductionStripeKey({
      NODE_ENV: 'production',
      STRIPE_SECRET_KEY: 'sk_test_abc',
      STRIPE_WEBHOOK_SECRET: 'whsec_def',
      ALLOW_TEST_STRIPE_IN_PROD: '1',
    })).toThrow(/Refusing to start/);
  });
});

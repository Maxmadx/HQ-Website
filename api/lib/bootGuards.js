'use strict';

/**
 * Validates Stripe key configuration at boot.
 *
 * In production, refuses to start with test-mode keys — running prod on test
 * keys causes silent payment failures, and a non-whsec_ webhook secret means
 * forged payment events could be accepted as legitimate.
 *
 * Escape hatch: set ALLOW_TEST_STRIPE_IN_PROD=true to DOWNGRADE the fatal
 * error to returned warnings. Intended only for a deliberate test-payment
 * soft-launch — i.e. the site is knowingly not taking real payments yet.
 * The caller MUST log the returned warnings loudly on every boot so the
 * test-mode state is never silent.
 *
 * Pure function — takes the env object so it's testable.
 *
 * @param {{NODE_ENV?: string, STRIPE_SECRET_KEY?: string, STRIPE_WEBHOOK_SECRET?: string, ALLOW_TEST_STRIPE_IN_PROD?: string}} env
 * @returns {string[]} warnings — empty when keys are valid (or not in
 *   production); populated (instead of throwing) when the escape hatch is
 *   active and keys are test-mode.
 * @throws {Error} when production has test/invalid keys and the escape hatch
 *   is not set.
 */
function assertProductionStripeKey(env) {
  if (env.NODE_ENV !== 'production') return [];

  const problems = [];

  if (!env.STRIPE_SECRET_KEY || !env.STRIPE_SECRET_KEY.startsWith('sk_live_')) {
    problems.push(
      'STRIPE_SECRET_KEY is a test mode Stripe key (expected prefix sk_live_) ' +
      '— real customer payments will fail silently.'
    );
  }

  if (!env.STRIPE_WEBHOOK_SECRET || !env.STRIPE_WEBHOOK_SECRET.startsWith('whsec_')) {
    problems.push(
      'STRIPE_WEBHOOK_SECRET does not have the expected whsec_ prefix — webhook ' +
      'signature verification would fail, allowing forged payment events to be ' +
      'accepted as legitimate.'
    );
  }

  if (problems.length === 0) return [];

  // Escape hatch — deliberate test-payment soft-launch. Downgrade to warnings
  // the caller is contractually required to log loudly.
  if (env.ALLOW_TEST_STRIPE_IN_PROD === 'true') {
    return problems.map(
      (p) => `[boot] ALLOW_TEST_STRIPE_IN_PROD override active — ${p}`
    );
  }

  throw new Error(
    'FATAL: NODE_ENV=production but Stripe keys are not live-mode:\n  - ' +
    problems.join('\n  - ') +
    '\nRefusing to start. Set ALLOW_TEST_STRIPE_IN_PROD=true to override ' +
    '(deliberate test-payment soft-launch only).'
  );
}

module.exports = { assertProductionStripeKey };

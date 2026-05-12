'use strict';

/**
 * Throws if NODE_ENV is 'production' and Stripe keys look like test-mode
 * credentials. Pure function — takes the env object so it's testable.
 *
 * @param {{NODE_ENV?: string, STRIPE_SECRET_KEY?: string, STRIPE_WEBHOOK_SECRET?: string}} env
 */
function assertProductionStripeKey(env) {
  if (env.NODE_ENV !== 'production') return;

  if (!env.STRIPE_SECRET_KEY || !env.STRIPE_SECRET_KEY.startsWith('sk_live_')) {
    throw new Error(
      'FATAL: NODE_ENV=production but STRIPE_SECRET_KEY is a test mode Stripe key ' +
      '(expected prefix sk_live_). Refusing to start — would cause silent ' +
      'payment failures.'
    );
  }

  if (!env.STRIPE_WEBHOOK_SECRET || !env.STRIPE_WEBHOOK_SECRET.startsWith('whsec_')) {
    throw new Error(
      'FATAL: NODE_ENV=production but STRIPE_WEBHOOK_SECRET does not have ' +
      'the expected whsec_ prefix. Refusing to start.'
    );
  }
}

module.exports = { assertProductionStripeKey };

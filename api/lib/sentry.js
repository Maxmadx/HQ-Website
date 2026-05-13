'use strict';

const Sentry = require('@sentry/node');

/**
 * Initialise Sentry for the Express server. No-op if SENTRY_DSN is not set.
 * @returns {boolean} true if Sentry was initialised, false otherwise
 */
function initSentry() {
  const dsn = process.env.SENTRY_DSN;
  if (!dsn) {
    return false;
  }

  Sentry.init({
    dsn,
    release: process.env.GIT_REV || 'unknown',
    environment: process.env.NODE_ENV || 'development',
    tracesSampleRate: 0.1,
    sendDefaultPii: false,
  });

  return true;
}

module.exports = { initSentry, Sentry };

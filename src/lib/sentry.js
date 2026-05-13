import * as Sentry from '@sentry/react';

/**
 * Initialise Sentry for the React SPA. No-op if VITE_SENTRY_DSN is not set.
 * @returns {boolean} true if Sentry was initialised, false otherwise
 */
export function initSentry() {
  const dsn = import.meta.env.VITE_SENTRY_DSN;
  if (!dsn) return false;

  Sentry.init({
    dsn,
    release: import.meta.env.VITE_GIT_REV || 'unknown',
    environment: import.meta.env.MODE,
    integrations: [
      Sentry.browserTracingIntegration(),
    ],
    tracesSampleRate: 0.1,
    sendDefaultPii: false,
  });

  return true;
}

export { Sentry };

import { describe, it, expect, afterEach } from 'vitest';
const { initSentry } = require('./sentry.js');

describe('initSentry', () => {
  const originalDsn = process.env.SENTRY_DSN;
  afterEach(() => {
    if (originalDsn === undefined) delete process.env.SENTRY_DSN;
    else process.env.SENTRY_DSN = originalDsn;
  });

  it('returns false when SENTRY_DSN is absent', () => {
    delete process.env.SENTRY_DSN;
    expect(initSentry()).toBe(false);
  });

  it('returns true when SENTRY_DSN is set', () => {
    process.env.SENTRY_DSN = 'https://x@o1.ingest.sentry.io/1';
    expect(initSentry()).toBe(true);
  });
});

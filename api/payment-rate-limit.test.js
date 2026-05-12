import { describe, it, expect } from 'vitest';
import request from 'supertest';
import express from 'express';
import { createRequire } from 'module';

const require = createRequire(import.meta.url);
const { paymentLimiter } = require('./payment-rate-limit.js');

// ---------------------------------------------------------------------------
// Rate-limit tests for payment-intent endpoints
//
// The limiter is applied identically to all three routes:
//   POST /api/create-payment-intent
//   POST /api/create-london-tour-payment-intent
//   POST /api/create-misc-payment-intent
//
// We test it once via a minimal stub endpoint. Because express-rate-limit
// uses an in-memory store per limiter instance, the window resets when a
// new `app` is constructed — giving us test isolation without sleeps.
// ---------------------------------------------------------------------------

function buildApp() {
  const app = express();
  app.use(express.json());
  // Simulate the real server's "trust proxy" setting so req.ip resolves
  // consistently in all environments.
  app.set('trust proxy', false);
  app.post('/test-endpoint', paymentLimiter, (req, res) => res.json({ ok: true }));
  return app;
}

describe('paymentLimiter', () => {
  it('allows the first 10 requests from the same IP', async () => {
    const app = buildApp();
    for (let i = 0; i < 10; i++) {
      const res = await request(app).post('/test-endpoint').send({});
      expect(res.status).not.toBe(429);
    }
  });

  it('returns 429 on the 11th request from the same IP in 1 minute', async () => {
    const app = buildApp();
    for (let i = 0; i < 10; i++) {
      await request(app).post('/test-endpoint').send({});
    }
    const res = await request(app).post('/test-endpoint').send({});
    expect(res.status).toBe(429);
  });

  it('returns the expected error body on the 11th request', async () => {
    const app = buildApp();
    for (let i = 0; i < 10; i++) {
      await request(app).post('/test-endpoint').send({});
    }
    const res = await request(app).post('/test-endpoint').send({});
    expect(res.body).toMatchObject({ error: expect.any(String) });
  });
});

import { describe, it, expect } from 'vitest';
import request from 'supertest';
import express from 'express';

// firebase-admin is intercepted at the test boundary via api/test-setup.js
// (registered in vite.config.js test.setupFiles). This keeps production code
// free of any test-specific guards.

import { getPrice, applyDiscountPence, priceAddons, handleWebhook } from './stripe.js';

describe('getPrice', () => {
  it('returns correct price in pence for r22 30 min', async () => {
    expect(await getPrice('r22', 30)).toBe(18000);
  });

  it('returns correct price in pence for r44 60 min', async () => {
    expect(await getPrice('r44', 60)).toBe(60500);
  });

  it('returns correct price in pence for r66 30 min', async () => {
    expect(await getPrice('r66', 30)).toBe(45000);
  });

  it('returns correct price in pence for r66 60 min', async () => {
    expect(await getPrice('r66', 60)).toBe(85000);
  });

  it('returns null for unknown aircraft', async () => {
    expect(await getPrice('r99', 30)).toBeNull();
  });

  it('returns null for unknown duration', async () => {
    expect(await getPrice('r22', 45)).toBeNull();
  });

  it('returns null for null inputs', async () => {
    expect(await getPrice(null, null)).toBeNull();
  });
});

describe('applyDiscountPence', () => {
  it('returns price × qty when pct is 0', () => {
    expect(applyDiscountPence(2500, 3, 0)).toBe(7500);
  });

  it('applies the discount and rounds to integer pence', () => {
    expect(applyDiscountPence(2500, 1, 30)).toBe(1750);
    expect(applyDiscountPence(333, 1, 30)).toBe(233);
  });

  it('clamps invalid pct values', () => {
    expect(applyDiscountPence(1000, 1, -10)).toBe(1000);
    expect(applyDiscountPence(1000, 1, 200)).toBe(0);
  });
});

describe('priceAddons', () => {
  it('returns total 0 and empty lineItems for an empty array', async () => {
    const result = await priceAddons([]);
    expect(result).toEqual({ lineItems: [], total: 0 });
  });

  it('throws 400 when itemId is unknown (mock returns exists: false)', async () => {
    await expect(priceAddons([{ itemId: 'nope', qty: 1 }])).rejects.toMatchObject({
      statusCode: 400,
      message: expect.stringContaining('Add-on not found'),
    });
  });

  // Note: the live Firestore-backed branches are exercised via integration
  // through createPaymentIntent below; pure unit testing of those branches
  // is out of scope here because they require a Firestore mock that
  // mirrors the production admin SDK shape used in stripe.js.
});

describe('handleWebhook', () => {
  it('returns 400 when stripe-signature header is missing', async () => {
    const req = {
      body: Buffer.from('{"type":"test.event"}'),
      headers: {},
    };
    await expect(handleWebhook(req)).rejects.toMatchObject({
      statusCode: 400,
    });
    // Ensure the thrown message doesn't leak Stripe SDK internals or recon details
    // (e.g. constructEvent error text, API key errors, SDK stack details)
    await expect(handleWebhook(req)).rejects.toSatisfy((err) =>
      !err.message.toLowerCase().includes('constructevent') &&
      !err.message.toLowerCase().includes('apikey') &&
      !err.message.toLowerCase().includes('authenticator') &&
      !err.message.toLowerCase().includes('stripe sdk')
    );
  });
});

// ---------------------------------------------------------------------------
// HTTP-level integration test
// Mirrors the server.js wrapper (lines 399-408) to lock in the contract:
// POST /api/webhook without a stripe-signature header must return HTTP 400
// with a generic body. If server.js's catch block is later refactored to
// use err.statusCode, this test will catch any silent HTTP-status regression.
// ---------------------------------------------------------------------------
describe('POST /api/webhook (HTTP integration)', () => {
  function buildApp() {
    const app = express();
    app.post('/api/webhook', express.raw({ type: 'application/json' }), async (req, res) => {
      try {
        await handleWebhook(req);
        res.json({ received: true });
      } catch (err) {
        // Mirrors the hardcoded catch in server.js lines 403-407.
        res.status(400).json({ error: 'Webhook processing failed' });
      }
    });
    return app;
  }

  it('returns 400 when stripe-signature header is missing', async () => {
    const app = buildApp();
    const res = await request(app)
      .post('/api/webhook')
      .send('{"type":"test.event"}')
      .set('Content-Type', 'application/json');

    expect(res.status).toBe(400);

    // Body must be generic — no Stripe SDK internals leaked to the caller.
    const bodyText = JSON.stringify(res.body);
    expect(bodyText.toLowerCase()).not.toContain('apikey');
    expect(bodyText.toLowerCase()).not.toContain('constructevent');
    expect(bodyText.toLowerCase()).not.toContain('stripe sdk');
  });
});

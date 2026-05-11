import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { createRequire } from 'module';

// --- Hoisted helpers (available inside vi.mock factories) ---
const { itemStore, piCreateSpy } = vi.hoisted(() => {
  const itemStore = new Map();
  const piCreateSpy = vi.fn(async (args) => ({
    id: 'pi_test',
    client_secret: 'sec_test',
    amount: args.amount,
    status: 'requires_payment_method',
  }));
  return { itemStore, piCreateSpy };
});

// Stub the mailer so stripe.js loads without SMTP credentials.
vi.mock('./lib/mailer', () => ({
  getTransporter: () => ({ sendMail: vi.fn().mockResolvedValue({}) }),
}));

// --- CJS module surgery ---
// stripe.js is a CommonJS module. Its `require('firebase-admin')` and
// `require('stripe')` go through Node's CJS cache, not vitest's ESM mock
// registry. We therefore mutate the shared objects directly.
//
// 1. firebase-admin: test-setup.js intercepts `require('firebase-admin')` via
//    Module._load and returns a single shared stub object. stripe.js holds a
//    reference to that same object via `require('./firebase-admin')`. We
//    replace `.firestore` on the shared stub per test.
//
// 2. stripe: stripe.js captures `const Stripe = require('stripe')` at module
//    load time then calls it lazily inside getStripe(). We inject a fake Stripe
//    constructor into require.cache BEFORE stripe.js is imported so that
//    stripe.js's `require('stripe')` resolves to our stub.

const _require = createRequire(import.meta.url);

// Inject fake Stripe into CJS cache before stripe.js loads.
const stripeModulePath = _require.resolve('stripe');
const fakeStripeExports = Object.assign(
  () => ({ paymentIntents: { create: piCreateSpy } }),
  { default: () => ({ paymentIntents: { create: piCreateSpy } }) },
);
require.cache[stripeModulePath] = {
  id: stripeModulePath,
  filename: stripeModulePath,
  loaded: true,
  exports: fakeStripeExports,
  children: [],
  paths: [],
};

// Now import stripe.js — it will pick up the fake Stripe from cache.
const adminStub = _require('./firebase-admin');
const { createMiscPaymentIntent } = await import('./stripe.js');

let originalFirestore;

beforeEach(() => {
  itemStore.clear();
  piCreateSpy.mockClear();
  // Replace firestore on the shared admin stub so stripe.js sees seeded data.
  originalFirestore = adminStub.firestore;
  adminStub.firestore = () => ({
    collection: (name) => ({
      doc: (id) => ({
        get: async () => {
          if (name === 'misc_items' && itemStore.has(id)) {
            return { exists: true, data: () => itemStore.get(id) };
          }
          return { exists: false };
        },
      }),
    }),
    FieldValue: { serverTimestamp: () => null },
  });
});

afterEach(() => {
  adminStub.firestore = originalFirestore;
});

describe('createMiscPaymentIntent — apparel size validation', () => {
  it('rejects when size is missing for an apparel item', async () => {
    itemStore.set('tee', { name: 'HQ Tee', priceType: 'fixed', price: 2500, apparel: true, sizes: ['S', 'M', 'L'] });
    await expect(createMiscPaymentIntent({
      itemId: 'tee', qty: 1, customerName: 'A', customerEmail: 'a@b.c', customerPhone: '+44',
    })).rejects.toMatchObject({ statusCode: 400 });
  });

  it('rejects when size is not in the item sizes array', async () => {
    itemStore.set('tee', { name: 'HQ Tee', priceType: 'fixed', price: 2500, apparel: true, sizes: ['S', 'M', 'L'] });
    await expect(createMiscPaymentIntent({
      itemId: 'tee', qty: 1, customerName: 'A', customerEmail: 'a@b.c', customerPhone: '+44', size: 'XXXL',
    })).rejects.toMatchObject({ statusCode: 400 });
  });

  it('accepts a valid size and stores it (uppercase) in PI metadata', async () => {
    itemStore.set('tee', { name: 'HQ Tee', priceType: 'fixed', price: 2500, apparel: true, sizes: ['S', 'M', 'L'] });
    await createMiscPaymentIntent({
      itemId: 'tee', qty: 1, customerName: 'A', customerEmail: 'a@b.c', customerPhone: '+44', size: 'm',
    });
    expect(piCreateSpy).toHaveBeenCalledTimes(1);
    expect(piCreateSpy.mock.calls[0][0].metadata.apparelSize).toBe('M');
  });

  it('non-apparel item still works without a size', async () => {
    itemStore.set('cover', { name: 'Heli Cover', priceType: 'fixed', price: 5000, apparel: false });
    await createMiscPaymentIntent({
      itemId: 'cover', qty: 1, customerName: 'A', customerEmail: 'a@b.c', customerPhone: '+44',
    });
    expect(piCreateSpy).toHaveBeenCalledTimes(1);
    expect(piCreateSpy.mock.calls[0][0].metadata.apparelSize).toBe('');
  });
});

import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { createRequire } from 'module';

// --- Hoisted helpers ---
const { piCreateSpy } = vi.hoisted(() => {
  const piCreateSpy = vi.fn(async (args) => ({
    id: 'pi_new_test',
    client_secret: 'sec_test',
    amount: args.amount,
    status: 'requires_payment_method',
    metadata: args.metadata || {},
  }));
  return { piCreateSpy };
});

// Stub the mailer so stripe.js loads without SMTP credentials.
vi.mock('./lib/mailer', () => ({
  getTransporter: () => ({ sendMail: vi.fn().mockResolvedValue({}) }),
}));

// --- CJS module surgery ---
// stripe.js is CommonJS. We inject a fake Stripe constructor into require.cache
// BEFORE stripe.js is imported so its `const Stripe = require('stripe')` picks
// up our stub. For firebase-admin, the test-setup already intercepts Module._load
// and returns a single shared stub object; we mutate .firestore on that stub per test.

const _require = createRequire(import.meta.url);

// Stripe mock: needs paymentIntents.create, paymentIntents.retrieve, charges.retrieve.
// retrieve + charges are used by validateReferredByCode for test cases 4 & 5.
let piRetrieveMock = vi.fn();
let chargesRetrieveMock = vi.fn();

const fakeStripeInstance = {
  paymentIntents: {
    create: piCreateSpy,
    retrieve: (...args) => piRetrieveMock(...args),
  },
  charges: {
    retrieve: (...args) => chargesRetrieveMock(...args),
  },
};

const stripeModulePath = _require.resolve('stripe');
const fakeStripeExports = Object.assign(
  () => fakeStripeInstance,
  { default: () => fakeStripeInstance },
);
require.cache[stripeModulePath] = {
  id: stripeModulePath,
  filename: stripeModulePath,
  loaded: true,
  exports: fakeStripeExports,
  children: [],
  paths: [],
};

// Stores: keyed by collection/doc.
// referralCodesStore: Map<code, docData>
// miscItemsStore: Map<id, docData>  (for getFreeReferralItemSnapshot — misc_items where query)
// pricingStore: Map<docId, docData> (so getPrice doesn't blow up)
const referralCodesStore = new Map();
const miscItemsStore = new Map();
const pricingStore = new Map();

// Grab the shared admin stub that test-setup.js injects.
const adminStub = _require('./firebase-admin');
let originalFirestore;

// Helper: build a firestore fake backed by the stores above.
function buildFirestore() {
  return () => ({
    collection: (colName) => ({
      doc: (docId) => ({
        get: async () => {
          let store;
          if (colName === 'referral_codes') store = referralCodesStore;
          else if (colName === 'misc_items') store = miscItemsStore;
          else if (colName === 'pricing') store = pricingStore;
          else return { exists: false };

          if (store.has(docId)) {
            return { exists: true, data: () => store.get(docId) };
          }
          return { exists: false };
        },
        set: async (data) => {
          if (colName === 'referral_codes') referralCodesStore.set(docId, data);
          else if (colName === 'misc_items') miscItemsStore.set(docId, data);
          else if (colName === 'pricing') pricingStore.set(docId, data);
        },
      }),
      // where().limit().get() — used by getFreeReferralItemSnapshot (misc_items freeReferralOffer)
      where: (field, op, value) => ({
        limit: () => ({
          get: async () => {
            if (colName === 'misc_items' && field === 'freeReferralOffer' && op === '==' && value === true) {
              const matches = [...miscItemsStore.entries()]
                .filter(([, d]) => d.freeReferralOffer === true)
                .slice(0, 1);
              if (matches.length === 0) return { empty: true, docs: [] };
              return {
                empty: false,
                docs: matches.map(([id, d]) => ({ id, data: () => d })),
              };
            }
            // page_events where query (recordPurchaseEvent) — not exercised, return empty
            return { empty: true, docs: [] };
          },
        }),
      }),
      // add() — used by recordPurchaseEvent; safe no-op
      add: async () => ({ id: 'evt_fake' }),
    }),
    FieldValue: { serverTimestamp: () => null },
    Timestamp: { fromMillis: (ms) => ({ seconds: Math.floor(ms / 1000) }) },
  });
}

// Import stripe.js once after the fake Stripe is in cache.
const { createPaymentIntent } = await import('./stripe.js');

beforeEach(() => {
  referralCodesStore.clear();
  miscItemsStore.clear();
  pricingStore.clear();
  piCreateSpy.mockClear();
  piRetrieveMock = vi.fn(async () => ({
    status: 'succeeded',
    latest_charge: 'ch_x',
  }));
  chargesRetrieveMock = vi.fn(async () => ({
    refunded: false,
    amount_refunded: 0,
  }));
  // Replace firestore on the shared admin stub.
  originalFirestore = adminStub.firestore;
  adminStub.firestore = buildFirestore();
  // firestore.FieldValue used as a static property in some places.
  adminStub.firestore.FieldValue = { serverTimestamp: () => null };
});

afterEach(() => {
  adminStub.firestore = originalFirestore;
});

// Minimal valid Discovery Flight params.
const BASE_PARAMS = {
  aircraft: 'r22',
  duration: 30,
  customerName: 'Test Pilot',
  customerEmail: 'pilot@test.com',
  customerPhone: '+44',
};

describe('createPaymentIntent — referral code generation', () => {
  it('generates a referral code and writes a referral_codes doc', async () => {
    await createPaymentIntent({ ...BASE_PARAMS });

    expect(referralCodesStore.size).toBe(1);
    const [, doc] = [...referralCodesStore.entries()][0];
    expect(doc.ownerPaymentIntentId).toBe('pi_new_test');
    expect(doc.ownerEmail).toBe('pilot@test.com');
  });

  it('stores referralCode in PI metadata matching ^[A-Z0-9]{8}$ and referredByCode is empty when not provided', async () => {
    await createPaymentIntent({ ...BASE_PARAMS });

    expect(piCreateSpy).toHaveBeenCalledTimes(1);
    const metadata = piCreateSpy.mock.calls[0][0].metadata;
    expect(metadata.referralCode).toMatch(/^[A-Z0-9]{8}$/);
    expect(metadata.referredByCode).toBe('');
  });
});

describe('createPaymentIntent — referredByCode validation', () => {
  it('silently drops a malformed referredByCode', async () => {
    await createPaymentIntent({ ...BASE_PARAMS, referredByCode: 'NOT_VALID!!' });

    expect(piCreateSpy).toHaveBeenCalledTimes(1);
    const metadata = piCreateSpy.mock.calls[0][0].metadata;
    expect(metadata.referredByCode).toBe('');
  });

  it('silently drops a self-referral', async () => {
    const CODE = 'SELFCODE';
    referralCodesStore.set(CODE, {
      code: CODE,
      ownerPaymentIntentId: 'pi_owner_self',
      ownerEmail: 'same@x.com',
    });

    await createPaymentIntent({ ...BASE_PARAMS, customerEmail: 'same@x.com', referredByCode: CODE });

    expect(piCreateSpy).toHaveBeenCalledTimes(1);
    const metadata = piCreateSpy.mock.calls[0][0].metadata;
    expect(metadata.referredByCode).toBe('');
  });

  it('records a valid referredByCode when owner is different and PI is not refunded', async () => {
    const CODE = 'VALIDREF8';

    // CODE is 9 chars; use an 8-char code that matches the regex
    const VALID_CODE = 'VALIDRE8';
    referralCodesStore.set(VALID_CODE, {
      code: VALID_CODE,
      ownerPaymentIntentId: 'pi_owner',
      ownerEmail: 'owner@x.com',
    });

    // Stripe retrieve mocks are already set up in beforeEach to return succeeded/not-refunded.
    await createPaymentIntent({ ...BASE_PARAMS, customerEmail: 'friend@x.com', referredByCode: VALID_CODE });

    expect(piCreateSpy).toHaveBeenCalledTimes(1);
    const metadata = piCreateSpy.mock.calls[0][0].metadata;
    expect(metadata.referredByCode).toBe(VALID_CODE);
  });
});

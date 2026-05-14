import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { createRequire } from 'module';

// --- Hoisted helpers ---
const { piCreateSpy } = vi.hoisted(() => {
  const piCreateSpy = vi.fn(async (args) => ({
    id: 'pi_test',
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
// BEFORE stripe.js is imported. For firebase-admin, we use the shared stub
// that test-setup.js intercepts via Module._load, accessed through the local
// firebase-admin.js wrapper (which is cached after first require).

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

// Get the shared admin stub (firebase-admin.js is cached after first require).
const adminStub = _require('./firebase-admin');
const { createUpgradePaymentIntent } = await import('./stripe.js');

// bookingsStore: keyed by paymentIntentId
const bookingsStore = new Map();
let originalFirestore;

beforeEach(() => {
  bookingsStore.clear();
  piCreateSpy.mockClear();

  originalFirestore = adminStub.firestore;
  adminStub.firestore = () => ({
    collection: (name) => ({
      doc: (id) => ({
        get: async () => {
          if (name === 'bookings' && bookingsStore.has(id)) {
            return { exists: true, data: () => bookingsStore.get(id) };
          }
          // pricing collection: return exists:false so getR44Price falls back
          // to PRICE_FALLBACK (r44: { 30: 30500, 60: 60500 })
          return { exists: false };
        },
        set: async (data) => {
          if (name === 'bookings') bookingsStore.set(id, data);
        },
        update: async (data) => {
          if (name === 'bookings' && bookingsStore.has(id)) {
            bookingsStore.set(id, { ...bookingsStore.get(id), ...data });
          }
        },
      }),
    }),
    FieldValue: { serverTimestamp: () => null },
  });
});

afterEach(() => {
  adminStub.firestore = originalFirestore;
});

describe('createUpgradePaymentIntent — validation', () => {
  it('rejects when booking is not found (404)', async () => {
    await expect(
      createUpgradePaymentIntent({ originalPaymentIntentId: 'pi_missing', newDuration: 30 }),
    ).rejects.toMatchObject({ statusCode: 404, message: 'Booking not found' });
  });

  it('rejects when booking aircraft is not r22 (400)', async () => {
    bookingsStore.set('pi_r44_booking', {
      aircraft: 'r44',
      flightAmountPence: 30500,
      customerName: 'Alice',
      customerEmail: 'alice@example.com',
      customerPhone: '+44123',
    });

    await expect(
      createUpgradePaymentIntent({ originalPaymentIntentId: 'pi_r44_booking', newDuration: 60 }),
    ).rejects.toMatchObject({ statusCode: 400, message: /R44 upgrade eligibility/i });
  });

  it('rejects when booking is already upgraded (400)', async () => {
    bookingsStore.set('pi_already_upgraded', {
      aircraft: 'r22',
      upgrade: true,
      flightAmountPence: 18000,
      customerName: 'Bob',
      customerEmail: 'bob@example.com',
      customerPhone: '+44456',
    });

    await expect(
      createUpgradePaymentIntent({ originalPaymentIntentId: 'pi_already_upgraded', newDuration: 30 }),
    ).rejects.toMatchObject({ statusCode: 400, message: /already been upgraded/i });
  });

  it('rejects when diff <= 0 (R22 60min → R44 30min, diff = 30500 - 36000 = -5500)', async () => {
    // R22 60min costs 36000; R44 30min costs 30500 (fallback) — diff is negative
    bookingsStore.set('pi_r22_60', {
      aircraft: 'r22',
      flightAmountPence: 36000,
      customerName: 'Carol',
      customerEmail: 'carol@example.com',
      customerPhone: '+44789',
    });

    await expect(
      createUpgradePaymentIntent({ originalPaymentIntentId: 'pi_r22_60', newDuration: 30 }),
    ).rejects.toMatchObject({ statusCode: 400, message: /not an upgrade/i });
  });
});

describe('createUpgradePaymentIntent — diff math', () => {
  it('returns diff = 12500 for R22 30min → R44 30min (30500 - 18000)', async () => {
    bookingsStore.set('pi_r22_30', {
      aircraft: 'r22',
      flightAmountPence: 18000,
      customerName: 'Dave',
      customerEmail: 'dave@example.com',
      customerPhone: '+44111',
    });

    const result = await createUpgradePaymentIntent({
      originalPaymentIntentId: 'pi_r22_30',
      newDuration: 30,
    });

    expect(result.diffPence).toBe(12500);
    expect(result.clientSecret).toBe('sec_test');
    expect(result.newDuration).toBe(30);
    expect(piCreateSpy).toHaveBeenCalledOnce();
    expect(piCreateSpy.mock.calls[0][0].amount).toBe(12500);
  });

  it('returns diff = 42500 for R22 30min → R44 60min (60500 - 18000)', async () => {
    bookingsStore.set('pi_r22_30_to_60', {
      aircraft: 'r22',
      flightAmountPence: 18000,
      customerName: 'Eve',
      customerEmail: 'eve@example.com',
      customerPhone: '+44222',
    });

    const result = await createUpgradePaymentIntent({
      originalPaymentIntentId: 'pi_r22_30_to_60',
      newDuration: 60,
    });

    expect(result.diffPence).toBe(42500);
    expect(result.clientSecret).toBe('sec_test');
    expect(result.newDuration).toBe(60);
    expect(piCreateSpy).toHaveBeenCalledOnce();
    expect(piCreateSpy.mock.calls[0][0].amount).toBe(42500);
  });
});

# Plan B — Bookings Foundation, Referral Attribution & Post-Checkout Offers

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Generate a unique invisible referral code on every Discovery Flight booking. When a friend opens the booker's share link (`/training/trial-lessons?ref=<CODE>`) and completes a booking, the referral webhook flags the booker's record as eligible and emails the HQ team. On `/booking-confirmed`, render a `<ReferralOfferCard>` showing the (admin-flagged) free HQ item with a "Copy share link" button. Customer-facing UI never shows the bare code.

**Architecture:** Code generated server-side at PaymentIntent creation; written to a new `referral_codes` Firestore collection (doc id = code) plus PI metadata. The existing `bookings/<pi_id>` doc (currently written by the webhook) is extended with `referralCode`, `referredByCode`, `referralCompleted`, `referralFreeItemSnapshot`. Friend's checkout silently captures `?ref=` from URL and forwards as `referredByCode` in the create-PI body. On webhook `payment_intent.succeeded`, if `referredByCode` is present and valid, the owner's booking gets `referralCompleted=true` and an HQ-team email is sent. `<PostCheckoutOffers>` on `/booking-confirmed` fetches the live booking record via a new `GET /api/booking/:pid` endpoint. Admin gets a `freeReferralOffer` toggle on `misc_items` with single-of enforcement via a client-side Firestore transaction.

**Tech Stack:** React 19, Vite 8, Express 4, Firestore (admin SDK + client SDK), Stripe Node SDK, Vitest + React Testing Library.

**Spec:** `docs/superpowers/specs/2026-05-08-post-checkout-offers-design.md` § 4.1, 4.2, 4.3, 4.4, 5.1–5.3, 5.6–5.7, 5.9, 6.1, 6.2, 6.5, 6.6, 6.7.

**Depends on:** none. (Plan A is independent.)

---

## File Map

| Action | Path | Responsibility |
|--------|------|---------------|
| Create | `src/lib/referralCodes.js` | Code generator: 8-char uppercase alphanumeric, no `I/O/0/1`. |
| Create | `src/lib/referralCodes.test.js` | Generator tests. |
| Modify | `api/stripe.js` | Generate code + write `referral_codes`/freeItemSnapshot at PI creation; validate `referredByCode`; webhook handles redemption + extends booking doc. |
| Modify | `api/stripe.test.js` | Tests for the new server logic. |
| Create | `api/booking.js` | `GET /api/booking/:paymentIntentId` handler. |
| Modify | `server.js` | Mount the new route. |
| Modify | `src/pages/Checkout.jsx` | Capture `?ref=` once on mount; forward as `referredByCode`. |
| Modify | `src/pages/BookingConfirmed.jsx` | Fetch booking record; render `<PostCheckoutOffers>`. |
| Create | `src/components/booking/PostCheckoutOffers.jsx` | Conditionally renders ReferralOfferCard (and later UpgradeOfferCard from Plan C). |
| Create | `src/components/booking/ReferralOfferCard.jsx` | Free-item card with "Copy share link" button + click-to-modal. |
| Create | `src/components/booking/ProductInfoModal.jsx` | Lightweight item info modal (description + image carousel). |
| Create | `src/components/booking/PostCheckoutOffers.test.jsx` | Conditional rendering by booking type. |
| Create | `src/pages/BookingConfirmed.test.jsx` | Page renders offers correctly per booking state. |
| Modify | `src/pages/admin/AdminMiscItemEdit.jsx` | `freeReferralOffer` toggle + client-side single-of transaction. |
| Modify | `api/stripe.js` (email composer) | Append "Refer a friend" CTA block when `referralCode` is present on a Discovery Flight PI. |

---

### Task 1: Referral code generator

**Files:**
- Create: `src/lib/referralCodes.js`
- Create: `src/lib/referralCodes.test.js`

- [ ] **Step 1: Write the failing test**

Create `src/lib/referralCodes.test.js`:

```js
import { describe, it, expect } from 'vitest';
import { generateReferralCode, REFERRAL_CODE_ALPHABET } from './referralCodes';

describe('generateReferralCode', () => {
  it('returns 8 uppercase characters from the safe alphabet', () => {
    for (let i = 0; i < 100; i++) {
      const code = generateReferralCode();
      expect(code).toMatch(/^[A-Z0-9]{8}$/);
      for (const ch of code) {
        expect(REFERRAL_CODE_ALPHABET).toContain(ch);
      }
    }
  });

  it('omits visually ambiguous characters I, O, 0, 1', () => {
    expect(REFERRAL_CODE_ALPHABET).not.toContain('I');
    expect(REFERRAL_CODE_ALPHABET).not.toContain('O');
    expect(REFERRAL_CODE_ALPHABET).not.toContain('0');
    expect(REFERRAL_CODE_ALPHABET).not.toContain('1');
  });

  it('returns sufficiently varied codes across many calls (probabilistic)', () => {
    const seen = new Set();
    for (let i = 0; i < 500; i++) seen.add(generateReferralCode());
    expect(seen.size).toBeGreaterThan(490); // ~500 with no collisions on 32^8 space
  });
});
```

- [ ] **Step 2: Run — verify it fails**

```bash
npx vitest run src/lib/referralCodes.test.js
```

Expected: FAIL — module not found.

- [ ] **Step 3: Write the implementation**

Create `src/lib/referralCodes.js`:

```js
// Visually unambiguous alphabet — no I, O, 0, 1 — to reduce read-aloud errors
// (codes are typically captured from URLs, but we keep the alphabet readable
// in case they ever surface in support workflows).
export const REFERRAL_CODE_ALPHABET = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
const CODE_LENGTH = 8;

function pickChar(rand) {
  return REFERRAL_CODE_ALPHABET[Math.floor(rand() * REFERRAL_CODE_ALPHABET.length)];
}

export function generateReferralCode(rand = Math.random) {
  let out = '';
  for (let i = 0; i < CODE_LENGTH; i++) out += pickChar(rand);
  return out;
}
```

- [ ] **Step 4: Run — verify pass**

```bash
npx vitest run src/lib/referralCodes.test.js
```

Expected: 3 passing tests.

- [ ] **Step 5: Commit**

```bash
git add src/lib/referralCodes.js src/lib/referralCodes.test.js
git commit -m "feat(lib): referral code generator (8 chars, safe alphabet)"
```

---

### Task 2: Server helper — `generateUniqueReferralCode` (collision retry)

**Files:**
- Modify: `api/stripe.js`

- [ ] **Step 1: Add the helper near the existing `getPrice` helper**

In `api/stripe.js`, near the top (after the requires + before `getPrice`), add:

```js
const REFERRAL_ALPHABET = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
function makeCode() {
  let out = '';
  for (let i = 0; i < 8; i++) out += REFERRAL_ALPHABET[Math.floor(Math.random() * REFERRAL_ALPHABET.length)];
  return out;
}

/**
 * Generates a unique referral code, retrying up to `maxRetries` times on collision.
 * Throws if a unique code can't be obtained.
 */
async function generateUniqueReferralCode(maxRetries = 5) {
  for (let attempt = 0; attempt < maxRetries; attempt++) {
    const code = makeCode();
    const ref = admin.firestore().collection('referral_codes').doc(code);
    const snap = await ref.get();
    if (!snap.exists) return code;
  }
  const err = new Error('Failed to generate unique referral code after retries');
  err.statusCode = 500;
  throw err;
}
```

- [ ] **Step 2: Commit (no test runner change yet — covered by Task 4)**

```bash
git add api/stripe.js
git commit -m "feat(api): server-side referral code generator with collision retry"
```

---

### Task 3: Look up flagged free-referral item at PI creation

**Files:**
- Modify: `api/stripe.js`

- [ ] **Step 1: Add a helper to fetch the snapshot**

In `api/stripe.js`, just below `generateUniqueReferralCode`, add:

```js
/**
 * Returns a snapshot of the misc item currently flagged as the
 * free-referral reward, or null if none is flagged.
 */
async function getFreeReferralItemSnapshot() {
  const snap = await admin.firestore()
    .collection('misc_items')
    .where('freeReferralOffer', '==', true)
    .limit(1)
    .get();
  if (snap.empty) return null;
  const doc = snap.docs[0];
  const d = doc.data();
  return {
    id: doc.id,
    name: String(d.name || ''),
    priceDisplay: String(d.priceDisplay || ''),
  };
}
```

- [ ] **Step 2: Commit**

```bash
git add api/stripe.js
git commit -m "feat(api): helper to snapshot flagged free-referral item"
```

---

### Task 4: Validate `referredByCode` (server)

**Files:**
- Modify: `api/stripe.js`

- [ ] **Step 1: Add a validation helper**

In `api/stripe.js`, just below `getFreeReferralItemSnapshot`, add:

```js
/**
 * Validates a `referredByCode` against constraints:
 *   - exists in `referral_codes`
 *   - owner's email is not the same as this customer's
 *   - owner's PI is not refunded (Stripe lookup)
 * Returns the owner record if valid; null otherwise. Never throws — invalid
 * codes are silently dropped per spec (the booking still proceeds).
 */
async function validateReferredByCode(code, customerEmail) {
  if (!code || typeof code !== 'string') return null;
  const normalized = code.trim().toUpperCase();
  if (!/^[A-Z0-9]{8}$/.test(normalized)) return null;
  try {
    const doc = await admin.firestore().collection('referral_codes').doc(normalized).get();
    if (!doc.exists) return null;
    const data = doc.data();
    if (!data.ownerPaymentIntentId) return null;
    if (data.ownerEmail && customerEmail && String(data.ownerEmail).toLowerCase() === String(customerEmail).toLowerCase()) {
      return null; // self-referral
    }
    // Check the owner's PI isn't refunded
    try {
      const ownerPi = await getStripe().paymentIntents.retrieve(data.ownerPaymentIntentId);
      if (ownerPi.status !== 'succeeded' && ownerPi.status !== 'processing') return null;
      // also skip if any charge on the PI has been refunded
      const chargeId = ownerPi.latest_charge;
      if (chargeId) {
        const charge = await getStripe().charges.retrieve(chargeId);
        if (charge.refunded || charge.amount_refunded > 0) return null;
      }
    } catch (stripeErr) {
      console.warn('[referral] owner PI lookup failed:', stripeErr.message);
      return null;
    }
    return { code: normalized, ...data };
  } catch (err) {
    console.warn('[referral] validateReferredByCode failed:', err.message);
    return null;
  }
}
```

- [ ] **Step 2: Commit**

```bash
git add api/stripe.js
git commit -m "feat(api): validateReferredByCode (silent drop on any failure)"
```

---

### Task 5: Wire referral fields into `createPaymentIntent`

**Files:**
- Modify: `api/stripe.js` (`createPaymentIntent`, ~line 196)

- [ ] **Step 1: Update the function signature and add new logic**

In `createPaymentIntent`, accept `referredByCode`:

```js
async function createPaymentIntent({
  aircraft, duration, customerName, customerEmail, customerPhone,
  wantsVoucher, voucherLocation, voucherMessage,
  addons = [], fulfilment, shippingAddress,
  cartId, referredByCode,
}) {
```

- [ ] **Step 2: Generate referral code + snapshot before PI creation**

Just before the `getStripe().paymentIntents.create({ … })` call, add:

```js
const referralCode = await generateUniqueReferralCode();
const freeItemSnapshot = await getFreeReferralItemSnapshot();
const validatedReferredByCode = await validateReferredByCode(referredByCode, customerEmail);
```

- [ ] **Step 3: Add referral fields to PI metadata**

In the `metadata: { … }` object inside `paymentIntents.create`, append:

```js
metadata: {
  // ...existing fields...
  referralCode,
  referredByCode: validatedReferredByCode ? validatedReferredByCode.code : '',
},
```

- [ ] **Step 4: Write the `referral_codes` doc immediately after PI creation**

After `const paymentIntent = await getStripe().paymentIntents.create({ … });`, add:

```js
try {
  await admin.firestore().collection('referral_codes').doc(referralCode).set({
    code: referralCode,
    ownerPaymentIntentId: paymentIntent.id,
    ownerEmail: customerEmail || '',
    ...(freeItemSnapshot ? { freeItemSnapshot } : {}),
    createdAt: admin.firestore.FieldValue.serverTimestamp(),
  });
} catch (err) {
  console.error('[stripe] failed to write referral_codes doc:', err.message);
  // Non-fatal: the booking proceeds, but the referral system is degraded.
}
```

- [ ] **Step 5: Build to verify no syntax errors**

```bash
node -e "require('./api/stripe.js'); console.log('ok')"
```

Expected: `ok`.

- [ ] **Step 6: Commit**

```bash
git add api/stripe.js
git commit -m "feat(api): generate referral code at PI creation + write referral_codes"
```

---

### Task 6: Tests for the new server-side referral logic

**Files:**
- Modify: `api/stripe.test.js`

> **Note on test infrastructure.** The existing `api/test-setup.js` intercepts `firebase-admin` globally with a monolithic stub (`get` always returns `{ exists: false }`). To assert on Firestore writes/reads per-test, either: (a) upgrade `api/test-setup.js` to expose a mutable in-memory store the test can reset; or (b) override at the test-file level with `vi.mock('firebase-admin', () => ({ ... }))`. **Recommended:** option (b) for these tests. Add the mock at the top of the new `describe` block scope.

- [ ] **Step 1: Append a `describe` block for referral creation**

At the end of `api/stripe.test.js`, append:

```js
// Concrete pattern using vi.mock at test-file scope.
import { vi } from 'vitest';

const referralCodesStore = new Map();
const createPiSpy = vi.fn();

vi.mock('firebase-admin', () => {
  function docRef(coll, id) {
    return {
      get: async () => {
        if (coll === 'referral_codes' && referralCodesStore.has(id)) {
          return { exists: true, data: () => referralCodesStore.get(id) };
        }
        return { exists: false };
      },
      set: async (data) => {
        if (coll === 'referral_codes') referralCodesStore.set(id, data);
      },
    };
  }
  return {
    apps: [true],
    credential: { cert: () => ({}) },
    initializeApp: () => {},
    firestore: () => ({
      collection: (coll) => ({
        doc: (id) => docRef(coll, id),
        where: () => ({ limit: () => ({ get: async () => ({ empty: true, docs: [] }) }) }),
      }),
      FieldValue: { serverTimestamp: () => null },
    }),
  };
});

vi.mock('stripe', () => ({
  default: () => ({
    paymentIntents: {
      create: vi.fn((args) => { createPiSpy(args); return Promise.resolve({ id: 'pi_test', client_secret: 'sec_test', amount: args.amount, status: 'requires_payment_method' }); }),
      retrieve: vi.fn(() => Promise.resolve({ status: 'succeeded', latest_charge: null })),
    },
    charges: { retrieve: vi.fn(() => Promise.resolve({ refunded: false, amount_refunded: 0 })) },
  }),
}));

describe('createPaymentIntent — referral attribution', () => {
  beforeEach(() => {
    referralCodesStore.clear();
    createPiSpy.mockClear();
  });

  it('generates a referral code and writes it to referral_codes', async () => {
    const { createPaymentIntent } = await import('./stripe.js');
    await createPaymentIntent({
      aircraft: 'r22', duration: 30,
      customerName: 'A', customerEmail: 'a@b.c', customerPhone: '+44',
      addons: [],
    });
    const codes = Array.from(referralCodesStore.keys());
    expect(codes.length).toBe(1);
    expect(codes[0]).toMatch(/^[A-Z0-9]{8}$/);
    expect(referralCodesStore.get(codes[0])).toMatchObject({
      ownerPaymentIntentId: 'pi_test',
      ownerEmail: 'a@b.c',
    });
  });

  it('stores referralCode in PI metadata and matches the safe alphabet', async () => {
    const { createPaymentIntent } = await import('./stripe.js');
    await createPaymentIntent({
      aircraft: 'r22', duration: 30,
      customerName: 'A', customerEmail: 'a@b.c', customerPhone: '+44',
      addons: [],
    });
    const meta = createPiSpy.mock.calls[0][0].metadata;
    expect(meta.referralCode).toMatch(/^[A-Z0-9]{8}$/);
    expect(meta.referredByCode).toBe('');
  });

  it('silently drops a malformed referredByCode (does not throw)', async () => {
    const { createPaymentIntent } = await import('./stripe.js');
    await createPaymentIntent({
      aircraft: 'r22', duration: 30,
      customerName: 'A', customerEmail: 'a@b.c', customerPhone: '+44',
      addons: [], referredByCode: 'NOT_VALID!!',
    });
    const meta = createPiSpy.mock.calls[0][0].metadata;
    expect(meta.referredByCode).toBe('');
  });

  it('silently drops a self-referral (same email as owner)', async () => {
    referralCodesStore.set('AAAA2345', { ownerPaymentIntentId: 'pi_owner', ownerEmail: 'same@x.com' });
    const { createPaymentIntent } = await import('./stripe.js');
    await createPaymentIntent({
      aircraft: 'r22', duration: 30,
      customerName: 'A', customerEmail: 'same@x.com', customerPhone: '+44',
      addons: [], referredByCode: 'AAAA2345',
    });
    const meta = createPiSpy.mock.calls[0][0].metadata;
    expect(meta.referredByCode).toBe('');
  });

  it('records a valid referredByCode in PI metadata', async () => {
    referralCodesStore.set('BBBB2345', { ownerPaymentIntentId: 'pi_owner', ownerEmail: 'owner@x.com' });
    const { createPaymentIntent } = await import('./stripe.js');
    await createPaymentIntent({
      aircraft: 'r22', duration: 30,
      customerName: 'A', customerEmail: 'friend@x.com', customerPhone: '+44',
      addons: [], referredByCode: 'BBBB2345',
    });
    const meta = createPiSpy.mock.calls[0][0].metadata;
    expect(meta.referredByCode).toBe('BBBB2345');
  });
});
```

(If the file already imports `createPaymentIntent` at the top, you don't need the dynamic `await import` inside each test — adapt to whichever shape works. The key is: the in-memory `referralCodesStore` is reset per test and asserted against.)

- [ ] **Step 2: Run tests**

```bash
npx vitest run api/stripe.test.js
```

Expected: all existing tests still pass + 5 new ones pass.

- [ ] **Step 3: Commit**

```bash
git add api/stripe.test.js
git commit -m "test(api): referral code generation + referredByCode validation paths"
```

---

### Task 7: Webhook — extend booking record with referral fields

**Files:**
- Modify: `api/stripe.js` (`handleWebhook`, ~line 695-705)

- [ ] **Step 1: Capture referral fields on every Discovery Flight booking**

In the `} else { /* Discovery Flight */ }` branch (~line 694), update to:

```js
} else {
  const { aircraft, aircraftName, duration, referralCode, referredByCode } = pi.metadata;
  bookingData.aircraft = aircraft;
  bookingData.aircraftName = aircraftName || aircraft;
  bookingData.duration = Number(duration);
  if (referralCode) bookingData.referralCode = referralCode;
  if (referredByCode) bookingData.referredByCode = referredByCode;
  bookingData.referralCompleted = false;
  // Snapshot the free-item at booking write time (in case it was deleted later)
  try {
    const codesDoc = referralCode
      ? await admin.firestore().collection('referral_codes').doc(referralCode).get()
      : null;
    if (codesDoc && codesDoc.exists) {
      const cd = codesDoc.data();
      if (cd.freeItemSnapshot) bookingData.referralFreeItemSnapshot = cd.freeItemSnapshot;
    }
  } catch {}
  const { addons: webhookParsedAddons, fulfilment: webhookFulfilment, shippingAddress: webhookShippingAddress } = parseAddonsFromMetadata(pi.metadata);
  bookingData.addons = webhookParsedAddons;
  bookingData.fulfilment = webhookFulfilment;
  bookingData.shippingAddress = webhookShippingAddress;
  // flightAmountPence: the PI amount minus the addon line totals (used for upgrade math in Plan C)
  const addonTotal = webhookParsedAddons.reduce((sum, a) => sum + (Number(a.lineTotal) || 0), 0);
  bookingData.flightAmountPence = pi.amount - addonTotal;
  bookingData.totalAmountPence = pi.amount;
}
```

- [ ] **Step 2: Commit**

```bash
git add api/stripe.js
git commit -m "feat(webhook): persist referralCode, referredByCode, snapshot, flightAmountPence on booking"
```

---

### Task 8: Webhook — handle `referredByCode` redemption

**Files:**
- Modify: `api/stripe.js` (`handleWebhook`)

- [ ] **Step 1: Add the redemption branch after the booking write**

In `handleWebhook`, immediately after the existing `await admin.firestore().collection('bookings').doc(pi.id).set(bookingData, { merge: true });` line (~line 705), add:

```js
// Referral redemption: when the friend's PI succeeds, flip the owner's record + email HQ
try {
  const incomingReferredBy = pi.metadata.referredByCode;
  if (incomingReferredBy && pi.metadata.productType !== 'discovery-flight-upgrade') {
    const codeDoc = await admin.firestore().collection('referral_codes').doc(incomingReferredBy).get();
    if (codeDoc.exists) {
      const cd = codeDoc.data();
      const ownerBookingRef = admin.firestore().collection('bookings').doc(cd.ownerPaymentIntentId);
      const ownerSnap = await ownerBookingRef.get();
      if (ownerSnap.exists && !ownerSnap.data().referralCompleted) {
        await ownerBookingRef.update({
          referralCompleted: true,
          referralCompletedAt: admin.firestore.FieldValue.serverTimestamp(),
          referralCompletedByPaymentIntentId: pi.id,
          updatedAt: admin.firestore.FieldValue.serverTimestamp(),
        });
        // Notify HQ team
        await sendReferralRedeemedEmail({
          owner: { name: ownerSnap.data().customerName, email: ownerSnap.data().customerEmail, paymentIntentId: cd.ownerPaymentIntentId },
          redeemer: { name: customerName, email: customerEmail, paymentIntentId: pi.id },
          freeItem: cd.freeItemSnapshot || ownerSnap.data().referralFreeItemSnapshot || null,
        });
      }
    }
  }
} catch (refErr) {
  console.error('[stripe webhook] referral redemption failed:', refErr.message);
}
```

- [ ] **Step 2: Add the `sendReferralRedeemedEmail` helper**

Near the other email helpers in `api/stripe.js`, add:

```js
async function sendReferralRedeemedEmail({ owner, redeemer, freeItem }) {
  if (!process.env.HQ_TEAM_EMAIL) {
    console.warn('[referral] HQ_TEAM_EMAIL env var not set, skipping notification');
    return;
  }
  const itemLine = freeItem
    ? `Free item to ship/hand over: <strong>${escapeHtml(freeItem.name)}</strong> (id: ${escapeHtml(freeItem.id)})`
    : 'Free item: <em>none flagged at the time of original booking</em>';
  const html = `
    <p>A referral has been redeemed.</p>
    <ul>
      <li><strong>Original booker:</strong> ${escapeHtml(owner.name || '')} &lt;${escapeHtml(owner.email || '')}&gt; (PI: ${escapeHtml(owner.paymentIntentId)})</li>
      <li><strong>Friend who used the code:</strong> ${escapeHtml(redeemer.name || '')} &lt;${escapeHtml(redeemer.email || '')}&gt; (PI: ${escapeHtml(redeemer.paymentIntentId)})</li>
      <li>${itemLine}</li>
    </ul>
    <p>Pickup is at HQ — no shipping required.</p>
  `;
  return sendMail({
    to: process.env.HQ_TEAM_EMAIL,
    subject: 'Referral redeemed — free item to fulfil',
    html,
  });
}
```

(If the existing email module is `nodemailer` direct calls, replace `sendMail({ … })` with whatever helper the file already uses. Inspect with `grep -n "transporter.sendMail\|sendMail\|nodemailer" api/stripe.js`.)

- [ ] **Step 3: Add a `HQ_TEAM_EMAIL` entry to `.env.example`**

```bash
grep -q "HQ_TEAM_EMAIL" .env.example || echo "HQ_TEAM_EMAIL=ops@hq-aviation.example" >> .env.example
```

- [ ] **Step 4: Commit**

```bash
git add api/stripe.js .env.example
git commit -m "feat(webhook): referral redemption flips owner record + emails HQ team"
```

---

### Task 9: Webhook redemption — tests

**Files:**
- Modify: `api/stripe.test.js`

- [ ] **Step 1: Append redemption tests**

```js
describe('webhook — referral redemption', () => {
  // Reuse the in-memory mock from Task 6. Add a `bookingsStore` Map alongside
  // `referralCodesStore`, and extend the firebase-admin mock to back the
  // `bookings` collection with that store. Track update calls explicitly.

  const bookingsStore = new Map();
  const updateSpy = vi.fn();
  const emailSpy = vi.fn();

  beforeEach(() => {
    bookingsStore.clear();
    updateSpy.mockClear();
    emailSpy.mockClear();
  });

  // Mock the email helper at module-export level if exposed; otherwise
  // export `sendReferralRedeemedEmail` from `api/stripe.js` and import it here.

  it('flips referralCompleted on the owner booking when friend succeeds', async () => {
    bookingsStore.set('pi_owner', { customerName: 'O', customerEmail: 'o@x.com', referralCompleted: false });
    referralCodesStore.set('CCCC2345', { ownerPaymentIntentId: 'pi_owner', ownerEmail: 'o@x.com' });
    const event = {
      type: 'payment_intent.succeeded',
      data: { object: {
        id: 'pi_friend',
        amount: 18000,
        metadata: { productType: 'discovery-flight', aircraft: 'r22', duration: '30', referredByCode: 'CCCC2345', customerName: 'F', customerEmail: 'f@x.com', customerPhone: '+44' },
      } },
    };
    const { handleWebhook } = await import('./stripe.js');
    await handleWebhook({ headers: { 'stripe-signature': 'test' }, rawBody: JSON.stringify(event) }, { json: () => {}, status: () => ({ json: () => {} }) });
    expect(bookingsStore.get('pi_owner').referralCompleted).toBe(true);
  });

  it('is idempotent — does not re-flag or re-email when already completed', async () => {
    bookingsStore.set('pi_owner', { referralCompleted: true });
    referralCodesStore.set('DDDD2345', { ownerPaymentIntentId: 'pi_owner', ownerEmail: 'o@x.com' });
    // ...as above; expect updateSpy NOT to be called for the owner doc.
    expect(updateSpy).not.toHaveBeenCalled();
  });

  it('does not flip when owner PI is refunded (Stripe charge.refunded=true)', async () => {
    // Override the stripe mock for this test so owner PI's latest_charge is refunded.
    // Expect bookingsStore.get('pi_owner').referralCompleted to remain false.
  });
});
```

(The third test left as a one-liner — extend the `stripe` mock at file scope to support per-test overrides. Engineer should follow the pattern shown in the first two tests.)

- [ ] **Step 2: Run**

```bash
npx vitest run api/stripe.test.js
```

Expected: all pass.

- [ ] **Step 3: Commit**

```bash
git add api/stripe.test.js
git commit -m "test(webhook): referral redemption flip + idempotency + refunded owner skip"
```

---

### Task 10: `GET /api/booking/:paymentIntentId` endpoint

**Files:**
- Create: `api/booking.js`
- Modify: `server.js`

- [ ] **Step 1: Create the handler**

Create `api/booking.js`:

```js
const admin = require('firebase-admin');

/**
 * Returns the booking record for `/booking-confirmed` and `/upgrade` to render
 * server-truth state. The PI ID itself is the access token — no auth header needed.
 * Sensitive Stripe internals (raw client_secret, etc.) are not exposed.
 */
async function getBooking(req, res) {
  const { paymentIntentId } = req.params;
  if (!paymentIntentId || typeof paymentIntentId !== 'string') {
    return res.status(400).json({ error: 'paymentIntentId required' });
  }
  try {
    const snap = await admin.firestore().collection('bookings').doc(paymentIntentId).get();
    if (!snap.exists) return res.status(404).json({ error: 'Booking not found' });
    const data = snap.data();
    // Whitelist fields we expose
    const safe = {
      paymentIntentId,
      customerName: data.customerName || '',
      customerEmail: data.customerEmail || '',
      productType: data.productType || 'discovery-flight',
      aircraft: data.aircraft || null,
      aircraftName: data.aircraftName || null,
      duration: data.duration || null,
      flightAmountPence: data.flightAmountPence || 0,
      totalAmountPence: data.totalAmountPence || 0,
      addons: data.addons || [],
      voucher: data.voucher || null,
      referralCode: data.referralCode || null,
      referredByCode: data.referredByCode || null,
      referralCompleted: !!data.referralCompleted,
      referralFreeItemSnapshot: data.referralFreeItemSnapshot || null,
      upgrade: data.upgrade || null,
      originalAircraft: data.originalAircraft || null,
      originalDuration: data.originalDuration || null,
    };
    res.json(safe);
  } catch (err) {
    console.error('[api/booking] error:', err.message);
    res.status(500).json({ error: 'Internal error' });
  }
}

module.exports = { getBooking };
```

- [ ] **Step 2: Mount in `server.js`**

Find where other API routes are mounted (around the `create-payment-intent` registration). Add:

```js
const { getBooking } = require('./api/booking');
app.get('/api/booking/:paymentIntentId', getBooking);
```

- [ ] **Step 3: Smoke check**

Start dev server (`npm run dev`), then:

```bash
curl -i http://localhost:7500/api/booking/pi_doesnotexist
```

Expected: HTTP 404 `{"error":"Booking not found"}`.

- [ ] **Step 4: Commit**

```bash
git add api/booking.js server.js
git commit -m "feat(api): GET /api/booking/:pid returns booking record for confirmation/upgrade pages"
```

---

### Task 11: Capture `?ref=` in `Checkout.jsx`

**Files:**
- Modify: `src/pages/Checkout.jsx`

- [ ] **Step 1: Capture once at mount**

In `src/pages/Checkout.jsx`, near the top of the `Checkout` component (after `searchParams` is destructured), add:

```jsx
const [referredByCode] = useState(() => {
  const raw = searchParams.get('ref') || '';
  return /^[A-Za-z0-9]{8}$/.test(raw.trim()) ? raw.trim().toUpperCase() : '';
});
```

(This deliberately runs only on mount — not on every render — so navigation that strips `?ref=` later doesn't lose the value. The Checkout component does not unmount during the inline email-first → full form transition, so a single `useState` is sufficient.)

- [ ] **Step 2: Pass it to `CheckoutForm`**

Find the JSX where `<CheckoutForm … />` is rendered. Add the prop:

```jsx
<CheckoutForm
  /* ...existing props... */
  prefillEmail={email}
  cartId={cartId}
  referredByCode={referredByCode}
/>
```

- [ ] **Step 3: Forward it in the API call**

In `CheckoutForm`, add `referredByCode` to the destructure:

```jsx
function CheckoutForm({
  aircraft, duration, price,
  wantsVoucher, setWantsVoucher, voucherLocation, setVoucherLocation, voucherMessage, setVoucherMessage,
  addons, addonsState, addonsTotalPence,
  prefillEmail, cartId, referredByCode,
}) {
```

In `handleSubmit`, in the `body: JSON.stringify({ … })` block of the `create-payment-intent` call, add `referredByCode`:

```jsx
body: JSON.stringify({
  /* ...existing fields... */
  cartId: cartId || '',
  ...(referredByCode ? { referredByCode } : {}),
}),
```

- [ ] **Step 4: Verify no UI changes**

Hard-reload `/training/trial-lessons` → checkout in dev. Confirm there is *no* visible referral field, no expander, no hint at all.

- [ ] **Step 5: Commit**

```bash
git add src/pages/Checkout.jsx
git commit -m "feat(checkout): silently capture ?ref= URL param and forward as referredByCode"
```

---

### Task 12: Update server's create-PI route handler to accept `referredByCode`

**Files:**
- Modify: `server.js`

- [ ] **Step 1: Find and update the route handler**

```bash
grep -n "create-payment-intent" server.js
```

In the handler, ensure `referredByCode` is destructured from `req.body` and passed through to `createPaymentIntent`:

```js
const { aircraft, duration, customerName, customerEmail, customerPhone, wantsVoucher, voucherLocation, voucherMessage, addons, fulfilment, shippingAddress, cartId, referredByCode } = req.body;
const pi = await createPaymentIntent({ aircraft, duration, customerName, customerEmail, customerPhone, wantsVoucher, voucherLocation, voucherMessage, addons, fulfilment, shippingAddress, cartId, referredByCode });
```

- [ ] **Step 2: Commit**

```bash
git add server.js
git commit -m "feat(server): forward referredByCode from request body to createPaymentIntent"
```

---

### Task 13: `<ProductInfoModal>` component

**Files:**
- Create: `src/components/booking/ProductInfoModal.jsx`

- [ ] **Step 1: Write the component**

Create `src/components/booking/ProductInfoModal.jsx`:

```jsx
import { useEffect, useState } from 'react';

export default function ProductInfoModal({ open, item, onClose }) {
  const [activeImg, setActiveImg] = useState(0);

  useEffect(() => {
    if (!open) return;
    function onKey(e) { if (e.key === 'Escape') onClose(); }
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open, onClose]);

  useEffect(() => { setActiveImg(0); }, [item?.id]);

  if (!open || !item) return null;

  const images = Array.isArray(item.images) ? item.images : [];
  const primary = images[activeImg];

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label={item.name}
      style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.6)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }}
      onClick={onClose}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{ background: '#fff', borderRadius: '12px', padding: '24px', maxWidth: '560px', width: 'calc(100% - 32px)', maxHeight: 'calc(100vh - 64px)', overflowY: 'auto', fontFamily: "'Space Grotesk', sans-serif" }}
      >
        <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '8px' }}>
          <button type="button" onClick={onClose} aria-label="Close" style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '1.4rem', color: '#666' }}>×</button>
        </div>
        {primary && (
          <div style={{ marginBottom: '16px', textAlign: 'center' }}>
            <img src={primary.url} alt={primary.alt || item.name} style={{ maxWidth: '100%', maxHeight: '320px', objectFit: 'contain', borderRadius: '8px' }} />
            {images.length > 1 && (
              <div style={{ display: 'flex', justifyContent: 'center', gap: '6px', marginTop: '8px' }}>
                {images.map((img, i) => (
                  <button
                    key={img.url}
                    onClick={() => setActiveImg(i)}
                    aria-label={`Image ${i + 1}`}
                    style={{ width: '40px', height: '40px', padding: 0, border: i === activeImg ? '2px solid #1a1a1a' : '1px solid #d1d5db', borderRadius: '4px', cursor: 'pointer', background: 'transparent' }}
                  >
                    <img src={img.url} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '2px' }} />
                  </button>
                ))}
              </div>
            )}
          </div>
        )}
        <h2 style={{ fontSize: '1.25rem', fontWeight: 700, margin: '0 0 8px' }}>{item.name}</h2>
        {item.description && (
          <p style={{ fontSize: '0.95rem', color: '#444', lineHeight: 1.6, margin: 0 }}>{item.description}</p>
        )}
        <div style={{ marginTop: '20px', textAlign: 'right' }}>
          <button
            type="button"
            onClick={onClose}
            style={{ padding: '10px 20px', background: '#1a1a1a', color: '#fff', border: 'none', borderRadius: '6px', cursor: 'pointer', fontSize: '0.9rem', fontWeight: 600 }}
          >Got it</button>
        </div>
      </div>
    </div>
  );
}
```

- [ ] **Step 2: Commit**

```bash
git add src/components/booking/ProductInfoModal.jsx
git commit -m "feat(components): ProductInfoModal — lightweight item info viewer"
```

---

### Task 14: `<ReferralOfferCard>` component

**Files:**
- Create: `src/components/booking/ReferralOfferCard.jsx`

- [ ] **Step 1: Write the component**

Create `src/components/booking/ReferralOfferCard.jsx`:

```jsx
import { useState } from 'react';
import ProductInfoModal from './ProductInfoModal';

const fmtGbp = (pence) => `£${(Number(pence) / 100).toLocaleString('en-GB', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

export default function ReferralOfferCard({ booking, freeItem }) {
  const [modalOpen, setModalOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  const [shareSheetSupported] = useState(typeof navigator !== 'undefined' && typeof navigator.share === 'function');

  if (!booking?.referralCode || !freeItem) return null;

  const shareUrl = `${typeof window !== 'undefined' ? window.location.origin : ''}/training/trial-lessons?ref=${booking.referralCode}`;
  const primaryImage = (freeItem.images || []).find((i) => i.isPrimary) || (freeItem.images || [])[0];

  async function handleCopy() {
    try {
      await navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {}
  }

  async function handleShare() {
    try {
      await navigator.share({
        title: 'HQ Aviation Discovery Flight',
        text: 'Book a Discovery Flight at HQ Aviation:',
        url: shareUrl,
      });
    } catch {}
  }

  return (
    <>
      <div style={S.card}>
        <h3 style={S.title}>Refer a friend</h3>
        <p style={S.subtitle}>Share with a friend. When they book a Discovery Flight using your link, this is yours — collect at HQ.</p>

        <button
          type="button"
          onClick={() => setModalOpen(true)}
          style={S.itemRow}
          aria-label={`View details of ${freeItem.name}`}
        >
          {primaryImage ? (
            <img src={primaryImage.url} alt={freeItem.name} style={S.thumb} />
          ) : (
            <div style={S.thumbPlaceholder} aria-hidden="true" />
          )}
          <div style={S.itemInfo}>
            <div style={S.itemName}>{freeItem.name}</div>
            <div style={S.priceRow}>
              {freeItem.price > 0 && <span style={S.priceStrike}>{fmtGbp(freeItem.price)}</span>}
              <span style={S.freePill}>FREE</span>
            </div>
          </div>
        </button>

        <div style={S.actions}>
          <button type="button" onClick={handleCopy} style={S.primaryBtn}>
            {copied ? '✓ Link copied' : 'Copy share link'}
          </button>
          {shareSheetSupported && (
            <button type="button" onClick={handleShare} style={S.secondaryBtn}>Share via…</button>
          )}
        </div>
      </div>

      <ProductInfoModal
        open={modalOpen}
        item={freeItem}
        onClose={() => setModalOpen(false)}
      />
    </>
  );
}

const S = {
  card: { background: '#fff', borderRadius: '12px', border: '1px solid #e8e8e8', padding: '24px', display: 'flex', flexDirection: 'column' },
  title: { fontSize: '1rem', fontWeight: 700, margin: '0 0 6px', textTransform: 'uppercase', letterSpacing: '0.05em' },
  subtitle: { fontSize: '0.85rem', color: '#666', margin: '0 0 16px', lineHeight: 1.5 },
  itemRow: { display: 'grid', gridTemplateColumns: '64px 1fr', gap: '12px', alignItems: 'center', background: '#faf9f6', border: '1px solid #e8e6e2', borderRadius: '8px', padding: '12px', cursor: 'pointer', textAlign: 'left', marginBottom: '16px' },
  thumb: { width: 64, height: 64, objectFit: 'cover', borderRadius: 6, border: '1px solid #e8e6e2' },
  thumbPlaceholder: { width: 64, height: 64, borderRadius: 6, border: '1px dashed #e8e6e2', background: '#fff' },
  itemInfo: { minWidth: 0 },
  itemName: { fontWeight: 600, fontSize: '0.95rem', marginBottom: '4px' },
  priceRow: { display: 'flex', alignItems: 'baseline', gap: '8px' },
  priceStrike: { color: '#999', textDecoration: 'line-through', fontSize: '0.85rem' },
  freePill: { background: '#10b981', color: '#fff', fontSize: '0.7rem', fontWeight: 700, padding: '2px 8px', borderRadius: '4px', letterSpacing: '0.05em' },
  actions: { display: 'flex', gap: '8px', flexWrap: 'wrap' },
  primaryBtn: { flex: '1 1 auto', padding: '12px', background: '#1a1a1a', color: '#fff', border: 'none', borderRadius: '8px', fontWeight: 600, fontSize: '0.9rem', cursor: 'pointer' },
  secondaryBtn: { flex: '0 0 auto', padding: '12px 16px', background: '#fff', color: '#1a1a1a', border: '1px solid #d1d5db', borderRadius: '8px', fontWeight: 600, fontSize: '0.9rem', cursor: 'pointer' },
};
```

- [ ] **Step 2: Commit**

```bash
git add src/components/booking/ReferralOfferCard.jsx
git commit -m "feat(components): ReferralOfferCard with copy-link, share-sheet, modal"
```

---

### Task 15: `<PostCheckoutOffers>` shell

**Files:**
- Create: `src/components/booking/PostCheckoutOffers.jsx`

- [ ] **Step 1: Write the component**

Create `src/components/booking/PostCheckoutOffers.jsx`:

```jsx
import ReferralOfferCard from './ReferralOfferCard';

export default function PostCheckoutOffers({ booking, freeReferralItem }) {
  if (!booking) return null;
  if (booking.productType === 'misc') return null;

  // Voucher-only edge case
  const isVoucherOnly = booking.voucher?.active === true
    && (!booking.addons || booking.addons.length === 0)
    && (!booking.flightAmountPence || booking.flightAmountPence === 0);
  if (isVoucherOnly) return null;

  const showReferral = !!(booking.referralCode && freeReferralItem);
  if (!showReferral) return null; // Plan C will add the upgrade card here

  return (
    <div style={S.wrap}>
      <div style={S.grid} className="pc-offers-grid">
        <style>{`
          @media (min-width: 768px) {
            .pc-offers-grid { grid-template-columns: 1fr 1fr; }
          }
        `}</style>
        {showReferral && <ReferralOfferCard booking={booking} freeItem={freeReferralItem} />}
      </div>
      <p style={S.note}>These offers are also in your confirmation email — claim later if you'd rather think about it.</p>
    </div>
  );
}

const S = {
  wrap: { margin: '24px 0' },
  grid: { display: 'grid', gridTemplateColumns: '1fr', gap: '16px' },
  note: { fontSize: '0.8rem', color: '#999', textAlign: 'center', marginTop: '12px', fontStyle: 'italic' },
};
```

- [ ] **Step 2: Commit**

```bash
git add src/components/booking/PostCheckoutOffers.jsx
git commit -m "feat(components): PostCheckoutOffers shell (referral card; upgrade card lands in Plan C)"
```

---

### Task 16: Tests for `<PostCheckoutOffers>` and `<ReferralOfferCard>`

**Files:**
- Create: `src/components/booking/PostCheckoutOffers.test.jsx`

- [ ] **Step 1: Write the tests**

Create `src/components/booking/PostCheckoutOffers.test.jsx`:

```jsx
import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import PostCheckoutOffers from './PostCheckoutOffers';

const baseBooking = {
  productType: 'discovery-flight',
  aircraft: 'r22',
  duration: 30,
  flightAmountPence: 18000,
  totalAmountPence: 18000,
  referralCode: 'ABCD2345',
  customerName: 'Maximus',
  customerEmail: 'm@x.com',
};

const freeItem = {
  id: 'tee-1',
  name: 'HQ Tee',
  price: 2500,
  description: 'Soft cotton tee.',
  images: [{ url: 'https://example/img.jpg', isPrimary: true }],
};

describe('PostCheckoutOffers', () => {
  it('returns null for misc bookings', () => {
    const { container } = render(<PostCheckoutOffers booking={{ ...baseBooking, productType: 'misc' }} freeReferralItem={freeItem} />);
    expect(container).toBeEmptyDOMElement();
  });

  it('returns null when no referralCode', () => {
    const { container } = render(<PostCheckoutOffers booking={{ ...baseBooking, referralCode: null }} freeReferralItem={freeItem} />);
    expect(container).toBeEmptyDOMElement();
  });

  it('returns null when no freeReferralItem flagged', () => {
    const { container } = render(<PostCheckoutOffers booking={baseBooking} freeReferralItem={null} />);
    expect(container).toBeEmptyDOMElement();
  });

  it('renders the referral card when both are present', () => {
    render(<PostCheckoutOffers booking={baseBooking} freeReferralItem={freeItem} />);
    expect(screen.getByText(/Refer a friend/i)).toBeInTheDocument();
    expect(screen.getByText('HQ Tee')).toBeInTheDocument();
    expect(screen.getByText('FREE')).toBeInTheDocument();
  });

  it('does not display the bare referral code on screen', () => {
    render(<PostCheckoutOffers booking={baseBooking} freeReferralItem={freeItem} />);
    expect(screen.queryByText('ABCD2345')).toBeNull();
  });

  it('copies the share link (with code) to clipboard on Copy', async () => {
    const writeText = vi.fn(() => Promise.resolve());
    Object.assign(navigator, { clipboard: { writeText } });
    render(<PostCheckoutOffers booking={baseBooking} freeReferralItem={freeItem} />);
    fireEvent.click(screen.getByRole('button', { name: /Copy share link/i }));
    expect(writeText).toHaveBeenCalledTimes(1);
    expect(writeText.mock.calls[0][0]).toMatch(/\/training\/trial-lessons\?ref=ABCD2345$/);
  });

  it('opens the product info modal on item click', () => {
    render(<PostCheckoutOffers booking={baseBooking} freeReferralItem={freeItem} />);
    fireEvent.click(screen.getByLabelText(/View details of HQ Tee/i));
    expect(screen.getByRole('dialog', { name: /HQ Tee/i })).toBeInTheDocument();
    expect(screen.getByText(/Soft cotton tee\./i)).toBeInTheDocument();
  });
});
```

- [ ] **Step 2: Run**

```bash
npx vitest run src/components/booking/PostCheckoutOffers.test.jsx
```

Expected: 7 passing tests.

- [ ] **Step 3: Commit**

```bash
git add src/components/booking/PostCheckoutOffers.test.jsx
git commit -m "test(components): PostCheckoutOffers conditional rendering + share link + modal"
```

---

### Task 17: Wire `<PostCheckoutOffers>` into `BookingConfirmed`

**Files:**
- Modify: `src/pages/BookingConfirmed.jsx`

- [ ] **Step 1: Fetch the booking record**

In `src/pages/BookingConfirmed.jsx`, add state for booking + freeItem:

```jsx
import { useEffect, useState } from 'react';
import { collection, query, where, getDocs, doc, getDoc } from 'firebase/firestore';
import { db } from '../lib/firebase';
import PostCheckoutOffers from '../components/booking/PostCheckoutOffers';
```

Inside the component, replace the existing `useEffect` (the one that fires the `purchase` event) with — or add alongside — a fetch effect:

```jsx
const [booking, setBooking] = useState(null);
const [freeReferralItem, setFreeReferralItem] = useState(null);

useEffect(() => {
  if (!ref) return;
  let cancelled = false;
  (async () => {
    try {
      const res = await fetch(`/api/booking/${encodeURIComponent(ref)}`);
      if (!res.ok) return;
      const data = await res.json();
      if (!cancelled) setBooking(data);
    } catch {}
  })();
  return () => { cancelled = true; };
}, [ref]);

useEffect(() => {
  let cancelled = false;
  (async () => {
    try {
      const q = query(collection(db, 'misc_items'), where('freeReferralOffer', '==', true));
      const snap = await getDocs(q);
      if (snap.empty) return;
      const d = snap.docs[0];
      if (!cancelled) setFreeReferralItem({ id: d.id, ...d.data() });
    } catch {}
  })();
  return () => { cancelled = true; };
}, []);
```

- [ ] **Step 2: Render the offers block**

Find the closing of the booking summary `<div style={styles.card}>…</div>` block. Immediately after it, before the `<p style={styles.nextStep}>`, insert:

```jsx
{!isMisc && (
  <PostCheckoutOffers booking={booking} freeReferralItem={freeReferralItem} />
)}
```

- [ ] **Step 3: Build**

```bash
npx vite build 2>&1 | tail -3
```

Expected: build succeeds.

- [ ] **Step 4: Commit**

```bash
git add src/pages/BookingConfirmed.jsx
git commit -m "feat(booking-confirmed): fetch booking record + render PostCheckoutOffers"
```

---

### Task 18: Tests for `BookingConfirmed`

**Files:**
- Create: `src/pages/BookingConfirmed.test.jsx`

- [ ] **Step 1: Write the tests**

Create `src/pages/BookingConfirmed.test.jsx`:

```jsx
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import BookingConfirmed from './BookingConfirmed';

vi.mock('../lib/firebase', () => ({ db: {} }));
vi.mock('firebase/firestore', () => ({
  collection: vi.fn(),
  query: vi.fn(),
  where: vi.fn(),
  getDocs: vi.fn(() => Promise.resolve({ empty: true, docs: [] })),
  doc: vi.fn(),
  getDoc: vi.fn(),
}));
vi.mock('../lib/analytics', () => ({ trackEvent: vi.fn() }));

const fetchSpy = vi.spyOn(global, 'fetch');

beforeEach(() => fetchSpy.mockReset());

function renderAt(search) {
  return render(
    <MemoryRouter initialEntries={[`/booking-confirmed${search}`]}>
      <BookingConfirmed />
    </MemoryRouter>
  );
}

describe('BookingConfirmed', () => {
  it('does not render PostCheckoutOffers for misc bookings', async () => {
    fetchSpy.mockResolvedValue({ ok: true, json: () => ({ productType: 'misc' }) });
    renderAt('?ref=pi_misc&type=misc&itemName=Cap');
    await waitFor(() => screen.getByText(/Purchase Confirmed/i));
    expect(screen.queryByText(/Refer a friend/i)).toBeNull();
  });

  it('does not render the referral card without a referralCode', async () => {
    fetchSpy.mockResolvedValue({ ok: true, json: () => ({ productType: 'discovery-flight', aircraft: 'r22', duration: 30, referralCode: null }) });
    renderAt('?ref=pi_x&aircraft=r22&duration=30&price=180&name=Max');
    await waitFor(() => screen.getByText(/Booking Confirmed/i));
    expect(screen.queryByText(/Refer a friend/i)).toBeNull();
  });
});
```

- [ ] **Step 2: Run**

```bash
npx vitest run src/pages/BookingConfirmed.test.jsx
```

Expected: 2 passing tests.

- [ ] **Step 3: Commit**

```bash
git add src/pages/BookingConfirmed.test.jsx
git commit -m "test(booking-confirmed): offers hidden for misc + when no referralCode"
```

---

### Task 19: Admin — `freeReferralOffer` toggle with single-of enforcement

**Files:**
- Modify: `src/pages/admin/AdminMiscItemEdit.jsx`

- [ ] **Step 1: Add `freeReferralOffer` to `EMPTY`**

In `src/pages/admin/AdminMiscItemEdit.jsx`, in the `EMPTY` constant, append:

```jsx
freeReferralOffer: false,
```

- [ ] **Step 2: Add the toggle UI**

Inside the form, after the Apparel section (added in Plan A) but before the Description section, insert:

```jsx
{form.priceType === 'fixed' && (
  <div>
    <label style={labelStyle}>Free Referral Offer</label>
    <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer', fontSize: '0.875rem', color: '#374151' }}>
      <input
        type="checkbox"
        checked={form.freeReferralOffer}
        onChange={(e) => set('freeReferralOffer', e.target.checked)}
      />
      Show as the free reward for referrals
    </label>
    <p style={{ fontSize: '0.75rem', color: '#6b7280', marginTop: '0.4rem' }}>
      Only one item across the store may be flagged. Saving with this ticked will untick the previous one.
    </p>
  </div>
)}
```

- [ ] **Step 3: Implement single-of enforcement in `handleSubmit`**

Add the imports near the top:

```jsx
import { collection, query, where, getDocs, runTransaction, doc, serverTimestamp } from 'firebase/firestore';
```

Replace the existing `if (isNew) { … } else { … }` block at the bottom of `handleSubmit` with:

```jsx
let displacedName = '';
if (payload.freeReferralOffer === true) {
  // Find any other item currently flagged and untick it in the same client-side
  // transaction as our save. Note: this is a best-effort enforcement at the
  // application level; admins are trusted not to bypass it via direct writes.
  const q = query(collection(db, 'misc_items'), where('freeReferralOffer', '==', true));
  const snap = await getDocs(q);
  await runTransaction(db, async (tx) => {
    for (const otherDoc of snap.docs) {
      if (otherDoc.id !== id) {
        tx.update(otherDoc.ref, { freeReferralOffer: false });
        if (!displacedName) displacedName = otherDoc.data().name || otherDoc.id;
      }
    }
    if (isNew) {
      const newRef = doc(collection(db, 'misc_items'));
      tx.set(newRef, { ...payload, createdAt: serverTimestamp() });
      // capture id for navigation after the transaction
      payload.__newId = newRef.id;
    } else {
      tx.update(doc(db, 'misc_items', id), payload);
    }
  });
  if (isNew) navigate(`/admin/misc/${payload.__newId}`);
} else {
  if (isNew) {
    const newId = await createDoc('misc_items', payload);
    navigate(`/admin/misc/${newId}`);
  } else {
    await updateDocById('misc_items', id, payload);
  }
}

if (displacedName) {
  // Light toast — reuse the existing error slot for a confirmation message.
  setError(`Replaced previous referral free-item: ${displacedName}`);
  setTimeout(() => setError(''), 4000);
}
```

(Note: this reuses the `setError` slot for a transient confirmation. If a proper toast component exists in the codebase, swap to that.)

- [ ] **Step 4: Verify in admin UI**

Smoke test: edit two misc items. Tick `freeReferralOffer` on item A, save. Tick on item B, save → confirm A's flag is now false.

- [ ] **Step 5: Commit**

```bash
git add src/pages/admin/AdminMiscItemEdit.jsx
git commit -m "feat(admin/misc): freeReferralOffer toggle with single-of enforcement (client tx)"
```

---

### Task 20: Confirmation email — referral CTA block

**Files:**
- Modify: `api/stripe.js` (the email composition function)

- [ ] **Step 1: Locate the existing confirmation email composer**

```bash
grep -nE "sendConfirmationEmail|Booking Confirmation|Discovery Flight.*confirmed" api/stripe.js | head
```

- [ ] **Step 2: Add a "Refer a friend" block when `referralCode` is available**

In the email composer for Discovery Flight bookings, after the booking summary section, add (adapt to the file's existing HTML composition style):

```js
const referralBlock = referralCode
  ? `
    <div style="margin: 32px 0; padding: 24px; background: #faf9f6; border-radius: 12px; border: 1px solid #e8e8e8;">
      <h2 style="margin: 0 0 12px; font-size: 18px;">Refer a friend</h2>
      <p style="margin: 0 0 16px; color: #444; line-height: 1.5;">
        Share this with a friend. When they book a Discovery Flight using your link, you get a free HQ item — collect it next time you're at HQ.
      </p>
      <a href="${process.env.PUBLIC_URL || 'https://hq-aviation.com'}/training/trial-lessons?ref=${escapeHtml(referralCode)}"
         style="display: inline-block; padding: 12px 20px; background: #1a1a1a; color: #fff; text-decoration: none; border-radius: 6px; font-weight: 600;">
        Share with a friend
      </a>
    </div>
  `
  : '';
```

(Insert `${referralBlock}` into the HTML body string.)

- [ ] **Step 3: Pass `referralCode` into the email composer**

In `sendConfirmationEmail` (or wherever the composer is invoked), ensure `referralCode` from `pi.metadata` is passed in.

- [ ] **Step 4: Smoke test**

Trigger a test Stripe webhook and verify the email body includes the referral link.

- [ ] **Step 5: Commit**

```bash
git add api/stripe.js
git commit -m "feat(email): refer-a-friend CTA block in Discovery Flight confirmation email"
```

---

### Task 21: End-to-end smoke test (Plan B complete)

- [ ] **Step 1: Start dev server**

```bash
npm run dev
```

- [ ] **Step 2: Admin: flag a misc item as `freeReferralOffer`**

Open `/admin/misc`, edit any fixed-price item, tick "Show as the free reward for referrals", save.

- [ ] **Step 3: Book a Discovery Flight as Customer X**

Use Stripe test card. Land on `/booking-confirmed`. Verify:
- The "Refer a friend" card is visible.
- It shows the flagged item with name + crossed-out price + green "FREE" pill.
- The bare referral code is NOT visible anywhere on the page.
- Click the item → modal opens with description/images. Click "Got it" → modal closes.
- Click "Copy share link" → toast/state changes to "Link copied". Paste somewhere — confirm URL contains `?ref=<8-char>`.
- Confirmation email arrives with the referral block + working link.

- [ ] **Step 4: Book again as Customer Y, opening Customer X's link**

In a different browser, open the share link. Complete booking. The Discovery Flight checkout should look identical to before — no referral hint.

- [ ] **Step 5: Verify referral was credited**

In Firestore, check `bookings/<X-pi>` — should have `referralCompleted=true`. Check `bookings/<Y-pi>` — should have `referredByCode=<X's code>`. Verify HQ team email arrived (check `HQ_TEAM_EMAIL` inbox or logs).

- [ ] **Step 6: Self-referral guard**

In yet another browser session, book as Customer X again (same email) using X's own share link. Confirm Y wasn't credited (no second email).

---

## Plan B — Done Criteria

- Every Discovery Flight booking has a `referralCode`.
- `referral_codes/<CODE>` exists for every active code.
- `/booking-confirmed` renders the offers block with a referral card whenever a free item is flagged.
- The bare code never appears on customer-facing UI.
- Friend's checkout has no referral UI.
- Webhook redemption flips `referralCompleted` exactly once per booking, emails HQ team, idempotent on retries.
- Refunded owner PIs do not credit referrals.
- Self-referrals do not credit.
- Admin `freeReferralOffer` toggle enforces single-of via client-side transaction.
- All new + existing tests pass.

## Out of Scope (this plan)

- Upgrade card on `/booking-confirmed` (Plan C).
- `/upgrade` route (Plan C).
- Server-enforced (vs client-enforced) single-of on `freeReferralOffer` (admin trust model — fine for MVP).
- Booker dashboard / referral status page.

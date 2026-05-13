import { describe, it, expect, beforeAll, afterAll, beforeEach } from 'vitest';
import {
  initializeTestEnvironment,
  assertSucceeds,
  assertFails,
} from '@firebase/rules-unit-testing';
import { readFileSync } from 'node:fs';
import { setDoc, doc, getDoc } from 'firebase/firestore';

let testEnv;

beforeAll(async () => {
  testEnv = await initializeTestEnvironment({
    projectId: 'hq-aviation-test',
    firestore: {
      rules: readFileSync('firestore.rules', 'utf8'),
      host: '127.0.0.1',
      port: 8080,
    },
  });
});

afterAll(async () => {
  await testEnv.cleanup();
});

beforeEach(async () => {
  await testEnv.clearFirestore();
});

// ---------------------------------------------------------------------------
// Public surface — anonymous (unauthenticated) clients
// ---------------------------------------------------------------------------
describe('firestore.rules — public surface (anonymous)', () => {
  // --- enquiries ---

  it('anonymous can create an enquiry with valid required fields', async () => {
    const db = testEnv.unauthenticatedContext().firestore();
    await assertSucceeds(
      setDoc(doc(db, 'enquiries/abc'), {
        email: 'hello@example.com',
        name: 'Test User',
        message: 'I would like to enquire about a helicopter.',
        createdAt: new Date(),
      }),
    );
  });

  it('anonymous can create an enquiry with all permitted optional fields', async () => {
    const db = testEnv.unauthenticatedContext().firestore();
    await assertSucceeds(
      setDoc(doc(db, 'enquiries/def'), {
        email: 'hello@example.com',
        name: 'Test User',
        message: 'Message body.',
        createdAt: new Date(),
        phone: '+44 1895 833373',
        subject: 'Discovery flight',
        source: 'homepage-cta',
        metadata: { utmSource: 'google' },
      }),
    );
  });

  it('anonymous CANNOT create an enquiry with an unknown / injection field', async () => {
    const db = testEnv.unauthenticatedContext().firestore();
    await assertFails(
      setDoc(doc(db, 'enquiries/abc'), {
        email: 'attacker@example.com',
        name: 'Attacker',
        message: 'Legit message',
        createdAt: new Date(),
        isAdmin: true, // not in the allowed key list
      }),
    );
  });

  it('anonymous CANNOT create an enquiry without required email field', async () => {
    const db = testEnv.unauthenticatedContext().firestore();
    await assertFails(
      setDoc(doc(db, 'enquiries/abc'), {
        name: 'No Email',
        message: 'Missing email field',
        createdAt: new Date(),
        // email intentionally omitted — rules require it
      }),
    );
  });

  // --- referral_codes (server-only, must be fully denied) ---

  it('anonymous CANNOT read referral_codes', async () => {
    const db = testEnv.unauthenticatedContext().firestore();
    await assertFails(getDoc(doc(db, 'referral_codes/some_code')));
  });

  it('anonymous CANNOT write referral_codes', async () => {
    const db = testEnv.unauthenticatedContext().firestore();
    await assertFails(setDoc(doc(db, 'referral_codes/fake_code'), { discount: 0.9 }));
  });

  // --- carts (server-only) ---

  it('anonymous CANNOT read carts', async () => {
    const db = testEnv.unauthenticatedContext().firestore();
    await assertFails(getDoc(doc(db, 'carts/session123')));
  });

  it('anonymous CANNOT write carts', async () => {
    const db = testEnv.unauthenticatedContext().firestore();
    await assertFails(setDoc(doc(db, 'carts/session123'), { email: 'x@example.com' }));
  });

  // --- gsc_daily (server-only) ---

  it('anonymous CANNOT read gsc_daily', async () => {
    const db = testEnv.unauthenticatedContext().firestore();
    await assertFails(getDoc(doc(db, 'gsc_daily/2026-05-01')));
  });

  // --- public reads that should succeed ---

  it('anonymous CAN read helicopter listings', async () => {
    const db = testEnv.unauthenticatedContext().firestore();
    await assertSucceeds(getDoc(doc(db, 'helicopters/r44-raven-ii')));
  });

  it('anonymous CAN read blog posts', async () => {
    const db = testEnv.unauthenticatedContext().firestore();
    await assertSucceeds(getDoc(doc(db, 'blog_posts/intro-to-helicopters')));
  });
});

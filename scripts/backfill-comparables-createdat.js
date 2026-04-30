'use strict';
/**
 * One-shot fix: backfill `createdAt` on `comparables` docs that lost it
 * when the seed script re-ran with `merge: false`.
 *
 * Sets createdAt = existing updatedAt (best available stand-in for the
 * original creation timestamp, which is unrecoverable).
 *
 * Safe to re-run — no-ops on docs that already have createdAt.
 *
 *   node scripts/backfill-comparables-createdat.js
 */

require('dotenv').config();
const admin = require('firebase-admin');

if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert({
      projectId:   process.env.FIREBASE_PROJECT_ID,
      clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
      privateKey:  (process.env.FIREBASE_PRIVATE_KEY || '').replace(/\\n/g, '\n'),
    }),
  });
}
const db = admin.firestore();

(async () => {
  const snap = await db.collection('comparables').get();
  let patched = 0;
  for (const d of snap.docs) {
    const data = d.data();
    if (data.createdAt) continue;
    const fallback = data.updatedAt || admin.firestore.FieldValue.serverTimestamp();
    await d.ref.update({ createdAt: fallback });
    console.log(`backfilled createdAt on ${d.id}`);
    patched += 1;
  }
  console.log(`Done. Patched ${patched} doc(s).`);
  process.exit(0);
})();

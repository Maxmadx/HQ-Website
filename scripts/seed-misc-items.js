'use strict';
/**
 * Seed script: misc_items collection
 * Run with: node scripts/seed-misc-items.js
 * Requires: FIREBASE_PROJECT_ID, FIREBASE_CLIENT_EMAIL, FIREBASE_PRIVATE_KEY in .env
 *
 * Safe to re-run — existing docs are updated, not duplicated.
 * Images are not seeded here — add them via /admin/misc after running.
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

const MISC_ITEMS = [
  // ── Ground Equipment ───────────────────────────────────────────────────────
  { id: 'misc_cover_r22',       name: 'Helicopter Cover (R22)',  category: 'Ground Equipment', priceDisplay: 'POA', condition: 'new', description: '' },
  { id: 'misc_cover_r44',       name: 'Helicopter Cover (R44)',  category: 'Ground Equipment', priceDisplay: 'POA', condition: 'new', description: '' },
  { id: 'misc_mover',           name: 'Helicopter Mover',        category: 'Ground Equipment', priceDisplay: 'POA', condition: 'new', description: '' },
  { id: 'misc_start_stick',     name: 'Start Stick',             category: 'Ground Equipment', priceDisplay: 'POA', condition: 'new', description: '' },

  // ── Training Materials ─────────────────────────────────────────────────────
  { id: 'misc_pooleys_logbook', name: 'Pooleys Logbook',         category: 'Logbooks',         priceDisplay: 'POA', condition: 'new', description: '' },
  { id: 'misc_revision_material', name: 'Revision Material',     category: 'Training Materials', priceDisplay: 'POA', condition: 'new', description: '' },

  // ── Apparel ────────────────────────────────────────────────────────────────
  { id: 'misc_hq_merch',        name: 'HQ Merchandise',          category: 'Apparel',          priceDisplay: 'POA', condition: 'new', description: '' },
];

async function seed() {
  const col = db.collection('misc_items');
  let created = 0;
  let updated = 0;

  for (const item of MISC_ITEMS) {
    const { id, ...data } = item;
    const ref = col.doc(id);
    const snap = await ref.get();
    if (snap.exists) {
      await ref.update({ ...data, updatedAt: admin.firestore.FieldValue.serverTimestamp() });
      console.log(`  updated  ${id}`);
      updated++;
    } else {
      await ref.set({ ...data, images: [], createdAt: admin.firestore.FieldValue.serverTimestamp(), updatedAt: admin.firestore.FieldValue.serverTimestamp() });
      console.log(`  created  ${id}`);
      created++;
    }
  }

  console.log(`\nDone. Created: ${created}  Updated: ${updated}`);
  process.exit(0);
}

seed().catch((err) => { console.error(err); process.exit(1); });

'use strict';
/**
 * Seed script: image_slots collection
 * Run with: node scripts/seed-image-slots.js
 * Requires: FIREBASE_PROJECT_ID, FIREBASE_CLIENT_EMAIL, FIREBASE_PRIVATE_KEY in .env
 */

require('dotenv').config();
const admin = require('firebase-admin');

if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert({
      projectId: process.env.FIREBASE_PROJECT_ID,
      clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
      privateKey: (process.env.FIREBASE_PRIVATE_KEY || '').replace(/\\n/g, '\n'),
    }),
  });
}

const db = admin.firestore();

const SLOTS = [
  // Home
  { slotId: 'home-hero-background',        page: 'home', description: 'Flying section parallax background on home page', alt: 'HQ Aviation helicopter in flight' },
  { slotId: 'home-maintenance-background', page: 'home', description: 'Maintenance section parallax background on home page', alt: 'HQ Aviation maintenance facility' },
  { slotId: 'home-sales-background',       page: 'home', description: 'Sales section parallax background on home page', alt: 'HQ Aviation aircraft sales' },
  { slotId: 'home-fleet-r44', page: 'home', description: 'R44 image on home page fleet section', alt: 'Robinson R44 helicopter' },
  { slotId: 'home-fleet-r66', page: 'home', description: 'R66 image on home page fleet section', alt: 'Robinson R66 helicopter' },
  // Maintenance
  { slotId: 'maintenance-hero', page: 'maintenance', description: 'Maintenance page hero', alt: 'HQ Aviation maintenance hangar' },
  { slotId: 'maintenance-cert-logo', page: 'maintenance', description: 'Robinson Authorised Service Center logo', alt: 'Robinson Authorised Service Center' },
  { slotId: 'maintenance-facility-1', page: 'maintenance', description: 'Facility photo 1', alt: 'HQ Aviation facility' },
  { slotId: 'maintenance-facility-2', page: 'maintenance', description: 'Facility photo 2', alt: 'HQ Aviation facility interior' },
  // Sales
  { slotId: 'sales-hero', page: 'sales', description: 'Sales page hero background', alt: 'Helicopter for sale' },
  // Training
  { slotId: 'training-hero', page: 'training', description: 'Training page hero', alt: 'Pilot training at HQ Aviation' },
  { slotId: 'training-discovery-flight', page: 'training', description: 'Discovery flight booking image', alt: 'Discovery flight experience' },
  // Expeditions
  { slotId: 'expeditions-hero', page: 'expeditions', description: 'Expeditions page hero', alt: 'Helicopter expedition' },
  // About
  { slotId: 'about-founder', page: 'about', description: 'Founder / team photo', alt: 'HQ Aviation founder' },
  { slotId: 'about-hangar', page: 'about', description: 'Hangar exterior photo', alt: 'HQ Aviation hangar' },
  // Contact
  { slotId: 'contact-hero', page: 'contact', description: 'Contact page background', alt: 'Contact HQ Aviation' },
];

async function seed() {
  const col = db.collection('image_slots');
  const existing = await col.get();
  const existingSlotIds = new Set(existing.docs.map((d) => d.data().slotId));

  let created = 0;
  let skipped = 0;

  for (const slot of SLOTS) {
    if (existingSlotIds.has(slot.slotId)) {
      console.log(`  skip  ${slot.slotId}`);
      skipped++;
      continue;
    }
    await col.add({
      ...slot,
      url: '',
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
      updatedAt: admin.firestore.FieldValue.serverTimestamp(),
    });
    console.log(`  added ${slot.slotId}`);
    created++;
  }

  console.log(`\nDone. Created: ${created}  Skipped (already exist): ${skipped}`);
  process.exit(0);
}

seed().catch((err) => {
  console.error(err);
  process.exit(1);
});

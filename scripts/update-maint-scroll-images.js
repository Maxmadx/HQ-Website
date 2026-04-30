'use strict';
/**
 * Overwrites site_images/home-maint-scroll-1 and site_images/home-maint-scroll-2
 * in Firestore with the eyeinthesky/* images. Run once after copying the JPGs
 * into public/assets/images/facility/eyeinthesky/.
 *
 * Run with: node scripts/update-maint-scroll-images.js
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

const ROW_1 = {
  docId: 'home-maint-scroll-1',
  name: 'Maintenance — Scroll Gallery Row 1',
  images: [
    { id: 'ms1', url: '/assets/images/facility/eyeinthesky/24__JWD5077_lr.jpg', alt: 'Maintenance facility' },
    { id: 'ms2', url: '/assets/images/facility/eyeinthesky/25__JWD5068_lr.jpg', alt: 'Engineering workshop' },
    { id: 'ms3', url: '/assets/images/facility/eyeinthesky/26__JWD5076_lr.jpg', alt: 'Engine work' },
    { id: 'ms4', url: '/assets/images/facility/eyeinthesky/27_IMG_5177_lr.jpg', alt: 'Rotor inspection' },
    { id: 'ms5', url: '/assets/images/facility/eyeinthesky/28__JWD5290_lr.jpg', alt: 'Hangar floor' },
  ],
};

const ROW_2 = {
  docId: 'home-maint-scroll-2',
  name: 'Maintenance — Scroll Gallery Row 2',
  images: [
    { id: 'mt1', url: '/assets/images/facility/eyeinthesky/29__JWD5277_lr.jpg', alt: 'Rebuild in progress' },
    { id: 'mt2', url: '/assets/images/facility/eyeinthesky/30__JWD5055_lr.jpg', alt: 'Avionics bench' },
    { id: 'mt3', url: '/assets/images/facility/eyeinthesky/31__JWD5262.jpg',    alt: 'Paint shop' },
    { id: 'mt4', url: '/assets/images/facility/eyeinthesky/32__JWD5267_lr.jpg', alt: 'Rotor blades' },
    { id: 'mt5', url: '/assets/images/facility/eyeinthesky/33__JWD5272_lr.jpg', alt: 'Workshop' },
  ],
};

async function writeRow(row) {
  await db.collection('site_images').doc(row.docId).set({
    page: 'home',
    name: row.name,
    type: 'gallery',
    images: row.images.map((img, i) => ({ ...img, order: i })),
    updatedAt: admin.firestore.FieldValue.serverTimestamp(),
  });
  console.log(`  wrote ${row.docId} (${row.images.length} images)`);
}

(async () => {
  await writeRow(ROW_1);
  await writeRow(ROW_2);
  console.log('\nDone.');
  process.exit(0);
})().catch((err) => {
  console.error(err);
  process.exit(1);
});

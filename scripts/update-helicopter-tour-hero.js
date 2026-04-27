'use strict';
/**
 * Overwrites site_images/helicopter-tour-hero in Firestore with the
 * eyeinthesky/46__JWD5194_lr.jpg London aerial.
 *
 * Run with: node scripts/update-helicopter-tour-hero.js
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

(async () => {
  await db.collection('site_images').doc('helicopter-tour-hero').set({
    page: 'helicopter-tour',
    name: 'Hero Background',
    type: 'single',
    images: [
      {
        id: 'hth1',
        url: '/assets/images/facility/eyeinthesky/46__JWD5194_lr.jpg',
        alt: 'London aerial view — Canary Wharf and the Thames at sunset',
        order: 0,
      },
    ],
    updatedAt: admin.firestore.FieldValue.serverTimestamp(),
  });
  console.log('  wrote helicopter-tour-hero');
  process.exit(0);
})().catch((err) => {
  console.error(err);
  process.exit(1);
});

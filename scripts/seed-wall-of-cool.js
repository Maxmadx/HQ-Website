'use strict';
/**
 * seed-wall-of-cool.js
 *
 * Seeds the Firestore wall_of_cool collection with all existing gallery images
 * (gallery/social, gallery/events, gallery/flying) as approved entries.
 *
 * Run: node scripts/seed-wall-of-cool.js
 * Safe to re-run — skips if collection already has data.
 */

require('dotenv').config({ path: require('path').join(__dirname, '../.env') });
const admin = require('../api/firebase-admin');

// All gallery images to seed — grouped by subfolder.
// Social images first (most relevant to "Wall of Cool"), then events, then flying.
const IMAGES = [
  // ── Social (community WhatsApp photos) ──────────────────────────────────────
  { url: '/assets/images/gallery/social/img-20241004-wa0005.jpg',  alt: 'HQ Aviation community' },
  { url: '/assets/images/gallery/social/img-20241004-wa0009.jpg',  alt: 'HQ Aviation community' },
  { url: '/assets/images/gallery/social/img-20241004-wa0011.jpg',  alt: 'HQ Aviation community' },
  { url: '/assets/images/gallery/social/img-20241004-wa0001.jpg',  alt: 'HQ Aviation community' },
  { url: '/assets/images/gallery/social/img-20241004-wa0002.jpg',  alt: 'HQ Aviation community' },
  { url: '/assets/images/gallery/social/img-20241004-wa0003.jpg',  alt: 'HQ Aviation community' },
  { url: '/assets/images/gallery/social/img-20241004-wa0006.jpg',  alt: 'HQ Aviation community' },
  { url: '/assets/images/gallery/social/img-20241004-wa0007.jpg',  alt: 'HQ Aviation community' },
  { url: '/assets/images/gallery/social/img-20241004-wa0008.jpg',  alt: 'HQ Aviation community' },
  { url: '/assets/images/gallery/social/img-20241004-wa0014.jpg',  alt: 'HQ Aviation community' },
  { url: '/assets/images/gallery/social/img-20241004-wa0016.jpg',  alt: 'HQ Aviation community' },
  { url: '/assets/images/gallery/social/img-20241004-wa0017.jpg',  alt: 'HQ Aviation community' },
  { url: '/assets/images/gallery/social/img-20241004-wa0018.jpg',  alt: 'HQ Aviation community' },
  { url: '/assets/images/gallery/social/img-20241004-wa0021.jpg',  alt: 'HQ Aviation community' },
  { url: '/assets/images/gallery/social/img-20230514-wa0011.jpg',  alt: 'HQ Aviation community' },
  { url: '/assets/images/gallery/social/img-20230514-wa0006.jpg',  alt: 'HQ Aviation community' },
  { url: '/assets/images/gallery/social/img-20230425-wa0001.jpg',  alt: 'HQ Aviation team gathering' },
  { url: '/assets/images/gallery/social/img-20230425-wa0002.jpg',  alt: 'HQ Aviation community' },
  { url: '/assets/images/gallery/social/img-20230425-wa0003.jpg',  alt: 'HQ Aviation community' },
  { url: '/assets/images/gallery/social/img-20230412-wa0000.jpg',  alt: 'HQ Aviation community' },
  { url: '/assets/images/gallery/social/img-20230308-wa0001.jpg',  alt: 'HQ Aviation community' },
  { url: '/assets/images/gallery/social/img-20240113-wa0001.jpg',  alt: 'HQ Aviation community' },
  { url: '/assets/images/gallery/social/img-20240113-wa0003.jpg',  alt: 'HQ Aviation community' },
  { url: '/assets/images/gallery/social/img-20240119-wa0004.jpg',  alt: 'HQ Aviation community' },
  { url: '/assets/images/gallery/social/img-20180810-wa0011.jpg',  alt: 'HQ Aviation community' },
  { url: '/assets/images/gallery/social/img-20180812-wa0017.jpg',  alt: 'HQ Aviation community' },
  { url: '/assets/images/gallery/social/img-20180813-wa0014.jpg',  alt: 'HQ Aviation community' },
  { url: '/assets/images/gallery/social/whatsapp-image-2025-12-23-at-18.09.24.jpeg', alt: 'HQ Aviation community' },

  // ── Events ───────────────────────────────────────────────────────────────────
  { url: '/assets/images/gallery/events/img_1346.jpg',              alt: 'Aviation gathering at Denham' },
  { url: '/assets/images/gallery/events/img_1358-copy-281-29.jpg',  alt: 'HQ Aviation event' },
  { url: '/assets/images/gallery/events/img_1539.jpg',              alt: 'HQ Aviation event' },
  { url: '/assets/images/gallery/events/img_1638.jpg',              alt: 'HQ Aviation event' },
  { url: '/assets/images/gallery/events/img_2028.jpg',              alt: 'HQ Aviation event' },
  { url: '/assets/images/gallery/events/img_2103.jpg',              alt: 'HQ Aviation event' },
  { url: '/assets/images/gallery/events/img_2131.jpg',              alt: 'HQ Aviation event' },
  { url: '/assets/images/gallery/events/img_2199.jpg',              alt: 'HQ Aviation event' },
  { url: '/assets/images/gallery/events/img_2278.jpg',              alt: 'HQ Aviation event' },
  { url: '/assets/images/gallery/events/img_2644.jpeg',             alt: 'HQ Aviation event' },
  { url: '/assets/images/gallery/events/img_4488.jpg',              alt: 'HQ Aviation event' },
  { url: '/assets/images/gallery/events/img_8604.jpg',              alt: 'HQ Aviation event' },
  { url: '/assets/images/gallery/events/img_8733.jpg',              alt: 'HQ Aviation event' },
  { url: '/assets/images/gallery/events/dsc_0062.jpg',              alt: 'HQ Aviation event' },
  { url: '/assets/images/gallery/events/dsc_4073_jpg.jpg',          alt: 'HQ Aviation event' },
  { url: '/assets/images/gallery/events/img_0223.jpg',              alt: 'HQ Aviation event' },
  { url: '/assets/images/gallery/events/img_0333.jpg',              alt: 'HQ Aviation event' },
  { url: '/assets/images/gallery/events/img_1176.jpg',              alt: 'HQ Aviation event' },
  { url: '/assets/images/gallery/events/img_1324-2.jpg',            alt: 'HQ Aviation event' },
  { url: '/assets/images/gallery/events/img_1539-1.jpg',            alt: 'HQ Aviation event' },
  { url: '/assets/images/gallery/events/p1140516.jpg',              alt: 'HQ Aviation event' },

  // ── Flying ───────────────────────────────────────────────────────────────────
  { url: '/assets/images/gallery/flying/flying--1.jpg',             alt: 'Aerial view' },
  { url: '/assets/images/gallery/flying/flying-.jpg',               alt: 'Flying' },
  { url: '/assets/images/gallery/flying/flying-tv.jpg',             alt: 'Flying' },
  { url: '/assets/images/gallery/flying/foggy-evening-flying.jpg',  alt: 'Foggy evening flight' },
  { url: '/assets/images/gallery/flying/james-shadow-night.jpg',    alt: 'Night flying' },
];

async function main() {
  const db = admin.firestore();

  // Skip if collection already has data
  const existing = await db.collection('wall_of_cool').limit(1).get();
  if (!existing.empty) {
    console.log('wall_of_cool already has data — skipping seed.');
    process.exit(0);
  }

  const batch = db.batch();
  IMAGES.forEach((img, i) => {
    const ref = db.collection('wall_of_cool').doc();
    batch.set(ref, {
      type: 'image',
      source: 'admin',
      status: 'approved',
      imageUrl: img.url,
      alt: img.alt,
      caption: '',
      order: i,
      submittedAt: admin.firestore.FieldValue.serverTimestamp(),
    });
  });

  await batch.commit();
  console.log(`✓ Seeded ${IMAGES.length} images into wall_of_cool.`);
  process.exit(0);
}

main().catch((err) => {
  console.error('Seed failed:', err.message);
  process.exit(1);
});

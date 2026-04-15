'use strict';
/**
 * migrate-images-to-storage.js
 *
 * One-time migration: uploads every local project image to Firebase Storage
 * and updates the corresponding Firestore media_library doc to use the
 * permanent Storage URL instead of the relative /assets/... path.
 *
 * What it does:
 *   1. Reads all media_library docs where source === 'local'
 *   2. Finds the file in public/ using the stored relative URL
 *   3. Uploads it to Firebase Storage at media-library/assets/...
 *   4. Updates the Firestore doc with the new https:// URL + storagePath
 *
 * Safe to re-run — skips docs that already have a storagePath set.
 * Progress is printed so you can see what's happening.
 *
 * Run:
 *   node scripts/migrate-images-to-storage.js
 *
 * Requires: FIREBASE_PROJECT_ID, FIREBASE_CLIENT_EMAIL, FIREBASE_PRIVATE_KEY,
 *           VITE_FIREBASE_STORAGE_BUCKET in .env
 */

require('dotenv').config();

const fs    = require('fs');
const path  = require('path');
const admin = require('firebase-admin');

if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert({
      projectId:   process.env.FIREBASE_PROJECT_ID,
      clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
      privateKey:  (process.env.FIREBASE_PRIVATE_KEY || '').replace(/\\n/g, '\n'),
    }),
    storageBucket: process.env.VITE_FIREBASE_STORAGE_BUCKET,
  });
}

const db     = admin.firestore();
const bucket = admin.storage().bucket();

const PUBLIC_DIR = path.join(__dirname, '..', 'public');

// Mime type map for common image extensions
const MIME = {
  '.jpg':  'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.png':  'image/png',
  '.webp': 'image/webp',
  '.gif':  'image/gif',
  '.avif': 'image/avif',
  '.svg':  'image/svg+xml',
};

async function uploadFile(localPath, storagePath) {
  const ext      = path.extname(localPath).toLowerCase();
  const mimeType = MIME[ext] ?? 'application/octet-stream';

  await bucket.upload(localPath, {
    destination: storagePath,
    metadata: { contentType: mimeType },
  });

  // Make it publicly readable
  const file = bucket.file(storagePath);
  await file.makePublic();
  return `https://storage.googleapis.com/${bucket.name}/${storagePath}`;
}

async function main() {
  console.log('Fetching media_library docs with source === "local" …\n');

  const snap = await db.collection('media_library')
    .where('source', '==', 'local')
    .get();

  const docs = snap.docs.filter((d) => !d.data().storagePath); // skip already migrated
  console.log(`${docs.length} images to migrate (${snap.size - docs.length} already done).\n`);

  if (docs.length === 0) {
    console.log('Nothing to do.');
    process.exit(0);
  }

  let done = 0;
  let failed = 0;

  for (const docSnap of docs) {
    const data        = docSnap.data();
    const relativeUrl = data.url; // e.g. /assets/images/gallery/flying/flying-.jpg
    const localPath   = path.join(PUBLIC_DIR, relativeUrl.split('/').join(path.sep));

    if (!fs.existsSync(localPath)) {
      console.warn(`  SKIP (file not found): ${relativeUrl}`);
      failed++;
      continue;
    }

    // Storage path mirrors the public/ structure so it's organised
    const storagePath = `media-library${relativeUrl}`; // e.g. media-library/assets/images/...

    try {
      const url = await uploadFile(localPath, storagePath);
      await docSnap.ref.update({ url, storagePath, source: 'migrated' });
      done++;
      if (done % 10 === 0 || done === docs.length) {
        console.log(`  ${done} / ${docs.length} migrated …`);
      }
    } catch (e) {
      console.error(`  FAIL: ${relativeUrl} — ${e.message}`);
      failed++;
    }
  }

  console.log(`\nDone. ${done} migrated, ${failed} skipped/failed.`);
  process.exit(0);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});

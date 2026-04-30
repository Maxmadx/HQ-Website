'use strict';
/**
 * seed-media-library.js
 *
 * Scans every image in public/assets/images/ and creates a Firestore
 * document in the `media_library` collection for each one.
 *
 * Images are served as static assets,this script only indexes them
 * (stores the URL + metadata) so they appear in the admin media library
 * picker without needing to re-upload anything to Firebase Storage.
 *
 * Safe to re-run,uses the relative URL as a dedup key so existing
 * documents are skipped rather than duplicated.
 *
 * Run:
 *   node scripts/seed-media-library.js
 *
 * Requires: FIREBASE_PROJECT_ID, FIREBASE_CLIENT_EMAIL, FIREBASE_PRIVATE_KEY in .env
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
  });
}

const db = admin.firestore();

// ── Config ────────────────────────────────────────────────────────────────────

const PUBLIC_DIR  = path.join(__dirname, '..', 'public');
const IMAGE_EXTS  = new Set(['.jpg', '.jpeg', '.png', '.webp', '.gif', '.avif', '.svg']);

// ── Helpers ───────────────────────────────────────────────────────────────────

/** Recursively collect all image file paths under a directory. */
function collectImages(dir) {
  const results = [];
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      results.push(...collectImages(full));
    } else if (IMAGE_EXTS.has(path.extname(entry.name).toLowerCase())) {
      results.push(full);
    }
  }
  return results;
}

/** Convert an absolute file path to the web-relative URL. */
function toUrl(absPath) {
  return '/' + path.relative(PUBLIC_DIR, absPath).split(path.sep).join('/');
}

/** Human-readable file size. */
function fmtSize(bytes) {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(0)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

// ── Main ──────────────────────────────────────────────────────────────────────

async function main() {
  console.log('Scanning public/assets/images/ …');
  const allImages = collectImages(path.join(PUBLIC_DIR, 'assets', 'images'));
  console.log(`Found ${allImages.length} images.\n`);

  // Build a set of URLs already indexed so we can skip duplicates
  console.log('Fetching existing media_library docs …');
  const existing = new Set();
  const snapshot = await db.collection('media_library').get();
  snapshot.forEach((doc) => {
    const url = doc.data().url;
    if (url) existing.add(url);
  });
  console.log(`${existing.size} already indexed.\n`);

  const toAdd = allImages.filter((p) => !existing.has(toUrl(p)));
  console.log(`${toAdd.length} new images to index.\n`);

  if (toAdd.length === 0) {
    console.log('Nothing to do,all images are already in the library.');
    process.exit(0);
  }

  // Firestore max batch size = 500
  const BATCH_SIZE = 400;
  let added = 0;

  for (let i = 0; i < toAdd.length; i += BATCH_SIZE) {
    const batch = db.batch();
    const chunk = toAdd.slice(i, i + BATCH_SIZE);

    for (const absPath of chunk) {
      const url      = toUrl(absPath);
      const name     = path.basename(absPath);
      const stat     = fs.statSync(absPath);
      const ref      = db.collection('media_library').doc();

      batch.set(ref, {
        url,
        name,
        storagePath: null,        // local asset,not in Firebase Storage
        size: stat.size,
        source: 'local',
        uploadedAt: admin.firestore.FieldValue.serverTimestamp(),
      });
    }

    await batch.commit();
    added += chunk.length;
    console.log(`  Indexed ${added} / ${toAdd.length} …`);
  }

  console.log(`\nDone,${added} images added to media_library.`);
  process.exit(0);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});

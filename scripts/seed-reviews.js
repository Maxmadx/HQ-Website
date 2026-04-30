// scripts/seed-reviews.js
// Seeds verbatim Google Maps reviews for HQ Aviation Ltd into the Firestore
// `reviews` collection. Re-run-safe: skips when the collection is non-empty
// unless `--force` is passed (which wipes the collection first).
//
// Two modes:
//   1. Built-in fallback list (5 reviews from public Google Maps mirror) —
//      runs when no --from-json is passed.
//   2. JSON file produced by scripts/scrape-google-reviews.cjs — pass
//      `--from-json scripts/google-reviews.json` to seed every review.
//
// Source: Google Maps listing for HQ Aviation Ltd
//   place_id: ChIJ36KI7NFudkgRvpfhWKl_8Xg
//
// Usage:
//   node scripts/seed-reviews.js                                   # fallback, dev only
//   node scripts/seed-reviews.js --force                           # wipe & reseed fallback
//   node scripts/seed-reviews.js --from-json scripts/google-reviews.json --force

require('dotenv').config({ path: require('path').join(__dirname, '../.env') });
const fs = require('fs');
const path = require('path');
const admin = require('../api/firebase-admin');

const fallbackReviews = [
  {
    author: 'Patrick Curran',
    role: '',
    rating: 5,
    displayOrder: 1,
    text: 'HQ Aviation is by far the best helicopter school in the UK. HQ is much more than just a business. Its a community of caring people who all share a love of helicopters.',
  },
  {
    author: 'Stephen Glynn',
    role: '',
    rating: 5,
    displayOrder: 2,
    text: 'Great place to learn to fly a helicopter. Open 7 days, comfortable surroundings, and the best instructors in the business.',
  },
  {
    author: 'Frederic Neefs',
    role: '',
    rating: 5,
    displayOrder: 3,
    text: 'Great atmosphere, top instructors, Best helicopter training center, period.',
  },
  {
    author: 'Paul White',
    role: 'Elstree Helicopters',
    rating: 5,
    displayOrder: 4,
    text: 'A great bunch and excellent team. Been associated with them for some years now :-)',
  },
  {
    author: 'Vicky King',
    role: '',
    rating: 5,
    displayOrder: 5,
    text: 'Nice pepole and place',
  },
];

async function wipe(col) {
  const snap = await col.get();
  if (snap.empty) return 0;
  const batch = col.firestore.batch();
  snap.docs.forEach((d) => batch.delete(d.ref));
  await batch.commit();
  return snap.size;
}

function getJsonPath() {
  const idx = process.argv.indexOf('--from-json');
  if (idx === -1) return null;
  const p = process.argv[idx + 1];
  if (!p) throw new Error('--from-json requires a file path');
  return path.resolve(p);
}

function loadFromJson(jsonPath) {
  const raw = JSON.parse(fs.readFileSync(jsonPath, 'utf8'));
  if (!Array.isArray(raw)) throw new Error(`${jsonPath} did not contain a JSON array`);
  return raw
    .filter((r) => r && r.text && r.author)
    .map((r, i) => ({
      author: String(r.author).trim(),
      role: '',
      rating: Number(r.rating) || 5,
      displayOrder: i + 1,
      text: String(r.text).trim(),
      date: String(r.date || '').trim(),
    }));
}

async function main() {
  const force = process.argv.includes('--force');
  const jsonPath = getJsonPath();
  const reviews = jsonPath ? loadFromJson(jsonPath) : fallbackReviews;
  console.log(`source: ${jsonPath || 'built-in fallback'} (${reviews.length} reviews)`);

  const db = admin.firestore();
  const col = db.collection('reviews');

  const existing = await col.limit(1).get();
  if (!existing.empty) {
    if (!force) {
      console.log('reviews collection already has data, skipping (pass --force to wipe & reseed).');
      process.exit(0);
    }
    const wiped = await wipe(col);
    console.log(`wiped ${wiped} existing review(s).`);
  }

  const batch = db.batch();
  for (const r of reviews) {
    batch.set(col.doc(), {
      ...r,
      date: r.date || '',
      visible: true,
      avatarUrl: '',
    });
  }
  await batch.commit();
  console.log(`✓ Seeded ${reviews.length} reviews into Firestore.`);
  process.exit(0);
}

main().catch((err) => { console.error(err.message); process.exit(1); });

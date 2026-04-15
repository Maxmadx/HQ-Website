// scripts/seed-site-text.js
// Seeds Firestore site_text collection with default values from textSections.js
// Run: node scripts/seed-site-text.js
// Safe to re-run — uses merge:true so admin-edited values are preserved.

require('dotenv').config({ path: require('path').join(__dirname, '../.env') });
const admin = require('../api/firebase-admin');
const path = require('path');
const fs = require('fs');

async function main() {
  // textSections.js is an ES module. Convert to CJS on the fly.
  const src = fs.readFileSync(
    path.join(__dirname, '../src/lib/textSections.js'),
    'utf8'
  );
  const cjs =
    src
      .replace(/^export const /gm, 'const ')
      .replace(/^export \{[^}]+\};\s*$/gm, '') +
    '\nmodule.exports = { TEXT_SECTIONS };';

  const tmpFile = path.join(__dirname, '_textSections_tmp.js');
  fs.writeFileSync(tmpFile, cjs);

  let TEXT_SECTIONS;
  try {
    // Clear require cache in case re-running in same process
    delete require.cache[require.resolve(tmpFile)];
    ({ TEXT_SECTIONS } = require(tmpFile));
  } finally {
    fs.unlinkSync(tmpFile);
  }

  const db = admin.firestore();
  let batch = db.batch();
  let count = 0;
  let batchCount = 0;

  for (const section of TEXT_SECTIONS) {
    const fields = {};
    for (const field of section.fields) {
      fields[field.id] = field.default;
    }
    const ref = db.collection('site_text').doc(section.id);
    batch.set(ref, { page: section.page, fields }, { merge: true });
    count++;
    batchCount++;

    // Firestore batch limit is 500 writes
    if (batchCount === 490) {
      await batch.commit();
      console.log(`  Committed ${count} sections...`);
      batch = db.batch();
      batchCount = 0;
    }
  }

  if (batchCount > 0) {
    await batch.commit();
  }

  console.log(`✓ Seeded ${count} sections into Firestore site_text.`);
  process.exit(0);
}

main().catch((err) => {
  console.error('Seed failed:', err.message);
  process.exit(1);
});

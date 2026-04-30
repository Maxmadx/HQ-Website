'use strict';
/**
 * clean-em-dashes.js
 *
 * Scans every Firestore collection used by the site for em dashes (U+2014)
 * in string/array/object fields, replaces them with sensible substitutions,
 * and writes the cleaned document back.
 *
 * Substitution rules (applied in order):
 *   ' — '   → ', '         (parenthetical aside / pause)
 *   ' —'    → ','           (em dash before line break)
 *   '— '    → ' '            (em dash starting a quote attribution etc.)
 *   '—'     → ', '          (no-space em dash mid-sentence)
 *
 * Skips fields whose VALUE is exactly '—' (used as a typographic null
 * placeholder in some UI tables).
 *
 * Usage:
 *   node scripts/clean-em-dashes.js              # dry run (prints diff, no writes)
 *   node scripts/clean-em-dashes.js --apply      # write changes
 *   node scripts/clean-em-dashes.js --collection=faqs --apply   # only one collection
 */

require('dotenv').config({ path: require('path').join(__dirname, '../.env') });
const admin = require('../api/firebase-admin');
const db = admin.firestore();

const args = process.argv.slice(2);
const APPLY = args.includes('--apply');
const ONLY = (args.find((a) => a.startsWith('--collection=')) || '').split('=')[1] || null;

// Collections that hold user-facing text. Edit this list if more get added.
const COLLECTIONS = [
  'faqs',
  'blog_posts',
  'site_text',
  'listings',
  'misc_items',
  'pricing',
  'wall_of_cool',
  'reviews',
  'sfh_partners',
  'sfh_events',
  'image_slots',
  'site_images',
];

const EM = '—';
const EM_RE_SPACED = / — /g;     // ' — '
const EM_RE_TRAIL  = / —/g;       // ' —'
const EM_RE_LEAD   = /— /g;       // '— '
const EM_RE_TIGHT  = /—/g;        // '—'

function cleanString(s) {
  if (typeof s !== 'string') return s;
  // Skip the conventional null placeholder cell value
  if (s === EM) return s;
  if (!s.includes(EM)) return s;
  return s
    .replace(EM_RE_SPACED, ', ')
    .replace(EM_RE_TRAIL, ',')
    .replace(EM_RE_LEAD, ' ')
    .replace(EM_RE_TIGHT, ', ');
}

function cleanValue(v) {
  if (typeof v === 'string') return cleanString(v);
  if (Array.isArray(v)) return v.map(cleanValue);
  if (v && typeof v === 'object' && v.constructor === Object) {
    const out = {};
    for (const k of Object.keys(v)) out[k] = cleanValue(v[k]);
    return out;
  }
  return v;
}

function diffObject(before, after, prefix = '') {
  const lines = [];
  if (typeof before === 'string' && typeof after === 'string') {
    if (before !== after) lines.push(`  ${prefix}: ${JSON.stringify(before)} -> ${JSON.stringify(after)}`);
    return lines;
  }
  if (Array.isArray(before) && Array.isArray(after)) {
    for (let i = 0; i < before.length; i++) lines.push(...diffObject(before[i], after[i], `${prefix}[${i}]`));
    return lines;
  }
  if (before && typeof before === 'object' && after && typeof after === 'object') {
    for (const k of Object.keys(before)) lines.push(...diffObject(before[k], after[k], prefix ? `${prefix}.${k}` : k));
  }
  return lines;
}

async function processCollection(name) {
  const snap = await db.collection(name).get();
  let updated = 0;
  let scanned = 0;
  for (const docSnap of snap.docs) {
    scanned++;
    const before = docSnap.data();
    const after = cleanValue(before);
    const diff = diffObject(before, after);
    if (diff.length === 0) continue;
    updated++;
    console.log(`\n[${name}/${docSnap.id}]`);
    diff.forEach((d) => console.log(d));
    if (APPLY) {
      await docSnap.ref.set(after);
    }
  }
  console.log(`\n${name}: ${scanned} scanned, ${updated} ${APPLY ? 'updated' : 'would be updated'}.`);
  return { scanned, updated };
}

async function main() {
  console.log(`Mode: ${APPLY ? 'APPLY (writing)' : 'DRY RUN (use --apply to write)'}`);
  const list = ONLY ? [ONLY] : COLLECTIONS;
  let totalScanned = 0;
  let totalUpdated = 0;
  for (const c of list) {
    try {
      const { scanned, updated } = await processCollection(c);
      totalScanned += scanned;
      totalUpdated += updated;
    } catch (err) {
      console.error(`[${c}] error:`, err.message);
    }
  }
  console.log(`\nTotal: ${totalScanned} scanned, ${totalUpdated} ${APPLY ? 'updated' : 'would be updated'}.`);
  process.exit(0);
}

main().catch((err) => {
  console.error('Fatal:', err);
  process.exit(1);
});

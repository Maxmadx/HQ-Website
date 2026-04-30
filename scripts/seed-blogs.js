'use strict';
/**
 * seed-blogs.js
 * Reads each static JSX blog post from src/pages/blog/, parses it into
 * the block format used by the new admin editor, and seeds the Firestore
 * blog_posts collection.
 *
 * Uses the post slug as the Firestore document ID so the frontend can do
 * a direct doc lookup instead of a collection query.
 *
 * Run once to populate the database:
 *   node scripts/seed-blogs.js
 *
 * Re-run safely,existing docs are updated, not duplicated.
 *
 * Requires: FIREBASE_PROJECT_ID, FIREBASE_CLIENT_EMAIL, FIREBASE_PRIVATE_KEY in .env
 */

require('dotenv').config();
const fs    = require('fs');
const path  = require('path');
const admin = require('firebase-admin');

// ─── Firebase init ────────────────────────────────────────────────────────────
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

// ─── Posts metadata ───────────────────────────────────────────────────────────
const POSTS_JSON = path.join(__dirname, '../src/blog/posts.json');
const BLOG_DIR   = path.join(__dirname, '../src/pages/blog');

const COMPONENT_TO_FILE = {
  PPLGuide:             'PPLGuide.jsx',
  MasteringTheHover:    'MasteringTheHover.jsx',
  WinterFlying:         'WinterFlying.jsx',
  MaintenanceCheck:     'MaintenanceCheck.jsx',
  LondonHeliLanes:      'LondonHeliLanes.jsx',
  Autorotations:        'Autorotations.jsx',
  NightRating:          'NightRating.jsx',
  OwnershipVsHire:      'OwnershipVsHire.jsx',
  PreFlightWalkaround:  'PreFlightWalkaround.jsx',
  MedicalCertificates:  'MedicalCertificates.jsx',
  WeatherDecisions:     'WeatherDecisions.jsx',
  TurbineFlight:        'TurbineFlight.jsx',
  RadioTelephony:       'RadioTelephony.jsx',
  FlightInstructor:     'FlightInstructor.jsx',
  ConfinedAreas:        'ConfinedAreas.jsx',
  RR300Engine:          'RR300Engine.jsx',
  WhyWeFly:             'WhyWeFly.jsx',
  LeasebackProgram:     'LeasebackProgram.jsx',
  HangarageGuide:       'HangarageGuide.jsx',
  R44BuyersGuide:       'R44BuyersGuide.jsx',
  R22FirstSolo:         'R22FirstSolo.jsx',
  FlyToLunch:           'FlyToLunch.jsx',
  SuperyachtOperations: 'SuperyachtOperations.jsx',
  CrossChannel:         'CrossChannel.jsx',
  FuelManagement:       'FuelManagement.jsx',
  LTEAwareness:         'LTEAwareness.jsx',
  AnnualInspection:     'AnnualInspection.jsx',
};

// ─── JSX parser ───────────────────────────────────────────────────────────────
let _idCounter = 0;
function genId() { return `b${++_idCounter}`; }

/**
 * Extract the JSX content inside <BlogLayout …> … </BlogLayout>.
 * Handles multi-line attributes by tracking quoted strings.
 */
function extractBlogLayoutContent(fileContent) {
  const openTag  = '<BlogLayout';
  const closeTag = '</BlogLayout>';

  const openIdx = fileContent.indexOf(openTag);
  if (openIdx === -1) return '';

  // Walk past the opening tag (skip attribute strings so > inside them isn't mistaken)
  let pos = openIdx + openTag.length;
  let inString = false;
  let strChar = '';
  while (pos < fileContent.length) {
    const ch = fileContent[pos];
    if (inString) {
      if (ch === strChar) inString = false;
    } else {
      if (ch === '"' || ch === "'") { inString = true; strChar = ch; }
      else if (ch === '>') { pos++; break; }
    }
    pos++;
  }

  const closeIdx = fileContent.lastIndexOf(closeTag);
  if (closeIdx <= pos) return '';
  return fileContent.slice(pos, closeIdx);
}

/** Collapse newlines + extra spaces for clean single-line storage. */
function collapseWS(str) {
  return str.replace(/\n\s*/g, ' ').replace(/\s{2,}/g, ' ').trim();
}

/**
 * Top-level block parser.  Walks through the JSX content character by character,
 * identifying top-level elements and dispatching to type-specific handlers.
 */
function parseBlocks(content) {
  const blocks = [];
  let pos = 0;

  while (pos < content.length) {
    if (content[pos] !== '<') { pos++; continue; }

    // Skip JSX expression comments {/* … */}
    if (content.slice(pos, pos + 4) === '{/*') {
      const end = content.indexOf('*/', pos);
      pos = end === -1 ? content.length : end + 2;
      continue;
    }
    // Skip HTML comments
    if (content.slice(pos, pos + 4) === '<!--') {
      const end = content.indexOf('-->', pos);
      pos = end === -1 ? content.length : end + 3;
      continue;
    }

    // Read the tag name
    let nameEnd = pos + 1;
    while (nameEnd < content.length && !/[\s/>]/.test(content[nameEnd])) nameEnd++;
    const tagName = content.slice(pos + 1, nameEnd);

    if (tagName.startsWith('/')) { pos++; continue; }

    if (tagName === 'p') {
      const close = '</p>';
      const ci = content.indexOf(close, pos + 1);
      if (ci === -1) { pos++; continue; }
      const html = collapseWS(content.slice(content.indexOf('>', pos) + 1, ci));
      if (html) blocks.push({ id: genId(), type: 'paragraph', html });
      pos = ci + close.length;
      continue;
    }

    if (tagName === 'h2') {
      const close = '</h2>';
      const ci = content.indexOf(close, pos + 1);
      if (ci === -1) { pos++; continue; }
      const text = collapseWS(content.slice(content.indexOf('>', pos) + 1, ci));
      if (text) blocks.push({ id: genId(), type: 'heading2', text });
      pos = ci + close.length;
      continue;
    }

    if (tagName === 'h3') {
      const close = '</h3>';
      const ci = content.indexOf(close, pos + 1);
      if (ci === -1) { pos++; continue; }
      const text = collapseWS(content.slice(content.indexOf('>', pos) + 1, ci));
      if (text) blocks.push({ id: genId(), type: 'heading3', text });
      pos = ci + close.length;
      continue;
    }

    if (tagName === 'ul') {
      const close = '</ul>';
      const ci = content.indexOf(close, pos + 1);
      if (ci === -1) { pos++; continue; }
      const items = extractListItems(content.slice(content.indexOf('>', pos) + 1, ci));
      if (items.length) blocks.push({ id: genId(), type: 'bulletList', items });
      pos = ci + close.length;
      continue;
    }

    if (tagName === 'ol') {
      const close = '</ol>';
      const ci = content.indexOf(close, pos + 1);
      if (ci === -1) { pos++; continue; }
      const items = extractListItems(content.slice(content.indexOf('>', pos) + 1, ci));
      if (items.length) blocks.push({ id: genId(), type: 'orderedList', items });
      pos = ci + close.length;
      continue;
    }

    if (tagName === 'Callout') {
      const close = '</Callout>';
      const ci = content.indexOf(close, pos + 1);
      if (ci === -1) { pos++; continue; }
      const full      = content.slice(pos, ci + close.length);
      const innerText = collapseWS(full.slice(full.indexOf('>') + 1, full.lastIndexOf(close)));
      const varM = full.match(/variant="([^"]+)"/);
      const titM = full.match(/title="([^"]+)"/);
      blocks.push({
        id:      genId(),
        type:    'callout',
        variant: varM ? varM[1] : 'info',
        title:   titM ? titM[1] : '',
        content: innerText,
      });
      pos = ci + close.length;
      continue;
    }

    if (tagName === 'KeyPoint') {
      const sci = findSelfClose(content, pos);
      if (sci === -1) { pos++; continue; }
      const full   = content.slice(pos, sci + 2);
      const titM   = full.match(/title="([^"]+)"/);
      const points = extractPointsArray(full);
      if (points.length) {
        blocks.push({
          id:     genId(),
          type:   'keypoint',
          title:  titM ? titM[1] : 'Key Takeaways',
          points,
        });
      }
      pos = sci + 2;
      continue;
    }

    if (tagName === 'IllustrationPlaceholder') {
      const sci = findSelfClose(content, pos);
      pos = sci === -1 ? pos + 1 : sci + 2;
      continue;
    }

    pos++;
  }

  return blocks;
}

/** Pull <li>…</li> inner HTML out of a list body. */
function extractListItems(listBody) {
  const items = [];
  const open  = '<li>';
  const close = '</li>';
  let pos = 0;
  while (pos < listBody.length) {
    const oi = listBody.indexOf(open, pos);
    if (oi === -1) break;
    const ci = listBody.indexOf(close, oi + open.length);
    if (ci === -1) break;
    const inner = collapseWS(listBody.slice(oi + open.length, ci));
    if (inner) items.push(inner);
    pos = ci + close.length;
  }
  return items;
}

/**
 * Find the closing /> of a self-closing JSX tag starting at startPos.
 * Skips over string literals and JSX expression braces {} so we don't
 * mis-identify /> inside an attribute value.
 */
function findSelfClose(content, startPos) {
  let i = startPos;
  let inString = false;
  let strChar = '';
  while (i < content.length - 1) {
    const ch = content[i];
    if (inString) {
      if (ch === '\\') { i += 2; continue; }
      if (ch === strChar) inString = false;
    } else {
      if (ch === '"' || ch === "'") { inString = true; strChar = ch; }
      else if (ch === '{') {
        let depth = 1; i++;
        while (i < content.length && depth > 0) {
          if (content[i] === '{') depth++;
          else if (content[i] === '}') depth--;
          i++;
        }
        continue;
      } else if (ch === '/' && content[i + 1] === '>') {
        return i;
      }
    }
    i++;
  }
  return -1;
}

/**
 * Extract the string values from a points={["…","…"]} JSX array attribute.
 * Uses matchAll (no exec) to iterate over all quoted strings.
 */
function extractPointsArray(tagString) {
  const arrayMatch = tagString.match(/points=\{(\[[\s\S]*?\])\}/);
  if (!arrayMatch) return [];

  const points = [];
  const quotedStringPattern = /"((?:[^"\\]|\\.)*)"/g;
  for (const m of arrayMatch[1].matchAll(quotedStringPattern)) {
    const val = m[1].replace(/\\"/g, '"').trim();
    if (val) points.push(val);
  }
  return points;
}

// ─── Main seed function ───────────────────────────────────────────────────────
async function seed() {
  const posts = JSON.parse(fs.readFileSync(POSTS_JSON, 'utf8'));

  let created = 0;
  let updated = 0;
  let skipped = 0;

  for (const meta of posts) {
    // Skip external press posts,they redirect, no content to seed
    if (meta.externalUrl) {
      console.log(`  skip    ${meta.id}  (external redirect)`);
      skipped++;
      continue;
    }

    const fileName = COMPONENT_TO_FILE[meta.component];
    if (!fileName) {
      console.warn(`  WARN    ${meta.id} ,no component mapping for "${meta.component}"`);
      skipped++;
      continue;
    }

    const filePath = path.join(BLOG_DIR, fileName);
    if (!fs.existsSync(filePath)) {
      console.warn(`  WARN    ${meta.id} ,file not found: ${filePath}`);
      skipped++;
      continue;
    }

    const fileContent   = fs.readFileSync(filePath, 'utf8');
    const layoutContent = extractBlogLayoutContent(fileContent);
    if (!layoutContent) {
      console.warn(`  WARN    ${meta.id} ,could not extract BlogLayout content`);
      skipped++;
      continue;
    }

    _idCounter = 0; // reset per-post so block IDs are deterministic
    const blocks = parseBlocks(layoutContent);

    if (blocks.length === 0) {
      console.warn(`  WARN    ${meta.id} ,parsed 0 blocks`);
      skipped++;
      continue;
    }

    const docData = {
      title:       meta.title,
      slug:        meta.id,
      excerpt:     meta.excerpt     || '',
      category:    meta.category    || 'General',
      author:      meta.author      || 'HQ Aviation',
      readingTime: meta.readingTime || '',
      coverImage:  meta.image       || '',
      status:      'published',
      tags:        [],
      blocks,
      publishedAt: admin.firestore.Timestamp.fromDate(new Date(meta.date)),
    };

    const ref  = db.collection('blog_posts').doc(meta.id);
    const snap = await ref.get();

    if (snap.exists) {
      await ref.update({ ...docData, updatedAt: admin.firestore.FieldValue.serverTimestamp() });
      console.log(`  update  ${meta.id}  (${blocks.length} blocks)`);
      updated++;
    } else {
      await ref.set({
        ...docData,
        createdAt: admin.firestore.FieldValue.serverTimestamp(),
        updatedAt: admin.firestore.FieldValue.serverTimestamp(),
      });
      console.log(`  create  ${meta.id}  (${blocks.length} blocks)`);
      created++;
    }
  }

  console.log(`\nDone.  Created: ${created}  Updated: ${updated}  Skipped: ${skipped}`);
  process.exit(0);
}

seed().catch((err) => {
  console.error('\nSeed failed:', err.message);
  process.exit(1);
});

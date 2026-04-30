/**
 * Seed SFH "Where & When" data into Firestore.
 *
 * Usage:
 *   node scripts/seed-where-when.js           ,skip (with warning) if either collection has data
 *   node scripts/seed-where-when.js --clear   ,wipe both collections then seed fresh
 */
'use strict';

require('dotenv').config({ path: require('path').join(__dirname, '../.env') });
const admin = require('../api/firebase-admin');

// ─── Seed data ────────────────────────────────────────────────────────────────

const PARTNERS = [
  { category: 'Shooting Ground', name: 'Holland & Holland', location: 'Northwood',     displayOrder: 1, visible: true },
  { category: 'Restaurant',      name: 'The Hut',           location: 'Isle of Wight', displayOrder: 2, visible: true },
  { category: 'Shooting Ground', name: 'E.J. Churchill',    location: 'West Wycombe',  displayOrder: 3, visible: true },
];

const EVENTS = [
  { region: 'Gloucestershire', name: 'Cheltenham Festival',        month: '10–13 Mar',    displayOrder: 1, visible: true },
  { region: 'Merseyside',      name: 'Grand National (Aintree)',   month: '9–11 Apr',     displayOrder: 2, visible: true },
  { region: 'Surrey',          name: 'Epsom Derby',                month: '5–6 Jun',      displayOrder: 3, visible: true },
  { region: 'Berkshire',       name: 'Royal Ascot',                month: '16–20 Jun',    displayOrder: 4, visible: true },
  { region: 'Oxfordshire',     name: 'Henley Royal Regatta',       month: '1–5 Jul',      displayOrder: 5, visible: true },
  { region: 'West Sussex',     name: 'Goodwood Festival of Speed', month: '9–12 Jul',     displayOrder: 6, visible: true },
  { region: 'West Sussex',     name: 'Glorious Goodwood',          month: '28 Jul–1 Aug', displayOrder: 7, visible: true },
  { region: 'Suffolk',         name: 'Newmarket Racing',           month: 'May–Oct',      displayOrder: 8, visible: true },
  { region: 'Yorkshire',       name: 'York Racecourse',            month: 'May–Oct',      displayOrder: 9, visible: true },
];

// ─── CLI flags ────────────────────────────────────────────────────────────────

const args = process.argv.slice(2);
const clear = args.includes('--clear');

// ─── Main ─────────────────────────────────────────────────────────────────────

async function clearCollection(db, name) {
  const snap = await db.collection(name).get();
  if (snap.empty) return 0;
  // Firestore batches cap at 500 ops
  for (let i = 0; i < snap.docs.length; i += 500) {
    const chunk = snap.docs.slice(i, i + 500);
    const batch = db.batch();
    chunk.forEach(d => batch.delete(d.ref));
    await batch.commit();
  }
  return snap.docs.length;
}

async function seedCollection(db, name, items) {
  for (let i = 0; i < items.length; i += 500) {
    const chunk = items.slice(i, i + 500);
    const batch = db.batch();
    const col = db.collection(name);
    chunk.forEach(item => batch.set(col.doc(), item));
    await batch.commit();
  }
}

async function main() {
  const db = admin.firestore();

  const partnersExisting = await db.collection('sfh_partners').limit(1).get();
  const eventsExisting   = await db.collection('sfh_events').limit(1).get();

  if ((!partnersExisting.empty || !eventsExisting.empty) && !clear) {
    console.log('sfh_partners and/or sfh_events already contain data.');
    console.log('Re-run with --clear to wipe and re-seed.');
    process.exit(0);
  }

  if (clear) {
    const deletedPartners = await clearCollection(db, 'sfh_partners');
    const deletedEvents   = await clearCollection(db, 'sfh_events');
    console.log(`  Deleted ${deletedPartners} existing partner doc(s).`);
    console.log(`  Deleted ${deletedEvents} existing event doc(s).`);
  }

  await seedCollection(db, 'sfh_partners', PARTNERS);
  await seedCollection(db, 'sfh_events', EVENTS);

  console.log(`✓ Seeded ${PARTNERS.length} partners into sfh_partners.`);
  console.log(`✓ Seeded ${EVENTS.length} events into sfh_events.`);
  process.exit(0);
}

main().catch(err => { console.error(err.message); process.exit(1); });

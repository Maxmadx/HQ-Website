// One-off — fix `aircraftName` on bookings that have been upgraded but
// still carry the original aircraft's display name (before the
// applyUpgradeFromPi fix).
//
// Usage: node scripts/fix-upgraded-aircraft-names.js [--apply]

require('dotenv').config();
const admin = require('../api/firebase-admin');

const APPLY = process.argv.includes('--apply');
const AIRCRAFT_NAMES = { r22: 'Robinson R22', r44: 'Robinson R44', r66: 'Robinson R66' };

(async () => {
  console.log(`Mode: ${APPLY ? 'APPLY' : 'dry-run'}`);
  const snap = await admin.firestore().collection('bookings').get();
  let fixed = 0;
  for (const doc of snap.docs) {
    const b = doc.data();
    if (!b.upgrade) continue;
    const expectedName = AIRCRAFT_NAMES[b.aircraft] || b.aircraft;
    if (b.aircraftName === expectedName) continue;
    console.log(`${doc.id}: aircraftName "${b.aircraftName}" → "${expectedName}"` +
                ` (also originalAircraftName="${b.originalAircraftName || '(unset)'}")`);
    if (APPLY) {
      await doc.ref.update({
        aircraftName: expectedName,
        originalAircraftName: b.originalAircraftName || b.aircraftName || null,
      });
    }
    fixed++;
  }
  console.log(`${APPLY ? 'fixed' : 'would fix'} ${fixed} bookings.`);
  process.exit(0);
})().catch((e) => { console.error('ERR:', e.message); process.exit(1); });

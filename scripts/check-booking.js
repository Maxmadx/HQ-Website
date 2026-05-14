// One-off Firestore check — node scripts/check-booking.js <pi_ref>
require('dotenv').config();
const admin = require('../api/firebase-admin');

const REF = process.argv[2] || 'pi_3TW4vE9Pcbq93z0m1cQ8Ebtf';

(async () => {
  const snap = await admin.firestore().collection('bookings').doc(REF).get();
  if (!snap.exists) {
    console.log('NOT FOUND:', REF);
    process.exit(0);
  }
  const data = snap.data();
  const keys = Object.keys(data).sort();
  console.log('Doc:', REF);
  console.log('Keys:', keys.join(', '));
  console.log('aircraft:', data.aircraft);
  console.log('duration:', data.duration);
  console.log('originalAircraft:', data.originalAircraft);
  console.log('originalDuration:', data.originalDuration);
  console.log('amount (pence):', data.amount);
  console.log('flightAmountPence:', data.flightAmountPence);
  console.log('totalAmountPence:', data.totalAmountPence);
  console.log('upgrade:', JSON.stringify(data.upgrade, null, 2));
  process.exit(0);
})().catch((e) => { console.error('ERR:', e.message); process.exit(1); });

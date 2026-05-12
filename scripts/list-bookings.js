require('dotenv').config();
const admin = require('../api/firebase-admin');

(async () => {
  const snap = await admin.firestore()
    .collection('bookings')
    .orderBy('createdAt', 'desc')
    .limit(10)
    .get();
  console.log(`Found ${snap.size} recent bookings:`);
  for (const doc of snap.docs) {
    const d = doc.data();
    console.log(`  id=${doc.id}  ref=${d.ref}  aircraft=${d.aircraft}  upgrade?=${!!d.upgrade}  amount=£${(d.amount||0)/100}  name=${d.customerName}`);
  }
  process.exit(0);
})().catch((e) => { console.error('ERR:', e.message); process.exit(1); });

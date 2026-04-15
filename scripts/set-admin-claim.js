'use strict';
/**
 * Set admin custom claim on a Firebase Auth user.
 * Run with: node scripts/set-admin-claim.js user@example.com
 * Requires: FIREBASE_PROJECT_ID, FIREBASE_CLIENT_EMAIL, FIREBASE_PRIVATE_KEY in .env
 */

require('dotenv').config();
const admin = require('firebase-admin');

const email = process.argv[2];
if (!email) {
  console.error('Usage: node scripts/set-admin-claim.js user@example.com');
  process.exit(1);
}

if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert({
      projectId: process.env.FIREBASE_PROJECT_ID,
      clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
      privateKey: (process.env.FIREBASE_PRIVATE_KEY || '').replace(/\\n/g, '\n'),
    }),
  });
}

async function main() {
  const user = await admin.auth().getUserByEmail(email);
  await admin.auth().setCustomUserClaims(user.uid, { role: 'super_admin' });
  console.log(`✅ Set role=super_admin on ${email} (uid: ${user.uid})`);
  console.log('   User must sign out and sign back in for the new token to take effect.');
  process.exit(0);
}

main().catch((err) => {
  console.error('Error:', err.message);
  process.exit(1);
});

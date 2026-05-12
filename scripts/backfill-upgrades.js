// List recent upgrade PaymentIntents in Stripe and, for any whose
// originalPaymentIntent booking doc doesn't yet have an `upgrade` field,
// apply the upgrade via the same helper the webhook uses.
//
// Usage: node scripts/backfill-upgrades.js [--apply]
//   (default is dry-run; pass --apply to actually write)

require('dotenv').config();
const Stripe = require('stripe');
const admin = require('../api/firebase-admin');

const APPLY = process.argv.includes('--apply');
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

// Lazy-require so the file doesn't fail to load if api/stripe.js has syntax issues
const { recordUpgrade } = require('../api/stripe');

(async () => {
  console.log(`Mode: ${APPLY ? 'APPLY (will write)' : 'dry-run (read only)'}`);

  // List 50 most recent PIs and filter to upgrades. (Stripe doesn't let you
  // filter by metadata in the list call; we filter client-side.)
  const list = await stripe.paymentIntents.list({ limit: 50 });
  const upgrades = list.data.filter(
    (pi) => (pi.metadata || {}).productType === 'discovery-flight-upgrade'
  );

  if (upgrades.length === 0) {
    console.log('No upgrade PaymentIntents found in last 50 PIs.');
    process.exit(0);
  }

  console.log(`Found ${upgrades.length} upgrade PIs in last 50 PIs.\n`);

  for (const pi of upgrades) {
    const orig = pi.metadata.originalPaymentIntentId;
    console.log(`PI ${pi.id}`);
    console.log(`  status: ${pi.status}`);
    console.log(`  amount: £${(pi.amount / 100).toFixed(2)}`);
    console.log(`  original: ${orig || '(missing!)'}`);
    console.log(`  newAircraft/Duration: ${pi.metadata.newAircraft} / ${pi.metadata.newDuration}`);

    if (pi.status !== 'succeeded') {
      console.log('  → skipping (not succeeded)');
      console.log();
      continue;
    }
    if (!orig) {
      console.log('  → skipping (no originalPaymentIntentId in metadata)');
      console.log();
      continue;
    }

    const snap = await admin.firestore().collection('bookings').doc(orig).get();
    if (!snap.exists) {
      console.log('  → ERROR: original booking doc not found in Firestore');
      console.log();
      continue;
    }
    const booking = snap.data();
    if (booking.upgrade) {
      console.log('  → already applied (booking.upgrade is set) — skipping');
      console.log();
      continue;
    }

    console.log('  → NEEDS APPLY');
    if (APPLY) {
      try {
        const result = await recordUpgrade(pi.id);
        console.log('  ✓ applied:', JSON.stringify(result));
      } catch (e) {
        console.log('  ✗ apply failed:', e.message);
      }
    } else {
      console.log('  (skipping write — pass --apply to actually write)');
    }
    console.log();
  }

  process.exit(0);
})().catch((e) => { console.error('ERR:', e.message); process.exit(1); });

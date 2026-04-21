'use strict';

/**
 * Backfill bookings from Stripe into Firestore.
 * Fetches recent succeeded payment intents and writes them to the bookings collection.
 * Safe to re-run — uses pi.id as doc ID so duplicates are overwritten idempotently.
 *
 * Usage: node scripts/backfill-bookings.js
 */

require('dotenv').config();

const Stripe = require('stripe');
const admin = require('../api/firebase-admin');

const stripe = Stripe(process.env.STRIPE_SECRET_KEY);
const db = admin.firestore();

const AIRCRAFT_NAMES = {
  r22: 'Robinson R22',
  r44: 'Robinson R44',
  r66: 'Robinson R66',
};

async function run() {
  console.log('Fetching recent succeeded payment intents from Stripe...');

  const intents = await stripe.paymentIntents.list({ limit: 50 });
  const succeeded = intents.data.filter((pi) => pi.status === 'succeeded');

  console.log(`Found ${succeeded.length} succeeded payment intents.`);

  let written = 0;
  let skipped = 0;

  for (const pi of succeeded) {
    const { productType, customerName, customerEmail, customerPhone,
            wantsVoucher, voucherLocation, voucherMessage } = pi.metadata || {};

    // Skip if no productType metadata — not from this system
    if (!productType && !pi.metadata?.aircraft) {
      skipped++;
      continue;
    }

    const type = productType || 'discovery-flight';

    const bookingData = {
      ref: pi.id,
      productType: type,
      status: 'new',
      createdAt: admin.firestore.Timestamp.fromMillis(pi.created * 1000),
      amount: pi.amount,
      customerName: customerName || '',
      customerEmail: customerEmail || '',
      customerPhone: customerPhone || '',
      wantsVoucher: wantsVoucher === 'true',
      voucherAddress: voucherLocation || null,
      voucherMessage: voucherMessage || null,
    };

    if (type === 'london-tour') {
      const { experience, timeOfDay, quantity } = pi.metadata || {};
      bookingData.experience = experience || '';
      bookingData.timeOfDay = timeOfDay || '';
      bookingData.quantity = Number(quantity) || 1;
    } else {
      const { aircraft, aircraftName, duration } = pi.metadata || {};
      bookingData.aircraft = aircraft || '';
      bookingData.aircraftName = aircraftName || AIRCRAFT_NAMES[aircraft] || aircraft || '';
      bookingData.duration = Number(duration) || 0;
    }

    await db.collection('bookings').doc(pi.id).set(bookingData, { merge: false });
    console.log(`  ✓ ${pi.id}  ${type}  £${(pi.amount / 100).toFixed(0)}  ${customerName || '(no name)'}`);
    written++;
  }

  console.log(`\nDone. Written: ${written}, Skipped (no metadata): ${skipped}`);
  process.exit(0);
}

run().catch((err) => {
  console.error('Error:', err.message);
  process.exit(1);
});

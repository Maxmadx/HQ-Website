const admin = require('firebase-admin');
const { getUpgradeDiffPence } = require('./stripe');
const logger = require('./lib/logger.js');

/**
 * Returns the booking record for `/booking-confirmed` and `/upgrade` to render
 * server-truth state. The PI ID itself is the access token — no auth header needed.
 * Sensitive Stripe internals (raw client_secret, etc.) are not exposed.
 */
async function getBooking(req, res) {
  const { paymentIntentId } = req.params;
  if (!paymentIntentId || typeof paymentIntentId !== 'string') {
    return res.status(400).json({ error: 'paymentIntentId required' });
  }
  try {
    const snap = await admin.firestore().collection('bookings').doc(paymentIntentId).get();
    if (!snap.exists) return res.status(404).json({ error: 'Booking not found' });
    const data = snap.data();

    // Compute the upgrade diff server-side (honouring admin override at
    // pricing/upgrade_r22_to_r44_<dur>min). Only meaningful for R22 bookings
    // that haven't been upgraded yet.
    let upgradeDiffPence = null;
    if (data.aircraft === 'r22' && !data.upgrade) {
      try {
        upgradeDiffPence = await getUpgradeDiffPence(data.duration, data.flightAmountPence || 0);
      } catch (err) {
        console.warn('[api/booking] upgrade diff calc failed:', err.message);
      }
    }

    // Whitelist fields we expose
    const safe = {
      paymentIntentId,
      customerName: data.customerName || '',
      customerEmail: data.customerEmail || '',
      productType: data.productType || 'discovery-flight',
      aircraft: data.aircraft || null,
      aircraftName: data.aircraftName || null,
      duration: data.duration || null,
      flightAmountPence: data.flightAmountPence || 0,
      totalAmountPence: data.totalAmountPence || 0,
      addons: data.addons || [],
      voucher: data.voucher || null,
      referralCode: data.referralCode || null,
      referredByCode: data.referredByCode || null,
      referralCompleted: !!data.referralCompleted,
      referralFreeItemSnapshot: data.referralFreeItemSnapshot || null,
      upgrade: data.upgrade || null,
      originalAircraft: data.originalAircraft || null,
      originalDuration: data.originalDuration || null,
      upgradeDiffPence,
    };
    res.json(safe);
  } catch (err) {
    logger.error({ err }, '[api/booking] error');
    res.status(500).json({ error: 'Internal error' });
  }
}

module.exports = { getBooking };

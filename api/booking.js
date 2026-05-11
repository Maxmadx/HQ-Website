const admin = require('firebase-admin');

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
    };
    res.json(safe);
  } catch (err) {
    console.error('[api/booking] error:', err.message);
    res.status(500).json({ error: 'Internal error' });
  }
}

module.exports = { getBooking };

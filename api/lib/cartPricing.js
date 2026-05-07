'use strict';

const admin = require('../firebase-admin');

/**
 * Recompute totalP from a flight + addons by looking up Firestore pricing.
 * Returns { flight: {…priceP}, addons: [{…priceP}], totalP } or throws on missing prices.
 */
async function repriceCart({ flight, addons = [] }) {
  const db = admin.firestore();
  const out = { flight: null, addons: [], totalP: 0 };

  if (flight) {
    const priceId = `discovery_${flight.aircraftId}_${flight.duration}min`;
    const snap = await db.collection('pricing').doc(priceId).get();
    if (!snap.exists) {
      const err = new Error(`Unknown flight price: ${priceId}`);
      err.statusCode = 400;
      throw err;
    }
    const priceP = Number(snap.data().price) || 0;
    out.flight = { aircraftId: flight.aircraftId, duration: flight.duration, priceP };
    out.totalP += priceP;
  }

  for (const addon of addons) {
    const snap = await db.collection('pricing').doc(addon.id).get();
    if (!snap.exists) {
      const err = new Error(`Unknown addon price: ${addon.id}`);
      err.statusCode = 400;
      throw err;
    }
    const unit = Number(snap.data().price) || 0;
    const qty = Number(addon.qty) || 1;
    out.addons.push({ id: addon.id, qty, priceP: unit * qty });
    out.totalP += unit * qty;
  }

  return out;
}

module.exports = { repriceCart };

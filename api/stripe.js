'use strict';

const Stripe = require('stripe');
const { getTransporter } = require('./lib/mailer');
const admin = require('./firebase-admin');

const MAX_ADDON_QTY = 10;

// Lazy-initialise so the module can be loaded without STRIPE_SECRET_KEY set
// (e.g. during unit tests that only exercise getPrice).
let _stripe = null;
function getStripe() {
  if (!_stripe) _stripe = Stripe(process.env.STRIPE_SECRET_KEY);
  return _stripe;
}

function parseAddonsFromMetadata(metadata = {}) {
  const count = parseInt(metadata.addonsCount || '0', 10) || 0;
  const addons = [];
  for (let i = 0; i < count; i++) {
    const raw = metadata[`addon_${i}`];
    if (!raw) continue;
    try {
      const item = JSON.parse(raw);
      if (item && typeof item === 'object') addons.push(item);
    } catch (err) {
      console.error(`[stripe] failed to parse addon_${i}:`, err.message);
    }
  }
  const fulfilment = (metadata.fulfilment || '').toLowerCase() || null;
  const shippingAddress = fulfilment === 'delivery'
    ? {
        line1: metadata.shippingLine1 || '',
        line2: metadata.shippingLine2 || '',
        city: metadata.shippingCity || '',
        postcode: metadata.shippingPostcode || '',
      }
    : null;
  return { addons, fulfilment, shippingAddress };
}

async function recordPurchaseEvent({ paymentIntentId, value, currency, items, itemCategory, sessionId }) {
  try {
    // Idempotency: skip if a purchase event for this transactionId already exists.
    // Note: this check-then-write is intentionally non-transactional. Stripe's
    // minimum retry gap (~5s) makes a near-simultaneous duplicate effectively
    // impossible. If volumes grow, switch to a Firestore transaction here.
    const existing = await admin.firestore()
      .collection('page_events')
      .where('eventType', '==', 'purchase')
      .where('transactionId', '==', paymentIntentId)
      .limit(1)
      .get();
    if (!existing.empty) return;

    await admin.firestore().collection('page_events').add({
      sessionId: sessionId || null,
      page: '/booking-confirmed',
      eventType: 'purchase',
      transactionId: paymentIntentId,
      value: typeof value === 'number' ? value : null,
      currency: currency || 'gbp',
      items: items || null,
      itemCategory: itemCategory || null,
      // Geo enrichment intentionally omitted — webhook IP is Stripe's, not the buyer's.
      // TODO: pull country/countryCode from the original session (via sessionId join) in a follow-up.
      country: null,
      countryCode: null,
      timestamp: admin.firestore.FieldValue.serverTimestamp(),
    });
  } catch (err) {
    console.error('[stripe webhook] failed to record purchase event:', err.message);
  }
}

function applyDiscountPence(pricePence, qty, discountPct) {
  const pct = Math.max(0, Math.min(100, Number(discountPct) || 0));
  return Math.round(Number(pricePence) * Number(qty) * (1 - pct / 100));
}

async function priceAddons(addons) {
  if (!Array.isArray(addons) || addons.length === 0) {
    return { lineItems: [], total: 0 };
  }

  const lineItems = [];
  let total = 0;

  for (const entry of addons) {
    const itemId = entry && entry.itemId;
    const qty = Number(entry && entry.qty);

    if (!itemId || !Number.isInteger(qty) || qty < 1 || qty > MAX_ADDON_QTY) {
      const err = new Error(`Invalid add-on entry: ${JSON.stringify(entry)}`);
      err.statusCode = 400;
      throw err;
    }

    const snap = await admin.firestore().collection('misc_items').doc(itemId).get();
    if (!snap.exists) {
      const err = new Error(`Add-on not found: ${itemId}`);
      err.statusCode = 400;
      throw err;
    }
    const data = snap.data();
    if (data.discoveryAddon !== true) {
      const err = new Error(`Add-on is no longer available: ${itemId}`);
      err.statusCode = 400;
      throw err;
    }
    if (data.priceType !== 'fixed' || !(Number(data.price) > 0)) {
      const err = new Error(`Add-on misconfigured: ${itemId}`);
      err.statusCode = 400;
      throw err;
    }

    const lineTotal = applyDiscountPence(data.price, qty, data.discoveryAddonDiscountPct);
    total += lineTotal;
    lineItems.push({
      itemId,
      name: data.name,
      qty,
      unitPrice: data.price,
      discountPct: Number(data.discoveryAddonDiscountPct) || 0,
      lineTotal,
    });
  }

  return { lineItems, total };
}


// Fallback prices in pence — used only if Firestore is unreachable.
// Keep in sync with seed-pricing.js and src/hooks/usePricing.js.
const PRICE_FALLBACK = {
  r22: { 30: 18000, 60: 36000 },
  r44: { 30: 30500, 60: 60500 },
  r66: { 30: 45000, 60: 85000 },
};

// London Tour base prices in pence per unit.
// Shared: price is per person × quantity. Private: flat price for the charter.
const LONDON_TOUR_BASE_PRICES = {
  shared:  { day: 19900, sunset: 24900, night: 29900 },
  private: { day: 149500, sunset: 169500, night: 189500 },
};

const AIRCRAFT_NAMES = {
  r22: 'Robinson R22',
  r44: 'Robinson R44',
  r66: 'Robinson R66',
};

/** Escapes user-supplied strings before embedding in HTML email bodies. */
function escapeHtml(str) {
  if (!str) return '';
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#x27;');
}

const REFERRAL_ALPHABET = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
function makeCode() {
  let out = '';
  for (let i = 0; i < 8; i++) out += REFERRAL_ALPHABET[Math.floor(Math.random() * REFERRAL_ALPHABET.length)];
  return out;
}

/**
 * Generates a unique referral code, retrying up to `maxRetries` times on collision.
 * Throws if a unique code can't be obtained.
 */
async function generateUniqueReferralCode(maxRetries = 5) {
  for (let attempt = 0; attempt < maxRetries; attempt++) {
    const code = makeCode();
    const ref = admin.firestore().collection('referral_codes').doc(code);
    const snap = await ref.get();
    if (!snap.exists) return code;
  }
  const err = new Error('Failed to generate unique referral code after retries');
  err.statusCode = 500;
  throw err;
}

/**
 * Returns a snapshot of the misc item currently flagged as the
 * free-referral reward, or null if none is flagged.
 */
async function getFreeReferralItemSnapshot() {
  const snap = await admin.firestore()
    .collection('misc_items')
    .where('freeReferralOffer', '==', true)
    .limit(1)
    .get();
  if (snap.empty) return null;
  const doc = snap.docs[0];
  const d = doc.data();
  return {
    id: doc.id,
    name: String(d.name || ''),
    priceDisplay: String(d.priceDisplay || ''),
  };
}

/**
 * Validates a `referredByCode` against constraints:
 *   - exists in `referral_codes`
 *   - owner's email is not the same as this customer's
 *   - owner's PI is not refunded (Stripe lookup)
 * Returns the owner record if valid; null otherwise. Never throws — invalid
 * codes are silently dropped per spec (the booking still proceeds).
 */
async function validateReferredByCode(code, customerEmail) {
  if (!code || typeof code !== 'string') return null;
  const normalized = code.trim().toUpperCase();
  if (!/^[A-Z0-9]{8}$/.test(normalized)) return null;
  try {
    const doc = await admin.firestore().collection('referral_codes').doc(normalized).get();
    if (!doc.exists) return null;
    const data = doc.data();
    if (!data.ownerPaymentIntentId) return null;
    if (data.ownerEmail && customerEmail && String(data.ownerEmail).toLowerCase() === String(customerEmail).toLowerCase()) {
      return null; // self-referral
    }
    // Check the owner's PI isn't refunded
    try {
      const ownerPi = await getStripe().paymentIntents.retrieve(data.ownerPaymentIntentId);
      if (ownerPi.status !== 'succeeded' && ownerPi.status !== 'processing') return null;
      // also skip if any charge on the PI has been refunded
      const chargeId = ownerPi.latest_charge;
      if (chargeId) {
        const charge = await getStripe().charges.retrieve(chargeId);
        if (charge.refunded || charge.amount_refunded > 0) return null;
      }
    } catch (stripeErr) {
      console.warn('[referral] owner PI lookup failed:', stripeErr.message);
      return null;
    }
    return { code: normalized, ...data };
  } catch (err) {
    console.warn('[referral] validateReferredByCode failed:', err.message);
    return null;
  }
}

/**
 * Looks up the price in pence from Firestore (admin SDK — bypasses security rules).
 * Falls back to PRICE_FALLBACK if Firestore is unreachable.
 * Returns null if the aircraft/duration combination doesn't exist at all.
 */
async function getPrice(aircraft, duration) {
  if (!aircraft || !duration) return null;
  const dur = Number(duration);

  // Guard: only accept known aircraft and durations
  if (!PRICE_FALLBACK[aircraft] || !PRICE_FALLBACK[aircraft][dur]) return null;

  try {
    const docId = `discovery_${aircraft}_${dur}min`;
    const snap = await admin.firestore().collection('pricing').doc(docId).get();
    if (snap.exists) {
      const price = snap.data().price;
      if (typeof price === 'number' && price > 0) return price;
    }
  } catch (err) {
    console.warn('[stripe] Firestore price lookup failed, using fallback:', err.message);
  }

  // Fallback — ensures charges always succeed even if Firestore is down
  return PRICE_FALLBACK[aircraft][dur];
}

/**
 * Returns the R44 price in pence for the given duration.
 * Wraps `getPrice` to surface a clearer error for the upgrade path.
 */
async function getR44Price(duration) {
  const dur = Number(duration);
  if (dur !== 30 && dur !== 60) {
    const err = new Error(`Invalid upgrade duration: ${duration}`);
    err.statusCode = 400;
    throw err;
  }
  const price = await getPrice('r44', dur);
  if (price === null || typeof price !== 'number' || price <= 0) {
    const err = new Error('R44 price unavailable');
    err.statusCode = 500;
    throw err;
  }
  return price;
}

/**
 * Creates a Stripe PaymentIntent with a price read from Firestore.
 * Throws with statusCode 400 if aircraft/duration is invalid.
 */
async function createPaymentIntent({
  aircraft, duration, customerName, customerEmail, customerPhone,
  wantsVoucher, voucherLocation, voucherMessage,
  addons = [], fulfilment, shippingAddress,
  cartId, referredByCode,
}) {
  const flightAmount = await getPrice(aircraft, duration);
  if (flightAmount === null) {
    const err = new Error(`Invalid aircraft or duration: ${aircraft} / ${duration}`);
    err.statusCode = 400;
    throw err;
  }

  const { lineItems, total: addonsAmount } = await priceAddons(addons);

  // Fulfilment is only relevant when there are add-ons. Voucher buyers
  // must pick delivery — recipient redeems the flight later.
  let resolvedFulfilment = null;
  let resolvedAddress = null;
  if (lineItems.length > 0) {
    resolvedFulfilment = wantsVoucher ? 'delivery' : (fulfilment || 'collect');
    if (resolvedFulfilment !== 'collect' && resolvedFulfilment !== 'delivery') {
      const err = new Error(`Invalid fulfilment: ${fulfilment}`);
      err.statusCode = 400;
      throw err;
    }
    if (resolvedFulfilment === 'delivery') {
      const a = shippingAddress || {};
      if (!a.line1 || !a.city || !a.postcode) {
        const err = new Error('Delivery address is required (line1, city, postcode)');
        err.statusCode = 400;
        throw err;
      }
      resolvedAddress = {
        line1: String(a.line1),
        line2: String(a.line2 || ''),
        city: String(a.city),
        postcode: String(a.postcode),
      };
    }
  }

  const amount = flightAmount + addonsAmount;

  // Stripe metadata caps each value at 500 chars but allows up to 50 keys.
  // Encode each add-on as its own key so the rich shape always fits, even
  // for large baskets. recordBooking re-assembles via addonsCount + addon_N.
  const addonKeyEntries = {};
  lineItems.forEach((item, i) => {
    addonKeyEntries[`addon_${i}`] = JSON.stringify(item);
  });

  const referralCode = await generateUniqueReferralCode();
  const freeItemSnapshot = await getFreeReferralItemSnapshot();
  const validatedReferredByCode = await validateReferredByCode(referredByCode, customerEmail);

  const paymentIntent = await getStripe().paymentIntents.create({
    amount,
    currency: 'gbp',
    metadata: {
      productType: 'discovery-flight',
      aircraft,
      aircraftName: AIRCRAFT_NAMES[aircraft],
      duration: String(duration),
      customerName,
      customerEmail,
      customerPhone,
      wantsVoucher: wantsVoucher ? 'true' : 'false',
      voucherLocation: voucherLocation || '',
      voucherMessage: voucherMessage || '',
      addonsCount: String(lineItems.length),
      ...addonKeyEntries,
      fulfilment: resolvedFulfilment || '',
      shippingLine1: resolvedAddress ? resolvedAddress.line1 : '',
      shippingLine2: resolvedAddress ? resolvedAddress.line2 : '',
      shippingCity: resolvedAddress ? resolvedAddress.city : '',
      shippingPostcode: resolvedAddress ? resolvedAddress.postcode : '',
      cartId: cartId || '',
      referralCode,
      referredByCode: validatedReferredByCode ? validatedReferredByCode.code : '',
    },
  });

  try {
    await admin.firestore().collection('referral_codes').doc(referralCode).set({
      code: referralCode,
      ownerPaymentIntentId: paymentIntent.id,
      ownerEmail: customerEmail || '',
      ...(freeItemSnapshot ? { freeItemSnapshot } : {}),
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
    });
  } catch (err) {
    console.error('[stripe] failed to write referral_codes doc:', err.message);
    // Non-fatal: the booking proceeds, but the referral system is degraded.
  }

  return paymentIntent;
}

/**
 * Looks up the London Tour price in pence.
 * For shared: base price × quantity. For private: flat price.
 * Falls back to LONDON_TOUR_BASE_PRICES if Firestore is unreachable.
 * Returns null if options are invalid.
 */
async function getLondonTourPrice(experience, timeOfDay, quantity) {
  if (!LONDON_TOUR_BASE_PRICES[experience]) return null;
  if (!LONDON_TOUR_BASE_PRICES[experience][timeOfDay]) return null;
  const qty = Number(quantity);
  if (!Number.isInteger(qty) || qty < 1 || qty > 4) return null;

  let basePrice = LONDON_TOUR_BASE_PRICES[experience][timeOfDay];

  try {
    const docId = `london_tour_${experience}_${timeOfDay}`;
    const snap = await admin.firestore().collection('pricing').doc(docId).get();
    if (snap.exists) {
      const price = snap.data().price;
      if (typeof price === 'number' && price > 0) basePrice = price;
    }
  } catch (err) {
    console.warn('[stripe] London tour Firestore price lookup failed, using fallback:', err.message);
  }

  return experience === 'shared' ? basePrice * qty : basePrice;
}

/**
 * Creates a Stripe PaymentIntent for a London Tour booking.
 */
async function createLondonTourPaymentIntent({ experience, timeOfDay, quantity, customerName, customerEmail, customerPhone, wantsVoucher, voucherLocation, voucherMessage }) {
  const amount = await getLondonTourPrice(experience, timeOfDay, quantity);
  if (amount === null) {
    const err = new Error(`Invalid London tour options: ${experience} / ${timeOfDay} / ${quantity}`);
    err.statusCode = 400;
    throw err;
  }

  const paymentIntent = await getStripe().paymentIntents.create({
    amount,
    currency: 'gbp',
    metadata: {
      productType: 'london-tour',
      experience,
      timeOfDay,
      quantity: String(quantity),
      customerName,
      customerEmail,
      customerPhone,
      wantsVoucher: wantsVoucher ? 'true' : 'false',
      voucherLocation: voucherLocation || '',
      voucherMessage: voucherMessage || '',
    },
  });

  return paymentIntent;
}

/**
 * Sends a booking confirmation email to the customer.
 */
async function sendConfirmationEmail({ customerName, customerEmail, aircraft, duration, amount, bookingRef, addons, fulfilment, shippingAddress, referralCode = '' }) {
  const priceFormatted = `£${(amount / 100).toFixed(2)}`;
  const aircraftName = AIRCRAFT_NAMES[aircraft] || aircraft;

  await getTransporter().sendMail({
    from: process.env.EMAIL_FROM,
    to: customerEmail,
    subject: `Discovery Flight Confirmed — ${escapeHtml(aircraftName)} · HQ Aviation`,
    html: `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width,initial-scale=1">
  <meta name="color-scheme" content="light">
  <style>
    @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;700&family=Inter:wght@400;500;600&display=swap');
  </style>
</head>
<body style="margin:0;padding:0;background:#F5F5F2;-webkit-font-smoothing:antialiased;">

<table width="100%" cellpadding="0" cellspacing="0" border="0" style="background:#F5F5F2;padding:48px 20px;">
  <tr>
    <td align="center">
      <table width="600" cellpadding="0" cellspacing="0" border="0" style="max-width:600px;width:100%;">

        <!-- Header -->
        <tr>
          <td style="background:#FAFAF8;padding:32px 40px;text-align:center;border-radius:12px 12px 0 0;border-top:1px solid #E8E6E1;border-left:1px solid #E8E6E1;border-right:1px solid #E8E6E1;">
            <img src="${process.env.SITE_URL || 'https://hqaviation.co.uk'}/assets/images/logos/hq/hq-aviation-logo-black.png" alt="HQ Aviation" width="120" style="display:block;margin:0 auto;height:auto;" />
          </td>
        </tr>
        <!-- Header divider -->
        <tr>
          <td style="background:#0A0A0A;height:3px;font-size:0;line-height:0;">&nbsp;</td>
        </tr>

        <!-- Body -->
        <tr>
          <td style="background:#FAFAF8;padding:48px 40px 40px;border-left:1px solid #E8E6E1;border-right:1px solid #E8E6E1;">

            <!-- Overline -->
            <p style="margin:0 0 14px;font-family:Inter,-apple-system,Arial,sans-serif;font-size:11px;font-weight:600;letter-spacing:0.14em;text-transform:uppercase;color:#E04A2F;">Booking Confirmed</p>

            <!-- Headline -->
            <h1 style="margin:0 0 20px;font-family:'Playfair Display',Georgia,serif;font-size:36px;font-weight:700;color:#0A0A0A;line-height:1.15;letter-spacing:-0.01em;">Your Discovery<br>Flight is Booked.</h1>

            <!-- Body copy -->
            <p style="margin:0 0 6px;font-family:Inter,-apple-system,Arial,sans-serif;font-size:15px;color:#1A1A1A;line-height:1.6;">Hi ${escapeHtml(customerName)},</p>
            <p style="margin:0 0 32px;font-family:Inter,-apple-system,Arial,sans-serif;font-size:15px;color:#555;line-height:1.75;">You've taken the first step into a world few ever experience. A member of the HQ Aviation team will be in touch shortly to arrange a date and time that works for you.</p>

            <!-- Divider -->
            <div style="height:1px;background:#E8E6E1;margin:0 0 32px;"></div>

            <!-- Summary label -->
            <p style="margin:0 0 16px;font-family:Inter,-apple-system,Arial,sans-serif;font-size:11px;font-weight:600;letter-spacing:0.14em;text-transform:uppercase;color:#999;">Booking Summary</p>

            <!-- Summary card -->
            <table width="100%" cellpadding="0" cellspacing="0" border="0" style="background:#FFFFFF;border:1px solid #E8E6E1;border-radius:12px;border-collapse:separate;border-spacing:0;overflow:hidden;">
              <tr>
                <td style="padding:18px 24px;border-bottom:1px solid #F0EEE9;">
                  <table width="100%" cellpadding="0" cellspacing="0" border="0">
                    <tr>
                      <td style="font-family:Inter,-apple-system,Arial,sans-serif;font-size:13px;color:#999;font-weight:500;">Aircraft</td>
                      <td align="right" style="font-family:Inter,-apple-system,Arial,sans-serif;font-size:14px;font-weight:600;color:#0A0A0A;">${escapeHtml(aircraftName)}</td>
                    </tr>
                  </table>
                </td>
              </tr>
              <tr>
                <td style="padding:18px 24px;border-bottom:1px solid #F0EEE9;">
                  <table width="100%" cellpadding="0" cellspacing="0" border="0">
                    <tr>
                      <td style="font-family:Inter,-apple-system,Arial,sans-serif;font-size:13px;color:#999;font-weight:500;">Experience</td>
                      <td align="right" style="font-family:Inter,-apple-system,Arial,sans-serif;font-size:14px;font-weight:600;color:#0A0A0A;">${escapeHtml(String(duration))}-Minute Discovery Flight</td>
                    </tr>
                  </table>
                </td>
              </tr>
              <tr>
                <td style="padding:18px 24px;border-bottom:1px solid #F0EEE9;">
                  <table width="100%" cellpadding="0" cellspacing="0" border="0">
                    <tr>
                      <td style="font-family:Inter,-apple-system,Arial,sans-serif;font-size:13px;color:#999;font-weight:500;">Amount Paid</td>
                      <td align="right" style="font-family:'Playfair Display',Georgia,serif;font-size:18px;font-weight:700;color:#0A0A0A;">${escapeHtml(priceFormatted)}</td>
                    </tr>
                  </table>
                </td>
              </tr>
              <tr>
                <td style="padding:14px 24px;background:#FAFAF8;border-radius:0 0 12px 12px;">
                  <table width="100%" cellpadding="0" cellspacing="0" border="0">
                    <tr>
                      <td style="font-family:Inter,-apple-system,Arial,sans-serif;font-size:11px;color:#CCC;letter-spacing:0.1em;text-transform:uppercase;">Reference</td>
                      <td align="right" style="font-family:'Courier New',Courier,monospace;font-size:11px;color:#BBB;">${escapeHtml(bookingRef)}</td>
                    </tr>
                  </table>
                </td>
              </tr>
            </table>

            ${(addons && addons.length > 0)
  ? `
    <h3 style="margin:32px 0 12px;font-family:Inter,-apple-system,Arial,sans-serif;font-size:11px;font-weight:600;letter-spacing:0.14em;text-transform:uppercase;color:#999;">Add-ons</h3>
    <ul style="padding-left:20px;margin:0 0 12px;font-family:Inter,-apple-system,Arial,sans-serif;font-size:14px;color:#1A1A1A;line-height:1.75;">
      ${addons.map((a) => {
        const unit = (a.unitPrice / 100).toFixed(2);
        const line = (a.lineTotal / 100).toFixed(2);
        const disc = a.discountPct > 0 ? ` (${a.discountPct}% off)` : '';
        return `<li>${escapeHtml(a.name)} × ${a.qty} — £${unit}${disc} = £${line}</li>`;
      }).join('')}
    </ul>
    <p style="margin:0 0 32px;font-family:Inter,-apple-system,Arial,sans-serif;font-size:14px;color:#1A1A1A;line-height:1.6;"><strong>Fulfilment:</strong> ${
      fulfilment === 'delivery'
        ? `Delivery to ${escapeHtml([shippingAddress.line1, shippingAddress.line2, shippingAddress.city, shippingAddress.postcode].filter(Boolean).join(', '))}`
        : 'Collect at Denham on the day of your flight.'
    }</p>
  `
  : ''}
            ${referralCode ? `
            <!-- Referral CTA -->
            <div style="margin: 32px 0; padding: 24px; background: #faf9f6; border-radius: 12px; border: 1px solid #e8e8e8;">
              <h2 style="margin: 0 0 12px; font-size: 18px; font-family: 'Playfair Display', Georgia, serif; color: #0A0A0A;">Refer a friend</h2>
              <p style="margin: 0 0 16px; color: #444; line-height: 1.5; font-family: Inter, -apple-system, Arial, sans-serif; font-size: 14px;">
                Share this with a friend. When they book a Discovery Flight using your link, you get a free HQ item &mdash; collect it next time you&rsquo;re at HQ.
              </p>
              <a href="${process.env.SITE_URL || 'https://hqaviation.co.uk'}/training/trial-lessons?ref=${escapeHtml(referralCode)}"
                 style="display: inline-block; padding: 12px 20px; background: #1a1a1a; color: #fff; text-decoration: none; border-radius: 6px; font-weight: 600; font-family: Inter, -apple-system, Arial, sans-serif; font-size: 14px;">
                Share with a friend
              </a>
            </div>
            ` : ''}

            <!-- What happens next -->
            <table width="100%" cellpadding="0" cellspacing="0" border="0" style="margin:32px 0 0;background:#FFFFFF;border-left:3px solid #E04A2F;border-radius:0 8px 8px 0;border-top:1px solid #E8E6E1;border-right:1px solid #E8E6E1;border-bottom:1px solid #E8E6E1;">
              <tr>
                <td style="padding:20px 24px;">
                  <p style="margin:0 0 6px;font-family:Inter,-apple-system,Arial,sans-serif;font-size:11px;font-weight:600;letter-spacing:0.12em;text-transform:uppercase;color:#E04A2F;">What Happens Next</p>
                  <p style="margin:0;font-family:Inter,-apple-system,Arial,sans-serif;font-size:14px;color:#555;line-height:1.7;">We'll call you to arrange your flight date. In the meantime, you're welcome to visit us at Denham Aerodrome — the coffee is always on.</p>
                </td>
              </tr>
            </table>

            <!-- CTA -->
            <div style="height:40px;"></div>
            <table width="100%" cellpadding="0" cellspacing="0" border="0">
              <tr>
                <td align="center">
                  <a href="https://hqaviation.co.uk" style="display:inline-block;padding:14px 40px;background:#0A0A0A;color:#FFFFFF;text-decoration:none;font-family:Inter,-apple-system,Arial,sans-serif;font-size:12px;font-weight:600;letter-spacing:0.1em;text-transform:uppercase;border-radius:8px;">Return to HQ Aviation</a>
                </td>
              </tr>
            </table>

          </td>
        </tr>

        <!-- Footer -->
        <tr>
          <td style="background:#0A0A0A;padding:28px 40px;text-align:center;border-radius:0 0 12px 12px;">
            <p style="margin:0 0 8px;font-family:Inter,-apple-system,Arial,sans-serif;font-size:12px;color:#555;letter-spacing:0.08em;text-transform:uppercase;">HQ Aviation · Denham Aerodrome · Buckinghamshire · UB9 5DF</p>
            <p style="margin:0;font-family:Inter,-apple-system,Arial,sans-serif;font-size:11px;color:#444;line-height:1.6;">You received this email because a booking was made at hqaviation.co.uk</p>
          </td>
        </tr>

      </table>
    </td>
  </tr>
</table>

</body>
</html>`,
  });
}

/**
 * Sends a London Tour booking confirmation email to the customer.
 */
async function sendLondonTourConfirmationEmail({ customerName, customerEmail, experience, timeOfDay, quantity, amount, bookingRef }) {
  const priceFormatted = `£${(amount / 100).toFixed(2)}`;
  const experienceName = experience === 'private' ? 'Private Charter' : 'Shared';
  const timeName = { day: 'Daytime', sunset: 'Sunset', night: 'Night' }[timeOfDay] || timeOfDay;
  const passengersLine = experience === 'shared'
    ? `${quantity} passenger${quantity > 1 ? 's' : ''}`
    : 'Private charter (up to 4)';

  await getTransporter().sendMail({
    from: process.env.EMAIL_FROM,
    to: customerEmail,
    subject: `London Tour Confirmed — ${experienceName} · HQ Aviation`,
    html: `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width,initial-scale=1">
  <meta name="color-scheme" content="light">
  <style>
    @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;700&family=Inter:wght@400;500;600&display=swap');
  </style>
</head>
<body style="margin:0;padding:0;background:#F5F5F2;-webkit-font-smoothing:antialiased;">

<table width="100%" cellpadding="0" cellspacing="0" border="0" style="background:#F5F5F2;padding:48px 20px;">
  <tr>
    <td align="center">
      <table width="600" cellpadding="0" cellspacing="0" border="0" style="max-width:600px;width:100%;">

        <!-- Header -->
        <tr>
          <td style="background:#FAFAF8;padding:32px 40px;text-align:center;border-radius:12px 12px 0 0;border-top:1px solid #E8E6E1;border-left:1px solid #E8E6E1;border-right:1px solid #E8E6E1;">
            <img src="${process.env.SITE_URL || 'https://hqaviation.co.uk'}/assets/images/logos/hq/hq-aviation-logo-black.png" alt="HQ Aviation" width="120" style="display:block;margin:0 auto;height:auto;" />
          </td>
        </tr>
        <tr>
          <td style="background:#0A0A0A;height:3px;font-size:0;line-height:0;">&nbsp;</td>
        </tr>

        <!-- Body -->
        <tr>
          <td style="background:#FAFAF8;padding:48px 40px 40px;border-left:1px solid #E8E6E1;border-right:1px solid #E8E6E1;">

            <p style="margin:0 0 14px;font-family:Inter,-apple-system,Arial,sans-serif;font-size:11px;font-weight:600;letter-spacing:0.14em;text-transform:uppercase;color:#E04A2F;">Booking Confirmed</p>
            <h1 style="margin:0 0 20px;font-family:'Playfair Display',Georgia,serif;font-size:36px;font-weight:700;color:#0A0A0A;line-height:1.15;letter-spacing:-0.01em;">Your London Tour<br>is Booked.</h1>

            <p style="margin:0 0 6px;font-family:Inter,-apple-system,Arial,sans-serif;font-size:15px;color:#1A1A1A;line-height:1.6;">Hi ${escapeHtml(customerName)},</p>
            <p style="margin:0 0 32px;font-family:Inter,-apple-system,Arial,sans-serif;font-size:15px;color:#555;line-height:1.75;">London from above is something you'll never forget. A member of the HQ Aviation team will be in touch shortly to confirm your flight date and time.</p>

            <div style="height:1px;background:#E8E6E1;margin:0 0 32px;"></div>
            <p style="margin:0 0 16px;font-family:Inter,-apple-system,Arial,sans-serif;font-size:11px;font-weight:600;letter-spacing:0.14em;text-transform:uppercase;color:#999;">Booking Summary</p>

            <table width="100%" cellpadding="0" cellspacing="0" border="0" style="background:#FFFFFF;border:1px solid #E8E6E1;border-radius:12px;border-collapse:separate;border-spacing:0;overflow:hidden;">
              <tr>
                <td style="padding:18px 24px;border-bottom:1px solid #F0EEE9;">
                  <table width="100%" cellpadding="0" cellspacing="0" border="0">
                    <tr>
                      <td style="font-family:Inter,-apple-system,Arial,sans-serif;font-size:13px;color:#999;font-weight:500;">Experience</td>
                      <td align="right" style="font-family:Inter,-apple-system,Arial,sans-serif;font-size:14px;font-weight:600;color:#0A0A0A;">${escapeHtml(experienceName)}</td>
                    </tr>
                  </table>
                </td>
              </tr>
              <tr>
                <td style="padding:18px 24px;border-bottom:1px solid #F0EEE9;">
                  <table width="100%" cellpadding="0" cellspacing="0" border="0">
                    <tr>
                      <td style="font-family:Inter,-apple-system,Arial,sans-serif;font-size:13px;color:#999;font-weight:500;">Time of Day</td>
                      <td align="right" style="font-family:Inter,-apple-system,Arial,sans-serif;font-size:14px;font-weight:600;color:#0A0A0A;">${escapeHtml(timeName)}</td>
                    </tr>
                  </table>
                </td>
              </tr>
              <tr>
                <td style="padding:18px 24px;border-bottom:1px solid #F0EEE9;">
                  <table width="100%" cellpadding="0" cellspacing="0" border="0">
                    <tr>
                      <td style="font-family:Inter,-apple-system,Arial,sans-serif;font-size:13px;color:#999;font-weight:500;">Passengers</td>
                      <td align="right" style="font-family:Inter,-apple-system,Arial,sans-serif;font-size:14px;font-weight:600;color:#0A0A0A;">${escapeHtml(passengersLine)}</td>
                    </tr>
                  </table>
                </td>
              </tr>
              <tr>
                <td style="padding:18px 24px;border-bottom:1px solid #F0EEE9;">
                  <table width="100%" cellpadding="0" cellspacing="0" border="0">
                    <tr>
                      <td style="font-family:Inter,-apple-system,Arial,sans-serif;font-size:13px;color:#999;font-weight:500;">Amount Paid</td>
                      <td align="right" style="font-family:'Playfair Display',Georgia,serif;font-size:18px;font-weight:700;color:#0A0A0A;">${escapeHtml(priceFormatted)}</td>
                    </tr>
                  </table>
                </td>
              </tr>
              <tr>
                <td style="padding:14px 24px;background:#FAFAF8;border-radius:0 0 12px 12px;">
                  <table width="100%" cellpadding="0" cellspacing="0" border="0">
                    <tr>
                      <td style="font-family:Inter,-apple-system,Arial,sans-serif;font-size:11px;color:#CCC;letter-spacing:0.1em;text-transform:uppercase;">Reference</td>
                      <td align="right" style="font-family:'Courier New',Courier,monospace;font-size:11px;color:#BBB;">${escapeHtml(bookingRef)}</td>
                    </tr>
                  </table>
                </td>
              </tr>
            </table>

            <table width="100%" cellpadding="0" cellspacing="0" border="0" style="margin:32px 0 0;background:#FFFFFF;border-left:3px solid #E04A2F;border-radius:0 8px 8px 0;border-top:1px solid #E8E6E1;border-right:1px solid #E8E6E1;border-bottom:1px solid #E8E6E1;">
              <tr>
                <td style="padding:20px 24px;">
                  <p style="margin:0 0 6px;font-family:Inter,-apple-system,Arial,sans-serif;font-size:11px;font-weight:600;letter-spacing:0.12em;text-transform:uppercase;color:#E04A2F;">What Happens Next</p>
                  <p style="margin:0;font-family:Inter,-apple-system,Arial,sans-serif;font-size:14px;color:#555;line-height:1.7;">We'll call you to confirm your flight date and brief you on what to expect. Your tour departs from Denham Aerodrome — we'll share full directions when we speak.</p>
                </td>
              </tr>
            </table>

            <div style="height:40px;"></div>
            <table width="100%" cellpadding="0" cellspacing="0" border="0">
              <tr>
                <td align="center">
                  <a href="https://hqaviation.co.uk" style="display:inline-block;padding:14px 40px;background:#0A0A0A;color:#FFFFFF;text-decoration:none;font-family:Inter,-apple-system,Arial,sans-serif;font-size:12px;font-weight:600;letter-spacing:0.1em;text-transform:uppercase;border-radius:8px;">Return to HQ Aviation</a>
                </td>
              </tr>
            </table>

          </td>
        </tr>

        <!-- Footer -->
        <tr>
          <td style="background:#0A0A0A;padding:28px 40px;text-align:center;border-radius:0 0 12px 12px;">
            <p style="margin:0 0 8px;font-family:Inter,-apple-system,Arial,sans-serif;font-size:12px;color:#555;letter-spacing:0.08em;text-transform:uppercase;">HQ Aviation · Denham Aerodrome · Buckinghamshire · UB9 5DF</p>
            <p style="margin:0;font-family:Inter,-apple-system,Arial,sans-serif;font-size:11px;color:#444;line-height:1.6;">You received this email because a booking was made at hqaviation.co.uk</p>
          </td>
        </tr>

      </table>
    </td>
  </tr>
</table>

</body>
</html>`,
  });
}

/**
 * Notifies the HQ team that a referral code has been redeemed and a free item needs fulfilling.
 */
async function sendReferralRedeemedEmail({ owner, redeemer, freeItem }) {
  if (!process.env.HQ_TEAM_EMAIL) {
    console.warn('[referral] HQ_TEAM_EMAIL env var not set, skipping notification');
    return;
  }
  const itemLine = freeItem
    ? `Free item to ship/hand over: <strong>${escapeHtml(freeItem.name)}</strong> (id: ${escapeHtml(freeItem.id)})`
    : 'Free item: <em>none flagged at the time of original booking</em>';
  const html = `
    <p>A referral has been redeemed.</p>
    <ul>
      <li><strong>Original booker:</strong> ${escapeHtml(owner.name || '')} &lt;${escapeHtml(owner.email || '')}&gt; (PI: ${escapeHtml(owner.paymentIntentId)})</li>
      <li><strong>Friend who used the code:</strong> ${escapeHtml(redeemer.name || '')} &lt;${escapeHtml(redeemer.email || '')}&gt; (PI: ${escapeHtml(redeemer.paymentIntentId)})</li>
      <li>${itemLine}</li>
    </ul>
    <p>Pickup is at HQ — no shipping required.</p>
  `;
  return getTransporter().sendMail({
    from: process.env.EMAIL_FROM,
    to: process.env.HQ_TEAM_EMAIL,
    subject: 'Referral redeemed — free item to fulfil',
    html,
  });
}

/**
 * Handles an incoming Stripe webhook request.
 * Verifies signature and processes payment_intent.succeeded.
 * req.body MUST be a raw Buffer — use express.raw({ type: 'application/json' }) on this route.
 */
async function handleWebhook(req) {
  if (!Buffer.isBuffer(req.body)) {
    const err = new Error('Webhook body must be a raw Buffer. Ensure express.raw() middleware is used for this route, not express.json().');
    err.statusCode = 500;
    throw err;
  }

  const sig = req.headers['stripe-signature'];

  const event = getStripe().webhooks.constructEvent(
    req.body,
    sig,
    process.env.STRIPE_WEBHOOK_SECRET
  );

  if (event.type === 'payment_intent.succeeded') {
    const pi = event.data.object;
    const { productType, customerName, customerEmail, customerPhone, wantsVoucher, voucherLocation, voucherMessage } = pi.metadata;

    // Persist booking to Firestore
    try {
      const bookingData = {
        ref: pi.id,
        productType: productType || 'discovery-flight',
        status: 'new',
        createdAt: admin.firestore.FieldValue.serverTimestamp(),
        amount: pi.amount,
        customerName: customerName || '',
        customerEmail: customerEmail || '',
        customerPhone: customerPhone || '',
        wantsVoucher: wantsVoucher === 'true',
        voucherAddress: voucherLocation || null,
        voucherMessage: voucherMessage || null,
      };

      if (productType === 'london-tour') {
        const { experience, timeOfDay, quantity } = pi.metadata;
        bookingData.experience = experience;
        bookingData.timeOfDay = timeOfDay;
        bookingData.quantity = Number(quantity);
      } else if (productType === 'misc') {
        const { itemId, itemName, qty, apparelSize } = pi.metadata;
        bookingData.itemId = itemId || '';
        bookingData.itemName = itemName || '';
        bookingData.qty = Number(qty) || 1;
        if (apparelSize) bookingData.apparelSize = apparelSize;
      } else {
        const { aircraft, aircraftName, duration, referralCode, referredByCode } = pi.metadata;
        bookingData.aircraft = aircraft;
        bookingData.aircraftName = aircraftName || aircraft;
        bookingData.duration = Number(duration);
        if (referralCode) bookingData.referralCode = referralCode;
        if (referredByCode) bookingData.referredByCode = referredByCode;
        bookingData.referralCompleted = false;
        // Snapshot the free-item at booking write time (in case it was deleted later)
        try {
          const codesDoc = referralCode
            ? await admin.firestore().collection('referral_codes').doc(referralCode).get()
            : null;
          if (codesDoc && codesDoc.exists) {
            const cd = codesDoc.data();
            if (cd.freeItemSnapshot) bookingData.referralFreeItemSnapshot = cd.freeItemSnapshot;
          }
        } catch {}
        const { addons: webhookParsedAddons, fulfilment: webhookFulfilment, shippingAddress: webhookShippingAddress } = parseAddonsFromMetadata(pi.metadata);
        bookingData.addons = webhookParsedAddons;
        bookingData.fulfilment = webhookFulfilment;
        bookingData.shippingAddress = webhookShippingAddress;
        // flightAmountPence: the PI amount minus the addon line totals (used for upgrade math in Plan C)
        const addonTotal = webhookParsedAddons.reduce((sum, a) => sum + (Number(a.lineTotal) || 0), 0);
        bookingData.flightAmountPence = pi.amount - addonTotal;
        bookingData.totalAmountPence = pi.amount;
      }

      await admin.firestore().collection('bookings').doc(pi.id).set(bookingData, { merge: true });

      // Also write misc orders to the misc_marketplace collection
      if (productType === 'misc') {
        const { itemId, itemName, qty, apparelSize, shippingLine1, shippingLine2, shippingCity, shippingPostcode } = pi.metadata;
        await admin.firestore().collection('misc_marketplace').doc(pi.id).set({
          type: 'order',
          status: 'new',
          createdAt: admin.firestore.FieldValue.serverTimestamp(),
          ref: pi.id,
          amount: pi.amount,
          itemId: itemId || '',
          itemName: itemName || '',
          qty: Number(qty),
          customerName: customerName || '',
          customerEmail: customerEmail || '',
          customerPhone: customerPhone || '',
          ...(apparelSize ? { apparelSize } : {}),
          ...(shippingLine1 ? { shippingLine1, shippingLine2: shippingLine2 || '', shippingCity, shippingPostcode } : {}),
        });
      }

      // Referral redemption: when the friend's PI succeeds, flip the owner's record + email HQ
      try {
        const incomingReferredBy = pi.metadata.referredByCode;
        if (incomingReferredBy && pi.metadata.productType !== 'discovery-flight-upgrade') {
          const codeDoc = await admin.firestore().collection('referral_codes').doc(incomingReferredBy).get();
          if (codeDoc.exists) {
            const cd = codeDoc.data();
            const ownerBookingRef = admin.firestore().collection('bookings').doc(cd.ownerPaymentIntentId);
            const ownerSnap = await ownerBookingRef.get();
            if (ownerSnap.exists && !ownerSnap.data().referralCompleted) {
              await ownerBookingRef.update({
                referralCompleted: true,
                referralCompletedAt: admin.firestore.FieldValue.serverTimestamp(),
                referralCompletedByPaymentIntentId: pi.id,
                updatedAt: admin.firestore.FieldValue.serverTimestamp(),
              });
              // Notify HQ team
              await sendReferralRedeemedEmail({
                owner: { name: ownerSnap.data().customerName, email: ownerSnap.data().customerEmail, paymentIntentId: cd.ownerPaymentIntentId },
                redeemer: { name: customerName, email: customerEmail, paymentIntentId: pi.id },
                freeItem: cd.freeItemSnapshot || ownerSnap.data().referralFreeItemSnapshot || null,
              });
            }
          }
        }
      } catch (refErr) {
        console.error('[stripe webhook] referral redemption failed:', refErr.message);
      }
    } catch (dbErr) {
      console.error('[stripe webhook] failed to save booking to Firestore:', dbErr.message);
    }

    // Record GA4-canonical purchase event for funnel analytics
    {
      const productCategory = (() => {
        if (productType === 'london-tour') return 'london-tour';
        if (productType === 'misc') return 'misc';
        return 'discovery-flight';
      })();

      const purchaseItems = (() => {
        if (productType === 'london-tour') {
          const { experience, timeOfDay, quantity } = pi.metadata;
          const qty = Number(quantity) || 1;
          return [{
            item_id: `london-tour-${experience}-${timeOfDay}`,
            item_name: `London Tour: ${experience} ${timeOfDay}`,
            item_category: 'london-tour',
            price: (pi.amount / 100) / qty,
            quantity: qty,
            currency: 'gbp',
          }];
        }
        if (productType === 'misc') {
          const { itemId, itemName, qty } = pi.metadata;
          const quantity = Number(qty) || 1;
          return [{
            item_id: itemId || 'misc',
            item_name: itemName || 'Misc item',
            item_category: 'misc',
            price: (pi.amount / 100) / quantity,
            quantity,
            currency: 'gbp',
          }];
        }
        const { aircraft, duration } = pi.metadata;
        return [{
          item_id: `${aircraft}-${duration}`,
          item_name: `${aircraft} ${duration}min Discovery Flight`,
          item_category: 'discovery-flight',
          price: pi.amount / 100,
          quantity: 1,
          currency: 'gbp',
        }];
      })();

      await recordPurchaseEvent({
        paymentIntentId: pi.id,
        value: pi.amount / 100,
        currency: 'gbp',
        items: purchaseItems,
        itemCategory: productCategory,
        sessionId: pi.metadata.sessionId || null,
      }).catch((err) => {
        // Belt-and-suspenders: helper has internal try/catch but never let an unexpected
        // throw bubble up to Stripe — that would trigger a webhook retry on a successful payment.
        console.error('[stripe webhook] recordPurchaseEvent unexpected throw:', err.message);
      });
    }

    // Promote matching cart to completed (Phase 2). Idempotent — safe on webhook retries.
    try {
      const cartId = pi.metadata && pi.metadata.cartId;
      if (cartId) {
        const cartRef = admin.firestore().collection('carts').doc(cartId);
        const cartSnap = await cartRef.get();
        if (cartSnap.exists && cartSnap.data().status !== 'completed') {
          await cartRef.set({
            status: 'completed',
            stripePaymentIntentId: pi.id,
            completedAt: admin.firestore.FieldValue.serverTimestamp(),
            updatedAt: admin.firestore.FieldValue.serverTimestamp(),
          }, { merge: true });
        }
      }
    } catch (cartErr) {
      console.error('[stripe webhook] cart promotion failed:', cartErr.message);
    }

    // Send confirmation email
    try {
      if (productType === 'london-tour') {
        const { experience, timeOfDay, quantity } = pi.metadata;
        await sendLondonTourConfirmationEmail({
          customerName,
          customerEmail,
          experience,
          timeOfDay,
          quantity: Number(quantity),
          amount: pi.amount,
          bookingRef: pi.id,
        });
      } else if (productType === 'misc') {
        // No confirmation email for misc orders — admin contacts customer
      } else {
        // Default: discovery-flight (includes legacy intents without productType)
        const { aircraft, duration } = pi.metadata;
        const { addons: webhookParsedAddons, fulfilment: webhookFulfilment, shippingAddress: webhookShippingAddress } = parseAddonsFromMetadata(pi.metadata);
        await sendConfirmationEmail({
          customerName,
          customerEmail,
          aircraft,
          duration: Number(duration),
          amount: pi.amount,
          bookingRef: pi.id,
          addons: webhookParsedAddons,
          fulfilment: webhookFulfilment,
          shippingAddress: webhookShippingAddress,
          referralCode: pi.metadata.referralCode || '',
        });
      }
    } catch (emailErr) {
      console.error('[stripe webhook] confirmation email failed:', emailErr.message);
    }
  } else {
    console.log(`[stripe webhook] unhandled event type: ${event.type}`);
  }
}

/**
 * Verifies a payment intent succeeded and writes the booking to Firestore.
 * Idempotent — safe to call from both the client confirmation page AND the webhook.
 * Does not overwrite an existing booking's status field.
 */
async function recordBooking(paymentIntentId) {
  if (!paymentIntentId) {
    const err = new Error('paymentIntentId is required');
    err.statusCode = 400;
    throw err;
  }

  const pi = await getStripe().paymentIntents.retrieve(paymentIntentId);

  if (pi.status !== 'succeeded') {
    const err = new Error(`Payment intent ${paymentIntentId} has not succeeded (status: ${pi.status})`);
    err.statusCode = 400;
    throw err;
  }

  const { productType, customerName, customerEmail, customerPhone,
          wantsVoucher, voucherLocation, voucherMessage } = pi.metadata || {};

  const type = productType || 'discovery-flight';

  const bookingData = {
    ref: pi.id,
    productType: type,
    createdAt: admin.firestore.Timestamp.fromMillis(pi.created * 1000),
    amount: pi.amount,
    customerName: customerName || '',
    customerEmail: customerEmail || '',
    customerPhone: customerPhone || '',
    wantsVoucher: wantsVoucher === 'true',
    voucherAddress: voucherLocation || null,
    voucherMessage: voucherMessage || null,
  };

  if (type === 'misc') {
    const { itemId, itemName, qty, apparelSize } = pi.metadata || {};
    bookingData.itemId = itemId || '';
    bookingData.itemName = itemName || '';
    bookingData.qty = Number(qty) || 1;
    if (apparelSize) bookingData.apparelSize = apparelSize;
  } else if (type === 'london-tour') {
    const { experience, timeOfDay, quantity } = pi.metadata || {};
    bookingData.experience = experience || '';
    bookingData.timeOfDay = timeOfDay || '';
    bookingData.quantity = Number(quantity) || 1;
  } else {
    const { aircraft, aircraftName, duration, referralCode, referredByCode } = pi.metadata || {};
    bookingData.aircraft = aircraft || '';
    bookingData.aircraftName = aircraftName || AIRCRAFT_NAMES[aircraft] || aircraft || '';
    bookingData.duration = Number(duration) || 0;
    if (referralCode) bookingData.referralCode = referralCode;
    if (referredByCode) bookingData.referredByCode = referredByCode;
    bookingData.referralCompleted = false;
  }

  const { addons: parsedAddons, fulfilment, shippingAddress } = parseAddonsFromMetadata(pi.metadata);

  bookingData.addons = parsedAddons;
  bookingData.fulfilment = fulfilment;
  bookingData.shippingAddress = shippingAddress;

  // flightAmountPence / totalAmountPence — used for upgrade math (Plan C)
  const addonTotal = (parsedAddons || []).reduce((sum, a) => sum + (Number(a.lineTotal) || 0), 0);
  bookingData.flightAmountPence = pi.amount - addonTotal;
  bookingData.totalAmountPence = pi.amount;

  const ref = admin.firestore().collection('bookings').doc(pi.id);
  const existing = await ref.get();

  if (existing.exists) {
    // Preserve existing status — only update booking data fields
    const { status, ...dataWithoutStatus } = bookingData;
    await ref.update(dataWithoutStatus);
  } else {
    await ref.set({ ...bookingData, status: 'new' });
  }

  // Mirror handleWebhook: also write misc orders to misc_marketplace
  // so the admin view picks them up even when the webhook can't reach this server.
  if (type === 'misc') {
    const { itemId, itemName, qty, apparelSize, shippingLine1, shippingLine2, shippingCity, shippingPostcode } = pi.metadata || {};
    const marketRef = admin.firestore().collection('misc_marketplace').doc(pi.id);
    const existingMarket = await marketRef.get();
    if (!existingMarket.exists) {
      await marketRef.set({
        type: 'order',
        status: 'new',
        createdAt: admin.firestore.FieldValue.serverTimestamp(),
        ref: pi.id,
        amount: pi.amount,
        itemId: itemId || '',
        itemName: itemName || '',
        qty: Number(qty),
        customerName: customerName || '',
        customerEmail: customerEmail || '',
        customerPhone: customerPhone || '',
        ...(apparelSize ? { apparelSize } : {}),
        ...(shippingLine1 ? { shippingLine1, shippingLine2: shippingLine2 || '', shippingCity, shippingPostcode } : {}),
      });
    }
  }

  return bookingData;
}

/**
 * Creates a Stripe PaymentIntent for a misc item purchase.
 * Price is read from Firestore server-side — the client-supplied amount is never trusted.
 */
async function createMiscPaymentIntent({ itemId, qty, customerName, customerEmail, customerPhone, shippingAddress, size }) {
  const snap = await admin.firestore().collection('misc_items').doc(itemId).get();
  if (!snap.exists) {
    const err = new Error(`Misc item not found: ${itemId}`);
    err.statusCode = 400;
    throw err;
  }
  const item = snap.data();
  if (item.priceType !== 'fixed' || !item.price || item.price <= 0) {
    const err = new Error('This item is not available for purchase');
    err.statusCode = 400;
    throw err;
  }

  const qtyNum = Number(qty);
  if (!Number.isInteger(qtyNum) || qtyNum < 1) {
    const err = new Error('Invalid quantity');
    err.statusCode = 400;
    throw err;
  }
  if (item.hasQuantity) {
    if (qtyNum > item.stock) {
      const err = new Error(`Quantity exceeds available stock (${item.stock})`);
      err.statusCode = 400;
      throw err;
    }
  } else if (qtyNum !== 1) {
    const err = new Error('This item does not support multiple quantities');
    err.statusCode = 400;
    throw err;
  }

  if (item.requiresShipping) {
    if (!shippingAddress?.line1 || !shippingAddress?.city || !shippingAddress?.postcode) {
      const err = new Error('Delivery address is required for this item');
      err.statusCode = 400;
      throw err;
    }
  }

  let resolvedSize = '';
  if (item.apparel && Array.isArray(item.sizes) && item.sizes.length > 0) {
    const s = String(size || '').trim().toUpperCase();
    if (!s) {
      const err = new Error('Size is required for this apparel item');
      err.statusCode = 400;
      throw err;
    }
    if (!item.sizes.includes(s)) {
      const err = new Error(`Size ${s} is not available for this item`);
      err.statusCode = 400;
      throw err;
    }
    resolvedSize = s;
  }

  const amount = item.price * qtyNum;

  const paymentIntent = await getStripe().paymentIntents.create({
    amount,
    currency: 'gbp',
    metadata: {
      productType: 'misc',
      itemId,
      itemName: String(item.name || '').slice(0, 500),
      qty: String(qtyNum),
      customerName,
      customerEmail,
      customerPhone,
      shippingLine1: shippingAddress?.line1 || '',
      shippingLine2: shippingAddress?.line2 || '',
      shippingCity: shippingAddress?.city || '',
      shippingPostcode: shippingAddress?.postcode || '',
      apparelSize: resolvedSize,
    },
  });

  return paymentIntent;
}

/**
 * Creates a Stripe PaymentIntent for the price difference between an
 * R22 booking and a desired R44 duration. Add-ons and voucher are NOT
 * recharged — only the flight portion changes.
 *
 * @param {Object} args
 * @param {string} args.originalPaymentIntentId  Existing R22 booking PI ID.
 * @param {30|60}  args.newDuration              Target R44 duration.
 * @returns {Promise<{ clientSecret: string, diffPence: number, newDuration: number }>}
 */
async function createUpgradePaymentIntent({ originalPaymentIntentId, newDuration }) {
  if (!originalPaymentIntentId || typeof originalPaymentIntentId !== 'string') {
    const err = new Error('originalPaymentIntentId required');
    err.statusCode = 400;
    throw err;
  }

  const bookingRef = admin.firestore().collection('bookings').doc(originalPaymentIntentId);
  const snap = await bookingRef.get();
  if (!snap.exists) {
    const err = new Error('Booking not found');
    err.statusCode = 404;
    throw err;
  }
  const booking = snap.data();

  if (booking.aircraft !== 'r22') {
    const err = new Error("This booking isn't eligible for an R44 upgrade");
    err.statusCode = 400;
    throw err;
  }
  if (booking.upgrade) {
    const err = new Error('This booking has already been upgraded');
    err.statusCode = 400;
    throw err;
  }

  const r44Price = await getR44Price(newDuration);
  const flightPaid = Number(booking.flightAmountPence) || 0;
  const diffPence = r44Price - flightPaid;
  if (diffPence <= 0) {
    const err = new Error('Selected duration is not an upgrade');
    err.statusCode = 400;
    throw err;
  }

  const paymentIntent = await getStripe().paymentIntents.create({
    amount: diffPence,
    currency: 'gbp',
    metadata: {
      productType: 'discovery-flight-upgrade',
      originalPaymentIntentId,
      newAircraft: 'r44',
      newDuration: String(newDuration),
      customerName: String(booking.customerName || '').slice(0, 500),
      customerEmail: String(booking.customerEmail || '').slice(0, 500),
      customerPhone: String(booking.customerPhone || '').slice(0, 500),
    },
  });

  return {
    clientSecret: paymentIntent.client_secret,
    diffPence,
    newDuration: Number(newDuration),
  };
}

module.exports = { getPrice, applyDiscountPence, priceAddons, createPaymentIntent, getLondonTourPrice, createLondonTourPaymentIntent, createMiscPaymentIntent, createUpgradePaymentIntent, getR44Price, handleWebhook, recordBooking, recordPurchaseEvent };

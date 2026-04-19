'use strict';

const Stripe = require('stripe');
const nodemailer = require('nodemailer');
const admin = require('./firebase-admin');

// Lazy-initialise so the module can be loaded without STRIPE_SECRET_KEY set
// (e.g. during unit tests that only exercise getPrice).
let _stripe = null;
function getStripe() {
  if (!_stripe) _stripe = Stripe(process.env.STRIPE_SECRET_KEY);
  return _stripe;
}

// Lazy-initialise SMTP transporter — reuse the same connection pool across calls.
let _transporter = null;
function getTransporter() {
  if (!_transporter) {
    _transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: Number(process.env.SMTP_PORT) || 587,
      secure: false,
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });
  }
  return _transporter;
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
 * Creates a Stripe PaymentIntent with a price read from Firestore.
 * Throws with statusCode 400 if aircraft/duration is invalid.
 */
async function createPaymentIntent({ aircraft, duration, customerName, customerEmail, customerPhone, wantsVoucher, voucherLocation, voucherMessage }) {
  const amount = await getPrice(aircraft, duration);
  if (amount === null) {
    const err = new Error(`Invalid aircraft or duration: ${aircraft} / ${duration}`);
    err.statusCode = 400;
    throw err;
  }

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
    },
  });

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
async function sendConfirmationEmail({ customerName, customerEmail, aircraft, duration, amount, bookingRef }) {
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
        const { itemId, itemName, qty } = pi.metadata;
        bookingData.itemId = itemId || '';
        bookingData.itemName = itemName || '';
        bookingData.qty = Number(qty) || 1;
      } else {
        const { aircraft, aircraftName, duration } = pi.metadata;
        bookingData.aircraft = aircraft;
        bookingData.aircraftName = aircraftName || aircraft;
        bookingData.duration = Number(duration);
      }

      await admin.firestore().collection('bookings').doc(pi.id).set(bookingData);

      // Also write misc orders to the misc_marketplace collection
      if (productType === 'misc') {
        const { itemId, itemName, qty, shippingLine1, shippingLine2, shippingCity, shippingPostcode } = pi.metadata;
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
          ...(shippingLine1 ? { shippingLine1, shippingLine2: shippingLine2 || '', shippingCity, shippingPostcode } : {}),
        });
      }
    } catch (dbErr) {
      console.error('[stripe webhook] failed to save booking to Firestore:', dbErr.message);
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
        await sendConfirmationEmail({
          customerName,
          customerEmail,
          aircraft,
          duration: Number(duration),
          amount: pi.amount,
          bookingRef: pi.id,
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

  const ref = admin.firestore().collection('bookings').doc(pi.id);
  const existing = await ref.get();

  if (existing.exists) {
    // Preserve existing status — only update booking data fields
    const { status, ...dataWithoutStatus } = bookingData;
    await ref.update(dataWithoutStatus);
  } else {
    await ref.set({ ...bookingData, status: 'new' });
  }

  return bookingData;
}

/**
 * Creates a Stripe PaymentIntent for a misc item purchase.
 * Price is read from Firestore server-side — the client-supplied amount is never trusted.
 */
async function createMiscPaymentIntent({ itemId, qty, customerName, customerEmail, customerPhone, shippingAddress }) {
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
    },
  });

  return paymentIntent;
}

module.exports = { getPrice, createPaymentIntent, getLondonTourPrice, createLondonTourPaymentIntent, createMiscPaymentIntent, handleWebhook, recordBooking };

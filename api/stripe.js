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
async function createPaymentIntent({ aircraft, duration, customerName, customerEmail, customerPhone }) {
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
      aircraft,
      aircraftName: AIRCRAFT_NAMES[aircraft],
      duration: String(duration),
      customerName,
      customerEmail,
      customerPhone,
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
    const { aircraft, duration, customerName, customerEmail } = pi.metadata;

    // Wrap email send so SMTP failures do not cause a non-2xx response.
    // If we throw here, Stripe will retry the webhook indefinitely and the customer
    // would receive duplicate confirmation emails once SMTP recovers.
    try {
      await sendConfirmationEmail({
        customerName,
        customerEmail,
        aircraft,
        duration: Number(duration),
        amount: pi.amount,
        bookingRef: pi.id,
      });
    } catch (emailErr) {
      console.error('[stripe webhook] confirmation email failed:', emailErr.message);
    }
  } else {
    console.log(`[stripe webhook] unhandled event type: ${event.type}`);
  }
}

module.exports = { getPrice, createPaymentIntent, handleWebhook };

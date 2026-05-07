'use strict';

const AIRCRAFT_NAMES = {
  r22: 'Robinson R22',
  r44: 'Robinson R44',
  r66: 'Robinson R66',
  r88: 'Robinson R88',
};

function fmtGbp(p) {
  return `£${(Math.round(p) / 100).toLocaleString('en-GB', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}`;
}

function aircraftName(id) {
  return AIRCRAFT_NAMES[id] || id || 'Discovery Flight';
}

function render24hCartRecoveryEmail(cart, siteUrl) {
  const flight = cart.flight || {};
  const aircraft = aircraftName(flight.aircraftId);
  const duration = flight.duration ? `${flight.duration}-minute` : '';
  const total = fmtGbp(cart.totalP || 0);
  const resumeUrl = `${siteUrl}/checkout?t=${encodeURIComponent(cart.recoveryToken || '')}&utm_source=recovery&utm_medium=email&utm_campaign=cart-24h`;
  const unsubUrl = `${siteUrl}/api/carts/unsubscribe?t=${encodeURIComponent(cart.recoveryToken || '')}`;
  const pixelUrl = `${siteUrl}/api/carts/email-pixel?t=${encodeURIComponent(cart.recoveryToken || '')}&type=24h`;
  const firstName = (cart.firstName || cart.email || '').split(/[ @]/)[0] || 'there';

  const subject = `Still thinking it over, ${firstName}?`;

  const html = `<!doctype html>
<html>
  <head><meta charset="utf-8"></head>
  <body style="font-family:system-ui,-apple-system,sans-serif;background:#f5f5f7;padding:24px;color:#1a1a1a;line-height:1.6">
    <div style="max-width:560px;margin:0 auto;background:#fff;border-radius:12px;padding:32px">

      <h1 style="font-size:22px;margin:0 0 8px 0">A first flight is a memorable thing.</h1>
      <p style="color:#475569;margin:0 0 24px 0">We've held your ${aircraft} ${duration} Discovery Flight while you decide. Here's what one of our recent guests said:</p>

      <blockquote style="margin:0 0 24px 0;padding:16px 20px;background:#f8fafc;border-left:3px solid #a855f7;border-radius:4px;font-style:italic;color:#1e293b">
        "Genuinely the best thing I've done in years. The instructor put me completely at ease — I even took the controls for a stretch over the South Downs. Already booking the next one as a gift."
      </blockquote>

      <div style="background:#f8fafc;border-radius:8px;padding:16px;margin-bottom:24px">
        <p style="margin:0 0 4px 0;font-weight:600">${aircraft} — ${duration} Discovery Flight</p>
        <p style="margin:0;color:#475569">${total}</p>
      </div>

      <p style="margin:0 0 24px 0">
        <a href="${resumeUrl}"
           style="display:inline-block;background:#a855f7;color:#fff;padding:14px 24px;border-radius:8px;text-decoration:none;font-weight:600">
          Complete your booking
        </a>
      </p>

      <p style="color:#475569;margin:0 0 12px 0;font-size:14px"><strong>A few things people often ask:</strong></p>
      <ul style="color:#475569;margin:0 0 24px 0;padding-left:20px;font-size:14px">
        <li style="margin-bottom:6px">Worried about the weather? We reschedule for free if it's not safe to fly.</li>
        <li style="margin-bottom:6px">Buying as a gift? Let us know at checkout — we'll send a printed voucher.</li>
        <li style="margin-bottom:6px">Got questions? Reply to this email or give us a call.</li>
      </ul>

      <hr style="border:none;border-top:1px solid #e2e8f0;margin:32px 0 16px 0">
      <p style="font-size:12px;color:#94a3b8;margin:0">
        You're receiving this because you started a booking on hqaviation.co.uk.
        <a href="${unsubUrl}" style="color:#94a3b8">Unsubscribe</a>
      </p>
      <img src="${pixelUrl}" width="1" height="1" alt="" style="display:block;width:1px;height:1px">
    </div>
  </body>
</html>`;

  const text = `A first flight is a memorable thing.

We've held your ${aircraft} ${duration} Discovery Flight while you decide.

"Genuinely the best thing I've done in years. The instructor put me completely at ease — I even took the controls for a stretch over the South Downs. Already booking the next one as a gift."

${aircraft} — ${duration} Discovery Flight
${total}

Complete your booking:
${resumeUrl}

A few things people often ask:
- Worried about the weather? We reschedule for free if it's not safe to fly.
- Buying as a gift? Let us know at checkout — we'll send a printed voucher.
- Got questions? Reply to this email or give us a call.

---
You're receiving this because you started a booking on hqaviation.co.uk.
Unsubscribe: ${unsubUrl}
`;

  return { subject, html, text };
}

module.exports = { render24hCartRecoveryEmail };

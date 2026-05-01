'use strict';

const { render24hCartRecoveryEmail } = require('./cart-recovery-24h');

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

function render1hCartRecoveryEmail(cart, siteUrl, type, campaignTag) {
  const flight = cart.flight || {};
  const aircraft = aircraftName(flight.aircraftId);
  const duration = flight.duration ? `${flight.duration}-minute` : '';
  const total = fmtGbp(cart.totalP || 0);
  const resumeUrl = `${siteUrl}/checkout?t=${encodeURIComponent(cart.recoveryToken || '')}&utm_source=recovery&utm_medium=email&utm_campaign=${encodeURIComponent(campaignTag)}`;
  const unsubUrl = `${siteUrl}/api/carts/unsubscribe?t=${encodeURIComponent(cart.recoveryToken || '')}`;
  // Pixel uses canonical type ('1h' / 'manual') so it matches the value stored in recoveryEmailsSent[i].type.
  const pixelUrl = `${siteUrl}/api/carts/email-pixel?t=${encodeURIComponent(cart.recoveryToken || '')}&type=${encodeURIComponent(type)}`;

  const subject = `Your HQ Aviation booking is saved`;

  const html = `<!doctype html>
<html>
  <head><meta charset="utf-8"></head>
  <body style="font-family:system-ui,-apple-system,sans-serif;background:#f5f5f7;padding:24px;color:#1a1a1a;line-height:1.5">
    <div style="max-width:560px;margin:0 auto;background:#fff;border-radius:12px;padding:32px">
      <h1 style="font-size:22px;margin:0 0 8px 0">Your booking is held.</h1>
      <p style="color:#475569;margin:0 0 24px 0">We've saved your ${aircraft} ${duration} Discovery Flight so you can come back when you're ready.</p>

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

      <p style="color:#475569;margin:0 0 24px 0">
        First-flight nerves are normal. Your instructor will walk you through every minute.
        Any questions? Reply to this email or call us — happy to help.
      </p>

      <hr style="border:none;border-top:1px solid #e2e8f0;margin:32px 0 16px 0">
      <p style="font-size:12px;color:#94a3b8;margin:0">
        You're receiving this because you started a booking on hqaviation.co.uk.
        <a href="${unsubUrl}" style="color:#94a3b8">Unsubscribe</a>
      </p>
      <img src="${pixelUrl}" width="1" height="1" alt="" style="display:block;width:1px;height:1px">
    </div>
  </body>
</html>`;

  const text = `Your booking is held.

We've saved your ${aircraft} ${duration} Discovery Flight so you can come back when you're ready.

${aircraft} — ${duration} Discovery Flight
${total}

Complete your booking:
${resumeUrl}

First-flight nerves are normal. Your instructor will walk you through every minute. Any questions? Reply to this email or call us — happy to help.

---
You're receiving this because you started a booking on hqaviation.co.uk.
Unsubscribe: ${unsubUrl}
`;

  return { subject, html, text };
}

/**
 * Top-level dispatcher. type ∈ { 'manual', '1h', '24h' }.
 * 'manual' uses the 1h copy with campaign='cart-manual' for attribution.
 * '1h' uses the 1h copy with campaign='cart-1h'.
 * '24h' delegates to render24hCartRecoveryEmail.
 */
function renderCartRecoveryEmail(cart, siteUrl, type = 'manual') {
  if (type === '24h') return render24hCartRecoveryEmail(cart, siteUrl);
  const campaign = type === '1h' ? 'cart-1h' : 'cart-manual';
  return render1hCartRecoveryEmail(cart, siteUrl, type, campaign);
}

module.exports = { renderCartRecoveryEmail };

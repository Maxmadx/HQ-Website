'use strict';

const admin = require('../firebase-admin');
const { getTransporter } = require('./mailer');
const { renderCartRecoveryEmail } = require('../templates/cart-recovery');

/**
 * Send a cart-recovery email and record the audit entry.
 * @param {string} cartId
 * @param {'manual'|'1h'|'24h'} type
 * @param {string} sentBy  Admin UID or 'cron'
 * @returns {Promise<{ok:true}>} or throws an Error with .statusCode
 */
async function sendCartRecoveryEmail(cartId, type, sentBy) {
  const cartRef = admin.firestore().collection('carts').doc(cartId);
  const snap = await cartRef.get();
  if (!snap.exists) {
    const err = new Error('Cart not found');
    err.statusCode = 404;
    throw err;
  }
  const cart = snap.data();

  if (!cart.email) throw Object.assign(new Error('No email on file'), { statusCode: 400 });
  if (cart.noEmail) throw Object.assign(new Error('Customer has unsubscribed'), { statusCode: 400 });
  if (cart.status === 'completed') throw Object.assign(new Error('Cart already completed'), { statusCode: 400 });
  if (cart.excludedFromAnalytics) throw Object.assign(new Error('Admin/excluded cart'), { statusCode: 400 });

  const siteUrl = process.env.SITE_URL || 'http://localhost:5173';
  const { subject, html, text } = renderCartRecoveryEmail(cart, siteUrl, type);

  // RFC 8058 one-click unsubscribe headers (Gmail / Yahoo 2026 requirement when sending bulk)
  const unsubUrl = `${siteUrl}/api/carts/unsubscribe?t=${encodeURIComponent(cart.recoveryToken || '')}`;

  await getTransporter().sendMail({
    from: process.env.EMAIL_FROM,
    to: cart.email,
    subject,
    html,
    text,
    headers: {
      'List-Unsubscribe': `<mailto:${process.env.EMAIL_FROM}?subject=unsubscribe>, <${unsubUrl}>`,
      'List-Unsubscribe-Post': 'List-Unsubscribe=One-Click',
      'Precedence': 'bulk',
      'X-Auto-Response-Suppress': 'All',
    },
  });

  await cartRef.set({
    recoveryEmailsSent: [
      ...(cart.recoveryEmailsSent || []),
      {
        at: admin.firestore.FieldValue.serverTimestamp(),
        type,
        sentBy: sentBy || 'unknown',
        opened: false,
        clicked: false,
      },
    ],
    status: cart.status === 'completed' ? cart.status : 'abandoned',
    abandonedAt: cart.abandonedAt || admin.firestore.FieldValue.serverTimestamp(),
    updatedAt: admin.firestore.FieldValue.serverTimestamp(),
  }, { merge: true });

  return { ok: true };
}

module.exports = { sendCartRecoveryEmail };

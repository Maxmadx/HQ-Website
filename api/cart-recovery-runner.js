'use strict';

const admin = require('./firebase-admin');
const { computeRecoveryActions } = require('./lib/cartRecoveryActions');
const { sendCartRecoveryEmail } = require('./lib/cartRecoverySend');
const { isQuietHourLondon } = require('./lib/quietHours');

/**
 * Runs one tick: fetch non-pruned carts, compute actions, apply them.
 * Returns a structured log object for observability.
 */
async function runRecoveryTick(now = new Date()) {
  const tick = { startedAt: now.toISOString(), scanned: 0, marked: 0, sent: 0, pruned: 0, deferred_quiet: 0, errors: [] };

  let carts;
  try {
    const snap = await admin.firestore()
      .collection('carts')
      .where('status', 'in', ['active', 'abandoned', 'completed', 'expired'])
      .limit(500)
      .get();
    carts = snap.docs.map((d) => ({ id: d.id, ...d.data() }));
    tick.scanned = carts.length;
  } catch (err) {
    tick.errors.push(`fetch: ${err.message}`);
    console.error('[cart-recovery] fetch failed:', err.message);
    return tick;
  }

  const actions = computeRecoveryActions(carts, now);
  const quiet = isQuietHourLondon(now);

  for (const { cartId, action } of actions) {
    try {
      if (action === 'mark_abandoned') {
        await admin.firestore().collection('carts').doc(cartId).set({
          status: 'abandoned',
          abandonedAt: admin.firestore.FieldValue.serverTimestamp(),
          updatedAt: admin.firestore.FieldValue.serverTimestamp(),
        }, { merge: true });
        tick.marked += 1;
      } else if (action === 'mark_expired') {
        await admin.firestore().collection('carts').doc(cartId).set({
          status: 'expired',
          updatedAt: admin.firestore.FieldValue.serverTimestamp(),
        }, { merge: true });
        tick.marked += 1;
      } else if (action === 'prune') {
        await admin.firestore().collection('carts').doc(cartId).delete();
        tick.pruned += 1;
      } else if (action === 'send_1h' || action === 'send_24h') {
        if (quiet) {
          tick.deferred_quiet += 1;
          continue;
        }
        const type = action === 'send_1h' ? '1h' : '24h';
        await sendCartRecoveryEmail(cartId, type, 'cron');
        tick.sent += 1;
      }
    } catch (err) {
      tick.errors.push(`${cartId}/${action}: ${err.message}`);
      console.error(`[cart-recovery] ${cartId} ${action} failed:`, err.message);
    }
  }

  console.log(`[cart-recovery] tick`, JSON.stringify(tick));
  return tick;
}

module.exports = { runRecoveryTick };

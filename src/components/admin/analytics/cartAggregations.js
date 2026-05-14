/**
 * Pure aggregation functions for the abandoned-cart dashboard tile.
 * Inputs are arrays of cart docs (already fetched from Firestore by the caller).
 */

// 'checkout_initiated' is deliberately NOT abandoned: the user may still be on
// the Stripe payment page. The cart-recovery cron transitions those carts to
// 'abandoned'/'expired' once they genuinely age out, and they get counted then.
function isAbandonedStatus(s) {
  return s === 'abandoned' || s === 'expired';
}

function isRecoverable(cart) {
  if (!cart.email) return false;
  if (cart.noEmail) return false;
  if (cart.excludedFromAnalytics) return false;
  return isAbandonedStatus(cart.status);
}

function eventTimeMs(ev) {
  if (!ev || !ev.toMillis) return 0;
  return ev.toMillis();
}

export function computeCartFunnel(carts) {
  let totalCarts = 0, abandoned = 0, recoverable = 0, emailed = 0, recovered = 0;
  let totalValueP = 0, abandonedValueP = 0, recoverableValueP = 0;

  for (const cart of carts) {
    if (cart.excludedFromAnalytics) continue;

    totalCarts += 1;
    totalValueP += cart.totalP || 0;

    if (isAbandonedStatus(cart.status)) {
      abandoned += 1;
      abandonedValueP += cart.totalP || 0;

      if (isRecoverable(cart)) {
        recoverable += 1;
        recoverableValueP += cart.totalP || 0;
        if (cart.recoveryEmailsSent && cart.recoveryEmailsSent.length > 0) emailed += 1;
      }
    }

    if (cart.status === 'completed' && cart.recoveryEmailsSent && cart.recoveryEmailsSent.length > 0) {
      recovered += 1;
    }
  }

  return { totalCarts, abandoned, recoverable, emailed, recovered, totalValueP, abandonedValueP, recoverableValueP };
}

export function recoverableCarts(carts) {
  return carts
    .filter(isRecoverable)
    .sort((a, b) => eventTimeMs(b.updatedAt) - eventTimeMs(a.updatedAt));
}

/**
 * Pure aggregation functions for the abandoned-cart dashboard tile.
 * Inputs are arrays of cart docs (already fetched from Firestore by the caller).
 */

// 'abandoned' and 'expired' are the genuinely-walked-away statuses. 'active'
// and 'checkout_initiated' carts may still convert, so they are NOT counted
// as abandoned — but they ARE recoverable if they carry an email (see below).
function isAbandonedStatus(s) {
  return s === 'abandoned' || s === 'expired';
}

function hasUsableEmail(cart) {
  if (!cart.email) return false;
  if (cart.noEmail) return false;
  if (cart.excludedFromAnalytics) return false;
  return true;
}

// Recoverable = any non-completed cart with a usable email. We surface the
// email the moment it is captured — we do not wait for a cron to flip the
// cart to 'abandoned'.
function isRecoverable(cart) {
  if (cart.status === 'completed') return false;
  return hasUsableEmail(cart);
}

function eventTimeMs(ev) {
  if (!ev || !ev.toMillis) return 0;
  return ev.toMillis();
}

export function computeCartFunnel(carts) {
  let totalCarts = 0, abandoned = 0, recoverable = 0, contacted = 0, recovered = 0;
  let totalValueP = 0, abandonedValueP = 0, recoverableValueP = 0;

  for (const cart of carts) {
    if (cart.excludedFromAnalytics) continue;

    totalCarts += 1;
    totalValueP += cart.totalP || 0;

    if (isAbandonedStatus(cart.status)) {
      abandoned += 1;
      abandonedValueP += cart.totalP || 0;
    }

    if (isRecoverable(cart)) {
      recoverable += 1;
      recoverableValueP += cart.totalP || 0;
      if (cart.contactedAt) contacted += 1;
    }

    if (cart.status === 'completed' && cart.contactedAt) {
      recovered += 1;
    }
  }

  return { totalCarts, abandoned, recoverable, contacted, recovered, totalValueP, abandonedValueP, recoverableValueP };
}

export function recoverableCarts(carts) {
  return carts
    .filter(isRecoverable)
    .sort((a, b) => eventTimeMs(b.updatedAt) - eventTimeMs(a.updatedAt));
}

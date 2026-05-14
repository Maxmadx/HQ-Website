'use strict';

// Statuses an admin may set by hand from the dashboard. 'checkout_initiated'
// is intentionally excluded — it is only ever set by the Stripe flow, never
// chosen manually.
const ADMIN_SETTABLE_STATUSES = Object.freeze(['active', 'abandoned', 'expired', 'completed']);

function isAdminSettableStatus(status) {
  return ADMIN_SETTABLE_STATUSES.includes(status);
}

module.exports = { ADMIN_SETTABLE_STATUSES, isAdminSettableStatus };

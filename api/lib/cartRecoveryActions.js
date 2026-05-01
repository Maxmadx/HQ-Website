'use strict';

const HOUR_MS = 3600 * 1000;
const DAY_MS = 24 * HOUR_MS;

const ABANDON_AFTER_HOURS = 1;
const FOLLOW_UP_AFTER_HOURS = 24;
const EXPIRE_AFTER_DAYS = 7;
const PRUNE_AFTER_DAYS = 90;
const MAX_SENDS_PER_TICK = 50;

function timeMs(ts) {
  if (!ts) return 0;
  if (typeof ts.toMillis === 'function') return ts.toMillis();
  if (ts instanceof Date) return ts.getTime();
  if (typeof ts === 'number') return ts;
  return 0;
}

function lastEmailTimeMs(cart) {
  const sent = Array.isArray(cart.recoveryEmailsSent) ? cart.recoveryEmailsSent : [];
  if (sent.length === 0) return 0;
  return timeMs(sent[sent.length - 1].at);
}

function hasEmailSent(cart, type) {
  const sent = Array.isArray(cart.recoveryEmailsSent) ? cart.recoveryEmailsSent : [];
  return sent.some((e) => e.type === type);
}

function isContactable(cart) {
  return cart.email && !cart.noEmail && !cart.excludedFromAnalytics;
}

/**
 * Pure scheduler — return the list of actions to apply.
 * Inputs:
 *   carts: array of cart docs (each must have id, status, email, noEmail, recoveryEmailsSent, updatedAt, excludedFromAnalytics)
 *   now: a Date object representing the current tick's time
 *
 * Returns: array of { cartId, action } where action ∈ { 'mark_abandoned', 'send_1h', 'send_24h', 'mark_expired', 'prune' }
 *
 * Send actions are capped at MAX_SENDS_PER_TICK to prevent runaway loops.
 * State-transition actions (mark_*) are NOT capped — they're cheap Firestore updates.
 */
function computeRecoveryActions(carts, now) {
  const nowMs = now.getTime();
  const actions = [];
  let sendCount = 0;

  for (const cart of carts) {
    if (cart.excludedFromAnalytics) continue;

    const updatedMs = timeMs(cart.updatedAt);
    const ageMs = nowMs - updatedMs;

    // Prune: completed or expired and older than 90 days
    if ((cart.status === 'completed' || cart.status === 'expired') && ageMs > PRUNE_AFTER_DAYS * DAY_MS) {
      actions.push({ cartId: cart.id, action: 'prune' });
      continue;
    }

    // Mark expired: abandoned and older than 7 days
    if (cart.status === 'abandoned' && ageMs > EXPIRE_AFTER_DAYS * DAY_MS) {
      actions.push({ cartId: cart.id, action: 'mark_expired' });
      continue;
    }

    // Mark abandoned: active and idle for >= 1h
    if (cart.status === 'active' && ageMs >= ABANDON_AFTER_HOURS * HOUR_MS) {
      actions.push({ cartId: cart.id, action: 'mark_abandoned' });
      continue;
    }

    // Email queues: only for abandoned, contactable carts
    if (cart.status === 'abandoned' && isContactable(cart) && sendCount < MAX_SENDS_PER_TICK) {
      const has1h = hasEmailSent(cart, '1h') || hasEmailSent(cart, 'manual');
      const has24h = hasEmailSent(cart, '24h');

      if (!has1h) {
        actions.push({ cartId: cart.id, action: 'send_1h' });
        sendCount += 1;
        continue;
      }

      if (!has24h) {
        const lastSentAge = nowMs - lastEmailTimeMs(cart);
        if (lastSentAge >= FOLLOW_UP_AFTER_HOURS * HOUR_MS) {
          actions.push({ cartId: cart.id, action: 'send_24h' });
          sendCount += 1;
        }
      }
    }
  }

  return actions;
}

module.exports = {
  computeRecoveryActions,
  ABANDON_AFTER_HOURS,
  FOLLOW_UP_AFTER_HOURS,
  EXPIRE_AFTER_DAYS,
  PRUNE_AFTER_DAYS,
  MAX_SENDS_PER_TICK,
};

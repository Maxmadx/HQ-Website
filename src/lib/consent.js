// UK GDPR / PECR cookie consent state management.
//
// Persists the visitor's choice in localStorage and exposes a small pub-sub
// for listeners (ga.js, clarity.js) to react when consent changes. Required
// because UK law treats analytics cookies as non-essential — they must be
// opt-in, not opt-out, and the user must be able to change their mind.
//
// Storage key:   hq_cookie_consent
// Schema:        { version: 1, state: 'granted'|'denied', decidedAt: ISO8601 }
// Bump VERSION   when the consent surface changes meaningfully (e.g. new
//                cookie types) so existing visitors are re-prompted.

const STORAGE_KEY = 'hq_cookie_consent';
const VERSION = 1;

export const CONSENT = Object.freeze({
  UNKNOWN: 'unknown',
  GRANTED: 'granted',
  DENIED: 'denied',
});

const listeners = new Set();

function _hasStorage() {
  try {
    return typeof window !== 'undefined' && !!window.localStorage;
  } catch {
    return false;
  }
}

export function getConsent() {
  if (!_hasStorage()) return CONSENT.UNKNOWN;
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return CONSENT.UNKNOWN;
    const parsed = JSON.parse(raw);
    if (parsed.version !== VERSION) return CONSENT.UNKNOWN; // schema bump => re-ask
    if (parsed.state === CONSENT.GRANTED || parsed.state === CONSENT.DENIED) {
      return parsed.state;
    }
    return CONSENT.UNKNOWN;
  } catch {
    return CONSENT.UNKNOWN;
  }
}

export function setConsent(state) {
  if (state !== CONSENT.GRANTED && state !== CONSENT.DENIED) return;
  if (_hasStorage()) {
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify({
        version: VERSION,
        state,
        decidedAt: new Date().toISOString(),
      }));
    } catch {
      // localStorage may throw in private-browsing edge cases; treat as session-only
    }
  }
  // Always fire listeners even if persistence failed — analytics needs to react.
  listeners.forEach((fn) => { try { fn(state); } catch { /* never throw */ } });
}

export function onConsentChange(fn) {
  if (typeof fn !== 'function') return () => {};
  listeners.add(fn);
  return () => listeners.delete(fn);
}

export function isGranted() {
  return getConsent() === CONSENT.GRANTED;
}

/**
 * Clear stored consent. Surfaces the banner again on next page load.
 * Useful for a "Cookie preferences" footer link.
 */
export function resetConsent() {
  if (_hasStorage()) {
    try { window.localStorage.removeItem(STORAGE_KEY); } catch {}
  }
  listeners.forEach((fn) => { try { fn(CONSENT.UNKNOWN); } catch {} });
}

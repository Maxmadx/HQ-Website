// Microsoft Clarity wrapper.
// Loads clarity.ms tag dynamically when VITE_CLARITY_PROJECT_ID is set AND
// the visitor has granted cookie consent.
//
// UK GDPR / PECR: Clarity has no cookieless mode (it records sessions for
// heatmaps / replay), so we cannot load it under "denied" consent. Unlike
// GA4 (Consent Mode v2), we defer the whole script injection until consent
// is granted. If consent is granted later in the session, the deferred
// listener calls _actuallyInit on the consent-change event.

import { getConsent, onConsentChange, CONSENT } from './consent.js';

const PROJECT_ID = import.meta.env.VITE_CLARITY_PROJECT_ID;

let initialised = false;
let deferredListenerAttached = false;

function _actuallyInit() {
  if (!PROJECT_ID) return false;
  if (initialised) return false;
  if (typeof window === 'undefined' || typeof document === 'undefined') return false;

  // Standard install snippet — verbatim from clarity.microsoft.com.
  (function (c, l, a, r, i, t, y) {
    c[a] = c[a] || function () { (c[a].q = c[a].q || []).push(arguments); };
    t = l.createElement(r); t.async = 1; t.src = 'https://www.clarity.ms/tag/' + i;
    y = l.getElementsByTagName(r)[0]; y.parentNode.insertBefore(t, y);
  })(window, document, 'clarity', 'script', PROJECT_ID);

  initialised = true;
  return true;
}

/**
 * Initialise Clarity if consent is granted; otherwise wait for consent.
 * Safe to call multiple times.
 * @returns {boolean} true if initialised on this call.
 */
export function initClarity() {
  if (!PROJECT_ID) return false;
  if (initialised) return false;

  if (getConsent() === CONSENT.GRANTED) {
    return _actuallyInit();
  }

  // Consent not yet granted — wait for it. Attach the listener once.
  if (!deferredListenerAttached) {
    deferredListenerAttached = true;
    onConsentChange((state) => {
      if (state === CONSENT.GRANTED) _actuallyInit();
    });
  }
  return false;
}

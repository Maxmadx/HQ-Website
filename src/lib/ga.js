// Google Analytics 4 wrapper.
// Loads gtag.js dynamically when VITE_GA_MEASUREMENT_ID is set.
// No-op otherwise so dev / preview builds don't pollute production analytics.
//
// UK GDPR / PECR — Consent Mode v2:
//   gtag.js loads on every page (so cookieless pings can fire) but every
//   storage category starts in 'denied' unless the visitor has already
//   accepted via the consent banner. When they accept, src/lib/consent.js
//   fires its listener and we call gtag('consent', 'update', {...}) to flip
//   storage to 'granted'. If they decline (or never decide), gtag stays in
//   cookieless mode and no analytics cookies are set.
//
// See src/lib/consent.js for the storage + listener primitives and
// src/components/ConsentBanner.jsx for the UI.

import { getConsent, onConsentChange, CONSENT } from './consent.js';

const MEASUREMENT_ID = import.meta.env.VITE_GA_MEASUREMENT_ID;

let initialised = false;

function _applyConsent(state) {
  if (typeof window === 'undefined' || !window.gtag) return;
  const granted = state === CONSENT.GRANTED ? 'granted' : 'denied';
  window.gtag('consent', 'update', {
    ad_storage: granted,
    ad_user_data: granted,
    ad_personalization: granted,
    analytics_storage: granted,
  });
}

/**
 * Lazy-load gtag.js and initialise GA4. Safe to call multiple times
 * (early returns after the first).
 * @returns {boolean} true if GA was initialised on this call, false if
 *   already initialised or no Measurement ID is configured.
 */
export function initGA() {
  if (!MEASUREMENT_ID) return false;
  if (initialised) return false;
  if (typeof window === 'undefined') return false;

  // Append gtag.js asynchronously.
  const script = document.createElement('script');
  script.async = true;
  script.src = `https://www.googletagmanager.com/gtag/js?id=${MEASUREMENT_ID}`;
  document.head.appendChild(script);

  // Set up the dataLayer + gtag function. gtag.js reads window.dataLayer.
  window.dataLayer = window.dataLayer || [];
  // eslint-disable-next-line prefer-rest-params
  function gtag() { window.dataLayer.push(arguments); }
  window.gtag = gtag;

  // Consent Mode v2 — derive the initial storage state from persisted consent.
  // UNKNOWN/DENIED both map to 'denied'; only GRANTED unlocks storage.
  const initial = getConsent() === CONSENT.GRANTED ? 'granted' : 'denied';
  gtag('consent', 'default', {
    ad_storage: initial,
    ad_user_data: initial,
    ad_personalization: initial,
    analytics_storage: initial,
    wait_for_update: 500,
  });

  gtag('js', new Date());
  // send_page_view: false because we dispatch page_view manually on every
  // SPA route change (the initial config call would otherwise double-fire
  // for the landing route).
  gtag('config', MEASUREMENT_ID, { send_page_view: false });

  // React to consent changes from the banner without needing a page reload.
  onConsentChange(_applyConsent);

  initialised = true;
  return true;
}

/**
 * Track an SPA route change as a GA4 page_view event.
 * @param {string} path - the new pathname (and optional query string)
 * @param {string} [title] - optional page title
 */
export function trackPageView(path, title) {
  if (!MEASUREMENT_ID) return;
  if (typeof window === 'undefined' || !window.gtag) return;
  window.gtag('event', 'page_view', {
    page_path: path,
    page_title: title || document.title,
    page_location: window.location.origin + path,
  });
}

/**
 * Track a custom event (e.g. purchase, generate_lead).
 * @param {string} name
 * @param {Record<string, any>} [params]
 */
export function trackEvent(name, params) {
  if (!MEASUREMENT_ID) return;
  if (typeof window === 'undefined' || !window.gtag) return;
  window.gtag('event', name, params || {});
}

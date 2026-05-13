// Google Analytics 4 wrapper.
// Loads gtag.js dynamically when VITE_GA_MEASUREMENT_ID is set.
// No-op otherwise so dev / preview builds don't pollute production analytics.
//
// TODO: gate behind a cookie-consent banner. Currently sets
// analytics_storage='granted' by default (Consent Mode v2). Once the
// banner is built, change the default to 'denied' and call
// gtag('consent', 'update', {...}) on accept.

const MEASUREMENT_ID = import.meta.env.VITE_GA_MEASUREMENT_ID;

let initialised = false;

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

  // Consent Mode v2 — default permissive for now. Replace with 'denied'
  // when the consent banner ships and call gtag('consent','update',...) on accept.
  gtag('consent', 'default', {
    ad_storage: 'granted',
    ad_user_data: 'granted',
    ad_personalization: 'granted',
    analytics_storage: 'granted',
    wait_for_update: 500,
  });

  gtag('js', new Date());
  // send_page_view: false because we dispatch page_view manually on every
  // SPA route change (the initial config call would otherwise double-fire
  // for the landing route).
  gtag('config', MEASUREMENT_ID, { send_page_view: false });

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

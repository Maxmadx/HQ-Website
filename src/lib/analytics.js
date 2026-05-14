/**
 * Lightweight client-side analytics utility.
 * Session ID persists for the browser tab (sessionStorage).
 */

export function getSessionId() {
  const key = 'hq_session_id';
  let id = sessionStorage.getItem(key);
  if (!id) {
    id = Math.random().toString(36).slice(2) + Date.now().toString(36);
    sessionStorage.setItem(key, id);
  }
  return id;
}

/**
 * Persistent visitor ID — survives across tabs and sessions (localStorage).
 * Used to distinguish new vs returning visitors. Returns null when localStorage
 * is unavailable (e.g. Safari private mode) so a tracking event is never lost.
 */
export function getVisitorId() {
  try {
    const key = 'hq_visitor_id';
    let id = localStorage.getItem(key);
    if (!id) {
      id = Math.random().toString(36).slice(2) + Date.now().toString(36);
      localStorage.setItem(key, id);
    }
    return id;
  } catch {
    return null;
  }
}

/**
 * Read the `ref` referral code from the current URL (e.g. ?ref=AB3K9XQ7).
 * Returns null when absent.
 */
function getReferralRef() {
  if (typeof window === 'undefined') return null;
  return new URLSearchParams(window.location.search).get('ref') || null;
}

/**
 * Read UTM params from the current URL.
 * Returns an object with utmSource/Medium/Campaign/Term/Content (null when absent).
 */
function getUtmParams() {
  if (typeof window === 'undefined') {
    return { utmSource: null, utmMedium: null, utmCampaign: null, utmTerm: null, utmContent: null };
  }
  const params = new URLSearchParams(window.location.search);
  return {
    utmSource: params.get('utm_source'),
    utmMedium: params.get('utm_medium'),
    utmCampaign: params.get('utm_campaign'),
    utmTerm: params.get('utm_term'),
    utmContent: params.get('utm_content'),
  };
}

/**
 * Send a tracking event to the server. Fire-and-forget — never throws.
 * Also mirrors the event to GA4 (gtag.event) when GA4 has been initialised,
 * so existing call sites get GA4 coverage without changes.
 * @param {string} eventType  pageview | cta_click | form_submit | image_view | scroll_depth | page_exit | view_item | begin_checkout | add_payment_info | purchase
 * @param {string|null} [elementId]  Optional element identifier
 * @param {string|null} [page]  Defaults to window.location.pathname
 * @param {object} [data]  Optional ecommerce payload: { items, value, currency, transactionId, itemCategory }
 */
export async function trackEvent(eventType, elementId = null, page = null, data = null) {
  // Best-effort mirror to GA4 first (sync, can't fail the server POST below)
  mirrorToGtag(eventType, elementId, page, data);

  try {
    const body = {
      sessionId: getSessionId(),
      visitorId: getVisitorId(),
      page: page ?? (typeof window !== 'undefined' ? window.location.pathname : ''),
      eventType,
      elementId,
      referrer: typeof document !== 'undefined' ? document.referrer : '',
      referralRefCode: getReferralRef(),
      ...getUtmParams(),
    };
    if (data) {
      if (data.items !== undefined) body.items = data.items;
      if (data.value !== undefined) body.value = data.value;
      if (data.currency !== undefined) body.currency = data.currency;
      if (data.transactionId !== undefined) body.transactionId = data.transactionId;
      if (data.itemCategory !== undefined) body.itemCategory = data.itemCategory;
    }
    await fetch('/api/analytics', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });
  } catch {
    // Silently swallow — analytics must never break the site
  }
}

// ============================================================================
// GA4 + Microsoft Clarity bootstrap
//
// GDPR/PECR (UK) — These scripts set tracking cookies. UK law requires explicit
// user consent BEFORE non-essential cookies are set. No consent banner is wired
// on this site yet — `_canTrack()` is the central gate. Until a real consent
// flow lands, it returns true and tracking fires unconditionally. When the
// consent banner is built, update `_canTrack()` to check the consent state
// and these scripts will respect it without any other code changes.
// ============================================================================

let _ga4Initialized = false;
let _clarityInitialized = false;

function _canTrack() {
  // TODO(consent): replace with real consent-banner check once one exists.
  return true;
}

/**
 * Initialise Google Analytics 4 (GA4). Idempotent + no-op if measurementId
 * is falsy or consent is denied. Safe to call multiple times.
 */
export function initGA4(measurementId) {
  if (_ga4Initialized) return;
  if (!measurementId) return;
  if (typeof window === 'undefined' || typeof document === 'undefined') return;
  if (!_canTrack()) return;

  const script = document.createElement('script');
  script.async = true;
  script.src = `https://www.googletagmanager.com/gtag/js?id=${encodeURIComponent(measurementId)}`;
  document.head.appendChild(script);

  window.dataLayer = window.dataLayer || [];
  // eslint-disable-next-line prefer-rest-params
  window.gtag = function gtag() { window.dataLayer.push(arguments); };
  window.gtag('js', new Date());
  // We fire `page_view` manually from PageTracker on SPA navigation, so
  // disable gtag's auto page_view to avoid duplicates.
  window.gtag('config', measurementId, { send_page_view: false });

  _ga4Initialized = true;
}

/**
 * Initialise Microsoft Clarity. Idempotent + no-op if projectId is falsy or
 * consent is denied. Verbatim from clarity.microsoft.com install snippet.
 */
export function initClarity(projectId) {
  if (_clarityInitialized) return;
  if (!projectId) return;
  if (typeof window === 'undefined' || typeof document === 'undefined') return;
  if (!_canTrack()) return;

  // Clarity install snippet — copied unchanged from clarity.microsoft.com.
  (function(c, l, a, r, i, t, y) {
    c[a] = c[a] || function() { (c[a].q = c[a].q || []).push(arguments); };
    t = l.createElement(r); t.async = 1; t.src = 'https://www.clarity.ms/tag/' + i;
    y = l.getElementsByTagName(r)[0]; y.parentNode.insertBefore(t, y);
  })(window, document, 'clarity', 'script', projectId);

  _clarityInitialized = true;
}

/**
 * Translate the existing trackEvent semantics into a gtag.event() call when
 * GA4 is initialised. Maps our internal event types to GA4 reserved names
 * where they exist (page_view, view_item, begin_checkout, add_payment_info,
 * purchase, scroll); everything else passes through as a custom event with
 * the same name.
 */
function mirrorToGtag(eventType, elementId, page, data) {
  if (typeof window === 'undefined' || typeof window.gtag !== 'function') return;
  if (!_canTrack()) return;

  const path = page ?? (typeof window !== 'undefined' ? window.location.pathname : '');
  const params = {
    page_path: path,
    page_location: typeof window !== 'undefined' ? window.location.href : undefined,
    page_title: typeof document !== 'undefined' ? document.title : undefined,
  };
  if (elementId) params.element_id = elementId;
  if (data) {
    if (data.items !== undefined) params.items = data.items;
    if (data.value !== undefined) params.value = data.value;
    if (data.currency !== undefined) params.currency = data.currency;
    if (data.transactionId !== undefined) params.transaction_id = data.transactionId;
    if (data.itemCategory !== undefined) params.item_category = data.itemCategory;
  }

  // Reserved GA4 names where our internal type already aligns; otherwise pass
  // the internal eventType through (GA4 accepts custom events).
  const aliasMap = {
    pageview: 'page_view',
    scroll_depth: 'scroll',
  };
  const gtagName = aliasMap[eventType] || eventType;

  try {
    window.gtag('event', gtagName, params);
  } catch {
    // Never let analytics throw
  }
}

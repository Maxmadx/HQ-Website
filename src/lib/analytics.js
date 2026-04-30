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
 * @param {string} eventType  pageview | cta_click | form_submit | image_view | scroll_depth | page_exit | view_item | begin_checkout | add_payment_info | purchase
 * @param {string|null} [elementId]  Optional element identifier
 * @param {string|null} [page]  Defaults to window.location.pathname
 * @param {object} [data]  Optional ecommerce payload: { items, value, currency, transactionId, itemCategory }
 */
export async function trackEvent(eventType, elementId = null, page = null, data = null) {
  try {
    const body = {
      sessionId: getSessionId(),
      page: page ?? (typeof window !== 'undefined' ? window.location.pathname : ''),
      eventType,
      elementId,
      referrer: typeof document !== 'undefined' ? document.referrer : '',
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

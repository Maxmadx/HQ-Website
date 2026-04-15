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
 * Send a tracking event to the server. Fire-and-forget — never throws.
 * @param {string} eventType  pageview | cta_click | form_submit | image_view
 * @param {string} [elementId]  Optional element identifier
 * @param {string} [page]  Defaults to window.location.pathname
 */
export async function trackEvent(eventType, elementId = null, page = null) {
  try {
    await fetch('/api/analytics', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        sessionId: getSessionId(),
        page: page ?? (typeof window !== 'undefined' ? window.location.pathname : ''),
        eventType,
        elementId,
        referrer: typeof document !== 'undefined' ? document.referrer : '',
      }),
    });
  } catch {
    // Silently swallow — analytics must never break the site
  }
}

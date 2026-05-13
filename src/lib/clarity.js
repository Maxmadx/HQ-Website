// Microsoft Clarity wrapper.
// Loads clarity.ms tag dynamically when VITE_CLARITY_PROJECT_ID is set.
// No-op otherwise so dev / preview builds don't pollute production data.
//
// TODO: gate behind a cookie-consent banner. Currently sets cookies
// unconditionally. Once the consent banner ships, gate the init() call
// (or call clarity('consent') once accepted).

const PROJECT_ID = import.meta.env.VITE_CLARITY_PROJECT_ID;

let initialised = false;

/**
 * Lazy-load Clarity tag and initialise. Safe to call multiple times
 * (early returns after the first).
 * @returns {boolean} true if Clarity was initialised on this call, false if
 *   already initialised or no Project ID is configured.
 */
export function initClarity() {
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

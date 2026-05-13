# Cookie consent banner — implementation spec (ready to merge)

**Status:** ready for implementation
**Date:** 2026-05-13
**Estimated effort:** ~2 hr (1 hr code + 1 hr review/test)
**Why now:** GA4 (`G-JJ0GSQY0MF`) and Microsoft Clarity (`wq3ln0swwj`) are live on production via commits b0b4fff + 0a56fab. UK PECR requires explicit user consent for non-essential tracking cookies — currently violated. This spec closes that gap with the minimum-viable surface.

## Goals

1. UK PECR / GDPR compliant: opt-in only, not loaded until user accepts.
2. Brand-aligned: warm white (#faf9f6) on charcoal (#1a1a1a), Space Grotesk + Share Tech Mono, minimal slim banner — no overlay.
3. Granular enough to be defensible (separate Accept / Decline), no dark patterns.
4. Mobile-first responsive.
5. Re-openable via a footer "Cookie preferences" link (Phase 2 — not in this spec).

## Non-goals

- Granular per-category toggles (Accept all vs Reject all is sufficient for current cookie usage)
- Multi-language i18n (single-language English for now)
- Cookie scanner / auto-discovery (we know exactly what cookies fire: GA4 + Clarity)

## Architecture

```
┌──────────────────────────────────────────────────────────┐
│  src/lib/consent.js                                       │
│    • localStorage state ('granted' | 'denied' | unknown)  │
│    • pub-sub: onConsentChange(fn)                         │
│    • API: getConsent() / setConsent() / resetConsent()    │
└──────────────────────────────────────────────────────────┘
            │                       │                   │
            ▼                       ▼                   ▼
  ┌─────────────────┐    ┌──────────────────┐    ┌────────────────┐
  │ src/lib/ga.js   │    │ src/lib/clarity. │    │ ConsentBanner. │
  │                 │    │ js               │    │ jsx            │
  │ Consent Mode v2 │    │ Defer init until │    │ UI surface     │
  │ default denied; │    │ granted          │    │ Accept/Decline │
  │ update on grant │    │                  │    │                │
  └─────────────────┘    └──────────────────┘    └────────────────┘
                                                          │
                                                          ▼
                                                ┌──────────────────┐
                                                │ src/App.jsx      │
                                                │ <ConsentBanner/> │
                                                │ at root          │
                                                └──────────────────┘
```

## Files

### NEW: `src/lib/consent.js`

```js
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
    if (parsed.version !== VERSION) return CONSENT.UNKNOWN;
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
    } catch {}
  }
  listeners.forEach((fn) => { try { fn(state); } catch {} });
}

export function onConsentChange(fn) {
  if (typeof fn !== 'function') return () => {};
  listeners.add(fn);
  return () => listeners.delete(fn);
}

export function isGranted() {
  return getConsent() === CONSENT.GRANTED;
}

export function resetConsent() {
  if (_hasStorage()) {
    try { window.localStorage.removeItem(STORAGE_KEY); } catch {}
  }
  listeners.forEach((fn) => { try { fn(CONSENT.UNKNOWN); } catch {} });
}
```

### NEW: `src/components/ConsentBanner.jsx`

```jsx
import { useEffect, useState } from 'react';
import { getConsent, setConsent, onConsentChange, CONSENT } from '../lib/consent';

export default function ConsentBanner() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    setVisible(getConsent() === CONSENT.UNKNOWN);
    const unsubscribe = onConsentChange((state) => {
      setVisible(state === CONSENT.UNKNOWN);
    });
    return unsubscribe;
  }, []);

  if (!visible) return null;

  return (
    <div
      role="dialog"
      aria-labelledby="hq-consent-text"
      aria-describedby="hq-consent-text"
      className="hq-consent"
    >
      <div className="hq-consent__inner">
        <p className="hq-consent__pretitle">Cookies</p>
        <p id="hq-consent-text" className="hq-consent__text">
          We use analytics cookies to understand how visitors use this site. No marketing,
          no third-party advertising. {' '}
          <a href="/privacy" className="hq-consent__link">Privacy policy</a>.
        </p>
        <div className="hq-consent__actions">
          <button
            type="button"
            className="hq-consent__btn hq-consent__btn--decline"
            onClick={() => setConsent(CONSENT.DENIED)}
          >
            Decline
          </button>
          <button
            type="button"
            className="hq-consent__btn hq-consent__btn--accept"
            onClick={() => setConsent(CONSENT.GRANTED)}
          >
            Accept
          </button>
        </div>
      </div>
      <style>{`
        .hq-consent {
          position: fixed;
          bottom: 1.25rem;
          left: 50%;
          transform: translateX(-50%);
          z-index: 99999;
          max-width: 640px;
          width: calc(100% - 2rem);
          background: #1a1a1a;
          color: #faf9f6;
          padding: 1.25rem 1.5rem;
          font-family: 'Space Grotesk', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
          font-size: 0.875rem;
          line-height: 1.55;
          border: 1px solid rgba(250, 249, 246, 0.08);
          border-radius: 2px;
          box-shadow: 0 12px 48px rgba(0, 0, 0, 0.35), 0 2px 8px rgba(0, 0, 0, 0.2);
          animation: hq-consent-rise 380ms cubic-bezier(0.16, 1, 0.3, 1);
        }
        @keyframes hq-consent-rise {
          from { opacity: 0; transform: translate(-50%, 16px); }
          to   { opacity: 1; transform: translate(-50%, 0); }
        }
        .hq-consent__inner {
          display: grid;
          grid-template-columns: 1fr auto;
          column-gap: 1.5rem;
          row-gap: 0.5rem;
          align-items: center;
        }
        .hq-consent__pretitle {
          margin: 0;
          grid-column: 1 / -1;
          font-family: 'Share Tech Mono', 'SF Mono', Monaco, monospace;
          font-size: 0.6875rem;
          letter-spacing: 0.18em;
          text-transform: uppercase;
          color: rgba(250, 249, 246, 0.6);
        }
        .hq-consent__text { margin: 0; color: #faf9f6; }
        .hq-consent__link {
          color: inherit;
          text-decoration: underline;
          text-underline-offset: 3px;
          text-decoration-thickness: 1px;
        }
        .hq-consent__link:hover { text-decoration-thickness: 2px; }
        .hq-consent__actions {
          display: flex;
          gap: 0.5rem;
          align-self: end;
        }
        .hq-consent__btn {
          font-family: inherit;
          font-size: 0.8125rem;
          font-weight: 500;
          letter-spacing: 0.04em;
          padding: 0.6rem 1.1rem;
          border: 1px solid #faf9f6;
          border-radius: 2px;
          cursor: pointer;
          transition: background 160ms ease-out, color 160ms ease-out;
          white-space: nowrap;
        }
        .hq-consent__btn--decline { background: transparent; color: #faf9f6; }
        .hq-consent__btn--decline:hover { background: rgba(250, 249, 246, 0.08); }
        .hq-consent__btn--accept { background: #faf9f6; color: #1a1a1a; }
        .hq-consent__btn--accept:hover { background: #ffffff; }
        .hq-consent__btn:focus-visible {
          outline: 2px solid #faf9f6;
          outline-offset: 2px;
        }
        @media (max-width: 520px) {
          .hq-consent {
            bottom: 0.75rem;
            width: calc(100% - 1.5rem);
            padding: 1rem 1.125rem;
          }
          .hq-consent__inner { grid-template-columns: 1fr; }
          .hq-consent__actions { justify-content: stretch; margin-top: 0.25rem; }
          .hq-consent__btn { flex: 1; }
        }
      `}</style>
    </div>
  );
}
```

### MODIFY: `src/lib/ga.js`

Replace the existing `gtag('consent', 'default', {...})` block with a call that derives initial state from `getConsent()`, and add an `onConsentChange` listener that fires `gtag('consent', 'update', ...)` on subsequent decisions. Full updated file:

```js
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

export function initGA() {
  if (!MEASUREMENT_ID) return false;
  if (initialised) return false;
  if (typeof window === 'undefined') return false;

  const script = document.createElement('script');
  script.async = true;
  script.src = `https://www.googletagmanager.com/gtag/js?id=${MEASUREMENT_ID}`;
  document.head.appendChild(script);

  window.dataLayer = window.dataLayer || [];
  function gtag() { window.dataLayer.push(arguments); }
  window.gtag = gtag;

  // Consent Mode v2 — derive from persisted consent.
  const initial = getConsent() === CONSENT.GRANTED ? 'granted' : 'denied';
  gtag('consent', 'default', {
    ad_storage: initial,
    ad_user_data: initial,
    ad_personalization: initial,
    analytics_storage: initial,
    wait_for_update: 500,
  });

  gtag('js', new Date());
  gtag('config', MEASUREMENT_ID, { send_page_view: false });

  onConsentChange(_applyConsent);

  initialised = true;
  return true;
}

// trackPageView() and trackEvent() unchanged from current.
```

### MODIFY: `src/lib/clarity.js`

Defer init until consent granted. Full updated file:

```js
import { getConsent, onConsentChange, CONSENT } from './consent.js';

const PROJECT_ID = import.meta.env.VITE_CLARITY_PROJECT_ID;

let initialised = false;
let deferredListenerAttached = false;

function _actuallyInit() {
  if (!PROJECT_ID) return false;
  if (initialised) return false;
  if (typeof window === 'undefined' || typeof document === 'undefined') return false;

  (function (c, l, a, r, i, t, y) {
    c[a] = c[a] || function () { (c[a].q = c[a].q || []).push(arguments); };
    t = l.createElement(r); t.async = 1; t.src = 'https://www.clarity.ms/tag/' + i;
    y = l.getElementsByTagName(r)[0]; y.parentNode.insertBefore(t, y);
  })(window, document, 'clarity', 'script', PROJECT_ID);

  initialised = true;
  return true;
}

export function initClarity() {
  if (!PROJECT_ID) return false;
  if (initialised) return false;

  if (getConsent() === CONSENT.GRANTED) {
    return _actuallyInit();
  }

  if (!deferredListenerAttached) {
    deferredListenerAttached = true;
    onConsentChange((state) => {
      if (state === CONSENT.GRANTED) _actuallyInit();
    });
  }
  return false;
}
```

### MODIFY: `src/App.jsx`

Add the import + render. Two-line change:

```diff
 import Seo from './components/seo/Seo';
+import ConsentBanner from './components/ConsentBanner';
```

```diff
       <ScrollToTop />
       <PageTracker />
       <RouteTracker />
+      <ConsentBanner />
       <Routes>
```

## Acceptance criteria

- [ ] Visit `https://hqaviation.com` in an Incognito window — the banner appears at the bottom of the viewport on first paint.
- [ ] Open DevTools → Application → Cookies. No `_ga*`, `_clck`, `_clsk` cookies are present before clicking either button.
- [ ] Click **Decline** → banner dismisses → still no analytics cookies. Reload — banner does NOT reappear.
- [ ] Visit again in a fresh Incognito window. Click **Accept** → banner dismisses → `_ga` cookies appear in DevTools → GA4 Realtime shows the visitor within 30 sec → Clarity shows the visitor within 1 min.
- [ ] Reload after Accept — banner does not reappear; analytics keeps firing.
- [ ] Mobile (`< 520px` viewport): banner stacks vertically, buttons full-width, accessible.
- [ ] Existing test suite still passes (no regressions; the consent helpers should be covered by a new `src/lib/consent.test.js` — out of scope for this spec, add follow-up).

## Phase 2 (not in this spec)

- **Footer "Cookie preferences" link** that calls `resetConsent()` to surface the banner again.
- **`src/lib/consent.test.js`** unit tests covering localStorage edge cases, version bumps, pub-sub.
- **`/privacy` page content** if it doesn't already exist (the banner links there).
- **Server-side enforcement**: any server-set cookies (session, CSRF) need to be reviewed to ensure they don't fall under non-essential.

## Implementation notes

1. Build this in a clean working tree — current `package.json` has merge conflict markers; resolve first.
2. The "right" deploy sequence: commit each of the 4 files, then build, then deploy. Don't deploy mid-edit.
3. Currently GA4 ships with `gtag('consent', 'default', { ... all granted })` — the `_ga` cookie is being set without consent right now. This spec fixes that on next deploy.
4. After deploy, existing visitors who already have `_ga` cookies (set during the consent-free window) will see the banner; clicking Decline will not retroactively delete those cookies (they'll expire on their 2-year TTL). Acceptable per ICO guidance on transitional retrofits as long as no NEW cookies fire post-decline. Optional: have `setConsent('denied')` also clear `_ga*` and `_cl*` cookies manually — let me know if you want that added.

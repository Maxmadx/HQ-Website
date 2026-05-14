// Cookie consent banner — minimal, brand-aligned, UK GDPR / PECR compliant.
//
// Behaviour:
//   - Mounts on every page (rendered at the App root).
//   - Visible only when getConsent() === 'unknown' (i.e. user has not yet
//     decided). Returns null once a decision is recorded.
//   - On Accept  -> setConsent('granted') => ga.js flips Consent Mode to
//                  granted; clarity.js loads its tag.
//   - On Decline -> setConsent('denied')  => analytics stays cookieless;
//                  Clarity never loads.
//   - Stored decision persists in localStorage; the user can reopen the
//     banner via resetConsent() from a footer "Cookie preferences" link.
//
// Brand: warm white (#faf9f6) on charcoal (#1a1a1a), Space Grotesk + Share
// Tech Mono, slim bottom-anchored sheet, no overlay (non-blocking by design
// — UK ICO permits a non-modal banner as long as no non-essential cookies
// are set before consent, which we guarantee in ga.js + clarity.js).

import { useEffect, useState } from 'react';
import { getConsent, setConsent, onConsentChange, CONSENT } from '../lib/consent';

export default function ConsentBanner() {
  const [visible, setVisible] = useState(false);

  // Read consent state on mount. Also subscribe so that if `resetConsent()`
  // is called from elsewhere (footer link), the banner reappears.
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
        .hq-consent__text {
          margin: 0;
          color: #faf9f6;
        }
        .hq-consent__link {
          color: inherit;
          text-decoration: underline;
          text-underline-offset: 3px;
          text-decoration-thickness: 1px;
        }
        .hq-consent__link:hover {
          text-decoration-thickness: 2px;
        }
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
        .hq-consent__btn--decline {
          background: transparent;
          color: #faf9f6;
        }
        .hq-consent__btn--decline:hover {
          background: rgba(250, 249, 246, 0.08);
        }
        .hq-consent__btn--accept {
          background: #faf9f6;
          color: #1a1a1a;
        }
        .hq-consent__btn--accept:hover {
          background: #ffffff;
        }
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
          .hq-consent__inner {
            grid-template-columns: 1fr;
          }
          .hq-consent__actions {
            justify-content: stretch;
            margin-top: 0.25rem;
          }
          .hq-consent__btn {
            flex: 1;
          }
        }
      `}</style>
    </div>
  );
}

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
//   - Scrolling away (> 60px) is treated as an implicit decline. Rather than
//     pestering the visitor for a click, the banner plays a short auto-decline
//     animation — Decline expands over Accept, a brief "clicked" pulse, then
//     the bar slides away — and records 'denied'. Declining on scroll is the
//     safe direction under PECR: nothing is ever tracked without an explicit
//     grant, so an implicit decline carries no compliance risk.
//   - Stored decision persists in localStorage; the user can reopen the
//     banner via resetConsent() from a footer "Cookie preferences" link.
//
// Brand: warm white (#faf9f6) on charcoal (#1a1a1a), Space Grotesk, slim
// full-width bottom bar, no overlay (non-blocking by design — UK ICO permits a
// non-modal banner as long as no non-essential cookies are set before consent,
// which we guarantee in ga.js + clarity.js).

import { useEffect, useRef, useState } from 'react';
import { getConsent, setConsent, onConsentChange, CONSENT } from '../lib/consent';

const SCROLL_TRIGGER_PX = 60;
// Auto-decline animation phase durations (ms): merge -> confirm -> leave.
const PHASE_MS = { merging: 340, confirming: 260, leaving: 380 };

export default function ConsentBanner() {
  const [visible, setVisible] = useState(false);
  // Auto-decline animation state machine: idle -> merging -> confirming -> leaving.
  const [phase, setPhase] = useState('idle');
  const actionsRef = useRef(null);
  const declineRef = useRef(null);

  // Read consent state on mount. Also subscribe so that if `resetConsent()`
  // is called from elsewhere (footer link), the banner reappears.
  useEffect(() => {
    setVisible(getConsent() === CONSENT.UNKNOWN);
    const unsubscribe = onConsentChange((state) => {
      setVisible(state === CONSENT.UNKNOWN);
    });
    return unsubscribe;
  }, []);

  // Scrolling away = implicit decline. Watch for the first meaningful scroll
  // while the banner is up and undecided, then play the auto-decline sequence.
  useEffect(() => {
    if (!visible || phase !== 'idle') return;
    const onScroll = () => {
      if (window.scrollY <= SCROLL_TRIGGER_PX) return;
      window.removeEventListener('scroll', onScroll);
      // Respect reduced-motion: skip the animation, just record the decision.
      if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
        setConsent(CONSENT.DENIED);
        return;
      }
      // Freeze the actions row width and capture the Decline button's real
      // width so it can expand smoothly from its own size to cover the row.
      const actions = actionsRef.current;
      const decline = declineRef.current;
      if (actions && decline) {
        actions.style.width = `${actions.offsetWidth}px`;
        actions.style.setProperty('--hq-decline-w', `${decline.offsetWidth}px`);
      }
      setPhase('merging');
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, [visible, phase]);

  // Advance the auto-decline animation through its phases, then persist.
  useEffect(() => {
    if (phase === 'idle') return;
    const t = setTimeout(() => {
      if (phase === 'merging') setPhase('confirming');
      else if (phase === 'confirming') setPhase('leaving');
      else setConsent(CONSENT.DENIED); // leaving done — persist + unmount
    }, PHASE_MS[phase]);
    return () => clearTimeout(t);
  }, [phase]);

  if (!visible) return null;

  const autoDeclining = phase !== 'idle';

  return (
    <div
      role="dialog"
      aria-labelledby="hq-consent-text"
      aria-describedby="hq-consent-text"
      className={`hq-consent${autoDeclining ? ` hq-consent--auto hq-consent--${phase}` : ''}`}
    >
      <div className="hq-consent__inner">
        <p id="hq-consent-text" className="hq-consent__text">
          We use analytics cookies to understand how visitors use this site. No marketing,
          no third-party advertising.
        </p>
        <div className="hq-consent__actions" ref={actionsRef}>
          <button
            type="button"
            ref={declineRef}
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
          bottom: 0;
          left: 0;
          right: 0;
          z-index: 99999;
          background: #1a1a1a;
          color: #faf9f6;
          padding: 0.6rem 1.25rem;
          font-family: 'Space Grotesk', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
          font-size: 0.8125rem;
          line-height: 1.4;
          border-top: 1px solid rgba(250, 249, 246, 0.12);
          box-shadow: 0 -4px 24px rgba(0, 0, 0, 0.25);
          animation: hq-consent-rise 380ms cubic-bezier(0.16, 1, 0.3, 1);
        }
        @keyframes hq-consent-rise {
          from { opacity: 0; transform: translateY(100%); }
          to   { opacity: 1; transform: translateY(0); }
        }
        .hq-consent--leaving {
          animation: hq-consent-leave 380ms cubic-bezier(0.4, 0, 1, 1) forwards;
        }
        @keyframes hq-consent-leave {
          to { opacity: 0; transform: translateY(100%); }
        }
        .hq-consent__inner {
          max-width: 1100px;
          margin: 0 auto;
          display: flex;
          align-items: center;
          flex-wrap: wrap;
          gap: 0.5rem 1.25rem;
        }
        .hq-consent__text {
          margin: 0;
          color: #faf9f6;
          flex: 1;
          min-width: 240px;
        }
        .hq-consent__actions {
          display: flex;
          gap: 0.5rem;
          flex-shrink: 0;
          position: relative;
        }
        .hq-consent--auto .hq-consent__actions {
          pointer-events: none;
        }
        .hq-consent__btn {
          font-family: inherit;
          font-size: 0.75rem;
          font-weight: 500;
          letter-spacing: 0.04em;
          padding: 0.45rem 0.95rem;
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
        /* Auto-decline: Accept fades out as Decline expands over it. */
        .hq-consent--auto .hq-consent__btn--accept {
          opacity: 0;
          transition: opacity 260ms ease-out;
        }
        .hq-consent--auto .hq-consent__btn--decline {
          position: absolute;
          left: 0;
          top: 0;
          bottom: 0;
          z-index: 2;
          width: var(--hq-decline-w, 100%);
        }
        .hq-consent--merging .hq-consent__btn--decline {
          animation: hq-decline-cover 340ms cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }
        @keyframes hq-decline-cover {
          to { width: 100%; }
        }
        /* Decline stays expanded once merged. */
        .hq-consent--confirming .hq-consent__btn--decline,
        .hq-consent--leaving .hq-consent__btn--decline {
          width: 100%;
        }
        /* Brief "clicked" pulse so it's obvious Decline was chosen. */
        .hq-consent--confirming .hq-consent__btn--decline {
          animation: hq-decline-press 260ms ease-out forwards;
        }
        @keyframes hq-decline-press {
          0%   { transform: scale(1);    background: transparent; }
          35%  { transform: scale(0.97); background: rgba(250, 249, 246, 0.16); }
          100% { transform: scale(1);    background: transparent; }
        }
        @media (max-width: 520px) {
          .hq-consent {
            padding: 0.6rem 1rem;
          }
          .hq-consent__actions {
            flex: 1;
          }
          .hq-consent__btn {
            flex: 1;
          }
        }
        @media (prefers-reduced-motion: reduce) {
          .hq-consent,
          .hq-consent--leaving,
          .hq-consent--auto .hq-consent__btn--decline,
          .hq-consent--auto .hq-consent__btn--accept {
            animation: none;
            transition: none;
          }
        }
      `}</style>
    </div>
  );
}

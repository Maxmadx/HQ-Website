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
//   - Scrolling away is treated as an implicit decline, *scrubbed by scroll
//     position*: from SCRUB_START to SCRUB_START + SCRUB_DISTANCE the banner
//     progressively dismisses — Accept fades while Decline expands over it,
//     then the bar slides away. It tracks scroll 1:1, so the user controls the
//     rate and can scroll back up to undo it. Only at full progress is
//     'denied' actually committed. Declining on scroll is the safe direction
//     under PECR: nothing is ever tracked without an explicit grant.
//   - Stored decision persists in localStorage; the user can reopen the
//     banner via resetConsent() from a footer "Cookie preferences" link.
//
// Brand: warm white (#faf9f6) on charcoal (#1a1a1a), Space Grotesk, slim
// full-width bottom bar, no overlay (non-blocking by design — UK ICO permits a
// non-modal banner as long as no non-essential cookies are set before consent,
// which we guarantee in ga.js + clarity.js).

import { useEffect, useRef, useState } from 'react';
import { getConsent, setConsent, onConsentChange, CONSENT } from '../lib/consent';

// Scroll-scrub range: dismissal starts at SCRUB_START px of scroll and is
// fully committed after a further SCRUB_DISTANCE px.
const SCRUB_START = 60;
const SCRUB_DISTANCE = 400;
// Within 0..1 progress: the Accept->Decline merge plays over the first
// MERGE_END; the bar slides away over the remainder.
const MERGE_END = 0.5;

export default function ConsentBanner() {
  const [visible, setVisible] = useState(false);
  const [progress, setProgress] = useState(0);
  const actionsRef = useRef(null);
  const declineRef = useRef(null);
  const acceptRef = useRef(null);
  const dimsRef = useRef(null);        // { actionsW, declineW, acceptW } — measured once
  const committedRef = useRef(false);

  // Read consent state on mount. Also subscribe so that if `resetConsent()`
  // is called from elsewhere (footer link), the banner reappears + resets.
  useEffect(() => {
    setVisible(getConsent() === CONSENT.UNKNOWN);
    const unsubscribe = onConsentChange((state) => {
      const unknown = state === CONSENT.UNKNOWN;
      setVisible(unknown);
      if (unknown) {
        committedRef.current = false;
        setProgress(0);
      }
    });
    return unsubscribe;
  }, []);

  // Scroll-scrubbed implicit decline. Progress tracks scroll position 1:1, so
  // the user controls the rate and can scroll back up to undo — until it
  // reaches 1, at which point 'denied' is committed.
  useEffect(() => {
    if (!visible) return;

    // Reduced motion: no scrub animation — just record the decision once the
    // user has scrolled past the full dismissal distance.
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      const onScroll = () => {
        if (committedRef.current) return;
        if (window.scrollY > SCRUB_START + SCRUB_DISTANCE) {
          committedRef.current = true;
          setConsent(CONSENT.DENIED);
        }
      };
      window.addEventListener('scroll', onScroll, { passive: true });
      onScroll();
      return () => window.removeEventListener('scroll', onScroll);
    }

    let raf = 0;
    const update = () => {
      raf = 0;
      if (committedRef.current) return;
      const p = Math.max(
        0,
        Math.min((window.scrollY - SCRUB_START) / SCRUB_DISTANCE, 1),
      );
      // Measure the actions row + Decline button once, the first time the
      // dismissal starts, so Decline can expand smoothly to cover the row.
      if (
        p > 0 &&
        !dimsRef.current &&
        actionsRef.current &&
        declineRef.current &&
        acceptRef.current
      ) {
        dimsRef.current = {
          actionsW: actionsRef.current.offsetWidth,
          declineW: declineRef.current.offsetWidth,
          acceptW: acceptRef.current.offsetWidth,
        };
      }
      setProgress(p);
      if (p >= 1) {
        committedRef.current = true;
        setConsent(CONSENT.DENIED);
      }
    };
    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(update);
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    update(); // sync initial state (handles a page that loads already scrolled)
    return () => {
      window.removeEventListener('scroll', onScroll);
      if (raf) cancelAnimationFrame(raf);
    };
  }, [visible]);

  if (!visible) return null;

  const dismissing = progress > 0;
  const dims = dimsRef.current;
  // Sub-progress (0..1) for each stage of the dismissal.
  const merge = Math.min(progress / MERGE_END, 1);
  const leave = Math.max(0, Math.min((progress - MERGE_END) / (1 - MERGE_END), 1));

  const barStyle = dismissing
    ? { transform: `translateY(${(leave * 100).toFixed(2)}%)` }
    : undefined;
  const actionsStyle = dismissing && dims ? { width: `${dims.actionsW}px` } : undefined;
  // Accept stays pinned to the right and fades in place — it must NOT reflow
  // when Decline pops out of the flex flow.
  const acceptStyle =
    dismissing && dims
      ? {
          position: 'absolute',
          right: 0,
          top: 0,
          bottom: 0,
          width: `${dims.acceptW}px`,
          opacity: 1 - merge,
        }
      : undefined;
  // Decline expands left-to-right over Accept, then — as the bar slides away
  // (leave) — fills white with dark text so it reads as the selected choice.
  // The fill completes by ~70% of the slide so the "selected" state is clearly
  // visible before the bar is fully gone.
  const select = Math.min(leave / 0.7, 1);
  const declineStyle =
    dismissing && dims
      ? {
          position: 'absolute',
          left: 0,
          top: 0,
          bottom: 0,
          zIndex: 2,
          width: `${dims.declineW + (dims.actionsW - dims.declineW) * merge}px`,
          background: `rgba(250, 249, 246, ${select})`,
          color: `rgb(${Math.round(250 + (26 - 250) * select)}, ${Math.round(249 + (26 - 249) * select)}, ${Math.round(246 + (26 - 246) * select)})`,
        }
      : undefined;

  return (
    <div
      role="dialog"
      aria-labelledby="hq-consent-text"
      aria-describedby="hq-consent-text"
      className="hq-consent"
      style={barStyle}
    >
      <div className="hq-consent__inner">
        <p id="hq-consent-text" className="hq-consent__text">
          We use analytics cookies to understand how visitors use this site. No marketing,
          no third-party advertising.
        </p>
        <div className="hq-consent__actions" ref={actionsRef} style={actionsStyle}>
          <button
            type="button"
            ref={declineRef}
            className="hq-consent__btn hq-consent__btn--decline"
            style={declineStyle}
            onClick={() => setConsent(CONSENT.DENIED)}
          >
            Decline
          </button>
          <button
            type="button"
            ref={acceptRef}
            className="hq-consent__btn hq-consent__btn--accept"
            style={acceptStyle}
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
          will-change: transform;
        }
        @keyframes hq-consent-rise {
          from { opacity: 0; transform: translateY(100%); }
          to   { opacity: 1; transform: translateY(0); }
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
          .hq-consent {
            animation: none;
          }
        }
      `}</style>
    </div>
  );
}

import { useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import { trackEvent } from '../lib/analytics';

/** Returns scroll percentage 0–100 */
function getScrollPct() {
  const scrolled = window.scrollY + window.innerHeight;
  const total = document.documentElement.scrollHeight;
  return total > 0 ? Math.round((scrolled / total) * 100) : 0;
}

/**
 * Mount once inside <Router> to automatically track:
 *  - pageview on route change
 *  - scroll_depth at 25 / 50 / 75 / 100% thresholds (once per page visit)
 *  - page_exit with seconds spent, on route change or tab hide
 *
 * Renders nothing — side-effect only.
 */
export default function PageTracker() {
  const location = useLocation();
  const startTimeRef = useRef(null);
  const prevPathRef = useRef(null);
  const exitFiredRef = useRef(false);
  const thresholdsRef = useRef(new Set());

  useEffect(() => {
    // fireExit is defined inside the effect so it always closes over the current
    // refs without needing to be listed as an exhaustive-deps dependency.
    function fireExit(path) {
      if (!startTimeRef.current || exitFiredRef.current || !path) return;
      exitFiredRef.current = true; // set before async trackEvent to prevent double-fire
      const seconds = Math.round((Date.now() - startTimeRef.current) / 1000);
      trackEvent('page_exit', String(seconds), path);
    }

    // Fire exit for the page we're leaving (must come before exitFiredRef reset below)
    if (prevPathRef.current) {
      fireExit(prevPathRef.current);
    }

    // Reset state for new page visit
    const currentPath = location.pathname;
    prevPathRef.current = currentPath;
    startTimeRef.current = Date.now();
    exitFiredRef.current = false; // reset AFTER fireExit call above
    thresholdsRef.current = new Set();

    // Track pageview
    trackEvent('pageview', null, currentPath);

    // Scroll depth — trailing-edge throttle at 200ms so the final resting
    // position is always checked after a scroll burst ends.
    let scrollTimer = null;
    function onScroll() {
      clearTimeout(scrollTimer);
      scrollTimer = setTimeout(() => {
        scrollTimer = null;
        const pct = getScrollPct();
        for (const threshold of [25, 50, 75, 100]) {
          if (pct >= threshold && !thresholdsRef.current.has(threshold)) {
            thresholdsRef.current.add(threshold);
            trackEvent('scroll_depth', String(threshold), currentPath);
          }
        }
      }, 200);
    }
    window.addEventListener('scroll', onScroll, { passive: true });

    // Tab hide / close (visibilitychange is more reliable than beforeunload on mobile).
    // exitFiredRef prevents double-counting if the user hides then closes the tab.
    function onVisibility() {
      if (document.visibilityState === 'hidden') {
        fireExit(currentPath);
      }
    }
    document.addEventListener('visibilitychange', onVisibility);

    return () => {
      window.removeEventListener('scroll', onScroll);
      document.removeEventListener('visibilitychange', onVisibility);
      if (scrollTimer) clearTimeout(scrollTimer);
    };
  }, [location.pathname]);

  return null;
}

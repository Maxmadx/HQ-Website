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

  function fireExit(path) {
    if (!startTimeRef.current || exitFiredRef.current || !path) return;
    exitFiredRef.current = true;
    const seconds = Math.round((Date.now() - startTimeRef.current) / 1000);
    trackEvent('page_exit', String(seconds), path);
  }

  useEffect(() => {
    // Fire exit for the page we're leaving
    if (prevPathRef.current) {
      fireExit(prevPathRef.current);
    }

    // Reset for new page
    const currentPath = location.pathname;
    prevPathRef.current = currentPath;
    startTimeRef.current = Date.now();
    exitFiredRef.current = false;
    thresholdsRef.current = new Set();

    // Track pageview
    trackEvent('pageview', null, currentPath);

    // Scroll depth — throttled at 200ms
    let scrollTimer = null;
    function onScroll() {
      if (scrollTimer) return;
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

    // Tab hide / close (visibilitychange is more reliable than beforeunload on mobile)
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
  }, [location.pathname]); // eslint-disable-line react-hooks/exhaustive-deps

  return null;
}

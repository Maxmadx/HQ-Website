import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { trackEvent } from '../lib/analytics';

/**
 * Mount once inside <Router> to automatically track page views.
 * Renders nothing — side-effect only.
 */
export default function PageTracker() {
  const location = useLocation();

  useEffect(() => {
    trackEvent('pageview', null, location.pathname);
  }, [location.pathname]);

  return null;
}

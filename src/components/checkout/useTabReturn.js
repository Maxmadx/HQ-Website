import { useEffect, useRef, useState } from 'react';

/**
 * Returns true (latched) once after the document goes hidden, then visible again.
 * Disabled (always false) when `enabled` is false.
 */
export default function useTabReturn({ enabled }) {
  const wasHidden = useRef(false);
  const [returned, setReturned] = useState(false);

  useEffect(() => {
    if (!enabled) return undefined;
    function onVisibility() {
      if (document.visibilityState === 'hidden') {
        wasHidden.current = true;
      } else if (document.visibilityState === 'visible' && wasHidden.current) {
        setReturned(true);
      }
    }
    document.addEventListener('visibilitychange', onVisibility);
    return () => document.removeEventListener('visibilitychange', onVisibility);
  }, [enabled]);

  return returned;
}

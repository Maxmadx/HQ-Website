import { useEffect, useState } from 'react';

const TOP_THRESHOLD_PX = 20;

/**
 * Returns true (latched) once the mouse leaves the viewport near the top edge.
 * Disabled (always false) when `enabled` is false.
 */
export default function useExitIntent({ enabled }) {
  const [triggered, setTriggered] = useState(false);

  useEffect(() => {
    if (!enabled) return undefined;
    function onLeave(e) {
      if (typeof e.clientY === 'number' && e.clientY < TOP_THRESHOLD_PX) {
        setTriggered(true);
      }
    }
    document.addEventListener('mouseleave', onLeave);
    return () => document.removeEventListener('mouseleave', onLeave);
  }, [enabled]);

  return triggered;
}

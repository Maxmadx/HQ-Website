import { useState, useEffect } from 'react';
import { collection, query, where, onSnapshot } from 'firebase/firestore';
import { db } from '../lib/firebase';

/**
 * Subscribe to a single image slot by slotId.
 * Returns { url, alt, loading } where url falls back to fallbackUrl if slot not found.
 */
export function useImageSlot(slotId, fallbackUrl = '') {
  const [url, setUrl] = useState(fallbackUrl);
  const [alt, setAlt] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!slotId) {
      setLoading(false);
      return;
    }
    const q = query(collection(db, 'image_slots'), where('slotId', '==', slotId));
    const unsub = onSnapshot(
      q,
      (snap) => {
        if (!snap.empty) {
          const data = snap.docs[0].data();
          setUrl(data.url || fallbackUrl);
          setAlt(data.alt || '');
        } else {
          setUrl(fallbackUrl);
        }
        setLoading(false);
      },
      () => {
        setUrl(fallbackUrl);
        setLoading(false);
      }
    );
    return unsub;
  }, [slotId, fallbackUrl]);

  return { url, alt, loading };
}

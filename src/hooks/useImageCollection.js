import { useState, useEffect } from 'react';
import { doc, onSnapshot } from 'firebase/firestore';
import { db } from '../lib/firebase';

/**
 * Subscribe to an image_collections document by collectionId.
 * Returns the ordered images array. Falls back to defaultImages immediately
 * while Firestore loads, so the site never shows a blank state.
 *
 * Usage:
 *   const images = useImageCollection('home-gallery', COLLECTION_DEFAULTS['home-gallery'].images);
 */
export function useImageCollection(collectionId, defaultImages = []) {
  const [images, setImages] = useState(defaultImages);

  useEffect(() => {
    if (!collectionId) return;
    const unsub = onSnapshot(
      doc(db, 'image_collections', collectionId),
      (snap) => {
        if (snap.exists() && snap.data().images?.length > 0) {
          const sorted = [...snap.data().images].sort((a, b) => (a.order ?? 0) - (b.order ?? 0));
          setImages(sorted);
        } else {
          setImages(defaultImages);
        }
      },
      () => {
        // Firestore unavailable — keep showing defaults
        setImages(defaultImages);
      },
    );
    return unsub;
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [collectionId]);

  return images;
}

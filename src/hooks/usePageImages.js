/**
 * usePageImages — fetch all image sections for a page in ONE Firestore query.
 *
 * Returns a map: { [sectionId]: images[] }
 * Starts with hardcoded defaults immediately (no loading flash).
 * Merges Firestore overrides once they arrive.
 *
 * Uses getDocs (one-time fetch) rather than onSnapshot — the website doesn't
 * need real-time updates on every visit. Admin manages the data and writes
 * to Firestore; next page load picks up the changes.
 */

import { useState, useEffect } from 'react';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { SECTIONS_BY_PAGE } from '../lib/imageSections';

export function usePageImages(page) {
  // Seed with defaults immediately so the page renders with real content
  const defaultMap = Object.fromEntries(
    (SECTIONS_BY_PAGE[page] || []).map((s) => [s.id, s.images]),
  );
  const [imageMap, setImageMap] = useState(defaultMap);

  useEffect(() => {
    const q = query(
      collection(db, 'site_images'),
      where('page', '==', page),
    );
    getDocs(q)
      .then((snap) => {
        if (snap.empty) return;
        const updates = {};
        snap.forEach((docSnap) => {
          const data = docSnap.data();
          if (data.images?.length > 0) {
            updates[docSnap.id] = [...data.images].sort(
              (a, b) => (a.order ?? 0) - (b.order ?? 0),
            );
          }
        });
        if (Object.keys(updates).length > 0) {
          setImageMap((prev) => ({ ...prev, ...updates }));
        }
      })
      .catch(() => {
        // Firestore unavailable — keep showing defaults
      });
  }, [page]); // eslint-disable-line react-hooks/exhaustive-deps

  return imageMap;
}

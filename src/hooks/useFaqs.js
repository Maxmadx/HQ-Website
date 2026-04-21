import { useState, useEffect } from 'react';
import { collection, query, where, onSnapshot } from 'firebase/firestore';
import { db } from '../lib/firebase';

/**
 * Real-time FAQ hook.
 * @param {string} pageKey  e.g. 'discovery', 'sfh', 'ppl'
 * @param {object} opts
 * @param {boolean} [opts.visibleOnly=false]  filter to visible:true items
 */
export function useFaqs(pageKey, { visibleOnly = false } = {}) {
  const [faqs, setFaqs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!pageKey) return;
    // Intentionally no orderBy — avoids requiring a composite index.
    // Sorting is done client-side after fetch.
    const q = query(
      collection(db, 'faqs'),
      where('page', '==', pageKey),
    );
    const unsub = onSnapshot(
      q,
      (snap) => {
        let docs = snap.docs.map((d) => ({ id: d.id, ...d.data() }));
        if (visibleOnly) docs = docs.filter((f) => f.visible);
        docs.sort((a, b) => (a.displayOrder ?? 999) - (b.displayOrder ?? 999));
        setFaqs(docs);
        setLoading(false);
      },
      (err) => {
        console.error('[useFaqs] query error:', err.message);
        setLoading(false);
      },
    );
    return unsub;
  }, [pageKey, visibleOnly]);

  return { faqs, loading };
}

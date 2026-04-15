import { useState, useEffect } from 'react';
import { collection, query, where, orderBy, onSnapshot } from 'firebase/firestore';
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
    const q = query(
      collection(db, 'faqs'),
      where('page', '==', pageKey),
      orderBy('displayOrder', 'asc'),
    );
    const unsub = onSnapshot(
      q,
      (snap) => {
        let docs = snap.docs.map((d) => ({ id: d.id, ...d.data() }));
        if (visibleOnly) docs = docs.filter((f) => f.visible);
        setFaqs(docs);
        setLoading(false);
      },
      () => setLoading(false),
    );
    return unsub;
  }, [pageKey, visibleOnly]);

  return { faqs, loading };
}

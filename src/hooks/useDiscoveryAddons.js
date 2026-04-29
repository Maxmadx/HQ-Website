import { useState, useEffect } from 'react';
import { collection, query, where, onSnapshot } from 'firebase/firestore';
import { db } from '../lib/firebase';

export function useDiscoveryAddons() {
  const [state, setState] = useState({ items: [], loading: true });

  useEffect(() => {
    const q = query(collection(db, 'misc_items'), where('discoveryAddon', '==', true));
    const unsub = onSnapshot(q, (snap) => {
      const items = snap.docs.map((d) => ({ id: d.id, ...d.data() }));
      items.sort((a, b) => {
        const pctA = Number(a.discoveryAddonDiscountPct) || 0;
        const pctB = Number(b.discoveryAddonDiscountPct) || 0;
        if (pctA !== pctB) return pctB - pctA;
        return String(a.name || '').localeCompare(String(b.name || ''));
      });
      setState({ items, loading: false });
    });
    return () => unsub();
  }, []);

  return state;
}

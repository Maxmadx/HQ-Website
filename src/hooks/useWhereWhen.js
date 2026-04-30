import { useState, useEffect } from 'react';
import { collection, onSnapshot } from 'firebase/firestore';
import { db } from '../lib/firebase';

/**
 * Real-time hook for the SFH "Where & When" section.
 * Streams two Firestore collections in parallel: `sfh_partners` and `sfh_events`.
 *
 * @param {object}  opts
 * @param {boolean} [opts.visibleOnly=false] filter both lists to visible:true items
 * @returns {{ partners: Array, events: Array, loading: boolean }}
 *   `loading` stays true until BOTH snapshots have fired at least once.
 */
export function useWhereWhen({ visibleOnly = false } = {}) {
  const [partners, setPartners] = useState([]);
  const [events, setEvents] = useState([]);
  const [partnersReady, setPartnersReady] = useState(false);
  const [eventsReady, setEventsReady] = useState(false);

  useEffect(() => {
    // Intentionally no orderBy — sort client-side, no composite index needed.
    const unsubPartners = onSnapshot(
      collection(db, 'sfh_partners'),
      (snap) => {
        let docs = snap.docs.map((d) => ({ id: d.id, ...d.data() }));
        if (visibleOnly) docs = docs.filter((p) => p.visible);
        docs.sort((a, b) => (a.displayOrder ?? 999) - (b.displayOrder ?? 999));
        setPartners(docs);
        setPartnersReady(true);
      },
      (err) => {
        console.error('[useWhereWhen] partners query error:', err.message);
        setPartnersReady(true);
      },
    );

    const unsubEvents = onSnapshot(
      collection(db, 'sfh_events'),
      (snap) => {
        let docs = snap.docs.map((d) => ({ id: d.id, ...d.data() }));
        if (visibleOnly) docs = docs.filter((e) => e.visible);
        docs.sort((a, b) => (a.displayOrder ?? 999) - (b.displayOrder ?? 999));
        setEvents(docs);
        setEventsReady(true);
      },
      (err) => {
        console.error('[useWhereWhen] events query error:', err.message);
        setEventsReady(true);
      },
    );

    return () => {
      unsubPartners();
      unsubEvents();
    };
  }, [visibleOnly]);

  return { partners, events, loading: !(partnersReady && eventsReady) };
}

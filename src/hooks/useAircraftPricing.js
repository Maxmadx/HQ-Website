/**
 * useAircraftPricing — reads per-subtype aircraft prices (USD) from Firestore,
 * with the values baked into Sales.jsx (`subtype.priceUsd`) as the default fallback.
 *
 * Firestore docs live in the existing `pricing` collection with `category: 'aircraft'`,
 * `currency: 'usd'`, and `id` of the form `aircraft_{model}_{subtype}` (e.g.
 * `aircraft_r66_palo_verde`). Price is stored in USD cents to match the existing
 * pence convention used for GBP items.
 */
import { useState, useEffect } from 'react';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../lib/firebase';

let _cache = null;
let _cacheTs = 0;
const CACHE_TTL = 5 * 60 * 1000;

export function aircraftPriceId(modelId, subtypeId) {
  return `aircraft_${modelId}_${subtypeId.replace(/-/g, '_')}`;
}

export function useAircraftPricing() {
  const [overrides, setOverrides] = useState(_cache ?? {});
  const [loading, setLoading] = useState(!_cache);

  useEffect(() => {
    const now = Date.now();
    if (_cache && now - _cacheTs < CACHE_TTL) {
      setOverrides(_cache);
      setLoading(false);
      return;
    }
    getDocs(collection(db, 'pricing'))
      .then((snap) => {
        const map = {};
        snap.forEach((d) => {
          const data = d.data();
          if (data.category === 'aircraft') map[d.id] = data;
        });
        _cache = map;
        _cacheTs = now;
        setOverrides(map);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  /**
   * Get USD price for a subtype. Returns Firestore override (cents → dollars)
   * if present, otherwise the `priceUsd` baked into the subtype object.
   */
  function getPriceUsd(modelId, subtype) {
    if (!subtype) return null;
    const id = aircraftPriceId(modelId, subtype.id);
    const override = overrides[id]?.price;
    if (typeof override === 'number') return override / 100;
    return subtype.priceUsd ?? null;
  }

  return { overrides, loading, getPriceUsd };
}

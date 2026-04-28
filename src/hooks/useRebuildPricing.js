/**
 * useRebuildPricing — reads per-model rebuild prices (GBP) from Firestore
 * with the values from REBUILD_PRICING_DEFAULTS as the fallback.
 *
 * Mirrors useAircraftPricing: single getDocs on mount, module-level
 * 5-min cache, returns synchronously usable defaults before fetch resolves.
 *
 * Firestore docs live in the existing `pricing` collection with
 * `category: 'rebuilds'`. Price stored in GBP pence (×100).
 */
import { useState, useEffect } from 'react';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { REBUILD_PRICING_DEFAULTS } from '../config/rebuildPricingDefaults';

let _cache = null;
let _cacheTs = 0;
const CACHE_TTL = 5 * 60 * 1000;

export function useRebuildPricing() {
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
          if (data.category === 'rebuilds') map[d.id] = data;
        });
        _cache = map;
        _cacheTs = now;
        setOverrides(map);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  /**
   * Returns { from, donorMin, donorMax } in GBP pounds for the given modelKey
   * ('r22' | 'r44' | 'r66'). Each field uses the Firestore override (pence → pounds)
   * if present, else the default from REBUILD_PRICING_DEFAULTS.
   */
  function getRebuildPrices(modelKey) {
    const out = { from: null, donorMin: null, donorMax: null };
    for (const entry of REBUILD_PRICING_DEFAULTS) {
      if (entry.modelKey !== modelKey) continue;
      const override = overrides[entry.id]?.price;
      out[entry.field] = typeof override === 'number'
        ? override / 100
        : entry.defaultGbp;
    }
    return out;
  }

  return { overrides, loading, getRebuildPrices };
}

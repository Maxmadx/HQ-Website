/**
 * usePricing — fetches all pricing from Firestore once per session (5-min cache)
 * and provides helpers for pence lookup and formatted display.
 *
 * Every component that shows a price reads from here.
 * The admin panel writes to the same `pricing` Firestore collection.
 * The server (Stripe) also reads from the same collection.
 * → One change in the admin panel flows through to every display and every charge.
 *
 * Fallback values are kept in sync with seed-pricing.js so the site never
 * shows blank prices if Firestore is temporarily unavailable.
 */

import { useState, useEffect } from 'react';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../lib/firebase';

// ── Fallback values (pence) — must match seed-pricing.js ─────────────────────
const FALLBACK = {
  // Discovery flights
  discovery_r22_30min: 18000,
  discovery_r22_60min: 36000,
  discovery_r44_30min: 30500,
  discovery_r44_60min: 60500,
  discovery_r66_30min: 45000,
  discovery_r66_60min: 85000,
  // Training hourly rates
  training_r22_hr: 27500,
  training_r44_hr: 39500,
  training_r66_hr: 59500,
  // Type ratings (from)
  type_rating_r22: 240000,
  type_rating_r44: 320000,
  type_rating_r66: 950000,
  // Self-fly hire
  sfh_r22_wet:   30000,
  sfh_r22_block: 28500,
  sfh_r44_wet:   45000,
  sfh_r44_block: 42500,
  sfh_r66_wet:   75000,
  sfh_r66_block: 71000,
  // Additional services
  addon_safety_pilot: 15000,
  addon_customs:       7500,
  // PPL cost estimates
  costs_training_from: 1600000,
  costs_training_to:   2000000,
  costs_exams_from:      50000,
  costs_exams_to:        80000,
  costs_medical_from:    20000,
  costs_medical_to:      30000,
  costs_total_from:    1700000,
  costs_total_to:      2200000,
};

// ── Module-level cache — survives re-renders, resets after 5 minutes ──────────
let _cache = null;
let _cacheTs = 0;
const CACHE_TTL = 5 * 60 * 1000;

// ── Format helper (pence → £X,XXX) ───────────────────────────────────────────
function fmtPence(pence) {
  return '£' + (pence / 100).toLocaleString('en-GB', {
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  });
}

// ── Hook ──────────────────────────────────────────────────────────────────────
export function usePricing() {
  const [prices, setPrices] = useState(_cache ?? {});
  const [loading, setLoading] = useState(!_cache);

  useEffect(() => {
    const now = Date.now();
    if (_cache && now - _cacheTs < CACHE_TTL) {
      setPrices(_cache);
      setLoading(false);
      return;
    }
    getDocs(collection(db, 'pricing'))
      .then((snap) => {
        const map = {};
        snap.forEach((d) => { map[d.id] = d.data(); });
        _cache = map;
        _cacheTs = now;
        setPrices(map);
      })
      .catch(() => {
        // Firestore unavailable — p() and fmt() will fall back to hardcoded values
      })
      .finally(() => setLoading(false));
  }, []);

  /**
   * Get price in pence for a given pricing ID.
   * Falls back to the hardcoded constant if Firestore hasn't loaded yet
   * or if the document doesn't exist.
   */
  function p(id) {
    return prices[id]?.price ?? FALLBACK[id] ?? 0;
  }

  /**
   * Get formatted price string (e.g. '£275', '£16,000') for a given ID.
   */
  function fmt(id) {
    return fmtPence(p(id));
  }

  return { prices, loading, p, fmt };
}

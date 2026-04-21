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
  // London helicopter tours
  london_tour_shared_day:     19900,
  london_tour_shared_sunset:  24900,
  london_tour_shared_night:   29900,
  london_tour_private_day:   149500,
  london_tour_private_sunset: 169500,
  london_tour_private_night:  189500,
  // Discovery flights
  discovery_r22_30min: 18000,
  discovery_r22_60min: 36000,
  discovery_r44_30min: 30500,
  discovery_r44_60min: 60500,
  discovery_r66_30min: 31500,
  discovery_r66_60min: 63500,
  // Training hourly rates
  training_r22_hr: 27500,
  training_r44_hr: 39500,
  training_r66_hr: 59500,
  // Type ratings (from)
  type_rating_r22: 240000,
  type_rating_r44: 320000,
  type_rating_r66: 950000,
  // Self-fly hire
  sfh_r22_wet:   29500,
  sfh_r22_block: 28000,
  sfh_r44_wet:   54000,
  sfh_r44_block: 51000,
  sfh_r66_wet:   57000,
  sfh_r66_block: 54000,
  // Additional services
  addon_safety_pilot: 15000,
  addon_customs:       7500,
  // Training course display prices
  training_discovery_day:  29900,
  training_ppl_from:      1500000,
  training_ground_school:  150000,
  // Hangarage
  hangarage_r22_day:    7500,  hangarage_r22_week:   35000,  hangarage_r22_month:   95000,
  hangarage_r44_day:   12000,  hangarage_r44_week:   55000,  hangarage_r44_month:  150000,
  hangarage_as350_day: 16000,  hangarage_as350_week: 75000,  hangarage_as350_month: 220000,
  hangarage_aw109_day: 25000,  hangarage_aw109_week: 120000, hangarage_aw109_month: 350000,
  // Valet services
  valet_r22_mini:   16000,  valet_r22_full:   22000,  valet_r22_deluxe:   36000,
  valet_r66_mini:   18000,  valet_r66_full:   30000,  valet_r66_deluxe:   45000,
  valet_as350_mini: 26000,  valet_as350_full: 40000,  valet_as350_deluxe: 60000,
  valet_a139_mini:  39000,  valet_a139_full:  60000,  valet_a139_deluxe:  90000,
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

/**
 * fx.js — live USD→GBP/EUR rates with localStorage caching.
 *
 * Rates come from frankfurter.app (open-source, ECB-backed, no key, no rate limit).
 * Cached for 24h in localStorage so we don't hit the network on every page load.
 * If the fetch fails, falls back to FALLBACK_RATES so prices always render.
 *
 * Round helper: aircraft prices are large enough that exact conversions look fussy
 * ("$345,000 ≈ €317,400"). We round to the nearest 5,000 of the target currency
 * for marketing display.
 */
const FRANKFURTER_URL = 'https://api.frankfurter.app/latest?from=USD&to=GBP,EUR';
const STORAGE_KEY = 'hq_fx_rates_v1';
const CACHE_TTL_MS = 24 * 60 * 60 * 1000;

const FALLBACK_RATES = { GBP: 0.78, EUR: 0.92 };

let _memoryCache = null;
let _inflight = null;

function readStorage() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    if (!parsed?.rates || !parsed?.fetchedAt) return null;
    if (Date.now() - parsed.fetchedAt > CACHE_TTL_MS) return null;
    return parsed;
  } catch {
    return null;
  }
}

function writeStorage(payload) {
  try { localStorage.setItem(STORAGE_KEY, JSON.stringify(payload)); } catch {}
}

async function fetchRates() {
  const res = await fetch(FRANKFURTER_URL);
  if (!res.ok) throw new Error(`fx fetch ${res.status}`);
  const data = await res.json();
  if (!data?.rates?.GBP || !data?.rates?.EUR) throw new Error('fx malformed');
  return { GBP: data.rates.GBP, EUR: data.rates.EUR };
}

/**
 * Returns { rates: { GBP, EUR }, fetchedAt, source }.
 * Always resolves — falls back to FALLBACK_RATES on failure.
 */
export async function getFxRates() {
  if (_memoryCache) return _memoryCache;
  const cached = readStorage();
  if (cached) {
    _memoryCache = cached;
    return cached;
  }
  if (!_inflight) {
    _inflight = fetchRates()
      .then((rates) => {
        const payload = { rates, fetchedAt: Date.now(), source: 'frankfurter' };
        writeStorage(payload);
        _memoryCache = payload;
        return payload;
      })
      .catch(() => {
        const payload = { rates: FALLBACK_RATES, fetchedAt: Date.now(), source: 'fallback' };
        _memoryCache = payload;
        return payload;
      })
      .finally(() => { _inflight = null; });
  }
  return _inflight;
}

export function getCachedFxRatesSync() {
  return _memoryCache ?? readStorage() ?? { rates: FALLBACK_RATES, fetchedAt: 0, source: 'fallback' };
}

/** Round to nearest `step` (default 5,000) for clean marketing display. */
export function roundNice(value, step = 5000) {
  return Math.round(value / step) * step;
}

/**
 * Format a USD amount as a localised currency string.
 * @param amountUsd  number — dollars (e.g. 1563500)
 * @param currency   'USD' | 'GBP' | 'EUR'
 * @param rates      { GBP, EUR } from getFxRates()
 * @param opts.round whether to round non-USD to nearest 5,000 (default true)
 */
export function formatPrice(amountUsd, currency, rates, opts = {}) {
  const { round = true } = opts;
  if (currency === 'USD') {
    return '$' + amountUsd.toLocaleString('en-US', { maximumFractionDigits: 0 });
  }
  const rate = rates?.[currency] ?? FALLBACK_RATES[currency];
  const converted = amountUsd * rate;
  const final = round ? roundNice(converted) : Math.round(converted);
  const symbol = currency === 'GBP' ? '£' : '€';
  return symbol + final.toLocaleString('en-GB', { maximumFractionDigits: 0 });
}

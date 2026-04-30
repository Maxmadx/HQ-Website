/**
 * useFx — provides live USD→GBP/EUR rates with localStorage caching.
 *
 * Pairs with src/lib/fx.js. Returns rates + a `format(amountUsd, currency)` helper
 * pre-bound to those rates. Uses sync cached value for the initial render so
 * prices appear instantly (no flicker), then resolves the live rate in the background.
 */
import { useEffect, useState } from 'react';
import { getFxRates, getCachedFxRatesSync, formatPrice } from '../lib/fx';

export function useFx() {
  const [state, setState] = useState(getCachedFxRatesSync());

  useEffect(() => {
    let alive = true;
    getFxRates().then((payload) => {
      if (alive) setState(payload);
    });
    return () => { alive = false; };
  }, []);

  return {
    rates: state.rates,
    fetchedAt: state.fetchedAt,
    source: state.source,
    format: (amountUsd, currency, opts) => formatPrice(amountUsd, currency, state.rates, opts),
  };
}

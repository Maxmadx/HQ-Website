import { useDocument } from './useFirestore';
import { AIRCRAFT_SPECS_DEFAULTS } from '../lib/aircraftSpecsDefaults';

// Read aircraft factory specs for a given model (r22|r44|r66|r88).
//
// Returns the full doc shape: { variants: [{ key, name, rows, dimensions?, diagram? }] }
// While Firestore is loading, OR if the doc doesn't exist yet, falls back to
// the baked-in defaults so the page never renders an empty state during
// the initial admin migration. Realtime updates land via onSnapshot.
export function useAircraftSpecs(modelId) {
  const { data, loading } = useDocument('aircraftSpecs', modelId);
  const fallback = AIRCRAFT_SPECS_DEFAULTS[modelId] ?? { variants: [] };

  if (loading) return { ...fallback, loading: true };
  if (!data || !Array.isArray(data.variants) || data.variants.length === 0) {
    return { ...fallback, loading: false };
  }
  return { variants: data.variants, loading: false };
}

// Convenience: get rows for a single-variant model (R66, R88).
export function useAircraftSpecRows(modelId, variantKey = 'default') {
  const { variants } = useAircraftSpecs(modelId);
  const v = variants.find((x) => x.key === variantKey) ?? variants[0];
  return v?.rows ?? [];
}

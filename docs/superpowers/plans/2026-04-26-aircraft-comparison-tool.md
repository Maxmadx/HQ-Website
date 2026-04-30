# Aircraft Comparison Tool Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Ship a public `/aircraft-comparison` page with selector + specs/cost/TCO sections + "report a mistake" affordance, and a `/admin/comparables` admin tab to manage the underlying Firestore data.

**Architecture:** Public page reads from Firestore `comparables` collection + `comparison_defaults/global` singleton, computes TCO live from URL params, renders three stacked sections. Admin page mirrors existing `/admin/listings` pattern. TCO math is pure and unit-tested in `src/lib/tco.js`.

**Tech Stack:** React 18, react-router-dom v7, Firestore (modular SDK v9+), Vitest for tests, existing `useFirestore` hook patterns, existing `AdminLayout`/`AdminRoute`, existing `/api/leads` endpoint for CTA + mistake reports.

**Spec reference:** `docs/superpowers/specs/2026-04-25-aircraft-comparison-tool-design.md`

**One spec amendment baked into this plan:** The spec said `settings/comparison-defaults`, but the existing `firestore.rules` already gates `match /settings/{settingId}` to require auth for read. To preserve public read of the defaults singleton, this plan uses a new top-level collection `comparison_defaults` with a single doc `global` (`comparison_defaults/global`). Functionally identical, no auth required.

---

## File Structure

**New files (public):**
```
src/pages/AircraftComparison.jsx                              # orchestrator
src/components/AircraftComparison/ComparisonSelector.jsx      # Robinson chips + non-Robinson search
src/components/AircraftComparison/SpecsTable.jsx
src/components/AircraftComparison/CostBreakdownTable.jsx
src/components/AircraftComparison/TCOSummary.jsx
src/components/AircraftComparison/ReportMistakeModal.jsx
src/components/AircraftComparison/ComparisonCTA.jsx
src/components/AircraftComparison/ProvenanceBadge.jsx
src/hooks/useComparisonState.js                               # URL ?models, ?hours, ?years
src/lib/tco.js                                                # pure TCO math
src/lib/tco.test.js
src/lib/comparablesSchema.js                                  # field shape, validation, classes
src/lib/comparablesSchema.test.js
```

**New files (admin):**
```
src/pages/admin/AdminComparables.jsx                          # list + defaults modal
src/pages/admin/AdminComparableEdit.jsx                       # edit/create form
```

**Modified files:**
```
src/hooks/useFirestore.js                  # add useDocument helper
src/App.jsx                                # add 3 routes
src/components/admin/AdminLayout.jsx       # add nav item
firestore.rules                            # add 2 collection rules
```

**Seed data:** A one-off seed script `scripts/seed-comparables.js` (NOT committed; gitignored) for HQ to load the initial data into Firestore from the research findings. Created in Task 19, run manually, not part of normal deploy flow.

---

## Worktree

Brainstorming was run on `main` rather than in a dedicated worktree. Before executing this plan, switch to a worktree to keep changes isolated:

```bash
git worktree add ../HQ-Website-main-comparables -b feat/aircraft-comparison main
cd ../HQ-Website-main-comparables
```

All paths in this plan are relative to the worktree root.

---

## Task 1: Comparables schema constants + validation

**Files:**
- Create: `src/lib/comparablesSchema.js`
- Create: `src/lib/comparablesSchema.test.js`

- [ ] **Step 1: Write the failing test**

Create `src/lib/comparablesSchema.test.js`:

```javascript
import { describe, it, expect } from 'vitest';
import {
  CLASSES,
  FUEL_TYPES,
  CONFIDENCE,
  MARKET_STATUS,
  validateComparable,
  isUsedOnly,
} from './comparablesSchema';

describe('comparablesSchema constants', () => {
  it('lists all five classes in display order', () => {
    expect(CLASSES).toEqual([
      { id: 'trainer', label: 'Trainer' },
      { id: 'light-piston', label: 'Light Piston' },
      { id: 'light-turbine', label: 'Light Turbine' },
      { id: 'medium-turbine', label: 'Medium Turbine' },
      { id: 'twin-turbine', label: 'Twin Turbine' },
    ]);
  });

  it('lists fuel types', () => {
    expect(FUEL_TYPES).toEqual(['avgas-100ll', 'jet-a1']);
  });

  it('lists confidence levels', () => {
    expect(CONFIDENCE).toEqual(['verified', 'estimate']);
  });

  it('lists market status values', () => {
    expect(MARKET_STATUS).toEqual(['in-production', 'used-only']);
  });
});

describe('isUsedOnly', () => {
  it('returns true when marketStatus is used-only', () => {
    expect(isUsedOnly({ marketStatus: 'used-only' })).toBe(true);
  });

  it('returns false otherwise', () => {
    expect(isUsedOnly({ marketStatus: 'in-production' })).toBe(false);
    expect(isUsedOnly({})).toBe(false);
  });
});

describe('validateComparable', () => {
  const valid = {
    id: 'r66-turbine',
    manufacturer: 'Robinson',
    model: 'R66 Turbine',
    displayName: 'R66',
    class: 'light-turbine',
    marketStatus: 'in-production',
    isRobinson: true,
    fuelType: 'jet-a1',
    specs: {
      seats: 5, cruiseSpeedKts: 120, rangeNm: 350,
      usefulLoadLbs: 1270, fuelCapacityGal: 73.3,
    },
    costsPerHour: { fuelBurnGph: 22, mxScheduled: 95, engineReserve: 80, airframeReserve: 35 },
    costsAnnual: { insurance: 18000, annualInspection: 4500, hangarage: 8000 },
    acquisition: { priceNewGbp: 1290000, priceUsedRangeGbp: { low: 950000, high: 1180000 } },
    costsSource: 'HQ internal MX records',
    costsConfidence: 'verified',
  };

  it('returns no errors for a valid doc', () => {
    expect(validateComparable(valid)).toEqual([]);
  });

  it('flags missing required fields', () => {
    const { manufacturer, ...missing } = valid;
    expect(validateComparable(missing)).toContain('manufacturer is required');
  });

  it('flags invalid class', () => {
    expect(validateComparable({ ...valid, class: 'jet' }))
      .toContain('class must be one of: trainer, light-piston, light-turbine, medium-turbine, twin-turbine');
  });

  it('flags invalid fuelType', () => {
    expect(validateComparable({ ...valid, fuelType: 'diesel' }))
      .toContain('fuelType must be one of: avgas-100ll, jet-a1');
  });

  it('flags negative numeric fields', () => {
    const bad = { ...valid, costsPerHour: { ...valid.costsPerHour, fuelBurnGph: -1 } };
    expect(validateComparable(bad)).toContain('costsPerHour.fuelBurnGph must be >= 0');
  });

  it('requires priceNewGbp unless used-only', () => {
    const bad = { ...valid, acquisition: { priceNewGbp: null, priceUsedRangeGbp: { low: 500000, high: 700000 } } };
    expect(validateComparable(bad)).toContain('acquisition.priceNewGbp is required unless marketStatus is used-only');
  });

  it('does not require priceNewGbp when used-only', () => {
    const ok = {
      ...valid,
      marketStatus: 'used-only',
      acquisition: { priceNewGbp: null, priceUsedRangeGbp: { low: 500000, high: 700000 } },
    };
    expect(validateComparable(ok)).toEqual([]);
  });
});
```

- [ ] **Step 2: Run tests to verify they fail**

```bash
npx vitest run src/lib/comparablesSchema.test.js
```
Expected: all tests FAIL — module not found.

- [ ] **Step 3: Implement schema module**

Create `src/lib/comparablesSchema.js`:

```javascript
export const CLASSES = [
  { id: 'trainer', label: 'Trainer' },
  { id: 'light-piston', label: 'Light Piston' },
  { id: 'light-turbine', label: 'Light Turbine' },
  { id: 'medium-turbine', label: 'Medium Turbine' },
  { id: 'twin-turbine', label: 'Twin Turbine' },
];

export const FUEL_TYPES = ['avgas-100ll', 'jet-a1'];
export const CONFIDENCE = ['verified', 'estimate'];
export const MARKET_STATUS = ['in-production', 'used-only'];

const CLASS_IDS = CLASSES.map((c) => c.id);

export function isUsedOnly(doc) {
  return doc?.marketStatus === 'used-only';
}

const REQUIRED_TOP = ['id', 'manufacturer', 'model', 'displayName', 'class', 'marketStatus', 'fuelType', 'costsConfidence'];
const NUMERIC_PATHS = [
  'specs.seats', 'specs.cruiseSpeedKts', 'specs.rangeNm', 'specs.usefulLoadLbs', 'specs.fuelCapacityGal',
  'costsPerHour.fuelBurnGph', 'costsPerHour.mxScheduled', 'costsPerHour.engineReserve', 'costsPerHour.airframeReserve',
  'costsAnnual.insurance', 'costsAnnual.annualInspection', 'costsAnnual.hangarage',
];

function getPath(obj, path) {
  return path.split('.').reduce((o, k) => (o == null ? undefined : o[k]), obj);
}

export function validateComparable(doc) {
  const errors = [];
  if (!doc || typeof doc !== 'object') return ['document must be an object'];

  for (const key of REQUIRED_TOP) {
    if (doc[key] === undefined || doc[key] === null || doc[key] === '') {
      errors.push(`${key} is required`);
    }
  }

  if (typeof doc.isRobinson !== 'boolean') {
    errors.push('isRobinson must be a boolean');
  }

  if (doc.class && !CLASS_IDS.includes(doc.class)) {
    errors.push(`class must be one of: ${CLASS_IDS.join(', ')}`);
  }

  if (doc.fuelType && !FUEL_TYPES.includes(doc.fuelType)) {
    errors.push(`fuelType must be one of: ${FUEL_TYPES.join(', ')}`);
  }

  if (doc.costsConfidence && !CONFIDENCE.includes(doc.costsConfidence)) {
    errors.push(`costsConfidence must be one of: ${CONFIDENCE.join(', ')}`);
  }

  if (doc.marketStatus && !MARKET_STATUS.includes(doc.marketStatus)) {
    errors.push(`marketStatus must be one of: ${MARKET_STATUS.join(', ')}`);
  }

  for (const path of NUMERIC_PATHS) {
    const v = getPath(doc, path);
    if (v !== undefined && (typeof v !== 'number' || Number.isNaN(v) || v < 0)) {
      errors.push(`${path} must be >= 0`);
    }
  }

  if (!isUsedOnly(doc)) {
    const priceNew = getPath(doc, 'acquisition.priceNewGbp');
    if (priceNew == null) {
      errors.push('acquisition.priceNewGbp is required unless marketStatus is used-only');
    }
  }

  return errors;
}
```

- [ ] **Step 4: Run tests to verify they pass**

```bash
npx vitest run src/lib/comparablesSchema.test.js
```
Expected: all tests PASS.

- [ ] **Step 5: Commit**

```bash
git add src/lib/comparablesSchema.js src/lib/comparablesSchema.test.js
git commit -m "feat(comparables): add schema constants and validator"
```

---

## Task 2: TCO math library

**Files:**
- Create: `src/lib/tco.js`
- Create: `src/lib/tco.test.js`

- [ ] **Step 1: Write the failing test**

Create `src/lib/tco.test.js`:

```javascript
import { describe, it, expect } from 'vitest';
import {
  fuelCostPerHour,
  docPerHour,
  annualFixed,
  totalCostPerYear,
  multiYearTCO,
} from './tco';

const DEFAULTS = {
  fuelPrice: { avgas100llGbpPerGal: 8.5, jetA1GbpPerGal: 7.8 },
  defaults: { hoursPerYear: 100, yearsOfOwnership: 5 },
};

const R66 = {
  fuelType: 'jet-a1',
  costsPerHour: { fuelBurnGph: 22, mxScheduled: 95, engineReserve: 80, airframeReserve: 35 },
  costsAnnual: { insurance: 18000, annualInspection: 4500, hangarage: 8000 },
  acquisition: { priceNewGbp: 1290000 },
};

describe('fuelCostPerHour', () => {
  it('multiplies burn by Jet A-1 price for jet-a1 fuel', () => {
    expect(fuelCostPerHour(R66, DEFAULTS)).toBeCloseTo(22 * 7.8);
  });

  it('uses Avgas price for avgas-100ll fuel', () => {
    const r22 = { ...R66, fuelType: 'avgas-100ll', costsPerHour: { ...R66.costsPerHour, fuelBurnGph: 8.5 } };
    expect(fuelCostPerHour(r22, DEFAULTS)).toBeCloseTo(8.5 * 8.5);
  });

  it('returns 0 if fuelBurnGph is missing', () => {
    expect(fuelCostPerHour({ fuelType: 'jet-a1', costsPerHour: {} }, DEFAULTS)).toBe(0);
  });
});

describe('docPerHour', () => {
  it('sums fuel + scheduled MX + engine reserve + airframe reserve', () => {
    expect(docPerHour(R66, DEFAULTS)).toBeCloseTo(22 * 7.8 + 95 + 80 + 35);
  });

  it('treats missing cost fields as 0', () => {
    const partial = { fuelType: 'jet-a1', costsPerHour: { fuelBurnGph: 22 }, costsAnnual: {} };
    expect(docPerHour(partial, DEFAULTS)).toBeCloseTo(22 * 7.8);
  });
});

describe('annualFixed', () => {
  it('sums insurance + annual inspection + hangarage', () => {
    expect(annualFixed(R66)).toBe(18000 + 4500 + 8000);
  });

  it('treats missing fields as 0', () => {
    expect(annualFixed({ costsAnnual: { insurance: 5000 } })).toBe(5000);
  });
});

describe('totalCostPerYear', () => {
  it('combines annual fixed + variable * hours', () => {
    const expectedDoc = 22 * 7.8 + 95 + 80 + 35;
    expect(totalCostPerYear(R66, 100, DEFAULTS)).toBeCloseTo(30500 + 100 * expectedDoc);
  });

  it('coerces non-numeric hours to defaults.hoursPerYear', () => {
    const expectedDoc = 22 * 7.8 + 95 + 80 + 35;
    expect(totalCostPerYear(R66, 'abc', DEFAULTS)).toBeCloseTo(30500 + 100 * expectedDoc);
  });
});

describe('multiYearTCO', () => {
  it('returns acquisition + (years * annual operating)', () => {
    const annualOp = 30500 + 100 * (22 * 7.8 + 95 + 80 + 35);
    expect(multiYearTCO(R66, 100, 5, DEFAULTS)).toBeCloseTo(1290000 + 5 * annualOp);
  });

  it('returns null if priceNewGbp is missing (used-only aircraft)', () => {
    const usedOnly = { ...R66, acquisition: { priceNewGbp: null } };
    expect(multiYearTCO(usedOnly, 100, 5, DEFAULTS)).toBeNull();
  });

  it('returns NaN-free numbers when inputs are garbage', () => {
    const result = multiYearTCO(R66, 'abc', null, DEFAULTS);
    expect(Number.isFinite(result)).toBe(true);
  });
});
```

- [ ] **Step 2: Run tests to verify they fail**

```bash
npx vitest run src/lib/tco.test.js
```
Expected: all tests FAIL.

- [ ] **Step 3: Implement tco.js**

Create `src/lib/tco.js`:

```javascript
function num(v, fallback = 0) {
  const n = Number(v);
  return Number.isFinite(n) && n >= 0 ? n : fallback;
}

function fuelPriceFor(aircraft, defaults) {
  const fuelType = aircraft?.fuelType;
  if (fuelType === 'avgas-100ll') return num(defaults?.fuelPrice?.avgas100llGbpPerGal, 0);
  if (fuelType === 'jet-a1') return num(defaults?.fuelPrice?.jetA1GbpPerGal, 0);
  return 0;
}

export function fuelCostPerHour(aircraft, defaults) {
  const burn = num(aircraft?.costsPerHour?.fuelBurnGph, 0);
  return burn * fuelPriceFor(aircraft, defaults);
}

export function docPerHour(aircraft, defaults) {
  return (
    fuelCostPerHour(aircraft, defaults) +
    num(aircraft?.costsPerHour?.mxScheduled, 0) +
    num(aircraft?.costsPerHour?.engineReserve, 0) +
    num(aircraft?.costsPerHour?.airframeReserve, 0)
  );
}

export function annualFixed(aircraft) {
  return (
    num(aircraft?.costsAnnual?.insurance, 0) +
    num(aircraft?.costsAnnual?.annualInspection, 0) +
    num(aircraft?.costsAnnual?.hangarage, 0)
  );
}

export function totalCostPerYear(aircraft, hoursPerYear, defaults) {
  const hrs = num(hoursPerYear, num(defaults?.defaults?.hoursPerYear, 100));
  return annualFixed(aircraft) + hrs * docPerHour(aircraft, defaults);
}

export function multiYearTCO(aircraft, hoursPerYear, years, defaults) {
  const acquisition = aircraft?.acquisition?.priceNewGbp;
  if (acquisition == null) return null;
  const yrs = num(years, num(defaults?.defaults?.yearsOfOwnership, 5));
  return num(acquisition, 0) + yrs * totalCostPerYear(aircraft, hoursPerYear, defaults);
}
```

- [ ] **Step 4: Run tests to verify they pass**

```bash
npx vitest run src/lib/tco.test.js
```
Expected: all tests PASS.

- [ ] **Step 5: Commit**

```bash
git add src/lib/tco.js src/lib/tco.test.js
git commit -m "feat(comparables): add pure TCO math library"
```

---

## Task 3: Add useDocument helper to useFirestore

**Files:**
- Modify: `src/hooks/useFirestore.js`
- Modify: `src/hooks/useFirestore.test.js`

- [ ] **Step 1: Write the failing test**

Add to `src/hooks/useFirestore.test.js` (append to existing file, inside its `describe` block or as a new one — match the file's existing pattern):

```javascript
import { useDocument } from './useFirestore';
import { renderHook, waitFor } from '@testing-library/react';

describe('useDocument', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('returns the doc data when present', async () => {
    const onSnapshotMock = vi.fn((ref, cb) => {
      cb({ exists: () => true, id: 'global', data: () => ({ fuelPrice: { jetA1GbpPerGal: 7.8 } }) });
      return () => {};
    });
    vi.doMock('firebase/firestore', async (orig) => ({
      ...(await orig()),
      onSnapshot: onSnapshotMock,
      doc: vi.fn(() => ({})),
    }));
    const { result } = renderHook(() => useDocument('comparison_defaults', 'global'));
    await waitFor(() => expect(result.current.loading).toBe(false));
    expect(result.current.data).toEqual({ id: 'global', fuelPrice: { jetA1GbpPerGal: 7.8 } });
  });
});
```

> Note: existing `useFirestore.test.js` mocks differently — match the file's `vi.hoisted` pattern instead. Read the first 30 lines of the existing file before writing this test, and adapt to the file's existing mock setup. The assertion (loading flag flips, data shape `{ id, ...data }`) is what matters.

- [ ] **Step 2: Run test to verify it fails**

```bash
npx vitest run src/hooks/useFirestore.test.js
```
Expected: FAIL — `useDocument` not exported.

- [ ] **Step 3: Add useDocument hook**

Add to `src/hooks/useFirestore.js` (after the existing `useCollection` export):

```javascript
import { onSnapshot as _onSnapshot } from 'firebase/firestore';

/**
 * Subscribe to a single doc by collection + id.
 * Returns { data, loading, error }. data is { id, ...fields } or null if doc missing.
 */
export function useDocument(collectionName, id) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!collectionName || !id) {
      setLoading(false);
      return;
    }
    const ref = doc(db, collectionName, id);
    const unsub = onSnapshot(
      ref,
      (snap) => {
        if (snap.exists()) {
          setData({ id: snap.id, ...snap.data() });
        } else {
          setData(null);
        }
        setLoading(false);
      },
      (err) => {
        setError(err);
        setLoading(false);
      },
    );
    return unsub;
  }, [collectionName, id]);

  return { data, loading, error };
}
```

> Note: `onSnapshot` and `doc` are already imported at the top of `useFirestore.js`. The duplicate `import { onSnapshot as _onSnapshot }` line above is wrong — remove it. Just use the existing `onSnapshot` import.

- [ ] **Step 4: Run tests to verify they pass**

```bash
npx vitest run src/hooks/useFirestore.test.js
```
Expected: all tests PASS.

- [ ] **Step 5: Commit**

```bash
git add src/hooks/useFirestore.js src/hooks/useFirestore.test.js
git commit -m "feat(hooks): add useDocument helper for single-doc subscriptions"
```

---

## Task 4: useComparisonState hook (URL params)

**Files:**
- Create: `src/hooks/useComparisonState.js`
- Create: `src/hooks/useComparisonState.test.js`

- [ ] **Step 1: Write the failing test**

Create `src/hooks/useComparisonState.test.js`:

```javascript
import { describe, it, expect } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { useComparisonState } from './useComparisonState';

const wrapper = (initial) => ({ children }) => (
  <MemoryRouter initialEntries={[initial]}>{children}</MemoryRouter>
);

describe('useComparisonState', () => {
  it('parses ?models= as an array', () => {
    const { result } = renderHook(() => useComparisonState(), { wrapper: wrapper('/aircraft-comparison?models=r66,bell-505') });
    expect(result.current.selectedIds).toEqual(['r66', 'bell-505']);
  });

  it('parses ?hours and ?years as numbers', () => {
    const { result } = renderHook(() => useComparisonState(), { wrapper: wrapper('/aircraft-comparison?hours=200&years=7') });
    expect(result.current.hours).toBe(200);
    expect(result.current.years).toBe(7);
  });

  it('returns null for missing hours/years (caller falls back to defaults)', () => {
    const { result } = renderHook(() => useComparisonState(), { wrapper: wrapper('/aircraft-comparison') });
    expect(result.current.hours).toBeNull();
    expect(result.current.years).toBeNull();
    expect(result.current.selectedIds).toEqual([]);
  });

  it('addModel updates URL ?models param', () => {
    const { result } = renderHook(() => useComparisonState(), { wrapper: wrapper('/aircraft-comparison?models=r66') });
    act(() => result.current.addModel('bell-505'));
    expect(result.current.selectedIds).toEqual(['r66', 'bell-505']);
  });

  it('addModel caps at 3 selections', () => {
    const { result } = renderHook(() => useComparisonState(), { wrapper: wrapper('/aircraft-comparison?models=a,b,c') });
    act(() => result.current.addModel('d'));
    expect(result.current.selectedIds).toEqual(['a', 'b', 'c']);
  });

  it('removeModel drops the id', () => {
    const { result } = renderHook(() => useComparisonState(), { wrapper: wrapper('/aircraft-comparison?models=a,b,c') });
    act(() => result.current.removeModel('b'));
    expect(result.current.selectedIds).toEqual(['a', 'c']);
  });

  it('setHours updates URL', () => {
    const { result } = renderHook(() => useComparisonState(), { wrapper: wrapper('/aircraft-comparison') });
    act(() => result.current.setHours(150));
    expect(result.current.hours).toBe(150);
  });

  it('clearAll empties selection', () => {
    const { result } = renderHook(() => useComparisonState(), { wrapper: wrapper('/aircraft-comparison?models=a,b') });
    act(() => result.current.clearAll());
    expect(result.current.selectedIds).toEqual([]);
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

```bash
npx vitest run src/hooks/useComparisonState.test.js
```
Expected: FAIL — module not found.

- [ ] **Step 3: Implement the hook**

Create `src/hooks/useComparisonState.js`:

```javascript
import { useSearchParams } from 'react-router-dom';
import { useCallback, useMemo } from 'react';

const MAX_SELECTED = 3;

function parseNumberOrNull(v) {
  if (v === null || v === undefined || v === '') return null;
  const n = Number(v);
  return Number.isFinite(n) && n > 0 ? n : null;
}

export function useComparisonState() {
  const [params, setParams] = useSearchParams();

  const selectedIds = useMemo(() => {
    const raw = params.get('models');
    if (!raw) return [];
    return raw.split(',').map((s) => s.trim()).filter(Boolean);
  }, [params]);

  const hours = parseNumberOrNull(params.get('hours'));
  const years = parseNumberOrNull(params.get('years'));

  const update = useCallback(
    (mutator) => {
      setParams((prev) => {
        const next = new URLSearchParams(prev);
        mutator(next);
        return next;
      });
    },
    [setParams],
  );

  const addModel = useCallback(
    (id) => {
      if (!id) return;
      if (selectedIds.includes(id)) return;
      if (selectedIds.length >= MAX_SELECTED) return;
      const next = [...selectedIds, id];
      update((p) => p.set('models', next.join(',')));
    },
    [selectedIds, update],
  );

  const removeModel = useCallback(
    (id) => {
      const next = selectedIds.filter((x) => x !== id);
      update((p) => {
        if (next.length === 0) p.delete('models');
        else p.set('models', next.join(','));
      });
    },
    [selectedIds, update],
  );

  const clearAll = useCallback(() => {
    update((p) => p.delete('models'));
  }, [update]);

  const setHours = useCallback(
    (h) => {
      update((p) => {
        if (h == null) p.delete('hours');
        else p.set('hours', String(h));
      });
    },
    [update],
  );

  const setYears = useCallback(
    (y) => {
      update((p) => {
        if (y == null) p.delete('years');
        else p.set('years', String(y));
      });
    },
    [update],
  );

  return { selectedIds, hours, years, addModel, removeModel, clearAll, setHours, setYears, MAX_SELECTED };
}
```

- [ ] **Step 4: Run tests to verify they pass**

```bash
npx vitest run src/hooks/useComparisonState.test.js
```
Expected: all tests PASS.

- [ ] **Step 5: Commit**

```bash
git add src/hooks/useComparisonState.js src/hooks/useComparisonState.test.js
git commit -m "feat(comparables): add URL-state hook for selected models + TCO inputs"
```

---

## Task 5: ProvenanceBadge component

**Files:**
- Create: `src/components/AircraftComparison/ProvenanceBadge.jsx`

- [ ] **Step 1: Implement (no test — visual)**

Create `src/components/AircraftComparison/ProvenanceBadge.jsx`:

```jsx
export default function ProvenanceBadge({ confidence, source, lastUpdated }) {
  const isVerified = confidence === 'verified';
  const colors = isVerified
    ? { bg: '#e8f0e8', fg: '#2a652a' }
    : { bg: '#fff4e0', fg: '#a06a00' };
  const label = isVerified ? 'verified' : 'estimate';
  const tooltip = source ? `${source}${lastUpdated ? ` · ${lastUpdated}` : ''}` : label;

  return (
    <span
      title={tooltip}
      style={{
        display: 'inline-block',
        background: colors.bg,
        color: colors.fg,
        padding: '0.1rem 0.45rem',
        fontSize: '0.66rem',
        fontWeight: 600,
        borderRadius: '2px',
        textTransform: 'lowercase',
        letterSpacing: '0.02em',
      }}
    >
      {label}
    </span>
  );
}
```

- [ ] **Step 2: Commit**

```bash
git add src/components/AircraftComparison/ProvenanceBadge.jsx
git commit -m "feat(comparables): add ProvenanceBadge component"
```

---

## Task 6: ComparisonSelector component

**Files:**
- Create: `src/components/AircraftComparison/ComparisonSelector.jsx`

- [ ] **Step 1: Implement**

Create `src/components/AircraftComparison/ComparisonSelector.jsx`:

```jsx
import { useState, useMemo } from 'react';
import ProvenanceBadge from './ProvenanceBadge';
import { CLASSES } from '../../lib/comparablesSchema';

export default function ComparisonSelector({ comparables, selectedIds, onAdd, onRemove, max = 3 }) {
  const [searchQ, setSearchQ] = useState('');

  const robinsons = useMemo(
    () => comparables.filter((c) => c.isRobinson),
    [comparables],
  );

  const nonRobinsonResults = useMemo(() => {
    if (!searchQ.trim()) return [];
    const q = searchQ.trim().toLowerCase();
    return comparables
      .filter((c) => !c.isRobinson)
      .filter(
        (c) =>
          c.model?.toLowerCase().includes(q) ||
          c.displayName?.toLowerCase().includes(q) ||
          c.manufacturer?.toLowerCase().includes(q),
      );
  }, [comparables, searchQ]);

  const groupedResults = useMemo(() => {
    const groups = new Map(CLASSES.map((c) => [c.id, []]));
    for (const r of nonRobinsonResults) {
      if (groups.has(r.class)) groups.get(r.class).push(r);
    }
    return CLASSES.filter(({ id }) => groups.get(id).length).map(({ id, label }) => ({
      label,
      items: groups.get(id),
    }));
  }, [nonRobinsonResults]);

  const isSelected = (id) => selectedIds.includes(id);
  const atMax = selectedIds.length >= max;

  function handleChip(id) {
    if (isSelected(id)) onRemove(id);
    else if (!atMax) onAdd(id);
  }

  function handlePick(id) {
    setSearchQ('');
    if (!isSelected(id) && !atMax) onAdd(id);
  }

  return (
    <div className="comparison-selector">
      <div className="comparison-selector__group-label">Robinson lineup</div>
      <div className="comparison-selector__chips">
        {robinsons.map((r) => (
          <button
            key={r.id}
            type="button"
            onClick={() => handleChip(r.id)}
            disabled={!isSelected(r.id) && atMax}
            className={`comparison-selector__chip ${isSelected(r.id) ? 'is-selected' : ''}`}
          >
            {r.displayName || r.model}
            {isSelected(r.id) && <span aria-hidden="true"> ✓</span>}
          </button>
        ))}
      </div>

      <div className="comparison-selector__search-wrap">
        <input
          type="text"
          value={searchQ}
          onChange={(e) => setSearchQ(e.target.value)}
          placeholder="Compare against another aircraft (e.g. Bell 505, AS350)…"
          className="comparison-selector__search"
          aria-label="Search aircraft"
        />
        {groupedResults.length > 0 && (
          <div className="comparison-selector__dropdown" role="listbox">
            {groupedResults.map((group) => (
              <div key={group.label} className="comparison-selector__group">
                <div className="comparison-selector__group-heading">{group.label}</div>
                {group.items.map((c) => (
                  <button
                    key={c.id}
                    type="button"
                    role="option"
                    aria-selected={isSelected(c.id)}
                    disabled={isSelected(c.id) || atMax}
                    onClick={() => handlePick(c.id)}
                    className="comparison-selector__pick"
                  >
                    <span>{c.model}</span>
                    {c.marketStatus === 'used-only' && (
                      <span className="comparison-selector__used-tag">used market</span>
                    )}
                    <ProvenanceBadge confidence={c.costsConfidence} source={c.costsSource} />
                  </button>
                ))}
              </div>
            ))}
          </div>
        )}
      </div>

      {selectedIds.filter((id) => !robinsons.some((r) => r.id === id)).length > 0 && (
        <div className="comparison-selector__pills">
          {selectedIds
            .map((id) => comparables.find((c) => c.id === id))
            .filter((c) => c && !c.isRobinson)
            .map((c) => (
              <button
                key={c.id}
                type="button"
                onClick={() => onRemove(c.id)}
                className="comparison-selector__pill"
                aria-label={`Remove ${c.model}`}
              >
                {c.model} · <ProvenanceBadge confidence={c.costsConfidence} /> <span aria-hidden="true">✕</span>
              </button>
            ))}
        </div>
      )}

      {atMax && (
        <p className="comparison-selector__limit-note">Up to 3 aircraft. Remove one to add another.</p>
      )}
    </div>
  );
}
```

- [ ] **Step 2: Commit**

```bash
git add src/components/AircraftComparison/ComparisonSelector.jsx
git commit -m "feat(comparables): add ComparisonSelector with Robinson chips + search"
```

---

## Task 7: SpecsTable component

**Files:**
- Create: `src/components/AircraftComparison/SpecsTable.jsx`

- [ ] **Step 1: Implement**

Create `src/components/AircraftComparison/SpecsTable.jsx`:

```jsx
import ProvenanceBadge from './ProvenanceBadge';

const ROWS = [
  { label: 'Seats', path: 'specs.seats' },
  { label: 'Engine', path: 'specs.engine' },
  { label: 'Cruise speed', path: 'specs.cruiseSpeedKts', unit: 'kts' },
  { label: 'Max speed', path: 'specs.maxSpeedKts', unit: 'kts' },
  { label: 'Range', path: 'specs.rangeNm', unit: 'nm' },
  { label: 'Endurance', path: 'specs.enduranceHrs', unit: 'hrs' },
  { label: 'Useful load', path: 'specs.usefulLoadLbs', unit: 'lb', format: (v) => v?.toLocaleString() },
  { label: 'Fuel capacity', path: 'specs.fuelCapacityGal', unit: 'gal' },
  { label: 'Hover ceiling (IGE)', path: 'specs.hoverCeilingIgeFt', unit: 'ft', format: (v) => v?.toLocaleString() },
];

function getPath(obj, path) {
  return path.split('.').reduce((o, k) => (o == null ? undefined : o[k]), obj);
}

function fmt(value, row) {
  if (value == null) return '—';
  const formatted = row.format ? row.format(value) : value;
  return row.unit ? `${formatted} ${row.unit}` : formatted;
}

export default function SpecsTable({ aircraft }) {
  if (!aircraft.length) return null;
  return (
    <section className="comparison-section">
      <div className="comparison-section__label">Performance &amp; specifications</div>
      <div className="comparison-table-wrap">
        <table className="comparison-table">
          <thead>
            <tr>
              <th scope="col">Spec</th>
              {aircraft.map((a) => (
                <th key={a.id} scope="col">
                  <div className="comparison-table__head">
                    <span>{a.model}</span>
                    <ProvenanceBadge
                      confidence={a.costsConfidence}
                      source={a.costsSource}
                      lastUpdated={a.costsLastUpdated?.toDate?.()?.toISOString?.().slice(0, 10)}
                    />
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {ROWS.map((row) => (
              <tr key={row.path}>
                <th scope="row">{row.label}</th>
                {aircraft.map((a) => (
                  <td key={a.id}>{fmt(getPath(a, row.path), row)}</td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}
```

- [ ] **Step 2: Commit**

```bash
git add src/components/AircraftComparison/SpecsTable.jsx
git commit -m "feat(comparables): add SpecsTable component"
```

---

## Task 8: CostBreakdownTable component

**Files:**
- Create: `src/components/AircraftComparison/CostBreakdownTable.jsx`

- [ ] **Step 1: Implement**

Create `src/components/AircraftComparison/CostBreakdownTable.jsx`:

```jsx
import ProvenanceBadge from './ProvenanceBadge';
import { fuelCostPerHour, docPerHour, annualFixed } from '../../lib/tco';

const GBP = (v) => (v == null ? '—' : `£${Math.round(v).toLocaleString()}`);

export default function CostBreakdownTable({ aircraft, defaults, onReportMistake }) {
  if (!aircraft.length) return null;
  return (
    <section className="comparison-section">
      <div className="comparison-section__label">Cost breakdown</div>
      <div className="comparison-table-wrap">
        <table className="comparison-table">
          <thead>
            <tr>
              <th scope="col">Cost</th>
              {aircraft.map((a) => (
                <th key={a.id} scope="col">
                  <div className="comparison-table__head">
                    <span>{a.model}</span>
                    <ProvenanceBadge confidence={a.costsConfidence} source={a.costsSource} />
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            <tr className="comparison-table__group-row">
              <th scope="row" colSpan={aircraft.length + 1}>Per hour</th>
            </tr>
            <tr>
              <th scope="row">Fuel</th>
              {aircraft.map((a) => (
                <td key={a.id}>{GBP(fuelCostPerHour(a, defaults))}</td>
              ))}
            </tr>
            <tr>
              <th scope="row">Scheduled MX</th>
              {aircraft.map((a) => <td key={a.id}>{GBP(a.costsPerHour?.mxScheduled)}</td>)}
            </tr>
            <tr>
              <th scope="row">Engine reserve</th>
              {aircraft.map((a) => <td key={a.id}>{GBP(a.costsPerHour?.engineReserve)}</td>)}
            </tr>
            <tr>
              <th scope="row">Airframe reserve</th>
              {aircraft.map((a) => <td key={a.id}>{GBP(a.costsPerHour?.airframeReserve)}</td>)}
            </tr>
            <tr className="comparison-table__total-row">
              <th scope="row">Total per hour (DOC)</th>
              {aircraft.map((a) => <td key={a.id}>{GBP(docPerHour(a, defaults))}</td>)}
            </tr>

            <tr className="comparison-table__group-row">
              <th scope="row" colSpan={aircraft.length + 1}>Annual fixed</th>
            </tr>
            <tr>
              <th scope="row">Insurance</th>
              {aircraft.map((a) => <td key={a.id}>{GBP(a.costsAnnual?.insurance)}</td>)}
            </tr>
            <tr>
              <th scope="row">Annual inspection</th>
              {aircraft.map((a) => <td key={a.id}>{GBP(a.costsAnnual?.annualInspection)}</td>)}
            </tr>
            <tr>
              <th scope="row">Hangarage</th>
              {aircraft.map((a) => <td key={a.id}>{GBP(a.costsAnnual?.hangarage)}</td>)}
            </tr>
            <tr className="comparison-table__total-row">
              <th scope="row">Total annual fixed</th>
              {aircraft.map((a) => <td key={a.id}>{GBP(annualFixed(a))}</td>)}
            </tr>
          </tbody>
        </table>
      </div>
      <button type="button" className="comparison-section__report-link" onClick={() => onReportMistake?.()}>
        Spot a mistake?
      </button>
    </section>
  );
}
```

- [ ] **Step 2: Commit**

```bash
git add src/components/AircraftComparison/CostBreakdownTable.jsx
git commit -m "feat(comparables): add CostBreakdownTable with per-hour and annual groups"
```

---

## Task 9: TCOSummary component

**Files:**
- Create: `src/components/AircraftComparison/TCOSummary.jsx`

- [ ] **Step 1: Implement**

Create `src/components/AircraftComparison/TCOSummary.jsx`:

```jsx
import { multiYearTCO, totalCostPerYear } from '../../lib/tco';

const GBP_LARGE = (v) => {
  if (v == null) return '—';
  if (v >= 1_000_000) return `£${(v / 1_000_000).toFixed(2)}M`;
  if (v >= 1_000) return `£${Math.round(v / 1000)}k`;
  return `£${Math.round(v)}`;
};

export default function TCOSummary({ aircraft, hours, years, defaults, onChangeHours, onChangeYears, onReportMistake }) {
  if (!aircraft.length) return null;
  const effectiveHours = hours ?? defaults?.defaults?.hoursPerYear ?? 100;
  const effectiveYears = years ?? defaults?.defaults?.yearsOfOwnership ?? 5;

  return (
    <section className="comparison-section comparison-section--tco">
      <div className="comparison-section__head">
        <div className="comparison-section__label">{effectiveYears}-year total cost of ownership</div>
        <div className="comparison-section__controls">
          <label>
            Hours/yr
            <input
              type="number"
              min={10}
              max={1000}
              step={10}
              value={effectiveHours}
              onChange={(e) => onChangeHours(Number(e.target.value) || null)}
            />
          </label>
          <label>
            Years
            <input
              type="number"
              min={1}
              max={20}
              step={1}
              value={effectiveYears}
              onChange={(e) => onChangeYears(Number(e.target.value) || null)}
            />
          </label>
        </div>
      </div>

      <div className="tco-cards">
        {aircraft.map((a) => {
          const tco = multiYearTCO(a, effectiveHours, effectiveYears, defaults);
          const annualOp = totalCostPerYear(a, effectiveHours, defaults);
          const acquisition = a.acquisition?.priceNewGbp;
          const usedRange = a.acquisition?.priceUsedRangeGbp;
          return (
            <div key={a.id} className="tco-card">
              <div className="tco-card__name">{a.model}</div>
              <div className="tco-card__total">{GBP_LARGE(tco)}</div>
              <div className="tco-card__caption">
                {tco == null && usedRange ? (
                  <>used market only · {GBP_LARGE(usedRange.low)}–{GBP_LARGE(usedRange.high)}</>
                ) : (
                  <>before resale · incl. {GBP_LARGE(acquisition)} acquisition · {GBP_LARGE(annualOp)}/yr operating</>
                )}
              </div>
            </div>
          );
        })}
      </div>

      <button type="button" className="comparison-section__report-link" onClick={() => onReportMistake?.()}>
        Spot a mistake?
      </button>
    </section>
  );
}
```

- [ ] **Step 2: Commit**

```bash
git add src/components/AircraftComparison/TCOSummary.jsx
git commit -m "feat(comparables): add TCOSummary cards with hrs/yrs inputs"
```

---

## Task 10: ReportMistakeModal component

**Files:**
- Create: `src/components/AircraftComparison/ReportMistakeModal.jsx`

- [ ] **Step 1: Implement**

Create `src/components/AircraftComparison/ReportMistakeModal.jsx`:

```jsx
import { useState, useEffect } from 'react';

const FIELD_OPTIONS = [
  { value: 'fuelBurnGph', label: 'Fuel burn (gph)' },
  { value: 'mxScheduled', label: 'Scheduled MX (£/hr)' },
  { value: 'engineReserve', label: 'Engine reserve (£/hr)' },
  { value: 'airframeReserve', label: 'Airframe reserve (£/hr)' },
  { value: 'insurance', label: 'Insurance (£/yr)' },
  { value: 'annualInspection', label: 'Annual inspection (£/yr)' },
  { value: 'hangarage', label: 'Hangarage (£/yr)' },
  { value: 'priceNewGbp', label: 'New price (£)' },
  { value: 'priceUsedRangeGbp', label: 'Used market range (£)' },
  { value: 'specs', label: 'Performance specs' },
  { value: 'other', label: 'Something else' },
];

export default function ReportMistakeModal({ open, aircraft, defaultAircraftId, onClose }) {
  const [aircraftId, setAircraftId] = useState(defaultAircraftId || '');
  const [field, setField] = useState('insurance');
  const [suggested, setSuggested] = useState('');
  const [message, setMessage] = useState('');
  const [email, setEmail] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    if (open && defaultAircraftId) setAircraftId(defaultAircraftId);
  }, [open, defaultAircraftId]);

  if (!open) return null;

  async function handleSubmit(e) {
    e.preventDefault();
    setSubmitting(true);
    try {
      const res = await fetch('/api/leads', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          source: 'comparison-mistake-report',
          aircraftId,
          field,
          suggestedValue: suggested || null,
          message,
          email: email || null,
        }),
      });
      if (!res.ok) throw new Error(`Submit failed: ${res.status}`);
      setSubmitted(true);
    } catch (err) {
      console.error('Mistake-report submit error', err);
      alert("Couldn't submit right now — please try again, or use the Talk to our team form.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="report-mistake__backdrop" role="dialog" aria-modal="true" aria-labelledby="report-mistake-title" onClick={onClose}>
      <div className="report-mistake__modal" onClick={(e) => e.stopPropagation()}>
        <div className="report-mistake__head">
          <div>
            <h3 id="report-mistake-title">Spot a mistake?</h3>
            <p className="report-mistake__subtitle">Tell us what you think is wrong — we'll review it.</p>
          </div>
          <button type="button" onClick={onClose} aria-label="Close" className="report-mistake__close">✕</button>
        </div>

        {submitted ? (
          <div className="report-mistake__thanks">
            <p>Thanks — we'll review your correction and update the data if it checks out.</p>
            <button type="button" className="report-mistake__btn-primary" onClick={onClose}>Close</button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="report-mistake__form">
            <label>
              Aircraft
              <select value={aircraftId} onChange={(e) => setAircraftId(e.target.value)} required>
                <option value="">Select aircraft…</option>
                {aircraft.map((a) => (
                  <option key={a.id} value={a.id}>{a.model}</option>
                ))}
              </select>
            </label>
            <label>
              Field
              <select value={field} onChange={(e) => setField(e.target.value)} required>
                {FIELD_OPTIONS.map((o) => (
                  <option key={o.value} value={o.value}>{o.label}</option>
                ))}
              </select>
            </label>
            <label>
              What should it be? <span className="report-mistake__optional">(optional)</span>
              <input type="text" value={suggested} onChange={(e) => setSuggested(e.target.value)} placeholder="e.g. £18,000" />
            </label>
            <label>
              Your source / context
              <textarea value={message} onChange={(e) => setMessage(e.target.value)} required minLength={3} rows={3} placeholder="What you're seeing differently. Sources welcome but not required." />
            </label>
            <label>
              Email <span className="report-mistake__optional">(optional — only if you want a reply)</span>
              <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@example.com" />
            </label>
            <div className="report-mistake__actions">
              <button type="button" onClick={onClose} className="report-mistake__btn-secondary" disabled={submitting}>Cancel</button>
              <button type="submit" className="report-mistake__btn-primary" disabled={submitting || !aircraftId || !message.trim()}>
                {submitting ? 'Submitting…' : 'Submit correction'}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
```

- [ ] **Step 2: Commit**

```bash
git add src/components/AircraftComparison/ReportMistakeModal.jsx
git commit -m "feat(comparables): add ReportMistakeModal posting to /api/leads"
```

---

## Task 11: ComparisonCTA component

**Files:**
- Create: `src/components/AircraftComparison/ComparisonCTA.jsx`

- [ ] **Step 1: Implement**

Create `src/components/AircraftComparison/ComparisonCTA.jsx`:

```jsx
import { useState } from 'react';

export default function ComparisonCTA({ selectedAircraft }) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState(null);

  async function handleSubmit(e) {
    e.preventDefault();
    setSubmitting(true);
    setError(null);
    try {
      const res = await fetch('/api/leads', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          source: 'comparison-tool',
          name,
          email,
          message,
          aircraftIds: selectedAircraft.map((a) => a.id),
        }),
      });
      if (!res.ok) throw new Error(`Submit failed: ${res.status}`);
      setSubmitted(true);
    } catch (err) {
      console.error('CTA submit error', err);
      setError("Couldn't submit right now. Please try again or call us.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <section className="comparison-cta">
      <div className="comparison-cta__copy">
        <div className="comparison-cta__eyebrow">Want a tailored ownership analysis?</div>
        <p>Our team can match these public estimates against real UK operator data and your flying profile.</p>
      </div>

      {submitted ? (
        <p className="comparison-cta__thanks">Thanks — we'll be in touch within one working day.</p>
      ) : (
        <form className="comparison-cta__form" onSubmit={handleSubmit}>
          <input type="text" required placeholder="Your name" value={name} onChange={(e) => setName(e.target.value)} />
          <input type="email" required placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} />
          <textarea required placeholder="What you're trying to figure out" value={message} onChange={(e) => setMessage(e.target.value)} rows={2} />
          <button type="submit" disabled={submitting}>{submitting ? 'Sending…' : 'Talk to our team →'}</button>
          {error && <p className="comparison-cta__error">{error}</p>}
        </form>
      )}
    </section>
  );
}
```

- [ ] **Step 2: Commit**

```bash
git add src/components/AircraftComparison/ComparisonCTA.jsx
git commit -m "feat(comparables): add ComparisonCTA form posting to /api/leads"
```

---

## Task 12: AircraftComparison page (orchestrator)

**Files:**
- Create: `src/pages/AircraftComparison.jsx`

- [ ] **Step 1: Implement**

Create `src/pages/AircraftComparison.jsx`:

```jsx
import { useState, useMemo } from 'react';
import { Helmet } from 'react-helmet-async';
import { useCollection, useDocument } from '../hooks/useFirestore';
import { useComparisonState } from '../hooks/useComparisonState';
import ComparisonSelector from '../components/AircraftComparison/ComparisonSelector';
import SpecsTable from '../components/AircraftComparison/SpecsTable';
import CostBreakdownTable from '../components/AircraftComparison/CostBreakdownTable';
import TCOSummary from '../components/AircraftComparison/TCOSummary';
import ComparisonCTA from '../components/AircraftComparison/ComparisonCTA';
import ReportMistakeModal from '../components/AircraftComparison/ReportMistakeModal';
import FinalDraftHeader from '../components/FinalDraftHeader';
import FinalFooter from '../components/FinalFooter';
import '../assets/css/main.css';
import '../assets/css/components.css';

export default function AircraftComparison() {
  const { docs: comparables, loading } = useCollection('comparables');
  const { data: defaults } = useDocument('comparison_defaults', 'global');
  const { selectedIds, hours, years, addModel, removeModel, setHours, setYears } = useComparisonState();
  const [reportOpen, setReportOpen] = useState(false);
  const [reportAircraftId, setReportAircraftId] = useState(null);

  const selectedAircraft = useMemo(
    () => selectedIds.map((id) => comparables.find((c) => c.id === id)).filter(Boolean),
    [comparables, selectedIds],
  );

  function openReport(id) {
    setReportAircraftId(id || selectedAircraft[0]?.id || '');
    setReportOpen(true);
  }

  return (
    <>
      <Helmet>
        <title>Aircraft Comparison · HQ Aviation</title>
        <meta
          name="description"
          content="Honest spec, cost, and ownership data for UK helicopter buyers. Robinson figures from HQ's own MX records; other manufacturers from publicly sourced industry data, clearly labelled."
        />
      </Helmet>

      <FinalDraftHeader />

      <main className="aircraft-comparison">
        <header className="aircraft-comparison__hero">
          <div className="aircraft-comparison__eyebrow">Decision Tool</div>
          <h1>Compare <span className="aircraft-comparison__hero-em">Aircraft</span></h1>
          <p className="aircraft-comparison__intro">
            Honest spec, cost, and ownership data. Robinson figures from HQ's own MX records;
            other manufacturers from publicly sourced industry data, clearly labelled.
          </p>
        </header>

        {loading ? (
          <div className="aircraft-comparison__loading">Loading aircraft data…</div>
        ) : comparables.length === 0 ? (
          <div className="aircraft-comparison__error">
            Couldn't load aircraft data — please refresh, or call our team.
          </div>
        ) : (
          <>
            <ComparisonSelector
              comparables={comparables}
              selectedIds={selectedIds}
              onAdd={addModel}
              onRemove={removeModel}
            />

            {selectedAircraft.length === 0 ? (
              <div className="aircraft-comparison__placeholder">
                Select two or more aircraft above to start comparing.
              </div>
            ) : selectedAircraft.length === 1 ? (
              <>
                <SpecsTable aircraft={selectedAircraft} />
                <p className="aircraft-comparison__placeholder">
                  Add another aircraft to see cost and TCO comparison.
                </p>
              </>
            ) : (
              <>
                <SpecsTable aircraft={selectedAircraft} />
                <CostBreakdownTable
                  aircraft={selectedAircraft}
                  defaults={defaults}
                  onReportMistake={() => openReport()}
                />
                <TCOSummary
                  aircraft={selectedAircraft}
                  hours={hours}
                  years={years}
                  defaults={defaults}
                  onChangeHours={setHours}
                  onChangeYears={setYears}
                  onReportMistake={() => openReport()}
                />
                <ComparisonCTA selectedAircraft={selectedAircraft} />
              </>
            )}

            <details className="aircraft-comparison__methodology">
              <summary>Sources &amp; methodology</summary>
              <div className="aircraft-comparison__methodology-body">
                <p>
                  Robinson cost figures are sourced from HQ Aviation's internal MX records.
                  Other manufacturers' figures are estimates compiled from publicly available
                  sources (POH, factory operating-cost documents, broker listings, industry
                  surveys) and clearly badged "estimate."
                </p>
                <p>
                  TCO is calculated as: <em>acquisition price + (years × (annual fixed costs + hours/yr × direct operating cost/hr))</em>.
                  Resale value is not subtracted. Hangarage figures vary widely; many home-based
                  owners pay £0.
                </p>
                <p className="aircraft-comparison__fuel-assumption">
                  Fuel-price assumption: Avgas 100LL £{defaults?.fuelPrice?.avgas100llGbpPerGal ?? '—'}/gal,
                  Jet A-1 £{defaults?.fuelPrice?.jetA1GbpPerGal ?? '—'}/gal.
                </p>
                <ul>
                  {comparables.map((c) => (
                    <li key={c.id}>
                      <strong>{c.model}:</strong> {c.costsSource} ({c.costsConfidence})
                    </li>
                  ))}
                </ul>
              </div>
            </details>
          </>
        )}

        <ReportMistakeModal
          open={reportOpen}
          aircraft={selectedAircraft.length ? selectedAircraft : comparables}
          defaultAircraftId={reportAircraftId}
          onClose={() => setReportOpen(false)}
        />
      </main>

      <FinalFooter />
    </>
  );
}
```

> Note: Verify `FinalDraftHeader` and `FinalFooter` are the right header/footer components for public pages. If not, mirror whatever `/sales/new` uses.

- [ ] **Step 2: Commit**

```bash
git add src/pages/AircraftComparison.jsx
git commit -m "feat(comparables): add AircraftComparison public page"
```

---

## Task 13: Add CSS for the comparison page

**Files:**
- Modify: `src/assets/css/components.css` (or add inline `<style>` block in `AircraftComparison.jsx` if existing pattern preferred)

- [ ] **Step 1: Add CSS**

Append to `src/assets/css/components.css`:

```css
/* === Aircraft Comparison Tool === */
.aircraft-comparison { max-width: 1100px; margin: 0 auto; padding: 0 1.25rem 4rem; }
.aircraft-comparison__hero { padding: 3rem 0 2rem; text-align: center; border-bottom: 1px solid #e8e6e2; }
.aircraft-comparison__eyebrow { font-size: 0.7rem; letter-spacing: 0.18em; text-transform: uppercase; color: #888; margin-bottom: 0.6rem; }
.aircraft-comparison__hero h1 { font-size: 2.4rem; font-weight: 300; margin: 0 0 0.8rem; letter-spacing: -0.02em; }
.aircraft-comparison__hero-em { font-weight: 700; }
.aircraft-comparison__intro { max-width: 36rem; margin: 0 auto; opacity: 0.72; line-height: 1.55; }

.aircraft-comparison__loading,
.aircraft-comparison__error,
.aircraft-comparison__placeholder {
  padding: 3rem 1rem; text-align: center; opacity: 0.6; font-size: 0.95rem;
}
.aircraft-comparison__error { color: #a02020; }

/* Selector */
.comparison-selector { padding: 1.5rem 0; border-bottom: 1px solid #f0f0f0; }
.comparison-selector__group-label { font-size: 0.7rem; letter-spacing: 0.1em; text-transform: uppercase; opacity: 0.6; margin-bottom: 0.6rem; }
.comparison-selector__chips { display: flex; gap: 0.45rem; flex-wrap: wrap; margin-bottom: 1.1rem; }
.comparison-selector__chip {
  background: #fff; border: 1px solid #ccc; padding: 0.45rem 0.85rem;
  font-size: 0.86rem; cursor: pointer; border-radius: 2px; font-family: inherit;
  transition: all 0.15s;
}
.comparison-selector__chip:hover:not(:disabled) { border-color: #222; }
.comparison-selector__chip.is-selected { background: #222; color: #fff; border-color: #222; }
.comparison-selector__chip:disabled { opacity: 0.4; cursor: not-allowed; }

.comparison-selector__search-wrap { position: relative; }
.comparison-selector__search {
  width: 100%; padding: 0.65rem 0.85rem; font-size: 0.9rem;
  background: #fafaf6; border: 1px solid #e0e0e0; border-radius: 2px;
  font-family: inherit;
}
.comparison-selector__search:focus { outline: none; border-color: #888; }
.comparison-selector__dropdown {
  position: absolute; top: calc(100% + 4px); left: 0; right: 0;
  background: #fff; border: 1px solid #e0e0e0; border-radius: 2px;
  max-height: 360px; overflow-y: auto; z-index: 5;
  box-shadow: 0 4px 18px rgba(0,0,0,0.06);
}
.comparison-selector__group { padding: 0.4rem 0; border-bottom: 1px solid #f5f5f5; }
.comparison-selector__group:last-child { border-bottom: none; }
.comparison-selector__group-heading {
  font-size: 0.62rem; letter-spacing: 0.1em; text-transform: uppercase;
  opacity: 0.55; padding: 0.3rem 0.85rem;
}
.comparison-selector__pick {
  width: 100%; text-align: left; background: none; border: none;
  padding: 0.55rem 0.85rem; font-size: 0.86rem; font-family: inherit;
  cursor: pointer; display: flex; align-items: center; gap: 0.55rem;
}
.comparison-selector__pick:hover:not(:disabled) { background: #fafaf6; }
.comparison-selector__pick:disabled { opacity: 0.4; cursor: not-allowed; }
.comparison-selector__used-tag {
  font-size: 0.66rem; opacity: 0.55; font-style: italic;
}
.comparison-selector__pills { display: flex; gap: 0.4rem; flex-wrap: wrap; margin-top: 0.7rem; }
.comparison-selector__pill {
  background: #222; color: #fff; border: none; padding: 0.3rem 0.65rem;
  font-size: 0.8rem; cursor: pointer; border-radius: 2px;
  display: inline-flex; align-items: center; gap: 0.35rem; font-family: inherit;
}
.comparison-selector__limit-note { margin-top: 0.5rem; font-size: 0.78rem; opacity: 0.6; }

/* Comparison sections (specs, cost, tco) */
.comparison-section { padding: 2rem 0; border-bottom: 1px solid #f0f0f0; }
.comparison-section__label { font-size: 0.7rem; letter-spacing: 0.1em; text-transform: uppercase; opacity: 0.6; margin-bottom: 0.8rem; }
.comparison-section__head { display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.8rem; flex-wrap: wrap; gap: 1rem; }
.comparison-section__controls { display: flex; gap: 1rem; }
.comparison-section__controls label { display: inline-flex; flex-direction: column; font-size: 0.7rem; opacity: 0.7; gap: 0.2rem; }
.comparison-section__controls input { padding: 0.4rem 0.55rem; font-size: 0.95rem; border: 1px solid #ccc; border-radius: 2px; width: 5.5rem; font-family: inherit; }
.comparison-section__report-link {
  background: none; border: none; padding: 0.5rem 0;
  font-size: 0.78rem; color: #888; cursor: pointer; text-decoration: underline;
  font-family: inherit; margin-top: 0.4rem;
}
.comparison-section__report-link:hover { color: #222; }

/* Comparison table */
.comparison-table-wrap { overflow-x: auto; }
.comparison-table { width: 100%; border-collapse: collapse; font-size: 0.88rem; background: #fafaf6; border: 1px solid #e8e6e2; }
.comparison-table thead th { background: #222; color: #fff; padding: 0.55rem 0.75rem; text-align: left; font-weight: 500; font-size: 0.82rem; }
.comparison-table tbody th[scope="row"] { padding: 0.55rem 0.75rem; opacity: 0.6; font-weight: 400; text-align: left; background: #fafaf6; position: sticky; left: 0; min-width: 9rem; }
.comparison-table td { padding: 0.55rem 0.75rem; border-top: 1px solid #f0f0f0; }
.comparison-table tbody th[scope="row"] { border-top: 1px solid #f0f0f0; }
.comparison-table__group-row th { background: #f0eee8 !important; font-size: 0.7rem !important; text-transform: uppercase; letter-spacing: 0.06em; opacity: 0.7 !important; padding: 0.35rem 0.75rem !important; }
.comparison-table__total-row td, .comparison-table__total-row th { font-weight: 600; background: #f4f2ec; }
.comparison-table__head { display: flex; flex-direction: column; align-items: flex-start; gap: 0.25rem; }

/* TCO cards */
.comparison-section--tco { background: #f8f8f6; padding-left: 1rem; padding-right: 1rem; margin: 1rem -1rem; }
.tco-cards { display: grid; grid-template-columns: repeat(auto-fit, minmax(180px, 1fr)); gap: 0.75rem; }
.tco-card { background: #fff; border: 1px solid #e5e5e5; padding: 1rem; border-radius: 2px; }
.tco-card__name { font-size: 0.78rem; opacity: 0.6; margin-bottom: 0.3rem; }
.tco-card__total { font-size: 1.6rem; font-weight: 700; line-height: 1; }
.tco-card__caption { font-size: 0.72rem; opacity: 0.6; margin-top: 0.5rem; line-height: 1.4; }

/* CTA */
.comparison-cta { background: #222; color: #fff; padding: 2rem 1.5rem; margin: 2rem 0; border-radius: 2px; display: grid; grid-template-columns: 1fr 1fr; gap: 2rem; }
.comparison-cta__eyebrow { font-size: 0.75rem; opacity: 0.7; margin-bottom: 0.4rem; }
.comparison-cta__copy p { margin: 0; line-height: 1.5; }
.comparison-cta__form { display: grid; gap: 0.5rem; }
.comparison-cta__form input,
.comparison-cta__form textarea { padding: 0.55rem 0.7rem; font-size: 0.9rem; background: rgba(255,255,255,0.1); border: 1px solid rgba(255,255,255,0.2); color: #fff; border-radius: 2px; font-family: inherit; }
.comparison-cta__form button { padding: 0.7rem 1rem; background: #fff; color: #222; border: none; font-weight: 600; cursor: pointer; border-radius: 2px; font-family: inherit; }
.comparison-cta__error { color: #f8b8b8; font-size: 0.85rem; margin: 0; }
.comparison-cta__thanks { font-size: 0.95rem; align-self: center; }

/* Methodology accordion */
.aircraft-comparison__methodology { padding: 2rem 0; font-size: 0.88rem; }
.aircraft-comparison__methodology summary { cursor: pointer; font-size: 0.78rem; opacity: 0.6; }
.aircraft-comparison__methodology-body { padding: 1rem 0; line-height: 1.55; }
.aircraft-comparison__methodology-body ul { padding-left: 1.2rem; }
.aircraft-comparison__methodology-body li { margin-bottom: 0.3rem; }
.aircraft-comparison__fuel-assumption { font-size: 0.82rem; opacity: 0.7; margin: 0.5rem 0 1rem; }

/* Report-mistake modal */
.report-mistake__backdrop { position: fixed; inset: 0; background: rgba(0,0,0,0.4); display: flex; align-items: center; justify-content: center; z-index: 1000; padding: 1rem; }
.report-mistake__modal { background: #fff; max-width: 30rem; width: 100%; padding: 1.5rem; border-radius: 4px; }
.report-mistake__head { display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 1rem; }
.report-mistake__head h3 { margin: 0; font-size: 1.05rem; }
.report-mistake__subtitle { margin: 0.2rem 0 0; opacity: 0.65; font-size: 0.78rem; }
.report-mistake__close { background: none; border: none; font-size: 1.4rem; cursor: pointer; opacity: 0.5; }
.report-mistake__form { display: grid; gap: 0.7rem; }
.report-mistake__form label { display: grid; gap: 0.2rem; font-size: 0.72rem; opacity: 0.75; }
.report-mistake__form input,
.report-mistake__form select,
.report-mistake__form textarea { padding: 0.5rem 0.65rem; font-size: 0.88rem; border: 1px solid #ccc; border-radius: 2px; font-family: inherit; }
.report-mistake__optional { opacity: 0.6; font-weight: 400; }
.report-mistake__actions { display: flex; justify-content: flex-end; gap: 0.5rem; margin-top: 0.5rem; }
.report-mistake__btn-primary { background: #222; color: #fff; border: none; padding: 0.55rem 1.1rem; font-size: 0.85rem; cursor: pointer; border-radius: 2px; font-family: inherit; font-weight: 600; }
.report-mistake__btn-secondary { background: #fff; color: #222; border: 1px solid #ccc; padding: 0.55rem 1.1rem; font-size: 0.85rem; cursor: pointer; border-radius: 2px; font-family: inherit; }
.report-mistake__thanks { padding: 1rem 0; }
.report-mistake__thanks p { margin: 0 0 1rem; }

/* Mobile */
@media (max-width: 700px) {
  .aircraft-comparison__hero h1 { font-size: 1.7rem; }
  .comparison-cta { grid-template-columns: 1fr; }
  .comparison-section__head { flex-direction: column; align-items: stretch; }
  .comparison-table tbody th[scope="row"] { min-width: 7rem; }
}
```

- [ ] **Step 2: Commit**

```bash
git add src/assets/css/components.css
git commit -m "feat(comparables): add styles for /aircraft-comparison page"
```

---

## Task 14: Wire public route in App.jsx

**Files:**
- Modify: `src/App.jsx`

- [ ] **Step 1: Add import**

In `src/App.jsx`, add this import alongside the other page imports (around line 100):

```javascript
import AircraftComparison from './pages/AircraftComparison';
```

- [ ] **Step 2: Add route**

In `src/App.jsx`, find the public routes block (around line 199 — `<Route path="/sales/new" element={<Sales />} />`) and add this line directly after:

```jsx
<Route path="/aircraft-comparison" element={<AircraftComparison />} />
```

- [ ] **Step 3: Smoke test in dev**

Run:
```bash
npm run dev
```

Navigate to `http://localhost:<port>/aircraft-comparison`. Expected: page renders with hero + selector. Without seed data the catalog is empty (will show in Task 19+) but the page itself should not crash.

- [ ] **Step 4: Commit**

```bash
git add src/App.jsx
git commit -m "feat(comparables): wire /aircraft-comparison public route"
```

---

## Task 15: Update firestore.rules

**Files:**
- Modify: `firestore.rules`

- [ ] **Step 1: Add rules**

Open `firestore.rules`. Find the closing `}` of the inner `match /databases/{database}/documents` block (around line 254 — just before the `// Misc marketplace` block ends and the outer `}` closes). Insert these two blocks alongside the existing collection rules (e.g., right after the `match /listings/{id}` block around line 211):

```
    // Aircraft comparables — public read, admin write
    match /comparables/{id} {
      allow read: if true;
      allow write: if isAdmin();
    }

    // Comparison defaults singleton (fuel prices etc.) — public read, admin write
    match /comparison_defaults/{id} {
      allow read: if true;
      allow write: if isAdmin();
    }
```

- [ ] **Step 2: Deploy rules (manual step — note in commit)**

The deploy step is a manual operations task once the feature is ready:

```bash
firebase deploy --only firestore:rules
```

Note in commit message that deploy is manual.

- [ ] **Step 3: Commit**

```bash
git add firestore.rules
git commit -m "feat(comparables): add Firestore rules for comparables + defaults

Public read on both; admin write. Deploy with: firebase deploy --only firestore:rules"
```

---

## Task 16: AdminComparables list page

**Files:**
- Create: `src/pages/admin/AdminComparables.jsx`

- [ ] **Step 1: Implement**

Create `src/pages/admin/AdminComparables.jsx`:

```jsx
import { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import AdminLayout from '../../components/admin/AdminLayout';
import { useCollection, deleteDocById, updateDocById, useDocument, createDoc } from '../../hooks/useFirestore';
import { setDoc, doc, serverTimestamp } from 'firebase/firestore';
import { db } from '../../lib/firebase';
import { CLASSES, CONFIDENCE, MARKET_STATUS } from '../../lib/comparablesSchema';

function ProvenancePill({ confidence }) {
  const isVerified = confidence === 'verified';
  return (
    <span style={{
      background: isVerified ? '#e8f0e8' : '#fff4e0',
      color: isVerified ? '#2a652a' : '#a06a00',
      padding: '0.1rem 0.45rem',
      fontSize: '0.7rem',
      fontWeight: 600,
      borderRadius: '2px',
    }}>
      {confidence || 'estimate'}
    </span>
  );
}

function DefaultsModal({ open, defaults, onClose }) {
  const [avgas, setAvgas] = useState(defaults?.fuelPrice?.avgas100llGbpPerGal ?? 8.5);
  const [jet, setJet] = useState(defaults?.fuelPrice?.jetA1GbpPerGal ?? 7.8);
  const [hours, setHours] = useState(defaults?.defaults?.hoursPerYear ?? 100);
  const [years, setYears] = useState(defaults?.defaults?.yearsOfOwnership ?? 5);
  const [saving, setSaving] = useState(false);

  if (!open) return null;

  async function handleSave() {
    setSaving(true);
    try {
      const ref = doc(db, 'comparison_defaults', 'global');
      await setDoc(ref, {
        fuelPrice: {
          avgas100llGbpPerGal: Number(avgas),
          jetA1GbpPerGal: Number(jet),
        },
        defaults: {
          hoursPerYear: Number(hours),
          yearsOfOwnership: Number(years),
        },
        updatedAt: serverTimestamp(),
      });
      onClose();
    } finally {
      setSaving(false);
    }
  }

  return (
    <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.4)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 100 }} onClick={onClose}>
      <div style={{ background: '#fff', padding: '1.5rem', maxWidth: '24rem', width: '100%', borderRadius: '6px' }} onClick={(e) => e.stopPropagation()}>
        <h3 style={{ margin: 0, marginBottom: '0.4rem' }}>Comparison defaults</h3>
        <p style={{ fontSize: '0.78rem', opacity: 0.6, marginTop: 0 }}>
          Editing fuel prices recomputes TCO for every aircraft on /aircraft-comparison instantly.
        </p>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.6rem' }}>
          <label style={{ fontSize: '0.7rem', opacity: 0.7 }}>
            Avgas 100LL £/gal
            <input type="number" step="0.01" value={avgas} onChange={(e) => setAvgas(e.target.value)} style={{ width: '100%', padding: '0.4rem', marginTop: '0.2rem' }} />
          </label>
          <label style={{ fontSize: '0.7rem', opacity: 0.7 }}>
            Jet A-1 £/gal
            <input type="number" step="0.01" value={jet} onChange={(e) => setJet(e.target.value)} style={{ width: '100%', padding: '0.4rem', marginTop: '0.2rem' }} />
          </label>
          <label style={{ fontSize: '0.7rem', opacity: 0.7 }}>
            Default hours/yr
            <input type="number" value={hours} onChange={(e) => setHours(e.target.value)} style={{ width: '100%', padding: '0.4rem', marginTop: '0.2rem' }} />
          </label>
          <label style={{ fontSize: '0.7rem', opacity: 0.7 }}>
            Default years
            <input type="number" value={years} onChange={(e) => setYears(e.target.value)} style={{ width: '100%', padding: '0.4rem', marginTop: '0.2rem' }} />
          </label>
        </div>
        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.4rem', marginTop: '1rem' }}>
          <button onClick={onClose} style={{ background: '#fff', border: '1px solid #ccc', padding: '0.5rem 0.9rem', cursor: 'pointer' }}>Cancel</button>
          <button onClick={handleSave} disabled={saving} style={{ background: '#222', color: '#fff', border: 'none', padding: '0.5rem 0.9rem', cursor: 'pointer' }}>
            {saving ? 'Saving…' : 'Save'}
          </button>
        </div>
      </div>
    </div>
  );
}

export default function AdminComparables() {
  const { docs: comparables, loading } = useCollection('comparables', 'manufacturer');
  const { data: defaults } = useDocument('comparison_defaults', 'global');
  const [filterClass, setFilterClass] = useState('');
  const [filterSource, setFilterSource] = useState('');
  const [filterStatus, setFilterStatus] = useState('');
  const [defaultsOpen, setDefaultsOpen] = useState(false);
  const [deleting, setDeleting] = useState(null);

  const rows = useMemo(() => {
    return comparables.filter((c) => {
      if (filterClass && c.class !== filterClass) return false;
      if (filterSource && c.costsConfidence !== filterSource) return false;
      if (filterStatus && c.marketStatus !== filterStatus) return false;
      return true;
    });
  }, [comparables, filterClass, filterSource, filterStatus]);

  async function handleDelete(id, model) {
    if (!window.confirm(`Delete ${model}?\n\nThe aircraft disappears from /aircraft-comparison. Inbound URL links with this slug will silently break.`)) return;
    setDeleting(id);
    try {
      await deleteDocById('comparables', id);
    } finally {
      setDeleting(null);
    }
  }

  return (
    <AdminLayout>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
        <div>
          <h1 style={{ fontSize: '1.5rem', fontWeight: 700, color: '#111827', margin: 0 }}>Comparables</h1>
          <p style={{ fontSize: '0.78rem', color: '#6b7280', margin: '0.2rem 0 0' }}>
            Aircraft data shown on /aircraft-comparison · {comparables.length} aircraft
          </p>
        </div>
        <div style={{ display: 'flex', gap: '0.4rem' }}>
          <button onClick={() => setDefaultsOpen(true)} style={{ background: '#fff', border: '1px solid #ccc', color: '#222', padding: '0.5rem 1rem', borderRadius: '6px', fontSize: '0.875rem', cursor: 'pointer' }}>
            ⚙ Edit defaults
          </button>
          <Link to="/admin/comparables/new" style={{ background: '#111827', color: '#fff', padding: '0.5rem 1rem', borderRadius: '6px', textDecoration: 'none', fontSize: '0.875rem', fontWeight: 600 }}>
            + Add aircraft
          </Link>
        </div>
      </div>

      <div style={{ display: 'flex', gap: '0.6rem', marginBottom: '1rem', fontSize: '0.85rem' }}>
        <select value={filterClass} onChange={(e) => setFilterClass(e.target.value)}>
          <option value="">All classes</option>
          {CLASSES.map((c) => <option key={c.id} value={c.id}>{c.label}</option>)}
        </select>
        <select value={filterSource} onChange={(e) => setFilterSource(e.target.value)}>
          <option value="">All sources</option>
          {CONFIDENCE.map((c) => <option key={c} value={c}>{c}</option>)}
        </select>
        <select value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)}>
          <option value="">All statuses</option>
          {MARKET_STATUS.map((s) => <option key={s} value={s}>{s}</option>)}
        </select>
      </div>

      {loading ? <p style={{ color: '#6b7280' }}>Loading…</p> : rows.length === 0 ? (
        <p style={{ color: '#6b7280' }}>No aircraft yet — add one to get started.</p>
      ) : (
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.875rem' }}>
            <thead>
              <tr style={{ borderBottom: '2px solid #e5e7eb' }}>
                {['Model', 'Manufacturer', 'Class', 'Status', 'Source', 'Last updated', ''].map((h) => (
                  <th key={h} style={{ padding: '0.7rem 1rem', textAlign: 'left', color: '#374151', fontWeight: 600 }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {rows.map((c) => (
                <tr key={c.id} style={{ borderBottom: '1px solid #f3f4f6' }}>
                  <td style={{ padding: '0.6rem 1rem', fontWeight: 500 }}>{c.model}</td>
                  <td style={{ padding: '0.6rem 1rem', color: '#6b7280' }}>{c.manufacturer}</td>
                  <td style={{ padding: '0.6rem 1rem', color: '#6b7280' }}>
                    {CLASSES.find((cls) => cls.id === c.class)?.label || c.class}
                  </td>
                  <td style={{ padding: '0.6rem 1rem', color: '#6b7280', fontSize: '0.78rem' }}>
                    {c.marketStatus === 'used-only' ? 'Used only' : 'In production'}
                  </td>
                  <td style={{ padding: '0.6rem 1rem' }}><ProvenancePill confidence={c.costsConfidence} /></td>
                  <td style={{ padding: '0.6rem 1rem', color: '#6b7280', fontSize: '0.78rem' }}>
                    {c.updatedAt?.toDate ? c.updatedAt.toDate().toISOString().slice(0, 10) : '—'}
                  </td>
                  <td style={{ padding: '0.6rem 1rem', whiteSpace: 'nowrap' }}>
                    <Link to={`/admin/comparables/${c.id}`} style={{ color: '#2563eb', textDecoration: 'none', marginRight: '1rem', fontWeight: 500 }}>Edit</Link>
                    <button onClick={() => handleDelete(c.id, c.model)} disabled={deleting === c.id} style={{ background: 'none', border: 'none', color: '#dc2626', cursor: 'pointer', fontWeight: 500, fontSize: '0.875rem' }}>
                      {deleting === c.id ? 'Deleting…' : 'Delete'}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <DefaultsModal open={defaultsOpen} defaults={defaults} onClose={() => setDefaultsOpen(false)} />
    </AdminLayout>
  );
}
```

> Note: `useCollection('comparables', 'manufacturer')` — the existing `useCollection` orders by a field. If `manufacturer` doesn't have a Firestore composite index issue, this works. If Firestore complains in dev, fall back to ordering by `createdAt` and sorting client-side by manufacturer.

- [ ] **Step 2: Commit**

```bash
git add src/pages/admin/AdminComparables.jsx
git commit -m "feat(admin): add /admin/comparables list page with filters and defaults modal"
```

---

## Task 17: AdminComparableEdit form page

**Files:**
- Create: `src/pages/admin/AdminComparableEdit.jsx`

- [ ] **Step 1: Implement**

Create `src/pages/admin/AdminComparableEdit.jsx`:

```jsx
import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import AdminLayout from '../../components/admin/AdminLayout';
import { doc, getDoc, setDoc, deleteDoc, serverTimestamp, Timestamp } from 'firebase/firestore';
import { db } from '../../lib/firebase';
import { CLASSES, FUEL_TYPES, CONFIDENCE, MARKET_STATUS, validateComparable, isUsedOnly } from '../../lib/comparablesSchema';

const EMPTY = {
  manufacturer: '',
  model: '',
  displayName: '',
  class: 'light-piston',
  marketStatus: 'in-production',
  isRobinson: false,
  fuelType: 'avgas-100ll',
  imagePath: '',
  specs: { seats: '', engine: '', maxSpeedKts: '', cruiseSpeedKts: '', rangeNm: '', enduranceHrs: '', usefulLoadLbs: '', fuelCapacityGal: '', hoverCeilingIgeFt: '' },
  costsPerHour: { fuelBurnGph: '', mxScheduled: '', engineReserve: '', airframeReserve: '' },
  costsAnnual: { insurance: '', annualInspection: '', hangarage: '' },
  acquisition: { priceNewGbp: '', priceUsedRangeGbp: { low: '', high: '' } },
  costsSource: '',
  costsConfidence: 'estimate',
};

function slugify(s) {
  return s.toLowerCase().trim().replace(/[^a-z0-9-]+/g, '-').replace(/^-+|-+$/g, '');
}

function asNumber(v) {
  if (v === '' || v === null || v === undefined) return null;
  const n = Number(v);
  return Number.isFinite(n) ? n : null;
}

function coerceForSave(form) {
  return {
    manufacturer: form.manufacturer.trim(),
    model: form.model.trim(),
    displayName: form.displayName.trim(),
    class: form.class,
    marketStatus: form.marketStatus,
    isRobinson: !!form.isRobinson,
    fuelType: form.fuelType,
    imagePath: form.imagePath.trim() || null,
    specs: {
      seats: asNumber(form.specs.seats),
      engine: form.specs.engine?.trim() || null,
      maxSpeedKts: asNumber(form.specs.maxSpeedKts),
      cruiseSpeedKts: asNumber(form.specs.cruiseSpeedKts),
      rangeNm: asNumber(form.specs.rangeNm),
      enduranceHrs: asNumber(form.specs.enduranceHrs),
      usefulLoadLbs: asNumber(form.specs.usefulLoadLbs),
      fuelCapacityGal: asNumber(form.specs.fuelCapacityGal),
      hoverCeilingIgeFt: asNumber(form.specs.hoverCeilingIgeFt),
    },
    costsPerHour: {
      fuelBurnGph: asNumber(form.costsPerHour.fuelBurnGph),
      mxScheduled: asNumber(form.costsPerHour.mxScheduled),
      engineReserve: asNumber(form.costsPerHour.engineReserve),
      airframeReserve: asNumber(form.costsPerHour.airframeReserve),
    },
    costsAnnual: {
      insurance: asNumber(form.costsAnnual.insurance),
      annualInspection: asNumber(form.costsAnnual.annualInspection),
      hangarage: asNumber(form.costsAnnual.hangarage),
    },
    acquisition: {
      priceNewGbp: asNumber(form.acquisition.priceNewGbp),
      priceUsedRangeGbp: {
        low: asNumber(form.acquisition.priceUsedRangeGbp.low),
        high: asNumber(form.acquisition.priceUsedRangeGbp.high),
      },
    },
    costsSource: form.costsSource.trim(),
    costsConfidence: form.costsConfidence,
  };
}

const inputStyle = { padding: '0.45rem 0.6rem', fontSize: '0.86rem', border: '1px solid #ccc', borderRadius: '3px', width: '100%', fontFamily: 'inherit' };
const labelStyle = { display: 'flex', flexDirection: 'column', gap: '0.2rem', fontSize: '0.7rem', opacity: 0.7 };

export default function AdminComparableEdit() {
  const navigate = useNavigate();
  const { id: routeId } = useParams();
  const isNew = routeId === 'new';
  const [form, setForm] = useState(EMPTY);
  const [docId, setDocId] = useState('');
  const [loading, setLoading] = useState(!isNew);
  const [saving, setSaving] = useState(false);
  const [errors, setErrors] = useState([]);

  useEffect(() => {
    if (isNew) return;
    let cancelled = false;
    (async () => {
      const ref = doc(db, 'comparables', routeId);
      const snap = await getDoc(ref);
      if (cancelled) return;
      if (snap.exists()) {
        const data = snap.data();
        setForm({
          ...EMPTY,
          ...data,
          specs: { ...EMPTY.specs, ...(data.specs || {}) },
          costsPerHour: { ...EMPTY.costsPerHour, ...(data.costsPerHour || {}) },
          costsAnnual: { ...EMPTY.costsAnnual, ...(data.costsAnnual || {}) },
          acquisition: {
            ...EMPTY.acquisition,
            ...(data.acquisition || {}),
            priceUsedRangeGbp: { ...EMPTY.acquisition.priceUsedRangeGbp, ...(data.acquisition?.priceUsedRangeGbp || {}) },
          },
        });
        setDocId(routeId);
      }
      setLoading(false);
    })();
    return () => { cancelled = true; };
  }, [routeId, isNew]);

  function setField(path, value) {
    setForm((f) => {
      const parts = path.split('.');
      const next = { ...f };
      let cursor = next;
      for (let i = 0; i < parts.length - 1; i++) {
        cursor[parts[i]] = { ...cursor[parts[i]] };
        cursor = cursor[parts[i]];
      }
      cursor[parts[parts.length - 1]] = value;
      return next;
    });
  }

  async function handleSave() {
    setErrors([]);
    const id = isNew ? slugify(docId || form.model) : routeId;
    if (!id) {
      setErrors(['Slug / Doc ID is required']);
      return;
    }
    const payload = { id, ...coerceForSave(form) };
    const validationErrors = validateComparable(payload);
    if (validationErrors.length) {
      setErrors(validationErrors);
      return;
    }
    setSaving(true);
    try {
      if (isNew) {
        const existing = await getDoc(doc(db, 'comparables', id));
        if (existing.exists()) {
          setErrors([`Slug "${id}" already exists — choose a different slug.`]);
          setSaving(false);
          return;
        }
      }
      const { id: _, ...toWrite } = payload;
      await setDoc(doc(db, 'comparables', id), {
        ...toWrite,
        costsLastUpdated: serverTimestamp(),
        updatedAt: serverTimestamp(),
        ...(isNew ? { createdAt: serverTimestamp() } : {}),
      }, { merge: false });
      navigate('/admin/comparables');
    } catch (err) {
      console.error('Save failed', err);
      setErrors([`Save failed: ${err.message}`]);
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete() {
    if (isNew) return;
    if (!window.confirm(`Delete ${form.model}?\n\nInbound URL links with slug "${routeId}" will silently break.`)) return;
    await deleteDoc(doc(db, 'comparables', routeId));
    navigate('/admin/comparables');
  }

  if (loading) return <AdminLayout><p>Loading…</p></AdminLayout>;

  return (
    <AdminLayout>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
        <div>
          <div style={{ fontSize: '0.72rem', opacity: 0.6, textTransform: 'uppercase', letterSpacing: '0.06em' }}>Comparables / {isNew ? 'Add' : 'Edit'}</div>
          <h1 style={{ fontSize: '1.4rem', margin: '0.2rem 0 0' }}>{form.model || 'New aircraft'}</h1>
        </div>
        <div style={{ display: 'flex', gap: '0.4rem' }}>
          {!isNew && (
            <button onClick={handleDelete} style={{ background: '#fff', border: '1px solid #f0c5c5', color: '#a02020', padding: '0.5rem 1rem', borderRadius: '6px', cursor: 'pointer' }}>
              Delete
            </button>
          )}
          <button onClick={handleSave} disabled={saving} style={{ background: '#222', color: '#fff', border: 'none', padding: '0.5rem 1.1rem', borderRadius: '6px', fontWeight: 600, cursor: 'pointer' }}>
            {saving ? 'Saving…' : 'Save changes'}
          </button>
        </div>
      </div>

      {errors.length > 0 && (
        <div style={{ background: '#fff0f0', border: '1px solid #f5c6c6', padding: '0.75rem 1rem', borderRadius: '4px', marginBottom: '1rem' }}>
          <div style={{ fontWeight: 600, color: '#a02020', marginBottom: '0.3rem' }}>Validation issues</div>
          <ul style={{ margin: 0, paddingLeft: '1.2rem' }}>
            {errors.map((e, i) => <li key={i} style={{ color: '#a02020', fontSize: '0.85rem' }}>{e}</li>)}
          </ul>
        </div>
      )}

      <div style={{ background: '#fff', padding: '1.25rem', borderRadius: '6px' }}>
        <SectionLabel>Identification</SectionLabel>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '0.6rem' }}>
          <label style={labelStyle}>Doc ID (slug) {isNew ? '' : '(locked)'}
            <input style={inputStyle} value={isNew ? docId : routeId} onChange={(e) => isNew && setDocId(slugify(e.target.value))} disabled={!isNew} placeholder="e.g. r66-turbine" />
          </label>
          <label style={labelStyle}>Manufacturer
            <input style={inputStyle} value={form.manufacturer} onChange={(e) => setField('manufacturer', e.target.value)} />
          </label>
          <label style={labelStyle}>Display name (chip label)
            <input style={inputStyle} value={form.displayName} onChange={(e) => setField('displayName', e.target.value)} />
          </label>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr 1fr', gap: '0.6rem', marginTop: '0.6rem' }}>
          <label style={labelStyle}>Model
            <input style={inputStyle} value={form.model} onChange={(e) => setField('model', e.target.value)} />
          </label>
          <label style={labelStyle}>Class
            <select style={inputStyle} value={form.class} onChange={(e) => setField('class', e.target.value)}>
              {CLASSES.map((c) => <option key={c.id} value={c.id}>{c.label}</option>)}
            </select>
          </label>
          <label style={labelStyle}>Status
            <select style={inputStyle} value={form.marketStatus} onChange={(e) => setField('marketStatus', e.target.value)}>
              {MARKET_STATUS.map((s) => <option key={s} value={s}>{s}</option>)}
            </select>
          </label>
          <label style={labelStyle}>Fuel type
            <select style={inputStyle} value={form.fuelType} onChange={(e) => setField('fuelType', e.target.value)}>
              {FUEL_TYPES.map((f) => <option key={f} value={f}>{f}</option>)}
            </select>
          </label>
        </div>
        <div style={{ marginTop: '0.6rem', display: 'flex', gap: '1rem', fontSize: '0.85rem' }}>
          <label style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem' }}>
            <input type="checkbox" checked={form.isRobinson} onChange={(e) => setField('isRobinson', e.target.checked)} />
            isRobinson (show as chip on public page)
          </label>
        </div>

        <SectionLabel>Performance specs</SectionLabel>
        <Grid cols={5}>
          <NumField label="Seats" value={form.specs.seats} onChange={(v) => setField('specs.seats', v)} />
          <TextField label="Engine" value={form.specs.engine} onChange={(v) => setField('specs.engine', v)} />
          <NumField label="Max speed (kts)" value={form.specs.maxSpeedKts} onChange={(v) => setField('specs.maxSpeedKts', v)} />
          <NumField label="Cruise (kts)" value={form.specs.cruiseSpeedKts} onChange={(v) => setField('specs.cruiseSpeedKts', v)} />
          <NumField label="Range (nm)" value={form.specs.rangeNm} onChange={(v) => setField('specs.rangeNm', v)} />
          <NumField label="Endurance (hrs)" step="0.1" value={form.specs.enduranceHrs} onChange={(v) => setField('specs.enduranceHrs', v)} />
          <NumField label="Useful load (lb)" value={form.specs.usefulLoadLbs} onChange={(v) => setField('specs.usefulLoadLbs', v)} />
          <NumField label="Fuel cap (gal)" step="0.1" value={form.specs.fuelCapacityGal} onChange={(v) => setField('specs.fuelCapacityGal', v)} />
          <NumField label="Hover ceiling IGE (ft)" value={form.specs.hoverCeilingIgeFt} onChange={(v) => setField('specs.hoverCeilingIgeFt', v)} />
        </Grid>

        <SectionLabel>Costs — per hour (£)</SectionLabel>
        <Grid cols={4}>
          <NumField label="Fuel burn (gph)" step="0.1" value={form.costsPerHour.fuelBurnGph} onChange={(v) => setField('costsPerHour.fuelBurnGph', v)} />
          <NumField label="Scheduled MX" value={form.costsPerHour.mxScheduled} onChange={(v) => setField('costsPerHour.mxScheduled', v)} />
          <NumField label="Engine reserve" value={form.costsPerHour.engineReserve} onChange={(v) => setField('costsPerHour.engineReserve', v)} />
          <NumField label="Airframe reserve" value={form.costsPerHour.airframeReserve} onChange={(v) => setField('costsPerHour.airframeReserve', v)} />
        </Grid>

        <SectionLabel>Costs — annual fixed (£)</SectionLabel>
        <Grid cols={3}>
          <NumField label="Insurance" value={form.costsAnnual.insurance} onChange={(v) => setField('costsAnnual.insurance', v)} />
          <NumField label="Annual inspection" value={form.costsAnnual.annualInspection} onChange={(v) => setField('costsAnnual.annualInspection', v)} />
          <NumField label="Hangarage" value={form.costsAnnual.hangarage} onChange={(v) => setField('costsAnnual.hangarage', v)} />
        </Grid>

        <SectionLabel>Acquisition (£)</SectionLabel>
        <Grid cols={3}>
          <NumField label={`Price new ${isUsedOnly(form) ? '(n/a — used only)' : ''}`} value={form.acquisition.priceNewGbp} onChange={(v) => setField('acquisition.priceNewGbp', v)} disabled={isUsedOnly(form)} />
          <NumField label="Used range — low" value={form.acquisition.priceUsedRangeGbp.low} onChange={(v) => setField('acquisition.priceUsedRangeGbp.low', v)} />
          <NumField label="Used range — high" value={form.acquisition.priceUsedRangeGbp.high} onChange={(v) => setField('acquisition.priceUsedRangeGbp.high', v)} />
        </Grid>

        <SectionLabel>Provenance</SectionLabel>
        <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '0.6rem' }}>
          <label style={labelStyle}>Source description
            <input style={inputStyle} value={form.costsSource} onChange={(e) => setField('costsSource', e.target.value)} placeholder='e.g. "HQ internal MX records, fleet of 8"' />
          </label>
          <label style={labelStyle}>Confidence
            <select style={inputStyle} value={form.costsConfidence} onChange={(e) => setField('costsConfidence', e.target.value)}>
              {CONFIDENCE.map((c) => <option key={c} value={c}>{c}</option>)}
            </select>
          </label>
        </div>
      </div>
    </AdminLayout>
  );
}

function SectionLabel({ children }) {
  return <div style={{ fontSize: '0.66rem', letterSpacing: '0.1em', textTransform: 'uppercase', color: '#666', margin: '1.4rem 0 0.55rem' }}>{children}</div>;
}
function Grid({ cols, children }) {
  return <div style={{ display: 'grid', gridTemplateColumns: `repeat(${cols}, 1fr)`, gap: '0.5rem' }}>{children}</div>;
}
function NumField({ label, value, onChange, step = '1', disabled }) {
  return (
    <label style={labelStyle}>{label}
      <input type="number" step={step} style={inputStyle} value={value ?? ''} disabled={disabled} onChange={(e) => onChange(e.target.value)} />
    </label>
  );
}
function TextField({ label, value, onChange }) {
  return (
    <label style={labelStyle}>{label}
      <input style={inputStyle} value={value ?? ''} onChange={(e) => onChange(e.target.value)} />
    </label>
  );
}
```

- [ ] **Step 2: Commit**

```bash
git add src/pages/admin/AdminComparableEdit.jsx
git commit -m "feat(admin): add AdminComparableEdit form page"
```

---

## Task 18: Add admin routes and sidebar nav item

**Files:**
- Modify: `src/App.jsx`
- Modify: `src/components/admin/AdminLayout.jsx`

- [ ] **Step 1: Add admin route imports to App.jsx**

In `src/App.jsx`, after the existing admin imports (around line 120), add:

```javascript
import AdminComparables from './pages/admin/AdminComparables';
import AdminComparableEdit from './pages/admin/AdminComparableEdit';
```

- [ ] **Step 2: Add admin routes to App.jsx**

Find the admin routes block (search for `/admin/listings` — around line 239-240) and add these two lines directly after the listings routes:

```jsx
<Route path="/admin/comparables" element={<AdminRoute><AdminComparables /></AdminRoute>} />
<Route path="/admin/comparables/:id" element={<AdminRoute><AdminComparableEdit /></AdminRoute>} />
```

- [ ] **Step 3: Add sidebar nav item**

Open `src/components/admin/AdminLayout.jsx`. Find the `NAV_ITEMS` array (around line 7-22). Insert this entry between the `Listings` and `Misc Items` entries (so it falls naturally between aircraft-related items):

```javascript
{ to: '/admin/comparables', icon: '🚁', label: 'Comparables' },
```

The full updated array should look like:

```javascript
const NAV_ITEMS = [
  { to: '/admin', icon: '📊', label: 'Dashboard' },
  { to: '/admin/bookings', icon: '🎟️', label: 'Bookings' },
  { to: '/admin/listings', icon: '✈️', label: 'Listings' },
  { to: '/admin/comparables', icon: '🚁', label: 'Comparables' },
  { to: '/admin/misc', icon: '🛒', label: 'Misc Items' },
  { to: '/admin/misc-marketplace', icon: '🛍️', label: 'Marketplace' },
  // ...rest unchanged
];
```

- [ ] **Step 4: Smoke test**

Run `npm run dev`. Navigate to `/admin/comparables` (must be logged in as admin). Expected:
- Sidebar shows Comparables tab between Listings and Misc Items
- Page renders the empty list view
- "+ Add aircraft" button navigates to `/admin/comparables/new` and shows the empty edit form
- "⚙ Edit defaults" opens the modal

- [ ] **Step 5: Commit**

```bash
git add src/App.jsx src/components/admin/AdminLayout.jsx
git commit -m "feat(admin): wire /admin/comparables routes + sidebar nav"
```

---

## Task 19: Seed initial Robinson data (one-off, gitignored)

**Files:**
- Create: `scripts/seed-comparables.js` (gitignored — local dev only)
- Modify: `.gitignore`

- [ ] **Step 1: Add to .gitignore**

Append to `.gitignore`:

```
scripts/seed-comparables.js
```

- [ ] **Step 2: Create the seed script**

Create `scripts/seed-comparables.js` (NOT committed). This loads the data from `docs/superpowers/research/2026-04-25-comparables-*.md` into Firestore. The script is a manual operations tool — run once to seed initial data. The Robinson data should be reviewed against HQ's internal MX records before running.

```javascript
// One-off data seeder. NOT committed to git. Run via: node scripts/seed-comparables.js
//
// Reads research findings (docs/superpowers/research/2026-04-25-comparables-*.md)
// and produces Firestore writes. The owner must review and adjust each aircraft's
// numbers — especially the Robinsons against HQ's internal MX records — before
// running.

import { initializeApp, cert } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';
import { readFileSync } from 'node:fs';

const app = initializeApp({
  credential: cert({
    projectId: process.env.FIREBASE_PROJECT_ID,
    clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
    privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
  }),
});
const db = getFirestore(app);

// Owner: edit each aircraft below against the research findings before running.
// Robinson figures MUST be verified against HQ MX records.
const SEED = [
  {
    id: 'r66-turbine',
    manufacturer: 'Robinson',
    model: 'R66 Turbine',
    displayName: 'R66',
    class: 'light-turbine',
    marketStatus: 'in-production',
    isRobinson: true,
    fuelType: 'jet-a1',
    imagePath: '/assets/images/aircraft/r66.jpg',
    specs: { seats: 5, engine: 'Rolls-Royce RR300', maxSpeedKts: 140, cruiseSpeedKts: 120, rangeNm: 350, enduranceHrs: 3.0, usefulLoadLbs: 1270, fuelCapacityGal: 73.3, hoverCeilingIgeFt: 10000 },
    costsPerHour: { fuelBurnGph: 23, mxScheduled: 95, engineReserve: 80, airframeReserve: 35 },
    costsAnnual: { insurance: 18000, annualInspection: 4500, hangarage: 8000 },
    acquisition: { priceNewGbp: 1085000, priceUsedRangeGbp: { low: 800000, high: 1050000 } },
    costsSource: 'Robinson factory price list (2025) + HQ internal MX records (TODO: HQ to verify)',
    costsConfidence: 'verified',
  },
  // …add other aircraft from the research findings here…
];

const DEFAULTS = {
  fuelPrice: { avgas100llGbpPerGal: 8.50, jetA1GbpPerGal: 7.80 },
  defaults: { hoursPerYear: 100, yearsOfOwnership: 5 },
};

async function run() {
  console.log(`Seeding ${SEED.length} aircraft to comparables…`);
  for (const a of SEED) {
    const { id, ...rest } = a;
    await db.collection('comparables').doc(id).set({
      ...rest,
      costsLastUpdated: new Date(),
      createdAt: new Date(),
      updatedAt: new Date(),
    });
    console.log(`  ✓ ${a.model}`);
  }
  console.log('Seeding defaults…');
  await db.collection('comparison_defaults').doc('global').set({
    ...DEFAULTS,
    updatedAt: new Date(),
  });
  console.log('Done.');
  process.exit(0);
}

run().catch((err) => {
  console.error(err);
  process.exit(1);
});
```

The owner manually fills in the rest of the SEED array from the four research files, adjusting Robinson figures against HQ's internal data.

- [ ] **Step 3: Run the seeder (manual, when ready)**

This is a manual operations step, not part of the feature commit:

```bash
# Requires .env loaded with FIREBASE_PROJECT_ID, FIREBASE_CLIENT_EMAIL, FIREBASE_PRIVATE_KEY
node scripts/seed-comparables.js
```

- [ ] **Step 4: Commit gitignore update**

```bash
git add .gitignore
git commit -m "chore: gitignore seed-comparables.js (manual ops script)"
```

---

## Task 20: Manual smoke test

This is a manual checklist, not a git commit. After all prior tasks ship, run the dev server and verify each item.

```bash
npm run dev
```

- [ ] **Public page — empty selector state**
  - Navigate to `/aircraft-comparison`
  - Hero + intro copy renders
  - Robinson chips visible
  - "Compare against another aircraft" search input present
  - Placeholder text shown below: "Select two or more aircraft above…"
  - Methodology accordion shows even with empty selection

- [ ] **Public page — single Robinson selection**
  - Click R66 chip
  - URL updates to `?models=r66-turbine`
  - Spec table renders with R66 column + "verified" badge
  - Cost breakdown and TCO sections hidden
  - Prompt to add another aircraft shown

- [ ] **Public page — two-aircraft comparison**
  - Type "bell" in search → dropdown shows Bell 505 + Bell 206 grouped under Light Turbine
  - Click Bell 505 → URL updates to `?models=r66-turbine,bell-505`
  - Bell 505 appears as a removable pill below the search
  - Spec table now has 3 columns (label + R66 + Bell 505)
  - Cost breakdown shows per-hour and annual fixed groups
  - DOC/hr and Annual fixed totals appear
  - TCO summary shows two cards with 5-year totals
  - "Spot a mistake?" link appears under cost breakdown and TCO summary
  - CTA strip shows below

- [ ] **Public page — TCO inputs**
  - Change Hours/yr from 100 → 200
  - URL updates to include `&hours=200`
  - TCO numbers recalculate live
  - Refresh page — same numbers persist

- [ ] **Public page — report-a-mistake modal**
  - Click "Spot a mistake?"
  - Modal opens with aircraft pre-selected
  - Submit with a test message → Network tab shows POST /api/leads with `source: "comparison-mistake-report"`
  - Thank-you state shown
  - Close modal

- [ ] **Public page — CTA**
  - Fill name, email, message, submit
  - Network tab shows POST /api/leads with `source: "comparison-tool"` and `aircraftIds` array
  - Thank-you message replaces the form

- [ ] **Public page — used-only aircraft**
  - Search "Bell 206", select it
  - TCO card shows "used market only · £X–£Y" instead of total

- [ ] **Public page — bad URL**
  - Visit `/aircraft-comparison?models=foo,bar,r66-turbine`
  - Page renders with only R66 selected (foo and bar silently dropped)

- [ ] **Public page — mobile (DevTools, 375px)**
  - Hero + selector legible
  - Chip rail wraps cleanly
  - Cost / specs tables horizontal-scroll
  - TCO cards stack vertically

- [ ] **Admin — list page**
  - Navigate to `/admin/comparables`
  - "Comparables" tab visible in sidebar between Listings and Misc Items
  - Table shows all aircraft with manufacturer / class / source / last-updated
  - Filter dropdowns work
  - "⚙ Edit defaults" opens modal showing current fuel prices

- [ ] **Admin — create new aircraft**
  - Click "+ Add aircraft"
  - Form is empty
  - Type a model name → slug auto-fills below it (lowercased, hyphenated)
  - Fill required fields, click Save
  - Returns to list page; new aircraft appears

- [ ] **Admin — edit existing**
  - Click Edit on an existing row
  - Form pre-fills with current values
  - Slug field is locked (disabled)
  - Change a cost number, save
  - Public page (refresh) reflects the new number live in cost breakdown + TCO

- [ ] **Admin — validation errors**
  - Try saving with manufacturer empty → red validation panel appears with "manufacturer is required"

- [ ] **Admin — delete confirmation**
  - Click Delete → confirm dialog warns about inbound URL breakage
  - Confirm → aircraft disappears from public page on next read

---

## Self-Review

This section was completed during plan authoring; recording results inline.

**Spec coverage:** Walked each spec section against the task list:
- §1 Context/intent → Task 12 (page hero copy + framing)
- §2 Catalog scope → Task 19 (seed data)
- §3 Data model → Tasks 1, 2, 19 (schema + math + seed)
- §4 Architecture → Tasks 1–18 collectively
- §5 UI/UX → Tasks 5–13 (components + CSS)
- §6 Admin → Tasks 16–18
- §7 Resilience → Tasks 2 (defensive coercion), 12 (loading/error states), 1 (validation), 17 (validation panel)
- §8 Out of scope → not built ✓
- §9 Open questions → flagged as research output (Task 19 needs HQ adjustments before run)
- §11 Effort estimate → matches the 20 tasks above

**Placeholder scan:** Searched for TBD/TODO/etc. The `// …add other aircraft from the research findings here…` comment in Task 19 is intentional — it's documenting that the owner manually fills the seed array from research. Acceptable because the action is explicit.

**Type consistency:** Verified `costsLastUpdated`, `costsConfidence`, and the schema field names match across schema, page, admin form, seed script, and tests. `comparison_defaults/global` consistently used for the singleton.

**Ambiguity check:** The spec said "settings/comparison-defaults"; this plan amends to `comparison_defaults/global` (top-level collection) to avoid the existing `match /settings/{settingId}` rule conflict that requires auth for read. Documented at top of plan.

---

## Execution Handoff

**Plan complete and saved to `docs/superpowers/plans/2026-04-26-aircraft-comparison-tool.md`. Two execution options:**

**1. Subagent-Driven (recommended)** — I dispatch a fresh subagent per task, review between tasks, fast iteration. Best for a 20-task plan where most tasks are independent and reviewable in isolation.

**2. Inline Execution** — Execute tasks in this session using executing-plans, batch execution with checkpoints. Slower but you watch every step.

**Which approach?**

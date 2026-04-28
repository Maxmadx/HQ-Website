# Rebuilds Admin Pricing Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Move the three rebuild model prices on `/rebuilds` (Rebuild From + donor min/max for R22, R44, R66) into Firestore, editable from `/admin/pricing`.

**Architecture:** New `rebuilds` category in `AdminPricing` writing to the existing `pricing` collection (GBP pence, nine doc IDs). New `useRebuildPricing` hook mirrors `useAircraftPricing` (5-min module cache, fallback to defaults). Hardcoded defaults move out of `Rebuilds.jsx` into a shared `src/config/rebuildPricingDefaults.js` module so admin and the hook share a single source of truth.

**Tech Stack:** React 19, Firebase Firestore, Vitest.

---

## File Structure

- **Create** `src/config/rebuildPricingDefaults.js` — single export `REBUILD_PRICING_DEFAULTS` (array of nine entries: id, modelKey, field, label, defaultGbp).
- **Create** `src/hooks/useRebuildPricing.js` — `useRebuildPricing()` hook + `getRebuildPrices(modelKey)` function. Reads `pricing` collection once with module-level 5-min cache.
- **Create** `src/hooks/useRebuildPricing.test.js` — vitest unit test for the hook fallback + override behaviour.
- **Modify** `src/pages/admin/AdminPricing.jsx` — add `rebuilds` category, nine IDs in `GBP_WEBSITE_IDS`, default-row branch in `grouped`, seed-rebuilds button.
- **Modify** `src/pages/Rebuilds.jsx` — remove hardcoded `rebuildFrom`/`donorEstimate` from `rebuildModels`, add `modelKey`, call `useRebuildPricing` in component body, format strings inline.

---

## Task 1: Create the defaults module

**Files:**
- Create: `src/config/rebuildPricingDefaults.js`

- [ ] **Step 1: Write the module**

```js
/**
 * Source-of-truth defaults for rebuild pricing.
 *
 * Both AdminPricing (for default rows + seeding) and useRebuildPricing
 * (for fallback when no Firestore override exists) read from this list.
 *
 * Values are whole GBP pounds. Conversion to pence happens at the
 * Firestore boundary (×100 on write, ÷100 on read).
 *
 * Doc IDs follow `rebuild_{modelKey}_{field}`. Add a new entry here AND
 * add its id to GBP_WEBSITE_IDS in AdminPricing.jsx if you add a model.
 */
export const REBUILD_PRICING_DEFAULTS = [
  { id: 'rebuild_r22_from',      modelKey: 'r22', field: 'from',     label: 'R22 Beta II — Rebuild From',  defaultGbp:  55000 },
  { id: 'rebuild_r22_donor_min', modelKey: 'r22', field: 'donorMin', label: 'R22 Beta II — Donor Min',     defaultGbp:  80000 },
  { id: 'rebuild_r22_donor_max', modelKey: 'r22', field: 'donorMax', label: 'R22 Beta II — Donor Max',     defaultGbp: 120000 },
  { id: 'rebuild_r44_from',      modelKey: 'r44', field: 'from',     label: 'R44 Raven II — Rebuild From', defaultGbp:  85000 },
  { id: 'rebuild_r44_donor_min', modelKey: 'r44', field: 'donorMin', label: 'R44 Raven II — Donor Min',    defaultGbp: 120000 },
  { id: 'rebuild_r44_donor_max', modelKey: 'r44', field: 'donorMax', label: 'R44 Raven II — Donor Max',    defaultGbp: 200000 },
  { id: 'rebuild_r66_from',      modelKey: 'r66', field: 'from',     label: 'R66 Turbine — Rebuild From',  defaultGbp: 150000 },
  { id: 'rebuild_r66_donor_min', modelKey: 'r66', field: 'donorMin', label: 'R66 Turbine — Donor Min',     defaultGbp: 350000 },
  { id: 'rebuild_r66_donor_max', modelKey: 'r66', field: 'donorMax', label: 'R66 Turbine — Donor Max',     defaultGbp: 550000 },
];
```

- [ ] **Step 2: Commit**

```bash
git add src/config/rebuildPricingDefaults.js
git commit -m "feat(rebuilds): add rebuild pricing defaults module"
```

---

## Task 2: Write the hook test (TDD — failing first)

**Files:**
- Test: `src/hooks/useRebuildPricing.test.js`

- [ ] **Step 1: Write the failing test**

```js
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, waitFor } from '@testing-library/react';

const { mockGetDocs } = vi.hoisted(() => ({
  mockGetDocs: vi.fn(),
}));

vi.mock('../lib/firebase', () => ({ db: {} }));

vi.mock('firebase/firestore', () => ({
  collection: vi.fn(() => 'col-ref'),
  getDocs: mockGetDocs,
}));

beforeEach(() => {
  vi.clearAllMocks();
  vi.resetModules();
});

describe('useRebuildPricing', () => {
  it('returns defaults when Firestore has no overrides', async () => {
    mockGetDocs.mockResolvedValueOnce({ forEach: (cb) => {} });
    const { useRebuildPricing } = await import('./useRebuildPricing');
    const { result } = renderHook(() => useRebuildPricing());

    // Default for R22 from — synchronous fallback before fetch resolves
    expect(result.current.getRebuildPrices('r22')).toEqual({
      from: 55000,
      donorMin: 80000,
      donorMax: 120000,
    });

    await waitFor(() => expect(result.current.loading).toBe(false));
    // Still defaults after empty fetch
    expect(result.current.getRebuildPrices('r66')).toEqual({
      from: 150000,
      donorMin: 350000,
      donorMax: 550000,
    });
  });

  it('returns Firestore overrides when present', async () => {
    const docs = [
      { id: 'rebuild_r22_from',      data: () => ({ category: 'rebuilds', price: 6000000 }) }, // £60,000
      { id: 'rebuild_r22_donor_min', data: () => ({ category: 'rebuilds', price: 9000000 }) }, // £90,000
    ];
    mockGetDocs.mockResolvedValueOnce({ forEach: (cb) => docs.forEach(cb) });
    const { useRebuildPricing } = await import('./useRebuildPricing');
    const { result } = renderHook(() => useRebuildPricing());

    await waitFor(() => expect(result.current.loading).toBe(false));

    expect(result.current.getRebuildPrices('r22')).toEqual({
      from: 60000,       // override
      donorMin: 90000,   // override
      donorMax: 120000,  // default
    });
  });

  it('ignores docs from other categories', async () => {
    const docs = [
      { id: 'rebuild_r22_from', data: () => ({ category: 'rebuilds', price: 6000000 }) },
      { id: 'discovery_r22_30min', data: () => ({ category: 'discovery', price: 17500 }) },
    ];
    mockGetDocs.mockResolvedValueOnce({ forEach: (cb) => docs.forEach(cb) });
    const { useRebuildPricing } = await import('./useRebuildPricing');
    const { result } = renderHook(() => useRebuildPricing());

    await waitFor(() => expect(result.current.loading).toBe(false));
    // Only the rebuilds doc applied
    expect(result.current.getRebuildPrices('r22').from).toBe(60000);
  });
});
```

- [ ] **Step 2: Run the test to verify it fails**

```bash
npx vitest run src/hooks/useRebuildPricing.test.js
```

Expected: FAIL with `Cannot find module './useRebuildPricing'`.

---

## Task 3: Implement the hook

**Files:**
- Create: `src/hooks/useRebuildPricing.js`

- [ ] **Step 1: Write the hook**

```js
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
```

- [ ] **Step 2: Run the test to verify it passes**

```bash
npx vitest run src/hooks/useRebuildPricing.test.js
```

Expected: All three tests PASS.

If any fail, fix the hook (do not change the test). Common issues:
- Forgetting to filter by `category === 'rebuilds'` → category leak test fails.
- Returning pence instead of pounds → override test fails.
- Resetting cache between calls — note: tests use `vi.resetModules()` in `beforeEach` to get a fresh `_cache`, so this should just work.

- [ ] **Step 3: Commit**

```bash
git add src/hooks/useRebuildPricing.js src/hooks/useRebuildPricing.test.js
git commit -m "feat(rebuilds): add useRebuildPricing hook with Firestore overrides"
```

---

## Task 4: Wire the hook into Rebuilds.jsx

**Files:**
- Modify: `src/pages/Rebuilds.jsx:8-15` (imports), `:152-177` (rebuildModels), `:303-321` (component opening), `:502-525` (Models grid)

- [ ] **Step 1: Add the import**

Add this import alongside the existing hook imports near the top of the file (e.g. after `import { useCmsHighlight }`):

```js
import { useRebuildPricing } from '../hooks/useRebuildPricing';
```

- [ ] **Step 2: Replace the rebuildModels array**

Find the existing `rebuildModels` array (lines 152-177). Replace the entire array with:

```js
const rebuildModels = [
  {
    modelKey: 'r22',
    model: 'Robinson R22 Beta II',
    image: '/assets/images/new-aircraft/r22/r22-red-volcano-front-alpha-v3.png',
    description: 'Ideal training platform rebuilt to zero-time specification.',
    specs: ['Lycoming O-360 overhaul', 'New blades available', 'Glass cockpit option', 'Custom paint scheme'],
  },
  {
    modelKey: 'r44',
    model: 'Robinson R44 Raven II',
    image: '/assets/images/new-aircraft/r44/raven-ii-front-alpha.png',
    description: 'The world\'s best-selling helicopter, rebuilt to exceed factory standards.',
    specs: ['IO-540 zero-time engine', 'Full avionics upgrade', 'Leather interior', 'Aux tank option'],
  },
  {
    modelKey: 'r66',
    model: 'Robinson R66 Turbine',
    image: '/assets/images/used-aircraft/r66/r66-turbine-ghkcc.jpg',
    description: 'Turbine power, rebuilt with modern avionics and bespoke specification.',
    specs: ['RR300 turbine overhaul', 'Garmin G500H TXi', 'Premium interior', 'Extended range tank'],
  },
];
```

(The `rebuildFrom` and `donorEstimate` fields are removed; `modelKey` is added.)

- [ ] **Step 3: Call the hook inside the component**

In the `Rebuilds` component (starts at line 303), add this line directly under `const pageImages = usePageImages('rebuilds');`:

```js
const { getRebuildPrices } = useRebuildPricing();
```

- [ ] **Step 4: Update the Models grid render**

Find the existing Models grid `.map` block (lines 502-525). Replace it with:

```jsx
<div className="rb__models-grid" data-cms-section="rebuilds-models" ref={modelsCarouselRef} onScroll={handleModelsScroll}>
  {rebuildModels.map((m, i) => {
    const { from, donorMin, donorMax } = getRebuildPrices(m.modelKey);
    const fromStr = `£${from.toLocaleString('en-GB')}`;
    const donorStr = `£${donorMin.toLocaleString('en-GB')}–£${donorMax.toLocaleString('en-GB')}`;
    return (
      <Reveal key={i} delay={i * 0.1}>
        <div className="rb__model-card">
          <div className="rb__model-img">
            <img src={pageImages['rebuilds-models']?.[i]?.url || m.image} alt={m.model} />
          </div>
          <div className="rb__model-body">
            <h3>{m.model}</h3>
            <div className="rb__model-pricing">
              <div className="rb__model-price-line">
                <span>Rebuild from</span>
                <strong>{fromStr}</strong>
              </div>
              <div className="rb__model-price-donor">
                + donor aircraft <span>({donorStr})</span>
              </div>
              <div className="rb__model-price-note">We can source a suitable donor or rebuild your existing aircraft.</div>
            </div>
          </div>
        </div>
      </Reveal>
    );
  })}
</div>
```

- [ ] **Step 5: Verify the page still renders defaults**

Run the dev server (if not already running) and navigate to `/rebuilds`:

```bash
npm run dev:vite
```

Open `http://localhost:5173/rebuilds`. Scroll to the Models section. Confirm:
- R22 Beta II shows "Rebuild from **£55,000**" and "+ donor aircraft (£80,000–£120,000)"
- R44 Raven II shows "Rebuild from **£85,000**" and "+ donor aircraft (£120,000–£200,000)"
- R66 Turbine shows "Rebuild from **£150,000**" and "+ donor aircraft (£350,000–£550,000)"

These should match the pre-change values exactly (using defaults — no Firestore docs exist yet).

- [ ] **Step 6: Commit**

```bash
git add src/pages/Rebuilds.jsx
git commit -m "feat(rebuilds): render Models prices from useRebuildPricing"
```

---

## Task 5: Add the rebuilds category to AdminPricing

**Files:**
- Modify: `src/pages/admin/AdminPricing.jsx`

- [ ] **Step 1: Import the defaults**

Find the existing import block at the top (lines 1-5). Add this import after the `aircraftPriceId` import:

```js
import { REBUILD_PRICING_DEFAULTS } from '../../config/rebuildPricingDefaults';
```

- [ ] **Step 2: Add the rebuilds category entry**

Find the `CATEGORIES` array (line 8). Append a new entry to the end of the array (after the `aircraft` entry):

```js
  {
    id: 'rebuilds',
    label: 'Rebuilds — Price From & Donor Range',
    hint: "Displayed on the /rebuilds page Models section. 'From' = rebuild labour starting price. Donor min/max define the donor aircraft range shown beneath each card.",
  },
```

- [ ] **Step 3: Add the rebuild IDs to the GBP whitelist**

Find `GBP_WEBSITE_IDS` (around line 32). Inside that `Set`, add a new line at the end (before the closing `]`):

```js
  'rebuild_r22_from', 'rebuild_r22_donor_min', 'rebuild_r22_donor_max',
  'rebuild_r44_from', 'rebuild_r44_donor_min', 'rebuild_r44_donor_max',
  'rebuild_r66_from', 'rebuild_r66_donor_min', 'rebuild_r66_donor_max',
```

- [ ] **Step 4: Add a seedRebuildDefaults function**

Find the `seedAircraftDefaults` function (around line 147). Add this new function immediately after it (before the `grouped` const declaration):

```js
  /** Seed missing rebuild pricing docs in Firestore from the defaults. */
  async function seedRebuildDefaults() {
    if (!window.confirm('Create Firestore docs for any rebuild prices that are not yet stored? Existing prices will not be touched.')) return;
    setSeeding(true);
    try {
      const existing = new Set(items.filter((i) => i.category === 'rebuilds').map((i) => i.id));
      const missing = REBUILD_PRICING_DEFAULTS.filter((e) => !existing.has(e.id));
      for (const entry of missing) {
        await setDocById('pricing', entry.id, {
          category:    'rebuilds',
          currency:    'gbp',
          label:       entry.label,
          description: '',
          price:       entry.defaultGbp * 100, // GBP pence
        });
      }
    } finally {
      setSeeding(false);
    }
  }
```

- [ ] **Step 5: Add a rebuilds branch to the `grouped` reducer**

Find the `grouped` const (around line 169). It currently has two branches (`'aircraft'` and the `else`). Replace the entire reducer body with three branches:

```js
  const grouped = CATEGORY_IDS.reduce((acc, id) => {
    if (id === 'aircraft') {
      const fsByid = new Map(items.filter((i) => i.category === 'aircraft').map((i) => [i.id, i]));
      acc[id] = AIRCRAFT_ENTRIES.map((entry) => fsByid.get(entry.id) ?? {
        id: entry.id,
        category: 'aircraft',
        currency: 'usd',
        label: entry.label,
        description: entry.description ?? '',
        price: Math.round(entry.defaultPriceUsd * 100),
        _isDefault: true,
      });
    } else if (id === 'rebuilds') {
      const fsByid = new Map(items.filter((i) => i.category === 'rebuilds').map((i) => [i.id, i]));
      acc[id] = REBUILD_PRICING_DEFAULTS.map((entry) => fsByid.get(entry.id) ?? {
        id: entry.id,
        category: 'rebuilds',
        currency: 'gbp',
        label: entry.label,
        description: '',
        price: entry.defaultGbp * 100,
        _isDefault: true,
      });
    } else {
      acc[id] = items.filter((i) => i.category === id && GBP_WEBSITE_IDS.has(i.id));
    }
    return acc;
  }, {});
```

- [ ] **Step 6: Wire the seed button into the rebuilds category header**

Find the existing aircraft seed button (around line 264 — `cat.id === 'aircraft' && catItems.some((i) => i._isDefault)`). Replace just that conditional render block with one that handles both categories:

```jsx
                {(cat.id === 'aircraft' || cat.id === 'rebuilds') && catItems.some((i) => i._isDefault) && (
                  <button
                    onClick={cat.id === 'aircraft' ? seedAircraftDefaults : seedRebuildDefaults}
                    disabled={seeding}
                    style={{ background: '#111827', color: '#fff', padding: '0.4rem 0.85rem', border: 'none', borderRadius: '6px', fontSize: '0.75rem', fontWeight: 600, cursor: 'pointer' }}
                  >
                    {seeding ? 'Seeding…' : 'Seed missing prices to Firestore'}
                  </button>
                )}
```

- [ ] **Step 7: Hide the Delete button for rebuilds (mirrors aircraft)**

Find the existing Delete-button conditional in the actions cell (around line 337 — `cat.id !== 'aircraft' && (...)`). Update the guard so rebuilds is also excluded:

```jsx
                              {cat.id !== 'aircraft' && cat.id !== 'rebuilds' && (
                                <button onClick={() => handleDelete(item.id)} disabled={deleting === item.id} style={{ background: 'none', border: 'none', color: '#dc2626', cursor: 'pointer', fontWeight: 500, fontSize: '0.875rem' }}>
                                  {deleting === item.id ? '…' : 'Delete'}
                                </button>
                              )}
```

(Rationale: rebuild rows are derived from a fixed defaults list — deleting one would re-appear next render as a default row, which is confusing. Same logic the aircraft category uses today.)

- [ ] **Step 8: Verify the admin page renders**

With the dev server running, log in as admin and navigate to `/admin/pricing`. Confirm:
- A new "REBUILDS — PRICE FROM & DONOR RANGE" section appears below "AIRCRAFT SALES".
- It shows nine rows: three for R22 (From, Donor Min, Donor Max), three for R44, three for R66.
- All nine rows are greyed out with `(default — not yet in Firestore)` next to each label.
- A "Seed missing prices to Firestore" button is visible in the section header.
- Each row shows the correct default price (e.g. R22 Donor Max = £120,000).

- [ ] **Step 9: Commit**

```bash
git add src/pages/admin/AdminPricing.jsx
git commit -m "feat(admin): add rebuilds category to pricing admin"
```

---

## Task 6: End-to-end manual verification

**Files:** none (manual test only)

- [ ] **Step 1: Seed the Firestore docs**

In `/admin/pricing`, click "Seed missing prices to Firestore" in the Rebuilds section. Wait for the button to stop saying "Seeding…". The nine rows should now be fully editable (no longer greyed out, Edit button visible).

- [ ] **Step 2: Edit one price**

Click "Edit" on the `R22 Beta II — Rebuild From` row. Change the price from `55000` to `60000`. Click Save.

- [ ] **Step 3: Verify the change on /rebuilds**

The 5-minute hook cache means a hard reload (or new tab) is needed. Open `/rebuilds` in a fresh tab. Confirm the R22 card now shows "Rebuild from **£60,000**".

- [ ] **Step 4: Edit a donor range value**

Back in admin, edit `R44 Raven II — Donor Max` from `200000` to `220000`. Save. Reload `/rebuilds` in a fresh tab. Confirm the R44 card now shows "+ donor aircraft (£120,000–£220,000)".

- [ ] **Step 5: Restore the original values**

Edit both rows back to their original defaults (R22 from = 55000, R44 donor max = 200000) so the live site is unchanged. Reload `/rebuilds` to confirm the original numbers are showing.

- [ ] **Step 6: Run the full test suite**

```bash
npm test
```

Expected: All tests PASS, including the new `useRebuildPricing` tests. No regressions.

- [ ] **Step 7: Final commit (if any leftover changes)**

```bash
git status
```

Expected: clean working tree (the verification steps shouldn't have changed any files).

---

## Self-Review

**Spec coverage:**
- ✅ New `rebuilds` admin category — Task 5 step 2.
- ✅ Nine GBP doc IDs in `GBP_WEBSITE_IDS` — Task 5 step 3.
- ✅ `seedRebuildDefaults` mirroring aircraft — Task 5 step 4.
- ✅ `useRebuildPricing` hook with 5-min cache and defaults fallback — Tasks 2–3.
- ✅ Rebuilds.jsx renders from hook with defaults fallback — Task 4.
- ✅ Defaults table as single source of truth — Task 1.
- ✅ Format strings via `toLocaleString('en-GB')` — Task 4 step 4.
- ✅ Manual testing plan — Task 6 (matches spec §Testing Plan).

**Type/name consistency:** `getRebuildPrices` returns `{ from, donorMin, donorMax }` — used identically in the test (Task 2), the hook implementation (Task 3), and the consumer (Task 4 step 4). Field names in `REBUILD_PRICING_DEFAULTS` match: `'from' | 'donorMin' | 'donorMax'`.

**No placeholders:** every code step shows the full code; every command has expected output.

# Rebuilds Admin Pricing — Design

**Date:** 2026-04-28
**Status:** Approved

## Problem

The Models section on `/rebuilds` (`src/pages/Rebuilds.jsx:152-177`) shows three rebuild model cards (R22 Beta II, R44 Raven II, R66 Turbine), each with a "Rebuild From" price and a "+ donor aircraft" range. These nine numbers are hardcoded in the `rebuildModels` array. They need to be editable from `/admin/pricing` like every other public price.

## Goal

Move the rebuild prices and donor ranges into Firestore via the existing admin pricing UI. The Models cards on the page must render from live values, with the current hardcoded values as fallback defaults until an admin seeds the docs.

## Non-Goals

- Restyling the Models cards.
- Adding new copy fields (model name, description, specs) to the admin — only the prices.
- Multi-currency: rebuilds are GBP-only.

## Solution

Add a new `rebuilds` category to `AdminPricing` and a sibling `useRebuildPricing` hook that mirrors `useAircraftPricing`. The Rebuilds page reads from the hook and falls back to the hardcoded defaults.

### 1. Admin: new `rebuilds` category

In `src/pages/admin/AdminPricing.jsx`:

- Append to `CATEGORIES`:
  ```js
  {
    id: 'rebuilds',
    label: 'Rebuilds — Price From & Donor Range',
    hint: "Displayed on the /rebuilds page Models section. 'From' = rebuild labour starting price. Donor min/max define the donor aircraft range shown beneath each card.",
  }
  ```
- Add the nine doc IDs to `GBP_WEBSITE_IDS`:
  ```
  rebuild_r22_from, rebuild_r22_donor_min, rebuild_r22_donor_max,
  rebuild_r44_from, rebuild_r44_donor_min, rebuild_r44_donor_max,
  rebuild_r66_from, rebuild_r66_donor_min, rebuild_r66_donor_max
  ```
- Add a "Seed missing prices to Firestore" button for the `rebuilds` category that mirrors `seedAircraftDefaults`. It writes any missing docs from the defaults table (below) to Firestore as GBP pence.
- Until seeded, the rebuilds rows render as defaults (greyed out, like the aircraft category does today). The grouping logic in `grouped` is extended so `cat.id === 'rebuilds'` follows the same pattern as `'aircraft'`: pull existing docs, fill gaps with defaults marked `_isDefault: true`.

### 2. Defaults table (single source of truth)

A new module `src/config/rebuildPricingDefaults.js` exports:

```js
export const REBUILD_PRICING_DEFAULTS = [
  { id: 'rebuild_r22_from',       modelKey: 'r22', field: 'from',     label: 'R22 Beta II — Rebuild From', defaultGbp:  55000 },
  { id: 'rebuild_r22_donor_min',  modelKey: 'r22', field: 'donorMin', label: 'R22 Beta II — Donor Min',    defaultGbp:  80000 },
  { id: 'rebuild_r22_donor_max',  modelKey: 'r22', field: 'donorMax', label: 'R22 Beta II — Donor Max',    defaultGbp: 120000 },
  { id: 'rebuild_r44_from',       modelKey: 'r44', field: 'from',     label: 'R44 Raven II — Rebuild From', defaultGbp:  85000 },
  { id: 'rebuild_r44_donor_min',  modelKey: 'r44', field: 'donorMin', label: 'R44 Raven II — Donor Min',    defaultGbp: 120000 },
  { id: 'rebuild_r44_donor_max',  modelKey: 'r44', field: 'donorMax', label: 'R44 Raven II — Donor Max',    defaultGbp: 200000 },
  { id: 'rebuild_r66_from',       modelKey: 'r66', field: 'from',     label: 'R66 Turbine — Rebuild From',  defaultGbp: 150000 },
  { id: 'rebuild_r66_donor_min',  modelKey: 'r66', field: 'donorMin', label: 'R66 Turbine — Donor Min',     defaultGbp: 350000 },
  { id: 'rebuild_r66_donor_max',  modelKey: 'r66', field: 'donorMax', label: 'R66 Turbine — Donor Max',     defaultGbp: 550000 },
];
```

Both `AdminPricing` (for seeding and default rows) and `useRebuildPricing` (for fallback) read from this module. Default values are stated in whole pounds; conversion to pence happens at the storage boundary.

### 3. New hook: `src/hooks/useRebuildPricing.js`

Mirrors `useAircraftPricing` exactly:

- Single `getDocs(collection(db, 'pricing'))` read on mount, in-module 5-minute cache (`_cache`, `_cacheTs`, `CACHE_TTL`).
- Filters to docs with `category === 'rebuilds'`.
- Exposes `getRebuildPrices(modelKey)` returning `{ from, donorMin, donorMax }` in pounds (Firestore stores pence). For each field: Firestore override if present, else `defaultGbp` from the defaults module.
- Returns `{ overrides, loading, getRebuildPrices }`.

### 4. Rebuilds page changes

In `src/pages/Rebuilds.jsx`:

- The `rebuildModels` array keeps `model`, `image`, `description`, `specs` (these aren't editable). It loses `rebuildFrom` and `donorEstimate`.
- Each entry gains a `modelKey: 'r22' | 'r44' | 'r66'`.
- Inside the component, call `useRebuildPricing()` and, in the map, look up `{ from, donorMin, donorMax }` for each card.
- Format strings inline using `toLocaleString('en-GB')`:
  ```js
  const fromStr = `£${from.toLocaleString('en-GB')}`;
  const donorStr = `£${donorMin.toLocaleString('en-GB')}–£${donorMax.toLocaleString('en-GB')}`;
  ```
- Render `fromStr` in `<strong>` and `donorStr` inside the existing `<span>`, exactly matching the current markup.

### 5. Loading behaviour

`useRebuildPricing` returns defaults immediately (defaults are synchronous). The Firestore read swaps in overrides when it resolves, with the same 5-min module-level cache as `useAircraftPricing`. No spinner or skeleton — first render shows defaults, subsequent renders show overrides. Matches the existing aircraft pricing UX.

## Data Storage

Pence integers in Firestore, identical to existing GBP categories. Each doc:

```json
{
  "category": "rebuilds",
  "currency": "gbp",
  "label": "R22 Beta II — Rebuild From",
  "description": "",
  "price": 5500000
}
```

`description` is empty by default but admins can fill it (it's edited via the existing description column).

## Files Touched

- **New:** `src/config/rebuildPricingDefaults.js`
- **New:** `src/hooks/useRebuildPricing.js`
- **Modified:** `src/pages/admin/AdminPricing.jsx` — add category, IDs, seed button, grouping branch.
- **Modified:** `src/pages/Rebuilds.jsx` — drop hardcoded prices from `rebuildModels`, add `modelKey`, render via the hook.

## Testing Plan

Manual verification (no automated tests for this admin surface today):

1. Before seeding: visit `/rebuilds` — Models cards still show £55,000 / £85,000 / £150,000 and matching donor ranges (sourced from defaults).
2. Visit `/admin/pricing` — new "Rebuilds" section shows nine rows, all greyed out as `(default — not yet in Firestore)`.
3. Click "Seed missing prices to Firestore" — all nine docs created.
4. Edit one row (e.g. `rebuild_r22_from`) to £60,000 → save.
5. Hard-reload `/rebuilds` after the 5-min cache window (or clear cache) — the R22 card shows the new value.
6. Confirm the donor range string formats correctly when min/max are edited.

## Risks & Open Questions

- **Cache TTL:** The 5-minute module cache means an edit isn't immediately reflected on `/rebuilds` for a viewer in another tab. Same trade-off as aircraft pricing — acceptable.
- **Currency field:** New docs are written with `currency: 'gbp'`. The display path checks `currency === 'usd'`, so absent/`'gbp'` both render with `£`. Setting it explicitly is consistent and lets us add other currencies later without ambiguity.

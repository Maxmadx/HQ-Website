# Miscellaneous Sales Section — Design Spec

**Date:** 2026-04-16  
**Status:** Approved

---

## Overview

Add a "Miscellaneous" category to the HQ Aviation pricing system. Staff manage items freely via the admin panel; they display as a 4-column card grid on the public Sales page (`/sales`). This is display-only pricing — no Stripe integration.

Each miscellaneous item carries a **condition** field — either `new` or `used` — so customers know whether a product is brand new or second-hand.

Examples of items: helicopter covers (R22/R44), helicopter mover, start stick, Pooleys logbook, revision material, HQ merch. The category is open-ended; staff can add anything.

---

## Architecture

Three files change. No new files, no new collections.

### 1. `scripts/seed-pricing.js`

Add seven initial miscellaneous items to the `PRICING` array with `category: 'miscellaneous'`:

| ID | Label | Seed Price | Condition |
|----|-------|------------|-----------|
| `misc_cover_r22` | Helicopter Cover (R22) | £0 (update in admin) | `new` |
| `misc_cover_r44` | Helicopter Cover (R44) | £0 | `new` |
| `misc_mover` | Helicopter Mover | £0 | `new` |
| `misc_start_stick` | Start Stick | £0 | `new` |
| `misc_pooleys_logbook` | Pooleys Logbook | £0 | `new` |
| `misc_revision_material` | Revision Material | £0 | `new` |
| `misc_hq_merch` | HQ Merchandise | £0 | `new` |

All items seeded with `condition: 'new'` as default. Staff updates prices and conditions in the admin panel before the section goes live.

### 2. `src/pages/admin/AdminPricing.jsx`

**Two changes:**

**a) Add to `CATEGORIES` array:**
```js
{
  id: 'miscellaneous',
  label: 'Sales Page — Miscellaneous Items',
  hint: 'Displayed on the Sales page. Add any item here — covers, movers, logbooks, merch, etc. Not charged via Stripe.',
}
```

**b) Remove `WEBSITE_IDS` whitelist for the misc category:**

The existing `grouped` logic filters by `WEBSITE_IDS.has(i.id)`. For `miscellaneous`, all items with that category should show regardless of ID (since staff can add anything). The grouped logic must treat misc as ID-unrestricted.

Concretely: change the `grouped` reducer so that for `category === 'miscellaneous'`, it filters by category only (no WEBSITE_IDS check).

**c) Add `condition` field to the add/edit form for misc items:**

The `+ Add Item` form and the inline edit row gain a **Condition** dropdown (`New` / `Used`) when the selected category is `miscellaneous`. For all other categories the field is hidden (not relevant). The field writes a `condition` value of `'new'` or `'used'` to Firestore alongside label, price, and description.

### 3. `src/pages/Sales.jsx`

**Add a Miscellaneous section** rendered after the existing accessories section.

**Data source:** The `usePricing` hook already loads all Firestore pricing docs into a `prices` map keyed by doc ID. Each doc has a `category` field. Filter for misc items:
```js
const miscItems = Object.entries(prices)
  .filter(([, doc]) => doc.category === 'miscellaneous')
  .map(([id, doc]) => ({ id, ...doc }));
```

**Render:** 4-column card grid using `.sales-accessories` CSS classes (already defined). Cards show: a condition badge ("New" or "Used"), item name, price in monospace. Section is conditionally rendered — hidden if `miscItems.length === 0` or `loading`.

**No FALLBACK values** are added to `usePricing.js`. If Firestore is unavailable, the section doesn't render. This is acceptable for supplementary display-only content.

---

## Data Flow

```
seed-pricing.js  →  Firestore `pricing` collection
                          ↓
              usePricing hook (loads all docs)
                          ↓
         Sales.jsx filters by category === 'miscellaneous'
                          ↓
              4-column card grid on /sales
```

Admin writes directly to the same Firestore collection → changes reflect on the Sales page within the 5-minute cache TTL.

---

## What Does NOT Change

- `src/hooks/usePricing.js` — no changes (FALLBACK not needed for dynamic misc items)
- Stripe integration — none; display only
- Any other page or component
- The `WEBSITE_IDS` whitelist for existing categories (discovery, sfh) — unchanged

---

## Success Criteria

1. Staff can add, edit, and delete miscellaneous items in the admin panel without developer involvement
2. Staff can set condition (New / Used) on any misc item via the admin panel
3. All items with `category === 'miscellaneous'` appear on `/sales` in a 4-column grid with a condition badge
4. The section does not render if there are no misc items
5. Prices seeded at £0 are updated in the admin before the section is shown publicly
6. Re-running `seed-pricing.js` is safe (existing docs updated, not duplicated)

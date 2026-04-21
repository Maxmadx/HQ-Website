# Featured Listings — Make Functional

**Date:** 2026-04-16  
**Status:** Approved

## Problem

The homepage (`/`) renders `Experimentation.jsx`, which contains a pre-owned aircraft carousel hardcoded with static data (`preownedInventory` array). This carousel:

1. Is disconnected from the admin panel (`/admin/listings`) and Firestore
2. Links to `/sales/pre-owned/:id` detail pages that 404 due to a route typo in `App.jsx`
3. Uses a different field schema than the Firestore `listings` collection

## Goal

- Homepage carousel shows only **featured** listings from Firestore (live, admin-controlled)
- Clicking a card routes correctly to the detail page
- Admin "Under Offer" status label is consistent across admin UI, carousel badge, and detail page

## Changes

### 1. `src/App.jsx` — Fix route typo

Line 162: missing `/` before `:id`

```
Before: <Route path="/sales/pre-owned:id" element={<UsedAircraftDetail />} />
After:  <Route path="/sales/pre-owned/:id" element={<UsedAircraftDetail />} />
```

### 2. `src/pages/Experimentation.jsx` — Connect carousel to Firestore

**Add import:**
```js
import { useCollection } from '../hooks/useFirestore';
```

**Remove** the hardcoded `preownedInventory` array (~lines 2795–2855).

**Add inside the component**, where the array was declared:
```js
const { docs: allListings } = useCollection('listings');
const preownedInventory = allListings.filter(l => l.featured);
```

**Update 3 field references in carousel JSX:**

| Location | Old (hardcoded schema) | New (Firestore schema) |
|---|---|---|
| Badge display | `ac.price` | `ac.priceDisplay` |
| Subtitle hours | `ac.hours` | `ac.specs?.hours` |
| Image `src` | `images[imgIdx]` (string) | `images[imgIdx]?.url` (object) |

Status values (`'sold'`, `'reserved'`) already match Firestore — no change needed.  
Sold cards remain non-clickable with "SOLD" badge.  
Reserved cards link to detail page with "UNDER OFFER" badge.

### 3. `src/pages/admin/AdminListingEdit.jsx` — Rename dropdown label

```jsx
// Before
<option value="reserved">Reserved</option>

// After
<option value="reserved">Under Offer</option>
```

Internal value stays `reserved` — no data migration needed.

## Data Flow After Changes

```
Admin toggles "featured" on a listing
  → Firestore `listings` doc updated: { featured: true }
  → useCollection('listings') subscription fires
  → preownedInventory = allListings.filter(l => l.featured)
  → Homepage carousel re-renders with that listing
  → Clicking card → /sales/pre-owned/:firestoreId → UsedAircraftDetail fetches by ID
```

## Out of Scope

- No changes to `UsedSales.jsx` (already functional)
- No changes to `UsedAircraftDetail.jsx` (already functional once route is fixed)
- No changes to `UsedSales2.jsx` or other prototype pages

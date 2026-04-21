# Featured Listings — Make Functional Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Wire the homepage pre-owned carousel to Firestore featured listings, fix the broken detail page route, and rename the admin "Reserved" label to "Under Offer."

**Architecture:** Three targeted file edits — a one-character route fix in `App.jsx`, a label rename in `AdminListingEdit.jsx`, and swapping the hardcoded `preownedInventory` array in `Experimentation.jsx` for a live `useCollection('listings')` query filtered to `featured: true`. No new files, no new abstractions.

**Tech Stack:** React 19, React Router v7, Firebase Firestore (`useCollection` hook at `src/hooks/useFirestore.js`), Vite

---

## File Map

| File | Change |
|---|---|
| `src/App.jsx` | Fix route typo: `/sales/pre-owned:id` → `/sales/pre-owned/:id` |
| `src/pages/admin/AdminListingEdit.jsx` | Rename dropdown option label "Reserved" → "Under Offer" |
| `src/pages/Experimentation.jsx` | Add `useCollection` import; replace hardcoded array; fix 3 field refs |

---

### Task 1: Fix the broken detail page route

**Files:**
- Modify: `src/App.jsx:162`

- [ ] **Step 1: Open `src/App.jsx` and find line 162**

It currently reads:
```jsx
<Route path="/sales/pre-owned:id" element={<UsedAircraftDetail />} />
```

- [ ] **Step 2: Fix the missing `/` before `:id`**

Change to:
```jsx
<Route path="/sales/pre-owned/:id" element={<UsedAircraftDetail />} />
```

- [ ] **Step 3: Start the dev server and verify the fix**

```bash
npm run dev
```

Navigate to `/sales/pre-owned`. Click any aircraft card. The detail page should load (or show "Aircraft Not Found" if Firestore has no matching doc — either is correct; a 404/blank page is not).

- [ ] **Step 4: Commit**

```bash
git add src/App.jsx
git commit -m "fix: correct pre-owned detail route — missing slash before :id param"
```

---

### Task 2: Rename "Reserved" to "Under Offer" in admin dropdown

**Files:**
- Modify: `src/pages/admin/AdminListingEdit.jsx`

- [ ] **Step 1: Open `src/pages/admin/AdminListingEdit.jsx` and find the status select**

It looks like:
```jsx
<select style={fieldStyle} value={form.status} onChange={(e) => set('status', e.target.value)}>
  <option value="for_sale">For Sale</option>
  <option value="reserved">Reserved</option>
  <option value="sold">Sold</option>
  <option value="coming_soon">Coming Soon</option>
</select>
```

- [ ] **Step 2: Rename the label only — leave the value unchanged**

```jsx
<select style={fieldStyle} value={form.status} onChange={(e) => set('status', e.target.value)}>
  <option value="for_sale">For Sale</option>
  <option value="reserved">Under Offer</option>
  <option value="sold">Sold</option>
  <option value="coming_soon">Coming Soon</option>
</select>
```

The internal value `reserved` stays the same — no Firestore data migration needed. The carousel badge and detail page already display "UNDER OFFER" for this status.

- [ ] **Step 3: Verify**

Go to `/admin/listings/new` (or edit any listing). The status dropdown should show "Under Offer" instead of "Reserved".

- [ ] **Step 4: Commit**

```bash
git add src/pages/admin/AdminListingEdit.jsx
git commit -m "fix: rename Reserved to Under Offer in admin status dropdown"
```

---

### Task 3: Connect homepage carousel to Firestore featured listings

**Files:**
- Modify: `src/pages/Experimentation.jsx`

The `Experimentation` component (line 1404) currently defines a hardcoded `preownedInventory` array at ~line 2795. The carousel renders from this array at ~line 4062. Three field names differ between the old hardcoded schema and Firestore:

| Carousel uses | Firestore field |
|---|---|
| `ac.price` | `ac.priceDisplay` |
| `images[imgIdx]` (string URL) | `images[imgIdx]?.url` (object `{url, alt, isPrimary}`) |
| `ac.hours` | `ac.specs?.hours` |

- [ ] **Step 1: Add the `useCollection` import**

Open `src/pages/Experimentation.jsx`. After the last import line (~line 34):
```js
import FacilityServicesCarousel from '../components/Maintenance/FacilityServicesCarousel';
```

Add:
```js
import { useCollection } from '../hooks/useFirestore';
```

- [ ] **Step 2: Remove the hardcoded `preownedInventory` array**

Find and delete the entire `const preownedInventory = [...]` block (~lines 2795–2855). It starts with:
```js
const preownedInventory = [
  // Available aircraft first
  {
    id: 'r66-ghkcc', model: 'R66 Turbine', ...
```
And ends after the last `},` before `const rebuildSteps = [`.

- [ ] **Step 3: Add the Firestore query in its place**

In the same location (inside the `Experimentation` component body, before `const rebuildSteps`), add:
```js
const { docs: allListings } = useCollection('listings');
const preownedInventory = allListings.filter(l => l.featured);
```

- [ ] **Step 4: Fix the price badge field reference**

Find in the carousel JSX (~line 4072):
```jsx
{!isSold && !isReserved && ac.price && <div className="fd-sales__sold-badge" style={{ background: '#1a1a1a' }}>{ac.price}</div>}
```

Change to:
```jsx
{!isSold && !isReserved && ac.priceDisplay && <div className="fd-sales__sold-badge" style={{ background: '#1a1a1a' }}>{ac.priceDisplay}</div>}
```

- [ ] **Step 5: Fix the image `src` field reference**

Find (~line 4074):
```jsx
<img src={images[imgIdx]} alt={ac.model} />
```

Change to:
```jsx
<img src={images[imgIdx]?.url} alt={ac.model} />
```

- [ ] **Step 6: Fix the hours field reference**

Find (~line 4103):
```jsx
<span>{ac.registration} &middot; {ac.year}{ac.hours ? ` · ${ac.hours.toLocaleString()} hrs` : ''}</span>
```

Change to:
```jsx
<span>{ac.registration} &middot; {ac.year}{ac.specs?.hours ? ` · ${ac.specs.hours.toLocaleString()} hrs` : ''}</span>
```

- [ ] **Step 7: Verify end-to-end**

1. Go to `/admin/listings` and mark at least one listing as "Featured" (checkbox in the edit form)
2. Navigate to the homepage (`/`)
3. Scroll to the Pre-Owned Aircraft section — that listing should appear in the carousel
4. Uncheck "Featured" in admin — it should disappear from the carousel within seconds (Firestore real-time)
5. Click a for-sale or under-offer card — it should navigate to `/sales/pre-owned/:firestoreId` and show the detail page
6. A listing set to "Sold" + "Featured" should appear with a "SOLD" badge and no link

- [ ] **Step 8: Commit**

```bash
git add src/pages/Experimentation.jsx
git commit -m "feat: connect homepage carousel to Firestore featured listings"
```

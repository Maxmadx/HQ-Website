# Miscellaneous Page, Subsection & Admin — Design Spec

**Date:** 2026-04-16
**Status:** Approved

---

## Overview

Three coordinated deliverables:

1. A new collapsible **subsection** in `Experimentation.jsx` (after Robinson Unmanned) that previews miscellaneous items and links to the full page
2. A new public-facing **`/misc` page** (`src/pages/Misc.jsx`) with category filtering and a brand-consistent grid layout
3. A full **admin CRUD interface** (`/admin/misc`, `/admin/misc/:id`) with image upload, matching the AdminListings pattern

Items live in a new Firestore collection: `misc_items`. The previous miscellaneous work in the `pricing` collection is removed.

---

## Data Model — `misc_items` Firestore Collection

Each document:

| Field | Type | Notes |
|-------|------|-------|
| `name` | string | Display name, e.g. "R22 Helicopter Cover" |
| `category` | string | Free-text, e.g. "Apparel", "Ground Equipment", "Logbooks" |
| `priceDisplay` | string | e.g. "£250" or "POA" — shown as-is, no formatting |
| `condition` | string | `'new'` or `'used'` |
| `description` | string | Optional. Shown on card and edit form |
| `images` | array | `[{ url: string, alt: string, isPrimary: boolean }]` — same shape as `listings` |
| `createdAt` | timestamp | Set on create via `serverTimestamp()` |

No `price` (pence) field — this is display-only, no Stripe integration.

---

## Part 1 — Subsection in `Experimentation.jsx`

### State

Add `misc` key to the `salesExpanded` state object:
```js
const [salesExpanded, setSalesExpanded] = useState({
  new: false,
  preowned: false,
  rebuilt: false,
  tradein: false,
  unmanned: false,
  misc: false,   // ← add this
});
```

### Data

Add a `useCollection('misc_items')` call inside the component (alongside the other data hooks) to load misc items:
```js
const { docs: miscItems, loading: miscLoading } = useCollection('misc_items');
```

Show up to 4 items in the preview, sorted by `createdAt` descending (most recent first).

### JSX — placement

Insert immediately after the closing `</div>` of the Robinson Unmanned subsection.

### JSX — structure

```jsx
<div className="fd-sales__subsection">
  <h3
    className={`fd-sales__section-title fd-sales__section-title--toggle ${salesExpanded.misc ? 'fd-sales__section-title--active' : ''}`}
    onClick={() => setSalesExpanded(prev => ({ ...prev, misc: !prev.misc }))}
  >
    Miscellaneous
    <span className={`fd-sales__chevron ${salesExpanded.misc ? 'fd-sales__chevron--open' : ''}`}>
      <i className="fas fa-chevron-down"></i>
    </span>
  </h3>
  <div className={`fd-sales__collapse ${salesExpanded.misc ? 'fd-sales__collapse--open' : ''}`}>
    <p className="fd-sales__section-desc">
      Accessories, apparel, ground equipment, training materials and more — everything beyond the aircraft itself, all available from HQ.
    </p>

    {/* Preview grid — up to 4 items */}
    {!miscLoading && miscItems.length > 0 && (
      <div className="fd-sales__grid fd-sales__grid--desktop fd-sales__grid--misc">
        {miscItems.slice(0, 4).map((item) => {
          const primary = item.images?.find(i => i.isPrimary) || item.images?.[0];
          return (
            <Link key={item.id} to="/misc" className="fd-sales__card">
              <div className="fd-sales__card-image">
                {primary
                  ? <img src={primary.url} alt={primary.alt || item.name} />
                  : <span className="fd-sales__card-placeholder-icon"><i className="fas fa-box"></i></span>
                }
              </div>
              <div className="fd-sales__card-info">
                <span className="fd-sales__card-category">{item.category}</span>
                <h3>{item.name}</h3>
                <div className="fd-sales__card-meta">
                  <span className={`fd-sales__condition-badge fd-sales__condition-badge--${item.condition}`}>
                    {item.condition === 'used' ? 'Used' : 'New'}
                  </span>
                  <span className="fd-sales__card-price">{item.priceDisplay || 'POA'}</span>
                </div>
              </div>
            </Link>
          );
        })}
      </div>
    )}

    {/* Empty / loading state */}
    {(miscLoading || miscItems.length === 0) && (
      <div className="fd-sales__unmanned-coming">
        <span className="fd-sales__unmanned-icon"><i className="fas fa-box-open"></i></span>
        <p>Stock being added — check back soon or browse the full catalogue.</p>
      </div>
    )}

    <div className="fd-sales__actions">
      <Link to="/misc" className="fd-sales__btn fd-sales__btn--primary">
        Browse All Miscellaneous Items
      </Link>
    </div>
  </div>
</div>
```

### New CSS classes needed (add to the `fd-sales__` style block in Experimentation.jsx)

```css
.fd-sales__card-category {
  display: block;
  font-family: 'Share Tech Mono', monospace;
  font-size: 0.58rem;
  text-transform: uppercase;
  letter-spacing: 0.1em;
  color: #888;
  margin-bottom: 0.4rem;
}

.fd-sales__card-meta {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-top: 0.75rem;
  padding-top: 0.75rem;
  border-top: 1px solid #e8e6e2;
}

.fd-sales__condition-badge {
  font-family: 'Share Tech Mono', monospace;
  font-size: 0.58rem;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  padding: 2px 8px;
  border-radius: 3px;
  font-weight: 600;
}

.fd-sales__condition-badge--new {
  background: #f0fdf4;
  color: #166534;
}

.fd-sales__condition-badge--used {
  background: #fef3c7;
  color: #92400e;
}

.fd-sales__card-placeholder-icon {
  font-size: 2rem;
  color: #ccc;
}

.fd-sales__grid--misc h3 {
  font-size: 0.9rem;
  font-weight: 600;
  margin: 0 0 0.25rem;
  color: #1a1a1a;
}
```

---

## Part 2 — Public `/misc` Page (`src/pages/Misc.jsx`)

### Route

`/misc` — added to `App.jsx` (no auth required, public page).

### Data

```js
const { docs: items, loading } = useCollection('misc_items');
```

Derive unique categories from loaded items:
```js
const categories = ['All', ...new Set(items.map(i => i.category).filter(Boolean).sort())];
```

Active category filter state: `const [activeCategory, setActiveCategory] = useState('All')`.

Filtered items:
```js
const filtered = activeCategory === 'All' ? items : items.filter(i => i.category === activeCategory);
```

### Layout

Uses the page's own header (not AdminLayout). Imports `FooterMinimal`.

```
┌──────────────────────────────────────────────────┐
│  HEADER (same minimal nav as other fd- pages)     │
├──────────────────────────────────────────────────┤
│  HERO SECTION                                     │
│  Share Tech Mono counter "06"                     │
│  Space Grotesk 700 uppercase: MISCELLANEOUS       │
│  Subtitle: "Accessories, apparel & equipment"     │
├──────────────────────────────────────────────────┤
│  CATEGORY FILTER BAR                              │
│  [All] [Apparel] [Ground Equipment] [Logbooks]…   │
├──────────────────────────────────────────────────┤
│  ITEM GRID (4 col → 2 col → 1 col)               │
│  ┌─────┐ ┌─────┐ ┌─────┐ ┌─────┐                │
│  │image│ │image│ │image│ │image│                 │
│  │cat  │ │cat  │ │cat  │ │cat  │                 │
│  │name │ │name │ │name │ │name │                 │
│  │cond │ │cond │ │cond │ │cond │                 │
│  │price│ │price│ │price│ │price│                 │
│  └─────┘ └─────┘ └─────┘ └─────┘                │
├──────────────────────────────────────────────────┤
│  FOOTER MINIMAL                                   │
└──────────────────────────────────────────────────┘
```

### Header / Nav

Reuse the same minimal nav pattern as other pages in Experimentation.jsx — the `fd-nav` component already defined in that file cannot be imported (it's internal). `Misc.jsx` defines its own minimal nav using the same HTML/CSS pattern: dark background, HQ Aviation wordmark, hamburger menu linking to main site sections.

### Category filter bar

```jsx
<div className="misc-filter">
  {categories.map(cat => (
    <button
      key={cat}
      className={`misc-filter__pill ${activeCategory === cat ? 'misc-filter__pill--active' : ''}`}
      onClick={() => setActiveCategory(cat)}
    >
      {cat}
    </button>
  ))}
</div>
```

Styles:
- Pill: `font-family: 'Space Grotesk'`, `font-size: 0.7rem`, `font-weight: 600`, `text-transform: uppercase`, `letter-spacing: 0.06em`, `padding: 0.4rem 1rem`, `border: 1px solid #e8e6e2`, `border-radius: 4px`, `background: transparent`, `color: #666`, `cursor: pointer`, `transition: all 0.2s ease`
- Active pill: `background: #1a1a1a`, `color: #fff`, `border-color: #1a1a1a`

### Item card

```jsx
<div className="misc-card">
  <div className="misc-card__image">
    {primaryImage
      ? <img src={primaryImage.url} alt={primaryImage.alt || item.name} />
      : <div className="misc-card__image-placeholder"><i className="fas fa-box"></i></div>
    }
  </div>
  <div className="misc-card__body">
    <span className="misc-card__category">{item.category}</span>
    <h3 className="misc-card__name">{item.name}</h3>
    {item.description && <p className="misc-card__desc">{item.description}</p>}
    <div className="misc-card__footer">
      <span className={`misc-card__condition misc-card__condition--${item.condition}`}>
        {item.condition === 'used' ? 'Used' : 'New'}
      </span>
      <span className="misc-card__price">{item.priceDisplay || 'POA'}</span>
    </div>
    <Link to="/contact" className="misc-card__enquire">Enquire</Link>
  </div>
</div>
```

### Card CSS (defined inline in Misc.jsx as a `<style>` tag, matching the `fd-sales__` pattern)

- `.misc-card`: `background: #fff`, `border: 1px solid #e8e6e2`, `border-radius: 6px`, hover: `translateY(-4px)` + shadow, `transition: all 0.3s ease`
- `.misc-card__image`: `aspect-ratio: 4/3`, `background: linear-gradient(135deg, #f5f4f0, #eae8e2)`, `overflow: hidden`
- `.misc-card__image img`: `width: 100%`, `height: 100%`, `object-fit: cover`, hover: `scale(1.04)`, `transition: transform 0.4s ease`
- `.misc-card__body`: `padding: 1.25rem`
- `.misc-card__category`: Share Tech Mono, `0.58rem`, uppercase, `#888`, `letter-spacing: 0.1em`, `display: block`, `margin-bottom: 0.35rem`
- `.misc-card__name`: Space Grotesk, `0.95rem`, 700, `#1a1a1a`, `margin: 0 0 0.4rem`
- `.misc-card__desc`: `0.8rem`, `#888`, `line-height: 1.5`, `margin: 0 0 0.75rem`, clamp to 2 lines with `-webkit-line-clamp: 2`
- `.misc-card__footer`: `display: flex`, `align-items: center`, `justify-content: space-between`, `padding-top: 0.75rem`, `border-top: 1px solid #e8e6e2`, `margin-bottom: 0.75rem`
- `.misc-card__condition`: same badge style as `fd-sales__condition-badge`
- `.misc-card__price`: Share Tech Mono, `0.9rem`, 700, `#1a1a1a`
- `.misc-card__enquire`: block, `text-align: center`, `padding: 0.5rem`, `background: #1a1a1a`, `color: #fff`, `font-size: 0.65rem`, `font-weight: 600`, `text-transform: uppercase`, `letter-spacing: 0.08em`, `border-radius: 4px`, `text-decoration: none`, hover: `background: #333`

### Grid

- Desktop: 4 columns, `gap: 1.5rem`
- ≤1024px: 2 columns
- ≤640px: 1 column

### Empty state

```jsx
{!loading && filtered.length === 0 && (
  <div className="misc-empty">
    <p className="misc-empty__text">No items in this category yet.</p>
  </div>
)}
```

Styled: centered, `color: #888`, `padding: 4rem 0`.

---

## Part 3 — Admin

### Files

| File | Purpose |
|------|---------|
| `src/pages/admin/AdminMiscItems.jsx` | List page — `/admin/misc` |
| `src/pages/admin/AdminMiscItemEdit.jsx` | Create/edit form — `/admin/misc/:id` |

### `AdminMiscItems.jsx`

Identical pattern to `AdminListings.jsx`:
- `useCollection('misc_items')` for data
- Table columns: **Name**, **Category**, **Price**, **Condition**, **Actions** (Edit / Delete)
- `+ New Item` button → `Link to="/admin/misc/new"`
- Delete with `window.confirm` + `deleteDocById('misc_items', id)`
- `Link to={`/admin/misc/${item.id}`}` for Edit

### `AdminMiscItemEdit.jsx`

Identical pattern to `AdminListingEdit.jsx`:
- `useParams` for `:id`, `isNew = id === 'new'`
- Load existing doc via `getDoc(doc(db, 'misc_items', id))` on mount
- `EMPTY` shape: `{ name: '', category: '', priceDisplay: '', condition: 'new', description: '', images: [] }`
- Form fields:
  - Name (text, required)
  - Category (text, placeholder "e.g. Apparel")
  - Price Display (text, placeholder "e.g. £250 or POA")
  - Condition (select: New / Used)
  - Description (textarea)
  - Images (file upload — identical to AdminListingEdit: `uploadBytes` to `misc_items/${timestamp}-${filename}`, `getDownloadURL`, primary image selection, remove button)
- Save: `createDoc('misc_items', data)` for new, `updateDocById('misc_items', id, data)` for existing
- `← Back` button → `navigate('/admin/misc')`
- Error display banner

### AdminLayout nav update

In `src/components/admin/AdminLayout.jsx`, add after the Listings entry:
```js
{ to: '/admin/misc', icon: '🛒', label: 'Misc Items' },
```

### App.jsx routes

Add after the existing listings routes:
```jsx
<Route path="/admin/misc" element={<AdminRoute><AdminMiscItems /></AdminRoute>} />
<Route path="/admin/misc/:id" element={<AdminRoute><AdminMiscItemEdit /></AdminRoute>} />
<Route path="/misc" element={<Misc />} />
```

---

## Cleanup — Remove Previous Miscellaneous Work

The following changes from the previous (wrong) implementation must be reverted/removed:

1. **`scripts/seed-pricing.js`** — remove the 7 `misc_*` entries
2. **`src/pages/admin/AdminPricing.jsx`** — remove `miscellaneous` from `CATEGORIES`, remove the `grouped` bypass logic, revert `EMPTY_NEW` to remove `condition`, revert `saveEdit` / `handleCreate` to their pre-misc state, remove the condition table column
3. **`src/pages/Sales.jsx`** — remove the `miscItems` derivation and the `<section className="sales-accessories">` misc block; remove the `usePricing` import if it was added solely for this (check whether it was pre-existing)

---

## Success Criteria

1. "Miscellaneous" subsection appears after Robinson Unmanned in Experimentation.jsx, collapses/expands identically to other subsections
2. Preview shows up to 4 most-recent misc items from Firestore, or a coming-soon placeholder if none exist
3. `/misc` page renders all items with category filtering; grid is responsive
4. Category pills are derived dynamically from item data — no hardcoding
5. Admin can create, edit, and delete misc items at `/admin/misc` and `/admin/misc/:id`
6. Image upload works (Firebase Storage, same path as listings)
7. "Misc Items" nav entry appears in admin sidebar right below "Listings"
8. All previous miscellaneous work in `pricing` collection and `AdminPricing` is cleanly removed

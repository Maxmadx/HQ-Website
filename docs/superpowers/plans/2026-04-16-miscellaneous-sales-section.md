# Miscellaneous Sales Section Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add a dynamic "Miscellaneous" category to the pricing system — admin-editable, with a New/Used condition field, displayed as a 4-column card grid on the public Sales page.

**Architecture:** Three files change. Seed data populates Firestore. AdminPricing bypasses the WEBSITE_IDS whitelist for the `miscellaneous` category and adds a condition dropdown. Sales.jsx reads all docs with `category === 'miscellaneous'` from the existing `usePricing` hook and renders them in a card grid. No new files, no new collections.

**Tech Stack:** React, Firestore (via `usePricing` hook and `useCollection` hook), Vitest for tests, Node.js seed script.

**Spec:** `docs/superpowers/specs/2026-04-16-miscellaneous-sales-section-design.md`

---

### Task 1: Seed miscellaneous pricing items

**Files:**
- Modify: `scripts/seed-pricing.js`

- [ ] **Step 1: Add misc items to the PRICING array**

Open `scripts/seed-pricing.js`. After the last entry in the `PRICING` array (after the `costs` block, before the closing `]`), add:

```js
  // ── Miscellaneous — Sales page display only ────────────────────────────────
  { id: 'misc_cover_r22',          label: 'Helicopter Cover (R22)',  category: 'miscellaneous', condition: 'new', price: 0, description: '' },
  { id: 'misc_cover_r44',          label: 'Helicopter Cover (R44)',  category: 'miscellaneous', condition: 'new', price: 0, description: '' },
  { id: 'misc_mover',              label: 'Helicopter Mover',        category: 'miscellaneous', condition: 'new', price: 0, description: '' },
  { id: 'misc_start_stick',        label: 'Start Stick',             category: 'miscellaneous', condition: 'new', price: 0, description: '' },
  { id: 'misc_pooleys_logbook',    label: 'Pooleys Logbook',         category: 'miscellaneous', condition: 'new', price: 0, description: '' },
  { id: 'misc_revision_material',  label: 'Revision Material',       category: 'miscellaneous', condition: 'new', price: 0, description: '' },
  { id: 'misc_hq_merch',           label: 'HQ Merchandise',          category: 'miscellaneous', condition: 'new', price: 0, description: '' },
```

- [ ] **Step 2: Run the seed script**

```bash
node scripts/seed-pricing.js
```

Expected output — lines like:
```
  created  misc_cover_r22
  created  misc_cover_r44
  created  misc_mover
  created  misc_start_stick
  created  misc_pooleys_logbook
  created  misc_revision_material
  created  misc_hq_merch

Done. Created: 7  Updated: 0
```

(If items already exist from a previous run, you'll see `updated` instead — both are correct.)

- [ ] **Step 3: Commit**

```bash
git add scripts/seed-pricing.js
git commit -m "feat: seed miscellaneous pricing items"
```

---

### Task 2: Update AdminPricing to support miscellaneous category

**Files:**
- Modify: `src/pages/admin/AdminPricing.jsx`

The existing `WEBSITE_IDS` whitelist is used in the `grouped` reducer to restrict which items are shown for each category. For `miscellaneous` we want all items with that category to show, regardless of ID.

The existing `EMPTY_NEW` default sets `category: 'discovery'` and has no `condition` field. We need to add `condition: 'new'` and set the default category appropriately. The add form and inline edit row both need a condition dropdown — but only when category is `miscellaneous`.

- [ ] **Step 1: Add miscellaneous to CATEGORIES**

In `src/pages/admin/AdminPricing.jsx`, find the `CATEGORIES` array (line 6) and add the miscellaneous entry at the end:

```js
const CATEGORIES = [
  {
    id: 'discovery',
    label: 'Training Tab — Discovery & Dual Instruction Prices',
    hint: 'Displayed in the Training tab of Rates & Pricing. Discovery = 30 min trial flight. Dual Instruction = 60 min lesson. These prices are also charged via Stripe on booking.',
  },
  {
    id: 'sfh',
    label: 'Self-Fly Hire Tab — Hourly Rates',
    hint: 'Displayed in the Self-Fly Hire tab of Rates & Pricing. Wet rate = standard hourly rate including fuel. Not charged via Stripe.',
  },
  {
    id: 'miscellaneous',
    label: 'Sales Page — Miscellaneous Items',
    hint: 'Displayed on the Sales page. Add any item here — covers, movers, logbooks, merch, etc. Not charged via Stripe.',
  },
];
```

- [ ] **Step 2: Update grouped logic to bypass WEBSITE_IDS for miscellaneous**

Find the `grouped` reducer (around line 111):

```js
const grouped = CATEGORY_IDS.reduce((acc, id) => {
  acc[id] = items.filter((i) => i.category === id && WEBSITE_IDS.has(i.id));
  return acc;
}, {});
```

Replace it with:

```js
const grouped = CATEGORY_IDS.reduce((acc, id) => {
  acc[id] = id === 'miscellaneous'
    ? items.filter((i) => i.category === 'miscellaneous')
    : items.filter((i) => i.category === id && WEBSITE_IDS.has(i.id));
  return acc;
}, {});
```

- [ ] **Step 3: Add condition field to EMPTY_NEW**

Find `EMPTY_NEW` (around line 28):

```js
const EMPTY_NEW = { label: '', price: '', description: '', category: 'discovery' };
```

Replace with:

```js
const EMPTY_NEW = { label: '', price: '', description: '', category: 'discovery', condition: 'new' };
```

- [ ] **Step 4: Add condition dropdown to the Add Item form**

Find the add form (the `<form onSubmit={handleCreate}>` block). It currently has four fields in a 2-column grid: Label, Price, Category, Description. Add a Condition field after Category — but only render it when `newItem.category === 'miscellaneous'`:

```jsx
{newItem.category === 'miscellaneous' && (
  <div>
    <label style={{ fontSize: '0.75rem', fontWeight: 600, color: '#374151', display: 'block', marginBottom: '2px' }}>Condition</label>
    <select style={fieldStyle} value={newItem.condition} onChange={(e) => setNewItem((n) => ({ ...n, condition: e.target.value }))}>
      <option value="new">New</option>
      <option value="used">Used</option>
    </select>
  </div>
)}
```

Place this directly after the Category `<div>` block and before the Description `<div>` block.

- [ ] **Step 5: Add condition field to startEdit and inline edit row**

**a) Update `startEdit`** to also capture the condition:

```js
function startEdit(item) {
  setEditing((e) => ({
    ...e,
    [item.id]: {
      price:       penceToPounds(item.price),
      label:       item.label,
      description: item.description || '',
      condition:   item.condition || 'new',
    },
  }));
}
```

**b) In the table row render**, find the Description `<td>` cell. After it, add a Condition `<td>` — but only for misc items. The cleanest way is to check the item's category. Find the `catItems.map((item) => { ... })` block and add a new cell between the Description and Actions cells:

```jsx
<td style={{ padding: '0.6rem 0.75rem', color: '#6b7280', fontSize: '0.8rem' }}>
  {cat.id === 'miscellaneous' && (
    ed
      ? (
        <select
          style={{ ...fieldStyle, width: '80px' }}
          value={ed.condition}
          onChange={(e) => setEditing((x) => ({ ...x, [item.id]: { ...x[item.id], condition: e.target.value } }))}
        >
          <option value="new">New</option>
          <option value="used">Used</option>
        </select>
      )
      : (item.condition === 'used' ? 'Used' : 'New')
  )}
</td>
```

Add this cell between the Description `<td>` and the Actions `<td>`.

Also add `Condition` to the table header row for the miscellaneous category. Find the `['Label', 'Price', 'Description', ''].map(...)` header and make it category-aware:

```jsx
{(cat.id === 'miscellaneous'
  ? ['Label', 'Price', 'Description', 'Condition', '']
  : ['Label', 'Price', 'Description', '']
).map((h) => (
  <th key={h} style={{ padding: '0.5rem 0.75rem', textAlign: 'left', color: '#374151', fontWeight: 600 }}>{h}</th>
))}
```

- [ ] **Step 6: Update saveEdit to persist condition**

Find `saveEdit` (around line 74). Update it to include `condition` in the Firestore write:

```js
async function saveEdit(id) {
  setSaving(id);
  try {
    const ed = editing[id];
    await updateDocById('pricing', id, {
      price:       poundsToAppence(ed.price),
      label:       ed.label,
      description: ed.description,
      ...(ed.condition !== undefined && { condition: ed.condition }),
    });
    cancelEdit(id);
  } finally {
    setSaving(null);
  }
}
```

- [ ] **Step 7: Update handleCreate to persist condition**

Find `handleCreate` (around line 96). Update the `createDoc` call to include `condition`:

```js
async function handleCreate(e) {
  e.preventDefault();
  setCreating(true);
  try {
    await createDoc('pricing', {
      ...newItem,
      price:     poundsToAppence(newItem.price),
      condition: newItem.category === 'miscellaneous' ? newItem.condition : undefined,
    });
    setNewItem(EMPTY_NEW);
    setAdding(false);
  } finally {
    setCreating(false);
  }
}
```

- [ ] **Step 8: Verify in browser**

Start the dev server (`npm run dev` or `npm run dev:vite`) and navigate to the admin pricing page. Confirm:
- A "Sales Page — Miscellaneous Items" section appears with the 7 seeded items
- Each row shows New/Used in the Condition column
- Clicking Edit shows a Condition dropdown
- Clicking "+ Add Item" and selecting "Sales Page — Miscellaneous Items" shows the Condition dropdown
- Saving edits persists to Firestore (refresh page, value should be retained)

- [ ] **Step 9: Commit**

```bash
git add src/pages/admin/AdminPricing.jsx
git commit -m "feat: add miscellaneous category to admin pricing with condition field"
```

---

### Task 3: Add Miscellaneous section to Sales.jsx

**Files:**
- Modify: `src/pages/Sales.jsx`

The `usePricing` hook is already imported and used in `Sales.jsx` (it powers discovery/SFH prices). We can reuse it here — `prices` is a map of all Firestore pricing docs, each with a `category` field. Filter for `miscellaneous` and render.

The existing `.sales-accessories` CSS classes (already defined in the file around line 3800) provide exactly the right styles for a 4-column card grid. Reuse them.

- [ ] **Step 1: Find where usePricing is called in Sales.jsx**

Search for `usePricing` in `Sales.jsx`. It will be inside the main `SalesPage` component function (or similar). It looks like:

```js
const { prices, loading, p, fmt } = usePricing();
```

Note the line number — the misc items derivation goes right after it.

- [ ] **Step 2: Derive miscItems from prices**

Immediately after the `usePricing` call, add:

```js
const miscItems = Object.entries(prices)
  .filter(([, doc]) => doc.category === 'miscellaneous')
  .map(([id, doc]) => ({ id, ...doc }))
  .sort((a, b) => (a.label || '').localeCompare(b.label || ''));
```

The `.sort` keeps the display order stable as items are added/removed in the admin.

- [ ] **Step 3: Add the Miscellaneous section JSX**

Find the accessories section in the JSX render. Search for `className="sales-accessories"` — if it exists as a rendered section, add the misc section immediately after it. If the accessories section is not rendered (the CSS exists but the JSX is unused), add the misc section before the training section (`className="sales-training"`).

Add this block:

```jsx
{!loading && miscItems.length > 0 && (
  <section className="sales-accessories">
    <div className="sales-accessories__container">
      <div className="sales-section-header" style={{ marginBottom: '2rem' }}>
        <span style={{ fontSize: '0.7rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em', color: '#888' }}>
          Miscellaneous
        </span>
        <h2 style={{ fontSize: 'clamp(1.75rem, 3.5vw, 2.5rem)', margin: '0.5rem 0 0', textTransform: 'uppercase', fontWeight: 700 }}>
          Parts &amp; Accessories
        </h2>
      </div>
      <div className="sales-accessories__grid">
        {miscItems.map((item) => (
          <div key={item.id} className="sales-accessories__item">
            <span className="sales-accessories__category">
              {item.condition === 'used' ? 'Used' : 'New'}
            </span>
            <h4>{item.label}</h4>
            {item.description && (
              <p style={{ fontSize: '0.75rem', color: '#888', margin: '0 0 0.5rem', lineHeight: 1.4 }}>{item.description}</p>
            )}
            <span className="sales-accessories__price">
              {item.price > 0 ? '£' + (item.price / 100).toLocaleString('en-GB', { minimumFractionDigits: 0, maximumFractionDigits: 0 }) : 'POA'}
            </span>
          </div>
        ))}
      </div>
      <div className="sales-accessories__cta">
        <a href="/contact" className="sales-btn sales-btn--outline">Enquire About Any Item</a>
      </div>
    </div>
  </section>
)}
```

Note: items with `price === 0` display as "POA" — this handles the seeded placeholder prices gracefully until staff updates them.

- [ ] **Step 4: Verify in browser**

Navigate to `/sales`. Confirm:
- The Miscellaneous section appears with the 7 seeded items
- Each card shows "New" as the condition badge
- Items with `price === 0` show "POA"
- The section is in a 4-column grid on desktop
- Setting all prices to 0 (the seed default) shows all as POA — section still renders
- If you delete all misc items via admin, the section disappears

- [ ] **Step 5: Commit**

```bash
git add src/pages/Sales.jsx
git commit -m "feat: add miscellaneous section to Sales page"
```

---

### Task 4: Post-implementation — set real prices

This is a manual admin task, not a code task.

- [ ] **Step 1: Open admin pricing panel**

Navigate to `/admin/pricing` while logged in.

- [ ] **Step 2: Update prices for all 7 miscellaneous items**

Click Edit on each item and set:
- Real price in pounds (e.g. `24.99`)
- Correct condition (New or Used)
- Optional description

Save each item. The Sales page will reflect changes within 5 minutes (cache TTL).

- [ ] **Step 3: Verify on Sales page**

Navigate to `/sales`. Confirm all 7 items show correct prices (not POA).

# Miscellaneous Page, Subsection & Admin Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a proper Miscellaneous admin section (`/admin/misc`) with image upload, a public `/misc` catalogue page with category filtering, and a collapsible subsection in `Experimentation.jsx` — all backed by a new `misc_items` Firestore collection — while removing the previous (wrong) implementation that shoehorned misc items into the `pricing` collection.

**Architecture:** New Firestore collection `misc_items` with fields `{name, category, priceDisplay, condition, description, images[]}`. Admin CRUD follows the existing AdminListings/AdminListingEdit pattern exactly. Public page (`Misc.jsx`) uses inline `<style>` tag with the `fd-sales__` design language. Experimentation.jsx subsection reads from `misc_items` via `useCollection` (already imported). All previous misc work in `pricing`, `AdminPricing`, and `Sales.jsx` is cleanly removed first.

**Tech Stack:** React, React Router v6, Firebase Firestore (`useCollection`, `createDoc`, `updateDocById`, `deleteDocById`), Firebase Storage (`uploadBytes`, `getDownloadURL`), Space Grotesk + Share Tech Mono fonts, Font Awesome icons.

**Spec:** `docs/superpowers/specs/2026-04-16-misc-page-and-admin-design.md`

---

## File Map

| File | Action | Purpose |
|------|--------|---------|
| `scripts/seed-pricing.js` | Modify | Remove 7 `misc_*` entries |
| `src/pages/admin/AdminPricing.jsx` | Modify | Revert all miscellaneous changes |
| `src/pages/Sales.jsx` | Modify | Remove miscItems derivation + section |
| `src/pages/admin/AdminMiscItems.jsx` | Create | Misc items list page |
| `src/pages/admin/AdminMiscItemEdit.jsx` | Create | Misc item create/edit form |
| `src/components/admin/AdminLayout.jsx` | Modify | Add Misc Items nav entry |
| `src/App.jsx` | Modify | Add imports + routes |
| `src/pages/Misc.jsx` | Create | Public /misc catalogue page |
| `src/pages/Experimentation.jsx` | Modify | Add subsection + state + CSS |

---

### Task 1: Remove previous miscellaneous implementation

**Files:**
- Modify: `scripts/seed-pricing.js` (lines 105–113)
- Modify: `src/pages/admin/AdminPricing.jsx` (multiple sections)
- Modify: `src/pages/Sales.jsx` (lines ~899 and ~1670)

This task cleans the slate before building the correct implementation.

- [ ] **Step 1: Remove misc_* entries from seed-pricing.js**

In `scripts/seed-pricing.js`, remove the entire miscellaneous block (lines 105–113). The file should end with the costs block followed directly by `];`:

Remove these lines:
```js
// ── Miscellaneous — Sales page display only ────────────────────────────────
{ id: 'misc_cover_r22',         label: 'Helicopter Cover (R22)', category: 'miscellaneous', condition: 'new', price: 0, description: '' },
{ id: 'misc_cover_r44',         label: 'Helicopter Cover (R44)', category: 'miscellaneous', condition: 'new', price: 0, description: '' },
{ id: 'misc_mover',             label: 'Helicopter Mover',       category: 'miscellaneous', condition: 'new', price: 0, description: '' },
{ id: 'misc_start_stick',       label: 'Start Stick',            category: 'miscellaneous', condition: 'new', price: 0, description: '' },
{ id: 'misc_pooleys_logbook',   label: 'Pooleys Logbook',        category: 'miscellaneous', condition: 'new', price: 0, description: '' },
{ id: 'misc_revision_material', label: 'Revision Material',      category: 'miscellaneous', condition: 'new', price: 0, description: '' },
{ id: 'misc_hq_merch',          label: 'HQ Merchandise',         category: 'miscellaneous', condition: 'new', price: 0, description: '' },
```

After removal, line 104 (`costs_total_to` entry) should be followed directly by `];`.

- [ ] **Step 2: Revert AdminPricing.jsx — CATEGORIES**

In `src/pages/admin/AdminPricing.jsx`, replace the current `CATEGORIES` array (lines 6–22) with the two-entry original:

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
];
```

- [ ] **Step 3: Revert AdminPricing.jsx — EMPTY_NEW**

Find line 33:
```js
const EMPTY_NEW = { label: '', price: '', description: '', category: 'discovery', condition: 'new' };
```
Replace with:
```js
const EMPTY_NEW = { label: '', price: '', description: '', category: 'discovery' };
```

- [ ] **Step 4: Revert AdminPricing.jsx — startEdit**

Find `startEdit` and replace with the original (no condition field):
```js
function startEdit(item) {
  setEditing((e) => ({
    ...e,
    [item.id]: {
      price:       penceToPounds(item.price),
      label:       item.label,
      description: item.description || '',
    },
  }));
}
```

- [ ] **Step 5: Revert AdminPricing.jsx — saveEdit**

Find `saveEdit` and replace with the original (no condition, no item lookup):
```js
async function saveEdit(id) {
  setSaving(id);
  try {
    const ed = editing[id];
    await updateDocById('pricing', id, {
      price:       poundsToAppence(ed.price),
      label:       ed.label,
      description: ed.description,
    });
    cancelEdit(id);
  } finally {
    setSaving(null);
  }
}
```

- [ ] **Step 6: Revert AdminPricing.jsx — handleCreate**

Find `handleCreate` and replace with the original (spread newItem, no condition):
```js
async function handleCreate(e) {
  e.preventDefault();
  setCreating(true);
  try {
    await createDoc('pricing', {
      ...newItem,
      price: poundsToAppence(newItem.price),
    });
    setNewItem(EMPTY_NEW);
    setAdding(false);
  } finally {
    setCreating(false);
  }
}
```

- [ ] **Step 7: Revert AdminPricing.jsx — grouped reducer**

Find the grouped reducer (currently around line 123) and replace with the original (no miscellaneous bypass):
```js
const grouped = CATEGORY_IDS.reduce((acc, id) => {
  acc[id] = items.filter((i) => i.category === id && WEBSITE_IDS.has(i.id));
  return acc;
}, {});
```

- [ ] **Step 8: Revert AdminPricing.jsx — table header**

Find the table header `{(cat.id === 'miscellaneous' ? [...] : [...]).map(...)}` and replace with the original always-4-column version:
```jsx
{['Label', 'Price', 'Description', ''].map((h) => (
  <th key={h} style={{ padding: '0.5rem 0.75rem', textAlign: 'left', color: '#374151', fontWeight: 600 }}>{h}</th>
))}
```

- [ ] **Step 9: Revert AdminPricing.jsx — remove condition table cell**

Find and remove the entire condition `<td>` block from the table row. It looks like:
```jsx
{cat.id === 'miscellaneous' && (
  <td style={{ padding: '0.6rem 0.75rem', color: '#6b7280', fontSize: '0.8rem' }}>
    {ed
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
    }
  </td>
)}
```
Delete this entire block. The table row should have: Label td, Price td, Description td, Actions td — four cells only.

- [ ] **Step 10: Revert AdminPricing.jsx — remove condition dropdown from add form**

Find and remove the condition dropdown from the add item form:
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
Delete this entire block from the add form.

- [ ] **Step 11: Remove miscItems from Sales.jsx**

In `src/pages/Sales.jsx`:

**a)** Find and remove the `usePricing` import at line 16:
```js
import { usePricing } from '../hooks/usePricing';
```

**b)** Find and remove the `usePricing` hook call and `miscItems` derivation (around lines 897–902). This looks like:
```js
const { prices, loading } = usePricing();
const miscItems = Object.entries(prices)
  .filter(([, doc]) => doc.category === 'miscellaneous')
  .map(([id, doc]) => ({ id, ...doc }))
  .sort((a, b) => (a.label || '').localeCompare(b.label || '', 'en-GB'));
```
Remove all 5 lines.

**c)** Find and remove the entire miscellaneous section JSX block. It starts with `{!loading && miscItems.length > 0 && (` and ends after the closing `</section>` and `)}`. The block looks like:
```jsx
{!loading && miscItems.length > 0 && (
  <section className="sales-accessories">
    <div className="sales-accessories__container">
      ...
    </div>
  </section>
)}
```
Remove the entire conditional block.

- [ ] **Step 12: Commit cleanup**

```bash
git add scripts/seed-pricing.js src/pages/admin/AdminPricing.jsx src/pages/Sales.jsx
git commit -m "revert: remove miscellaneous pricing implementation (replacing with misc_items collection)"
```

---

### Task 2: Create AdminMiscItems list page

**Files:**
- Create: `src/pages/admin/AdminMiscItems.jsx`

This page is identical in structure to `AdminListings.jsx` but uses the `misc_items` collection and shows Name, Category, Price, Condition columns.

- [ ] **Step 1: Create the file**

Create `src/pages/admin/AdminMiscItems.jsx` with this complete content:

```jsx
import { useState } from 'react';
import { Link } from 'react-router-dom';
import AdminLayout from '../../components/admin/AdminLayout';
import { useCollection, deleteDocById } from '../../hooks/useFirestore';

export default function AdminMiscItems() {
  const { docs: items, loading } = useCollection('misc_items');
  const [deleting, setDeleting] = useState(null);

  async function handleDelete(id) {
    if (!window.confirm('Delete this item? This cannot be undone.')) return;
    setDeleting(id);
    try {
      await deleteDocById('misc_items', id);
    } finally {
      setDeleting(null);
    }
  }

  return (
    <AdminLayout>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
        <h1 style={{ fontSize: '1.5rem', fontWeight: 700, color: '#111827' }}>Miscellaneous Items</h1>
        <Link
          to="/admin/misc/new"
          style={{
            background: '#111827', color: '#fff', padding: '0.5rem 1rem',
            borderRadius: '6px', textDecoration: 'none', fontSize: '0.875rem', fontWeight: 600,
          }}
        >
          + New Item
        </Link>
      </div>

      {loading ? (
        <p style={{ color: '#6b7280' }}>Loading…</p>
      ) : items.length === 0 ? (
        <p style={{ color: '#6b7280' }}>No items yet. Click "+ New Item" to add one.</p>
      ) : (
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.875rem' }}>
            <thead>
              <tr style={{ borderBottom: '2px solid #e5e7eb' }}>
                {['Name', 'Category', 'Price', 'Condition', ''].map((h) => (
                  <th key={h} style={{ padding: '0.75rem 1rem', textAlign: 'left', color: '#374151', fontWeight: 600 }}>
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {items.map((item) => (
                <tr key={item.id} style={{ borderBottom: '1px solid #f3f4f6' }}>
                  <td style={{ padding: '0.75rem 1rem', fontWeight: 500, color: '#111827' }}>{item.name}</td>
                  <td style={{ padding: '0.75rem 1rem', color: '#6b7280' }}>{item.category}</td>
                  <td style={{ padding: '0.75rem 1rem', color: '#111827' }}>{item.priceDisplay || '—'}</td>
                  <td style={{ padding: '0.75rem 1rem', color: '#6b7280' }}>
                    {item.condition === 'used' ? 'Used' : 'New'}
                  </td>
                  <td style={{ padding: '0.75rem 1rem', whiteSpace: 'nowrap' }}>
                    <Link
                      to={`/admin/misc/${item.id}`}
                      style={{ color: '#2563eb', textDecoration: 'none', marginRight: '1rem', fontWeight: 500 }}
                    >
                      Edit
                    </Link>
                    <button
                      onClick={() => handleDelete(item.id)}
                      disabled={deleting === item.id}
                      style={{
                        background: 'none', border: 'none', color: '#dc2626',
                        cursor: 'pointer', fontWeight: 500, fontSize: '0.875rem',
                      }}
                    >
                      {deleting === item.id ? 'Deleting…' : 'Delete'}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </AdminLayout>
  );
}
```

- [ ] **Step 2: Commit**

```bash
git add src/pages/admin/AdminMiscItems.jsx
git commit -m "feat: add AdminMiscItems list page"
```

---

### Task 3: Create AdminMiscItemEdit form page

**Files:**
- Create: `src/pages/admin/AdminMiscItemEdit.jsx`

This page follows the exact same pattern as `AdminListingEdit.jsx` but with simpler fields: name, category, priceDisplay, condition, description, and images. No specs sub-object, no equipment list, no featured checkbox, no aircraft-specific fields. Storage path uses `misc_items/` prefix.

- [ ] **Step 1: Create the file**

Create `src/pages/admin/AdminMiscItemEdit.jsx` with this complete content:

```jsx
import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { doc, getDoc } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import AdminLayout from '../../components/admin/AdminLayout';
import { db, storage } from '../../lib/firebase';
import { createDoc, updateDocById } from '../../hooks/useFirestore';

const EMPTY = {
  name: '',
  category: '',
  priceDisplay: '',
  condition: 'new',
  description: '',
  images: [],
};

export default function AdminMiscItemEdit() {
  const { id } = useParams();
  const navigate = useNavigate();
  const isNew = id === 'new';

  const [form, setForm] = useState(EMPTY);
  const [loading, setLoading] = useState(!isNew);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (isNew) return;
    getDoc(doc(db, 'misc_items', id)).then((snap) => {
      if (snap.exists()) {
        setForm({ ...EMPTY, ...snap.data(), images: snap.data().images || [] });
      }
      setLoading(false);
    });
  }, [id, isNew]);

  function set(field, value) {
    setForm((f) => ({ ...f, [field]: value }));
  }

  async function handleImageUpload(e) {
    const files = Array.from(e.target.files);
    if (!files.length) return;
    setUploading(true);
    try {
      const uploaded = await Promise.all(
        files.map(async (file) => {
          const storageRef = ref(storage, `misc_items/${Date.now()}-${file.name}`);
          await uploadBytes(storageRef, file);
          const url = await getDownloadURL(storageRef);
          return { url, alt: file.name.replace(/\.[^.]+$/, ''), isPrimary: false };
        })
      );
      setForm((f) => {
        const imgs = [...f.images, ...uploaded];
        if (imgs.length > 0 && !imgs.some((i) => i.isPrimary)) {
          imgs[0] = { ...imgs[0], isPrimary: true };
        }
        return { ...f, images: imgs };
      });
    } finally {
      setUploading(false);
    }
  }

  function setPrimary(idx) {
    setForm((f) => ({
      ...f,
      images: f.images.map((img, i) => ({ ...img, isPrimary: i === idx })),
    }));
  }

  function removeImage(idx) {
    setForm((f) => {
      const imgs = f.images.filter((_, i) => i !== idx);
      if (imgs.length > 0 && !imgs.some((i) => i.isPrimary)) {
        imgs[0] = { ...imgs[0], isPrimary: true };
      }
      return { ...f, images: imgs };
    });
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setSaving(true);
    setError('');
    try {
      if (isNew) {
        const newId = await createDoc('misc_items', form);
        navigate(`/admin/misc/${newId}`);
      } else {
        await updateDocById('misc_items', id, form);
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  }

  const fieldStyle = {
    width: '100%', padding: '0.5rem 0.75rem', border: '1px solid #d1d5db',
    borderRadius: '6px', fontSize: '0.875rem', color: '#111827',
    boxSizing: 'border-box',
  };
  const labelStyle = {
    display: 'block', fontWeight: 600, fontSize: '0.75rem', color: '#374151',
    marginBottom: '0.25rem', textTransform: 'uppercase', letterSpacing: '0.05em',
  };

  if (loading) return <AdminLayout><p style={{ color: '#6b7280' }}>Loading…</p></AdminLayout>;

  return (
    <AdminLayout>
      <div style={{ maxWidth: '720px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
          <h1 style={{ fontSize: '1.5rem', fontWeight: 700, color: '#111827' }}>
            {isNew ? 'New Misc Item' : `Edit: ${form.name}`}
          </h1>
          <button
            onClick={() => navigate('/admin/misc')}
            style={{ background: 'none', border: '1px solid #d1d5db', padding: '0.4rem 0.75rem', borderRadius: '6px', cursor: 'pointer', fontSize: '0.875rem' }}
          >
            ← Back
          </button>
        </div>

        {error && (
          <div style={{ background: '#fee2e2', color: '#991b1b', padding: '0.75rem 1rem', borderRadius: '6px', marginBottom: '1rem', fontSize: '0.875rem' }}>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div>
              <label style={labelStyle}>Name</label>
              <input style={fieldStyle} value={form.name} onChange={(e) => set('name', e.target.value)} required placeholder="e.g. R22 Helicopter Cover" />
            </div>
            <div>
              <label style={labelStyle}>Category</label>
              <input style={fieldStyle} value={form.category} onChange={(e) => set('category', e.target.value)} placeholder="e.g. Apparel, Ground Equipment" />
            </div>
            <div>
              <label style={labelStyle}>Price Display</label>
              <input style={fieldStyle} value={form.priceDisplay} onChange={(e) => set('priceDisplay', e.target.value)} placeholder="e.g. £250 or POA" />
            </div>
            <div>
              <label style={labelStyle}>Condition</label>
              <select style={fieldStyle} value={form.condition} onChange={(e) => set('condition', e.target.value)}>
                <option value="new">New</option>
                <option value="used">Used</option>
              </select>
            </div>
          </div>

          <div>
            <label style={labelStyle}>Description</label>
            <textarea
              style={{ ...fieldStyle, minHeight: '80px', resize: 'vertical' }}
              value={form.description}
              onChange={(e) => set('description', e.target.value)}
              placeholder="Optional — shown on the public catalogue page"
            />
          </div>

          <div>
            <label style={labelStyle}>Images</label>
            <input type="file" accept="image/*" multiple onChange={handleImageUpload} disabled={uploading} />
            {uploading && <p style={{ color: '#6b7280', fontSize: '0.8rem', marginTop: '0.25rem' }}>Uploading…</p>}
            {form.images.length > 0 && (
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.75rem', marginTop: '0.75rem' }}>
                {form.images.map((img, i) => (
                  <div key={i} style={{ position: 'relative', width: '120px' }}>
                    <img
                      src={img.url}
                      alt={img.alt}
                      style={{ width: '120px', height: '80px', objectFit: 'cover', borderRadius: '6px', border: img.isPrimary ? '2px solid #2563eb' : '2px solid transparent' }}
                    />
                    <div style={{ display: 'flex', gap: '4px', marginTop: '4px' }}>
                      <button
                        type="button"
                        onClick={() => setPrimary(i)}
                        style={{ fontSize: '0.65rem', padding: '2px 6px', background: img.isPrimary ? '#2563eb' : '#e5e7eb', color: img.isPrimary ? '#fff' : '#374151', border: 'none', borderRadius: '4px', cursor: 'pointer' }}
                      >
                        {img.isPrimary ? 'Primary' : 'Set Primary'}
                      </button>
                      <button
                        type="button"
                        onClick={() => removeImage(i)}
                        style={{ fontSize: '0.65rem', padding: '2px 6px', background: '#fee2e2', color: '#dc2626', border: 'none', borderRadius: '4px', cursor: 'pointer' }}
                      >
                        ✕
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div style={{ paddingTop: '0.5rem' }}>
            <button
              type="submit"
              disabled={saving}
              style={{
                background: '#111827', color: '#fff', padding: '0.625rem 1.5rem',
                border: 'none', borderRadius: '6px', fontWeight: 600, cursor: 'pointer',
                fontSize: '0.875rem', opacity: saving ? 0.6 : 1,
              }}
            >
              {saving ? 'Saving…' : isNew ? 'Create Item' : 'Save Changes'}
            </button>
          </div>
        </form>
      </div>
    </AdminLayout>
  );
}
```

- [ ] **Step 2: Commit**

```bash
git add src/pages/admin/AdminMiscItemEdit.jsx
git commit -m "feat: add AdminMiscItemEdit create/edit form"
```

---

### Task 4: Wire admin pages into nav and routing

**Files:**
- Modify: `src/components/admin/AdminLayout.jsx`
- Modify: `src/App.jsx`

- [ ] **Step 1: Add Misc Items to AdminLayout nav**

In `src/components/admin/AdminLayout.jsx`, find `NAV_ITEMS` (line 7). The current array starts with Dashboard, then Listings. Add the Misc Items entry immediately after the Listings entry:

Current (lines 8–9):
```js
{ to: '/admin/listings', icon: '✈️', label: 'Listings' },
{ to: '/admin/images', icon: '🖼️', label: 'Images' },
```

Replace with:
```js
{ to: '/admin/listings', icon: '✈️', label: 'Listings' },
{ to: '/admin/misc', icon: '🛒', label: 'Misc Items' },
{ to: '/admin/images', icon: '🖼️', label: 'Images' },
```

- [ ] **Step 2: Add imports to App.jsx**

In `src/App.jsx`, find the admin imports block (lines 82–83 are AdminListings and AdminListingEdit). Add the two new admin imports immediately after AdminListingEdit:

After:
```js
import AdminListingEdit from './pages/admin/AdminListingEdit';
```

Add:
```js
import AdminMiscItems from './pages/admin/AdminMiscItems';
import AdminMiscItemEdit from './pages/admin/AdminMiscItemEdit';
```

- [ ] **Step 3: Add routes to App.jsx**

In `src/App.jsx`, find the listings routes (lines 184–185):
```jsx
<Route path="/admin/listings" element={<AdminRoute><AdminListings /></AdminRoute>} />
<Route path="/admin/listings/:id" element={<AdminRoute><AdminListingEdit /></AdminRoute>} />
```

Add the misc routes immediately after:
```jsx
<Route path="/admin/misc" element={<AdminRoute><AdminMiscItems /></AdminRoute>} />
<Route path="/admin/misc/:id" element={<AdminRoute><AdminMiscItemEdit /></AdminRoute>} />
```

- [ ] **Step 4: Verify admin wiring**

Start the dev server (`npm run dev:vite`) and:
- Navigate to `/admin/misc` — should see the Miscellaneous Items list page
- Sidebar should show "Misc Items" between "Listings" and "Images"
- Click "+ New Item" — should navigate to `/admin/misc/new` and show the create form
- Fill in Name="Test Item", Category="Test", Price="POA", Condition="New", click "Create Item"
- Should redirect to `/admin/misc/<new-id>` with the item loaded
- Navigate back to `/admin/misc` — should see the item in the table
- Click Delete — confirm the item is removed

- [ ] **Step 5: Commit**

```bash
git add src/components/admin/AdminLayout.jsx src/App.jsx
git commit -m "feat: wire AdminMiscItems and AdminMiscItemEdit into nav and routing"
```

---

### Task 5: Create public /misc catalogue page

**Files:**
- Create: `src/pages/Misc.jsx`
- Modify: `src/App.jsx` (add import + public route)

- [ ] **Step 1: Create Misc.jsx**

Create `src/pages/Misc.jsx` with this complete content:

```jsx
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useCollection } from '../hooks/useFirestore';
import FooterMinimal from '../components/FooterMinimal';

function MiscNav() {
  return (
    <header style={{
      position: 'fixed', top: 0, left: 0, right: 0, zIndex: 100,
      background: '#1a1a1a', padding: '0 2rem', height: '60px',
      display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      borderBottom: '1px solid rgba(255,255,255,0.08)',
    }}>
      <Link to="/" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
        <span style={{ fontFamily: "'Space Grotesk', sans-serif", fontWeight: 700, fontSize: '1rem', color: '#fff', letterSpacing: '-0.02em' }}>
          HQ Aviation
        </span>
      </Link>
      <nav style={{ display: 'flex', gap: '2rem', alignItems: 'center' }}>
        {[
          { to: '/sales', label: 'Aircraft' },
          { to: '/training', label: 'Training' },
          { to: '/services', label: 'Services' },
          { to: '/misc', label: 'Miscellaneous' },
          { to: '/contact', label: 'Contact' },
        ].map(({ to, label }) => (
          <Link
            key={to}
            to={to}
            style={{
              fontFamily: "'Space Grotesk', sans-serif",
              fontSize: '0.7rem', fontWeight: 600,
              textTransform: 'uppercase', letterSpacing: '0.08em',
              color: to === '/misc' ? '#fff' : '#9ca3af',
              textDecoration: 'none',
              transition: 'color 0.15s ease',
            }}
          >
            {label}
          </Link>
        ))}
      </nav>
    </header>
  );
}

const CSS = `
  *, *::before, *::after { box-sizing: border-box; }

  .misc-hero {
    padding: 8rem 2rem 5rem;
    background: #1a1a1a;
  }
  .misc-container {
    max-width: 1100px;
    margin: 0 auto;
  }
  .misc-eyebrow {
    font-family: 'Share Tech Mono', monospace;
    font-size: 0.7rem;
    text-transform: uppercase;
    letter-spacing: 0.12em;
    color: #666;
    display: block;
    margin-bottom: 1rem;
  }
  .misc-title {
    font-family: 'Space Grotesk', sans-serif;
    font-size: clamp(2.5rem, 6vw, 4.5rem);
    font-weight: 700;
    text-transform: uppercase;
    color: #fff;
    line-height: 1.0;
    margin-bottom: 1rem;
    letter-spacing: -0.02em;
  }
  .misc-subtitle {
    font-family: 'Space Grotesk', sans-serif;
    font-size: 1rem;
    color: rgba(255,255,255,0.45);
    line-height: 1.7;
    max-width: 480px;
  }
  .misc-catalogue {
    padding: 3.5rem 2rem 6rem;
    background: #faf9f6;
    min-height: 60vh;
  }
  .misc-filter {
    display: flex;
    flex-wrap: wrap;
    gap: 0.5rem;
    margin-bottom: 2.5rem;
  }
  .misc-filter__pill {
    font-family: 'Space Grotesk', sans-serif;
    font-size: 0.7rem;
    font-weight: 600;
    text-transform: uppercase;
    letter-spacing: 0.06em;
    padding: 0.4rem 1rem;
    border: 1px solid #e8e6e2;
    border-radius: 4px;
    background: transparent;
    color: #666;
    cursor: pointer;
    transition: all 0.2s ease;
  }
  .misc-filter__pill:hover {
    border-color: #1a1a1a;
    color: #1a1a1a;
  }
  .misc-filter__pill--active {
    background: #1a1a1a;
    color: #fff;
    border-color: #1a1a1a;
  }
  .misc-grid {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: 1.5rem;
  }
  .misc-card {
    background: #fff;
    border: 1px solid #e8e6e2;
    border-radius: 6px;
    overflow: hidden;
    transition: all 0.3s ease;
    display: flex;
    flex-direction: column;
  }
  .misc-card:hover {
    transform: translateY(-4px);
    box-shadow: 0 8px 24px rgba(0,0,0,0.08);
    border-color: #ccc;
  }
  .misc-card__image {
    aspect-ratio: 4 / 3;
    background: linear-gradient(135deg, #f5f4f0 0%, #eae8e2 100%);
    overflow: hidden;
    display: flex;
    align-items: center;
    justify-content: center;
  }
  .misc-card__image img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    transition: transform 0.4s ease;
    display: block;
  }
  .misc-card:hover .misc-card__image img {
    transform: scale(1.04);
  }
  .misc-card__image-placeholder {
    font-size: 2.5rem;
    color: #ccc;
  }
  .misc-card__body {
    padding: 1.25rem;
    display: flex;
    flex-direction: column;
    flex: 1;
  }
  .misc-card__category {
    font-family: 'Share Tech Mono', monospace;
    font-size: 0.58rem;
    text-transform: uppercase;
    letter-spacing: 0.1em;
    color: #888;
    display: block;
    margin-bottom: 0.35rem;
  }
  .misc-card__name {
    font-family: 'Space Grotesk', sans-serif;
    font-size: 0.95rem;
    font-weight: 700;
    color: #1a1a1a;
    margin: 0 0 0.4rem;
    line-height: 1.3;
  }
  .misc-card__desc {
    font-size: 0.8rem;
    color: #888;
    line-height: 1.5;
    margin: 0 0 0.75rem;
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    overflow: hidden;
  }
  .misc-card__footer {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding-top: 0.75rem;
    border-top: 1px solid #e8e6e2;
    margin-bottom: 0.75rem;
    margin-top: auto;
  }
  .misc-card__condition {
    font-family: 'Share Tech Mono', monospace;
    font-size: 0.58rem;
    text-transform: uppercase;
    letter-spacing: 0.08em;
    padding: 2px 8px;
    border-radius: 3px;
    font-weight: 600;
  }
  .misc-card__condition--new {
    background: #f0fdf4;
    color: #166534;
  }
  .misc-card__condition--used {
    background: #fef3c7;
    color: #92400e;
  }
  .misc-card__price {
    font-family: 'Share Tech Mono', monospace;
    font-size: 0.9rem;
    font-weight: 700;
    color: #1a1a1a;
  }
  .misc-card__enquire {
    display: block;
    text-align: center;
    padding: 0.5rem;
    background: #1a1a1a;
    color: #fff;
    font-family: 'Space Grotesk', sans-serif;
    font-size: 0.65rem;
    font-weight: 600;
    text-transform: uppercase;
    letter-spacing: 0.08em;
    border-radius: 4px;
    text-decoration: none;
    transition: background 0.2s ease;
  }
  .misc-card__enquire:hover {
    background: #333;
  }
  .misc-loading {
    color: #888;
    padding: 4rem 0;
    font-size: 0.9rem;
    font-family: 'Space Grotesk', sans-serif;
  }
  .misc-empty {
    text-align: center;
    padding: 5rem 0;
  }
  .misc-empty__text {
    font-family: 'Space Grotesk', sans-serif;
    color: #888;
    font-size: 0.9rem;
  }
  @media (max-width: 1024px) {
    .misc-grid { grid-template-columns: repeat(2, 1fr); }
  }
  @media (max-width: 640px) {
    .misc-grid { grid-template-columns: 1fr; }
    .misc-hero { padding: 6rem 1.5rem 3.5rem; }
    .misc-catalogue { padding: 2rem 1.5rem 4rem; }
    .misc-container { padding: 0 1.5rem; }
  }
`;

export default function Misc() {
  const { docs: items, loading } = useCollection('misc_items');
  const [activeCategory, setActiveCategory] = useState('All');

  const categories = ['All', ...new Set(items.map((i) => i.category).filter(Boolean).sort())];
  const filtered = activeCategory === 'All' ? items : items.filter((i) => i.category === activeCategory);

  return (
    <>
      <style>{CSS}</style>
      <MiscNav />
      <main>
        <section className="misc-hero">
          <div className="misc-container">
            <span className="misc-eyebrow">HQ Aviation</span>
            <h1 className="misc-title">Miscellaneous</h1>
            <p className="misc-subtitle">
              Accessories, apparel, ground equipment, training materials and more — everything beyond the aircraft itself, sourced and stocked by HQ.
            </p>
          </div>
        </section>

        <section className="misc-catalogue">
          <div className="misc-container">
            {loading ? (
              <p className="misc-loading">Loading…</p>
            ) : (
              <>
                {categories.length > 1 && (
                  <div className="misc-filter">
                    {categories.map((cat) => (
                      <button
                        key={cat}
                        className={`misc-filter__pill ${activeCategory === cat ? 'misc-filter__pill--active' : ''}`}
                        onClick={() => setActiveCategory(cat)}
                      >
                        {cat}
                      </button>
                    ))}
                  </div>
                )}

                {filtered.length === 0 ? (
                  <div className="misc-empty">
                    <p className="misc-empty__text">No items in this category yet.</p>
                  </div>
                ) : (
                  <div className="misc-grid">
                    {filtered.map((item) => {
                      const primary = item.images?.find((i) => i.isPrimary) || item.images?.[0];
                      return (
                        <div key={item.id} className="misc-card">
                          <div className="misc-card__image">
                            {primary ? (
                              <img src={primary.url} alt={primary.alt || item.name} />
                            ) : (
                              <div className="misc-card__image-placeholder">
                                <i className="fas fa-box"></i>
                              </div>
                            )}
                          </div>
                          <div className="misc-card__body">
                            <span className="misc-card__category">{item.category}</span>
                            <h3 className="misc-card__name">{item.name}</h3>
                            {item.description && (
                              <p className="misc-card__desc">{item.description}</p>
                            )}
                            <div className="misc-card__footer">
                              <span className={`misc-card__condition misc-card__condition--${item.condition || 'new'}`}>
                                {item.condition === 'used' ? 'Used' : 'New'}
                              </span>
                              <span className="misc-card__price">{item.priceDisplay || 'POA'}</span>
                            </div>
                            <Link to="/contact" className="misc-card__enquire">Enquire</Link>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </>
            )}
          </div>
        </section>
      </main>
      <FooterMinimal />
    </>
  );
}
```

- [ ] **Step 2: Add Misc import and route to App.jsx**

In `src/App.jsx`, find the public page imports near the top (around line 32 where `Sales` is imported). Add:
```js
import Misc from './pages/Misc';
```

Then in the routes section, find the public routes and add:
```jsx
<Route path="/misc" element={<Misc />} />
```

Place it near the other top-level public routes (alongside `/sales`, `/training`, etc.).

- [ ] **Step 3: Verify in browser**

Navigate to `/misc`:
- Dark nav bar with "HQ Aviation" wordmark and nav links, "Miscellaneous" highlighted
- Black hero section with "MISCELLANEOUS" large uppercase heading
- If no items: warm off-white catalogue area with "Loading…" then empty state
- Add a test item via `/admin/misc/new` then return to `/misc` — item should appear in the grid
- If item has no image: placeholder icon shown
- If multiple categories exist: filter pills appear and function correctly

- [ ] **Step 4: Commit**

```bash
git add src/pages/Misc.jsx src/App.jsx
git commit -m "feat: add public /misc catalogue page with category filtering"
```

---

### Task 6: Add Miscellaneous subsection to Experimentation.jsx

**Files:**
- Modify: `src/pages/Experimentation.jsx`

This is the largest task. Three changes: (1) add `misc` to `salesExpanded` state, (2) add `useCollection('misc_items')` data fetch, (3) add the new subsection JSX after Robinson Unmanned, (4) add new CSS classes.

- [ ] **Step 1: Add `misc: false` to salesExpanded state**

Find line 1520:
```js
const [salesExpanded, setSalesExpanded] = useState({ new: false, preowned: false, rebuilt: false, tradein: false, unmanned: false });
```

Replace with:
```js
const [salesExpanded, setSalesExpanded] = useState({ new: false, preowned: false, rebuilt: false, tradein: false, unmanned: false, misc: false });
```

- [ ] **Step 2: Add miscItems data fetch**

`useCollection` is already imported at line 35. Find where other `useCollection` calls exist (around line 2798 where `allListings` is fetched). Add immediately after the existing `useCollection` call(s):

```js
const { docs: miscItems, loading: miscLoading } = useCollection('misc_items');
```

- [ ] **Step 3: Add the Miscellaneous subsection JSX**

Find line 4457 — this is the final closing `</div>` of the Robinson Unmanned subsection. Insert the following block immediately after it (after that `</div>`):

```jsx
<div className="fd-sales__subsection">
  <h3
    className={`fd-sales__section-title fd-sales__section-title--toggle ${salesExpanded.misc ? 'fd-sales__section-title--active' : ''}`}
    onClick={() => setSalesExpanded((prev) => ({ ...prev, misc: !prev.misc }))}
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

    {!miscLoading && miscItems.length > 0 && (
      <div className="fd-sales__grid fd-sales__grid--desktop fd-sales__grid--misc">
        {miscItems.slice(0, 4).map((item) => {
          const primary = item.images?.find((i) => i.isPrimary) || item.images?.[0];
          return (
            <Link key={item.id} to="/misc" className="fd-sales__card">
              <div className="fd-sales__card-image">
                {primary ? (
                  <img src={primary.url} alt={primary.alt || item.name} />
                ) : (
                  <span className="fd-sales__card-placeholder-icon">
                    <i className="fas fa-box"></i>
                  </span>
                )}
              </div>
              <div className="fd-sales__card-info">
                <span className="fd-sales__card-category">{item.category}</span>
                <h3>{item.name}</h3>
                <div className="fd-sales__card-meta">
                  <span className={`fd-sales__condition-badge fd-sales__condition-badge--${item.condition || 'new'}`}>
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

    {(miscLoading || miscItems.length === 0) && (
      <div className="fd-sales__unmanned-coming">
        <span className="fd-sales__unmanned-icon">
          <i className="fas fa-box-open"></i>
        </span>
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

- [ ] **Step 4: Add new CSS classes**

Find the inline `<style>` tag in Experimentation.jsx that contains the `fd-sales__` CSS. Search for `.fd-sales__card-price {` — add the following new class definitions immediately after it:

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
  display: flex;
  align-items: center;
  justify-content: center;
}

.fd-sales__grid--misc h3 {
  font-size: 0.9rem;
  font-weight: 600;
  margin: 0 0 0.25rem;
  color: #1a1a1a;
  line-height: 1.3;
}
```

- [ ] **Step 5: Verify in browser**

Navigate to the page that renders Experimentation.jsx. Scroll to the Sales section. Confirm:
- "Miscellaneous" appears as the last subsection after "Robinson Unmanned"
- Clicking the heading expands/collapses correctly with chevron animation
- If no misc items exist: the coming-soon placeholder renders with the box-open icon
- "Browse All Miscellaneous Items" button is visible at the bottom and links to `/misc`
- Add a test item via admin, reload the page — the item card should appear in the preview grid (up to 4 shown)

- [ ] **Step 6: Commit**

```bash
git add src/pages/Experimentation.jsx
git commit -m "feat: add Miscellaneous subsection to Experimentation.jsx sales section"
```

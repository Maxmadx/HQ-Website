# Parts Catalogue Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace the existing single-page parts contact form (`/parts` → `PartSales.jsx`) with a full browse-only parts catalogue: an indexable index page, per-listing detail pages with SEO Product schema, an admin CRUD UI, and a per-listing "Enquire" form that writes to a new `parts_enquiries` Firestore collection.

**Listings model — one doc per available unit (mirrors `misc_items`):**
- **Doc ID = Firestore auto-generated random string** (via `createDoc`). URL = `/parts/{id}` — opaque, exactly like `/misc/{id}`.
- `partNumber` is a **searchable field**, not the identifier. Multiple docs can share the same PN (e.g. one A102 listing for "new in stock" and another A102 listing for a specific used unit at a different price).
- **No `variants` array.** Each listing has exactly one `condition`, one `priceGbp`, and an optional `coreChargeGbp` (only meaningful for `exchange` condition). If you sell A102 in three conditions, that's three listings.
- Stock follows the misc_items pattern: `hasQuantity` + `stock`. Use `stock: 1` for a unique used unit (it goes off the catalogue once sold) and `stock: N` for new-in-stock with multiple identical units.
- `priceDisplay` is a denormalised rendered string (e.g. `"£14,000"` or `"POA"`), computed on save — mirrors misc_items so the admin list and the catalogue can render without recomputing.

**SEO consequence:** URL no longer contains the PN. That's fine — Google weights H1, `<title>`, and Product schema much more than URL keywords. The on-page H1 reads `"{partNumber} {title}"` ("A102 Tail Rotor Pitch Link") so the full search phrase is the strongest on-page signal. The "SEO load-bearing rule" below still applies.

**Architecture:** Mirror the existing `/misc` (public) and `/admin/misc` (admin) patterns. New Firestore collections: `parts` (catalogue) and `parts_enquiries` (queue). New API route `/api/parts-enquiry` follows the `/api/leads` rate-limit + admin-auth pattern. Reuse `buildProduct` / `buildItemList` JSON-LD builders that already exist in `src/components/seo/jsonLd.js`. Public listing/detail pages use `useCollection('parts')` / `useDocument('parts', id)` from `src/hooks/useFirestore.js`. The current `/parts` enquiry-form page is preserved at `/parts/enquiry` as a "can't find what you need?" fallback.

**Tech Stack:** React 19, Vite 8, react-router-dom 7, Firebase 12 (client) / firebase-admin 13 (server), Express 4, Zod 4, react-helmet-async 3, Vitest 4, plain `useState` for forms (no react-hook-form in this codebase).

**Phasing (matches the spec):**
- **Phase 1** — Tasks 1–5: data model + admin CRUD, internal-only (the catalogue is unreachable from public nav). Operations starts populating parts.
- **Phase 2** — Tasks 6–10: public `/parts` index + `/parts/:slug` detail + Product schema + sitemap entries. Catalogue is publicly browseable; detail pages have **no Enquire button yet** (just info + "general enquiry" fallback link).
- **Phase 3** — Tasks 11–15: `/api/parts-enquiry`, per-part Enquire button + form, admin enquiries queue.

**SEO load-bearing rule (per user direction):** every place a customer or search engine reads the part name must contain the **full combined string** `"{partNumber} {title}"` (e.g. `"A102 Tail Rotor Pitch Link"`). The two fields stay separate in storage, but they are concatenated for: the `<title>` tag, the H1, the meta description fallback, the og:title, the Product schema `name`, and ItemList entries. PN alone (without the title) only appears in: breadcrumbs, the `partNumber` field on the JSON-LD Product, and the URL slug.

**Conventions reused from this codebase:**
- All prices stored as **GBP pence** (integers). Render with `fmtGbp(pence)` (define locally — not yet exported).
- Firestore timestamps via `serverTimestamp()` (client) or `admin.firestore.FieldValue.serverTimestamp()` (server).
- Admin auth check in API: `requireAdmin` middleware verifying Bearer token + role claim (see `api/leads.js:19-32`).
- Admin role claim values: `'admin'` or `'super_admin'` (token claim, set via Firebase custom claims).
- Inline-styled JSX (no CSS modules); follow `AdminLeads.jsx` style for admin tables and `Misc.jsx` style for public catalogue.
- File naming: `Admin<Thing>.jsx` for list, `Admin<Thing>Edit.jsx` for edit form.
- All commits use the codebase's commit-message style (see `git log` recent messages — `feat(scope): summary` / `fix(scope): summary`).

---

## File Structure

**New files:**
- `src/lib/partsSchema.js` — Zod schema + price converters (single source of truth). No slugify helper — doc IDs are Firestore-auto-generated.
- `src/lib/partsSchema.test.js` — unit tests for the schema and converters.
- `src/pages/Parts.jsx` — public catalogue index (replaces current `/parts`).
- `src/pages/PartDetail.jsx` — public per-listing detail page.
- `src/pages/admin/AdminParts.jsx` — admin listings list.
- `src/pages/admin/AdminPartEdit.jsx` — admin create/edit form (single-condition listing).
- `src/pages/admin/AdminPartsEnquiries.jsx` — admin enquiries queue.
- `src/components/parts/EnquireModal.jsx` — modal form mounted on detail page.
- `api/parts-enquiry.js` — public POST endpoint + admin PATCH endpoint.
- `api/parts-enquiry.test.js` — integration test (mocked Firestore + nodemailer).

**Modified files:**
- `src/App.jsx` — add 5 new routes; rewrite `/parts` to point to new `Parts` page; add `/parts/enquiry` for legacy `PartSales`.
- `src/components/admin/AdminLayout.jsx` — add "Parts" + "Parts Enquiries" nav items with new-count badges.
- `firestore.rules` — add `parts` and `parts_enquiries` collection rules.
- `api/sitemap.js` — add a `parts` block to `fetchDynamicEntries` (mirrors the `misc_items` block at lines 87-94).
- `src/lib/seoRoutes.js` — leave `/parts` entry as-is (it already exists at line 19); confirm no change needed.
- `server.js` — mount the new `/api/parts-enquiry` router.

**Untouched / reused:**
- `src/pages/PartSales.jsx` — kept verbatim, just rerouted from `/parts` to `/parts/enquiry`.
- `src/components/seo/jsonLd.js` — `buildProduct`, `buildItemList`, `buildBreadcrumbList` already exist and are used as-is.
- `src/hooks/useFirestore.js` — `useCollection`, `useDocument`, `createDoc`, `updateDocById`, `deleteDocById` used as-is.
- `src/components/admin/AdminRoute.jsx` — guards new admin routes.
- `src/components/admin/AdminLayout.jsx` — wraps new admin pages.
- `src/components/seo/Seo.jsx` — used for `<title>` / `<meta>` / JSON-LD on public pages.

---

# Phase 1 — Data Model + Admin CRUD (Tasks 1–5)

## Task 1: Add Firestore rules for `parts` and `parts_enquiries`

**Why first:** the schema work and admin pages can't be tested locally (against the emulator or production) until rules permit reads/writes. We mirror the existing `misc_items` and `leads` rules.

**Files:**
- Modify: `firestore.rules:265-269` (add new collections under existing structure)

- [ ] **Step 1: Add the rules**

Open `firestore.rules` and **after the existing `misc_items` block** (currently at lines 265-269), add:

```
    // Parts catalogue — public read (only active items shown by client filter), admin write.
    match /parts/{id} {
      allow read: if true;
      allow write: if isAdmin();
    }

    // Parts enquiries — server-only creates (via /api/parts-enquiry), admin read/update/delete.
    // Public clients must POST to /api/parts-enquiry, never write directly.
    match /parts_enquiries/{id} {
      allow read, update, delete: if isAdmin();
      allow create: if false;
    }
```

- [ ] **Step 2: Commit**

```bash
git add firestore.rules
git commit -m "feat(parts): add firestore rules for parts and parts_enquiries collections"
```

> **Deploy note:** rules must be deployed (`firebase deploy --only firestore:rules`) before Phase 2 reaches production. Phase 1 admin work runs against deployed rules — coordinate the rule deploy with the first admin-page deploy.

---

## Task 2: Parts schema (Zod, with tests)

**Why:** A single source of truth for the part-listing shape used by the admin form, the public detail page, and the API. Each doc represents one available unit (or one stock-counted SKU); no `variants` array.

**Files:**
- Create: `src/lib/partsSchema.js`
- Create: `src/lib/partsSchema.test.js`

- [ ] **Step 1: Write the failing tests**

Create `src/lib/partsSchema.test.js`:

```javascript
import { describe, it, expect } from 'vitest';
import { partSchema, poundsToPence, penceToPounds, formatPriceDisplay, CONDITIONS, CATEGORIES, AIRCRAFT, STATUSES } from './partsSchema';

describe('poundsToPence / penceToPounds', () => {
  it('converts whole pounds to pence', () => {
    expect(poundsToPence('14000')).toBe(1400000);
  });
  it('converts pounds-with-decimals to pence', () => {
    expect(poundsToPence('14000.50')).toBe(1400050);
  });
  it('returns null for empty input (price on application)', () => {
    expect(poundsToPence('')).toBeNull();
    expect(poundsToPence(null)).toBeNull();
  });
  it('rejects negative amounts', () => {
    expect(() => poundsToPence('-1')).toThrow();
  });
  it('rejects non-numeric', () => {
    expect(() => poundsToPence('abc')).toThrow();
  });
  it('round-trips via penceToPounds', () => {
    expect(penceToPounds(1400050)).toBe('14000.50');
    expect(penceToPounds(0)).toBe('0.00');
    expect(penceToPounds(null)).toBe('');
  });
});

describe('formatPriceDisplay', () => {
  it('renders POA when priceGbp is null', () => {
    expect(formatPriceDisplay(null)).toBe('POA');
  });
  it('renders pence as £-formatted GBP with thousands separators', () => {
    expect(formatPriceDisplay(1400000)).toBe('£14,000.00');
    expect(formatPriceDisplay(1400050)).toBe('£14,000.50');
  });
});

describe('partSchema', () => {
  const base = {
    partNumber: 'A102',
    mfgPartNumber: 'A102',
    title: 'Tail Rotor Pitch Link',
    description: 'Robinson R44 tail rotor pitch link, in good condition.',
    category: 'rotor',
    aircraftCompat: ['r44'],
    images: [],
    status: 'active',
    condition: 'new',
    priceGbp: 1400000,
    coreChargeGbp: null,
    priceDisplay: '£14,000.00',
    leadTimeDays: 0,
    hasQuantity: true,
    stock: 5,
    requiresShipping: true,
    airworthinessLifeLimited: true,
    exportControlled: false,
    notes: '',
  };

  it('accepts a valid new-stock listing', () => {
    expect(() => partSchema.parse(base)).not.toThrow();
  });
  it('accepts a one-off used listing (stock=1, hasQuantity=false)', () => {
    const used = { ...base, condition: 'overhauled', hasQuantity: false, stock: 1, priceGbp: 920000, priceDisplay: '£9,200.00' };
    expect(() => partSchema.parse(used)).not.toThrow();
  });
  it('accepts an exchange listing with core charge', () => {
    const exch = { ...base, condition: 'exchange', priceGbp: 850000, coreChargeGbp: 500000, priceDisplay: '£8,500.00' };
    expect(() => partSchema.parse(exch)).not.toThrow();
  });
  it('accepts priceGbp=null (POA) with priceDisplay="POA"', () => {
    const poa = { ...base, priceGbp: null, priceDisplay: 'POA' };
    expect(() => partSchema.parse(poa)).not.toThrow();
  });
  it('rejects negative price', () => {
    expect(() => partSchema.parse({ ...base, priceGbp: -100 })).toThrow();
  });
  it('rejects unknown condition', () => {
    expect(() => partSchema.parse({ ...base, condition: 'fake' })).toThrow();
  });
  it('rejects unknown category', () => {
    expect(() => partSchema.parse({ ...base, category: 'fake' })).toThrow();
  });
  it('rejects unknown aircraft', () => {
    expect(() => partSchema.parse({ ...base, aircraftCompat: ['cessna'] })).toThrow();
  });
  it('rejects empty aircraft list', () => {
    expect(() => partSchema.parse({ ...base, aircraftCompat: [] })).toThrow();
  });
  it('rejects stock < 1', () => {
    expect(() => partSchema.parse({ ...base, stock: 0 })).toThrow();
  });
  it('accepts images with {url, alt, isPrimary} shape', () => {
    const withImages = { ...base, images: [{ url: 'https://cdn.example.com/a.jpg', alt: 'rotor blade', isPrimary: true }] };
    expect(() => partSchema.parse(withImages)).not.toThrow();
  });
  it('rejects images without a url', () => {
    expect(() => partSchema.parse({ ...base, images: [{ alt: 'x', isPrimary: true }] })).toThrow();
  });
  it('exports the canonical enums', () => {
    expect(CONDITIONS).toEqual(['new', 'overhauled', 'exchange', 'repaired']);
    expect(CATEGORIES).toEqual(['rotor', 'engine', 'avionics', 'consumables', 'airframe', 'hardware']);
    expect(AIRCRAFT).toEqual(['r22', 'r44', 'r66']);
    expect(STATUSES).toEqual(['active', 'sold', 'archived', 'discontinued']);
  });
});
```

- [ ] **Step 2: Run the tests to verify they fail**

Run: `npx vitest run src/lib/partsSchema.test.js`
Expected: FAIL with `Cannot find module './partsSchema'`.

- [ ] **Step 3: Implement the schema**

Create `src/lib/partsSchema.js`:

```javascript
import { z } from 'zod';

export const CONDITIONS = ['new', 'overhauled', 'exchange', 'repaired'];
export const CATEGORIES = ['rotor', 'engine', 'avionics', 'consumables', 'airframe', 'hardware'];
export const AIRCRAFT = ['r22', 'r44', 'r66'];
// 'sold' is added vs misc_items so a unique used unit can be auto-archived
// when stock hits 0 without losing its detail page (handy for SEO continuity).
export const STATUSES = ['active', 'sold', 'archived', 'discontinued'];

// Image shape mirrors the misc_items convention: { url, alt, isPrimary }.
export const imageSchema = z.object({
  url: z.string().url(),
  alt: z.string().max(200).default(''),
  isPrimary: z.boolean().default(false),
});

export const partSchema = z.object({
  // partNumber and mfgPartNumber are queryable fields, NOT the doc id.
  // Multiple docs can share the same partNumber (e.g. one new + one used).
  partNumber: z.string().min(1).max(100),
  mfgPartNumber: z.string().min(1).max(100),
  title: z.string().min(1).max(200),
  description: z.string().max(5000).default(''),
  category: z.enum(CATEGORIES),
  aircraftCompat: z.array(z.enum(AIRCRAFT)).min(1),
  images: z.array(imageSchema).default([]),
  status: z.enum(STATUSES).default('active'),

  // Single condition + price per listing. If you sell A102 in three
  // conditions, that's three separate listings with three separate URLs.
  condition: z.enum(CONDITIONS),
  priceGbp: z.number().int().min(0).nullable(), // pence; null = POA
  coreChargeGbp: z.number().int().min(0).nullable().optional(), // only meaningful when condition === 'exchange'
  priceDisplay: z.string().max(50).default('POA'), // denormalised render — set on save
  leadTimeDays: z.number().int().min(0).default(0), // 0 = in stock

  // Stock follows the misc_items pattern.
  hasQuantity: z.boolean().default(true),
  stock: z.number().int().min(1).default(1),
  requiresShipping: z.boolean().default(true),

  airworthinessLifeLimited: z.boolean().default(false),
  exportControlled: z.boolean().default(false),
  notes: z.string().max(5000).default(''),
});

// Pounds-with-decimals → integer pence. Used by the admin form on save.
// Returns null for empty input ("Price on application").
export function poundsToPence(input) {
  if (input === '' || input == null) return null;
  const n = Number(input);
  if (!Number.isFinite(n) || n < 0) throw new Error('poundsToPence: invalid amount ' + JSON.stringify(input));
  return Math.round(n * 100);
}

// Inverse for displaying stored pence in a pounds-with-decimals form input.
export function penceToPounds(pence) {
  if (pence == null) return '';
  return (pence / 100).toFixed(2);
}

// Render pence as a customer-facing GBP string. POA when null.
export function formatPriceDisplay(pence) {
  if (pence == null) return 'POA';
  return `£${(pence / 100).toLocaleString('en-GB', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
}
```

- [ ] **Step 4: Run the tests to verify they pass**

Run: `npx vitest run src/lib/partsSchema.test.js`
Expected: PASS — all green (~25 tests).

- [ ] **Step 5: Commit**

```bash
git add src/lib/partsSchema.js src/lib/partsSchema.test.js
git commit -m "feat(parts): add Zod schema with single-condition listing model"
```

---

## Task 3: Admin parts list page (`AdminParts.jsx`)

**Why:** the admin needs to see all parts and click into one to edit. Mirror `AdminLeads.jsx` (filter pills + inline rows) but with a "New part" button and a click-through to an edit page.

**Files:**
- Create: `src/pages/admin/AdminParts.jsx`

- [ ] **Step 1: Write the page**

Create `src/pages/admin/AdminParts.jsx`:

```jsx
import { useState } from 'react';
import { Link } from 'react-router-dom';
import AdminLayout from '../../components/admin/AdminLayout';
import { useCollection } from '../../hooks/useFirestore';
import { CATEGORIES, CONDITIONS, STATUSES } from '../../lib/partsSchema';

export default function AdminParts() {
  const { docs: parts, loading } = useCollection('parts');
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterCategory, setFilterCategory] = useState('all');
  const [filterCondition, setFilterCondition] = useState('all');
  const [search, setSearch] = useState('');

  const filtered = parts.filter((p) => {
    if (filterStatus !== 'all' && p.status !== filterStatus) return false;
    if (filterCategory !== 'all' && p.category !== filterCategory) return false;
    if (filterCondition !== 'all' && p.condition !== filterCondition) return false;
    if (search) {
      const q = search.toLowerCase();
      if (!p.partNumber?.toLowerCase().includes(q) && !p.title?.toLowerCase().includes(q)) return false;
    }
    return true;
  });

  return (
    <AdminLayout>
      <div style={{ marginBottom: '1.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h1 style={{ fontSize: '1.5rem', fontWeight: 700, color: '#111827', margin: 0 }}>Parts</h1>
        <Link to="/admin/parts/new" style={{ padding: '0.5rem 1rem', background: '#111827', color: '#fff', borderRadius: '6px', textDecoration: 'none', fontSize: '0.85rem', fontWeight: 600 }}>+ New Listing</Link>
      </div>

      <div style={{ display: 'flex', gap: '0.75rem', marginBottom: '1rem', flexWrap: 'wrap' }}>
        <input
          type="search"
          placeholder="Search by PN or title…"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          style={{ flex: '1 1 220px', padding: '0.5rem 0.75rem', border: '1px solid #d1d5db', borderRadius: '6px', fontSize: '0.875rem' }}
        />
        <select value={filterCategory} onChange={(e) => setFilterCategory(e.target.value)} style={{ padding: '0.5rem 0.75rem', border: '1px solid #d1d5db', borderRadius: '6px', fontSize: '0.875rem' }}>
          <option value="all">All categories</option>
          {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
        </select>
        <select value={filterCondition} onChange={(e) => setFilterCondition(e.target.value)} style={{ padding: '0.5rem 0.75rem', border: '1px solid #d1d5db', borderRadius: '6px', fontSize: '0.875rem' }}>
          <option value="all">All conditions</option>
          {CONDITIONS.map((c) => <option key={c} value={c}>{c}</option>)}
        </select>
        <select value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)} style={{ padding: '0.5rem 0.75rem', border: '1px solid #d1d5db', borderRadius: '6px', fontSize: '0.875rem' }}>
          <option value="all">All statuses</option>
          {STATUSES.map((s) => <option key={s} value={s}>{s}</option>)}
        </select>
      </div>

      {loading ? (
        <p style={{ color: '#6b7280' }}>Loading…</p>
      ) : filtered.length === 0 ? (
        <p style={{ color: '#6b7280' }}>No listings. Click <em>+ New Listing</em> to add one.</p>
      ) : (
        <div style={{ background: '#fff', border: '1px solid #e5e7eb', borderRadius: '8px', overflow: 'hidden' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '110px 1fr 100px 90px 110px 80px 80px', gap: '0.75rem', padding: '0.6rem 1rem', background: '#f9fafb', fontSize: '0.75rem', fontWeight: 600, color: '#6b7280', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
            <div>PN</div><div>Title</div><div>Category</div><div>Condition</div><div>Price</div><div>Stock</div><div>Status</div>
          </div>
          {filtered.map((p) => (
            <Link key={p.id} to={`/admin/parts/${p.id}`} style={{ display: 'grid', gridTemplateColumns: '110px 1fr 100px 90px 110px 80px 80px', gap: '0.75rem', padding: '0.75rem 1rem', borderTop: '1px solid #f3f4f6', textDecoration: 'none', color: '#111827', fontSize: '0.875rem' }}>
              <div style={{ fontFamily: 'monospace', fontSize: '0.8rem' }}>{p.partNumber}</div>
              <div style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{p.title}</div>
              <div style={{ color: '#6b7280' }}>{p.category}</div>
              <div style={{ color: '#6b7280' }}>{p.condition}</div>
              <div>{p.priceDisplay || 'POA'}</div>
              <div style={{ color: p.stock > 0 ? '#111827' : '#9ca3af' }}>{p.hasQuantity ? p.stock : '—'}</div>
              <div style={{ color: p.status === 'active' ? '#16a34a' : '#9ca3af', fontSize: '0.75rem' }}>{p.status}</div>
            </Link>
          ))}
        </div>
      )}
    </AdminLayout>
  );
}
```

- [ ] **Step 2: Commit**

```bash
git add src/pages/admin/AdminParts.jsx
git commit -m "feat(parts): add admin parts list page"
```

---

## Task 4: Admin listing edit form (`AdminPartEdit.jsx`)

**Why:** create or edit a single part **listing** (one PN + one condition + one price). Pounds-with-decimals price input. Images via the existing `MediaLibraryPicker` modal. Doc ID is Firestore-auto-generated on create — admins never see or pick it. Mirrors `AdminMiscItemEdit.jsx` closely.

**Files:**
- Create: `src/pages/admin/AdminPartEdit.jsx`

> **Pre-flight check:** open `src/components/admin/MediaLibraryPicker.jsx` and confirm the `onPick` callback signature is `({ url, alt }) => void` (line 8 of that file). If the contract has changed, adjust the `handlePick` handler below to match. Likewise verify `src/lib/mediaLibrary.js` exists.

- [ ] **Step 1: Write the page**

Create `src/pages/admin/AdminPartEdit.jsx`:

```jsx
import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import AdminLayout from '../../components/admin/AdminLayout';
import MediaLibraryPicker from '../../components/admin/MediaLibraryPicker';
import { useDocument, createDoc, updateDocById, deleteDocById } from '../../hooks/useFirestore';
import { partSchema, poundsToPence, penceToPounds, formatPriceDisplay, CONDITIONS, CATEGORIES, AIRCRAFT, STATUSES } from '../../lib/partsSchema';

// Form state holds price as a pounds-with-decimals string ("14000.50").
// On save, converted to integer pence via poundsToPence.
const EMPTY = {
  partNumber: '',
  mfgPartNumber: '',
  title: '',
  description: '',
  category: 'rotor',
  aircraftCompat: [],
  images: [], // [{url, alt, isPrimary}]
  status: 'active',
  condition: 'new',
  priceGbpInput: '',          // string for the form input
  coreChargeGbpInput: '',     // string, only used when condition === 'exchange'
  leadTimeDays: 0,
  hasQuantity: true,
  stock: 1,
  requiresShipping: true,
  airworthinessLifeLimited: false,
  exportControlled: false,
  notes: '',
};

// Map a stored part doc → form state (pence → pounds-strings).
function partDocToForm(doc) {
  return {
    ...EMPTY,
    ...doc,
    images: doc.images || [],
    priceGbpInput: penceToPounds(doc.priceGbp),
    coreChargeGbpInput: penceToPounds(doc.coreChargeGbp),
    leadTimeDays: doc.leadTimeDays ?? 0,
    stock: doc.stock ?? 1,
  };
}

export default function AdminPartEdit() {
  const { id } = useParams();
  const navigate = useNavigate();
  const isNew = !id || id === 'new';
  const { data: existing, loading } = useDocument('parts', isNew ? null : id);
  const [form, setForm] = useState(EMPTY);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);
  const [pickerOpen, setPickerOpen] = useState(false);

  useEffect(() => {
    if (!isNew && existing) setForm(partDocToForm(existing));
  }, [isNew, existing]);

  function setField(k, v) { setForm((f) => ({ ...f, [k]: v })); }
  function toggleAircraft(a) {
    setForm((f) => ({ ...f, aircraftCompat: f.aircraftCompat.includes(a) ? f.aircraftCompat.filter((x) => x !== a) : [...f.aircraftCompat, a] }));
  }

  // MediaLibraryPicker calls onPick({ url, alt }).
  function handlePick({ url, alt }) {
    setForm((f) => {
      if (f.images.some((img) => img.url === url)) return f;
      const next = [...f.images, { url, alt: alt || '', isPrimary: false }];
      if (!next.some((i) => i.isPrimary)) next[0] = { ...next[0], isPrimary: true };
      return { ...f, images: next };
    });
    setPickerOpen(false);
  }
  function setPrimary(idx) {
    setForm((f) => ({ ...f, images: f.images.map((img, i) => ({ ...img, isPrimary: i === idx })) }));
  }
  function removeImage(idx) {
    setForm((f) => {
      const imgs = f.images.filter((_, i) => i !== idx);
      if (imgs.length > 0 && !imgs.some((i) => i.isPrimary)) imgs[0] = { ...imgs[0], isPrimary: true };
      return { ...f, images: imgs };
    });
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError(null);
    setSaving(true);
    try {
      const priceGbp = poundsToPence(form.priceGbpInput);
      const coreChargeGbp = form.condition === 'exchange' ? poundsToPence(form.coreChargeGbpInput) : null;
      const payload = {
        partNumber: form.partNumber,
        mfgPartNumber: form.mfgPartNumber,
        title: form.title,
        description: form.description,
        category: form.category,
        aircraftCompat: form.aircraftCompat,
        images: form.images,
        status: form.status,
        condition: form.condition,
        priceGbp,
        coreChargeGbp,
        priceDisplay: formatPriceDisplay(priceGbp),
        leadTimeDays: Number(form.leadTimeDays || 0),
        hasQuantity: !!form.hasQuantity,
        stock: Math.max(1, Number(form.stock || 1)),
        requiresShipping: !!form.requiresShipping,
        airworthinessLifeLimited: !!form.airworthinessLifeLimited,
        exportControlled: !!form.exportControlled,
        notes: form.notes,
      };
      const parsed = partSchema.parse(payload);
      if (isNew) {
        const newId = await createDoc('parts', parsed);
        navigate(`/admin/parts/${newId}`);
      } else {
        await updateDocById('parts', id, parsed);
        navigate('/admin/parts');
      }
    } catch (err) {
      setError(err.issues ? err.issues.map((issue) => `${issue.path.join('.')}: ${issue.message}`).join('; ') : err.message);
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete() {
    if (!confirm(`Delete listing ${form.partNumber} — ${form.title}? This cannot be undone.`)) return;
    await deleteDocById('parts', id);
    navigate('/admin/parts');
  }

  if (!isNew && loading) return <AdminLayout><p style={{ color: '#6b7280' }}>Loading…</p></AdminLayout>;

  const fieldStyle = { width: '100%', padding: '0.5rem 0.75rem', border: '1px solid #d1d5db', borderRadius: '6px', fontSize: '0.875rem', boxSizing: 'border-box' };
  const labelStyle = { display: 'block', fontSize: '0.75rem', fontWeight: 600, color: '#374151', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.35rem' };

  return (
    <AdminLayout>
      <form onSubmit={handleSubmit} style={{ maxWidth: '800px' }}>
        <div style={{ marginBottom: '1.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h1 style={{ fontSize: '1.5rem', fontWeight: 700, color: '#111827', margin: 0 }}>{isNew ? 'New Listing' : `Edit ${form.partNumber} — ${form.title}`}</h1>
          {!isNew && <button type="button" onClick={handleDelete} style={{ padding: '0.4rem 0.9rem', background: '#fff', color: '#dc2626', border: '1px solid #dc2626', borderRadius: '6px', cursor: 'pointer', fontSize: '0.8rem' }}>Delete</button>}
        </div>

        {/* IDENTITY ----------------------------------------------------- */}
        <div style={{ background: '#fff', border: '1px solid #e5e7eb', borderRadius: '8px', padding: '1.5rem', display: 'grid', gap: '1rem', marginBottom: '1.5rem' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div>
              <label style={labelStyle}>Part Number *</label>
              <input value={form.partNumber} onChange={(e) => setField('partNumber', e.target.value)} required style={fieldStyle} placeholder="e.g. A102" />
              <p style={{ fontSize: '0.7rem', color: '#9ca3af', margin: '0.25rem 0 0' }}>Searchable; multiple listings can share a PN.</p>
            </div>
            <div>
              <label style={labelStyle}>Manufacturer PN</label>
              <input value={form.mfgPartNumber} onChange={(e) => setField('mfgPartNumber', e.target.value)} required style={fieldStyle} />
            </div>
          </div>
          <div>
            <label style={labelStyle}>Title *</label>
            <input value={form.title} onChange={(e) => setField('title', e.target.value)} required style={fieldStyle} placeholder="e.g. Tail Rotor Pitch Link" />
            <p style={{ fontSize: '0.7rem', color: '#9ca3af', margin: '0.25rem 0 0' }}>The page H1 reads "{`{partNumber} {title}`}" — make this read naturally as the second half of that phrase.</p>
          </div>
          <div>
            <label style={labelStyle}>Description</label>
            <textarea value={form.description} onChange={(e) => setField('description', e.target.value)} rows={4} style={{ ...fieldStyle, resize: 'vertical' }} placeholder="Service history, hours since overhaul, condition notes…" />
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div>
              <label style={labelStyle}>Category *</label>
              <select value={form.category} onChange={(e) => setField('category', e.target.value)} style={fieldStyle}>
                {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
            <div>
              <label style={labelStyle}>Status</label>
              <select value={form.status} onChange={(e) => setField('status', e.target.value)} style={fieldStyle}>
                {STATUSES.map((s) => <option key={s} value={s}>{s}</option>)}
              </select>
            </div>
          </div>
          <div>
            <label style={labelStyle}>Aircraft Compatibility *</label>
            <div style={{ display: 'flex', gap: '0.5rem' }}>
              {AIRCRAFT.map((a) => (
                <button type="button" key={a} onClick={() => toggleAircraft(a)} style={{ padding: '0.4rem 1rem', borderRadius: '6px', border: '1px solid', borderColor: form.aircraftCompat.includes(a) ? '#111827' : '#d1d5db', background: form.aircraftCompat.includes(a) ? '#111827' : '#fff', color: form.aircraftCompat.includes(a) ? '#fff' : '#374151', cursor: 'pointer', fontSize: '0.8rem', fontWeight: 600 }}>
                  {a.toUpperCase()}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* CONDITION + PRICING ----------------------------------------- */}
        <div style={{ background: '#fff', border: '1px solid #e5e7eb', borderRadius: '8px', padding: '1.5rem', marginBottom: '1.5rem' }}>
          <h2 style={{ fontSize: '1rem', fontWeight: 600, color: '#111827', margin: '0 0 1rem' }}>Condition & Pricing</h2>
          <p style={{ fontSize: '0.75rem', color: '#6b7280', margin: '0 0 1rem' }}>Each listing has one condition and one price. To sell A102 in both new and overhauled, create two listings.</p>
          <div style={{ display: 'grid', gridTemplateColumns: '140px 1fr 1fr 120px', gap: '0.75rem', alignItems: 'end' }}>
            <div>
              <label style={labelStyle}>Condition *</label>
              <select value={form.condition} onChange={(e) => setField('condition', e.target.value)} style={fieldStyle}>
                {CONDITIONS.map((c) => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
            <div>
              <label style={labelStyle}>Price (£)</label>
              <input type="number" min="0" step="0.01" value={form.priceGbpInput} onChange={(e) => setField('priceGbpInput', e.target.value)} placeholder="14000.00 (or leave blank for POA)" style={fieldStyle} />
            </div>
            <div>
              <label style={labelStyle}>Core Charge (£)</label>
              <input type="number" min="0" step="0.01" value={form.coreChargeGbpInput} onChange={(e) => setField('coreChargeGbpInput', e.target.value)} disabled={form.condition !== 'exchange'} placeholder={form.condition === 'exchange' ? '5000.00' : '—'} style={{ ...fieldStyle, opacity: form.condition !== 'exchange' ? 0.5 : 1 }} />
            </div>
            <div>
              <label style={labelStyle}>Lead (days)</label>
              <input type="number" min="0" step="1" value={form.leadTimeDays} onChange={(e) => setField('leadTimeDays', e.target.value)} style={fieldStyle} />
            </div>
          </div>
        </div>

        {/* STOCK + LOGISTICS ------------------------------------------- */}
        <div style={{ background: '#fff', border: '1px solid #e5e7eb', borderRadius: '8px', padding: '1.5rem', marginBottom: '1.5rem' }}>
          <h2 style={{ fontSize: '1rem', fontWeight: 600, color: '#111827', margin: '0 0 1rem' }}>Stock & Flags</h2>
          <div style={{ display: 'flex', gap: '1.5rem', marginBottom: '1rem', flexWrap: 'wrap' }}>
            <label style={{ display: 'flex', gap: '0.4rem', alignItems: 'center', fontSize: '0.85rem' }}>
              <input type="checkbox" checked={form.hasQuantity} onChange={(e) => setField('hasQuantity', e.target.checked)} />
              Has stock count
            </label>
            <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
              <label style={{ ...labelStyle, marginBottom: 0 }}>Stock</label>
              <input type="number" min="1" step="1" value={form.stock} onChange={(e) => setField('stock', e.target.value)} disabled={!form.hasQuantity} style={{ ...fieldStyle, width: '80px', opacity: form.hasQuantity ? 1 : 0.5 }} />
            </div>
            <label style={{ display: 'flex', gap: '0.4rem', alignItems: 'center', fontSize: '0.85rem' }}>
              <input type="checkbox" checked={form.requiresShipping} onChange={(e) => setField('requiresShipping', e.target.checked)} />
              Requires shipping
            </label>
          </div>
          <div style={{ display: 'flex', gap: '1.5rem', flexWrap: 'wrap' }}>
            <label style={{ display: 'flex', gap: '0.4rem', alignItems: 'center', fontSize: '0.85rem' }}>
              <input type="checkbox" checked={form.airworthinessLifeLimited} onChange={(e) => setField('airworthinessLifeLimited', e.target.checked)} />
              Life-limited
            </label>
            <label style={{ display: 'flex', gap: '0.4rem', alignItems: 'center', fontSize: '0.85rem' }}>
              <input type="checkbox" checked={form.exportControlled} onChange={(e) => setField('exportControlled', e.target.checked)} />
              Export-controlled
            </label>
          </div>
        </div>

        {/* IMAGES ------------------------------------------------------ */}
        <div style={{ background: '#fff', border: '1px solid #e5e7eb', borderRadius: '8px', padding: '1.5rem', marginBottom: '1.5rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
            <h2 style={{ fontSize: '1rem', fontWeight: 600, color: '#111827', margin: 0 }}>Images</h2>
            <button type="button" onClick={() => setPickerOpen(true)} style={{ padding: '0.4rem 0.9rem', fontSize: '0.8rem', background: '#f3f4f6', border: '1px solid #d1d5db', borderRadius: '6px', cursor: 'pointer' }}>+ Pick from media library</button>
          </div>
          {form.images.length === 0 ? (
            <p style={{ fontSize: '0.8rem', color: '#9ca3af', margin: 0 }}>No images attached. Click <em>+ Pick from media library</em> to add.</p>
          ) : (
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.75rem' }}>
              {form.images.map((img, i) => (
                <div key={img.url} style={{ position: 'relative', width: '120px' }}>
                  <img src={img.url} alt={img.alt} style={{ width: '120px', height: '80px', objectFit: 'cover', borderRadius: '6px', border: img.isPrimary ? '2px solid #2563eb' : '2px solid transparent' }} />
                  <div style={{ display: 'flex', gap: '4px', marginTop: '4px' }}>
                    <button type="button" onClick={() => setPrimary(i)} style={{ fontSize: '0.65rem', padding: '2px 6px', background: img.isPrimary ? '#2563eb' : '#e5e7eb', color: img.isPrimary ? '#fff' : '#374151', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>{img.isPrimary ? 'Primary' : 'Set Primary'}</button>
                    <button type="button" onClick={() => removeImage(i)} style={{ fontSize: '0.65rem', padding: '2px 6px', background: '#fee2e2', color: '#dc2626', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>✕</button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* INTERNAL NOTES --------------------------------------------- */}
        <div style={{ background: '#fff', border: '1px solid #e5e7eb', borderRadius: '8px', padding: '1.5rem', marginBottom: '1.5rem' }}>
          <label style={labelStyle}>Internal Notes (admin only)</label>
          <textarea value={form.notes} onChange={(e) => setField('notes', e.target.value)} rows={3} style={{ ...fieldStyle, resize: 'vertical' }} />
        </div>

        {error && <p style={{ color: '#dc2626', fontSize: '0.875rem', marginBottom: '1rem' }}>{error}</p>}

        <div style={{ display: 'flex', gap: '0.75rem' }}>
          <button type="submit" disabled={saving} style={{ padding: '0.6rem 1.5rem', background: '#111827', color: '#fff', border: 'none', borderRadius: '6px', cursor: 'pointer', fontSize: '0.875rem', fontWeight: 600, opacity: saving ? 0.6 : 1 }}>
            {saving ? 'Saving…' : isNew ? 'Create Listing' : 'Save Changes'}
          </button>
          <button type="button" onClick={() => navigate('/admin/parts')} style={{ padding: '0.6rem 1.5rem', background: '#fff', color: '#374151', border: '1px solid #d1d5db', borderRadius: '6px', cursor: 'pointer', fontSize: '0.875rem' }}>Cancel</button>
        </div>
      </form>

      <MediaLibraryPicker open={pickerOpen} onClose={() => setPickerOpen(false)} onPick={handlePick} />
    </AdminLayout>
  );
}
```

- [ ] **Step 2: Commit**

```bash
git add src/pages/admin/AdminPartEdit.jsx
git commit -m "feat(parts): add admin part edit form with inline variants"
```

---

## Task 5: Wire admin routes + nav

**Why:** routes are unreachable until added to `App.jsx` and `AdminLayout.jsx` nav.

**Files:**
- Modify: `src/App.jsx` (add 2 routes inside the admin block, lines 244-265)
- Modify: `src/components/admin/AdminLayout.jsx` (add nav item)

- [ ] **Step 1: Add the routes**

In `src/App.jsx`, find the admin route block (around lines 244-265). After the existing `/admin/misc` routes, add:

```jsx
<Route path="/admin/parts" element={<AdminRoute><AdminParts /></AdminRoute>} />
<Route path="/admin/parts/:id" element={<AdminRoute><AdminPartEdit /></AdminRoute>} />
```

And add the imports near the top of `App.jsx` alongside the other admin page imports:

```jsx
import AdminParts from './pages/admin/AdminParts';
import AdminPartEdit from './pages/admin/AdminPartEdit';
```

- [ ] **Step 2: Add nav item**

In `src/components/admin/AdminLayout.jsx`, find `NAV_ITEMS` (lines 7-24). Add a new entry mirroring the misc-items pattern. The exact icon is whatever the codebase already uses for parts/wrench-style entries — if there isn't one, use `🔩`:

```jsx
{ to: '/admin/parts', label: 'Parts', icon: '🔩' },
```

- [ ] **Step 3: Smoke-test locally**

Run: `npm run dev`
Then visit `http://localhost:5173/admin/parts` (after signing in as admin).
Expected: list page renders with empty state and "+ New Part" button. Click it → form renders. Fill in PN `TEST-1`, title `Test`, category `rotor`, aircraft `r44`, leave variant price empty → save → redirected to list with `TEST-1` shown. Click row → edit form pre-populated. Change title → save → list reflects change. Click Delete → row gone.

- [ ] **Step 4: Commit**

```bash
git add src/App.jsx src/components/admin/AdminLayout.jsx
git commit -m "feat(parts): wire admin parts routes and nav"
```

> **Phase 1 complete.** Operations can now populate the parts catalogue. Catalogue is **not** publicly visible. No public route changed yet.

---

# Phase 2 — Public Catalogue + Detail (Tasks 6–10)

## Task 6: Public catalogue index (`Parts.jsx`)

**Why:** the public-facing index. Browse-only, with category + aircraft + condition filter pills (mirrors `Misc.jsx` filter UI). No enquire button yet (Phase 3).

**Files:**
- Create: `src/pages/Parts.jsx`

- [ ] **Step 1: Write the page**

Create `src/pages/Parts.jsx`:

```jsx
import { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import Header from '../components/Header';
import FooterMinimal from '../components/FooterMinimal';
import Seo from '../components/seo/Seo';
import { buildItemList, buildBreadcrumbList } from '../components/seo/jsonLd';
import { useCollection } from '../hooks/useFirestore';
import { CATEGORIES, AIRCRAFT, CONDITIONS } from '../lib/partsSchema';
import '../assets/css/main.css';
import '../assets/css/components.css';

export default function Parts() {
  const { docs: parts, loading } = useCollection('parts');
  const [category, setCategory] = useState('all');
  const [aircraft, setAircraft] = useState('all');
  const [condition, setCondition] = useState('all');

  const visible = useMemo(() => parts.filter((p) => {
    if (p.status !== 'active') return false;
    if (category !== 'all' && p.category !== category) return false;
    if (aircraft !== 'all' && !p.aircraftCompat?.includes(aircraft)) return false;
    if (condition !== 'all' && p.condition !== condition) return false;
    return true;
  }), [parts, category, aircraft, condition]);

  const jsonLd = [
    buildBreadcrumbList([
      { name: 'Home', path: '/' },
      { name: 'Parts', path: '/parts' },
    ]),
    buildItemList({
      name: 'Robinson Helicopter Parts',
      // Item name uses the full "{partNumber} {title}" phrase so the
      // ItemList JSON-LD reflects how customers actually search.
      items: visible.slice(0, 50).map((p) => ({ name: `${p.partNumber} ${p.title}`, url: `/parts/${p.id}` })),
    }),
  ];

  return (
    <>
      <Seo
        title="Robinson Helicopter Parts Catalogue"
        description="Browse Robinson R22, R44, and R66 parts at HQ Aviation — engine, rotor, avionics, airframe, and consumables. New, overhauled, exchange, and repaired conditions. Enquire for stock and pricing."
        canonical="https://hqaviation.com/parts"
        jsonLd={jsonLd}
      />

      <div style={{ minHeight: '100vh', background: '#faf9f6', fontFamily: "'Space Grotesk', sans-serif" }}>
        <Header />

        <section style={{ padding: '7rem 2rem 3rem', textAlign: 'center', borderBottom: '1px solid #e8e6e2' }}>
          <span style={{ fontFamily: "'Share Tech Mono', monospace", fontSize: '0.6rem', textTransform: 'uppercase', letterSpacing: '0.3em', color: '#999', display: 'block', marginBottom: '0.75rem' }}>Robinson Parts Specialists</span>
          <h1 style={{ fontSize: 'clamp(1.5rem, 4vw, 2.5rem)', fontWeight: 700, textTransform: 'uppercase', color: '#1a1a1a', margin: '0 0 1rem' }}>Parts Catalogue</h1>
          <p style={{ maxWidth: '600px', margin: '0 auto', fontSize: '0.95rem', color: '#555', lineHeight: 1.8 }}>
            Browse our Robinson parts inventory. £500K+ of stock spanning every category. New, overhauled, exchange, and repaired — same-day dispatch on AOG.
          </p>
        </section>

        <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '2rem' }}>
          <FilterRow label="Category" value={category} options={['all', ...CATEGORIES]} onChange={setCategory} />
          <FilterRow label="Aircraft" value={aircraft} options={['all', ...AIRCRAFT]} onChange={setAircraft} />
          <FilterRow label="Condition" value={condition} options={['all', ...CONDITIONS]} onChange={setCondition} />

          {loading ? (
            <p style={{ color: '#888', textAlign: 'center', padding: '2rem' }}>Loading parts…</p>
          ) : visible.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '3rem 1rem' }}>
              <p style={{ color: '#666', marginBottom: '1rem' }}>No parts match these filters.</p>
              <Link to="/parts/enquiry" style={{ color: '#1a1a1a', fontWeight: 600 }}>Send a general enquiry →</Link>
            </div>
          ) : (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: '1.25rem', marginTop: '2rem' }}>
              {visible.map((p) => {
                const cardImage = (p.images || []).find((i) => i.isPrimary)?.url || p.images?.[0]?.url;
                return (
                  <Link key={p.id} to={`/parts/${p.id}`} aria-label={`${p.partNumber} ${p.title}`} style={{ background: '#fff', border: '1px solid #e8e6e2', borderRadius: '8px', overflow: 'hidden', textDecoration: 'none', color: '#1a1a1a', display: 'flex', flexDirection: 'column' }}>
                    <div style={{ aspectRatio: '4 / 3', background: cardImage ? `url(${cardImage}) center / cover` : 'linear-gradient(135deg, #eae8e4, #d8d6d2)' }} />
                    <div style={{ padding: '1rem' }}>
                      {/* Card title combines PN and title so the link text reads
                          as a single search phrase. PN gets a mono treatment
                          inline rather than as a separate eyebrow line. */}
                      <h2 style={{ fontSize: '0.95rem', fontWeight: 600, margin: '0 0 0.5rem', lineHeight: 1.3 }}>
                        <span style={{ fontFamily: 'monospace', color: '#666', marginRight: '0.4em' }}>{p.partNumber}</span>
                        {p.title}
                      </h2>
                      <div style={{ fontSize: '0.7rem', color: '#777', marginBottom: '0.5rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                        {(p.aircraftCompat || []).join(' · ').toUpperCase()} · {p.category} · {p.condition}
                      </div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
                        <div style={{ fontSize: '0.95rem', fontWeight: 700 }}>{p.priceDisplay || 'POA'}</div>
                        {p.hasQuantity && p.stock > 0 && (
                          <div style={{ fontSize: '0.7rem', color: '#16a34a', fontWeight: 600 }}>{p.stock} in stock</div>
                        )}
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>
          )}

          <div style={{ marginTop: '3rem', padding: '1.5rem', background: '#eae8e4', borderRadius: '8px', textAlign: 'center' }}>
            <p style={{ margin: '0 0 0.75rem', fontSize: '0.9rem', color: '#555' }}>Don't see the part you need?</p>
            <Link to="/parts/enquiry" style={{ display: 'inline-block', padding: '0.6rem 1.5rem', background: '#1a1a1a', color: '#fff', textDecoration: 'none', borderRadius: '4px', fontSize: '0.8rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.08em' }}>
              Send a general enquiry →
            </Link>
          </div>
        </div>

        <FooterMinimal />
      </div>
    </>
  );
}

function FilterRow({ label, value, options, onChange }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.75rem', flexWrap: 'wrap' }}>
      <span style={{ fontFamily: "'Share Tech Mono', monospace", fontSize: '0.6rem', textTransform: 'uppercase', letterSpacing: '0.15em', color: '#999', minWidth: '70px' }}>{label}</span>
      {options.map((o) => (
        <button key={o} onClick={() => onChange(o)} style={{ padding: '0.35rem 0.85rem', borderRadius: '4px', border: '1px solid', borderColor: value === o ? '#1a1a1a' : '#e8e6e2', background: value === o ? '#1a1a1a' : '#fff', color: value === o ? '#fff' : '#555', fontSize: '0.7rem', fontWeight: 600, cursor: 'pointer', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
          {o === 'all' ? 'All' : o.toUpperCase()}
        </button>
      ))}
    </div>
  );
}
```

- [ ] **Step 2: Commit**

```bash
git add src/pages/Parts.jsx
git commit -m "feat(parts): add public parts catalogue index page"
```

---

## Task 7: Public part detail page (`PartDetail.jsx`) with Product schema

**Why:** every part is its own indexable URL with a Product JSON-LD block (with an `Offer` only when at least one variant has a price). This is the SEO unlock. Reuses `buildProduct` from `src/components/seo/jsonLd.js`.

**Files:**
- Create: `src/pages/PartDetail.jsx`

- [ ] **Step 1: Write the page**

Create `src/pages/PartDetail.jsx`:

```jsx
import { useParams, Link, Navigate } from 'react-router-dom';
import Header from '../components/Header';
import FooterMinimal from '../components/FooterMinimal';
import Seo from '../components/seo/Seo';
import { buildProduct, buildBreadcrumbList } from '../components/seo/jsonLd';
import { useDocument } from '../hooks/useFirestore';
import '../assets/css/main.css';
import '../assets/css/components.css';

const CONDITION_LABELS = {
  new: 'New',
  overhauled: 'Overhauled',
  exchange: 'Exchange',
  repaired: 'Repaired',
};

export default function PartDetail() {
  const { id } = useParams();
  const { data: part, loading } = useDocument('parts', id);

  if (loading) {
    return (
      <div style={{ minHeight: '100vh', background: '#faf9f6' }}>
        <Header />
        <p style={{ textAlign: 'center', padding: '6rem 2rem', color: '#666' }}>Loading…</p>
      </div>
    );
  }
  // 'active' is the only condition that puts a listing on the public site.
  // 'sold' / 'archived' / 'discontinued' all redirect away.
  if (!part || part.status !== 'active') return <Navigate to="/parts" replace />;

  const primaryImage = (part.images || []).find((i) => i.isPrimary) || part.images?.[0];
  const fullName = `${part.partNumber} ${part.title}`; // e.g. "A102 Tail Rotor Pitch Link"
  const inStock = part.hasQuantity ? part.stock > 0 : true;

  const productSchema = buildProduct({
    name: fullName,
    description: part.description || `${fullName} — Robinson ${(part.aircraftCompat || []).join('/').toUpperCase()} part at HQ Aviation. Enquire for stock and pricing.`,
    image: primaryImage?.url || '/assets/images/og-default.png',
    url: `/parts/${part.id}`,
    // Single Offer per listing (not AggregateOffer — each listing is one
    // condition + one price). Omit the offers block entirely when priceGbp
    // is null (POA), so we don't emit a zero-price Offer to Google.
    offers: part.priceGbp != null ? {
      '@type': 'Offer',
      priceCurrency: 'GBP',
      price: (part.priceGbp / 100).toFixed(2),
      itemCondition: ({
        new: 'https://schema.org/NewCondition',
        overhauled: 'https://schema.org/RefurbishedCondition',
        exchange: 'https://schema.org/RefurbishedCondition',
        repaired: 'https://schema.org/RefurbishedCondition',
      })[part.condition] || 'https://schema.org/UsedCondition',
      availability: inStock ? 'https://schema.org/InStock' : 'https://schema.org/OutOfStock',
      seller: { '@type': 'Organization', name: 'HQ Aviation' },
    } : undefined,
  });

  const jsonLd = [
    buildBreadcrumbList([
      { name: 'Home', path: '/' },
      { name: 'Parts', path: '/parts' },
      { name: part.partNumber, path: `/parts/${part.id}` },
    ]),
    productSchema,
  ];

  return (
    <>
      <Seo
        title={fullName}
        description={part.description?.slice(0, 160) || `${fullName} — Robinson ${(part.aircraftCompat || []).join('/').toUpperCase()} part at HQ Aviation. Enquire for stock and pricing.`}
        canonical={`https://hqaviation.com/parts/${part.id}`}
        ogImage={primaryImage?.url}
        ogType="product"
        jsonLd={jsonLd}
      />

      <div style={{ minHeight: '100vh', background: '#faf9f6', fontFamily: "'Space Grotesk', sans-serif" }}>
        <Header />

        <div style={{ maxWidth: '1100px', margin: '0 auto', padding: '6rem 2rem 3rem' }}>
          <Link to="/parts" style={{ fontFamily: "'Share Tech Mono', monospace", fontSize: '0.7rem', color: '#777', textDecoration: 'none', textTransform: 'uppercase', letterSpacing: '0.1em' }}>← All parts</Link>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '3rem', marginTop: '2rem' }}>
            <div>
              <div style={{ aspectRatio: '4 / 3', background: primaryImage?.url ? `url(${primaryImage.url}) center / cover` : 'linear-gradient(135deg, #eae8e4, #d8d6d2)', borderRadius: '8px' }} />
            </div>
            <div>
              {/* Single H1 containing BOTH the part number and the title so the
                  full search phrase ("A102 Tail Rotor Pitch Link") is one
                  strong on-page signal. PN is rendered with a tabular/mono
                  treatment via inline span so it remains visually distinct. */}
              <h1 style={{ fontSize: 'clamp(1.5rem, 3vw, 2rem)', fontWeight: 700, color: '#1a1a1a', margin: '0 0 1rem', letterSpacing: '-0.01em', lineHeight: 1.2 }}>
                <span style={{ fontFamily: 'monospace', marginRight: '0.5em' }}>{part.partNumber}</span>
                {part.title}
              </h1>

              <div style={{ fontSize: '0.8rem', color: '#777', marginBottom: '1.5rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                {(part.aircraftCompat || []).join(' · ').toUpperCase()} · {part.category}
                {part.airworthinessLifeLimited && <> · Life-limited</>}
                {part.exportControlled && <> · Export-controlled</>}
              </div>

              <p style={{ fontSize: '0.95rem', color: '#444', lineHeight: 1.7, marginBottom: '2rem' }}>{part.description}</p>

              {/* Single condition + price block. No variants table — each
                  listing is one specific available unit (or one stock-counted
                  SKU). */}
              <div style={{ background: '#fff', border: '1px solid #e8e6e2', borderRadius: '8px', padding: '1.25rem', marginBottom: '2rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: '0.5rem' }}>
                  <div style={{ fontFamily: "'Share Tech Mono', monospace", fontSize: '0.65rem', textTransform: 'uppercase', letterSpacing: '0.15em', color: '#999' }}>
                    {CONDITION_LABELS[part.condition] || part.condition}
                    {part.hasQuantity && part.stock > 0 && <> · {part.stock} in stock</>}
                    {part.hasQuantity && part.stock === 0 && <> · Out of stock</>}
                  </div>
                  <div style={{ fontSize: '0.75rem', color: '#777' }}>
                    {part.leadTimeDays === 0 ? 'Available now' : `~${part.leadTimeDays} day lead time`}
                  </div>
                </div>
                <div style={{ fontSize: '1.5rem', fontWeight: 700, color: '#1a1a1a' }}>
                  {part.priceDisplay || 'POA'}
                </div>
                {part.condition === 'exchange' && part.coreChargeGbp != null && (
                  <div style={{ fontSize: '0.85rem', color: '#777', marginTop: '0.25rem' }}>
                    + £{(part.coreChargeGbp / 100).toLocaleString('en-GB', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} core charge
                  </div>
                )}
              </div>

              {/* Phase 3 will replace this stub with an Enquire button. */}
              <div style={{ padding: '1.25rem', background: '#eae8e4', borderRadius: '8px', textAlign: 'center' }}>
                <p style={{ margin: '0 0 0.75rem', fontSize: '0.85rem', color: '#555' }}>To enquire about this part, contact our parts desk:</p>
                <Link to="/parts/enquiry" style={{ display: 'inline-block', padding: '0.55rem 1.25rem', background: '#1a1a1a', color: '#fff', textDecoration: 'none', borderRadius: '4px', fontSize: '0.75rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.08em' }}>
                  Send Enquiry →
                </Link>
              </div>
            </div>
          </div>
        </div>

        <FooterMinimal />
      </div>
    </>
  );
}
```

- [ ] **Step 2: Commit**

```bash
git add src/pages/PartDetail.jsx
git commit -m "feat(parts): add public part detail page with Product schema"
```

---

## Task 8: Wire public routes (`/parts`, `/parts/:slug`, `/parts/enquiry`)

**Why:** the new pages are unreachable until added to `App.jsx`. The existing `<Route path="/parts" element={<PartSales />} />` must be moved to `/parts/enquiry` so the new catalogue can own `/parts`.

**Files:**
- Modify: `src/App.jsx`

- [ ] **Step 1: Update routes**

In `src/App.jsx`, find the existing `<Route path="/parts" element={<PartSales />} />` line. Replace that line with:

```jsx
<Route path="/parts" element={<Parts />} />
<Route path="/parts/enquiry" element={<PartSales />} />
<Route path="/parts/:id" element={<PartDetail />} />
```

(Order matters: `/parts/enquiry` is a static segment; React-Router-DOM 7 prioritises static over dynamic, but listing it first removes any ambiguity for readers. `:id` matches the Firestore-auto-generated doc ID.)

Add the imports near the other page imports:

```jsx
import Parts from './pages/Parts';
import PartDetail from './pages/PartDetail';
```

(`PartSales` import already exists.)

- [ ] **Step 2: Smoke-test locally**

Run: `npm run dev`
Visit each:
- `http://localhost:5173/parts` → catalogue grid (empty if no parts seeded; with parts: filterable grid)
- `http://localhost:5173/parts/<slug-of-a-part-you-created>` → detail page with variants table
- `http://localhost:5173/parts/enquiry` → original PartSales contact form
- View page source on detail page → confirm `<script type="application/ld+json">` block contains `"@type":"Product"` and an `offers` block when the part has a priced variant.

- [ ] **Step 3: Commit**

```bash
git add src/App.jsx
git commit -m "feat(parts): wire public routes; relocate part-sales form to /parts/enquiry"
```

---

## Task 9: Add `parts` to dynamic sitemap entries

**Why:** every active part needs to be in the sitemap so Google can discover them.

**Files:**
- Modify: `api/sitemap.js` (mirror the `misc_items` block at lines 87-94)

- [ ] **Step 1: Add the parts block**

In `api/sitemap.js`, in `fetchDynamicEntries()` (function starts at line 66), **after** the `misc_items` block (lines 87-94, which ends with `entries.push({ path: \`/misc/${doc.id}\`, ... })`), add:

```javascript
  try {
    const parts = await db.collection('parts').where('status', '==', 'active').get();
    for (const doc of parts.docs) {
      const data = doc.data() || {};
      const lastmod = data.updatedAt?.toDate ? data.updatedAt.toDate().toISOString().slice(0, 10) : undefined;
      entries.push({ path: `/parts/${doc.id}`, lastmod, changefreq: 'weekly', priority: 0.7 });
    }
  } catch (e) { console.error('[sitemap] parts fetch failed:', e.message); }
```

- [ ] **Step 2: Run the existing sitemap tests**

Run: `npx vitest run api/sitemap.test.js`
Expected: PASS — the existing tests don't assert on the parts collection but should not break.

- [ ] **Step 3: Commit**

```bash
git add api/sitemap.js
git commit -m "feat(parts): include active parts in dynamic sitemap entries"
```

> **Phase 2 complete.** Catalogue is publicly browseable; every active part has its own URL with Product schema. Customers Googling a Robinson PN can now find the page directly. The Enquire button is still a stub linking to `/parts/enquiry` (the legacy general-enquiry form).

---

# Phase 3 — Enquiry Mechanics (Tasks 10–14)

## Task 10: API route `/api/parts-enquiry` (with tests)

**Why:** the public POST endpoint for enquiry submissions, plus a PATCH endpoint for the admin queue (mirrors `/api/leads`). Sends an email to operations on submit.

**Files:**
- Create: `api/parts-enquiry.js`
- Create: `api/parts-enquiry.test.js`
- Modify: `server.js` (mount the router)

- [ ] **Step 1: Write the failing test**

Create `api/parts-enquiry.test.js`:

```javascript
'use strict';
const { describe, it, expect, beforeEach, vi } = require('vitest');
const express = require('express');
const request = require('supertest');

// Mock firebase-admin BEFORE requiring the route module.
const mockAdd = vi.fn().mockResolvedValue({ id: 'mock-enquiry-id' });
const mockUpdate = vi.fn().mockResolvedValue();
const mockDoc = vi.fn(() => ({ update: mockUpdate }));
const mockCollection = vi.fn(() => ({ add: mockAdd, doc: mockDoc }));
const mockVerifyIdToken = vi.fn();

vi.mock('./firebase-admin', () => ({
  default: {
    firestore: () => ({ collection: mockCollection, FieldValue: { serverTimestamp: () => 'TS' } }),
    auth: () => ({ verifyIdToken: mockVerifyIdToken }),
  },
}));

vi.mock('nodemailer', () => ({
  default: { createTransport: () => ({ sendMail: vi.fn().mockResolvedValue({}) }) },
  createTransport: () => ({ sendMail: vi.fn().mockResolvedValue({}) }),
}));

const partsEnquiry = require('./parts-enquiry');

function makeApp() {
  const app = express();
  app.use(express.json());
  app.use('/api/parts-enquiry', partsEnquiry);
  return app;
}

describe('POST /api/parts-enquiry', () => {
  beforeEach(() => {
    mockAdd.mockClear();
    mockVerifyIdToken.mockClear();
  });

  it('requires partNumber, name, email', async () => {
    const res = await request(makeApp()).post('/api/parts-enquiry').send({});
    expect(res.status).toBe(400);
  });

  it('accepts a valid enquiry and writes to Firestore', async () => {
    const res = await request(makeApp()).post('/api/parts-enquiry').send({
      partNumber: 'A102',
      partListingId: 'firestore-auto-id-abc',
      condition: 'new',
      qty: 1,
      name: 'John Test',
      email: 'john@test.com',
      phone: '+44 1234 567890',
      tail: 'G-ABCD',
      notes: 'AOG',
    });
    expect(res.status).toBe(200);
    expect(res.body.id).toBe('mock-enquiry-id');
    expect(mockAdd).toHaveBeenCalledOnce();
    const doc = mockAdd.mock.calls[0][0];
    expect(doc.partNumber).toBe('A102');
    expect(doc.partListingId).toBe('firestore-auto-id-abc');
    expect(doc.status).toBe('open');
    expect(doc.condition).toBe('new');
  });

  it('rejects qty < 1', async () => {
    const res = await request(makeApp()).post('/api/parts-enquiry').send({
      partNumber: 'A205-1', name: 'X', email: 'x@x.com', qty: 0,
    });
    expect(res.status).toBe(400);
  });

  it('rejects unknown condition', async () => {
    const res = await request(makeApp()).post('/api/parts-enquiry').send({
      partNumber: 'A205-1', name: 'X', email: 'x@x.com', condition: 'fake',
    });
    expect(res.status).toBe(400);
  });
});

describe('PATCH /api/parts-enquiry/:id', () => {
  beforeEach(() => {
    mockUpdate.mockClear();
    mockVerifyIdToken.mockClear();
  });

  it('rejects requests without a Bearer token', async () => {
    const res = await request(makeApp()).patch('/api/parts-enquiry/abc').send({ status: 'responded' });
    expect(res.status).toBe(401);
  });

  it('rejects non-admin tokens', async () => {
    mockVerifyIdToken.mockResolvedValueOnce({ role: 'editor' });
    const res = await request(makeApp()).patch('/api/parts-enquiry/abc').set('Authorization', 'Bearer t').send({ status: 'responded' });
    expect(res.status).toBe(403);
  });

  it('accepts admin status updates', async () => {
    mockVerifyIdToken.mockResolvedValueOnce({ role: 'admin' });
    const res = await request(makeApp()).patch('/api/parts-enquiry/abc').set('Authorization', 'Bearer t').send({ status: 'responded' });
    expect(res.status).toBe(200);
    expect(mockUpdate).toHaveBeenCalledOnce();
  });

  it('rejects invalid status', async () => {
    mockVerifyIdToken.mockResolvedValueOnce({ role: 'admin' });
    const res = await request(makeApp()).patch('/api/parts-enquiry/abc').set('Authorization', 'Bearer t').send({ status: 'fake' });
    expect(res.status).toBe(400);
  });
});
```

- [ ] **Step 2: Run the tests to verify they fail**

Run: `npx vitest run api/parts-enquiry.test.js`
Expected: FAIL — `Cannot find module './parts-enquiry'`.

- [ ] **Step 3: Write the route**

Create `api/parts-enquiry.js`:

```javascript
'use strict';

const express = require('express');
const { rateLimit, ipKeyGenerator } = require('express-rate-limit');
const nodemailer = require('nodemailer');
const admin = require('./firebase-admin');

const router = express.Router();

const VALID_CONDITIONS = ['new', 'overhauled', 'exchange', 'repaired', 'any'];
const VALID_STATUSES = ['open', 'responded', 'closed'];

// 5 requests per 10 minutes per IP, mirroring /api/leads.
const enquiryLimiter = rateLimit({
  windowMs: 10 * 60 * 1000,
  max: 5,
  standardHeaders: true,
  legacyHeaders: false,
  keyGenerator: (req) => ipKeyGenerator(req),
  handler: (_req, res) => res.status(429).json({ error: 'Too many requests' }),
});

async function requireAdmin(req, res, next) {
  const header = req.headers.authorization || '';
  const token = header.replace('Bearer ', '').trim();
  if (!token) return res.status(401).json({ error: 'Unauthorized' });
  try {
    const decoded = await admin.auth().verifyIdToken(token);
    if (decoded.role !== 'admin' && decoded.role !== 'super_admin') {
      return res.status(403).json({ error: 'Forbidden' });
    }
    next();
  } catch {
    return res.status(401).json({ error: 'Unauthorized' });
  }
}

async function sendOpsEmail(enquiry) {
  if (!process.env.SMTP_HOST) return; // skip in dev/test
  const transport = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT || 587),
    secure: false,
    auth: { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS },
  });
  const to = process.env.PARTS_ENQUIRY_EMAIL || process.env.EMAIL_FROM;
  const subject = `[Parts Enquiry] ${enquiry.partNumber} — ${enquiry.condition || 'any'} × ${enquiry.qty || 1}`;
  const text = [
    `Part Number: ${enquiry.partNumber}`,
    `Condition: ${enquiry.condition || 'any'}`,
    `Quantity: ${enquiry.qty || 1}`,
    '',
    `Customer: ${enquiry.name}`,
    `Email: ${enquiry.email}`,
    `Phone: ${enquiry.phone || '—'}`,
    `Tail: ${enquiry.tail || '—'}`,
    '',
    `Notes:`,
    enquiry.notes || '(none)',
    '',
    `Admin: ${process.env.SITE_URL || 'https://hqaviation.com'}/admin/parts/enquiries`,
  ].join('\n');
  await transport.sendMail({
    from: process.env.EMAIL_FROM,
    to,
    replyTo: enquiry.email,
    subject,
    text,
  });
}

// POST /api/parts-enquiry — public, rate-limited
router.post('/', enquiryLimiter, async (req, res) => {
  try {
    const { partNumber, partListingId, condition, qty, name, email, phone, tail, notes } = req.body || {};
    if (!partNumber || !name || !email) {
      return res.status(400).json({ error: 'partNumber, name, and email are required' });
    }
    const qtyNum = Number(qty || 1);
    if (!Number.isInteger(qtyNum) || qtyNum < 1 || qtyNum > 999) {
      return res.status(400).json({ error: 'qty must be an integer between 1 and 999' });
    }
    if (condition !== undefined && condition !== null && !VALID_CONDITIONS.includes(condition)) {
      return res.status(400).json({ error: 'Invalid condition' });
    }

    const db = admin.firestore();
    const doc = {
      partNumber: String(partNumber).slice(0, 100),
      partListingId: String(partListingId || '').slice(0, 100),
      condition: condition || 'any',
      qty: qtyNum,
      name: String(name).slice(0, 200),
      email: String(email).slice(0, 200),
      phone: String(phone || '').slice(0, 50),
      tail: String(tail || '').slice(0, 20),
      notes: String(notes || '').slice(0, 5000),
      status: 'open',
      adminNotes: '',
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
      updatedAt: admin.firestore.FieldValue.serverTimestamp(),
    };
    const ref = await db.collection('parts_enquiries').add(doc);

    // Best-effort email — don't fail the request if SMTP is down.
    sendOpsEmail(doc).catch((err) => console.error('[parts-enquiry] email failed:', err.message));

    return res.json({ id: ref.id });
  } catch (err) {
    console.error('Parts enquiry capture error:', err);
    return res.status(500).json({ error: 'Failed to capture enquiry' });
  }
});

// PATCH /api/parts-enquiry/:id — admin only, update status or admin notes
router.patch('/:id', requireAdmin, async (req, res) => {
  try {
    const { status, adminNotes } = req.body || {};
    const update = { updatedAt: admin.firestore.FieldValue.serverTimestamp() };
    if (status !== undefined) {
      if (!VALID_STATUSES.includes(status)) return res.status(400).json({ error: 'Invalid status' });
      update.status = status;
    }
    if (adminNotes !== undefined) update.adminNotes = String(adminNotes).slice(0, 5000);
    await admin.firestore().collection('parts_enquiries').doc(req.params.id).update(update);
    return res.json({ ok: true });
  } catch (err) {
    console.error('Parts enquiry update error:', err);
    return res.status(500).json({ error: 'Failed to update enquiry' });
  }
});

module.exports = router;
```

- [ ] **Step 4: Run the tests to verify they pass**

Run: `npx vitest run api/parts-enquiry.test.js`
Expected: PASS — 9 tests passing.

If `supertest` isn't already installed (it's used by `api/stripe.test.js` so likely is), check `package.json`. If missing: `npm install -D supertest` and add a step to commit `package.json` / `package-lock.json`.

- [ ] **Step 5: Mount the router in `server.js`**

In `server.js`, find where other API routers are mounted (look for `app.use('/api/leads', ...)`). Add:

```javascript
app.use('/api/parts-enquiry', require('./api/parts-enquiry'));
```

- [ ] **Step 6: Commit**

```bash
git add api/parts-enquiry.js api/parts-enquiry.test.js server.js
git commit -m "feat(parts): add /api/parts-enquiry endpoint with admin PATCH"
```

---

## Task 11: Enquire modal on detail page

**Why:** the per-part Enquire button + form. Mounted on `PartDetail.jsx`, prefilled with the part's PN.

**Files:**
- Create: `src/components/parts/EnquireModal.jsx`
- Modify: `src/pages/PartDetail.jsx` (replace the Phase 2 stub block)

- [ ] **Step 1: Write the modal component**

Create `src/components/parts/EnquireModal.jsx`:

```jsx
import { useState } from 'react';
import { CONDITIONS } from '../../lib/partsSchema';

export default function EnquireModal({ part, onClose }) {
  const [form, setForm] = useState({
    // The listing already has one fixed condition; prefill but allow change
    // (customer might want to ask "do you also have this in 'new'?").
    condition: part.condition || 'any',
    qty: 1,
    name: '',
    email: '',
    phone: '',
    tail: '',
    notes: '',
  });
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState(null);

  function setField(k, v) { setForm((f) => ({ ...f, [k]: v })); }

  async function handleSubmit(e) {
    e.preventDefault();
    setSubmitting(true);
    setError(null);
    try {
      const res = await fetch('/api/parts-enquiry', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          partNumber: part.partNumber,
          partListingId: part.id,
          ...form,
          qty: Number(form.qty),
        }),
      });
      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        throw new Error(body.error || 'Submission failed');
      }
      setSubmitted(true);
    } catch (err) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  }

  const inputStyle = { width: '100%', padding: '0.55rem 0.75rem', border: '1px solid #d1d5db', borderRadius: '6px', fontSize: '0.875rem', boxSizing: 'border-box', fontFamily: 'inherit' };
  const labelStyle = { display: 'block', fontSize: '0.7rem', fontWeight: 600, color: '#374151', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.3rem' };

  return (
    <div onClick={onClose} style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.55)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem', overflowY: 'auto' }}>
      <div onClick={(e) => e.stopPropagation()} style={{ background: '#fff', borderRadius: '8px', maxWidth: '520px', width: '100%', maxHeight: '90vh', overflowY: 'auto', padding: '2rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1.5rem' }}>
          <div>
            <div style={{ fontFamily: 'monospace', fontSize: '0.8rem', color: '#999', marginBottom: '0.25rem' }}>{part.partNumber}</div>
            <h2 style={{ fontSize: '1.15rem', fontWeight: 700, color: '#1a1a1a', margin: 0 }}>Enquire about {part.title}</h2>
          </div>
          <button onClick={onClose} style={{ background: 'none', border: 'none', fontSize: '1.4rem', color: '#999', cursor: 'pointer', padding: 0, lineHeight: 1 }}>×</button>
        </div>

        {submitted ? (
          <div style={{ textAlign: 'center', padding: '2rem 0' }}>
            <div style={{ fontSize: '2rem', marginBottom: '0.75rem' }}>✓</div>
            <p style={{ fontWeight: 700, marginBottom: '0.5rem', color: '#1a1a1a' }}>Enquiry received</p>
            <p style={{ fontSize: '0.85rem', color: '#666', marginBottom: '1.5rem' }}>We'll be in touch shortly about availability and pricing.</p>
            <button onClick={onClose} style={{ padding: '0.6rem 1.5rem', background: '#1a1a1a', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer', fontSize: '0.8rem', fontWeight: 600 }}>Close</button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} style={{ display: 'grid', gap: '1rem' }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 100px', gap: '0.75rem' }}>
              <div>
                <label style={labelStyle}>Condition</label>
                <select value={form.condition} onChange={(e) => setField('condition', e.target.value)} style={inputStyle}>
                  <option value="any">Any</option>
                  {CONDITIONS.map((c) => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>
              <div>
                <label style={labelStyle}>Qty</label>
                <input type="number" min="1" max="999" value={form.qty} onChange={(e) => setField('qty', e.target.value)} required style={inputStyle} />
              </div>
            </div>
            <div>
              <label style={labelStyle}>Name *</label>
              <input value={form.name} onChange={(e) => setField('name', e.target.value)} required style={inputStyle} />
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
              <div>
                <label style={labelStyle}>Email *</label>
                <input type="email" value={form.email} onChange={(e) => setField('email', e.target.value)} required style={inputStyle} />
              </div>
              <div>
                <label style={labelStyle}>Phone</label>
                <input type="tel" value={form.phone} onChange={(e) => setField('phone', e.target.value)} style={inputStyle} />
              </div>
            </div>
            <div>
              <label style={labelStyle}>Aircraft Tail (optional)</label>
              <input value={form.tail} onChange={(e) => setField('tail', e.target.value)} placeholder="e.g. G-ABCD" style={inputStyle} />
            </div>
            <div>
              <label style={labelStyle}>Notes</label>
              <textarea value={form.notes} onChange={(e) => setField('notes', e.target.value)} rows={3} placeholder="AOG? Specific requirements?" style={{ ...inputStyle, resize: 'vertical' }} />
            </div>
            {error && <p style={{ color: '#dc2626', fontSize: '0.8rem', margin: 0 }}>{error}</p>}
            <button type="submit" disabled={submitting} style={{ padding: '0.75rem', background: '#1a1a1a', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer', fontSize: '0.8rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.08em', opacity: submitting ? 0.6 : 1 }}>
              {submitting ? 'Sending…' : 'Send Enquiry'}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
```

- [ ] **Step 2: Wire the modal into `PartDetail.jsx`**

In `src/pages/PartDetail.jsx`:

1. Add the imports at the top:
```jsx
import { useState } from 'react';
import EnquireModal from '../components/parts/EnquireModal';
```

2. Inside the component, after the loading/null guard, add:
```jsx
const [enquireOpen, setEnquireOpen] = useState(false);
```

3. **Replace** the Phase 2 stub (the `<div style={{ padding: '1.25rem', background: '#eae8e4', ... }}>...Send Enquiry...</div>` block) with:

```jsx
<button onClick={() => setEnquireOpen(true)} style={{ width: '100%', padding: '0.85rem', background: '#1a1a1a', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer', fontSize: '0.85rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.08em' }}>
  Enquire About This Part →
</button>
{enquireOpen && <EnquireModal part={part} onClose={() => setEnquireOpen(false)} />}
```

- [ ] **Step 3: Smoke-test**

Run: `npm run dev`
Visit a detail page. Click "Enquire About This Part" → modal opens with PN prefilled. Fill fields → submit → success state appears. Check `parts_enquiries` collection in Firebase console — new document with `status: 'open'`.

- [ ] **Step 4: Commit**

```bash
git add src/components/parts/EnquireModal.jsx src/pages/PartDetail.jsx
git commit -m "feat(parts): add per-part Enquire modal on detail page"
```

---

## Task 12: Admin enquiries queue (`AdminPartsEnquiries.jsx`)

**Why:** operations needs a list of open enquiries with status (`open` → `responded` → `closed`). Mirrors `AdminLeads.jsx` exactly.

**Files:**
- Create: `src/pages/admin/AdminPartsEnquiries.jsx`

- [ ] **Step 1: Write the page**

Create `src/pages/admin/AdminPartsEnquiries.jsx`:

```jsx
import { useState } from 'react';
import { Link } from 'react-router-dom';
import AdminLayout from '../../components/admin/AdminLayout';
import { useCollection } from '../../hooks/useFirestore';
import { auth } from '../../lib/firebase';

const STATUS_OPTIONS = ['open', 'responded', 'closed'];

const statusColor = (s) => ({ open: '#dc2626', responded: '#d97706', closed: '#16a34a' })[s] || '#6b7280';

export default function AdminPartsEnquiries() {
  const { docs: enquiries, loading } = useCollection('parts_enquiries');
  const [expandedId, setExpandedId] = useState(null);
  const [editNotes, setEditNotes] = useState({});
  const [savingId, setSavingId] = useState(null);
  const [filterStatus, setFilterStatus] = useState('all');

  async function updateEnquiry(id, payload) {
    setSavingId(id);
    try {
      const token = await auth.currentUser?.getIdToken();
      await fetch(`/api/parts-enquiry/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json', ...(token ? { Authorization: `Bearer ${token}` } : {}) },
        body: JSON.stringify(payload),
      });
    } finally {
      setSavingId(null);
    }
  }

  function formatDate(ts) {
    if (!ts) return '—';
    const d = ts.toDate ? ts.toDate() : new Date(ts);
    return d.toLocaleString('en-GB', { day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit' });
  }

  const filtered = filterStatus === 'all' ? enquiries : enquiries.filter((e) => e.status === filterStatus);
  const counts = enquiries.reduce((acc, e) => { acc[e.status] = (acc[e.status] || 0) + 1; return acc; }, {});

  return (
    <AdminLayout>
      <div style={{ marginBottom: '1.5rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
          <h1 style={{ fontSize: '1.5rem', fontWeight: 700, color: '#111827', margin: 0 }}>Parts Enquiries</h1>
          <span style={{ fontSize: '0.875rem', color: '#6b7280' }}>{enquiries.length} total</span>
        </div>
        <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
          {['all', ...STATUS_OPTIONS].map((s) => (
            <button key={s} onClick={() => setFilterStatus(s)} style={{ padding: '4px 12px', borderRadius: '9999px', border: 'none', cursor: 'pointer', fontSize: '0.8rem', fontWeight: 600, background: filterStatus === s ? '#111827' : '#f3f4f6', color: filterStatus === s ? '#fff' : '#374151' }}>
              {s === 'all' ? `All (${enquiries.length})` : `${s} (${counts[s] || 0})`}
            </button>
          ))}
        </div>
      </div>

      {loading ? (
        <p style={{ color: '#6b7280' }}>Loading…</p>
      ) : filtered.length === 0 ? (
        <p style={{ color: '#6b7280' }}>No enquiries matching filter.</p>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
          {filtered.map((eq) => {
            const isOpen = expandedId === eq.id;
            const adminNotes = editNotes[eq.id] !== undefined ? editNotes[eq.id] : (eq.adminNotes || '');
            return (
              <div key={eq.id} style={{ background: '#fff', border: '1px solid #e5e7eb', borderRadius: '8px', overflow: 'hidden' }}>
                <div onClick={() => setExpandedId(isOpen ? null : eq.id)} style={{ display: 'flex', alignItems: 'center', gap: '1rem', padding: '0.875rem 1rem', cursor: 'pointer', userSelect: 'none' }}>
                  <div style={{ flex: '0 0 130px', fontFamily: 'monospace', fontSize: '0.8rem', fontWeight: 600 }}>{eq.partNumber}</div>
                  <div style={{ flex: '0 0 80px', fontSize: '0.8rem', color: '#6b7280' }}>{eq.condition}</div>
                  <div style={{ flex: '0 0 50px', fontSize: '0.8rem', color: '#6b7280' }}>×{eq.qty || 1}</div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontWeight: 600, color: '#111827', fontSize: '0.875rem' }}>{eq.name}</div>
                    <div style={{ color: '#6b7280', fontSize: '0.8rem' }}>{eq.email}</div>
                  </div>
                  <div style={{ flex: '0 0 100px', fontSize: '0.8rem', fontWeight: 600, color: statusColor(eq.status), textTransform: 'uppercase', letterSpacing: '0.05em' }}>{eq.status}</div>
                  <div style={{ flex: '0 0 100px', color: '#9ca3af', fontSize: '0.75rem', textAlign: 'right' }}>{formatDate(eq.createdAt)}</div>
                  <span style={{ color: '#9ca3af', fontSize: '0.75rem' }}>{isOpen ? '▲' : '▼'}</span>
                </div>

                {isOpen && (
                  <div style={{ borderTop: '1px solid #f3f4f6', padding: '1rem', background: '#fafafa' }}>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '1rem', marginBottom: '1rem', fontSize: '0.875rem' }}>
                      <div>
                        <div style={{ fontSize: '0.7rem', fontWeight: 600, color: '#6b7280', textTransform: 'uppercase', marginBottom: '0.2rem' }}>Phone</div>
                        <div>{eq.phone || '—'}</div>
                      </div>
                      <div>
                        <div style={{ fontSize: '0.7rem', fontWeight: 600, color: '#6b7280', textTransform: 'uppercase', marginBottom: '0.2rem' }}>Tail</div>
                        <div style={{ fontFamily: 'monospace' }}>{eq.tail || '—'}</div>
                      </div>
                      <div>
                        <div style={{ fontSize: '0.7rem', fontWeight: 600, color: '#6b7280', textTransform: 'uppercase', marginBottom: '0.2rem' }}>Listing link</div>
                        {eq.partListingId ? (
                          <Link to={`/parts/${eq.partListingId}`} target="_blank" style={{ color: '#2563eb', textDecoration: 'underline' }}>View listing →</Link>
                        ) : (
                          <span style={{ fontSize: '0.8rem', color: '#9ca3af' }}>—</span>
                        )}
                      </div>
                    </div>
                    <div style={{ marginBottom: '1rem' }}>
                      <div style={{ fontSize: '0.7rem', fontWeight: 600, color: '#6b7280', textTransform: 'uppercase', marginBottom: '0.2rem' }}>Customer notes</div>
                      <p style={{ fontSize: '0.875rem', color: '#374151', whiteSpace: 'pre-wrap', margin: 0 }}>{eq.notes || '—'}</p>
                    </div>
                    <div style={{ display: 'flex', gap: '1rem', alignItems: 'flex-end' }}>
                      <div style={{ flex: 1 }}>
                        <div style={{ fontSize: '0.7rem', fontWeight: 600, color: '#6b7280', textTransform: 'uppercase', marginBottom: '0.2rem' }}>Admin notes</div>
                        <textarea value={adminNotes} onChange={(e) => setEditNotes((n) => ({ ...n, [eq.id]: e.target.value }))} style={{ width: '100%', minHeight: '72px', padding: '0.5rem', border: '1px solid #d1d5db', borderRadius: '6px', fontSize: '0.875rem', resize: 'vertical', boxSizing: 'border-box' }} />
                      </div>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', flex: '0 0 180px' }}>
                        <select value={eq.status} onChange={(e) => updateEnquiry(eq.id, { status: e.target.value })} style={{ padding: '0.4rem', border: '1px solid #d1d5db', borderRadius: '6px', fontSize: '0.875rem' }}>
                          {STATUS_OPTIONS.map((s) => <option key={s} value={s}>{s}</option>)}
                        </select>
                        <button onClick={() => updateEnquiry(eq.id, { adminNotes })} disabled={savingId === eq.id} style={{ padding: '0.5rem', background: '#111827', color: '#fff', border: 'none', borderRadius: '6px', cursor: 'pointer', fontSize: '0.8rem', fontWeight: 600, opacity: savingId === eq.id ? 0.6 : 1 }}>
                          {savingId === eq.id ? 'Saving…' : 'Save Notes'}
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </AdminLayout>
  );
}
```

- [ ] **Step 2: Commit**

```bash
git add src/pages/admin/AdminPartsEnquiries.jsx
git commit -m "feat(parts): add admin parts-enquiries queue page"
```

---

## Task 13: Wire admin enquiries route + nav item with new-count badge

**Why:** make the queue reachable from admin nav with a "new enquiries" count badge (mirrors how `AdminLayout` shows new lead/booking counts).

**Files:**
- Modify: `src/App.jsx`
- Modify: `src/components/admin/AdminLayout.jsx`

- [ ] **Step 1: Add the admin route**

In `src/App.jsx`, in the admin block (alongside the routes added in Task 5), add:

```jsx
<Route path="/admin/parts/enquiries" element={<AdminRoute><AdminPartsEnquiries /></AdminRoute>} />
```

> **Order matters:** this route must come **before** `<Route path="/admin/parts/:id" ... />`, otherwise `:id` will match the literal string `enquiries`. React-Router-DOM 7 prefers static over dynamic, but explicit ordering eliminates any ambiguity.

Add the import:
```jsx
import AdminPartsEnquiries from './pages/admin/AdminPartsEnquiries';
```

- [ ] **Step 2: Add nav item with count badge**

Open `src/components/admin/AdminLayout.jsx`. Find the existing `useEffect` blocks that fetch new-lead / new-booking counts (lines 32-48). Add a similar block for parts enquiries — query `parts_enquiries` where `status == 'open'`. Then add to `NAV_ITEMS`:

```jsx
{ to: '/admin/parts/enquiries', label: 'Parts Enquiries', icon: '📩' },
```

The exact `useEffect` snippet pattern (look at the existing leads-count effect for the form to copy):

```jsx
useEffect(() => {
  const q = query(collection(db, 'parts_enquiries'), where('status', '==', 'open'));
  const unsub = onSnapshot(q, (snap) => setOpenEnquiriesCount(snap.size));
  return unsub;
}, []);
```

(Use the exact import + count-state-variable pattern that already exists in the file — don't reinvent.)

- [ ] **Step 3: Smoke-test end-to-end**

Run: `npm run dev`
1. Sign out, navigate to `/parts/<seeded-slug>`, click Enquire, submit a test enquiry.
2. Sign in as admin, click "Parts Enquiries" in the sidebar — count badge shows 1, new enquiry visible.
3. Click row to expand → click status dropdown → change to `responded` → list updates.
4. Add admin notes → click Save Notes → reload → notes persist.

- [ ] **Step 4: Commit**

```bash
git add src/App.jsx src/components/admin/AdminLayout.jsx
git commit -m "feat(parts): wire admin parts-enquiries route and nav with count badge"
```

---

## Task 14: Update SEO Task 19 reference

**Why:** the spec calls out that Task 19 of the SEO plan ("Product schema on /parts") is now legitimately complete. Add a one-line confirmation to the relevant plan doc so the SEO plan tracker reflects reality. This is documentation-only.

**Files:**
- Modify: whichever SEO plan doc references "Task 19" or "Product schema on /parts" (search for it first)

- [ ] **Step 1: Locate the SEO plan reference**

Run: `grep -rn "Product schema" docs/superpowers/plans docs/seo 2>/dev/null | grep -i "parts\|task 19" || echo "no direct reference — skip this task"`

If nothing found, **skip this task**. Otherwise, edit the file to mark the task complete with a date stamp pointing to this plan: `Completed 2026-05-XX — see docs/superpowers/plans/2026-05-07-parts-catalogue.md (Task 7)`.

- [ ] **Step 2: Commit (only if a file was edited)**

```bash
git add docs/
git commit -m "docs(seo): mark Product schema on /parts complete"
```

> **Phase 3 complete.** Per-part enquiries flow end-to-end: customer submits → Firestore + email to ops → admin handles in queue → status closes. Operations invoices manually outside the site. No payment flow on the website.

---

# Self-Review Checklist

- [x] **Spec coverage** —
  - Browse-only, no checkout: ✓ (no `addToCart`, no `/api/cart`).
  - "Enquire" CTA on every part: ✓ (Task 11).
  - "from £X" or "Price on application": ✓ (`fmtFromPrice` in Parts.jsx, `fmtGbp` in PartDetail.jsx).
  - Data model fields all covered: ✓ (Task 2 `partSchema`).
  - `/parts`, `/parts/:partNumber`, `/admin/parts`, `/admin/parts/:partNumber`, `/admin/parts/enquiries`: ✓ (Tasks 5, 8, 13). Note: URL uses slugified PN, not raw PN — see "URL slug" decision below.
  - Product schema with conditional Offer: ✓ (Task 7 — `offers` block only when `lowPrice != null`).
  - Enquiry → Firestore + ops email + admin queue: ✓ (Tasks 10, 12, 13).
  - Admin queue with `open → responded → closed`: ✓ (Task 12).
  - 3-PR phasing: ✓ (Phase 1 = Tasks 1-5, Phase 2 = Tasks 6-9, Phase 3 = Tasks 10-13).

- [x] **Placeholder scan** — no "TBD", no "implement appropriate error handling", no "add tests for the above". Every step contains real code.

- [x] **Type/name consistency** —
  - Doc ID: Firestore-auto-generated via `createDoc('parts', ...)` (Task 4). URL = `/parts/:id` (Task 8) → looked up via `useDocument('parts', id)` (Task 7). No slug field, no slugify helper.
  - `parts_enquiries` collection: written by `/api/parts-enquiry` (Task 10), read by `useCollection('parts_enquiries')` (Task 12), permitted by `firestore.rules` `parts_enquiries` block (Task 1). Consistent.
  - Enquiry-side reference field is `partListingId` (the parts doc ID). Used in EnquireModal POST body (Task 11), API doc write (Task 10), admin queue link (Task 12). Consistent.
  - Status enum `['open', 'responded', 'closed']` for enquiries; `['active','sold','archived','discontinued']` for listings. Defined in schema and API; used consistently in admin and public pages.
  - Field names: `partNumber`, `title`, `condition`, `priceGbp`, `coreChargeGbp`, `priceDisplay`, `leadTimeDays`, `hasQuantity`, `stock`, `requiresShipping`, `aircraftCompat` match across schema (Task 2), admin form (Task 4), admin list (Task 3), public catalogue (Task 6), public detail (Task 7).

- [x] **Decisions explicitly documented:**
  - **One doc per listing.** Multiple listings can share `partNumber`. Each has one condition + one price. Doc ID is Firestore-auto-generated random string; URL = `/parts/{id}`. Mirrors `misc_items`.
  - **No URL slug.** SEO comes from on-page H1 (`"{partNumber} {title}"`), `<title>` tag, meta description, and Product schema `name` — all containing the full search phrase. URL keyword inclusion is sacrificed for the simpler data model.
  - **`/parts/enquiry`**: the legacy `PartSales.jsx` form is preserved as a "general enquiry" fallback. Linked from the catalogue empty-state and the bottom CTA strip.
  - **Stock semantics**: `hasQuantity: false` listings act like one-off used items (the catalogue shows them until status changes); `hasQuantity: true` shows the stock count and would let a future reservation flow decrement it.
  - **`status: 'sold'`** is added vs misc_items so a unique used unit can be archived but its detail page kept (good for SEO continuity — Google won't 404 a recently-indexed URL).
  - **Catalogue size assumption**: client-side filter (no server-side pagination). Acceptable for ≲500 listings.
  - **Email is best-effort**: if SMTP fails, the enquiry still saves to Firestore and the API returns 200 (the admin queue is the source of truth, not the email).

---

# Execution Handoff

Plan complete and saved to `docs/superpowers/plans/2026-05-07-parts-catalogue.md`. Two execution options:

**1. Subagent-Driven (recommended)** — I dispatch a fresh subagent per task, review between tasks, fast iteration.

**2. Inline Execution** — Execute tasks in this session using executing-plans, batch execution with checkpoints.

Which approach?

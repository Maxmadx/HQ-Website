# Admin Panel — Plan 02: Image Management

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Every image on the site gets a unique slot ID. The admin can see all slots, see which image is currently shown, and replace any image by uploading a new file — without touching code.

**Architecture:** A thin `<ImageSlot>` wrapper component replaces bare `<img>` tags across pages. On mount it reads its current URL from Firestore `image_slots/{slotId}`. Admin Images page lists all slots with previews and an upload-to-replace modal. Images stored in Firebase Storage at `image-slots/{slotId}/{filename}`.

**Tech Stack:** React 19, Firebase Firestore + Storage, Vitest

**Prerequisite:** Plan 01 (Foundation) must be complete.

---

## Slot ID Convention

```
{page}-{section}-{descriptor}[-{index}]
```

| Slot ID | Location |
|---------|----------|
| `home-hero-main` | Homepage hero background |
| `home-expedition-globe` | Expedition section globe |
| `home-sales-r44` | Sales strip R44 card |
| `expedition-cinematic-bg` | Expeditions page video/img bg |
| `maintenance-hero-bg` | Maintenance hero |
| `facility-gallery-01` … `facility-gallery-08` | Facility photo gallery |
| `listing-{id}-primary` | Primary listing image (generated) |
| `blog-{slug}-cover` | Blog post cover (generated) |

---

## Files

| Action | Path |
|--------|------|
| Create | `src/components/admin/ImageSlot.jsx` |
| Create | `src/hooks/useImageSlot.js` |
| Create | `src/pages/admin/AdminImages.jsx` |
| Create | `src/hooks/useImageSlot.test.js` |
| Modify | Major page files (add `<ImageSlot>` wrappers) |

---

### Task 1: useImageSlot hook

**Files:** Create `src/hooks/useImageSlot.js`, `src/hooks/useImageSlot.test.js`

- [ ] **Step 1: Write the failing test**

```js
// src/hooks/useImageSlot.test.js
import { describe, it, expect, vi } from 'vitest';

vi.mock('../lib/firebase.js', () => ({ db: {} }));
vi.mock('firebase/firestore', () => ({
  doc: vi.fn(),
  getDoc: vi.fn().mockResolvedValue({
    exists: () => true,
    data: () => ({ currentImageUrl: '/assets/images/test.jpg' }),
  }),
}));

import { renderHook, waitFor } from '@testing-library/react';
import { useImageSlot } from './useImageSlot.js';

describe('useImageSlot', () => {
  it('returns fallback url immediately', () => {
    const { result } = renderHook(() => useImageSlot('test-slot', '/fallback.jpg'));
    expect(result.current.url).toBe('/fallback.jpg');
  });

  it('resolves to firestore url after load', async () => {
    const { result } = renderHook(() => useImageSlot('test-slot', '/fallback.jpg'));
    await waitFor(() => expect(result.current.url).toBe('/assets/images/test.jpg'));
  });
});
```

- [ ] **Step 2: Run — confirm FAIL**

```bash
npm test -- src/hooks/useImageSlot.test.js
```

- [ ] **Step 3: Implement**

```js
// src/hooks/useImageSlot.js
import { useState, useEffect } from 'react';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../lib/firebase.js';

export function useImageSlot(slotId, fallbackUrl) {
  const [url, setUrl] = useState(fallbackUrl);

  useEffect(() => {
    if (!slotId) return;
    getDoc(doc(db, 'image_slots', slotId)).then(snap => {
      if (snap.exists() && snap.data().currentImageUrl) {
        setUrl(snap.data().currentImageUrl);
      }
    });
  }, [slotId]);

  return { url };
}
```

- [ ] **Step 4: Run — confirm PASS**

```bash
npm test -- src/hooks/useImageSlot.test.js
```

- [ ] **Step 5: Commit**

```bash
git add src/hooks/useImageSlot.js src/hooks/useImageSlot.test.js
git commit -m "feat: useImageSlot hook reads image URL from Firestore"
```

---

### Task 2: ImageSlot component

**Files:** Create `src/components/admin/ImageSlot.jsx`

- [ ] **Step 1: Create component**

```jsx
// src/components/admin/ImageSlot.jsx
import { useImageSlot } from '../../hooks/useImageSlot.js';

/**
 * Drop-in replacement for <img> that reads its src from Firestore.
 * 
 * Usage:
 *   <ImageSlot slotId="home-hero-main" src="/assets/images/hero.jpg" alt="Hero" className="hero-img" />
 *
 * - slotId: unique key in Firestore image_slots collection
 * - src:    fallback/default image path (shown until Firestore resolves)
 * - All other props forwarded to <img>
 */
export default function ImageSlot({ slotId, src, alt, ...rest }) {
  const { url } = useImageSlot(slotId, src);
  return <img src={url} alt={alt} {...rest} />;
}
```

- [ ] **Step 2: Commit**

```bash
git add src/components/admin/ImageSlot.jsx
git commit -m "feat: ImageSlot component — swappable image driven by Firestore"
```

---

### Task 3: Seed Firestore image_slots collection

- [ ] **Step 1: Create seed script**

```js
// scripts/seed-image-slots.js
// Run with: node scripts/seed-image-slots.js
import { initializeApp, cert } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';
import { readFileSync } from 'fs';

const serviceAccount = JSON.parse(readFileSync('./service-account.json', 'utf8'));
initializeApp({ credential: cert(serviceAccount) });
const db = getFirestore();

const slots = [
  { id: 'home-hero-main',         page: 'Home',        section: 'Hero',        description: 'Main hero background',             currentImageUrl: '/assets/images/fleet/r44-hero.jpg' },
  { id: 'home-expedition-globe',  page: 'Home',        section: 'Expeditions', description: 'Globe wireframe underlay',          currentImageUrl: '' },
  { id: 'expedition-cinematic-bg',page: 'Expeditions', section: 'Cinematic',   description: 'Cinematic opening background',      currentImageUrl: '' },
  { id: 'maintenance-hero-bg',    page: 'Maintenance', section: 'Hero',        description: 'Maintenance page hero background',  currentImageUrl: '/assets/images/facility/hq-0167.jpg' },
  { id: 'facility-gallery-01',    page: 'Home',        section: 'Facility',    description: 'Facility gallery image 1',          currentImageUrl: '/assets/images/facility/main-sales-pic.jpg' },
  { id: 'facility-gallery-02',    page: 'Home',        section: 'Facility',    description: 'Facility gallery image 2',          currentImageUrl: '/assets/images/facility/hq-aviation-robinsons.jpg' },
  { id: 'facility-gallery-03',    page: 'Home',        section: 'Facility',    description: 'Facility gallery image 3',          currentImageUrl: '/assets/images/facility/hq-0477.jpg' },
  { id: 'facility-gallery-04',    page: 'Home',        section: 'Facility',    description: 'Facility gallery image 4',          currentImageUrl: '/assets/images/facility/hq-0391.jpg' },
  { id: 'facility-gallery-05',    page: 'Home',        section: 'Facility',    description: 'Facility gallery image 5',          currentImageUrl: '/assets/images/facility/hq-0745.jpg' },
  { id: 'facility-gallery-06',    page: 'Home',        section: 'Facility',    description: 'Facility gallery image 6',          currentImageUrl: '/assets/images/facility/hq-0354.jpg' },
  { id: 'facility-gallery-07',    page: 'Home',        section: 'Facility',    description: 'Facility gallery image 7',          currentImageUrl: '/assets/images/facility/hq-0696.jpg' },
  { id: 'facility-gallery-08',    page: 'Home',        section: 'Facility',    description: 'Facility gallery image 8',          currentImageUrl: '/assets/images/facility/hq-0167.jpg' },
  { id: 'home-sales-r44',         page: 'Home',        section: 'Sales strip', description: 'R44 card in sales strip',           currentImageUrl: '/assets/images/new-aircraft/r44/raven-ii-front-alpha.png' },
  { id: 'home-sales-r22',         page: 'Home',        section: 'Sales strip', description: 'R22 card in sales strip',           currentImageUrl: '/assets/images/new-aircraft/r22/r22-red-volcano-front-alpha-v3.png' },
  { id: 'home-sales-r66',         page: 'Home',        section: 'Sales strip', description: 'R66 card in sales strip',           currentImageUrl: '/assets/images/new-aircraft/r66/blue-r66-palo-verde-left-v4.png' },
];

const batch = db.batch();
slots.forEach(({ id, ...data }) => {
  batch.set(db.collection('image_slots').doc(id), {
    ...data,
    updatedAt: new Date(),
  });
});
await batch.commit();
console.log(`Seeded ${slots.length} image slots`);
process.exit(0);
```

- [ ] **Step 2: Download service account key**

Firebase Console → Project settings → Service accounts → Generate new private key → save as `service-account.json` in project root.

**Add `service-account.json` to `.gitignore` immediately.**

```bash
echo "service-account.json" >> .gitignore
```

- [ ] **Step 3: Run seed script**

```bash
node scripts/seed-image-slots.js
```

Expected: `Seeded 15 image slots`

- [ ] **Step 4: Commit**

```bash
git add scripts/seed-image-slots.js .gitignore
git commit -m "feat: seed script for image_slots collection"
```

---

### Task 4: Admin Images page (list + replace modal)

**Files:** Create `src/pages/admin/AdminImages.jsx`

- [ ] **Step 1: Create AdminImages page**

```jsx
// src/pages/admin/AdminImages.jsx
import { useState, useEffect, useRef } from 'react';
import { collection, getDocs, doc, updateDoc, serverTimestamp } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { db, storage } from '../../lib/firebase.js';
import AdminLayout from '../../components/admin/AdminLayout.jsx';

export default function AdminImages() {
  const [slots, setSlots]           = useState([]);
  const [loading, setLoading]       = useState(true);
  const [selected, setSelected]     = useState(null); // slot being replaced
  const [uploading, setUploading]   = useState(false);
  const [filter, setFilter]         = useState('');
  const fileRef                     = useRef();

  useEffect(() => { fetchSlots(); }, []);

  async function fetchSlots() {
    setLoading(true);
    const snap = await getDocs(collection(db, 'image_slots'));
    const data = snap.docs.map(d => ({ id: d.id, ...d.data() }));
    data.sort((a, b) => a.page.localeCompare(b.page) || a.section.localeCompare(b.section));
    setSlots(data);
    setLoading(false);
  }

  async function handleUpload(e) {
    const file = e.target.files[0];
    if (!file || !selected) return;
    setUploading(true);
    try {
      const storageRef = ref(storage, `image-slots/${selected.id}/${Date.now()}-${file.name}`);
      await uploadBytes(storageRef, file);
      const url = await getDownloadURL(storageRef);
      await updateDoc(doc(db, 'image_slots', selected.id), {
        currentImageUrl: url,
        updatedAt: serverTimestamp(),
      });
      setSlots(prev => prev.map(s => s.id === selected.id ? { ...s, currentImageUrl: url } : s));
      setSelected(null);
    } finally {
      setUploading(false);
    }
  }

  const filtered = slots.filter(s =>
    !filter || s.page.toLowerCase().includes(filter.toLowerCase()) ||
    s.description.toLowerCase().includes(filter.toLowerCase()) ||
    s.id.toLowerCase().includes(filter.toLowerCase())
  );

  // Group by page
  const byPage = filtered.reduce((acc, s) => {
    (acc[s.page] = acc[s.page] || []).push(s);
    return acc;
  }, {});

  return (
    <AdminLayout>
      <h1 className="adm-page-title">Image Slots</h1>

      <div className="adm-toolbar">
        <input
          className="adm-input"
          style={{ width: 280 }}
          placeholder="Filter by page, section, or ID…"
          value={filter}
          onChange={e => setFilter(e.target.value)}
        />
        <span className="adm-toolbar__spacer" />
        <span style={{ fontSize: '0.72rem', color: '#71717a' }}>{filtered.length} slots</span>
      </div>

      {loading ? <p style={{ color: '#71717a', fontSize: '0.8rem' }}>Loading…</p> : (
        Object.entries(byPage).map(([page, pageSlots]) => (
          <div key={page} className="adm-card" style={{ marginBottom: '1.5rem' }}>
            <p className="adm-card__title">{page}</p>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '1rem' }}>
              {pageSlots.map(slot => (
                <div key={slot.id} style={{ border: '1px solid #e4e4e7', borderRadius: 6, overflow: 'hidden', background: '#fafafa' }}>
                  <div style={{ aspectRatio: '16/9', background: '#e4e4e7', overflow: 'hidden' }}>
                    {slot.currentImageUrl ? (
                      <img src={slot.currentImageUrl} alt={slot.description} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    ) : (
                      <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#a1a1aa', fontSize: '0.65rem' }}>No image set</div>
                    )}
                  </div>
                  <div style={{ padding: '0.6rem 0.75rem' }}>
                    <p style={{ fontSize: '0.7rem', fontWeight: 600, color: '#1a1a1a', margin: '0 0 0.15rem' }}>{slot.description}</p>
                    <p style={{ fontSize: '0.6rem', color: '#71717a', fontFamily: 'monospace', margin: '0 0 0.6rem', wordBreak: 'break-all' }}>{slot.id}</p>
                    <button className="adm-btn adm-btn--outline adm-btn--sm" onClick={() => { setSelected(slot); setTimeout(() => fileRef.current?.click(), 50); }}>
                      <i className="fas fa-upload"></i> Replace
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))
      )}

      {/* Hidden file input */}
      <input ref={fileRef} type="file" accept="image/*" style={{ display: 'none' }} onChange={handleUpload} />

      {/* Upload overlay */}
      {uploading && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 9999, color: '#fff', fontFamily: 'monospace', fontSize: '0.85rem' }}>
          Uploading…
        </div>
      )}
    </AdminLayout>
  );
}
```

- [ ] **Step 2: Add route to App.jsx**

Add this import and route to `src/App.jsx`:

```jsx
import AdminImages from './pages/admin/AdminImages.jsx';

// In <Routes>:
<Route path="/admin/images" element={<AdminRoute><AdminImages /></AdminRoute>} />
```

- [ ] **Step 3: Test in browser**

Visit `/admin/images`. You should see the slot grid grouped by page. Click "Replace" on any slot, pick a file → image should update instantly and persist on page refresh.

- [ ] **Step 4: Commit**

```bash
git add src/pages/admin/AdminImages.jsx src/App.jsx
git commit -m "feat: admin images page — list slots, upload to replace"
```

---

### Task 5: Replace bare <img> tags with <ImageSlot> in key pages

For each file below, import `ImageSlot` and add the `slotId` prop to the relevant `<img>`. Keep the existing `src` as the fallback.

- [ ] **Step 1: Experimentation.jsx — facility gallery images**

In `src/pages/Experimentation.jsx`, find the facility gallery section (the `fd-sales__intro-gallery` div). Replace each `<img>` with an `<ImageSlot>`:

```jsx
import ImageSlot from '../components/admin/ImageSlot.jsx';

// Replace e.g.:
<img src="/assets/images/facility/main-sales-pic.jpg" alt="HQ Aviation showroom" loading="lazy" />
// With:
<ImageSlot slotId="facility-gallery-01" src="/assets/images/facility/main-sales-pic.jpg" alt="HQ Aviation showroom" loading="lazy" />
```

Apply to all 8 facility gallery images using slot IDs `facility-gallery-01` through `facility-gallery-08`.

- [ ] **Step 2: EndOfMarchVersion.jsx — same facility gallery**

Repeat the same substitution in `src/pages/EndOfMarchVersion.jsx` for whichever facility gallery renders there.

- [ ] **Step 3: Commit**

```bash
git add src/pages/Experimentation.jsx src/pages/EndOfMarchVersion.jsx
git commit -m "feat: facility gallery images use ImageSlot for CMS control"
```

- [ ] **Step 4: Continue for remaining key images**

For each of these, find the `<img>` and wrap it:

| File | img src pattern | slotId |
|------|----------------|--------|
| `src/pages/Experimentation.jsx` hero section | hero background | `home-hero-main` |
| `src/pages/EndOfMarchVersion.jsx` hero | hero background | `home-hero-main` |
| `src/pages/FinalMaintenance.jsx` hero | maintenance hero | `maintenance-hero-bg` |

Commit after each file:

```bash
git commit -m "feat: [page] hero image uses ImageSlot"
```

---

### ✅ Image Management complete

After this plan:
- Every key image on the site has a `slotId`
- The admin can visit `/admin/images`, see all slots with live previews, and replace any image by uploading a file
- Uploaded images go to Firebase Storage; Firestore stores the URL; `ImageSlot` reads it at runtime
- New slots can be added to the seed script and rerun at any time

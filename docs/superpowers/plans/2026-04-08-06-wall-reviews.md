# Wall of Cool & Reviews Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a public upload form for the "Wall of Cool" user photo submissions, a moderation panel to approve/reject them, and a review curation panel to control which Google reviews are shown and in what order.

**Architecture:** Public users upload images directly to Firebase Storage via the client SDK (no server round-trip needed for upload). A POST to `/api/wall-of-cool` records the submission metadata in Firestore with status `pending`. The admin panel reads pending submissions, lets the admin approve/reject, and approved images are shown on the public Wall of Cool page. Reviews are seeded manually into Firestore and the admin panel controls `visible` and `displayOrder`.

**Tech Stack:** React 19, Firebase 12 (Storage + Firestore + Auth), Express 4, `useFirestore` hook (from Plan 03)

---

## File Map

| File | Action | Responsibility |
|------|--------|----------------|
| `api/wall-of-cool.js` | Create | POST /api/wall-of-cool — record submission in Firestore |
| `src/pages/admin/AdminWallOfCool.jsx` | Create | Moderation panel: pending/approved/rejected grid |
| `src/pages/admin/AdminReviews.jsx` | Create | Review curation: toggle visible, drag-to-reorder |
| `src/App.jsx` | Modify | Add `/admin/wall-of-cool` and `/admin/reviews` routes |
| `src/components/admin/AdminLayout.jsx` | Modify | Add nav items if not present |
| `server.js` | Modify | Mount `api/wall-of-cool.js` |
| `firestore.rules` | Modify | Allow public create on wall_of_cool, admin read/write on reviews |
| `storage.rules` | Modify | Allow authenticated public uploads to `wall-of-cool/` path |

---

### Task 1: Wall of Cool submission API

**Files:**
- Create: `api/wall-of-cool.js`

- [ ] **Step 1: Create `api/wall-of-cool.js`**

```js
// api/wall-of-cool.js
// Records a Wall of Cool submission after the client has uploaded the image to Storage.
// The client uploads directly to Firebase Storage and sends us the resulting download URL.

import express from 'express';
import admin from 'firebase-admin';

const router = express.Router();

// POST /api/wall-of-cool
// Body: { imageUrl, userName, caption }
router.post('/', async (req, res) => {
  try {
    const { imageUrl, userName, caption } = req.body;
    if (!imageUrl || !userName) {
      return res.status(400).json({ error: 'imageUrl and userName are required' });
    }
    // Basic URL validation — must be a Firebase Storage URL
    if (!imageUrl.startsWith('https://firebasestorage.googleapis.com/')) {
      return res.status(400).json({ error: 'imageUrl must be a Firebase Storage URL' });
    }
    const ref = await admin.firestore().collection('wall_of_cool').add({
      imageUrl: String(imageUrl).slice(0, 500),
      userName: String(userName).slice(0, 100),
      caption: String(caption || '').slice(0, 500),
      status: 'pending',
      submittedAt: admin.firestore.FieldValue.serverTimestamp(),
    });
    return res.json({ id: ref.id });
  } catch (err) {
    console.error('Wall of Cool submission error:', err);
    return res.status(500).json({ error: 'Failed to record submission' });
  }
});

// PATCH /api/wall-of-cool/:id — admin only: approve or reject
router.patch('/:id', async (req, res) => {
  try {
    const { status } = req.body;
    if (!['approved', 'rejected', 'pending'].includes(status)) {
      return res.status(400).json({ error: 'Invalid status' });
    }
    await admin.firestore().collection('wall_of_cool').doc(req.params.id).update({ status });
    return res.json({ ok: true });
  } catch (err) {
    console.error('Wall of Cool update error:', err);
    return res.status(500).json({ error: 'Failed to update submission' });
  }
});

export default router;
```

- [ ] **Step 2: Mount in server**

```js
import wallOfCoolRouter from './api/wall-of-cool.js';
// ...
app.use('/api/wall-of-cool', wallOfCoolRouter);
```

- [ ] **Step 3: Test with curl**

```bash
curl -s -X POST http://localhost:7500/api/wall-of-cool \
  -H "Content-Type: application/json" \
  -d '{"imageUrl":"https://firebasestorage.googleapis.com/test","userName":"Test User","caption":"My flight!"}' \
  | jq .
```

Expected: `{"id":"<firestore-id>"}`

- [ ] **Step 4: Commit**

```bash
git add api/wall-of-cool.js server.js
git commit -m "feat: add Wall of Cool submission and moderation API"
```

---

### Task 2: Update Firebase Storage rules

**Files:**
- Modify: `storage.rules`

- [ ] **Step 1: Read current storage.rules**

Read the file to see existing rules before editing.

- [ ] **Step 2: Add wall-of-cool upload rule**

Ensure `storage.rules` includes:

```
rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {
    // Admin uploads (listings, blog cover images)
    match /listings/{allPaths=**} {
      allow read: if true;
      allow write: if request.auth != null && request.auth.token.email == 'owner@hqaviation.co.uk';
    }
    match /blog/{allPaths=**} {
      allow read: if true;
      allow write: if request.auth != null && request.auth.token.email == 'owner@hqaviation.co.uk';
    }
    match /image-slots/{allPaths=**} {
      allow read: if true;
      allow write: if request.auth != null && request.auth.token.email == 'owner@hqaviation.co.uk';
    }
    // Public uploads for Wall of Cool — any user can upload, size ≤ 10MB, images only
    match /wall-of-cool/{filename} {
      allow read: if true;
      allow create: if request.resource.size < 10 * 1024 * 1024
                    && request.resource.contentType.matches('image/.*');
      allow update, delete: if request.auth != null && request.auth.token.email == 'owner@hqaviation.co.uk';
    }
  }
}
```

- [ ] **Step 3: Commit**

```bash
git add storage.rules
git commit -m "feat: add storage rules for wall-of-cool public uploads"
```

---

### Task 3: `AdminWallOfCool` moderation panel

**Files:**
- Create: `src/pages/admin/AdminWallOfCool.jsx`

- [ ] **Step 1: Create AdminWallOfCool**

Create `src/pages/admin/AdminWallOfCool.jsx`:

```jsx
import { useState } from 'react';
import AdminLayout from '../../components/admin/AdminLayout';
import StatusBadge from '../../components/admin/StatusBadge';
import { useCollection } from '../../hooks/useFirestore';

const TABS = ['pending', 'approved', 'rejected'];

export default function AdminWallOfCool() {
  const { docs: submissions, loading } = useCollection('wall_of_cool', 'submittedAt');
  const [activeTab, setActiveTab] = useState('pending');
  const [updating, setUpdating] = useState(null);

  async function setStatus(id, status) {
    setUpdating(id);
    try {
      await fetch(`/api/wall-of-cool/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status }),
      });
    } finally {
      setUpdating(null);
    }
  }

  function formatDate(ts) {
    if (!ts) return '—';
    const d = ts.toDate ? ts.toDate() : new Date(ts);
    return d.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });
  }

  const counts = TABS.reduce((acc, t) => {
    acc[t] = submissions.filter((s) => s.status === t).length;
    return acc;
  }, {});

  const filtered = submissions.filter((s) => s.status === activeTab);

  return (
    <AdminLayout>
      <h1 style={{ fontSize: '1.5rem', fontWeight: 700, color: '#111827', marginBottom: '1rem' }}>Wall of Cool</h1>

      {/* Tab bar */}
      <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1.5rem', borderBottom: '2px solid #e5e7eb' }}>
        {TABS.map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            style={{
              padding: '0.5rem 1.25rem',
              border: 'none',
              background: 'none',
              cursor: 'pointer',
              fontSize: '0.875rem',
              fontWeight: 600,
              color: activeTab === tab ? '#111827' : '#6b7280',
              borderBottom: activeTab === tab ? '2px solid #111827' : '2px solid transparent',
              marginBottom: '-2px',
              textTransform: 'capitalize',
            }}
          >
            {tab} ({counts[tab]})
          </button>
        ))}
      </div>

      {loading ? (
        <p style={{ color: '#6b7280' }}>Loading…</p>
      ) : filtered.length === 0 ? (
        <p style={{ color: '#6b7280' }}>No {activeTab} submissions.</p>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: '1rem' }}>
          {filtered.map((sub) => (
            <div
              key={sub.id}
              style={{ background: '#fff', border: '1px solid #e5e7eb', borderRadius: '8px', overflow: 'hidden' }}
            >
              <img
                src={sub.imageUrl}
                alt={sub.caption || sub.userName}
                style={{ width: '100%', height: '180px', objectFit: 'cover', display: 'block' }}
              />
              <div style={{ padding: '0.75rem' }}>
                <div style={{ fontWeight: 600, fontSize: '0.875rem', color: '#111827', marginBottom: '0.2rem' }}>
                  {sub.userName}
                </div>
                {sub.caption && (
                  <p style={{ fontSize: '0.8rem', color: '#6b7280', margin: '0 0 0.5rem', lineHeight: 1.4 }}>
                    {sub.caption}
                  </p>
                )}
                <div style={{ fontSize: '0.75rem', color: '#9ca3af', marginBottom: '0.75rem' }}>
                  {formatDate(sub.submittedAt)}
                </div>
                <div style={{ display: 'flex', gap: '0.5rem' }}>
                  {activeTab !== 'approved' && (
                    <button
                      onClick={() => setStatus(sub.id, 'approved')}
                      disabled={updating === sub.id}
                      style={{ flex: 1, padding: '0.4rem', background: '#d1fae5', color: '#065f46', border: 'none', borderRadius: '5px', cursor: 'pointer', fontWeight: 600, fontSize: '0.8rem' }}
                    >
                      {updating === sub.id ? '…' : 'Approve'}
                    </button>
                  )}
                  {activeTab !== 'rejected' && (
                    <button
                      onClick={() => setStatus(sub.id, 'rejected')}
                      disabled={updating === sub.id}
                      style={{ flex: 1, padding: '0.4rem', background: '#fee2e2', color: '#991b1b', border: 'none', borderRadius: '5px', cursor: 'pointer', fontWeight: 600, fontSize: '0.8rem' }}
                    >
                      {updating === sub.id ? '…' : 'Reject'}
                    </button>
                  )}
                  {activeTab !== 'pending' && (
                    <button
                      onClick={() => setStatus(sub.id, 'pending')}
                      disabled={updating === sub.id}
                      style={{ flex: 1, padding: '0.4rem', background: '#f3f4f6', color: '#374151', border: 'none', borderRadius: '5px', cursor: 'pointer', fontWeight: 600, fontSize: '0.8rem' }}
                    >
                      {updating === sub.id ? '…' : 'Reset'}
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </AdminLayout>
  );
}
```

- [ ] **Step 2: Commit**

```bash
git add src/pages/admin/AdminWallOfCool.jsx
git commit -m "feat: add AdminWallOfCool moderation panel"
```

---

### Task 4: `AdminReviews` curation panel

**Files:**
- Create: `src/pages/admin/AdminReviews.jsx`

Admin can toggle reviews visible/hidden and change display order by editing a number field inline.

- [ ] **Step 1: Create AdminReviews**

Create `src/pages/admin/AdminReviews.jsx`:

```jsx
import { useState } from 'react';
import { doc, updateDoc } from 'firebase/firestore';
import AdminLayout from '../../components/admin/AdminLayout';
import { useCollection } from '../../hooks/useFirestore';
import { db } from '../../lib/firebase';

export default function AdminReviews() {
  const { docs: reviews, loading } = useCollection('reviews', 'displayOrder');
  const [saving, setSaving] = useState(null);
  const [orderEdits, setOrderEdits] = useState({});

  async function toggleVisible(review) {
    setSaving(review.id);
    try {
      await updateDoc(doc(db, 'reviews', review.id), { visible: !review.visible });
    } finally {
      setSaving(null);
    }
  }

  async function saveOrder(id) {
    const val = parseInt(orderEdits[id], 10);
    if (isNaN(val)) return;
    setSaving(id);
    try {
      await updateDoc(doc(db, 'reviews', id), { displayOrder: val });
      setOrderEdits((o) => { const next = { ...o }; delete next[id]; return next; });
    } finally {
      setSaving(null);
    }
  }

  function stars(rating) {
    return '★'.repeat(rating) + '☆'.repeat(5 - rating);
  }

  // Sort by displayOrder for display
  const sorted = [...reviews].sort((a, b) => (a.displayOrder ?? 999) - (b.displayOrder ?? 999));

  return (
    <AdminLayout>
      <div style={{ marginBottom: '1.5rem' }}>
        <h1 style={{ fontSize: '1.5rem', fontWeight: 700, color: '#111827' }}>Reviews</h1>
        <p style={{ color: '#6b7280', fontSize: '0.875rem', marginTop: '0.25rem' }}>
          Toggle visibility and set display order. Lower order numbers appear first.
        </p>
      </div>

      {loading ? (
        <p style={{ color: '#6b7280' }}>Loading…</p>
      ) : reviews.length === 0 ? (
        <div>
          <p style={{ color: '#6b7280', marginBottom: '1rem' }}>No reviews in Firestore yet.</p>
          <p style={{ fontSize: '0.875rem', color: '#374151' }}>
            To seed reviews: add documents manually to the <code>reviews</code> collection in the Firebase console,
            or paste them from your Google My Business export. Required fields:{' '}
            <code>author, rating (1-5), text, date, visible (bool), displayOrder (int)</code>.
          </p>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
          {sorted.map((review) => (
            <div
              key={review.id}
              style={{
                background: '#fff',
                border: '1px solid #e5e7eb',
                borderRadius: '8px',
                padding: '1rem',
                display: 'flex',
                gap: '1rem',
                alignItems: 'flex-start',
                opacity: review.visible ? 1 : 0.5,
              }}
            >
              {/* Avatar */}
              {review.avatarUrl ? (
                <img src={review.avatarUrl} alt={review.author} style={{ width: '40px', height: '40px', borderRadius: '50%', objectFit: 'cover', flexShrink: 0 }} />
              ) : (
                <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: '#e5e7eb', flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, color: '#6b7280', fontSize: '1rem' }}>
                  {(review.author || '?')[0].toUpperCase()}
                </div>
              )}

              {/* Content */}
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.25rem', flexWrap: 'wrap' }}>
                  <span style={{ fontWeight: 600, color: '#111827', fontSize: '0.875rem' }}>{review.author}</span>
                  <span style={{ color: '#f59e0b', fontSize: '0.875rem' }}>{stars(review.rating)}</span>
                  <span style={{ color: '#9ca3af', fontSize: '0.75rem' }}>{review.date}</span>
                </div>
                <p style={{ color: '#374151', fontSize: '0.875rem', lineHeight: 1.5, margin: 0, display: '-webkit-box', WebkitLineClamp: 3, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                  {review.text}
                </p>
              </div>

              {/* Controls */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', alignItems: 'flex-end', flexShrink: 0 }}>
                <button
                  onClick={() => toggleVisible(review)}
                  disabled={saving === review.id}
                  style={{
                    padding: '0.35rem 0.75rem',
                    border: 'none',
                    borderRadius: '5px',
                    cursor: 'pointer',
                    fontSize: '0.8rem',
                    fontWeight: 600,
                    background: review.visible ? '#d1fae5' : '#f3f4f6',
                    color: review.visible ? '#065f46' : '#374151',
                  }}
                >
                  {saving === review.id ? '…' : review.visible ? 'Visible' : 'Hidden'}
                </button>

                <div style={{ display: 'flex', gap: '0.25rem', alignItems: 'center' }}>
                  <label style={{ fontSize: '0.7rem', color: '#6b7280' }}>Order</label>
                  <input
                    type="number"
                    value={orderEdits[review.id] !== undefined ? orderEdits[review.id] : (review.displayOrder ?? '')}
                    onChange={(e) => setOrderEdits((o) => ({ ...o, [review.id]: e.target.value }))}
                    onBlur={() => { if (orderEdits[review.id] !== undefined) saveOrder(review.id); }}
                    onKeyDown={(e) => { if (e.key === 'Enter') saveOrder(review.id); }}
                    style={{ width: '52px', padding: '0.25rem 0.4rem', border: '1px solid #d1d5db', borderRadius: '4px', fontSize: '0.8rem', textAlign: 'center' }}
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </AdminLayout>
  );
}
```

- [ ] **Step 2: Commit**

```bash
git add src/pages/admin/AdminReviews.jsx
git commit -m "feat: add AdminReviews curation panel with visibility and order control"
```

---

### Task 5: Wire up routes and nav

**Files:**
- Modify: `src/App.jsx`
- Modify: `src/components/admin/AdminLayout.jsx`

- [ ] **Step 1: Add routes to App.jsx**

```jsx
import AdminWallOfCool from './pages/admin/AdminWallOfCool';
import AdminReviews from './pages/admin/AdminReviews';
// ...
<Route path="/admin/wall-of-cool" element={<AdminWallOfCool />} />
<Route path="/admin/reviews" element={<AdminReviews />} />
```

- [ ] **Step 2: Add to AdminLayout NAV_ITEMS if not present**

```jsx
{ to: '/admin/wall-of-cool', icon: '📸', label: 'Wall of Cool' },
{ to: '/admin/reviews', icon: '⭐', label: 'Reviews' },
```

- [ ] **Step 3: Commit**

```bash
git add src/App.jsx src/components/admin/AdminLayout.jsx
git commit -m "feat: add wall-of-cool and reviews admin routes and nav items"
```

---

### Task 6: Update Firestore security rules

**Files:**
- Modify: `firestore.rules`

- [ ] **Step 1: Add wall_of_cool and reviews rules**

Ensure `firestore.rules` includes these collection rules (in addition to existing rules from Plan 01):

```
// Wall of Cool — public create, admin read/write
match /wall_of_cool/{id} {
  allow read: if true;
  allow create: if true; // server validates URL and content
  allow update, delete: if request.auth != null
                        && request.auth.token.email == 'owner@hqaviation.co.uk';
}

// Reviews — public read (for displaying on site), admin write
match /reviews/{id} {
  allow read: if true;
  allow write: if request.auth != null
               && request.auth.token.email == 'owner@hqaviation.co.uk';
}
```

- [ ] **Step 2: Commit**

```bash
git add firestore.rules
git commit -m "feat: update Firestore rules for wall_of_cool and reviews"
```

---

### Task 7: Seed test reviews

Reviews come from Google My Business — there's no automated import in this plan. The admin seeds them manually.

- [ ] **Step 1: Open Firebase console → Firestore → `reviews` collection**

- [ ] **Step 2: Add a test document**

Click "Add document" with auto ID. Set these fields:
```
author: "John Smith"         (string)
rating: 5                    (number)
text: "Fantastic experience, highly recommend HQ Aviation."
date: "January 2025"         (string)
avatarUrl: ""                (string — leave blank)
visible: true                (boolean)
displayOrder: 1              (number)
googleReviewId: ""           (string — optional, for reference)
```

- [ ] **Step 3: Verify in /admin/reviews**

Expected: Review card appears with stars, toggle button shows "Visible", order field shows 1.

- [ ] **Step 4: Toggle to hidden**

Click "Visible" button. Expected: Card dims to 50% opacity, button shows "Hidden".

---

### Task 8: Manual smoke test for Wall of Cool

- [ ] **Step 1: Simulate a submission via curl**

```bash
# First upload an image to Firebase Storage via the client SDK (or use any existing Storage URL)
# Then record the submission:
curl -s -X POST http://localhost:7500/api/wall-of-cool \
  -H "Content-Type: application/json" \
  -d '{"imageUrl":"https://firebasestorage.googleapis.com/v0/b/YOUR_BUCKET/o/wall-of-cool%2Ftest.jpg?alt=media","userName":"Test Pilot","caption":"First solo!"}' \
  | jq .
```

Replace `YOUR_BUCKET` with your Firebase Storage bucket name from the env vars.

- [ ] **Step 2: Open /admin/wall-of-cool**

Expected: Test submission appears in "Pending" tab with image, name, and caption.

- [ ] **Step 3: Approve the submission**

Click "Approve". Expected: Card disappears from Pending tab. Switch to "Approved" tab — card appears there.

- [ ] **Step 4: Reject the submission**

Switch to Approved, click "Reject". Expected: Moves to Rejected tab.

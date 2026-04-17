# Blog View Counts & Press Link Click Counts Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Show all-time blog post view counts and press link click counts as inline columns in the AdminBlog management tables.

**Architecture:** Blog views are sourced by querying the existing `page_events` collection (filtered to `/blog/*` paths) on AdminBlog mount — no new writes per pageview. Press link clicks are tracked by a new `POST /api/press-click` endpoint that uses `FieldValue.increment(1)` on the `press_links` document's `clicks` field; the Blog page fires this as a fire-and-forget fetch on card click. A Firestore composite index enables the `(eventType, page)` range query.

**Tech Stack:** React (Vite), Firebase Firestore (client SDK + Admin SDK), Express, express-rate-limit, Vitest

---

## File Map

| File | Action | Responsibility |
|------|--------|---------------|
| `firestore.indexes.json` | Modify | Add composite index on `page_events(eventType, page)` |
| `api/press-click.js` | Create | POST endpoint — validate ID, increment `press_links/{id}.clicks` |
| `server.js` | Modify | Mount `/api/press-click` route |
| `src/lib/pressClick.js` | Create | Fire-and-forget press click tracker (exported for testing) |
| `src/lib/pressClick.test.js` | Create | Vitest unit tests for `trackPressClick` |
| `src/pages/Blog.jsx` | Modify | Import `trackPressClick`, add `onClick` to press link cards |
| `src/pages/admin/AdminBlog.jsx` | Modify | Query `page_events` for blog views; render Views + Clicks columns |

---

## Task 1: Firestore composite index

**Files:**
- Modify: `firestore.indexes.json`

- [ ] **Step 1: Add the composite index**

Open `firestore.indexes.json` and add a new entry to the `"indexes"` array. The final file should look like this:

```json
{
  "indexes": [
    {
      "collectionGroup": "helicopters",
      "queryScope": "COLLECTION",
      "fields": [
        { "fieldPath": "status", "order": "ASCENDING" },
        { "fieldPath": "sortOrder", "order": "ASCENDING" }
      ]
    },
    {
      "collectionGroup": "helicopters",
      "queryScope": "COLLECTION",
      "fields": [
        { "fieldPath": "status", "order": "ASCENDING" },
        { "fieldPath": "featured", "order": "ASCENDING" },
        { "fieldPath": "sortOrder", "order": "ASCENDING" }
      ]
    },
    {
      "collectionGroup": "helicopters",
      "queryScope": "COLLECTION",
      "fields": [
        { "fieldPath": "status", "order": "ASCENDING" },
        { "fieldPath": "soldAt", "order": "DESCENDING" }
      ]
    },
    {
      "collectionGroup": "wall_of_cool",
      "queryScope": "COLLECTION",
      "fields": [
        { "fieldPath": "status", "order": "ASCENDING" },
        { "fieldPath": "type",   "order": "ASCENDING" },
        { "fieldPath": "order",  "order": "ASCENDING" }
      ]
    },
    {
      "collectionGroup": "faqs",
      "queryScope": "COLLECTION",
      "fields": [
        { "fieldPath": "page",         "order": "ASCENDING" },
        { "fieldPath": "displayOrder", "order": "ASCENDING" }
      ]
    },
    {
      "collectionGroup": "page_events",
      "queryScope": "COLLECTION",
      "fields": [
        { "fieldPath": "eventType", "order": "ASCENDING" },
        { "fieldPath": "page", "order": "ASCENDING" }
      ]
    }
  ],
  "fieldOverrides": []
}
```

- [ ] **Step 2: Commit**

```bash
git add firestore.indexes.json
git commit -m "feat(analytics): add composite index for blog view count query"
```

---

## Task 2: Create `api/press-click.js`

**Files:**
- Create: `api/press-click.js`

- [ ] **Step 1: Create the file**

```js
'use strict';

const { Router } = require('express');
const rateLimit = require('express-rate-limit');
const admin = require('./firebase-admin');

const router = Router();

const pressClickLimiter = rateLimit({
  windowMs: 60 * 1000,
  max: 10,
  standardHeaders: true,
  legacyHeaders: false,
  keyGenerator: (req) => req.ip || 'unknown',
  handler: (_req, res) => res.status(429).json({ error: 'Too many requests' }),
});

// POST /api/press-click
// body: { id: string } — Firestore document ID of the press link
router.post('/', pressClickLimiter, async (req, res) => {
  const { id } = req.body || {};

  if (!id || typeof id !== 'string' || id.length > 100) {
    return res.status(400).json({ error: 'Invalid id' });
  }

  const db = admin.firestore();
  const ref = db.collection('press_links').doc(id);

  try {
    const snap = await ref.get();
    if (!snap.exists) {
      return res.status(404).json({ error: 'Not found' });
    }
    await ref.update({
      clicks: admin.firestore.FieldValue.increment(1),
    });
    return res.json({ ok: true });
  } catch (err) {
    console.error('press-click error:', err);
    return res.status(500).json({ error: 'Failed to record click' });
  }
});

module.exports = router;
```

- [ ] **Step 2: Commit**

```bash
git add api/press-click.js
git commit -m "feat(api): add press-click endpoint to increment press link click counter"
```

---

## Task 3: Mount route in `server.js`

**Files:**
- Modify: `server.js`

- [ ] **Step 1: Add the require and mount**

Near the top of `server.js` where the other routers are imported (around line 24–27), add:

```js
const pressClickRouter = require('./api/press-click');
```

Then find the block where analytics is mounted (around line 195):

```js
app.use('/api/analytics', express.json(), analyticsRouter);
```

Add directly after it:

```js
app.use('/api/press-click', express.json(), pressClickRouter);
```

- [ ] **Step 2: Smoke test the endpoint**

Start the dev server (`npm run dev`) and run:

```bash
curl -s -X POST http://localhost:7500/api/press-click \
  -H "Content-Type: application/json" \
  -d '{"id":"nonexistent-id"}' | cat
```

Expected output: `{"error":"Not found"}` (404 — proves validation and Firestore lookup work, without a real ID).

```bash
curl -s -X POST http://localhost:7500/api/press-click \
  -H "Content-Type: application/json" \
  -d '{}' | cat
```

Expected output: `{"error":"Invalid id"}` (400).

- [ ] **Step 3: Commit**

```bash
git add server.js
git commit -m "feat(server): mount /api/press-click route"
```

---

## Task 4: Client-side press click tracker

**Files:**
- Create: `src/lib/pressClick.js`
- Create: `src/lib/pressClick.test.js`

- [ ] **Step 1: Write the failing test**

Create `src/lib/pressClick.test.js`:

```js
// @vitest-environment jsdom
import { describe, it, expect, vi, beforeEach } from 'vitest';

global.fetch = vi.fn(() => Promise.resolve({ ok: true }));

beforeEach(() => vi.clearAllMocks());

import { trackPressClick } from './pressClick';

describe('trackPressClick', () => {
  it('calls POST /api/press-click with the press link id', async () => {
    await trackPressClick('abc123');
    expect(fetch).toHaveBeenCalledWith(
      '/api/press-click',
      expect.objectContaining({
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: 'abc123' }),
      })
    );
  });

  it('does not throw when fetch fails', async () => {
    fetch.mockRejectedValueOnce(new Error('network error'));
    await expect(trackPressClick('abc123')).resolves.toBeUndefined();
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

```bash
npm test -- pressClick
```

Expected: FAIL — `Cannot find module './pressClick'`

- [ ] **Step 3: Create `src/lib/pressClick.js`**

```js
/**
 * Fire-and-forget press link click tracker.
 * Increments the clicks counter on the press_links Firestore document.
 * Never throws — must never break site navigation.
 */
export async function trackPressClick(id) {
  try {
    await fetch('/api/press-click', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id }),
    });
  } catch {
    // Silently swallow — analytics must never block navigation
  }
}
```

- [ ] **Step 4: Run tests to verify they pass**

```bash
npm test -- pressClick
```

Expected:
```
✓ calls POST /api/press-click with the press link id
✓ does not throw when fetch fails
```

- [ ] **Step 5: Commit**

```bash
git add src/lib/pressClick.js src/lib/pressClick.test.js
git commit -m "feat(lib): add trackPressClick utility with tests"
```

---

## Task 5: Wire click tracking into Blog.jsx

**Files:**
- Modify: `src/pages/Blog.jsx`

- [ ] **Step 1: Add the import**

At the top of `src/pages/Blog.jsx`, after the existing imports, add:

```js
import { trackPressClick } from '../lib/pressClick';
```

- [ ] **Step 2: Add onClick to press link cards**

Find the press link `<a>` element in Blog.jsx (around line 149–158). It currently looks like:

```jsx
return post.externalUrl ? (
  <a
    key={post.id}
    href={post.externalUrl}
    target="_blank"
    rel="noopener noreferrer"
    className="blog-listing__card"
  >
    {cardContent}
  </a>
) : (
```

Change it to:

```jsx
return post.externalUrl ? (
  <a
    key={post.id}
    href={post.externalUrl}
    target="_blank"
    rel="noopener noreferrer"
    className="blog-listing__card"
    onClick={() => trackPressClick(post.id)}
  >
    {cardContent}
  </a>
) : (
```

- [ ] **Step 3: Manual verification**

Run `npm run dev`, navigate to `/blog`. Open the network tab in DevTools. Click a press link card — you should see a `POST /api/press-click` request fire with `{ "id": "<doc-id>" }` in the payload. The link still opens in a new tab normally.

- [ ] **Step 4: Commit**

```bash
git add src/pages/Blog.jsx
git commit -m "feat(blog): track press link clicks on card click"
```

---

## Task 6: Views column in AdminBlog — Blog Posts tab

**Files:**
- Modify: `src/pages/admin/AdminBlog.jsx`

- [ ] **Step 1: Add Firebase imports**

At the top of `src/pages/admin/AdminBlog.jsx`, replace:

```js
import { useState } from 'react';
```

with:

```js
import { useState, useEffect } from 'react';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { db } from '../../lib/firebase';
```

- [ ] **Step 2: Add state for blog view map**

Inside the `AdminBlog` component, after the existing `useState` declarations (around line 83–91), add:

```js
const [blogViewMap, setBlogViewMap] = useState({});
const [viewsLoading, setViewsLoading] = useState(false);
const [viewsFetched, setViewsFetched] = useState(false);
```

- [ ] **Step 3: Add the query effect**

After the new state declarations, add:

```js
useEffect(() => {
  if (activeTab !== 'posts' || viewsFetched) return;
  setViewsLoading(true);
  setViewsFetched(true);
  getDocs(
    query(
      collection(db, 'page_events'),
      where('eventType', '==', 'pageview'),
      where('page', '>=', '/blog/'),
      where('page', '<', '/blog/~'),
    ),
  )
    .then((snap) => {
      const map = {};
      snap.docs.forEach((d) => {
        const p = d.data().page;
        map[p] = (map[p] || 0) + 1;
      });
      setBlogViewMap(map);
    })
    .catch(() => {})
    .finally(() => setViewsLoading(false));
}, [activeTab, viewsFetched]);
```

- [ ] **Step 4: Add Views column to the table header**

Find the blog posts table header (around line 251). It currently reads:

```jsx
{['Title', 'Slug', 'Status', 'Published', ''].map((h) => (
  <th key={h} style={{ padding: '0.75rem 1rem', textAlign: 'left', color: '#374151', fontWeight: 600 }}>
    {h}
  </th>
))}
```

Change it to:

```jsx
{['Title', 'Slug', 'Status', 'Published', 'Views', ''].map((h) => (
  <th key={h} style={{ padding: '0.75rem 1rem', textAlign: h === 'Views' ? 'right' : 'left', color: '#374151', fontWeight: 600 }}>
    {h}
  </th>
))}
```

- [ ] **Step 5: Add Views cell to each post row**

Find the blog post table row (around line 259–275). After the `Published` cell and before the actions cell, add:

```jsx
<td style={{ padding: '0.75rem 1rem', color: '#6b7280', textAlign: 'right', fontFamily: 'monospace', fontSize: '0.8rem' }}>
  {viewsLoading ? '—' : (blogViewMap[`/blog/${p.slug || p.id}`] ?? 0).toLocaleString()}
</td>
```

The full row should now read:

```jsx
{posts.map((p) => (
  <tr key={p.id} style={{ borderBottom: '1px solid #f3f4f6' }}>
    <td style={{ padding: '0.75rem 1rem', fontWeight: 500, color: '#111827', maxWidth: '260px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{p.title}</td>
    <td style={{ padding: '0.75rem 1rem', color: '#6b7280', fontFamily: 'monospace', fontSize: '0.8rem' }}>{p.slug}</td>
    <td style={{ padding: '0.75rem 1rem' }}><StatusBadge status={p.status} /></td>
    <td style={{ padding: '0.75rem 1rem', color: '#6b7280' }}>{formatDate(p.publishedAt)}</td>
    <td style={{ padding: '0.75rem 1rem', color: '#6b7280', textAlign: 'right', fontFamily: 'monospace', fontSize: '0.8rem' }}>
      {viewsLoading ? '—' : (blogViewMap[`/blog/${p.slug || p.id}`] ?? 0).toLocaleString()}
    </td>
    <td style={{ padding: '0.75rem 1rem', whiteSpace: 'nowrap' }}>
      <Link to={`/admin/blog/${p.id}`} style={{ color: '#2563eb', textDecoration: 'none', marginRight: '1rem', fontWeight: 500 }}>
        Edit
      </Link>
      <button
        onClick={() => handleDeletePost(p.id)}
        disabled={deleting === p.id}
        style={{ background: 'none', border: 'none', color: '#dc2626', cursor: 'pointer', fontWeight: 500, fontSize: '0.875rem' }}
      >
        {deleting === p.id ? 'Deleting…' : 'Delete'}
      </button>
    </td>
  </tr>
))}
```

- [ ] **Step 6: Manual verification**

Run `npm run dev`, log into admin, navigate to `/admin/blog`. The Blog Posts tab should show a "Views" column. While loading it shows `—`; after the query resolves it shows a number (0 for new posts).

- [ ] **Step 7: Commit**

```bash
git add src/pages/admin/AdminBlog.jsx
git commit -m "feat(admin): add Views column to blog posts table"
```

---

## Task 7: Clicks column in AdminBlog — Press Links tab

**Files:**
- Modify: `src/pages/admin/AdminBlog.jsx`

- [ ] **Step 1: Add Clicks column to press links table header**

Find the press links table header (around line 417–421). It currently reads:

```jsx
{['Title', 'Publication', 'Date', 'URL', ''].map((h) => (
  <th key={h} style={{ padding: '0.75rem 1rem', textAlign: 'left', color: '#374151', fontWeight: 600 }}>
    {h}
  </th>
))}
```

Change it to:

```jsx
{['Title', 'Publication', 'Date', 'URL', 'Clicks', ''].map((h) => (
  <th key={h} style={{ padding: '0.75rem 1rem', textAlign: h === 'Clicks' ? 'right' : 'left', color: '#374151', fontWeight: 600 }}>
    {h}
  </th>
))}
```

- [ ] **Step 2: Add Clicks cell to each press link row**

Find the press link table row (around line 427–462). After the URL `<td>` and before the actions `<td>`, add:

```jsx
<td style={{ padding: '0.75rem 1rem', color: '#6b7280', textAlign: 'right', fontFamily: 'monospace', fontSize: '0.8rem' }}>
  {(p.clicks ?? 0).toLocaleString()}
</td>
```

The `clicks` field is already returned by `useCollection('press_links')` — no extra query needed. Existing press links without the field default to `0`.

- [ ] **Step 3: Manual verification**

Navigate to `/admin/blog`, switch to the Press Links tab. A "Clicks" column appears showing `0` for all links initially. Click a press link card on the public `/blog` page (the card onClick fires `trackPressClick`). Return to admin and refresh — the counter for that press link increments by 1.

- [ ] **Step 4: Commit**

```bash
git add src/pages/admin/AdminBlog.jsx
git commit -m "feat(admin): add Clicks column to press links table"
```

---

## Task 8: Deploy Firestore index

- [ ] **Step 1: Deploy the indexes**

```bash
firebase deploy --only firestore:indexes
```

Expected output:
```
✔  firestore: deployed indexes in firestore.indexes.json
```

The new `page_events(eventType, page)` composite index will take a few minutes to build in Firebase. The AdminBlog views query will return an error in the console until it's ready — this is expected and handled gracefully (the query failure is swallowed, Views shows `—`).

- [ ] **Step 2: Verify index is active**

Go to Firebase Console → Firestore → Indexes. The new index for `page_events` should show status "Enabled" (not "Building").

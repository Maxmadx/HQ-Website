# Blog View Counts & Press Link Click Counts

**Date:** 2026-04-17  
**Status:** Approved

## Overview

Add all-time view counts for blog posts and click counts for external press links, displayed as inline columns in the AdminBlog management tables. No changes to AdminAnalytics.

## Scope

- **Blog Posts tab** (AdminBlog): new "Views" column showing all-time pageview count per post
- **Press Links tab** (AdminBlog): new "Clicks" column showing all-time click count per press link
- Click tracking on the public Blog page for external press links

Out of scope: time-range filtering, sorting/filtering by count, static posts from `posts.json` (not shown in AdminBlog).

---

## Architecture

### Data sources

**Blog post views** — already captured. The existing `PageTracker` component fires a `pageview` event to `page_events` for every route, including `/blog/:slug`. No new writes needed.

**Press link clicks** — not currently tracked. A `clicks` integer field will be stored directly on each `press_links` Firestore document, incremented server-side on each click.

---

## Components

### 1. `api/press-click.js` (new)

Express router mounted at `/api/press-click`.

**`POST /api/press-click`**
- Body: `{ id: string }` — Firestore document ID of the press link
- Validates `id` is a non-empty string
- Uses Admin SDK `FieldValue.increment(1)` on `press_links/{id}.clicks`
- Returns `{ ok: true }` on success, `400` on invalid input, `404` if document doesn't exist
- Rate-limited: 10 requests per IP per minute (prevents click inflation)
- No auth required (public endpoint — press links are clicked by site visitors)

### 2. `src/pages/Blog.jsx`

Add an `onClick` handler to the press link `<a>` elements. The handler calls `fetch('/api/press-click', { method: 'POST', body: JSON.stringify({ id: post.id }) })` — fire-and-forget (`.catch(() => {})`). The default link behaviour (`target="_blank"`) is not prevented; the link always opens regardless of fetch outcome.

### 3. `src/pages/admin/AdminBlog.jsx`

**Blog Posts tab — Views column**

On mount (when `activeTab === 'posts'` or on first render), query `page_events`:

```
collection: page_events
where: eventType == 'pageview'
where: page >= '/blog/'
where: page < '/blog/~'
```

Aggregate results into a map `blogViewMap: { [pagePath: string]: number }`. Render a **Views** column in the blog posts table looking up `blogViewMap['/blog/' + (p.slug || p.id)] ?? 0`.

Loading state: show `—` in the Views column while the query is in-flight.

**Press Links tab — Clicks column**

The `clicks` field is already returned on each document by `useCollection('press_links')`. Render a **Clicks** column showing `p.clicks ?? 0`. No additional query needed.

### 4. `firestore.indexes.json`

Add a composite index required by the blog views query:

```json
{
  "collectionGroup": "page_events",
  "queryScope": "COLLECTION",
  "fields": [
    { "fieldPath": "eventType", "order": "ASCENDING" },
    { "fieldPath": "page", "order": "ASCENDING" }
  ]
}
```

### 5. `server.js`

Mount the new router:

```js
const pressClick = require('./api/press-click');
app.use('/api/press-click', pressClick);
```

---

## Data flow

```
Visitor clicks press link on /blog
  → onClick fires fetch POST /api/press-click { id }
  → api/press-click.js increments press_links/{id}.clicks
  → link opens in new tab (unblocked)

Admin opens AdminBlog → Blog Posts tab
  → query page_events (eventType=pageview, page starts with /blog/)
  → aggregate into { path: count } map
  → render Views column

Admin opens AdminBlog → Press Links tab
  → useCollection('press_links') already returns clicks field
  → render Clicks column
```

---

## Files changed

| File | Change |
|------|--------|
| `api/press-click.js` | New — POST endpoint to increment press link clicks |
| `server.js` | Mount `/api/press-click` route |
| `src/pages/Blog.jsx` | Add onClick to press link cards |
| `src/pages/admin/AdminBlog.jsx` | Add Views column (blog posts tab) + Clicks column (press links tab) |
| `firestore.indexes.json` | Add composite index on page_events(eventType, page) |

---

## Error handling

- Press click API failure: swallowed silently — link still opens, user unaffected
- `page_events` query failure: Views column shows `—` with no error surfaced to admin
- Missing `clicks` field on old press link docs: defaults to `0`

## Security

- `/api/press-click` is public but rate-limited (10 req/IP/min). The `id` is validated to exist in Firestore before incrementing; invalid IDs return 404 without writing anything. No user data is accepted beyond the document ID.
- Blog view query is admin-only (Firestore rules: `allow read: if isAdmin()` on `page_events`).

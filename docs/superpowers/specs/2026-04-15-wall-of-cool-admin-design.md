# Wall of Cool Admin — Design Spec
**Date:** 2026-04-15  
**Status:** Approved

---

## Overview

Expand the `/admin/wall-of-cool` panel from a basic approve/reject queue into a full content management hub for the Wall of Cool homepage section. Supports:
- **User image submissions** (image-only, admin adds metadata at approval)
- **User video submissions** (collected for internal use, not displayed on the wall)
- **Admin direct uploads** (image via MediaLibraryPicker, goes straight to approved)
- **Live wall ordering** (drag-reorder approved images for homepage display)

---

## Data Model

Firestore collection: `wall_of_cool`

| Field | Type | Set by | Notes |
|---|---|---|---|
| `type` | `'image' \| 'video'` | server (POST) | distinguishes submission type |
| `source` | `'user' \| 'admin'` | server (POST) | who submitted |
| `imageUrl` | string | user/admin | present when `type === 'image'` |
| `videoUrl` | string | user | present when `type === 'video'` |
| `status` | `'pending' \| 'approved' \| 'rejected'` | admin | |
| `caption` | string | admin | set at approval time or on admin upload |
| `alt` | string | admin | images only — set at approval time or on admin upload |
| `order` | number | admin | images only — position in live wall |
| `submittedAt` | Timestamp | server | |

**Removed:** `userName` — user submissions are now image/video only, no personal info collected.

**Backwards compat:** existing docs with `userName` are ignored harmlessly.

---

## API

File: `api/wall-of-cool.js`

### Updated endpoints

**`POST /api/wall-of-cool`** (public)  
User submission. Accepts `{ imageUrl, type: 'image' }` or `{ videoUrl, type: 'video' }`. Sets `source: 'user'`, `status: 'pending'`. No `userName` or `caption` from user.

**`PATCH /api/wall-of-cool/:id`** (admin)  
Extended to accept `{ status, caption, alt }` — admin sets metadata when approving. `caption` and `alt` are optional (not required on reject/reset).

### New endpoints

**`POST /api/wall-of-cool/admin`** (admin)  
Admin direct image upload. Body: `{ imageUrl, caption, alt }`. Creates doc with `source: 'admin'`, `status: 'approved'`, `order` set to `(max existing order) + 1`.

**`PATCH /api/wall-of-cool/reorder`** (admin)  
Batch reorder. Body: `[{ id, order }, ...]`. Updates `order` on each approved image doc in a Firestore batch write.

---

## Admin UI — `AdminWallOfCool.jsx`

### Tab structure

```
Top level:  [Images]  [Videos]

Images sub-tabs:   Pending (N) | Live Wall (N) | Rejected (N)
Videos sub-tabs:   Pending (N) | Rejected (N)
```

### Images — Pending tab
- Grid of pending image submissions
- Each card: thumbnail, date badge, `source` badge (user/admin)
- **Approve action**: expands card inline to reveal caption + alt text inputs, then a confirm "Approve" button — calls `PATCH /:id` with `{ status: 'approved', caption, alt, order: maxOrder + 1 }`
- **Reject action**: one-click, calls `PATCH /:id` with `{ status: 'rejected' }`

### Images — Live Wall tab
- **"Add Image" button** at top-right — opens existing `MediaLibraryPicker` modal (same component used in `/admin/images`). On pick, calls `POST /api/wall-of-cool/admin` with `{ imageUrl, caption, alt }` (caption/alt entered in a small form after picking).
- Ordered grid of approved images matching live homepage display order
- **Drag-to-reorder**: each card has a drag handle; on drop, calls `PATCH /api/wall-of-cool/reorder` with updated order array
- Each card: thumbnail, caption, edit button (inline caption/alt edit), remove button (sets status to rejected, removes from wall)

### Images — Rejected tab
- Grid of rejected images
- **Reset** button moves back to pending

### Videos — Pending tab
- Grid of pending video submissions with `<video>` preview element
- **Approve**: inline expand to enter caption, then confirm — calls `PATCH /:id` with `{ status: 'approved', caption }`
- **Reject**: one-click

### Videos — Rejected tab
- Same as Images Rejected but for videos

---

## Public Homepage Wall Section

The existing homepage section reads from Firestore `wall_of_cool` where `status === 'approved'` and `type === 'image'`, ordered by `order` ascending.

**Smart loading strategy: Intersection Observer lazy loading**
- Images render with a placeholder (blurred or skeleton) initially
- `IntersectionObserver` watches each image element; swaps in the real `src` when it enters the viewport
- No "load more" button needed — images load seamlessly as the user scrolls
- Implementation: each image gets a `data-src` attribute; a shared observer swaps it to `src` on intersection

---

## Component Reuse

| Component | Where used |
|---|---|
| `MediaLibraryPicker` | Live Wall "Add Image" — zero changes needed |
| `useCollection` hook | All tabs — real-time Firestore subscription |
| `StatusBadge` | Source/type badges on cards |

---

## Out of Scope

- Editing existing approved video metadata (future iteration)
- Analytics on wall engagement
- Public video display (videos are internal use only)
- Bulk approve/reject

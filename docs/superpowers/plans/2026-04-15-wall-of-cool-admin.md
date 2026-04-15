# Wall of Cool Admin — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Upgrade `/admin/wall-of-cool` from a basic approve/reject queue into a full content hub supporting user image + video submissions, admin direct uploads via MediaLibraryPicker, inline approval with caption/alt metadata, drag-to-reorder on the live wall, and a lazy-loading public wall component.

**Architecture:** Single `AdminWallOfCool.jsx` rewrite with Images/Videos section switcher and sub-tabs per section. API gains two new endpoints (admin upload, batch reorder) and the existing endpoints are extended. Public wall is a standalone `WallOfCoolSection.jsx` component using Firestore + IntersectionObserver lazy loading.

**Tech Stack:** React, Firebase Firestore, Firebase Storage, Express, HTML5 Drag and Drop API, IntersectionObserver API.

---

## File Map

| Action | File |
|---|---|
| Modify | `api/wall-of-cool.js` |
| Rewrite | `src/pages/admin/AdminWallOfCool.jsx` |
| Create | `src/components/Trust/WallOfCoolSection.jsx` |

---

## Task 1 — Update API (`api/wall-of-cool.js`)

**Files:**
- Modify: `api/wall-of-cool.js`

**What changes:**
- `POST /` — accept `type` + `imageUrl`/`videoUrl`, remove `userName`/`caption` from user payload
- `POST /admin` — new admin-only endpoint, creates approved image with order
- `PATCH /reorder` — new admin-only batch order update (must be defined BEFORE `PATCH /:id`)
- `PATCH /:id` — extend to accept optional `caption`, `alt`, `order`

- [ ] **Replace the entire contents of `api/wall-of-cool.js` with:**

```javascript
'use strict';

const express = require('express');
const admin = require('./firebase-admin');

const router = express.Router();

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

// POST /api/wall-of-cool — user submission (image or video, no personal info)
router.post('/', async (req, res) => {
  try {
    const { imageUrl, videoUrl, type } = req.body;
    if (!type || !['image', 'video'].includes(type)) {
      return res.status(400).json({ error: 'type must be "image" or "video"' });
    }
    if (type === 'image' && !imageUrl) {
      return res.status(400).json({ error: 'imageUrl required for image submissions' });
    }
    if (type === 'video' && !videoUrl) {
      return res.status(400).json({ error: 'videoUrl required for video submissions' });
    }
    const url = type === 'image' ? imageUrl : videoUrl;
    if (!String(url).startsWith('https://firebasestorage.googleapis.com/')) {
      return res.status(400).json({ error: 'URL must be a Firebase Storage URL' });
    }
    const data = {
      type,
      source: 'user',
      status: 'pending',
      submittedAt: admin.firestore.FieldValue.serverTimestamp(),
    };
    if (type === 'image') data.imageUrl = String(imageUrl).slice(0, 500);
    if (type === 'video') data.videoUrl = String(videoUrl).slice(0, 500);
    const ref = await admin.firestore().collection('wall_of_cool').add(data);
    return res.json({ id: ref.id });
  } catch (err) {
    console.error('Wall of Cool submission error:', err);
    return res.status(500).json({ error: 'Failed to record submission' });
  }
});

// POST /api/wall-of-cool/admin — admin direct image upload, goes straight to approved
router.post('/admin', requireAdmin, async (req, res) => {
  try {
    const { imageUrl, caption, alt } = req.body;
    if (!imageUrl) return res.status(400).json({ error: 'imageUrl required' });
    if (!String(imageUrl).startsWith('https://firebasestorage.googleapis.com/')) {
      return res.status(400).json({ error: 'imageUrl must be a Firebase Storage URL' });
    }
    // Find the current max order value so new image is appended
    const snap = await admin.firestore()
      .collection('wall_of_cool')
      .where('status', '==', 'approved')
      .where('type', '==', 'image')
      .get();
    let maxOrder = -1;
    snap.forEach((d) => {
      const o = d.data().order;
      if (typeof o === 'number' && o > maxOrder) maxOrder = o;
    });
    const ref = await admin.firestore().collection('wall_of_cool').add({
      type: 'image',
      source: 'admin',
      status: 'approved',
      imageUrl: String(imageUrl).slice(0, 500),
      caption: String(caption || '').slice(0, 500),
      alt: String(alt || '').slice(0, 200),
      order: maxOrder + 1,
      submittedAt: admin.firestore.FieldValue.serverTimestamp(),
    });
    return res.json({ id: ref.id });
  } catch (err) {
    console.error('Wall of Cool admin upload error:', err);
    return res.status(500).json({ error: 'Failed to create entry' });
  }
});

// PATCH /api/wall-of-cool/reorder — batch update order fields on approved images
// MUST be defined before /:id so Express doesn't treat "reorder" as an id
router.patch('/reorder', requireAdmin, async (req, res) => {
  try {
    const items = req.body; // [{ id, order }, ...]
    if (!Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ error: 'Body must be a non-empty array of { id, order }' });
    }
    const db = admin.firestore();
    const batch = db.batch();
    for (const item of items) {
      if (!item.id || typeof item.order !== 'number') continue;
      batch.update(db.collection('wall_of_cool').doc(item.id), { order: item.order });
    }
    await batch.commit();
    return res.json({ ok: true });
  } catch (err) {
    console.error('Wall of Cool reorder error:', err);
    return res.status(500).json({ error: 'Failed to reorder' });
  }
});

// PATCH /api/wall-of-cool/:id — approve/reject/reset + optionally set caption, alt, order
router.patch('/:id', requireAdmin, async (req, res) => {
  try {
    const { status, caption, alt, order } = req.body;
    if (!['approved', 'rejected', 'pending'].includes(status)) {
      return res.status(400).json({ error: 'Invalid status' });
    }
    const update = { status };
    if (caption !== undefined) update.caption = String(caption).slice(0, 500);
    if (alt !== undefined) update.alt = String(alt).slice(0, 200);
    if (typeof order === 'number') update.order = order;
    await admin.firestore().collection('wall_of_cool').doc(req.params.id).update(update);
    return res.json({ ok: true });
  } catch (err) {
    console.error('Wall of Cool update error:', err);
    return res.status(500).json({ error: 'Failed to update' });
  }
});

module.exports = router;
```

- [ ] **Verify server still starts**

```bash
node server.js
# Expected: server starts without errors on its usual port
# Ctrl+C to stop
```

- [ ] **Commit**

```bash
git add api/wall-of-cool.js
git commit -m "feat: extend wall-of-cool API with type/source, admin upload, and reorder endpoints"
```

---

## Task 2 — Rewrite Admin Page (`src/pages/admin/AdminWallOfCool.jsx`)

**Files:**
- Rewrite: `src/pages/admin/AdminWallOfCool.jsx`

The component has two top-level sections (Images / Videos) toggled by pill buttons at the top right. Images has three sub-tabs (Pending, Live Wall, Rejected). Videos has two (Pending, Rejected). All data comes from a single `useCollection` call; filtering and sorting happen in JS.

**Key behaviours:**
- `expandedId` tracks which pending card is expanded for the inline approve form
- `wallOrder` is a locally-maintained sorted array for the live wall; it syncs from Firestore unless a drag is in progress
- Drag-and-drop uses the HTML5 DnD API — `draggable`, `onDragStart`, `onDragOver`, `onDrop`
- After picking from MediaLibraryPicker, a full-screen overlay shows the picked image + caption/alt form before submitting

- [ ] **Replace the entire contents of `src/pages/admin/AdminWallOfCool.jsx` with:**

```jsx
import { useState, useEffect } from 'react';
import AdminLayout from '../../components/admin/AdminLayout';
import MediaLibraryPicker from '../../components/admin/MediaLibraryPicker';
import { useCollection } from '../../hooks/useFirestore';
import { auth } from '../../lib/firebase';

// ─── Main component ───────────────────────────────────────────────────────────

export default function AdminWallOfCool() {
  const { docs, loading } = useCollection('wall_of_cool', 'submittedAt');

  // Section + tab state
  const [section, setSection]     = useState('images');   // 'images' | 'videos'
  const [imageTab, setImageTab]   = useState('pending'); // 'pending' | 'live' | 'rejected'
  const [videoTab, setVideoTab]   = useState('pending'); // 'pending' | 'rejected'

  // UI action state
  const [updating, setUpdating]       = useState(null);   // id currently being updated
  const [expandedId, setExpandedId]   = useState(null);   // card expanded for inline approval
  const [expandForm, setExpandForm]   = useState({ caption: '', alt: '' });

  // Admin upload flow (after MediaLibraryPicker pick)
  const [pickerOpen, setPickerOpen]   = useState(false);
  const [pickedImage, setPickedImage] = useState(null);   // { url, alt }
  const [adminForm, setAdminForm]     = useState({ caption: '', alt: '' });

  // Live wall drag-and-drop
  const [wallOrder, setWallOrder] = useState([]);
  const [dragId, setDragId]       = useState(null);

  // Live wall inline edit
  const [editingId, setEditingId] = useState(null);
  const [editForm, setEditForm]   = useState({ caption: '', alt: '' });

  // Sync live wall order from Firestore whenever docs change (but not during a drag)
  useEffect(() => {
    if (dragId) return;
    const sorted = docs
      .filter((d) => (d.type === 'image' || !d.type) && d.status === 'approved')
      .sort((a, b) => (a.order ?? 0) - (b.order ?? 0));
    setWallOrder(sorted);
  }, [docs, dragId]);

  // ── Helpers ─────────────────────────────────────────────────────────────────

  async function authHeaders() {
    const token = await auth.currentUser?.getIdToken();
    return {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    };
  }

  async function patchItem(id, body) {
    setUpdating(id);
    try {
      const h = await authHeaders();
      await fetch(`/api/wall-of-cool/${id}`, {
        method: 'PATCH',
        headers: h,
        body: JSON.stringify(body),
      });
    } finally {
      setUpdating(null);
    }
  }

  function maxApprovedOrder() {
    return docs
      .filter((d) => (d.type === 'image' || !d.type) && d.status === 'approved')
      .reduce((m, d) => Math.max(m, typeof d.order === 'number' ? d.order : 0), -1);
  }

  // ── Approval actions ─────────────────────────────────────────────────────────

  async function approveImage(id) {
    await patchItem(id, {
      status: 'approved',
      caption: expandForm.caption,
      alt: expandForm.alt,
      order: maxApprovedOrder() + 1,
    });
    setExpandedId(null);
    setExpandForm({ caption: '', alt: '' });
  }

  async function approveVideo(id) {
    await patchItem(id, { status: 'approved', caption: expandForm.caption });
    setExpandedId(null);
    setExpandForm({ caption: '', alt: '' });
  }

  // ── Admin upload ─────────────────────────────────────────────────────────────

  async function submitAdminUpload() {
    if (!pickedImage) return;
    setUpdating('admin-upload');
    try {
      const h = await authHeaders();
      await fetch('/api/wall-of-cool/admin', {
        method: 'POST',
        headers: h,
        body: JSON.stringify({
          imageUrl: pickedImage.url,
          caption: adminForm.caption,
          alt: adminForm.alt || pickedImage.alt,
        }),
      });
    } finally {
      setUpdating(null);
      setPickedImage(null);
      setAdminForm({ caption: '', alt: '' });
    }
  }

  // ── Live wall edit ───────────────────────────────────────────────────────────

  async function saveEdit(id) {
    await patchItem(id, {
      status: 'approved',
      caption: editForm.caption,
      alt: editForm.alt,
    });
    setEditingId(null);
  }

  // ── Drag-and-drop ────────────────────────────────────────────────────────────

  function onDragStart(id) { setDragId(id); }
  function onDragOver(e) { e.preventDefault(); }

  async function onDrop(targetId) {
    if (!dragId || dragId === targetId) { setDragId(null); return; }
    const items = [...wallOrder];
    const fromIdx = items.findIndex((d) => d.id === dragId);
    const toIdx   = items.findIndex((d) => d.id === targetId);
    if (fromIdx < 0 || toIdx < 0) { setDragId(null); return; }
    items.splice(toIdx, 0, items.splice(fromIdx, 1)[0]);
    setWallOrder(items);
    setDragId(null);
    // Fire-and-forget reorder API call
    const h = await authHeaders();
    fetch('/api/wall-of-cool/reorder', {
      method: 'PATCH',
      headers: h,
      body: JSON.stringify(items.map((d, i) => ({ id: d.id, order: i }))),
    });
  }

  // ── Derived lists ────────────────────────────────────────────────────────────

  const images = docs.filter((d) => d.type === 'image' || !d.type); // !d.type = legacy docs
  const videos = docs.filter((d) => d.type === 'video');

  const imgPending  = images.filter((d) => d.status === 'pending');
  const imgRejected = images.filter((d) => d.status === 'rejected');
  const vidPending  = videos.filter((d) => d.status === 'pending');
  const vidRejected = videos.filter((d) => d.status === 'rejected');

  const imgCounts = { pending: imgPending.length, live: wallOrder.length, rejected: imgRejected.length };
  const vidCounts = { pending: vidPending.length, rejected: vidRejected.length };

  // ── Render ───────────────────────────────────────────────────────────────────

  return (
    <AdminLayout>
      {/* Page header + section switcher */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.5rem' }}>
        <h1 style={{ fontSize: '1.5rem', fontWeight: 700, color: '#111827', margin: 0 }}>Wall of Cool</h1>
        <div style={{ display: 'flex', gap: 8 }}>
          {['images', 'videos'].map((s) => (
            <button key={s} onClick={() => setSection(s)} style={{
              padding: '0.4rem 1.1rem', border: '1px solid', borderRadius: 6, cursor: 'pointer',
              fontSize: '0.85rem', fontWeight: 600, textTransform: 'capitalize',
              background: section === s ? '#111827' : '#fff',
              color:      section === s ? '#fff'    : '#6b7280',
              borderColor: section === s ? '#111827' : '#d1d5db',
            }}>
              {s}
            </button>
          ))}
        </div>
      </div>

      {/* ── Images section ──────────────────────────────────────────────────── */}
      {section === 'images' && (
        <>
          {/* Sub-tab bar */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '2px solid #e5e7eb', marginBottom: '1.5rem' }}>
            <div style={{ display: 'flex', gap: '0.5rem' }}>
              {[
                { key: 'pending',  label: 'Pending'   },
                { key: 'live',     label: 'Live Wall'  },
                { key: 'rejected', label: 'Rejected'   },
              ].map(({ key, label }) => (
                <button key={key} onClick={() => setImageTab(key)} style={tabStyle(imageTab === key)}>
                  {label} ({imgCounts[key]})
                </button>
              ))}
            </div>
            {imageTab === 'live' && (
              <button onClick={() => setPickerOpen(true)} style={addBtn}>+ Add Image</button>
            )}
          </div>

          {loading ? (
            <p style={muted}>Loading…</p>
          ) : (
            <>
              {imageTab === 'pending'  && (
                <ImagesPendingGrid
                  items={imgPending}
                  expandedId={expandedId}
                  expandForm={expandForm}
                  updating={updating}
                  setExpandedId={setExpandedId}
                  setExpandForm={setExpandForm}
                  onApprove={approveImage}
                  onReject={(id) => patchItem(id, { status: 'rejected' })}
                />
              )}
              {imageTab === 'live' && (
                <LiveWallGrid
                  items={wallOrder}
                  dragId={dragId}
                  editingId={editingId}
                  editForm={editForm}
                  updating={updating}
                  setEditingId={setEditingId}
                  setEditForm={setEditForm}
                  onDragStart={onDragStart}
                  onDragOver={onDragOver}
                  onDrop={onDrop}
                  onRemove={(id) => patchItem(id, { status: 'rejected' })}
                  onSaveEdit={saveEdit}
                />
              )}
              {imageTab === 'rejected' && (
                <RejectedGrid
                  items={imgRejected}
                  updating={updating}
                  mediaType="image"
                  onReset={(id) => patchItem(id, { status: 'pending' })}
                />
              )}
            </>
          )}
        </>
      )}

      {/* ── Videos section ──────────────────────────────────────────────────── */}
      {section === 'videos' && (
        <>
          <div style={{ display: 'flex', gap: '0.5rem', borderBottom: '2px solid #e5e7eb', marginBottom: '1.5rem' }}>
            {[
              { key: 'pending',  label: 'Pending'  },
              { key: 'rejected', label: 'Rejected' },
            ].map(({ key, label }) => (
              <button key={key} onClick={() => setVideoTab(key)} style={tabStyle(videoTab === key)}>
                {label} ({vidCounts[key]})
              </button>
            ))}
          </div>

          {loading ? (
            <p style={muted}>Loading…</p>
          ) : (
            <>
              {videoTab === 'pending'  && (
                <VideosPendingGrid
                  items={vidPending}
                  expandedId={expandedId}
                  expandForm={expandForm}
                  updating={updating}
                  setExpandedId={setExpandedId}
                  setExpandForm={setExpandForm}
                  onApprove={approveVideo}
                  onReject={(id) => patchItem(id, { status: 'rejected' })}
                />
              )}
              {videoTab === 'rejected' && (
                <RejectedGrid
                  items={vidRejected}
                  updating={updating}
                  mediaType="video"
                  onReset={(id) => patchItem(id, { status: 'pending' })}
                />
              )}
            </>
          )}
        </>
      )}

      {/* MediaLibraryPicker */}
      <MediaLibraryPicker
        open={pickerOpen}
        onClose={() => setPickerOpen(false)}
        onPick={(img) => {
          setPickerOpen(false);
          setPickedImage(img);
          setAdminForm({ caption: '', alt: img.alt || '' });
        }}
      />

      {/* Admin upload form overlay (shown after picking an image) */}
      {pickedImage && (
        <AdminUploadOverlay
          pickedImage={pickedImage}
          adminForm={adminForm}
          updating={updating}
          setAdminForm={setAdminForm}
          onSubmit={submitAdminUpload}
          onCancel={() => { setPickedImage(null); setAdminForm({ caption: '', alt: '' }); }}
        />
      )}
    </AdminLayout>
  );
}

// ─── Sub-components ───────────────────────────────────────────────────────────

function formatDate(ts) {
  if (!ts) return '—';
  const d = ts.toDate ? ts.toDate() : new Date(ts);
  return d.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });
}

function SourceBadge({ source }) {
  const isAdmin = source === 'admin';
  return (
    <span style={{
      display: 'inline-block', padding: '0.15rem 0.5rem',
      borderRadius: 4, fontSize: '0.65rem', fontWeight: 700, textTransform: 'uppercase',
      background: isAdmin ? '#dbeafe' : '#f3f4f6',
      color:      isAdmin ? '#1d4ed8' : '#6b7280',
    }}>
      {isAdmin ? 'Admin' : 'User'}
    </span>
  );
}

// ── Images Pending ────────────────────────────────────────────────────────────

function ImagesPendingGrid({ items, expandedId, expandForm, updating, setExpandedId, setExpandForm, onApprove, onReject }) {
  if (items.length === 0) return <p style={muted}>No pending image submissions.</p>;
  return (
    <div style={grid}>
      {items.map((item) => {
        const isExpanded = expandedId === item.id;
        return (
          <div key={item.id} style={card}>
            <img src={item.imageUrl} alt="" style={thumb} />
            <div style={cardBody}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 4 }}>
                <SourceBadge source={item.source} />
                <span style={dateTxt}>{formatDate(item.submittedAt)}</span>
              </div>

              {/* Inline approval form */}
              {isExpanded ? (
                <div style={{ marginTop: 8 }}>
                  <input
                    placeholder="Caption"
                    value={expandForm.caption}
                    onChange={(e) => setExpandForm((f) => ({ ...f, caption: e.target.value }))}
                    style={inputStyle}
                  />
                  <input
                    placeholder="Alt text"
                    value={expandForm.alt}
                    onChange={(e) => setExpandForm((f) => ({ ...f, alt: e.target.value }))}
                    style={{ ...inputStyle, marginTop: 4 }}
                  />
                  <div style={{ display: 'flex', gap: 4, marginTop: 6 }}>
                    <button
                      onClick={() => onApprove(item.id)}
                      disabled={updating === item.id}
                      style={{ ...actionBtn, background: '#d1fae5', color: '#065f46', flex: 1 }}
                    >
                      {updating === item.id ? '…' : 'Confirm Approve'}
                    </button>
                    <button
                      onClick={() => { setExpandedId(null); setExpandForm({ caption: '', alt: '' }); }}
                      style={{ ...actionBtn, background: '#f3f4f6', color: '#374151' }}
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              ) : (
                <div style={{ display: 'flex', gap: 4, marginTop: 8 }}>
                  <button
                    onClick={() => { setExpandedId(item.id); setExpandForm({ caption: '', alt: '' }); }}
                    style={{ ...actionBtn, background: '#d1fae5', color: '#065f46', flex: 1 }}
                  >
                    Approve
                  </button>
                  <button
                    onClick={() => onReject(item.id)}
                    disabled={updating === item.id}
                    style={{ ...actionBtn, background: '#fee2e2', color: '#991b1b', flex: 1 }}
                  >
                    {updating === item.id ? '…' : 'Reject'}
                  </button>
                </div>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}

// ── Live Wall ─────────────────────────────────────────────────────────────────

function LiveWallGrid({ items, dragId, editingId, editForm, updating, setEditingId, setEditForm, onDragStart, onDragOver, onDrop, onRemove, onSaveEdit }) {
  if (items.length === 0) return <p style={muted}>No approved images yet. Add one with the button above.</p>;
  return (
    <div style={grid}>
      {items.map((item) => {
        const isEditing = editingId === item.id;
        const isDragging = dragId === item.id;
        return (
          <div
            key={item.id}
            draggable
            onDragStart={() => onDragStart(item.id)}
            onDragOver={onDragOver}
            onDrop={() => onDrop(item.id)}
            style={{ ...card, opacity: isDragging ? 0.45 : 1, cursor: 'grab' }}
          >
            {/* Drag handle indicator */}
            <div style={{ position: 'absolute', top: 6, left: 6, color: 'rgba(255,255,255,0.8)', fontSize: '0.7rem', userSelect: 'none', pointerEvents: 'none' }}>⠿⠿</div>
            <img src={item.imageUrl} alt={item.alt || ''} style={thumb} />
            <div style={cardBody}>
              {isEditing ? (
                <>
                  <input
                    placeholder="Caption"
                    value={editForm.caption}
                    onChange={(e) => setEditForm((f) => ({ ...f, caption: e.target.value }))}
                    style={inputStyle}
                  />
                  <input
                    placeholder="Alt text"
                    value={editForm.alt}
                    onChange={(e) => setEditForm((f) => ({ ...f, alt: e.target.value }))}
                    style={{ ...inputStyle, marginTop: 4 }}
                  />
                  <div style={{ display: 'flex', gap: 4, marginTop: 6 }}>
                    <button
                      onClick={() => onSaveEdit(item.id)}
                      disabled={updating === item.id}
                      style={{ ...actionBtn, background: '#111827', color: '#fff', flex: 1 }}
                    >
                      {updating === item.id ? '…' : 'Save'}
                    </button>
                    <button
                      onClick={() => setEditingId(null)}
                      style={{ ...actionBtn, background: '#f3f4f6', color: '#374151' }}
                    >
                      Cancel
                    </button>
                  </div>
                </>
              ) : (
                <>
                  {item.caption && <p style={{ fontSize: '0.78rem', color: '#374151', margin: '0 0 6px', lineHeight: 1.3 }}>{item.caption}</p>}
                  <div style={{ display: 'flex', gap: 4 }}>
                    <button
                      onClick={() => { setEditingId(item.id); setEditForm({ caption: item.caption || '', alt: item.alt || '' }); }}
                      style={{ ...actionBtn, background: '#f3f4f6', color: '#374151', flex: 1 }}
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => onRemove(item.id)}
                      disabled={updating === item.id}
                      style={{ ...actionBtn, background: '#fee2e2', color: '#991b1b', flex: 1 }}
                    >
                      {updating === item.id ? '…' : 'Remove'}
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}

// ── Rejected ──────────────────────────────────────────────────────────────────

function RejectedGrid({ items, updating, mediaType, onReset }) {
  if (items.length === 0) return <p style={muted}>No rejected {mediaType}s.</p>;
  return (
    <div style={grid}>
      {items.map((item) => (
        <div key={item.id} style={card}>
          {mediaType === 'image' ? (
            <img src={item.imageUrl} alt="" style={thumb} />
          ) : (
            <video src={item.videoUrl} style={thumb} muted />
          )}
          <div style={cardBody}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 }}>
              <SourceBadge source={item.source} />
              <span style={dateTxt}>{formatDate(item.submittedAt)}</span>
            </div>
            <button
              onClick={() => onReset(item.id)}
              disabled={updating === item.id}
              style={{ ...actionBtn, background: '#f3f4f6', color: '#374151', width: '100%' }}
            >
              {updating === item.id ? '…' : 'Reset to Pending'}
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}

// ── Videos Pending ────────────────────────────────────────────────────────────

function VideosPendingGrid({ items, expandedId, expandForm, updating, setExpandedId, setExpandForm, onApprove, onReject }) {
  if (items.length === 0) return <p style={muted}>No pending video submissions.</p>;
  return (
    <div style={grid}>
      {items.map((item) => {
        const isExpanded = expandedId === item.id;
        return (
          <div key={item.id} style={card}>
            <video src={item.videoUrl} style={thumb} controls muted />
            <div style={cardBody}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 4 }}>
                <SourceBadge source={item.source} />
                <span style={dateTxt}>{formatDate(item.submittedAt)}</span>
              </div>
              {isExpanded ? (
                <div style={{ marginTop: 8 }}>
                  <input
                    placeholder="Caption (optional)"
                    value={expandForm.caption}
                    onChange={(e) => setExpandForm((f) => ({ ...f, caption: e.target.value }))}
                    style={inputStyle}
                  />
                  <div style={{ display: 'flex', gap: 4, marginTop: 6 }}>
                    <button
                      onClick={() => onApprove(item.id)}
                      disabled={updating === item.id}
                      style={{ ...actionBtn, background: '#d1fae5', color: '#065f46', flex: 1 }}
                    >
                      {updating === item.id ? '…' : 'Confirm Approve'}
                    </button>
                    <button
                      onClick={() => { setExpandedId(null); setExpandForm({ caption: '', alt: '' }); }}
                      style={{ ...actionBtn, background: '#f3f4f6', color: '#374151' }}
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              ) : (
                <div style={{ display: 'flex', gap: 4, marginTop: 8 }}>
                  <button
                    onClick={() => { setExpandedId(item.id); setExpandForm({ caption: '', alt: '' }); }}
                    style={{ ...actionBtn, background: '#d1fae5', color: '#065f46', flex: 1 }}
                  >
                    Approve
                  </button>
                  <button
                    onClick={() => onReject(item.id)}
                    disabled={updating === item.id}
                    style={{ ...actionBtn, background: '#fee2e2', color: '#991b1b', flex: 1 }}
                  >
                    {updating === item.id ? '…' : 'Reject'}
                  </button>
                </div>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}

// ── Admin Upload Overlay ──────────────────────────────────────────────────────

function AdminUploadOverlay({ pickedImage, adminForm, updating, setAdminForm, onSubmit, onCancel }) {
  return (
    <div style={{ position: 'fixed', inset: 0, zIndex: 100002, background: 'rgba(0,0,0,0.65)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24 }}>
      <div style={{ background: '#fff', borderRadius: 12, padding: 24, maxWidth: 480, width: '100%', boxShadow: '0 24px 80px rgba(0,0,0,0.3)' }}>
        <h2 style={{ fontSize: '1rem', fontWeight: 700, color: '#111827', marginBottom: 16 }}>Add to Wall of Cool</h2>
        <img src={pickedImage.url} alt="" style={{ width: '100%', height: 200, objectFit: 'cover', borderRadius: 8, marginBottom: 12, display: 'block' }} />
        <input
          placeholder="Caption"
          value={adminForm.caption}
          onChange={(e) => setAdminForm((f) => ({ ...f, caption: e.target.value }))}
          style={{ ...inputStyle, marginBottom: 8 }}
        />
        <input
          placeholder="Alt text"
          value={adminForm.alt}
          onChange={(e) => setAdminForm((f) => ({ ...f, alt: e.target.value }))}
          style={inputStyle}
        />
        <div style={{ display: 'flex', gap: 8, marginTop: 16 }}>
          <button
            onClick={onSubmit}
            disabled={updating === 'admin-upload'}
            style={{ ...actionBtn, background: '#111827', color: '#fff', flex: 1, padding: '0.6rem' }}
          >
            {updating === 'admin-upload' ? 'Adding…' : 'Add to Wall'}
          </button>
          <button onClick={onCancel} style={{ ...actionBtn, background: '#f3f4f6', color: '#374151', padding: '0.6rem 1rem' }}>
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Shared styles ────────────────────────────────────────────────────────────

const muted = { color: '#6b7280', fontSize: '0.875rem' };

const grid = {
  display: 'grid',
  gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))',
  gap: '1rem',
};

const card = {
  background: '#fff',
  border: '1px solid #e5e7eb',
  borderRadius: 8,
  overflow: 'hidden',
  position: 'relative',
};

const thumb = {
  width: '100%',
  height: 160,
  objectFit: 'cover',
  display: 'block',
  background: '#f1f5f9',
};

const cardBody = {
  padding: '0.75rem',
};

const dateTxt = {
  fontSize: '0.72rem',
  color: '#9ca3af',
};

const actionBtn = {
  padding: '0.4rem 0.6rem',
  border: 'none',
  borderRadius: 5,
  cursor: 'pointer',
  fontWeight: 600,
  fontSize: '0.78rem',
  fontFamily: 'inherit',
};

const inputStyle = {
  width: '100%',
  padding: '0.4rem 0.6rem',
  border: '1px solid #d1d5db',
  borderRadius: 5,
  fontSize: '0.8rem',
  outline: 'none',
  boxSizing: 'border-box',
  fontFamily: 'inherit',
};

const addBtn = {
  padding: '0.35rem 0.9rem',
  background: '#111827',
  color: '#fff',
  border: 'none',
  borderRadius: 6,
  cursor: 'pointer',
  fontSize: '0.8rem',
  fontWeight: 700,
  fontFamily: 'inherit',
  marginBottom: 2,
};

function tabStyle(active) {
  return {
    padding: '0.5rem 1.25rem',
    border: 'none',
    background: 'none',
    cursor: 'pointer',
    fontSize: '0.875rem',
    fontWeight: 600,
    color: active ? '#111827' : '#6b7280',
    borderBottom: active ? '2px solid #111827' : '2px solid transparent',
    marginBottom: '-2px',
    fontFamily: 'inherit',
  };
}
```

- [ ] **Open the app in a browser, navigate to `/admin/wall-of-cool`, verify:**
  - Images / Videos section switcher renders
  - Images: Pending / Live Wall / Rejected sub-tabs render with counts
  - Videos: Pending / Rejected sub-tabs render with counts
  - Existing approved images appear in Live Wall tab
  - Existing pending items appear in Pending tab

- [ ] **Test inline approval on a pending image:**
  - Click "Approve" — card should expand with Caption + Alt text inputs
  - Fill in caption and alt text
  - Click "Confirm Approve" — item should move from Pending to Live Wall

- [ ] **Test reject + reset:**
  - Click "Reject" on a pending item — item should appear in Rejected tab
  - Click "Reset to Pending" in Rejected tab — item should return to Pending

- [ ] **Test admin upload flow:**
  - Switch to Live Wall tab, click "+ Add Image"
  - Pick an image from the media library
  - Overlay appears with thumbnail + caption/alt form
  - Fill in details, click "Add to Wall" — image should appear in Live Wall

- [ ] **Test drag-to-reorder:**
  - In Live Wall tab, drag a card to a new position — order should update immediately
  - Refresh the page — new order should persist (stored in Firestore)

- [ ] **Commit**

```bash
git add src/pages/admin/AdminWallOfCool.jsx
git commit -m "feat: rewrite AdminWallOfCool with image/video sections, inline approval, drag-to-reorder, admin upload"
```

---

## Task 3 — Public Wall of Cool Section (`src/components/Trust/WallOfCoolSection.jsx`)

**Files:**
- Create: `src/components/Trust/WallOfCoolSection.jsx`

This component fetches approved images from Firestore ordered by `order` asc and renders them in a masonry-style grid with IntersectionObserver lazy loading. Images start as a grey placeholder and swap to the real URL when they scroll into view.

**Note:** After creating this component, find the wall-of-cool section in `src/pages/Experimentation.jsx` (the `/` homepage) and replace its static content with `<WallOfCoolSection />`.

- [ ] **Create `src/components/Trust/WallOfCoolSection.jsx`:**

```jsx
/**
 * WallOfCoolSection — public-facing wall of approved community images.
 *
 * Reads from Firestore `wall_of_cool` (status=approved, type=image),
 * ordered by the `order` field set by admins.
 *
 * Images are lazy-loaded via IntersectionObserver — each img starts with
 * a grey placeholder and swaps to its real src when it enters the viewport.
 */

import { useEffect, useRef, useState } from 'react';
import { collection, query, where, orderBy, getDocs } from 'firebase/firestore';
import { db } from '../../lib/firebase';

export default function WallOfCoolSection() {
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(true);
  const observerRef = useRef(null);

  useEffect(() => {
    async function fetchApproved() {
      try {
        const q = query(
          collection(db, 'wall_of_cool'),
          where('status', '==', 'approved'),
          where('type', '==', 'image'),
          orderBy('order', 'asc'),
        );
        const snap = await getDocs(q);
        setImages(snap.docs.map((d) => ({ id: d.id, ...d.data() })));
      } catch (err) {
        console.error('WallOfCoolSection fetch error:', err);
      } finally {
        setLoading(false);
      }
    }
    fetchApproved();
  }, []);

  // Set up IntersectionObserver after images load
  useEffect(() => {
    if (loading || images.length === 0) return;

    observerRef.current = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const img = entry.target;
            const src = img.dataset.src;
            if (src) {
              img.src = src;
              img.removeAttribute('data-src');
              observerRef.current.unobserve(img);
            }
          }
        });
      },
      { rootMargin: '200px 0px' }, // start loading 200px before entering viewport
    );

    document.querySelectorAll('.woc-lazy-img').forEach((img) => {
      observerRef.current.observe(img);
    });

    return () => observerRef.current?.disconnect();
  }, [loading, images]);

  if (loading) return null; // section is invisible while loading — no layout shift
  if (images.length === 0) return null; // nothing to show, hide section entirely

  return (
    <section style={{ padding: '4rem 1.5rem', background: '#f9fafb' }}>
      <div style={{ maxWidth: 1400, margin: '0 auto' }}>
        {/* Section header */}
        <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
          <p style={{ fontSize: '0.75rem', fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', color: '#6b7280', marginBottom: 8 }}>
            Community
          </p>
          <h2 style={{ fontSize: 'clamp(1.75rem, 4vw, 2.5rem)', fontWeight: 800, color: '#111827', margin: 0, letterSpacing: '-0.02em' }}>
            Wall of Cool
          </h2>
        </div>

        {/* Image grid */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))',
          gap: '0.5rem',
        }}>
          {images.map((img) => (
            <div
              key={img.id}
              style={{
                aspectRatio: '1',
                background: '#e5e7eb',
                borderRadius: 4,
                overflow: 'hidden',
              }}
            >
              {/* Placeholder shown until IntersectionObserver fires */}
              <img
                className="woc-lazy-img"
                data-src={img.imageUrl}
                src="data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7"
                alt={img.alt || 'Wall of Cool'}
                style={{
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover',
                  display: 'block',
                  transition: 'opacity 0.3s',
                }}
                onLoad={(e) => {
                  // Fade in once the real image has loaded
                  if (e.target.src !== e.target.dataset?.src) {
                    e.target.style.opacity = 1;
                  }
                }}
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
```

- [ ] **Wire up the Firestore composite index** — Firestore requires a composite index for `where + orderBy` on different fields. Add this to `firestore.indexes.json` (create if it doesn't exist):

```json
{
  "indexes": [
    {
      "collectionGroup": "wall_of_cool",
      "queryScope": "COLLECTION",
      "fields": [
        { "fieldPath": "status",  "order": "ASCENDING" },
        { "fieldPath": "type",    "order": "ASCENDING" },
        { "fieldPath": "order",   "order": "ASCENDING" }
      ]
    }
  ],
  "fieldOverrides": []
}
```

Deploy the index:
```bash
firebase deploy --only firestore:indexes
```

- [ ] **Import and place `WallOfCoolSection` in the homepage**

Open `src/pages/Experimentation.jsx`. Find the existing wall-of-cool / community photos section (search the file for "cool" or "community" or "submit"). Replace the static placeholder content with:

```jsx
import WallOfCoolSection from '../components/Trust/WallOfCoolSection';

// Inside the JSX where the section lives:
<WallOfCoolSection />
```

If no section exists yet, add `<WallOfCoolSection />` at the appropriate point in the page's JSX (typically after testimonials or before the contact section).

- [ ] **Verify in browser:**
  - Navigate to `/` (homepage)
  - Wall of Cool section renders with approved images
  - Open DevTools → Network tab → reload — confirm images load progressively as you scroll (not all at once)
  - Section is invisible if no approved images exist

- [ ] **Commit**

```bash
git add src/components/Trust/WallOfCoolSection.jsx firestore.indexes.json
git commit -m "feat: WallOfCoolSection with Firestore data and IntersectionObserver lazy loading"
```

---

## Self-Review

**Spec coverage check:**
- [x] User image submissions (type + imageUrl, no personal info) — Task 1 POST `/`
- [x] User video submissions (type + videoUrl) — Task 1 POST `/`
- [x] Admin direct uploads via MediaLibraryPicker — Task 2 AdminUploadOverlay + Task 1 POST `/admin`
- [x] Inline approval with caption/alt — Task 2 ImagesPendingGrid expand form
- [x] Drag-to-reorder live wall — Task 2 LiveWallGrid + Task 1 PATCH `/reorder`
- [x] Videos: own tab with Pending/Rejected sub-tabs — Task 2 VideosPendingGrid + RejectedGrid
- [x] Backwards compat for existing docs without `type` — `d.type === 'image' || !d.type` filter
- [x] Public wall with lazy loading — Task 3 WallOfCoolSection

**Placeholder scan:** None found.

**Type consistency:**
- `patchItem(id, body)` used consistently throughout Task 2
- `wallOrder` state array matches the shape of docs from `useCollection` (same `{ id, ...data }` shape)
- `expandForm` shape `{ caption, alt }` matches all usages in ImagesPendingGrid and VideosPendingGrid
- `adminForm` shape `{ caption, alt }` matches AdminUploadOverlay props and `submitAdminUpload` body
- API endpoint `/api/wall-of-cool/reorder` matches `PATCH /reorder` defined in Task 1 (before `/:id`)

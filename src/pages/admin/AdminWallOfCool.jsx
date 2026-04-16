import { useState, useEffect } from 'react';
import AdminLayout from '../../components/admin/AdminLayout';
import MediaLibraryPicker from '../../components/admin/MediaLibraryPicker';
import { collection, onSnapshot } from 'firebase/firestore';
import { db, auth } from '../../lib/firebase';

// ─── Main component ───────────────────────────────────────────────────────────

export default function AdminWallOfCool() {
  const [docs, setDocs]       = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch all wall_of_cool docs without orderBy — orderBy('submittedAt') would
  // silently exclude documents that were created without that field.
  useEffect(() => {
    const unsub = onSnapshot(
      collection(db, 'wall_of_cool'),
      (snap) => {
        setDocs(snap.docs.map((d) => ({ id: d.id, ...d.data() })));
        setLoading(false);
      },
      (err) => {
        console.error('wall_of_cool snapshot error:', err);
        setLoading(false);
      },
    );
    return unsub;
  }, []);

  // Section + tab state
  const [section, setSection]     = useState('images');   // 'images' | 'videos'
  const [imageTab, setImageTab]   = useState('live'); // 'pending' | 'live' | 'rejected'
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
  const [dragOverId, setDragOverId] = useState(null);

  // Admin upload error
  const [uploadError, setUploadError] = useState(null);

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
      const res = await fetch(`/api/wall-of-cool/${id}`, {
        method: 'PATCH',
        headers: h,
        body: JSON.stringify(body),
      });
      if (!res.ok) {
        const msg = await res.json().catch(() => ({ error: 'Request failed' }));
        alert(msg.error || 'Action failed — please try again');
      }
    } catch {
      alert('Network error — please try again');
    } finally {
      setUpdating(null);
    }
  }

  function maxApprovedOrder() {
    return wallOrder.reduce((m, d) => Math.max(m, typeof d.order === 'number' ? d.order : 0), -1);
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
    setUploadError(null);
    try {
      const h = await authHeaders();
      const res = await fetch('/api/wall-of-cool/admin', {
        method: 'POST',
        headers: h,
        body: JSON.stringify({
          imageUrl: pickedImage.url,
          caption: adminForm.caption,
          alt: adminForm.alt || pickedImage.alt,
        }),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => null);
        throw new Error(data?.error || 'Upload failed — please try again');
      }
      setPickedImage(null);
      setAdminForm({ caption: '', alt: '' });
    } catch (err) {
      setUploadError(err.message);
    } finally {
      setUpdating(null);
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

  function onDragStart(id) { setDragId(id); setDragOverId(null); }
  function onDragEnd()    { setDragId(null); setDragOverId(null); }
  function onDragOver(e)  { e.preventDefault(); }
  function onDragEnter(id) { if (id !== dragId) setDragOverId(id); }
  function onDragLeave(e, id) {
    // Only clear if leaving the card entirely (not entering a child)
    if (!e.currentTarget.contains(e.relatedTarget)) setDragOverId((prev) => prev === id ? null : prev);
  }

  async function persistOrder(items) {
    const h = await authHeaders();
    fetch('/api/wall-of-cool/reorder', {
      method: 'PATCH',
      headers: h,
      body: JSON.stringify(items.map((d, i) => ({ id: d.id, order: i }))),
    });
  }

  async function onDrop(targetId) {
    setDragOverId(null);
    if (!dragId || dragId === targetId) { setDragId(null); return; }
    const items = [...wallOrder];
    const fromIdx = items.findIndex((d) => d.id === dragId);
    const toIdx   = items.findIndex((d) => d.id === targetId);
    if (fromIdx < 0 || toIdx < 0) { setDragId(null); return; }
    items.splice(toIdx, 0, items.splice(fromIdx, 1)[0]);
    setWallOrder(items);
    setDragId(null);
    persistOrder(items);
  }

  function onMove(idx, delta) {
    const toIdx = idx + delta;
    if (toIdx < 0 || toIdx >= wallOrder.length) return;
    const items = [...wallOrder];
    [items[idx], items[toIdx]] = [items[toIdx], items[idx]];
    setWallOrder(items);
    persistOrder(items);
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
            <button key={s} onClick={() => { setSection(s); setExpandedId(null); setExpandForm({ caption: '', alt: '' }); }} style={{
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
                <button key={key} onClick={() => { setImageTab(key); setExpandedId(null); setExpandForm({ caption: '', alt: '' }); }} style={tabStyle(imageTab === key)}>
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
                  dragOverId={dragOverId}
                  editingId={editingId}
                  editForm={editForm}
                  updating={updating}
                  setEditingId={setEditingId}
                  setEditForm={setEditForm}
                  onDragStart={onDragStart}
                  onDragEnd={onDragEnd}
                  onDragOver={onDragOver}
                  onDragEnter={onDragEnter}
                  onDragLeave={onDragLeave}
                  onDrop={onDrop}
                  onMove={onMove}
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
              <button key={key} onClick={() => { setVideoTab(key); setExpandedId(null); setExpandForm({ caption: '', alt: '' }); }} style={tabStyle(videoTab === key)}>
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
          uploadError={uploadError}
          setAdminForm={setAdminForm}
          onSubmit={submitAdminUpload}
          onCancel={() => { setPickedImage(null); setAdminForm({ caption: '', alt: '' }); setUploadError(null); }}
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

function LiveWallGrid({ items, dragId, dragOverId, editingId, editForm, updating, setEditingId, setEditForm, onDragStart, onDragEnd, onDragOver, onDragEnter, onDragLeave, onDrop, onMove, onRemove, onSaveEdit }) {
  if (items.length === 0) return <p style={muted}>No approved images yet. Add one with the button above.</p>;
  return (
    <div style={grid} onDragOver={onDragOver}>
      {items.map((item, idx) => {
        const isEditing  = editingId === item.id;
        const isDragging = dragId === item.id;
        const isOver     = dragOverId === item.id && !isDragging;
        return (
          <div
            key={item.id}
            draggable
            onDragStart={() => onDragStart(item.id)}
            onDragEnd={onDragEnd}
            onDragOver={onDragOver}
            onDragEnter={() => onDragEnter(item.id)}
            onDragLeave={(e) => onDragLeave(e, item.id)}
            onDrop={() => onDrop(item.id)}
            style={{
              ...card,
              opacity: isDragging ? 0.35 : 1,
              cursor: isDragging ? 'grabbing' : 'grab',
              transform: isOver ? 'scale(1.03)' : 'scale(1)',
              transition: 'transform 0.15s, box-shadow 0.15s, opacity 0.15s',
              boxShadow: isOver ? '0 0 0 3px #111827, 0 8px 24px rgba(0,0,0,0.18)' : 'none',
              outline: 'none',
            }}
          >
            {/* Position badge */}
            <div style={{ position: 'absolute', top: 6, left: 6, background: 'rgba(0,0,0,0.55)', color: '#fff', fontSize: '0.6rem', fontWeight: 700, padding: '1px 5px', borderRadius: 3, userSelect: 'none', pointerEvents: 'none' }}>
              {idx + 1}
            </div>
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
                  {/* Move buttons */}
                  <div style={{ display: 'flex', gap: 4, marginBottom: 4 }}>
                    <button
                      onClick={() => onMove(idx, -1)}
                      disabled={idx === 0}
                      style={{ ...actionBtn, background: '#f3f4f6', color: '#374151', flex: 1, opacity: idx === 0 ? 0.3 : 1 }}
                    >
                      ←
                    </button>
                    <button
                      onClick={() => onMove(idx, 1)}
                      disabled={idx === items.length - 1}
                      style={{ ...actionBtn, background: '#f3f4f6', color: '#374151', flex: 1, opacity: idx === items.length - 1 ? 0.3 : 1 }}
                    >
                      →
                    </button>
                  </div>
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

function AdminUploadOverlay({ pickedImage, adminForm, updating, uploadError, setAdminForm, onSubmit, onCancel }) {
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
        {uploadError && (
          <p style={{ color: '#991b1b', fontSize: '0.8rem', marginTop: 8, marginBottom: 0 }}>{uploadError}</p>
        )}
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

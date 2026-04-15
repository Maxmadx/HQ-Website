import { useState } from 'react';
import { doc, updateDoc, addDoc, collection, deleteDoc } from 'firebase/firestore';
import AdminLayout from '../../components/admin/AdminLayout';
import { useCollection } from '../../hooks/useFirestore';
import { db } from '../../lib/firebase';

const EMPTY_FORM = { author: '', role: '', rating: 5, text: '', date: '', visible: true, displayOrder: '' };

export default function AdminReviews() {
  const { docs: reviews, loading } = useCollection('reviews', 'displayOrder');
  const [saving, setSaving] = useState(null);
  const [orderEdits, setOrderEdits] = useState({});
  const [adding, setAdding] = useState(false);
  const [form, setForm] = useState(EMPTY_FORM);
  const [creating, setCreating] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [editForm, setEditForm] = useState({});

  // ── Create ──────────────────────────────────────────────────────────────────
  async function handleCreate(e) {
    e.preventDefault();
    setCreating(true);
    try {
      await addDoc(collection(db, 'reviews'), {
        author: form.author.trim(),
        role: form.role.trim(),
        rating: Number(form.rating),
        text: form.text.trim(),
        date: form.date.trim(),
        visible: form.visible,
        displayOrder: form.displayOrder !== '' ? Number(form.displayOrder) : reviews.length + 1,
        avatarUrl: '',
      });
      setForm(EMPTY_FORM);
      setAdding(false);
    } finally {
      setCreating(false);
    }
  }

  // ── Update ───────────────────────────────────────────────────────────────────
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

  function startEdit(review) {
    setEditingId(review.id);
    setEditForm({
      author: review.author ?? '',
      role: review.role ?? '',
      rating: review.rating ?? 5,
      text: review.text ?? '',
      date: review.date ?? '',
    });
  }

  async function handleUpdate(e) {
    e.preventDefault();
    setSaving(editingId);
    try {
      await updateDoc(doc(db, 'reviews', editingId), {
        author: editForm.author.trim(),
        role: editForm.role.trim(),
        rating: Number(editForm.rating),
        text: editForm.text.trim(),
        date: editForm.date.trim(),
      });
      setEditingId(null);
      setEditForm({});
    } finally {
      setSaving(null);
    }
  }

  async function handleDelete(id) {
    if (!window.confirm('Delete this review?')) return;
    setSaving(id);
    try {
      await deleteDoc(doc(db, 'reviews', id));
    } finally {
      setSaving(null);
    }
  }

  // ── Helpers ──────────────────────────────────────────────────────────────────
  function stars(n) {
    const r = Math.min(5, Math.max(0, n));
    return '★'.repeat(r) + '☆'.repeat(5 - r);
  }

  const sorted = [...reviews].sort((a, b) => (a.displayOrder ?? 999) - (b.displayOrder ?? 999));

  const field = {
    width: '100%', padding: '0.5rem 0.75rem', border: '1px solid #d1d5db',
    borderRadius: '6px', fontSize: '0.875rem', boxSizing: 'border-box', color: '#111827',
  };
  const label = {
    display: 'block', fontSize: '0.75rem', fontWeight: 600, color: '#374151',
    marginBottom: '0.25rem', textTransform: 'uppercase', letterSpacing: '0.05em',
  };

  return (
    <AdminLayout>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
        <div>
          <h1 style={{ fontSize: '1.5rem', fontWeight: 700, color: '#111827', margin: 0 }}>Reviews</h1>
          <p style={{ color: '#6b7280', fontSize: '0.875rem', marginTop: '0.25rem' }}>
            Toggle visibility and set display order. Lower numbers appear first.
          </p>
        </div>
        <button
          onClick={() => setAdding((a) => !a)}
          style={{ background: '#111827', color: '#fff', padding: '0.5rem 1.25rem', border: 'none', borderRadius: '6px', fontSize: '0.875rem', fontWeight: 600, cursor: 'pointer' }}
        >
          {adding ? 'Cancel' : '+ Add Review'}
        </button>
      </div>

      {/* Add form */}
      {adding && (
        <form onSubmit={handleCreate} style={{ background: '#f9fafb', border: '1px solid #e5e7eb', borderRadius: '10px', padding: '1.25rem', marginBottom: '1.75rem' }}>
          <h2 style={{ fontSize: '0.9rem', fontWeight: 700, color: '#111827', margin: '0 0 1rem' }}>New Review</h2>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.875rem', marginBottom: '0.875rem' }}>
            <div>
              <label style={label}>Customer name</label>
              <input
                style={field}
                value={form.author}
                onChange={(e) => setForm((f) => ({ ...f, author: e.target.value }))}
                placeholder="Jane Smith"
                required
              />
            </div>
            <div>
              <label style={label}>Date</label>
              <input
                style={field}
                value={form.date}
                onChange={(e) => setForm((f) => ({ ...f, date: e.target.value }))}
                placeholder="March 2025"
              />
            </div>
          </div>

          <div style={{ marginBottom: '0.875rem' }}>
            <label style={label}>Role / subtitle</label>
            <input
              style={field}
              value={form.role}
              onChange={(e) => setForm((f) => ({ ...f, role: e.target.value }))}
              placeholder="Helicopter Owner · R44 Raven II"
            />
          </div>

          <div style={{ marginBottom: '0.875rem' }}>
            <label style={label}>Review text</label>
            <textarea
              style={{ ...field, minHeight: '100px', resize: 'vertical', lineHeight: 1.6 }}
              value={form.text}
              onChange={(e) => setForm((f) => ({ ...f, text: e.target.value }))}
              placeholder="Paste the full review here…"
              required
            />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '0.875rem', marginBottom: '1rem' }}>
            <div>
              <label style={label}>Rating</label>
              <select
                style={field}
                value={form.rating}
                onChange={(e) => setForm((f) => ({ ...f, rating: Number(e.target.value) }))}
              >
                {[5, 4, 3, 2, 1].map((n) => (
                  <option key={n} value={n}>{stars(n)} ({n})</option>
                ))}
              </select>
            </div>
            <div>
              <label style={label}>Display order</label>
              <input
                style={field}
                type="number"
                value={form.displayOrder}
                onChange={(e) => setForm((f) => ({ ...f, displayOrder: e.target.value }))}
                placeholder={String(reviews.length + 1)}
              />
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'flex-end' }}>
              <label style={{ ...label, marginBottom: '0.5rem' }}>Visible on site</label>
              <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer' }}>
                <input
                  type="checkbox"
                  checked={form.visible}
                  onChange={(e) => setForm((f) => ({ ...f, visible: e.target.checked }))}
                  style={{ width: '16px', height: '16px' }}
                />
                <span style={{ fontSize: '0.875rem', color: '#374151' }}>Show this review</span>
              </label>
            </div>
          </div>

          <button
            type="submit"
            disabled={creating}
            style={{ background: '#111827', color: '#fff', padding: '0.625rem 1.5rem', border: 'none', borderRadius: '6px', fontWeight: 600, fontSize: '0.875rem', cursor: 'pointer', opacity: creating ? 0.6 : 1 }}
          >
            {creating ? 'Saving…' : 'Add Review'}
          </button>
        </form>
      )}

      {/* Review list */}
      {loading ? (
        <p style={{ color: '#6b7280' }}>Loading…</p>
      ) : sorted.length === 0 ? (
        <p style={{ color: '#6b7280' }}>No reviews yet — add one above.</p>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
          {sorted.map((review) => (
            <div key={review.id} style={{ border: '1px solid #e5e7eb', borderRadius: '8px', overflow: 'hidden', opacity: review.visible ? 1 : 0.45 }}>
            <div
              style={{
                background: '#fff',
                padding: '1rem', display: 'flex', gap: '1rem', alignItems: 'flex-start',
              }}
            >
              {/* Avatar */}
              <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: '#e5e7eb', flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, color: '#6b7280', fontSize: '1rem' }}>
                {(review.author || '?')[0].toUpperCase()}
              </div>

              {/* Content */}
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.25rem', flexWrap: 'wrap' }}>
                  <span style={{ fontWeight: 600, color: '#111827', fontSize: '0.875rem' }}>{review.author}</span>
                  <span style={{ color: '#f59e0b', fontSize: '0.875rem' }}>{stars(review.rating)}</span>
                  {review.date && <span style={{ color: '#9ca3af', fontSize: '0.75rem' }}>{review.date}</span>}
                </div>
                {review.role && <span style={{ color: '#6b7280', fontSize: '0.75rem' }}>{review.role}</span>}
                <p style={{ color: '#374151', fontSize: '0.875rem', lineHeight: 1.55, margin: 0 }}>
                  {review.text}
                </p>
              </div>

              {/* Controls */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', alignItems: 'flex-end', flexShrink: 0 }}>
                <button
                  onClick={() => toggleVisible(review)}
                  disabled={saving === review.id}
                  style={{ padding: '0.35rem 0.75rem', border: 'none', borderRadius: '5px', cursor: 'pointer', fontSize: '0.8rem', fontWeight: 600, background: review.visible ? '#d1fae5' : '#f3f4f6', color: review.visible ? '#065f46' : '#374151' }}
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

                <button
                  onClick={() => editingId === review.id ? setEditingId(null) : startEdit(review)}
                  style={{ background: 'none', border: '1px solid #d1d5db', borderRadius: '4px', color: '#374151', cursor: 'pointer', fontSize: '0.75rem', fontWeight: 500, padding: '0.2rem 0.6rem' }}
                >
                  {editingId === review.id ? 'Cancel' : 'Edit'}
                </button>

                <button
                  onClick={() => handleDelete(review.id)}
                  disabled={saving === review.id}
                  style={{ background: 'none', border: 'none', color: '#dc2626', cursor: 'pointer', fontSize: '0.75rem', fontWeight: 500, padding: 0 }}
                >
                  Delete
                </button>
              </div>
            </div>

            {/* Inline edit form */}
            {editingId === review.id && (
              <form onSubmit={handleUpdate} style={{ borderTop: '1px solid #e5e7eb', padding: '1rem', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
                  <div>
                    <label style={label}>Name</label>
                    <input style={field} value={editForm.author} onChange={(e) => setEditForm((f) => ({ ...f, author: e.target.value }))} required />
                  </div>
                  <div>
                    <label style={label}>Date</label>
                    <input style={field} value={editForm.date} onChange={(e) => setEditForm((f) => ({ ...f, date: e.target.value }))} placeholder="March 2025" />
                  </div>
                </div>
                <div>
                  <label style={label}>Role / subtitle</label>
                  <input style={field} value={editForm.role} onChange={(e) => setEditForm((f) => ({ ...f, role: e.target.value }))} placeholder="Helicopter Owner · R44 Raven II" />
                </div>
                <div>
                  <label style={label}>Review text</label>
                  <textarea style={{ ...field, minHeight: '90px', resize: 'vertical', lineHeight: 1.6 }} value={editForm.text} onChange={(e) => setEditForm((f) => ({ ...f, text: e.target.value }))} required />
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                  <div>
                    <label style={label}>Rating</label>
                    <select style={{ ...field, width: 'auto' }} value={editForm.rating} onChange={(e) => setEditForm((f) => ({ ...f, rating: Number(e.target.value) }))}>
                      {[5, 4, 3, 2, 1].map((n) => <option key={n} value={n}>{stars(n)} ({n})</option>)}
                    </select>
                  </div>
                  <button type="submit" disabled={saving === review.id} style={{ marginTop: '1.1rem', background: '#111827', color: '#fff', padding: '0.5rem 1.25rem', border: 'none', borderRadius: '6px', fontWeight: 600, fontSize: '0.875rem', cursor: 'pointer', opacity: saving === review.id ? 0.6 : 1 }}>
                    {saving === review.id ? 'Saving…' : 'Save changes'}
                  </button>
                </div>
              </form>
            )}
            </div>
          ))}
        </div>
      )}
    </AdminLayout>
  );
}

import { useState } from 'react';
import { getAuth } from 'firebase/auth';
import AdminLayout from '../../components/admin/AdminLayout';
import { useWhereWhen } from '../../hooks/useWhereWhen';

async function adminFetch(path, method = 'GET', body) {
  const token = await getAuth().currentUser?.getIdToken();
  const res = await fetch(path, {
    method,
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
    body: body !== undefined ? JSON.stringify(body) : undefined,
  });
  if (!res.ok) {
    const data = await res.json().catch(() => ({}));
    throw new Error(data.error || `Request failed: ${res.status}`);
  }
  return res.json();
}

const EMPTY_PARTNER = { category: '', name: '', location: '' };
const EMPTY_EVENT   = { region: '', name: '', month: '' };

const field = {
  width: '100%', padding: '0.5rem 0.75rem', border: '1px solid #d1d5db',
  borderRadius: '6px', fontSize: '0.875rem', boxSizing: 'border-box', color: '#111827',
};
const lbl = {
  display: 'block', fontSize: '0.7rem', fontWeight: 600, color: '#374151',
  marginBottom: '0.25rem', textTransform: 'uppercase', letterSpacing: '0.05em',
};

export default function AdminWhereWhen() {
  const { partners, events, loading } = useWhereWhen();
  const [writeError, setWriteError] = useState(null);

  return (
    <AdminLayout>
      {/* Header */}
      <div style={{ marginBottom: '1.5rem' }}>
        <h1 style={{ fontSize: '1.5rem', fontWeight: 700, color: '#111827', margin: 0 }}>Where & When</h1>
        <p style={{ color: '#6b7280', fontSize: '0.875rem', marginTop: '0.25rem' }}>
          Manage Self-Fly Hire destination partners and event partners. Toggle visibility and set display order.
        </p>
      </div>

      {/* Error banner (shared across both sections) */}
      {writeError && (
        <div style={{ background: '#fee2e2', color: '#991b1b', padding: '0.75rem 1rem', borderRadius: '8px', marginBottom: '1rem', fontSize: '0.875rem' }}>
          {writeError}
        </div>
      )}

      {/* Destination Partners */}
      <PartnersSection
        partners={partners}
        loading={loading}
        onError={setWriteError}
      />

      {/* Event Partners */}
      <EventsSection
        events={events}
        loading={loading}
        onError={setWriteError}
      />
    </AdminLayout>
  );
}

// ─── Partners section ────────────────────────────────────────────────────────

function PartnersSection({ partners, loading, onError }) {
  const [saving, setSaving] = useState(null);
  const [editingId, setEditingId] = useState(null);
  const [editForm, setEditForm] = useState({});
  const [adding, setAdding] = useState(false);
  const [addForm, setAddForm] = useState(EMPTY_PARTNER);
  const [creating, setCreating] = useState(false);

  const sorted = [...partners].sort((a, b) => (a.displayOrder ?? 999) - (b.displayOrder ?? 999));

  async function handleCreate(e) {
    e.preventDefault();
    onError(null);
    setCreating(true);
    try {
      await adminFetch('/api/admin/sfh-partners', 'POST', {
        category: addForm.category.trim(),
        name: addForm.name.trim(),
        location: addForm.location.trim(),
        displayOrder: partners.length + 1,
        visible: true,
      });
      setAddForm(EMPTY_PARTNER);
      setAdding(false);
    } catch (err) {
      onError(err.message);
    } finally {
      setCreating(false);
    }
  }

  function startEdit(p) {
    setEditingId(p.id);
    setEditForm({
      category: p.category ?? '',
      name: p.name ?? '',
      location: p.location ?? '',
    });
  }

  async function handleUpdate(e) {
    e.preventDefault();
    onError(null);
    setSaving(editingId);
    try {
      await adminFetch(`/api/admin/sfh-partners/${editingId}`, 'PATCH', {
        category: editForm.category.trim(),
        name: editForm.name.trim(),
        location: editForm.location.trim(),
      });
      setEditingId(null);
    } catch (err) {
      onError(err.message);
    } finally {
      setSaving(null);
    }
  }

  async function toggleVisible(p) {
    onError(null);
    setSaving(p.id);
    try {
      await adminFetch(`/api/admin/sfh-partners/${p.id}`, 'PATCH', { visible: !p.visible });
    } catch (err) {
      onError(err.message);
    } finally {
      setSaving(null);
    }
  }

  async function saveOrder(id, value) {
    const val = parseInt(value, 10);
    if (isNaN(val)) return;
    onError(null);
    setSaving(id);
    try {
      await adminFetch(`/api/admin/sfh-partners/${id}`, 'PATCH', { displayOrder: val });
    } catch (err) {
      onError(err.message);
    } finally {
      setSaving(null);
    }
  }

  async function handleDelete(id) {
    if (!window.confirm('Delete this partner?')) return;
    onError(null);
    setSaving(id);
    try {
      await adminFetch(`/api/admin/sfh-partners/${id}`, 'DELETE');
    } catch (err) {
      onError(err.message);
    } finally {
      setSaving(null);
    }
  }

  return (
    <section style={{ marginBottom: '2.5rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
        <h2 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#111827', margin: 0 }}>Destination Partners</h2>
        <button
          onClick={() => { setAdding((a) => !a); setEditingId(null); }}
          style={{ background: '#111827', color: '#fff', padding: '0.5rem 1.25rem', border: 'none', borderRadius: '6px', fontSize: '0.875rem', fontWeight: 600, cursor: 'pointer' }}
        >
          {adding ? 'Cancel' : '+ Add Partner'}
        </button>
      </div>

      {/* Add form */}
      {adding && (
        <form onSubmit={handleCreate} style={{ background: '#f9fafb', border: '1px solid #e5e7eb', borderRadius: '10px', padding: '1.25rem', marginBottom: '1.5rem' }}>
          <h3 style={{ fontSize: '0.875rem', fontWeight: 700, color: '#111827', margin: '0 0 1rem' }}>New Partner</h3>
          <div style={{ marginBottom: '0.75rem' }}>
            <label style={lbl}>Category</label>
            <input style={field} value={addForm.category} onChange={(e) => setAddForm((f) => ({ ...f, category: e.target.value }))} placeholder="e.g. Shooting Ground" required />
          </div>
          <div style={{ marginBottom: '0.75rem' }}>
            <label style={lbl}>Name</label>
            <input style={field} value={addForm.name} onChange={(e) => setAddForm((f) => ({ ...f, name: e.target.value }))} placeholder="e.g. Holland & Holland" required />
          </div>
          <div style={{ marginBottom: '1rem' }}>
            <label style={lbl}>Location</label>
            <input style={field} value={addForm.location} onChange={(e) => setAddForm((f) => ({ ...f, location: e.target.value }))} placeholder="e.g. Northwood" required />
          </div>
          <button type="submit" disabled={creating} style={{ background: '#111827', color: '#fff', padding: '0.5rem 1.25rem', border: 'none', borderRadius: '6px', fontWeight: 600, fontSize: '0.875rem', cursor: 'pointer', opacity: creating ? 0.6 : 1 }}>
            {creating ? 'Saving…' : 'Add Partner'}
          </button>
        </form>
      )}

      {/* List */}
      {loading ? (
        <p style={{ color: '#6b7280' }}>Loading…</p>
      ) : sorted.length === 0 ? (
        <p style={{ color: '#6b7280' }}>No partners yet — add one above.</p>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
          {sorted.map((p) => (
            <div key={p.id} style={{ border: '1px solid #e5e7eb', borderRadius: '8px', overflow: 'hidden', opacity: p.visible ? 1 : 0.5 }}>
              <div style={{ background: '#fff', padding: '0.875rem 1rem', display: 'flex', gap: '1rem', alignItems: 'flex-start' }}>
                <div style={{ width: '28px', height: '28px', borderRadius: '6px', background: '#f3f4f6', flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, color: '#6b7280', fontSize: '0.75rem' }}>
                  {p.displayOrder ?? '—'}
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <p style={{ fontWeight: 600, color: '#111827', fontSize: '0.875rem', margin: '0 0 0.25rem' }}>{p.name}</p>
                  <p style={{ color: '#6b7280', fontSize: '0.8rem', margin: 0 }}>
                    {p.category} · {p.location}
                  </p>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem', alignItems: 'flex-end', flexShrink: 0 }}>
                  <button
                    onClick={() => toggleVisible(p)}
                    disabled={saving === p.id}
                    style={{ padding: '0.25rem 0.6rem', border: 'none', borderRadius: '4px', cursor: 'pointer', fontSize: '0.75rem', fontWeight: 600, background: p.visible ? '#d1fae5' : '#f3f4f6', color: p.visible ? '#065f46' : '#374151' }}
                  >
                    {saving === p.id ? '…' : p.visible ? 'Visible' : 'Hidden'}
                  </button>
                  <div style={{ display: 'flex', gap: '0.25rem', alignItems: 'center' }}>
                    <label style={{ fontSize: '0.65rem', color: '#9ca3af' }}>Order</label>
                    <input
                      type="number"
                      defaultValue={p.displayOrder ?? ''}
                      onBlur={(e) => saveOrder(p.id, e.target.value)}
                      onKeyDown={(e) => { if (e.key === 'Enter') saveOrder(p.id, e.target.value); }}
                      style={{ width: '48px', padding: '0.2rem 0.35rem', border: '1px solid #d1d5db', borderRadius: '4px', fontSize: '0.75rem', textAlign: 'center' }}
                    />
                  </div>
                  <button
                    onClick={() => editingId === p.id ? setEditingId(null) : startEdit(p)}
                    style={{ background: 'none', border: '1px solid #d1d5db', borderRadius: '4px', color: '#374151', cursor: 'pointer', fontSize: '0.72rem', fontWeight: 500, padding: '0.15rem 0.5rem' }}
                  >
                    {editingId === p.id ? 'Cancel' : 'Edit'}
                  </button>
                  <button
                    onClick={() => handleDelete(p.id)}
                    disabled={saving === p.id}
                    style={{ background: 'none', border: 'none', color: '#dc2626', cursor: 'pointer', fontSize: '0.72rem', fontWeight: 500, padding: 0 }}
                  >
                    Delete
                  </button>
                </div>
              </div>
              {editingId === p.id && (
                <form onSubmit={handleUpdate} style={{ borderTop: '1px solid #e5e7eb', padding: '1rem', background: '#fafafa', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                  <div>
                    <label style={lbl}>Category</label>
                    <input style={field} value={editForm.category} onChange={(e) => setEditForm((f) => ({ ...f, category: e.target.value }))} required />
                  </div>
                  <div>
                    <label style={lbl}>Name</label>
                    <input style={field} value={editForm.name} onChange={(e) => setEditForm((f) => ({ ...f, name: e.target.value }))} required />
                  </div>
                  <div>
                    <label style={lbl}>Location</label>
                    <input style={field} value={editForm.location} onChange={(e) => setEditForm((f) => ({ ...f, location: e.target.value }))} required />
                  </div>
                  <button type="submit" disabled={saving === p.id} style={{ alignSelf: 'flex-start', background: '#111827', color: '#fff', padding: '0.4rem 1rem', border: 'none', borderRadius: '6px', fontWeight: 600, fontSize: '0.8rem', cursor: 'pointer', opacity: saving === p.id ? 0.6 : 1 }}>
                    {saving === p.id ? 'Saving…' : 'Save changes'}
                  </button>
                </form>
              )}
            </div>
          ))}
        </div>
      )}
    </section>
  );
}

// ─── Events section ──────────────────────────────────────────────────────────

function EventsSection({ events, loading, onError }) {
  const [saving, setSaving] = useState(null);
  const [editingId, setEditingId] = useState(null);
  const [editForm, setEditForm] = useState({});
  const [adding, setAdding] = useState(false);
  const [addForm, setAddForm] = useState(EMPTY_EVENT);
  const [creating, setCreating] = useState(false);

  const sorted = [...events].sort((a, b) => (a.displayOrder ?? 999) - (b.displayOrder ?? 999));

  async function handleCreate(e) {
    e.preventDefault();
    onError(null);
    setCreating(true);
    try {
      await adminFetch('/api/admin/sfh-events', 'POST', {
        region: addForm.region.trim(),
        name: addForm.name.trim(),
        month: addForm.month.trim(),
        displayOrder: events.length + 1,
        visible: true,
      });
      setAddForm(EMPTY_EVENT);
      setAdding(false);
    } catch (err) {
      onError(err.message);
    } finally {
      setCreating(false);
    }
  }

  function startEdit(ev) {
    setEditingId(ev.id);
    setEditForm({
      region: ev.region ?? '',
      name: ev.name ?? '',
      month: ev.month ?? '',
    });
  }

  async function handleUpdate(e) {
    e.preventDefault();
    onError(null);
    setSaving(editingId);
    try {
      await adminFetch(`/api/admin/sfh-events/${editingId}`, 'PATCH', {
        region: editForm.region.trim(),
        name: editForm.name.trim(),
        month: editForm.month.trim(),
      });
      setEditingId(null);
    } catch (err) {
      onError(err.message);
    } finally {
      setSaving(null);
    }
  }

  async function toggleVisible(ev) {
    onError(null);
    setSaving(ev.id);
    try {
      await adminFetch(`/api/admin/sfh-events/${ev.id}`, 'PATCH', { visible: !ev.visible });
    } catch (err) {
      onError(err.message);
    } finally {
      setSaving(null);
    }
  }

  async function saveOrder(id, value) {
    const val = parseInt(value, 10);
    if (isNaN(val)) return;
    onError(null);
    setSaving(id);
    try {
      await adminFetch(`/api/admin/sfh-events/${id}`, 'PATCH', { displayOrder: val });
    } catch (err) {
      onError(err.message);
    } finally {
      setSaving(null);
    }
  }

  async function handleDelete(id) {
    if (!window.confirm('Delete this event?')) return;
    onError(null);
    setSaving(id);
    try {
      await adminFetch(`/api/admin/sfh-events/${id}`, 'DELETE');
    } catch (err) {
      onError(err.message);
    } finally {
      setSaving(null);
    }
  }

  return (
    <section>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
        <h2 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#111827', margin: 0 }}>Event Partners</h2>
        <button
          onClick={() => { setAdding((a) => !a); setEditingId(null); }}
          style={{ background: '#111827', color: '#fff', padding: '0.5rem 1.25rem', border: 'none', borderRadius: '6px', fontSize: '0.875rem', fontWeight: 600, cursor: 'pointer' }}
        >
          {adding ? 'Cancel' : '+ Add Event'}
        </button>
      </div>

      {/* Add form */}
      {adding && (
        <form onSubmit={handleCreate} style={{ background: '#f9fafb', border: '1px solid #e5e7eb', borderRadius: '10px', padding: '1.25rem', marginBottom: '1.5rem' }}>
          <h3 style={{ fontSize: '0.875rem', fontWeight: 700, color: '#111827', margin: '0 0 1rem' }}>New Event</h3>
          <div style={{ marginBottom: '0.75rem' }}>
            <label style={lbl}>Region</label>
            <input style={field} value={addForm.region} onChange={(e) => setAddForm((f) => ({ ...f, region: e.target.value }))} placeholder="e.g. Berkshire" required />
          </div>
          <div style={{ marginBottom: '0.75rem' }}>
            <label style={lbl}>Name</label>
            <input style={field} value={addForm.name} onChange={(e) => setAddForm((f) => ({ ...f, name: e.target.value }))} placeholder="e.g. Royal Ascot" required />
          </div>
          <div style={{ marginBottom: '1rem' }}>
            <label style={lbl}>Month / Date</label>
            <input style={field} value={addForm.month} onChange={(e) => setAddForm((f) => ({ ...f, month: e.target.value }))} placeholder="e.g. 16–20 Jun" required />
          </div>
          <button type="submit" disabled={creating} style={{ background: '#111827', color: '#fff', padding: '0.5rem 1.25rem', border: 'none', borderRadius: '6px', fontWeight: 600, fontSize: '0.875rem', cursor: 'pointer', opacity: creating ? 0.6 : 1 }}>
            {creating ? 'Saving…' : 'Add Event'}
          </button>
        </form>
      )}

      {/* List */}
      {loading ? (
        <p style={{ color: '#6b7280' }}>Loading…</p>
      ) : sorted.length === 0 ? (
        <p style={{ color: '#6b7280' }}>No events yet — add one above.</p>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
          {sorted.map((ev) => (
            <div key={ev.id} style={{ border: '1px solid #e5e7eb', borderRadius: '8px', overflow: 'hidden', opacity: ev.visible ? 1 : 0.5 }}>
              <div style={{ background: '#fff', padding: '0.875rem 1rem', display: 'flex', gap: '1rem', alignItems: 'flex-start' }}>
                <div style={{ width: '28px', height: '28px', borderRadius: '6px', background: '#f3f4f6', flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, color: '#6b7280', fontSize: '0.75rem' }}>
                  {ev.displayOrder ?? '—'}
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <p style={{ fontWeight: 600, color: '#111827', fontSize: '0.875rem', margin: '0 0 0.25rem' }}>{ev.name}</p>
                  <p style={{ color: '#6b7280', fontSize: '0.8rem', margin: 0 }}>
                    {ev.month} · {ev.region}
                  </p>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem', alignItems: 'flex-end', flexShrink: 0 }}>
                  <button
                    onClick={() => toggleVisible(ev)}
                    disabled={saving === ev.id}
                    style={{ padding: '0.25rem 0.6rem', border: 'none', borderRadius: '4px', cursor: 'pointer', fontSize: '0.75rem', fontWeight: 600, background: ev.visible ? '#d1fae5' : '#f3f4f6', color: ev.visible ? '#065f46' : '#374151' }}
                  >
                    {saving === ev.id ? '…' : ev.visible ? 'Visible' : 'Hidden'}
                  </button>
                  <div style={{ display: 'flex', gap: '0.25rem', alignItems: 'center' }}>
                    <label style={{ fontSize: '0.65rem', color: '#9ca3af' }}>Order</label>
                    <input
                      type="number"
                      defaultValue={ev.displayOrder ?? ''}
                      onBlur={(e) => saveOrder(ev.id, e.target.value)}
                      onKeyDown={(e) => { if (e.key === 'Enter') saveOrder(ev.id, e.target.value); }}
                      style={{ width: '48px', padding: '0.2rem 0.35rem', border: '1px solid #d1d5db', borderRadius: '4px', fontSize: '0.75rem', textAlign: 'center' }}
                    />
                  </div>
                  <button
                    onClick={() => editingId === ev.id ? setEditingId(null) : startEdit(ev)}
                    style={{ background: 'none', border: '1px solid #d1d5db', borderRadius: '4px', color: '#374151', cursor: 'pointer', fontSize: '0.72rem', fontWeight: 500, padding: '0.15rem 0.5rem' }}
                  >
                    {editingId === ev.id ? 'Cancel' : 'Edit'}
                  </button>
                  <button
                    onClick={() => handleDelete(ev.id)}
                    disabled={saving === ev.id}
                    style={{ background: 'none', border: 'none', color: '#dc2626', cursor: 'pointer', fontSize: '0.72rem', fontWeight: 500, padding: 0 }}
                  >
                    Delete
                  </button>
                </div>
              </div>
              {editingId === ev.id && (
                <form onSubmit={handleUpdate} style={{ borderTop: '1px solid #e5e7eb', padding: '1rem', background: '#fafafa', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                  <div>
                    <label style={lbl}>Region</label>
                    <input style={field} value={editForm.region} onChange={(e) => setEditForm((f) => ({ ...f, region: e.target.value }))} required />
                  </div>
                  <div>
                    <label style={lbl}>Name</label>
                    <input style={field} value={editForm.name} onChange={(e) => setEditForm((f) => ({ ...f, name: e.target.value }))} required />
                  </div>
                  <div>
                    <label style={lbl}>Month / Date</label>
                    <input style={field} value={editForm.month} onChange={(e) => setEditForm((f) => ({ ...f, month: e.target.value }))} required />
                  </div>
                  <button type="submit" disabled={saving === ev.id} style={{ alignSelf: 'flex-start', background: '#111827', color: '#fff', padding: '0.4rem 1rem', border: 'none', borderRadius: '6px', fontWeight: 600, fontSize: '0.8rem', cursor: 'pointer', opacity: saving === ev.id ? 0.6 : 1 }}>
                    {saving === ev.id ? 'Saving…' : 'Save changes'}
                  </button>
                </form>
              )}
            </div>
          ))}
        </div>
      )}
    </section>
  );
}

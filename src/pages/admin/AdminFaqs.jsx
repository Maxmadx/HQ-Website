import { useState } from 'react';
import { getAuth } from 'firebase/auth';
import AdminLayout from '../../components/admin/AdminLayout';
import { useFaqs } from '../../hooks/useFaqs';

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

const PAGES = [
  { key: 'discovery',      label: 'Discovery Flight',    url: '/training/trial-lessons' },
  { key: 'sfh',            label: 'Self-Fly Hire',       url: '/self-fly-hire' },
  { key: 'sales',          label: 'Sales',               url: '/sales/new' },
  { key: 'expeditions',    label: 'Expeditions',         url: '/expeditions' },
  { key: 'ppl',            label: 'PPL Training',        url: '/training/ppl' },
  { key: 'night-rating',   label: 'Night Rating',        url: '/training/night-rating' },
  { key: 'type-rating',    label: 'Type Rating',         url: '/training/type-rating' },
  { key: 'training-faq',   label: 'Training FAQ',        url: '/training/faq' },
  { key: 'helicopter-tour', label: 'Helicopter Tour',    url: '/helicopter-tour-of-london' },
  { key: 'rebuilds',       label: 'Rebuilds',            url: '/sales/rebuilds' },
];

const EMPTY = { question: '', answer: '' };

export default function AdminFaqs() {
  const [activePage, setActivePage] = useState('discovery');
  const { faqs, loading } = useFaqs(activePage);
  const [saving, setSaving] = useState(null);
  const [editingId, setEditingId] = useState(null);
  const [editForm, setEditForm] = useState({});
  const [adding, setAdding] = useState(false);
  const [addForm, setAddForm] = useState(EMPTY);
  const [creating, setCreating] = useState(false);
  const [writeError, setWriteError] = useState(null);

  const sorted = [...faqs].sort((a, b) => (a.displayOrder ?? 999) - (b.displayOrder ?? 999));

  async function handleCreate(e) {
    e.preventDefault();
    setWriteError(null);
    setCreating(true);
    try {
      await adminFetch('/api/admin/faqs', 'POST', {
        page: activePage,
        question: addForm.question.trim(),
        answer: addForm.answer.trim(),
        displayOrder: faqs.length + 1,
        visible: true,
      });
      setAddForm(EMPTY);
      setAdding(false);
    } catch (err) {
      setWriteError(err.message);
    } finally {
      setCreating(false);
    }
  }

  function startEdit(faq) {
    setEditingId(faq.id);
    setEditForm({ question: faq.question ?? '', answer: faq.answer ?? '' });
  }

  async function handleUpdate(e) {
    e.preventDefault();
    setWriteError(null);
    setSaving(editingId);
    try {
      await adminFetch(`/api/admin/faqs/${editingId}`, 'PATCH', {
        question: editForm.question.trim(),
        answer: editForm.answer.trim(),
      });
      setEditingId(null);
    } catch (err) {
      setWriteError(err.message);
    } finally {
      setSaving(null);
    }
  }

  async function toggleVisible(faq) {
    setWriteError(null);
    setSaving(faq.id);
    try {
      await adminFetch(`/api/admin/faqs/${faq.id}`, 'PATCH', { visible: !faq.visible });
    } catch (err) {
      setWriteError(err.message);
    } finally {
      setSaving(null);
    }
  }

  async function saveOrder(id, value) {
    const val = parseInt(value, 10);
    if (isNaN(val)) return;
    setWriteError(null);
    setSaving(id);
    try {
      await adminFetch(`/api/admin/faqs/${id}`, 'PATCH', { displayOrder: val });
    } catch (err) {
      setWriteError(err.message);
    } finally {
      setSaving(null);
    }
  }

  async function handleDelete(id) {
    if (!window.confirm('Delete this FAQ?')) return;
    setWriteError(null);
    setSaving(id);
    try {
      await adminFetch(`/api/admin/faqs/${id}`, 'DELETE');
    } catch (err) {
      setWriteError(err.message);
    } finally {
      setSaving(null);
    }
  }

  function handlePageChange(key) {
    setActivePage(key);
    setEditingId(null);
    setAdding(false);
    setAddForm(EMPTY);
  }

  const field = {
    width: '100%', padding: '0.5rem 0.75rem', border: '1px solid #d1d5db',
    borderRadius: '6px', fontSize: '0.875rem', boxSizing: 'border-box', color: '#111827',
  };
  const lbl = {
    display: 'block', fontSize: '0.7rem', fontWeight: 600, color: '#374151',
    marginBottom: '0.25rem', textTransform: 'uppercase', letterSpacing: '0.05em',
  };

  return (
    <AdminLayout>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
        <div>
          <h1 style={{ fontSize: '1.5rem', fontWeight: 700, color: '#111827', margin: 0 }}>FAQs</h1>
          <p style={{ color: '#6b7280', fontSize: '0.875rem', marginTop: '0.25rem' }}>
            Manage FAQ questions per page. Toggle visibility and set display order.
          </p>
        </div>
        <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
          <a
            href={`${PAGES.find((p) => p.key === activePage)?.url}?highlight=faqs-${activePage}`}
            target="_blank"
            rel="noreferrer"
            style={{ fontSize: '0.68rem', fontWeight: 600, color: 'rgb(96, 165, 250)', textDecoration: 'none', padding: '2px 6px', borderRadius: '4px', background: 'rgb(239, 246, 255)', whiteSpace: 'nowrap' }}
          >
            Find on page ↗
          </a>
          <button
            onClick={() => { setAdding((a) => !a); setEditingId(null); }}
            style={{ background: '#111827', color: '#fff', padding: '0.5rem 1.25rem', border: 'none', borderRadius: '6px', fontSize: '0.875rem', fontWeight: 600, cursor: 'pointer' }}
          >
            {adding ? 'Cancel' : '+ Add Question'}
          </button>
        </div>
      </div>

      {/* Page tabs */}
      <div style={{ display: 'flex', gap: '4px', flexWrap: 'wrap', marginBottom: '1.5rem', borderBottom: '1px solid #e5e7eb', paddingBottom: '0.75rem' }}>
        {PAGES.map((p) => (
          <button
            key={p.key}
            onClick={() => handlePageChange(p.key)}
            style={{
              padding: '0.35rem 0.875rem', border: 'none', borderRadius: '6px', cursor: 'pointer',
              fontSize: '0.8rem', fontWeight: activePage === p.key ? 700 : 500,
              background: activePage === p.key ? '#111827' : '#f3f4f6',
              color: activePage === p.key ? '#fff' : '#374151',
            }}
          >
            {p.label}
          </button>
        ))}
      </div>

      {/* Add form */}
      {adding && (
        <form onSubmit={handleCreate} style={{ background: '#f9fafb', border: '1px solid #e5e7eb', borderRadius: '10px', padding: '1.25rem', marginBottom: '1.5rem' }}>
          <h2 style={{ fontSize: '0.875rem', fontWeight: 700, color: '#111827', margin: '0 0 1rem' }}>
            New Question — {PAGES.find((p) => p.key === activePage)?.label}
          </h2>
          <div style={{ marginBottom: '0.75rem' }}>
            <label style={lbl}>Question</label>
            <input style={field} value={addForm.question} onChange={(e) => setAddForm((f) => ({ ...f, question: e.target.value }))} placeholder="What is…?" required />
          </div>
          <div style={{ marginBottom: '1rem' }}>
            <label style={lbl}>Answer</label>
            <textarea style={{ ...field, minHeight: '90px', resize: 'vertical', lineHeight: 1.6 }} value={addForm.answer} onChange={(e) => setAddForm((f) => ({ ...f, answer: e.target.value }))} required />
          </div>
          <button type="submit" disabled={creating} style={{ background: '#111827', color: '#fff', padding: '0.5rem 1.25rem', border: 'none', borderRadius: '6px', fontWeight: 600, fontSize: '0.875rem', cursor: 'pointer', opacity: creating ? 0.6 : 1 }}>
            {creating ? 'Saving…' : 'Add Question'}
          </button>
        </form>
      )}

      {/* Error banner */}
      {writeError && (
        <div style={{ background: '#fee2e2', color: '#991b1b', padding: '0.75rem 1rem', borderRadius: '8px', marginBottom: '1rem', fontSize: '0.875rem' }}>
          {writeError}
        </div>
      )}

      {/* FAQ list */}
      {loading ? (
        <p style={{ color: '#6b7280' }}>Loading…</p>
      ) : sorted.length === 0 ? (
        <p style={{ color: '#6b7280' }}>No questions yet — add one above.</p>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
          {sorted.map((faq) => (
            <div key={faq.id} style={{ border: '1px solid #e5e7eb', borderRadius: '8px', overflow: 'hidden', opacity: faq.visible ? 1 : 0.5 }}>
              {/* Row */}
              <div style={{ background: '#fff', padding: '0.875rem 1rem', display: 'flex', gap: '1rem', alignItems: 'flex-start' }}>
                {/* Order badge */}
                <div style={{ width: '28px', height: '28px', borderRadius: '6px', background: '#f3f4f6', flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, color: '#6b7280', fontSize: '0.75rem' }}>
                  {faq.displayOrder ?? '—'}
                </div>
                {/* Content */}
                <div style={{ flex: 1, minWidth: 0 }}>
                  <p style={{ fontWeight: 600, color: '#111827', fontSize: '0.875rem', margin: '0 0 0.25rem' }}>{faq.question}</p>
                  <p style={{ color: '#6b7280', fontSize: '0.8rem', margin: 0, lineHeight: 1.5, overflow: 'hidden', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical' }}>{faq.answer}</p>
                </div>
                {/* Controls */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem', alignItems: 'flex-end', flexShrink: 0 }}>
                  <button
                    onClick={() => toggleVisible(faq)}
                    disabled={saving === faq.id}
                    style={{ padding: '0.25rem 0.6rem', border: 'none', borderRadius: '4px', cursor: 'pointer', fontSize: '0.75rem', fontWeight: 600, background: faq.visible ? '#d1fae5' : '#f3f4f6', color: faq.visible ? '#065f46' : '#374151' }}
                  >
                    {saving === faq.id ? '…' : faq.visible ? 'Visible' : 'Hidden'}
                  </button>
                  <div style={{ display: 'flex', gap: '0.25rem', alignItems: 'center' }}>
                    <label style={{ fontSize: '0.65rem', color: '#9ca3af' }}>Order</label>
                    <input
                      type="number"
                      defaultValue={faq.displayOrder ?? ''}
                      onBlur={(e) => saveOrder(faq.id, e.target.value)}
                      onKeyDown={(e) => { if (e.key === 'Enter') saveOrder(faq.id, e.target.value); }}
                      style={{ width: '48px', padding: '0.2rem 0.35rem', border: '1px solid #d1d5db', borderRadius: '4px', fontSize: '0.75rem', textAlign: 'center' }}
                    />
                  </div>
                  <button
                    onClick={() => editingId === faq.id ? setEditingId(null) : startEdit(faq)}
                    style={{ background: 'none', border: '1px solid #d1d5db', borderRadius: '4px', color: '#374151', cursor: 'pointer', fontSize: '0.72rem', fontWeight: 500, padding: '0.15rem 0.5rem' }}
                  >
                    {editingId === faq.id ? 'Cancel' : 'Edit'}
                  </button>
                  <button
                    onClick={() => handleDelete(faq.id)}
                    disabled={saving === faq.id}
                    style={{ background: 'none', border: 'none', color: '#dc2626', cursor: 'pointer', fontSize: '0.72rem', fontWeight: 500, padding: 0 }}
                  >
                    Delete
                  </button>
                </div>
              </div>
              {/* Inline edit */}
              {editingId === faq.id && (
                <form onSubmit={handleUpdate} style={{ borderTop: '1px solid #e5e7eb', padding: '1rem', background: '#fafafa', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                  <div>
                    <label style={lbl}>Question</label>
                    <input style={field} value={editForm.question} onChange={(e) => setEditForm((f) => ({ ...f, question: e.target.value }))} required />
                  </div>
                  <div>
                    <label style={lbl}>Answer</label>
                    <textarea style={{ ...field, minHeight: '90px', resize: 'vertical', lineHeight: 1.6 }} value={editForm.answer} onChange={(e) => setEditForm((f) => ({ ...f, answer: e.target.value }))} required />
                  </div>
                  <button type="submit" disabled={saving === faq.id} style={{ alignSelf: 'flex-start', background: '#111827', color: '#fff', padding: '0.4rem 1rem', border: 'none', borderRadius: '6px', fontWeight: 600, fontSize: '0.8rem', cursor: 'pointer', opacity: saving === faq.id ? 0.6 : 1 }}>
                    {saving === faq.id ? 'Saving…' : 'Save changes'}
                  </button>
                </form>
              )}
            </div>
          ))}
        </div>
      )}
    </AdminLayout>
  );
}

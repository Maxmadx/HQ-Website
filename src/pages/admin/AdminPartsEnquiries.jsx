import { useState } from 'react';
import { Link } from 'react-router-dom';
import AdminLayout from '../../components/admin/AdminLayout';
import { useCollection } from '../../hooks/useFirestore';
import { auth } from '../../lib/firebase';

const STATUS_OPTIONS = ['open', 'responded', 'closed'];

const statusColor = (s) => ({ open: '#dc2626', responded: '#d97706', closed: '#16a34a' })[s] || '#6b7280';

export default function AdminPartsEnquiries() {
  const { docs: enquiries, loading } = useCollection('parts_enquiries');
  const [expandedId, setExpandedId] = useState(null);
  const [editNotes, setEditNotes] = useState({});
  const [savingId, setSavingId] = useState(null);
  const [filterStatus, setFilterStatus] = useState('all');

  async function updateEnquiry(id, payload) {
    setSavingId(id);
    try {
      const token = await auth.currentUser?.getIdToken();
      await fetch(`/api/parts-enquiry/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json', ...(token ? { Authorization: `Bearer ${token}` } : {}) },
        body: JSON.stringify(payload),
      });
    } finally {
      setSavingId(null);
    }
  }

  function formatDate(ts) {
    if (!ts) return '—';
    const d = ts.toDate ? ts.toDate() : new Date(ts);
    return d.toLocaleString('en-GB', { day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit' });
  }

  const filtered = filterStatus === 'all' ? enquiries : enquiries.filter((e) => e.status === filterStatus);
  const counts = enquiries.reduce((acc, e) => { acc[e.status] = (acc[e.status] || 0) + 1; return acc; }, {});

  return (
    <AdminLayout>
      <div style={{ marginBottom: '1.5rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
          <h1 style={{ fontSize: '1.5rem', fontWeight: 700, color: '#111827', margin: 0 }}>Parts Enquiries</h1>
          <span style={{ fontSize: '0.875rem', color: '#6b7280' }}>{enquiries.length} total</span>
        </div>
        <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
          {['all', ...STATUS_OPTIONS].map((s) => (
            <button key={s} onClick={() => setFilterStatus(s)} style={{ padding: '4px 12px', borderRadius: '9999px', border: 'none', cursor: 'pointer', fontSize: '0.8rem', fontWeight: 600, background: filterStatus === s ? '#111827' : '#f3f4f6', color: filterStatus === s ? '#fff' : '#374151' }}>
              {s === 'all' ? `All (${enquiries.length})` : `${s} (${counts[s] || 0})`}
            </button>
          ))}
        </div>
      </div>

      {loading ? (
        <p style={{ color: '#6b7280' }}>Loading…</p>
      ) : filtered.length === 0 ? (
        <p style={{ color: '#6b7280' }}>No enquiries matching filter.</p>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
          {filtered.map((eq) => {
            const isOpen = expandedId === eq.id;
            const adminNotes = editNotes[eq.id] !== undefined ? editNotes[eq.id] : (eq.adminNotes || '');
            return (
              <div key={eq.id} style={{ background: '#fff', border: '1px solid #e5e7eb', borderRadius: '8px', overflow: 'hidden' }}>
                <div onClick={() => setExpandedId(isOpen ? null : eq.id)} style={{ display: 'flex', alignItems: 'center', gap: '1rem', padding: '0.875rem 1rem', cursor: 'pointer', userSelect: 'none' }}>
                  <div style={{ flex: '0 0 130px', fontFamily: 'monospace', fontSize: '0.8rem', fontWeight: 600 }}>{eq.partNumber}</div>
                  <div style={{ flex: '0 0 80px', fontSize: '0.8rem', color: '#6b7280' }}>{eq.condition}</div>
                  <div style={{ flex: '0 0 50px', fontSize: '0.8rem', color: '#6b7280' }}>×{eq.qty || 1}</div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontWeight: 600, color: '#111827', fontSize: '0.875rem' }}>{eq.name}</div>
                    <div style={{ color: '#6b7280', fontSize: '0.8rem' }}>{eq.email}</div>
                  </div>
                  <div style={{ flex: '0 0 100px', fontSize: '0.8rem', fontWeight: 600, color: statusColor(eq.status), textTransform: 'uppercase', letterSpacing: '0.05em' }}>{eq.status}</div>
                  <div style={{ flex: '0 0 100px', color: '#9ca3af', fontSize: '0.75rem', textAlign: 'right' }}>{formatDate(eq.createdAt)}</div>
                  <span style={{ color: '#9ca3af', fontSize: '0.75rem' }}>{isOpen ? '▲' : '▼'}</span>
                </div>

                {isOpen && (
                  <div style={{ borderTop: '1px solid #f3f4f6', padding: '1rem', background: '#fafafa' }}>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '1rem', marginBottom: '1rem', fontSize: '0.875rem' }}>
                      <div>
                        <div style={{ fontSize: '0.7rem', fontWeight: 600, color: '#6b7280', textTransform: 'uppercase', marginBottom: '0.2rem' }}>Phone</div>
                        <div>{eq.phone || '—'}</div>
                      </div>
                      <div>
                        <div style={{ fontSize: '0.7rem', fontWeight: 600, color: '#6b7280', textTransform: 'uppercase', marginBottom: '0.2rem' }}>Tail</div>
                        <div style={{ fontFamily: 'monospace' }}>{eq.tail || '—'}</div>
                      </div>
                      <div>
                        <div style={{ fontSize: '0.7rem', fontWeight: 600, color: '#6b7280', textTransform: 'uppercase', marginBottom: '0.2rem' }}>Listing link</div>
                        {eq.partListingId ? (
                          <Link to={`/parts/${eq.partListingId}`} target="_blank" style={{ color: '#2563eb', textDecoration: 'underline' }}>View listing →</Link>
                        ) : (
                          <span style={{ fontSize: '0.8rem', color: '#9ca3af' }}>—</span>
                        )}
                      </div>
                    </div>
                    <div style={{ marginBottom: '1rem' }}>
                      <div style={{ fontSize: '0.7rem', fontWeight: 600, color: '#6b7280', textTransform: 'uppercase', marginBottom: '0.2rem' }}>Customer notes</div>
                      <p style={{ fontSize: '0.875rem', color: '#374151', whiteSpace: 'pre-wrap', margin: 0 }}>{eq.notes || '—'}</p>
                    </div>
                    <div style={{ display: 'flex', gap: '1rem', alignItems: 'flex-end' }}>
                      <div style={{ flex: 1 }}>
                        <div style={{ fontSize: '0.7rem', fontWeight: 600, color: '#6b7280', textTransform: 'uppercase', marginBottom: '0.2rem' }}>Admin notes</div>
                        <textarea value={adminNotes} onChange={(e) => setEditNotes((n) => ({ ...n, [eq.id]: e.target.value }))} style={{ width: '100%', minHeight: '72px', padding: '0.5rem', border: '1px solid #d1d5db', borderRadius: '6px', fontSize: '0.875rem', resize: 'vertical', boxSizing: 'border-box' }} />
                      </div>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', flex: '0 0 180px' }}>
                        <select value={eq.status} onChange={(e) => updateEnquiry(eq.id, { status: e.target.value })} style={{ padding: '0.4rem', border: '1px solid #d1d5db', borderRadius: '6px', fontSize: '0.875rem' }}>
                          {STATUS_OPTIONS.map((s) => <option key={s} value={s}>{s}</option>)}
                        </select>
                        <button onClick={() => updateEnquiry(eq.id, { adminNotes })} disabled={savingId === eq.id} style={{ padding: '0.5rem', background: '#111827', color: '#fff', border: 'none', borderRadius: '6px', cursor: 'pointer', fontSize: '0.8rem', fontWeight: 600, opacity: savingId === eq.id ? 0.6 : 1 }}>
                          {savingId === eq.id ? 'Saving…' : 'Save Notes'}
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </AdminLayout>
  );
}

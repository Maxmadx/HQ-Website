import { useState } from 'react';
import AdminLayout from '../../components/admin/AdminLayout';
import StatusBadge from '../../components/admin/StatusBadge';
import { useCollection } from '../../hooks/useFirestore';
import { auth } from '../../lib/firebase';

const STATUS_OPTIONS = ['new', 'contacted', 'qualified', 'closed'];

export default function AdminLeads() {
  const { docs: leads, loading } = useCollection('leads');
  const [expandedId, setExpandedId] = useState(null);
  const [editNotes, setEditNotes] = useState({});
  const [savingId, setSavingId] = useState(null);
  const [filterStatus, setFilterStatus] = useState('all');

  async function updateLead(id, payload) {
    setSavingId(id);
    try {
      const token = await auth.currentUser?.getIdToken();
      await fetch(`/api/leads/${id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
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

  const filtered = filterStatus === 'all' ? leads : leads.filter((l) => l.status === filterStatus);
  const counts = leads.reduce((acc, l) => { acc[l.status] = (acc[l.status] || 0) + 1; return acc; }, {});

  return (
    <AdminLayout>
      <div style={{ marginBottom: '1.5rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
          <h1 style={{ fontSize: '1.5rem', fontWeight: 700, color: '#111827' }}>Leads</h1>
          <span style={{ fontSize: '0.875rem', color: '#6b7280' }}>{leads.length} total</span>
        </div>
        <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
          {['all', ...STATUS_OPTIONS].map((s) => (
            <button key={s} onClick={() => setFilterStatus(s)} style={{ padding: '4px 12px', borderRadius: '9999px', border: 'none', cursor: 'pointer', fontSize: '0.8rem', fontWeight: 600, background: filterStatus === s ? '#111827' : '#f3f4f6', color: filterStatus === s ? '#fff' : '#374151' }}>
              {s === 'all' ? `All (${leads.length})` : `${s} (${counts[s] || 0})`}
            </button>
          ))}
        </div>
      </div>

      {loading ? (
        <p style={{ color: '#6b7280' }}>Loading…</p>
      ) : filtered.length === 0 ? (
        <p style={{ color: '#6b7280' }}>No leads matching filter.</p>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
          {filtered.map((lead) => {
            const isOpen = expandedId === lead.id;
            const notes = editNotes[lead.id] !== undefined ? editNotes[lead.id] : (lead.notes || '');
            return (
              <div key={lead.id} style={{ background: '#fff', border: '1px solid #e5e7eb', borderRadius: '8px', overflow: 'hidden' }}>
                <div onClick={() => setExpandedId(isOpen ? null : lead.id)} style={{ display: 'flex', alignItems: 'center', gap: '1rem', padding: '0.875rem 1rem', cursor: 'pointer', userSelect: 'none' }}>
                  <div style={{ flex: '0 0 180px' }}>
                    <div style={{ fontWeight: 600, color: '#111827', fontSize: '0.875rem' }}>{lead.name}</div>
                    <div style={{ color: '#6b7280', fontSize: '0.8rem' }}>{lead.email}</div>
                  </div>
                  <div style={{ flex: '0 0 140px', color: '#6b7280', fontSize: '0.8rem' }}>{lead.phone || '—'}</div>
                  <div style={{ flex: 1, color: '#374151', fontSize: '0.875rem', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                    {lead.subject || lead.message?.slice(0, 80) || '—'}
                  </div>
                  <div style={{ flex: '0 0 120px' }}><StatusBadge status={lead.status} /></div>
                  <div style={{ flex: '0 0 100px', color: '#9ca3af', fontSize: '0.75rem', textAlign: 'right' }}>{formatDate(lead.createdAt)}</div>
                  <span style={{ color: '#9ca3af', fontSize: '0.75rem' }}>{isOpen ? '▲' : '▼'}</span>
                </div>

                {isOpen && (
                  <div style={{ borderTop: '1px solid #f3f4f6', padding: '1rem', background: '#fafafa' }}>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
                      <div>
                        <div style={{ fontSize: '0.75rem', fontWeight: 600, color: '#6b7280', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.25rem' }}>Message</div>
                        <p style={{ fontSize: '0.875rem', color: '#374151', whiteSpace: 'pre-wrap', margin: 0 }}>{lead.message || '—'}</p>
                      </div>
                      <div>
                        <div style={{ fontSize: '0.75rem', fontWeight: 600, color: '#6b7280', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.25rem' }}>Source</div>
                        <p style={{ fontSize: '0.875rem', color: '#374151', fontFamily: 'monospace', margin: 0 }}>{lead.source || '—'}</p>
                      </div>
                    </div>
                    <div style={{ display: 'flex', gap: '1rem', alignItems: 'flex-end' }}>
                      <div style={{ flex: 1 }}>
                        <div style={{ fontSize: '0.75rem', fontWeight: 600, color: '#6b7280', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.25rem' }}>Notes</div>
                        <textarea value={notes} onChange={(e) => setEditNotes((n) => ({ ...n, [lead.id]: e.target.value }))} style={{ width: '100%', minHeight: '72px', padding: '0.5rem', border: '1px solid #d1d5db', borderRadius: '6px', fontSize: '0.875rem', resize: 'vertical', boxSizing: 'border-box' }} />
                      </div>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', flex: '0 0 180px' }}>
                        <div>
                          <div style={{ fontSize: '0.75rem', fontWeight: 600, color: '#6b7280', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.25rem' }}>Status</div>
                          <select value={lead.status} onChange={(e) => updateLead(lead.id, { status: e.target.value })} style={{ width: '100%', padding: '0.4rem 0.5rem', border: '1px solid #d1d5db', borderRadius: '6px', fontSize: '0.875rem' }}>
                            {STATUS_OPTIONS.map((s) => <option key={s} value={s}>{s}</option>)}
                          </select>
                        </div>
                        <button onClick={() => updateLead(lead.id, { notes })} disabled={savingId === lead.id} style={{ padding: '0.5rem', background: '#111827', color: '#fff', border: 'none', borderRadius: '6px', cursor: 'pointer', fontSize: '0.8rem', fontWeight: 600, opacity: savingId === lead.id ? 0.6 : 1 }}>
                          {savingId === lead.id ? 'Saving…' : 'Save Notes'}
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

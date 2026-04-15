import { useState } from 'react';
import AdminLayout from '../../components/admin/AdminLayout';
import StatusBadge from '../../components/admin/StatusBadge';
import { useCollection } from '../../hooks/useFirestore';
import { auth } from '../../lib/firebase';

const TABS = ['pending', 'approved', 'rejected'];

export default function AdminWallOfCool() {
  const { docs: submissions, loading } = useCollection('wall_of_cool', 'submittedAt');
  const [activeTab, setActiveTab] = useState('pending');
  const [updating, setUpdating] = useState(null);

  async function setStatus(id, status) {
    setUpdating(id);
    try {
      const token = await auth.currentUser?.getIdToken();
      await fetch(`/api/wall-of-cool/${id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify({ status }),
      });
    } finally {
      setUpdating(null);
    }
  }

  function formatDate(ts) {
    if (!ts) return '—';
    const d = ts.toDate ? ts.toDate() : new Date(ts);
    return d.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });
  }

  const counts = TABS.reduce((acc, t) => {
    acc[t] = submissions.filter((s) => s.status === t).length;
    return acc;
  }, {});

  const filtered = submissions.filter((s) => s.status === activeTab);

  return (
    <AdminLayout>
      <h1 style={{ fontSize: '1.5rem', fontWeight: 700, color: '#111827', marginBottom: '1rem' }}>Wall of Cool</h1>

      <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1.5rem', borderBottom: '2px solid #e5e7eb' }}>
        {TABS.map((tab) => (
          <button key={tab} onClick={() => setActiveTab(tab)} style={{ padding: '0.5rem 1.25rem', border: 'none', background: 'none', cursor: 'pointer', fontSize: '0.875rem', fontWeight: 600, color: activeTab === tab ? '#111827' : '#6b7280', borderBottom: activeTab === tab ? '2px solid #111827' : '2px solid transparent', marginBottom: '-2px', textTransform: 'capitalize' }}>
            {tab} ({counts[tab]})
          </button>
        ))}
      </div>

      {loading ? (
        <p style={{ color: '#6b7280' }}>Loading…</p>
      ) : filtered.length === 0 ? (
        <p style={{ color: '#6b7280' }}>No {activeTab} submissions.</p>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: '1rem' }}>
          {filtered.map((sub) => (
            <div key={sub.id} style={{ background: '#fff', border: '1px solid #e5e7eb', borderRadius: '8px', overflow: 'hidden' }}>
              <img src={sub.imageUrl} alt={sub.caption || sub.userName} style={{ width: '100%', height: '180px', objectFit: 'cover', display: 'block' }} />
              <div style={{ padding: '0.75rem' }}>
                <div style={{ fontWeight: 600, fontSize: '0.875rem', color: '#111827', marginBottom: '0.2rem' }}>{sub.userName}</div>
                {sub.caption && <p style={{ fontSize: '0.8rem', color: '#6b7280', margin: '0 0 0.5rem', lineHeight: 1.4 }}>{sub.caption}</p>}
                <div style={{ fontSize: '0.75rem', color: '#9ca3af', marginBottom: '0.75rem' }}>{formatDate(sub.submittedAt)}</div>
                <div style={{ display: 'flex', gap: '0.5rem' }}>
                  {activeTab !== 'approved' && (
                    <button onClick={() => setStatus(sub.id, 'approved')} disabled={updating === sub.id} style={{ flex: 1, padding: '0.4rem', background: '#d1fae5', color: '#065f46', border: 'none', borderRadius: '5px', cursor: 'pointer', fontWeight: 600, fontSize: '0.8rem' }}>
                      {updating === sub.id ? '…' : 'Approve'}
                    </button>
                  )}
                  {activeTab !== 'rejected' && (
                    <button onClick={() => setStatus(sub.id, 'rejected')} disabled={updating === sub.id} style={{ flex: 1, padding: '0.4rem', background: '#fee2e2', color: '#991b1b', border: 'none', borderRadius: '5px', cursor: 'pointer', fontWeight: 600, fontSize: '0.8rem' }}>
                      {updating === sub.id ? '…' : 'Reject'}
                    </button>
                  )}
                  {activeTab !== 'pending' && (
                    <button onClick={() => setStatus(sub.id, 'pending')} disabled={updating === sub.id} style={{ flex: 1, padding: '0.4rem', background: '#f3f4f6', color: '#374151', border: 'none', borderRadius: '5px', cursor: 'pointer', fontWeight: 600, fontSize: '0.8rem' }}>
                      {updating === sub.id ? '…' : 'Reset'}
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </AdminLayout>
  );
}

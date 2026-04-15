import { useState } from 'react';
import { Link } from 'react-router-dom';
import AdminLayout from '../../components/admin/AdminLayout';
import StatusBadge from '../../components/admin/StatusBadge';
import { useCollection, deleteDocById } from '../../hooks/useFirestore';

export default function AdminListings() {
  const { docs: listings, loading } = useCollection('listings');
  const [deleting, setDeleting] = useState(null);

  async function handleDelete(id) {
    if (!window.confirm('Delete this listing? This cannot be undone.')) return;
    setDeleting(id);
    try {
      await deleteDocById('listings', id);
    } finally {
      setDeleting(null);
    }
  }

  return (
    <AdminLayout>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
        <h1 style={{ fontSize: '1.5rem', fontWeight: 700, color: '#111827' }}>Aircraft Listings</h1>
        <Link
          to="/admin/listings/new"
          style={{
            background: '#111827', color: '#fff', padding: '0.5rem 1rem',
            borderRadius: '6px', textDecoration: 'none', fontSize: '0.875rem', fontWeight: 600,
          }}
        >
          + New Listing
        </Link>
      </div>

      {loading ? (
        <p style={{ color: '#6b7280' }}>Loading…</p>
      ) : listings.length === 0 ? (
        <p style={{ color: '#6b7280' }}>No listings yet.</p>
      ) : (
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.875rem' }}>
            <thead>
              <tr style={{ borderBottom: '2px solid #e5e7eb' }}>
                {['Model', 'Reg', 'Year', 'Price', 'Status', 'Featured', ''].map((h) => (
                  <th key={h} style={{ padding: '0.75rem 1rem', textAlign: 'left', color: '#374151', fontWeight: 600 }}>
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {listings.map((l) => (
                <tr key={l.id} style={{ borderBottom: '1px solid #f3f4f6' }}>
                  <td style={{ padding: '0.75rem 1rem', fontWeight: 500, color: '#111827' }}>{l.model}</td>
                  <td style={{ padding: '0.75rem 1rem', color: '#6b7280', fontFamily: 'monospace' }}>{l.registration}</td>
                  <td style={{ padding: '0.75rem 1rem', color: '#6b7280' }}>{l.year}</td>
                  <td style={{ padding: '0.75rem 1rem', color: '#111827' }}>{l.priceDisplay}</td>
                  <td style={{ padding: '0.75rem 1rem' }}>
                    <StatusBadge status={l.status} />
                  </td>
                  <td style={{ padding: '0.75rem 1rem', textAlign: 'center' }}>
                    {l.featured ? '★' : ''}
                  </td>
                  <td style={{ padding: '0.75rem 1rem', whiteSpace: 'nowrap' }}>
                    <Link
                      to={`/admin/listings/${l.id}`}
                      style={{ color: '#2563eb', textDecoration: 'none', marginRight: '1rem', fontWeight: 500 }}
                    >
                      Edit
                    </Link>
                    <button
                      onClick={() => handleDelete(l.id)}
                      disabled={deleting === l.id}
                      style={{
                        background: 'none', border: 'none', color: '#dc2626',
                        cursor: 'pointer', fontWeight: 500, fontSize: '0.875rem',
                      }}
                    >
                      {deleting === l.id ? 'Deleting…' : 'Delete'}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </AdminLayout>
  );
}

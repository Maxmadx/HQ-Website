import { useState } from 'react';
import { Link } from 'react-router-dom';
import AdminLayout from '../../components/admin/AdminLayout';
import { useCollection, deleteDocById } from '../../hooks/useFirestore';

export default function AdminMiscItems() {
  const { docs: items, loading } = useCollection('misc_items');
  const [deleting, setDeleting] = useState(null);

  async function handleDelete(id) {
    if (!window.confirm('Delete this item? This cannot be undone.')) return;
    setDeleting(id);
    try {
      await deleteDocById('misc_items', id);
    } finally {
      setDeleting(null);
    }
  }

  return (
    <AdminLayout>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
        <h1 style={{ fontSize: '1.5rem', fontWeight: 700, color: '#111827' }}>Miscellaneous Items</h1>
        <Link
          to="/admin/misc/new"
          style={{
            background: '#111827', color: '#fff', padding: '0.5rem 1rem',
            borderRadius: '6px', textDecoration: 'none', fontSize: '0.875rem', fontWeight: 600,
          }}
        >
          + New Item
        </Link>
      </div>

      {loading ? (
        <p style={{ color: '#6b7280' }}>Loading…</p>
      ) : items.length === 0 ? (
        <p style={{ color: '#6b7280' }}>No items yet. Click "+ New Item" to add one.</p>
      ) : (
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.875rem' }}>
            <thead>
              <tr style={{ borderBottom: '2px solid #e5e7eb' }}>
                {['Name', 'Category', 'Price', 'Condition', ''].map((h) => (
                  <th key={h} style={{ padding: '0.75rem 1rem', textAlign: 'left', color: '#374151', fontWeight: 600 }}>
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {items.map((item) => (
                <tr key={item.id} style={{ borderBottom: '1px solid #f3f4f6' }}>
                  <td style={{ padding: '0.75rem 1rem', fontWeight: 500, color: '#111827' }}>{item.name}</td>
                  <td style={{ padding: '0.75rem 1rem', color: '#6b7280' }}>{item.category}</td>
                  <td style={{ padding: '0.75rem 1rem', color: '#111827' }}>{item.priceDisplay || '—'}</td>
                  <td style={{ padding: '0.75rem 1rem', color: '#6b7280' }}>
                    {item.condition === 'used' ? 'Used' : 'New'}
                  </td>
                  <td style={{ padding: '0.75rem 1rem', whiteSpace: 'nowrap' }}>
                    <Link
                      to={`/admin/misc/${item.id}`}
                      style={{ color: '#2563eb', textDecoration: 'none', marginRight: '1rem', fontWeight: 500 }}
                    >
                      Edit
                    </Link>
                    <button
                      onClick={() => handleDelete(item.id)}
                      disabled={deleting === item.id}
                      style={{
                        background: 'none', border: 'none', color: '#dc2626',
                        cursor: 'pointer', fontWeight: 500, fontSize: '0.875rem',
                      }}
                    >
                      {deleting === item.id ? 'Deleting…' : 'Delete'}
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

import { useState } from 'react';
import { Link } from 'react-router-dom';
import AdminLayout from '../../components/admin/AdminLayout';
import StatusBadge from '../../components/admin/StatusBadge';
import { useCollection, deleteDocById } from '../../hooks/useFirestore';

export default function AdminBlog() {
  const { docs: posts, loading } = useCollection('blog_posts');
  const [deleting, setDeleting] = useState(null);

  async function handleDelete(id) {
    if (!window.confirm('Delete this post? This cannot be undone.')) return;
    setDeleting(id);
    try {
      await deleteDocById('blog_posts', id);
    } finally {
      setDeleting(null);
    }
  }

  function formatDate(ts) {
    if (!ts) return '—';
    const d = ts.toDate ? ts.toDate() : new Date(ts);
    return d.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });
  }

  return (
    <AdminLayout>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
        <h1 style={{ fontSize: '1.5rem', fontWeight: 700, color: '#111827' }}>Blog Posts</h1>
        <Link
          to="/admin/blog/new"
          style={{
            background: '#111827', color: '#fff', padding: '0.5rem 1rem',
            borderRadius: '6px', textDecoration: 'none', fontSize: '0.875rem', fontWeight: 600,
          }}
        >
          + New Post
        </Link>
      </div>

      {loading ? (
        <p style={{ color: '#6b7280' }}>Loading…</p>
      ) : posts.length === 0 ? (
        <p style={{ color: '#6b7280' }}>No posts yet.</p>
      ) : (
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.875rem' }}>
            <thead>
              <tr style={{ borderBottom: '2px solid #e5e7eb' }}>
                {['Title', 'Slug', 'Status', 'Published', ''].map((h) => (
                  <th key={h} style={{ padding: '0.75rem 1rem', textAlign: 'left', color: '#374151', fontWeight: 600 }}>
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {posts.map((p) => (
                <tr key={p.id} style={{ borderBottom: '1px solid #f3f4f6' }}>
                  <td style={{ padding: '0.75rem 1rem', fontWeight: 500, color: '#111827', maxWidth: '260px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{p.title}</td>
                  <td style={{ padding: '0.75rem 1rem', color: '#6b7280', fontFamily: 'monospace', fontSize: '0.8rem' }}>{p.slug}</td>
                  <td style={{ padding: '0.75rem 1rem' }}><StatusBadge status={p.status} /></td>
                  <td style={{ padding: '0.75rem 1rem', color: '#6b7280' }}>{formatDate(p.publishedAt)}</td>
                  <td style={{ padding: '0.75rem 1rem', whiteSpace: 'nowrap' }}>
                    <Link to={`/admin/blog/${p.id}`} style={{ color: '#2563eb', textDecoration: 'none', marginRight: '1rem', fontWeight: 500 }}>
                      Edit
                    </Link>
                    <button
                      onClick={() => handleDelete(p.id)}
                      disabled={deleting === p.id}
                      style={{ background: 'none', border: 'none', color: '#dc2626', cursor: 'pointer', fontWeight: 500, fontSize: '0.875rem' }}
                    >
                      {deleting === p.id ? 'Deleting…' : 'Delete'}
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

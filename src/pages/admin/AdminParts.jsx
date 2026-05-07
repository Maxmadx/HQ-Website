import { useState } from 'react';
import { Link } from 'react-router-dom';
import AdminLayout from '../../components/admin/AdminLayout';
import { useCollection } from '../../hooks/useFirestore';
import { CATEGORIES, CONDITIONS, STATUSES } from '../../lib/partsSchema';

export default function AdminParts() {
  const { docs: parts, loading } = useCollection('parts');
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterCategory, setFilterCategory] = useState('all');
  const [filterCondition, setFilterCondition] = useState('all');
  const [search, setSearch] = useState('');

  const filtered = parts.filter((p) => {
    if (filterStatus !== 'all' && p.status !== filterStatus) return false;
    if (filterCategory !== 'all' && p.category !== filterCategory) return false;
    if (filterCondition !== 'all' && p.condition !== filterCondition) return false;
    if (search) {
      const q = search.toLowerCase();
      if (!p.partNumber?.toLowerCase().includes(q) && !p.title?.toLowerCase().includes(q)) return false;
    }
    return true;
  });

  return (
    <AdminLayout>
      <div style={{ marginBottom: '1.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h1 style={{ fontSize: '1.5rem', fontWeight: 700, color: '#111827', margin: 0 }}>Parts</h1>
        <Link to="/admin/parts/new" style={{ padding: '0.5rem 1rem', background: '#111827', color: '#fff', borderRadius: '6px', textDecoration: 'none', fontSize: '0.85rem', fontWeight: 600 }}>+ New Listing</Link>
      </div>

      <div style={{ display: 'flex', gap: '0.75rem', marginBottom: '1rem', flexWrap: 'wrap' }}>
        <input
          type="search"
          placeholder="Search by PN or title…"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          style={{ flex: '1 1 220px', padding: '0.5rem 0.75rem', border: '1px solid #d1d5db', borderRadius: '6px', fontSize: '0.875rem' }}
        />
        <select value={filterCategory} onChange={(e) => setFilterCategory(e.target.value)} style={{ padding: '0.5rem 0.75rem', border: '1px solid #d1d5db', borderRadius: '6px', fontSize: '0.875rem' }}>
          <option value="all">All categories</option>
          {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
        </select>
        <select value={filterCondition} onChange={(e) => setFilterCondition(e.target.value)} style={{ padding: '0.5rem 0.75rem', border: '1px solid #d1d5db', borderRadius: '6px', fontSize: '0.875rem' }}>
          <option value="all">All conditions</option>
          {CONDITIONS.map((c) => <option key={c} value={c}>{c}</option>)}
        </select>
        <select value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)} style={{ padding: '0.5rem 0.75rem', border: '1px solid #d1d5db', borderRadius: '6px', fontSize: '0.875rem' }}>
          <option value="all">All statuses</option>
          {STATUSES.map((s) => <option key={s} value={s}>{s}</option>)}
        </select>
      </div>

      {loading ? (
        <p style={{ color: '#6b7280' }}>Loading…</p>
      ) : filtered.length === 0 ? (
        <p style={{ color: '#6b7280' }}>No listings. Click <em>+ New Listing</em> to add one.</p>
      ) : (
        <div style={{ background: '#fff', border: '1px solid #e5e7eb', borderRadius: '8px', overflow: 'hidden' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '110px 1fr 100px 90px 110px 80px 80px', gap: '0.75rem', padding: '0.6rem 1rem', background: '#f9fafb', fontSize: '0.75rem', fontWeight: 600, color: '#6b7280', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
            <div>PN</div><div>Title</div><div>Category</div><div>Condition</div><div>Price</div><div>Stock</div><div>Status</div>
          </div>
          {filtered.map((p) => (
            <Link key={p.id} to={`/admin/parts/${p.id}`} style={{ display: 'grid', gridTemplateColumns: '110px 1fr 100px 90px 110px 80px 80px', gap: '0.75rem', padding: '0.75rem 1rem', borderTop: '1px solid #f3f4f6', textDecoration: 'none', color: '#111827', fontSize: '0.875rem' }}>
              <div style={{ fontFamily: 'monospace', fontSize: '0.8rem' }}>{p.partNumber}</div>
              <div style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{p.title}</div>
              <div style={{ color: '#6b7280' }}>{p.category}</div>
              <div style={{ color: '#6b7280' }}>{p.condition}</div>
              <div>{p.priceDisplay || 'POA'}</div>
              <div style={{ color: p.stock > 0 ? '#111827' : '#9ca3af' }}>{p.hasQuantity ? p.stock : '—'}</div>
              <div style={{ color: p.status === 'active' ? '#16a34a' : '#9ca3af', fontSize: '0.75rem' }}>{p.status}</div>
            </Link>
          ))}
        </div>
      )}
    </AdminLayout>
  );
}

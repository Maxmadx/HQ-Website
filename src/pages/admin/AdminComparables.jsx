import { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import AdminLayout from '../../components/admin/AdminLayout';
import { useCollection, deleteDocById, updateDocById, useDocument, createDoc } from '../../hooks/useFirestore';
import { setDoc, doc, serverTimestamp } from 'firebase/firestore';
import { db } from '../../lib/firebase';
import { CLASSES, CONFIDENCE, MARKET_STATUS } from '../../lib/comparablesSchema';

function ProvenancePill({ confidence }) {
  const isVerified = confidence === 'verified';
  return (
    <span style={{
      background: isVerified ? '#e8f0e8' : '#fff4e0',
      color: isVerified ? '#2a652a' : '#a06a00',
      padding: '0.1rem 0.45rem',
      fontSize: '0.7rem',
      fontWeight: 600,
      borderRadius: '2px',
    }}>
      {confidence || 'estimate'}
    </span>
  );
}

function DefaultsModal({ open, defaults, onClose }) {
  const [avgas, setAvgas] = useState(defaults?.fuelPrice?.avgas100llGbpPerGal ?? 8.5);
  const [jet, setJet] = useState(defaults?.fuelPrice?.jetA1GbpPerGal ?? 7.8);
  const [hours, setHours] = useState(defaults?.defaults?.hoursPerYear ?? 100);
  const [years, setYears] = useState(defaults?.defaults?.yearsOfOwnership ?? 5);
  const [saving, setSaving] = useState(false);

  if (!open) return null;

  async function handleSave() {
    setSaving(true);
    try {
      const ref = doc(db, 'comparison_defaults', 'global');
      await setDoc(ref, {
        fuelPrice: {
          avgas100llGbpPerGal: Number(avgas),
          jetA1GbpPerGal: Number(jet),
        },
        defaults: {
          hoursPerYear: Number(hours),
          yearsOfOwnership: Number(years),
        },
        updatedAt: serverTimestamp(),
      });
      onClose();
    } finally {
      setSaving(false);
    }
  }

  return (
    <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.4)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 100 }} onClick={onClose}>
      <div style={{ background: '#fff', padding: '1.5rem', maxWidth: '24rem', width: '100%', borderRadius: '6px' }} onClick={(e) => e.stopPropagation()}>
        <h3 style={{ margin: 0, marginBottom: '0.4rem' }}>Comparison defaults</h3>
        <p style={{ fontSize: '0.78rem', opacity: 0.6, marginTop: 0 }}>
          Editing fuel prices recomputes TCO for every aircraft on /aircraft-comparison instantly.
        </p>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.6rem' }}>
          <label style={{ fontSize: '0.7rem', opacity: 0.7 }}>
            Avgas 100LL £/gal
            <input type="number" step="0.01" value={avgas} onChange={(e) => setAvgas(e.target.value)} style={{ width: '100%', padding: '0.4rem', marginTop: '0.2rem' }} />
          </label>
          <label style={{ fontSize: '0.7rem', opacity: 0.7 }}>
            Jet A-1 £/gal
            <input type="number" step="0.01" value={jet} onChange={(e) => setJet(e.target.value)} style={{ width: '100%', padding: '0.4rem', marginTop: '0.2rem' }} />
          </label>
          <label style={{ fontSize: '0.7rem', opacity: 0.7 }}>
            Default hours/yr
            <input type="number" value={hours} onChange={(e) => setHours(e.target.value)} style={{ width: '100%', padding: '0.4rem', marginTop: '0.2rem' }} />
          </label>
          <label style={{ fontSize: '0.7rem', opacity: 0.7 }}>
            Default years
            <input type="number" value={years} onChange={(e) => setYears(e.target.value)} style={{ width: '100%', padding: '0.4rem', marginTop: '0.2rem' }} />
          </label>
        </div>
        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.4rem', marginTop: '1rem' }}>
          <button onClick={onClose} style={{ background: '#fff', border: '1px solid #ccc', padding: '0.5rem 0.9rem', cursor: 'pointer' }}>Cancel</button>
          <button onClick={handleSave} disabled={saving} style={{ background: '#222', color: '#fff', border: 'none', padding: '0.5rem 0.9rem', cursor: 'pointer' }}>
            {saving ? 'Saving…' : 'Save'}
          </button>
        </div>
      </div>
    </div>
  );
}

export default function AdminComparables() {
  const { docs: comparables, loading } = useCollection('comparables', 'manufacturer');
  const { data: defaults } = useDocument('comparison_defaults', 'global');
  const [filterClass, setFilterClass] = useState('');
  const [filterSource, setFilterSource] = useState('');
  const [filterStatus, setFilterStatus] = useState('');
  const [defaultsOpen, setDefaultsOpen] = useState(false);
  const [deleting, setDeleting] = useState(null);

  const rows = useMemo(() => {
    return comparables.filter((c) => {
      if (filterClass && c.class !== filterClass) return false;
      if (filterSource && c.costsConfidence !== filterSource) return false;
      if (filterStatus && c.marketStatus !== filterStatus) return false;
      return true;
    });
  }, [comparables, filterClass, filterSource, filterStatus]);

  async function handleDelete(id, model) {
    if (!window.confirm(`Delete ${model}?\n\nThe aircraft disappears from /aircraft-comparison. Inbound URL links with this slug will silently break.`)) return;
    setDeleting(id);
    try {
      await deleteDocById('comparables', id);
    } finally {
      setDeleting(null);
    }
  }

  return (
    <AdminLayout>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
        <div>
          <h1 style={{ fontSize: '1.5rem', fontWeight: 700, color: '#111827', margin: 0 }}>Comparables</h1>
          <p style={{ fontSize: '0.78rem', color: '#6b7280', margin: '0.2rem 0 0' }}>
            Aircraft data shown on /aircraft-comparison · {comparables.length} aircraft
          </p>
        </div>
        <div style={{ display: 'flex', gap: '0.4rem' }}>
          <button onClick={() => setDefaultsOpen(true)} style={{ background: '#fff', border: '1px solid #ccc', color: '#222', padding: '0.5rem 1rem', borderRadius: '6px', fontSize: '0.875rem', cursor: 'pointer' }}>
            ⚙ Edit defaults
          </button>
          <Link to="/admin/comparables/new" style={{ background: '#111827', color: '#fff', padding: '0.5rem 1rem', borderRadius: '6px', textDecoration: 'none', fontSize: '0.875rem', fontWeight: 600 }}>
            + Add aircraft
          </Link>
        </div>
      </div>

      <div style={{ display: 'flex', gap: '0.6rem', marginBottom: '1rem', fontSize: '0.85rem' }}>
        <select value={filterClass} onChange={(e) => setFilterClass(e.target.value)}>
          <option value="">All classes</option>
          {CLASSES.map((c) => <option key={c.id} value={c.id}>{c.label}</option>)}
        </select>
        <select value={filterSource} onChange={(e) => setFilterSource(e.target.value)}>
          <option value="">All sources</option>
          {CONFIDENCE.map((c) => <option key={c} value={c}>{c}</option>)}
        </select>
        <select value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)}>
          <option value="">All statuses</option>
          {MARKET_STATUS.map((s) => <option key={s} value={s}>{s}</option>)}
        </select>
      </div>

      {loading ? <p style={{ color: '#6b7280' }}>Loading…</p> : rows.length === 0 ? (
        <p style={{ color: '#6b7280' }}>No aircraft yet — add one to get started.</p>
      ) : (
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.875rem' }}>
            <thead>
              <tr style={{ borderBottom: '2px solid #e5e7eb' }}>
                {['Model', 'Manufacturer', 'Class', 'Status', 'Source', 'Last updated', ''].map((h) => (
                  <th key={h} style={{ padding: '0.7rem 1rem', textAlign: 'left', color: '#374151', fontWeight: 600 }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {rows.map((c) => (
                <tr key={c.id} style={{ borderBottom: '1px solid #f3f4f6' }}>
                  <td style={{ padding: '0.6rem 1rem', fontWeight: 500 }}>{c.model}</td>
                  <td style={{ padding: '0.6rem 1rem', color: '#6b7280' }}>{c.manufacturer}</td>
                  <td style={{ padding: '0.6rem 1rem', color: '#6b7280' }}>
                    {CLASSES.find((cls) => cls.id === c.class)?.label || c.class}
                  </td>
                  <td style={{ padding: '0.6rem 1rem', color: '#6b7280', fontSize: '0.78rem' }}>
                    {c.marketStatus === 'used-only' ? 'Used only' : 'In production'}
                  </td>
                  <td style={{ padding: '0.6rem 1rem' }}><ProvenancePill confidence={c.costsConfidence} /></td>
                  <td style={{ padding: '0.6rem 1rem', color: '#6b7280', fontSize: '0.78rem' }}>
                    {c.updatedAt?.toDate ? c.updatedAt.toDate().toISOString().slice(0, 10) : '—'}
                  </td>
                  <td style={{ padding: '0.6rem 1rem', whiteSpace: 'nowrap' }}>
                    <Link to={`/admin/comparables/${c.id}`} style={{ color: '#2563eb', textDecoration: 'none', marginRight: '1rem', fontWeight: 500 }}>Edit</Link>
                    <button onClick={() => handleDelete(c.id, c.model)} disabled={deleting === c.id} style={{ background: 'none', border: 'none', color: '#dc2626', cursor: 'pointer', fontWeight: 500, fontSize: '0.875rem' }}>
                      {deleting === c.id ? 'Deleting…' : 'Delete'}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <DefaultsModal open={defaultsOpen} defaults={defaults} onClose={() => setDefaultsOpen(false)} />
    </AdminLayout>
  );
}

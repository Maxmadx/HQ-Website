import { useState } from 'react';
import AdminLayout from '../../components/admin/AdminLayout';
import { useCollection, updateDocById, createDoc, deleteDocById } from '../../hooks/useFirestore';

// Only categories actively displayed on the website
const CATEGORIES = [
  {
    id: 'discovery',
    label: 'Discovery & Dual Instruction Prices',
    hint: 'Displayed on the Discovery Flight booking page. Discovery = 30 min trial flight. Dual Instruction = 60 min lesson. These prices are charged via Stripe on booking.',
  },
  {
    id: 'london_tour',
    label: 'Helicopter Tour of London Prices',
    hint: 'Displayed on the Helicopter Tour of London booking page. Shared = per-person price × passenger count. Private = flat charter price. Charged via Stripe on booking.',
  },
  {
    id: 'sfh',
    label: 'Self-Fly Hire Tab — Hourly Rates',
    hint: 'Displayed in the Self-Fly Hire tab of Rates & Pricing. Wet rate = standard hourly rate including fuel. Not charged via Stripe.',
  },
];

// Whitelist of IDs that are actually displayed on the website
const WEBSITE_IDS = new Set([
  'discovery_r22_30min', 'discovery_r22_60min',
  'discovery_r44_30min', 'discovery_r44_60min',
  'discovery_r66_30min', 'discovery_r66_60min',
  'london_tour_shared_day', 'london_tour_shared_sunset', 'london_tour_shared_night',
  'london_tour_private_day', 'london_tour_private_sunset', 'london_tour_private_night',
  'sfh_r22_wet', 'sfh_r44_wet', 'sfh_r66_wet',
]);

const CATEGORY_IDS = CATEGORIES.map((c) => c.id);
const EMPTY_NEW = { label: '', price: '', description: '', category: 'discovery' };

// Stripe badge categories
const STRIPE_CATEGORIES = new Set(['discovery', 'london_tour']);

// Convert pence stored in Firestore → pounds string shown in inputs
function penceToPounds(pence) {
  return String(pence / 100);
}

// Convert pounds string from input → pence integer stored in Firestore
function poundsToAppence(str) {
  return Math.round((parseFloat(str) || 0) * 100);
}

// Format pence for display in the table (e.g. 27500 → £275, 1600000 → £16,000)
function displayPrice(pence) {
  return '£' + (pence / 100).toLocaleString('en-GB', { minimumFractionDigits: 0, maximumFractionDigits: 0 });
}

const fieldStyle = {
  width: '100%', padding: '0.35rem 0.5rem', border: '1px solid #d1d5db',
  borderRadius: '4px', fontSize: '0.8rem', color: '#111827', boxSizing: 'border-box',
};

export default function AdminPricing() {
  const { docs: items, loading } = useCollection('pricing', 'category');
  const [editing,  setEditing]  = useState({});
  const [saving,   setSaving]   = useState(null);
  const [adding,   setAdding]   = useState(false);
  const [newItem,  setNewItem]  = useState(EMPTY_NEW);
  const [creating, setCreating] = useState(false);
  const [deleting, setDeleting] = useState(null);

  function startEdit(item) {
    setEditing((e) => ({
      ...e,
      [item.id]: {
        price:       penceToPounds(item.price),
        label:       item.label,
        description: item.description || '',
      },
    }));
  }

  function cancelEdit(id) {
    setEditing((e) => { const next = { ...e }; delete next[id]; return next; });
  }

  async function saveEdit(id) {
    setSaving(id);
    try {
      const ed = editing[id];
      await updateDocById('pricing', id, {
        price:       poundsToAppence(ed.price),
        label:       ed.label,
        description: ed.description,
      });
      cancelEdit(id);
    } finally {
      setSaving(null);
    }
  }

  async function handleDelete(id) {
    if (!window.confirm('Delete this pricing item?')) return;
    setDeleting(id);
    try { await deleteDocById('pricing', id); }
    finally { setDeleting(null); }
  }

  async function handleCreate(e) {
    e.preventDefault();
    setCreating(true);
    try {
      await createDoc('pricing', {
        ...newItem,
        price: poundsToAppence(newItem.price),
      });
      setNewItem(EMPTY_NEW);
      setAdding(false);
    } finally {
      setCreating(false);
    }
  }

  const grouped = CATEGORY_IDS.reduce((acc, id) => {
    acc[id] = items.filter((i) => i.category === id && WEBSITE_IDS.has(i.id));
    return acc;
  }, {});

  return (
    <AdminLayout>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
        <div>
          <h1 style={{ fontSize: '1.5rem', fontWeight: 700, color: '#111827', margin: 0 }}>Pricing</h1>
          <p style={{ fontSize: '0.78rem', color: '#6b7280', margin: '4px 0 0' }}>
            All prices in pounds (£), excluding VAT. Only prices displayed on the website are shown here.
          </p>
        </div>
        <button
          onClick={() => setAdding((a) => !a)}
          style={{ background: '#111827', color: '#fff', padding: '0.5rem 1rem', border: 'none', borderRadius: '6px', fontSize: '0.875rem', fontWeight: 600, cursor: 'pointer' }}
        >
          {adding ? 'Cancel' : '+ Add Item'}
        </button>
      </div>

      {adding && (
        <form onSubmit={handleCreate} style={{ background: '#f9fafb', border: '1px solid #e5e7eb', borderRadius: '8px', padding: '1rem', marginBottom: '1.5rem', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
          <div>
            <label style={{ fontSize: '0.75rem', fontWeight: 600, color: '#374151', display: 'block', marginBottom: '2px' }}>Label</label>
            <input style={fieldStyle} value={newItem.label} onChange={(e) => setNewItem((n) => ({ ...n, label: e.target.value }))} required />
          </div>
          <div>
            <label style={{ fontSize: '0.75rem', fontWeight: 600, color: '#374151', display: 'block', marginBottom: '2px' }}>Price (£)</label>
            <input style={fieldStyle} type="number" step="0.01" min="0" placeholder="e.g. 180" value={newItem.price} onChange={(e) => setNewItem((n) => ({ ...n, price: e.target.value }))} required />
          </div>
          <div>
            <label style={{ fontSize: '0.75rem', fontWeight: 600, color: '#374151', display: 'block', marginBottom: '2px' }}>Category</label>
            <select style={fieldStyle} value={newItem.category} onChange={(e) => setNewItem((n) => ({ ...n, category: e.target.value }))}>
              {CATEGORIES.map((c) => <option key={c.id} value={c.id}>{c.label}</option>)}
            </select>
          </div>
          <div>
            <label style={{ fontSize: '0.75rem', fontWeight: 600, color: '#374151', display: 'block', marginBottom: '2px' }}>Description</label>
            <input style={fieldStyle} value={newItem.description} onChange={(e) => setNewItem((n) => ({ ...n, description: e.target.value }))} />
          </div>
          <div style={{ gridColumn: '1/-1', display: 'flex', justifyContent: 'flex-end' }}>
            <button type="submit" disabled={creating} style={{ background: '#111827', color: '#fff', padding: '0.4rem 1rem', border: 'none', borderRadius: '6px', cursor: 'pointer', fontSize: '0.8rem', fontWeight: 600 }}>
              {creating ? 'Creating…' : 'Create'}
            </button>
          </div>
        </form>
      )}

      {loading ? (
        <p style={{ color: '#6b7280' }}>Loading…</p>
      ) : (
        CATEGORIES.map((cat) => {
          const catItems = grouped[cat.id] ?? [];
          if (catItems.length === 0) return null;

          return (
            <div key={cat.id} style={{ marginBottom: '2rem' }}>
              <div style={{ marginBottom: '0.5rem' }}>
                <h2 style={{ fontSize: '0.875rem', fontWeight: 700, color: '#374151', textTransform: 'uppercase', letterSpacing: '0.08em', margin: 0 }}>
                  {cat.label}
                  {STRIPE_CATEGORIES.has(cat.id) && (
                    <span style={{ marginLeft: 8, fontSize: '0.65rem', fontWeight: 600, background: '#fef3c7', color: '#92400e', padding: '2px 7px', borderRadius: 99, textTransform: 'none', letterSpacing: 0 }}>
                      Stripe — live charges
                    </span>
                  )}
                </h2>
                {cat.hint && (
                  <p style={{ fontSize: '0.72rem', color: '#9ca3af', margin: '2px 0 0' }}>{cat.hint}</p>
                )}
              </div>
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.875rem' }}>
                <thead>
                  <tr style={{ borderBottom: '2px solid #e5e7eb' }}>
                    {['Label', 'Price', 'Description', ''].map((h) => (
                      <th key={h} style={{ padding: '0.5rem 0.75rem', textAlign: 'left', color: '#374151', fontWeight: 600 }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {catItems.map((item) => {
                    const ed = editing[item.id];
                    return (
                      <tr key={item.id} style={{ borderBottom: '1px solid #f3f4f6' }}>
                        <td style={{ padding: '0.6rem 0.75rem', color: '#111827' }}>
                          {ed
                            ? <input style={fieldStyle} value={ed.label} onChange={(e) => setEditing((x) => ({ ...x, [item.id]: { ...x[item.id], label: e.target.value } }))} />
                            : item.label}
                        </td>
                        <td style={{ padding: '0.6rem 0.75rem', color: '#111827', fontWeight: ed ? 'normal' : 600 }}>
                          {ed
                            ? (
                              <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                                <span style={{ color: '#6b7280' }}>£</span>
                                <input
                                  style={{ ...fieldStyle, width: '100px' }}
                                  type="number"
                                  step="0.01"
                                  min="0"
                                  value={ed.price}
                                  onChange={(e) => setEditing((x) => ({ ...x, [item.id]: { ...x[item.id], price: e.target.value } }))}
                                />
                              </div>
                            )
                            : displayPrice(item.price)}
                        </td>
                        <td style={{ padding: '0.6rem 0.75rem', color: '#6b7280', fontSize: '0.8rem' }}>
                          {ed
                            ? <input style={fieldStyle} value={ed.description} onChange={(e) => setEditing((x) => ({ ...x, [item.id]: { ...x[item.id], description: e.target.value } }))} />
                            : item.description}
                        </td>
                        <td style={{ padding: '0.6rem 0.75rem', whiteSpace: 'nowrap' }}>
                          {ed ? (
                            <>
                              <button onClick={() => saveEdit(item.id)} disabled={saving === item.id} style={{ background: '#111827', color: '#fff', border: 'none', borderRadius: '4px', padding: '3px 10px', cursor: 'pointer', fontSize: '0.8rem', marginRight: '0.5rem' }}>
                                {saving === item.id ? '…' : 'Save'}
                              </button>
                              <button onClick={() => cancelEdit(item.id)} style={{ background: 'none', border: '1px solid #d1d5db', borderRadius: '4px', padding: '3px 8px', cursor: 'pointer', fontSize: '0.8rem' }}>
                                Cancel
                              </button>
                            </>
                          ) : (
                            <>
                              <button onClick={() => startEdit(item)} style={{ background: 'none', border: 'none', color: '#2563eb', cursor: 'pointer', fontWeight: 500, fontSize: '0.875rem', marginRight: '0.75rem' }}>
                                Edit
                              </button>
                              <button onClick={() => handleDelete(item.id)} disabled={deleting === item.id} style={{ background: 'none', border: 'none', color: '#dc2626', cursor: 'pointer', fontWeight: 500, fontSize: '0.875rem' }}>
                                {deleting === item.id ? '…' : 'Delete'}
                              </button>
                            </>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          );
        })
      )}
    </AdminLayout>
  );
}

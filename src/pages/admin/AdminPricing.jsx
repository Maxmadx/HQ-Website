import { useState } from 'react';
import AdminLayout from '../../components/admin/AdminLayout';
import { useCollection, updateDocById, createDoc, deleteDocById, setDocById } from '../../hooks/useFirestore';
import { AIRCRAFT_CATALOG } from '../../config/aircraftCatalog';
import { aircraftPriceId } from '../../hooks/useAircraftPricing';
import { REBUILD_PRICING_DEFAULTS } from '../../config/rebuildPricingDefaults';

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
  {
    id: 'aircraft',
    label: 'Aircraft Sales — New Helicopter Pricing',
    hint: 'Displayed on the /aircraft-sales page and individual aircraft pages. Stored in USD (RHC factory currency); the site auto-converts to GBP/EUR using live ECB rates. Not charged via Stripe.',
  },
  {
    id: 'rebuilds',
    label: 'Rebuilds — Price From & Donor Range',
    hint: "Displayed on the /rebuilds page Models section. 'From' = rebuild labour starting price. Donor min/max define the donor aircraft range shown beneath each card.",
  },
];

// Whitelist of IDs that are actually displayed on the website (GBP-priced)
const GBP_WEBSITE_IDS = new Set([
  'discovery_r22_30min', 'discovery_r22_60min',
  'discovery_r44_30min', 'discovery_r44_60min',
  'discovery_r66_30min', 'discovery_r66_60min',
  'london_tour_shared_day', 'london_tour_shared_sunset', 'london_tour_shared_night',
  'london_tour_private_day', 'london_tour_private_sunset', 'london_tour_private_night',
  'sfh_r22_wet', 'sfh_r44_wet', 'sfh_r66_wet',
  'rebuild_r22_from', 'rebuild_r22_donor_min', 'rebuild_r22_donor_max',
  'rebuild_r44_from', 'rebuild_r44_donor_min', 'rebuild_r44_donor_max',
  'rebuild_r66_from', 'rebuild_r66_donor_min', 'rebuild_r66_donor_max',
]);

// Aircraft IDs are derived from the catalog — same source of truth as the website
const AIRCRAFT_ENTRIES = AIRCRAFT_CATALOG.flatMap((m) =>
  m.subtypes.map((s) => ({
    id: aircraftPriceId(m.id, s.id),
    label: `${m.name} ${s.name}`,
    description: s.description,
    defaultPriceUsd: s.priceUsd,
    modelId: m.id,
    subtypeId: s.id,
  }))
);
const AIRCRAFT_IDS = new Set(AIRCRAFT_ENTRIES.map((e) => e.id));

const CATEGORY_IDS = CATEGORIES.map((c) => c.id);
const EMPTY_NEW = { label: '', price: '', description: '', category: 'discovery' };

// Stripe badge categories
const STRIPE_CATEGORIES = new Set(['discovery', 'london_tour']);
const USD_CATEGORIES = new Set(['aircraft']);

// Convert pence stored in Firestore → pounds string shown in inputs
function penceToPounds(pence) {
  return String(pence / 100);
}

// Convert pounds string from input → pence integer stored in Firestore
function poundsToAppence(str) {
  return Math.round((parseFloat(str) || 0) * 100);
}

// Format minor units for display (e.g. 27500 GBP cents → £275, 35000000 USD cents → $350,000)
function displayPrice(item) {
  const isUsd = item?.currency === 'usd';
  const symbol = isUsd ? '$' : '£';
  const locale = isUsd ? 'en-US' : 'en-GB';
  return symbol + (item.price / 100).toLocaleString(locale, { minimumFractionDigits: 0, maximumFractionDigits: 0 });
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
  const [seeding,  setSeeding]  = useState(false);

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

  /** Seed missing aircraft pricing docs in Firestore from the catalog defaults. */
  async function seedAircraftDefaults() {
    if (!window.confirm('Create Firestore docs for any aircraft variants that are not yet stored? Existing prices will not be touched.')) return;
    setSeeding(true);
    try {
      const existing = new Set(items.filter((i) => i.category === 'aircraft').map((i) => i.id));
      const missing = AIRCRAFT_ENTRIES.filter((e) => !existing.has(e.id));
      for (const entry of missing) {
        await setDocById('pricing', entry.id, {
          category:    'aircraft',
          currency:    'usd',
          label:       entry.label,
          description: entry.description ?? '',
          price:       Math.round(entry.defaultPriceUsd * 100), // USD cents
          model_id:    entry.modelId,
          subtype_id:  entry.subtypeId,
        });
      }
    } finally {
      setSeeding(false);
    }
  }

  /** Seed missing rebuild pricing docs in Firestore from the defaults. */
  async function seedRebuildDefaults() {
    if (!window.confirm('Create Firestore docs for any rebuild prices that are not yet stored? Existing prices will not be touched.')) return;
    setSeeding(true);
    try {
      const existing = new Set(items.filter((i) => i.category === 'rebuilds').map((i) => i.id));
      const missing = REBUILD_PRICING_DEFAULTS.filter((e) => !existing.has(e.id));
      for (const entry of missing) {
        await setDocById('pricing', entry.id, {
          category:    'rebuilds',
          currency:    'gbp',
          label:       entry.label,
          description: '',
          price:       entry.defaultGbp * 100,
        });
      }
    } finally {
      setSeeding(false);
    }
  }

  const grouped = CATEGORY_IDS.reduce((acc, id) => {
    if (id === 'aircraft') {
      // Aircraft category: pull from Firestore but always render the full
      // catalog so admin sees variants that haven't been seeded yet
      const fsByid = new Map(items.filter((i) => i.category === 'aircraft').map((i) => [i.id, i]));
      acc[id] = AIRCRAFT_ENTRIES.map((entry) => fsByid.get(entry.id) ?? {
        id: entry.id,
        category: 'aircraft',
        currency: 'usd',
        label: entry.label,
        description: entry.description ?? '',
        price: Math.round(entry.defaultPriceUsd * 100),
        _isDefault: true,
      });
    } else if (id === 'rebuilds') {
      const fsByid = new Map(items.filter((i) => i.category === 'rebuilds').map((i) => [i.id, i]));
      acc[id] = REBUILD_PRICING_DEFAULTS.map((entry) => fsByid.get(entry.id) ?? {
        id: entry.id,
        category: 'rebuilds',
        currency: 'gbp',
        label: entry.label,
        description: '',
        price: entry.defaultGbp * 100,
        _isDefault: true,
      });
    } else {
      acc[id] = items.filter((i) => i.category === id && GBP_WEBSITE_IDS.has(i.id));
    }
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
          const isUsdCat = USD_CATEGORIES.has(cat.id);
          const symbol = isUsdCat ? '$' : '£';

          return (
            <div key={cat.id} style={{ marginBottom: '2rem' }}>
              <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                <div>
                  <h2 style={{ fontSize: '0.875rem', fontWeight: 700, color: '#374151', textTransform: 'uppercase', letterSpacing: '0.08em', margin: 0 }}>
                    {cat.label}
                    {STRIPE_CATEGORIES.has(cat.id) && (
                      <span style={{ marginLeft: 8, fontSize: '0.65rem', fontWeight: 600, background: '#fef3c7', color: '#92400e', padding: '2px 7px', borderRadius: 99, textTransform: 'none', letterSpacing: 0 }}>
                        Stripe — live charges
                      </span>
                    )}
                    {isUsdCat && (
                      <span style={{ marginLeft: 8, fontSize: '0.65rem', fontWeight: 600, background: '#dbeafe', color: '#1e40af', padding: '2px 7px', borderRadius: 99, textTransform: 'none', letterSpacing: 0 }}>
                        USD — auto-converted to GBP/EUR
                      </span>
                    )}
                  </h2>
                  {cat.hint && (
                    <p style={{ fontSize: '0.72rem', color: '#9ca3af', margin: '2px 0 0' }}>{cat.hint}</p>
                  )}
                </div>
                {(cat.id === 'aircraft' || cat.id === 'rebuilds') && catItems.some((i) => i._isDefault) && (
                  <button
                    onClick={cat.id === 'aircraft' ? seedAircraftDefaults : seedRebuildDefaults}
                    disabled={seeding}
                    style={{ background: '#111827', color: '#fff', padding: '0.4rem 0.85rem', border: 'none', borderRadius: '6px', fontSize: '0.75rem', fontWeight: 600, cursor: 'pointer' }}
                  >
                    {seeding ? 'Seeding…' : 'Seed missing prices to Firestore'}
                  </button>
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
                    const isDefault = item._isDefault;
                    return (
                      <tr key={item.id} style={{ borderBottom: '1px solid #f3f4f6', opacity: isDefault ? 0.7 : 1 }}>
                        <td style={{ padding: '0.6rem 0.75rem', color: '#111827' }}>
                          {ed && !isDefault
                            ? <input style={fieldStyle} value={ed.label} onChange={(e) => setEditing((x) => ({ ...x, [item.id]: { ...x[item.id], label: e.target.value } }))} />
                            : (
                              <>
                                {item.label}
                                {isDefault && <span style={{ marginLeft: 6, fontSize: '0.65rem', color: '#9ca3af', fontStyle: 'italic' }}>(default — not yet in Firestore)</span>}
                              </>
                            )}
                        </td>
                        <td style={{ padding: '0.6rem 0.75rem', color: '#111827', fontWeight: ed ? 'normal' : 600 }}>
                          {ed && !isDefault
                            ? (
                              <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                                <span style={{ color: '#6b7280' }}>{symbol}</span>
                                <input
                                  style={{ ...fieldStyle, width: '120px' }}
                                  type="number"
                                  step="1"
                                  min="0"
                                  value={ed.price}
                                  onChange={(e) => setEditing((x) => ({ ...x, [item.id]: { ...x[item.id], price: e.target.value } }))}
                                />
                              </div>
                            )
                            : displayPrice(item)}
                        </td>
                        <td style={{ padding: '0.6rem 0.75rem', color: '#6b7280', fontSize: '0.8rem' }}>
                          {ed && !isDefault
                            ? <input style={fieldStyle} value={ed.description} onChange={(e) => setEditing((x) => ({ ...x, [item.id]: { ...x[item.id], description: e.target.value } }))} />
                            : item.description}
                        </td>
                        <td style={{ padding: '0.6rem 0.75rem', whiteSpace: 'nowrap' }}>
                          {isDefault ? (
                            <span style={{ fontSize: '0.75rem', color: '#9ca3af' }}>Click "Seed" to enable editing</span>
                          ) : ed ? (
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
                              {cat.id !== 'aircraft' && cat.id !== 'rebuilds' && (
                                <button onClick={() => handleDelete(item.id)} disabled={deleting === item.id} style={{ background: 'none', border: 'none', color: '#dc2626', cursor: 'pointer', fontWeight: 500, fontSize: '0.875rem' }}>
                                  {deleting === item.id ? '…' : 'Delete'}
                                </button>
                              )}
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

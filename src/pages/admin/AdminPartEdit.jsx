import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import AdminLayout from '../../components/admin/AdminLayout';
import MediaLibraryPicker from '../../components/admin/MediaLibraryPicker';
import { useDocument, createDoc, updateDocById, deleteDocById } from '../../hooks/useFirestore';
import { partSchema, poundsToPence, penceToPounds, formatPriceDisplay, CONDITIONS, CATEGORIES, AIRCRAFT, STATUSES } from '../../lib/partsSchema';

// Form state holds price as a pounds-with-decimals string ("14000.50").
// On save, converted to integer pence via poundsToPence.
const EMPTY = {
  partNumber: '',
  mfgPartNumber: '',
  title: '',
  description: '',
  category: 'rotor',
  aircraftCompat: [],
  images: [], // [{url, alt, isPrimary}]
  status: 'active',
  condition: 'new',
  priceGbpInput: '',          // string for the form input
  coreChargeGbpInput: '',     // string, only used when condition === 'exchange'
  leadTimeDays: 0,
  hasQuantity: true,
  stock: 1,
  requiresShipping: true,
  airworthinessLifeLimited: false,
  exportControlled: false,
  notes: '',
};

// Map a stored part doc → form state (pence → pounds-strings).
function partDocToForm(doc) {
  return {
    ...EMPTY,
    ...doc,
    images: doc.images || [],
    priceGbpInput: penceToPounds(doc.priceGbp),
    coreChargeGbpInput: penceToPounds(doc.coreChargeGbp),
    leadTimeDays: doc.leadTimeDays ?? 0,
    stock: doc.stock ?? 1,
  };
}

export default function AdminPartEdit() {
  const { id } = useParams();
  const navigate = useNavigate();
  const isNew = !id || id === 'new';
  const { data: existing, loading } = useDocument('parts', isNew ? null : id);
  const [form, setForm] = useState(EMPTY);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);
  const [pickerOpen, setPickerOpen] = useState(false);

  useEffect(() => {
    if (!isNew && existing) setForm(partDocToForm(existing));
  }, [isNew, existing]);

  function setField(k, v) { setForm((f) => ({ ...f, [k]: v })); }
  function toggleAircraft(a) {
    setForm((f) => ({ ...f, aircraftCompat: f.aircraftCompat.includes(a) ? f.aircraftCompat.filter((x) => x !== a) : [...f.aircraftCompat, a] }));
  }

  // MediaLibraryPicker calls onPick({ url, alt }).
  function handlePick({ url, alt }) {
    setForm((f) => {
      if (f.images.some((img) => img.url === url)) return f;
      const next = [...f.images, { url, alt: alt || '', isPrimary: false }];
      if (!next.some((i) => i.isPrimary)) next[0] = { ...next[0], isPrimary: true };
      return { ...f, images: next };
    });
    setPickerOpen(false);
  }
  function setPrimary(idx) {
    setForm((f) => ({ ...f, images: f.images.map((img, i) => ({ ...img, isPrimary: i === idx })) }));
  }
  function removeImage(idx) {
    setForm((f) => {
      const imgs = f.images.filter((_, i) => i !== idx);
      if (imgs.length > 0 && !imgs.some((i) => i.isPrimary)) imgs[0] = { ...imgs[0], isPrimary: true };
      return { ...f, images: imgs };
    });
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError(null);
    setSaving(true);
    try {
      const priceGbp = poundsToPence(form.priceGbpInput);
      const coreChargeGbp = form.condition === 'exchange' ? poundsToPence(form.coreChargeGbpInput) : null;
      const payload = {
        partNumber: form.partNumber,
        mfgPartNumber: form.mfgPartNumber,
        title: form.title,
        description: form.description,
        category: form.category,
        aircraftCompat: form.aircraftCompat,
        images: form.images,
        status: form.status,
        condition: form.condition,
        priceGbp,
        coreChargeGbp,
        priceDisplay: formatPriceDisplay(priceGbp),
        leadTimeDays: Number(form.leadTimeDays || 0),
        hasQuantity: !!form.hasQuantity,
        stock: Math.max(1, Number(form.stock || 1)),
        requiresShipping: !!form.requiresShipping,
        airworthinessLifeLimited: !!form.airworthinessLifeLimited,
        exportControlled: !!form.exportControlled,
        notes: form.notes,
      };
      const parsed = partSchema.parse(payload);
      if (isNew) {
        const newId = await createDoc('parts', parsed);
        navigate(`/admin/parts/${newId}`);
      } else {
        await updateDocById('parts', id, parsed);
        navigate('/admin/parts');
      }
    } catch (err) {
      setError(err.errors ? err.errors.map((e) => `${e.path.join('.')}: ${e.message}`).join('; ') : err.message);
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete() {
    if (!confirm(`Delete listing ${form.partNumber} — ${form.title}? This cannot be undone.`)) return;
    await deleteDocById('parts', id);
    navigate('/admin/parts');
  }

  if (!isNew && loading) return <AdminLayout><p style={{ color: '#6b7280' }}>Loading…</p></AdminLayout>;

  const fieldStyle = { width: '100%', padding: '0.5rem 0.75rem', border: '1px solid #d1d5db', borderRadius: '6px', fontSize: '0.875rem', boxSizing: 'border-box' };
  const labelStyle = { display: 'block', fontSize: '0.75rem', fontWeight: 600, color: '#374151', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.35rem' };

  return (
    <AdminLayout>
      <form onSubmit={handleSubmit} style={{ maxWidth: '800px' }}>
        <div style={{ marginBottom: '1.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h1 style={{ fontSize: '1.5rem', fontWeight: 700, color: '#111827', margin: 0 }}>{isNew ? 'New Listing' : `Edit ${form.partNumber} — ${form.title}`}</h1>
          {!isNew && <button type="button" onClick={handleDelete} style={{ padding: '0.4rem 0.9rem', background: '#fff', color: '#dc2626', border: '1px solid #dc2626', borderRadius: '6px', cursor: 'pointer', fontSize: '0.8rem' }}>Delete</button>}
        </div>

        {/* IDENTITY ----------------------------------------------------- */}
        <div style={{ background: '#fff', border: '1px solid #e5e7eb', borderRadius: '8px', padding: '1.5rem', display: 'grid', gap: '1rem', marginBottom: '1.5rem' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div>
              <label style={labelStyle}>Part Number *</label>
              <input value={form.partNumber} onChange={(e) => setField('partNumber', e.target.value)} required style={fieldStyle} placeholder="e.g. A102" />
              <p style={{ fontSize: '0.7rem', color: '#9ca3af', margin: '0.25rem 0 0' }}>Searchable; multiple listings can share a PN.</p>
            </div>
            <div>
              <label style={labelStyle}>Manufacturer PN</label>
              <input value={form.mfgPartNumber} onChange={(e) => setField('mfgPartNumber', e.target.value)} required style={fieldStyle} />
            </div>
          </div>
          <div>
            <label style={labelStyle}>Title *</label>
            <input value={form.title} onChange={(e) => setField('title', e.target.value)} required style={fieldStyle} placeholder="e.g. Tail Rotor Pitch Link" />
            <p style={{ fontSize: '0.7rem', color: '#9ca3af', margin: '0.25rem 0 0' }}>The page H1 reads "{`{partNumber} {title}`}" — make this read naturally as the second half of that phrase.</p>
          </div>
          <div>
            <label style={labelStyle}>Description</label>
            <textarea value={form.description} onChange={(e) => setField('description', e.target.value)} rows={4} style={{ ...fieldStyle, resize: 'vertical' }} placeholder="Service history, hours since overhaul, condition notes…" />
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div>
              <label style={labelStyle}>Category *</label>
              <select value={form.category} onChange={(e) => setField('category', e.target.value)} style={fieldStyle}>
                {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
            <div>
              <label style={labelStyle}>Status</label>
              <select value={form.status} onChange={(e) => setField('status', e.target.value)} style={fieldStyle}>
                {STATUSES.map((s) => <option key={s} value={s}>{s}</option>)}
              </select>
            </div>
          </div>
          <div>
            <label style={labelStyle}>Aircraft Compatibility *</label>
            <div style={{ display: 'flex', gap: '0.5rem' }}>
              {AIRCRAFT.map((a) => (
                <button type="button" key={a} onClick={() => toggleAircraft(a)} style={{ padding: '0.4rem 1rem', borderRadius: '6px', border: '1px solid', borderColor: form.aircraftCompat.includes(a) ? '#111827' : '#d1d5db', background: form.aircraftCompat.includes(a) ? '#111827' : '#fff', color: form.aircraftCompat.includes(a) ? '#fff' : '#374151', cursor: 'pointer', fontSize: '0.8rem', fontWeight: 600 }}>
                  {a.toUpperCase()}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* CONDITION + PRICING ----------------------------------------- */}
        <div style={{ background: '#fff', border: '1px solid #e5e7eb', borderRadius: '8px', padding: '1.5rem', marginBottom: '1.5rem' }}>
          <h2 style={{ fontSize: '1rem', fontWeight: 600, color: '#111827', margin: '0 0 1rem' }}>Condition & Pricing</h2>
          <p style={{ fontSize: '0.75rem', color: '#6b7280', margin: '0 0 1rem' }}>Each listing has one condition and one price. To sell A102 in both new and overhauled, create two listings.</p>
          <div style={{ display: 'grid', gridTemplateColumns: '140px 1fr 1fr 120px', gap: '0.75rem', alignItems: 'end' }}>
            <div>
              <label style={labelStyle}>Condition *</label>
              <select value={form.condition} onChange={(e) => setField('condition', e.target.value)} style={fieldStyle}>
                {CONDITIONS.map((c) => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
            <div>
              <label style={labelStyle}>Price (£)</label>
              <input type="number" min="0" step="0.01" value={form.priceGbpInput} onChange={(e) => setField('priceGbpInput', e.target.value)} placeholder="14000.00 (or leave blank for POA)" style={fieldStyle} />
            </div>
            <div>
              <label style={labelStyle}>Core Charge (£)</label>
              <input type="number" min="0" step="0.01" value={form.coreChargeGbpInput} onChange={(e) => setField('coreChargeGbpInput', e.target.value)} disabled={form.condition !== 'exchange'} placeholder={form.condition === 'exchange' ? '5000.00' : '—'} style={{ ...fieldStyle, opacity: form.condition !== 'exchange' ? 0.5 : 1 }} />
            </div>
            <div>
              <label style={labelStyle}>Lead (days)</label>
              <input type="number" min="0" step="1" value={form.leadTimeDays} onChange={(e) => setField('leadTimeDays', e.target.value)} style={fieldStyle} />
            </div>
          </div>
        </div>

        {/* STOCK + LOGISTICS ------------------------------------------- */}
        <div style={{ background: '#fff', border: '1px solid #e5e7eb', borderRadius: '8px', padding: '1.5rem', marginBottom: '1.5rem' }}>
          <h2 style={{ fontSize: '1rem', fontWeight: 600, color: '#111827', margin: '0 0 1rem' }}>Stock & Flags</h2>
          <div style={{ display: 'flex', gap: '1.5rem', marginBottom: '1rem', flexWrap: 'wrap' }}>
            <label style={{ display: 'flex', gap: '0.4rem', alignItems: 'center', fontSize: '0.85rem' }}>
              <input type="checkbox" checked={form.hasQuantity} onChange={(e) => setField('hasQuantity', e.target.checked)} />
              Has stock count
            </label>
            <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
              <label style={{ ...labelStyle, marginBottom: 0 }}>Stock</label>
              <input type="number" min="1" step="1" value={form.stock} onChange={(e) => setField('stock', e.target.value)} disabled={!form.hasQuantity} style={{ ...fieldStyle, width: '80px', opacity: form.hasQuantity ? 1 : 0.5 }} />
            </div>
            <label style={{ display: 'flex', gap: '0.4rem', alignItems: 'center', fontSize: '0.85rem' }}>
              <input type="checkbox" checked={form.requiresShipping} onChange={(e) => setField('requiresShipping', e.target.checked)} />
              Requires shipping
            </label>
          </div>
          <div style={{ display: 'flex', gap: '1.5rem', flexWrap: 'wrap' }}>
            <label style={{ display: 'flex', gap: '0.4rem', alignItems: 'center', fontSize: '0.85rem' }}>
              <input type="checkbox" checked={form.airworthinessLifeLimited} onChange={(e) => setField('airworthinessLifeLimited', e.target.checked)} />
              Life-limited
            </label>
            <label style={{ display: 'flex', gap: '0.4rem', alignItems: 'center', fontSize: '0.85rem' }}>
              <input type="checkbox" checked={form.exportControlled} onChange={(e) => setField('exportControlled', e.target.checked)} />
              Export-controlled
            </label>
          </div>
        </div>

        {/* IMAGES ------------------------------------------------------ */}
        <div style={{ background: '#fff', border: '1px solid #e5e7eb', borderRadius: '8px', padding: '1.5rem', marginBottom: '1.5rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
            <h2 style={{ fontSize: '1rem', fontWeight: 600, color: '#111827', margin: 0 }}>Images</h2>
            <button type="button" onClick={() => setPickerOpen(true)} style={{ padding: '0.4rem 0.9rem', fontSize: '0.8rem', background: '#f3f4f6', border: '1px solid #d1d5db', borderRadius: '6px', cursor: 'pointer' }}>+ Pick from media library</button>
          </div>
          {form.images.length === 0 ? (
            <p style={{ fontSize: '0.8rem', color: '#9ca3af', margin: 0 }}>No images attached. Click <em>+ Pick from media library</em> to add.</p>
          ) : (
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.75rem' }}>
              {form.images.map((img, i) => (
                <div key={img.url} style={{ position: 'relative', width: '120px' }}>
                  <img src={img.url} alt={img.alt} style={{ width: '120px', height: '80px', objectFit: 'cover', borderRadius: '6px', border: img.isPrimary ? '2px solid #2563eb' : '2px solid transparent' }} />
                  <div style={{ display: 'flex', gap: '4px', marginTop: '4px' }}>
                    <button type="button" onClick={() => setPrimary(i)} style={{ fontSize: '0.65rem', padding: '2px 6px', background: img.isPrimary ? '#2563eb' : '#e5e7eb', color: img.isPrimary ? '#fff' : '#374151', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>{img.isPrimary ? 'Primary' : 'Set Primary'}</button>
                    <button type="button" onClick={() => removeImage(i)} style={{ fontSize: '0.65rem', padding: '2px 6px', background: '#fee2e2', color: '#dc2626', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>✕</button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* INTERNAL NOTES --------------------------------------------- */}
        <div style={{ background: '#fff', border: '1px solid #e5e7eb', borderRadius: '8px', padding: '1.5rem', marginBottom: '1.5rem' }}>
          <label style={labelStyle}>Internal Notes (admin only)</label>
          <textarea value={form.notes} onChange={(e) => setField('notes', e.target.value)} rows={3} style={{ ...fieldStyle, resize: 'vertical' }} />
        </div>

        {error && <p style={{ color: '#dc2626', fontSize: '0.875rem', marginBottom: '1rem' }}>{error}</p>}

        <div style={{ display: 'flex', gap: '0.75rem' }}>
          <button type="submit" disabled={saving} style={{ padding: '0.6rem 1.5rem', background: '#111827', color: '#fff', border: 'none', borderRadius: '6px', cursor: 'pointer', fontSize: '0.875rem', fontWeight: 600, opacity: saving ? 0.6 : 1 }}>
            {saving ? 'Saving…' : isNew ? 'Create Listing' : 'Save Changes'}
          </button>
          <button type="button" onClick={() => navigate('/admin/parts')} style={{ padding: '0.6rem 1.5rem', background: '#fff', color: '#374151', border: '1px solid #d1d5db', borderRadius: '6px', cursor: 'pointer', fontSize: '0.875rem' }}>Cancel</button>
        </div>
      </form>

      <MediaLibraryPicker open={pickerOpen} onClose={() => setPickerOpen(false)} onPick={handlePick} />
    </AdminLayout>
  );
}

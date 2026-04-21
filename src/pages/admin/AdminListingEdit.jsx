import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { doc, getDoc } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import AdminLayout from '../../components/admin/AdminLayout';
import { db, storage } from '../../lib/firebase';
import { createDoc, updateDocById } from '../../hooks/useFirestore';

const EMPTY = {
  model: '',
  registration: '',
  year: new Date().getFullYear(),
  price: '',
  priceDisplay: '',
  status: 'for_sale',
  type: 'pre-owned',
  description: '',
  specs: { engine: '', serial: '', hours: '', remainingHours: '', remainingLife: '', avionics: '' },
  equipment: [],
  images: [],
  featured: false,
};

function EquipmentInput({ items, onChange, fieldStyle }) {
  const [draft, setDraft] = useState('');
  function add() {
    const trimmed = draft.trim();
    if (!trimmed) return;
    onChange([...items, trimmed]);
    setDraft('');
  }
  return (
    <div>
      <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '0.5rem' }}>
        <input
          style={{ ...fieldStyle, flex: 1 }}
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); add(); } }}
          placeholder="e.g. Garmin G500H — press Enter or Add"
        />
        <button type="button" onClick={add} style={{ padding: '0.5rem 1rem', background: '#e5e7eb', border: 'none', borderRadius: '6px', cursor: 'pointer', fontSize: '0.875rem', fontWeight: 600 }}>
          Add
        </button>
      </div>
      {items.length > 0 && (
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
          {items.map((item, i) => (
            <span key={i} style={{ background: '#f3f4f6', border: '1px solid #e5e7eb', borderRadius: '20px', padding: '0.25rem 0.75rem', fontSize: '0.8rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
              {item}
              <button type="button" onClick={() => onChange(items.filter((_, j) => j !== i))} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#6b7280', fontSize: '1rem', padding: 0, lineHeight: 1 }}>
                ×
              </button>
            </span>
          ))}
        </div>
      )}
    </div>
  );
}

export default function AdminListingEdit() {
  const { id } = useParams();
  const navigate = useNavigate();
  const isNew = id === 'new';

  const [form, setForm] = useState(EMPTY);
  const [loading, setLoading] = useState(!isNew);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (isNew) return;
    getDoc(doc(db, 'listings', id)).then((snap) => {
      if (snap.exists()) {
        const data = snap.data();
        setForm({ ...EMPTY, ...data, specs: { ...EMPTY.specs, ...(data.specs || {}) }, equipment: data.equipment || [] });
      }
      setLoading(false);
    });
  }, [id, isNew]);

  function set(field, value) {
    setForm((f) => ({ ...f, [field]: value }));
  }

  function setSpec(field, value) {
    setForm((f) => ({ ...f, specs: { ...f.specs, [field]: value } }));
  }

  async function handleImageUpload(e) {
    const files = Array.from(e.target.files);
    if (!files.length) return;
    setUploading(true);
    try {
      const uploaded = await Promise.all(
        files.map(async (file) => {
          const storageRef = ref(storage, `listings/${Date.now()}-${file.name}`);
          await uploadBytes(storageRef, file);
          const url = await getDownloadURL(storageRef);
          return { url, alt: file.name.replace(/\.[^.]+$/, ''), isPrimary: false };
        })
      );
      setForm((f) => {
        const imgs = [...f.images, ...uploaded];
        if (imgs.length > 0 && !imgs.some((i) => i.isPrimary)) {
          imgs[0] = { ...imgs[0], isPrimary: true };
        }
        return { ...f, images: imgs };
      });
    } finally {
      setUploading(false);
    }
  }

  function setPrimary(idx) {
    setForm((f) => ({
      ...f,
      images: f.images.map((img, i) => ({ ...img, isPrimary: i === idx })),
    }));
  }

  function removeImage(idx) {
    setForm((f) => {
      const imgs = f.images.filter((_, i) => i !== idx);
      if (imgs.length > 0 && !imgs.some((i) => i.isPrimary)) {
        imgs[0] = { ...imgs[0], isPrimary: true };
      }
      return { ...f, images: imgs };
    });
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setSaving(true);
    setError('');
    try {
      const data = {
        ...form,
        price: parseInt(form.price, 10) || 0,
        year: parseInt(form.year, 10) || 0,
      };
      if (isNew) {
        const newId = await createDoc('listings', data);
        navigate(`/admin/listings/${newId}`);
      } else {
        await updateDocById('listings', id, data);
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  }

  const fieldStyle = {
    width: '100%', padding: '0.5rem 0.75rem', border: '1px solid #d1d5db',
    borderRadius: '6px', fontSize: '0.875rem', color: '#111827',
    boxSizing: 'border-box',
  };
  const labelStyle = { display: 'block', fontWeight: 600, fontSize: '0.75rem', color: '#374151', marginBottom: '0.25rem', textTransform: 'uppercase', letterSpacing: '0.05em' };

  if (loading) return <AdminLayout><p style={{ color: '#6b7280' }}>Loading…</p></AdminLayout>;

  return (
    <AdminLayout>
      <div style={{ maxWidth: '720px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
          <h1 style={{ fontSize: '1.5rem', fontWeight: 700, color: '#111827' }}>
            {isNew ? 'New Listing' : `Edit: ${form.model}`}
          </h1>
          <button
            onClick={() => navigate('/admin/listings')}
            style={{ background: 'none', border: '1px solid #d1d5db', padding: '0.4rem 0.75rem', borderRadius: '6px', cursor: 'pointer', fontSize: '0.875rem' }}
          >
            ← Back
          </button>
        </div>

        {error && (
          <div style={{ background: '#fee2e2', color: '#991b1b', padding: '0.75rem 1rem', borderRadius: '6px', marginBottom: '1rem', fontSize: '0.875rem' }}>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div>
              <label style={labelStyle}>Model</label>
              <input style={fieldStyle} value={form.model} onChange={(e) => set('model', e.target.value)} required />
            </div>
            <div>
              <label style={labelStyle}>Registration</label>
              <input style={fieldStyle} value={form.registration} onChange={(e) => set('registration', e.target.value)} />
            </div>
            <div>
              <label style={labelStyle}>Year</label>
              <input style={fieldStyle} type="number" value={form.year} onChange={(e) => set('year', e.target.value)} />
            </div>
            <div>
              <label style={labelStyle}>Price (pence)</label>
              <input style={fieldStyle} type="number" value={form.price} onChange={(e) => set('price', e.target.value)} placeholder="e.g. 12500000" />
            </div>
            <div>
              <label style={labelStyle}>Price Display</label>
              <input style={fieldStyle} value={form.priceDisplay} onChange={(e) => set('priceDisplay', e.target.value)} placeholder="£125,000" />
            </div>
            <div>
              <label style={labelStyle}>Status</label>
              <select style={fieldStyle} value={form.status} onChange={(e) => set('status', e.target.value)}>
                <option value="for_sale">For Sale</option>
                <option value="reserved">Under Offer</option>
                <option value="sold">Sold</option>
                <option value="coming_soon">Coming Soon</option>
              </select>
            </div>
            <div>
              <label style={labelStyle}>Type</label>
              <select style={fieldStyle} value={form.type} onChange={(e) => set('type', e.target.value)}>
                <option value="pre-owned">Pre-Owned</option>
                <option value="new">New</option>
                <option value="rebuilt">Rebuilt</option>
              </select>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', paddingTop: '1.5rem' }}>
              <input type="checkbox" id="featured" checked={form.featured} onChange={(e) => set('featured', e.target.checked)} />
              <label htmlFor="featured" style={{ fontWeight: 600, fontSize: '0.875rem', color: '#374151' }}>Featured listing</label>
            </div>
          </div>

          <div>
            <label style={labelStyle}>Description</label>
            <textarea style={{ ...fieldStyle, minHeight: '100px', resize: 'vertical' }} value={form.description} onChange={(e) => set('description', e.target.value)} />
          </div>

          <div>
            <label style={{ ...labelStyle, marginBottom: '0.5rem' }}>Specifications</label>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
              <div>
                <label style={{ ...labelStyle, textTransform: 'none', letterSpacing: 0, fontWeight: 500 }}>Engine</label>
                <input style={fieldStyle} value={form.specs.engine || ''} onChange={(e) => setSpec('engine', e.target.value)} placeholder="e.g. RR300 Turbine" />
              </div>
              <div>
                <label style={{ ...labelStyle, textTransform: 'none', letterSpacing: 0, fontWeight: 500 }}>Serial Number</label>
                <input style={fieldStyle} value={form.specs.serial || ''} onChange={(e) => setSpec('serial', e.target.value)} placeholder="e.g. R66-0892" />
              </div>
              <div>
                <label style={{ ...labelStyle, textTransform: 'none', letterSpacing: 0, fontWeight: 500 }}>Total Hours (TT)</label>
                <input style={fieldStyle} type="number" value={form.specs.hours || ''} onChange={(e) => setSpec('hours', e.target.value)} placeholder="e.g. 485" />
              </div>
              <div>
                <label style={{ ...labelStyle, textTransform: 'none', letterSpacing: 0, fontWeight: 500 }}>Remaining Hours</label>
                <input style={fieldStyle} type="number" value={form.specs.remainingHours || ''} onChange={(e) => setSpec('remainingHours', e.target.value)} placeholder="e.g. 1515" />
              </div>
              <div>
                <label style={{ ...labelStyle, textTransform: 'none', letterSpacing: 0, fontWeight: 500 }}>Remaining Life</label>
                <input style={fieldStyle} value={form.specs.remainingLife || ''} onChange={(e) => setSpec('remainingLife', e.target.value)} placeholder="e.g. 9 Years" />
              </div>
              <div>
                <label style={{ ...labelStyle, textTransform: 'none', letterSpacing: 0, fontWeight: 500 }}>Avionics</label>
                <input style={fieldStyle} value={form.specs.avionics || ''} onChange={(e) => setSpec('avionics', e.target.value)} placeholder="e.g. Garmin G500H" />
              </div>
            </div>
          </div>

          <div>
            <label style={{ ...labelStyle, marginBottom: '0.5rem' }}>Equipment &amp; Features</label>
            <EquipmentInput items={form.equipment} onChange={(items) => set('equipment', items)} fieldStyle={fieldStyle} />
          </div>

          <div>
            <label style={labelStyle}>Images</label>
            <input type="file" accept="image/*" multiple onChange={handleImageUpload} disabled={uploading} />
            {uploading && <p style={{ color: '#6b7280', fontSize: '0.8rem', marginTop: '0.25rem' }}>Uploading…</p>}
            {form.images.length > 0 && (
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.75rem', marginTop: '0.75rem' }}>
                {form.images.map((img, i) => (
                  <div key={i} style={{ position: 'relative', width: '120px' }}>
                    <img src={img.url} alt={img.alt} style={{ width: '120px', height: '80px', objectFit: 'cover', borderRadius: '6px', border: img.isPrimary ? '2px solid #2563eb' : '2px solid transparent' }} />
                    <div style={{ display: 'flex', gap: '4px', marginTop: '4px' }}>
                      <button type="button" onClick={() => setPrimary(i)} style={{ fontSize: '0.65rem', padding: '2px 6px', background: img.isPrimary ? '#2563eb' : '#e5e7eb', color: img.isPrimary ? '#fff' : '#374151', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>
                        {img.isPrimary ? 'Primary' : 'Set Primary'}
                      </button>
                      <button type="button" onClick={() => removeImage(i)} style={{ fontSize: '0.65rem', padding: '2px 6px', background: '#fee2e2', color: '#dc2626', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>
                        ✕
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div style={{ paddingTop: '0.5rem' }}>
            <button
              type="submit"
              disabled={saving}
              style={{
                background: '#111827', color: '#fff', padding: '0.625rem 1.5rem',
                border: 'none', borderRadius: '6px', fontWeight: 600, cursor: 'pointer',
                fontSize: '0.875rem', opacity: saving ? 0.6 : 1,
              }}
            >
              {saving ? 'Saving…' : isNew ? 'Create Listing' : 'Save Changes'}
            </button>
          </div>
        </form>
      </div>
    </AdminLayout>
  );
}

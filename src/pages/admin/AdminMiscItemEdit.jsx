import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { doc, getDoc } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import AdminLayout from '../../components/admin/AdminLayout';
import { db, storage } from '../../lib/firebase';
import { createDoc, updateDocById } from '../../hooks/useFirestore';

const EMPTY = {
  name: '',
  category: '',
  priceType: 'poa',
  price: 0,
  priceDisplay: 'POA',
  hasQuantity: false,
  stock: 1,
  condition: 'new',
  description: '',
  images: [],
};

export default function AdminMiscItemEdit() {
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
    getDoc(doc(db, 'misc_items', id)).then((snap) => {
      if (snap.exists()) {
        setForm({ ...EMPTY, ...snap.data(), images: snap.data().images || [] });
      }
      setLoading(false);
    });
  }, [id, isNew]);

  function set(field, value) {
    setForm((f) => ({ ...f, [field]: value }));
  }

  async function handleImageUpload(e) {
    const files = Array.from(e.target.files);
    if (!files.length) return;
    setUploading(true);
    try {
      const uploaded = await Promise.all(
        files.map(async (file) => {
          const storageRef = ref(storage, `misc_items/${Date.now()}-${file.name}`);
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
      const priceDisplay = form.priceType === 'fixed' && form.price > 0
        ? `£${(form.price / 100).toLocaleString('en-GB', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
        : 'POA';
      const payload = {
        ...form,
        priceDisplay,
        ...(form.priceType === 'poa' ? { price: 0, hasQuantity: false, stock: 1 } : {}),
      };
      if (isNew) {
        const newId = await createDoc('misc_items', payload);
        navigate(`/admin/misc/${newId}`);
      } else {
        await updateDocById('misc_items', id, payload);
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
  const labelStyle = {
    display: 'block', fontWeight: 600, fontSize: '0.75rem', color: '#374151',
    marginBottom: '0.25rem', textTransform: 'uppercase', letterSpacing: '0.05em',
  };

  if (loading) return <AdminLayout><p style={{ color: '#6b7280' }}>Loading…</p></AdminLayout>;

  return (
    <AdminLayout>
      <div style={{ maxWidth: '720px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
          <h1 style={{ fontSize: '1.5rem', fontWeight: 700, color: '#111827' }}>
            {isNew ? 'New Misc Item' : `Edit: ${form.name}`}
          </h1>
          <button
            onClick={() => navigate('/admin/misc')}
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
              <label style={labelStyle}>Name</label>
              <input style={fieldStyle} value={form.name} onChange={(e) => set('name', e.target.value)} required placeholder="e.g. R22 Helicopter Cover" />
            </div>
            <div>
              <label style={labelStyle}>Category</label>
              <input style={fieldStyle} value={form.category} onChange={(e) => set('category', e.target.value)} placeholder="e.g. Apparel, Ground Equipment" />
            </div>
          </div>

          {/* Pricing */}
          <div>
            <label style={labelStyle}>Pricing</label>
            <div style={{ display: 'flex', gap: '1.5rem', marginBottom: '0.75rem' }}>
              {['poa', 'fixed'].map((pt) => (
                <label key={pt} style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', cursor: 'pointer', fontSize: '0.875rem', color: '#374151' }}>
                  <input
                    type="radio"
                    name="priceType"
                    value={pt}
                    checked={form.priceType === pt}
                    onChange={() => set('priceType', pt)}
                  />
                  {pt === 'poa' ? 'Price on Application' : 'Fixed Price'}
                </label>
              ))}
            </div>
            {form.priceType === 'fixed' && (
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <span style={{ fontSize: '0.9rem', color: '#374151', fontWeight: 600 }}>£</span>
                <input
                  style={{ ...fieldStyle, width: '140px' }}
                  type="number"
                  step="0.01"
                  min="0"
                  placeholder="0.00"
                  value={form.price > 0 ? (form.price / 100).toFixed(2) : ''}
                  onChange={(e) => set('price', Math.round(parseFloat(e.target.value || 0) * 100))}
                />
                {form.price > 0 && (
                  <span style={{ fontSize: '0.8rem', color: '#6b7280' }}>
                    → displays as £{(form.price / 100).toLocaleString('en-GB', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                  </span>
                )}
              </div>
            )}
          </div>

          <div>
            <label style={labelStyle}>Condition</label>
            <select style={{ ...fieldStyle, width: '160px' }} value={form.condition} onChange={(e) => set('condition', e.target.value)}>
              <option value="new">New</option>
              <option value="used">Used</option>
            </select>
          </div>

          {form.priceType === 'fixed' && (
            <div>
              <label style={labelStyle}>Quantity</label>
              <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer', fontSize: '0.875rem', color: '#374151', marginBottom: '0.5rem' }}>
                <input
                  type="checkbox"
                  checked={form.hasQuantity}
                  onChange={(e) => set('hasQuantity', e.target.checked)}
                />
                Allow quantity selection on product page
              </label>
              {form.hasQuantity && (
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                  <label style={{ ...labelStyle, margin: 0, textTransform: 'none', letterSpacing: 0, fontSize: '0.8rem' }}>Stock available:</label>
                  <input
                    style={{ ...fieldStyle, width: '80px' }}
                    type="number"
                    min="1"
                    step="1"
                    value={form.stock}
                    onChange={(e) => set('stock', Math.max(1, parseInt(e.target.value || 1, 10)))}
                  />
                </div>
              )}
            </div>
          )}

          <div>
            <label style={labelStyle}>Description</label>
            <textarea
              style={{ ...fieldStyle, minHeight: '80px', resize: 'vertical' }}
              value={form.description}
              onChange={(e) => set('description', e.target.value)}
              placeholder="Optional — shown on the public catalogue page"
            />
          </div>

          <div>
            <label style={labelStyle}>Images</label>
            <input type="file" accept="image/*" multiple onChange={handleImageUpload} disabled={uploading} />
            {uploading && <p style={{ color: '#6b7280', fontSize: '0.8rem', marginTop: '0.25rem' }}>Uploading…</p>}
            {form.images.length > 0 && (
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.75rem', marginTop: '0.75rem' }}>
                {form.images.map((img, i) => (
                  <div key={img.url} style={{ position: 'relative', width: '120px' }}>
                    <img
                      src={img.url}
                      alt={img.alt}
                      style={{ width: '120px', height: '80px', objectFit: 'cover', borderRadius: '6px', border: img.isPrimary ? '2px solid #2563eb' : '2px solid transparent' }}
                    />
                    <div style={{ display: 'flex', gap: '4px', marginTop: '4px' }}>
                      <button
                        type="button"
                        onClick={() => setPrimary(i)}
                        style={{ fontSize: '0.65rem', padding: '2px 6px', background: img.isPrimary ? '#2563eb' : '#e5e7eb', color: img.isPrimary ? '#fff' : '#374151', border: 'none', borderRadius: '4px', cursor: 'pointer' }}
                      >
                        {img.isPrimary ? 'Primary' : 'Set Primary'}
                      </button>
                      <button
                        type="button"
                        onClick={() => removeImage(i)}
                        style={{ fontSize: '0.65rem', padding: '2px 6px', background: '#fee2e2', color: '#dc2626', border: 'none', borderRadius: '4px', cursor: 'pointer' }}
                      >
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
              {saving ? 'Saving…' : isNew ? 'Create Item' : 'Save Changes'}
            </button>
          </div>
        </form>
      </div>
    </AdminLayout>
  );
}

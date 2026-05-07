import { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { doc, getDoc, setDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../../lib/firebase';
import AdminLayout from '../../components/admin/AdminLayout';
import {
  AIRCRAFT_SPECS_MODELS,
  AIRCRAFT_SPECS_LABELS,
  AIRCRAFT_SPECS_DEFAULTS,
} from '../../lib/aircraftSpecsDefaults';

const fieldStyle = {
  padding: '0.45rem 0.6rem',
  border: '1px solid #d1d5db',
  borderRadius: 4,
  fontSize: '0.85rem',
  width: '100%',
  fontFamily: 'inherit',
};

const labelStyle = {
  display: 'block',
  fontSize: '0.7rem',
  fontWeight: 600,
  color: '#6b7280',
  textTransform: 'uppercase',
  letterSpacing: '0.05em',
  marginBottom: '0.25rem',
};

const ICON_HINTS = 'Common: fa-cog, fa-bolt, fa-tachometer-alt, fa-plane, fa-route, fa-weight-hanging, fa-users, fa-circle-notch, fa-gas-pump, fa-clock, fa-cube, fa-tag';

function emptyVariant(key = 'new') {
  return {
    key,
    name: 'New variant',
    rows: [{ label: 'Engine', value: '', icon: 'fa-cog' }],
    dimensions: null,
    diagram: '',
  };
}

function emptyRow() {
  return { label: '', value: '', icon: '' };
}

export default function AdminAircraftSpecsEdit() {
  const { model } = useParams();
  const navigate = useNavigate();

  const isValid = AIRCRAFT_SPECS_MODELS.includes(model);
  const [variants, setVariants] = useState([]);
  const [activeIdx, setActiveIdx] = useState(0);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [savedAt, setSavedAt] = useState(null);
  const [usingDefaults, setUsingDefaults] = useState(false);

  useEffect(() => {
    if (!isValid) {
      setLoading(false);
      return;
    }
    let cancelled = false;
    (async () => {
      const ref = doc(db, 'aircraftSpecs', model);
      const snap = await getDoc(ref);
      if (cancelled) return;
      if (snap.exists() && Array.isArray(snap.data().variants) && snap.data().variants.length > 0) {
        setVariants(structuredClone(snap.data().variants));
        setUsingDefaults(false);
      } else {
        setVariants(structuredClone(AIRCRAFT_SPECS_DEFAULTS[model]?.variants ?? []));
        setUsingDefaults(true);
      }
      setLoading(false);
    })();
    return () => { cancelled = true; };
  }, [model, isValid]);

  if (!isValid) {
    return (
      <AdminLayout>
        <p style={{ color: '#dc2626' }}>Unknown model: {model}</p>
        <Link to="/admin/aircraft-specs">← Back to aircraft specs</Link>
      </AdminLayout>
    );
  }

  const active = variants[activeIdx];

  function updateVariant(patch) {
    setVariants((vs) => vs.map((v, i) => (i === activeIdx ? { ...v, ...patch } : v)));
  }

  function updateRow(rowIdx, patch) {
    updateVariant({
      rows: active.rows.map((r, i) => (i === rowIdx ? { ...r, ...patch } : r)),
    });
  }

  function removeRow(rowIdx) {
    updateVariant({ rows: active.rows.filter((_, i) => i !== rowIdx) });
  }

  function moveRow(rowIdx, dir) {
    const next = [...active.rows];
    const target = rowIdx + dir;
    if (target < 0 || target >= next.length) return;
    [next[rowIdx], next[target]] = [next[target], next[rowIdx]];
    updateVariant({ rows: next });
  }

  function addRow() {
    updateVariant({ rows: [...active.rows, emptyRow()] });
  }

  function addVariant() {
    setVariants((vs) => [...vs, emptyVariant(`variant-${vs.length + 1}`)]);
    setActiveIdx(variants.length);
  }

  function removeVariant() {
    if (variants.length <= 1) {
      window.alert('At least one variant is required.');
      return;
    }
    if (!window.confirm(`Delete variant "${active.name}"?`)) return;
    const next = variants.filter((_, i) => i !== activeIdx);
    setVariants(next);
    setActiveIdx(Math.max(0, activeIdx - 1));
  }

  function toggleDimensions() {
    if (active.dimensions) {
      updateVariant({ dimensions: null });
    } else {
      updateVariant({ dimensions: { length: '', height: '', maxWeight: '' } });
    }
  }

  async function save() {
    setSaving(true);
    try {
      const ref = doc(db, 'aircraftSpecs', model);
      // Strip empty diagrams + dimensions to keep docs clean.
      const cleaned = variants.map((v) => {
        const out = {
          key: v.key || '',
          name: v.name || '',
          rows: (v.rows || []).filter((r) => r.label || r.value).map((r) => ({
            label: r.label || '',
            value: r.value || '',
            ...(r.icon ? { icon: r.icon } : {}),
          })),
        };
        if (v.diagram) out.diagram = v.diagram;
        if (v.dimensions && (v.dimensions.length || v.dimensions.height || v.dimensions.maxWeight)) {
          out.dimensions = {
            length: v.dimensions.length || '',
            height: v.dimensions.height || '',
            maxWeight: v.dimensions.maxWeight || '',
          };
        }
        return out;
      });
      await setDoc(ref, { variants: cleaned, updatedAt: serverTimestamp() }, { merge: false });
      setUsingDefaults(false);
      setSavedAt(new Date());
    } finally {
      setSaving(false);
    }
  }

  async function resetToDefaults() {
    if (!window.confirm('Reset to baked-in defaults? Your edits in Firestore will be overwritten on save.')) return;
    setVariants(structuredClone(AIRCRAFT_SPECS_DEFAULTS[model]?.variants ?? []));
    setActiveIdx(0);
  }

  if (loading) {
    return (
      <AdminLayout>
        <p style={{ color: '#6b7280' }}>Loading…</p>
      </AdminLayout>
    );
  }

  if (variants.length === 0) {
    return (
      <AdminLayout>
        <h1 style={{ margin: 0, fontSize: '1.5rem', fontWeight: 700 }}>
          {AIRCRAFT_SPECS_LABELS[model]} specs
        </h1>
        <p style={{ color: '#6b7280', maxWidth: 640 }}>
          No variants configured yet for this model.
        </p>
        <button onClick={addVariant} style={{ ...fieldStyle, width: 'auto', cursor: 'pointer' }}>
          + Add first variant
        </button>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem', gap: '1rem', flexWrap: 'wrap' }}>
        <div>
          <Link to="/admin/aircraft-specs" style={{ fontSize: '0.8rem', color: '#6b7280', textDecoration: 'none' }}>
            ← Aircraft specs
          </Link>
          <h1 style={{ margin: '0.25rem 0 0', fontSize: '1.5rem', fontWeight: 700, color: '#111827' }}>
            {AIRCRAFT_SPECS_LABELS[model]}
          </h1>
          {usingDefaults && (
            <p style={{ margin: '0.25rem 0 0', fontSize: '0.78rem', color: '#9ca3af' }}>
              Editing copy of baked-in defaults. Save to push live.
            </p>
          )}
          {savedAt && (
            <p style={{ margin: '0.25rem 0 0', fontSize: '0.78rem', color: '#059669' }}>
              Saved at {savedAt.toLocaleTimeString()}.
            </p>
          )}
        </div>
        <div style={{ display: 'flex', gap: '0.5rem' }}>
          <button
            type="button"
            onClick={resetToDefaults}
            style={{ padding: '0.5rem 1rem', border: '1px solid #d1d5db', background: '#fff', borderRadius: 6, cursor: 'pointer', fontSize: '0.85rem' }}
          >
            Reset to defaults
          </button>
          <button
            type="button"
            onClick={save}
            disabled={saving}
            style={{ padding: '0.5rem 1.1rem', background: '#111827', color: '#fff', border: 'none', borderRadius: 6, cursor: saving ? 'wait' : 'pointer', fontSize: '0.85rem', fontWeight: 600 }}
          >
            {saving ? 'Saving…' : 'Save'}
          </button>
        </div>
      </div>

      {/* Variant tabs */}
      <div style={{ display: 'flex', gap: '0.4rem', marginBottom: '1rem', flexWrap: 'wrap', alignItems: 'center' }}>
        {variants.map((v, i) => (
          <button
            key={v.key + i}
            type="button"
            onClick={() => setActiveIdx(i)}
            style={{
              padding: '0.4rem 0.85rem',
              borderRadius: 999,
              border: '1px solid ' + (i === activeIdx ? '#111827' : '#d1d5db'),
              background: i === activeIdx ? '#111827' : '#fff',
              color: i === activeIdx ? '#fff' : '#374151',
              fontSize: '0.78rem',
              fontWeight: 600,
              cursor: 'pointer',
            }}
          >
            {v.name || v.key || 'Untitled'}
          </button>
        ))}
        <button
          type="button"
          onClick={addVariant}
          style={{ padding: '0.4rem 0.85rem', borderRadius: 999, border: '1px dashed #9ca3af', background: '#fff', color: '#6b7280', fontSize: '0.78rem', cursor: 'pointer' }}
        >
          + Add variant
        </button>
      </div>

      {/* Variant fields */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem', marginBottom: '1rem' }}>
        <label>
          <span style={labelStyle}>Variant key (stable id)</span>
          <input
            value={active.key}
            onChange={(e) => updateVariant({ key: e.target.value })}
            placeholder="e.g. ravenII"
            style={fieldStyle}
          />
        </label>
        <label>
          <span style={labelStyle}>Variant display name</span>
          <input
            value={active.name}
            onChange={(e) => updateVariant({ name: e.target.value })}
            placeholder="e.g. Raven II"
            style={fieldStyle}
          />
        </label>
        <label style={{ gridColumn: '1 / -1' }}>
          <span style={labelStyle}>Diagram image path (optional, R44-style)</span>
          <input
            value={active.diagram || ''}
            onChange={(e) => updateVariant({ diagram: e.target.value })}
            placeholder="/assets/images/new-aircraft/r44/r44-raven-ii-specification-diagram.png"
            style={fieldStyle}
          />
        </label>
      </div>

      {/* Dimensions (optional) */}
      <div style={{ background: '#f9fafb', border: '1px solid #e5e7eb', borderRadius: 6, padding: '0.85rem', marginBottom: '1.25rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: active.dimensions ? '0.65rem' : 0 }}>
          <strong style={{ fontSize: '0.85rem', color: '#374151' }}>Headline dimensions</strong>
          <button
            type="button"
            onClick={toggleDimensions}
            style={{ padding: '0.25rem 0.65rem', borderRadius: 4, background: '#fff', border: '1px solid #d1d5db', fontSize: '0.75rem', cursor: 'pointer' }}
          >
            {active.dimensions ? 'Remove' : 'Add'}
          </button>
        </div>
        {active.dimensions && (
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '0.65rem' }}>
            <label>
              <span style={labelStyle}>Length</span>
              <input
                value={active.dimensions.length}
                onChange={(e) => updateVariant({ dimensions: { ...active.dimensions, length: e.target.value } })}
                placeholder="29.9 ft"
                style={fieldStyle}
              />
            </label>
            <label>
              <span style={labelStyle}>Height</span>
              <input
                value={active.dimensions.height}
                onChange={(e) => updateVariant({ dimensions: { ...active.dimensions, height: e.target.value } })}
                placeholder="10.75 ft"
                style={fieldStyle}
              />
            </label>
            <label>
              <span style={labelStyle}>Max weight</span>
              <input
                value={active.dimensions.maxWeight}
                onChange={(e) => updateVariant({ dimensions: { ...active.dimensions, maxWeight: e.target.value } })}
                placeholder="2,500 lbs"
                style={fieldStyle}
              />
            </label>
          </div>
        )}
      </div>

      {/* Spec rows */}
      <div style={{ marginBottom: '0.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
        <strong style={{ fontSize: '0.95rem', color: '#111827' }}>Spec rows ({active.rows.length})</strong>
        <span style={{ fontSize: '0.7rem', color: '#9ca3af' }}>{ICON_HINTS}</span>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0,1fr) minmax(0,1.4fr) minmax(0,180px) auto', gap: '0.5rem', fontSize: '0.7rem', color: '#6b7280', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.4rem', paddingInline: '0.25rem' }}>
        <span>Label</span>
        <span>Value</span>
        <span>Icon (optional)</span>
        <span></span>
      </div>
      {active.rows.map((row, i) => (
        <div key={i} style={{ display: 'grid', gridTemplateColumns: 'minmax(0,1fr) minmax(0,1.4fr) minmax(0,180px) auto', gap: '0.5rem', alignItems: 'center', marginBottom: '0.4rem' }}>
          <input value={row.label || ''} onChange={(e) => updateRow(i, { label: e.target.value })} placeholder="Engine" style={fieldStyle} />
          <input value={row.value || ''} onChange={(e) => updateRow(i, { value: e.target.value })} placeholder="Rolls-Royce RR300" style={fieldStyle} />
          <input value={row.icon || ''} onChange={(e) => updateRow(i, { icon: e.target.value })} placeholder="fa-cog" style={fieldStyle} />
          <div style={{ display: 'flex', gap: '0.25rem' }}>
            <button type="button" onClick={() => moveRow(i, -1)} disabled={i === 0} title="Move up" style={iconBtn(i === 0)}>↑</button>
            <button type="button" onClick={() => moveRow(i, +1)} disabled={i === active.rows.length - 1} title="Move down" style={iconBtn(i === active.rows.length - 1)}>↓</button>
            <button type="button" onClick={() => removeRow(i)} title="Remove" style={{ ...iconBtn(false), color: '#dc2626' }}>×</button>
          </div>
        </div>
      ))}
      <button type="button" onClick={addRow} style={{ marginTop: '0.5rem', padding: '0.45rem 0.85rem', borderRadius: 6, background: '#fff', border: '1px dashed #9ca3af', color: '#374151', fontSize: '0.8rem', cursor: 'pointer' }}>
        + Add row
      </button>

      {variants.length > 1 && (
        <div style={{ marginTop: '2rem', paddingTop: '1rem', borderTop: '1px solid #e5e7eb' }}>
          <button
            type="button"
            onClick={removeVariant}
            style={{ padding: '0.45rem 0.85rem', borderRadius: 6, background: '#fff', border: '1px solid #fecaca', color: '#dc2626', fontSize: '0.8rem', cursor: 'pointer' }}
          >
            Delete this variant
          </button>
        </div>
      )}
    </AdminLayout>
  );
}

function iconBtn(disabled) {
  return {
    width: 28,
    height: 28,
    border: '1px solid #d1d5db',
    background: '#fff',
    borderRadius: 4,
    cursor: disabled ? 'not-allowed' : 'pointer',
    opacity: disabled ? 0.4 : 1,
    fontSize: '0.85rem',
  };
}

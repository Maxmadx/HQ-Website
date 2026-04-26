import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import AdminLayout from '../../components/admin/AdminLayout';
import { doc, getDoc, setDoc, deleteDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../../lib/firebase';
import { CLASSES, FUEL_TYPES, CONFIDENCE, MARKET_STATUS, validateComparable, isUsedOnly } from '../../lib/comparablesSchema';

const EMPTY = {
  manufacturer: '',
  model: '',
  displayName: '',
  class: 'light-piston',
  marketStatus: 'in-production',
  isRobinson: false,
  fuelType: 'avgas-100ll',
  imagePath: '',
  specs: { seats: '', engine: '', maxSpeedKts: '', cruiseSpeedKts: '', rangeNm: '', enduranceHrs: '', usefulLoadLbs: '', fuelCapacityGal: '', hoverCeilingIgeFt: '' },
  costsPerHour: { fuelBurnGph: '', mxScheduled: '', engineReserve: '', airframeReserve: '' },
  costsAnnual: { insurance: '', annualInspection: '', hangarage: '' },
  acquisition: { priceNewGbp: '', priceUsedRangeGbp: { low: '', high: '' } },
  costsSource: '',
  costsConfidence: 'estimate',
};

function slugify(s) {
  return s.toLowerCase().trim().replace(/[^a-z0-9-]+/g, '-').replace(/^-+|-+$/g, '');
}

function asNumber(v) {
  if (v === '' || v === null || v === undefined) return null;
  const n = Number(v);
  return Number.isFinite(n) ? n : null;
}

function coerceForSave(form) {
  return {
    manufacturer: form.manufacturer.trim(),
    model: form.model.trim(),
    displayName: form.displayName.trim(),
    class: form.class,
    marketStatus: form.marketStatus,
    isRobinson: !!form.isRobinson,
    fuelType: form.fuelType,
    imagePath: form.imagePath.trim() || null,
    specs: {
      seats: asNumber(form.specs.seats),
      engine: form.specs.engine?.trim() || null,
      maxSpeedKts: asNumber(form.specs.maxSpeedKts),
      cruiseSpeedKts: asNumber(form.specs.cruiseSpeedKts),
      rangeNm: asNumber(form.specs.rangeNm),
      enduranceHrs: asNumber(form.specs.enduranceHrs),
      usefulLoadLbs: asNumber(form.specs.usefulLoadLbs),
      fuelCapacityGal: asNumber(form.specs.fuelCapacityGal),
      hoverCeilingIgeFt: asNumber(form.specs.hoverCeilingIgeFt),
    },
    costsPerHour: {
      fuelBurnGph: asNumber(form.costsPerHour.fuelBurnGph),
      mxScheduled: asNumber(form.costsPerHour.mxScheduled),
      engineReserve: asNumber(form.costsPerHour.engineReserve),
      airframeReserve: asNumber(form.costsPerHour.airframeReserve),
    },
    costsAnnual: {
      insurance: asNumber(form.costsAnnual.insurance),
      annualInspection: asNumber(form.costsAnnual.annualInspection),
      hangarage: asNumber(form.costsAnnual.hangarage),
    },
    acquisition: {
      priceNewGbp: asNumber(form.acquisition.priceNewGbp),
      priceUsedRangeGbp: {
        low: asNumber(form.acquisition.priceUsedRangeGbp.low),
        high: asNumber(form.acquisition.priceUsedRangeGbp.high),
      },
    },
    costsSource: form.costsSource.trim(),
    costsConfidence: form.costsConfidence,
  };
}

const inputStyle = { padding: '0.45rem 0.6rem', fontSize: '0.86rem', border: '1px solid #ccc', borderRadius: '3px', width: '100%', fontFamily: 'inherit' };
const labelStyle = { display: 'flex', flexDirection: 'column', gap: '0.2rem', fontSize: '0.7rem', opacity: 0.7 };

export default function AdminComparableEdit() {
  const navigate = useNavigate();
  const { id: routeId } = useParams();
  const isNew = routeId === 'new';
  const [form, setForm] = useState(EMPTY);
  const [docId, setDocId] = useState('');
  const [loading, setLoading] = useState(!isNew);
  const [saving, setSaving] = useState(false);
  const [errors, setErrors] = useState([]);

  useEffect(() => {
    if (isNew) return;
    let cancelled = false;
    (async () => {
      const ref = doc(db, 'comparables', routeId);
      const snap = await getDoc(ref);
      if (cancelled) return;
      if (snap.exists()) {
        const data = snap.data();
        setForm({
          ...EMPTY,
          ...data,
          specs: { ...EMPTY.specs, ...(data.specs || {}) },
          costsPerHour: { ...EMPTY.costsPerHour, ...(data.costsPerHour || {}) },
          costsAnnual: { ...EMPTY.costsAnnual, ...(data.costsAnnual || {}) },
          acquisition: {
            ...EMPTY.acquisition,
            ...(data.acquisition || {}),
            priceUsedRangeGbp: { ...EMPTY.acquisition.priceUsedRangeGbp, ...(data.acquisition?.priceUsedRangeGbp || {}) },
          },
        });
        setDocId(routeId);
      }
      setLoading(false);
    })();
    return () => { cancelled = true; };
  }, [routeId, isNew]);

  function setField(path, value) {
    setForm((f) => {
      const parts = path.split('.');
      const next = { ...f };
      let cursor = next;
      for (let i = 0; i < parts.length - 1; i++) {
        cursor[parts[i]] = { ...cursor[parts[i]] };
        cursor = cursor[parts[i]];
      }
      cursor[parts[parts.length - 1]] = value;
      return next;
    });
  }

  async function handleSave() {
    setErrors([]);
    const id = isNew ? slugify(docId || form.model) : routeId;
    if (!id) {
      setErrors(['Slug / Doc ID is required']);
      return;
    }
    const payload = { id, ...coerceForSave(form) };
    const validationErrors = validateComparable(payload);
    if (validationErrors.length) {
      setErrors(validationErrors);
      return;
    }
    setSaving(true);
    try {
      if (isNew) {
        const existing = await getDoc(doc(db, 'comparables', id));
        if (existing.exists()) {
          setErrors([`Slug "${id}" already exists — choose a different slug.`]);
          setSaving(false);
          return;
        }
      }
      const { id: _, ...toWrite } = payload;
      await setDoc(doc(db, 'comparables', id), {
        ...toWrite,
        costsLastUpdated: serverTimestamp(),
        updatedAt: serverTimestamp(),
        ...(isNew ? { createdAt: serverTimestamp() } : {}),
      }, { merge: false });
      navigate('/admin/comparables');
    } catch (err) {
      console.error('Save failed', err);
      setErrors([`Save failed: ${err.message}`]);
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete() {
    if (isNew) return;
    if (!window.confirm(`Delete ${form.model}?\n\nInbound URL links with slug "${routeId}" will silently break.`)) return;
    try {
      await deleteDoc(doc(db, 'comparables', routeId));
      navigate('/admin/comparables');
    } catch (err) {
      console.error('Delete failed', err);
      setErrors([`Delete failed: ${err.message}`]);
    }
  }

  if (loading) return <AdminLayout><p>Loading…</p></AdminLayout>;

  return (
    <AdminLayout>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
        <div>
          <div style={{ fontSize: '0.72rem', opacity: 0.6, textTransform: 'uppercase', letterSpacing: '0.06em' }}>Comparables / {isNew ? 'Add' : 'Edit'}</div>
          <h1 style={{ fontSize: '1.4rem', margin: '0.2rem 0 0' }}>{form.model || 'New aircraft'}</h1>
        </div>
        <div style={{ display: 'flex', gap: '0.4rem' }}>
          {!isNew && (
            <button onClick={handleDelete} style={{ background: '#fff', border: '1px solid #f0c5c5', color: '#a02020', padding: '0.5rem 1rem', borderRadius: '6px', cursor: 'pointer' }}>
              Delete
            </button>
          )}
          <button onClick={handleSave} disabled={saving} style={{ background: '#222', color: '#fff', border: 'none', padding: '0.5rem 1.1rem', borderRadius: '6px', fontWeight: 600, cursor: 'pointer' }}>
            {saving ? 'Saving…' : 'Save changes'}
          </button>
        </div>
      </div>

      {errors.length > 0 && (
        <div style={{ background: '#fff0f0', border: '1px solid #f5c6c6', padding: '0.75rem 1rem', borderRadius: '4px', marginBottom: '1rem' }}>
          <div style={{ fontWeight: 600, color: '#a02020', marginBottom: '0.3rem' }}>Validation issues</div>
          <ul style={{ margin: 0, paddingLeft: '1.2rem' }}>
            {errors.map((e, i) => <li key={i} style={{ color: '#a02020', fontSize: '0.85rem' }}>{e}</li>)}
          </ul>
        </div>
      )}

      <div style={{ background: '#fff', padding: '1.25rem', borderRadius: '6px' }}>
        <SectionLabel>Identification</SectionLabel>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '0.6rem' }}>
          <label style={labelStyle}>Doc ID (slug) {isNew ? '' : '(locked)'}
            <input style={inputStyle} value={isNew ? docId : routeId} onChange={(e) => isNew && setDocId(slugify(e.target.value))} disabled={!isNew} placeholder="e.g. r66-turbine" />
          </label>
          <label style={labelStyle}>Manufacturer
            <input style={inputStyle} value={form.manufacturer} onChange={(e) => setField('manufacturer', e.target.value)} />
          </label>
          <label style={labelStyle}>Display name (chip label)
            <input style={inputStyle} value={form.displayName} onChange={(e) => setField('displayName', e.target.value)} />
          </label>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr 1fr', gap: '0.6rem', marginTop: '0.6rem' }}>
          <label style={labelStyle}>Model
            <input style={inputStyle} value={form.model} onChange={(e) => setField('model', e.target.value)} />
          </label>
          <label style={labelStyle}>Class
            <select style={inputStyle} value={form.class} onChange={(e) => setField('class', e.target.value)}>
              {CLASSES.map((c) => <option key={c.id} value={c.id}>{c.label}</option>)}
            </select>
          </label>
          <label style={labelStyle}>Status
            <select style={inputStyle} value={form.marketStatus} onChange={(e) => setField('marketStatus', e.target.value)}>
              {MARKET_STATUS.map((s) => <option key={s} value={s}>{s}</option>)}
            </select>
          </label>
          <label style={labelStyle}>Fuel type
            <select style={inputStyle} value={form.fuelType} onChange={(e) => setField('fuelType', e.target.value)}>
              {FUEL_TYPES.map((f) => <option key={f} value={f}>{f}</option>)}
            </select>
          </label>
        </div>
        <div style={{ marginTop: '0.6rem', display: 'flex', gap: '1rem', fontSize: '0.85rem' }}>
          <label style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem' }}>
            <input type="checkbox" checked={form.isRobinson} onChange={(e) => setField('isRobinson', e.target.checked)} />
            isRobinson (show as chip on public page)
          </label>
        </div>

        <SectionLabel>Performance specs</SectionLabel>
        <Grid cols={5}>
          <NumField label="Seats" value={form.specs.seats} onChange={(v) => setField('specs.seats', v)} />
          <TextField label="Engine" value={form.specs.engine} onChange={(v) => setField('specs.engine', v)} />
          <NumField label="Max speed (kts)" value={form.specs.maxSpeedKts} onChange={(v) => setField('specs.maxSpeedKts', v)} />
          <NumField label="Cruise (kts)" value={form.specs.cruiseSpeedKts} onChange={(v) => setField('specs.cruiseSpeedKts', v)} />
          <NumField label="Range (nm)" value={form.specs.rangeNm} onChange={(v) => setField('specs.rangeNm', v)} />
          <NumField label="Endurance (hrs)" step="0.1" value={form.specs.enduranceHrs} onChange={(v) => setField('specs.enduranceHrs', v)} />
          <NumField label="Useful load (lb)" value={form.specs.usefulLoadLbs} onChange={(v) => setField('specs.usefulLoadLbs', v)} />
          <NumField label="Fuel cap (gal)" step="0.1" value={form.specs.fuelCapacityGal} onChange={(v) => setField('specs.fuelCapacityGal', v)} />
          <NumField label="Hover ceiling IGE (ft)" value={form.specs.hoverCeilingIgeFt} onChange={(v) => setField('specs.hoverCeilingIgeFt', v)} />
        </Grid>

        <SectionLabel>Costs — per hour (£)</SectionLabel>
        <Grid cols={4}>
          <NumField label="Fuel burn (gph)" step="0.1" value={form.costsPerHour.fuelBurnGph} onChange={(v) => setField('costsPerHour.fuelBurnGph', v)} />
          <NumField label="Scheduled MX" value={form.costsPerHour.mxScheduled} onChange={(v) => setField('costsPerHour.mxScheduled', v)} />
          <NumField label="Engine reserve" value={form.costsPerHour.engineReserve} onChange={(v) => setField('costsPerHour.engineReserve', v)} />
          <NumField label="Airframe reserve" value={form.costsPerHour.airframeReserve} onChange={(v) => setField('costsPerHour.airframeReserve', v)} />
        </Grid>

        <SectionLabel>Costs — annual fixed (£)</SectionLabel>
        <Grid cols={3}>
          <NumField label="Insurance" value={form.costsAnnual.insurance} onChange={(v) => setField('costsAnnual.insurance', v)} />
          <NumField label="Annual inspection" value={form.costsAnnual.annualInspection} onChange={(v) => setField('costsAnnual.annualInspection', v)} />
          <NumField label="Hangarage" value={form.costsAnnual.hangarage} onChange={(v) => setField('costsAnnual.hangarage', v)} />
        </Grid>

        <SectionLabel>Acquisition (£)</SectionLabel>
        <Grid cols={3}>
          <NumField label={`Price new ${isUsedOnly(form) ? '(n/a — used only)' : ''}`} value={form.acquisition.priceNewGbp} onChange={(v) => setField('acquisition.priceNewGbp', v)} disabled={isUsedOnly(form)} />
          <NumField label="Used range — low" value={form.acquisition.priceUsedRangeGbp.low} onChange={(v) => setField('acquisition.priceUsedRangeGbp.low', v)} />
          <NumField label="Used range — high" value={form.acquisition.priceUsedRangeGbp.high} onChange={(v) => setField('acquisition.priceUsedRangeGbp.high', v)} />
        </Grid>

        <SectionLabel>Provenance</SectionLabel>
        <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '0.6rem' }}>
          <label style={labelStyle}>Source description
            <input style={inputStyle} value={form.costsSource} onChange={(e) => setField('costsSource', e.target.value)} placeholder='e.g. "HQ internal MX records, fleet of 8"' />
          </label>
          <label style={labelStyle}>Confidence
            <select style={inputStyle} value={form.costsConfidence} onChange={(e) => setField('costsConfidence', e.target.value)}>
              {CONFIDENCE.map((c) => <option key={c} value={c}>{c}</option>)}
            </select>
          </label>
        </div>
      </div>
    </AdminLayout>
  );
}

function SectionLabel({ children }) {
  return <div style={{ fontSize: '0.66rem', letterSpacing: '0.1em', textTransform: 'uppercase', color: '#666', margin: '1.4rem 0 0.55rem' }}>{children}</div>;
}
function Grid({ cols, children }) {
  return <div style={{ display: 'grid', gridTemplateColumns: `repeat(${cols}, 1fr)`, gap: '0.5rem' }}>{children}</div>;
}
function NumField({ label, value, onChange, step = '1', disabled }) {
  return (
    <label style={labelStyle}>{label}
      <input type="number" step={step} style={inputStyle} value={value ?? ''} disabled={disabled} onChange={(e) => onChange(e.target.value)} />
    </label>
  );
}
function TextField({ label, value, onChange }) {
  return (
    <label style={labelStyle}>{label}
      <input style={inputStyle} value={value ?? ''} onChange={(e) => onChange(e.target.value)} />
    </label>
  );
}

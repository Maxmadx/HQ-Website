import { Link } from 'react-router-dom';
import AdminLayout from '../../components/admin/AdminLayout';
import { useDocument } from '../../hooks/useFirestore';
import {
  AIRCRAFT_SPECS_MODELS,
  AIRCRAFT_SPECS_LABELS,
  AIRCRAFT_SPECS_DEFAULTS,
} from '../../lib/aircraftSpecsDefaults';

function ModelCard({ modelId }) {
  const { data, loading } = useDocument('aircraftSpecs', modelId);
  const fallback = AIRCRAFT_SPECS_DEFAULTS[modelId] ?? { variants: [] };
  const variants = data?.variants ?? fallback.variants;
  const variantCount = variants.length;
  const rowCount = variants.reduce((sum, v) => sum + (v.rows?.length ?? 0), 0);
  const isCustom = !!data && Array.isArray(data.variants);
  const r22Pending = modelId === 'r22' && variantCount === 0;

  return (
    <div
      style={{
        border: '1px solid #e5e7eb',
        borderRadius: 8,
        padding: '1.25rem',
        background: '#fff',
        display: 'flex',
        flexDirection: 'column',
        gap: '0.75rem',
      }}
    >
      <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between' }}>
        <h2 style={{ margin: 0, fontSize: '1.1rem', fontWeight: 700, color: '#111827' }}>
          {AIRCRAFT_SPECS_LABELS[modelId]}
        </h2>
        <span style={{ fontFamily: 'monospace', fontSize: '0.75rem', color: '#6b7280' }}>
          {modelId}
        </span>
      </div>

      {r22Pending ? (
        <p style={{ margin: 0, fontSize: '0.85rem', color: '#9ca3af', lineHeight: 1.5 }}>
          R22 specs use a typed-field comparison schema. Migration to the rows-based
          editor is a separate phase — admin coverage coming after R66/R88/R44 land.
        </p>
      ) : (
        <p style={{ margin: 0, fontSize: '0.85rem', color: '#374151' }}>
          {variantCount === 1 ? '1 variant' : `${variantCount} variants`} · {rowCount} rows
          {' · '}
          <span style={{ color: isCustom ? '#059669' : '#9ca3af' }}>
            {loading ? 'loading…' : isCustom ? 'custom (admin)' : 'using defaults'}
          </span>
        </p>
      )}

      <div>
        <Link
          to={`/admin/aircraft-specs/${modelId}`}
          style={{
            display: 'inline-block',
            marginTop: '0.25rem',
            padding: '0.5rem 0.95rem',
            borderRadius: 6,
            background: r22Pending ? '#9ca3af' : '#111827',
            color: '#fff',
            textDecoration: 'none',
            fontSize: '0.85rem',
            fontWeight: 600,
            pointerEvents: r22Pending ? 'none' : 'auto',
          }}
          aria-disabled={r22Pending}
        >
          {r22Pending ? 'Coming soon' : 'Edit specs'}
        </Link>
      </div>
    </div>
  );
}

export default function AdminAircraftSpecs() {
  return (
    <AdminLayout>
      <div style={{ marginBottom: '1.5rem' }}>
        <h1 style={{ margin: 0, fontSize: '1.5rem', fontWeight: 700, color: '#111827' }}>
          Aircraft Specs
        </h1>
        <p style={{ margin: '0.4rem 0 0', fontSize: '0.85rem', color: '#6b7280', maxWidth: 720 }}>
          Manages the factory specification rows shown in the marketing-page tables
          on /aircraft/r22, /aircraft/r44, /aircraft/r66, /aircraft/r88. Edits push
          live immediately. Pages fall back to baked-in defaults if the admin doc
          is empty.
        </p>
      </div>

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
          gap: '1rem',
        }}
      >
        {AIRCRAFT_SPECS_MODELS.map((m) => (
          <ModelCard key={m} modelId={m} />
        ))}
      </div>
    </AdminLayout>
  );
}

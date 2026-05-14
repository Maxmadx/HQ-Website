// src/pages/admin/AdminSeo.jsx
//
// SEO admin dashboard (spec 15 MVP). Per-page meta editor.
// - Lists all canonical paths from seoRoutes
// - Click row -> edit title/description/ogImage
// - Save -> seo_overrides/<encoded-path> in Firestore
// - Live SERP preview at the top of the edit form

import { useState, useEffect, useMemo } from 'react';
import AdminLayout from '../../components/admin/AdminLayout';
import { PUBLIC_ROUTES as STATIC_ROUTES } from '../../lib/seoRoutes';
import { getMetaForPath } from '../../lib/getMetaForPath';
import { listOverrides, getOverrideForPath, saveOverride, clearOverride } from '../../lib/seoOverrides';

const SITE_URL = 'https://hqaviation.com';

function SerpPreview({ path, title, description }) {
  return (
    <div style={S.serp}>
      <div style={S.serpUrl}>{SITE_URL}{path}</div>
      <div style={S.serpTitle}>{title || '(empty title)'}</div>
      <div style={S.serpDesc}>{description || '(empty description)'}</div>
      <div style={S.serpHints}>
        <span style={{ color: (title?.length || 0) > 60 ? '#dc2626' : '#666' }}>
          Title: {(title?.length || 0)} / 60
        </span>
        <span style={{ color: (description?.length || 0) > 160 ? '#dc2626' : '#666' }}>
          Description: {(description?.length || 0)} / 160
        </span>
      </div>
    </div>
  );
}

function PageRow({ route, hasOverride, onSelect, isSelected }) {
  return (
    <button
      type="button"
      onClick={() => onSelect(route.path)}
      style={{
        ...S.row,
        ...(isSelected ? S.rowActive : {}),
      }}
    >
      <span style={S.rowPath}>{route.path}</span>
      <span style={S.rowMeta}>
        {hasOverride && <span style={S.badge}>override</span>}
        <span style={S.rowType}>{route.pageType}</span>
      </span>
    </button>
  );
}

export default function AdminSeo() {
  const [overrides, setOverrides] = useState({});  // path -> override doc
  const [loading, setLoading] = useState(true);
  const [selectedPath, setSelectedPath] = useState(null);
  const [form, setForm] = useState({ title: '', description: '', ogImage: '' });
  const [saving, setSaving] = useState(false);
  const [savedAt, setSavedAt] = useState(null);
  const [error, setError] = useState(null);

  // Load all overrides once
  useEffect(() => {
    listOverrides()
      .then((list) => {
        const map = {};
        for (const o of list) map[o.path] = o;
        setOverrides(map);
      })
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  // On row select, populate form with override or current defaults
  useEffect(() => {
    if (!selectedPath) return;
    setSaving(false);
    setSavedAt(null);
    setError(null);
    const o = overrides[selectedPath];
    if (o) {
      setForm({ title: o.title || '', description: o.description || '', ogImage: o.ogImage || '' });
    } else {
      const defaults = getMetaForPath(selectedPath) || {};
      setForm({ title: defaults.title || '', description: defaults.description || '', ogImage: defaults.ogImage || '' });
    }
  }, [selectedPath, overrides]);

  const defaults = useMemo(() => {
    if (!selectedPath) return null;
    return getMetaForPath(selectedPath) || {};
  }, [selectedPath]);

  async function handleSave() {
    setSaving(true);
    setError(null);
    try {
      await saveOverride(selectedPath, form);
      const fresh = await getOverrideForPath(selectedPath);
      setOverrides({ ...overrides, [selectedPath]: fresh });
      setSavedAt(new Date());
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  }

  async function handleRevert() {
    if (!window.confirm('Remove the override and restore code defaults?')) return;
    setSaving(true);
    try {
      await clearOverride(selectedPath);
      const map = { ...overrides };
      delete map[selectedPath];
      setOverrides(map);
      if (defaults) setForm({ title: defaults.title || '', description: defaults.description || '', ogImage: defaults.ogImage || '' });
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  }

  return (
    <AdminLayout>
      <div style={S.wrap}>
        <header style={S.header}>
          <h1 style={S.h1}>SEO Overrides</h1>
          <p style={S.intro}>Edit per-page title, description, and OG image without engineering. Edits apply within ~5 minutes of refresh (no full deploy).</p>
        </header>

        {loading && <div style={S.loading}>Loading...</div>}

        <div style={S.grid}>
          <aside style={S.list}>
            {STATIC_ROUTES.map((route) => (
              <PageRow
                key={route.path}
                route={route}
                hasOverride={!!overrides[route.path]}
                onSelect={setSelectedPath}
                isSelected={selectedPath === route.path}
              />
            ))}
          </aside>

          <section style={S.editor}>
            {!selectedPath && <div style={S.empty}>Select a page to edit.</div>}
            {selectedPath && (
              <>
                <h2 style={S.h2}>{selectedPath}</h2>
                <SerpPreview path={selectedPath} title={form.title} description={form.description} />

                <label style={S.label}>
                  <span style={S.labelText}>Title</span>
                  <input
                    style={S.input}
                    value={form.title}
                    onChange={(e) => setForm({ ...form, title: e.target.value })}
                    placeholder={defaults?.title || ''}
                  />
                </label>

                <label style={S.label}>
                  <span style={S.labelText}>Description</span>
                  <textarea
                    style={{ ...S.input, minHeight: 80 }}
                    value={form.description}
                    onChange={(e) => setForm({ ...form, description: e.target.value })}
                    placeholder={defaults?.description || ''}
                  />
                </label>

                <label style={S.label}>
                  <span style={S.labelText}>OG Image URL (optional)</span>
                  <input
                    style={S.input}
                    value={form.ogImage}
                    onChange={(e) => setForm({ ...form, ogImage: e.target.value })}
                    placeholder={defaults?.ogImage || '/og-default.jpg'}
                  />
                </label>

                {error && <div style={S.error}>{error}</div>}
                {savedAt && <div style={S.saved}>Saved at {savedAt.toLocaleTimeString()}</div>}

                <div style={S.actions}>
                  <button type="button" onClick={handleSave} disabled={saving} style={S.btnPrimary}>
                    {saving ? 'Saving...' : 'Save override'}
                  </button>
                  {overrides[selectedPath] && (
                    <button type="button" onClick={handleRevert} disabled={saving} style={S.btnDanger}>
                      Revert to code default
                    </button>
                  )}
                </div>
              </>
            )}
          </section>
        </div>
      </div>
    </AdminLayout>
  );
}

const S = {
  wrap: { padding: '32px 24px', maxWidth: 1200, margin: '0 auto', fontFamily: "'Space Grotesk', sans-serif" },
  header: { marginBottom: 24 },
  h1: { fontSize: '1.6rem', fontWeight: 700, margin: '0 0 8px' },
  h2: { fontSize: '1.1rem', fontWeight: 600, margin: '0 0 16px', color: '#444' },
  intro: { fontSize: '0.85rem', color: '#666', margin: 0, lineHeight: 1.5 },
  loading: { padding: 24, color: '#999' },
  grid: { display: 'grid', gridTemplateColumns: '300px 1fr', gap: 24, alignItems: 'start' },
  list: { display: 'flex', flexDirection: 'column', gap: 4, maxHeight: '70vh', overflowY: 'auto', border: '1px solid #e5e7eb', borderRadius: 8, padding: 8 },
  row: { display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '8px 10px', border: 'none', background: 'transparent', textAlign: 'left', cursor: 'pointer', borderRadius: 4, fontSize: '0.85rem' },
  rowActive: { background: '#1a1a1a', color: '#fff' },
  rowPath: { fontFamily: "'Share Tech Mono', monospace", fontSize: '0.78rem' },
  rowMeta: { display: 'flex', alignItems: 'center', gap: 6 },
  rowType: { fontSize: '0.65rem', color: '#999' },
  badge: { fontSize: '0.6rem', background: '#fbbf24', color: '#1a1a1a', padding: '2px 6px', borderRadius: 3, fontWeight: 700 },
  editor: { border: '1px solid #e5e7eb', borderRadius: 8, padding: 24, background: '#fafafa' },
  empty: { padding: 40, textAlign: 'center', color: '#999' },
  serp: { background: '#fff', border: '1px solid #e5e7eb', borderRadius: 6, padding: 12, marginBottom: 24 },
  serpUrl: { fontSize: '0.75rem', color: '#1a73e8' },
  serpTitle: { fontSize: '1.05rem', color: '#1a0dab', margin: '4px 0', fontWeight: 500 },
  serpDesc: { fontSize: '0.82rem', color: '#4d5156', lineHeight: 1.5 },
  serpHints: { fontSize: '0.7rem', display: 'flex', gap: 12, marginTop: 8 },
  label: { display: 'flex', flexDirection: 'column', gap: 6, marginBottom: 16 },
  labelText: { fontSize: '0.75rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em', color: '#444' },
  input: { padding: '10px 12px', border: '1px solid #d1d5db', borderRadius: 6, fontSize: '0.9rem', fontFamily: 'inherit' },
  error: { color: '#dc2626', fontSize: '0.85rem', marginBottom: 12, padding: 10, background: '#fef2f2', borderRadius: 4 },
  saved: { color: '#059669', fontSize: '0.85rem', marginBottom: 12 },
  actions: { display: 'flex', gap: 8 },
  btnPrimary: { padding: '10px 20px', background: '#1a1a1a', color: '#fff', border: 'none', borderRadius: 6, fontWeight: 600, cursor: 'pointer', fontSize: '0.85rem' },
  btnDanger: { padding: '10px 20px', background: '#fff', color: '#dc2626', border: '1px solid #dc2626', borderRadius: 6, fontWeight: 600, cursor: 'pointer', fontSize: '0.85rem' },
};

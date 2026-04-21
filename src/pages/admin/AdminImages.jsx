/**
 * AdminImages — visual image manager for every section of the website.
 *
 * On first load the admin auto-initialises Firestore from hardcoded defaults,
 * so it always shows the current live images — never "No image".
 *
 * Organised by page. Changes write to Firestore immediately and are reflected
 * on the live website on next page load.
 *
 * Firestore collection: site_images  (one document per section, id = section.id)
 */

import { useState, useEffect, useRef, useCallback } from 'react';
import {
  collection, getDocs, doc, setDoc, serverTimestamp,
} from 'firebase/firestore';
import AdminLayout from '../../components/admin/AdminLayout';
import { db } from '../../lib/firebase';
import { SECTIONS, SECTION_MAP, SECTIONS_BY_PAGE, PAGE_LABELS } from '../../lib/imageSections';
import { uid, uploadToStorage, persistSection } from '../../lib/imageHelpers';

// ─── Shared style atoms ───────────────────────────────────────────────────────

const S = {
  tag: (color = '#374151', bg = '#f3f4f6') => ({
    display: 'inline-block',
    fontSize: '0.6rem', fontWeight: 700, letterSpacing: '0.08em',
    textTransform: 'uppercase', padding: '2px 7px',
    borderRadius: '9999px', background: bg, color,
  }),
  btn: (bg = '#f3f4f6', color = '#374151') => ({
    border: 'none', borderRadius: '5px', cursor: 'pointer',
    fontWeight: 600, fontSize: '0.75rem', padding: '5px 11px',
    background: bg, color, lineHeight: 1.4,
  }),
};

const TYPE_COLOR = {
  single:   ['#1d4ed8', '#dbeafe'],
  gallery:  ['#065f46', '#d1fae5'],
  carousel: ['#7c3aed', '#ede9fe'],
  cards:    ['#92400e', '#fef3c7'],
};

// ─── Gallery thumbnail grid ───────────────────────────────────────────────────

function GalleryGrid({ sectionId, images, onImagesChange }) {
  const [uploading, setUploading] = useState(false);
  const addRef = useRef(null);

  function move(fromIdx, toIdx) {
    if (toIdx < 0 || toIdx >= images.length) return;
    const next = [...images];
    const [item] = next.splice(fromIdx, 1);
    next.splice(toIdx, 0, item);
    onImagesChange(sectionId, next.map((img, i) => ({ ...img, order: i })));
  }

  function remove(idx) {
    if (!window.confirm('Remove this image from the gallery?')) return;
    onImagesChange(sectionId, images.filter((_, i) => i !== idx).map((img, i) => ({ ...img, order: i })));
  }

  async function replaceAt(idx, file) {
    setUploading(idx);
    try {
      const url = await uploadToStorage(sectionId, file);
      const next = images.map((img, i) => i === idx ? { ...img, url } : img);
      onImagesChange(sectionId, next);
    } finally {
      setUploading(false);
    }
  }

  async function addNew(file) {
    setUploading('new');
    try {
      const url = await uploadToStorage(sectionId, file);
      onImagesChange(sectionId, [...images, { id: uid(), url, alt: '', order: images.length }]);
    } finally {
      setUploading(false);
    }
  }

  function updateAlt(idx, alt) {
    onImagesChange(sectionId, images.map((img, i) => i === idx ? { ...img, alt } : img));
  }

  return (
    <div>
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(140px, 1fr))',
        gap: '0.75rem',
        marginBottom: '0.75rem',
      }}>
        {images.map((img, idx) => (
          <GalleryTile
            key={img.id}
            img={img}
            idx={idx}
            total={images.length}
            uploading={uploading === idx}
            onMoveLeft={() => move(idx, idx - 1)}
            onMoveRight={() => move(idx, idx + 1)}
            onRemove={() => remove(idx)}
            onReplace={(file) => replaceAt(idx, file)}
            onAltChange={(alt) => updateAlt(idx, alt)}
          />
        ))}

        {/* Add button tile */}
        <label style={{
          display: 'flex', flexDirection: 'column', alignItems: 'center',
          justifyContent: 'center', gap: '0.4rem',
          minHeight: '120px', border: '2px dashed #d1d5db',
          borderRadius: '8px', cursor: uploading === 'new' ? 'wait' : 'pointer',
          color: '#9ca3af', background: '#fafafa', transition: 'border-color 0.2s',
        }}
          onMouseOver={(e) => e.currentTarget.style.borderColor = '#6b7280'}
          onMouseOut={(e) => e.currentTarget.style.borderColor = '#d1d5db'}
        >
          <input ref={addRef} type="file" accept="image/*" style={{ display: 'none' }}
            onChange={(e) => { const f = e.target.files[0]; if (f) addNew(f); e.target.value = ''; }}
            disabled={!!uploading}
          />
          <span style={{ fontSize: '1.5rem' }}>{uploading === 'new' ? '⏳' : '+'}</span>
          <span style={{ fontSize: '0.7rem', fontWeight: 600 }}>
            {uploading === 'new' ? 'Uploading…' : 'Add Image'}
          </span>
        </label>
      </div>
      <p style={{ margin: 0, fontSize: '0.75rem', color: '#9ca3af' }}>
        {images.length} image{images.length !== 1 ? 's' : ''} · drag reorder with ← →
      </p>
    </div>
  );
}

function GalleryTile({ img, idx, total, uploading, onMoveLeft, onMoveRight, onRemove, onReplace, onAltChange }) {
  const [editAlt, setEditAlt] = useState(false);
  const [altVal, setAltVal] = useState(img.alt || '');
  const fileRef = useRef(null);

  function commitAlt() {
    onAltChange(altVal);
    setEditAlt(false);
  }

  return (
    <div style={{
      background: '#fff', border: '1px solid #e5e7eb', borderRadius: '8px',
      overflow: 'hidden', display: 'flex', flexDirection: 'column',
    }}>
      {/* Image — click to replace */}
      <div
        onClick={() => fileRef.current?.click()}
        style={{
          height: '100px', background: '#f3f4f6', overflow: 'hidden',
          cursor: uploading ? 'wait' : 'pointer', position: 'relative', flexShrink: 0,
        }}
        title="Click to replace image"
      >
        {img.url ? (
          <img src={img.url} alt={img.alt} style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
        ) : (
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%', fontSize: '1.5rem', color: '#9ca3af' }}>📷</div>
        )}
        <div style={{
          position: 'absolute', inset: 0, background: 'rgba(0,0,0,0)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          transition: 'background 0.15s', fontSize: '0.7rem', fontWeight: 700,
          color: '#fff', opacity: 0,
        }}
          onMouseOver={(e) => { e.currentTarget.style.background = 'rgba(0,0,0,0.45)'; e.currentTarget.style.opacity = '1'; }}
          onMouseOut={(e) => { e.currentTarget.style.background = 'rgba(0,0,0,0)'; e.currentTarget.style.opacity = '0'; }}
        >
          {uploading ? 'Uploading…' : 'Replace'}
        </div>
        <input ref={fileRef} type="file" accept="image/*" style={{ display: 'none' }}
          onChange={(e) => { const f = e.target.files[0]; if (f) onReplace(f); e.target.value = ''; }}
        />
        {/* Position badge */}
        <div style={{
          position: 'absolute', top: 4, left: 4,
          background: 'rgba(0,0,0,0.55)', color: '#fff',
          fontSize: '0.6rem', fontWeight: 700, padding: '1px 5px', borderRadius: '3px',
        }}>
          {idx + 1}
        </div>
      </div>

      {/* Alt text */}
      <div style={{ padding: '0.4rem 0.5rem', flex: 1 }}>
        {editAlt ? (
          <input
            autoFocus
            value={altVal}
            onChange={(e) => setAltVal(e.target.value)}
            onBlur={commitAlt}
            onKeyDown={(e) => e.key === 'Enter' && commitAlt()}
            placeholder="Alt text…"
            style={{ width: '100%', fontSize: '0.7rem', border: '1px solid #d1d5db', borderRadius: '3px', padding: '2px 4px', boxSizing: 'border-box' }}
          />
        ) : (
          <div
            onClick={() => setEditAlt(true)}
            style={{ fontSize: '0.7rem', color: img.alt ? '#374151' : '#9ca3af', cursor: 'text', fontStyle: img.alt ? 'normal' : 'italic' }}
          >
            {img.alt || 'Add alt text…'}
          </div>
        )}
      </div>

      {/* Controls */}
      <div style={{ display: 'flex', borderTop: '1px solid #f3f4f6', padding: '0.3rem 0.4rem', gap: '0.25rem' }}>
        <button onClick={onMoveLeft}  disabled={idx === 0}           style={{ ...S.btn(), padding: '2px 7px', opacity: idx === 0 ? 0.3 : 1 }}>←</button>
        <button onClick={onMoveRight} disabled={idx === total - 1}   style={{ ...S.btn(), padding: '2px 7px', opacity: idx === total - 1 ? 0.3 : 1 }}>→</button>
        <button onClick={onRemove} style={{ ...S.btn('none', '#dc2626'), marginLeft: 'auto', padding: '2px 7px' }}>×</button>
      </div>
    </div>
  );
}

// ─── Single image section ─────────────────────────────────────────────────────

function SingleSection({ sectionId, images, onImagesChange }) {
  const [uploading, setUploading] = useState(false);
  const img = images[0] || {};
  const fileRef = useRef(null);

  async function replace(file) {
    setUploading(true);
    try {
      const url = await uploadToStorage(sectionId, file);
      onImagesChange(sectionId, [{ ...img, url }]);
    } finally {
      setUploading(false);
    }
  }

  function updateAlt(alt) {
    onImagesChange(sectionId, [{ ...img, alt }]);
  }

  return (
    <div style={{ display: 'flex', gap: '1.25rem', alignItems: 'flex-start' }}>
      {/* Preview */}
      <div
        onClick={() => fileRef.current?.click()}
        style={{
          width: '220px', height: '140px', flexShrink: 0, borderRadius: '6px',
          background: '#f3f4f6', overflow: 'hidden', cursor: uploading ? 'wait' : 'pointer',
          position: 'relative', border: '1px solid #e5e7eb',
        }}
        title="Click to replace image"
      >
        {img.url ? (
          <img src={img.url} alt={img.alt} style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
        ) : (
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%', color: '#9ca3af', fontSize: '1.75rem' }}>📷</div>
        )}
        <div style={{
          position: 'absolute', inset: 0, background: 'rgba(0,0,0,0)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          transition: 'background 0.15s', fontSize: '0.75rem', fontWeight: 700, color: '#fff', opacity: 0,
        }}
          onMouseOver={(e) => { e.currentTarget.style.background = 'rgba(0,0,0,0.45)'; e.currentTarget.style.opacity = '1'; }}
          onMouseOut={(e) => { e.currentTarget.style.background = 'rgba(0,0,0,0)'; e.currentTarget.style.opacity = '0'; }}
        >
          {uploading ? 'Uploading…' : 'Click to replace'}
        </div>
        <input ref={fileRef} type="file" accept="image/*" style={{ display: 'none' }}
          onChange={(e) => { const f = e.target.files[0]; if (f) replace(f); e.target.value = ''; }}
        />
      </div>

      {/* Alt text + info */}
      <div style={{ flex: 1 }}>
        <label style={{ display: 'block', fontSize: '0.7rem', fontWeight: 600, color: '#374151', marginBottom: '0.25rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Alt Text</label>
        <input
          value={img.alt || ''}
          onChange={(e) => updateAlt(e.target.value)}
          placeholder="Describe the image for accessibility…"
          style={{ width: '100%', padding: '0.4rem 0.6rem', border: '1px solid #d1d5db', borderRadius: '5px', fontSize: '0.8rem', boxSizing: 'border-box', marginBottom: '0.75rem' }}
        />
        <button
          onClick={() => fileRef.current?.click()}
          disabled={uploading}
          style={{ ...S.btn('#111827', '#fff'), padding: '0.5rem 1.25rem', fontSize: '0.8rem' }}
        >
          {uploading ? 'Uploading…' : img.url ? 'Replace Image' : 'Upload Image'}
        </button>
      </div>
    </div>
  );
}

// ─── Carousel / cards section (fixed labelled slots) ─────────────────────────

function CardsSection({ sectionId, section, images, onImagesChange }) {
  const [uploading, setUploading] = useState(null);
  const fileRefs = useRef({});

  async function replaceAt(idx, file) {
    setUploading(idx);
    try {
      const url = await uploadToStorage(sectionId, file);
      const next = images.map((img, i) => i === idx ? { ...img, url } : img);
      onImagesChange(sectionId, next);
    } finally {
      setUploading(null);
    }
  }

  function updateAlt(idx, alt) {
    onImagesChange(sectionId, images.map((img, i) => i === idx ? { ...img, alt } : img));
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
      {(section.slideLabels || []).map((label, idx) => {
        const img = images[idx] || {};
        const isUploading = uploading === idx;
        return (
          <div key={idx} style={{ display: 'flex', gap: '0.75rem', alignItems: 'center', padding: '0.6rem 0.75rem', background: '#fff', border: '1px solid #e5e7eb', borderRadius: '7px' }}>
            {/* Slot label */}
            <div style={{ width: '160px', flexShrink: 0, fontSize: '0.8rem', fontWeight: 600, color: '#374151' }}>{label}</div>

            {/* Thumbnail */}
            <div
              onClick={() => fileRefs.current[idx]?.click()}
              style={{ width: '90px', height: '60px', flexShrink: 0, borderRadius: '5px', background: '#f3f4f6', overflow: 'hidden', cursor: isUploading ? 'wait' : 'pointer', position: 'relative', border: '1px solid #e5e7eb' }}
              title="Click to replace"
            >
              {img.url ? (
                <img src={img.url} alt={img.alt} style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
              ) : (
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%', color: '#9ca3af', fontSize: '1.1rem' }}>📷</div>
              )}
              {isUploading && (
                <div style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontSize: '0.65rem', fontWeight: 700 }}>…</div>
              )}
              <input
                ref={(el) => { fileRefs.current[idx] = el; }}
                type="file" accept="image/*" style={{ display: 'none' }}
                onChange={(e) => { const f = e.target.files[0]; if (f) replaceAt(idx, f); e.target.value = ''; }}
              />
            </div>

            {/* Alt text */}
            <input
              value={img.alt || ''}
              onChange={(e) => updateAlt(idx, e.target.value)}
              placeholder="Alt text…"
              style={{ flex: 1, padding: '0.35rem 0.5rem', border: '1px solid #e5e7eb', borderRadius: '4px', fontSize: '0.75rem' }}
            />

            {/* Replace button */}
            <button
              onClick={() => fileRefs.current[idx]?.click()}
              disabled={isUploading}
              style={{ ...S.btn('#f3f4f6'), whiteSpace: 'nowrap', flexShrink: 0 }}
            >
              {isUploading ? 'Uploading…' : 'Replace'}
            </button>
          </div>
        );
      })}
    </div>
  );
}

// ─── Section card wrapper ─────────────────────────────────────────────────────

function SectionCard({ section, images, fromFirestore, onImagesChange }) {
  const [col, bg] = TYPE_COLOR[section.type] || ['#374151', '#f3f4f6'];
  const pageUrl = PAGE_URL[section.page];

  return (
    <div style={{ background: '#fff', border: '1px solid #e5e7eb', borderRadius: '10px', overflow: 'hidden', marginBottom: '1rem' }}>
      {/* Header */}
      <div style={{ padding: '0.875rem 1.125rem', borderBottom: '1px solid #f3f4f6', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
        <div style={{ flex: 1 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.2rem' }}>
            <span style={{ fontWeight: 700, fontSize: '0.9rem', color: '#111827' }}>{section.name}</span>
            <span style={S.tag(col, bg)}>{section.type}</span>
          </div>
          <p style={{ margin: 0, fontSize: '0.75rem', color: '#6b7280' }}>{section.hint}</p>
        </div>
        <div style={{ flexShrink: 0, display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
          {pageUrl && (
            <a
              href={`${pageUrl}?highlight=${section.id}`}
              target="_blank"
              rel="noreferrer"
              style={{ fontSize: '0.68rem', fontWeight: 600, color: 'rgb(96,165,250)', textDecoration: 'none', padding: '2px 6px', borderRadius: '4px', background: 'rgb(239,246,255)', whiteSpace: 'nowrap' }}
            >
              Find on page ↗
            </a>
          )}
          {fromFirestore ? (
            <span style={S.tag('#065f46', '#d1fae5')}>● Live</span>
          ) : (
            <span style={S.tag('#6b7280', '#f3f4f6')}>Default</span>
          )}
        </div>
      </div>

      {/* Content */}
      <div style={{ padding: '1rem 1.125rem' }}>
        {section.type === 'single' && (
          <SingleSection sectionId={section.id} images={images} onImagesChange={onImagesChange} />
        )}
        {section.type === 'gallery' && (
          <GalleryGrid sectionId={section.id} images={images} onImagesChange={onImagesChange} />
        )}
        {(section.type === 'carousel' || section.type === 'cards') && (
          <CardsSection sectionId={section.id} section={section} images={images} onImagesChange={onImagesChange} />
        )}
      </div>
    </div>
  );
}

// ─── Main page ────────────────────────────────────────────────────────────────

const PAGE_ORDER = [
  'home', 'training', 'discovery', 'ppl', 'type-rating',
  'sfh', 'sales', 'rebuilds', 'expeditions', 'maintenance',
  'about', 'helicopter-tour',
];

const PAGE_URL = {
  home:              '/',
  training:          '/training',
  discovery:         '/training/trial-lessons',
  ppl:               '/training/ppl',
  'type-rating':     '/training/type-rating',
  sfh:               '/self-fly-hire',
  sales:             '/sales/new',
  rebuilds:          '/sales/rebuilds',
  expeditions:       '/expeditions',
  maintenance:       '/maintenance',
  about:             '/about',
  'helicopter-tour': '/helicopter-tour-of-london',
};

export default function AdminImages() {
  // sectionImages: { [sectionId]: images[] }
  const [sectionImages, setSectionImages] = useState(() =>
    Object.fromEntries(SECTIONS.map((s) => [s.id, s.images])),
  );
  // which sections have Firestore docs
  const [firestoreIds, setFirestoreIds] = useState(new Set());
  const [loading, setLoading] = useState(true);
  const [initProgress, setInitProgress] = useState(null); // null | 'initialising' | 'done'

  const [activePage, setActivePage] = useState('all');

  // ── On mount: load all Firestore data + auto-init missing sections ──────────
  useEffect(() => {
    async function loadAndInit() {
      // 1. Load whatever's in Firestore
      const snap = await getDocs(collection(db, 'site_images'));
      const existing = new Set();
      const updates = {};
      snap.forEach((docSnap) => {
        const data = docSnap.data();
        if (data.images?.length > 0) {
          existing.add(docSnap.id);
          updates[docSnap.id] = [...data.images].sort((a, b) => (a.order ?? 0) - (b.order ?? 0));
        }
      });

      setFirestoreIds(existing);
      if (Object.keys(updates).length > 0) {
        setSectionImages((prev) => ({ ...prev, ...updates }));
      }

      // 2. Auto-initialise any sections missing from Firestore
      const missing = SECTIONS.filter((s) => !existing.has(s.id));
      if (missing.length > 0) {
        setInitProgress('initialising');
        await Promise.all(
          missing.map((s) =>
            persistSection(s.id, s.images.map((img, i) => ({ ...img, order: i }))).catch(() => {}),
          ),
        );
        setFirestoreIds(new Set(SECTIONS.map((s) => s.id)));
        setInitProgress('done');
      }

      setLoading(false);
    }

    loadAndInit().catch(() => setLoading(false));
  }, []);

  // ── Handle image changes: update state + persist to Firestore ──────────────
  const handleImagesChange = useCallback((sectionId, newImages) => {
    setSectionImages((prev) => ({ ...prev, [sectionId]: newImages }));
    setFirestoreIds((prev) => new Set([...prev, sectionId]));
    persistSection(sectionId, newImages).catch(console.error);
  }, []);

  // ── Filtered sections ──────────────────────────────────────────────────────
  const displayedSections = activePage === 'all'
    ? SECTIONS
    : SECTIONS.filter((s) => s.page === activePage);

  const groupedByPage = PAGE_ORDER.reduce((acc, page) => {
    const inPage = displayedSections.filter((s) => s.page === page);
    if (inPage.length) acc.push({ page, sections: inPage });
    return acc;
  }, []);

  // ── Page filter tabs ────────────────────────────────────────────────────────
  const tabPages = ['all', ...PAGE_ORDER.filter((p) => SECTIONS_BY_PAGE[p])];

  const tabStyle = (active) => ({
    padding: '0.4rem 1rem', border: 'none', borderRadius: '6px', cursor: 'pointer',
    fontWeight: 600, fontSize: '0.8rem', transition: 'all 0.15s',
    background: active ? '#111827' : 'transparent', color: active ? '#fff' : '#6b7280',
  });

  return (
    <AdminLayout>
      {/* Header */}
      <div style={{ marginBottom: '1.5rem' }}>
        <h1 style={{ fontSize: '1.5rem', fontWeight: 700, color: '#111827', margin: '0 0 0.25rem' }}>Images</h1>
        <p style={{ margin: 0, color: '#6b7280', fontSize: '0.875rem' }}>
          Manage every photo on the website. Changes go live on the next page load.
        </p>
      </div>

      {/* Init notice */}
      {initProgress === 'initialising' && (
        <div style={{ background: '#fef3c7', border: '1px solid #fcd34d', borderRadius: '8px', padding: '0.75rem 1rem', marginBottom: '1rem', fontSize: '0.8rem', color: '#92400e' }}>
          Setting up image library from current website defaults…
        </div>
      )}

      {/* Page filter */}
      <div style={{ display: 'flex', gap: '0.2rem', background: '#f3f4f6', borderRadius: '8px', padding: '0.25rem', marginBottom: '1.5rem', width: 'fit-content', flexWrap: 'wrap' }}>
        {tabPages.map((p) => (
          <button key={p} onClick={() => setActivePage(p)} style={tabStyle(activePage === p)}>
            {p === 'all' ? 'All Pages' : (PAGE_URL[p] || p)}
          </button>
        ))}
      </div>

      {loading ? (
        <div style={{ textAlign: 'center', padding: '3rem', color: '#6b7280' }}>Loading image library…</div>
      ) : (
        groupedByPage.map(({ page, sections }) => (
          <div key={page} style={{ marginBottom: '2.5rem' }}>
            {/* Page heading */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1rem', paddingBottom: '0.5rem', borderBottom: '2px solid #f3f4f6' }}>
              <h2 style={{ margin: 0, fontSize: '1rem', fontWeight: 700, color: '#111827', fontFamily: 'monospace' }}>{PAGE_URL[page] || page}</h2>
              <span style={{ fontSize: '0.75rem', color: '#9ca3af' }}>{PAGE_LABELS[page]}</span>
              <span style={{ fontSize: '0.75rem', color: '#9ca3af' }}>· {sections.length} section{sections.length !== 1 ? 's' : ''}</span>
            </div>

            {sections.map((section) => (
              <SectionCard
                key={section.id}
                section={section}
                images={sectionImages[section.id] || section.images}
                fromFirestore={firestoreIds.has(section.id)}
                onImagesChange={handleImagesChange}
              />
            ))}
          </div>
        ))
      )}
    </AdminLayout>
  );
}

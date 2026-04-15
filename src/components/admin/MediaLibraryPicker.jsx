/**
 * MediaLibraryPicker — full-screen modal for browsing and picking images
 * from the central Firebase media library.
 *
 * Props:
 *   open     boolean  — whether the modal is visible
 *   onClose  ()=>void — called when the admin dismisses without picking
 *   onPick   ({url, alt})=>void — called when an image is selected
 *
 * Uploading new images here adds them to the media library immediately
 * so they're pickable in the same session.
 */

import { useState, useEffect, useRef } from 'react';
import {
  listMediaLibrary,
  uploadToMediaLibrary,
  deleteFromMediaLibrary,
  fmtSize,
} from '../../lib/mediaLibrary';

export default function MediaLibraryPicker({ open, onClose, onPick }) {
  const [images,    setImages]    = useState([]);
  const [loading,   setLoading]   = useState(false);
  const [search,    setSearch]    = useState('');
  const [uploading, setUploading] = useState(false);
  const [progress,  setProgress]  = useState([]); // names of files currently uploading
  const [hoveredId, setHoveredId] = useState(null);
  const fileRef = useRef(null);

  // Fetch whenever the modal opens
  useEffect(() => {
    if (!open) return;
    setSearch('');
    setLoading(true);
    listMediaLibrary()
      .then(setImages)
      .catch(() => setImages([]))
      .finally(() => setLoading(false));
  }, [open]);

  if (!open) return null;

  const filtered = search.trim()
    ? images.filter((img) =>
        img.name?.toLowerCase().includes(search.trim().toLowerCase()),
      )
    : images;

  // ── Upload ──────────────────────────────────────────────────────────────────

  async function handleUpload(files) {
    const fileArr = Array.from(files);
    setUploading(true);
    setProgress(fileArr.map((f) => f.name));
    const results = [];
    for (const file of fileArr) {
      try {
        const img = await uploadToMediaLibrary(file);
        results.push(img);
        setProgress((prev) => prev.filter((n) => n !== file.name));
      } catch (e) {
        console.error('Upload failed:', e);
        setProgress((prev) => prev.filter((n) => n !== file.name));
      }
    }
    setImages((prev) => [...results, ...prev]);
    setUploading(false);
  }

  // ── Delete ──────────────────────────────────────────────────────────────────

  async function handleDelete(e, img) {
    e.stopPropagation();
    if (!window.confirm(`Delete "${img.name}"?\n\nIf this image is in use on the site it will show as broken until replaced.`)) return;
    try {
      await deleteFromMediaLibrary(img.id, img.storagePath);
      setImages((prev) => prev.filter((i) => i.id !== img.id));
    } catch (err) {
      console.error(err);
    }
  }

  // ── Drag-and-drop support ───────────────────────────────────────────────────

  function onDrop(e) {
    e.preventDefault();
    const files = e.dataTransfer?.files;
    if (files?.length) handleUpload(files);
  }

  // ── Render ──────────────────────────────────────────────────────────────────

  return (
    <div style={overlay} onClick={onClose} onDragOver={(e) => e.preventDefault()} onDrop={onDrop}>
      <div style={panel} onClick={(e) => e.stopPropagation()}>

        {/* ── Header ─────────────────────────────────────────────────────── */}
        <div style={header}>
          <div style={headerLeft}>
            <span style={headerTitle}>Media Library</span>
            <span style={headerCount}>{images.length} image{images.length !== 1 ? 's' : ''}</span>
          </div>
          <div style={headerControls}>
            <input
              style={searchInput}
              placeholder="Search by filename…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              autoFocus
            />
            <label style={uploadLabel(uploading)} title="Upload new images to the library">
              <input
                ref={fileRef}
                type="file"
                accept="image/*"
                multiple
                style={{ display: 'none' }}
                disabled={uploading}
                onChange={(e) => { handleUpload(e.target.files); e.target.value = ''; }}
              />
              {uploading ? 'Uploading…' : '↑ Upload new'}
            </label>
            <button style={closeBtn} onClick={onClose} title="Cancel">✕</button>
          </div>
        </div>

        {/* Upload progress */}
        {progress.length > 0 && (
          <div style={progressBar}>
            {progress.map((name) => (
              <span key={name} style={progressItem}>↑ {name}</span>
            ))}
          </div>
        )}

        {/* ── Body ───────────────────────────────────────────────────────── */}
        <div style={body}>
          {loading ? (
            <div style={emptyMsg}>Loading library…</div>
          ) : filtered.length === 0 ? (
            <div style={emptyMsg}>
              {search
                ? 'No images match your search.'
                : 'No images yet — upload some above or drag files onto this window.'}
            </div>
          ) : (
            <div style={grid}>
              {filtered.map((img) => {
                const hovered = hoveredId === img.id;
                return (
                <div
                  key={img.id}
                  style={{ ...imgCard, borderColor: hovered ? '#0f172a' : '#e5e7eb', boxShadow: hovered ? '0 0 0 2px #0f172a' : 'none' }}
                  onClick={() => onPick({ url: img.url, alt: img.name?.replace(/\.[^.]+$/, '') ?? '' })}
                  onMouseEnter={() => setHoveredId(img.id)}
                  onMouseLeave={() => setHoveredId(null)}
                  title={`Pick: ${img.name}`}
                >
                  <div style={imgWrap}>
                    <img src={img.url} alt={img.name} style={imgEl} loading="lazy" />
                    <div style={{ ...pickOverlay, opacity: hovered ? 1 : 0, background: hovered ? 'rgba(15,23,42,0.45)' : 'transparent' }}>Pick</div>
                    <button
                      style={{ ...deleteImgBtn, opacity: hovered ? 1 : 0 }}
                      onClick={(e) => handleDelete(e, img)}
                      title="Delete from library"
                    >
                      ✕
                    </button>
                  </div>
                  <div style={imgMeta}>
                    <span style={imgName} title={img.name}>{img.name}</span>
                    <span style={imgSize}>{fmtSize(img.size)}</span>
                  </div>
                </div>
              );})}
            </div>
          )}
        </div>

        {/* ── Footer ─────────────────────────────────────────────────────── */}
        <div style={footer}>
          <span style={footerHint}>
            Click an image to pick it · Drag files here or use ↑ Upload to add new images
          </span>
          <button style={cancelBtn} onClick={onClose}>Cancel</button>
        </div>
      </div>
    </div>
  );
}

// ─── Styles ───────────────────────────────────────────────────────────────────

const overlay = {
  position: 'fixed', inset: 0, zIndex: 100001,
  background: 'rgba(0,0,0,0.65)',
  display: 'flex', alignItems: 'center', justifyContent: 'center',
  padding: 24,
  fontFamily: "'Inter', 'Space Grotesk', sans-serif",
};

const panel = {
  background: '#fff',
  borderRadius: 14,
  width: '100%',
  maxWidth: 980,
  maxHeight: '88vh',
  display: 'flex',
  flexDirection: 'column',
  overflow: 'hidden',
  boxShadow: '0 24px 80px rgba(0,0,0,0.35)',
};

const header = {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  padding: '14px 18px',
  borderBottom: '1px solid #e5e7eb',
  gap: 12,
  flexShrink: 0,
  flexWrap: 'wrap',
};

const headerLeft = {
  display: 'flex', alignItems: 'center', gap: 10,
};

const headerTitle = {
  fontWeight: 700, fontSize: '1rem', color: '#0f172a',
};

const headerCount = {
  fontSize: '0.72rem', color: '#94a3b8', fontWeight: 500,
};

const headerControls = {
  display: 'flex', alignItems: 'center', gap: 8,
};

const searchInput = {
  border: '1px solid #d1d5db', borderRadius: 6,
  padding: '6px 11px', fontSize: '0.8rem',
  outline: 'none', width: 220, color: '#374151',
};

const uploadLabel = (disabled) => ({
  display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
  padding: '6px 14px', borderRadius: 6,
  background: disabled ? '#f1f5f9' : '#0f172a',
  color: disabled ? '#94a3b8' : '#fff',
  fontSize: '0.78rem', fontWeight: 700,
  cursor: disabled ? 'not-allowed' : 'pointer',
  whiteSpace: 'nowrap',
  transition: 'background 0.15s',
});

const closeBtn = {
  width: 30, height: 30,
  border: '1px solid #e5e7eb', borderRadius: 6,
  background: '#f9fafb', cursor: 'pointer',
  color: '#6b7280', fontSize: '0.9rem',
  display: 'flex', alignItems: 'center', justifyContent: 'center',
  flexShrink: 0,
};

const progressBar = {
  padding: '6px 18px',
  background: '#fefce8',
  borderBottom: '1px solid #fde68a',
  display: 'flex', gap: 12, flexWrap: 'wrap',
  flexShrink: 0,
};

const progressItem = {
  fontSize: '0.7rem', color: '#92400e', fontWeight: 600,
};

const body = {
  flex: 1, overflowY: 'auto', padding: '16px 18px',
};

const emptyMsg = {
  textAlign: 'center', color: '#94a3b8',
  fontSize: '0.85rem', padding: '48px 0',
};

const grid = {
  display: 'grid',
  gridTemplateColumns: 'repeat(auto-fill, minmax(150px, 1fr))',
  gap: 12,
};

const imgCard = {
  cursor: 'pointer',
  borderRadius: 8,
  overflow: 'hidden',
  border: '1px solid #e5e7eb',
  background: '#f8fafc',
  transition: 'border-color 0.15s, box-shadow 0.15s',
};

const imgWrap = {
  position: 'relative',
  aspectRatio: '4/3',
  overflow: 'hidden',
  background: '#e2e8f0',
};

const imgEl = {
  width: '100%', height: '100%',
  objectFit: 'cover', display: 'block',
};

const pickOverlay = {
  position: 'absolute', inset: 0,
  background: 'rgba(15,23,42,0)',
  color: '#fff', fontSize: '0.75rem',
  fontWeight: 700, letterSpacing: '0.06em',
  textTransform: 'uppercase',
  display: 'flex', alignItems: 'center', justifyContent: 'center',
  opacity: 0,
  transition: 'opacity 0.15s, background 0.15s',
  // Note: hover done via CSS class; here we use onMouseEnter inline for simplicity
};

const deleteImgBtn = {
  position: 'absolute', top: 5, right: 5,
  width: 22, height: 22,
  border: 'none', borderRadius: 4,
  background: 'rgba(239,68,68,0.85)',
  color: '#fff', fontSize: '0.65rem',
  cursor: 'pointer',
  display: 'flex', alignItems: 'center', justifyContent: 'center',
  opacity: 0,
  transition: 'opacity 0.15s',
  fontWeight: 700,
  // Shown via parent hover — handled with onMouseEnter on imgCard
  // We inject inline style overrides via React event handlers
};

const imgMeta = {
  padding: '6px 8px',
  display: 'flex', flexDirection: 'column', gap: 1,
};

const imgName = {
  fontSize: '0.68rem', color: '#374151', fontWeight: 600,
  whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
};

const imgSize = {
  fontSize: '0.6rem', color: '#94a3b8',
};

const footer = {
  borderTop: '1px solid #e5e7eb',
  padding: '10px 18px',
  display: 'flex', alignItems: 'center', justifyContent: 'space-between',
  gap: 12, flexShrink: 0,
};

const footerHint = {
  fontSize: '0.68rem', color: '#94a3b8',
};

const cancelBtn = {
  border: '1px solid #d1d5db', borderRadius: 6,
  padding: '6px 16px', background: '#f9fafb',
  color: '#374151', fontWeight: 600,
  fontSize: '0.8rem', cursor: 'pointer',
};

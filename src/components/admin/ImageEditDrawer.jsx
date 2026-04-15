/**
 * ImageEditDrawer — slide-in panel for editing a specific image section.
 *
 * Opening an image slot now opens MediaLibraryPicker so the admin picks
 * from already-uploaded Firebase images rather than uploading on the spot.
 * New images can be uploaded inside the picker or via the Media Library
 * panel at the bottom of /admin/edit-images-mode.
 */

import { useState, useEffect, useRef, useCallback } from 'react';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../../lib/firebase';
import { SECTION_MAP } from '../../lib/imageSections';
import { uid, persistSection } from '../../lib/imageHelpers';
import { useEditMode } from '../../context/EditModeContext';
import MediaLibraryPicker from './MediaLibraryPicker';

export default function ImageEditDrawer() {
  const { activeSection, closeSection } = useEditMode();
  const [images,     setImages]     = useState([]);
  const [saving,     setSaving]     = useState(false);
  const [saved,      setSaved]      = useState(false);
  const [pickerOpen, setPickerOpen] = useState(false);

  // Stores the callback to invoke when the picker returns a selection.
  // We use a ref so we can store a function without setState's updater-fn ambiguity.
  const pickerCallbackRef = useRef(null);

  const section = activeSection ? SECTION_MAP[activeSection] : null;
  const isOpen  = !!activeSection && !!section;

  // Load images whenever the active section changes
  useEffect(() => {
    if (!activeSection || !section) { setImages([]); return; }

    // Seed defaults immediately so the UI isn't blank
    setImages(section.images);

    // Then fetch Firestore overrides
    getDoc(doc(db, 'site_images', activeSection))
      .then((snap) => {
        if (snap.exists()) {
          const data = snap.data();
          if (data.images?.length > 0) {
            setImages([...data.images].sort((a, b) => (a.order ?? 0) - (b.order ?? 0)));
          }
        }
      })
      .catch(() => {});
  }, [activeSection]); // eslint-disable-line react-hooks/exhaustive-deps

  const save = useCallback(async (nextImages) => {
    if (!activeSection) return;
    setSaving(true);
    try {
      await persistSection(activeSection, nextImages);
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
    } catch (e) {
      console.error(e);
    } finally {
      setSaving(false);
    }
  }, [activeSection]);

  const updateImages = useCallback((nextImages) => {
    setImages(nextImages);
    save(nextImages);
  }, [save]);

  // ── Handlers ─────────────────────────────────────────────────────────────

  function move(fromIdx, toIdx) {
    if (toIdx < 0 || toIdx >= images.length) return;
    const next = [...images];
    const [item] = next.splice(fromIdx, 1);
    next.splice(toIdx, 0, item);
    updateImages(next.map((img, i) => ({ ...img, order: i })));
  }

  function remove(idx) {
    if (!window.confirm('Remove this image from the section?')) return;
    const next = images.filter((_, i) => i !== idx);
    updateImages(next.map((img, i) => ({ ...img, order: i })));
  }

  function updateAlt(idx, alt) {
    const next = images.map((img, i) => i === idx ? { ...img, alt } : img);
    setImages(next);
  }

  function commitAlt() {
    save(images);
  }

  // Open picker to replace the image at `idx`
  function openPickerForReplace(idx) {
    pickerCallbackRef.current = ({ url, alt }) => {
      const next = images.map((img, i) => i === idx ? { ...img, url, alt } : img);
      updateImages(next);
    };
    setPickerOpen(true);
  }

  // Open picker to add a new image (gallery only)
  function openPickerForAdd() {
    pickerCallbackRef.current = ({ url, alt }) => {
      const next = [...images, { id: uid(), url, alt, order: images.length }];
      updateImages(next.map((img, i) => ({ ...img, order: i })));
    };
    setPickerOpen(true);
  }

  function handlePickerPick(picked) {
    pickerCallbackRef.current?.(picked);
    pickerCallbackRef.current = null;
    setPickerOpen(false);
  }

  const isGallery  = section?.type === 'gallery';
  const isCarousel = section?.type === 'carousel';
  const isCards    = section?.type === 'cards';

  // ── Render ────────────────────────────────────────────────────────────────

  return (
    <>
      {/* Backdrop */}
      {isOpen && !pickerOpen && (
        <div onClick={closeSection} style={backdrop} />
      )}

      {/* Drawer */}
      <div style={{ ...drawer, transform: isOpen ? 'translateX(0)' : 'translateX(100%)' }}>
        {/* Header */}
        <div style={header}>
          <div>
            <div style={sectionName}>{section?.name}</div>
            {section?.hint && <div style={sectionHint}>{section.hint}</div>}
          </div>
          <button onClick={closeSection} style={closeBtn}>✕</button>
        </div>

        {/* Status bar */}
        <div style={statusBar}>
          <span style={typeTag(section?.type)}>{section?.type}</span>
          {saved  && <span style={savedTag}>✓ Saved</span>}
          {saving && <span style={savingTag}>Saving…</span>}
        </div>

        {/* Body */}
        <div style={body}>
          {images.map((img, idx) => (
            <div key={img.id ?? idx} style={imageRow}>
              {/* Thumbnail — click to replace via library */}
              <div
                style={thumb}
                onClick={() => openPickerForReplace(idx)}
                title="Click to replace from library"
              >
                <img src={img.url} alt={img.alt} style={thumbImg} />
                <div style={replaceOverlay}>🔄</div>
              </div>

              {/* Slot label for carousel/cards */}
              {(isCarousel || isCards) && section.slideLabels?.[idx] && (
                <div style={slotLabel}>{section.slideLabels[idx]}</div>
              )}

              {/* Alt text */}
              <input
                style={altInput}
                value={img.alt ?? ''}
                placeholder="Alt text…"
                onChange={(e) => updateAlt(idx, e.target.value)}
                onBlur={() => commitAlt()}
              />

              {/* Reorder + delete (gallery only) */}
              {isGallery && (
                <div style={actions}>
                  <button style={actionBtn} onClick={() => move(idx, idx - 1)} disabled={idx === 0} title="Move up">↑</button>
                  <button style={actionBtn} onClick={() => move(idx, idx + 1)} disabled={idx === images.length - 1} title="Move down">↓</button>
                  <button style={{ ...actionBtn, color: '#ef4444' }} onClick={() => remove(idx)} title="Remove">✕</button>
                </div>
              )}
            </div>
          ))}

          {/* Add button — gallery only */}
          {isGallery && (
            <button style={addBtn} onClick={openPickerForAdd}>
              + Add from library
            </button>
          )}
        </div>

        <div style={footer}>
          <span style={footerNote}>
            Changes save automatically · Click a thumbnail to replace it
          </span>
          <button onClick={closeSection} style={doneBtn}>Done</button>
        </div>
      </div>

      {/* Media Library Picker — renders above the drawer */}
      <MediaLibraryPicker
        open={pickerOpen}
        onClose={() => { setPickerOpen(false); pickerCallbackRef.current = null; }}
        onPick={handlePickerPick}
      />
    </>
  );
}

// ─── Styles ──────────────────────────────────────────────────────────────────

const backdrop = {
  position: 'fixed', inset: 0, zIndex: 99998,
  background: 'rgba(0,0,0,0.4)',
};

const drawer = {
  position: 'fixed', top: 0, right: 0, bottom: 0,
  width: 380, zIndex: 99999,
  background: '#fff',
  boxShadow: '-4px 0 24px rgba(0,0,0,0.18)',
  transition: 'transform 0.28s cubic-bezier(0.4,0,0.2,1)',
  display: 'flex', flexDirection: 'column',
  fontFamily: "'Inter', 'Space Grotesk', sans-serif",
  overflowY: 'hidden',
};

const header = {
  display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between',
  padding: '16px 16px 12px',
  borderBottom: '1px solid #e5e7eb',
  gap: 8, flexShrink: 0,
};

const sectionName = {
  fontWeight: 700, fontSize: '0.95rem', color: '#111827',
};

const sectionHint = {
  fontSize: '0.72rem', color: '#6b7280', marginTop: 3, lineHeight: 1.4,
};

const closeBtn = {
  border: 'none', background: 'none', cursor: 'pointer',
  fontSize: '1rem', color: '#6b7280', padding: 4, flexShrink: 0,
};

const statusBar = {
  padding: '6px 16px', display: 'flex', gap: 8, alignItems: 'center',
  borderBottom: '1px solid #f3f4f6', flexShrink: 0, minHeight: 34,
};

const typeTag = (type) => ({
  display: 'inline-block', fontSize: '0.6rem', fontWeight: 700,
  letterSpacing: '0.08em', textTransform: 'uppercase',
  padding: '2px 7px', borderRadius: 9999,
  ...(type === 'gallery'  ? { background: '#d1fae5', color: '#065f46' } :
      type === 'carousel' ? { background: '#ede9fe', color: '#7c3aed' } :
      type === 'cards'    ? { background: '#fef3c7', color: '#92400e' } :
                            { background: '#dbeafe', color: '#1d4ed8' }),
});

const savedTag  = { fontSize: '0.72rem', fontWeight: 600, color: '#059669' };
const savingTag = { fontSize: '0.72rem', color: '#9ca3af' };

const body = {
  flex: 1, overflowY: 'auto', padding: '12px 16px',
  display: 'flex', flexDirection: 'column', gap: 10,
};

const imageRow = {
  display: 'grid',
  gridTemplateColumns: '72px 1fr',
  gridTemplateRows: 'auto auto',
  gap: '4px 10px',
  padding: '10px',
  border: '1px solid #e5e7eb',
  borderRadius: 8,
  background: '#fafafa',
  alignItems: 'start',
};

const thumb = {
  gridRow: '1 / 3',
  position: 'relative',
  width: 72, height: 72,
  borderRadius: 6, overflow: 'hidden',
  background: '#f3f4f6',
  cursor: 'pointer',
};

const thumbImg = {
  width: '100%', height: '100%', objectFit: 'cover', display: 'block',
};

const replaceOverlay = {
  position: 'absolute', inset: 0,
  display: 'flex', alignItems: 'center', justifyContent: 'center',
  background: 'rgba(0,0,0,0)',
  fontSize: '1.2rem',
  transition: 'background 0.15s',
};

const slotLabel = {
  gridColumn: 2,
  fontSize: '0.65rem', fontWeight: 700, color: '#7c3aed',
  letterSpacing: '0.05em', textTransform: 'uppercase',
};

const altInput = {
  gridColumn: 2,
  border: '1px solid #d1d5db', borderRadius: 4,
  padding: '4px 8px', fontSize: '0.72rem',
  color: '#374151', outline: 'none', width: '100%',
  boxSizing: 'border-box',
};

const actions = {
  gridColumn: 2, display: 'flex', gap: 4,
};

const actionBtn = {
  border: '1px solid #e5e7eb', borderRadius: 4,
  cursor: 'pointer', background: '#f9fafb',
  color: '#374151', fontSize: '0.75rem',
  padding: '2px 8px', fontWeight: 600,
};

const addBtn = {
  display: 'flex', alignItems: 'center', justifyContent: 'center',
  border: '2px dashed #d1d5db', borderRadius: 8,
  padding: '12px', cursor: 'pointer',
  color: '#6b7280', fontWeight: 600, fontSize: '0.8rem',
  marginTop: 4, background: 'none', width: '100%',
};

const footer = {
  borderTop: '1px solid #e5e7eb',
  padding: '12px 16px',
  display: 'flex', alignItems: 'center', justifyContent: 'space-between',
  gap: 8, flexShrink: 0,
};

const footerNote = {
  fontSize: '0.68rem', color: '#9ca3af', lineHeight: 1.4,
};

const doneBtn = {
  border: 'none', borderRadius: 6, cursor: 'pointer',
  fontWeight: 700, fontSize: '0.8rem', padding: '7px 18px',
  background: '#0f172a', color: '#fff',
};

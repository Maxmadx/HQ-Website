/**
 * AdminEditTextMode — text content editor for all site pages.
 *
 * Every managed text field across the site is editable here.
 * A page tab bar at the top switches between pages.
 * Click a section card to open a slide-in panel with all editable fields.
 * Changes are saved to the Firestore `site_text` collection.
 *
 * Route: /admin/text  (admin-only)
 */

import { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { doc, setDoc } from 'firebase/firestore';
import { db } from '../../lib/firebase';
import {
  TEXT_SECTIONS,
  TEXT_SECTIONS_BY_PAGE,
  TEXT_PAGE_LABELS,
  TEXT_SECTION_MAP,
} from '../../lib/textSections';
import { usePageText } from '../../hooks/usePageText';

// ─── Page tab config ──────────────────────────────────────────────────────────
const PAGE_IDS = Object.keys(TEXT_PAGE_LABELS);

const PAGE_URLS = {
  home:         '/',
  discovery:    '/training/trial-lessons',
  sfh:          '/self-fly-hire',
  sales:        '/sales/new',
  training:     '/training',
  maintenance:  '/maintenance',
  expeditions:  '/expeditions',
  about:        '/about-us',
};

// ─── Main component ───────────────────────────────────────────────────────────
export default function AdminEditTextMode() {
  const [selectedPage, setSelectedPage] = useState('home');
  const [activeSection, setActiveSection] = useState(null);
  const [panelValues, setPanelValues] = useState({});
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [saveError, setSaveError] = useState('');
  const [dirtyFields, setDirtyFields] = useState({});

  const { textMap } = usePageText(selectedPage);

  const sections = TEXT_SECTIONS_BY_PAGE[selectedPage] ?? [];
  const currentUrl = PAGE_URLS[selectedPage] ?? '/';

  // When a section is opened, seed the panel with current values
  function openSection(section) {
    const current = textMap[section.id] ?? {};
    const vals = {};
    section.fields.forEach((f) => {
      vals[f.id] = current[f.id] ?? f.default;
    });
    setPanelValues(vals);
    setDirtyFields({});
    setSaved(false);
    setSaveError('');
    setActiveSection(section);
  }

  function closePanel() {
    setActiveSection(null);
    setPanelValues({});
    setDirtyFields({});
    setSaved(false);
    setSaveError('');
  }

  function handleFieldChange(fieldId, value) {
    setPanelValues((prev) => ({ ...prev, [fieldId]: value }));
    const section = activeSection;
    const defaultVal = section?.fields.find((f) => f.id === fieldId)?.default ?? '';
    setDirtyFields((prev) => ({ ...prev, [fieldId]: value !== defaultVal }));
    setSaved(false);
  }

  function resetField(fieldId) {
    const defaultVal = activeSection?.fields.find((f) => f.id === fieldId)?.default ?? '';
    setPanelValues((prev) => ({ ...prev, [fieldId]: defaultVal }));
    setDirtyFields((prev) => ({ ...prev, [fieldId]: false }));
    setSaved(false);
  }

  async function saveSection() {
    if (!activeSection) return;
    setSaving(true);
    setSaveError('');
    try {
      await setDoc(
        doc(db, 'site_text', activeSection.id),
        { page: selectedPage, fields: { ...panelValues } },
        { merge: true },
      );
      setSaved(true);
      setDirtyFields({});
    } catch (e) {
      setSaveError(`Save failed: ${e.message ?? 'unknown error'}`);
    } finally {
      setSaving(false);
    }
  }

  // Close panel on Escape
  useEffect(() => {
    function onKey(e) {
      if (e.key === 'Escape') closePanel();
    }
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  // Switch page → close panel
  function handlePageChange(pageId) {
    setSelectedPage(pageId);
    closePanel();
  }

  const anyDirty = Object.values(dirtyFields).some(Boolean);

  return (
    <div style={pageStyle}>
      {/* Top bar */}
      <div style={topBar}>
        <Link to="/admin" style={backLink}>← Admin panel</Link>
        <div style={titleGroup}>
          <span style={editDot} />
          <span style={titleStyle}>Text Editor</span>
          <span style={pagePill}>{TEXT_PAGE_LABELS[selectedPage]}</span>
        </div>
        <span style={hintStyle}>Click any section to edit its text</span>
        <div style={{ flex: 1 }} />
        <a href={currentUrl} target="_blank" rel="noreferrer" style={viewSite}>
          View page ↗
        </a>
      </div>

      {/* Page tab bar */}
      <div style={tabBar}>
        {PAGE_IDS.map((id) => (
          <button
            key={id}
            style={tabBtn(selectedPage === id)}
            onClick={() => handlePageChange(id)}
          >
            {TEXT_PAGE_LABELS[id]}
          </button>
        ))}
      </div>

      {/* Content */}
      <div style={content}>
        <div style={sectionCount}>{sections.length} section{sections.length !== 1 ? 's' : ''} on this page</div>

        <div style={grid}>
          {sections.map((section) => {
            const isOpen = activeSection?.id === section.id;
            const currentVals = textMap[section.id] ?? {};
            const previewField = section.fields[0];
            const previewVal = currentVals[previewField?.id] ?? previewField?.default ?? '';

            return (
              <button
                key={section.id}
                style={card(isOpen)}
                onClick={() => openSection(section)}
              >
                {/* Card header */}
                <div style={cardHeader}>
                  <div style={{ minWidth: 0 }}>
                    <div style={cardName}>{section.name}</div>
                    {section.hint && <div style={cardHint}>{section.hint}</div>}
                  </div>
                  <span style={fieldCountBadge}>{section.fields.length} field{section.fields.length !== 1 ? 's' : ''}</span>
                </div>

                {/* Preview of first field */}
                <div style={previewWrap}>
                  <div style={previewLabel}>{previewField?.label}</div>
                  <div style={previewText(previewField?.type)}>{previewVal || <em style={{ color: '#94a3b8' }}>Empty</em>}</div>
                </div>

                {/* Card footer */}
                <div style={cardFooter}>
                  <span style={sectionIdBadge}>{section.id}</span>
                  <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                    <a
                      href={`${currentUrl}?text-highlight=${section.id}`}
                      target="_blank"
                      rel="noreferrer"
                      style={findBtn}
                      onClick={(e) => e.stopPropagation()}
                    >
                      Find on page ↗
                    </a>
                    <span style={editCta}>{isOpen ? 'Editing →' : 'Edit →'}</span>
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Slide-in panel overlay */}
      {activeSection && (
        <div style={overlay} onClick={closePanel} />
      )}

      {/* Slide-in panel */}
      <div style={panel(!!activeSection)}>
        {activeSection && (
          <>
            {/* Panel header */}
            <div style={panelHeader}>
              <div>
                <div style={panelTitle}>{activeSection.name}</div>
                <div style={panelSectionId}>{activeSection.id}</div>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexShrink: 0 }}>
                <a
                  href={`${currentUrl}?text-highlight=${activeSection.id}`}
                  target="_blank"
                  rel="noreferrer"
                  style={panelFindBtn}
                >
                  Find on page ↗
                </a>
                <button style={closeBtn} onClick={closePanel}>✕</button>
              </div>
            </div>

            {activeSection.hint && (
              <div style={panelHint}>{activeSection.hint}</div>
            )}

            {/* Fields */}
            <div style={fieldsWrap}>
              {activeSection.fields.map((field) => {
                const val = panelValues[field.id] ?? '';
                const isDirty = !!dirtyFields[field.id];
                const isDefault = val === field.default;

                return (
                  <div key={field.id} style={fieldBlock}>
                    <div style={fieldLabelRow}>
                      <label style={fieldLabel}>{field.label}</label>
                      <div style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
                        {isDirty && <span style={dirtyDot} title="Unsaved change" />}
                        {!isDefault && (
                          <button style={resetBtn} onClick={() => resetField(field.id)}>
                            Reset
                          </button>
                        )}
                      </div>
                    </div>
                    {field.type === 'paragraph' ? (
                      <textarea
                        style={textareaStyle}
                        value={val}
                        onChange={(e) => handleFieldChange(field.id, e.target.value)}
                        rows={4}
                        placeholder={field.default}
                      />
                    ) : (
                      <input
                        style={inputStyle(field.type === 'heading')}
                        type="text"
                        value={val}
                        onChange={(e) => handleFieldChange(field.id, e.target.value)}
                        placeholder={field.default}
                      />
                    )}
                    {field.default && (
                      <div style={defaultHint}>Default: {field.default}</div>
                    )}
                  </div>
                );
              })}
            </div>

            {/* Save bar */}
            <div style={saveBar}>
              {saveError && <div style={errorMsg}>{saveError}</div>}
              {saved && !anyDirty && <div style={successMsg}>Saved!</div>}
              <button
                style={saveBtn(saving, anyDirty)}
                onClick={saveSection}
                disabled={saving}
              >
                {saving ? 'Saving…' : anyDirty ? 'Save changes' : 'Save'}
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

// ─── Styles ───────────────────────────────────────────────────────────────────

const BAR_HEIGHT = 52;
const TAB_HEIGHT = 42;
const PANEL_WIDTH = 480;

const pageStyle = {
  minHeight: '100vh',
  background: '#f8fafc',
  fontFamily: "'Inter', 'Space Grotesk', sans-serif",
};

const topBar = {
  position: 'sticky',
  top: 0,
  zIndex: 9999,
  height: BAR_HEIGHT,
  display: 'flex',
  alignItems: 'center',
  gap: 16,
  padding: '0 24px',
  background: '#0f172a',
  borderBottom: '2px solid #6366f1',
};

const backLink = {
  color: '#94a3b8',
  textDecoration: 'none',
  fontWeight: 600,
  fontSize: '0.75rem',
  whiteSpace: 'nowrap',
};

const titleGroup = {
  display: 'flex',
  alignItems: 'center',
  gap: 10,
};

const editDot = {
  width: 8,
  height: 8,
  borderRadius: '50%',
  background: '#6366f1',
  display: 'inline-block',
};

const titleStyle = {
  color: '#f1f5f9',
  fontWeight: 700,
  fontSize: '0.9rem',
};

const pagePill = {
  background: '#6366f1',
  color: '#fff',
  fontWeight: 700,
  fontSize: '0.62rem',
  letterSpacing: '0.07em',
  textTransform: 'uppercase',
  padding: '2px 8px',
  borderRadius: 9999,
};

const hintStyle = {
  color: '#475569',
  fontSize: '0.72rem',
  fontStyle: 'italic',
};

const viewSite = {
  color: '#60a5fa',
  fontSize: '0.75rem',
  fontWeight: 600,
  textDecoration: 'none',
  whiteSpace: 'nowrap',
};

const tabBar = {
  position: 'sticky',
  top: BAR_HEIGHT,
  zIndex: 9998,
  height: TAB_HEIGHT,
  display: 'flex',
  alignItems: 'center',
  gap: 2,
  padding: '0 24px',
  background: '#1e293b',
  borderBottom: '1px solid #334155',
  overflowX: 'auto',
  scrollbarWidth: 'none',
};

const tabBtn = (active) => ({
  padding: '6px 14px',
  border: 'none',
  borderRadius: 6,
  cursor: 'pointer',
  fontSize: '0.75rem',
  fontWeight: active ? 700 : 500,
  background: active ? '#6366f1' : 'transparent',
  color: active ? '#fff' : '#94a3b8',
  whiteSpace: 'nowrap',
  transition: 'all 0.15s',
  flexShrink: 0,
});

const content = {
  maxWidth: 1200,
  margin: '0 auto',
  padding: '28px 24px',
};

const sectionCount = {
  fontSize: '0.72rem',
  color: '#94a3b8',
  marginBottom: 20,
};

const grid = {
  display: 'grid',
  gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
  gap: 14,
};

const card = (isOpen) => ({
  background: '#fff',
  border: `1.5px solid ${isOpen ? '#6366f1' : '#e2e8f0'}`,
  borderRadius: 12,
  padding: 0,
  cursor: 'pointer',
  textAlign: 'left',
  overflow: 'hidden',
  transition: 'box-shadow 0.15s, border-color 0.15s',
  display: 'flex',
  flexDirection: 'column',
  boxShadow: isOpen ? '0 0 0 3px rgba(99,102,241,0.15)' : 'none',
});

const cardHeader = {
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'flex-start',
  padding: '12px 14px 10px',
  borderBottom: '1px solid #f1f5f9',
  gap: 8,
};

const cardName = {
  fontWeight: 700,
  fontSize: '0.85rem',
  color: '#0f172a',
  marginBottom: 3,
};

const cardHint = {
  fontSize: '0.68rem',
  color: '#64748b',
};

const fieldCountBadge = {
  flexShrink: 0,
  background: '#f1f5f9',
  color: '#475569',
  fontSize: '0.65rem',
  fontWeight: 600,
  padding: '2px 8px',
  borderRadius: 9999,
};

const previewWrap = {
  padding: '10px 14px',
  flex: 1,
};

const previewLabel = {
  fontSize: '0.62rem',
  fontWeight: 600,
  color: '#94a3b8',
  textTransform: 'uppercase',
  letterSpacing: '0.06em',
  marginBottom: 4,
};

const previewText = (type) => ({
  fontSize: type === 'heading' ? '1rem' : '0.78rem',
  fontWeight: type === 'heading' ? 700 : 400,
  color: '#0f172a',
  lineHeight: 1.4,
  overflow: 'hidden',
  display: '-webkit-box',
  WebkitLineClamp: 2,
  WebkitBoxOrient: 'vertical',
});

const cardFooter = {
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  padding: '8px 14px',
  borderTop: '1px solid #f1f5f9',
  background: '#fafafa',
};

const sectionIdBadge = {
  fontSize: '0.6rem',
  color: '#94a3b8',
  fontFamily: 'monospace',
};

const editCta = {
  fontSize: '0.72rem',
  fontWeight: 600,
  color: '#6366f1',
};

const findBtn = {
  fontSize: '0.68rem',
  fontWeight: 600,
  color: '#6366f1',
  textDecoration: 'none',
  padding: '2px 8px',
  border: '1px solid #c7d2fe',
  borderRadius: 5,
  background: '#eef2ff',
  whiteSpace: 'nowrap',
};

// ─── Slide-in panel ───────────────────────────────────────────────────────────

const overlay = {
  position: 'fixed',
  inset: 0,
  zIndex: 10000,
  background: 'rgba(0,0,0,0.25)',
};

const panel = (open) => ({
  position: 'fixed',
  top: 0,
  right: 0,
  bottom: 0,
  zIndex: 10001,
  width: PANEL_WIDTH,
  background: '#fff',
  boxShadow: '-8px 0 32px rgba(0,0,0,0.12)',
  display: 'flex',
  flexDirection: 'column',
  transform: open ? 'translateX(0)' : `translateX(${PANEL_WIDTH}px)`,
  transition: 'transform 0.25s cubic-bezier(0.25,0.1,0.25,1)',
  fontFamily: "'Inter', system-ui, sans-serif",
});

const panelHeader = {
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'flex-start',
  padding: '18px 20px 12px',
  borderBottom: '1px solid #e2e8f0',
  flexShrink: 0,
};

const panelTitle = {
  fontWeight: 700,
  fontSize: '0.95rem',
  color: '#0f172a',
  marginBottom: 4,
};

const panelFindBtn = {
  fontSize: '0.7rem',
  fontWeight: 600,
  color: '#6366f1',
  textDecoration: 'none',
  padding: '4px 10px',
  border: '1px solid #c7d2fe',
  borderRadius: 6,
  background: '#eef2ff',
  whiteSpace: 'nowrap',
};

const panelSectionId = {
  fontSize: '0.65rem',
  color: '#94a3b8',
  fontFamily: 'monospace',
};

const panelHint = {
  padding: '10px 20px',
  fontSize: '0.72rem',
  color: '#64748b',
  background: '#f8fafc',
  borderBottom: '1px solid #e2e8f0',
  flexShrink: 0,
};

const closeBtn = {
  background: 'none',
  border: 'none',
  cursor: 'pointer',
  fontSize: '1rem',
  color: '#94a3b8',
  padding: 4,
  lineHeight: 1,
  flexShrink: 0,
};

const fieldsWrap = {
  flex: 1,
  overflowY: 'auto',
  padding: '16px 20px',
  display: 'flex',
  flexDirection: 'column',
  gap: 20,
};

const fieldBlock = {
  display: 'flex',
  flexDirection: 'column',
  gap: 6,
};

const fieldLabelRow = {
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
};

const fieldLabel = {
  fontSize: '0.75rem',
  fontWeight: 600,
  color: '#374151',
};

const dirtyDot = {
  width: 6,
  height: 6,
  borderRadius: '50%',
  background: '#f59e0b',
  display: 'inline-block',
};

const resetBtn = {
  background: 'none',
  border: '1px solid #e2e8f0',
  borderRadius: 4,
  cursor: 'pointer',
  fontSize: '0.65rem',
  color: '#64748b',
  padding: '1px 8px',
  fontFamily: 'inherit',
};

const inputStyle = (isHeading) => ({
  width: '100%',
  padding: '8px 10px',
  border: '1.5px solid #e2e8f0',
  borderRadius: 7,
  fontSize: isHeading ? '1rem' : '0.82rem',
  fontWeight: isHeading ? 700 : 400,
  color: '#0f172a',
  fontFamily: 'inherit',
  outline: 'none',
  boxSizing: 'border-box',
  transition: 'border-color 0.15s',
});

const textareaStyle = {
  width: '100%',
  padding: '8px 10px',
  border: '1.5px solid #e2e8f0',
  borderRadius: 7,
  fontSize: '0.82rem',
  color: '#0f172a',
  fontFamily: 'inherit',
  outline: 'none',
  boxSizing: 'border-box',
  resize: 'vertical',
  lineHeight: 1.5,
  transition: 'border-color 0.15s',
};

const defaultHint = {
  fontSize: '0.62rem',
  color: '#94a3b8',
};

const saveBar = {
  padding: '14px 20px',
  borderTop: '1px solid #e2e8f0',
  display: 'flex',
  alignItems: 'center',
  gap: 10,
  flexShrink: 0,
  background: '#fff',
};

const saveBtn = (saving, dirty) => ({
  marginLeft: 'auto',
  padding: '9px 22px',
  borderRadius: 8,
  border: 'none',
  cursor: saving ? 'not-allowed' : 'pointer',
  fontWeight: 700,
  fontSize: '0.82rem',
  fontFamily: 'inherit',
  background: saving ? '#94a3b8' : '#6366f1',
  color: '#fff',
  transition: 'background 0.15s',
});

const errorMsg = {
  flex: 1,
  fontSize: '0.72rem',
  color: '#dc2626',
};

const successMsg = {
  flex: 1,
  fontSize: '0.72rem',
  color: '#16a34a',
  fontWeight: 600,
};

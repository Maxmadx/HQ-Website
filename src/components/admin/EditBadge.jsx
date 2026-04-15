/**
 * EditBadge — a small clickable badge that appears on managed image sections
 * when edit mode is active. Clicking it opens the ImageEditDrawer for that section.
 *
 * Usage:
 *   <div style={{ position: 'relative' }}>
 *     <YourContent />
 *     <EditBadge sectionId="home-facility-gallery" />
 *   </div>
 *
 * Multiple badges can coexist on the same parent (e.g. two photo strip rows).
 * Position the badge with the `style` prop — defaults to top-left.
 */

import { useEditMode } from '../../context/EditModeContext';
import { SECTION_MAP } from '../../lib/imageSections';

export default function EditBadge({ sectionId, style = {} }) {
  const { isEditMode, openSection } = useEditMode();
  const section = SECTION_MAP[sectionId];

  if (!isEditMode || !section) return null;

  return (
    <button
      onClick={(e) => { e.stopPropagation(); openSection(sectionId); }}
      style={{ ...badge, ...style }}
      title={`Edit: ${section.name}`}
    >
      <span>✏️</span>
      <span style={label}>{section.name}</span>
    </button>
  );
}

// ─── Styles ──────────────────────────────────────────────────────────────────

const badge = {
  position: 'absolute',
  top: 8,
  left: 8,
  zIndex: 9999,
  display: 'flex',
  alignItems: 'center',
  gap: 6,
  padding: '5px 10px',
  background: '#f59e0b',
  color: '#0f172a',
  border: 'none',
  borderRadius: 5,
  cursor: 'pointer',
  fontWeight: 700,
  fontSize: '0.72rem',
  letterSpacing: '0.02em',
  boxShadow: '0 2px 8px rgba(0,0,0,0.35)',
  whiteSpace: 'nowrap',
  fontFamily: "'Inter', sans-serif",
  lineHeight: 1,
};

const label = {
  maxWidth: 200,
  overflow: 'hidden',
  textOverflow: 'ellipsis',
};

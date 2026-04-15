/**
 * AdminBar — a fixed floating bar shown only to logged-in admins.
 *
 * Appears on every page. Lets admins toggle "Edit Images" mode, which
 * makes all managed image sections on the page clickable for editing.
 */

import { Link, useLocation } from 'react-router-dom';
import { useEditMode } from '../../context/EditModeContext';

export default function AdminBar() {
  const { isAdmin, isEditMode, toggleEditMode } = useEditMode();
  const { pathname } = useLocation();

  if (!isAdmin) return null;
  // Don't show on admin pages — they have their own nav
  if (pathname.startsWith('/admin')) return null;

  return (
    <div style={bar}>
      <span style={brand}>HQ Admin</span>

      <div style={sep} />

      <button onClick={toggleEditMode} style={isEditMode ? activeBtn : quietBtn}>
        <span style={{ marginRight: 6 }}>{isEditMode ? '✏️' : '○'}</span>
        {isEditMode ? 'Edit Images: ON' : 'Edit Images: OFF'}
      </button>

      {isEditMode && (
        <span style={hint}>Click any highlighted section on the page to edit its images</span>
      )}

      <div style={{ flex: 1 }} />

      <Link to="/admin" style={adminLink}>
        Admin panel →
      </Link>
    </div>
  );
}

// ─── Styles ──────────────────────────────────────────────────────────────────

const bar = {
  position: 'fixed',
  bottom: 0,
  left: 0,
  right: 0,
  zIndex: 99999,
  height: 44,
  display: 'flex',
  alignItems: 'center',
  gap: 12,
  padding: '0 16px',
  background: '#0f172a',
  borderTop: '1px solid #1e293b',
  fontFamily: "'Inter', 'Space Grotesk', sans-serif",
  fontSize: '0.78rem',
};

const brand = {
  color: '#94a3b8',
  fontWeight: 700,
  letterSpacing: '0.04em',
  textTransform: 'uppercase',
  fontSize: '0.65rem',
};

const sep = {
  width: 1,
  height: 18,
  background: '#334155',
  flexShrink: 0,
};

const quietBtn = {
  border: '1px solid #334155',
  borderRadius: 5,
  cursor: 'pointer',
  fontWeight: 600,
  fontSize: '0.75rem',
  padding: '4px 12px',
  background: 'transparent',
  color: '#94a3b8',
  display: 'flex',
  alignItems: 'center',
  whiteSpace: 'nowrap',
};

const activeBtn = {
  ...quietBtn,
  background: '#f59e0b',
  borderColor: '#f59e0b',
  color: '#0f172a',
};

const hint = {
  color: '#64748b',
  fontSize: '0.7rem',
  fontStyle: 'italic',
};

const adminLink = {
  color: '#60a5fa',
  textDecoration: 'none',
  fontWeight: 600,
  fontSize: '0.75rem',
  whiteSpace: 'nowrap',
};

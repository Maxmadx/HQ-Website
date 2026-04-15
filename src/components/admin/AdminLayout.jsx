import { useState, useEffect } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { signOut } from 'firebase/auth';
import { collection, query, where, onSnapshot } from 'firebase/firestore';
import { auth, db } from '../../lib/firebase';

const NAV_ITEMS = [
  { to: '/admin', icon: '📊', label: 'Dashboard' },
  { to: '/admin/listings', icon: '✈️', label: 'Listings' },
  { to: '/admin/images', icon: '🖼️', label: 'Images' },
  { to: '/admin/text', icon: '✍️', label: 'Text' },
  { to: '/admin/blog', icon: '📝', label: 'Blog' },
  { to: '/admin/pricing', icon: '💷', label: 'Pricing' },
  { to: '/admin/leads', icon: '📬', label: 'Leads' },
  { to: '/admin/analytics', icon: '📈', label: 'Analytics' },
  { to: '/admin/wall-of-cool', icon: '📸', label: 'Wall of Cool' },
  { to: '/admin/reviews', icon: '⭐', label: 'Reviews' },
];

export default function AdminLayout({ children }) {
  const navigate = useNavigate();
  const [newLeadCount, setNewLeadCount] = useState(0);

  useEffect(() => {
    const q = query(collection(db, 'leads'), where('status', '==', 'new'));
    const unsub = onSnapshot(q, (snap) => setNewLeadCount(snap.size), () => {});
    return unsub;
  }, []);

  async function handleSignOut() {
    await signOut(auth);
    navigate('/admin/login');
  }

  return (
    <div style={{ display: 'flex', minHeight: '100vh', fontFamily: "'Inter', system-ui, sans-serif", background: '#f9fafb' }}>
      {/* Sidebar */}
      <aside style={{ width: '220px', flexShrink: 0, background: '#111827', display: 'flex', flexDirection: 'column', position: 'fixed', top: 0, left: 0, bottom: 0, zIndex: 10 }}>
        <div style={{ padding: '1.5rem 1.25rem 1rem', borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
          <div style={{ color: '#fff', fontWeight: 700, fontSize: '1rem', letterSpacing: '-0.02em' }}>HQ Aviation</div>
          <div style={{ color: '#9ca3af', fontSize: '0.7rem', marginTop: '2px', textTransform: 'uppercase', letterSpacing: '0.1em' }}>Admin Panel</div>
        </div>
        <nav style={{ flex: 1, padding: '0.75rem 0', overflowY: 'auto' }}>
          {NAV_ITEMS.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.to === '/admin'}
              style={({ isActive }) => ({
                display: 'flex', alignItems: 'center', gap: '0.625rem',
                padding: '0.6rem 1.25rem',
                textDecoration: 'none',
                fontSize: '0.875rem', fontWeight: 500,
                color: isActive ? '#fff' : '#9ca3af',
                background: isActive ? 'rgba(255,255,255,0.1)' : 'transparent',
                borderLeft: isActive ? '3px solid #fff' : '3px solid transparent',
                transition: 'all 0.15s',
              })}
            >
              <span style={{ fontSize: '1rem', lineHeight: 1 }}>{item.icon}</span>
              <span style={{ flex: 1 }}>{item.label}</span>
              {item.to === '/admin/leads' && newLeadCount > 0 && (
                <span style={{
                  background: '#ef4444', color: '#fff', borderRadius: '10px',
                  fontSize: '0.65rem', fontWeight: 700, padding: '1px 6px',
                  minWidth: '18px', textAlign: 'center', lineHeight: '18px',
                }}>
                  {newLeadCount > 99 ? '99+' : newLeadCount}
                </span>
              )}
            </NavLink>
          ))}
        </nav>
        <div style={{ padding: '1rem 1.25rem', borderTop: '1px solid rgba(255,255,255,0.1)' }}>
          <button
            onClick={handleSignOut}
            style={{ width: '100%', padding: '0.5rem', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '6px', color: '#9ca3af', fontSize: '0.8rem', cursor: 'pointer', fontFamily: 'inherit' }}
          >
            Sign out
          </button>
        </div>
      </aside>
      {/* Main content */}
      <main style={{ marginLeft: '220px', flex: 1, padding: '2rem', minHeight: '100vh' }}>
        {children}
      </main>
    </div>
  );
}

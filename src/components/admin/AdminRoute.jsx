import { Navigate } from 'react-router-dom';
import { useAdmin } from '../../hooks/useAdmin';

export default function AdminRoute({ children }) {
  const { isAdmin, loading, error } = useAdmin();

  console.log('[AdminRoute] loading:', loading, '| isAdmin:', isAdmin, '| error:', error);

  if (loading) {
    return (
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100vh', fontFamily: 'sans-serif', color: '#6b7280' }}>
        Loading…
      </div>
    );
  }

  if (!isAdmin) {
    console.log('[AdminRoute] Not admin — redirecting to /admin/login');
    return <Navigate to="/admin/login" replace />;
  }

  console.log('[AdminRoute] Access granted');
  return children;
}

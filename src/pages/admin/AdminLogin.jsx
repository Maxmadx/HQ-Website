import { useState } from 'react';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { useNavigate } from 'react-router-dom';
import { auth } from '../../lib/firebase';

export default function AdminLogin() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');
    setLoading(true);
    console.log('[AdminLogin] Attempting sign in for:', email);
    try {
      const cred = await signInWithEmailAndPassword(auth, email, password);
      console.log('[AdminLogin] signInWithEmailAndPassword success');
      console.log('[AdminLogin] user uid:', cred.user.uid);
      console.log('[AdminLogin] user email:', cred.user.email);
      console.log('[AdminLogin] user providerData:', JSON.stringify(cred.user.providerData));
      const token = await cred.user.getIdTokenResult(true);
      console.log('[AdminLogin] token claims after sign-in:', JSON.stringify(token.claims));
      navigate('/admin');
    } catch (err) {
      console.error('[AdminLogin] sign-in error code:', err.code);
      console.error('[AdminLogin] sign-in error message:', err.message);
      setError('Invalid email or password. (' + err.code + ')');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#111827', fontFamily: "'Inter', system-ui, sans-serif" }}>
      <div style={{ background: '#fff', borderRadius: '12px', padding: '2.5rem', width: '100%', maxWidth: '380px', boxShadow: '0 20px 60px rgba(0,0,0,0.3)' }}>
        <div style={{ marginBottom: '2rem' }}>
          <h1 style={{ fontSize: '1.5rem', fontWeight: 700, color: '#111827', margin: 0 }}>HQ Aviation</h1>
          <p style={{ color: '#6b7280', margin: '0.25rem 0 0', fontSize: '0.875rem' }}>Admin Panel</p>
        </div>
        {error && (
          <div style={{ background: '#fee2e2', color: '#991b1b', padding: '0.625rem 0.875rem', borderRadius: '6px', marginBottom: '1rem', fontSize: '0.875rem' }}>
            {error}
          </div>
        )}
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <div>
            <label style={{ display: 'block', fontWeight: 600, fontSize: '0.8rem', color: '#374151', marginBottom: '0.3rem' }}>Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              autoComplete="email"
              style={{ width: '100%', padding: '0.625rem 0.75rem', border: '1px solid #d1d5db', borderRadius: '6px', fontSize: '0.875rem', boxSizing: 'border-box', outline: 'none' }}
            />
          </div>
          <div>
            <label style={{ display: 'block', fontWeight: 600, fontSize: '0.8rem', color: '#374151', marginBottom: '0.3rem' }}>Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              autoComplete="current-password"
              style={{ width: '100%', padding: '0.625rem 0.75rem', border: '1px solid #d1d5db', borderRadius: '6px', fontSize: '0.875rem', boxSizing: 'border-box', outline: 'none' }}
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            style={{ background: '#111827', color: '#fff', padding: '0.625rem', border: 'none', borderRadius: '6px', fontWeight: 600, fontSize: '0.875rem', cursor: 'pointer', opacity: loading ? 0.6 : 1, fontFamily: 'inherit' }}
          >
            {loading ? 'Signing in…' : 'Sign in'}
          </button>
        </form>
      </div>
    </div>
  );
}

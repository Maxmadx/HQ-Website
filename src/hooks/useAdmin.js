import { useState, useEffect } from 'react';
import { onAuthStateChanged, getIdTokenResult } from 'firebase/auth';
import { auth } from '../lib/firebase';

export function useAdmin() {
  const [user, setUser] = useState(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (firebaseUser) => {
      if (!firebaseUser) {
        setUser(null);
        setIsAdmin(false);
        setLoading(false);
        return;
      }

      try {
        const tokenResult = await getIdTokenResult(firebaseUser, true);
        const role = tokenResult.claims?.role;
        const admin = role === 'admin' || role === 'super_admin';
        setUser(firebaseUser);
        setIsAdmin(admin);
      } catch (err) {
        console.error('[useAdmin] getIdTokenResult error:', err);
        setError(err.message);
        setIsAdmin(false);
      } finally {
        setLoading(false);
      }
    });
    return unsub;
  }, []);

  return { user, isAdmin, loading, error };
}

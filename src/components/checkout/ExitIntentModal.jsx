import { useState } from 'react';

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export default function ExitIntentModal({ open, onSave, onDismiss }) {
  const [email, setEmail] = useState('');
  if (!open) return null;
  const valid = EMAIL_RE.test(email.trim());

  return (
    <div
      role="dialog"
      aria-modal="true"
      style={{
        position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.6)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        zIndex: 9999, padding: 16,
      }}
    >
      <div style={{
        background: '#0f172a', color: '#f1f5f9',
        borderRadius: 12, padding: 28, maxWidth: 420, width: '100%',
        boxShadow: '0 20px 60px rgba(0,0,0,0.5)',
      }}>
        <h2 style={{ margin: '0 0 8px 0', fontSize: 20 }}>Save your booking?</h2>
        <p style={{ color: '#94a3b8', margin: '0 0 16px 0', fontSize: 14, lineHeight: 1.5 }}>
          We'll email you a link so you can come back when you're ready. No commitment.
        </p>
        <label htmlFor="exit-email" style={{ display: 'block', fontSize: 13, fontWeight: 600, marginBottom: 6 }}>Email</label>
        <input
          id="exit-email"
          type="email"
          autoComplete="email"
          autoFocus
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="you@example.com"
          style={{
            width: '100%', padding: '10px 12px', fontSize: 15,
            borderRadius: 6, border: '1px solid #334155',
            background: '#1e293b', color: '#f1f5f9', boxSizing: 'border-box',
          }}
        />
        <div style={{ display: 'flex', gap: 8, marginTop: 16 }}>
          <button
            type="button"
            onClick={onDismiss}
            style={{
              flex: 1, padding: '10px 16px', fontSize: 14,
              borderRadius: 6, border: '1px solid #334155',
              background: 'transparent', color: '#cbd5e1', cursor: 'pointer',
            }}
          >
            No thanks
          </button>
          <button
            type="button"
            disabled={!valid}
            onClick={() => onSave(email.trim())}
            style={{
              flex: 1, padding: '10px 16px', fontSize: 14, fontWeight: 600,
              borderRadius: 6, border: 'none',
              background: valid ? '#a855f7' : '#334155',
              color: '#fff', cursor: valid ? 'pointer' : 'not-allowed',
            }}
          >
            Save &amp; email
          </button>
        </div>
      </div>
    </div>
  );
}

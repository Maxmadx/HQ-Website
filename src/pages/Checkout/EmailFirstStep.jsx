import { useState } from 'react';

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export default function EmailFirstStep({ defaultEmail = '', onContinue }) {
  const [email, setEmail] = useState(defaultEmail || '');
  const [company, setCompany] = useState(''); // honeypot
  const valid = EMAIL_RE.test(email.trim());

  function handleSubmit(e) {
    e.preventDefault();
    if (!valid) return;
    if (company) return; // bot — silently no-op
    onContinue(email.trim());
  }

  return (
    <form onSubmit={handleSubmit} style={{ maxWidth: 480, margin: '0 auto', padding: 24 }}>
      <h2 style={{ fontSize: 22, marginBottom: 8 }}>Almost there.</h2>
      <p style={{ color: '#94a3b8', marginBottom: 24, lineHeight: 1.5 }}>
        Where shall we send your booking confirmation?
      </p>

      <label htmlFor="emf-email" style={{ display: 'block', fontSize: 13, fontWeight: 600, marginBottom: 6 }}>
        Email
      </label>
      <input
        id="emf-email"
        type="email"
        autoComplete="email"
        autoFocus
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="you@example.com"
        style={{
          width: '100%', padding: '12px 14px', fontSize: 16,
          borderRadius: 8, border: '1px solid #334155',
          background: '#0f172a', color: '#f1f5f9',
        }}
      />
      <p style={{ fontSize: 12, color: '#64748b', marginTop: 8, marginBottom: 24 }}>
        We'll only use this to send your booking. You can unsubscribe any time.
      </p>

      {/* Honeypot — hidden from real users, bots will fill it */}
      <input
        type="text"
        name="company"
        value={company}
        onChange={(e) => setCompany(e.target.value)}
        tabIndex={-1}
        autoComplete="off"
        style={{ position: 'absolute', left: '-9999px', width: 1, height: 1, opacity: 0 }}
        aria-hidden="true"
      />

      <button
        type="submit"
        disabled={!valid}
        style={{
          width: '100%', padding: '14px 16px', fontSize: 15, fontWeight: 600,
          borderRadius: 8, border: 'none',
          background: valid ? '#a855f7' : '#334155',
          color: '#fff', cursor: valid ? 'pointer' : 'not-allowed',
          transition: 'background 150ms ease',
        }}
      >
        Continue
      </button>
    </form>
  );
}

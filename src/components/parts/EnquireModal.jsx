import { useState } from 'react';
import { CONDITIONS } from '../../lib/partsSchema';

export default function EnquireModal({ part, onClose }) {
  const [form, setForm] = useState({
    // The listing already has one fixed condition; prefill but allow change
    // (customer might want to ask "do you also have this in 'new'?").
    condition: part.condition || 'any',
    qty: 1,
    name: '',
    email: '',
    phone: '',
    tail: '',
    notes: '',
  });
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState(null);

  function setField(k, v) { setForm((f) => ({ ...f, [k]: v })); }

  async function handleSubmit(e) {
    e.preventDefault();
    setSubmitting(true);
    setError(null);
    try {
      const res = await fetch('/api/parts-enquiry', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          partNumber: part.partNumber,
          partListingId: part.id,
          ...form,
          qty: Number(form.qty),
        }),
      });
      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        throw new Error(body.error || 'Submission failed');
      }
      setSubmitted(true);
    } catch (err) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  }

  const inputStyle = { width: '100%', padding: '0.55rem 0.75rem', border: '1px solid #d1d5db', borderRadius: '6px', fontSize: '0.875rem', boxSizing: 'border-box', fontFamily: 'inherit' };
  const labelStyle = { display: 'block', fontSize: '0.7rem', fontWeight: 600, color: '#374151', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.3rem' };

  return (
    <div onClick={onClose} style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.55)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem', overflowY: 'auto' }}>
      <div onClick={(e) => e.stopPropagation()} style={{ background: '#fff', borderRadius: '8px', maxWidth: '520px', width: '100%', maxHeight: '90vh', overflowY: 'auto', padding: '2rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1.5rem' }}>
          <div>
            <div style={{ fontFamily: 'monospace', fontSize: '0.8rem', color: '#999', marginBottom: '0.25rem' }}>{part.partNumber}</div>
            <h2 style={{ fontSize: '1.15rem', fontWeight: 700, color: '#1a1a1a', margin: 0 }}>Enquire about {part.title}</h2>
          </div>
          <button onClick={onClose} style={{ background: 'none', border: 'none', fontSize: '1.4rem', color: '#999', cursor: 'pointer', padding: 0, lineHeight: 1 }}>×</button>
        </div>

        {submitted ? (
          <div style={{ textAlign: 'center', padding: '2rem 0' }}>
            <div style={{ fontSize: '2rem', marginBottom: '0.75rem' }}>✓</div>
            <p style={{ fontWeight: 700, marginBottom: '0.5rem', color: '#1a1a1a' }}>Enquiry received</p>
            <p style={{ fontSize: '0.85rem', color: '#666', marginBottom: '1.5rem' }}>We'll be in touch shortly about availability and pricing.</p>
            <button onClick={onClose} style={{ padding: '0.6rem 1.5rem', background: '#1a1a1a', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer', fontSize: '0.8rem', fontWeight: 600 }}>Close</button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} style={{ display: 'grid', gap: '1rem' }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 100px', gap: '0.75rem' }}>
              <div>
                <label style={labelStyle}>Condition</label>
                <select value={form.condition} onChange={(e) => setField('condition', e.target.value)} style={inputStyle}>
                  <option value="any">Any</option>
                  {CONDITIONS.map((c) => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>
              <div>
                <label style={labelStyle}>Qty</label>
                <input type="number" min="1" max="999" value={form.qty} onChange={(e) => setField('qty', e.target.value)} required style={inputStyle} />
              </div>
            </div>
            <div>
              <label style={labelStyle}>Name *</label>
              <input value={form.name} onChange={(e) => setField('name', e.target.value)} required style={inputStyle} />
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
              <div>
                <label style={labelStyle}>Email *</label>
                <input type="email" value={form.email} onChange={(e) => setField('email', e.target.value)} required style={inputStyle} />
              </div>
              <div>
                <label style={labelStyle}>Phone</label>
                <input type="tel" value={form.phone} onChange={(e) => setField('phone', e.target.value)} style={inputStyle} />
              </div>
            </div>
            <div>
              <label style={labelStyle}>Aircraft Tail (optional)</label>
              <input value={form.tail} onChange={(e) => setField('tail', e.target.value)} placeholder="e.g. G-ABCD" style={inputStyle} />
            </div>
            <div>
              <label style={labelStyle}>Notes</label>
              <textarea value={form.notes} onChange={(e) => setField('notes', e.target.value)} rows={3} placeholder="AOG? Specific requirements?" style={{ ...inputStyle, resize: 'vertical' }} />
            </div>
            {error && <p style={{ color: '#dc2626', fontSize: '0.8rem', margin: 0 }}>{error}</p>}
            <button type="submit" disabled={submitting} style={{ padding: '0.75rem', background: '#1a1a1a', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer', fontSize: '0.8rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.08em', opacity: submitting ? 0.6 : 1 }}>
              {submitting ? 'Sending…' : 'Send Enquiry'}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}

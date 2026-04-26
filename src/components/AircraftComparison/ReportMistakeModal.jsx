import { useState, useEffect } from 'react';

const FIELD_OPTIONS = [
  { value: 'fuelBurnGph', label: 'Fuel burn (gph)' },
  { value: 'mxScheduled', label: 'Scheduled MX (£/hr)' },
  { value: 'engineReserve', label: 'Engine reserve (£/hr)' },
  { value: 'airframeReserve', label: 'Airframe reserve (£/hr)' },
  { value: 'insurance', label: 'Insurance (£/yr)' },
  { value: 'annualInspection', label: 'Annual inspection (£/yr)' },
  { value: 'hangarage', label: 'Hangarage (£/yr)' },
  { value: 'priceNewGbp', label: 'New price (£)' },
  { value: 'priceUsedRangeGbp', label: 'Used market range (£)' },
  { value: 'specs', label: 'Performance specs' },
  { value: 'other', label: 'Something else' },
];

export default function ReportMistakeModal({ open, aircraft, defaultAircraftId, onClose }) {
  const [aircraftId, setAircraftId] = useState(defaultAircraftId || '');
  const [field, setField] = useState('insurance');
  const [suggested, setSuggested] = useState('');
  const [message, setMessage] = useState('');
  const [email, setEmail] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    if (open && defaultAircraftId) setAircraftId(defaultAircraftId);
  }, [open, defaultAircraftId]);

  if (!open) return null;

  async function handleSubmit(e) {
    e.preventDefault();
    setSubmitting(true);
    try {
      const res = await fetch('/api/leads', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          source: 'comparison-mistake-report',
          aircraftId,
          field,
          suggestedValue: suggested || null,
          message,
          email: email || null,
        }),
      });
      if (!res.ok) throw new Error(`Submit failed: ${res.status}`);
      setSubmitted(true);
    } catch (err) {
      console.error('Mistake-report submit error', err);
      alert("Couldn't submit right now — please try again, or use the Talk to our team form.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="report-mistake__backdrop" role="dialog" aria-modal="true" aria-labelledby="report-mistake-title" onClick={onClose}>
      <div className="report-mistake__modal" onClick={(e) => e.stopPropagation()}>
        <div className="report-mistake__head">
          <div>
            <h3 id="report-mistake-title">Spot a mistake?</h3>
            <p className="report-mistake__subtitle">Tell us what you think is wrong — we'll review it.</p>
          </div>
          <button type="button" onClick={onClose} aria-label="Close" className="report-mistake__close">✕</button>
        </div>

        {submitted ? (
          <div className="report-mistake__thanks">
            <p>Thanks — we'll review your correction and update the data if it checks out.</p>
            <button type="button" className="report-mistake__btn-primary" onClick={onClose}>Close</button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="report-mistake__form">
            <label>
              Aircraft
              <select value={aircraftId} onChange={(e) => setAircraftId(e.target.value)} required>
                <option value="">Select aircraft…</option>
                {aircraft.map((a) => (
                  <option key={a.id} value={a.id}>{a.model}</option>
                ))}
              </select>
            </label>
            <label>
              Field
              <select value={field} onChange={(e) => setField(e.target.value)} required>
                {FIELD_OPTIONS.map((o) => (
                  <option key={o.value} value={o.value}>{o.label}</option>
                ))}
              </select>
            </label>
            <label>
              What should it be? <span className="report-mistake__optional">(optional)</span>
              <input type="text" value={suggested} onChange={(e) => setSuggested(e.target.value)} placeholder="e.g. £18,000" />
            </label>
            <label>
              Your source / context
              <textarea value={message} onChange={(e) => setMessage(e.target.value)} required minLength={3} rows={3} placeholder="What you're seeing differently. Sources welcome but not required." />
            </label>
            <label>
              Email <span className="report-mistake__optional">(optional — only if you want a reply)</span>
              <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@example.com" />
            </label>
            <div className="report-mistake__actions">
              <button type="button" onClick={onClose} className="report-mistake__btn-secondary" disabled={submitting}>Cancel</button>
              <button type="submit" className="report-mistake__btn-primary" disabled={submitting || !aircraftId || !message.trim()}>
                {submitting ? 'Submitting…' : 'Submit correction'}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}

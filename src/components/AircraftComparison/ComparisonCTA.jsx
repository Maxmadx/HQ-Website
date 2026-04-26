import { useState } from 'react';

export default function ComparisonCTA({ selectedAircraft }) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState(null);

  async function handleSubmit(e) {
    e.preventDefault();
    setSubmitting(true);
    setError(null);
    try {
      const res = await fetch('/api/leads', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          source: 'comparison-tool',
          name,
          email,
          message,
          aircraftIds: selectedAircraft.map((a) => a.id),
        }),
      });
      if (!res.ok) throw new Error(`Submit failed: ${res.status}`);
      setSubmitted(true);
    } catch (err) {
      console.error('CTA submit error', err);
      setError("Couldn't submit right now. Please try again or call us.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <section className="comparison-cta">
      <div className="comparison-cta__copy">
        <div className="comparison-cta__eyebrow">Want a tailored ownership analysis?</div>
        <p>Our team can match these public estimates against real UK operator data and your flying profile.</p>
      </div>

      {submitted ? (
        <p className="comparison-cta__thanks">Thanks — we'll be in touch within one working day.</p>
      ) : (
        <form className="comparison-cta__form" onSubmit={handleSubmit}>
          <input type="text" required placeholder="Your name" value={name} onChange={(e) => setName(e.target.value)} />
          <input type="email" required placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} />
          <textarea required placeholder="What you're trying to figure out" value={message} onChange={(e) => setMessage(e.target.value)} rows={2} />
          <button type="submit" disabled={submitting}>{submitting ? 'Sending…' : 'Talk to our team →'}</button>
          {error && <p className="comparison-cta__error">{error}</p>}
        </form>
      )}
    </section>
  );
}

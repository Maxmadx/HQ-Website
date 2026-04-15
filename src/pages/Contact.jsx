import { useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';

// Maps ?subject= query params from CTA links to select option values
const SUBJECT_MAP = {
  'aircraft-sales': 'aircraft-sales',
  'training':       'training',
  'maintenance':    'maintenance',
  'expeditions':    'expeditions',
  'hire':           'hire',
  'viewing':        'viewing',
  'rebuild':        'rebuild',
  'unmanned':       'unmanned',
  'careers':        'careers',
};

const SUBJECT_LABELS = {
  'aircraft-sales': 'Aircraft Sales',
  'training':       'Flight Training',
  'maintenance':    'Maintenance',
  'expeditions':    'Expeditions',
  'hire':           'Self-Fly Hire',
  'viewing':        'Book a Viewing',
  'rebuild':        'Rebuild Programme',
  'unmanned':       'Robinson Unmanned',
  'careers':        'Careers',
  'other':          'Other',
};

const INFO = [
  {
    label: 'Address',
    content: (
      <address style={{ fontStyle: 'normal', color: '#1a1a1a', fontSize: '0.9rem', lineHeight: 1.8 }}>
        Denham Aerodrome<br />
        Tilehouse Lane<br />
        Denham, UB9 5DF
      </address>
    ),
  },
  {
    label: 'Phone',
    content: (
      <a href="tel:+441895833373" className="ct-link" style={{ fontSize: '0.9rem', fontWeight: 600, color: '#1a1a1a' }}>
        +44 (0)1895 833373
      </a>
    ),
  },
  {
    label: 'Email',
    content: (
      <a href="mailto:info@hqaviation.com" className="ct-link" style={{ fontSize: '0.9rem', fontWeight: 600, color: '#1a1a1a' }}>
        info@hqaviation.com
      </a>
    ),
  },
  {
    label: 'Hours',
    content: (
      <div style={{ fontSize: '0.9rem', color: '#1a1a1a', lineHeight: 1.8 }}>
        <div style={{ display: 'flex', gap: '2rem' }}>
          <span style={{ color: '#888' }}>Mon – Sun</span>
          <span style={{ fontWeight: 600 }}>08:30 – 17:00</span>
        </div>
      </div>
    ),
  },
];

export default function Contact() {
  const [searchParams] = useSearchParams();
  const preSubject = SUBJECT_MAP[searchParams.get('subject')] || '';

  const [formData, setFormData] = useState({
    name: '', email: '', phone: '',
    subject: preSubject,
    message: '',
  });
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState(null);

  const handleChange = (e) =>
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setError(null);
    try {
      const res = await fetch('/api/leads', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name:    formData.name,
          email:   formData.email,
          phone:   formData.phone,
          subject: SUBJECT_LABELS[formData.subject] || formData.subject,
          message: formData.message,
          source:  'contact-page',
        }),
      });
      if (!res.ok) throw new Error();
      setSubmitted(true);
    } catch {
      setError('Something went wrong. Please try again or call us directly.');
    } finally {
      setSubmitting(false);
    }
  };

  const resetForm = () => {
    setSubmitted(false);
    setError(null);
    setFormData({ name: '', email: '', phone: '', subject: '', message: '' });
  };

  return (
    <div style={{ fontFamily: "'Space Grotesk', -apple-system, sans-serif", background: '#faf9f6', minHeight: '100vh' }}>
      <style>{`
        .ct-input {
          width: 100%;
          padding: 0.875rem 1rem;
          font-family: 'Space Grotesk', sans-serif;
          font-size: 0.875rem;
          color: #1a1a1a;
          background: #faf9f6;
          border: 1px solid #e8e6e2;
          border-radius: 6px;
          transition: border-color 0.2s, box-shadow 0.2s, background 0.2s;
          box-sizing: border-box;
          -webkit-appearance: none;
          appearance: none;
        }
        .ct-input:focus {
          outline: none;
          border-color: #1a1a1a;
          background: #fff;
          box-shadow: 0 0 0 3px rgba(26,26,26,0.07);
        }
        .ct-input::placeholder { color: #c5c3bf; }
        .ct-label {
          display: block;
          font-family: 'Share Tech Mono', monospace;
          font-size: 0.58rem;
          letter-spacing: 0.14em;
          text-transform: uppercase;
          color: #aaa;
          margin-bottom: 0.45rem;
        }
        .ct-submit {
          width: 100%;
          padding: 1rem 2rem;
          background: #1a1a1a;
          color: #fff;
          border: none;
          border-radius: 6px;
          font-family: 'Space Grotesk', sans-serif;
          font-size: 0.78rem;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 0.1em;
          cursor: pointer;
          transition: background 0.2s, transform 0.1s;
        }
        .ct-submit:hover:not(:disabled) { background: #E04A2F; }
        .ct-submit:active:not(:disabled) { transform: translateY(1px); }
        .ct-submit:disabled { opacity: 0.5; cursor: not-allowed; }
        .ct-link { transition: color 0.2s; text-decoration: none; }
        .ct-link:hover { color: #E04A2F !important; }
        .ct-ghost-btn {
          background: none;
          border: 1px solid #e8e6e2;
          border-radius: 6px;
          padding: 0.6rem 1.25rem;
          font-family: 'Space Grotesk', sans-serif;
          font-size: 0.75rem;
          color: #888;
          cursor: pointer;
          transition: border-color 0.2s, color 0.2s;
        }
        .ct-ghost-btn:hover { border-color: #1a1a1a; color: #1a1a1a; }
        @media (max-width: 860px) {
          .ct-hero-inner { padding: 4rem 1.5rem 3rem !important; }
          .ct-body { padding: 2.5rem 1.5rem 4rem !important; }
          .ct-grid { grid-template-columns: 1fr !important; }
        }
        @media (max-width: 500px) {
          .ct-name-row { grid-template-columns: 1fr !important; }
        }
      `}</style>

      {/* ── Hero ─────────────────────────────────────────────────── */}
      <div style={{ background: '#1a1a1a', marginTop: '-80px' }}>
        <div className="ct-hero-inner" style={{ maxWidth: '1100px', margin: '0 auto', padding: 'calc(6rem + 80px) 2rem 4rem' }}>
          {/* Breadcrumb */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '2rem' }}>
            <Link to="/" style={{ fontFamily: "'Share Tech Mono', monospace", fontSize: '0.6rem', letterSpacing: '0.15em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.35)', textDecoration: 'none', transition: 'color 0.2s' }}
              onMouseEnter={e => e.target.style.color = 'rgba(255,255,255,0.7)'}
              onMouseLeave={e => e.target.style.color = 'rgba(255,255,255,0.35)'}
            >Home</Link>
            <span style={{ color: 'rgba(255,255,255,0.2)', fontSize: '0.6rem' }}>/</span>
            <span style={{ fontFamily: "'Share Tech Mono', monospace", fontSize: '0.6rem', letterSpacing: '0.15em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.5)' }}>Contact</span>
          </div>

          <span style={{ fontFamily: "'Share Tech Mono', monospace", fontSize: '0.62rem', letterSpacing: '0.28em', textTransform: 'uppercase', color: '#E04A2F', display: 'block', marginBottom: '0.9rem' }}>
            Get In Touch
          </span>
          <h1 style={{ fontSize: 'clamp(2.2rem, 5vw, 3.75rem)', fontWeight: 700, color: '#fff', margin: '0 0 1.25rem', letterSpacing: '-0.025em', lineHeight: 1.08 }}>
            Contact Us
          </h1>
          <p style={{ fontSize: '0.975rem', color: 'rgba(255,255,255,0.5)', maxWidth: '420px', lineHeight: 1.75, margin: 0 }}>
            Based at Denham Aerodrome, open seven days a week. We'll get back to you as soon as possible.
          </p>
        </div>
      </div>

      {/* ── Body ─────────────────────────────────────────────────── */}
      <div className="ct-body" style={{ maxWidth: '1100px', margin: '0 auto', padding: '4rem 2rem 5rem' }}>
        <div className="ct-grid" style={{ display: 'grid', gridTemplateColumns: '1.1fr 0.9fr', gap: '3rem', alignItems: 'start' }}>

          {/* ── Form card ── */}
          <div style={{ background: '#fff', border: '1px solid #e8e6e2', borderRadius: '12px', padding: '2.5rem', boxShadow: '0 6px 32px rgba(0,0,0,0.06)' }}>
            {submitted ? (
              /* Success state */
              <div style={{ textAlign: 'center', padding: '2rem 1rem' }}>
                <div style={{ width: 56, height: 56, background: '#E04A2F', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.5rem', fontSize: '1.4rem', color: '#fff' }}>✓</div>
                <h3 style={{ fontSize: '1.35rem', fontWeight: 700, color: '#1a1a1a', margin: '0 0 0.75rem' }}>Message Received</h3>
                <p style={{ color: '#888', fontSize: '0.875rem', lineHeight: 1.75, margin: '0 0 2rem' }}>
                  We'll be in touch shortly. If urgent, call us on{' '}
                  <a href="tel:+441895833373" className="ct-link" style={{ color: '#1a1a1a', fontWeight: 600 }}>
                    +44 (0)1895 833373
                  </a>.
                </p>
                <button className="ct-ghost-btn" onClick={resetForm}>
                  Send another message
                </button>
              </div>
            ) : (
              <>
                <h2 style={{ fontSize: '1.2rem', fontWeight: 700, color: '#1a1a1a', margin: '0 0 0.3rem' }}>Send a Message</h2>
                <p style={{ fontFamily: "'Share Tech Mono', monospace", fontSize: '0.58rem', textTransform: 'uppercase', letterSpacing: '0.15em', color: '#bbb', margin: '0 0 2rem', paddingBottom: '1.25rem', borderBottom: '1px solid #f0eee9' }}>
                  We respond within one business day
                </p>

                <form onSubmit={handleSubmit} noValidate>
                  {/* Name + Email row */}
                  <div className="ct-name-row" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
                    <div>
                      <label className="ct-label" htmlFor="ct-name">Name *</label>
                      <input className="ct-input" id="ct-name" type="text" name="name" value={formData.name} onChange={handleChange} placeholder="John Smith" required />
                    </div>
                    <div>
                      <label className="ct-label" htmlFor="ct-email">Email *</label>
                      <input className="ct-input" id="ct-email" type="email" name="email" value={formData.email} onChange={handleChange} placeholder="you@email.com" required />
                    </div>
                  </div>

                  {/* Phone + Subject row */}
                  <div className="ct-name-row" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
                    <div>
                      <label className="ct-label" htmlFor="ct-phone">Phone</label>
                      <input className="ct-input" id="ct-phone" type="tel" name="phone" value={formData.phone} onChange={handleChange} placeholder="+44 7XXX XXXXXX" />
                    </div>
                    <div>
                      <label className="ct-label" htmlFor="ct-subject">Subject *</label>
                      <select className="ct-input" id="ct-subject" name="subject" value={formData.subject} onChange={handleChange} required style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='8' viewBox='0 0 12 8'%3E%3Cpath d='M1 1l5 5 5-5' stroke='%23aaa' strokeWidth='1.5' fill='none' strokeLinecap='round'/%3E%3C/svg%3E")`, backgroundRepeat: 'no-repeat', backgroundPosition: 'right 0.85rem center', paddingRight: '2.25rem' }}>
                        <option value="">Select…</option>
                        <option value="aircraft-sales">Aircraft Sales</option>
                        <option value="training">Flight Training</option>
                        <option value="maintenance">Maintenance</option>
                        <option value="expeditions">Expeditions</option>
                        <option value="hire">Self-Fly Hire</option>
                        <option value="viewing">Book a Viewing</option>
                        <option value="rebuild">Rebuild Programme</option>
                        <option value="unmanned">Robinson Unmanned</option>
                        <option value="careers">Careers</option>
                        <option value="other">Other</option>
                      </select>
                    </div>
                  </div>

                  {/* Message */}
                  <div style={{ marginBottom: '1.5rem' }}>
                    <label className="ct-label" htmlFor="ct-message">Message *</label>
                    <textarea className="ct-input" id="ct-message" name="message" value={formData.message} onChange={handleChange} placeholder="Tell us what you're looking for…" rows={5} required style={{ resize: 'vertical', minHeight: '130px' }} />
                  </div>

                  <button type="submit" className="ct-submit" disabled={submitting}>
                    {submitting ? 'Sending…' : 'Send Message →'}
                  </button>

                  {error && (
                    <p style={{ marginTop: '0.75rem', color: '#dc2626', fontSize: '0.8rem', textAlign: 'center', margin: '0.75rem 0 0' }}>
                      {error}
                    </p>
                  )}
                </form>
              </>
            )}
          </div>

          {/* ── Info column ── */}
          <div>
            {/* Contact details */}
            <div style={{ background: '#fff', border: '1px solid #e8e6e2', borderRadius: '12px', overflow: 'hidden', marginBottom: '1.5rem', boxShadow: '0 2px 12px rgba(0,0,0,0.04)' }}>
              {INFO.map(({ label, content }, i) => (
                <div key={label} style={{ display: 'flex', gap: '1.5rem', padding: '1.25rem 1.75rem', borderBottom: i < INFO.length - 1 ? '1px solid #f5f3ef' : 'none', alignItems: 'flex-start' }}>
                  <span style={{ fontFamily: "'Share Tech Mono', monospace", fontSize: '0.58rem', letterSpacing: '0.14em', textTransform: 'uppercase', color: '#bbb', paddingTop: '0.25rem', minWidth: '52px', flexShrink: 0 }}>
                    {label}
                  </span>
                  <div>{content}</div>
                </div>
              ))}
            </div>

            {/* Map */}
            <div style={{ borderRadius: '12px', overflow: 'hidden', border: '1px solid #e8e6e2', height: '260px', background: '#eae8e4', boxShadow: '0 2px 12px rgba(0,0,0,0.04)' }}>
              <iframe
                title="Denham Aerodrome"
                width="100%"
                height="100%"
                style={{ border: 0, display: 'block' }}
                loading="lazy"
                allowFullScreen
                referrerPolicy="no-referrer-when-downgrade"
                src="https://maps.google.com/maps?q=Denham+Aerodrome,+Tilehouse+Lane,+Denham,+UB9+5DF&output=embed"
              />
            </div>

            {/* Directions nudge */}
            <p style={{ fontFamily: "'Share Tech Mono', monospace", fontSize: '0.58rem', letterSpacing: '0.12em', textTransform: 'uppercase', color: '#bbb', textAlign: 'center', marginTop: '0.75rem' }}>
              Denham Aerodrome · UB9 5DF · United Kingdom
            </p>
          </div>

        </div>
      </div>
    </div>
  );
}

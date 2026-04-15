import React, { useState } from 'react';

/**
 * adv-012: Pilot Briefing Card (Trip Registration)
 * Feedback: "We need a little component for taking registered interest in a trip"
 * Target: expeditions
 */

const styles = {
  container: {
    padding: '4rem 2rem',
    background: 'var(--hq-background, #faf9f6)',
  },
  card: {
    maxWidth: '500px',
    margin: '0 auto',
    background: '#fff',
    borderRadius: '12px',
    boxShadow: '0 15px 50px rgba(0,0,0,0.1)',
    overflow: 'hidden',
  },
  header: {
    background: 'linear-gradient(135deg, #1a1a1a 0%, #2d2d2d 100%)',
    padding: '1.5rem 2rem',
    color: '#fff',
    position: 'relative',
  },
  headerPattern: {
    position: 'absolute',
    inset: 0,
    opacity: 0.05,
    backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 60 60'%3E%3Cpath d='M30 5 L35 30 L30 55 L25 30 Z' fill='%23fff'/%3E%3Cpath d='M5 30 L30 25 L55 30 L30 35 Z' fill='%23fff'/%3E%3C/svg%3E")`,
    backgroundSize: '60px 60px',
  },
  overline: {
    fontFamily: "'Share Tech Mono', monospace",
    fontSize: '0.6rem',
    letterSpacing: '0.2em',
    color: 'var(--hq-accent, #E04A2F)',
    textTransform: 'uppercase',
    position: 'relative',
    zIndex: 1,
  },
  title: {
    fontSize: '1.5rem',
    fontWeight: 700,
    textTransform: 'uppercase',
    margin: '0.5rem 0 0 0',
    position: 'relative',
    zIndex: 1,
  },
  body: {
    padding: '2rem',
  },
  tripInfo: {
    display: 'grid',
    gridTemplateColumns: 'repeat(2, 1fr)',
    gap: '1rem',
    marginBottom: '1.5rem',
    paddingBottom: '1.5rem',
    borderBottom: '1px solid var(--hq-border, #e8e6e2)',
  },
  infoItem: {
    display: 'flex',
    flexDirection: 'column',
    gap: '0.25rem',
  },
  infoLabel: {
    fontFamily: "'Share Tech Mono', monospace",
    fontSize: '0.6rem',
    letterSpacing: '0.15em',
    textTransform: 'uppercase',
    color: 'var(--hq-muted, #888888)',
  },
  infoValue: {
    fontSize: '1rem',
    fontWeight: 600,
    color: 'var(--hq-primary, #1a1a1a)',
  },
  spotsLeft: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
    padding: '0.75rem 1rem',
    background: 'rgba(224, 74, 47, 0.1)',
    borderRadius: '8px',
    marginBottom: '1.5rem',
  },
  spotsDot: {
    width: '10px',
    height: '10px',
    background: 'var(--hq-accent, #E04A2F)',
    borderRadius: '50%',
    animation: 'pulse 2s infinite',
  },
  spotsText: {
    fontFamily: "'Share Tech Mono', monospace",
    fontSize: '0.75rem',
    letterSpacing: '0.1em',
    color: 'var(--hq-accent, #E04A2F)',
    fontWeight: 600,
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: '1rem',
  },
  inputGroup: {
    display: 'flex',
    flexDirection: 'column',
    gap: '0.5rem',
  },
  label: {
    fontFamily: "'Share Tech Mono', monospace",
    fontSize: '0.65rem',
    letterSpacing: '0.1em',
    textTransform: 'uppercase',
    color: 'var(--hq-muted, #888888)',
  },
  input: {
    padding: '0.875rem 1rem',
    border: '1px solid var(--hq-border, #e8e6e2)',
    borderRadius: '6px',
    fontSize: '0.9rem',
    fontFamily: "'Space Grotesk', sans-serif",
    transition: 'border-color 0.3s ease, box-shadow 0.3s ease',
    outline: 'none',
  },
  button: {
    padding: '1rem 2rem',
    background: 'var(--hq-primary, #1a1a1a)',
    color: '#fff',
    border: 'none',
    borderRadius: '6px',
    fontFamily: "'Space Grotesk', sans-serif",
    fontSize: '0.75rem',
    fontWeight: 600,
    letterSpacing: '0.1em',
    textTransform: 'uppercase',
    cursor: 'pointer',
    transition: 'background 0.3s ease, transform 0.2s ease',
    marginTop: '0.5rem',
  },
  success: {
    textAlign: 'center',
    padding: '2rem',
  },
  successIcon: {
    width: '60px',
    height: '60px',
    background: '#28a745',
    borderRadius: '50%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    margin: '0 auto 1rem',
    color: '#fff',
    fontSize: '1.5rem',
  },
  successText: {
    fontSize: '1.25rem',
    fontWeight: 600,
    color: 'var(--hq-primary, #1a1a1a)',
    marginBottom: '0.5rem',
  },
  successSubtext: {
    fontSize: '0.9rem',
    color: 'var(--hq-body, #666666)',
  },
  note: {
    marginTop: '2rem',
    padding: '1rem 1.25rem',
    background: 'linear-gradient(135deg, #d4edda 0%, #c3e6cb 100%)',
    borderLeft: '4px solid #28a745',
    borderRadius: '0 8px 8px 0',
  },
  noteLabel: {
    fontFamily: "'Share Tech Mono', monospace",
    fontSize: '0.6rem',
    letterSpacing: '0.15em',
    textTransform: 'uppercase',
    color: '#155724',
    marginBottom: '0.5rem',
  },
  noteText: {
    fontSize: '0.85rem',
    color: '#155724',
    lineHeight: 1.6,
    margin: 0,
  },
};

const TripRegistrationCard = ({
  destination = "Iceland Adventure",
  dates = "June 15-22, 2025",
  duration = "8 Days",
  aircraft = "R66 Turbine",
  spotsRemaining = 3,
}) => {
  const [submitted, setSubmitted] = useState(false);
  const [formData, setFormData] = useState({ name: '', email: '', phone: '' });

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <div style={styles.container}>
      <style>{`
        @keyframes pulse {
          0%, 100% { opacity: 1; transform: scale(1); }
          50% { opacity: 0.7; transform: scale(1.1); }
        }
        .trip-input:focus {
          border-color: var(--hq-accent, #E04A2F) !important;
          box-shadow: 0 0 0 3px rgba(224, 74, 47, 0.1) !important;
        }
        .trip-btn:hover {
          background: #333 !important;
          transform: translateY(-2px);
        }
      `}</style>

      <div style={styles.card}>
        <div style={styles.header}>
          <div style={styles.headerPattern} />
          <span style={styles.overline}>Upcoming Expedition</span>
          <h3 style={styles.title}>{destination}</h3>
        </div>

        <div style={styles.body}>
          {!submitted ? (
            <>
              <div style={styles.tripInfo}>
                <div style={styles.infoItem}>
                  <span style={styles.infoLabel}>Dates</span>
                  <span style={styles.infoValue}>{dates}</span>
                </div>
                <div style={styles.infoItem}>
                  <span style={styles.infoLabel}>Duration</span>
                  <span style={styles.infoValue}>{duration}</span>
                </div>
                <div style={styles.infoItem}>
                  <span style={styles.infoLabel}>Aircraft</span>
                  <span style={styles.infoValue}>{aircraft}</span>
                </div>
                <div style={styles.infoItem}>
                  <span style={styles.infoLabel}>Group Size</span>
                  <span style={styles.infoValue}>Max 6 pilots</span>
                </div>
              </div>

              <div style={styles.spotsLeft}>
                <div style={styles.spotsDot} />
                <span style={styles.spotsText}>{spotsRemaining} spots remaining</span>
              </div>

              <form style={styles.form} onSubmit={handleSubmit}>
                <div style={styles.inputGroup}>
                  <label style={styles.label}>Full Name</label>
                  <input
                    className="trip-input"
                    style={styles.input}
                    type="text"
                    placeholder="Enter your name"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    required
                  />
                </div>
                <div style={styles.inputGroup}>
                  <label style={styles.label}>Email Address</label>
                  <input
                    className="trip-input"
                    style={styles.input}
                    type="email"
                    placeholder="your@email.com"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    required
                  />
                </div>
                <div style={styles.inputGroup}>
                  <label style={styles.label}>Phone Number</label>
                  <input
                    className="trip-input"
                    style={styles.input}
                    type="tel"
                    placeholder="+44 7XXX XXXXXX"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  />
                </div>
                <button className="trip-btn" style={styles.button} type="submit">
                  Register Interest
                </button>
              </form>
            </>
          ) : (
            <div style={styles.success}>
              <div style={styles.successIcon}>✓</div>
              <div style={styles.successText}>Interest Registered!</div>
              <div style={styles.successSubtext}>
                We'll be in touch shortly with expedition details.
              </div>
            </div>
          )}
        </div>
      </div>

      <div style={styles.note}>
        <div style={styles.noteLabel}>adv-012 • Approved</div>
        <p style={styles.noteText}>
          Component for taking registered interest in a trip. Shows trip details, spots remaining,
          and collects user information.
        </p>
      </div>
    </div>
  );
};

export default TripRegistrationCard;

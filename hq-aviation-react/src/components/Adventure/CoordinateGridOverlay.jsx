import React from 'react';

/**
 * dec-003: Coordinate Grid Overlay
 * Feedback: "This is very cool for the 'where to find us' component"
 * Target: contact page - location/find us section
 */

const styles = {
  container: {
    position: 'relative',
    padding: '4rem 2rem',
    background: 'var(--hq-background, #faf9f6)',
    overflow: 'hidden',
  },
  gridOverlay: {
    position: 'absolute',
    inset: 0,
    pointerEvents: 'none',
    opacity: 0.03,
    backgroundImage: `
      linear-gradient(rgba(26, 26, 26, 0.8) 1px, transparent 1px),
      linear-gradient(90deg, rgba(26, 26, 26, 0.8) 1px, transparent 1px)
    `,
    backgroundSize: '50px 50px',
  },
  coordLabels: {
    position: 'absolute',
    inset: 0,
    pointerEvents: 'none',
  },
  coordLabel: {
    position: 'absolute',
    fontFamily: "'Share Tech Mono', monospace",
    fontSize: '0.55rem',
    letterSpacing: '0.1em',
    color: 'var(--hq-muted, #888888)',
    opacity: 0.4,
  },
  content: {
    position: 'relative',
    zIndex: 1,
    maxWidth: '1000px',
    margin: '0 auto',
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
    gap: '3rem',
    alignItems: 'center',
  },
  mapContainer: {
    position: 'relative',
    background: '#fff',
    borderRadius: '12px',
    overflow: 'hidden',
    boxShadow: '0 15px 50px rgba(0,0,0,0.1)',
  },
  mapPlaceholder: {
    width: '100%',
    height: '350px',
    background: 'linear-gradient(135deg, #e8e6e2 0%, #f5f5f2 100%)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    color: 'var(--hq-muted, #888888)',
    fontFamily: "'Share Tech Mono', monospace",
    fontSize: '0.75rem',
    letterSpacing: '0.1em',
  },
  mapPin: {
    position: 'absolute',
    top: '45%',
    left: '55%',
    transform: 'translate(-50%, -100%)',
    width: '40px',
    height: '50px',
  },
  mapPinIcon: {
    width: '100%',
    height: '100%',
    fill: 'var(--hq-accent, #E04A2F)',
    filter: 'drop-shadow(0 4px 8px rgba(224, 74, 47, 0.3))',
  },
  coordsDisplay: {
    position: 'absolute',
    bottom: '1rem',
    left: '1rem',
    background: 'rgba(26, 26, 26, 0.9)',
    color: '#fff',
    padding: '0.75rem 1rem',
    borderRadius: '6px',
    fontFamily: "'Share Tech Mono', monospace",
    fontSize: '0.75rem',
    letterSpacing: '0.1em',
  },
  info: {
    display: 'flex',
    flexDirection: 'column',
    gap: '1.5rem',
  },
  overline: {
    fontFamily: "'Share Tech Mono', monospace",
    fontSize: '0.65rem',
    letterSpacing: '0.2em',
    color: 'var(--hq-accent, #E04A2F)',
    textTransform: 'uppercase',
  },
  title: {
    fontSize: 'clamp(1.5rem, 4vw, 2.25rem)',
    fontWeight: 700,
    textTransform: 'uppercase',
    letterSpacing: '-0.02em',
    color: 'var(--hq-primary, #1a1a1a)',
    margin: '0.5rem 0 0 0',
  },
  address: {
    fontSize: '1rem',
    color: 'var(--hq-body, #666666)',
    lineHeight: 1.8,
    margin: 0,
  },
  contactItem: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.75rem',
  },
  contactIcon: {
    width: '20px',
    height: '20px',
    color: 'var(--hq-accent, #E04A2F)',
  },
  contactText: {
    fontFamily: "'Share Tech Mono', monospace",
    fontSize: '0.85rem',
    color: 'var(--hq-primary, #1a1a1a)',
    letterSpacing: '0.05em',
  },
  hours: {
    marginTop: '1rem',
  },
  hoursLabel: {
    fontFamily: "'Share Tech Mono', monospace",
    fontSize: '0.6rem',
    letterSpacing: '0.15em',
    textTransform: 'uppercase',
    color: 'var(--hq-muted, #888888)',
    marginBottom: '0.5rem',
  },
  hoursText: {
    fontSize: '0.9rem',
    color: 'var(--hq-body, #666666)',
    lineHeight: 1.6,
  },
  note: {
    position: 'relative',
    zIndex: 1,
    marginTop: '2rem',
    padding: '1rem 1.25rem',
    background: 'linear-gradient(135deg, #d4edda 0%, #c3e6cb 100%)',
    borderLeft: '4px solid #28a745',
    borderRadius: '0 8px 8px 0',
    maxWidth: '600px',
    margin: '2rem auto 0',
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

const CoordinateGridOverlay = () => {
  // Generate coordinate labels around the edges
  const coordLabelsData = [
    { top: '10%', left: '5%', text: '51.48°N' },
    { top: '30%', left: '5%', text: '51.47°N' },
    { top: '50%', left: '5%', text: '51.46°N' },
    { top: '70%', left: '5%', text: '51.45°N' },
    { bottom: '5%', left: '20%', text: '0.46°W' },
    { bottom: '5%', left: '40%', text: '0.45°W' },
    { bottom: '5%', left: '60%', text: '0.44°W' },
    { bottom: '5%', left: '80%', text: '0.43°W' },
  ];

  return (
    <div style={styles.container}>
      {/* Grid Overlay */}
      <div style={styles.gridOverlay} />

      {/* Coordinate Labels */}
      <div style={styles.coordLabels}>
        {coordLabelsData.map((coord, index) => (
          <span
            key={index}
            style={{
              ...styles.coordLabel,
              top: coord.top,
              bottom: coord.bottom,
              left: coord.left,
            }}
          >
            {coord.text}
          </span>
        ))}
      </div>

      <div style={styles.content}>
        {/* Map */}
        <div style={styles.mapContainer}>
          <div style={styles.mapPlaceholder}>
            [Interactive Map]
          </div>

          {/* Pin */}
          <div style={styles.mapPin}>
            <svg viewBox="0 0 24 36" style={styles.mapPinIcon}>
              <path d="M12 0C5.4 0 0 5.4 0 12c0 9 12 24 12 24s12-15 12-24c0-6.6-5.4-12-12-12zm0 16c-2.2 0-4-1.8-4-4s1.8-4 4-4 4 1.8 4 4-1.8 4-4 4z"/>
            </svg>
          </div>

          {/* Coordinates Display */}
          <div style={styles.coordsDisplay}>
            51.4700°N · 0.4543°W
          </div>
        </div>

        {/* Info */}
        <div style={styles.info}>
          <div>
            <span style={styles.overline}>Find Us</span>
            <h2 style={styles.title}>Denham Aerodrome</h2>
          </div>

          <p style={styles.address}>
            HQ Aviation<br />
            Denham Aerodrome<br />
            Tilehouse Lane<br />
            Denham, Buckinghamshire<br />
            UB9 5DF, United Kingdom
          </p>

          <div style={styles.contactItem}>
            <svg style={styles.contactIcon} viewBox="0 0 24 24" fill="currentColor">
              <path d="M6.62 10.79c1.44 2.83 3.76 5.14 6.59 6.59l2.2-2.2c.27-.27.67-.36 1.02-.24 1.12.37 2.33.57 3.57.57.55 0 1 .45 1 1V20c0 .55-.45 1-1 1-9.39 0-17-7.61-17-17 0-.55.45-1 1-1h3.5c.55 0 1 .45 1 1 0 1.25.2 2.45.57 3.57.11.35.03.74-.25 1.02l-2.2 2.2z"/>
            </svg>
            <span style={styles.contactText}>+44 1895 833 838</span>
          </div>

          <div style={styles.contactItem}>
            <svg style={styles.contactIcon} viewBox="0 0 24 24" fill="currentColor">
              <path d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z"/>
            </svg>
            <span style={styles.contactText}>info@hqaviation.com</span>
          </div>

          <div style={styles.hours}>
            <div style={styles.hoursLabel}>Operating Hours</div>
            <div style={styles.hoursText}>
              Monday - Friday: 08:00 - 18:00<br />
              Saturday: 09:00 - 17:00<br />
              Sunday: By appointment
            </div>
          </div>
        </div>
      </div>

      <div style={styles.note}>
        <div style={styles.noteLabel}>dec-003 • Approved</div>
        <p style={styles.noteText}>
          Coordinate grid overlay for the "where to find us" section. Adds aviation-themed
          navigational aesthetic to the contact/location component.
        </p>
      </div>
    </div>
  );
};

export default CoordinateGridOverlay;

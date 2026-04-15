import React from 'react';

/**
 * adv-013: Aviation Dividers
 * Feedback: "I like the runway style divider"
 * Variant: runway-style
 */

const styles = {
  container: {
    padding: '3rem 2rem',
    background: 'var(--hq-background, #faf9f6)',
  },
  showcase: {
    maxWidth: '800px',
    margin: '0 auto',
  },
  dividerSection: {
    marginBottom: '3rem',
  },
  label: {
    fontFamily: "'Share Tech Mono', monospace",
    fontSize: '0.65rem',
    letterSpacing: '0.15em',
    textTransform: 'uppercase',
    color: 'var(--hq-muted, #888888)',
    marginBottom: '1rem',
    display: 'block',
  },
  // Runway Style Divider
  runway: {
    position: 'relative',
    height: '40px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  runwayCenterline: {
    position: 'absolute',
    width: '100%',
    height: '6px',
    background: 'var(--hq-primary, #1a1a1a)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  runwayDashes: {
    width: '100%',
    height: '100%',
    backgroundImage: `repeating-linear-gradient(
      90deg,
      #fff 0px,
      #fff 30px,
      transparent 30px,
      transparent 60px
    )`,
  },
  runwayNumbers: {
    position: 'absolute',
    display: 'flex',
    justifyContent: 'space-between',
    width: '100%',
    padding: '0 2rem',
  },
  runwayNumber: {
    fontFamily: "'Share Tech Mono', monospace",
    fontSize: '0.75rem',
    fontWeight: 700,
    color: 'var(--hq-primary, #1a1a1a)',
    background: 'var(--hq-background, #faf9f6)',
    padding: '0.25rem 0.5rem',
  },
  // Flight Path Divider
  flightPath: {
    position: 'relative',
    height: '50px',
    display: 'flex',
    alignItems: 'center',
  },
  flightPathLine: {
    flex: 1,
    height: '2px',
    background: `repeating-linear-gradient(
      90deg,
      var(--hq-accent, #E04A2F) 0px,
      var(--hq-accent, #E04A2F) 10px,
      transparent 10px,
      transparent 20px
    )`,
    opacity: 0.5,
  },
  flightPathIcon: {
    width: '40px',
    height: '40px',
    flexShrink: 0,
    margin: '0 1rem',
  },
  // Altitude Divider
  altitude: {
    position: 'relative',
    height: '60px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  altitudeLine: {
    position: 'absolute',
    width: '100%',
    height: '1px',
    background: 'var(--hq-border, #e8e6e2)',
  },
  altitudeMarker: {
    position: 'relative',
    background: 'var(--hq-background, #faf9f6)',
    padding: '0.5rem 1.5rem',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  altitudeLabel: {
    fontFamily: "'Share Tech Mono', monospace",
    fontSize: '0.6rem',
    letterSpacing: '0.2em',
    color: 'var(--hq-muted, #888888)',
    textTransform: 'uppercase',
  },
  altitudeValue: {
    fontFamily: "'Share Tech Mono', monospace",
    fontSize: '1rem',
    fontWeight: 700,
    color: 'var(--hq-primary, #1a1a1a)',
  },
  // Compass Divider
  compass: {
    display: 'flex',
    alignItems: 'center',
    gap: '1rem',
  },
  compassLine: {
    flex: 1,
    height: '1px',
    background: 'var(--hq-border, #e8e6e2)',
  },
  compassIcon: {
    width: '50px',
    height: '50px',
    opacity: 0.3,
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

const HeliSVG = () => (
  <svg viewBox="0 0 40 40" style={styles.flightPathIcon} fill="var(--hq-accent, #E04A2F)">
    <path d="M8 18h2v4H8v-4zm24 0h-2v4h2v-4zm-12-14v4h8l-1.5-4H20zm-1.5 0h-6l-1.5 4h7.5V4zM7 10h26v1.5H7V10zm1.5 6h23v9c0 1.65-1.35 3-3 3H11.5c-1.65 0-3-1.35-3-3v-9z"/>
  </svg>
);

const CompassSVG = () => (
  <svg viewBox="0 0 100 100" style={styles.compassIcon}>
    <circle cx="50" cy="50" r="45" fill="none" stroke="currentColor" strokeWidth="2"/>
    <path d="M50 10 L53 50 L50 90 L47 50 Z" fill="currentColor"/>
    <path d="M10 50 L50 47 L90 50 L50 53 Z" fill="currentColor"/>
  </svg>
);

const AviationDividers = () => {
  return (
    <div style={styles.container}>
      <div style={styles.showcase}>
        {/* Runway Style - APPROVED */}
        <div style={styles.dividerSection}>
          <span style={styles.label}>Runway Style (Approved)</span>
          <div style={styles.runway}>
            <div style={styles.runwayCenterline}>
              <div style={styles.runwayDashes} />
            </div>
            <div style={styles.runwayNumbers}>
              <span style={styles.runwayNumber}>09</span>
              <span style={styles.runwayNumber}>27</span>
            </div>
          </div>
        </div>

        {/* Flight Path Divider */}
        <div style={styles.dividerSection}>
          <span style={styles.label}>Flight Path Style</span>
          <div style={styles.flightPath}>
            <div style={styles.flightPathLine} />
            <HeliSVG />
            <div style={styles.flightPathLine} />
          </div>
        </div>

        {/* Altitude Marker Divider */}
        <div style={styles.dividerSection}>
          <span style={styles.label}>Altitude Marker</span>
          <div style={styles.altitude}>
            <div style={styles.altitudeLine} />
            <div style={styles.altitudeMarker}>
              <span style={styles.altitudeLabel}>Cruising at</span>
              <span style={styles.altitudeValue}>FL 250</span>
            </div>
          </div>
        </div>

        {/* Compass Divider */}
        <div style={styles.dividerSection}>
          <span style={styles.label}>Compass Style</span>
          <div style={styles.compass}>
            <div style={styles.compassLine} />
            <CompassSVG />
            <div style={styles.compassLine} />
          </div>
        </div>
      </div>

      <div style={styles.note}>
        <div style={styles.noteLabel}>adv-013 • Approved</div>
        <p style={styles.noteText}>
          Runway style divider approved. Multiple aviation-themed divider variants for section breaks.
        </p>
      </div>
    </div>
  );
};

export default AviationDividers;

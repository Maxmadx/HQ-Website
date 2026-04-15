import React from 'react';

/**
 * dec-001: Compass Rose Decorations
 * Feedback: "Incorporate a compass motif into the footer"
 * Target: footer
 */

const styles = {
  container: {
    position: 'relative',
    padding: '4rem 2rem',
    background: 'var(--hq-primary, #1a1a1a)',
    color: '#fff',
    overflow: 'hidden',
  },
  compassBg: {
    position: 'absolute',
    width: '500px',
    height: '500px',
    opacity: 0.03,
    pointerEvents: 'none',
  },
  compassBgLeft: {
    top: '-100px',
    left: '-150px',
  },
  compassBgRight: {
    bottom: '-100px',
    right: '-150px',
    transform: 'rotate(15deg)',
  },
  content: {
    position: 'relative',
    zIndex: 1,
    maxWidth: '1200px',
    margin: '0 auto',
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
    gap: '3rem',
  },
  column: {
    display: 'flex',
    flexDirection: 'column',
    gap: '1rem',
  },
  columnTitle: {
    fontFamily: "'Share Tech Mono', monospace",
    fontSize: '0.65rem',
    letterSpacing: '0.2em',
    textTransform: 'uppercase',
    color: 'var(--hq-accent, #E04A2F)',
    marginBottom: '0.5rem',
  },
  link: {
    fontSize: '0.9rem',
    color: 'rgba(255,255,255,0.7)',
    textDecoration: 'none',
    transition: 'color 0.3s ease',
    cursor: 'pointer',
  },
  compassCenter: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '1rem',
  },
  compass: {
    width: '120px',
    height: '120px',
    position: 'relative',
  },
  compassRose: {
    width: '100%',
    height: '100%',
  },
  logoText: {
    fontWeight: 700,
    fontSize: '1.25rem',
    textTransform: 'uppercase',
    letterSpacing: '0.1em',
  },
  tagline: {
    fontFamily: "'Share Tech Mono', monospace",
    fontSize: '0.65rem',
    letterSpacing: '0.15em',
    color: 'rgba(255,255,255,0.5)',
    textTransform: 'uppercase',
  },
  bottom: {
    position: 'relative',
    zIndex: 1,
    marginTop: '3rem',
    paddingTop: '2rem',
    borderTop: '1px solid rgba(255,255,255,0.1)',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: '1rem',
    maxWidth: '1200px',
    margin: '3rem auto 0',
  },
  copyright: {
    fontFamily: "'Share Tech Mono', monospace",
    fontSize: '0.7rem',
    color: 'rgba(255,255,255,0.4)',
    letterSpacing: '0.1em',
  },
  coords: {
    fontFamily: "'Share Tech Mono', monospace",
    fontSize: '0.65rem',
    color: 'rgba(255,255,255,0.3)',
    letterSpacing: '0.1em',
  },
  note: {
    position: 'relative',
    zIndex: 1,
    marginTop: '2rem',
    padding: '1rem 1.25rem',
    background: 'rgba(255, 243, 205, 0.1)',
    borderLeft: '4px solid #ffc107',
    borderRadius: '0 8px 8px 0',
    maxWidth: '600px',
    margin: '2rem auto 0',
  },
  noteLabel: {
    fontFamily: "'Share Tech Mono', monospace",
    fontSize: '0.6rem',
    letterSpacing: '0.15em',
    textTransform: 'uppercase',
    color: '#ffc107',
    marginBottom: '0.5rem',
  },
  noteText: {
    fontSize: '0.85rem',
    color: 'rgba(255,255,255,0.7)',
    lineHeight: 1.6,
    margin: 0,
  },
};

const CompassSVG = ({ style, className }) => (
  <svg viewBox="0 0 200 200" style={style} className={className} fill="currentColor">
    <circle cx="100" cy="100" r="90" fill="none" stroke="currentColor" strokeWidth="2"/>
    <circle cx="100" cy="100" r="70" fill="none" stroke="currentColor" strokeWidth="1"/>
    <circle cx="100" cy="100" r="50" fill="none" stroke="currentColor" strokeWidth="0.5"/>
    <path d="M100 10 L105 100 L100 190 L95 100 Z" fill="currentColor"/>
    <path d="M10 100 L100 95 L190 100 L100 105 Z" fill="currentColor"/>
    <text x="100" y="28" textAnchor="middle" fontSize="14" fill="currentColor">N</text>
    <text x="100" y="182" textAnchor="middle" fontSize="14" fill="currentColor">S</text>
    <text x="18" y="104" textAnchor="middle" fontSize="14" fill="currentColor">W</text>
    <text x="182" y="104" textAnchor="middle" fontSize="14" fill="currentColor">E</text>
  </svg>
);

const CompassRoseFooter = () => {
  return (
    <footer style={styles.container}>
      <style>{`
        .footer-link:hover {
          color: #fff !important;
        }
        .compass-spin {
          animation: compassSpin 60s linear infinite;
        }
        @keyframes compassSpin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>

      {/* Background compass roses */}
      <CompassSVG style={{ ...styles.compassBg, ...styles.compassBgLeft }} />
      <CompassSVG style={{ ...styles.compassBg, ...styles.compassBgRight }} />

      <div style={styles.content}>
        {/* Training Column */}
        <div style={styles.column}>
          <span style={styles.columnTitle}>Training</span>
          <span className="footer-link" style={styles.link}>Private Pilot License</span>
          <span className="footer-link" style={styles.link}>Commercial License</span>
          <span className="footer-link" style={styles.link}>Night Rating</span>
          <span className="footer-link" style={styles.link}>Instrument Rating</span>
          <span className="footer-link" style={styles.link}>Type Ratings</span>
        </div>

        {/* Center Compass Logo */}
        <div style={styles.compassCenter}>
          <div style={styles.compass}>
            <CompassSVG style={styles.compassRose} className="compass-spin" />
          </div>
          <span style={styles.logoText}>HQ Aviation</span>
          <span style={styles.tagline}>The Robinson Specialists</span>
        </div>

        {/* Services Column */}
        <div style={styles.column}>
          <span style={styles.columnTitle}>Services</span>
          <span className="footer-link" style={styles.link}>Maintenance</span>
          <span className="footer-link" style={styles.link}>Aircraft Sales</span>
          <span className="footer-link" style={styles.link}>Hangarage</span>
          <span className="footer-link" style={styles.link}>Self-Fly Hire</span>
          <span className="footer-link" style={styles.link}>Ferry Flights</span>
        </div>

        {/* Expeditions Column */}
        <div style={styles.column}>
          <span style={styles.columnTitle}>Expeditions</span>
          <span className="footer-link" style={styles.link}>Polar Adventures</span>
          <span className="footer-link" style={styles.link}>Alpine Tours</span>
          <span className="footer-link" style={styles.link}>Scottish Highlands</span>
          <span className="footer-link" style={styles.link}>Nordic Fjords</span>
          <span className="footer-link" style={styles.link}>Custom Trips</span>
        </div>

        {/* Contact Column */}
        <div style={styles.column}>
          <span style={styles.columnTitle}>Contact</span>
          <span className="footer-link" style={styles.link}>Denham Aerodrome</span>
          <span className="footer-link" style={styles.link}>+44 1895 833 838</span>
          <span className="footer-link" style={styles.link}>info@hqaviation.com</span>
        </div>
      </div>

      <div style={styles.bottom}>
        <span style={styles.copyright}>© 2024 HQ Aviation Ltd. All rights reserved.</span>
        <span style={styles.coords}>51.4700°N 0.4543°W · Denham, UK</span>
      </div>

      <div style={styles.note}>
        <div style={styles.noteLabel}>dec-001 • Needs Enhancement</div>
        <p style={styles.noteText}>
          Compass motif incorporated into footer. Subtle rotating compass logo and
          background compass rose decorations.
        </p>
      </div>
    </footer>
  );
};

export default CompassRoseFooter;

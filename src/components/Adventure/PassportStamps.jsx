import React from 'react';

/**
 * adv-041: Passport Stamps
 * Feedback: "Passport stamps for the expeditions page is quite cool"
 * Target: expeditions
 */

const styles = {
  container: {
    padding: '4rem 2rem',
    background: 'var(--hq-hover-bg, #f5f5f2)',
  },
  header: {
    textAlign: 'center',
    marginBottom: '3rem',
  },
  overline: {
    fontFamily: "'Share Tech Mono', monospace",
    fontSize: '0.65rem',
    letterSpacing: '0.2em',
    color: 'var(--hq-accent, #E04A2F)',
    textTransform: 'uppercase',
  },
  title: {
    fontSize: 'clamp(1.5rem, 4vw, 2rem)',
    fontWeight: 700,
    textTransform: 'uppercase',
    color: 'var(--hq-primary, #1a1a1a)',
    margin: '0.5rem 0 0 0',
  },
  grid: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: '2rem',
    justifyContent: 'center',
    maxWidth: '1000px',
    margin: '0 auto',
  },
  stamp: {
    width: '180px',
    height: '180px',
    borderRadius: '50%',
    border: '4px double',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    textAlign: 'center',
    padding: '1rem',
    position: 'relative',
    transform: 'rotate(-5deg)',
    transition: 'transform 0.3s ease',
  },
  stampBlue: {
    borderColor: '#1e3a5f',
    color: '#1e3a5f',
  },
  stampRed: {
    borderColor: 'var(--hq-accent, #E04A2F)',
    color: 'var(--hq-accent, #E04A2F)',
    transform: 'rotate(3deg)',
  },
  stampGreen: {
    borderColor: '#2d5a3d',
    color: '#2d5a3d',
    transform: 'rotate(-8deg)',
  },
  stampPurple: {
    borderColor: '#5b3d7a',
    color: '#5b3d7a',
    transform: 'rotate(6deg)',
  },
  country: {
    fontSize: '1.1rem',
    fontWeight: 700,
    textTransform: 'uppercase',
    letterSpacing: '0.1em',
    marginBottom: '0.25rem',
  },
  date: {
    fontFamily: "'Share Tech Mono', monospace",
    fontSize: '0.7rem',
    letterSpacing: '0.1em',
    opacity: 0.8,
  },
  type: {
    fontFamily: "'Share Tech Mono', monospace",
    fontSize: '0.55rem',
    letterSpacing: '0.15em',
    textTransform: 'uppercase',
    marginTop: '0.5rem',
    padding: '0.25rem 0.5rem',
    border: '1px solid currentColor',
    borderRadius: '2px',
  },
  icon: {
    position: 'absolute',
    top: '15px',
    width: '24px',
    height: '24px',
    opacity: 0.6,
  },
  note: {
    marginTop: '3rem',
    padding: '1rem 1.25rem',
    background: 'linear-gradient(135deg, #d4edda 0%, #c3e6cb 100%)',
    borderLeft: '4px solid #28a745',
    borderRadius: '0 8px 8px 0',
    maxWidth: '600px',
    margin: '3rem auto 0',
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

const HeliIcon = ({ color }) => (
  <svg viewBox="0 0 24 24" style={styles.icon} fill={color}>
    <path d="M3 11h1v2H3v-2zm19 0h-1v2h1v-2zm-9-9v3h5l-1-3h-4zm-1 0H8l-1 3h5V2zM4 7h16v1H4V7zm1 4h14v6c0 1.1-.9 2-2 2H7c-1.1 0-2-.9-2-2v-6z"/>
  </svg>
);

const stamps = [
  { country: 'Iceland', date: 'JUN 2024', type: 'Expedition', variant: 'blue' },
  { country: 'North Pole', date: 'APR 2024', type: 'Record Flight', variant: 'red' },
  { country: 'Switzerland', date: 'MAR 2024', type: 'Alpine Tour', variant: 'green' },
  { country: 'Scotland', date: 'SEP 2023', type: 'Training', variant: 'purple' },
  { country: 'Norway', date: 'JUL 2023', type: 'Fjord Tour', variant: 'blue' },
  { country: 'Greenland', date: 'AUG 2023', type: 'Expedition', variant: 'red' },
];

const getStampStyle = (variant) => {
  switch (variant) {
    case 'red': return styles.stampRed;
    case 'green': return styles.stampGreen;
    case 'purple': return styles.stampPurple;
    default: return styles.stampBlue;
  }
};

const getColor = (variant) => {
  switch (variant) {
    case 'red': return 'var(--hq-accent, #E04A2F)';
    case 'green': return '#2d5a3d';
    case 'purple': return '#5b3d7a';
    default: return '#1e3a5f';
  }
};

const PassportStamps = () => {
  return (
    <div style={styles.container}>
      <style>{`
        .passport-stamp:hover {
          transform: rotate(0deg) scale(1.05) !important;
        }
      `}</style>

      <div style={styles.header}>
        <span style={styles.overline}>Flight Log</span>
        <h2 style={styles.title}>Where We've Been</h2>
      </div>

      <div style={styles.grid}>
        {stamps.map((stamp, index) => (
          <div
            key={index}
            className="passport-stamp"
            style={{
              ...styles.stamp,
              ...getStampStyle(stamp.variant),
            }}
          >
            <HeliIcon color={getColor(stamp.variant)} />
            <span style={styles.country}>{stamp.country}</span>
            <span style={styles.date}>{stamp.date}</span>
            <span style={styles.type}>{stamp.type}</span>
          </div>
        ))}
      </div>

      <div style={styles.note}>
        <div style={styles.noteLabel}>adv-041 • Approved</div>
        <p style={styles.noteText}>
          Passport stamps for the expeditions page showing destinations visited with dates and trip types.
        </p>
      </div>
    </div>
  );
};

export default PassportStamps;

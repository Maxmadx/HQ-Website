import React from 'react';

/**
 * adv-016: Topographic Background
 * Feedback: "These waves for our mountain training section is a really cool element"
 * Target: training/mountain-flying
 */

const styles = {
  container: {
    position: 'relative',
    padding: '4rem 2rem',
    background: 'var(--hq-background, #faf9f6)',
    overflow: 'hidden',
    minHeight: '400px',
  },
  pattern: {
    position: 'absolute',
    inset: 0,
    opacity: 0.06,
    backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 1000 400'%3E%3Cpath d='M0 200 Q100 150 200 180 T400 160 T600 200 T800 170 T1000 190' fill='none' stroke='%231a1a1a' stroke-width='2'/%3E%3Cpath d='M0 220 Q150 180 300 210 T600 190 T900 220 T1000 200' fill='none' stroke='%231a1a1a' stroke-width='1.5'/%3E%3Cpath d='M0 240 Q200 210 400 250 T800 230 T1000 240' fill='none' stroke='%231a1a1a' stroke-width='1'/%3E%3Cpath d='M0 260 Q250 240 500 270 T1000 260' fill='none' stroke='%231a1a1a' stroke-width='0.8'/%3E%3Cpath d='M0 280 Q300 260 600 290 T1000 280' fill='none' stroke='%231a1a1a' stroke-width='0.6'/%3E%3Cpath d='M0 150 Q80 120 160 140 T320 120 T480 150 T640 130 T800 160 T1000 140' fill='none' stroke='%231a1a1a' stroke-width='1.2'/%3E%3Cpath d='M0 100 Q120 70 240 90 T480 70 T720 100 T1000 80' fill='none' stroke='%231a1a1a' stroke-width='0.8'/%3E%3C/svg%3E")`,
    backgroundSize: 'cover',
    backgroundPosition: 'center',
  },
  content: {
    position: 'relative',
    zIndex: 1,
    textAlign: 'center',
    maxWidth: '600px',
    margin: '0 auto',
  },
  overline: {
    fontFamily: "'Share Tech Mono', monospace",
    fontSize: '0.65rem',
    letterSpacing: '0.2em',
    color: 'var(--hq-accent, #E04A2F)',
    textTransform: 'uppercase',
    marginBottom: '0.75rem',
  },
  title: {
    fontSize: 'clamp(1.5rem, 4vw, 2.25rem)',
    fontWeight: 700,
    textTransform: 'uppercase',
    letterSpacing: '-0.02em',
    color: 'var(--hq-primary, #1a1a1a)',
    margin: '0 0 1rem 0',
  },
  description: {
    fontSize: '1rem',
    color: 'var(--hq-body, #666666)',
    lineHeight: 1.7,
    margin: 0,
  },
  note: {
    marginTop: '1.5rem',
    padding: '1rem 1.25rem',
    background: 'linear-gradient(135deg, #d4edda 0%, #c3e6cb 100%)',
    borderLeft: '4px solid #28a745',
    borderRadius: '0 8px 8px 0',
    textAlign: 'left',
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

const TopographicBackground = ({
  overline = "Terrain Survey",
  title = "Scottish Highlands",
  description = "5-day mountain flying course covering low-level navigation, valley approaches, and high-altitude operations.",
  children
}) => {
  return (
    <div style={styles.container}>
      <div style={styles.pattern} />
      <div style={styles.content}>
        <span style={styles.overline}>{overline}</span>
        <h3 style={styles.title}>{title}</h3>
        <p style={styles.description}>{description}</p>
        {children}
      </div>
      <div style={styles.note}>
        <div style={styles.noteLabel}>adv-016 • Approved</div>
        <p style={styles.noteText}>
          These waves for our mountain training section is a really cool element
        </p>
      </div>
    </div>
  );
};

export default TopographicBackground;

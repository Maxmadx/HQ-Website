import React, { useState, useEffect } from 'react';

/**
 * adv-004: Compass Navigation Element
 * Feedback: "Have Denham stay stationary but a transition of the destination text and coordinates
 * that cycle fast through the list of places we've taken helicopters to until the final one says
 * 'Anywhere you can Dream Of'"
 */

const destinations = [
  { name: 'North Pole', coords: '90.0000°N 0.0000°W' },
  { name: 'South Pole', coords: '90.0000°S 0.0000°E' },
  { name: 'Iceland', coords: '64.9631°N 19.0208°W' },
  { name: 'Swiss Alps', coords: '46.8182°N 8.2275°E' },
  { name: 'Scottish Highlands', coords: '57.4596°N 4.2264°W' },
  { name: 'Norway Fjords', coords: '61.4720°N 5.4543°E' },
  { name: 'Corsica', coords: '42.0396°N 9.0129°E' },
  { name: 'Sardinia', coords: '40.1209°N 9.0129°E' },
  { name: 'Greenland', coords: '71.7069°N 42.6043°W' },
  { name: 'Mont Blanc', coords: '45.8326°N 6.8652°E' },
  { name: 'Anywhere you can Dream Of', coords: '∞°N ∞°E' },
];

const styles = {
  container: {
    position: 'relative',
    padding: '4rem 2rem',
    background: 'linear-gradient(135deg, #1a1a1a 0%, #2d2d2d 100%)',
    color: '#fff',
    overflow: 'hidden',
  },
  bgPattern: {
    position: 'absolute',
    inset: 0,
    opacity: 0.03,
    backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'%3E%3Cline x1='0' y1='50' x2='100' y2='50' stroke='%23fff' stroke-width='0.5'/%3E%3Cline x1='50' y1='0' x2='50' y2='100' stroke='%23fff' stroke-width='0.5'/%3E%3Ccircle cx='50' cy='50' r='30' fill='none' stroke='%23fff' stroke-width='0.5'/%3E%3Ccircle cx='50' cy='50' r='45' fill='none' stroke='%23fff' stroke-width='0.3'/%3E%3C/svg%3E")`,
    backgroundSize: '200px 200px',
  },
  content: {
    position: 'relative',
    zIndex: 1,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    maxWidth: '1000px',
    margin: '0 auto',
    gap: '2rem',
    flexWrap: 'wrap',
  },
  infoColumn: {
    flex: '1',
    minWidth: '200px',
  },
  label: {
    fontFamily: "'Share Tech Mono', monospace",
    fontSize: '0.6rem',
    letterSpacing: '0.2em',
    textTransform: 'uppercase',
    color: 'rgba(255,255,255,0.5)',
    marginBottom: '0.5rem',
  },
  value: {
    fontFamily: "'Space Grotesk', sans-serif",
    fontSize: '1.5rem',
    fontWeight: 700,
    textTransform: 'uppercase',
    letterSpacing: '-0.02em',
    marginBottom: '0.25rem',
    minHeight: '2rem',
  },
  valueHighlight: {
    color: 'var(--hq-accent, #E04A2F)',
  },
  detail: {
    fontFamily: "'Share Tech Mono', monospace",
    fontSize: '0.75rem',
    color: 'rgba(255,255,255,0.6)',
    letterSpacing: '0.1em',
    minHeight: '1.2rem',
  },
  compass: {
    width: '200px',
    height: '200px',
    position: 'relative',
    flexShrink: 0,
  },
  compassRing: {
    position: 'absolute',
    inset: 0,
    border: '2px solid rgba(255,255,255,0.2)',
    borderRadius: '50%',
  },
  compassRingInner: {
    position: 'absolute',
    inset: '20px',
    border: '1px solid rgba(255,255,255,0.1)',
    borderRadius: '50%',
  },
  compassRingCore: {
    position: 'absolute',
    inset: '40px',
    background: 'rgba(255,255,255,0.02)',
    borderRadius: '50%',
    border: '1px solid rgba(255,255,255,0.05)',
  },
  cardinal: {
    position: 'absolute',
    fontFamily: "'Share Tech Mono', monospace",
    fontSize: '0.7rem',
    color: 'rgba(255,255,255,0.4)',
  },
  needle: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    width: '4px',
    height: '80px',
    marginLeft: '-2px',
    marginTop: '-40px',
    transformOrigin: 'center center',
    transition: 'transform 0.5s ease',
  },
  needleNorth: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: 0,
    height: 0,
    borderLeft: '6px solid transparent',
    borderRight: '6px solid transparent',
    borderBottom: '35px solid var(--hq-accent, #E04A2F)',
    marginLeft: '-4px',
  },
  needleSouth: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    width: 0,
    height: 0,
    borderLeft: '4px solid transparent',
    borderRight: '4px solid transparent',
    borderTop: '35px solid rgba(255,255,255,0.3)',
    marginLeft: '-2px',
  },
  center: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    width: '12px',
    height: '12px',
    background: '#fff',
    borderRadius: '50%',
    transform: 'translate(-50%, -50%)',
    boxShadow: '0 0 10px rgba(224, 74, 47, 0.5)',
  },
  note: {
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

const CompassNavigation = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAnimating, setIsAnimating] = useState(true);

  useEffect(() => {
    if (!isAnimating) return;

    const interval = setInterval(() => {
      setCurrentIndex((prev) => {
        if (prev >= destinations.length - 1) {
          setIsAnimating(false);
          return prev;
        }
        return prev + 1;
      });
    }, prev => prev < destinations.length - 2 ? 300 : 1500); // Fast cycle, slow on last

    return () => clearInterval(interval);
  }, [isAnimating]);

  // Calculate needle rotation based on destination
  const needleRotation = (currentIndex * 37) % 360;

  const current = destinations[currentIndex];
  const isFinal = currentIndex === destinations.length - 1;

  return (
    <div style={styles.container}>
      <div style={styles.bgPattern} />

      <div style={styles.content}>
        {/* Origin - Fixed */}
        <div style={styles.infoColumn}>
          <div style={styles.label}>Origin</div>
          <div style={styles.value}>Denham</div>
          <div style={styles.detail}>51.4700°N 0.4543°W</div>
        </div>

        {/* Compass */}
        <div style={styles.compass}>
          <div style={styles.compassRing} />
          <div style={styles.compassRingInner} />
          <div style={styles.compassRingCore} />
          <span style={{ ...styles.cardinal, top: '8px', left: '50%', transform: 'translateX(-50%)', color: 'var(--hq-accent)' }}>N</span>
          <span style={{ ...styles.cardinal, bottom: '8px', left: '50%', transform: 'translateX(-50%)' }}>S</span>
          <span style={{ ...styles.cardinal, right: '8px', top: '50%', transform: 'translateY(-50%)' }}>E</span>
          <span style={{ ...styles.cardinal, left: '8px', top: '50%', transform: 'translateY(-50%)' }}>W</span>
          <div style={{ ...styles.needle, transform: `rotate(${needleRotation}deg)` }}>
            <div style={styles.needleNorth} />
            <div style={styles.needleSouth} />
          </div>
          <div style={styles.center} />
        </div>

        {/* Destination - Cycling */}
        <div style={{ ...styles.infoColumn, textAlign: 'right' }}>
          <div style={styles.label}>Destination</div>
          <div style={{
            ...styles.value,
            ...(isFinal ? styles.valueHighlight : {}),
            fontSize: isFinal ? '1.2rem' : '1.5rem',
            transition: 'all 0.2s ease',
          }}>
            {current.name}
          </div>
          <div style={styles.detail}>{current.coords}</div>
        </div>
      </div>

      <div style={styles.note}>
        <div style={styles.noteLabel}>adv-004 • Needs Enhancement</div>
        <p style={styles.noteText}>
          Denham stays stationary. Destinations cycle fast through expedition locations until settling on
          "Anywhere you can Dream Of"
        </p>
      </div>
    </div>
  );
};

export default CompassNavigation;

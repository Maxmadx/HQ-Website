import React from 'react';

/**
 * adv-017: Polaroid Photo Frame with Helicopter Trail
 * Feedback: "The polaroid frames with a little helicopter icon SVG trail that goes through them
 * with pictures of helicopters from all destinations would be a really cool addition to our
 * expeditions page. Have the helicopter fly down the page and it goes from one adventure to another"
 * Target: expeditions
 */

const styles = {
  container: {
    position: 'relative',
    padding: '4rem 2rem',
    background: 'var(--hq-hover-bg, #f5f5f2)',
    overflow: 'hidden',
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
  trailContainer: {
    position: 'relative',
    maxWidth: '900px',
    margin: '0 auto',
    padding: '2rem 0',
  },
  flightPath: {
    position: 'absolute',
    left: '50%',
    top: 0,
    bottom: 0,
    width: '3px',
    transform: 'translateX(-50%)',
  },
  pathLine: {
    width: '100%',
    height: '100%',
    background: `repeating-linear-gradient(
      180deg,
      var(--hq-accent, #E04A2F) 0px,
      var(--hq-accent, #E04A2F) 15px,
      transparent 15px,
      transparent 25px
    )`,
    opacity: 0.4,
  },
  helicopter: {
    position: 'absolute',
    left: '50%',
    transform: 'translateX(-50%)',
    width: '40px',
    height: '40px',
    zIndex: 10,
    animation: 'heliFloat 3s ease-in-out infinite',
  },
  polaroidRow: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '4rem',
    position: 'relative',
    zIndex: 5,
  },
  polaroidRowReverse: {
    flexDirection: 'row-reverse',
  },
  polaroid: {
    background: '#fff',
    padding: '12px 12px 40px 12px',
    boxShadow: '0 10px 30px rgba(0,0,0,0.15)',
    maxWidth: '280px',
    transition: 'transform 0.3s ease, box-shadow 0.3s ease',
    cursor: 'pointer',
  },
  polaroidImage: {
    width: '256px',
    height: '200px',
    backgroundColor: '#e0e0e0',
    backgroundSize: 'cover',
    backgroundPosition: 'center',
  },
  polaroidCaption: {
    paddingTop: '12px',
    textAlign: 'center',
  },
  polaroidText: {
    fontFamily: "'Instrument Serif', Georgia, serif",
    fontSize: '1rem',
    color: 'var(--hq-primary, #1a1a1a)',
    fontStyle: 'italic',
    marginBottom: '4px',
  },
  polaroidDate: {
    fontFamily: "'Share Tech Mono', monospace",
    fontSize: '0.7rem',
    color: 'var(--hq-muted, #888888)',
    letterSpacing: '0.1em',
  },
  spacer: {
    width: '100px',
  },
  note: {
    marginTop: '2rem',
    padding: '1rem 1.25rem',
    background: 'linear-gradient(135deg, #fff3cd 0%, #ffeeba 100%)',
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
    color: '#856404',
    marginBottom: '0.5rem',
  },
  noteText: {
    fontSize: '0.85rem',
    color: '#664d03',
    lineHeight: 1.6,
    margin: 0,
  },
};

const HeliSVG = ({ style }) => (
  <svg viewBox="0 0 40 40" style={style} fill="var(--hq-accent, #E04A2F)">
    <path d="M8 18h2v4H8v-4zm24 0h-2v4h2v-4zm-12-14v4h8l-1.5-4H20zm-1.5 0h-6l-1.5 4h7.5V4zM7 10h26v1.5H7V10zm1.5 6h23v9c0 1.65-1.35 3-3 3H11.5c-1.65 0-3-1.35-3-3v-9z"/>
    <ellipse cx="20" cy="8" rx="12" ry="1.5" fill="var(--hq-primary, #1a1a1a)" opacity="0.3"/>
  </svg>
);

const expeditions = [
  {
    image: '/assets/images/expeditions/north-pole.jpg',
    caption: 'Finally reached the North Pole!',
    date: 'April 2024',
    rotation: -3,
  },
  {
    image: '/assets/images/expeditions/helicopter-expeditions-quentin-smith.webp',
    caption: 'Alpine sunrise over Mont Blanc',
    date: 'March 2024',
    rotation: 2,
  },
  {
    image: '/assets/images/expeditions/iceland.jpg',
    caption: 'Volcanic landscapes of Iceland',
    date: 'June 2023',
    rotation: -2,
  },
  {
    image: '/assets/images/expeditions/scotland.jpg',
    caption: 'Scottish Highlands adventure',
    date: 'September 2023',
    rotation: 4,
  },
];

const PolaroidPhotoTrail = () => {
  return (
    <div style={styles.container}>
      <style>{`
        @keyframes heliFloat {
          0%, 100% { transform: translateX(-50%) translateY(0) rotate(-5deg); }
          50% { transform: translateX(-50%) translateY(-10px) rotate(5deg); }
        }
        .polaroid-card:hover {
          transform: scale(1.05) !important;
          box-shadow: 0 15px 40px rgba(0,0,0,0.2) !important;
        }
      `}</style>

      <div style={styles.header}>
        <span style={styles.overline}>Our Adventures</span>
        <h2 style={styles.title}>Expedition Memories</h2>
      </div>

      <div style={styles.trailContainer}>
        {/* Flight path line */}
        <div style={styles.flightPath}>
          <div style={styles.pathLine} />
        </div>

        {/* Helicopter following path */}
        <HeliSVG style={{ ...styles.helicopter, top: '15%' }} />
        <HeliSVG style={{ ...styles.helicopter, top: '45%' }} />
        <HeliSVG style={{ ...styles.helicopter, top: '75%' }} />

        {/* Polaroid photos */}
        {expeditions.map((exp, index) => (
          <div
            key={index}
            style={{
              ...styles.polaroidRow,
              ...(index % 2 === 1 ? styles.polaroidRowReverse : {}),
            }}
          >
            <div
              className="polaroid-card"
              style={{
                ...styles.polaroid,
                transform: `rotate(${exp.rotation}deg)`,
              }}
            >
              <div
                style={{
                  ...styles.polaroidImage,
                  backgroundImage: `url('${exp.image}')`,
                }}
              />
              <div style={styles.polaroidCaption}>
                <div style={styles.polaroidText}>{exp.caption}</div>
                <div style={styles.polaroidDate}>{exp.date}</div>
              </div>
            </div>
            <div style={styles.spacer} />
          </div>
        ))}
      </div>

      <div style={styles.note}>
        <div style={styles.noteLabel}>adv-017 • Needs Enhancement</div>
        <p style={styles.noteText}>
          Helicopter icon SVG trail that goes through polaroid frames. Have the helicopter fly down the page
          from one adventure to another. Add destination photos from expeditions.
        </p>
      </div>
    </div>
  );
};

export default PolaroidPhotoTrail;

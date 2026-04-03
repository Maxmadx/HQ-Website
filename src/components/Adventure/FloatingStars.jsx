import React from 'react';

/**
 * bg-001: Floating Particles (Star-like for Night Rating)
 * Feedback: "Add more particles and make them look a little more like stars for the night flying rating"
 * Target: training/night-rating
 */

const styles = {
  container: {
    position: 'relative',
    padding: '6rem 2rem',
    background: 'linear-gradient(180deg, #0a0a12 0%, #1a1a2e 50%, #0f0f1a 100%)',
    color: '#fff',
    overflow: 'hidden',
    minHeight: '500px',
  },
  starsContainer: {
    position: 'absolute',
    inset: 0,
    overflow: 'hidden',
    pointerEvents: 'none',
  },
  star: {
    position: 'absolute',
    borderRadius: '50%',
    background: '#fff',
    boxShadow: '0 0 6px 2px rgba(255, 255, 255, 0.3)',
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
    fontSize: 'clamp(2rem, 5vw, 3rem)',
    fontWeight: 700,
    textTransform: 'uppercase',
    letterSpacing: '-0.02em',
    margin: '0 0 1rem 0',
    background: 'linear-gradient(180deg, #fff 0%, rgba(255,255,255,0.7) 100%)',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
    backgroundClip: 'text',
  },
  description: {
    fontSize: '1.1rem',
    color: 'rgba(255,255,255,0.7)',
    lineHeight: 1.7,
    margin: '0 0 2rem 0',
  },
  features: {
    display: 'flex',
    justifyContent: 'center',
    gap: '2rem',
    flexWrap: 'wrap',
    marginTop: '3rem',
  },
  feature: {
    textAlign: 'center',
  },
  featureIcon: {
    width: '50px',
    height: '50px',
    margin: '0 auto 0.75rem',
    opacity: 0.8,
  },
  featureLabel: {
    fontFamily: "'Share Tech Mono', monospace",
    fontSize: '0.7rem',
    letterSpacing: '0.15em',
    textTransform: 'uppercase',
    color: 'rgba(255,255,255,0.6)',
  },
  moon: {
    position: 'absolute',
    top: '10%',
    right: '10%',
    width: '80px',
    height: '80px',
    borderRadius: '50%',
    background: 'radial-gradient(circle at 30% 30%, #fffde7 0%, #ffecb3 50%, #fff8e1 100%)',
    boxShadow: '0 0 40px 10px rgba(255, 253, 231, 0.3)',
    opacity: 0.9,
  },
  note: {
    position: 'relative',
    zIndex: 1,
    marginTop: '3rem',
    padding: '1rem 1.25rem',
    background: 'rgba(255, 243, 205, 0.1)',
    borderLeft: '4px solid #ffc107',
    borderRadius: '0 8px 8px 0',
    maxWidth: '600px',
    margin: '3rem auto 0',
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

// Generate random stars
const generateStars = (count) => {
  const stars = [];
  for (let i = 0; i < count; i++) {
    const size = Math.random() * 3 + 1;
    const isShootingStar = Math.random() < 0.05;

    stars.push({
      id: i,
      left: `${Math.random() * 100}%`,
      top: `${Math.random() * 100}%`,
      size: `${size}px`,
      animationDelay: `${Math.random() * 5}s`,
      animationDuration: `${Math.random() * 3 + 2}s`,
      opacity: Math.random() * 0.5 + 0.3,
      isShooting: isShootingStar,
    });
  }
  return stars;
};

const stars = generateStars(80); // More particles as requested

const FloatingStars = ({ children }) => {
  return (
    <div style={styles.container}>
      <style>{`
        @keyframes twinkle {
          0%, 100% { opacity: 0.3; transform: scale(1); }
          50% { opacity: 1; transform: scale(1.2); }
        }
        @keyframes shootingStar {
          0% { transform: translateX(0) translateY(0); opacity: 1; }
          100% { transform: translateX(-200px) translateY(200px); opacity: 0; }
        }
        .star {
          animation: twinkle ease-in-out infinite;
        }
        .shooting-star {
          animation: shootingStar 1s ease-out infinite;
          width: 2px !important;
          height: 2px !important;
          background: linear-gradient(45deg, #fff, transparent) !important;
        }
      `}</style>

      {/* Stars */}
      <div style={styles.starsContainer}>
        {stars.map((star) => (
          <div
            key={star.id}
            className={star.isShooting ? 'shooting-star' : 'star'}
            style={{
              ...styles.star,
              left: star.left,
              top: star.top,
              width: star.size,
              height: star.size,
              opacity: star.opacity,
              animationDelay: star.animationDelay,
              animationDuration: star.animationDuration,
            }}
          />
        ))}
      </div>

      {/* Moon */}
      <div style={styles.moon} />

      {/* Content */}
      <div style={styles.content}>
        <span style={styles.overline}>Advanced Training</span>
        <h2 style={styles.title}>Night Rating</h2>
        <p style={styles.description}>
          Master the art of flying under the stars. Our night rating course prepares you for
          safe operations in reduced visibility conditions with comprehensive ground school
          and practical flight training.
        </p>

        <div style={styles.features}>
          <div style={styles.feature}>
            <svg style={styles.featureIcon} viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 17.93c-3.95-.49-7-3.85-7-7.93 0-.62.08-1.21.21-1.79L9 15v1c0 1.1.9 2 2 2v1.93zm6.9-2.54c-.26-.81-1-1.39-1.9-1.39h-1v-3c0-.55-.45-1-1-1H8v-2h2c.55 0 1-.45 1-1V7h2c1.1 0 2-.9 2-2v-.41c2.93 1.19 5 4.06 5 7.41 0 2.08-.8 3.97-2.1 5.39z"/>
            </svg>
            <span style={styles.featureLabel}>5 Hours Flight</span>
          </div>
          <div style={styles.feature}>
            <svg style={styles.featureIcon} viewBox="0 0 24 24" fill="currentColor">
              <path d="M21 5c-1.11-.35-2.33-.5-3.5-.5-1.95 0-4.05.4-5.5 1.5-1.45-1.1-3.55-1.5-5.5-1.5S2.45 4.9 1 6v14.65c0 .25.25.5.5.5.1 0 .15-.05.25-.05C3.1 20.45 5.05 20 6.5 20c1.95 0 4.05.4 5.5 1.5 1.35-.85 3.8-1.5 5.5-1.5 1.65 0 3.35.3 4.75 1.05.1.05.15.05.25.05.25 0 .5-.25.5-.5V6c-.6-.45-1.25-.75-2-1zm0 13.5c-1.1-.35-2.3-.5-3.5-.5-1.7 0-4.15.65-5.5 1.5V8c1.35-.85 3.8-1.5 5.5-1.5 1.2 0 2.4.15 3.5.5v11.5z"/>
            </svg>
            <span style={styles.featureLabel}>Ground School</span>
          </div>
          <div style={styles.feature}>
            <svg style={styles.featureIcon} viewBox="0 0 24 24" fill="currentColor">
              <path d="M19.35 10.04C18.67 6.59 15.64 4 12 4 9.11 4 6.6 5.64 5.35 8.04 2.34 8.36 0 10.91 0 14c0 3.31 2.69 6 6 6h13c2.76 0 5-2.24 5-5 0-2.64-2.05-4.78-4.65-4.96zM19 18H6c-2.21 0-4-1.79-4-4s1.79-4 4-4h.71C7.37 7.69 9.48 6 12 6c3.04 0 5.5 2.46 5.5 5.5v.5H19c1.66 0 3 1.34 3 3s-1.34 3-3 3z"/>
            </svg>
            <span style={styles.featureLabel}>Weather Briefs</span>
          </div>
        </div>

        {children}
      </div>

      <div style={styles.note}>
        <div style={styles.noteLabel}>bg-001 • Needs Enhancement</div>
        <p style={styles.noteText}>
          More particles added, styled as twinkling stars for the night flying rating section.
          Includes shooting stars for visual interest.
        </p>
      </div>
    </div>
  );
};

export default FloatingStars;

import React, { useEffect, useRef, useState } from 'react';

/**
 * bg-002: Parallax Cloud Layers
 * Feedback: "Yes I like this component. As you start to scroll the clouds should quickly start
 * to move to the left and to the right clearing the screen"
 */

const styles = {
  container: {
    position: 'relative',
    minHeight: '600px',
    background: 'linear-gradient(180deg, #87ceeb 0%, #b8d4e8 30%, #d4e5f0 60%, #f0f4f7 100%)',
    overflow: 'hidden',
  },
  cloudsContainer: {
    position: 'absolute',
    inset: 0,
    pointerEvents: 'none',
    overflow: 'hidden',
  },
  cloudLayer: {
    position: 'absolute',
    width: '200%',
    height: '100%',
    backgroundRepeat: 'repeat-x',
    backgroundSize: '1000px auto',
    transition: 'transform 0.3s ease-out',
  },
  cloudLayer1: {
    top: '5%',
    opacity: 0.9,
    backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 1000 200'%3E%3Cellipse cx='150' cy='100' rx='120' ry='50' fill='%23fff'/%3E%3Cellipse cx='220' cy='80' rx='80' ry='40' fill='%23fff'/%3E%3Cellipse cx='400' cy='120' rx='100' ry='45' fill='%23fff'/%3E%3Cellipse cx='700' cy='90' rx='130' ry='55' fill='%23fff'/%3E%3Cellipse cx='850' cy='110' rx='90' ry='40' fill='%23fff'/%3E%3C/svg%3E")`,
  },
  cloudLayer2: {
    top: '25%',
    opacity: 0.7,
    backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 1000 200'%3E%3Cellipse cx='100' cy='100' rx='100' ry='40' fill='%23fff'/%3E%3Cellipse cx='350' cy='80' rx='140' ry='50' fill='%23fff'/%3E%3Cellipse cx='600' cy='110' rx='110' ry='45' fill='%23fff'/%3E%3Cellipse cx='900' cy='90' rx='120' ry='50' fill='%23fff'/%3E%3C/svg%3E")`,
  },
  cloudLayer3: {
    top: '45%',
    opacity: 0.5,
    backgroundSize: '1200px auto',
    backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 1200 200'%3E%3Cellipse cx='200' cy='100' rx='150' ry='60' fill='%23fff'/%3E%3Cellipse cx='500' cy='80' rx='180' ry='70' fill='%23fff'/%3E%3Cellipse cx='900' cy='100' rx='160' ry='55' fill='%23fff'/%3E%3C/svg%3E")`,
  },
  content: {
    position: 'relative',
    zIndex: 10,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: '600px',
    padding: '4rem 2rem',
    textAlign: 'center',
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
    fontSize: 'clamp(2rem, 5vw, 3.5rem)',
    fontWeight: 700,
    textTransform: 'uppercase',
    letterSpacing: '-0.02em',
    color: 'var(--hq-primary, #1a1a1a)',
    margin: '0 0 1rem 0',
  },
  description: {
    fontSize: '1.1rem',
    color: 'var(--hq-body, #666666)',
    lineHeight: 1.7,
    maxWidth: '500px',
    margin: 0,
  },
  scrollHint: {
    marginTop: '3rem',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '0.5rem',
    opacity: 0.6,
  },
  scrollText: {
    fontFamily: "'Share Tech Mono', monospace",
    fontSize: '0.65rem',
    letterSpacing: '0.2em',
    textTransform: 'uppercase',
    color: 'var(--hq-muted, #888888)',
  },
  scrollArrow: {
    width: '20px',
    height: '20px',
    borderRight: '2px solid var(--hq-muted, #888888)',
    borderBottom: '2px solid var(--hq-muted, #888888)',
    transform: 'rotate(45deg)',
    animation: 'bounce 2s ease-in-out infinite',
  },
  note: {
    position: 'relative',
    zIndex: 10,
    margin: '0 auto',
    padding: '1rem 1.25rem',
    background: 'linear-gradient(135deg, rgba(255, 243, 205, 0.9) 0%, rgba(255, 238, 186, 0.9) 100%)',
    borderLeft: '4px solid #ffc107',
    borderRadius: '0 8px 8px 0',
    maxWidth: '600px',
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

const ParallaxCloudLayers = ({ children }) => {
  const containerRef = useRef(null);
  const [scrollProgress, setScrollProgress] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      if (!containerRef.current) return;

      const rect = containerRef.current.getBoundingClientRect();
      const windowHeight = window.innerHeight;

      // Calculate how much of the component is visible
      const visibleTop = Math.max(0, windowHeight - rect.top);
      const visibleHeight = Math.min(rect.height, visibleTop);
      const progress = Math.min(1, visibleHeight / (rect.height * 0.5));

      setScrollProgress(progress);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll(); // Initial check

    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Calculate cloud positions - they part to reveal content
  const layer1Offset = scrollProgress * 150; // Fast, moves left
  const layer2Offset = scrollProgress * 100; // Medium, moves right
  const layer3Offset = scrollProgress * 50;  // Slow, moves left

  return (
    <div ref={containerRef} style={styles.container}>
      <style>{`
        @keyframes bounce {
          0%, 100% { transform: rotate(45deg) translateY(0); }
          50% { transform: rotate(45deg) translateY(10px); }
        }
      `}</style>

      {/* Cloud Layers */}
      <div style={styles.cloudsContainer}>
        <div
          style={{
            ...styles.cloudLayer,
            ...styles.cloudLayer1,
            transform: `translateX(-${layer1Offset}%)`,
          }}
        />
        <div
          style={{
            ...styles.cloudLayer,
            ...styles.cloudLayer2,
            transform: `translateX(${layer2Offset - 50}%)`, // Starts centered, moves right
          }}
        />
        <div
          style={{
            ...styles.cloudLayer,
            ...styles.cloudLayer3,
            transform: `translateX(-${layer3Offset}%)`,
          }}
        />
      </div>

      {/* Content */}
      <div style={styles.content}>
        <span style={styles.overline}>Rise Above</span>
        <h2 style={styles.title}>Break Through<br />The Clouds</h2>
        <p style={styles.description}>
          As you scroll, watch the clouds part to reveal what lies beyond.
          Your journey into the skies begins here.
        </p>

        {scrollProgress < 0.3 && (
          <div style={styles.scrollHint}>
            <span style={styles.scrollText}>Scroll to reveal</span>
            <div style={styles.scrollArrow} />
          </div>
        )}

        {children}
      </div>

      <div style={styles.note}>
        <div style={styles.noteLabel}>bg-002 • Needs Enhancement</div>
        <p style={styles.noteText}>
          Clouds part left and right on scroll to reveal content. Currently {Math.round(scrollProgress * 100)}% revealed.
        </p>
      </div>
    </div>
  );
};

export default ParallaxCloudLayers;

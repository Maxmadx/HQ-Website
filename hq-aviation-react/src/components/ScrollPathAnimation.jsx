/**
 * SCROLL PATH ANIMATION COMPONENT
 *
 * An SVG path that draws itself on scroll with a helicopter
 * icon that follows the path tip, tilting in the direction of travel.
 *
 * Uses Framer Motion for smooth scroll-triggered animations.
 */

import { useRef, useEffect, useState } from 'react';
import { motion, useScroll, useTransform, useSpring } from 'framer-motion';

// Custom curved SVG path - a compact horizontal flight path
const FLIGHT_PATH = `
  M 50 320
  C 150 280, 300 200, 450 180
  S 700 160, 900 200
  C 1100 240, 1300 180, 1500 140
  S 1650 120, 1750 160
`;

// Viewbox dimensions matching the path
const VIEWBOX = { width: 1800, height: 400 };

function ScrollPathAnimation({
  className = '',
  pathWidth = 3,
  iconSrc = '/assets/images/icons/r66-icon-transparent going right.svg',
  iconSize = 200,
  // Gradient colors: white → light blue → dark blue
  colorStart = '#FFFFFF',
  colorMid = '#5B9BD5',
  colorEnd = '#1E3A5F',
}) {
  const containerRef = useRef(null);
  const pathRef = useRef(null);
  const [pathLength, setPathLength] = useState(0);
  const [iconPosition, setIconPosition] = useState({ x: 50, y: 320, angle: -20 });

  // Get scroll progress within the container
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"]
  });

  // Smooth spring for the path drawing
  const smoothProgress = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001
  });

  // Transform scroll progress to path length (0 to 1)
  // Slow start, speed up, slow in middle, gradual re-acceleration, complete at 85%
  const pathDrawLength = useTransform(
    smoothProgress,
    [0, 0.15, 0.3, 0.45, 0.55, 0.62, 0.7, 0.78, 0.85],
    [0, 0.05, 0.25, 0.45, 0.55, 0.65, 0.78, 0.92, 1]
  );

  // Get total path length on mount
  useEffect(() => {
    if (pathRef.current) {
      setPathLength(pathRef.current.getTotalLength());
    }
  }, []);

  // Update icon position based on scroll progress
  useEffect(() => {
    const unsubscribe = pathDrawLength.on('change', (progress) => {
      if (pathRef.current && pathLength > 0) {
        const clampedProgress = Math.max(0, Math.min(1, progress));
        const currentLength = clampedProgress * pathLength;

        // Get current point on path
        const point = pathRef.current.getPointAtLength(currentLength);

        // Get a point slightly ahead for angle calculation
        const aheadLength = Math.min(currentLength + 20, pathLength);
        const aheadPoint = pathRef.current.getPointAtLength(aheadLength);

        // Calculate angle of travel (tangent to the path)
        const dx = aheadPoint.x - point.x;
        const dy = aheadPoint.y - point.y;
        const angle = Math.atan2(dy, dx) * (180 / Math.PI);

        setIconPosition({
          x: point.x,
          y: point.y,
          angle: angle
        });
      }
    });

    return () => unsubscribe();
  }, [pathDrawLength, pathLength]);

  return (
    <section
      ref={containerRef}
      className={`scroll-path-section ${className}`}
    >
      <div className="scroll-path-content">
        {/* Left Column - Headline */}
        <div className="scroll-path-col scroll-path-col--left">
          <span className="scroll-path-label">Journey</span>
          <h2 className="scroll-path-headline">
            <span>Follow the</span>
            <span>Flight Path</span>
          </h2>
          <p className="scroll-path-description">
            From training to expeditions, every journey begins with a single flight.
          </p>
        </div>
      </div>

      <svg
        className="scroll-path-svg"
        viewBox={`0 0 ${VIEWBOX.width} ${VIEWBOX.height}`}
        preserveAspectRatio="xMidYMid meet"
        fill="none"
      >
        {/* Glow filter for the path */}
        <defs>
          <filter id="pathGlow" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="8" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>

          {/* Gradient for the path: white → light blue → dark blue */}
          <linearGradient id="pathGradient" x1="0%" y1="100%" x2="100%" y2="0%">
            <stop offset="0%" stopColor={colorStart} stopOpacity="0.9" />
            <stop offset="50%" stopColor={colorMid} stopOpacity="1" />
            <stop offset="100%" stopColor={colorEnd} stopOpacity="1" />
          </linearGradient>

          {/* Glow gradient */}
          <linearGradient id="glowGradient" x1="0%" y1="100%" x2="100%" y2="0%">
            <stop offset="0%" stopColor={colorStart} stopOpacity="0.2" />
            <stop offset="50%" stopColor={colorMid} stopOpacity="0.4" />
            <stop offset="100%" stopColor={colorEnd} stopOpacity="0.5" />
          </linearGradient>
        </defs>

        {/* Background path (faint guide) */}
        <path
          d={FLIGHT_PATH}
          stroke="rgba(200, 200, 200, 0.2)"
          strokeWidth={pathWidth}
          strokeLinecap="round"
          strokeLinejoin="round"
          fill="none"
          strokeDasharray="8 12"
        />

        {/* Animated path with glow */}
        <motion.path
          ref={pathRef}
          d={FLIGHT_PATH}
          stroke="url(#glowGradient)"
          strokeWidth={pathWidth + 6}
          strokeLinecap="round"
          strokeLinejoin="round"
          fill="none"
          filter="url(#pathGlow)"
          style={{
            pathLength: pathDrawLength,
          }}
        />

        {/* Main animated path */}
        <motion.path
          d={FLIGHT_PATH}
          stroke="url(#pathGradient)"
          strokeWidth={pathWidth}
          strokeLinecap="round"
          strokeLinejoin="round"
          fill="none"
          style={{
            pathLength: pathDrawLength,
          }}
        />

        {/* Helicopter icon inside SVG */}
        <image
          href={iconSrc}
          width="150"
          height="150"
          x={iconPosition.x - 75}
          y={iconPosition.y - 75}
          transform={`rotate(${iconPosition.angle} ${iconPosition.x} ${iconPosition.y})`}
          style={{ width: '150px', height: '150px' }}
        />
      </svg>

      {/* Waypoint markers */}
      <div className="scroll-path-waypoints">
        <Waypoint
          progress={smoothProgress}
          threshold={0.15}
          label="Training"
          position={{ x: 32, y: 35 }}
        />
        <Waypoint
          progress={smoothProgress}
          threshold={0.35}
          label="Certification"
          position={{ x: 52, y: 55 }}
        />
        <Waypoint
          progress={smoothProgress}
          threshold={0.55}
          label="Freedom"
          position={{ x: 72, y: 40 }}
        />
        <Waypoint
          progress={smoothProgress}
          threshold={0.9}
          label="Mastery"
          position={{ x: 95, y: 35 }}
        />
      </div>

      <style>{`
        .scroll-path-section {
          position: relative;
          min-height: 35vh;
          background: var(--hq-background, #faf9f6);
          overflow: hidden;
          /* Full width background */
          width: 100vw;
          margin-left: calc(-50vw + 50%);
          margin-right: calc(-50vw + 50%);
        }

        .scroll-path-content {
          position: relative;
          top: 0;
          height: 35vh;
          display: flex;
          flex-direction: row;
          justify-content: space-between;
          align-items: center;
          padding: 1.5rem;
          z-index: 10;
          pointer-events: none;
          gap: 1rem;
        }

        /* Three Column Layout */
        .scroll-path-col {
          flex: 1;
          display: flex;
          flex-direction: column;
        }

        .scroll-path-col--left {
          align-items: flex-start;
          text-align: left;
        }

        .scroll-path-col--middle {
          align-items: center;
          text-align: center;
        }

        .scroll-path-col--right {
          align-items: flex-end;
        }

        .scroll-path-label {
          display: inline-block;
          font-size: 0.7rem;
          text-transform: uppercase;
          letter-spacing: 0.2em;
          color: ${colorEnd};
          margin-bottom: 1rem;
          font-weight: 600;
        }

        .scroll-path-headline {
          display: flex;
          flex-direction: column;
          margin: 0 0 1.5rem;
        }

        .scroll-path-headline span {
          font-family: 'Space Grotesk', sans-serif;
          font-size: clamp(2rem, 4vw, 3rem);
          font-weight: 700;
          line-height: 1.1;
          text-transform: uppercase;
          text-shadow: -4px -4px 4px var(--hq-background), 4px -4px 4px var(--hq-background), -4px 4px 4px var(--hq-background), 4px 4px 4px var(--hq-background), 0 -4px 4px var(--hq-background), 0 4px 4px var(--hq-background), -4px 0 4px var(--hq-background), 4px 0 4px var(--hq-background), -2px -2px 2px var(--hq-background), 2px -2px 2px var(--hq-background), -2px 2px 2px var(--hq-background), 2px 2px 2px var(--hq-background), -1px -1px 1px var(--hq-background), 1px -1px 1px var(--hq-background), -1px 1px 1px var(--hq-background), 1px 1px 1px var(--hq-background);
        }

        .scroll-path-headline span:nth-child(1) {
          color: #1a1a1a;
        }

        .scroll-path-headline span:nth-child(2) {
          color: ${colorEnd};
        }

        .scroll-path-description {
          font-size: 1rem;
          line-height: 1.7;
          color: #666;
          max-width: 300px;
        }

        /* Middle Column Styles */
        .scroll-path-coords {
          display: flex;
          gap: 1.5rem;
          margin-bottom: 1.5rem;
          font-family: 'Share Tech Mono', monospace;
          font-size: 0.65rem;
          letter-spacing: 0.1em;
          color: #999;
        }

        .scroll-path-pre {
          font-size: 0.75rem;
          text-transform: uppercase;
          letter-spacing: 0.25em;
          color: #888;
          margin-bottom: 1rem;
        }

        .scroll-path-subheadline {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 0.25rem;
          margin: 0 0 1rem;
        }

        .scroll-path-subheadline span {
          font-family: 'Space Grotesk', sans-serif;
          font-size: clamp(1.5rem, 3vw, 2.5rem);
          font-weight: 700;
          line-height: 1.1;
          text-transform: uppercase;
        }

        .scroll-path-subheadline span:nth-child(1) {
          color: #1a1a1a;
        }

        .scroll-path-subheadline span:nth-child(2) {
          color: #4a4a4a;
        }

        .scroll-path-subtext {
          font-size: 0.95rem;
          color: #666;
          margin: 0;
        }

        /* Right Column - Image */
        .scroll-path-image {
          width: 280px;
          height: 380px;
          border-radius: 8px;
          overflow: hidden;
          box-shadow: 0 20px 60px rgba(0, 0, 0, 0.15);
        }

        .scroll-path-image img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }

        .scroll-path-svg {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          z-index: 1;
        }

        .scroll-path-svg image {
          filter: drop-shadow(0 4px 12px rgba(0, 0, 0, 0.2));
        }

        .scroll-path-waypoints {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          z-index: 5;
          pointer-events: none;
        }

        .waypoint {
          position: absolute;
          display: flex;
          flex-direction: column;
          align-items: center;
          transform: translate(-50%, -50%);
          opacity: 0;
          transition: opacity 0.5s ease, transform 0.5s ease;
        }

        .waypoint--active {
          opacity: 1;
        }

        .waypoint__dot {
          width: 16px;
          height: 16px;
          background: #fff;
          border: 3px solid ${colorEnd};
          border-radius: 50%;
          margin-bottom: 8px;
          position: relative;
        }

        .waypoint__dot::before {
          content: '';
          position: absolute;
          inset: -6px;
          border: 2px solid ${colorEnd};
          border-radius: 50%;
          opacity: 0;
          animation: waypointPing 2s ease-out infinite;
        }

        .waypoint--active .waypoint__dot::before {
          opacity: 1;
        }

        @keyframes waypointPing {
          0% { transform: scale(1); opacity: 0.8; }
          100% { transform: scale(1.5); opacity: 0; }
        }

        .waypoint__label {
          font-size: 0.7rem;
          font-weight: 600;
          text-transform: uppercase;
          letter-spacing: 0.1em;
          color: #1a1a1a;
          white-space: nowrap;
          background: rgba(255, 255, 255, 0.9);
          padding: 4px 10px;
          border-radius: 4px;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
        }

        /* Tablet responsiveness */
        @media (max-width: 1024px) {
          .scroll-path-content {
            padding: 2rem;
            gap: 1.5rem;
          }

          .scroll-path-col--middle {
            display: none;
          }

          .scroll-path-image {
            width: 220px;
            height: 300px;
          }
        }

        /* Mobile responsiveness */
        @media (max-width: 768px) {
          .scroll-path-content {
            flex-direction: column;
            justify-content: center;
            padding: 2rem;
          }

          .scroll-path-col--left {
            align-items: center;
            text-align: center;
          }

          .scroll-path-col--right {
            display: none;
          }

          .scroll-path-icon img {
            width: 40px;
          }

          .waypoint__label {
            font-size: 0.6rem;
          }
        }
      `}</style>
    </section>
  );
}

// Waypoint component for markers along the path
function Waypoint({ progress, threshold, label, position }) {
  const opacity = useTransform(
    progress,
    [threshold - 0.1, threshold, threshold + 0.1],
    [0, 1, 1]
  );

  const scale = useTransform(
    progress,
    [threshold - 0.1, threshold],
    [0.8, 1]
  );

  return (
    <motion.div
      className="waypoint"
      style={{
        left: `${position.x}%`,
        top: `${position.y}%`,
        opacity,
        scale,
      }}
    >
      <div className="waypoint__dot" />
      <span className="waypoint__label">{label}</span>
    </motion.div>
  );
}

export default ScrollPathAnimation;

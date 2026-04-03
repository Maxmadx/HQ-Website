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

// Custom curved SVG path - short flat → long peak up → dip down → exit up-right
const FLIGHT_PATH = `
  M 0 300
  C 100 300, 200 298, 350 290
  C 500 275, 650 220, 750 170
  C 830 130, 900 110, 1000 90
  C 1100 80, 1150 90, 1200 100
  C 1300 110, 1400 140, 1480 150
  C 1560 155, 1640 130, 1750 90
  C 1820 60, 1900 30, 2000 0
`;

// Viewbox dimensions matching the path
const VIEWBOX = { width: 2000, height: 400 };

// Number of samples for pre-computed lookup table
const PATH_SAMPLES = 500;

function ScrollPathAnimation({
  className = '',
  pathWidth = 3,
  iconSrc = '/assets/images/icons/r66-icon-transparent going right.svg',
  iconSize = 200,
  // Gradient colors: white → light blue → dark blue
  colorStart = '#FFFFFF',
  colorMid = '#5B9BD5',
  colorEnd = '#1E3A5F',
  // Optional: external ref to element whose scroll range drives progress
  scrollTargetRef = null,
  // Optional: ref to the sticky element — helicopter only moves during stuck phase
  stickyRef = null,
  // The CSS `top` value of the sticky element (default 35vh)
  stickyTop = 0.35,
}) {
  const containerRef = useRef(null);
  const pathRef = useRef(null);
  const iconRef = useRef(null);
  // Pre-computed lookup table: [{x, y, angle}, ...] — zero geometry work during animation
  const lookupRef = useRef(null);
  // Cached container rect — updated on scroll, NOT every frame
  const containerRectRef = useRef(null);

  // Framer only used for the path LINE drawing (CSS pathLength — browser composites this)
  const scrollTarget = scrollTargetRef || containerRef;
  const { scrollYProgress } = useScroll({
    target: scrollTarget,
    offset: stickyRef ? [`start ${stickyTop}`, "end end"] : ["start 0.7", "end start"]
  });

  const smoothProgress = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001
  });

  const pathDrawLength = useTransform(smoothProgress, [0, 1], [0, 1]);

  // PRE-COMPUTE: Sample the entire path once at mount → lookup table
  // This eliminates ALL getPointAtLength / atan2 calls during animation
  useEffect(() => {
    if (!pathRef.current) return;
    const totalLen = pathRef.current.getTotalLength();
    const table = [];

    for (let i = 0; i <= PATH_SAMPLES; i++) {
      const t = i / PATH_SAMPLES;
      const len = t * totalLen;
      const pt = pathRef.current.getPointAtLength(len);
      // Look ahead for angle
      const aheadLen = Math.min(len + 50, totalLen);
      const ahead = pathRef.current.getPointAtLength(aheadLen);
      const angle = Math.atan2(ahead.y - pt.y, ahead.x - pt.x) * (180 / Math.PI);
      table.push({ x: pt.x, y: pt.y, angle });
    }

    lookupRef.current = table;
  }, []);

  // Cache refs for sticky-aware scroll calculation
  const stickyHeightRef = useRef(0);

  useEffect(() => {
    const updateRefs = () => {
      const el = (scrollTargetRef && scrollTargetRef.current) || containerRef.current;
      if (el) containerRectRef.current = el.getBoundingClientRect();
      if (stickyRef && stickyRef.current) stickyHeightRef.current = stickyRef.current.offsetHeight;
    };
    updateRefs();
    window.addEventListener('scroll', updateRefs, { passive: true });
    window.addEventListener('resize', updateRefs, { passive: true });
    return () => {
      window.removeEventListener('scroll', updateRefs);
      window.removeEventListener('resize', updateRefs);
    };
  }, [scrollTargetRef, stickyRef]);

  // HELICOPTER ICON — pure rAF loop, zero Framer, zero layout thrash, zero geometry calls
  useEffect(() => {
    let rafId;
    let currentProgress = 0;
    let currentX = 0;
    let currentY = 300;  // path start Y
    let currentAngle = 0;

    const lerp = (a, b, t) => a + (b - a) * t;

    // Interpolate from pre-computed lookup table — just math, no DOM/SVG queries
    const samplePath = (progress) => {
      const table = lookupRef.current;
      if (!table) return { x: 0, y: 300, angle: 0 };

      const idx = progress * PATH_SAMPLES;
      const lo = Math.floor(idx);
      const hi = Math.min(lo + 1, PATH_SAMPLES);
      const frac = idx - lo;

      const a = table[lo];
      const b = table[hi];

      return {
        x: lerp(a.x, b.x, frac),
        y: lerp(a.y, b.y, frac),
        angle: lerp(a.angle, b.angle, frac),
      };
    };

    const getScrollTarget = () => {
      const rect = containerRectRef.current;
      if (!rect) return 0;

      if (stickyRef && stickyRef.current) {
        // Stuck-only mode: progress 0→1 maps to the stuck scroll range
        const viewH = window.innerHeight;
        const stickyTopPx = viewH * stickyTop;
        const stickyH = stickyHeightRef.current;
        // Stuck starts when container top = stickyTopPx
        // Stuck ends when container bottom - stickyH = stickyTopPx
        const stuckDistance = rect.height - stickyH;
        if (stuckDistance <= 0) return 0;
        const scrolled = stickyTopPx - rect.top;
        return Math.max(0, Math.min(1, scrolled / stuckDistance));
      }

      // Default: original behavior
      const viewH = window.innerHeight;
      const startOffset = viewH * 0.7;
      const totalDistance = rect.height + startOffset;
      const scrolled = startOffset - rect.top;
      const raw = scrolled / totalDistance;
      const mapped = Math.min(raw / 0.75, 1);
      return Math.max(0, Math.min(1, mapped));
    };

    const tick = () => {
      if (!lookupRef.current || !iconRef.current) {
        rafId = requestAnimationFrame(tick);
        return;
      }

      const target = getScrollTarget();

      // Smooth lerp — 0.12 per frame gives responsive but smooth following
      const speed = 0.12;
      currentProgress += (target - currentProgress) * speed;

      // Sample from pre-computed table (pure math — zero DOM access)
      const sample = samplePath(currentProgress);

      // Smooth position and angle
      currentX += (sample.x - currentX) * speed;
      currentY += (sample.y - currentY) * speed;
      currentAngle += (sample.angle - currentAngle) * speed;

      // GPU-composited CSS transform — no layout thrash
      const tx = currentX - 100;
      const ty = currentY - 100;
      iconRef.current.style.transform = `translate(${tx}px, ${ty}px) rotate(${currentAngle}deg)`;

      rafId = requestAnimationFrame(tick);
    };

    rafId = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafId);
  }, []);

  return (
    <section
      ref={containerRef}
      className={`scroll-path-section ${className}`}
    >
      <svg
        className="scroll-path-svg"
        viewBox={`0 0 ${VIEWBOX.width} ${VIEWBOX.height}`}
        preserveAspectRatio="xMidYMid meet"
        fill="none"
      >
        <defs>
          {/* Gradient for the path: white → light blue → dark blue */}
          <linearGradient id="pathGradient" x1="0%" y1="100%" x2="100%" y2="0%">
            <stop offset="0%" stopColor={colorStart} stopOpacity="0.9" />
            <stop offset="50%" stopColor={colorMid} stopOpacity="1" />
            <stop offset="100%" stopColor={colorEnd} stopOpacity="1" />
          </linearGradient>

          {/* Glow gradient — thicker semi-transparent stroke, NO blur filter */}
          <linearGradient id="glowGradient" x1="0%" y1="100%" x2="100%" y2="0%">
            <stop offset="0%" stopColor={colorStart} stopOpacity="0.15" />
            <stop offset="50%" stopColor={colorMid} stopOpacity="0.3" />
            <stop offset="100%" stopColor={colorEnd} stopOpacity="0.4" />
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

        {/* Glow path — wider semi-transparent stroke, NO feGaussianBlur */}
        <motion.path
          ref={pathRef}
          d={FLIGHT_PATH}
          stroke="url(#glowGradient)"
          strokeWidth={pathWidth + 10}
          strokeLinecap="round"
          strokeLinejoin="round"
          fill="none"
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

        {/* Helicopter icon — positioned via CSS transform (GPU-composited) */}
        <image
          ref={iconRef}
          href={iconSrc}
          width="200"
          height="200"
          x="0"
          y="0"
          className="scroll-path-icon-img"
        />
      </svg>


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
          padding-bottom: 4rem;
        }

        .scroll-path-content {
          position: relative;
          top: 0;
          height: 35vh;
          display: flex;
          flex-direction: row;
          justify-content: center;
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
          align-items: center;
          text-align: center;
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

        .scroll-path-pretitle {
          display: block;
          font-size: 0.75rem;
          text-transform: uppercase;
          letter-spacing: 0.3em;
          color: #888;
          margin-top: 5rem;
          margin-bottom: 1rem;
          text-align: center;
        }

        .scroll-path-headline {
          display: flex;
          flex-direction: column;
          align-items: center;
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
          overflow: visible;
        }

        /* Icon: GPU layer promotion, NO filters during animation */
        .scroll-path-icon-img {
          will-change: transform;
          transform-origin: 100px 100px;
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

        /* Hide certification waypoint on smaller screens */
        @media (max-width: 1024px) {
          .waypoint--certification,
          .waypoint--mastery {
            display: none !important;
          }
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
function Waypoint({ progress, threshold, label, position, className: extraClass = '' }) {
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
      className={`waypoint ${extraClass}`}
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

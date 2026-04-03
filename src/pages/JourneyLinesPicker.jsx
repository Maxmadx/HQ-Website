/**
 * JOURNEY LINES PICKER
 *
 * 10 variations of the Journey Lines component for the Expeditions page.
 * Uses the Picker component pattern for browsing and selecting variations.
 *
 * Access at: /journey-lines-picker
 *
 * Variations:
 * 1. Radial Burst - Lines emanate from center, nodes pulse
 * 2. Horizontal Timeline - Left-to-right journey visualization
 * 3. Vertical Path - Top-to-bottom scrolling journey
 * 4. Orbital Ring - Destinations orbit around center
 * 5. World Map Grid - Grid-based geographic layout
 * 6. Curved Paths - Bezier curved flight paths
 * 7. Constellation - Star pattern with connected dots
 * 8. Hierarchical Tree - Tree structure with branches
 * 9. Radar Sweep - Radar-style animation revealing destinations
 * 10. Wave Pattern - Flowing wave connecting destinations
 */

import React, { useState, useEffect, useCallback, useRef } from 'react';
import { motion, useInView } from 'framer-motion';

// Destination data
const destinations = [
  { label: 'ARCTIC', region: 'polar' },
  { label: 'ICELAND', region: 'european' },
  { label: 'MOROCCO', region: 'european' },
  { label: 'NORWAY', region: 'european' },
  { label: 'ALPS', region: 'european' },
  { label: 'GREENLAND', region: 'polar' },
  { label: 'BAHAMAS', region: 'tropical' },
  { label: 'COSTA RICA', region: 'tropical' },
];

// ============================================
// VARIATION 1: RADIAL BURST
// ============================================
function JourneyLinesV1() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.3 });

  const points = destinations.map((dest, i) => {
    const angle = (i / destinations.length) * Math.PI * 2 - Math.PI / 2;
    const radius = 150;
    return {
      ...dest,
      x: 300 + Math.cos(angle) * radius,
      y: 200 + Math.sin(angle) * radius,
      delay: i * 0.1,
    };
  });

  return (
    <div ref={ref} className="jlp-variation">
      <svg viewBox="0 0 600 400" className="jlp-svg">
        {/* Center hub */}
        <motion.circle
          cx="300"
          cy="200"
          r="12"
          fill="#1a1a1a"
          initial={{ scale: 0 }}
          animate={isInView ? { scale: 1 } : {}}
          transition={{ duration: 0.5 }}
        />
        <text x="300" y="235" textAnchor="middle" className="jlp-label-center">DENHAM</text>

        {/* Radiating lines and destinations */}
        {points.map((dest, i) => (
          <g key={i}>
            {/* Animated line */}
            <motion.line
              x1="300"
              y1="200"
              x2={dest.x}
              y2={dest.y}
              stroke="#e8e6e2"
              strokeWidth="2"
              initial={{ pathLength: 0 }}
              animate={isInView ? { pathLength: 1 } : {}}
              transition={{ duration: 0.8, delay: dest.delay }}
            />
            {/* Pulsing destination node */}
            <motion.circle
              cx={dest.x}
              cy={dest.y}
              r="6"
              fill="#faf9f6"
              stroke="#1a1a1a"
              strokeWidth="2"
              initial={{ scale: 0 }}
              animate={isInView ? { scale: [0, 1.2, 1] } : {}}
              transition={{ duration: 0.4, delay: dest.delay + 0.6 }}
            />
            {/* Pulse ring */}
            <motion.circle
              cx={dest.x}
              cy={dest.y}
              r="6"
              fill="none"
              stroke="#1a1a1a"
              strokeWidth="1"
              initial={{ scale: 1, opacity: 0 }}
              animate={isInView ? { scale: [1, 2], opacity: [0.5, 0] } : {}}
              transition={{ duration: 1.5, delay: dest.delay + 1, repeat: Infinity }}
            />
            {/* Label */}
            <motion.text
              x={dest.x}
              y={dest.y + 22}
              textAnchor="middle"
              className="jlp-label"
              initial={{ opacity: 0 }}
              animate={isInView ? { opacity: 1 } : {}}
              transition={{ duration: 0.3, delay: dest.delay + 0.8 }}
            >
              {dest.label}
            </motion.text>
          </g>
        ))}
      </svg>
      <p className="jlp-text">Radial routes from our home base</p>
    </div>
  );
}

// ============================================
// VARIATION 2: HORIZONTAL TIMELINE
// ============================================
function JourneyLinesV2() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.3 });

  const spacing = 600 / (destinations.length + 1);

  return (
    <div ref={ref} className="jlp-variation">
      <svg viewBox="0 0 600 200" className="jlp-svg">
        {/* Main horizontal line */}
        <motion.line
          x1="50"
          y1="100"
          x2="550"
          y2="100"
          stroke="#e8e6e2"
          strokeWidth="2"
          initial={{ pathLength: 0 }}
          animate={isInView ? { pathLength: 1 } : {}}
          transition={{ duration: 1 }}
        />

        {/* Denham start point */}
        <circle cx="50" cy="100" r="8" fill="#1a1a1a" />
        <text x="50" y="130" textAnchor="middle" className="jlp-label-center">DENHAM</text>

        {/* Destinations along the timeline */}
        {destinations.map((dest, i) => {
          const x = spacing * (i + 1) + 50;
          const yOffset = i % 2 === 0 ? -30 : 30;
          return (
            <g key={i}>
              {/* Vertical connector */}
              <motion.line
                x1={x}
                y1="100"
                x2={x}
                y2={100 + yOffset}
                stroke="#1a1a1a"
                strokeWidth="1"
                initial={{ pathLength: 0 }}
                animate={isInView ? { pathLength: 1 } : {}}
                transition={{ duration: 0.3, delay: 0.8 + i * 0.1 }}
              />
              {/* Node */}
              <motion.circle
                cx={x}
                cy={100 + yOffset}
                r="5"
                fill="#faf9f6"
                stroke="#1a1a1a"
                strokeWidth="2"
                initial={{ scale: 0 }}
                animate={isInView ? { scale: 1 } : {}}
                transition={{ duration: 0.3, delay: 1 + i * 0.1 }}
              />
              {/* Label */}
              <motion.text
                x={x}
                y={100 + yOffset + (yOffset < 0 ? -12 : 18)}
                textAnchor="middle"
                className="jlp-label-small"
                initial={{ opacity: 0 }}
                animate={isInView ? { opacity: 1 } : {}}
                transition={{ duration: 0.3, delay: 1.2 + i * 0.1 }}
              >
                {dest.label}
              </motion.text>
            </g>
          );
        })}

        {/* Animated airplane */}
        <motion.g
          initial={{ x: 0 }}
          animate={isInView ? { x: [0, 500] } : {}}
          transition={{ duration: 4, repeat: Infinity, ease: "linear", delay: 1.5 }}
        >
          <text x="50" y="95" fontSize="14">✈</text>
        </motion.g>
      </svg>
      <p className="jlp-text">Journey timeline across continents</p>
    </div>
  );
}

// ============================================
// VARIATION 3: VERTICAL PATH
// ============================================
function JourneyLinesV3() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.2 });

  return (
    <div ref={ref} className="jlp-variation jlp-variation--tall">
      <svg viewBox="0 0 400 600" className="jlp-svg jlp-svg--tall">
        {/* Central vertical path */}
        <motion.path
          d="M200 50 Q 200 100, 180 150 Q 160 200, 200 250 Q 240 300, 200 350 Q 160 400, 200 450 Q 240 500, 200 550"
          fill="none"
          stroke="#e8e6e2"
          strokeWidth="2"
          strokeDasharray="4 4"
          initial={{ pathLength: 0 }}
          animate={isInView ? { pathLength: 1 } : {}}
          transition={{ duration: 2 }}
        />

        {/* Start point */}
        <circle cx="200" cy="50" r="10" fill="#1a1a1a" />
        <text x="200" y="35" textAnchor="middle" className="jlp-label-center">DENHAM</text>

        {/* Destinations along the path */}
        {destinations.map((dest, i) => {
          const y = 100 + i * 60;
          const x = i % 2 === 0 ? 130 : 270;
          const pathX = i % 2 === 0 ? 180 : 220;
          return (
            <g key={i}>
              {/* Connector to path */}
              <motion.line
                x1={pathX}
                y1={y}
                x2={x}
                y2={y}
                stroke="#1a1a1a"
                strokeWidth="1"
                initial={{ pathLength: 0 }}
                animate={isInView ? { pathLength: 1 } : {}}
                transition={{ duration: 0.3, delay: 0.3 * i }}
              />
              {/* Node */}
              <motion.circle
                cx={x}
                cy={y}
                r="5"
                fill="#faf9f6"
                stroke="#1a1a1a"
                strokeWidth="2"
                initial={{ scale: 0 }}
                animate={isInView ? { scale: 1 } : {}}
                transition={{ duration: 0.3, delay: 0.3 * i + 0.2 }}
              />
              {/* Label */}
              <motion.text
                x={x + (i % 2 === 0 ? -10 : 10)}
                y={y + 4}
                textAnchor={i % 2 === 0 ? "end" : "start"}
                className="jlp-label"
                initial={{ opacity: 0 }}
                animate={isInView ? { opacity: 1 } : {}}
                transition={{ duration: 0.3, delay: 0.3 * i + 0.3 }}
              >
                {dest.label}
              </motion.text>
            </g>
          );
        })}
      </svg>
      <p className="jlp-text">Descending through destinations</p>
    </div>
  );
}

// ============================================
// VARIATION 4: ORBITAL RING
// ============================================
function JourneyLinesV4() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.3 });

  return (
    <div ref={ref} className="jlp-variation">
      <svg viewBox="0 0 600 400" className="jlp-svg">
        {/* Orbital rings */}
        {[80, 120, 160].map((r, i) => (
          <motion.circle
            key={i}
            cx="300"
            cy="200"
            r={r}
            fill="none"
            stroke="#e8e6e2"
            strokeWidth="1"
            strokeDasharray="2 4"
            initial={{ scale: 0, opacity: 0 }}
            animate={isInView ? { scale: 1, opacity: 0.5 } : {}}
            transition={{ duration: 0.8, delay: i * 0.2 }}
          />
        ))}

        {/* Center hub */}
        <motion.circle
          cx="300"
          cy="200"
          r="15"
          fill="#1a1a1a"
          initial={{ scale: 0 }}
          animate={isInView ? { scale: 1 } : {}}
          transition={{ duration: 0.5 }}
        />
        <text x="300" y="240" textAnchor="middle" className="jlp-label-center">DENHAM</text>

        {/* Orbiting destinations */}
        {destinations.map((dest, i) => {
          const orbit = [80, 120, 160][i % 3];
          const angle = (i / destinations.length) * Math.PI * 2;
          const x = 300 + Math.cos(angle) * orbit;
          const y = 200 + Math.sin(angle) * orbit;

          return (
            <motion.g
              key={i}
              initial={{ rotate: 0 }}
              animate={isInView ? { rotate: 360 } : {}}
              transition={{ duration: 20 + i * 5, repeat: Infinity, ease: "linear", delay: i * 0.3 }}
              style={{ originX: '300px', originY: '200px' }}
            >
              <motion.circle
                cx={x}
                cy={y}
                r="6"
                fill="#faf9f6"
                stroke="#1a1a1a"
                strokeWidth="2"
                initial={{ scale: 0 }}
                animate={isInView ? { scale: 1 } : {}}
                transition={{ duration: 0.3, delay: 0.5 + i * 0.1 }}
              />
              <motion.text
                x={x}
                y={y - 12}
                textAnchor="middle"
                className="jlp-label-small"
                initial={{ opacity: 0 }}
                animate={isInView ? { opacity: 1 } : {}}
                transition={{ duration: 0.3, delay: 0.7 + i * 0.1 }}
              >
                {dest.label}
              </motion.text>
            </motion.g>
          );
        })}
      </svg>
      <p className="jlp-text">Destinations in orbit around HQ</p>
    </div>
  );
}

// ============================================
// VARIATION 5: WORLD MAP GRID
// ============================================
function JourneyLinesV5() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.3 });

  const gridPositions = [
    { x: 100, y: 80 },   // ARCTIC
    { x: 180, y: 180 },  // ICELAND
    { x: 150, y: 300 },  // MOROCCO
    { x: 280, y: 120 },  // NORWAY
    { x: 350, y: 200 },  // ALPS
    { x: 480, y: 80 },   // GREENLAND
    { x: 520, y: 200 },  // BAHAMAS
    { x: 500, y: 320 },  // COSTA RICA
  ];

  return (
    <div ref={ref} className="jlp-variation">
      <svg viewBox="0 0 600 400" className="jlp-svg">
        {/* Grid lines */}
        {[0, 100, 200, 300, 400].map((y) => (
          <motion.line
            key={`h-${y}`}
            x1="0"
            y1={y}
            x2="600"
            y2={y}
            stroke="#e8e6e2"
            strokeWidth="0.5"
            initial={{ opacity: 0 }}
            animate={isInView ? { opacity: 0.3 } : {}}
            transition={{ duration: 0.5, delay: y / 1000 }}
          />
        ))}
        {[0, 100, 200, 300, 400, 500, 600].map((x) => (
          <motion.line
            key={`v-${x}`}
            x1={x}
            y1="0"
            x2={x}
            y2="400"
            stroke="#e8e6e2"
            strokeWidth="0.5"
            initial={{ opacity: 0 }}
            animate={isInView ? { opacity: 0.3 } : {}}
            transition={{ duration: 0.5, delay: x / 2000 }}
          />
        ))}

        {/* Denham center */}
        <motion.circle
          cx="300"
          cy="200"
          r="10"
          fill="#1a1a1a"
          initial={{ scale: 0 }}
          animate={isInView ? { scale: 1 } : {}}
          transition={{ duration: 0.5 }}
        />
        <text x="300" y="225" textAnchor="middle" className="jlp-label-center">DENHAM</text>

        {/* Connections and destinations */}
        {destinations.map((dest, i) => {
          const pos = gridPositions[i];
          return (
            <g key={i}>
              <motion.line
                x1="300"
                y1="200"
                x2={pos.x}
                y2={pos.y}
                stroke="#1a1a1a"
                strokeWidth="1"
                strokeDasharray="4 2"
                initial={{ pathLength: 0, opacity: 0 }}
                animate={isInView ? { pathLength: 1, opacity: 0.5 } : {}}
                transition={{ duration: 0.8, delay: i * 0.1 }}
              />
              <motion.rect
                x={pos.x - 8}
                y={pos.y - 8}
                width="16"
                height="16"
                fill="#faf9f6"
                stroke="#1a1a1a"
                strokeWidth="2"
                initial={{ scale: 0 }}
                animate={isInView ? { scale: 1 } : {}}
                transition={{ duration: 0.3, delay: 0.6 + i * 0.1 }}
              />
              <motion.text
                x={pos.x}
                y={pos.y + 25}
                textAnchor="middle"
                className="jlp-label-small"
                initial={{ opacity: 0 }}
                animate={isInView ? { opacity: 1 } : {}}
                transition={{ duration: 0.3, delay: 0.8 + i * 0.1 }}
              >
                {dest.label}
              </motion.text>
            </g>
          );
        })}
      </svg>
      <p className="jlp-text">Global network grid</p>
    </div>
  );
}

// ============================================
// VARIATION 6: CURVED PATHS
// ============================================
function JourneyLinesV6() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.3 });

  const curvedPositions = [
    { x: 100, y: 100, cx1: 200, cy1: 50 },
    { x: 80, y: 200, cx1: 150, cy1: 200 },
    { x: 120, y: 320, cx1: 180, cy1: 280 },
    { x: 220, y: 80, cx1: 260, cy1: 140 },
    { x: 400, y: 100, cx1: 350, cy1: 50 },
    { x: 500, y: 80, cx1: 420, cy1: 120 },
    { x: 520, y: 200, cx1: 450, cy1: 200 },
    { x: 480, y: 320, cx1: 420, cy1: 280 },
  ];

  return (
    <div ref={ref} className="jlp-variation">
      <svg viewBox="0 0 600 400" className="jlp-svg">
        {/* Center hub */}
        <motion.circle
          cx="300"
          cy="200"
          r="10"
          fill="#1a1a1a"
          initial={{ scale: 0 }}
          animate={isInView ? { scale: 1 } : {}}
          transition={{ duration: 0.5 }}
        />
        <text x="300" y="230" textAnchor="middle" className="jlp-label-center">DENHAM</text>

        {/* Curved flight paths */}
        {destinations.map((dest, i) => {
          const pos = curvedPositions[i];
          const path = `M 300 200 Q ${pos.cx1} ${pos.cy1} ${pos.x} ${pos.y}`;

          return (
            <g key={i}>
              <motion.path
                d={path}
                fill="none"
                stroke="#e8e6e2"
                strokeWidth="2"
                initial={{ pathLength: 0 }}
                animate={isInView ? { pathLength: 1 } : {}}
                transition={{ duration: 1, delay: i * 0.15 }}
              />
              {/* Animated dot along path */}
              <motion.circle
                r="4"
                fill="#1a1a1a"
                initial={{ opacity: 0 }}
                animate={isInView ? {
                  opacity: [0, 1, 1, 0],
                  offsetDistance: ['0%', '100%'],
                } : {}}
                transition={{ duration: 2, delay: i * 0.15 + 0.5, repeat: Infinity, repeatDelay: 3 }}
                style={{ offsetPath: `path("${path}")` }}
              />
              <motion.circle
                cx={pos.x}
                cy={pos.y}
                r="5"
                fill="#faf9f6"
                stroke="#1a1a1a"
                strokeWidth="2"
                initial={{ scale: 0 }}
                animate={isInView ? { scale: 1 } : {}}
                transition={{ duration: 0.3, delay: i * 0.15 + 0.8 }}
              />
              <motion.text
                x={pos.x}
                y={pos.y + (pos.y < 200 ? -12 : 20)}
                textAnchor="middle"
                className="jlp-label"
                initial={{ opacity: 0 }}
                animate={isInView ? { opacity: 1 } : {}}
                transition={{ duration: 0.3, delay: i * 0.15 + 1 }}
              >
                {dest.label}
              </motion.text>
            </g>
          );
        })}
      </svg>
      <p className="jlp-text">Curved flight paths across the globe</p>
    </div>
  );
}

// ============================================
// VARIATION 7: CONSTELLATION
// ============================================
function JourneyLinesV7() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.3 });

  const starPositions = [
    { x: 150, y: 100 },
    { x: 100, y: 200 },
    { x: 180, y: 280 },
    { x: 250, y: 150 },
    { x: 350, y: 120 },
    { x: 450, y: 80 },
    { x: 500, y: 180 },
    { x: 420, y: 300 },
  ];

  // Create constellation connections
  const connections = [
    [0, 3], [3, 4], [4, 5], [5, 6], [6, 7],
    [1, 0], [1, 2], [2, 7],
  ];

  return (
    <div ref={ref} className="jlp-variation jlp-variation--dark">
      <svg viewBox="0 0 600 400" className="jlp-svg">
        {/* Background stars */}
        {[...Array(30)].map((_, i) => (
          <motion.circle
            key={`star-${i}`}
            cx={Math.random() * 600}
            cy={Math.random() * 400}
            r={Math.random() * 1.5 + 0.5}
            fill="#fff"
            initial={{ opacity: 0 }}
            animate={isInView ? { opacity: [0.2, 0.8, 0.2] } : {}}
            transition={{ duration: 2 + Math.random() * 2, repeat: Infinity, delay: Math.random() * 2 }}
          />
        ))}

        {/* Center - Denham as bright star */}
        <motion.circle
          cx="300"
          cy="200"
          r="8"
          fill="#fff"
          initial={{ scale: 0 }}
          animate={isInView ? { scale: [1, 1.2, 1] } : {}}
          transition={{ duration: 2, repeat: Infinity }}
        />
        <motion.circle
          cx="300"
          cy="200"
          r="15"
          fill="none"
          stroke="rgba(255,255,255,0.3)"
          initial={{ scale: 0 }}
          animate={isInView ? { scale: [1, 1.5], opacity: [0.5, 0] } : {}}
          transition={{ duration: 2, repeat: Infinity }}
        />
        <text x="300" y="230" textAnchor="middle" className="jlp-label-light">DENHAM</text>

        {/* Constellation lines */}
        {connections.map(([from, to], i) => (
          <motion.line
            key={`conn-${i}`}
            x1={starPositions[from].x}
            y1={starPositions[from].y}
            x2={starPositions[to].x}
            y2={starPositions[to].y}
            stroke="rgba(255,255,255,0.4)"
            strokeWidth="1"
            initial={{ pathLength: 0, opacity: 0 }}
            animate={isInView ? { pathLength: 1, opacity: 1 } : {}}
            transition={{ duration: 0.8, delay: 0.5 + i * 0.1 }}
          />
        ))}

        {/* Destination stars */}
        {destinations.map((dest, i) => {
          const pos = starPositions[i];
          return (
            <g key={i}>
              {/* Lines to center */}
              <motion.line
                x1="300"
                y1="200"
                x2={pos.x}
                y2={pos.y}
                stroke="rgba(255,255,255,0.2)"
                strokeWidth="1"
                strokeDasharray="2 4"
                initial={{ pathLength: 0 }}
                animate={isInView ? { pathLength: 1 } : {}}
                transition={{ duration: 1, delay: i * 0.1 }}
              />
              <motion.circle
                cx={pos.x}
                cy={pos.y}
                r="4"
                fill="#fff"
                initial={{ scale: 0 }}
                animate={isInView ? { scale: [1, 1.3, 1] } : {}}
                transition={{ duration: 1.5, delay: 1 + i * 0.2, repeat: Infinity }}
              />
              <motion.text
                x={pos.x}
                y={pos.y - 12}
                textAnchor="middle"
                className="jlp-label-light jlp-label-small"
                initial={{ opacity: 0 }}
                animate={isInView ? { opacity: 1 } : {}}
                transition={{ duration: 0.5, delay: 1.2 + i * 0.1 }}
              >
                {dest.label}
              </motion.text>
            </g>
          );
        })}
      </svg>
      <p className="jlp-text jlp-text--light">Navigate by the expedition constellation</p>
    </div>
  );
}

// ============================================
// VARIATION 8: HIERARCHICAL TREE
// ============================================
function JourneyLinesV8() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.3 });

  const regions = [
    { name: 'POLAR', x: 150, y: 150, dests: ['ARCTIC', 'GREENLAND'] },
    { name: 'EUROPEAN', x: 300, y: 150, dests: ['ICELAND', 'NORWAY', 'ALPS', 'MOROCCO'] },
    { name: 'TROPICAL', x: 450, y: 150, dests: ['BAHAMAS', 'COSTA RICA'] },
  ];

  return (
    <div ref={ref} className="jlp-variation">
      <svg viewBox="0 0 600 350" className="jlp-svg">
        {/* Root node - Denham */}
        <motion.circle
          cx="300"
          cy="50"
          r="12"
          fill="#1a1a1a"
          initial={{ scale: 0 }}
          animate={isInView ? { scale: 1 } : {}}
          transition={{ duration: 0.5 }}
        />
        <text x="300" y="35" textAnchor="middle" className="jlp-label-center">DENHAM</text>

        {/* Region branches */}
        {regions.map((region, ri) => (
          <g key={ri}>
            {/* Line from root to region */}
            <motion.path
              d={`M 300 62 L 300 100 L ${region.x} 100 L ${region.x} 138`}
              fill="none"
              stroke="#e8e6e2"
              strokeWidth="2"
              initial={{ pathLength: 0 }}
              animate={isInView ? { pathLength: 1 } : {}}
              transition={{ duration: 0.6, delay: ri * 0.2 }}
            />
            {/* Region node */}
            <motion.rect
              x={region.x - 35}
              y={region.y - 12}
              width="70"
              height="24"
              rx="4"
              fill="#1a1a1a"
              initial={{ scale: 0 }}
              animate={isInView ? { scale: 1 } : {}}
              transition={{ duration: 0.3, delay: 0.4 + ri * 0.2 }}
            />
            <motion.text
              x={region.x}
              y={region.y + 5}
              textAnchor="middle"
              className="jlp-label-region"
              initial={{ opacity: 0 }}
              animate={isInView ? { opacity: 1 } : {}}
              transition={{ duration: 0.3, delay: 0.5 + ri * 0.2 }}
            >
              {region.name}
            </motion.text>

            {/* Destination leaves */}
            {region.dests.map((dest, di) => {
              const totalDests = region.dests.length;
              const spread = 60;
              const startX = region.x - (spread * (totalDests - 1)) / 2;
              const destX = startX + di * spread;
              const destY = 280;

              return (
                <g key={di}>
                  <motion.line
                    x1={region.x}
                    y1={region.y + 12}
                    x2={destX}
                    y2={destY - 12}
                    stroke="#e8e6e2"
                    strokeWidth="1"
                    initial={{ pathLength: 0 }}
                    animate={isInView ? { pathLength: 1 } : {}}
                    transition={{ duration: 0.5, delay: 0.7 + ri * 0.2 + di * 0.1 }}
                  />
                  <motion.circle
                    cx={destX}
                    cy={destY}
                    r="5"
                    fill="#faf9f6"
                    stroke="#1a1a1a"
                    strokeWidth="2"
                    initial={{ scale: 0 }}
                    animate={isInView ? { scale: 1 } : {}}
                    transition={{ duration: 0.3, delay: 0.9 + ri * 0.2 + di * 0.1 }}
                  />
                  <motion.text
                    x={destX}
                    y={destY + 18}
                    textAnchor="middle"
                    className="jlp-label-tiny"
                    initial={{ opacity: 0 }}
                    animate={isInView ? { opacity: 1 } : {}}
                    transition={{ duration: 0.3, delay: 1 + ri * 0.2 + di * 0.1 }}
                  >
                    {dest}
                  </motion.text>
                </g>
              );
            })}
          </g>
        ))}
      </svg>
      <p className="jlp-text">Organized by expedition region</p>
    </div>
  );
}

// ============================================
// VARIATION 9: RADAR SWEEP
// ============================================
function JourneyLinesV9() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.3 });

  const radarPositions = destinations.map((dest, i) => {
    const angle = (i / destinations.length) * Math.PI * 2 - Math.PI / 2;
    const distance = 80 + (i % 3) * 40;
    return {
      ...dest,
      x: 300 + Math.cos(angle) * distance,
      y: 200 + Math.sin(angle) * distance,
      angle: (i / destinations.length) * 360 - 90,
    };
  });

  return (
    <div ref={ref} className="jlp-variation jlp-variation--dark">
      <svg viewBox="0 0 600 400" className="jlp-svg">
        {/* Radar circles */}
        {[60, 100, 140, 180].map((r, i) => (
          <motion.circle
            key={i}
            cx="300"
            cy="200"
            r={r}
            fill="none"
            stroke="rgba(0,255,100,0.2)"
            strokeWidth="1"
            initial={{ scale: 0 }}
            animate={isInView ? { scale: 1 } : {}}
            transition={{ duration: 0.5, delay: i * 0.1 }}
          />
        ))}

        {/* Radar grid lines */}
        {[0, 45, 90, 135].map((angle, i) => {
          const rad = (angle * Math.PI) / 180;
          return (
            <motion.line
              key={i}
              x1={300 - Math.cos(rad) * 180}
              y1={200 - Math.sin(rad) * 180}
              x2={300 + Math.cos(rad) * 180}
              y2={200 + Math.sin(rad) * 180}
              stroke="rgba(0,255,100,0.1)"
              strokeWidth="1"
              initial={{ opacity: 0 }}
              animate={isInView ? { opacity: 1 } : {}}
              transition={{ duration: 0.3, delay: 0.3 + i * 0.05 }}
            />
          );
        })}

        {/* Radar sweep */}
        <motion.g
          initial={{ rotate: 0 }}
          animate={isInView ? { rotate: 360 } : {}}
          transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
          style={{ transformOrigin: '300px 200px' }}
        >
          <defs>
            <linearGradient id="sweepGrad" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="rgba(0,255,100,0)" />
              <stop offset="100%" stopColor="rgba(0,255,100,0.5)" />
            </linearGradient>
          </defs>
          <path
            d="M 300 200 L 300 20 A 180 180 0 0 1 470 130 Z"
            fill="url(#sweepGrad)"
          />
        </motion.g>

        {/* Center point */}
        <circle cx="300" cy="200" r="6" fill="#0f0" />
        <text x="300" y="225" textAnchor="middle" className="jlp-label-radar">DENHAM</text>

        {/* Destination blips */}
        {radarPositions.map((dest, i) => (
          <g key={i}>
            <motion.circle
              cx={dest.x}
              cy={dest.y}
              r="4"
              fill="#0f0"
              initial={{ opacity: 0 }}
              animate={isInView ? { opacity: [0.3, 1, 0.3] } : {}}
              transition={{ duration: 1.5, repeat: Infinity, delay: i * 0.2 }}
            />
            <motion.circle
              cx={dest.x}
              cy={dest.y}
              r="8"
              fill="none"
              stroke="#0f0"
              strokeWidth="1"
              initial={{ scale: 0.5, opacity: 0 }}
              animate={isInView ? { scale: [0.5, 1.5], opacity: [1, 0] } : {}}
              transition={{ duration: 1.5, repeat: Infinity, delay: i * 0.2 }}
            />
            <motion.text
              x={dest.x}
              y={dest.y - 12}
              textAnchor="middle"
              className="jlp-label-radar jlp-label-small"
              initial={{ opacity: 0 }}
              animate={isInView ? { opacity: 1 } : {}}
              transition={{ duration: 0.5, delay: 0.5 + i * 0.1 }}
            >
              {dest.label}
            </motion.text>
          </g>
        ))}
      </svg>
      <p className="jlp-text jlp-text--radar">Tracking expeditions worldwide</p>
    </div>
  );
}

// ============================================
// VARIATION 10: WAVE PATTERN
// ============================================
function JourneyLinesV10() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.3 });

  const wavePositions = destinations.map((dest, i) => ({
    ...dest,
    x: 75 + i * 65,
    y: 200 + Math.sin((i / destinations.length) * Math.PI * 2) * 60,
  }));

  return (
    <div ref={ref} className="jlp-variation">
      <svg viewBox="0 0 600 400" className="jlp-svg">
        {/* Animated wave paths */}
        <defs>
          <linearGradient id="waveGradient" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#e8e6e2" />
            <stop offset="50%" stopColor="#1a1a1a" />
            <stop offset="100%" stopColor="#e8e6e2" />
          </linearGradient>
        </defs>

        {/* Background waves */}
        {[0, 1, 2].map((wave) => (
          <motion.path
            key={wave}
            d={`M 0 ${200 + wave * 30} Q 150 ${150 + wave * 30}, 300 ${200 + wave * 30} T 600 ${200 + wave * 30}`}
            fill="none"
            stroke="#e8e6e2"
            strokeWidth="1"
            strokeOpacity={0.3 - wave * 0.1}
            initial={{ pathLength: 0 }}
            animate={isInView ? { pathLength: 1 } : {}}
            transition={{ duration: 2, delay: wave * 0.2 }}
          />
        ))}

        {/* Main connecting wave */}
        <motion.path
          d={`M 30 200 ${wavePositions.map((p) => `Q ${p.x - 30} ${p.y}, ${p.x} ${p.y}`).join(' ')} Q 570 200, 570 200`}
          fill="none"
          stroke="#1a1a1a"
          strokeWidth="2"
          initial={{ pathLength: 0 }}
          animate={isInView ? { pathLength: 1 } : {}}
          transition={{ duration: 2 }}
        />

        {/* Start point - Denham */}
        <motion.circle
          cx="30"
          cy="200"
          r="10"
          fill="#1a1a1a"
          initial={{ scale: 0 }}
          animate={isInView ? { scale: 1 } : {}}
          transition={{ duration: 0.5 }}
        />
        <text x="30" y="180" textAnchor="middle" className="jlp-label-center">DENHAM</text>

        {/* Wave rider dot */}
        <motion.circle
          r="6"
          fill="#1a1a1a"
          initial={{ opacity: 0 }}
          animate={isInView ? {
            opacity: 1,
            cx: wavePositions.map(p => p.x),
            cy: wavePositions.map(p => p.y),
          } : {}}
          transition={{ duration: 4, repeat: Infinity, ease: "easeInOut", delay: 2 }}
        />

        {/* Destination nodes */}
        {wavePositions.map((dest, i) => (
          <g key={i}>
            <motion.circle
              cx={dest.x}
              cy={dest.y}
              r="5"
              fill="#faf9f6"
              stroke="#1a1a1a"
              strokeWidth="2"
              initial={{ scale: 0 }}
              animate={isInView ? { scale: 1 } : {}}
              transition={{ duration: 0.3, delay: 1.5 + i * 0.1 }}
            />
            <motion.text
              x={dest.x}
              y={dest.y + (dest.y > 200 ? 20 : -15)}
              textAnchor="middle"
              className="jlp-label-small"
              initial={{ opacity: 0 }}
              animate={isInView ? { opacity: 1 } : {}}
              transition={{ duration: 0.3, delay: 1.7 + i * 0.1 }}
            >
              {dest.label}
            </motion.text>
          </g>
        ))}
      </svg>
      <p className="jlp-text">Flowing through destinations</p>
    </div>
  );
}

// ============================================
// PICKER COMPONENT (Simplified)
// ============================================
const variations = [
  { id: 'v1', name: 'Radial Burst', category: 'Radial', desc: 'Lines emanate from center, nodes pulse', component: JourneyLinesV1 },
  { id: 'v2', name: 'Horizontal Timeline', category: 'Linear', desc: 'Left-to-right journey visualization', component: JourneyLinesV2 },
  { id: 'v3', name: 'Vertical Path', category: 'Linear', desc: 'Top-to-bottom scrolling journey', component: JourneyLinesV3 },
  { id: 'v4', name: 'Orbital Ring', category: 'Radial', desc: 'Destinations orbit around center', component: JourneyLinesV4 },
  { id: 'v5', name: 'World Map Grid', category: 'Grid', desc: 'Grid-based geographic layout', component: JourneyLinesV5 },
  { id: 'v6', name: 'Curved Paths', category: 'Organic', desc: 'Bezier curved flight paths', component: JourneyLinesV6 },
  { id: 'v7', name: 'Constellation', category: 'Themed', desc: 'Star pattern with connected dots', component: JourneyLinesV7 },
  { id: 'v8', name: 'Hierarchical Tree', category: 'Structured', desc: 'Tree structure with branches', component: JourneyLinesV8 },
  { id: 'v9', name: 'Radar Sweep', category: 'Themed', desc: 'Radar-style animation revealing destinations', component: JourneyLinesV9 },
  { id: 'v10', name: 'Wave Pattern', category: 'Organic', desc: 'Flowing wave connecting destinations', component: JourneyLinesV10 },
];

const tabs = [
  { key: 'all', label: 'All' },
  { key: 'radial', label: 'Radial' },
  { key: 'linear', label: 'Linear' },
  { key: 'organic', label: 'Organic' },
  { key: 'themed', label: 'Themed' },
];

function JourneyLinesPicker() {
  const [currentTab, setCurrentTab] = useState('all');
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isMinimized, setIsMinimized] = useState(false);
  const [favorites, setFavorites] = useState([]);

  const filteredVariations = currentTab === 'all'
    ? variations
    : variations.filter(v => v.category.toLowerCase() === currentTab);

  const currentVariation = filteredVariations[currentIndex];
  const CurrentComponent = currentVariation?.component || (() => null);

  const goNext = useCallback(() => {
    setCurrentIndex(prev => (prev + 1) % filteredVariations.length);
  }, [filteredVariations.length]);

  const goPrev = useCallback(() => {
    setCurrentIndex(prev => (prev - 1 + filteredVariations.length) % filteredVariations.length);
  }, [filteredVariations.length]);

  const toggleFavorite = () => {
    if (!currentVariation) return;
    if (favorites.includes(currentVariation.id)) {
      setFavorites(prev => prev.filter(id => id !== currentVariation.id));
    } else {
      setFavorites(prev => [...prev, currentVariation.id]);
    }
  };

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'ArrowRight') goNext();
      if (e.key === 'ArrowLeft') goPrev();
      if (e.key === 'f' || e.key === 'F') toggleFavorite();
      if (e.key === 'm' || e.key === 'M') setIsMinimized(prev => !prev);
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [goNext, goPrev]);

  // Reset index when tab changes
  useEffect(() => {
    setCurrentIndex(0);
  }, [currentTab]);

  return (
    <div className="jlp">
      <style>{styles}</style>

      {/* Preview Area */}
      <div className="jlp-preview" key={currentVariation?.id}>
        <CurrentComponent />
      </div>

      {/* Picker Panel */}
      <div className={`jlp-picker ${isMinimized ? 'jlp-picker--minimized' : ''}`}>
        {/* Collapsed Bar */}
        <div className="jlp-picker__collapsed" onClick={() => setIsMinimized(false)}>
          <span className="jlp-picker__collapsed-name">{currentVariation?.name}</span>
          <span className="jlp-picker__collapsed-counter">{currentIndex + 1}/{filteredVariations.length}</span>
          <div className="jlp-picker__collapsed-nav">
            <button onClick={(e) => { e.stopPropagation(); goPrev(); }}>←</button>
            <button onClick={(e) => { e.stopPropagation(); goNext(); }}>→</button>
          </div>
        </div>

        {/* Main Panel */}
        <div className="jlp-picker__main">
          <div className="jlp-picker__header">
            <h3>Journey Lines Picker</h3>
            <button onClick={() => setIsMinimized(true)}>−</button>
          </div>

          <div className="jlp-picker__tabs">
            {tabs.map(tab => (
              <button
                key={tab.key}
                className={`jlp-picker__tab ${currentTab === tab.key ? 'active' : ''}`}
                onClick={() => setCurrentTab(tab.key)}
              >
                {tab.label}
              </button>
            ))}
          </div>

          <div className="jlp-picker__content">
            <button className="jlp-picker__nav-btn" onClick={goPrev}>←</button>
            <div className="jlp-picker__info">
              <span className="jlp-picker__category">{currentVariation?.category}</span>
              <span className="jlp-picker__counter">{currentIndex + 1}/{filteredVariations.length}</span>
              <h4 className="jlp-picker__name">{currentVariation?.name}</h4>
              <p className="jlp-picker__desc">{currentVariation?.desc}</p>
            </div>
            <button className="jlp-picker__nav-btn" onClick={goNext}>→</button>
            <button
              className={`jlp-picker__fav ${favorites.includes(currentVariation?.id) ? 'active' : ''}`}
              onClick={toggleFavorite}
            >
              {favorites.includes(currentVariation?.id) ? '★' : '☆'}
            </button>
          </div>

          <div className="jlp-picker__footer">
            <span className="jlp-picker__favs">★ {favorites.length}</span>
            <div className="jlp-picker__hints">
              <span><kbd>←</kbd><kbd>→</kbd> Nav</span>
              <span><kbd>F</kbd> Fav</span>
              <span><kbd>M</kbd> Mini</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ============================================
// STYLES
// ============================================
const styles = `
  @import url('https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@400;500;600;700&family=Share+Tech+Mono&display=swap');

  .jlp {
    min-height: 100vh;
    background: #faf9f6;
    font-family: 'Space Grotesk', sans-serif;
  }

  .jlp-preview {
    min-height: 100vh;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 2rem;
  }

  .jlp-variation {
    width: 100%;
    max-width: 800px;
    background: #fff;
    border-radius: 16px;
    padding: 2rem;
    box-shadow: 0 4px 20px rgba(0,0,0,0.08);
  }

  .jlp-variation--dark {
    background: #1a1a1a;
  }

  .jlp-variation--tall {
    max-width: 500px;
  }

  .jlp-svg {
    width: 100%;
    height: auto;
  }

  .jlp-svg--tall {
    max-height: 600px;
  }

  .jlp-label-center {
    font-family: 'Share Tech Mono', monospace;
    font-size: 10px;
    letter-spacing: 0.1em;
    fill: #1a1a1a;
  }

  .jlp-label {
    font-family: 'Share Tech Mono', monospace;
    font-size: 9px;
    letter-spacing: 0.05em;
    fill: #666;
  }

  .jlp-label-small {
    font-family: 'Share Tech Mono', monospace;
    font-size: 7px;
    letter-spacing: 0.05em;
    fill: #666;
  }

  .jlp-label-tiny {
    font-family: 'Share Tech Mono', monospace;
    font-size: 6px;
    letter-spacing: 0.02em;
    fill: #666;
  }

  .jlp-label-light {
    fill: rgba(255,255,255,0.8);
  }

  .jlp-label-region {
    font-family: 'Space Grotesk', sans-serif;
    font-size: 8px;
    font-weight: 600;
    letter-spacing: 0.05em;
    fill: #fff;
  }

  .jlp-label-radar {
    font-family: 'Share Tech Mono', monospace;
    fill: #0f0;
  }

  .jlp-text {
    text-align: center;
    margin-top: 1.5rem;
    font-size: 0.9rem;
    color: #666;
    font-style: italic;
  }

  .jlp-text--light {
    color: rgba(255,255,255,0.6);
  }

  .jlp-text--radar {
    color: #0f0;
  }

  /* Picker Styles */
  .jlp-picker {
    position: fixed;
    bottom: 20px;
    left: 20px;
    width: 400px;
    background: #fff;
    border-radius: 16px;
    box-shadow: 0 10px 40px rgba(0,0,0,0.15);
    z-index: 1000;
    transition: transform 0.3s ease;
    overflow: hidden;
  }

  .jlp-picker--minimized {
    transform: translateY(calc(100% - 48px));
  }

  .jlp-picker__collapsed {
    display: none;
    height: 48px;
    background: #1a1a1a;
    color: #fff;
    padding: 0 16px;
    align-items: center;
    justify-content: space-between;
    cursor: pointer;
  }

  .jlp-picker--minimized .jlp-picker__collapsed {
    display: flex;
  }

  .jlp-picker__collapsed-name {
    font-weight: 600;
    font-size: 13px;
  }

  .jlp-picker__collapsed-counter {
    font-size: 11px;
    opacity: 0.6;
    margin-left: 12px;
  }

  .jlp-picker__collapsed-nav {
    display: flex;
    gap: 8px;
  }

  .jlp-picker__collapsed-nav button {
    width: 28px;
    height: 28px;
    border: none;
    background: rgba(255,255,255,0.1);
    color: #fff;
    border-radius: 6px;
    cursor: pointer;
  }

  .jlp-picker__main {
    display: block;
  }

  .jlp-picker--minimized .jlp-picker__main {
    display: none;
  }

  .jlp-picker__header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 12px 16px;
    border-bottom: 1px solid #e5e5e5;
  }

  .jlp-picker__header h3 {
    margin: 0;
    font-size: 14px;
    font-weight: 700;
  }

  .jlp-picker__header button {
    width: 28px;
    height: 28px;
    border: 1px solid #e5e5e5;
    background: #fff;
    border-radius: 6px;
    cursor: pointer;
    font-size: 16px;
  }

  .jlp-picker__tabs {
    display: flex;
    gap: 4px;
    padding: 12px;
    background: #f5f5f5;
    border-bottom: 1px solid #e5e5e5;
  }

  .jlp-picker__tab {
    padding: 6px 12px;
    font-size: 11px;
    font-weight: 500;
    background: #fff;
    border: 1px solid #e5e5e5;
    border-radius: 6px;
    cursor: pointer;
    transition: all 0.15s;
  }

  .jlp-picker__tab:hover {
    border-color: #333;
  }

  .jlp-picker__tab.active {
    background: #1a1a1a;
    color: #fff;
    border-color: #1a1a1a;
  }

  .jlp-picker__content {
    padding: 16px;
    display: flex;
    align-items: center;
    gap: 12px;
    position: relative;
  }

  .jlp-picker__nav-btn {
    width: 36px;
    height: 36px;
    border: 1px solid #e5e5e5;
    background: #fff;
    border-radius: 8px;
    cursor: pointer;
    font-size: 16px;
    flex-shrink: 0;
    transition: all 0.15s;
  }

  .jlp-picker__nav-btn:hover {
    background: #1a1a1a;
    color: #fff;
    border-color: #1a1a1a;
  }

  .jlp-picker__info {
    flex: 1;
    text-align: center;
    min-width: 0;
  }

  .jlp-picker__category {
    display: block;
    font-size: 10px;
    font-weight: 600;
    text-transform: uppercase;
    letter-spacing: 0.1em;
    color: #e04a2f;
    margin-bottom: 4px;
  }

  .jlp-picker__counter {
    font-size: 10px;
    color: #999;
  }

  .jlp-picker__name {
    font-size: 14px;
    font-weight: 700;
    margin: 4px 0;
  }

  .jlp-picker__desc {
    font-size: 11px;
    color: #666;
    margin: 0;
  }

  .jlp-picker__fav {
    position: absolute;
    right: 16px;
    top: 50%;
    transform: translateY(-50%);
    width: 36px;
    height: 36px;
    border: 2px solid #e5e5e5;
    background: #fff;
    border-radius: 50%;
    cursor: pointer;
    font-size: 18px;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .jlp-picker__fav:hover {
    border-color: #f59e0b;
    color: #f59e0b;
  }

  .jlp-picker__fav.active {
    background: #f59e0b;
    border-color: #f59e0b;
    color: #fff;
  }

  .jlp-picker__footer {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 12px 16px;
    background: #f5f5f5;
    border-top: 1px solid #e5e5e5;
  }

  .jlp-picker__favs {
    font-size: 12px;
    font-weight: 600;
    color: #f59e0b;
  }

  .jlp-picker__hints {
    display: flex;
    gap: 12px;
    font-size: 10px;
    color: #999;
  }

  .jlp-picker__hints kbd {
    background: #fff;
    border: 1px solid #ddd;
    border-radius: 3px;
    padding: 1px 4px;
    font-family: inherit;
    font-size: 9px;
  }

  @media (max-width: 480px) {
    .jlp-picker {
      left: 10px;
      right: 10px;
      width: auto;
    }
  }
`;

export default JourneyLinesPicker;

/**
 * JOURNEY PICKER - 71 Variations of Destination Visualization
 *
 * Browse different visual approaches to showing HQ Aviation's
 * expedition destinations radiating from Denham.
 *
 * Categories:
 * - Geometric (Radial, Orbital, Compass, Distance)
 * - Artistic (Constellation, Galaxy, Neon, Inkblot, Kaleidoscope, Stained Glass)
 * - Technical (Network, Circuit, Metro, Radar, Blueprint, ATC, Hologram)
 * - Travel (Passport, Boarding Pass, Luggage Tags, Postcards, Ticket Stubs)
 * - Nostalgic (Polaroid, Film, Vinyl, Vintage, Chalkboard, Typewriter)
 * - Interactive (Slot Machine, Cards, Roulette, Card Flip, Dominoes)
 * - Data Viz (Timeline, Weather, Tree Rings, Flight Levels, Waveform)
 * - Dimensional (Globe, Isometric, Hex Grid, Satellite, Topographic)
 * - Navigation (Waypoints, Star Chart, Subway Lines)
 * - Mechanical (Clockwork, Split-Flap)
 * - Whimsical (Bubbles, Origami, Mosaic, Bookshelf, Snow Globe, Lava Lamp)
 * - Games (Crossword, Pinball, Periodic Table, Lego, Fortune Cookies)
 * - Adventure (Climbing Wall, Advent Calendar, Emoji World)
 */

import React, { useState, useEffect, useCallback, useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { Link } from 'react-router-dom';

// ============================================
// DESTINATION DATA
// ============================================

const destinations = [
  { id: 'arctic', name: 'Arctic', distance: '2,500 nm', direction: 'N' },
  { id: 'iceland', name: 'Iceland', distance: '1,200 nm', direction: 'NW' },
  { id: 'morocco', name: 'Morocco', distance: '1,100 nm', direction: 'S' },
  { id: 'norway', name: 'Norway', distance: '650 nm', direction: 'NE' },
  { id: 'alps', name: 'Alps', distance: '500 nm', direction: 'SE' },
  { id: 'greenland', name: 'Greenland', distance: '2,100 nm', direction: 'NW' },
  { id: 'bahamas', name: 'Bahamas', distance: '4,200 nm', direction: 'W' },
  { id: 'costa-rica', name: 'Costa Rica', distance: '5,100 nm', direction: 'SW' },
];

// ============================================
// VARIATION 1: RADIAL BURST (Original Style)
// ============================================

function JourneyRadialBurst() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.3 });

  const points = [
    { x: 200, y: 80, label: 'ARCTIC' },
    { x: 150, y: 200, label: 'ICELAND' },
    { x: 250, y: 320, label: 'MOROCCO' },
    { x: 450, y: 100, label: 'NORWAY' },
    { x: 750, y: 100, label: 'ALPS' },
    { x: 1000, y: 80, label: 'GREENLAND' },
    { x: 1050, y: 200, label: 'BAHAMAS' },
    { x: 950, y: 320, label: 'COSTA RICA' },
  ];

  return (
    <div className="journey-var journey-var--radial" ref={ref}>
      <svg viewBox="0 0 1200 400" preserveAspectRatio="xMidYMid meet">
        {/* Center point - Denham */}
        <circle cx="600" cy="200" r="10" fill="#1a1a1a" />
        <text x="600" y="235" textAnchor="middle" className="journey-var__center-label">DENHAM</text>

        {/* Destination lines and points */}
        {points.map((point, i) => (
          <g key={point.label}>
            <motion.line
              x1="600" y1="200"
              x2={point.x} y2={point.y}
              stroke="#e8e6e2"
              strokeWidth="1"
              strokeDasharray="4 4"
              initial={{ pathLength: 0 }}
              animate={isInView ? { pathLength: 1 } : {}}
              transition={{ duration: 1, delay: i * 0.1 }}
            />
            <motion.circle
              cx={point.x} cy={point.y} r="6"
              fill="#fff"
              stroke="#1a1a1a"
              strokeWidth="2"
              initial={{ scale: 0 }}
              animate={isInView ? { scale: 1 } : {}}
              transition={{ duration: 0.4, delay: 0.8 + i * 0.1 }}
            />
            <motion.text
              x={point.x}
              y={point.y + 22}
              textAnchor="middle"
              className="journey-var__dest-label"
              initial={{ opacity: 0 }}
              animate={isInView ? { opacity: 1 } : {}}
              transition={{ duration: 0.4, delay: 1 + i * 0.1 }}
            >
              {point.label}
            </motion.text>
          </g>
        ))}

        {/* Animated helicopter icon */}
        <motion.g
          initial={{ x: 0, y: 0 }}
          animate={isInView ? { x: [0, 150, 100, 200], y: [0, -80, 20, -50] } : {}}
          transition={{ duration: 4, repeat: Infinity, repeatType: 'reverse' }}
        >
          <image
            href="/assets/images/icons/r66-icon-transparent going right.svg"
            x="585" y="185" width="30" height="30"
          />
        </motion.g>
      </svg>
      <p className="journey-var__caption">From Denham to the ends of the Earth</p>
    </div>
  );
}

// ============================================
// VARIATION 2: ORBITAL RINGS
// ============================================

function JourneyOrbitalRings() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.3 });

  const orbits = [
    { radius: 80, destinations: ['NORWAY', 'ALPS'] },
    { radius: 140, destinations: ['ICELAND', 'MOROCCO'] },
    { radius: 200, destinations: ['ARCTIC', 'GREENLAND', 'BAHAMAS', 'COSTA RICA'] },
  ];

  return (
    <div className="journey-var journey-var--orbital" ref={ref}>
      <svg viewBox="0 0 600 500" preserveAspectRatio="xMidYMid meet">
        {/* Orbital rings */}
        {orbits.map((orbit, i) => (
          <motion.circle
            key={i}
            cx="300" cy="250"
            r={orbit.radius}
            fill="none"
            stroke="#e8e6e2"
            strokeWidth="1"
            strokeDasharray="4 2"
            initial={{ scale: 0, opacity: 0 }}
            animate={isInView ? { scale: 1, opacity: 1 } : {}}
            transition={{ duration: 0.8, delay: i * 0.2 }}
          />
        ))}

        {/* Center - Denham */}
        <motion.circle
          cx="300" cy="250" r="12"
          fill="#1a1a1a"
          initial={{ scale: 0 }}
          animate={isInView ? { scale: 1 } : {}}
          transition={{ duration: 0.5 }}
        />
        <text x="300" y="285" textAnchor="middle" className="journey-var__center-label">DENHAM</text>

        {/* Destinations on orbits */}
        {[
          { x: 380, y: 250, label: 'NORWAY', ring: 1 },
          { x: 220, y: 250, label: 'ALPS', ring: 1 },
          { x: 300, y: 110, label: 'ICELAND', ring: 2 },
          { x: 300, y: 390, label: 'MOROCCO', ring: 2 },
          { x: 120, y: 170, label: 'ARCTIC', ring: 3 },
          { x: 480, y: 170, label: 'GREENLAND', ring: 3 },
          { x: 480, y: 330, label: 'BAHAMAS', ring: 3 },
          { x: 120, y: 330, label: 'COSTA RICA', ring: 3 },
        ].map((dest, i) => (
          <motion.g key={dest.label}>
            <motion.circle
              cx={dest.x} cy={dest.y} r="8"
              fill="#2563eb"
              initial={{ scale: 0 }}
              animate={isInView ? { scale: 1 } : {}}
              transition={{ duration: 0.4, delay: 0.5 + dest.ring * 0.2 + i * 0.05 }}
            />
            <motion.text
              x={dest.x} y={dest.y - 15}
              textAnchor="middle"
              className="journey-var__dest-label journey-var__dest-label--small"
              initial={{ opacity: 0 }}
              animate={isInView ? { opacity: 1 } : {}}
              transition={{ delay: 0.8 + i * 0.1 }}
            >
              {dest.label}
            </motion.text>
          </motion.g>
        ))}

        {/* Distance labels */}
        <text x="385" y="175" className="journey-var__distance-label">500nm</text>
        <text x="445" y="130" className="journey-var__distance-label">1,200nm</text>
        <text x="505" y="85" className="journey-var__distance-label">2,500nm+</text>
      </svg>
      <p className="journey-var__caption">Concentric journeys from our home base</p>
    </div>
  );
}

// ============================================
// VARIATION 3: CONSTELLATION MAP
// ============================================

function JourneyConstellation() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.3 });

  const stars = [
    { x: 300, y: 200, label: 'DENHAM', main: true },
    { x: 150, y: 100, label: 'ARCTIC' },
    { x: 80, y: 220, label: 'ICELAND' },
    { x: 180, y: 350, label: 'MOROCCO' },
    { x: 380, y: 80, label: 'NORWAY' },
    { x: 500, y: 150, label: 'ALPS' },
    { x: 550, y: 280, label: 'GREENLAND' },
    { x: 450, y: 380, label: 'BAHAMAS' },
    { x: 280, y: 400, label: 'COSTA RICA' },
  ];

  const connections = [
    [0, 1], [0, 2], [0, 3], [0, 4], [0, 5], [0, 6], [0, 7], [0, 8],
    [1, 4], [2, 3], [5, 6], [7, 8], [4, 5], [6, 7],
  ];

  return (
    <div className="journey-var journey-var--constellation" ref={ref}>
      <div className="journey-var__stars-bg">
        {[...Array(50)].map((_, i) => (
          <motion.div
            key={i}
            className="journey-var__bg-star"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{ opacity: [0.2, 0.8, 0.2] }}
            transition={{ duration: 2 + Math.random() * 2, repeat: Infinity, delay: Math.random() * 2 }}
          />
        ))}
      </div>
      <svg viewBox="0 0 600 480" preserveAspectRatio="xMidYMid meet">
        {/* Constellation lines */}
        {connections.map(([a, b], i) => (
          <motion.line
            key={i}
            x1={stars[a].x} y1={stars[a].y}
            x2={stars[b].x} y2={stars[b].y}
            stroke="rgba(255,255,255,0.3)"
            strokeWidth="1"
            initial={{ pathLength: 0 }}
            animate={isInView ? { pathLength: 1 } : {}}
            transition={{ duration: 0.5, delay: i * 0.05 }}
          />
        ))}

        {/* Stars */}
        {stars.map((star, i) => (
          <motion.g key={star.label}>
            {star.main ? (
              <>
                <motion.circle
                  cx={star.x} cy={star.y} r="15"
                  fill="none"
                  stroke="#fff"
                  strokeWidth="2"
                  initial={{ scale: 0 }}
                  animate={isInView ? { scale: [1, 1.2, 1] } : {}}
                  transition={{ duration: 2, repeat: Infinity }}
                />
                <motion.circle
                  cx={star.x} cy={star.y} r="8"
                  fill="#fff"
                  initial={{ scale: 0 }}
                  animate={isInView ? { scale: 1 } : {}}
                  transition={{ duration: 0.4, delay: 0.5 }}
                />
              </>
            ) : (
              <motion.circle
                cx={star.x} cy={star.y} r="4"
                fill="#fff"
                initial={{ scale: 0 }}
                animate={isInView ? { scale: 1 } : {}}
                transition={{ duration: 0.3, delay: 0.3 + i * 0.08 }}
              />
            )}
            <motion.text
              x={star.x} y={star.y + (star.main ? 35 : 20)}
              textAnchor="middle"
              className={`journey-var__star-label ${star.main ? 'journey-var__star-label--main' : ''}`}
              initial={{ opacity: 0 }}
              animate={isInView ? { opacity: 1 } : {}}
              transition={{ delay: 0.6 + i * 0.1 }}
            >
              {star.label}
            </motion.text>
          </motion.g>
        ))}
      </svg>
      <p className="journey-var__caption journey-var__caption--light">Navigate by the stars</p>
    </div>
  );
}

// ============================================
// VARIATION 4: FLIGHT PATH NETWORK
// ============================================

function JourneyFlightNetwork() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.3 });

  const nodes = [
    { x: 300, y: 220, label: 'DENHAM', main: true },
    { x: 120, y: 80, label: 'ARCTIC' },
    { x: 80, y: 180, label: 'ICELAND' },
    { x: 150, y: 350, label: 'MOROCCO' },
    { x: 420, y: 80, label: 'NORWAY' },
    { x: 520, y: 180, label: 'ALPS' },
    { x: 550, y: 300, label: 'GREENLAND' },
    { x: 480, y: 400, label: 'BAHAMAS' },
    { x: 200, y: 420, label: 'COSTA RICA' },
  ];

  return (
    <div className="journey-var journey-var--network" ref={ref}>
      <svg viewBox="0 0 600 500" preserveAspectRatio="xMidYMid meet">
        {/* Grid background */}
        <defs>
          <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
            <path d="M 40 0 L 0 0 0 40" fill="none" stroke="#e8e6e2" strokeWidth="0.5" />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#grid)" opacity="0.5" />

        {/* Flight paths with curves */}
        {nodes.slice(1).map((node, i) => {
          const midX = (300 + node.x) / 2;
          const midY = (220 + node.y) / 2 - 30;
          return (
            <motion.path
              key={i}
              d={`M 300 220 Q ${midX} ${midY} ${node.x} ${node.y}`}
              fill="none"
              stroke="#2563eb"
              strokeWidth="2"
              strokeDasharray="8 4"
              initial={{ pathLength: 0 }}
              animate={isInView ? { pathLength: 1 } : {}}
              transition={{ duration: 1, delay: i * 0.15 }}
            />
          );
        })}

        {/* Nodes */}
        {nodes.map((node, i) => (
          <motion.g key={node.label}>
            <motion.rect
              x={node.x - (node.main ? 35 : 25)}
              y={node.y - 12}
              width={node.main ? 70 : 50}
              height="24"
              rx="4"
              fill={node.main ? '#1a1a1a' : '#fff'}
              stroke="#1a1a1a"
              strokeWidth="2"
              initial={{ scale: 0 }}
              animate={isInView ? { scale: 1 } : {}}
              transition={{ duration: 0.4, delay: 0.8 + i * 0.1 }}
            />
            <motion.text
              x={node.x}
              y={node.y + 4}
              textAnchor="middle"
              className={`journey-var__node-label ${node.main ? 'journey-var__node-label--main' : ''}`}
              initial={{ opacity: 0 }}
              animate={isInView ? { opacity: 1 } : {}}
              transition={{ delay: 1 + i * 0.1 }}
            >
              {node.label}
            </motion.text>
          </motion.g>
        ))}

        {/* Airplane icons on paths */}
        {[1, 3, 5].map((idx) => (
          <motion.g
            key={idx}
            initial={{ offsetDistance: '0%' }}
            animate={isInView ? { offsetDistance: '100%' } : {}}
            transition={{ duration: 3, delay: idx * 0.5, repeat: Infinity, repeatDelay: 2 }}
            style={{ offsetPath: `path("M 300 220 Q ${(300 + nodes[idx].x) / 2} ${(220 + nodes[idx].y) / 2 - 30} ${nodes[idx].x} ${nodes[idx].y}")` }}
          >
            <text fontSize="16" fill="#2563eb">✈</text>
          </motion.g>
        ))}
      </svg>
      <p className="journey-var__caption">Connected routes across continents</p>
    </div>
  );
}

// ============================================
// VARIATION 5: COMPASS ROSE
// ============================================

function JourneyCompass() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.3 });

  const directions = [
    { angle: -90, label: 'ARCTIC', dist: 180 },
    { angle: -135, label: 'ICELAND', dist: 160 },
    { angle: 180, label: 'MOROCCO', dist: 150 },
    { angle: -45, label: 'NORWAY', dist: 140 },
    { angle: 45, label: 'ALPS', dist: 130 },
    { angle: -60, label: 'GREENLAND', dist: 190 },
    { angle: 90, label: 'BAHAMAS', dist: 200 },
    { angle: 135, label: 'COSTA RICA', dist: 195 },
  ];

  return (
    <div className="journey-var journey-var--compass" ref={ref}>
      <svg viewBox="0 0 500 500" preserveAspectRatio="xMidYMid meet">
        {/* Compass rose */}
        <defs>
          <linearGradient id="compass-grad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#f5f5f5" />
            <stop offset="100%" stopColor="#e0e0e0" />
          </linearGradient>
        </defs>

        {/* Outer rings */}
        {[200, 160, 120, 80].map((r, i) => (
          <motion.circle
            key={r}
            cx="250" cy="250" r={r}
            fill="none"
            stroke="#e8e6e2"
            strokeWidth={i === 0 ? 2 : 1}
            initial={{ scale: 0 }}
            animate={isInView ? { scale: 1 } : {}}
            transition={{ duration: 0.6, delay: i * 0.1 }}
          />
        ))}

        {/* Cardinal directions */}
        {['N', 'E', 'S', 'W'].map((dir, i) => {
          const angle = i * 90 - 90;
          const x = 250 + Math.cos((angle * Math.PI) / 180) * 220;
          const y = 250 + Math.sin((angle * Math.PI) / 180) * 220;
          return (
            <motion.text
              key={dir}
              x={x} y={y + 5}
              textAnchor="middle"
              className="journey-var__cardinal"
              initial={{ opacity: 0 }}
              animate={isInView ? { opacity: 1 } : {}}
              transition={{ delay: 0.5 + i * 0.1 }}
            >
              {dir}
            </motion.text>
          );
        })}

        {/* Compass needle lines */}
        {[0, 45, 90, 135].map((angle, i) => (
          <motion.line
            key={angle}
            x1={250 + Math.cos((angle * Math.PI) / 180) * 50}
            y1={250 + Math.sin((angle * Math.PI) / 180) * 50}
            x2={250 + Math.cos((angle * Math.PI) / 180) * 200}
            y2={250 + Math.sin((angle * Math.PI) / 180) * 200}
            stroke="#ddd"
            strokeWidth="1"
            initial={{ pathLength: 0 }}
            animate={isInView ? { pathLength: 1 } : {}}
            transition={{ duration: 0.5, delay: 0.3 }}
          />
        ))}
        {[0, 45, 90, 135].map((angle, i) => (
          <motion.line
            key={`neg-${angle}`}
            x1={250 - Math.cos((angle * Math.PI) / 180) * 50}
            y1={250 - Math.sin((angle * Math.PI) / 180) * 50}
            x2={250 - Math.cos((angle * Math.PI) / 180) * 200}
            y2={250 - Math.sin((angle * Math.PI) / 180) * 200}
            stroke="#ddd"
            strokeWidth="1"
            initial={{ pathLength: 0 }}
            animate={isInView ? { pathLength: 1 } : {}}
            transition={{ duration: 0.5, delay: 0.3 }}
          />
        ))}

        {/* Center - Denham */}
        <motion.circle
          cx="250" cy="250" r="20"
          fill="#1a1a1a"
          initial={{ scale: 0 }}
          animate={isInView ? { scale: 1 } : {}}
          transition={{ duration: 0.5, delay: 0.2 }}
        />
        <motion.text
          x="250" y="295"
          textAnchor="middle"
          className="journey-var__center-label"
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : {}}
          transition={{ delay: 0.6 }}
        >
          DENHAM
        </motion.text>

        {/* Destinations */}
        {directions.map((dest, i) => {
          const x = 250 + Math.cos((dest.angle * Math.PI) / 180) * dest.dist;
          const y = 250 + Math.sin((dest.angle * Math.PI) / 180) * dest.dist;
          return (
            <motion.g key={dest.label}>
              <motion.circle
                cx={x} cy={y} r="8"
                fill="#2563eb"
                initial={{ scale: 0 }}
                animate={isInView ? { scale: 1 } : {}}
                transition={{ duration: 0.4, delay: 0.8 + i * 0.1 }}
              />
              <motion.text
                x={x} y={y - 15}
                textAnchor="middle"
                className="journey-var__dest-label journey-var__dest-label--small"
                initial={{ opacity: 0 }}
                animate={isInView ? { opacity: 1 } : {}}
                transition={{ delay: 1 + i * 0.1 }}
              >
                {dest.label}
              </motion.text>
            </motion.g>
          );
        })}
      </svg>
      <p className="journey-var__caption">Every direction leads to adventure</p>
    </div>
  );
}

// ============================================
// VARIATION 6: TIMELINE JOURNEY
// ============================================

function JourneyTimeline() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.3 });

  const expeditions = [
    { year: '2018', dest: 'NORWAY', type: 'Mountain' },
    { year: '2019', dest: 'ICELAND', type: 'Volcanic' },
    { year: '2020', dest: 'ALPS', type: 'Alpine' },
    { year: '2021', dest: 'MOROCCO', type: 'Desert' },
    { year: '2022', dest: 'ARCTIC', type: 'Polar' },
    { year: '2023', dest: 'GREENLAND', type: 'Ice Cap' },
    { year: '2024', dest: 'BAHAMAS', type: 'Tropical' },
    { year: '2025', dest: 'COSTA RICA', type: 'Rainforest' },
  ];

  return (
    <div className="journey-var journey-var--timeline" ref={ref}>
      <div className="journey-var__timeline-track">
        <motion.div
          className="journey-var__timeline-line"
          initial={{ scaleX: 0 }}
          animate={isInView ? { scaleX: 1 } : {}}
          transition={{ duration: 1.5, ease: 'easeOut' }}
        />
        <div className="journey-var__timeline-items">
          {expeditions.map((exp, i) => (
            <motion.div
              key={exp.dest}
              className="journey-var__timeline-item"
              initial={{ opacity: 0, y: 30 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: 0.3 + i * 0.15 }}
            >
              <div className="journey-var__timeline-dot" />
              <div className="journey-var__timeline-year">{exp.year}</div>
              <div className="journey-var__timeline-dest">{exp.dest}</div>
              <div className="journey-var__timeline-type">{exp.type}</div>
            </motion.div>
          ))}
        </div>
      </div>
      <div className="journey-var__timeline-start">
        <span className="journey-var__timeline-home">DENHAM</span>
        <span className="journey-var__timeline-subtitle">Home Base</span>
      </div>
      <p className="journey-var__caption">A decade of extraordinary expeditions</p>
    </div>
  );
}

// ============================================
// VARIATION 7: GLOBE 3D EFFECT
// ============================================

function JourneyGlobe() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.3 });

  const pins = [
    { x: 55, y: 25, label: 'ARCTIC' },
    { x: 40, y: 35, label: 'ICELAND' },
    { x: 50, y: 75, label: 'MOROCCO' },
    { x: 55, y: 30, label: 'NORWAY' },
    { x: 60, y: 45, label: 'ALPS' },
    { x: 30, y: 20, label: 'GREENLAND' },
    { x: 25, y: 55, label: 'BAHAMAS' },
    { x: 20, y: 65, label: 'COSTA RICA' },
  ];

  return (
    <div className="journey-var journey-var--globe" ref={ref}>
      <div className="journey-var__globe-container">
        <motion.div
          className="journey-var__globe-sphere"
          initial={{ scale: 0, rotateY: -180 }}
          animate={isInView ? { scale: 1, rotateY: 0 } : {}}
          transition={{ duration: 1.2, ease: 'easeOut' }}
        >
          {/* Grid lines */}
          <div className="journey-var__globe-grid">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="journey-var__globe-lat" style={{ top: `${15 + i * 14}%` }} />
            ))}
            {[...Array(8)].map((_, i) => (
              <div key={i} className="journey-var__globe-long" style={{ left: `${10 + i * 10}%` }} />
            ))}
          </div>

          {/* Denham marker */}
          <motion.div
            className="journey-var__globe-pin journey-var__globe-pin--main"
            style={{ left: '52%', top: '38%' }}
            initial={{ scale: 0 }}
            animate={isInView ? { scale: 1 } : {}}
            transition={{ delay: 1 }}
          >
            <span className="journey-var__globe-pin-label">DENHAM</span>
          </motion.div>

          {/* Destination pins */}
          {pins.map((pin, i) => (
            <motion.div
              key={pin.label}
              className="journey-var__globe-pin"
              style={{ left: `${pin.x}%`, top: `${pin.y}%` }}
              initial={{ scale: 0 }}
              animate={isInView ? { scale: 1 } : {}}
              transition={{ delay: 1.2 + i * 0.1 }}
            >
              <span className="journey-var__globe-pin-dot" />
              <span className="journey-var__globe-pin-label">{pin.label}</span>
            </motion.div>
          ))}
        </motion.div>

        {/* Rotating highlight */}
        <motion.div
          className="journey-var__globe-highlight"
          animate={{ rotate: 360 }}
          transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
        />
      </div>
      <p className="journey-var__caption">Worldwide helicopter expeditions</p>
    </div>
  );
}

// ============================================
// VARIATION 8: HEXAGONAL GRID
// ============================================

function JourneyHexGrid() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.3 });

  const hexDests = [
    { col: 2, row: 0, label: 'ARCTIC', color: '#60a5fa' },
    { col: 0, row: 1, label: 'ICELAND', color: '#34d399' },
    { col: 1, row: 2, label: 'MOROCCO', color: '#fbbf24' },
    { col: 3, row: 0, label: 'NORWAY', color: '#a78bfa' },
    { col: 4, row: 1, label: 'ALPS', color: '#f472b6' },
    { col: 3, row: 2, label: 'GREENLAND', color: '#38bdf8' },
    { col: 4, row: 2, label: 'BAHAMAS', color: '#fb923c' },
    { col: 2, row: 3, label: 'COSTA RICA', color: '#4ade80' },
  ];

  return (
    <div className="journey-var journey-var--hexgrid" ref={ref}>
      <div className="journey-var__hex-container">
        {/* Center hex - Denham */}
        <motion.div
          className="journey-var__hex journey-var__hex--main"
          style={{ gridColumn: 3, gridRow: 2 }}
          initial={{ scale: 0, rotate: -30 }}
          animate={isInView ? { scale: 1, rotate: 0 } : {}}
          transition={{ duration: 0.5 }}
        >
          <div className="journey-var__hex-inner">
            <span className="journey-var__hex-label">DENHAM</span>
            <span className="journey-var__hex-sub">HOME</span>
          </div>
        </motion.div>

        {/* Destination hexes */}
        {hexDests.map((hex, i) => (
          <motion.div
            key={hex.label}
            className="journey-var__hex"
            style={{
              gridColumn: hex.col + 1,
              gridRow: hex.row + 1,
              '--hex-color': hex.color,
            }}
            initial={{ scale: 0, rotate: -30 }}
            animate={isInView ? { scale: 1, rotate: 0 } : {}}
            transition={{ duration: 0.4, delay: 0.3 + i * 0.1 }}
          >
            <div className="journey-var__hex-inner">
              <span className="journey-var__hex-label">{hex.label}</span>
            </div>
          </motion.div>
        ))}

        {/* Connection lines */}
        <svg className="journey-var__hex-lines" viewBox="0 0 500 400">
          {hexDests.map((hex, i) => {
            const startX = 250;
            const startY = 180;
            const hexW = 90;
            const hexH = 80;
            const endX = (hex.col + 0.5) * hexW + (hex.row % 2 === 1 ? hexW / 2 : 0);
            const endY = (hex.row + 0.5) * hexH;
            return (
              <motion.line
                key={i}
                x1={startX} y1={startY}
                x2={endX} y2={endY}
                stroke="#e8e6e2"
                strokeWidth="2"
                initial={{ pathLength: 0 }}
                animate={isInView ? { pathLength: 1 } : {}}
                transition={{ duration: 0.6, delay: 0.5 + i * 0.08 }}
              />
            );
          })}
        </svg>
      </div>
      <p className="journey-var__caption">Your flight path options</p>
    </div>
  );
}

// ============================================
// VARIATION 9: DISTANCE RINGS
// ============================================

function JourneyDistanceRings() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.3 });

  const ringData = [
    { distance: '500nm', radius: 60, dests: [{ angle: 45, label: 'ALPS' }, { angle: -45, label: 'NORWAY' }] },
    { distance: '1,200nm', radius: 110, dests: [{ angle: -90, label: 'ICELAND' }, { angle: 180, label: 'MOROCCO' }] },
    { distance: '2,500nm', radius: 160, dests: [{ angle: -70, label: 'ARCTIC' }, { angle: -30, label: 'GREENLAND' }] },
    { distance: '5,000nm+', radius: 200, dests: [{ angle: 100, label: 'BAHAMAS' }, { angle: 150, label: 'COSTA RICA' }] },
  ];

  return (
    <div className="journey-var journey-var--distance" ref={ref}>
      <svg viewBox="0 0 500 450" preserveAspectRatio="xMidYMid meet">
        {/* Distance rings */}
        {ringData.map((ring, i) => (
          <g key={ring.distance}>
            <motion.circle
              cx="250" cy="225"
              r={ring.radius}
              fill="none"
              stroke={`rgba(37, 99, 235, ${0.15 + i * 0.1})`}
              strokeWidth="20"
              initial={{ scale: 0 }}
              animate={isInView ? { scale: 1 } : {}}
              transition={{ duration: 0.6, delay: i * 0.15 }}
            />
            <motion.text
              x={250 + ring.radius + 15}
              y="230"
              className="journey-var__ring-label"
              initial={{ opacity: 0 }}
              animate={isInView ? { opacity: 1 } : {}}
              transition={{ delay: 0.5 + i * 0.15 }}
            >
              {ring.distance}
            </motion.text>
          </g>
        ))}

        {/* Center - Denham */}
        <motion.circle
          cx="250" cy="225" r="25"
          fill="#1a1a1a"
          initial={{ scale: 0 }}
          animate={isInView ? { scale: 1 } : {}}
          transition={{ duration: 0.5 }}
        />
        <motion.text
          x="250" y="230"
          textAnchor="middle"
          fill="#fff"
          className="journey-var__center-label--white"
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : {}}
          transition={{ delay: 0.4 }}
        >
          HQ
        </motion.text>

        {/* Destinations on rings */}
        {ringData.flatMap((ring, ri) =>
          ring.dests.map((dest, di) => {
            const x = 250 + Math.cos((dest.angle * Math.PI) / 180) * ring.radius;
            const y = 225 + Math.sin((dest.angle * Math.PI) / 180) * ring.radius;
            return (
              <motion.g key={dest.label}>
                <motion.circle
                  cx={x} cy={y} r="10"
                  fill="#fff"
                  stroke="#1a1a1a"
                  strokeWidth="3"
                  initial={{ scale: 0 }}
                  animate={isInView ? { scale: 1 } : {}}
                  transition={{ duration: 0.4, delay: 0.8 + ri * 0.15 + di * 0.05 }}
                />
                <motion.text
                  x={x} y={y - 18}
                  textAnchor="middle"
                  className="journey-var__dest-label"
                  initial={{ opacity: 0 }}
                  animate={isInView ? { opacity: 1 } : {}}
                  transition={{ delay: 1 + ri * 0.15 + di * 0.05 }}
                >
                  {dest.label}
                </motion.text>
              </motion.g>
            );
          })
        )}
      </svg>
      <p className="journey-var__caption">Range knows no limits</p>
    </div>
  );
}

// ============================================
// VARIATION 10: DEPARTURE BOARD
// ============================================

function JourneyDepartureBoard() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.3 });

  const flights = [
    { code: 'HQ-001', dest: 'ARCTIC', status: 'COMPLETED', distance: '2,500nm', year: '2022' },
    { code: 'HQ-002', dest: 'ICELAND', status: 'COMPLETED', distance: '1,200nm', year: '2019' },
    { code: 'HQ-003', dest: 'MOROCCO', status: 'COMPLETED', distance: '1,100nm', year: '2021' },
    { code: 'HQ-004', dest: 'NORWAY', status: 'COMPLETED', distance: '650nm', year: '2018' },
    { code: 'HQ-005', dest: 'ALPS', status: 'COMPLETED', distance: '500nm', year: '2020' },
    { code: 'HQ-006', dest: 'GREENLAND', status: 'COMPLETED', distance: '2,100nm', year: '2023' },
    { code: 'HQ-007', dest: 'BAHAMAS', status: 'SCHEDULED', distance: '4,200nm', year: '2025' },
    { code: 'HQ-008', dest: 'COSTA RICA', status: 'PLANNING', distance: '5,100nm', year: '2026' },
  ];

  return (
    <div className="journey-var journey-var--board" ref={ref}>
      <div className="journey-var__board">
        <div className="journey-var__board-header">
          <span className="journey-var__board-title">HQ AVIATION EXPEDITIONS</span>
          <span className="journey-var__board-origin">DEPARTURES FROM DENHAM</span>
        </div>
        <div className="journey-var__board-cols">
          <span>FLIGHT</span>
          <span>DESTINATION</span>
          <span>DISTANCE</span>
          <span>STATUS</span>
        </div>
        <div className="journey-var__board-rows">
          {flights.map((flight, i) => (
            <motion.div
              key={flight.code}
              className="journey-var__board-row"
              initial={{ opacity: 0, x: -20 }}
              animate={isInView ? { opacity: 1, x: 0 } : {}}
              transition={{ duration: 0.4, delay: 0.2 + i * 0.1 }}
            >
              <span className="journey-var__board-code">{flight.code}</span>
              <span className="journey-var__board-dest">{flight.dest}</span>
              <span className="journey-var__board-dist">{flight.distance}</span>
              <span className={`journey-var__board-status journey-var__board-status--${flight.status.toLowerCase()}`}>
                {flight.status}
              </span>
            </motion.div>
          ))}
        </div>
      </div>
      <p className="journey-var__caption">Expedition flight manifest</p>
    </div>
  );
}

// ============================================
// VARIATION 11: RADAR SWEEP
// ============================================

function JourneyRadar() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.3 });

  const blips = [
    { angle: -70, dist: 80, label: 'ALPS' },
    { angle: -30, dist: 70, label: 'NORWAY' },
    { angle: 30, dist: 90, label: 'ICELAND' },
    { angle: 70, dist: 85, label: 'ARCTIC' },
    { angle: 110, dist: 95, label: 'GREENLAND' },
    { angle: 150, dist: 75, label: 'MOROCCO' },
    { angle: -110, dist: 100, label: 'BAHAMAS' },
    { angle: -150, dist: 95, label: 'COSTA RICA' },
  ];

  return (
    <div className="journey-var journey-var--radar" ref={ref}>
      <div className="journey-var__radar-screen">
        <div className="journey-var__radar-grid">
          {[1, 2, 3, 4].map(i => (
            <div key={i} className="journey-var__radar-ring" style={{ width: `${i * 25}%`, height: `${i * 25}%` }} />
          ))}
          <div className="journey-var__radar-cross" />
        </div>

        <motion.div
          className="journey-var__radar-sweep"
          animate={{ rotate: 360 }}
          transition={{ duration: 4, repeat: Infinity, ease: 'linear' }}
        />

        <div className="journey-var__radar-center">
          <span>HQ</span>
        </div>

        {blips.map((blip, i) => {
          const x = 50 + Math.cos((blip.angle * Math.PI) / 180) * (blip.dist / 2);
          const y = 50 + Math.sin((blip.angle * Math.PI) / 180) * (blip.dist / 2);
          return (
            <motion.div
              key={blip.label}
              className="journey-var__radar-blip"
              style={{ left: `${x}%`, top: `${y}%` }}
              initial={{ scale: 0, opacity: 0 }}
              animate={isInView ? { scale: [0, 1.5, 1], opacity: [0, 1, 0.8] } : {}}
              transition={{ duration: 0.5, delay: 0.5 + i * 0.15, repeat: Infinity, repeatDelay: 3 }}
            >
              <span className="journey-var__radar-blip-label">{blip.label}</span>
            </motion.div>
          );
        })}
      </div>
      <p className="journey-var__caption journey-var__caption--light">Tracking expeditions worldwide</p>
    </div>
  );
}

// ============================================
// VARIATION 12: METRO MAP
// ============================================

function JourneyMetro() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.3 });

  const lines = [
    { color: '#ef4444', stops: ['DENHAM', 'NORWAY', 'ARCTIC'] },
    { color: '#3b82f6', stops: ['DENHAM', 'ALPS', 'MOROCCO'] },
    { color: '#22c55e', stops: ['DENHAM', 'ICELAND', 'GREENLAND'] },
    { color: '#f59e0b', stops: ['DENHAM', 'BAHAMAS', 'COSTA RICA'] },
  ];

  return (
    <div className="journey-var journey-var--metro" ref={ref}>
      <div className="journey-var__metro-header">
        <span className="journey-var__metro-logo">HQ</span>
        <span className="journey-var__metro-title">EXPEDITION ROUTES</span>
      </div>
      <div className="journey-var__metro-map">
        {lines.map((line, li) => (
          <motion.div
            key={li}
            className="journey-var__metro-line"
            style={{ '--line-color': line.color }}
            initial={{ opacity: 0 }}
            animate={isInView ? { opacity: 1 } : {}}
            transition={{ delay: li * 0.2 }}
          >
            {line.stops.map((stop, si) => (
              <motion.div
                key={stop}
                className={`journey-var__metro-stop ${stop === 'DENHAM' ? 'journey-var__metro-stop--main' : ''}`}
                initial={{ scale: 0 }}
                animate={isInView ? { scale: 1 } : {}}
                transition={{ delay: 0.3 + li * 0.2 + si * 0.1 }}
              >
                <div className="journey-var__metro-dot" />
                <span className="journey-var__metro-name">{stop}</span>
              </motion.div>
            ))}
          </motion.div>
        ))}
      </div>
      <div className="journey-var__metro-legend">
        {lines.map((line, i) => (
          <div key={i} className="journey-var__metro-legend-item">
            <span className="journey-var__metro-legend-color" style={{ background: line.color }} />
            <span>Line {i + 1}</span>
          </div>
        ))}
      </div>
      <p className="journey-var__caption">Your route to adventure</p>
    </div>
  );
}

// ============================================
// VARIATION 13: POLAROID GRID
// ============================================

function JourneyPolaroids() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.3 });

  const photos = [
    { label: 'ARCTIC', rotate: -5, color: '#bfdbfe' },
    { label: 'ICELAND', rotate: 3, color: '#a7f3d0' },
    { label: 'NORWAY', rotate: -2, color: '#c4b5fd' },
    { label: 'ALPS', rotate: 4, color: '#fde68a' },
    { label: 'DENHAM', rotate: 0, color: '#1a1a1a', main: true },
    { label: 'MOROCCO', rotate: -3, color: '#fed7aa' },
    { label: 'GREENLAND', rotate: 2, color: '#99f6e4' },
    { label: 'BAHAMAS', rotate: -4, color: '#fecaca' },
    { label: 'COSTA RICA', rotate: 5, color: '#bbf7d0' },
  ];

  return (
    <div className="journey-var journey-var--polaroids" ref={ref}>
      <div className="journey-var__polaroid-grid">
        {photos.map((photo, i) => (
          <motion.div
            key={photo.label}
            className={`journey-var__polaroid ${photo.main ? 'journey-var__polaroid--main' : ''}`}
            style={{ '--rotate': `${photo.rotate}deg` }}
            initial={{ opacity: 0, y: 50, rotate: photo.rotate - 10 }}
            animate={isInView ? { opacity: 1, y: 0, rotate: photo.rotate } : {}}
            transition={{ duration: 0.6, delay: i * 0.1 }}
            whileHover={{ scale: 1.1, rotate: 0, zIndex: 10 }}
          >
            <div className="journey-var__polaroid-img" style={{ background: photo.color }}>
              {photo.main && <span className="journey-var__polaroid-icon">✈</span>}
            </div>
            <span className="journey-var__polaroid-label">{photo.label}</span>
          </motion.div>
        ))}
      </div>
      <p className="journey-var__caption">Memories from every expedition</p>
    </div>
  );
}

// ============================================
// VARIATION 14: PINBOARD
// ============================================

function JourneyPinboard() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.3 });

  const pins = [
    { x: 50, y: 45, label: 'DENHAM', main: true },
    { x: 25, y: 20, label: 'ARCTIC' },
    { x: 15, y: 45, label: 'ICELAND' },
    { x: 30, y: 75, label: 'MOROCCO' },
    { x: 65, y: 15, label: 'NORWAY' },
    { x: 80, y: 35, label: 'ALPS' },
    { x: 85, y: 60, label: 'GREENLAND' },
    { x: 75, y: 80, label: 'BAHAMAS' },
    { x: 45, y: 85, label: 'COSTA RICA' },
  ];

  return (
    <div className="journey-var journey-var--pinboard" ref={ref}>
      <div className="journey-var__cork">
        <svg className="journey-var__strings" viewBox="0 0 100 100" preserveAspectRatio="none">
          {pins.slice(1).map((pin, i) => (
            <motion.line
              key={i}
              x1={pins[0].x} y1={pins[0].y}
              x2={pin.x} y2={pin.y}
              stroke="#dc2626"
              strokeWidth="0.3"
              initial={{ pathLength: 0 }}
              animate={isInView ? { pathLength: 1 } : {}}
              transition={{ duration: 0.8, delay: 0.5 + i * 0.1 }}
            />
          ))}
        </svg>

        {pins.map((pin, i) => (
          <motion.div
            key={pin.label}
            className={`journey-var__pin ${pin.main ? 'journey-var__pin--main' : ''}`}
            style={{ left: `${pin.x}%`, top: `${pin.y}%` }}
            initial={{ scale: 0 }}
            animate={isInView ? { scale: 1 } : {}}
            transition={{ type: 'spring', delay: i * 0.1 }}
          >
            <div className="journey-var__pin-head" />
            <span className="journey-var__pin-label">{pin.label}</span>
          </motion.div>
        ))}
      </div>
      <p className="journey-var__caption">Planning the next adventure</p>
    </div>
  );
}

// ============================================
// VARIATION 15: PLAYING CARDS
// ============================================

function JourneyCards() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.3 });

  const cards = [
    { label: 'DENHAM', suit: '♠', value: 'A', color: '#1a1a1a' },
    { label: 'ARCTIC', suit: '♦', value: 'K', color: '#ef4444' },
    { label: 'ICELAND', suit: '♣', value: 'Q', color: '#1a1a1a' },
    { label: 'NORWAY', suit: '♥', value: 'J', color: '#ef4444' },
    { label: 'ALPS', suit: '♠', value: '10', color: '#1a1a1a' },
    { label: 'MOROCCO', suit: '♦', value: '9', color: '#ef4444' },
    { label: 'GREENLAND', suit: '♣', value: '8', color: '#1a1a1a' },
    { label: 'BAHAMAS', suit: '♥', value: '7', color: '#ef4444' },
  ];

  return (
    <div className="journey-var journey-var--cards" ref={ref}>
      <div className="journey-var__card-fan">
        {cards.map((card, i) => (
          <motion.div
            key={card.label}
            className="journey-var__card"
            style={{ '--card-index': i, '--card-color': card.color }}
            initial={{ opacity: 0, y: 100, rotate: -20 }}
            animate={isInView ? {
              opacity: 1,
              y: 0,
              rotate: (i - 3.5) * 8,
              x: (i - 3.5) * 30
            } : {}}
            transition={{ duration: 0.5, delay: i * 0.1 }}
            whileHover={{ y: -20, scale: 1.05 }}
          >
            <div className="journey-var__card-corner journey-var__card-corner--top">
              <span className="journey-var__card-value">{card.value}</span>
              <span className="journey-var__card-suit">{card.suit}</span>
            </div>
            <div className="journey-var__card-center">
              <span className="journey-var__card-dest">{card.label}</span>
            </div>
            <div className="journey-var__card-corner journey-var__card-corner--bottom">
              <span className="journey-var__card-value">{card.value}</span>
              <span className="journey-var__card-suit">{card.suit}</span>
            </div>
          </motion.div>
        ))}
      </div>
      <p className="journey-var__caption">Deal yourself an adventure</p>
    </div>
  );
}

// ============================================
// VARIATION 16: FILM STRIP
// ============================================

function JourneyFilmStrip() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.3 });

  const frames = [
    { label: 'ARCTIC', year: '22' },
    { label: 'ICELAND', year: '19' },
    { label: 'NORWAY', year: '18' },
    { label: 'DENHAM', year: 'HQ', main: true },
    { label: 'ALPS', year: '20' },
    { label: 'MOROCCO', year: '21' },
    { label: 'GREENLAND', year: '23' },
    { label: 'BAHAMAS', year: '25' },
  ];

  return (
    <div className="journey-var journey-var--film" ref={ref}>
      <motion.div
        className="journey-var__film-strip"
        initial={{ x: '100%' }}
        animate={isInView ? { x: 0 } : {}}
        transition={{ duration: 1.5, ease: 'easeOut' }}
      >
        <div className="journey-var__film-perfs journey-var__film-perfs--top">
          {[...Array(20)].map((_, i) => <div key={i} className="journey-var__film-perf" />)}
        </div>
        <div className="journey-var__film-frames">
          {frames.map((frame, i) => (
            <motion.div
              key={frame.label}
              className={`journey-var__film-frame ${frame.main ? 'journey-var__film-frame--main' : ''}`}
              initial={{ opacity: 0 }}
              animate={isInView ? { opacity: 1 } : {}}
              transition={{ delay: 0.8 + i * 0.1 }}
            >
              <div className="journey-var__film-img">
                {frame.main ? '✈' : '🌍'}
              </div>
              <span className="journey-var__film-label">{frame.label}</span>
              <span className="journey-var__film-year">{frame.year}</span>
            </motion.div>
          ))}
        </div>
        <div className="journey-var__film-perfs journey-var__film-perfs--bottom">
          {[...Array(20)].map((_, i) => <div key={i} className="journey-var__film-perf" />)}
        </div>
      </motion.div>
      <p className="journey-var__caption">Every frame tells a story</p>
    </div>
  );
}

// ============================================
// VARIATION 17: PASSPORT STAMPS
// ============================================

function JourneyPassport() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.3 });

  const stamps = [
    { label: 'ARCTIC', date: '15 MAR 2022', shape: 'circle', color: '#1e40af' },
    { label: 'ICELAND', date: '22 JUN 2019', shape: 'rect', color: '#166534' },
    { label: 'MOROCCO', date: '08 NOV 2021', shape: 'circle', color: '#b45309' },
    { label: 'NORWAY', date: '03 FEB 2018', shape: 'rect', color: '#7c2d12' },
    { label: 'ALPS', date: '19 SEP 2020', shape: 'circle', color: '#4c1d95' },
    { label: 'GREENLAND', date: '11 JUL 2023', shape: 'rect', color: '#0f766e' },
    { label: 'BAHAMAS', date: '25 DEC 2024', shape: 'circle', color: '#9f1239' },
    { label: 'COSTA RICA', date: '30 APR 2025', shape: 'rect', color: '#065f46' },
  ];

  return (
    <div className="journey-var journey-var--passport" ref={ref}>
      <div className="journey-var__passport-page">
        <div className="journey-var__passport-header">
          <span>EXPEDITION RECORD</span>
          <span>HQ AVIATION • DENHAM</span>
        </div>
        <div className="journey-var__stamps">
          {stamps.map((stamp, i) => (
            <motion.div
              key={stamp.label}
              className={`journey-var__stamp journey-var__stamp--${stamp.shape}`}
              style={{ '--stamp-color': stamp.color, '--stamp-rotate': `${(Math.random() - 0.5) * 30}deg` }}
              initial={{ scale: 2, opacity: 0, rotate: -45 }}
              animate={isInView ? { scale: 1, opacity: 0.85, rotate: (Math.random() - 0.5) * 20 } : {}}
              transition={{ duration: 0.3, delay: 0.3 + i * 0.15 }}
            >
              <span className="journey-var__stamp-dest">{stamp.label}</span>
              <span className="journey-var__stamp-date">{stamp.date}</span>
              <span className="journey-var__stamp-approved">✓ CLEARED</span>
            </motion.div>
          ))}
        </div>
      </div>
      <p className="journey-var__caption">Stamps of extraordinary journeys</p>
    </div>
  );
}

// ============================================
// VARIATION 18: SPIRAL GALAXY
// ============================================

function JourneyGalaxy() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.3 });

  const stars = [
    { angle: 0, dist: 0, label: 'DENHAM', main: true },
    { angle: 45, dist: 50, label: 'ALPS' },
    { angle: 90, dist: 70, label: 'NORWAY' },
    { angle: 135, dist: 90, label: 'ICELAND' },
    { angle: 180, dist: 110, label: 'ARCTIC' },
    { angle: 225, dist: 130, label: 'GREENLAND' },
    { angle: 270, dist: 150, label: 'MOROCCO' },
    { angle: 315, dist: 170, label: 'BAHAMAS' },
    { angle: 360, dist: 190, label: 'COSTA RICA' },
  ];

  return (
    <div className="journey-var journey-var--galaxy" ref={ref}>
      <div className="journey-var__galaxy-bg">
        {[...Array(100)].map((_, i) => (
          <motion.div
            key={i}
            className="journey-var__galaxy-star"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              width: `${1 + Math.random() * 2}px`,
              height: `${1 + Math.random() * 2}px`,
            }}
            animate={{ opacity: [0.3, 1, 0.3] }}
            transition={{ duration: 1 + Math.random() * 3, repeat: Infinity, delay: Math.random() * 2 }}
          />
        ))}
      </div>

      <motion.div
        className="journey-var__galaxy-arms"
        animate={{ rotate: 360 }}
        transition={{ duration: 60, repeat: Infinity, ease: 'linear' }}
      >
        {[0, 1, 2].map(arm => (
          <div key={arm} className="journey-var__galaxy-arm" style={{ '--arm-offset': arm * 120 }} />
        ))}
      </motion.div>

      <svg className="journey-var__galaxy-svg" viewBox="0 0 400 400">
        {stars.map((star, i) => {
          const spiralAngle = star.angle + star.dist * 0.5;
          const x = 200 + Math.cos((spiralAngle * Math.PI) / 180) * star.dist;
          const y = 200 + Math.sin((spiralAngle * Math.PI) / 180) * star.dist;
          return (
            <motion.g key={star.label}>
              <motion.circle
                cx={x} cy={y}
                r={star.main ? 12 : 6}
                fill={star.main ? '#fbbf24' : '#fff'}
                initial={{ scale: 0 }}
                animate={isInView ? { scale: 1 } : {}}
                transition={{ delay: 0.5 + i * 0.15 }}
              />
              <motion.text
                x={x} y={y + (star.main ? 25 : 18)}
                textAnchor="middle"
                className="journey-var__galaxy-label"
                initial={{ opacity: 0 }}
                animate={isInView ? { opacity: 1 } : {}}
                transition={{ delay: 0.7 + i * 0.15 }}
              >
                {star.label}
              </motion.text>
            </motion.g>
          );
        })}
      </svg>
      <p className="journey-var__caption journey-var__caption--light">Explore the universe of destinations</p>
    </div>
  );
}

// ============================================
// VARIATION 19: TREE RINGS
// ============================================

function JourneyTreeRings() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.3 });

  const rings = [
    { year: '2018', dest: 'NORWAY', radius: 40 },
    { year: '2019', dest: 'ICELAND', radius: 60 },
    { year: '2020', dest: 'ALPS', radius: 80 },
    { year: '2021', dest: 'MOROCCO', radius: 100 },
    { year: '2022', dest: 'ARCTIC', radius: 120 },
    { year: '2023', dest: 'GREENLAND', radius: 140 },
    { year: '2024', dest: 'BAHAMAS', radius: 160 },
    { year: '2025', dest: 'COSTA RICA', radius: 180 },
  ];

  return (
    <div className="journey-var journey-var--tree" ref={ref}>
      <svg viewBox="0 0 400 400" preserveAspectRatio="xMidYMid meet">
        <defs>
          <linearGradient id="wood-grain" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#d4a574" />
            <stop offset="50%" stopColor="#c4956a" />
            <stop offset="100%" stopColor="#b8865c" />
          </linearGradient>
        </defs>

        <circle cx="200" cy="200" r="195" fill="url(#wood-grain)" />

        {rings.map((ring, i) => (
          <motion.g key={ring.year}>
            <motion.circle
              cx="200" cy="200"
              r={ring.radius}
              fill="none"
              stroke="#8b6914"
              strokeWidth="2"
              opacity="0.6"
              initial={{ scale: 0 }}
              animate={isInView ? { scale: 1 } : {}}
              transition={{ duration: 0.5, delay: i * 0.1 }}
            />
            <motion.text
              x={200 + ring.radius - 5}
              y={205}
              className="journey-var__tree-year"
              initial={{ opacity: 0 }}
              animate={isInView ? { opacity: 1 } : {}}
              transition={{ delay: 0.5 + i * 0.1 }}
            >
              {ring.year}
            </motion.text>
            <motion.text
              x={200}
              y={200 - ring.radius + 15}
              textAnchor="middle"
              className="journey-var__tree-dest"
              initial={{ opacity: 0 }}
              animate={isInView ? { opacity: 1 } : {}}
              transition={{ delay: 0.6 + i * 0.1 }}
            >
              {ring.dest}
            </motion.text>
          </motion.g>
        ))}

        <motion.circle
          cx="200" cy="200" r="20"
          fill="#5c3d1e"
          initial={{ scale: 0 }}
          animate={isInView ? { scale: 1 } : {}}
          transition={{ duration: 0.5 }}
        />
        <motion.text
          x="200" y="205"
          textAnchor="middle"
          fill="#fff"
          className="journey-var__tree-center"
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : {}}
          transition={{ delay: 0.3 }}
        >
          HQ
        </motion.text>
      </svg>
      <p className="journey-var__caption">Growth through exploration</p>
    </div>
  );
}

// ============================================
// VARIATION 20: CIRCUIT BOARD
// ============================================

function JourneyCircuit() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.3 });

  const chips = [
    { x: 50, y: 50, label: 'DENHAM', main: true },
    { x: 20, y: 20, label: 'ARCTIC' },
    { x: 15, y: 50, label: 'ICELAND' },
    { x: 25, y: 80, label: 'MOROCCO' },
    { x: 70, y: 15, label: 'NORWAY' },
    { x: 85, y: 40, label: 'ALPS' },
    { x: 80, y: 70, label: 'GREENLAND' },
    { x: 60, y: 85, label: 'BAHAMAS' },
    { x: 35, y: 90, label: 'COSTA RICA' },
  ];

  return (
    <div className="journey-var journey-var--circuit" ref={ref}>
      <div className="journey-var__pcb">
        <svg className="journey-var__traces" viewBox="0 0 100 100" preserveAspectRatio="none">
          {chips.slice(1).map((chip, i) => {
            const midX = (chips[0].x + chip.x) / 2;
            const midY = chips[0].y;
            return (
              <motion.path
                key={i}
                d={`M ${chips[0].x} ${chips[0].y} L ${midX} ${midY} L ${midX} ${chip.y} L ${chip.x} ${chip.y}`}
                fill="none"
                stroke="#22c55e"
                strokeWidth="0.5"
                initial={{ pathLength: 0 }}
                animate={isInView ? { pathLength: 1 } : {}}
                transition={{ duration: 0.8, delay: i * 0.1 }}
              />
            );
          })}
        </svg>

        {chips.map((chip, i) => (
          <motion.div
            key={chip.label}
            className={`journey-var__chip ${chip.main ? 'journey-var__chip--main' : ''}`}
            style={{ left: `${chip.x}%`, top: `${chip.y}%` }}
            initial={{ scale: 0 }}
            animate={isInView ? { scale: 1 } : {}}
            transition={{ type: 'spring', delay: 0.5 + i * 0.08 }}
          >
            <span className="journey-var__chip-label">{chip.label}</span>
            <div className="journey-var__chip-pins">
              {[...Array(4)].map((_, j) => <div key={j} className="journey-var__chip-pin" />)}
            </div>
          </motion.div>
        ))}

        <motion.div
          className="journey-var__circuit-pulse"
          animate={{ opacity: [0.3, 1, 0.3] }}
          transition={{ duration: 2, repeat: Infinity }}
        />
      </div>
      <p className="journey-var__caption">Connected by precision engineering</p>
    </div>
  );
}

// ============================================
// VARIATION 21: LUGGAGE TAGS
// ============================================

function JourneyLuggageTags() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.3 });

  const tags = [
    { label: 'ARCTIC', code: 'ARC', color: '#bfdbfe' },
    { label: 'ICELAND', code: 'ICE', color: '#bbf7d0' },
    { label: 'NORWAY', code: 'NOR', color: '#ddd6fe' },
    { label: 'ALPS', code: 'ALP', color: '#fde68a' },
    { label: 'DENHAM', code: 'DNH', color: '#1a1a1a', main: true },
    { label: 'MOROCCO', code: 'MOR', color: '#fed7aa' },
    { label: 'GREENLAND', code: 'GRL', color: '#a7f3d0' },
    { label: 'BAHAMAS', code: 'BAH', color: '#fecaca' },
  ];

  return (
    <div className="journey-var journey-var--luggage" ref={ref}>
      <div className="journey-var__luggage-rope" />
      <div className="journey-var__tags">
        {tags.map((tag, i) => (
          <motion.div
            key={tag.label}
            className={`journey-var__tag ${tag.main ? 'journey-var__tag--main' : ''}`}
            style={{ '--tag-color': tag.color, '--tag-rotate': `${(i - 4) * 5}deg` }}
            initial={{ opacity: 0, y: -50, rotate: -20 }}
            animate={isInView ? { opacity: 1, y: 0, rotate: (i - 4) * 5 } : {}}
            transition={{ type: 'spring', delay: i * 0.1 }}
            whileHover={{ scale: 1.1, rotate: 0 }}
          >
            <div className="journey-var__tag-hole" />
            <div className="journey-var__tag-content">
              <span className="journey-var__tag-code">{tag.code}</span>
              <span className="journey-var__tag-dest">{tag.label}</span>
              <div className="journey-var__tag-barcode">
                {[...Array(12)].map((_, j) => (
                  <div key={j} className="journey-var__tag-bar" style={{ height: `${10 + Math.random() * 10}px` }} />
                ))}
              </div>
            </div>
          </motion.div>
        ))}
      </div>
      <p className="journey-var__caption">Tag your next destination</p>
    </div>
  );
}

// ============================================
// VARIATION 22: WEATHER MAP
// ============================================

function JourneyWeatherMap() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.3 });

  const locations = [
    { x: 50, y: 50, label: 'DENHAM', temp: '12°', weather: '☀', main: true },
    { x: 25, y: 15, label: 'ARCTIC', temp: '-15°', weather: '❄' },
    { x: 15, y: 45, label: 'ICELAND', temp: '5°', weather: '🌧' },
    { x: 30, y: 80, label: 'MOROCCO', temp: '28°', weather: '☀' },
    { x: 65, y: 20, label: 'NORWAY', temp: '3°', weather: '🌨' },
    { x: 80, y: 40, label: 'ALPS', temp: '-2°', weather: '⛅' },
    { x: 75, y: 70, label: 'GREENLAND', temp: '-8°', weather: '❄' },
    { x: 85, y: 85, label: 'BAHAMAS', temp: '32°', weather: '☀' },
  ];

  return (
    <div className="journey-var journey-var--weather" ref={ref}>
      <div className="journey-var__weather-header">
        <span className="journey-var__weather-title">EXPEDITION WEATHER</span>
        <span className="journey-var__weather-date">LIVE CONDITIONS</span>
      </div>
      <div className="journey-var__weather-map">
        <svg className="journey-var__isobars" viewBox="0 0 100 100" preserveAspectRatio="none">
          {[20, 40, 60, 80].map((r, i) => (
            <motion.ellipse
              key={i}
              cx="50" cy="50"
              rx={r} ry={r * 0.6}
              fill="none"
              stroke="#3b82f6"
              strokeWidth="0.3"
              strokeDasharray="2 2"
              initial={{ scale: 0 }}
              animate={isInView ? { scale: 1 } : {}}
              transition={{ duration: 0.5, delay: i * 0.1 }}
            />
          ))}
        </svg>

        {locations.map((loc, i) => (
          <motion.div
            key={loc.label}
            className={`journey-var__weather-loc ${loc.main ? 'journey-var__weather-loc--main' : ''}`}
            style={{ left: `${loc.x}%`, top: `${loc.y}%` }}
            initial={{ scale: 0, opacity: 0 }}
            animate={isInView ? { scale: 1, opacity: 1 } : {}}
            transition={{ delay: 0.5 + i * 0.1 }}
          >
            <span className="journey-var__weather-icon">{loc.weather}</span>
            <span className="journey-var__weather-temp">{loc.temp}</span>
            <span className="journey-var__weather-name">{loc.label}</span>
          </motion.div>
        ))}
      </div>
      <p className="journey-var__caption">Weather-ready for any expedition</p>
    </div>
  );
}

// ============================================
// VARIATION 23: ISOMETRIC BLOCKS
// ============================================

function JourneyIsometric() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.3 });

  const blocks = [
    { x: 4, y: 4, z: 3, label: 'DENHAM', color: '#1a1a1a', main: true },
    { x: 2, y: 2, z: 2, label: 'ALPS', color: '#60a5fa' },
    { x: 6, y: 2, z: 1, label: 'NORWAY', color: '#a78bfa' },
    { x: 2, y: 6, z: 2, label: 'ICELAND', color: '#34d399' },
    { x: 6, y: 6, z: 1, label: 'MOROCCO', color: '#fbbf24' },
    { x: 0, y: 4, z: 2, label: 'ARCTIC', color: '#38bdf8' },
    { x: 8, y: 4, z: 1, label: 'GREENLAND', color: '#4ade80' },
    { x: 4, y: 8, z: 1, label: 'BAHAMAS', color: '#fb923c' },
    { x: 4, y: 0, z: 2, label: 'COSTA RICA', color: '#f472b6' },
  ];

  return (
    <div className="journey-var journey-var--isometric" ref={ref}>
      <div className="journey-var__iso-grid">
        {blocks.map((block, i) => (
          <motion.div
            key={block.label}
            className={`journey-var__iso-block ${block.main ? 'journey-var__iso-block--main' : ''}`}
            style={{
              '--block-x': block.x,
              '--block-y': block.y,
              '--block-z': block.z,
              '--block-color': block.color,
            }}
            initial={{ opacity: 0, y: 50 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.5, delay: i * 0.1 }}
          >
            <div className="journey-var__iso-top" />
            <div className="journey-var__iso-left" />
            <div className="journey-var__iso-right" />
            <span className="journey-var__iso-label">{block.label}</span>
          </motion.div>
        ))}
      </div>
      <p className="journey-var__caption">Building adventures in 3D</p>
    </div>
  );
}

// ============================================
// VARIATION 24: VINTAGE MAP
// ============================================

function JourneyVintageMap() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.3 });

  const markers = [
    { x: 50, y: 45, label: 'DENHAM', main: true },
    { x: 22, y: 18, label: 'ARCTIC' },
    { x: 12, y: 42, label: 'ICELAND' },
    { x: 35, y: 78, label: 'MOROCCO' },
    { x: 62, y: 22, label: 'NORWAY' },
    { x: 78, y: 38, label: 'ALPS' },
    { x: 85, y: 58, label: 'GREENLAND' },
    { x: 70, y: 82, label: 'BAHAMAS' },
    { x: 42, y: 88, label: 'COSTA RICA' },
  ];

  return (
    <div className="journey-var journey-var--vintage" ref={ref}>
      <div className="journey-var__vintage-border">
        <div className="journey-var__vintage-inner">
          <div className="journey-var__vintage-header">
            <span className="journey-var__vintage-title">EXPEDITION ROUTES</span>
            <span className="journey-var__vintage-subtitle">HQ Aviation · Est. 2018</span>
          </div>

          <div className="journey-var__vintage-map">
            <svg className="journey-var__vintage-routes" viewBox="0 0 100 100" preserveAspectRatio="none">
              {markers.slice(1).map((m, i) => (
                <motion.path
                  key={i}
                  d={`M ${markers[0].x} ${markers[0].y} Q ${(markers[0].x + m.x) / 2} ${Math.min(markers[0].y, m.y) - 10} ${m.x} ${m.y}`}
                  fill="none"
                  stroke="#8b4513"
                  strokeWidth="0.5"
                  strokeDasharray="2 1"
                  initial={{ pathLength: 0 }}
                  animate={isInView ? { pathLength: 1 } : {}}
                  transition={{ duration: 1, delay: i * 0.15 }}
                />
              ))}
            </svg>

            {markers.map((m, i) => (
              <motion.div
                key={m.label}
                className={`journey-var__vintage-marker ${m.main ? 'journey-var__vintage-marker--main' : ''}`}
                style={{ left: `${m.x}%`, top: `${m.y}%` }}
                initial={{ scale: 0 }}
                animate={isInView ? { scale: 1 } : {}}
                transition={{ delay: 0.5 + i * 0.1 }}
              >
                <span className="journey-var__vintage-icon">{m.main ? '🏠' : '📍'}</span>
                <span className="journey-var__vintage-label">{m.label}</span>
              </motion.div>
            ))}
          </div>

          <div className="journey-var__vintage-compass">
            <span>N</span>
            <div className="journey-var__vintage-rose" />
          </div>
        </div>
      </div>
      <p className="journey-var__caption">Charting courses since 2018</p>
    </div>
  );
}

// ============================================
// VARIATION 25: NEON SIGNS
// ============================================

function JourneyNeon() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.3 });

  const signs = [
    { label: 'DENHAM', color: '#fff', main: true },
    { label: 'ARCTIC', color: '#60a5fa' },
    { label: 'ICELAND', color: '#34d399' },
    { label: 'NORWAY', color: '#a78bfa' },
    { label: 'ALPS', color: '#f472b6' },
    { label: 'MOROCCO', color: '#fbbf24' },
    { label: 'GREENLAND', color: '#22d3ee' },
    { label: 'BAHAMAS', color: '#fb923c' },
  ];

  return (
    <div className="journey-var journey-var--neon" ref={ref}>
      <div className="journey-var__neon-wall">
        <motion.div
          className="journey-var__neon-main"
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : {}}
          transition={{ duration: 0.5 }}
        >
          <span className="journey-var__neon-text journey-var__neon-text--main">HQ AVIATION</span>
          <span className="journey-var__neon-arrow">→</span>
          <span className="journey-var__neon-subtitle">EXPEDITIONS</span>
        </motion.div>

        <div className="journey-var__neon-destinations">
          {signs.filter(s => !s.main).map((sign, i) => (
            <motion.span
              key={sign.label}
              className="journey-var__neon-text"
              style={{ '--neon-color': sign.color }}
              initial={{ opacity: 0 }}
              animate={isInView ? { opacity: [0.5, 1, 0.8, 1] } : {}}
              transition={{ duration: 0.3, delay: 0.5 + i * 0.15 }}
            >
              {sign.label}
            </motion.span>
          ))}
        </div>
      </div>
      <p className="journey-var__caption journey-var__caption--light">Lighting the way to adventure</p>
    </div>
  );
}

// ============================================
// VARIATION 26: VINYL RECORD
// ============================================

function JourneyVinyl() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.3 });

  const tracks = [
    { label: 'ARCTIC', time: '2:22' },
    { label: 'ICELAND', time: '1:19' },
    { label: 'NORWAY', time: '0:18' },
    { label: 'ALPS', time: '0:20' },
    { label: 'MOROCCO', time: '1:21' },
    { label: 'GREENLAND', time: '2:23' },
    { label: 'BAHAMAS', time: '4:24' },
    { label: 'COSTA RICA', time: '5:25' },
  ];

  return (
    <div className="journey-var journey-var--vinyl" ref={ref}>
      <div className="journey-var__vinyl-sleeve">
        <motion.div
          className="journey-var__vinyl-record"
          animate={isInView ? { rotate: 360 } : {}}
          transition={{ duration: 8, repeat: Infinity, ease: 'linear' }}
        >
          <div className="journey-var__vinyl-grooves">
            {[...Array(20)].map((_, i) => (
              <div key={i} className="journey-var__vinyl-groove" style={{ '--groove-index': i }} />
            ))}
          </div>
          <div className="journey-var__vinyl-label">
            <span className="journey-var__vinyl-title">HQ AVIATION</span>
            <span className="journey-var__vinyl-subtitle">EXPEDITIONS</span>
          </div>
        </motion.div>
      </div>

      <div className="journey-var__vinyl-tracklist">
        <div className="journey-var__vinyl-side">SIDE A - DESTINATIONS</div>
        {tracks.map((track, i) => (
          <motion.div
            key={track.label}
            className="journey-var__vinyl-track"
            initial={{ opacity: 0, x: -20 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ delay: 0.3 + i * 0.1 }}
          >
            <span className="journey-var__vinyl-num">{i + 1}.</span>
            <span className="journey-var__vinyl-name">{track.label}</span>
            <span className="journey-var__vinyl-time">{track.time}</span>
          </motion.div>
        ))}
      </div>
      <p className="journey-var__caption">Greatest hits of exploration</p>
    </div>
  );
}

// ============================================
// VARIATION 27: BOARDING PASS
// ============================================

function JourneyBoardingPass() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.3 });

  const passes = [
    { from: 'DNH', to: 'ARC', dest: 'ARCTIC', gate: 'A1', seat: '1A' },
    { from: 'DNH', to: 'ICE', dest: 'ICELAND', gate: 'B2', seat: '2A' },
    { from: 'DNH', to: 'NOR', dest: 'NORWAY', gate: 'C3', seat: '3A' },
    { from: 'DNH', to: 'ALP', dest: 'ALPS', gate: 'D4', seat: '4A' },
  ];

  return (
    <div className="journey-var journey-var--boarding" ref={ref}>
      <div className="journey-var__passes">
        {passes.map((pass, i) => (
          <motion.div
            key={pass.dest}
            className="journey-var__pass"
            initial={{ opacity: 0, x: -50, rotate: -5 }}
            animate={isInView ? { opacity: 1, x: 0, rotate: 0 } : {}}
            transition={{ duration: 0.5, delay: i * 0.15 }}
          >
            <div className="journey-var__pass-main">
              <div className="journey-var__pass-header">
                <span className="journey-var__pass-airline">HQ AVIATION</span>
                <span className="journey-var__pass-class">EXPEDITION CLASS</span>
              </div>
              <div className="journey-var__pass-route">
                <div className="journey-var__pass-city">
                  <span className="journey-var__pass-code">{pass.from}</span>
                  <span className="journey-var__pass-name">DENHAM</span>
                </div>
                <div className="journey-var__pass-arrow">✈</div>
                <div className="journey-var__pass-city">
                  <span className="journey-var__pass-code">{pass.to}</span>
                  <span className="journey-var__pass-name">{pass.dest}</span>
                </div>
              </div>
              <div className="journey-var__pass-details">
                <div><span>GATE</span><span>{pass.gate}</span></div>
                <div><span>SEAT</span><span>{pass.seat}</span></div>
                <div><span>BOARDING</span><span>NOW</span></div>
              </div>
            </div>
            <div className="journey-var__pass-stub">
              <span className="journey-var__pass-stub-code">{pass.to}</span>
              <span className="journey-var__pass-stub-seat">{pass.seat}</span>
            </div>
          </motion.div>
        ))}
      </div>
      <p className="journey-var__caption">Your boarding passes await</p>
    </div>
  );
}

// ============================================
// VARIATION 28: SPEEDOMETER
// ============================================

function JourneySpeedometer() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.3 });

  const destinations = [
    { label: 'ALPS', distance: 500, angle: -120 },
    { label: 'NORWAY', distance: 650, angle: -100 },
    { label: 'MOROCCO', distance: 1100, angle: -80 },
    { label: 'ICELAND', distance: 1200, angle: -60 },
    { label: 'GREENLAND', distance: 2100, angle: -40 },
    { label: 'ARCTIC', distance: 2500, angle: -20 },
    { label: 'BAHAMAS', distance: 4200, angle: 0 },
    { label: 'COSTA RICA', distance: 5100, angle: 20 },
  ];

  return (
    <div className="journey-var journey-var--speedo" ref={ref}>
      <div className="journey-var__speedo-dial">
        <svg viewBox="0 0 300 200" preserveAspectRatio="xMidYMid meet">
          <defs>
            <linearGradient id="speedo-grad" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#22c55e" />
              <stop offset="50%" stopColor="#fbbf24" />
              <stop offset="100%" stopColor="#ef4444" />
            </linearGradient>
          </defs>

          <path
            d="M 30 170 A 120 120 0 0 1 270 170"
            fill="none"
            stroke="url(#speedo-grad)"
            strokeWidth="15"
            strokeLinecap="round"
          />

          {destinations.map((dest, i) => {
            const angle = dest.angle - 90;
            const x = 150 + Math.cos((angle * Math.PI) / 180) * 100;
            const y = 150 + Math.sin((angle * Math.PI) / 180) * 100;
            const tickX = 150 + Math.cos((angle * Math.PI) / 180) * 85;
            const tickY = 150 + Math.sin((angle * Math.PI) / 180) * 85;
            return (
              <motion.g key={dest.label}>
                <line x1={tickX} y1={tickY} x2={x} y2={y} stroke="#444" strokeWidth="2" />
                <motion.text
                  x={150 + Math.cos((angle * Math.PI) / 180) * 70}
                  y={150 + Math.sin((angle * Math.PI) / 180) * 70}
                  textAnchor="middle"
                  className="journey-var__speedo-label"
                  initial={{ opacity: 0 }}
                  animate={isInView ? { opacity: 1 } : {}}
                  transition={{ delay: 0.3 + i * 0.1 }}
                >
                  {dest.label}
                </motion.text>
              </motion.g>
            );
          })}

          <motion.line
            x1="150" y1="150"
            x2="150" y2="60"
            stroke="#ef4444"
            strokeWidth="4"
            strokeLinecap="round"
            initial={{ rotate: -120 }}
            animate={isInView ? { rotate: [-120, 20, -40] } : {}}
            transition={{ duration: 2, delay: 0.5 }}
            style={{ transformOrigin: '150px 150px' }}
          />

          <circle cx="150" cy="150" r="15" fill="#1a1a1a" />
          <text x="150" y="185" textAnchor="middle" className="journey-var__speedo-hq">DENHAM HQ</text>
        </svg>

        <div className="journey-var__speedo-display">
          <span className="journey-var__speedo-nm">5,100</span>
          <span className="journey-var__speedo-unit">nm range</span>
        </div>
      </div>
      <p className="journey-var__caption">Measuring the distance to dreams</p>
    </div>
  );
}

// ============================================
// VARIATION 29: HOURGLASS
// ============================================

function JourneyHourglass() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.3 });

  const topDests = ['ARCTIC', 'ICELAND', 'NORWAY', 'ALPS'];
  const bottomDests = ['MOROCCO', 'GREENLAND', 'BAHAMAS', 'COSTA RICA'];

  return (
    <div className="journey-var journey-var--hourglass" ref={ref}>
      <div className="journey-var__hourglass-frame">
        <div className="journey-var__hourglass-top">
          <div className="journey-var__hourglass-sand journey-var__hourglass-sand--top">
            {topDests.map((dest, i) => (
              <motion.span
                key={dest}
                className="journey-var__hourglass-grain"
                initial={{ y: 0 }}
                animate={isInView ? { y: [0, 200, 200] } : {}}
                transition={{ duration: 2, delay: i * 0.5, repeat: Infinity, repeatDelay: 3 }}
              >
                {dest}
              </motion.span>
            ))}
          </div>
        </div>

        <div className="journey-var__hourglass-neck">
          <span className="journey-var__hourglass-center">DENHAM</span>
        </div>

        <div className="journey-var__hourglass-bottom">
          <div className="journey-var__hourglass-sand journey-var__hourglass-sand--bottom">
            {bottomDests.map((dest, i) => (
              <motion.span
                key={dest}
                className="journey-var__hourglass-grain"
                initial={{ opacity: 0 }}
                animate={isInView ? { opacity: 1 } : {}}
                transition={{ delay: 1.5 + i * 0.3 }}
              >
                {dest}
              </motion.span>
            ))}
          </div>
        </div>
      </div>
      <p className="journey-var__caption">Time flows through every journey</p>
    </div>
  );
}

// ============================================
// VARIATION 30: SLOT MACHINE
// ============================================

function JourneySlotMachine() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.3 });

  const reels = [
    ['ARCTIC', 'ALPS', 'NORWAY', 'MOROCCO'],
    ['ICELAND', 'GREENLAND', 'BAHAMAS', 'ARCTIC'],
    ['COSTA RICA', 'NORWAY', 'ALPS', 'ICELAND'],
  ];

  const [spinning, setSpinning] = useState(false);
  const [results, setResults] = useState([0, 0, 0]);

  const spin = () => {
    if (spinning) return;
    setSpinning(true);
    setTimeout(() => {
      setResults([
        Math.floor(Math.random() * 4),
        Math.floor(Math.random() * 4),
        Math.floor(Math.random() * 4),
      ]);
      setSpinning(false);
    }, 2000);
  };

  return (
    <div className="journey-var journey-var--slots" ref={ref}>
      <div className="journey-var__slots-machine">
        <div className="journey-var__slots-header">
          <span className="journey-var__slots-title">DESTINATION PICKER</span>
          <span className="journey-var__slots-subtitle">HQ AVIATION</span>
        </div>

        <div className="journey-var__slots-window">
          {reels.map((reel, i) => (
            <div key={i} className="journey-var__slots-reel">
              <motion.div
                className="journey-var__slots-strip"
                animate={spinning ? { y: [-200, 0] } : { y: -results[i] * 60 }}
                transition={spinning ? { duration: 0.1, repeat: 20 } : { duration: 0.5, delay: i * 0.2 }}
              >
                {reel.map((dest, j) => (
                  <div key={j} className="journey-var__slots-item">{dest}</div>
                ))}
              </motion.div>
            </div>
          ))}
        </div>

        <motion.button
          className="journey-var__slots-lever"
          onClick={spin}
          whileTap={{ scale: 0.95 }}
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : {}}
          transition={{ delay: 0.5 }}
        >
          {spinning ? 'SPINNING...' : 'SPIN TO PICK'}
        </motion.button>

        <div className="journey-var__slots-base">
          <span>FROM DENHAM</span>
        </div>
      </div>
      <p className="journey-var__caption">Spin the wheel of adventure</p>
    </div>
  );
}

// ============================================
// VARIATION 31: COMPASS NETWORK (Merged v4 + v5)
// ============================================

function JourneyCompassNetwork() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.3 });

  const destinations = [
    { angle: -90, label: 'ARCTIC', dist: 180, nm: '2,500' },
    { angle: -135, label: 'ICELAND', dist: 150, nm: '1,200' },
    { angle: 180, label: 'MOROCCO', dist: 140, nm: '1,100' },
    { angle: -45, label: 'NORWAY', dist: 120, nm: '650' },
    { angle: 45, label: 'ALPS', dist: 100, nm: '500' },
    { angle: -60, label: 'GREENLAND', dist: 175, nm: '2,100' },
    { angle: 90, label: 'BAHAMAS', dist: 190, nm: '4,200' },
    { angle: 135, label: 'COSTA RICA', dist: 185, nm: '5,100' },
  ];

  const [activeRoute, setActiveRoute] = useState(0);

  useEffect(() => {
    if (isInView) {
      const interval = setInterval(() => {
        setActiveRoute(prev => (prev + 1) % destinations.length);
      }, 3000);
      return () => clearInterval(interval);
    }
  }, [isInView]);

  return (
    <div className="journey-var journey-var--compass-network" ref={ref}>
      <svg viewBox="0 0 500 500" preserveAspectRatio="xMidYMid meet">
        <defs>
          <linearGradient id="route-gradient" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#2563eb" />
            <stop offset="100%" stopColor="#7c3aed" />
          </linearGradient>
          <filter id="glow">
            <feGaussianBlur stdDeviation="2" result="coloredBlur"/>
            <feMerge>
              <feMergeNode in="coloredBlur"/>
              <feMergeNode in="SourceGraphic"/>
            </feMerge>
          </filter>
        </defs>

        {/* Compass rings */}
        {[180, 140, 100].map((r, i) => (
          <motion.circle
            key={r}
            cx="250" cy="250" r={r}
            fill="none"
            stroke="#e8e6e2"
            strokeWidth={i === 0 ? 2 : 1}
            strokeDasharray={i === 0 ? "none" : "4 4"}
            initial={{ scale: 0, opacity: 0 }}
            animate={isInView ? { scale: 1, opacity: 1 } : {}}
            transition={{ duration: 0.6, delay: i * 0.15 }}
          />
        ))}

        {/* Cardinal directions */}
        {['N', 'E', 'S', 'W'].map((dir, i) => {
          const angle = i * 90 - 90;
          const x = 250 + Math.cos((angle * Math.PI) / 180) * 210;
          const y = 250 + Math.sin((angle * Math.PI) / 180) * 210;
          return (
            <motion.text
              key={dir}
              x={x} y={y + 5}
              textAnchor="middle"
              className="journey-var__compass-network-cardinal"
              initial={{ opacity: 0 }}
              animate={isInView ? { opacity: 1 } : {}}
              transition={{ delay: 0.5 + i * 0.1 }}
            >
              {dir}
            </motion.text>
          );
        })}

        {/* Flight paths - curved lines with animations */}
        {destinations.map((dest, i) => {
          const endX = 250 + Math.cos((dest.angle * Math.PI) / 180) * dest.dist;
          const endY = 250 + Math.sin((dest.angle * Math.PI) / 180) * dest.dist;
          const midAngle = dest.angle + (dest.angle > 0 ? -20 : 20);
          const midDist = dest.dist * 0.6;
          const midX = 250 + Math.cos((midAngle * Math.PI) / 180) * midDist;
          const midY = 250 + Math.sin((midAngle * Math.PI) / 180) * midDist;

          return (
            <g key={dest.label}>
              {/* Path background */}
              <motion.path
                d={`M 250 250 Q ${midX} ${midY} ${endX} ${endY}`}
                fill="none"
                stroke="#e8e6e2"
                strokeWidth="2"
                initial={{ pathLength: 0 }}
                animate={isInView ? { pathLength: 1 } : {}}
                transition={{ duration: 1, delay: 0.3 + i * 0.1 }}
              />
              {/* Active path highlight */}
              <motion.path
                d={`M 250 250 Q ${midX} ${midY} ${endX} ${endY}`}
                fill="none"
                stroke="url(#route-gradient)"
                strokeWidth="3"
                filter="url(#glow)"
                initial={{ pathLength: 0, opacity: 0 }}
                animate={activeRoute === i ? { pathLength: 1, opacity: 1 } : { pathLength: 0, opacity: 0 }}
                transition={{ duration: 1.5 }}
              />
            </g>
          );
        })}

        {/* Center - Denham */}
        <motion.circle
          cx="250" cy="250" r="25"
          fill="#1a1a1a"
          initial={{ scale: 0 }}
          animate={isInView ? { scale: 1 } : {}}
          transition={{ duration: 0.5, type: 'spring' }}
        />
        <motion.text
          x="250" y="255"
          textAnchor="middle"
          className="journey-var__compass-network-center"
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : {}}
          transition={{ delay: 0.4 }}
        >
          HQ
        </motion.text>

        {/* Destination nodes */}
        {destinations.map((dest, i) => {
          const x = 250 + Math.cos((dest.angle * Math.PI) / 180) * dest.dist;
          const y = 250 + Math.sin((dest.angle * Math.PI) / 180) * dest.dist;
          const isActive = activeRoute === i;

          return (
            <motion.g key={dest.label}>
              {/* Node circle */}
              <motion.circle
                cx={x} cy={y} r={isActive ? 12 : 8}
                fill={isActive ? "#2563eb" : "#fff"}
                stroke={isActive ? "#2563eb" : "#1a1a1a"}
                strokeWidth="2"
                initial={{ scale: 0 }}
                animate={isInView ? { scale: 1 } : {}}
                transition={{ duration: 0.4, delay: 0.8 + i * 0.08 }}
              />
              {/* Label */}
              <motion.text
                x={x} y={y - 18}
                textAnchor="middle"
                className={`journey-var__compass-network-label ${isActive ? 'journey-var__compass-network-label--active' : ''}`}
                initial={{ opacity: 0 }}
                animate={isInView ? { opacity: 1 } : {}}
                transition={{ delay: 1 + i * 0.08 }}
              >
                {dest.label}
              </motion.text>
              {/* Distance badge */}
              {isActive && (
                <motion.text
                  x={x} y={y + 28}
                  textAnchor="middle"
                  className="journey-var__compass-network-dist"
                  initial={{ opacity: 0, y: y + 20 }}
                  animate={{ opacity: 1, y: y + 28 }}
                >
                  {dest.nm} nm
                </motion.text>
              )}
            </motion.g>
          );
        })}

        {/* Animated helicopter on active route */}
        {destinations.map((dest, i) => {
          if (activeRoute !== i) return null;
          const endX = 250 + Math.cos((dest.angle * Math.PI) / 180) * dest.dist;
          const endY = 250 + Math.sin((dest.angle * Math.PI) / 180) * dest.dist;
          const midAngle = dest.angle + (dest.angle > 0 ? -20 : 20);
          const midDist = dest.dist * 0.6;
          const midX = 250 + Math.cos((midAngle * Math.PI) / 180) * midDist;
          const midY = 250 + Math.sin((midAngle * Math.PI) / 180) * midDist;

          return (
            <motion.image
              key={`heli-${i}`}
              href="/assets/images/icons/r66-icon-transparent going right.svg"
              width="30" height="30"
              style={{ transformOrigin: 'center' }}
              initial={{ offsetDistance: '0%' }}
              animate={{ offsetDistance: '100%' }}
              transition={{ duration: 2, ease: 'easeInOut' }}
            >
              <animateMotion
                dur="2s"
                repeatCount="1"
                path={`M 250 250 Q ${midX} ${midY} ${endX} ${endY}`}
                rotate="auto"
              />
            </motion.image>
          );
        })}
      </svg>

      {/* Active destination info panel */}
      <motion.div
        className="journey-var__compass-network-info"
        key={activeRoute}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <span className="journey-var__compass-network-info-dest">{destinations[activeRoute].label}</span>
        <span className="journey-var__compass-network-info-nm">{destinations[activeRoute].nm} nautical miles from Denham</span>
      </motion.div>

      <p className="journey-var__caption">Precision routes from home base</p>
    </div>
  );
}

// ============================================
// VARIATION 32: AIR TRAFFIC CONTROL
// ============================================

function JourneyAirTrafficControl() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.3 });
  const [selectedFlight, setSelectedFlight] = useState(0);

  const flights = [
    { callsign: 'HQ001', dest: 'ARCTIC', alt: 'FL350', speed: '145kt', eta: '17:30Z' },
    { callsign: 'HQ002', dest: 'ICELAND', alt: 'FL280', speed: '140kt', eta: '09:15Z' },
    { callsign: 'HQ003', dest: 'MOROCCO', alt: 'FL310', speed: '142kt', eta: '14:45Z' },
    { callsign: 'HQ004', dest: 'NORWAY', alt: 'FL260', speed: '138kt', eta: '06:20Z' },
    { callsign: 'HQ005', dest: 'ALPS', alt: 'FL240', speed: '135kt', eta: '04:50Z' },
    { callsign: 'HQ006', dest: 'GREENLAND', alt: 'FL360', speed: '148kt', eta: '15:10Z' },
    { callsign: 'HQ007', dest: 'BAHAMAS', alt: 'FL380', speed: '150kt', eta: '28:30Z' },
    { callsign: 'HQ008', dest: 'COSTA RICA', alt: 'FL390', speed: '152kt', eta: '34:15Z' },
  ];

  return (
    <div className="journey-var journey-var--atc" ref={ref}>
      <div className="journey-var__atc-screen">
        <div className="journey-var__atc-header">
          <span className="journey-var__atc-title">DENHAM APPROACH</span>
          <span className="journey-var__atc-time">{new Date().toISOString().slice(11, 19)}Z</span>
        </div>

        <div className="journey-var__atc-strips">
          {flights.map((flight, i) => (
            <motion.div
              key={flight.callsign}
              className={`journey-var__atc-strip ${selectedFlight === i ? 'active' : ''}`}
              onClick={() => setSelectedFlight(i)}
              initial={{ x: -100, opacity: 0 }}
              animate={isInView ? { x: 0, opacity: 1 } : {}}
              transition={{ delay: i * 0.1, duration: 0.4 }}
            >
              <span className="journey-var__atc-callsign">{flight.callsign}</span>
              <span className="journey-var__atc-dest">{flight.dest}</span>
              <span className="journey-var__atc-alt">{flight.alt}</span>
              <span className="journey-var__atc-speed">{flight.speed}</span>
              <span className="journey-var__atc-eta">ETA {flight.eta}</span>
            </motion.div>
          ))}
        </div>

        <div className="journey-var__atc-scanline" />
      </div>
      <p className="journey-var__caption">Tower Control • Cleared for Adventure</p>

      <style>{`
        .journey-var--atc { background: #0a0f0a; padding: 2rem; border-radius: 12px; }
        .journey-var__atc-screen { background: #0d120d; border: 2px solid #1a3a1a; border-radius: 8px; padding: 1.5rem; position: relative; overflow: hidden; }
        .journey-var__atc-header { display: flex; justify-content: space-between; margin-bottom: 1rem; padding-bottom: 0.5rem; border-bottom: 1px solid #1a3a1a; }
        .journey-var__atc-title { color: #4ade80; font-family: 'Share Tech Mono', monospace; font-size: 0.9rem; letter-spacing: 0.1em; }
        .journey-var__atc-time { color: #22c55e; font-family: 'Share Tech Mono', monospace; font-size: 0.85rem; }
        .journey-var__atc-strips { display: flex; flex-direction: column; gap: 0.5rem; }
        .journey-var__atc-strip { display: grid; grid-template-columns: 80px 1fr 80px 80px 100px; gap: 0.5rem; padding: 0.75rem 1rem; background: rgba(34, 197, 94, 0.05); border-left: 3px solid transparent; cursor: pointer; transition: all 0.2s; font-family: 'Share Tech Mono', monospace; font-size: 0.8rem; color: #4ade80; }
        .journey-var__atc-strip:hover { background: rgba(34, 197, 94, 0.1); }
        .journey-var__atc-strip.active { border-left-color: #22c55e; background: rgba(34, 197, 94, 0.15); }
        .journey-var__atc-callsign { color: #fff; font-weight: 600; }
        .journey-var__atc-dest { color: #fbbf24; }
        .journey-var__atc-scanline { position: absolute; top: 0; left: 0; right: 0; height: 2px; background: linear-gradient(90deg, transparent, #22c55e, transparent); animation: atcScan 3s linear infinite; }
        @keyframes atcScan { 0% { transform: translateY(0); } 100% { transform: translateY(400px); } }
        .journey-var--atc .journey-var__caption { color: #4ade80; margin-top: 1.5rem; }
      `}</style>
    </div>
  );
}

// ============================================
// VARIATION 33: TOPOGRAPHIC CONTOURS
// ============================================

function JourneyTopographic() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.3 });

  const contours = [
    { level: 0, color: '#a7c4a0' },
    { level: 1, color: '#8fbc8f' },
    { level: 2, color: '#6b8e6b' },
    { level: 3, color: '#556b55' },
    { level: 4, color: '#3d4d3d' },
  ];

  const peaks = [
    { x: 150, y: 120, name: 'ARCTIC', elevation: '2,500 nm' },
    { x: 300, y: 200, name: 'ICELAND', elevation: '1,200 nm' },
    { x: 450, y: 280, name: 'ALPS', elevation: '500 nm' },
    { x: 600, y: 150, name: 'NORWAY', elevation: '650 nm' },
    { x: 750, y: 220, name: 'GREENLAND', elevation: '2,100 nm' },
    { x: 900, y: 300, name: 'MOROCCO', elevation: '1,100 nm' },
  ];

  return (
    <div className="journey-var journey-var--topo" ref={ref}>
      <svg viewBox="0 0 1000 400" preserveAspectRatio="xMidYMid meet">
        {/* Background contours */}
        {contours.map((c, i) => (
          <motion.path
            key={i}
            d={`M0,${350 - i * 30} Q250,${300 - i * 40} 500,${320 - i * 35} T1000,${340 - i * 30}`}
            fill="none"
            stroke={c.color}
            strokeWidth="1.5"
            initial={{ pathLength: 0 }}
            animate={isInView ? { pathLength: 1 } : {}}
            transition={{ duration: 1.5, delay: i * 0.2 }}
          />
        ))}

        {/* Peaks with X markers */}
        {peaks.map((peak, i) => (
          <motion.g
            key={peak.name}
            initial={{ scale: 0, opacity: 0 }}
            animate={isInView ? { scale: 1, opacity: 1 } : {}}
            transition={{ delay: 1 + i * 0.15, type: 'spring' }}
          >
            <line x1={peak.x - 8} y1={peak.y - 8} x2={peak.x + 8} y2={peak.y + 8} stroke="#1a1a1a" strokeWidth="2" />
            <line x1={peak.x + 8} y1={peak.y - 8} x2={peak.x - 8} y2={peak.y + 8} stroke="#1a1a1a" strokeWidth="2" />
            <text x={peak.x} y={peak.y - 20} textAnchor="middle" className="journey-var__topo-name">{peak.name}</text>
            <text x={peak.x} y={peak.y + 30} textAnchor="middle" className="journey-var__topo-elev">{peak.elevation}</text>
          </motion.g>
        ))}

        {/* Legend */}
        <text x="50" y="30" className="journey-var__topo-legend">EXPEDITION TERRAIN MAP</text>
      </svg>
      <p className="journey-var__caption">Navigate the adventure landscape</p>

      <style>{`
        .journey-var--topo { background: #f5f0e6; border: 1px solid #d4c5a9; }
        .journey-var__topo-name { font-family: 'Space Grotesk', sans-serif; font-size: 12px; font-weight: 700; fill: #1a1a1a; text-transform: uppercase; letter-spacing: 0.05em; }
        .journey-var__topo-elev { font-family: 'Share Tech Mono', monospace; font-size: 10px; fill: #666; }
        .journey-var__topo-legend { font-family: 'Space Grotesk', sans-serif; font-size: 11px; fill: #8b7355; letter-spacing: 0.15em; text-transform: uppercase; }
      `}</style>
    </div>
  );
}

// ============================================
// VARIATION 34: NAUTICAL STAR CHART
// ============================================

function JourneyStarChart() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.3 });

  const stars = [
    { x: 200, y: 100, name: 'POLARIS ARCTIC', mag: 1 },
    { x: 350, y: 180, name: 'THULE ICELAND', mag: 2 },
    { x: 500, y: 250, name: 'ATLAS MOROCCO', mag: 2 },
    { x: 650, y: 150, name: 'NORSE NORWAY', mag: 3 },
    { x: 800, y: 220, name: 'ALPINE ALPS', mag: 2 },
    { x: 300, y: 300, name: 'BOREAL GREENLAND', mag: 1 },
    { x: 700, y: 320, name: 'TROPIC BAHAMAS', mag: 2 },
    { x: 550, y: 350, name: 'CENTRAL COSTA RICA', mag: 3 },
  ];

  return (
    <div className="journey-var journey-var--starchart" ref={ref}>
      <div className="journey-var__starchart-frame">
        <svg viewBox="0 0 1000 450" preserveAspectRatio="xMidYMid meet">
          {/* Grid lines */}
          {[...Array(10)].map((_, i) => (
            <g key={i}>
              <line x1={i * 100 + 50} y1="0" x2={i * 100 + 50} y2="450" stroke="#2a3a4a" strokeWidth="0.5" strokeDasharray="2 4" />
              <line x1="0" y1={i * 45 + 25} x2="1000" y2={i * 45 + 25} stroke="#2a3a4a" strokeWidth="0.5" strokeDasharray="2 4" />
            </g>
          ))}

          {/* Center marker - Denham */}
          <circle cx="500" cy="225" r="4" fill="#fbbf24" />
          <circle cx="500" cy="225" r="12" fill="none" stroke="#fbbf24" strokeWidth="1" strokeDasharray="3 3" />
          <text x="500" y="250" textAnchor="middle" className="journey-var__starchart-center">☉ DENHAM</text>

          {/* Stars with constellation lines */}
          {stars.map((star, i) => (
            <motion.g key={star.name}>
              <motion.line
                x1="500" y1="225"
                x2={star.x} y2={star.y}
                stroke="#3a5a7a"
                strokeWidth="0.5"
                strokeDasharray="4 2"
                initial={{ pathLength: 0, opacity: 0 }}
                animate={isInView ? { pathLength: 1, opacity: 0.5 } : {}}
                transition={{ duration: 1, delay: i * 0.1 }}
              />
              <motion.circle
                cx={star.x} cy={star.y}
                r={6 - star.mag}
                fill="#fff"
                initial={{ scale: 0 }}
                animate={isInView ? { scale: [0, 1.5, 1] } : {}}
                transition={{ duration: 0.5, delay: 0.8 + i * 0.1 }}
              />
              <motion.text
                x={star.x} y={star.y - 15}
                textAnchor="middle"
                className="journey-var__starchart-label"
                initial={{ opacity: 0 }}
                animate={isInView ? { opacity: 1 } : {}}
                transition={{ delay: 1.2 + i * 0.1 }}
              >
                {star.name}
              </motion.text>
            </motion.g>
          ))}
        </svg>

        <div className="journey-var__starchart-compass">N</div>
      </div>
      <p className="journey-var__caption">Celestial navigation for modern explorers</p>

      <style>{`
        .journey-var--starchart { background: #0a1520; padding: 0; border-radius: 12px; overflow: hidden; }
        .journey-var__starchart-frame { background: radial-gradient(ellipse at center, #1a2a3a 0%, #0a1520 100%); padding: 2rem; position: relative; }
        .journey-var__starchart-label { font-family: 'Share Tech Mono', monospace; font-size: 9px; fill: #8ab4f8; letter-spacing: 0.1em; }
        .journey-var__starchart-center { font-family: 'Share Tech Mono', monospace; font-size: 10px; fill: #fbbf24; }
        .journey-var__starchart-compass { position: absolute; top: 1rem; right: 1rem; width: 30px; height: 30px; border: 1px solid #3a5a7a; border-radius: 50%; display: flex; align-items: center; justify-content: center; color: #8ab4f8; font-size: 0.75rem; font-family: 'Share Tech Mono', monospace; }
        .journey-var--starchart .journey-var__caption { color: #8ab4f8; padding: 1rem 2rem 2rem; margin: 0; background: #0a1520; }
      `}</style>
    </div>
  );
}

// ============================================
// VARIATION 35: GPS WAYPOINTS
// ============================================

function JourneyWaypoints() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.3 });
  const [activeWaypoint, setActiveWaypoint] = useState(null);

  const waypoints = [
    { id: 'DENHM', name: 'DENHAM', lat: '51.5833°N', lon: '0.5167°W', type: 'origin' },
    { id: 'ARTC1', name: 'ARCTIC', lat: '90.0000°N', lon: '0.0000°E', type: 'dest' },
    { id: 'ICLD2', name: 'ICELAND', lat: '64.9631°N', lon: '19.0208°W', type: 'dest' },
    { id: 'MROC3', name: 'MOROCCO', lat: '31.7917°N', lon: '7.0926°W', type: 'dest' },
    { id: 'NRWY4', name: 'NORWAY', lat: '60.4720°N', lon: '8.4689°E', type: 'dest' },
    { id: 'ALPS5', name: 'ALPS', lat: '46.8182°N', lon: '8.2275°E', type: 'dest' },
    { id: 'GRLD6', name: 'GREENLAND', lat: '71.7069°N', lon: '42.6043°W', type: 'dest' },
    { id: 'BHMS7', name: 'BAHAMAS', lat: '25.0343°N', lon: '77.3963°W', type: 'dest' },
  ];

  return (
    <div className="journey-var journey-var--waypoints" ref={ref}>
      <div className="journey-var__waypoints-screen">
        <div className="journey-var__waypoints-header">
          <span>FPL: DENHM → MULTI</span>
          <span className="journey-var__waypoints-gps">GPS: 3D FIX</span>
        </div>

        <div className="journey-var__waypoints-list">
          {waypoints.map((wp, i) => (
            <motion.div
              key={wp.id}
              className={`journey-var__waypoint ${wp.type} ${activeWaypoint === i ? 'active' : ''}`}
              onClick={() => setActiveWaypoint(i)}
              initial={{ opacity: 0, x: -20 }}
              animate={isInView ? { opacity: 1, x: 0 } : {}}
              transition={{ delay: i * 0.1, duration: 0.3 }}
            >
              <div className="journey-var__waypoint-icon">{wp.type === 'origin' ? '◉' : '◇'}</div>
              <div className="journey-var__waypoint-info">
                <span className="journey-var__waypoint-id">{wp.id}</span>
                <span className="journey-var__waypoint-name">{wp.name}</span>
              </div>
              <div className="journey-var__waypoint-coords">
                <span>{wp.lat}</span>
                <span>{wp.lon}</span>
              </div>
            </motion.div>
          ))}
        </div>

        <div className="journey-var__waypoints-footer">
          <span>WPTS: {waypoints.length}</span>
          <span>DTK: VAR</span>
          <span>GS: ---kt</span>
        </div>
      </div>
      <p className="journey-var__caption">Flight plan waypoint sequence</p>

      <style>{`
        .journey-var--waypoints { background: #1a1a1a; padding: 2rem; border-radius: 12px; }
        .journey-var__waypoints-screen { background: #000; border: 3px solid #333; border-radius: 8px; overflow: hidden; }
        .journey-var__waypoints-header { display: flex; justify-content: space-between; padding: 0.75rem 1rem; background: #222; border-bottom: 2px solid #333; font-family: 'Share Tech Mono', monospace; font-size: 0.85rem; color: #0ff; }
        .journey-var__waypoints-gps { color: #0f0; }
        .journey-var__waypoints-list { padding: 0.5rem; }
        .journey-var__waypoint { display: grid; grid-template-columns: 30px 1fr 120px; gap: 0.5rem; padding: 0.5rem 0.75rem; border: 1px solid #333; margin-bottom: 0.25rem; cursor: pointer; transition: all 0.2s; }
        .journey-var__waypoint:hover { background: #1a1a1a; border-color: #0ff; }
        .journey-var__waypoint.active { background: #001a1a; border-color: #0ff; }
        .journey-var__waypoint.origin .journey-var__waypoint-icon { color: #f0f; }
        .journey-var__waypoint-icon { color: #0ff; font-size: 1.1rem; display: flex; align-items: center; justify-content: center; }
        .journey-var__waypoint-info { display: flex; flex-direction: column; }
        .journey-var__waypoint-id { font-family: 'Share Tech Mono', monospace; font-size: 0.9rem; color: #0ff; font-weight: 600; }
        .journey-var__waypoint-name { font-family: 'Space Grotesk', sans-serif; font-size: 0.7rem; color: #666; text-transform: uppercase; }
        .journey-var__waypoint-coords { display: flex; flex-direction: column; text-align: right; font-family: 'Share Tech Mono', monospace; font-size: 0.7rem; color: #888; }
        .journey-var__waypoints-footer { display: flex; justify-content: space-around; padding: 0.75rem; background: #111; border-top: 2px solid #333; font-family: 'Share Tech Mono', monospace; font-size: 0.75rem; color: #888; }
        .journey-var--waypoints .journey-var__caption { color: #0ff; margin-top: 1.5rem; }
      `}</style>
    </div>
  );
}

// ============================================
// VARIATION 36: FLIGHT LEVELS
// ============================================

function JourneyFlightLevels() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.3 });

  const levels = [
    { fl: 'FL410', alt: '41,000ft', destinations: [] },
    { fl: 'FL350', alt: '35,000ft', destinations: ['COSTA RICA', 'BAHAMAS'] },
    { fl: 'FL290', alt: '29,000ft', destinations: ['ARCTIC', 'GREENLAND'] },
    { fl: 'FL240', alt: '24,000ft', destinations: ['ICELAND', 'MOROCCO'] },
    { fl: 'FL180', alt: '18,000ft', destinations: ['NORWAY'] },
    { fl: 'FL100', alt: '10,000ft', destinations: ['ALPS'] },
  ];

  return (
    <div className="journey-var journey-var--flightlevels" ref={ref}>
      <div className="journey-var__fl-altimeter">
        {levels.map((level, i) => (
          <motion.div
            key={level.fl}
            className="journey-var__fl-band"
            initial={{ opacity: 0, scaleX: 0 }}
            animate={isInView ? { opacity: 1, scaleX: 1 } : {}}
            transition={{ delay: i * 0.15, duration: 0.5 }}
            style={{ transformOrigin: 'left' }}
          >
            <div className="journey-var__fl-marker">
              <span className="journey-var__fl-label">{level.fl}</span>
              <span className="journey-var__fl-alt">{level.alt}</span>
            </div>
            <div className="journey-var__fl-line" />
            <div className="journey-var__fl-destinations">
              {level.destinations.map(dest => (
                <motion.span
                  key={dest}
                  className="journey-var__fl-dest"
                  initial={{ scale: 0 }}
                  animate={isInView ? { scale: 1 } : {}}
                  transition={{ delay: 0.5 + i * 0.1, type: 'spring' }}
                >
                  ✈ {dest}
                </motion.span>
              ))}
            </div>
          </motion.div>
        ))}

        <div className="journey-var__fl-ground">
          <span>GND • DENHAM AERODROME</span>
        </div>
      </div>
      <p className="journey-var__caption">Altitude bands for expedition routes</p>

      <style>{`
        .journey-var--flightlevels { background: linear-gradient(180deg, #1e3a5f 0%, #2d5a8a 30%, #4a90c2 60%, #87ceeb 80%, #98d8c8 100%); padding: 2rem; border-radius: 12px; }
        .journey-var__fl-altimeter { display: flex; flex-direction: column; gap: 0.5rem; }
        .journey-var__fl-band { display: grid; grid-template-columns: 100px 1fr auto; gap: 1rem; align-items: center; padding: 0.75rem 1rem; background: rgba(255,255,255,0.1); border-radius: 4px; backdrop-filter: blur(5px); }
        .journey-var__fl-marker { text-align: right; }
        .journey-var__fl-label { display: block; font-family: 'Share Tech Mono', monospace; font-size: 1rem; color: #fff; font-weight: 600; }
        .journey-var__fl-alt { display: block; font-family: 'Share Tech Mono', monospace; font-size: 0.7rem; color: rgba(255,255,255,0.6); }
        .journey-var__fl-line { height: 1px; background: rgba(255,255,255,0.3); }
        .journey-var__fl-destinations { display: flex; gap: 1rem; }
        .journey-var__fl-dest { font-family: 'Space Grotesk', sans-serif; font-size: 0.8rem; color: #fff; background: rgba(0,0,0,0.3); padding: 0.25rem 0.75rem; border-radius: 20px; }
        .journey-var__fl-ground { margin-top: 1rem; padding: 1rem; background: #3d5a3d; border-radius: 4px; text-align: center; font-family: 'Share Tech Mono', monospace; font-size: 0.85rem; color: #98d8c8; }
        .journey-var--flightlevels .journey-var__caption { color: #fff; margin-top: 1.5rem; }
      `}</style>
    </div>
  );
}

// ============================================
// VARIATION 37: WATERCOLOR INKBLOT
// ============================================

function JourneyInkblot() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.3 });

  const blots = [
    { x: 100, y: 80, color: '#3b82f6', name: 'ARCTIC', size: 80 },
    { x: 280, y: 150, color: '#8b5cf6', name: 'ICELAND', size: 60 },
    { x: 450, y: 200, color: '#f97316', name: 'MOROCCO', size: 70 },
    { x: 620, y: 100, color: '#06b6d4', name: 'NORWAY', size: 55 },
    { x: 750, y: 180, color: '#10b981', name: 'ALPS', size: 50 },
    { x: 200, y: 280, color: '#14b8a6', name: 'GREENLAND', size: 75 },
    { x: 500, y: 320, color: '#ec4899', name: 'BAHAMAS', size: 65 },
    { x: 700, y: 300, color: '#84cc16', name: 'COSTA RICA', size: 60 },
  ];

  return (
    <div className="journey-var journey-var--inkblot" ref={ref}>
      <svg viewBox="0 0 900 400" preserveAspectRatio="xMidYMid meet">
        <defs>
          <filter id="watercolor" x="-50%" y="-50%" width="200%" height="200%">
            <feTurbulence type="fractalNoise" baseFrequency="0.04" numOctaves="3" result="noise" />
            <feDisplacementMap in="SourceGraphic" in2="noise" scale="15" xChannelSelector="R" yChannelSelector="G" />
          </filter>
        </defs>

        {/* Center - Denham */}
        <motion.circle
          cx="450" cy="200" r="25"
          fill="#1a1a1a"
          filter="url(#watercolor)"
          initial={{ scale: 0 }}
          animate={isInView ? { scale: 1 } : {}}
          transition={{ duration: 0.8 }}
        />
        <text x="450" y="245" textAnchor="middle" className="journey-var__inkblot-center">DENHAM</text>

        {/* Blots */}
        {blots.map((blot, i) => (
          <motion.g key={blot.name}>
            <motion.circle
              cx={blot.x} cy={blot.y} r={blot.size / 2}
              fill={blot.color}
              opacity="0.6"
              filter="url(#watercolor)"
              initial={{ scale: 0, opacity: 0 }}
              animate={isInView ? { scale: [0, 1.2, 1], opacity: 0.6 } : {}}
              transition={{ duration: 0.8, delay: 0.3 + i * 0.15 }}
            />
            <motion.text
              x={blot.x} y={blot.y + 5}
              textAnchor="middle"
              className="journey-var__inkblot-label"
              initial={{ opacity: 0 }}
              animate={isInView ? { opacity: 1 } : {}}
              transition={{ delay: 1 + i * 0.1 }}
            >
              {blot.name}
            </motion.text>
          </motion.g>
        ))}
      </svg>
      <p className="journey-var__caption">Adventures painted across the world</p>

      <style>{`
        .journey-var--inkblot { background: #fdf8f0; border: none; box-shadow: inset 0 0 50px rgba(0,0,0,0.03); }
        .journey-var__inkblot-label { font-family: 'Space Grotesk', sans-serif; font-size: 11px; font-weight: 700; fill: #fff; text-shadow: 0 1px 3px rgba(0,0,0,0.3); text-transform: uppercase; letter-spacing: 0.05em; }
        .journey-var__inkblot-center { font-family: 'Space Grotesk', sans-serif; font-size: 11px; font-weight: 700; fill: #1a1a1a; }
      `}</style>
    </div>
  );
}

// ============================================
// VARIATION 38: CHALKBOARD
// ============================================

function JourneyChalkboard() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.3 });

  const lessons = [
    { dest: 'ARCTIC', note: '2,500nm • Ice cap training', x: 50 },
    { dest: 'ICELAND', note: '1,200nm • Volcanic terrain', x: 300 },
    { dest: 'MOROCCO', note: '1,100nm • Desert navigation', x: 550 },
    { dest: 'NORWAY', note: '650nm • Fjord flying', x: 50 },
    { dest: 'ALPS', note: '500nm • Mountain ops', x: 300 },
    { dest: 'GREENLAND', note: '2,100nm • Polar expedition', x: 550 },
  ];

  return (
    <div className="journey-var journey-var--chalkboard" ref={ref}>
      <div className="journey-var__chalk-frame">
        <div className="journey-var__chalk-board">
          <motion.div
            className="journey-var__chalk-title"
            initial={{ opacity: 0 }}
            animate={isInView ? { opacity: 1 } : {}}
            transition={{ duration: 0.5 }}
          >
            HQ AVIATION EXPEDITIONS
          </motion.div>

          <div className="journey-var__chalk-content">
            {lessons.map((lesson, i) => (
              <motion.div
                key={lesson.dest}
                className="journey-var__chalk-item"
                style={{ left: lesson.x }}
                initial={{ opacity: 0, y: 20 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ delay: 0.3 + i * 0.15, duration: 0.4 }}
              >
                <span className="journey-var__chalk-dest">→ {lesson.dest}</span>
                <span className="journey-var__chalk-note">{lesson.note}</span>
              </motion.div>
            ))}
          </div>

          <motion.div
            className="journey-var__chalk-footer"
            initial={{ opacity: 0 }}
            animate={isInView ? { opacity: 1 } : {}}
            transition={{ delay: 1.2 }}
          >
            ✓ From Denham to the world
          </motion.div>
        </div>
        <div className="journey-var__chalk-tray">
          <div className="journey-var__chalk-piece" style={{ background: '#fff' }} />
          <div className="journey-var__chalk-piece" style={{ background: '#fbbf24' }} />
          <div className="journey-var__chalk-piece" style={{ background: '#60a5fa' }} />
        </div>
      </div>
      <p className="journey-var__caption">Lessons in expedition planning</p>

      <style>{`
        .journey-var--chalkboard { background: #8b7355; padding: 2rem; border-radius: 0; }
        .journey-var__chalk-frame { background: #5c4033; padding: 1rem; border-radius: 4px; box-shadow: inset 0 2px 10px rgba(0,0,0,0.5); }
        .journey-var__chalk-board { background: #2f4f4f; min-height: 300px; padding: 1.5rem; position: relative; }
        .journey-var__chalk-title { font-family: 'Space Grotesk', sans-serif; font-size: 1.5rem; color: rgba(255,255,255,0.9); text-align: center; margin-bottom: 2rem; text-decoration: underline; text-underline-offset: 8px; }
        .journey-var__chalk-content { display: grid; grid-template-columns: repeat(3, 1fr); gap: 1.5rem; }
        .journey-var__chalk-item { }
        .journey-var__chalk-dest { display: block; font-family: 'Space Grotesk', sans-serif; font-size: 1.1rem; color: #fbbf24; margin-bottom: 0.25rem; }
        .journey-var__chalk-note { font-family: 'Space Grotesk', sans-serif; font-size: 0.85rem; color: rgba(255,255,255,0.7); font-style: italic; }
        .journey-var__chalk-footer { position: absolute; bottom: 1rem; right: 1.5rem; font-family: 'Space Grotesk', sans-serif; font-size: 0.9rem; color: rgba(255,255,255,0.6); }
        .journey-var__chalk-tray { background: #3d2817; height: 20px; display: flex; gap: 0.5rem; align-items: center; padding: 0 1rem; }
        .journey-var__chalk-piece { width: 40px; height: 8px; border-radius: 2px; }
        .journey-var--chalkboard .journey-var__caption { color: #d4c5a9; margin-top: 1.5rem; }
      `}</style>
    </div>
  );
}

// ============================================
// VARIATION 39: BLUEPRINT
// ============================================

function JourneyBlueprint() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.3 });

  const routes = [
    { dest: 'ARCTIC', x: 150, y: 80, angle: -30 },
    { dest: 'ICELAND', x: 250, y: 150, angle: -15 },
    { dest: 'MOROCCO', x: 350, y: 280, angle: 25 },
    { dest: 'NORWAY', x: 550, y: 100, angle: -20 },
    { dest: 'ALPS', x: 650, y: 180, angle: 10 },
    { dest: 'GREENLAND', x: 750, y: 120, angle: -25 },
  ];

  return (
    <div className="journey-var journey-var--blueprint" ref={ref}>
      <svg viewBox="0 0 900 400" preserveAspectRatio="xMidYMid meet">
        {/* Grid */}
        {[...Array(19)].map((_, i) => (
          <line key={`v${i}`} x1={i * 50} y1="0" x2={i * 50} y2="400" stroke="#4a7cb8" strokeWidth="0.3" />
        ))}
        {[...Array(9)].map((_, i) => (
          <line key={`h${i}`} x1="0" y1={i * 50} x2="900" y2={i * 50} stroke="#4a7cb8" strokeWidth="0.3" />
        ))}

        {/* Title block */}
        <rect x="650" y="330" width="230" height="60" fill="none" stroke="#fff" strokeWidth="1" />
        <text x="765" y="350" textAnchor="middle" className="journey-var__bp-title">HQ AVIATION</text>
        <text x="765" y="375" textAnchor="middle" className="journey-var__bp-subtitle">EXPEDITION ROUTES • REV A</text>

        {/* Center - Denham */}
        <circle cx="450" cy="200" r="15" fill="none" stroke="#fff" strokeWidth="2" />
        <line x1="430" y1="200" x2="470" y2="200" stroke="#fff" strokeWidth="1" />
        <line x1="450" y1="180" x2="450" y2="220" stroke="#fff" strokeWidth="1" />
        <text x="450" y="235" textAnchor="middle" className="journey-var__bp-label">DENHAM BASE</text>

        {/* Routes with dimension lines */}
        {routes.map((route, i) => (
          <motion.g key={route.dest}>
            <motion.line
              x1="450" y1="200"
              x2={route.x} y2={route.y}
              stroke="#fff"
              strokeWidth="1"
              strokeDasharray="8 4"
              initial={{ pathLength: 0 }}
              animate={isInView ? { pathLength: 1 } : {}}
              transition={{ duration: 0.8, delay: i * 0.15 }}
            />
            <motion.circle
              cx={route.x} cy={route.y} r="8"
              fill="none"
              stroke="#fff"
              strokeWidth="1.5"
              initial={{ scale: 0 }}
              animate={isInView ? { scale: 1 } : {}}
              transition={{ delay: 0.5 + i * 0.1 }}
            />
            <motion.text
              x={route.x} y={route.y - 15}
              textAnchor="middle"
              className="journey-var__bp-dest"
              initial={{ opacity: 0 }}
              animate={isInView ? { opacity: 1 } : {}}
              transition={{ delay: 0.8 + i * 0.1 }}
            >
              {route.dest}
            </motion.text>
          </motion.g>
        ))}
      </svg>
      <p className="journey-var__caption">Engineering precision meets adventure</p>

      <style>{`
        .journey-var--blueprint { background: #1e3a5a; padding: 0; border-radius: 0; border: 8px solid #0f2540; }
        .journey-var__bp-title { font-family: 'Space Grotesk', sans-serif; font-size: 14px; fill: #fff; font-weight: 700; letter-spacing: 0.1em; }
        .journey-var__bp-subtitle { font-family: 'Share Tech Mono', monospace; font-size: 9px; fill: rgba(255,255,255,0.6); }
        .journey-var__bp-label { font-family: 'Share Tech Mono', monospace; font-size: 10px; fill: #fff; }
        .journey-var__bp-dest { font-family: 'Space Grotesk', sans-serif; font-size: 10px; fill: #fff; font-weight: 600; }
        .journey-var--blueprint .journey-var__caption { color: #8ab4f8; background: #0f2540; margin: 0; padding: 1rem 2rem; }
      `}</style>
    </div>
  );
}

// ============================================
// VARIATION 40: POSTCARD STACK
// ============================================

function JourneyPostcards() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.3 });
  const [activeCard, setActiveCard] = useState(0);

  const postcards = [
    { dest: 'ARCTIC', msg: 'Greetings from the top of the world!', stamp: '🧊', color: '#e0f2fe' },
    { dest: 'ICELAND', msg: 'Fire and ice await you here', stamp: '🌋', color: '#dbeafe' },
    { dest: 'MOROCCO', msg: 'Sunset over the Sahara', stamp: '🏜️', color: '#fef3c7' },
    { dest: 'ALPS', msg: 'Mountains calling, must fly!', stamp: '⛰️', color: '#f0fdf4' },
    { dest: 'GREENLAND', msg: 'Where glaciers meet the sky', stamp: '❄️', color: '#ecfeff' },
    { dest: 'BAHAMAS', msg: 'Crystal waters below', stamp: '🏝️', color: '#fdf4ff' },
  ];

  return (
    <div className="journey-var journey-var--postcards" ref={ref}>
      <div className="journey-var__postcards-stack">
        {postcards.map((card, i) => (
          <motion.div
            key={card.dest}
            className={`journey-var__postcard ${activeCard === i ? 'active' : ''}`}
            style={{
              background: card.color,
              zIndex: activeCard === i ? 10 : postcards.length - i,
            }}
            onClick={() => setActiveCard(i)}
            initial={{ y: 50, opacity: 0, rotate: (i - 2) * 5 }}
            animate={isInView ? {
              y: activeCard === i ? -20 : i * 4,
              opacity: 1,
              rotate: activeCard === i ? 0 : (i - 2) * 5,
              scale: activeCard === i ? 1.05 : 1,
            } : {}}
            transition={{ duration: 0.5, delay: i * 0.1 }}
            whileHover={{ y: activeCard === i ? -20 : -10 }}
          >
            <div className="journey-var__postcard-front">
              <div className="journey-var__postcard-image">
                <span className="journey-var__postcard-emoji">{card.stamp}</span>
              </div>
              <div className="journey-var__postcard-text">
                <span className="journey-var__postcard-dest">{card.dest}</span>
                <span className="journey-var__postcard-msg">{card.msg}</span>
              </div>
              <div className="journey-var__postcard-stamp">
                <span>HQ</span>
                <span>AVIATION</span>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
      <p className="journey-var__caption">Postcards from our adventures</p>

      <style>{`
        .journey-var--postcards { background: #8b7355; padding: 3rem 2rem; }
        .journey-var__postcards-stack { position: relative; height: 280px; display: flex; justify-content: center; align-items: center; }
        .journey-var__postcard { position: absolute; width: 400px; height: 240px; border-radius: 8px; cursor: pointer; box-shadow: 0 4px 20px rgba(0,0,0,0.2); transition: all 0.3s ease; }
        .journey-var__postcard.active { box-shadow: 0 10px 40px rgba(0,0,0,0.3); }
        .journey-var__postcard-front { height: 100%; display: grid; grid-template-columns: 1fr 1fr; padding: 1.5rem; position: relative; }
        .journey-var__postcard-image { display: flex; align-items: center; justify-content: center; border-right: 1px dashed #ccc; }
        .journey-var__postcard-emoji { font-size: 4rem; }
        .journey-var__postcard-text { padding-left: 1.5rem; display: flex; flex-direction: column; justify-content: center; }
        .journey-var__postcard-dest { font-family: 'Space Grotesk', sans-serif; font-size: 1.5rem; font-weight: 700; color: #1a1a1a; margin-bottom: 0.5rem; }
        .journey-var__postcard-msg { font-family: 'Georgia', serif; font-size: 0.95rem; color: #555; font-style: italic; line-height: 1.4; }
        .journey-var__postcard-stamp { position: absolute; top: 1rem; right: 1rem; width: 50px; height: 60px; border: 2px solid #c00; display: flex; flex-direction: column; align-items: center; justify-content: center; font-family: 'Space Grotesk', sans-serif; font-size: 0.6rem; color: #c00; text-transform: uppercase; }
        .journey-var--postcards .journey-var__caption { color: #d4c5a9; margin-top: 2rem; }
      `}</style>
    </div>
  );
}

// ============================================
// VARIATION 41: RADIO ANTENNA BROADCAST
// ============================================

function JourneyAntenna() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.3 });

  const broadcasts = [
    { freq: '118.25', dest: 'ARCTIC', strength: 4 },
    { freq: '121.50', dest: 'ICELAND', strength: 5 },
    { freq: '124.80', dest: 'MOROCCO', strength: 4 },
    { freq: '119.10', dest: 'NORWAY', strength: 5 },
    { freq: '122.45', dest: 'ALPS', strength: 5 },
    { freq: '126.90', dest: 'GREENLAND', strength: 3 },
    { freq: '128.35', dest: 'BAHAMAS', strength: 2 },
    { freq: '130.00', dest: 'COSTA RICA', strength: 2 },
  ];

  return (
    <div className="journey-var journey-var--antenna" ref={ref}>
      <div className="journey-var__antenna-tower">
        <svg viewBox="0 0 200 300" className="journey-var__antenna-svg">
          {/* Tower */}
          <path d="M100 280 L100 50 M85 280 L100 200 L115 280" stroke="#1a1a1a" strokeWidth="3" fill="none" />

          {/* Signal waves */}
          {[1, 2, 3, 4, 5].map(i => (
            <motion.path
              key={i}
              d={`M100 50 Q${100 + i * 30} ${50 + i * 10} ${100 + i * 40} ${50 + i * 30}`}
              stroke="#2563eb"
              strokeWidth="2"
              fill="none"
              opacity={0.8 - i * 0.15}
              initial={{ pathLength: 0, opacity: 0 }}
              animate={isInView ? { pathLength: 1, opacity: 0.8 - i * 0.15 } : {}}
              transition={{ duration: 0.5, delay: i * 0.1, repeat: Infinity, repeatType: 'loop', repeatDelay: 2 }}
            />
          ))}
          {[1, 2, 3, 4, 5].map(i => (
            <motion.path
              key={`l${i}`}
              d={`M100 50 Q${100 - i * 30} ${50 + i * 10} ${100 - i * 40} ${50 + i * 30}`}
              stroke="#2563eb"
              strokeWidth="2"
              fill="none"
              opacity={0.8 - i * 0.15}
              initial={{ pathLength: 0, opacity: 0 }}
              animate={isInView ? { pathLength: 1, opacity: 0.8 - i * 0.15 } : {}}
              transition={{ duration: 0.5, delay: i * 0.1, repeat: Infinity, repeatType: 'loop', repeatDelay: 2 }}
            />
          ))}
        </svg>
      </div>

      <div className="journey-var__antenna-frequencies">
        {broadcasts.map((b, i) => (
          <motion.div
            key={b.dest}
            className="journey-var__antenna-freq"
            initial={{ opacity: 0, x: 30 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ delay: 0.5 + i * 0.1 }}
          >
            <span className="journey-var__antenna-mhz">{b.freq} MHz</span>
            <span className="journey-var__antenna-dest">{b.dest}</span>
            <div className="journey-var__antenna-bars">
              {[1, 2, 3, 4, 5].map(bar => (
                <div
                  key={bar}
                  className={`journey-var__antenna-bar ${bar <= b.strength ? 'active' : ''}`}
                  style={{ height: bar * 4 + 4 }}
                />
              ))}
            </div>
          </motion.div>
        ))}
      </div>
      <p className="journey-var__caption">Broadcasting from Denham to the world</p>

      <style>{`
        .journey-var--antenna { background: #1a1a1a; padding: 2rem; display: grid; grid-template-columns: 200px 1fr; gap: 2rem; border-radius: 12px; }
        .journey-var__antenna-tower { display: flex; justify-content: center; }
        .journey-var__antenna-svg { width: 100%; height: auto; }
        .journey-var__antenna-frequencies { display: flex; flex-direction: column; gap: 0.5rem; justify-content: center; }
        .journey-var__antenna-freq { display: grid; grid-template-columns: 100px 1fr 60px; gap: 1rem; align-items: center; padding: 0.5rem 1rem; background: rgba(255,255,255,0.03); border-radius: 4px; }
        .journey-var__antenna-mhz { font-family: 'Share Tech Mono', monospace; font-size: 0.9rem; color: #2563eb; }
        .journey-var__antenna-dest { font-family: 'Space Grotesk', sans-serif; font-size: 0.85rem; color: #fff; font-weight: 600; }
        .journey-var__antenna-bars { display: flex; gap: 3px; align-items: flex-end; }
        .journey-var__antenna-bar { width: 6px; background: #333; border-radius: 1px; }
        .journey-var__antenna-bar.active { background: #22c55e; }
        .journey-var--antenna .journey-var__caption { grid-column: 1 / -1; color: #666; margin-top: 1rem; }
      `}</style>
    </div>
  );
}

// ============================================
// VARIATION 42: KALEIDOSCOPE
// ============================================

function JourneyKaleidoscope() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.3 });

  const segments = 8;
  const colors = ['#3b82f6', '#8b5cf6', '#ec4899', '#f97316', '#eab308', '#22c55e', '#06b6d4', '#6366f1'];

  return (
    <div className="journey-var journey-var--kaleidoscope" ref={ref}>
      <motion.div
        className="journey-var__kaleidoscope-wheel"
        animate={isInView ? { rotate: 360 } : {}}
        transition={{ duration: 60, repeat: Infinity, ease: 'linear' }}
      >
        <svg viewBox="0 0 400 400" preserveAspectRatio="xMidYMid meet">
          {destinations.map((dest, i) => {
            const angle = (i / segments) * 360;
            const rad = (angle * Math.PI) / 180;
            const x = 200 + Math.cos(rad) * 150;
            const y = 200 + Math.sin(rad) * 150;

            return (
              <motion.g
                key={dest.id}
                initial={{ opacity: 0, scale: 0 }}
                animate={isInView ? { opacity: 1, scale: 1 } : {}}
                transition={{ delay: i * 0.1, duration: 0.5 }}
              >
                <path
                  d={`M200,200 L${200 + Math.cos(rad - 0.4) * 180},${200 + Math.sin(rad - 0.4) * 180} A180,180 0 0,1 ${200 + Math.cos(rad + 0.4) * 180},${200 + Math.sin(rad + 0.4) * 180} Z`}
                  fill={colors[i]}
                  opacity="0.6"
                />
                <text
                  x={x}
                  y={y}
                  textAnchor="middle"
                  dominantBaseline="middle"
                  className="journey-var__kaleidoscope-label"
                  transform={`rotate(${angle + 90}, ${x}, ${y})`}
                >
                  {dest.name.toUpperCase()}
                </text>
              </motion.g>
            );
          })}

          {/* Center */}
          <circle cx="200" cy="200" r="40" fill="#1a1a1a" />
          <text x="200" y="195" textAnchor="middle" className="journey-var__kaleidoscope-center">HQ</text>
          <text x="200" y="210" textAnchor="middle" className="journey-var__kaleidoscope-sub">DENHAM</text>
        </svg>
      </motion.div>
      <p className="journey-var__caption">A world of destinations in motion</p>

      <style>{`
        .journey-var--kaleidoscope { background: #0a0a0a; padding: 2rem; display: flex; flex-direction: column; align-items: center; border-radius: 12px; }
        .journey-var__kaleidoscope-wheel { width: 100%; max-width: 400px; }
        .journey-var__kaleidoscope-label { font-family: 'Space Grotesk', sans-serif; font-size: 11px; fill: #fff; font-weight: 700; letter-spacing: 0.05em; }
        .journey-var__kaleidoscope-center { font-family: 'Space Grotesk', sans-serif; font-size: 16px; fill: #fff; font-weight: 700; }
        .journey-var__kaleidoscope-sub { font-family: 'Share Tech Mono', monospace; font-size: 8px; fill: #888; }
        .journey-var--kaleidoscope .journey-var__caption { color: #666; margin-top: 1.5rem; }
      `}</style>
    </div>
  );
}

// ============================================
// VARIATION 43: CASINO ROULETTE
// ============================================

function JourneyRoulette() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.3 });
  const [spinning, setSpinning] = useState(false);
  const [rotation, setRotation] = useState(0);
  const [winner, setWinner] = useState(null);

  const spin = () => {
    if (spinning) return;
    setSpinning(true);
    setWinner(null);
    const spins = 3 + Math.random() * 3;
    const finalAngle = spins * 360 + Math.random() * 360;
    setRotation(prev => prev + finalAngle);

    setTimeout(() => {
      setSpinning(false);
      const idx = Math.floor(Math.random() * destinations.length);
      setWinner(destinations[idx].name);
    }, 4000);
  };

  return (
    <div className="journey-var journey-var--roulette" ref={ref}>
      <div className="journey-var__roulette-table">
        <motion.div
          className="journey-var__roulette-wheel"
          style={{ rotate: rotation }}
          transition={{ duration: 4, ease: [0.25, 0.1, 0.25, 1] }}
        >
          <svg viewBox="0 0 300 300" preserveAspectRatio="xMidYMid meet">
            {destinations.map((dest, i) => {
              const angle = (i / destinations.length) * 360;
              const rad = (angle * Math.PI) / 180;
              const nextRad = ((angle + 360 / destinations.length) * Math.PI) / 180;
              const x1 = 150 + Math.cos(rad) * 130;
              const y1 = 150 + Math.sin(rad) * 130;
              const x2 = 150 + Math.cos(nextRad) * 130;
              const y2 = 150 + Math.sin(nextRad) * 130;
              const midAngle = angle + 360 / destinations.length / 2;
              const midRad = (midAngle * Math.PI) / 180;
              const labelX = 150 + Math.cos(midRad) * 90;
              const labelY = 150 + Math.sin(midRad) * 90;

              return (
                <g key={dest.id}>
                  <path
                    d={`M150,150 L${x1},${y1} A130,130 0 0,1 ${x2},${y2} Z`}
                    fill={i % 2 === 0 ? '#c41e3a' : '#1a1a1a'}
                    stroke="#8b7355"
                    strokeWidth="2"
                  />
                  <text
                    x={labelX}
                    y={labelY}
                    textAnchor="middle"
                    dominantBaseline="middle"
                    className="journey-var__roulette-label"
                    transform={`rotate(${midAngle + 90}, ${labelX}, ${labelY})`}
                  >
                    {dest.name.toUpperCase()}
                  </text>
                </g>
              );
            })}
            <circle cx="150" cy="150" r="30" fill="#8b7355" />
            <circle cx="150" cy="150" r="20" fill="#c9a959" />
          </svg>
        </motion.div>

        <div className="journey-var__roulette-pointer">▼</div>

        <motion.button
          className="journey-var__roulette-spin"
          onClick={spin}
          disabled={spinning}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          {spinning ? 'SPINNING...' : 'SPIN'}
        </motion.button>

        {winner && (
          <motion.div
            className="journey-var__roulette-winner"
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
          >
            🎉 {winner}!
          </motion.div>
        )}
      </div>
      <p className="journey-var__caption">Spin to pick your next adventure</p>

      <style>{`
        .journey-var--roulette { background: #1a472a; padding: 2rem; border-radius: 12px; border: 8px solid #8b7355; }
        .journey-var__roulette-table { display: flex; flex-direction: column; align-items: center; gap: 1.5rem; }
        .journey-var__roulette-wheel { width: 280px; height: 280px; }
        .journey-var__roulette-label { font-family: 'Space Grotesk', sans-serif; font-size: 9px; fill: #fff; font-weight: 700; }
        .journey-var__roulette-pointer { font-size: 2rem; color: #c9a959; margin-top: -1rem; text-shadow: 0 2px 4px rgba(0,0,0,0.5); }
        .journey-var__roulette-spin { padding: 0.75rem 2rem; background: #c9a959; color: #1a1a1a; border: none; border-radius: 30px; font-family: 'Space Grotesk', sans-serif; font-size: 1rem; font-weight: 700; cursor: pointer; text-transform: uppercase; letter-spacing: 0.1em; }
        .journey-var__roulette-spin:disabled { opacity: 0.5; cursor: not-allowed; }
        .journey-var__roulette-winner { font-family: 'Space Grotesk', sans-serif; font-size: 1.5rem; color: #c9a959; font-weight: 700; }
        .journey-var--roulette .journey-var__caption { color: #a3be8c; margin-top: 1rem; }
      `}</style>
    </div>
  );
}

// ============================================
// VARIATION 44: BOOKSHELF SPINES
// ============================================

function JourneyBookshelf() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.3 });

  const books = [
    { dest: 'ARCTIC', year: '2022', color: '#3b82f6', width: 45 },
    { dest: 'ICELAND', year: '2019', color: '#8b5cf6', width: 35 },
    { dest: 'MOROCCO', year: '2021', color: '#f97316', width: 50 },
    { dest: 'NORWAY', year: '2018', color: '#06b6d4', width: 30 },
    { dest: 'ALPS', year: '2020', color: '#22c55e', width: 40 },
    { dest: 'GREENLAND', year: '2023', color: '#14b8a6', width: 55 },
    { dest: 'BAHAMAS', year: '2025', color: '#ec4899', width: 38 },
    { dest: 'COSTA RICA', year: '2026', color: '#84cc16', width: 48 },
  ];

  return (
    <div className="journey-var journey-var--bookshelf" ref={ref}>
      <div className="journey-var__bookshelf-frame">
        <div className="journey-var__bookshelf-shelf">
          {books.map((book, i) => (
            <motion.div
              key={book.dest}
              className="journey-var__book"
              style={{
                background: book.color,
                width: book.width,
              }}
              initial={{ y: 50, opacity: 0 }}
              animate={isInView ? { y: 0, opacity: 1 } : {}}
              transition={{ delay: i * 0.1, duration: 0.5 }}
              whileHover={{ y: -10 }}
            >
              <span className="journey-var__book-title">{book.dest}</span>
              <span className="journey-var__book-year">{book.year}</span>
              <span className="journey-var__book-author">HQ AVIATION</span>
            </motion.div>
          ))}
        </div>
        <div className="journey-var__bookshelf-wood" />
      </div>
      <p className="journey-var__caption">Stories from our expedition library</p>

      <style>{`
        .journey-var--bookshelf { background: #2d1f1a; padding: 3rem 2rem 2rem; border-radius: 12px; }
        .journey-var__bookshelf-frame { background: linear-gradient(180deg, #4a3728 0%, #3d2d22 100%); padding: 2rem 1.5rem 0; border-radius: 8px; box-shadow: inset 0 5px 20px rgba(0,0,0,0.3); }
        .journey-var__bookshelf-shelf { display: flex; gap: 4px; align-items: flex-end; justify-content: center; min-height: 200px; }
        .journey-var__book { height: 180px; border-radius: 2px 4px 4px 2px; display: flex; flex-direction: column; justify-content: space-between; padding: 0.5rem 0; writing-mode: vertical-rl; text-orientation: mixed; cursor: pointer; transition: transform 0.2s; box-shadow: 2px 0 5px rgba(0,0,0,0.3), inset -2px 0 4px rgba(255,255,255,0.1); }
        .journey-var__book-title { font-family: 'Space Grotesk', sans-serif; font-size: 0.75rem; font-weight: 700; color: #fff; text-shadow: 0 1px 2px rgba(0,0,0,0.3); transform: rotate(180deg); }
        .journey-var__book-year { font-family: 'Share Tech Mono', monospace; font-size: 0.65rem; color: rgba(255,255,255,0.7); transform: rotate(180deg); }
        .journey-var__book-author { font-family: 'Space Grotesk', sans-serif; font-size: 0.5rem; color: rgba(255,255,255,0.5); transform: rotate(180deg); letter-spacing: 0.1em; }
        .journey-var__bookshelf-wood { height: 20px; background: linear-gradient(180deg, #5a4535 0%, #3d2d22 100%); margin: 0 -1.5rem; border-radius: 0 0 8px 8px; box-shadow: 0 5px 15px rgba(0,0,0,0.3); }
        .journey-var--bookshelf .journey-var__caption { color: #a38b7a; margin-top: 1.5rem; }
      `}</style>
    </div>
  );
}

// ============================================
// VARIATION 45: SPLIT-FLAP DISPLAY
// ============================================

function JourneySplitFlap() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.3 });
  const [currentDest, setCurrentDest] = useState(0);

  useEffect(() => {
    if (!isInView) return;
    const interval = setInterval(() => {
      setCurrentDest(prev => (prev + 1) % destinations.length);
    }, 3000);
    return () => clearInterval(interval);
  }, [isInView]);

  const dest = destinations[currentDest];

  return (
    <div className="journey-var journey-var--splitflap" ref={ref}>
      <div className="journey-var__splitflap-board">
        <div className="journey-var__splitflap-row">
          <span className="journey-var__splitflap-label">DESTINATION:</span>
          <div className="journey-var__splitflap-chars">
            {dest.name.toUpperCase().padEnd(12, ' ').split('').map((char, i) => (
              <motion.div
                key={`${currentDest}-${i}`}
                className="journey-var__splitflap-char"
                initial={{ rotateX: -90 }}
                animate={{ rotateX: 0 }}
                transition={{ delay: i * 0.05, duration: 0.2 }}
              >
                {char}
              </motion.div>
            ))}
          </div>
        </div>
        <div className="journey-var__splitflap-row">
          <span className="journey-var__splitflap-label">DISTANCE:</span>
          <div className="journey-var__splitflap-chars">
            {dest.distance.padEnd(10, ' ').split('').map((char, i) => (
              <motion.div
                key={`d-${currentDest}-${i}`}
                className="journey-var__splitflap-char"
                initial={{ rotateX: -90 }}
                animate={{ rotateX: 0 }}
                transition={{ delay: 0.3 + i * 0.05, duration: 0.2 }}
              >
                {char}
              </motion.div>
            ))}
          </div>
        </div>
        <div className="journey-var__splitflap-row">
          <span className="journey-var__splitflap-label">DIRECTION:</span>
          <div className="journey-var__splitflap-chars">
            {dest.direction.padEnd(4, ' ').split('').map((char, i) => (
              <motion.div
                key={`dir-${currentDest}-${i}`}
                className="journey-var__splitflap-char"
                initial={{ rotateX: -90 }}
                animate={{ rotateX: 0 }}
                transition={{ delay: 0.5 + i * 0.05, duration: 0.2 }}
              >
                {char}
              </motion.div>
            ))}
          </div>
        </div>
      </div>
      <p className="journey-var__caption">Classic departure display</p>

      <style>{`
        .journey-var--splitflap { background: #1a1a1a; padding: 2rem; border-radius: 12px; }
        .journey-var__splitflap-board { background: #0a0a0a; padding: 2rem; border-radius: 8px; border: 4px solid #333; }
        .journey-var__splitflap-row { display: flex; align-items: center; gap: 1.5rem; margin-bottom: 1rem; }
        .journey-var__splitflap-row:last-child { margin-bottom: 0; }
        .journey-var__splitflap-label { font-family: 'Space Grotesk', sans-serif; font-size: 0.8rem; color: #666; width: 100px; text-transform: uppercase; letter-spacing: 0.1em; }
        .journey-var__splitflap-chars { display: flex; gap: 3px; }
        .journey-var__splitflap-char { width: 32px; height: 48px; background: #1a1a1a; border: 1px solid #333; display: flex; align-items: center; justify-content: center; font-family: 'Share Tech Mono', monospace; font-size: 1.5rem; color: #fbbf24; perspective: 100px; }
        .journey-var--splitflap .journey-var__caption { color: #666; margin-top: 1.5rem; }
      `}</style>
    </div>
  );
}

// ============================================
// VARIATION 46: MOSAIC TILES
// ============================================

function JourneyMosaic() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.3 });

  const tiles = [
    { dest: 'ARCTIC', emoji: '🧊', pattern: 'dots' },
    { dest: 'ICELAND', emoji: '🌋', pattern: 'lines' },
    { dest: 'MOROCCO', emoji: '🏜️', pattern: 'waves' },
    { dest: 'NORWAY', emoji: '🏔️', pattern: 'dots' },
    { dest: 'ALPS', emoji: '⛷️', pattern: 'lines' },
    { dest: 'GREENLAND', emoji: '❄️', pattern: 'waves' },
    { dest: 'BAHAMAS', emoji: '🏝️', pattern: 'dots' },
    { dest: 'COSTA RICA', emoji: '🦜', pattern: 'lines' },
    { dest: 'DENHAM', emoji: '🚁', pattern: 'center' },
  ];

  const colors = ['#3b82f6', '#8b5cf6', '#f97316', '#06b6d4', '#22c55e', '#14b8a6', '#ec4899', '#84cc16', '#1a1a1a'];

  return (
    <div className="journey-var journey-var--mosaic" ref={ref}>
      <div className="journey-var__mosaic-grid">
        {tiles.map((tile, i) => (
          <motion.div
            key={tile.dest}
            className={`journey-var__mosaic-tile journey-var__mosaic-tile--${tile.pattern}`}
            style={{ background: colors[i] }}
            initial={{ scale: 0, rotate: -10 }}
            animate={isInView ? { scale: 1, rotate: 0 } : {}}
            transition={{ delay: i * 0.08, type: 'spring', stiffness: 200 }}
            whileHover={{ scale: 1.05, zIndex: 10 }}
          >
            <span className="journey-var__mosaic-emoji">{tile.emoji}</span>
            <span className="journey-var__mosaic-name">{tile.dest}</span>
          </motion.div>
        ))}
      </div>
      <p className="journey-var__caption">A mosaic of adventures</p>

      <style>{`
        .journey-var--mosaic { background: #f5f0e6; padding: 2rem; border-radius: 0; }
        .journey-var__mosaic-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 8px; max-width: 450px; margin: 0 auto; }
        .journey-var__mosaic-tile { aspect-ratio: 1; display: flex; flex-direction: column; align-items: center; justify-content: center; border-radius: 4px; cursor: pointer; transition: all 0.3s; position: relative; overflow: hidden; }
        .journey-var__mosaic-tile--dots::before { content: ''; position: absolute; inset: 0; background-image: radial-gradient(circle, rgba(255,255,255,0.2) 2px, transparent 2px); background-size: 12px 12px; }
        .journey-var__mosaic-tile--lines::before { content: ''; position: absolute; inset: 0; background: repeating-linear-gradient(45deg, transparent, transparent 5px, rgba(255,255,255,0.1) 5px, rgba(255,255,255,0.1) 10px); }
        .journey-var__mosaic-tile--waves::before { content: ''; position: absolute; inset: 0; background: repeating-linear-gradient(0deg, transparent, transparent 8px, rgba(255,255,255,0.1) 8px, rgba(255,255,255,0.1) 10px); }
        .journey-var__mosaic-emoji { font-size: 2.5rem; position: relative; z-index: 1; }
        .journey-var__mosaic-name { font-family: 'Space Grotesk', sans-serif; font-size: 0.7rem; color: #fff; font-weight: 700; margin-top: 0.5rem; text-shadow: 0 1px 2px rgba(0,0,0,0.3); position: relative; z-index: 1; }
        .journey-var--mosaic .journey-var__caption { margin-top: 2rem; }
      `}</style>
    </div>
  );
}

// ============================================
// VARIATION 47: QR/BARCODE
// ============================================

function JourneyBarcode() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.3 });

  const barcodes = destinations.map(d => ({
    ...d,
    code: Array(30).fill(0).map(() => Math.random() > 0.5 ? 1 : 0)
  }));

  return (
    <div className="journey-var journey-var--barcode" ref={ref}>
      <div className="journey-var__barcode-scanner">
        {barcodes.map((item, i) => (
          <motion.div
            key={item.id}
            className="journey-var__barcode-item"
            initial={{ opacity: 0, x: -30 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ delay: i * 0.1, duration: 0.4 }}
          >
            <div className="journey-var__barcode-bars">
              {item.code.map((bar, j) => (
                <div
                  key={j}
                  className="journey-var__barcode-bar"
                  style={{
                    width: bar ? (Math.random() * 2 + 1) : 1,
                    background: bar ? '#1a1a1a' : 'transparent'
                  }}
                />
              ))}
            </div>
            <div className="journey-var__barcode-info">
              <span className="journey-var__barcode-dest">{item.name}</span>
              <span className="journey-var__barcode-num">HQ-{item.id.toUpperCase().slice(0, 6)}</span>
            </div>
          </motion.div>
        ))}
      </div>
      <p className="journey-var__caption">Scan to adventure</p>

      <style>{`
        .journey-var--barcode { background: #fff; padding: 2rem; border: 1px solid #e5e5e5; }
        .journey-var__barcode-scanner { display: grid; grid-template-columns: repeat(2, 1fr); gap: 1.5rem; }
        .journey-var__barcode-item { padding: 1rem; border: 1px solid #e5e5e5; border-radius: 8px; }
        .journey-var__barcode-bars { display: flex; gap: 1px; height: 50px; align-items: stretch; margin-bottom: 0.75rem; }
        .journey-var__barcode-bar { height: 100%; }
        .journey-var__barcode-info { display: flex; justify-content: space-between; align-items: baseline; }
        .journey-var__barcode-dest { font-family: 'Space Grotesk', sans-serif; font-size: 0.9rem; font-weight: 700; color: #1a1a1a; }
        .journey-var__barcode-num { font-family: 'Share Tech Mono', monospace; font-size: 0.7rem; color: #888; }
      `}</style>
    </div>
  );
}

// ============================================
// VARIATION 48: ORIGAMI MAP
// ============================================

function JourneyOrigami() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.3 });

  const folds = [
    { dest: 'ARCTIC', x: 100, y: 80, angle: -15 },
    { dest: 'ICELAND', x: 250, y: 120, angle: 10 },
    { dest: 'MOROCCO', x: 400, y: 200, angle: -5 },
    { dest: 'NORWAY', x: 550, y: 100, angle: 8 },
    { dest: 'ALPS', x: 700, y: 180, angle: -12 },
    { dest: 'GREENLAND', x: 180, y: 260, angle: 6 },
    { dest: 'BAHAMAS', x: 480, y: 300, angle: -8 },
    { dest: 'COSTA RICA', x: 650, y: 280, angle: 15 },
  ];

  return (
    <div className="journey-var journey-var--origami" ref={ref}>
      <svg viewBox="0 0 800 380" preserveAspectRatio="xMidYMid meet">
        {/* Paper texture background */}
        <rect x="0" y="0" width="800" height="380" fill="#f5f0e6" />

        {/* Fold lines */}
        <line x1="0" y1="190" x2="800" y2="190" stroke="#d4c5a9" strokeWidth="1" strokeDasharray="10 5" />
        <line x1="400" y1="0" x2="400" y2="380" stroke="#d4c5a9" strokeWidth="1" strokeDasharray="10 5" />

        {/* Center - Denham */}
        <motion.g
          initial={{ scale: 0 }}
          animate={isInView ? { scale: 1 } : {}}
          transition={{ duration: 0.5 }}
        >
          <polygon points="400,170 420,200 400,230 380,200" fill="#1a1a1a" />
          <text x="400" y="255" textAnchor="middle" className="journey-var__origami-center">DENHAM</text>
        </motion.g>

        {/* Paper airplane destinations */}
        {folds.map((fold, i) => (
          <motion.g
            key={fold.dest}
            transform={`rotate(${fold.angle}, ${fold.x}, ${fold.y})`}
            initial={{ opacity: 0, scale: 0 }}
            animate={isInView ? { opacity: 1, scale: 1 } : {}}
            transition={{ delay: 0.3 + i * 0.12, type: 'spring' }}
          >
            <polygon
              points={`${fold.x},${fold.y - 20} ${fold.x + 25},${fold.y + 10} ${fold.x},${fold.y + 5} ${fold.x - 25},${fold.y + 10}`}
              fill="#fff"
              stroke="#1a1a1a"
              strokeWidth="1"
              style={{ filter: 'drop-shadow(2px 2px 3px rgba(0,0,0,0.1))' }}
            />
            <text x={fold.x} y={fold.y + 35} textAnchor="middle" className="journey-var__origami-label">{fold.dest}</text>
          </motion.g>
        ))}
      </svg>
      <p className="journey-var__caption">Folded journeys take flight</p>

      <style>{`
        .journey-var--origami { background: #8b7355; padding: 2rem; border-radius: 0; }
        .journey-var__origami-center { font-family: 'Space Grotesk', sans-serif; font-size: 11px; fill: #1a1a1a; font-weight: 700; }
        .journey-var__origami-label { font-family: 'Space Grotesk', sans-serif; font-size: 10px; fill: #1a1a1a; font-weight: 600; }
        .journey-var--origami .journey-var__caption { color: #d4c5a9; margin-top: 1.5rem; }
      `}</style>
    </div>
  );
}

// ============================================
// VARIATION 49: SATELLITE VIEW
// ============================================

function JourneySatellite() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.3 });

  const targets = [
    { dest: 'ARCTIC', x: 200, y: 60, status: 'ACQUIRED' },
    { dest: 'ICELAND', x: 320, y: 140, status: 'TRACKING' },
    { dest: 'MOROCCO', x: 450, y: 280, status: 'ACQUIRED' },
    { dest: 'NORWAY', x: 580, y: 90, status: 'ACQUIRED' },
    { dest: 'ALPS', x: 680, y: 180, status: 'TRACKING' },
    { dest: 'GREENLAND', x: 150, y: 220, status: 'ACQUIRED' },
    { dest: 'BAHAMAS', x: 750, y: 260, status: 'STANDBY' },
  ];

  return (
    <div className="journey-var journey-var--satellite" ref={ref}>
      <div className="journey-var__satellite-hud">
        <div className="journey-var__satellite-header">
          <span>SAT-VIEW // HQ-ORBITAL-1</span>
          <span className="journey-var__satellite-status">● ONLINE</span>
        </div>

        <svg viewBox="0 0 900 350" preserveAspectRatio="xMidYMid meet">
          {/* Scan grid */}
          {[...Array(10)].map((_, i) => (
            <g key={i}>
              <line x1={i * 100} y1="0" x2={i * 100} y2="350" stroke="#0a3" strokeWidth="0.5" opacity="0.3" />
              <line x1="0" y1={i * 35} x2="900" y2={i * 35} stroke="#0a3" strokeWidth="0.5" opacity="0.3" />
            </g>
          ))}

          {/* Center - Denham Base */}
          <motion.g
            initial={{ scale: 0 }}
            animate={isInView ? { scale: 1 } : {}}
          >
            <rect x="430" y="155" width="40" height="40" fill="none" stroke="#0f0" strokeWidth="2" />
            <line x1="420" y1="175" x2="480" y2="175" stroke="#0f0" strokeWidth="1" />
            <line x1="450" y1="145" x2="450" y2="205" stroke="#0f0" strokeWidth="1" />
            <text x="450" y="220" textAnchor="middle" className="journey-var__satellite-base">DENHAM BASE</text>
          </motion.g>

          {/* Targets */}
          {targets.map((target, i) => (
            <motion.g
              key={target.dest}
              initial={{ opacity: 0 }}
              animate={isInView ? { opacity: 1 } : {}}
              transition={{ delay: 0.5 + i * 0.15 }}
            >
              <motion.circle
                cx={target.x} cy={target.y} r="20"
                fill="none"
                stroke={target.status === 'ACQUIRED' ? '#0f0' : target.status === 'TRACKING' ? '#ff0' : '#888'}
                strokeWidth="1"
                strokeDasharray="4 2"
                animate={{ rotate: 360 }}
                transition={{ duration: 10, repeat: Infinity, ease: 'linear' }}
                style={{ transformOrigin: `${target.x}px ${target.y}px` }}
              />
              <circle cx={target.x} cy={target.y} r="4" fill={target.status === 'ACQUIRED' ? '#0f0' : '#ff0'} />
              <text x={target.x} y={target.y - 28} textAnchor="middle" className="journey-var__satellite-label">{target.dest}</text>
              <text x={target.x} y={target.y + 38} textAnchor="middle" className="journey-var__satellite-status-text">{target.status}</text>
            </motion.g>
          ))}
        </svg>

        <div className="journey-var__satellite-footer">
          <span>LAT: 51.5833°N</span>
          <span>LON: 0.5167°W</span>
          <span>ALT: 420km</span>
        </div>
      </div>
      <p className="journey-var__caption">Orbital reconnaissance of destinations</p>

      <style>{`
        .journey-var--satellite { background: #000; padding: 0; border-radius: 12px; overflow: hidden; }
        .journey-var__satellite-hud { background: #050a05; border: 2px solid #0a3; }
        .journey-var__satellite-header { display: flex; justify-content: space-between; padding: 0.75rem 1rem; border-bottom: 1px solid #0a3; font-family: 'Share Tech Mono', monospace; font-size: 0.8rem; color: #0f0; }
        .journey-var__satellite-status { color: #0f0; }
        .journey-var__satellite-base { font-family: 'Share Tech Mono', monospace; font-size: 10px; fill: #0f0; }
        .journey-var__satellite-label { font-family: 'Share Tech Mono', monospace; font-size: 9px; fill: #0f0; }
        .journey-var__satellite-status-text { font-family: 'Share Tech Mono', monospace; font-size: 7px; fill: #888; }
        .journey-var__satellite-footer { display: flex; justify-content: space-around; padding: 0.75rem; border-top: 1px solid #0a3; font-family: 'Share Tech Mono', monospace; font-size: 0.75rem; color: #0a3; }
        .journey-var--satellite .journey-var__caption { color: #0f0; padding: 1rem; margin: 0; background: #050a05; }
      `}</style>
    </div>
  );
}

// ============================================
// VARIATION 50: FLOATING BUBBLES
// ============================================

function JourneyBubbles() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.3 });

  const bubbles = [
    { dest: 'ARCTIC', x: 120, y: 100, size: 90, delay: 0 },
    { dest: 'ICELAND', x: 280, y: 180, size: 70, delay: 0.2 },
    { dest: 'MOROCCO', x: 450, y: 120, size: 80, delay: 0.1 },
    { dest: 'NORWAY', x: 600, y: 200, size: 65, delay: 0.3 },
    { dest: 'ALPS', x: 750, y: 100, size: 75, delay: 0.15 },
    { dest: 'GREENLAND', x: 200, y: 280, size: 85, delay: 0.25 },
    { dest: 'BAHAMAS', x: 520, y: 290, size: 70, delay: 0.35 },
    { dest: 'COSTA RICA', x: 700, y: 280, size: 78, delay: 0.4 },
  ];

  return (
    <div className="journey-var journey-var--bubbles" ref={ref}>
      <svg viewBox="0 0 900 380" preserveAspectRatio="xMidYMid meet">
        <defs>
          <radialGradient id="bubbleGrad" cx="30%" cy="30%">
            <stop offset="0%" stopColor="rgba(255,255,255,0.8)" />
            <stop offset="100%" stopColor="rgba(255,255,255,0)" />
          </radialGradient>
          <linearGradient id="bubbleShine" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="rgba(255,255,255,0.6)" />
            <stop offset="50%" stopColor="rgba(255,255,255,0)" />
            <stop offset="100%" stopColor="rgba(255,255,255,0.2)" />
          </linearGradient>
        </defs>

        {/* Center - Denham */}
        <motion.g
          initial={{ scale: 0 }}
          animate={isInView ? { scale: 1 } : {}}
          transition={{ type: 'spring', stiffness: 100 }}
        >
          <circle cx="450" cy="190" r="50" fill="rgba(26, 26, 26, 0.9)" />
          <circle cx="450" cy="190" r="50" fill="url(#bubbleGrad)" opacity="0.3" />
          <text x="450" y="185" textAnchor="middle" className="journey-var__bubbles-center">HQ</text>
          <text x="450" y="205" textAnchor="middle" className="journey-var__bubbles-sub">DENHAM</text>
        </motion.g>

        {/* Destination bubbles */}
        {bubbles.map((bubble, i) => (
          <motion.g
            key={bubble.dest}
            initial={{ scale: 0, y: 50 }}
            animate={isInView ? {
              scale: 1,
              y: [0, -10, 0],
            } : {}}
            transition={{
              scale: { delay: bubble.delay, type: 'spring' },
              y: { delay: bubble.delay + 0.5, duration: 3, repeat: Infinity, repeatType: 'reverse' }
            }}
          >
            <circle
              cx={bubble.x}
              cy={bubble.y}
              r={bubble.size / 2}
              fill="rgba(37, 99, 235, 0.15)"
              stroke="rgba(37, 99, 235, 0.4)"
              strokeWidth="2"
            />
            <ellipse
              cx={bubble.x - bubble.size * 0.15}
              cy={bubble.y - bubble.size * 0.15}
              rx={bubble.size * 0.15}
              ry={bubble.size * 0.1}
              fill="rgba(255,255,255,0.6)"
            />
            <text x={bubble.x} y={bubble.y + 5} textAnchor="middle" className="journey-var__bubbles-label">{bubble.dest}</text>
          </motion.g>
        ))}
      </svg>
      <p className="journey-var__caption">Dreams floating towards reality</p>

      <style>{`
        .journey-var--bubbles { background: linear-gradient(180deg, #e0f2fe 0%, #bae6fd 50%, #7dd3fc 100%); padding: 2rem; border-radius: 12px; }
        .journey-var__bubbles-center { font-family: 'Space Grotesk', sans-serif; font-size: 20px; fill: #fff; font-weight: 700; }
        .journey-var__bubbles-sub { font-family: 'Share Tech Mono', monospace; font-size: 10px; fill: rgba(255,255,255,0.8); }
        .journey-var__bubbles-label { font-family: 'Space Grotesk', sans-serif; font-size: 11px; fill: #1e40af; font-weight: 700; }
        .journey-var--bubbles .journey-var__caption { color: #1e40af; margin-top: 1rem; }
      `}</style>
    </div>
  );
}

// ============================================
// VARIATION 51: CLOCKWORK GEARS
// ============================================

function JourneyClockwork() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.3 });

  const gears = [
    { dest: 'ARCTIC', x: 150, y: 120, size: 80, teeth: 12, speed: 8 },
    { dest: 'ICELAND', x: 300, y: 200, size: 60, teeth: 10, speed: -10 },
    { dest: 'MOROCCO', x: 450, y: 280, size: 70, teeth: 11, speed: 7 },
    { dest: 'NORWAY', x: 580, y: 150, size: 55, teeth: 9, speed: -12 },
    { dest: 'ALPS', x: 700, y: 220, size: 65, teeth: 10, speed: 9 },
    { dest: 'GREENLAND', x: 220, y: 300, size: 75, teeth: 12, speed: -6 },
  ];

  const generateGearPath = (cx, cy, outerR, innerR, teeth) => {
    let path = '';
    const toothAngle = (2 * Math.PI) / teeth;
    const toothWidth = toothAngle * 0.3;

    for (let i = 0; i < teeth; i++) {
      const angle = i * toothAngle;
      const x1 = cx + Math.cos(angle - toothWidth) * innerR;
      const y1 = cy + Math.sin(angle - toothWidth) * innerR;
      const x2 = cx + Math.cos(angle - toothWidth * 0.5) * outerR;
      const y2 = cy + Math.sin(angle - toothWidth * 0.5) * outerR;
      const x3 = cx + Math.cos(angle + toothWidth * 0.5) * outerR;
      const y3 = cy + Math.sin(angle + toothWidth * 0.5) * outerR;
      const x4 = cx + Math.cos(angle + toothWidth) * innerR;
      const y4 = cy + Math.sin(angle + toothWidth) * innerR;

      if (i === 0) path += `M${x1},${y1}`;
      path += ` L${x2},${y2} L${x3},${y3} L${x4},${y4}`;
    }
    path += ' Z';
    return path;
  };

  return (
    <div className="journey-var journey-var--clockwork" ref={ref}>
      <svg viewBox="0 0 850 400" preserveAspectRatio="xMidYMid meet">
        {/* Background plate */}
        <rect x="20" y="20" width="810" height="360" fill="#1a1510" rx="8" />

        {/* Center gear - Denham */}
        <motion.g
          initial={{ scale: 0, rotate: 0 }}
          animate={isInView ? { scale: 1, rotate: 360 } : {}}
          transition={{ scale: { duration: 0.5 }, rotate: { duration: 20, repeat: Infinity, ease: 'linear' } }}
          style={{ transformOrigin: '425px 200px' }}
        >
          <path
            d={generateGearPath(425, 200, 50, 40, 14)}
            fill="#c9a959"
            stroke="#8b7355"
            strokeWidth="2"
          />
          <circle cx="425" cy="200" r="25" fill="#1a1510" stroke="#c9a959" strokeWidth="2" />
          <text x="425" y="196" textAnchor="middle" className="journey-var__clockwork-center">HQ</text>
          <text x="425" y="210" textAnchor="middle" className="journey-var__clockwork-sub">DENHAM</text>
        </motion.g>

        {/* Destination gears */}
        {gears.map((gear, i) => (
          <motion.g
            key={gear.dest}
            initial={{ scale: 0, rotate: 0 }}
            animate={isInView ? { scale: 1, rotate: 360 * Math.sign(gear.speed) } : {}}
            transition={{
              scale: { delay: i * 0.1, duration: 0.4 },
              rotate: { duration: Math.abs(gear.speed), repeat: Infinity, ease: 'linear' }
            }}
            style={{ transformOrigin: `${gear.x}px ${gear.y}px` }}
          >
            <path
              d={generateGearPath(gear.x, gear.y, gear.size / 2, gear.size / 2 - 8, gear.teeth)}
              fill="#8b7355"
              stroke="#5c4a35"
              strokeWidth="1.5"
            />
            <circle cx={gear.x} cy={gear.y} r={gear.size / 4} fill="#1a1510" stroke="#8b7355" strokeWidth="1" />
            <text x={gear.x} y={gear.y + 4} textAnchor="middle" className="journey-var__clockwork-label">{gear.dest}</text>
          </motion.g>
        ))}

        {/* Connecting rods */}
        {gears.slice(0, 4).map((gear, i) => (
          <motion.line
            key={`rod-${i}`}
            x1="425" y1="200"
            x2={gear.x} y2={gear.y}
            stroke="#5c4a35"
            strokeWidth="3"
            initial={{ pathLength: 0 }}
            animate={isInView ? { pathLength: 1 } : {}}
            transition={{ delay: 0.5 + i * 0.1, duration: 0.5 }}
          />
        ))}
      </svg>
      <p className="journey-var__caption">Precision engineered adventures</p>

      <style>{`
        .journey-var--clockwork { background: #2d2418; padding: 2rem; border-radius: 0; border: 8px solid #5c4a35; }
        .journey-var__clockwork-center { font-family: 'Space Grotesk', sans-serif; font-size: 14px; fill: #c9a959; font-weight: 700; }
        .journey-var__clockwork-sub { font-family: 'Share Tech Mono', monospace; font-size: 8px; fill: #8b7355; }
        .journey-var__clockwork-label { font-family: 'Space Grotesk', sans-serif; font-size: 8px; fill: #c9a959; font-weight: 600; }
        .journey-var--clockwork .journey-var__caption { color: #c9a959; margin-top: 1.5rem; }
      `}</style>
    </div>
  );
}

// ============================================
// VARIATION 52: HOLOGRAPHIC DISPLAY
// ============================================

function JourneyHologram() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.3 });

  const points = [
    { name: 'ARCTIC', x: 150, y: 80, z: 0.9 },
    { name: 'ICELAND', x: 280, y: 150, z: 0.7 },
    { name: 'MOROCCO', x: 420, y: 280, z: 0.8 },
    { name: 'NORWAY', x: 550, y: 100, z: 0.6 },
    { name: 'ALPS', x: 680, y: 200, z: 0.75 },
    { name: 'GREENLAND', x: 200, y: 250, z: 0.85 },
  ];

  return (
    <div className="journey-var journey-var--hologram" ref={ref}>
      <div className="journey-var__hologram-frame">
        <svg viewBox="0 0 800 350" preserveAspectRatio="xMidYMid meet">
          {/* Grid floor */}
          {[...Array(15)].map((_, i) => (
            <motion.line
              key={`grid-${i}`}
              x1={50 + i * 50} y1="320" x2={200 + i * 30} y2="200"
              stroke="#0ff" strokeWidth="0.5" opacity="0.2"
              initial={{ pathLength: 0 }}
              animate={isInView ? { pathLength: 1 } : {}}
              transition={{ delay: i * 0.02, duration: 0.5 }}
            />
          ))}

          {/* Center beacon */}
          <motion.g
            initial={{ scale: 0 }}
            animate={isInView ? { scale: 1 } : {}}
          >
            <circle cx="400" cy="260" r="20" fill="none" stroke="#0ff" strokeWidth="2" opacity="0.8" />
            <circle cx="400" cy="260" r="10" fill="#0ff" opacity="0.5" />
            <motion.line
              x1="400" y1="260" x2="400" y2="100"
              stroke="#0ff" strokeWidth="1" strokeDasharray="4 4"
              animate={{ opacity: [0.3, 1, 0.3] }}
              transition={{ duration: 2, repeat: Infinity }}
            />
            <text x="400" y="290" textAnchor="middle" className="journey-var__hologram-center">DENHAM HQ</text>
          </motion.g>

          {/* Holographic destination markers */}
          {points.map((point, i) => (
            <motion.g
              key={point.name}
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: point.z, y: 0 } : {}}
              transition={{ delay: 0.5 + i * 0.15 }}
            >
              <line x1={point.x} y1={point.y} x2={point.x} y2={point.y + 40} stroke="#0ff" strokeWidth="1" opacity="0.5" />
              <motion.circle
                cx={point.x} cy={point.y} r="8"
                fill="none" stroke="#0ff" strokeWidth="2"
                animate={{ scale: [1, 1.2, 1], opacity: [0.8, 1, 0.8] }}
                transition={{ duration: 2, repeat: Infinity, delay: i * 0.2 }}
              />
              <circle cx={point.x} cy={point.y} r="3" fill="#0ff" />
              <text x={point.x} y={point.y - 15} textAnchor="middle" className="journey-var__hologram-label">{point.name}</text>
            </motion.g>
          ))}

          {/* Scan effect */}
          <motion.rect
            x="0" y="0" width="800" height="4"
            fill="url(#holoGrad)"
            animate={{ y: [0, 350, 0] }}
            transition={{ duration: 4, repeat: Infinity, ease: 'linear' }}
          />
          <defs>
            <linearGradient id="holoGrad">
              <stop offset="0%" stopColor="transparent" />
              <stop offset="50%" stopColor="#0ff" stopOpacity="0.5" />
              <stop offset="100%" stopColor="transparent" />
            </linearGradient>
          </defs>
        </svg>
      </div>
      <p className="journey-var__caption">Holographic expedition display</p>

      <style>{`
        .journey-var--hologram { background: #050510; padding: 2rem; border-radius: 12px; }
        .journey-var__hologram-frame { background: radial-gradient(ellipse at center bottom, #0a1525 0%, #050510 100%); border: 1px solid #0ff3; border-radius: 8px; overflow: hidden; }
        .journey-var__hologram-center { font-family: 'Share Tech Mono', monospace; font-size: 10px; fill: #0ff; }
        .journey-var__hologram-label { font-family: 'Share Tech Mono', monospace; font-size: 9px; fill: #0ff; }
        .journey-var--hologram .journey-var__caption { color: #0ff; margin-top: 1.5rem; }
      `}</style>
    </div>
  );
}

// ============================================
// VARIATION 53: SUBWAY LINE MAP
// ============================================

function JourneySubwayLines() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.3 });

  const lines = [
    { name: 'POLAR LINE', color: '#0ea5e9', stops: ['DENHAM', 'NORWAY', 'ICELAND', 'ARCTIC'] },
    { name: 'DESERT LINE', color: '#f97316', stops: ['DENHAM', 'ALPS', 'MOROCCO'] },
    { name: 'ATLANTIC LINE', color: '#8b5cf6', stops: ['DENHAM', 'GREENLAND', 'BAHAMAS', 'COSTA RICA'] },
  ];

  return (
    <div className="journey-var journey-var--subway" ref={ref}>
      <div className="journey-var__subway-header">
        <span className="journey-var__subway-title">HQ AVIATION NETWORK</span>
        <span className="journey-var__subway-sub">EXPEDITION ROUTES FROM DENHAM</span>
      </div>

      {lines.map((line, i) => (
        <motion.div
          key={line.name}
          className="journey-var__subway-line"
          initial={{ opacity: 0, x: -30 }}
          animate={isInView ? { opacity: 1, x: 0 } : {}}
          transition={{ delay: i * 0.2, duration: 0.5 }}
        >
          <div className="journey-var__subway-line-header" style={{ background: line.color }}>
            {line.name}
          </div>
          <div className="journey-var__subway-stops">
            {line.stops.map((stop, j) => (
              <div key={stop} className="journey-var__subway-stop">
                <motion.div
                  className="journey-var__subway-dot"
                  style={{ borderColor: line.color }}
                  initial={{ scale: 0 }}
                  animate={isInView ? { scale: 1 } : {}}
                  transition={{ delay: i * 0.2 + j * 0.1 }}
                />
                <span className="journey-var__subway-name">{stop}</span>
                {j < line.stops.length - 1 && (
                  <div className="journey-var__subway-track" style={{ background: line.color }} />
                )}
              </div>
            ))}
          </div>
        </motion.div>
      ))}
      <p className="journey-var__caption">All routes connect at Denham Central</p>

      <style>{`
        .journey-var--subway { background: #faf9f6; padding: 2rem; }
        .journey-var__subway-header { text-align: center; margin-bottom: 2rem; }
        .journey-var__subway-title { display: block; font-family: 'Space Grotesk', sans-serif; font-size: 1.25rem; font-weight: 700; color: #1a1a1a; }
        .journey-var__subway-sub { font-size: 0.8rem; color: #888; }
        .journey-var__subway-line { margin-bottom: 1.5rem; }
        .journey-var__subway-line-header { display: inline-block; padding: 0.25rem 0.75rem; color: #fff; font-family: 'Space Grotesk', sans-serif; font-size: 0.75rem; font-weight: 700; border-radius: 4px; margin-bottom: 0.75rem; }
        .journey-var__subway-stops { display: flex; align-items: center; gap: 0; padding-left: 1rem; }
        .journey-var__subway-stop { display: flex; align-items: center; position: relative; }
        .journey-var__subway-dot { width: 16px; height: 16px; border-radius: 50%; background: #fff; border: 3px solid; flex-shrink: 0; }
        .journey-var__subway-name { margin-left: 0.5rem; font-family: 'Space Grotesk', sans-serif; font-size: 0.85rem; color: #1a1a1a; font-weight: 500; white-space: nowrap; }
        .journey-var__subway-track { width: 60px; height: 4px; margin: 0 0.5rem; flex-shrink: 0; }
      `}</style>
    </div>
  );
}

// ============================================
// VARIATION 54: AUDIO WAVEFORM
// ============================================

function JourneyWaveform() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.3 });

  const tracks = destinations.map((d, i) => ({
    ...d,
    bars: Array(40).fill(0).map(() => Math.random() * 100)
  }));

  return (
    <div className="journey-var journey-var--waveform" ref={ref}>
      <div className="journey-var__waveform-player">
        <div className="journey-var__waveform-header">
          <span className="journey-var__waveform-title">EXPEDITION SOUNDSCAPES</span>
          <span className="journey-var__waveform-album">HQ AVIATION • AMBIENT JOURNEYS</span>
        </div>

        <div className="journey-var__waveform-tracks">
          {tracks.map((track, i) => (
            <motion.div
              key={track.id}
              className="journey-var__waveform-track"
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: i * 0.1 }}
            >
              <span className="journey-var__waveform-name">{track.name}</span>
              <div className="journey-var__waveform-bars">
                {track.bars.map((height, j) => (
                  <motion.div
                    key={j}
                    className="journey-var__waveform-bar"
                    style={{ height: `${height}%` }}
                    initial={{ scaleY: 0 }}
                    animate={isInView ? { scaleY: 1 } : {}}
                    transition={{ delay: i * 0.1 + j * 0.01 }}
                  />
                ))}
              </div>
              <span className="journey-var__waveform-duration">{track.distance}</span>
            </motion.div>
          ))}
        </div>
      </div>
      <p className="journey-var__caption">Sounds of adventure</p>

      <style>{`
        .journey-var--waveform { background: #1a1a1a; padding: 2rem; border-radius: 12px; }
        .journey-var__waveform-player { background: #0a0a0a; border-radius: 8px; padding: 1.5rem; }
        .journey-var__waveform-header { text-align: center; margin-bottom: 1.5rem; padding-bottom: 1rem; border-bottom: 1px solid #333; }
        .journey-var__waveform-title { display: block; font-family: 'Space Grotesk', sans-serif; font-size: 1rem; color: #fff; font-weight: 600; }
        .journey-var__waveform-album { font-size: 0.75rem; color: #666; }
        .journey-var__waveform-tracks { display: flex; flex-direction: column; gap: 0.75rem; }
        .journey-var__waveform-track { display: grid; grid-template-columns: 100px 1fr 80px; gap: 1rem; align-items: center; }
        .journey-var__waveform-name { font-family: 'Space Grotesk', sans-serif; font-size: 0.85rem; color: #fff; font-weight: 500; }
        .journey-var__waveform-bars { display: flex; gap: 2px; height: 30px; align-items: center; }
        .journey-var__waveform-bar { width: 3px; background: linear-gradient(180deg, #8b5cf6, #3b82f6); border-radius: 1px; transform-origin: bottom; }
        .journey-var__waveform-duration { font-family: 'Share Tech Mono', monospace; font-size: 0.75rem; color: #666; text-align: right; }
        .journey-var--waveform .journey-var__caption { color: #666; margin-top: 1.5rem; }
      `}</style>
    </div>
  );
}

// ============================================
// VARIATION 55: TYPEWRITER
// ============================================

function JourneyTypewriter() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.3 });
  const [typedIndex, setTypedIndex] = useState(0);

  useEffect(() => {
    if (!isInView) return;
    const interval = setInterval(() => {
      setTypedIndex(prev => (prev + 1) % (destinations.length + 1));
    }, 2500);
    return () => clearInterval(interval);
  }, [isInView]);

  const content = typedIndex === 0
    ? "FROM DENHAM AERODROME..."
    : `→ ${destinations[typedIndex - 1].name.toUpperCase()} (${destinations[typedIndex - 1].distance})`;

  return (
    <div className="journey-var journey-var--typewriter" ref={ref}>
      <div className="journey-var__typewriter-paper">
        <div className="journey-var__typewriter-header">
          <span>HQ AVIATION</span>
          <span>EXPEDITION MANIFEST</span>
        </div>

        <div className="journey-var__typewriter-content">
          <motion.span
            key={typedIndex}
            className="journey-var__typewriter-text"
            initial={{ opacity: 1 }}
            animate={{ opacity: 1 }}
          >
            {content.split('').map((char, i) => (
              <motion.span
                key={i}
                initial={{ opacity: 0 }}
                animate={isInView ? { opacity: 1 } : {}}
                transition={{ delay: i * 0.05 }}
              >
                {char}
              </motion.span>
            ))}
            <motion.span
              className="journey-var__typewriter-cursor"
              animate={{ opacity: [1, 0] }}
              transition={{ duration: 0.5, repeat: Infinity }}
            >
              |
            </motion.span>
          </motion.span>
        </div>

        <div className="journey-var__typewriter-footer">
          <span>PAGE 1 OF 1</span>
          <span>CLASSIFIED</span>
        </div>
      </div>
      <p className="journey-var__caption">Documenting adventures, one keystroke at a time</p>

      <style>{`
        .journey-var--typewriter { background: #5c4033; padding: 3rem 2rem; }
        .journey-var__typewriter-paper { background: #fffef5; padding: 2rem; min-height: 200px; box-shadow: 0 10px 40px rgba(0,0,0,0.3); position: relative; }
        .journey-var__typewriter-paper::before { content: ''; position: absolute; left: 2rem; right: 2rem; top: 0; bottom: 0; background: repeating-linear-gradient(transparent, transparent 28px, #e0ddd5 28px, #e0ddd5 29px); pointer-events: none; }
        .journey-var__typewriter-header { display: flex; justify-content: space-between; font-family: 'Share Tech Mono', monospace; font-size: 0.75rem; color: #999; margin-bottom: 2rem; padding-bottom: 1rem; border-bottom: 1px dashed #ccc; position: relative; z-index: 1; }
        .journey-var__typewriter-content { min-height: 100px; position: relative; z-index: 1; }
        .journey-var__typewriter-text { font-family: 'Share Tech Mono', monospace; font-size: 1.1rem; color: #1a1a1a; line-height: 1.8; }
        .journey-var__typewriter-cursor { color: #1a1a1a; }
        .journey-var__typewriter-footer { display: flex; justify-content: space-between; font-family: 'Share Tech Mono', monospace; font-size: 0.7rem; color: #bbb; margin-top: 2rem; padding-top: 1rem; border-top: 1px dashed #ccc; position: relative; z-index: 1; }
        .journey-var--typewriter .journey-var__caption { color: #d4c5a9; margin-top: 1.5rem; }
      `}</style>
    </div>
  );
}

// ============================================
// VARIATION 56: CARD FLIP GRID
// ============================================

function JourneyCardFlip() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.3 });
  const [flipped, setFlipped] = useState({});

  const toggleFlip = (id) => {
    setFlipped(prev => ({ ...prev, [id]: !prev[id] }));
  };

  return (
    <div className="journey-var journey-var--cardflip" ref={ref}>
      <div className="journey-var__cardflip-grid">
        {destinations.map((dest, i) => (
          <motion.div
            key={dest.id}
            className={`journey-var__cardflip-card ${flipped[dest.id] ? 'flipped' : ''}`}
            onClick={() => toggleFlip(dest.id)}
            initial={{ opacity: 0, rotateY: -90 }}
            animate={isInView ? { opacity: 1, rotateY: 0 } : {}}
            transition={{ delay: i * 0.1, duration: 0.5 }}
          >
            <div className="journey-var__cardflip-inner">
              <div className="journey-var__cardflip-front">
                <span className="journey-var__cardflip-q">?</span>
              </div>
              <div className="journey-var__cardflip-back">
                <span className="journey-var__cardflip-name">{dest.name}</span>
                <span className="journey-var__cardflip-dist">{dest.distance}</span>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
      <p className="journey-var__caption">Click to reveal your destinations</p>

      <style>{`
        .journey-var--cardflip { background: #2d5a4a; padding: 2rem; border-radius: 12px; }
        .journey-var__cardflip-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 1rem; max-width: 500px; margin: 0 auto; }
        .journey-var__cardflip-card { aspect-ratio: 1; perspective: 1000px; cursor: pointer; }
        .journey-var__cardflip-inner { position: relative; width: 100%; height: 100%; transition: transform 0.6s; transform-style: preserve-3d; }
        .journey-var__cardflip-card.flipped .journey-var__cardflip-inner { transform: rotateY(180deg); }
        .journey-var__cardflip-front, .journey-var__cardflip-back { position: absolute; inset: 0; backface-visibility: hidden; border-radius: 8px; display: flex; flex-direction: column; align-items: center; justify-content: center; }
        .journey-var__cardflip-front { background: #1a3a2a; border: 2px solid #3d6a5a; }
        .journey-var__cardflip-q { font-family: 'Space Grotesk', sans-serif; font-size: 2rem; color: #4d8a6a; }
        .journey-var__cardflip-back { background: #c9a959; transform: rotateY(180deg); }
        .journey-var__cardflip-name { font-family: 'Space Grotesk', sans-serif; font-size: 0.85rem; font-weight: 700; color: #1a1a1a; }
        .journey-var__cardflip-dist { font-family: 'Share Tech Mono', monospace; font-size: 0.7rem; color: #5c4a35; margin-top: 0.25rem; }
        .journey-var--cardflip .journey-var__caption { color: #98d8c8; margin-top: 1.5rem; }
      `}</style>
    </div>
  );
}

// ============================================
// VARIATION 57: STACKED LAYERS
// ============================================

function JourneyStackedLayers() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.3 });
  const [activeLayer, setActiveLayer] = useState(0);

  const layers = [
    { name: 'SHORT RANGE', color: '#22c55e', dests: ['ALPS', 'NORWAY'] },
    { name: 'MEDIUM RANGE', color: '#eab308', dests: ['ICELAND', 'MOROCCO'] },
    { name: 'LONG RANGE', color: '#ef4444', dests: ['ARCTIC', 'GREENLAND', 'BAHAMAS', 'COSTA RICA'] },
  ];

  return (
    <div className="journey-var journey-var--stacked" ref={ref}>
      <div className="journey-var__stacked-container">
        {layers.map((layer, i) => (
          <motion.div
            key={layer.name}
            className={`journey-var__stacked-layer ${activeLayer === i ? 'active' : ''}`}
            style={{
              background: layer.color,
              zIndex: layers.length - i + (activeLayer === i ? 10 : 0),
              transform: `translateY(${i * 20}px) scale(${1 - i * 0.05})`,
            }}
            initial={{ opacity: 0, y: 50 }}
            animate={isInView ? { opacity: 1, y: i * 20 } : {}}
            transition={{ delay: i * 0.2 }}
            onClick={() => setActiveLayer(i)}
            whileHover={{ y: i * 20 - 10, zIndex: 20 }}
          >
            <div className="journey-var__stacked-header">
              <span className="journey-var__stacked-name">{layer.name}</span>
              <span className="journey-var__stacked-count">{layer.dests.length} destinations</span>
            </div>
            <div className="journey-var__stacked-dests">
              {layer.dests.map(d => (
                <span key={d} className="journey-var__stacked-dest">{d}</span>
              ))}
            </div>
          </motion.div>
        ))}
      </div>
      <p className="journey-var__caption">Explore by distance category</p>

      <style>{`
        .journey-var--stacked { background: #1a1a1a; padding: 3rem 2rem; }
        .journey-var__stacked-container { position: relative; height: 280px; max-width: 500px; margin: 0 auto; }
        .journey-var__stacked-layer { position: absolute; top: 0; left: 0; right: 0; padding: 1.5rem; border-radius: 12px; cursor: pointer; transition: all 0.3s ease; }
        .journey-var__stacked-layer.active { box-shadow: 0 10px 40px rgba(0,0,0,0.3); }
        .journey-var__stacked-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 1rem; }
        .journey-var__stacked-name { font-family: 'Space Grotesk', sans-serif; font-size: 1rem; font-weight: 700; color: #fff; }
        .journey-var__stacked-count { font-family: 'Share Tech Mono', monospace; font-size: 0.75rem; color: rgba(255,255,255,0.7); }
        .journey-var__stacked-dests { display: flex; flex-wrap: wrap; gap: 0.5rem; }
        .journey-var__stacked-dest { background: rgba(255,255,255,0.2); padding: 0.25rem 0.75rem; border-radius: 20px; font-size: 0.8rem; color: #fff; }
        .journey-var--stacked .journey-var__caption { color: #666; margin-top: 2rem; }
      `}</style>
    </div>
  );
}

// ============================================
// VARIATION 58: VINTAGE TICKET STUBS
// ============================================

function JourneyTicketStubs() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.3 });

  return (
    <div className="journey-var journey-var--tickets" ref={ref}>
      <div className="journey-var__tickets-roll">
        {destinations.map((dest, i) => (
          <motion.div
            key={dest.id}
            className="journey-var__ticket"
            initial={{ opacity: 0, x: -50, rotate: -5 }}
            animate={isInView ? { opacity: 1, x: 0, rotate: (i % 2 === 0 ? 2 : -2) } : {}}
            transition={{ delay: i * 0.1, type: 'spring' }}
          >
            <div className="journey-var__ticket-left">
              <span className="journey-var__ticket-num">№{String(i + 1).padStart(3, '0')}</span>
              <span className="journey-var__ticket-dest">{dest.name}</span>
            </div>
            <div className="journey-var__ticket-perf" />
            <div className="journey-var__ticket-right">
              <span className="journey-var__ticket-dist">{dest.distance}</span>
              <span className="journey-var__ticket-hq">HQ</span>
            </div>
          </motion.div>
        ))}
      </div>
      <p className="journey-var__caption">Collect your expedition tickets</p>

      <style>{`
        .journey-var--tickets { background: #8b7355; padding: 2rem; border-radius: 0; }
        .journey-var__tickets-roll { display: flex; flex-wrap: wrap; gap: 1rem; justify-content: center; }
        .journey-var__ticket { display: flex; background: #fffef5; border-radius: 4px; overflow: hidden; box-shadow: 0 4px 15px rgba(0,0,0,0.2); }
        .journey-var__ticket-left { padding: 1rem 1.5rem; display: flex; flex-direction: column; justify-content: center; }
        .journey-var__ticket-num { font-family: 'Share Tech Mono', monospace; font-size: 0.65rem; color: #999; }
        .journey-var__ticket-dest { font-family: 'Space Grotesk', sans-serif; font-size: 1rem; font-weight: 700; color: #1a1a1a; }
        .journey-var__ticket-perf { width: 1px; background: repeating-linear-gradient(180deg, #ccc 0, #ccc 5px, transparent 5px, transparent 10px); margin: 0.5rem 0; }
        .journey-var__ticket-right { padding: 1rem; background: #c41e3a; display: flex; flex-direction: column; align-items: center; justify-content: center; min-width: 60px; }
        .journey-var__ticket-dist { font-family: 'Share Tech Mono', monospace; font-size: 0.65rem; color: rgba(255,255,255,0.8); }
        .journey-var__ticket-hq { font-family: 'Space Grotesk', sans-serif; font-size: 1.25rem; font-weight: 700; color: #fff; }
        .journey-var--tickets .journey-var__caption { color: #d4c5a9; margin-top: 2rem; }
      `}</style>
    </div>
  );
}

// ============================================
// VARIATION 59: LAVA LAMP
// ============================================

function JourneyLavaLamp() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.3 });

  const blobs = destinations.map((d, i) => ({
    ...d,
    size: 60 + Math.random() * 40,
    x: 80 + (i % 4) * 180,
    startY: 50 + Math.random() * 250,
    duration: 8 + Math.random() * 6,
    color: ['#ff6b6b', '#feca57', '#48dbfb', '#ff9ff3', '#54a0ff', '#5f27cd', '#00d2d3', '#1dd1a1'][i],
  }));

  return (
    <div className="journey-var journey-var--lava" ref={ref}>
      <div className="journey-var__lava-lamp">
        <svg viewBox="0 0 700 400" preserveAspectRatio="xMidYMid meet">
          <defs>
            <filter id="lavaBlur">
              <feGaussianBlur in="SourceGraphic" stdDeviation="3" />
            </filter>
          </defs>

          {blobs.map((blob, i) => (
            <motion.g key={blob.id}>
              <motion.ellipse
                cx={blob.x}
                cy={blob.startY}
                rx={blob.size / 2}
                ry={blob.size / 2.5}
                fill={blob.color}
                opacity="0.8"
                filter="url(#lavaBlur)"
                initial={{ cy: blob.startY, scale: 0 }}
                animate={isInView ? {
                  cy: [blob.startY, blob.startY - 100, blob.startY + 50, blob.startY],
                  scale: [1, 1.2, 0.9, 1],
                } : {}}
                transition={{
                  cy: { duration: blob.duration, repeat: Infinity, ease: 'easeInOut' },
                  scale: { duration: blob.duration / 2, repeat: Infinity, ease: 'easeInOut', delay: i * 0.2 },
                }}
              />
              <motion.text
                x={blob.x}
                y={blob.startY}
                textAnchor="middle"
                dominantBaseline="middle"
                className="journey-var__lava-label"
                animate={isInView ? {
                  y: [blob.startY, blob.startY - 100, blob.startY + 50, blob.startY],
                } : {}}
                transition={{ duration: blob.duration, repeat: Infinity, ease: 'easeInOut' }}
              >
                {blob.name}
              </motion.text>
            </motion.g>
          ))}
        </svg>
      </div>
      <p className="journey-var__caption">Destinations in flow</p>

      <style>{`
        .journey-var--lava { background: linear-gradient(180deg, #1a0a2e 0%, #16213e 50%, #1a0a2e 100%); padding: 2rem; border-radius: 20px; }
        .journey-var__lava-lamp { border: 8px solid #2a1a4a; border-radius: 100px; overflow: hidden; background: #0a0515; }
        .journey-var__lava-label { font-family: 'Space Grotesk', sans-serif; font-size: 10px; fill: #fff; font-weight: 700; text-shadow: 0 2px 10px rgba(0,0,0,0.5); }
        .journey-var--lava .journey-var__caption { color: #8b5cf6; margin-top: 1.5rem; }
      `}</style>
    </div>
  );
}

// ============================================
// VARIATION 60: CROSSWORD PUZZLE
// ============================================

function JourneyCrossword() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.3 });

  const words = [
    { word: 'ARCTIC', x: 0, y: 0, dir: 'h', num: 1 },
    { word: 'ICELAND', x: 0, y: 2, dir: 'h', num: 2 },
    { word: 'ALPS', x: 4, y: 0, dir: 'v', num: 3 },
    { word: 'NORWAY', x: 2, y: 4, dir: 'h', num: 4 },
    { word: 'MOROCCO', x: 6, y: 1, dir: 'v', num: 5 },
  ];

  const gridSize = 10;
  const grid = Array(gridSize).fill(null).map(() => Array(gridSize).fill(null));

  words.forEach(({ word, x, y, dir }) => {
    [...word].forEach((letter, i) => {
      if (dir === 'h') grid[y][x + i] = letter;
      else grid[y + i][x] = letter;
    });
  });

  return (
    <div className="journey-var journey-var--crossword" ref={ref}>
      <div className="journey-var__crossword-header">
        <span>HQ AVIATION</span>
        <span>EXPEDITION CROSSWORD</span>
      </div>

      <div className="journey-var__crossword-grid">
        {grid.map((row, y) => (
          <div key={y} className="journey-var__crossword-row">
            {row.map((cell, x) => {
              const wordStart = words.find(w => w.x === x && w.y === y);
              return (
                <motion.div
                  key={x}
                  className={`journey-var__crossword-cell ${cell ? 'filled' : 'empty'}`}
                  initial={{ opacity: 0, scale: 0.5 }}
                  animate={isInView ? { opacity: 1, scale: 1 } : {}}
                  transition={{ delay: (y * gridSize + x) * 0.01 }}
                >
                  {wordStart && <span className="journey-var__crossword-num">{wordStart.num}</span>}
                  {cell && <span className="journey-var__crossword-letter">{cell}</span>}
                </motion.div>
              );
            })}
          </div>
        ))}
      </div>
      <p className="journey-var__caption">Puzzle your way to adventure</p>

      <style>{`
        .journey-var--crossword { background: #fff; padding: 2rem; border: 2px solid #1a1a1a; }
        .journey-var__crossword-header { display: flex; justify-content: space-between; font-family: 'Space Grotesk', sans-serif; font-size: 0.85rem; font-weight: 700; color: #1a1a1a; margin-bottom: 1.5rem; text-transform: uppercase; }
        .journey-var__crossword-grid { display: flex; flex-direction: column; gap: 2px; max-width: 400px; margin: 0 auto; }
        .journey-var__crossword-row { display: flex; gap: 2px; }
        .journey-var__crossword-cell { width: 32px; height: 32px; display: flex; align-items: center; justify-content: center; position: relative; }
        .journey-var__crossword-cell.filled { background: #fff; border: 1px solid #1a1a1a; }
        .journey-var__crossword-cell.empty { background: #1a1a1a; }
        .journey-var__crossword-num { position: absolute; top: 2px; left: 3px; font-family: 'Share Tech Mono', monospace; font-size: 0.5rem; color: #888; }
        .journey-var__crossword-letter { font-family: 'Space Grotesk', sans-serif; font-size: 0.9rem; font-weight: 700; color: #1a1a1a; }
      `}</style>
    </div>
  );
}

// ============================================
// VARIATION 61: SNOW GLOBE
// ============================================

function JourneySnowGlobe() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.3 });
  const [shaken, setShaken] = useState(false);

  const snowflakes = Array(30).fill(0).map((_, i) => ({
    x: Math.random() * 100,
    delay: Math.random() * 3,
    duration: 3 + Math.random() * 2,
    size: 2 + Math.random() * 4,
  }));

  return (
    <div className="journey-var journey-var--snowglobe" ref={ref}>
      <motion.div
        className="journey-var__snowglobe-glass"
        onClick={() => setShaken(true)}
        onAnimationComplete={() => setShaken(false)}
        animate={shaken ? { rotate: [0, -5, 5, -5, 0] } : {}}
        transition={{ duration: 0.5 }}
      >
        <svg viewBox="0 0 300 300" preserveAspectRatio="xMidYMid meet">
          {/* Snowflakes */}
          {snowflakes.map((flake, i) => (
            <motion.circle
              key={i}
              cx={`${flake.x}%`}
              cy="10%"
              r={flake.size}
              fill="#fff"
              animate={isInView || shaken ? {
                cy: ['10%', '85%'],
                opacity: [1, 0],
              } : {}}
              transition={{
                duration: flake.duration,
                delay: flake.delay,
                repeat: Infinity,
                ease: 'linear',
              }}
            />
          ))}

          {/* Scene */}
          <motion.g
            initial={{ scale: 0 }}
            animate={isInView ? { scale: 1 } : {}}
            transition={{ delay: 0.3 }}
          >
            {/* Ground */}
            <ellipse cx="150" cy="250" rx="120" ry="20" fill="#fff" />

            {/* Helicopter */}
            <text x="150" y="200" textAnchor="middle" style={{ fontSize: '40px' }}>🚁</text>

            {/* Labels */}
            <text x="150" y="270" textAnchor="middle" className="journey-var__snowglobe-label">HQ AVIATION</text>
          </motion.g>
        </svg>

        <div className="journey-var__snowglobe-destinations">
          {destinations.slice(0, 4).map((d, i) => (
            <motion.span
              key={d.id}
              initial={{ opacity: 0 }}
              animate={isInView ? { opacity: 1 } : {}}
              transition={{ delay: 0.5 + i * 0.1 }}
            >
              {d.name}
            </motion.span>
          ))}
        </div>
      </motion.div>

      <div className="journey-var__snowglobe-base" />
      <p className="journey-var__caption">Click to shake • Adventures await</p>

      <style>{`
        .journey-var--snowglobe { background: linear-gradient(180deg, #1e3a5f 0%, #0f1c2e 100%); padding: 3rem 2rem 2rem; display: flex; flex-direction: column; align-items: center; border-radius: 12px; }
        .journey-var__snowglobe-glass { width: 280px; height: 280px; background: radial-gradient(ellipse at 30% 20%, rgba(255,255,255,0.2), transparent 50%), linear-gradient(180deg, #87ceeb 0%, #e0f2fe 100%); border-radius: 50%; border: 4px solid #c9d5e0; cursor: pointer; overflow: hidden; position: relative; box-shadow: inset 0 -30px 60px rgba(0,0,0,0.1), 0 10px 30px rgba(0,0,0,0.3); }
        .journey-var__snowglobe-label { font-family: 'Space Grotesk', sans-serif; font-size: 12px; fill: #1a1a1a; font-weight: 700; }
        .journey-var__snowglobe-destinations { position: absolute; bottom: 60px; left: 50%; transform: translateX(-50%); display: flex; gap: 0.5rem; }
        .journey-var__snowglobe-destinations span { font-family: 'Share Tech Mono', monospace; font-size: 0.6rem; color: #1a1a1a; background: rgba(255,255,255,0.8); padding: 0.15rem 0.4rem; border-radius: 3px; }
        .journey-var__snowglobe-base { width: 120px; height: 40px; background: linear-gradient(180deg, #5c4033 0%, #3d2817 100%); border-radius: 0 0 60px 60px; margin-top: -20px; }
        .journey-var--snowglobe .journey-var__caption { color: #87ceeb; margin-top: 1.5rem; }
      `}</style>
    </div>
  );
}

// ============================================
// VARIATION 62: CLIMBING WALL HOLDS
// ============================================

function JourneyClimbingWall() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.3 });

  const holds = [
    { dest: 'ALPS', x: 150, y: 80, color: '#22c55e', size: 'lg' },
    { dest: 'NORWAY', x: 350, y: 150, color: '#3b82f6', size: 'md' },
    { dest: 'ARCTIC', x: 550, y: 60, color: '#8b5cf6', size: 'lg' },
    { dest: 'ICELAND', x: 250, y: 220, color: '#f97316', size: 'md' },
    { dest: 'GREENLAND', x: 450, y: 280, color: '#06b6d4', size: 'lg' },
    { dest: 'MOROCCO', x: 650, y: 180, color: '#ef4444', size: 'sm' },
    { dest: 'BAHAMAS', x: 150, y: 320, color: '#ec4899', size: 'md' },
    { dest: 'COSTA RICA', x: 550, y: 350, color: '#84cc16', size: 'sm' },
  ];

  return (
    <div className="journey-var journey-var--climbing" ref={ref}>
      <svg viewBox="0 0 800 420" preserveAspectRatio="xMidYMid meet">
        {/* Wall texture */}
        <rect x="0" y="0" width="800" height="420" fill="#e5e0d5" />
        <pattern id="wallTexture" patternUnits="userSpaceOnUse" width="20" height="20">
          <circle cx="10" cy="10" r="1" fill="#d0c8b8" />
        </pattern>
        <rect x="0" y="0" width="800" height="420" fill="url(#wallTexture)" />

        {/* Route line */}
        <motion.path
          d={`M${holds[0].x},${holds[0].y} ${holds.map(h => `L${h.x},${h.y}`).join(' ')}`}
          fill="none"
          stroke="#fff"
          strokeWidth="3"
          strokeDasharray="10 5"
          initial={{ pathLength: 0 }}
          animate={isInView ? { pathLength: 1 } : {}}
          transition={{ duration: 2 }}
        />

        {/* Start */}
        <text x="50" y="380" className="journey-var__climbing-start">START: DENHAM</text>

        {/* Holds */}
        {holds.map((hold, i) => (
          <motion.g
            key={hold.dest}
            initial={{ scale: 0 }}
            animate={isInView ? { scale: 1 } : {}}
            transition={{ delay: i * 0.1, type: 'spring', stiffness: 200 }}
          >
            <ellipse
              cx={hold.x}
              cy={hold.y}
              rx={hold.size === 'lg' ? 35 : hold.size === 'md' ? 28 : 22}
              ry={hold.size === 'lg' ? 25 : hold.size === 'md' ? 20 : 16}
              fill={hold.color}
              style={{ filter: 'drop-shadow(3px 3px 5px rgba(0,0,0,0.3))' }}
            />
            <text x={hold.x} y={hold.y + 5} textAnchor="middle" className="journey-var__climbing-label">{hold.dest}</text>
          </motion.g>
        ))}
      </svg>
      <p className="journey-var__caption">Climb your way to adventure</p>

      <style>{`
        .journey-var--climbing { background: #8b7355; padding: 0; border-radius: 0; overflow: hidden; }
        .journey-var__climbing-start { font-family: 'Space Grotesk', sans-serif; font-size: 12px; fill: #666; font-weight: 700; }
        .journey-var__climbing-label { font-family: 'Space Grotesk', sans-serif; font-size: 10px; fill: #fff; font-weight: 700; text-shadow: 0 1px 2px rgba(0,0,0,0.5); }
        .journey-var--climbing .journey-var__caption { color: #d4c5a9; padding: 1.5rem; margin: 0; background: #8b7355; }
      `}</style>
    </div>
  );
}

// ============================================
// VARIATION 63: PINBALL MACHINE
// ============================================

function JourneyPinball() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.3 });

  const bumpers = [
    { dest: 'ARCTIC', x: 200, y: 100, points: 2500 },
    { dest: 'ICELAND', x: 400, y: 80, points: 1200 },
    { dest: 'MOROCCO', x: 600, y: 120, points: 1100 },
    { dest: 'NORWAY', x: 300, y: 180, points: 650 },
    { dest: 'ALPS', x: 500, y: 200, points: 500 },
    { dest: 'GREENLAND', x: 250, y: 280, points: 2100 },
    { dest: 'BAHAMAS', x: 550, y: 260, points: 4200 },
  ];

  return (
    <div className="journey-var journey-var--pinball" ref={ref}>
      <div className="journey-var__pinball-header">
        <span className="journey-var__pinball-title">HQ AVIATION</span>
        <span className="journey-var__pinball-score">SCORE: 0000000</span>
      </div>

      <svg viewBox="0 0 800 350" preserveAspectRatio="xMidYMid meet" className="journey-var__pinball-field">
        {/* Bumpers */}
        {bumpers.map((bumper, i) => (
          <motion.g
            key={bumper.dest}
            initial={{ scale: 0 }}
            animate={isInView ? { scale: 1 } : {}}
            transition={{ delay: i * 0.1, type: 'spring' }}
          >
            <circle cx={bumper.x} cy={bumper.y} r="40" fill="#1a1a1a" stroke="#fbbf24" strokeWidth="4" />
            <circle cx={bumper.x} cy={bumper.y} r="32" fill="#2a2a2a" />
            <text x={bumper.x} y={bumper.y - 5} textAnchor="middle" className="journey-var__pinball-dest">{bumper.dest}</text>
            <text x={bumper.x} y={bumper.y + 15} textAnchor="middle" className="journey-var__pinball-points">{bumper.points}</text>
          </motion.g>
        ))}

        {/* Ball */}
        <motion.circle
          cx="100" cy="320"
          r="12"
          fill="linear-gradient(135deg, #e5e5e5, #999)"
          animate={isInView ? {
            cx: [100, 200, 400, 300, 600, 400],
            cy: [320, 100, 80, 180, 120, 320],
          } : {}}
          transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
        />

        {/* Flippers */}
        <rect x="250" y="330" width="100" height="15" rx="7" fill="#c41e3a" transform="rotate(-20, 250, 330)" />
        <rect x="450" y="330" width="100" height="15" rx="7" fill="#c41e3a" transform="rotate(20, 550, 330)" />
      </svg>

      <div className="journey-var__pinball-footer">
        <span>INSERT COIN</span>
        <span>PLAYER 1</span>
        <span>HIGH SCORE: 9999999</span>
      </div>
      <p className="journey-var__caption">Hit every destination for bonus points</p>

      <style>{`
        .journey-var--pinball { background: #0a0a0a; padding: 0; border-radius: 12px; overflow: hidden; border: 4px solid #333; }
        .journey-var__pinball-header { display: flex; justify-content: space-between; padding: 1rem 1.5rem; background: #1a1a1a; border-bottom: 2px solid #333; }
        .journey-var__pinball-title { font-family: 'Space Grotesk', sans-serif; font-size: 1.25rem; font-weight: 700; color: #fbbf24; text-shadow: 0 0 10px #fbbf24; }
        .journey-var__pinball-score { font-family: 'Share Tech Mono', monospace; font-size: 1rem; color: #ef4444; }
        .journey-var__pinball-field { background: linear-gradient(180deg, #1a0a2e 0%, #0a1525 100%); }
        .journey-var__pinball-dest { font-family: 'Space Grotesk', sans-serif; font-size: 9px; fill: #fff; font-weight: 700; }
        .journey-var__pinball-points { font-family: 'Share Tech Mono', monospace; font-size: 10px; fill: #fbbf24; }
        .journey-var__pinball-footer { display: flex; justify-content: space-around; padding: 0.75rem; background: #1a1a1a; border-top: 2px solid #333; font-family: 'Share Tech Mono', monospace; font-size: 0.75rem; color: #666; }
        .journey-var--pinball .journey-var__caption { color: #fbbf24; padding: 1rem; margin: 0; background: #0a0a0a; }
      `}</style>
    </div>
  );
}

// ============================================
// VARIATION 64: DOMINO CHAIN
// ============================================

function JourneyDominoes() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.3 });
  const [fallen, setFallen] = useState(false);

  return (
    <div className="journey-var journey-var--dominoes" ref={ref}>
      <div className="journey-var__dominoes-table">
        <div className="journey-var__dominoes-row">
          {destinations.map((dest, i) => (
            <motion.div
              key={dest.id}
              className="journey-var__domino"
              initial={{ rotateX: 0 }}
              animate={isInView && fallen ? { rotateX: 80 } : {}}
              transition={{ delay: i * 0.15, duration: 0.3 }}
              onClick={() => setFallen(true)}
            >
              <div className="journey-var__domino-top">
                <span className="journey-var__domino-dots">
                  {[...Array(Math.min(i + 1, 6))].map((_, j) => (
                    <span key={j} className="journey-var__domino-dot" />
                  ))}
                </span>
              </div>
              <div className="journey-var__domino-line" />
              <div className="journey-var__domino-bottom">
                <span className="journey-var__domino-name">{dest.name}</span>
              </div>
            </motion.div>
          ))}
        </div>
        {!fallen && <div className="journey-var__dominoes-hint">Click to topple</div>}
      </div>
      <p className="journey-var__caption">Chain reaction of adventures</p>

      <style>{`
        .journey-var--dominoes { background: #2d5a3d; padding: 3rem 2rem; border-radius: 0; }
        .journey-var__dominoes-table { background: #1a3d2a; padding: 2rem; border-radius: 8px; border: 4px solid #3d6a4d; position: relative; }
        .journey-var__dominoes-row { display: flex; gap: 0.75rem; justify-content: center; perspective: 1000px; }
        .journey-var__domino { width: 50px; height: 100px; background: #fffef5; border-radius: 4px; display: flex; flex-direction: column; cursor: pointer; transform-origin: bottom center; box-shadow: 2px 2px 10px rgba(0,0,0,0.3); }
        .journey-var__domino-top { flex: 1; display: flex; align-items: center; justify-content: center; padding: 0.25rem; }
        .journey-var__domino-dots { display: grid; grid-template-columns: repeat(2, 1fr); gap: 3px; }
        .journey-var__domino-dot { width: 6px; height: 6px; background: #1a1a1a; border-radius: 50%; }
        .journey-var__domino-line { height: 2px; background: #1a1a1a; margin: 0 0.25rem; }
        .journey-var__domino-bottom { flex: 1; display: flex; align-items: center; justify-content: center; }
        .journey-var__domino-name { font-family: 'Share Tech Mono', monospace; font-size: 0.5rem; color: #1a1a1a; writing-mode: vertical-rl; text-orientation: mixed; }
        .journey-var__dominoes-hint { position: absolute; bottom: 0.5rem; left: 50%; transform: translateX(-50%); font-family: 'Space Grotesk', sans-serif; font-size: 0.75rem; color: #98d8c8; }
        .journey-var--dominoes .journey-var__caption { color: #98d8c8; margin-top: 1.5rem; }
      `}</style>
    </div>
  );
}

// ============================================
// VARIATION 65: PERIODIC TABLE
// ============================================

function JourneyPeriodicTable() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.3 });

  const elements = [
    { symbol: 'Ar', name: 'ARCTIC', number: 1, group: 'polar' },
    { symbol: 'Ic', name: 'ICELAND', number: 2, group: 'polar' },
    { symbol: 'Nw', name: 'NORWAY', number: 3, group: 'nordic' },
    { symbol: 'Ap', name: 'ALPS', number: 4, group: 'mountain' },
    { symbol: 'Mr', name: 'MOROCCO', number: 5, group: 'desert' },
    { symbol: 'Gl', name: 'GREENLAND', number: 6, group: 'polar' },
    { symbol: 'Bh', name: 'BAHAMAS', number: 7, group: 'tropical' },
    { symbol: 'Cr', name: 'COSTA RICA', number: 8, group: 'tropical' },
  ];

  const groupColors = {
    polar: '#3b82f6',
    nordic: '#06b6d4',
    mountain: '#8b5cf6',
    desert: '#f97316',
    tropical: '#22c55e',
  };

  return (
    <div className="journey-var journey-var--periodic" ref={ref}>
      <h3 className="journey-var__periodic-title">EXPEDITION TABLE OF ELEMENTS</h3>

      <div className="journey-var__periodic-grid">
        {elements.map((el, i) => (
          <motion.div
            key={el.symbol}
            className="journey-var__periodic-element"
            style={{ borderColor: groupColors[el.group], background: `${groupColors[el.group]}15` }}
            initial={{ opacity: 0, scale: 0.5 }}
            animate={isInView ? { opacity: 1, scale: 1 } : {}}
            transition={{ delay: i * 0.1, type: 'spring' }}
            whileHover={{ scale: 1.1, zIndex: 10 }}
          >
            <span className="journey-var__periodic-number">{el.number}</span>
            <span className="journey-var__periodic-symbol" style={{ color: groupColors[el.group] }}>{el.symbol}</span>
            <span className="journey-var__periodic-name">{el.name}</span>
          </motion.div>
        ))}
      </div>

      <div className="journey-var__periodic-legend">
        {Object.entries(groupColors).map(([group, color]) => (
          <span key={group} className="journey-var__periodic-legend-item">
            <span className="journey-var__periodic-swatch" style={{ background: color }} />
            {group}
          </span>
        ))}
      </div>
      <p className="journey-var__caption">The chemistry of adventure</p>

      <style>{`
        .journey-var--periodic { background: #0a0a0a; padding: 2rem; border-radius: 12px; }
        .journey-var__periodic-title { font-family: 'Space Grotesk', sans-serif; font-size: 1rem; color: #fff; text-align: center; margin-bottom: 1.5rem; letter-spacing: 0.1em; }
        .journey-var__periodic-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 0.75rem; max-width: 450px; margin: 0 auto; }
        .journey-var__periodic-element { aspect-ratio: 1; border: 2px solid; border-radius: 4px; display: flex; flex-direction: column; align-items: center; justify-content: center; padding: 0.5rem; cursor: pointer; transition: all 0.2s; }
        .journey-var__periodic-number { font-family: 'Share Tech Mono', monospace; font-size: 0.6rem; color: #666; align-self: flex-start; }
        .journey-var__periodic-symbol { font-family: 'Space Grotesk', sans-serif; font-size: 1.75rem; font-weight: 700; }
        .journey-var__periodic-name { font-family: 'Share Tech Mono', monospace; font-size: 0.55rem; color: #888; margin-top: 0.25rem; }
        .journey-var__periodic-legend { display: flex; justify-content: center; gap: 1rem; margin-top: 1.5rem; flex-wrap: wrap; }
        .journey-var__periodic-legend-item { display: flex; align-items: center; gap: 0.35rem; font-family: 'Share Tech Mono', monospace; font-size: 0.7rem; color: #666; text-transform: capitalize; }
        .journey-var__periodic-swatch { width: 10px; height: 10px; border-radius: 2px; }
        .journey-var--periodic .journey-var__caption { color: #666; margin-top: 1.5rem; }
      `}</style>
    </div>
  );
}

// ============================================
// VARIATION 66: STAINED GLASS
// ============================================

function JourneyStainedGlass() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.3 });

  const panels = [
    { dest: 'ARCTIC', color: '#60a5fa', path: 'M100,50 L200,80 L180,180 L80,150 Z' },
    { dest: 'ICELAND', color: '#a78bfa', path: 'M200,80 L300,50 L320,160 L180,180 Z' },
    { dest: 'NORWAY', color: '#34d399', path: 'M300,50 L400,70 L380,170 L320,160 Z' },
    { dest: 'ALPS', color: '#fbbf24', path: 'M80,150 L180,180 L160,280 L60,250 Z' },
    { dest: 'MOROCCO', color: '#f97316', path: 'M180,180 L320,160 L300,270 L160,280 Z' },
    { dest: 'GREENLAND', color: '#38bdf8', path: 'M320,160 L380,170 L360,280 L300,270 Z' },
    { dest: 'BAHAMAS', color: '#ec4899', path: 'M60,250 L160,280 L140,350 L50,330 Z' },
    { dest: 'COSTA RICA', color: '#84cc16', path: 'M160,280 L360,280 L340,360 L140,350 Z' },
  ];

  return (
    <div className="journey-var journey-var--stained" ref={ref}>
      <svg viewBox="0 0 450 400" preserveAspectRatio="xMidYMid meet">
        <defs>
          <filter id="glassGlow">
            <feGaussianBlur stdDeviation="2" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        {/* Arch frame */}
        <path d="M50,380 L50,100 Q225,0 400,100 L400,380 Z" fill="none" stroke="#5c4033" strokeWidth="15" />

        {/* Glass panels */}
        {panels.map((panel, i) => (
          <motion.g key={panel.dest}>
            <motion.path
              d={panel.path}
              fill={panel.color}
              opacity="0.85"
              stroke="#5c4033"
              strokeWidth="3"
              filter="url(#glassGlow)"
              initial={{ opacity: 0 }}
              animate={isInView ? { opacity: 0.85 } : {}}
              transition={{ delay: i * 0.15 }}
            />
            <motion.text
              x={panel.path.match(/M(\d+),(\d+)/)[1]}
              y={panel.path.match(/M(\d+),(\d+)/)[2]}
              dx="40"
              dy="50"
              className="journey-var__stained-label"
              initial={{ opacity: 0 }}
              animate={isInView ? { opacity: 1 } : {}}
              transition={{ delay: 0.5 + i * 0.1 }}
            >
              {panel.dest}
            </motion.text>
          </motion.g>
        ))}

        {/* Center medallion */}
        <motion.circle
          cx="225" cy="200" r="30"
          fill="#fbbf24"
          stroke="#5c4033"
          strokeWidth="4"
          initial={{ scale: 0 }}
          animate={isInView ? { scale: 1 } : {}}
          transition={{ delay: 1, type: 'spring' }}
        />
        <text x="225" y="205" textAnchor="middle" className="journey-var__stained-center">HQ</text>
      </svg>
      <p className="journey-var__caption">Light through adventure</p>

      <style>{`
        .journey-var--stained { background: #2d1f1a; padding: 2rem; border-radius: 0; }
        .journey-var__stained-label { font-family: 'Space Grotesk', sans-serif; font-size: 10px; fill: #fff; font-weight: 700; text-shadow: 0 1px 3px rgba(0,0,0,0.5); }
        .journey-var__stained-center { font-family: 'Space Grotesk', sans-serif; font-size: 14px; fill: #5c4033; font-weight: 700; }
        .journey-var--stained .journey-var__caption { color: #a38b7a; margin-top: 1.5rem; }
      `}</style>
    </div>
  );
}

// ============================================
// VARIATION 67: LEGO BRICKS
// ============================================

function JourneyLego() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.3 });

  const bricks = [
    { dest: 'ARCTIC', color: '#0ea5e9', width: 4, x: 0, y: 0 },
    { dest: 'ICELAND', color: '#8b5cf6', width: 3, x: 4, y: 0 },
    { dest: 'NORWAY', color: '#22c55e', width: 2, x: 0, y: 1 },
    { dest: 'ALPS', color: '#f97316', width: 3, x: 2, y: 1 },
    { dest: 'MOROCCO', color: '#ef4444', width: 2, x: 5, y: 1 },
    { dest: 'GREENLAND', color: '#06b6d4', width: 4, x: 0, y: 2 },
    { dest: 'BAHAMAS', color: '#ec4899', width: 3, x: 4, y: 2 },
    { dest: 'COSTA RICA', color: '#84cc16', width: 2, x: 2, y: 3 },
  ];

  const studSize = 20;
  const brickHeight = 30;

  return (
    <div className="journey-var journey-var--lego" ref={ref}>
      <div className="journey-var__lego-baseplate">
        <svg viewBox="0 0 400 180" preserveAspectRatio="xMidYMid meet">
          {bricks.map((brick, i) => {
            const bx = brick.x * (studSize + 2) + 50;
            const by = brick.y * (brickHeight + 2) + 20;
            const bw = brick.width * studSize + (brick.width - 1) * 2;

            return (
              <motion.g
                key={brick.dest}
                initial={{ y: -100, opacity: 0 }}
                animate={isInView ? { y: 0, opacity: 1 } : {}}
                transition={{ delay: i * 0.15, type: 'spring', stiffness: 100 }}
              >
                {/* Brick body */}
                <rect x={bx} y={by} width={bw} height={brickHeight} fill={brick.color} rx="2" />

                {/* Studs */}
                {[...Array(brick.width)].map((_, j) => (
                  <circle
                    key={j}
                    cx={bx + j * (studSize + 2) + studSize / 2}
                    cy={by - 4}
                    r="7"
                    fill={brick.color}
                    stroke="rgba(0,0,0,0.1)"
                    strokeWidth="1"
                  />
                ))}

                {/* Label */}
                <text x={bx + bw / 2} y={by + brickHeight / 2 + 4} textAnchor="middle" className="journey-var__lego-label">
                  {brick.dest}
                </text>
              </motion.g>
            );
          })}
        </svg>
      </div>
      <p className="journey-var__caption">Build your expedition</p>

      <style>{`
        .journey-var--lego { background: #fbbf24; padding: 2rem; border-radius: 12px; }
        .journey-var__lego-baseplate { background: #22c55e; padding: 1rem; border-radius: 4px; }
        .journey-var__lego-label { font-family: 'Space Grotesk', sans-serif; font-size: 8px; fill: #fff; font-weight: 700; text-shadow: 0 1px 2px rgba(0,0,0,0.3); }
        .journey-var--lego .journey-var__caption { color: #92400e; margin-top: 1.5rem; }
      `}</style>
    </div>
  );
}

// ============================================
// VARIATION 68: PRICE TAGS
// ============================================

function JourneyPriceTags() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.3 });

  return (
    <div className="journey-var journey-var--pricetags" ref={ref}>
      <div className="journey-var__pricetags-rack">
        {destinations.map((dest, i) => (
          <motion.div
            key={dest.id}
            className="journey-var__pricetag"
            initial={{ opacity: 0, y: 30, rotate: -5 }}
            animate={isInView ? { opacity: 1, y: 0, rotate: (i % 2 === 0 ? 3 : -3) } : {}}
            transition={{ delay: i * 0.1, type: 'spring' }}
          >
            <div className="journey-var__pricetag-hole" />
            <span className="journey-var__pricetag-dest">{dest.name}</span>
            <span className="journey-var__pricetag-distance">{dest.distance}</span>
            <span className="journey-var__pricetag-tag">EXPEDITION</span>
          </motion.div>
        ))}
      </div>
      <p className="journey-var__caption">Priceless adventures on display</p>

      <style>{`
        .journey-var--pricetags { background: #f5f0e6; padding: 2rem; }
        .journey-var__pricetags-rack { display: flex; flex-wrap: wrap; gap: 1rem; justify-content: center; }
        .journey-var__pricetag { background: #fffef5; width: 100px; padding: 1rem 0.75rem 0.75rem; border: 1px solid #d4c5a9; position: relative; box-shadow: 2px 2px 8px rgba(0,0,0,0.1); }
        .journey-var__pricetag-hole { position: absolute; top: 8px; left: 50%; transform: translateX(-50%); width: 10px; height: 10px; border: 2px solid #d4c5a9; border-radius: 50%; background: #f5f0e6; }
        .journey-var__pricetag-dest { display: block; font-family: 'Space Grotesk', sans-serif; font-size: 0.85rem; font-weight: 700; color: #1a1a1a; margin-top: 0.75rem; text-align: center; }
        .journey-var__pricetag-distance { display: block; font-family: 'Share Tech Mono', monospace; font-size: 1.1rem; color: #c41e3a; text-align: center; margin: 0.5rem 0; }
        .journey-var__pricetag-tag { display: block; font-family: 'Space Grotesk', sans-serif; font-size: 0.55rem; color: #888; text-align: center; text-transform: uppercase; letter-spacing: 0.1em; }
        .journey-var--pricetags .journey-var__caption { margin-top: 2rem; }
      `}</style>
    </div>
  );
}

// ============================================
// VARIATION 69: ADVENT CALENDAR
// ============================================

function JourneyAdventCalendar() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.3 });
  const [opened, setOpened] = useState({});

  const toggleDoor = (id) => {
    setOpened(prev => ({ ...prev, [id]: !prev[id] }));
  };

  return (
    <div className="journey-var journey-var--advent" ref={ref}>
      <h3 className="journey-var__advent-title">EXPEDITION ADVENT CALENDAR</h3>
      <div className="journey-var__advent-grid">
        {destinations.map((dest, i) => (
          <motion.div
            key={dest.id}
            className={`journey-var__advent-door ${opened[dest.id] ? 'open' : ''}`}
            onClick={() => toggleDoor(dest.id)}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={isInView ? { opacity: 1, scale: 1 } : {}}
            transition={{ delay: i * 0.1 }}
          >
            <div className="journey-var__advent-front">
              <span className="journey-var__advent-num">{i + 1}</span>
            </div>
            <div className="journey-var__advent-back">
              <span className="journey-var__advent-dest">{dest.name}</span>
              <span className="journey-var__advent-dist">{dest.distance}</span>
            </div>
          </motion.div>
        ))}
      </div>
      <p className="journey-var__caption">Open to reveal your destinations</p>

      <style>{`
        .journey-var--advent { background: linear-gradient(135deg, #1e3a5f 0%, #0f1c2e 100%); padding: 2rem; border-radius: 12px; }
        .journey-var__advent-title { font-family: 'Space Grotesk', sans-serif; font-size: 1rem; color: #fbbf24; text-align: center; margin-bottom: 1.5rem; letter-spacing: 0.1em; }
        .journey-var__advent-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 0.75rem; max-width: 400px; margin: 0 auto; }
        .journey-var__advent-door { aspect-ratio: 1; cursor: pointer; perspective: 1000px; }
        .journey-var__advent-front, .journey-var__advent-back { position: absolute; inset: 0; backface-visibility: hidden; border-radius: 8px; display: flex; flex-direction: column; align-items: center; justify-content: center; transition: transform 0.6s; }
        .journey-var__advent-front { background: linear-gradient(135deg, #c41e3a 0%, #8b0000 100%); border: 2px solid #fbbf24; z-index: 1; }
        .journey-var__advent-door.open .journey-var__advent-front { transform: rotateY(-180deg); }
        .journey-var__advent-back { background: #fbbf24; transform: rotateY(180deg); }
        .journey-var__advent-door.open .journey-var__advent-back { transform: rotateY(0); }
        .journey-var__advent-num { font-family: 'Space Grotesk', sans-serif; font-size: 1.5rem; font-weight: 700; color: #fbbf24; }
        .journey-var__advent-dest { font-family: 'Space Grotesk', sans-serif; font-size: 0.7rem; font-weight: 700; color: #1a1a1a; }
        .journey-var__advent-dist { font-family: 'Share Tech Mono', monospace; font-size: 0.6rem; color: #5c4a35; }
        .journey-var--advent .journey-var__caption { color: #98d8c8; margin-top: 1.5rem; }
      `}</style>
    </div>
  );
}

// ============================================
// VARIATION 70: FORTUNE COOKIES
// ============================================

function JourneyFortuneCookies() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.3 });
  const [cracked, setCracked] = useState(null);

  const fortunes = destinations.map((d, i) => ({
    ...d,
    fortune: [
      'Adventure awaits in the frozen north',
      'Fire and ice will reveal your destiny',
      'The desert holds secrets for the brave',
      'Fjords call to those who dare',
      'Mountains test the spirit within',
      'Ice caps crown the worthy explorer',
      'Turquoise waters heal the wandering soul',
      'Rainforests whisper ancient wisdom'
    ][i]
  }));

  return (
    <div className="journey-var journey-var--fortune" ref={ref}>
      <div className="journey-var__fortune-plate">
        {fortunes.map((cookie, i) => (
          <motion.div
            key={cookie.id}
            className={`journey-var__fortune-cookie ${cracked === i ? 'cracked' : ''}`}
            onClick={() => setCracked(i)}
            initial={{ opacity: 0, scale: 0 }}
            animate={isInView ? { opacity: 1, scale: 1 } : {}}
            transition={{ delay: i * 0.1, type: 'spring' }}
            whileHover={{ scale: 1.1 }}
          >
            <span className="journey-var__fortune-emoji">🥠</span>
            {cracked === i && (
              <motion.div
                className="journey-var__fortune-slip"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
              >
                <span className="journey-var__fortune-dest">{cookie.name}</span>
                <span className="journey-var__fortune-text">{cookie.fortune}</span>
              </motion.div>
            )}
          </motion.div>
        ))}
      </div>
      <p className="journey-var__caption">Crack open your destiny</p>

      <style>{`
        .journey-var--fortune { background: #c41e3a; padding: 2rem; border-radius: 12px; }
        .journey-var__fortune-plate { display: flex; flex-wrap: wrap; gap: 1rem; justify-content: center; padding: 2rem; background: #fff; border-radius: 50%; max-width: 400px; margin: 0 auto; }
        .journey-var__fortune-cookie { position: relative; cursor: pointer; font-size: 2.5rem; transition: transform 0.2s; }
        .journey-var__fortune-cookie.cracked { transform: scale(1.2); }
        .journey-var__fortune-slip { position: absolute; bottom: -80px; left: 50%; transform: translateX(-50%); background: #fffef5; padding: 0.75rem 1rem; border-radius: 4px; box-shadow: 0 4px 15px rgba(0,0,0,0.2); width: 180px; z-index: 10; }
        .journey-var__fortune-dest { display: block; font-family: 'Space Grotesk', sans-serif; font-size: 0.85rem; font-weight: 700; color: #c41e3a; margin-bottom: 0.25rem; }
        .journey-var__fortune-text { font-family: 'Georgia', serif; font-size: 0.75rem; color: #555; font-style: italic; line-height: 1.4; }
        .journey-var--fortune .journey-var__caption { color: #fbbf24; margin-top: 1.5rem; }
      `}</style>
    </div>
  );
}

// ============================================
// VARIATION 71: EMOJI WORLD
// ============================================

function JourneyEmojiWorld() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.3 });

  const emojiDests = [
    { dest: 'ARCTIC', emoji: '🧊🐻‍❄️❄️', bg: '#e0f2fe' },
    { dest: 'ICELAND', emoji: '🌋🇮🇸🌊', bg: '#dbeafe' },
    { dest: 'MOROCCO', emoji: '🏜️🐪🕌', bg: '#fef3c7' },
    { dest: 'NORWAY', emoji: '🏔️🇳🇴🌲', bg: '#d1fae5' },
    { dest: 'ALPS', emoji: '⛷️🏔️🦅', bg: '#f3e8ff' },
    { dest: 'GREENLAND', emoji: '🧊🦭🌌', bg: '#ecfeff' },
    { dest: 'BAHAMAS', emoji: '🏝️🌴🐠', bg: '#fce7f3' },
    { dest: 'COSTA RICA', emoji: '🦜🌺🦥', bg: '#dcfce7' },
  ];

  return (
    <div className="journey-var journey-var--emoji" ref={ref}>
      <div className="journey-var__emoji-world">
        <motion.div
          className="journey-var__emoji-center"
          initial={{ scale: 0 }}
          animate={isInView ? { scale: 1 } : {}}
        >
          🚁
          <span>DENHAM</span>
        </motion.div>

        <div className="journey-var__emoji-grid">
          {emojiDests.map((item, i) => (
            <motion.div
              key={item.dest}
              className="journey-var__emoji-card"
              style={{ background: item.bg }}
              initial={{ opacity: 0, y: 30 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: i * 0.1, type: 'spring' }}
              whileHover={{ scale: 1.05, rotate: 2 }}
            >
              <span className="journey-var__emoji-icons">{item.emoji}</span>
              <span className="journey-var__emoji-dest">{item.dest}</span>
            </motion.div>
          ))}
        </div>
      </div>
      <p className="journey-var__caption">Express your adventure 🌍✈️</p>

      <style>{`
        .journey-var--emoji { background: linear-gradient(135deg, #fdf4ff 0%, #fce7f3 50%, #fbcfe8 100%); padding: 2rem; border-radius: 12px; }
        .journey-var__emoji-world { display: flex; flex-direction: column; align-items: center; gap: 1.5rem; }
        .journey-var__emoji-center { font-size: 3rem; text-align: center; }
        .journey-var__emoji-center span { display: block; font-family: 'Space Grotesk', sans-serif; font-size: 0.85rem; font-weight: 700; color: #1a1a1a; margin-top: 0.25rem; }
        .journey-var__emoji-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 0.75rem; }
        .journey-var__emoji-card { padding: 1rem 0.75rem; border-radius: 12px; text-align: center; cursor: pointer; transition: all 0.2s; }
        .journey-var__emoji-icons { display: block; font-size: 1.5rem; margin-bottom: 0.5rem; }
        .journey-var__emoji-dest { font-family: 'Space Grotesk', sans-serif; font-size: 0.7rem; font-weight: 700; color: #1a1a1a; }
        .journey-var--emoji .journey-var__caption { margin-top: 1rem; }
      `}</style>
    </div>
  );
}

// ============================================
// ALL VARIATIONS
// ============================================

const allVariations = [
  { id: 'radial-burst', name: 'Radial Burst', category: 'Geometric', desc: 'Lines radiating from center point', component: JourneyRadialBurst },
  { id: 'orbital-rings', name: 'Orbital Rings', category: 'Circular', desc: 'Concentric circles showing distance', component: JourneyOrbitalRings },
  { id: 'constellation', name: 'Constellation', category: 'Artistic', desc: 'Star map with connected points', component: JourneyConstellation },
  { id: 'flight-network', name: 'Flight Network', category: 'Technical', desc: 'Airline-style route map', component: JourneyFlightNetwork },
  { id: 'compass-rose', name: 'Compass Rose', category: 'Navigation', desc: 'Directional compass layout', component: JourneyCompass },
  { id: 'timeline', name: 'Timeline', category: 'Chronological', desc: 'Horizontal expedition history', component: JourneyTimeline },
  { id: 'globe', name: 'Globe 3D', category: 'Dimensional', desc: 'Pseudo-3D globe with pins', component: JourneyGlobe },
  { id: 'hex-grid', name: 'Hexagonal Grid', category: 'Modern', desc: 'Honeycomb destination tiles', component: JourneyHexGrid },
  { id: 'distance-rings', name: 'Distance Rings', category: 'Data Viz', desc: 'Range visualization bands', component: JourneyDistanceRings },
  { id: 'departure-board', name: 'Departure Board', category: 'Retro', desc: 'Airport-style flight board', component: JourneyDepartureBoard },
  { id: 'radar', name: 'Radar Sweep', category: 'Military', desc: 'Radar screen with destination blips', component: JourneyRadar },
  { id: 'metro', name: 'Metro Map', category: 'Transit', desc: 'Subway-style route diagram', component: JourneyMetro },
  { id: 'polaroids', name: 'Polaroid Grid', category: 'Nostalgic', desc: 'Scattered instant photos', component: JourneyPolaroids },
  { id: 'pinboard', name: 'Pinboard', category: 'Planning', desc: 'Cork board with string connections', component: JourneyPinboard },
  { id: 'cards', name: 'Playing Cards', category: 'Playful', desc: 'Fanned deck of destination cards', component: JourneyCards },
  { id: 'film-strip', name: 'Film Strip', category: 'Cinema', desc: '35mm film with destination frames', component: JourneyFilmStrip },
  { id: 'passport', name: 'Passport Stamps', category: 'Travel', desc: 'Collection of visa stamps', component: JourneyPassport },
  { id: 'galaxy', name: 'Spiral Galaxy', category: 'Cosmic', desc: 'Galaxy arms with destination stars', component: JourneyGalaxy },
  { id: 'tree-rings', name: 'Tree Rings', category: 'Organic', desc: 'Growth rings showing expedition years', component: JourneyTreeRings },
  { id: 'circuit', name: 'Circuit Board', category: 'Tech', desc: 'PCB traces connecting chips', component: JourneyCircuit },
  { id: 'luggage-tags', name: 'Luggage Tags', category: 'Airport', desc: 'Vintage baggage tags', component: JourneyLuggageTags },
  { id: 'weather-map', name: 'Weather Map', category: 'Meteorological', desc: 'Weather conditions at destinations', component: JourneyWeatherMap },
  { id: 'isometric', name: 'Isometric Blocks', category: '3D', desc: '3D cube city layout', component: JourneyIsometric },
  { id: 'vintage-map', name: 'Vintage Map', category: 'Antique', desc: 'Old world cartography style', component: JourneyVintageMap },
  { id: 'neon', name: 'Neon Signs', category: 'Urban', desc: 'Glowing neon destination signs', component: JourneyNeon },
  { id: 'vinyl', name: 'Vinyl Record', category: 'Music', desc: 'Record grooves as destination tracks', component: JourneyVinyl },
  { id: 'boarding-pass', name: 'Boarding Pass', category: 'Aviation', desc: 'Airline ticket collection', component: JourneyBoardingPass },
  { id: 'speedometer', name: 'Speedometer', category: 'Automotive', desc: 'Distance gauge dial', component: JourneySpeedometer },
  { id: 'hourglass', name: 'Hourglass', category: 'Temporal', desc: 'Sand flowing through journeys', component: JourneyHourglass },
  { id: 'slot-machine', name: 'Slot Machine', category: 'Interactive', desc: 'Spin to pick your destination', component: JourneySlotMachine },
  { id: 'compass-network', name: 'Compass Network', category: 'Premium', desc: 'Merged compass + flight paths with helicopter', component: JourneyCompassNetwork },
  { id: 'atc', name: 'Air Traffic Control', category: 'Aviation', desc: 'ATC radar with flight strips', component: JourneyAirTrafficControl },
  { id: 'topographic', name: 'Topographic Map', category: 'Cartography', desc: 'Contour elevation style', component: JourneyTopographic },
  { id: 'starchart', name: 'Star Chart', category: 'Nautical', desc: 'Celestial navigation map', component: JourneyStarChart },
  { id: 'waypoints', name: 'GPS Waypoints', category: 'Navigation', desc: 'Flight plan waypoint list', component: JourneyWaypoints },
  { id: 'flight-levels', name: 'Flight Levels', category: 'Aviation', desc: 'Altitude band visualization', component: JourneyFlightLevels },
  { id: 'inkblot', name: 'Watercolor Inkblot', category: 'Artistic', desc: 'Painted destination marks', component: JourneyInkblot },
  { id: 'chalkboard', name: 'Chalkboard', category: 'Academic', desc: 'Hand-drawn chalk lessons', component: JourneyChalkboard },
  { id: 'blueprint', name: 'Blueprint', category: 'Technical', desc: 'Engineering drawing style', component: JourneyBlueprint },
  { id: 'postcards-stack', name: 'Postcard Stack', category: 'Nostalgic', desc: 'Travel postcards collection', component: JourneyPostcards },
  { id: 'antenna', name: 'Radio Antenna', category: 'Broadcast', desc: 'Signal strength indicators', component: JourneyAntenna },
  { id: 'kaleidoscope', name: 'Kaleidoscope', category: 'Artistic', desc: 'Rotating pattern wheel', component: JourneyKaleidoscope },
  { id: 'roulette', name: 'Casino Roulette', category: 'Interactive', desc: 'Spin to pick destination', component: JourneyRoulette },
  { id: 'bookshelf', name: 'Bookshelf Spines', category: 'Literary', desc: 'Travel story collection', component: JourneyBookshelf },
  { id: 'split-flap', name: 'Split-Flap Display', category: 'Retro', desc: 'Classic flip board', component: JourneySplitFlap },
  { id: 'mosaic', name: 'Mosaic Tiles', category: 'Artistic', desc: 'Tile pattern grid', component: JourneyMosaic },
  { id: 'barcode', name: 'Barcode Scanner', category: 'Modern', desc: 'Scannable destinations', component: JourneyBarcode },
  { id: 'origami', name: 'Origami Map', category: 'Paper', desc: 'Folded paper airplanes', component: JourneyOrigami },
  { id: 'satellite', name: 'Satellite View', category: 'Space', desc: 'Orbital reconnaissance', component: JourneySatellite },
  { id: 'bubbles', name: 'Floating Bubbles', category: 'Playful', desc: 'Dreamy floating orbs', component: JourneyBubbles },
  { id: 'clockwork', name: 'Clockwork Gears', category: 'Steampunk', desc: 'Mechanical gear system', component: JourneyClockwork },
  { id: 'hologram', name: 'Holographic Display', category: 'Sci-Fi', desc: '3D hologram projection', component: JourneyHologram },
  { id: 'subway-lines', name: 'Subway Lines', category: 'Transit', desc: 'Multi-line transit map', component: JourneySubwayLines },
  { id: 'waveform', name: 'Audio Waveform', category: 'Music', desc: 'Sound visualization tracks', component: JourneyWaveform },
  { id: 'typewriter', name: 'Typewriter', category: 'Vintage', desc: 'Typing animation effect', component: JourneyTypewriter },
  { id: 'card-flip', name: 'Card Flip Grid', category: 'Interactive', desc: 'Memory card matching', component: JourneyCardFlip },
  { id: 'stacked-layers', name: 'Stacked Layers', category: 'Visual', desc: 'Range category cards', component: JourneyStackedLayers },
  { id: 'ticket-stubs', name: 'Ticket Stubs', category: 'Travel', desc: 'Vintage admission tickets', component: JourneyTicketStubs },
  { id: 'lava-lamp', name: 'Lava Lamp', category: 'Retro', desc: 'Floating blob animation', component: JourneyLavaLamp },
  { id: 'crossword', name: 'Crossword Puzzle', category: 'Games', desc: 'Word puzzle grid', component: JourneyCrossword },
  { id: 'snow-globe', name: 'Snow Globe', category: 'Whimsical', desc: 'Shake to reveal', component: JourneySnowGlobe },
  { id: 'climbing-wall', name: 'Climbing Wall', category: 'Adventure', desc: 'Boulder route holds', component: JourneyClimbingWall },
  { id: 'pinball', name: 'Pinball Machine', category: 'Arcade', desc: 'Bumper destinations', component: JourneyPinball },
  { id: 'dominoes', name: 'Domino Chain', category: 'Games', desc: 'Click to topple', component: JourneyDominoes },
  { id: 'periodic-table', name: 'Periodic Table', category: 'Science', desc: 'Element-style cards', component: JourneyPeriodicTable },
  { id: 'stained-glass', name: 'Stained Glass', category: 'Artistic', desc: 'Cathedral window', component: JourneyStainedGlass },
  { id: 'lego', name: 'Lego Bricks', category: 'Playful', desc: 'Building block stack', component: JourneyLego },
  { id: 'price-tags', name: 'Price Tags', category: 'Retail', desc: 'Hanging tag display', component: JourneyPriceTags },
  { id: 'advent-calendar', name: 'Advent Calendar', category: 'Holiday', desc: 'Open door reveals', component: JourneyAdventCalendar },
  { id: 'fortune-cookies', name: 'Fortune Cookies', category: 'Whimsical', desc: 'Crack for destiny', component: JourneyFortuneCookies },
  { id: 'emoji-world', name: 'Emoji World', category: 'Modern', desc: 'Express with emojis', component: JourneyEmojiWorld },
];

// ============================================
// PICKER UI
// ============================================

function JourneyPicker() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isMinimized, setIsMinimized] = useState(false);
  const [favorites, setFavorites] = useState([]);

  const STORAGE_KEY = 'journey-picker-favorites';

  // Load favorites
  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      try {
        setFavorites(JSON.parse(stored));
      } catch (e) {}
    }
  }, []);

  // Save favorites
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(favorites));
  }, [favorites]);

  const currentVar = allVariations[currentIndex];
  const CurrentComponent = currentVar.component;

  const goNext = useCallback(() => {
    setCurrentIndex(prev => (prev + 1) % allVariations.length);
  }, []);

  const goPrev = useCallback(() => {
    setCurrentIndex(prev => (prev - 1 + allVariations.length) % allVariations.length);
  }, []);

  // Keyboard nav
  useEffect(() => {
    const handleKey = (e) => {
      if (e.key === 'ArrowRight') goNext();
      if (e.key === 'ArrowLeft') goPrev();
      if (e.key === 'f' || e.key === 'F') toggleFavorite();
      if (e.key === 'm' || e.key === 'M') setIsMinimized(prev => !prev);
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [goNext, goPrev, currentIndex]);

  const isFavorite = favorites.includes(currentVar.id);

  const toggleFavorite = () => {
    setFavorites(prev =>
      prev.includes(currentVar.id)
        ? prev.filter(id => id !== currentVar.id)
        : [...prev, currentVar.id]
    );
  };

  return (
    <div className="journey-picker">
      {/* Header */}
      <header className="journey-picker__header">
        <Link to="/" className="journey-picker__logo">
          <img src="/assets/images/logos/hq/hq-aviation-logo-black.png" alt="HQ Aviation" />
        </Link>
        <Link to="/expeditions" className="journey-picker__back">← Back to Expeditions</Link>
      </header>

      {/* Preview Area */}
      <main className="journey-picker__preview">
        <CurrentComponent key={currentVar.id} />
      </main>

      {/* Picker Controls */}
      <div className={`journey-picker__controls ${isMinimized ? 'journey-picker__controls--minimized' : ''}`}>
        {/* Minimized bar */}
        <div className="journey-picker__minimized-bar" onClick={() => setIsMinimized(false)}>
          <span className="journey-picker__minimized-name">{currentVar.name}</span>
          <span className="journey-picker__minimized-counter">{currentIndex + 1} / {allVariations.length}</span>
          <div className="journey-picker__minimized-nav">
            <button onClick={(e) => { e.stopPropagation(); goPrev(); }}>←</button>
            <button onClick={(e) => { e.stopPropagation(); goNext(); }}>→</button>
            <button onClick={(e) => { e.stopPropagation(); setIsMinimized(false); }}>↑</button>
          </div>
        </div>

        {/* Main controls */}
        <div className="journey-picker__main">
          <div className="journey-picker__header-row">
            <h3>Journey Visualization Picker</h3>
            <button className="journey-picker__minimize-btn" onClick={() => setIsMinimized(true)}>−</button>
          </div>

          <div className="journey-picker__nav">
            <button className="journey-picker__nav-btn" onClick={goPrev}>←</button>
            <div className="journey-picker__info">
              <span className="journey-picker__category">{currentVar.category}</span>
              <span className="journey-picker__counter">{currentIndex + 1} / {allVariations.length}</span>
              <h4 className="journey-picker__name">{currentVar.name}</h4>
              <p className="journey-picker__desc">{currentVar.desc}</p>
            </div>
            <button className="journey-picker__nav-btn" onClick={goNext}>→</button>
            <button
              className={`journey-picker__fav-btn ${isFavorite ? 'active' : ''}`}
              onClick={toggleFavorite}
            >
              {isFavorite ? '★' : '☆'}
            </button>
          </div>

          <div className="journey-picker__thumbs">
            {allVariations.map((v, i) => (
              <button
                key={v.id}
                className={`journey-picker__thumb ${i === currentIndex ? 'active' : ''} ${favorites.includes(v.id) ? 'favorited' : ''}`}
                onClick={() => setCurrentIndex(i)}
              >
                {i + 1}
              </button>
            ))}
          </div>

          <div className="journey-picker__footer">
            <div className="journey-picker__hints">
              <span><kbd>←</kbd><kbd>→</kbd> Nav</span>
              <span><kbd>F</kbd> Fav</span>
              <span><kbd>M</kbd> Mini</span>
            </div>
            <div className="journey-picker__fav-count">
              ★ {favorites.length} favorited
            </div>
          </div>
        </div>
      </div>

      <style>{journeyPickerStyles}</style>
    </div>
  );
}

// ============================================
// STYLES
// ============================================

const journeyPickerStyles = `
  /* ===== BASE ===== */
  .journey-picker {
    font-family: 'Space Grotesk', -apple-system, sans-serif;
    background: #faf9f6;
    min-height: 100vh;
  }

  /* ===== HEADER ===== */
  .journey-picker__header {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    z-index: 100;
    padding: 1.5rem 2rem;
    display: flex;
    justify-content: space-between;
    align-items: center;
    background: rgba(250, 249, 246, 0.95);
    backdrop-filter: blur(10px);
  }

  .journey-picker__logo img {
    height: 40px;
  }

  .journey-picker__back {
    font-size: 0.85rem;
    color: #666;
    text-decoration: none;
    transition: color 0.3s;
  }

  .journey-picker__back:hover {
    color: #1a1a1a;
  }

  /* ===== PREVIEW ===== */
  .journey-picker__preview {
    padding: 100px 2rem 200px;
    min-height: 100vh;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  /* ===== VARIATION STYLES ===== */
  .journey-var {
    width: 100%;
    max-width: 800px;
    padding: 2rem;
    background: #fff;
    border-radius: 16px;
    box-shadow: 0 4px 30px rgba(0,0,0,0.08);
  }

  .journey-var svg {
    width: 100%;
    height: auto;
  }

  .journey-var__caption {
    text-align: center;
    margin-top: 1.5rem;
    font-size: 0.9rem;
    color: #666;
    font-style: italic;
  }

  .journey-var__caption--light {
    color: rgba(255,255,255,0.7);
  }

  .journey-var__center-label {
    font-family: 'Share Tech Mono', monospace;
    font-size: 12px;
    font-weight: 700;
    fill: #1a1a1a;
  }

  .journey-var__center-label--white {
    font-family: 'Share Tech Mono', monospace;
    font-size: 10px;
    font-weight: 700;
  }

  .journey-var__dest-label {
    font-family: 'Space Grotesk', sans-serif;
    font-size: 10px;
    font-weight: 600;
    fill: #666;
    text-transform: uppercase;
    letter-spacing: 0.05em;
  }

  .journey-var__dest-label--small {
    font-size: 8px;
  }

  .journey-var__distance-label {
    font-family: 'Share Tech Mono', monospace;
    font-size: 9px;
    fill: #999;
  }

  /* Constellation */
  .journey-var--constellation {
    background: linear-gradient(135deg, #0f172a 0%, #1e293b 100%);
    position: relative;
    overflow: hidden;
  }

  .journey-var__stars-bg {
    position: absolute;
    inset: 0;
    pointer-events: none;
  }

  .journey-var__bg-star {
    position: absolute;
    width: 2px;
    height: 2px;
    background: #fff;
    border-radius: 50%;
  }

  .journey-var__star-label {
    font-family: 'Space Grotesk', sans-serif;
    font-size: 9px;
    font-weight: 500;
    fill: rgba(255,255,255,0.7);
    text-transform: uppercase;
    letter-spacing: 0.1em;
  }

  .journey-var__star-label--main {
    font-size: 11px;
    fill: #fff;
  }

  /* Network */
  .journey-var__node-label {
    font-family: 'Space Grotesk', sans-serif;
    font-size: 9px;
    font-weight: 600;
    fill: #1a1a1a;
    text-transform: uppercase;
  }

  .journey-var__node-label--main {
    fill: #fff;
  }

  /* Compass */
  .journey-var__cardinal {
    font-family: 'Share Tech Mono', monospace;
    font-size: 16px;
    font-weight: 700;
    fill: #1a1a1a;
  }

  /* Timeline */
  .journey-var--timeline {
    padding: 3rem 2rem;
    position: relative;
  }

  .journey-var__timeline-track {
    position: relative;
    padding: 2rem 0;
    overflow-x: auto;
  }

  .journey-var__timeline-line {
    position: absolute;
    top: 50%;
    left: 0;
    right: 0;
    height: 3px;
    background: linear-gradient(90deg, #2563eb, #1d4ed8);
    transform-origin: left;
  }

  .journey-var__timeline-items {
    display: flex;
    gap: 1.5rem;
    position: relative;
    z-index: 1;
    padding: 0 1rem;
  }

  .journey-var__timeline-item {
    flex: 0 0 100px;
    text-align: center;
    padding-top: 2rem;
  }

  .journey-var__timeline-dot {
    width: 14px;
    height: 14px;
    background: #2563eb;
    border: 3px solid #fff;
    border-radius: 50%;
    margin: 0 auto 0.75rem;
    box-shadow: 0 0 0 3px #2563eb;
  }

  .journey-var__timeline-year {
    font-family: 'Share Tech Mono', monospace;
    font-size: 0.75rem;
    color: #2563eb;
    font-weight: 700;
  }

  .journey-var__timeline-dest {
    font-size: 0.85rem;
    font-weight: 700;
    color: #1a1a1a;
    margin: 0.25rem 0;
  }

  .journey-var__timeline-type {
    font-size: 0.7rem;
    color: #888;
    text-transform: uppercase;
    letter-spacing: 0.05em;
  }

  .journey-var__timeline-start {
    position: absolute;
    left: 2rem;
    top: 50%;
    transform: translateY(-50%);
    text-align: center;
    background: #1a1a1a;
    color: #fff;
    padding: 0.75rem 1rem;
    border-radius: 8px;
  }

  .journey-var__timeline-home {
    display: block;
    font-weight: 700;
    font-size: 0.9rem;
  }

  .journey-var__timeline-subtitle {
    font-size: 0.65rem;
    opacity: 0.7;
    text-transform: uppercase;
    letter-spacing: 0.1em;
  }

  /* Globe */
  .journey-var--globe {
    background: linear-gradient(180deg, #e0f2fe 0%, #bae6fd 100%);
  }

  .journey-var__globe-container {
    position: relative;
    width: 320px;
    height: 320px;
    margin: 0 auto;
  }

  .journey-var__globe-sphere {
    width: 100%;
    height: 100%;
    border-radius: 50%;
    background: linear-gradient(135deg, #3b82f6 0%, #1d4ed8 50%, #1e40af 100%);
    position: relative;
    overflow: hidden;
    box-shadow:
      inset -30px -30px 60px rgba(0,0,0,0.3),
      inset 20px 20px 40px rgba(255,255,255,0.2),
      0 20px 60px rgba(0,0,0,0.3);
  }

  .journey-var__globe-grid {
    position: absolute;
    inset: 0;
    opacity: 0.3;
  }

  .journey-var__globe-lat {
    position: absolute;
    left: 5%;
    right: 5%;
    height: 1px;
    background: rgba(255,255,255,0.5);
  }

  .journey-var__globe-long {
    position: absolute;
    top: 10%;
    bottom: 10%;
    width: 1px;
    background: rgba(255,255,255,0.3);
    transform: rotate(10deg);
  }

  .journey-var__globe-pin {
    position: absolute;
    transform: translate(-50%, -50%);
  }

  .journey-var__globe-pin--main {
    z-index: 10;
  }

  .journey-var__globe-pin-dot {
    display: block;
    width: 8px;
    height: 8px;
    background: #fff;
    border-radius: 50%;
    margin: 0 auto 4px;
  }

  .journey-var__globe-pin--main .journey-var__globe-pin-label {
    background: #fff;
    padding: 4px 8px;
    border-radius: 4px;
    font-size: 10px;
    font-weight: 700;
    white-space: nowrap;
  }

  .journey-var__globe-pin-label {
    font-size: 8px;
    font-weight: 600;
    color: #fff;
    text-shadow: 0 1px 2px rgba(0,0,0,0.5);
    white-space: nowrap;
  }

  .journey-var__globe-highlight {
    position: absolute;
    inset: -20px;
    border: 2px dashed rgba(255,255,255,0.2);
    border-radius: 50%;
    pointer-events: none;
  }

  /* Hex Grid */
  .journey-var--hexgrid {
    background: #f8fafc;
  }

  .journey-var__hex-container {
    display: grid;
    grid-template-columns: repeat(5, 90px);
    grid-template-rows: repeat(4, 80px);
    gap: 8px;
    justify-content: center;
    position: relative;
    padding: 2rem;
  }

  .journey-var__hex-lines {
    position: absolute;
    inset: 0;
    pointer-events: none;
  }

  .journey-var__hex {
    width: 80px;
    height: 70px;
    background: var(--hex-color, #e2e8f0);
    clip-path: polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%);
    display: flex;
    align-items: center;
    justify-content: center;
    transition: transform 0.3s;
  }

  .journey-var__hex:hover {
    transform: scale(1.1);
  }

  .journey-var__hex--main {
    --hex-color: #1a1a1a;
    width: 100px;
    height: 88px;
  }

  .journey-var__hex-inner {
    text-align: center;
  }

  .journey-var__hex-label {
    display: block;
    font-size: 9px;
    font-weight: 700;
    color: #fff;
    text-transform: uppercase;
  }

  .journey-var__hex:not(.journey-var__hex--main) .journey-var__hex-label {
    color: #1a1a1a;
    mix-blend-mode: multiply;
  }

  .journey-var__hex-sub {
    display: block;
    font-size: 7px;
    color: rgba(255,255,255,0.7);
    text-transform: uppercase;
    letter-spacing: 0.1em;
    margin-top: 2px;
  }

  /* Distance Rings */
  .journey-var__ring-label {
    font-family: 'Share Tech Mono', monospace;
    font-size: 9px;
    fill: #2563eb;
  }

  /* Departure Board */
  .journey-var--board {
    background: #0a0a0a;
    padding: 0;
    overflow: hidden;
  }

  .journey-var__board {
    font-family: 'Share Tech Mono', monospace;
  }

  .journey-var__board-header {
    background: #1a1a1a;
    padding: 1.5rem;
    text-align: center;
    border-bottom: 2px solid #333;
  }

  .journey-var__board-title {
    display: block;
    font-size: 1.25rem;
    font-weight: 700;
    color: #fbbf24;
    letter-spacing: 0.1em;
  }

  .journey-var__board-origin {
    display: block;
    font-size: 0.75rem;
    color: #888;
    margin-top: 0.25rem;
  }

  .journey-var__board-cols {
    display: grid;
    grid-template-columns: 80px 1fr 100px 100px;
    padding: 0.75rem 1.5rem;
    background: #1a1a1a;
    font-size: 0.65rem;
    color: #666;
    text-transform: uppercase;
    letter-spacing: 0.1em;
    border-bottom: 1px solid #333;
  }

  .journey-var__board-rows {
    padding: 0.5rem 0;
  }

  .journey-var__board-row {
    display: grid;
    grid-template-columns: 80px 1fr 100px 100px;
    padding: 0.75rem 1.5rem;
    border-bottom: 1px solid #222;
    align-items: center;
  }

  .journey-var__board-code {
    font-size: 0.8rem;
    color: #666;
  }

  .journey-var__board-dest {
    font-size: 1rem;
    font-weight: 700;
    color: #fff;
  }

  .journey-var__board-dist {
    font-size: 0.85rem;
    color: #888;
  }

  .journey-var__board-status {
    font-size: 0.75rem;
    padding: 0.25rem 0.5rem;
    border-radius: 4px;
    text-align: center;
  }

  .journey-var__board-status--completed {
    background: #166534;
    color: #4ade80;
  }

  .journey-var__board-status--scheduled {
    background: #854d0e;
    color: #fbbf24;
  }

  .journey-var__board-status--planning {
    background: #1e3a8a;
    color: #60a5fa;
  }

  .journey-var--board .journey-var__caption {
    padding: 1rem;
    margin: 0;
    color: #666;
  }

  /* Radar */
  .journey-var--radar {
    background: #0a0f0a;
    padding: 2rem;
  }

  .journey-var__radar-screen {
    position: relative;
    width: 350px;
    height: 350px;
    margin: 0 auto;
    border-radius: 50%;
    background: radial-gradient(circle, #0a1f0a 0%, #051505 100%);
    box-shadow: inset 0 0 50px rgba(0,255,0,0.1), 0 0 30px rgba(0,0,0,0.5);
  }

  .journey-var__radar-grid {
    position: absolute;
    inset: 0;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .journey-var__radar-ring {
    position: absolute;
    border: 1px solid rgba(0,255,0,0.2);
    border-radius: 50%;
  }

  .journey-var__radar-cross {
    position: absolute;
    width: 100%;
    height: 100%;
  }

  .journey-var__radar-cross::before,
  .journey-var__radar-cross::after {
    content: '';
    position: absolute;
    background: rgba(0,255,0,0.15);
  }

  .journey-var__radar-cross::before {
    width: 1px;
    height: 100%;
    left: 50%;
  }

  .journey-var__radar-cross::after {
    width: 100%;
    height: 1px;
    top: 50%;
  }

  .journey-var__radar-sweep {
    position: absolute;
    inset: 0;
    background: conic-gradient(from 0deg, transparent 0deg, rgba(0,255,0,0.3) 30deg, transparent 60deg);
    border-radius: 50%;
  }

  .journey-var__radar-center {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    width: 20px;
    height: 20px;
    background: #00ff00;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 8px;
    font-weight: 700;
    color: #000;
  }

  .journey-var__radar-blip {
    position: absolute;
    transform: translate(-50%, -50%);
  }

  .journey-var__radar-blip::before {
    content: '';
    display: block;
    width: 10px;
    height: 10px;
    background: #00ff00;
    border-radius: 50%;
    box-shadow: 0 0 10px #00ff00;
  }

  .journey-var__radar-blip-label {
    position: absolute;
    top: 15px;
    left: 50%;
    transform: translateX(-50%);
    font-size: 8px;
    color: #00ff00;
    white-space: nowrap;
    font-family: 'Share Tech Mono', monospace;
  }

  /* Metro */
  .journey-var--metro {
    background: #f5f5f5;
    padding: 1.5rem;
  }

  .journey-var__metro-header {
    display: flex;
    align-items: center;
    gap: 1rem;
    margin-bottom: 1.5rem;
  }

  .journey-var__metro-logo {
    width: 40px;
    height: 40px;
    background: #1a1a1a;
    color: #fff;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    font-weight: 700;
    font-size: 14px;
  }

  .journey-var__metro-title {
    font-size: 1rem;
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: 0.1em;
  }

  .journey-var__metro-map {
    display: flex;
    flex-direction: column;
    gap: 1rem;
  }

  .journey-var__metro-line {
    display: flex;
    align-items: center;
    gap: 0;
    position: relative;
  }

  .journey-var__metro-line::before {
    content: '';
    position: absolute;
    top: 50%;
    left: 20px;
    right: 20px;
    height: 6px;
    background: var(--line-color);
    transform: translateY(-50%);
    border-radius: 3px;
  }

  .journey-var__metro-stop {
    flex: 1;
    display: flex;
    flex-direction: column;
    align-items: center;
    position: relative;
    z-index: 1;
  }

  .journey-var__metro-dot {
    width: 16px;
    height: 16px;
    background: #fff;
    border: 4px solid var(--line-color);
    border-radius: 50%;
  }

  .journey-var__metro-stop--main .journey-var__metro-dot {
    width: 24px;
    height: 24px;
    background: #1a1a1a;
    border-color: #1a1a1a;
  }

  .journey-var__metro-name {
    margin-top: 0.5rem;
    font-size: 0.7rem;
    font-weight: 600;
    text-transform: uppercase;
  }

  .journey-var__metro-legend {
    display: flex;
    gap: 1.5rem;
    margin-top: 1.5rem;
    padding-top: 1rem;
    border-top: 1px solid #ddd;
  }

  .journey-var__metro-legend-item {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    font-size: 0.75rem;
  }

  .journey-var__metro-legend-color {
    width: 20px;
    height: 6px;
    border-radius: 3px;
  }

  /* Polaroids */
  .journey-var--polaroids {
    background: #e8e4df;
    padding: 2rem;
  }

  .journey-var__polaroid-grid {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 1rem;
    max-width: 500px;
    margin: 0 auto;
  }

  .journey-var__polaroid {
    background: #fff;
    padding: 0.75rem 0.75rem 2.5rem;
    box-shadow: 0 4px 15px rgba(0,0,0,0.15);
    cursor: pointer;
    transform: rotate(var(--rotate));
  }

  .journey-var__polaroid-img {
    aspect-ratio: 1;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 2rem;
  }

  .journey-var__polaroid-label {
    display: block;
    text-align: center;
    margin-top: 0.75rem;
    font-family: 'Caveat', cursive, sans-serif;
    font-size: 1rem;
  }

  .journey-var__polaroid--main {
    grid-column: 2;
    grid-row: 2;
    z-index: 5;
  }

  .journey-var__polaroid--main .journey-var__polaroid-img {
    background: #1a1a1a !important;
    color: #fff;
  }

  /* Pinboard */
  .journey-var--pinboard {
    background: #f5f0e8;
    padding: 1rem;
  }

  .journey-var__cork {
    position: relative;
    width: 100%;
    aspect-ratio: 4/3;
    background:
      url("data:image/svg+xml,%3Csvg viewBox='0 0 100 100' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='4'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='0.1'/%3E%3C/svg%3E"),
      linear-gradient(135deg, #c9a87c 0%, #b8956a 100%);
    border: 12px solid #5c3d1e;
    border-radius: 4px;
    box-shadow: inset 0 0 30px rgba(0,0,0,0.2);
  }

  .journey-var__strings {
    position: absolute;
    inset: 0;
    pointer-events: none;
  }

  .journey-var__pin {
    position: absolute;
    transform: translate(-50%, -50%);
    cursor: pointer;
  }

  .journey-var__pin-head {
    width: 16px;
    height: 16px;
    background: radial-gradient(circle at 30% 30%, #ff6b6b, #dc2626);
    border-radius: 50%;
    box-shadow: 0 2px 4px rgba(0,0,0,0.3);
  }

  .journey-var__pin--main .journey-var__pin-head {
    width: 24px;
    height: 24px;
    background: radial-gradient(circle at 30% 30%, #fbbf24, #d97706);
  }

  .journey-var__pin-label {
    position: absolute;
    top: 20px;
    left: 50%;
    transform: translateX(-50%);
    font-size: 9px;
    font-weight: 700;
    color: #1a1a1a;
    white-space: nowrap;
    text-shadow: 0 1px 0 rgba(255,255,255,0.5);
  }

  /* Playing Cards */
  .journey-var--cards {
    background: linear-gradient(135deg, #065f46 0%, #047857 100%);
    padding: 3rem 1rem;
  }

  .journey-var__card-fan {
    display: flex;
    justify-content: center;
    align-items: flex-end;
    height: 250px;
    position: relative;
  }

  .journey-var__card {
    position: absolute;
    width: 80px;
    height: 120px;
    background: #fff;
    border-radius: 8px;
    box-shadow: 0 4px 15px rgba(0,0,0,0.3);
    cursor: pointer;
    display: flex;
    flex-direction: column;
    padding: 6px;
  }

  .journey-var__card-corner {
    display: flex;
    flex-direction: column;
    align-items: center;
    line-height: 1;
    color: var(--card-color);
  }

  .journey-var__card-corner--bottom {
    margin-top: auto;
    transform: rotate(180deg);
  }

  .journey-var__card-value {
    font-size: 14px;
    font-weight: 700;
  }

  .journey-var__card-suit {
    font-size: 12px;
  }

  .journey-var__card-center {
    flex: 1;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .journey-var__card-dest {
    font-size: 8px;
    font-weight: 700;
    text-transform: uppercase;
    writing-mode: vertical-rl;
    text-orientation: mixed;
  }

  /* Film Strip */
  .journey-var--film {
    background: #1a1a1a;
    padding: 2rem 0;
    overflow: hidden;
  }

  .journey-var__film-strip {
    background: #2a2a2a;
    padding: 0.5rem 0;
  }

  .journey-var__film-perfs {
    display: flex;
    justify-content: space-around;
    padding: 0 1rem;
  }

  .journey-var__film-perf {
    width: 12px;
    height: 8px;
    background: #1a1a1a;
    border-radius: 2px;
  }

  .journey-var__film-frames {
    display: flex;
    gap: 0.5rem;
    padding: 0.5rem 1rem;
    overflow-x: auto;
  }

  .journey-var__film-frame {
    flex: 0 0 90px;
    background: #444;
    padding: 0.5rem;
    text-align: center;
  }

  .journey-var__film-frame--main {
    background: #fbbf24;
  }

  .journey-var__film-img {
    height: 60px;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 1.5rem;
    background: rgba(0,0,0,0.2);
  }

  .journey-var__film-label {
    display: block;
    font-size: 8px;
    color: #fff;
    margin-top: 0.25rem;
    font-weight: 600;
  }

  .journey-var__film-frame--main .journey-var__film-label {
    color: #1a1a1a;
  }

  .journey-var__film-year {
    display: block;
    font-size: 10px;
    color: rgba(255,255,255,0.5);
    font-family: 'Share Tech Mono', monospace;
  }

  .journey-var__film-frame--main .journey-var__film-year {
    color: rgba(0,0,0,0.5);
  }

  /* Passport */
  .journey-var--passport {
    background: #f5f5dc;
    padding: 1rem;
  }

  .journey-var__passport-page {
    background: #fffef5;
    border: 1px solid #d4c5a9;
    padding: 1.5rem;
    min-height: 400px;
    position: relative;
  }

  .journey-var__passport-header {
    text-align: center;
    padding-bottom: 1rem;
    border-bottom: 1px solid #e8e0d0;
    margin-bottom: 1.5rem;
  }

  .journey-var__passport-header span {
    display: block;
    font-size: 0.7rem;
    color: #666;
    text-transform: uppercase;
    letter-spacing: 0.2em;
  }

  .journey-var__passport-header span:first-child {
    font-size: 1rem;
    font-weight: 700;
    color: #1a1a1a;
    margin-bottom: 0.25rem;
  }

  .journey-var__stamps {
    display: flex;
    flex-wrap: wrap;
    gap: 1rem;
    justify-content: center;
  }

  .journey-var__stamp {
    padding: 1rem;
    border: 3px solid var(--stamp-color);
    color: var(--stamp-color);
    text-align: center;
    transform: rotate(var(--stamp-rotate));
  }

  .journey-var__stamp--circle {
    border-radius: 50%;
    width: 90px;
    height: 90px;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
  }

  .journey-var__stamp--rect {
    border-radius: 4px;
  }

  .journey-var__stamp-dest {
    display: block;
    font-size: 10px;
    font-weight: 700;
    text-transform: uppercase;
  }

  .journey-var__stamp-date {
    display: block;
    font-size: 8px;
    margin: 0.25rem 0;
  }

  .journey-var__stamp-approved {
    display: block;
    font-size: 7px;
    font-weight: 700;
  }

  /* Galaxy */
  .journey-var--galaxy {
    background: radial-gradient(ellipse at center, #1a1033 0%, #0a0a15 100%);
    padding: 2rem;
    position: relative;
    overflow: hidden;
  }

  .journey-var__galaxy-bg {
    position: absolute;
    inset: 0;
    pointer-events: none;
  }

  .journey-var__galaxy-star {
    position: absolute;
    background: #fff;
    border-radius: 50%;
  }

  .journey-var__galaxy-arms {
    position: absolute;
    top: 50%;
    left: 50%;
    width: 300px;
    height: 300px;
    transform: translate(-50%, -50%);
    pointer-events: none;
  }

  .journey-var__galaxy-arm {
    position: absolute;
    inset: 0;
    background: conic-gradient(
      from calc(var(--arm-offset) * 1deg),
      transparent 0deg,
      rgba(100, 100, 255, 0.1) 40deg,
      transparent 80deg
    );
    border-radius: 50%;
  }

  .journey-var__galaxy-svg {
    position: relative;
    z-index: 1;
  }

  .journey-var__galaxy-label {
    font-size: 8px;
    fill: rgba(255,255,255,0.8);
    font-weight: 500;
  }

  /* Tree Rings */
  .journey-var--tree {
    background: #d4c5a9;
    padding: 1.5rem;
  }

  .journey-var__tree-year {
    font-family: 'Share Tech Mono', monospace;
    font-size: 8px;
    fill: #5c3d1e;
  }

  .journey-var__tree-dest {
    font-size: 9px;
    font-weight: 600;
    fill: #3d2814;
    text-transform: uppercase;
  }

  .journey-var__tree-center {
    font-size: 10px;
    font-weight: 700;
  }

  /* Circuit Board */
  .journey-var--circuit {
    background: #1a1a2e;
    padding: 2rem;
  }

  .journey-var__pcb {
    position: relative;
    width: 100%;
    aspect-ratio: 4/3;
    background: #0d4f3c;
    border-radius: 8px;
    overflow: hidden;
  }

  .journey-var__traces {
    position: absolute;
    inset: 0;
    pointer-events: none;
  }

  .journey-var__chip {
    position: absolute;
    transform: translate(-50%, -50%);
    background: #1a1a1a;
    padding: 0.5rem;
    border-radius: 4px;
    min-width: 60px;
    text-align: center;
  }

  .journey-var__chip--main {
    background: #fbbf24;
    min-width: 80px;
  }

  .journey-var__chip-label {
    font-size: 8px;
    font-weight: 700;
    color: #fff;
    text-transform: uppercase;
  }

  .journey-var__chip--main .journey-var__chip-label {
    color: #1a1a1a;
  }

  .journey-var__chip-pins {
    display: flex;
    justify-content: space-around;
    margin-top: 0.25rem;
  }

  .journey-var__chip-pin {
    width: 4px;
    height: 8px;
    background: #888;
  }

  .journey-var__circuit-pulse {
    position: absolute;
    top: 50%;
    left: 50%;
    width: 20px;
    height: 20px;
    background: #22c55e;
    border-radius: 50%;
    transform: translate(-50%, -50%);
    box-shadow: 0 0 20px #22c55e;
  }

  /* Luggage Tags */
  .journey-var--luggage {
    background: linear-gradient(180deg, #d4a574 0%, #c4956a 100%);
    padding: 2rem;
    position: relative;
  }

  .journey-var__luggage-rope {
    position: absolute;
    top: 60px;
    left: 10%;
    right: 10%;
    height: 4px;
    background: #5c3d1e;
    border-radius: 2px;
  }

  .journey-var__tags {
    display: flex;
    justify-content: center;
    flex-wrap: wrap;
    gap: 0.5rem;
    padding-top: 30px;
  }

  .journey-var__tag {
    background: var(--tag-color);
    padding: 1rem 0.75rem;
    border-radius: 4px 4px 4px 20px;
    position: relative;
    transform: rotate(var(--tag-rotate));
    cursor: pointer;
    box-shadow: 0 4px 10px rgba(0,0,0,0.2);
  }

  .journey-var__tag--main {
    background: #1a1a1a !important;
  }

  .journey-var__tag-hole {
    position: absolute;
    top: 8px;
    left: 8px;
    width: 10px;
    height: 10px;
    background: rgba(0,0,0,0.3);
    border-radius: 50%;
  }

  .journey-var__tag-content {
    text-align: center;
  }

  .journey-var__tag-code {
    display: block;
    font-family: 'Share Tech Mono', monospace;
    font-size: 1.5rem;
    font-weight: 700;
    color: #1a1a1a;
  }

  .journey-var__tag--main .journey-var__tag-code {
    color: #fff;
  }

  .journey-var__tag-dest {
    display: block;
    font-size: 0.6rem;
    font-weight: 600;
    text-transform: uppercase;
    margin: 0.25rem 0;
  }

  .journey-var__tag--main .journey-var__tag-dest {
    color: #fbbf24;
  }

  .journey-var__tag-barcode {
    display: flex;
    gap: 1px;
    justify-content: center;
    margin-top: 0.5rem;
  }

  .journey-var__tag-bar {
    width: 2px;
    background: rgba(0,0,0,0.7);
  }

  .journey-var__tag--main .journey-var__tag-bar {
    background: rgba(255,255,255,0.5);
  }

  /* Weather Map */
  .journey-var--weather {
    background: #e8f4f8;
    padding: 0;
    overflow: hidden;
  }

  .journey-var__weather-header {
    background: #1e3a5f;
    padding: 1rem;
    text-align: center;
  }

  .journey-var__weather-title {
    display: block;
    color: #fff;
    font-weight: 700;
    font-size: 1rem;
    text-transform: uppercase;
    letter-spacing: 0.1em;
  }

  .journey-var__weather-date {
    display: block;
    color: rgba(255,255,255,0.6);
    font-size: 0.7rem;
    margin-top: 0.25rem;
  }

  .journey-var__weather-map {
    position: relative;
    aspect-ratio: 4/3;
    background: linear-gradient(180deg, #87ceeb 0%, #98d4e8 100%);
  }

  .journey-var__isobars {
    position: absolute;
    inset: 0;
  }

  .journey-var__weather-loc {
    position: absolute;
    transform: translate(-50%, -50%);
    text-align: center;
    background: rgba(255,255,255,0.9);
    padding: 0.5rem;
    border-radius: 8px;
    box-shadow: 0 2px 8px rgba(0,0,0,0.1);
  }

  .journey-var__weather-loc--main {
    background: #1a1a1a;
  }

  .journey-var__weather-icon {
    font-size: 1.25rem;
  }

  .journey-var__weather-temp {
    display: block;
    font-family: 'Share Tech Mono', monospace;
    font-size: 0.9rem;
    font-weight: 700;
  }

  .journey-var__weather-loc--main .journey-var__weather-temp {
    color: #fbbf24;
  }

  .journey-var__weather-name {
    display: block;
    font-size: 0.6rem;
    font-weight: 600;
    text-transform: uppercase;
  }

  .journey-var__weather-loc--main .journey-var__weather-name {
    color: #fff;
  }

  /* Isometric */
  .journey-var--isometric {
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    padding: 3rem 1rem;
  }

  .journey-var__iso-grid {
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
    gap: 1rem;
    transform: rotateX(60deg) rotateZ(-45deg);
    transform-style: preserve-3d;
  }

  .journey-var__iso-block {
    position: relative;
    width: 60px;
    height: 60px;
    transform-style: preserve-3d;
  }

  .journey-var__iso-top,
  .journey-var__iso-left,
  .journey-var__iso-right {
    position: absolute;
    width: 60px;
    height: 60px;
  }

  .journey-var__iso-top {
    background: var(--block-color);
    transform: translateZ(calc(var(--block-z) * 20px));
  }

  .journey-var__iso-left {
    background: color-mix(in srgb, var(--block-color) 80%, black);
    transform: rotateX(-90deg) translateZ(30px) translateY(-30px);
    height: calc(var(--block-z) * 20px);
  }

  .journey-var__iso-right {
    background: color-mix(in srgb, var(--block-color) 60%, black);
    transform: rotateY(90deg) translateZ(30px) translateX(30px);
    width: calc(var(--block-z) * 20px);
  }

  .journey-var__iso-label {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%) translateZ(calc(var(--block-z) * 20px + 5px));
    font-size: 7px;
    font-weight: 700;
    color: #fff;
    text-transform: uppercase;
    white-space: nowrap;
  }

  /* Vintage Map */
  .journey-var--vintage {
    background: #f5f0e8;
    padding: 1rem;
  }

  .journey-var__vintage-border {
    border: 8px solid #8b7355;
    padding: 0.5rem;
    background: #f9f4ec;
  }

  .journey-var__vintage-inner {
    border: 2px solid #c4a77d;
    padding: 1rem;
    position: relative;
  }

  .journey-var__vintage-header {
    text-align: center;
    margin-bottom: 1rem;
  }

  .journey-var__vintage-title {
    display: block;
    font-family: 'Times New Roman', serif;
    font-size: 1.25rem;
    font-weight: 700;
    color: #5c3d1e;
    letter-spacing: 0.2em;
  }

  .journey-var__vintage-subtitle {
    display: block;
    font-size: 0.7rem;
    color: #8b7355;
    font-style: italic;
  }

  .journey-var__vintage-map {
    position: relative;
    aspect-ratio: 16/10;
    background:
      repeating-linear-gradient(
        0deg,
        transparent,
        transparent 20px,
        rgba(139, 115, 85, 0.1) 20px,
        rgba(139, 115, 85, 0.1) 21px
      ),
      repeating-linear-gradient(
        90deg,
        transparent,
        transparent 20px,
        rgba(139, 115, 85, 0.1) 20px,
        rgba(139, 115, 85, 0.1) 21px
      );
  }

  .journey-var__vintage-routes {
    position: absolute;
    inset: 0;
  }

  .journey-var__vintage-marker {
    position: absolute;
    transform: translate(-50%, -50%);
    text-align: center;
  }

  .journey-var__vintage-icon {
    font-size: 1rem;
  }

  .journey-var__vintage-label {
    display: block;
    font-size: 8px;
    font-family: 'Times New Roman', serif;
    font-style: italic;
    color: #5c3d1e;
    white-space: nowrap;
  }

  .journey-var__vintage-compass {
    position: absolute;
    bottom: 1rem;
    right: 1rem;
    text-align: center;
  }

  .journey-var__vintage-compass span {
    display: block;
    font-size: 0.7rem;
    font-weight: 700;
    color: #5c3d1e;
  }

  .journey-var__vintage-rose {
    width: 30px;
    height: 30px;
    background: conic-gradient(from 0deg, #5c3d1e 0deg, transparent 45deg, #5c3d1e 90deg, transparent 135deg, #5c3d1e 180deg, transparent 225deg, #5c3d1e 270deg, transparent 315deg);
    border-radius: 50%;
    margin: 0 auto;
  }

  /* Neon */
  .journey-var--neon {
    background: #0a0a0a;
    padding: 2rem;
  }

  .journey-var__neon-wall {
    background:
      repeating-linear-gradient(
        0deg,
        transparent,
        transparent 30px,
        rgba(255,255,255,0.02) 30px,
        rgba(255,255,255,0.02) 31px
      ),
      #1a1a1a;
    padding: 2rem;
    min-height: 300px;
  }

  .journey-var__neon-main {
    text-align: center;
    margin-bottom: 2rem;
  }

  .journey-var__neon-text {
    font-family: 'Share Tech Mono', monospace;
    color: var(--neon-color, #fff);
    text-shadow:
      0 0 5px var(--neon-color, #fff),
      0 0 10px var(--neon-color, #fff),
      0 0 20px var(--neon-color, #fff),
      0 0 40px var(--neon-color, #fff);
  }

  .journey-var__neon-text--main {
    display: block;
    font-size: 2rem;
    font-weight: 700;
    color: #ff6b9d;
    text-shadow:
      0 0 5px #ff6b9d,
      0 0 10px #ff6b9d,
      0 0 20px #ff6b9d,
      0 0 40px #ff6b9d;
  }

  .journey-var__neon-arrow {
    display: block;
    font-size: 1.5rem;
    color: #fbbf24;
    text-shadow:
      0 0 5px #fbbf24,
      0 0 10px #fbbf24,
      0 0 20px #fbbf24;
    margin: 0.5rem 0;
  }

  .journey-var__neon-subtitle {
    display: block;
    font-size: 1rem;
    color: #22d3ee;
    text-shadow:
      0 0 5px #22d3ee,
      0 0 10px #22d3ee,
      0 0 20px #22d3ee;
    letter-spacing: 0.3em;
  }

  .journey-var__neon-destinations {
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
    gap: 1rem;
  }

  .journey-var__neon-destinations .journey-var__neon-text {
    font-size: 0.9rem;
    font-weight: 600;
  }

  /* Vinyl */
  .journey-var--vinyl {
    background: #2a2a2a;
    padding: 2rem;
    display: flex;
    gap: 2rem;
    align-items: center;
    flex-wrap: wrap;
    justify-content: center;
  }

  .journey-var__vinyl-sleeve {
    width: 180px;
    height: 180px;
    background: #1a1a1a;
    padding: 0.5rem;
    box-shadow: 0 10px 30px rgba(0,0,0,0.5);
  }

  .journey-var__vinyl-record {
    width: 100%;
    height: 100%;
    background: radial-gradient(
      circle,
      #fbbf24 0%,
      #fbbf24 15%,
      #1a1a1a 15%,
      #1a1a1a 100%
    );
    border-radius: 50%;
    position: relative;
    box-shadow: inset 0 0 30px rgba(0,0,0,0.5);
  }

  .journey-var__vinyl-grooves {
    position: absolute;
    inset: 20%;
    border-radius: 50%;
  }

  .journey-var__vinyl-groove {
    position: absolute;
    inset: calc(var(--groove-index) * 3%);
    border: 1px solid rgba(255,255,255,0.05);
    border-radius: 50%;
  }

  .journey-var__vinyl-label {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    text-align: center;
    width: 50px;
  }

  .journey-var__vinyl-title {
    display: block;
    font-size: 6px;
    font-weight: 700;
    color: #1a1a1a;
  }

  .journey-var__vinyl-subtitle {
    display: block;
    font-size: 5px;
    color: #666;
  }

  .journey-var__vinyl-tracklist {
    flex: 1;
    min-width: 200px;
  }

  .journey-var__vinyl-side {
    font-size: 0.7rem;
    color: #888;
    margin-bottom: 0.5rem;
    padding-bottom: 0.25rem;
    border-bottom: 1px solid #444;
  }

  .journey-var__vinyl-track {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    padding: 0.25rem 0;
    color: #fff;
    font-size: 0.8rem;
  }

  .journey-var__vinyl-num {
    color: #888;
    width: 20px;
  }

  .journey-var__vinyl-name {
    flex: 1;
    font-weight: 500;
  }

  .journey-var__vinyl-time {
    color: #888;
    font-family: 'Share Tech Mono', monospace;
    font-size: 0.75rem;
  }

  /* Boarding Pass */
  .journey-var--boarding {
    background: linear-gradient(180deg, #87ceeb 0%, #e0f4ff 100%);
    padding: 2rem 1rem;
  }

  .journey-var__passes {
    display: flex;
    flex-direction: column;
    gap: 1rem;
    max-width: 400px;
    margin: 0 auto;
  }

  .journey-var__pass {
    display: flex;
    background: #fff;
    border-radius: 8px;
    overflow: hidden;
    box-shadow: 0 4px 15px rgba(0,0,0,0.1);
  }

  .journey-var__pass-main {
    flex: 1;
    padding: 0.75rem;
    border-right: 2px dashed #ddd;
  }

  .journey-var__pass-header {
    display: flex;
    justify-content: space-between;
    margin-bottom: 0.5rem;
  }

  .journey-var__pass-airline {
    font-size: 0.7rem;
    font-weight: 700;
    color: #1a1a1a;
  }

  .journey-var__pass-class {
    font-size: 0.6rem;
    color: #fbbf24;
    font-weight: 600;
  }

  .journey-var__pass-route {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 0.5rem;
  }

  .journey-var__pass-city {
    text-align: center;
  }

  .journey-var__pass-code {
    display: block;
    font-size: 1.25rem;
    font-weight: 700;
    font-family: 'Share Tech Mono', monospace;
  }

  .journey-var__pass-name {
    display: block;
    font-size: 0.6rem;
    color: #888;
  }

  .journey-var__pass-arrow {
    font-size: 1rem;
    color: #2563eb;
  }

  .journey-var__pass-details {
    display: flex;
    gap: 1rem;
  }

  .journey-var__pass-details > div {
    text-align: center;
  }

  .journey-var__pass-details span {
    display: block;
  }

  .journey-var__pass-details span:first-child {
    font-size: 0.5rem;
    color: #888;
    text-transform: uppercase;
  }

  .journey-var__pass-details span:last-child {
    font-size: 0.75rem;
    font-weight: 700;
  }

  .journey-var__pass-stub {
    width: 60px;
    background: #f5f5f5;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: 0.5rem;
  }

  .journey-var__pass-stub-code {
    font-family: 'Share Tech Mono', monospace;
    font-size: 1rem;
    font-weight: 700;
  }

  .journey-var__pass-stub-seat {
    font-size: 0.7rem;
    color: #888;
  }

  /* Speedometer */
  .journey-var--speedo {
    background: linear-gradient(180deg, #1a1a1a 0%, #2a2a2a 100%);
    padding: 2rem;
  }

  .journey-var__speedo-dial {
    position: relative;
  }

  .journey-var__speedo-label {
    font-size: 7px;
    fill: #fff;
    font-weight: 600;
    text-transform: uppercase;
  }

  .journey-var__speedo-hq {
    font-size: 10px;
    fill: #888;
    font-weight: 600;
  }

  .journey-var__speedo-display {
    text-align: center;
    margin-top: 1rem;
  }

  .journey-var__speedo-nm {
    display: block;
    font-family: 'Share Tech Mono', monospace;
    font-size: 2rem;
    color: #22c55e;
    font-weight: 700;
  }

  .journey-var__speedo-unit {
    display: block;
    font-size: 0.8rem;
    color: #888;
  }

  /* Hourglass */
  .journey-var--hourglass {
    background: linear-gradient(180deg, #fef3c7 0%, #fde68a 100%);
    padding: 2rem;
  }

  .journey-var__hourglass-frame {
    width: 200px;
    margin: 0 auto;
    position: relative;
  }

  .journey-var__hourglass-top,
  .journey-var__hourglass-bottom {
    height: 150px;
    background: rgba(255,255,255,0.8);
    border: 4px solid #8b7355;
    position: relative;
    overflow: hidden;
  }

  .journey-var__hourglass-top {
    border-radius: 100px 100px 0 0;
    clip-path: polygon(10% 0, 90% 0, 55% 100%, 45% 100%);
  }

  .journey-var__hourglass-bottom {
    border-radius: 0 0 100px 100px;
    clip-path: polygon(45% 0, 55% 0, 90% 100%, 10% 100%);
  }

  .journey-var__hourglass-neck {
    height: 30px;
    display: flex;
    align-items: center;
    justify-content: center;
    background: #8b7355;
  }

  .journey-var__hourglass-center {
    font-size: 0.6rem;
    font-weight: 700;
    color: #fff;
  }

  .journey-var__hourglass-sand {
    padding: 1rem;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 0.25rem;
  }

  .journey-var__hourglass-grain {
    font-size: 0.6rem;
    font-weight: 600;
    color: #b8956a;
    text-transform: uppercase;
  }

  /* Slot Machine */
  .journey-var--slots {
    background: linear-gradient(180deg, #7c3aed 0%, #5b21b6 100%);
    padding: 2rem;
  }

  .journey-var__slots-machine {
    width: 300px;
    margin: 0 auto;
    background: linear-gradient(180deg, #fbbf24 0%, #d97706 100%);
    border-radius: 16px;
    padding: 1rem;
    box-shadow: 0 10px 40px rgba(0,0,0,0.3);
  }

  .journey-var__slots-header {
    text-align: center;
    margin-bottom: 1rem;
  }

  .journey-var__slots-title {
    display: block;
    font-size: 1rem;
    font-weight: 700;
    color: #1a1a1a;
  }

  .journey-var__slots-subtitle {
    display: block;
    font-size: 0.7rem;
    color: #78350f;
  }

  .journey-var__slots-window {
    display: flex;
    gap: 0.5rem;
    background: #1a1a1a;
    padding: 0.5rem;
    border-radius: 8px;
  }

  .journey-var__slots-reel {
    flex: 1;
    height: 60px;
    background: #fff;
    border-radius: 4px;
    overflow: hidden;
    position: relative;
  }

  .journey-var__slots-strip {
    position: absolute;
    width: 100%;
  }

  .journey-var__slots-item {
    height: 60px;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 0.65rem;
    font-weight: 700;
    text-transform: uppercase;
  }

  .journey-var__slots-lever {
    display: block;
    width: 100%;
    padding: 0.75rem;
    margin-top: 1rem;
    background: #ef4444;
    color: #fff;
    border: none;
    border-radius: 8px;
    font-family: inherit;
    font-size: 0.9rem;
    font-weight: 700;
    cursor: pointer;
    text-transform: uppercase;
    box-shadow: 0 4px 0 #b91c1c;
  }

  .journey-var__slots-lever:active {
    transform: translateY(2px);
    box-shadow: 0 2px 0 #b91c1c;
  }

  .journey-var__slots-base {
    text-align: center;
    margin-top: 0.75rem;
    font-size: 0.7rem;
    color: #78350f;
    font-weight: 600;
  }

  /* Compass Network (v31) */
  .journey-var--compass-network {
    background: linear-gradient(135deg, #faf9f6 0%, #f5f3ef 100%);
    padding: 2rem;
    position: relative;
  }

  .journey-var__compass-network-cardinal {
    font-family: 'Share Tech Mono', monospace;
    font-size: 18px;
    font-weight: 700;
    fill: #1a1a1a;
  }

  .journey-var__compass-network-center {
    font-family: 'Share Tech Mono', monospace;
    font-size: 12px;
    font-weight: 700;
    fill: #fff;
  }

  .journey-var__compass-network-label {
    font-family: 'Space Grotesk', sans-serif;
    font-size: 10px;
    font-weight: 600;
    fill: #666;
    text-transform: uppercase;
    letter-spacing: 0.05em;
    transition: all 0.3s ease;
  }

  .journey-var__compass-network-label--active {
    font-size: 11px;
    fill: #2563eb;
    font-weight: 700;
  }

  .journey-var__compass-network-dist {
    font-family: 'Share Tech Mono', monospace;
    font-size: 9px;
    fill: #2563eb;
  }

  .journey-var__compass-network-info {
    position: absolute;
    bottom: 80px;
    left: 50%;
    transform: translateX(-50%);
    background: #1a1a1a;
    color: #fff;
    padding: 0.75rem 1.5rem;
    border-radius: 30px;
    text-align: center;
    box-shadow: 0 4px 20px rgba(0,0,0,0.15);
  }

  .journey-var__compass-network-info-dest {
    display: block;
    font-size: 1rem;
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: 0.1em;
  }

  .journey-var__compass-network-info-nm {
    display: block;
    font-size: 0.75rem;
    color: rgba(255,255,255,0.7);
    margin-top: 0.25rem;
  }

  /* ===== PICKER CONTROLS ===== */
  .journey-picker__controls {
    position: fixed;
    bottom: 20px;
    left: 20px;
    width: 420px;
    background: #fff;
    border-radius: 16px;
    box-shadow: 0 10px 40px rgba(0,0,0,0.15);
    z-index: 1000;
    transition: transform 0.3s ease;
  }

  .journey-picker__controls--minimized {
    transform: translateY(calc(100% - 48px));
  }

  .journey-picker__minimized-bar {
    display: none;
    height: 48px;
    background: #1a1a1a;
    border-radius: 16px 16px 0 0;
    padding: 0 16px;
    align-items: center;
    color: #fff;
    cursor: pointer;
    gap: 12px;
  }

  .journey-picker__controls--minimized .journey-picker__minimized-bar {
    display: flex;
  }

  .journey-picker__minimized-name {
    font-weight: 600;
    font-size: 13px;
  }

  .journey-picker__minimized-counter {
    font-size: 11px;
    opacity: 0.6;
  }

  .journey-picker__minimized-nav {
    margin-left: auto;
    display: flex;
    gap: 6px;
  }

  .journey-picker__minimized-nav button {
    width: 28px;
    height: 28px;
    border: none;
    background: rgba(255,255,255,0.1);
    color: #fff;
    border-radius: 6px;
    cursor: pointer;
    font-size: 14px;
  }

  .journey-picker__minimized-nav button:hover {
    background: rgba(255,255,255,0.2);
  }

  .journey-picker__main {
    padding: 16px;
  }

  .journey-picker__controls--minimized .journey-picker__main {
    visibility: hidden;
    height: 0;
    padding: 0;
    overflow: hidden;
  }

  .journey-picker__header-row {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 12px;
  }

  .journey-picker__header-row h3 {
    font-size: 14px;
    font-weight: 700;
    margin: 0;
  }

  .journey-picker__minimize-btn {
    width: 28px;
    height: 28px;
    border: 1px solid #e5e5e5;
    background: #fff;
    border-radius: 6px;
    cursor: pointer;
    font-size: 16px;
  }

  .journey-picker__minimize-btn:hover {
    background: #f5f5f5;
  }

  .journey-picker__nav {
    display: flex;
    align-items: center;
    gap: 12px;
    position: relative;
    padding: 12px 0;
  }

  .journey-picker__nav-btn {
    width: 40px;
    height: 40px;
    border: 1px solid #e5e5e5;
    background: #fff;
    border-radius: 8px;
    cursor: pointer;
    font-size: 18px;
    transition: all 0.15s;
    flex-shrink: 0;
  }

  .journey-picker__nav-btn:hover {
    background: #1a1a1a;
    color: #fff;
    border-color: #1a1a1a;
  }

  .journey-picker__info {
    flex: 1;
    text-align: center;
    min-width: 0;
  }

  .journey-picker__category {
    display: block;
    font-size: 10px;
    font-weight: 600;
    text-transform: uppercase;
    letter-spacing: 0.1em;
    color: #2563eb;
    margin-bottom: 2px;
  }

  .journey-picker__counter {
    font-size: 10px;
    color: #999;
  }

  .journey-picker__name {
    font-size: 15px;
    font-weight: 700;
    margin: 4px 0;
  }

  .journey-picker__desc {
    font-size: 11px;
    color: #666;
    margin: 0;
  }

  .journey-picker__fav-btn {
    position: absolute;
    right: 0;
    width: 40px;
    height: 40px;
    border: 2px solid #e5e5e5;
    background: #fff;
    border-radius: 50%;
    cursor: pointer;
    font-size: 20px;
    transition: all 0.15s;
  }

  .journey-picker__fav-btn:hover {
    border-color: #f59e0b;
    color: #f59e0b;
  }

  .journey-picker__fav-btn.active {
    background: #f59e0b;
    border-color: #f59e0b;
    color: #fff;
  }

  .journey-picker__thumbs {
    display: flex;
    flex-wrap: wrap;
    gap: 6px;
    padding: 12px 0;
    border-top: 1px solid #e5e5e5;
    border-bottom: 1px solid #e5e5e5;
  }

  .journey-picker__thumb {
    width: 32px;
    height: 32px;
    border: 1px solid #e5e5e5;
    background: #fff;
    border-radius: 6px;
    cursor: pointer;
    font-size: 12px;
    font-weight: 600;
    transition: all 0.15s;
  }

  .journey-picker__thumb:hover {
    border-color: #1a1a1a;
  }

  .journey-picker__thumb.active {
    background: #1a1a1a;
    color: #fff;
    border-color: #1a1a1a;
  }

  .journey-picker__thumb.favorited {
    border-color: #f59e0b;
  }

  .journey-picker__thumb.favorited.active {
    background: #f59e0b;
  }

  .journey-picker__footer {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding-top: 12px;
  }

  .journey-picker__hints {
    display: flex;
    gap: 12px;
    font-size: 10px;
    color: #999;
  }

  .journey-picker__hints kbd {
    background: #f5f5f5;
    border: 1px solid #ddd;
    border-radius: 3px;
    padding: 1px 4px;
    font-family: inherit;
    font-size: 9px;
  }

  .journey-picker__fav-count {
    font-size: 11px;
    color: #f59e0b;
    font-weight: 600;
  }

  /* Responsive */
  @media (max-width: 768px) {
    .journey-picker__controls {
      left: 10px;
      right: 10px;
      width: auto;
    }

    .journey-var {
      padding: 1rem;
    }

    .journey-picker__preview {
      padding: 80px 1rem 180px;
    }
  }
`;

export default JourneyPicker;

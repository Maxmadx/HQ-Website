/**
 * Wireframes
 *
 * Showcase of 40 procedural SVG wireframe illustrations for use as
 * background decorative elements across the HQ Aviation website.
 * Each wireframe is aviation / adventure / exploration themed and
 * rendered in the same style as .fd-exped__globe (low-opacity,
 * currentColor strokes, viewBox 0 0 600 600).
 *
 * Navigate with the fixed picker at the bottom or arrow keys.
 */

import React, { useState, useEffect, useCallback } from 'react';

/* ------------------------------------------------------------------ */
/*  Wireframe metadata                                                 */
/* ------------------------------------------------------------------ */
const wireframeMeta = [
  { name: 'Classic Globe', desc: 'Latitude/longitude sphere with clipped meridians' },
  { name: 'Compass Rose', desc: 'Aviation navigation rose with 360 tick marks' },
  { name: 'Radar Sweep', desc: 'ATC radar display with bearing marks and blips' },
  { name: 'Altimeter Dial', desc: 'Circular altitude gauge with needle and markings' },
  { name: 'Attitude Indicator', desc: 'Artificial horizon with pitch ladder and bank arc' },
  { name: 'Helicopter Blueprint', desc: 'Side-profile wireframe of a helicopter on a grid' },
  { name: 'Rotor Disc', desc: 'Top-down rotor geometry with blade pitch lines' },
  { name: 'Topographic Contours', desc: 'Organic mountain terrain contour lines' },
  { name: 'Wireframe Mountains', desc: '3D perspective mesh terrain with peaks' },
  { name: 'Great Circle Routes', desc: 'Flight path arcs connecting expedition waypoints' },
  { name: 'Polar Projection', desc: 'North Pole azimuthal map with radiating longitudes' },
  { name: 'VOR Navigation Rose', desc: 'Radial degree pattern from a VOR ground station' },
  { name: 'HUD Overlay', desc: 'Heads-up display with flight path vector and tapes' },
  { name: 'Airspeed Indicator', desc: 'Round dial with speed arcs, ticks, and needle' },
  { name: 'Star Chart', desc: 'Celestial navigation with constellations and grid' },
  { name: 'Wind Rose', desc: 'Asymmetric radial chart of wind direction frequency' },
  { name: 'Runway Approach', desc: 'Perspective approach lighting receding to vanishing point' },
  { name: 'Fibonacci Spiral', desc: 'Golden-ratio spiral with construction rectangles' },
  { name: 'Dot Matrix Globe', desc: '3D pointillist sphere with depth-based sizing' },
  { name: 'Expedition Route', desc: 'Flowing dashed path with numbered waypoint markers' },
  { name: 'Gyroscope', desc: 'Nested gimbal rings with spinning axis' },
  { name: 'Tail Rotor Cross-Section', desc: 'Engineering cross-section of fenestron assembly' },
  { name: 'Barometric Pressure', desc: 'Isobar weather chart with high/low centers' },
  { name: 'Sextant Sight', desc: 'Celestial navigation sextant reticle view' },
  { name: 'Fuel Gauge', desc: 'Quarter-arc gauge with reserve warning zone' },
  { name: 'Propeller Geometry', desc: 'Blade pitch angles with airfoil cross-sections' },
  { name: 'Aeronautical Chart', desc: 'Sectional chart with airspace rings and airways' },
  { name: 'Horizon Scanner', desc: 'Panoramic terrain silhouette with altitude band' },
  { name: 'GPS Satellite Constellation', desc: 'Orbital paths with satellite positions' },
  { name: 'Ice Crystal', desc: 'Hexagonal snowflake geometry for polar expeditions' },
  { name: 'Engine Gauges Cluster', desc: 'Triple-gauge cluster — RPM, CHT, oil pressure' },
  { name: 'Pendulum Compass', desc: 'Magnetic compass bowl with lubber line and card' },
  { name: 'Turbine Blade Fan', desc: 'Radial turbine stage with blade cascade geometry' },
  { name: 'Aurora Borealis', desc: 'Curtain of light rays with magnetic field lines' },
  { name: 'Mercator Grid', desc: 'Rectangular map projection with rhumb line tracks' },
  { name: 'Sonar Depth Ring', desc: 'Bathymetric depth rings for ocean expedition crossings' },
  { name: 'Parachute Canopy', desc: 'Radial gore panels with suspension line geometry' },
  { name: 'Flight Envelope', desc: 'V-n diagram showing load factor vs airspeed' },
  { name: 'Sundial', desc: 'Gnomon shadow projection with hour angle lines' },
  { name: 'Pilot Logbook', desc: 'Ruled logbook page with columns and flight entries' },
];

/* ------------------------------------------------------------------ */
/*  Individual wireframe SVGs                                          */
/* ------------------------------------------------------------------ */

function W01_ClassicGlobe() {
  return (
    <svg viewBox="0 0 600 600" fill="none" xmlns="http://www.w3.org/2000/svg">
      <defs><clipPath id="wf-gc1"><circle cx="300" cy="300" r="279" /></clipPath></defs>
      <circle cx="300" cy="300" r="280" stroke="currentColor" strokeWidth="1.2" opacity="0.2" />
      <g clipPath="url(#wf-gc1)">
        {[30, 60, 90, 120, 150].map(d => (
          <ellipse key={d} cx="300" cy="300" rx={Math.round(280 * Math.sin(d * Math.PI / 180))} ry="280" stroke="currentColor" strokeWidth={d === 90 ? '0.6' : '0.4'} opacity={d === 90 ? 0.14 : 0.09} />
        ))}
        <line x1="20" y1="300" x2="580" y2="300" stroke="currentColor" strokeWidth="0.7" opacity="0.15" />
        {[20, 40, 60].map(lat => {
          const o = Math.round(280 * Math.sin(lat * Math.PI / 180));
          const hw = Math.round(280 * Math.cos(lat * Math.PI / 180));
          return [
            <line key={`n${lat}`} x1={300 - hw} y1={300 - o} x2={300 + hw} y2={300 - o} stroke="currentColor" strokeWidth="0.4" opacity="0.09" />,
            <line key={`s${lat}`} x1={300 - hw} y1={300 + o} x2={300 + hw} y2={300 + o} stroke="currentColor" strokeWidth="0.4" opacity="0.09" />
          ];
        })}
      </g>
    </svg>
  );
}

function W02_CompassRose() {
  return (
    <svg viewBox="0 0 600 600" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="300" cy="300" r="280" stroke="currentColor" strokeWidth="1" opacity="0.18" />
      <circle cx="300" cy="300" r="275" stroke="currentColor" strokeWidth="0.3" opacity="0.08" />
      <line x1="300" y1="20" x2="300" y2="580" stroke="currentColor" strokeWidth="0.6" opacity="0.14" />
      <line x1="20" y1="300" x2="580" y2="300" stroke="currentColor" strokeWidth="0.6" opacity="0.14" />
      {[45, 135, 225, 315].map(deg => {
        const a = deg * Math.PI / 180;
        return <line key={deg} x1={300 + 280 * Math.cos(a)} y1={300 + 280 * Math.sin(a)} x2={300 - 280 * Math.cos(a)} y2={300 - 280 * Math.sin(a)} stroke="currentColor" strokeWidth="0.35" opacity="0.08" />;
      })}
      {Array.from({ length: 36 }, (_, i) => {
        const a = i * 10 * Math.PI / 180;
        const inner = i % 9 === 0 ? 255 : i % 3 === 0 ? 265 : 272;
        return <line key={i} x1={300 + inner * Math.cos(a)} y1={300 + inner * Math.sin(a)} x2={300 + 280 * Math.cos(a)} y2={300 + 280 * Math.sin(a)} stroke="currentColor" strokeWidth={i % 9 === 0 ? '0.6' : '0.3'} opacity={i % 9 === 0 ? '0.15' : '0.08'} />;
      })}
      {/* Cardinal labels */}
      {[
        { label: 'N', angle: -90 }, { label: 'E', angle: 0 },
        { label: 'S', angle: 90 }, { label: 'W', angle: 180 }
      ].map(({ label, angle }) => {
        const a = angle * Math.PI / 180;
        return <text key={label} x={300 + 245 * Math.cos(a)} y={300 + 245 * Math.sin(a)} textAnchor="middle" dominantBaseline="central" fill="currentColor" opacity="0.12" fontSize="14" fontFamily="'Share Tech Mono', monospace">{label}</text>;
      })}
      <circle cx="300" cy="300" r="120" stroke="currentColor" strokeWidth="0.3" opacity="0.07" />
      <circle cx="300" cy="300" r="12" stroke="currentColor" strokeWidth="0.5" opacity="0.15" />
      <circle cx="300" cy="300" r="2.5" fill="currentColor" opacity="0.18" />
    </svg>
  );
}

function W03_RadarSweep() {
  return (
    <svg viewBox="0 0 600 600" fill="none" xmlns="http://www.w3.org/2000/svg">
      {/* Concentric range rings */}
      {[70, 140, 210, 280].map(r => (
        <circle key={r} cx="300" cy="300" r={r} stroke="currentColor" strokeWidth="0.5" opacity="0.1" />
      ))}
      {/* Bearing lines every 30 degrees */}
      {Array.from({ length: 12 }, (_, i) => {
        const a = i * 30 * Math.PI / 180;
        return <line key={i} x1="300" y1="300" x2={300 + 280 * Math.cos(a)} y2={300 + 280 * Math.sin(a)} stroke="currentColor" strokeWidth="0.3" opacity="0.07" />;
      })}
      {/* Sweep line */}
      <line x1="300" y1="300" x2={300 + 280 * Math.cos(-60 * Math.PI / 180)} y2={300 + 280 * Math.sin(-60 * Math.PI / 180)} stroke="currentColor" strokeWidth="1.2" opacity="0.2" />
      {/* Sweep gradient trail */}
      <defs>
        <linearGradient id="wf-sweep" x1="0" y1="0" x2="1" y2="0" gradientTransform="rotate(-60 0.5 0.5)">
          <stop offset="0%" stopColor="currentColor" stopOpacity="0" />
          <stop offset="100%" stopColor="currentColor" stopOpacity="0.06" />
        </linearGradient>
      </defs>
      <path d={`M300,300 L${300 + 280 * Math.cos(-60 * Math.PI / 180)},${300 + 280 * Math.sin(-60 * Math.PI / 180)} A280,280 0 0,0 ${300 + 280 * Math.cos(-100 * Math.PI / 180)},${300 + 280 * Math.sin(-100 * Math.PI / 180)} Z`} fill="url(#wf-sweep)" />
      {/* Blips */}
      {[[170, -35], [85, 50], [220, -70], [130, 20], [260, 80]].map(([dist, deg], i) => {
        const a = deg * Math.PI / 180;
        return <circle key={i} cx={300 + dist * Math.cos(a)} cy={300 + dist * Math.sin(a)} r="2.5" fill="currentColor" opacity={0.12 + i * 0.02} />;
      })}
      {/* Center point */}
      <circle cx="300" cy="300" r="3" fill="currentColor" opacity="0.18" />
      {/* Outer ring */}
      <circle cx="300" cy="300" r="280" stroke="currentColor" strokeWidth="1" opacity="0.18" />
    </svg>
  );
}

function W04_AltimeterDial() {
  return (
    <svg viewBox="0 0 600 600" fill="none" xmlns="http://www.w3.org/2000/svg">
      {/* Bezel */}
      <circle cx="300" cy="300" r="280" stroke="currentColor" strokeWidth="1.5" opacity="0.18" />
      <circle cx="300" cy="300" r="270" stroke="currentColor" strokeWidth="0.4" opacity="0.08" />
      {/* Altitude tick marks - 0 to 10 (000 ft) around the full 360 */}
      {Array.from({ length: 50 }, (_, i) => {
        const a = (i * 7.2 - 90) * Math.PI / 180;
        const isMajor = i % 5 === 0;
        const inner = isMajor ? 230 : 248;
        return <line key={i} x1={300 + inner * Math.cos(a)} y1={300 + inner * Math.sin(a)} x2={300 + 265 * Math.cos(a)} y2={300 + 265 * Math.sin(a)} stroke="currentColor" strokeWidth={isMajor ? '0.8' : '0.3'} opacity={isMajor ? '0.16' : '0.08'} />;
      })}
      {/* Numbers */}
      {Array.from({ length: 10 }, (_, i) => {
        const a = (i * 36 - 90) * Math.PI / 180;
        return <text key={i} x={300 + 210 * Math.cos(a)} y={300 + 210 * Math.sin(a)} textAnchor="middle" dominantBaseline="central" fill="currentColor" opacity="0.14" fontSize="18" fontFamily="'Share Tech Mono', monospace">{i}</text>;
      })}
      {/* Needle pointing to ~3,500 ft */}
      {(() => {
        const needleAngle = (3.5 * 36 - 90) * Math.PI / 180;
        return <line x1="300" y1="300" x2={300 + 200 * Math.cos(needleAngle)} y2={300 + 200 * Math.sin(needleAngle)} stroke="currentColor" strokeWidth="1.2" opacity="0.2" />;
      })()}
      {/* Center hub */}
      <circle cx="300" cy="300" r="8" stroke="currentColor" strokeWidth="0.8" opacity="0.15" />
      <circle cx="300" cy="300" r="2" fill="currentColor" opacity="0.18" />
      {/* Kollsman window */}
      <rect x="330" y="285" width="50" height="30" rx="3" stroke="currentColor" strokeWidth="0.5" opacity="0.1" />
      <text x="355" y="304" textAnchor="middle" dominantBaseline="central" fill="currentColor" opacity="0.1" fontSize="10" fontFamily="'Share Tech Mono', monospace">29.92</text>
    </svg>
  );
}

function W05_AttitudeIndicator() {
  return (
    <svg viewBox="0 0 600 600" fill="none" xmlns="http://www.w3.org/2000/svg">
      <defs><clipPath id="wf-ai"><circle cx="300" cy="300" r="270" /></clipPath></defs>
      {/* Bezel */}
      <circle cx="300" cy="300" r="280" stroke="currentColor" strokeWidth="1.2" opacity="0.18" />
      <g clipPath="url(#wf-ai)">
        {/* Horizon line */}
        <line x1="30" y1="300" x2="570" y2="300" stroke="currentColor" strokeWidth="1" opacity="0.18" />
        {/* Pitch ladder */}
        {[-30, -20, -10, 10, 20, 30].map(pitch => {
          const y = 300 - pitch * 4;
          const halfW = Math.abs(pitch) === 10 ? 40 : Math.abs(pitch) === 20 ? 55 : 70;
          return <line key={pitch} x1={300 - halfW} y1={y} x2={300 + halfW} y2={y} stroke="currentColor" strokeWidth="0.5" opacity="0.1" />;
        })}
        {/* Small pitch ticks at 5-degree increments */}
        {[-25, -15, -5, 5, 15, 25].map(pitch => {
          const y = 300 - pitch * 4;
          return <line key={pitch} x1={300 - 20} y1={y} x2={300 + 20} y2={y} stroke="currentColor" strokeWidth="0.3" opacity="0.07" />;
        })}
      </g>
      {/* Bank angle arc */}
      <path d={`M ${300 - 270 * Math.cos(30 * Math.PI / 180)},${300 - 270 * Math.sin(30 * Math.PI / 180)} A270,270 0 0,1 ${300 + 270 * Math.cos(30 * Math.PI / 180)},${300 - 270 * Math.sin(30 * Math.PI / 180)}`} stroke="currentColor" strokeWidth="0.5" opacity="0.1" fill="none" />
      {/* Bank angle ticks */}
      {[0, 10, 20, 30, 45, 60, -10, -20, -30, -45, -60].map(deg => {
        const a = (deg - 90) * Math.PI / 180;
        const inner = Math.abs(deg) % 30 === 0 ? 255 : 262;
        return <line key={deg} x1={300 + inner * Math.cos(a)} y1={300 + inner * Math.sin(a)} x2={300 + 270 * Math.cos(a)} y2={300 + 270 * Math.sin(a)} stroke="currentColor" strokeWidth="0.5" opacity="0.1" />;
      })}
      {/* Aircraft symbol */}
      <line x1="230" y1="300" x2="275" y2="300" stroke="currentColor" strokeWidth="1" opacity="0.2" />
      <line x1="325" y1="300" x2="370" y2="300" stroke="currentColor" strokeWidth="1" opacity="0.2" />
      <circle cx="300" cy="300" r="4" stroke="currentColor" strokeWidth="0.8" opacity="0.18" fill="none" />
      {/* Top triangle pointer */}
      <path d="M300,33 L293,46 L307,46 Z" stroke="currentColor" strokeWidth="0.5" opacity="0.15" fill="none" />
    </svg>
  );
}

function W06_HelicopterBlueprint() {
  return (
    <svg viewBox="0 0 600 600" fill="none" xmlns="http://www.w3.org/2000/svg">
      {/* Background grid */}
      {Array.from({ length: 13 }, (_, i) => (
        <line key={`h${i}`} x1="40" y1={40 + i * 40} x2="560" y2={40 + i * 40} stroke="currentColor" strokeWidth="0.2" opacity="0.04" />
      ))}
      {Array.from({ length: 13 }, (_, i) => (
        <line key={`v${i}`} x1={40 + i * 40} y1="40" x2={40 + i * 40} y2="560" stroke="currentColor" strokeWidth="0.2" opacity="0.04" />
      ))}
      {/* Helicopter silhouette - side view */}
      {/* Main rotor mast */}
      <line x1="260" y1="240" x2="260" y2="280" stroke="currentColor" strokeWidth="0.6" opacity="0.15" />
      {/* Main rotor disc */}
      <line x1="80" y1="240" x2="440" y2="240" stroke="currentColor" strokeWidth="0.8" opacity="0.18" />
      <ellipse cx="260" cy="240" rx="180" ry="8" stroke="currentColor" strokeWidth="0.3" opacity="0.06" />
      {/* Rotor hub */}
      <circle cx="260" cy="240" r="5" stroke="currentColor" strokeWidth="0.5" opacity="0.14" />
      {/* Fuselage */}
      <path d="M160,290 Q140,280 130,300 Q120,330 140,350 L190,360 Q210,365 280,365 L340,360 Q360,355 370,340 Q380,320 360,300 Q340,280 300,280 L200,280 Q170,280 160,290 Z" stroke="currentColor" strokeWidth="0.7" opacity="0.15" fill="none" />
      {/* Windscreen */}
      <path d="M160,295 Q170,285 200,282 L240,280" stroke="currentColor" strokeWidth="0.4" opacity="0.1" fill="none" />
      {/* Tail boom */}
      <path d="M370,330 L480,310 L510,300 L520,290" stroke="currentColor" strokeWidth="0.6" opacity="0.14" fill="none" />
      {/* Tail rotor */}
      <line x1="520" y1="270" x2="520" y2="310" stroke="currentColor" strokeWidth="0.5" opacity="0.12" />
      <circle cx="520" cy="290" r="20" stroke="currentColor" strokeWidth="0.4" opacity="0.08" />
      {/* Tail fin */}
      <path d="M510,290 L505,260 L520,270" stroke="currentColor" strokeWidth="0.4" opacity="0.1" fill="none" />
      {/* Skids */}
      <line x1="170" y1="370" x2="170" y2="390" stroke="currentColor" strokeWidth="0.5" opacity="0.12" />
      <line x1="320" y1="370" x2="320" y2="390" stroke="currentColor" strokeWidth="0.5" opacity="0.12" />
      <line x1="140" y1="390" x2="350" y2="390" stroke="currentColor" strokeWidth="0.6" opacity="0.14" />
      <line x1="140" y1="395" x2="350" y2="395" stroke="currentColor" strokeWidth="0.3" opacity="0.07" />
      {/* Engine exhaust */}
      <path d="M300,280 Q310,270 315,275" stroke="currentColor" strokeWidth="0.3" opacity="0.08" fill="none" />
      {/* Dimension lines */}
      <line x1="80" y1="420" x2="440" y2="420" stroke="currentColor" strokeWidth="0.3" opacity="0.06" strokeDasharray="4 4" />
      <text x="260" y="435" textAnchor="middle" fill="currentColor" opacity="0.06" fontSize="9" fontFamily="'Share Tech Mono', monospace">12.7m</text>
    </svg>
  );
}

function W07_RotorDisc() {
  return (
    <svg viewBox="0 0 600 600" fill="none" xmlns="http://www.w3.org/2000/svg">
      {/* Tip-path circle */}
      <circle cx="300" cy="300" r="270" stroke="currentColor" strokeWidth="1" opacity="0.18" />
      <circle cx="300" cy="300" r="265" stroke="currentColor" strokeWidth="0.3" opacity="0.06" />
      {/* Inner reference circles */}
      <circle cx="300" cy="300" r="180" stroke="currentColor" strokeWidth="0.3" opacity="0.06" strokeDasharray="6 4" />
      <circle cx="300" cy="300" r="90" stroke="currentColor" strokeWidth="0.3" opacity="0.06" strokeDasharray="4 3" />
      {/* Hub */}
      <circle cx="300" cy="300" r="25" stroke="currentColor" strokeWidth="0.8" opacity="0.14" />
      <circle cx="300" cy="300" r="5" fill="currentColor" opacity="0.15" />
      {/* Two blades (main rotor) */}
      {[0, 180].map(deg => {
        const a = deg * Math.PI / 180;
        const tipX = 300 + 265 * Math.cos(a);
        const tipY = 300 + 265 * Math.sin(a);
        return (
          <g key={deg}>
            <line x1="300" y1="300" x2={tipX} y2={tipY} stroke="currentColor" strokeWidth="0.8" opacity="0.16" />
            {/* Chord width indicators along blade */}
            {[80, 140, 200, 250].map(r => {
              const px = 300 + r * Math.cos(a);
              const py = 300 + r * Math.sin(a);
              const perpA = a + Math.PI / 2;
              const hw = 6 + (r / 265) * 8;
              return <line key={r} x1={px - hw * Math.cos(perpA)} y1={py - hw * Math.sin(perpA)} x2={px + hw * Math.cos(perpA)} y2={py + hw * Math.sin(perpA)} stroke="currentColor" strokeWidth="0.3" opacity="0.08" />;
            })}
          </g>
        );
      })}
      {/* Second blade pair at 90 degrees */}
      {[90, 270].map(deg => {
        const a = deg * Math.PI / 180;
        return <line key={deg} x1="300" y1="300" x2={300 + 265 * Math.cos(a)} y2={300 + 265 * Math.sin(a)} stroke="currentColor" strokeWidth="0.8" opacity="0.16" />;
      })}
      {/* Pitch angle arcs */}
      {[0, 90, 180, 270].map(deg => {
        const a = deg * Math.PI / 180;
        const cx = 300 + 60 * Math.cos(a);
        const cy = 300 + 60 * Math.sin(a);
        return <path key={deg} d={`M${cx + 15 * Math.cos(a - 0.4)},${cy + 15 * Math.sin(a - 0.4)} A15,15 0 0,1 ${cx + 15 * Math.cos(a + 0.4)},${cy + 15 * Math.sin(a + 0.4)}`} stroke="currentColor" strokeWidth="0.3" opacity="0.08" fill="none" />;
      })}
      {/* Azimuth degree marks */}
      {Array.from({ length: 36 }, (_, i) => {
        const a = i * 10 * Math.PI / 180;
        return <line key={i} x1={300 + 270 * Math.cos(a)} y1={300 + 270 * Math.sin(a)} x2={300 + 278 * Math.cos(a)} y2={300 + 278 * Math.sin(a)} stroke="currentColor" strokeWidth="0.3" opacity="0.06" />;
      })}
    </svg>
  );
}

function W08_TopographicContours() {
  return (
    <svg viewBox="0 0 600 600" fill="none" xmlns="http://www.w3.org/2000/svg">
      {/* Organic contour lines suggesting mountain terrain */}
      <path d="M300,180 Q340,185 370,200 Q410,220 420,260 Q425,290 400,320 Q370,355 330,350 Q290,345 270,310 Q255,280 265,250 Q280,210 300,180 Z" stroke="currentColor" strokeWidth="0.8" opacity="0.16" fill="none" />
      <path d="M300,150 Q360,155 400,180 Q450,215 465,270 Q475,320 440,360 Q400,400 350,395 Q290,390 250,350 Q220,310 225,260 Q235,200 280,165 Q290,155 300,150 Z" stroke="currentColor" strokeWidth="0.6" opacity="0.12" fill="none" />
      <path d="M300,120 Q380,125 430,160 Q490,210 505,280 Q515,350 470,400 Q420,445 350,440 Q270,435 220,385 Q180,340 180,270 Q185,195 240,145 Q270,125 300,120 Z" stroke="currentColor" strokeWidth="0.5" opacity="0.1" fill="none" />
      <path d="M300,90 Q400,95 460,145 Q530,205 545,290 Q555,375 500,435 Q440,490 350,485 Q250,480 190,420 Q140,360 140,275 Q145,185 210,125 Q255,95 300,90 Z" stroke="currentColor" strokeWidth="0.4" opacity="0.08" fill="none" />
      <path d="M300,60 Q420,65 490,125 Q570,200 585,300 Q595,400 530,470 Q460,535 350,530 Q230,525 160,455 Q100,385 100,280 Q105,170 185,105 Q240,65 300,60 Z" stroke="currentColor" strokeWidth="0.35" opacity="0.06" fill="none" />
      {/* Second peak */}
      <path d="M180,240 Q200,225 220,230 Q245,240 240,265 Q235,285 215,290 Q195,290 185,270 Q175,255 180,240 Z" stroke="currentColor" strokeWidth="0.5" opacity="0.1" fill="none" />
      <path d="M170,220 Q200,200 235,210 Q265,225 260,260 Q255,300 225,310 Q190,315 170,290 Q155,265 170,220 Z" stroke="currentColor" strokeWidth="0.4" opacity="0.08" fill="none" />
      {/* Summit markers */}
      <line x1="295" y1="190" x2="305" y2="190" stroke="currentColor" strokeWidth="0.4" opacity="0.12" />
      <line x1="300" y1="185" x2="300" y2="195" stroke="currentColor" strokeWidth="0.4" opacity="0.12" />
      <line x1="210" y1="250" x2="216" y2="250" stroke="currentColor" strokeWidth="0.3" opacity="0.1" />
      <line x1="213" y1="247" x2="213" y2="253" stroke="currentColor" strokeWidth="0.3" opacity="0.1" />
    </svg>
  );
}

function W09_WireframeMountains() {
  return (
    <svg viewBox="0 0 600 600" fill="none" xmlns="http://www.w3.org/2000/svg">
      {/* 3D perspective mesh terrain */}
      {(() => {
        const lines = [];
        const rows = 16;
        const cols = 20;
        const heights = [
          [0,0,0,0,0,0,0,0,1,1,2,2,1,1,0,0,0,0,0,0],
          [0,0,0,0,0,0,1,2,3,4,5,4,3,2,1,0,0,0,0,0],
          [0,0,0,0,0,1,2,4,6,8,9,8,6,4,2,1,0,0,0,0],
          [0,0,0,0,1,2,4,7,10,13,14,13,10,7,4,2,1,0,0,0],
          [0,0,0,1,2,4,7,11,16,20,22,20,16,11,7,4,2,1,0,0],
          [0,0,1,2,4,6,10,15,22,28,30,28,22,15,10,6,4,2,1,0],
          [0,0,1,3,5,8,13,19,28,36,40,36,28,19,13,8,5,3,1,0],
          [0,1,2,4,7,11,16,24,34,44,48,44,34,24,16,11,7,4,2,0],
          [0,1,2,5,8,13,19,28,40,52,56,52,40,28,19,13,8,5,2,0],
          [0,1,3,5,9,14,21,30,42,54,58,54,42,30,21,14,9,5,3,0],
          [0,1,3,5,8,13,19,26,36,46,50,46,36,26,19,13,8,5,3,0],
          [0,0,2,4,6,10,14,20,28,36,38,36,28,20,14,10,6,4,2,0],
          [0,0,1,3,5,7,10,14,20,25,27,25,20,14,10,7,5,3,1,0],
          [0,0,1,2,3,5,7,10,13,16,17,16,13,10,7,5,3,2,1,0],
          [0,0,0,1,2,3,4,6,8,10,10,10,8,6,4,3,2,1,0,0],
          [0,0,0,0,1,1,2,3,4,5,5,5,4,3,2,1,1,0,0,0],
        ];

        for (let r = 0; r < rows; r++) {
          const points = [];
          const baseY = 200 + r * 20;
          const perspective = 0.6 + r * 0.03;
          for (let c = 0; c < cols; c++) {
            const x = 60 + c * ((480 * perspective) / cols) + (1 - perspective) * 240;
            const y = baseY - (heights[r]?.[c] || 0) * 1.8;
            points.push(`${Math.round(x)},${Math.round(y)}`);
          }
          lines.push(
            <polyline key={`r${r}`} points={points.join(' ')} stroke="currentColor" strokeWidth="0.4" opacity={0.04 + r * 0.008} fill="none" />
          );
        }
        return lines;
      })()}
    </svg>
  );
}

function W10_GreatCircleRoutes() {
  return (
    <svg viewBox="0 0 600 600" fill="none" xmlns="http://www.w3.org/2000/svg">
      {/* Simplified world outline */}
      <ellipse cx="300" cy="300" rx="270" ry="160" stroke="currentColor" strokeWidth="0.5" opacity="0.08" />
      {/* Latitude lines */}
      {[-60, -30, 0, 30, 60].map(lat => (
        <line key={lat} x1="30" y1={300 - lat * 2.4} x2="570" y2={300 - lat * 2.4} stroke="currentColor" strokeWidth="0.2" opacity="0.05" />
      ))}
      {/* Simplified continent hints */}
      {/* Europe / UK - home base */}
      <path d="M290,240 Q295,235 305,238 L310,245 Q308,255 300,258 Q292,255 290,248 Z" stroke="currentColor" strokeWidth="0.5" opacity="0.12" fill="none" />
      {/* Flight route arcs from Denham (UK) */}
      {/* To Arctic */}
      <path d="M300,245 Q290,180 280,140" stroke="currentColor" strokeWidth="0.6" opacity="0.14" fill="none" strokeDasharray="6 3" />
      <circle cx="280" cy="140" r="4" stroke="currentColor" strokeWidth="0.5" opacity="0.14" fill="none" />
      {/* To Iceland */}
      <path d="M300,245 Q260,200 240,180" stroke="currentColor" strokeWidth="0.6" opacity="0.14" fill="none" strokeDasharray="6 3" />
      <circle cx="240" cy="180" r="4" stroke="currentColor" strokeWidth="0.5" opacity="0.14" fill="none" />
      {/* To Morocco */}
      <path d="M300,245 Q290,300 260,350" stroke="currentColor" strokeWidth="0.6" opacity="0.14" fill="none" strokeDasharray="6 3" />
      <circle cx="260" cy="350" r="4" stroke="currentColor" strokeWidth="0.5" opacity="0.14" fill="none" />
      {/* To Alps */}
      <path d="M300,245 Q310,260 320,265" stroke="currentColor" strokeWidth="0.6" opacity="0.14" fill="none" strokeDasharray="6 3" />
      <circle cx="320" cy="265" r="4" stroke="currentColor" strokeWidth="0.5" opacity="0.14" fill="none" />
      {/* To Norway */}
      <path d="M300,245 Q310,210 320,185" stroke="currentColor" strokeWidth="0.6" opacity="0.14" fill="none" strokeDasharray="6 3" />
      <circle cx="320" cy="185" r="4" stroke="currentColor" strokeWidth="0.5" opacity="0.14" fill="none" />
      {/* To Greenland */}
      <path d="M300,245 Q240,170 180,145" stroke="currentColor" strokeWidth="0.6" opacity="0.14" fill="none" strokeDasharray="6 3" />
      <circle cx="180" cy="145" r="4" stroke="currentColor" strokeWidth="0.5" opacity="0.14" fill="none" />
      {/* To Bahamas */}
      <path d="M300,245 Q240,270 160,290" stroke="currentColor" strokeWidth="0.6" opacity="0.14" fill="none" strokeDasharray="6 3" />
      <circle cx="160" cy="290" r="4" stroke="currentColor" strokeWidth="0.5" opacity="0.14" fill="none" />
      {/* Home base marker */}
      <circle cx="300" cy="245" r="3" fill="currentColor" opacity="0.2" />
      <circle cx="300" cy="245" r="8" stroke="currentColor" strokeWidth="0.4" opacity="0.1" />
      {/* Outer frame */}
      <rect x="30" y="100" width="540" height="400" rx="4" stroke="currentColor" strokeWidth="0.5" opacity="0.08" />
    </svg>
  );
}

function W11_PolarProjection() {
  return (
    <svg viewBox="0 0 600 600" fill="none" xmlns="http://www.w3.org/2000/svg">
      {/* Latitude circles from pole outward */}
      {[60, 120, 180, 240, 280].map(r => (
        <circle key={r} cx="300" cy="300" r={r} stroke="currentColor" strokeWidth={r === 280 ? '1' : '0.4'} opacity={r === 280 ? '0.18' : '0.08'} />
      ))}
      {/* Longitude radiating lines */}
      {Array.from({ length: 24 }, (_, i) => {
        const a = i * 15 * Math.PI / 180;
        return <line key={i} x1="300" y1="300" x2={300 + 280 * Math.cos(a)} y2={300 + 280 * Math.sin(a)} stroke="currentColor" strokeWidth={i % 6 === 0 ? '0.5' : '0.25'} opacity={i % 6 === 0 ? '0.12' : '0.06'} />;
      })}
      {/* North Pole center */}
      <circle cx="300" cy="300" r="4" fill="currentColor" opacity="0.18" />
      {/* Latitude labels */}
      {[
        { label: '80N', r: 60 }, { label: '60N', r: 120 },
        { label: '40N', r: 180 }, { label: '20N', r: 240 }
      ].map(({ label, r }) => (
        <text key={label} x={305} y={300 - r + 4} fill="currentColor" opacity="0.08" fontSize="8" fontFamily="'Share Tech Mono', monospace">{label}</text>
      ))}
      {/* Expedition route from ~51N (UK) curving to pole */}
      <path d="M300,520 Q260,440 280,360 Q290,300 300,300" stroke="currentColor" strokeWidth="0.8" opacity="0.14" fill="none" strokeDasharray="8 4" />
      <circle cx="300" cy="520" r="3" stroke="currentColor" strokeWidth="0.4" opacity="0.12" fill="none" />
    </svg>
  );
}

function W12_VORRose() {
  return (
    <svg viewBox="0 0 600 600" fill="none" xmlns="http://www.w3.org/2000/svg">
      {/* Outer ring */}
      <circle cx="300" cy="300" r="280" stroke="currentColor" strokeWidth="0.8" opacity="0.15" />
      {/* Every-degree ticks (simplified: every 2 degrees) */}
      {Array.from({ length: 180 }, (_, i) => {
        const deg = i * 2;
        const a = deg * Math.PI / 180;
        const isMajor = deg % 30 === 0;
        const isMid = deg % 10 === 0;
        const inner = isMajor ? 248 : isMid ? 258 : 270;
        return <line key={i} x1={300 + inner * Math.cos(a)} y1={300 + inner * Math.sin(a)} x2={300 + 278 * Math.cos(a)} y2={300 + 278 * Math.sin(a)} stroke="currentColor" strokeWidth={isMajor ? '0.6' : '0.2'} opacity={isMajor ? '0.14' : isMid ? '0.08' : '0.05'} />;
      })}
      {/* Heading numbers every 30 degrees */}
      {Array.from({ length: 12 }, (_, i) => {
        const deg = i * 30;
        const a = (deg - 90) * Math.PI / 180;
        const label = deg === 0 ? '36' : String(deg / 10).padStart(2, '0');
        return <text key={i} x={300 + 232 * Math.cos(a)} y={300 + 232 * Math.sin(a)} textAnchor="middle" dominantBaseline="central" fill="currentColor" opacity="0.1" fontSize="11" fontFamily="'Share Tech Mono', monospace">{label}</text>;
      })}
      {/* Center VOR symbol */}
      <circle cx="300" cy="300" r="12" stroke="currentColor" strokeWidth="0.5" opacity="0.12" />
      {/* Hexagonal VOR shape */}
      <polygon points={Array.from({ length: 6 }, (_, i) => {
        const a = i * 60 * Math.PI / 180;
        return `${300 + 8 * Math.cos(a)},${300 + 8 * Math.sin(a)}`;
      }).join(' ')} stroke="currentColor" strokeWidth="0.4" opacity="0.1" fill="none" />
      <circle cx="300" cy="300" r="2" fill="currentColor" opacity="0.15" />
      {/* Radial bearing line */}
      <line x1="300" y1="300" x2="300" y2="22" stroke="currentColor" strokeWidth="0.5" opacity="0.1" strokeDasharray="8 6" />
    </svg>
  );
}

function W13_HUDOverlay() {
  return (
    <svg viewBox="0 0 600 600" fill="none" xmlns="http://www.w3.org/2000/svg">
      {/* HUD frame */}
      <rect x="60" y="80" width="480" height="440" rx="4" stroke="currentColor" strokeWidth="0.5" opacity="0.08" />
      {/* Horizon line */}
      <line x1="150" y1="300" x2="250" y2="300" stroke="currentColor" strokeWidth="0.6" opacity="0.14" />
      <line x1="350" y1="300" x2="450" y2="300" stroke="currentColor" strokeWidth="0.6" opacity="0.14" />
      {/* Pitch ladder */}
      {[-20, -10, 10, 20].map(p => {
        const y = 300 - p * 5;
        const hw = Math.abs(p) === 10 ? 35 : 50;
        const isDashed = p < 0;
        return <line key={p} x1={300 - hw} y1={y} x2={300 + hw} y2={y} stroke="currentColor" strokeWidth="0.4" opacity="0.1" strokeDasharray={isDashed ? '4 3' : 'none'} />;
      })}
      {/* Flight path vector */}
      <circle cx="300" cy="295" r="8" stroke="currentColor" strokeWidth="0.6" opacity="0.16" fill="none" />
      <line x1="285" y1="295" x2="292" y2="295" stroke="currentColor" strokeWidth="0.5" opacity="0.14" />
      <line x1="308" y1="295" x2="315" y2="295" stroke="currentColor" strokeWidth="0.5" opacity="0.14" />
      <line x1="300" y1="303" x2="300" y2="308" stroke="currentColor" strokeWidth="0.5" opacity="0.14" />
      {/* Airspeed tape (left) */}
      <rect x="80" y="200" width="50" height="200" rx="2" stroke="currentColor" strokeWidth="0.4" opacity="0.08" />
      {[220, 250, 280, 310, 340, 370].map((y, i) => (
        <g key={y}>
          <line x1="120" y1={y} x2="130" y2={y} stroke="currentColor" strokeWidth="0.3" opacity="0.08" />
          <text x="108" y={y + 3} textAnchor="end" fill="currentColor" opacity="0.08" fontSize="8" fontFamily="'Share Tech Mono', monospace">{140 - i * 10}</text>
        </g>
      ))}
      {/* Current speed readout */}
      <rect x="75" y="290" width="55" height="20" rx="2" stroke="currentColor" strokeWidth="0.5" opacity="0.12" />
      <text x="103" y="303" textAnchor="middle" fill="currentColor" opacity="0.12" fontSize="10" fontFamily="'Share Tech Mono', monospace">120</text>
      {/* Altitude tape (right) */}
      <rect x="470" y="200" width="50" height="200" rx="2" stroke="currentColor" strokeWidth="0.4" opacity="0.08" />
      {[220, 250, 280, 310, 340, 370].map((y, i) => (
        <g key={y}>
          <line x1="470" y1={y} x2="480" y2={y} stroke="currentColor" strokeWidth="0.3" opacity="0.08" />
          <text x="492" y={y + 3} textAnchor="start" fill="currentColor" opacity="0.08" fontSize="8" fontFamily="'Share Tech Mono', monospace">{4500 - i * 500}</text>
        </g>
      ))}
      {/* Current altitude readout */}
      <rect x="465" y="290" width="60" height="20" rx="2" stroke="currentColor" strokeWidth="0.5" opacity="0.12" />
      <text x="495" y="303" textAnchor="middle" fill="currentColor" opacity="0.12" fontSize="10" fontFamily="'Share Tech Mono', monospace">3500</text>
      {/* Heading tape (bottom) */}
      <line x1="180" y1="460" x2="420" y2="460" stroke="currentColor" strokeWidth="0.4" opacity="0.1" />
      {Array.from({ length: 7 }, (_, i) => {
        const x = 180 + i * 40;
        const hdg = 330 + i * 10;
        return (
          <g key={i}>
            <line x1={x} y1="455" x2={x} y2="460" stroke="currentColor" strokeWidth="0.3" opacity="0.08" />
            <text x={x} y="472" textAnchor="middle" fill="currentColor" opacity="0.08" fontSize="7" fontFamily="'Share Tech Mono', monospace">{hdg >= 360 ? hdg - 360 : hdg}</text>
          </g>
        );
      })}
      {/* Heading triangle */}
      <path d="M300,453 L296,460 L304,460 Z" stroke="currentColor" strokeWidth="0.4" opacity="0.12" fill="none" />
    </svg>
  );
}

function W14_AirspeedIndicator() {
  return (
    <svg viewBox="0 0 600 600" fill="none" xmlns="http://www.w3.org/2000/svg">
      {/* Bezel */}
      <circle cx="300" cy="300" r="280" stroke="currentColor" strokeWidth="1.2" opacity="0.18" />
      <circle cx="300" cy="300" r="272" stroke="currentColor" strokeWidth="0.3" opacity="0.06" />
      {/* Speed range arcs (white, green, yellow arcs from ~30 to ~200 knots) */}
      {/* Arc spans from about 7 o'clock to 5 o'clock (240 degrees) */}
      {/* White arc: Vs0 to Vfe (flap range) */}
      {(() => {
        const startA = 130, endA = 230; // degrees
        const sa = startA * Math.PI / 180, ea = endA * Math.PI / 180;
        return <path d={`M${300 + 255 * Math.cos(sa)},${300 + 255 * Math.sin(sa)} A255,255 0 0,1 ${300 + 255 * Math.cos(ea)},${300 + 255 * Math.sin(ea)}`} stroke="currentColor" strokeWidth="3" opacity="0.06" fill="none" />;
      })()}
      {/* Green arc: Vs1 to Vno (normal operating) */}
      {(() => {
        const startA = 150, endA = 340;
        const sa = startA * Math.PI / 180, ea = endA * Math.PI / 180;
        return <path d={`M${300 + 248 * Math.cos(sa)},${300 + 248 * Math.sin(sa)} A248,248 0 1,1 ${300 + 248 * Math.cos(ea)},${300 + 248 * Math.sin(ea)}`} stroke="currentColor" strokeWidth="4" opacity="0.05" fill="none" />;
      })()}
      {/* Yellow arc: Vno to Vne (caution) */}
      {(() => {
        const startA = 340, endA = 20;
        const sa = startA * Math.PI / 180, ea = endA * Math.PI / 180;
        return <path d={`M${300 + 248 * Math.cos(sa)},${300 + 248 * Math.sin(sa)} A248,248 0 0,1 ${300 + 248 * Math.cos(ea)},${300 + 248 * Math.sin(ea)}`} stroke="currentColor" strokeWidth="4" opacity="0.08" fill="none" />;
      })()}
      {/* Tick marks around the dial */}
      {Array.from({ length: 30 }, (_, i) => {
        const a = (130 + i * 8) * Math.PI / 180;
        const isMajor = i % 5 === 0;
        const inner = isMajor ? 225 : 240;
        return <line key={i} x1={300 + inner * Math.cos(a)} y1={300 + inner * Math.sin(a)} x2={300 + 265 * Math.cos(a)} y2={300 + 265 * Math.sin(a)} stroke="currentColor" strokeWidth={isMajor ? '0.7' : '0.3'} opacity={isMajor ? '0.14' : '0.08'} />;
      })}
      {/* Speed labels */}
      {[40, 60, 80, 100, 120, 140, 160].map((spd, i) => {
        const a = (130 + i * 40 / 1.4) * Math.PI / 180;
        return <text key={spd} x={300 + 208 * Math.cos(a)} y={300 + 208 * Math.sin(a)} textAnchor="middle" dominantBaseline="central" fill="currentColor" opacity="0.1" fontSize="12" fontFamily="'Share Tech Mono', monospace">{spd}</text>;
      })}
      {/* Needle */}
      {(() => {
        const needleA = 250 * Math.PI / 180;
        return <line x1={300 - 30 * Math.cos(needleA)} y1={300 - 30 * Math.sin(needleA)} x2={300 + 195 * Math.cos(needleA)} y2={300 + 195 * Math.sin(needleA)} stroke="currentColor" strokeWidth="1" opacity="0.2" />;
      })()}
      {/* Hub */}
      <circle cx="300" cy="300" r="8" stroke="currentColor" strokeWidth="0.6" opacity="0.14" />
      <circle cx="300" cy="300" r="2.5" fill="currentColor" opacity="0.18" />
      {/* KNOTS label */}
      <text x="300" y="380" textAnchor="middle" fill="currentColor" opacity="0.08" fontSize="10" fontFamily="'Share Tech Mono', monospace">KNOTS</text>
    </svg>
  );
}

function W15_StarChart() {
  return (
    <svg viewBox="0 0 600 600" fill="none" xmlns="http://www.w3.org/2000/svg">
      {/* Celestial grid */}
      <circle cx="300" cy="300" r="280" stroke="currentColor" strokeWidth="0.8" opacity="0.12" />
      <circle cx="300" cy="300" r="200" stroke="currentColor" strokeWidth="0.3" opacity="0.06" />
      <circle cx="300" cy="300" r="120" stroke="currentColor" strokeWidth="0.3" opacity="0.06" />
      <circle cx="300" cy="300" r="40" stroke="currentColor" strokeWidth="0.3" opacity="0.06" />
      {/* Right ascension lines */}
      {Array.from({ length: 12 }, (_, i) => {
        const a = i * 30 * Math.PI / 180;
        return <line key={i} x1={300 + 40 * Math.cos(a)} y1={300 + 40 * Math.sin(a)} x2={300 + 280 * Math.cos(a)} y2={300 + 280 * Math.sin(a)} stroke="currentColor" strokeWidth="0.2" opacity="0.05" />;
      })}
      {/* Stars with varying magnitudes */}
      {[
        [320, 180, 3.5], [250, 160, 2], [380, 220, 2.5], [200, 250, 1.5],
        [420, 300, 3], [340, 350, 2], [180, 350, 1.8], [260, 400, 2.5],
        [400, 400, 1.5], [300, 200, 4], [150, 200, 2], [440, 180, 1.8],
        [360, 140, 2.2], [220, 320, 1.5], [470, 350, 2.8], [130, 300, 2],
        [350, 450, 1.5], [240, 450, 2], [280, 130, 1.8], [420, 250, 2.5],
        [160, 420, 2], [380, 160, 1.5], [300, 300, 2], [450, 420, 1.8],
        [190, 170, 3], [330, 260, 1.5], [270, 220, 2.2]
      ].map(([cx, cy, r], i) => (
        <circle key={i} cx={cx} cy={cy} r={r} fill="currentColor" opacity={0.06 + (r / 4) * 0.12} />
      ))}
      {/* Constellation lines — Ursa Major (Big Dipper) */}
      <polyline points="320,180 340,350 260,400 180,350" stroke="currentColor" strokeWidth="0.4" opacity="0.08" fill="none" />
      <polyline points="320,180 380,220 420,300 340,350" stroke="currentColor" strokeWidth="0.4" opacity="0.08" fill="none" />
      {/* Constellation lines — Polaris area */}
      <polyline points="300,200 250,160 220,320" stroke="currentColor" strokeWidth="0.3" opacity="0.07" fill="none" />
      {/* Polaris marker */}
      <circle cx="300" cy="300" r="3" fill="currentColor" opacity="0.15" />
      <circle cx="300" cy="300" r="8" stroke="currentColor" strokeWidth="0.3" opacity="0.08" />
    </svg>
  );
}

function W16_WindRose() {
  return (
    <svg viewBox="0 0 600 600" fill="none" xmlns="http://www.w3.org/2000/svg">
      {/* Reference circles */}
      {[70, 140, 210, 280].map(r => (
        <circle key={r} cx="300" cy="300" r={r} stroke="currentColor" strokeWidth="0.3" opacity="0.06" />
      ))}
      {/* Asymmetric wind frequency wedges — 16 directions */}
      {[
        { deg: 0, len: 260 },    // N  — strong
        { deg: 22.5, len: 140 }, // NNE
        { deg: 45, len: 120 },   // NE
        { deg: 67.5, len: 80 },  // ENE
        { deg: 90, len: 100 },   // E
        { deg: 112.5, len: 60 }, // ESE
        { deg: 135, len: 70 },   // SE
        { deg: 157.5, len: 50 }, // SSE
        { deg: 180, len: 90 },   // S
        { deg: 202.5, len: 110 },// SSW
        { deg: 225, len: 200 },  // SW — prevailing
        { deg: 247.5, len: 230 },// WSW — prevailing
        { deg: 270, len: 250 },  // W  — strong
        { deg: 292.5, len: 190 },// WNW
        { deg: 315, len: 160 },  // NW
        { deg: 337.5, len: 180 },// NNW
      ].map(({ deg, len }) => {
        const halfW = 8;
        const a = (deg - 90) * Math.PI / 180;
        const perpA = a + Math.PI / 2;
        const tipX = 300 + len * Math.cos(a);
        const tipY = 300 + len * Math.sin(a);
        const bL = `${300 + 15 * Math.cos(a) + halfW * Math.cos(perpA)},${300 + 15 * Math.sin(a) + halfW * Math.sin(perpA)}`;
        const bR = `${300 + 15 * Math.cos(a) - halfW * Math.cos(perpA)},${300 + 15 * Math.sin(a) - halfW * Math.sin(perpA)}`;
        return <polygon key={deg} points={`${Math.round(tipX)},${Math.round(tipY)} ${bL} ${bR}`} stroke="currentColor" strokeWidth="0.4" opacity="0.1" fill="currentColor" fillOpacity="0.03" />;
      })}
      {/* Direction labels */}
      {[
        { label: 'N', deg: 0 }, { label: 'NE', deg: 45 },
        { label: 'E', deg: 90 }, { label: 'SE', deg: 135 },
        { label: 'S', deg: 180 }, { label: 'SW', deg: 225 },
        { label: 'W', deg: 270 }, { label: 'NW', deg: 315 }
      ].map(({ label, deg }) => {
        const a = (deg - 90) * Math.PI / 180;
        return <text key={label} x={300 + 278 * Math.cos(a)} y={300 + 278 * Math.sin(a)} textAnchor="middle" dominantBaseline="central" fill="currentColor" opacity="0.08" fontSize="8" fontFamily="'Share Tech Mono', monospace">{label}</text>;
      })}
      <circle cx="300" cy="300" r="3" fill="currentColor" opacity="0.15" />
    </svg>
  );
}

function W17_RunwayApproach() {
  return (
    <svg viewBox="0 0 600 600" fill="none" xmlns="http://www.w3.org/2000/svg">
      {/* Perspective runway approach lights */}
      {(() => {
        const elements = [];
        const vanishY = 140;
        const baseY = 540;
        const rows = 18;

        for (let i = 0; i < rows; i++) {
          const t = i / (rows - 1);
          const y = baseY - t * (baseY - vanishY);
          const spread = (1 - t * 0.92) * 200;
          const size = (1 - t * 0.85) * 3;
          const opacity = 0.04 + (1 - t) * 0.12;

          // Center line light
          elements.push(
            <circle key={`c${i}`} cx="300" cy={y} r={size * 0.6} fill="currentColor" opacity={opacity} />
          );

          // Side lights
          if (i < rows - 3) {
            elements.push(
              <circle key={`l${i}`} cx={300 - spread} cy={y} r={size * 0.4} fill="currentColor" opacity={opacity * 0.7} />,
              <circle key={`r${i}`} cx={300 + spread} cy={y} r={size * 0.4} fill="currentColor" opacity={opacity * 0.7} />
            );
          }

          // Crossbar lights every 4 rows
          if (i % 4 === 0 && i < rows - 2) {
            const barW = spread * 0.6;
            elements.push(
              <line key={`bar${i}`} x1={300 - barW} y1={y} x2={300 + barW} y2={y} stroke="currentColor" strokeWidth={size * 0.3} opacity={opacity * 0.6} />
            );
          }
        }

        // Runway edges converging to vanishing point
        elements.push(
          <line key="edgeL" x1={300 - 120} y1={baseY} x2={300 - 10} y2={vanishY} stroke="currentColor" strokeWidth="0.4" opacity="0.08" />,
          <line key="edgeR" x1={300 + 120} y1={baseY} x2={300 + 10} y2={vanishY} stroke="currentColor" strokeWidth="0.4" opacity="0.08" />
        );

        // Center dashed line
        elements.push(
          <line key="center" x1="300" y1={baseY} x2="300" y2={vanishY + 20} stroke="currentColor" strokeWidth="0.3" opacity="0.06" strokeDasharray="8 6" />
        );

        // Threshold bar
        elements.push(
          <line key="threshold" x1={300 - 130} y1={baseY + 5} x2={300 + 130} y2={baseY + 5} stroke="currentColor" strokeWidth="1" opacity="0.14" />
        );

        // PAPI lights
        elements.push(
          <g key="papi">
            <circle cx={300 - 160} cy={baseY - 60} r="3" fill="currentColor" opacity="0.12" />
            <circle cx={300 - 150} cy={baseY - 60} r="3" fill="currentColor" opacity="0.12" />
            <circle cx={300 - 140} cy={baseY - 60} r="3" fill="currentColor" opacity="0.08" />
            <circle cx={300 - 130} cy={baseY - 60} r="3" fill="currentColor" opacity="0.08" />
          </g>
        );

        return elements;
      })()}
    </svg>
  );
}

function W18_FibonacciSpiral() {
  return (
    <svg viewBox="0 0 600 600" fill="none" xmlns="http://www.w3.org/2000/svg">
      {/* Fibonacci construction rectangles */}
      {(() => {
        const elements = [];
        // Golden ratio Fibonacci sequence spiral
        const fibs = [1, 1, 2, 3, 5, 8, 13, 21, 34, 55, 89];
        const scale = 3;

        // Position spiral roughly centered
        let cx = 260, cy = 290;

        // Draw construction rectangles
        const rects = [
          { x: cx, y: cy, w: 89 * scale, h: 55 * scale },
          { x: cx, y: cy - 34 * scale, w: 55 * scale, h: 34 * scale },
          { x: cx - 34 * scale, y: cy - 34 * scale, w: 34 * scale, h: 34 * scale },
          { x: cx - 34 * scale, y: cy, w: 21 * scale, h: 21 * scale },
          { x: cx - 13 * scale, y: cy + 13 * scale, w: 13 * scale, h: 13 * scale },
        ];

        rects.forEach((r, i) => {
          elements.push(
            <rect key={`r${i}`} x={r.x} y={r.y} width={r.w} height={r.h} stroke="currentColor" strokeWidth="0.3" opacity={0.04 + i * 0.015} fill="none" />
          );
        });

        // Draw the spiral using quarter-circle arcs
        const spiral = `
          M ${cx + 89 * scale},${cy + 55 * scale}
          A ${89 * scale},${89 * scale} 0 0,1 ${cx},${cy - 34 * scale}
          A ${55 * scale},${55 * scale} 0 0,1 ${cx - 34 * scale},${cy + 21 * scale}
          A ${34 * scale},${34 * scale} 0 0,1 ${cx - 13 * scale + 21 * scale},${cy}
          A ${21 * scale},${21 * scale} 0 0,1 ${cx - 13 * scale},${cy + 13 * scale}
          A ${13 * scale},${13 * scale} 0 0,1 ${cx},${cy + 13 * scale + 5 * scale}
        `;

        elements.push(
          <path key="spiral" d={spiral} stroke="currentColor" strokeWidth="0.8" opacity="0.16" fill="none" />
        );

        // Golden ratio annotation
        elements.push(
          <text key="phi" x="470" y="490" fill="currentColor" opacity="0.06" fontSize="18" fontFamily="'Playfair Display', serif" fontStyle="italic">&#966;</text>
        );

        // Subtle outer circle containing the spiral
        elements.push(
          <circle key="outer" cx="300" cy="300" r="280" stroke="currentColor" strokeWidth="0.3" opacity="0.05" />
        );

        return elements;
      })()}
    </svg>
  );
}

function W19_DotMatrixGlobe() {
  return (
    <svg viewBox="0 0 600 600" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="300" cy="300" r="280" stroke="currentColor" strokeWidth="0.5" opacity="0.1" />
      {(() => {
        const dots = [];
        const R = 280;
        for (let lat = -80; lat <= 80; lat += 10) {
          for (let lon = -90; lon <= 90; lon += 10) {
            const cLa = Math.cos(lat * Math.PI / 180);
            const sLa = Math.sin(lat * Math.PI / 180);
            const cLo = Math.cos(lon * Math.PI / 180);
            const sLo = Math.sin(lon * Math.PI / 180);
            const depth = cLa * cLo;
            if (depth > 0.05) {
              const x = 300 + R * cLa * sLo;
              const y = 300 - R * sLa;
              dots.push(
                <circle key={`${lat}_${lon}`} cx={Math.round(x * 10) / 10} cy={Math.round(y * 10) / 10} r={1 + depth * 2.5} fill="currentColor" opacity={0.04 + depth * 0.16} />
              );
            }
          }
        }
        return dots;
      })()}
    </svg>
  );
}

function W20_ExpeditionRoute() {
  return (
    <svg viewBox="0 0 600 600" fill="none" xmlns="http://www.w3.org/2000/svg">
      {/* Flowing expedition route path */}
      <path d="M80,500 Q120,460 160,430 Q220,390 260,340 Q290,300 300,260 Q310,220 340,190 Q380,160 420,170 Q460,185 480,230 Q495,270 510,300 Q520,320 530,310" stroke="currentColor" strokeWidth="0.8" opacity="0.14" fill="none" strokeDasharray="10 5" />

      {/* Waypoint markers */}
      {[
        { x: 80, y: 500, n: '01', label: 'DENHAM' },
        { x: 160, y: 430, n: '02', label: 'CHANNEL' },
        { x: 260, y: 340, n: '03', label: 'PARIS' },
        { x: 300, y: 260, n: '04', label: 'ALPS' },
        { x: 340, y: 190, n: '05', label: 'MILAN' },
        { x: 420, y: 170, n: '06', label: 'SPLIT' },
        { x: 495, y: 270, n: '07', label: 'ATHENS' },
        { x: 530, y: 310, n: '08', label: 'ARRIVE' },
      ].map(({ x, y, n, label }) => (
        <g key={n}>
          <circle cx={x} cy={y} r="6" stroke="currentColor" strokeWidth="0.5" opacity="0.14" fill="none" />
          <circle cx={x} cy={y} r="2" fill="currentColor" opacity="0.16" />
          <text x={x} y={y - 12} textAnchor="middle" fill="currentColor" opacity="0.1" fontSize="7" fontFamily="'Share Tech Mono', monospace">{n}</text>
          <text x={x} y={y + 18} textAnchor="middle" fill="currentColor" opacity="0.06" fontSize="6" fontFamily="'Share Tech Mono', monospace">{label}</text>
        </g>
      ))}

      {/* Distance annotations between waypoints */}
      {[
        { x: 120, y: 470, d: '42nm' },
        { x: 210, y: 388, d: '68nm' },
        { x: 280, y: 305, d: '55nm' },
        { x: 318, y: 228, d: '48nm' },
        { x: 380, y: 175, d: '72nm' },
        { x: 458, y: 225, d: '61nm' },
      ].map(({ x, y, d }, i) => (
        <text key={i} x={x} y={y} textAnchor="middle" fill="currentColor" opacity="0.06" fontSize="6" fontFamily="'Share Tech Mono', monospace">{d}</text>
      ))}

      {/* Subtle landmark icons */}
      {/* Mountain near Alps */}
      <path d="M290,270 L300,250 L310,270" stroke="currentColor" strokeWidth="0.3" opacity="0.06" fill="none" />
      {/* Water near Channel */}
      <path d="M150,440 Q155,436 160,440 Q165,444 170,440" stroke="currentColor" strokeWidth="0.3" opacity="0.06" fill="none" />
    </svg>
  );
}

/* ------------------------------------------------------------------ */
/*  Wireframes 21–40                                                   */
/* ------------------------------------------------------------------ */

function W21_Gyroscope() {
  return (
    <svg viewBox="0 0 600 600" fill="none" xmlns="http://www.w3.org/2000/svg">
      {/* Outer gimbal */}
      <circle cx="300" cy="300" r="270" stroke="currentColor" strokeWidth="1" opacity="0.16" />
      {/* Middle gimbal — tilted ellipse */}
      <ellipse cx="300" cy="300" rx="230" ry="260" stroke="currentColor" strokeWidth="0.7" opacity="0.13" transform="rotate(25 300 300)" />
      {/* Inner gimbal — tilted opposite */}
      <ellipse cx="300" cy="300" rx="190" ry="220" stroke="currentColor" strokeWidth="0.6" opacity="0.11" transform="rotate(-35 300 300)" />
      {/* Spin axis */}
      <line x1="300" y1="110" x2="300" y2="490" stroke="currentColor" strokeWidth="0.5" opacity="0.1" strokeDasharray="6 4" />
      {/* Rotor disc */}
      <ellipse cx="300" cy="300" rx="140" ry="40" stroke="currentColor" strokeWidth="0.8" opacity="0.14" transform="rotate(-10 300 300)" />
      {/* Gimbal pivots */}
      {[[300, 30], [300, 570], [30, 300], [570, 300]].map(([x, y], i) => (
        <circle key={i} cx={x} cy={y} r="4" stroke="currentColor" strokeWidth="0.4" opacity="0.1" fill="none" />
      ))}
      {/* Gimbal mount brackets */}
      <line x1="270" y1="30" x2="270" y2="50" stroke="currentColor" strokeWidth="0.3" opacity="0.07" />
      <line x1="330" y1="30" x2="330" y2="50" stroke="currentColor" strokeWidth="0.3" opacity="0.07" />
      <line x1="270" y1="550" x2="270" y2="570" stroke="currentColor" strokeWidth="0.3" opacity="0.07" />
      <line x1="330" y1="550" x2="330" y2="570" stroke="currentColor" strokeWidth="0.3" opacity="0.07" />
      {/* Center mass */}
      <circle cx="300" cy="300" r="8" fill="currentColor" opacity="0.12" />
      <circle cx="300" cy="300" r="12" stroke="currentColor" strokeWidth="0.4" opacity="0.08" />
    </svg>
  );
}

function W22_TailRotorCrossSection() {
  return (
    <svg viewBox="0 0 600 600" fill="none" xmlns="http://www.w3.org/2000/svg">
      {/* Fenestron housing — circular duct */}
      <circle cx="300" cy="300" r="260" stroke="currentColor" strokeWidth="1.5" opacity="0.18" />
      <circle cx="300" cy="300" r="250" stroke="currentColor" strokeWidth="0.4" opacity="0.06" />
      <circle cx="300" cy="300" r="270" stroke="currentColor" strokeWidth="0.3" opacity="0.05" />
      {/* Hub */}
      <circle cx="300" cy="300" r="45" stroke="currentColor" strokeWidth="0.8" opacity="0.14" />
      <circle cx="300" cy="300" r="40" stroke="currentColor" strokeWidth="0.3" opacity="0.06" />
      <circle cx="300" cy="300" r="8" fill="currentColor" opacity="0.15" />
      {/* Blades — 10 blades evenly spaced in fenestron */}
      {Array.from({ length: 10 }, (_, i) => {
        const a = i * 36 * Math.PI / 180;
        const offset = (i % 2 === 0 ? 1 : -1) * 0.15; // slight pitch visual
        const sx = 300 + 45 * Math.cos(a);
        const sy = 300 + 45 * Math.sin(a);
        const ex = 300 + 248 * Math.cos(a + offset);
        const ey = 300 + 248 * Math.sin(a + offset);
        return (
          <g key={i}>
            <line x1={sx} y1={sy} x2={ex} y2={ey} stroke="currentColor" strokeWidth="0.7" opacity="0.14" />
            {/* Leading edge thickness hint */}
            <line x1={300 + 100 * Math.cos(a)} y1={300 + 100 * Math.sin(a)} x2={300 + 100 * Math.cos(a + offset * 2)} y2={300 + 100 * Math.sin(a + offset * 2)} stroke="currentColor" strokeWidth="0.3" opacity="0.06" />
          </g>
        );
      })}
      {/* Stator vanes — subtle structural supports */}
      {Array.from({ length: 5 }, (_, i) => {
        const a = (i * 72 + 18) * Math.PI / 180;
        return <line key={`s${i}`} x1={300 + 252 * Math.cos(a)} y1={300 + 252 * Math.sin(a)} x2={300 + 268 * Math.cos(a)} y2={300 + 268 * Math.sin(a)} stroke="currentColor" strokeWidth="0.4" opacity="0.08" />;
      })}
    </svg>
  );
}

function W23_BarometricPressure() {
  return (
    <svg viewBox="0 0 600 600" fill="none" xmlns="http://www.w3.org/2000/svg">
      {/* Isobar lines — closed curves of constant pressure */}
      {/* High pressure system */}
      <ellipse cx="210" cy="230" rx="60" ry="45" stroke="currentColor" strokeWidth="0.5" opacity="0.12" transform="rotate(-15 210 230)" />
      <ellipse cx="210" cy="230" rx="110" ry="80" stroke="currentColor" strokeWidth="0.4" opacity="0.1" transform="rotate(-15 210 230)" />
      <ellipse cx="210" cy="230" rx="160" ry="120" stroke="currentColor" strokeWidth="0.35" opacity="0.08" transform="rotate(-10 210 230)" />
      <ellipse cx="210" cy="230" rx="220" ry="165" stroke="currentColor" strokeWidth="0.3" opacity="0.06" transform="rotate(-8 210 230)" />
      <text x="210" y="235" textAnchor="middle" dominantBaseline="central" fill="currentColor" opacity="0.14" fontSize="16" fontFamily="'Share Tech Mono', monospace">H</text>
      <text x="210" y="255" textAnchor="middle" fill="currentColor" opacity="0.07" fontSize="8" fontFamily="'Share Tech Mono', monospace">1024</text>
      {/* Low pressure system */}
      <ellipse cx="430" cy="400" rx="50" ry="40" stroke="currentColor" strokeWidth="0.5" opacity="0.12" transform="rotate(20 430 400)" />
      <ellipse cx="430" cy="400" rx="95" ry="70" stroke="currentColor" strokeWidth="0.4" opacity="0.1" transform="rotate(20 430 400)" />
      <ellipse cx="430" cy="400" rx="145" ry="105" stroke="currentColor" strokeWidth="0.35" opacity="0.08" transform="rotate(15 430 400)" />
      <text x="430" y="405" textAnchor="middle" dominantBaseline="central" fill="currentColor" opacity="0.14" fontSize="16" fontFamily="'Share Tech Mono', monospace">L</text>
      <text x="430" y="425" textAnchor="middle" fill="currentColor" opacity="0.07" fontSize="8" fontFamily="'Share Tech Mono', monospace">998</text>
      {/* Cold front line */}
      <path d="M80,340 Q180,310 280,330 Q380,350 480,320" stroke="currentColor" strokeWidth="0.6" opacity="0.1" fill="none" />
      {/* Front triangles */}
      {[140, 230, 320, 410].map((x, i) => {
        const y = 330 - Math.sin((x - 80) / 400 * Math.PI) * 20 + 10;
        return <path key={i} d={`M${x - 4},${y} L${x},${y - 7} L${x + 4},${y}`} stroke="currentColor" strokeWidth="0.3" opacity="0.08" fill="currentColor" fillOpacity="0.04" />;
      })}
      {/* Outer frame */}
      <rect x="40" y="60" width="520" height="480" rx="4" stroke="currentColor" strokeWidth="0.4" opacity="0.06" />
    </svg>
  );
}

function W24_SextantSight() {
  return (
    <svg viewBox="0 0 600 600" fill="none" xmlns="http://www.w3.org/2000/svg">
      {/* Reticle outer circle */}
      <circle cx="300" cy="300" r="270" stroke="currentColor" strokeWidth="1" opacity="0.16" />
      <circle cx="300" cy="300" r="265" stroke="currentColor" strokeWidth="0.3" opacity="0.06" />
      {/* Horizon line */}
      <line x1="30" y1="300" x2="570" y2="300" stroke="currentColor" strokeWidth="0.8" opacity="0.16" />
      {/* Altitude arc markings */}
      {Array.from({ length: 7 }, (_, i) => {
        const deg = i * 10;
        const y = 300 - deg * 2.2;
        if (y < 30) return null;
        return (
          <g key={i}>
            <line x1="280" y1={y} x2="320" y2={y} stroke="currentColor" strokeWidth="0.4" opacity="0.08" />
            <text x="325" y={y + 3} fill="currentColor" opacity="0.06" fontSize="7" fontFamily="'Share Tech Mono', monospace">{deg}°</text>
          </g>
        );
      })}
      {/* Cross-hairs */}
      <line x1="300" y1="30" x2="300" y2="230" stroke="currentColor" strokeWidth="0.3" opacity="0.08" />
      <line x1="300" y1="370" x2="300" y2="570" stroke="currentColor" strokeWidth="0.3" opacity="0.08" />
      {/* Star target position */}
      <circle cx="300" cy="190" r="6" stroke="currentColor" strokeWidth="0.5" opacity="0.14" fill="none" />
      <circle cx="300" cy="190" r="2" fill="currentColor" opacity="0.16" />
      {/* Micrometer drum arc */}
      <path d={`M ${300 + 270 * Math.cos(200 * Math.PI / 180)},${300 + 270 * Math.sin(200 * Math.PI / 180)} A270,270 0 0,1 ${300 + 270 * Math.cos(340 * Math.PI / 180)},${300 + 270 * Math.sin(340 * Math.PI / 180)}`} stroke="currentColor" strokeWidth="0.5" opacity="0.08" fill="none" />
      {/* Arc degree ticks */}
      {Array.from({ length: 15 }, (_, i) => {
        const a = (200 + i * 10) * Math.PI / 180;
        return <line key={i} x1={300 + 262 * Math.cos(a)} y1={300 + 262 * Math.sin(a)} x2={300 + 270 * Math.cos(a)} y2={300 + 270 * Math.sin(a)} stroke="currentColor" strokeWidth="0.3" opacity="0.06" />;
      })}
      {/* Observation label */}
      <text x="300" y="560" textAnchor="middle" fill="currentColor" opacity="0.06" fontSize="7" fontFamily="'Share Tech Mono', monospace">ALT 47°22' N</text>
    </svg>
  );
}

function W25_FuelGauge() {
  return (
    <svg viewBox="0 0 600 600" fill="none" xmlns="http://www.w3.org/2000/svg">
      {/* Bezel */}
      <circle cx="300" cy="300" r="280" stroke="currentColor" strokeWidth="1.2" opacity="0.18" />
      <circle cx="300" cy="300" r="272" stroke="currentColor" strokeWidth="0.3" opacity="0.06" />
      {/* Gauge arc — quarter circle from E to F (180° to 360°/0°) bottom half */}
      {/* Reserve zone (red arc) */}
      {(() => {
        const sa = 210 * Math.PI / 180, ea = 240 * Math.PI / 180;
        return <path d={`M${300 + 250 * Math.cos(sa)},${300 + 250 * Math.sin(sa)} A250,250 0 0,1 ${300 + 250 * Math.cos(ea)},${300 + 250 * Math.sin(ea)}`} stroke="currentColor" strokeWidth="4" opacity="0.1" fill="none" />;
      })()}
      {/* Normal zone */}
      {(() => {
        const sa = 240 * Math.PI / 180, ea = 330 * Math.PI / 180;
        return <path d={`M${300 + 250 * Math.cos(sa)},${300 + 250 * Math.sin(sa)} A250,250 0 0,1 ${300 + 250 * Math.cos(ea)},${300 + 250 * Math.sin(ea)}`} stroke="currentColor" strokeWidth="3" opacity="0.06" fill="none" />;
      })()}
      {/* Tick marks */}
      {Array.from({ length: 13 }, (_, i) => {
        const a = (210 + i * 10) * Math.PI / 180;
        const isMajor = i % 4 === 0;
        const inner = isMajor ? 225 : 240;
        return <line key={i} x1={300 + inner * Math.cos(a)} y1={300 + inner * Math.sin(a)} x2={300 + 265 * Math.cos(a)} y2={300 + 265 * Math.sin(a)} stroke="currentColor" strokeWidth={isMajor ? '0.7' : '0.3'} opacity={isMajor ? '0.14' : '0.08'} />;
      })}
      {/* E and F labels */}
      <text x={300 + 200 * Math.cos(210 * Math.PI / 180)} y={300 + 200 * Math.sin(210 * Math.PI / 180)} textAnchor="middle" dominantBaseline="central" fill="currentColor" opacity="0.14" fontSize="16" fontFamily="'Share Tech Mono', monospace">E</text>
      <text x={300 + 200 * Math.cos(330 * Math.PI / 180)} y={300 + 200 * Math.sin(330 * Math.PI / 180)} textAnchor="middle" dominantBaseline="central" fill="currentColor" opacity="0.14" fontSize="16" fontFamily="'Share Tech Mono', monospace">F</text>
      {/* 1/2 label */}
      <text x={300 + 200 * Math.cos(270 * Math.PI / 180)} y={300 + 200 * Math.sin(270 * Math.PI / 180)} textAnchor="middle" dominantBaseline="central" fill="currentColor" opacity="0.08" fontSize="10" fontFamily="'Share Tech Mono', monospace">1/2</text>
      {/* Needle pointing to ~3/4 */}
      {(() => {
        const needleA = 300 * Math.PI / 180;
        return <line x1="300" y1="300" x2={300 + 190 * Math.cos(needleA)} y2={300 + 190 * Math.sin(needleA)} stroke="currentColor" strokeWidth="1" opacity="0.2" />;
      })()}
      {/* Hub */}
      <circle cx="300" cy="300" r="8" stroke="currentColor" strokeWidth="0.6" opacity="0.14" />
      <circle cx="300" cy="300" r="2.5" fill="currentColor" opacity="0.18" />
      {/* FUEL label */}
      <text x="300" y="230" textAnchor="middle" fill="currentColor" opacity="0.08" fontSize="10" fontFamily="'Share Tech Mono', monospace">FUEL</text>
      {/* Fuel pump icon hint */}
      <rect x="288" y="185" width="24" height="18" rx="2" stroke="currentColor" strokeWidth="0.3" opacity="0.06" />
      <line x1="304" y1="185" x2="304" y2="178" stroke="currentColor" strokeWidth="0.3" opacity="0.06" />
    </svg>
  );
}

function W26_PropellerGeometry() {
  return (
    <svg viewBox="0 0 600 600" fill="none" xmlns="http://www.w3.org/2000/svg">
      {/* Spinner cone (top view) */}
      <circle cx="300" cy="300" r="30" stroke="currentColor" strokeWidth="0.8" opacity="0.14" />
      <circle cx="300" cy="300" r="5" fill="currentColor" opacity="0.15" />
      {/* Three blades with airfoil cross-sections */}
      {[0, 120, 240].map(deg => {
        const a = deg * Math.PI / 180;
        const tipX = 300 + 260 * Math.cos(a);
        const tipY = 300 + 260 * Math.sin(a);
        const perpA = a + Math.PI / 2;
        return (
          <g key={deg}>
            {/* Blade centerline */}
            <line x1={300 + 30 * Math.cos(a)} y1={300 + 30 * Math.sin(a)} x2={tipX} y2={tipY} stroke="currentColor" strokeWidth="0.6" opacity="0.14" />
            {/* Airfoil cross-sections at stations along blade */}
            {[80, 130, 180, 230].map(r => {
              const px = 300 + r * Math.cos(a);
              const py = 300 + r * Math.sin(a);
              const chordHalf = 8 + (1 - r / 260) * 14;
              // Asymmetric airfoil shape
              const le = `${px + chordHalf * Math.cos(perpA)},${py + chordHalf * Math.sin(perpA)}`;
              const te = `${px - chordHalf * 0.7 * Math.cos(perpA)},${py - chordHalf * 0.7 * Math.sin(perpA)}`;
              const camber = 3;
              const cpx = px + camber * Math.cos(a);
              const cpy = py + camber * Math.sin(a);
              return <path key={r} d={`M${le} Q${cpx},${cpy} ${te}`} stroke="currentColor" strokeWidth="0.4" opacity="0.08" fill="none" />;
            })}
            {/* Pitch angle arc at 75% station */}
            {(() => {
              const r = 195;
              const px = 300 + r * Math.cos(a);
              const py = 300 + r * Math.sin(a);
              const arcR = 18;
              return <path d={`M${px + arcR * Math.cos(perpA)},${py + arcR * Math.sin(perpA)} A${arcR},${arcR} 0 0,0 ${px + arcR * Math.cos(a + 0.3)},${py + arcR * Math.sin(a + 0.3)}`} stroke="currentColor" strokeWidth="0.3" opacity="0.06" fill="none" />;
            })()}
          </g>
        );
      })}
      {/* Tip path circle */}
      <circle cx="300" cy="300" r="262" stroke="currentColor" strokeWidth="0.5" opacity="0.06" strokeDasharray="8 6" />
    </svg>
  );
}

function W27_AeronauticalChart() {
  return (
    <svg viewBox="0 0 600 600" fill="none" xmlns="http://www.w3.org/2000/svg">
      {/* Airspace rings — Class D around an aerodrome */}
      <circle cx="250" cy="280" r="80" stroke="currentColor" strokeWidth="0.6" opacity="0.12" strokeDasharray="8 3" />
      <circle cx="250" cy="280" r="140" stroke="currentColor" strokeWidth="0.4" opacity="0.08" strokeDasharray="6 4" />
      {/* Aerodrome symbol */}
      <circle cx="250" cy="280" r="5" fill="currentColor" opacity="0.14" />
      <line x1="240" y1="280" x2="260" y2="280" stroke="currentColor" strokeWidth="0.5" opacity="0.12" />
      <line x1="250" y1="270" x2="250" y2="290" stroke="currentColor" strokeWidth="0.5" opacity="0.12" />
      {/* Runway symbol */}
      <line x1="244" y1="274" x2="256" y2="286" stroke="currentColor" strokeWidth="1.5" opacity="0.1" />
      {/* Second airspace — TMA */}
      <path d="M120,160 L380,120 L420,200 L400,350 L200,380 L100,300 Z" stroke="currentColor" strokeWidth="0.5" opacity="0.08" fill="none" strokeDasharray="10 4" />
      {/* Airways — dashed V-routes */}
      <line x1="60" y1="450" x2="250" y2="280" stroke="currentColor" strokeWidth="0.4" opacity="0.08" strokeDasharray="12 6" />
      <line x1="250" y1="280" x2="500" y2="180" stroke="currentColor" strokeWidth="0.4" opacity="0.08" strokeDasharray="12 6" />
      <line x1="250" y1="280" x2="400" y2="500" stroke="currentColor" strokeWidth="0.4" opacity="0.08" strokeDasharray="12 6" />
      {/* VOR waypoints on airways */}
      {[[145, 370], [380, 225], [340, 400]].map(([x, y], i) => (
        <g key={i}>
          <polygon points={`${x},${y - 6} ${x + 5},${y + 3} ${x - 5},${y + 3}`} stroke="currentColor" strokeWidth="0.4" opacity="0.1" fill="none" />
          <circle cx={x} cy={y} r="2" fill="currentColor" opacity="0.1" />
        </g>
      ))}
      {/* Airway labels */}
      <text x="170" y="345" fill="currentColor" opacity="0.06" fontSize="7" fontFamily="'Share Tech Mono', monospace" transform="rotate(-40 170 345)">V16</text>
      <text x="370" y="248" fill="currentColor" opacity="0.06" fontSize="7" fontFamily="'Share Tech Mono', monospace" transform="rotate(-15 370 248)">V25</text>
      {/* Altitude labels */}
      <text x="252" y="268" fill="currentColor" opacity="0.06" fontSize="6" fontFamily="'Share Tech Mono', monospace">EGLD</text>
      {/* Terrain spot height */}
      <text x="460" y="380" fill="currentColor" opacity="0.05" fontSize="6" fontFamily="'Share Tech Mono', monospace">+620</text>
      <circle cx="454" cy="378" r="1.5" fill="currentColor" opacity="0.06" />
      {/* Lat/lon grid */}
      {Array.from({ length: 5 }, (_, i) => (
        <line key={`h${i}`} x1="40" y1={100 + i * 110} x2="560" y2={100 + i * 110} stroke="currentColor" strokeWidth="0.15" opacity="0.04" />
      ))}
      {Array.from({ length: 5 }, (_, i) => (
        <line key={`v${i}`} x1={100 + i * 110} y1="40" x2={100 + i * 110} y2="560" stroke="currentColor" strokeWidth="0.15" opacity="0.04" />
      ))}
    </svg>
  );
}

function W28_HorizonScanner() {
  return (
    <svg viewBox="0 0 600 600" fill="none" xmlns="http://www.w3.org/2000/svg">
      {/* Panoramic terrain silhouette — 360 degree view compressed into strip */}
      {/* Upper altitude band lines */}
      {[180, 220, 260, 300].map(y => (
        <line key={y} x1="40" y1={y} x2="560" y2={y} stroke="currentColor" strokeWidth="0.2" opacity="0.04" />
      ))}
      {/* Terrain profile — mountain silhouette */}
      <path d="M40,340 L60,335 L80,330 L100,310 L120,295 L140,270 L155,250 L170,235 L185,240 L200,260 L215,270 L230,265 L250,250 L265,230 L280,210 L295,195 L310,185 L320,190 L335,210 L350,235 L365,255 L380,260 L400,240 L415,225 L430,215 L445,230 L460,260 L475,280 L490,300 L505,310 L520,320 L540,330 L560,335" stroke="currentColor" strokeWidth="0.7" opacity="0.16" fill="none" />
      {/* Horizon reference line */}
      <line x1="40" y1="340" x2="560" y2="340" stroke="currentColor" strokeWidth="0.5" opacity="0.12" />
      {/* Bearing marks along bottom */}
      {Array.from({ length: 37 }, (_, i) => {
        const x = 40 + i * (520 / 36);
        const isMajor = i % 9 === 0;
        const isMid = i % 3 === 0;
        return <line key={i} x1={x} y1={340} x2={x} y2={isMajor ? 355 : isMid ? 350 : 346} stroke="currentColor" strokeWidth={isMajor ? '0.5' : '0.2'} opacity={isMajor ? '0.12' : '0.06'} />;
      })}
      {/* Cardinal bearing labels */}
      {['N', 'E', 'S', 'W', 'N'].map((label, i) => (
        <text key={i} x={40 + i * 130} y={370} textAnchor="middle" fill="currentColor" opacity="0.08" fontSize="9" fontFamily="'Share Tech Mono', monospace">{label}</text>
      ))}
      {/* Peak labels */}
      <text x="310" y="178" textAnchor="middle" fill="currentColor" opacity="0.06" fontSize="6" fontFamily="'Share Tech Mono', monospace">4810m</text>
      <text x="155" y="228" textAnchor="middle" fill="currentColor" opacity="0.06" fontSize="6" fontFamily="'Share Tech Mono', monospace">3642m</text>
      {/* Altitude scale on right */}
      {[0, 2000, 4000].map((alt, i) => (
        <text key={alt} x="572" y={340 - i * 55} fill="currentColor" opacity="0.05" fontSize="6" fontFamily="'Share Tech Mono', monospace" textAnchor="start">{alt}m</text>
      ))}
      {/* Frame */}
      <rect x="40" y="170" width="520" height="210" rx="2" stroke="currentColor" strokeWidth="0.4" opacity="0.06" />
    </svg>
  );
}

function W29_GPSSatelliteConstellation() {
  return (
    <svg viewBox="0 0 600 600" fill="none" xmlns="http://www.w3.org/2000/svg">
      {/* Earth */}
      <circle cx="300" cy="300" r="100" stroke="currentColor" strokeWidth="0.8" opacity="0.14" />
      <circle cx="300" cy="300" r="95" stroke="currentColor" strokeWidth="0.2" opacity="0.05" />
      {/* Orbital planes — 6 planes tilted at different angles */}
      {[0, 30, 60, 90, 120, 150].map(deg => (
        <ellipse key={deg} cx="300" cy="300" rx="260" ry="70" stroke="currentColor" strokeWidth="0.35" opacity="0.07" transform={`rotate(${deg} 300 300)`} />
      ))}
      {/* Satellites on orbital paths */}
      {[
        [260, 0], [260, 30], [260, 60], [260, 90], [260, 120], [260, 150],
        [260, 15], [260, 45], [260, 75], [260, 105], [260, 135], [260, 165],
      ].map(([r, planeDeg], i) => {
        const planeA = planeDeg * Math.PI / 180;
        const satPos = (i * 47 + 20) * Math.PI / 180; // distribute around orbit
        // Simplified: place along the tilted ellipse
        const x = 300 + r * Math.cos(satPos) * Math.cos(planeA) - 70 * Math.sin(satPos) * Math.sin(planeA);
        const y = 300 + r * Math.cos(satPos) * Math.sin(planeA) + 70 * Math.sin(satPos) * Math.cos(planeA);
        return (
          <g key={i}>
            <rect x={x - 4} y={y - 3} width="8" height="6" rx="1" stroke="currentColor" strokeWidth="0.3" opacity="0.1" fill="none" />
            {/* Solar panels */}
            <line x1={x - 8} y1={y} x2={x - 4} y2={y} stroke="currentColor" strokeWidth="0.3" opacity="0.08" />
            <line x1={x + 4} y1={y} x2={x + 8} y2={y} stroke="currentColor" strokeWidth="0.3" opacity="0.08" />
          </g>
        );
      })}
      {/* Signal lines from visible satellites to ground */}
      {[[200, 150], [420, 180], [350, 440]].map(([sx, sy], i) => (
        <line key={i} x1={sx} y1={sy} x2="300" y2="300" stroke="currentColor" strokeWidth="0.2" opacity="0.05" strokeDasharray="4 3" />
      ))}
      {/* Ground station marker */}
      <circle cx="300" cy="300" r="4" fill="currentColor" opacity="0.12" />
    </svg>
  );
}

function W30_IceCrystal() {
  return (
    <svg viewBox="0 0 600 600" fill="none" xmlns="http://www.w3.org/2000/svg">
      {/* Hexagonal snowflake — 6-fold symmetry */}
      {/* Main branches */}
      {Array.from({ length: 6 }, (_, i) => {
        const a = (i * 60 - 90) * Math.PI / 180;
        const tipX = 300 + 250 * Math.cos(a);
        const tipY = 300 + 250 * Math.sin(a);
        const perpA = a + Math.PI / 2;
        return (
          <g key={i}>
            {/* Main branch */}
            <line x1="300" y1="300" x2={tipX} y2={tipY} stroke="currentColor" strokeWidth="0.7" opacity="0.15" />
            {/* Side dendrites */}
            {[60, 110, 160, 200].map(r => {
              const px = 300 + r * Math.cos(a);
              const py = 300 + r * Math.sin(a);
              const dLen = (250 - r) * 0.45;
              return (
                <g key={r}>
                  <line x1={px} y1={py} x2={px + dLen * Math.cos(a + Math.PI / 3)} y2={py + dLen * Math.sin(a + Math.PI / 3)} stroke="currentColor" strokeWidth="0.4" opacity="0.09" />
                  <line x1={px} y1={py} x2={px + dLen * Math.cos(a - Math.PI / 3)} y2={py + dLen * Math.sin(a - Math.PI / 3)} stroke="currentColor" strokeWidth="0.4" opacity="0.09" />
                </g>
              );
            })}
          </g>
        );
      })}
      {/* Central hexagon */}
      <polygon points={Array.from({ length: 6 }, (_, i) => {
        const a = (i * 60 - 90) * Math.PI / 180;
        return `${300 + 30 * Math.cos(a)},${300 + 30 * Math.sin(a)}`;
      }).join(' ')} stroke="currentColor" strokeWidth="0.5" opacity="0.12" fill="none" />
      {/* Outer hexagon hint */}
      <polygon points={Array.from({ length: 6 }, (_, i) => {
        const a = (i * 60 - 60) * Math.PI / 180;
        return `${300 + 250 * Math.cos(a)},${300 + 250 * Math.sin(a)}`;
      }).join(' ')} stroke="currentColor" strokeWidth="0.25" opacity="0.05" fill="none" />
      <circle cx="300" cy="300" r="3" fill="currentColor" opacity="0.14" />
    </svg>
  );
}

function W31_EngineGaugesCluster() {
  return (
    <svg viewBox="0 0 600 600" fill="none" xmlns="http://www.w3.org/2000/svg">
      {/* Three circular gauges in a cluster */}
      {[
        { cx: 180, cy: 260, label: 'RPM', value: 65, unit: '%' },
        { cx: 420, cy: 260, label: 'CHT', value: 45, unit: '°C' },
        { cx: 300, cy: 430, label: 'OIL', value: 70, unit: 'PSI' },
      ].map(({ cx: gx, cy: gy, label, value, unit }, gi) => {
        const needleA = (210 + value * 2.4) * Math.PI / 180;
        return (
          <g key={gi}>
            {/* Bezel */}
            <circle cx={gx} cy={gy} r="120" stroke="currentColor" strokeWidth="0.8" opacity="0.14" />
            <circle cx={gx} cy={gy} r="115" stroke="currentColor" strokeWidth="0.2" opacity="0.05" />
            {/* Tick marks */}
            {Array.from({ length: 11 }, (_, i) => {
              const a = (210 + i * 24) * Math.PI / 180;
              const isMajor = i % 2 === 0;
              const inner = isMajor ? 92 : 100;
              return <line key={i} x1={gx + inner * Math.cos(a)} y1={gy + inner * Math.sin(a)} x2={gx + 110 * Math.cos(a)} y2={gy + 110 * Math.sin(a)} stroke="currentColor" strokeWidth={isMajor ? '0.5' : '0.25'} opacity={isMajor ? '0.12' : '0.06'} />;
            })}
            {/* Needle */}
            <line x1={gx} y1={gy} x2={gx + 85 * Math.cos(needleA)} y2={gy + 85 * Math.sin(needleA)} stroke="currentColor" strokeWidth="0.7" opacity="0.18" />
            {/* Hub */}
            <circle cx={gx} cy={gy} r="5" stroke="currentColor" strokeWidth="0.4" opacity="0.1" />
            <circle cx={gx} cy={gy} r="1.5" fill="currentColor" opacity="0.15" />
            {/* Label */}
            <text x={gx} y={gy + 40} textAnchor="middle" fill="currentColor" opacity="0.08" fontSize="8" fontFamily="'Share Tech Mono', monospace">{label}</text>
          </g>
        );
      })}
    </svg>
  );
}

function W32_PendulumCompass() {
  return (
    <svg viewBox="0 0 600 600" fill="none" xmlns="http://www.w3.org/2000/svg">
      {/* Compass bowl */}
      <circle cx="300" cy="300" r="270" stroke="currentColor" strokeWidth="1.2" opacity="0.16" />
      <circle cx="300" cy="300" r="260" stroke="currentColor" strokeWidth="0.5" opacity="0.08" />
      {/* Compass card — rotating disc with headings */}
      <circle cx="300" cy="300" r="230" stroke="currentColor" strokeWidth="0.6" opacity="0.1" />
      {/* Degree marks every 5 degrees */}
      {Array.from({ length: 72 }, (_, i) => {
        const deg = i * 5;
        const a = (deg - 90) * Math.PI / 180;
        const isMajor = deg % 30 === 0;
        const isMid = deg % 10 === 0;
        const inner = isMajor ? 210 : isMid ? 218 : 224;
        return <line key={i} x1={300 + inner * Math.cos(a)} y1={300 + inner * Math.sin(a)} x2={300 + 228 * Math.cos(a)} y2={300 + 228 * Math.sin(a)} stroke="currentColor" strokeWidth={isMajor ? '0.5' : '0.2'} opacity={isMajor ? '0.12' : '0.05'} />;
      })}
      {/* Cardinal/intercardinal headings on the card */}
      {[
        { label: 'N', deg: 0 }, { label: '3', deg: 30 },
        { label: '6', deg: 60 }, { label: 'E', deg: 90 },
        { label: '12', deg: 120 }, { label: '15', deg: 150 },
        { label: 'S', deg: 180 }, { label: '21', deg: 210 },
        { label: '24', deg: 240 }, { label: 'W', deg: 270 },
        { label: '30', deg: 300 }, { label: '33', deg: 330 },
      ].map(({ label, deg }) => {
        const a = (deg - 90) * Math.PI / 180;
        return <text key={deg} x={300 + 195 * Math.cos(a)} y={300 + 195 * Math.sin(a)} textAnchor="middle" dominantBaseline="central" fill="currentColor" opacity={label.length === 1 ? 0.12 : 0.07} fontSize={label.length === 1 ? '12' : '9'} fontFamily="'Share Tech Mono', monospace">{label}</text>;
      })}
      {/* Lubber line — fixed reference at top */}
      <line x1="300" y1="30" x2="300" y2="75" stroke="currentColor" strokeWidth="1" opacity="0.2" />
      <line x1="294" y1="75" x2="306" y2="75" stroke="currentColor" strokeWidth="0.5" opacity="0.12" />
      {/* Pivot */}
      <circle cx="300" cy="300" r="4" fill="currentColor" opacity="0.12" />
      {/* Float line */}
      <line x1="250" y1="300" x2="350" y2="300" stroke="currentColor" strokeWidth="0.3" opacity="0.06" />
    </svg>
  );
}

function W33_TurbineBladeFan() {
  return (
    <svg viewBox="0 0 600 600" fill="none" xmlns="http://www.w3.org/2000/svg">
      {/* Engine casing */}
      <circle cx="300" cy="300" r="275" stroke="currentColor" strokeWidth="1.2" opacity="0.16" />
      <circle cx="300" cy="300" r="268" stroke="currentColor" strokeWidth="0.3" opacity="0.06" />
      {/* Hub */}
      <circle cx="300" cy="300" r="70" stroke="currentColor" strokeWidth="0.8" opacity="0.14" />
      <circle cx="300" cy="300" r="65" stroke="currentColor" strokeWidth="0.3" opacity="0.06" />
      {/* Turbine blades — curved, closely spaced */}
      {Array.from({ length: 24 }, (_, i) => {
        const a = i * 15 * Math.PI / 180;
        const innerR = 72;
        const outerR = 265;
        const sx = 300 + innerR * Math.cos(a);
        const sy = 300 + innerR * Math.sin(a);
        // Curve the blade — control point offset from straight line
        const midR = (innerR + outerR) / 2;
        const curveOffset = 0.12; // radians
        const cpx = 300 + midR * Math.cos(a + curveOffset);
        const cpy = 300 + midR * Math.sin(a + curveOffset);
        const ex = 300 + outerR * Math.cos(a + curveOffset * 0.5);
        const ey = 300 + outerR * Math.sin(a + curveOffset * 0.5);
        return <path key={i} d={`M${sx},${sy} Q${cpx},${cpy} ${ex},${ey}`} stroke="currentColor" strokeWidth="0.5" opacity="0.12" fill="none" />;
      })}
      {/* Inner guide vanes */}
      {Array.from({ length: 16 }, (_, i) => {
        const a = (i * 22.5 + 5) * Math.PI / 180;
        const sx = 300 + 35 * Math.cos(a);
        const sy = 300 + 35 * Math.sin(a);
        const ex = 300 + 68 * Math.cos(a - 0.08);
        const ey = 300 + 68 * Math.sin(a - 0.08);
        return <line key={i} x1={sx} y1={sy} x2={ex} y2={ey} stroke="currentColor" strokeWidth="0.3" opacity="0.07" />;
      })}
      {/* Center shaft */}
      <circle cx="300" cy="300" r="12" stroke="currentColor" strokeWidth="0.5" opacity="0.1" />
      <circle cx="300" cy="300" r="3" fill="currentColor" opacity="0.15" />
    </svg>
  );
}

function W34_AuroraBorealis() {
  return (
    <svg viewBox="0 0 600 600" fill="none" xmlns="http://www.w3.org/2000/svg">
      {/* Magnetic field lines arching from horizon */}
      {Array.from({ length: 9 }, (_, i) => {
        const x = 100 + i * 50;
        const height = 120 + Math.sin(i * 0.7 + 1) * 80;
        const waver = Math.sin(i * 1.3) * 20;
        return <path key={`f${i}`} d={`M${x},580 Q${x + waver},${580 - height} ${x + 15},${580 - height * 1.6}`} stroke="currentColor" strokeWidth="0.3" opacity={0.04 + Math.sin(i * 0.9) * 0.03} fill="none" />;
      })}
      {/* Aurora curtain rays — vertical streaks from top */}
      {Array.from({ length: 30 }, (_, i) => {
        const x = 60 + i * 16 + Math.sin(i * 0.8) * 8;
        const top = 40 + Math.sin(i * 0.5 + 2) * 30;
        const bottom = 250 + Math.sin(i * 0.7) * 80 + Math.cos(i * 1.1) * 40;
        const opacity = 0.04 + Math.sin(i * 0.6 + 1) * 0.06;
        return <line key={i} x1={x} y1={top} x2={x + Math.sin(i) * 3} y2={bottom} stroke="currentColor" strokeWidth={0.3 + Math.sin(i * 0.4) * 0.3} opacity={Math.max(0.02, opacity)} />;
      })}
      {/* Aurora arc / band outline */}
      <path d="M40,280 Q150,180 300,160 Q450,140 560,200" stroke="currentColor" strokeWidth="0.5" opacity="0.1" fill="none" />
      <path d="M40,320 Q150,240 300,220 Q450,200 560,250" stroke="currentColor" strokeWidth="0.4" opacity="0.07" fill="none" />
      {/* Horizon terrain silhouette */}
      <path d="M0,480 Q50,470 100,465 Q150,460 180,450 Q220,445 260,448 Q300,450 340,455 Q380,460 420,458 Q460,455 500,460 Q540,465 580,470 L600,480 L600,600 L0,600 Z" stroke="currentColor" strokeWidth="0.5" opacity="0.1" fill="currentColor" fillOpacity="0.02" />
      {/* Stars in sky */}
      {[[120, 80, 1.5], [250, 60, 2], [400, 90, 1.8], [500, 50, 1.5], [70, 130, 1.2], [350, 110, 1], [480, 140, 1.5], [180, 110, 1]].map(([cx, cy, r], i) => (
        <circle key={i} cx={cx} cy={cy} r={r} fill="currentColor" opacity={0.06 + r * 0.03} />
      ))}
    </svg>
  );
}

function W35_MercatorGrid() {
  return (
    <svg viewBox="0 0 600 600" fill="none" xmlns="http://www.w3.org/2000/svg">
      {/* Map border */}
      <rect x="40" y="60" width="520" height="480" stroke="currentColor" strokeWidth="0.8" opacity="0.12" />
      {/* Latitude lines */}
      {Array.from({ length: 9 }, (_, i) => {
        const y = 60 + (i + 1) * 48;
        return <line key={`lat${i}`} x1="40" y1={y} x2="560" y2={y} stroke="currentColor" strokeWidth="0.25" opacity="0.06" />;
      })}
      {/* Longitude lines */}
      {Array.from({ length: 11 }, (_, i) => {
        const x = 40 + (i + 1) * (520 / 12);
        return <line key={`lon${i}`} x1={x} y1="60" x2={x} y2="540" stroke="currentColor" strokeWidth="0.25" opacity="0.06" />;
      })}
      {/* Lat labels */}
      {[60, 40, 20, 0, -20, -40, -60].map((lat, i) => (
        <text key={lat} x="34" y={108 + i * 65} textAnchor="end" fill="currentColor" opacity="0.05" fontSize="6" fontFamily="'Share Tech Mono', monospace">{Math.abs(lat)}°{lat >= 0 ? 'N' : 'S'}</text>
      ))}
      {/* Rhumb line tracks — straight lines on Mercator */}
      {/* Track 1: UK to Morocco */}
      <line x1="280" y1="155" x2="265" y2="280" stroke="currentColor" strokeWidth="0.6" opacity="0.12" strokeDasharray="8 4" />
      {/* Track 2: UK to Iceland */}
      <line x1="280" y1="155" x2="235" y2="100" stroke="currentColor" strokeWidth="0.6" opacity="0.12" strokeDasharray="8 4" />
      {/* Track 3: UK to Norway */}
      <line x1="280" y1="155" x2="310" y2="110" stroke="currentColor" strokeWidth="0.6" opacity="0.12" strokeDasharray="8 4" />
      {/* Track 4: UK eastward to Alps */}
      <line x1="280" y1="155" x2="310" y2="170" stroke="currentColor" strokeWidth="0.6" opacity="0.12" strokeDasharray="8 4" />
      {/* Waypoints */}
      {[[280, 155], [265, 280], [235, 100], [310, 110], [310, 170]].map(([x, y], i) => (
        <circle key={i} cx={x} cy={y} r="3" stroke="currentColor" strokeWidth="0.4" opacity="0.1" fill={i === 0 ? 'currentColor' : 'none'} fillOpacity="0.12" />
      ))}
      {/* Simplified continent outlines */}
      {/* Europe hint */}
      <path d="M270,140 Q290,135 310,145 L320,160 Q315,170 305,175 L290,172 Q275,165 270,155 Z" stroke="currentColor" strokeWidth="0.3" opacity="0.06" fill="none" />
      {/* Africa hint */}
      <path d="M260,270 Q280,265 295,275 Q310,295 305,330 Q290,360 270,355 Q255,340 250,310 Q252,285 260,270 Z" stroke="currentColor" strokeWidth="0.3" opacity="0.06" fill="none" />
    </svg>
  );
}

function W36_SonarDepthRing() {
  return (
    <svg viewBox="0 0 600 600" fill="none" xmlns="http://www.w3.org/2000/svg">
      {/* Bathymetric depth contours — irregular concentric rings */}
      <path d="M300,120 Q400,130 450,180 Q510,250 500,340 Q485,430 420,480 Q340,530 260,510 Q170,485 120,410 Q80,330 100,240 Q130,160 210,130 Q250,118 300,120 Z" stroke="currentColor" strokeWidth="0.7" opacity="0.14" fill="none" />
      <path d="M300,170 Q380,178 420,215 Q465,270 455,345 Q440,415 385,450 Q325,480 265,465 Q200,445 165,385 Q135,320 150,250 Q175,195 235,175 Q265,168 300,170 Z" stroke="currentColor" strokeWidth="0.55" opacity="0.11" fill="none" />
      <path d="M300,215 Q360,220 390,250 Q425,290 415,350 Q400,400 355,425 Q310,440 270,430 Q230,415 210,370 Q195,325 205,275 Q220,235 260,220 Q280,213 300,215 Z" stroke="currentColor" strokeWidth="0.45" opacity="0.09" fill="none" />
      <path d="M300,260 Q340,262 360,285 Q385,315 378,355 Q368,385 340,400 Q310,410 280,402 Q255,390 245,360 Q238,330 248,300 Q262,272 285,263 Q293,260 300,260 Z" stroke="currentColor" strokeWidth="0.35" opacity="0.07" fill="none" />
      <path d="M305,300 Q325,302 335,320 Q345,340 335,358 Q322,370 305,372 Q288,370 278,355 Q270,338 280,320 Q290,305 305,300 Z" stroke="currentColor" strokeWidth="0.3" opacity="0.06" fill="none" />
      {/* Deepest point marker */}
      <circle cx="310" cy="340" r="3" fill="currentColor" opacity="0.14" />
      <text x="310" y="330" textAnchor="middle" fill="currentColor" opacity="0.07" fontSize="7" fontFamily="'Share Tech Mono', monospace">-4820m</text>
      {/* Depth labels */}
      <text x="460" y="185" fill="currentColor" opacity="0.05" fontSize="6" fontFamily="'Share Tech Mono', monospace">-1000m</text>
      <text x="430" y="255" fill="currentColor" opacity="0.05" fontSize="6" fontFamily="'Share Tech Mono', monospace">-2000m</text>
      <text x="400" y="310" fill="currentColor" opacity="0.05" fontSize="6" fontFamily="'Share Tech Mono', monospace">-3000m</text>
      {/* Ship route crossing */}
      <path d="M80,400 Q200,370 350,380 Q450,390 540,350" stroke="currentColor" strokeWidth="0.4" opacity="0.08" fill="none" strokeDasharray="6 4" />
      <text x="310" y="395" textAnchor="middle" fill="currentColor" opacity="0.05" fontSize="6" fontFamily="'Share Tech Mono', monospace">CROSSING</text>
    </svg>
  );
}

function W37_ParachuteCanopy() {
  return (
    <svg viewBox="0 0 600 600" fill="none" xmlns="http://www.w3.org/2000/svg">
      {/* Canopy dome */}
      <path d="M100,320 Q100,100 300,80 Q500,100 500,320" stroke="currentColor" strokeWidth="0.8" opacity="0.16" fill="none" />
      {/* Gore panel seams — radial lines from apex */}
      {Array.from({ length: 13 }, (_, i) => {
        const t = i / 12;
        const x = 100 + t * 400;
        const bottomY = 320;
        // Parabolic curve from apex
        const cpX = 300 + (x - 300) * 0.3;
        const cpY = 80 + Math.abs(x - 300) * 0.15;
        return <path key={i} d={`M300,80 Q${cpX},${cpY} ${x},${bottomY}`} stroke="currentColor" strokeWidth="0.35" opacity="0.08" fill="none" />;
      })}
      {/* Horizontal reinforcement bands */}
      {[140, 200, 260].map(baseY => {
        const spread = (baseY - 80) / (320 - 80);
        const hw = 200 * spread;
        return <path key={baseY} d={`M${300 - hw},${baseY} Q300,${baseY - 15 * (1 - spread)} ${300 + hw},${baseY}`} stroke="currentColor" strokeWidth="0.3" opacity="0.06" fill="none" />;
      })}
      {/* Suspension lines from canopy edge to harness */}
      {Array.from({ length: 13 }, (_, i) => {
        const t = i / 12;
        const topX = 100 + t * 400;
        return <line key={i} x1={topX} y1="320" x2="300" y2="520" stroke="currentColor" strokeWidth="0.25" opacity="0.06" />;
      })}
      {/* Riser groups */}
      <line x1="220" y1="440" x2="280" y2="510" stroke="currentColor" strokeWidth="0.4" opacity="0.08" />
      <line x1="380" y1="440" x2="320" y2="510" stroke="currentColor" strokeWidth="0.4" opacity="0.08" />
      {/* Harness point */}
      <circle cx="300" cy="520" r="4" stroke="currentColor" strokeWidth="0.5" opacity="0.12" fill="none" />
      <circle cx="300" cy="520" r="1.5" fill="currentColor" opacity="0.14" />
      {/* Apex vent */}
      <circle cx="300" cy="82" r="8" stroke="currentColor" strokeWidth="0.3" opacity="0.08" fill="none" />
    </svg>
  );
}

function W38_FlightEnvelope() {
  return (
    <svg viewBox="0 0 600 600" fill="none" xmlns="http://www.w3.org/2000/svg">
      {/* V-n diagram: Airspeed (x) vs Load Factor (y) */}
      {/* Axes */}
      <line x1="80" y1="400" x2="550" y2="400" stroke="currentColor" strokeWidth="0.6" opacity="0.14" />
      <line x1="80" y1="80" x2="80" y2="500" stroke="currentColor" strokeWidth="0.6" opacity="0.14" />
      {/* Axis labels */}
      <text x="310" y="530" textAnchor="middle" fill="currentColor" opacity="0.08" fontSize="9" fontFamily="'Share Tech Mono', monospace">AIRSPEED (KIAS)</text>
      <text x="40" y="300" textAnchor="middle" fill="currentColor" opacity="0.08" fontSize="9" fontFamily="'Share Tech Mono', monospace" transform="rotate(-90 40 300)">LOAD FACTOR (g)</text>
      {/* Grid lines */}
      {[1, 2, 3, 4, 5].map(i => {
        const x = 80 + i * 90;
        return <line key={`v${i}`} x1={x} y1="80" x2={x} y2="500" stroke="currentColor" strokeWidth="0.2" opacity="0.04" />;
      })}
      {[-1, 0, 1, 2, 3].map((g, i) => {
        const y = 400 - g * 80;
        return (
          <g key={`g${i}`}>
            <line x1="80" y1={y} x2="550" y2={y} stroke="currentColor" strokeWidth={g === 0 ? '0.4' : '0.2'} opacity={g === 0 ? '0.08' : '0.04'} />
            <text x="72" y={y + 3} textAnchor="end" fill="currentColor" opacity="0.06" fontSize="7" fontFamily="'Share Tech Mono', monospace">{g}g</text>
          </g>
        );
      })}
      {/* Speed labels */}
      {['Vs', 'Va', 'Vno', 'Vne'].map((label, i) => {
        const x = 80 + [100, 220, 350, 450][i];
        return <text key={label} x={x} y="415" textAnchor="middle" fill="currentColor" opacity="0.06" fontSize="7" fontFamily="'Share Tech Mono', monospace">{label}</text>;
      })}
      {/* Flight envelope boundary */}
      {/* Positive manoeuvre boundary (stall curve up, then flat, then Vne cutoff) */}
      <path d="M180,400 Q220,280 300,160 L440,160 L530,160 L530,400" stroke="currentColor" strokeWidth="0.7" opacity="0.14" fill="none" />
      {/* Negative manoeuvre boundary */}
      <path d="M220,400 Q260,440 350,480 L530,480 L530,400" stroke="currentColor" strokeWidth="0.5" opacity="0.1" fill="none" />
      {/* Gust envelope (dashed) */}
      <path d="M180,400 Q230,260 350,140" stroke="currentColor" strokeWidth="0.4" opacity="0.07" fill="none" strokeDasharray="6 4" />
      <path d="M350,140 L530,160" stroke="currentColor" strokeWidth="0.4" opacity="0.07" fill="none" strokeDasharray="6 4" />
      {/* Vne red line */}
      <line x1="530" y1="80" x2="530" y2="500" stroke="currentColor" strokeWidth="0.8" opacity="0.1" />
      {/* Limit load factor label */}
      <text x="440" y="152" textAnchor="middle" fill="currentColor" opacity="0.06" fontSize="7" fontFamily="'Share Tech Mono', monospace">+3.8g LIMIT</text>
      <text x="440" y="492" textAnchor="middle" fill="currentColor" opacity="0.06" fontSize="7" fontFamily="'Share Tech Mono', monospace">-1.52g LIMIT</text>
    </svg>
  );
}

function W39_Sundial() {
  return (
    <svg viewBox="0 0 600 600" fill="none" xmlns="http://www.w3.org/2000/svg">
      {/* Dial plate — elliptical (perspective view) */}
      <ellipse cx="300" cy="350" rx="260" ry="180" stroke="currentColor" strokeWidth="0.8" opacity="0.14" />
      <ellipse cx="300" cy="350" rx="255" ry="176" stroke="currentColor" strokeWidth="0.25" opacity="0.05" />
      {/* Hour lines radiating from gnomon base */}
      {Array.from({ length: 13 }, (_, i) => {
        const hour = i + 6; // 6 AM to 6 PM
        // Spread hour lines across the ellipse
        const angle = ((hour - 12) / 6) * 70; // degrees from center
        const a = angle * Math.PI / 180;
        const edgeX = 300 + 250 * Math.sin(a);
        const edgeY = 350 - 170 * Math.cos(a) * 0.5;
        return (
          <g key={i}>
            <line x1="300" y1="350" x2={edgeX} y2={edgeY} stroke="currentColor" strokeWidth={hour === 12 ? '0.6' : '0.3'} opacity={hour === 12 ? '0.12' : '0.07'} />
            {/* Hour numeral */}
            <text x={300 + 220 * Math.sin(a)} y={350 - 150 * Math.cos(a) * 0.5} textAnchor="middle" dominantBaseline="central" fill="currentColor" opacity="0.06" fontSize="8" fontFamily="'Share Tech Mono', monospace">{hour > 12 ? hour - 12 : hour}</text>
          </g>
        );
      })}
      {/* Gnomon (shadow caster) — triangular projection */}
      <path d="M300,350 L300,140 L310,350" stroke="currentColor" strokeWidth="0.6" opacity="0.14" fill="none" />
      {/* Gnomon shadow */}
      <line x1="300" y1="350" x2="180" y2="290" stroke="currentColor" strokeWidth="0.8" opacity="0.1" strokeDasharray="6 3" />
      {/* Roman numeral ring (subtle) */}
      {['VI', 'VII', 'VIII', 'IX', 'X', 'XI', 'XII', 'I', 'II', 'III', 'IV', 'V', 'VI'].map((num, i) => {
        const angle = ((i + 6 - 12) / 6) * 70;
        const a = angle * Math.PI / 180;
        return <text key={i} x={300 + 265 * Math.sin(a)} y={350 - 185 * Math.cos(a) * 0.5} textAnchor="middle" dominantBaseline="central" fill="currentColor" opacity="0.04" fontSize="6" fontFamily="'Playfair Display', serif">{num}</text>;
      })}
      {/* Equinox/solstice date curves */}
      <ellipse cx="300" cy="380" rx="180" ry="30" stroke="currentColor" strokeWidth="0.2" opacity="0.04" />
      <ellipse cx="300" cy="340" rx="160" ry="25" stroke="currentColor" strokeWidth="0.2" opacity="0.04" />
    </svg>
  );
}

function W40_PilotLogbook() {
  return (
    <svg viewBox="0 0 600 600" fill="none" xmlns="http://www.w3.org/2000/svg">
      {/* Page border */}
      <rect x="60" y="60" width="480" height="480" rx="3" stroke="currentColor" strokeWidth="0.6" opacity="0.1" />
      {/* Header */}
      <line x1="60" y1="100" x2="540" y2="100" stroke="currentColor" strokeWidth="0.5" opacity="0.12" />
      <text x="300" y="85" textAnchor="middle" fill="currentColor" opacity="0.08" fontSize="10" fontFamily="'Share Tech Mono', monospace">PILOT FLIGHT LOG</text>
      {/* Column headers */}
      {[
        { x: 90, label: 'DATE' }, { x: 160, label: 'TYPE' },
        { x: 230, label: 'REG' }, { x: 300, label: 'FROM' },
        { x: 360, label: 'TO' }, { x: 420, label: 'DUAL' },
        { x: 470, label: 'P1' }, { x: 520, label: 'RMK' },
      ].map(({ x, label }) => (
        <text key={label} x={x} y="118" textAnchor="middle" fill="currentColor" opacity="0.07" fontSize="6" fontFamily="'Share Tech Mono', monospace">{label}</text>
      ))}
      <line x1="60" y1="124" x2="540" y2="124" stroke="currentColor" strokeWidth="0.4" opacity="0.1" />
      {/* Column dividers */}
      {[125, 195, 265, 330, 390, 445, 495].map(x => (
        <line key={x} x1={x} y1="100" x2={x} y2="500" stroke="currentColor" strokeWidth="0.2" opacity="0.04" />
      ))}
      {/* Row lines with ghost entry marks */}
      {Array.from({ length: 10 }, (_, i) => {
        const y = 155 + i * 35;
        const hasEntry = i < 6;
        return (
          <g key={i}>
            <line x1="60" y1={y} x2="540" y2={y} stroke="currentColor" strokeWidth="0.2" opacity="0.05" />
            {hasEntry && (
              <>
                <line x1="75" y1={y - 15} x2="115" y2={y - 15} stroke="currentColor" strokeWidth="0.3" opacity="0.05" />
                <line x1="140" y1={y - 15} x2="178" y2={y - 15} stroke="currentColor" strokeWidth="0.3" opacity="0.05" />
                <line x1="210" y1={y - 15} x2="248" y2={y - 15} stroke="currentColor" strokeWidth="0.3" opacity="0.05" />
                <line x1="282" y1={y - 15} x2="316" y2={y - 15} stroke="currentColor" strokeWidth="0.3" opacity="0.05" />
                <line x1="342" y1={y - 15} x2="376" y2={y - 15} stroke="currentColor" strokeWidth="0.3" opacity="0.05" />
              </>
            )}
          </g>
        );
      })}
      {/* Page total line */}
      <line x1="60" y1="500" x2="540" y2="500" stroke="currentColor" strokeWidth="0.4" opacity="0.08" />
      <text x="370" y="518" textAnchor="middle" fill="currentColor" opacity="0.06" fontSize="7" fontFamily="'Share Tech Mono', monospace">TOTALS THIS PAGE</text>
      {/* Binding holes on left */}
      {[150, 300, 450].map(y => (
        <circle key={y} cx="48" cy={y} r="5" stroke="currentColor" strokeWidth="0.3" opacity="0.05" fill="none" />
      ))}
    </svg>
  );
}

/* ------------------------------------------------------------------ */
/*  Wireframe array                                                    */
/* ------------------------------------------------------------------ */
const wireframes = [
  W01_ClassicGlobe, W02_CompassRose, W03_RadarSweep, W04_AltimeterDial,
  W05_AttitudeIndicator, W06_HelicopterBlueprint, W07_RotorDisc, W08_TopographicContours,
  W09_WireframeMountains, W10_GreatCircleRoutes, W11_PolarProjection, W12_VORRose,
  W13_HUDOverlay, W14_AirspeedIndicator, W15_StarChart, W16_WindRose,
  W17_RunwayApproach, W18_FibonacciSpiral, W19_DotMatrixGlobe, W20_ExpeditionRoute,
  W21_Gyroscope, W22_TailRotorCrossSection, W23_BarometricPressure, W24_SextantSight,
  W25_FuelGauge, W26_PropellerGeometry, W27_AeronauticalChart, W28_HorizonScanner,
  W29_GPSSatelliteConstellation, W30_IceCrystal, W31_EngineGaugesCluster, W32_PendulumCompass,
  W33_TurbineBladeFan, W34_AuroraBorealis, W35_MercatorGrid, W36_SonarDepthRing,
  W37_ParachuteCanopy, W38_FlightEnvelope, W39_Sundial, W40_PilotLogbook,
];

/* ------------------------------------------------------------------ */
/*  Page component                                                     */
/* ------------------------------------------------------------------ */
export default function Wireframes() {
  const [active, setActive] = useState(0);

  const go = useCallback((dir) => {
    setActive(prev => {
      const next = prev + dir;
      if (next < 0) return wireframes.length - 1;
      if (next >= wireframes.length) return 0;
      return next;
    });
  }, []);

  useEffect(() => {
    const handler = (e) => {
      if (e.key === 'ArrowLeft') go(-1);
      if (e.key === 'ArrowRight') go(1);
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [go]);

  const ActiveWireframe = wireframes[active];
  const meta = wireframeMeta[active];

  return (
    <>
      <style>{`
        .wf-page {
          min-height: 100vh;
          background: #FAFAF8;
          color: #1a1a1a;
          display: flex;
          align-items: center;
          justify-content: center;
          position: relative;
          overflow: hidden;
          font-family: 'Inter', sans-serif;
        }

        .wf-page__canvas {
          position: relative;
          width: min(95vw, 800px);
          height: min(95vw, 800px);
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .wf-page__canvas svg {
          width: 100%;
          height: 100%;
          transition: opacity 0.4s ease;
        }

        .wf-page__label {
          position: absolute;
          top: 3rem;
          left: 50%;
          transform: translateX(-50%);
          text-align: center;
          z-index: 2;
        }

        .wf-page__label h1 {
          font-family: 'Playfair Display', serif;
          font-size: 1.4rem;
          font-weight: 400;
          letter-spacing: 0.04em;
          margin: 0;
          opacity: 0.7;
        }

        .wf-page__label p {
          font-family: 'Share Tech Mono', monospace;
          font-size: 0.7rem;
          letter-spacing: 0.12em;
          text-transform: uppercase;
          margin: 0.5rem 0 0;
          opacity: 0.35;
        }

        .wf-page__picker {
          position: fixed;
          bottom: 2rem;
          left: 50%;
          transform: translateX(-50%);
          display: flex;
          align-items: center;
          gap: 1rem;
          z-index: 9999;
          background: rgba(0,0,0,0.7);
          padding: 0.5rem 1.25rem;
          border-radius: 999px;
          backdrop-filter: blur(8px);
        }

        .wf-page__picker span {
          font-family: 'Share Tech Mono', monospace;
          font-size: 0.7rem;
          letter-spacing: 0.1em;
          color: rgba(255,255,255,0.5);
          white-space: nowrap;
        }

        .wf-page__picker button {
          background: rgba(255,255,255,0.1);
          border: 1px solid rgba(255,255,255,0.2);
          color: #fff;
          width: 32px;
          height: 32px;
          border-radius: 50%;
          cursor: pointer;
          font-size: 1.2rem;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: background 0.2s;
        }

        .wf-page__picker button:hover {
          background: rgba(255,255,255,0.2);
        }

        .wf-page__grid-btn {
          position: fixed;
          top: 1.5rem;
          right: 1.5rem;
          z-index: 9999;
          background: rgba(0,0,0,0.5);
          border: 1px solid rgba(255,255,255,0.15);
          color: rgba(255,255,255,0.7);
          padding: 0.4rem 0.8rem;
          border-radius: 6px;
          cursor: pointer;
          font-family: 'Share Tech Mono', monospace;
          font-size: 0.65rem;
          letter-spacing: 0.1em;
          backdrop-filter: blur(8px);
          transition: background 0.2s;
        }

        .wf-page__grid-btn:hover {
          background: rgba(0,0,0,0.7);
        }

        /* Grid view */
        .wf-grid {
          min-height: 100vh;
          background: #FAFAF8;
          color: #1a1a1a;
          padding: 4rem 2rem 6rem;
          font-family: 'Inter', sans-serif;
        }

        .wf-grid__header {
          text-align: center;
          margin-bottom: 3rem;
        }

        .wf-grid__header h1 {
          font-family: 'Playfair Display', serif;
          font-size: 2rem;
          font-weight: 400;
          letter-spacing: 0.04em;
          margin: 0;
          opacity: 0.7;
        }

        .wf-grid__header p {
          font-family: 'Share Tech Mono', monospace;
          font-size: 0.7rem;
          letter-spacing: 0.12em;
          text-transform: uppercase;
          margin: 0.75rem 0 0;
          opacity: 0.35;
        }

        .wf-grid__items {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(260px, 1fr));
          gap: 2rem;
          max-width: 1200px;
          margin: 0 auto;
        }

        .wf-grid__card {
          aspect-ratio: 1;
          border: 1px solid rgba(0,0,0,0.06);
          border-radius: 8px;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          padding: 1.5rem;
          cursor: pointer;
          transition: border-color 0.3s, box-shadow 0.3s;
          position: relative;
        }

        .wf-grid__card:hover {
          border-color: rgba(0,0,0,0.15);
          box-shadow: 0 4px 20px rgba(0,0,0,0.04);
        }

        .wf-grid__card svg {
          width: 85%;
          height: 85%;
        }

        .wf-grid__card-label {
          position: absolute;
          bottom: 0.75rem;
          left: 0;
          right: 0;
          text-align: center;
        }

        .wf-grid__card-label span {
          font-family: 'Share Tech Mono', monospace;
          font-size: 0.6rem;
          letter-spacing: 0.1em;
          text-transform: uppercase;
          opacity: 0.3;
        }

        .wf-grid__card-num {
          font-family: 'Share Tech Mono', monospace;
          font-size: 0.55rem;
          letter-spacing: 0.1em;
          opacity: 0.2;
          position: absolute;
          top: 0.6rem;
          left: 0.75rem;
        }
      `}</style>

      <GridOrSingle
        active={active}
        setActive={setActive}
        go={go}
        meta={meta}
        ActiveWireframe={ActiveWireframe}
      />
    </>
  );
}

function GridOrSingle({ active, setActive, go, meta, ActiveWireframe }) {
  const [showGrid, setShowGrid] = useState(false);

  if (showGrid) {
    return (
      <div className="wf-grid">
        <div className="wf-grid__header">
          <h1>Wireframe Library</h1>
          <p>40 procedural SVG wireframes &mdash; aviation &amp; adventure</p>
        </div>
        <div className="wf-grid__items">
          {wireframes.map((Wf, i) => (
            <div key={i} className="wf-grid__card" onClick={() => { setActive(i); setShowGrid(false); }}>
              <span className="wf-grid__card-num">{String(i + 1).padStart(2, '0')}</span>
              <Wf />
              <div className="wf-grid__card-label">
                <span>{wireframeMeta[i].name}</span>
              </div>
            </div>
          ))}
        </div>
        <button className="wf-page__grid-btn" onClick={() => setShowGrid(false)} style={{ position: 'fixed' }}>
          SINGLE VIEW
        </button>
      </div>
    );
  }

  return (
    <div className="wf-page">
      <div className="wf-page__label">
        <h1>{meta.name}</h1>
        <p>{meta.desc}</p>
      </div>
      <div className="wf-page__canvas">
        <ActiveWireframe />
      </div>
      <div className="wf-page__picker">
        <button onClick={() => go(-1)}>&larr;</button>
        <span>{String(active + 1).padStart(2, '0')} / {wireframes.length}</span>
        <button onClick={() => go(1)}>&rarr;</button>
      </div>
      <button className="wf-page__grid-btn" onClick={() => setShowGrid(true)}>
        GRID VIEW
      </button>
    </div>
  );
}

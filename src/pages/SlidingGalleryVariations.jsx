/**
 * Sliding Gallery Variations — 20 lifestyle-focused scroll-driven strip layouts
 * Theme: Luxury helicopter travel, arriving like Bond, freedom to fly anywhere
 * Route: /sales/sliding-gallery-variations
 */

import React, { useState, useEffect, useCallback, useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';

// ============================================================
// SHARED DATA — Aspirational destinations & lifestyle content
// ============================================================

const IMAGES = [
  '/assets/images/expeditions/antartica.jpg',
  '/assets/images/gallery/flying/flying-.jpg',
  '/assets/images/expeditions/channel.jpg',
  '/assets/images/facility/hq-aviation-robinsons.jpg',
  '/assets/images/expeditions/north-pole.jpg',
  '/assets/images/gallery/flying/foggy-evening-flying.jpg',
  '/assets/images/facility/main-sales-pic.jpg',
  '/assets/images/facility/busy-hangar.jpg',
  '/assets/images/new-aircraft/r88/rhc-r88-left-side-three-quarter-front-view-21797.jpg',
  '/assets/images/facility/hq-0696.jpg',
  '/assets/images/new-aircraft/r88/rhc-r88-atmospheric-effect-front-view-218022.jpg',
  '/assets/images/facility/hq-0345.jpg',
];

const DESTINATIONS = [
  { name: 'The Cotswolds', time: '1hr', type: 'destination' },
  { name: 'Goodwood Racecourse', time: '35min', type: 'destination' },
  { name: 'St Andrews Golf', time: '3.5hrs', type: 'destination' },
  { name: 'Le Touquet, France', time: '1hr', type: 'destination' },
  { name: 'Cowes, Isle of Wight', time: '45min', type: 'destination' },
  { name: 'Cheltenham Races', time: '50min', type: 'destination' },
  { name: 'Soho Farmhouse', time: '40min', type: 'destination' },
  { name: 'Padstow, Cornwall', time: '2.5hrs', type: 'destination' },
  { name: 'Lake District', time: '2hrs', type: 'destination' },
  { name: 'Scottish Highlands', time: '3hrs', type: 'destination' },
  { name: 'Blenheim Palace', time: '30min', type: 'destination' },
  { name: 'Channel Islands', time: '1.5hrs', type: 'destination' },
];

const STATEMENTS = [
  'Skip the M25',
  'Arrive in Style',
  'Land at the Door',
  'Your Schedule. Your Rules.',
  'Cotswolds Lunch. Home by 3.',
  'Be the Coolest Arrival',
  'No Queues. No Delays.',
  'Take the Sky',
  'Arrive Like Bond',
  'The Freedom to Fly',
  'Golf. Races. Castles.',
  'Fly Direct',
];

const LIFESTYLES = [
  'Saturday: Goodwood. Sunday: Le Touquet.',
  'Lunch in Padstow. Dinner in London.',
  'Tee off at St Andrews. Back for supper.',
  'Skip 4 hours of traffic. Fly in 40 minutes.',
  'Land at the racecourse. Not the car park.',
  'Your family. Your helicopter. Your weekend.',
  'They took the M4. You took the sky.',
  'The Cotswolds in an hour. Door to door.',
];

// ============================================================
// V1 — BOLD STATEMENTS (Oversized lifestyle text + images)
// ============================================================

const V1 = () => {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end start'] });
  const xL = useTransform(scrollYProgress, [0, 1], ['10%', '-30%']);
  const xR = useTransform(scrollYProgress, [0, 1], ['-10%', '30%']);

  return (
    <div ref={ref}>
      <style>{`
        .sg1 { background: #1a1a1a; padding: 3rem 0; overflow: hidden; display: flex; flex-direction: column; gap: 1rem; }
        .sg1__row { display: flex; gap: 1rem; white-space: nowrap; align-items: center; }
        .sg1__img { flex-shrink: 0; width: 220px; height: 140px; border-radius: 6px; overflow: hidden; }
        .sg1__img img { width: 100%; height: 100%; object-fit: cover; filter: brightness(0.85); transition: filter 0.4s; }
        .sg1__img:hover img { filter: brightness(1.05); }
        .sg1__statement { flex-shrink: 0; font-family: 'Space Grotesk', sans-serif; font-size: clamp(2.5rem, 5vw, 4rem); font-weight: 700; text-transform: uppercase; letter-spacing: -0.02em; color: rgba(255,255,255,0.08); line-height: 1; padding: 0 1rem; }
        .sg1__dest { flex-shrink: 0; display: flex; align-items: center; gap: 1rem; padding: 0 1.5rem; }
        .sg1__dest-name { font-family: 'Space Grotesk', sans-serif; font-size: 1.1rem; font-weight: 600; text-transform: uppercase; letter-spacing: 0.04em; color: rgba(255,255,255,0.85); }
        .sg1__dest-time { font-family: 'Share Tech Mono', monospace; font-size: 0.65rem; letter-spacing: 0.15em; color: rgba(255,255,255,0.35); text-transform: uppercase; }
        .sg1__dot { width: 4px; height: 4px; border-radius: 50%; background: rgba(255,255,255,0.2); flex-shrink: 0; }
      `}</style>
      <section className="sg1">
        <motion.div className="sg1__row" style={{ x: xL }}>
          {[...IMAGES, ...IMAGES.slice(0,6)].map((src, i) => (
            <React.Fragment key={i}>
              <div className="sg1__img"><img src={src} alt="" loading="lazy" /></div>
              {i % 3 === 0 && <span className="sg1__statement">{STATEMENTS[i % STATEMENTS.length]}</span>}
            </React.Fragment>
          ))}
        </motion.div>
        <motion.div className="sg1__row" style={{ x: xR }}>
          {[...DESTINATIONS, ...DESTINATIONS].map((d, i) => (
            <React.Fragment key={i}>
              <div className="sg1__dest">
                <span className="sg1__dest-name">{d.name}</span>
                <span className="sg1__dest-time">{d.time}</span>
              </div>
              <span className="sg1__dot" />
            </React.Fragment>
          ))}
        </motion.div>
        <motion.div className="sg1__row" style={{ x: xR }}>
          {[...IMAGES.slice(6), ...IMAGES].map((src, i) => (
            <React.Fragment key={i}>
              <div className="sg1__img"><img src={src} alt="" loading="lazy" /></div>
              {i % 4 === 1 && <span className="sg1__statement">{STATEMENTS[(i + 5) % STATEMENTS.length]}</span>}
            </React.Fragment>
          ))}
        </motion.div>
      </section>
    </div>
  );
};

// ============================================================
// V2 — DEPARTURE BOARD (Airport/heliport aesthetic)
// ============================================================

const V2 = () => {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end start'] });
  const xL = useTransform(scrollYProgress, [0, 1], ['5%', '-25%']);
  const xR = useTransform(scrollYProgress, [0, 1], ['-5%', '25%']);

  return (
    <div ref={ref}>
      <style>{`
        .sg2 { background: #0c0c0c; padding: 2rem 0; overflow: hidden; display: flex; flex-direction: column; gap: 0.5rem; font-family: 'Share Tech Mono', monospace; }
        .sg2__row { display: flex; gap: 0; white-space: nowrap; }
        .sg2__flight { flex-shrink: 0; display: flex; align-items: center; border-right: 1px solid rgba(255,255,255,0.06); padding: 0.75rem 2rem; gap: 2rem; }
        .sg2__flight-dest { font-size: 0.85rem; letter-spacing: 0.08em; text-transform: uppercase; color: rgba(255,255,255,0.9); min-width: 180px; }
        .sg2__flight-time { font-size: 0.7rem; letter-spacing: 0.1em; color: rgba(255,255,255,0.35); min-width: 60px; }
        .sg2__flight-status { font-size: 0.6rem; letter-spacing: 0.15em; color: #4ade80; text-transform: uppercase; }
        .sg2__img-row { display: flex; gap: 4px; }
        .sg2__img { flex-shrink: 0; width: 180px; height: 110px; overflow: hidden; }
        .sg2__img img { width: 100%; height: 100%; object-fit: cover; filter: brightness(0.7) contrast(1.1); }
        .sg2__lifestyle { flex-shrink: 0; padding: 0.75rem 2.5rem; font-family: 'Space Grotesk', sans-serif; font-size: 0.9rem; font-weight: 400; font-style: italic; color: rgba(255,255,255,0.4); letter-spacing: 0.02em; }
      `}</style>
      <section className="sg2">
        <motion.div className="sg2__row" style={{ x: xL }}>
          {[...DESTINATIONS, ...DESTINATIONS].map((d, i) => (
            <div key={i} className="sg2__flight">
              <span className="sg2__flight-dest">{d.name}</span>
              <span className="sg2__flight-time">{d.time}</span>
              <span className="sg2__flight-status">Ready</span>
            </div>
          ))}
        </motion.div>
        <motion.div className="sg2__img-row" style={{ x: xR }}>
          {[...IMAGES, ...IMAGES].map((src, i) => (
            <div key={i} className="sg2__img"><img src={src} alt="" loading="lazy" /></div>
          ))}
        </motion.div>
        <motion.div className="sg2__row" style={{ x: xR }}>
          {[...LIFESTYLES, ...LIFESTYLES, ...LIFESTYLES].map((text, i) => (
            <span key={i} className="sg2__lifestyle">{text}</span>
          ))}
        </motion.div>
      </section>
    </div>
  );
};

// ============================================================
// V3 — CINEMATIC LIFESTYLE (Large images, lifestyle captions)
// ============================================================

const V3 = () => {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end start'] });
  const xL = useTransform(scrollYProgress, [0, 1], ['5%', '-20%']);
  const xR = useTransform(scrollYProgress, [0, 1], ['-5%', '20%']);

  return (
    <div ref={ref}>
      <style>{`
        .sg3 { background: #0d0d0d; padding: 3rem 0; overflow: hidden; display: flex; flex-direction: column; gap: 1.5rem; }
        .sg3__row { display: flex; gap: 1.5rem; white-space: nowrap; }
        .sg3__card { flex-shrink: 0; width: 340px; height: 220px; border-radius: 4px; overflow: hidden; position: relative; }
        .sg3__card img { width: 100%; height: 100%; object-fit: cover; filter: brightness(0.75) contrast(1.1); transition: filter 0.5s; }
        .sg3__card:hover img { filter: brightness(0.95) contrast(1.05); }
        .sg3__card-overlay { position: absolute; bottom: 0; left: 0; right: 0; padding: 1.5rem; background: linear-gradient(transparent, rgba(0,0,0,0.8)); }
        .sg3__card-dest { font-family: 'Space Grotesk', sans-serif; font-size: 1.1rem; font-weight: 700; text-transform: uppercase; color: #fff; letter-spacing: 0.02em; }
        .sg3__card-time { font-family: 'Share Tech Mono', monospace; font-size: 0.6rem; letter-spacing: 0.15em; color: rgba(255,255,255,0.5); margin-top: 0.25rem; display: block; }
        .sg3__lifestyle-row { display: flex; gap: 3rem; align-items: center; padding: 0.5rem 0; }
        .sg3__lifestyle-text { flex-shrink: 0; font-family: 'Space Grotesk', sans-serif; font-size: 1rem; font-weight: 400; font-style: italic; color: rgba(255,255,255,0.45); letter-spacing: 0.02em; }
        .sg3__lifestyle-dash { width: 20px; height: 1px; background: rgba(255,255,255,0.15); flex-shrink: 0; }
      `}</style>
      <section className="sg3">
        <motion.div className="sg3__row" style={{ x: xL }}>
          {[...IMAGES, ...IMAGES.slice(0,4)].map((src, i) => {
            const d = DESTINATIONS[i % DESTINATIONS.length];
            return (
              <div key={i} className="sg3__card">
                <img src={src} alt="" loading="lazy" />
                {i % 2 === 0 && (
                  <div className="sg3__card-overlay">
                    <span className="sg3__card-dest">{d.name}</span>
                    <span className="sg3__card-time">Direct · {d.time} from Denham</span>
                  </div>
                )}
              </div>
            );
          })}
        </motion.div>
        <motion.div className="sg3__lifestyle-row" style={{ x: xR }}>
          {[...LIFESTYLES, ...LIFESTYLES, ...LIFESTYLES].map((text, i) => (
            <React.Fragment key={i}>
              <span className="sg3__lifestyle-text">{text}</span>
              <span className="sg3__lifestyle-dash" />
            </React.Fragment>
          ))}
        </motion.div>
        <motion.div className="sg3__row" style={{ x: xR }}>
          {[...IMAGES.slice(4), ...IMAGES].map((src, i) => {
            const d = DESTINATIONS[(i + 6) % DESTINATIONS.length];
            return (
              <div key={i} className="sg3__card">
                <img src={src} alt="" loading="lazy" />
                {i % 2 === 1 && (
                  <div className="sg3__card-overlay">
                    <span className="sg3__card-dest">{d.name}</span>
                    <span className="sg3__card-time">Direct · {d.time} from Denham</span>
                  </div>
                )}
              </div>
            );
          })}
        </motion.div>
      </section>
    </div>
  );
};

// ============================================================
// V4 — THEY DROVE. YOU FLEW. (Contrast strip)
// ============================================================

const V4 = () => {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end start'] });
  const xL = useTransform(scrollYProgress, [0, 1], ['8%', '-28%']);
  const xR = useTransform(scrollYProgress, [0, 1], ['-8%', '28%']);

  const contrasts = [
    { drove: '4hrs on the M5', flew: '2hrs to Cornwall' },
    { drove: 'Stuck at Heathrow', flew: 'Direct to Le Touquet' },
    { drove: 'M25 standstill', flew: '35min to Goodwood' },
    { drove: '6hrs to Scotland', flew: '3hrs to the Highlands' },
    { drove: 'Rail replacement bus', flew: '45min to the Isle of Wight' },
    { drove: 'Car park queue', flew: 'Land at the racecourse' },
  ];

  return (
    <div ref={ref}>
      <style>{`
        .sg4 { background: #1a1a1a; padding: 2.5rem 0; overflow: hidden; display: flex; flex-direction: column; gap: 0.75rem; }
        .sg4__row { display: flex; gap: 0.75rem; white-space: nowrap; align-items: center; }
        .sg4__img { flex-shrink: 0; width: 200px; height: 130px; border-radius: 6px; overflow: hidden; }
        .sg4__img img { width: 100%; height: 100%; object-fit: cover; }
        .sg4__contrast { flex-shrink: 0; display: flex; flex-direction: column; gap: 0.25rem; padding: 0 2rem; }
        .sg4__drove { font-family: 'Space Grotesk', sans-serif; font-size: 0.75rem; font-weight: 400; text-transform: uppercase; letter-spacing: 0.1em; color: rgba(255,255,255,0.25); text-decoration: line-through; }
        .sg4__flew { font-family: 'Space Grotesk', sans-serif; font-size: 1.1rem; font-weight: 700; text-transform: uppercase; letter-spacing: 0.03em; color: rgba(255,255,255,0.9); }
        .sg4__dest-row { display: flex; gap: 2rem; align-items: center; }
        .sg4__dest { flex-shrink: 0; display: flex; align-items: center; gap: 0.75rem; }
        .sg4__dest-bullet { width: 4px; height: 4px; border-radius: 50%; background: rgba(255,255,255,0.3); }
        .sg4__dest-name { font-family: 'Space Grotesk', sans-serif; font-size: 1rem; font-weight: 600; text-transform: uppercase; letter-spacing: 0.05em; color: rgba(255,255,255,0.7); }
        .sg4__dest-time { font-family: 'Share Tech Mono', monospace; font-size: 0.6rem; color: rgba(255,255,255,0.3); letter-spacing: 0.1em; }
      `}</style>
      <section className="sg4">
        <motion.div className="sg4__row" style={{ x: xL }}>
          {[...IMAGES, ...IMAGES.slice(0,6)].map((src, i) => (
            <React.Fragment key={i}>
              <div className="sg4__img"><img src={src} alt="" loading="lazy" /></div>
              {i % 3 === 0 && (
                <div className="sg4__contrast">
                  <span className="sg4__drove">{contrasts[i % contrasts.length].drove}</span>
                  <span className="sg4__flew">{contrasts[i % contrasts.length].flew}</span>
                </div>
              )}
            </React.Fragment>
          ))}
        </motion.div>
        <motion.div className="sg4__dest-row" style={{ x: xR }}>
          {[...DESTINATIONS, ...DESTINATIONS].map((d, i) => (
            <div key={i} className="sg4__dest">
              <span className="sg4__dest-bullet" />
              <span className="sg4__dest-name">{d.name}</span>
              <span className="sg4__dest-time">{d.time}</span>
            </div>
          ))}
        </motion.div>
        <motion.div className="sg4__row" style={{ x: xR }}>
          {[...IMAGES.slice(6), ...IMAGES].map((src, i) => (
            <React.Fragment key={i}>
              <div className="sg4__img"><img src={src} alt="" loading="lazy" /></div>
              {i % 3 === 1 && (
                <div className="sg4__contrast">
                  <span className="sg4__drove">{contrasts[(i + 2) % contrasts.length].drove}</span>
                  <span className="sg4__flew">{contrasts[(i + 2) % contrasts.length].flew}</span>
                </div>
              )}
            </React.Fragment>
          ))}
        </motion.div>
      </section>
    </div>
  );
};

// ============================================================
// V5 — WEEKEND PLANS (Warm editorial, "This Weekend:" prefix)
// ============================================================

const V5 = () => {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end start'] });
  const xL = useTransform(scrollYProgress, [0, 1], ['6%', '-22%']);
  const xR = useTransform(scrollYProgress, [0, 1], ['-6%', '22%']);

  const plans = [
    'This Saturday: Lunch in the Cotswolds',
    'This Sunday: Golf at Goodwood',
    'Next Weekend: Cowes Regatta',
    'Friday Evening: Le Touquet for dinner',
    'Bank Holiday: Fly to Cornwall',
    'Race Day: Cheltenham. Land trackside.',
  ];

  return (
    <div ref={ref}>
      <style>{`
        .sg5 { background: #faf9f6; padding: 3rem 0; overflow: hidden; display: flex; flex-direction: column; gap: 1.25rem; border-top: 1px solid #e8e6e2; border-bottom: 1px solid #e8e6e2; }
        .sg5__row { display: flex; gap: 1.25rem; white-space: nowrap; }
        .sg5__img { flex-shrink: 0; width: 240px; height: 160px; border-radius: 8px; overflow: hidden; box-shadow: 0 2px 12px rgba(0,0,0,0.08); }
        .sg5__img img { width: 100%; height: 100%; object-fit: cover; transition: transform 0.4s ease; }
        .sg5__img:hover img { transform: scale(1.04); }
        .sg5__plans { display: flex; gap: 3rem; align-items: center; padding: 0.5rem 0; }
        .sg5__plan { flex-shrink: 0; font-family: 'Space Grotesk', sans-serif; font-size: 1rem; font-weight: 400; color: #666; letter-spacing: 0.02em; }
        .sg5__plan em { font-style: italic; color: #1a1a1a; font-weight: 600; }
        .sg5__sep { width: 24px; height: 1px; background: #c0bdb8; flex-shrink: 0; }
      `}</style>
      <section className="sg5">
        <motion.div className="sg5__row" style={{ x: xL }}>
          {[...IMAGES, ...IMAGES.slice(0,6)].map((src, i) => (
            <div key={i} className="sg5__img"><img src={src} alt="" loading="lazy" /></div>
          ))}
        </motion.div>
        <motion.div className="sg5__plans" style={{ x: xR }}>
          {[...plans, ...plans, ...plans].map((text, i) => (
            <React.Fragment key={i}>
              <span className="sg5__plan" dangerouslySetInnerHTML={{ __html: text.replace(/^(.*?:)/, '<em>$1</em>') }} />
              <span className="sg5__sep" />
            </React.Fragment>
          ))}
        </motion.div>
        <motion.div className="sg5__row" style={{ x: xR }}>
          {[...IMAGES.slice(6), ...IMAGES].map((src, i) => (
            <div key={i} className="sg5__img"><img src={src} alt="" loading="lazy" /></div>
          ))}
        </motion.div>
      </section>
    </div>
  );
};

// ============================================================
// V6 — THE BOND STRIP (Dark dramatic, single text punch)
// ============================================================

const V6 = () => {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end start'] });
  const xL = useTransform(scrollYProgress, [0, 1], ['8%', '-30%']);
  const xR = useTransform(scrollYProgress, [0, 1], ['-12%', '25%']);

  return (
    <div ref={ref}>
      <style>{`
        .sg6 { background: #0a0a0a; padding: 2rem 0; overflow: hidden; display: flex; flex-direction: column; gap: 0; position: relative; }
        .sg6::before, .sg6::after { content: ''; position: absolute; top: 0; bottom: 0; width: 100px; z-index: 10; pointer-events: none; }
        .sg6::before { left: 0; background: linear-gradient(to right, #0a0a0a, transparent); }
        .sg6::after { right: 0; background: linear-gradient(to left, #0a0a0a, transparent); }
        .sg6__images { display: flex; gap: 6px; white-space: nowrap; }
        .sg6__img { flex-shrink: 0; width: 260px; height: 170px; overflow: hidden; }
        .sg6__img img { width: 100%; height: 100%; object-fit: cover; filter: brightness(0.6) contrast(1.2); transition: filter 0.4s; }
        .sg6__img:hover img { filter: brightness(0.85) contrast(1.1); }
        .sg6__punch { display: flex; align-items: center; justify-content: center; padding: 1.5rem 0; gap: 4rem; white-space: nowrap; }
        .sg6__punch-word { flex-shrink: 0; font-family: 'Space Grotesk', sans-serif; font-size: clamp(1.5rem, 3vw, 2.5rem); font-weight: 700; text-transform: uppercase; letter-spacing: 0.1em; }
        .sg6__punch-word--bright { color: rgba(255,255,255,0.9); }
        .sg6__punch-word--dim { color: rgba(255,255,255,0.15); }
        .sg6__punch-dot { width: 6px; height: 6px; border-radius: 50%; background: rgba(255,255,255,0.2); flex-shrink: 0; }
      `}</style>
      <section className="sg6">
        <motion.div className="sg6__images" style={{ x: xL }}>
          {[...IMAGES, ...IMAGES].map((src, i) => (
            <div key={i} className="sg6__img"><img src={src} alt="" loading="lazy" /></div>
          ))}
        </motion.div>
        <motion.div className="sg6__punch" style={{ x: xR }}>
          {['ARRIVE', 'LIKE', 'BOND', '·', 'SKIP', 'THE', 'TRAFFIC', '·', 'TAKE', 'THE', 'SKY', '·', 'LAND', 'AT', 'THE', 'DOOR'].map((word, i) => (
            word === '·'
              ? <span key={i} className="sg6__punch-dot" />
              : <span key={i} className={`sg6__punch-word ${['ARRIVE', 'BOND', 'SKIP', 'SKY', 'LAND', 'DOOR'].includes(word) ? 'sg6__punch-word--bright' : 'sg6__punch-word--dim'}`}>{word}</span>
          ))}
        </motion.div>
        <motion.div className="sg6__images" style={{ x: xR }}>
          {[...IMAGES.slice(6), ...IMAGES, ...IMAGES.slice(0,6)].map((src, i) => (
            <div key={i} className="sg6__img"><img src={src} alt="" loading="lazy" /></div>
          ))}
        </motion.div>
      </section>
    </div>
  );
};

// ============================================================
// V7 — DESTINATION CARDS (Split image + info, sliding)
// ============================================================

const V7 = () => {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end start'] });
  const xL = useTransform(scrollYProgress, [0, 1], ['5%', '-20%']);
  const xR = useTransform(scrollYProgress, [0, 1], ['-5%', '20%']);

  return (
    <div ref={ref}>
      <style>{`
        .sg7 { background: #1a1a1a; padding: 2.5rem 0; overflow: hidden; display: flex; flex-direction: column; gap: 1rem; }
        .sg7__row { display: flex; gap: 1rem; white-space: nowrap; }
        .sg7__card { flex-shrink: 0; display: flex; width: 360px; height: 160px; border-radius: 8px; overflow: hidden; border: 1px solid rgba(255,255,255,0.08); }
        .sg7__card-img { width: 55%; height: 100%; }
        .sg7__card-img img { width: 100%; height: 100%; object-fit: cover; }
        .sg7__card-info { width: 45%; padding: 1.25rem; display: flex; flex-direction: column; justify-content: center; gap: 0.5rem; }
        .sg7__card-name { font-family: 'Space Grotesk', sans-serif; font-size: 1rem; font-weight: 700; text-transform: uppercase; color: #fff; letter-spacing: 0.02em; line-height: 1.2; white-space: normal; }
        .sg7__card-time { font-family: 'Share Tech Mono', monospace; font-size: 0.6rem; letter-spacing: 0.15em; color: rgba(255,255,255,0.4); }
        .sg7__card-note { font-family: 'Space Grotesk', sans-serif; font-size: 0.7rem; color: rgba(255,255,255,0.3); font-style: italic; white-space: normal; line-height: 1.4; }
        .sg7__lifestyle-row { display: flex; gap: 2rem; padding: 0.25rem 0; }
        .sg7__lifestyle { flex-shrink: 0; font-family: 'Space Grotesk', sans-serif; font-size: 0.85rem; color: rgba(255,255,255,0.35); font-style: italic; }
      `}</style>
      <section className="sg7">
        <motion.div className="sg7__row" style={{ x: xL }}>
          {[...DESTINATIONS, ...DESTINATIONS.slice(0,6)].map((d, i) => (
            <div key={i} className="sg7__card">
              <div className="sg7__card-img"><img src={IMAGES[i % IMAGES.length]} alt="" loading="lazy" /></div>
              <div className="sg7__card-info">
                <span className="sg7__card-name">{d.name}</span>
                <span className="sg7__card-time">{d.time} from Denham</span>
                <span className="sg7__card-note">Fly direct. Land at the door.</span>
              </div>
            </div>
          ))}
        </motion.div>
        <motion.div className="sg7__lifestyle-row" style={{ x: xR }}>
          {[...LIFESTYLES, ...LIFESTYLES, ...LIFESTYLES].map((t, i) => (
            <span key={i} className="sg7__lifestyle">{t}</span>
          ))}
        </motion.div>
        <motion.div className="sg7__row" style={{ x: xR }}>
          {[...DESTINATIONS.slice(6), ...DESTINATIONS].map((d, i) => (
            <div key={i} className="sg7__card">
              <div className="sg7__card-img"><img src={IMAGES[(i + 4) % IMAGES.length]} alt="" loading="lazy" /></div>
              <div className="sg7__card-info">
                <span className="sg7__card-name">{d.name}</span>
                <span className="sg7__card-time">{d.time} from Denham</span>
                <span className="sg7__card-note">Your helicopter. Your schedule.</span>
              </div>
            </div>
          ))}
        </motion.div>
      </section>
    </div>
  );
};

// ============================================================
// V8 — GHOST TEXT + IMAGES (Huge faded words behind images)
// ============================================================

const V8 = () => {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end start'] });
  const xL = useTransform(scrollYProgress, [0, 1], ['12%', '-35%']);
  const xR = useTransform(scrollYProgress, [0, 1], ['-8%', '28%']);
  const xM = useTransform(scrollYProgress, [0, 1], ['5%', '-20%']);

  return (
    <div ref={ref}>
      <style>{`
        .sg8 { background: #111; padding: 3rem 0; overflow: hidden; display: flex; flex-direction: column; gap: 0.5rem; }
        .sg8__ghost-row { display: flex; align-items: center; gap: 0; white-space: nowrap; }
        .sg8__ghost { font-family: 'Space Grotesk', sans-serif; font-size: clamp(4rem, 8vw, 7rem); font-weight: 700; text-transform: uppercase; letter-spacing: -0.03em; color: rgba(255,255,255,0.04); line-height: 0.95; flex-shrink: 0; padding: 0 0.5rem; }
        .sg8__img-row { display: flex; gap: 1rem; white-space: nowrap; padding: 0.5rem 0; }
        .sg8__img { flex-shrink: 0; width: 200px; height: 130px; border-radius: 6px; overflow: hidden; }
        .sg8__img img { width: 100%; height: 100%; object-fit: cover; }
        .sg8__dest-row { display: flex; gap: 2rem; align-items: center; padding: 0.25rem 0; }
        .sg8__dest { flex-shrink: 0; }
        .sg8__dest-name { font-family: 'Space Grotesk', sans-serif; font-size: 0.9rem; font-weight: 600; text-transform: uppercase; letter-spacing: 0.05em; color: rgba(255,255,255,0.75); }
        .sg8__dest-time { font-family: 'Share Tech Mono', monospace; font-size: 0.55rem; letter-spacing: 0.15em; color: rgba(255,255,255,0.25); margin-left: 0.75rem; }
      `}</style>
      <section className="sg8">
        <motion.div className="sg8__ghost-row" style={{ x: xL }}>
          {['FREEDOM', 'ADVENTURE', 'ARRIVE', 'EXPLORE', 'ESCAPE', 'FREEDOM', 'ADVENTURE', 'ARRIVE'].map((w, i) => (
            <span key={i} className="sg8__ghost">{w}</span>
          ))}
        </motion.div>
        <motion.div className="sg8__img-row" style={{ x: xR }}>
          {[...IMAGES, ...IMAGES.slice(0,6)].map((src, i) => (
            <div key={i} className="sg8__img"><img src={src} alt="" loading="lazy" /></div>
          ))}
        </motion.div>
        <motion.div className="sg8__dest-row" style={{ x: xM }}>
          {[...DESTINATIONS, ...DESTINATIONS].map((d, i) => (
            <span key={i} className="sg8__dest">
              <span className="sg8__dest-name">{d.name}</span>
              <span className="sg8__dest-time">{d.time}</span>
            </span>
          ))}
        </motion.div>
        <motion.div className="sg8__img-row" style={{ x: xL }}>
          {[...IMAGES.slice(6), ...IMAGES].map((src, i) => (
            <div key={i} className="sg8__img"><img src={src} alt="" loading="lazy" /></div>
          ))}
        </motion.div>
      </section>
    </div>
  );
};

// ============================================================
// V9 — TICKER CONTINUOUS (Auto-scroll + scroll parallax)
// ============================================================

const V9 = () => {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end start'] });
  const xShift = useTransform(scrollYProgress, [0, 1], ['0%', '-8%']);

  return (
    <div ref={ref}>
      <style>{`
        .sg9 { background: #1a1a1a; padding: 1.5rem 0; overflow: hidden; display: flex; flex-direction: column; gap: 0; border-top: 1px solid rgba(255,255,255,0.08); border-bottom: 1px solid rgba(255,255,255,0.08); }
        .sg9__tape { display: flex; white-space: nowrap; will-change: transform; }
        .sg9__tape--img { animation: sg9left 50s linear infinite; gap: 4px; }
        .sg9__tape--text { animation: sg9right 40s linear infinite; padding: 0.5rem 0; }
        .sg9__tape--img2 { animation: sg9right 55s linear infinite; gap: 4px; }
        @keyframes sg9left { from { transform: translateX(0); } to { transform: translateX(-50%); } }
        @keyframes sg9right { from { transform: translateX(-50%); } to { transform: translateX(0); } }
        .sg9__img { flex-shrink: 0; width: 180px; height: 110px; overflow: hidden; border-radius: 3px; }
        .sg9__img img { width: 100%; height: 100%; object-fit: cover; filter: brightness(0.8); }
        .sg9__item { flex-shrink: 0; display: inline-flex; align-items: center; gap: 1.5rem; padding: 0 2rem; }
        .sg9__item-name { font-family: 'Space Grotesk', sans-serif; font-size: 0.95rem; font-weight: 600; text-transform: uppercase; letter-spacing: 0.06em; color: rgba(255,255,255,0.7); }
        .sg9__item-time { font-family: 'Share Tech Mono', monospace; font-size: 0.6rem; letter-spacing: 0.1em; color: rgba(255,255,255,0.3); }
        .sg9__item-dot { width: 3px; height: 3px; border-radius: 50%; background: rgba(255,255,255,0.2); }
      `}</style>
      <section className="sg9">
        <motion.div style={{ x: xShift }}>
          <div className="sg9__tape sg9__tape--img">
            {[...IMAGES, ...IMAGES].map((src, i) => (
              <div key={i} className="sg9__img"><img src={src} alt="" loading="lazy" /></div>
            ))}
          </div>
        </motion.div>
        <div className="sg9__tape sg9__tape--text">
          {[...DESTINATIONS, ...DESTINATIONS, ...DESTINATIONS, ...DESTINATIONS].map((d, i) => (
            <span key={i} className="sg9__item">
              <span className="sg9__item-dot" />
              <span className="sg9__item-name">{d.name}</span>
              <span className="sg9__item-time">{d.time}</span>
            </span>
          ))}
        </div>
        <motion.div style={{ x: xShift }}>
          <div className="sg9__tape sg9__tape--img2">
            {[...IMAGES.slice(6), ...IMAGES, ...IMAGES.slice(0,6)].map((src, i) => (
              <div key={i} className="sg9__img"><img src={src} alt="" loading="lazy" /></div>
            ))}
          </div>
        </motion.div>
      </section>
    </div>
  );
};

// ============================================================
// V10 — SPLIT VERTICAL (Left images up, right text down)
// ============================================================

const V10 = () => {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end start'] });
  const yUp = useTransform(scrollYProgress, [0, 1], ['8%', '-15%']);
  const yDown = useTransform(scrollYProgress, [0, 1], ['-8%', '15%']);

  return (
    <div ref={ref}>
      <style>{`
        .sg10 { background: #1a1a1a; overflow: hidden; display: grid; grid-template-columns: 1fr 1fr; min-height: 500px; }
        .sg10__left { overflow: hidden; border-right: 1px solid rgba(255,255,255,0.06); }
        .sg10__right { overflow: hidden; }
        .sg10__img-col { display: flex; flex-direction: column; gap: 0.75rem; padding: 1rem; }
        .sg10__img { width: 100%; aspect-ratio: 16/10; border-radius: 4px; overflow: hidden; }
        .sg10__img img { width: 100%; height: 100%; object-fit: cover; filter: brightness(0.8); }
        .sg10__text-col { display: flex; flex-direction: column; gap: 0; padding: 0; }
        .sg10__item { padding: 1.5rem 2rem; border-bottom: 1px solid rgba(255,255,255,0.04); }
        .sg10__item-dest { font-family: 'Space Grotesk', sans-serif; font-size: 1.15rem; font-weight: 700; text-transform: uppercase; color: rgba(255,255,255,0.85); letter-spacing: 0.02em; }
        .sg10__item-meta { font-family: 'Share Tech Mono', monospace; font-size: 0.6rem; letter-spacing: 0.15em; color: rgba(255,255,255,0.3); margin-top: 0.35rem; }
        .sg10__item-life { font-family: 'Space Grotesk', sans-serif; font-size: 0.8rem; color: rgba(255,255,255,0.3); font-style: italic; margin-top: 0.5rem; }
      `}</style>
      <section className="sg10">
        <div className="sg10__left">
          <motion.div className="sg10__img-col" style={{ y: yUp }}>
            {[...IMAGES, ...IMAGES].map((src, i) => (
              <div key={i} className="sg10__img"><img src={src} alt="" loading="lazy" /></div>
            ))}
          </motion.div>
        </div>
        <div className="sg10__right">
          <motion.div className="sg10__text-col" style={{ y: yDown }}>
            {[...DESTINATIONS, ...DESTINATIONS, ...DESTINATIONS].map((d, i) => (
              <div key={i} className="sg10__item">
                <div className="sg10__item-dest">{d.name}</div>
                <div className="sg10__item-meta">{d.time} direct from Denham Aerodrome</div>
                <div className="sg10__item-life">{LIFESTYLES[i % LIFESTYLES.length]}</div>
              </div>
            ))}
          </motion.div>
        </div>
      </section>
    </div>
  );
};

// ============================================================
// V11 — GRADIENT MASK LUXURY (Edge fades, warm accent)
// ============================================================

const V11 = () => {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end start'] });
  const xL = useTransform(scrollYProgress, [0, 1], ['8%', '-28%']);
  const xR = useTransform(scrollYProgress, [0, 1], ['-8%', '28%']);

  return (
    <div ref={ref}>
      <style>{`
        .sg11 { background: #1a1a1a; padding: 3rem 0; overflow: hidden; display: flex; flex-direction: column; gap: 1rem; position: relative; }
        .sg11::before, .sg11::after { content: ''; position: absolute; top: 0; bottom: 0; width: 150px; z-index: 10; pointer-events: none; }
        .sg11::before { left: 0; background: linear-gradient(to right, #1a1a1a, transparent); }
        .sg11::after { right: 0; background: linear-gradient(to left, #1a1a1a, transparent); }
        .sg11__row { display: flex; gap: 1rem; white-space: nowrap; }
        .sg11__img { flex-shrink: 0; width: 220px; height: 145px; border-radius: 6px; overflow: hidden; }
        .sg11__img img { width: 100%; height: 100%; object-fit: cover; opacity: 0.85; transition: opacity 0.3s; }
        .sg11__img:hover img { opacity: 1; }
        .sg11__dest-row { display: flex; gap: 2rem; padding: 0.5rem 0; }
        .sg11__dest { flex-shrink: 0; display: flex; align-items: baseline; gap: 0.75rem; }
        .sg11__dest-name { font-family: 'Space Grotesk', sans-serif; font-size: 1rem; font-weight: 600; text-transform: uppercase; letter-spacing: 0.05em; color: rgba(255,255,255,0.8); }
        .sg11__dest-time { font-family: 'Share Tech Mono', monospace; font-size: 0.6rem; letter-spacing: 0.1em; color: rgba(255,255,255,0.3); }
        .sg11__dot { width: 4px; height: 4px; border-radius: 50%; background: rgba(255,255,255,0.15); flex-shrink: 0; align-self: center; }
      `}</style>
      <section className="sg11">
        <motion.div className="sg11__row" style={{ x: xL }}>
          {[...IMAGES, ...IMAGES].map((src, i) => (
            <div key={i} className="sg11__img"><img src={src} alt="" loading="lazy" /></div>
          ))}
        </motion.div>
        <motion.div className="sg11__dest-row" style={{ x: xR }}>
          {[...DESTINATIONS, ...DESTINATIONS, ...DESTINATIONS].map((d, i) => (
            <React.Fragment key={i}>
              <span className="sg11__dest">
                <span className="sg11__dest-name">{d.name}</span>
                <span className="sg11__dest-time">{d.time}</span>
              </span>
              <span className="sg11__dot" />
            </React.Fragment>
          ))}
        </motion.div>
        <motion.div className="sg11__row" style={{ x: xR }}>
          {[...IMAGES.slice(6), ...IMAGES, ...IMAGES.slice(0,6)].map((src, i) => (
            <div key={i} className="sg11__img"><img src={src} alt="" loading="lazy" /></div>
          ))}
        </motion.div>
        <motion.div className="sg11__dest-row" style={{ x: xL }}>
          {[...LIFESTYLES, ...LIFESTYLES, ...LIFESTYLES, ...LIFESTYLES].map((t, i) => (
            <React.Fragment key={i}>
              <span style={{ flexShrink: 0, fontFamily: "'Space Grotesk', sans-serif", fontSize: '0.85rem', fontStyle: 'italic', color: 'rgba(255,255,255,0.3)' }}>{t}</span>
              <span className="sg11__dot" />
            </React.Fragment>
          ))}
        </motion.div>
      </section>
    </div>
  );
};

// ============================================================
// V12 — EDITORIAL WARM (Light bg, large images, elegant type)
// ============================================================

const V12 = () => {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end start'] });
  const xL = useTransform(scrollYProgress, [0, 1], ['5%', '-18%']);
  const xR = useTransform(scrollYProgress, [0, 1], ['-5%', '18%']);

  return (
    <div ref={ref}>
      <style>{`
        .sg12 { background: #f5f4f0; padding: 3rem 0; overflow: hidden; display: flex; flex-direction: column; gap: 1.5rem; }
        .sg12__row { display: flex; gap: 1.5rem; white-space: nowrap; }
        .sg12__card { flex-shrink: 0; position: relative; width: 300px; height: 200px; border-radius: 2px; overflow: hidden; }
        .sg12__card img { width: 100%; height: 100%; object-fit: cover; }
        .sg12__card-label { position: absolute; bottom: 0; left: 0; right: 0; padding: 1rem 1.25rem; background: linear-gradient(transparent, rgba(0,0,0,0.7)); }
        .sg12__card-dest { font-family: 'Space Grotesk', sans-serif; font-size: 0.9rem; font-weight: 600; text-transform: uppercase; color: #fff; letter-spacing: 0.03em; }
        .sg12__card-sub { font-family: 'Share Tech Mono', monospace; font-size: 0.55rem; letter-spacing: 0.12em; color: rgba(255,255,255,0.5); margin-top: 2px; display: block; }
        .sg12__text-row { display: flex; gap: 3rem; align-items: center; padding: 0; }
        .sg12__statement { flex-shrink: 0; font-family: 'Space Grotesk', sans-serif; font-size: 1rem; font-weight: 500; text-transform: uppercase; letter-spacing: 0.1em; color: #4a4a4a; }
        .sg12__sep { width: 30px; height: 1px; background: #c0bdb8; flex-shrink: 0; }
      `}</style>
      <section className="sg12">
        <motion.div className="sg12__row" style={{ x: xL }}>
          {[...IMAGES, ...IMAGES.slice(0,6)].map((src, i) => {
            const d = DESTINATIONS[i % DESTINATIONS.length];
            return (
              <div key={i} className="sg12__card">
                <img src={src} alt="" loading="lazy" />
                <div className="sg12__card-label">
                  <span className="sg12__card-dest">{d.name}</span>
                  <span className="sg12__card-sub">{d.time} from Denham</span>
                </div>
              </div>
            );
          })}
        </motion.div>
        <motion.div className="sg12__text-row" style={{ x: xR }}>
          {[...STATEMENTS, ...STATEMENTS, ...STATEMENTS].map((s, i) => (
            <React.Fragment key={i}>
              <span className="sg12__statement">{s}</span>
              <span className="sg12__sep" />
            </React.Fragment>
          ))}
        </motion.div>
        <motion.div className="sg12__row" style={{ x: xR }}>
          {[...IMAGES.slice(6), ...IMAGES].map((src, i) => {
            const d = DESTINATIONS[(i + 6) % DESTINATIONS.length];
            return (
              <div key={i} className="sg12__card">
                <img src={src} alt="" loading="lazy" />
                <div className="sg12__card-label">
                  <span className="sg12__card-dest">{d.name}</span>
                  <span className="sg12__card-sub">{d.time} from Denham</span>
                </div>
              </div>
            );
          })}
        </motion.div>
      </section>
    </div>
  );
};

// ============================================================
// V13 — MULTI-SPEED PARALLAX (3 layers at different speeds)
// ============================================================

const V13 = () => {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end start'] });
  const xFast = useTransform(scrollYProgress, [0, 1], ['15%', '-40%']);
  const xMed = useTransform(scrollYProgress, [0, 1], ['8%', '-22%']);
  const xSlow = useTransform(scrollYProgress, [0, 1], ['-5%', '15%']);

  return (
    <div ref={ref}>
      <style>{`
        .sg13 { background: #0e0e0e; padding: 2rem 0; overflow: hidden; display: flex; flex-direction: column; gap: 0.75rem; }
        .sg13__row { display: flex; gap: 0.75rem; white-space: nowrap; }
        .sg13__row--back .sg13__img { opacity: 0.3; width: 160px; height: 100px; }
        .sg13__row--mid .sg13__img { opacity: 0.6; width: 200px; height: 130px; }
        .sg13__row--front .sg13__img { opacity: 1; width: 250px; height: 160px; }
        .sg13__img { flex-shrink: 0; border-radius: 4px; overflow: hidden; }
        .sg13__img img { width: 100%; height: 100%; object-fit: cover; }
        .sg13__text-row { display: flex; gap: 2rem; padding: 0.5rem 0; }
        .sg13__dest { flex-shrink: 0; font-family: 'Space Grotesk', sans-serif; font-size: 0.95rem; font-weight: 600; text-transform: uppercase; letter-spacing: 0.05em; color: rgba(255,255,255,0.7); }
        .sg13__time { font-family: 'Share Tech Mono', monospace; font-size: 0.55rem; color: rgba(255,255,255,0.25); margin-left: 0.5rem; letter-spacing: 0.1em; }
      `}</style>
      <section className="sg13">
        <motion.div className="sg13__row sg13__row--back" style={{ x: xFast }}>
          {[...IMAGES, ...IMAGES, ...IMAGES.slice(0,4)].map((src, i) => (
            <div key={i} className="sg13__img"><img src={src} alt="" loading="lazy" /></div>
          ))}
        </motion.div>
        <motion.div className="sg13__row sg13__row--mid" style={{ x: xMed }}>
          {[...IMAGES.slice(4), ...IMAGES, ...IMAGES.slice(0,4)].map((src, i) => (
            <div key={i} className="sg13__img"><img src={src} alt="" loading="lazy" /></div>
          ))}
        </motion.div>
        <motion.div className="sg13__text-row" style={{ x: xSlow }}>
          {[...DESTINATIONS, ...DESTINATIONS, ...DESTINATIONS].map((d, i) => (
            <span key={i} className="sg13__dest">{d.name}<span className="sg13__time">{d.time}</span></span>
          ))}
        </motion.div>
        <motion.div className="sg13__row sg13__row--front" style={{ x: xSlow }}>
          {[...IMAGES.slice(8), ...IMAGES].map((src, i) => (
            <div key={i} className="sg13__img"><img src={src} alt="" loading="lazy" /></div>
          ))}
        </motion.div>
      </section>
    </div>
  );
};

// ============================================================
// V14 — DIAGONAL LUXURY (Angled strips, gold-tinted)
// ============================================================

const V14 = () => {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end start'] });
  const xL = useTransform(scrollYProgress, [0, 1], ['8%', '-28%']);
  const xR = useTransform(scrollYProgress, [0, 1], ['-8%', '28%']);

  return (
    <div ref={ref}>
      <style>{`
        .sg14 { background: #111; padding: 5rem 0; overflow: hidden; display: flex; flex-direction: column; gap: 1rem; transform: skewY(-1.5deg); }
        .sg14__row { display: flex; gap: 1rem; white-space: nowrap; }
        .sg14__img { flex-shrink: 0; width: 240px; height: 155px; border-radius: 4px; overflow: hidden; transform: skewY(1.5deg); }
        .sg14__img img { width: 100%; height: 100%; object-fit: cover; filter: brightness(0.85) saturate(0.9); transition: filter 0.4s; }
        .sg14__img:hover img { filter: brightness(1) saturate(1.1); }
        .sg14__text { flex-shrink: 0; display: flex; align-items: center; gap: 1rem; padding: 0 1.5rem; transform: skewY(1.5deg); }
        .sg14__text-name { font-family: 'Space Grotesk', sans-serif; font-size: 1.05rem; font-weight: 600; text-transform: uppercase; letter-spacing: 0.05em; color: rgba(255,255,255,0.8); }
        .sg14__text-time { font-family: 'Share Tech Mono', monospace; font-size: 0.6rem; letter-spacing: 0.1em; color: rgba(255,255,255,0.3); }
        .sg14__text-bar { width: 20px; height: 2px; background: rgba(255,255,255,0.15); flex-shrink: 0; }
      `}</style>
      <section className="sg14">
        <motion.div className="sg14__row" style={{ x: xL }}>
          {[...IMAGES, ...IMAGES.slice(0,6)].map((src, i) => (
            <div key={i} className="sg14__img"><img src={src} alt="" loading="lazy" /></div>
          ))}
        </motion.div>
        <motion.div className="sg14__row" style={{ x: xR }}>
          {[...DESTINATIONS, ...DESTINATIONS].map((d, i) => (
            <div key={i} className="sg14__text">
              <span className="sg14__text-bar" />
              <span className="sg14__text-name">{d.name}</span>
              <span className="sg14__text-time">{d.time}</span>
            </div>
          ))}
        </motion.div>
        <motion.div className="sg14__row" style={{ x: xL }}>
          {[...IMAGES.slice(6), ...IMAGES].map((src, i) => (
            <div key={i} className="sg14__img"><img src={src} alt="" loading="lazy" /></div>
          ))}
        </motion.div>
      </section>
    </div>
  );
};

// ============================================================
// V15 — SWISS PRECISION (Grid borders, numbered destinations)
// ============================================================

const V15 = () => {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end start'] });
  const xL = useTransform(scrollYProgress, [0, 1], ['3%', '-18%']);
  const xR = useTransform(scrollYProgress, [0, 1], ['-3%', '18%']);

  return (
    <div ref={ref}>
      <style>{`
        .sg15 { background: #fff; padding: 0; overflow: hidden; display: flex; flex-direction: column; border-top: 3px solid #1a1a1a; border-bottom: 3px solid #1a1a1a; }
        .sg15__row { display: flex; gap: 0; white-space: nowrap; border-bottom: 1px solid #e5e5e5; }
        .sg15__row:last-child { border-bottom: none; }
        .sg15__img { flex-shrink: 0; width: 200px; height: 140px; overflow: hidden; border-right: 1px solid #e5e5e5; }
        .sg15__img img { width: 100%; height: 100%; object-fit: cover; filter: grayscale(100%); transition: filter 0.3s; }
        .sg15__img:hover img { filter: grayscale(0%); }
        .sg15__cell { flex-shrink: 0; display: flex; align-items: center; padding: 1rem 1.5rem; border-right: 1px solid #e5e5e5; gap: 1rem; }
        .sg15__cell-num { font-family: 'Share Tech Mono', monospace; font-size: 0.6rem; color: #cc0000; letter-spacing: 0.1em; }
        .sg15__cell-dest { font-family: 'Space Grotesk', sans-serif; font-size: 0.85rem; font-weight: 600; text-transform: uppercase; letter-spacing: 0.05em; color: #1a1a1a; }
        .sg15__cell-time { font-family: 'Share Tech Mono', monospace; font-size: 0.6rem; color: #999; letter-spacing: 0.1em; }
      `}</style>
      <section className="sg15">
        <motion.div className="sg15__row" style={{ x: xL }}>
          {[...IMAGES, ...IMAGES].map((src, i) => (
            <div key={i} className="sg15__img"><img src={src} alt="" loading="lazy" /></div>
          ))}
        </motion.div>
        <motion.div className="sg15__row" style={{ x: xR }}>
          {[...DESTINATIONS, ...DESTINATIONS, ...DESTINATIONS].map((d, i) => (
            <div key={i} className="sg15__cell">
              <span className="sg15__cell-num">{String(i % DESTINATIONS.length + 1).padStart(2, '0')}</span>
              <span className="sg15__cell-dest">{d.name}</span>
              <span className="sg15__cell-time">{d.time}</span>
            </div>
          ))}
        </motion.div>
        <motion.div className="sg15__row" style={{ x: xR }}>
          {[...IMAGES.slice(6), ...IMAGES, ...IMAGES.slice(0,6)].map((src, i) => (
            <div key={i} className="sg15__img"><img src={src} alt="" loading="lazy" /></div>
          ))}
        </motion.div>
      </section>
    </div>
  );
};

// ============================================================
// V16 — GLASS MORPHISM (Frosted glass, blue tint)
// ============================================================

const V16 = () => {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end start'] });
  const xL = useTransform(scrollYProgress, [0, 1], ['6%', '-22%']);
  const xR = useTransform(scrollYProgress, [0, 1], ['-6%', '22%']);

  return (
    <div ref={ref}>
      <style>{`
        .sg16 { background: linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%); padding: 3rem 0; overflow: hidden; display: flex; flex-direction: column; gap: 1.25rem; }
        .sg16__row { display: flex; gap: 1rem; white-space: nowrap; }
        .sg16__img { flex-shrink: 0; width: 220px; height: 145px; border-radius: 12px; overflow: hidden; border: 1px solid rgba(255,255,255,0.1); }
        .sg16__img img { width: 100%; height: 100%; object-fit: cover; opacity: 0.9; }
        .sg16__glass { flex-shrink: 0; padding: 1rem 1.5rem; border-radius: 12px; background: rgba(255,255,255,0.06); backdrop-filter: blur(12px); border: 1px solid rgba(255,255,255,0.08); display: flex; align-items: center; gap: 1rem; }
        .sg16__glass-dest { font-family: 'Space Grotesk', sans-serif; font-size: 0.95rem; font-weight: 500; color: rgba(255,255,255,0.85); text-transform: uppercase; letter-spacing: 0.04em; }
        .sg16__glass-time { font-family: 'Share Tech Mono', monospace; font-size: 0.55rem; color: rgba(255,255,255,0.35); letter-spacing: 0.1em; }
      `}</style>
      <section className="sg16">
        <motion.div className="sg16__row" style={{ x: xL }}>
          {[...IMAGES, ...IMAGES.slice(0,6)].map((src, i) => (
            <div key={i} className="sg16__img"><img src={src} alt="" loading="lazy" /></div>
          ))}
        </motion.div>
        <motion.div className="sg16__row" style={{ x: xR }}>
          {[...DESTINATIONS, ...DESTINATIONS].map((d, i) => (
            <div key={i} className="sg16__glass">
              <span className="sg16__glass-dest">{d.name}</span>
              <span className="sg16__glass-time">{d.time}</span>
            </div>
          ))}
        </motion.div>
        <motion.div className="sg16__row" style={{ x: xR }}>
          {[...IMAGES.slice(4), ...IMAGES].map((src, i) => (
            <div key={i} className="sg16__img"><img src={src} alt="" loading="lazy" /></div>
          ))}
        </motion.div>
      </section>
    </div>
  );
};

// ============================================================
// V17 — VERTICAL COLUMNS (5 cols, alternating scroll)
// ============================================================

const V17 = () => {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end start'] });
  const yUp = useTransform(scrollYProgress, [0, 1], ['5%', '-15%']);
  const yDown = useTransform(scrollYProgress, [0, 1], ['-5%', '15%']);

  return (
    <div ref={ref}>
      <style>{`
        .sg17 { background: #faf9f6; overflow: hidden; display: flex; gap: 1rem; height: 550px; padding: 0 1rem; }
        .sg17__col { flex: 1; overflow: hidden; display: flex; flex-direction: column; gap: 1rem; }
        .sg17__img { flex-shrink: 0; border-radius: 6px; overflow: hidden; }
        .sg17__img--tall { height: 240px; }
        .sg17__img--short { height: 160px; }
        .sg17__img img { width: 100%; height: 100%; object-fit: cover; }
        .sg17__text-card { flex-shrink: 0; padding: 1rem; background: #fff; border-radius: 6px; border: 1px solid #e8e6e2; }
        .sg17__text-dest { font-family: 'Space Grotesk', sans-serif; font-size: 0.95rem; font-weight: 600; text-transform: uppercase; color: #1a1a1a; letter-spacing: 0.02em; }
        .sg17__text-time { font-family: 'Share Tech Mono', monospace; font-size: 0.55rem; color: #999; letter-spacing: 0.1em; margin-top: 0.25rem; display: block; }
      `}</style>
      <section className="sg17">
        {[0, 1, 2, 3, 4].map(col => (
          <motion.div key={col} className="sg17__col" style={{ y: col % 2 === 0 ? yUp : yDown }}>
            {[...IMAGES, ...IMAGES].slice(col * 2, col * 2 + 7).map((src, i) => (
              <React.Fragment key={i}>
                <div className={`sg17__img ${i % 2 === 0 ? 'sg17__img--tall' : 'sg17__img--short'}`}>
                  <img src={src} alt="" loading="lazy" />
                </div>
                {i % 3 === 1 && (
                  <div className="sg17__text-card">
                    <div className="sg17__text-dest">{DESTINATIONS[(col * 2 + i) % DESTINATIONS.length].name}</div>
                    <span className="sg17__text-time">{DESTINATIONS[(col * 2 + i) % DESTINATIONS.length].time} from Denham</span>
                  </div>
                )}
              </React.Fragment>
            ))}
          </motion.div>
        ))}
      </section>
    </div>
  );
};

// ============================================================
// V18 — NEON GLOW (Dark with blue accent glows)
// ============================================================

const V18 = () => {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end start'] });
  const xL = useTransform(scrollYProgress, [0, 1], ['8%', '-25%']);
  const xR = useTransform(scrollYProgress, [0, 1], ['-8%', '25%']);

  return (
    <div ref={ref}>
      <style>{`
        .sg18 { background: #0a0a0f; padding: 3rem 0; overflow: hidden; display: flex; flex-direction: column; gap: 1rem; }
        .sg18__row { display: flex; gap: 1rem; white-space: nowrap; }
        .sg18__img { flex-shrink: 0; width: 210px; height: 135px; border-radius: 6px; overflow: hidden; border: 1px solid rgba(91,155,213,0.15); box-shadow: 0 0 12px rgba(91,155,213,0.06); transition: all 0.3s; }
        .sg18__img:hover { border-color: rgba(91,155,213,0.4); box-shadow: 0 0 20px rgba(91,155,213,0.12); }
        .sg18__img img { width: 100%; height: 100%; object-fit: cover; filter: brightness(0.7) contrast(1.1); transition: filter 0.3s; }
        .sg18__img:hover img { filter: brightness(0.9); }
        .sg18__dest-row { display: flex; gap: 2rem; padding: 0.5rem 0; }
        .sg18__dest { flex-shrink: 0; display: flex; align-items: center; gap: 0.75rem; }
        .sg18__glow { width: 5px; height: 5px; border-radius: 50%; background: #5B9BD5; box-shadow: 0 0 8px rgba(91,155,213,0.5); flex-shrink: 0; }
        .sg18__dest-name { font-family: 'Space Grotesk', sans-serif; font-size: 1rem; font-weight: 500; text-transform: uppercase; letter-spacing: 0.06em; color: rgba(255,255,255,0.7); }
        .sg18__dest-time { font-family: 'Share Tech Mono', monospace; font-size: 0.55rem; color: rgba(91,155,213,0.5); letter-spacing: 0.1em; }
      `}</style>
      <section className="sg18">
        <motion.div className="sg18__row" style={{ x: xL }}>
          {[...IMAGES, ...IMAGES.slice(0,6)].map((src, i) => (
            <div key={i} className="sg18__img"><img src={src} alt="" loading="lazy" /></div>
          ))}
        </motion.div>
        <motion.div className="sg18__dest-row" style={{ x: xR }}>
          {[...DESTINATIONS, ...DESTINATIONS, ...DESTINATIONS].map((d, i) => (
            <span key={i} className="sg18__dest">
              <span className="sg18__glow" />
              <span className="sg18__dest-name">{d.name}</span>
              <span className="sg18__dest-time">{d.time}</span>
            </span>
          ))}
        </motion.div>
        <motion.div className="sg18__row" style={{ x: xR }}>
          {[...IMAGES.slice(6), ...IMAGES].map((src, i) => (
            <div key={i} className="sg18__img"><img src={src} alt="" loading="lazy" /></div>
          ))}
        </motion.div>
      </section>
    </div>
  );
};

// ============================================================
// V19 — 3D PERSPECTIVE (Strips recede on scroll)
// ============================================================

const V19 = () => {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end start'] });
  const xL = useTransform(scrollYProgress, [0, 1], ['10%', '-30%']);
  const xR = useTransform(scrollYProgress, [0, 1], ['-10%', '30%']);
  const rotX = useTransform(scrollYProgress, [0, 0.5, 1], [6, 0, -6]);

  return (
    <div ref={ref}>
      <style>{`
        .sg19 { background: #111; padding: 4rem 0; overflow: hidden; perspective: 1200px; }
        .sg19__inner { display: flex; flex-direction: column; gap: 1rem; transform-style: preserve-3d; }
        .sg19__row { display: flex; gap: 1rem; white-space: nowrap; }
        .sg19__img { flex-shrink: 0; width: 220px; height: 140px; border-radius: 8px; overflow: hidden; box-shadow: 0 4px 20px rgba(0,0,0,0.3); }
        .sg19__img img { width: 100%; height: 100%; object-fit: cover; }
        .sg19__dest-row { display: flex; gap: 2rem; padding: 0.75rem 0; }
        .sg19__dest { flex-shrink: 0; display: flex; align-items: center; gap: 0.75rem; }
        .sg19__dest-arrow { font-size: 0.6rem; color: rgba(255,255,255,0.2); }
        .sg19__dest-name { font-family: 'Space Grotesk', sans-serif; font-size: 1.05rem; font-weight: 600; text-transform: uppercase; letter-spacing: 0.04em; color: rgba(255,255,255,0.8); }
        .sg19__dest-time { font-family: 'Share Tech Mono', monospace; font-size: 0.55rem; color: rgba(255,255,255,0.3); letter-spacing: 0.1em; }
      `}</style>
      <section className="sg19">
        <motion.div className="sg19__inner" style={{ rotateX: rotX }}>
          <motion.div className="sg19__row" style={{ x: xL }}>
            {[...IMAGES, ...IMAGES.slice(0,6)].map((src, i) => (
              <div key={i} className="sg19__img"><img src={src} alt="" loading="lazy" /></div>
            ))}
          </motion.div>
          <motion.div className="sg19__dest-row" style={{ x: xR }}>
            {[...DESTINATIONS, ...DESTINATIONS].map((d, i) => (
              <span key={i} className="sg19__dest">
                <span className="sg19__dest-arrow">▸</span>
                <span className="sg19__dest-name">{d.name}</span>
                <span className="sg19__dest-time">{d.time}</span>
              </span>
            ))}
          </motion.div>
          <motion.div className="sg19__row" style={{ x: xR }}>
            {[...IMAGES.slice(4), ...IMAGES].map((src, i) => (
              <div key={i} className="sg19__img"><img src={src} alt="" loading="lazy" /></div>
            ))}
          </motion.div>
        </motion.div>
      </section>
    </div>
  );
};

// ============================================================
// V20 — BRUTALIST FREEDOM (Oversized type + images, raw energy)
// ============================================================

const V20 = () => {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end start'] });
  const x1 = useTransform(scrollYProgress, [0, 1], ['8%', '-35%']);
  const x2 = useTransform(scrollYProgress, [0, 1], ['-10%', '28%']);
  const x3 = useTransform(scrollYProgress, [0, 1], ['5%', '-25%']);

  return (
    <div ref={ref}>
      <style>{`
        .sg20 { background: #fff; padding: 0; overflow: hidden; display: flex; flex-direction: column; border-top: 4px solid #1a1a1a; border-bottom: 4px solid #1a1a1a; }
        .sg20__row { display: flex; gap: 0; white-space: nowrap; align-items: stretch; border-bottom: 2px solid #1a1a1a; }
        .sg20__row:last-child { border-bottom: none; }
        .sg20__huge { flex-shrink: 0; font-family: 'Space Grotesk', sans-serif; font-size: clamp(3.5rem, 7vw, 6rem); font-weight: 700; text-transform: uppercase; letter-spacing: -0.03em; line-height: 0.9; padding: 0.5rem 1rem; color: #1a1a1a; }
        .sg20__huge--ghost { color: transparent; -webkit-text-stroke: 2px #1a1a1a; }
        .sg20__img-block { flex-shrink: 0; width: 200px; height: 120px; overflow: hidden; border-left: 2px solid #1a1a1a; border-right: 2px solid #1a1a1a; }
        .sg20__img-block img { width: 100%; height: 100%; object-fit: cover; filter: grayscale(100%) contrast(1.3); }
        .sg20__mid { display: flex; align-items: center; gap: 2rem; padding: 0 2rem; }
        .sg20__mid-text { flex-shrink: 0; font-family: 'Share Tech Mono', monospace; font-size: 0.65rem; letter-spacing: 0.2em; text-transform: uppercase; color: #999; }
      `}</style>
      <section className="sg20">
        <motion.div className="sg20__row" style={{ x: x1 }}>
          {['SKIP', 'THE', 'M25'].map((word, i) => (
            <React.Fragment key={i}>
              <span className={`sg20__huge ${i === 1 ? 'sg20__huge--ghost' : ''}`}>{word}</span>
              <div className="sg20__img-block"><img src={IMAGES[i * 2]} alt="" loading="lazy" /></div>
            </React.Fragment>
          ))}
          {['ARRIVE', 'LIKE', 'BOND'].map((word, i) => (
            <React.Fragment key={`b${i}`}>
              <span className={`sg20__huge ${i === 1 ? 'sg20__huge--ghost' : ''}`}>{word}</span>
              <div className="sg20__img-block"><img src={IMAGES[i * 2 + 6]} alt="" loading="lazy" /></div>
            </React.Fragment>
          ))}
        </motion.div>
        <motion.div className="sg20__row sg20__mid" style={{ x: x2 }}>
          {[...DESTINATIONS, ...DESTINATIONS, ...DESTINATIONS].map((d, i) => (
            <span key={i} className="sg20__mid-text">{d.name} · {d.time}</span>
          ))}
        </motion.div>
        <motion.div className="sg20__row" style={{ x: x3 }}>
          {['LAND', 'AT', 'THE', 'DOOR'].map((word, i) => (
            <React.Fragment key={i}>
              <span className={`sg20__huge ${i % 3 === 1 ? 'sg20__huge--ghost' : ''}`}>{word}</span>
              {i < 3 && <div className="sg20__img-block"><img src={IMAGES[(i + 4) % IMAGES.length]} alt="" loading="lazy" /></div>}
            </React.Fragment>
          ))}
          {['TAKE', 'THE', 'SKY'].map((word, i) => (
            <React.Fragment key={`s${i}`}>
              <span className={`sg20__huge ${i === 1 ? 'sg20__huge--ghost' : ''}`}>{word}</span>
              <div className="sg20__img-block"><img src={IMAGES[(i + 8) % IMAGES.length]} alt="" loading="lazy" /></div>
            </React.Fragment>
          ))}
        </motion.div>
      </section>
    </div>
  );
};

// ============================================================
// V21 — TACTICAL OPS (Green monospace, spy HUD aesthetic)
// ============================================================

const V21 = () => {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end start'] });
  const xL = useTransform(scrollYProgress, [0, 1], ['8%', '-28%']);
  const xR = useTransform(scrollYProgress, [0, 1], ['-8%', '28%']);

  return (
    <div ref={ref}>
      <style>{`
        .sg21 { background: #0a0c0a; padding: 2.5rem 0; overflow: hidden; display: flex; flex-direction: column; gap: 0.75rem; border-top: 1px solid rgba(74,222,128,0.1); border-bottom: 1px solid rgba(74,222,128,0.1); }
        .sg21__row { display: flex; gap: 0.75rem; white-space: nowrap; }
        .sg21__img { flex-shrink: 0; width: 210px; height: 135px; border-radius: 4px; overflow: hidden; border: 1px solid rgba(74,222,128,0.08); }
        .sg21__img img { width: 100%; height: 100%; object-fit: cover; filter: brightness(0.65) contrast(1.15) hue-rotate(-10deg); transition: filter 0.3s; }
        .sg21__img:hover img { filter: brightness(0.85) contrast(1.1); }
        .sg21__dest { flex-shrink: 0; display: flex; align-items: center; gap: 1.25rem; padding: 0 1.5rem; }
        .sg21__dest-status { font-family: 'Share Tech Mono', monospace; font-size: 0.55rem; letter-spacing: 0.15em; text-transform: uppercase; color: #4ade80; }
        .sg21__dest-name { font-family: 'Space Grotesk', sans-serif; font-size: 1.05rem; font-weight: 600; text-transform: uppercase; letter-spacing: 0.04em; color: rgba(255,255,255,0.85); }
        .sg21__dest-coord { font-family: 'Share Tech Mono', monospace; font-size: 0.5rem; letter-spacing: 0.1em; color: rgba(74,222,128,0.35); }
        .sg21__dest-time { font-family: 'Share Tech Mono', monospace; font-size: 0.6rem; letter-spacing: 0.1em; color: rgba(255,255,255,0.3); }
        .sg21__dest-bar { width: 16px; height: 1px; background: rgba(74,222,128,0.2); flex-shrink: 0; }
      `}</style>
      <section className="sg21">
        <motion.div className="sg21__row" style={{ x: xL }}>
          {[...IMAGES, ...IMAGES.slice(0,6)].map((src, i) => (
            <div key={i} className="sg21__img"><img src={src} alt="" loading="lazy" /></div>
          ))}
        </motion.div>
        <motion.div className="sg21__row" style={{ x: xR }}>
          {[...DESTINATIONS, ...DESTINATIONS].map((d, i) => (
            <div key={i} className="sg21__dest">
              <span className="sg21__dest-status">● Online</span>
              <span className="sg21__dest-bar" />
              <span className="sg21__dest-name">{d.name}</span>
              <span className="sg21__dest-time">{d.time}</span>
              <span className="sg21__dest-coord">51.{Math.floor(Math.random()*900)+100}°N</span>
            </div>
          ))}
        </motion.div>
        <motion.div className="sg21__row" style={{ x: xR }}>
          {[...IMAGES.slice(6), ...IMAGES].map((src, i) => (
            <div key={i} className="sg21__img"><img src={src} alt="" loading="lazy" /></div>
          ))}
        </motion.div>
      </section>
    </div>
  );
};

// ============================================================
// V22 — MISSION BRIEFING (Tactical cards, green accents)
// ============================================================

const V22 = () => {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end start'] });
  const xL = useTransform(scrollYProgress, [0, 1], ['5%', '-22%']);
  const xR = useTransform(scrollYProgress, [0, 1], ['-5%', '22%']);

  return (
    <div ref={ref}>
      <style>{`
        .sg22 { background: #0c0d0c; padding: 2.5rem 0; overflow: hidden; display: flex; flex-direction: column; gap: 1rem; }
        .sg22__row { display: flex; gap: 1rem; white-space: nowrap; }
        .sg22__card { flex-shrink: 0; width: 320px; height: 165px; border-radius: 6px; overflow: hidden; display: flex; border: 1px solid rgba(74,222,128,0.08); background: rgba(255,255,255,0.02); }
        .sg22__card-img { width: 50%; height: 100%; }
        .sg22__card-img img { width: 100%; height: 100%; object-fit: cover; filter: brightness(0.75); }
        .sg22__card-info { width: 50%; padding: 1.25rem; display: flex; flex-direction: column; justify-content: center; gap: 0.5rem; }
        .sg22__card-dest { font-family: 'Space Grotesk', sans-serif; font-size: 1rem; font-weight: 700; text-transform: uppercase; color: #fff; letter-spacing: 0.02em; line-height: 1.2; white-space: normal; }
        .sg22__card-meta { font-family: 'Share Tech Mono', monospace; font-size: 0.55rem; letter-spacing: 0.12em; color: rgba(255,255,255,0.35); }
        .sg22__card-status { font-family: 'Share Tech Mono', monospace; font-size: 0.5rem; letter-spacing: 0.15em; text-transform: uppercase; color: #4ade80; margin-top: auto; }
        .sg22__statements { display: flex; gap: 3rem; padding: 0.25rem 0; }
        .sg22__stmt { flex-shrink: 0; font-family: 'Space Grotesk', sans-serif; font-size: clamp(1.5rem, 3vw, 2.2rem); font-weight: 700; text-transform: uppercase; letter-spacing: -0.01em; color: rgba(255,255,255,0.06); }
      `}</style>
      <section className="sg22">
        <motion.div className="sg22__row" style={{ x: xL }}>
          {[...DESTINATIONS, ...DESTINATIONS.slice(0,6)].map((d, i) => (
            <div key={i} className="sg22__card">
              <div className="sg22__card-img"><img src={IMAGES[i % IMAGES.length]} alt="" loading="lazy" /></div>
              <div className="sg22__card-info">
                <span className="sg22__card-dest">{d.name}</span>
                <span className="sg22__card-meta">{d.time} · Direct from Denham</span>
                <span className="sg22__card-status">● Route Clear</span>
              </div>
            </div>
          ))}
        </motion.div>
        <motion.div className="sg22__statements" style={{ x: xR }}>
          {[...STATEMENTS, ...STATEMENTS, ...STATEMENTS].map((s, i) => (
            <span key={i} className="sg22__stmt">{s}</span>
          ))}
        </motion.div>
        <motion.div className="sg22__row" style={{ x: xR }}>
          {[...DESTINATIONS.slice(6), ...DESTINATIONS].map((d, i) => (
            <div key={i} className="sg22__card">
              <div className="sg22__card-img"><img src={IMAGES[(i+4) % IMAGES.length]} alt="" loading="lazy" /></div>
              <div className="sg22__card-info">
                <span className="sg22__card-dest">{d.name}</span>
                <span className="sg22__card-meta">{d.time} · Direct from Denham</span>
                <span className="sg22__card-status">● Route Clear</span>
              </div>
            </div>
          ))}
        </motion.div>
      </section>
    </div>
  );
};

// ============================================================
// V23 — INTERCEPT (Big bold + green flight time tags)
// ============================================================

const V23 = () => {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end start'] });
  const xL = useTransform(scrollYProgress, [0, 1], ['10%', '-32%']);
  const xR = useTransform(scrollYProgress, [0, 1], ['-8%', '26%']);

  return (
    <div ref={ref}>
      <style>{`
        .sg23 { background: #0d0d0d; padding: 3rem 0; overflow: hidden; display: flex; flex-direction: column; gap: 1.25rem; }
        .sg23__row { display: flex; gap: 1.25rem; white-space: nowrap; align-items: center; }
        .sg23__img { flex-shrink: 0; width: 230px; height: 150px; border-radius: 6px; overflow: hidden; }
        .sg23__img img { width: 100%; height: 100%; object-fit: cover; filter: brightness(0.7); transition: filter 0.3s; }
        .sg23__img:hover img { filter: brightness(0.95); }
        .sg23__big { flex-shrink: 0; font-family: 'Space Grotesk', sans-serif; font-size: clamp(2.5rem, 5vw, 4rem); font-weight: 700; text-transform: uppercase; letter-spacing: -0.02em; color: rgba(255,255,255,0.07); line-height: 1; padding: 0 0.5rem; }
        .sg23__dest-row { display: flex; gap: 1.5rem; padding: 0.25rem 0; }
        .sg23__dest { flex-shrink: 0; display: flex; align-items: center; gap: 0.75rem; }
        .sg23__dest-name { font-family: 'Space Grotesk', sans-serif; font-size: 1rem; font-weight: 600; text-transform: uppercase; letter-spacing: 0.04em; color: rgba(255,255,255,0.85); }
        .sg23__dest-tag { font-family: 'Share Tech Mono', monospace; font-size: 0.5rem; letter-spacing: 0.1em; text-transform: uppercase; color: #0d0d0d; background: #4ade80; padding: 2px 8px; border-radius: 2px; font-weight: 600; }
        .sg23__dest-sep { width: 3px; height: 3px; border-radius: 50%; background: rgba(74,222,128,0.3); flex-shrink: 0; }
      `}</style>
      <section className="sg23">
        <motion.div className="sg23__row" style={{ x: xL }}>
          {[...IMAGES, ...IMAGES.slice(0,6)].map((src, i) => (
            <React.Fragment key={i}>
              <div className="sg23__img"><img src={src} alt="" loading="lazy" /></div>
              {i % 3 === 0 && <span className="sg23__big">{STATEMENTS[i % STATEMENTS.length]}</span>}
            </React.Fragment>
          ))}
        </motion.div>
        <motion.div className="sg23__dest-row" style={{ x: xR }}>
          {[...DESTINATIONS, ...DESTINATIONS].map((d, i) => (
            <React.Fragment key={i}>
              <span className="sg23__dest">
                <span className="sg23__dest-name">{d.name}</span>
                <span className="sg23__dest-tag">{d.time}</span>
              </span>
              <span className="sg23__dest-sep" />
            </React.Fragment>
          ))}
        </motion.div>
        <motion.div className="sg23__row" style={{ x: xR }}>
          {[...IMAGES.slice(4), ...IMAGES].map((src, i) => (
            <React.Fragment key={i}>
              <div className="sg23__img"><img src={src} alt="" loading="lazy" /></div>
              {i % 4 === 2 && <span className="sg23__big">{STATEMENTS[(i+3) % STATEMENTS.length]}</span>}
            </React.Fragment>
          ))}
        </motion.div>
      </section>
    </div>
  );
};

// ============================================================
// V24 — FLIGHT PLAN (Two-line destination + route info)
// ============================================================

const V24 = () => {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end start'] });
  const xL = useTransform(scrollYProgress, [0, 1], ['6%', '-24%']);
  const xR = useTransform(scrollYProgress, [0, 1], ['-6%', '24%']);

  return (
    <div ref={ref}>
      <style>{`
        .sg24 { background: #0a0a0a; padding: 2rem 0; overflow: hidden; display: flex; flex-direction: column; gap: 0.5rem; }
        .sg24__img-row { display: flex; gap: 6px; white-space: nowrap; }
        .sg24__img { flex-shrink: 0; width: 190px; height: 120px; overflow: hidden; border-radius: 3px; }
        .sg24__img img { width: 100%; height: 100%; object-fit: cover; filter: brightness(0.7) contrast(1.1); }
        .sg24__route-row { display: flex; gap: 0; white-space: nowrap; }
        .sg24__route { flex-shrink: 0; display: flex; align-items: center; padding: 0.75rem 2rem; border-right: 1px solid rgba(255,255,255,0.04); gap: 1.5rem; }
        .sg24__route-from { font-family: 'Share Tech Mono', monospace; font-size: 0.55rem; letter-spacing: 0.1em; color: rgba(255,255,255,0.3); text-transform: uppercase; }
        .sg24__route-arrow { font-family: 'Share Tech Mono', monospace; font-size: 0.6rem; color: #4ade80; }
        .sg24__route-to { font-family: 'Space Grotesk', sans-serif; font-size: 0.95rem; font-weight: 600; text-transform: uppercase; letter-spacing: 0.03em; color: rgba(255,255,255,0.9); }
        .sg24__route-time { font-family: 'Share Tech Mono', monospace; font-size: 0.55rem; letter-spacing: 0.1em; color: rgba(74,222,128,0.6); }
      `}</style>
      <section className="sg24">
        <motion.div className="sg24__img-row" style={{ x: xL }}>
          {[...IMAGES, ...IMAGES].map((src, i) => (
            <div key={i} className="sg24__img"><img src={src} alt="" loading="lazy" /></div>
          ))}
        </motion.div>
        <motion.div className="sg24__route-row" style={{ x: xR }}>
          {[...DESTINATIONS, ...DESTINATIONS, ...DESTINATIONS].map((d, i) => (
            <div key={i} className="sg24__route">
              <span className="sg24__route-from">Denham</span>
              <span className="sg24__route-arrow">→</span>
              <span className="sg24__route-to">{d.name}</span>
              <span className="sg24__route-time">{d.time}</span>
            </div>
          ))}
        </motion.div>
        <motion.div className="sg24__img-row" style={{ x: xR }}>
          {[...IMAGES.slice(6), ...IMAGES, ...IMAGES.slice(0,6)].map((src, i) => (
            <div key={i} className="sg24__img"><img src={src} alt="" loading="lazy" /></div>
          ))}
        </motion.div>
      </section>
    </div>
  );
};

// ============================================================
// V25 — COMM CHANNEL (Radio comms aesthetic, green scanlines)
// ============================================================

const V25 = () => {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end start'] });
  const xL = useTransform(scrollYProgress, [0, 1], ['8%', '-26%']);
  const xR = useTransform(scrollYProgress, [0, 1], ['-8%', '26%']);

  return (
    <div ref={ref}>
      <style>{`
        .sg25 { background: #070a07; padding: 2rem 0; overflow: hidden; display: flex; flex-direction: column; gap: 0.5rem; position: relative; }
        .sg25::after { content: ''; position: absolute; inset: 0; background: repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(74,222,128,0.015) 2px, rgba(74,222,128,0.015) 4px); pointer-events: none; }
        .sg25__row { display: flex; gap: 0.75rem; white-space: nowrap; position: relative; z-index: 1; }
        .sg25__img { flex-shrink: 0; width: 200px; height: 125px; border-radius: 2px; overflow: hidden; border: 1px solid rgba(74,222,128,0.06); }
        .sg25__img img { width: 100%; height: 100%; object-fit: cover; filter: brightness(0.5) contrast(1.2) saturate(0.6); }
        .sg25__msg { flex-shrink: 0; display: flex; align-items: center; gap: 1rem; padding: 0 1.5rem; }
        .sg25__msg-prefix { font-family: 'Share Tech Mono', monospace; font-size: 0.55rem; letter-spacing: 0.15em; color: #4ade80; text-transform: uppercase; }
        .sg25__msg-text { font-family: 'Space Grotesk', sans-serif; font-size: 0.95rem; font-weight: 500; text-transform: uppercase; letter-spacing: 0.05em; color: rgba(255,255,255,0.75); }
        .sg25__msg-time { font-family: 'Share Tech Mono', monospace; font-size: 0.5rem; letter-spacing: 0.1em; color: rgba(74,222,128,0.4); }
      `}</style>
      <section className="sg25">
        <motion.div className="sg25__row" style={{ x: xL }}>
          {[...IMAGES, ...IMAGES.slice(0,8)].map((src, i) => (
            <div key={i} className="sg25__img"><img src={src} alt="" loading="lazy" /></div>
          ))}
        </motion.div>
        <motion.div className="sg25__row" style={{ x: xR }}>
          {[...DESTINATIONS, ...DESTINATIONS, ...DESTINATIONS].map((d, i) => (
            <div key={i} className="sg25__msg">
              <span className="sg25__msg-prefix">DEST</span>
              <span className="sg25__msg-text">{d.name}</span>
              <span className="sg25__msg-time">ETA {d.time}</span>
            </div>
          ))}
        </motion.div>
        <motion.div className="sg25__row" style={{ x: xR }}>
          {[...IMAGES.slice(4), ...IMAGES, ...IMAGES.slice(0,4)].map((src, i) => (
            <div key={i} className="sg25__img"><img src={src} alt="" loading="lazy" /></div>
          ))}
        </motion.div>
        <motion.div className="sg25__row" style={{ x: xL }}>
          {[...LIFESTYLES, ...LIFESTYLES, ...LIFESTYLES, ...LIFESTYLES].map((t, i) => (
            <div key={i} className="sg25__msg">
              <span className="sg25__msg-prefix">LOG</span>
              <span style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: '0.8rem', fontStyle: 'italic', color: 'rgba(255,255,255,0.35)' }}>{t}</span>
            </div>
          ))}
        </motion.div>
      </section>
    </div>
  );
};

// ============================================================
// V26 — BOLD DESTINATIONS (Huge dest names + small images)
// ============================================================

const V26 = () => {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end start'] });
  const xL = useTransform(scrollYProgress, [0, 1], ['12%', '-35%']);
  const xR = useTransform(scrollYProgress, [0, 1], ['-10%', '30%']);

  return (
    <div ref={ref}>
      <style>{`
        .sg26 { background: #0d0d0d; padding: 2.5rem 0; overflow: hidden; display: flex; flex-direction: column; gap: 0.5rem; }
        .sg26__huge-row { display: flex; align-items: center; gap: 1.5rem; white-space: nowrap; }
        .sg26__huge { font-family: 'Space Grotesk', sans-serif; font-size: clamp(3rem, 6vw, 5rem); font-weight: 700; text-transform: uppercase; letter-spacing: -0.02em; color: rgba(255,255,255,0.9); flex-shrink: 0; line-height: 1; }
        .sg26__huge-time { font-family: 'Share Tech Mono', monospace; font-size: 0.6rem; letter-spacing: 0.15em; color: #4ade80; flex-shrink: 0; align-self: flex-end; margin-bottom: 0.5rem; }
        .sg26__huge-sep { width: 40px; height: 2px; background: rgba(74,222,128,0.2); flex-shrink: 0; }
        .sg26__img-row { display: flex; gap: 0.75rem; white-space: nowrap; }
        .sg26__img { flex-shrink: 0; width: 160px; height: 100px; border-radius: 4px; overflow: hidden; }
        .sg26__img img { width: 100%; height: 100%; object-fit: cover; filter: brightness(0.7); }
        .sg26__life-row { display: flex; gap: 2.5rem; padding: 0.25rem 0; }
        .sg26__life { flex-shrink: 0; font-family: 'Space Grotesk', sans-serif; font-size: 0.85rem; font-style: italic; color: rgba(255,255,255,0.3); }
      `}</style>
      <section className="sg26">
        <motion.div className="sg26__huge-row" style={{ x: xL }}>
          {[...DESTINATIONS, ...DESTINATIONS.slice(0,4)].map((d, i) => (
            <React.Fragment key={i}>
              <span className="sg26__huge">{d.name}</span>
              <span className="sg26__huge-time">{d.time}</span>
              <span className="sg26__huge-sep" />
            </React.Fragment>
          ))}
        </motion.div>
        <motion.div className="sg26__img-row" style={{ x: xR }}>
          {[...IMAGES, ...IMAGES, ...IMAGES.slice(0,4)].map((src, i) => (
            <div key={i} className="sg26__img"><img src={src} alt="" loading="lazy" /></div>
          ))}
        </motion.div>
        <motion.div className="sg26__life-row" style={{ x: xL }}>
          {[...LIFESTYLES, ...LIFESTYLES, ...LIFESTYLES, ...LIFESTYLES].map((t, i) => (
            <span key={i} className="sg26__life">{t}</span>
          ))}
        </motion.div>
      </section>
    </div>
  );
};

// ============================================================
// V27 — DOUBLE PUNCH (Two large statement lines opposing)
// ============================================================

const V27 = () => {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end start'] });
  const xL = useTransform(scrollYProgress, [0, 1], ['15%', '-40%']);
  const xR = useTransform(scrollYProgress, [0, 1], ['-15%', '40%']);
  const xM = useTransform(scrollYProgress, [0, 1], ['5%', '-18%']);

  const line1 = ['SKIP', 'THE', 'TRAFFIC', '·', 'TAKE', 'THE', 'SKY', '·', 'LAND', 'AT', 'THE', 'DOOR'];
  const line2 = ['YOUR', 'HELICOPTER', '·', 'YOUR', 'SCHEDULE', '·', 'YOUR', 'FREEDOM'];

  return (
    <div ref={ref}>
      <style>{`
        .sg27 { background: #0a0a0a; padding: 2rem 0; overflow: hidden; display: flex; flex-direction: column; gap: 0.75rem; position: relative; }
        .sg27::before, .sg27::after { content: ''; position: absolute; top: 0; bottom: 0; width: 120px; z-index: 10; pointer-events: none; }
        .sg27::before { left: 0; background: linear-gradient(to right, #0a0a0a, transparent); }
        .sg27::after { right: 0; background: linear-gradient(to left, #0a0a0a, transparent); }
        .sg27__line { display: flex; align-items: center; gap: 2rem; white-space: nowrap; padding: 0.5rem 0; }
        .sg27__word { font-family: 'Space Grotesk', sans-serif; font-size: clamp(1.8rem, 3.5vw, 3rem); font-weight: 700; text-transform: uppercase; letter-spacing: 0.05em; flex-shrink: 0; }
        .sg27__word--bright { color: rgba(255,255,255,0.9); }
        .sg27__word--dim { color: rgba(255,255,255,0.12); }
        .sg27__word--green { color: #4ade80; }
        .sg27__dot { width: 6px; height: 6px; border-radius: 50%; background: rgba(74,222,128,0.3); flex-shrink: 0; }
        .sg27__img-row { display: flex; gap: 0.75rem; white-space: nowrap; }
        .sg27__img { flex-shrink: 0; width: 200px; height: 125px; border-radius: 4px; overflow: hidden; }
        .sg27__img img { width: 100%; height: 100%; object-fit: cover; filter: brightness(0.65); }
      `}</style>
      <section className="sg27">
        <motion.div className="sg27__line" style={{ x: xL }}>
          {[...line1, ...line1].map((w, i) => (
            w === '·' ? <span key={i} className="sg27__dot" /> :
            <span key={i} className={`sg27__word ${['SKIP', 'SKY', 'LAND', 'DOOR'].includes(w) ? 'sg27__word--bright' : ['TRAFFIC'].includes(w) ? 'sg27__word--green' : 'sg27__word--dim'}`}>{w}</span>
          ))}
        </motion.div>
        <motion.div className="sg27__img-row" style={{ x: xM }}>
          {[...IMAGES, ...IMAGES.slice(0,8)].map((src, i) => (
            <div key={i} className="sg27__img"><img src={src} alt="" loading="lazy" /></div>
          ))}
        </motion.div>
        <motion.div className="sg27__line" style={{ x: xR }}>
          {[...line2, ...line2, ...line2].map((w, i) => (
            w === '·' ? <span key={i} className="sg27__dot" /> :
            <span key={i} className={`sg27__word ${['HELICOPTER', 'SCHEDULE', 'FREEDOM'].includes(w) ? 'sg27__word--bright' : 'sg27__word--dim'}`}>{w}</span>
          ))}
        </motion.div>
      </section>
    </div>
  );
};

// ============================================================
// V28 — TACTICAL TICKER (Auto-scroll with green HUD overlay)
// ============================================================

const V28 = () => {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end start'] });
  const xShift = useTransform(scrollYProgress, [0, 1], ['0%', '-6%']);

  return (
    <div ref={ref}>
      <style>{`
        .sg28 { background: #080a08; padding: 1.5rem 0; overflow: hidden; display: flex; flex-direction: column; gap: 0; position: relative; border-top: 1px solid rgba(74,222,128,0.12); border-bottom: 1px solid rgba(74,222,128,0.12); }
        .sg28__tape { display: flex; white-space: nowrap; will-change: transform; }
        .sg28__tape--img { animation: sg28l 45s linear infinite; gap: 4px; }
        .sg28__tape--dest { animation: sg28r 35s linear infinite; padding: 0.5rem 0; }
        .sg28__tape--img2 { animation: sg28l 50s linear infinite; gap: 4px; }
        @keyframes sg28l { from { transform: translateX(0); } to { transform: translateX(-50%); } }
        @keyframes sg28r { from { transform: translateX(-50%); } to { transform: translateX(0); } }
        .sg28__img { flex-shrink: 0; width: 175px; height: 108px; overflow: hidden; border-radius: 2px; border: 1px solid rgba(74,222,128,0.05); }
        .sg28__img img { width: 100%; height: 100%; object-fit: cover; filter: brightness(0.55) contrast(1.15) saturate(0.7); }
        .sg28__dest { flex-shrink: 0; display: inline-flex; align-items: center; gap: 1rem; padding: 0 2rem; }
        .sg28__dest-pip { width: 4px; height: 4px; border-radius: 50%; background: #4ade80; box-shadow: 0 0 6px rgba(74,222,128,0.4); flex-shrink: 0; }
        .sg28__dest-name { font-family: 'Space Grotesk', sans-serif; font-size: 0.9rem; font-weight: 600; text-transform: uppercase; letter-spacing: 0.05em; color: rgba(255,255,255,0.7); }
        .sg28__dest-eta { font-family: 'Share Tech Mono', monospace; font-size: 0.5rem; letter-spacing: 0.12em; color: rgba(74,222,128,0.5); text-transform: uppercase; }
      `}</style>
      <section className="sg28">
        <motion.div style={{ x: xShift }}>
          <div className="sg28__tape sg28__tape--img">
            {[...IMAGES, ...IMAGES].map((src, i) => (
              <div key={i} className="sg28__img"><img src={src} alt="" loading="lazy" /></div>
            ))}
          </div>
        </motion.div>
        <div className="sg28__tape sg28__tape--dest">
          {[...DESTINATIONS, ...DESTINATIONS, ...DESTINATIONS, ...DESTINATIONS].map((d, i) => (
            <span key={i} className="sg28__dest">
              <span className="sg28__dest-pip" />
              <span className="sg28__dest-name">{d.name}</span>
              <span className="sg28__dest-eta">ETA {d.time}</span>
            </span>
          ))}
        </div>
        <motion.div style={{ x: xShift }}>
          <div className="sg28__tape sg28__tape--img2">
            {[...IMAGES.slice(6), ...IMAGES, ...IMAGES.slice(0,6)].map((src, i) => (
              <div key={i} className="sg28__img"><img src={src} alt="" loading="lazy" /></div>
            ))}
          </div>
        </motion.div>
      </section>
    </div>
  );
};

// ============================================================
// V29 — EXECUTIVE WARM (Light, gold accents, premium feel)
// ============================================================

const V29 = () => {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end start'] });
  const xL = useTransform(scrollYProgress, [0, 1], ['6%', '-22%']);
  const xR = useTransform(scrollYProgress, [0, 1], ['-6%', '22%']);

  return (
    <div ref={ref}>
      <style>{`
        .sg29 { background: #faf9f6; padding: 3rem 0; overflow: hidden; display: flex; flex-direction: column; gap: 1.25rem; border-top: 1px solid #e8e6e2; border-bottom: 1px solid #e8e6e2; }
        .sg29__row { display: flex; gap: 1.25rem; white-space: nowrap; }
        .sg29__img { flex-shrink: 0; width: 240px; height: 155px; border-radius: 6px; overflow: hidden; box-shadow: 0 2px 16px rgba(0,0,0,0.08); }
        .sg29__img img { width: 100%; height: 100%; object-fit: cover; }
        .sg29__dest-row { display: flex; gap: 2rem; padding: 0.25rem 0; }
        .sg29__dest { flex-shrink: 0; display: flex; align-items: baseline; gap: 0.75rem; }
        .sg29__dest-name { font-family: 'Space Grotesk', sans-serif; font-size: 1.05rem; font-weight: 600; text-transform: uppercase; letter-spacing: 0.04em; color: #1a1a1a; }
        .sg29__dest-time { font-family: 'Share Tech Mono', monospace; font-size: 0.55rem; letter-spacing: 0.12em; color: #c59b4c; text-transform: uppercase; }
        .sg29__dest-dot { width: 4px; height: 4px; border-radius: 50%; background: #c59b4c; flex-shrink: 0; align-self: center; }
        .sg29__life-row { display: flex; gap: 3rem; }
        .sg29__life { flex-shrink: 0; font-family: 'Space Grotesk', sans-serif; font-size: 0.9rem; font-style: italic; color: #888; }
      `}</style>
      <section className="sg29">
        <motion.div className="sg29__row" style={{ x: xL }}>
          {[...IMAGES, ...IMAGES.slice(0,6)].map((src, i) => (
            <div key={i} className="sg29__img"><img src={src} alt="" loading="lazy" /></div>
          ))}
        </motion.div>
        <motion.div className="sg29__dest-row" style={{ x: xR }}>
          {[...DESTINATIONS, ...DESTINATIONS, ...DESTINATIONS].map((d, i) => (
            <React.Fragment key={i}>
              <span className="sg29__dest">
                <span className="sg29__dest-name">{d.name}</span>
                <span className="sg29__dest-time">{d.time}</span>
              </span>
              <span className="sg29__dest-dot" />
            </React.Fragment>
          ))}
        </motion.div>
        <motion.div className="sg29__row" style={{ x: xR }}>
          {[...IMAGES.slice(6), ...IMAGES].map((src, i) => (
            <div key={i} className="sg29__img"><img src={src} alt="" loading="lazy" /></div>
          ))}
        </motion.div>
        <motion.div className="sg29__life-row" style={{ x: xL }}>
          {[...LIFESTYLES, ...LIFESTYLES, ...LIFESTYLES, ...LIFESTYLES].map((t, i) => (
            <span key={i} className="sg29__life">{t}</span>
          ))}
        </motion.div>
      </section>
    </div>
  );
};

// ============================================================
// V30 — ARRIVAL STORIES (Lifestyle text big, images small)
// ============================================================

const V30 = () => {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end start'] });
  const xL = useTransform(scrollYProgress, [0, 1], ['10%', '-30%']);
  const xR = useTransform(scrollYProgress, [0, 1], ['-8%', '25%']);

  return (
    <div ref={ref}>
      <style>{`
        .sg30 { background: #1a1a1a; padding: 3rem 0; overflow: hidden; display: flex; flex-direction: column; gap: 1rem; }
        .sg30__story-row { display: flex; align-items: center; gap: 2rem; white-space: nowrap; }
        .sg30__story { flex-shrink: 0; font-family: 'Space Grotesk', sans-serif; font-size: clamp(1.2rem, 2.5vw, 1.8rem); font-weight: 400; font-style: italic; color: rgba(255,255,255,0.5); letter-spacing: 0.01em; }
        .sg30__story em { font-style: normal; font-weight: 700; color: rgba(255,255,255,0.9); }
        .sg30__story-dot { width: 5px; height: 5px; border-radius: 50%; background: rgba(74,222,128,0.4); flex-shrink: 0; }
        .sg30__img-row { display: flex; gap: 0.75rem; white-space: nowrap; }
        .sg30__img { flex-shrink: 0; width: 160px; height: 100px; border-radius: 4px; overflow: hidden; }
        .sg30__img img { width: 100%; height: 100%; object-fit: cover; filter: brightness(0.7); }
        .sg30__dest-row { display: flex; gap: 2rem; padding: 0.25rem 0; }
        .sg30__dest { flex-shrink: 0; font-family: 'Share Tech Mono', monospace; font-size: 0.6rem; letter-spacing: 0.12em; text-transform: uppercase; color: rgba(255,255,255,0.3); }
        .sg30__dest-g { color: rgba(74,222,128,0.5); }
      `}</style>
      <section className="sg30">
        <motion.div className="sg30__story-row" style={{ x: xL }}>
          {[...LIFESTYLES, ...LIFESTYLES].map((t, i) => {
            const parts = t.split('.');
            return (
              <React.Fragment key={i}>
                <span className="sg30__story"><em>{parts[0]}.</em>{parts[1] || ''}</span>
                <span className="sg30__story-dot" />
              </React.Fragment>
            );
          })}
        </motion.div>
        <motion.div className="sg30__img-row" style={{ x: xR }}>
          {[...IMAGES, ...IMAGES, ...IMAGES.slice(0,4)].map((src, i) => (
            <div key={i} className="sg30__img"><img src={src} alt="" loading="lazy" /></div>
          ))}
        </motion.div>
        <motion.div className="sg30__dest-row" style={{ x: xL }}>
          {[...DESTINATIONS, ...DESTINATIONS, ...DESTINATIONS].map((d, i) => (
            <span key={i} className="sg30__dest">{d.name} <span className="sg30__dest-g">· {d.time}</span></span>
          ))}
        </motion.div>
      </section>
    </div>
  );
};

// ============================================================
// V31 — MONOCHROME + GREEN TAG (B&W images, green time pills)
// ============================================================

const V31 = () => {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end start'] });
  const xL = useTransform(scrollYProgress, [0, 1], ['7%', '-25%']);
  const xR = useTransform(scrollYProgress, [0, 1], ['-7%', '25%']);

  return (
    <div ref={ref}>
      <style>{`
        .sg31 { background: #fff; padding: 2.5rem 0; overflow: hidden; display: flex; flex-direction: column; gap: 1rem; border-top: 2px solid #1a1a1a; border-bottom: 2px solid #1a1a1a; }
        .sg31__row { display: flex; gap: 1rem; white-space: nowrap; }
        .sg31__img { flex-shrink: 0; width: 210px; height: 135px; border-radius: 4px; overflow: hidden; }
        .sg31__img img { width: 100%; height: 100%; object-fit: cover; filter: grayscale(100%) contrast(1.1); transition: filter 0.3s; }
        .sg31__img:hover img { filter: grayscale(0%); }
        .sg31__dest-row { display: flex; gap: 1.5rem; padding: 0.25rem 0; }
        .sg31__dest { flex-shrink: 0; display: flex; align-items: center; gap: 0.75rem; }
        .sg31__dest-name { font-family: 'Space Grotesk', sans-serif; font-size: 1rem; font-weight: 700; text-transform: uppercase; letter-spacing: 0.03em; color: #1a1a1a; }
        .sg31__dest-pill { font-family: 'Share Tech Mono', monospace; font-size: 0.5rem; letter-spacing: 0.1em; text-transform: uppercase; color: #fff; background: #16a34a; padding: 3px 10px; border-radius: 10px; }
        .sg31__sep { width: 3px; height: 3px; border-radius: 50%; background: #ccc; flex-shrink: 0; }
      `}</style>
      <section className="sg31">
        <motion.div className="sg31__row" style={{ x: xL }}>
          {[...IMAGES, ...IMAGES].map((src, i) => (
            <div key={i} className="sg31__img"><img src={src} alt="" loading="lazy" /></div>
          ))}
        </motion.div>
        <motion.div className="sg31__dest-row" style={{ x: xR }}>
          {[...DESTINATIONS, ...DESTINATIONS, ...DESTINATIONS].map((d, i) => (
            <React.Fragment key={i}>
              <span className="sg31__dest">
                <span className="sg31__dest-name">{d.name}</span>
                <span className="sg31__dest-pill">{d.time}</span>
              </span>
              <span className="sg31__sep" />
            </React.Fragment>
          ))}
        </motion.div>
        <motion.div className="sg31__row" style={{ x: xR }}>
          {[...IMAGES.slice(6), ...IMAGES, ...IMAGES.slice(0,6)].map((src, i) => (
            <div key={i} className="sg31__img"><img src={src} alt="" loading="lazy" /></div>
          ))}
        </motion.div>
      </section>
    </div>
  );
};

// ============================================================
// V32 — NIGHT OPS (Very dark, minimal green HUD lines)
// ============================================================

const V32 = () => {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end start'] });
  const xL = useTransform(scrollYProgress, [0, 1], ['8%', '-28%']);
  const xR = useTransform(scrollYProgress, [0, 1], ['-8%', '28%']);

  return (
    <div ref={ref}>
      <style>{`
        .sg32 { background: #050705; padding: 2.5rem 0; overflow: hidden; display: flex; flex-direction: column; gap: 0.5rem; }
        .sg32__row { display: flex; gap: 4px; white-space: nowrap; }
        .sg32__img { flex-shrink: 0; width: 200px; height: 125px; overflow: hidden; position: relative; }
        .sg32__img img { width: 100%; height: 100%; object-fit: cover; filter: brightness(0.35) contrast(1.2) saturate(0.5); transition: filter 0.4s; }
        .sg32__img:hover img { filter: brightness(0.65) contrast(1.1) saturate(0.8); }
        .sg32__img::after { content: ''; position: absolute; inset: 0; border: 1px solid rgba(74,222,128,0.04); }
        .sg32__hud { display: flex; gap: 0; white-space: nowrap; border-top: 1px solid rgba(74,222,128,0.06); border-bottom: 1px solid rgba(74,222,128,0.06); }
        .sg32__hud-item { flex-shrink: 0; padding: 0.6rem 2rem; border-right: 1px solid rgba(74,222,128,0.04); display: flex; align-items: center; gap: 1rem; }
        .sg32__hud-dest { font-family: 'Space Grotesk', sans-serif; font-size: 0.85rem; font-weight: 600; text-transform: uppercase; letter-spacing: 0.05em; color: rgba(255,255,255,0.6); }
        .sg32__hud-data { font-family: 'Share Tech Mono', monospace; font-size: 0.5rem; letter-spacing: 0.12em; color: rgba(74,222,128,0.45); }
        .sg32__hud-pip { width: 3px; height: 3px; border-radius: 50%; background: #4ade80; box-shadow: 0 0 4px rgba(74,222,128,0.3); flex-shrink: 0; }
      `}</style>
      <section className="sg32">
        <motion.div className="sg32__row" style={{ x: xL }}>
          {[...IMAGES, ...IMAGES].map((src, i) => (
            <div key={i} className="sg32__img"><img src={src} alt="" loading="lazy" /></div>
          ))}
        </motion.div>
        <motion.div className="sg32__hud" style={{ x: xR }}>
          {[...DESTINATIONS, ...DESTINATIONS, ...DESTINATIONS].map((d, i) => (
            <div key={i} className="sg32__hud-item">
              <span className="sg32__hud-pip" />
              <span className="sg32__hud-dest">{d.name}</span>
              <span className="sg32__hud-data">ETA {d.time} · DIRECT</span>
            </div>
          ))}
        </motion.div>
        <motion.div className="sg32__row" style={{ x: xR }}>
          {[...IMAGES.slice(6), ...IMAGES, ...IMAGES.slice(0,6)].map((src, i) => (
            <div key={i} className="sg32__img"><img src={src} alt="" loading="lazy" /></div>
          ))}
        </motion.div>
      </section>
    </div>
  );
};

// ============================================================
// V33 — STATEMENT + DESTINATION GRID (Bold text interlaced)
// ============================================================

const V33 = () => {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end start'] });
  const xL = useTransform(scrollYProgress, [0, 1], ['10%', '-32%']);
  const xR = useTransform(scrollYProgress, [0, 1], ['-8%', '26%']);
  const xM = useTransform(scrollYProgress, [0, 1], ['4%', '-16%']);

  return (
    <div ref={ref}>
      <style>{`
        .sg33 { background: #0d0d0d; padding: 3rem 0; overflow: hidden; display: flex; flex-direction: column; gap: 0.75rem; }
        .sg33__stmt-row { display: flex; align-items: center; gap: 1.5rem; white-space: nowrap; padding: 0.25rem 0; }
        .sg33__stmt { flex-shrink: 0; font-family: 'Space Grotesk', sans-serif; font-size: clamp(2rem, 4vw, 3.5rem); font-weight: 700; text-transform: uppercase; letter-spacing: -0.01em; color: rgba(255,255,255,0.06); line-height: 1; }
        .sg33__stmt--lit { color: rgba(255,255,255,0.85); }
        .sg33__img-row { display: flex; gap: 0.75rem; white-space: nowrap; }
        .sg33__img { flex-shrink: 0; width: 195px; height: 125px; border-radius: 4px; overflow: hidden; }
        .sg33__img img { width: 100%; height: 100%; object-fit: cover; filter: brightness(0.75); }
        .sg33__dest-row { display: flex; gap: 1.5rem; padding: 0.25rem 0; }
        .sg33__dest { flex-shrink: 0; display: flex; align-items: center; gap: 0.5rem; }
        .sg33__dest-name { font-family: 'Space Grotesk', sans-serif; font-size: 0.9rem; font-weight: 600; text-transform: uppercase; letter-spacing: 0.04em; color: rgba(255,255,255,0.7); }
        .sg33__dest-tag { font-family: 'Share Tech Mono', monospace; font-size: 0.45rem; letter-spacing: 0.1em; background: rgba(74,222,128,0.15); color: #4ade80; padding: 2px 7px; border-radius: 2px; text-transform: uppercase; }
      `}</style>
      <section className="sg33">
        <motion.div className="sg33__stmt-row" style={{ x: xL }}>
          {['Cotswolds Lunch.', 'Home by 3.', '·', 'Goodwood Races.', 'Land Trackside.', '·', 'Golf at St Andrews.', 'Breakfast at Denham.'].map((w, i) => (
            w === '·' ? <span key={i} style={{ width: 5, height: 5, borderRadius: '50%', background: 'rgba(74,222,128,0.3)', flexShrink: 0 }} /> :
            <span key={i} className={`sg33__stmt ${i % 3 === 0 ? 'sg33__stmt--lit' : ''}`}>{w}</span>
          ))}
        </motion.div>
        <motion.div className="sg33__img-row" style={{ x: xR }}>
          {[...IMAGES, ...IMAGES.slice(0,8)].map((src, i) => (
            <div key={i} className="sg33__img"><img src={src} alt="" loading="lazy" /></div>
          ))}
        </motion.div>
        <motion.div className="sg33__dest-row" style={{ x: xM }}>
          {[...DESTINATIONS, ...DESTINATIONS, ...DESTINATIONS].map((d, i) => (
            <span key={i} className="sg33__dest">
              <span className="sg33__dest-name">{d.name}</span>
              <span className="sg33__dest-tag">{d.time}</span>
            </span>
          ))}
        </motion.div>
      </section>
    </div>
  );
};

// ============================================================
// V34 — CLASSIFIED (Redacted / declassified document feel)
// ============================================================

const V34 = () => {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end start'] });
  const xL = useTransform(scrollYProgress, [0, 1], ['6%', '-24%']);
  const xR = useTransform(scrollYProgress, [0, 1], ['-6%', '24%']);

  return (
    <div ref={ref}>
      <style>{`
        .sg34 { background: #0c0c0c; padding: 2.5rem 0; overflow: hidden; display: flex; flex-direction: column; gap: 0.75rem; }
        .sg34__row { display: flex; gap: 0.75rem; white-space: nowrap; }
        .sg34__img { flex-shrink: 0; width: 200px; height: 130px; border-radius: 2px; overflow: hidden; position: relative; }
        .sg34__img img { width: 100%; height: 100%; object-fit: cover; filter: brightness(0.6) contrast(1.15); }
        .sg34__img-badge { position: absolute; top: 8px; left: 8px; font-family: 'Share Tech Mono', monospace; font-size: 0.45rem; letter-spacing: 0.15em; text-transform: uppercase; color: #4ade80; background: rgba(0,0,0,0.7); padding: 2px 6px; border-radius: 2px; }
        .sg34__file-row { display: flex; gap: 0; white-space: nowrap; }
        .sg34__file { flex-shrink: 0; padding: 0.75rem 2rem; border-right: 1px solid rgba(255,255,255,0.03); display: flex; align-items: center; gap: 1.25rem; }
        .sg34__file-class { font-family: 'Share Tech Mono', monospace; font-size: 0.5rem; letter-spacing: 0.15em; text-transform: uppercase; color: #4ade80; border: 1px solid rgba(74,222,128,0.2); padding: 1px 6px; border-radius: 2px; }
        .sg34__file-dest { font-family: 'Space Grotesk', sans-serif; font-size: 0.95rem; font-weight: 600; text-transform: uppercase; letter-spacing: 0.03em; color: rgba(255,255,255,0.85); }
        .sg34__file-data { font-family: 'Share Tech Mono', monospace; font-size: 0.5rem; letter-spacing: 0.1em; color: rgba(255,255,255,0.25); }
      `}</style>
      <section className="sg34">
        <motion.div className="sg34__row" style={{ x: xL }}>
          {[...IMAGES, ...IMAGES.slice(0,6)].map((src, i) => (
            <div key={i} className="sg34__img">
              <img src={src} alt="" loading="lazy" />
              <span className="sg34__img-badge">File {String(i+1).padStart(3,'0')}</span>
            </div>
          ))}
        </motion.div>
        <motion.div className="sg34__file-row" style={{ x: xR }}>
          {[...DESTINATIONS, ...DESTINATIONS, ...DESTINATIONS].map((d, i) => (
            <div key={i} className="sg34__file">
              <span className="sg34__file-class">Cleared</span>
              <span className="sg34__file-dest">{d.name}</span>
              <span className="sg34__file-data">ETA {d.time} · VFR Direct</span>
            </div>
          ))}
        </motion.div>
        <motion.div className="sg34__row" style={{ x: xR }}>
          {[...IMAGES.slice(4), ...IMAGES].map((src, i) => (
            <div key={i} className="sg34__img">
              <img src={src} alt="" loading="lazy" />
              <span className="sg34__img-badge">File {String(i+19).padStart(3,'0')}</span>
            </div>
          ))}
        </motion.div>
      </section>
    </div>
  );
};

// ============================================================
// V35 — THE EXPERIENCE (Split: bold statement left, images right)
// ============================================================

const V35 = () => {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end start'] });
  const yUp = useTransform(scrollYProgress, [0, 1], ['8%', '-15%']);
  const yDown = useTransform(scrollYProgress, [0, 1], ['-8%', '15%']);

  return (
    <div ref={ref}>
      <style>{`
        .sg35 { background: #0d0d0d; overflow: hidden; display: grid; grid-template-columns: 1fr 1fr; min-height: 520px; }
        .sg35__left { overflow: hidden; padding: 2rem; display: flex; align-items: center; border-right: 1px solid rgba(255,255,255,0.04); }
        .sg35__right { overflow: hidden; }
        .sg35__words { display: flex; flex-direction: column; gap: 0; }
        .sg35__word { font-family: 'Space Grotesk', sans-serif; font-weight: 700; text-transform: uppercase; line-height: 1; padding: 0.75rem 0; border-bottom: 1px solid rgba(255,255,255,0.04); }
        .sg35__word-main { font-size: clamp(1.5rem, 3vw, 2.5rem); color: rgba(255,255,255,0.85); letter-spacing: -0.01em; display: block; }
        .sg35__word-sub { font-family: 'Share Tech Mono', monospace; font-size: 0.5rem; letter-spacing: 0.15em; color: rgba(74,222,128,0.45); margin-top: 0.25rem; display: block; }
        .sg35__img-col { display: flex; flex-direction: column; gap: 0.5rem; padding: 0.5rem; }
        .sg35__img { width: 100%; aspect-ratio: 16/10; border-radius: 4px; overflow: hidden; }
        .sg35__img img { width: 100%; height: 100%; object-fit: cover; filter: brightness(0.7); }
      `}</style>
      <section className="sg35">
        <div className="sg35__left">
          <motion.div className="sg35__words" style={{ y: yDown }}>
            {[...DESTINATIONS, ...DESTINATIONS, ...DESTINATIONS].map((d, i) => (
              <div key={i} className="sg35__word">
                <span className="sg35__word-main">{d.name}</span>
                <span className="sg35__word-sub">{d.time} Direct · VFR Route</span>
              </div>
            ))}
          </motion.div>
        </div>
        <div className="sg35__right">
          <motion.div className="sg35__img-col" style={{ y: yUp }}>
            {[...IMAGES, ...IMAGES].map((src, i) => (
              <div key={i} className="sg35__img"><img src={src} alt="" loading="lazy" /></div>
            ))}
          </motion.div>
        </div>
      </section>
    </div>
  );
};

// ============================================================
// V36 — GLITCH STRIP (Digital glitch / tactical aesthetic)
// ============================================================

const V36 = () => {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end start'] });
  const xL = useTransform(scrollYProgress, [0, 1], ['8%', '-28%']);
  const xR = useTransform(scrollYProgress, [0, 1], ['-10%', '30%']);

  return (
    <div ref={ref}>
      <style>{`
        .sg36 { background: #0a0a0a; padding: 2rem 0; overflow: hidden; display: flex; flex-direction: column; gap: 2px; }
        .sg36__row { display: flex; gap: 2px; white-space: nowrap; }
        .sg36__img { flex-shrink: 0; width: 200px; height: 120px; overflow: hidden; }
        .sg36__img img { width: 100%; height: 100%; object-fit: cover; filter: brightness(0.6) contrast(1.2); }
        .sg36__bar { display: flex; gap: 0; white-space: nowrap; background: rgba(74,222,128,0.04); }
        .sg36__bar-item { flex-shrink: 0; display: flex; align-items: center; gap: 1rem; padding: 0.6rem 1.5rem; border-right: 1px solid rgba(74,222,128,0.06); }
        .sg36__bar-code { font-family: 'Share Tech Mono', monospace; font-size: 0.5rem; letter-spacing: 0.15em; color: #4ade80; }
        .sg36__bar-dest { font-family: 'Space Grotesk', sans-serif; font-size: 0.9rem; font-weight: 600; text-transform: uppercase; letter-spacing: 0.04em; color: rgba(255,255,255,0.8); }
        .sg36__bar-time { font-family: 'Share Tech Mono', monospace; font-size: 0.5rem; letter-spacing: 0.1em; color: rgba(255,255,255,0.25); }
        .sg36__stmt-row { display: flex; gap: 3rem; padding: 0.5rem 0; }
        .sg36__stmt { flex-shrink: 0; font-family: 'Space Grotesk', sans-serif; font-size: clamp(1.5rem, 3vw, 2.2rem); font-weight: 700; text-transform: uppercase; letter-spacing: 0.02em; color: rgba(255,255,255,0.05); }
      `}</style>
      <section className="sg36">
        <motion.div className="sg36__row" style={{ x: xL }}>
          {[...IMAGES, ...IMAGES].map((src, i) => (
            <div key={i} className="sg36__img"><img src={src} alt="" loading="lazy" /></div>
          ))}
        </motion.div>
        <motion.div className="sg36__bar" style={{ x: xR }}>
          {[...DESTINATIONS, ...DESTINATIONS, ...DESTINATIONS].map((d, i) => (
            <div key={i} className="sg36__bar-item">
              <span className="sg36__bar-code">►</span>
              <span className="sg36__bar-dest">{d.name}</span>
              <span className="sg36__bar-time">{d.time}</span>
            </div>
          ))}
        </motion.div>
        <motion.div className="sg36__row" style={{ x: xR }}>
          {[...IMAGES.slice(6), ...IMAGES, ...IMAGES.slice(0,6)].map((src, i) => (
            <div key={i} className="sg36__img"><img src={src} alt="" loading="lazy" /></div>
          ))}
        </motion.div>
        <motion.div className="sg36__stmt-row" style={{ x: xL }}>
          {[...STATEMENTS, ...STATEMENTS, ...STATEMENTS].map((s, i) => (
            <span key={i} className="sg36__stmt">{s}</span>
          ))}
        </motion.div>
      </section>
    </div>
  );
};

// ============================================================
// V37 — CROSSED OUT REALITY (Car journey struck, heli replaces)
// ============================================================

const V37 = () => {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end start'] });
  const xL = useTransform(scrollYProgress, [0, 1], ['8%', '-28%']);
  const xR = useTransform(scrollYProgress, [0, 1], ['-8%', '28%']);

  const realities = [
    { old: 'M25 Gridlock — 3hrs', now: 'Goodwood — 35min', dest: 'Goodwood Racecourse' },
    { old: 'A303 Roadworks — 4hrs', now: 'Cornwall — 2.5hrs', dest: 'Padstow' },
    { old: 'Train cancelled — again', now: 'Edinburgh — 3hrs direct', dest: 'St Andrews' },
    { old: 'Heathrow check-in — 3hrs', now: 'Le Touquet — 1hr', dest: 'Le Touquet' },
    { old: 'M40 tailback — 2.5hrs', now: 'Cotswolds — 1hr', dest: 'The Cotswolds' },
    { old: 'Car ferry — half a day', now: 'Isle of Wight — 45min', dest: 'Cowes' },
  ];

  return (
    <div ref={ref}>
      <style>{`
        .sg37 { background: #0d0d0d; padding: 2.5rem 0; overflow: hidden; display: flex; flex-direction: column; gap: 1rem; }
        .sg37__row { display: flex; gap: 1.25rem; white-space: nowrap; align-items: center; }
        .sg37__img { flex-shrink: 0; width: 210px; height: 135px; border-radius: 4px; overflow: hidden; }
        .sg37__img img { width: 100%; height: 100%; object-fit: cover; filter: brightness(0.75); }
        .sg37__swap { flex-shrink: 0; display: flex; flex-direction: column; gap: 0.3rem; padding: 0 1.5rem; }
        .sg37__swap-old { font-family: 'Space Grotesk', sans-serif; font-size: 0.75rem; font-weight: 400; text-transform: uppercase; letter-spacing: 0.08em; color: rgba(255,255,255,0.2); text-decoration: line-through; text-decoration-color: rgba(255,255,255,0.15); }
        .sg37__swap-new { font-family: 'Space Grotesk', sans-serif; font-size: 1.1rem; font-weight: 700; text-transform: uppercase; letter-spacing: 0.02em; color: rgba(255,255,255,0.9); }
        .sg37__swap-tag { font-family: 'Share Tech Mono', monospace; font-size: 0.45rem; letter-spacing: 0.12em; color: #4ade80; text-transform: uppercase; }
      `}</style>
      <section className="sg37">
        <motion.div className="sg37__row" style={{ x: xL }}>
          {[...IMAGES, ...IMAGES.slice(0,6)].map((src, i) => (
            <React.Fragment key={i}>
              <div className="sg37__img"><img src={src} alt="" loading="lazy" /></div>
              {i % 2 === 0 && (
                <div className="sg37__swap">
                  <span className="sg37__swap-old">{realities[i % realities.length].old}</span>
                  <span className="sg37__swap-new">{realities[i % realities.length].now}</span>
                  <span className="sg37__swap-tag">● Direct from Denham</span>
                </div>
              )}
            </React.Fragment>
          ))}
        </motion.div>
        <motion.div className="sg37__row" style={{ x: xR }}>
          {[...IMAGES.slice(6), ...IMAGES].map((src, i) => (
            <React.Fragment key={i}>
              <div className="sg37__img"><img src={src} alt="" loading="lazy" /></div>
              {i % 2 === 1 && (
                <div className="sg37__swap">
                  <span className="sg37__swap-old">{realities[(i+3) % realities.length].old}</span>
                  <span className="sg37__swap-new">{realities[(i+3) % realities.length].now}</span>
                  <span className="sg37__swap-tag">● Direct from Denham</span>
                </div>
              )}
            </React.Fragment>
          ))}
        </motion.div>
      </section>
    </div>
  );
};

// ============================================================
// V38 — THE ARRIVAL (Focus on the moment of arriving)
// ============================================================

const V38 = () => {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end start'] });
  const xL = useTransform(scrollYProgress, [0, 1], ['10%', '-32%']);
  const xR = useTransform(scrollYProgress, [0, 1], ['-8%', '26%']);

  const arrivals = [
    'Land at Goodwood. Walk to the paddock.',
    'Touch down at St Andrews. First tee in 10.',
    'Arrive at Soho Farmhouse. Cocktails waiting.',
    'Set down at Cheltenham. Races start in 5.',
    'Land in the Cotswolds. Table for two at noon.',
    'Touch down in Cowes. The regatta begins.',
  ];

  return (
    <div ref={ref}>
      <style>{`
        .sg38 { background: #0a0a0a; padding: 3rem 0; overflow: hidden; display: flex; flex-direction: column; gap: 1rem; position: relative; }
        .sg38::before, .sg38::after { content: ''; position: absolute; top: 0; bottom: 0; width: 100px; z-index: 10; pointer-events: none; }
        .sg38::before { left: 0; background: linear-gradient(to right, #0a0a0a, transparent); }
        .sg38::after { right: 0; background: linear-gradient(to left, #0a0a0a, transparent); }
        .sg38__row { display: flex; gap: 1rem; white-space: nowrap; }
        .sg38__img { flex-shrink: 0; width: 230px; height: 150px; border-radius: 6px; overflow: hidden; }
        .sg38__img img { width: 100%; height: 100%; object-fit: cover; filter: brightness(0.75); }
        .sg38__arrival-row { display: flex; gap: 2.5rem; padding: 0.75rem 0; }
        .sg38__arrival { flex-shrink: 0; max-width: 320px; }
        .sg38__arrival-text { font-family: 'Space Grotesk', sans-serif; font-size: 1.05rem; font-weight: 400; color: rgba(255,255,255,0.6); line-height: 1.5; white-space: normal; }
        .sg38__arrival-text em { font-style: normal; font-weight: 700; color: rgba(255,255,255,0.95); }
        .sg38__arrival-pip { display: inline-block; width: 4px; height: 4px; border-radius: 50%; background: #4ade80; margin-right: 0.5rem; vertical-align: middle; }
      `}</style>
      <section className="sg38">
        <motion.div className="sg38__row" style={{ x: xL }}>
          {[...IMAGES, ...IMAGES.slice(0,6)].map((src, i) => (
            <div key={i} className="sg38__img"><img src={src} alt="" loading="lazy" /></div>
          ))}
        </motion.div>
        <motion.div className="sg38__arrival-row" style={{ x: xR }}>
          {[...arrivals, ...arrivals, ...arrivals].map((text, i) => {
            const parts = text.split('. ');
            return (
              <div key={i} className="sg38__arrival">
                <span className="sg38__arrival-text">
                  <span className="sg38__arrival-pip" />
                  <em>{parts[0]}.</em> {parts[1]}
                </span>
              </div>
            );
          })}
        </motion.div>
        <motion.div className="sg38__row" style={{ x: xR }}>
          {[...IMAGES.slice(4), ...IMAGES].map((src, i) => (
            <div key={i} className="sg38__img"><img src={src} alt="" loading="lazy" /></div>
          ))}
        </motion.div>
      </section>
    </div>
  );
};

// ============================================================
// V39 — COORDINATES (Pure technical, lat/long + destination)
// ============================================================

const V39 = () => {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end start'] });
  const xL = useTransform(scrollYProgress, [0, 1], ['6%', '-24%']);
  const xR = useTransform(scrollYProgress, [0, 1], ['-6%', '24%']);

  const coords = [
    { dest: 'The Cotswolds', lat: '51.830°N', lon: '1.680°W' },
    { dest: 'Goodwood', lat: '50.861°N', lon: '0.759°W' },
    { dest: 'St Andrews', lat: '56.339°N', lon: '2.796°W' },
    { dest: 'Le Touquet', lat: '50.517°N', lon: '1.626°E' },
    { dest: 'Cowes', lat: '50.762°N', lon: '1.299°W' },
    { dest: 'Cheltenham', lat: '51.899°N', lon: '2.078°W' },
    { dest: 'Soho Farmhouse', lat: '51.907°N', lon: '1.543°W' },
    { dest: 'Padstow', lat: '50.539°N', lon: '4.937°W' },
  ];

  return (
    <div ref={ref}>
      <style>{`
        .sg39 { background: #0a0a0a; padding: 2rem 0; overflow: hidden; display: flex; flex-direction: column; gap: 0.5rem; }
        .sg39__img-row { display: flex; gap: 4px; white-space: nowrap; }
        .sg39__img { flex-shrink: 0; width: 185px; height: 115px; overflow: hidden; border-radius: 2px; }
        .sg39__img img { width: 100%; height: 100%; object-fit: cover; filter: brightness(0.6) contrast(1.1); }
        .sg39__coord-row { display: flex; gap: 0; white-space: nowrap; border-top: 1px solid rgba(74,222,128,0.06); border-bottom: 1px solid rgba(74,222,128,0.06); }
        .sg39__coord { flex-shrink: 0; display: flex; align-items: center; gap: 1rem; padding: 0.6rem 1.5rem; border-right: 1px solid rgba(255,255,255,0.03); }
        .sg39__coord-pos { font-family: 'Share Tech Mono', monospace; font-size: 0.5rem; letter-spacing: 0.1em; color: rgba(74,222,128,0.5); }
        .sg39__coord-dest { font-family: 'Space Grotesk', sans-serif; font-size: 0.9rem; font-weight: 600; text-transform: uppercase; letter-spacing: 0.04em; color: rgba(255,255,255,0.85); }
        .sg39__coord-arrow { font-family: 'Share Tech Mono', monospace; font-size: 0.55rem; color: #4ade80; }
      `}</style>
      <section className="sg39">
        <motion.div className="sg39__img-row" style={{ x: xL }}>
          {[...IMAGES, ...IMAGES].map((src, i) => (
            <div key={i} className="sg39__img"><img src={src} alt="" loading="lazy" /></div>
          ))}
        </motion.div>
        <motion.div className="sg39__coord-row" style={{ x: xR }}>
          {[...coords, ...coords, ...coords, ...coords].map((c, i) => (
            <div key={i} className="sg39__coord">
              <span className="sg39__coord-pos">{c.lat} / {c.lon}</span>
              <span className="sg39__coord-arrow">→</span>
              <span className="sg39__coord-dest">{c.dest}</span>
            </div>
          ))}
        </motion.div>
        <motion.div className="sg39__img-row" style={{ x: xR }}>
          {[...IMAGES.slice(6), ...IMAGES, ...IMAGES.slice(0,6)].map((src, i) => (
            <div key={i} className="sg39__img"><img src={src} alt="" loading="lazy" /></div>
          ))}
        </motion.div>
      </section>
    </div>
  );
};

// ============================================================
// V40 — THE ULTIMATE (Combines best: bold text + green tags + cards + images)
// ============================================================

const V40 = () => {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end start'] });
  const xL = useTransform(scrollYProgress, [0, 1], ['10%', '-30%']);
  const xR = useTransform(scrollYProgress, [0, 1], ['-8%', '26%']);
  const xM = useTransform(scrollYProgress, [0, 1], ['5%', '-18%']);

  return (
    <div ref={ref}>
      <style>{`
        .sg40 { background: #0a0a0a; padding: 3rem 0; overflow: hidden; display: flex; flex-direction: column; gap: 1rem; position: relative; }
        .sg40::before, .sg40::after { content: ''; position: absolute; top: 0; bottom: 0; width: 120px; z-index: 10; pointer-events: none; }
        .sg40::before { left: 0; background: linear-gradient(to right, #0a0a0a, transparent); }
        .sg40::after { right: 0; background: linear-gradient(to left, #0a0a0a, transparent); }
        .sg40__big-row { display: flex; align-items: center; gap: 1.5rem; white-space: nowrap; }
        .sg40__big { font-family: 'Space Grotesk', sans-serif; font-size: clamp(2rem, 4vw, 3.5rem); font-weight: 700; text-transform: uppercase; letter-spacing: -0.01em; color: rgba(255,255,255,0.06); flex-shrink: 0; line-height: 1; }
        .sg40__big--lit { color: rgba(255,255,255,0.85); }
        .sg40__img-row { display: flex; gap: 0.75rem; white-space: nowrap; }
        .sg40__img { flex-shrink: 0; width: 220px; height: 140px; border-radius: 6px; overflow: hidden; }
        .sg40__img img { width: 100%; height: 100%; object-fit: cover; filter: brightness(0.75); transition: filter 0.3s; }
        .sg40__img:hover img { filter: brightness(0.95); }
        .sg40__dest-row { display: flex; gap: 1.5rem; padding: 0.25rem 0; }
        .sg40__dest { flex-shrink: 0; display: flex; align-items: center; gap: 0.75rem; }
        .sg40__dest-pip { width: 4px; height: 4px; border-radius: 50%; background: #4ade80; box-shadow: 0 0 6px rgba(74,222,128,0.3); flex-shrink: 0; }
        .sg40__dest-name { font-family: 'Space Grotesk', sans-serif; font-size: 1rem; font-weight: 600; text-transform: uppercase; letter-spacing: 0.04em; color: rgba(255,255,255,0.85); }
        .sg40__dest-tag { font-family: 'Share Tech Mono', monospace; font-size: 0.45rem; letter-spacing: 0.1em; text-transform: uppercase; color: #0a0a0a; background: #4ade80; padding: 2px 8px; border-radius: 2px; font-weight: 600; }
      `}</style>
      <section className="sg40">
        <motion.div className="sg40__big-row" style={{ x: xL }}>
          {['Your', 'Helicopter.', 'Your', 'Schedule.', 'Your', 'Freedom.', 'Your', 'Helicopter.', 'Your', 'Schedule.'].map((w, i) => (
            <span key={i} className={`sg40__big ${['Helicopter.', 'Schedule.', 'Freedom.'].includes(w) ? 'sg40__big--lit' : ''}`}>{w}</span>
          ))}
        </motion.div>
        <motion.div className="sg40__img-row" style={{ x: xR }}>
          {[...IMAGES, ...IMAGES.slice(0,6)].map((src, i) => (
            <div key={i} className="sg40__img"><img src={src} alt="" loading="lazy" /></div>
          ))}
        </motion.div>
        <motion.div className="sg40__dest-row" style={{ x: xM }}>
          {[...DESTINATIONS, ...DESTINATIONS].map((d, i) => (
            <span key={i} className="sg40__dest">
              <span className="sg40__dest-pip" />
              <span className="sg40__dest-name">{d.name}</span>
              <span className="sg40__dest-tag">{d.time}</span>
            </span>
          ))}
        </motion.div>
        <motion.div className="sg40__img-row" style={{ x: xL }}>
          {[...IMAGES.slice(6), ...IMAGES].map((src, i) => (
            <div key={i} className="sg40__img"><img src={src} alt="" loading="lazy" /></div>
          ))}
        </motion.div>
      </section>
    </div>
  );
};

// ============================================================
// V41 — THE DREAMER (Poetic lifestyle statements + cinematic images + green tags)
// The emotional peak — every element designed to make you dream
// ============================================================

const V41 = () => {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end start'] });
  const xSlow = useTransform(scrollYProgress, [0, 1], ['8%', '-22%']);
  const xMed = useTransform(scrollYProgress, [0, 1], ['-6%', '20%']);
  const xFast = useTransform(scrollYProgress, [0, 1], ['12%', '-35%']);

  const dreams = [
    'Lunch Overlooking the Sea.',
    'Home Before Dark.',
    'Skip the Motorway.',
    'Land at the Door.',
    'Breakfast in London.',
    'Golf by 10.',
    'Dinner in France.',
    'Back by Midnight.',
  ];

  return (
    <div ref={ref}>
      <style>{`
        .sg41 { background: #0e0e0e; padding: 4rem 0; overflow: hidden; display: flex; flex-direction: column; gap: 1.25rem; position: relative; }
        .sg41::before, .sg41::after { content: ''; position: absolute; top: 0; bottom: 0; width: 180px; z-index: 10; pointer-events: none; }
        .sg41::before { left: 0; background: linear-gradient(to right, #0e0e0e, transparent); }
        .sg41::after { right: 0; background: linear-gradient(to left, #0e0e0e, transparent); }
        .sg41__dream-row { display: flex; align-items: center; gap: 2rem; white-space: nowrap; padding: 0.5rem 0; }
        .sg41__dream { flex-shrink: 0; font-family: 'Space Grotesk', sans-serif; font-size: clamp(2.2rem, 4.5vw, 3.8rem); font-weight: 700; text-transform: uppercase; letter-spacing: -0.02em; line-height: 1; }
        .sg41__dream--ghost { color: rgba(255,255,255,0.04); }
        .sg41__dream--lit { color: rgba(255,255,255,0.88); }
        .sg41__dream--mid { color: rgba(255,255,255,0.15); }
        .sg41__dream-sep { width: 40px; height: 1px; background: linear-gradient(to right, transparent, rgba(74,222,128,0.3), transparent); flex-shrink: 0; }
        .sg41__img-row { display: flex; gap: 1rem; white-space: nowrap; }
        .sg41__img { flex-shrink: 0; width: 280px; height: 170px; border-radius: 4px; overflow: hidden; position: relative; }
        .sg41__img img { width: 100%; height: 100%; object-fit: cover; filter: brightness(0.7) saturate(1.1); transition: all 0.6s cubic-bezier(0.16, 1, 0.3, 1); }
        .sg41__img:hover img { filter: brightness(0.9) saturate(1.15); transform: scale(1.03); }
        .sg41__dest-row { display: flex; gap: 2rem; white-space: nowrap; padding: 0.25rem 0; align-items: center; }
        .sg41__dest { flex-shrink: 0; display: flex; align-items: center; gap: 0.75rem; }
        .sg41__dest-name { font-family: 'Space Grotesk', sans-serif; font-size: 1rem; font-weight: 600; text-transform: uppercase; letter-spacing: 0.05em; color: rgba(255,255,255,0.8); }
        .sg41__dest-time { font-family: 'Share Tech Mono', monospace; font-size: 0.55rem; letter-spacing: 0.12em; text-transform: uppercase; color: #0e0e0e; background: #4ade80; padding: 3px 10px; border-radius: 2px; font-weight: 600; }
        .sg41__dest-dot { width: 3px; height: 3px; border-radius: 50%; background: rgba(74,222,128,0.4); flex-shrink: 0; }
      `}</style>
      <section className="sg41">
        <motion.div className="sg41__dream-row" style={{ x: xSlow }}>
          {dreams.map((d, i) => (
            <React.Fragment key={i}>
              <span className={`sg41__dream ${i % 3 === 0 ? 'sg41__dream--lit' : i % 3 === 1 ? 'sg41__dream--mid' : 'sg41__dream--ghost'}`}>{d}</span>
              <span className="sg41__dream-sep" />
            </React.Fragment>
          ))}
        </motion.div>
        <motion.div className="sg41__img-row" style={{ x: xMed }}>
          {[...IMAGES, ...IMAGES.slice(0,6)].map((src, i) => (
            <div key={i} className="sg41__img"><img src={src} alt="" loading="lazy" /></div>
          ))}
        </motion.div>
        <motion.div className="sg41__dest-row" style={{ x: xFast }}>
          {[...DESTINATIONS, ...DESTINATIONS].map((d, i) => (
            <React.Fragment key={i}>
              <span className="sg41__dest">
                <span className="sg41__dest-name">{d.name}</span>
                <span className="sg41__dest-time">{d.time}</span>
              </span>
              <span className="sg41__dest-dot" />
            </React.Fragment>
          ))}
        </motion.div>
        <motion.div className="sg41__img-row" style={{ x: xFast }}>
          {[...IMAGES.slice(6), ...IMAGES].map((src, i) => (
            <div key={i} className="sg41__img"><img src={src} alt="" loading="lazy" /></div>
          ))}
        </motion.div>
      </section>
    </div>
  );
};

// ============================================================
// V42 — EDITORIAL LUXURY (Magazine editorial layout with gradient headlines)
// Swiss Typography influence — precise, refined, aspirational
// ============================================================

const V42 = () => {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end start'] });
  const xL = useTransform(scrollYProgress, [0, 1], ['6%', '-24%']);
  const xR = useTransform(scrollYProgress, [0, 1], ['-4%', '18%']);
  const xM = useTransform(scrollYProgress, [0, 1], ['3%', '-14%']);

  return (
    <div ref={ref}>
      <style>{`
        .sg42 { background: #faf9f6; padding: 4rem 0; overflow: hidden; display: flex; flex-direction: column; gap: 1.25rem; position: relative; }
        .sg42::before, .sg42::after { content: ''; position: absolute; top: 0; bottom: 0; width: 160px; z-index: 10; pointer-events: none; }
        .sg42::before { left: 0; background: linear-gradient(to right, #faf9f6, transparent); }
        .sg42::after { right: 0; background: linear-gradient(to left, #faf9f6, transparent); }
        .sg42__headline-row { display: flex; align-items: baseline; gap: 3rem; white-space: nowrap; padding: 0.75rem 0; }
        .sg42__word { flex-shrink: 0; font-family: 'Space Grotesk', sans-serif; font-size: clamp(2.5rem, 5vw, 4.2rem); font-weight: 700; text-transform: uppercase; letter-spacing: -0.02em; line-height: 1; }
        .sg42__word--1 { color: #1a1a1a; }
        .sg42__word--2 { color: #4a4a4a; }
        .sg42__word--3 { color: #7a7a7a; }
        .sg42__word--4 { color: #b0b0b0; }
        .sg42__img-row { display: flex; gap: 1.25rem; white-space: nowrap; }
        .sg42__img { flex-shrink: 0; width: 260px; height: 165px; border-radius: 6px; overflow: hidden; }
        .sg42__img img { width: 100%; height: 100%; object-fit: cover; transition: all 0.5s ease; }
        .sg42__img:hover img { transform: scale(1.04); }
        .sg42__dest-row { display: flex; gap: 2.5rem; white-space: nowrap; padding: 0.25rem 0; align-items: center; }
        .sg42__dest { flex-shrink: 0; display: flex; align-items: center; gap: 0.75rem; }
        .sg42__dest-name { font-family: 'Space Grotesk', sans-serif; font-size: 0.95rem; font-weight: 600; text-transform: uppercase; letter-spacing: 0.06em; color: #1a1a1a; }
        .sg42__dest-time { font-family: 'Share Tech Mono', monospace; font-size: 0.55rem; letter-spacing: 0.12em; text-transform: uppercase; color: #fff; background: #1a1a1a; padding: 3px 10px; border-radius: 2px; }
        .sg42__dest-accent { font-family: 'Share Tech Mono', monospace; font-size: 0.5rem; letter-spacing: 0.15em; text-transform: uppercase; color: #4ade80; }
      `}</style>
      <section className="sg42">
        <motion.div className="sg42__headline-row" style={{ x: xL }}>
          {['Your', 'Sky.', 'Your', 'Schedule.', 'Your', 'Freedom.', 'No', 'Limits.', 'No', 'Queues.', 'Just', 'Fly.'].map((w, i) => (
            <span key={i} className={`sg42__word sg42__word--${(i % 4) + 1}`}>{w}</span>
          ))}
        </motion.div>
        <motion.div className="sg42__img-row" style={{ x: xR }}>
          {[...IMAGES, ...IMAGES.slice(0,6)].map((src, i) => (
            <div key={i} className="sg42__img"><img src={src} alt="" loading="lazy" /></div>
          ))}
        </motion.div>
        <motion.div className="sg42__dest-row" style={{ x: xM }}>
          {[...DESTINATIONS, ...DESTINATIONS].map((d, i) => (
            <React.Fragment key={i}>
              <span className="sg42__dest">
                <span className="sg42__dest-name">{d.name}</span>
                <span className="sg42__dest-time">{d.time}</span>
                <span className="sg42__dest-accent">direct</span>
              </span>
            </React.Fragment>
          ))}
        </motion.div>
      </section>
    </div>
  );
};

// ============================================================
// V43 — THE JOURNEY (Narrative scroll — FROM → destination images → TO)
// Each scroll tells the story of a journey from Denham
// ============================================================

const V43 = () => {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end start'] });
  const xL = useTransform(scrollYProgress, [0, 1], ['10%', '-30%']);
  const xR = useTransform(scrollYProgress, [0, 1], ['-8%', '26%']);
  const xM = useTransform(scrollYProgress, [0, 1], ['5%', '-18%']);
  const xS = useTransform(scrollYProgress, [0, 1], ['-3%', '12%']);

  const journeyPairs = [
    { from: 'Denham', to: 'The Cotswolds', detail: 'Lunch by the river. Back for tea.' },
    { from: 'Denham', to: 'Goodwood', detail: 'Land trackside. Not the car park.' },
    { from: 'Denham', to: 'St Andrews', detail: 'Tee off before lunch.' },
    { from: 'Denham', to: 'Le Touquet', detail: 'Dinner in France. Home by midnight.' },
    { from: 'Denham', to: 'Cowes', detail: 'Sail in the afternoon.' },
    { from: 'Denham', to: 'Padstow', detail: 'Fresh seafood. No motorway.' },
  ];

  return (
    <div ref={ref}>
      <style>{`
        .sg43 { background: #0c0c0c; padding: 3.5rem 0; overflow: hidden; display: flex; flex-direction: column; gap: 1rem; position: relative; }
        .sg43::before, .sg43::after { content: ''; position: absolute; top: 0; bottom: 0; width: 150px; z-index: 10; pointer-events: none; }
        .sg43::before { left: 0; background: linear-gradient(to right, #0c0c0c, transparent); }
        .sg43::after { right: 0; background: linear-gradient(to left, #0c0c0c, transparent); }
        .sg43__from-row { display: flex; align-items: center; gap: 3rem; white-space: nowrap; padding: 0.25rem 0; }
        .sg43__from { flex-shrink: 0; display: flex; align-items: center; gap: 1.25rem; }
        .sg43__from-label { font-family: 'Share Tech Mono', monospace; font-size: 0.5rem; letter-spacing: 0.2em; text-transform: uppercase; color: rgba(255,255,255,0.25); }
        .sg43__from-name { font-family: 'Space Grotesk', sans-serif; font-size: 1.1rem; font-weight: 600; text-transform: uppercase; letter-spacing: 0.04em; color: rgba(255,255,255,0.4); }
        .sg43__from-arrow { font-family: 'Share Tech Mono', monospace; font-size: 0.7rem; color: #4ade80; }
        .sg43__from-dest { font-family: 'Space Grotesk', sans-serif; font-size: 1.1rem; font-weight: 700; text-transform: uppercase; letter-spacing: 0.04em; color: rgba(255,255,255,0.9); }
        .sg43__from-time { font-family: 'Share Tech Mono', monospace; font-size: 0.5rem; letter-spacing: 0.1em; color: #0c0c0c; background: #4ade80; padding: 3px 10px; border-radius: 2px; font-weight: 600; }
        .sg43__img-row { display: flex; gap: 0.75rem; white-space: nowrap; }
        .sg43__img { flex-shrink: 0; width: 240px; height: 150px; border-radius: 4px; overflow: hidden; }
        .sg43__img img { width: 100%; height: 100%; object-fit: cover; filter: brightness(0.7); transition: filter 0.5s; }
        .sg43__img:hover img { filter: brightness(0.9); }
        .sg43__story-row { display: flex; align-items: center; gap: 2rem; white-space: nowrap; padding: 0.5rem 0; }
        .sg43__story { flex-shrink: 0; font-family: 'Space Grotesk', sans-serif; font-size: clamp(1.8rem, 3.5vw, 3rem); font-weight: 700; text-transform: uppercase; letter-spacing: -0.01em; line-height: 1; }
        .sg43__story--ghost { color: rgba(255,255,255,0.04); }
        .sg43__story--lit { color: rgba(255,255,255,0.85); }
        .sg43__detail-row { display: flex; gap: 3rem; white-space: nowrap; padding: 0.25rem 0; }
        .sg43__detail { flex-shrink: 0; font-family: 'Space Grotesk', sans-serif; font-size: 0.9rem; font-weight: 400; color: rgba(255,255,255,0.35); font-style: italic; letter-spacing: 0.01em; }
      `}</style>
      <section className="sg43">
        <motion.div className="sg43__from-row" style={{ x: xL }}>
          {[...DESTINATIONS, ...DESTINATIONS].map((d, i) => (
            <span key={i} className="sg43__from">
              <span className="sg43__from-label">From</span>
              <span className="sg43__from-name">Denham</span>
              <span className="sg43__from-arrow">→</span>
              <span className="sg43__from-dest">{d.name}</span>
              <span className="sg43__from-time">{d.time}</span>
            </span>
          ))}
        </motion.div>
        <motion.div className="sg43__img-row" style={{ x: xR }}>
          {[...IMAGES, ...IMAGES.slice(0,6)].map((src, i) => (
            <div key={i} className="sg43__img"><img src={src} alt="" loading="lazy" /></div>
          ))}
        </motion.div>
        <motion.div className="sg43__story-row" style={{ x: xM }}>
          {journeyPairs.concat(journeyPairs).map((j, i) => (
            <React.Fragment key={i}>
              <span className={`sg43__story ${i % 2 === 0 ? 'sg43__story--lit' : 'sg43__story--ghost'}`}>{j.detail}</span>
            </React.Fragment>
          ))}
        </motion.div>
        <motion.div className="sg43__detail-row" style={{ x: xS }}>
          {[...LIFESTYLES, ...LIFESTYLES, ...LIFESTYLES].map((l, i) => (
            <span key={i} className="sg43__detail">{l}</span>
          ))}
        </motion.div>
      </section>
    </div>
  );
};

// ============================================================
// V44 — ARRIVAL (The moment you step out — pure aspiration)
// Focus on the arrival moment, not the journey
// ============================================================

const V44 = () => {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end start'] });
  const xL = useTransform(scrollYProgress, [0, 1], ['8%', '-28%']);
  const xR = useTransform(scrollYProgress, [0, 1], ['-6%', '22%']);
  const xM = useTransform(scrollYProgress, [0, 1], ['4%', '-16%']);

  const arrivals = [
    'Step out at Goodwood. Walk to the paddock.',
    'Land in the Cotswolds. Lunch is waiting.',
    'Touch down at St Andrews. First tee in 20 minutes.',
    'Arrive in Le Touquet. Champagne by sunset.',
    'Set down at Cowes. The regatta begins.',
    'Land at Soho Farmhouse. Weekend starts now.',
  ];

  return (
    <div ref={ref}>
      <style>{`
        .sg44 { background: #0a0a0a; padding: 4rem 0; overflow: hidden; display: flex; flex-direction: column; gap: 1.5rem; position: relative; }
        .sg44::before, .sg44::after { content: ''; position: absolute; top: 0; bottom: 0; width: 200px; z-index: 10; pointer-events: none; }
        .sg44::before { left: 0; background: linear-gradient(to right, #0a0a0a, transparent); }
        .sg44::after { right: 0; background: linear-gradient(to left, #0a0a0a, transparent); }
        .sg44__img-row { display: flex; gap: 1.25rem; white-space: nowrap; }
        .sg44__img { flex-shrink: 0; width: 320px; height: 200px; border-radius: 6px; overflow: hidden; position: relative; }
        .sg44__img img { width: 100%; height: 100%; object-fit: cover; filter: brightness(0.65) saturate(1.1); transition: all 0.6s cubic-bezier(0.16, 1, 0.3, 1); }
        .sg44__img:hover img { filter: brightness(0.85) saturate(1.15); }
        .sg44__img-label { position: absolute; bottom: 12px; left: 12px; font-family: 'Share Tech Mono', monospace; font-size: 0.5rem; letter-spacing: 0.15em; text-transform: uppercase; color: #4ade80; background: rgba(0,0,0,0.6); padding: 3px 8px; border-radius: 2px; backdrop-filter: blur(4px); }
        .sg44__arrival-row { display: flex; align-items: center; gap: 2.5rem; white-space: nowrap; padding: 0.5rem 0; }
        .sg44__arrival { flex-shrink: 0; font-family: 'Space Grotesk', sans-serif; font-size: clamp(1.6rem, 3vw, 2.4rem); font-weight: 700; text-transform: uppercase; letter-spacing: -0.01em; line-height: 1.1; color: rgba(255,255,255,0.85); }
        .sg44__arrival-pip { width: 6px; height: 6px; border-radius: 50%; background: #4ade80; box-shadow: 0 0 8px rgba(74,222,128,0.4); flex-shrink: 0; }
        .sg44__dest-row { display: flex; gap: 1.5rem; white-space: nowrap; padding: 0.25rem 0; align-items: center; }
        .sg44__dest { flex-shrink: 0; display: flex; align-items: center; gap: 0.75rem; }
        .sg44__dest-name { font-family: 'Space Grotesk', sans-serif; font-size: 0.9rem; font-weight: 600; text-transform: uppercase; letter-spacing: 0.05em; color: rgba(255,255,255,0.7); }
        .sg44__dest-time { font-family: 'Share Tech Mono', monospace; font-size: 0.5rem; letter-spacing: 0.12em; text-transform: uppercase; color: #0a0a0a; background: #4ade80; padding: 3px 10px; border-radius: 2px; font-weight: 600; }
        .sg44__line { width: 30px; height: 1px; background: rgba(255,255,255,0.08); flex-shrink: 0; }
      `}</style>
      <section className="sg44">
        <motion.div className="sg44__img-row" style={{ x: xL }}>
          {[...IMAGES, ...IMAGES.slice(0,4)].map((src, i) => (
            <div key={i} className="sg44__img">
              <img src={src} alt="" loading="lazy" />
              <span className="sg44__img-label">{DESTINATIONS[i % DESTINATIONS.length].name}</span>
            </div>
          ))}
        </motion.div>
        <motion.div className="sg44__arrival-row" style={{ x: xR }}>
          {arrivals.concat(arrivals).map((a, i) => (
            <React.Fragment key={i}>
              <span className="sg44__arrival-pip" />
              <span className="sg44__arrival">{a}</span>
            </React.Fragment>
          ))}
        </motion.div>
        <motion.div className="sg44__dest-row" style={{ x: xM }}>
          {[...DESTINATIONS, ...DESTINATIONS, ...DESTINATIONS].map((d, i) => (
            <React.Fragment key={i}>
              <span className="sg44__dest">
                <span className="sg44__dest-name">{d.name}</span>
                <span className="sg44__dest-time">{d.time}</span>
              </span>
              <span className="sg44__line" />
            </React.Fragment>
          ))}
        </motion.div>
      </section>
    </div>
  );
};

// ============================================================
// V45 — WARM EDITORIAL (Light luxury magazine — brand identity warm white)
// Strictly #faf9f6 bg, gradient headline colors, editorial spacing
// ============================================================

const V45 = () => {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end start'] });
  const xL = useTransform(scrollYProgress, [0, 1], ['6%', '-20%']);
  const xR = useTransform(scrollYProgress, [0, 1], ['-5%', '18%']);
  const xM = useTransform(scrollYProgress, [0, 1], ['3%', '-12%']);

  const editorialLines = [
    { text: 'The Cotswolds', sub: 'for lunch', time: '1hr' },
    { text: 'Goodwood', sub: 'for the races', time: '35min' },
    { text: 'St Andrews', sub: 'for a round', time: '3.5hrs' },
    { text: 'Le Touquet', sub: 'for dinner', time: '1hr' },
    { text: 'Cowes', sub: 'for the regatta', time: '45min' },
    { text: 'Soho Farmhouse', sub: 'for the weekend', time: '40min' },
    { text: 'Padstow', sub: 'for the lobster', time: '2.5hrs' },
    { text: 'Blenheim Palace', sub: 'for the afternoon', time: '30min' },
  ];

  return (
    <div ref={ref}>
      <style>{`
        .sg45 { background: #faf9f6; padding: 4rem 0; overflow: hidden; display: flex; flex-direction: column; gap: 1.5rem; position: relative; }
        .sg45::before, .sg45::after { content: ''; position: absolute; top: 0; bottom: 0; width: 180px; z-index: 10; pointer-events: none; }
        .sg45::before { left: 0; background: linear-gradient(to right, #faf9f6, transparent); }
        .sg45::after { right: 0; background: linear-gradient(to left, #faf9f6, transparent); }
        .sg45__editorial-row { display: flex; align-items: baseline; gap: 3rem; white-space: nowrap; padding: 0.5rem 0; }
        .sg45__editorial { flex-shrink: 0; display: flex; align-items: baseline; gap: 0.75rem; }
        .sg45__editorial-name { font-family: 'Space Grotesk', sans-serif; font-size: clamp(2rem, 4vw, 3.2rem); font-weight: 700; text-transform: uppercase; letter-spacing: -0.01em; color: #1a1a1a; line-height: 1; }
        .sg45__editorial-sub { font-family: 'Space Grotesk', sans-serif; font-size: 1rem; font-weight: 400; color: #7a7a7a; font-style: italic; text-transform: lowercase; letter-spacing: 0.01em; }
        .sg45__editorial-time { font-family: 'Share Tech Mono', monospace; font-size: 0.5rem; letter-spacing: 0.12em; text-transform: uppercase; color: #fff; background: #1a1a1a; padding: 3px 10px; border-radius: 2px; }
        .sg45__editorial-dash { width: 30px; height: 1px; background: #e8e6e2; flex-shrink: 0; }
        .sg45__img-row { display: flex; gap: 1.25rem; white-space: nowrap; }
        .sg45__img { flex-shrink: 0; width: 240px; height: 160px; border-radius: 6px; overflow: hidden; }
        .sg45__img img { width: 100%; height: 100%; object-fit: cover; transition: all 0.5s ease; }
        .sg45__img:hover img { transform: scale(1.03); }
        .sg45__lifestyle-row { display: flex; gap: 2.5rem; white-space: nowrap; padding: 0.5rem 0; align-items: center; }
        .sg45__lifestyle { flex-shrink: 0; font-family: 'Space Grotesk', sans-serif; font-size: 0.95rem; font-weight: 400; color: #888; letter-spacing: 0.02em; }
        .sg45__lifestyle-rule { width: 40px; height: 1px; background: linear-gradient(to right, transparent, #c0bdb8, transparent); flex-shrink: 0; }
      `}</style>
      <section className="sg45">
        <motion.div className="sg45__editorial-row" style={{ x: xL }}>
          {editorialLines.concat(editorialLines).map((e, i) => (
            <React.Fragment key={i}>
              <span className="sg45__editorial">
                <span className="sg45__editorial-name">{e.text}</span>
                <span className="sg45__editorial-sub">{e.sub}</span>
                <span className="sg45__editorial-time">{e.time}</span>
              </span>
              <span className="sg45__editorial-dash" />
            </React.Fragment>
          ))}
        </motion.div>
        <motion.div className="sg45__img-row" style={{ x: xR }}>
          {[...IMAGES, ...IMAGES.slice(0,6)].map((src, i) => (
            <div key={i} className="sg45__img"><img src={src} alt="" loading="lazy" /></div>
          ))}
        </motion.div>
        <motion.div className="sg45__lifestyle-row" style={{ x: xM }}>
          {[...LIFESTYLES, ...LIFESTYLES, ...LIFESTYLES].map((l, i) => (
            <React.Fragment key={i}>
              <span className="sg45__lifestyle">{l}</span>
              <span className="sg45__lifestyle-rule" />
            </React.Fragment>
          ))}
        </motion.div>
      </section>
    </div>
  );
};

// ============================================================
// V46 — CINEMATIC WIDESCREEN (Ultra-wide images + precise labels)
// Film-like ratio images, minimal text, maximum aspiration
// ============================================================

const V46 = () => {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end start'] });
  const xL = useTransform(scrollYProgress, [0, 1], ['8%', '-25%']);
  const xR = useTransform(scrollYProgress, [0, 1], ['-6%', '20%']);
  const xM = useTransform(scrollYProgress, [0, 1], ['4%', '-14%']);

  return (
    <div ref={ref}>
      <style>{`
        .sg46 { background: #080808; padding: 4rem 0; overflow: hidden; display: flex; flex-direction: column; gap: 1.25rem; position: relative; }
        .sg46::before, .sg46::after { content: ''; position: absolute; top: 0; bottom: 0; width: 200px; z-index: 10; pointer-events: none; }
        .sg46::before { left: 0; background: linear-gradient(to right, #080808, transparent); }
        .sg46::after { right: 0; background: linear-gradient(to left, #080808, transparent); }
        .sg46__wide-row { display: flex; gap: 1rem; white-space: nowrap; }
        .sg46__wide { flex-shrink: 0; width: 400px; height: 180px; border-radius: 4px; overflow: hidden; position: relative; }
        .sg46__wide img { width: 100%; height: 100%; object-fit: cover; filter: brightness(0.6) contrast(1.15) saturate(1.1); transition: all 0.8s cubic-bezier(0.16, 1, 0.3, 1); }
        .sg46__wide:hover img { filter: brightness(0.8) contrast(1.1) saturate(1.15); }
        .sg46__wide-overlay { position: absolute; bottom: 0; left: 0; right: 0; padding: 12px 16px; background: linear-gradient(to top, rgba(0,0,0,0.7), transparent); display: flex; align-items: flex-end; justify-content: space-between; }
        .sg46__wide-name { font-family: 'Space Grotesk', sans-serif; font-size: 0.8rem; font-weight: 600; text-transform: uppercase; letter-spacing: 0.08em; color: rgba(255,255,255,0.9); }
        .sg46__wide-time { font-family: 'Share Tech Mono', monospace; font-size: 0.5rem; letter-spacing: 0.12em; color: #080808; background: #4ade80; padding: 2px 8px; border-radius: 2px; font-weight: 600; }
        .sg46__statement-row { display: flex; align-items: center; gap: 2rem; white-space: nowrap; padding: 1rem 0; }
        .sg46__statement { flex-shrink: 0; font-family: 'Space Grotesk', sans-serif; font-size: clamp(2.5rem, 5vw, 4.5rem); font-weight: 700; text-transform: uppercase; letter-spacing: -0.02em; line-height: 1; }
        .sg46__statement--ghost { color: rgba(255,255,255,0.03); }
        .sg46__statement--lit { color: rgba(255,255,255,0.85); }
        .sg46__dest-row { display: flex; gap: 2rem; white-space: nowrap; align-items: center; }
        .sg46__dest { flex-shrink: 0; display: flex; align-items: center; gap: 0.6rem; }
        .sg46__dest-name { font-family: 'Space Grotesk', sans-serif; font-size: 0.85rem; font-weight: 600; text-transform: uppercase; letter-spacing: 0.05em; color: rgba(255,255,255,0.65); }
        .sg46__dest-time { font-family: 'Share Tech Mono', monospace; font-size: 0.45rem; letter-spacing: 0.1em; color: #4ade80; }
        .sg46__dest-sep { width: 3px; height: 3px; border-radius: 50%; background: rgba(255,255,255,0.1); flex-shrink: 0; }
      `}</style>
      <section className="sg46">
        <motion.div className="sg46__wide-row" style={{ x: xL }}>
          {[...IMAGES, ...IMAGES.slice(0,4)].map((src, i) => (
            <div key={i} className="sg46__wide">
              <img src={src} alt="" loading="lazy" />
              <div className="sg46__wide-overlay">
                <span className="sg46__wide-name">{DESTINATIONS[i % DESTINATIONS.length].name}</span>
                <span className="sg46__wide-time">{DESTINATIONS[i % DESTINATIONS.length].time}</span>
              </div>
            </div>
          ))}
        </motion.div>
        <motion.div className="sg46__statement-row" style={{ x: xR }}>
          {STATEMENTS.concat(STATEMENTS).map((s, i) => (
            <span key={i} className={`sg46__statement ${i % 3 === 0 ? 'sg46__statement--lit' : 'sg46__statement--ghost'}`}>{s}</span>
          ))}
        </motion.div>
        <motion.div className="sg46__dest-row" style={{ x: xM }}>
          {[...DESTINATIONS, ...DESTINATIONS, ...DESTINATIONS].map((d, i) => (
            <React.Fragment key={i}>
              <span className="sg46__dest">
                <span className="sg46__dest-name">{d.name}</span>
                <span className="sg46__dest-time">{d.time}</span>
              </span>
              <span className="sg46__dest-sep" />
            </React.Fragment>
          ))}
        </motion.div>
      </section>
    </div>
  );
};

// ============================================================
// V47 — THE LIFESTYLE EDIT (Premium editorial — arrival stories + time comparison)
// Combines "They drove. You flew." with luxury editorial feel
// ============================================================

const V47 = () => {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end start'] });
  const xL = useTransform(scrollYProgress, [0, 1], ['7%', '-24%']);
  const xR = useTransform(scrollYProgress, [0, 1], ['-5%', '20%']);
  const xM = useTransform(scrollYProgress, [0, 1], ['4%', '-15%']);
  const xS = useTransform(scrollYProgress, [0, 1], ['-3%', '10%']);

  const comparisons = [
    { dest: 'Goodwood', drive: '2hr 30min', fly: '35min' },
    { dest: 'The Cotswolds', drive: '2hr 15min', fly: '1hr' },
    { dest: 'Padstow', drive: '5hr', fly: '2.5hrs' },
    { dest: 'St Andrews', drive: '7hr 30min', fly: '3.5hrs' },
    { dest: 'Lake District', drive: '4hr 45min', fly: '2hrs' },
    { dest: 'Cheltenham', drive: '2hr 30min', fly: '50min' },
    { dest: 'Le Touquet', drive: 'Eurotunnel + 3hrs', fly: '1hr' },
    { dest: 'Isle of Wight', drive: 'Ferry + 2hrs', fly: '45min' },
  ];

  return (
    <div ref={ref}>
      <style>{`
        .sg47 { background: #0c0c0c; padding: 3.5rem 0; overflow: hidden; display: flex; flex-direction: column; gap: 1.25rem; position: relative; }
        .sg47::before, .sg47::after { content: ''; position: absolute; top: 0; bottom: 0; width: 180px; z-index: 10; pointer-events: none; }
        .sg47::before { left: 0; background: linear-gradient(to right, #0c0c0c, transparent); }
        .sg47::after { right: 0; background: linear-gradient(to left, #0c0c0c, transparent); }
        .sg47__compare-row { display: flex; gap: 0; white-space: nowrap; }
        .sg47__compare { flex-shrink: 0; display: flex; align-items: center; gap: 1rem; padding: 0.75rem 2.5rem; border-right: 1px solid rgba(255,255,255,0.04); }
        .sg47__compare-dest { font-family: 'Space Grotesk', sans-serif; font-size: 1rem; font-weight: 700; text-transform: uppercase; letter-spacing: 0.04em; color: rgba(255,255,255,0.9); min-width: 140px; }
        .sg47__compare-drive { font-family: 'Share Tech Mono', monospace; font-size: 0.55rem; letter-spacing: 0.08em; color: rgba(255,255,255,0.25); text-decoration: line-through; text-decoration-color: rgba(255,255,255,0.15); }
        .sg47__compare-fly { font-family: 'Share Tech Mono', monospace; font-size: 0.55rem; letter-spacing: 0.1em; color: #0c0c0c; background: #4ade80; padding: 3px 10px; border-radius: 2px; font-weight: 600; }
        .sg47__img-row { display: flex; gap: 1rem; white-space: nowrap; }
        .sg47__img { flex-shrink: 0; width: 260px; height: 165px; border-radius: 4px; overflow: hidden; }
        .sg47__img img { width: 100%; height: 100%; object-fit: cover; filter: brightness(0.65) saturate(1.1); transition: all 0.5s ease; }
        .sg47__img:hover img { filter: brightness(0.85) saturate(1.15); }
        .sg47__big-row { display: flex; align-items: center; gap: 2.5rem; white-space: nowrap; padding: 0.5rem 0; }
        .sg47__big { flex-shrink: 0; font-family: 'Space Grotesk', sans-serif; font-size: clamp(2rem, 4vw, 3.5rem); font-weight: 700; text-transform: uppercase; letter-spacing: -0.01em; line-height: 1; }
        .sg47__big--a { color: rgba(255,255,255,0.85); }
        .sg47__big--b { color: rgba(255,255,255,0.04); }
        .sg47__lifestyle-row { display: flex; gap: 3rem; white-space: nowrap; padding: 0.25rem 0; }
        .sg47__lifestyle { flex-shrink: 0; font-family: 'Space Grotesk', sans-serif; font-size: 0.9rem; font-weight: 400; color: rgba(255,255,255,0.3); font-style: italic; }
      `}</style>
      <section className="sg47">
        <motion.div className="sg47__compare-row" style={{ x: xL }}>
          {comparisons.concat(comparisons).map((c, i) => (
            <div key={i} className="sg47__compare">
              <span className="sg47__compare-dest">{c.dest}</span>
              <span className="sg47__compare-drive">{c.drive}</span>
              <span className="sg47__compare-fly">{c.fly}</span>
            </div>
          ))}
        </motion.div>
        <motion.div className="sg47__img-row" style={{ x: xR }}>
          {[...IMAGES, ...IMAGES.slice(0,6)].map((src, i) => (
            <div key={i} className="sg47__img"><img src={src} alt="" loading="lazy" /></div>
          ))}
        </motion.div>
        <motion.div className="sg47__big-row" style={{ x: xM }}>
          {['They Drove.', 'You Flew.', 'They Queued.', 'You Landed.', 'They Waited.', 'You Arrived.', 'They Drove.', 'You Flew.'].map((w, i) => (
            <span key={i} className={`sg47__big ${i % 2 === 1 ? 'sg47__big--a' : 'sg47__big--b'}`}>{w}</span>
          ))}
        </motion.div>
        <motion.div className="sg47__lifestyle-row" style={{ x: xS }}>
          {[...LIFESTYLES, ...LIFESTYLES, ...LIFESTYLES].map((l, i) => (
            <span key={i} className="sg47__lifestyle">{l}</span>
          ))}
        </motion.div>
      </section>
    </div>
  );
};

// ============================================================
// V48 — HORIZON (5-layer depth parallax — the ultimate dreamscape)
// Background ghost text, mid images, foreground destinations
// ============================================================

const V48 = () => {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end start'] });
  const x1 = useTransform(scrollYProgress, [0, 1], ['3%', '-10%']);
  const x2 = useTransform(scrollYProgress, [0, 1], ['-6%', '20%']);
  const x3 = useTransform(scrollYProgress, [0, 1], ['10%', '-32%']);
  const x4 = useTransform(scrollYProgress, [0, 1], ['-4%', '14%']);
  const x5 = useTransform(scrollYProgress, [0, 1], ['8%', '-26%']);

  return (
    <div ref={ref}>
      <style>{`
        .sg48 { background: #0a0a0a; padding: 4.5rem 0; overflow: hidden; display: flex; flex-direction: column; gap: 0.75rem; position: relative; }
        .sg48::before, .sg48::after { content: ''; position: absolute; top: 0; bottom: 0; width: 220px; z-index: 10; pointer-events: none; }
        .sg48::before { left: 0; background: linear-gradient(to right, #0a0a0a, transparent); }
        .sg48::after { right: 0; background: linear-gradient(to left, #0a0a0a, transparent); }
        .sg48__ghost-row { display: flex; align-items: center; gap: 2rem; white-space: nowrap; }
        .sg48__ghost { flex-shrink: 0; font-family: 'Space Grotesk', sans-serif; font-size: clamp(3rem, 6vw, 5.5rem); font-weight: 700; text-transform: uppercase; letter-spacing: -0.03em; line-height: 1; color: rgba(255,255,255,0.025); }
        .sg48__img-row { display: flex; gap: 0.75rem; white-space: nowrap; }
        .sg48__img { flex-shrink: 0; width: 220px; height: 140px; border-radius: 4px; overflow: hidden; }
        .sg48__img img { width: 100%; height: 100%; object-fit: cover; filter: brightness(0.6) saturate(1.05); transition: all 0.6s cubic-bezier(0.16, 1, 0.3, 1); }
        .sg48__img:hover img { filter: brightness(0.85) saturate(1.15); }
        .sg48__dest-row { display: flex; gap: 1.5rem; white-space: nowrap; align-items: center; padding: 0.5rem 0; }
        .sg48__dest { flex-shrink: 0; display: flex; align-items: center; gap: 0.6rem; }
        .sg48__dest-name { font-family: 'Space Grotesk', sans-serif; font-size: 1rem; font-weight: 600; text-transform: uppercase; letter-spacing: 0.05em; color: rgba(255,255,255,0.85); }
        .sg48__dest-time { font-family: 'Share Tech Mono', monospace; font-size: 0.5rem; letter-spacing: 0.1em; color: #0a0a0a; background: #4ade80; padding: 3px 10px; border-radius: 2px; font-weight: 600; }
        .sg48__dest-pip { width: 4px; height: 4px; border-radius: 50%; background: rgba(74,222,128,0.3); flex-shrink: 0; }
        .sg48__mid-row { display: flex; align-items: center; gap: 2rem; white-space: nowrap; padding: 0.25rem 0; }
        .sg48__mid { flex-shrink: 0; font-family: 'Space Grotesk', sans-serif; font-size: clamp(1.5rem, 3vw, 2.5rem); font-weight: 700; text-transform: uppercase; letter-spacing: -0.01em; line-height: 1; color: rgba(255,255,255,0.08); }
        .sg48__mid--lit { color: rgba(255,255,255,0.7); }
      `}</style>
      <section className="sg48">
        <motion.div className="sg48__ghost-row" style={{ x: x1 }}>
          {['Freedom', 'Adventure', 'Escape', 'Discover', 'Explore', 'Arrive', 'Freedom', 'Adventure'].map((w, i) => (
            <span key={i} className="sg48__ghost">{w}</span>
          ))}
        </motion.div>
        <motion.div className="sg48__img-row" style={{ x: x2 }}>
          {[...IMAGES, ...IMAGES.slice(0,6)].map((src, i) => (
            <div key={i} className="sg48__img"><img src={src} alt="" loading="lazy" /></div>
          ))}
        </motion.div>
        <motion.div className="sg48__dest-row" style={{ x: x3 }}>
          {[...DESTINATIONS, ...DESTINATIONS].map((d, i) => (
            <React.Fragment key={i}>
              <span className="sg48__dest">
                <span className="sg48__dest-name">{d.name}</span>
                <span className="sg48__dest-time">{d.time}</span>
              </span>
              <span className="sg48__dest-pip" />
            </React.Fragment>
          ))}
        </motion.div>
        <motion.div className="sg48__img-row" style={{ x: x4 }}>
          {[...IMAGES.slice(6), ...IMAGES].map((src, i) => (
            <div key={i} className="sg48__img"><img src={src} alt="" loading="lazy" /></div>
          ))}
        </motion.div>
        <motion.div className="sg48__mid-row" style={{ x: x5 }}>
          {['Skip the M25.', 'Land at the Door.', 'Your Sky.', 'Your Schedule.', 'No Queues.', 'No Delays.', 'Just Fly.', 'Skip the M25.'].map((w, i) => (
            <span key={i} className={`sg48__mid ${i % 3 === 0 ? 'sg48__mid--lit' : ''}`}>{w}</span>
          ))}
        </motion.div>
      </section>
    </div>
  );
};

// ============================================================
// V49 — THE COLLECTION (Premium gallery — framed images + curated destinations)
// Luxury automotive gallery influence, black frames, precision
// ============================================================

const V49 = () => {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end start'] });
  const xL = useTransform(scrollYProgress, [0, 1], ['6%', '-22%']);
  const xR = useTransform(scrollYProgress, [0, 1], ['-5%', '18%']);
  const xM = useTransform(scrollYProgress, [0, 1], ['8%', '-28%']);

  return (
    <div ref={ref}>
      <style>{`
        .sg49 { background: #0a0a0a; padding: 4rem 0; overflow: hidden; display: flex; flex-direction: column; gap: 1.5rem; position: relative; }
        .sg49::before, .sg49::after { content: ''; position: absolute; top: 0; bottom: 0; width: 180px; z-index: 10; pointer-events: none; }
        .sg49::before { left: 0; background: linear-gradient(to right, #0a0a0a, transparent); }
        .sg49::after { right: 0; background: linear-gradient(to left, #0a0a0a, transparent); }
        .sg49__framed-row { display: flex; gap: 2rem; white-space: nowrap; align-items: center; }
        .sg49__frame { flex-shrink: 0; width: 280px; border: 1px solid rgba(255,255,255,0.08); border-radius: 4px; overflow: hidden; }
        .sg49__frame-img { width: 100%; height: 175px; overflow: hidden; }
        .sg49__frame-img img { width: 100%; height: 100%; object-fit: cover; filter: brightness(0.65) saturate(1.1); transition: all 0.6s cubic-bezier(0.16, 1, 0.3, 1); }
        .sg49__frame:hover .sg49__frame-img img { filter: brightness(0.85) saturate(1.15); }
        .sg49__frame-info { padding: 10px 14px; display: flex; align-items: center; justify-content: space-between; border-top: 1px solid rgba(255,255,255,0.06); }
        .sg49__frame-name { font-family: 'Space Grotesk', sans-serif; font-size: 0.75rem; font-weight: 600; text-transform: uppercase; letter-spacing: 0.08em; color: rgba(255,255,255,0.8); }
        .sg49__frame-time { font-family: 'Share Tech Mono', monospace; font-size: 0.5rem; letter-spacing: 0.1em; color: #0a0a0a; background: #4ade80; padding: 3px 10px; border-radius: 2px; font-weight: 600; }
        .sg49__headline-row { display: flex; align-items: center; gap: 3rem; white-space: nowrap; padding: 0.75rem 0; }
        .sg49__headline { flex-shrink: 0; font-family: 'Space Grotesk', sans-serif; font-size: clamp(2rem, 4vw, 3.5rem); font-weight: 700; text-transform: uppercase; letter-spacing: -0.02em; line-height: 1; }
        .sg49__headline--1 { color: rgba(255,255,255,0.85); }
        .sg49__headline--2 { color: rgba(255,255,255,0.3); }
        .sg49__headline--3 { color: rgba(255,255,255,0.08); }
        .sg49__headline-bar { width: 50px; height: 2px; background: linear-gradient(to right, #4ade80, transparent); flex-shrink: 0; }
        .sg49__dest-row { display: flex; gap: 2rem; white-space: nowrap; align-items: center; }
        .sg49__dest { flex-shrink: 0; display: flex; align-items: center; gap: 0.75rem; }
        .sg49__dest-idx { font-family: 'Share Tech Mono', monospace; font-size: 0.5rem; letter-spacing: 0.1em; color: rgba(255,255,255,0.2); }
        .sg49__dest-name { font-family: 'Space Grotesk', sans-serif; font-size: 0.9rem; font-weight: 600; text-transform: uppercase; letter-spacing: 0.05em; color: rgba(255,255,255,0.75); }
        .sg49__dest-time { font-family: 'Share Tech Mono', monospace; font-size: 0.45rem; letter-spacing: 0.1em; color: #4ade80; }
      `}</style>
      <section className="sg49">
        <motion.div className="sg49__framed-row" style={{ x: xL }}>
          {[...IMAGES, ...IMAGES.slice(0,4)].map((src, i) => (
            <div key={i} className="sg49__frame">
              <div className="sg49__frame-img"><img src={src} alt="" loading="lazy" /></div>
              <div className="sg49__frame-info">
                <span className="sg49__frame-name">{DESTINATIONS[i % DESTINATIONS.length].name}</span>
                <span className="sg49__frame-time">{DESTINATIONS[i % DESTINATIONS.length].time}</span>
              </div>
            </div>
          ))}
        </motion.div>
        <motion.div className="sg49__headline-row" style={{ x: xR }}>
          {['Where', 'Will', 'You', 'Go?', '·', 'Skip', 'the', 'Motorway.', '·', 'Land', 'at', 'the', 'Door.'].map((w, i) => (
            w === '·' ? <span key={i} className="sg49__headline-bar" /> :
            <span key={i} className={`sg49__headline sg49__headline--${i % 3 === 0 ? '1' : i % 3 === 1 ? '2' : '3'}`}>{w}</span>
          ))}
        </motion.div>
        <motion.div className="sg49__dest-row" style={{ x: xM }}>
          {[...DESTINATIONS, ...DESTINATIONS].map((d, i) => (
            <span key={i} className="sg49__dest">
              <span className="sg49__dest-idx">{String(i % 12 + 1).padStart(2, '0')}</span>
              <span className="sg49__dest-name">{d.name}</span>
              <span className="sg49__dest-time">{d.time}</span>
            </span>
          ))}
        </motion.div>
      </section>
    </div>
  );
};

// ============================================================
// V50 — THE PINNACLE (Best of everything — refined, layered, aspirational)
// Combines V1's green tags + V33's massive text + cinematic images
// The definitive version — editorial luxury meets tactical precision
// ============================================================

const V50 = () => {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end start'] });
  const x1 = useTransform(scrollYProgress, [0, 1], ['8%', '-26%']);
  const x2 = useTransform(scrollYProgress, [0, 1], ['-6%', '22%']);
  const x3 = useTransform(scrollYProgress, [0, 1], ['12%', '-36%']);
  const x4 = useTransform(scrollYProgress, [0, 1], ['-4%', '16%']);
  const x5 = useTransform(scrollYProgress, [0, 1], ['6%', '-20%']);

  const pinnacleStatements = [
    { big: 'Cotswolds for Lunch.', small: 'Home Before Dark.' },
    { big: 'Goodwood Trackside.', small: 'Not the Car Park.' },
    { big: 'Golf at St Andrews.', small: 'Breakfast at Denham.' },
    { big: 'Dinner in France.', small: 'Back by Midnight.' },
    { big: 'Skip the Motorway.', small: 'Take the Sky.' },
    { big: 'Your Weekend.', small: 'No Boundaries.' },
  ];

  return (
    <div ref={ref}>
      <style>{`
        .sg50 { background: #0b0b0b; padding: 4rem 0; overflow: hidden; display: flex; flex-direction: column; gap: 1rem; position: relative; }
        .sg50::before, .sg50::after { content: ''; position: absolute; top: 0; bottom: 0; width: 200px; z-index: 10; pointer-events: none; }
        .sg50::before { left: 0; background: linear-gradient(to right, #0b0b0b, transparent); }
        .sg50::after { right: 0; background: linear-gradient(to left, #0b0b0b, transparent); }
        .sg50__statement-row { display: flex; align-items: baseline; gap: 3rem; white-space: nowrap; padding: 0.5rem 0; }
        .sg50__statement-pair { flex-shrink: 0; display: flex; align-items: baseline; gap: 0.75rem; }
        .sg50__statement-big { font-family: 'Space Grotesk', sans-serif; font-size: clamp(2rem, 4vw, 3.2rem); font-weight: 700; text-transform: uppercase; letter-spacing: -0.01em; line-height: 1; color: rgba(255,255,255,0.85); }
        .sg50__statement-small { font-family: 'Space Grotesk', sans-serif; font-size: clamp(2rem, 4vw, 3.2rem); font-weight: 700; text-transform: uppercase; letter-spacing: -0.01em; line-height: 1; color: rgba(255,255,255,0.12); }
        .sg50__statement-sep { width: 6px; height: 6px; border-radius: 50%; background: #4ade80; box-shadow: 0 0 10px rgba(74,222,128,0.3); flex-shrink: 0; }
        .sg50__img-row { display: flex; gap: 1rem; white-space: nowrap; }
        .sg50__img { flex-shrink: 0; width: 250px; height: 160px; border-radius: 4px; overflow: hidden; }
        .sg50__img img { width: 100%; height: 100%; object-fit: cover; filter: brightness(0.6) saturate(1.1); transition: all 0.6s cubic-bezier(0.16, 1, 0.3, 1); }
        .sg50__img:hover img { filter: brightness(0.85) saturate(1.15); transform: scale(1.02); }
        .sg50__dest-row { display: flex; gap: 1.5rem; white-space: nowrap; align-items: center; padding: 0.25rem 0; }
        .sg50__dest { flex-shrink: 0; display: flex; align-items: center; gap: 0.75rem; }
        .sg50__dest-name { font-family: 'Space Grotesk', sans-serif; font-size: 1rem; font-weight: 600; text-transform: uppercase; letter-spacing: 0.05em; color: rgba(255,255,255,0.8); }
        .sg50__dest-time { font-family: 'Share Tech Mono', monospace; font-size: 0.5rem; letter-spacing: 0.12em; text-transform: uppercase; color: #0b0b0b; background: #4ade80; padding: 3px 10px; border-radius: 2px; font-weight: 600; }
        .sg50__dest-dot { width: 3px; height: 3px; border-radius: 50%; background: rgba(74,222,128,0.3); flex-shrink: 0; }
        .sg50__lifestyle-row { display: flex; gap: 3rem; white-space: nowrap; padding: 0.25rem 0; align-items: center; }
        .sg50__lifestyle { flex-shrink: 0; font-family: 'Space Grotesk', sans-serif; font-size: 0.85rem; font-weight: 400; color: rgba(255,255,255,0.25); font-style: italic; letter-spacing: 0.01em; }
        .sg50__lifestyle-line { width: 40px; height: 1px; background: linear-gradient(to right, transparent, rgba(255,255,255,0.06), transparent); flex-shrink: 0; }
      `}</style>
      <section className="sg50">
        <motion.div className="sg50__statement-row" style={{ x: x1 }}>
          {pinnacleStatements.concat(pinnacleStatements).map((s, i) => (
            <React.Fragment key={i}>
              <span className="sg50__statement-pair">
                <span className="sg50__statement-big">{s.big}</span>
                <span className="sg50__statement-small">{s.small}</span>
              </span>
              <span className="sg50__statement-sep" />
            </React.Fragment>
          ))}
        </motion.div>
        <motion.div className="sg50__img-row" style={{ x: x2 }}>
          {[...IMAGES, ...IMAGES.slice(0,6)].map((src, i) => (
            <div key={i} className="sg50__img"><img src={src} alt="" loading="lazy" /></div>
          ))}
        </motion.div>
        <motion.div className="sg50__dest-row" style={{ x: x3 }}>
          {[...DESTINATIONS, ...DESTINATIONS].map((d, i) => (
            <React.Fragment key={i}>
              <span className="sg50__dest">
                <span className="sg50__dest-name">{d.name}</span>
                <span className="sg50__dest-time">{d.time}</span>
              </span>
              <span className="sg50__dest-dot" />
            </React.Fragment>
          ))}
        </motion.div>
        <motion.div className="sg50__img-row" style={{ x: x4 }}>
          {[...IMAGES.slice(4), ...IMAGES.slice(0,4), ...IMAGES].map((src, i) => (
            <div key={i} className="sg50__img"><img src={src} alt="" loading="lazy" /></div>
          ))}
        </motion.div>
        <motion.div className="sg50__lifestyle-row" style={{ x: x5 }}>
          {[...LIFESTYLES, ...LIFESTYLES, ...LIFESTYLES].map((l, i) => (
            <React.Fragment key={i}>
              <span className="sg50__lifestyle">{l}</span>
              <span className="sg50__lifestyle-line" />
            </React.Fragment>
          ))}
        </motion.div>
      </section>
    </div>
  );
};

// ============================================================
// VARIATION REGISTRY
// ============================================================

const VARIATIONS = [
  { id: 'sg-v1', name: 'Bold Statements', category: 'Dark', desc: 'Oversized ghost text between destination images', component: V1 },
  { id: 'sg-v2', name: 'Departure Board', category: 'Dark', desc: 'Heliport departure board with destinations and status', component: V2 },
  { id: 'sg-v3', name: 'Cinematic Lifestyle', category: 'Dark', desc: 'Large cards with destination overlays and lifestyle quotes', component: V3 },
  { id: 'sg-v4', name: 'They Drove. You Flew.', category: 'Dark', desc: 'Struck-through car times vs helicopter times', component: V4 },
  { id: 'sg-v5', name: 'Weekend Plans', category: 'Light', desc: 'Warm editorial — "This Saturday: Lunch in the Cotswolds"', component: V5 },
  { id: 'sg-v6', name: 'The Bond Strip', category: 'Dark', desc: 'Dramatic single-line punch: ARRIVE · LIKE · BOND', component: V6 },
  { id: 'sg-v7', name: 'Destination Cards', category: 'Dark', desc: 'Split image+info cards with lifestyle notes', component: V7 },
  { id: 'sg-v8', name: 'Ghost Text', category: 'Dark', desc: 'Huge faded FREEDOM / ADVENTURE behind image rows', component: V8 },
  { id: 'sg-v9', name: 'Ticker Continuous', category: 'Dark', desc: 'Auto-scroll CSS animation with scroll parallax', component: V9 },
  { id: 'sg-v10', name: 'Split Vertical', category: 'Dark', desc: 'Left images scroll up, right destinations scroll down', component: V10 },
  { id: 'sg-v11', name: 'Gradient Mask', category: 'Dark', desc: 'Edge-faded infinite strips with lifestyle quotes', component: V11 },
  { id: 'sg-v12', name: 'Editorial Warm', category: 'Light', desc: 'Light bg, labelled destination cards, statement text', component: V12 },
  { id: 'sg-v13', name: 'Multi-Speed Parallax', category: 'Dark', desc: '3 depth layers at different scroll speeds', component: V13 },
  { id: 'sg-v14', name: 'Diagonal Luxury', category: 'Dark', desc: 'Angled strips with slight skew, clean destination labels', component: V14 },
  { id: 'sg-v15', name: 'Swiss Precision', category: 'Light', desc: 'Strict grid borders, red numbered destinations, B&W', component: V15 },
  { id: 'sg-v16', name: 'Glass Morphism', category: 'Dark', desc: 'Frosted glass destination cards over blue gradient', component: V16 },
  { id: 'sg-v17', name: 'Vertical Columns', category: 'Light', desc: '5 masonry columns scrolling in alternating directions', component: V17 },
  { id: 'sg-v18', name: 'Neon Glow', category: 'Dark', desc: 'Blue glow accents on borders, moody aviation feel', component: V18 },
  { id: 'sg-v19', name: '3D Perspective', category: 'Dark', desc: 'CSS 3D rotateX on scroll, depth shadows', component: V19 },
  { id: 'sg-v20', name: 'Brutalist Freedom', category: 'Light', desc: 'SKIP THE M25 · ARRIVE LIKE BOND · LAND AT THE DOOR', component: V20 },
  { id: 'sg-v21', name: 'Tactical Ops', category: 'Tactical', desc: 'Green HUD monospace, spy aesthetic, "● Online" status', component: V21 },
  { id: 'sg-v22', name: 'Mission Briefing', category: 'Tactical', desc: 'Tactical split cards with "● Route Clear" green status', component: V22 },
  { id: 'sg-v23', name: 'Intercept', category: 'Tactical', desc: 'Bold ghost statements + green time tags on destinations', component: V23 },
  { id: 'sg-v24', name: 'Flight Plan', category: 'Tactical', desc: 'Denham → Destination route strips with green arrow + ETA', component: V24 },
  { id: 'sg-v25', name: 'Comm Channel', category: 'Tactical', desc: 'Radio comms look, green scanlines, DEST/LOG prefixes', component: V25 },
  { id: 'sg-v26', name: 'Bold Destinations', category: 'Dark', desc: 'Huge destination names with green flight time accents', component: V26 },
  { id: 'sg-v27', name: 'Double Punch', category: 'Dark', desc: 'Two bold statement lines: SKIP THE TRAFFIC + YOUR FREEDOM', component: V27 },
  { id: 'sg-v28', name: 'Tactical Ticker', category: 'Tactical', desc: 'Auto-scroll with green HUD pips and ETA labels', component: V28 },
  { id: 'sg-v29', name: 'Executive Warm', category: 'Light', desc: 'Light premium feel, gold time accents, lifestyle quotes', component: V29 },
  { id: 'sg-v30', name: 'Arrival Stories', category: 'Dark', desc: 'Large italic lifestyle text: "Saturday: Goodwood." bold first sentence', component: V30 },
  { id: 'sg-v31', name: 'Monochrome + Green Tag', category: 'Light', desc: 'B&W images with green time pills on white background', component: V31 },
  { id: 'sg-v32', name: 'Night Ops', category: 'Tactical', desc: 'Ultra-dark with minimal green HUD elements and glowing pips', component: V32 },
  { id: 'sg-v33', name: 'Statement Grid', category: 'Dark', desc: '"Cotswolds Lunch. Home by 3." big text + green destination tags', component: V33 },
  { id: 'sg-v34', name: 'Classified', category: 'Tactical', desc: 'Declassified document feel — File badges, "Cleared" tags', component: V34 },
  { id: 'sg-v35', name: 'The Experience', category: 'Dark', desc: 'Split vertical: destination list left, images right, green route data', component: V35 },
  { id: 'sg-v36', name: 'Glitch Strip', category: 'Tactical', desc: 'Digital tactical rows with green ► markers and ghost statements', component: V36 },
  { id: 'sg-v37', name: 'Crossed Out Reality', category: 'Dark', desc: '~~M25 Gridlock 3hrs~~ → Goodwood 35min, with green "Direct" tag', component: V37 },
  { id: 'sg-v38', name: 'The Arrival', category: 'Dark', desc: '"Land at Goodwood. Walk to the paddock." — arrival moment stories', component: V38 },
  { id: 'sg-v39', name: 'Coordinates', category: 'Tactical', desc: 'Lat/long technical data with green arrows → destination names', component: V39 },
  { id: 'sg-v40', name: 'The Ultimate', category: 'Dark', desc: 'Best of all: bold ghost text + green pip tags + cinematic images', component: V40 },
  { id: 'sg-v41', name: 'The Dreamer', category: 'Dark', desc: 'Poetic lifestyle statements — "Lunch Overlooking the Sea. Home Before Dark."', component: V41 },
  { id: 'sg-v42', name: 'Editorial Luxury', category: 'Light', desc: 'Brand gradient headlines on warm white, editorial magazine feel', component: V42 },
  { id: 'sg-v43', name: 'The Journey', category: 'Dark', desc: 'Narrative: Denham → destination with green time tags + story text', component: V43 },
  { id: 'sg-v44', name: 'Arrival', category: 'Dark', desc: 'Cinematic wide images with arrival stories — "Step out at Goodwood"', component: V44 },
  { id: 'sg-v45', name: 'Warm Editorial', category: 'Light', desc: '"The Cotswolds for lunch" — destination + purpose + time on warm white', component: V45 },
  { id: 'sg-v46', name: 'Cinematic Widescreen', category: 'Dark', desc: 'Ultra-wide 16:9 images with destination overlays + massive ghost text', component: V46 },
  { id: 'sg-v47', name: 'The Lifestyle Edit', category: 'Dark', desc: 'Drive time ~~crossed out~~ vs fly time in green — "They Drove. You Flew."', component: V47 },
  { id: 'sg-v48', name: 'Horizon', category: 'Dark', desc: '5-layer depth parallax — giant ghost words, images, green-tagged destinations', component: V48 },
  { id: 'sg-v49', name: 'The Collection', category: 'Dark', desc: 'Luxury framed gallery cards with numbered destinations', component: V49 },
  { id: 'sg-v50', name: 'The Pinnacle', category: 'Dark', desc: 'Statement pairs + green pips + cinematic images + destination tags — the definitive version', component: V50 },
];

// ============================================================
// PICKER (inline, compact)
// ============================================================

const pickerCSS = `.sgp{position:fixed;bottom:20px;left:20px;width:420px;background:#fff;border-radius:16px;box-shadow:0 10px 40px rgba(0,0,0,.15);z-index:100000;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;transition:all .3s ease}.sgp.min{transform:translateY(calc(100% - 44px))}.sgp__bar{display:none;height:44px;background:#0a0a0a;border-radius:16px 16px 0 0;padding:0 16px;align-items:center;justify-content:space-between;color:#fff;cursor:pointer}.sgp.min .sgp__bar{display:flex}.sgp__bar-info{display:flex;align-items:center;gap:12px;font-size:13px}.sgp__bar-name{font-weight:600}.sgp__bar-ct{opacity:.6;font-size:11px}.sgp__bar-nav{display:flex;gap:8px}.sgp__bar-btn{width:28px;height:28px;border:none;background:rgba(255,255,255,.1);color:#fff;border-radius:6px;cursor:pointer;font-size:14px}.sgp__bar-btn:hover{background:rgba(255,255,255,.2)}.sgp__body{display:block}.sgp.min .sgp__body{visibility:hidden;height:0;overflow:hidden}.sgp__hd{display:flex;justify-content:space-between;align-items:center;padding:12px 16px;border-bottom:1px solid #e5e5e5}.sgp__hd h3{font-size:14px;font-weight:700;margin:0}.sgp__hd-min{width:28px;height:28px;border:1px solid #e5e5e5;background:#fff;border-radius:6px;cursor:pointer;font-size:14px}.sgp__tabs{display:flex;flex-wrap:wrap;gap:4px;padding:12px;background:#f5f5f5;border-bottom:1px solid #e5e5e5}.sgp__tab{padding:6px 10px;font-size:11px;font-weight:500;background:#fff;border:1px solid #e5e5e5;border-radius:6px;cursor:pointer;transition:all .15s}.sgp__tab:hover{border-color:#333}.sgp__tab.on{background:#0a0a0a;color:#fff;border-color:#0a0a0a}.sgp__cnt{padding:16px}.sgp__nav{display:flex;align-items:center;gap:12px;position:relative}.sgp__nav-btn{width:36px;height:36px;border:1px solid #e5e5e5;background:#fff;border-radius:8px;cursor:pointer;font-size:16px;transition:all .15s;flex-shrink:0}.sgp__nav-btn:hover{background:#0a0a0a;color:#fff;border-color:#0a0a0a}.sgp__nfo{flex:1;text-align:center;min-width:0}.sgp__cat{display:block;font-size:10px;font-weight:600;text-transform:uppercase;letter-spacing:.1em;color:#e04a2f;margin-bottom:4px}.sgp__ct{font-size:10px;color:#999}.sgp__nm{font-size:14px;font-weight:700;margin:4px 0;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}.sgp__ds{font-size:11px;color:#666;margin:0;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}.sgp__fav{position:absolute;right:0;top:50%;transform:translateY(-50%);width:36px;height:36px;border:2px solid #e5e5e5;background:#fff;border-radius:50%;cursor:pointer;font-size:18px;transition:all .15s;display:flex;align-items:center;justify-content:center}.sgp__fav:hover{border-color:#f59e0b;color:#f59e0b}.sgp__fav.on{background:#f59e0b;border-color:#f59e0b;color:#fff}.sgp__ft{display:flex;justify-content:space-between;align-items:center;padding:12px 16px;background:#f5f5f5;border-top:1px solid #e5e5e5;border-radius:0 0 16px 16px}.sgp__ft-l{display:flex;gap:8px}.sgp__btn{padding:6px 12px;font-size:11px;font-weight:500;background:#0a0a0a;color:#fff;border:none;border-radius:6px;cursor:pointer}.sgp__btn:hover{opacity:.9}.sgp__btn--f{background:#333}.sgp__btn--f.has{background:#d97706}.sgp__btn--c{background:#6366f1}.sgp__btn--ok{background:#22c55e!important}.sgp__fc{display:inline-block;min-width:16px;padding:0 4px;background:rgba(255,255,255,.2);border-radius:8px;font-size:10px}.sgp__hints{display:flex;gap:12px;font-size:10px;color:#999}.sgp__hints kbd{background:#fff;border:1px solid #ddd;border-radius:3px;padding:1px 4px;font-family:inherit;font-size:9px}.sgp__go{position:fixed;inset:0;background:rgba(0,0,0,.8);z-index:100002;display:none;flex-direction:column}.sgp__go.on{display:flex}.sgp__go-hd{display:flex;justify-content:space-between;align-items:center;padding:20px;background:#fff}.sgp__go-hd h2{margin:0;font-size:18px}.sgp__go-x{width:36px;height:36px;border:none;background:#f5f5f5;border-radius:8px;cursor:pointer;font-size:18px}.sgp__go-g{flex:1;overflow-y:auto;padding:20px;display:grid;grid-template-columns:repeat(auto-fill,minmax(200px,1fr));gap:12px;align-content:start}.sgp__go-i{background:#fff;border-radius:8px;padding:12px;cursor:pointer;transition:all .15s}.sgp__go-i:hover{transform:translateY(-2px);box-shadow:0 4px 12px rgba(0,0,0,.15)}.sgp__go-i__n{font-weight:600;font-size:13px;margin-bottom:4px}.sgp__go-i__d{font-size:11px;color:#666}.sgp__nm-modal{position:fixed;inset:0;background:rgba(0,0,0,.5);display:flex;align-items:center;justify-content:center;z-index:100003}.sgp__nm-c{background:#fff;border-radius:12px;padding:20px;width:320px;box-shadow:0 20px 40px rgba(0,0,0,.3)}.sgp__nm-hd{display:flex;align-items:center;gap:8px;font-weight:600;font-size:14px;margin-bottom:8px}.sgp__nm-ic{color:#f59e0b;font-size:18px}.sgp__nm-nm{font-size:12px;color:#666;margin-bottom:12px;padding:6px 10px;background:#f5f5f5;border-radius:6px}.sgp__nm-in{width:100%;padding:10px 12px;border:2px solid #e5e5e5;border-radius:8px;font-size:13px;font-family:inherit;resize:none;box-sizing:border-box}.sgp__nm-in:focus{outline:none;border-color:#f59e0b}.sgp__nm-acts{display:flex;gap:8px;margin-top:12px}.sgp__nm-can,.sgp__nm-sav{flex:1;padding:8px 16px;border:none;border-radius:6px;font-size:12px;font-weight:600;cursor:pointer}.sgp__nm-can{background:#f5f5f5;color:#666}.sgp__nm-sav{background:#f59e0b;color:#fff}@media(max-width:480px){.sgp{left:10px;right:10px;width:auto}}`;

const SGPicker = ({ currentIndex, setCurrentIndex, items }) => {
  const [isMin, setIsMin] = useState(false);
  const [isGrid, setIsGrid] = useState(false);
  const [favs, setFavs] = useState([]);
  const [noteModal, setNoteModal] = useState(null);
  const [copyMsg, setCopyMsg] = useState(null);
  const noteRef = useRef(null);
  const key = 'sg-picker-fav-v2';

  useEffect(() => { const s = localStorage.getItem(key); if (s) try { setFavs(JSON.parse(s)); } catch(e) {} }, []);
  useEffect(() => { localStorage.setItem(key, JSON.stringify(favs)); }, [favs]);

  const item = items[currentIndex];
  const isFav = favs.some(f => f.id === item?.id);
  const goN = useCallback(() => setCurrentIndex(i => (i + 1) % items.length), [items.length]);
  const goP = useCallback(() => setCurrentIndex(i => (i - 1 + items.length) % items.length), [items.length]);

  useEffect(() => {
    const h = (e) => {
      if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') return;
      if (e.key === 'ArrowRight') { e.preventDefault(); goN(); }
      if (e.key === 'ArrowLeft') { e.preventDefault(); goP(); }
      if (e.key === 'f' || e.key === 'F') { e.preventDefault(); toggleFav(); }
      if (e.key === 'm' || e.key === 'M') { e.preventDefault(); setIsMin(p => !p); }
      if (e.key === 'Escape') { if (isGrid) setIsGrid(false); else if (noteModal) setNoteModal(null); else setIsMin(p => !p); }
    };
    window.addEventListener('keydown', h);
    return () => window.removeEventListener('keydown', h);
  }, [goN, goP, isGrid, noteModal]);

  const toggleFav = () => { if (!item) return; if (isFav) setFavs(p => p.filter(f => f.id !== item.id)); else setNoteModal({ id: item.id, name: item.name }); };
  const saveFav = (note) => { if (!noteModal) return; setFavs(p => [...p, { id: noteModal.id, name: noteModal.name, note: note || '' }]); setNoteModal(null); };
  const copyFavs = () => {
    if (!favs.length) { setCopyMsg('None'); setTimeout(() => setCopyMsg(null), 1500); return; }
    navigator.clipboard.writeText(favs.map(f => `${f.id} (${f.name})${f.note ? `\n   → ${f.note}` : ''}`).join('\n\n')).then(() => setCopyMsg('Copied!')).catch(() => setCopyMsg('Failed'));
    setTimeout(() => setCopyMsg(null), 1500);
  };
  useEffect(() => { if (noteModal && noteRef.current) noteRef.current.focus(); }, [noteModal]);

  const cats = [...new Set(items.map(i => i.category))];
  const [tab, setTab] = useState('All');

  return (
    <>
      <style>{pickerCSS}</style>
      <div className={`sgp ${isMin ? 'min' : ''}`}>
        <div className="sgp__bar" onClick={() => setIsMin(false)}>
          <div className="sgp__bar-info"><span className="sgp__bar-name">{item?.name}</span><span className="sgp__bar-ct">{currentIndex + 1}/{items.length}</span></div>
          <div className="sgp__bar-nav">
            <button className="sgp__bar-btn" onClick={e => { e.stopPropagation(); goP(); }}>←</button>
            <button className="sgp__bar-btn" onClick={e => { e.stopPropagation(); goN(); }}>→</button>
            <button className="sgp__bar-btn" onClick={e => { e.stopPropagation(); setIsMin(false); }}>↑</button>
          </div>
        </div>
        <div className="sgp__body">
          <div className="sgp__hd"><h3>Sliding Gallery</h3><button className="sgp__hd-min" onClick={() => setIsMin(true)}>−</button></div>
          <div className="sgp__tabs">
            <button className={`sgp__tab ${tab === 'All' ? 'on' : ''}`} onClick={() => setTab('All')}>All ({items.length})</button>
            {cats.map(c => <button key={c} className={`sgp__tab ${tab === c ? 'on' : ''}`} onClick={() => setTab(c)}>{c} ({items.filter(i => i.category === c).length})</button>)}
          </div>
          <div className="sgp__cnt">
            <div className="sgp__nav">
              <button className="sgp__nav-btn" onClick={goP}>←</button>
              <div className="sgp__nfo">
                <span className="sgp__cat">{item?.category}</span>
                <span className="sgp__ct">{currentIndex + 1} / {items.length}</span>
                <h3 className="sgp__nm">{item?.name}</h3>
                <p className="sgp__ds">{item?.desc}</p>
              </div>
              <button className="sgp__nav-btn" onClick={goN}>→</button>
              <button className={`sgp__fav ${isFav ? 'on' : ''}`} onClick={toggleFav}>{isFav ? '★' : '☆'}</button>
            </div>
          </div>
          <div className="sgp__ft">
            <div className="sgp__ft-l">
              <button className="sgp__btn" onClick={() => setIsGrid(true)}>View All</button>
              <button className={`sgp__btn sgp__btn--f ${favs.length ? 'has' : ''}`}>★ <span className="sgp__fc">{favs.length}</span></button>
              <button className={`sgp__btn sgp__btn--c ${copyMsg === 'Copied!' ? 'sgp__btn--ok' : ''}`} onClick={copyFavs}>{copyMsg || 'Copy'}</button>
            </div>
            <div className="sgp__hints"><span><kbd>←</kbd><kbd>→</kbd> Nav</span><span><kbd>F</kbd> Fav</span><span><kbd>M</kbd> Mini</span></div>
          </div>
        </div>
      </div>
      {isGrid && (
        <div className="sgp__go on">
          <div className="sgp__go-hd"><h2>All Variations</h2><button className="sgp__go-x" onClick={() => setIsGrid(false)}>×</button></div>
          <div className="sgp__go-g">
            {items.map((it, idx) => (
              <div key={it.id} className="sgp__go-i" onClick={() => { setCurrentIndex(idx); setIsGrid(false); }}>
                <div className="sgp__go-i__n">{it.name}</div>
                <div className="sgp__go-i__d">{it.desc}</div>
              </div>
            ))}
          </div>
        </div>
      )}
      {noteModal && (
        <div className="sgp__nm-modal" onClick={() => setNoteModal(null)}>
          <div className="sgp__nm-c" onClick={e => e.stopPropagation()}>
            <div className="sgp__nm-hd"><span className="sgp__nm-ic">★</span><span>Add to Favorites</span></div>
            <div className="sgp__nm-nm">{noteModal.name}</div>
            <textarea ref={noteRef} className="sgp__nm-in" placeholder="Add a note..." rows={2} onKeyDown={e => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); saveFav(e.target.value.trim()); } if (e.key === 'Escape') setNoteModal(null); }} />
            <div className="sgp__nm-acts">
              <button className="sgp__nm-can" onClick={() => setNoteModal(null)}>Cancel</button>
              <button className="sgp__nm-sav" onClick={() => saveFav(noteRef.current?.value.trim())}>Save</button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

// ============================================================
// MAIN PAGE
// ============================================================

const SlidingGalleryVariations = () => {
  const [idx, setIdx] = useState(0);
  const Comp = VARIATIONS[idx].component;

  return (
    <div style={{ minHeight: '100vh', background: '#faf9f6' }}>
      <style>{`
        .sgv__hd { padding: 6rem 2rem 3rem; text-align: center; max-width: 700px; margin: 0 auto; }
        .sgv__pre { font-family: 'Share Tech Mono', monospace; font-size: 0.65rem; letter-spacing: 0.25em; text-transform: uppercase; color: #999; margin-bottom: 1rem; }
        .sgv__h1 { font-family: 'Space Grotesk', sans-serif; font-size: clamp(2rem, 4vw, 3rem); font-weight: 700; text-transform: uppercase; color: #1a1a1a; margin: 0 0 1rem; line-height: 1.1; }
        .sgv__sub { font-family: 'Space Grotesk', sans-serif; font-size: 1.1rem; color: #666; line-height: 1.8; margin: 0; }
        .sgv__sp { height: 40vh; }
        .sgv__lbl { font-family: 'Share Tech Mono', monospace; font-size: 0.65rem; letter-spacing: 0.15em; text-transform: uppercase; color: #999; text-align: center; padding: 1.5rem; }
      `}</style>
      <div className="sgv__hd">
        <div className="sgv__pre">Destinations Gallery</div>
        <h1 className="sgv__h1">Where Will You Fly?</h1>
        <p className="sgv__sub">Scroll-driven strips showcasing the freedom of helicopter travel. Goodwood for the races. The Cotswolds for lunch. Le Touquet for dinner. Your helicopter. Your schedule.</p>
      </div>
      <div className="sgv__lbl">V{idx + 1} — {VARIATIONS[idx].name}</div>
      <div className="sgv__sp" />
      <Comp />
      <div className="sgv__sp" />
      <SGPicker currentIndex={idx} setCurrentIndex={setIdx} items={VARIATIONS} />
    </div>
  );
};

export default SlidingGalleryVariations;

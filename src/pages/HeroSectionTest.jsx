/**
 * HERO SECTION TEST PAGE
 *
 * Variations of the FinalDraft homepage hero.
 * Same design system: Space Grotesk, Share Tech Mono,
 * #faf9f6 / #1a1a1a palette, architectural grid lines,
 * coordinates, scroll-driven animations.
 */

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { motion, useScroll, useTransform, useSpring, AnimatePresence } from 'framer-motion';
import Picker from '../components/Picker';

// ============================================
// SHARED CONSTANTS
// ============================================

const IMGS = {
  hero: '/assets/images/facility/hq-0209.jpg',
  northPole: '/assets/images/expeditions/six-helis-in-North-Pole.jpg',
  antartica: '/assets/images/expeditions/antartica.jpg',
  channel: '/assets/images/expeditions/channel.jpg',
  expeditionQ: '/assets/images/expeditions/helicopter-expeditions-quentin-smith.webp',
  southPole: '/assets/images/expeditions/south-pole-by-helicopter-quentin-smith.webp',
  hangar: '/assets/images/facility/hq-0745.jpg',
  cockpit: '/assets/images/facility/hq-0354.jpg',
  fleet: '/assets/images/facility/hq-0254.jpg',
  aerial: '/assets/images/facility/hq-0089.jpg',
  facility: '/assets/images/facility/hq-0035.jpg',
  hangarMain: '/assets/images/facility/hangar-main.jpg',
  busyHangar: '/assets/images/facility/busy-hangar.jpg',
  // Extended gallery for multi-image variations
  event1: '/assets/images/gallery/events/img_2028.jpg',
  event2: '/assets/images/gallery/events/img_1346.jpg',
  event3: '/assets/images/gallery/events/img_2131.jpg',
  event4: '/assets/images/gallery/events/img_1539.jpg',
  event5: '/assets/images/gallery/events/img_2278.jpg',
  event6: '/assets/images/gallery/events/img_4488.jpg',
  event7: '/assets/images/gallery/events/dsc_4073_jpg.jpg',
  event8: '/assets/images/gallery/events/img_8733.jpg',
  flying1: '/assets/images/gallery/flying/flying-.jpg',
  flying2: '/assets/images/gallery/flying/foggy-evening-flying.jpg',
  flyingNight: '/assets/images/gallery/flying/james-shadow-night.jpg',
  social1: '/assets/images/gallery/social/img-20230425-wa0001.jpg',
  social2: '/assets/images/gallery/social/img-20241004-wa0005.jpg',
  social3: '/assets/images/gallery/social/img-20241004-wa0009.jpg',
  social4: '/assets/images/gallery/social/img-20241004-wa0011.jpg',
  northPole2: '/assets/images/expeditions/north-pole.jpg',
  hq0391: '/assets/images/facility/hq-0391.jpg',
  hq0477: '/assets/images/facility/hq-0477.jpg',
  hq0698: '/assets/images/facility/hq-0698.jpg',
};

const FILMSTRIP = [
  IMGS.expeditionQ, IMGS.hero, IMGS.aerial,
  IMGS.antartica, IMGS.channel, IMGS.facility,
  IMGS.southPole, IMGS.hangar, IMGS.cockpit,
  IMGS.busyHangar, IMGS.fleet, IMGS.hangarMain,
];

// Extended gallery for multi-image hero variations
const GALLERY = [
  IMGS.northPole, IMGS.antartica, IMGS.expeditionQ, IMGS.southPole,
  IMGS.channel, IMGS.hero, IMGS.aerial, IMGS.cockpit,
  IMGS.fleet, IMGS.hangar, IMGS.busyHangar, IMGS.facility,
  IMGS.event1, IMGS.event2, IMGS.event3, IMGS.event4,
  IMGS.event5, IMGS.event6, IMGS.event7, IMGS.event8,
  IMGS.flying1, IMGS.flying2, IMGS.flyingNight,
  IMGS.social1, IMGS.social2, IMGS.social3, IMGS.social4,
  IMGS.northPole2, IMGS.hq0391, IMGS.hq0477, IMGS.hq0698,
  IMGS.hangarMain,
];

const LOGO_SRC = '/assets/images/hq-aviation-logo.webp';

const Logo = ({ width = 'clamp(200px, 30vw, 400px)', light = false, className = '' }) => (
  <img
    src={LOGO_SRC}
    alt="HQ Aviation"
    className={`hst__logo ${className}`}
    style={{
      width, height: 'auto', display: 'block',
      filter: light ? 'invert(1) brightness(2)' : 'none',
    }}
  />
);

const UnionJack = ({ size = 14 }) => (
  <img
    src="/assets/images/icons/Union Jack.svg"
    alt="UK"
    style={{
      width: size, height: 'auto',
      filter: 'grayscale(100%) contrast(1.2)',
      opacity: 0.7,
      display: 'inline-block',
      verticalAlign: 'middle',
    }}
  />
);

const Coords = ({ className = '' }) => (
  <div className={`hst__coords ${className}`}>
    <span>51.5751°N</span>
    <UnionJack size={12} />
    <span>0.5059°W</span>
  </div>
);

const ScrollPrompt = ({ className = '' }) => (
  <div className={`hst__scroll-prompt ${className}`}>
    <span className="hst__scroll-text">Scroll to explore</span>
    <div className="hst__scroll-line"><span /></div>
  </div>
);

// Animated grid lines - the defining visual motif
const GridLines = ({ layout = 'default', visible = true, className = '' }) => {
  const layouts = {
    // Current FinalDraft layout
    default: {
      v: [5, 28, 72, 95],
      h: [15, 85],
    },
    // Asymmetric - golden ratio inspired
    golden: {
      v: [3, 38.2, 61.8, 97],
      h: [20, 80],
    },
    // Thirds
    thirds: {
      v: [2, 33.33, 66.66, 98],
      h: [33.33, 66.66],
    },
    // Dense architectural
    dense: {
      v: [5, 20, 40, 60, 80, 95],
      h: [10, 50, 90],
    },
    // Minimal - just two verticals framing content
    minimal: {
      v: [8, 92],
      h: [12, 88],
    },
    // Left heavy
    leftHeavy: {
      v: [3, 15, 35, 97],
      h: [18, 82],
    },
  };

  const l = layouts[layout] || layouts.default;

  return (
    <div className={`hst__grid ${visible ? 'hst__grid--visible' : ''} ${className}`}>
      {l.v.map((pos, i) => (
        <div
          key={`v${i}`}
          className="hst__line hst__line--v"
          style={{ left: `${pos}%`, transitionDelay: `${0.1 + i * 0.1}s` }}
        />
      ))}
      {l.h.map((pos, i) => (
        <div
          key={`h${i}`}
          className="hst__line hst__line--h"
          style={{ top: `${pos}%`, transitionDelay: `${0.5 + i * 0.1}s` }}
        />
      ))}
    </div>
  );
};

// ============================================
// V1 - CURRENT BASELINE
// The FinalDraft hero: side images, center text,
// scroll-driven section cycling, grid lines
// ============================================
const HeroV1 = () => {
  const [activeSection, setActiveSection] = useState(0);
  const [linesVisible, setLinesVisible] = useState(false);
  const [imagesExpanded, setImagesExpanded] = useState(false);
  const heroRef = useRef(null);

  const leftImages = [IMGS.antartica, IMGS.northPole, IMGS.channel, IMGS.southPole];
  const rightImages = [IMGS.expeditionQ, IMGS.southPole, IMGS.antartica, IMGS.northPole];

  const sections = [
    { pre: 'Welcome to', headline: 'logo', desc: 'The Robinson Specialists since 2010' },
    { pre: 'Built on', headline: ['Precision', '&', 'Excellence'], desc: 'Three decades of uncompromising standards' },
    { pre: 'World-class', headline: ['Flight', 'Training'], desc: 'From first flight to commercial certification' },
    { pre: 'Beyond horizons', headline: ['Global', 'Expeditions'], desc: 'Adventure awaits at every altitude' },
  ];

  useEffect(() => {
    const t = setTimeout(() => setLinesVisible(true), 100);
    return () => clearTimeout(t);
  }, []);

  useEffect(() => {
    const onScroll = () => {
      const y = window.scrollY;
      const h = window.innerHeight * 4;
      const progress = Math.min(y / h, 1);
      setActiveSection(Math.min(Math.floor(progress * 4), 3));
      setImagesExpanded(y > h * 0.85);
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <section className="hst-hero hst-v1" ref={heroRef} style={{ height: 'calc(400vh + 250px)' }}>
      <GridLines visible={linesVisible} className={imagesExpanded ? 'hst__grid--faded' : ''} />

      <div className={`hst-v1__image hst-v1__image--left ${imagesExpanded ? 'hst-v1__image--gone' : ''}`}
        style={{ opacity: linesVisible ? 1 : 0 }}>
        {leftImages.map((src, i) => (
          <img key={src} src={src} alt="" className={`hst-v1__cycle ${activeSection === i ? 'active' : ''}`} />
        ))}
      </div>

      <div className={`hst-v1__image hst-v1__image--right ${imagesExpanded ? 'hst-v1__image--gone' : ''}`}
        style={{ opacity: linesVisible ? 1 : 0 }}>
        {rightImages.map((src, i) => (
          <img key={src} src={src} alt="" className={`hst-v1__cycle ${activeSection === i ? 'active' : ''}`} />
        ))}
      </div>

      <div className={`hst-v1__center ${imagesExpanded ? 'hst-v1__center--faded' : ''}`}>
        {sections.map((s, i) => (
          <div key={i} className={`hst-v1__section ${activeSection === i ? 'active' : ''}`}>
            <Coords />
            <span className="hst__pre">{s.pre}</span>
            {s.headline === 'logo'
              ? <Logo width="clamp(180px, 25vw, 350px)" />
              : <h1 className="hst__headline">
                  {s.headline.map((w, j) => (
                    <span key={j} className={`hst__word hst__word--${j + 1}`} style={{ '--delay': `${j * 0.1}s` }}>{w}</span>
                  ))}
                </h1>
            }
            <p className="hst__desc">{s.desc}</p>
          </div>
        ))}
      </div>

      <div className={`hst-v1__progress ${imagesExpanded ? 'hst-v1__progress--faded' : ''}`}>
        {sections.map((_, i) => (
          <div key={i} className={`hst-v1__dot ${activeSection >= i ? 'active' : ''}`} />
        ))}
      </div>

      <ScrollPrompt className={imagesExpanded ? 'hst__scroll-prompt--hidden' : ''} />
    </section>
  );
};


// ============================================
// V2 - FULL BLEED WITH FRAMED TEXT
// Full expedition image. Text in a structured
// "frame" defined by grid lines. Filmstrip
// integrated as a bottom bar within the grid.
// ============================================
const HeroV2 = () => {
  const [linesVisible, setLinesVisible] = useState(false);
  const [activeThumb, setActiveThumb] = useState(null);
  const heroRef = useRef(null);
  const { scrollYProgress } = useScroll({ target: heroRef, offset: ['start start', 'end start'] });
  const bgY = useTransform(scrollYProgress, [0, 1], ['0%', '20%']);
  const contentOpacity = useTransform(scrollYProgress, [0, 0.4], [1, 0]);

  useEffect(() => {
    const t = setTimeout(() => setLinesVisible(true), 200);
    return () => clearTimeout(t);
  }, []);

  return (
    <section className="hst-hero hst-v2" ref={heroRef} style={{ height: '200vh' }}>
      <div className="hst-v2__sticky">
        <motion.div className="hst-v2__bg" style={{ y: bgY }}>
          <img src={activeThumb !== null ? FILMSTRIP[activeThumb] : IMGS.hero} alt="" />
        </motion.div>
        <div className="hst-v2__overlay" />

        <GridLines layout="golden" visible={linesVisible} className="hst__grid--light" />

        <motion.div className="hst-v2__content" style={{ opacity: contentOpacity }}>
          <Coords className="hst__coords--light" />
          <span className="hst__pre hst__pre--light">Welcome to</span>
          <Logo width="clamp(200px, 28vw, 380px)" light />
          <div className="hst-v2__meta">
            <span>EST. 2010</span>
            <span className="hst-v2__sep" />
            <span>LONDON</span>
            <span className="hst-v2__sep" />
            <UnionJack size={14} />
          </div>
          <p className="hst__desc hst__desc--light">The Robinson Specialists</p>
        </motion.div>

        <motion.div className="hst-v2__filmstrip" style={{ opacity: contentOpacity }}>
          {FILMSTRIP.slice(0, 10).map((src, i) => (
            <div
              key={i}
              className={`hst-v2__thumb ${activeThumb === i ? 'active' : ''}`}
              onMouseEnter={() => setActiveThumb(i)}
              onMouseLeave={() => setActiveThumb(null)}
            >
              <img src={src} alt="" />
            </div>
          ))}
        </motion.div>

        <ScrollPrompt className="hst__scroll-prompt--light" />
      </div>
    </section>
  );
};


// ============================================
// V3 - CONTAINED IMAGE, EXTERIOR TEXT
// Image sits inside the grid as a "window".
// Title, coords, meta sit outside the image
// frame in the warm beige space. Architectural.
// ============================================
const V3_IMAGES = [
  IMGS.hero, IMGS.aerial, IMGS.expeditionQ, IMGS.cockpit,
  IMGS.antartica, IMGS.fleet, IMGS.hangar, IMGS.channel,
  IMGS.flying1, IMGS.flying2, IMGS.event1, IMGS.busyHangar,
];

const HeroV3 = () => {
  const [linesVisible, setLinesVisible] = useState(false);
  const heroRef = useRef(null);
  const { scrollYProgress } = useScroll({ target: heroRef, offset: ['start start', 'end end'] });

  useEffect(() => {
    const t = setTimeout(() => setLinesVisible(true), 200);
    return () => clearTimeout(t);
  }, []);

  return (
    <section className="hst-hero hst-v3" ref={heroRef} style={{ height: `${V3_IMAGES.length * 60}vh` }}>
      <div className="hst-v3__sticky">
        <GridLines layout="thirds" visible={linesVisible} />

        {/* Left side — sticky, vertically centered */}
        <div className="hst-v3__left">
          <Coords />
          <span className="hst__pre">Welcome to</span>
          <Logo width="clamp(180px, 25vw, 350px)" />
          <p className="hst__desc" style={{ marginTop: '1.5rem' }}>The Robinson Specialists</p>
          <div className="hst-v3__meta">
            <span>EST. 2010</span>
            <span className="hst-v3__dot" />
            <span>LONDON</span>
            <span className="hst-v3__dot" />
            <UnionJack size={12} />
          </div>
        </div>

        {/* Right side — scroll-driven image stack */}
        <div className="hst-v3__frame">
          {V3_IMAGES.map((src, i) => {
            const step = 1 / V3_IMAGES.length;
            const start = i * step;
            const end = start + step;
            return (
              <motion.div
                key={i}
                className="hst-v3__frame-img"
                style={{
                  opacity: useTransform(scrollYProgress,
                    [Math.max(0, start - step * 0.15), start, end - step * 0.15, end],
                    [0, 1, 1, 0]
                  ),
                  zIndex: V3_IMAGES.length - i,
                }}
              >
                <img src={src} alt="" />
              </motion.div>
            );
          })}
          <div className="hst-v3__frame-counter">
            {V3_IMAGES.map((_, i) => {
              const step = 1 / V3_IMAGES.length;
              const start = i * step;
              const end = start + step;
              return (
                <motion.div
                  key={i}
                  className="hst-v3__counter-dot"
                  style={{
                    opacity: useTransform(scrollYProgress, [start, start + step * 0.1, end - step * 0.1, end], [0.3, 1, 1, 0.3]),
                  }}
                />
              );
            })}
          </div>
        </div>

        <ScrollPrompt />
      </div>
    </section>
  );
};


// ============================================
// V4 - VERTICAL COLUMNS
// Inspired by hero-83. Tall vertical columns
// with images filling alternating slots.
// Central column holds the headline.
// Column borders create the grid.
// ============================================
const HeroV4 = () => {
  const [linesVisible, setLinesVisible] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setLinesVisible(true), 200);
    return () => clearTimeout(t);
  }, []);

  return (
    <section className="hst-hero hst-v4">
      <div className={`hst-v4__columns ${linesVisible ? 'visible' : ''}`}>
        <div className="hst-v4__col hst-v4__col--label">
          <span className="hst-v4__vert-label">Training</span>
        </div>
        <div className="hst-v4__col hst-v4__col--img">
          <img src={IMGS.hero} alt="" />
        </div>
        <div className="hst-v4__col hst-v4__col--center">
          <div className="hst-v4__center-content">
            <Coords />
            <span className="hst__pre">Welcome to</span>
            <Logo width="clamp(180px, 25vw, 350px)" />
            <p className="hst__desc">The Robinson Specialists since 2010</p>
            <div className="hst-v4__meta">
              <span>EST. 2010</span>
              <UnionJack size={12} />
              <span>LONDON</span>
            </div>
          </div>
        </div>
        <div className="hst-v4__col hst-v4__col--img">
          <img src={IMGS.expeditionQ} alt="" />
        </div>
        <div className="hst-v4__col hst-v4__col--label">
          <span className="hst-v4__vert-label">Sales</span>
        </div>
      </div>

      <div className="hst-v4__header">
        <Logo width="120px" />
        <span>Denham Aerodrome</span>
      </div>
    </section>
  );
};


// ============================================
// V5 - MONOCHROME EDITORIAL
// Inspired by hero-87. Pure B&W treatment.
// Grayscale expedition image. Bold sans-serif.
// Subtle 6-line grid at low opacity.
// Black footer bar with coordinates.
// ============================================
const HeroV5 = () => {
  const [linesVisible, setLinesVisible] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setLinesVisible(true), 200);
    return () => clearTimeout(t);
  }, []);

  return (
    <section className="hst-hero hst-v5">
      <GridLines layout="thirds" visible={linesVisible} className="hst__grid--faint" />

      <div className="hst-v5__layout">
        <div className="hst-v5__content">
          <div className="hst-v5__header">
            <Logo width="clamp(160px, 22vw, 300px)" />
          </div>
          <h1 className="hst-v5__title">
            Robinson<br />Helicopter<br />Specialists
          </h1>
          <p className="hst-v5__tagline">Training &middot; Sales &middot; Maintenance &middot; Expeditions</p>
        </div>
        <div className="hst-v5__image">
          <img src={IMGS.hero} alt="" />
        </div>
      </div>

      <div className="hst-v5__footer">
        <span>51.5751°N</span>
        <span>EST. 2010</span>
        <span>DENHAM AERODROME</span>
        <span>0.5059°W</span>
      </div>
    </section>
  );
};


// ============================================
// V6 - ASYMMETRIC OVERLAP
// Image at 60% width with scroll-driven image
// transitions. Text overlaps the boundary.
// At the last image both halves slide apart —
// left exits left, right exits right.
// ============================================
const V6_IMAGES = [
  IMGS.hero, IMGS.aerial, IMGS.expeditionQ, IMGS.cockpit,
  IMGS.antartica, IMGS.fleet, IMGS.hangar, IMGS.channel,
  IMGS.flying1, IMGS.flying2, IMGS.event1, IMGS.busyHangar,
];

const HeroV6 = () => {
  const [linesVisible, setLinesVisible] = useState(false);
  const heroRef = useRef(null);
  const { scrollYProgress } = useScroll({ target: heroRef, offset: ['start start', 'end end'] });

  // Images cycle through 0–0.75 of scroll, exit animation at 0.75–1.0
  const imgEnd = 0.75;
  const leftX = useTransform(scrollYProgress, [imgEnd, 1], ['0%', '-110%']);
  const rightX = useTransform(scrollYProgress, [imgEnd, 1], ['0%', '110%']);
  const splitOpacity = useTransform(scrollYProgress, [imgEnd, 0.95], [1, 0.3]);

  useEffect(() => {
    const t = setTimeout(() => setLinesVisible(true), 200);
    return () => clearTimeout(t);
  }, []);

  return (
    <section className="hst-hero hst-v6" ref={heroRef} style={{ height: `${V6_IMAGES.length * 50 + 150}vh` }}>
      <div className="hst-v6__sticky">
        <GridLines layout="leftHeavy" visible={linesVisible} />

        {/* Right — 60% image block with scroll-driven transitions */}
        <motion.div className="hst-v6__image-block" style={{ x: rightX, opacity: splitOpacity }}>
          {V6_IMAGES.map((src, i) => {
            const step = imgEnd / V6_IMAGES.length;
            const start = i * step;
            const end = start + step;
            return (
              <motion.div
                key={i}
                className="hst-v6__img-layer"
                style={{
                  opacity: useTransform(scrollYProgress,
                    [Math.max(0, start - step * 0.15), start, end - step * 0.15, end],
                    [0, 1, 1, 0]
                  ),
                  zIndex: V6_IMAGES.length - i,
                }}
              >
                <img src={src} alt="" />
              </motion.div>
            );
          })}
          <div className="hst-v6__image-overlay" />
          <div className="hst-v6__counter">
            {V6_IMAGES.map((_, i) => {
              const step = imgEnd / V6_IMAGES.length;
              const start = i * step;
              const end = start + step;
              return (
                <motion.div
                  key={i}
                  className="hst-v6__counter-pip"
                  style={{
                    opacity: useTransform(scrollYProgress, [start, start + step * 0.1, end - step * 0.1, end], [0.25, 1, 1, 0.25]),
                  }}
                />
              );
            })}
          </div>
        </motion.div>

        {/* Left — text overlapping into image area */}
        <motion.div className="hst-v6__text-block" style={{ x: leftX, opacity: splitOpacity }}>
          <Coords />
          <span className="hst__pre">Welcome to</span>
          <Logo width="clamp(180px, 25vw, 350px)" />
          <p className="hst__desc">The Robinson Specialists since 2010</p>
          <div className="hst-v6__cta">
            <Link to="/about-us" className="hst-v6__btn">Discover More <span>→</span></Link>
          </div>
        </motion.div>

        <motion.div className="hst-v6__corner" style={{ opacity: splitOpacity }}>
          <span>EST. 2010</span>
          <UnionJack size={14} />
          <span>LONDON</span>
        </motion.div>

        <ScrollPrompt />
      </div>
    </section>
  );
};


// ============================================
// V7 - ANIMATED ASSEMBLY
// Inspired by hero-81. Grid lines animate in,
// then text words reveal one by one, then
// image fades in, then stats appear.
// A choreographed loading sequence.
// ============================================
const HeroV7 = () => {
  const [phase, setPhase] = useState(0); // 0=grid, 1=text, 2=image, 3=stats

  useEffect(() => {
    const timers = [
      setTimeout(() => setPhase(1), 400),
      setTimeout(() => setPhase(2), 1200),
      setTimeout(() => setPhase(3), 2000),
    ];
    return () => timers.forEach(clearTimeout);
  }, []);

  return (
    <section className="hst-hero hst-v7">
      <GridLines layout="default" visible={phase >= 0} />

      <div className="hst-v7__layout">
        <div className="hst-v7__content">
          <div className={`hst-v7__eyebrow ${phase >= 1 ? 'visible' : ''}`}>
            <span className="hst-v7__pulse" />
            <span>Denham Aerodrome</span>
          </div>

          <Logo width="clamp(180px, 25vw, 350px)" />

          <motion.div
            className="hst-v7__stats"
            initial={{ opacity: 0 }}
            animate={phase >= 3 ? { opacity: 1 } : {}}
            transition={{ duration: 0.6 }}
          >
            <div className="hst-v7__stat">
              <strong>2010</strong><span>Established</span>
            </div>
            <div className="hst-v7__stat">
              <strong>30+</strong><span>Aircraft</span>
            </div>
            <div className="hst-v7__stat">
              <strong>5</strong><span>Continents</span>
            </div>
          </motion.div>
        </div>

        <motion.div
          className="hst-v7__image"
          initial={{ opacity: 0, scale: 1.05 }}
          animate={phase >= 2 ? { opacity: 1, scale: 1 } : {}}
          transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
        >
          <img src={IMGS.hero} alt="" />
        </motion.div>
      </div>

      <Coords className={phase >= 3 ? '' : 'hst__coords--hidden'} />
      <ScrollPrompt className={phase >= 3 ? '' : 'hst__scroll-prompt--hidden'} />
    </section>
  );
};


// ============================================
// V8 - STAGGERED IMAGE PANELS
// Multiple expedition images at different sizes
// arranged in an overlapping editorial layout.
// Text positioned in the negative space.
// Scroll causes subtle parallax between layers.
// ============================================
const V8_PANELS = [
  { src: IMGS.hero,         cls: '--1', speed: -60 },
  { src: IMGS.antartica,    cls: '--2', speed: -30 },
  { src: IMGS.expeditionQ,  cls: '--3', speed: -90 },
  { src: IMGS.cockpit,      cls: '--4', speed: -45 },
  { src: IMGS.flying1,      cls: '--5', speed: -75 },
  { src: IMGS.channel,      cls: '--6', speed: -20 },
  { src: IMGS.event1,       cls: '--7', speed: -55 },
  { src: IMGS.fleet,        cls: '--8', speed: -40 },
  { src: IMGS.hangar,       cls: '--9', speed: -85 },
];

const HeroV8 = () => {
  const [linesVisible, setLinesVisible] = useState(false);
  const heroRef = useRef(null);
  const { scrollYProgress } = useScroll({ target: heroRef, offset: ['start start', 'end start'] });

  useEffect(() => {
    const t = setTimeout(() => setLinesVisible(true), 200);
    return () => clearTimeout(t);
  }, []);

  return (
    <section className="hst-hero hst-v8" ref={heroRef} style={{ height: '160vh' }}>
      <div className="hst-v8__sticky">
        <GridLines layout="golden" visible={linesVisible} />

        <div className="hst-v8__panels">
          {V8_PANELS.map((p, i) => (
            <motion.div
              key={i}
              className={`hst-v8__panel hst-v8__panel${p.cls}`}
              style={{ y: useTransform(scrollYProgress, [0, 1], [0, p.speed]) }}
            >
              <img src={p.src} alt="" />
            </motion.div>
          ))}
        </div>

        <div className="hst-v8__text">
          <Coords />
          <span className="hst__pre">Welcome to</span>
          <Logo width="clamp(180px, 25vw, 350px)" />
          <p className="hst__desc">The Robinson Specialists since 2010</p>
          <div className="hst-v8__meta">
            <span>EST. 2010</span>
            <span className="hst-v8__dot" />
            <span>LONDON</span>
            <span className="hst-v8__dot" />
            <UnionJack size={12} />
          </div>
        </div>

        <ScrollPrompt />
      </div>
    </section>
  );
};


// ============================================
// V9 - CINEMATIC WIDE
// Dark treatment. Letterbox bars top/bottom.
// Single powerful expedition image.
// Info strip below letterbox.
// Filmstrip embedded in bottom letterbox.
// ============================================
const HeroV9 = () => {
  const [linesVisible, setLinesVisible] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setLinesVisible(true), 300);
    return () => clearTimeout(t);
  }, []);

  return (
    <section className="hst-hero hst-v9">
      <div className="hst-v9__bg">
        <img src={IMGS.hero} alt="" />
      </div>
      <div className="hst-v9__overlay" />

      <GridLines layout="minimal" visible={linesVisible} className="hst__grid--light hst__grid--subtle" />

      <div className="hst-v9__letterbox hst-v9__letterbox--top">
        <div className="hst-v9__top-info">
          <span>51.5751°N / 0.5059°W</span>
          <Logo width="120px" light />
          <span>DENHAM AERODROME</span>
        </div>
      </div>

      <div className="hst-v9__center">
        <Logo width="clamp(180px, 25vw, 350px)" light />
        <motion.div
          className="hst-v9__sub"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 1 }}
        >
          <span>EST. 2010</span>
          <span className="hst-v9__sep">—</span>
          <span>ROBINSON SPECIALISTS</span>
          <span className="hst-v9__sep">—</span>
          <span>LONDON <UnionJack size={12} /></span>
        </motion.div>
      </div>

      <div className="hst-v9__letterbox hst-v9__letterbox--bottom">
        <div className="hst-v9__filmstrip">
          {FILMSTRIP.slice(0, 10).map((src, i) => (
            <div key={i} className="hst-v9__thumb">
              <img src={src} alt="" />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};


// ============================================
// V10 - SCROLL SECTIONS WITH FULL BLEED
// Like V1 but full-bleed background images
// that crossfade as you scroll (instead of
// side panels). Text centered with text-shadow
// halo. Grid lines overlay the images.
// ============================================
const HeroV10 = () => {
  const [activeSection, setActiveSection] = useState(0);
  const [linesVisible, setLinesVisible] = useState(false);
  const heroRef = useRef(null);

  const backgrounds = [IMGS.hero, IMGS.antartica, IMGS.expeditionQ, IMGS.southPole];
  const sections = [
    { pre: 'Welcome to', headline: 'logo', desc: 'The Robinson Specialists since 2010' },
    { pre: 'Built on', headline: ['Precision', '&', 'Excellence'], desc: 'Three decades of uncompromising standards' },
    { pre: 'World-class', headline: ['Flight', 'Training'], desc: 'From first flight to commercial certification' },
    { pre: 'Beyond horizons', headline: ['Global', 'Expeditions'], desc: 'Adventure awaits at every altitude' },
  ];

  useEffect(() => {
    const t = setTimeout(() => setLinesVisible(true), 200);
    return () => clearTimeout(t);
  }, []);

  useEffect(() => {
    const onScroll = () => {
      const y = window.scrollY;
      const h = window.innerHeight * 4;
      const progress = Math.min(y / h, 1);
      setActiveSection(Math.min(Math.floor(progress * 4), 3));
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <section className="hst-hero hst-v10" ref={heroRef} style={{ height: 'calc(400vh + 250px)' }}>
      {backgrounds.map((src, i) => (
        <div key={i} className={`hst-v10__bg ${activeSection === i ? 'active' : ''}`}>
          <img src={src} alt="" />
        </div>
      ))}
      <div className="hst-v10__overlay" />

      <GridLines layout="default" visible={linesVisible} className="hst__grid--light" />

      <div className="hst-v10__content">
        {sections.map((s, i) => (
          <div key={i} className={`hst-v10__section ${activeSection === i ? 'active' : ''}`}>
            <Coords className="hst__coords--light" />
            <span className="hst__pre hst__pre--light">{s.pre}</span>
            {s.headline === 'logo'
              ? <Logo width="clamp(180px, 25vw, 350px)" light />
              : <h1 className="hst-v10__headline">
                  {s.headline.map((w, j) => (
                    <span key={j} className={`hst-v10__word hst-v10__word--${j + 1}`}>{w}</span>
                  ))}
                </h1>
            }
            <p className="hst__desc hst__desc--light">{s.desc}</p>
          </div>
        ))}
      </div>

      <div className="hst-v10__progress">
        {sections.map((_, i) => (
          <div key={i} className={`hst-v10__dot ${activeSection >= i ? 'active' : ''}`} />
        ))}
      </div>

      <ScrollPrompt className="hst__scroll-prompt--light" />
    </section>
  );
};


// ============================================
// V11 - FLOATING CARD + BLEED
// Full bleed dark image. A single floating card
// with frosted glass sits off-center left,
// holding the brand identity. Filmstrip peeks
// out from the right edge. Grid lines visible
// through the dark overlay.
// ============================================
const HeroV11 = () => {
  const [linesVisible, setLinesVisible] = useState(false);
  useEffect(() => { setTimeout(() => setLinesVisible(true), 300); }, []);

  return (
    <section className="hst-hero hst-v11">
      <div className="hst-v11__bg"><img src={IMGS.hero} alt="" /></div>
      <div className="hst-v11__overlay" />
      <GridLines layout="golden" visible={linesVisible} className="hst__grid--light hst__grid--subtle" />

      <motion.div
        className="hst-v11__card"
        initial={{ opacity: 0, x: -30 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 1, delay: 0.5, ease: [0.16, 1, 0.3, 1] }}
      >
        <Coords className="hst__coords--light" />
        <span className="hst__pre hst__pre--light">Welcome to</span>
        <Logo width="clamp(180px, 25vw, 350px)" light />
        <div className="hst-v11__rule" />
        <p className="hst__desc hst__desc--light">The Robinson Specialists</p>
        <div className="hst-v11__meta">
          <span>EST. 2010</span><span className="hst-v11__sep" /><span>LONDON</span>
          <span className="hst-v11__sep" /><UnionJack size={12} />
        </div>
      </motion.div>

      <div className="hst-v11__side-strip">
        {FILMSTRIP.slice(0, 5).map((src, i) => (
          <div key={i} className="hst-v11__side-thumb"><img src={src} alt="" /></div>
        ))}
      </div>
      <ScrollPrompt className="hst__scroll-prompt--light" />
    </section>
  );
};


// ============================================
// V12 - DIAGONAL SPLIT
// Diagonal division with scroll-driven image
// transitions. The diagonal wobbles, then exits
// left. Logo shrinks, bottom half fades, rises
// to top, centres as header logo. Final image
// unsticks and page flows normally.
// ============================================
const V12_IMAGES = [
  IMGS.hero, IMGS.aerial, IMGS.expeditionQ, IMGS.cockpit,
  IMGS.antartica, IMGS.fleet, IMGS.hangar, IMGS.channel,
  IMGS.flying1, IMGS.flying2, IMGS.event1, IMGS.busyHangar,
];

const HeroV12 = () => {
  const [linesVisible, setLinesVisible] = useState(false);
  const heroRef = useRef(null);
  const { scrollYProgress } = useScroll({ target: heroRef, offset: ['start start', 'end end'] });

  useEffect(() => { setTimeout(() => setLinesVisible(true), 200); }, []);

  // ── Phase 1 (0 → 0.45): images cycle, diagonal wobbles slightly ──
  const imgEnd = 0.45;
  const diagTop = useTransform(scrollYProgress,
    [0, 0.1, 0.2, 0.3, 0.4, imgEnd, 0.58],
    [55, 50, 57, 48, 54, 50, -15]
  );
  const diagBot = useTransform(scrollYProgress,
    [0, 0.1, 0.2, 0.3, 0.4, imgEnd, 0.58],
    [40, 35, 42, 33, 38, 35, -15]
  );

  // ── Phase 2 (0.45 → 0.6): text fades, logo shrinks + bottom half clips ──
  const contentTextOpacity = useTransform(scrollYProgress, [imgEnd, 0.52], [1, 0]);
  const gridOpacity = useTransform(scrollYProgress, [imgEnd, 0.55], [1, 0]);
  const pipsOpacity = useTransform(scrollYProgress, [imgEnd, 0.52], [1, 0]);
  const logoScale = useTransform(scrollYProgress, [imgEnd, 0.62], [1, 0.4]);
  const logoClip = useTransform(scrollYProgress, [imgEnd, 0.58], [0, 50]); // bottom % clipped

  // ── Phase 3 (0.6 → 0.8): logo moves from center to top-center ──
  // Use numeric % values so Framer Motion can interpolate them
  const logoTopPct = useTransform(scrollYProgress, [0.6, 0.72, 0.72, 0.82], [50, 5, 5, 5]);
  const logoLeftPct = useTransform(scrollYProgress, [0.6, 0.72, 0.72, 0.82], [6, 6, 6, 50]);
  // Offset: starts at -50% Y (centered), goes to 0 at top
  const logoOffsetY = useTransform(scrollYProgress, [0.6, 0.72], [-50, 0]);
  // Offset: starts at 0 X, goes to -50% to centre at 50% left
  const logoOffsetX = useTransform(scrollYProgress, [0.72, 0.82], [0, -50]);

  // ── Phase 4 (0.85 → 1.0): sticky releases, final image scrolls away ──
  // Handled naturally: once scrollYProgress reaches ~0.88 the sticky
  // container has consumed its scroll distance and the section ends,
  // releasing the viewport into normal flow.

  return (
    <section className="hst-hero hst-v12" ref={heroRef} style={{ height: '800vh' }}>
      <div className="hst-v12__sticky">

        {/* Full-screen image layers */}
        <div className="hst-v12__image-half">
          {V12_IMAGES.map((src, i) => {
            const step = imgEnd / V12_IMAGES.length;
            const start = i * step;
            const end = start + step;
            return (
              <motion.div
                key={i}
                className="hst-v12__img-layer"
                style={{
                  opacity: useTransform(scrollYProgress,
                    [Math.max(0, start - step * 0.15), start, end - step * 0.15, end],
                    i === V12_IMAGES.length - 1 ? [0, 1, 1, 1] : [0, 1, 1, 0]
                  ),
                  zIndex: V12_IMAGES.length - i,
                }}
              >
                <img src={src} alt="" />
              </motion.div>
            );
          })}
        </div>

        {/* Diagonal beige overlay — wobbles then exits left */}
        <motion.div
          className="hst-v12__beige"
          style={{
            clipPath: useTransform(
              [diagTop, diagBot],
              ([t, b]) => `polygon(0 0, ${t}% 0, ${b}% 100%, 0 100%)`
            ),
          }}
        />

        {/* Grid lines — fade with content */}
        <motion.div style={{ opacity: gridOpacity }}>
          <GridLines layout="default" visible={linesVisible} />
        </motion.div>

        {/* Supporting text — fades out during phase 2 */}
        <motion.div className="hst-v12__content" style={{ opacity: contentTextOpacity }}>
          <Coords />
          <span className="hst__pre">Welcome to</span>
          <div style={{ height: 'clamp(50px, 8vw, 90px)' }} /> {/* spacer for logo */}
          <p className="hst__desc">The Robinson Specialists since 2010</p>
          <div className="hst-v12__meta">
            <span>EST. 2010</span><span className="hst-v12__dot" /><span>LONDON</span>
            <span className="hst-v12__dot" /><UnionJack size={12} />
          </div>
        </motion.div>

        {/* Logo — independent element, animates freely across viewport */}
        <motion.div
          className="hst-v12__logo-wrap"
          style={{
            top: useTransform(logoTopPct, v => `${v}%`),
            left: useTransform(logoLeftPct, v => `${v}%`),
            x: useTransform(logoOffsetX, v => `${v}%`),
            y: useTransform(logoOffsetY, v => `${v}%`),
            scale: logoScale,
          }}
        >
          <motion.div style={{
            clipPath: useTransform(logoClip, v => `inset(0 0 ${v}% 0)`),
          }}>
            <Logo width="clamp(180px, 25vw, 350px)" />
          </motion.div>
        </motion.div>

        {/* Progress pips */}
        <motion.div className="hst-v12__pips" style={{ opacity: pipsOpacity }}>
          {V12_IMAGES.map((_, i) => {
            const step = imgEnd / V12_IMAGES.length;
            const start = i * step;
            const end = start + step;
            return (
              <motion.div
                key={i}
                className="hst-v12__pip"
                style={{
                  opacity: useTransform(scrollYProgress, [start, start + step * 0.1, end - step * 0.1, end],
                    i === V12_IMAGES.length - 1 ? [0.25, 1, 1, 1] : [0.25, 1, 1, 0.25]),
                }}
              />
            );
          })}
        </motion.div>

        <motion.div style={{ opacity: contentTextOpacity }}>
          <ScrollPrompt />
        </motion.div>
      </div>
    </section>
  );
};


// ============================================
// V13 - BENTO GRID
// Multiple cells in a bento-style grid.
// Hero image in the largest cell, text and
// metadata occupy adjacent cells. Filmstrip
// thumbnails fill small cells along the bottom.
// ============================================
const HeroV13 = () => {
  const [linesVisible, setLinesVisible] = useState(false);
  useEffect(() => { setTimeout(() => setLinesVisible(true), 200); }, []);

  return (
    <section className="hst-hero hst-v13">
      <div className={`hst-v13__grid ${linesVisible ? 'visible' : ''}`}>
        <div className="hst-v13__cell hst-v13__cell--hero">
          <img src={IMGS.hero} alt="" />
          <div className="hst-v13__hero-overlay" />
        </div>
        <div className="hst-v13__cell hst-v13__cell--title">
          <Coords />
          <span className="hst__pre">Welcome to</span>
          <Logo width="clamp(200px, 28vw, 380px)" />
        </div>
        <div className="hst-v13__cell hst-v13__cell--desc">
          <p className="hst__desc">The Robinson Specialists since 2010</p>
          <div className="hst-v13__meta">
            <span>EST. 2010</span><span>&middot;</span><span>LONDON</span>
            <span>&middot;</span><UnionJack size={12} />
          </div>
        </div>
        <div className="hst-v13__cell hst-v13__cell--img2">
          <img src={IMGS.antartica} alt="" />
        </div>
        {FILMSTRIP.slice(0, 4).map((src, i) => (
          <div key={i} className="hst-v13__cell hst-v13__cell--thumb">
            <img src={src} alt="" />
          </div>
        ))}
      </div>
    </section>
  );
};


// ============================================
// V14 - REVEAL ON SCROLL
// Starts with just text on beige. As user
// scrolls, the image is revealed behind via
// a clip-path expanding circle. Grid lines
// transition from dark to light.
// ============================================
const HeroV14 = () => {
  const [linesVisible, setLinesVisible] = useState(false);
  const heroRef = useRef(null);
  const { scrollYProgress } = useScroll({ target: heroRef, offset: ['start start', 'end start'] });
  const clipRadius = useTransform(scrollYProgress, [0, 0.25], [0, 120]);
  const textOpacity = useTransform(scrollYProgress, [0, 0.15], [1, 0]);
  const overlayOpacity = useTransform(scrollYProgress, [0.15, 0.25], [0.6, 0]);

  useEffect(() => { setTimeout(() => setLinesVisible(true), 200); }, []);

  return (
    <section className="hst-hero hst-v14" ref={heroRef} style={{ height: '250vh' }}>
      <div className="hst-v14__sticky">
        <div className="hst-v14__bg">
          <motion.div
            className="hst-v14__bg-inner"
            style={{ clipPath: useTransform(clipRadius, r => `circle(${r}% at 50% 50%)`) }}
          >
            <img src={IMGS.hero} alt="" />
          </motion.div>
        </div>
        <motion.div className="hst-v14__overlay" style={{ opacity: overlayOpacity }} />

        <GridLines layout="default" visible={linesVisible} className="hst__grid--light hst__grid--subtle" />

        <motion.div className="hst-v14__content" style={{ opacity: textOpacity }}>
          <Coords className="hst__coords--light" />
          <span className="hst__pre hst__pre--light">Welcome to</span>
          <Logo width="clamp(180px, 25vw, 350px)" light />
          <p className="hst__desc hst__desc--light">The Robinson Specialists since 2010</p>
        </motion.div>

        <ScrollPrompt className="hst__scroll-prompt--light" />
      </div>
    </section>
  );
};


// ============================================
// V15 - HORIZONTAL MARQUEE
// Full bleed image with a continuously scrolling
// marquee of the brand name across the center.
// Creates a sense of movement. Coordinates and
// meta anchored to corners.
// ============================================
const HeroV15 = () => {
  const [linesVisible, setLinesVisible] = useState(false);
  useEffect(() => { setTimeout(() => setLinesVisible(true), 300); }, []);

  const marqueeText = 'HQ AVIATION — THE ROBINSON SPECIALISTS — EST. 2010 — LONDON — DENHAM AERODROME — ';

  return (
    <section className="hst-hero hst-v15">
      <div className="hst-v15__bg"><img src={IMGS.hero} alt="" /></div>
      <div className="hst-v15__overlay" />
      <GridLines layout="minimal" visible={linesVisible} className="hst__grid--light hst__grid--subtle" />

      <div className="hst-v15__marquee-wrap">
        <div className="hst-v15__marquee">
          <span>{marqueeText}{marqueeText}{marqueeText}</span>
        </div>
      </div>

      <div className="hst-v15__corner hst-v15__corner--tl">
        <Coords className="hst__coords--light" />
      </div>
      <div className="hst-v15__corner hst-v15__corner--br">
        <span className="hst-v15__flag"><UnionJack size={16} /></span>
      </div>

      <ScrollPrompt className="hst__scroll-prompt--light" />
    </section>
  );
};


// ============================================
// V16 - LAYERED DEPTH
// Three layers of content at different z-depths.
// Background image → mid-ground text with blur →
// foreground stats/CTA. Creates depth with
// parallax on scroll.
// ============================================
const HeroV16 = () => {
  const heroRef = useRef(null);
  const { scrollYProgress } = useScroll({ target: heroRef, offset: ['start start', 'end start'] });
  const bgScale = useTransform(scrollYProgress, [0, 1], [1, 1.15]);
  const midY = useTransform(scrollYProgress, [0, 1], [0, -50]);
  const fgY = useTransform(scrollYProgress, [0, 1], [0, -100]);
  const [linesVisible, setLinesVisible] = useState(false);
  useEffect(() => { setTimeout(() => setLinesVisible(true), 200); }, []);

  return (
    <section className="hst-hero hst-v16" ref={heroRef} style={{ height: '180vh' }}>
      <div className="hst-v16__sticky">
        <motion.div className="hst-v16__bg" style={{ scale: bgScale }}>
          <img src={IMGS.hero} alt="" />
        </motion.div>
        <div className="hst-v16__overlay" />
        <GridLines layout="golden" visible={linesVisible} className="hst__grid--light hst__grid--subtle" />

        <motion.div className="hst-v16__mid" style={{ y: midY }}>
          <Logo width="clamp(180px, 25vw, 350px)" />
        </motion.div>

        <motion.div className="hst-v16__fg" style={{ y: fgY }}>
          <Coords className="hst__coords--light" />
          <div className="hst-v16__stats">
            <div><strong>2010</strong><span>Established</span></div>
            <div><strong>30+</strong><span>Fleet Size</span></div>
            <div><strong>5</strong><span>Continents</span></div>
          </div>
          <div className="hst-v16__meta">
            <span>ROBINSON SPECIALISTS</span><span>&middot;</span>
            <span>LONDON</span><span>&middot;</span><UnionJack size={12} />
          </div>
        </motion.div>

        <ScrollPrompt className="hst__scroll-prompt--light" />
      </div>
    </section>
  );
};


// ============================================
// V17 - WINDOW PANE
// Image visible through a "window" cut out of
// a solid beige surface. The window is defined
// by the grid intersection. Text sits above
// the window, meta below.
// ============================================
const HeroV17 = () => {
  const [linesVisible, setLinesVisible] = useState(false);
  useEffect(() => { setTimeout(() => setLinesVisible(true), 200); }, []);

  return (
    <section className="hst-hero hst-v17">
      <div className="hst-v17__image-layer"><img src={IMGS.hero} alt="" /></div>
      <div className="hst-v17__mask" />
      <GridLines layout="default" visible={linesVisible} />

      <div className="hst-v17__top-text">
        <Coords />
        <span className="hst__pre">Welcome to</span>
        <Logo width="clamp(180px, 25vw, 350px)" />
      </div>

      <div className="hst-v17__bottom-text">
        <p className="hst__desc">The Robinson Specialists</p>
        <div className="hst-v17__meta">
          <span>EST. 2010</span><span className="hst-v17__dot" /><span>LONDON</span>
          <span className="hst-v17__dot" /><UnionJack size={12} />
        </div>
      </div>
      <ScrollPrompt />
    </section>
  );
};


// ============================================
// V18 - SPLIT DARK/LIGHT
// Left half dark with light text, right half
// light with dark text. Image bleeds across
// both halves at an offset. Creates tension
// between the two brand tones.
// ============================================
const HeroV18 = () => {
  const [linesVisible, setLinesVisible] = useState(false);
  useEffect(() => { setTimeout(() => setLinesVisible(true), 200); }, []);

  return (
    <section className="hst-hero hst-v18">
      <div className="hst-v18__left">
        <div className="hst-v18__left-content">
          <Logo width="clamp(150px, 20vw, 280px)" light />
          <Coords className="hst__coords--light" />
        </div>
      </div>
      <div className="hst-v18__right">
        <div className="hst-v18__right-content">
          <Logo width="clamp(150px, 20vw, 280px)" />
          <p className="hst__desc">The Robinson Specialists since 2010</p>
        </div>
      </div>
      <div className="hst-v18__image-strip">
        <img src={IMGS.hero} alt="" />
      </div>
      <GridLines layout="minimal" visible={linesVisible} className="hst-v18__grid-mix" />

      <div className="hst-v18__footer">
        <span>EST. 2010</span><span>&middot;</span><span>LONDON <UnionJack size={12} /></span>
        <span>&middot;</span><span>DENHAM AERODROME</span>
      </div>
    </section>
  );
};


// ============================================
// V19 - TIMELINE HERO
// Horizontal timeline at the center with key
// dates. Background image. Each milestone
// is a small marker. Brand name above, tagline
// below the timeline.
// ============================================
const HeroV19 = () => {
  const [linesVisible, setLinesVisible] = useState(false);
  useEffect(() => { setTimeout(() => setLinesVisible(true), 300); }, []);

  const milestones = [
    { year: '2010', label: 'Founded' },
    { year: '2014', label: 'Service Centre' },
    { year: '2017', label: 'North Pole' },
    { year: '2019', label: 'South Pole' },
    { year: '2024', label: '30+ Fleet' },
  ];

  return (
    <section className="hst-hero hst-v19">
      <div className="hst-v19__bg"><img src={IMGS.hero} alt="" /></div>
      <div className="hst-v19__overlay" />
      <GridLines layout="minimal" visible={linesVisible} className="hst__grid--light hst__grid--subtle" />

      <div className="hst-v19__top">
        <Logo width="clamp(180px, 25vw, 350px)" light />
      </div>

      <div className="hst-v19__timeline">
        <div className="hst-v19__timeline-line" />
        {milestones.map((m, i) => (
          <motion.div
            key={i}
            className="hst-v19__milestone"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.5 + i * 0.15, ease: [0.16, 1, 0.3, 1] }}
          >
            <span className="hst-v19__milestone-dot" />
            <span className="hst-v19__milestone-year">{m.year}</span>
            <span className="hst-v19__milestone-label">{m.label}</span>
          </motion.div>
        ))}
      </div>

      <div className="hst-v19__bottom">
        <span>ROBINSON SPECIALISTS</span>
        <span>&middot;</span>
        <span>LONDON <UnionJack size={12} /></span>
        <span>&middot;</span>
        <span>DENHAM AERODROME</span>
      </div>
      <ScrollPrompt className="hst__scroll-prompt--light" />
    </section>
  );
};


// ============================================
// V20 - CROP & REVEAL
// Only a cropped slice of the image is visible
// initially through horizontal bands. The text
// reads between the bands. Creates a layered,
// peekaboo effect with architectural rhythm.
// ============================================
const HeroV20 = () => {
  const [linesVisible, setLinesVisible] = useState(false);
  useEffect(() => { setTimeout(() => setLinesVisible(true), 200); }, []);

  return (
    <section className="hst-hero hst-v20">
      <div className="hst-v20__image-layer"><img src={IMGS.hero} alt="" /></div>

      <div className="hst-v20__bands">
        <div className="hst-v20__band hst-v20__band--solid" />
        <div className="hst-v20__band hst-v20__band--open" />
        <div className="hst-v20__band hst-v20__band--solid hst-v20__band--text">
          <div className="hst-v20__text-row">
            <Coords />
            <span className="hst__pre">Welcome to</span>
          </div>
        </div>
        <div className="hst-v20__band hst-v20__band--open" />
        <div className="hst-v20__band hst-v20__band--solid hst-v20__band--text">
          <Logo width="clamp(180px, 25vw, 350px)" />
        </div>
        <div className="hst-v20__band hst-v20__band--open" />
        <div className="hst-v20__band hst-v20__band--solid hst-v20__band--text">
          <div className="hst-v20__text-row">
            <p className="hst__desc">The Robinson Specialists</p>
            <div className="hst-v20__meta">
              <span>EST. 2010</span><span>&middot;</span>
              <span>LONDON <UnionJack size={12} /></span>
            </div>
          </div>
        </div>
        <div className="hst-v20__band hst-v20__band--open" />
      </div>

      <GridLines layout="default" visible={linesVisible} className="hst-v20__grid-over" />
      <ScrollPrompt />
    </section>
  );
};


// ============================================
// V21 - TEXT KNOCKOUT
// Giant "HQ" text acts as a mask, revealing the
// image through the letterforms. Clean, bold,
// typographic-first approach.
// ============================================
const HeroV21 = () => {
  const [linesVisible, setLinesVisible] = useState(false);
  useEffect(() => { setTimeout(() => setLinesVisible(true), 200); }, []);

  return (
    <section className="hst-hero hst-v21">
      <div className="hst-v21__bg"><img src={IMGS.hero} alt="" /></div>
      <div className="hst-v21__mask">
        <div className="hst-v21__mask-top" />
        <div className="hst-v21__mask-mid">
          <div className="hst-v21__mask-side" />
          <Logo width="clamp(300px, 45vw, 600px)" />
          <div className="hst-v21__mask-side" />
        </div>
        <div className="hst-v21__mask-bottom">
          <span className="hst-v21__sub">AVIATION</span>
          <div className="hst-v21__meta-row">
            <span>EST. 2010</span>
            <span className="hst-v21__sep" />
            <span>LONDON</span>
            <UnionJack size={12} />
            <span className="hst-v21__sep" />
            <span>THE ROBINSON SPECIALISTS</span>
          </div>
        </div>
      </div>
      <GridLines layout="minimal" visible={linesVisible} className="hst__grid--light" />
      <ScrollPrompt className="hst__scroll-prompt--light" />
    </section>
  );
};


// ============================================
// V22 - POLAROID SCATTER
// Scattered polaroid-style photos that stagger
// in with rotation, overlapping casually.
// Brand info centered over the arrangement.
// ============================================
const HeroV22 = () => {
  const [loaded, setLoaded] = useState(false);
  useEffect(() => { setTimeout(() => setLoaded(true), 100); }, []);

  const photos = [
    { src: IMGS.hero, x: '8%', y: '10%', rot: -8, w: '28%' },
    { src: IMGS.antartica, x: '55%', y: '5%', rot: 5, w: '22%' },
    { src: IMGS.cockpit, x: '65%', y: '45%', rot: -3, w: '26%' },
    { src: IMGS.northPole, x: '5%', y: '50%', rot: 6, w: '24%' },
    { src: IMGS.fleet, x: '35%', y: '55%', rot: -5, w: '20%' },
  ];

  return (
    <section className="hst-hero hst-v22">
      <div className="hst-v22__photos">
        {photos.map((p, i) => (
          <motion.div
            key={i}
            className="hst-v22__polaroid"
            initial={{ opacity: 0, scale: 0.8, rotate: p.rot - 10 }}
            animate={loaded ? { opacity: 1, scale: 1, rotate: p.rot } : {}}
            transition={{ duration: 0.6, delay: i * 0.12, ease: [0.16, 1, 0.3, 1] }}
            style={{ left: p.x, top: p.y, width: p.w }}
          >
            <img src={p.src} alt="" />
            <div className="hst-v22__polaroid-label" />
          </motion.div>
        ))}
      </div>

      <div className="hst-v22__center">
        <Coords />
        <span className="hst__pre">Welcome to</span>
        <Logo width="clamp(180px, 25vw, 350px)" />
        <p className="hst__desc">The Robinson Specialists since 2010</p>
      </div>
      <ScrollPrompt />
    </section>
  );
};


// ============================================
// V23 - VERTICAL SPLIT SCROLL
// Left half scrolls up, right scrolls down
// (simulated via transforms). Text in the
// center seam where the halves meet.
// ============================================
const HeroV23 = () => {
  const heroRef = useRef(null);
  const { scrollYProgress } = useScroll({ target: heroRef, offset: ['start start', 'end start'] });
  const leftY = useTransform(scrollYProgress, [0, 1], ['0%', '-15%']);
  const rightY = useTransform(scrollYProgress, [0, 1], ['0%', '15%']);
  const textOpacity = useTransform(scrollYProgress, [0, 0.3], [1, 0]);
  const [linesVisible, setLinesVisible] = useState(false);
  useEffect(() => { setTimeout(() => setLinesVisible(true), 200); }, []);

  return (
    <section className="hst-hero hst-v23" ref={heroRef} style={{ height: '200vh' }}>
      <div className="hst-v23__sticky">
        <motion.div className="hst-v23__left" style={{ y: leftY }}>
          <img src={IMGS.hero} alt="" />
          <div className="hst-v23__left-overlay" />
        </motion.div>
        <motion.div className="hst-v23__right" style={{ y: rightY }}>
          <img src={IMGS.antartica} alt="" />
          <div className="hst-v23__right-overlay" />
        </motion.div>

        <motion.div className="hst-v23__center" style={{ opacity: textOpacity }}>
          <Coords className="hst__coords--light" />
          <span className="hst__pre hst__pre--light">Welcome to</span>
          <Logo width="clamp(200px, 30vw, 400px)" light />
          <div className="hst-v23__meta">
            <span>EST. 2010</span>
            <span className="hst-v23__sep" />
            <span>LONDON <UnionJack size={12} /></span>
          </div>
        </motion.div>

        <GridLines layout="minimal" visible={linesVisible} className="hst__grid--light" />
        <ScrollPrompt className="hst__scroll-prompt--light" />
      </div>
    </section>
  );
};


// ============================================
// V24 - CIRCULAR FRAME
// Large circular mask reveals image. Brand text
// wraps around the circle. Minimal, modern.
// ============================================
const HeroV24 = () => {
  const [linesVisible, setLinesVisible] = useState(false);
  const [circleReady, setCircleReady] = useState(false);
  useEffect(() => {
    setTimeout(() => setLinesVisible(true), 100);
    setTimeout(() => setCircleReady(true), 300);
  }, []);

  return (
    <section className="hst-hero hst-v24">
      <GridLines layout="minimal" visible={linesVisible} />

      <div className={`hst-v24__circle ${circleReady ? 'active' : ''}`}>
        <img src={IMGS.hero} alt="" />
      </div>

      <div className="hst-v24__text-top">
        <Coords />
        <span className="hst__pre">Welcome to</span>
      </div>

      <div className="hst-v24__text-left">
        <Logo width="clamp(150px, 18vw, 250px)" />
      </div>

      <div className="hst-v24__text-right">
      </div>

      <div className="hst-v24__bottom">
        <span>EST. 2010</span>
        <span className="hst-v24__sep" />
        <span>LONDON <UnionJack size={12} /></span>
        <span className="hst-v24__sep" />
        <span>THE ROBINSON SPECIALISTS</span>
      </div>

      <ScrollPrompt />
    </section>
  );
};


// ============================================
// V25 - MAGAZINE COVER
// Styled like a high-end magazine cover:
// masthead, cover image, headline, cover lines
// ============================================
const HeroV25 = () => {
  const [linesVisible, setLinesVisible] = useState(false);
  useEffect(() => { setTimeout(() => setLinesVisible(true), 200); }, []);

  return (
    <section className="hst-hero hst-v25">
      <div className="hst-v25__cover-image"><img src={IMGS.hero} alt="" /></div>
      <div className="hst-v25__overlay" />

      <div className="hst-v25__masthead">
        <div className="hst-v25__issue">
          <span>Issue No. 01</span>
          <span className="hst-v25__sep" />
          <span>EST. 2010</span>
        </div>
        <Logo width="clamp(200px, 30vw, 400px)" light />
        <div className="hst-v25__tagline">The Robinson Specialists · London</div>
      </div>

      <div className="hst-v25__cover-lines">
        <div className="hst-v25__cover-line">
          <span className="hst-v25__cl-label">Training</span>
          <span className="hst-v25__cl-text">From Discovery to Commercial</span>
        </div>
        <div className="hst-v25__cover-line">
          <span className="hst-v25__cl-label">Expeditions</span>
          <span className="hst-v25__cl-text">North Pole · South Pole · Channel</span>
        </div>
        <div className="hst-v25__cover-line">
          <span className="hst-v25__cl-label">Fleet</span>
          <span className="hst-v25__cl-text">30+ Helicopters, All Robinson</span>
        </div>
      </div>

      <div className="hst-v25__barcode">
        <div className="hst-v25__barcode-lines">
          {Array.from({ length: 20 }, (_, i) => (
            <div key={i} style={{ width: i % 3 === 0 ? 2 : 1, height: 30, background: 'rgba(255,255,255,0.5)' }} />
          ))}
        </div>
        <Coords className="hst__coords--light" />
      </div>

      <GridLines layout="minimal" visible={linesVisible} className="hst__grid--light" />
    </section>
  );
};


// ============================================
// V26 - GRID REVEAL
// 4x4 grid cells that animate in one by one,
// progressively revealing the image underneath.
// Text overlaid in the center after reveal.
// ============================================
const HeroV26 = () => {
  const [revealed, setRevealed] = useState([]);
  const [textVisible, setTextVisible] = useState(false);

  useEffect(() => {
    const order = [0,5,10,15, 1,6,11, 2,7,12, 3,8,13, 4,9,14, 16,17,18,19];
    order.forEach((idx, i) => {
      setTimeout(() => setRevealed(prev => [...prev, idx]), i * 80);
    });
    setTimeout(() => setTextVisible(true), order.length * 80 + 200);
  }, []);

  return (
    <section className="hst-hero hst-v26">
      <div className="hst-v26__image"><img src={IMGS.hero} alt="" /></div>
      <div className="hst-v26__grid-cells">
        {Array.from({ length: 20 }, (_, i) => (
          <div key={i} className={`hst-v26__cell ${revealed.includes(i) ? 'revealed' : ''}`} />
        ))}
      </div>
      <div className="hst-v26__overlay" />

      <div className={`hst-v26__content ${textVisible ? 'active' : ''}`}>
        <Coords className="hst__coords--light" />
        <span className="hst__pre hst__pre--light">Welcome to</span>
        <Logo width="clamp(200px, 28vw, 380px)" light />
        <div className="hst-v26__meta">
          <span>EST. 2010</span>
          <span className="hst-v26__sep" />
          <span>LONDON <UnionJack size={12} /></span>
        </div>
      </div>
      <ScrollPrompt className="hst__scroll-prompt--light" />
    </section>
  );
};


// ============================================
// V27 - PANORAMIC HORIZONTAL
// Oversized image with horizontal parallax.
// Content pinned in viewport center while
// the image scrolls horizontally behind.
// ============================================
const HeroV27 = () => {
  const heroRef = useRef(null);
  const { scrollYProgress } = useScroll({ target: heroRef, offset: ['start start', 'end start'] });
  const imageX = useTransform(scrollYProgress, [0, 1], ['0%', '-30%']);
  const textOpacity = useTransform(scrollYProgress, [0, 0.4], [1, 0]);
  const [linesVisible, setLinesVisible] = useState(false);
  useEffect(() => { setTimeout(() => setLinesVisible(true), 200); }, []);

  return (
    <section className="hst-hero hst-v27" ref={heroRef} style={{ height: '200vh' }}>
      <div className="hst-v27__sticky">
        <motion.div className="hst-v27__panoramic" style={{ x: imageX }}>
          <img src={IMGS.hero} alt="" />
        </motion.div>
        <div className="hst-v27__gradient" />

        <motion.div className="hst-v27__content" style={{ opacity: textOpacity }}>
          <Coords className="hst__coords--light" />
          <span className="hst__pre hst__pre--light">Welcome to</span>
          <Logo width="clamp(200px, 28vw, 380px)" light />
          <p className="hst-v27__desc">The Robinson Specialists since 2010</p>
          <div className="hst-v27__meta">
            <span>EST. 2010</span>
            <span className="hst-v27__sep" />
            <span>LONDON <UnionJack size={12} /></span>
          </div>
        </motion.div>

        <GridLines layout="minimal" visible={linesVisible} className="hst__grid--light" />
        <ScrollPrompt className="hst__scroll-prompt--light" />
      </div>
    </section>
  );
};


// ============================================
// V28 - LAYERED PAPER
// Stacked paper-like layers with subtle shadows
// and offsets. Each layer holds different content.
// Creates depth through literal layering.
// ============================================
const HeroV28 = () => {
  const [linesVisible, setLinesVisible] = useState(false);
  useEffect(() => { setTimeout(() => setLinesVisible(true), 200); }, []);

  return (
    <section className="hst-hero hst-v28">
      <GridLines layout="default" visible={linesVisible} />

      <div className="hst-v28__stack">
        {/* Back layer - image */}
        <div className="hst-v28__layer hst-v28__layer--back">
          <img src={IMGS.hero} alt="" />
        </div>
        {/* Mid layer - info */}
        <div className="hst-v28__layer hst-v28__layer--mid">
          <div className="hst-v28__mid-content">
            <div className="hst-v28__stats">
              <div className="hst-v28__stat"><span className="hst-v28__stat-num">30+</span><span>Helicopters</span></div>
              <div className="hst-v28__stat"><span className="hst-v28__stat-num">15+</span><span>Years</span></div>
              <div className="hst-v28__stat"><span className="hst-v28__stat-num">6</span><span>Continents</span></div>
            </div>
          </div>
        </div>
        {/* Front layer - headline */}
        <div className="hst-v28__layer hst-v28__layer--front">
          <Coords />
          <span className="hst__pre">Welcome to</span>
          <Logo width="clamp(180px, 25vw, 350px)" />
          <p className="hst__desc">The Robinson Specialists since 2010</p>
          <div className="hst-v28__meta">
            <span>EST. 2010</span>
            <span className="hst-v28__sep" />
            <span>LONDON <UnionJack size={12} /></span>
          </div>
        </div>
      </div>

      <ScrollPrompt />
    </section>
  );
};


// ============================================
// V29 - MINIMAL TYPE HERO
// Almost no image. Pure typographic hero with
// massive headline, subtle gradient, and a tiny
// image detail in the corner or inline.
// ============================================
const HeroV29 = () => {
  const [linesVisible, setLinesVisible] = useState(false);
  useEffect(() => { setTimeout(() => setLinesVisible(true), 200); }, []);

  return (
    <section className="hst-hero hst-v29">
      <GridLines layout="leftHeavy" visible={linesVisible} />

      <div className="hst-v29__content">
        <div className="hst-v29__top">
          <Coords />
          <span className="hst__pre">Welcome to</span>
        </div>

        <Logo width="clamp(300px, 50vw, 600px)" />

        <div className="hst-v29__bottom">
          <p className="hst-v29__desc">The Robinson Specialists</p>
          <div className="hst-v29__meta">
            <span>EST. 2010</span>
            <span className="hst-v29__sep" />
            <span>LONDON <UnionJack size={12} /></span>
          </div>
        </div>
      </div>

      <ScrollPrompt />
    </section>
  );
};


// ============================================
// V30 - FILM GRAIN / VINTAGE
// Dark, moody treatment with film grain overlay,
// serif headline, muted color, old-cinema vibe.
// ============================================
const HeroV30 = () => {
  const [linesVisible, setLinesVisible] = useState(false);
  useEffect(() => { setTimeout(() => setLinesVisible(true), 200); }, []);

  return (
    <section className="hst-hero hst-v30">
      <div className="hst-v30__image"><img src={IMGS.hero} alt="" /></div>
      <div className="hst-v30__grain" />
      <div className="hst-v30__vignette" />
      <div className="hst-v30__overlay" />

      <div className="hst-v30__frame">
        <div className="hst-v30__frame-corner hst-v30__frame-corner--tl" />
        <div className="hst-v30__frame-corner hst-v30__frame-corner--tr" />
        <div className="hst-v30__frame-corner hst-v30__frame-corner--bl" />
        <div className="hst-v30__frame-corner hst-v30__frame-corner--br" />
      </div>

      <div className="hst-v30__content">
        <div className="hst-v30__est">EST. 2010</div>
        <Logo width="clamp(200px, 28vw, 380px)" light />
        <div className="hst-v30__divider" />
        <p className="hst-v30__sub">The Robinson Specialists</p>
        <div className="hst-v30__location">
          <span>LONDON, ENGLAND</span>
          <UnionJack size={14} />
        </div>
      </div>

      <div className="hst-v30__bottom-bar">
        <Coords className="hst__coords--light" />
        <span className="hst-v30__film-code">35MM · KODAK 5219 · 500T</span>
      </div>

      <GridLines layout="minimal" visible={linesVisible} className="hst__grid--light" />
    </section>
  );
};


// ============================================
// V31 - GALLERY WALL
// Luxury private club photo wall. Multiple images
// in varied sizes on a dark surface, with subtle
// gold accents. Brand identity as an elegant overlay.
// ============================================
const HeroV31 = () => {
  const [loaded, setLoaded] = useState(false);
  useEffect(() => { setTimeout(() => setLoaded(true), 100); }, []);

  const wallImages = [
    { src: IMGS.northPole, x: 3, y: 5, w: 22, h: 28, delay: 0 },
    { src: IMGS.expeditionQ, x: 28, y: 3, w: 18, h: 22, delay: 0.1 },
    { src: IMGS.event1, x: 49, y: 5, w: 15, h: 20, delay: 0.15 },
    { src: IMGS.flying1, x: 67, y: 2, w: 30, h: 35, delay: 0.05 },
    { src: IMGS.antartica, x: 5, y: 38, w: 20, h: 25, delay: 0.2 },
    { src: IMGS.social1, x: 28, y: 30, w: 16, h: 18, delay: 0.25 },
    { src: IMGS.cockpit, x: 47, y: 28, w: 22, h: 28, delay: 0.12 },
    { src: IMGS.event3, x: 72, y: 40, w: 25, h: 22, delay: 0.18 },
    { src: IMGS.southPole, x: 2, y: 68, w: 25, h: 28, delay: 0.22 },
    { src: IMGS.channel, x: 30, y: 55, w: 18, h: 24, delay: 0.08 },
    { src: IMGS.event5, x: 51, y: 60, w: 20, h: 26, delay: 0.28 },
    { src: IMGS.hq0391, x: 74, y: 66, w: 23, h: 30, delay: 0.14 },
  ];

  return (
    <section className="hst-hero hst-v31">
      <div className="hst-v31__wall">
        {wallImages.map((img, i) => (
          <motion.div
            key={i}
            className="hst-v31__frame"
            style={{ left: `${img.x}%`, top: `${img.y}%`, width: `${img.w}%`, height: `${img.h}%` }}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={loaded ? { opacity: 1, scale: 1 } : {}}
            transition={{ duration: 0.8, delay: img.delay, ease: [0.16, 1, 0.3, 1] }}
          >
            <img src={img.src} alt="" />
          </motion.div>
        ))}
      </div>

      <div className="hst-v31__brand">
        <div className="hst-v31__badge">Members Club</div>
        <Logo width="clamp(180px, 25vw, 350px)" light />
        <div className="hst-v31__divider" />
        <div className="hst-v31__meta">
          <span>EST. 2010</span>
          <span>·</span>
          <span>LONDON</span>
          <UnionJack size={12} />
        </div>
      </div>

      <ScrollPrompt className="hst__scroll-prompt--light" />
    </section>
  );
};


// ============================================
// V32 - LIVING MOSAIC
// Dense auto-shuffling mosaic grid of adventure
// images. Tiles fade in/out with new images.
// Brand text floats elegantly over the mosaic.
// ============================================
const HeroV32 = () => {
  const [linesVisible, setLinesVisible] = useState(false);
  const [tiles, setTiles] = useState(() => GALLERY.slice(0, 20));
  const intervalRef = useRef(null);

  useEffect(() => {
    setTimeout(() => setLinesVisible(true), 200);
    intervalRef.current = setInterval(() => {
      setTiles(prev => {
        const next = [...prev];
        const swapIdx = Math.floor(Math.random() * next.length);
        const pool = GALLERY.filter(g => !next.includes(g));
        if (pool.length > 0) next[swapIdx] = pool[Math.floor(Math.random() * pool.length)];
        return next;
      });
    }, 2000);
    return () => clearInterval(intervalRef.current);
  }, []);

  return (
    <section className="hst-hero hst-v32">
      <div className="hst-v32__mosaic">
        {tiles.map((src, i) => (
          <div key={i} className="hst-v32__tile">
            <AnimatePresence mode="wait">
              <motion.img
                key={src}
                src={src}
                alt=""
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.8 }}
              />
            </AnimatePresence>
          </div>
        ))}
      </div>
      <div className="hst-v32__overlay" />

      <div className="hst-v32__content">
        <div className="hst-v32__badge">Private Members Club</div>
        <Logo width="clamp(200px, 30vw, 400px)" light />
        <div className="hst-v32__sub">The Adventure Starts Here</div>
        <div className="hst-v32__meta">
          <span>EST. 2010</span>
          <span className="hst-v32__sep" />
          <span>LONDON <UnionJack size={12} /></span>
          <span className="hst-v32__sep" />
          <span>BY INVITATION</span>
        </div>
      </div>

      <GridLines layout="minimal" visible={linesVisible} className="hst__grid--light" />
      <ScrollPrompt className="hst__scroll-prompt--light" />
    </section>
  );
};


// ============================================
// V33 - HORIZONTAL EXHIBITION
// Premium horizontal-scroll gallery like walking
// through a private photography exhibition.
// Each image is large, separated by dark space.
// ============================================
const HeroV33 = () => {
  const scrollRef = useRef(null);
  const containerRef = useRef(null);
  const { scrollYProgress } = useScroll({ target: containerRef, offset: ['start start', 'end end'] });
  const x = useTransform(scrollYProgress, [0, 1], ['0%', '-75%']);

  const exhibitionImages = [
    { src: IMGS.northPole, caption: 'North Pole Expedition' },
    { src: IMGS.expeditionQ, caption: 'Captain Q · Founder' },
    { src: IMGS.antartica, caption: 'Antarctic Crossing' },
    { src: IMGS.event1, caption: 'Members Event' },
    { src: IMGS.flying1, caption: 'Dawn Sortie' },
    { src: IMGS.cockpit, caption: 'Flight Deck' },
    { src: IMGS.channel, caption: 'Channel Crossing' },
    { src: IMGS.southPole, caption: 'South Pole by Helicopter' },
    { src: IMGS.event3, caption: 'Summer Gathering' },
    { src: IMGS.fleet, caption: 'The Fleet' },
  ];

  return (
    <section className="hst-hero hst-v33" ref={containerRef} style={{ height: '400vh' }}>
      <div className="hst-v33__sticky" ref={scrollRef}>
        <div className="hst-v33__header">
          <div className="hst-v33__badge">Private Members Club</div>
          <Logo width="clamp(150px, 20vw, 280px)" light />
          <div className="hst-v33__tagline">
            <span>EST. 2010</span>
            <span className="hst-v33__sep" />
            <span>LONDON <UnionJack size={12} /></span>
          </div>
        </div>

        <motion.div className="hst-v33__track" style={{ x }}>
          {exhibitionImages.map((img, i) => (
            <div key={i} className="hst-v33__exhibit">
              <div className="hst-v33__exhibit-frame">
                <img src={img.src} alt={img.caption} />
              </div>
              <div className="hst-v33__exhibit-label">
                <span className="hst-v33__exhibit-num">{String(i + 1).padStart(2, '0')}</span>
                <span className="hst-v33__exhibit-caption">{img.caption}</span>
              </div>
            </div>
          ))}
        </motion.div>

        <div className="hst-v33__scroll-hint">
          <span>Scroll to explore</span>
          <svg width="40" height="12" viewBox="0 0 40 12"><line x1="0" y1="6" x2="34" y2="6" stroke="rgba(255,255,255,0.3)" strokeWidth="1" /><polyline points="30 2 36 6 30 10" fill="none" stroke="rgba(255,255,255,0.3)" strokeWidth="1" /></svg>
        </div>
      </div>
    </section>
  );
};


// ============================================
// V34 - MEMBERS LOUNGE
// Dark, moody luxury. Full dark background with
// floating "windows" into club activities.
// Gold accents, "Members Only" badge.
// ============================================
const HeroV34 = () => {
  const [active, setActive] = useState(0);
  const [loaded, setLoaded] = useState(false);
  useEffect(() => { setTimeout(() => setLoaded(true), 200); }, []);

  const windows = [
    { src: IMGS.northPole, label: 'Expeditions', x: 5, y: 15, w: 28, h: 35 },
    { src: IMGS.event1, label: 'Social Events', x: 36, y: 8, w: 25, h: 30 },
    { src: IMGS.cockpit, label: 'Flight Training', x: 64, y: 12, w: 32, h: 38 },
    { src: IMGS.fleet, label: 'The Fleet', x: 8, y: 55, w: 30, h: 35 },
    { src: IMGS.flying1, label: 'Self-Fly Hire', x: 42, y: 50, w: 22, h: 28 },
    { src: IMGS.social1, label: 'Members Life', x: 68, y: 55, w: 28, h: 35 },
  ];

  return (
    <section className="hst-hero hst-v34">
      <div className="hst-v34__bg" />

      {windows.map((w, i) => (
        <motion.div
          key={i}
          className={`hst-v34__window ${active === i ? 'active' : ''}`}
          style={{ left: `${w.x}%`, top: `${w.y}%`, width: `${w.w}%`, height: `${w.h}%` }}
          initial={{ opacity: 0, scale: 0.95 }}
          animate={loaded ? { opacity: 1, scale: 1 } : {}}
          transition={{ duration: 0.6, delay: i * 0.1 }}
          onMouseEnter={() => setActive(i)}
        >
          <img src={w.src} alt={w.label} />
          <div className="hst-v34__window-overlay" />
          <span className="hst-v34__window-label">{w.label}</span>
        </motion.div>
      ))}

      <div className="hst-v34__brand">
        <div className="hst-v34__crest">
          <div className="hst-v34__crest-line" />
          <span className="hst-v34__crest-text">Members Only</span>
          <div className="hst-v34__crest-line" />
        </div>
        <Logo width="clamp(150px, 22vw, 300px)" light />
        <div className="hst-v34__subtitle">Private Adventure Club · London · Est. 2010</div>
      </div>

      <ScrollPrompt className="hst__scroll-prompt--light" />
    </section>
  );
};


// ============================================
// V35 - IMAGE CASCADE
// Staggered columns of images flowing down with
// parallax. Brand text pinned at the top.
// Like a luxury lifestyle feed.
// ============================================
const HeroV35 = () => {
  const heroRef = useRef(null);
  const { scrollYProgress } = useScroll({ target: heroRef, offset: ['start start', 'end start'] });
  const col1Y = useTransform(scrollYProgress, [0, 1], ['0%', '-10%']);
  const col2Y = useTransform(scrollYProgress, [0, 1], ['0%', '-20%']);
  const col3Y = useTransform(scrollYProgress, [0, 1], ['0%', '-5%']);
  const col4Y = useTransform(scrollYProgress, [0, 1], ['0%', '-15%']);

  const columns = [
    [IMGS.northPole, IMGS.event1, IMGS.flying1, IMGS.social2, IMGS.hq0391],
    [IMGS.expeditionQ, IMGS.cockpit, IMGS.event3, IMGS.channel, IMGS.hq0477],
    [IMGS.antartica, IMGS.fleet, IMGS.event5, IMGS.flyingNight, IMGS.social3],
    [IMGS.southPole, IMGS.hero, IMGS.event2, IMGS.hangar, IMGS.hq0698],
  ];
  const colTransforms = [col1Y, col2Y, col3Y, col4Y];

  return (
    <section className="hst-hero hst-v35" ref={heroRef} style={{ height: '250vh' }}>
      <div className="hst-v35__sticky">
        <div className="hst-v35__columns">
          {columns.map((col, ci) => (
            <motion.div key={ci} className="hst-v35__column" style={{ y: colTransforms[ci] }}>
              {col.map((src, ii) => (
                <div key={ii} className="hst-v35__img"><img src={src} alt="" /></div>
              ))}
            </motion.div>
          ))}
        </div>
        <div className="hst-v35__gradient" />

        <div className="hst-v35__brand">
          <div className="hst-v35__badge">Private Members Club</div>
          <Logo width="clamp(200px, 30vw, 400px)" light />
          <div className="hst-v35__meta">
            <span>EST. 2010</span>
            <span className="hst-v35__sep" />
            <span>LONDON <UnionJack size={12} /></span>
          </div>
        </div>
      </div>
    </section>
  );
};


// ============================================
// V36 - ROTATING SHOWCASE
// Large central auto-cycling image with orbiting
// thumbnail ring. Like a luxury display case.
// ============================================
const HeroV36 = () => {
  const [active, setActive] = useState(0);
  const [linesVisible, setLinesVisible] = useState(false);

  useEffect(() => {
    setTimeout(() => setLinesVisible(true), 200);
    const timer = setInterval(() => setActive(p => (p + 1) % GALLERY.length), 3000);
    return () => clearInterval(timer);
  }, []);

  const orbitImages = GALLERY.slice(0, 12);
  const ringSize = orbitImages.length;

  return (
    <section className="hst-hero hst-v36">
      <div className="hst-v36__orbit">
        {orbitImages.map((src, i) => {
          const angle = (i / ringSize) * 360;
          return (
            <div
              key={i}
              className={`hst-v36__orbit-thumb ${i === active % ringSize ? 'active' : ''}`}
              style={{
                transform: `rotate(${angle}deg) translateX(min(38vw, 38vh)) rotate(-${angle}deg)`,
              }}
              onClick={() => setActive(i)}
            >
              <img src={src} alt="" />
            </div>
          );
        })}
      </div>

      <div className="hst-v36__center">
        <AnimatePresence mode="wait">
          <motion.div
            key={active}
            className="hst-v36__center-image"
            initial={{ opacity: 0, scale: 1.05 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.6 }}
          >
            <img src={GALLERY[active % GALLERY.length]} alt="" />
          </motion.div>
        </AnimatePresence>
      </div>

      <div className="hst-v36__brand">
        <div className="hst-v36__badge">Private Members Club</div>
        <Logo width="clamp(150px, 20vw, 280px)" light />
        <div className="hst-v36__meta">
          <span>EST. 2010</span>
          <span className="hst-v36__sep" />
          <span>LONDON <UnionJack size={12} /></span>
        </div>
      </div>

      <GridLines layout="minimal" visible={linesVisible} className="hst__grid--faded" />
    </section>
  );
};


// ============================================
// V37 - SPLIT PANELS
// 5 tall vertical panels, each showing a different
// aspect of the club. Hover to expand one. Each
// panel has a label. Luxury dark aesthetic.
// ============================================
const HeroV37 = () => {
  const [hovered, setHovered] = useState(null);

  const panels = [
    { src: IMGS.northPole, label: 'Expeditions', sub: 'Poles · Channels · Summits' },
    { src: IMGS.event1, label: 'Events', sub: 'Exclusive Member Gatherings' },
    { src: IMGS.cockpit, label: 'Training', sub: 'Discovery to Commercial' },
    { src: IMGS.fleet, label: 'Fleet', sub: '30+ Robinson Helicopters' },
    { src: IMGS.flying1, label: 'Self-Fly', sub: 'Hire & Adventures' },
  ];

  return (
    <section className="hst-hero hst-v37">
      <div className="hst-v37__panels">
        {panels.map((p, i) => (
          <div
            key={i}
            className={`hst-v37__panel ${hovered === i ? 'active' : ''} ${hovered !== null && hovered !== i ? 'dimmed' : ''}`}
            style={{ flex: hovered === i ? 3 : 1 }}
            onMouseEnter={() => setHovered(i)}
            onMouseLeave={() => setHovered(null)}
          >
            <img src={p.src} alt={p.label} />
            <div className="hst-v37__panel-overlay" />
            <div className="hst-v37__panel-content">
              <span className="hst-v37__panel-num">{String(i + 1).padStart(2, '0')}</span>
              <h3 className="hst-v37__panel-label">{p.label}</h3>
              <span className="hst-v37__panel-sub">{p.sub}</span>
            </div>
          </div>
        ))}
      </div>

      <div className="hst-v37__brand">
        <div className="hst-v37__badge">Private Members Club</div>
        <Logo width="clamp(150px, 20vw, 280px)" light />
        <div className="hst-v37__meta">
          <span>EST. 2010</span>
          <span className="hst-v37__sep" />
          <span>LONDON <UnionJack size={12} /></span>
        </div>
      </div>
    </section>
  );
};


// ============================================
// V38 - INFINITE FILM REEL
// Dual continuous horizontal strips of images
// scrolling in opposite directions. Dark cinema
// aesthetic. Brand centered between the strips.
// ============================================
const HeroV38 = () => {
  const row1 = GALLERY.slice(0, 16);
  const row2 = GALLERY.slice(8, 24);

  return (
    <section className="hst-hero hst-v38">
      <div className="hst-v38__reel hst-v38__reel--top">
        <div className="hst-v38__strip hst-v38__strip--left">
          {[...row1, ...row1].map((src, i) => (
            <div key={i} className="hst-v38__film-frame"><img src={src} alt="" /></div>
          ))}
        </div>
      </div>

      <div className="hst-v38__center">
        <div className="hst-v38__badge">Private Members Club</div>
        <Logo width="clamp(180px, 25vw, 350px)" light />
        <div className="hst-v38__divider" />
        <p className="hst-v38__sub">Adventure · Luxury · Freedom</p>
        <div className="hst-v38__meta">
          <span>EST. 2010</span>
          <span className="hst-v38__sep" />
          <span>LONDON <UnionJack size={12} /></span>
        </div>
      </div>

      <div className="hst-v38__reel hst-v38__reel--bottom">
        <div className="hst-v38__strip hst-v38__strip--right">
          {[...row2, ...row2].map((src, i) => (
            <div key={i} className="hst-v38__film-frame"><img src={src} alt="" /></div>
          ))}
        </div>
      </div>
    </section>
  );
};


// ============================================
// V39 - LUXURY CARD FAN
// Playing-card-style images fanned out from
// center. Hover individual cards to see them.
// Dark, gold accents, exclusive feel.
// ============================================
const HeroV39 = () => {
  const [hoveredCard, setHoveredCard] = useState(null);

  const cards = [
    { src: IMGS.northPole, label: 'North Pole' },
    { src: IMGS.expeditionQ, label: 'Captain Q' },
    { src: IMGS.antartica, label: 'Antarctica' },
    { src: IMGS.event1, label: 'Events' },
    { src: IMGS.cockpit, label: 'Training' },
    { src: IMGS.fleet, label: 'The Fleet' },
    { src: IMGS.flying1, label: 'Fly' },
    { src: IMGS.channel, label: 'Channel' },
    { src: IMGS.southPole, label: 'South Pole' },
  ];

  const totalCards = cards.length;
  const spreadAngle = 60;

  return (
    <section className="hst-hero hst-v39">
      <div className="hst-v39__fan">
        {cards.map((card, i) => {
          const angle = ((i - (totalCards - 1) / 2) / totalCards) * spreadAngle;
          const isHovered = hoveredCard === i;
          return (
            <motion.div
              key={i}
              className={`hst-v39__card ${isHovered ? 'active' : ''}`}
              style={{
                transformOrigin: 'bottom center',
                zIndex: isHovered ? 50 : totalCards - Math.abs(i - Math.floor(totalCards / 2)),
              }}
              animate={{
                rotate: isHovered ? 0 : angle,
                y: isHovered ? -40 : 0,
                scale: isHovered ? 1.15 : 1,
              }}
              transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
              onMouseEnter={() => setHoveredCard(i)}
              onMouseLeave={() => setHoveredCard(null)}
            >
              <img src={card.src} alt={card.label} />
              <div className="hst-v39__card-label">{card.label}</div>
            </motion.div>
          );
        })}
      </div>

      <div className="hst-v39__brand">
        <div className="hst-v39__badge">Private Members Club</div>
        <Logo width="clamp(180px, 25vw, 350px)" light />
        <div className="hst-v39__meta">
          <span>EST. 2010</span>
          <span className="hst-v39__sep" />
          <span>LONDON <UnionJack size={12} /></span>
          <span className="hst-v39__sep" />
          <span>BY INVITATION ONLY</span>
        </div>
      </div>
    </section>
  );
};


// ============================================
// V40 - IMMERSIVE GRID + FROSTED OVERLAY
// Dense grid of images with a frosted glass
// overlay. The brand text is a "clear window"
// into the images. Exclusive, mysterious.
// ============================================
const HeroV40 = () => {
  const [linesVisible, setLinesVisible] = useState(false);
  useEffect(() => { setTimeout(() => setLinesVisible(true), 200); }, []);

  const gridImages = GALLERY.slice(0, 24);

  return (
    <section className="hst-hero hst-v40">
      <div className="hst-v40__image-grid">
        {gridImages.map((src, i) => (
          <div key={i} className="hst-v40__grid-cell"><img src={src} alt="" /></div>
        ))}
      </div>
      <div className="hst-v40__frost" />

      <div className="hst-v40__content">
        <div className="hst-v40__badge">Private Members Club</div>
        <Logo width="clamp(200px, 30vw, 400px)" light />
        <div className="hst-v40__divider" />
        <p className="hst-v40__sub">Adventure · Luxury · Freedom</p>
        <div className="hst-v40__meta">
          <span>EST. 2010</span>
          <span className="hst-v40__sep" />
          <span>LONDON <UnionJack size={12} /></span>
          <span className="hst-v40__sep" />
          <span>BY INVITATION ONLY</span>
        </div>
      </div>

      <div className="hst-v40__clear-zone" />

      <GridLines layout="minimal" visible={linesVisible} className="hst__grid--light" />
      <ScrollPrompt className="hst__scroll-prompt--light" />
    </section>
  );
};


// ============================================
// PICKER SETUP
// ============================================

const heroVariations = [
  { id: 'v1-baseline', name: 'Side Panels + Scroll Sections', category: 'Current', desc: 'Current FinalDraft: side images cycle, center text scrolls through 4 sections', Component: HeroV1 },
  { id: 'v2-fullbleed', name: 'Full Bleed + Hover Filmstrip', category: 'Full Bleed', desc: 'Full expedition image, parallax scroll, filmstrip thumbnails swap background on hover', Component: HeroV2 },
  { id: 'v3-contained', name: 'Contained Image Frame', category: 'Architectural', desc: 'Image framed inside grid, text positioned in warm beige negative space', Component: HeroV3 },
  { id: 'v4-columns', name: 'Vertical Columns', category: 'Architectural', desc: 'Tall columns with images and vertical labels, central headline, column borders as grid', Component: HeroV4 },
  { id: 'v5-mono', name: 'Monochrome Editorial', category: 'Monochrome', desc: 'Pure B&W treatment, grayscale image, bold sans-serif, coordinates footer bar', Component: HeroV5 },
  { id: 'v6-asymmetric', name: 'Asymmetric Overlap', category: 'Architectural', desc: 'Image at 60% width, text overlaps boundary, accent color dot, CTA button', Component: HeroV6 },
  { id: 'v7-animated', name: 'Animated Assembly', category: 'Animated', desc: 'Choreographed sequence: grid lines → text reveal → image fade → stats appear', Component: HeroV7 },
  { id: 'v8-panels', name: 'Staggered Image Panels', category: 'Editorial', desc: 'Multiple overlapping expedition images at different sizes, parallax between layers', Component: HeroV8 },
  { id: 'v9-cinematic', name: 'Cinematic Letterbox', category: 'Cinematic', desc: 'Letterbox bars, dark overlay, info strip top, filmstrip in bottom bar', Component: HeroV9 },
  { id: 'v10-fullbleed-scroll', name: 'Full Bleed Scroll Sections', category: 'Full Bleed', desc: 'Like V1 but full-bleed backgrounds crossfade as you scroll through sections', Component: HeroV10 },
  { id: 'v11-floating-card', name: 'Floating Card + Bleed', category: 'Full Bleed', desc: 'Full dark image, frosted glass card off-center, vertical filmstrip on right edge', Component: HeroV11 },
  { id: 'v12-diagonal', name: 'Diagonal Split', category: 'Compositional', desc: 'Diagonal division — image on one side, warm beige on the other, headline at intersection', Component: HeroV12 },
  { id: 'v13-bento', name: 'Bento Grid', category: 'Compositional', desc: 'Multi-cell bento grid: large hero image, text cell, description cell, thumbnails row', Component: HeroV13 },
  { id: 'v14-reveal', name: 'Scroll Reveal Circle', category: 'Animated', desc: 'Text on beige, image reveals behind via expanding clip-path circle on scroll', Component: HeroV14 },
  { id: 'v15-marquee', name: 'Horizontal Marquee', category: 'Kinetic', desc: 'Full bleed image with continuously scrolling brand marquee across the center', Component: HeroV15 },
  { id: 'v16-depth', name: 'Layered Depth', category: 'Full Bleed', desc: 'Three parallax layers at different z-depths: background → title → foreground stats', Component: HeroV16 },
  { id: 'v17-window', name: 'Window Pane', category: 'Architectural', desc: 'Image visible through a window cut from solid beige surface, text above/below window', Component: HeroV17 },
  { id: 'v18-split-tone', name: 'Split Dark/Light', category: 'Compositional', desc: 'Left half dark, right half light. Image bleeds across both at an offset. Tonal tension', Component: HeroV18 },
  { id: 'v19-timeline', name: 'Timeline Hero', category: 'Editorial', desc: 'Horizontal timeline with key milestones over full-bleed image, brand above, tagline below', Component: HeroV19 },
  { id: 'v20-bands', name: 'Crop & Reveal Bands', category: 'Architectural', desc: 'Horizontal bands alternate solid beige and open image slices, text reads between bands', Component: HeroV20 },
  { id: 'v21-knockout', name: 'Text Knockout', category: 'Typographic', desc: 'Giant "HQ" letterforms act as a mask revealing the image through the text', Component: HeroV21 },
  { id: 'v22-polaroid', name: 'Polaroid Scatter', category: 'Compositional', desc: 'Scattered polaroid photos stagger in with rotation, brand info centered over the arrangement', Component: HeroV22 },
  { id: 'v23-split-scroll', name: 'Vertical Split Scroll', category: 'Kinetic', desc: 'Left half scrolls up, right scrolls down, text pinned at the center seam', Component: HeroV23 },
  { id: 'v24-circular', name: 'Circular Frame', category: 'Architectural', desc: 'Large circular mask reveals image, brand text positioned around the circle', Component: HeroV24 },
  { id: 'v25-magazine', name: 'Magazine Cover', category: 'Editorial', desc: 'Styled like a luxury magazine cover: masthead, headline, cover lines, barcode', Component: HeroV25 },
  { id: 'v26-grid-reveal', name: 'Grid Reveal', category: 'Animated', desc: 'Grid cells animate in one by one, progressively revealing the image underneath', Component: HeroV26 },
  { id: 'v27-panoramic', name: 'Panoramic Horizontal', category: 'Kinetic', desc: 'Oversized image scrolls horizontally via scroll, content pinned in center', Component: HeroV27 },
  { id: 'v28-paper', name: 'Layered Paper', category: 'Compositional', desc: 'Stacked paper layers with shadows: image back, stats mid, headline front', Component: HeroV28 },
  { id: 'v29-type-hero', name: 'Minimal Type Hero', category: 'Typographic', desc: 'Pure typographic hero with massive headline and a tiny inline image detail', Component: HeroV29 },
  { id: 'v30-film', name: 'Film Grain Vintage', category: 'Cinematic', desc: 'Dark moody treatment with film grain, vignette, vintage corner frames, film code', Component: HeroV30 },
  { id: 'v31-gallery-wall', name: 'Gallery Wall', category: 'Gallery', desc: 'Luxury club photo wall — 12 images in varied sizes on dark surface, gold-accented brand overlay', Component: HeroV31 },
  { id: 'v32-mosaic', name: 'Living Mosaic', category: 'Gallery', desc: 'Dense auto-shuffling mosaic grid of adventure images that swap in/out. Brand floats over', Component: HeroV32 },
  { id: 'v33-exhibition', name: 'Horizontal Exhibition', category: 'Gallery', desc: 'Premium horizontal-scroll gallery like a private photography exhibition. 10 large images', Component: HeroV33 },
  { id: 'v34-lounge', name: 'Members Lounge', category: 'Club', desc: 'Dark luxury with 6 floating windows into club life — expeditions, events, fleet, training', Component: HeroV34 },
  { id: 'v35-cascade', name: 'Image Cascade', category: 'Gallery', desc: '4-column parallax waterfall of 20 images flowing at different speeds. Lifestyle feed feel', Component: HeroV35 },
  { id: 'v36-showcase', name: 'Rotating Showcase', category: 'Gallery', desc: 'Large central auto-cycling image with 12 orbiting thumbnails. Luxury display case', Component: HeroV36 },
  { id: 'v37-panels', name: 'Split Panels', category: 'Club', desc: '5 tall vertical panels — hover expands. Each shows an aspect: Expeditions, Events, Training, Fleet, Fly', Component: HeroV37 },
  { id: 'v38-film-reel', name: 'Infinite Film Reel', category: 'Kinetic', desc: 'Dual infinite horizontal strips scrolling opposite directions. 32 images. Cinema aesthetic', Component: HeroV38 },
  { id: 'v39-card-fan', name: 'Luxury Card Fan', category: 'Club', desc: '9 cards fanned like a deck — hover lifts individual cards. Dark, exclusive, "By Invitation Only"', Component: HeroV39 },
  { id: 'v40-frosted-grid', name: 'Frosted Grid', category: 'Gallery', desc: 'Dense 24-image grid behind frosted glass. Brand text is a clear window into the images', Component: HeroV40 },
];

const pickerSections = {
  current: heroVariations.filter(h => h.category === 'Current'),
  fullbleed: heroVariations.filter(h => h.category === 'Full Bleed'),
  architectural: heroVariations.filter(h => h.category === 'Architectural'),
  compositional: heroVariations.filter(h => h.category === 'Compositional'),
  monochrome: heroVariations.filter(h => h.category === 'Monochrome'),
  animated: heroVariations.filter(h => h.category === 'Animated'),
  kinetic: heroVariations.filter(h => h.category === 'Kinetic'),
  editorial: heroVariations.filter(h => h.category === 'Editorial'),
  cinematic: heroVariations.filter(h => h.category === 'Cinematic'),
  typographic: heroVariations.filter(h => h.category === 'Typographic'),
  gallery: heroVariations.filter(h => h.category === 'Gallery'),
  club: heroVariations.filter(h => h.category === 'Club'),
};

const filteredSections = Object.fromEntries(
  Object.entries(pickerSections).filter(([_, items]) => items.length > 0)
);

const tabs = [
  { key: 'current', label: 'Current', color: 'default' },
  { key: 'fullbleed', label: 'Full Bleed', color: 'blue' },
  { key: 'architectural', label: 'Architectural', color: 'green' },
  { key: 'compositional', label: 'Compositional', color: 'orange' },
  { key: 'monochrome', label: 'Monochrome', color: 'default' },
  { key: 'animated', label: 'Animated', color: 'purple' },
  { key: 'kinetic', label: 'Kinetic', color: 'blue' },
  { key: 'editorial', label: 'Editorial', color: 'orange' },
  { key: 'cinematic', label: 'Cinematic', color: 'purple' },
  { key: 'typographic', label: 'Typographic', color: 'orange' },
  { key: 'gallery', label: 'Gallery', color: 'blue' },
  { key: 'club', label: 'Club', color: 'purple' },
].filter(tab => filteredSections[tab.key]);


// ============================================
// MAIN PAGE
// ============================================

function HeroSectionTest() {
  const [currentHero, setCurrentHero] = useState(heroVariations[0]);

  const handleItemSelect = useCallback((item) => {
    setCurrentHero(item);
    window.scrollTo({ top: 0 });
  }, []);

  const CurrentComponent = currentHero?.Component;

  return (
    <div className="hst-page">
      {CurrentComponent && <CurrentComponent />}

      <Picker
        sections={filteredSections}
        tabs={tabs}
        storageKey="hq-hero-section-test-v2"
        title="Hero Variations"
        onItemSelect={handleItemSelect}
        initialTab="current"
      />

      <div className="hst-info">
        <div className="hst-info__badge">{currentHero?.category}</div>
        <div className="hst-info__id">{currentHero?.id}</div>
      </div>

      <style>{styles}</style>
    </div>
  );
}


// ============================================
// STYLES
// ============================================

const styles = `
  /* ===== PAGE ===== */
  .hst-page {
    position: relative;
    min-height: 100vh;
    font-family: 'Space Grotesk', -apple-system, BlinkMacSystemFont, sans-serif;
    background: #faf9f6;
    color: #1a1a1a;
  }
  .hst-info {
    position: fixed; top: 20px; right: 20px; z-index: 99999;
    display: flex; flex-direction: column; align-items: flex-end; gap: 8px;
  }
  .hst-info__badge {
    background: rgba(224,74,47,0.9); color: #fff; padding: 6px 12px;
    border-radius: 20px; font-size: 11px; font-weight: 600;
    text-transform: uppercase; letter-spacing: 0.05em;
  }
  .hst-info__id {
    background: rgba(0,0,0,0.7); color: #fff; padding: 4px 10px;
    border-radius: 4px; font-family: monospace; font-size: 11px;
  }
  .hq-header, .hq-footer { display: none !important; }

  .hst-hero {
    position: relative; width: 100%; min-height: 100vh; overflow: hidden;
    background: #faf9f6;
  }

  /* ===== SHARED ELEMENTS ===== */

  /* Grid Lines */
  .hst__grid {
    position: fixed; top: 0; left: 0; right: 0; height: 100vh;
    pointer-events: none; z-index: 1;
  }
  .hst__line {
    position: absolute; background: #e8e6e2;
    transition: transform 1s cubic-bezier(0.16, 1, 0.3, 1);
  }
  .hst__line--v {
    top: 0; bottom: 0; width: 1px;
    transform: scaleY(0); transform-origin: top;
  }
  .hst__line--h {
    left: 0; right: 0; height: 1px;
    transform: scaleX(0); transform-origin: left;
  }
  .hst__grid--visible .hst__line { transform: scaleY(1); }
  .hst__grid--visible .hst__line--h { transform: scaleX(1); }
  .hst__grid--faded { opacity: 0; transition: opacity 0.5s ease; }
  .hst__grid--light .hst__line { background: rgba(255,255,255,0.12); }
  .hst__grid--subtle .hst__line { background: rgba(255,255,255,0.06); }
  .hst__grid--faint .hst__line { background: rgba(0,0,0,0.06); }

  /* Coordinates */
  .hst__coords {
    display: flex; gap: 1.5rem; align-items: center;
    font-family: 'Share Tech Mono', monospace;
    font-size: 0.65rem; letter-spacing: 0.1em; color: #999;
    margin-bottom: 1.5rem;
    transition: opacity 0.5s ease;
  }
  .hst__coords--light { color: rgba(255,255,255,0.5); }
  .hst__coords--hidden { opacity: 0; }

  /* Pre-text */
  .hst__pre {
    display: block;
    font-size: 0.75rem; text-transform: uppercase;
    letter-spacing: 0.25em; color: #888; margin-bottom: 1rem;
  }
  .hst__pre--light { color: rgba(255,255,255,0.6); }

  /* Headline */
  .hst__headline {
    display: flex; flex-direction: column; align-items: center;
    gap: 0.25rem; margin: 0 0 1.5rem;
  }
  .hst__word {
    font-family: 'Space Grotesk', sans-serif;
    font-size: clamp(2.5rem, 6vw, 4.5rem);
    font-weight: 700; line-height: 1; text-transform: uppercase;
    letter-spacing: -0.02em;
    opacity: 0; transform: translateY(20px);
    animation: hstWordIn 0.8s ease forwards;
    animation-delay: var(--delay, 0s);
  }
  .hst__word--1 { color: #1a1a1a; }
  .hst__word--2 { color: #4a4a4a; }
  .hst__word--3 { color: #7a7a7a; }

  @keyframes hstWordIn {
    to { opacity: 1; transform: translateY(0); }
  }

  /* Description */
  .hst__desc {
    font-size: 1rem; color: #666; max-width: 300px; line-height: 1.6; margin: 0;
  }
  .hst__desc--light { color: rgba(255,255,255,0.7); }

  /* Scroll Prompt */
  .hst__scroll-prompt {
    position: fixed; bottom: 0.5rem; left: 50%;
    transform: translateX(-50%);
    display: flex; flex-direction: column; align-items: center;
    gap: 1rem; z-index: 20;
    transition: opacity 0.5s ease;
  }
  .hst__scroll-prompt--hidden { opacity: 0; pointer-events: none; }
  .hst__scroll-prompt--light .hst__scroll-text { color: rgba(255,255,255,0.5); }
  .hst__scroll-prompt--light .hst__scroll-line { background: rgba(255,255,255,0.15); }
  .hst__scroll-prompt--light .hst__scroll-line span { background: rgba(255,255,255,0.6); }
  .hst__scroll-text {
    font-size: 0.65rem; text-transform: uppercase;
    letter-spacing: 0.2em; color: #999;
  }
  .hst__scroll-line {
    width: 1px; height: 50px; background: rgba(0,0,0,0.1);
    position: relative; overflow: hidden;
  }
  .hst__scroll-line span {
    position: absolute; top: 0; left: 0; width: 100%; height: 30%;
    background: #1a1a1a;
    animation: hstScrollLine 2s ease-in-out infinite;
  }
  @keyframes hstScrollLine {
    0% { top: -30%; }
    100% { top: 100%; }
  }


  /* ===== V1 - BASELINE ===== */
  .hst-v1__image {
    position: fixed; top: 0; height: 100vh; width: 28%;
    z-index: 2; overflow: hidden;
    transition: transform 0.8s cubic-bezier(0.16, 1, 0.3, 1), opacity 1s ease;
  }
  .hst-v1__image--left { left: 0; transition-delay: 0.3s; }
  .hst-v1__image--right { right: 0; transition-delay: 0.4s; }
  .hst-v1__image--gone { opacity: 0 !important; pointer-events: none; }
  .hst-v1__cycle {
    position: absolute; inset: 0; width: 100%; height: 100%;
    object-fit: cover; opacity: 0; transition: opacity 0.8s ease-in-out;
  }
  .hst-v1__cycle.active { opacity: 1; }
  .hst-v1__center {
    position: fixed; top: 0; left: 28%; right: 28%; height: 100vh;
    display: flex; flex-direction: column; justify-content: center;
    align-items: center; z-index: 10; padding: 2rem;
    transition: opacity 0.5s ease;
  }
  .hst-v1__center--faded { opacity: 0; pointer-events: none; }
  .hst-v1__section {
    position: absolute; display: flex; flex-direction: column;
    align-items: center; text-align: center;
    opacity: 0; transform: translateY(30px);
    transition: opacity 0.6s ease, transform 0.6s ease;
    pointer-events: none;
  }
  .hst-v1__section.active {
    opacity: 1; transform: translateY(0); pointer-events: auto;
  }
  .hst-v1__progress {
    position: fixed; right: 3rem; top: 50%; transform: translateY(-50%);
    display: flex; flex-direction: column; gap: 0.75rem; z-index: 20;
    transition: opacity 0.5s ease;
  }
  .hst-v1__progress--faded { opacity: 0; }
  .hst-v1__dot {
    width: 8px; height: 8px; border: 1px solid #ccc;
    border-radius: 50%; transition: all 0.3s ease;
  }
  .hst-v1__dot.active { background: #1a1a1a; border-color: #1a1a1a; }

  /* Text shadow halo for V1 */
  .hst-v1 .hst__word {
    text-shadow:
      -8px -8px 0 #faf9f6, 8px -8px 0 #faf9f6,
      -8px 8px 0 #faf9f6, 8px 8px 0 #faf9f6,
      0 -8px 0 #faf9f6, 0 8px 0 #faf9f6,
      -8px 0 0 #faf9f6, 8px 0 0 #faf9f6,
      -4px -4px 0 #faf9f6, 4px -4px 0 #faf9f6,
      -4px 4px 0 #faf9f6, 4px 4px 0 #faf9f6;
  }
  .hst-v1 .hst__desc {
    text-shadow:
      -4px -4px 0 #faf9f6, 4px -4px 0 #faf9f6,
      -4px 4px 0 #faf9f6, 4px 4px 0 #faf9f6;
  }


  /* ===== V2 - FULL BLEED ===== */
  .hst-v2__sticky {
    position: sticky; top: 0; height: 100vh; overflow: hidden;
  }
  .hst-v2__bg {
    position: absolute; inset: -10% 0; /* extra for parallax */
  }
  .hst-v2__bg img {
    width: 100%; height: 100%; object-fit: cover;
    transition: opacity 0.6s ease;
  }
  .hst-v2__overlay {
    position: absolute; inset: 0;
    background: linear-gradient(
      to top,
      rgba(0,0,0,0.55) 0%,
      rgba(0,0,0,0.2) 40%,
      rgba(0,0,0,0.1) 70%,
      transparent 100%
    );
    z-index: 1;
  }
  .hst-v2__content {
    position: absolute; bottom: 130px; left: 5%; z-index: 10;
  }
  .hst-v2__title {
    margin: 0 0 0.75rem; line-height: 1;
  }
  .hst-v2__word-1 {
    display: block;
    font-size: clamp(3rem, 8vw, 6rem); font-weight: 800;
    color: #fff; letter-spacing: -0.02em;
    text-shadow: 0 2px 30px rgba(0,0,0,0.3);
  }
  .hst-v2__word-2 {
    display: block;
    font-size: clamp(2rem, 5vw, 3.5rem); font-weight: 300;
    color: rgba(255,255,255,0.85); letter-spacing: 0.15em;
    text-transform: uppercase;
  }
  .hst-v2__meta {
    display: flex; align-items: center; gap: 0.75rem;
    font-family: 'Share Tech Mono', monospace;
    font-size: 0.7rem; letter-spacing: 0.15em;
    color: rgba(255,255,255,0.6); text-transform: uppercase;
    margin-bottom: 1rem;
  }
  .hst-v2__sep {
    width: 12px; height: 1px; background: rgba(255,255,255,0.3);
  }
  .hst-v2__filmstrip {
    position: absolute; bottom: 0; left: 0; right: 0;
    display: flex; gap: 4px; padding: 10px 12px;
    z-index: 10;
    background: linear-gradient(to top, rgba(0,0,0,0.5), transparent);
  }
  .hst-v2__thumb {
    flex-shrink: 0; width: 90px; height: 60px;
    border-radius: 3px; overflow: hidden;
    opacity: 0.5; cursor: pointer;
    transition: all 0.3s ease;
    border: 2px solid transparent;
  }
  .hst-v2__thumb:hover, .hst-v2__thumb.active {
    opacity: 1; border-color: rgba(255,255,255,0.6);
    transform: translateY(-3px);
  }
  .hst-v2__thumb img { width: 100%; height: 100%; object-fit: cover; }


  /* ===== V3 - CONTAINED FRAME ===== */
  .hst-v3__sticky {
    position: sticky; top: 0; height: 100vh;
    display: flex; align-items: stretch;
  }
  .hst-v3__left {
    position: relative; z-index: 5;
    width: 38%; display: flex; flex-direction: column;
    justify-content: center; padding: 0 4%;
  }
  .hst-v3__meta {
    display: flex; align-items: center; gap: 0.75rem;
    font-family: 'Share Tech Mono', monospace;
    font-size: 0.65rem; letter-spacing: 0.15em; color: #999;
    margin-top: 0.75rem; text-transform: uppercase;
  }
  .hst-v3__dot {
    width: 3px; height: 3px; background: #ccc; border-radius: 50%;
  }
  .hst-v3__frame {
    position: absolute;
    top: 6%; right: 3%; bottom: 6%; left: 40%;
    overflow: hidden; border-radius: 3px;
    z-index: 2;
  }
  .hst-v3__frame-img {
    position: absolute; inset: 0;
  }
  .hst-v3__frame-img img {
    width: 100%; height: 100%; object-fit: cover;
  }
  .hst-v3__frame-counter {
    position: absolute; bottom: 1.5rem; left: 50%;
    transform: translateX(-50%);
    display: flex; gap: 6px; z-index: 10;
  }
  .hst-v3__counter-dot {
    width: 6px; height: 6px; border-radius: 50%;
    background: #fff; opacity: 0.3;
  }


  /* ===== V4 - VERTICAL COLUMNS ===== */
  .hst-v4 { background: #faf9f6; }
  .hst-v4__columns {
    display: grid;
    grid-template-columns: 1fr 1.5fr 2fr 1.5fr 1fr;
    height: 100vh;
  }
  .hst-v4__col {
    border-right: 1px solid #e8e6e2;
    position: relative; overflow: hidden;
    opacity: 0; transform: scaleY(0.95);
    transition: opacity 0.8s ease, transform 0.8s cubic-bezier(0.16, 1, 0.3, 1);
  }
  .hst-v4__columns.visible .hst-v4__col {
    opacity: 1; transform: scaleY(1);
  }
  .hst-v4__col:last-child { border-right: none; }
  .hst-v4__col:nth-child(1) { transition-delay: 0.1s; }
  .hst-v4__col:nth-child(2) { transition-delay: 0.2s; }
  .hst-v4__col:nth-child(3) { transition-delay: 0.3s; }
  .hst-v4__col:nth-child(4) { transition-delay: 0.4s; }
  .hst-v4__col:nth-child(5) { transition-delay: 0.5s; }

  .hst-v4__col--label {
    display: flex; align-items: center; justify-content: center;
  }
  .hst-v4__vert-label {
    writing-mode: vertical-rl; text-orientation: mixed;
    font-size: 0.65rem; letter-spacing: 0.25em;
    text-transform: uppercase; color: #999;
  }
  .hst-v4__col--img img {
    width: 100%; height: 100%; object-fit: cover;
  }
  .hst-v4__col--center {
    display: flex; align-items: center; justify-content: center;
    background: #faf9f6;
  }
  .hst-v4__center-content {
    text-align: center;
  }
  .hst-v4__center-content .hst__headline {
    align-items: center;
  }
  .hst-v4__meta {
    display: flex; align-items: center; justify-content: center;
    gap: 1rem; margin-top: 1.5rem;
    font-family: 'Share Tech Mono', monospace;
    font-size: 0.6rem; letter-spacing: 0.15em; color: #999;
    text-transform: uppercase;
  }
  .hst-v4__header {
    position: absolute; top: 0; left: 0; right: 0;
    display: flex; justify-content: space-between;
    padding: 1.5rem 2rem; z-index: 10;
    font-size: 0.65rem; letter-spacing: 0.15em;
    text-transform: uppercase; color: #999;
  }


  /* ===== V5 - MONOCHROME ===== */
  .hst-v5 { background: #fff; }
  .hst-v5__layout {
    display: grid; grid-template-columns: 1fr 1fr;
    height: 100vh;
  }
  .hst-v5__content {
    display: flex; flex-direction: column;
    justify-content: center; padding: 0 4rem;
  }
  .hst-v5__header {
    display: flex; align-items: center; gap: 0.75rem;
    font-size: 0.7rem; font-weight: 600; letter-spacing: 0.15em;
    text-transform: uppercase; color: #1a1a1a;
    margin-bottom: 2rem;
  }
  .hst-v5__header span:nth-child(2) { color: #ccc; }
  .hst-v5__title {
    font-size: clamp(2.5rem, 5vw, 4.5rem);
    font-weight: 700; line-height: 1.05;
    text-transform: uppercase; letter-spacing: -0.02em;
    color: #1a1a1a; margin: 0 0 1.5rem;
  }
  .hst-v5__tagline {
    font-size: 0.8rem; color: #999; letter-spacing: 0.1em;
    margin: 0;
  }
  .hst-v5__image {
    position: relative; overflow: hidden;
  }
  .hst-v5__image img {
    width: 100%; height: 100%; object-fit: cover;
    filter: grayscale(100%) contrast(1.15);
  }
  .hst-v5__footer {
    position: absolute; bottom: 0; left: 0; right: 0;
    display: flex; justify-content: space-between;
    padding: 1rem 2rem; background: #0a0a0a; z-index: 3;
    font-family: 'Share Tech Mono', monospace;
    font-size: 0.6rem; letter-spacing: 0.15em;
    color: rgba(255,255,255,0.5); text-transform: uppercase;
  }


  /* ===== V6 - ASYMMETRIC OVERLAP ===== */
  .hst-v6 { background: #faf9f6; }
  .hst-v6__sticky {
    position: sticky; top: 0; height: 100vh; overflow: hidden;
  }
  .hst-v6__image-block {
    position: absolute; top: 0; right: 0; bottom: 0;
    width: 60%; z-index: 2; overflow: hidden;
  }
  .hst-v6__img-layer {
    position: absolute; inset: 0;
  }
  .hst-v6__img-layer img {
    width: 100%; height: 100%; object-fit: cover;
  }
  .hst-v6__image-overlay {
    position: absolute; inset: 0; z-index: 3;
    background: linear-gradient(to right, rgba(250,249,246,0.3), transparent 30%);
  }
  .hst-v6__counter {
    position: absolute; bottom: 1.5rem; left: 50%;
    transform: translateX(-50%);
    display: flex; gap: 6px; z-index: 10;
  }
  .hst-v6__counter-pip {
    width: 6px; height: 6px; border-radius: 50%;
    background: #fff;
  }
  .hst-v6__text-block {
    position: absolute; top: 50%; left: 4%;
    translate: 0 -50%; z-index: 5;
    max-width: 45%;
  }
  .hst-v6__accent { color: #e04a2f; }
  .hst-v6__cta { margin-top: 2rem; }
  .hst-v6__btn {
    display: inline-flex; align-items: center; gap: 0.5rem;
    background: #1a1a1a; color: #fff;
    padding: 0.85rem 1.75rem; border-radius: 0;
    font-size: 0.75rem; font-weight: 600;
    letter-spacing: 0.1em; text-transform: uppercase;
    text-decoration: none;
    transition: background 0.3s ease;
  }
  .hst-v6__btn:hover { background: #e04a2f; }
  .hst-v6__btn span {
    transition: transform 0.3s ease;
  }
  .hst-v6__btn:hover span { transform: translateX(4px); }
  .hst-v6__corner {
    position: absolute; bottom: 2rem; right: 2rem; z-index: 5;
    display: flex; align-items: center; gap: 0.75rem;
    font-family: 'Share Tech Mono', monospace;
    font-size: 0.6rem; letter-spacing: 0.15em; color: #999;
    text-transform: uppercase;
  }


  /* ===== V7 - ANIMATED ASSEMBLY ===== */
  .hst-v7 { background: #faf9f6; }
  .hst-v7__layout {
    display: grid; grid-template-columns: 1fr 1fr;
    height: 100vh; gap: 0;
  }
  .hst-v7__content {
    display: flex; flex-direction: column;
    justify-content: center; padding: 0 4rem;
    z-index: 5;
  }
  .hst-v7__eyebrow {
    display: flex; align-items: center; gap: 0.5rem;
    font-size: 0.7rem; letter-spacing: 0.15em;
    text-transform: uppercase; color: #999;
    margin-bottom: 2rem;
    opacity: 0; transition: opacity 0.6s ease;
  }
  .hst-v7__eyebrow.visible { opacity: 1; }
  .hst-v7__pulse {
    width: 6px; height: 6px; border-radius: 50%;
    background: #e04a2f;
    animation: hstPulse 2s ease-in-out infinite;
  }
  @keyframes hstPulse {
    0%, 100% { transform: scale(1); opacity: 1; }
    50% { transform: scale(1.3); opacity: 0.6; }
  }
  .hst-v7__title {
    display: flex; flex-direction: column; gap: 0.25rem;
    margin: 0 0 2rem;
  }
  .hst-v7__word--bold {
    font-size: clamp(3rem, 7vw, 5rem); font-weight: 800;
    color: #1a1a1a; text-transform: uppercase;
    letter-spacing: -0.02em; line-height: 1;
  }
  .hst-v7__word--light {
    font-size: clamp(2rem, 5vw, 3.5rem); font-weight: 300;
    color: #666; text-transform: uppercase;
    letter-spacing: 0.1em; line-height: 1;
    font-style: italic;
  }
  .hst-v7__stats {
    display: flex; gap: 2.5rem;
  }
  .hst-v7__stat {
    display: flex; flex-direction: column;
  }
  .hst-v7__stat strong {
    font-size: 1.5rem; font-weight: 700; color: #1a1a1a;
  }
  .hst-v7__stat span {
    font-size: 0.6rem; letter-spacing: 0.15em;
    text-transform: uppercase; color: #999;
  }
  .hst-v7__image {
    position: relative; overflow: hidden;
  }
  .hst-v7__image img {
    width: 100%; height: 100%; object-fit: cover;
  }
  .hst-v7 > .hst__coords {
    position: absolute; bottom: 2rem; left: 4%; z-index: 5;
  }
  .hst-v7 > .hst__scroll-prompt { z-index: 5; }


  /* ===== V8 - STAGGERED PANELS ===== */
  .hst-v8__sticky {
    position: sticky; top: 0; height: 100vh;
  }
  .hst-v8__panels {
    position: absolute; inset: 0; z-index: 2;
  }
  .hst-v8__panel {
    position: absolute; overflow: hidden;
    box-shadow: 0 20px 60px rgba(0,0,0,0.15);
    border-radius: 2px;
  }
  .hst-v8__panel img {
    width: 100%; height: 100%; object-fit: cover;
  }
  .hst-v8__panel--1 {
    top: 5%; left: 35%; width: 55%; height: 65%;
    z-index: 3;
  }
  .hst-v8__panel--2 {
    top: 20%; left: 5%; width: 28%; height: 45%;
    z-index: 2;
  }
  .hst-v8__panel--3 {
    bottom: 8%; right: 5%; width: 22%; height: 35%;
    z-index: 4;
  }
  .hst-v8__panel--4 {
    top: 60%; left: 30%; width: 18%; height: 28%;
    z-index: 2;
  }
  .hst-v8__panel--5 {
    top: 2%; left: 18%; width: 14%; height: 22%;
    z-index: 1;
  }
  .hst-v8__panel--6 {
    bottom: 3%; left: 8%; width: 16%; height: 24%;
    z-index: 3;
  }
  .hst-v8__panel--7 {
    top: 12%; right: 2%; width: 12%; height: 20%;
    z-index: 1;
  }
  .hst-v8__panel--8 {
    bottom: 15%; right: 30%; width: 15%; height: 22%;
    z-index: 2;
  }
  .hst-v8__panel--9 {
    top: 40%; left: 0%; width: 10%; height: 18%;
    z-index: 1;
  }
  .hst-v8__text {
    position: absolute; top: 8%; left: 5%;
    z-index: 10; max-width: 30%;
  }
  .hst-v8__text .hst__headline {
    align-items: flex-start;
  }
  .hst-v8__meta {
    display: flex; align-items: center; gap: 0.75rem;
    font-family: 'Share Tech Mono', monospace;
    font-size: 0.6rem; letter-spacing: 0.15em; color: #999;
    margin-top: 1rem; text-transform: uppercase;
  }
  .hst-v8__dot {
    width: 3px; height: 3px; background: #ccc; border-radius: 50%;
  }


  /* ===== V9 - CINEMATIC ===== */
  .hst-v9 { background: #000; }
  .hst-v9__bg {
    position: absolute; inset: 0;
  }
  .hst-v9__bg img {
    width: 100%; height: 100%; object-fit: cover;
    filter: contrast(1.1) saturate(0.85);
  }
  .hst-v9__overlay {
    position: absolute; inset: 0; background: rgba(0,0,0,0.45); z-index: 1;
  }
  .hst-v9__letterbox {
    position: absolute; left: 0; right: 0;
    background: #0a0a0a; z-index: 5;
  }
  .hst-v9__letterbox--top {
    top: 0; height: 10vh;
    display: flex; align-items: center;
    border-bottom: 1px solid rgba(255,255,255,0.08);
  }
  .hst-v9__letterbox--bottom {
    bottom: 0; height: 10vh;
    display: flex; align-items: center; justify-content: center;
  }
  .hst-v9__top-info {
    display: flex; justify-content: space-between;
    width: 100%; padding: 0 2rem;
    font-family: 'Share Tech Mono', monospace;
    font-size: 0.6rem; letter-spacing: 0.2em;
    color: rgba(255,255,255,0.35); text-transform: uppercase;
  }
  .hst-v9__center {
    position: absolute; inset: 0;
    display: flex; flex-direction: column;
    align-items: center; justify-content: center;
    z-index: 3;
  }
  .hst-v9__title {
    font-size: clamp(3rem, 8vw, 7rem); font-weight: 800;
    color: #fff; letter-spacing: 0.1em; margin: 0;
    line-height: 1;
  }
  .hst-v9__word--dim { color: rgba(255,255,255,0.4); }
  .hst-v9__sub {
    display: flex; align-items: center; gap: 1rem;
    margin-top: 1.5rem;
    font-family: 'Share Tech Mono', monospace;
    font-size: 0.65rem; letter-spacing: 0.2em;
    color: rgba(255,255,255,0.5);
  }
  .hst-v9__sub span {
    display: flex; align-items: center; gap: 0.5rem;
  }
  .hst-v9__sep { color: rgba(255,255,255,0.2); }
  .hst-v9__filmstrip {
    display: flex; gap: 4px; height: 100%;
    align-items: center;
  }
  .hst-v9__thumb {
    width: 70px; height: calc(10vh - 20px);
    border-radius: 2px; overflow: hidden;
    opacity: 0.4; transition: opacity 0.3s;
  }
  .hst-v9__thumb:hover { opacity: 0.9; }
  .hst-v9__thumb img { width: 100%; height: 100%; object-fit: cover; }


  /* ===== V10 - FULL BLEED SCROLL ===== */
  .hst-v10__bg {
    position: fixed; inset: 0; opacity: 0;
    transition: opacity 1.2s ease;
    z-index: 0;
  }
  .hst-v10__bg.active { opacity: 1; }
  .hst-v10__bg img { width: 100%; height: 100%; object-fit: cover; }
  .hst-v10__overlay {
    position: fixed; inset: 0;
    background: rgba(0,0,0,0.4); z-index: 1;
  }
  .hst-v10__content {
    position: fixed; inset: 0;
    display: flex; flex-direction: column;
    align-items: center; justify-content: center;
    z-index: 10; padding: 2rem;
  }
  .hst-v10__section {
    position: absolute; display: flex; flex-direction: column;
    align-items: center; text-align: center;
    opacity: 0; transform: translateY(30px);
    transition: opacity 0.6s ease, transform 0.6s ease;
    pointer-events: none;
  }
  .hst-v10__section.active {
    opacity: 1; transform: translateY(0); pointer-events: auto;
  }
  .hst-v10__headline {
    display: flex; flex-direction: column; align-items: center;
    gap: 0.25rem; margin: 0 0 1.5rem;
  }
  .hst-v10__word {
    font-size: clamp(2.5rem, 6vw, 4.5rem);
    font-weight: 700; line-height: 1; text-transform: uppercase;
    letter-spacing: -0.02em;
  }
  .hst-v10__word--1 { color: #fff; }
  .hst-v10__word--2 { color: rgba(255,255,255,0.7); }
  .hst-v10__word--3 { color: rgba(255,255,255,0.45); }
  .hst-v10__progress {
    position: fixed; right: 3rem; top: 50%; transform: translateY(-50%);
    display: flex; flex-direction: column; gap: 0.75rem; z-index: 20;
  }
  .hst-v10__dot {
    width: 8px; height: 8px;
    border: 1px solid rgba(255,255,255,0.4);
    border-radius: 50%; transition: all 0.3s ease;
  }
  .hst-v10__dot.active {
    background: #fff; border-color: #fff;
  }


  /* ===== V11 - FLOATING CARD ===== */
  .hst-v11 { background: #0a0a0a; }
  .hst-v11__bg { position: absolute; inset: 0; }
  .hst-v11__bg img { width: 100%; height: 100%; object-fit: cover; }
  .hst-v11__overlay { position: absolute; inset: 0; background: rgba(0,0,0,0.5); z-index: 1; }
  .hst-v11__card {
    position: absolute; top: 50%; left: 6%; translate: 0 -50%;
    z-index: 10;
    background: rgba(255,255,255,0.08);
    backdrop-filter: blur(24px); -webkit-backdrop-filter: blur(24px);
    border: 1px solid rgba(255,255,255,0.12);
    border-radius: 12px; padding: 3rem 3.5rem;
  }
  .hst-v11__title { margin: 0 0 1rem; line-height: 1; }
  .hst-v11__title span {
    display: block;
    font-size: clamp(2.5rem, 5vw, 4rem); font-weight: 700;
    text-transform: uppercase; letter-spacing: -0.02em;
  }
  .hst-v11__title span:first-child { color: #fff; }
  .hst-v11__title span:last-child { color: rgba(255,255,255,0.6); }
  .hst-v11__rule {
    width: 40px; height: 1px; background: rgba(255,255,255,0.25); margin: 1rem 0;
  }
  .hst-v11__meta {
    display: flex; align-items: center; gap: 0.75rem; margin-top: 1.5rem;
    font-family: 'Share Tech Mono', monospace;
    font-size: 0.6rem; letter-spacing: 0.15em; color: rgba(255,255,255,0.4);
    text-transform: uppercase;
  }
  .hst-v11__sep { width: 10px; height: 1px; background: rgba(255,255,255,0.2); }
  .hst-v11__side-strip {
    position: absolute; right: 12px; top: 50%; transform: translateY(-50%);
    display: flex; flex-direction: column; gap: 6px; z-index: 10;
  }
  .hst-v11__side-thumb {
    width: 60px; height: 45px; border-radius: 3px; overflow: hidden;
    opacity: 0.35; transition: opacity 0.3s;
    border: 1px solid rgba(255,255,255,0.1);
  }
  .hst-v11__side-thumb:hover { opacity: 0.9; }
  .hst-v11__side-thumb img { width: 100%; height: 100%; object-fit: cover; }

  /* ===== V12 - DIAGONAL SPLIT ===== */
  .hst-v12 { background: #faf9f6; }
  .hst-v12__sticky {
    position: sticky; top: 0; height: 100vh; overflow: hidden;
  }
  .hst-v12__beige {
    position: absolute; inset: 0;
    background: #faf9f6;
    clip-path: polygon(0 0, 55% 0, 40% 100%, 0 100%);
    z-index: 2;
  }
  .hst-v12__image-half {
    position: absolute; inset: 0; z-index: 1;
  }
  .hst-v12__img-layer {
    position: absolute; inset: 0;
  }
  .hst-v12__img-layer img { width: 100%; height: 100%; object-fit: cover; }
  .hst-v12__content {
    position: absolute; top: 50%; left: 6%;
    translate: 0 -50%;
    z-index: 10; max-width: 40%;
  }
  .hst-v12__logo-wrap {
    position: absolute; top: 50%; left: 6%;
    z-index: 15;
    transform-origin: left center;
  }
  .hst-v12__meta {
    display: flex; align-items: center; gap: 0.75rem; margin-top: 1.5rem;
    font-family: 'Share Tech Mono', monospace;
    font-size: 0.6rem; letter-spacing: 0.15em; color: #999; text-transform: uppercase;
  }
  .hst-v12__dot { width: 3px; height: 3px; background: #ccc; border-radius: 50%; }
  .hst-v12__pips {
    position: absolute; bottom: 2rem; left: 50%;
    transform: translateX(-50%);
    display: flex; gap: 6px; z-index: 12;
  }
  .hst-v12__pip {
    width: 6px; height: 6px; border-radius: 50%;
    background: #999;
  }

  /* ===== V13 - BENTO GRID ===== */
  .hst-v13 { background: #faf9f6; padding: 8px; }
  .hst-v13__grid {
    display: grid;
    grid-template-columns: 2fr 1fr 1fr;
    grid-template-rows: 2fr 1fr 0.6fr;
    gap: 4px; height: calc(100vh - 16px);
  }
  .hst-v13__cell {
    overflow: hidden; border-radius: 4px; position: relative;
    opacity: 0; transform: scale(0.97);
    transition: opacity 0.6s ease, transform 0.6s cubic-bezier(0.16, 1, 0.3, 1);
  }
  .hst-v13__grid.visible .hst-v13__cell { opacity: 1; transform: scale(1); }
  .hst-v13__cell:nth-child(1) { transition-delay: 0.1s; }
  .hst-v13__cell:nth-child(2) { transition-delay: 0.2s; }
  .hst-v13__cell:nth-child(3) { transition-delay: 0.3s; }
  .hst-v13__cell:nth-child(4) { transition-delay: 0.25s; }
  .hst-v13__cell:nth-child(n+5) { transition-delay: 0.35s; }
  .hst-v13__cell--hero {
    grid-row: 1 / 3; grid-column: 1;
  }
  .hst-v13__cell--hero img { width: 100%; height: 100%; object-fit: cover; }
  .hst-v13__hero-overlay {
    position: absolute; inset: 0;
    background: linear-gradient(to top, rgba(0,0,0,0.3), transparent 40%);
  }
  .hst-v13__cell--title {
    grid-row: 1; grid-column: 2 / 4;
    display: flex; flex-direction: column;
    justify-content: flex-end; padding: 2rem;
    background: #faf9f6;
  }
  .hst-v13__title { margin: 0; line-height: 1; }
  .hst-v13__title span {
    display: block;
    font-size: clamp(2rem, 4vw, 3.5rem); font-weight: 700;
    text-transform: uppercase; letter-spacing: -0.02em;
  }
  .hst-v13__title span:first-child { color: #1a1a1a; }
  .hst-v13__title span:last-child { color: #4a4a4a; }
  .hst-v13__cell--desc {
    grid-row: 2; grid-column: 2;
    display: flex; flex-direction: column;
    justify-content: center; padding: 1.5rem;
    background: #f0efeb;
  }
  .hst-v13__meta {
    display: flex; align-items: center; gap: 0.5rem; margin-top: 0.75rem;
    font-family: 'Share Tech Mono', monospace;
    font-size: 0.6rem; letter-spacing: 0.1em; color: #999;
  }
  .hst-v13__cell--img2 {
    grid-row: 2; grid-column: 3;
  }
  .hst-v13__cell--img2 img { width: 100%; height: 100%; object-fit: cover; }
  .hst-v13__cell--thumb {
    grid-row: 3;
  }
  .hst-v13__cell--thumb img { width: 100%; height: 100%; object-fit: cover; }

  /* ===== V14 - REVEAL ===== */
  .hst-v14 { background: #000000; }
  .hst-v14__sticky { position: sticky; top: 0; height: 100vh; overflow: hidden; }
  .hst-v14__bg { position: absolute; inset: 0; z-index: 1; }
  .hst-v14__bg-inner { width: 100%; height: 100%; }
  .hst-v14__bg-inner img { width: 100%; height: 100%; object-fit: cover; }
  .hst-v14__overlay { position: absolute; inset: 0; background: rgba(0,0,0,0.6); z-index: 2; }
  .hst-v14__content {
    position: absolute; inset: 0;
    display: flex; flex-direction: column;
    align-items: center; justify-content: center;
    z-index: 10;
  }
  .hst-v14 .hst__word {
    text-shadow:
      -8px -8px 0 #faf9f6, 8px -8px 0 #faf9f6,
      -8px 8px 0 #faf9f6, 8px 8px 0 #faf9f6,
      0 -8px 0 #faf9f6, 0 8px 0 #faf9f6,
      -8px 0 0 #faf9f6, 8px 0 0 #faf9f6;
  }

  /* ===== V15 - MARQUEE ===== */
  .hst-v15 { background: #0a0a0a; }
  .hst-v15__bg { position: absolute; inset: 0; }
  .hst-v15__bg img { width: 100%; height: 100%; object-fit: cover; }
  .hst-v15__overlay { position: absolute; inset: 0; background: rgba(0,0,0,0.45); z-index: 1; }
  .hst-v15__marquee-wrap {
    position: absolute; top: 50%; left: 0; right: 0;
    transform: translateY(-50%); z-index: 10;
    overflow: hidden;
  }
  .hst-v15__marquee {
    white-space: nowrap;
  }
  .hst-v15__marquee span {
    display: inline-block;
    font-size: clamp(3rem, 8vw, 7rem); font-weight: 800;
    color: rgba(255,255,255,0.85); letter-spacing: 0.05em;
    text-transform: uppercase;
    animation: hstMarquee 30s linear infinite;
  }
  @keyframes hstMarquee {
    0% { transform: translateX(0); }
    100% { transform: translateX(-33.333%); }
  }
  .hst-v15__corner {
    position: absolute; z-index: 10; padding: 2rem;
  }
  .hst-v15__corner--tl { top: 0; left: 0; }
  .hst-v15__corner--br { bottom: 0; right: 0; }

  /* ===== V16 - LAYERED DEPTH ===== */
  .hst-v16 { background: #0a0a0a; }
  .hst-v16__sticky { position: sticky; top: 0; height: 100vh; overflow: hidden; }
  .hst-v16__bg { position: absolute; inset: 0; }
  .hst-v16__bg img { width: 100%; height: 100%; object-fit: cover; }
  .hst-v16__overlay { position: absolute; inset: 0; background: rgba(0,0,0,0.45); z-index: 1; }
  .hst-v16__mid {
    position: absolute; inset: 0;
    display: flex; align-items: center; justify-content: center;
    z-index: 5;
  }
  .hst-v16__title { margin: 0; text-align: center; line-height: 1; }
  .hst-v16__title span {
    display: block;
    font-size: clamp(4rem, 10vw, 8rem); font-weight: 800;
    text-transform: uppercase; letter-spacing: -0.02em;
  }
  .hst-v16__title span:first-child { color: #fff; }
  .hst-v16__title span:last-child { color: rgba(255,255,255,0.5); }
  .hst-v16__fg {
    position: absolute; bottom: 3rem; left: 5%; right: 5%;
    z-index: 10;
    display: flex; flex-direction: column; align-items: center; gap: 1.5rem;
  }
  .hst-v16__stats {
    display: flex; gap: 3rem;
  }
  .hst-v16__stats div {
    display: flex; flex-direction: column; align-items: center;
  }
  .hst-v16__stats strong {
    font-size: 1.8rem; font-weight: 700; color: #fff;
  }
  .hst-v16__stats span {
    font-size: 0.6rem; letter-spacing: 0.15em;
    text-transform: uppercase; color: rgba(255,255,255,0.5);
  }
  .hst-v16__meta {
    display: flex; align-items: center; gap: 0.75rem;
    font-family: 'Share Tech Mono', monospace;
    font-size: 0.6rem; letter-spacing: 0.15em;
    color: rgba(255,255,255,0.4); text-transform: uppercase;
  }

  /* ===== V17 - WINDOW PANE ===== */
  .hst-v17 { background: #faf9f6; }
  .hst-v17__image-layer {
    position: absolute; inset: 0; z-index: 0;
  }
  .hst-v17__image-layer img { width: 100%; height: 100%; object-fit: cover; }
  .hst-v17__mask {
    position: absolute; inset: 0; z-index: 2;
    background: #faf9f6;
    clip-path: polygon(
      0% 0%, 100% 0%, 100% 100%, 0% 100%,
      0% 30%, 8% 30%, 8% 78%, 92% 78%, 92% 30%, 0% 30%
    );
  }
  .hst-v17__top-text {
    position: absolute; top: 6%; left: 8%; z-index: 10;
  }
  .hst-v17 .hst__headline { align-items: flex-start; }
  .hst-v17__bottom-text {
    position: absolute; bottom: 6%; left: 8%; z-index: 10;
  }
  .hst-v17__meta {
    display: flex; align-items: center; gap: 0.75rem; margin-top: 0.75rem;
    font-family: 'Share Tech Mono', monospace;
    font-size: 0.6rem; letter-spacing: 0.15em; color: #999; text-transform: uppercase;
  }
  .hst-v17__dot { width: 3px; height: 3px; background: #ccc; border-radius: 50%; }

  /* ===== V18 - SPLIT DARK/LIGHT ===== */
  .hst-v18 { background: #faf9f6; }
  .hst-v18__left {
    position: absolute; top: 0; left: 0; bottom: 0; width: 50%;
    background: #0a0a0a; z-index: 1;
    display: flex; align-items: center; justify-content: flex-end;
  }
  .hst-v18__left-content { padding-right: 3rem; text-align: right; }
  .hst-v18__title-light {
    font-size: clamp(4rem, 10vw, 8rem); font-weight: 800;
    color: #fff; text-transform: uppercase; letter-spacing: -0.03em;
    line-height: 1; margin: 0 0 1rem;
  }
  .hst-v18__right {
    position: absolute; top: 0; right: 0; bottom: 0; width: 50%;
    background: #faf9f6; z-index: 1;
    display: flex; align-items: center; justify-content: flex-start;
  }
  .hst-v18__right-content { padding-left: 3rem; }
  .hst-v18__title-dark {
    font-size: clamp(4rem, 10vw, 8rem); font-weight: 800;
    color: #1a1a1a; text-transform: uppercase; letter-spacing: -0.03em;
    line-height: 1; margin: 0 0 1rem;
  }
  .hst-v18__image-strip {
    position: absolute; top: 50%; left: 50%; z-index: 5;
    transform: translate(-50%, -50%);
    width: 35%; height: 55%;
    overflow: hidden;
    box-shadow: 0 30px 80px rgba(0,0,0,0.25);
  }
  .hst-v18__image-strip img { width: 100%; height: 100%; object-fit: cover; }
  .hst-v18__grid-mix .hst__line--v { background: rgba(128,128,128,0.15); }
  .hst-v18__grid-mix .hst__line--h { background: rgba(128,128,128,0.15); }
  .hst-v18__footer {
    position: absolute; bottom: 0; left: 0; right: 0;
    display: flex; align-items: center; justify-content: center;
    gap: 1rem; padding: 1rem; z-index: 10;
    font-family: 'Share Tech Mono', monospace;
    font-size: 0.6rem; letter-spacing: 0.15em; color: #999; text-transform: uppercase;
  }
  .hst-v18__footer span { display: flex; align-items: center; gap: 0.4rem; }

  /* ===== V19 - TIMELINE ===== */
  .hst-v19 { background: #0a0a0a; }
  .hst-v19__bg { position: absolute; inset: 0; }
  .hst-v19__bg img { width: 100%; height: 100%; object-fit: cover; }
  .hst-v19__overlay { position: absolute; inset: 0; background: rgba(0,0,0,0.55); z-index: 1; }
  .hst-v19__top {
    position: absolute; top: 20%; left: 50%; transform: translateX(-50%);
    z-index: 10; text-align: center;
  }
  .hst-v19__title {
    font-size: clamp(2.5rem, 6vw, 5rem); font-weight: 800;
    color: #fff; letter-spacing: 0.08em; margin: 0;
  }
  .hst-v19__timeline {
    position: absolute; top: 50%; left: 8%; right: 8%;
    transform: translateY(-50%); z-index: 10;
    display: flex; justify-content: space-between;
    align-items: center;
  }
  .hst-v19__timeline-line {
    position: absolute; top: 50%; left: 0; right: 0;
    height: 1px; background: rgba(255,255,255,0.2);
    transform: translateY(-50%);
  }
  .hst-v19__milestone {
    display: flex; flex-direction: column; align-items: center;
    gap: 0.5rem; position: relative; z-index: 1;
  }
  .hst-v19__milestone-dot {
    width: 10px; height: 10px; border-radius: 50%;
    background: #fff; border: 2px solid rgba(255,255,255,0.3);
    box-shadow: 0 0 12px rgba(255,255,255,0.2);
  }
  .hst-v19__milestone-year {
    font-size: 1.1rem; font-weight: 700; color: #fff;
  }
  .hst-v19__milestone-label {
    font-size: 0.6rem; letter-spacing: 0.15em;
    text-transform: uppercase; color: rgba(255,255,255,0.5);
  }
  .hst-v19__bottom {
    position: absolute; bottom: 8%; left: 50%; transform: translateX(-50%);
    z-index: 10;
    display: flex; align-items: center; gap: 1rem;
    font-family: 'Share Tech Mono', monospace;
    font-size: 0.6rem; letter-spacing: 0.2em;
    color: rgba(255,255,255,0.4); text-transform: uppercase;
  }
  .hst-v19__bottom span { display: flex; align-items: center; gap: 0.4rem; }

  /* ===== V20 - CROP & REVEAL BANDS ===== */
  .hst-v20 { background: #faf9f6; position: relative; }
  .hst-v20__image-layer {
    position: absolute; inset: 0; z-index: 0;
  }
  .hst-v20__image-layer img { width: 100%; height: 100%; object-fit: cover; }
  .hst-v20__bands {
    position: absolute; inset: 0; z-index: 5;
    display: flex; flex-direction: column;
  }
  .hst-v20__band {
    flex: 1;
  }
  .hst-v20__band--solid {
    background: #faf9f6;
    display: flex; align-items: center; justify-content: center;
  }
  .hst-v20__band--open {
    background: transparent;
  }
  .hst-v20__band--text {
    z-index: 6;
  }
  .hst-v20__title {
    font-size: clamp(2rem, 5vw, 4rem); font-weight: 700;
    text-transform: uppercase; letter-spacing: 0.05em;
    color: #1a1a1a; margin: 0;
  }
  .hst-v20__text-row {
    display: flex; align-items: center; gap: 2rem;
  }
  .hst-v20__meta {
    display: flex; align-items: center; gap: 0.5rem;
    font-family: 'Share Tech Mono', monospace;
    font-size: 0.6rem; letter-spacing: 0.15em; color: #999; text-transform: uppercase;
  }
  .hst-v20__grid-over { z-index: 7; }
  .hst-v20__grid-over .hst__line { background: rgba(0,0,0,0.04); }

  /* ===== V21 - TEXT KNOCKOUT ===== */
  .hst-v21 { background: #0a0a0a; overflow: hidden; }
  .hst-v21__bg { position: absolute; inset: 0; }
  .hst-v21__bg img { width: 100%; height: 100%; object-fit: cover; }
  .hst-v21__mask {
    position: absolute; inset: 0; z-index: 5;
    display: flex; flex-direction: column;
  }
  .hst-v21__mask-top { flex: 1; background: #faf9f6; }
  .hst-v21__mask-mid {
    display: flex; align-items: center;
  }
  .hst-v21__mask-side { flex: 1; background: #faf9f6; }
  .hst-v21__knockout {
    font-family: 'Space Grotesk', sans-serif;
    font-size: clamp(15rem, 35vw, 30rem);
    font-weight: 900; line-height: 0.85; margin: 0;
    color: transparent;
    -webkit-text-stroke: 0px transparent;
    background: transparent;
    mix-blend-mode: screen;
  }
  .hst-v21__mask-bottom {
    flex: 1; background: #faf9f6;
    display: flex; flex-direction: column; align-items: center;
    justify-content: flex-start; padding-top: 2rem; gap: 1rem;
  }
  .hst-v21__sub {
    font-family: 'Space Grotesk', sans-serif;
    font-size: clamp(1.5rem, 3vw, 2.5rem);
    font-weight: 700; letter-spacing: 0.3em;
    text-transform: uppercase; color: #1a1a1a;
  }
  .hst-v21__meta-row {
    display: flex; align-items: center; gap: 0.75rem;
    font-family: 'Share Tech Mono', monospace;
    font-size: 0.6rem; letter-spacing: 0.15em;
    text-transform: uppercase; color: #999;
  }
  .hst-v21__sep { width: 20px; height: 1px; background: #e8e6e2; }
  .hst__scroll-prompt--light .hst__scroll-text { color: rgba(255,255,255,0.4); }
  .hst__scroll-prompt--light .hst__scroll-line { background: rgba(255,255,255,0.15); }
  .hst__scroll-prompt--light .hst__scroll-line span { background: rgba(255,255,255,0.4); }

  /* ===== V22 - POLAROID SCATTER ===== */
  .hst-v22 { background: #faf9f6; }
  .hst-v22__photos { position: absolute; inset: 0; z-index: 1; }
  .hst-v22__polaroid {
    position: absolute; background: #fff;
    padding: 8px 8px 30px 8px;
    box-shadow: 0 8px 30px rgba(0,0,0,0.12);
  }
  .hst-v22__polaroid img { width: 100%; height: auto; display: block; }
  .hst-v22__polaroid-label { height: 22px; }
  .hst-v22__center {
    position: absolute; top: 50%; left: 50%;
    transform: translate(-50%, -50%);
    z-index: 10; text-align: center;
    background: rgba(250,249,246,0.85);
    padding: 3rem 4rem; border-radius: 2px;
  }
  .hst-v22__title {
    font-family: 'Space Grotesk', sans-serif;
    font-size: clamp(2rem, 5vw, 4rem);
    font-weight: 700; text-transform: uppercase;
    letter-spacing: -0.02em; margin: 0.5rem 0;
    color: #1a1a1a;
  }

  /* ===== V23 - VERTICAL SPLIT SCROLL ===== */
  .hst-v23 { background: #0a0a0a; }
  .hst-v23__sticky { position: sticky; top: 0; height: 100vh; overflow: hidden; }
  .hst-v23__left, .hst-v23__right {
    position: absolute; top: -15%; width: 50%; height: 130%;
  }
  .hst-v23__left { left: 0; }
  .hst-v23__right { right: 0; }
  .hst-v23__left img, .hst-v23__right img {
    width: 100%; height: 100%; object-fit: cover;
  }
  .hst-v23__left-overlay {
    position: absolute; inset: 0;
    background: linear-gradient(to right, rgba(0,0,0,0.3), rgba(0,0,0,0.5));
  }
  .hst-v23__right-overlay {
    position: absolute; inset: 0;
    background: linear-gradient(to left, rgba(0,0,0,0.3), rgba(0,0,0,0.5));
  }
  .hst-v23__center {
    position: absolute; top: 50%; left: 50%;
    transform: translate(-50%, -50%); z-index: 10;
    text-align: center;
  }
  .hst-v23__title {
    font-family: 'Space Grotesk', sans-serif;
    font-size: clamp(3rem, 8vw, 7rem);
    font-weight: 800; color: #fff; text-transform: uppercase;
    letter-spacing: -0.02em; margin: 0.5rem 0; line-height: 0.95;
  }
  .hst-v23__meta {
    display: flex; align-items: center; justify-content: center;
    gap: 0.75rem; margin-top: 1rem;
    font-family: 'Share Tech Mono', monospace;
    font-size: 0.6rem; letter-spacing: 0.15em;
    text-transform: uppercase; color: rgba(255,255,255,0.4);
  }
  .hst-v23__sep { width: 20px; height: 1px; background: rgba(255,255,255,0.2); }

  /* ===== V24 - CIRCULAR FRAME ===== */
  .hst-v24 { background: #faf9f6; }
  .hst-v24__circle {
    position: absolute; top: 50%; left: 50%;
    transform: translate(-50%, -50%);
    width: 0; height: 0; border-radius: 50%;
    overflow: hidden; z-index: 5;
    transition: width 1s cubic-bezier(0.16, 1, 0.3, 1),
                height 1s cubic-bezier(0.16, 1, 0.3, 1);
  }
  .hst-v24__circle.active {
    width: min(50vw, 50vh); height: min(50vw, 50vh);
  }
  .hst-v24__circle img { width: 100%; height: 100%; object-fit: cover; }
  .hst-v24__text-top {
    position: absolute; top: 12%; left: 50%;
    transform: translateX(-50%); z-index: 10;
    text-align: center;
  }
  .hst-v24__text-left {
    position: absolute; top: 50%; left: 8%;
    transform: translateY(-50%); z-index: 10;
  }
  .hst-v24__text-right {
    position: absolute; top: 50%; right: 8%;
    transform: translateY(-50%); z-index: 10;
  }
  .hst-v24__title {
    font-family: 'Space Grotesk', sans-serif;
    font-size: clamp(3rem, 7vw, 6rem);
    font-weight: 800; color: #1a1a1a;
    text-transform: uppercase; letter-spacing: -0.02em;
    margin: 0; line-height: 1;
  }
  .hst-v24__bottom {
    position: absolute; bottom: 10%; left: 50%;
    transform: translateX(-50%); z-index: 10;
    display: flex; align-items: center; gap: 0.75rem;
    font-family: 'Share Tech Mono', monospace;
    font-size: 0.6rem; letter-spacing: 0.15em;
    text-transform: uppercase; color: #999;
  }
  .hst-v24__sep { width: 20px; height: 1px; background: #e8e6e2; }

  /* ===== V25 - MAGAZINE COVER ===== */
  .hst-v25 { background: #0a0a0a; overflow: hidden; }
  .hst-v25__cover-image { position: absolute; inset: 0; }
  .hst-v25__cover-image img { width: 100%; height: 100%; object-fit: cover; }
  .hst-v25__overlay {
    position: absolute; inset: 0;
    background: linear-gradient(to bottom,
      rgba(0,0,0,0.4) 0%,
      rgba(0,0,0,0.1) 40%,
      rgba(0,0,0,0.6) 100%
    ); z-index: 1;
  }
  .hst-v25__masthead {
    position: absolute; top: 5%; left: 50%;
    transform: translateX(-50%); z-index: 10;
    text-align: center; width: 80%;
  }
  .hst-v25__issue {
    display: flex; align-items: center; justify-content: center;
    gap: 1rem; margin-bottom: 1.5rem;
    font-family: 'Share Tech Mono', monospace;
    font-size: 0.55rem; letter-spacing: 0.25em;
    text-transform: uppercase; color: rgba(255,255,255,0.4);
  }
  .hst-v25__sep { width: 30px; height: 1px; background: rgba(255,255,255,0.2); }
  .hst-v25__logo {
    font-family: 'Space Grotesk', sans-serif;
    font-size: clamp(2.5rem, 7vw, 5rem);
    font-weight: 800; color: #fff; letter-spacing: 0.15em;
    text-transform: uppercase; margin: 0;
  }
  .hst-v25__tagline {
    font-family: 'Share Tech Mono', monospace;
    font-size: 0.6rem; letter-spacing: 0.2em;
    text-transform: uppercase; color: rgba(255,255,255,0.35);
    margin-top: 0.75rem;
  }
  .hst-v25__cover-lines {
    position: absolute; bottom: 15%; left: 6%; z-index: 10;
    display: flex; flex-direction: column; gap: 1.5rem;
  }
  .hst-v25__cover-line { display: flex; flex-direction: column; gap: 0.25rem; }
  .hst-v25__cl-label {
    font-family: 'Share Tech Mono', monospace;
    font-size: 0.5rem; letter-spacing: 0.2em;
    text-transform: uppercase; color: rgba(255,255,255,0.35);
  }
  .hst-v25__cl-text {
    font-size: 1rem; font-weight: 600; color: #fff;
    letter-spacing: 0.02em;
  }
  .hst-v25__barcode {
    position: absolute; bottom: 5%; right: 6%; z-index: 10;
    display: flex; flex-direction: column; align-items: flex-end; gap: 0.5rem;
  }
  .hst-v25__barcode-lines { display: flex; gap: 1px; }

  /* ===== V26 - GRID REVEAL ===== */
  .hst-v26 { background: #1a1a1a; }
  .hst-v26__image { position: absolute; inset: 0; z-index: 0; }
  .hst-v26__image img { width: 100%; height: 100%; object-fit: cover; }
  .hst-v26__grid-cells {
    position: absolute; inset: 0; z-index: 2;
    display: grid; grid-template-columns: repeat(5, 1fr);
    grid-template-rows: repeat(4, 1fr);
  }
  .hst-v26__cell {
    background: #1a1a1a;
    transition: background 0.4s ease, opacity 0.4s ease;
  }
  .hst-v26__cell.revealed { background: transparent; }
  .hst-v26__overlay {
    position: absolute; inset: 0; z-index: 3;
    background: rgba(0,0,0,0.3);
    pointer-events: none;
  }
  .hst-v26__content {
    position: absolute; top: 50%; left: 50%;
    transform: translate(-50%, -50%); z-index: 10;
    text-align: center;
    opacity: 0; transition: opacity 0.6s ease;
  }
  .hst-v26__content.active { opacity: 1; }
  .hst-v26__title {
    font-family: 'Space Grotesk', sans-serif;
    font-size: clamp(2.5rem, 6vw, 5rem);
    font-weight: 800; color: #fff; text-transform: uppercase;
    letter-spacing: -0.01em; margin: 0.5rem 0;
    text-shadow: 0 4px 20px rgba(0,0,0,0.3);
  }
  .hst-v26__meta {
    display: flex; align-items: center; justify-content: center;
    gap: 0.75rem; margin-top: 1rem;
    font-family: 'Share Tech Mono', monospace;
    font-size: 0.6rem; letter-spacing: 0.15em;
    text-transform: uppercase; color: rgba(255,255,255,0.5);
  }
  .hst-v26__sep { width: 20px; height: 1px; background: rgba(255,255,255,0.2); }

  /* ===== V27 - PANORAMIC ===== */
  .hst-v27 { background: #0a0a0a; }
  .hst-v27__sticky { position: sticky; top: 0; height: 100vh; overflow: hidden; }
  .hst-v27__panoramic {
    position: absolute; top: 0; left: 0;
    width: 150%; height: 100%;
  }
  .hst-v27__panoramic img { width: 100%; height: 100%; object-fit: cover; }
  .hst-v27__gradient {
    position: absolute; inset: 0;
    background: linear-gradient(to right,
      rgba(0,0,0,0.6) 0%, rgba(0,0,0,0.2) 40%, rgba(0,0,0,0.5) 100%
    );
    z-index: 1;
  }
  .hst-v27__content {
    position: absolute; top: 50%; left: 8%;
    transform: translateY(-50%); z-index: 10;
  }
  .hst-v27__title {
    font-family: 'Space Grotesk', sans-serif;
    font-size: clamp(2.5rem, 6vw, 5rem);
    font-weight: 800; color: #fff; text-transform: uppercase;
    letter-spacing: -0.01em; margin: 0.5rem 0;
  }
  .hst-v27__desc {
    color: rgba(255,255,255,0.5); font-size: 1rem;
    line-height: 1.7; margin: 0 0 1.5rem; max-width: 400px;
  }
  .hst-v27__meta {
    display: flex; align-items: center; gap: 0.75rem;
    font-family: 'Share Tech Mono', monospace;
    font-size: 0.6rem; letter-spacing: 0.15em;
    text-transform: uppercase; color: rgba(255,255,255,0.3);
  }
  .hst-v27__sep { width: 20px; height: 1px; background: rgba(255,255,255,0.2); }

  /* ===== V28 - LAYERED PAPER ===== */
  .hst-v28 { background: #f0efeb; }
  .hst-v28__stack {
    position: absolute; top: 50%; left: 50%;
    transform: translate(-50%, -50%);
    width: 80%; max-width: 900px;
    height: 65%;
  }
  .hst-v28__layer {
    position: absolute; border-radius: 4px;
    box-shadow: 0 8px 30px rgba(0,0,0,0.1);
  }
  .hst-v28__layer--back {
    top: 0; left: 5%; width: 55%; height: 85%;
    overflow: hidden; z-index: 1;
  }
  .hst-v28__layer--back img { width: 100%; height: 100%; object-fit: cover; }
  .hst-v28__layer--mid {
    top: 10%; right: 5%; width: 45%; height: 50%;
    background: #fff; z-index: 2;
    display: flex; align-items: center; justify-content: center;
  }
  .hst-v28__mid-content { padding: 2rem; }
  .hst-v28__stats { display: flex; gap: 2rem; }
  .hst-v28__stat {
    display: flex; flex-direction: column; align-items: center; gap: 0.25rem;
    font-family: 'Share Tech Mono', monospace;
    font-size: 0.6rem; letter-spacing: 0.1em; color: #999;
    text-transform: uppercase;
  }
  .hst-v28__stat-num {
    font-family: 'Space Grotesk', sans-serif;
    font-size: 2rem; font-weight: 700; color: #1a1a1a;
    letter-spacing: -0.02em;
  }
  .hst-v28__layer--front {
    bottom: 0; right: 10%; width: 50%;
    background: #faf9f6; z-index: 3;
    padding: 2.5rem; text-align: center;
  }
  .hst-v28__title {
    font-family: 'Space Grotesk', sans-serif;
    font-size: clamp(1.5rem, 3vw, 2.5rem);
    font-weight: 700; text-transform: uppercase;
    letter-spacing: -0.01em; margin: 0.5rem 0;
    color: #1a1a1a;
  }
  .hst-v28__meta {
    display: flex; align-items: center; justify-content: center;
    gap: 0.75rem; margin-top: 1rem;
    font-family: 'Share Tech Mono', monospace;
    font-size: 0.6rem; letter-spacing: 0.15em;
    text-transform: uppercase; color: #999;
  }
  .hst-v28__sep { width: 20px; height: 1px; background: #e8e6e2; }

  /* ===== V29 - MINIMAL TYPE ===== */
  .hst-v29 { background: #faf9f6; }
  .hst-v29__content {
    position: absolute; inset: 0; z-index: 10;
    display: flex; flex-direction: column;
    justify-content: center; align-items: flex-start;
    padding: 4rem 8%;
  }
  .hst-v29__top { margin-bottom: 2rem; }
  .hst-v29__title {
    margin: 0; line-height: 0.9;
  }
  .hst-v29__line-1 {
    display: block;
    font-family: 'Space Grotesk', sans-serif;
    font-size: clamp(6rem, 18vw, 16rem);
    font-weight: 900; color: #1a1a1a;
    text-transform: uppercase; letter-spacing: -0.03em;
  }
  .hst-v29__line-2 {
    display: flex; align-items: center;
    font-family: 'Space Grotesk', sans-serif;
    font-size: clamp(4rem, 12vw, 10rem);
    font-weight: 900; color: #1a1a1a;
    text-transform: uppercase; letter-spacing: -0.03em;
  }
  .hst-v29__inline-img {
    display: inline-block; width: clamp(80px, 12vw, 160px);
    height: clamp(50px, 8vw, 100px);
    border-radius: 100px; overflow: hidden;
    margin: 0 0.15em; vertical-align: middle;
  }
  .hst-v29__inline-img img { width: 100%; height: 100%; object-fit: cover; }
  .hst-v29__bottom {
    margin-top: 2rem;
    display: flex; align-items: center; gap: 2rem;
  }
  .hst-v29__desc {
    font-size: 1.1rem; color: #666; margin: 0;
  }
  .hst-v29__meta {
    display: flex; align-items: center; gap: 0.75rem;
    font-family: 'Share Tech Mono', monospace;
    font-size: 0.6rem; letter-spacing: 0.15em;
    text-transform: uppercase; color: #999;
  }
  .hst-v29__sep { width: 20px; height: 1px; background: #e8e6e2; }

  /* ===== V30 - FILM GRAIN / VINTAGE ===== */
  .hst-v30 { background: #0a0a0a; }
  .hst-v30__image { position: absolute; inset: 0; }
  .hst-v30__image img {
    width: 100%; height: 100%; object-fit: cover;
    filter: saturate(0.6) contrast(1.1);
  }
  .hst-v30__grain {
    position: absolute; inset: 0; z-index: 2;
    opacity: 0.15; mix-blend-mode: overlay;
    background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E");
    background-size: 128px 128px;
  }
  .hst-v30__vignette {
    position: absolute; inset: 0; z-index: 3;
    background: radial-gradient(ellipse at center, transparent 40%, rgba(0,0,0,0.6) 100%);
  }
  .hst-v30__overlay {
    position: absolute; inset: 0; z-index: 4;
    background: rgba(0,0,0,0.35);
  }
  .hst-v30__frame { position: absolute; inset: 5%; z-index: 5; }
  .hst-v30__frame-corner {
    position: absolute; width: 30px; height: 30px;
    border-color: rgba(255,255,255,0.25); border-style: solid;
  }
  .hst-v30__frame-corner--tl { top: 0; left: 0; border-width: 1px 0 0 1px; }
  .hst-v30__frame-corner--tr { top: 0; right: 0; border-width: 1px 1px 0 0; }
  .hst-v30__frame-corner--bl { bottom: 0; left: 0; border-width: 0 0 1px 1px; }
  .hst-v30__frame-corner--br { bottom: 0; right: 0; border-width: 0 1px 1px 0; }
  .hst-v30__content {
    position: absolute; top: 50%; left: 50%;
    transform: translate(-50%, -50%); z-index: 10;
    text-align: center;
  }
  .hst-v30__est {
    font-family: 'Share Tech Mono', monospace;
    font-size: 0.6rem; letter-spacing: 0.3em;
    text-transform: uppercase; color: rgba(255,255,255,0.4);
    margin-bottom: 1.5rem;
  }
  .hst-v30__title {
    font-family: Georgia, 'Times New Roman', serif;
    font-size: clamp(2.5rem, 7vw, 5.5rem);
    font-weight: 400; color: #fff; font-style: italic;
    margin: 0; letter-spacing: 0.02em;
  }
  .hst-v30__divider {
    width: 60px; height: 1px; background: rgba(255,255,255,0.25);
    margin: 1.5rem auto;
  }
  .hst-v30__sub {
    font-size: 0.85rem; letter-spacing: 0.15em;
    text-transform: uppercase; color: rgba(255,255,255,0.5);
    margin: 0;
  }
  .hst-v30__location {
    display: flex; align-items: center; justify-content: center;
    gap: 0.5rem; margin-top: 1rem;
    font-family: 'Share Tech Mono', monospace;
    font-size: 0.55rem; letter-spacing: 0.2em;
    text-transform: uppercase; color: rgba(255,255,255,0.3);
  }
  .hst-v30__bottom-bar {
    position: absolute; bottom: 5%; left: 0; right: 0; z-index: 10;
    display: flex; align-items: center; justify-content: space-between;
    padding: 0 6%;
  }
  .hst-v30__film-code {
    font-family: 'Share Tech Mono', monospace;
    font-size: 0.5rem; letter-spacing: 0.2em;
    text-transform: uppercase; color: rgba(255,255,255,0.25);
  }

  /* ===== V31 - GALLERY WALL ===== */
  .hst-v31 { background: #0d0d0d; }
  .hst-v31__wall { position: absolute; inset: 0; z-index: 1; }
  .hst-v31__frame {
    position: absolute; overflow: hidden;
    border: 1px solid rgba(200,170,110,0.15);
    box-shadow: 0 4px 20px rgba(0,0,0,0.4);
  }
  .hst-v31__frame img {
    width: 100%; height: 100%; object-fit: cover;
    filter: brightness(0.85) contrast(1.05);
    transition: filter 0.4s ease, transform 0.6s ease;
  }
  .hst-v31__frame:hover img {
    filter: brightness(1) contrast(1);
    transform: scale(1.03);
  }
  .hst-v31__brand {
    position: absolute; top: 50%; left: 50%;
    transform: translate(-50%, -50%); z-index: 20;
    text-align: center;
    background: rgba(13,13,13,0.7);
    backdrop-filter: blur(20px); -webkit-backdrop-filter: blur(20px);
    padding: 3rem 5rem; border-radius: 2px;
    border: 1px solid rgba(200,170,110,0.2);
  }
  .hst-v31__badge {
    font-family: 'Share Tech Mono', monospace;
    font-size: 0.5rem; letter-spacing: 0.35em;
    text-transform: uppercase; color: rgba(200,170,110,0.7);
    margin-bottom: 1rem;
  }
  .hst-v31__title {
    font-family: 'Space Grotesk', sans-serif;
    font-size: clamp(2rem, 5vw, 3.5rem);
    font-weight: 700; color: #fff; text-transform: uppercase;
    letter-spacing: 0.05em; margin: 0;
  }
  .hst-v31__divider {
    width: 50px; height: 1px; background: rgba(200,170,110,0.3);
    margin: 1.25rem auto;
  }
  .hst-v31__meta {
    display: flex; align-items: center; justify-content: center;
    gap: 0.5rem;
    font-family: 'Share Tech Mono', monospace;
    font-size: 0.55rem; letter-spacing: 0.15em;
    text-transform: uppercase; color: rgba(255,255,255,0.35);
  }

  /* ===== V32 - LIVING MOSAIC ===== */
  .hst-v32 { background: #0a0a0a; }
  .hst-v32__mosaic {
    position: absolute; inset: 0; z-index: 1;
    display: grid;
    grid-template-columns: repeat(5, 1fr);
    grid-template-rows: repeat(4, 1fr);
    gap: 3px;
  }
  .hst-v32__tile { overflow: hidden; position: relative; }
  .hst-v32__tile img {
    position: absolute; inset: 0;
    width: 100%; height: 100%; object-fit: cover;
  }
  .hst-v32__overlay {
    position: absolute; inset: 0; z-index: 5;
    background: rgba(0,0,0,0.55);
  }
  .hst-v32__content {
    position: absolute; top: 50%; left: 50%;
    transform: translate(-50%, -50%); z-index: 10;
    text-align: center;
  }
  .hst-v32__badge {
    font-family: 'Share Tech Mono', monospace;
    font-size: 0.5rem; letter-spacing: 0.35em;
    text-transform: uppercase; color: rgba(200,170,110,0.7);
    border: 1px solid rgba(200,170,110,0.25);
    padding: 6px 16px; display: inline-block;
    margin-bottom: 1.5rem;
  }
  .hst-v32__title {
    font-family: 'Space Grotesk', sans-serif;
    font-size: clamp(2.5rem, 7vw, 5rem);
    font-weight: 800; color: #fff; text-transform: uppercase;
    letter-spacing: 0.08em; margin: 0;
  }
  .hst-v32__sub {
    font-size: 1rem; color: rgba(255,255,255,0.5);
    letter-spacing: 0.1em; margin: 0.75rem 0 1.5rem;
  }
  .hst-v32__meta {
    display: flex; align-items: center; justify-content: center;
    gap: 1rem;
    font-family: 'Share Tech Mono', monospace;
    font-size: 0.55rem; letter-spacing: 0.15em;
    text-transform: uppercase; color: rgba(255,255,255,0.3);
  }
  .hst-v32__sep { width: 20px; height: 1px; background: rgba(255,255,255,0.15); }

  /* ===== V33 - HORIZONTAL EXHIBITION ===== */
  .hst-v33 { background: #0a0a0a; }
  .hst-v33__sticky {
    position: sticky; top: 0; height: 100vh;
    overflow: hidden; display: flex; flex-direction: column;
  }
  .hst-v33__header {
    padding: 2rem 4rem; text-align: center; z-index: 10;
    flex-shrink: 0;
  }
  .hst-v33__badge {
    font-family: 'Share Tech Mono', monospace;
    font-size: 0.5rem; letter-spacing: 0.35em;
    text-transform: uppercase; color: rgba(200,170,110,0.6);
    margin-bottom: 0.5rem;
  }
  .hst-v33__logo {
    font-family: 'Space Grotesk', sans-serif;
    font-size: clamp(1.5rem, 3vw, 2rem);
    font-weight: 700; color: #fff; letter-spacing: 0.15em;
    margin: 0;
  }
  .hst-v33__tagline {
    display: flex; align-items: center; justify-content: center;
    gap: 0.75rem; margin-top: 0.5rem;
    font-family: 'Share Tech Mono', monospace;
    font-size: 0.5rem; letter-spacing: 0.2em;
    text-transform: uppercase; color: rgba(255,255,255,0.3);
  }
  .hst-v33__sep { width: 20px; height: 1px; background: rgba(255,255,255,0.15); }
  .hst-v33__track {
    display: flex; gap: 3rem; flex: 1;
    align-items: center; padding: 0 4rem;
    width: max-content;
  }
  .hst-v33__exhibit { flex-shrink: 0; display: flex; flex-direction: column; gap: 1rem; }
  .hst-v33__exhibit-frame {
    width: 50vw; max-width: 700px; height: 55vh;
    overflow: hidden; border-radius: 2px;
    border: 1px solid rgba(255,255,255,0.08);
  }
  .hst-v33__exhibit-frame img { width: 100%; height: 100%; object-fit: cover; }
  .hst-v33__exhibit-label {
    display: flex; align-items: center; gap: 1rem;
  }
  .hst-v33__exhibit-num {
    font-family: 'Share Tech Mono', monospace;
    font-size: 0.6rem; color: rgba(255,255,255,0.2);
    letter-spacing: 0.1em;
  }
  .hst-v33__exhibit-caption {
    font-size: 0.75rem; color: rgba(255,255,255,0.5);
    letter-spacing: 0.05em;
  }
  .hst-v33__scroll-hint {
    position: absolute; bottom: 2rem; right: 4rem; z-index: 10;
    display: flex; align-items: center; gap: 0.75rem;
    font-family: 'Share Tech Mono', monospace;
    font-size: 0.55rem; letter-spacing: 0.15em;
    text-transform: uppercase; color: rgba(255,255,255,0.25);
  }

  /* ===== V34 - MEMBERS LOUNGE ===== */
  .hst-v34 { background: #080808; }
  .hst-v34__bg {
    position: absolute; inset: 0;
    background: radial-gradient(ellipse at 50% 30%, #1a1a1a 0%, #080808 70%);
  }
  .hst-v34__window {
    position: absolute; overflow: hidden;
    border-radius: 4px; border: 1px solid rgba(200,170,110,0.12);
    transition: border-color 0.4s ease, box-shadow 0.4s ease;
    cursor: pointer;
  }
  .hst-v34__window.active {
    border-color: rgba(200,170,110,0.35);
    box-shadow: 0 8px 40px rgba(200,170,110,0.08);
  }
  .hst-v34__window img { width: 100%; height: 100%; object-fit: cover; }
  .hst-v34__window-overlay {
    position: absolute; inset: 0;
    background: linear-gradient(to top, rgba(0,0,0,0.7), transparent 50%);
  }
  .hst-v34__window-label {
    position: absolute; bottom: 0.75rem; left: 0.75rem;
    font-family: 'Share Tech Mono', monospace;
    font-size: 0.5rem; letter-spacing: 0.2em;
    text-transform: uppercase; color: rgba(255,255,255,0.5);
  }
  .hst-v34__brand {
    position: absolute; top: 50%; left: 50%;
    transform: translate(-50%, -50%); z-index: 20;
    text-align: center;
    background: rgba(8,8,8,0.6);
    backdrop-filter: blur(30px); -webkit-backdrop-filter: blur(30px);
    padding: 2.5rem 4rem; border-radius: 2px;
    border: 1px solid rgba(200,170,110,0.15);
  }
  .hst-v34__crest {
    display: flex; align-items: center; gap: 1rem;
    justify-content: center; margin-bottom: 1rem;
  }
  .hst-v34__crest-line { width: 30px; height: 1px; background: rgba(200,170,110,0.3); }
  .hst-v34__crest-text {
    font-family: 'Share Tech Mono', monospace;
    font-size: 0.45rem; letter-spacing: 0.4em;
    text-transform: uppercase; color: rgba(200,170,110,0.7);
  }
  .hst-v34__title {
    font-family: 'Space Grotesk', sans-serif;
    font-size: clamp(1.5rem, 4vw, 2.5rem);
    font-weight: 700; color: #fff; text-transform: uppercase;
    letter-spacing: 0.08em; margin: 0;
  }
  .hst-v34__subtitle {
    font-family: 'Share Tech Mono', monospace;
    font-size: 0.5rem; letter-spacing: 0.2em;
    text-transform: uppercase; color: rgba(255,255,255,0.3);
    margin-top: 0.75rem;
  }

  /* ===== V35 - IMAGE CASCADE ===== */
  .hst-v35 { background: #0a0a0a; }
  .hst-v35__sticky { position: sticky; top: 0; height: 100vh; overflow: hidden; }
  .hst-v35__columns {
    position: absolute; inset: -20% 0;
    display: grid; grid-template-columns: repeat(4, 1fr);
    gap: 6px;
  }
  .hst-v35__column { display: flex; flex-direction: column; gap: 6px; }
  .hst-v35__img { overflow: hidden; }
  .hst-v35__img img {
    width: 100%; height: 200px; object-fit: cover; display: block;
    filter: brightness(0.7);
    transition: filter 0.4s ease;
  }
  .hst-v35__img:hover img { filter: brightness(1); }
  .hst-v35__gradient {
    position: absolute; inset: 0;
    background: radial-gradient(ellipse at center, rgba(0,0,0,0.6) 0%, rgba(0,0,0,0.3) 100%);
    z-index: 5;
  }
  .hst-v35__brand {
    position: absolute; top: 50%; left: 50%;
    transform: translate(-50%, -50%); z-index: 10;
    text-align: center;
  }
  .hst-v35__badge {
    font-family: 'Share Tech Mono', monospace;
    font-size: 0.5rem; letter-spacing: 0.35em;
    text-transform: uppercase; color: rgba(200,170,110,0.7);
    border: 1px solid rgba(200,170,110,0.25);
    padding: 6px 16px; display: inline-block;
    margin-bottom: 1.5rem;
  }
  .hst-v35__title {
    font-family: 'Space Grotesk', sans-serif;
    font-size: clamp(2.5rem, 7vw, 5rem);
    font-weight: 800; color: #fff; text-transform: uppercase;
    letter-spacing: 0.08em; margin: 0;
    text-shadow: 0 4px 30px rgba(0,0,0,0.5);
  }
  .hst-v35__meta {
    display: flex; align-items: center; justify-content: center;
    gap: 0.75rem; margin-top: 1rem;
    font-family: 'Share Tech Mono', monospace;
    font-size: 0.55rem; letter-spacing: 0.15em;
    text-transform: uppercase; color: rgba(255,255,255,0.35);
  }
  .hst-v35__sep { width: 20px; height: 1px; background: rgba(255,255,255,0.15); }

  /* ===== V36 - ROTATING SHOWCASE ===== */
  .hst-v36 { background: #0d0d0d; }
  .hst-v36__orbit {
    position: absolute; top: 50%; left: 50%;
    transform: translate(-50%, -50%); z-index: 5;
    width: 1px; height: 1px;
  }
  .hst-v36__orbit-thumb {
    position: absolute; width: 60px; height: 60px;
    border-radius: 4px; overflow: hidden; cursor: pointer;
    border: 1px solid rgba(200,170,110,0.15);
    transition: border-color 0.3s ease, box-shadow 0.3s ease;
    opacity: 0.6;
  }
  .hst-v36__orbit-thumb.active {
    border-color: rgba(200,170,110,0.5);
    box-shadow: 0 0 15px rgba(200,170,110,0.15);
    opacity: 1;
  }
  .hst-v36__orbit-thumb img { width: 100%; height: 100%; object-fit: cover; }
  .hst-v36__center {
    position: absolute; top: 50%; left: 50%;
    transform: translate(-50%, -50%); z-index: 10;
    width: min(35vw, 35vh); height: min(35vw, 35vh);
    border-radius: 50%; overflow: hidden;
    border: 2px solid rgba(200,170,110,0.2);
    box-shadow: 0 0 80px rgba(0,0,0,0.5);
  }
  .hst-v36__center-image { position: absolute; inset: 0; }
  .hst-v36__center-image img { width: 100%; height: 100%; object-fit: cover; }
  .hst-v36__brand {
    position: absolute; bottom: 10%; left: 50%;
    transform: translateX(-50%); z-index: 15;
    text-align: center;
  }
  .hst-v36__badge {
    font-family: 'Share Tech Mono', monospace;
    font-size: 0.45rem; letter-spacing: 0.35em;
    text-transform: uppercase; color: rgba(200,170,110,0.6);
    margin-bottom: 0.5rem;
  }
  .hst-v36__title {
    font-family: 'Space Grotesk', sans-serif;
    font-size: clamp(1.5rem, 3vw, 2rem);
    font-weight: 700; color: #fff; letter-spacing: 0.1em;
    text-transform: uppercase; margin: 0;
  }
  .hst-v36__meta {
    display: flex; align-items: center; justify-content: center;
    gap: 0.75rem; margin-top: 0.5rem;
    font-family: 'Share Tech Mono', monospace;
    font-size: 0.5rem; letter-spacing: 0.15em;
    text-transform: uppercase; color: rgba(255,255,255,0.25);
  }
  .hst-v36__sep { width: 15px; height: 1px; background: rgba(255,255,255,0.15); }

  /* ===== V37 - SPLIT PANELS ===== */
  .hst-v37 { background: #0a0a0a; padding: 0; }
  .hst-v37__panels {
    position: absolute; inset: 0;
    display: flex; z-index: 1;
  }
  .hst-v37__panel {
    position: relative; overflow: hidden;
    transition: flex 0.6s cubic-bezier(0.16, 1, 0.3, 1);
    cursor: pointer;
  }
  .hst-v37__panel img {
    position: absolute; inset: 0;
    width: 100%; height: 100%; object-fit: cover;
    transition: transform 0.6s ease;
  }
  .hst-v37__panel.active img { transform: scale(1.05); }
  .hst-v37__panel-overlay {
    position: absolute; inset: 0;
    background: linear-gradient(to top, rgba(0,0,0,0.8) 0%, rgba(0,0,0,0.2) 50%, rgba(0,0,0,0.4) 100%);
    transition: background 0.4s ease;
  }
  .hst-v37__panel.dimmed .hst-v37__panel-overlay {
    background: rgba(0,0,0,0.7);
  }
  .hst-v37__panel-content {
    position: absolute; bottom: 2rem; left: 50%;
    transform: translateX(-50%); z-index: 5;
    text-align: center; white-space: nowrap;
  }
  .hst-v37__panel-num {
    font-family: 'Share Tech Mono', monospace;
    font-size: 0.6rem; color: rgba(200,170,110,0.5);
    letter-spacing: 0.15em; display: block; margin-bottom: 0.5rem;
  }
  .hst-v37__panel-label {
    font-family: 'Space Grotesk', sans-serif;
    font-size: 1rem; font-weight: 700; color: #fff;
    text-transform: uppercase; letter-spacing: 0.1em;
    margin: 0 0 0.25rem;
  }
  .hst-v37__panel-sub {
    font-family: 'Share Tech Mono', monospace;
    font-size: 0.45rem; letter-spacing: 0.15em;
    text-transform: uppercase; color: rgba(255,255,255,0.35);
  }
  .hst-v37__brand {
    position: absolute; top: 50%; left: 50%;
    transform: translate(-50%, -50%); z-index: 20;
    text-align: center;
    background: rgba(0,0,0,0.5);
    backdrop-filter: blur(25px); -webkit-backdrop-filter: blur(25px);
    padding: 2rem 4rem;
    border: 1px solid rgba(200,170,110,0.15);
    pointer-events: none;
  }
  .hst-v37__badge {
    font-family: 'Share Tech Mono', monospace;
    font-size: 0.4rem; letter-spacing: 0.4em;
    text-transform: uppercase; color: rgba(200,170,110,0.7);
    margin-bottom: 0.5rem;
  }
  .hst-v37__logo {
    font-family: 'Space Grotesk', sans-serif;
    font-size: clamp(1.5rem, 3vw, 2.5rem);
    font-weight: 700; color: #fff; letter-spacing: 0.12em;
    margin: 0;
  }
  .hst-v37__meta {
    display: flex; align-items: center; justify-content: center;
    gap: 0.75rem; margin-top: 0.5rem;
    font-family: 'Share Tech Mono', monospace;
    font-size: 0.45rem; letter-spacing: 0.15em;
    text-transform: uppercase; color: rgba(255,255,255,0.25);
  }
  .hst-v37__sep { width: 15px; height: 1px; background: rgba(255,255,255,0.15); }

  /* ===== V38 - FILM REEL ===== */
  .hst-v38 {
    background: #080808;
    display: flex; flex-direction: column;
    justify-content: center; padding: 0;
  }
  .hst-v38__reel { overflow: hidden; }
  .hst-v38__reel--top { }
  .hst-v38__reel--bottom { }
  .hst-v38__strip {
    display: flex; gap: 6px; width: max-content;
  }
  .hst-v38__strip--left {
    animation: hst-reel-left 40s linear infinite;
  }
  .hst-v38__strip--right {
    animation: hst-reel-right 45s linear infinite;
  }
  @keyframes hst-reel-left {
    0% { transform: translateX(0); }
    100% { transform: translateX(-50%); }
  }
  @keyframes hst-reel-right {
    0% { transform: translateX(-50%); }
    100% { transform: translateX(0); }
  }
  .hst-v38__film-frame {
    flex-shrink: 0; width: 180px; height: 120px;
    overflow: hidden; border-radius: 2px;
    border: 1px solid rgba(255,255,255,0.06);
  }
  .hst-v38__film-frame img {
    width: 100%; height: 100%; object-fit: cover;
    filter: brightness(0.7);
  }
  .hst-v38__center {
    padding: 3rem 2rem; text-align: center; z-index: 10;
  }
  .hst-v38__badge {
    font-family: 'Share Tech Mono', monospace;
    font-size: 0.5rem; letter-spacing: 0.35em;
    text-transform: uppercase; color: rgba(200,170,110,0.7);
    border: 1px solid rgba(200,170,110,0.2);
    padding: 6px 16px; display: inline-block;
    margin-bottom: 1.5rem;
  }
  .hst-v38__title {
    font-family: 'Space Grotesk', sans-serif;
    font-size: clamp(2rem, 5vw, 3.5rem);
    font-weight: 800; color: #fff; text-transform: uppercase;
    letter-spacing: 0.1em; margin: 0;
  }
  .hst-v38__divider {
    width: 50px; height: 1px; background: rgba(200,170,110,0.3);
    margin: 1rem auto;
  }
  .hst-v38__sub {
    font-size: 0.85rem; color: rgba(255,255,255,0.4);
    letter-spacing: 0.15em; text-transform: uppercase; margin: 0 0 1rem;
  }
  .hst-v38__meta {
    display: flex; align-items: center; justify-content: center;
    gap: 0.75rem;
    font-family: 'Share Tech Mono', monospace;
    font-size: 0.5rem; letter-spacing: 0.15em;
    text-transform: uppercase; color: rgba(255,255,255,0.25);
  }
  .hst-v38__sep { width: 20px; height: 1px; background: rgba(255,255,255,0.1); }

  /* ===== V39 - CARD FAN ===== */
  .hst-v39 { background: #0a0a0a; }
  .hst-v39__fan {
    position: absolute; bottom: 20%; left: 50%;
    transform: translateX(-50%); z-index: 10;
    display: flex; justify-content: center;
    width: 1px; height: 1px;
  }
  .hst-v39__card {
    position: absolute; bottom: 0;
    width: 140px; height: 200px;
    border-radius: 8px; overflow: hidden;
    cursor: pointer;
    border: 1px solid rgba(200,170,110,0.15);
    box-shadow: 0 8px 30px rgba(0,0,0,0.4);
    transition: box-shadow 0.4s ease;
  }
  .hst-v39__card.active {
    border-color: rgba(200,170,110,0.4);
    box-shadow: 0 15px 50px rgba(0,0,0,0.6), 0 0 20px rgba(200,170,110,0.1);
  }
  .hst-v39__card img { width: 100%; height: 100%; object-fit: cover; }
  .hst-v39__card-label {
    position: absolute; bottom: 0; left: 0; right: 0;
    background: linear-gradient(to top, rgba(0,0,0,0.8), transparent);
    padding: 2rem 0.75rem 0.75rem;
    font-family: 'Share Tech Mono', monospace;
    font-size: 0.5rem; letter-spacing: 0.15em;
    text-transform: uppercase; color: rgba(255,255,255,0.6);
  }
  .hst-v39__brand {
    position: absolute; top: 12%; left: 50%;
    transform: translateX(-50%); z-index: 15;
    text-align: center;
  }
  .hst-v39__badge {
    font-family: 'Share Tech Mono', monospace;
    font-size: 0.45rem; letter-spacing: 0.4em;
    text-transform: uppercase; color: rgba(200,170,110,0.7);
    border: 1px solid rgba(200,170,110,0.2);
    padding: 5px 14px; display: inline-block;
    margin-bottom: 1.25rem;
  }
  .hst-v39__title {
    font-family: 'Space Grotesk', sans-serif;
    font-size: clamp(2rem, 5vw, 3.5rem);
    font-weight: 700; color: #fff; text-transform: uppercase;
    letter-spacing: 0.08em; margin: 0;
  }
  .hst-v39__meta {
    display: flex; align-items: center; justify-content: center;
    gap: 0.75rem; margin-top: 0.75rem;
    font-family: 'Share Tech Mono', monospace;
    font-size: 0.45rem; letter-spacing: 0.15em;
    text-transform: uppercase; color: rgba(255,255,255,0.25);
  }
  .hst-v39__sep { width: 15px; height: 1px; background: rgba(255,255,255,0.1); }

  /* ===== V40 - FROSTED GRID ===== */
  .hst-v40 { background: #0a0a0a; }
  .hst-v40__image-grid {
    position: absolute; inset: 0; z-index: 1;
    display: grid;
    grid-template-columns: repeat(6, 1fr);
    grid-template-rows: repeat(4, 1fr);
    gap: 2px;
  }
  .hst-v40__grid-cell { overflow: hidden; }
  .hst-v40__grid-cell img { width: 100%; height: 100%; object-fit: cover; }
  .hst-v40__frost {
    position: absolute; inset: 0; z-index: 5;
    background: rgba(10,10,10,0.65);
    backdrop-filter: blur(8px) saturate(0.8);
    -webkit-backdrop-filter: blur(8px) saturate(0.8);
  }
  .hst-v40__content {
    position: absolute; top: 50%; left: 50%;
    transform: translate(-50%, -50%); z-index: 20;
    text-align: center;
  }
  .hst-v40__badge {
    font-family: 'Share Tech Mono', monospace;
    font-size: 0.5rem; letter-spacing: 0.35em;
    text-transform: uppercase; color: rgba(200,170,110,0.7);
    border: 1px solid rgba(200,170,110,0.25);
    padding: 6px 16px; display: inline-block;
    margin-bottom: 1.5rem;
  }
  .hst-v40__title {
    font-family: 'Space Grotesk', sans-serif;
    font-size: clamp(3rem, 8vw, 6rem);
    font-weight: 800; color: #fff; text-transform: uppercase;
    letter-spacing: 0.12em; margin: 0;
    -webkit-text-stroke: 1px rgba(200,170,110,0.15);
  }
  .hst-v40__divider {
    width: 60px; height: 1px; background: rgba(200,170,110,0.3);
    margin: 1.5rem auto;
  }
  .hst-v40__sub {
    font-size: 0.85rem; color: rgba(255,255,255,0.4);
    letter-spacing: 0.15em; text-transform: uppercase; margin: 0 0 1.25rem;
  }
  .hst-v40__meta {
    display: flex; align-items: center; justify-content: center;
    gap: 0.75rem;
    font-family: 'Share Tech Mono', monospace;
    font-size: 0.5rem; letter-spacing: 0.15em;
    text-transform: uppercase; color: rgba(255,255,255,0.25);
  }
  .hst-v40__sep { width: 20px; height: 1px; background: rgba(255,255,255,0.1); }
  .hst-v40__clear-zone {
    position: absolute; top: 15%; left: 10%; right: 10%; bottom: 15%;
    z-index: 8;
    border: 1px solid rgba(200,170,110,0.08);
    backdrop-filter: blur(0px);
    -webkit-backdrop-filter: blur(0px);
    background: rgba(10,10,10,0.2);
  }


  /* ===== RESPONSIVE ===== */
  @media (max-width: 768px) {
    .hst-v1__image { width: 0; display: none; }
    .hst-v1__center { left: 2rem; right: 2rem; }
    .hst-v5__layout { grid-template-columns: 1fr; }
    .hst-v5__image { height: 40vh; }
    .hst-v5__content { padding: 2rem; }
    .hst-v6__image-block { width: 100%; }
    .hst-v6__text-block { max-width: 90%; background: rgba(250,249,246,0.85); padding: 2rem; translate: 0 -50%; }
    .hst-v7__layout { grid-template-columns: 1fr; }
    .hst-v7__image { height: 40vh; }
    .hst-v7__content { padding: 2rem; }
    .hst-v4__columns {
      grid-template-columns: 1fr;
      grid-template-rows: auto 30vh auto 30vh auto;
    }
    .hst-v4__col--label { height: 50px; }
    .hst-v4__vert-label { writing-mode: horizontal-tb; }
    .hst-v3__left { width: 100%; padding: 2rem; }
    .hst-v3__frame { position: relative; top: auto; right: auto; bottom: auto; left: auto; height: 50vh; margin-top: 1rem; }
    .hst-v11__card { left: 3%; padding: 2rem; }
    .hst-v11__side-strip { display: none; }
    .hst-v12__content { left: 4%; max-width: 55%; }
    .hst-v12__logo-wrap { left: 4%; }
    .hst-v13__grid { grid-template-columns: 1fr 1fr; grid-template-rows: 1.5fr 1fr 1fr 0.5fr; }
    .hst-v13__cell--hero { grid-column: 1 / 3; }
    .hst-v13__cell--title { grid-column: 1 / 3; }
    .hst-v18__left, .hst-v18__right { width: 100%; position: relative; height: 50vh; }
    .hst-v18__image-strip { width: 60%; height: 40%; }
    .hst-v19__timeline { flex-wrap: wrap; gap: 1rem; justify-content: center; }
    .hst-v19__timeline-line { display: none; }
    .hst-v22__center { padding: 2rem; width: 80%; }
    .hst-v22__polaroid { width: 35% !important; }
    .hst-v24__text-left, .hst-v24__text-right { display: none; }
    .hst-v24__circle.active { width: 70vw; height: 70vw; }
    .hst-v25__cover-lines { bottom: 20%; }
    .hst-v28__stack { width: 90%; height: 70%; }
    .hst-v28__layer--back { width: 90%; left: 5%; }
    .hst-v28__layer--mid { width: 80%; right: 10%; }
    .hst-v28__layer--front { width: 80%; right: 10%; }
    .hst-v28__stats { gap: 1rem; }
    .hst-v29__line-1 { font-size: clamp(4rem, 15vw, 8rem); }
    .hst-v29__line-2 { font-size: clamp(2.5rem, 10vw, 5rem); }
    .hst-v29__bottom { flex-direction: column; gap: 1rem; }
    .hst-v31__brand { padding: 2rem 2.5rem; }
    .hst-v32__mosaic { grid-template-columns: repeat(3, 1fr); grid-template-rows: repeat(7, 1fr); }
    .hst-v33__exhibit-frame { width: 80vw; height: 45vh; }
    .hst-v34__window { width: 45% !important; height: 25% !important; }
    .hst-v34__brand { padding: 1.5rem 2rem; }
    .hst-v35__columns { grid-template-columns: repeat(2, 1fr); }
    .hst-v36__orbit-thumb { width: 40px; height: 40px; }
    .hst-v36__center { width: min(60vw, 60vh); height: min(60vw, 60vh); }
    .hst-v37__panels { flex-direction: column; }
    .hst-v37__panel-content { bottom: 1rem; }
    .hst-v37__brand { padding: 1.5rem 2rem; }
    .hst-v38__film-frame { width: 130px; height: 90px; }
    .hst-v39__card { width: 100px; height: 150px; }
    .hst-v40__image-grid { grid-template-columns: repeat(4, 1fr); grid-template-rows: repeat(6, 1fr); }
  }
`;

export default HeroSectionTest;

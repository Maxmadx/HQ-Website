/**
 * AIRCRAFT R22 PAGE - Robinson R22 Helicopter
 *
 * Comprehensive page showcasing the Robinson R22, the world's most popular training helicopter.
 * Features Captain Quentin Smith's World Helicopter Championship achievement.
 *
 * Brand: Luxury Minimal Aviation
 * Typography: Space Grotesk (headlines) + Share Tech Mono (technical data)
 * Colors: #faf9f6 (warm white), #1a1a1a (charcoal), #4a4a4a (mid), #7a7a7a (light)
 */

import React, { useRef, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, useInView, useScroll, useTransform, AnimatePresence, LayoutGroup } from 'framer-motion';
import { usePageImages } from '../hooks/usePageImages';
import { useCmsHighlight } from '../hooks/useCmsHighlight';
import { SECTION_MAP } from '../lib/imageSections';

// Import styles
import '../assets/css/main.css';
import '../assets/css/components.css';

// Import FooterMinimal component
import FooterMinimal from '../components/FooterMinimal';
import HqMenuPanel from '../components/HqMenuPanel';
import AircraftPriceBlock from '../components/AircraftPriceBlock';
import { getSubtypes } from '../config/aircraftCatalog';

// ============================================================================
// R22 HEADER COMPONENT
// ============================================================================
function R22Header() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [colorDark, setColorDark] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [verticalProgress, setVerticalProgress] = useState(0);
  const [horizontalProgress, setHorizontalProgress] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY;
      const vProgress = Math.min(scrollY / 150, 1);
      setVerticalProgress(vProgress);
      const hProgress = Math.min(scrollY / 300, 1);
      setHorizontalProgress(hProgress);
      setColorDark(scrollY > 300);
      setScrolled(scrollY > 300);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape') setMenuOpen(false);
    };
    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, []);

  const toggleMenu = () => setMenuOpen(!menuOpen);
  const closeMenu = () => setMenuOpen(false);

  const spotlightHeight = 95 + Math.round(verticalProgress * 405);
  const spotlightWidth = 214 + Math.round(horizontalProgress * 1786);

  return (
    <>
      <HqMenuPanel open={menuOpen} onClose={closeMenu} />

      <button
        className={`hq-menu-btn ${colorDark ? 'color-dark' : ''} ${scrolled ? 'scrolled' : ''} ${menuOpen ? 'open' : ''}`}
        onClick={toggleMenu}
        aria-label="Toggle menu"
        aria-expanded={menuOpen}
      >
        <span></span>
        <span></span>
        <span></span>
      </button>

      <header
        className={`Header Header--top ${scrolled ? 'Header--scrolled' : ''}`}
        style={{
          '--spotlight-width': `${spotlightWidth}px`,
          '--spotlight-height': `${spotlightHeight}px`
        }}
      >
        <div className="Header-inner Header-inner--top" data-nc-group="top">
          <div data-nc-container="top-left"></div>
          <div data-nc-container="top-center">
            <Link to="/" className="Header-branding" data-nc-element="branding">
              <img
                src="/assets/images/logos/hq/hq-aviation-logo-black.png"
                alt="HQ Aviation"
                className="Header-branding-logo"
                loading="lazy"
              />
            </Link>
            <nav className="Header-nav Header-nav--secondary" data-nc-element="secondary-nav">
              <div className="Header-nav-inner">
                <Link to="/fleet" className="Header-nav-item">Fleet</Link>
                <Link to="/training" className="Header-nav-item">Training</Link>
                <Link to="/expeditions" className="Header-nav-item">Expeditions</Link>
              </div>
            </nav>
          </div>
          <div data-nc-container="top-right"></div>
        </div>
      </header>
    </>
  );
}

// ============================================================================
// REVEAL ANIMATION WRAPPER
// ============================================================================
function Reveal({ children, delay = 0, direction = 'up' }) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.2 });

  const variants = {
    hidden: {
      opacity: 0,
      y: direction === 'up' ? 40 : direction === 'down' ? -40 : 0,
      x: direction === 'left' ? 40 : direction === 'right' ? -40 : 0,
    },
    visible: {
      opacity: 1,
      y: 0,
      x: 0,
    },
  };

  return (
    <motion.div
      ref={ref}
      initial="hidden"
      animate={isInView ? 'visible' : 'hidden'}
      variants={variants}
      transition={{ duration: 0.8, delay, ease: [0.16, 1, 0.3, 1] }}
    >
      {children}
    </motion.div>
  );
}

// ============================================================================
// ANIMATED NUMBER COMPONENT
// ============================================================================
function AnimatedNumber({ value, suffix = '', prefix = '' }) {
  const [count, setCount] = useState(0);
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });

  useEffect(() => {
    if (isInView) {
      const num = parseInt(value.toString().replace(/[^0-9]/g, ''));
      const duration = 2000;
      const steps = 60;
      const increment = num / steps;
      let current = 0;
      const timer = setInterval(() => {
        current += increment;
        if (current >= num) {
          setCount(num);
          clearInterval(timer);
        } else {
          setCount(Math.floor(current));
        }
      }, duration / steps);
      return () => clearInterval(timer);
    }
  }, [isInView, value]);

  return <span ref={ref}>{prefix}{count.toLocaleString()}{suffix}</span>;
}

// ============================================================================
// PARALLAX IMAGE COMPONENT
// ============================================================================
function ParallaxImage({ src, alt, speed = 0.5 }) {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start end', 'end start'],
  });

  const y = useTransform(scrollYProgress, [0, 1], ['-10%', '10%']);

  return (
    <div ref={ref} className="r22-parallax-container">
      <motion.img
        src={src}
        alt={alt}
        style={{ y }}
        className="r22-parallax-image"
      />
    </div>
  );
}


// ============================================================================
// R22 HIGHLIGHTS DATA
// ============================================================================
const R22_HIGHLIGHTS = [
  { label: 'Seats', value: '2' },
  { label: 'MTOW', value: '1,370 lb' },
  { label: 'Cruise', value: '96 kts' },
  { label: 'Built since 1979', value: '4,800+' },
];

const R22_VARIANT_DATA = [
  {
    id: 'alpha',
    key: 'alpha',
    name: 'Alpha',
    subtitle: 'Original Production',
    tagline: 'Where it all began.',
    image: '/assets/images/new-aircraft/r22/r22-beta-ii-left.png',
    useCases: ['Heritage airframe', 'Club fleets'],
    years: '1979–1981',
    engine: 'Lycoming O-320-A2C, 150 HP',
    fuelSystem: 'Carbureted',
    power: '124 HP / 104 HP cont.',
    vne: '102 kts',
    cruise: '96 kts',
    range: '180 nm',
    mtow: '1,300 lb',
    usefulLoad: '450 lb',
    hoverIge: '9,400 ft',
    rotorDia: '25 ft 2 in',
    fuel: '19.2 US gal',
    seats: '2',
    floats: 'Skids',
    landingGear: 'Skids',
    notable: 'Inaugural production model',
  },
  {
    id: 'beta',
    key: 'beta',
    name: 'Beta',
    subtitle: 'Carbureted Upgrade',
    tagline: 'The workhorse trainer.',
    image: '/assets/images/new-aircraft/r22/r22-beta-ii-left.png',
    useCases: ['Ab-initio PPL training', 'Hour building'],
    years: '1985–1995',
    engine: 'Lycoming O-320-B2C, 160 HP',
    fuelSystem: 'Carbureted',
    power: '160 HP / 124 HP cont.',
    vne: '102 kts',
    cruise: '96 kts',
    range: '200 nm',
    mtow: '1,370 lb',
    usefulLoad: '490 lb',
    hoverIge: '9,400 ft',
    rotorDia: '25 ft 2 in',
    fuel: '19.2 US gal',
    seats: '2',
    floats: 'Skids',
    landingGear: 'Skids',
    notable: 'Uprated engine, longer TBO',
  },
  {
    id: 'beta-ii',
    key: 'beta-ii',
    name: 'Beta II',
    subtitle: 'Current Production',
    tagline: 'The benchmark piston trainer.',
    image: '/assets/images/new-aircraft/r22/r22-beta-ii-left.png',
    useCases: ['Flight schools', 'Private PPL', 'Type-rating machine'],
    years: '1995–present',
    engine: 'Lycoming O-360-J2A, 145 HP cont.',
    fuelSystem: 'Carbureted',
    power: '145 HP / 131 HP cont.',
    vne: '102 kts',
    cruise: '96 kts',
    range: '200 nm',
    mtow: '1,370 lb',
    usefulLoad: '490 lb',
    hoverIge: '9,400 ft',
    rotorDia: '25 ft 2 in',
    fuel: '19.2 US gal',
    seats: '2',
    floats: 'Skids',
    landingGear: 'Skids',
    notable: '2,200-hour TBO; Robinson Safety Course',
  },
  {
    id: 'mariner',
    key: 'mariner',
    name: 'Mariner',
    subtitle: 'Amphibious Variant',
    tagline: 'The R22, now with floats.',
    image: '/assets/images/new-aircraft/r22/r22-beta-ii-left.png',
    useCases: ['Over-water', 'Shoreline ops'],
    years: '1983–present',
    engine: 'Lycoming O-360-J2A, 145 HP cont.',
    fuelSystem: 'Carbureted',
    power: '145 HP / 131 HP cont.',
    vne: '102 kts',
    cruise: '96 kts',
    range: '220 nm',
    mtow: '1,370 lb',
    usefulLoad: 'Varies w/ floats',
    hoverIge: '9,400 ft',
    rotorDia: '25 ft 2 in',
    fuel: '19.2 US gal',
    seats: '2',
    floats: 'Pop-out floats',
    landingGear: 'Pop-out floats',
    notable: 'Factory-float option, emergency deploy',
  },
];

const R22_COMPARISON_COLUMNS = [
  { key: 'alpha',   name: 'Alpha',   tag: 'Original',   image: '/assets/images/new-aircraft/r22/r22-beta-ii-left.png' },
  { key: 'beta',    name: 'Beta',    tag: 'Carbureted', image: '/assets/images/new-aircraft/r22/r22-beta-ii-left.png' },
  { key: 'beta-ii', name: 'Beta II', tag: 'Current',    image: '/assets/images/new-aircraft/r22/r22-beta-ii-left.png' },
  { key: 'mariner', name: 'Mariner', tag: 'Amphibious', image: '/assets/images/new-aircraft/r22/r22-beta-ii-left.png' },
];

const R22_COMPARISON_ROWS = [
  { label: 'Introduced',       key: 'years' },
  { label: 'Engine',           key: 'engine' },
  { label: 'Fuel System',      key: 'fuelSystem', fallback: 'Carbureted' },
  { label: 'Power',            key: 'power' },
  { label: 'Max Gross Weight', key: 'mtow' },
  { label: 'Useful Load',      key: 'usefulLoad' },
  { label: 'Range',            key: 'range' },
  { label: 'Landing Gear',     key: 'landingGear' },
  { label: 'Best For',         key: 'notable' },
];

const R22_WHY_TRAINER = [
  {
    eyebrow: 'Economics',
    title: 'The most affordable way to fly',
    copy: 'Hourly rates typically run a third of turbine training and around half of heavier piston types. That keeps PPL(H) syllabi attainable and lets students build real hours rather than rationed ones.',
    stat: { value: '≈£300/hr', caption: 'Typical UK wet rate' },
  },
  {
    eyebrow: 'Skill transfer',
    title: 'Controls that tell you everything',
    copy: 'Direct push-rod controls with no hydraulic assistance mean every input is felt. Pilots trained on the R22 read rotor state instinctively, a habit that carries over to every heavier type they fly afterwards.',
    stat: { value: 'Zero hydraulics', caption: 'Pure mechanical feedback' },
  },
  {
    eyebrow: 'Industry standard',
    title: 'The textbook light trainer',
    copy: 'EASA, CAA and FAA syllabi are built around the R22. Instructor ratings, type-specific Awareness Training (SFAR 73 / UK equivalent) and examiner standards all assume it.',
    stat: { value: '4,800+', caption: 'Delivered worldwide' },
  },
];

const R22_WHY_COUNTERS = [
  { value: '4800', suffix: '+', caption: 'Delivered worldwide' },
  { value: '300', prefix: '≈£', suffix: '/hr', caption: 'Typical UK wet rate' },
  { value: '0.7', caption: 'Fatal accidents per 100k hrs (post-SFAR 73)', isDecimal: true },
  { value: '40', suffix: '+', caption: 'Years in production' },
];

// ============================================================================
// R22 STYLES
// ============================================================================
function R22Styles() {
  return (
    <style>{`
        /* ===== BASE STYLES ===== */
        .r22-page {
          font-family: 'Space Grotesk', -apple-system, sans-serif;
          background: #faf9f6;
          color: #1a1a1a;
          overflow-x: hidden;
        }

        .r22-pre-text {
          display: block;
          font-family: 'Share Tech Mono', monospace;
          font-size: 0.75rem;
          text-transform: uppercase;
          letter-spacing: 0.25em;
          color: #999;
          margin-bottom: 0.75rem;
        }

        .r22-text--dark { color: #1a1a1a; }
        .r22-text--mid { color: #4a4a4a; }
        .r22-text--light { color: #7a7a7a; }
        .r22-text--white { color: #fff; }
        .r22-text--gold { color: #d4af37; }

        .r22-section-header {
          text-align: center;
          max-width: 650px;
          margin: 0 auto 3rem;
        }

        .r22-section-header h2 {
          font-family: 'Space Grotesk', sans-serif;
          font-size: clamp(2.25rem, 4.5vw, 3.25rem);
          margin: 0.5rem 0;
          line-height: 1.1;
          text-transform: uppercase;
          font-weight: 700;
        }

        .r22-section-desc {
          color: #666;
          font-size: 1.05rem;
          line-height: 1.7;
          margin-top: 1rem;
        }

        /* Buttons */
        .r22-btn {
          display: inline-block;
          padding: 1rem 2rem;
          font-size: 0.75rem;
          font-weight: 500;
          text-decoration: none;
          text-transform: uppercase;
          letter-spacing: 0.1em;
          border: none;
          cursor: pointer;
          transition: all 0.3s ease;
          font-family: inherit;
        }

        .r22-btn--primary {
          background: #1a1a1a;
          color: #fff;
        }

        .r22-btn--primary:hover {
          background: #333;
          color: #fff;
        }

        .r22-btn--outline {
          background: transparent;
          color: #1a1a1a;
          border: 2px solid #1a1a1a;
        }

        .r22-btn--outline:hover {
          background: #1a1a1a;
          color: #fff;
        }

        /* ===== HERO SECTION ===== */
        .r22-hero {
          min-height: 100vh;
          position: relative;
          display: flex;
          flex-direction: column;
          overflow: hidden;
          background: linear-gradient(135deg, #faf9f6 0%, #f0efeb 100%);
        }

        .r22-hero__bg {
          position: absolute;
          right: 0;
          bottom: 0;
          width: 60%;
          height: 100%;
          z-index: 1;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .r22-hero__bg img {
          width: 100%;
          height: auto;
          max-height: 90%;
          object-fit: contain;
          object-position: bottom right;
        }

        .r22-hero__overlay {
          position: absolute;
          inset: 0;
          z-index: 2;
          background: linear-gradient(90deg, rgba(250,249,246,0.98) 0%, rgba(250,249,246,0.85) 40%, rgba(250,249,246,0.3) 100%);
        }

        .r22-hero__content {
          position: relative;
          z-index: 3;
          flex: 1;
          display: flex;
          flex-direction: column;
          justify-content: center;
          padding: 120px 4rem 4rem;
          max-width: 600px;
        }

        .r22-hero__label {
          font-size: 0.75rem;
          font-weight: 400;
          letter-spacing: 0.25em;
          text-transform: uppercase;
          color: #999;
          margin-bottom: 1.5rem;
        }

        .r22-hero__headline {
          display: flex;
          flex-direction: column;
          margin-bottom: 1.5rem;
          font-family: 'Space Grotesk', sans-serif;
          font-size: clamp(3rem, 8vw, 6.5rem);
          font-weight: 700;
          letter-spacing: -0.03em;
          line-height: 0.95;
          color: #1a1a1a;
        }

        .r22-hero__word {
          font-weight: 700;
          font-size: clamp(3.5rem, 10vw, 7rem);
          letter-spacing: -0.02em;
          text-transform: uppercase;
        }

        .r22-hero__word--1 { color: #1a1a1a; }
        .r22-hero__word--2 { color: #4a4a4a; }

        .r22-hero__divider {
          width: 80px;
          height: 2px;
          background: #1a1a1a;
          margin-bottom: 1.5rem;
          transform-origin: left;
        }

        .r22-hero__stats {
          display: flex;
          gap: 2rem;
          margin-bottom: 1.5rem;
        }

        .r22-hero__stat {
          text-align: left;
        }

        .r22-hero__stat-value {
          display: block;
          font-family: 'Share Tech Mono', monospace;
          font-size: 1.5rem;
          font-weight: 700;
          color: #1a1a1a;
        }

        .r22-hero__stat-label {
          font-size: 0.65rem;
          color: #999;
          text-transform: uppercase;
          letter-spacing: 0.15em;
        }

        .r22-hero__stat-divider {
          width: 1px;
          background: #ddd;
        }

        .r22-hero__sub {
          font-size: 1.1rem;
          color: #666;
          line-height: 1.7;
        }

        .r22-hero__scroll {
          position: absolute;
          bottom: 3rem;
          left: 50%;
          transform: translateX(-50%);
          z-index: 10;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 0.75rem;
        }

        .r22-hero__scroll span {
          font-size: 0.65rem;
          text-transform: uppercase;
          letter-spacing: 0.2em;
          color: #999;
        }

        .r22-hero__scroll-line {
          width: 1px;
          height: 50px;
          background: #ddd;
          position: relative;
        }

        .r22-hero__scroll-dot {
          width: 6px;
          height: 6px;
          background: #1a1a1a;
          border-radius: 50%;
          position: absolute;
          left: 50%;
          transform: translateX(-50%);
          animation: scrollDot 2s ease-in-out infinite;
        }

        @keyframes scrollDot {
          0%, 100% { top: 0; opacity: 1; }
          50% { top: 80%; opacity: 0.3; }
        }

        /* ===== INTRO SECTION ===== */
        .r22-intro {
          padding: 8rem 2rem;
          background: #faf9f6;
        }
        .r22-intro__inner {
          max-width: 1280px;
          margin: 0 auto;
          display: grid;
          grid-template-columns: 3fr 2fr;
          gap: 5rem;
          align-items: center;
        }
        .r22-intro__copy h2 {
          font-size: clamp(2rem, 3.5vw, 2.75rem);
          font-weight: 700;
          margin: 0.5rem 0 2rem;
          line-height: 1.15;
        }
        .r22-intro__copy p {
          font-size: 1.05rem;
          line-height: 1.75;
          color: #4a4a4a;
          margin: 0 0 1.25rem;
        }
        .r22-intro__image img {
          width: 100%;
          height: auto;
          display: block;
        }
        @media (max-width: 900px) {
          .r22-intro__inner { grid-template-columns: 1fr; gap: 3rem; }
          .r22-intro { padding: 5rem 1.5rem; }
        }

        /* ===== HISTORY SECTION ===== */
        .r22-history {
          padding: 8rem 2rem;
          background: #faf9f6;
        }

        .r22-history__container {
          max-width: 1200px;
          margin: 0 auto;
        }

        .r22-history__content {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 4rem;
          align-items: start;
        }

        .r22-history__image {
          position: relative;
          overflow: hidden;
          border-radius: 8px;
        }

        .r22-parallax-container {
          position: relative;
          overflow: hidden;
          height: 500px;
          border-radius: 8px;
        }

        .r22-parallax-image {
          width: 100%;
          height: 120%;
          object-fit: cover;
        }

        .r22-timeline {
          padding: 0;
          background: transparent;
        }

        .r22-timeline__container {
          max-width: 100%;
          margin: 0 auto;
        }

        .r22-timeline__track {
          position: relative;
          margin-top: 2rem;
        }

        .r22-timeline__line {
          position: absolute;
          left: 24px;
          top: 0;
          bottom: 0;
          width: 2px;
          background: #ddd;
        }

        .r22-timeline__line-progress {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background: #1a1a1a;
        }

        .r22-timeline__item {
          display: flex;
          gap: 1.5rem;
          margin-bottom: 2rem;
          position: relative;
        }

        .r22-timeline__marker {
          width: 50px;
          height: 50px;
          display: flex;
          align-items: center;
          justify-content: center;
          background: #fff;
          border: 2px solid #ddd;
          border-radius: 50%;
          flex-shrink: 0;
          position: relative;
          z-index: 1;
        }

        .r22-timeline__item--completed .r22-timeline__marker {
          background: #1a1a1a;
          border-color: #1a1a1a;
          color: #fff;
        }

        .r22-timeline__item--active .r22-timeline__marker {
          background: #fff;
          border-color: #1a1a1a;
          border-width: 3px;
        }

        .r22-timeline__pulse {
          width: 12px;
          height: 12px;
          background: #1a1a1a;
          border-radius: 50%;
          animation: pulse 2s infinite;
        }

        @keyframes pulse {
          0% { transform: scale(1); opacity: 1; }
          50% { transform: scale(1.3); opacity: 0.7; }
          100% { transform: scale(1); opacity: 1; }
        }

        .r22-timeline__dot {
          width: 8px;
          height: 8px;
          background: #ddd;
          border-radius: 50%;
        }

        .r22-timeline__content {
          padding-top: 0.5rem;
        }

        .r22-timeline__year {
          display: inline-block;
          font-family: 'Share Tech Mono', monospace;
          font-size: 0.75rem;
          letter-spacing: 0.15em;
          background: #1a1a1a;
          color: #fff;
          padding: 0.25rem 0.75rem;
          margin-bottom: 0;
        }

        .r22-timeline__text {
          margin-top: 0;
          padding-top: 12px;
        }

        .r22-timeline__item--upcoming .r22-timeline__year {
          background: #ddd;
          color: #666;
        }

        .r22-timeline__content h4 {
          font-family: 'Space Grotesk', sans-serif;
          font-size: 1.15rem;
          font-weight: 500;
          color: #1a1a1a;
          margin: 0 0 0.5rem;
        }

        .r22-timeline__content p {
          font-family: 'Space Grotesk', sans-serif;
          font-size: 0.95rem;
          line-height: 1.6;
          color: #666;
          margin: 0;
        }

        /* ===== SPECS SECTION ===== */
        .r22-specs {
          background: #faf9f6;
          padding: 8rem 2rem;
          position: sticky;
          top: 0;
        }
        .r22-specs__inner { max-width: 1280px; margin: 0 auto; }
        .r22-specs__header { margin-bottom: 3rem; }
        .r22-specs__header h2 {
          font-size: clamp(2.25rem, 4.5vw, 3.25rem);
          font-weight: 700;
          margin: 0.5rem 0 0;
          line-height: 1.1;
        }
        .r22-specs__blueprint {
          margin: 0 auto 3rem;
          max-width: 900px;
        }
        .r22-specs__blueprint img {
          width: 100%;
          height: auto;
          display: block;
          mix-blend-mode: multiply;
          opacity: 0.9;
        }

        /* ===== SPECS VARIANT PICKER (ported from R44) ===== */
        .r22-variants__card {
          position: relative;
          margin-top: 3rem;
          padding: 0;
          background: #ffffff;
          border: 1px solid rgba(0,0,0,0.07);
          border-radius: 16px;
          box-shadow: 0 10px 40px rgba(0,0,0,0.06);
          overflow: hidden;
        }

        .r22-variants__card::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          height: 3px;
          background: #1a1a1a;
        }

        .r22-variants__tabs {
          display: grid;
          grid-template-columns: repeat(5, 1fr);
          gap: 0;
          margin: 0;
          padding: 0;
          background: #fbfaf7;
          border-bottom: 1px solid rgba(0,0,0,0.08);
        }

        .r22-variants__tab {
          position: relative;
          display: flex;
          flex-direction: column;
          align-items: flex-start;
          justify-content: space-between;
          gap: 0.85rem;
          padding: 1.25rem 1.25rem 1.1rem;
          min-height: 160px;
          font-family: 'Space Grotesk', sans-serif;
          text-align: left;
          color: #6b6b6b;
          background: transparent;
          border: none;
          border-right: 1px solid rgba(0,0,0,0.06);
          cursor: pointer;
          transition: color 0.25s ease, background 0.25s ease;
        }

        .r22-variants__tab:last-child { border-right: none; }

        .r22-variants__tab::after {
          content: '';
          position: absolute;
          left: 1.25rem;
          right: 1.25rem;
          bottom: 0;
          height: 2px;
          background: #1a1a1a;
          transform: scaleX(0);
          transform-origin: left center;
          transition: transform 0.3s ease;
        }

        .r22-variants__tab:hover {
          background: #f6f3ed;
          color: #1a1a1a;
        }

        .r22-variants__tab:hover .r22-variants__tab-thumb img {
          filter: grayscale(0%);
          opacity: 1;
        }

        .r22-variants__tab.active {
          background: #ffffff;
          color: #1a1a1a;
          justify-content: center;
        }

        .r22-variants__tab.active::after {
          transform: scaleX(1);
        }

        .r22-variants__tab-thumb {
          display: block;
          width: 100%;
          height: 72px;
          overflow: hidden;
          pointer-events: none;
        }

        .r22-variants__tab-thumb img {
          width: 100%;
          height: 100%;
          object-fit: contain;
          object-position: center;
          filter: grayscale(60%);
          opacity: 0.65;
          transition: filter 0.3s ease, opacity 0.3s ease, transform 0.3s ease;
        }

        .r22-variants__tab.active .r22-variants__tab-thumb img {
          filter: grayscale(0%);
          opacity: 1;
        }

        .r22-variants__tab-label {
          display: flex;
          flex-direction: column;
          gap: 0.2rem;
          line-height: 1.2;
          min-width: 0;
          width: 100%;
        }

        .r22-variants__tab-sub {
          font-family: 'Share Tech Mono', monospace;
          font-size: 0.6rem;
          letter-spacing: 0.14em;
          text-transform: uppercase;
          color: #9a9a9a;
        }

        .r22-variants__tab.active .r22-variants__tab-sub {
          color: #1a1a1a;
        }

        .r22-variants__tab-name {
          font-size: 0.95rem;
          font-weight: 600;
          letter-spacing: 0.01em;
          color: inherit;
        }

        .r22-variants__content {
          display: flex;
          flex-direction: column;
          gap: 0;
          margin-top: 0;
        }

        .r22-variants__image {
          position: relative;
          display: flex;
          align-items: center;
          justify-content: flex-end;
          padding: 0.5rem 3rem;
          min-height: 300px;
          background:
            radial-gradient(ellipse at center, rgba(255,255,255,0.9) 0%, rgba(255,255,255,0) 70%),
            linear-gradient(135deg, #ececea 0%, #ffffff 70%);
          overflow: visible;
        }

        .r22-variants__image::before {
          content: '';
          position: absolute;
          inset: 0;
          background-image:
            linear-gradient(rgba(0,0,0,0.03) 1px, transparent 1px),
            linear-gradient(90deg, rgba(0,0,0,0.03) 1px, transparent 1px);
          background-size: 40px 40px;
          opacity: 0.6;
          pointer-events: none;
        }

        .r22-variants__image-inner {
          position: relative;
          display: flex;
          align-items: center;
          justify-content: flex-end;
          width: 55%;
          max-width: 560px;
          height: 300px;
          z-index: 1;
        }

        .r22-variants__image-inner img {
          width: 100%;
          height: 100%;
          object-fit: contain;
          filter: drop-shadow(0 20px 30px rgba(0,0,0,0.15));
        }

        .r22-variants__image-headline {
          position: absolute;
          top: 50%;
          left: 3rem;
          transform: translateY(-50%);
          z-index: 3;
          pointer-events: none;
          width: 40%;
          max-width: 420px;
        }

        .r22-variants__image-headline-inner {
          display: block;
        }

        .r22-variants__image-headline .r22-variants__eyebrow {
          display: inline-block;
          font-family: 'Share Tech Mono', monospace;
          font-size: 0.7rem;
          letter-spacing: 0.22em;
          text-transform: uppercase;
          color: #a67b3f;
          margin-bottom: 1rem;
        }

        .r22-variants__image-headline h3 {
          font-family: 'Space Grotesk', sans-serif;
          font-size: clamp(2rem, 4vw, 3rem);
          font-weight: 700;
          line-height: 1.05;
          letter-spacing: -0.01em;
          color: #111111;
          margin: 0 0 0.75rem;
        }

        .r22-variants__image-headline .r22-variants__tagline {
          font-family: 'Space Grotesk', sans-serif;
          font-size: 1.1rem;
          font-style: italic;
          color: #8a8a8a;
          margin: 0 0 1.25rem;
        }

        .r22-variants__image-headline .r22-variants__divider {
          width: 64px;
          height: 2px;
          background: #a67b3f;
        }

        .r22-variants__info {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 3rem;
          align-items: stretch;
          padding: 2.75rem 3rem 3rem;
          background: #ffffff;
          border-top: 1px solid rgba(0,0,0,0.06);
        }

        .r22-variants__info-left {
          display: flex;
          flex-direction: column;
          justify-content: center;
        }

        .r22-variants__info-right {
          display: flex;
          flex-direction: column;
        }

        .r22-variants__eyebrow {
          display: inline-block;
          font-family: 'Share Tech Mono', monospace;
          font-size: 0.68rem;
          letter-spacing: 0.2em;
          text-transform: uppercase;
          color: #1a1a1a;
          margin-bottom: 0.75rem;
        }

        .r22-variants__info h3 {
          font-family: 'Space Grotesk', sans-serif;
          font-size: clamp(1.8rem, 3vw, 2.4rem);
          font-weight: 500;
          line-height: 1.1;
          color: #1a1a1a;
          margin: 0 0 0.75rem;
          letter-spacing: -0.01em;
        }

        .r22-variants__tagline {
          font-family: 'Space Grotesk', sans-serif;
          font-size: 1rem;
          font-style: italic;
          color: #7a7a7a;
          margin: 0 0 1.25rem;
          letter-spacing: 0.01em;
        }

        .r22-variants__divider {
          width: 50px;
          height: 2px;
          background: #1a1a1a;
          margin: 0 0 1.5rem;
          border-radius: 2px;
        }

        .r22-variants__description {
          font-family: 'Space Grotesk', sans-serif;
          font-size: 1rem;
          line-height: 1.7;
          color: #555;
          margin: 0;
        }

        .r22-variants__pdfs {
          display: flex;
          flex-wrap: wrap;
          gap: 0.5rem;
          margin-top: 1.25rem;
        }

        .r22-variants__pdf-pill {
          display: inline-flex;
          align-items: center;
          gap: 0.5rem;
          padding: 0.45rem 0.95rem;
          font-family: 'Space Grotesk', sans-serif;
          font-size: 0.78rem;
          font-weight: 500;
          color: #1a1a1a;
          background: #fff;
          border: 1px solid rgba(0,0,0,0.12);
          border-radius: 100px;
          text-decoration: none;
          letter-spacing: 0.01em;
          transition: background 0.2s, color 0.2s, border-color 0.2s, transform 0.2s;
        }

        .r22-variants__pdf-pill i {
          font-size: 0.85rem;
          color: #c8102e;
          transition: color 0.2s;
        }

        .r22-variants__pdf-pill:hover {
          background: #1a1a1a;
          color: #fff;
          border-color: #1a1a1a;
          transform: translateY(-1px);
        }

        .r22-variants__pdf-pill:hover i {
          color: #fff;
        }

        .r22-variants__use-case-tags {
          display: flex;
          flex-wrap: wrap;
          gap: 0.4rem;
        }

        .r22-variants__image .r22-variants__use-case-tags {
          position: absolute;
          right: 3rem;
          bottom: 1.25rem;
          justify-content: flex-end;
          z-index: 2;
        }

        .r22-variants__use-case-tag {
          display: inline-flex;
          align-items: center;
          padding: 0.35rem 0.75rem;
          font-family: 'Space Grotesk', sans-serif;
          font-size: 0.78rem;
          color: #4a4a4a;
          background: #fbfaf7;
          border: 1px solid rgba(0,0,0,0.08);
          border-radius: 100px;
          letter-spacing: 0.01em;
        }

        .r22-variants__features {
          list-style: none;
          padding: 0;
          margin: 0;
          display: flex;
          flex-direction: column;
          justify-content: space-between;
          flex: 1;
          gap: 0.6rem;
        }

        .r22-variants__features li {
          display: flex;
          align-items: center;
          gap: 0.7rem;
          font-family: 'Space Grotesk', sans-serif;
          font-size: 0.9rem;
          color: #4a4a4a;
          padding: 0;
        }

        .r22-variants__feature-icon {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          width: 26px;
          height: 26px;
          min-width: 26px;
          border-radius: 6px;
          background: rgba(0, 0, 0, 0.05);
          color: #1a1a1a;
          font-size: 0.7rem;
          flex-shrink: 0;
        }

        @media (max-width: 1000px) {
          .r22-variants__tabs {
            grid-template-columns: repeat(3, 1fr);
          }
          .r22-variants__tab:nth-child(3n) { border-right: none; }
          .r22-variants__tab:nth-child(n+4) {
            border-top: 1px solid rgba(0,0,0,0.06);
          }
        }

        @media (max-width: 900px) {
          .r22-specs { padding: 5rem 1.5rem; position: relative; top: auto; }
          .r22-variants__image {
            min-height: 260px;
            padding: 2rem 1.5rem;
          }
          .r22-variants__info {
            grid-template-columns: 1fr;
            gap: 1.75rem;
            padding: 2.25rem 1.75rem;
          }
        }

        @media (max-width: 700px) {
          .r22-variants__tabs {
            grid-template-columns: 1fr;
          }
          .r22-variants__tab {
            flex-direction: row;
            align-items: center;
            min-height: 0;
            padding: 1rem 1.25rem;
            border-right: none;
            border-bottom: 1px solid rgba(0,0,0,0.06);
            border-top: none;
          }
          .r22-variants__tab:last-child { border-bottom: none; }
          .r22-variants__tab-thumb {
            width: 84px;
            height: 48px;
            flex-shrink: 0;
          }
          .r22-variants__tab::after {
            left: 0;
            right: auto;
            top: 0;
            bottom: 0;
            width: 3px;
            height: auto;
            transform: scaleY(0);
            transform-origin: top center;
          }
          .r22-variants__tab.active::after {
            transform: scaleY(1);
          }
          .r22-variants__features {
            justify-content: flex-start;
            flex: 0 0 auto;
          }
        }

        /* ===== CHARACTERISTICS SECTION ===== */
        .r22-characteristics {
          padding: 8rem 2rem;
          background: #faf9f6;
        }

        .r22-characteristics__container {
          max-width: 1000px;
          margin: 0 auto;
        }

        .r22-characteristics__grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 2rem;
        }

        .r22-characteristics__card {
          background: #fff;
          padding: 2rem;
          border-radius: 8px;
          border: 1px solid #e8e6e2;
          transition: all 0.3s ease;
        }

        .r22-characteristics__card:hover {
          border-color: #1a1a1a;
        }

        .r22-characteristics__icon {
          width: 48px;
          height: 48px;
          margin-bottom: 1.5rem;
          color: #1a1a1a;
        }

        .r22-characteristics__icon svg {
          width: 100%;
          height: 100%;
        }

        .r22-characteristics__card h4 {
          font-size: 1.1rem;
          margin: 0 0 0.75rem;
          text-transform: uppercase;
        }

        .r22-characteristics__card p {
          color: #666;
          font-size: 0.9rem;
          line-height: 1.7;
          margin: 0;
        }

        /* ===== CHAMPION SECTION ===== */
        .r22-champion {
          padding: 8rem 2rem;
          background: #1a1a1a;
          color: #fff;
        }
        .r22-champion__inner {
          max-width: 1280px;
          margin: 0 auto;
          display: grid;
          grid-template-columns: 3fr 2fr;
          gap: 5rem;
          align-items: center;
        }
        .r22-champion__copy h2 {
          font-size: clamp(2.25rem, 4.5vw, 3.25rem);
          font-weight: 700;
          margin: 0.5rem 0 2rem;
          line-height: 1.1;
          color: #fff;
        }
        .r22-champion__copy p {
          font-size: 1.05rem;
          line-height: 1.75;
          color: #c8c8c8;
          margin: 0 0 1.25rem;
        }
        .r22-champion__image img {
          width: 100%;
          height: auto;
          display: block;
          filter: grayscale(0.2);
        }
        @media (max-width: 900px) {
          .r22-champion__inner { grid-template-columns: 1fr; gap: 3rem; }
          .r22-champion { padding: 5rem 1.5rem; }
        }

        /* ===== GALLERY SECTION ===== */
        .r22-gallery { padding: 8rem 2rem; background: #faf9f6; }
        .r22-gallery__masonry {
          max-width: 1280px;
          margin: 0 auto;
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          grid-auto-rows: 220px;
          gap: 1rem;
        }
        .r22-gallery__tile {
          position: relative;
          padding: 0;
          border: 0;
          cursor: pointer;
          overflow: hidden;
          background: #1a1a1a;
        }
        .r22-gallery__tile.is-wide { grid-column: span 2; }
        .r22-gallery__tile img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          transition: transform 0.4s ease, opacity 0.2s ease;
        }
        .r22-gallery__tile:hover img { transform: scale(1.04); opacity: 0.9; }
        .r22-gallery__caption {
          position: absolute;
          bottom: 0;
          left: 0;
          right: 0;
          padding: 0.75rem 1rem;
          font-size: 0.75rem;
          text-transform: uppercase;
          letter-spacing: 0.12em;
          color: #fff;
          background: linear-gradient(to top, rgba(0,0,0,0.75), transparent);
          text-align: left;
          opacity: 0;
          transition: opacity 0.2s ease;
        }
        .r22-gallery__tile:hover .r22-gallery__caption { opacity: 1; }
        .r22-gallery__lightbox {
          position: fixed;
          inset: 0;
          z-index: 200;
          background: rgba(0,0,0,0.92);
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 2rem;
        }
        .r22-gallery__lightbox img { max-width: 92vw; max-height: 88vh; object-fit: contain; }
        .r22-gallery__close {
          position: absolute;
          top: 1.5rem; right: 1.5rem;
          width: 48px; height: 48px;
          background: rgba(255,255,255,0.12);
          border: 0;
          color: #fff;
          font-size: 1.5rem;
          cursor: pointer;
          border-radius: 50%;
        }

        /* ===== CTA SECTION ===== */
        .r22-cta { padding: 8rem 2rem; background: #1a1a1a; color: #fff; }
        .r22-cta__inner { max-width: 720px; margin: 0 auto; text-align: center; }
        .r22-cta__inner h2 {
          font-size: clamp(2.25rem, 4.5vw, 3.25rem);
          font-weight: 700;
          margin: 0.5rem 0 1rem;
          color: #fff;
        }
        .r22-cta__inner p { font-size: 1.05rem; line-height: 1.7; color: #c8c8c8; margin: 0 0 2.5rem; }
        .r22-cta__controls {
          display: flex;
          gap: 1rem;
          justify-content: center;
          flex-wrap: wrap;
          margin-bottom: 1.5rem;
        }
        .r22-cta__select {
          padding: 0.9rem 1.25rem;
          background: rgba(255,255,255,0.08);
          border: 1px solid rgba(255,255,255,0.2);
          color: #fff;
          font-family: 'Share Tech Mono', monospace;
          font-size: 0.9rem;
          min-width: 240px;
        }
        .r22-btn--primary {
          display: inline-block;
          padding: 0.9rem 1.75rem;
          background: #fff;
          color: #1a1a1a;
          text-decoration: none;
          font-weight: 600;
          letter-spacing: 0.05em;
          text-transform: uppercase;
          font-size: 0.85rem;
          transition: opacity 0.2s ease;
        }
        .r22-btn--primary:hover { opacity: 0.88; }
        .r22-cta__secondary {
          color: #c8c8c8;
          text-decoration: none;
          font-size: 0.9rem;
          letter-spacing: 0.08em;
        }
        .r22-cta__secondary:hover { color: #fff; }

        /* ===== RESPONSIVE ===== */
        @media (max-width: 1024px) {
          .r22-hero__bg {
            width: 50%;
          }

          .r22-history__content {
            grid-template-columns: 1fr;
            gap: 3rem;
          }

          .r22-characteristics__grid {
            grid-template-columns: 1fr;
          }

        }

        @media (max-width: 768px) {
          .r22-hero__content {
            padding: 120px 2rem 4rem;
          }

          .r22-hero__bg {
            width: 100%;
            opacity: 0.3;
          }

          .r22-hero__overlay {
            background: linear-gradient(180deg, rgba(250,249,246,0.9) 0%, rgba(250,249,246,0.95) 100%);
          }

          .r22-hero__stats {
            flex-direction: column;
            gap: 1rem;
          }

          .r22-hero__stat-divider {
            display: none;
          }

        }

        /* ===== STICKY STACK ===== */
        .r22-sticky-stack {
          position: relative;
        }
        .r22-highlights {
          position: sticky;
          top: 0;
          z-index: 50;
          background: rgba(250, 249, 246, 0.92);
          backdrop-filter: blur(10px);
          border-bottom: 1px solid rgba(26, 26, 26, 0.08);
          padding: 1.25rem 2rem;
        }
        .r22-highlights__inner {
          max-width: 1280px;
          margin: 0 auto;
          display: flex;
          align-items: center;
          gap: 2rem;
        }
        .r22-highlights__list {
          display: flex;
          gap: 2.5rem;
          list-style: none;
          padding: 0;
          margin: 0;
          flex: 1;
          justify-content: flex-end;
        }
        .r22-highlights__item {
          display: flex;
          flex-direction: column;
          gap: 0.25rem;
        }
        .r22-highlights__value {
          font-family: 'Share Tech Mono', monospace;
          font-size: 1.25rem;
          color: #1a1a1a;
        }
        .r22-highlights__label {
          font-size: 0.7rem;
          text-transform: uppercase;
          letter-spacing: 0.2em;
          color: #7a7a7a;
        }
        .r22-highlights .r22-pre-text {
          display: inline;
          margin-bottom: 0;
        }
        @media (max-width: 768px) {
          .r22-highlights__inner { flex-direction: column; align-items: flex-start; gap: 0.75rem; }
          .r22-highlights__list { gap: 1.25rem; flex-wrap: wrap; justify-content: flex-start; }
          .r22-gallery__masonry { grid-template-columns: repeat(2, 1fr); grid-auto-rows: 180px; }
          .r22-gallery__tile.is-wide { grid-column: span 2; }
        }

        /* ===== WHY THE R22 SECTION ===== */
        .r22-why { padding: 8rem 2rem; background: #f2f0ea; }
        .r22-why__inner { max-width: 1280px; margin: 0 auto; }
        .r22-why__grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 1.5rem;
          margin-top: 3rem;
        }
        .r22-why__card {
          padding: 2.5rem 2rem;
          background: #faf9f6;
          border: 1px solid rgba(26,26,26,0.08);
          display: flex;
          flex-direction: column;
          gap: 1rem;
        }
        .r22-why__card h3 {
          font-size: 1.4rem;
          font-weight: 600;
          margin: 0 0 0.5rem;
          line-height: 1.25;
        }
        .r22-why__card p {
          font-size: 1rem;
          line-height: 1.7;
          color: #4a4a4a;
          margin: 0;
          flex: 1;
        }
        .r22-why__stat {
          margin-top: 1.5rem;
          padding-top: 1.25rem;
          border-top: 1px solid rgba(26,26,26,0.08);
          display: flex;
          flex-direction: column;
          gap: 0.25rem;
        }
        .r22-why__stat-value {
          font-family: 'Share Tech Mono', monospace;
          font-size: 1.4rem;
          color: #1a1a1a;
        }
        .r22-why__stat-caption {
          font-size: 0.75rem;
          text-transform: uppercase;
          letter-spacing: 0.15em;
          color: #7a7a7a;
        }
        .r22-why__counters {
          margin-top: 3.5rem;
          padding-top: 3rem;
          border-top: 1px solid rgba(26,26,26,0.12);
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 2rem;
        }
        .r22-why__counter {
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
          text-align: center;
        }
        .r22-why__counter-value {
          font-family: 'Share Tech Mono', monospace;
          font-size: clamp(1.75rem, 3.5vw, 2.5rem);
          color: #1a1a1a;
          line-height: 1;
        }
        .r22-why__counter-caption {
          font-size: 0.75rem;
          text-transform: uppercase;
          letter-spacing: 0.15em;
          color: #7a7a7a;
          line-height: 1.4;
        }
        @media (max-width: 900px) {
          .r22-why__grid { grid-template-columns: 1fr; }
          .r22-why__counters { grid-template-columns: repeat(2, 1fr); gap: 2rem 1.5rem; }
          .r22-why { padding: 5rem 1.5rem; }
        }
        /* ===== VARIANT COMPARISON ===== */
        .r22-comparison {
          position: relative;
          z-index: 50;
          padding: 5rem 2rem;
          background: #faf9f6;
        }

        .r22-comparison__container {
          max-width: 1200px;
          margin: 0 auto;
        }

        .r22-comparison__picker {
          margin: 2.5rem 0 3rem;
        }

        .r22-comparison__picker-label {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 1rem;
          font-family: 'Share Tech Mono', monospace;
          font-size: 0.7rem;
          letter-spacing: 0.15em;
          text-transform: uppercase;
          color: #888;
          margin-bottom: 1rem;
        }

        .r22-comparison__picker-clear {
          font-family: 'Share Tech Mono', monospace;
          font-size: 0.7rem;
          letter-spacing: 0.1em;
          text-transform: uppercase;
          color: #1a1a1a;
          background: none;
          border: none;
          padding: 0;
          cursor: pointer;
          text-decoration: underline;
          text-underline-offset: 3px;
        }

        .r22-comparison__picker-clear:hover {
          color: #c8102e;
        }

        .r22-comparison__picker-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
          gap: 0.75rem;
        }

        .r22-comparison__picker-card {
          display: flex;
          align-items: center;
          gap: 0.9rem;
          padding: 0.85rem 1rem;
          background: #fff;
          border: 1px solid #e8e6e2;
          border-radius: 6px;
          cursor: pointer;
          text-align: left;
          font-family: inherit;
          transition: border-color 0.2s, box-shadow 0.2s, background 0.2s;
        }

        .r22-comparison__picker-card:hover {
          border-color: #1a1a1a;
          box-shadow: 0 4px 14px rgba(0,0,0,0.06);
        }

        .r22-comparison__picker-card--active {
          border-color: #1a1a1a;
          background: #1a1a1a;
          color: #fff;
        }

        .r22-comparison__picker-card--locked {
          cursor: not-allowed;
          opacity: 0.85;
          box-shadow: inset 0 0 0 1px rgba(255,255,255,0.15);
        }

        .r22-comparison__picker-card--locked:hover {
          box-shadow: inset 0 0 0 1px rgba(255,255,255,0.15);
        }

        .r22-comparison__picker-check {
          width: 18px;
          height: 18px;
          flex-shrink: 0;
          border: 1px solid rgba(0,0,0,0.25);
          border-radius: 4px;
          display: flex;
          align-items: center;
          justify-content: center;
          background: #fff;
          color: #1a1a1a;
          font-size: 0.65rem;
          transition: all 0.2s;
        }

        .r22-comparison__picker-card--active .r22-comparison__picker-check {
          background: #fff;
          border-color: #fff;
        }

        .r22-comparison__picker-thumb {
          width: 52px;
          height: 36px;
          flex-shrink: 0;
          display: flex;
          align-items: center;
          justify-content: center;
          background: #faf9f6;
          border-radius: 4px;
          overflow: hidden;
        }

        .r22-comparison__picker-card--active .r22-comparison__picker-thumb {
          background: rgba(255,255,255,0.08);
        }

        .r22-comparison__picker-thumb img {
          width: 100%;
          height: 100%;
          object-fit: contain;
        }

        .r22-comparison__picker-text {
          display: flex;
          flex-direction: column;
          min-width: 0;
        }

        .r22-comparison__picker-name {
          font-family: 'Space Grotesk', sans-serif;
          font-size: 0.95rem;
          font-weight: 500;
          line-height: 1.2;
        }

        .r22-comparison__picker-tag {
          font-family: 'Share Tech Mono', monospace;
          font-size: 0.6rem;
          letter-spacing: 0.12em;
          text-transform: uppercase;
          color: #888;
          margin-top: 0.25rem;
        }

        .r22-comparison__picker-card--active .r22-comparison__picker-tag {
          color: rgba(255,255,255,0.65);
        }

        .r22-comparison__table-wrapper {
          overflow-x: auto;
          margin-bottom: 3rem;
        }

        .r22-comparison__table {
          width: 100%;
          border-collapse: collapse;
          background: #fff;
          border: 1px solid #e8e6e2;
        }

        .r22-comparison__table thead {
          background: #1a1a1a;
          color: #fff;
        }

        .r22-comparison__header-label,
        .r22-comparison__header-variant {
          padding: 1.25rem 1rem;
          text-align: left;
          font-size: 0.75rem;
          font-weight: 500;
          letter-spacing: 0.1em;
          text-transform: uppercase;
        }

        .r22-comparison__header-label {
          width: 18%;
          background: #1a1a1a;
        }

        .r22-comparison__header-variant {
          width: 16.4%;
          text-align: center;
        }

        .r22-comparison__variant-name {
          display: block;
          font-size: 1rem;
          font-weight: 600;
          margin-bottom: 0.25rem;
        }

        .r22-comparison__variant-tag {
          display: inline-block;
          font-size: 0.6rem;
          font-weight: 400;
          letter-spacing: 0.15em;
          text-transform: uppercase;
          padding: 0.2rem 0.5rem;
          background: rgba(255,255,255,0.15);
          border-radius: 2px;
        }

        .r22-comparison__row-label {
          padding: 1rem;
          font-size: 0.75rem;
          font-weight: 500;
          letter-spacing: 0.08em;
          text-transform: uppercase;
          color: #666;
          background: #faf9f6;
          border-bottom: 1px solid #e8e6e2;
        }

        .r22-comparison__cell {
          padding: 0.85rem 0.75rem;
          font-family: 'Share Tech Mono', monospace;
          font-size: 0.8rem;
          line-height: 1.5;
          color: #1a1a1a;
          text-align: center;
          border-bottom: 1px solid #e8e6e2;
          border-left: 1px solid #e8e6e2;
        }

        @media (max-width: 1024px) {
          .r22-comparison__table {
            font-size: 0.7rem;
            min-width: 720px;
          }

          .r22-comparison__header-label,
          .r22-comparison__header-variant {
            padding: 0.75rem 0.5rem;
          }

          .r22-comparison__cell,
          .r22-comparison__row-label {
            padding: 0.65rem 0.5rem;
            font-size: 0.7rem;
          }

          .r22-comparison__variant-name {
            font-size: 0.85rem;
          }

          .r22-comparison__variant-tag {
            font-size: 0.55rem;
          }
        }
        .r22-fleet {
          position: relative;
          width: 100%;
          min-height: 55vh;
          overflow: hidden;
          background: #1a1a1a;
        }
        .r22-fleet__image img {
          width: 100%;
          height: 100%;
          min-height: 55vh;
          object-fit: cover;
          display: block;
          opacity: 0.85;
        }
        .r22-fleet__overlay {
          position: absolute;
          left: 3rem;
          bottom: 3rem;
          max-width: 480px;
          color: #fff;
          text-shadow: 0 2px 12px rgba(0,0,0,0.5);
        }
        .r22-fleet__overlay p {
          font-size: clamp(1.25rem, 2.2vw, 1.75rem);
          font-weight: 500;
          line-height: 1.4;
          margin: 0.5rem 0 0;
        }
        @media (max-width: 600px) {
          .r22-fleet__overlay { left: 1.25rem; right: 1.25rem; bottom: 1.25rem; }
        }
    `}</style>
  );
}

// ============================================================================
// R22 HIGHLIGHTS
// ============================================================================
function R22Highlights() {
  return (
    <section className="r22-highlights" aria-label="R22 at a glance">
      <div className="r22-highlights__inner">
        <span className="r22-pre-text">At a glance</span>
        <ul className="r22-highlights__list">
          {R22_HIGHLIGHTS.map((h) => (
            <li key={h.label} className="r22-highlights__item">
              <span className="r22-highlights__value">{h.value}</span>
              <span className="r22-highlights__label">{h.label}</span>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

// ============================================================================
// R22 HERO
// ============================================================================
function R22Hero() {
  const heroRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ['start start', 'end start'],
  });

  const heroOpacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);
  const heroScale = useTransform(scrollYProgress, [0, 0.5], [1, 0.95]);
  const heroY = useTransform(scrollYProgress, [0, 0.5], [0, 100]);

  return (
    <section ref={heroRef} className="r22-hero" data-cms-section="r22-hero">
      <motion.div
        className="r22-hero__bg"
        initial={{ scale: 1.1, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 1.5 }}
        style={{ scale: heroScale, y: heroY }}
      >
        <img
          src="/assets/images/new-aircraft/r22/r22-red-volcano-front-alpha-v3.png"
          alt="Robinson R22 Helicopter"
        />
      </motion.div>
      <div className="r22-hero__overlay" />

      <motion.div
        className="r22-hero__content"
        style={{ opacity: heroOpacity, scale: heroScale, y: heroY }}
      >
        <motion.span
          className="r22-hero__label"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          THE TRAINING LEGEND
        </motion.span>

        <div className="r22-hero__headline">
          <motion.span
            className="r22-hero__word r22-hero__word--1"
            initial={{ opacity: 0, y: 60 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4, ease: [0.16, 1, 0.3, 1] }}
          >
            ROBINSON
          </motion.span>
          <motion.span
            className="r22-hero__word r22-hero__word--2"
            initial={{ opacity: 0, y: 60 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6, ease: [0.16, 1, 0.3, 1] }}
          >
            R22
          </motion.span>
        </div>

        <motion.div
          className="r22-hero__divider"
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ duration: 0.8, delay: 0.8 }}
        />

        <motion.div
          className="r22-hero__stats"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1 }}
        >
          <div className="r22-hero__stat">
            <span className="r22-hero__stat-value">4,800+</span>
            <span className="r22-hero__stat-label">Built Worldwide</span>
          </div>
          <div className="r22-hero__stat-divider" />
          <div className="r22-hero__stat">
            <span className="r22-hero__stat-value">1975</span>
            <span className="r22-hero__stat-label">First Flight</span>
          </div>
          <div className="r22-hero__stat-divider" />
          <div className="r22-hero__stat">
            <span className="r22-hero__stat-value">#1</span>
            <span className="r22-hero__stat-label">Training Helicopter</span>
          </div>
        </motion.div>

        <motion.p
          className="r22-hero__sub"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.2 }}
        >
          The world's most popular training helicopter. Where legends begin their journey.
        </motion.p>
      </motion.div>

    </section>
  );
}

// ============================================================================
// R22 INTRODUCTION
// ============================================================================
function R22Introduction() {
  return (
    <section className="r22-intro">
      <div className="r22-intro__inner">
        <div className="r22-intro__copy">
          <span className="r22-pre-text">Origins</span>
          <h2>Designed by Frank Robinson. Proven by four decades of students.</h2>
          <p>
            Frank Robinson drew the R22 in 1973 with a single objective: make personal helicopter
            flight affordable without compromising integrity. He had left Hughes and Bell in pursuit
            of a light two-seater that private pilots could actually own and instructors could
            actually teach on, a gap the industry had failed to close in thirty years.
          </p>
          <p>
            The first flight in 1975 proved the design; production began in 1979. Four decades
            later, more than 4,800 airframes have been delivered and the R22 remains the default
            first helicopter for the majority of rotary pilots worldwide. Every Beta II rolling off
            the Torrance line today is the direct descendant of that original prototype.
          </p>
          <p>
            The reason the design has endured is not nostalgia. It is that the R22's combination of
            low inertia, direct controls and honest handling creates pilots who understand
            rotorcraft at a mechanical level, and that understanding transfers to every aircraft
            they fly afterwards.
          </p>
        </div>
        <div className="r22-intro__image">
          <img
            src="/assets/images/new-aircraft/r22/r22-cutout.png"
            alt="R22 cutout"
            loading="lazy"
          />
        </div>
      </div>
    </section>
  );
}

// ============================================================================
// R22 HISTORY TIMELINE
// ============================================================================
function R22HistoryTimeline() {
  const historyEvents = [
    { year: '1973', title: 'Design Begins', status: 'completed', description: 'Frank D. Robinson begins designing the R22, pursuing his vision of an affordable, reliable light helicopter for the private market.' },
    { year: '1975', title: 'First Flight', status: 'completed', description: 'The R22 prototype takes to the skies, demonstrating the viability of Robinson\'s revolutionary design approach.' },
    { year: '1979', title: 'Production Begins', status: 'completed', description: 'Robinson Helicopter Company begins production of the R22, launching the most successful light helicopter program in history.' },
    { year: '1996', title: 'Beta II Introduction', status: 'completed', description: 'The improved R22 Beta II model launches with enhanced performance and safety features.' },
    { year: '1997', title: 'Safety Milestone', status: 'completed', description: 'Fatal accident rate drops to 0.7 per 100,000 flight hours, down from 6.0 in 1982, following implementation of the Robinson Pilot Safety Course.' },
    { year: '2012', title: 'World Champion Aircraft', status: 'completed', description: "Captain Quentin Smith wins the World Helicopter Aerobatic Championship in Russia flying the R22, the only piston trainer ever to take the title, and the defining moment that confirmed the aircraft's handling pedigree beyond the training arena." },
    { year: '2024', title: '4,800+ Built', status: 'active', description: 'Over 4,800 R22 helicopters delivered worldwide, making it the most popular training helicopter ever produced.' },
  ];

  return (
    <section className="r22-history">
      <div className="r22-history__container">
        <Reveal>
          <div className="r22-section-header">
            <span className="r22-pre-text">Heritage</span>
            <h2>
              <span className="r22-text--dark">A Legacy</span>{' '}
              <span className="r22-text--mid">Of</span>{' '}
              <span className="r22-text--light">Innovation</span>
            </h2>
          </div>
        </Reveal>

        <div className="r22-history__content">
          <div className="r22-history__image">
            <Reveal direction="left">
              <ParallaxImage
                src="/assets/images/new-aircraft/r22/r22blueprint.jpg"
                alt="R22 Blueprint"
              />
            </Reveal>
          </div>
          <div className="r22-history__timeline">
            <div className="r22-timeline__track">
              <div className="r22-timeline__line">
                <div className="r22-timeline__line-progress" />
              </div>
              {historyEvents.map((event, i) => (
                <Reveal key={i} delay={i * 0.12}>
                  <div className={`r22-timeline__item r22-timeline__item--${event.status || 'completed'}`}>
                    <div className="r22-timeline__marker">
                      {event.status === 'active' && <div className="r22-timeline__pulse" />}
                      {event.status === 'upcoming' && <div className="r22-timeline__dot" />}
                      {(!event.status || event.status === 'completed') && <i className="fas fa-check"></i>}
                    </div>
                    <div className="r22-timeline__content">
                      <span className="r22-timeline__year">{event.year}</span>
                      <div className="r22-timeline__text">
                        <h4>{event.title}</h4>
                        <p>{event.description}</p>
                      </div>
                    </div>
                  </div>
                </Reveal>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

// ============================================================================
// R22 SPECIFICATIONS
// ============================================================================
function R22Specifications() {
  const [activeVariant, setActiveVariant] = useState(
    Math.max(0, R22_VARIANT_DATA.findIndex((v) => v.id === 'beta-ii'))
  );
  const active = R22_VARIANT_DATA[activeVariant] ?? R22_VARIANT_DATA[0];

  return (
    <section className="r22-specs" data-cms-section="r22-specifications">
      <div className="r22-specs__inner">
        <div className="r22-specs__header">
          <span className="r22-pre-text">Specifications</span>
          <h2>Anatomy of a trainer</h2>
        </div>
        <div className="r22-specs__blueprint">
          <img
            src="/assets/images/new-aircraft/r22/r22blueprint.jpg"
            alt="R22 blueprint"
            loading="lazy"
          />
        </div>

        <LayoutGroup id="r22-variants">
          <div className="r22-variants__card">
            <div className="r22-variants__tabs">
              {R22_VARIANT_DATA.map((variant, i) => (
                <button
                  key={variant.key || variant.id}
                  type="button"
                  className={`r22-variants__tab ${activeVariant === i ? 'active' : ''}`}
                  onClick={() => setActiveVariant(i)}
                >
                  {activeVariant !== i && (
                    <motion.span
                      className="r22-variants__tab-thumb"
                      aria-hidden="true"
                      layoutId={`r22-variant-img-${i}`}
                      transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
                    >
                      <img src={variant.image} alt="" loading="lazy" />
                    </motion.span>
                  )}
                  <motion.span
                    className="r22-variants__tab-label"
                    layout
                    transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
                  >
                    <span className="r22-variants__tab-sub">{variant.subtitle}</span>
                    <span className="r22-variants__tab-name">{variant.name}</span>
                  </motion.span>
                </button>
              ))}
            </div>

            <div className="r22-variants__content">
              <div className="r22-variants__image">
                <div className="r22-variants__image-headline">
                  <div className="r22-variants__image-headline-inner">
                    <span className="r22-variants__eyebrow">{active.subtitle}</span>
                    <h3>R22 {active.name}</h3>
                    <p className="r22-variants__tagline">{active.tagline}</p>
                    <div className="r22-variants__divider" />
                  </div>
                </div>
                <motion.span
                  key={activeVariant}
                  className="r22-variants__image-inner"
                  layoutId={`r22-variant-img-${activeVariant}`}
                  transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
                >
                  <img
                    src={active.image}
                    alt={`${active.name} configuration`}
                  />
                </motion.span>
                <div className="r22-variants__use-case-tags">
                  {active.useCases.map((uc, i) => (
                    <span key={i} className="r22-variants__use-case-tag">{uc}</span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </LayoutGroup>
      </div>
    </section>
  );
}

// ============================================================================
// R22 FLIGHT CHARACTERISTICS
// ============================================================================
function R22FlightCharacteristics() {
  const flightCharacteristics = [
    {
      title: 'Low Inertia Rotor System',
      description: 'The R22\'s two-blade, semi-rigid rotor system stores minimal energy, requiring pilots to maintain precise RPM management. This characteristic develops exceptional awareness of energy state and rotor dynamics.',
      icon: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
          <circle cx="12" cy="12" r="10" />
          <path d="M12 2v20M2 12h20" />
        </svg>
      ),
    },
    {
      title: 'Direct Push-Rod Controls',
      description: 'Controls are operated directly by push rods with no hydraulic assistance, providing pilots with pure, unfiltered feedback. This direct connection between pilot input and rotor response creates an exceptional training environment that develops superior skills.',
      icon: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
          <path d="M12 2v10M12 12l8 8M12 12l-8 8" />
        </svg>
      ),
    },
    {
      title: 'Builds Superior Skills',
      description: 'The demanding nature of the R22 creates pilots with exceptional hand-eye coordination and situational awareness. Those who master the R22 transition seamlessly to larger, more complex helicopters.',
      icon: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
          <path d="M12 2l3 7h7l-5.5 4 2 7L12 16l-6.5 4 2-7L2 9h7z" />
        </svg>
      ),
    },
  ];

  return (
    <section className="r22-characteristics">
      <div className="r22-characteristics__container">
        <Reveal>
          <div className="r22-section-header">
            <span className="r22-pre-text">Flying the R22</span>
            <h2>
              <span className="r22-text--dark">Flight</span>{' '}
              <span className="r22-text--mid">Characteristics</span>
            </h2>
            <p className="r22-section-desc">
              The R22's demanding nature develops exceptional pilot skills. Those who master
              the R22 find themselves exceptionally prepared for any helicopter they fly thereafter.
            </p>
          </div>
        </Reveal>

        <div className="r22-characteristics__grid">
          {flightCharacteristics.map((char, index) => (
            <Reveal key={index} delay={index * 0.1}>
              <motion.div
                className="r22-characteristics__card"
                whileHover={{ y: -4 }}
                transition={{ type: 'spring', stiffness: 400 }}
              >
                <div className="r22-characteristics__icon">
                  {char.icon}
                </div>
                <h4>{char.title}</h4>
                <p>{char.description}</p>
              </motion.div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

// ============================================================================
// R22 CHAMPION (CAPTAIN QUENTIN SMITH)
// ============================================================================
function R22Champion({ pageImages }) {
  const defaults = SECTION_MAP['r22-champion']?.images
    || [{ src: '/assets/images/used-aircraft/r22/british-team-r22.webp', alt: 'Captain Quentin Smith' }];
  const images = pageImages?.['r22-champion'] || defaults;
  const hero = images[0];
  const getSrc = (img) => img?.src || img?.url || '';

  return (
    <section className="r22-champion" data-cms-section="r22-champion">
      <div className="r22-champion__inner">
        <div className="r22-champion__copy">
          <span className="r22-pre-text">The record holder</span>
          <h2>Captain Q and the R22</h2>
          <p>
            In 2012, Captain Quentin Smith took an R22 to Russia and won the World Helicopter
            Aerobatic Championship, the only piston trainer ever to claim the title, in a field
            otherwise contested by purpose-built turbine types. It was not a quiet win. It was a
            direct statement about what the R22 is capable of when flown by someone who understands
            it completely.
          </p>
          <p>
            Captain Q's flying predates the championship by decades. He is the first pilot to have
            circumnavigated the globe pole-to-pole by helicopter, a feat that required every skill
            the R22 teaches and none of the systems that modern types provide. HQ Aviation's
            instruction ethos, that a pilot trained properly on the R22 can fly anything, comes
            directly from this lineage.
          </p>
          <p>
            Every student who trains with us at Denham trains in the aircraft that a world champion
            chose to prove his point.
          </p>
        </div>
        <div className="r22-champion__image">
          <img src={getSrc(hero)} alt={hero.alt || 'Captain Quentin Smith'} loading="lazy" />
        </div>
      </div>
    </section>
  );
}

// ============================================================================
// R22 FLEET
// ============================================================================
function R22Fleet({ pageImages }) {
  const defaults = SECTION_MAP['r22-fleet']?.images
    || [{ src: '/assets/images/used-aircraft/r22/hq-r22-lineup.jpg', alt: 'HQ Aviation R22 fleet lineup' }];
  const images = pageImages?.['r22-fleet'] || defaults;
  const hero = images[0];
  const getSrc = (img) => img?.src || img?.url || '';

  return (
    <section className="r22-fleet" data-cms-section="r22-fleet">
      <div className="r22-fleet__image">
        <img src={getSrc(hero)} alt={hero.alt || ''} loading="lazy" />
      </div>
      <div className="r22-fleet__overlay">
        <span className="r22-pre-text">The Denham fleet</span>
        <p>Four R22 Beta IIs. Forty years of design discipline on the same apron.</p>
      </div>
    </section>
  );
}

// ============================================================================
// R22 GALLERY
// ============================================================================
function R22Gallery({ pageImages }) {
  const [lightbox, setLightbox] = useState(null);
  const defaults = SECTION_MAP['r22-gallery']?.images || [];
  const images = (pageImages?.['r22-gallery'] || defaults);

  // The first two items render as wide (span 2); the rest render regular.
  const WIDE_INDEXES = new Set([0, 1]);

  const getSrc = (img) => img?.src || img?.url || '';

  return (
    <section className="r22-gallery" data-cms-section="r22-gallery">
      <div className="r22-gallery__header r22-section-header">
        <span className="r22-pre-text">Gallery</span>
        <h2>The R22 in the wild</h2>
      </div>
      <div className="r22-gallery__masonry">
        {images.map((img, i) => (
          <button
            key={getSrc(img) || i}
            type="button"
            className={`r22-gallery__tile ${WIDE_INDEXES.has(i) ? 'is-wide' : ''}`}
            onClick={() => setLightbox(img)}
          >
            <img src={getSrc(img)} alt={img.alt || ''} loading="lazy" />
            {img.alt && <span className="r22-gallery__caption">{img.alt}</span>}
          </button>
        ))}
      </div>

      <AnimatePresence>
        {lightbox && (
          <motion.div
            className="r22-gallery__lightbox"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setLightbox(null)}
          >
            <button
              type="button"
              className="r22-gallery__close"
              onClick={(e) => { e.stopPropagation(); setLightbox(null); }}
              aria-label="Close"
            >×</button>
            <img src={getSrc(lightbox)} alt={lightbox.alt || ''} />
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}

// ============================================================================
// R22 CTA
// ============================================================================
function R22CTA() {
  const options = [
    { key: 'trial-lesson',   subject: 'training',       label: 'Trial lesson' },
    { key: 'ppl',            subject: 'training',       label: 'Full PPL(H) training' },
    { key: 'sales',          subject: 'aircraft-sales', label: 'Aircraft sales' },
    { key: 'general',        subject: '',               label: 'General enquiry' },
  ];
  const [selectedKey, setSelectedKey] = useState('trial-lesson');
  const selected = options.find((o) => o.key === selectedKey) ?? options[0];

  return (
    <section className="r22-cta">
      <div className="r22-cta__inner">
        <span className="r22-pre-text">Next step</span>
        <h2>Start your R22 journey</h2>
        <p>Tell us what you'd like to do. We'll route your enquiry to the right person at HQ.</p>
        <div className="r22-cta__controls">
          <select
            className="r22-cta__select"
            value={selectedKey}
            onChange={(e) => setSelectedKey(e.target.value)}
            aria-label="I'm interested in"
          >
            {options.map((o) => (
              <option key={o.key} value={o.key}>{o.label}</option>
            ))}
          </select>
        </div>
        <Link to="/training" className="r22-cta__secondary">Explore training →</Link>
      </div>
    </section>
  );
}

// ============================================================================
// R22 WHY TRAINER SECTION
// ============================================================================
function R22WhyTrainer() {
  return (
    <section className="r22-why">
      <div className="r22-why__inner">
        <div className="r22-section-header">
          <span className="r22-pre-text">Why the R22</span>
          <h2>Why the world trains on the R22</h2>
        </div>
        <div className="r22-why__grid">
          {R22_WHY_TRAINER.map((item) => (
            <article key={item.eyebrow} className="r22-why__card">
              <span className="r22-pre-text">{item.eyebrow}</span>
              <h3>{item.title}</h3>
              <p>{item.copy}</p>
              <div className="r22-why__stat">
                <span className="r22-why__stat-value">{item.stat.value}</span>
                <span className="r22-why__stat-caption">{item.stat.caption}</span>
              </div>
            </article>
          ))}
        </div>
        <div className="r22-why__counters">
          {R22_WHY_COUNTERS.map((c) => (
            <div key={c.caption} className="r22-why__counter">
              <span className="r22-why__counter-value">
                {c.isDecimal ? (
                  <>
                    {c.prefix || ''}{c.value}{c.suffix || ''}
                  </>
                ) : (
                  <AnimatedNumber value={c.value} prefix={c.prefix || ''} suffix={c.suffix || ''} />
                )}
              </span>
              <span className="r22-why__counter-caption">{c.caption}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ============================================================================
// R22 VARIANT COMPARISON
// ============================================================================
function R22VariantComparison() {
  const [selectedKeys, setSelectedKeys] = useState(['beta-ii']);

  const toggleKey = (key) => {
    setSelectedKeys((prev) => {
      if (prev.includes(key)) {
        // Last remaining column cannot be removed
        if (prev.length <= 1) return prev;
        return prev.filter((k) => k !== key);
      }
      return [...prev, key];
    });
  };

  const selectedColumns = R22_COMPARISON_COLUMNS.filter((c) => selectedKeys.includes(c.key));
  const hasSelection = selectedColumns.length > 0;

  return (
    <section className="r22-comparison">
      <div className="r22-comparison__container">
        <Reveal>
          <div className="r22-section-header">
            <span className="r22-pre-text">Compare</span>
            <h2>
              <span className="r22-text--dark">The R22 Family,</span>{' '}
              <span className="r22-text--mid">Side By Side</span>
            </h2>
            <p>
              Four variants, one airframe. Compare the Alpha, Beta, Beta II and
              Mariner to land on the R22 that fits your mission. Then talk to
              HQ Aviation about sourcing one.
            </p>
          </div>
        </Reveal>

        <Reveal delay={0.1}>
          <div className="r22-comparison__picker">
            <div className="r22-comparison__picker-label">
              <span>
                {selectedKeys.length} selected
              </span>
              {selectedKeys.length > 1 && (
                <button
                  type="button"
                  className="r22-comparison__picker-clear"
                  onClick={() => setSelectedKeys(['beta-ii'])}
                >
                  Clear
                </button>
              )}
            </div>
            <div className="r22-comparison__picker-grid">
              {R22_COMPARISON_COLUMNS.map((col) => {
                const active = selectedKeys.includes(col.key);
                const locked = active && selectedKeys.length === 1;
                return (
                  <button
                    key={col.key}
                    type="button"
                    onClick={() => toggleKey(col.key)}
                    className={`r22-comparison__picker-card${active ? ' r22-comparison__picker-card--active' : ''}${locked ? ' r22-comparison__picker-card--locked' : ''}`}
                    aria-pressed={active}
                    aria-disabled={locked ? 'true' : undefined}
                  >
                    <span className="r22-comparison__picker-check" aria-hidden="true">
                      {active && <i className="fas fa-check"></i>}
                    </span>
                    <span className="r22-comparison__picker-thumb">
                      <img src={col.image} alt="" loading="lazy" />
                    </span>
                    <span className="r22-comparison__picker-text">
                      <span className="r22-comparison__picker-name">{col.name}</span>
                      <span className="r22-comparison__picker-tag">{col.tag}</span>
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        </Reveal>

        {hasSelection && (
          <Reveal delay={0.2}>
            <div className="r22-comparison__table-wrapper">
              <table className="r22-comparison__table">
                <thead>
                  <tr>
                    <th className="r22-comparison__header-label">Specification</th>
                    {selectedColumns.map((col) => (
                      <th
                        key={col.key}
                        className="r22-comparison__header-variant"
                      >
                        <span className="r22-comparison__variant-name">{col.name}</span>
                        <span className="r22-comparison__variant-tag">{col.tag}</span>
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {R22_COMPARISON_ROWS.map((row, i) => (
                    <tr key={i}>
                      <td className="r22-comparison__row-label">{row.label}</td>
                      {selectedColumns.map((col) => {
                        const variant = R22_VARIANT_DATA.find((v) => v.key === col.key);
                        const value = (variant && variant[row.key]) || row.fallback || '—';
                        return (
                          <td
                            key={col.key}
                            className="r22-comparison__cell"
                          >
                            {value}
                          </td>
                        );
                      })}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Reveal>
        )}

      </div>
    </section>
  );
}

// ============================================================================
// MAIN PAGE COMPONENT
// ============================================================================
function AircraftR22() {
  useCmsHighlight();
  const pageImages = usePageImages('r22');

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="r22-page">
      <R22Styles />
      <R22Header />
      <R22Hero />
      <section className="r22-price-section">
        <AircraftPriceBlock modelId="r22" subtypes={getSubtypes('r22')} />
        <style>{`
          .r22-price-section {
            display: flex;
            justify-content: center;
            padding: 3rem 1.5rem 0;
            background: #faf9f6;
          }
        `}</style>
      </section>
      <div className="r22-sticky-stack">
        <R22Highlights />
        <R22Introduction />
        <R22Specifications />
      </div>
      <R22FlightCharacteristics />
      <R22WhyTrainer />
      <R22VariantComparison />
      <R22HistoryTimeline />
      <R22Champion pageImages={pageImages} />
      <R22Fleet pageImages={pageImages} />
      <R22Gallery pageImages={pageImages} />
      <R22CTA />
      <FooterMinimal />
    </div>
  );
}

export default AircraftR22;

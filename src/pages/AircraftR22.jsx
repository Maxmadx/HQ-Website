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
import { motion, useInView, useScroll, useTransform, AnimatePresence } from 'framer-motion';
import { usePageImages } from '../hooks/usePageImages';
import { useCmsHighlight } from '../hooks/useCmsHighlight';
import { SECTION_MAP } from '../lib/imageSections';

// Import styles
import '../assets/css/main.css';
import '../assets/css/components.css';

// Import FooterMinimal component
import FooterMinimal from '../components/FooterMinimal';

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
      <div className={`hq-menu-panel ${menuOpen ? 'open' : ''}`}>
        <div className="hq-menu-grid">
          <div className="hq-menu-section">
            <h3>About</h3>
            <ul>
              <li><Link to="/" onClick={closeMenu}>Home</Link></li>
              <li><Link to="/about-us" onClick={closeMenu}>About Us</Link></li>
              <li><Link to="/about-us/team" onClick={closeMenu}>Meet The Team</Link></li>
              <li><Link to="/about-us/captain-q" onClick={closeMenu}>Quentin Smith</Link></li>
              <li><Link to="/contact" onClick={closeMenu}>Contact</Link></li>
            </ul>
          </div>
          <div className="hq-menu-section">
            <h3>Aircraft Sales</h3>
            <ul>
              <li><Link to="/aircraft-sales" onClick={closeMenu}>New Aircraft</Link></li>
              <li><Link to="/aircraft-sales/new/r66" onClick={closeMenu}>R66</Link></li>
              <li><Link to="/aircraft-sales/new/r44" onClick={closeMenu}>R44</Link></li>
              <li><Link to="/aircraft-sales/new/r22" onClick={closeMenu}>R22</Link></li>
            </ul>
          </div>
          <div className="hq-menu-section">
            <h3>Flight Training</h3>
            <ul>
              <li><Link to="/training" onClick={closeMenu}>Training Overview</Link></li>
              <li><Link to="/training/trial-lessons" onClick={closeMenu}>Trial Lessons</Link></li>
              <li><Link to="/training/ppl" onClick={closeMenu}>Private Pilot License</Link></li>
              <li><Link to="/training/type-rating" onClick={closeMenu}>Type Rating</Link></li>
            </ul>
          </div>
          <div className="hq-menu-section">
            <h3>Services</h3>
            <ul>
              <li><Link to="/services" onClick={closeMenu}>Services Overview</Link></li>
              <li><Link to="/services/maintenance" onClick={closeMenu}>Maintenance</Link></li>
              <li><Link to="/self-fly-hire" onClick={closeMenu}>Self-Fly Hire</Link></li>
            </ul>
          </div>
          <div className="hq-menu-section">
            <h3>Experiences</h3>
            <ul>
              <li><Link to="/expeditions" onClick={closeMenu}>Expeditions</Link></li>
              <li><Link to="/expeditions/calendar" onClick={closeMenu}>Calendar</Link></li>
            </ul>
          </div>
          <div className="hq-menu-section">
            <h3>Contact</h3>
            <ul>
              <li><Link to="/contact" onClick={closeMenu}>Contact Us</Link></li>
              <li><Link to="/contact/pricing" onClick={closeMenu}>Pricing</Link></li>
            </ul>
          </div>
        </div>
      </div>

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
// INTERACTIVE SPECS CARD
// ============================================================================
function InteractiveSpecsCard({ specs, activeSpec, setActiveSpec }) {
  return (
    <div className="r22-specs-card">
      <div className="r22-specs-card__header">
        <span className="r22-specs-card__label">TECHNICAL DATA</span>
        <span className="r22-specs-card__model">R22 BETA II</span>
      </div>
      <div className="r22-specs-card__grid">
        {specs.map((spec, index) => (
          <motion.div
            key={index}
            className={`r22-specs-card__item ${activeSpec === index ? 'r22-specs-card__item--active' : ''}`}
            onClick={() => setActiveSpec(index)}
            whileHover={{ scale: 1.02 }}
            transition={{ type: 'spring', stiffness: 400 }}
          >
            <span className="r22-specs-card__item-label">{spec.label}</span>
            <span className="r22-specs-card__item-value">{spec.value}</span>
            <span className="r22-specs-card__item-unit">{spec.unit}</span>
          </motion.div>
        ))}
      </div>
      <div className="r22-specs-card__footer">
        <span className="r22-specs-card__note">Click any spec for details</span>
      </div>
    </div>
  );
}

// ============================================================================
// TIMELINE COMPONENT
// ============================================================================
function HistoryTimelineDots({ events }) {
  return (
    <div className="r22-timeline">
      {events.map((event, index) => (
        <Reveal key={index} delay={index * 0.1}>
          <div className="r22-timeline__item">
            <div className="r22-timeline__marker">
              <span className="r22-timeline__year">{event.year}</span>
              <div className="r22-timeline__dot" />
            </div>
            <div className="r22-timeline__content">
              <h4>{event.title}</h4>
              <p>{event.description}</p>
            </div>
          </div>
        </Reveal>
      ))}
      <div className="r22-timeline__line" />
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
    id: 'beta',
    name: 'R22 Beta',
    years: '1985–1995',
    engine: 'Lycoming O-320-B2C',
    power: '160 HP / 124 HP cont.',
    vne: '102 kts',
    cruise: '96 kts',
    range: '240 nm',
    mtow: '1,370 lb',
    usefulLoad: '440 lb',
    hoverIge: '9,400 ft',
    rotorDia: '25 ft 2 in',
    fuel: '19.2 US gal',
    seats: '2',
    floats: 'Skids',
    notable: 'Defined the modern trainer market.',
  },
  {
    id: 'beta-ii',
    name: 'R22 Beta II',
    years: '1996–Present',
    engine: 'Lycoming O-360-J2A',
    power: '145 HP / 131 HP cont.',
    vne: '102 kts',
    cruise: '96 kts',
    range: '240 nm',
    mtow: '1,370 lb',
    usefulLoad: '440 lb',
    hoverIge: '9,400 ft',
    rotorDia: '25 ft 2 in',
    fuel: '19.2 US gal',
    seats: '2',
    floats: 'Skids',
    notable: 'Current production model.',
  },
  {
    id: 'mariner',
    name: 'R22 Mariner',
    years: '1990–2010',
    engine: 'Lycoming O-360-J2A',
    power: '145 HP / 131 HP cont.',
    vne: '102 kts',
    cruise: '96 kts',
    range: '220 nm',
    mtow: '1,370 lb',
    usefulLoad: '400 lb',
    hoverIge: '9,400 ft',
    rotorDia: '25 ft 2 in',
    fuel: '19.2 US gal',
    seats: '2',
    floats: 'Pop-out floats',
    notable: 'Float-equipped coastal variant.',
  },
];

const R22_SPEC_ROWS = [
  { label: 'Powerplant', key: 'engine' },
  { label: 'Power (takeoff / continuous)', key: 'power' },
  { label: 'Maximum speed (Vne)', key: 'vne' },
  { label: 'Cruise speed', key: 'cruise' },
  { label: 'Range (no reserve)', key: 'range' },
  { label: 'Maximum gross weight', key: 'mtow' },
  { label: 'Useful load', key: 'usefulLoad' },
  { label: 'Hover ceiling IGE', key: 'hoverIge' },
  { label: 'Rotor diameter', key: 'rotorDia' },
  { label: 'Fuel capacity', key: 'fuel' },
  { label: 'Seats', key: 'seats' },
  { label: 'Landing gear', key: 'floats' },
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
          font-family: 'Share Tech Mono', 'Courier New', monospace;
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
          max-width: 700px;
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

        /* ===== COUNTER SECTION ===== */
        .r22-counter {
          padding: 6rem 2rem;
          background: #1a1a1a;
        }

        .r22-counter__container {
          max-width: 1000px;
          margin: 0 auto;
          display: flex;
          justify-content: center;
          gap: 3rem;
          flex-wrap: wrap;
        }

        .r22-counter__item {
          text-align: center;
        }

        .r22-counter__value {
          display: block;
          font-family: 'Share Tech Mono', monospace;
          font-size: 1.75rem;
          font-weight: 700;
          color: #fff;
        }

        .r22-counter__label {
          display: block;
          font-size: 0.65rem;
          color: rgba(255, 255, 255, 0.6);
          text-transform: uppercase;
          letter-spacing: 0.15em;
          margin-top: 0.25rem;
        }

        @media (max-width: 768px) {
          .r22-counter__container {
            gap: 2rem;
          }
          .r22-counter__value {
            font-size: 1.5rem;
          }
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
          position: relative;
          padding-left: 2.5rem;
        }

        .r22-timeline__line {
          position: absolute;
          left: 4px;
          top: 0;
          bottom: 0;
          width: 2px;
          background: #1a1a1a;
          z-index: 0;
        }

        .r22-timeline__item {
          position: relative;
          padding-bottom: 2.5rem;
        }

        .r22-timeline__marker {
          display: flex;
          align-items: center;
          gap: 1rem;
          margin-bottom: 0.75rem;
        }

        .r22-timeline__year {
          font-family: 'Share Tech Mono', monospace;
          font-size: 1.25rem;
          font-weight: 700;
          color: #1a1a1a;
        }

        .r22-timeline__dot {
          width: 10px;
          height: 10px;
          background: #1a1a1a;
          border-radius: 50%;
          position: absolute;
          left: -2.5rem;
          top: 0.5rem;
          z-index: 1;
        }

        .r22-timeline__content h4 {
          font-size: 1.1rem;
          margin: 0 0 0.5rem;
          text-transform: uppercase;
        }

        .r22-timeline__content p {
          color: #666;
          font-size: 0.95rem;
          line-height: 1.6;
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
        .r22-specs__split {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 4rem;
          align-items: start;
        }
        .r22-specs__blueprint img {
          width: 100%;
          height: auto;
          display: block;
          mix-blend-mode: multiply;
          opacity: 0.9;
        }
        .r22-specs__selector {
          display: flex;
          gap: 0.5rem;
          margin-bottom: 2rem;
          flex-wrap: wrap;
        }
        .r22-specs__chip {
          padding: 0.6rem 1.1rem;
          background: transparent;
          border: 1px solid rgba(26, 26, 26, 0.2);
          color: #4a4a4a;
          font-family: 'Share Tech Mono', monospace;
          font-size: 0.8rem;
          letter-spacing: 0.08em;
          cursor: pointer;
          transition: all 0.2s ease;
        }
        .r22-specs__chip:hover { border-color: #1a1a1a; color: #1a1a1a; }
        .r22-specs__chip.is-active {
          background: #1a1a1a;
          color: #fff;
          border-color: #1a1a1a;
        }
        .r22-specs__rows {
          display: flex;
          flex-direction: column;
          margin: 0;
        }
        .r22-specs__row {
          display: grid;
          grid-template-columns: 1fr auto;
          gap: 1rem;
          padding: 1rem 0;
          border-bottom: 1px solid rgba(26, 26, 26, 0.08);
          align-items: baseline;
        }
        .r22-specs__row dt {
          font-size: 0.85rem;
          color: #7a7a7a;
          text-transform: uppercase;
          letter-spacing: 0.1em;
          margin: 0;
        }
        .r22-specs__row dd {
          font-family: 'Share Tech Mono', monospace;
          font-size: 1rem;
          color: #1a1a1a;
          margin: 0;
          text-align: right;
        }
        @media (max-width: 900px) {
          .r22-specs__split { grid-template-columns: 1fr; gap: 2.5rem; }
          .r22-specs { padding: 5rem 1.5rem; position: relative; top: auto; }
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
          position: relative;
          padding: 8rem 2rem;
          min-height: 80vh;
          display: flex;
          align-items: center;
        }

        .r22-champion__bg {
          position: absolute;
          inset: 0;
          z-index: 1;
        }

        .r22-champion__bg img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }

        .r22-champion__overlay {
          position: absolute;
          inset: 0;
          background: linear-gradient(90deg, rgba(26,26,26,0.95) 0%, rgba(26,26,26,0.8) 60%, rgba(26,26,26,0.6) 100%);
        }

        .r22-champion__container {
          position: relative;
          z-index: 2;
          max-width: 900px;
          margin: 0 auto;
        }

        .r22-champion__content h2 {
          font-size: clamp(2rem, 5vw, 3.5rem);
          text-transform: uppercase;
          font-weight: 700;
          line-height: 1.1;
          margin-bottom: 2rem;
        }

        .r22-champion__achievement {
          display: flex;
          gap: 2rem;
          align-items: flex-start;
          margin-bottom: 2.5rem;
        }

        .r22-champion__medal {
          flex-shrink: 0;
          width: 100px;
          height: 100px;
          color: #d4af37;
        }

        .r22-champion__details h3 {
          font-size: 1.25rem;
          color: #fff;
          margin: 0 0 0.5rem;
          text-transform: uppercase;
        }

        .r22-champion__location {
          font-size: 0.85rem;
          color: #999;
          margin-bottom: 1rem;
        }

        .r22-champion__desc {
          color: rgba(255,255,255,0.8);
          font-size: 1rem;
          line-height: 1.8;
          margin-bottom: 1rem;
        }

        .r22-champion__distinction {
          color: #d4af37;
          font-size: 0.95rem;
        }

        .r22-champion__quote {
          background: rgba(255,255,255,0.05);
          border-left: 3px solid #d4af37;
          padding: 2rem;
          margin: 0 0 2.5rem;
        }

        .r22-champion__quote p {
          color: rgba(255,255,255,0.9);
          font-size: 1.15rem;
          font-style: italic;
          line-height: 1.8;
          margin: 0 0 1.5rem;
        }

        .r22-champion__quote cite {
          display: block;
          font-style: normal;
        }

        .r22-champion__quote cite strong {
          display: block;
          color: #fff;
          font-size: 0.9rem;
          text-transform: uppercase;
          letter-spacing: 0.1em;
        }

        .r22-champion__quote cite span {
          font-size: 0.75rem;
          color: #888;
        }

        .r22-champion__stats {
          display: flex;
          gap: 3rem;
        }

        .r22-champion__stat {
          text-align: center;
        }

        .r22-champion__stat-value {
          display: block;
          font-family: 'Share Tech Mono', monospace;
          font-size: 2rem;
          font-weight: 700;
          color: #d4af37;
        }

        .r22-champion__stat-label {
          font-size: 0.65rem;
          color: #888;
          text-transform: uppercase;
          letter-spacing: 0.15em;
        }

        /* ===== VARIANTS SECTION ===== */
        .r22-variants {
          padding: 8rem 2rem;
          background: #fff;
        }

        .r22-variants__container {
          max-width: 900px;
          margin: 0 auto;
        }

        .r22-variants__tabs {
          display: flex;
          justify-content: center;
          gap: 1rem;
          margin-bottom: 3rem;
        }

        .r22-variants__tab {
          padding: 0.75rem 1.5rem;
          font-size: 0.75rem;
          font-weight: 500;
          text-transform: uppercase;
          letter-spacing: 0.1em;
          background: transparent;
          border: 2px solid #e8e6e2;
          cursor: pointer;
          transition: all 0.3s ease;
          font-family: inherit;
        }

        .r22-variants__tab:hover {
          border-color: #1a1a1a;
        }

        .r22-variants__tab--active {
          background: #1a1a1a;
          border-color: #1a1a1a;
          color: #fff;
        }

        .r22-variants__content {
          background: #faf9f6;
          padding: 3rem;
          border-radius: 8px;
        }

        .r22-variants__header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 1rem;
        }

        .r22-variants__header h3 {
          font-size: 1.5rem;
          margin: 0;
          text-transform: uppercase;
        }

        .r22-variants__years {
          font-family: 'Share Tech Mono', monospace;
          font-size: 0.9rem;
          color: #888;
        }

        .r22-variants__engine {
          font-family: 'Share Tech Mono', monospace;
          font-size: 0.85rem;
          color: #666;
          margin-bottom: 1.5rem;
        }

        .r22-variants__description {
          color: #555;
          font-size: 1rem;
          line-height: 1.8;
          margin-bottom: 1.5rem;
        }

        .r22-variants__features {
          list-style: none;
          padding: 0;
          margin: 0;
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 0.75rem;
        }

        .r22-variants__features li {
          font-size: 0.9rem;
          color: #666;
          padding-left: 1.5rem;
          position: relative;
        }

        .r22-variants__features li::before {
          content: '';
          position: absolute;
          left: 0;
          top: 0.5rem;
          width: 8px;
          height: 8px;
          background: #1a1a1a;
        }

        .r22-variants__pdfs {
          display: flex;
          flex-wrap: wrap;
          gap: 0.5rem;
          margin-top: 1.5rem;
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

        /* ===== TRAINING SECTION ===== */
        .r22-training {
          padding: 6rem 2rem;
          background: #faf9f6;
        }

        .r22-training__container {
          max-width: 1200px;
          margin: 0 auto;
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 4rem;
          align-items: center;
        }

        .r22-training__header {
          margin-bottom: 2.5rem;
        }

        .r22-training__header h2 {
          font-size: clamp(1.75rem, 3vw, 2.5rem);
          text-transform: uppercase;
          font-weight: 700;
          line-height: 1.1;
        }

        .r22-training__grid {
          display: flex;
          flex-direction: column;
          gap: 1.5rem;
          margin-bottom: 3rem;
        }

        .r22-training__reason {
          display: flex;
          gap: 1.5rem;
          padding: 1.5rem;
          background: #fff;
          border-radius: 8px;
          border: 1px solid #e8e6e2;
        }

        .r22-training__reason-num {
          font-family: 'Share Tech Mono', monospace;
          font-size: 1.5rem;
          font-weight: 700;
          color: #ddd;
          flex-shrink: 0;
        }

        .r22-training__reason-content h4 {
          font-size: 1rem;
          margin: 0 0 0.5rem;
          text-transform: uppercase;
        }

        .r22-training__reason-content p {
          color: #666;
          font-size: 0.9rem;
          line-height: 1.7;
          margin: 0;
        }

        .r22-training__benefits {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 1.5rem;
        }

        .r22-training__benefit {
          text-align: center;
          padding: 1.5rem;
          background: #fff;
          border-radius: 8px;
          border: 1px solid #e8e6e2;
        }

        .r22-training__benefit-value {
          display: block;
          font-family: 'Share Tech Mono', monospace;
          font-size: 2rem;
          font-weight: 700;
          color: #1a1a1a;
        }

        .r22-training__benefit-title {
          display: block;
          font-size: 0.85rem;
          font-weight: 600;
          text-transform: uppercase;
          margin: 0.5rem 0;
        }

        .r22-training__benefit-desc {
          font-size: 0.75rem;
          color: #888;
        }

        .r22-training__image {
          border-radius: 8px;
          overflow: hidden;
        }

        .r22-training__image img {
          width: 100%;
          height: auto;
          display: block;
        }

        /* ===== GALLERY SECTION ===== */
        .r22-gallery {
          padding: 8rem 2rem;
          background: #fff;
        }

        .r22-gallery__container {
          max-width: 1200px;
          margin: 0 auto;
        }

        .r22-gallery__grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 1.5rem;
        }

        .r22-gallery__item {
          position: relative;
          overflow: hidden;
          border-radius: 8px;
          cursor: pointer;
          aspect-ratio: 4/3;
        }

        .r22-gallery__item:nth-child(1) {
          grid-column: span 2;
        }

        .r22-gallery__item img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          transition: transform 0.5s ease;
        }

        .r22-gallery__item:hover img {
          transform: scale(1.05);
        }

        .r22-gallery__overlay {
          position: absolute;
          inset: 0;
          background: rgba(26,26,26,0.6);
          display: flex;
          align-items: center;
          justify-content: center;
          opacity: 0;
          transition: opacity 0.3s ease;
        }

        .r22-gallery__item:hover .r22-gallery__overlay {
          opacity: 1;
        }

        .r22-gallery__overlay span {
          color: #fff;
          font-size: 0.75rem;
          text-transform: uppercase;
          letter-spacing: 0.2em;
          padding: 0.75rem 1.5rem;
          border: 1px solid #fff;
        }

        /* Lightbox */
        .r22-lightbox {
          position: fixed;
          inset: 0;
          z-index: 9999;
          background: rgba(0,0,0,0.95);
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 2rem;
        }

        .r22-lightbox__content {
          position: relative;
          max-width: 90vw;
          max-height: 90vh;
        }

        .r22-lightbox__content img {
          max-width: 100%;
          max-height: 85vh;
          object-fit: contain;
        }

        .r22-lightbox__close {
          position: absolute;
          top: -40px;
          right: 0;
          background: none;
          border: none;
          color: #fff;
          font-size: 0.75rem;
          text-transform: uppercase;
          letter-spacing: 0.2em;
          cursor: pointer;
        }

        /* ===== CTA SECTION ===== */
        .r22-cta {
          padding: 6rem 2rem;
          background: #faf9f6;
        }

        .r22-cta__container {
          max-width: 800px;
          margin: 0 auto;
          text-align: center;
        }

        .r22-cta__content h2 {
          font-size: clamp(2rem, 4vw, 3rem);
          text-transform: uppercase;
          font-weight: 700;
          line-height: 1.1;
          margin-bottom: 1.5rem;
        }

        .r22-cta__content p {
          color: #666;
          font-size: 1.1rem;
          line-height: 1.8;
          margin-bottom: 2.5rem;
        }

        .r22-cta__buttons {
          display: flex;
          gap: 1rem;
          justify-content: center;
          flex-wrap: wrap;
        }

        /* ===== RESPONSIVE ===== */
        @media (max-width: 1024px) {
          .r22-hero__bg {
            width: 50%;
          }

          .r22-history__content,
          .r22-training__container {
            grid-template-columns: 1fr;
            gap: 3rem;
          }

          .r22-characteristics__grid {
            grid-template-columns: 1fr;
          }

          .r22-champion__achievement {
            flex-direction: column;
            align-items: center;
            text-align: center;
          }

          .r22-champion__stats {
            justify-content: center;
          }

          .r22-gallery__grid {
            grid-template-columns: repeat(2, 1fr);
          }

          .r22-gallery__item:nth-child(1) {
            grid-column: span 1;
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

          .r22-variants__tabs {
            flex-wrap: wrap;
          }

          .r22-variants__features {
            grid-template-columns: 1fr;
          }

          .r22-training__benefits {
            grid-template-columns: 1fr;
          }

          .r22-gallery__grid {
            grid-template-columns: 1fr;
          }

          .r22-cta__buttons {
            flex-direction: column;
          }

          .r22-cta__buttons .r22-btn {
            width: 100%;
          }
        }

        /* ===== SAFETY FEATURES SECTION ===== */
        .r22-safety {
          padding: 6rem 2rem;
          background: #fff;
        }

        .r22-safety__container {
          max-width: 1200px;
          margin: 0 auto;
        }

        .r22-safety__grid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 1.5rem;
          margin-bottom: 3rem;
        }

        .r22-safety__card {
          background: #faf9f6;
          padding: 2rem;
          border-radius: 8px;
          border: 1px solid #e8e6e2;
          transition: all 0.3s ease;
        }

        .r22-safety__card:hover {
          border-color: #1a1a1a;
        }

        .r22-safety__icon {
          width: 48px;
          height: 48px;
          margin-bottom: 1.5rem;
          color: #1a1a1a;
        }

        .r22-safety__icon svg {
          width: 100%;
          height: 100%;
        }

        .r22-safety__card h4 {
          font-size: 1rem;
          margin: 0 0 0.75rem;
          text-transform: uppercase;
          letter-spacing: 0.02em;
        }

        .r22-safety__card p {
          color: #666;
          font-size: 0.85rem;
          line-height: 1.7;
          margin: 0;
        }

        .r22-safety__stats {
          display: flex;
          justify-content: center;
          margin-bottom: 3rem;
        }

        .r22-safety__stat {
          display: flex;
          align-items: center;
          gap: 1.5rem;
          padding: 2rem 3rem;
          background: #1a1a1a;
          border-radius: 8px;
          flex-wrap: wrap;
          justify-content: center;
        }

        .r22-safety__stat-value {
          font-family: 'Share Tech Mono', monospace;
          font-size: 3rem;
          font-weight: 700;
          color: #fff;
        }

        .r22-safety__stat-value--highlight {
          color: #4ade80;
        }

        .r22-safety__stat-arrow {
          font-size: 2rem;
          color: #666;
        }

        .r22-safety__stat-label {
          font-size: 0.8rem;
          color: #888;
          text-transform: uppercase;
          letter-spacing: 0.1em;
          flex-basis: 100%;
          text-align: center;
          margin-top: 0.5rem;
        }

        .r22-safety__rotor-info {
          background: #faf9f6;
          padding: 3rem;
          border-radius: 8px;
          border: 1px solid #e8e6e2;
        }

        .r22-safety__rotor-header {
          margin-bottom: 1.5rem;
        }

        .r22-safety__rotor-header h3 {
          font-size: 1.25rem;
          margin: 0;
          text-transform: uppercase;
        }

        .r22-safety__rotor-content p {
          color: #555;
          font-size: 1rem;
          line-height: 1.8;
          margin-bottom: 1.5rem;
        }

        .r22-safety__rotor-content p:last-of-type {
          margin-bottom: 2rem;
        }

        .r22-safety__rotor-points {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 1.5rem;
        }

        .r22-safety__rotor-point {
          padding: 1.5rem;
          background: #fff;
          border-radius: 4px;
          border-left: 3px solid #1a1a1a;
        }

        .r22-safety__rotor-point-title {
          display: block;
          font-family: 'Share Tech Mono', monospace;
          font-size: 0.9rem;
          font-weight: 600;
          color: #1a1a1a;
          text-transform: uppercase;
          margin-bottom: 0.25rem;
        }

        .r22-safety__rotor-point-desc {
          font-size: 0.8rem;
          color: #666;
        }

        /* ===== TRAINING REQUIREMENTS SECTION ===== */
        .r22-requirements {
          padding: 6rem 2rem;
          background: #faf9f6;
        }

        .r22-requirements__container {
          max-width: 1200px;
          margin: 0 auto;
        }

        .r22-requirements__content {
          display: grid;
          grid-template-columns: 1.2fr 1fr;
          gap: 3rem;
          align-items: start;
        }

        .r22-requirements__main {
          display: flex;
          flex-direction: column;
          gap: 2rem;
        }

        .r22-requirements__block {
          background: #fff;
          padding: 2rem;
          border-radius: 8px;
          border: 1px solid #e8e6e2;
        }

        .r22-requirements__block-header {
          display: flex;
          align-items: center;
          gap: 1.5rem;
          margin-bottom: 1.5rem;
          padding-bottom: 1rem;
          border-bottom: 1px solid #e8e6e2;
        }

        .r22-requirements__block-num {
          font-family: 'Share Tech Mono', monospace;
          font-size: 1.5rem;
          font-weight: 700;
          color: #ddd;
        }

        .r22-requirements__block-header h3 {
          font-size: 1.1rem;
          margin: 0;
          text-transform: uppercase;
        }

        .r22-requirements__list {
          list-style: none;
          padding: 0;
          margin: 0;
        }

        .r22-requirements__list li {
          position: relative;
          padding-left: 1.5rem;
          font-size: 0.95rem;
          color: #555;
          line-height: 1.7;
          margin-bottom: 0.75rem;
        }

        .r22-requirements__list li:last-child {
          margin-bottom: 0;
        }

        .r22-requirements__list li::before {
          content: '';
          position: absolute;
          left: 0;
          top: 0.6rem;
          width: 6px;
          height: 6px;
          background: #1a1a1a;
        }

        .r22-requirements__sidebar {
          display: flex;
          flex-direction: column;
          gap: 2rem;
        }

        .r22-requirements__sfar {
          background: #1a1a1a;
          padding: 2rem;
          border-radius: 8px;
          color: #fff;
        }

        .r22-requirements__sfar-label {
          display: inline-block;
          font-family: 'Share Tech Mono', monospace;
          font-size: 0.7rem;
          letter-spacing: 0.2em;
          color: #d4af37;
          padding: 0.35rem 0.75rem;
          border: 1px solid #d4af37;
          margin-bottom: 1rem;
        }

        .r22-requirements__sfar h4 {
          font-size: 1rem;
          margin: 0 0 1rem;
          text-transform: uppercase;
          color: #fff;
        }

        .r22-requirements__sfar > p {
          font-size: 0.9rem;
          color: rgba(255, 255, 255, 0.7);
          line-height: 1.7;
          margin-bottom: 1.5rem;
        }

        .r22-requirements__sfar-list {
          list-style: none;
          padding: 0;
          margin: 0;
        }

        .r22-requirements__sfar-list li {
          font-size: 0.85rem;
          color: rgba(255, 255, 255, 0.8);
          line-height: 1.6;
          margin-bottom: 0.75rem;
          padding-left: 1rem;
          border-left: 2px solid #333;
        }

        .r22-requirements__sfar-list li:last-child {
          margin-bottom: 0;
        }

        .r22-requirements__sfar-list li strong {
          color: #d4af37;
          font-weight: 600;
        }

        .r22-requirements__transition {
          background: #fff;
          padding: 2rem;
          border-radius: 8px;
          border: 1px solid #e8e6e2;
        }

        .r22-requirements__transition h4 {
          font-size: 1rem;
          margin: 0 0 1rem;
          text-transform: uppercase;
        }

        .r22-requirements__transition p {
          font-size: 0.95rem;
          color: #555;
          line-height: 1.7;
          margin-bottom: 1.5rem;
        }

        .r22-requirements__transition-benefits {
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
        }

        .r22-requirements__transition-benefits span {
          font-family: 'Share Tech Mono', monospace;
          font-size: 0.8rem;
          color: #1a1a1a;
          padding: 0.5rem 1rem;
          background: #faf9f6;
          border-left: 3px solid #1a1a1a;
        }

        /* Responsive for new sections */
        @media (max-width: 1024px) {
          .r22-safety__grid {
            grid-template-columns: repeat(2, 1fr);
          }

          .r22-safety__rotor-points {
            grid-template-columns: 1fr;
          }

          .r22-requirements__content {
            grid-template-columns: 1fr;
          }
        }

        @media (max-width: 768px) {
          .r22-safety__grid {
            grid-template-columns: 1fr;
          }

          .r22-safety__stat {
            padding: 1.5rem 2rem;
          }

          .r22-safety__stat-value {
            font-size: 2rem;
          }

          .r22-safety__rotor-info {
            padding: 2rem;
          }

          .r22-requirements__block-header {
            flex-direction: column;
            align-items: flex-start;
            gap: 0.75rem;
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
            actually teach on — a gap the industry had failed to close in thirty years.
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
            rotorcraft at a mechanical level — and that understanding transfers to every aircraft
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
// R22 COUNTER (FLEET STATISTICS)
// ============================================================================
function R22Counter() {
  return (
    <section className="r22-counter">
      <div className="r22-counter__container">
        <div className="r22-counter__item">
          <span className="r22-counter__value">4,800+</span>
          <span className="r22-counter__label">Aircraft Delivered</span>
        </div>
        <div className="r22-counter__item">
          <span className="r22-counter__value">45+</span>
          <span className="r22-counter__label">Years In Production</span>
        </div>
        <div className="r22-counter__item">
          <span className="r22-counter__value">#1</span>
          <span className="r22-counter__label">Training Helicopter</span>
        </div>
        <div className="r22-counter__item">
          <span className="r22-counter__value">100+</span>
          <span className="r22-counter__label">Countries Operating</span>
        </div>
        <div className="r22-counter__item">
          <span className="r22-counter__value">88%</span>
          <span className="r22-counter__label">Reduction in Fatal Accidents (1982-1997)</span>
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
    { year: '1973', title: 'Design Begins', description: 'Frank D. Robinson begins designing the R22, pursuing his vision of an affordable, reliable light helicopter for the private market.' },
    { year: '1975', title: 'First Flight', description: 'The R22 prototype takes to the skies, demonstrating the viability of Robinson\'s revolutionary design approach.' },
    { year: '1979', title: 'Production Begins', description: 'Robinson Helicopter Company begins production of the R22, launching the most successful light helicopter program in history.' },
    { year: '1996', title: 'Beta II Introduction', description: 'The improved R22 Beta II model launches with enhanced performance and safety features.' },
    { year: '1997', title: 'Safety Milestone', description: 'Fatal accident rate drops to 0.7 per 100,000 flight hours, down from 6.0 in 1982, following implementation of the Robinson Pilot Safety Course.' },
    { year: '2012', title: 'World Champion Aircraft', description: 'Captain Quentin Smith wins the World Helicopter Aerobatic Championship in Russia flying the R22.' },
    { year: '2024', title: '4,800+ Built', description: 'Over 4,800 R22 helicopters delivered worldwide, making it the most popular training helicopter ever produced.' },
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
            <HistoryTimelineDots events={historyEvents} />
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
  const [activeVariantId, setActiveVariantId] = useState('beta-ii');
  const activeVariant = R22_VARIANT_DATA.find((v) => v.id === activeVariantId)
    ?? R22_VARIANT_DATA[0];

  return (
    <section className="r22-specs" data-cms-section="r22-specifications">
      <div className="r22-specs__inner">
        <div className="r22-specs__header">
          <span className="r22-pre-text">Specifications</span>
          <h2>Anatomy of a trainer</h2>
        </div>
        <div className="r22-specs__split">
          <div className="r22-specs__blueprint">
            <img
              src="/assets/images/new-aircraft/r22/r22blueprint.jpg"
              alt="R22 blueprint"
              loading="lazy"
            />
          </div>
          <div className="r22-specs__table">
            <div className="r22-specs__selector">
              {R22_VARIANT_DATA.map((v) => (
                <button
                  key={v.id}
                  type="button"
                  className={`r22-specs__chip ${activeVariantId === v.id ? 'is-active' : ''}`}
                  onClick={() => setActiveVariantId(v.id)}
                >
                  {v.name}
                </button>
              ))}
            </div>
            <dl className="r22-specs__rows">
              {R22_SPEC_ROWS.map((row) => (
                <div key={row.key} className="r22-specs__row">
                  <dt>{row.label}</dt>
                  <dd>{activeVariant[row.key]}</dd>
                </div>
              ))}
            </dl>
          </div>
        </div>
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
function R22Champion() {
  return (
    <section className="r22-champion r22-champion--compact">
      <div className="r22-champion__bg">
        <img
          src="/assets/images/used-aircraft/r22/british-team-r22.webp"
          alt="British Team R22"
        />
        <div className="r22-champion__overlay" />
      </div>

      <div className="r22-champion__container">
        <div className="r22-champion__content">
          <Reveal>
            <h2>
              <span className="r22-text--white">World Champion</span>{' '}
              <span className="r22-text--gold">Quentin Smith</span>
            </h2>
            <p className="r22-champion__desc">
              2x World Helicopter Aerobatic Champion flying the Robinson R22.
              The only pilot to win multiple championships in this aircraft.
            </p>
          </Reveal>

          <Reveal delay={0.2}>
            <div className="r22-champion__stats">
              <div className="r22-champion__stat">
                <span className="r22-champion__stat-value">2x</span>
                <span className="r22-champion__stat-label">World Champion</span>
              </div>
              <div className="r22-champion__stat">
                <span className="r22-champion__stat-value">18,000+</span>
                <span className="r22-champion__stat-label">Flight Hours</span>
              </div>
              <div className="r22-champion__stat">
                <span className="r22-champion__stat-value">35+</span>
                <span className="r22-champion__stat-label">Years Flying</span>
              </div>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}

// ============================================================================
// R22 VARIANTS
// ============================================================================
function R22Variants() {
  const [activeVariant, setActiveVariant] = useState(0);

  // Shared R22 family downloads
  const R22_BROCHURE = 'https://robinsonstrapistorprod.blob.core.windows.net/uploads/assets/RH_R22_US_Digital_Corporate_Brochure_Feb_2026_76bb67b86e.pdf';
  const R22_EOC = 'https://robinsonstrapistorprod.blob.core.windows.net/uploads/assets/r22_eoc_2026_5cc7166f5c.pdf';

  const variants = [
    {
      name: 'R22 Beta',
      years: '1985-1995',
      engine: 'O-320-B2C (160 HP)',
      description: 'The original production model that established the R22 as the world\'s most cost-effective training helicopter.',
      features: ['Lycoming O-320 engine', '2-blade main rotor', 'Standard instrumentation'],
      pdfs: { brochure: R22_BROCHURE, eoc: R22_EOC },
    },
    {
      name: 'R22 Beta II',
      years: '1996-Present',
      engine: 'O-360-J2A (180 HP)',
      description: 'The current production model featuring increased power, improved rotor blades, and enhanced safety systems.',
      features: ['20% more power', 'Improved rotor dynamics', 'Enhanced safety features', 'Better hot & high performance'],
      pdfs: { brochure: R22_BROCHURE, eoc: R22_EOC },
    },
    {
      name: 'R22 Mariner',
      years: '1990-2010',
      engine: 'O-360-J2A (180 HP)',
      description: 'A specialized float-equipped variant designed for water operations and maritime applications.',
      features: ['Pop-out floats', 'Corrosion protection', 'Marine equipment', 'Water landing capability'],
      pdfs: { brochure: R22_BROCHURE, eoc: R22_EOC },
    },
  ];

  return (
    <section className="r22-variants">
      <div className="r22-variants__container">
        <Reveal>
          <div className="r22-section-header">
            <span className="r22-pre-text">Models</span>
            <h2>
              <span className="r22-text--dark">R22</span>{' '}
              <span className="r22-text--mid">Variants</span>
            </h2>
          </div>
        </Reveal>

        <div className="r22-variants__tabs">
          {variants.map((variant, index) => (
            <button
              key={index}
              className={`r22-variants__tab ${activeVariant === index ? 'r22-variants__tab--active' : ''}`}
              onClick={() => setActiveVariant(index)}
            >
              {variant.name}
            </button>
          ))}
        </div>

        <AnimatePresence mode="wait">
          <motion.div
            key={activeVariant}
            className="r22-variants__content"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
          >
            <div className="r22-variants__info">
              <div className="r22-variants__header">
                <h3>{variants[activeVariant].name}</h3>
                <span className="r22-variants__years">{variants[activeVariant].years}</span>
              </div>
              <p className="r22-variants__engine">{variants[activeVariant].engine}</p>
              <p className="r22-variants__description">{variants[activeVariant].description}</p>
              <ul className="r22-variants__features">
                {variants[activeVariant].features.map((feature, i) => (
                  <li key={i}>{feature}</li>
                ))}
              </ul>
              {variants[activeVariant].pdfs && (
                <div className="r22-variants__pdfs">
                  {variants[activeVariant].pdfs.brochure && (
                    <a
                      href={variants[activeVariant].pdfs.brochure}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="r22-variants__pdf-pill"
                    >
                      <i className="fas fa-file-pdf" aria-hidden="true"></i>
                      <span>Brochure</span>
                    </a>
                  )}
                  {variants[activeVariant].pdfs.eoc && (
                    <a
                      href={variants[activeVariant].pdfs.eoc}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="r22-variants__pdf-pill"
                    >
                      <i className="fas fa-file-pdf" aria-hidden="true"></i>
                      <span>Operating Costs</span>
                    </a>
                  )}
                </div>
              )}
            </div>
          </motion.div>
        </AnimatePresence>
      </div>
    </section>
  );
}

// ============================================================================
// R22 TRAINING
// ============================================================================
function R22Training() {
  const trainingBenefits = [
    { title: 'Cost Effective', value: '50%', desc: 'Lower operating costs than other helicopters' },
    { title: 'Skill Transfer', value: '100%', desc: 'Skills transfer directly to larger types' },
    { title: 'Industry Standard', value: '#1', desc: 'Most used training helicopter worldwide' },
  ];

  return (
    <section className="r22-training">
      <div className="r22-training__container">
        <div className="r22-training__content">
          <Reveal>
            <div className="r22-training__header">
              <span className="r22-pre-text">Learn to Fly</span>
              <h2>
                <span className="r22-text--dark">Why R22</span>{' '}
                <span className="r22-text--mid">For PPL</span>{' '}
                <span className="r22-text--light">Training</span>
              </h2>
            </div>
          </Reveal>

          <div className="r22-training__grid">
            <Reveal delay={0.1}>
              <div className="r22-training__reason">
                <div className="r22-training__reason-num">01</div>
                <div className="r22-training__reason-content">
                  <h4>Cost Effective</h4>
                  <p>
                    The R22 offers the lowest operating costs of any production helicopter, making
                    your path to a PPL(H) more affordable without compromising on quality training.
                  </p>
                </div>
              </div>
            </Reveal>

            <Reveal delay={0.2}>
              <div className="r22-training__reason">
                <div className="r22-training__reason-num">02</div>
                <div className="r22-training__reason-content">
                  <h4>Develops Superior Skills</h4>
                  <p>
                    The R22's responsive controls and low-inertia rotor system demand precision,
                    developing skills that transfer directly to larger, more complex helicopters.
                  </p>
                </div>
              </div>
            </Reveal>

            <Reveal delay={0.3}>
              <div className="r22-training__reason">
                <div className="r22-training__reason-num">03</div>
                <div className="r22-training__reason-content">
                  <h4>Industry Standard</h4>
                  <p>
                    More pilots have learned to fly helicopters in the R22 than any other aircraft.
                    It's the benchmark against which all training helicopters are measured.
                  </p>
                </div>
              </div>
            </Reveal>

            <Reveal delay={0.4}>
              <div className="r22-training__reason">
                <div className="r22-training__reason-num">04</div>
                <div className="r22-training__reason-content">
                  <h4>Proven Safety Record</h4>
                  <p>
                    With proper training and adherence to Robinson's safety protocols, the R22
                    has an excellent safety record spanning decades of service worldwide.
                  </p>
                </div>
              </div>
            </Reveal>
          </div>

          <Reveal delay={0.5}>
            <div className="r22-training__benefits">
              {trainingBenefits.map((benefit, index) => (
                <div key={index} className="r22-training__benefit">
                  <span className="r22-training__benefit-value">{benefit.value}</span>
                  <span className="r22-training__benefit-title">{benefit.title}</span>
                  <span className="r22-training__benefit-desc">{benefit.desc}</span>
                </div>
              ))}
            </div>
          </Reveal>
        </div>

        <Reveal delay={0.2} direction="right">
          <div className="r22-training__image">
            <img
              src="/assets/images/used-aircraft/r22/hq-r22-lineup.jpg"
              alt="HQ Aviation R22 Fleet"
            />
          </div>
        </Reveal>
      </div>
    </section>
  );
}

// ============================================================================
// R22 GALLERY
// ============================================================================
function R22Gallery({ pageImages }) {
  const [lightboxImage, setLightboxImage] = useState(null);
  const cmsGallery = (pageImages['r22-gallery'] ?? SECTION_MAP['r22-gallery'].images).map(img => ({ src: img.url, alt: img.alt }));

  // Gallery images
  const galleryImages = [
    { src: '/assets/images/new-aircraft/r22/r22-cutout.png', alt: 'R22 Cutout View' },
    { src: '/assets/images/new-aircraft/r22/r22-red-volcano-front-alpha-v3.png', alt: 'R22 Front View' },
    { src: '/assets/images/new-aircraft/r22/r22blueprint.jpg', alt: 'R22 Blueprint' },
    { src: '/assets/images/used-aircraft/r22/british-team-r22.webp', alt: 'British Team R22' },
    { src: '/assets/images/used-aircraft/r22/hq-r22-lineup.jpg', alt: 'HQ R22 Fleet' },
  ];

  return (
    <section className="r22-gallery" data-cms-section="r22-gallery">
      <div className="r22-gallery__container">
        <Reveal>
          <div className="r22-section-header">
            <span className="r22-pre-text">Visual</span>
            <h2>
              <span className="r22-text--dark">R22</span>{' '}
              <span className="r22-text--mid">Gallery</span>
            </h2>
          </div>
        </Reveal>

        <div className="r22-gallery__grid">
          {cmsGallery.map((image, index) => (
            <Reveal key={index} delay={index * 0.1}>
              <motion.div
                className="r22-gallery__item"
                whileHover={{ scale: 1.02 }}
                onClick={() => setLightboxImage(image)}
              >
                <img src={image.src} alt={image.alt} />
                <div className="r22-gallery__overlay">
                  <span>View</span>
                </div>
              </motion.div>
            </Reveal>
          ))}
        </div>
      </div>

      {/* Lightbox */}
      <AnimatePresence>
        {lightboxImage && (
          <motion.div
            className="r22-lightbox"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setLightboxImage(null)}
          >
            <motion.div
              className="r22-lightbox__content"
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.9 }}
            >
              <img src={lightboxImage.src} alt={lightboxImage.alt} />
              <button className="r22-lightbox__close" onClick={() => setLightboxImage(null)}>
                Close
              </button>
            </motion.div>
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
  return (
    <section className="r22-cta">
      <div className="r22-cta__container">
        <Reveal>
          <div className="r22-cta__content">
            <span className="r22-pre-text">Ready to Begin?</span>
            <h2>
              <span className="r22-text--dark">Start Your</span>{' '}
              <span className="r22-text--mid">R22</span>{' '}
              <span className="r22-text--light">Journey</span>
            </h2>
            <p>
              Whether you're looking to learn to fly, purchase an R22, or simply experience
              the thrill of helicopter flight, HQ Aviation is here to help you achieve your dreams.
            </p>
            <div className="r22-cta__buttons">
              <Link to="/contact" className="r22-btn r22-btn--primary">
                Enquire about Aircraft
              </Link>
              <Link to="/training/ppl" className="r22-btn r22-btn--outline">
                Learn to Fly
              </Link>
            </div>
          </div>
        </Reveal>
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
      <div className="r22-sticky-stack">
        <R22Highlights />
        <R22Introduction />
        <R22Specifications />
      </div>
      <R22FlightCharacteristics />
      <R22Counter />
      <R22HistoryTimeline />
      <R22Champion />
      <R22Variants />
      <R22Training />
      <R22Gallery pageImages={pageImages} />
      <R22CTA />
      <FooterMinimal />
    </div>
  );
}

export default AircraftR22;

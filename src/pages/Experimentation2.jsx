/**
 * HQ AVIATION - FINAL DRAFT HERO
 *
 * Incorporates feedback from multiple hero variations:
 * - hero-80: Asymmetric layout with fixed side images
 * - hero-81: Progressive line/text animations
 * - hero-83: Horizontal accordion navigation
 * - hero-87: Monochrome typography
 * - hero-17: Scroll prompt
 * - hero-43: Mono Sans typography
 * - hero-66: Vertical dividers
 * - hero-69: Coordinates element
 * - hero-74: Varying font colors (luxury feel)
 */

import { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { motion, useScroll, useTransform, useSpring, useInView } from 'framer-motion';

// Import all styles - Header/Navigation styles included via main.css
import '../assets/css/main.css';
import '../assets/css/components.css';

// Scroll path animation component
import ScrollPathAnimation from '../components/ScrollPathAnimation';

// Footer component
import FooterMinimal from '../components/FooterMinimal';

// Union Jack component - black and white version
const UnionJack = ({ size = 20, className = '', id = '' }) => (
  <img
    src="/assets/images/icons/Union Jack.svg"
    alt="UK"
    className={`union-jack union-jack--${id} ${className}`}
    style={{
      width: size,
      height: 'auto',
      filter: 'grayscale(100%) contrast(1.2)',
      opacity: 0.7,
    }}
  />
);

// Awesome Components
import EditorialGrid from '../components/AwesomeComponents/EditorialGrid';
// Blog posts data
import blogPosts from '../blog/posts.json';
import ExpeditionBarcode from '../components/Expeditions/ExpeditionBarcode';

// ============================================
// Blog Section Constants
// ============================================
const BLOG_PERSONAS = [
  { id: 'press', headline: 'In the Press', subtitle: 'Publications & media features', categories: ['Press'], icon: '01' },
  { id: 'learner', headline: 'Learn to Fly', subtitle: 'Training & safety fundamentals', categories: ['Training', 'Safety'], icon: '02' },
  { id: 'owner', headline: 'Own an Aircraft', subtitle: 'Purchase, maintain & manage', categories: ['Ownership', 'Aircraft', 'Maintenance'], icon: '03' },
  { id: 'pilot', headline: 'Fly Somewhere', subtitle: 'Routes, airspace & operations', categories: ['Operations', 'Safety', 'Training'], icon: '04' },
  { id: 'adventurer', headline: 'Go Further', subtitle: 'Lifestyle, travel & exploration', categories: ['Lifestyle', 'Operations', 'Aircraft'], icon: '05' },
];

// Curated popularity ranking (simulated engagement order)
const POPULAR_POST_IDS = [
  'ppl-guide', 'london-heli-lanes', 'flyer-magazine-feature', 'ownership-vs-hire',
  'fly-to-lunch', 'autorotations', 'r44-buyers-guide', 'pilot-mag-r66-review',
  'mastering-the-hover', 'cross-channel', 'weather-decisions', 'night-rating',
  'heli-ops-training-spotlight', 'leaseback-program', 'maintenance-check',
  'superyacht-operations', 'pre-flight-walkaround', 'turbine-flight', 'winter-flying',
  'vertical-mag-leaseback', 'lte-awareness', 'r22-first-solo', 'fuel-management',
  'radio-telephony', 'medical-certificates', 'hangarage-guide', 'flight-instructor',
  'confined-areas', 'rr300-engine', 'annual-inspection', 'why-we-fly',
];

const formatBlogDate = (dateStr) => {
  const d = new Date(dateStr + 'T00:00:00');
  return d.toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });
};


// ============================================
// Service Center Card — Cloud Frost (cert-114 style)
// ============================================
function ServiceSplitDots() {
  const [expanded, setExpanded] = useState(false);
  return (
    <div className="cert-cloud">
      <div className={`cert-cloud__card ${expanded ? 'cert-cloud__card--expanded' : ''}`} onClick={() => setExpanded(!expanded)}>
        <div className="cert-cloud__dots"></div>
        <div className="cert-cloud__split">
          <div className="cert-cloud__upper">
            <img src="/assets/images/robinson-assets/logos/rhc_authorized-service-center-logo-logo-yellow-rotor-black-type.svg" alt="Robinson Authorized Service Center" className="cert-cloud__logo" />
          </div>
          <div className="cert-cloud__lower">
            <span className="cert-cloud__guimbal-amp">&amp;</span>
            <div className="cert-cloud__guimbal-text">
              <span className="cert-cloud__guimbal-name">GUIMBAL</span>
              <span className="cert-cloud__guimbal-sub">Cabri G2</span>
            </div>
          </div>
        </div>
        <span className="cert-cloud__hint">{expanded ? 'Click to collapse' : 'See details \u2192'}</span>
        {expanded && (
          <div className="cert-cloud__expanded">
            <div className="cert-cloud__body">
              <h3 className="cert-cloud__title">Authorized Dealer &amp; Service Center</h3>
              <p className="cert-cloud__desc">Factory distributor, authorised dealer, and designated service centre for the full Robinson range — R22, R44, R66.</p>
              <span className="cert-cloud__label-tag">The Robinson Specialists</span>
              <div className="cert-cloud__stats">
                <div className="cert-cloud__stat">
                  <span className="cert-cloud__stat-value">85+</span>
                  <span className="cert-cloud__stat-label">Aircraft</span>
                </div>
                <div className="cert-cloud__stat">
                  <span className="cert-cloud__stat-value">2,500+</span>
                  <span className="cert-cloud__stat-label">Services</span>
                </div>
                <div className="cert-cloud__stat">
                  <span className="cert-cloud__stat-value">Part 145</span>
                  <span className="cert-cloud__stat-label">EASA</span>
                </div>
              </div>
            </div>
            <div className="cert-cloud__footer">
              <span className="cert-cloud__footer-label">Certified for</span>
              <div className="cert-cloud__pills">
                <span className="cert-cloud__pill">Robinson R22</span>
                <span className="cert-cloud__pill">Robinson R44</span>
                <span className="cert-cloud__pill">Robinson R66</span>
                <span className="cert-cloud__pill">Guimbal Cabri G2</span>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// ============================================
// Dealer Card — Cloud Frost (cert-114 style)
// ============================================
function DealerSplitDots() {
  const [expanded, setExpanded] = useState(false);
  const dealerRef = useRef(null);
  const dealerInView = useInView(dealerRef, { once: true, margin: '0px 0px -80% 0px' });

  useEffect(() => {
    if (dealerInView) setExpanded(true);
  }, [dealerInView]);

  return (
    <div className="cert-cloud cert-cloud--dealer" ref={dealerRef}>
      <div className={`cert-cloud__card ${expanded ? 'cert-cloud__card--expanded' : ''}`} onClick={() => setExpanded(!expanded)}>
        <div className="cert-cloud__dots"></div>
        <div className="cert-cloud__split">
          <div className="cert-cloud__upper">
            <img src="/assets/images/robinson-assets/logos/rhc-authorized-dealer-logo-logo-yellow-rotor-black-type.svg" alt="Robinson Authorized Dealer" className="cert-cloud__logo" />
          </div>
        </div>
        <span className="cert-cloud__hint">{expanded ? 'Click to collapse' : 'See details \u2192'}</span>
        {expanded && (
          <div className="cert-cloud__expanded">
            <div className="cert-cloud__body">
              <span className="cert-cloud__label-tag">Official</span>
              <h3 className="cert-cloud__title">Robinson Authorized Dealer</h3>
              <p className="cert-cloud__desc">The UK's premier Robinson dealership since 1990. Factory-direct pricing, full warranty support, and expert guidance from purchase to delivery.</p>
              <div className="cert-cloud__stats">
                <div className="cert-cloud__stat">
                  <span className="cert-cloud__stat-value">35+</span>
                  <span className="cert-cloud__stat-label">Years</span>
                </div>
                <div className="cert-cloud__stat">
                  <span className="cert-cloud__stat-value">500+</span>
                  <span className="cert-cloud__stat-label">Aircraft Sold</span>
                </div>
                <div className="cert-cloud__stat">
                  <span className="cert-cloud__stat-value">UK</span>
                  <span className="cert-cloud__stat-label">Exclusive</span>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// Parallax Section Component
function ParallaxSection({ image, alt, children, className = '', waves = false }) {
  const sectionRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"]
  });

  // Parallax effect - image moves slower than scroll
  const y = useTransform(scrollYProgress, [0, 1], ['-15%', '15%']);

  return (
    <section className={`parallax-section ${className}`} ref={sectionRef}>
      <div className="parallax-section__image-container">
        <motion.img
          src={image}
          alt={alt}
          className="parallax-section__image"
          style={{ y }}
        />
      </div>
      <div className="parallax-section__overlay"></div>
      <div className="parallax-section__content">
        {children}
      </div>
      {waves && (
        <>
          {/* Top waves - subtle */}
          <svg className="parallax-section__wave parallax-section__wave--top" viewBox="0 0 1440 60" preserveAspectRatio="none">
            <path d="M0,0 L1440,0 L1440,20 Q1080,30 720,20 Q360,10 0,25 L0,0 Z" fill="rgba(255,255,255,0.1)"/>
          </svg>
          <svg className="parallax-section__wave parallax-section__wave--top" viewBox="0 0 1440 60" preserveAspectRatio="none">
            <path d="M0,0 L1440,0 L1440,12 Q1080,18 720,12 Q360,6 0,15 L0,0 Z" fill="rgba(255,255,255,0.18)"/>
          </svg>
          {/* Bottom waves */}
          <svg className="parallax-section__wave parallax-section__wave--bottom" viewBox="0 0 1440 120" preserveAspectRatio="none">
            <path d="M0,120 L1440,120 L1440,70 Q1080,55 720,70 Q360,85 0,60 L0,120 Z" fill="rgba(255,255,255,0.08)"/>
          </svg>
          <svg className="parallax-section__wave parallax-section__wave--bottom" viewBox="0 0 1440 120" preserveAspectRatio="none">
            <path d="M0,120 L1440,120 L1440,85 Q1080,75 720,85 Q360,95 0,80 L0,120 Z" fill="rgba(255,255,255,0.18)"/>
          </svg>
          <svg className="parallax-section__wave parallax-section__wave--bottom" viewBox="0 0 1440 120" preserveAspectRatio="none">
            <path d="M0,120 L1440,120 L1440,100 Q1080,95 720,100 Q360,105 0,98 L0,120 Z" fill="rgba(255,255,255,0.3)"/>
          </svg>
        </>
      )}
    </section>
  );
}

// Hero scroll path - Triple Wave (path-19) - centered
const HERO_PATHS_BOTTOM = [
  { d: 'M -50 100 L 2050 100', stroke: '#a0a0a0', width: 2, offset: 0 },
  { d: 'M -50 250 L 2050 250', stroke: '#b0b0b0', width: 1.5, offset: 0.03 },
  { d: 'M -50 400 L 2050 400', stroke: '#c0c0c0', width: 1, offset: 0.06 }
];

const HERO_PATHS_TOP = [
  { d: 'M -50 100 L 2050 100', stroke: '#c0c0c0', width: 1, offset: 0 },
  { d: 'M -50 250 L 2050 250', stroke: '#b0b0b0', width: 1.5, offset: 0.03 },
  { d: 'M -50 400 L 2050 400', stroke: '#a0a0a0', width: 2, offset: 0.06 }
];

function HeroScrollPath({ containerRef, hidden }) {
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"]
  });

  // Transform scroll progress: start at 25%, end at 100%
  const pathProgress = useTransform(scrollYProgress, [0, 1], [0.20, 1]);

  return (
    <>
      {/* Top SVG */}
      <svg
        className={`fd-hero__path-svg fd-hero__path-svg--top ${hidden ? 'fd-hero__path-svg--hidden' : ''}`}
        viewBox="0 0 2000 500"
        preserveAspectRatio="none"
        fill="none"
      >
        {HERO_PATHS_TOP.map((path, idx) => (
          <g key={idx}>
            <path
              d={path.d}
              stroke="rgba(180, 180, 180, 0.15)"
              strokeWidth={path.width}
              strokeLinecap="round"
              strokeDasharray="6 10"
              fill="none"
            />
            <motion.path
              d={path.d}
              stroke={path.stroke}
              strokeWidth={path.width}
              strokeLinecap="round"
              fill="none"
              style={{
                opacity: 0.5,
                pathLength: useTransform(pathProgress, v => Math.min(1, v + path.offset))
              }}
            />
          </g>
        ))}
      </svg>

      {/* Bottom SVG */}
      <svg
        className={`fd-hero__path-svg fd-hero__path-svg--bottom ${hidden ? 'fd-hero__path-svg--hidden' : ''}`}
        viewBox="0 0 2000 500"
        preserveAspectRatio="none"
        fill="none"
      >
        {HERO_PATHS_BOTTOM.map((path, idx) => (
          <g key={idx}>
            <path
              d={path.d}
              stroke="rgba(180, 180, 180, 0.15)"
              strokeWidth={path.width}
              strokeLinecap="round"
              strokeDasharray="6 10"
              fill="none"
            />
            <motion.path
              d={path.d}
              stroke={path.stroke}
              strokeWidth={path.width}
              strokeLinecap="round"
              fill="none"
              style={{
                opacity: 0.5,
                pathLength: useTransform(pathProgress, v => Math.min(1, v + path.offset))
              }}
            />
          </g>
        ))}
      </svg>
    </>
  );
}

/**
 * CUSTOM HEADER COMPONENT FOR FINAL DRAFT
 * This header has the spotlight animation that works on this page
 * (The main Header component skips animations on non-home pages)
 */
function FinalDraftHeader() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [colorDark, setColorDark] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [verticalProgress, setVerticalProgress] = useState(0);
  const [horizontalProgress, setHorizontalProgress] = useState(0);

  // Scroll handler for spotlight animation
  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY;

      // Vertical completes FIRST (0 to 1 over first 150px)
      const vProgress = Math.min(scrollY / 150, 1);
      setVerticalProgress(vProgress);

      // Horizontal completes SECOND (0 to 1 over full 300px)
      const hProgress = Math.min(scrollY / 300, 1);
      setHorizontalProgress(hProgress);

      // Color changes at 300px
      setColorDark(scrollY > 300);
      // Position/size changes at 300px
      setScrolled(scrollY > 300);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close on Escape key
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape') setMenuOpen(false);
    };
    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, []);

  const toggleMenu = () => setMenuOpen(!menuOpen);
  const closeMenu = () => setMenuOpen(false);

  // Spotlight dimensions
  const spotlightHeight = 95 + Math.round(verticalProgress * 405);
  const spotlightWidth = 214 + Math.round(horizontalProgress * 1786);

  return (
    <>
      {/* Menu Panel */}
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
              <li><Link to="/aircraft-sales/new/r88" onClick={closeMenu}>R88</Link></li>
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
              <li><Link to="/training/faq" onClick={closeMenu}>Training FAQ</Link></li>
            </ul>
          </div>
          <div className="hq-menu-section">
            <h3>Services</h3>
            <ul>
              <li><Link to="/services" onClick={closeMenu}>Services Overview</Link></li>
              <li><Link to="/services/maintenance" onClick={closeMenu}>Maintenance</Link></li>
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
              <li><Link to="/contact/careers" onClick={closeMenu}>Careers</Link></li>
              <li><Link to="/contact/pricing" onClick={closeMenu}>Pricing</Link></li>
            </ul>
          </div>
        </div>
      </div>

      {/* Menu Button */}
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

      {/* Header with Spotlight */}
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
                decoding="async"
              />
            </Link>
            <nav className="Header-nav Header-nav--secondary" data-nc-element="secondary-nav">
              <div className="Header-nav-inner">
                <Link to="/flying" className="Header-nav-item">Flying</Link>
                <Link to="/training" className="Header-nav-item">Training</Link>
                <span className="Header-nav-item Header-nav-item--folder">
                  <Link to="/expeditions" className="Header-nav-folder-title">Exploration</Link>
                  <span className="Header-nav-folder">
                    <Link to="/expeditions" className="Header-nav-folder-item">Worldwide Expeditions</Link>
                    <Link to="/expeditions/calendar" className="Header-nav-folder-item">HQ Trips</Link>
                    <Link to="/services" className="Header-nav-folder-item">Ferry Flights</Link>
                  </span>
                </span>
              </div>
            </nav>
          </div>
          <div data-nc-container="top-right"></div>
        </div>
      </header>
    </>
  );
}

// Expedition images that cycle on scroll
const leftImages = [
  '/assets/images/expeditions/antartica.jpg',
  '/assets/images/expeditions/north-pole.jpg',
  '/assets/images/expeditions/channel.jpg',
  '/assets/images/expeditions/south-pole-by-helicopter-quentin-smith.webp',
];

const rightImages = [
  '/assets/images/expeditions/helicopter-expeditions-quentin-smith.webp',
  '/assets/images/expeditions/south-pole-by-helicopter-quentin-smith.webp',
  '/assets/images/expeditions/antartica.jpg',
  '/assets/images/expeditions/north-pole.jpg',
];

// About section image
const aboutImage = '/assets/images/facility/hangar-main.jpg';

// ============================================================
// EDITORIAL STRIPS — V42 (replaces ScrollingStrips)
// Sticky scroll-driven horizontal strips with brand gradient headlines
// ============================================================

const EDITORIAL_IMAGES_ROW1 = [
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
  '/assets/images/facility/hq-0153.jpg',
  '/assets/images/facility/hq-0254.jpg',
  '/assets/images/gallery/flying/flying--1.jpg',
  '/assets/images/facility/hq-0391.jpg',
  '/assets/images/facility/hq-0502.jpg',
  '/assets/images/expeditions/six-helis-in-North-Pole.jpg',
  '/assets/images/facility/hq-0209.jpg',
  '/assets/images/facility/okey-paint-quality.jpg',
];

const EDITORIAL_IMAGES_ROW2 = [
  '/assets/images/facility/hq-0035.jpg',
  '/assets/images/facility/hq-0294.jpg',
  '/assets/images/gallery/flying/james-shadow-night.jpg',
  '/assets/images/facility/hq-0409.jpg',
  '/assets/images/facility/sales-rebuild.jpg',
  '/assets/images/facility/hq-0477.jpg',
  '/assets/images/gallery/flying/flying-tv.jpg',
  '/assets/images/facility/hq-0745.jpg',
  '/assets/images/facility/hq-0089.jpg',
  '/assets/images/facility/hq-0354.jpg',
  '/assets/images/facility/hq-0153-1.jpg',
  '/assets/images/facility/hq-0300.jpg',
  '/assets/images/facility/maintenance-.jpg',
  '/assets/images/facility/hq-0075.jpg',
  '/assets/images/facility/hq-img_1340.jpg',
  '/assets/images/facility/hq-0698.jpg',
  '/assets/images/facility/hq-0129.jpg',
  '/assets/images/facility/hq-0167.jpg',
  '/assets/images/facility/hq-0053.jpg',
  '/assets/images/facility/hq-0388.jpg',
];

const EDITORIAL_DESTINATIONS = [
  { name: 'The Cotswolds', time: '1hr' },
  { name: 'Goodwood Racecourse', time: '35min' },
  { name: 'St Andrews Golf', time: '3.5hrs' },
  { name: 'Le Touquet, France', time: '1hr' },
  { name: 'Cowes, Isle of Wight', time: '45min' },
  { name: 'Cheltenham Races', time: '50min' },
  { name: 'Soho Farmhouse', time: '40min' },
  { name: 'Padstow, Cornwall', time: '2.5hrs' },
  { name: 'Lake District', time: '2hrs' },
  { name: 'Scottish Highlands', time: '3hrs' },
  { name: 'Blenheim Palace', time: '30min' },
  { name: 'Channel Islands', time: '1.5hrs' },
];

const EditorialStrips = ({ wrapperRef = null }) => {
  const containerRef = useRef(null);

  const { scrollYProgress } = useScroll({
    target: wrapperRef || containerRef,
    offset: ['start end', 'end start'],
  });

  const xL = useTransform(scrollYProgress, [0, 1], ['15%', '-120%']);
  const xR = useTransform(scrollYProgress, [0, 1], ['5%', '-100%']);
  const xM = useTransform(scrollYProgress, [0, 1], ['15%', '-130%']);
  const xR2 = useTransform(scrollYProgress, [0, 1], ['-100%', '5%']);

  return (
    <section
      className="editorial-strips"
      ref={containerRef}
      style={{ position: 'sticky', top: 'calc(50vh - 300px)', zIndex: 50 }}
    >
      <style>{`
        .editorial-strips { background: transparent; padding: 4rem 0; overflow: hidden; display: flex; flex-direction: column; gap: 1.25rem; position: relative; }
        .editorial-strips::before, .editorial-strips::after { content: ''; position: absolute; top: 0; bottom: 0; width: 160px; z-index: 10; pointer-events: none; }
        .editorial-strips::before { left: 0; background: linear-gradient(to right, rgba(250,249,246,0.95), transparent); }
        .editorial-strips::after { right: 0; background: linear-gradient(to left, rgba(250,249,246,0.95), transparent); }
        .editorial-strips__headline-row { display: flex; align-items: baseline; gap: 3rem; white-space: nowrap; padding: 0.75rem 0; }
        .editorial-strips__word { flex-shrink: 0; font-family: 'Space Grotesk', sans-serif; font-size: clamp(2.5rem, 5vw, 4.2rem); font-weight: 700; text-transform: uppercase; letter-spacing: -0.02em; line-height: 1; text-shadow: -6px -6px 0 #faf9f6, 6px -6px 0 #faf9f6, -6px 6px 0 #faf9f6, 6px 6px 0 #faf9f6, 0 -6px 0 #faf9f6, 0 6px 0 #faf9f6, -6px 0 0 #faf9f6, 6px 0 0 #faf9f6; }
        .editorial-strips__word--1 { color: #1a1a1a; }
        .editorial-strips__word--2 { color: #4a4a4a; }
        .editorial-strips__word--3 { color: #7a7a7a; }
        .editorial-strips__word--4 { color: #b0b0b0; }
        .editorial-strips__img-row { display: flex; gap: 1.25rem; white-space: nowrap; }
        .editorial-strips__img { flex-shrink: 0; width: 260px; height: 165px; border-radius: 6px; overflow: hidden; }
        .editorial-strips__img img { width: 100%; height: 100%; object-fit: cover; transition: all 0.5s ease; }
        .editorial-strips__img:hover img { transform: scale(1.04); }
        .editorial-strips__dest-row { display: flex; gap: 2.5rem; white-space: nowrap; padding: 0.25rem 0; align-items: center; }
        .editorial-strips__dest { flex-shrink: 0; display: flex; align-items: center; gap: 0.75rem; }
        .editorial-strips__dest-name { font-family: 'Space Grotesk', sans-serif; font-size: 0.95rem; font-weight: 600; text-transform: uppercase; letter-spacing: 0.06em; color: #1a1a1a; text-shadow: -4px -4px 0 #faf9f6, 4px -4px 0 #faf9f6, -4px 4px 0 #faf9f6, 4px 4px 0 #faf9f6, 0 -4px 0 #faf9f6, 0 4px 0 #faf9f6, -4px 0 0 #faf9f6, 4px 0 0 #faf9f6; }
        .editorial-strips__dest-time { font-family: 'Share Tech Mono', monospace; font-size: 0.7rem; font-weight: 700; letter-spacing: 0.12em; text-transform: uppercase; color: #4a4a4a; background: #dcfce7; border: 1px solid #4ade80; padding: 3px 10px; border-radius: 2px; }
        .editorial-strips__dest-accent { font-family: 'Share Tech Mono', monospace; font-size: 0.5rem; letter-spacing: 0.15em; text-transform: uppercase; color: #4ade80; }
      `}</style>
      <motion.div className="editorial-strips__headline-row" style={{ x: xL }}>
        {['Your', 'Sky.', 'Your', 'Schedule.', 'Your', 'Freedom.', 'No', 'Limits.', 'No', 'Queues.', 'Just', 'Fly.'].map((w, i) => (
          <span key={i} className={`editorial-strips__word editorial-strips__word--${(i % 4) + 1}`}>{w}</span>
        ))}
      </motion.div>
      <motion.div className="editorial-strips__img-row" style={{ x: xR }}>
        {EDITORIAL_IMAGES_ROW1.map((src, i) => (
          <div key={i} className="editorial-strips__img"><img src={src} alt="" loading="lazy" /></div>
        ))}
      </motion.div>
      <motion.div className="editorial-strips__dest-row" style={{ x: xM }}>
        {[...EDITORIAL_DESTINATIONS, ...EDITORIAL_DESTINATIONS].map((d, i) => (
          <span key={i} className="editorial-strips__dest">
            <span className="editorial-strips__dest-name">{d.name}</span>
            <span className="editorial-strips__dest-time">{d.time}</span>
          </span>
        ))}
      </motion.div>
      <motion.div className="editorial-strips__img-row" style={{ x: xR2 }}>
        {EDITORIAL_IMAGES_ROW2.map((src, i) => (
          <div key={i} className="editorial-strips__img"><img src={src} alt="" loading="lazy" /></div>
        ))}
      </motion.div>
    </section>
  );
};

// ============================================================
// SELF-FLY HIRE — Light Map + Journey Timeline (from V42)
// ============================================================
const sfhUkPath = "M224.5 476.8 L199.8 492.6 L189.1 490.9 L176.2 478.9 L162.5 480.4 L168.2 474.2 L156.5 468.8 L136.2 476.6 L122.0 459.4 L165.9 429.1 L172.6 414.4 L168.6 410.0 L167.8 389.1 L144.9 396.6 L161.2 373.6 L194.4 360.3 L207.5 365.9 L204.8 356.7 L208.8 354.6 L221.3 362.4 L208.8 348.7 L214.3 333.7 L210.1 331.0 L210.4 322.1 L215.3 318.3 L216.6 303.6 L204.8 307.0 L188.0 277.4 L193.0 263.3 L209.9 251.0 L189.6 251.5 L173.5 262.8 L139.5 258.3 L135.8 268.9 L126.9 257.5 L125.5 248.9 L130.1 248.7 L145.0 214.0 L136.6 200.6 L139.2 184.9 L148.7 184.3 L138.5 176.7 L140.2 169.4 L123.8 187.6 L123.5 175.6 L132.3 164.3 L117.1 178.8 L110.3 221.5 L101.9 223.3 L112.3 193.5 L107.7 192.8 L111.1 163.2 L124.8 128.8 L106.4 144.1 L87.5 131.5 L103.4 122.3 L98.2 118.9 L110.1 96.6 L99.9 82.8 L109.3 75.3 L102.9 67.0 L108.3 52.7 L126.1 52.7 L116.0 39.9 L119.0 28.5 L131.9 26.8 L128.8 18.6 L133.2 5.3 L154.7 9.9 L209.2 1.6 L203.0 22.8 L172.2 47.4 L170.5 54.7 L177.5 56.9 L166.5 73.3 L199.7 64.2 L247.9 64.8 L256.2 70.9 L259.6 80.2 L231.1 137.0 L199.1 155.5 L215.9 153.2 L224.3 162.9 L197.1 178.2 L180.2 173.7 L209.5 183.4 L227.2 178.3 L245.1 186.7 L264.6 209.3 L281.3 268.0 L303.5 281.5 L326.7 307.6 L321.8 314.2 L334.6 342.2 L303.9 334.3 L318.4 336.6 L340.8 360.7 L344.0 372.6 L331.8 389.9 L341.0 396.4 L352.1 385.7 L380.3 388.6 L395.6 400.1 L399.0 412.0 L393.0 443.1 L378.8 453.1 L380.5 461.7 L359.7 469.5 L365.5 472.2 L365.2 480.2 L346.7 487.4 L386.0 494.3 L385.3 506.7 L367.9 524.0 L338.1 535.0 L298.9 534.9 L274.0 526.0 L277.3 531.1 L249.6 537.6 L252.4 544.2 L249.5 545.8 L211.4 538.2 L195.4 543.8 L184.4 570.4 L164.1 560.1 L143.0 567.0 L127.6 584.1 L106.4 581.5 L136.5 550.5 L148.7 534.1 L151.1 520.6 L160.1 517.1 L164.4 506.2 L205.9 505.0 L233.8 468.8 L224.5 476.8 Z";

const sfhAircraftRanges = {
  R22:          { label: 'R22',          cruise: '~100 kts', cruiseKts: 100, r30: 56, r60: 112, r120: 223 },
  R44:          { label: 'R44',          cruise: '~120 kts', cruiseKts: 120, r30: 67, r60: 134, r120: 268 },
  'R66 Turbine': { label: 'R66 Turbine', cruise: '~140 kts', cruiseKts: 140, r30: 78, r60: 156, r120: 312 },
};

const sfhFormatTime = (nm, kts) => {
  const mins = Math.round((nm / kts) * 60);
  if (mins < 60) return `${mins} min`;
  const h = Math.floor(mins / 60);
  const m = mins % 60;
  return m === 0 ? `${h}h` : `${h}h ${m}min`;
};

const sfhFleet = [
  { model: 'R22', seats: '2 Seats', rate: '£275/hr', img: '/assets/images/new-aircraft/r22/r22-red-volcano-front-alpha-v3.png' },
  { model: 'R44', seats: '4 Seats', rate: '£395/hr', img: '/assets/images/new-aircraft/r44/raven-ii-front-alpha.png' },
  { model: 'R66 Turbine', seats: '5 Seats', rate: '£595/hr', img: '/assets/images/new-aircraft/r66/blue-r66-palo-verde-left-v4.png' },
];

const sfhDestCoords = [
  { name: 'The Cotswolds', x: 265, y: 458, nm: 70, carTime: '1h 45min', desc: 'Fly over the rolling hills and honey-stone villages. Lunch at a country pub, back to Denham before dark.' },
  { name: 'Le Touquet', x: 355, y: 548, nm: 110, carTime: '3h 30min', desc: 'Cross the Channel in under an hour. Fresh seafood on the French coast, no passport queues, no ferry timetables.' },
  { name: 'Scottish Highlands', x: 210, y: 175, nm: 330, carTime: '8h+', desc: 'Glens, lochs and castles from the air. Two and a half hours to a landscape most people drive a full day to reach.' },
  { name: 'Cornwall', x: 145, y: 560, nm: 180, carTime: '4h 30min', desc: 'Skip the M5 entirely. Land near the coast for a weekend of surfing, cream teas and dramatic clifftop walks.' },
];

const SelfFlyHireSection = () => {
  const [hoveredDest, setHoveredDest] = useState(null);
  const [lockedDest, setLockedDest] = useState(null);
  const [selectedAircraft, setSelectedAircraft] = useState('R44');
  const activeDest = hoveredDest !== null ? hoveredDest : lockedDest;
  const denham = { x: 310, y: 480 };
  const range = sfhAircraftRanges[selectedAircraft];

  return (
    <section className="sfh-map" id="fleet">
      <style>{`
        .sfh-map { background: #e8e4df; color: #1a1a1a; }
        .sfh-map__inner { max-width: 1200px; margin: 0 auto; padding: 4rem 2rem 5rem; }
        .sfh-map__intro { margin-bottom: 3rem; max-width: 600px; }
        .sfh-map__pre-title { display: block; font-family: 'Share Tech Mono', monospace; font-size: 0.6rem; text-transform: uppercase; letter-spacing: 0.3em; color: #777; margin-bottom: 1.5rem; }
        .sfh-map__title { font-family: 'Space Grotesk', sans-serif; font-size: clamp(2rem, 4vw, 3.5rem); font-weight: 700; text-transform: uppercase; line-height: 1.1; margin-bottom: 1.5rem; }
        .sfh-map__title-line { display: block; }
        .sfh-map__title-line--2 { color: #999; }
        .sfh-map__tagline { font-size: 0.9rem; color: #555; line-height: 1.7; }

        .sfh-map__grid { display: grid; grid-template-columns: minmax(0, 500px) 380px; gap: 3rem; align-items: start; }

        /* ── Map ── */
        .sfh-map__map-box { background: #f2efea; border: 1px solid #ccc8c1; padding: 1.5rem; position: sticky; top: 15vh; }
        .sfh-map__map-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.75rem; }
        .sfh-map__map-header span { font-family: 'Share Tech Mono', monospace; font-size: 0.6rem; text-transform: uppercase; letter-spacing: 0.12em; color: #777; }
        .sfh-map__map-aircraft-label { display: block; font-family: 'Share Tech Mono', monospace; font-size: 0.55rem; text-transform: uppercase; letter-spacing: 0.1em; color: #777; margin-bottom: 1rem; }
        .sfh-map__map-aircraft-label strong { color: #1a1a1a; }
        .sfh-map__map svg { width: 100%; height: auto; display: block; }
        .sfh-map__pin { cursor: pointer; }
        .sfh-map__pin text { font-family: 'Space Grotesk', sans-serif; font-size: 9px; font-weight: 600; fill: #888; text-transform: uppercase; pointer-events: none; transition: fill 0.2s; }
        .sfh-map__pin--active text { fill: #1a1a1a; }
        .sfh-map__rlabel { font-family: 'Share Tech Mono', monospace; font-size: 7px; fill: #999; }
        .sfh-map__range-ring { transition: r 0.4s ease, stroke 0.3s; }

        /* ── Journey Timeline ── */
        .sfh-map__journey { }\n
        .sfh-map__journey-label { display: block; font-size: 0.6rem; text-transform: uppercase; letter-spacing: 0.3em; color: #777; margin-bottom: 2rem; font-family: 'Share Tech Mono', monospace; }

        .sfh-map__tl-step { display: grid; grid-template-columns: 36px 1fr; gap: 1rem; position: relative; }
        .sfh-map__tl-step::before { content: ''; position: absolute; left: 17px; top: 36px; bottom: 0; width: 1px; background: #ccc8c1; }
        .sfh-map__tl-num { width: 36px; height: 36px; border-radius: 50%; border: 1px solid #aaa; display: flex; align-items: center; justify-content: center; font-family: 'Share Tech Mono', monospace; font-size: 0.65rem; color: #777; background: #e8e4df; position: relative; z-index: 1; }
        .sfh-map__tl-step--active .sfh-map__tl-num { border-color: #1a1a1a; color: #1a1a1a; }
        .sfh-map__tl-title { font-family: 'Space Grotesk', sans-serif; font-size: 0.8rem; font-weight: 700; text-transform: uppercase; letter-spacing: 0.05em; color: #777; padding-top: 0.5rem; }
        .sfh-map__tl-step--active .sfh-map__tl-title { color: #1a1a1a; }

        .sfh-map__dest-list { padding: 1rem 0 0 0; margin: 0; list-style: none; }
        .sfh-map__dest-item { display: flex; justify-content: space-between; align-items: center; padding: 0.6rem 0.75rem; cursor: pointer; transition: all 0.2s; border-left: 2px solid transparent; margin-bottom: 2px; }
        .sfh-map__dest-item:hover { background: rgba(0,0,0,0.04); }
        .sfh-map__dest-item--active { border-left-color: #1a1a1a; background: rgba(0,0,0,0.06); }
        .sfh-map__dest-name { font-family: 'Space Grotesk', sans-serif; font-size: 0.85rem; font-weight: 600; color: #666; transition: color 0.2s; }
        .sfh-map__dest-item--active .sfh-map__dest-name { color: #1a1a1a; }
        .sfh-map__dest-flight { font-family: 'Share Tech Mono', monospace; font-size: 0.7rem; color: #999; }
        .sfh-map__dest-item--active .sfh-map__dest-flight { color: #444; }

        .sfh-map__dest-detail-wrap { display: grid; margin-top: 0.75rem; border: 1px solid #ccc8c1; background: #f2efea; }
        .sfh-map__dest-detail-wrap > * { grid-area: 1 / 1; padding: 1.25rem; transition: opacity 0.25s; }
        .sfh-map__dest-detail { opacity: 0; pointer-events: none; }
        .sfh-map__dest-detail--active { opacity: 1; pointer-events: auto; }
        .sfh-map__dest-detail--empty { display: flex; align-items: center; justify-content: center; }
        .sfh-map__dest-detail-hint { font-size: 0.7rem; color: #999; font-family: 'Share Tech Mono', monospace; text-transform: uppercase; letter-spacing: 0.1em; }
        .sfh-map__dest-detail-endless { display: block; margin-top: 0.75rem; font-family: 'Space Grotesk', sans-serif; font-size: 0.85rem; font-weight: 600; color: #666; }
        .sfh-map__dest-detail-time { font-family: 'Share Tech Mono', monospace; font-size: 1.8rem; color: #1a1a1a; margin-bottom: 0.15rem; }
        .sfh-map__dest-detail-car { font-size: 0.65rem; color: #777; margin-bottom: 0.75rem; }
        .sfh-map__dest-detail-desc { font-size: 0.85rem; color: #555; line-height: 1.6; }
        .sfh-map__dest-detail-name { font-family: 'Space Grotesk', sans-serif; font-size: 0.7rem; font-weight: 700; text-transform: uppercase; letter-spacing: 0.08em; color: #777; margin-bottom: 0.5rem; }

        .sfh-map__tl-step-02 { margin-top: 2rem; }
        .sfh-map__tl-step-03 { margin-top: 2rem; }
        .sfh-map__tl-step-03::before { display: none; }
        .sfh-map__fly-text { font-size: 0.85rem; color: #555; line-height: 1.6; padding-top: 0.5rem; }

        .sfh-map__fleet-row { display: flex; align-items: center; gap: 0.75rem; padding: 0.6rem 0.75rem; border: 1px solid #ccc8c1; color: #1a1a1a; transition: all 0.3s; margin-bottom: 0.5rem; cursor: pointer; text-decoration: none; }
        .sfh-map__fleet-row:hover { border-color: #888; }
        .sfh-map__fleet-row--active { border-color: #1a1a1a; background: rgba(0,0,0,0.04); }
        .sfh-map__fleet-row img { height: 28px; object-fit: contain; width: 48px; }
        .sfh-map__fleet-model { font-family: 'Space Grotesk', sans-serif; font-weight: 700; text-transform: uppercase; font-size: 0.75rem; }
        .sfh-map__fleet-info { font-size: 0.6rem; color: #777; }
        .sfh-map__fleet-rate { margin-left: auto; font-family: 'Share Tech Mono', monospace; font-size: 0.7rem; color: #555; }

        .sfh-map__cta { display: block; width: 100%; padding: 0.85rem; background: #1a1a1a; color: #fff; text-decoration: none; font-size: 0.7rem; text-transform: uppercase; letter-spacing: 0.1em; text-align: center; font-family: 'Space Grotesk', sans-serif; font-weight: 600; margin-top: 1.5rem; transition: background 0.3s; }
        .sfh-map__cta:hover { background: #333; }

        @media (max-width: 900px) {
          .sfh-map__grid { grid-template-columns: 1fr; }
        }
      `}</style>

      <div className="sfh-map__inner">
        <div className="sfh-map__intro">
          <span className="sfh-map__pre-title">Freedom to Fly Yourself Anywhere</span>
          <h2 className="sfh-map__title">
            <span className="sfh-map__title-line">Your Aircraft</span>
            <span className="sfh-map__title-line sfh-map__title-line--2">Awaits</span>
          </h2>
          <p className="sfh-map__tagline">
            You've earned your licence. Now use it. Hire from our fleet of R22s, R44s and R66s — fuelled, washed and waiting on the pad for you, ready to go. Fly yourself to lunch in France, a weekend in the Cotswolds, a business meeting across the country, or just flying around for the beauty and fun of it. Available by the hour, day or week. No crew, no waiting, no compromise.
          </p>
        </div>

        <div className="sfh-map__grid">
          <div className="sfh-map__map-box">
          <div className="sfh-map__map-header">
            <span>Range Map — Denham (EGLD)</span>
          </div>
          <div className="sfh-map__map-aircraft-label">Showing range for: <strong>{range.label}</strong> at {range.cruise} cruise</div>
          <div className="sfh-map__map">
            <svg viewBox="0 0 500 620" fill="none">
              <defs>
                <radialGradient id="sfhglow30" cx="50%" cy="50%" r="50%"><stop offset="0%" stopColor="#1a1a1a" stopOpacity="0.03"/><stop offset="100%" stopColor="#1a1a1a" stopOpacity="0"/></radialGradient>
                <radialGradient id="sfhglow60" cx="50%" cy="50%" r="50%"><stop offset="0%" stopColor="#1a1a1a" stopOpacity="0.015"/><stop offset="100%" stopColor="#1a1a1a" stopOpacity="0"/></radialGradient>
              </defs>

              <path d={sfhUkPath} stroke="#b5b0a8" strokeWidth="1.2" fill="#d6d1ca" />

              <circle className="sfh-map__range-ring" cx={denham.x} cy={denham.y} r={range.r30} fill="url(#sfhglow30)" stroke="#aaa" strokeWidth="1" strokeDasharray="4 3" />
              <circle className="sfh-map__range-ring" cx={denham.x} cy={denham.y} r={range.r60} fill="url(#sfhglow60)" stroke="#bbb" strokeWidth="1" strokeDasharray="6 4" />
              <circle className="sfh-map__range-ring" cx={denham.x} cy={denham.y} r={range.r120} fill="none" stroke="#ccc8c1" strokeWidth="1" strokeDasharray="8 5" />

              <text x={denham.x + range.r30 + 4} y={denham.y - 4} className="sfh-map__rlabel">30 MIN</text>
              <text x={denham.x + range.r60 + 4} y={denham.y - 4} className="sfh-map__rlabel">1 HR</text>
              <text x={denham.x + range.r120 + 4} y={denham.y - 4} className="sfh-map__rlabel">2 HR</text>

              <circle cx={denham.x} cy={denham.y} r="5" fill="#1a1a1a" />
              <circle cx={denham.x} cy={denham.y} r="10" fill="none" stroke="#1a1a1a" strokeWidth="0.5" opacity="0.15" />
              <text x={denham.x + 12} y={denham.y + 3} fontFamily="Share Tech Mono" fontSize="7" fill="#666" fontWeight="700">DENHAM</text>

              {sfhDestCoords.map((d, i) => {
                if (!d.x) return null;
                const isActive = activeDest === i;
                const dx = d.x - denham.x, dy = d.y - denham.y;
                const dist = Math.sqrt(dx * dx + dy * dy);
                const offset = 14;
                const sx = denham.x + (dx / dist) * offset, sy = denham.y + (dy / dist) * offset;
                return (
                  <g key={d.name} className={`sfh-map__pin ${isActive ? 'sfh-map__pin--active' : ''}`} onMouseEnter={() => setHoveredDest(i)} onMouseLeave={() => setHoveredDest(null)} onClick={() => setLockedDest(lockedDest === i ? null : i)} style={{ cursor: 'pointer' }}>
                    <line x1={sx} y1={sy} x2={d.x} y2={d.y} stroke="transparent" strokeWidth="16" />
                    <line x1={sx} y1={sy} x2={d.x} y2={d.y} stroke={isActive ? '#1a1a1a' : '#b5b0a8'} strokeWidth={isActive ? 1.5 : 0.75} strokeDasharray="4 3" style={{ transition: 'all 0.2s' }} />
                    <circle cx={d.x} cy={d.y} r={isActive ? 7 : 4} fill={isActive ? '#1a1a1a' : '#999'} style={{ transition: 'all 0.2s' }} />
                    {isActive && <circle cx={d.x} cy={d.y} r="14" fill="none" stroke="#1a1a1a" strokeWidth="0.5" opacity="0.25" />}
                    <text x={d.x + (d.x < denham.x ? -10 : 12)} y={d.y + (d.y < denham.y ? -10 : 16)} textAnchor={d.x < denham.x ? 'end' : 'start'}>{d.name}</text>
                  </g>
                );
              })}
            </svg>
          </div>
          </div>

          {/* RIGHT: Journey Timeline */}
        <div className="sfh-map__journey">
          <span className="sfh-map__journey-label">Self-Fly Hire</span>

          <div className={`sfh-map__tl-step ${activeDest !== null ? 'sfh-map__tl-step--active' : ''}`}>
            <span className="sfh-map__tl-num">01</span>
            <div>
              <div className="sfh-map__tl-title">Select Destination</div>
              <ul className="sfh-map__dest-list">
                {sfhDestCoords.map((d, i) => (
                  <li
                    key={d.name}
                    className={`sfh-map__dest-item ${activeDest === i ? 'sfh-map__dest-item--active' : ''}`}
                    onMouseEnter={() => setHoveredDest(i)}
                    onMouseLeave={() => setHoveredDest(null)}
                    onClick={() => setLockedDest(lockedDest === i ? null : i)}
                  >
                    <span className="sfh-map__dest-name">{d.name}</span>
                    <span className="sfh-map__dest-flight">{d.nm > 0 ? sfhFormatTime(d.nm, range.cruiseKts) : ''}</span>
                  </li>
                ))}
              </ul>

              <div className="sfh-map__dest-detail-wrap">
                <div className={`sfh-map__dest-detail sfh-map__dest-detail--empty ${activeDest === null ? 'sfh-map__dest-detail--active' : ''}`}>
                  <span className="sfh-map__dest-detail-hint">Hover or click a destination to see details</span>
                </div>
                {sfhDestCoords.map((d, i) => (
                  <div key={d.name} className={`sfh-map__dest-detail ${activeDest === i ? 'sfh-map__dest-detail--active' : ''}`}>
                    <div className="sfh-map__dest-detail-name">{d.name}</div>
                    {d.nm > 0 && <div className="sfh-map__dest-detail-time">{sfhFormatTime(d.nm, range.cruiseKts)}</div>}
                    {d.carTime && <div className="sfh-map__dest-detail-car">vs {d.carTime} by car</div>}
                    <div className="sfh-map__dest-detail-desc">{d.desc}</div>
                  </div>
                ))}
              </div>
              <span className="sfh-map__dest-detail-endless">Endless Destinations...</span>
            </div>
          </div>

          <div className="sfh-map__tl-step sfh-map__tl-step-02 sfh-map__tl-step--active">
            <span className="sfh-map__tl-num">02</span>
            <div>
              <div className="sfh-map__tl-title">Choose Your Aircraft</div>
              <div style={{ paddingTop: '1rem' }}>
                {sfhFleet.map(f => (
                  <div key={f.model} className={`sfh-map__fleet-row ${selectedAircraft === f.model ? 'sfh-map__fleet-row--active' : ''}`} onClick={() => setSelectedAircraft(f.model)}>
                    <img src={f.img} alt={f.model} />
                    <div>
                      <div className="sfh-map__fleet-model">{f.model}</div>
                      <div className="sfh-map__fleet-info">{f.seats} · {sfhAircraftRanges[f.model].cruise}</div>
                    </div>
                    <span className="sfh-map__fleet-rate">From {f.rate}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="sfh-map__tl-step sfh-map__tl-step-03 sfh-map__tl-step--active">
            <span className="sfh-map__tl-num">03</span>
            <div>
              <div className="sfh-map__tl-title">Fly</div>
              <div className="sfh-map__fly-text">No crew, no waiting, no compromise. Available by the hour, day or week. Your licence, your aircraft, your schedule.</div>
            </div>
          </div>

          <Link to="/contact?subject=hire" className="sfh-map__cta">Enquire About Hire</Link>
          </div>
        </div>
      </div>
    </section>
  );
};

function Experimentation2() {
  const [scrollProgress, setScrollProgress] = useState(0);
  const [activeSection, setActiveSection] = useState(0);
  const [imagesExpanded, setImagesExpanded] = useState(false);
  const [linesVisible, setLinesVisible] = useState(false);
  const [activeNavSection, setActiveNavSection] = useState(null);
  const [rebuildStep, setRebuildStep] = useState(0);
  const [salesTab, setSalesTab] = useState('rhc');
  const [openSalesSection, setOpenSalesSection] = useState(null); // mobile accordion — null = all collapsed
  const [rebuildView, setRebuildView] = useState('option1');
  const [rebuildPortfolioIndex, setRebuildPortfolioIndex] = useState(0);
  const [rebuildDetailOpen, setRebuildDetailOpen] = useState(null); // index of open portfolio item
  const [rebuildLightbox, setRebuildLightbox] = useState(null); // { src, alt } for full-screen image

  // Blog state
  const [blogPersona, setBlogPersona] = useState('press');
  const [blogVisible, setBlogVisible] = useState(6);
  const [blogSort, setBlogSort] = useState('popular');
  const [blogSearch, setBlogSearch] = useState('');

  // Team carousel state
  const [teamSlide, setTeamSlide] = useState(0);
  const additionalTeam = [
    { initials: 'JB', name: 'James Barrett', desc: 'Airframe Specialist · 14 years · Robinson & Cabri certified' },
    { initials: 'ST', name: 'Simon Turner', desc: 'Paint & Refurbishment Lead · 10 years · Custom livery specialist' },
    { initials: 'RL', name: 'Richard Lloyd', desc: 'Avionics Technician · 8 years · Glass cockpit installations' },
    { initials: 'AP', name: 'Andrew Parsons', desc: 'Engine Workshop Lead · 12 years · Lycoming & RR300' },
    { initials: '+12', name: 'Supporting Team', desc: 'Workshop & support crew · Skilled technicians · Denham facility' },
  ];

  // New sections state
  const [testimonialCategory, setTestimonialCategory] = useState('all');
  const [pricingTab, setPricingTab] = useState('training');
  const [storeCategory, setStoreCategory] = useState('gifts');

  // Sales three-phase sticky
  const salesIntroRef = useRef(null);
  const salesHeaderRef = useRef(null);
  const salesPreTitleRef = useRef(null);
  const salesDealerRef = useRef(null);
  const salesDealerInnerRef = useRef(null);

  useEffect(() => {
    const dealerEl = salesDealerRef.current;
    const innerEl = salesDealerInnerRef.current;
    const introEl = salesIntroRef.current;
    const headerEl = salesHeaderRef.current;
    const ptEl = salesPreTitleRef.current;
    if (!dealerEl || !innerEl || !introEl || !headerEl || !ptEl) return;

    let phase1Top, maxShift;
    const measure = () => {
      const vh15 = window.innerHeight * 0.15;
      phase1Top = vh15 + headerEl.offsetHeight;
      const phase3Top = vh15 + 48 + ptEl.offsetHeight + 8;
      maxShift = phase1Top - phase3Top;
      dealerEl.style.top = phase1Top + 'px';
      innerEl.style.willChange = 'transform';
    };

    const handleScroll = () => {
      const rect = introEl.getBoundingClientRect();
      const scrolled = -rect.top;
      const vh = window.innerHeight;
      const phaseStart = vh * 1.2;
      const phaseEnd = vh * 2.8;

      if (scrolled <= phaseStart) {
        innerEl.style.transform = 'translateY(0)';
      } else if (scrolled >= phaseEnd) {
        innerEl.style.transform = `translateY(${-maxShift}px)`;
      } else {
        const progress = (scrolled - phaseStart) / (phaseEnd - phaseStart);
        innerEl.style.transform = `translateY(${-maxShift * progress}px)`;
      }
    };

    measure();
    window.addEventListener('scroll', handleScroll, { passive: true });
    const onResize = () => { measure(); handleScroll(); };
    window.addEventListener('resize', onResize);
    return () => { window.removeEventListener('scroll', handleScroll); window.removeEventListener('resize', onResize); };
  }, []);

  // Blog derived data
  const allPublished = blogPosts.filter(p => p.published).sort((a, b) => new Date(b.date) - new Date(a.date));
  const activeCats = blogPersona ? BLOG_PERSONAS.find(p => p.id === blogPersona)?.categories || [] : [];

  const filteredPosts = allPublished.filter(post => {
    const matchPersona = !blogPersona || activeCats.includes(post.category);
    const matchSearch = !blogSearch || post.title.toLowerCase().includes(blogSearch.toLowerCase()) || post.excerpt.toLowerCase().includes(blogSearch.toLowerCase()) || post.category.toLowerCase().includes(blogSearch.toLowerCase());
    return matchPersona && matchSearch;
  });

  const sortedPosts = blogSort === 'popular'
    ? [...filteredPosts].sort((a, b) => {
        const ai = POPULAR_POST_IDS.indexOf(a.id);
        const bi = POPULAR_POST_IDS.indexOf(b.id);
        return (ai === -1 ? 999 : ai) - (bi === -1 ? 999 : bi);
      })
    : filteredPosts; // already sorted by date (newest first)

  const visiblePosts = sortedPosts.slice(0, blogVisible);
  const hasMorePosts = sortedPosts.length > blogVisible;

  const handlePersonaClick = (id) => {
    if (blogPersona === id) {
      setBlogPersona(null);
    } else {
      setBlogPersona(id);
    }
    setBlogVisible(6);
    setBlogSearch('');
  };

  const stripRef = useRef(null);
  const [stripCanScrollLeft, setStripCanScrollLeft] = useState(false);
  const [stripCanScrollRight, setStripCanScrollRight] = useState(false);
  const preownedRef = useRef(null);
  const [preownedCanScrollLeft, setPreownedCanScrollLeft] = useState(false);
  const [preownedCanScrollRight, setPreownedCanScrollRight] = useState(false);

  // Track strip scroll state
  useEffect(() => {
    const el = stripRef.current;
    if (!el) return;
    const update = () => {
      setStripCanScrollLeft(el.scrollLeft > 2);
      setStripCanScrollRight(el.scrollLeft < el.scrollWidth - el.clientWidth - 2);
    };
    update();
    el.addEventListener('scroll', update, { passive: true });
    const ro = new ResizeObserver(update);
    ro.observe(el);
    return () => { el.removeEventListener('scroll', update); ro.disconnect(); };
  }, [rebuildView, rebuildDetailOpen]);

  const [barcodeSelected, setBarcodeSelected] = useState(false);
  const [globeVariant, setGlobeVariant] = useState(0);

  // Track pre-owned carousel scroll state
  useEffect(() => {
    const el = preownedRef.current;
    if (!el) return;
    const update = () => {
      setPreownedCanScrollLeft(el.scrollLeft > 2);
      setPreownedCanScrollRight(el.scrollLeft < el.scrollWidth - el.clientWidth - 2);
    };
    update();
    el.addEventListener('scroll', update, { passive: true });
    const ro = new ResizeObserver(update);
    ro.observe(el);
    return () => { el.removeEventListener('scroll', update); ro.disconnect(); };
  }, [salesTab]);

  const [navCompact, setNavCompact] = useState(false);
  const [navFixed, setNavFixed] = useState(false);
  const [scrollPromptHidden, setScrollPromptHidden] = useState(false);
  const [heroCollapsed, setHeroCollapsed] = useState(false);
  const [aboutLabelStatic, setAboutLabelStatic] = useState(false);
  const [trainingSlide, setTrainingSlide] = useState(0); // Start on Discovery Flight
  const [whyFlyOpen, setWhyFlyOpen] = useState(false);
  const [whyFlySlide, setWhyFlySlide] = useState(0);

  // Merged Editorial Grid + Why We Fly — variation states
  const [megV1Page, setMegV1Page] = useState(0);
  const [megV1Benefit, setMegV1Benefit] = useState(0);
  const [megV1Expanded, setMegV1Expanded] = useState(false);
  const [megV2Page, setMegV2Page] = useState(0);
  const [megV3Page, setMegV3Page] = useState(0);
  const [megV3Flipped, setMegV3Flipped] = useState(-1);
  const [megV4Page, setMegV4Page] = useState(0);
  const [megV4Open, setMegV4Open] = useState(false);
  const [megV4Benefit, setMegV4Benefit] = useState(0);
  const [megV5Page, setMegV5Page] = useState(0);
  const [megV5Overlay, setMegV5Overlay] = useState(null);
  const [megV6Tab, setMegV6Tab] = useState(0);
  const [megV7Page, setMegV7Page] = useState(0);
  const [megV7Benefit, setMegV7Benefit] = useState(0);
  const [megV8Page, setMegV8Page] = useState(0);
  const [megV8Benefit, setMegV8Benefit] = useState(0);
  const [megV8Expanded, setMegV8Expanded] = useState(false);
  const [megV9Benefit, setMegV9Benefit] = useState(0);
  const [megV10Page, setMegV10Page] = useState(0);
  const [megV10Benefit, setMegV10Benefit] = useState(0);

  // Hero section variations — 10 variations
  const heroImages = [
    '/assets/images/expeditions/antartica.jpg',
    '/assets/images/expeditions/north-pole.jpg',
    '/assets/images/expeditions/channel.jpg',
    '/assets/images/expeditions/south-pole-by-helicopter-quentin-smith.webp',
    '/assets/images/expeditions/helicopter-expeditions-quentin-smith.webp',
    '/assets/images/expeditions/six-helis-in-North-Pole.jpg',
    '/assets/images/facility/hq-0167.jpg',
    '/assets/images/facility/hq-0254.jpg',
    '/assets/images/facility/hq-0345.jpg',
    '/assets/images/facility/busy-hangar.jpg',
    '/assets/images/facility/hq-0391.jpg',
    '/assets/images/facility/hq-0696.jpg',
    '/assets/images/facility/hq-0075.jpg',
    '/assets/images/facility/hq-0209.jpg',
    '/assets/images/facility/hq-0294.jpg',
    '/assets/images/facility/hq-0354.jpg',
    '/assets/images/facility/hq-0409.jpg',
    '/assets/images/facility/hq-0502.jpg',
    '/assets/images/facility/hq-0745.jpg',
    '/assets/images/facility/hq-0035.jpg',
    '/assets/images/facility/maintenance-.jpg',
    '/assets/images/facility/okey-paint-quality.jpg',
    '/assets/images/facility/hq-0053.jpg',
    '/assets/images/facility/hq-0056.jpg',
    '/assets/images/facility/hq-0089.jpg',
    '/assets/images/facility/hq-0129.jpg',
    '/assets/images/facility/hq-0153.jpg',
    '/assets/images/facility/hq-0213.jpg',
    '/assets/images/facility/hq-0300.jpg',
    '/assets/images/facility/hq-0388.jpg',
    '/assets/images/facility/hq-0477.jpg',
    '/assets/images/facility/hq-0698.jpg',
    '/assets/images/facility/washing.jpg',
    '/assets/images/facility/main-sales-pic.jpg',
    '/assets/images/new-aircraft/r88/rhc-r88-left-side-three-quarter-front-view-21797.jpg',
    '/assets/images/new-aircraft/r88/rhc-r88-3-spotlights-left-side-atmospheric-effect-21794_2.jpg',
    '/assets/images/new-aircraft/r88/rhc-r88-atmospheric-effect-front-view-218022.jpg',
    '/assets/images/new-aircraft/r66/rhc-r66-nxg-riviera-dramatic-overhead-13365.jpg',
    '/assets/images/new-aircraft/r66/rhc-r66-nxg-pv-left-side-wide-view-13611.jpg',
    '/assets/images/new-aircraft/r66/rhc-r66-nxg-riviera-front-led-landing-lights-13350.jpg',
    '/assets/images/new-aircraft/r66/rhc-r66-nxg-riviera-all-glass-cockpit-13338.jpg',
    '/assets/images/facility/hq-aviation-robinsons.jpg',
  ];
  const heroSlides = [
    { pre: 'Welcome to', words: ['HQ', 'Aviation'], desc: 'The Robinson Specialists since 1990' },
    { pre: 'Built on', words: ['Precision', '&', 'Excellence'], desc: 'Three decades of uncompromising standards' },
    { pre: 'World-class', words: ['Flight', 'Training'], desc: 'From first flight to commercial certification' },
    { pre: 'Beyond horizons', words: ['Global', 'Expeditions'], desc: 'Adventure awaits at every altitude' },
  ];
  const heroStates = Array.from({length: 40}, () => useState(0));
  const heroSlide = (v) => heroStates[v][0];
  const setHeroSlide = (v) => heroStates[v][1];

  // Auto-advance hero slides
  useEffect(() => {
    const interval = setInterval(() => {
      heroStates.forEach((_, i) => {
        heroStates[i][1](prev => (prev + 1) % heroSlides.length);
      });
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  // About + Why We Fly split section — 20 variations
  const wfStates = Array.from({length: 60}, () => useState(0));
  const wfSlide = (v) => wfStates[v][0];
  const setWfSlide = (v) => wfStates[v][1];

  // Shared why-fly data
  const whyFlyBenefits = [
    { verb: 'Join', noun: 'a Community', desc: 'Connect with fellow pilots, business leaders, and adventurers who share your passion for aviation at exclusive flying events and beyond.' },
    { verb: 'Enjoy', noun: 'the Journey', desc: "When the journey is an experience on the way to the destination that's better than the destination itself, for a pilot the best memory of an event is how they got there." },
    { verb: 'Land', noun: 'Anywhere', desc: 'No runways needed. Land at private estates, yachts, remote locations, and city centres.' },
    { verb: 'Gain', noun: 'Business Edge', desc: 'Multiple destinations in the same day is now possible, at great distances apart. People to see that are just too far to justify travelling by other methods — it can be done just like that.' },
    { verb: 'Create', noun: 'Family Memories', desc: 'Create unforgettable experiences with loved ones. Weekend trips become extraordinary adventures.' },
    { verb: 'Experience', noun: 'True Freedom', desc: 'Go where you want, when you want. The ultimate expression of personal freedom and independence.' },
    { verb: 'Arrive', noun: 'Differently', desc: 'Fly directly into exclusive events — race courses, Goodwood festivals, and more. The kind of access that speaks for itself.' },
    { verb: 'Achieve', noun: 'Your Dreams', desc: "Join an elite group who have mastered one of aviation's most challenging and rewarding skills." },
    { verb: 'Explore', noun: 'The World', desc: 'From Alpine peaks to Mediterranean coasts, the helicopter opens a world of expedition possibilities.' },
  ];

  const whyFlyImages = [
    '/assets/images/expeditions/helicopter-expeditions-quentin-smith.webp',
    '/assets/images/facility/hq-0035.jpg',
    '/assets/images/expeditions/channel.jpg',
    '/assets/images/facility/hq-0089.jpg',
    '/assets/images/expeditions/north-pole.jpg',
    '/assets/images/expeditions/antartica.jpg',
    '/assets/images/facility/busy-hangar.jpg',
    '/assets/images/facility/hq-0053.jpg',
    '/assets/images/facility/hq-0167.jpg',
  ];

  const editorialQuotes = [
    { text: '"Excellence is not a destination but a continuous journey."', attribution: 'Captain Q' },
    { text: '"In aviation, preparation is the silent partner of every safe landing."', attribution: 'HQ Maintenance Team' },
    { text: '"Flying is the second greatest thrill known to man. Landing is the first."', attribution: 'Unknown Aviator' },
    { text: '"The engine is the heart of an aeroplane, but the pilot is its soul."', attribution: 'Walter Raleigh' },
    { text: '"Adventure is worthwhile in itself."', attribution: 'Amelia Earhart' },
    { text: '"Once you have tasted flight, you will forever walk the earth with your eyes turned skyward."', attribution: 'Leonardo da Vinci' },
  ];

  const galleryImages = [
    '/assets/images/new-aircraft/r66/rhc-r66-nxg-pv-right-side-angle-shot-21826.jpg',
    '/assets/images/gallery/social/img-20241004-wa0005.jpg',
    '/assets/images/new-aircraft/r88/rhc-r88-3-spotlights-left-side-atmospheric-effect-21794_2.jpg',
    '/assets/images/gallery/events/img_2278.jpg',
    '/assets/images/expeditions/north-pole.jpg',
    '/assets/images/gallery/carousel/rotating1.jpg',
    '/assets/images/lifestyle/superyacht-ops.jpg',
    '/assets/images/gallery/flying/foggy-evening-flying.jpg',
    '/assets/images/facility/hq-0345.jpg',
  ];

  // Images for fullwidth staggered layout
  const staggeredImages = [
    '/assets/images/expeditions/helicopter-expeditions-quentin-smith.webp',
    '/assets/images/expeditions/north-pole.jpg',
    '/assets/images/facility/hq-0089.jpg',
    '/assets/images/expeditions/antartica.jpg',
    '/assets/images/facility/hq-0035.jpg',
    '/assets/images/expeditions/channel.jpg',
    '/assets/images/facility/busy-hangar.jpg',
    '/assets/images/expeditions/south-pole-by-helicopter-quentin-smith.webp',
    '/assets/images/facility/hq-0053.jpg',
    '/assets/images/expeditions/six-helis-in-North-Pole.jpg',
  ];
  const containerRef = useRef(null);
  const heroRef = useRef(null);
  const navRef = useRef(null);
  const navSentinelRef = useRef(null);
  const aboutBtnRef = useRef(null);
  const aboutLabelRef = useRef(null);
  const videoLinesRef = useRef(null);
  const scrollingStripsWrapperRef = useRef(null);
  const clubhouseRef = useRef(null);
  const [mainHeroSlide, setMainHeroSlide] = useState(0);
  const mainHeroTimer = useRef(null);
  const startMainHeroTimer = () => {
    if (mainHeroTimer.current) clearInterval(mainHeroTimer.current);
    mainHeroTimer.current = setInterval(() => {
      setMainHeroSlide(prev => (prev + 1) % heroImages.length);
    }, 5000);
  };
  useEffect(() => { startMainHeroTimer(); return () => clearInterval(mainHeroTimer.current); }, []);
  const selectMainHero = (i) => { setMainHeroSlide(i); startMainHeroTimer(); };

  const [clubhouseOpacity, setClubhouseOpacity] = useState(0.12);
  const videoLinesInView = useInView(videoLinesRef, { once: true, amount: 0.5, margin: "0px 0px -200px 0px" });

  // Clubhouse: right side overlay fades in as you scroll
  useEffect(() => {
    const handleClubhouseScroll = () => {
      const el = clubhouseRef.current;
      if (!el) return;
      const rect = el.getBoundingClientRect();
      const progress = Math.max(0, Math.min(1, (window.innerHeight - rect.top) / el.offsetHeight));
      // Stay at base for first 50%, then fade in over the second half
      const delayed = Math.max(0, (progress - 0.5) * 2);
      setClubhouseOpacity(0.12 + delayed * 0.58);
    };
    window.addEventListener('scroll', handleClubhouseScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleClubhouseScroll);
  }, []);

  // Training carousel slides
  const trainingSlides = [
    {
      title: 'Discovery Flight',
      image: '/assets/images/gallery/carousel/rotating-4.jpg',
      description: 'Flying is the ultimate dream pursued by mankind. Should you want to live it for real, the discovery flight will certainly fulfil your expectations: After a pre-flight briefing, you will enjoy a full hands-on flying experience with one of our instructors.',
      cta: 'Learn More',
      link: '/training/trial-lessons'
    },
    {
      title: 'Private Pilot Licence',
      image: '/assets/images/gallery/carousel/rotating-4.jpg',
      description: 'Let aside the ground exams that most students self study before taking the tests on site, the obtention of a PPL(H) requires a minimum of 45 hrs of flight training, including 10 hrs of solo. The duration varies depending on commitment.',
      cta: 'Learn More',
      link: '/training/ppl'
    },
    {
      title: 'Commercial Pilot Licence',
      image: '/assets/images/gallery/carousel/rotating-4.jpg',
      description: 'Holding a Commercial Pilot Licence, CPL(H) gives you the status of professional helicopter pilot. To achieve this, 155 hrs of flying time post licence is required, of which 50 hrs must be Pilot In Command (PIC).',
      cta: 'Learn More',
      link: '/training'
    },
    {
      title: 'Type Rating',
      image: '/assets/images/gallery/carousel/rotating-4.jpg',
      description: 'Having achieved your PPL(H), you may wish to fly different types of helicopter. A type specific ground training course followed by a minimum of 5 Hrs of flight training will suffice to put you to the Type Rating test.',
      cta: 'Learn More',
      link: '/training/type-rating'
    },
    {
      title: 'Night Rating',
      image: '/assets/images/gallery/carousel/rotating-4.jpg',
      description: 'Holding a night rating gives you the most flexibility, as sunset will no longer prevent you from flying. To achieve this, 100 hrs of flying post licence is required, of which 60 Hrs must be Pilot In Command.',
      cta: 'Learn More',
      link: '/training'
    },
    {
      title: 'Self-Fly Hire',
      image: '/assets/images/gallery/carousel/rotating-4.jpg',
      description: 'With an impressive fleet of over 30 helicopters, HQ will certainly be able to facilitate your flying requirements, either on a short term hiring or on a long term leasing basis.',
      cta: 'Learn More',
      link: '/services'
    }
  ];

  // Carousel navigation
  const nextTrainingSlide = () => {
    setTrainingSlide((prev) => (prev + 1) % trainingSlides.length);
  };

  const prevTrainingSlide = () => {
    setTrainingSlide((prev) => (prev - 1 + trainingSlides.length) % trainingSlides.length);
  };

  // Sections for the scrolling content
  const sections = [
    {
      id: 'intro',
      preText: 'Welcome to',
      headline: ['HQ', 'Aviation'],
      description: 'The Robinson Specialists since 2010',
      image: null,
    },
    {
      id: 'excellence',
      preText: 'Built on',
      headline: ['Precision', '&', 'Excellence'],
      description: 'Three decades of uncompromising standards',
      image: null,
    },
    {
      id: 'training',
      preText: 'World-class',
      headline: ['Flight', 'Training'],
      description: 'From first flight to commercial certification',
      image: null,
    },
    {
      id: 'expeditions',
      preText: 'Beyond horizons',
      headline: ['Global', 'Expeditions'],
      description: 'Adventure awaits at every altitude',
      image: null,
    },
  ];

  // Navigation items for accordion
  const navItems = [
    { id: 'training', label: 'Flying', icon: '01' },
    { id: 'fleet', label: 'Fleet', icon: '02' },
    { id: 'expeditions', label: 'Expeditions', icon: '03' },
    { id: 'sales', label: 'Sales', icon: '04' },
    { id: 'maintenance', label: 'Maintenance', icon: '05' },
    { id: 'services', label: 'Services', icon: '06' },
    { id: 'pricing', label: 'Pricing', icon: '07' },
    { id: 'testimonials', label: 'Reviews', icon: '08' },
  ];

  useEffect(() => {
    // Trigger line animations after mount
    const timer = setTimeout(() => setLinesVisible(true), 100);
    return () => clearTimeout(timer);
  }, []);

  
  useEffect(() => {
    const handleScroll = () => {
      if (!containerRef.current) return;

      const scrollTop = window.scrollY;
      const windowHeight = window.innerHeight;
      const heroHeight = windowHeight * 4; // 4 sections worth of scroll

      // Calculate overall progress (0 to 1)
      const progress = Math.min(scrollTop / heroHeight, 1);
      setScrollProgress(progress);

      // Determine active section (0-3)
      const sectionIndex = Math.min(Math.floor(progress * 4), 3);
      setActiveSection(sectionIndex);

      // Hide scroll prompt after initial scroll
      setScrollPromptHidden(scrollTop > 100);

      // Hero elements hide earlier to avoid overlap with About section
      const shouldHide = scrollTop > heroHeight * 0.85;
      setImagesExpanded(shouldHide);

      // Trigger hero collapse when overlay disappears, reset when scrolling back up
      setHeroCollapsed(shouldHide);

      
      // Track about label sticky state - stops at the headline
      const aboutHeadline = document.querySelector('.fd-about__headline');
      const heroThreshold = heroHeight * 0.85;

      // Track when hero collapse first happens to add buffer
      if (shouldHide && !window._heroCollapseScrollPos) {
        window._heroCollapseScrollPos = scrollTop;
        console.log('=== HERO COLLAPSED - Label should appear ===');
        console.log('Collapse scroll position:', scrollTop);

        // Check actual element state after React re-renders
        setTimeout(() => {
          const labelEl = document.querySelector('.fd-about__label');
          if (labelEl) {
            console.log('AFTER RENDER - Label classes:', labelEl.className);
            console.log('AFTER RENDER - Opacity:', window.getComputedStyle(labelEl).opacity);
          }
        }, 100);
      } else if (!shouldHide) {
        window._heroCollapseScrollPos = null;
      }

      if (aboutHeadline && shouldHide) {
        const headlineRect = aboutHeadline.getBoundingClientRect();
        const stickyTop = 90;

        // Require 100px of scroll after hero collapses before label can become static
        const scrollSinceCollapse = scrollTop - (window._heroCollapseScrollPos || scrollTop);
        const canBecomeStatic = scrollSinceCollapse > 100;
        const newStaticState = canBecomeStatic && headlineRect.top <= stickyTop;

        if (newStaticState !== window._lastStaticState) {
          console.log('--- STATIC STATE CHANGE ---');
          console.log('scrollSinceCollapse:', scrollSinceCollapse);
          console.log('canBecomeStatic (need >100):', canBecomeStatic);
          console.log('headlineRect.top:', headlineRect.top);
          console.log('aboutLabelStatic changing to:', newStaticState);
          window._lastStaticState = newStaticState;
        }

        setAboutLabelStatic(newStaticState);
      } else if (!shouldHide) {
        if (window._lastStaticState !== false) {
          console.log('--- RESET: scrolled back up past hero ---');
          window._lastStaticState = false;
        }
        setAboutLabelStatic(false);
      }

      // Detect which content section is in view for nav highlighting
      const navSectionIds = ['training', 'fleet', 'expeditions', 'sales', 'maintenance', 'contact'];
      let currentNavSection = null;

      for (const sectionId of navSectionIds) {
        const element = document.getElementById(sectionId);
        if (element) {
          const rect = element.getBoundingClientRect();
          // Section is "active" if its top is in the upper half of viewport
          if (rect.top <= windowHeight * 0.5 && rect.bottom >= 100) {
            currentNavSection = sectionId;
          }
        }
      }

      setActiveNavSection(currentNavSection);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Kill scroll momentum at 0.85 of hero height for 1 second
  useEffect(() => {
    let dampingActive = false;
    let dampingTimeout = null;

    const handleWheel = (e) => {
      const scrollY = window.scrollY;
      const windowHeight = window.innerHeight;
      const heroHeight = windowHeight * 4;
      const threshold = heroHeight * 0.85;

      // Entering the damping zone - start 1s timer
      if (scrollY >= threshold && !dampingActive && dampingTimeout === null) {
        dampingActive = true;
        dampingTimeout = setTimeout(() => {
          dampingActive = false;
        }, 500);
      }

      // Reset if scrolled back above threshold
      if (scrollY < threshold) {
        dampingActive = false;
        if (dampingTimeout) {
          clearTimeout(dampingTimeout);
          dampingTimeout = null;
        }
      }

      // Apply damping while active
      if (dampingActive) {
        e.preventDefault();
        const scrollAmount = Math.sign(e.deltaY) * 10;
        window.scrollBy(0, scrollAmount);
      }
    };

    window.addEventListener('wheel', handleWheel, { passive: false });
    return () => {
      window.removeEventListener('wheel', handleWheel);
      if (dampingTimeout) clearTimeout(dampingTimeout);
    };
  }, []);

  // Self-contained two-step sticky nav
  // Step 1: Nav sticks below header (full nav visible with "Explore" header)
  // Step 2: After scrolling 200px more, "Explore" slides behind header, only tabs remain
  // Resilient to any DOM changes above the nav
  useEffect(() => {
    if (!navSentinelRef.current) return;
    const HEADER_HEIGHT = 49; // site header height when scrolled
    const COMPACT_SCROLL_DISTANCE = 200; // px after sticking before going compact

    const handleScroll = () => {
      const sentinelTop = navSentinelRef.current.getBoundingClientRect().top;
      const pastHeader = sentinelTop < HEADER_HEIGHT;
      setNavFixed(pastHeader);
      setNavCompact(pastHeader && sentinelTop < HEADER_HEIGHT - COMPACT_SCROLL_DISTANCE);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Scroll reveal effect - elements fade in when scrolling into view, reset when leaving
  useEffect(() => {
    const reveals = document.querySelectorAll('.reveal-element');
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible');
          } else {
            // Reset when element leaves viewport - animation will replay on re-entry
            entry.target.classList.remove('visible');
          }
        });
      },
      { threshold: 0.1 }
    );
    reveals.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  
  const scrollToSection = (sectionId) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const rebuildSteps = [
    { label: 'Airframe', before: '/assets/images/rebuilds/airframe-before.jpg', after: '/assets/images/rebuilds/airframe-after.jpg', beforeDesc: 'Corrosion, fatigue cracks and fifteen years of wear across the bare airframe.', afterDesc: 'Stripped, inspected, repaired and re-protected — ready for another lifetime.' },
    { label: 'Engine', before: '/assets/images/rebuilds/engine-before.jpg', after: '/assets/images/rebuilds/engine-after.jpg', beforeDesc: '2,200 hours. Worn bearings, degraded seals, metal particles in the oil filter.', afterDesc: 'Zero-time overhaul. Factory-new components throughout, test-run and certified.' },
    { label: 'Avionics', before: '/assets/images/rebuilds/avionics-before.jpg', after: '/assets/images/rebuilds/avionics-after.jpg', beforeDesc: 'Original analogue panel. Faded placards, intermittent radios, no GPS.', afterDesc: 'Full glass cockpit. Garmin suite, GPS/NAV/COM, ADS-B, four-axis autopilot.' },
    { label: 'Wiring', before: '/assets/images/rebuilds/wiring-before.jpg', after: '/assets/images/rebuilds/wiring-after.jpg', beforeDesc: 'Brittle insulation, spliced repairs, corroded connectors. An electrician\'s nightmare.', afterDesc: 'Complete rewire. New looms, mil-spec connectors, laser-etched labels throughout.' },
    { label: 'Interior', before: '/assets/images/rebuilds/interior-before.jpg', after: '/assets/images/rebuilds/interior-after.jpg', beforeDesc: 'Cracked leather, worn carpet, sun-bleached trim. Functional but tired.', afterDesc: 'Hand-stitched leather, custom upholstery, noise-dampening panels. Better than new.' },
    { label: 'Paint', before: '/assets/images/rebuilds/paint-before.jpg', after: '/assets/images/rebuilds/paint-after.jpg', beforeDesc: 'Oxidised, chipped and faded. The livery has seen better days.', afterDesc: 'Stripped to bare metal and refinished in custom livery. Mirror finish, UV-sealed.' },
  ];

  const rebuildPortfolio = [
    {
      model: 'R44 Raven II', reg: 'G-RROB', year: 2019,
      scope: 'Full rebuild — zero-time engine, Garmin G500H TXi, custom leather interior, metallic blue livery.',
      duration: '8 months',
      img: '/assets/images/new-aircraft/r44/raven-ii-front-alpha.png',
      details: 'Complete strip-down and rebuild to zero-time specification. The owner requested a full glass cockpit upgrade with Garmin G500H TXi and GTN 650Xi. Interior finished in hand-stitched navy leather with contrast stitching. Exterior resprayed in a custom metallic blue livery with platinum pinstripe.',
      highlights: ['Zero-time O-540 engine', 'Garmin G500H TXi glass panel', 'Custom leather interior', 'Metallic blue respray'],
      gallery: [
        '/assets/images/new-aircraft/r44/raven-ii-front-alpha.png',
        '/assets/images/new-aircraft/r44/r44blueprint.jpg',
        '/assets/images/new-aircraft/r44/raven-ii-front-alpha.png',
      ],
    },
    {
      model: 'R22 Beta II', reg: 'G-BWZZ', year: 2016,
      scope: 'Training fleet rebuild — new O-360, glass panel, high-vis paint scheme, noise-dampening kit.',
      duration: '5 months',
      img: '/assets/images/new-aircraft/r22/r22-red-volcano-front-alpha-v3.png',
      details: 'Fleet rebuild for a UK flight school. Engine replaced with factory-new Lycoming O-360, paired with a Garmin G5 digital display. High-visibility orange and white paint scheme designed for training operations. Noise-dampening kit fitted throughout for student comfort.',
      highlights: ['Factory-new O-360 engine', 'Garmin G5 display', 'High-vis training livery', 'Acoustic dampening kit'],
      gallery: [
        '/assets/images/new-aircraft/r22/r22-red-volcano-front-alpha-v3.png',
        '/assets/images/new-aircraft/r22/r22-red-volcano-front-alpha-v3.png',
        '/assets/images/new-aircraft/r22/r22-red-volcano-front-alpha-v3.png',
      ],
    },
    {
      model: 'R66 Turbine', reg: 'G-NXG1', year: 2018,
      scope: 'Owner rebuild — RR300 overhaul, GTN 750Xi, Alcantara interior, ceramic-coated paint.',
      duration: '11 months',
      img: '/assets/images/new-aircraft/r66/blue-r66-palo-verde-left-v4.png',
      details: 'Comprehensive owner rebuild of a high-time R66. Rolls-Royce RR300 engine overhauled to zero-time, paired with GTN 750Xi navigator and GI 275 standby. Interior retrimmed in charcoal Alcantara with brushed aluminium accents. Exterior finished with a ceramic-coated charcoal-to-slate gradient paint.',
      highlights: ['RR300 zero-time overhaul', 'GTN 750Xi + GI 275', 'Alcantara interior', 'Ceramic-coated paint'],
      gallery: [
        '/assets/images/new-aircraft/r66/blue-r66-palo-verde-left-v4.png',
        '/assets/images/new-aircraft/r66/blue-r66-palo-verde-left-v4.png',
        '/assets/images/new-aircraft/r66/blue-r66-palo-verde-left-v4.png',
      ],
    },
    {
      model: 'R44 Cadet', reg: 'G-CADB', year: 2020,
      scope: 'School fleet — zero-time IO-540, digital engine monitor, reinforced skid gear.',
      duration: '6 months',
      img: '/assets/images/new-aircraft/r44/raven-ii-front-alpha.png',
      details: 'Training-optimised rebuild for a UK ATO. Zero-timed IO-540 with JPI EDM-900 engine monitor. Reinforced skid gear and ground-handling wheels for student operations. Simplified VFR panel with Garmin GI 275 and GTR 225A comm.',
      highlights: ['Zero-time IO-540', 'JPI EDM-900 monitor', 'Reinforced skid gear', 'Training-spec panel'],
      gallery: [
        '/assets/images/new-aircraft/r44/raven-ii-front-alpha.png',
        '/assets/images/new-aircraft/r44/raven-ii-front-alpha.png',
        '/assets/images/new-aircraft/r44/raven-ii-front-alpha.png',
      ],
    },
    {
      model: 'R44 Raven II', reg: 'G-HQAV', year: 2015,
      scope: 'Private owner — full strip, corrosion treatment, bespoke two-tone livery, aux tank fitted.',
      duration: '9 months',
      img: '/assets/images/new-aircraft/r44/r44blueprint.jpg',
      details: 'Full strip-down for a private owner who wanted a touring-spec aircraft. Comprehensive corrosion treatment and NDT inspection of all critical components. Aux fuel tank fitted for extended range. Bespoke two-tone ivory and charcoal livery with gold detailing.',
      highlights: ['Full corrosion treatment', 'Aux fuel tank fitted', 'Bespoke two-tone livery', 'Touring-spec rebuild'],
      gallery: [
        '/assets/images/new-aircraft/r44/r44blueprint.jpg',
        '/assets/images/new-aircraft/r44/raven-ii-front-alpha.png',
        '/assets/images/new-aircraft/r44/r44blueprint.jpg',
      ],
    },
  ];

  return (
    <div className="final-draft" ref={containerRef}>
      {/* ===== HEADER WITH SPOTLIGHT ANIMATION ===== */}
      <FinalDraftHeader />

      {/* ===== HERO SECTION ===== */}
      <section className={`fd-hero ${heroCollapsed ? 'fd-hero--collapsed' : ''}`} ref={heroRef}>
        {/* SVG Path that draws on scroll */}
        <HeroScrollPath containerRef={heroRef} hidden={imagesExpanded} />

        {/* Animated Grid Lines - hides after hero section */}
        <div className={`fd-hero__grid ${linesVisible ? 'fd-hero__grid--visible' : ''} ${imagesExpanded ? 'fd-hero__grid--hidden' : ''}`}>
          <div className="fd-hero__line fd-hero__line--v1"></div>
          <div className="fd-hero__line fd-hero__line--v2"></div>
          <div className="fd-hero__line fd-hero__line--v3"></div>
          <div className="fd-hero__line fd-hero__line--v4"></div>
          <div className={`fd-hero__line fd-hero__line--h1 ${scrollPromptHidden ? 'fd-hero__line--hidden' : ''}`}></div>
          <div className={`fd-hero__line fd-hero__line--h2 ${scrollPromptHidden ? 'fd-hero__line--hidden' : ''}`}></div>
        </div>

        {/* Fixed Left Image - Cycles on scroll */}
        <div
          className={`fd-hero__image fd-hero__image--left ${imagesExpanded ? 'fd-hero__image--expanded' : ''}`}
          style={{
            opacity: linesVisible ? 1 : 0,
            transform: imagesExpanded ? 'translateX(-100%)' : 'translateX(0)'
          }}
        >
          {leftImages.map((src, index) => (
            <img
              key={src}
              src={src}
              alt=""
              className={`fd-hero__cycle-img ${activeSection === index ? 'fd-hero__cycle-img--active' : ''}`}
            />
          ))}
        </div>

        {/* Fixed Right Image - Cycles on scroll */}
        <div
          className={`fd-hero__image fd-hero__image--right ${imagesExpanded ? 'fd-hero__image--expanded' : ''}`}
          style={{
            opacity: linesVisible ? 1 : 0,
            transform: imagesExpanded ? 'translateX(100%)' : 'translateX(0)'
          }}
        >
          {rightImages.map((src, index) => (
            <img
              key={src}
              src={src}
              alt=""
              className={`fd-hero__cycle-img ${activeSection === index ? 'fd-hero__cycle-img--active' : ''}`}
            />
          ))}
        </div>

        {/* Scrolling Content Container - hides after hero section */}
        <div className={`fd-hero__scroll-container ${imagesExpanded ? 'fd-hero__scroll-container--hidden' : ''}`}>
          {sections.map((section, index) => (
            <div
              key={section.id}
              className={`fd-hero__section ${activeSection === index ? 'fd-hero__section--active' : ''} ${section.image ? 'fd-hero__section--with-image' : ''}`}
            >
              {/* Text Content */}
              <div className="fd-hero__section-text">
                {/* Coordinates */}
                <div className="fd-hero__coords">
                  <span>51.5751°N</span>
                  <UnionJack size={14} id="coords" />
                  <span>0.5059°W</span>
                </div>

                {/* Pre-text */}
                <span className="fd-hero__pre">{section.preText}</span>

                {/* Headline with varying colors */}
                <h1 className="fd-hero__headline">
                  {section.headline.map((word, i) => (
                    <span
                      key={i}
                      className={`fd-hero__word fd-hero__word--${i + 1}`}
                      style={{ '--delay': `${i * 0.1}s` }}
                    >
                      {word}
                    </span>
                  ))}
                </h1>

                {/* Description */}
                <p className="fd-hero__desc">{section.description}</p>
              </div>

              {/* Section Image (if exists) */}
              {section.image && (
                <div className="fd-hero__section-image">
                  <img src={section.image} alt="" />
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Scroll Prompt - hides after hero section */}
        <div className={`fd-hero__scroll-prompt ${scrollPromptHidden ? 'fd-hero__scroll-prompt--hidden' : ''}`}>
          <span className="fd-hero__scroll-text">Scroll to explore</span>
          <div className="fd-hero__scroll-line">
            <span></span>
          </div>
        </div>

        {/* Progress Indicator - hides after hero section */}
        <div className={`fd-hero__progress ${imagesExpanded ? 'fd-hero__progress--hidden' : ''}`}>
          {sections.map((_, index) => (
            <div
              key={index}
              className={`fd-hero__progress-dot ${activeSection >= index ? 'fd-hero__progress-dot--active' : ''}`}
            />
          ))}
        </div>
      </section>

      {/* ===== ABOUT US VIDEO SECTION ===== */}
      <section className="fd-about" id="about">
        <div className={`fd-about__video-lines ${videoLinesInView ? 'visible' : ''}`}>
          <span className="fd-about__line fd-about__line--1"></span>
          <span className="fd-about__line fd-about__line--2"></span>
          <span className="fd-about__line fd-about__line--3"></span>
        </div>
        <div className="fd-about__content">
          <div ref={aboutLabelRef} className={`fd-about__label ${heroCollapsed ? 'fd-about__label--visible' : ''} ${aboutLabelStatic ? 'fd-about__label--static' : ''}`}>
            <span className="fd-about__label-line"></span>
            <span>About Us</span>
            <span className="fd-about__label-line"></span>
          </div>
          <h2 className="fd-about__headline fd-about__headline--single-line">
            <span>The Story</span> <span>Behind the</span> <span>Journey</span>
          </h2>

          <div className="fd-about__video" ref={videoLinesRef}>
            <div className="fd-about__video-placeholder">
              <img src={aboutImage} alt="" />
              <div className="fd-about__video-overlay">
                <button className="fd-about__play-btn">
                  <span></span>
                </button>
                <span className="fd-about__video-label">Watch Our Story</span>
              </div>
            </div>
          </div>

          {/* Two-column layout: About text left, Why We Fly card right */}
          <div className="fd-about__split">
            <div className="fd-about__split-left">
              <p className="fd-about__text">
                Founded in 2010 at Denham Aerodrome, HQ Aviation has grown to become
                the UK's leading Robinson helicopter specialists. Our commitment to
                excellence in training, sales, and maintenance has earned us the trust
                of pilots worldwide.
              </p>
              <Link to="/about-us" className="fd-about__btn">Learn More<span>→</span></Link>
            </div>

            <div className="fd-about__split-right" ref={aboutBtnRef}>
              <div className="fd-about__wf-card">
                    <div className="fd-about__wf-img">
                      {whyFlyImages.map((src, idx) => (
                        <div key={idx} className={`fd-about__wf-slide ${idx === whyFlySlide ? 'active' : ''}`} style={{ backgroundImage: `url(${src})` }} />
                      ))}
                    </div>
                    <div className="fd-about__wf-body">
                      <h3>
                        <span className="fd-about__wf-verb">{whyFlyBenefits[whyFlySlide].verb}</span>{' '}
                        <span className="fd-about__wf-noun">{whyFlyBenefits[whyFlySlide].noun}</span>
                      </h3>
                      <p>{whyFlyBenefits[whyFlySlide].desc}</p>
                    </div>
                    <div className="fd-about__wf-footer">
                      <div className="fd-about__wf-dots">
                        {whyFlyBenefits.map((_, idx) => (
                          <div key={idx} className={`fd-about__wf-dot ${idx === whyFlySlide ? 'active' : ''}`} onClick={() => setWhyFlySlide(idx)} />
                        ))}
                        <span className="fd-about__wf-counter">{String(whyFlySlide + 1).padStart(2, '0')} / {String(whyFlyBenefits.length).padStart(2, '0')}</span>
                      </div>
                      <div className="fd-about__wf-arrows">
                        <button onClick={() => setWhyFlySlide(prev => prev === 0 ? whyFlyBenefits.length - 1 : prev - 1)} aria-label="Previous">
                          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M15 18l-6-6 6-6" /></svg>
                        </button>
                        <button onClick={() => setWhyFlySlide(prev => prev === whyFlyBenefits.length - 1 ? 0 : prev + 1)} aria-label="Next">
                          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M9 18l6-6-6-6" /></svg>
                        </button>
                      </div>
                    </div>
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* Sentinel for JS-based sticky nav */}
      <div ref={navSentinelRef} style={{ height: 0, margin: 0, padding: 0 }} />
      {navFixed && <div style={{ height: navRef.current ? navRef.current.offsetHeight : 0 }} />}

      {/* ===== HORIZONTAL ACCORDION NAVIGATION ===== */}
      <nav className={`fd-nav ${navCompact ? 'fd-nav--compact' : ''} ${navFixed ? 'fd-nav--fixed' : ''}`} ref={navRef}>
        <div className="fd-nav__header">
          <span className="fd-nav__line"></span>
          <span>Explore</span>
          <span className="fd-nav__line"></span>
        </div>

        <div className="fd-nav__accordion">
          {navItems.map((item) => (
            <button
              key={item.id}
              className={`fd-nav__item ${activeNavSection === item.id ? 'fd-nav__item--active' : ''}`}
              onClick={() => scrollToSection(item.id)}
            >
              <span className="fd-nav__item-icon">{item.icon}</span>
              <span className="fd-nav__item-label">{item.label}</span>
            </button>
          ))}
        </div>
      </nav>

      {/* ===== PARALLAX: TRAINING ===== */}
      <ParallaxSection
        image="/assets/images/gallery/flying/flying-.jpg"
        alt="Training"
        className="reveal-element"
        waves={true}
      >
        <h2 className="parallax-section__title">Flying</h2>
      </ParallaxSection>

      {/* ===== CONTENT SECTIONS ===== */}
      <div className="fd-training-wrapper">
        <section className="fd-section fd-section--with-carousel reveal-element" id="training">
          {/* ===== SCROLL PATH ANIMATION ===== */}
          <div className="fd-scroll-path-wrapper">
            <ScrollPathAnimation
              iconSrc="/assets/images/icons/r66-icon-transparent going right.svg"
              iconSize={60}
              colorStart="#FFFFFF"
              colorMid="#5B9BD5"
              colorEnd="#1E3A5F"
            />
          </div>

          {/* ===== TRAINING CAROUSEL ===== */}
          <div className="fd-carousel-section">
          <div className="carousel carousel--97">
            <div className="carousel__tabs-wrapper">
              <div className="carousel__tabs">
                {trainingSlides.map((slide, index) => (
                  <button
                    key={index}
                    className={`carousel__tab ${index === trainingSlide ? 'active' : ''}`}
                    onClick={() => setTrainingSlide(index)}
                  >
                    <span className="carousel__tab-num">{String(index + 1).padStart(2, '0')}</span>
                    <span className="carousel__tab-title">{slide.title}</span>
                  </button>
                ))}
              </div>
            </div>
            <div className="carousel__body">
              <button className="carousel__arrow" onClick={prevTrainingSlide}>
                <svg width="48" height="20" viewBox="0 0 48 20">
                  <line x1="48" y1="10" x2="6" y2="10" stroke="currentColor" strokeWidth="2"/>
                  <polyline points="14 3 6 10 14 17" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </button>
              <div className="carousel__main">
                <div className="carousel__content">
                  <div className="carousel__text-content">
                    {trainingSlides.map((slide, index) => (
                      <div key={index} className={`carousel__slide-content ${index === trainingSlide ? 'active' : ''}`}>
                        <div className="carousel__title-row">
                          <div className="carousel__number-wrapper">
                            <span className="carousel__inline-number">{String(index + 1).padStart(2, '0')}</span>
                          </div>
                          <h3>{slide.title}</h3>
                        </div>
                        <p>{slide.description}</p>
                        <Link to={slide.link} className="carousel__btn">
                          <span>{slide.cta}</span>
                          <svg className="carousel__btn-chevron" width="16" height="16" viewBox="0 0 16 16" fill="none">
                            <path d="M6 3L11 8L6 13" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                          </svg>
                        </Link>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="carousel__divider"></div>
                <div className="carousel__image">
                  {trainingSlides.map((slide, index) => (
                    <img key={index} src={slide.image} alt={slide.title} className={index === trainingSlide ? 'active' : ''} />
                  ))}
                </div>
              </div>
              <button className="carousel__arrow" onClick={nextTrainingSlide}>
                <svg width="48" height="20" viewBox="0 0 48 20">
                  <line x1="0" y1="10" x2="42" y2="10" stroke="currentColor" strokeWidth="2"/>
                  <polyline points="34 3 42 10 34 17" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </button>
            </div>
            <div className="carousel__progress">
              <div className="carousel__progress-bar" style={{ width: `${((trainingSlide + 1) / trainingSlides.length) * 100}%` }}></div>
            </div>
          </div>
          </div>
        </section>
      </div>

      {/* ===== THE CLUBHOUSE ===== */}
      <section className="clubhouse reveal-element" ref={clubhouseRef}>
        <div style={{ margin: '0 auto 1.5rem', position: 'relative', zIndex: 2 }} />
        <div className="clubhouse__inner">
          <div className="clubhouse__sticky">
            <span className="clubhouse__pretitle">Denham Aerodrome</span>
            <h3 className="clubhouse__title">The Clubhouse</h3>
            <p className="clubhouse__desc">
              More than a flight school — a place to belong. Leather sofas, expedition memorabilia,
              and the quiet hum of rotors outside. This is where pilots debrief over coffee,
              swap stories, and plan their next adventure.
            </p>
            <span className="clubhouse__tagline">Friendly. Relaxed. Welcoming.</span>
          </div>
          <div className="clubhouse__bg-right" style={{ opacity: clubhouseOpacity }} />
          <div className="clubhouse__bg-border" />
          <div className="clubhouse__gallery">
            {/* Wide hero shot */}
            <div className="clubhouse__img clubhouse__img--wide">
              <img src="/assets/images/facility/hq-0345.jpg" alt="The clubhouse lounge" loading="lazy" />
            </div>
            {/* Two squares side by side */}
            <div className="clubhouse__img">
              <img src="/assets/images/facility/hq-0354.jpg" alt="Globe on the clubhouse desk" loading="lazy" />
            </div>
            <div className="clubhouse__img">
              <img src="/assets/images/facility/hq-0053.jpg" alt="Helmet light and framed photos" loading="lazy" />
            </div>
            {/* Tall portrait left + square right */}
            <div className="clubhouse__img clubhouse__img--tall">
              <img src="/assets/images/facility/hq-0391.jpg" alt="Captain Q expedition photo on the wall" loading="lazy" />
            </div>
            <div className="clubhouse__img">
              <img src="/assets/images/facility/hq-0477.jpg" alt="Helicopter compass instrument" loading="lazy" />
            </div>
            {/* Wide cinematic */}
            <div className="clubhouse__img clubhouse__img--wide">
              <img src="/assets/images/facility/hq-0300.jpg" alt="R66 Turbine cockpit instruments" loading="lazy" />
            </div>
            {/* Two squares */}
            <div className="clubhouse__img">
              <img src="/assets/images/facility/hq-0388.jpg" alt="Air Pilot's Manual on vintage trunk" loading="lazy" />
            </div>
            <div className="clubhouse__img">
              <img src="/assets/images/facility/hq-0696.jpg" alt="Captain Q flying" loading="lazy" />
            </div>
            {/* Wide closing shot */}
            <div className="clubhouse__img clubhouse__img--wide">
              <img src="/assets/images/facility/hq-0153-3.jpg" alt="Helicopters on the airfield" loading="lazy" />
            </div>
          </div>
        </div>
      </section>

      {/* ===== PARALLAX: FLEET ===== */}
      <ParallaxSection
        image="/assets/images/facility/hq-aviation-robinsons.jpg"
        alt="Our Fleet"
        className="reveal-element"
        waves={true}
      >
        <h2 className="parallax-section__title">Self-Fly Hire</h2>
      </ParallaxSection>

      {/* ===== SELF-FLY HIRE — DARK MAP + JOURNEY TIMELINE ===== */}
      <SelfFlyHireSection />

      {/* ===== SCROLLING STRIPS - DESTINATIONS (V42 Editorial Luxury) ===== */}
      <div className="scrolling-strips-wrapper" ref={scrollingStripsWrapperRef}>
        {/* Background texture — scrolls naturally behind sticky strips */}
        <div className="scrolling-strips-bg" aria-hidden="true">
          <div className="scrolling-strips-bg__grid"></div>
        </div>
        <EditorialStrips wrapperRef={scrollingStripsWrapperRef} />
        <div className="scrolling-strips-spacer"></div>
      </div>

      {/* ===== PARALLAX: EXPEDITIONS ===== */}
      <ParallaxSection
        image="/assets/images/expeditions/six-helis-in-North-Pole.jpg"
        alt="Global Expeditions"
        className="reveal-element"
        waves={true}
      >
        <h2 className="parallax-section__title">Expeditions</h2>
      </ParallaxSection>

      {/* ===== IMMERSIVE EXPEDITIONS SECTION ===== */}
      <section className="fd-exped reveal-element" id="expeditions">
        {/* Cinematic Opening */}
        <div className="fd-exped__cinematic">
          <div className="fd-exped__cinematic-bg">
            <video autoPlay muted loop playsInline>
              <source src="/assets/video/expedition-reel.mp4" type="video/mp4" />
            </video>
            <div className="fd-exped__cinematic-overlay"></div>
          </div>
          {/* Globe SVG underlay — 10 variations */}
          <div className="fd-exped__globe-picker">
            <button onClick={() => setGlobeVariant((globeVariant - 1 + 10) % 10)}>
              <svg viewBox="0 0 24 24"><path d="M15 18l-6-6 6-6"/></svg></button>
            <span>Globe {globeVariant + 1} / 10</span>
            <button onClick={() => setGlobeVariant((globeVariant + 1) % 10)}>
              <svg viewBox="0 0 24 24"><path d="M9 18l6-6-6-6"/></svg></button>
          </div>
          <div className="fd-exped__globe">
            {globeVariant === 0 && (
            <svg viewBox="0 0 600 600" fill="none" xmlns="http://www.w3.org/2000/svg">
              {/* V1: Classic Cartographic Globe */}
              <defs><clipPath id="gc"><circle cx="300" cy="300" r="279" /></clipPath></defs>
              <circle cx="300" cy="300" r="280" stroke="currentColor" strokeWidth="1.2" opacity="0.2" />
              <g clipPath="url(#gc)">
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
            )}
            {globeVariant === 1 && (
            <svg viewBox="0 0 600 600" fill="none" xmlns="http://www.w3.org/2000/svg">
              {/* V2: Orbital — three tilted great-circle rings */}
              <circle cx="300" cy="300" r="280" stroke="currentColor" strokeWidth="0.5" opacity="0.1" />
              <ellipse cx="300" cy="300" rx="280" ry="80" stroke="currentColor" strokeWidth="1" opacity="0.18" transform="rotate(-25 300 300)" />
              <ellipse cx="300" cy="300" rx="260" ry="95" stroke="currentColor" strokeWidth="0.8" opacity="0.14" transform="rotate(40 300 300)" />
              <ellipse cx="300" cy="300" rx="220" ry="65" stroke="currentColor" strokeWidth="0.6" opacity="0.1" transform="rotate(-70 300 300)" />
              <circle cx="300" cy="300" r="3" fill="currentColor" opacity="0.15" />
            </svg>
            )}
            {globeVariant === 2 && (
            <svg viewBox="0 0 600 600" fill="none" xmlns="http://www.w3.org/2000/svg">
              {/* V3: Dense Wireframe — fine 3D mesh */}
              <defs><clipPath id="gc3"><circle cx="300" cy="300" r="279" /></clipPath></defs>
              <circle cx="300" cy="300" r="280" stroke="currentColor" strokeWidth="1" opacity="0.18" />
              <g clipPath="url(#gc3)">
                {Array.from({ length: 11 }, (_, i) => {
                  const d = (i + 1) * 15;
                  return <ellipse key={`m${i}`} cx="300" cy="300" rx={Math.round(280 * Math.sin(d * Math.PI / 180))} ry="280" stroke="currentColor" strokeWidth="0.3" opacity="0.07" />;
                })}
                {Array.from({ length: 5 }, (_, i) => {
                  const lat = (i + 1) * 15;
                  const o = Math.round(280 * Math.sin(lat * Math.PI / 180));
                  const hw = Math.round(280 * Math.cos(lat * Math.PI / 180));
                  return [
                    <line key={`n${i}`} x1={300 - hw} y1={300 - o} x2={300 + hw} y2={300 - o} stroke="currentColor" strokeWidth="0.3" opacity="0.07" />,
                    <line key={`s${i}`} x1={300 - hw} y1={300 + o} x2={300 + hw} y2={300 + o} stroke="currentColor" strokeWidth="0.3" opacity="0.07" />
                  ];
                })}
                <line x1="20" y1="300" x2="580" y2="300" stroke="currentColor" strokeWidth="0.5" opacity="0.12" />
              </g>
            </svg>
            )}
            {globeVariant === 3 && (
            <svg viewBox="0 0 600 600" fill="none" xmlns="http://www.w3.org/2000/svg">
              {/* V4: Compass Rose — aviation navigation */}
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
              <circle cx="300" cy="300" r="120" stroke="currentColor" strokeWidth="0.3" opacity="0.07" />
              <circle cx="300" cy="300" r="12" stroke="currentColor" strokeWidth="0.5" opacity="0.15" />
              <circle cx="300" cy="300" r="2.5" fill="currentColor" opacity="0.18" />
            </svg>
            )}
            {globeVariant === 4 && (
            <svg viewBox="0 0 600 600" fill="none" xmlns="http://www.w3.org/2000/svg">
              {/* V5: Dot Matrix — 3D pointillist globe */}
              <circle cx="300" cy="300" r="280" stroke="currentColor" strokeWidth="0.5" opacity="0.1" />
              {(() => {
                const dots = [];
                const R = 280;
                for (let lat = -75; lat <= 75; lat += 15) {
                  for (let lon = -90; lon <= 90; lon += 15) {
                    const cLa = Math.cos(lat * Math.PI / 180);
                    const sLa = Math.sin(lat * Math.PI / 180);
                    const cLo = Math.cos(lon * Math.PI / 180);
                    const sLo = Math.sin(lon * Math.PI / 180);
                    const depth = cLa * cLo;
                    if (depth > 0.05) {
                      const x = 300 + R * cLa * sLo;
                      const y = 300 - R * sLa;
                      dots.push(<circle key={`${lat}_${lon}`} cx={Math.round(x * 10) / 10} cy={Math.round(y * 10) / 10} r={1 + depth * 2} fill="currentColor" opacity={0.04 + depth * 0.16} />);
                    }
                  }
                }
                return dots;
              })()}
            </svg>
            )}
            {globeVariant === 5 && (
            <svg viewBox="0 0 600 600" fill="none" xmlns="http://www.w3.org/2000/svg">
              {/* V6: Art Deco — geometric luxury */}
              <circle cx="300" cy="300" r="280" stroke="currentColor" strokeWidth="2" opacity="0.2" />
              <circle cx="300" cy="300" r="274" stroke="currentColor" strokeWidth="0.5" opacity="0.1" />
              {Array.from({ length: 36 }, (_, i) => {
                const a = i * 10 * Math.PI / 180;
                const inner = i % 2 === 0 ? 100 : 180;
                return <line key={i} x1={300 + inner * Math.cos(a)} y1={300 + inner * Math.sin(a)} x2={300 + 274 * Math.cos(a)} y2={300 + 274 * Math.sin(a)} stroke="currentColor" strokeWidth={i % 6 === 0 ? '0.8' : '0.3'} opacity={i % 6 === 0 ? '0.15' : '0.06'} />;
              })}
              <circle cx="300" cy="300" r="200" stroke="currentColor" strokeWidth="1.2" opacity="0.12" />
              <circle cx="300" cy="300" r="100" stroke="currentColor" strokeWidth="1" opacity="0.1" />
              <line x1="20" y1="300" x2="580" y2="300" stroke="currentColor" strokeWidth="1" opacity="0.15" />
              <line x1="300" y1="20" x2="300" y2="580" stroke="currentColor" strokeWidth="1" opacity="0.15" />
              <path d="M300,280 L320,300 L300,320 L280,300 Z" stroke="currentColor" strokeWidth="0.8" opacity="0.15" fill="none" />
            </svg>
            )}
            {globeVariant === 6 && (
            <svg viewBox="0 0 600 600" fill="none" xmlns="http://www.w3.org/2000/svg">
              {/* V7: Atmospheric — concentric glow with flight path */}
              <defs>
                <radialGradient id="atm">
                  <stop offset="60%" stopColor="currentColor" stopOpacity="0" />
                  <stop offset="100%" stopColor="currentColor" stopOpacity="0.04" />
                </radialGradient>
              </defs>
              <circle cx="300" cy="300" r="295" fill="url(#atm)" />
              <circle cx="300" cy="300" r="280" stroke="currentColor" strokeWidth="1.5" opacity="0.18" />
              <circle cx="300" cy="300" r="260" stroke="currentColor" strokeWidth="0.4" opacity="0.08" />
              <circle cx="300" cy="300" r="230" stroke="currentColor" strokeWidth="0.3" opacity="0.06" />
              <circle cx="300" cy="300" r="190" stroke="currentColor" strokeWidth="0.25" opacity="0.05" />
              <circle cx="300" cy="300" r="140" stroke="currentColor" strokeWidth="0.2" opacity="0.04" />
              <ellipse cx="300" cy="300" rx="278" ry="120" stroke="currentColor" strokeWidth="0.8" opacity="0.14" transform="rotate(-30 300 300)" />
              <circle cx="300" cy="300" r="2" fill="currentColor" opacity="0.15" />
            </svg>
            )}
            {globeVariant === 7 && (
            <svg viewBox="0 0 600 600" fill="none" xmlns="http://www.w3.org/2000/svg">
              {/* V8: Meridian Weave — interlocking great circles */}
              <circle cx="300" cy="300" r="280" stroke="currentColor" strokeWidth="0.8" opacity="0.15" />
              {Array.from({ length: 7 }, (_, i) => (
                <ellipse key={i} cx="300" cy="300" rx="278" ry={50 + i * 18} stroke="currentColor" strokeWidth={0.4 + i * 0.05} opacity={0.06 + i * 0.015} transform={`rotate(${i * 25.7} 300 300)`} />
              ))}
              <circle cx="300" cy="300" r="2" fill="currentColor" opacity="0.12" />
            </svg>
            )}
            {globeVariant === 8 && (
            <svg viewBox="0 0 600 600" fill="none" xmlns="http://www.w3.org/2000/svg">
              {/* V9: Engraved — crosshatch tonal globe */}
              <defs><clipPath id="gc9"><circle cx="300" cy="300" r="279" /></clipPath></defs>
              <circle cx="300" cy="300" r="280" stroke="currentColor" strokeWidth="1" opacity="0.18" />
              <g clipPath="url(#gc9)">
                {Array.from({ length: 22 }, (_, i) => {
                  const offset = i * 28 - 10;
                  return <line key={`a${i}`} x1={offset} y1="0" x2={offset + 600} y2="600" stroke="currentColor" strokeWidth="0.25" opacity="0.05" />;
                })}
                {Array.from({ length: 22 }, (_, i) => {
                  const offset = i * 28;
                  return <line key={`b${i}`} x1={offset} y1="0" x2={offset - 600} y2="600" stroke="currentColor" strokeWidth="0.25" opacity="0.05" />;
                })}
                {[40, 90, 140].map(d => (
                  <ellipse key={d} cx="300" cy="300" rx={Math.round(280 * Math.sin(d * Math.PI / 180))} ry="280" stroke="currentColor" strokeWidth="0.5" opacity="0.1" />
                ))}
                <line x1="20" y1="300" x2="580" y2="300" stroke="currentColor" strokeWidth="0.5" opacity="0.1" />
              </g>
            </svg>
            )}
            {globeVariant === 9 && (
            <svg viewBox="0 0 600 600" fill="none" xmlns="http://www.w3.org/2000/svg">
              {/* V10: Elegant Minimal — refined essentials */}
              <circle cx="300" cy="300" r="280" stroke="currentColor" strokeWidth="1.5" opacity="0.2" />
              <ellipse cx="300" cy="300" rx="140" ry="280" stroke="currentColor" strokeWidth="0.6" opacity="0.12" />
              <ellipse cx="300" cy="300" rx="280" ry="50" stroke="currentColor" strokeWidth="0.7" opacity="0.13" />
              <line x1="300" y1="18" x2="300" y2="582" stroke="currentColor" strokeWidth="0.3" opacity="0.08" />
            </svg>
            )}
          </div>
          <div className="fd-exped__cinematic-content">
            <span className="fd-exped__pre-title">With Captain Quentin Smith</span>
            <h2 className="fd-exped__title">
              <span className="fd-exped__title-word fd-exped__title-word--1">Explore</span>
              <span className="fd-exped__title-word fd-exped__title-word--2">The</span>
              <span className="fd-exped__title-word fd-exped__title-word--3">Unreachable</span>
            </h2>
            <ExpeditionBarcode onSelect={(id) => setBarcodeSelected(!!id)} />
            {!barcodeSelected && (
            <p className="fd-exped__cinematic-desc">
              This isn't transport. This is using the helicopter as a gateway to the world—
              a first-class ticket to the beauty of our planet, seeing places in ways that
              very few have ever experienced before.
            </p>
            )}
            <div style={{ textAlign: 'center', marginTop: '2rem' }}>
              <Link to="/expeditions" className="fd-exped__btn fd-exped__btn--primary">View All Expeditions</Link>
            </div>
          </div>
        </div>


      </section>

      {/* ===== PARALLAX: SALES ===== */}
      <ParallaxSection
        image="/assets/images/facility/main-sales-pic.jpg"
        alt="Aircraft Sales"
        className="reveal-element"
        waves={true}
      >
        <h2 className="parallax-section__title">Sales</h2>
      </ParallaxSection>

      <section className="fd-sales reveal-element" id="sales">
        <div className="fd-sales__intro" ref={salesIntroRef}>
          <div className="fd-sales__left">
            <div className="fd-sales__header-sticky" ref={salesHeaderRef}>
              <span className="fd-sales__pre-title" ref={salesPreTitleRef}>Your Search Starts Here</span>
              <h2 className="fd-sales__title">
                <span className="fd-sales__title-word fd-sales__title-word--1">Find</span>
                <span className="fd-sales__title-word fd-sales__title-word--2">Your Next</span>
                <span className="fd-sales__title-word fd-sales__title-word--3">Aircraft</span>
              </h2>
              <p className="fd-sales__text">
                New and pre-owned helicopters, expertly sourced and prepared to the highest standards.
              </p>
              <div className="fd-sales__header-divider"></div>
            </div>
            <div className="fd-sales__dealer-catch" ref={salesDealerRef}>
              <div className="fd-sales__dealer-inner" ref={salesDealerInnerRef}>
                <DealerSplitDots />
              </div>
            </div>
          </div>
          <div className="fd-sales__intro-bg" />
          <div className="fd-sales__intro-border" />
          <div className="fd-sales__intro-gallery">
            <div className="fd-sales__intro-img fd-sales__intro-img--wide">
              <img src="/assets/images/facility/main-sales-pic.jpg" alt="HQ Aviation showroom" loading="lazy" />
            </div>
            <div className="fd-sales__intro-img fd-sales__intro-img--wide">
              <img src="/assets/images/facility/hq-aviation-robinsons.jpg" alt="Fleet on the apron" loading="lazy" />
            </div>
            <div className="fd-sales__intro-img">
              <img src="/assets/images/facility/hq-0477.jpg" alt="Helicopter instruments" loading="lazy" />
            </div>
            <div className="fd-sales__intro-img">
              <img src="/assets/images/facility/hq-0391.jpg" alt="Engineering workshop" loading="lazy" />
            </div>
            <div className="fd-sales__intro-img fd-sales__intro-img--wide">
              <img src="/assets/images/facility/hq-0745.jpg" alt="Helicopter on apron" loading="lazy" />
            </div>
            <div className="fd-sales__intro-img">
              <img src="/assets/images/facility/hq-0354.jpg" alt="Pre-flight checks" loading="lazy" />
            </div>
            <div className="fd-sales__intro-img">
              <img src="/assets/images/facility/hq-0696.jpg" alt="Cockpit detail" loading="lazy" />
            </div>
            <div className="fd-sales__intro-img fd-sales__intro-img--wide">
              <img src="/assets/images/facility/hq-0167.jpg" alt="Hangar interior" loading="lazy" />
            </div>
            <div className="fd-sales__intro-img">
              <img src="/assets/images/facility/hq-0089.jpg" alt="Rotor detail" loading="lazy" />
            </div>
            <div className="fd-sales__intro-img">
              <img src="/assets/images/facility/hq-0035.jpg" alt="Maintenance inspection" loading="lazy" />
            </div>
          </div>
        </div>

        {/* Toggle: RHC / Robinson Unmanned */}
        <div className="fd-sales__toggle-wrap">
          <div className="fd-sales__toggle">
            <button
              className={`fd-sales__toggle-btn ${salesTab === 'rhc' ? 'fd-sales__toggle-btn--active' : ''}`}
              onClick={() => setSalesTab('rhc')}
            >
              RHC
            </button>
            <button
              className={`fd-sales__toggle-btn ${salesTab === 'unmanned' ? 'fd-sales__toggle-btn--active' : ''}`}
              onClick={() => setSalesTab('unmanned')}
            >
              Robinson Unmanned
            </button>
          </div>
        </div>

        {salesTab === 'rhc' && (<>

        {/* ── Section 1: New Aircraft ── */}
        <div className={`fd-sales__subsection ${openSalesSection === 'new' ? 'fd-sales__subsection--open' : ''}`}>
        <h3 className="fd-sales__section-title" onClick={() => setOpenSalesSection(openSalesSection === 'new' ? null : 'new')}>
          New Aircraft
          <span className="fd-sales__section-chevron">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="6 9 12 15 18 9" /></svg>
          </span>
        </h3>
        <div className="fd-sales__section-body">
        <p className="fd-sales__section-desc">
          As an authorised Robinson dealer, we supply factory-new R22, R44, R66 and R88 helicopters — configured to your specification, delivered with full warranty and backed by our in-house maintenance team from day one.
        </p>
        <div className="fd-sales__grid">
          <Link to="/aircraft/r88" className="fd-sales__card">
            <div className="fd-sales__card-image">
              <img src="/assets/images/new-aircraft/r88/r88-jellybean-left.png" alt="R88" />
            </div>
            <div className="fd-sales__card-info">
              <h3>R88</h3>
              <span className="fd-sales__card-tagline">The Future of Rotorcraft</span>
              <div className="fd-sales__card-specs">
                <span>8 seats</span>
                <span>140 kts</span>
                <span>Turbine</span>
              </div>
              <span className="fd-sales__card-price">POA</span>
            </div>
          </Link>

          <Link to="/aircraft/r66" className="fd-sales__card">
            <div className="fd-sales__card-image">
              <img src="/assets/images/new-aircraft/r66/blue-r66-palo-verde-left-v4.png" alt="R66" />
            </div>
            <div className="fd-sales__card-info">
              <h3>R66</h3>
              <span className="fd-sales__card-tagline">Turbine Performance</span>
              <div className="fd-sales__card-specs">
                <span>5 seats</span>
                <span>120 kts</span>
                <span>Turbine</span>
              </div>
              <span className="fd-sales__card-price">$1,290,000</span>
            </div>
          </Link>

          <Link to="/aircraft/r44" className="fd-sales__card">
            <div className="fd-sales__card-image">
              <img src="/assets/images/new-aircraft/r44/raven-ii-front-alpha.png" alt="R44" />
            </div>
            <div className="fd-sales__card-info">
              <h3>R44</h3>
              <span className="fd-sales__card-tagline">World's Best-Selling</span>
              <div className="fd-sales__card-specs">
                <span>4 seats</span>
                <span>113 kts</span>
                <span>Piston</span>
              </div>
              <span className="fd-sales__card-price">$535,000</span>
            </div>
          </Link>

          <Link to="/aircraft/r22" className="fd-sales__card">
            <div className="fd-sales__card-image">
              <img src="/assets/images/new-aircraft/r22/r22-red-volcano-front-alpha-v3.png" alt="R22" />
            </div>
            <div className="fd-sales__card-info">
              <h3>R22</h3>
              <span className="fd-sales__card-tagline">Training Excellence</span>
              <div className="fd-sales__card-specs">
                <span>2 seats</span>
                <span>96 kts</span>
                <span>Piston</span>
              </div>
              <span className="fd-sales__card-price">$345,000</span>
            </div>
          </Link>
        </div>

        <div className="fd-sales__actions">
          <Link to="/sales/new" className="fd-sales__btn fd-sales__btn--primary">View New Aircraft</Link>
        </div>
        </div>{/* end section-body */}
        </div>

        {/* ── Section 2: Pre-Owned Aircraft ── */}
        <div className={`fd-sales__subsection ${openSalesSection === 'preowned' ? 'fd-sales__subsection--open' : ''}`}>
        <h3 className="fd-sales__section-title" onClick={() => setOpenSalesSection(openSalesSection === 'preowned' ? null : 'preowned')}>
          Pre-Owned Aircraft
          <span className="fd-sales__section-chevron">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="6 9 12 15 18 9" /></svg>
          </span>
        </h3>
        <div className="fd-sales__section-body">
        <p className="fd-sales__section-desc" style={{ marginBottom: '1.5rem' }}>
          Our clients regularly trade, upgrade and renew their fleets — which means we always have access to quality pre-owned aircraft at every stage of life. Many come directly from owners whose maintenance we've managed for years, so we know every hour, every component and every logbook entry. When the right aircraft isn't already on our doorstep, we'll source it — inspecting the airframe, engine and avionics on-site before it ever reaches you. Looking for something specific? Talk to our sales team and we'll begin the search.
        </p>
        <div className="fd-sales__carousel-wrap">
          {preownedCanScrollLeft && (
            <button className="rb-stats__chevron rb-stats__chevron--left" onClick={() => preownedRef.current.scrollBy({ left: -280, behavior: 'smooth' })}>
              <i className="fas fa-chevron-left"></i>
            </button>
          )}
          <div className="fd-sales__carousel" ref={preownedRef}>
            {[
              { model: 'R44 Raven II', year: 2019, hours: '1,200', img: '/assets/images/new-aircraft/r44/raven-ii-front-alpha.png' },
              { model: 'R66 Turbine', year: 2021, hours: '800', img: '/assets/images/new-aircraft/r66/blue-r66-palo-verde-left-v4.png' },
              { model: 'R22 Beta II', year: 2017, hours: '2,100', img: '/assets/images/new-aircraft/r22/r22-red-volcano-front-alpha-v3.png' },
              { model: 'R44 Cadet', year: 2020, hours: '950', img: '/assets/images/new-aircraft/r44/raven-ii-front-alpha.png' },
              { model: 'R66 Turbine', year: 2018, hours: '1,800', img: '/assets/images/new-aircraft/r66/blue-r66-palo-verde-left-v4.png' },
              { model: 'Cabri G2', year: 2022, hours: '400', img: '/assets/images/new-aircraft/r22/r22-red-volcano-front-alpha-v3.png' },
            ].map((ac, i) => (
              <div className="fd-sales__sold-card" key={i}>
                <div className="fd-sales__sold-badge">SOLD</div>
                <div className="fd-sales__sold-image">
                  <img src={ac.img} alt={ac.model} />
                </div>
                <div className="fd-sales__sold-info">
                  <strong>{ac.model}</strong>
                  <span>{ac.year} &middot; {ac.hours} hrs</span>
                </div>
              </div>
            ))}
          </div>
          {preownedCanScrollRight && (
            <button className="rb-stats__chevron rb-stats__chevron--right" onClick={() => preownedRef.current.scrollBy({ left: 280, behavior: 'smooth' })}>
              <i className="fas fa-chevron-right"></i>
            </button>
          )}
        </div>
        <div className="fd-sales__actions">
          <Link to="/sales/pre-owned" className="fd-sales__btn fd-sales__btn--primary">Browse Pre-Owned Aircraft</Link>
        </div>
        </div>{/* end section-body */}
        </div>

        {/* ── Section 3: Rebuilt Aircraft ── */}
        <div className={`fd-sales__subsection ${openSalesSection === 'rebuilt' ? 'fd-sales__subsection--open' : ''}`}>
        <h3 className="fd-sales__section-title" onClick={() => setOpenSalesSection(openSalesSection === 'rebuilt' ? null : 'rebuilt')}>
          Rebuilt Aircraft
          <span className="fd-sales__section-chevron">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="6 9 12 15 18 9" /></svg>
          </span>
        </h3>
        <div className="fd-sales__section-body">
        <p className="fd-sales__section-desc">
          Complete helicopter rebuilds from airframe up. Zero-time engines, custom avionics, fresh paint.
        </p>

        {/* Rebuilt Aircraft — scrolling strip with showcase detail */}
        {rebuildDetailOpen === null && (
        <div className="rb-stats rb-stats--card">
          <div className="rb-stats__intro">
            <h4 className="rb-stats__heading">Examples of Some of Our Rebuilds</h4>
            <p className="rb-stats__text">
              Complete helicopter rebuilds from airframe up. Zero-time engines, custom avionics, fresh paint.
              With 35+ rebuilds completed and 30 years of experience rebuilding R22, R44 and R66 types.
            </p>
          </div>
          <div className="rb-stats__strip-wrap">
            {stripCanScrollLeft && (
              <button className="rb-stats__chevron rb-stats__chevron--left" onClick={() => stripRef.current.scrollBy({ left: -260, behavior: 'smooth' })}>
                <i className="fas fa-chevron-left"></i>
              </button>
            )}
            <div className="rb-stats__strip" ref={stripRef}>
              {rebuildPortfolio.map((rb, i) => (
                <div className="rb-stats__strip-card" key={i} onClick={() => setRebuildDetailOpen(i)} style={{ cursor: 'pointer' }}>
                  <img src={rb.img} alt={rb.model} />
                  <div className="rb-stats__strip-info">
                    <strong>{rb.model}</strong>
                    <span>{rb.reg} · {rb.year}</span>
                  </div>
                </div>
              ))}
            </div>
            {stripCanScrollRight && (
              <button className="rb-stats__chevron rb-stats__chevron--right" onClick={() => stripRef.current.scrollBy({ left: 260, behavior: 'smooth' })}>
                <i className="fas fa-chevron-right"></i>
              </button>
            )}
          </div>
        </div>
        )}

        {/* Rebuild Detail — inline showcase */}
        {rebuildDetailOpen !== null && (() => {
          const rb = rebuildPortfolio[rebuildDetailOpen];
          return (
          <>
          <div className="rb-showcase">
            <div className="rb-showcase__inner">

              {/* Top bar */}
              <div className="rb-showcase__topbar">
                <div className="rb-showcase__topbar-left">
                  <span className="rb-showcase__counter">{String(rebuildDetailOpen + 1).padStart(2, '0')} / {String(rebuildPortfolio.length).padStart(2, '0')}</span>
                </div>
                <div className="rb-showcase__topbar-center">
                  <span>HQ Aviation — Rebuild Portfolio</span>
                </div>
                <button className="rb-showcase__close" onClick={() => setRebuildDetailOpen(null)}>Close</button>
              </div>

              {/* Main content — split layout */}
              <div className="rb-showcase__content">

                {/* Left — Image gallery */}
                <div className="rb-showcase__gallery">
                  <div className="rb-showcase__hero-img" onClick={() => setRebuildLightbox({ src: rb.img, alt: rb.model })}>
                    <img src={rb.img} alt={rb.model} />
                    <div className="rb-showcase__img-overlay">
                      <i className="fas fa-search-plus"></i>
                    </div>
                  </div>
                  <div className="rb-showcase__thumbs">
                    {rb.gallery.map((src, i) => (
                      <button
                        key={i}
                        className="rb-showcase__thumb"
                        onClick={() => setRebuildLightbox({ src, alt: `${rb.model} — ${i + 1}` })}
                      >
                        <img src={src} alt="" />
                      </button>
                    ))}
                  </div>
                </div>

                {/* Right — Info */}
                <div className="rb-showcase__info">
                  <span className="rb-showcase__overline">Completed Rebuild · {rb.year}</span>
                  <h2 className="rb-showcase__title">{rb.model}</h2>
                  <span className="rb-showcase__reg">{rb.reg}</span>

                  <div className="rb-showcase__divider"></div>

                  <p className="rb-showcase__desc">{rb.details}</p>

                  <div className="rb-showcase__spec">
                    <div className="rb-showcase__spec-item">
                      <span className="rb-showcase__spec-label">Build Duration</span>
                      <span className="rb-showcase__spec-value">{rb.duration}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Bottom nav */}
              <div className="rb-showcase__nav">
                <button
                  className="rb-showcase__nav-btn"
                  disabled={rebuildDetailOpen === 0}
                  onClick={() => setRebuildDetailOpen(rebuildDetailOpen - 1)}
                >
                  <span className="rb-showcase__nav-arrow">&larr;</span>
                  <span className="rb-showcase__nav-label">
                    {rebuildDetailOpen > 0 ? rebuildPortfolio[rebuildDetailOpen - 1].model : ''}
                  </span>
                </button>
                <button
                  className="rb-showcase__nav-btn rb-showcase__nav-btn--next"
                  disabled={rebuildDetailOpen === rebuildPortfolio.length - 1}
                  onClick={() => setRebuildDetailOpen(rebuildDetailOpen + 1)}
                >
                  <span className="rb-showcase__nav-label">
                    {rebuildDetailOpen < rebuildPortfolio.length - 1 ? rebuildPortfolio[rebuildDetailOpen + 1].model : ''}
                  </span>
                  <span className="rb-showcase__nav-arrow">&rarr;</span>
                </button>
              </div>

            </div>
          </div>

          {/* Image Lightbox */}
          {rebuildLightbox && (
          <div className="rb-lightbox" onClick={() => setRebuildLightbox(null)}>
            <img src={rebuildLightbox.src} alt={rebuildLightbox.alt} className="rb-lightbox__img" />
          </div>
          )}
          </>
          );
        })()}

        <div className="fd-sales__actions">
          <Link to="/contact?subject=rebuild" className="fd-sales__btn fd-sales__btn--primary">Book Your Aircraft into Our Rebuild Programme</Link>
          <Link to="/sales/rebuilds" className="fd-sales__btn fd-sales__btn--outline">Browse Rebuilds</Link>
        </div>
        </div>{/* end section-body */}
        </div>

        </>)}

        {salesTab === 'unmanned' && (
          <div className={`fd-sales__subsection ${openSalesSection === 'unmanned' ? 'fd-sales__subsection--open' : ''}`}>
            <h3 className="fd-sales__section-title" onClick={() => setOpenSalesSection(openSalesSection === 'unmanned' ? null : 'unmanned')}>
              Robinson Unmanned
              <span className="fd-sales__section-chevron">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="6 9 12 15 18 9" /></svg>
              </span>
            </h3>
            <div className="fd-sales__section-body">
            <p className="fd-sales__section-desc">
              Robinson's unmanned aerial systems — purpose-built for commercial, agricultural, and industrial operations. Engineered with the same reliability and support that defines the Robinson brand.
            </p>
            <div className="fd-sales__unmanned-coming">
              <span className="fd-sales__unmanned-icon"><i className="fas fa-helicopter"></i></span>
              <p>More information coming soon. Contact our sales team for early enquiries.</p>
              <Link to="/contact?subject=unmanned" className="fd-sales__btn fd-sales__btn--primary">Enquire About Robinson Unmanned</Link>
            </div>
            </div>{/* end section-body */}
          </div>
        )}

      </section>

      {/* ===== PARALLAX: MAINTENANCE ===== */}
      <ParallaxSection
        image="/assets/images/facility/maintenance-.jpg"
        alt="Maintenance"
        className="reveal-element"
        waves={true}
      >
        <h2 className="parallax-section__title">Maintenance</h2>
      </ParallaxSection>

      {/* ===== MAINTENANCE ===== */}
      <section className="fd-maint fd-maint--cardgrid" id="maintenance">

        {/* Rich hero text */}
        <div className="fd-maint__header">
          <span className="fd-sales__pre-title">The Robinson Specialists Since 2010</span>
          <h2 className="fd-sales__title">
            <span className="fd-sales__title-word fd-sales__title-word--1">Aircraft</span>
            <span className="fd-sales__title-word fd-sales__title-word--2">Maintenance</span>
          </h2>
          <p className="fd-maint__text">
            As Robinson Authorised Dealer, Factory
            Distributor, and Designated Service Centre for the full Robinson range — R22, R44,
            and R66 — plus Guimbal Cabri G2 certified, our 12 factory-trained engineers work from a
            12,000 sq ft climate-controlled maintenance facility at Denham Aerodrome. 8 heated service bays
            run simultaneously, backed by a &pound;500K+ genuine parts inventory and
            minimal downtime.
          </p>
          <div className="fd-sales__header-divider"></div>
        </div>

        {/* Cert card — Robinson primary — cert-97 Split Dots */}
        <ServiceSplitDots />

        {/* Merged maintenance panel — two columns: services left, team+facility right */}
        <div className="fd-maint__merged">
          <div className="fd-maint__merged-cols">
            {/* Left column — What We Do */}
            <div className="fd-maint__merged-left">
              <div className="fd-maint__services-card">
                <h3 className="mv12-crosshead">What We Do</h3>
                <div className="fd-maint__grid6">
                  <div className="fd-maint__grid6-card">
                    <span className="fd-maint__grid6-icon"><i className="fas fa-search"></i></span>
                    <h4>Inspections</h4>
                    <p>50-hour, 100-hour, annual &amp; progressive. Spectrometric oil analysis, compression checks, and full control system review on Robinson &amp; Cabri fleets.</p>
                  </div>
                  <div className="fd-maint__grid6-card">
                    <span className="fd-maint__grid6-icon"><i className="fas fa-cogs"></i></span>
                    <h4>Overhauls &amp; Rebuilds</h4>
                    <p>12-year and 2,200-hour major overhauls. Complete strip-down, NDT testing, factory-spec rebuild. 40+ Robinsons rebuilt by our chief engineer alone.</p>
                  </div>
                  <div className="fd-maint__grid6-card">
                    <span className="fd-maint__grid6-icon"><i className="fas fa-microchip"></i></span>
                    <h4>Avionics &amp; Upgrades</h4>
                    <p>Dedicated avionics workshop. Glass cockpit conversions, GPS/NAV systems, ADS-B, transponder upgrades. Modern situational awareness by qualified specialists.</p>
                  </div>
                  <div className="fd-maint__grid6-card">
                    <span className="fd-maint__grid6-icon"><i className="fas fa-exclamation-triangle"></i></span>
                    <h4>24/7 AOG &amp; Parts</h4>
                    <p>Aircraft on Ground emergency response across Europe. &pound;500K genuine parts inventory — 1,200+ engine, 800+ airframe, 2,000+ consumables. Same-day dispatch.</p>
                  </div>
                  <div className="fd-maint__grid6-card">
                    <span className="fd-maint__grid6-icon"><i className="fas fa-paint-roller"></i></span>
                    <h4>Paint &amp; Refurbishment</h4>
                    <p>Dedicated in-house paint shop. Complete interior/exterior restoration, corrosion treatment, and custom livery. Factory-new finish from our Denham facility.</p>
                  </div>
                  <div className="fd-maint__grid6-card">
                    <span className="fd-maint__grid6-icon"><i className="fas fa-helicopter"></i></span>
                    <h4>Ownership Services</h4>
                    <p>Pre-purchase inspections, aircraft management, leaseback revenue programmes, secure heated hangarage, worldwide ferry flights, and new &amp; used sales.</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Right column — Behind the Scenes */}
            <div className="fd-maint__merged-right">
              <div className="fd-maint__team-card">
                <h3 className="mv12-crosshead">Behind the Scenes</h3>
                <div className="fd-maint__team-grid">
                  <div className="fd-maint__team-member">
                    <div className="mv12-portraits__circle">DC</div>
                    <strong>David Cross</strong>
                    <span>Chief Engineer &middot; 25+ years &middot; 40+ Robinson rebuilds &middot; EASA Part 66</span>
                  </div>
                  <div className="fd-maint__team-member">
                    <div className="mv12-portraits__circle">MF</div>
                    <strong>Michael Fowler</strong>
                    <span>Senior Engineer &middot; 18 years &middot; Avionics Specialist &middot; Glass cockpit conversions</span>
                  </div>
                  <div className="fd-maint__team-member">
                    <div className="mv12-portraits__circle">DC</div>
                    <strong>David Clarke</strong>
                    <span>Engine Specialist &middot; 15 years &middot; Lycoming &amp; RR300 certified</span>
                  </div>
                  <div className="fd-maint__team-member fd-maint__team-carousel">
                    <button className="fd-maint__team-chevron fd-maint__team-chevron--left" onClick={() => setTeamSlide((prev) => (prev - 1 + additionalTeam.length) % additionalTeam.length)} aria-label="Previous">&lsaquo;</button>
                    <button className="fd-maint__team-chevron fd-maint__team-chevron--right" onClick={() => setTeamSlide((prev) => (prev + 1) % additionalTeam.length)} aria-label="Next">&rsaquo;</button>
                    <div className="mv12-portraits__circle">{additionalTeam[teamSlide].initials}</div>
                    <strong>{additionalTeam[teamSlide].name}</strong>
                    <span>{additionalTeam[teamSlide].desc}</span>
                    <div className="fd-maint__team-dots">
                      {additionalTeam.map((_, i) => (
                        <span key={i} className={`fd-maint__team-dot${i === teamSlide ? ' fd-maint__team-dot--active' : ''}`} onClick={() => setTeamSlide(i)} />
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="fd-maint__facility-card">
            <div className="mv12-strip">
              <div className="mv12-strip__item">
                <div className="mv12-strip__img-placeholder"><i className="fas fa-warehouse"></i></div>
                <span>Main Hangar &middot; 12,000 sq ft</span>
              </div>
              <div className="mv12-strip__item">
                <div className="mv12-strip__img-placeholder"><i className="fas fa-wrench"></i></div>
                <span>Service Bay &middot; 8 Heated Bays</span>
              </div>
              <div className="mv12-strip__item">
                <div className="mv12-strip__img-placeholder"><i className="fas fa-spray-can"></i></div>
                <span>Paint Shop &middot; Custom Livery</span>
              </div>
              <div className="mv12-strip__item">
                <div className="mv12-strip__img-placeholder"><i className="fas fa-microchip"></i></div>
                <span>Avionics Workshop</span>
              </div>
              <div className="mv12-strip__item">
                <div className="mv12-strip__img-placeholder"><i className="fas fa-boxes"></i></div>
                <span>Parts Store &middot; &pound;500K+ Inventory</span>
              </div>
            </div>
          </div>
        </div>

        <div className="fd-maint__actions">
          <Link to="/maintenance" className="fd-maint__btn fd-maint__btn--primary">Explore Our Maintenance</Link>
        </div>
      </section>


      {/* ===== EDITORIAL GRID (Hero 90) ===== */}
      <div className="reveal-element">
        <EditorialGrid />
      </div>

      {/* ===== LATEST FROM HQ — Rich Blog Section ===== */}
      <section className="lhq reveal-element" style={{ padding: '6rem 0 4rem', background: '#faf9f6' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto', padding: '0 2rem' }}>

          {/* Header */}
          <div className="lhq__header">
            <div className="lhq__header-line" />
            <h2 className="lhq__title">Latest from HQ</h2>
            <div className="lhq__header-line" />
          </div>
          <p className="lhq__subtitle">Insights, guides and stories from the hangar</p>

          {/* Tier 1: Persona Cards */}
          <div className="lhq__personas">
            {BLOG_PERSONAS.map((persona) => (
              <button
                key={persona.id}
                className={`lhq__persona ${blogPersona === persona.id ? 'lhq__persona--active' : ''}`}
                onClick={() => handlePersonaClick(persona.id)}
              >
                <span className="lhq__persona-icon">{persona.icon}</span>
                <span className="lhq__persona-headline">{persona.headline}</span>
                <span className="lhq__persona-subtitle">{persona.subtitle}</span>
              </button>
            ))}
          </div>

          {/* Sort Toggle + Search */}
          <div className="lhq__sort-bar">
            <div className="lhq__sort-toggle">
              <button
                className={`lhq__sort-btn ${blogSort === 'popular' ? 'lhq__sort-btn--active' : ''}`}
                onClick={() => { setBlogSort('popular'); setBlogVisible(6); }}
              >
                Most Popular
              </button>
              <button
                className={`lhq__sort-btn ${blogSort === 'latest' ? 'lhq__sort-btn--active' : ''}`}
                onClick={() => { setBlogSort('latest'); setBlogVisible(6); }}
              >
                Latest
              </button>
            </div>
            <div className="lhq__search-wrap">
              <svg className="lhq__search-icon" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5">
                <circle cx="8.5" cy="8.5" r="5.5" />
                <line x1="12.5" y1="12.5" x2="17" y2="17" />
              </svg>
              <input
                type="text"
                className="lhq__search"
                placeholder="Search articles..."
                value={blogSearch}
                onChange={(e) => { setBlogSearch(e.target.value); setBlogVisible(6); }}
              />
              {blogSearch && (
                <button className="lhq__search-clear" onClick={() => setBlogSearch('')}>&times;</button>
              )}
            </div>
            <span className="lhq__sort-count">{sortedPosts.length} articles</span>
          </div>

          {/* Post List */}
          {sortedPosts.length === 0 ? (
            <p style={{ textAlign: 'center', padding: '3rem 0', color: '#999', fontFamily: "'Share Tech Mono', monospace" }}>
              No articles match your current filters.
            </p>
          ) : (
            <div className="lhq__list">
              {visiblePosts.map((post, i) => {
                const cardContent = (
                  <>
                    <div className="lhq__compact-img-wrap">
                      <img src={post.image} alt={post.title} className="lhq__compact-img" />
                      {blogSort === 'popular' && (
                        <span className="lhq__rank">#{i + 1}</span>
                      )}
                    </div>
                    <div className="lhq__compact-body">
                      <span className="lhq__cat-label">{post.category}</span>
                      <h4 className="lhq__compact-title">{post.title}</h4>
                      <div className="lhq__meta">
                        <span>{formatBlogDate(post.date)}</span>
                        <span className="lhq__meta-dot" />
                        <span>{post.readingTime}</span>
                      </div>
                    </div>
                  </>
                );
                return post.externalUrl ? (
                  <a href={post.externalUrl} target="_blank" rel="noopener noreferrer" key={post.id} className="lhq__compact">
                    {cardContent}
                  </a>
                ) : (
                  <Link to={`/blog/${post.id}`} key={post.id} className="lhq__compact">
                    {cardContent}
                  </Link>
                );
              })}
            </div>
          )}

          {/* Load More + View All */}
          <div className="lhq__actions">
            {hasMorePosts && (
              <button className="lhq__load-more" onClick={() => setBlogVisible(v => v + 6)}>
                Load more articles
              </button>
            )}
            <Link to="/blog" className="lhq__view-all">
              View all {allPublished.length} articles &rarr;
            </Link>
          </div>
        </div>
      </section>

      {/* ===== SECTION: TESTIMONIALS & REVIEWS ===== */}
      <section className="exp2-testimonials" id="testimonials">
        <div className="exp2-testimonials__inner">
          <span className="exp2-section-pre">What People Say About Us</span>
          <h2 className="exp2-section-title">
            <span className="exp2-section-title__word exp2-section-title__word--1">Client</span>
            <span className="exp2-section-title__word exp2-section-title__word--2">Reviews</span>
          </h2>
          <p className="exp2-section-desc">
            From student pilots to helicopter owners, our community shares their experiences flying with HQ Aviation.
          </p>

          {/* Category Filter */}
          <div className="exp2-testimonials__cats">
            {['all', 'Training', 'Ownership', 'Hire', 'Expeditions'].map(cat => (
              <button
                key={cat}
                className={`exp2-testimonials__cat ${testimonialCategory === cat ? 'exp2-testimonials__cat--active' : ''}`}
                onClick={() => setTestimonialCategory(cat)}
              >
                {cat === 'all' ? 'All Reviews' : cat}
              </button>
            ))}
          </div>

          {/* Featured Testimonial */}
          <div className="exp2-testimonials__featured">
            <div className="exp2-testimonials__featured-quote">
              <svg className="exp2-testimonials__quote-mark" viewBox="0 0 24 24" fill="currentColor" opacity="0.1">
                <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z"/>
              </svg>
              <blockquote>
                "HQ Aviation has been looking after my R44 for over five years now. The level of care and attention to detail from David Cross and his engineering team is second to none. They treat my aircraft as if it were their own. Beyond maintenance, the community at Denham is what keeps me coming back — the clubhouse, the fellow pilots, the sense of belonging. It's not just a service, it's a lifestyle."
              </blockquote>
              <div className="exp2-testimonials__featured-author">
                <div className="exp2-testimonials__avatar">PC</div>
                <div>
                  <strong>Patrick Curran</strong>
                  <span>Helicopter Owner &middot; R44 Raven II</span>
                </div>
                <div className="exp2-testimonials__stars">
                  {'★★★★★'.split('').map((s, i) => <span key={i}>{s}</span>)}
                </div>
              </div>
            </div>
          </div>

          {/* Testimonial Grid */}
          <div className="exp2-testimonials__grid">
            {[
              { initials: 'AB', name: 'Andy Boniface', role: 'Trial Lesson Student', category: 'Training', stars: 5, text: "What an incredible day. From the moment I arrived, the team made me feel completely at ease. The briefing was thorough, and then actually flying the helicopter — there's nothing quite like it. I'm already looking at booking my PPL course." },
              { initials: 'LL', name: 'Luca Lapegna', role: 'Helicopter Owner · R66 Turbine', category: 'Ownership', stars: 5, text: "The leaseback programme has been fantastic for offsetting ownership costs. HQ manages everything — maintenance, scheduling, insurance coordination. My R66 pays for itself, and I still fly it whenever I want." },
              { initials: 'GR', name: 'Geoff Read', role: 'PPL(H) · Self-Fly Hire Regular', category: 'Hire', stars: 5, text: "The walk-in, walk-out self-fly hire is exactly what I wanted after getting my licence. No membership fees, no hassle. I book an R44, it's fuelled and ready on the pad. Last month I flew to Le Touquet for lunch — try doing that by car." },
              { initials: 'MK', name: 'Maxim Kalyuzhny', role: 'Helicopter Owner · R22 Beta II', category: 'Ownership', stars: 5, text: "Bought my R22 through HQ and they've maintained it impeccably since. The engineering team genuinely cares. When my 2,200-hour overhaul came up, they walked me through every option and the rebuild came back better than factory." },
              { initials: 'SH', name: 'Sarah Henderson', role: 'PPL Student · Hour Building', category: 'Training', stars: 5, text: "The instructors at HQ are patient, professional and genuinely passionate about teaching. I started my PPL in January and passed my skills test in September. The ground school was brilliant — passed all nine exams first time." },
              { initials: 'JM', name: 'James Mitchell', role: 'Expedition Participant · Iceland 2024', category: 'Expeditions', stars: 5, text: "Flying to Iceland with Captain Q was a once-in-a-lifetime experience. The planning was meticulous, the flying was extraordinary, and the camaraderie between the group was something I'll never forget. Already signed up for the next one." },
            ].filter(t => testimonialCategory === 'all' || t.category === testimonialCategory).map((t, i) => (
              <div key={i} className="exp2-testimonials__card">
                <div className="exp2-testimonials__card-stars">
                  {'★'.repeat(t.stars).split('').map((s, j) => <span key={j}>{s}</span>)}
                </div>
                <p className="exp2-testimonials__card-text">{t.text}</p>
                <div className="exp2-testimonials__card-author">
                  <div className="exp2-testimonials__avatar exp2-testimonials__avatar--sm">{t.initials}</div>
                  <div>
                    <strong>{t.name}</strong>
                    <span>{t.role}</span>
                  </div>
                </div>
                <span className="exp2-testimonials__card-cat">{t.category}</span>
              </div>
            ))}
          </div>

          {/* Submit Review CTA */}
          <div className="exp2-testimonials__cta-row">
            <div className="exp2-testimonials__cta-card">
              <h4>Share Your Experience</h4>
              <p>Flown with HQ Aviation? We'd love to hear about it. Your review helps other pilots discover what makes this place special.</p>
              <Link to="/testimonials" className="exp2-btn">Write a Review<span>→</span></Link>
            </div>
            <div className="exp2-testimonials__cta-card exp2-testimonials__cta-card--google">
              <h4>Review Us on Google</h4>
              <p>Your Google review helps us reach more aspiring pilots and helicopter enthusiasts. Thank you for your support.</p>
              <span className="exp2-testimonials__google-stars">{'★★★★★'} <em>4.9 / 5</em></span>
            </div>
          </div>
        </div>
      </section>

      {/* ===== SECTION: SPECIAL TRAINING ===== */}
      <ParallaxSection
        image="/assets/images/gallery/flying/flying--1.jpg"
        alt="Advanced Training"
        className="reveal-element"
        waves={true}
      >
        <h2 className="parallax-section__title">Advanced Training</h2>
      </ParallaxSection>

      <section className="exp2-special-training" id="special-training">
        <div className="exp2-special-training__inner">
          <span className="exp2-section-pre">Go Beyond the Licence</span>
          <h2 className="exp2-section-title">
            <span className="exp2-section-title__word exp2-section-title__word--1">Special</span>
            <span className="exp2-section-title__word exp2-section-title__word--2">Training</span>
          </h2>
          <p className="exp2-section-desc">
            Once you have your PPL, the learning doesn't stop. Our advanced courses are designed to build real-world
            confidence and expand your capabilities as a pilot.
          </p>

          <div className="exp2-special-training__grid">
            <div className="exp2-special-training__card exp2-special-training__card--featured">
              <div className="exp2-special-training__card-badge">Signature Course</div>
              <div className="exp2-special-training__card-icon"><i className="fas fa-sync-alt"></i></div>
              <h3>Advanced Autorotations with Captain Q</h3>
              <p>
                Get truly comfortable with autorotations — so comfortable you could do it in your sleep.
                Captain Quentin Smith, who trained Tom Cruise for Mission: Impossible, leads this intensive
                course covering autorotations from any position, entries into confined areas, and building
                the instinctive reactions that separate good pilots from great ones.
              </p>
              <div className="exp2-special-training__card-meta">
                <span><i className="fas fa-clock"></i> 1-2 Days</span>
                <span><i className="fas fa-user-shield"></i> PPL(H) Required</span>
              </div>
              <Link to="/contact?subject=training" className="exp2-btn exp2-btn--dark">Enquire About This Course<span>→</span></Link>
            </div>

            <div className="exp2-special-training__card">
              <div className="exp2-special-training__card-icon"><i className="fas fa-mountain"></i></div>
              <h3>Confined Area Training</h3>
              <p>
                Learn to safely operate in restricted spaces — fields, clearings, private estates, and event sites.
                Precision approaches, power management, and obstacle awareness in realistic scenarios.
              </p>
              <div className="exp2-special-training__card-meta">
                <span><i className="fas fa-clock"></i> Half Day</span>
                <span><i className="fas fa-user-shield"></i> PPL(H) Required</span>
              </div>
            </div>

            <div className="exp2-special-training__card">
              <div className="exp2-special-training__card-icon"><i className="fas fa-mountain"></i></div>
              <h3>Mountain Flying</h3>
              <p>
                Understand the unique challenges of flying in mountainous terrain — wind effects, density altitude,
                escape routes, and landing on unprepared surfaces. Essential for expedition flying.
              </p>
              <div className="exp2-special-training__card-meta">
                <span><i className="fas fa-clock"></i> 1 Day</span>
                <span><i className="fas fa-user-shield"></i> 50+ Hours PIC</span>
              </div>
            </div>

            <div className="exp2-special-training__card">
              <div className="exp2-special-training__card-icon"><i className="fas fa-shield-alt"></i></div>
              <h3>Safety Courses</h3>
              <p>
                Refresh and sharpen your safety skills. Emergency procedures, decision-making frameworks,
                weather assessment, and crew resource management. Designed for active pilots who want to stay sharp.
              </p>
              <div className="exp2-special-training__card-meta">
                <span><i className="fas fa-clock"></i> Half Day</span>
                <span><i className="fas fa-user-shield"></i> PPL(H) Required</span>
              </div>
            </div>
          </div>

          <div className="exp2-special-training__quote">
            <blockquote>
              "Rich people in London will love the opportunity to fly with the guy that taught Tom Cruise to fly."
            </blockquote>
            <span>— Training with Captain Q</span>
          </div>
        </div>
      </section>

      {/* ===== SECTION: TOURS OF LONDON ===== */}
      <section className="exp2-london-tours" id="london-tours">
        <div className="exp2-london-tours__inner">
          <div className="exp2-london-tours__content">
            <span className="exp2-section-pre">Helicopter Tours</span>
            <h2 className="exp2-section-title">
              <span className="exp2-section-title__word exp2-section-title__word--1">See London</span>
              <span className="exp2-section-title__word exp2-section-title__word--2">From Above</span>
            </h2>
            <p className="exp2-london-tours__desc">
              There may be no finer way to see the capital than from the cockpit of a helicopter.
              Follow the Thames from the Isle of Dogs to Battersea, with the City skyline, Tower Bridge,
              the London Eye, Big Ben and Buckingham Palace all beneath you. An unforgettable one-hour
              experience — and the perfect gift for someone special.
            </p>
            <div className="exp2-london-tours__highlights">
              <div className="exp2-london-tours__highlight">
                <span className="exp2-london-tours__highlight-icon"><i className="fas fa-clock"></i></span>
                <div>
                  <strong>1 Hour Flight</strong>
                  <span>Including scenic route over central London</span>
                </div>
              </div>
              <div className="exp2-london-tours__highlight">
                <span className="exp2-london-tours__highlight-icon"><i className="fas fa-map-marked-alt"></i></span>
                <div>
                  <strong>Iconic Landmarks</strong>
                  <span>Tower Bridge, Big Ben, The Shard, Buckingham Palace</span>
                </div>
              </div>
              <div className="exp2-london-tours__highlight">
                <span className="exp2-london-tours__highlight-icon"><i className="fas fa-gift"></i></span>
                <div>
                  <strong>Gift Vouchers Available</strong>
                  <span>Beautiful physical voucher on premium card — a keepsake forever</span>
                </div>
              </div>
              <div className="exp2-london-tours__highlight">
                <span className="exp2-london-tours__highlight-icon"><i className="fas fa-helicopter"></i></span>
                <div>
                  <strong>10 Minutes from Central London</strong>
                  <span>Depart from Denham Aerodrome, just off the M40</span>
                </div>
              </div>
            </div>
            <div className="exp2-london-tours__actions">
              <Link to="/helicopter-tour-of-london" className="exp2-btn exp2-btn--dark">Book a London Tour<span>→</span></Link>
              <Link to="/contact?subject=gift-voucher" className="exp2-btn">Purchase Gift Voucher<span>→</span></Link>
            </div>
          </div>
          <div className="exp2-london-tours__visual">
            <div className="exp2-london-tours__ticket">
              <div className="exp2-london-tours__ticket-header">
                <span>HQ AVIATION</span>
                <span>HELICOPTER TOUR</span>
              </div>
              <div className="exp2-london-tours__ticket-body">
                <div className="exp2-london-tours__ticket-route">
                  <div className="exp2-london-tours__ticket-from">
                    <span className="exp2-london-tours__ticket-code">EGLD</span>
                    <span>Denham</span>
                  </div>
                  <div className="exp2-london-tours__ticket-line">
                    <span>✈</span>
                  </div>
                  <div className="exp2-london-tours__ticket-to">
                    <span className="exp2-london-tours__ticket-code">LON</span>
                    <span>Central London</span>
                  </div>
                </div>
                <div className="exp2-london-tours__ticket-details">
                  <div><span>Duration</span><strong>1 Hour</strong></div>
                  <div><span>Aircraft</span><strong>R44 / R66</strong></div>
                  <div><span>Passengers</span><strong>Up to 3</strong></div>
                </div>
              </div>
              <div className="exp2-london-tours__ticket-tear"></div>
              <div className="exp2-london-tours__ticket-footer">
                <span>Share the gift of flight</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ===== SECTION: HELICOPTER LEASEBACK ===== */}
      <section className="exp2-leaseback" id="leaseback">
        <div className="exp2-leaseback__inner">
          <div className="exp2-leaseback__left">
            <span className="exp2-section-pre">Ownership Programmes</span>
            <h2 className="exp2-section-title">
              <span className="exp2-section-title__word exp2-section-title__word--1">Helicopter</span>
              <span className="exp2-section-title__word exp2-section-title__word--2">Leaseback</span>
            </h2>
            <p className="exp2-leaseback__intro">
              Owning and maintaining a helicopter can sometimes be costly, so leasing hours to a flight
              school is a good way to recoup some of the fees. Subject to its suitability, you may like us
              to utilise your aircraft through our training organisation to give you some additional return
              towards the cost of aircraft ownership.
            </p>
            <p className="exp2-leaseback__secondary">
              We can also place restrictions upon what type of flights are carried out (training/hire or hire
              only), who flies your helicopter (hourly minimums) and also link this with a management
              agreement so you can be assured that your helicopter is being looked after as well as paying
              for itself.
            </p>
          </div>
          <div className="exp2-leaseback__right">
            <div className="exp2-leaseback__benefits">
              <div className="exp2-leaseback__benefit">
                <span className="exp2-leaseback__benefit-num">01</span>
                <div>
                  <strong>Revenue Generation</strong>
                  <p>Offset ownership costs by earning revenue from your aircraft when you're not flying it.</p>
                </div>
              </div>
              <div className="exp2-leaseback__benefit">
                <span className="exp2-leaseback__benefit-num">02</span>
                <div>
                  <strong>Full Management</strong>
                  <p>We handle scheduling, insurance coordination, and all operational logistics for you.</p>
                </div>
              </div>
              <div className="exp2-leaseback__benefit">
                <span className="exp2-leaseback__benefit-num">03</span>
                <div>
                  <strong>Maintenance Included</strong>
                  <p>Your aircraft stays in peak condition with our in-house engineering team managing every service.</p>
                </div>
              </div>
              <div className="exp2-leaseback__benefit">
                <span className="exp2-leaseback__benefit-num">04</span>
                <div>
                  <strong>Flight Restrictions</strong>
                  <p>You choose — training only, hire only, or both. Set hourly minimums and pilot criteria.</p>
                </div>
              </div>
              <div className="exp2-leaseback__benefit">
                <span className="exp2-leaseback__benefit-num">05</span>
                <div>
                  <strong>Owner Priority</strong>
                  <p>Fly your own aircraft whenever you want. Your schedule always takes priority.</p>
                </div>
              </div>
            </div>
            <Link to="/contact?subject=leaseback" className="exp2-btn exp2-btn--dark" style={{ marginTop: '2rem' }}>Discuss Leaseback Options<span>→</span></Link>
          </div>
        </div>
      </section>

      {/* ===== SECTION: PILOT PROVISIONING ===== */}
      <section className="exp2-pilot-services" id="services">
        <div className="exp2-pilot-services__inner">
          <span className="exp2-section-pre">Professional Pilot Services</span>
          <h2 className="exp2-section-title">
            <span className="exp2-section-title__word exp2-section-title__word--1">Pilot</span>
            <span className="exp2-section-title__word exp2-section-title__word--2">Provisioning</span>
          </h2>
          <p className="exp2-section-desc">
            Whether you need a qualified pilot to fly your aircraft, a co-pilot for confidence on a challenging
            route, or simply need your helicopter moved — our experienced team is ready.
          </p>

          <div className="exp2-pilot-services__grid">
            <div className="exp2-pilot-services__card">
              <div className="exp2-pilot-services__card-header">
                <span className="exp2-pilot-services__card-num">01</span>
                <i className="fas fa-user-tie"></i>
              </div>
              <h3>Pilot Services &amp; Crewing</h3>
              <p>
                The specific act of supplying a qualified pilot to fly your aircraft if you do not fly it
                yourself. Fully rated, insured and experienced across the Robinson range, our pilots are
                available for single flights, day charters, or ongoing crewing arrangements.
              </p>
              <span className="exp2-pilot-services__card-tag">Full crew provision</span>
            </div>

            <div className="exp2-pilot-services__card">
              <div className="exp2-pilot-services__card-header">
                <span className="exp2-pilot-services__card-num">02</span>
                <i className="fas fa-user-shield"></i>
              </div>
              <h3>Safety Pilot</h3>
              <p>
                If you are a private pilot but lack the confidence or experience for a specific flight, we
                can provide a Safety Pilot to sit alongside you and assist. Perfect for long cross-country
                flights, busy airspace, night flying, or challenging weather conditions.
              </p>
              <span className="exp2-pilot-services__card-tag">Co-pilot support</span>
            </div>

            <div className="exp2-pilot-services__card">
              <div className="exp2-pilot-services__card-header">
                <span className="exp2-pilot-services__card-num">03</span>
                <i className="fas fa-route"></i>
              </div>
              <h3>Ferry Pilot</h3>
              <p>
                If you simply need your aircraft moved from one location to another — for maintenance,
                relocation, or delivery — our ferry pilots handle the logistics, permissions, and flight
                planning so you don't have to.
              </p>
              <span className="exp2-pilot-services__card-tag">Aircraft relocation</span>
            </div>
          </div>

          <div className="exp2-pilot-services__cta">
            <Link to="/contact?subject=pilot-services" className="exp2-btn exp2-btn--dark">Discuss Pilot Services<span>→</span></Link>
          </div>
        </div>
      </section>

      {/* ===== SECTION: SPECIAL OPS ===== */}
      <section className="exp2-special-ops">
        <div className="exp2-special-ops__inner">
          <div className="exp2-special-ops__content">
            <span className="exp2-section-pre">Exclusive Operations</span>
            <h2 className="exp2-section-title">
              <span className="exp2-section-title__word exp2-section-title__word--1">SuperYacht</span>
              <span className="exp2-section-title__word exp2-section-title__word--2">Ops &amp;</span>
              <span className="exp2-section-title__word exp2-section-title__word--3">Private Owner</span>
              <span className="exp2-section-title__word exp2-section-title__word--4">Management</span>
            </h2>
            <p className="exp2-special-ops__desc">
              Operating a helicopter from a superyacht or managing a privately owned aircraft requires a
              unique combination of expertise, discretion, and operational excellence. HQ Aviation provides
              comprehensive management services for high-net-worth individuals and yacht owners who demand
              the highest standards.
            </p>
          </div>
          <div className="exp2-special-ops__services">
            <div className="exp2-special-ops__service">
              <span className="exp2-special-ops__service-icon"><i className="fas fa-ship"></i></span>
              <h4>SuperYacht Helicopter Operations</h4>
              <p>Deck operations, pilot provisioning, maintenance coordination, and logistics for yacht-based helicopters worldwide.</p>
            </div>
            <div className="exp2-special-ops__service">
              <span className="exp2-special-ops__service-icon"><i className="fas fa-user-cog"></i></span>
              <h4>Private Owner Management</h4>
              <p>Complete aircraft management — maintenance scheduling, crew coordination, regulatory compliance, hangarage, and operational planning.</p>
            </div>
            <div className="exp2-special-ops__service">
              <span className="exp2-special-ops__service-icon"><i className="fas fa-globe-europe"></i></span>
              <h4>Worldwide Logistics</h4>
              <p>International ferry flights, customs clearance, permits, and operational support for owners flying across borders.</p>
            </div>
            <div className="exp2-special-ops__service">
              <span className="exp2-special-ops__service-icon"><i className="fas fa-shield-alt"></i></span>
              <h4>Discreet &amp; Confidential</h4>
              <p>Every operation conducted with the utmost discretion. Your privacy and schedule are our priority.</p>
            </div>
          </div>
          <div style={{ textAlign: 'center', marginTop: '2.5rem' }}>
            <Link to="/contact?subject=special-ops" className="exp2-btn exp2-btn--dark">Discuss Private Operations<span>→</span></Link>
          </div>
        </div>
      </section>

      {/* ===== SECTION: PART SALES ===== */}
      <section className="exp2-parts" id="part-sales">
        <div className="exp2-parts__inner">
          <div className="exp2-parts__left">
            <span className="exp2-section-pre">Robinson Parts Specialists</span>
            <h2 className="exp2-section-title">
              <span className="exp2-section-title__word exp2-section-title__word--1">Part</span>
              <span className="exp2-section-title__word exp2-section-title__word--2">Sales</span>
            </h2>
            <p className="exp2-parts__text">
              As one of the biggest Robinson service centres in Europe, we have a constant influx of parts
              and excellent relations with the Robinson factory. Our &pound;500K+ genuine parts inventory
              spans engine components, airframe parts, consumables, avionics, and accessories — with same-day
              dispatch available for AOG situations.
            </p>
            <p className="exp2-parts__secondary">
              Please call us or fill in the form below to enquire about the availability of any Robinson
              parts. Write briefly what you need and we'll get back to you with availability and pricing.
            </p>
          </div>
          <div className="exp2-parts__right">
            <div className="exp2-parts__stats">
              <div className="exp2-parts__stat">
                <span className="exp2-parts__stat-value">1,200+</span>
                <span className="exp2-parts__stat-label">Engine Parts</span>
              </div>
              <div className="exp2-parts__stat">
                <span className="exp2-parts__stat-value">800+</span>
                <span className="exp2-parts__stat-label">Airframe Parts</span>
              </div>
              <div className="exp2-parts__stat">
                <span className="exp2-parts__stat-value">2,000+</span>
                <span className="exp2-parts__stat-label">Consumables</span>
              </div>
              <div className="exp2-parts__stat">
                <span className="exp2-parts__stat-value">24/7</span>
                <span className="exp2-parts__stat-label">AOG Support</span>
              </div>
            </div>
            <div className="exp2-parts__enquiry">
              <h4>Parts Enquiry</h4>
              <div className="exp2-parts__enquiry-field">
                <label>Aircraft Type</label>
                <span className="exp2-parts__enquiry-hint">R22 · R44 · R66 · Cabri G2</span>
              </div>
              <div className="exp2-parts__enquiry-field">
                <label>Part Description</label>
                <span className="exp2-parts__enquiry-hint">Part number or description of what you need</span>
              </div>
              <div className="exp2-parts__enquiry-field">
                <label>Urgency</label>
                <span className="exp2-parts__enquiry-hint">Standard · Urgent · AOG</span>
              </div>
              <Link to="/contact?subject=parts" className="exp2-btn exp2-btn--dark" style={{ width: '100%', textAlign: 'center' }}>Send Parts Enquiry<span>→</span></Link>
            </div>
          </div>
        </div>
      </section>

      {/* ===== SECTION: PRICING ===== */}
      <section className="exp2-pricing" id="pricing">
        <div className="exp2-pricing__inner">
          <span className="exp2-section-pre">Transparent Pricing</span>
          <h2 className="exp2-section-title">
            <span className="exp2-section-title__word exp2-section-title__word--1">Rates</span>
            <span className="exp2-section-title__word exp2-section-title__word--2">&amp; Pricing</span>
          </h2>
          <p className="exp2-section-desc">
            We believe in transparent pricing. No hidden fees, no surprise charges. Here's what everything costs.
          </p>

          {/* Pricing Tabs */}
          <div className="exp2-pricing__tabs">
            {[
              { id: 'training', label: 'Training' },
              { id: 'hire', label: 'Self-Fly Hire' },
              { id: 'hangarage', label: 'Hangarage' },
              { id: 'valet', label: 'Valet Services' },
            ].map(tab => (
              <button
                key={tab.id}
                className={`exp2-pricing__tab ${pricingTab === tab.id ? 'exp2-pricing__tab--active' : ''}`}
                onClick={() => setPricingTab(tab.id)}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Training Pricing */}
          {pricingTab === 'training' && (
            <div className="exp2-pricing__table-wrap">
              <table className="exp2-pricing__table">
                <thead>
                  <tr>
                    <th>Course</th>
                    <th>Duration</th>
                    <th>Price</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td><strong>Discovery Flight Day</strong><br /><span>Two hours of flying, briefings, logbook entry</span></td>
                    <td>1 Day</td>
                    <td className="exp2-pricing__price">From £299</td>
                  </tr>
                  <tr>
                    <td><strong>Private Pilot Licence — PPL(H)</strong><br /><span>Min 45 hours flight training, ground school, exams</span></td>
                    <td>6-12 Months</td>
                    <td className="exp2-pricing__price">From £15,000</td>
                  </tr>
                  <tr>
                    <td><strong>Commercial Pilot Licence — CPL(H)</strong><br /><span>155 hours total, 50 hours PIC, skill test</span></td>
                    <td>Varies</td>
                    <td className="exp2-pricing__price">POA</td>
                  </tr>
                  <tr>
                    <td><strong>Type Rating</strong><br /><span>Ground course + min 5 hours flight training</span></td>
                    <td>1-2 Weeks</td>
                    <td className="exp2-pricing__price">POA</td>
                  </tr>
                  <tr>
                    <td><strong>Night Rating</strong><br /><span>100 hours + 60 hours PIC required</span></td>
                    <td>Varies</td>
                    <td className="exp2-pricing__price">POA</td>
                  </tr>
                  <tr className="exp2-pricing__table-highlight">
                    <td><strong>5-Day Ground School</strong><br /><span>All 9 PPL theory exams, guaranteed pass, small groups</span></td>
                    <td>5 Days</td>
                    <td className="exp2-pricing__price">£1,500 + VAT</td>
                  </tr>
                </tbody>
              </table>
              <div className="exp2-pricing__note">
                <strong>Mission Rate Flying:</strong> Supporting such a large fleet with client helicopters around the UK can mean our
                engineers need to be moved, helicopters must go to get custom avionics, etc. This allows you access to flying
                at mission rate prices for these trips — a significant saving over standard rates.
              </div>
              <div className="exp2-pricing__note">
                <strong>Happy Hour Flying:</strong> Ask about our off-peak rates for flexible pilots who can fly at shorter notice.
              </div>
            </div>
          )}

          {/* Hire Pricing */}
          {pricingTab === 'hire' && (
            <div className="exp2-pricing__table-wrap">
              <table className="exp2-pricing__table">
                <thead>
                  <tr>
                    <th>Aircraft</th>
                    <th>Seats</th>
                    <th>Hourly Rate</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td><strong>Robinson R22</strong><br /><span>Hour building, local flights, training continuation</span></td>
                    <td>2</td>
                    <td className="exp2-pricing__price">From £275/hr</td>
                  </tr>
                  <tr>
                    <td><strong>Robinson R44 Raven II</strong><br /><span>Touring, weekends away, business flights</span></td>
                    <td>4</td>
                    <td className="exp2-pricing__price">From £395/hr</td>
                  </tr>
                  <tr>
                    <td><strong>Robinson R66 Turbine</strong><br /><span>Long-range touring, G500H TXi, HeliSAS autopilot, aux tank</span></td>
                    <td>5</td>
                    <td className="exp2-pricing__price">From £595/hr</td>
                  </tr>
                </tbody>
              </table>
              <div className="exp2-pricing__note">
                We only charge for actual flying time. No membership fees, no bulk payments up front. Discounts available
                when hours are purchased in larger quantities. 28-day recency check required for safety.
              </div>
            </div>
          )}

          {/* Hangarage Pricing */}
          {pricingTab === 'hangarage' && (
            <div className="exp2-pricing__table-wrap">
              <p className="exp2-pricing__valet-intro">
                Secure, heated hangarage at Denham Aerodrome — just 30 minutes from central London. Our facility
                offers 24/7 access, dedicated ground crew, CCTV surveillance, and organised landing slots. Whether
                you're parking overnight or need a permanent home for your aircraft, we have options to suit.
              </p>
              <table className="exp2-pricing__table">
                <thead>
                  <tr>
                    <th>Aircraft Type</th>
                    <th>Short Stay (1 Day)</th>
                    <th>Weekly (7 Days+)</th>
                    <th>Monthly</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td><strong>R22 / Cabri G2</strong><br /><span>Light single — compact footprint</span></td>
                    <td className="exp2-pricing__price">£75/day</td>
                    <td className="exp2-pricing__price">£350/week</td>
                    <td className="exp2-pricing__price">£950/month</td>
                  </tr>
                  <tr>
                    <td><strong>R44 / R66</strong><br /><span>Medium single — standard bay</span></td>
                    <td className="exp2-pricing__price">£120/day</td>
                    <td className="exp2-pricing__price">£550/week</td>
                    <td className="exp2-pricing__price">£1,500/month</td>
                  </tr>
                  <tr>
                    <td><strong>AS350 / Bell 206 / 505</strong><br /><span>Light single turbine — larger footprint</span></td>
                    <td className="exp2-pricing__price">£160/day</td>
                    <td className="exp2-pricing__price">£750/week</td>
                    <td className="exp2-pricing__price">£2,200/month</td>
                  </tr>
                  <tr>
                    <td><strong>AW109 / AW169 / EC135</strong><br /><span>Medium twin — wide bay required</span></td>
                    <td className="exp2-pricing__price">£250/day</td>
                    <td className="exp2-pricing__price">£1,200/week</td>
                    <td className="exp2-pricing__price">£3,500/month</td>
                  </tr>
                </tbody>
              </table>
              <div className="exp2-pricing__hangarage-includes">
                <h4>All Hangarage Includes</h4>
                <div className="exp2-pricing__hangarage-grid">
                  <div className="exp2-pricing__hangarage-item">
                    <i className="fas fa-warehouse"></i>
                    <span>Heated, secure hangar</span>
                  </div>
                  <div className="exp2-pricing__hangarage-item">
                    <i className="fas fa-video"></i>
                    <span>24/7 CCTV surveillance</span>
                  </div>
                  <div className="exp2-pricing__hangarage-item">
                    <i className="fas fa-users"></i>
                    <span>Dedicated ground crew</span>
                  </div>
                  <div className="exp2-pricing__hangarage-item">
                    <i className="fas fa-plane-arrival"></i>
                    <span>Organised landing slots</span>
                  </div>
                  <div className="exp2-pricing__hangarage-item">
                    <i className="fas fa-key"></i>
                    <span>24/7 owner access</span>
                  </div>
                  <div className="exp2-pricing__hangarage-item">
                    <i className="fas fa-plug"></i>
                    <span>GPU &amp; ground power</span>
                  </div>
                </div>
              </div>
              <div className="exp2-pricing__note">
                <strong>Long-term contracts:</strong> Discounted rates available for 6-month and 12-month commitments.
                Leaseback programme members receive preferential hangarage rates. Contact us for a bespoke quote.
              </div>
              <div className="exp2-pricing__note">
                <strong>Visiting aircraft:</strong> Short stay parking on the apron is available for day visitors at reduced rates.
                Pre-book your slot with our operations team to guarantee availability.
              </div>
            </div>
          )}

          {/* Valet Pricing */}
          {pricingTab === 'valet' && (
            <div className="exp2-pricing__table-wrap">
              <p className="exp2-pricing__valet-intro">
                We provide exterior &amp; interior aircraft cleaning and polishing from our conveniently located
                hangar at Elstree Aerodrome. Our expert team use the best products and tools to clean &amp; polish
                your aircraft with the utmost care.
              </p>
              <table className="exp2-pricing__table exp2-pricing__table--valet">
                <thead>
                  <tr>
                    <th>Aircraft Type</th>
                    <th>Mini Valet</th>
                    <th>Full Valet</th>
                    <th>Deluxe Valet</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td><strong>R22 / R44</strong></td>
                    <td>£160</td>
                    <td>£220</td>
                    <td>£360</td>
                  </tr>
                  <tr>
                    <td><strong>R66 / B505 / 206 / 120</strong></td>
                    <td>£180</td>
                    <td>£300</td>
                    <td>£450</td>
                  </tr>
                  <tr>
                    <td><strong>AS350 / 55 / 109 / 119</strong></td>
                    <td>£260</td>
                    <td>£400</td>
                    <td>£600</td>
                  </tr>
                  <tr>
                    <td><strong>A139 / 169 / 902 or similar</strong></td>
                    <td>£390</td>
                    <td>£600</td>
                    <td>£900</td>
                  </tr>
                </tbody>
              </table>
              <div className="exp2-pricing__valet-tiers">
                <div className="exp2-pricing__valet-tier">
                  <h4>Mini Valet</h4>
                  <ul>
                    <li>Exterior Wash</li>
                    <li>Interior Vacuum</li>
                    <li>Window Clean</li>
                    <li>Soot Removal</li>
                  </ul>
                </div>
                <div className="exp2-pricing__valet-tier">
                  <h4>Full Valet</h4>
                  <ul>
                    <li>Everything in Mini</li>
                    <li>Interior Detailing</li>
                    <li>Leather &amp; Upholstery Clean</li>
                    <li>Window Polish</li>
                  </ul>
                </div>
                <div className="exp2-pricing__valet-tier">
                  <h4>Deluxe Valet</h4>
                  <ul>
                    <li>Everything in Full</li>
                    <li>Exterior Hand Polish</li>
                    <li>Headsets Cleaned</li>
                    <li>Interior Sanitise</li>
                  </ul>
                </div>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* ===== SECTION: STORE ===== */}
      <section className="exp2-store" id="store">
        <div className="exp2-store__inner">
          <span className="exp2-section-pre">HQ Aviation Store</span>
          <h2 className="exp2-section-title">
            <span className="exp2-section-title__word exp2-section-title__word--1">Gifts</span>
            <span className="exp2-section-title__word exp2-section-title__word--2">&amp; Experiences</span>
          </h2>
          <p className="exp2-section-desc">
            From discovery flights to pilot supplies, find the perfect gift or kit yourself out for the journey ahead.
          </p>

          <div className="exp2-store__cats">
            {['gifts', 'training', 'pilot-gear'].map(cat => (
              <button
                key={cat}
                className={`exp2-store__cat ${storeCategory === cat ? 'exp2-store__cat--active' : ''}`}
                onClick={() => setStoreCategory(cat)}
              >
                {cat === 'gifts' ? 'Gifts & Vouchers' : cat === 'training' ? 'Training Supplies' : 'Pilot Gear'}
              </button>
            ))}
          </div>

          <div className="exp2-store__grid">
            {storeCategory === 'gifts' && <>
              <div className="exp2-store__card">
                <div className="exp2-store__card-img"><i className="fas fa-helicopter" style={{ fontSize: '2.5rem', color: '#999' }}></i></div>
                <div className="exp2-store__card-body">
                  <span className="exp2-store__card-tag">Best Seller</span>
                  <h4>Discovery Flight Voucher</h4>
                  <p>Two hours of hands-on flying with an instructor. The ultimate first flight experience.</p>
                  <span className="exp2-store__card-price">From £299</span>
                </div>
              </div>
              <div className="exp2-store__card">
                <div className="exp2-store__card-img"><i className="fas fa-city" style={{ fontSize: '2.5rem', color: '#999' }}></i></div>
                <div className="exp2-store__card-body">
                  <h4>Tour of London Voucher</h4>
                  <p>A one-hour helicopter tour over London's most iconic landmarks. An unforgettable experience.</p>
                  <span className="exp2-store__card-price">From £399</span>
                </div>
              </div>
              <div className="exp2-store__card">
                <div className="exp2-store__card-img"><i className="fas fa-gift" style={{ fontSize: '2.5rem', color: '#999' }}></i></div>
                <div className="exp2-store__card-body">
                  <h4>General Gift Voucher</h4>
                  <p>Redeemable against any HQ Aviation experience or service. Beautiful physical card voucher included.</p>
                  <span className="exp2-store__card-price">Any Amount</span>
                </div>
              </div>
            </>}
            {storeCategory === 'training' && <>
              <div className="exp2-store__card">
                <div className="exp2-store__card-img"><i className="fas fa-book" style={{ fontSize: '2.5rem', color: '#999' }}></i></div>
                <div className="exp2-store__card-body">
                  <span className="exp2-store__card-tag">Starter Kit</span>
                  <h4>PPL Starter Pack</h4>
                  <p>Everything you need to begin your PPL journey — Pooleys flight bag, manuals, logbook, knee board, and more.</p>
                  <span className="exp2-store__card-price">From £149</span>
                </div>
              </div>
              <div className="exp2-store__card">
                <div className="exp2-store__card-img"><i className="fas fa-ruler-combined" style={{ fontSize: '2.5rem', color: '#999' }}></i></div>
                <div className="exp2-store__card-body">
                  <h4>Pooleys Flight Supplies</h4>
                  <p>Navigation plotters, CRP-1 computers, flight cases, and chart accessories from the UK's leading aviation supplier.</p>
                  <span className="exp2-store__card-price">Various</span>
                </div>
              </div>
              <div className="exp2-store__card">
                <div className="exp2-store__card-img"><i className="fas fa-graduation-cap" style={{ fontSize: '2.5rem', color: '#999' }}></i></div>
                <div className="exp2-store__card-body">
                  <h4>Ground School Materials</h4>
                  <p>Pre-reading packs, practice exam papers, and study guides for all nine PPL theory exams.</p>
                  <span className="exp2-store__card-price">From £49</span>
                </div>
              </div>
            </>}
            {storeCategory === 'pilot-gear' && <>
              <div className="exp2-store__card">
                <div className="exp2-store__card-img"><i className="fas fa-headphones" style={{ fontSize: '2.5rem', color: '#999' }}></i></div>
                <div className="exp2-store__card-body">
                  <h4>Bose A20 Aviation Headset</h4>
                  <p>Industry-leading noise reduction, Bluetooth connectivity, and exceptional comfort for long flights.</p>
                  <span className="exp2-store__card-price">£1,079</span>
                </div>
              </div>
              <div className="exp2-store__card">
                <div className="exp2-store__card-img"><i className="fas fa-tshirt" style={{ fontSize: '2.5rem', color: '#999' }}></i></div>
                <div className="exp2-store__card-body">
                  <span className="exp2-store__card-tag">Robinson</span>
                  <h4>Robinson Branded Merchandise</h4>
                  <p>Official Robinson Helicopter Company apparel, caps, and accessories. Represent the brand.</p>
                  <span className="exp2-store__card-price">Various</span>
                </div>
              </div>
              <div className="exp2-store__card">
                <div className="exp2-store__card-img"><i className="fas fa-glasses" style={{ fontSize: '2.5rem', color: '#999' }}></i></div>
                <div className="exp2-store__card-body">
                  <h4>Aviation Sunglasses</h4>
                  <p>Purpose-built for pilots — non-polarised lenses, lightweight frames, and clear instrument readability.</p>
                  <span className="exp2-store__card-price">From £89</span>
                </div>
              </div>
            </>}
          </div>

          <div className="exp2-store__voucher-banner">
            <div className="exp2-store__voucher-text">
              <h4>Share the Gift of Flight</h4>
              <p>Buy vouchers for a loved one — have it be a physical thing on a premium cardboard surface, something that they can keep forever.</p>
            </div>
            <Link to="/contact?subject=voucher" className="exp2-btn">Purchase Voucher<span>→</span></Link>
          </div>
        </div>
      </section>

      {/* ===== SECTION: CAREERS ===== */}
      <section className="exp2-careers" id="careers">
        <div className="exp2-careers__inner">
          <span className="exp2-section-pre">Join the Team</span>
          <h2 className="exp2-section-title">
            <span className="exp2-section-title__word exp2-section-title__word--1">Careers</span>
            <span className="exp2-section-title__word exp2-section-title__word--2">at HQ</span>
          </h2>
          <p className="exp2-section-desc">
            We're always looking for talented, passionate people to join the HQ Aviation family. If you love
            helicopters and want to work in one of the UK's leading Robinson specialist organisations, we'd
            love to hear from you.
          </p>

          <div className="exp2-careers__grid">
            <div className="exp2-careers__dept">
              <div className="exp2-careers__dept-icon"><i className="fas fa-wrench"></i></div>
              <h4>Engineering</h4>
              <p>EASA Part 66 licensed engineers. Robinson type-rated specialists maintaining the UK's largest Robinson fleet.</p>
            </div>
            <div className="exp2-careers__dept">
              <div className="exp2-careers__dept-icon"><i className="fas fa-graduation-cap"></i></div>
              <h4>Flight Training</h4>
              <p>Qualified flight instructors. CAA approved, passionate about teaching, and dedicated to student success.</p>
            </div>
            <div className="exp2-careers__dept">
              <div className="exp2-careers__dept-icon"><i className="fas fa-headset"></i></div>
              <h4>Operations</h4>
              <p>Flight operations, scheduling, customer service, and ground handling. The team that keeps everything running.</p>
            </div>
            <div className="exp2-careers__dept">
              <div className="exp2-careers__dept-icon"><i className="fas fa-chart-line"></i></div>
              <h4>Sales</h4>
              <p>Aircraft sales consultants. Knowledge of the Robinson range, strong relationships, and a passion for aviation.</p>
            </div>
          </div>

          <div className="exp2-careers__cta">
            <div className="exp2-careers__cta-text">
              <h4>Interested in joining us?</h4>
              <p>Send your CV and a brief cover letter to our team. We review all applications and respond within 5 working days.</p>
            </div>
            <Link to="/contact?subject=careers" className="exp2-btn exp2-btn--dark">View Open Positions<span>→</span></Link>
          </div>
        </div>
      </section>

      {/* ===== HERO VARIATION 1: Cinematic Split ===== */}
      <section className="hero-sec">
        <span className="hero-sec__label">Hero — V1: Cinematic Split</span>
        <div className="hv1">
          <div className="hv1__bg">{heroImages.map((s,i)=><div key={i} className={`hv1__bg-img ${i===heroSlide(0)?'active':''}`} style={{backgroundImage:`url(${s})`}}/>)}</div>
          <div className="hv1__overlay"/>
          <div className="hv1__content">
            <div className="hv1__left">
              <span className="hv1__coords">51.5751°N — 0.5059°W</span>
              <span className="hv1__pre">{heroSlides[heroSlide(0)]?.pre}</span>
              <h1 className="hv1__headline">{heroSlides[heroSlide(0)]?.words.map((w,i)=><span key={i} className={`hv1__word hv1__word--${i+1}`}>{w}</span>)}</h1>
              <p className="hv1__desc">{heroSlides[heroSlide(0)]?.desc}</p>
              <Link to="/contact" className="hv1__cta">Discover More <span>→</span></Link>
            </div>
            <div className="hv1__right">
              <div className="hv1__counter">
                <span className="hv1__counter-current">{String(heroSlide(0)+1).padStart(2,'0')}</span>
                <span className="hv1__counter-sep">/</span>
                <span className="hv1__counter-total">{String(heroSlides.length).padStart(2,'0')}</span>
              </div>
            </div>
          </div>
          <div className="hv1__dots">{heroSlides.map((_,i)=><button key={i} className={`hv1__dot ${i===heroSlide(0)?'active':''}`} onClick={()=>setHeroSlide(0)(i)}/>)}</div>
        </div>
      </section>

      {/* ===== HERO VARIATION 2: Instrument Panel ===== */}
      <section className="hero-sec">
        <span className="hero-sec__label">Hero — V2: Instrument Panel</span>
        <div className="hv2">
          <div className="hv2__grid">
            <div className="hv2__grid-line hv2__grid-line--v1"/>
            <div className="hv2__grid-line hv2__grid-line--v2"/>
            <div className="hv2__grid-line hv2__grid-line--v3"/>
            <div className="hv2__grid-line hv2__grid-line--h1"/>
            <div className="hv2__grid-line hv2__grid-line--h2"/>
          </div>
          <div className="hv2__top-bar">
            <span className="hv2__logo">HQ Aviation</span>
            <span className="hv2__datum">Denham Aerodrome — EGLD</span>
            <span className="hv2__datum">Est. 1990</span>
          </div>
          <div className="hv2__center">
            <div className="hv2__readout">
              <span className="hv2__readout-label">Current</span>
              <span className="hv2__readout-num">{String(heroSlide(1)+1).padStart(2,'0')}</span>
            </div>
            <div className="hv2__text">
              <span className="hv2__pre">{heroSlides[heroSlide(1)]?.pre}</span>
              <h1 className="hv2__headline">{heroSlides[heroSlide(1)]?.words.join(' ')}</h1>
              <p className="hv2__desc">{heroSlides[heroSlide(1)]?.desc}</p>
            </div>
            <div className="hv2__readout">
              <span className="hv2__readout-label">Total</span>
              <span className="hv2__readout-num">{String(heroSlides.length).padStart(2,'0')}</span>
            </div>
          </div>
          <div className="hv2__img-strip">{heroImages.map((s,i)=><div key={i} className={`hv2__thumb ${i===heroSlide(1)?'active':''}`} style={{backgroundImage:`url(${s})`}} onClick={()=>setHeroSlide(1)(i % heroSlides.length)}/>)}</div>
          <div className="hv2__bottom-bar">
            <span className="hv2__coord">51.5751°N</span>
            <div className="hv2__nav">{heroSlides.map((_,i)=><button key={i} className={`hv2__nav-btn ${i===heroSlide(1)?'active':''}`} onClick={()=>setHeroSlide(1)(i)}>{String(i+1).padStart(2,'0')}</button>)}</div>
            <span className="hv2__coord">0.5059°W</span>
          </div>
        </div>
      </section>

      {/* ===== HERO VARIATION 3: Full Bleed Takeover ===== */}
      <section className="hero-sec">
        <span className="hero-sec__label">Hero — V3: Full Bleed Takeover</span>
        <div className="hv3">
          <div className="hv3__bg">{heroImages.map((s,i)=><div key={i} className={`hv3__bg-img ${i===heroSlide(2)?'active':''}`} style={{backgroundImage:`url(${s})`}}/>)}</div>
          <div className="hv3__overlay"/>
          <div className="hv3__content">
            <span className="hv3__pre">{heroSlides[heroSlide(2)]?.pre}</span>
            <h1 className="hv3__headline">{heroSlides[heroSlide(2)]?.words.map((w,i)=><span key={i} className={`hv3__word hv3__word--${i+1}`}>{w} </span>)}</h1>
            <p className="hv3__desc">{heroSlides[heroSlide(2)]?.desc}</p>
            <div className="hv3__actions">
              <Link to="/contact" className="hv3__cta">Get Started</Link>
              <Link to="/about-us" className="hv3__cta hv3__cta--outline">Learn More</Link>
            </div>
          </div>
          <div className="hv3__footer">
            <span className="hv3__coords">51.5751°N — 0.5059°W</span>
            <div className="hv3__progress">{heroSlides.map((_,i)=><div key={i} className={`hv3__bar ${i===heroSlide(2)?'active':''}`}/>)}</div>
            <span className="hv3__scroll">Scroll to explore</span>
          </div>
        </div>
      </section>

      {/* ===== HERO VARIATION 4: Editorial Masthead ===== */}
      <section className="hero-sec">
        <span className="hero-sec__label">Hero — V4: Editorial Masthead</span>
        <div className="hv4">
          <div className="hv4__masthead">
            <span className="hv4__masthead-line"/>
            <span className="hv4__masthead-text">HQ Aviation — The Robinson Specialists</span>
            <span className="hv4__masthead-line"/>
          </div>
          <div className="hv4__body">
            <div className="hv4__col hv4__col--left">
              <div className="hv4__img-frame">{heroImages.map((s,i)=><div key={i} className={`hv4__img ${i===heroSlide(3)?'active':''}`} style={{backgroundImage:`url(${s})`}}/>)}</div>
            </div>
            <div className="hv4__col hv4__col--center">
              <span className="hv4__edition">Est. 1990 — Denham Aerodrome</span>
              <h1 className="hv4__headline">{heroSlides[heroSlide(3)]?.words.join(' ')}</h1>
              <div className="hv4__rule"/>
              <p className="hv4__desc">{heroSlides[heroSlide(3)]?.desc}</p>
              <div className="hv4__nav">{heroSlides.map((_,i)=><button key={i} className={`hv4__dot ${i===heroSlide(3)?'active':''}`} onClick={()=>setHeroSlide(3)(i)}/>)}</div>
              <Link to="/contact" className="hv4__cta">Explore <span>→</span></Link>
            </div>
            <div className="hv4__col hv4__col--right">
              <div className="hv4__sidebar">
                <span className="hv4__sidebar-label">Services</span>
                <span className="hv4__sidebar-item">Flight Training</span>
                <span className="hv4__sidebar-item">Helicopter Sales</span>
                <span className="hv4__sidebar-item">Maintenance</span>
                <span className="hv4__sidebar-item">Expeditions</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ===== HERO VARIATION 5: Parallax Cards ===== */}
      <section className="hero-sec">
        <span className="hero-sec__label">Hero — V5: Parallax Cards</span>
        <div className="hv5">
          <div className="hv5__cards">
            {heroImages.slice(0,3).map((s,i)=>(
              <div key={i} className={`hv5__card ${i===heroSlide(4) % 3?'active':''}`} style={{backgroundImage:`url(${s})`}}>
                <div className="hv5__card-overlay"/>
              </div>
            ))}
          </div>
          <div className="hv5__center">
            <span className="hv5__badge">Denham Aerodrome — EGLD</span>
            <span className="hv5__pre">{heroSlides[heroSlide(4)]?.pre}</span>
            <h1 className="hv5__headline">{heroSlides[heroSlide(4)]?.words.map((w,i)=><span key={i} className={`hv5__word hv5__word--${i+1}`}>{w}</span>)}</h1>
            <p className="hv5__desc">{heroSlides[heroSlide(4)]?.desc}</p>
            <div className="hv5__dots">{heroSlides.map((_,i)=><button key={i} className={`hv5__dot ${i===heroSlide(4)?'active':''}`} onClick={()=>setHeroSlide(4)(i)}/>)}</div>
          </div>
        </div>
      </section>

      {/* ===== HERO VARIATION 6: Dossier Briefing ===== */}
      <section className="hero-sec">
        <span className="hero-sec__label">Hero — V6: Dossier Briefing</span>
        <div className="hv6">
          <div className="hv6__header">
            <span className="hv6__class">Classified — HQ Aviation Field Brief</span>
            <span className="hv6__ref">REF: EGLD-{String(heroSlide(5)+1).padStart(3,'0')}</span>
          </div>
          <div className="hv6__body">
            <div className="hv6__left">
              <div className="hv6__field">
                <span className="hv6__field-label">Subject</span>
                <h1 className="hv6__field-value hv6__field-value--large">{heroSlides[heroSlide(5)]?.words.join(' ')}</h1>
              </div>
              <div className="hv6__field">
                <span className="hv6__field-label">Brief</span>
                <p className="hv6__field-value">{heroSlides[heroSlide(5)]?.desc}</p>
              </div>
              <div className="hv6__field-row">
                <div className="hv6__field"><span className="hv6__field-label">Location</span><span className="hv6__field-value">Denham Aerodrome</span></div>
                <div className="hv6__field"><span className="hv6__field-label">Coordinates</span><span className="hv6__field-value">51.5751°N, 0.5059°W</span></div>
                <div className="hv6__field"><span className="hv6__field-label">Est.</span><span className="hv6__field-value">1990</span></div>
              </div>
              <Link to="/contact" className="hv6__cta">Access Full Brief <span>→</span></Link>
            </div>
            <div className="hv6__right">
              <div className="hv6__img-wrap">{heroImages.map((s,i)=><div key={i} className={`hv6__img ${i===heroSlide(5)?'active':''}`} style={{backgroundImage:`url(${s})`}}/>)}</div>
              <span className="hv6__img-label">INTEL — VISUAL CONFIRMATION</span>
            </div>
          </div>
          <div className="hv6__footer">{heroSlides.map((_,i)=><button key={i} className={`hv6__tab ${i===heroSlide(5)?'active':''}`} onClick={()=>setHeroSlide(5)(i)}>{String(i+1).padStart(2,'0')} — {_.words.join(' ')}</button>)}</div>
        </div>
      </section>

      {/* ===== HERO VARIATION 7: Vertical Scroll ===== */}
      <section className="hero-sec">
        <span className="hero-sec__label">Hero — V7: Vertical Scroll</span>
        <div className="hv7">
          <div className="hv7__bg">{heroImages.map((s,i)=><div key={i} className={`hv7__bg-img ${i===heroSlide(6)?'active':''}`} style={{backgroundImage:`url(${s})`}}/>)}</div>
          <div className="hv7__overlay"/>
          <div className="hv7__side">
            <span className="hv7__side-text">HQ Aviation</span>
            <span className="hv7__side-line"/>
            <span className="hv7__side-text">Est. 1990</span>
          </div>
          <div className="hv7__center">
            {heroSlides.map((slide,i)=>(
              <div key={i} className={`hv7__slide ${i===heroSlide(6)?'active':''}`}>
                <span className="hv7__num">{String(i+1).padStart(2,'0')}</span>
                <span className="hv7__pre">{slide.pre}</span>
                <h1 className="hv7__headline">{slide.words.join(' ')}</h1>
                <p className="hv7__desc">{slide.desc}</p>
              </div>
            ))}
          </div>
          <div className="hv7__track">
            {heroSlides.map((_,i)=><div key={i} className={`hv7__tick ${i===heroSlide(6)?'active':''}`} onClick={()=>setHeroSlide(6)(i)}/>)}
          </div>
        </div>
      </section>

      {/* ===== HERO VARIATION 8: Asymmetric Magazine ===== */}
      <section className="hero-sec">
        <span className="hero-sec__label">Hero — V8: Asymmetric Magazine</span>
        <div className="hv8">
          <div className="hv8__left">
            <div className="hv8__img-stack">{heroImages.map((s,i)=><div key={i} className={`hv8__img ${i===heroSlide(7)?'active':''}`} style={{backgroundImage:`url(${s})`}}/>)}</div>
          </div>
          <div className="hv8__right">
            <div className="hv8__tag">
              <span>51.5751°N</span>
              <span className="hv8__tag-sep">|</span>
              <span>0.5059°W</span>
              <span className="hv8__tag-sep">|</span>
              <span>EGLD</span>
            </div>
            <span className="hv8__pre">{heroSlides[heroSlide(7)]?.pre}</span>
            <h1 className="hv8__headline">{heroSlides[heroSlide(7)]?.words.map((w,i)=><span key={i} className={`hv8__word hv8__word--${i+1}`}>{w}</span>)}</h1>
            <p className="hv8__desc">{heroSlides[heroSlide(7)]?.desc}</p>
            <div className="hv8__meta">
              <span>Training</span><span>Sales</span><span>Maintenance</span><span>Expeditions</span>
            </div>
            <Link to="/contact" className="hv8__cta">Begin Your Journey <span>→</span></Link>
            <div className="hv8__dots">{heroSlides.map((_,i)=><button key={i} className={`hv8__dot ${i===heroSlide(7)?'active':''}`} onClick={()=>setHeroSlide(7)(i)}/>)}</div>
          </div>
        </div>
      </section>

      {/* ===== HERO VARIATION 9: Ticker Poster ===== */}
      <section className="hero-sec">
        <span className="hero-sec__label">Hero — V9: Ticker Poster</span>
        <div className="hv9">
          <div className="hv9__bg">{heroImages.map((s,i)=><div key={i} className={`hv9__bg-img ${i===heroSlide(8)?'active':''}`} style={{backgroundImage:`url(${s})`}}/>)}</div>
          <div className="hv9__overlay"/>
          <div className="hv9__ticker">
            <div className="hv9__ticker-track">
              {[...Array(3)].map((_,r)=><span key={r} className="hv9__ticker-text">HQ Aviation — The Robinson Specialists — Denham Aerodrome — Est. 1990 — Flight Training — Helicopter Sales — Maintenance — Global Expeditions —&nbsp;</span>)}
            </div>
          </div>
          <div className="hv9__center">
            <h1 className="hv9__headline">{heroSlides[heroSlide(8)]?.words.map((w,i)=><span key={i} className={`hv9__word hv9__word--${i+1}`}>{w} </span>)}</h1>
            <p className="hv9__desc">{heroSlides[heroSlide(8)]?.desc}</p>
            <div className="hv9__nav">
              <button className="hv9__arrow" onClick={()=>setHeroSlide(8)(p=>(p===0?heroSlides.length-1:p-1))}>←</button>
              <span className="hv9__counter">{String(heroSlide(8)+1).padStart(2,'0')} / {String(heroSlides.length).padStart(2,'0')}</span>
              <button className="hv9__arrow" onClick={()=>setHeroSlide(8)(p=>(p+1)%heroSlides.length)}>→</button>
            </div>
          </div>
          <div className="hv9__ticker hv9__ticker--bottom">
            <div className="hv9__ticker-track hv9__ticker-track--reverse">
              {[...Array(3)].map((_,r)=><span key={r} className="hv9__ticker-text">Captain Quentin Smith — Robinson R22 — Robinson R44 — Robinson R66 — UK Authorized Dealer — 35+ Years —&nbsp;</span>)}
            </div>
          </div>
        </div>
      </section>

      {/* ===== HERO VARIATION 10: Minimal Wire ===== */}
      <section className="hero-sec">
        <span className="hero-sec__label">Hero — V10: Minimal Wire</span>
        <div className="hv10">
          <div className="hv10__wire hv10__wire--top"/>
          <div className="hv10__wire hv10__wire--mid"/>
          <div className="hv10__wire hv10__wire--bot"/>
          <div className="hv10__layout">
            <div className="hv10__left">
              <span className="hv10__mono">HQ Aviation</span>
              <span className="hv10__mono hv10__mono--muted">Denham Aerodrome — EGLD</span>
              <span className="hv10__mono hv10__mono--muted">Est. 1990</span>
              <div className="hv10__rule"/>
              <span className="hv10__pre">{heroSlides[heroSlide(9)]?.pre}</span>
              <h1 className="hv10__headline">{heroSlides[heroSlide(9)]?.words.map((w,i)=><span key={i} className={`hv10__word hv10__word--${i+1}`}>{w}</span>)}</h1>
              <p className="hv10__desc">{heroSlides[heroSlide(9)]?.desc}</p>
              <div className="hv10__services">
                <span>01 — Training</span>
                <span>02 — Sales</span>
                <span>03 — Maintenance</span>
                <span>04 — Expeditions</span>
              </div>
              <Link to="/contact" className="hv10__cta">Discover More <span>→</span></Link>
            </div>
            <div className="hv10__right">
              <div className="hv10__img-frame">
                {heroImages.map((s,i)=><div key={i} className={`hv10__img ${i===heroSlide(9)?'active':''}`} style={{backgroundImage:`url(${s})`}}/>)}
                <div className="hv10__img-border"/>
              </div>
              <div className="hv10__dots">{heroSlides.map((_,i)=><button key={i} className={`hv10__dot ${i===heroSlide(9)?'active':''}`} onClick={()=>setHeroSlide(9)(i)}/>)}</div>
            </div>
          </div>
          <div className="hv10__coords">
            <span>51.5751°N</span>
            <span>0.5059°W</span>
          </div>
        </div>
      </section>


      {/* ===== HERO VARIATION 11: Horizon Line ===== */}
      <section className="hero-sec">
        <span className="hero-sec__label">Hero — V11: Horizon Line</span>
        <div className="hv11">
          <div className="hv11__top">
            <div className="hv11__bg">{heroImages.map((s,i)=><div key={i} className={`hv11__bg-img ${i===heroSlide(10)?'active':''}`} style={{backgroundImage:`url(${s})`}}/>)}</div>
            <div className="hv11__overlay"/>
            <div className="hv11__top-content">
              <span className="hv11__pre">{heroSlides[heroSlide(10)]?.pre}</span>
              <h1 className="hv11__headline">{heroSlides[heroSlide(10)]?.words.map((w,i)=><span key={i} className={`hv11__word hv11__word--${i+1}`}>{w} </span>)}</h1>
            </div>
          </div>
          <div className="hv11__horizon"/>
          <div className="hv11__bottom">
            <div className="hv11__bottom-left">
              <p className="hv11__desc">{heroSlides[heroSlide(10)]?.desc}</p>
              <Link to="/contact" className="hv11__cta">Explore <span>→</span></Link>
            </div>
            <div className="hv11__bottom-center">
              <div className="hv11__dots">{heroSlides.map((_,i)=><button key={i} className={`hv11__dot ${i===heroSlide(10)?'active':''}`} onClick={()=>setHeroSlide(10)(i)}/>)}</div>
            </div>
            <div className="hv11__bottom-right">
              <span className="hv11__meta">51.5751°N — 0.5059°W</span>
              <span className="hv11__meta">Denham Aerodrome — EGLD</span>
              <span className="hv11__meta">Est. 1990</span>
            </div>
          </div>
        </div>
      </section>

      {/* ===== HERO VARIATION 12: Stacked Type ===== */}
      <section className="hero-sec">
        <span className="hero-sec__label">Hero — V12: Stacked Type</span>
        <div className="hv12">
          <div className="hv12__bg">{heroImages.map((s,i)=><div key={i} className={`hv12__bg-img ${i===heroSlide(11)?'active':''}`} style={{backgroundImage:`url(${s})`}}/>)}</div>
          <div className="hv12__overlay"/>
          <div className="hv12__content">
            {heroSlides[heroSlide(11)]?.words.map((w,i)=>(
              <h1 key={i} className={`hv12__line hv12__line--${i+1}`}>{w}</h1>
            ))}
            <div className="hv12__info">
              <p className="hv12__desc">{heroSlides[heroSlide(11)]?.desc}</p>
              <div className="hv12__divider"/>
              <div className="hv12__tags">
                <span>Training</span><span>Sales</span><span>Maintenance</span><span>Expeditions</span>
              </div>
            </div>
          </div>
          <div className="hv12__nav">
            <button onClick={()=>setHeroSlide(11)(p=>(p===0?heroSlides.length-1:p-1))}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M15 18l-6-6 6-6"/></svg>
            </button>
            <span className="hv12__counter">{String(heroSlide(11)+1).padStart(2,'0')} / {String(heroSlides.length).padStart(2,'0')}</span>
            <button onClick={()=>setHeroSlide(11)(p=>(p+1)%heroSlides.length)}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M9 18l6-6-6-6"/></svg>
            </button>
          </div>
        </div>
      </section>

      {/* ===== HERO VARIATION 13: Corner Anchored ===== */}
      <section className="hero-sec">
        <span className="hero-sec__label">Hero — V13: Corner Anchored</span>
        <div className="hv13">
          <div className="hv13__bg">{heroImages.map((s,i)=><div key={i} className={`hv13__bg-img ${i===heroSlide(12)?'active':''}`} style={{backgroundImage:`url(${s})`}}/>)}</div>
          <div className="hv13__overlay"/>
          <div className="hv13__tl"><span>HQ Aviation</span></div>
          <div className="hv13__tr"><span>Est. 1990</span></div>
          <div className="hv13__center">
            <span className="hv13__pre">{heroSlides[heroSlide(12)]?.pre}</span>
            <h1 className="hv13__headline">{heroSlides[heroSlide(12)]?.words.join(' ')}</h1>
            <p className="hv13__desc">{heroSlides[heroSlide(12)]?.desc}</p>
            <Link to="/contact" className="hv13__cta">Discover More</Link>
          </div>
          <div className="hv13__bl">
            <span>51.5751°N</span>
            <span>0.5059°W</span>
          </div>
          <div className="hv13__br">
            <div className="hv13__dots">{heroSlides.map((_,i)=><button key={i} className={`hv13__dot ${i===heroSlide(12)?'active':''}`} onClick={()=>setHeroSlide(12)(i)}/>)}</div>
          </div>
        </div>
      </section>

      {/* ===== HERO VARIATION 14: Framed Window ===== */}
      <section className="hero-sec">
        <span className="hero-sec__label">Hero — V14: Framed Window</span>
        <div className="hv14">
          <div className="hv14__frame">
            <div className="hv14__window">
              <div className="hv14__bg">{heroImages.map((s,i)=><div key={i} className={`hv14__bg-img ${i===heroSlide(13)?'active':''}`} style={{backgroundImage:`url(${s})`}}/>)}</div>
              <div className="hv14__overlay"/>
              <div className="hv14__inner">
                <span className="hv14__pre">{heroSlides[heroSlide(13)]?.pre}</span>
                <h1 className="hv14__headline">{heroSlides[heroSlide(13)]?.words.map((w,i)=><span key={i} className={`hv14__word hv14__word--${i+1}`}>{w} </span>)}</h1>
                <p className="hv14__desc">{heroSlides[heroSlide(13)]?.desc}</p>
              </div>
            </div>
          </div>
          <div className="hv14__bar">
            <span className="hv14__brand">HQ Aviation — Denham Aerodrome</span>
            <div className="hv14__dots">{heroSlides.map((_,i)=><button key={i} className={`hv14__dot ${i===heroSlide(13)?'active':''}`} onClick={()=>setHeroSlide(13)(i)}/>)}</div>
            <Link to="/contact" className="hv14__cta">Explore <span>→</span></Link>
          </div>
        </div>
      </section>

      {/* ===== HERO VARIATION 15: Bold Mono ===== */}
      <section className="hero-sec">
        <span className="hero-sec__label">Hero — V15: Bold Mono</span>
        <div className="hv15">
          <div className="hv15__left">
            <div className="hv15__label-wrap">
              <span className="hv15__label">HQ</span>
              <span className="hv15__label">Aviation</span>
            </div>
            <div className="hv15__rule"/>
            <span className="hv15__pre">{heroSlides[heroSlide(14)]?.pre}</span>
            <h1 className="hv15__headline">{heroSlides[heroSlide(14)]?.words.join(' ')}</h1>
            <p className="hv15__desc">{heroSlides[heroSlide(14)]?.desc}</p>
            <div className="hv15__stats">
              <div className="hv15__stat"><span className="hv15__stat-num">35+</span><span className="hv15__stat-label">Years</span></div>
              <div className="hv15__stat"><span className="hv15__stat-num">R22</span><span className="hv15__stat-label">R44 · R66</span></div>
              <div className="hv15__stat"><span className="hv15__stat-num">EGLD</span><span className="hv15__stat-label">Denham</span></div>
            </div>
            <Link to="/contact" className="hv15__cta">Get In Touch <span>→</span></Link>
          </div>
          <div className="hv15__right">
            <div className="hv15__img-wrap">{heroImages.map((s,i)=><div key={i} className={`hv15__img ${i===heroSlide(14)?'active':''}`} style={{backgroundImage:`url(${s})`}}/>)}</div>
            <div className="hv15__dots">{heroSlides.map((_,i)=><button key={i} className={`hv15__dot ${i===heroSlide(14)?'active':''}`} onClick={()=>setHeroSlide(14)(i)}/>)}</div>
          </div>
        </div>
      </section>

      {/* ===== HERO VARIATION 16: Overlapping Panels ===== */}
      <section className="hero-sec">
        <span className="hero-sec__label">Hero — V16: Overlapping Panels</span>
        <div className="hv16">
          <div className="hv16__panel hv16__panel--img">
            {heroImages.map((s,i)=><div key={i} className={`hv16__img ${i===heroSlide(15)?'active':''}`} style={{backgroundImage:`url(${s})`}}/>)}
          </div>
          <div className="hv16__panel hv16__panel--text">
            <span className="hv16__coords">51.5751°N — 0.5059°W</span>
            <span className="hv16__pre">{heroSlides[heroSlide(15)]?.pre}</span>
            <h1 className="hv16__headline">{heroSlides[heroSlide(15)]?.words.map((w,i)=><span key={i} className={`hv16__word hv16__word--${i+1}`}>{w}</span>)}</h1>
            <p className="hv16__desc">{heroSlides[heroSlide(15)]?.desc}</p>
            <div className="hv16__actions">
              <Link to="/contact" className="hv16__cta">Discover</Link>
              <div className="hv16__dots">{heroSlides.map((_,i)=><button key={i} className={`hv16__dot ${i===heroSlide(15)?'active':''}`} onClick={()=>setHeroSlide(15)(i)}/>)}</div>
            </div>
          </div>
        </div>
      </section>

      {/* ===== HERO VARIATION 17: Gazette ===== */}
      <section className="hero-sec">
        <span className="hero-sec__label">Hero — V17: Gazette</span>
        <div className="hv17">
          <div className="hv17__header">
            <div className="hv17__header-line"/>
            <div className="hv17__header-center">
              <span className="hv17__header-sub">Denham Aerodrome — Est. 1990</span>
              <span className="hv17__header-title">HQ Aviation</span>
              <span className="hv17__header-sub">The Robinson Specialists — EGLD</span>
            </div>
            <div className="hv17__header-line"/>
          </div>
          <div className="hv17__body">
            <div className="hv17__col hv17__col--1">
              <div className="hv17__img-wrap">{heroImages.map((s,i)=><div key={i} className={`hv17__img ${i===heroSlide(16)?'active':''}`} style={{backgroundImage:`url(${s})`}}/>)}</div>
              <span className="hv17__caption">Image {String(heroSlide(16)+1).padStart(2,'0')} of {String(heroImages.length).padStart(2,'0')}</span>
            </div>
            <div className="hv17__col hv17__col--2">
              <span className="hv17__kicker">{heroSlides[heroSlide(16)]?.pre}</span>
              <h1 className="hv17__headline">{heroSlides[heroSlide(16)]?.words.join(' ')}</h1>
              <div className="hv17__rule"/>
              <p className="hv17__lede">{heroSlides[heroSlide(16)]?.desc}</p>
              <p className="hv17__body-text">For over three decades, HQ Aviation has been the UK's leading Robinson helicopter specialists — training pilots, selling and maintaining aircraft, and leading expeditions to the most remote corners of the earth.</p>
            </div>
            <div className="hv17__col hv17__col--3">
              <span className="hv17__aside-label">Our Services</span>
              <div className="hv17__aside-list">
                <span>Flight Training</span>
                <span>Helicopter Sales</span>
                <span>Maintenance &amp; Overhauls</span>
                <span>Global Expeditions</span>
                <span>Owner Management</span>
              </div>
              <div className="hv17__aside-nav">{heroSlides.map((_,i)=><button key={i} className={`hv17__nav-btn ${i===heroSlide(16)?'active':''}`} onClick={()=>setHeroSlide(16)(i)}>{String(i+1).padStart(2,'0')}</button>)}</div>
            </div>
          </div>
        </div>
      </section>

      {/* ===== HERO VARIATION 18: Dark Theater ===== */}
      <section className="hero-sec">
        <span className="hero-sec__label">Hero — V18: Dark Theater</span>
        <div className="hv18">
          <div className="hv18__stage">
            <div className="hv18__bg">{heroImages.map((s,i)=><div key={i} className={`hv18__bg-img ${i===heroSlide(17)?'active':''}`} style={{backgroundImage:`url(${s})`}}/>)}</div>
            <div className="hv18__vignette"/>
            <div className="hv18__content">
              <div className="hv18__num">{String(heroSlide(17)+1).padStart(2,'0')}</div>
              <span className="hv18__pre">{heroSlides[heroSlide(17)]?.pre}</span>
              <h1 className="hv18__headline">{heroSlides[heroSlide(17)]?.words.map((w,i)=><span key={i} className={`hv18__word hv18__word--${i+1}`}>{w} </span>)}</h1>
              <p className="hv18__desc">{heroSlides[heroSlide(17)]?.desc}</p>
              <Link to="/contact" className="hv18__cta">Begin Your Journey</Link>
            </div>
          </div>
          <div className="hv18__strip">
            {heroImages.map((s,i)=><div key={i} className={`hv18__thumb ${i===heroSlide(17)?'active':''}`} style={{backgroundImage:`url(${s})`}} onClick={()=>setHeroSlide(17)(i % heroSlides.length)}/>)}
          </div>
        </div>
      </section>

      {/* ===== HERO VARIATION 19: Split Reveal ===== */}
      <section className="hero-sec">
        <span className="hero-sec__label">Hero — V19: Split Reveal</span>
        <div className="hv19">
          <div className="hv19__left">
            <div className="hv19__left-inner">
              <span className="hv19__eyebrow">HQ Aviation — Denham Aerodrome</span>
              <span className="hv19__pre">{heroSlides[heroSlide(18)]?.pre}</span>
              <h1 className="hv19__headline">{heroSlides[heroSlide(18)]?.words.map((w,i)=><span key={i} className={`hv19__word hv19__word--${i+1}`}>{w}</span>)}</h1>
              <div className="hv19__rule"/>
              <p className="hv19__desc">{heroSlides[heroSlide(18)]?.desc}</p>
              <div className="hv19__actions">
                <Link to="/contact" className="hv19__cta">Get Started <span>→</span></Link>
                <Link to="/about-us" className="hv19__link">About Us</Link>
              </div>
            </div>
          </div>
          <div className="hv19__right">
            {heroImages.map((s,i)=><div key={i} className={`hv19__img ${i===heroSlide(18)?'active':''}`} style={{backgroundImage:`url(${s})`}}/>)}
            <div className="hv19__right-overlay">
              <div className="hv19__counter">{String(heroSlide(18)+1).padStart(2,'0')}<span>/{String(heroSlides.length).padStart(2,'0')}</span></div>
              <div className="hv19__arrows">
                <button onClick={()=>setHeroSlide(18)(p=>(p===0?heroSlides.length-1:p-1))}><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M15 18l-6-6 6-6"/></svg></button>
                <button onClick={()=>setHeroSlide(18)(p=>(p+1)%heroSlides.length)}><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M9 18l6-6-6-6"/></svg></button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ===== HERO VARIATION 20: Grid Mosaic ===== */}
      <section className="hero-sec">
        <span className="hero-sec__label">Hero — V20: Grid Mosaic</span>
        <div className="hv20">
          <div className="hv20__grid">
            {heroImages.map((s,i)=><div key={i} className={`hv20__cell ${i===heroSlide(19)?'hv20__cell--active':''}`} style={{backgroundImage:`url(${s})`}}/>)}
          </div>
          <div className="hv20__text-cell">
            <span className="hv20__badge">HQ Aviation — Est. 1990</span>
            <span className="hv20__pre">{heroSlides[heroSlide(19)]?.pre}</span>
            <h1 className="hv20__headline">{heroSlides[heroSlide(19)]?.words.map((w,i)=><span key={i} className={`hv20__word hv20__word--${i+1}`}>{w}</span>)}</h1>
            <p className="hv20__desc">{heroSlides[heroSlide(19)]?.desc}</p>
            <div className="hv20__foot">
              <Link to="/contact" className="hv20__cta">Explore <span>→</span></Link>
              <div className="hv20__dots">{heroSlides.map((_,i)=><button key={i} className={`hv20__dot ${i===heroSlide(19)?'active':''}`} onClick={()=>setHeroSlide(19)(i)}/>)}</div>
            </div>
          </div>
        </div>
      </section>


      {/* ===== HERO VARIATION 21: Cockpit HUD ===== */}
      <section className="hero-sec">
        <span className="hero-sec__label">Hero — V21: Cockpit HUD</span>
        <div className="hv21">
          <div className="hv21__bg">{heroImages.map((s,i)=><div key={i} className={`hv21__bg-img ${i===heroSlide(20)?'active':''}`} style={{backgroundImage:`url(${s})`}}/>)}</div>
          <div className="hv21__overlay"/>
          <div className="hv21__hud">
            <div className="hv21__hud-top">
              <div className="hv21__readout"><span className="hv21__readout-label">ALT</span><span className="hv21__readout-val">3,500ft</span></div>
              <div className="hv21__readout"><span className="hv21__readout-label">HDG</span><span className="hv21__readout-val">270°</span></div>
              <div className="hv21__readout hv21__readout--center"><span className="hv21__readout-label">Status</span><span className="hv21__readout-val hv21__readout-val--green">Active</span></div>
              <div className="hv21__readout"><span className="hv21__readout-label">SPD</span><span className="hv21__readout-val">110kts</span></div>
              <div className="hv21__readout"><span className="hv21__readout-label">FUEL</span><span className="hv21__readout-val">87%</span></div>
            </div>
            <div className="hv21__horizon-line">
              <span className="hv21__horizon-mark">−10</span>
              <span className="hv21__horizon-mark">−5</span>
              <div className="hv21__horizon-center">
                <svg viewBox="0 0 60 30" width="60" height="30"><path d="M0 15 L25 15 L30 20 L35 15 L60 15" stroke="rgba(255,255,255,0.6)" fill="none" strokeWidth="1"/></svg>
              </div>
              <span className="hv21__horizon-mark">+5</span>
              <span className="hv21__horizon-mark">+10</span>
            </div>
            <div className="hv21__center">
              <span className="hv21__pre">{heroSlides[heroSlide(20)]?.pre}</span>
              <h1 className="hv21__headline">{heroSlides[heroSlide(20)]?.words.join(' ')}</h1>
              <p className="hv21__desc">{heroSlides[heroSlide(20)]?.desc}</p>
              <Link to="/contact" className="hv21__cta">Engage <span>→</span></Link>
            </div>
            <div className="hv21__hud-bottom">
              <div className="hv21__coord-block"><span className="hv21__readout-label">LAT</span><span className="hv21__readout-val">51.5751°N</span></div>
              <div className="hv21__nav-strip">{heroSlides.map((_,i)=><button key={i} className={`hv21__nav-btn ${i===heroSlide(20)?'active':''}`} onClick={()=>setHeroSlide(20)(i)}><span>{String(i+1).padStart(2,'0')}</span></button>)}</div>
              <div className="hv21__coord-block"><span className="hv21__readout-label">LON</span><span className="hv21__readout-val">0.5059°W</span></div>
            </div>
          </div>
          <div className="hv21__scanline"/>
        </div>
      </section>

      {/* ===== HERO VARIATION 22: Letterpress ===== */}
      <section className="hero-sec">
        <span className="hero-sec__label">Hero — V22: Letterpress</span>
        <div className="hv22">
          <div className="hv22__paper">
            <div className="hv22__ornament">✦</div>
            <span className="hv22__foundry">HQ Aviation — Denham Aerodrome — Est. 1990</span>
            <div className="hv22__ornament-line"><span/><span>✦</span><span/></div>
            <span className="hv22__pre">{heroSlides[heroSlide(21)]?.pre}</span>
            <h1 className="hv22__headline">{heroSlides[heroSlide(21)]?.words.map((w,i)=><span key={i} className={`hv22__word hv22__word--${i+1}`}>{w}</span>)}</h1>
            <div className="hv22__ornament-line"><span/><span>✦</span><span/></div>
            <p className="hv22__desc">{heroSlides[heroSlide(21)]?.desc}</p>
            <div className="hv22__img-row">
              {heroImages.slice(0,3).map((s,i)=><div key={i} className={`hv22__img ${i===heroSlide(21) % 3?'active':''}`} style={{backgroundImage:`url(${s})`}} onClick={()=>setHeroSlide(21)(i)}/>)}
            </div>
            <div className="hv22__footer-row">
              <span>The Robinson Specialists</span>
              <div className="hv22__dots">{heroSlides.map((_,i)=><button key={i} className={`hv22__dot ${i===heroSlide(21)?'active':''}`} onClick={()=>setHeroSlide(21)(i)}/>)}</div>
              <span>Training · Sales · Maintenance</span>
            </div>
          </div>
        </div>
      </section>

      {/* ===== HERO VARIATION 23: Film Title ===== */}
      <section className="hero-sec">
        <span className="hero-sec__label">Hero — V23: Film Title Sequence</span>
        <div className="hv23">
          <div className="hv23__bg">{heroImages.map((s,i)=><div key={i} className={`hv23__bg-img ${i===heroSlide(22)?'active':''}`} style={{backgroundImage:`url(${s})`}}/>)}</div>
          <div className="hv23__overlay"/>
          <div className="hv23__bars"><div className="hv23__bar hv23__bar--top"/><div className="hv23__bar hv23__bar--bot"/></div>
          <div className="hv23__content">
            <span className="hv23__studio">HQ Aviation Presents</span>
            <div className="hv23__title-block">
              {heroSlides[heroSlide(22)]?.words.map((w,i)=>(
                <h1 key={i} className={`hv23__title hv23__title--${i+1}`}>{w}</h1>
              ))}
            </div>
            <p className="hv23__tagline">{heroSlides[heroSlide(22)]?.desc}</p>
            <div className="hv23__credits">
              <div className="hv23__credit"><span className="hv23__credit-role">Location</span><span className="hv23__credit-name">Denham Aerodrome</span></div>
              <div className="hv23__credit"><span className="hv23__credit-role">Founded</span><span className="hv23__credit-name">Captain Quentin Smith</span></div>
              <div className="hv23__credit"><span className="hv23__credit-role">Since</span><span className="hv23__credit-name">1990</span></div>
            </div>
          </div>
          <div className="hv23__nav">{heroSlides.map((_,i)=><button key={i} className={`hv23__dot ${i===heroSlide(22)?'active':''}`} onClick={()=>setHeroSlide(22)(i)}/>)}</div>
        </div>
      </section>

      {/* ===== HERO VARIATION 24: Topographic ===== */}
      <section className="hero-sec">
        <span className="hero-sec__label">Hero — V24: Topographic</span>
        <div className="hv24">
          <svg className="hv24__topo" viewBox="0 0 800 600" preserveAspectRatio="none">
            {[...Array(12)].map((_,i)=><ellipse key={i} cx={400+Math.sin(i*0.8)*50} cy={300+Math.cos(i*0.5)*30} rx={80+i*30} ry={50+i*20} fill="none" stroke="#e8e6e2" strokeWidth="0.5" opacity={0.4+i*0.05}/>)}
          </svg>
          <div className="hv24__pin">
            <div className="hv24__pin-dot"/>
            <span className="hv24__pin-label">EGLD — 51.5751°N, 0.5059°W</span>
          </div>
          <div className="hv24__content">
            <span className="hv24__pre">{heroSlides[heroSlide(23)]?.pre}</span>
            <h1 className="hv24__headline">{heroSlides[heroSlide(23)]?.words.map((w,i)=><span key={i} className={`hv24__word hv24__word--${i+1}`}>{w}</span>)}</h1>
            <p className="hv24__desc">{heroSlides[heroSlide(23)]?.desc}</p>
            <Link to="/contact" className="hv24__cta">Start Your Journey <span>→</span></Link>
          </div>
          <div className="hv24__img-panel">
            {heroImages.map((s,i)=><div key={i} className={`hv24__img ${i===heroSlide(23)?'active':''}`} style={{backgroundImage:`url(${s})`}}/>)}
          </div>
          <div className="hv24__dots">{heroSlides.map((_,i)=><button key={i} className={`hv24__dot ${i===heroSlide(23)?'active':''}`} onClick={()=>setHeroSlide(23)(i)}/>)}</div>
          <div className="hv24__compass">
            <svg viewBox="0 0 50 50" width="50" height="50"><circle cx="25" cy="25" r="23" fill="none" stroke="#e8e6e2" strokeWidth="0.5"/><text x="25" y="10" textAnchor="middle" fill="#999" fontSize="5" fontFamily="Share Tech Mono">N</text><text x="25" y="44" textAnchor="middle" fill="#ccc" fontSize="5" fontFamily="Share Tech Mono">S</text><text x="6" y="27" textAnchor="middle" fill="#ccc" fontSize="5" fontFamily="Share Tech Mono">W</text><text x="44" y="27" textAnchor="middle" fill="#ccc" fontSize="5" fontFamily="Share Tech Mono">E</text><line x1="25" y1="12" x2="25" y2="20" stroke="#1a1a1a" strokeWidth="1"/></svg>
          </div>
        </div>
      </section>

      {/* ===== HERO VARIATION 25: Passport Stamp ===== */}
      <section className="hero-sec">
        <span className="hero-sec__label">Hero — V25: Passport Stamp</span>
        <div className="hv25">
          <div className="hv25__bg">{heroImages.map((s,i)=><div key={i} className={`hv25__bg-img ${i===heroSlide(24)?'active':''}`} style={{backgroundImage:`url(${s})`}}/>)}</div>
          <div className="hv25__overlay"/>
          <div className="hv25__stamp">
            <div className="hv25__stamp-border">
              <span className="hv25__stamp-arc">★ HQ AVIATION — DENHAM AERODROME — EGLD ★</span>
              <div className="hv25__stamp-center">
                <span className="hv25__stamp-pre">{heroSlides[heroSlide(24)]?.pre}</span>
                <h1 className="hv25__stamp-headline">{heroSlides[heroSlide(24)]?.words.join(' ')}</h1>
                <span className="hv25__stamp-date">Est. 1990</span>
              </div>
              <span className="hv25__stamp-coords">51.5751°N — 0.5059°W</span>
            </div>
          </div>
          <p className="hv25__desc">{heroSlides[heroSlide(24)]?.desc}</p>
          <div className="hv25__nav">
            <button onClick={()=>setHeroSlide(24)(p=>(p===0?heroSlides.length-1:p-1))}><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M15 18l-6-6 6-6"/></svg></button>
            <span className="hv25__counter">{String(heroSlide(24)+1).padStart(2,'0')} / {String(heroSlides.length).padStart(2,'0')}</span>
            <button onClick={()=>setHeroSlide(24)(p=>(p+1)%heroSlides.length)}><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M9 18l6-6-6-6"/></svg></button>
          </div>
        </div>
      </section>

      {/* ===== HERO VARIATION 26: Swiss Poster ===== */}
      <section className="hero-sec">
        <span className="hero-sec__label">Hero — V26: Swiss Poster</span>
        <div className="hv26">
          <div className="hv26__grid-overlay">
            {[...Array(8)].map((_,i)=><div key={i} className="hv26__grid-v" style={{left:`${(i+1)*12.5}%`}}/>)}
            {[...Array(6)].map((_,i)=><div key={i} className="hv26__grid-h" style={{top:`${(i+1)*14.28}%`}}/>)}
          </div>
          <div className="hv26__layout">
            <div className="hv26__type-block">
              <span className="hv26__num">{String(heroSlide(25)+1).padStart(2,'0')}</span>
              <h1 className="hv26__headline">{heroSlides[heroSlide(25)]?.words.map((w,i)=><span key={i} className={`hv26__word hv26__word--${i+1}`}>{w}</span>)}</h1>
            </div>
            <div className="hv26__img-block">
              {heroImages.map((s,i)=><div key={i} className={`hv26__img ${i===heroSlide(25)?'active':''}`} style={{backgroundImage:`url(${s})`}}/>)}
            </div>
            <div className="hv26__info-block">
              <p className="hv26__desc">{heroSlides[heroSlide(25)]?.desc}</p>
              <div className="hv26__data">
                <div><span className="hv26__data-label">Location</span><span className="hv26__data-val">Denham Aerodrome</span></div>
                <div><span className="hv26__data-label">ICAO</span><span className="hv26__data-val">EGLD</span></div>
                <div><span className="hv26__data-label">Founded</span><span className="hv26__data-val">1990</span></div>
              </div>
              <div className="hv26__dots">{heroSlides.map((_,i)=><button key={i} className={`hv26__dot ${i===heroSlide(25)?'active':''}`} onClick={()=>setHeroSlide(25)(i)}/>)}</div>
            </div>
          </div>
        </div>
      </section>

      {/* ===== HERO VARIATION 27: Logbook ===== */}
      <section className="hero-sec">
        <span className="hero-sec__label">Hero — V27: Logbook</span>
        <div className="hv27">
          <div className="hv27__spine"/>
          <div className="hv27__page hv27__page--left">
            <div className="hv27__ruled">
              {[...Array(15)].map((_,i)=><div key={i} className="hv27__rule-line"/>)}
            </div>
            <div className="hv27__page-content">
              <span className="hv27__page-header">Captain's Log — HQ Aviation</span>
              <div className="hv27__entry">
                <span className="hv27__entry-date">Entry {String(heroSlide(26)+1).padStart(2,'0')}</span>
                <span className="hv27__entry-pre">{heroSlides[heroSlide(26)]?.pre}</span>
                <h1 className="hv27__headline">{heroSlides[heroSlide(26)]?.words.join(' ')}</h1>
                <p className="hv27__entry-text">{heroSlides[heroSlide(26)]?.desc}</p>
                <p className="hv27__entry-text">For over three decades, HQ Aviation has been the UK's leading Robinson helicopter specialists — from first flight to global expeditions.</p>
              </div>
              <div className="hv27__entry-footer">
                <span>Denham Aerodrome — EGLD</span>
                <span>51.5751°N, 0.5059°W</span>
              </div>
            </div>
          </div>
          <div className="hv27__page hv27__page--right">
            <div className="hv27__photo-area">
              {heroImages.map((s,i)=><div key={i} className={`hv27__photo ${i===heroSlide(26)?'active':''}`} style={{backgroundImage:`url(${s})`}}/>)}
              <div className="hv27__photo-tape hv27__photo-tape--tl"/>
              <div className="hv27__photo-tape hv27__photo-tape--br"/>
            </div>
            <div className="hv27__page-nav">{heroSlides.map((_,i)=><button key={i} className={`hv27__nav-btn ${i===heroSlide(26)?'active':''}`} onClick={()=>setHeroSlide(26)(i)}>{String(i+1).padStart(2,'0')}</button>)}</div>
          </div>
        </div>
      </section>

      {/* ===== HERO VARIATION 28: Runway ===== */}
      <section className="hero-sec">
        <span className="hero-sec__label">Hero — V28: Runway</span>
        <div className="hv28">
          <div className="hv28__bg">{heroImages.map((s,i)=><div key={i} className={`hv28__bg-img ${i===heroSlide(27)?'active':''}`} style={{backgroundImage:`url(${s})`}}/>)}</div>
          <div className="hv28__overlay"/>
          <div className="hv28__runway">
            <div className="hv28__marking hv28__marking--threshold">
              {[...Array(4)].map((_,i)=><div key={i} className="hv28__stripe"/>)}
            </div>
            <div className="hv28__centerline">
              {[...Array(6)].map((_,i)=><div key={i} className="hv28__dash"/>)}
            </div>
            <div className="hv28__designator">24</div>
          </div>
          <div className="hv28__content">
            <div className="hv28__atc-bar">
              <span>EGLD TOWER</span>
              <span>RWY 24</span>
              <span>CLEARED FOR TAKEOFF</span>
            </div>
            <span className="hv28__pre">{heroSlides[heroSlide(27)]?.pre}</span>
            <h1 className="hv28__headline">{heroSlides[heroSlide(27)]?.words.map((w,i)=><span key={i} className={`hv28__word hv28__word--${i+1}`}>{w} </span>)}</h1>
            <p className="hv28__desc">{heroSlides[heroSlide(27)]?.desc}</p>
            <Link to="/contact" className="hv28__cta">Clear for Takeoff <span>→</span></Link>
          </div>
          <div className="hv28__dots">{heroSlides.map((_,i)=><button key={i} className={`hv28__dot ${i===heroSlide(27)?'active':''}`} onClick={()=>setHeroSlide(27)(i)}/>)}</div>
        </div>
      </section>

      {/* ===== HERO VARIATION 29: Layered Depth ===== */}
      <section className="hero-sec">
        <span className="hero-sec__label">Hero — V29: Layered Depth</span>
        <div className="hv29">
          <div className="hv29__layer hv29__layer--bg">{heroImages.map((s,i)=><div key={i} className={`hv29__bg-img ${i===heroSlide(28)?'active':''}`} style={{backgroundImage:`url(${s})`}}/>)}</div>
          <div className="hv29__layer hv29__layer--mid">
            <h1 className="hv29__ghost">{heroSlides[heroSlide(28)]?.words.join(' ')}</h1>
          </div>
          <div className="hv29__layer hv29__layer--overlay"/>
          <div className="hv29__layer hv29__layer--front">
            <div className="hv29__content">
              <span className="hv29__pre">{heroSlides[heroSlide(28)]?.pre}</span>
              <h1 className="hv29__headline">{heroSlides[heroSlide(28)]?.words.map((w,i)=><span key={i} className={`hv29__word hv29__word--${i+1}`}>{w} </span>)}</h1>
              <p className="hv29__desc">{heroSlides[heroSlide(28)]?.desc}</p>
              <div className="hv29__actions">
                <Link to="/contact" className="hv29__cta">Explore</Link>
                <div className="hv29__dots">{heroSlides.map((_,i)=><button key={i} className={`hv29__dot ${i===heroSlide(28)?'active':''}`} onClick={()=>setHeroSlide(28)(i)}/>)}</div>
              </div>
            </div>
          </div>
          <div className="hv29__brand">
            <span>HQ Aviation</span>
            <span className="hv29__brand-sep"/>
            <span>Denham Aerodrome</span>
            <span className="hv29__brand-sep"/>
            <span>Est. 1990</span>
          </div>
        </div>
      </section>

      {/* ===== HERO VARIATION 30: Aviation Chart ===== */}
      {/* Title Variation T1: Top-left (original) */}
      <section className="hero-sec">
        <span className="hero-sec__label">Hero — V30 T1: Top Left</span>
        <div className="hv30">
          <div className="hv30__layout">
            <div className="hv30__left">
              <div className="hv30__brand hv30__brand--tl">
                <span className="hv30__brand-name"><span className="hv30__brand-w1">HQ</span> <span className="hv30__brand-w2">Aviation</span></span>
                <span className="hv30__brand-tag">Est. 2010 · London · <img alt="UK" src="/assets/images/icons/Union Jack.svg" style={{width: '14px', height: 'auto', filter: 'grayscale(100%) contrast(1.2)', opacity: 0.7, display: 'inline-block', verticalAlign: 'middle', marginLeft: '4px'}} /></span>
              </div>
            </div>
            <div className="hv30__right">
              <div className="hv30__img-panel">{heroImages.map((s,i)=><div key={i} className={`hv30__img ${i===heroSlide(29)?'active':''}`} style={{backgroundImage:`url(${s})`}}/>)}</div>
            </div>
          </div>
          <div className="hv30__thumbs">
            {heroImages.map((s,i) => (
              <button key={i} className={`hv30__thumb ${i===heroSlide(29)?'hv30__thumb--active':''}`} onClick={()=>setHeroSlide(29)(i)}>
                <img src={s} alt={`Slide ${i+1}`} />
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Title Variation T2: Center */}
      <section className="hero-sec">
        <span className="hero-sec__label">Hero — V30 T2: Center</span>
        <div className="hv30">
          <div className="hv30__img-panel hv30__img-panel--full">{heroImages.map((s,i)=><div key={i} className={`hv30__img ${i===heroSlide(29)?'active':''}`} style={{backgroundImage:`url(${s})`}}/>)}</div>
          <div className="hv30__brand hv30__brand--center">
            <span className="hv30__brand-name"><span className="hv30__brand-w1">HQ</span> <span className="hv30__brand-w2">Aviation</span></span>
            <span className="hv30__brand-tag">Est. 2010 · London · <img alt="UK" src="/assets/images/icons/Union Jack.svg" style={{width: '14px', height: 'auto', filter: 'grayscale(100%) contrast(1.2)', opacity: 0.7, display: 'inline-block', verticalAlign: 'middle', marginLeft: '4px'}} /></span>
          </div>
          <div className="hv30__thumbs">
            {heroImages.map((s,i) => (
              <button key={i} className={`hv30__thumb ${i===heroSlide(29)?'hv30__thumb--active':''}`} onClick={()=>setHeroSlide(29)(i)}>
                <img src={s} alt={`Slide ${i+1}`} />
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Title Variation T3: Bottom-left */}
      <section className="hero-sec">
        <span className="hero-sec__label">Hero — V30 T3: Bottom Left</span>
        <div className="hv30">
          <div className="hv30__img-panel hv30__img-panel--full">{heroImages.map((s,i)=><div key={i} className={`hv30__img ${i===heroSlide(29)?'active':''}`} style={{backgroundImage:`url(${s})`}}/>)}</div>
          <div className="hv30__brand hv30__brand--bl">
            <span className="hv30__brand-name"><span className="hv30__brand-w1">HQ</span> <span className="hv30__brand-w2">Aviation</span></span>
            <span className="hv30__brand-tag">Est. 2010 · London · <img alt="UK" src="/assets/images/icons/Union Jack.svg" style={{width: '14px', height: 'auto', filter: 'grayscale(100%) contrast(1.2)', opacity: 0.7, display: 'inline-block', verticalAlign: 'middle', marginLeft: '4px'}} /></span>
          </div>
          <div className="hv30__thumbs">
            {heroImages.map((s,i) => (
              <button key={i} className={`hv30__thumb ${i===heroSlide(29)?'hv30__thumb--active':''}`} onClick={()=>setHeroSlide(29)(i)}>
                <img src={s} alt={`Slide ${i+1}`} />
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Title Variation T4: Bottom-right */}
      <section className="hero-sec">
        <span className="hero-sec__label">Hero — V30 T4: Bottom Right</span>
        <div className="hv30">
          <div className="hv30__img-panel hv30__img-panel--full">{heroImages.map((s,i)=><div key={i} className={`hv30__img ${i===heroSlide(29)?'active':''}`} style={{backgroundImage:`url(${s})`}}/>)}</div>
          <div className="hv30__brand hv30__brand--br">
            <span className="hv30__brand-name"><span className="hv30__brand-w1">HQ</span> <span className="hv30__brand-w2">Aviation</span></span>
            <span className="hv30__brand-tag">Est. 2010 · London · <img alt="UK" src="/assets/images/icons/Union Jack.svg" style={{width: '14px', height: 'auto', filter: 'grayscale(100%) contrast(1.2)', opacity: 0.7, display: 'inline-block', verticalAlign: 'middle', marginLeft: '4px'}} /></span>
          </div>
          <div className="hv30__thumbs">
            {heroImages.map((s,i) => (
              <button key={i} className={`hv30__thumb ${i===heroSlide(29)?'hv30__thumb--active':''}`} onClick={()=>setHeroSlide(29)(i)}>
                <img src={s} alt={`Slide ${i+1}`} />
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Title Variation T5: Top-right */}
      <section className="hero-sec">
        <span className="hero-sec__label">Hero — V30 T5: Top Right</span>
        <div className="hv30">
          <div className="hv30__img-panel hv30__img-panel--full">{heroImages.map((s,i)=><div key={i} className={`hv30__img ${i===heroSlide(29)?'active':''}`} style={{backgroundImage:`url(${s})`}}/>)}</div>
          <div className="hv30__brand hv30__brand--tr">
            <span className="hv30__brand-name"><span className="hv30__brand-w1">HQ</span> <span className="hv30__brand-w2">Aviation</span></span>
            <span className="hv30__brand-tag">Est. 2010 · London · <img alt="UK" src="/assets/images/icons/Union Jack.svg" style={{width: '14px', height: 'auto', filter: 'grayscale(100%) contrast(1.2)', opacity: 0.7, display: 'inline-block', verticalAlign: 'middle', marginLeft: '4px'}} /></span>
          </div>
          <div className="hv30__thumbs">
            {heroImages.map((s,i) => (
              <button key={i} className={`hv30__thumb ${i===heroSlide(29)?'hv30__thumb--active':''}`} onClick={()=>setHeroSlide(29)(i)}>
                <img src={s} alt={`Slide ${i+1}`} />
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Title Variation T6: Center-left vertical */}
      <section className="hero-sec">
        <span className="hero-sec__label">Hero — V30 T6: Center Left</span>
        <div className="hv30">
          <div className="hv30__img-panel hv30__img-panel--full">{heroImages.map((s,i)=><div key={i} className={`hv30__img ${i===heroSlide(29)?'active':''}`} style={{backgroundImage:`url(${s})`}}/>)}</div>
          <div className="hv30__brand hv30__brand--cl">
            <span className="hv30__brand-name"><span className="hv30__brand-w1">HQ</span> <span className="hv30__brand-w2">Aviation</span></span>
            <span className="hv30__brand-tag">Est. 2010 · London · <img alt="UK" src="/assets/images/icons/Union Jack.svg" style={{width: '14px', height: 'auto', filter: 'grayscale(100%) contrast(1.2)', opacity: 0.7, display: 'inline-block', verticalAlign: 'middle', marginLeft: '4px'}} /></span>
          </div>
          <div className="hv30__thumbs">
            {heroImages.map((s,i) => (
              <button key={i} className={`hv30__thumb ${i===heroSlide(29)?'hv30__thumb--active':''}`} onClick={()=>setHeroSlide(29)(i)}>
                <img src={s} alt={`Slide ${i+1}`} />
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Title Variation T7: Center-right */}
      <section className="hero-sec">
        <span className="hero-sec__label">Hero — V30 T7: Center Right</span>
        <div className="hv30">
          <div className="hv30__img-panel hv30__img-panel--full">{heroImages.map((s,i)=><div key={i} className={`hv30__img ${i===heroSlide(29)?'active':''}`} style={{backgroundImage:`url(${s})`}}/>)}</div>
          <div className="hv30__brand hv30__brand--cr">
            <span className="hv30__brand-name"><span className="hv30__brand-w1">HQ</span> <span className="hv30__brand-w2">Aviation</span></span>
            <span className="hv30__brand-tag">Est. 2010 · London · <img alt="UK" src="/assets/images/icons/Union Jack.svg" style={{width: '14px', height: 'auto', filter: 'grayscale(100%) contrast(1.2)', opacity: 0.7, display: 'inline-block', verticalAlign: 'middle', marginLeft: '4px'}} /></span>
          </div>
          <div className="hv30__thumbs">
            {heroImages.map((s,i) => (
              <button key={i} className={`hv30__thumb ${i===heroSlide(29)?'hv30__thumb--active':''}`} onClick={()=>setHeroSlide(29)(i)}>
                <img src={s} alt={`Slide ${i+1}`} />
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Title Variation T8: Large center, tag below image */}
      <section className="hero-sec">
        <span className="hero-sec__label">Hero — V30 T8: Large Center</span>
        <div className="hv30">
          <div className="hv30__img-panel hv30__img-panel--full">{heroImages.map((s,i)=><div key={i} className={`hv30__img ${i===heroSlide(29)?'active':''}`} style={{backgroundImage:`url(${s})`}}/>)}</div>
          <div className="hv30__brand hv30__brand--lg-center">
            <span className="hv30__brand-name hv30__brand-name--lg"><span className="hv30__brand-w1">HQ</span> <span className="hv30__brand-w2">Aviation</span></span>
            <span className="hv30__brand-tag">Est. 2010 · London · <img alt="UK" src="/assets/images/icons/Union Jack.svg" style={{width: '14px', height: 'auto', filter: 'grayscale(100%) contrast(1.2)', opacity: 0.7, display: 'inline-block', verticalAlign: 'middle', marginLeft: '4px'}} /></span>
          </div>
          <div className="hv30__thumbs">
            {heroImages.map((s,i) => (
              <button key={i} className={`hv30__thumb ${i===heroSlide(29)?'hv30__thumb--active':''}`} onClick={()=>setHeroSlide(29)(i)}>
                <img src={s} alt={`Slide ${i+1}`} />
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Title Variation T9: Stacked vertical left */}
      <section className="hero-sec">
        <span className="hero-sec__label">Hero — V30 T9: Stacked Left</span>
        <div className="hv30">
          <div className="hv30__img-panel hv30__img-panel--full">{heroImages.map((s,i)=><div key={i} className={`hv30__img ${i===heroSlide(29)?'active':''}`} style={{backgroundImage:`url(${s})`}}/>)}</div>
          <div className="hv30__brand hv30__brand--stacked-l">
            <span className="hv30__brand-name hv30__brand-name--stacked"><span className="hv30__brand-w1">HQ</span><br/><span className="hv30__brand-w2">Aviation</span></span>
            <span className="hv30__brand-tag">Est. 2010 · London · <img alt="UK" src="/assets/images/icons/Union Jack.svg" style={{width: '14px', height: 'auto', filter: 'grayscale(100%) contrast(1.2)', opacity: 0.7, display: 'inline-block', verticalAlign: 'middle', marginLeft: '4px'}} /></span>
          </div>
          <div className="hv30__thumbs">
            {heroImages.map((s,i) => (
              <button key={i} className={`hv30__thumb ${i===heroSlide(29)?'hv30__thumb--active':''}`} onClick={()=>setHeroSlide(29)(i)}>
                <img src={s} alt={`Slide ${i+1}`} />
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Title Variation T10: Bottom center strip */}
      <section className="hero-sec">
        <span className="hero-sec__label">Hero — V30 T10: Bottom Strip</span>
        <div className="hv30">
          <div className="hv30__img-panel hv30__img-panel--full">{heroImages.map((s,i)=><div key={i} className={`hv30__img ${i===heroSlide(29)?'active':''}`} style={{backgroundImage:`url(${s})`}}/>)}</div>
          <div className="hv30__brand hv30__brand--strip">
            <span className="hv30__brand-name"><span className="hv30__brand-w1">HQ</span> <span className="hv30__brand-w2">Aviation</span></span>
            <span className="hv30__brand-strip-sep"/>
            <span className="hv30__brand-tag">Est. 2010 · London · <img alt="UK" src="/assets/images/icons/Union Jack.svg" style={{width: '14px', height: 'auto', filter: 'grayscale(100%) contrast(1.2)', opacity: 0.7, display: 'inline-block', verticalAlign: 'middle', marginLeft: '4px'}} /></span>
          </div>
          <div className="hv30__thumbs">
            {heroImages.map((s,i) => (
              <button key={i} className={`hv30__thumb ${i===heroSlide(29)?'hv30__thumb--active':''}`} onClick={()=>setHeroSlide(29)(i)}>
                <img src={s} alt={`Slide ${i+1}`} />
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* ===== HERO VARIATION 31: Split Diagonal ===== */}
      <section className="hero-sec">
        <span className="hero-sec__label">Hero — V31: Split Diagonal</span>
        <div className="hv31">
          <div className="hv31__img-side">{heroImages.map((s,i)=><div key={i} className={`hv31__img ${i===heroSlide(30)?'active':''}`} style={{backgroundImage:`url(${s})`}}/>)}</div>
          <div className="hv31__clip"/>
          <div className="hv31__content">
            <span className="hv31__pre">{heroSlides[heroSlide(30)]?.pre}</span>
            <h1 className="hv31__headline">{heroSlides[heroSlide(30)]?.words.map((w,i)=><span key={i} className={`hv31__word hv31__word--${i+1}`}>{w} </span>)}</h1>
            <p className="hv31__desc">{heroSlides[heroSlide(30)]?.desc}</p>
            <Link to="/contact" className="hv31__cta">Discover More <span>→</span></Link>
          </div>
          <div className="hv31__dots">{heroSlides.map((_,i)=><button key={i} className={`hv31__dot ${i===heroSlide(30)?'active':''}`} onClick={()=>setHeroSlide(30)(i)}/>)}</div>
        </div>
      </section>

      {/* ===== HERO VARIATION 32: Vertical Ticker ===== */}
      <section className="hero-sec">
        <span className="hero-sec__label">Hero — V32: Vertical Ticker</span>
        <div className="hv32">
          <div className="hv32__bg">{heroImages.map((s,i)=><div key={i} className={`hv32__bg-img ${i===heroSlide(31)?'active':''}`} style={{backgroundImage:`url(${s})`}}/>)}</div>
          <div className="hv32__overlay"/>
          <div className="hv32__inner">
            <div className="hv32__left">
              <span className="hv32__brand">HQ Aviation</span>
              <div className="hv32__ticker">
                {heroSlides.map((slide,i)=>(
                  <div key={i} className={`hv32__ticker-item ${i===heroSlide(31)?'active':''}`}>
                    <h1 className="hv32__headline">{slide.words.join(' ')}</h1>
                    <p className="hv32__desc">{slide.desc}</p>
                  </div>
                ))}
              </div>
              <Link to="/contact" className="hv32__cta">Get Started <span>→</span></Link>
            </div>
            <div className="hv32__counter">
              <span className="hv32__num">{String(heroSlide(31)+1).padStart(2,'0')}</span>
              <span className="hv32__sep">/</span>
              <span className="hv32__total">{String(heroSlides.length).padStart(2,'0')}</span>
            </div>
          </div>
          <div className="hv32__nav">{heroSlides.map((_,i)=><button key={i} className={`hv32__nav-btn ${i===heroSlide(31)?'active':''}`} onClick={()=>setHeroSlide(31)(i)}/>)}</div>
        </div>
      </section>

      {/* ===== HERO VARIATION 33: Mosaic Grid ===== */}
      <section className="hero-sec">
        <span className="hero-sec__label">Hero — V33: Mosaic Grid</span>
        <div className="hv33">
          <div className="hv33__grid">
            {heroImages.slice(0,6).map((s,i)=>(
              <div key={i} className={`hv33__tile ${i===heroSlide(32)%6?'hv33__tile--active':''}`} style={{backgroundImage:`url(${s})`}} onClick={()=>setHeroSlide(32)(i)}/>
            ))}
          </div>
          <div className="hv33__content">
            <span className="hv33__pre">{heroSlides[heroSlide(32)]?.pre}</span>
            <h1 className="hv33__headline">{heroSlides[heroSlide(32)]?.words.map((w,i)=><span key={i} className={`hv33__word hv33__word--${i+1}`}>{w}</span>)}</h1>
            <p className="hv33__desc">{heroSlides[heroSlide(32)]?.desc}</p>
            <Link to="/contact" className="hv33__cta">Explore <span>→</span></Link>
          </div>
        </div>
      </section>

      {/* ===== HERO VARIATION 34: Cinematic Bars ===== */}
      <section className="hero-sec">
        <span className="hero-sec__label">Hero — V34: Cinematic Bars</span>
        <div className="hv34">
          <div className="hv34__bg">{heroImages.map((s,i)=><div key={i} className={`hv34__bg-img ${i===heroSlide(33)?'active':''}`} style={{backgroundImage:`url(${s})`}}/>)}</div>
          <div className="hv34__bar hv34__bar--top"/>
          <div className="hv34__bar hv34__bar--bottom"/>
          <div className="hv34__center">
            <span className="hv34__pre">{heroSlides[heroSlide(33)]?.pre}</span>
            <h1 className="hv34__headline">{heroSlides[heroSlide(33)]?.words.map((w,i)=><span key={i} className={`hv34__word hv34__word--${i+1}`}>{w} </span>)}</h1>
          </div>
          <div className="hv34__bottom">
            <p className="hv34__desc">{heroSlides[heroSlide(33)]?.desc}</p>
            <div className="hv34__dots">{heroSlides.map((_,i)=><button key={i} className={`hv34__dot ${i===heroSlide(33)?'active':''}`} onClick={()=>setHeroSlide(33)(i)}/>)}</div>
          </div>
        </div>
      </section>

      {/* ===== HERO VARIATION 35: Polaroid Stack ===== */}
      <section className="hero-sec">
        <span className="hero-sec__label">Hero — V35: Polaroid Stack</span>
        <div className="hv35">
          <div className="hv35__stack">
            {heroImages.slice(0,5).map((s,i)=>{
              const offset = i - heroSlide(34) % 5;
              return <div key={i} className={`hv35__polaroid ${i===heroSlide(34)%5?'hv35__polaroid--active':''}`} style={{backgroundImage:`url(${s})`, transform:`rotate(${offset*3}deg) translateX(${offset*15}px)`, zIndex: i===heroSlide(34)%5?10:5-Math.abs(offset)}} onClick={()=>setHeroSlide(34)(i)}/>;
            })}
          </div>
          <div className="hv35__text">
            <span className="hv35__pre">{heroSlides[heroSlide(34)]?.pre}</span>
            <h1 className="hv35__headline">{heroSlides[heroSlide(34)]?.words.map((w,i)=><span key={i} className={`hv35__word hv35__word--${i+1}`}>{w}</span>)}</h1>
            <p className="hv35__desc">{heroSlides[heroSlide(34)]?.desc}</p>
            <Link to="/contact" className="hv35__cta">Begin Your Journey <span>→</span></Link>
          </div>
        </div>
      </section>

      {/* ===== HERO VARIATION 36: Bold Overlap ===== */}
      <section className="hero-sec">
        <span className="hero-sec__label">Hero — V36: Bold Overlap</span>
        <div className="hv36">
          <div className="hv36__img-frame">{heroImages.map((s,i)=><div key={i} className={`hv36__img ${i===heroSlide(35)?'active':''}`} style={{backgroundImage:`url(${s})`}}/>)}</div>
          <div className="hv36__overlay-text">
            <h1 className="hv36__headline">{heroSlides[heroSlide(35)]?.words.map((w,i)=><span key={i} className={`hv36__word hv36__word--${i+1}`}>{w}</span>)}</h1>
          </div>
          <div className="hv36__info">
            <span className="hv36__pre">{heroSlides[heroSlide(35)]?.pre}</span>
            <p className="hv36__desc">{heroSlides[heroSlide(35)]?.desc}</p>
            <Link to="/contact" className="hv36__cta">Learn More <span>→</span></Link>
            <div className="hv36__dots">{heroSlides.map((_,i)=><button key={i} className={`hv36__dot ${i===heroSlide(35)?'active':''}`} onClick={()=>setHeroSlide(35)(i)}/>)}</div>
          </div>
        </div>
      </section>

      {/* ===== HERO VARIATION 37: Horizontal Scroll ===== */}
      <section className="hero-sec">
        <span className="hero-sec__label">Hero — V37: Horizontal Scroll</span>
        <div className="hv37">
          <div className="hv37__track">
            {heroImages.slice(0,8).map((s,i)=>(
              <div key={i} className={`hv37__card ${i===heroSlide(36)?'hv37__card--active':''}`} style={{backgroundImage:`url(${s})`}} onClick={()=>setHeroSlide(36)(i)}/>
            ))}
          </div>
          <div className="hv37__content">
            <span className="hv37__brand">HQ Aviation</span>
            <h1 className="hv37__headline">{heroSlides[heroSlide(36)]?.words.map((w,i)=><span key={i} className={`hv37__word hv37__word--${i+1}`}>{w} </span>)}</h1>
            <p className="hv37__desc">{heroSlides[heroSlide(36)]?.desc}</p>
          </div>
        </div>
      </section>

      {/* ===== HERO VARIATION 38: Vertical Split ===== */}
      <section className="hero-sec">
        <span className="hero-sec__label">Hero — V38: Vertical Split</span>
        <div className="hv38">
          <div className="hv38__left">
            <div className="hv38__img-wrap">{heroImages.map((s,i)=><div key={i} className={`hv38__img ${i===heroSlide(37)?'active':''}`} style={{backgroundImage:`url(${s})`}}/>)}</div>
          </div>
          <div className="hv38__right">
            <span className="hv38__brand">HQ Aviation</span>
            <span className="hv38__pre">{heroSlides[heroSlide(37)]?.pre}</span>
            <h1 className="hv38__headline">{heroSlides[heroSlide(37)]?.words.map((w,i)=><span key={i} className={`hv38__word hv38__word--${i+1}`}>{w}</span>)}</h1>
            <p className="hv38__desc">{heroSlides[heroSlide(37)]?.desc}</p>
            <Link to="/contact" className="hv38__cta">Get in Touch <span>→</span></Link>
            <div className="hv38__dots">{heroSlides.map((_,i)=><button key={i} className={`hv38__dot ${i===heroSlide(37)?'active':''}`} onClick={()=>setHeroSlide(37)(i)}/>)}</div>
          </div>
        </div>
      </section>

      {/* ===== HERO VARIATION 39: Window Pane ===== */}
      <section className="hero-sec">
        <span className="hero-sec__label">Hero — V39: Window Pane</span>
        <div className="hv39">
          <div className="hv39__panes">
            <div className="hv39__pane hv39__pane--large">{heroImages.map((s,i)=><div key={i} className={`hv39__img ${i===heroSlide(38)?'active':''}`} style={{backgroundImage:`url(${s})`}}/>)}</div>
            <div className="hv39__pane hv39__pane--small hv39__pane--tr">{heroImages.map((s,i)=><div key={i} className={`hv39__img ${i===(heroSlide(38)+1)%heroImages.length?'active':''}`} style={{backgroundImage:`url(${s})`}}/>)}</div>
            <div className="hv39__pane hv39__pane--small hv39__pane--br">{heroImages.map((s,i)=><div key={i} className={`hv39__img ${i===(heroSlide(38)+2)%heroImages.length?'active':''}`} style={{backgroundImage:`url(${s})`}}/>)}</div>
          </div>
          <div className="hv39__text">
            <span className="hv39__pre">{heroSlides[heroSlide(38)]?.pre}</span>
            <h1 className="hv39__headline">{heroSlides[heroSlide(38)]?.words.map((w,i)=><span key={i} className={`hv39__word hv39__word--${i+1}`}>{w} </span>)}</h1>
            <p className="hv39__desc">{heroSlides[heroSlide(38)]?.desc}</p>
            <div className="hv39__dots">{heroSlides.map((_,i)=><button key={i} className={`hv39__dot ${i===heroSlide(38)?'active':''}`} onClick={()=>setHeroSlide(38)(i)}/>)}</div>
          </div>
        </div>
      </section>

      {/* ===== HERO VARIATION 40: Minimal Edge ===== */}
      <section className="hero-sec">
        <span className="hero-sec__label">Hero — V40: Minimal Edge</span>
        <div className="hv40">
          <div className="hv40__bg">{heroImages.map((s,i)=><div key={i} className={`hv40__bg-img ${i===heroSlide(39)?'active':''}`} style={{backgroundImage:`url(${s})`}}/>)}</div>
          <div className="hv40__gradient"/>
          <div className="hv40__content">
            <div className="hv40__top">
              <span className="hv40__brand">HQ Aviation</span>
              <span className="hv40__tag">Est. 1985</span>
            </div>
            <div className="hv40__bottom">
              <h1 className="hv40__headline">{heroSlides[heroSlide(39)]?.words.map((w,i)=><span key={i} className={`hv40__word hv40__word--${i+1}`}>{w} </span>)}</h1>
              <div className="hv40__row">
                <p className="hv40__desc">{heroSlides[heroSlide(39)]?.desc}</p>
                <div className="hv40__nav">
                  <button onClick={()=>setHeroSlide(39)(p=>(p===0?heroSlides.length-1:p-1))}><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M15 18l-6-6 6-6"/></svg></button>
                  <span className="hv40__counter">{String(heroSlide(39)+1).padStart(2,'0')} / {String(heroSlides.length).padStart(2,'0')}</span>
                  <button onClick={()=>setHeroSlide(39)(p=>(p+1)%heroSlides.length)}><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M9 18l6-6-6-6"/></svg></button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ===== FOOTER ===== */}
      <FooterMinimal />


      <style>{`
        /* ===== BASE STYLES ===== */
        body {
          overflow-x: clip;
        }

        .final-draft {
          font-family: 'Space Grotesk', -apple-system, sans-serif;
          background: #faf9f6;
          color: #1a1a1a;
        }

        /* ===== HERO SECTION ===== */
        .fd-hero {
          position: relative;
          height: calc(400vh + 250px); /* 4 sections worth of scroll + 250px */
          overflow: hidden;
          background-color: var(--hq-background, #faf9f6);
          transition: none; /* No transition when expanding back */
        }

        .fd-hero--collapsed {
          height: calc(400vh + 250px - 80vh);
          background-color: #ffffff;
          transition: height 1.5s cubic-bezier(0.16, 1, 0.3, 1), background-color 1.5s ease;
        }

        .fd-hero--collapsed .fd-hero__image,
        .fd-hero--collapsed .fd-hero__grid,
        .fd-hero--collapsed .fd-hero__path-svg {
          pointer-events: none !important;
        }

        /* Hero Scroll Path */
        .fd-hero__path-svg {
          position: fixed;
          left: 0;
          width: 100%;
          height: 30vh;
          z-index: 0;
          pointer-events: none;
          opacity: 0.6;
          transition: opacity 0.5s ease;
        }

        .fd-hero__path-svg--top {
          top: 0;
        }

        .fd-hero__path-svg--bottom {
          bottom: 0;
        }

        .fd-hero__path-svg--hidden {
          opacity: 0;
        }

        /* Animated Grid Lines */
        .fd-hero__grid {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          height: 100vh;
          pointer-events: none;
          z-index: 1;
        }

        .fd-hero__line {
          position: absolute;
          background: #e8e6e2;
          transform: scaleY(0);
          transform-origin: top;
          transition: transform 1s cubic-bezier(0.16, 1, 0.3, 1);
        }

        .fd-hero__grid--visible .fd-hero__line {
          transform: scaleY(1);
        }

        .fd-hero__line--v1 { left: 5%; top: 0; bottom: 0; width: 1px; transition-delay: 0.1s; }
        .fd-hero__line--v2 { left: 28%; top: 0; bottom: 0; width: 1px; transition-delay: 0.2s; }
        .fd-hero__line--v3 { left: 72%; top: 0; bottom: 0; width: 1px; transition-delay: 0.3s; }
        .fd-hero__line--v4 { left: 95%; top: 0; bottom: 0; width: 1px; transition-delay: 0.4s; }

        .fd-hero__line--h1,
        .fd-hero__line--h2 {
          transform: scaleX(0);
          transform-origin: left;
        }

        .fd-hero__grid--visible .fd-hero__line--h1,
        .fd-hero__grid--visible .fd-hero__line--h2 {
          transform: scaleX(1);
        }

        .fd-hero__line--h1 { top: 15%; left: 0; right: 0; height: 1px; transition-delay: 0.5s; }
        .fd-hero__line--h2 { bottom: 15%; left: 0; right: 0; height: 1px; transition-delay: 0.6s; }

        .fd-hero__line--hidden {
          opacity: 0 !important;
          transition: opacity 0.5s ease !important;
        }

        /* Fixed Side Images */
        .fd-hero__image {
          position: fixed;
          top: 0;
          height: 100vh;
          width: 28%;
          z-index: 2;
          overflow: hidden;
          transition: transform 0.8s cubic-bezier(0.16, 1, 0.3, 1), opacity 1s ease;
        }

        .fd-hero__image--left {
          left: 0;
          transition-delay: 0.3s;
        }

        .fd-hero__image--right {
          right: 0;
          transition-delay: 0.4s;
        }

        .fd-hero__image img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }

        /* Cycling images */
        .fd-hero__cycle-img {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          object-fit: cover;
          opacity: 0;
          transition: opacity 0.8s ease-in-out;
        }

        .fd-hero__cycle-img--active {
          opacity: 1;
        }

        .fd-hero__image--expanded {
          transition: transform 0.8s cubic-bezier(0.16, 1, 0.3, 1);
        }

        /* Scrolling Content Container */
        .fd-hero__scroll-container {
          position: fixed;
          top: 0;
          left: 28%;
          right: 28%;
          height: 100vh;
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: center;
          z-index: 10;
          padding: 2rem;
          box-shadow: -15px 0 30px -10px rgba(0, 0, 0, 0.3), 15px 0 30px -10px rgba(0, 0, 0, 0.3);
          transition: opacity 0.5s ease;
        }

        .fd-hero--collapsed .fd-hero__scroll-container {
          pointer-events: none !important;
        }

        
        .fd-hero__section {
          position: absolute;
          display: flex;
          flex-direction: column;
          align-items: center;
          text-align: center;
          opacity: 0;
          transform: translateY(30px);
          transition: opacity 0.6s ease, transform 0.6s ease;
          pointer-events: none;
        }

        .fd-hero__section--active {
          opacity: 1;
          transform: translateY(0);
          pointer-events: auto;
        }

        /* Hidden states - elements fade out after hero section */
        .fd-hero__scroll-container--hidden,
        .fd-hero__scroll-prompt--hidden,
        .fd-hero__progress--hidden,
        .fd-hero__grid--hidden {
          opacity: 0;
          pointer-events: none !important;
          transition: opacity 0.5s ease;
        }

        .fd-hero__scroll-container--hidden .fd-hero__section--active {
          pointer-events: none;
        }

        /* Section with image - side by side layout */
        .fd-hero__section--with-image {
          flex-direction: row;
          align-items: center;
          gap: 3rem;
        }

        .fd-hero__section-text {
          display: flex;
          flex-direction: column;
          align-items: center;
          text-align: center;
        }

        
        .fd-hero__section--with-image .fd-hero__section-text {
          align-items: flex-start;
          text-align: left;
        }

        .fd-hero__section--with-image .fd-hero__headline {
          align-items: flex-start;
        }

        .fd-hero__section-image {
          width: 280px;
          height: 350px;
          border-radius: 8px;
          overflow: hidden;
          box-shadow: 0 20px 60px rgba(0, 0, 0, 0.2);
          flex-shrink: 0;
        }

        .fd-hero__section-image img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }

        /* Vertical Dividers */
        .fd-hero__divider {
          width: 1px;
          height: 40px;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .fd-hero__divider span {
          width: 1px;
          height: 100%;
          background: linear-gradient(to bottom, transparent, #c0bdb8, transparent);
        }

        .fd-hero__divider--top {
          margin-bottom: 2rem;
        }

        .fd-hero__divider--bottom {
          margin-top: 2rem;
        }

        .fd-hero__divider--hidden {
          opacity: 0;
          transition: opacity 0.5s ease;
        }

        /* Coordinates */
        .fd-hero__coords {
          display: flex;
          gap: 1.5rem;
          margin-bottom: 1.5rem;
          font-family: 'Share Tech Mono', monospace;
          font-size: 0.65rem;
          letter-spacing: 0.1em;
          color: #999;
        }

        /* Pre-text */
        .fd-hero__pre {
          font-size: 0.75rem;
          text-transform: uppercase;
          letter-spacing: 0.25em;
          color: #888;
          margin-bottom: 1rem;
        }

        /* Headline with varying colors */
        .fd-hero__headline {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 0.25rem;
          margin: 0 0 1.5rem;
        }

        .fd-hero__word {
          font-family: 'Space Grotesk', sans-serif;
          font-size: clamp(2.5rem, 6vw, 4.5rem);
          font-weight: 700;
          line-height: 1;
          text-transform: uppercase;
          letter-spacing: -0.02em;
          opacity: 0;
          transform: translateY(20px);
          animation: wordFadeIn 0.8s ease forwards;
          animation-delay: var(--delay, 0s);
          text-shadow:
            -8px -8px 0 #faf9f6,
            8px -8px 0 #faf9f6,
            -8px 8px 0 #faf9f6,
            8px 8px 0 #faf9f6,
            0 -8px 0 #faf9f6,
            0 8px 0 #faf9f6,
            -8px 0 0 #faf9f6,
            8px 0 0 #faf9f6,
            -6px -6px 0 #faf9f6,
            6px -6px 0 #faf9f6,
            -6px 6px 0 #faf9f6,
            6px 6px 0 #faf9f6,
            -4px -4px 0 #faf9f6,
            4px -4px 0 #faf9f6,
            -4px 4px 0 #faf9f6,
            4px 4px 0 #faf9f6;
        }

        /* Varying colors for luxury feel */
        .fd-hero__word--1 {
          color: #1a1a1a;
        }

        .fd-hero__word--2 {
          color: #4a4a4a;
        }

        .fd-hero__word--3 {
          color: #7a7a7a;
        }

        @keyframes wordFadeIn {
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        /* Description */
        .fd-hero__desc {
          font-size: 1rem;
          color: #666;
          max-width: 300px;
          line-height: 1.6;
          text-shadow:
            -4px -4px 0 #faf9f6,
            4px -4px 0 #faf9f6,
            -4px 4px 0 #faf9f6,
            4px 4px 0 #faf9f6,
            0 -4px 0 #faf9f6,
            0 4px 0 #faf9f6,
            -4px 0 0 #faf9f6,
            4px 0 0 #faf9f6;
        }

        /* Scroll Prompt */
        .fd-hero__scroll-prompt {
          position: fixed;
          bottom: 0.5rem;
          left: 50%;
          transform: translateX(-50%);
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 1rem;
          z-index: 20;
        }

        .fd-hero__scroll-text {
          font-size: 0.65rem;
          text-transform: uppercase;
          letter-spacing: 0.2em;
          color: #999;
        }

        .fd-hero__scroll-line {
          width: 1px;
          height: 50px;
          background: rgba(0,0,0,0.1);
          position: relative;
          overflow: hidden;
        }

        .fd-hero__scroll-line span {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 30%;
          background: #1a1a1a;
          animation: scrollLineMove 2s ease-in-out infinite;
        }

        @keyframes scrollLineMove {
          0% { top: -30%; }
          100% { top: 100%; }
        }

        /* Progress Indicator */
        .fd-hero__progress {
          position: fixed;
          right: 3rem;
          top: 50%;
          transform: translateY(-50%);
          display: flex;
          flex-direction: column;
          gap: 0.75rem;
          z-index: 20;
        }

        .fd-hero__progress-dot {
          width: 8px;
          height: 8px;
          border: 1px solid #ccc;
          border-radius: 50%;
          transition: all 0.3s ease;
        }

        .fd-hero__progress-dot--active {
          background: #1a1a1a;
          border-color: #1a1a1a;
        }

        /* ===== ABOUT SECTION ===== */
        .fd-about {
          min-height: 100vh;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 0 2rem 6rem 2rem;
          background: #fff;
          position: relative;
          overflow: visible;
        }

        .fd-about__content {
          max-width: 800px;
          text-align: center;
        }

        .fd-about__label {
          position: sticky;
          top: 2.5rem;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 1.5rem;
          font-size: 0.7rem;
          text-transform: uppercase;
          letter-spacing: 0.2em;
          color: #999;
          margin-top: 20px;
          margin-bottom: 100px;
          padding: 1rem 0;
          background: transparent;
          z-index: 50;
          opacity: 0;
          transition: opacity 0.3s ease, top 0.3s ease;
        }

        .fd-about__label--visible {
          opacity: 1;
        }

        .fd-about__label--static {
          top: -50px;
          opacity: 0;
        }

        .fd-about__label-line {
          width: 60px;
          height: 1px;
          background: var(--hq-border, #e8e6e2);
        }

        .fd-about__headline {
          display: flex;
          flex-direction: column;
          gap: 0.25rem;
          margin: 0 0 3rem;
        }

        .fd-about__headline span {
          font-family: 'Space Grotesk', sans-serif;
          font-size: clamp(2rem, 5vw, 3.5rem);
          font-weight: 700;
          line-height: 1.1;
          text-transform: uppercase;
        }

        .fd-about__headline span:nth-child(1) { color: #1a1a1a; }
        .fd-about__headline span:nth-child(2) { color: #4a4a4a; }
        .fd-about__headline span:nth-child(3) { color: #7a7a7a; }

        .fd-about__headline--single-line {
          flex-direction: row;
          flex-wrap: wrap;
          gap: 0.5rem;
          justify-content: center;
        }

        .fd-about__video {
          margin-bottom: 3rem;
          position: relative;
          z-index: 1;
        }

        .fd-about__video-lines {
          position: absolute;
          top: 55%;
          left: 0;
          width: 100%;
          display: flex;
          flex-direction: column;
          gap: 30px;
          z-index: 0;
          pointer-events: none;
        }

        .fd-about__line {
          height: 1px;
          width: 100%;
          background: #ccc;
          transform: scaleX(0);
          transform-origin: center;
          transition: transform 1.2s ease-out;
        }

        .fd-about__video-lines.visible .fd-about__line {
          transform: scaleX(1);
        }

        .fd-about__video-lines.visible .fd-about__line--1 {
          transition-delay: 0.15s;
        }

        .fd-about__video-lines.visible .fd-about__line--2 {
          transition-delay: 0s;
        }

        .fd-about__video-lines.visible .fd-about__line--3 {
          transition-delay: 0.15s;
        }

        
        .fd-about__video-placeholder {
          position: relative;
          aspect-ratio: 16/9;
          background: #f0f0f0;
          overflow: hidden;
          z-index: 1;
          box-shadow: -20px 0 40px -10px rgba(0, 0, 0, 0.15), 20px 0 40px -10px rgba(0, 0, 0, 0.15);
        }

        .fd-about__video-placeholder img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }

        .fd-about__video-overlay {
          position: absolute;
          inset: 0;
          background: rgba(0,0,0,0.4);
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          gap: 1rem;
        }

        
        .fd-about__play-btn {
          width: 80px;
          height: 80px;
          border: 2px solid #fff;
          border-radius: 50%;
          background: transparent;
          cursor: pointer;
          position: relative;
          transition: all 0.3s ease;
        }

        .fd-about__play-btn span {
          position: absolute;
          top: 50%;
          left: 55%;
          transform: translate(-50%, -50%);
          width: 0;
          height: 0;
          border-left: 16px solid #fff;
          border-top: 10px solid transparent;
          border-bottom: 10px solid transparent;
        }

        .fd-about__play-btn:hover {
          background: rgba(255,255,255,0.1);
          transform: scale(1.05);
        }

        .fd-about__video-label {
          font-size: 0.7rem;
          text-transform: uppercase;
          letter-spacing: 0.15em;
          color: #fff;
        }

        .fd-about__text {
          font-size: 1.1rem;
          line-height: 1.8;
          color: #666;
          margin-bottom: 2rem;
        }

        /* --- About split layout: text left, Why We Fly card right --- */
        .fd-about__split {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 4rem;
          align-items: start;
          max-width: 1100px;
          width: 100%;
          text-align: left;
        }

        .fd-about__split-left {
          display: flex;
          flex-direction: column;
          justify-content: center;
          padding-top: 1rem;
        }

        .fd-about__split-left .fd-about__text {
          margin-bottom: 2rem;
        }

        .fd-about__split-right {
          width: 100%;
        }

        /* Why We Fly card */
        .fd-about__wf-card {
          border: 1px solid #e8e6e2;
          border-radius: 8px;
          overflow: hidden;
          background: #faf9f6;
        }

        .fd-about__wf-header {
          padding: 0.85rem 1.25rem;
          border-bottom: 1px solid #e8e6e2;
        }

        .fd-about__wf-trigger-title {
          font-size: 0.72rem;
          font-weight: 600;
          color: #1a1a1a;
          text-transform: uppercase;
          letter-spacing: 0.08em;
        }

        .fd-about__wf-img {
          position: relative;
          width: 100%;
          height: 180px;
          background: #2a2a2a;
          overflow: hidden;
        }

        .fd-about__wf-slide {
          position: absolute;
          inset: 0;
          background-size: cover;
          background-position: center;
          opacity: 0;
          transition: opacity 0.5s ease;
        }

        .fd-about__wf-slide.active {
          opacity: 1;
        }

        .fd-about__wf-body {
          padding: 1.5rem 1.25rem;
        }

        .fd-about__wf-body h3 {
          font-size: clamp(1.1rem, 2vw, 1.3rem);
          font-weight: 700;
          margin: 0 0 0.75rem;
          text-transform: uppercase;
          letter-spacing: -0.01em;
          line-height: 1.2;
        }

        .fd-about__wf-verb {
          color: #1a1a1a;
        }

        .fd-about__wf-noun {
          color: #5a5a5a;
        }

        .fd-about__wf-body p {
          font-size: 0.85rem;
          color: #666;
          line-height: 1.7;
          margin: 0;
        }

        .fd-about__wf-footer {
          padding: 1rem 1.25rem;
          border-top: 1px solid rgba(26, 26, 26, 0.06);
          display: flex;
          align-items: center;
          justify-content: space-between;
        }

        .fd-about__wf-dots {
          display: flex;
          align-items: center;
          gap: 4px;
        }

        .fd-about__wf-dot {
          width: 4px;
          height: 4px;
          background: rgba(26, 26, 26, 0.15);
          border-radius: 2px;
          transition: all 0.25s ease;
          cursor: pointer;
        }

        .fd-about__wf-dot:hover {
          background: rgba(26, 26, 26, 0.4);
        }

        .fd-about__wf-dot.active {
          width: 16px;
          background: #1a1a1a;
        }

        .fd-about__wf-counter {
          font-family: 'Share Tech Mono', monospace;
          font-size: 0.55rem;
          color: rgba(26, 26, 26, 0.35);
          letter-spacing: 0.1em;
          margin-left: 0.75rem;
        }

        .fd-about__wf-arrows {
          display: flex;
          gap: 0.5rem;
        }

        .fd-about__wf-arrows button {
          width: 32px;
          height: 32px;
          display: flex;
          align-items: center;
          justify-content: center;
          background: transparent;
          border: 1px solid rgba(26, 26, 26, 0.15);
          border-radius: 6px;
          cursor: pointer;
          color: rgba(26, 26, 26, 0.4);
          transition: all 0.25s ease;
        }

        .fd-about__wf-arrows button:hover {
          background: #1a1a1a;
          border-color: #1a1a1a;
          color: #fff;
        }

        @media (max-width: 768px) {
          .fd-about__split {
            grid-template-columns: 1fr;
            gap: 2rem;
          }
        }

        .fd-about__btn {
          display: inline-flex;
          align-items: center;
          gap: 0.75rem;
          padding: 1rem 2rem;
          background: #1a1a1a;
          color: #fff;
          font-size: 0.75rem;
          text-transform: uppercase;
          letter-spacing: 0.1em;
          text-decoration: none;
          transition: all 0.3s ease;
        }

        .fd-about__btn:hover {
          background: #333;
        }

        /* ===== HORIZONTAL ACCORDION NAV ===== */
        .fd-nav {
          position: relative;
          z-index: 100;
          background: #fff;
          border-top: 1px solid #e8e6e2;
          border-bottom: 1px solid #e8e6e2;
          padding: 0;
          transition: top 0.3s ease;
        }

        .fd-nav--fixed {
          position: fixed;
          top: 49px;
          left: 0;
          right: 0;
        }

        .fd-nav--fixed.fd-nav--compact {
          top: 20px;
        }

        .fd-nav__header {
          display: flex;
          align-items: center;
          gap: 1rem;
          padding: 0.5rem 2rem;
          border-bottom: 1px solid #e8e6e2;
        }

        .fd-nav__header span:nth-child(2) {
          font-size: 0.7rem;
          text-transform: uppercase;
          letter-spacing: 0.2em;
          color: #999;
          flex-shrink: 0;
        }

        .fd-nav__line {
          flex: 1;
          height: 1px;
          background: #e8e6e2;
        }

        .fd-nav__accordion {
          display: flex;
        }

        .fd-nav__item {
          flex: 1;
          display: flex;
          flex-direction: row;
          align-items: center;
          justify-content: center;
          gap: 0.5rem;
          padding: 0.75rem 1rem;
          background: transparent;
          border: none;
          border-right: 1px solid #e8e6e2;
          cursor: pointer;
          transition: all 0.3s ease;
        }

        .fd-nav__item:last-child {
          border-right: none;
        }

        .fd-nav__item:hover {
          background: #f5f5f2;
        }

        .fd-nav__item--active {
          background: #e8e6e2;
        }

        .fd-nav__item--active .fd-nav__item-icon {
          color: #666;
        }

        .fd-nav__item--active .fd-nav__item-label {
          color: #1a1a1a;
        }

        .fd-nav__item--active:hover {
          background: #ddd;
        }

        .fd-nav__item-icon {
          font-family: 'Share Tech Mono', monospace;
          font-size: 0.65rem;
          color: #999;
        }

        .fd-nav__item-label {
          font-size: 0.75rem;
          font-weight: 500;
          text-transform: uppercase;
          letter-spacing: 0.1em;
          color: #1a1a1a;
        }

        /* ===== CONTENT SECTIONS ===== */
        .fd-section {
          min-height: 60vh;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 6rem 2rem;
          background: #faf9f6;
        }

        .fd-section--alt {
          background: #fff;
        }

        .fd-section--with-carousel {
          flex-direction: column;
          align-items: stretch;
          gap: 0;
          padding-top: 0;
          padding-bottom: 0;
          padding-left: 0;
          padding-right: 0;
        }

        .fd-section__inner {
          max-width: 600px;
          text-align: center;
        }

        .fd-section__badge {
          margin-bottom: 1.5rem;
        }

        .fd-section__badge-logo {
          height: 60px;
          width: auto;
          opacity: 0.9;
          transition: opacity 0.3s ease;
        }

        .fd-section__badge-logo:hover {
          opacity: 1;
        }

        .fd-section__number {
          display: block;
          font-family: 'Share Tech Mono', monospace;
          font-size: 0.7rem;
          color: #999;
          margin-bottom: 1rem;
        }

        .fd-section__title {
          font-family: 'Space Grotesk', sans-serif;
          font-size: clamp(2rem, 4vw, 3rem);
          font-weight: 700;
          text-transform: uppercase;
          margin: 0 0 1.5rem;
          color: #1a1a1a;
        }

        .fd-section__text {
          font-size: 1.1rem;
          line-height: 1.8;
          color: #666;
          margin-bottom: 2rem;
        }

        .fd-section__link {
          font-size: 0.75rem;
          text-transform: uppercase;
          letter-spacing: 0.1em;
          color: #1a1a1a;
          text-decoration: none;
          border-bottom: 1px solid #ccc;
          padding-bottom: 0.25rem;
          transition: all 0.3s ease;
        }

        .fd-section__link:hover {
          border-color: #1a1a1a;
        }

        /* ===== TRAINING HEADER ===== */
        .fd-training-header {
          text-align: center;
          padding: 4rem 2rem 3rem;
          background: #fff;
          box-shadow: -15px 0 30px -10px rgba(0, 0, 0, 0.1), 15px 0 30px -10px rgba(0, 0, 0, 0.1), 0 15px 30px -10px rgba(0, 0, 0, 0.1);
          position: relative;
          left: 50%;
          right: 50%;
          width: 100vw;
          margin-left: -50vw;
          margin-right: -50vw;
          box-sizing: border-box;
          z-index: 10;
        }

        .fd-training-header__divider {
          width: 60px;
          height: 1px;
          background: #e8e6e2;
          margin: 0 auto 2rem;
        }

        .fd-training-header__title {
          font-family: 'Space Grotesk', sans-serif;
          font-size: clamp(1.5rem, 4vw, 2.5rem);
          font-weight: 700;
          text-transform: uppercase;
          margin: 0 0 1rem;
          color: #1a1a1a;
        }

        .fd-training-header__text {
          font-size: 1.1rem;
          line-height: 1.7;
          color: #666;
          max-width: 600px;
          margin: 0 auto;
        }

        /* ===== SCROLL PATH WRAPPER ===== */
        .fd-scroll-path-wrapper {
          width: 100%;
          box-sizing: border-box;
          background: var(--hq-background, #faf9f6);
          position: relative;
        }

        .fd-scroll-path-wrapper .scroll-path-section {
          width: 100%;
          margin-left: 0;
          margin-right: 0;
        }

        /* ===== SECTION DIVIDER ===== */
        .fd-section-divider {
          width: 80px;
          height: 1px;
          background: #e0e0e0;
          margin: 0 auto 2.5rem;
        }

        /* ===== CAROUSEL SECTION ===== */
        .fd-carousel-section {
          padding: 0 2rem 3rem;
          background: #faf9f6;
          width: 100vw;
          margin-left: -50vw;
          margin-right: -50vw;
          left: 50%;
          right: 50%;
          box-sizing: border-box;
          position: relative;
          z-index: 10;
          border-bottom: 1px solid rgba(0,0,0,0.12);
        }

        .fd-carousel-section__header {
          text-align: center;
          margin-bottom: 3rem;
        }

        .fd-carousel-section__label {
          display: inline-block;
          font-size: 0.7rem;
          text-transform: uppercase;
          letter-spacing: 0.2em;
          color: #999;
          margin-bottom: 1rem;
        }

        .fd-carousel-section__divider {
          width: 60px;
          height: 1px;
          background: #e8e6e2;
          margin: 0 auto 3rem;
        }

        .fd-carousel-section__title {
          font-family: 'Space Grotesk', sans-serif;
          font-size: clamp(1.5rem, 4vw, 2.5rem);
          font-weight: 700;
          text-transform: uppercase;
          margin: 0;
          color: #1a1a1a;
        }

        .fd-carousel-title {
          font-family: 'Space Grotesk', sans-serif;
          font-size: clamp(1.25rem, 3vw, 1.75rem);
          font-weight: 600;
          text-transform: uppercase;
          letter-spacing: 0.05em;
          text-align: center;
          margin: 0 0 2rem;
          color: #1a1a1a;
        }

        /* ===== V97 CAROUSEL - MINIMAL WHITE + OUTLINE ===== */
        .carousel--97 { max-width: 1000px; margin: 0 auto; background: #fff; padding: 2rem; border-radius: 16px; border: 1px solid #e5e7eb; box-shadow: 0 4px 24px rgba(0,0,0,0.08); }
        .carousel--97 .carousel__tabs-wrapper { position: relative; margin-bottom: 2rem; }
        .carousel--97 .carousel__tabs-wrapper::before, .carousel--97 .carousel__tabs-wrapper::after { content: ''; position: absolute; top: 0; bottom: 0; width: 40px; pointer-events: none; z-index: 1; }
        .carousel--97 .carousel__tabs-wrapper::before { left: 0; background: linear-gradient(to right, #fff, transparent); }
        .carousel--97 .carousel__tabs-wrapper::after { right: 0; background: linear-gradient(to left, #fff, transparent); }
        .carousel--97 .carousel__tabs { display: flex; gap: 0.5rem; border-bottom: 1px solid #e5e7eb; padding-bottom: 0.75rem; overflow-x: auto; scrollbar-width: none; }
        .carousel--97 .carousel__tabs::-webkit-scrollbar { display: none; }
        .carousel--97 .carousel__tab { display: flex; align-items: center; gap: 0.5rem; padding: 0.5rem 0.75rem; background: none; border: none; cursor: pointer; }
        .carousel--97 .carousel__tab-num { font-family: 'Share Tech Mono', monospace; font-size: 0.85rem; font-weight: 600; color: #d1d5db; }
        .carousel--97 .carousel__tab-title { font-size: 0.75rem; font-weight: 600; text-transform: uppercase; letter-spacing: 0.05em; color: #9ca3af; white-space: nowrap; }
        .carousel--97 .carousel__tab.active { border-bottom: 1px solid #111827; margin-bottom: -0.75rem; padding-bottom: calc(0.5rem + 0.75rem - 1px); }
        .carousel--97 .carousel__tab.active .carousel__tab-title { color: #111827; }
        .carousel--97 .carousel__body { display: flex; align-items: center; gap: 1.5rem; }
        .carousel--97 .carousel__arrow { padding: 0.75rem 1rem; border: none; background: transparent; cursor: pointer; color: #d1d5db; transition: all 0.3s ease; }
        .carousel--97 .carousel__arrow:hover { color: #111827; }
        .carousel--97 .carousel__main { flex: 1; display: grid; grid-template-columns: 1fr auto 1fr; gap: 2rem; align-items: stretch; }
        .carousel--97 .carousel__image { position: relative; border-radius: 8px; overflow: hidden; border: 1px solid #e5e7eb; min-height: 280px; }
        .carousel--97 .carousel__image img { position: absolute; inset: 0; width: 100%; height: 100%; object-fit: cover; opacity: 0; transition: opacity 0.5s ease; }
        .carousel--97 .carousel__image img.active { opacity: 1; }
        .carousel--97 .carousel__divider { width: 1px; height: 120px; background: #e5e7eb; align-self: center; }
        .carousel--97 .carousel__content { display: flex; align-items: center; }
        .carousel--97 .carousel__title-row { display: flex; flex-direction: column; align-items: center; margin-bottom: 0.75rem; }
        .carousel--97 .carousel__number-wrapper { display: flex; align-items: center; gap: 1rem; margin-bottom: 0.5rem; }
        .carousel--97 .carousel__number-wrapper::before, .carousel--97 .carousel__number-wrapper::after { content: ''; width: 30px; height: 1px; background: #e5e7eb; }
        .carousel--97 .carousel__inline-number { font-family: 'Share Tech Mono', monospace; font-size: 2.5rem; font-weight: 300; color: #d1d5db; line-height: 1; }
        .carousel--97 .carousel__text-content { position: relative; display: grid; background: transparent; border-radius: 12px; padding: 1.5rem; border: 1px solid #e5e7eb; }
        .carousel--97 .carousel__slide-content { grid-area: 1 / 1; opacity: 0; pointer-events: none; display: flex; flex-direction: column; height: 100%; }
        .carousel--97 .carousel__slide-content.active { opacity: 1; pointer-events: auto; }
        .carousel--97 .carousel__slide-content .carousel__btn { margin-top: auto; }
        .carousel--97 .carousel__content h3 { font-size: 1.25rem; font-weight: 500; margin: 0; text-transform: uppercase; text-align: center; color: #111827; letter-spacing: 0.1em; }
        .carousel--97 .carousel__content p { color: #6b7280; line-height: 1.7; margin: 0; padding: 10px 0 20px; font-size: 0.95rem; text-align: center; }
        .carousel--97 .carousel__btn { position: relative; display: flex; align-items: center; justify-content: space-between; width: 100%; padding: 0.75rem 1.5rem; background: transparent; color: #111827; text-decoration: none; font-size: 0.75rem; text-transform: uppercase; letter-spacing: 0.1em; overflow: hidden; transition: all 0.4s ease; border: 1px solid #111827; border-radius: 8px; }
        .carousel--97 .carousel__btn::before { content: ''; position: absolute; top: 0; left: 0; width: 0; height: 100%; background: #111827; transition: width 0.4s ease; z-index: 0; border-radius: 8px; }
        .carousel--97 .carousel__btn:hover::before { width: 100%; }
        .carousel--97 .carousel__btn:hover { color: #fff; }
        .carousel--97 .carousel__btn span, .carousel--97 .carousel__btn-chevron { position: relative; z-index: 1; }
        .carousel--97 .carousel__progress { height: 1px; background: #e5e7eb; margin-top: 2rem; overflow: hidden; }
        .carousel--97 .carousel__progress-bar { height: 100%; background: #111827; transition: width 0.4s ease; }

        /* V97 Carousel Responsive */
        @media (max-width: 768px) {
          .carousel--97 { max-height: 800px; }
        }

        /* ===== FLEET SECTION (Self-Fly Hire) ===== */
        .fd-fleet {
          background: #faf9f6;
          padding: 0;
        }

        .fd-fleet__intro {
          text-align: center;
          padding: 5rem 2rem 3rem;
          max-width: 800px;
          margin: 0 auto;
        }

        .fd-fleet__pre-title {
          display: block;
          font-size: 0.75rem;
          text-transform: uppercase;
          letter-spacing: 0.3em;
          color: #888;
          margin-bottom: 1rem;
        }

        .fd-fleet__title {
          margin: 0 0 1.5rem;
        }

        .fd-fleet__title-line {
          display: block;
          font-family: 'Space Grotesk', sans-serif;
          font-size: clamp(2.5rem, 5vw, 4rem);
          font-weight: 700;
          text-transform: uppercase;
          line-height: 1;
          letter-spacing: -0.02em;
        }

        .fd-fleet__title-line--1 { color: #1a1a1a; }
        .fd-fleet__title-line--2 { color: #4a4a4a; }

        .fd-fleet__tagline {
          font-size: 1.1rem;
          color: #666;
          font-weight: 400;
        }

        /* Time Comparison Grid */
        .fd-fleet__time-grid {
          background: #1a1a1a;
          padding: 1.25rem 1.5rem;
        }

        .fd-fleet__time-header {
          max-width: 1100px;
          margin: 0 auto 0.75rem;
          display: flex;
          justify-content: space-between;
          align-items: center;
          flex-wrap: wrap;
          gap: 0.5rem;
        }

        .fd-fleet__time-label {
          font-family: 'Space Grotesk', sans-serif;
          font-size: 0.65rem;
          text-transform: uppercase;
          letter-spacing: 0.15em;
          color: rgba(255,255,255,0.5);
        }

        .fd-fleet__time-legend {
          display: flex;
          align-items: center;
          gap: 0.75rem;
        }

        .fd-fleet__legend-item {
          display: flex;
          align-items: center;
          gap: 0.35rem;
          font-size: 0.65rem;
          color: rgba(255,255,255,0.7);
        }

        .fd-fleet__legend-icon { font-size: 0.85rem; }
        .fd-fleet__legend-icon--heli { width: 16px; height: auto; filter: brightness(0) invert(1); opacity: 0.7; }
        .fd-fleet__legend-divider { color: rgba(255,255,255,0.3); }

        .fd-fleet__destinations {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 0.6rem;
          max-width: 1100px;
          margin: 0 auto;
        }

        .fd-fleet__dest-card {
          border-radius: 8px;
          overflow: hidden;
          transition: transform 0.3s ease, box-shadow 0.3s ease;
        }

        .fd-fleet__dest-card:hover {
          transform: translateY(-4px);
          box-shadow: 0 12px 24px rgba(0,0,0,0.15);
        }

        .fd-fleet__dest-image {
          position: relative;
          aspect-ratio: 4/3;
          overflow: hidden;
        }

        .fd-fleet__dest-image img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          transition: transform 0.5s ease;
        }

        .fd-fleet__dest-card:hover .fd-fleet__dest-image img {
          transform: scale(1.08);
        }

        .fd-fleet__dest-overlay {
          position: absolute;
          inset: 0;
          background: linear-gradient(to top, rgba(0,0,0,0.5) 0%, rgba(0,0,0,0.1) 40%, transparent 100%);
        }

        .fd-fleet__dest-time-badge {
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          background: rgba(255,255,255,0.95);
          padding: 0.5rem 1rem;
          border-radius: 4px;
          box-shadow: 0 4px 12px rgba(0,0,0,0.2);
        }

        .fd-fleet__dest-time-value {
          font-family: 'Share Tech Mono', monospace;
          font-size: 1.1rem;
          font-weight: 600;
          color: #1a1a1a;
          letter-spacing: 0.02em;
        }

        .fd-fleet__dest-label {
          padding: 0.75rem;
          background: #1a1a1a;
          text-align: center;
        }

        .fd-fleet__dest-name {
          display: block;
          font-family: 'Space Grotesk', sans-serif;
          font-size: 0.85rem;
          font-weight: 600;
          color: #fff;
          text-transform: uppercase;
          letter-spacing: 0.05em;
        }

        .fd-fleet__time-row {
          display: flex;
          align-items: center;
          gap: 0.4rem;
          padding: 0.2rem 0;
        }

        .fd-fleet__time-row--car {
          border-bottom: 1px solid rgba(255,255,255,0.1);
          padding-bottom: 0.3rem;
        }

        .fd-fleet__time-icon {
          font-size: 0.75rem;
          width: 16px;
          text-align: center;
        }

        .fd-fleet__time-icon--heli {
          width: 16px;
          height: auto;
          filter: brightness(0) invert(1);
        }

        .fd-fleet__time-value {
          font-family: 'Share Tech Mono', monospace;
          font-size: 0.7rem;
          color: rgba(255,255,255,0.6);
        }

        .fd-fleet__time-value--highlight {
          color: #4ade80;
          font-weight: 700;
          font-size: 0.75rem;
        }

        .fd-fleet__time-note {
          font-size: 0.5rem;
          color: rgba(255,255,255,0.3);
          margin-left: auto;
        }

        .fd-fleet__time-saved {
          font-size: 0.5rem;
          color: #4ade80;
          background: rgba(74, 222, 128, 0.15);
          padding: 0.1rem 0.35rem;
          border-radius: 8px;
          margin-left: auto;
        }

        /* Benefits Strip */
        .fd-fleet__benefits {
          display: flex;
          justify-content: center;
          align-items: center;
          gap: 3rem;
          padding: 3rem 2rem;
          background: #fff;
          border-bottom: 1px solid #e8e6e2;
        }

        .fd-fleet__benefit {
          display: flex;
          flex-direction: column;
          align-items: center;
          text-align: center;
          gap: 0.5rem;
        }

        .fd-fleet__benefit-icon {
          width: 32px;
          height: 32px;
          color: #1a1a1a;
        }

        .fd-fleet__benefit-icon svg {
          width: 100%;
          height: 100%;
        }

        .fd-fleet__benefit-stat {
          font-family: 'Share Tech Mono', monospace;
          font-size: 1.5rem;
          font-weight: 700;
          color: #1a1a1a;
        }

        .fd-fleet__benefit-label {
          font-size: 0.65rem;
          text-transform: uppercase;
          letter-spacing: 0.1em;
          color: #888;
        }

        .fd-fleet__benefit-divider {
          width: 1px;
          height: 50px;
          background: linear-gradient(to bottom, transparent, #e8e6e2, transparent);
        }

        /* Aircraft Showcase */
        .fd-fleet__aircraft {
          padding: 4rem 2rem;
          background: #faf9f6;
        }

        .fd-fleet__aircraft-label {
          display: block;
          font-size: 0.7rem;
          text-transform: uppercase;
          letter-spacing: 0.25em;
          color: #999;
          text-align: center;
          margin-bottom: 2rem;
        }

        .fd-fleet__aircraft-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 1.5rem;
          max-width: 1000px;
          margin: 0 auto;
        }

        .fd-fleet__aircraft-card {
          position: relative;
          background: #fff;
          border: 1px solid #e8e6e2;
          padding: 2rem;
          text-decoration: none;
          color: inherit;
          transition: all 0.3s ease;
          text-align: center;
        }

        .fd-fleet__aircraft-card:hover {
          border-color: #1a1a1a;
          transform: translateY(-4px);
          box-shadow: 0 12px 30px rgba(0,0,0,0.1);
        }

        .fd-fleet__aircraft-card--featured {
          border-color: #1a1a1a;
          box-shadow: 0 8px 24px rgba(0,0,0,0.08);
        }

        .fd-fleet__aircraft-badge {
          position: absolute;
          top: 1rem;
          right: 1rem;
          font-size: 0.55rem;
          text-transform: uppercase;
          letter-spacing: 0.05em;
          background: #1a1a1a;
          color: #fff;
          padding: 0.25rem 0.5rem;
        }

        .fd-fleet__aircraft-image {
          height: 120px;
          display: flex;
          align-items: center;
          justify-content: center;
          margin-bottom: 1rem;
        }

        .fd-fleet__aircraft-image img {
          max-width: 100%;
          max-height: 100%;
          object-fit: contain;
        }

        .fd-fleet__aircraft-info h4 {
          font-family: 'Space Grotesk', sans-serif;
          font-size: 1.25rem;
          font-weight: 700;
          text-transform: uppercase;
          margin: 0 0 0.5rem;
          color: #1a1a1a;
        }

        .fd-fleet__aircraft-seats {
          display: block;
          font-size: 0.75rem;
          color: #666;
          margin-bottom: 0.5rem;
        }

        .fd-fleet__aircraft-rate {
          font-family: 'Share Tech Mono', monospace;
          font-size: 0.85rem;
          color: #1a1a1a;
          font-weight: 600;
        }

        /* Lifestyle Quote */
        .fd-fleet__lifestyle {
          padding: 4rem 2rem;
          background: linear-gradient(135deg, #1a1a1a 0%, #2d2d2d 100%);
          text-align: center;
        }

        .fd-fleet__quote {
          font-family: 'Space Grotesk', sans-serif;
          font-size: clamp(1.25rem, 2.5vw, 1.75rem);
          font-weight: 400;
          font-style: italic;
          color: #fff;
          max-width: 800px;
          margin: 0 auto 1.5rem;
          line-height: 1.6;
        }

        .fd-fleet__quote-attr {
          font-size: 0.75rem;
          text-transform: uppercase;
          letter-spacing: 0.2em;
          color: rgba(255,255,255,0.5);
        }

        /* Fleet CTA */
        .fd-fleet__cta {
          display: flex;
          justify-content: center;
          gap: 1rem;
          padding: 3rem 2rem;
          background: #faf9f6;
        }

        .fd-fleet__btn {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          padding: 1rem 2rem;
          font-size: 0.75rem;
          font-weight: 500;
          text-transform: uppercase;
          letter-spacing: 0.1em;
          text-decoration: none;
          transition: all 0.3s ease;
        }

        .fd-fleet__btn--primary {
          background: #1a1a1a;
          color: #fff;
          border: 1px solid #1a1a1a;
        }

        .fd-fleet__btn--primary:hover {
          background: #333;
        }

        .fd-fleet__btn--outline {
          background: transparent;
          color: #1a1a1a;
          border: 1px solid #1a1a1a;
        }

        .fd-fleet__btn--outline:hover {
          background: #1a1a1a;
          color: #fff;
        }

        /* Fleet Responsive */
        @media (max-width: 1024px) {
          .fd-fleet__destinations {
            grid-template-columns: repeat(2, 1fr);
          }
        }

        @media (max-width: 768px) {
          .fd-fleet__destinations {
            grid-template-columns: 1fr;
            max-width: 400px;
          }

          .fd-fleet__benefits {
            flex-wrap: wrap;
            gap: 2rem;
          }

          .fd-fleet__benefit-divider {
            display: none;
          }

          .fd-fleet__benefit {
            flex: 0 0 calc(50% - 1rem);
          }

          .fd-fleet__aircraft-grid {
            grid-template-columns: 1fr;
            max-width: 350px;
          }

          .fd-fleet__cta {
            flex-direction: column;
            align-items: center;
          }

          .fd-fleet__btn {
            width: 100%;
            max-width: 300px;
          }
        }

        /* ===== EXPEDITIONS SECTION (Immersive) ===== */
        .fd-exped {
          background: #faf9f6;
        }

        /* Cinematic Opening */
        .fd-exped__cinematic {
          position: relative;
          min-height: 70vh;
          display: flex;
          align-items: center;
          justify-content: center;
          overflow: hidden;
        }

        .fd-exped__cinematic-bg {
          position: absolute;
          inset: 0;
        }

        .fd-exped__cinematic-bg video,
        .fd-exped__cinematic-bg img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }

        .fd-exped__cinematic-overlay {
          position: absolute;
          inset: 0;
          background: transparent;
        }

        .fd-exped__globe {
          position: absolute;
          top: 55vh;
          left: 50%;
          transform: translate(-50%, -50%);
          width: min(95vw, 800px);
          height: min(95vw, 800px);
          pointer-events: none;
          z-index: 1;
          color: #1a1a1a;
        }

        .fd-exped__globe svg {
          width: 100%;
          height: 100%;
        }

        .fd-exped__globe-picker {
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

        .fd-exped__globe-picker span {
          font-family: 'Share Tech Mono', monospace;
          font-size: 0.7rem;
          letter-spacing: 0.1em;
          color: rgba(255,255,255,0.5);
        }

        .fd-exped__globe-picker button {
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

        .fd-exped__globe-picker button:hover {
          background: rgba(255,255,255,0.2);
        }

        .fd-exped__cinematic-content {
          position: relative;
          z-index: 2;
          text-align: center;
          max-width: 1100px;
          width: 100%;
          padding: 4rem 2rem;
        }

        .fd-exped__pre-title {
          display: block;
          font-size: 0.75rem;
          text-transform: uppercase;
          letter-spacing: 0.3em;
          color: #888;
          margin-bottom: 1rem;
        }

        .fd-exped__title {
          margin: 0 0 2rem;
        }

        .fd-exped__title-word {
          display: block;
          font-family: 'Space Grotesk', sans-serif;
          font-size: clamp(2.5rem, 6vw, 5rem);
          font-weight: 700;
          text-transform: uppercase;
          line-height: 1;
          letter-spacing: -0.02em;
        }

        .fd-exped__title-word--1 { color: #1a1a1a; }
        .fd-exped__title-word--2 { color: #4a4a4a; }
        .fd-exped__title-word--3 { color: #7a7a7a; }

        .fd-exped__cinematic-desc {
          font-size: 1.1rem;
          line-height: 1.8;
          color: #666;
          max-width: 600px;
          margin: 0 auto;
        }

        /* Stats Bar */
        .fd-exped__stats-bar {
          display: flex;
          justify-content: center;
          align-items: center;
          gap: 3rem;
          padding: 2rem;
          background: #1a1a1a;
        }

        .fd-exped__stat-item {
          display: flex;
          align-items: center;
          gap: 1rem;
        }

        .fd-exped__stat-num {
          font-family: 'Share Tech Mono', monospace;
          font-size: 2rem;
          font-weight: 700;
          color: #fff;
        }

        .fd-exped__stat-text {
          font-size: 0.7rem;
          text-transform: uppercase;
          letter-spacing: 0.1em;
          color: rgba(255,255,255,0.5);
          line-height: 1.4;
        }

        .fd-exped__stat-divider {
          width: 1px;
          height: 40px;
          background: rgba(255,255,255,0.2);
        }

        /* Journey Map */
        .fd-exped__journey {
          padding: 5rem 2rem;
          background: #fff;
        }

        .fd-exped__journey-header {
          text-align: center;
          margin-bottom: 2rem;
        }

        .fd-exped__label {
          display: block;
          font-size: 0.7rem;
          text-transform: uppercase;
          letter-spacing: 0.25em;
          color: #999;
          margin-bottom: 0.5rem;
        }

        .fd-exped__journey-title {
          font-family: 'Space Grotesk', sans-serif;
          font-size: clamp(1.5rem, 3vw, 2.5rem);
          font-weight: 700;
          text-transform: uppercase;
          color: #1a1a1a;
          margin: 0;
        }

        .fd-exped__journey-desc {
          font-size: 1rem;
          line-height: 1.7;
          color: #666;
          max-width: 600px;
          margin: 0.75rem auto 0;
        }

        .fd-exped__journey-map {
          position: relative;
          max-width: 1000px;
          margin: 0 auto;
          padding: 2rem;
        }

        .fd-exped__map-svg {
          width: 100%;
          height: auto;
        }

        .fd-exped__map-label {
          font-family: 'Share Tech Mono', monospace;
          font-size: 10px;
          fill: #1a1a1a;
          text-transform: uppercase;
          letter-spacing: 0.1em;
        }

        .fd-exped__map-dest {
          font-family: 'Share Tech Mono', monospace;
          font-size: 8px;
          fill: #666;
          text-transform: uppercase;
          letter-spacing: 0.05em;
        }

        .fd-exped__map-heli {
          position: absolute;
          width: 30px;
          height: auto;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          animation: heliFloat 3s ease-in-out infinite;
        }

        @keyframes heliFloat {
          0%, 100% { transform: translate(-50%, -50%) translateY(0); }
          50% { transform: translate(-50%, -50%) translateY(-10px); }
        }

        /* Region Cards */
        .fd-exped__regions {
          padding: 4rem 2rem;
          background: #faf9f6;
        }

        .fd-exped__regions-label {
          display: block;
          font-size: 0.7rem;
          text-transform: uppercase;
          letter-spacing: 0.25em;
          color: #999;
          text-align: center;
          margin-bottom: 2rem;
        }

        .fd-exped__regions-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 1.5rem;
          max-width: 1200px;
          margin: 0 auto;
        }

        .fd-exped__region-card {
          position: relative;
          min-height: 400px;
          border-radius: 8px;
          overflow: hidden;
          text-decoration: none;
          color: #fff;
          display: flex;
          flex-direction: column;
          justify-content: flex-end;
        }

        .fd-exped__region-bg {
          position: absolute;
          inset: 0;
        }

        .fd-exped__region-bg img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          transition: transform 0.5s ease;
        }

        .fd-exped__region-card:hover .fd-exped__region-bg img {
          transform: scale(1.1);
        }

        .fd-exped__region-overlay {
          position: absolute;
          inset: 0;
          background: linear-gradient(to top, rgba(0,0,0,0.8) 0%, rgba(0,0,0,0.2) 50%, rgba(0,0,0,0.1) 100%);
        }

        .fd-exped__region-content {
          position: relative;
          z-index: 2;
          padding: 2rem;
        }

        .fd-exped__region-tag {
          display: inline-block;
          font-size: 0.6rem;
          text-transform: uppercase;
          letter-spacing: 0.15em;
          background: rgba(255,255,255,0.2);
          padding: 0.25rem 0.75rem;
          border-radius: 20px;
          margin-bottom: 1rem;
        }

        .fd-exped__region-title {
          font-family: 'Space Grotesk', sans-serif;
          font-size: 1.5rem;
          font-weight: 700;
          text-transform: uppercase;
          margin: 0 0 0.5rem;
        }

        .fd-exped__region-desc {
          font-size: 0.85rem;
          color: rgba(255,255,255,0.7);
          margin: 0 0 1rem;
          line-height: 1.5;
        }

        .fd-exped__region-meta {
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .fd-exped__region-duration {
          font-family: 'Share Tech Mono', monospace;
          font-size: 0.75rem;
        }

        .fd-exped__region-arrow {
          font-size: 1.25rem;
          transition: transform 0.3s ease;
        }

        .fd-exped__region-card:hover .fd-exped__region-arrow {
          transform: translateX(5px);
        }

        .fd-exped__region-badge {
          position: absolute;
          top: 1rem;
          right: 1rem;
          background: #fff;
          color: #1a1a1a;
          padding: 0.5rem;
          font-size: 0.55rem;
          text-transform: uppercase;
          letter-spacing: 0.1em;
          text-align: center;
          line-height: 1.4;
        }

        .fd-exped__region-badge span {
          display: block;
        }

        /* Leader Section */
        .fd-exped__leader {
          display: flex;
          align-items: center;
          gap: 4rem;
          padding: 5rem 2rem;
          max-width: 1000px;
          margin: 0 auto;
        }

        .fd-exped__leader-image {
          position: relative;
          flex-shrink: 0;
        }

        .fd-exped__leader-image img {
          width: 200px;
          height: 200px;
          object-fit: cover;
          border-radius: 50%;
        }

        .fd-exped__leader-ring {
          position: absolute;
          inset: -10px;
          border: 1px dashed #ccc;
          border-radius: 50%;
          animation: ringRotate 20s linear infinite;
        }

        @keyframes ringRotate {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }

        .fd-exped__leader-content {
          flex: 1;
        }

        .fd-exped__leader-role {
          display: block;
          font-size: 0.7rem;
          text-transform: uppercase;
          letter-spacing: 0.2em;
          color: #999;
          margin-bottom: 0.5rem;
        }

        .fd-exped__leader-name {
          font-family: 'Space Grotesk', sans-serif;
          font-size: clamp(1.5rem, 3vw, 2rem);
          font-weight: 700;
          margin: 0 0 1.5rem;
          color: #1a1a1a;
        }

        .fd-exped__leader-quote {
          font-size: 1.1rem;
          font-style: italic;
          line-height: 1.8;
          color: #666;
          margin: 0 0 1.5rem;
          padding-left: 1.5rem;
          border-left: 3px solid #e8e6e2;
        }

        .fd-exped__leader-link {
          font-size: 0.8rem;
          text-transform: uppercase;
          letter-spacing: 0.1em;
          color: #1a1a1a;
          text-decoration: none;
          border-bottom: 1px solid #ccc;
          padding-bottom: 0.25rem;
          transition: border-color 0.3s ease;
        }

        .fd-exped__leader-link:hover {
          border-color: #1a1a1a;
        }

        /* Departures Board */
        .fd-exped__departures {
          background: #1a1a1a;
          padding: 4rem 2rem;
        }

        .fd-exped__departures-header {
          text-align: center;
          margin-bottom: 2rem;
        }

        .fd-exped__departures-status {
          display: inline-block;
          font-family: 'Share Tech Mono', monospace;
          font-size: 0.7rem;
          letter-spacing: 0.2em;
          color: #4ade80;
          margin-bottom: 0.5rem;
          animation: statusBlink 2s ease-in-out infinite;
        }

        @keyframes statusBlink {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.5; }
        }

        .fd-exped__departures-title {
          font-family: 'Space Grotesk', sans-serif;
          font-size: 1.5rem;
          font-weight: 700;
          text-transform: uppercase;
          color: #fff;
          margin: 0;
        }

        .fd-exped__departures-board {
          max-width: 900px;
          margin: 0 auto;
          background: #0a0a0a;
          border: 1px solid #333;
          border-radius: 4px;
          overflow: hidden;
        }

        .fd-exped__departure {
          display: grid;
          grid-template-columns: auto 100px 1fr 100px auto;
          gap: 1.5rem;
          align-items: center;
          padding: 1.25rem 1.5rem;
          border-bottom: 1px solid #222;
          font-family: 'Share Tech Mono', monospace;
        }

        .fd-exped__departure:last-child {
          border-bottom: none;
        }

        .fd-exped__departure-badge {
          font-size: 0.55rem;
          text-transform: uppercase;
          letter-spacing: 0.05em;
          padding: 0.2rem 0.5rem;
          border-radius: 2px;
        }

        .fd-exped__departure-badge--new { background: #3b82f6; color: #fff; }
        .fd-exped__departure-badge--spaces { background: #22c55e; color: #fff; }
        .fd-exped__departure-badge--filling { background: #f59e0b; color: #000; }

        .fd-exped__departure-date {
          font-size: 0.8rem;
          color: rgba(255,255,255,0.5);
        }

        .fd-exped__departure-dest {
          font-size: 1rem;
          color: #fff;
          letter-spacing: 0.05em;
        }

        .fd-exped__departure-duration {
          font-size: 0.75rem;
          color: rgba(255,255,255,0.4);
        }

        .fd-exped__departure-status {
          font-size: 0.7rem;
          letter-spacing: 0.1em;
        }

        .fd-exped__departure-status--boarding { color: #4ade80; }
        .fd-exped__departure-status--open { color: #3b82f6; }
        .fd-exped__departure-status--limited { color: #f59e0b; }

        /* Expedition CTA */
        .fd-exped__cta {
          padding: 4rem 2rem;
          background: #faf9f6;
          text-align: center;
        }

        .fd-exped__cta-text {
          font-size: 1.1rem;
          color: #666;
          margin: 0 0 2rem;
        }

        .fd-exped__cta-buttons {
          display: flex;
          justify-content: center;
          gap: 1rem;
        }

        .fd-exped__btn {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          padding: 1rem 2rem;
          font-size: 0.75rem;
          font-weight: 500;
          text-transform: uppercase;
          letter-spacing: 0.1em;
          text-decoration: none;
          transition: all 0.3s ease;
        }

        .fd-exped__btn--primary {
          background: #1a1a1a;
          color: #fff;
          border: 1px solid #1a1a1a;
        }

        .fd-exped__btn--primary:hover {
          background: #333;
        }

        .fd-exped__btn--outline {
          background: transparent;
          color: #1a1a1a;
          border: 1px solid #1a1a1a;
        }

        .fd-exped__btn--outline:hover {
          background: #1a1a1a;
          color: #fff;
        }

        /* Expeditions Responsive */
        @media (max-width: 1024px) {
          .fd-exped__regions-grid {
            grid-template-columns: 1fr;
            max-width: 500px;
          }

          .fd-exped__region-card {
            min-height: 300px;
          }

          .fd-exped__leader {
            flex-direction: column;
            text-align: center;
          }

          .fd-exped__leader-quote {
            border-left: none;
            padding-left: 0;
            border-top: 3px solid #e8e6e2;
            padding-top: 1.5rem;
          }
        }

        @media (max-width: 768px) {
          .fd-exped__stats-bar {
            flex-wrap: wrap;
            gap: 1.5rem;
          }

          .fd-exped__stat-divider {
            display: none;
          }

          .fd-exped__stat-item {
            flex: 0 0 calc(50% - 0.75rem);
            justify-content: center;
          }

          .fd-exped__departure {
            grid-template-columns: 1fr;
            gap: 0.5rem;
            text-align: center;
            padding: 1rem;
          }

          .fd-exped__cta-buttons {
            flex-direction: column;
            align-items: center;
          }

          .fd-exped__btn {
            width: 100%;
            max-width: 300px;
          }
        }

        /* ===== CERTIFICATION CARDS (Dealer & Service Center) ===== */
        .fd-cert {
          padding: 0 2rem 3rem;
          display: flex;
          justify-content: center;
        }

        .fd-cert__card {
          position: relative;
          background: linear-gradient(135deg, #1a1a1a 0%, #2d2d2d 100%);
          border-radius: 12px;
          overflow: hidden;
          max-width: 900px;
          width: 100%;
        }

        .fd-cert__glow {
          position: absolute;
          top: -50%;
          left: -50%;
          width: 200%;
          height: 200%;
          background: radial-gradient(circle at center, rgba(201, 162, 39, 0.15) 0%, transparent 50%);
          pointer-events: none;
        }

        .fd-cert__glow--blue {
          background: radial-gradient(circle at center, rgba(59, 130, 246, 0.12) 0%, transparent 50%);
        }

        .fd-cert__content {
          position: relative;
          z-index: 1;
          display: flex;
          align-items: center;
          gap: 3rem;
          padding: 2.5rem 3rem;
        }

        .fd-cert__logo-wrap {
          flex-shrink: 0;
          padding: 1.5rem;
          background: rgba(255, 255, 255, 0.05);
          border-radius: 8px;
          border: 1px solid rgba(255, 255, 255, 0.1);
        }

        .fd-cert__logo {
          height: 80px;
          width: auto;
          display: block;
        }

        .fd-cert__info {
          flex: 1;
        }

        .fd-cert__label {
          display: inline-block;
          font-size: 0.6rem;
          text-transform: uppercase;
          letter-spacing: 0.2em;
          color: #c9a227;
          background: rgba(201, 162, 39, 0.15);
          padding: 0.25rem 0.75rem;
          border-radius: 20px;
          margin-bottom: 0.75rem;
        }

        .fd-cert__card--service .fd-cert__label {
          color: #60a5fa;
          background: rgba(96, 165, 250, 0.15);
        }

        .fd-cert__title {
          font-family: 'Space Grotesk', sans-serif;
          font-size: 1.5rem;
          font-weight: 700;
          color: #fff;
          margin: 0 0 0.75rem;
        }

        .fd-cert__desc {
          font-size: 0.9rem;
          line-height: 1.6;
          color: rgba(255, 255, 255, 0.7);
          margin: 0 0 1.5rem;
          max-width: 500px;
        }

        .fd-cert__stats {
          display: flex;
          align-items: center;
          gap: 1.5rem;
        }

        .fd-cert__stat {
          text-align: center;
        }

        .fd-cert__stat-value {
          display: block;
          font-family: 'Share Tech Mono', monospace;
          font-size: 1.25rem;
          font-weight: 700;
          color: #fff;
          line-height: 1.2;
        }

        .fd-cert__stat-label {
          display: block;
          font-size: 0.6rem;
          text-transform: uppercase;
          letter-spacing: 0.1em;
          color: rgba(255, 255, 255, 0.5);
          margin-top: 0.25rem;
        }

        .fd-cert__stat-divider {
          width: 1px;
          height: 30px;
          background: rgba(255, 255, 255, 0.2);
        }

        .fd-cert__also {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 0.5rem;
          padding: 0.6rem 1.5rem;
          background: #2a2a2a;
          border-top: 1px solid rgba(255, 255, 255, 0.08);
        }
        .fd-cert__also-label {
          font-size: 0.55rem;
          text-transform: uppercase;
          letter-spacing: 0.12em;
          color: rgba(255, 255, 255, 0.35);
        }
        .fd-cert__also-item {
          font-size: 0.6rem;
          letter-spacing: 0.05em;
          color: rgba(255, 255, 255, 0.55);
        }
        .fd-cert__also-sep {
          font-size: 0.5rem;
          color: #ccc;
        }

        @media (max-width: 768px) {
          .fd-cert__content {
            flex-direction: column;
            text-align: center;
            padding: 2rem;
            gap: 1.5rem;
          }

          .fd-cert__desc {
            max-width: none;
          }

          .fd-cert__stats {
            justify-content: center;
          }
        }

        /* ===== SALES SECTION ===== */
        .fd-sales {
          padding: 2rem 2rem 5rem;
          background: #fff;
        }

        .fd-sales__intro {
          display: grid;
          grid-template-columns: 1fr 1fr;
        }

        .fd-sales__left {
          max-width: 480px;
          margin: 0 auto;
          padding: 0 3rem;
        }

        .fd-sales__header-sticky {
          position: sticky;
          top: 15vh;
          text-align: left;
          padding: 48px 0 2rem;
        }

        .fd-sales__dealer-catch {
          position: sticky;
          z-index: 2;
          background: #fff;
          padding: 0.5rem 0 2rem;
        }

        .fd-sales__dealer-catch .cert-cloud {
          margin: 0;
        }

        .fd-sales__intro-bg {
          grid-column: 2;
          grid-row: 1;
          background: #f3f1ed;
          border-radius: 8px 0 0 8px;
          pointer-events: none;
          align-self: stretch;
          margin: -1rem -50vw -1rem 0;
        }

        .fd-sales__intro-border {
          grid-column: 2;
          grid-row: 1;
          border: 1px solid rgba(0,0,0,0.12);
          border-right: none;
          border-radius: 8px 0 0 8px;
          pointer-events: none;
          align-self: stretch;
          margin: -1rem -50vw -1rem 0;
          z-index: 2;
        }

        .fd-sales__intro-gallery {
          grid-column: 2;
          grid-row: 1;
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 6px;
          z-index: 1;
          padding: 1.5rem 3rem 0.75rem;
        }

        .fd-sales__intro-img {
          overflow: hidden;
          border-radius: 3px;
        }

        .fd-sales__intro-img--wide {
          grid-column: 1 / -1;
        }

        .fd-sales__intro-img img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          display: block;
          aspect-ratio: 1 / 1;
          transition: transform 0.6s cubic-bezier(0.16, 1, 0.3, 1);
          filter: saturate(0.85);
        }

        .fd-sales__intro-img--wide img {
          aspect-ratio: 16 / 9;
        }

        .fd-sales__intro-img:hover img {
          transform: scale(1.04);
          filter: saturate(1);
        }

        .fd-sales__intro-card {
          grid-column: 1 / -1;
        }
        .fd-sales__intro-card .cert-cloud { margin: 0; }

        .fd-sales__number {
          display: block;
          font-family: 'Share Tech Mono', monospace;
          font-size: 0.7rem;
          color: #999;
          margin-bottom: 1rem;
        }

        .fd-sales__pre-title {
          display: block;
          font-size: 0.75rem;
          text-transform: uppercase;
          letter-spacing: 0.3em;
          color: #888;
          margin-bottom: 1rem;
        }

        .fd-sales__title {
          margin: 0 0 2rem;
        }

        .fd-sales__title-word {
          display: block;
          font-family: 'Space Grotesk', sans-serif;
          font-size: clamp(2.5rem, 6vw, 5rem);
          font-weight: 700;
          text-transform: uppercase;
          line-height: 1;
          letter-spacing: -0.02em;
        }

        .fd-sales__title-word--1 { color: #1a1a1a; }
        .fd-sales__title-word--2 { color: #4a4a4a; }
        .fd-sales__title-word--3 { color: #7a7a7a; }

        .fd-sales__text {
          font-size: 1.1rem;
          line-height: 1.8;
          color: #666;
          max-width: 600px;
          margin: 0;
        }

        .fd-sales__header-divider {
          width: 60px;
          height: 1px;
          background: #ccc;
          margin: 1.5rem 0 0;
        }

        .fd-sales__toggle-wrap {
          text-align: center;
          margin: 2rem 0;
        }

        .fd-sales__toggle {
          display: inline-flex;
          border: 1px solid #e0deda;
          overflow: hidden;
        }

        .fd-sales__toggle-btn {
          padding: 0.65rem 1.75rem;
          font-family: 'Share Tech Mono', monospace;
          font-size: 0.7rem;
          letter-spacing: 0.1em;
          text-transform: uppercase;
          background: transparent;
          border: none;
          cursor: pointer;
          color: #999;
          transition: all 0.3s ease;
          position: relative;
        }

        .fd-sales__toggle-btn:not(:last-child) {
          border-right: 1px solid #e0deda;
        }

        .fd-sales__toggle-btn--active {
          background: #1a1a1a;
          color: #fff;
        }

        .fd-sales__toggle-btn:hover:not(.fd-sales__toggle-btn--active) {
          color: #1a1a1a;
          background: #f5f4f0;
        }

        .fd-sales__unmanned-coming {
          text-align: center;
          padding: 4rem 2rem;
          background: #f5f4f0;
          border: 1px solid #e0deda;
        }

        .fd-sales__unmanned-icon {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 60px;
          height: 60px;
          background: #1a1a1a;
          color: #fff;
          border-radius: 50%;
          margin: 0 auto 1.5rem;
          font-size: 1.25rem;
        }

        .fd-sales__unmanned-coming p {
          color: #666;
          margin-bottom: 1.5rem;
          max-width: 500px;
          margin-left: auto;
          margin-right: auto;
        }

        .fd-sales__grid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 1.5rem;
          margin-bottom: 3rem;
        }

        .fd-sales__card {
          background: #faf9f6;
          border: 1px solid #e8e6e2;
          text-decoration: none;
          color: inherit;
          transition: all 0.3s ease;
          position: relative;
          overflow: hidden;
        }

        .fd-sales__card:hover {
          border-color: #ccc;
          transform: translateY(-4px);
          box-shadow: 0 8px 24px rgba(0,0,0,0.08);
        }

        .fd-sales__card--featured {
          border-color: #1a1a1a;
        }

        .fd-sales__card-badge {
          position: absolute;
          top: 0.75rem;
          right: 0.75rem;
          font-family: 'Share Tech Mono', monospace;
          font-size: 0.55rem;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 0.1em;
          padding: 0.25rem 0.5rem;
          background: #1a1a1a;
          color: #fff;
          z-index: 2;
        }

        .fd-sales__card-image {
          aspect-ratio: 4/3;
          background: linear-gradient(135deg, #f5f4f0 0%, #eae8e2 100%);
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 1rem;
        }

        .fd-sales__card-image img {
          max-width: 90%;
          max-height: 90%;
          object-fit: contain;
          transition: transform 0.4s ease;
        }

        .fd-sales__card:hover .fd-sales__card-image img {
          transform: scale(1.05);
        }

        .fd-sales__card-info {
          padding: 1.25rem;
        }

        .fd-sales__card-info h3 {
          font-family: 'Space Grotesk', sans-serif;
          font-size: 1.5rem;
          font-weight: 700;
          margin: 0 0 0.25rem;
          color: #1a1a1a;
        }

        .fd-sales__card-tagline {
          display: block;
          font-size: 0.75rem;
          color: #888;
          margin-bottom: 0.75rem;
        }

        .fd-sales__card-specs {
          display: flex;
          gap: 0.75rem;
          margin-bottom: 0.75rem;
          padding-bottom: 0.75rem;
          border-bottom: 1px solid #e8e6e2;
        }

        .fd-sales__card-specs span {
          font-family: 'Share Tech Mono', monospace;
          font-size: 0.65rem;
          color: #666;
          text-transform: uppercase;
        }

        .fd-sales__card-price {
          font-family: 'Share Tech Mono', monospace;
          font-size: 0.9rem;
          font-weight: 700;
          color: #1a1a1a;
        }

        .fd-sales__subsection {
          max-width: 1100px;
          margin: 0 auto;
        }

        .fd-sales__section-title {
          font-family: 'Space Grotesk', sans-serif;
          font-size: 1.1rem;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 0.08em;
          color: #1a1a1a;
          margin: 3rem 0 1.5rem;
          padding-left: 1rem;
          border-left: 3px solid #1a1a1a;
          display: flex;
          align-items: center;
          gap: 1rem;
        }

        .fd-sales__section-title::after {
          content: '';
          flex: 1;
          height: 1px;
          background: #e8e6e2;
        }

        /* ── Mobile accordion for subsections ── */

        /* Chevron: always in DOM, hidden on desktop */
        .fd-sales__section-chevron {
          display: none;
        }

        /* Body: collapsed by default on mobile, always visible on desktop */
        @media (min-width: 769px) {
          .fd-sales__section-body {
            display: block !important;
            max-height: none !important;
            overflow: visible !important;
            opacity: 1 !important;
          }
        }

        @media (max-width: 768px) {
          .fd-sales__section-title {
            cursor: pointer;
            -webkit-tap-highlight-color: transparent;
            margin: 0;
            padding: 1.25rem 1rem;
            border-left: 3px solid #1a1a1a;
            transition: border-color 0.3s cubic-bezier(0.33, 1, 0.68, 1);
          }

          .fd-sales__subsection--open > .fd-sales__section-title {
            border-left-color: #E04A2F;
          }

          .fd-sales__section-title::after {
            display: none;
          }

          .fd-sales__section-chevron {
            display: flex;
            align-items: center;
            justify-content: center;
            width: 32px;
            height: 32px;
            border: 1.5px solid #1a1a1a;
            border-radius: 50%;
            color: #1a1a1a;
            flex-shrink: 0;
            margin-left: auto;
            transition: transform 0.3s cubic-bezier(0.33, 1, 0.68, 1),
                        background 0.3s cubic-bezier(0.33, 1, 0.68, 1),
                        color 0.3s cubic-bezier(0.33, 1, 0.68, 1),
                        border-color 0.3s cubic-bezier(0.33, 1, 0.68, 1);
          }

          .fd-sales__subsection--open .fd-sales__section-chevron {
            transform: rotate(180deg);
            background: #1a1a1a;
            color: #fff;
            border-color: #1a1a1a;
          }

          .fd-sales__section-body {
            display: block;
            max-height: 0;
            overflow: hidden;
            opacity: 0;
            transition: max-height 0.5s cubic-bezier(0.33, 1, 0.68, 1),
                        opacity 0.3s ease;
          }

          .fd-sales__subsection--open > .fd-sales__section-body {
            max-height: 4000px;
            overflow: visible;
            opacity: 1;
            transition: max-height 0.6s cubic-bezier(0.33, 1, 0.68, 1),
                        opacity 0.4s ease 0.1s;
          }

          .fd-sales__subsection {
            border-bottom: 1px solid #e8e6e2;
          }
        }

        .fd-sales__section-desc {
          font-size: 0.9rem;
          line-height: 1.7;
          color: #666;
          margin: 0 0 1.5rem;
          text-align: left;
        }

        .fd-sales__carousel-wrap {
          position: relative;
        }

        .fd-sales__carousel {
          display: flex;
          overflow-x: auto;
          scroll-snap-type: x mandatory;
          gap: 1.5rem;
          padding: 0.5rem 0 1.5rem;
          -webkit-overflow-scrolling: touch;
          scrollbar-width: none;
          -ms-overflow-style: none;
        }

        .fd-sales__carousel::-webkit-scrollbar {
          display: none;
        }

        .fd-sales__sold-card {
          flex: 0 0 260px;
          scroll-snap-align: start;
          background: #faf9f6;
          border: 1px solid #e8e6e2;
          position: relative;
          overflow: hidden;
          transition: all 0.3s ease;
        }

        .fd-sales__sold-card:hover {
          border-color: #ccc;
          transform: translateY(-2px);
          box-shadow: 0 4px 16px rgba(0,0,0,0.06);
        }

        .fd-sales__sold-badge {
          position: absolute;
          top: 0.75rem;
          right: 0.75rem;
          font-family: 'Share Tech Mono', monospace;
          font-size: 0.55rem;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 0.1em;
          padding: 0.25rem 0.6rem;
          background: #c0392b;
          color: #fff;
          z-index: 2;
        }

        .fd-sales__sold-badge--rebuild {
          background: #1a1a1a;
        }

        .fd-sales__sold-image {
          aspect-ratio: 4/3;
          background: linear-gradient(135deg, #f5f4f0 0%, #eae8e2 100%);
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 1rem;
        }

        .fd-sales__sold-image img {
          max-width: 85%;
          max-height: 85%;
          object-fit: contain;
          opacity: 0.7;
          filter: grayscale(30%);
        }

        .fd-sales__sold-info {
          padding: 1rem 1.25rem;
          display: flex;
          flex-direction: column;
          gap: 0.25rem;
        }

        .fd-sales__sold-info strong {
          font-family: 'Space Grotesk', sans-serif;
          font-size: 1rem;
          color: #1a1a1a;
        }

        .fd-sales__sold-info span {
          font-family: 'Share Tech Mono', monospace;
          font-size: 0.7rem;
          color: #888;
          text-transform: uppercase;
        }

        @media (max-width: 900px) {
          .fd-sales__grid {
            grid-template-columns: repeat(2, 1fr);
          }
        }

        @media (max-width: 550px) {
          .fd-sales__grid {
            grid-template-columns: 1fr;
            max-width: 320px;
          }

          .fd-sales__sold-card {
            flex: 0 0 220px;
          }
        }

        /* ===== THE CLUBHOUSE ===== */
        .clubhouse {
          padding: 8px 0 48px;
          background: #fff;
          position: relative;
        }

        .clubhouse__bg-right {
          grid-column: 2;
          grid-row: 1;
          background: #d6d2cc;
          border-radius: 8px 0 0 8px;
          pointer-events: none;
          align-self: stretch;
          margin: -1rem -50vw -1rem 0;
        }

        .clubhouse__bg-border {
          grid-column: 2;
          grid-row: 1;
          border: 1px solid rgba(0,0,0,0.12);
          border-right: none;
          border-radius: 8px 0 0 8px;
          pointer-events: none;
          align-self: stretch;
          margin: -1rem -50vw -1rem 0;
          z-index: 2;
        }

        .clubhouse__inner {
          display: grid;
          grid-template-columns: 1fr 1fr;
          align-items: start;
        }

        .clubhouse__sticky {
          position: sticky;
          top: 35vh;
          max-width: 480px;
          margin: 0 auto;
          padding: 48px 3rem 48px;
        }

        .clubhouse__pretitle {
          font-family: 'Share Tech Mono', monospace;
          font-size: 0.7rem;
          letter-spacing: 0.2em;
          text-transform: uppercase;
          color: #999;
          display: block;
          margin-bottom: 0.75rem;
        }

        .clubhouse__title {
          font-family: 'Space Grotesk', sans-serif;
          font-size: 2rem;
          font-weight: 600;
          color: #1a1a1a;
          margin: 0 0 1.25rem;
          letter-spacing: -0.02em;
        }

        .clubhouse__desc {
          font-size: 0.88rem;
          line-height: 1.7;
          color: #555;
          margin: 0 0 1.5rem;
        }

        .clubhouse__tagline {
          font-family: 'Share Tech Mono', monospace;
          font-size: 0.72rem;
          letter-spacing: 0.15em;
          text-transform: uppercase;
          color: #999;
          border-top: 1px solid rgba(0,0,0,0.08);
          padding-top: 1rem;
          display: block;
        }

        .clubhouse__gallery {
          grid-column: 2;
          grid-row: 1;
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 6px;
          z-index: 1;
          padding: 1.5rem 3rem 0.75rem;
        }

        .clubhouse__img {
          overflow: hidden;
          border-radius: 3px;
        }

        .clubhouse__img--wide {
          grid-column: 1 / -1;
        }

        .clubhouse__img--tall {
          grid-row: span 2;
        }

        .clubhouse__img img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          display: block;
          aspect-ratio: 1 / 1;
          transition: transform 0.6s cubic-bezier(0.16, 1, 0.3, 1);
          filter: saturate(0.85);
        }

        .clubhouse__img--wide img {
          aspect-ratio: 16 / 9;
        }

        .clubhouse__img--tall img {
          aspect-ratio: auto;
          height: 100%;
        }

        .clubhouse__img:hover img {
          transform: scale(1.04);
          filter: saturate(1);
        }

        @media (max-width: 768px) {
          .clubhouse {
            padding: 2rem 1.5rem 3rem;
          }

          .clubhouse__inner {
            grid-template-columns: 1fr;
            gap: 2rem;
          }

          .clubhouse__sticky {
            position: static;
          }

          .clubhouse__title {
            font-size: 1.6rem;
          }

          .clubhouse__bg-right {
            display: none;
          }
        }

        /* ===== MAINTENANCE SECTION ===== */
        .fd-maint {
          padding: 2rem 2rem 5rem;
          background: #faf9f6;
        }

        .fd-maint__header {
          text-align: center;
          margin-bottom: 3rem;
        }

        .fd-maint__number {
          display: block;
          font-family: 'Share Tech Mono', monospace;
          font-size: 0.7rem;
          color: #999;
          margin-bottom: 1rem;
        }

        .fd-maint__title {
          font-family: 'Space Grotesk', sans-serif;
          font-size: clamp(2rem, 4vw, 3rem);
          font-weight: 700;
          text-transform: uppercase;
          margin: 0 0 1rem;
          color: #1a1a1a;
        }

        .fd-maint__text {
          font-size: 1rem;
          line-height: 1.7;
          color: #666;
          max-width: 500px;
          margin: 0 auto;
        }

        .fd-maint__stats {
          display: flex;
          justify-content: center;
          align-items: center;
          gap: 2rem;
          margin-bottom: 3rem;
          padding: 1.5rem 0;
          border-top: 1px solid #e8e6e2;
          border-bottom: 1px solid #e8e6e2;
          max-width: 800px;
          margin-left: auto;
          margin-right: auto;
        }

        .fd-maint__stat {
          text-align: center;
        }

        .fd-maint__stat-value {
          display: block;
          font-family: 'Share Tech Mono', monospace;
          font-size: 1.5rem;
          font-weight: 700;
          color: #1a1a1a;
          line-height: 1.2;
        }

        .fd-maint__stat-label {
          display: block;
          font-size: 0.65rem;
          text-transform: uppercase;
          letter-spacing: 0.1em;
          color: #888;
          margin-top: 0.25rem;
        }

        .fd-maint__stat-divider {
          width: 1px;
          height: 40px;
          background: linear-gradient(to bottom, transparent, #c0bdb8, transparent);
        }

        .fd-maint__services {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 1.5rem;
          max-width: 1000px;
          margin: 0 auto 3rem;
        }

        .fd-maint__service {
          background: #fff;
          border: 1px solid #e8e6e2;
          padding: 1.5rem;
          transition: all 0.3s ease;
        }

        .fd-maint__service:hover {
          border-color: #ccc;
          transform: translateY(-4px);
          box-shadow: 0 8px 24px rgba(0,0,0,0.06);
        }

        .fd-maint__service-num {
          display: block;
          font-family: 'Share Tech Mono', monospace;
          font-size: 0.65rem;
          color: #999;
          margin-bottom: 0.75rem;
        }

        .fd-maint__service h3 {
          font-family: 'Space Grotesk', sans-serif;
          font-size: 1rem;
          font-weight: 600;
          margin: 0 0 0.5rem;
          color: #1a1a1a;
        }

        .fd-maint__service p {
          font-size: 0.8rem;
          line-height: 1.6;
          color: #666;
          margin: 0;
        }

        .fd-maint__actions {
          display: flex;
          justify-content: center;
          gap: 1rem;
        }

        .fd-maint__btn {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          padding: 0.875rem 2rem;
          font-size: 0.75rem;
          font-weight: 600;
          text-transform: uppercase;
          letter-spacing: 0.1em;
          text-decoration: none;
          transition: all 0.3s ease;
        }

        .fd-maint__btn--primary {
          background: #1a1a1a;
          color: #fff;
          border: 1px solid #1a1a1a;
        }

        .fd-maint__btn--primary:hover {
          background: #333;
        }

        .fd-maint__btn--outline {
          background: transparent;
          color: #1a1a1a;
          border: 1px solid #1a1a1a;
        }

        .fd-maint__btn--outline:hover {
          background: #1a1a1a;
          color: #fff;
        }

        @media (max-width: 900px) {
          .fd-maint__services {
            grid-template-columns: repeat(2, 1fr);
          }

          .fd-maint__stats {
            flex-wrap: wrap;
            gap: 1.5rem;
          }

          .fd-maint__stat-divider {
            display: none;
          }
        }

        @media (max-width: 550px) {
          .fd-maint__services {
            grid-template-columns: 1fr;
            max-width: 320px;
          }

          .fd-maint__stats {
            gap: 1rem;
          }

          .fd-maint__stat {
            flex: 0 0 45%;
          }

          .fd-maint__actions {
            flex-direction: column;
            align-items: center;
          }

          .fd-maint__btn {
            width: 100%;
            max-width: 280px;
          }
        }

        /* ===== MERGED MAINTENANCE PANEL ===== */
        .fd-maint__merged {
          margin: 1.5rem 0;
          border: 1px solid #e8e6e2;
          background: #fff;
          padding: 1.5rem;
        }
        .fd-maint__merged-cols {
          display: grid;
          grid-template-columns: 3fr 2fr;
          grid-template-rows: auto auto auto;
          gap: 1rem 1.5rem;
        }
        .fd-maint__merged-left,
        .fd-maint__merged-right {
          grid-row: 1 / -1;
          display: grid;
          grid-template-rows: subgrid;
        }
        .fd-maint__services-card,
        .fd-maint__team-card {
          grid-row: 1 / -1;
          display: grid;
          grid-template-rows: subgrid;
          background: #faf9f6;
          border: 1px solid #e8e6e2;
          padding: 1.5rem;
        }
        .fd-maint__merged .mv12-crosshead {
          grid-row: 1;
          margin-bottom: 0;
        }
        .fd-maint__merged .fd-maint__grid6 {
          grid-row: 2 / 4;
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          grid-template-rows: subgrid;
          gap: 1rem;
        }
        .fd-maint__merged .fd-maint__grid6-card {
          padding: 1.25rem;
          background: #fff;
          border: 1px solid #e8e6e2;
          text-align: center;
          transition: border-color 0.2s;
        }
        .fd-maint__merged .fd-maint__grid6-card:hover { border-color: #1a1a1a; }
        .fd-maint__merged .fd-maint__grid6-icon {
          display: block;
          font-size: 1.1rem;
          color: #1a1a1a;
          margin-bottom: 0.75rem;
        }
        .fd-maint__merged .fd-maint__grid6-card h4 {
          font-size: 0.78rem;
          text-transform: uppercase;
          letter-spacing: 0.05em;
          margin-bottom: 0.4rem;
          color: #1a1a1a;
        }
        .fd-maint__merged .fd-maint__grid6-card p {
          font-size: 0.7rem;
          color: #7a7a7a;
          margin: 0;
          line-height: 1.4;
        }
        .fd-maint__facility-card {
          background: #faf9f6;
          border: 1px solid #e8e6e2;
          padding: 1.5rem;
          margin-top: 1rem;
        }
        .fd-maint__team-grid {
          grid-row: 2 / 4;
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          grid-template-rows: subgrid;
          gap: 1rem;
        }
        .fd-maint__team-member {
          padding: 1.25rem;
          background: #fff;
          border: 1px solid #e8e6e2;
          text-align: center;
          transition: border-color 0.2s;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          gap: 0.25rem;
        }
        .fd-maint__team-member:hover { border-color: #1a1a1a; }
        .fd-maint__team-carousel {
          position: relative;
        }
        .fd-maint__team-chevron {
          position: absolute;
          top: 50%;
          transform: translateY(-50%);
          background: none;
          border: none;
          font-size: 1.2rem;
          color: #aaa;
          cursor: pointer;
          padding: 0.25rem;
          line-height: 1;
          transition: color 0.2s;
        }
        .fd-maint__team-chevron:hover { color: #1a1a1a; }
        .fd-maint__team-chevron--left { left: 0.25rem; }
        .fd-maint__team-chevron--right { right: 0.25rem; }
        .fd-maint__team-dots {
          display: flex;
          gap: 0.3rem;
          margin-top: 0.25rem;
        }
        .fd-maint__team-dot {
          width: 5px;
          height: 5px;
          border-radius: 50%;
          background: #d4d4d4;
          cursor: pointer;
          transition: background 0.2s;
        }
        .fd-maint__team-dot--active { background: #1a1a1a; }
        .fd-maint__team-member strong {
          display: block;
          font-size: 0.78rem;
        }
        .fd-maint__team-member span {
          font-size: 0.6rem;
          color: #7a7a7a;
          line-height: 1.15;
        }
        .fd-maint__merged .mv12-portraits__row {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 1rem;
          margin-bottom: 1.5rem;
        }
        .fd-maint__merged .mv12-portraits__person { text-align: center; }
        .fd-maint__merged .mv12-portraits__circle {
          width: 56px;
          height: 64px;
          border-radius: 4px;
          background: #1a1a1a;
          color: #fff;
          display: flex;
          align-items: center;
          justify-content: center;
          font-family: 'Share Tech Mono', monospace;
          font-size: 0.75rem;
          margin: 0;
        }
        .fd-maint__merged .mv12-portraits__person strong {
          display: block;
          font-size: 0.78rem;
          margin-bottom: 0.25rem;
        }
        .fd-maint__merged .mv12-portraits__person span {
          font-size: 0.6rem;
          color: #7a7a7a;
          line-height: 1.4;
        }
        .fd-maint__merged .mv12-strip {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 0.5rem;
        }
        .fd-maint__merged .mv12-strip__item {
          text-align: center;
        }
        .fd-maint__merged .mv12-strip__img-placeholder {
          height: 80px;
          background: #f0eeeb;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 1.3rem;
          color: #7a7a7a;
          margin-bottom: 0.5rem;
        }
        .fd-maint__merged .mv12-strip__item span {
          font-size: 0.55rem;
          color: #7a7a7a;
          font-family: 'Share Tech Mono', monospace;
        }
        @media (max-width: 768px) {
          .fd-maint__merged-cols { grid-template-columns: 1fr; }
          .fd-maint__merged-left { padding-right: 0; }
          .fd-maint__merged .fd-maint__grid6 { grid-template-columns: repeat(2, 1fr); }
          .fd-maint__merged .mv12-portraits__row { grid-template-columns: repeat(2, 1fr); }
          .fd-maint__team-grid { grid-template-columns: repeat(2, 1fr); }
        }
        @media (max-width: 480px) {
          .fd-maint__merged .fd-maint__grid6 { grid-template-columns: 1fr; }
          .fd-maint__merged .mv12-strip { grid-template-columns: repeat(2, 1fr); }
        }

        /* ===== MAINTENANCE V5 — Big Stats ===== */
        .fd-maint__big-stats {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 1.5rem;
          margin-bottom: 2.5rem;
          text-align: center;
        }

        .fd-maint__big-stat-value {
          display: block;
          font-family: 'Space Grotesk', sans-serif;
          font-size: 2.5rem;
          font-weight: 700;
          color: #1a1a1a;
          line-height: 1;
        }

        .fd-maint__big-stat-label {
          display: block;
          font-family: 'Share Tech Mono', monospace;
          font-size: 0.65rem;
          text-transform: uppercase;
          letter-spacing: 0.1em;
          color: #7a7a7a;
          margin-top: 0.5rem;
        }

        @media (max-width: 768px) {
          .fd-maint__big-stats {
            grid-template-columns: repeat(2, 1fr);
            gap: 1rem;
          }
          .fd-maint__big-stat-value { font-size: 1.8rem; }
        }

        /* ===== MAINTENANCE V6 — Split Layout ===== */
        .fd-maint__split-wrap {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 3rem;
          align-items: start;
        }

        .fd-maint__split-right {
          display: flex;
          flex-direction: column;
          gap: 0;
        }

        .fd-maint__split-service {
          display: flex;
          gap: 1rem;
          align-items: flex-start;
          padding: 1rem 0;
          border-bottom: 1px solid #e8e6e2;
        }

        .fd-maint__split-service:last-child {
          border-bottom: none;
        }

        .fd-maint__split-service h3 {
          font-size: 0.85rem;
          font-weight: 600;
          margin-bottom: 0.25rem;
        }

        .fd-maint__split-service p {
          font-size: 0.78rem;
          color: #7a7a7a;
          margin: 0;
          line-height: 1.4;
        }

        @media (max-width: 768px) {
          .fd-maint__split-wrap {
            grid-template-columns: 1fr;
            gap: 2rem;
          }
        }

        /* ===== MAINTENANCE V7 — Image Overlay ===== */
        .fd-maint--overlay {
          position: relative;
          min-height: 420px;
          display: flex;
          align-items: center;
          justify-content: center;
          overflow: hidden;
          background: #1a1a1a;
        }

        .fd-maint__overlay-bg {
          position: absolute;
          inset: 0;
        }

        .fd-maint__overlay-img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          opacity: 0.35;
        }

        .fd-maint__overlay-gradient {
          position: absolute;
          inset: 0;
          background: linear-gradient(to bottom, rgba(26,26,26,0.3), rgba(26,26,26,0.8));
        }

        .fd-maint__overlay-content {
          position: relative;
          z-index: 2;
          text-align: center;
          padding: 3rem 2rem;
        }

        .fd-maint__overlay-stats {
          display: flex;
          gap: 2rem;
          justify-content: center;
          margin-top: 1.5rem;
        }

        .fd-maint__overlay-stat {
          text-align: center;
        }

        .fd-maint__overlay-stat span {
          display: block;
          font-family: 'Space Grotesk', sans-serif;
          font-size: 1.5rem;
          font-weight: 700;
          color: #fff;
        }

        .fd-maint__overlay-stat small {
          font-family: 'Share Tech Mono', monospace;
          font-size: 0.6rem;
          text-transform: uppercase;
          letter-spacing: 0.1em;
          color: rgba(255,255,255,0.6);
        }

        /* ===== MAINTENANCE V8 — Process Flow ===== */
        .fd-maint__flow {
          display: flex;
          align-items: flex-start;
          justify-content: center;
          gap: 0;
          margin: 2rem 0;
          flex-wrap: wrap;
        }

        .fd-maint__flow-step {
          text-align: center;
          flex: 0 0 140px;
          padding: 1rem 0.5rem;
        }

        .fd-maint__flow-num {
          font-family: 'Share Tech Mono', monospace;
          font-size: 0.7rem;
          color: #7a7a7a;
          letter-spacing: 0.1em;
          margin-bottom: 0.5rem;
        }

        .fd-maint__flow-step h4 {
          font-size: 0.8rem;
          font-weight: 600;
          margin-bottom: 0.3rem;
          color: #1a1a1a;
        }

        .fd-maint__flow-step p {
          font-size: 0.7rem;
          color: #7a7a7a;
          margin: 0;
          line-height: 1.4;
        }

        .fd-maint__flow-arrow {
          width: 24px;
          height: 2px;
          background: #e8e6e2;
          align-self: center;
          margin-top: -1rem;
          flex-shrink: 0;
        }

        @media (max-width: 768px) {
          .fd-maint__flow {
            flex-direction: column;
            align-items: center;
          }
          .fd-maint__flow-arrow {
            width: 2px;
            height: 24px;
            margin-top: 0;
          }
        }

        /* ===== MAINTENANCE V9 — Trust Signals ===== */
        .fd-maint__trust-certs {
          display: flex;
          gap: 2rem;
          justify-content: center;
          align-items: center;
          margin: 2rem 0;
          flex-wrap: wrap;
        }

        .fd-maint__trust-cert {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 0.5rem;
          padding: 1.25rem 1.5rem;
          background: #fff;
          border: 1px solid #e8e6e2;
          text-align: center;
        }

        .fd-maint__trust-cert span {
          font-size: 0.75rem;
          color: #4a4a4a;
        }

        .fd-maint__trust-copy {
          max-width: 580px;
          margin: 0 auto 1.5rem;
          text-align: center;
        }

        .fd-maint__trust-copy p {
          font-size: 0.85rem;
          line-height: 1.7;
          color: #4a4a4a;
        }

        .fd-maint__trust-summary {
          max-width: 640px;
          margin: 2rem auto 0;
          padding-top: 1.5rem;
          border-top: 1px solid #e8e6e2;
          font-family: 'Share Tech Mono', monospace;
          font-size: 0.7rem;
          line-height: 2;
          color: #7a7a7a;
          text-align: center;
          letter-spacing: 0.01em;
        }

        /* ===== MAINTENANCE — Unified Grid (services + team + facility) ===== */
        .fd-maint__unified {
          display: grid;
          grid-template-columns: repeat(5, 1fr);
          gap: 0;
          margin: 1.5rem 0;
          border: 1px solid #e8e6e2;
          background: #fff;
        }

        .fd-maint__unified-card {
          padding: 1.25rem;
          text-align: center;
          border-right: 1px solid #e8e6e2;
          border-bottom: 1px solid #e8e6e2;
          transition: background 0.2s;
        }
        .fd-maint__unified-card:hover { background: #faf9f6; }
        .fd-maint__unified-card:nth-child(5n) { border-right: none; }

        .fd-maint__unified-icon {
          display: block;
          font-size: 1.1rem;
          color: #1a1a1a;
          margin-bottom: 0.75rem;
        }

        .fd-maint__unified-card h4 {
          font-size: 0.78rem;
          text-transform: uppercase;
          letter-spacing: 0.05em;
          margin-bottom: 0.4rem;
          color: #1a1a1a;
        }

        .fd-maint__unified-card p {
          font-size: 0.7rem;
          color: #7a7a7a;
          margin: 0;
          line-height: 1.4;
        }

        /* Person variant */
        .fd-maint__unified-card--person {
          background: #faf9f6;
        }
        .fd-maint__unified-card--person:hover { background: #f0eeeb; }

        .fd-maint__unified-avatar {
          width: 48px;
          height: 56px;
          border-radius: 4px;
          background: #1a1a1a;
          color: #fff;
          display: flex;
          align-items: center;
          justify-content: center;
          font-family: 'Share Tech Mono', monospace;
          font-size: 0.7rem;
          margin: 0 auto 0.6rem;
        }
        .fd-maint__unified-avatar--more {
          background: #e8e6e2;
          color: #1a1a1a;
        }

        /* Facility variant */
        .fd-maint__unified-card--facility {
          background: #f0eeeb;
        }
        .fd-maint__unified-card--facility:hover { background: #e8e6e2; }
        .fd-maint__unified-card--facility .fd-maint__unified-icon {
          color: #7a7a7a;
          font-size: 1.3rem;
        }

        @media (max-width: 768px) {
          .fd-maint__unified {
            grid-template-columns: repeat(3, 1fr);
          }
          .fd-maint__unified-card:nth-child(5n) { border-right: 1px solid #e8e6e2; }
          .fd-maint__unified-card:nth-child(3n) { border-right: none; }
        }

        @media (max-width: 480px) {
          .fd-maint__unified {
            grid-template-columns: repeat(2, 1fr);
          }
          .fd-maint__unified-card:nth-child(3n) { border-right: 1px solid #e8e6e2; }
          .fd-maint__unified-card:nth-child(2n) { border-right: none; }
        }

        /* ===== MAINTENANCE PILLARS (v2) ===== */
        .fd-maint__pillars {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 1rem;
          margin-bottom: 2rem;
        }

        .fd-maint__pillar {
          text-align: center;
          padding: 1.25rem 1rem;
          background: #fff;
          border: 1px solid #e8e6e2;
        }

        .fd-maint__pillar i {
          font-size: 1.2rem;
          color: #1a1a1a;
          margin-bottom: 0.75rem;
          display: block;
        }

        .fd-maint__pillar h4 {
          font-size: 0.75rem;
          text-transform: uppercase;
          letter-spacing: 0.05em;
          margin-bottom: 0.4rem;
        }

        .fd-maint__pillar p {
          font-size: 0.7rem;
          color: #666;
          margin: 0;
          line-height: 1.4;
        }

        @media (max-width: 768px) {
          .fd-maint__pillars {
            grid-template-columns: 1fr;
          }
        }

        /* ===== PARALLAX SECTIONS ===== */
        .parallax-section {
          position: relative;
          height: 260px;
          overflow: hidden;
          display: flex;
          align-items: center;
          justify-content: center;
          max-width: 100vw;
          clip-path: inset(0);
        }

        .parallax-section__image-container {
          position: absolute;
          inset: -15%;
          z-index: 0;
        }

        .parallax-section__image {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }

        .parallax-section__content {
          position: relative;
          z-index: 2;
          color: #fff;
          padding: 2rem;
          text-align: center;
        }

        .parallax-section__number {
          font-family: 'Space Grotesk', sans-serif;
          font-size: clamp(2.5rem, 6vw, 5rem);
          font-weight: 700;
          -webkit-text-stroke: 1px rgba(255, 255, 255, 0.35);
          color: transparent;
          line-height: 1;
          letter-spacing: -0.02em;
          flex-shrink: 0;
        }

        .parallax-section__label {
          display: block;
          font-size: 0.7rem;
          text-transform: uppercase;
          letter-spacing: 0.3em;
          margin-bottom: 1rem;
          opacity: 0.8;
        }

        .parallax-section__title {
          font-family: 'Space Grotesk', sans-serif;
          font-size: clamp(4rem, 12vw, 9rem);
          font-weight: 700;
          text-transform: uppercase;
          margin: 0 0 1rem;
          letter-spacing: -0.02em;
          text-shadow: 0 2px 8px rgba(0,0,0,0.3);
          color: #fff;
          opacity: 0.7;
          -webkit-text-stroke: 2px #888;
          paint-order: stroke fill;
        }

        .parallax-section__text {
          font-size: 1.1rem;
          opacity: 0.9;
          max-width: 400px;
          margin: 0 auto;
        }

        /* Dark overlay for image */
        .parallax-section__overlay {
          position: absolute;
          inset: 0;
          background: rgba(0, 0, 0, 0.5);
          z-index: 1;
        }

        /* Layered wave effects */
        .parallax-section__wave {
          position: absolute;
          left: 0;
          width: 100%;
          z-index: 2;
          pointer-events: none;
        }

        .parallax-section__wave--top {
          top: 0;
          height: 60px;
        }

        .parallax-section__wave--bottom {
          bottom: 0;
          height: 120px;
        }

        /* ===== SCROLLING STRIPS WRAPPER ===== */
        .scrolling-strips-wrapper {
          position: relative;
          margin-bottom: 0;
          background: #faf9f6;
        }

        .scrolling-strips-spacer {
          height: 60vh;
          pointer-events: none;
        }

        /* Background texture — scrolls behind sticky strips */
        .scrolling-strips-bg {
          position: absolute;
          inset: 0;
          pointer-events: none;
          overflow: hidden;
        }
        .scrolling-strips-bg__num {
          position: absolute;
          font-family: 'Space Grotesk', sans-serif;
          font-weight: 700;
          text-transform: uppercase;
          color: rgba(0,0,0,0.03);
          line-height: 1;
        }
        .scrolling-strips-bg__num--1 {
          font-size: clamp(8rem, 20vw, 18rem);
          top: 4%;
          left: -2%;
          transform: rotate(-4deg);
        }
        .scrolling-strips-bg__num--2 {
          font-size: clamp(6rem, 16vw, 14rem);
          top: 12%;
          right: 5%;
          transform: rotate(2deg);
        }
        .scrolling-strips-bg__num--3 {
          font-size: clamp(5rem, 12vw, 10rem);
          top: 30%;
          left: 8%;
          transform: rotate(-2deg);
        }
        .scrolling-strips-bg__num--4 {
          font-size: clamp(4rem, 10vw, 8rem);
          top: 35%;
          right: 12%;
          transform: rotate(5deg);
        }
        .scrolling-strips-bg__num--5 {
          font-size: clamp(7rem, 18vw, 15rem);
          top: 55%;
          left: -1%;
          transform: rotate(3deg);
        }
        .scrolling-strips-bg__num--6 {
          font-size: clamp(5rem, 14vw, 11rem);
          top: 60%;
          right: 2%;
          transform: rotate(-3deg);
        }
        .scrolling-strips-bg__num--7 {
          font-size: clamp(6rem, 15vw, 12rem);
          top: 78%;
          left: 10%;
          transform: rotate(-5deg);
        }
        .scrolling-strips-bg__num--8 {
          font-size: clamp(4rem, 11vw, 9rem);
          top: 85%;
          right: 8%;
          transform: rotate(2deg);
        }
        .scrolling-strips-bg__grid {
          position: absolute;
          inset: 0;
          background-image:
            linear-gradient(rgba(0,0,0,0.04) 2.5px, transparent 2.5px),
            linear-gradient(90deg, rgba(0,0,0,0.04) 2.5px, transparent 2.5px);
          background-size: 140px 140px;
          -webkit-mask-image: linear-gradient(to bottom, transparent 0%, rgba(0,0,0,1) 15%, rgba(0,0,0,1) 85%, transparent 100%);
          mask-image: linear-gradient(to bottom, transparent 0%, rgba(0,0,0,1) 15%, rgba(0,0,0,1) 85%, transparent 100%);
        }
        .scrolling-strips-bg__cross {
          position: absolute;
          font-family: 'Share Tech Mono', monospace;
          font-size: 1.5rem;
          color: rgba(0,0,0,0.04);
          line-height: 1;
        }
        .scrolling-strips-bg__cross--1 {
          top: 160px;
          left: 240px;
          transform: translate(-50%, -50%);
        }
        .scrolling-strips-bg__cross--2 {
          top: 320px;
          left: 560px;
          transform: translate(-50%, -50%);
        }
        .scrolling-strips-bg__cross--3 {
          top: 480px;
          left: 160px;
          transform: translate(-50%, -50%);
        }
        .scrolling-strips-bg__cross--4 {
          top: 65%;
          left: 70%;
          transform: translate(-50%, -50%);
        }
        .scrolling-strips-bg__cross--5 {
          top: 82%;
          left: 40%;
          transform: translate(-50%, -50%);
        }
        .scrolling-strips-bg__label {
          position: absolute;
          font-family: 'Share Tech Mono', monospace;
          letter-spacing: 0.2em;
          text-transform: uppercase;
          color: rgba(0,0,0,0.035);
        }
        .scrolling-strips-bg__label--1 {
          font-size: 0.65rem;
          top: 40%;
          left: 50%;
          transform: translateX(-50%);
        }
        .scrolling-strips-bg__label--2 {
          font-size: 0.55rem;
          top: 25%;
          left: 50%;
          transform: translateX(-50%);
        }
        .scrolling-strips-bg__label--3 {
          font-size: 0.6rem;
          top: 55%;
          left: 20%;
        }
        .scrolling-strips-bg__label--4 {
          font-size: 0.6rem;
          top: 75%;
          right: 15%;
          left: auto;
        }
        .scrolling-strips-bg__label--5 {
          font-size: 0.55rem;
          top: 90%;
          left: 45%;
        }


        /* ===== SCROLL REVEAL ANIMATION ===== */
        .reveal-element {
          opacity: 0;
          transform: translateY(80px) scale(0.95);
          transition: opacity 1s ease, transform 1s cubic-bezier(0.16, 1, 0.3, 1);
        }

        .reveal-element.visible {
          opacity: 1;
          transform: translateY(0) scale(1);
        }

        /* ===== UNION JACK PLACEMENTS ===== */
        .union-jack {
          display: inline-block;
          vertical-align: middle;
        }

        /* Hero coordinates - between N and W */
        .union-jack--coords {
          margin: 0 0.5rem;
        }

        /* Footer coordinates - between N and W */
        .union-jack--footer {
          margin: 0 0.5rem;
        }

        /* ===== RESPONSIVE ===== */
        @media (max-width: 1024px) {
          .fd-hero__image {
            width: 25%;
          }

          .fd-hero__scroll-container {
            left: 25%;
            right: 25%;
          }
        }

        @media (max-width: 768px) {
          .fd-hero__image {
            display: none;
          }

          .fd-hero__scroll-container {
            left: 2rem;
            right: 2rem;
          }

          .fd-hero__progress {
            right: 1rem;
          }

          .fd-nav__accordion {
            flex-wrap: wrap;
          }

          .fd-nav__item {
            flex: 1 1 33.333%;
          }
        }

        @keyframes wfFadeIn {
          from { opacity: 0; transform: translateY(8px); }
          to { opacity: 1; transform: translateY(0); }
        }

        .wfi-q__expanded {
          background: #faf9f6;
          box-shadow: 0 4px 40px rgba(0, 0, 0, 0.06);
          position: relative;
          animation: wfFadeIn 0.35s ease;
        }
        .wfi-q__close {
          position: absolute; top: 12px; right: 12px;
          background: none; border: none; font-size: 18px; color: #999;
          cursor: pointer; z-index: 2; padding: 4px 8px; line-height: 1;
        }
        .wfi-q__close:hover { color: #333; }
        .wfi-q__card-body {
          padding: 2rem;
          display: grid; grid-template-columns: 1fr 1fr; gap: 2rem;
          align-items: center;
        }
        .wfi-q__card-text h3 {
          font-size: clamp(1.25rem, 2.5vw, 1.5rem);
          font-weight: 700; margin: 0 0 1rem;
          text-transform: uppercase; letter-spacing: -0.01em; line-height: 1.2;
        }
        .wfi-q__verb { color: #1a1a1a; }
        .wfi-q__noun { color: #5a5a5a; }
        .wfi-q__card-text p {
          font-size: 0.95rem; color: #666; line-height: 1.7; margin: 0;
        }
        .wfi-q__card-img {
          width: 100%; height: 180px; background: #2a2a2a;
          border-radius: 6px; overflow: hidden; position: relative;
        }
        .wfi-q__card-slide {
          position: absolute; inset: 0; background-size: cover; background-position: center;
          opacity: 0; transition: opacity 0.5s ease;
        }
        .wfi-q__card-slide.active { opacity: 1; }
        .wfi-q__card-img-label {
          position: absolute; bottom: 0.75rem; left: 0.75rem;
          font-family: 'Share Tech Mono', monospace;
          font-size: 0.5rem; letter-spacing: 0.1em;
          color: rgba(255, 255, 255, 0.5); text-transform: uppercase;
        }
        .wfi-q__card-footer {
          padding: 1.25rem 2rem;
          border-top: 1px solid rgba(26, 26, 26, 0.06);
          display: flex; align-items: center; justify-content: space-between;
        }
        .wfi-q__footer-left {
          display: flex; align-items: center; gap: 1rem;
        }
        .wfi-q__dots { display: flex; gap: 4px; }
        .wfi-q__dot {
          width: 4px; height: 4px; background: rgba(26, 26, 26, 0.15);
          border-radius: 2px; transition: all 0.25s ease; cursor: pointer;
        }
        .wfi-q__dot:hover { background: rgba(26, 26, 26, 0.4); }
        .wfi-q__dot.active { width: 16px; background: #1a1a1a; }
        .wfi-q__counter {
          font-family: 'Share Tech Mono', monospace;
          font-size: 0.6rem; color: rgba(26, 26, 26, 0.35); letter-spacing: 0.1em;
        }
        .wfi-q__arrows { display: flex; gap: 0.5rem; }
        .wfi-q__arrows button {
          width: 36px; height: 36px; display: flex; align-items: center;
          justify-content: center; background: transparent;
          border: 1px solid rgba(26, 26, 26, 0.15); border-radius: 6px;
          cursor: pointer; color: rgba(26, 26, 26, 0.4); transition: all 0.25s ease;
        }
        .wfi-q__arrows button:hover {
          background: #1a1a1a; border-color: #1a1a1a; color: #fff;
        }
        .wfi-q__cta-full {
          display: flex; align-items: center; justify-content: center; gap: 0.5rem;
          padding: 0.75rem; text-decoration: none; color: #1a1a1a;
          font-size: 0.78rem; font-weight: 600; text-transform: uppercase;
          letter-spacing: 0.1em; border-top: 1px solid rgba(26, 26, 26, 0.06);
          transition: background 0.2s; background: #faf9f6; cursor: pointer;
        }
        .wfi-q__cta-full:hover { background: #f5f3ef; color: #1a1a1a; }
        .wfi-q__cta-full span { transition: transform 0.2s; display: inline-block; color: #1a1a1a; }
        .wfi-q__cta-full:hover span { transform: translateX(4px); color: #1a1a1a; }

        /* --- Why We Fly + Learn More --- */
        .wfv-merge__fly {
          display: flex; align-items: center; justify-content: space-between;
          padding: 0.85rem 1.25rem; background: #faf9f6;
          border: 1px solid #e8e6e2; border-radius: 8px 8px 0 0;
          cursor: pointer; transition: background 0.2s, border-color 0.2s;
          width: 100%;
        }
        .wfv-merge__fly:hover { background: #f5f3ef; border-color: #d4d0c8; }
        .wfv-merge__fly--open { border-radius: 8px 8px 0 0; border-bottom: none; }
        .wfv-merge__fly * { cursor: pointer; }
        .wfv-merge__center {
          display: flex; flex-direction: column; align-items: center; gap: 0.4rem;
          flex: 1; pointer-events: none;
        }
        .wfv-merge__thumbs { display: flex; flex-shrink: 0; }
        .wfv-merge__thumb {
          width: 44px; height: 44px; border-radius: 6px;
          background-size: cover; background-position: center;
          border: 2px solid #faf9f6; position: relative;
          margin-left: -12px; pointer-events: none;
        }
        .wfv-merge__thumb:first-child { margin-left: 0; }
        .wfv-merge__title {
          font-size: 0.8rem; font-weight: 600; color: #1a1a1a;
          text-transform: uppercase; letter-spacing: 0.08em; white-space: nowrap;
        }
        .wfv-merge__pulse {
          width: 6px; height: 6px; border-radius: 50%; background: #999;
          animation: wfvPulse 2s ease-in-out infinite;
        }
        .wfv-merge__pulse--hidden { opacity: 0; animation: none; }
        @keyframes wfvPulse {
          0%, 100% { opacity: 0.4; transform: scale(1); }
          50% { opacity: 1; transform: scale(1.4); }
        }

        /* Expandable card area */
        .wfv-merge__expand {
          display: grid;
          grid-template-rows: 0fr;
          transition: grid-template-rows 0.4s ease;
        }
        .wfv-merge__expand--open {
          grid-template-rows: 1fr;
        }
        .wfv-merge__expand-inner {
          overflow: hidden;
        }
        .wfv-merge__expand .wfi-q__expanded {
          animation: none; border-radius: 0;
          border-left: 1px solid #e8e6e2; border-right: 1px solid #e8e6e2;
        }

        .wfv-merge__cta {
          display: flex; align-items: center; justify-content: center; gap: 0.5rem;
          padding: 0.45rem; background: #4a4a4a; color: #fff;
          font-size: 0.78rem; font-weight: 600; text-transform: uppercase;
          letter-spacing: 0.1em; text-decoration: none;
          border: 1px solid #3a3a3a; border-radius: 0 0 8px 8px;
          transition: background 0.2s;
          cursor: pointer;
        }
        .wfv-merge__cta:hover { background: #5a5a5a; color: #fff; }
        .wfv-merge__cta span { transition: transform 0.2s; display: inline-block; color: #fff; pointer-events: none; }
        .wfv-merge__cta:hover span { transform: translateX(4px); color: #fff; }
        @media (max-width: 768px) {
          .wfi-q__card-body { grid-template-columns: 1fr; gap: 1.5rem; }
          .wfi-q__card-img { height: 200px; }
        }


        /* =================================================================
           MAINTENANCE V11 — THE FULL STORY
        ================================================================= */
        .mv11 {
          max-width: 960px;
          margin: 0 auto;
          padding: 4rem 2rem;
          font-family: 'Space Grotesk', -apple-system, sans-serif;
          color: #1a1a1a;
        }

        .mv11-section-label {
          font-family: 'Share Tech Mono', monospace;
          font-size: 0.7rem;
          text-transform: uppercase;
          letter-spacing: 0.15em;
          color: #7a7a7a;
          margin-bottom: 1.5rem;
          display: block;
        }

        /* Origin */
        .mv11-origin {
          text-align: center;
          margin-bottom: 4rem;
          padding-bottom: 3rem;
          border-bottom: 1px solid #e8e6e2;
        }
        .mv11-origin__badge {
          display: inline-block;
          font-family: 'Share Tech Mono', monospace;
          font-size: 0.65rem;
          letter-spacing: 0.2em;
          color: #7a7a7a;
          border: 1px solid #e8e6e2;
          padding: 0.35rem 1rem;
          margin-bottom: 1.5rem;
        }
        .mv11-origin__title {
          font-size: clamp(1.5rem, 3.5vw, 2.2rem);
          font-weight: 700;
          line-height: 1.2;
          margin-bottom: 1.5rem;
        }
        .mv11-origin__text {
          font-size: 0.95rem;
          line-height: 1.8;
          color: #4a4a4a;
          max-width: 680px;
          margin: 0 auto;
        }
        .mv11-origin__sig {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 1rem;
          margin-top: 2rem;
        }
        .mv11-origin__sig-line {
          width: 40px;
          height: 1px;
          background: #e8e6e2;
        }
        .mv11-origin__sig-name {
          font-family: 'Share Tech Mono', monospace;
          font-size: 0.7rem;
          letter-spacing: 0.05em;
          color: #7a7a7a;
        }

        /* Timeline */
        .mv11-timeline {
          margin-bottom: 4rem;
          padding-bottom: 3rem;
          border-bottom: 1px solid #e8e6e2;
        }
        .mv11-timeline__track {
          display: flex;
          justify-content: space-between;
          position: relative;
        }
        .mv11-timeline__track::before {
          content: '';
          position: absolute;
          top: 26px;
          left: 0;
          right: 0;
          height: 1px;
          background: #e8e6e2;
        }
        .mv11-timeline__item {
          display: flex;
          flex-direction: column;
          align-items: center;
          text-align: center;
          position: relative;
          flex: 1;
        }
        .mv11-timeline__year {
          font-family: 'Share Tech Mono', monospace;
          font-size: 0.75rem;
          font-weight: 600;
          margin-bottom: 0.5rem;
        }
        .mv11-timeline__dot {
          width: 10px;
          height: 10px;
          border-radius: 50%;
          background: #1a1a1a;
          margin-bottom: 0.75rem;
          position: relative;
          z-index: 1;
        }
        .mv11-timeline__event {
          font-size: 0.7rem;
          color: #7a7a7a;
          max-width: 140px;
          line-height: 1.4;
        }

        /* Team Grid */
        .mv11-team {
          margin-bottom: 4rem;
          padding-bottom: 3rem;
          border-bottom: 1px solid #e8e6e2;
        }
        .mv11-team__grid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 1.25rem;
        }
        .mv11-team__card {
          padding: 1.5rem;
          border: 1px solid #e8e6e2;
          background: #fff;
        }
        .mv11-team__avatar {
          width: 40px;
          height: 40px;
          border-radius: 50%;
          background: #1a1a1a;
          color: #fff;
          display: flex;
          align-items: center;
          justify-content: center;
          font-family: 'Share Tech Mono', monospace;
          font-size: 0.7rem;
          margin-bottom: 1rem;
        }
        .mv11-team__card h4 {
          font-size: 0.9rem;
          font-weight: 600;
          margin-bottom: 0.25rem;
        }
        .mv11-team__role {
          font-family: 'Share Tech Mono', monospace;
          font-size: 0.65rem;
          color: #7a7a7a;
          text-transform: uppercase;
          letter-spacing: 0.1em;
          display: block;
          margin-bottom: 0.75rem;
        }
        .mv11-team__card p {
          font-size: 0.78rem;
          line-height: 1.6;
          color: #4a4a4a;
          margin: 0;
        }

        /* Facility Blueprint */
        .mv11-facility {
          margin-bottom: 4rem;
          padding-bottom: 3rem;
          border-bottom: 1px solid #e8e6e2;
        }
        .mv11-facility__blueprint {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 1.25rem;
          margin-bottom: 1.5rem;
        }
        .mv11-facility__spec {
          text-align: center;
          padding: 1.5rem 1rem;
          border: 1px solid #e8e6e2;
          background: #fff;
        }
        .mv11-facility__spec-value {
          display: block;
          font-size: 2rem;
          font-weight: 700;
          line-height: 1;
        }
        .mv11-facility__spec-unit {
          display: block;
          font-family: 'Share Tech Mono', monospace;
          font-size: 0.65rem;
          text-transform: uppercase;
          letter-spacing: 0.1em;
          color: #7a7a7a;
          margin-top: 0.25rem;
        }
        .mv11-facility__spec-label {
          display: block;
          font-size: 0.7rem;
          color: #4a4a4a;
          margin-top: 0.75rem;
          line-height: 1.4;
        }
        .mv11-facility__location {
          text-align: center;
          font-size: 0.78rem;
          color: #7a7a7a;
        }
        .mv11-facility__location i {
          margin-right: 0.5rem;
        }

        /* Testimonials */
        .mv11-testimonials {
          margin-bottom: 4rem;
          padding-bottom: 3rem;
          border-bottom: 1px solid #e8e6e2;
        }
        .mv11-testimonials__grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 1.25rem;
        }
        .mv11-testimonial {
          padding: 1.5rem;
          border: 1px solid #e8e6e2;
          background: #fff;
          margin: 0;
        }
        .mv11-testimonial p {
          font-size: 0.82rem;
          line-height: 1.7;
          color: #4a4a4a;
          font-style: italic;
          margin: 0 0 1rem;
        }
        .mv11-testimonial cite {
          font-style: normal;
          font-family: 'Share Tech Mono', monospace;
          font-size: 0.65rem;
          color: #7a7a7a;
          letter-spacing: 0.05em;
        }

        /* Types Matrix */
        .mv11-types {
          margin-bottom: 4rem;
          padding-bottom: 3rem;
          border-bottom: 1px solid #e8e6e2;
        }
        .mv11-types__matrix {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 1.25rem;
        }
        .mv11-types__group {
          padding: 1.5rem;
          border: 1px solid #e8e6e2;
          background: #fff;
        }
        .mv11-types__mfr {
          font-size: 0.85rem;
          font-weight: 700;
          margin-bottom: 0.5rem;
        }
        .mv11-types__tag {
          display: inline-block;
          font-family: 'Share Tech Mono', monospace;
          font-size: 0.55rem;
          letter-spacing: 0.05em;
          text-transform: uppercase;
          padding: 0.2rem 0.5rem;
          border: 1px solid #e8e6e2;
          margin: 0 0.25rem 0.25rem 0;
        }
        .mv11-types__tag--primary {
          background: #1a1a1a;
          color: #fff;
          border-color: #1a1a1a;
        }
        .mv11-types__tag--accent {
          background: #4a4a4a;
          color: #fff;
          border-color: #4a4a4a;
        }
        .mv11-types__models {
          margin-top: 0.75rem;
        }
        .mv11-types__models span {
          display: block;
          font-size: 0.75rem;
          color: #4a4a4a;
          padding: 0.25rem 0;
          border-bottom: 1px solid #f0f0f0;
        }

        /* Dashboard */
        .mv11-dashboard {
          margin-bottom: 4rem;
          padding-bottom: 3rem;
          border-bottom: 1px solid #e8e6e2;
        }
        .mv11-dashboard__grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 1rem;
        }
        .mv11-dashboard__stat {
          padding: 1.25rem;
          border: 1px solid #e8e6e2;
          background: #fff;
        }
        .mv11-dashboard__value {
          display: block;
          font-size: 1.5rem;
          font-weight: 700;
          margin-bottom: 0.25rem;
        }
        .mv11-dashboard__label {
          display: block;
          font-size: 0.7rem;
          color: #7a7a7a;
          margin-bottom: 0.75rem;
        }
        .mv11-dashboard__bar {
          display: block;
          height: 3px;
          background: #1a1a1a;
          transition: width 0.6s ease;
        }

        /* Certs Wall */
        .mv11-certs {
          margin-bottom: 4rem;
          padding-bottom: 3rem;
          border-bottom: 1px solid #e8e6e2;
        }
        .mv11-certs__wall {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 1rem;
        }
        .mv11-certs__badge {
          text-align: center;
          padding: 1.5rem 1rem;
          border: 1px solid #e8e6e2;
          background: #fff;
        }
        .mv11-certs__badge i {
          display: block;
          font-size: 1.2rem;
          margin-bottom: 0.75rem;
          color: #1a1a1a;
        }
        .mv11-certs__badge strong {
          display: block;
          font-size: 0.78rem;
          margin-bottom: 0.35rem;
        }
        .mv11-certs__badge span {
          font-size: 0.65rem;
          color: #7a7a7a;
          line-height: 1.4;
        }

        /* Manifesto */
        .mv11-manifesto {
          margin-bottom: 4rem;
          padding-bottom: 3rem;
          border-bottom: 1px solid #e8e6e2;
          text-align: center;
        }
        .mv11-manifesto__rule {
          width: 60px;
          height: 3px;
          background: #1a1a1a;
          margin: 0 auto 2rem;
        }
        .mv11-manifesto__heading {
          font-size: 0.75rem;
          text-transform: uppercase;
          letter-spacing: 0.2em;
          color: #7a7a7a;
          margin-bottom: 1rem;
        }
        .mv11-manifesto__text {
          font-size: 1.2rem;
          font-weight: 600;
          line-height: 1.5;
          max-width: 520px;
          margin: 0 auto 2.5rem;
        }
        .mv11-manifesto__pillars {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 1.5rem;
          text-align: left;
        }
        .mv11-manifesto__pillar {
          padding: 1.5rem;
          border: 1px solid #e8e6e2;
          background: #fff;
        }
        .mv11-manifesto__pillar-num {
          font-family: 'Share Tech Mono', monospace;
          font-size: 0.85rem;
          color: #7a7a7a;
          display: block;
          margin-bottom: 0.75rem;
        }
        .mv11-manifesto__pillar h4 {
          font-size: 0.85rem;
          font-weight: 600;
          margin-bottom: 0.5rem;
        }
        .mv11-manifesto__pillar p {
          font-size: 0.75rem;
          line-height: 1.6;
          color: #4a4a4a;
          margin: 0;
        }

        /* Services */
        .mv11-services {
          margin-bottom: 4rem;
          padding-bottom: 3rem;
          border-bottom: 1px solid #e8e6e2;
        }
        .mv11-services__item {
          display: flex;
          gap: 1.25rem;
          padding: 1.5rem 0;
          border-bottom: 1px solid #f0f0f0;
        }
        .mv11-services__item:last-child {
          border-bottom: none;
        }
        .mv11-services__icon {
          width: 40px;
          height: 40px;
          display: flex;
          align-items: center;
          justify-content: center;
          border: 1px solid #e8e6e2;
          flex-shrink: 0;
          font-size: 0.9rem;
          color: #1a1a1a;
        }
        .mv11-services__content h4 {
          font-size: 0.85rem;
          font-weight: 600;
          margin-bottom: 0.5rem;
        }
        .mv11-services__content p {
          font-size: 0.78rem;
          line-height: 1.7;
          color: #4a4a4a;
          margin: 0;
        }
        .mv11-services__turnaround {
          display: flex;
          gap: 1rem;
          margin-top: 0.75rem;
        }
        .mv11-services__turnaround span {
          font-family: 'Share Tech Mono', monospace;
          font-size: 0.6rem;
          color: #7a7a7a;
          padding: 0.2rem 0.5rem;
          border: 1px solid #e8e6e2;
          letter-spacing: 0.03em;
        }

        /* Parts */
        .mv11-parts {
          margin-bottom: 4rem;
          padding-bottom: 3rem;
          border-bottom: 1px solid #e8e6e2;
        }
        .mv11-parts__grid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 1rem;
          margin-bottom: 1.5rem;
        }
        .mv11-parts__category {
          padding: 1.25rem;
          border: 1px solid #e8e6e2;
          background: #fff;
        }
        .mv11-parts__count {
          display: block;
          font-size: 1.5rem;
          font-weight: 700;
        }
        .mv11-parts__type {
          display: block;
          font-family: 'Share Tech Mono', monospace;
          font-size: 0.6rem;
          text-transform: uppercase;
          letter-spacing: 0.1em;
          color: #7a7a7a;
          margin-bottom: 0.75rem;
        }
        .mv11-parts__category p {
          font-size: 0.7rem;
          line-height: 1.5;
          color: #4a4a4a;
          margin: 0;
        }
        .mv11-parts__total {
          text-align: center;
          font-size: 0.78rem;
          color: #4a4a4a;
        }

        /* AOG Map */
        .mv11-aog {
          margin-bottom: 4rem;
          padding-bottom: 3rem;
          border-bottom: 1px solid #e8e6e2;
        }
        .mv11-aog__map {
          position: relative;
          min-height: 240px;
          display: flex;
          align-items: center;
          justify-content: center;
          margin-bottom: 1rem;
        }
        .mv11-aog__center {
          text-align: center;
          position: relative;
          z-index: 2;
        }
        .mv11-aog__pin {
          display: block;
          font-family: 'Share Tech Mono', monospace;
          font-size: 1.25rem;
          font-weight: 700;
          margin-bottom: 0.25rem;
        }
        .mv11-aog__label {
          font-size: 0.7rem;
          color: #4a4a4a;
          line-height: 1.4;
        }
        .mv11-aog__rings {
          position: absolute;
          inset: 0;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .mv11-aog__ring {
          position: absolute;
          border-radius: 50%;
          border: 1px dashed #e8e6e2;
          display: flex;
          align-items: flex-end;
          justify-content: center;
          padding-bottom: 0.5rem;
        }
        .mv11-aog__ring span {
          font-family: 'Share Tech Mono', monospace;
          font-size: 0.55rem;
          color: #7a7a7a;
          white-space: nowrap;
        }
        .mv11-aog__ring--1 { width: 160px; height: 160px; }
        .mv11-aog__ring--2 { width: 260px; height: 260px; }
        .mv11-aog__ring--3 { width: 360px; height: 360px; }
        .mv11-aog__note {
          text-align: center;
          font-size: 0.72rem;
          color: #7a7a7a;
        }

        /* Compare Table */
        .mv11-compare {
          margin-bottom: 4rem;
          padding-bottom: 3rem;
          border-bottom: 1px solid #e8e6e2;
        }
        .mv11-compare__table {
          border: 1px solid #e8e6e2;
          overflow: hidden;
        }
        .mv11-compare__row {
          display: grid;
          grid-template-columns: 1fr 1fr 1.3fr;
          border-bottom: 1px solid #f0f0f0;
        }
        .mv11-compare__row:last-child {
          border-bottom: none;
        }
        .mv11-compare__row span {
          padding: 0.75rem 1rem;
          font-size: 0.72rem;
          color: #4a4a4a;
        }
        .mv11-compare__row--header {
          background: #1a1a1a;
        }
        .mv11-compare__row--header span {
          color: #fff;
          font-weight: 600;
          font-size: 0.7rem;
          text-transform: uppercase;
          letter-spacing: 0.05em;
        }
        .mv11-compare__highlight {
          background: #f5f4f1;
          font-weight: 500;
          color: #1a1a1a !important;
        }

        /* Trust */
        .mv11-trust {
          margin-bottom: 4rem;
          padding-bottom: 3rem;
          border-bottom: 1px solid #e8e6e2;
        }
        .mv11-trust__row {
          display: flex;
          justify-content: center;
          gap: 2rem;
          flex-wrap: wrap;
          margin-bottom: 1rem;
        }
        .mv11-trust__row span {
          font-family: 'Share Tech Mono', monospace;
          font-size: 0.65rem;
          text-transform: uppercase;
          letter-spacing: 0.1em;
          color: #4a4a4a;
          padding: 0.5rem 1rem;
          border: 1px solid #e8e6e2;
        }
        .mv11-trust__note {
          text-align: center;
          font-size: 0.72rem;
          color: #7a7a7a;
        }

        /* CTA */
        .mv11-cta {
          text-align: center;
          padding: 3rem 0;
        }
        .mv11-cta__headline {
          font-size: 1.3rem;
          font-weight: 600;
          margin-bottom: 0.75rem;
        }
        .mv11-cta__sub {
          font-size: 0.85rem;
          color: #4a4a4a;
          margin-bottom: 1.5rem;
        }
        .mv11-cta__actions {
          display: flex;
          gap: 0.75rem;
          justify-content: center;
          margin-bottom: 1rem;
        }
        .mv11-cta__btn {
          display: inline-block;
          padding: 0.75rem 1.5rem;
          font-size: 0.75rem;
          font-weight: 600;
          text-transform: uppercase;
          letter-spacing: 0.1em;
          text-decoration: none;
          transition: all 0.2s;
        }
        .mv11-cta__btn--primary {
          background: #1a1a1a;
          color: #fff;
          border: 1px solid #1a1a1a;
        }
        .mv11-cta__btn--primary:hover { background: #333; }
        .mv11-cta__btn--secondary {
          background: transparent;
          color: #1a1a1a;
          border: 1px solid #1a1a1a;
        }
        .mv11-cta__btn--secondary:hover { background: #1a1a1a; color: #fff; }
        .mv11-cta__hours {
          font-family: 'Share Tech Mono', monospace;
          font-size: 0.6rem;
          color: #7a7a7a;
          letter-spacing: 0.05em;
        }

        @media (max-width: 768px) {
          .mv11 { padding: 2rem 1.25rem; }
          .mv11-team__grid,
          .mv11-facility__blueprint,
          .mv11-testimonials__grid,
          .mv11-types__matrix,
          .mv11-dashboard__grid,
          .mv11-certs__wall,
          .mv11-manifesto__pillars,
          .mv11-parts__grid { grid-template-columns: 1fr; }
          .mv11-timeline__track { flex-direction: column; gap: 1.5rem; }
          .mv11-timeline__track::before { display: none; }
          .mv11-compare__row { grid-template-columns: 1fr; }
          .mv11-compare__row--header span:first-child { display: none; }
          .mv11-aog__ring--3 { width: 280px; height: 280px; }
        }


        /* =================================================================
           MAINTENANCE V12 — MAGAZINE EDITORIAL
        ================================================================= */
        .mv12 {
          max-width: 880px;
          margin: 0 auto;
          padding: 4rem 2rem;
          font-family: 'Space Grotesk', -apple-system, sans-serif;
          color: #1a1a1a;
        }

        .mv12-crosshead {
          font-family: 'Share Tech Mono', monospace;
          font-size: 0.7rem;
          text-transform: uppercase;
          letter-spacing: 0.15em;
          color: #7a7a7a;
          margin-bottom: 1.5rem;
          display: flex;
          align-items: center;
          gap: 1rem;
        }
        .mv12-crosshead::after {
          content: '';
          flex: 1;
          height: 1px;
          background: #e8e6e2;
        }
        .fd-maint__merged .mv12-crosshead::before {
          content: '';
          flex: 1;
          height: 1px;
          background: #e8e6e2;
        }

        /* Cover */
        .mv12-cover {
          text-align: center;
          margin-bottom: 3rem;
          padding-bottom: 2.5rem;
          border-bottom: 2px solid #1a1a1a;
        }
        .mv12-cover__issue {
          font-family: 'Share Tech Mono', monospace;
          font-size: 0.6rem;
          letter-spacing: 0.2em;
          text-transform: uppercase;
          color: #7a7a7a;
          display: block;
          margin-bottom: 1.5rem;
        }
        .mv12-cover__headline {
          font-size: clamp(2rem, 5vw, 3.5rem);
          font-weight: 700;
          line-height: 1.1;
          margin-bottom: 1.25rem;
        }
        .mv12-cover__deck {
          font-size: 1rem;
          line-height: 1.6;
          color: #4a4a4a;
          max-width: 580px;
          margin: 0 auto 1.5rem;
        }
        .mv12-cover__byline {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 1rem;
          font-family: 'Share Tech Mono', monospace;
          font-size: 0.6rem;
          letter-spacing: 0.1em;
          color: #7a7a7a;
        }
        .mv12-cover__rule {
          width: 40px;
          height: 1px;
          background: #e8e6e2;
        }

        /* Pull Quote */
        .mv12-pull {
          text-align: center;
          margin: 2.5rem 0;
          padding: 2rem 0;
          border-top: 1px solid #e8e6e2;
          border-bottom: 1px solid #e8e6e2;
        }
        .mv12-pull__mark {
          font-size: 3rem;
          line-height: 1;
          color: #e8e6e2;
          display: block;
        }
        .mv12-pull__text {
          font-size: 1.2rem;
          font-weight: 600;
          font-style: italic;
          line-height: 1.5;
          max-width: 500px;
          margin: 0 auto 0.75rem;
        }
        .mv12-pull__attr {
          font-family: 'Share Tech Mono', monospace;
          font-size: 0.6rem;
          color: #7a7a7a;
          letter-spacing: 0.1em;
        }

        /* Sidebar Stats */
        .mv12-sidebar-stats {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 1.5rem 0;
          margin-bottom: 2.5rem;
          border-bottom: 1px solid #e8e6e2;
        }
        .mv12-sidebar-stats__item { text-align: center; }
        .mv12-sidebar-stats__num {
          display: block;
          font-size: 1.5rem;
          font-weight: 700;
        }
        .mv12-sidebar-stats__desc {
          font-size: 0.6rem;
          color: #7a7a7a;
          line-height: 1.4;
        }
        .mv12-sidebar-stats__divider {
          width: 1px;
          height: 40px;
          background: #e8e6e2;
        }

        /* Editorial Columns */
        .mv12-columns {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 2rem;
          margin-bottom: 2.5rem;
        }
        .mv12-columns__col p {
          font-size: 0.82rem;
          line-height: 1.8;
          color: #4a4a4a;
          margin: 0 0 1rem;
        }
        .mv12-columns__dropcap {
          float: left;
          font-size: 3.5rem;
          font-weight: 700;
          line-height: 0.8;
          margin-right: 0.5rem;
          margin-top: 0.1rem;
          color: #1a1a1a;
        }

        /* (mv12-strip & mv12-portraits merged into fd-maint__unified) */

        /* Aircraft */
        .mv12-aircraft {
          margin-bottom: 2.5rem;
        }
        .mv12-aircraft__row {
          display: grid;
          grid-template-columns: repeat(5, 1fr);
          gap: 0.75rem;
        }
        .mv12-aircraft__type { text-align: center; padding: 1rem 0.5rem; border: 1px solid #e8e6e2; }
        .mv12-aircraft__silhouette { display: block; font-size: 1.2rem; color: #1a1a1a; margin-bottom: 0.5rem; }
        .mv12-aircraft__type strong { display: block; font-size: 0.68rem; margin-bottom: 0.2rem; }
        .mv12-aircraft__note { font-size: 0.55rem; color: #7a7a7a; }

        /* Index */
        .mv12-index { margin-bottom: 2.5rem; }
        .mv12-index__grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 0.5rem;
        }
        .mv12-index__entry {
          font-size: 0.68rem;
          line-height: 1.6;
          color: #4a4a4a;
          padding: 0.5rem;
          border-bottom: 1px solid #f0f0f0;
        }
        .mv12-index__letter {
          font-weight: 700;
          font-size: 1rem;
          color: #1a1a1a;
          margin-right: 0.5rem;
        }

        /* Drop Cap Section */
        .mv12-dropcap-section { margin-bottom: 2.5rem; }

        /* Blockquote */
        .mv12-blockquote {
          text-align: center;
          padding: 2.5rem 0;
          margin-bottom: 2.5rem;
          border-top: 1px solid #e8e6e2;
          border-bottom: 1px solid #e8e6e2;
        }
        .mv12-blockquote__mark {
          font-size: 4rem;
          line-height: 0.5;
          color: #e8e6e2;
          display: block;
          margin-bottom: 1rem;
        }
        .mv12-blockquote blockquote {
          font-size: 0.95rem;
          line-height: 1.7;
          font-style: italic;
          max-width: 560px;
          margin: 0 auto;
          color: #4a4a4a;
        }
        .mv12-blockquote__attribution {
          margin-top: 1rem;
        }
        .mv12-blockquote__attribution strong {
          display: block;
          font-size: 0.78rem;
        }
        .mv12-blockquote__attribution span {
          font-size: 0.65rem;
          color: #7a7a7a;
        }

        /* Marginalia */
        .mv12-marginalia { margin-bottom: 2.5rem; }
        .mv12-marginalia__note {
          display: flex;
          gap: 0.75rem;
          padding: 0.75rem 0;
          border-bottom: 1px solid #f0f0f0;
        }
        .mv12-marginalia__marker {
          font-size: 0.9rem;
          color: #7a7a7a;
          flex-shrink: 0;
          width: 16px;
          text-align: center;
        }
        .mv12-marginalia__note p {
          font-size: 0.72rem;
          line-height: 1.6;
          color: #7a7a7a;
          margin: 0;
        }

        /* Infographic */
        .mv12-infographic { margin-bottom: 2.5rem; }
        .mv12-infographic__bar-row {
          display: flex;
          align-items: center;
          gap: 1rem;
          padding: 0.5rem 0;
        }
        .mv12-infographic__bar-label {
          width: 140px;
          font-size: 0.68rem;
          text-align: right;
          color: #4a4a4a;
          flex-shrink: 0;
        }
        .mv12-infographic__bar-track {
          flex: 1;
          height: 8px;
          background: #f0eeeb;
        }
        .mv12-infographic__bar-fill {
          height: 100%;
          background: #1a1a1a;
          transition: width 0.6s ease;
        }
        .mv12-infographic__bar-fill--urgent {
          background: #4a4a4a;
        }
        .mv12-infographic__bar-value {
          width: 70px;
          font-family: 'Share Tech Mono', monospace;
          font-size: 0.6rem;
          color: #7a7a7a;
          flex-shrink: 0;
        }

        /* Colophon */
        .mv12-colophon {
          margin-bottom: 2.5rem;
          padding: 1.5rem;
          background: #f5f4f1;
          border: 1px solid #e8e6e2;
        }
        .mv12-colophon__grid {
          display: grid;
          grid-template-columns: 2fr 1fr 1fr;
          gap: 1.5rem;
        }
        .mv12-colophon__grid strong {
          display: block;
          font-size: 0.7rem;
          text-transform: uppercase;
          letter-spacing: 0.1em;
          margin-bottom: 0.5rem;
        }
        .mv12-colophon__grid p {
          font-size: 0.68rem;
          line-height: 1.6;
          color: #4a4a4a;
          margin: 0;
        }

        /* Ownership */
        .mv12-ownership { margin-bottom: 2.5rem; }
        .mv12-ownership__grid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 1rem;
        }
        .mv12-ownership__card {
          padding: 1.25rem;
          border: 1px solid #e8e6e2;
          background: #fff;
        }
        .mv12-ownership__card h4 {
          font-size: 0.8rem;
          margin-bottom: 0.5rem;
        }
        .mv12-ownership__card p {
          font-size: 0.7rem;
          line-height: 1.5;
          color: #4a4a4a;
          margin: 0;
        }

        /* CTA */
        .mv12-cta {
          text-align: center;
          padding: 2rem 0;
        }
        .mv12-cta__rule {
          width: 40px;
          height: 2px;
          background: #1a1a1a;
          margin: 0 auto 1.5rem;
        }
        .mv12-cta h3 {
          font-size: 1.25rem;
          margin-bottom: 0.75rem;
        }
        .mv12-cta p {
          font-size: 0.85rem;
          color: #4a4a4a;
          max-width: 480px;
          margin: 0 auto 1.5rem;
          line-height: 1.6;
        }
        .mv12-cta__actions { display: flex; gap: 0.75rem; justify-content: center; }
        .mv12-cta__btn {
          display: inline-block;
          padding: 0.7rem 1.4rem;
          font-size: 0.72rem;
          font-weight: 600;
          text-transform: uppercase;
          letter-spacing: 0.1em;
          text-decoration: none;
          transition: all 0.2s;
        }
        .mv12-cta__btn--primary { background: #1a1a1a; color: #fff; border: 1px solid #1a1a1a; }
        .mv12-cta__btn--primary:hover { background: #333; }
        .mv12-cta__btn--secondary { background: transparent; color: #1a1a1a; border: 1px solid #1a1a1a; }
        .mv12-cta__btn--secondary:hover { background: #1a1a1a; color: #fff; }

        @media (max-width: 768px) {
          .mv12 { padding: 2rem 1.25rem; }
          .mv12-columns,
          .mv12-index__grid { grid-template-columns: 1fr; }
          /* mv12-portraits__row now in fd-maint__unified */
          .mv12-aircraft__row { grid-template-columns: repeat(2, 1fr); }
          .mv12-colophon__grid { grid-template-columns: 1fr; }
          .mv12-ownership__grid { grid-template-columns: 1fr 1fr; }
          .mv12-sidebar-stats { flex-wrap: wrap; gap: 1rem; }
          .mv12-sidebar-stats__divider { display: none; }
        }


        /* =================================================================
           MAINTENANCE V13 — COMMAND CENTRE
        ================================================================= */
        .mv13 {
          max-width: 1000px;
          margin: 0 auto;
          padding: 0 1.5rem 3rem;
          font-family: 'Share Tech Mono', monospace;
          color: #1a1a1a;
          background: #faf9f6;
        }

        .mv13-panel-header {
          font-size: 0.6rem;
          letter-spacing: 0.15em;
          text-transform: uppercase;
          color: #7a7a7a;
          padding: 0.75rem 0;
          border-bottom: 1px solid #e8e6e2;
          margin-bottom: 1rem;
          display: flex;
          align-items: center;
          gap: 0.5rem;
        }
        .mv13-panel-header__dot {
          width: 6px;
          height: 6px;
          border-radius: 50%;
          background: #1a1a1a;
          flex-shrink: 0;
        }
        .mv13-panel-header--alert { color: #1a1a1a; font-weight: 600; }
        .mv13-panel-header__dot--alert { background: #b91c1c; }

        /* Header */
        .mv13-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 1rem 0;
          border-bottom: 2px solid #1a1a1a;
          margin-bottom: 2rem;
        }
        .mv13-header__left {
          display: flex;
          align-items: center;
          gap: 0.5rem;
        }
        .mv13-header__status-dot {
          width: 8px;
          height: 8px;
          border-radius: 50%;
          background: #16a34a;
        }
        .mv13-header__status {
          font-size: 0.6rem;
          letter-spacing: 0.15em;
          color: #16a34a;
        }
        .mv13-header__title {
          font-size: 0.7rem;
          font-weight: 600;
          letter-spacing: 0.15em;
        }
        .mv13-header__right { text-align: right; }
        .mv13-header__icao {
          display: block;
          font-size: 0.8rem;
          font-weight: 600;
        }
        .mv13-header__coords {
          font-size: 0.55rem;
          color: #7a7a7a;
        }

        /* Metrics */
        .mv13-metrics {
          display: grid;
          grid-template-columns: repeat(6, 1fr);
          gap: 0.5rem;
          margin-bottom: 2rem;
        }
        .mv13-metrics__card {
          padding: 1rem;
          border: 1px solid #e8e6e2;
          background: #fff;
          text-align: center;
        }
        .mv13-metrics__label {
          display: block;
          font-size: 0.5rem;
          color: #7a7a7a;
          letter-spacing: 0.1em;
          margin-bottom: 0.5rem;
        }
        .mv13-metrics__value {
          display: block;
          font-family: 'Space Grotesk', sans-serif;
          font-size: 1.5rem;
          font-weight: 700;
        }
        .mv13-metrics__trend {
          display: block;
          font-size: 0.5rem;
          color: #7a7a7a;
          margin-top: 0.25rem;
        }

        /* Registry */
        .mv13-registry { margin-bottom: 2rem; }
        .mv13-registry__grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 0.75rem;
        }
        .mv13-registry__entry {
          padding: 1rem;
          border: 1px solid #e8e6e2;
          background: #fff;
        }
        .mv13-registry__mfr {
          display: block;
          font-size: 0.7rem;
          font-weight: 600;
          margin-bottom: 0.35rem;
        }
        .mv13-registry__auth {
          display: block;
          font-size: 0.5rem;
          color: #7a7a7a;
          margin-bottom: 0.75rem;
          letter-spacing: 0.05em;
        }
        .mv13-registry__type {
          display: inline-block;
          font-size: 0.55rem;
          padding: 0.2rem 0.4rem;
          border: 1px solid #e8e6e2;
          margin: 0.15rem 0.15rem 0 0;
        }

        /* Engineers */
        .mv13-engineers { margin-bottom: 2rem; }
        .mv13-engineers__row {
          display: grid;
          grid-template-columns: 120px 130px 1fr 160px;
          gap: 0.5rem;
          padding: 0.6rem 0;
          border-bottom: 1px solid #f0f0f0;
          align-items: center;
          font-size: 0.6rem;
        }
        .mv13-engineers__name { font-weight: 600; }
        .mv13-engineers__title { color: #4a4a4a; }
        .mv13-engineers__cert { color: #7a7a7a; font-size: 0.55rem; }
        .mv13-engineers__note { color: #7a7a7a; font-size: 0.55rem; text-align: right; }
        .mv13-engineers__row--team { border-top: 1px solid #e8e6e2; margin-top: 0.25rem; padding-top: 0.75rem; }

        /* Queue */
        .mv13-queue { margin-bottom: 2rem; }
        .mv13-queue__item {
          display: grid;
          grid-template-columns: 60px 1fr 1.5fr 80px;
          gap: 0.75rem;
          padding: 0.6rem 0;
          border-bottom: 1px solid #f0f0f0;
          align-items: center;
          font-size: 0.58rem;
        }
        .mv13-queue__priority {
          font-size: 0.5rem;
          font-weight: 600;
          letter-spacing: 0.1em;
          padding: 0.15rem 0.3rem;
          text-align: center;
        }
        .mv13-queue__priority--routine { background: #f0f0f0; }
        .mv13-queue__priority--scheduled { background: #e8e6e2; }
        .mv13-queue__priority--major { background: #1a1a1a; color: #fff; }
        .mv13-queue__priority--urgent { background: #b91c1c; color: #fff; }
        .mv13-queue__service { font-weight: 600; }
        .mv13-queue__detail { color: #7a7a7a; }
        .mv13-queue__eta { text-align: right; font-weight: 600; }

        /* Parts */
        .mv13-parts { margin-bottom: 2rem; }
        .mv13-parts__grid {
          display: flex;
          gap: 0.5rem;
          align-items: flex-end;
          height: 160px;
          padding: 0 2rem;
          margin-bottom: 0.75rem;
        }
        .mv13-parts__item {
          flex: 1;
          display: flex;
          flex-direction: column;
          align-items: center;
          height: 100%;
          justify-content: flex-end;
        }
        .mv13-parts__bar {
          width: 100%;
          background: #1a1a1a;
          transition: height 0.6s ease;
        }
        .mv13-parts__count {
          font-size: 0.65rem;
          font-weight: 600;
          margin-top: 0.4rem;
        }
        .mv13-parts__cat {
          font-size: 0.5rem;
          color: #7a7a7a;
          letter-spacing: 0.1em;
        }
        .mv13-parts__total {
          text-align: center;
          font-size: 0.55rem;
          color: #7a7a7a;
          letter-spacing: 0.1em;
          padding-top: 0.5rem;
          border-top: 1px solid #e8e6e2;
        }

        /* Cert Matrix */
        .mv13-certmatrix { margin-bottom: 2rem; }
        .mv13-certmatrix__grid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 0.5rem;
        }
        .mv13-certmatrix__cell {
          padding: 0.75rem;
          border: 1px solid #e8e6e2;
          text-align: center;
        }
        .mv13-certmatrix__cell--active {
          border-color: #1a1a1a;
          background: #fff;
        }
        .mv13-certmatrix__code {
          display: block;
          font-size: 0.65rem;
          font-weight: 600;
          margin-bottom: 0.2rem;
        }
        .mv13-certmatrix__desc {
          font-size: 0.48rem;
          color: #7a7a7a;
          letter-spacing: 0.05em;
        }

        /* AOG */
        .mv13-aog { margin-bottom: 2rem; }
        .mv13-aog__content {
          display: grid;
          grid-template-columns: 1.5fr 1fr;
          gap: 1.5rem;
          padding: 1.25rem;
          border: 2px solid #1a1a1a;
          background: #fff;
        }
        .mv13-aog__left h4 {
          font-family: 'Space Grotesk', sans-serif;
          font-size: 1rem;
          margin-bottom: 0.5rem;
        }
        .mv13-aog__left p {
          font-size: 0.7rem;
          line-height: 1.6;
          color: #4a4a4a;
          margin: 0;
        }
        .mv13-aog__right {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 0.5rem;
        }
        .mv13-aog__stat {
          text-align: center;
          padding: 0.75rem;
          border: 1px solid #e8e6e2;
        }
        .mv13-aog__stat strong {
          display: block;
          font-size: 0.7rem;
        }
        .mv13-aog__stat span {
          font-size: 0.48rem;
          color: #7a7a7a;
        }

        /* Bays */
        .mv13-bays { margin-bottom: 2rem; }
        .mv13-bays__grid {
          display: grid;
          grid-template-columns: repeat(8, 1fr);
          gap: 0.35rem;
          margin-bottom: 0.75rem;
        }
        .mv13-bays__bay {
          text-align: center;
          padding: 0.75rem 0.25rem;
          border: 1px solid #1a1a1a;
          background: #fff;
        }
        .mv13-bays__num {
          display: block;
          font-size: 0.55rem;
          font-weight: 600;
        }
        .mv13-bays__status {
          font-size: 0.45rem;
          color: #16a34a;
        }
        .mv13-bays__info {
          display: flex;
          justify-content: center;
          gap: 1.5rem;
          font-size: 0.5rem;
          color: #7a7a7a;
          letter-spacing: 0.1em;
        }

        /* Turnaround */
        .mv13-turnaround { margin-bottom: 2rem; }
        .mv13-turnaround__row {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          padding: 0.4rem 0;
        }
        .mv13-turnaround__label {
          width: 70px;
          font-size: 0.55rem;
          text-align: right;
          flex-shrink: 0;
        }
        .mv13-turnaround__track {
          flex: 1;
          height: 6px;
          background: #f0eeeb;
        }
        .mv13-turnaround__fill {
          height: 100%;
          background: #1a1a1a;
          transition: width 0.6s ease;
        }
        .mv13-turnaround__fill--urgent { background: #b91c1c; }
        .mv13-turnaround__time {
          width: 40px;
          font-size: 0.55rem;
          font-weight: 600;
          flex-shrink: 0;
        }

        /* Type Ratings */
        .mv13-typeratings { margin-bottom: 2rem; }
        .mv13-typeratings__grid {
          display: flex;
          flex-wrap: wrap;
          gap: 0.35rem;
        }
        .mv13-typeratings__tag {
          font-size: 0.55rem;
          font-weight: 600;
          padding: 0.4rem 0.75rem;
          border: 1px solid #1a1a1a;
          background: #fff;
          letter-spacing: 0.1em;
        }

        /* Diagnostic */
        .mv13-diagnostic { margin-bottom: 2rem; }
        .mv13-diagnostic__line {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          padding: 0.5rem 0;
          font-size: 0.6rem;
          color: #4a4a4a;
          border-bottom: 1px solid #f0f0f0;
        }
        .mv13-diagnostic__check {
          color: #16a34a;
          font-weight: 700;
          flex-shrink: 0;
        }

        /* Schematic */
        .mv13-schematic { margin-bottom: 2rem; }
        .mv13-schematic__layout {
          display: grid;
          grid-template-columns: 2fr 1fr 1fr 1fr 1fr;
          gap: 0.5rem;
        }
        .mv13-schematic__zone {
          padding: 1rem;
          border: 1px solid #e8e6e2;
          background: #fff;
          text-align: center;
        }
        .mv13-schematic__zone span {
          display: block;
          font-size: 0.6rem;
          font-weight: 600;
          margin-bottom: 0.25rem;
        }
        .mv13-schematic__zone small {
          font-size: 0.48rem;
          color: #7a7a7a;
        }
        .mv13-schematic__zone--hangar {
          border-color: #1a1a1a;
          border-width: 2px;
        }

        /* Uptime */
        .mv13-uptime { margin-bottom: 2rem; }
        .mv13-uptime__content {
          display: flex;
          gap: 1.5rem;
          align-items: center;
          padding: 1.25rem;
          border: 1px solid #e8e6e2;
          background: #fff;
        }
        .mv13-uptime__gauge {
          width: 80px;
          height: 80px;
          border-radius: 50%;
          border: 3px solid #1a1a1a;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
        }
        .mv13-uptime__gauge-value {
          font-family: 'Space Grotesk', sans-serif;
          font-size: 1.25rem;
          font-weight: 700;
        }
        .mv13-uptime__gauge-label {
          font-size: 0.45rem;
          color: #7a7a7a;
          letter-spacing: 0.15em;
        }
        .mv13-uptime__text {
          font-size: 0.72rem;
          line-height: 1.6;
          color: #4a4a4a;
          margin: 0;
        }

        /* Dispatch */
        .mv13-dispatch {
          text-align: center;
          padding: 2rem;
          border: 2px solid #1a1a1a;
          background: #1a1a1a;
          color: #fff;
        }
        .mv13-dispatch__label {
          display: block;
          font-size: 0.5rem;
          letter-spacing: 0.2em;
          color: #7a7a7a;
          margin-bottom: 0.75rem;
        }
        .mv13-dispatch__headline {
          font-family: 'Space Grotesk', sans-serif;
          font-size: 1.3rem;
          font-weight: 600;
          margin-bottom: 0.5rem;
        }
        .mv13-dispatch p {
          font-size: 0.65rem;
          color: #999;
          margin-bottom: 1.25rem;
        }
        .mv13-dispatch__actions { display: flex; gap: 0.5rem; justify-content: center; margin-bottom: 0.75rem; }
        .mv13-dispatch__btn {
          display: inline-block;
          padding: 0.6rem 1.25rem;
          font-size: 0.6rem;
          font-weight: 600;
          letter-spacing: 0.1em;
          text-decoration: none;
          transition: all 0.2s;
        }
        .mv13-dispatch__btn--primary { background: #fff; color: #1a1a1a; }
        .mv13-dispatch__btn--primary:hover { background: #e8e6e2; color: #1a1a1a; }
        .mv13-dispatch__btn--secondary { border: 1px solid #555; color: #999; }
        .mv13-dispatch__btn--secondary:hover { border-color: #fff; color: #fff; }
        .mv13-dispatch__hours {
          font-size: 0.5rem;
          color: #555;
          letter-spacing: 0.1em;
        }

        @media (max-width: 768px) {
          .mv13 { padding: 0 1rem 2rem; }
          .mv13-metrics { grid-template-columns: repeat(3, 1fr); }
          .mv13-registry__grid { grid-template-columns: 1fr; }
          .mv13-engineers__row { grid-template-columns: 1fr 1fr; }
          .mv13-queue__item { grid-template-columns: 1fr; gap: 0.25rem; }
          .mv13-certmatrix__grid { grid-template-columns: repeat(2, 1fr); }
          .mv13-bays__grid { grid-template-columns: repeat(4, 1fr); }
          .mv13-schematic__layout { grid-template-columns: 1fr 1fr; }
          .mv13-aog__content { grid-template-columns: 1fr; }
          .mv13-header { flex-direction: column; gap: 0.5rem; text-align: center; }
        }


        /* =================================================================
           MAINTENANCE V14 — NARRATIVE SCROLL
        ================================================================= */
        .mv14 {
          max-width: 800px;
          margin: 0 auto;
          padding: 4rem 2rem;
          font-family: 'Space Grotesk', -apple-system, sans-serif;
          color: #1a1a1a;
        }

        /* Opener */
        .mv14-opener {
          text-align: center;
          margin-bottom: 4rem;
        }
        .mv14-opener__chapter {
          font-family: 'Share Tech Mono', monospace;
          font-size: 0.6rem;
          letter-spacing: 0.2em;
          text-transform: uppercase;
          color: #7a7a7a;
          display: block;
          margin-bottom: 1rem;
        }
        .mv14-opener__title {
          font-size: clamp(2rem, 5vw, 3.5rem);
          font-weight: 700;
          margin-bottom: 1.25rem;
        }
        .mv14-opener__subtitle {
          font-size: 0.9rem;
          line-height: 1.7;
          color: #4a4a4a;
          max-width: 560px;
          margin: 0 auto;
          font-style: italic;
        }
        .mv14-opener__line {
          width: 40px;
          height: 2px;
          background: #1a1a1a;
          margin: 2rem auto 0;
        }

        /* Origin */
        .mv14-origin {
          margin-bottom: 3rem;
          padding-bottom: 3rem;
          border-bottom: 1px solid #e8e6e2;
        }
        .mv14-origin__label {
          font-family: 'Share Tech Mono', monospace;
          font-size: 0.6rem;
          letter-spacing: 0.15em;
          text-transform: uppercase;
          color: #7a7a7a;
          display: block;
          margin-bottom: 1.5rem;
        }
        .mv14-origin__lede {
          font-size: 1.1rem;
          font-weight: 600;
          line-height: 1.5;
          margin-bottom: 1.25rem;
        }
        .mv14-origin__content p {
          font-size: 0.88rem;
          line-height: 1.8;
          color: #4a4a4a;
          margin: 0 0 1rem;
        }

        /* Verse */
        .mv14-verse {
          margin: 3rem 0;
          padding: 2.5rem 0;
          border-top: 1px solid #e8e6e2;
          border-bottom: 1px solid #e8e6e2;
          text-align: center;
        }
        .mv14-verse__line {
          font-size: 1rem;
          line-height: 2;
          color: #4a4a4a;
          margin: 0;
        }
        .mv14-verse__line--emphasis {
          font-size: 1.1rem;
          font-weight: 600;
          color: #1a1a1a;
          margin-top: 0.5rem;
        }

        /* Characters */
        .mv14-characters {
          margin-bottom: 3rem;
          padding-bottom: 3rem;
          border-bottom: 1px solid #e8e6e2;
        }
        .mv14-characters__label {
          font-family: 'Share Tech Mono', monospace;
          font-size: 0.6rem;
          letter-spacing: 0.15em;
          text-transform: uppercase;
          color: #7a7a7a;
          display: block;
          margin-bottom: 1.5rem;
        }
        .mv14-characters__grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 1.25rem;
        }
        .mv14-characters__card {
          padding: 1.5rem;
          border: 1px solid #e8e6e2;
          background: #fff;
        }
        .mv14-characters__initial {
          display: flex;
          width: 36px;
          height: 36px;
          align-items: center;
          justify-content: center;
          background: #1a1a1a;
          color: #fff;
          font-family: 'Share Tech Mono', monospace;
          font-size: 0.85rem;
          margin-bottom: 1rem;
        }
        .mv14-characters__card h4 {
          font-size: 0.88rem;
          margin-bottom: 0.25rem;
        }
        .mv14-characters__subtitle {
          font-family: 'Share Tech Mono', monospace;
          font-size: 0.6rem;
          color: #7a7a7a;
          letter-spacing: 0.1em;
          text-transform: uppercase;
          display: block;
          margin-bottom: 0.75rem;
        }
        .mv14-characters__card p {
          font-size: 0.75rem;
          line-height: 1.7;
          color: #4a4a4a;
          margin: 0;
        }
        .mv14-characters__note {
          margin-top: 1rem;
          font-size: 0.72rem;
          color: #7a7a7a;
          font-style: italic;
          text-align: center;
        }

        /* Tree */
        .mv14-tree {
          margin-bottom: 3rem;
          padding-bottom: 3rem;
          border-bottom: 1px solid #e8e6e2;
        }
        .mv14-tree__label {
          font-family: 'Share Tech Mono', monospace;
          font-size: 0.6rem;
          letter-spacing: 0.15em;
          text-transform: uppercase;
          color: #7a7a7a;
          display: block;
          margin-bottom: 1.5rem;
        }
        .mv14-tree__branch {
          margin-bottom: 1.5rem;
          padding: 1.5rem;
          border: 1px solid #e8e6e2;
          background: #fff;
        }
        .mv14-tree__branch--primary {
          border-color: #1a1a1a;
          border-width: 2px;
        }
        .mv14-tree__branch h4 {
          font-size: 0.88rem;
          margin-bottom: 0.5rem;
        }
        .mv14-tree__badge {
          display: inline-block;
          font-family: 'Share Tech Mono', monospace;
          font-size: 0.55rem;
          letter-spacing: 0.05em;
          color: #7a7a7a;
          padding: 0.2rem 0.5rem;
          border: 1px solid #e8e6e2;
          margin-bottom: 1rem;
        }
        .mv14-tree__leaves {
          display: grid;
          gap: 1rem;
        }
        .mv14-tree__leaf strong {
          display: block;
          font-size: 0.78rem;
          margin-bottom: 0.35rem;
        }
        .mv14-tree__leaf p {
          font-size: 0.72rem;
          line-height: 1.6;
          color: #4a4a4a;
          margin: 0;
        }

        /* Chapters (services) */
        .mv14-chapters {
          margin-bottom: 3rem;
          padding-bottom: 3rem;
          border-bottom: 1px solid #e8e6e2;
        }
        .mv14-chapters__label {
          font-family: 'Share Tech Mono', monospace;
          font-size: 0.6rem;
          letter-spacing: 0.15em;
          text-transform: uppercase;
          color: #7a7a7a;
          display: block;
          margin-bottom: 1.5rem;
        }
        .mv14-chapters__chapter {
          display: flex;
          gap: 1.25rem;
          padding: 1.5rem 0;
          border-bottom: 1px solid #f0f0f0;
        }
        .mv14-chapters__chapter:last-child { border-bottom: none; }
        .mv14-chapters__num {
          font-family: 'Share Tech Mono', monospace;
          font-size: 1.25rem;
          color: #e8e6e2;
          font-weight: 700;
          flex-shrink: 0;
          width: 40px;
        }
        .mv14-chapters__chapter h4 {
          font-size: 0.85rem;
          margin-bottom: 0.5rem;
        }
        .mv14-chapters__chapter p {
          font-size: 0.78rem;
          line-height: 1.7;
          color: #4a4a4a;
          margin: 0;
        }

        /* Before/After */
        .mv14-beforeafter {
          margin-bottom: 1rem;
          padding: 0;
        }
        .mv14-beforeafter__label {
          font-family: 'Share Tech Mono', monospace;
          font-size: 0.6rem;
          letter-spacing: 0.15em;
          text-transform: uppercase;
          color: #7a7a7a;
          display: block;
          margin-bottom: 0.75rem;
        }
        .mv14-beforeafter__item {
          display: grid;
          grid-template-columns: 1fr auto 1fr;
          gap: 0.75rem;
          align-items: center;
        }
        .mv14-beforeafter__before,
        .mv14-beforeafter__after {
          padding: 0.65rem;
          border: 1px solid #e8e6e2;
        }
        .mv14-beforeafter__before span,
        .mv14-beforeafter__after span {
          display: block;
          font-family: 'Share Tech Mono', monospace;
          font-size: 0.55rem;
          letter-spacing: 0.15em;
          color: #7a7a7a;
          margin-bottom: 0.25rem;
        }
        .mv14-beforeafter__before p,
        .mv14-beforeafter__after p {
          font-size: 0.68rem;
          line-height: 1.4;
          color: #4a4a4a;
          margin: 0;
        }
        .mv14-beforeafter__after {
          border-color: #1a1a1a;
          background: #fff;
        }
        .mv14-beforeafter__arrow {
          font-size: 1.1rem;
          color: #e8e6e2;
        }

        .mv14-beforeafter__img {
          aspect-ratio: 16/9;
          background: linear-gradient(135deg, #f0eeea 0%, #e4e2dc 100%);
          display: flex;
          align-items: center;
          justify-content: center;
          overflow: hidden;
          margin-bottom: 0.35rem;
        }

        .mv14-beforeafter__img img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }

        .mv14-beforeafter__steps {
          display: flex;
          gap: 0.3rem;
          margin-bottom: 0.75rem;
          flex-wrap: wrap;
        }

        .mv14-beforeafter__step {
          display: flex;
          align-items: center;
          gap: 0.35rem;
          padding: 0.35rem 0.7rem;
          background: #faf9f6;
          border: 1px solid #e8e6e2;
          cursor: pointer;
          transition: all 0.25s ease;
          font-family: inherit;
        }

        .mv14-beforeafter__step:hover {
          border-color: #ccc;
          background: #f5f4f0;
        }

        .mv14-beforeafter__step--active {
          border-color: #1a1a1a;
          background: #1a1a1a;
          color: #fff;
        }

        .mv14-beforeafter__step--active .mv14-beforeafter__step-num,
        .mv14-beforeafter__step--active .mv14-beforeafter__step-label {
          color: #fff;
        }

        .mv14-beforeafter__step-num {
          font-family: 'Share Tech Mono', monospace;
          font-size: 0.75rem;
          font-weight: 700;
          color: #1a1a1a;
          line-height: 1;
        }

        .mv14-beforeafter__step-label {
          font-size: 0.6rem;
          font-weight: 600;
          text-transform: uppercase;
          letter-spacing: 0.06em;
          color: #666;
        }

        .mv14-beforeafter__nav {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 1rem;
          margin-top: 0.6rem;
        }

        .mv14-beforeafter__nav-btn {
          font-family: 'Share Tech Mono', monospace;
          font-size: 0.65rem;
          text-transform: uppercase;
          letter-spacing: 0.1em;
          background: none;
          border: 1px solid #e8e6e2;
          padding: 0.4rem 1rem;
          cursor: pointer;
          transition: all 0.25s ease;
          color: #1a1a1a;
        }

        .mv14-beforeafter__nav-btn:hover:not(:disabled) {
          border-color: #1a1a1a;
          background: #1a1a1a;
          color: #fff;
        }

        .mv14-beforeafter__nav-btn:disabled {
          opacity: 0.3;
          cursor: not-allowed;
        }

        .mv14-beforeafter__nav-count {
          font-family: 'Share Tech Mono', monospace;
          font-size: 0.7rem;
          color: #999;
        }

        .fd-sales__actions {
          display: flex;
          justify-content: flex-start;
          gap: 0.75rem;
          margin: 0.75rem 0 0;
        }

        .fd-sales__btn {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          padding: 0.65rem 1.4rem;
          font-size: 0.65rem;
          font-weight: 600;
          text-transform: uppercase;
          letter-spacing: 0.08em;
          text-decoration: none;
          transition: all 0.3s ease;
        }

        .fd-sales__btn--primary {
          background: #1a1a1a;
          color: #fff;
          border: 1px solid #1a1a1a;
        }

        .fd-sales__btn--primary:hover {
          background: #333;
        }

        .fd-sales__btn--outline {
          background: transparent;
          color: #1a1a1a;
          border: 1px solid #1a1a1a;
        }

        .fd-sales__btn--outline:hover {
          background: #1a1a1a;
          color: #fff;
        }

        /* Voices */
        .mv14-voices {
          margin-bottom: 3rem;
          padding-bottom: 3rem;
          border-bottom: 1px solid #e8e6e2;
        }
        .mv14-voices__label {
          font-family: 'Share Tech Mono', monospace;
          font-size: 0.6rem;
          letter-spacing: 0.15em;
          text-transform: uppercase;
          color: #7a7a7a;
          display: block;
          margin-bottom: 1.5rem;
        }
        .mv14-voices__grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 1rem;
        }
        .mv14-voices__quote {
          padding: 1.25rem;
          border: 1px solid #e8e6e2;
          background: #fff;
          margin: 0;
        }
        .mv14-voices__quote p {
          font-size: 0.78rem;
          line-height: 1.7;
          font-style: italic;
          color: #4a4a4a;
          margin: 0 0 0.75rem;
        }
        .mv14-voices__quote cite {
          font-style: normal;
          font-family: 'Share Tech Mono', monospace;
          font-size: 0.6rem;
          color: #7a7a7a;
        }

        /* Walkthrough */
        .mv14-walkthrough {
          margin-bottom: 3rem;
          padding-bottom: 3rem;
          border-bottom: 1px solid #e8e6e2;
        }
        .mv14-walkthrough__label {
          font-family: 'Share Tech Mono', monospace;
          font-size: 0.6rem;
          letter-spacing: 0.15em;
          text-transform: uppercase;
          color: #7a7a7a;
          display: block;
          margin-bottom: 1.5rem;
        }
        .mv14-walkthrough__stop {
          display: flex;
          gap: 1.25rem;
          padding: 1.25rem 0;
          border-bottom: 1px solid #f0f0f0;
        }
        .mv14-walkthrough__stop:last-child { border-bottom: none; }
        .mv14-walkthrough__stop-num {
          width: 32px;
          height: 32px;
          display: flex;
          align-items: center;
          justify-content: center;
          border: 1px solid #1a1a1a;
          font-family: 'Share Tech Mono', monospace;
          font-size: 0.75rem;
          font-weight: 600;
          flex-shrink: 0;
        }
        .mv14-walkthrough__stop h4 {
          font-size: 0.82rem;
          margin-bottom: 0.35rem;
        }
        .mv14-walkthrough__stop p {
          font-size: 0.75rem;
          line-height: 1.6;
          color: #4a4a4a;
          margin: 0;
        }

        /* Milestones */
        .mv14-milestones {
          margin-bottom: 3rem;
          padding-bottom: 3rem;
          border-bottom: 1px solid #e8e6e2;
        }
        .mv14-milestones__label {
          font-family: 'Share Tech Mono', monospace;
          font-size: 0.6rem;
          letter-spacing: 0.15em;
          text-transform: uppercase;
          color: #7a7a7a;
          display: block;
          margin-bottom: 1.5rem;
        }
        .mv14-milestones__marker {
          display: flex;
          gap: 1.25rem;
          padding: 0.75rem 0;
          border-bottom: 1px solid #f0f0f0;
          align-items: baseline;
        }
        .mv14-milestones__year {
          font-family: 'Share Tech Mono', monospace;
          font-size: 0.85rem;
          font-weight: 600;
          flex-shrink: 0;
          width: 50px;
        }
        .mv14-milestones__marker p {
          font-size: 0.75rem;
          color: #4a4a4a;
          margin: 0;
        }

        /* Catalogue */
        .mv14-catalogue {
          margin-bottom: 3rem;
          padding-bottom: 3rem;
          border-bottom: 1px solid #e8e6e2;
        }
        .mv14-catalogue__label {
          font-family: 'Share Tech Mono', monospace;
          font-size: 0.6rem;
          letter-spacing: 0.15em;
          text-transform: uppercase;
          color: #7a7a7a;
          display: block;
          margin-bottom: 1.5rem;
        }
        .mv14-catalogue__spread {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 1rem;
        }
        .mv14-catalogue__page {
          padding: 1.25rem;
          border: 1px solid #e8e6e2;
          background: #fff;
        }
        .mv14-catalogue__page h4 {
          font-size: 0.78rem;
          margin-bottom: 0.5rem;
        }
        .mv14-catalogue__page p {
          font-size: 0.68rem;
          line-height: 1.6;
          color: #4a4a4a;
          margin: 0;
        }
        .mv14-catalogue__value {
          text-align: center;
          margin-top: 1rem;
          font-size: 0.72rem;
          color: #4a4a4a;
        }

        /* Seals */
        .mv14-seals {
          margin-bottom: 3rem;
          padding-bottom: 3rem;
          border-bottom: 1px solid #e8e6e2;
        }
        .mv14-seals__label {
          font-family: 'Share Tech Mono', monospace;
          font-size: 0.6rem;
          letter-spacing: 0.15em;
          text-transform: uppercase;
          color: #7a7a7a;
          display: block;
          margin-bottom: 1.5rem;
        }
        .mv14-seals__row {
          display: flex;
          justify-content: center;
          gap: 1.5rem;
          flex-wrap: wrap;
        }
        .mv14-seals__seal {
          text-align: center;
        }
        .mv14-seals__icon {
          display: flex;
          width: 48px;
          height: 48px;
          align-items: center;
          justify-content: center;
          border: 2px solid #1a1a1a;
          border-radius: 50%;
          margin: 0 auto 0.5rem;
          font-size: 1rem;
        }
        .mv14-seals__seal strong {
          font-size: 0.6rem;
          text-transform: uppercase;
          letter-spacing: 0.05em;
        }

        /* Promise */
        .mv14-promise {
          text-align: center;
          margin-bottom: 3rem;
        }
        .mv14-promise__rule {
          width: 60px;
          height: 2px;
          background: #1a1a1a;
          margin: 0 auto 2rem;
        }
        .mv14-promise__text {
          font-size: 0.88rem;
          line-height: 1.8;
          color: #4a4a4a;
          max-width: 600px;
          margin: 0 auto 1.5rem;
        }
        .mv14-promise__emphasis {
          font-size: 1.1rem;
          font-weight: 700;
          margin: 0 auto 2rem;
        }

        /* Coords */
        .mv14-coords {
          text-align: center;
          padding: 1.5rem 0;
          border-top: 1px solid #e8e6e2;
          border-bottom: 1px solid #e8e6e2;
          margin-bottom: 2rem;
        }
        .mv14-coords span {
          display: block;
          font-family: 'Share Tech Mono', monospace;
          font-size: 0.6rem;
          color: #7a7a7a;
          letter-spacing: 0.1em;
          line-height: 1.8;
        }
        .mv14-coords__icao {
          font-size: 1rem !important;
          font-weight: 600;
          color: #1a1a1a !important;
        }

        /* CTA */
        .mv14-cta {
          text-align: center;
          padding: 2rem 0;
        }
        .mv14-cta h3 {
          font-size: 1.25rem;
          font-style: italic;
          margin-bottom: 0.75rem;
        }
        .mv14-cta p {
          font-size: 0.85rem;
          color: #4a4a4a;
          margin-bottom: 1.5rem;
        }
        .mv14-cta__actions { display: flex; gap: 0.75rem; justify-content: center; }
        .mv14-cta__btn {
          display: inline-block;
          padding: 0.7rem 1.4rem;
          font-size: 0.72rem;
          font-weight: 600;
          text-transform: uppercase;
          letter-spacing: 0.1em;
          text-decoration: none;
          transition: all 0.2s;
        }
        .mv14-cta__btn--primary { background: #1a1a1a; color: #fff; border: 1px solid #1a1a1a; }
        .mv14-cta__btn--primary:hover { background: #333; }
        .mv14-cta__btn--secondary { background: transparent; color: #1a1a1a; border: 1px solid #1a1a1a; }
        .mv14-cta__btn--secondary:hover { background: #1a1a1a; color: #fff; }

        @media (max-width: 768px) {
          .mv14 { padding: 2rem 1.25rem; }
          .mv14-characters__grid,
          .mv14-voices__grid,
          .mv14-catalogue__spread { grid-template-columns: 1fr; }
          .mv14-beforeafter__item { grid-template-columns: 1fr; }
          .mv14-beforeafter__arrow { transform: rotate(90deg); text-align: center; }
          .mv14-beforeafter__steps { gap: 0.35rem; }
          .mv14-beforeafter__step { padding: 0.4rem 0.75rem; }
          .fd-sales__intro { grid-template-columns: 1fr; }
          .fd-sales__left { padding: 0 1.5rem; }
          .fd-sales__header-sticky { position: static; text-align: center; padding: 2rem 0; }
          .fd-sales__dealer-catch { position: static; transition: none; }
          .fd-sales__text { margin: 0 auto; }
          .fd-sales__header-divider { margin: 1.5rem auto 0; }
          .fd-sales__intro-bg, .fd-sales__intro-border { display: none; }
          .fd-sales__intro-gallery { grid-column: 1; grid-row: auto; padding: 0 1.5rem 1.5rem; }
          .fd-sales__actions { flex-direction: column; align-items: center; }
          .fd-sales__btn { width: 100%; max-width: 340px; text-align: center; }
        }

        /* =================================================================
           REBUILD PORTFOLIO OPTIONS 3–6
        ================================================================= */

        /* Option 3: Portfolio Grid */
        .rb-portfolio-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 1.25rem;
        }
        .rb-portfolio-card {
          border: 1px solid #e8e6e2;
          background: #fff;
          overflow: hidden;
          transition: box-shadow 0.3s ease;
        }
        .rb-portfolio-card:hover {
          box-shadow: 0 4px 20px rgba(0,0,0,0.08);
        }
        .rb-portfolio-card__img {
          position: relative;
          aspect-ratio: 16 / 10;
          overflow: hidden;
          background: #f5f4f1;
        }
        .rb-portfolio-card__img img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }
        .rb-portfolio-card__badge {
          position: absolute;
          top: 0.75rem;
          left: 0.75rem;
          background: #1a1a1a;
          color: #fff;
          font-family: 'Share Tech Mono', monospace;
          font-size: 0.55rem;
          letter-spacing: 0.12em;
          text-transform: uppercase;
          padding: 0.3rem 0.6rem;
        }
        .rb-portfolio-card__body {
          padding: 1rem 1.25rem 1.25rem;
        }
        .rb-portfolio-card__header {
          display: flex;
          justify-content: space-between;
          align-items: baseline;
          margin-bottom: 0.5rem;
        }
        .rb-portfolio-card__header strong {
          font-family: 'Space Grotesk', sans-serif;
          font-size: 0.85rem;
          font-weight: 600;
          color: #1a1a1a;
        }
        .rb-portfolio-card__reg {
          font-family: 'Share Tech Mono', monospace;
          font-size: 0.65rem;
          color: #999;
          letter-spacing: 0.05em;
        }
        .rb-portfolio-card__scope {
          font-size: 0.75rem;
          line-height: 1.6;
          color: #4a4a4a;
          margin: 0 0 0.75rem;
        }
        .rb-portfolio-card__meta {
          display: flex;
          gap: 1.25rem;
          font-family: 'Share Tech Mono', monospace;
          font-size: 0.6rem;
          color: #7a7a7a;
          letter-spacing: 0.05em;
        }
        .rb-portfolio-card__meta i {
          margin-right: 0.3rem;
          font-size: 0.55rem;
        }

        /* Option 4: Intro Text + Strip */
        .rb-stats {
          display: flex;
          flex-direction: column;
          gap: 1.5rem;
        }
        .rb-stats--card {
          background: #fff;
          border: 1px solid #e8e6e2;
          border-radius: 4px;
          padding: 2rem 2rem 1.5rem;
          box-shadow: 0 2px 12px rgba(0,0,0,0.04);
        }
        .rb-stats__intro {
          max-width: 540px;
        }
        .rb-stats__heading {
          font-family: 'Space Grotesk', sans-serif;
          font-size: 1.1rem;
          font-weight: 600;
          color: #1a1a1a;
          margin: 0 0 0.6rem;
        }
        .rb-stats__text {
          font-size: 0.78rem;
          line-height: 1.7;
          color: #4a4a4a;
          margin: 0;
        }
        .rb-stats__strip-wrap {
          position: relative;
        }
        .rb-stats__strip {
          display: flex;
          gap: 1rem;
          overflow-x: auto;
          scrollbar-width: none;
          -ms-overflow-style: none;
        }
        .rb-stats__strip::-webkit-scrollbar {
          display: none;
        }
        .rb-stats__chevron {
          position: absolute;
          top: 50%;
          transform: translateY(-50%);
          z-index: 2;
          width: 36px;
          height: 36px;
          border-radius: 50%;
          background: #fff;
          border: 1px solid #e8e6e2;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          box-shadow: 0 2px 8px rgba(0,0,0,0.08);
          transition: all 0.2s;
          color: #1a1a1a;
          font-size: 0.7rem;
        }
        .rb-stats__chevron:hover {
          background: #1a1a1a;
          border-color: #1a1a1a;
          color: #fff;
        }
        .rb-stats__chevron--left {
          left: -18px;
        }
        .rb-stats__chevron--right {
          right: -18px;
        }
        .rb-stats__strip-card {
          flex: 0 0 220px;
          border: 1px solid #e8e6e2;
          background: #fff;
          overflow: hidden;
        }
        .rb-stats__strip-card img {
          width: 100%;
          aspect-ratio: 16 / 10;
          object-fit: cover;
          display: block;
          background: #f5f4f1;
        }
        .rb-stats__strip-info {
          padding: 0.75rem 1rem;
          display: flex;
          flex-direction: column;
          gap: 0.2rem;
        }
        .rb-stats__strip-info strong {
          font-family: 'Space Grotesk', sans-serif;
          font-size: 0.78rem;
          font-weight: 600;
          color: #1a1a1a;
        }
        .rb-stats__strip-info span {
          font-family: 'Share Tech Mono', monospace;
          font-size: 0.6rem;
          color: #7a7a7a;
          letter-spacing: 0.05em;
        }

        /* Option 5: Featured Rebuild */
        .rb-featured {
          display: flex;
          flex-direction: column;
          gap: 1.5rem;
        }
        .rb-featured__hero {
          display: grid;
          grid-template-columns: 1.4fr 1fr;
          gap: 2rem;
          border: 1px solid #e8e6e2;
          background: #fff;
          overflow: hidden;
        }
        .rb-featured__hero-img {
          aspect-ratio: 16 / 10;
          overflow: hidden;
          background: #f5f4f1;
        }
        .rb-featured__hero-img img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }
        .rb-featured__hero-info {
          padding: 2rem 2rem 2rem 0;
          display: flex;
          flex-direction: column;
          justify-content: center;
        }
        .rb-featured__overline {
          font-family: 'Share Tech Mono', monospace;
          font-size: 0.6rem;
          letter-spacing: 0.15em;
          text-transform: uppercase;
          color: #7a7a7a;
          margin-bottom: 0.75rem;
        }
        .rb-featured__hero-info h4 {
          font-family: 'Space Grotesk', sans-serif;
          font-size: 1.4rem;
          font-weight: 600;
          color: #1a1a1a;
          margin: 0 0 0.5rem;
        }
        .rb-featured__reg {
          font-family: 'Share Tech Mono', monospace;
          font-size: 0.65rem;
          color: #999;
          letter-spacing: 0.05em;
          margin-bottom: 1rem;
        }
        .rb-featured__hero-info p {
          font-size: 0.78rem;
          line-height: 1.7;
          color: #4a4a4a;
          margin: 0 0 1rem;
        }
        .rb-featured__duration {
          font-family: 'Share Tech Mono', monospace;
          font-size: 0.65rem;
          color: #7a7a7a;
          letter-spacing: 0.05em;
        }
        .rb-featured__duration i {
          margin-right: 0.4rem;
        }
        .rb-featured__thumbs {
          display: flex;
          gap: 0.75rem;
        }
        .rb-featured__thumb {
          flex: 1;
          background: #fff;
          border: 1px solid #e8e6e2;
          padding: 0;
          cursor: pointer;
          overflow: hidden;
          transition: border-color 0.2s ease;
          display: flex;
          flex-direction: column;
        }
        .rb-featured__thumb:hover {
          border-color: #ccc;
        }
        .rb-featured__thumb--active {
          border-color: #1a1a1a;
        }
        .rb-featured__thumb img {
          width: 100%;
          aspect-ratio: 16 / 10;
          object-fit: cover;
          display: block;
          background: #f5f4f1;
        }
        .rb-featured__thumb span {
          display: block;
          padding: 0.5rem 0.75rem;
          font-family: 'Share Tech Mono', monospace;
          font-size: 0.6rem;
          color: #7a7a7a;
          letter-spacing: 0.05em;
          text-align: center;
        }
        .rb-featured__thumb--active span {
          color: #1a1a1a;
        }

        /* Option 6: Minimal List */
        .rb-list {
          display: flex;
          flex-direction: column;
        }
        .rb-list__item {
          display: grid;
          grid-template-columns: 2.5rem 80px 1fr 1.5fr auto;
          gap: 1.25rem;
          align-items: center;
          padding: 1.25rem 0;
          border-bottom: 1px solid #e8e6e2;
        }
        .rb-list__item:first-child {
          border-top: 1px solid #e8e6e2;
        }
        .rb-list__num {
          font-family: 'Share Tech Mono', monospace;
          font-size: 0.7rem;
          color: #ccc;
          letter-spacing: 0.05em;
        }
        .rb-list__img {
          width: 80px;
          aspect-ratio: 4 / 3;
          overflow: hidden;
          background: #f5f4f1;
          border: 1px solid #e8e6e2;
        }
        .rb-list__img img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }
        .rb-list__info {
          display: flex;
          flex-direction: column;
          gap: 0.15rem;
        }
        .rb-list__info strong {
          font-family: 'Space Grotesk', sans-serif;
          font-size: 0.82rem;
          font-weight: 600;
          color: #1a1a1a;
        }
        .rb-list__reg {
          font-family: 'Share Tech Mono', monospace;
          font-size: 0.6rem;
          color: #999;
          letter-spacing: 0.05em;
        }
        .rb-list__scope {
          font-size: 0.75rem;
          color: #4a4a4a;
          line-height: 1.5;
          margin: 0;
        }
        .rb-list__duration {
          font-family: 'Share Tech Mono', monospace;
          font-size: 0.65rem;
          color: #7a7a7a;
          letter-spacing: 0.05em;
          white-space: nowrap;
        }

        /* =========================================================
           REBUILD SHOWCASE — Full-screen editorial takeover
        ========================================================= */
        .rb-showcase {
          background: #faf9f6;
          border: 1px solid #e8e6e2;
          animation: rbShowcaseIn 0.35s cubic-bezier(0.16, 1, 0.3, 1);
        }
        @keyframes rbShowcaseIn {
          from { opacity: 0; transform: translateY(8px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .rb-showcase__inner {
          display: flex;
          flex-direction: column;
        }

        /* Top bar */
        .rb-showcase__topbar {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 0.6rem 1.5rem;
          border-bottom: 1px solid #e8e6e2;
          flex-shrink: 0;
        }
        .rb-showcase__topbar-left,
        .rb-showcase__topbar-center {
          font-family: 'Share Tech Mono', monospace;
          font-size: 0.6rem;
          letter-spacing: 0.12em;
          text-transform: uppercase;
          color: #999;
        }
        .rb-showcase__topbar-center {
          color: #7a7a7a;
        }
        .rb-showcase__counter {
          font-family: 'Share Tech Mono', monospace;
          font-size: 0.65rem;
          letter-spacing: 0.08em;
          color: #1a1a1a;
        }
        .rb-showcase__close {
          background: none;
          border: 1px solid #e8e6e2;
          font-family: 'Share Tech Mono', monospace;
          font-size: 0.6rem;
          letter-spacing: 0.12em;
          text-transform: uppercase;
          color: #1a1a1a;
          padding: 0.35rem 1rem;
          cursor: pointer;
          transition: all 0.2s;
        }
        .rb-showcase__close:hover {
          background: #1a1a1a;
          border-color: #1a1a1a;
          color: #fff;
        }

        /* Main content — split */
        .rb-showcase__content {
          display: grid;
          grid-template-columns: 1.2fr 1fr;
          flex: 1;
          min-height: 0;
        }

        /* Left — Gallery */
        .rb-showcase__gallery {
          padding: 1.25rem;
          display: flex;
          flex-direction: column;
          gap: 0.4rem;
        }
        .rb-showcase__hero-img {
          position: relative;
          min-height: 300px;
          max-height: 400px;
          overflow: hidden;
          background: #eeedeb;
          cursor: pointer;
        }
        .rb-showcase__hero-img img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          transition: transform 0.6s cubic-bezier(0.16, 1, 0.3, 1);
        }
        .rb-showcase__hero-img:hover img {
          transform: scale(1.04);
        }
        .rb-showcase__img-overlay {
          position: absolute;
          inset: 0;
          background: rgba(0,0,0,0);
          display: flex;
          align-items: center;
          justify-content: center;
          transition: background 0.3s;
        }
        .rb-showcase__img-overlay i {
          color: #fff;
          font-size: 1.2rem;
          opacity: 0;
          transform: scale(0.8);
          transition: all 0.3s;
        }
        .rb-showcase__hero-img:hover .rb-showcase__img-overlay {
          background: rgba(0,0,0,0.15);
        }
        .rb-showcase__hero-img:hover .rb-showcase__img-overlay i {
          opacity: 1;
          transform: scale(1);
        }
        .rb-showcase__thumbs {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 0.4rem;
          flex-shrink: 0;
        }
        .rb-showcase__thumb {
          background: none;
          border: none;
          padding: 0;
          cursor: pointer;
          overflow: hidden;
          aspect-ratio: 16 / 10;
          position: relative;
        }
        .rb-showcase__thumb img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          display: block;
          transition: transform 0.4s ease;
        }
        .rb-showcase__thumb:hover img {
          transform: scale(1.06);
        }

        /* Right — Info */
        .rb-showcase__info {
          padding: 1.5rem 1.75rem;
          border-left: 1px solid #e8e6e2;
          display: flex;
          flex-direction: column;
          justify-content: center;
        }
        .rb-showcase__overline {
          font-family: 'Share Tech Mono', monospace;
          font-size: 0.55rem;
          letter-spacing: 0.18em;
          text-transform: uppercase;
          color: #999;
          margin-bottom: 0.5rem;
        }
        .rb-showcase__title {
          font-family: 'Space Grotesk', sans-serif;
          font-size: clamp(1.4rem, 2.5vw, 1.8rem);
          font-weight: 700;
          color: #1a1a1a;
          margin: 0 0 0.2rem;
          line-height: 1.1;
        }
        .rb-showcase__reg {
          font-family: 'Share Tech Mono', monospace;
          font-size: 0.65rem;
          color: #999;
          letter-spacing: 0.08em;
        }
        .rb-showcase__divider {
          width: 30px;
          height: 1px;
          background: #ddd9d3;
          margin: 1rem 0;
        }
        .rb-showcase__desc {
          font-size: 0.78rem;
          line-height: 1.7;
          color: #4a4a4a;
          margin: 0 0 1rem;
          max-width: 420px;
        }
        .rb-showcase__spec {
          display: flex;
          gap: 2.5rem;
        }
        .rb-showcase__spec-item {
          display: flex;
          flex-direction: column;
          gap: 0.25rem;
        }
        .rb-showcase__spec-label {
          font-family: 'Share Tech Mono', monospace;
          font-size: 0.5rem;
          letter-spacing: 0.15em;
          text-transform: uppercase;
          color: #999;
        }
        .rb-showcase__spec-value {
          font-family: 'Space Grotesk', sans-serif;
          font-size: 0.95rem;
          font-weight: 600;
          color: #1a1a1a;
        }
        .rb-showcase__tags {
          display: flex;
          flex-wrap: wrap;
          gap: 0.4rem;
        }
        .rb-showcase__tag {
          font-family: 'Share Tech Mono', monospace;
          font-size: 0.55rem;
          letter-spacing: 0.06em;
          color: #4a4a4a;
          border: 1px solid #e8e6e2;
          padding: 0.4rem 0.85rem;
          background: #fff;
        }

        /* Bottom nav */
        .rb-showcase__nav {
          display: flex;
          border-top: 1px solid #e8e6e2;
          flex-shrink: 0;
        }
        .rb-showcase__nav-btn {
          flex: 1;
          display: flex;
          align-items: center;
          gap: 0.6rem;
          padding: 0.7rem 1.5rem;
          background: none;
          border: none;
          cursor: pointer;
          transition: background 0.2s;
          font-family: 'Share Tech Mono', monospace;
        }
        .rb-showcase__nav-btn:first-child {
          border-right: 1px solid #e8e6e2;
        }
        .rb-showcase__nav-btn--next {
          justify-content: flex-end;
        }
        .rb-showcase__nav-btn:hover:not(:disabled) {
          background: #fff;
        }
        .rb-showcase__nav-btn:disabled {
          opacity: 0.25;
          cursor: not-allowed;
        }
        .rb-showcase__nav-arrow {
          font-size: 1.1rem;
          color: #1a1a1a;
        }
        .rb-showcase__nav-label {
          font-size: 0.7rem;
          letter-spacing: 0.05em;
          color: #7a7a7a;
        }

        /* Image Lightbox */
        .rb-lightbox {
          position: fixed;
          inset: 0;
          background: rgba(0, 0, 0, 0.95);
          z-index: 9500;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          animation: rbLightboxIn 0.25s ease;
        }
        @keyframes rbLightboxIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        .rb-lightbox__img {
          max-width: 90vw;
          max-height: 90vh;
          object-fit: contain;
        }

        /* Strip card hover */
        .rb-stats__strip-card {
          transition: all 0.25s ease;
        }
        .rb-stats__strip-card:hover {
          box-shadow: 0 2px 12px rgba(0,0,0,0.08);
          border-color: #ccc;
        }

        /* Responsive — Showcase */
        @media (max-width: 900px) {
          .rb-showcase__content { grid-template-columns: 1fr; }
          .rb-showcase__info { border-left: none; border-top: 1px solid #e8e6e2; padding: 2rem; }
          .rb-showcase__gallery { padding: 2rem; }
          .rb-showcase__topbar { padding: 1rem 1.5rem; }
          .rb-showcase__topbar-center { display: none; }
          .rb-showcase__nav-btn { padding: 1rem 1.5rem; }
        }

        /* Responsive — Options 3–6 + Modal */
        @media (max-width: 768px) {
          .rb-portfolio-grid { grid-template-columns: 1fr; }
          .rb-stats__intro { max-width: 100%; }
          .rb-featured__hero { grid-template-columns: 1fr; }
          .rb-featured__hero-info { padding: 1.5rem; }
          .rb-featured__thumbs { flex-wrap: wrap; }
          .rb-featured__thumb { flex: 0 0 calc(50% - 0.375rem); }
          .rb-list__item { grid-template-columns: 2rem 60px 1fr; gap: 0.75rem; }
          .rb-list__scope,
          .rb-list__duration { display: none; }
          .rb-showcase__content { grid-template-columns: 1fr; }
        }


        /* =================================================================
           MAINTENANCE V15 — BRUTALIST MANIFESTO
        ================================================================= */
        .mv15 {
          max-width: 960px;
          margin: 0 auto;
          padding: 4rem 2rem;
          font-family: 'Share Tech Mono', monospace;
          color: #1a1a1a;
        }

        /* Giant Type */
        .mv15-giant {
          text-align: center;
          margin-bottom: 3rem;
        }
        .mv15-giant__text {
          font-family: 'Space Grotesk', sans-serif;
          font-size: clamp(4rem, 12vw, 10rem);
          font-weight: 700;
          line-height: 0.9;
          text-transform: uppercase;
          letter-spacing: -0.03em;
          margin: 0 0 1rem;
        }
        .mv15-giant__sub {
          font-size: 0.6rem;
          letter-spacing: 0.25em;
          color: #7a7a7a;
        }

        /* Stats Wall */
        .mv15-statswall {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 0;
          margin-bottom: 0;
        }
        .mv15-statswall__item {
          padding: 1.5rem;
          border: 1px solid #1a1a1a;
          text-align: center;
          margin: -0.5px;
        }
        .mv15-statswall__num {
          display: block;
          font-family: 'Space Grotesk', sans-serif;
          font-size: 2rem;
          font-weight: 700;
        }
        .mv15-statswall__label {
          font-size: 0.5rem;
          letter-spacing: 0.15em;
          color: #7a7a7a;
        }

        /* Thick Rule */
        .mv15-rule {
          height: 4px;
          background: #1a1a1a;
          margin: 2.5rem 0;
        }

        /* Services */
        .mv15-services { margin-bottom: 0; }
        .mv15-services__list {
          font-size: 0.62rem;
          line-height: 1.8;
          overflow-x: auto;
          background: #fff;
          padding: 1.5rem;
          border: 1px solid #e8e6e2;
          margin: 0;
          white-space: pre;
        }

        /* Team */
        .mv15-team { margin-bottom: 0; }
        .mv15-team__person {
          padding: 1.25rem 0;
          border-bottom: 1px solid #e8e6e2;
        }
        .mv15-team__person:last-child { border-bottom: none; }
        .mv15-team__name {
          display: block;
          font-family: 'Space Grotesk', sans-serif;
          font-size: 1rem;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 0.05em;
        }
        .mv15-team__role {
          display: block;
          font-size: 0.55rem;
          letter-spacing: 0.15em;
          color: #7a7a7a;
          margin-bottom: 0.5rem;
        }
        .mv15-team__creds {
          font-size: 0.6rem;
          color: #4a4a4a;
          line-height: 1.6;
        }
        .mv15-team__person--summary {
          border-top: 2px solid #1a1a1a;
          margin-top: 0.5rem;
          padding-top: 1.25rem;
        }

        /* Specimen */
        .mv15-specimen { margin-bottom: 0; }
        .mv15-specimen__heading {
          font-size: 0.65rem;
          letter-spacing: 0.2em;
          margin-bottom: 1rem;
        }
        .mv15-specimen__grid {
          display: flex;
          flex-direction: column;
        }
        .mv15-specimen__type {
          display: grid;
          grid-template-columns: 200px 1fr 80px;
          gap: 1rem;
          padding: 0.75rem 0;
          border-bottom: 1px solid #f0f0f0;
          align-items: center;
        }
        .mv15-specimen__name {
          font-size: 0.7rem;
          font-weight: 600;
        }
        .mv15-specimen__detail {
          font-size: 0.58rem;
          color: #7a7a7a;
        }
        .mv15-specimen__status {
          font-size: 0.5rem;
          font-weight: 600;
          text-align: right;
          letter-spacing: 0.1em;
        }

        /* Certs */
        .mv15-certs {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 0;
          margin-bottom: 0;
        }
        .mv15-certs__badge {
          padding: 1.5rem;
          border: 2px solid #1a1a1a;
          text-align: center;
          font-size: 0.85rem;
          font-weight: 700;
          line-height: 1.3;
          margin: -1px;
          font-family: 'Space Grotesk', sans-serif;
        }

        /* Inventory */
        .mv15-inventory { margin-bottom: 0; }
        .mv15-inventory__raw {
          font-size: 0.62rem;
          line-height: 1.8;
          background: #1a1a1a;
          color: #fff;
          padding: 1.5rem;
          margin: 0;
          white-space: pre;
          overflow-x: auto;
        }

        /* Dimensions */
        .mv15-dimensions {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 0;
          margin-bottom: 0;
        }
        .mv15-dimensions__item {
          padding: 1.25rem;
          border: 1px solid #e8e6e2;
          margin: -0.5px;
        }
        .mv15-dimensions__val {
          display: block;
          font-family: 'Space Grotesk', sans-serif;
          font-size: 0.85rem;
          font-weight: 700;
          margin-bottom: 0.25rem;
        }
        .mv15-dimensions__desc {
          font-size: 0.5rem;
          color: #7a7a7a;
          letter-spacing: 0.1em;
        }

        /* Testimonial */
        .mv15-testimonial { margin-bottom: 0; }
        .mv15-testimonial__text {
          font-size: 0.72rem;
          line-height: 1.8;
          background: #fff;
          padding: 1.5rem;
          border: 1px solid #e8e6e2;
          margin: 0;
          white-space: pre-wrap;
        }

        /* AOG */
        .mv15-aog {
          display: flex;
          align-items: stretch;
          border: 3px solid #1a1a1a;
          margin: 2.5rem 0;
        }
        .mv15-aog__alert {
          display: flex;
          align-items: center;
          justify-content: center;
          background: #1a1a1a;
          color: #fff;
          padding: 1.5rem;
          font-size: 1.25rem;
          font-weight: 700;
          writing-mode: vertical-rl;
          text-orientation: mixed;
          letter-spacing: 0.2em;
        }
        .mv15-aog__content {
          padding: 1.5rem;
          flex: 1;
        }
        .mv15-aog__content h3 {
          font-family: 'Space Grotesk', sans-serif;
          font-size: 1.25rem;
          font-weight: 700;
          margin-bottom: 0.75rem;
        }
        .mv15-aog__content p {
          font-size: 0.65rem;
          line-height: 1.8;
          color: #4a4a4a;
          letter-spacing: 0.05em;
          margin: 0;
        }

        /* Philosophy */
        .mv15-philosophy {
          padding: 3rem 0;
          text-align: center;
        }
        .mv15-philosophy__text {
          font-family: 'Space Grotesk', sans-serif;
          font-size: clamp(1rem, 2.5vw, 1.5rem);
          font-weight: 700;
          letter-spacing: 0.15em;
          line-height: 1.6;
          max-width: 700px;
          margin: 0 auto;
        }

        /* Stamp */
        .mv15-stamp {
          text-align: center;
          padding: 1.5rem 0;
          border-top: 1px solid #e8e6e2;
          border-bottom: 1px solid #e8e6e2;
          margin-bottom: 2rem;
        }
        .mv15-stamp span {
          display: block;
          font-size: 0.55rem;
          letter-spacing: 0.15em;
          color: #7a7a7a;
          line-height: 1.8;
        }

        /* CTA Slab */
        .mv15-ctaslab {
          background: #1a1a1a;
          padding: 2rem;
          text-align: center;
        }
        .mv15-ctaslab__actions {
          display: flex;
          gap: 0;
          justify-content: center;
        }
        .mv15-ctaslab__btn {
          display: inline-block;
          padding: 1rem 2rem;
          font-size: 0.7rem;
          font-weight: 600;
          letter-spacing: 0.15em;
          text-decoration: none;
          color: #fff;
          border: 1px solid #555;
          transition: all 0.2s;
          margin: -0.5px;
        }
        .mv15-ctaslab__btn:hover {
          background: #fff;
          color: #1a1a1a;
          border-color: #fff;
        }

        @media (max-width: 768px) {
          .mv15 { padding: 2rem 1rem; }
          .mv15-statswall,
          .mv15-certs,
          .mv15-dimensions { grid-template-columns: repeat(2, 1fr); }
          .mv15-specimen__type { grid-template-columns: 1fr; gap: 0.25rem; }
          .mv15-aog { flex-direction: column; }
          .mv15-aog__alert { writing-mode: horizontal-tb; padding: 1rem; }
        }

        /* ===== Cloud Frost Cert Cards ===== */
        @keyframes certCloudExpand {
          from { opacity: 0; max-height: 0; }
          to { opacity: 1; max-height: 500px; }
        }

        .cert-cloud { width: 100%; max-width: 700px; margin: 0 auto; }
        .cert-cloud--dealer { padding-bottom: 20px; }

        .cert-cloud__card {
          position: relative;
          background: rgba(250, 250, 252, 0.65);
          backdrop-filter: blur(20px); -webkit-backdrop-filter: blur(20px);
          border-radius: 16px;
          overflow: hidden;
          cursor: pointer;
          transition: all 0.3s ease;
          border: 1.5px solid rgba(0, 0, 0, 0.1);
          box-shadow: 0 8px 40px rgba(0, 0, 0, 0.08), 0 2px 8px rgba(0, 0, 0, 0.04);
        }
        .cert-cloud__card:hover { box-shadow: 0 12px 50px rgba(0, 0, 0, 0.12), 0 4px 12px rgba(0, 0, 0, 0.06); border-color: rgba(0, 0, 0, 0.15); }

        .cert-cloud__dots {
          position: absolute; inset: 0;
          background-image: radial-gradient(circle, rgba(0, 0, 0, 0.04) 2px, transparent 2px);
          background-size: 22px 22px; pointer-events: none; z-index: 0;
          clip-path: polygon(100% 0, 55% 194px, 0% 194px, 0% 236px, 100% 236px);
        }

        .cert-cloud__split { position: relative; display: flex; min-height: 140px; z-index: 1; }

        .cert-cloud__upper {
          flex: 1; display: flex; align-items: center; justify-content: center; padding: 2rem;
          background: rgba(0, 0, 0, 0.04);
          clip-path: polygon(0 0, 100% 0, 55% 100%, 0 100%);
        }

        .cert-cloud__lower { position: absolute; right: 2rem; top: 65%; transform: translateY(-50%); text-align: right; display: flex; align-items: center; gap: 0.4rem; }

        .cert-cloud__logo { height: 130px; width: auto; }

        .cert-cloud__guimbal-amp {
          display: inline-block; font-family: 'Space Grotesk', sans-serif; font-size: 1.1rem;
          font-weight: 300; color: rgba(0, 0, 0, 0.2); margin-right: 0.3rem;
        }
        .cert-cloud__guimbal-name {
          display: block; font-family: 'Space Grotesk', sans-serif; font-size: 0.9rem;
          font-weight: 700; color: rgba(0, 0, 0, 0.3); letter-spacing: 0.15em; text-transform: uppercase;
        }
        .cert-cloud__guimbal-sub { display: block; font-size: 0.6rem; color: rgba(0, 0, 0, 0.2); }

        .cert-cloud__hint { display: block; text-align: center; padding: 12px 2rem; font-size: 0.75rem; color: #2563eb; position: relative; z-index: 1; }

        .cert-divider { width: 60px; height: 1px; background: rgba(0, 0, 0, 0.1); margin: 20px auto; }

        .cert-cloud__expanded {
          border-top: 1px solid rgba(0, 0, 0, 0.06); animation: certCloudExpand 0.3s ease; text-align: center;
        }

        .cert-cloud__body { padding: 1.5rem 2.5rem 16px; }

        .cert-cloud__title {
          font-family: 'Space Grotesk', sans-serif; font-size: 1.4rem; font-weight: 700; color: #111; margin: 0 0 0.75rem;
        }

        .cert-cloud__desc { font-size: 0.85rem; line-height: 1.6; color: rgba(0, 0, 0, 0.55); margin: 0 0 1.5rem; }

        .cert-cloud__label-tag {
          display: inline-block; font-size: 0.65rem; font-weight: 700; text-transform: uppercase; letter-spacing: 0.15em;
          color: #2563eb; background: rgba(37, 99, 235, 0.08); padding: 0.25rem 0.75rem; border-radius: 20px; margin: 0 0 1.5rem;
        }

        .cert-cloud__stats {
          display: flex; justify-content: center; gap: 2rem; padding: 1rem 0 0;
          border-top: 1px solid rgba(0, 0, 0, 0.06);
        }

        .cert-cloud__stat { text-align: center; flex: 1; }
        .cert-cloud__stat-value { display: block; font-family: 'Share Tech Mono', monospace; font-size: 1.2rem; font-weight: 700; color: #111; }
        .cert-cloud__stat-label { display: block; font-size: 0.55rem; text-transform: uppercase; letter-spacing: 0.1em; color: rgba(0, 0, 0, 0.4); margin-top: 0.2rem; }

        .cert-cloud__footer {
          padding: 1rem 1.5rem; background: rgba(0, 0, 0, 0.03); border-top: 1px solid rgba(0, 0, 0, 0.06); text-align: center;
        }

        .cert-cloud__footer-label {
          display: block; font-size: 0.5rem; text-transform: uppercase; letter-spacing: 0.15em; color: rgba(0, 0, 0, 0.3); margin-bottom: 0.6rem;
        }

        .cert-cloud__pills { display: flex; flex-wrap: wrap; justify-content: center; gap: 0.4rem; }

        .cert-cloud__pill {
          font-size: 0.6rem; font-weight: 600; color: rgba(0, 0, 0, 0.6);
          padding: 0.3rem 0.75rem; border-radius: 20px; background: rgba(0, 0, 0, 0.04); border: 1px solid rgba(0, 0, 0, 0.08);
        }

        /* ===== LATEST FROM HQ BLOG SECTION ===== */
        .lhq__header {
          display: flex; align-items: center; gap: 1.5rem; margin-bottom: 0.75rem;
        }
        .lhq__header-line {
          flex: 1; height: 1px; background: #d4d0ca;
        }
        .lhq__title {
          font-family: 'Space Grotesk', sans-serif; font-size: 1.8rem; font-weight: 700;
          color: #1a1a1a; white-space: nowrap; letter-spacing: -0.02em;
        }
        .lhq__subtitle {
          text-align: center; font-family: 'Share Tech Mono', monospace; font-size: 0.7rem;
          text-transform: uppercase; letter-spacing: 0.15em; color: rgba(0,0,0,0.4); margin-bottom: 2.5rem;
        }

        /* Persona Cards */
        .lhq__personas {
          display: grid; grid-template-columns: repeat(5, 1fr); gap: 1px;
          background: #d4d0ca; border: 1px solid #d4d0ca; margin-bottom: 1.5rem;
        }
        .lhq__persona {
          all: unset; cursor: pointer; display: flex; flex-direction: column; align-items: flex-start;
          padding: 1.25rem 1.5rem; background: #fff; transition: all 0.25s ease;
          box-sizing: border-box;
        }
        .lhq__persona:hover { background: #f5f4f1; }
        .lhq__persona--active {
          background: #1a1a1a !important; color: #fff;
        }
        .lhq__persona--active .lhq__persona-icon,
        .lhq__persona--active .lhq__persona-subtitle { color: rgba(255,255,255,0.5); }
        .lhq__persona--active .lhq__persona-headline { color: #fff; }
        .lhq__persona-icon {
          font-family: 'Share Tech Mono', monospace; font-size: 0.6rem;
          color: rgba(0,0,0,0.25); margin-bottom: 0.75rem; letter-spacing: 0.1em;
        }
        .lhq__persona-headline {
          font-family: 'Space Grotesk', sans-serif; font-size: 1rem; font-weight: 600;
          color: #1a1a1a; margin-bottom: 0.25rem;
        }
        .lhq__persona-subtitle {
          font-family: 'Share Tech Mono', monospace; font-size: 0.6rem;
          color: rgba(0,0,0,0.4); letter-spacing: 0.02em;
        }

        /* Category Pills */
        /* Sort Toggle Bar */
        .lhq__sort-bar {
          display: flex; align-items: center; gap: 1rem; margin-bottom: 1.5rem;
        }
        .lhq__sort-toggle {
          position: relative; display: inline-flex; background: #f0efec;
          border: 1px solid #d4d0ca; overflow: hidden; box-sizing: border-box;
        }
        .lhq__sort-btn {
          all: unset; cursor: pointer; position: relative; z-index: 1;
          font-family: 'Share Tech Mono', monospace; font-size: 0.65rem;
          text-transform: uppercase; letter-spacing: 0.1em;
          padding: 0.5rem 1.25rem; transition: color 0.25s ease, background 0.25s ease;
          color: rgba(0,0,0,0.45); background: transparent;
          flex: 1; text-align: center;
        }
        .lhq__sort-btn--active { color: #fff; background: #1a1a1a; }
        .lhq__sort-count {
          font-family: 'Share Tech Mono', monospace; font-size: 0.6rem;
          color: rgba(0,0,0,0.3); letter-spacing: 0.06em; margin-left: auto; white-space: nowrap;
        }

        /* Search */
        .lhq__search-wrap {
          position: relative; display: flex; align-items: center; flex: 1; max-width: 280px;
        }
        .lhq__search-icon {
          position: absolute; left: 0.75rem; width: 14px; height: 14px;
          color: rgba(0,0,0,0.3); pointer-events: none;
        }
        .lhq__search {
          width: 100%; border: 1px solid #d4d0ca; background: transparent;
          font-family: 'Share Tech Mono', monospace; font-size: 0.65rem;
          padding: 0.5rem 2rem 0.5rem 2.25rem; outline: none;
          letter-spacing: 0.04em; color: #1a1a1a;
          transition: border-color 0.2s;
        }
        .lhq__search::placeholder { color: rgba(0,0,0,0.3); }
        .lhq__search:focus { border-color: #1a1a1a; }
        .lhq__search-clear {
          all: unset; cursor: pointer; position: absolute; right: 0.6rem;
          font-size: 1rem; color: rgba(0,0,0,0.35); line-height: 1;
          transition: color 0.2s;
        }
        .lhq__search-clear:hover { color: #1a1a1a; }

        /* Post List */
        .lhq__list {
          display: flex; flex-direction: column; background: #d4d0ca; gap: 1px;
          border: 1px solid #e8e6e2; margin-bottom: 2rem;
        }

        /* Compact Card */
        .lhq__compact {
          display: flex; gap: 1rem; background: #fff;
          text-decoration: none; color: inherit; padding: 1rem 1.25rem;
          transition: background 0.2s;
        }
        .lhq__compact:hover { background: #f9f8f5; }
        .lhq__compact-img-wrap {
          position: relative; flex-shrink: 0;
        }
        .lhq__compact-img {
          width: 80px; height: 80px; object-fit: cover; display: block;
        }
        .lhq__rank {
          position: absolute; top: 0; left: 0;
          background: #1a1a1a; color: #fff;
          font-family: 'Share Tech Mono', monospace; font-size: 0.55rem;
          letter-spacing: 0.05em; padding: 0.2rem 0.45rem;
          line-height: 1;
        }
        .lhq__compact-body {
          display: flex; flex-direction: column; justify-content: center; min-width: 0;
        }
        .lhq__cat-label {
          font-family: 'Share Tech Mono', monospace; font-size: 0.55rem;
          text-transform: uppercase; letter-spacing: 0.12em; color: rgba(0,0,0,0.4);
          margin-bottom: 0.25rem;
        }
        .lhq__compact-title {
          font-family: 'Space Grotesk', sans-serif; font-size: 0.88rem; font-weight: 600;
          color: #1a1a1a; line-height: 1.3; margin-bottom: 0.3rem;
          display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden;
        }
        .lhq__meta {
          display: flex; align-items: center; gap: 0.5rem;
          font-family: 'Share Tech Mono', monospace; font-size: 0.55rem;
          color: rgba(0,0,0,0.35); letter-spacing: 0.04em;
        }
        .lhq__meta-dot {
          width: 3px; height: 3px; border-radius: 50%; background: rgba(0,0,0,0.2);
        }

        /* Actions */
        .lhq__actions {
          display: flex; align-items: center; justify-content: space-between;
          padding-top: 1rem; border-top: 1px solid #e8e6e2;
        }
        .lhq__load-more {
          all: unset; cursor: pointer;
          font-family: 'Share Tech Mono', monospace; font-size: 0.65rem;
          text-transform: uppercase; letter-spacing: 0.12em;
          padding: 0.6rem 1.5rem; border: 1px solid #1a1a1a;
          transition: all 0.2s;
        }
        .lhq__load-more:hover { background: #1a1a1a; color: #fff; }
        .lhq__view-all {
          font-family: 'Share Tech Mono', monospace; font-size: 0.65rem;
          text-transform: uppercase; letter-spacing: 0.12em;
          color: rgba(0,0,0,0.5); text-decoration: none;
          transition: color 0.2s; margin-left: auto;
        }
        .lhq__view-all:hover { color: #1a1a1a; }

        /* Mobile Responsive */
        @media (max-width: 900px) {
          .lhq__personas { grid-template-columns: repeat(2, 1fr); }
        }
        @media (max-width: 560px) {
          .lhq__personas { grid-template-columns: 1fr; }
          .lhq__compact-img { width: 64px; height: 64px; }
          .lhq__actions { flex-direction: column; gap: 1rem; align-items: stretch; text-align: center; }
          .lhq__view-all { margin-left: 0; }
          .lhq__sort-bar { flex-wrap: wrap; }
          .lhq__search-wrap { max-width: 100%; order: 3; width: 100%; }
        }

        /* ================================================================
           EXPERIMENTATION-2: NEW SECTION STYLES
           ================================================================ */

        /* ── Shared Section Typography ── */
        .exp2-section-pre {
          display: block;
          font-family: 'Share Tech Mono', monospace;
          font-size: 0.6rem;
          text-transform: uppercase;
          letter-spacing: 0.3em;
          color: #777;
          margin-bottom: 1.5rem;
        }
        .exp2-section-title {
          font-family: 'Space Grotesk', sans-serif;
          font-size: clamp(2rem, 4vw, 3.5rem);
          font-weight: 700;
          text-transform: uppercase;
          line-height: 1.1;
          margin-bottom: 1.5rem;
        }
        .exp2-section-title__word { display: block; }
        .exp2-section-title__word--1 { color: #1a1a1a; }
        .exp2-section-title__word--2 { color: #999; }
        .exp2-section-title__word--3 { color: #bbb; }
        .exp2-section-title__word--4 { color: #ccc; }
        .exp2-section-desc {
          font-size: 0.9rem;
          color: #555;
          line-height: 1.7;
          max-width: 680px;
          margin-bottom: 3rem;
        }
        .exp2-btn {
          display: inline-flex;
          align-items: center;
          gap: 0.5rem;
          padding: 0.75rem 1.5rem;
          font-family: 'Space Grotesk', sans-serif;
          font-size: 0.7rem;
          font-weight: 600;
          text-transform: uppercase;
          letter-spacing: 0.08em;
          text-decoration: none;
          border: 1px solid #1a1a1a;
          color: #1a1a1a;
          background: transparent;
          transition: all 0.3s;
          cursor: pointer;
        }
        .exp2-btn:hover { background: #1a1a1a; color: #fff; }
        .exp2-btn--dark {
          background: #1a1a1a;
          color: #fff;
          border-color: #1a1a1a;
        }
        .exp2-btn--dark:hover { background: #333; }

        /* ================================================================
           1. TESTIMONIALS & REVIEWS
           ================================================================ */
        .exp2-testimonials {
          background: #fff;
          padding: 6rem 0;
        }
        .exp2-testimonials__inner {
          max-width: 1200px;
          margin: 0 auto;
          padding: 0 2rem;
        }
        .exp2-testimonials__cats {
          display: flex;
          gap: 0.5rem;
          flex-wrap: wrap;
          margin-bottom: 3rem;
        }
        .exp2-testimonials__cat {
          all: unset;
          cursor: pointer;
          font-family: 'Share Tech Mono', monospace;
          font-size: 0.6rem;
          text-transform: uppercase;
          letter-spacing: 0.1em;
          padding: 0.5rem 1rem;
          border: 1px solid #ccc8c1;
          transition: all 0.2s;
        }
        .exp2-testimonials__cat:hover { border-color: #999; }
        .exp2-testimonials__cat--active {
          background: #1a1a1a;
          color: #fff;
          border-color: #1a1a1a;
        }
        .exp2-testimonials__featured {
          margin-bottom: 3rem;
        }
        .exp2-testimonials__featured-quote {
          position: relative;
          background: #faf9f6;
          border: 1px solid #e8e6e2;
          padding: 3rem;
        }
        .exp2-testimonials__quote-mark {
          position: absolute;
          top: 1.5rem;
          left: 1.5rem;
          width: 48px;
          height: 48px;
        }
        .exp2-testimonials__featured-quote blockquote {
          font-family: 'Space Grotesk', sans-serif;
          font-size: 1.1rem;
          line-height: 1.8;
          color: #333;
          margin: 0 0 2rem 0;
          padding: 0;
          font-style: italic;
        }
        .exp2-testimonials__featured-author {
          display: flex;
          align-items: center;
          gap: 1rem;
        }
        .exp2-testimonials__avatar {
          width: 48px;
          height: 48px;
          border-radius: 50%;
          background: #1a1a1a;
          color: #fff;
          display: flex;
          align-items: center;
          justify-content: center;
          font-family: 'Share Tech Mono', monospace;
          font-size: 0.75rem;
          font-weight: 700;
          letter-spacing: 0.05em;
          flex-shrink: 0;
        }
        .exp2-testimonials__avatar--sm {
          width: 36px;
          height: 36px;
          font-size: 0.6rem;
        }
        .exp2-testimonials__featured-author strong {
          display: block;
          font-family: 'Space Grotesk', sans-serif;
          font-size: 0.85rem;
          font-weight: 700;
        }
        .exp2-testimonials__featured-author span {
          font-family: 'Share Tech Mono', monospace;
          font-size: 0.6rem;
          color: #777;
          text-transform: uppercase;
          letter-spacing: 0.06em;
        }
        .exp2-testimonials__stars {
          margin-left: auto;
          display: flex;
          gap: 2px;
          color: #d4a853;
          font-size: 1.1rem;
        }
        .exp2-testimonials__grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(340px, 1fr));
          gap: 1.25rem;
          margin-bottom: 3rem;
        }
        .exp2-testimonials__card {
          background: #faf9f6;
          border: 1px solid #e8e6e2;
          padding: 1.75rem;
          position: relative;
          transition: border-color 0.2s;
        }
        .exp2-testimonials__card:hover { border-color: #aaa; }
        .exp2-testimonials__card-stars {
          display: flex;
          gap: 1px;
          color: #d4a853;
          font-size: 0.85rem;
          margin-bottom: 1rem;
        }
        .exp2-testimonials__card-text {
          font-size: 0.85rem;
          line-height: 1.7;
          color: #444;
          margin-bottom: 1.25rem;
        }
        .exp2-testimonials__card-author {
          display: flex;
          align-items: center;
          gap: 0.75rem;
        }
        .exp2-testimonials__card-author strong {
          display: block;
          font-family: 'Space Grotesk', sans-serif;
          font-size: 0.75rem;
          font-weight: 700;
        }
        .exp2-testimonials__card-author span {
          font-family: 'Share Tech Mono', monospace;
          font-size: 0.55rem;
          color: #777;
          text-transform: uppercase;
          letter-spacing: 0.05em;
        }
        .exp2-testimonials__card-cat {
          position: absolute;
          top: 1rem;
          right: 1rem;
          font-family: 'Share Tech Mono', monospace;
          font-size: 0.5rem;
          text-transform: uppercase;
          letter-spacing: 0.1em;
          color: #aaa;
          border: 1px solid #e8e6e2;
          padding: 0.2rem 0.5rem;
        }
        .exp2-testimonials__cta-row {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 1.25rem;
        }
        .exp2-testimonials__cta-card {
          background: #faf9f6;
          border: 1px solid #e8e6e2;
          padding: 2rem;
        }
        .exp2-testimonials__cta-card h4 {
          font-family: 'Space Grotesk', sans-serif;
          font-size: 1rem;
          font-weight: 700;
          text-transform: uppercase;
          margin-bottom: 0.75rem;
        }
        .exp2-testimonials__cta-card p {
          font-size: 0.85rem;
          color: #555;
          line-height: 1.6;
          margin-bottom: 1.25rem;
        }
        .exp2-testimonials__cta-card--google {
          background: #f8f8f8;
          border-color: #e0e0e0;
        }
        .exp2-testimonials__google-stars {
          font-size: 1.2rem;
          color: #d4a853;
        }
        .exp2-testimonials__google-stars em {
          font-family: 'Share Tech Mono', monospace;
          font-size: 0.7rem;
          color: #777;
          font-style: normal;
          margin-left: 0.5rem;
        }
        @media (max-width: 768px) {
          .exp2-testimonials__grid { grid-template-columns: 1fr; }
          .exp2-testimonials__cta-row { grid-template-columns: 1fr; }
          .exp2-testimonials__featured-quote { padding: 2rem; }
        }

        /* ================================================================
           2. SPECIAL TRAINING
           ================================================================ */
        .exp2-special-training {
          background: #faf9f6;
          padding: 6rem 0;
        }
        .exp2-special-training__inner {
          max-width: 1200px;
          margin: 0 auto;
          padding: 0 2rem;
        }
        .exp2-special-training__grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 1.25rem;
          margin-bottom: 3rem;
        }
        .exp2-special-training__card {
          background: #fff;
          border: 1px solid #e8e6e2;
          padding: 2rem;
          transition: border-color 0.2s;
        }
        .exp2-special-training__card:hover { border-color: #999; }
        .exp2-special-training__card--featured {
          grid-column: 1 / -1;
          background: #1a1a1a;
          color: #fff;
          border-color: #1a1a1a;
          position: relative;
          overflow: hidden;
        }
        .exp2-special-training__card--featured h3 { color: #fff; }
        .exp2-special-training__card--featured p { color: rgba(255,255,255,0.75); }
        .exp2-special-training__card--featured:hover { border-color: #444; }
        .exp2-special-training__card-badge {
          display: inline-block;
          font-family: 'Share Tech Mono', monospace;
          font-size: 0.55rem;
          text-transform: uppercase;
          letter-spacing: 0.12em;
          padding: 0.3rem 0.75rem;
          border: 1px solid rgba(255,255,255,0.3);
          margin-bottom: 1.5rem;
          color: rgba(255,255,255,0.8);
        }
        .exp2-special-training__card-icon {
          font-size: 1.5rem;
          color: #999;
          margin-bottom: 1rem;
        }
        .exp2-special-training__card--featured .exp2-special-training__card-icon { color: rgba(255,255,255,0.4); }
        .exp2-special-training__card h3 {
          font-family: 'Space Grotesk', sans-serif;
          font-size: 1rem;
          font-weight: 700;
          text-transform: uppercase;
          margin-bottom: 0.75rem;
        }
        .exp2-special-training__card p {
          font-size: 0.85rem;
          color: #555;
          line-height: 1.7;
          margin-bottom: 1.25rem;
        }
        .exp2-special-training__card-meta {
          display: flex;
          gap: 1.5rem;
          font-family: 'Share Tech Mono', monospace;
          font-size: 0.6rem;
          text-transform: uppercase;
          letter-spacing: 0.08em;
          color: #999;
        }
        .exp2-special-training__card--featured .exp2-special-training__card-meta { color: rgba(255,255,255,0.5); }
        .exp2-special-training__card-meta i { margin-right: 0.3rem; }
        .exp2-special-training__quote {
          text-align: center;
          padding: 2.5rem 3rem;
          border: 1px solid #e8e6e2;
          background: #fff;
        }
        .exp2-special-training__quote blockquote {
          font-family: 'Space Grotesk', sans-serif;
          font-size: 1rem;
          font-style: italic;
          color: #444;
          margin: 0 0 0.75rem 0;
        }
        .exp2-special-training__quote span {
          font-family: 'Share Tech Mono', monospace;
          font-size: 0.6rem;
          text-transform: uppercase;
          letter-spacing: 0.12em;
          color: #999;
        }
        @media (max-width: 768px) {
          .exp2-special-training__grid { grid-template-columns: 1fr; }
        }

        /* ================================================================
           3. TOURS OF LONDON
           ================================================================ */
        .exp2-london-tours {
          background: #1a1a1a;
          color: #fff;
          padding: 6rem 0;
        }
        .exp2-london-tours__inner {
          max-width: 1200px;
          margin: 0 auto;
          padding: 0 2rem;
          display: grid;
          grid-template-columns: 1fr 380px;
          gap: 4rem;
          align-items: center;
        }
        .exp2-london-tours .exp2-section-pre { color: rgba(255,255,255,0.4); }
        .exp2-london-tours .exp2-section-title__word--1 { color: #fff; }
        .exp2-london-tours .exp2-section-title__word--2 { color: rgba(255,255,255,0.5); }
        .exp2-london-tours__desc {
          font-size: 0.9rem;
          color: rgba(255,255,255,0.65);
          line-height: 1.7;
          margin-bottom: 2.5rem;
        }
        .exp2-london-tours__highlights {
          display: flex;
          flex-direction: column;
          gap: 1.25rem;
          margin-bottom: 2.5rem;
        }
        .exp2-london-tours__highlight {
          display: flex;
          align-items: flex-start;
          gap: 1rem;
        }
        .exp2-london-tours__highlight-icon {
          width: 36px;
          height: 36px;
          border: 1px solid rgba(255,255,255,0.2);
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
          color: rgba(255,255,255,0.5);
          font-size: 0.85rem;
        }
        .exp2-london-tours__highlight strong {
          display: block;
          font-family: 'Space Grotesk', sans-serif;
          font-size: 0.8rem;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 0.03em;
          margin-bottom: 0.2rem;
        }
        .exp2-london-tours__highlight span {
          font-size: 0.75rem;
          color: rgba(255,255,255,0.45);
        }
        .exp2-london-tours__actions {
          display: flex;
          gap: 1rem;
          flex-wrap: wrap;
        }
        .exp2-london-tours .exp2-btn--dark {
          background: #fff;
          color: #1a1a1a;
          border-color: #fff;
        }
        .exp2-london-tours .exp2-btn--dark:hover { background: #e8e6e2; }
        .exp2-london-tours .exp2-btn {
          border-color: rgba(255,255,255,0.3);
          color: rgba(255,255,255,0.8);
        }
        .exp2-london-tours .exp2-btn:hover {
          background: rgba(255,255,255,0.1);
          color: #fff;
          border-color: rgba(255,255,255,0.5);
        }
        .exp2-london-tours__ticket {
          background: #fff;
          color: #1a1a1a;
          width: 100%;
        }
        .exp2-london-tours__ticket-header {
          display: flex;
          justify-content: space-between;
          padding: 1rem 1.5rem;
          border-bottom: 1px dashed #ccc;
          font-family: 'Share Tech Mono', monospace;
          font-size: 0.6rem;
          text-transform: uppercase;
          letter-spacing: 0.15em;
          color: #777;
        }
        .exp2-london-tours__ticket-body {
          padding: 2rem 1.5rem;
        }
        .exp2-london-tours__ticket-route {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 2rem;
        }
        .exp2-london-tours__ticket-from,
        .exp2-london-tours__ticket-to { text-align: center; }
        .exp2-london-tours__ticket-code {
          display: block;
          font-family: 'Space Grotesk', sans-serif;
          font-size: 2rem;
          font-weight: 700;
          letter-spacing: -0.02em;
        }
        .exp2-london-tours__ticket-from span,
        .exp2-london-tours__ticket-to span {
          font-family: 'Share Tech Mono', monospace;
          font-size: 0.55rem;
          text-transform: uppercase;
          letter-spacing: 0.1em;
          color: #999;
        }
        .exp2-london-tours__ticket-line {
          flex: 1;
          text-align: center;
          font-size: 1.2rem;
          color: #ccc;
          position: relative;
        }
        .exp2-london-tours__ticket-line::before {
          content: '';
          position: absolute;
          top: 50%;
          left: 10%;
          right: 10%;
          height: 1px;
          border-top: 1px dashed #ddd;
        }
        .exp2-london-tours__ticket-line span {
          position: relative;
          z-index: 1;
          background: #fff;
          padding: 0 0.5rem;
        }
        .exp2-london-tours__ticket-details {
          display: flex;
          justify-content: space-between;
          border-top: 1px solid #eee;
          padding-top: 1.25rem;
        }
        .exp2-london-tours__ticket-details div {
          text-align: center;
        }
        .exp2-london-tours__ticket-details span {
          display: block;
          font-family: 'Share Tech Mono', monospace;
          font-size: 0.5rem;
          text-transform: uppercase;
          letter-spacing: 0.1em;
          color: #999;
          margin-bottom: 0.3rem;
        }
        .exp2-london-tours__ticket-details strong {
          font-family: 'Space Grotesk', sans-serif;
          font-size: 0.85rem;
          font-weight: 700;
        }
        .exp2-london-tours__ticket-tear {
          height: 12px;
          background: repeating-linear-gradient(90deg, transparent, transparent 8px, #1a1a1a 8px, #1a1a1a 16px);
        }
        .exp2-london-tours__ticket-footer {
          padding: 1rem 1.5rem;
          text-align: center;
          font-family: 'Share Tech Mono', monospace;
          font-size: 0.6rem;
          text-transform: uppercase;
          letter-spacing: 0.15em;
          color: #aaa;
        }
        @media (max-width: 900px) {
          .exp2-london-tours__inner { grid-template-columns: 1fr; }
          .exp2-london-tours__visual { max-width: 380px; }
        }

        /* ================================================================
           4. HELICOPTER LEASEBACK
           ================================================================ */
        .exp2-leaseback {
          background: #e8e4df;
          padding: 6rem 0;
        }
        .exp2-leaseback__inner {
          max-width: 1200px;
          margin: 0 auto;
          padding: 0 2rem;
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 4rem;
          align-items: start;
        }
        .exp2-leaseback__intro {
          font-size: 0.9rem;
          color: #333;
          line-height: 1.8;
          margin-bottom: 1.5rem;
        }
        .exp2-leaseback__secondary {
          font-size: 0.85rem;
          color: #555;
          line-height: 1.7;
        }
        .exp2-leaseback__benefits {
          display: flex;
          flex-direction: column;
          gap: 1.5rem;
        }
        .exp2-leaseback__benefit {
          display: flex;
          gap: 1.25rem;
          align-items: flex-start;
        }
        .exp2-leaseback__benefit-num {
          font-family: 'Share Tech Mono', monospace;
          font-size: 0.7rem;
          color: #999;
          letter-spacing: 0.05em;
          padding-top: 0.15rem;
          flex-shrink: 0;
        }
        .exp2-leaseback__benefit strong {
          display: block;
          font-family: 'Space Grotesk', sans-serif;
          font-size: 0.85rem;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 0.03em;
          margin-bottom: 0.3rem;
        }
        .exp2-leaseback__benefit p {
          font-size: 0.8rem;
          color: #555;
          line-height: 1.6;
          margin: 0;
        }
        @media (max-width: 900px) {
          .exp2-leaseback__inner { grid-template-columns: 1fr; }
        }

        /* ================================================================
           5. PILOT PROVISIONING
           ================================================================ */
        .exp2-pilot-services {
          background: #faf9f6;
          padding: 6rem 0;
        }
        .exp2-pilot-services__inner {
          max-width: 1200px;
          margin: 0 auto;
          padding: 0 2rem;
        }
        .exp2-pilot-services__grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 1.25rem;
          margin-bottom: 2rem;
        }
        .exp2-pilot-services__card {
          background: #fff;
          border: 1px solid #e8e6e2;
          padding: 2.5rem 2rem;
          transition: border-color 0.2s, transform 0.2s;
        }
        .exp2-pilot-services__card:hover {
          border-color: #999;
          transform: translateY(-2px);
        }
        .exp2-pilot-services__card-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 1.5rem;
        }
        .exp2-pilot-services__card-num {
          font-family: 'Share Tech Mono', monospace;
          font-size: 0.65rem;
          color: #bbb;
          letter-spacing: 0.05em;
        }
        .exp2-pilot-services__card-header i {
          font-size: 1.2rem;
          color: #ccc;
        }
        .exp2-pilot-services__card h3 {
          font-family: 'Space Grotesk', sans-serif;
          font-size: 1rem;
          font-weight: 700;
          text-transform: uppercase;
          margin-bottom: 0.75rem;
        }
        .exp2-pilot-services__card p {
          font-size: 0.85rem;
          color: #555;
          line-height: 1.7;
          margin-bottom: 1.25rem;
        }
        .exp2-pilot-services__card-tag {
          font-family: 'Share Tech Mono', monospace;
          font-size: 0.55rem;
          text-transform: uppercase;
          letter-spacing: 0.1em;
          color: #aaa;
          border: 1px solid #e8e6e2;
          padding: 0.25rem 0.6rem;
        }
        .exp2-pilot-services__cta {
          text-align: center;
          margin-top: 2rem;
        }
        @media (max-width: 900px) {
          .exp2-pilot-services__grid { grid-template-columns: 1fr; }
        }

        /* ================================================================
           6. SPECIAL OPS
           ================================================================ */
        .exp2-special-ops {
          background: #111;
          color: #fff;
          padding: 6rem 0;
        }
        .exp2-special-ops__inner {
          max-width: 1200px;
          margin: 0 auto;
          padding: 0 2rem;
        }
        .exp2-special-ops .exp2-section-pre { color: rgba(255,255,255,0.35); }
        .exp2-special-ops .exp2-section-title__word--1 { color: #fff; }
        .exp2-special-ops .exp2-section-title__word--2 { color: rgba(255,255,255,0.6); }
        .exp2-special-ops .exp2-section-title__word--3 { color: rgba(255,255,255,0.4); }
        .exp2-special-ops .exp2-section-title__word--4 { color: rgba(255,255,255,0.25); }
        .exp2-special-ops__desc {
          font-size: 0.9rem;
          color: rgba(255,255,255,0.55);
          line-height: 1.7;
          max-width: 700px;
          margin-bottom: 3rem;
        }
        .exp2-special-ops__services {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 1.25rem;
        }
        .exp2-special-ops__service {
          border: 1px solid rgba(255,255,255,0.12);
          padding: 2rem;
          transition: border-color 0.2s;
        }
        .exp2-special-ops__service:hover { border-color: rgba(255,255,255,0.3); }
        .exp2-special-ops__service-icon {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 40px;
          height: 40px;
          border: 1px solid rgba(255,255,255,0.15);
          margin-bottom: 1.25rem;
          color: rgba(255,255,255,0.4);
          font-size: 1rem;
        }
        .exp2-special-ops__service h4 {
          font-family: 'Space Grotesk', sans-serif;
          font-size: 0.85rem;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 0.03em;
          margin-bottom: 0.5rem;
        }
        .exp2-special-ops__service p {
          font-size: 0.8rem;
          color: rgba(255,255,255,0.45);
          line-height: 1.6;
        }
        .exp2-special-ops .exp2-btn--dark {
          background: #fff;
          color: #111;
          border-color: #fff;
        }
        .exp2-special-ops .exp2-btn--dark:hover { background: #ddd; }
        @media (max-width: 768px) {
          .exp2-special-ops__services { grid-template-columns: 1fr; }
        }

        /* ================================================================
           7. PART SALES
           ================================================================ */
        .exp2-parts {
          background: #fff;
          padding: 6rem 0;
        }
        .exp2-parts__inner {
          max-width: 1200px;
          margin: 0 auto;
          padding: 0 2rem;
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 4rem;
          align-items: start;
        }
        .exp2-parts__text {
          font-size: 0.9rem;
          color: #333;
          line-height: 1.8;
          margin-bottom: 1.5rem;
        }
        .exp2-parts__secondary {
          font-size: 0.85rem;
          color: #555;
          line-height: 1.7;
        }
        .exp2-parts__stats {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 1rem;
          margin-bottom: 2rem;
        }
        .exp2-parts__stat {
          background: #faf9f6;
          border: 1px solid #e8e6e2;
          padding: 1.25rem;
          text-align: center;
        }
        .exp2-parts__stat-value {
          display: block;
          font-family: 'Space Grotesk', sans-serif;
          font-size: 1.5rem;
          font-weight: 700;
          color: #1a1a1a;
          margin-bottom: 0.25rem;
        }
        .exp2-parts__stat-label {
          font-family: 'Share Tech Mono', monospace;
          font-size: 0.55rem;
          text-transform: uppercase;
          letter-spacing: 0.1em;
          color: #999;
        }
        .exp2-parts__enquiry {
          background: #faf9f6;
          border: 1px solid #e8e6e2;
          padding: 2rem;
        }
        .exp2-parts__enquiry h4 {
          font-family: 'Space Grotesk', sans-serif;
          font-size: 0.9rem;
          font-weight: 700;
          text-transform: uppercase;
          margin-bottom: 1.25rem;
        }
        .exp2-parts__enquiry-field {
          border-bottom: 1px solid #e8e6e2;
          padding: 0.75rem 0;
        }
        .exp2-parts__enquiry-field:last-of-type {
          margin-bottom: 1.5rem;
        }
        .exp2-parts__enquiry-field label {
          display: block;
          font-family: 'Space Grotesk', sans-serif;
          font-size: 0.75rem;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 0.03em;
          margin-bottom: 0.25rem;
        }
        .exp2-parts__enquiry-hint {
          font-family: 'Share Tech Mono', monospace;
          font-size: 0.6rem;
          color: #999;
          letter-spacing: 0.02em;
        }
        @media (max-width: 900px) {
          .exp2-parts__inner { grid-template-columns: 1fr; }
        }

        /* ================================================================
           8. PRICING
           ================================================================ */
        .exp2-pricing {
          background: #faf9f6;
          padding: 6rem 0;
        }
        .exp2-pricing__inner {
          max-width: 1200px;
          margin: 0 auto;
          padding: 0 2rem;
        }
        .exp2-pricing__tabs {
          display: flex;
          gap: 0;
          margin-bottom: 2.5rem;
          border-bottom: 1px solid #e8e6e2;
        }
        .exp2-pricing__tab {
          all: unset;
          cursor: pointer;
          font-family: 'Space Grotesk', sans-serif;
          font-size: 0.75rem;
          font-weight: 600;
          text-transform: uppercase;
          letter-spacing: 0.05em;
          padding: 0.75rem 1.5rem;
          border-bottom: 2px solid transparent;
          color: #999;
          transition: all 0.2s;
        }
        .exp2-pricing__tab:hover { color: #555; }
        .exp2-pricing__tab--active {
          color: #1a1a1a;
          border-bottom-color: #1a1a1a;
        }
        .exp2-pricing__table-wrap {
          margin-bottom: 2rem;
        }
        .exp2-pricing__table {
          width: 100%;
          border-collapse: collapse;
          margin-bottom: 1.5rem;
        }
        .exp2-pricing__table th {
          font-family: 'Share Tech Mono', monospace;
          font-size: 0.6rem;
          text-transform: uppercase;
          letter-spacing: 0.1em;
          color: #999;
          text-align: left;
          padding: 0.75rem 1rem;
          border-bottom: 1px solid #e8e6e2;
        }
        .exp2-pricing__table td {
          padding: 1rem;
          border-bottom: 1px solid #f0eee9;
          font-size: 0.85rem;
          color: #333;
          vertical-align: top;
        }
        .exp2-pricing__table td strong {
          font-family: 'Space Grotesk', sans-serif;
          font-weight: 700;
        }
        .exp2-pricing__table td span {
          display: block;
          font-size: 0.75rem;
          color: #777;
          margin-top: 0.25rem;
        }
        .exp2-pricing__price {
          font-family: 'Space Grotesk', sans-serif;
          font-weight: 700;
          white-space: nowrap;
        }
        .exp2-pricing__table-highlight {
          background: #f2efea;
        }
        .exp2-pricing__note {
          background: #fff;
          border: 1px solid #e8e6e2;
          padding: 1.25rem 1.5rem;
          font-size: 0.8rem;
          color: #555;
          line-height: 1.6;
          margin-bottom: 0.75rem;
        }
        .exp2-pricing__note strong {
          font-family: 'Space Grotesk', sans-serif;
          color: #1a1a1a;
        }
        .exp2-pricing__valet-intro {
          font-size: 0.9rem;
          color: #555;
          line-height: 1.7;
          margin-bottom: 2rem;
        }
        .exp2-pricing__table--valet td,
        .exp2-pricing__table--valet th {
          text-align: center;
        }
        .exp2-pricing__table--valet td:first-child,
        .exp2-pricing__table--valet th:first-child {
          text-align: left;
        }
        .exp2-pricing__valet-tiers {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 1.25rem;
          margin-top: 1.5rem;
        }
        .exp2-pricing__valet-tier {
          background: #fff;
          border: 1px solid #e8e6e2;
          padding: 1.5rem;
        }
        .exp2-pricing__valet-tier h4 {
          font-family: 'Space Grotesk', sans-serif;
          font-size: 0.85rem;
          font-weight: 700;
          text-transform: uppercase;
          margin-bottom: 0.75rem;
        }
        .exp2-pricing__valet-tier ul {
          list-style: none;
          padding: 0;
          margin: 0;
        }
        .exp2-pricing__valet-tier li {
          font-size: 0.75rem;
          color: #555;
          padding: 0.35rem 0;
          border-bottom: 1px solid #f5f3f0;
        }
        .exp2-pricing__valet-tier li:last-child { border-bottom: none; }
        .exp2-pricing__hangarage-includes {
          background: #fff;
          border: 1px solid #e8e6e2;
          padding: 2rem;
          margin-bottom: 0.75rem;
        }
        .exp2-pricing__hangarage-includes h4 {
          font-family: 'Space Grotesk', sans-serif;
          font-size: 0.85rem;
          font-weight: 700;
          text-transform: uppercase;
          margin-bottom: 1.25rem;
        }
        .exp2-pricing__hangarage-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 1rem;
        }
        .exp2-pricing__hangarage-item {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          font-size: 0.8rem;
          color: #444;
        }
        .exp2-pricing__hangarage-item i {
          width: 32px;
          height: 32px;
          display: flex;
          align-items: center;
          justify-content: center;
          border: 1px solid #e8e6e2;
          color: #999;
          font-size: 0.8rem;
          flex-shrink: 0;
        }
        @media (max-width: 768px) {
          .exp2-pricing__valet-tiers { grid-template-columns: 1fr; }
          .exp2-pricing__table { font-size: 0.75rem; }
          .exp2-pricing__hangarage-grid { grid-template-columns: repeat(2, 1fr); }
        }

        /* ================================================================
           9. STORE
           ================================================================ */
        .exp2-store {
          background: #fff;
          padding: 6rem 0;
        }
        .exp2-store__inner {
          max-width: 1200px;
          margin: 0 auto;
          padding: 0 2rem;
        }
        .exp2-store__cats {
          display: flex;
          gap: 0.5rem;
          margin-bottom: 2.5rem;
        }
        .exp2-store__cat {
          all: unset;
          cursor: pointer;
          font-family: 'Share Tech Mono', monospace;
          font-size: 0.6rem;
          text-transform: uppercase;
          letter-spacing: 0.1em;
          padding: 0.5rem 1rem;
          border: 1px solid #ccc8c1;
          transition: all 0.2s;
        }
        .exp2-store__cat:hover { border-color: #999; }
        .exp2-store__cat--active {
          background: #1a1a1a;
          color: #fff;
          border-color: #1a1a1a;
        }
        .exp2-store__grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 1.25rem;
          margin-bottom: 3rem;
        }
        .exp2-store__card {
          border: 1px solid #e8e6e2;
          transition: border-color 0.2s;
        }
        .exp2-store__card:hover { border-color: #999; }
        .exp2-store__card-img {
          background: #faf9f6;
          padding: 2rem;
          display: flex;
          align-items: center;
          justify-content: center;
          min-height: 140px;
          border-bottom: 1px solid #e8e6e2;
        }
        .exp2-store__card-body {
          padding: 1.5rem;
        }
        .exp2-store__card-tag {
          display: inline-block;
          font-family: 'Share Tech Mono', monospace;
          font-size: 0.5rem;
          text-transform: uppercase;
          letter-spacing: 0.1em;
          padding: 0.2rem 0.5rem;
          border: 1px solid #e8e6e2;
          color: #999;
          margin-bottom: 0.75rem;
        }
        .exp2-store__card-body h4 {
          font-family: 'Space Grotesk', sans-serif;
          font-size: 0.9rem;
          font-weight: 700;
          text-transform: uppercase;
          margin-bottom: 0.5rem;
        }
        .exp2-store__card-body p {
          font-size: 0.8rem;
          color: #555;
          line-height: 1.6;
          margin-bottom: 0.75rem;
        }
        .exp2-store__card-price {
          font-family: 'Space Grotesk', sans-serif;
          font-size: 0.9rem;
          font-weight: 700;
          color: #1a1a1a;
        }
        .exp2-store__voucher-banner {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 2rem;
          background: #1a1a1a;
          color: #fff;
          padding: 2.5rem 3rem;
        }
        .exp2-store__voucher-text h4 {
          font-family: 'Space Grotesk', sans-serif;
          font-size: 1rem;
          font-weight: 700;
          text-transform: uppercase;
          margin-bottom: 0.5rem;
        }
        .exp2-store__voucher-text p {
          font-size: 0.8rem;
          color: rgba(255,255,255,0.6);
          line-height: 1.6;
          max-width: 600px;
        }
        .exp2-store__voucher-banner .exp2-btn {
          border-color: rgba(255,255,255,0.3);
          color: #fff;
          flex-shrink: 0;
        }
        .exp2-store__voucher-banner .exp2-btn:hover {
          background: rgba(255,255,255,0.1);
          border-color: rgba(255,255,255,0.5);
        }
        @media (max-width: 900px) {
          .exp2-store__grid { grid-template-columns: 1fr; }
          .exp2-store__voucher-banner { flex-direction: column; text-align: center; }
        }

        /* ================================================================
           10. CAREERS
           ================================================================ */
        .exp2-careers {
          background: #e8e4df;
          padding: 6rem 0;
        }
        .exp2-careers__inner {
          max-width: 1200px;
          margin: 0 auto;
          padding: 0 2rem;
        }
        .exp2-careers__grid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 1.25rem;
          margin-bottom: 3rem;
        }
        .exp2-careers__dept {
          background: #fff;
          border: 1px solid #d6d1ca;
          padding: 2rem;
          transition: border-color 0.2s;
        }
        .exp2-careers__dept:hover { border-color: #999; }
        .exp2-careers__dept-icon {
          width: 40px;
          height: 40px;
          border: 1px solid #e8e6e2;
          display: flex;
          align-items: center;
          justify-content: center;
          margin-bottom: 1.25rem;
          color: #999;
          font-size: 1rem;
        }
        .exp2-careers__dept h4 {
          font-family: 'Space Grotesk', sans-serif;
          font-size: 0.85rem;
          font-weight: 700;
          text-transform: uppercase;
          margin-bottom: 0.5rem;
        }
        .exp2-careers__dept p {
          font-size: 0.8rem;
          color: #555;
          line-height: 1.6;
        }
        .exp2-careers__cta {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 2rem;
          background: #fff;
          border: 1px solid #d6d1ca;
          padding: 2.5rem 3rem;
        }
        .exp2-careers__cta-text h4 {
          font-family: 'Space Grotesk', sans-serif;
          font-size: 1rem;
          font-weight: 700;
          text-transform: uppercase;
          margin-bottom: 0.5rem;
        }
        .exp2-careers__cta-text p {
          font-size: 0.8rem;
          color: #555;
          line-height: 1.6;
          max-width: 600px;
        }
        @media (max-width: 900px) {
          .exp2-careers__grid { grid-template-columns: repeat(2, 1fr); }
          .exp2-careers__cta { flex-direction: column; text-align: center; }
        }
        @media (max-width: 560px) {
          .exp2-careers__grid { grid-template-columns: 1fr; }
        }


        /* ================================================================
           MERGED EDITORIAL GRID + WHY WE FLY — 10 VARIATION STYLES
           ================================================================ */

        /* --- Shared grid patterns (editorial grid layout reused across variations) --- */
        [class^="meg-v"] { box-sizing: border-box; }

        /* ===== V1: DISCOVERY GRID ===== */
        .meg-v1 { background: #faf9f7; min-height: 100vh; display: grid; grid-template-rows: auto 1fr auto auto; }
        .meg-v1__header {
          display: flex; align-items: baseline; padding: 1.5rem 2rem;
          border-bottom: 1px solid #e8e6e2; gap: 1rem;
        }
        .meg-v1__logo { font-family: 'Cormorant Garamond', serif; font-size: 1.75rem; font-weight: 600; color: #1a1a1a; }
        .meg-v1__tagline { font-family: 'Cormorant Garamond', serif; font-size: 1rem; font-style: italic; color: #666; }
        .meg-v1__meta {
          margin-left: auto; font-size: 0.65rem; text-transform: uppercase;
          letter-spacing: 0.15em; color: #999;
        }
        .meg-v1__grid {
          display: grid; grid-template-columns: 1.5fr 1fr 1fr;
          grid-template-rows: 1fr 1fr; gap: 1px; background: #e8e6e2; min-height: 520px;
        }
        .meg-v1__cell { position: relative; background: #fff; overflow: hidden; }
        .meg-v1__cell img { width: 100%; height: 100%; object-fit: cover; transition: transform 0.8s ease; }
        .meg-v1__cell:hover img { transform: scale(1.05); }
        .meg-v1__cell--feature { grid-row: span 2; }
        .meg-v1__cell-hover {
          position: absolute; bottom: 0; left: 0; right: 0; padding: 1.5rem;
          background: linear-gradient(to top, rgba(0,0,0,0.75), transparent);
          transform: translateY(100%); opacity: 0;
          transition: transform 0.4s cubic-bezier(0.25, 0.1, 0.25, 1), opacity 0.4s ease;
          pointer-events: none;
        }
        .meg-v1__cell:hover .meg-v1__cell-hover { transform: translateY(0); opacity: 1; }
        .meg-v1__cell-hover p {
          font-family: 'Cormorant Garamond', serif; font-size: 0.95rem;
          font-style: italic; color: #fff; margin: 0;
        }
        .meg-v1__cell--why {
          background: #1a1a1a; cursor: pointer; display: flex;
          align-items: center; justify-content: center;
          transition: background 0.3s;
        }
        .meg-v1__cell--why:hover { background: #2a2a2a; }
        .meg-v1__why-inner {
          display: flex; flex-direction: column; align-items: center;
          gap: 0.4rem; padding: 2rem; text-align: center;
        }
        .meg-v1__why-label {
          font-size: 0.55rem; text-transform: uppercase; letter-spacing: 0.2em;
          color: rgba(255,255,255,0.4);
        }
        .meg-v1__why-verb {
          font-family: 'Cormorant Garamond', serif; font-size: 1.5rem;
          font-weight: 600; color: #fff;
        }
        .meg-v1__why-noun {
          font-family: 'Cormorant Garamond', serif; font-size: 1rem;
          font-weight: 400; color: rgba(255,255,255,0.6);
        }
        .meg-v1__why-pulse {
          width: 6px; height: 6px; border-radius: 50%; background: #999;
          animation: megPulse 2s ease-in-out infinite;
        }
        @keyframes megPulse {
          0%, 100% { opacity: 0.4; transform: scale(1); }
          50% { opacity: 1; transform: scale(1.4); }
        }
        .meg-v1__why-hint {
          font-size: 0.6rem; text-transform: uppercase; letter-spacing: 0.1em;
          color: rgba(255,255,255,0.35); margin-top: 0.5rem;
        }
        /* Expanded benefit panel */
        .meg-v1__expanded {
          background: #faf9f7; position: relative; min-height: 520px;
          animation: megFadeIn 0.35s ease;
        }
        @keyframes megFadeIn {
          from { opacity: 0; transform: translateY(8px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .meg-v1__close {
          position: absolute; top: 1.5rem; right: 1.5rem; z-index: 2;
          width: 36px; height: 36px; border-radius: 50%; border: 1px solid #e8e6e2;
          background: #fff; font-size: 1.2rem; cursor: pointer; color: #1a1a1a;
          transition: background 0.2s;
        }
        .meg-v1__close:hover { background: #1a1a1a; color: #fff; }
        .meg-v1__expanded-body {
          display: grid; grid-template-columns: 1.2fr 1fr; min-height: 420px;
        }
        .meg-v1__expanded-img { position: relative; overflow: hidden; }
        .meg-v1__expanded-img img { width: 100%; height: 100%; object-fit: cover; }
        .meg-v1__expanded-text {
          padding: 3rem; display: flex; flex-direction: column; justify-content: center;
        }
        .meg-v1__expanded-label {
          font-size: 0.6rem; text-transform: uppercase; letter-spacing: 0.2em;
          color: #999; margin-bottom: 1rem;
        }
        .meg-v1__expanded-text h3 {
          font-family: 'Cormorant Garamond', serif; font-size: 2rem; font-weight: 400;
          line-height: 1.2; margin: 0 0 1rem;
        }
        .meg-v1__expanded-text h3 span {
          font-weight: 600; color: #1a1a1a;
        }
        .meg-v1__expanded-text p {
          font-size: 0.9rem; color: #666; line-height: 1.7; margin: 0 0 2rem;
        }
        .meg-v1__expanded-thumbs {
          display: flex; gap: 0.5rem;
        }
        .meg-v1__expanded-thumb {
          width: 48px; height: 48px; border-radius: 4px; background-size: cover;
          background-position: center; cursor: pointer; opacity: 0.5;
          border: 2px solid transparent; transition: opacity 0.2s, border-color 0.2s;
        }
        .meg-v1__expanded-thumb:hover { opacity: 0.8; }
        .meg-v1__expanded-thumb.active { opacity: 1; border-color: #1a1a1a; }
        .meg-v1__expanded-nav {
          display: flex; align-items: center; justify-content: center;
          gap: 0.75rem; padding: 1.25rem 2rem;
          border-top: 1px solid #e8e6e2;
        }
        .meg-v1__expanded-nav button {
          width: 36px; height: 36px; border-radius: 6px;
          border: 1px solid rgba(26,26,26,0.15); background: transparent;
          cursor: pointer; color: rgba(26,26,26,0.4);
          display: flex; align-items: center; justify-content: center;
          transition: all 0.25s;
        }
        .meg-v1__expanded-nav button:hover { background: #1a1a1a; border-color: #1a1a1a; color: #fff; }
        .meg-v1__expanded-dots { display: flex; gap: 4px; }
        .meg-v1__dot {
          width: 4px; height: 4px; background: rgba(26,26,26,0.15);
          border-radius: 2px; cursor: pointer; transition: all 0.25s;
        }
        .meg-v1__dot:hover { background: rgba(26,26,26,0.4); }
        .meg-v1__dot.active { width: 16px; background: #1a1a1a; }
        .meg-v1__expanded-counter {
          font-family: 'Share Tech Mono', monospace; font-size: 0.6rem;
          color: rgba(26,26,26,0.35); letter-spacing: 0.1em;
        }
        /* Pagination */
        .meg-v1__pagination {
          display: flex; align-items: center; justify-content: center;
          gap: 0.75rem; padding: 1rem 2rem; border-top: 1px solid #e8e6e2;
        }
        .meg-v1__pagination button {
          width: 44px; height: 44px; border-radius: 50%;
          border: 1px solid rgba(0,0,0,0.15); background: rgba(255,255,255,0.9);
          cursor: pointer; font-size: 1.1rem; color: #1a1a1a; transition: all 0.2s;
        }
        .meg-v1__pagination button:hover { background: #1a1a1a; color: #fff; }
        .meg-v1__page-count {
          font-family: 'Share Tech Mono', monospace; font-size: 0.7rem;
          color: #999; letter-spacing: 0.1em;
        }
        .meg-v1__pdot {
          width: 8px; height: 8px; border-radius: 50%; border: 1px solid #ccc;
          background: transparent; cursor: pointer; transition: all 0.2s;
        }
        .meg-v1__pdot:hover { border-color: #999; }
        .meg-v1__pdot.active { background: #1a1a1a; border-color: #1a1a1a; }
        /* Ticker */
        .meg-v1__ticker {
          padding: 1rem 0; border-top: 1px solid #e8e6e2; overflow: hidden;
        }
        .meg-v1__ticker-track {
          display: flex; gap: 2rem; animation: megTicker 20s linear infinite;
          white-space: nowrap;
        }
        @keyframes megTicker {
          from { transform: translateX(0); }
          to { transform: translateX(-50%); }
        }
        .meg-v1__ticker-track span {
          font-size: 0.65rem; text-transform: uppercase; letter-spacing: 0.1em; color: #666;
        }
        @media (max-width: 768px) {
          .meg-v1__grid { grid-template-columns: 1fr; grid-template-rows: auto; min-height: auto; }
          .meg-v1__cell--feature { grid-row: 1; min-height: 50vh; }
          .meg-v1__cell { min-height: 200px; }
          .meg-v1__expanded-body { grid-template-columns: 1fr; }
          .meg-v1__expanded-img { min-height: 250px; }
        }

        /* ===== V2: WOVEN PAGES ===== */
        .meg-v2 { background: #faf9f7; min-height: 100vh; display: grid; grid-template-rows: auto 1fr auto; }
        .meg-v2__header {
          display: flex; align-items: baseline; padding: 1.5rem 2rem;
          border-bottom: 1px solid #e8e6e2; gap: 1rem;
        }
        .meg-v2__logo { font-family: 'Cormorant Garamond', serif; font-size: 1.75rem; font-weight: 600; }
        .meg-v2__tagline { font-family: 'Cormorant Garamond', serif; font-size: 1rem; font-style: italic; color: #666; }
        .meg-v2__page-label {
          margin-left: auto; font-size: 0.6rem; text-transform: uppercase;
          letter-spacing: 0.15em; color: #999; padding: 0.25rem 0.6rem;
          border: 1px solid #e8e6e2; border-radius: 2px;
        }
        .meg-v2__grid {
          display: grid; grid-template-columns: 1.5fr 1fr 1fr;
          grid-template-rows: 1fr 1fr; gap: 1px; background: #e8e6e2; min-height: 520px;
        }
        .meg-v2__cell { position: relative; background: #fff; overflow: hidden; }
        .meg-v2__cell img { width: 100%; height: 100%; object-fit: cover; transition: transform 0.8s; }
        .meg-v2__cell:hover img { transform: scale(1.05); }
        .meg-v2__cell--feature { grid-row: span 2; }
        .meg-v2__cell--quote {
          background: #1a1a1a; display: flex; flex-direction: column;
          justify-content: center; align-items: center; padding: 2rem;
        }
        .meg-v2__cell--quote blockquote {
          font-family: 'Cormorant Garamond', serif; font-size: 1.15rem;
          font-style: italic; color: #fff; text-align: center; line-height: 1.6; margin: 0 0 1rem;
        }
        .meg-v2__cell--quote cite {
          font-size: 0.65rem; text-transform: uppercase; letter-spacing: 0.15em;
          color: rgba(255,255,255,0.5); font-style: normal;
        }
        .meg-v2__cell-hover {
          position: absolute; bottom: 0; left: 0; right: 0; padding: 1.5rem;
          background: linear-gradient(to top, rgba(0,0,0,0.75), transparent);
          transform: translateY(100%); opacity: 0;
          transition: transform 0.4s cubic-bezier(0.25, 0.1, 0.25, 1), opacity 0.4s;
        }
        .meg-v2__cell:hover .meg-v2__cell-hover { transform: translateY(0); opacity: 1; }
        .meg-v2__cell-hover p {
          font-family: 'Cormorant Garamond', serif; font-size: 0.95rem;
          font-style: italic; color: #fff; margin: 0;
        }
        /* Benefit page overlay */
        .meg-v2__benefit-overlay {
          position: absolute; bottom: 0; left: 0; right: 0;
          padding: 3rem 2rem; background: linear-gradient(transparent, rgba(0,0,0,0.8));
        }
        .meg-v2__benefit-overlay h3 {
          font-family: 'Cormorant Garamond', serif; font-size: 1.75rem;
          color: #fff; font-weight: 400; margin: 0;
        }
        .meg-v2__benefit-overlay h3 span { font-weight: 600; }
        .meg-v2__benefit-label {
          font-size: 0.55rem; text-transform: uppercase; letter-spacing: 0.2em;
          color: rgba(255,255,255,0.5); display: block; margin-bottom: 0.5rem;
        }
        .meg-v2__cell--desc {
          background: #1a1a1a; display: flex; flex-direction: column;
          justify-content: center; padding: 2rem;
        }
        .meg-v2__cell--desc p {
          font-size: 0.85rem; color: rgba(255,255,255,0.8); line-height: 1.7; margin: 0;
        }
        .meg-v2__pagination {
          display: flex; align-items: center; justify-content: center;
          gap: 1rem; padding: 1rem 2rem; border-top: 1px solid #e8e6e2;
        }
        .meg-v2__chev {
          width: 44px; height: 44px; border-radius: 50%;
          border: 1px solid rgba(0,0,0,0.15); background: rgba(255,255,255,0.9);
          cursor: pointer; display: flex; align-items: center; justify-content: center;
          color: #1a1a1a; transition: all 0.2s;
        }
        .meg-v2__chev:hover { background: #1a1a1a; color: #fff; }
        .meg-v2__counter {
          font-family: 'Share Tech Mono', monospace; font-size: 0.7rem;
          color: #999; letter-spacing: 0.1em;
        }
        .meg-v2__dots { display: flex; gap: 0.5rem; align-items: center; }
        .meg-v2__dot {
          width: 8px; height: 8px; border-radius: 50%; border: 1px solid #ccc;
          background: transparent; cursor: pointer; transition: all 0.2s;
        }
        .meg-v2__dot:hover { border-color: #999; }
        .meg-v2__dot.active { background: #1a1a1a; border-color: #1a1a1a; }
        .meg-v2__dot.benefit { border-color: #999; border-style: dashed; }
        .meg-v2__dot.benefit.active { background: #1a1a1a; border-style: solid; }
        @media (max-width: 768px) {
          .meg-v2__grid { grid-template-columns: 1fr; grid-template-rows: auto; min-height: auto; }
          .meg-v2__cell--feature { grid-row: 1; min-height: 50vh; }
          .meg-v2__cell { min-height: 200px; }
        }

        /* ===== V3: FLIPCARD GRID ===== */
        .meg-v3 { background: #faf9f7; padding-bottom: 2rem; }
        .meg-v3__header {
          display: flex; align-items: baseline; padding: 1.5rem 2rem;
          border-bottom: 1px solid #e8e6e2; gap: 1rem;
        }
        .meg-v3__logo { font-family: 'Cormorant Garamond', serif; font-size: 1.75rem; font-weight: 600; }
        .meg-v3__tagline { font-family: 'Cormorant Garamond', serif; font-size: 1rem; font-style: italic; color: #666; }
        .meg-v3__hint { margin-left: auto; font-size: 0.6rem; text-transform: uppercase; letter-spacing: 0.1em; color: #bbb; }
        .meg-v3__grid {
          display: grid; grid-template-columns: 1.5fr 1fr 1fr;
          grid-template-rows: 1fr 1fr; gap: 1px; background: #e8e6e2;
          min-height: 520px; perspective: 1200px;
        }
        .meg-v3__card {
          position: relative; background: #fff; cursor: pointer; overflow: visible;
        }
        .meg-v3__card--feature { grid-row: span 2; }
        .meg-v3__card-inner {
          position: relative; width: 100%; height: 100%;
          transition: transform 0.6s cubic-bezier(0.4, 0, 0.2, 1);
          transform-style: preserve-3d;
        }
        .meg-v3__card.flipped .meg-v3__card-inner { transform: rotateY(180deg); }
        .meg-v3__card-front, .meg-v3__card-back {
          position: absolute; inset: 0; backface-visibility: hidden;
          -webkit-backface-visibility: hidden;
        }
        .meg-v3__card-front img { width: 100%; height: 100%; object-fit: cover; }
        .meg-v3__card-front-overlay {
          position: absolute; top: 0.75rem; right: 0.75rem;
          width: 28px; height: 28px; border-radius: 50%;
          background: rgba(0,0,0,0.4); backdrop-filter: blur(4px);
          display: flex; align-items: center; justify-content: center;
          color: #fff; font-size: 0.75rem; opacity: 0;
          transition: opacity 0.2s;
        }
        .meg-v3__card:hover .meg-v3__card-front-overlay { opacity: 1; }
        .meg-v3__card-back {
          transform: rotateY(180deg); background: #1a1a1a;
          padding: 2rem; display: flex; flex-direction: column;
          justify-content: center; overflow: hidden;
        }
        .meg-v3__back-label {
          font-size: 0.55rem; text-transform: uppercase; letter-spacing: 0.2em;
          color: rgba(255,255,255,0.4); margin-bottom: 0.5rem;
        }
        .meg-v3__card-back h4 {
          font-family: 'Cormorant Garamond', serif; font-size: 1.2rem;
          color: #fff; font-weight: 400; margin: 0 0 0.8rem; line-height: 1.3;
        }
        .meg-v3__card-back h4 span { font-weight: 600; }
        .meg-v3__card-back p {
          font-size: 0.75rem; color: rgba(255,255,255,0.7); line-height: 1.6;
          margin: 0 0 1rem;
        }
        .meg-v3__back-img {
          width: 100%; height: 80px; background-size: cover;
          background-position: center; border-radius: 4px; margin-top: auto;
        }
        .meg-v3__pagination {
          display: flex; align-items: center; justify-content: center;
          gap: 1rem; padding: 1rem 2rem; border-top: 1px solid #e8e6e2;
        }
        .meg-v3__pagination button {
          width: 44px; height: 44px; border-radius: 50%;
          border: 1px solid rgba(0,0,0,0.15); background: rgba(255,255,255,0.9);
          cursor: pointer; font-size: 1.1rem; transition: all 0.2s;
        }
        .meg-v3__pagination button:hover { background: #1a1a1a; color: #fff; }
        .meg-v3__pagination span {
          font-family: 'Share Tech Mono', monospace; font-size: 0.7rem; color: #999;
        }
        @media (max-width: 768px) {
          .meg-v3__grid { grid-template-columns: 1fr; grid-template-rows: auto; min-height: auto; perspective: 800px; }
          .meg-v3__card--feature { grid-row: 1; }
          .meg-v3__card { min-height: 260px; }
        }

        /* ===== V4: GALLERY + EXPANDABLE BAR ===== */
        .meg-v4 { background: #faf9f7; }
        .meg-v4__header {
          display: flex; align-items: baseline; padding: 1.5rem 2rem;
          border-bottom: 1px solid #e8e6e2; gap: 1rem;
        }
        .meg-v4__logo { font-family: 'Cormorant Garamond', serif; font-size: 1.75rem; font-weight: 600; }
        .meg-v4__tagline { font-family: 'Cormorant Garamond', serif; font-size: 1rem; font-style: italic; color: #666; }
        .meg-v4__grid {
          display: grid; grid-template-columns: 1.5fr 1fr 1fr;
          grid-template-rows: 1fr 1fr; gap: 1px; background: #e8e6e2; min-height: 520px;
        }
        .meg-v4__cell { position: relative; background: #fff; overflow: hidden; }
        .meg-v4__cell img { width: 100%; height: 100%; object-fit: cover; transition: transform 0.8s; }
        .meg-v4__cell:hover img { transform: scale(1.05); }
        .meg-v4__cell--feature { grid-row: span 2; }
        .meg-v4__cell--quote {
          background: #1a1a1a; display: flex; flex-direction: column;
          justify-content: center; align-items: center; padding: 2rem;
        }
        .meg-v4__cell--quote blockquote {
          font-family: 'Cormorant Garamond', serif; font-size: 1.15rem;
          font-style: italic; color: #fff; text-align: center; line-height: 1.6; margin: 0 0 1rem;
        }
        .meg-v4__cell--quote cite { font-size: 0.65rem; text-transform: uppercase; letter-spacing: 0.15em; color: rgba(255,255,255,0.5); font-style: normal; }
        .meg-v4__cell-hover {
          position: absolute; bottom: 0; left: 0; right: 0; padding: 1.5rem;
          background: linear-gradient(to top, rgba(0,0,0,0.75), transparent);
          transform: translateY(100%); opacity: 0;
          transition: transform 0.4s cubic-bezier(0.25,0.1,0.25,1), opacity 0.4s;
        }
        .meg-v4__cell:hover .meg-v4__cell-hover { transform: translateY(0); opacity: 1; }
        .meg-v4__cell-hover p { font-family: 'Cormorant Garamond', serif; font-size: 0.95rem; font-style: italic; color: #fff; margin: 0; }
        .meg-v4__gallery-nav {
          display: flex; align-items: center; justify-content: center;
          gap: 0.75rem; padding: 1rem 2rem; border-top: 1px solid #e8e6e2;
        }
        .meg-v4__gallery-nav button {
          width: 44px; height: 44px; border-radius: 50%;
          border: 1px solid rgba(0,0,0,0.15); background: rgba(255,255,255,0.9);
          cursor: pointer; font-size: 1.1rem; transition: all 0.2s;
        }
        .meg-v4__gallery-nav button:hover { background: #1a1a1a; color: #fff; }
        .meg-v4__gallery-nav span { font-family: 'Share Tech Mono', monospace; font-size: 0.7rem; color: #999; letter-spacing: 0.1em; }
        .meg-v4__gdot {
          width: 8px; height: 8px; border-radius: 50%; border: 1px solid #ccc;
          cursor: pointer; transition: all 0.2s;
        }
        .meg-v4__gdot.active { background: #1a1a1a; border-color: #1a1a1a; }
        /* Why We Fly expandable bar */
        .meg-v4__fly-btn {
          display: flex; align-items: center; justify-content: space-between;
          padding: 0.85rem 1.25rem; background: #faf9f6;
          border: 1px solid #e8e6e2; border-radius: 0;
          cursor: pointer; width: 100%; transition: background 0.2s;
        }
        .meg-v4__fly-btn:hover { background: #f5f3ef; }
        .meg-v4__fly-btn.open { border-bottom: none; }
        .meg-v4__fly-thumbs { display: flex; flex-shrink: 0; }
        .meg-v4__fly-thumb {
          width: 44px; height: 44px; border-radius: 6px;
          background-size: cover; background-position: center;
          border: 2px solid #faf9f6; position: relative; margin-left: -12px;
        }
        .meg-v4__fly-thumb:first-child { margin-left: 0; }
        .meg-v4__fly-center {
          display: flex; flex-direction: column; align-items: center;
          gap: 0.4rem; flex: 1;
        }
        .meg-v4__fly-title {
          font-size: 0.8rem; font-weight: 600; color: #1a1a1a;
          text-transform: uppercase; letter-spacing: 0.08em;
        }
        .meg-v4__fly-pulse {
          width: 6px; height: 6px; border-radius: 50%; background: #999;
          animation: megPulse 2s ease-in-out infinite;
        }
        .meg-v4__expand {
          display: grid; grid-template-rows: 0fr;
          transition: grid-template-rows 0.4s ease;
        }
        .meg-v4__expand.open { grid-template-rows: 1fr; }
        .meg-v4__expand-inner {
          overflow: hidden; background: #faf9f6;
          border-left: 1px solid #e8e6e2; border-right: 1px solid #e8e6e2;
        }
        .meg-v4__card-body {
          padding: 2rem; display: grid; grid-template-columns: 1fr 1fr;
          gap: 2rem; align-items: center;
        }
        .meg-v4__card-text h3 {
          font-size: clamp(1.25rem, 2.5vw, 1.5rem); font-weight: 700;
          margin: 0 0 1rem; text-transform: uppercase; letter-spacing: -0.01em; line-height: 1.2;
        }
        .meg-v4__verb { color: #1a1a1a; }
        .meg-v4__noun { color: #5a5a5a; }
        .meg-v4__card-text p { font-size: 0.95rem; color: #666; line-height: 1.7; margin: 0; }
        .meg-v4__card-img {
          width: 100%; height: 180px; background: #2a2a2a;
          border-radius: 6px; overflow: hidden; position: relative;
        }
        .meg-v4__card-slide {
          position: absolute; inset: 0; background-size: cover; background-position: center;
          opacity: 0; transition: opacity 0.5s ease;
        }
        .meg-v4__card-slide.active { opacity: 1; }
        .meg-v4__card-footer {
          padding: 1.25rem 2rem; border-top: 1px solid rgba(26,26,26,0.06);
          display: flex; align-items: center; justify-content: space-between;
        }
        .meg-v4__card-dots { display: flex; align-items: center; gap: 4px; }
        .meg-v4__cdot {
          width: 4px; height: 4px; background: rgba(26,26,26,0.15);
          border-radius: 2px; cursor: pointer; transition: all 0.25s;
        }
        .meg-v4__cdot:hover { background: rgba(26,26,26,0.4); }
        .meg-v4__cdot.active { width: 16px; background: #1a1a1a; }
        .meg-v4__card-counter {
          font-family: 'Share Tech Mono', monospace; font-size: 0.6rem;
          color: rgba(26,26,26,0.35); letter-spacing: 0.1em; margin-left: 1rem;
        }
        .meg-v4__card-arrows { display: flex; gap: 0.5rem; }
        .meg-v4__card-arrows button {
          width: 36px; height: 36px; border-radius: 6px;
          border: 1px solid rgba(26,26,26,0.15); background: transparent;
          cursor: pointer; color: rgba(26,26,26,0.4);
          display: flex; align-items: center; justify-content: center; transition: all 0.25s;
        }
        .meg-v4__card-arrows button:hover { background: #1a1a1a; border-color: #1a1a1a; color: #fff; }
        .meg-v4__cta {
          display: flex; align-items: center; justify-content: center; gap: 0.5rem;
          padding: 0.45rem; background: #4a4a4a; color: #fff;
          font-size: 0.78rem; font-weight: 600; text-transform: uppercase;
          letter-spacing: 0.1em; text-decoration: none;
          border: 1px solid #3a3a3a; transition: background 0.2s;
        }
        .meg-v4__cta:hover { background: #5a5a5a; color: #fff; }
        .meg-v4__cta span { transition: transform 0.2s; display: inline-block; color: #fff; }
        .meg-v4__cta:hover span { transform: translateX(4px); color: #fff; }
        @media (max-width: 768px) {
          .meg-v4__grid { grid-template-columns: 1fr; grid-template-rows: auto; min-height: auto; }
          .meg-v4__cell--feature { grid-row: 1; min-height: 50vh; }
          .meg-v4__cell { min-height: 200px; }
          .meg-v4__card-body { grid-template-columns: 1fr; gap: 1.5rem; }
        }

        /* ===== V5: OVERLAY LIGHTBOX ===== */
        .meg-v5 { background: #faf9f7; }
        .meg-v5__header {
          display: flex; align-items: baseline; padding: 1.5rem 2rem;
          border-bottom: 1px solid #e8e6e2; gap: 1rem;
        }
        .meg-v5__logo { font-family: 'Cormorant Garamond', serif; font-size: 1.75rem; font-weight: 600; }
        .meg-v5__tagline { font-family: 'Cormorant Garamond', serif; font-size: 1rem; font-style: italic; color: #666; }
        .meg-v5__grid {
          display: grid; grid-template-columns: 1.5fr 1fr 1fr;
          grid-template-rows: 1fr 1fr; gap: 1px; background: #e8e6e2;
          min-height: 520px;
        }
        .meg-v5__cell { position: relative; background: #fff; overflow: hidden; cursor: pointer; }
        .meg-v5__cell img { width: 100%; height: 100%; object-fit: cover; transition: transform 0.8s; }
        .meg-v5__cell:hover img { transform: scale(1.05); }
        .meg-v5__cell--feature { grid-row: span 2; }
        .meg-v5__cell-hover {
          position: absolute; inset: 0; display: flex; align-items: center;
          justify-content: center; background: rgba(0,0,0,0.2);
          opacity: 0; transition: opacity 0.3s;
        }
        .meg-v5__cell:hover .meg-v5__cell-hover { opacity: 1; }
        .meg-v5__cell-zoom {
          font-size: 1.5rem; color: #fff; width: 44px; height: 44px;
          border-radius: 50%; background: rgba(0,0,0,0.4); backdrop-filter: blur(4px);
          display: flex; align-items: center; justify-content: center;
        }
        .meg-v5__pagination {
          display: flex; align-items: center; justify-content: center;
          gap: 1rem; padding: 1rem 2rem; border-top: 1px solid #e8e6e2;
        }
        .meg-v5__pagination button {
          width: 44px; height: 44px; border-radius: 50%;
          border: 1px solid rgba(0,0,0,0.15); background: rgba(255,255,255,0.9);
          cursor: pointer; font-size: 1.1rem; transition: all 0.2s;
        }
        .meg-v5__pagination button:hover { background: #1a1a1a; color: #fff; }
        .meg-v5__pagination span { font-family: 'Share Tech Mono', monospace; font-size: 0.7rem; color: #999; }
        /* Overlay */
        .meg-v5__overlay {
          position: fixed; inset: 0; z-index: 1000;
          background: rgba(0,0,0,0.85); backdrop-filter: blur(8px);
          display: flex; align-items: center; justify-content: center;
          animation: megFadeIn 0.3s ease;
        }
        .meg-v5__lightbox {
          background: #faf9f7; max-width: 900px; width: 90%;
          max-height: 90vh; overflow-y: auto; position: relative;
        }
        .meg-v5__lb-close {
          position: absolute; top: 1rem; right: 1rem; z-index: 2;
          width: 36px; height: 36px; border-radius: 50%;
          border: 1px solid #e8e6e2; background: #fff;
          font-size: 1.2rem; cursor: pointer; transition: all 0.2s;
        }
        .meg-v5__lb-close:hover { background: #1a1a1a; color: #fff; }
        .meg-v5__lb-img img { width: 100%; height: 400px; object-fit: cover; display: block; }
        .meg-v5__lb-info { padding: 2rem; }
        .meg-v5__lb-label {
          font-size: 0.6rem; text-transform: uppercase; letter-spacing: 0.2em;
          color: #999; margin-bottom: 0.75rem; display: block;
        }
        .meg-v5__lb-info h3 {
          font-family: 'Cormorant Garamond', serif; font-size: 1.75rem;
          font-weight: 400; margin: 0 0 1rem; line-height: 1.2;
        }
        .meg-v5__lb-info h3 span { font-weight: 600; }
        .meg-v5__lb-info p { font-size: 0.9rem; color: #666; line-height: 1.7; margin: 0 0 1.5rem; }
        .meg-v5__lb-nav {
          display: flex; align-items: center; gap: 1rem;
          padding-top: 1.5rem; border-top: 1px solid #e8e6e2;
        }
        .meg-v5__lb-nav button {
          width: 36px; height: 36px; border-radius: 6px;
          border: 1px solid rgba(26,26,26,0.15); background: transparent;
          cursor: pointer; display: flex; align-items: center; justify-content: center;
          color: rgba(26,26,26,0.4); transition: all 0.25s;
        }
        .meg-v5__lb-nav button:hover { background: #1a1a1a; border-color: #1a1a1a; color: #fff; }
        .meg-v5__lb-nav span {
          font-family: 'Share Tech Mono', monospace; font-size: 0.6rem;
          color: rgba(26,26,26,0.35); letter-spacing: 0.1em;
        }
        @media (max-width: 768px) {
          .meg-v5__grid { grid-template-columns: 1fr; grid-template-rows: auto; min-height: auto; }
          .meg-v5__cell--feature { grid-row: 1; min-height: 50vh; }
          .meg-v5__cell { min-height: 200px; }
          .meg-v5__lb-img img { height: 250px; }
        }

        /* ===== V6: TAB GALLERY ===== */
        .meg-v6 { background: #faf9f7; }
        .meg-v6__header {
          display: flex; align-items: baseline; padding: 1.5rem 2rem;
          border-bottom: 1px solid #e8e6e2; gap: 1rem;
        }
        .meg-v6__logo { font-family: 'Cormorant Garamond', serif; font-size: 1.75rem; font-weight: 600; }
        .meg-v6__tagline { font-family: 'Cormorant Garamond', serif; font-size: 1rem; font-style: italic; color: #666; }
        .meg-v6__tabs {
          display: flex; gap: 0; border-bottom: 1px solid #e8e6e2; overflow-x: auto;
        }
        .meg-v6__tab {
          flex: 1; min-width: 0; padding: 1rem 0.5rem; background: none; border: none;
          border-bottom: 2px solid transparent; cursor: pointer;
          display: flex; flex-direction: column; align-items: center; gap: 0.2rem;
          transition: all 0.2s; white-space: nowrap;
        }
        .meg-v6__tab:hover { background: #f5f3ef; }
        .meg-v6__tab.active { border-bottom-color: #1a1a1a; background: #f5f3ef; }
        .meg-v6__tab-num {
          font-family: 'Share Tech Mono', monospace; font-size: 0.55rem;
          color: #ccc; letter-spacing: 0.1em;
        }
        .meg-v6__tab.active .meg-v6__tab-num { color: #999; }
        .meg-v6__tab-verb {
          font-size: 0.65rem; text-transform: uppercase; letter-spacing: 0.08em;
          color: #999;
        }
        .meg-v6__tab.active .meg-v6__tab-verb { color: #1a1a1a; font-weight: 600; }
        .meg-v6__grid {
          display: grid; grid-template-columns: 1.5fr 1fr 1fr;
          grid-template-rows: 1fr 1fr; gap: 1px; background: #e8e6e2;
          min-height: 520px;
        }
        .meg-v6__cell { position: relative; background: #fff; overflow: hidden; }
        .meg-v6__cell img { width: 100%; height: 100%; object-fit: cover; transition: transform 0.8s; }
        .meg-v6__cell:hover img { transform: scale(1.05); }
        .meg-v6__cell--feature { grid-row: span 2; }
        .meg-v6__feature-overlay {
          position: absolute; bottom: 0; left: 0; right: 0;
          padding: 3rem 2rem; background: linear-gradient(transparent, rgba(0,0,0,0.7));
        }
        .meg-v6__feature-overlay h3 {
          font-family: 'Cormorant Garamond', serif; font-size: 1.75rem;
          color: #fff; font-weight: 400; margin: 0;
        }
        .meg-v6__feature-overlay h3 span { font-weight: 600; }
        .meg-v6__cell--desc {
          background: #1a1a1a; display: flex; flex-direction: column;
          justify-content: center; padding: 2rem; position: relative;
        }
        .meg-v6__cell--desc p { font-size: 0.85rem; color: rgba(255,255,255,0.8); line-height: 1.7; margin: 0; }
        .meg-v6__desc-counter {
          position: absolute; bottom: 1rem; right: 1rem;
          font-family: 'Share Tech Mono', monospace; font-size: 0.55rem;
          color: rgba(255,255,255,0.3); letter-spacing: 0.1em;
        }
        @media (max-width: 768px) {
          .meg-v6__grid { grid-template-columns: 1fr; grid-template-rows: auto; min-height: auto; }
          .meg-v6__cell--feature { grid-row: 1; min-height: 50vh; }
          .meg-v6__cell { min-height: 200px; }
          .meg-v6__tabs { flex-wrap: nowrap; }
        }

        /* ===== V7: SIDE PANEL ===== */
        .meg-v7 { background: #faf9f7; }
        .meg-v7__header {
          display: flex; align-items: baseline; padding: 1.5rem 2rem;
          border-bottom: 1px solid #e8e6e2; gap: 1rem;
        }
        .meg-v7__logo { font-family: 'Cormorant Garamond', serif; font-size: 1.75rem; font-weight: 600; }
        .meg-v7__tagline { font-family: 'Cormorant Garamond', serif; font-size: 1rem; font-style: italic; color: #666; }
        .meg-v7__layout {
          display: grid; grid-template-columns: 1fr 360px; min-height: 580px;
        }
        .meg-v7__grid {
          display: grid; grid-template-columns: 1.5fr 1fr;
          grid-template-rows: 1fr 1fr; gap: 1px; background: #e8e6e2;
        }
        .meg-v7__cell { position: relative; background: #fff; overflow: hidden; }
        .meg-v7__cell img { width: 100%; height: 100%; object-fit: cover; transition: transform 0.8s; }
        .meg-v7__cell:hover img { transform: scale(1.05); }
        .meg-v7__cell--feature { grid-row: span 2; }
        .meg-v7__cell--quote {
          background: #1a1a1a; display: flex; flex-direction: column;
          justify-content: center; align-items: center; padding: 1.5rem;
        }
        .meg-v7__cell--quote blockquote {
          font-family: 'Cormorant Garamond', serif; font-size: 1rem;
          font-style: italic; color: #fff; text-align: center; line-height: 1.6; margin: 0 0 0.5rem;
        }
        .meg-v7__cell--quote cite { font-size: 0.6rem; text-transform: uppercase; letter-spacing: 0.15em; color: rgba(255,255,255,0.5); font-style: normal; }
        .meg-v7__cell-hover {
          position: absolute; bottom: 0; left: 0; right: 0; padding: 1.5rem;
          background: linear-gradient(to top, rgba(0,0,0,0.75), transparent);
          transform: translateY(100%); opacity: 0;
          transition: transform 0.4s cubic-bezier(0.25,0.1,0.25,1), opacity 0.4s;
        }
        .meg-v7__cell:hover .meg-v7__cell-hover { transform: translateY(0); opacity: 1; }
        .meg-v7__cell-hover p { font-family: 'Cormorant Garamond', serif; font-size: 0.95rem; font-style: italic; color: #fff; margin: 0; }
        .meg-v7__gallery-nav {
          display: flex; align-items: center; justify-content: center;
          gap: 0.75rem; padding: 0.75rem; border-top: 1px solid #e8e6e2;
        }
        .meg-v7__gallery-nav button {
          width: 36px; height: 36px; border-radius: 50%;
          border: 1px solid rgba(0,0,0,0.15); background: rgba(255,255,255,0.9);
          cursor: pointer; font-size: 1rem; transition: all 0.2s;
        }
        .meg-v7__gallery-nav button:hover { background: #1a1a1a; color: #fff; }
        .meg-v7__gallery-nav span { font-family: 'Share Tech Mono', monospace; font-size: 0.7rem; color: #999; }
        /* Side panel */
        .meg-v7__panel {
          background: #1a1a1a; display: flex; flex-direction: column;
          border-left: 1px solid #e8e6e2;
        }
        .meg-v7__panel-label {
          font-size: 0.6rem; text-transform: uppercase; letter-spacing: 0.2em;
          color: rgba(255,255,255,0.4); padding: 1.5rem 1.5rem 0;
        }
        .meg-v7__panel-img {
          position: relative; height: 200px; margin: 1rem 1.5rem;
          border-radius: 6px; overflow: hidden; background: #2a2a2a;
        }
        .meg-v7__panel-slide {
          position: absolute; inset: 0; background-size: cover; background-position: center;
          opacity: 0; transition: opacity 0.5s ease;
        }
        .meg-v7__panel-slide.active { opacity: 1; }
        .meg-v7__panel-text { padding: 0 1.5rem; flex: 1; }
        .meg-v7__panel-text h3 {
          font-family: 'Cormorant Garamond', serif; font-size: 1.3rem;
          color: #fff; font-weight: 400; margin: 0 0 0.75rem; line-height: 1.3;
        }
        .meg-v7__panel-text h3 span { font-weight: 600; }
        .meg-v7__panel-text p {
          font-size: 0.8rem; color: rgba(255,255,255,0.6); line-height: 1.7; margin: 0;
        }
        .meg-v7__panel-nav {
          padding: 1.5rem; border-top: 1px solid rgba(255,255,255,0.08);
          margin-top: auto;
        }
        .meg-v7__panel-dots { display: flex; gap: 4px; margin-bottom: 0.75rem; }
        .meg-v7__pdot {
          width: 4px; height: 4px; background: rgba(255,255,255,0.15);
          border-radius: 2px; cursor: pointer; transition: all 0.25s;
        }
        .meg-v7__pdot:hover { background: rgba(255,255,255,0.4); }
        .meg-v7__pdot.active { width: 16px; background: #fff; }
        .meg-v7__panel-arrows {
          display: flex; align-items: center; gap: 0.5rem;
        }
        .meg-v7__panel-arrows button {
          width: 36px; height: 36px; border-radius: 6px;
          border: 1px solid rgba(255,255,255,0.15); background: transparent;
          cursor: pointer; color: rgba(255,255,255,0.4);
          display: flex; align-items: center; justify-content: center; transition: all 0.25s;
        }
        .meg-v7__panel-arrows button:hover { background: #fff; border-color: #fff; color: #1a1a1a; }
        .meg-v7__panel-counter {
          font-family: 'Share Tech Mono', monospace; font-size: 0.6rem;
          color: rgba(255,255,255,0.35); letter-spacing: 0.1em;
        }
        @media (max-width: 900px) {
          .meg-v7__layout { grid-template-columns: 1fr; }
          .meg-v7__panel { border-left: none; border-top: 1px solid #e8e6e2; }
          .meg-v7__grid { grid-template-columns: 1fr; grid-template-rows: auto; }
          .meg-v7__cell--feature { grid-row: 1; min-height: 300px; }
          .meg-v7__cell { min-height: 200px; }
        }

        /* ===== V8: INTEGRATED QUOTE CELL ===== */
        .meg-v8 { background: #faf9f7; }
        .meg-v8__header {
          display: flex; align-items: baseline; padding: 1.5rem 2rem;
          border-bottom: 1px solid #e8e6e2; gap: 1rem;
        }
        .meg-v8__logo { font-family: 'Cormorant Garamond', serif; font-size: 1.75rem; font-weight: 600; }
        .meg-v8__tagline { font-family: 'Cormorant Garamond', serif; font-size: 1rem; font-style: italic; color: #666; }
        .meg-v8__grid {
          display: grid; grid-template-columns: 1.5fr 1fr 1fr;
          grid-template-rows: 1fr 1fr; gap: 1px; background: #e8e6e2;
          min-height: 520px;
        }
        .meg-v8__cell { position: relative; background: #fff; overflow: hidden; }
        .meg-v8__cell img { width: 100%; height: 100%; object-fit: cover; transition: transform 0.8s; }
        .meg-v8__cell:hover img { transform: scale(1.05); }
        .meg-v8__cell--feature { grid-row: span 2; }
        .meg-v8__cell-hover {
          position: absolute; bottom: 0; left: 0; right: 0; padding: 1.5rem;
          background: linear-gradient(to top, rgba(0,0,0,0.75), transparent);
          transform: translateY(100%); opacity: 0;
          transition: transform 0.4s cubic-bezier(0.25,0.1,0.25,1), opacity 0.4s;
        }
        .meg-v8__cell:hover .meg-v8__cell-hover { transform: translateY(0); opacity: 1; }
        .meg-v8__cell-hover p { font-family: 'Cormorant Garamond', serif; font-size: 0.95rem; font-style: italic; color: #fff; margin: 0; }
        /* Why cell replaces quote cell */
        .meg-v8__cell--why {
          background: #1a1a1a; cursor: pointer; transition: all 0.3s;
          overflow: hidden;
        }
        .meg-v8__cell--why.expanded {
          grid-column: span 2; grid-row: span 2; cursor: default;
        }
        .meg-v8__why-compact {
          display: flex; flex-direction: column; align-items: center;
          justify-content: center; height: 100%; padding: 1.5rem; text-align: center;
          gap: 0.5rem;
        }
        .meg-v8__why-label {
          font-size: 0.55rem; text-transform: uppercase; letter-spacing: 0.2em;
          color: rgba(255,255,255,0.4);
        }
        .meg-v8__why-compact h4 {
          font-family: 'Cormorant Garamond', serif; font-size: 1.25rem;
          color: #fff; font-weight: 400; margin: 0; line-height: 1.3;
        }
        .meg-v8__why-compact h4 span { font-weight: 600; }
        .meg-v8__why-pulse {
          width: 6px; height: 6px; border-radius: 50%; background: #999;
          animation: megPulse 2s ease-in-out infinite;
        }
        .meg-v8__why-detail {
          padding: 0 1.5rem 1.5rem; animation: megFadeIn 0.35s ease;
        }
        .meg-v8__why-detail p {
          font-size: 0.8rem; color: rgba(255,255,255,0.7); line-height: 1.6;
          margin: 0 0 1rem;
        }
        .meg-v8__why-img { border-radius: 4px; overflow: hidden; margin-bottom: 1rem; }
        .meg-v8__why-img img { width: 100%; height: 160px; object-fit: cover; display: block; }
        .meg-v8__why-nav {
          display: flex; align-items: center; gap: 4px;
        }
        .meg-v8__why-nav button {
          width: 28px; height: 28px; border-radius: 4px;
          border: 1px solid rgba(255,255,255,0.15); background: transparent;
          cursor: pointer; color: rgba(255,255,255,0.4); font-size: 0.9rem;
          transition: all 0.25s;
        }
        .meg-v8__why-nav button:hover { background: #fff; color: #1a1a1a; }
        .meg-v8__wdot {
          width: 4px; height: 4px; background: rgba(255,255,255,0.15);
          border-radius: 2px; cursor: pointer; transition: all 0.25s;
        }
        .meg-v8__wdot.active { width: 12px; background: #fff; }
        .meg-v8__wcounter {
          font-family: 'Share Tech Mono', monospace; font-size: 0.55rem;
          color: rgba(255,255,255,0.3); letter-spacing: 0.1em; margin-left: auto;
        }
        .meg-v8__pagination {
          display: flex; align-items: center; justify-content: center;
          gap: 0.75rem; padding: 1rem 2rem; border-top: 1px solid #e8e6e2;
        }
        .meg-v8__pagination button {
          width: 44px; height: 44px; border-radius: 50%;
          border: 1px solid rgba(0,0,0,0.15); background: rgba(255,255,255,0.9);
          cursor: pointer; font-size: 1.1rem; transition: all 0.2s;
        }
        .meg-v8__pagination button:hover { background: #1a1a1a; color: #fff; }
        .meg-v8__pagination > span {
          font-family: 'Share Tech Mono', monospace; font-size: 0.7rem; color: #999;
        }
        .meg-v8__pdot {
          width: 8px; height: 8px; border-radius: 50%; border: 1px solid #ccc;
          cursor: pointer; transition: all 0.2s;
        }
        .meg-v8__pdot.active { background: #1a1a1a; border-color: #1a1a1a; }
        @media (max-width: 768px) {
          .meg-v8__grid { grid-template-columns: 1fr; grid-template-rows: auto; min-height: auto; }
          .meg-v8__cell--feature { grid-row: 1; min-height: 50vh; }
          .meg-v8__cell { min-height: 200px; }
          .meg-v8__cell--why.expanded { grid-column: 1; grid-row: auto; }
        }

        /* ===== V9: TICKER-LINKED GALLERY ===== */
        .meg-v9 { background: #faf9f7; overflow: hidden; }
        .meg-v9__ticker {
          background: #1a1a1a; padding: 0.8rem 0; overflow: hidden;
          cursor: pointer;
        }
        .meg-v9__ticker-track {
          display: flex; white-space: nowrap;
          animation: megTicker 30s linear infinite;
          gap: 3rem;
        }
        .meg-v9__ticker-track:hover { animation-play-state: paused; }
        .meg-v9__ticker-item {
          font-size: 0.75rem; font-weight: 600; color: rgba(255,255,255,0.4);
          text-transform: uppercase; letter-spacing: 0.12em;
          transition: color 0.2s; cursor: pointer; white-space: nowrap;
        }
        .meg-v9__ticker-item:hover { color: rgba(255,255,255,0.8); }
        .meg-v9__ticker-item.active { color: #fff; }
        .meg-v9__main {
          max-width: 1200px; margin: 0 auto; padding: 2rem;
        }
        .meg-v9__feature {
          position: relative; overflow: hidden; margin-bottom: 1rem;
        }
        .meg-v9__feature img {
          width: 100%; height: 500px; object-fit: cover; display: block;
        }
        .meg-v9__feature-overlay {
          position: absolute; bottom: 0; left: 0; right: 0;
          padding: 3rem 2.5rem 2rem;
          background: linear-gradient(transparent, rgba(0,0,0,0.8));
        }
        .meg-v9__feature-overlay h3 {
          font-family: 'Cormorant Garamond', serif; font-size: 2rem;
          color: #fff; font-weight: 400; margin: 0 0 0.75rem;
        }
        .meg-v9__feature-overlay h3 span { font-weight: 600; }
        .meg-v9__feature-overlay p {
          font-size: 0.85rem; color: rgba(255,255,255,0.8);
          line-height: 1.7; max-width: 500px; margin: 0;
        }
        .meg-v9__strip {
          display: flex; gap: 4px; overflow-x: auto;
          scrollbar-width: thin; scrollbar-color: #ccc #faf9f7;
        }
        .meg-v9__strip-cell {
          flex: 0 0 120px; position: relative; cursor: pointer;
          overflow: hidden;
        }
        .meg-v9__strip-cell img {
          width: 100%; height: 80px; object-fit: cover; display: block;
          opacity: 0.5; transition: opacity 0.3s;
        }
        .meg-v9__strip-cell.active img { opacity: 1; }
        .meg-v9__strip-cell:hover img { opacity: 0.8; }
        .meg-v9__strip-label {
          position: absolute; bottom: 4px; left: 6px;
          font-size: 0.5rem; text-transform: uppercase; letter-spacing: 0.1em;
          color: #fff; opacity: 0; transition: opacity 0.2s;
        }
        .meg-v9__strip-cell.active .meg-v9__strip-label,
        .meg-v9__strip-cell:hover .meg-v9__strip-label { opacity: 1; }
        @media (max-width: 768px) {
          .meg-v9__feature img { height: 300px; }
        }

        /* ===== V10: MAGAZINE SPREAD ===== */
        .meg-v10 { background: #faf9f7; }
        .meg-v10__header {
          display: flex; align-items: baseline; padding: 1.5rem 2rem;
          border-bottom: 1px solid #e8e6e2; gap: 1rem;
        }
        .meg-v10__logo { font-family: 'Cormorant Garamond', serif; font-size: 1.75rem; font-weight: 600; }
        .meg-v10__tagline { font-family: 'Cormorant Garamond', serif; font-size: 1rem; font-style: italic; color: #666; }
        .meg-v10__issue { margin-left: auto; font-family: 'Share Tech Mono', monospace; font-size: 0.7rem; color: #999; letter-spacing: 0.1em; }
        .meg-v10__spread {
          display: grid; grid-template-columns: 1.2fr 1fr; min-height: 560px;
          border-bottom: 1px solid #e8e6e2;
        }
        .meg-v10__left { position: relative; overflow: hidden; }
        .meg-v10__left img { width: 100%; height: 100%; object-fit: cover; }
        .meg-v10__left-overlay {
          position: absolute; bottom: 1.5rem; right: 1.5rem;
        }
        .meg-v10__img-counter {
          font-family: 'Share Tech Mono', monospace; font-size: 3rem;
          color: rgba(255,255,255,0.15); font-weight: 700;
        }
        .meg-v10__right {
          padding: 3rem; display: flex; flex-direction: column; justify-content: center;
          border-left: 1px solid #e8e6e2;
        }
        .meg-v10__right-label {
          font-size: 0.6rem; text-transform: uppercase; letter-spacing: 0.2em;
          color: #999; margin-bottom: 1.5rem;
        }
        .meg-v10__right h3 {
          font-size: clamp(1.5rem, 3vw, 2.2rem); font-weight: 400;
          font-family: 'Cormorant Garamond', serif; margin: 0 0 1rem; line-height: 1.2;
        }
        .meg-v10__verb { font-weight: 600; color: #1a1a1a; }
        .meg-v10__noun { color: #5a5a5a; }
        .meg-v10__desc {
          font-size: 0.9rem; color: #666; line-height: 1.7; margin: 0 0 2rem;
        }
        .meg-v10__thumb-strip {
          display: flex; gap: 0.5rem; margin-bottom: 2rem;
        }
        .meg-v10__thumb {
          width: 48px; height: 48px; border-radius: 4px; overflow: hidden;
          cursor: pointer; opacity: 0.4; border: 2px solid transparent;
          transition: opacity 0.2s, border-color 0.2s;
        }
        .meg-v10__thumb:hover { opacity: 0.7; }
        .meg-v10__thumb.active { opacity: 1; border-color: #1a1a1a; }
        .meg-v10__thumb img { width: 100%; height: 100%; object-fit: cover; }
        .meg-v10__quote {
          padding-top: 1.5rem; border-top: 1px solid #e8e6e2; margin-top: auto;
        }
        .meg-v10__quote blockquote {
          font-family: 'Cormorant Garamond', serif; font-size: 1rem;
          font-style: italic; color: #888; line-height: 1.6; margin: 0 0 0.5rem;
        }
        .meg-v10__quote cite {
          font-size: 0.6rem; text-transform: uppercase; letter-spacing: 0.15em;
          color: #bbb; font-style: normal;
        }
        .meg-v10__nav {
          display: flex; align-items: center; justify-content: center;
          gap: 0.75rem; padding: 1.25rem 2rem; border-bottom: 1px solid #e8e6e2;
        }
        .meg-v10__nav button {
          width: 36px; height: 36px; border-radius: 6px;
          border: 1px solid rgba(26,26,26,0.15); background: transparent;
          cursor: pointer; color: rgba(26,26,26,0.4);
          display: flex; align-items: center; justify-content: center; transition: all 0.25s;
        }
        .meg-v10__nav button:hover { background: #1a1a1a; border-color: #1a1a1a; color: #fff; }
        .meg-v10__dots { display: flex; gap: 4px; }
        .meg-v10__dot {
          width: 4px; height: 4px; background: rgba(26,26,26,0.15);
          border-radius: 2px; cursor: pointer; transition: all 0.25s;
        }
        .meg-v10__dot:hover { background: rgba(26,26,26,0.4); }
        .meg-v10__dot.active { width: 16px; background: #1a1a1a; }
        .meg-v10__counter {
          font-family: 'Share Tech Mono', monospace; font-size: 0.6rem;
          color: rgba(26,26,26,0.35); letter-spacing: 0.1em;
        }
        .meg-v10__ticker {
          padding: 1rem 0; overflow: hidden;
        }
        .meg-v10__ticker-track {
          display: flex; gap: 2rem; animation: megTicker 20s linear infinite;
          white-space: nowrap;
        }
        .meg-v10__ticker-track span {
          font-size: 0.65rem; text-transform: uppercase; letter-spacing: 0.1em; color: #666;
        }
        @media (max-width: 768px) {
          .meg-v10__spread { grid-template-columns: 1fr; }
          .meg-v10__left { min-height: 300px; }
          .meg-v10__right { border-left: none; border-top: 1px solid #e8e6e2; }
        }


      /* ================================================================
         ABOUT + WHY WE FLY SPLIT — 20 VARIATIONS
         ================================================================ */
      .wfv-sec { padding: 6rem 4rem; border-bottom: 1px solid #e8e6e2; }
      .wfv-sec__label { font-family: 'Share Tech Mono', monospace; font-size: 0.65rem; text-transform: uppercase; letter-spacing: 0.2em; color: #999; margin-bottom: 2rem; }
      .wfv-sec__layout { display: grid; grid-template-columns: 1fr 1fr; gap: 4rem; align-items: start; }
      .wfv-sec__left { display: flex; flex-direction: column; justify-content: center; }
      .wfv-sec__text { font-family: 'Space Grotesk', sans-serif; font-size: 1.1rem; line-height: 1.8; color: #666; margin-bottom: 2rem; }
      .wfv-sec__btn { display: inline-flex; align-items: center; gap: 0.5rem; font-family: 'Space Grotesk', sans-serif; font-size: 0.75rem; text-transform: uppercase; letter-spacing: 0.1em; color: #faf9f6; background: #1a1a1a; padding: 0.75rem 1.5rem; border-radius: 4px; text-decoration: none; transition: opacity 0.3s; width: fit-content; }
      .wfv-sec__btn:hover { opacity: 0.85; }

      /* --- Shared slide / dot / arrow base --- */
      [class*="wfv-"][class*="__img"],
      [class*="wfv-"][class*="__bg"] { position: relative; overflow: hidden; border-radius: 6px; }
      [class*="wfv-"][class*="__slide"] { position: absolute; inset: 0; background-size: cover; background-position: center; opacity: 0; transition: opacity 0.6s ease; }
      [class*="wfv-"][class*="__slide"].active { opacity: 1; }

      /* ===== V01: Baseline ===== */
      .wfv-01__card { border: 1px solid #e8e6e2; border-radius: 8px; background: #faf9f6; overflow: hidden; }
      .wfv-01__header { display: flex; align-items: center; gap: 0.75rem; padding: 1rem 1.25rem; border-bottom: 1px solid #e8e6e2; }
      .wfv-01__thumbs { display: flex; }
      .wfv-01__thumb { width: 28px; height: 28px; border-radius: 50%; background-size: cover; background-position: center; border: 2px solid #faf9f6; margin-left: -8px; }
      .wfv-01__thumb:first-child { margin-left: 0; }
      .wfv-01__title { font-family: 'Space Grotesk', sans-serif; font-size: 0.8rem; font-weight: 500; color: #1a1a1a; }
      .wfv-01__img { height: 180px; }
      .wfv-01__body { padding: 1.25rem; }
      .wfv-01__body h3 { font-family: 'Space Grotesk', sans-serif; font-size: 1.1rem; font-weight: 500; color: #1a1a1a; margin-bottom: 0.5rem; }
      .wfv-01__verb { color: #1a1a1a; }
      .wfv-01__noun { color: #4a4a4a; }
      .wfv-01__body p { font-size: 0.85rem; line-height: 1.6; color: #666; }
      .wfv-01__footer { display: flex; align-items: center; justify-content: space-between; padding: 0.75rem 1.25rem; border-top: 1px solid #e8e6e2; }
      .wfv-01__dots { display: flex; align-items: center; gap: 4px; }
      .wfv-01__dot { width: 4px; height: 4px; border-radius: 4px; background: #ccc; cursor: pointer; transition: all 0.3s; }
      .wfv-01__dot.active { width: 16px; background: #1a1a1a; }
      .wfv-01__counter { font-family: 'Share Tech Mono', monospace; font-size: 0.65rem; color: #999; letter-spacing: 0.1em; margin-left: 0.75rem; }
      .wfv-01__arrows { display: flex; gap: 0.25rem; }
      .wfv-01__arrows button { background: none; border: 1px solid #e8e6e2; border-radius: 4px; padding: 0.35rem; cursor: pointer; color: #1a1a1a; display: flex; transition: background 0.2s; }
      .wfv-01__arrows button:hover { background: #f0efed; }

      /* ===== V02: Dark Card ===== */
      .wfv-02__card { background: #1a1a1a; border-radius: 8px; overflow: hidden; }
      .wfv-02__header { padding: 1rem 1.25rem; border-bottom: 1px solid #333; }
      .wfv-02__header span { font-family: 'Space Grotesk', sans-serif; font-size: 0.8rem; font-weight: 500; color: #faf9f6; }
      .wfv-02__img { height: 180px; }
      .wfv-02__body { padding: 1.25rem; }
      .wfv-02__body h3 { font-family: 'Space Grotesk', sans-serif; font-size: 1.1rem; font-weight: 500; color: #faf9f6; margin-bottom: 0.5rem; }
      .wfv-02__verb { color: #faf9f6; }
      .wfv-02__noun { color: #999; }
      .wfv-02__body p { font-size: 0.85rem; line-height: 1.6; color: #888; }
      .wfv-02__footer { display: flex; align-items: center; justify-content: space-between; padding: 0.75rem 1.25rem; border-top: 1px solid #333; }
      .wfv-02__dots { display: flex; align-items: center; gap: 4px; }
      .wfv-02__dot { width: 4px; height: 4px; border-radius: 4px; background: #555; cursor: pointer; transition: all 0.3s; }
      .wfv-02__dot.active { width: 16px; background: #faf9f6; }
      .wfv-02__counter { font-family: 'Share Tech Mono', monospace; font-size: 0.65rem; color: #666; letter-spacing: 0.1em; margin-left: 0.75rem; }
      .wfv-02__arrows { display: flex; gap: 0.25rem; }
      .wfv-02__arrows button { background: none; border: 1px solid #444; border-radius: 4px; padding: 0.35rem; cursor: pointer; color: #faf9f6; display: flex; transition: border-color 0.2s; }
      .wfv-02__arrows button:hover { border-color: #888; }

      /* ===== V03: Shadow Card ===== */
      .wfv-03__card { background: #fff; border-radius: 12px; box-shadow: 0 4px 24px rgba(0,0,0,0.08); overflow: hidden; }
      .wfv-03__img { height: 200px; }
      .wfv-03__body { padding: 1.5rem; }
      .wfv-03__label { font-family: 'Share Tech Mono', monospace; font-size: 0.65rem; text-transform: uppercase; letter-spacing: 0.2em; color: #999; display: block; margin-bottom: 0.5rem; }
      .wfv-03__body h3 { font-family: 'Space Grotesk', sans-serif; font-size: 1.15rem; font-weight: 500; color: #1a1a1a; margin-bottom: 0.5rem; }
      .wfv-03__body p { font-size: 0.85rem; line-height: 1.6; color: #666; }
      .wfv-03__footer { display: flex; align-items: center; justify-content: space-between; padding: 0.75rem 1.5rem; border-top: 1px solid #f0efed; }
      .wfv-03__dots { display: flex; align-items: center; gap: 4px; }
      .wfv-03__dot { width: 4px; height: 4px; border-radius: 4px; background: #ddd; cursor: pointer; transition: all 0.3s; }
      .wfv-03__dot.active { width: 16px; background: #1a1a1a; }
      .wfv-03__counter { font-family: 'Share Tech Mono', monospace; font-size: 0.65rem; color: #999; letter-spacing: 0.1em; margin-left: 0.75rem; }
      .wfv-03__arrows { display: flex; gap: 0.25rem; }
      .wfv-03__arrows button { background: none; border: 1px solid #e8e6e2; border-radius: 4px; padding: 0.35rem; cursor: pointer; color: #1a1a1a; display: flex; }
      .wfv-03__arrows button:hover { background: #f5f5f3; }

      /* ===== V04: Horizontal Card ===== */
      .wfv-04__card { border: 1px solid #e8e6e2; border-radius: 8px; overflow: hidden; background: #faf9f6; }
      .wfv-04__split { display: grid; grid-template-columns: 1fr 1fr; }
      .wfv-04__img { height: 100%; min-height: 220px; }
      .wfv-04__content { padding: 1.5rem; display: flex; flex-direction: column; justify-content: center; }
      .wfv-04__label { font-family: 'Share Tech Mono', monospace; font-size: 0.65rem; text-transform: uppercase; letter-spacing: 0.2em; color: #999; display: block; margin-bottom: 0.5rem; }
      .wfv-04__content h3 { font-family: 'Space Grotesk', sans-serif; font-size: 1rem; font-weight: 500; color: #1a1a1a; margin-bottom: 0.5rem; }
      .wfv-04__content p { font-size: 0.8rem; line-height: 1.6; color: #666; margin-bottom: 1rem; }
      .wfv-04__nav { display: flex; align-items: center; gap: 0.75rem; }
      .wfv-04__dots { display: flex; gap: 3px; }
      .wfv-04__dot { width: 4px; height: 4px; border-radius: 4px; background: #ccc; cursor: pointer; transition: all 0.3s; }
      .wfv-04__dot.active { width: 14px; background: #1a1a1a; }
      .wfv-04__counter { font-family: 'Share Tech Mono', monospace; font-size: 0.6rem; color: #999; }

      /* ===== V05: Full-bleed Overlay ===== */
      .wfv-05__card { position: relative; border-radius: 8px; overflow: hidden; height: 340px; }
      .wfv-05__img { position: absolute; inset: 0; }
      .wfv-05__slide { border-radius: 0; }
      .wfv-05__overlay { position: absolute; bottom: 0; left: 0; right: 0; padding: 1.5rem; background: linear-gradient(transparent, rgba(0,0,0,0.8)); color: #faf9f6; z-index: 2; }
      .wfv-05__label { font-family: 'Share Tech Mono', monospace; font-size: 0.6rem; text-transform: uppercase; letter-spacing: 0.2em; color: rgba(255,255,255,0.6); display: block; margin-bottom: 0.25rem; }
      .wfv-05__overlay h3 { font-family: 'Space Grotesk', sans-serif; font-size: 1.1rem; font-weight: 500; color: #fff; margin-bottom: 0.35rem; }
      .wfv-05__overlay p { font-size: 0.8rem; line-height: 1.5; color: rgba(255,255,255,0.75); margin-bottom: 0.75rem; }
      .wfv-05__nav { display: flex; align-items: center; justify-content: space-between; }
      .wfv-05__dots { display: flex; gap: 4px; }
      .wfv-05__dot { width: 4px; height: 4px; border-radius: 4px; background: rgba(255,255,255,0.3); cursor: pointer; transition: all 0.3s; }
      .wfv-05__dot.active { width: 16px; background: #fff; }
      .wfv-05__arrows { display: flex; gap: 0.5rem; }
      .wfv-05__arrows button { background: none; border: none; color: #fff; font-size: 1.2rem; cursor: pointer; padding: 0; opacity: 0.7; transition: opacity 0.2s; }
      .wfv-05__arrows button:hover { opacity: 1; }

      /* ===== V06: Large Counter ===== */
      .wfv-06__card { border: 1px solid #e8e6e2; border-radius: 8px; background: #faf9f6; overflow: hidden; }
      .wfv-06__header { display: flex; align-items: center; justify-content: space-between; padding: 1rem 1.25rem; border-bottom: 1px solid #e8e6e2; }
      .wfv-06__title { font-family: 'Space Grotesk', sans-serif; font-size: 0.8rem; font-weight: 500; color: #1a1a1a; }
      .wfv-06__big-num { font-family: 'Share Tech Mono', monospace; font-size: 2rem; color: #e8e6e2; line-height: 1; }
      .wfv-06__img { height: 180px; }
      .wfv-06__body { padding: 1.25rem; }
      .wfv-06__body h3 { font-family: 'Space Grotesk', sans-serif; font-size: 1.1rem; font-weight: 500; color: #1a1a1a; margin-bottom: 0.5rem; }
      .wfv-06__body p { font-size: 0.85rem; line-height: 1.6; color: #666; }
      .wfv-06__footer { display: flex; align-items: center; justify-content: space-between; padding: 0.75rem 1.25rem; border-top: 1px solid #e8e6e2; }
      .wfv-06__dots { display: flex; align-items: center; gap: 4px; }
      .wfv-06__dot { width: 4px; height: 4px; border-radius: 4px; background: #ccc; cursor: pointer; transition: all 0.3s; }
      .wfv-06__dot.active { width: 16px; background: #1a1a1a; }
      .wfv-06__arrows { display: flex; gap: 0.25rem; }
      .wfv-06__arrows button { background: none; border: 1px solid #e8e6e2; border-radius: 4px; padding: 0.35rem; cursor: pointer; color: #1a1a1a; display: flex; }
      .wfv-06__arrows button:hover { background: #f0efed; }

      /* ===== V07: Vertical Divider ===== */
      .wfv-07__layout { grid-template-columns: 1fr auto 1fr; }
      .wfv-07__divider { display: flex; align-items: center; justify-content: center; padding: 0 1rem; }
      .wfv-07__divider span { display: block; width: 1px; height: 200px; background: #e8e6e2; }
      .wfv-07__card { }
      .wfv-07__label { font-family: 'Share Tech Mono', monospace; font-size: 0.65rem; text-transform: uppercase; letter-spacing: 0.2em; color: #999; display: block; margin-bottom: 1rem; }
      .wfv-07__img { height: 180px; border-radius: 6px; margin-bottom: 1rem; }
      .wfv-07__card h3 { font-family: 'Space Grotesk', sans-serif; font-size: 1.1rem; font-weight: 500; color: #1a1a1a; margin-bottom: 0.5rem; }
      .wfv-07__card p { font-size: 0.85rem; line-height: 1.6; color: #666; margin-bottom: 1rem; }
      .wfv-07__footer { display: flex; align-items: center; justify-content: space-between; }
      .wfv-07__dots { display: flex; align-items: center; gap: 4px; }
      .wfv-07__dot { width: 4px; height: 4px; border-radius: 4px; background: #ccc; cursor: pointer; transition: all 0.3s; }
      .wfv-07__dot.active { width: 16px; background: #1a1a1a; }
      .wfv-07__counter { font-family: 'Share Tech Mono', monospace; font-size: 0.65rem; color: #999; letter-spacing: 0.1em; margin-left: 0.75rem; }
      .wfv-07__arrows { display: flex; gap: 0.25rem; }
      .wfv-07__arrows button { background: none; border: 1px solid #e8e6e2; border-radius: 4px; padding: 0.35rem; cursor: pointer; color: #1a1a1a; display: flex; }
      .wfv-07__arrows button:hover { background: #f0efed; }

      /* ===== V08: Micro Labels ===== */
      .wfv-08__card { border: 1px solid #e8e6e2; border-radius: 8px; background: #faf9f6; overflow: hidden; padding: 1.25rem; display: flex; flex-direction: column; gap: 1rem; }
      .wfv-08__section { }
      .wfv-08__micro { font-family: 'Share Tech Mono', monospace; font-size: 0.55rem; text-transform: uppercase; letter-spacing: 0.25em; color: #bbb; display: block; margin-bottom: 0.35rem; }
      .wfv-08__img { height: 160px; border-radius: 6px; }
      .wfv-08__section h3 { font-family: 'Space Grotesk', sans-serif; font-size: 1.05rem; font-weight: 500; color: #1a1a1a; }
      .wfv-08__section p { font-size: 0.82rem; line-height: 1.6; color: #666; }
      .wfv-08__footer { display: flex; align-items: center; justify-content: space-between; padding-top: 0.75rem; border-top: 1px solid #e8e6e2; }
      .wfv-08__dots { display: flex; align-items: center; gap: 4px; }
      .wfv-08__dot { width: 4px; height: 4px; border-radius: 4px; background: #ccc; cursor: pointer; transition: all 0.3s; }
      .wfv-08__dot.active { width: 16px; background: #1a1a1a; }
      .wfv-08__counter { font-family: 'Share Tech Mono', monospace; font-size: 0.65rem; color: #999; letter-spacing: 0.1em; margin-left: 0.75rem; }
      .wfv-08__arrows { display: flex; gap: 0.25rem; }
      .wfv-08__arrows button { background: none; border: 1px solid #e8e6e2; border-radius: 4px; padding: 0.35rem; cursor: pointer; color: #1a1a1a; display: flex; }

      /* ===== V09: Gradient Headline ===== */
      .wfv-09__card { border: 1px solid #e8e6e2; border-radius: 8px; background: #faf9f6; overflow: hidden; }
      .wfv-09__header { padding: 1rem 1.25rem; border-bottom: 1px solid #e8e6e2; }
      .wfv-09__header span { font-family: 'Space Grotesk', sans-serif; font-size: 0.8rem; font-weight: 500; color: #1a1a1a; }
      .wfv-09__img { height: 180px; }
      .wfv-09__body { padding: 1.25rem; }
      .wfv-09__body h3 { font-family: 'Space Grotesk', sans-serif; font-size: 1.3rem; font-weight: 600; margin-bottom: 0.5rem; }
      .wfv-09__v1 { color: #1a1a1a; }
      .wfv-09__v2 { color: #7a7a7a; }
      .wfv-09__body p { font-size: 0.85rem; line-height: 1.6; color: #666; }
      .wfv-09__footer { display: flex; align-items: center; justify-content: space-between; padding: 0.75rem 1.25rem; border-top: 1px solid #e8e6e2; }
      .wfv-09__dots { display: flex; align-items: center; gap: 4px; }
      .wfv-09__dot { width: 4px; height: 4px; border-radius: 4px; background: #ccc; cursor: pointer; transition: all 0.3s; }
      .wfv-09__dot.active { width: 16px; background: #1a1a1a; }
      .wfv-09__counter { font-family: 'Share Tech Mono', monospace; font-size: 0.65rem; color: #999; letter-spacing: 0.1em; margin-left: 0.75rem; }
      .wfv-09__arrows { display: flex; gap: 0.25rem; }
      .wfv-09__arrows button { background: none; border: 1px solid #e8e6e2; border-radius: 4px; padding: 0.35rem; cursor: pointer; color: #1a1a1a; display: flex; }

      /* ===== V10: Borderless ===== */
      .wfv-10__card { padding: 0.5rem 0; }
      .wfv-10__label { font-family: 'Share Tech Mono', monospace; font-size: 0.65rem; text-transform: uppercase; letter-spacing: 0.2em; color: #999; display: block; margin-bottom: 1rem; }
      .wfv-10__img { height: 200px; border-radius: 6px; margin-bottom: 1rem; }
      .wfv-10__card h3 { font-family: 'Space Grotesk', sans-serif; font-size: 1.1rem; font-weight: 500; color: #1a1a1a; margin-bottom: 0.5rem; }
      .wfv-10__card p { font-size: 0.85rem; line-height: 1.6; color: #666; margin-bottom: 1rem; }
      .wfv-10__nav { display: flex; align-items: center; justify-content: space-between; }
      .wfv-10__dots { display: flex; align-items: center; gap: 4px; }
      .wfv-10__dot { width: 4px; height: 4px; border-radius: 4px; background: #ccc; cursor: pointer; transition: all 0.3s; }
      .wfv-10__dot.active { width: 16px; background: #1a1a1a; }
      .wfv-10__counter { font-family: 'Share Tech Mono', monospace; font-size: 0.65rem; color: #999; letter-spacing: 0.1em; margin-left: 0.75rem; }
      .wfv-10__arrows { display: flex; gap: 0.25rem; }
      .wfv-10__arrows button { background: none; border: 1px solid #e8e6e2; border-radius: 4px; padding: 0.35rem; cursor: pointer; color: #1a1a1a; display: flex; }

      /* ===== V11: Image Background ===== */
      .wfv-11__card { position: relative; border-radius: 8px; overflow: hidden; min-height: 320px; display: flex; align-items: flex-end; }
      .wfv-11__bg { position: absolute; inset: 0; background-size: cover; background-position: center; opacity: 0; transition: opacity 0.6s ease; }
      .wfv-11__bg.active { opacity: 1; }
      .wfv-11__content { position: relative; z-index: 2; padding: 2rem; background: linear-gradient(transparent, rgba(0,0,0,0.75)); width: 100%; }
      .wfv-11__label { font-family: 'Share Tech Mono', monospace; font-size: 0.6rem; text-transform: uppercase; letter-spacing: 0.2em; color: rgba(255,255,255,0.5); display: block; margin-bottom: 0.35rem; }
      .wfv-11__content h3 { font-family: 'Space Grotesk', sans-serif; font-size: 1.15rem; font-weight: 500; color: #fff; margin-bottom: 0.35rem; }
      .wfv-11__content p { font-size: 0.82rem; line-height: 1.5; color: rgba(255,255,255,0.7); margin-bottom: 0.75rem; }
      .wfv-11__nav { display: flex; align-items: center; justify-content: space-between; }
      .wfv-11__dots { display: flex; gap: 4px; }
      .wfv-11__dot { width: 4px; height: 4px; border-radius: 4px; background: rgba(255,255,255,0.3); cursor: pointer; transition: all 0.3s; }
      .wfv-11__dot.active { width: 16px; background: #fff; }
      .wfv-11__arrows { display: flex; gap: 0.5rem; }
      .wfv-11__arrows button { background: none; border: none; color: #fff; font-size: 1.2rem; cursor: pointer; padding: 0; opacity: 0.7; }
      .wfv-11__arrows button:hover { opacity: 1; }

      /* ===== V12: Text Tab Nav ===== */
      .wfv-12__card { border: 1px solid #e8e6e2; border-radius: 8px; background: #faf9f6; overflow: hidden; }
      .wfv-12__tabs { display: flex; flex-wrap: wrap; gap: 0; border-bottom: 1px solid #e8e6e2; }
      .wfv-12__tab { font-family: 'Space Grotesk', sans-serif; font-size: 0.65rem; text-transform: uppercase; letter-spacing: 0.1em; color: #999; background: none; border: none; padding: 0.75rem 0.85rem; cursor: pointer; border-bottom: 2px solid transparent; transition: all 0.2s; }
      .wfv-12__tab.active { color: #1a1a1a; border-bottom-color: #1a1a1a; }
      .wfv-12__tab:hover { color: #666; }
      .wfv-12__img { height: 180px; }
      .wfv-12__body { padding: 1.25rem; }
      .wfv-12__body h3 { font-family: 'Space Grotesk', sans-serif; font-size: 1.1rem; font-weight: 500; color: #1a1a1a; margin-bottom: 0.5rem; }
      .wfv-12__body p { font-size: 0.85rem; line-height: 1.6; color: #666; }

      /* ===== V13: Bottom Image ===== */
      .wfv-13__card { border: 1px solid #e8e6e2; border-radius: 8px; background: #faf9f6; overflow: hidden; }
      .wfv-13__header { padding: 1rem 1.25rem; border-bottom: 1px solid #e8e6e2; }
      .wfv-13__header span { font-family: 'Space Grotesk', sans-serif; font-size: 0.8rem; font-weight: 500; color: #1a1a1a; }
      .wfv-13__body { padding: 1.25rem; }
      .wfv-13__body h3 { font-family: 'Space Grotesk', sans-serif; font-size: 1.1rem; font-weight: 500; margin-bottom: 0.5rem; }
      .wfv-13__verb { color: #1a1a1a; }
      .wfv-13__noun { color: #7a7a7a; }
      .wfv-13__body p { font-size: 0.85rem; line-height: 1.6; color: #666; }
      .wfv-13__img { height: 160px; }
      .wfv-13__footer { display: flex; align-items: center; justify-content: space-between; padding: 0.75rem 1.25rem; border-top: 1px solid #e8e6e2; }
      .wfv-13__dots { display: flex; align-items: center; gap: 4px; }
      .wfv-13__dot { width: 4px; height: 4px; border-radius: 4px; background: #ccc; cursor: pointer; transition: all 0.3s; }
      .wfv-13__dot.active { width: 16px; background: #1a1a1a; }
      .wfv-13__counter { font-family: 'Share Tech Mono', monospace; font-size: 0.65rem; color: #999; letter-spacing: 0.1em; margin-left: 0.75rem; }
      .wfv-13__arrows { display: flex; gap: 0.25rem; }
      .wfv-13__arrows button { background: none; border: 1px solid #e8e6e2; border-radius: 4px; padding: 0.35rem; cursor: pointer; color: #1a1a1a; display: flex; }

      /* ===== V14: 50/50 Split ===== */
      .wfv-14__card { border: 1px solid #e8e6e2; border-radius: 8px; overflow: hidden; display: grid; grid-template-columns: 1fr 1fr; grid-template-rows: 1fr; min-height: 280px; }
      .wfv-14__img { height: 100%; }
      .wfv-14__text { padding: 1.5rem; display: flex; flex-direction: column; justify-content: center; background: #faf9f6; }
      .wfv-14__label { font-family: 'Share Tech Mono', monospace; font-size: 0.65rem; text-transform: uppercase; letter-spacing: 0.2em; color: #999; display: block; margin-bottom: 0.5rem; }
      .wfv-14__text h3 { font-family: 'Space Grotesk', sans-serif; font-size: 1.05rem; font-weight: 500; color: #1a1a1a; margin-bottom: 0.5rem; }
      .wfv-14__text p { font-size: 0.82rem; line-height: 1.6; color: #666; margin-bottom: 1rem; }
      .wfv-14__nav { display: flex; align-items: center; gap: 0.75rem; }
      .wfv-14__dots { display: flex; gap: 3px; }
      .wfv-14__dot { width: 4px; height: 4px; border-radius: 4px; background: #ccc; cursor: pointer; transition: all 0.3s; }
      .wfv-14__dot.active { width: 14px; background: #1a1a1a; }
      .wfv-14__counter { font-family: 'Share Tech Mono', monospace; font-size: 0.6rem; color: #999; }

      /* ===== V15: Progress Bar ===== */
      .wfv-15__card { border: 1px solid #e8e6e2; border-radius: 8px; background: #faf9f6; overflow: hidden; }
      .wfv-15__progress { height: 3px; background: #e8e6e2; }
      .wfv-15__bar { height: 100%; background: #1a1a1a; transition: width 0.4s ease; }
      .wfv-15__header { display: flex; align-items: center; justify-content: space-between; padding: 1rem 1.25rem; }
      .wfv-15__title { font-family: 'Space Grotesk', sans-serif; font-size: 0.8rem; font-weight: 500; color: #1a1a1a; }
      .wfv-15__counter { font-family: 'Share Tech Mono', monospace; font-size: 0.65rem; color: #999; letter-spacing: 0.1em; }
      .wfv-15__img { height: 180px; }
      .wfv-15__body { padding: 1.25rem; }
      .wfv-15__body h3 { font-family: 'Space Grotesk', sans-serif; font-size: 1.1rem; font-weight: 500; color: #1a1a1a; margin-bottom: 0.5rem; }
      .wfv-15__body p { font-size: 0.85rem; line-height: 1.6; color: #666; }
      .wfv-15__footer { display: flex; justify-content: flex-end; padding: 0.75rem 1.25rem; border-top: 1px solid #e8e6e2; }
      .wfv-15__arrows { display: flex; gap: 0.25rem; }
      .wfv-15__arrows button { background: none; border: 1px solid #e8e6e2; border-radius: 4px; padding: 0.35rem; cursor: pointer; color: #1a1a1a; display: flex; }
      .wfv-15__arrows button:hover { background: #f0efed; }

      /* ===== V16: Coordinates ===== */
      .wfv-16__card { border: 1px solid #e8e6e2; border-radius: 8px; background: #faf9f6; overflow: hidden; }
      .wfv-16__header { display: flex; align-items: center; justify-content: space-between; padding: 0.75rem 1.25rem; border-bottom: 1px solid #e8e6e2; }
      .wfv-16__coords { font-family: 'Share Tech Mono', monospace; font-size: 0.6rem; color: #bbb; letter-spacing: 0.05em; }
      .wfv-16__title { font-family: 'Space Grotesk', sans-serif; font-size: 0.75rem; font-weight: 500; color: #1a1a1a; }
      .wfv-16__img { height: 180px; }
      .wfv-16__body { padding: 1.25rem; }
      .wfv-16__body h3 { font-family: 'Space Grotesk', sans-serif; font-size: 1.1rem; font-weight: 500; color: #1a1a1a; margin-bottom: 0.5rem; }
      .wfv-16__body p { font-size: 0.85rem; line-height: 1.6; color: #666; }
      .wfv-16__footer { display: flex; align-items: center; justify-content: space-between; padding: 0.75rem 1.25rem; border-top: 1px solid #e8e6e2; }
      .wfv-16__dots { display: flex; align-items: center; gap: 4px; }
      .wfv-16__dot { width: 4px; height: 4px; border-radius: 4px; background: #ccc; cursor: pointer; transition: all 0.3s; }
      .wfv-16__dot.active { width: 16px; background: #1a1a1a; }
      .wfv-16__counter { font-family: 'Share Tech Mono', monospace; font-size: 0.65rem; color: #999; letter-spacing: 0.1em; margin-left: 0.75rem; }
      .wfv-16__arrows { display: flex; gap: 0.25rem; }
      .wfv-16__arrows button { background: none; border: 1px solid #e8e6e2; border-radius: 4px; padding: 0.35rem; cursor: pointer; color: #1a1a1a; display: flex; }

      /* ===== V17: Oversized Verb ===== */
      .wfv-17__card { border: 1px solid #e8e6e2; border-radius: 8px; background: #faf9f6; overflow: hidden; }
      .wfv-17__img { height: 160px; }
      .wfv-17__body { padding: 1.25rem; }
      .wfv-17__pre { font-family: 'Share Tech Mono', monospace; font-size: 0.6rem; text-transform: uppercase; letter-spacing: 0.25em; color: #bbb; display: block; margin-bottom: 0.25rem; }
      .wfv-17__verb { font-family: 'Space Grotesk', sans-serif; font-size: 2.2rem; font-weight: 600; color: #1a1a1a; line-height: 1; display: block; margin-bottom: 0.15rem; }
      .wfv-17__noun { font-family: 'Space Grotesk', sans-serif; font-size: 1rem; font-weight: 400; color: #7a7a7a; display: block; margin-bottom: 0.5rem; }
      .wfv-17__body p { font-size: 0.82rem; line-height: 1.6; color: #666; }
      .wfv-17__footer { display: flex; align-items: center; justify-content: space-between; padding: 0.75rem 1.25rem; border-top: 1px solid #e8e6e2; }
      .wfv-17__dots { display: flex; align-items: center; gap: 4px; }
      .wfv-17__dot { width: 4px; height: 4px; border-radius: 4px; background: #ccc; cursor: pointer; transition: all 0.3s; }
      .wfv-17__dot.active { width: 16px; background: #1a1a1a; }
      .wfv-17__counter { font-family: 'Share Tech Mono', monospace; font-size: 0.65rem; color: #999; letter-spacing: 0.1em; margin-left: 0.75rem; }
      .wfv-17__arrows { display: flex; gap: 0.25rem; }
      .wfv-17__arrows button { background: none; border: 1px solid #e8e6e2; border-radius: 4px; padding: 0.35rem; cursor: pointer; color: #1a1a1a; display: flex; }

      /* ===== V18: Reversed Columns ===== */
      .wfv-18__layout { direction: ltr; }
      .wfv-18__card { border: 1px solid #e8e6e2; border-radius: 8px; background: #faf9f6; overflow: hidden; }
      .wfv-18__header { padding: 1rem 1.25rem; border-bottom: 1px solid #e8e6e2; }
      .wfv-18__header span { font-family: 'Space Grotesk', sans-serif; font-size: 0.8rem; font-weight: 500; color: #1a1a1a; }
      .wfv-18__img { height: 180px; }
      .wfv-18__body { padding: 1.25rem; }
      .wfv-18__body h3 { font-family: 'Space Grotesk', sans-serif; font-size: 1.1rem; font-weight: 500; color: #1a1a1a; margin-bottom: 0.5rem; }
      .wfv-18__body p { font-size: 0.85rem; line-height: 1.6; color: #666; }
      .wfv-18__footer { display: flex; align-items: center; justify-content: space-between; padding: 0.75rem 1.25rem; border-top: 1px solid #e8e6e2; }
      .wfv-18__dots { display: flex; align-items: center; gap: 4px; }
      .wfv-18__dot { width: 4px; height: 4px; border-radius: 4px; background: #ccc; cursor: pointer; transition: all 0.3s; }
      .wfv-18__dot.active { width: 16px; background: #1a1a1a; }
      .wfv-18__counter { font-family: 'Share Tech Mono', monospace; font-size: 0.65rem; color: #999; letter-spacing: 0.1em; margin-left: 0.75rem; }
      .wfv-18__arrows { display: flex; gap: 0.25rem; }
      .wfv-18__arrows button { background: none; border: 1px solid #e8e6e2; border-radius: 4px; padding: 0.35rem; cursor: pointer; color: #1a1a1a; display: flex; }


      /* ================================================================
         ABOUT + WHY WE FLY — VARIATIONS 21-40 (Oversized Verb Series)
         ================================================================ */

      /* === V21: Bold Stack === */
      .wfv-21__card { border: 1px solid #e8e6e2; border-radius: 8px; background: #faf9f6; overflow: hidden; }
      .wfv-21__img { height: 200px; position: relative; overflow: hidden; }
      .wfv-21__body { padding: 1.5rem; }
      .wfv-21__verb { font-family: 'Space Grotesk', sans-serif; font-size: 2.4rem; font-weight: 700; color: #1a1a1a; line-height: 1; display: block; margin-bottom: 0.15rem; }
      .wfv-21__noun { font-family: 'Space Grotesk', sans-serif; font-size: 1rem; font-weight: 400; color: #7a7a7a; display: block; margin-bottom: 0.6rem; }
      .wfv-21__body p { font-size: 0.82rem; line-height: 1.6; color: #666; }
      .wfv-21__footer { display: flex; align-items: center; justify-content: space-between; padding: 0.75rem 1.5rem; border-top: 1px solid #e8e6e2; }
      .wfv-21__dots { display: flex; gap: 5px; }
      .wfv-21__dot { width: 5px; height: 5px; border-radius: 5px; background: #ccc; cursor: pointer; transition: all 0.3s; }
      .wfv-21__dot.active { width: 18px; background: #1a1a1a; }
      .wfv-21__arrows { display: flex; gap: 0.25rem; }
      .wfv-21__arrows button { background: none; border: 1px solid #e8e6e2; border-radius: 4px; padding: 0.35rem; cursor: pointer; color: #1a1a1a; display: flex; transition: background 0.2s; }
      .wfv-21__arrows button:hover { background: #f0efed; }

      /* === V22: Dark Oversized === */
      .wfv-22__card { background: #1a1a1a; border-radius: 8px; overflow: hidden; border: 3px solid #e8e6e2; }
      .wfv-22__img { height: 200px; position: relative; overflow: hidden; }
      .wfv-22__body { padding: 1.5rem; }
      .wfv-22__verb { font-family: 'Space Grotesk', sans-serif; font-size: 2.4rem; font-weight: 700; color: #faf9f6; line-height: 1; display: block; margin-bottom: 0.15rem; }
      .wfv-22__noun { font-family: 'Space Grotesk', sans-serif; font-size: 1rem; font-weight: 400; color: #888; display: block; margin-bottom: 0.6rem; }
      .wfv-22__body p { font-size: 0.82rem; line-height: 1.6; color: #777; }
      .wfv-22__footer { display: flex; align-items: center; justify-content: space-between; padding: 0.75rem 1.5rem; border-top: 1px solid #333; }
      .wfv-22__dots { display: flex; gap: 5px; }
      .wfv-22__dot { width: 5px; height: 5px; border-radius: 5px; background: #555; cursor: pointer; transition: all 0.3s; }
      .wfv-22__dot.active { width: 18px; background: #faf9f6; }
      .wfv-22__arrows { display: flex; gap: 0.25rem; }
      .wfv-22__arrows button { background: none; border: 1px solid #444; border-radius: 4px; padding: 0.35rem; cursor: pointer; color: #faf9f6; display: flex; }
      .wfv-22__arrows button:hover { border-color: #888; }

      /* === V23: Overlay Text === */
      .wfv-23__card { position: relative; border-radius: 8px; overflow: hidden; min-height: 380px; }
      .wfv-23__bg { position: absolute; inset: 0; background-size: cover; background-position: center; opacity: 0; transition: opacity 0.6s ease; }
      .wfv-23__bg.active { opacity: 1; }
      .wfv-23__overlay { position: absolute; bottom: 0; left: 0; right: 0; padding: 2rem; background: linear-gradient(transparent, rgba(0,0,0,0.85)); z-index: 2; }
      .wfv-23__verb { font-family: 'Space Grotesk', sans-serif; font-size: 2.8rem; font-weight: 700; color: #fff; line-height: 1; display: block; margin-bottom: 0.1rem; }
      .wfv-23__noun { font-family: 'Space Grotesk', sans-serif; font-size: 1rem; font-weight: 400; color: rgba(255,255,255,0.7); display: block; margin-bottom: 0.5rem; }
      .wfv-23__overlay p { font-size: 0.82rem; line-height: 1.5; color: rgba(255,255,255,0.6); margin-bottom: 1rem; }
      .wfv-23__dots { display: flex; gap: 5px; }
      .wfv-23__dot { width: 5px; height: 5px; border-radius: 5px; background: rgba(255,255,255,0.3); cursor: pointer; transition: all 0.3s; }
      .wfv-23__dot.active { width: 18px; background: #fff; }

      /* === V24: Accent Top Bar === */
      .wfv-24__card { border: 1px solid #e8e6e2; border-radius: 8px; background: #faf9f6; overflow: hidden; }
      .wfv-24__accent { height: 3px; background: #1a1a1a; }
      .wfv-24__img { height: 200px; position: relative; overflow: hidden; }
      .wfv-24__body { padding: 1.5rem; }
      .wfv-24__verb { font-family: 'Space Grotesk', sans-serif; font-size: 2.2rem; font-weight: 700; color: #1a1a1a; line-height: 1; display: block; margin-bottom: 0.15rem; }
      .wfv-24__noun { font-family: 'Space Grotesk', sans-serif; font-size: 0.95rem; font-weight: 400; color: #7a7a7a; display: block; margin-bottom: 0.6rem; }
      .wfv-24__body p { font-size: 0.82rem; line-height: 1.6; color: #666; }
      .wfv-24__footer { display: flex; align-items: center; justify-content: space-between; padding: 0.75rem 1.5rem; border-top: 1px solid #e8e6e2; }
      .wfv-24__dots { display: flex; gap: 5px; }
      .wfv-24__dot { width: 5px; height: 5px; border-radius: 5px; background: #ccc; cursor: pointer; transition: all 0.3s; }
      .wfv-24__dot.active { width: 18px; background: #1a1a1a; }
      .wfv-24__arrows { display: flex; gap: 0.25rem; }
      .wfv-24__arrows button { background: none; border: 1px solid #e8e6e2; border-radius: 4px; padding: 0.35rem; cursor: pointer; color: #1a1a1a; display: flex; }
      .wfv-24__arrows button:hover { background: #f0efed; }

      /* === V25: Shadow Elevated === */
      .wfv-25__card { background: #fff; border-radius: 12px; box-shadow: 0 8px 32px rgba(0,0,0,0.1); overflow: hidden; }
      .wfv-25__img { height: 210px; position: relative; overflow: hidden; }
      .wfv-25__body { padding: 1.75rem; }
      .wfv-25__verb { font-family: 'Space Grotesk', sans-serif; font-size: 2.4rem; font-weight: 700; color: #1a1a1a; line-height: 1; display: block; margin-bottom: 0.15rem; }
      .wfv-25__noun { font-family: 'Space Grotesk', sans-serif; font-size: 1rem; font-weight: 400; color: #7a7a7a; display: block; margin-bottom: 0.6rem; }
      .wfv-25__body p { font-size: 0.82rem; line-height: 1.6; color: #666; }
      .wfv-25__footer { display: flex; align-items: center; justify-content: space-between; padding: 0.75rem 1.75rem; border-top: 1px solid #f0efed; }
      .wfv-25__dots { display: flex; gap: 5px; }
      .wfv-25__dot { width: 5px; height: 5px; border-radius: 5px; background: #ddd; cursor: pointer; transition: all 0.3s; }
      .wfv-25__dot.active { width: 18px; background: #1a1a1a; }
      .wfv-25__arrows { display: flex; gap: 0.25rem; }
      .wfv-25__arrows button { background: none; border: 1px solid #e8e6e2; border-radius: 4px; padding: 0.35rem; cursor: pointer; color: #1a1a1a; display: flex; }

      /* === V26: Borderless Open === */
      .wfv-26__card { }
      .wfv-26__img { height: 210px; position: relative; overflow: hidden; border-radius: 6px; }
      .wfv-26__body { padding: 1.25rem 0; }
      .wfv-26__verb { font-family: 'Space Grotesk', sans-serif; font-size: 2.6rem; font-weight: 700; color: #1a1a1a; line-height: 1; display: block; margin-bottom: 0.15rem; }
      .wfv-26__noun { font-family: 'Space Grotesk', sans-serif; font-size: 1rem; font-weight: 400; color: #7a7a7a; display: block; margin-bottom: 0.6rem; }
      .wfv-26__body p { font-size: 0.82rem; line-height: 1.6; color: #666; }
      .wfv-26__footer { display: flex; align-items: center; justify-content: space-between; padding-top: 0.75rem; border-top: 1px solid #e8e6e2; }
      .wfv-26__dots { display: flex; gap: 5px; }
      .wfv-26__dot { width: 5px; height: 5px; border-radius: 5px; background: #ccc; cursor: pointer; transition: all 0.3s; }
      .wfv-26__dot.active { width: 18px; background: #1a1a1a; }
      .wfv-26__arrows { display: flex; gap: 0.25rem; }
      .wfv-26__arrows button { background: none; border: 1px solid #e8e6e2; border-radius: 4px; padding: 0.35rem; cursor: pointer; color: #1a1a1a; display: flex; }

      /* === V27: Gradient Verb === */
      .wfv-27__card { border: 1px solid #e8e6e2; border-radius: 8px; background: #faf9f6; overflow: hidden; }
      .wfv-27__img { height: 200px; position: relative; overflow: hidden; }
      .wfv-27__body { padding: 1.5rem; }
      .wfv-27__verb { font-family: 'Space Grotesk', sans-serif; font-size: 2.4rem; font-weight: 700; line-height: 1; display: block; margin-bottom: 0.15rem; background: linear-gradient(135deg, #1a1a1a 0%, #7a7a7a 100%); -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text; }
      .wfv-27__noun { font-family: 'Space Grotesk', sans-serif; font-size: 1rem; font-weight: 400; color: #999; display: block; margin-bottom: 0.6rem; }
      .wfv-27__body p { font-size: 0.82rem; line-height: 1.6; color: #666; }
      .wfv-27__footer { display: flex; align-items: center; justify-content: space-between; padding: 0.75rem 1.5rem; border-top: 1px solid #e8e6e2; }
      .wfv-27__dots { display: flex; gap: 5px; }
      .wfv-27__dot { width: 5px; height: 5px; border-radius: 5px; background: #ccc; cursor: pointer; transition: all 0.3s; }
      .wfv-27__dot.active { width: 18px; background: #1a1a1a; }
      .wfv-27__arrows { display: flex; gap: 0.25rem; }
      .wfv-27__arrows button { background: none; border: 1px solid #e8e6e2; border-radius: 4px; padding: 0.35rem; cursor: pointer; color: #1a1a1a; display: flex; }

      /* === V28: Verb Over Image === */
      .wfv-28__card { border: 1px solid #e8e6e2; border-radius: 8px; overflow: hidden; background: #faf9f6; }
      .wfv-28__hero { position: relative; height: 220px; overflow: hidden; display: flex; align-items: flex-end; }
      .wfv-28__bg { position: absolute; inset: 0; background-size: cover; background-position: center; opacity: 0; transition: opacity 0.6s; }
      .wfv-28__bg.active { opacity: 1; }
      .wfv-28__verb { position: relative; z-index: 2; font-family: 'Space Grotesk', sans-serif; font-size: 3rem; font-weight: 700; color: #fff; line-height: 1; padding: 0 1.25rem 0.75rem; text-shadow: 0 2px 12px rgba(0,0,0,0.5); }
      .wfv-28__body { padding: 1.25rem; }
      .wfv-28__noun { font-family: 'Space Grotesk', sans-serif; font-size: 1rem; font-weight: 400; color: #7a7a7a; display: block; margin-bottom: 0.5rem; }
      .wfv-28__body p { font-size: 0.82rem; line-height: 1.6; color: #666; }
      .wfv-28__footer { display: flex; align-items: center; justify-content: space-between; padding: 0.75rem 1.25rem; border-top: 1px solid #e8e6e2; }
      .wfv-28__dots { display: flex; gap: 5px; }
      .wfv-28__dot { width: 5px; height: 5px; border-radius: 5px; background: #ccc; cursor: pointer; transition: all 0.3s; }
      .wfv-28__dot.active { width: 18px; background: #1a1a1a; }
      .wfv-28__arrows { display: flex; gap: 0.25rem; }
      .wfv-28__arrows button { background: none; border: 1px solid #e8e6e2; border-radius: 4px; padding: 0.35rem; cursor: pointer; color: #1a1a1a; display: flex; }

      /* === V29: Thin Border === */
      .wfv-29__card { border: 1px solid #e8e6e2; border-radius: 8px; overflow: hidden; background: #faf9f6; }
      .wfv-29__img { height: 190px; position: relative; overflow: hidden; }
      .wfv-29__divider { height: 1px; background: #e8e6e2; margin: 0 1.5rem; }
      .wfv-29__body { padding: 1.5rem; }
      .wfv-29__verb { font-family: 'Space Grotesk', sans-serif; font-size: 2rem; font-weight: 600; color: #1a1a1a; line-height: 1; display: block; margin-bottom: 0.15rem; }
      .wfv-29__noun { font-family: 'Space Grotesk', sans-serif; font-size: 0.9rem; font-weight: 400; color: #999; display: block; margin-bottom: 0.5rem; text-transform: uppercase; letter-spacing: 0.1em; }
      .wfv-29__body p { font-size: 0.82rem; line-height: 1.6; color: #666; }
      .wfv-29__footer { display: flex; align-items: center; justify-content: space-between; padding: 0.75rem 1.5rem; border-top: 1px solid #e8e6e2; }
      .wfv-29__dots { display: flex; gap: 5px; }
      .wfv-29__dot { width: 5px; height: 5px; border-radius: 5px; background: #ccc; cursor: pointer; transition: all 0.3s; }
      .wfv-29__dot.active { width: 18px; background: #1a1a1a; }
      .wfv-29__arrows { display: flex; gap: 0.25rem; }
      .wfv-29__arrows button { background: none; border: 1px solid #e8e6e2; border-radius: 4px; padding: 0.35rem; cursor: pointer; color: #1a1a1a; display: flex; }

      /* === V30: Rounded Soft === */
      .wfv-30__card { border-radius: 16px; background: #f5f4f2; overflow: hidden; }
      .wfv-30__img { height: 200px; position: relative; overflow: hidden; margin: 0.75rem; border-radius: 12px; }
      .wfv-30__body { padding: 0.5rem 1.5rem 1.25rem; }
      .wfv-30__verb { font-family: 'Space Grotesk', sans-serif; font-size: 2.2rem; font-weight: 700; color: #1a1a1a; line-height: 1; display: block; margin-bottom: 0.15rem; }
      .wfv-30__noun { font-family: 'Space Grotesk', sans-serif; font-size: 1rem; font-weight: 400; color: #7a7a7a; display: block; margin-bottom: 0.6rem; }
      .wfv-30__body p { font-size: 0.82rem; line-height: 1.6; color: #666; }
      .wfv-30__footer { display: flex; align-items: center; justify-content: space-between; padding: 0.75rem 1.5rem; border-top: 1px solid #e8e6e2; }
      .wfv-30__dots { display: flex; gap: 5px; }
      .wfv-30__dot { width: 5px; height: 5px; border-radius: 5px; background: #ccc; cursor: pointer; transition: all 0.3s; }
      .wfv-30__dot.active { width: 18px; background: #1a1a1a; }
      .wfv-30__arrows { display: flex; gap: 0.25rem; }
      .wfv-30__arrows button { background: none; border: 1px solid #e8e6e2; border-radius: 6px; padding: 0.35rem; cursor: pointer; color: #1a1a1a; display: flex; }

      /* === V31: Full Bleed Overlay === */
      .wfv-31__card { position: relative; border-radius: 8px; overflow: hidden; min-height: 400px; }
      .wfv-31__bg { position: absolute; inset: 0; background-size: cover; background-position: center; opacity: 0; transition: opacity 0.6s; }
      .wfv-31__bg.active { opacity: 1; }
      .wfv-31__overlay { position: absolute; inset: 0; z-index: 2; display: flex; flex-direction: column; justify-content: flex-end; padding: 2.5rem; background: linear-gradient(transparent 30%, rgba(0,0,0,0.8)); }
      .wfv-31__verb { font-family: 'Space Grotesk', sans-serif; font-size: 3.2rem; font-weight: 700; color: #fff; line-height: 0.95; display: block; margin-bottom: 0.1rem; }
      .wfv-31__noun { font-family: 'Space Grotesk', sans-serif; font-size: 1.05rem; font-weight: 400; color: rgba(255,255,255,0.65); display: block; margin-bottom: 0.5rem; }
      .wfv-31__overlay p { font-size: 0.82rem; line-height: 1.5; color: rgba(255,255,255,0.5); margin-bottom: 1.25rem; }
      .wfv-31__dots { display: flex; gap: 5px; }
      .wfv-31__dot { width: 5px; height: 5px; border-radius: 5px; background: rgba(255,255,255,0.25); cursor: pointer; transition: all 0.3s; }
      .wfv-31__dot.active { width: 18px; background: #fff; }

      /* === V32: Mono Instrument === */
      .wfv-32__card { border: 1px solid #d0d0d0; border-radius: 4px; background: #f5f4f2; overflow: hidden; }
      .wfv-32__img { height: 190px; position: relative; overflow: hidden; }
      .wfv-32__body { padding: 1.25rem; }
      .wfv-32__verb { font-family: 'Share Tech Mono', monospace; font-size: 2rem; font-weight: 400; color: #1a1a1a; line-height: 1; display: block; margin-bottom: 0.2rem; text-transform: uppercase; letter-spacing: 0.05em; }
      .wfv-32__noun { font-family: 'Share Tech Mono', monospace; font-size: 0.8rem; color: #999; display: block; margin-bottom: 0.5rem; text-transform: uppercase; letter-spacing: 0.1em; }
      .wfv-32__body p { font-size: 0.8rem; line-height: 1.6; color: #666; font-family: 'Space Grotesk', sans-serif; }
      .wfv-32__footer { display: flex; align-items: center; justify-content: space-between; padding: 0.6rem 1.25rem; border-top: 1px solid #d0d0d0; }
      .wfv-32__dots { display: flex; gap: 4px; }
      .wfv-32__dot { width: 4px; height: 12px; background: #d0d0d0; cursor: pointer; transition: all 0.3s; border-radius: 1px; }
      .wfv-32__dot.active { background: #1a1a1a; }
      .wfv-32__arrows { display: flex; gap: 0.25rem; }
      .wfv-32__arrows button { background: none; border: 1px solid #d0d0d0; border-radius: 3px; padding: 0.3rem; cursor: pointer; color: #1a1a1a; display: flex; }

      /* === V33: Progress Dots === */
      .wfv-33__card { border: 1px solid #e8e6e2; border-radius: 8px; background: #faf9f6; overflow: hidden; }
      .wfv-33__progress { height: 2px; background: #e8e6e2; }
      .wfv-33__bar { height: 100%; background: #1a1a1a; transition: width 0.4s ease; }
      .wfv-33__img { height: 200px; position: relative; overflow: hidden; }
      .wfv-33__body { padding: 1.5rem; }
      .wfv-33__verb { font-family: 'Space Grotesk', sans-serif; font-size: 2.4rem; font-weight: 700; color: #1a1a1a; line-height: 1; display: block; margin-bottom: 0.15rem; }
      .wfv-33__noun { font-family: 'Space Grotesk', sans-serif; font-size: 1rem; font-weight: 400; color: #7a7a7a; display: block; margin-bottom: 0.6rem; }
      .wfv-33__body p { font-size: 0.82rem; line-height: 1.6; color: #666; }
      .wfv-33__footer { display: flex; align-items: center; justify-content: space-between; padding: 0.75rem 1.5rem; border-top: 1px solid #e8e6e2; }
      .wfv-33__dots { display: flex; gap: 5px; }
      .wfv-33__dot { width: 5px; height: 5px; border-radius: 5px; background: #ccc; cursor: pointer; transition: all 0.3s; }
      .wfv-33__dot.active { width: 18px; background: #1a1a1a; }
      .wfv-33__arrows { display: flex; gap: 0.25rem; }
      .wfv-33__arrows button { background: none; border: 1px solid #e8e6e2; border-radius: 4px; padding: 0.35rem; cursor: pointer; color: #1a1a1a; display: flex; }

      /* === V34: Text Overlap === */
      .wfv-34__card { position: relative; }
      .wfv-34__img { height: 220px; position: relative; overflow: hidden; border-radius: 8px; }
      .wfv-34__body { position: relative; margin-top: -3rem; margin-left: 1rem; margin-right: 1rem; background: #faf9f6; border: 1px solid #e8e6e2; border-radius: 8px; padding: 1.5rem; z-index: 2; }
      .wfv-34__verb { font-family: 'Space Grotesk', sans-serif; font-size: 2.4rem; font-weight: 700; color: #1a1a1a; line-height: 1; display: block; margin-bottom: 0.15rem; }
      .wfv-34__noun { font-family: 'Space Grotesk', sans-serif; font-size: 1rem; font-weight: 400; color: #7a7a7a; display: block; margin-bottom: 0.6rem; }
      .wfv-34__body p { font-size: 0.82rem; line-height: 1.6; color: #666; margin-bottom: 1rem; }
      .wfv-34__dots { display: flex; gap: 5px; }
      .wfv-34__dot { width: 5px; height: 5px; border-radius: 5px; background: #ccc; cursor: pointer; transition: all 0.3s; }
      .wfv-34__dot.active { width: 18px; background: #1a1a1a; }

      /* === V35: Outlined Card === */
      .wfv-35__card { border: 2px solid #1a1a1a; border-radius: 8px; overflow: hidden; }
      .wfv-35__img { height: 200px; position: relative; overflow: hidden; }
      .wfv-35__body { padding: 1.5rem; }
      .wfv-35__verb { font-family: 'Space Grotesk', sans-serif; font-size: 2.4rem; font-weight: 700; color: #1a1a1a; line-height: 1; display: block; margin-bottom: 0.15rem; }
      .wfv-35__noun { font-family: 'Space Grotesk', sans-serif; font-size: 1rem; font-weight: 400; color: #7a7a7a; display: block; margin-bottom: 0.6rem; }
      .wfv-35__body p { font-size: 0.82rem; line-height: 1.6; color: #666; }
      .wfv-35__footer { display: flex; align-items: center; justify-content: space-between; padding: 0.75rem 1.5rem; border-top: 2px solid #1a1a1a; }
      .wfv-35__dots { display: flex; gap: 5px; }
      .wfv-35__dot { width: 5px; height: 5px; border-radius: 5px; background: #ccc; cursor: pointer; transition: all 0.3s; }
      .wfv-35__dot.active { width: 18px; background: #1a1a1a; }
      .wfv-35__arrows { display: flex; gap: 0.25rem; }
      .wfv-35__arrows button { background: none; border: 1px solid #1a1a1a; border-radius: 4px; padding: 0.35rem; cursor: pointer; color: #1a1a1a; display: flex; }

      /* === V36: Inset Image === */
      .wfv-36__card { border: 1px solid #e8e6e2; border-radius: 8px; background: #faf9f6; overflow: hidden; }
      .wfv-36__img-wrap { padding: 1rem 1rem 0; }
      .wfv-36__img { height: 190px; position: relative; overflow: hidden; border-radius: 6px; }
      .wfv-36__body { padding: 1.25rem 1.5rem; }
      .wfv-36__verb { font-family: 'Space Grotesk', sans-serif; font-size: 2.2rem; font-weight: 700; color: #1a1a1a; line-height: 1; display: block; margin-bottom: 0.15rem; }
      .wfv-36__noun { font-family: 'Space Grotesk', sans-serif; font-size: 1rem; font-weight: 400; color: #7a7a7a; display: block; margin-bottom: 0.6rem; }
      .wfv-36__body p { font-size: 0.82rem; line-height: 1.6; color: #666; }
      .wfv-36__footer { display: flex; align-items: center; justify-content: space-between; padding: 0.75rem 1.5rem; border-top: 1px solid #e8e6e2; }
      .wfv-36__dots { display: flex; gap: 5px; }
      .wfv-36__dot { width: 5px; height: 5px; border-radius: 5px; background: #ccc; cursor: pointer; transition: all 0.3s; }
      .wfv-36__dot.active { width: 18px; background: #1a1a1a; }
      .wfv-36__arrows { display: flex; gap: 0.25rem; }
      .wfv-36__arrows button { background: none; border: 1px solid #e8e6e2; border-radius: 4px; padding: 0.35rem; cursor: pointer; color: #1a1a1a; display: flex; }

      /* === V37: Tall Cinematic === */
      .wfv-37__card { border: 1px solid #e8e6e2; border-radius: 8px; background: #faf9f6; overflow: hidden; }
      .wfv-37__img { height: 280px; position: relative; overflow: hidden; }
      .wfv-37__body { padding: 1.5rem; }
      .wfv-37__verb { font-family: 'Space Grotesk', sans-serif; font-size: 2.8rem; font-weight: 700; color: #1a1a1a; line-height: 0.95; display: block; margin-bottom: 0.15rem; }
      .wfv-37__noun { font-family: 'Space Grotesk', sans-serif; font-size: 1rem; font-weight: 400; color: #7a7a7a; display: block; margin-bottom: 0.6rem; }
      .wfv-37__body p { font-size: 0.82rem; line-height: 1.6; color: #666; }
      .wfv-37__footer { display: flex; align-items: center; justify-content: space-between; padding: 0.75rem 1.5rem; border-top: 1px solid #e8e6e2; }
      .wfv-37__dots { display: flex; gap: 5px; }
      .wfv-37__dot { width: 5px; height: 5px; border-radius: 5px; background: #ccc; cursor: pointer; transition: all 0.3s; }
      .wfv-37__dot.active { width: 18px; background: #1a1a1a; }
      .wfv-37__arrows { display: flex; gap: 0.25rem; }
      .wfv-37__arrows button { background: none; border: 1px solid #e8e6e2; border-radius: 4px; padding: 0.35rem; cursor: pointer; color: #1a1a1a; display: flex; }

      /* === V38: Ghost Verb === */
      .wfv-38__card { border: 1px solid #e8e6e2; border-radius: 8px; overflow: hidden; background: #faf9f6; }
      .wfv-38__hero { position: relative; height: 240px; overflow: hidden; display: flex; align-items: center; justify-content: center; }
      .wfv-38__bg { position: absolute; inset: 0; background-size: cover; background-position: center; opacity: 0; transition: opacity 0.6s; }
      .wfv-38__bg.active { opacity: 1; }
      .wfv-38__ghost { position: relative; z-index: 2; font-family: 'Space Grotesk', sans-serif; font-size: 4rem; font-weight: 800; color: rgba(255,255,255,0.85); line-height: 1; text-shadow: 0 2px 20px rgba(0,0,0,0.4); text-transform: uppercase; letter-spacing: 0.05em; }
      .wfv-38__body { padding: 1.5rem; }
      .wfv-38__noun { font-family: 'Space Grotesk', sans-serif; font-size: 1rem; font-weight: 500; color: #4a4a4a; display: block; margin-bottom: 0.5rem; }
      .wfv-38__body p { font-size: 0.82rem; line-height: 1.6; color: #666; margin-bottom: 1rem; }
      .wfv-38__dots { display: flex; gap: 5px; }
      .wfv-38__dot { width: 5px; height: 5px; border-radius: 5px; background: #ccc; cursor: pointer; transition: all 0.3s; }
      .wfv-38__dot.active { width: 18px; background: #1a1a1a; }

      /* === V39: Stacked Minimal === */
      .wfv-39__card { }
      .wfv-39__img { height: 200px; position: relative; overflow: hidden; border-radius: 4px; }
      .wfv-39__body { padding: 1.5rem 0 0.75rem; }
      .wfv-39__verb { font-family: 'Space Grotesk', sans-serif; font-size: 2.6rem; font-weight: 700; color: #1a1a1a; line-height: 1; display: block; margin-bottom: 0.1rem; }
      .wfv-39__noun { font-family: 'Space Grotesk', sans-serif; font-size: 0.9rem; font-weight: 400; color: #999; display: block; margin-bottom: 0.5rem; letter-spacing: 0.05em; }
      .wfv-39__body p { font-size: 0.82rem; line-height: 1.6; color: #666; }
      .wfv-39__footer { padding-top: 0.75rem; }
      .wfv-39__dots { display: flex; gap: 6px; }
      .wfv-39__dot { width: 6px; height: 6px; border-radius: 6px; background: #ddd; cursor: pointer; transition: all 0.3s; }
      .wfv-39__dot.active { width: 20px; background: #1a1a1a; }

      /* === V40: Cutout Verb === */
      .wfv-40__card { border-radius: 8px; overflow: hidden; background: #1a1a1a; }
      .wfv-40__hero { position: relative; height: 240px; overflow: hidden; display: flex; align-items: flex-end; }
      .wfv-40__bg { position: absolute; inset: 0; background-size: cover; background-position: center; opacity: 0; transition: opacity 0.6s; }
      .wfv-40__bg.active { opacity: 1; }
      .wfv-40__cutout { position: relative; z-index: 2; font-family: 'Space Grotesk', sans-serif; font-size: 3.5rem; font-weight: 800; line-height: 1; padding: 0 1.5rem 0.5rem; color: transparent; -webkit-text-stroke: 2px rgba(255,255,255,0.8); }
      .wfv-40__body { padding: 1.25rem 1.5rem; }
      .wfv-40__noun { font-family: 'Space Grotesk', sans-serif; font-size: 1rem; font-weight: 400; color: #888; display: block; margin-bottom: 0.5rem; }
      .wfv-40__body p { font-size: 0.82rem; line-height: 1.6; color: #666; }
      .wfv-40__footer { display: flex; align-items: center; justify-content: space-between; padding: 0.75rem 1.5rem; border-top: 1px solid #333; }
      .wfv-40__dots { display: flex; gap: 5px; }
      .wfv-40__dot { width: 5px; height: 5px; border-radius: 5px; background: #555; cursor: pointer; transition: all 0.3s; }
      .wfv-40__dot.active { width: 18px; background: #faf9f6; }
      .wfv-40__arrows { display: flex; gap: 0.25rem; }
      .wfv-40__arrows button { background: none; border: 1px solid #444; border-radius: 4px; padding: 0.35rem; cursor: pointer; color: #faf9f6; display: flex; }
      /* ===== V19: Accent Border Top ===== */
      .wfv-19__card { border: 1px solid #e8e6e2; border-radius: 8px; background: #faf9f6; overflow: hidden; position: relative; }
      .wfv-19__accent { height: 3px; background: #1a1a1a; }
      .wfv-19__header { display: flex; align-items: center; gap: 0.75rem; padding: 1rem 1.25rem; border-bottom: 1px solid #e8e6e2; }
      .wfv-19__thumbs { display: flex; }
      .wfv-19__thumb { width: 24px; height: 24px; border-radius: 50%; background-size: cover; background-position: center; border: 2px solid #faf9f6; margin-left: -6px; }
      .wfv-19__thumb:first-child { margin-left: 0; }
      .wfv-19__header span { font-family: 'Space Grotesk', sans-serif; font-size: 0.8rem; font-weight: 500; color: #1a1a1a; }
      .wfv-19__img { height: 180px; }
      .wfv-19__body { padding: 1.25rem; }
      .wfv-19__body h3 { font-family: 'Space Grotesk', sans-serif; font-size: 1.1rem; font-weight: 500; color: #1a1a1a; margin-bottom: 0.5rem; }
      .wfv-19__body p { font-size: 0.85rem; line-height: 1.6; color: #666; }
      .wfv-19__footer { display: flex; align-items: center; justify-content: space-between; padding: 0.75rem 1.25rem; border-top: 1px solid #e8e6e2; }
      .wfv-19__dots { display: flex; align-items: center; gap: 4px; }
      .wfv-19__dot { width: 4px; height: 4px; border-radius: 4px; background: #ccc; cursor: pointer; transition: all 0.3s; }
      .wfv-19__dot.active { width: 16px; background: #1a1a1a; }
      .wfv-19__counter { font-family: 'Share Tech Mono', monospace; font-size: 0.65rem; color: #999; letter-spacing: 0.1em; margin-left: 0.75rem; }
      .wfv-19__arrows { display: flex; gap: 0.25rem; }
      .wfv-19__arrows button { background: none; border: 1px solid #e8e6e2; border-radius: 4px; padding: 0.35rem; cursor: pointer; color: #1a1a1a; display: flex; }

      /* ===== V20: Instrument Panel ===== */
      .wfv-20__card { border: 1px solid #d0d0d0; border-radius: 4px; background: #f5f4f2; overflow: hidden; font-family: 'Share Tech Mono', monospace; }
      .wfv-20__header { display: flex; align-items: center; justify-content: space-between; padding: 0.6rem 1rem; border-bottom: 1px solid #d0d0d0; background: #eeedeb; }
      .wfv-20__coords { font-size: 0.6rem; color: #999; letter-spacing: 0.05em; }
      .wfv-20__ref { font-size: 0.6rem; color: #bbb; letter-spacing: 0.05em; }
      .wfv-20__img { height: 180px; }
      .wfv-20__body { display: flex; gap: 1rem; padding: 1rem; border-bottom: 1px solid #e8e6e2; }
      .wfv-20__num { font-size: 2.5rem; font-weight: 600; color: #e0dfdd; line-height: 1; font-family: 'Space Grotesk', sans-serif; min-width: 50px; }
      .wfv-20__text h3 { font-family: 'Space Grotesk', sans-serif; font-size: 1rem; font-weight: 500; color: #1a1a1a; margin-bottom: 0.35rem; }
      .wfv-20__text h3 span { color: #7a7a7a; }
      .wfv-20__text p { font-size: 0.8rem; line-height: 1.6; color: #666; font-family: 'Space Grotesk', sans-serif; }
      .wfv-20__footer { display: flex; align-items: center; justify-content: space-between; padding: 0.6rem 1rem; }
      .wfv-20__sticks { display: flex; align-items: flex-end; gap: 3px; height: 16px; }
      .wfv-20__stick { width: 3px; height: 8px; background: #d0d0d0; cursor: pointer; transition: all 0.3s; border-radius: 1px; }
      .wfv-20__stick.active { height: 16px; background: #1a1a1a; }
      .wfv-20__arrows { display: flex; align-items: center; gap: 0.5rem; }
      .wfv-20__arrows button { background: none; border: 1px solid #d0d0d0; border-radius: 3px; padding: 0.3rem; cursor: pointer; color: #1a1a1a; display: flex; }
      .wfv-20__arrows button:hover { background: #e8e6e2; }
      .wfv-20__counter { font-size: 0.6rem; color: #999; letter-spacing: 0.1em; }

      /* ================================================================
         ABOUT + WHY WE FLY — VARIATIONS 41-50 (Mono Instrument Series)
         ================================================================ */

      /* === V41: Mono Dark === */
      .wfv-41__card { border: 1px solid #333; border-radius: 4px; background: #1a1a1a; overflow: hidden; }
      .wfv-41__img { height: 190px; position: relative; overflow: hidden; }
      .wfv-41__body { padding: 1.25rem; }
      .wfv-41__verb { font-family: 'Share Tech Mono', monospace; font-size: 2rem; font-weight: 400; color: #faf9f6; line-height: 1; display: block; margin-bottom: 0.2rem; text-transform: uppercase; letter-spacing: 0.05em; }
      .wfv-41__noun { font-family: 'Share Tech Mono', monospace; font-size: 0.8rem; color: #777; display: block; margin-bottom: 0.5rem; text-transform: uppercase; letter-spacing: 0.1em; }
      .wfv-41__body p { font-size: 0.8rem; line-height: 1.6; color: #888; font-family: 'Space Grotesk', sans-serif; }
      .wfv-41__footer { display: flex; align-items: center; justify-content: space-between; padding: 0.6rem 1.25rem; border-top: 1px solid #333; }
      .wfv-41__dots { display: flex; gap: 4px; }
      .wfv-41__dot { width: 4px; height: 12px; background: #444; cursor: pointer; transition: all 0.3s; border-radius: 1px; }
      .wfv-41__dot.active { background: #faf9f6; }
      .wfv-41__arrows { display: flex; gap: 0.25rem; }
      .wfv-41__arrows button { background: none; border: 1px solid #444; border-radius: 3px; padding: 0.3rem; cursor: pointer; color: #faf9f6; display: flex; }
      .wfv-41__arrows button:hover { border-color: #777; }

      /* === V42: Mono Tall === */
      .wfv-42__card { border: 1px solid #d0d0d0; border-radius: 4px; background: #f5f4f2; overflow: hidden; }
      .wfv-42__img { height: 280px; position: relative; overflow: hidden; }
      .wfv-42__body { padding: 1.25rem; }
      .wfv-42__verb { font-family: 'Share Tech Mono', monospace; font-size: 2rem; font-weight: 400; color: #1a1a1a; line-height: 1; display: block; margin-bottom: 0.2rem; text-transform: uppercase; letter-spacing: 0.05em; }
      .wfv-42__noun { font-family: 'Share Tech Mono', monospace; font-size: 0.8rem; color: #999; display: block; margin-bottom: 0.5rem; text-transform: uppercase; letter-spacing: 0.1em; }
      .wfv-42__body p { font-size: 0.8rem; line-height: 1.6; color: #666; font-family: 'Space Grotesk', sans-serif; }
      .wfv-42__footer { display: flex; align-items: center; justify-content: space-between; padding: 0.6rem 1.25rem; border-top: 1px solid #d0d0d0; }
      .wfv-42__dots { display: flex; gap: 4px; }
      .wfv-42__dot { width: 4px; height: 12px; background: #d0d0d0; cursor: pointer; transition: all 0.3s; border-radius: 1px; }
      .wfv-42__dot.active { background: #1a1a1a; }
      .wfv-42__arrows { display: flex; gap: 0.25rem; }
      .wfv-42__arrows button { background: none; border: 1px solid #d0d0d0; border-radius: 3px; padding: 0.3rem; cursor: pointer; color: #1a1a1a; display: flex; }

      /* === V43: Mono Inset === */
      .wfv-43__card { border: 1px solid #d0d0d0; border-radius: 4px; background: #f5f4f2; overflow: hidden; }
      .wfv-43__img-wrap { padding: 0.75rem 0.75rem 0; }
      .wfv-43__img { height: 180px; position: relative; overflow: hidden; border-radius: 3px; }
      .wfv-43__body { padding: 1.25rem; }
      .wfv-43__verb { font-family: 'Share Tech Mono', monospace; font-size: 2rem; font-weight: 400; color: #1a1a1a; line-height: 1; display: block; margin-bottom: 0.2rem; text-transform: uppercase; letter-spacing: 0.05em; }
      .wfv-43__noun { font-family: 'Share Tech Mono', monospace; font-size: 0.8rem; color: #999; display: block; margin-bottom: 0.5rem; text-transform: uppercase; letter-spacing: 0.1em; }
      .wfv-43__body p { font-size: 0.8rem; line-height: 1.6; color: #666; font-family: 'Space Grotesk', sans-serif; }
      .wfv-43__footer { display: flex; align-items: center; justify-content: space-between; padding: 0.6rem 1.25rem; border-top: 1px solid #d0d0d0; }
      .wfv-43__dots { display: flex; gap: 4px; }
      .wfv-43__dot { width: 4px; height: 12px; background: #d0d0d0; cursor: pointer; transition: all 0.3s; border-radius: 1px; }
      .wfv-43__dot.active { background: #1a1a1a; }
      .wfv-43__arrows { display: flex; gap: 0.25rem; }
      .wfv-43__arrows button { background: none; border: 1px solid #d0d0d0; border-radius: 3px; padding: 0.3rem; cursor: pointer; color: #1a1a1a; display: flex; }

      /* === V44: Mono Coords === */
      .wfv-44__card { border: 1px solid #d0d0d0; border-radius: 4px; background: #f5f4f2; overflow: hidden; }
      .wfv-44__header { display: flex; align-items: center; justify-content: space-between; padding: 0.5rem 1rem; border-bottom: 1px solid #d0d0d0; background: #eeedeb; }
      .wfv-44__coords { font-family: 'Share Tech Mono', monospace; font-size: 0.6rem; color: #999; letter-spacing: 0.05em; }
      .wfv-44__ref { font-family: 'Share Tech Mono', monospace; font-size: 0.6rem; color: #bbb; letter-spacing: 0.1em; }
      .wfv-44__img { height: 190px; position: relative; overflow: hidden; }
      .wfv-44__body { padding: 1.25rem; }
      .wfv-44__verb { font-family: 'Share Tech Mono', monospace; font-size: 2rem; font-weight: 400; color: #1a1a1a; line-height: 1; display: block; margin-bottom: 0.2rem; text-transform: uppercase; letter-spacing: 0.05em; }
      .wfv-44__noun { font-family: 'Share Tech Mono', monospace; font-size: 0.8rem; color: #999; display: block; margin-bottom: 0.5rem; text-transform: uppercase; letter-spacing: 0.1em; }
      .wfv-44__body p { font-size: 0.8rem; line-height: 1.6; color: #666; font-family: 'Space Grotesk', sans-serif; }
      .wfv-44__footer { display: flex; align-items: center; justify-content: space-between; padding: 0.6rem 1.25rem; border-top: 1px solid #d0d0d0; }
      .wfv-44__dots { display: flex; gap: 4px; }
      .wfv-44__dot { width: 4px; height: 12px; background: #d0d0d0; cursor: pointer; transition: all 0.3s; border-radius: 1px; }
      .wfv-44__dot.active { background: #1a1a1a; }
      .wfv-44__arrows { display: flex; gap: 0.25rem; }
      .wfv-44__arrows button { background: none; border: 1px solid #d0d0d0; border-radius: 3px; padding: 0.3rem; cursor: pointer; color: #1a1a1a; display: flex; }

      /* === V45: Mono Accent === */
      .wfv-45__card { border: 1px solid #d0d0d0; border-radius: 4px; background: #f5f4f2; overflow: hidden; }
      .wfv-45__accent { height: 3px; background: #1a1a1a; }
      .wfv-45__img { height: 190px; position: relative; overflow: hidden; }
      .wfv-45__body { padding: 1.25rem; }
      .wfv-45__verb { font-family: 'Share Tech Mono', monospace; font-size: 2rem; font-weight: 400; color: #1a1a1a; line-height: 1; display: block; margin-bottom: 0.2rem; text-transform: uppercase; letter-spacing: 0.05em; }
      .wfv-45__noun { font-family: 'Share Tech Mono', monospace; font-size: 0.8rem; color: #999; display: block; margin-bottom: 0.5rem; text-transform: uppercase; letter-spacing: 0.1em; }
      .wfv-45__body p { font-size: 0.8rem; line-height: 1.6; color: #666; font-family: 'Space Grotesk', sans-serif; }
      .wfv-45__footer { display: flex; align-items: center; justify-content: space-between; padding: 0.6rem 1.25rem; border-top: 1px solid #d0d0d0; }
      .wfv-45__dots { display: flex; gap: 4px; }
      .wfv-45__dot { width: 4px; height: 12px; background: #d0d0d0; cursor: pointer; transition: all 0.3s; border-radius: 1px; }
      .wfv-45__dot.active { background: #1a1a1a; }
      .wfv-45__arrows { display: flex; gap: 0.25rem; }
      .wfv-45__arrows button { background: none; border: 1px solid #d0d0d0; border-radius: 3px; padding: 0.3rem; cursor: pointer; color: #1a1a1a; display: flex; }

      /* === V46: Mono Overlay === */
      .wfv-46__card { border: 1px solid #d0d0d0; border-radius: 4px; overflow: hidden; background: #f5f4f2; }
      .wfv-46__hero { position: relative; height: 220px; overflow: hidden; display: flex; align-items: flex-end; }
      .wfv-46__bg { position: absolute; inset: 0; background-size: cover; background-position: center; opacity: 0; transition: opacity 0.6s; }
      .wfv-46__bg.active { opacity: 1; }
      .wfv-46__verb { position: relative; z-index: 2; font-family: 'Share Tech Mono', monospace; font-size: 2.4rem; font-weight: 400; color: #fff; line-height: 1; padding: 0 1.25rem 0.75rem; text-transform: uppercase; letter-spacing: 0.05em; text-shadow: 0 2px 12px rgba(0,0,0,0.5); }
      .wfv-46__body { padding: 1.25rem; }
      .wfv-46__noun { font-family: 'Share Tech Mono', monospace; font-size: 0.8rem; color: #999; display: block; margin-bottom: 0.5rem; text-transform: uppercase; letter-spacing: 0.1em; }
      .wfv-46__body p { font-size: 0.8rem; line-height: 1.6; color: #666; font-family: 'Space Grotesk', sans-serif; }
      .wfv-46__footer { display: flex; align-items: center; justify-content: space-between; padding: 0.6rem 1.25rem; border-top: 1px solid #d0d0d0; }
      .wfv-46__dots { display: flex; gap: 4px; }
      .wfv-46__dot { width: 4px; height: 12px; background: #d0d0d0; cursor: pointer; transition: all 0.3s; border-radius: 1px; }
      .wfv-46__dot.active { background: #1a1a1a; }
      .wfv-46__arrows { display: flex; gap: 0.25rem; }
      .wfv-46__arrows button { background: none; border: 1px solid #d0d0d0; border-radius: 3px; padding: 0.3rem; cursor: pointer; color: #1a1a1a; display: flex; }

      /* === V47: Mono XL Verb === */
      .wfv-47__card { border: 1px solid #d0d0d0; border-radius: 4px; background: #f5f4f2; overflow: hidden; }
      .wfv-47__img { height: 190px; position: relative; overflow: hidden; }
      .wfv-47__body { padding: 1.25rem; }
      .wfv-47__verb { font-family: 'Share Tech Mono', monospace; font-size: 3rem; font-weight: 400; color: #1a1a1a; line-height: 0.95; display: block; margin-bottom: 0.25rem; text-transform: uppercase; letter-spacing: 0.03em; }
      .wfv-47__noun { font-family: 'Share Tech Mono', monospace; font-size: 0.75rem; color: #bbb; display: block; margin-bottom: 0.5rem; text-transform: uppercase; letter-spacing: 0.15em; }
      .wfv-47__body p { font-size: 0.8rem; line-height: 1.6; color: #666; font-family: 'Space Grotesk', sans-serif; }
      .wfv-47__footer { display: flex; align-items: center; justify-content: space-between; padding: 0.6rem 1.25rem; border-top: 1px solid #d0d0d0; }
      .wfv-47__dots { display: flex; gap: 4px; }
      .wfv-47__dot { width: 4px; height: 12px; background: #d0d0d0; cursor: pointer; transition: all 0.3s; border-radius: 1px; }
      .wfv-47__dot.active { background: #1a1a1a; }
      .wfv-47__arrows { display: flex; gap: 0.25rem; }
      .wfv-47__arrows button { background: none; border: 1px solid #d0d0d0; border-radius: 3px; padding: 0.3rem; cursor: pointer; color: #1a1a1a; display: flex; }

      /* === V48: Mono Divider === */
      .wfv-48__card { border: 1px solid #d0d0d0; border-radius: 4px; background: #f5f4f2; overflow: hidden; }
      .wfv-48__img { height: 190px; position: relative; overflow: hidden; }
      .wfv-48__rule { height: 1px; background: #d0d0d0; margin: 0 1.25rem; }
      .wfv-48__body { padding: 1.25rem; }
      .wfv-48__verb { font-family: 'Share Tech Mono', monospace; font-size: 2rem; font-weight: 400; color: #1a1a1a; line-height: 1; display: block; margin-bottom: 0.2rem; text-transform: uppercase; letter-spacing: 0.05em; }
      .wfv-48__noun { font-family: 'Share Tech Mono', monospace; font-size: 0.8rem; color: #999; display: block; margin-bottom: 0.5rem; text-transform: uppercase; letter-spacing: 0.1em; }
      .wfv-48__body p { font-size: 0.8rem; line-height: 1.6; color: #666; font-family: 'Space Grotesk', sans-serif; }
      .wfv-48__footer { display: flex; align-items: center; justify-content: space-between; padding: 0.6rem 1.25rem; border-top: 1px solid #d0d0d0; }
      .wfv-48__dots { display: flex; gap: 4px; }
      .wfv-48__dot { width: 4px; height: 12px; background: #d0d0d0; cursor: pointer; transition: all 0.3s; border-radius: 1px; }
      .wfv-48__dot.active { background: #1a1a1a; }
      .wfv-48__arrows { display: flex; gap: 0.25rem; }
      .wfv-48__arrows button { background: none; border: 1px solid #d0d0d0; border-radius: 3px; padding: 0.3rem; cursor: pointer; color: #1a1a1a; display: flex; }

      /* === V49: Mono Shadow === */
      .wfv-49__card { border: 1px solid rgba(0,0,0,0.12); border-radius: 4px; background: #e8e4df; overflow: hidden; box-shadow: 0 4px 20px rgba(0,0,0,0.08); }
      .wfv-49__img { height: 190px; position: relative; overflow: hidden; margin-bottom: -4px; z-index: 2; border-radius: 0 !important; }
      .wfv-49__body { padding: 1.25rem; position: relative; display: grid; }
      .wfv-49__body::before { content: ''; position: absolute; inset: 0; background: linear-gradient(160deg, rgba(0,0,0,0.65) 0%, rgba(0,0,0,0.6) 15%, transparent 50%); pointer-events: none; z-index: 0; }
      .wfv-49__item { grid-area: 1 / 1; opacity: 0; transition: opacity 0.4s ease; position: relative; z-index: 1; }
      .wfv-49__item.active { opacity: 1; }
      .wfv-49__verb { font-family: 'Share Tech Mono', monospace; font-size: 2rem; font-weight: 400; color: #fff; line-height: 1; display: block; margin-bottom: 0.2rem; text-transform: uppercase; letter-spacing: 0.05em; }
      .wfv-49__noun { font-family: 'Share Tech Mono', monospace; font-size: 0.8rem; color: #e0e0e0; display: block; margin-bottom: 0.5rem; text-transform: uppercase; letter-spacing: 0.1em; }
      .wfv-49__body p { font-size: 0.8rem; line-height: 1.6; color: #4a4a4a; font-family: 'Space Grotesk', sans-serif; }
      .wfv-49__footer { display: flex; align-items: center; justify-content: space-between; padding: 0.6rem 1.25rem; border-top: 1px solid #e8e6e2; }
      .wfv-49__dots { display: flex; gap: 4px; }
      .wfv-49__dot { width: 4px; height: 12px; background: #d0d0d0; cursor: pointer; transition: all 0.3s; border-radius: 1px; }
      .wfv-49__dot.active { background: #1a1a1a; }
      .wfv-49__arrows { display: flex; gap: 0.25rem; }
      .wfv-49__arrows button { background: none; border: 1px solid #d0d0d0; border-radius: 3px; padding: 0.3rem; cursor: pointer; color: #1a1a1a; display: flex; }

      /* === V50: Mono Borderless === */
      .wfv-50__card { }
      .wfv-50__img { height: 200px; position: relative; overflow: hidden; border-radius: 3px; }
      .wfv-50__body { padding: 1.25rem 0; }
      .wfv-50__verb { font-family: 'Share Tech Mono', monospace; font-size: 2rem; font-weight: 400; color: #1a1a1a; line-height: 1; display: block; margin-bottom: 0.2rem; text-transform: uppercase; letter-spacing: 0.05em; }
      .wfv-50__noun { font-family: 'Share Tech Mono', monospace; font-size: 0.8rem; color: #999; display: block; margin-bottom: 0.5rem; text-transform: uppercase; letter-spacing: 0.1em; }
      .wfv-50__body p { font-size: 0.8rem; line-height: 1.6; color: #666; font-family: 'Space Grotesk', sans-serif; }
      .wfv-50__footer { padding-top: 0.75rem; }
      .wfv-50__dots { display: flex; gap: 4px; }
      .wfv-50__dot { width: 4px; height: 12px; background: #d0d0d0; cursor: pointer; transition: all 0.3s; border-radius: 1px; }
      .wfv-50__dot.active { background: #1a1a1a; }

      /* =================================================================
         ABOUT SPLIT VARIATIONS
         ================================================================= */
      .abt-sec { padding: 6rem 4rem; border-bottom: 1px solid #e8e6e2; }
      .abt-sec__label { display: block; font-family: 'Share Tech Mono', monospace; font-size: 0.65rem; letter-spacing: 0.15em; text-transform: uppercase; color: #999; margin-bottom: 2rem; }

      /* === V1: Editorial Masthead === */
      .abt-v1__layout { display: grid; grid-template-columns: 1fr 1fr; gap: 4rem; align-items: stretch; }
      .abt-v1__left { display: flex; flex-direction: column; justify-content: center; }
      .abt-v1__pre { font-family: 'Share Tech Mono', monospace; font-size: 0.65rem; letter-spacing: 0.2em; text-transform: uppercase; color: #999; display: block; margin-bottom: 1.5rem; }
      .abt-v1__headline { font-family: 'Space Grotesk', sans-serif; font-size: clamp(1.8rem, 3.5vw, 2.8rem); font-weight: 700; text-transform: uppercase; letter-spacing: -0.02em; line-height: 1.1; margin: 0 0 2rem; color: #1a1a1a; }
      .abt-v1__text { font-family: 'Space Grotesk', sans-serif; font-size: 0.95rem; line-height: 1.8; color: #666; margin: 0 0 1.25rem; }
      .abt-v1__cta { display: inline-flex; align-items: center; gap: 0.5rem; font-family: 'Space Grotesk', sans-serif; font-size: 0.75rem; text-transform: uppercase; letter-spacing: 0.1em; color: #1a1a1a; text-decoration: none; border-bottom: 1px solid #ccc; padding-bottom: 0.25rem; margin-top: 0.5rem; transition: border-color 0.3s; }
      .abt-v1__cta:hover { border-color: #1a1a1a; }
      .abt-v1__right { display: flex; flex-direction: column; }
      .abt-v1__card { flex: 1; display: flex; flex-direction: column; background: #fff; border: 1px solid #e8e6e2; border-radius: 4px; overflow: hidden; }
      .abt-v1__img { height: 240px; position: relative; overflow: hidden; }
      .abt-v1__slide { position: absolute; inset: 0; background-size: cover; background-position: center; opacity: 0; transition: opacity 0.6s ease; }
      .abt-v1__slide.active { opacity: 1; }
      .abt-v1__body { flex: 1; padding: 1.5rem; border-top: 3px solid #1a1a1a; display: grid; }
      .abt-v1__item { grid-area: 1 / 1; opacity: 0; transition: opacity 0.4s ease; }
      .abt-v1__item.active { opacity: 1; }
      .abt-v1__verb { font-family: 'Space Grotesk', sans-serif; font-size: 1.8rem; font-weight: 700; color: #1a1a1a; line-height: 1; display: block; margin-bottom: 0.3rem; text-transform: uppercase; letter-spacing: -0.02em; }
      .abt-v1__noun { font-family: 'Share Tech Mono', monospace; font-size: 0.75rem; color: #999; display: block; margin-bottom: 0.75rem; text-transform: uppercase; letter-spacing: 0.12em; }
      .abt-v1__body p { font-size: 0.85rem; line-height: 1.65; color: #555; font-family: 'Space Grotesk', sans-serif; }
      .abt-v1__footer { display: flex; align-items: center; justify-content: space-between; padding: 0.75rem 1.5rem; border-top: 1px solid #e8e6e2; }
      .abt-v1__dots { display: flex; gap: 6px; }
      .abt-v1__dot { width: 6px; height: 6px; border-radius: 50%; background: #ddd; cursor: pointer; transition: all 0.3s; }
      .abt-v1__dot.active { background: #1a1a1a; }
      .abt-v1__arrows { display: flex; gap: 0.25rem; }
      .abt-v1__arrows button { background: none; border: 1px solid #e8e6e2; border-radius: 3px; padding: 0.3rem; cursor: pointer; color: #1a1a1a; display: flex; transition: border-color 0.2s; }
      .abt-v1__arrows button:hover { border-color: #1a1a1a; }

      /* === V2: Dark Panel === */
      .abt-v2__layout { display: grid; grid-template-columns: 1fr 1fr; gap: 0; align-items: stretch; }
      .abt-v2__left { background: #1a1a1a; color: #fff; padding: 3rem; display: flex; flex-direction: column; justify-content: center; border-radius: 4px 0 0 4px; }
      .abt-v2__pre { font-family: 'Share Tech Mono', monospace; font-size: 0.65rem; letter-spacing: 0.2em; text-transform: uppercase; color: rgba(255,255,255,0.4); display: block; margin-bottom: 1.5rem; }
      .abt-v2__headline { font-family: 'Space Grotesk', sans-serif; font-size: clamp(1.6rem, 3vw, 2.4rem); font-weight: 700; text-transform: uppercase; letter-spacing: -0.02em; line-height: 1.1; margin: 0 0 1.5rem; color: #fff; }
      .abt-v2__text { font-family: 'Space Grotesk', sans-serif; font-size: 0.9rem; line-height: 1.8; color: rgba(255,255,255,0.6); margin: 0 0 1rem; }
      .abt-v2__tags { display: flex; flex-wrap: wrap; gap: 0.5rem; margin: 1rem 0 1.5rem; }
      .abt-v2__tags span { font-family: 'Share Tech Mono', monospace; font-size: 0.6rem; letter-spacing: 0.12em; text-transform: uppercase; color: rgba(255,255,255,0.35); padding: 0.35rem 0.75rem; border: 1px solid rgba(255,255,255,0.12); border-radius: 2px; }
      .abt-v2__cta { display: inline-flex; align-items: center; gap: 0.5rem; font-family: 'Space Grotesk', sans-serif; font-size: 0.75rem; text-transform: uppercase; letter-spacing: 0.1em; color: #fff; text-decoration: none; border-bottom: 1px solid rgba(255,255,255,0.3); padding-bottom: 0.25rem; transition: border-color 0.3s; }
      .abt-v2__cta:hover { border-color: #fff; }
      .abt-v2__right { display: flex; flex-direction: column; }
      .abt-v2__card { flex: 1; display: flex; flex-direction: column; background: #e8e4df; border-radius: 0 4px 4px 0; overflow: hidden; border: 1px solid rgba(0,0,0,0.08); border-left: none; }
      .abt-v2__img { height: 200px; position: relative; overflow: hidden; }
      .abt-v2__slide { position: absolute; inset: 0; background-size: cover; background-position: center; opacity: 0; transition: opacity 0.6s ease; }
      .abt-v2__slide.active { opacity: 1; }
      .abt-v2__body { flex: 1; padding: 1.25rem; position: relative; display: grid; }
      .abt-v2__body::before { content: ''; position: absolute; inset: 0; background: linear-gradient(160deg, rgba(0,0,0,0.65) 0%, rgba(0,0,0,0.6) 15%, transparent 50%); pointer-events: none; z-index: 0; }
      .abt-v2__item { grid-area: 1 / 1; opacity: 0; transition: opacity 0.4s ease; position: relative; z-index: 1; }
      .abt-v2__item.active { opacity: 1; }
      .abt-v2__verb { font-family: 'Share Tech Mono', monospace; font-size: 2rem; font-weight: 400; color: #fff; line-height: 1; display: block; margin-bottom: 0.2rem; text-transform: uppercase; letter-spacing: 0.05em; }
      .abt-v2__noun { font-family: 'Share Tech Mono', monospace; font-size: 0.8rem; color: #e0e0e0; display: block; margin-bottom: 0.5rem; text-transform: uppercase; letter-spacing: 0.1em; }
      .abt-v2__body p { font-size: 0.8rem; line-height: 1.6; color: #4a4a4a; font-family: 'Space Grotesk', sans-serif; }
      .abt-v2__footer { display: flex; align-items: center; justify-content: space-between; padding: 0.6rem 1.25rem; background: #1a1a1a; }
      .abt-v2__dots { display: flex; gap: 4px; }
      .abt-v2__dot { width: 4px; height: 12px; background: rgba(255,255,255,0.2); cursor: pointer; transition: all 0.3s; border-radius: 1px; }
      .abt-v2__dot.active { background: #fff; }
      .abt-v2__arrows { display: flex; gap: 0.25rem; }
      .abt-v2__arrows button { background: none; border: 1px solid rgba(255,255,255,0.2); border-radius: 3px; padding: 0.3rem; cursor: pointer; color: #fff; display: flex; transition: border-color 0.2s; }
      .abt-v2__arrows button:hover { border-color: #fff; }

      /* === V3: Overlap Cinematic === */
      .abt-v3__layout { display: grid; grid-template-columns: 1fr 1.2fr; gap: 3rem; align-items: stretch; }
      .abt-v3__left { display: flex; flex-direction: column; justify-content: center; }
      .abt-v3__text { font-family: 'Space Grotesk', sans-serif; font-size: 1.05rem; line-height: 1.8; color: #666; margin: 0 0 1.25rem; }
      .abt-v3__cta { display: inline-flex; align-items: center; gap: 0.5rem; font-family: 'Space Grotesk', sans-serif; font-size: 0.75rem; text-transform: uppercase; letter-spacing: 0.1em; color: #faf9f6; background: #1a1a1a; padding: 0.75rem 1.5rem; border-radius: 4px; text-decoration: none; margin-top: 0.5rem; transition: background 0.3s; }
      .abt-v3__cta:hover { background: #333; }
      .abt-v3__right { display: flex; flex-direction: column; }
      .abt-v3__card { flex: 1; display: flex; flex-direction: column; position: relative; border-radius: 6px; overflow: hidden; box-shadow: 0 8px 40px rgba(0,0,0,0.12); }
      .abt-v3__img { flex: 1; min-height: 280px; position: relative; overflow: hidden; }
      .abt-v3__slide { position: absolute; inset: 0; background-size: cover; background-position: center; opacity: 0; transition: opacity 0.6s ease; }
      .abt-v3__slide.active { opacity: 1; }
      .abt-v3__overlay { position: absolute; bottom: 0; left: 0; right: 0; background: linear-gradient(to top, rgba(0,0,0,0.85) 0%, rgba(0,0,0,0.6) 40%, transparent 100%); padding: 2rem 1.5rem 1rem; }
      .abt-v3__body { display: grid; margin-bottom: 0.75rem; }
      .abt-v3__item { grid-area: 1 / 1; opacity: 0; transition: opacity 0.4s ease; }
      .abt-v3__item.active { opacity: 1; }
      .abt-v3__verb { font-family: 'Space Grotesk', sans-serif; font-size: 2.5rem; font-weight: 700; color: #fff; line-height: 1; display: block; margin-bottom: 0.15rem; text-transform: uppercase; letter-spacing: -0.02em; }
      .abt-v3__noun { font-family: 'Share Tech Mono', monospace; font-size: 0.75rem; color: rgba(255,255,255,0.5); display: block; margin-bottom: 0.5rem; text-transform: uppercase; letter-spacing: 0.12em; }
      .abt-v3__body p { font-size: 0.82rem; line-height: 1.6; color: rgba(255,255,255,0.7); font-family: 'Space Grotesk', sans-serif; }
      .abt-v3__footer { display: flex; align-items: center; justify-content: space-between; }
      .abt-v3__dots { display: flex; gap: 5px; }
      .abt-v3__dot { width: 16px; height: 2px; background: rgba(255,255,255,0.25); cursor: pointer; transition: all 0.3s; }
      .abt-v3__dot.active { background: #fff; width: 28px; }
      .abt-v3__arrows { display: flex; gap: 0.25rem; }
      .abt-v3__arrows button { background: none; border: 1px solid rgba(255,255,255,0.25); border-radius: 3px; padding: 0.3rem; cursor: pointer; color: #fff; display: flex; transition: border-color 0.2s; }
      .abt-v3__arrows button:hover { border-color: #fff; }

      /* === V4: Compact Dossier === */
      .abt-v4__layout { display: grid; grid-template-columns: 1fr 1fr; gap: 4rem; align-items: stretch; }
      .abt-v4__left { display: flex; flex-direction: column; justify-content: center; }
      .abt-v4__header { display: flex; align-items: center; gap: 0.75rem; margin-bottom: 1.5rem; }
      .abt-v4__pre { font-family: 'Share Tech Mono', monospace; font-size: 0.7rem; letter-spacing: 0.15em; text-transform: uppercase; color: #999; }
      .abt-v4__sep { font-family: 'Share Tech Mono', monospace; font-size: 0.8rem; color: #ccc; }
      .abt-v4__text { font-family: 'Space Grotesk', sans-serif; font-size: 0.92rem; line-height: 1.8; color: #666; margin: 0 0 1rem; }
      .abt-v4__stats { display: grid; grid-template-columns: repeat(3, 1fr); gap: 0; border-top: 1px solid #e8e6e2; border-bottom: 1px solid #e8e6e2; margin: 1.5rem 0; }
      .abt-v4__stat { text-align: center; padding: 1rem 0.5rem; border-right: 1px solid #e8e6e2; }
      .abt-v4__stat:last-child { border-right: none; }
      .abt-v4__stat-val { display: block; font-family: 'Share Tech Mono', monospace; font-size: 1.4rem; font-weight: 700; color: #1a1a1a; margin-bottom: 0.2rem; }
      .abt-v4__stat-lbl { font-family: 'Share Tech Mono', monospace; font-size: 0.6rem; letter-spacing: 0.15em; text-transform: uppercase; color: #999; }
      .abt-v4__cta { display: inline-flex; align-items: center; gap: 0.5rem; font-family: 'Space Grotesk', sans-serif; font-size: 0.75rem; text-transform: uppercase; letter-spacing: 0.1em; color: #1a1a1a; text-decoration: none; border-bottom: 1px solid #ccc; padding-bottom: 0.25rem; transition: border-color 0.3s; }
      .abt-v4__cta:hover { border-color: #1a1a1a; }
      .abt-v4__right { display: flex; flex-direction: column; }
      .abt-v4__card { flex: 1; display: flex; flex-direction: column; border: 1px solid #d0d0d0; border-radius: 3px; overflow: hidden; background: #f5f4f2; }
      .abt-v4__card-label { font-family: 'Share Tech Mono', monospace; font-size: 0.6rem; letter-spacing: 0.2em; text-transform: uppercase; color: #999; padding: 0.6rem 1rem; border-bottom: 1px solid #d0d0d0; background: #eeedeb; }
      .abt-v4__img { height: 180px; position: relative; overflow: hidden; }
      .abt-v4__slide { position: absolute; inset: 0; background-size: cover; background-position: center; opacity: 0; transition: opacity 0.6s ease; }
      .abt-v4__slide.active { opacity: 1; }
      .abt-v4__body { flex: 1; padding: 1.25rem; display: grid; }
      .abt-v4__item { grid-area: 1 / 1; opacity: 0; transition: opacity 0.4s ease; }
      .abt-v4__item.active { opacity: 1; }
      .abt-v4__verb { font-family: 'Share Tech Mono', monospace; font-size: 1.6rem; font-weight: 400; color: #1a1a1a; line-height: 1; display: block; margin-bottom: 0.2rem; text-transform: uppercase; letter-spacing: 0.05em; }
      .abt-v4__noun { font-family: 'Share Tech Mono', monospace; font-size: 0.7rem; color: #999; display: block; margin-bottom: 0.5rem; text-transform: uppercase; letter-spacing: 0.12em; }
      .abt-v4__body p { font-size: 0.8rem; line-height: 1.6; color: #666; font-family: 'Space Grotesk', sans-serif; }
      .abt-v4__footer { display: flex; align-items: center; justify-content: space-between; padding: 0.6rem 1rem; border-top: 1px solid #d0d0d0; }
      .abt-v4__dots { display: flex; gap: 4px; }
      .abt-v4__dot { width: 4px; height: 12px; background: #d0d0d0; cursor: pointer; transition: all 0.3s; border-radius: 1px; }
      .abt-v4__dot.active { background: #1a1a1a; }
      .abt-v4__arrows { display: flex; gap: 0.25rem; }
      .abt-v4__arrows button { background: none; border: 1px solid #d0d0d0; border-radius: 3px; padding: 0.3rem; cursor: pointer; color: #1a1a1a; display: flex; transition: border-color 0.2s; }
      .abt-v4__arrows button:hover { border-color: #1a1a1a; }

      /* === V5: Full Bleed === */
      .abt-v5__layout { display: grid; grid-template-columns: 1fr 1fr; gap: 0; align-items: stretch; min-height: 500px; }
      .abt-v5__left { display: flex; flex-direction: column; justify-content: center; padding: 3rem 4rem 3rem 0; }
      .abt-v5__pre { font-family: 'Share Tech Mono', monospace; font-size: 0.65rem; letter-spacing: 0.2em; text-transform: uppercase; color: #999; display: block; margin-bottom: 1.5rem; }
      .abt-v5__text { font-family: 'Space Grotesk', sans-serif; font-size: 1rem; line-height: 1.8; color: #666; margin: 0 0 1.25rem; }
      .abt-v5__cta { display: inline-flex; align-items: center; gap: 0.5rem; font-family: 'Space Grotesk', sans-serif; font-size: 0.75rem; text-transform: uppercase; letter-spacing: 0.1em; color: #faf9f6; background: #1a1a1a; padding: 0.75rem 1.5rem; border-radius: 4px; text-decoration: none; margin-top: 0.5rem; transition: background 0.3s; }
      .abt-v5__cta:hover { background: #333; }
      .abt-v5__right { display: flex; position: relative; }
      .abt-v5__card { flex: 1; display: flex; flex-direction: column; position: relative; overflow: hidden; border-radius: 0; }
      .abt-v5__img { position: absolute; inset: 0; z-index: 0; }
      .abt-v5__slide { position: absolute; inset: 0; background-size: cover; background-position: center; opacity: 0; transition: opacity 0.6s ease; }
      .abt-v5__slide.active { opacity: 1; }
      .abt-v5__content { position: relative; z-index: 1; margin-top: auto; background: linear-gradient(to top, rgba(0,0,0,0.9) 0%, rgba(0,0,0,0.7) 50%, transparent 100%); padding: 6rem 1.5rem 1rem; }
      .abt-v5__body { display: grid; margin-bottom: 0.75rem; }
      .abt-v5__item { grid-area: 1 / 1; opacity: 0; transition: opacity 0.4s ease; }
      .abt-v5__item.active { opacity: 1; }
      .abt-v5__verb { font-family: 'Share Tech Mono', monospace; font-size: 2.2rem; font-weight: 400; color: #fff; line-height: 1; display: block; margin-bottom: 0.2rem; text-transform: uppercase; letter-spacing: 0.05em; }
      .abt-v5__noun { font-family: 'Share Tech Mono', monospace; font-size: 0.8rem; color: rgba(255,255,255,0.5); display: block; margin-bottom: 0.5rem; text-transform: uppercase; letter-spacing: 0.1em; }
      .abt-v5__body p { font-size: 0.82rem; line-height: 1.6; color: rgba(255,255,255,0.65); font-family: 'Space Grotesk', sans-serif; }
      .abt-v5__footer { display: flex; align-items: center; justify-content: space-between; padding-top: 0.75rem; border-top: 1px solid rgba(255,255,255,0.12); }
      .abt-v5__dots { display: flex; gap: 4px; }
      .abt-v5__dot { width: 4px; height: 12px; background: rgba(255,255,255,0.2); cursor: pointer; transition: all 0.3s; border-radius: 1px; }
      .abt-v5__dot.active { background: #fff; }
      .abt-v5__arrows { display: flex; gap: 0.25rem; }
      .abt-v5__arrows button { background: none; border: 1px solid rgba(255,255,255,0.2); border-radius: 3px; padding: 0.3rem; cursor: pointer; color: #fff; display: flex; transition: border-color 0.2s; }
      .abt-v5__arrows button:hover { border-color: #fff; }

      /* About Split Variations — Responsive */
      @media (max-width: 768px) {
        .abt-sec { padding: 4rem 1.5rem; }
        .abt-v1__layout, .abt-v2__layout, .abt-v3__layout, .abt-v4__layout, .abt-v5__layout { grid-template-columns: 1fr; gap: 2rem; }
        .abt-v2__left { border-radius: 4px 4px 0 0; }
        .abt-v2__card { border-radius: 0 0 4px 4px; border-left: 1px solid rgba(0,0,0,0.08); }
        .abt-v5__left { padding: 0 0 1rem; }
        .abt-v5__layout { min-height: auto; }
        .abt-v5__right { min-height: 400px; }
      }

      /* === V6: Asymmetric Sidebar === */
      .abt-v6__layout { display: grid; grid-template-columns: 1.4fr 0.6fr; gap: 3rem; align-items: stretch; }
      .abt-v6__left { display: flex; flex-direction: column; justify-content: center; }
      .abt-v6__pre { font-family: 'Share Tech Mono', monospace; font-size: 0.65rem; letter-spacing: 0.2em; text-transform: uppercase; color: #999; display: block; margin-bottom: 1.5rem; }
      .abt-v6__headline { font-family: 'Space Grotesk', sans-serif; font-size: clamp(1.4rem, 2.5vw, 2rem); font-weight: 700; text-transform: uppercase; letter-spacing: -0.01em; line-height: 1.2; margin: 0 0 1.5rem; color: #1a1a1a; }
      .abt-v6__text { font-family: 'Space Grotesk', sans-serif; font-size: 0.95rem; line-height: 1.8; color: #666; margin: 0 0 1rem; }
      .abt-v6__cta { display: inline-flex; align-items: center; gap: 0.5rem; font-family: 'Space Grotesk', sans-serif; font-size: 0.75rem; text-transform: uppercase; letter-spacing: 0.1em; color: #faf9f6; background: #1a1a1a; padding: 0.75rem 1.5rem; border-radius: 4px; text-decoration: none; margin-top: 0.5rem; transition: background 0.3s; }
      .abt-v6__cta:hover { background: #333; }
      .abt-v6__right { display: flex; flex-direction: column; }
      .abt-v6__card { flex: 1; display: flex; flex-direction: column; border: 1px solid rgba(0,0,0,0.12); border-radius: 4px; background: #e8e4df; overflow: hidden; box-shadow: 0 4px 20px rgba(0,0,0,0.08); }
      .abt-v6__card-inner { display: grid; grid-template-columns: 1fr; flex: 1; }
      .abt-v6__img { height: 160px; position: relative; overflow: hidden; }
      .abt-v6__slide { position: absolute; inset: 0; background-size: cover; background-position: center; opacity: 0; transition: opacity 0.6s ease; }
      .abt-v6__slide.active { opacity: 1; }
      .abt-v6__body { flex: 1; padding: 1rem; position: relative; display: grid; }
      .abt-v6__body::before { content: ''; position: absolute; inset: 0; background: linear-gradient(160deg, rgba(0,0,0,0.65) 0%, rgba(0,0,0,0.6) 15%, transparent 50%); pointer-events: none; z-index: 0; }
      .abt-v6__item { grid-area: 1 / 1; opacity: 0; transition: opacity 0.4s ease; position: relative; z-index: 1; }
      .abt-v6__item.active { opacity: 1; }
      .abt-v6__verb { font-family: 'Share Tech Mono', monospace; font-size: 1.8rem; font-weight: 400; color: #fff; line-height: 1; display: block; margin-bottom: 0.2rem; text-transform: uppercase; letter-spacing: 0.05em; }
      .abt-v6__noun { font-family: 'Share Tech Mono', monospace; font-size: 0.7rem; color: #e0e0e0; display: block; margin-bottom: 0.4rem; text-transform: uppercase; letter-spacing: 0.1em; }
      .abt-v6__body p { font-size: 0.78rem; line-height: 1.6; color: #4a4a4a; font-family: 'Space Grotesk', sans-serif; }
      .abt-v6__footer { display: flex; align-items: center; justify-content: space-between; padding: 0.5rem 1rem; border-top: 1px solid #e8e6e2; }
      .abt-v6__dots { display: flex; gap: 4px; }
      .abt-v6__dot { width: 4px; height: 12px; background: #d0d0d0; cursor: pointer; transition: all 0.3s; border-radius: 1px; }
      .abt-v6__dot.active { background: #1a1a1a; }
      .abt-v6__arrows { display: flex; gap: 0.25rem; }
      .abt-v6__arrows button { background: none; border: 1px solid #d0d0d0; border-radius: 3px; padding: 0.25rem; cursor: pointer; color: #1a1a1a; display: flex; transition: border-color 0.2s; }
      .abt-v6__arrows button:hover { border-color: #1a1a1a; }

      /* === V7: Framed Editorial === */
      .abt-v7__layout { display: grid; grid-template-columns: 1fr 1fr; gap: 2rem; align-items: stretch; }
      .abt-v7__left { display: flex; flex-direction: column; }
      .abt-v7__right { display: flex; flex-direction: column; }
      .abt-v7__frame { flex: 1; border: 1px solid #e8e6e2; padding: 2.5rem; display: flex; flex-direction: column; justify-content: center; }
      .abt-v7__pre { font-family: 'Share Tech Mono', monospace; font-size: 0.6rem; letter-spacing: 0.2em; text-transform: uppercase; color: #bbb; display: block; margin-bottom: 1.25rem; }
      .abt-v7__headline { font-family: 'Space Grotesk', sans-serif; font-size: clamp(1.5rem, 3vw, 2.2rem); font-weight: 700; text-transform: uppercase; letter-spacing: -0.02em; line-height: 1.15; margin: 0 0 1.25rem; color: #1a1a1a; }
      .abt-v7__rule { width: 40px; height: 2px; background: #1a1a1a; margin-bottom: 1.25rem; }
      .abt-v7__text { font-family: 'Space Grotesk', sans-serif; font-size: 0.9rem; line-height: 1.8; color: #666; margin: 0 0 1rem; }
      .abt-v7__cta { display: inline-flex; align-items: center; gap: 0.5rem; font-family: 'Space Grotesk', sans-serif; font-size: 0.75rem; text-transform: uppercase; letter-spacing: 0.1em; color: #1a1a1a; text-decoration: none; border-bottom: 1px solid #ccc; padding-bottom: 0.25rem; margin-top: 0.5rem; transition: border-color 0.3s; }
      .abt-v7__cta:hover { border-color: #1a1a1a; }
      .abt-v7__right .abt-v7__frame { padding: 0; overflow: hidden; }
      .abt-v7__card { flex: 1; display: flex; flex-direction: column; }
      .abt-v7__img { height: 200px; position: relative; overflow: hidden; }
      .abt-v7__slide { position: absolute; inset: 0; background-size: cover; background-position: center; opacity: 0; transition: opacity 0.6s ease; }
      .abt-v7__slide.active { opacity: 1; }
      .abt-v7__body { flex: 1; padding: 1.5rem; display: grid; background: #faf9f6; }
      .abt-v7__item { grid-area: 1 / 1; opacity: 0; transition: opacity 0.4s ease; }
      .abt-v7__item.active { opacity: 1; }
      .abt-v7__verb { font-family: 'Space Grotesk', sans-serif; font-size: 1.8rem; font-weight: 700; color: #1a1a1a; line-height: 1; display: block; margin-bottom: 0.25rem; text-transform: uppercase; letter-spacing: -0.02em; }
      .abt-v7__noun { font-family: 'Share Tech Mono', monospace; font-size: 0.75rem; color: #999; display: block; margin-bottom: 0.6rem; text-transform: uppercase; letter-spacing: 0.12em; }
      .abt-v7__body p { font-size: 0.82rem; line-height: 1.65; color: #555; font-family: 'Space Grotesk', sans-serif; }
      .abt-v7__footer { display: flex; align-items: center; justify-content: space-between; padding: 0.6rem 1.5rem; border-top: 1px solid #e8e6e2; background: #faf9f6; }
      .abt-v7__dots { display: flex; gap: 5px; }
      .abt-v7__dot { width: 8px; height: 3px; background: #ddd; cursor: pointer; transition: all 0.3s; border-radius: 1px; }
      .abt-v7__dot.active { background: #1a1a1a; width: 20px; }
      .abt-v7__arrows { display: flex; gap: 0.25rem; }
      .abt-v7__arrows button { background: none; border: 1px solid #e8e6e2; border-radius: 3px; padding: 0.3rem; cursor: pointer; color: #1a1a1a; display: flex; transition: border-color 0.2s; }
      .abt-v7__arrows button:hover { border-color: #1a1a1a; }

      /* === V8: Warm Tonal === */
      .abt-sec--warm { background: #f0ece6; }
      .abt-v8__layout { display: grid; grid-template-columns: 1fr 1fr; gap: 4rem; align-items: stretch; }
      .abt-v8__left { display: flex; flex-direction: column; justify-content: center; }
      .abt-v8__pre { font-family: 'Share Tech Mono', monospace; font-size: 0.65rem; letter-spacing: 0.2em; text-transform: uppercase; color: #a09080; display: block; margin-bottom: 1.5rem; }
      .abt-v8__headline { font-family: 'Space Grotesk', sans-serif; font-size: clamp(1.8rem, 3.5vw, 2.8rem); font-weight: 700; text-transform: uppercase; letter-spacing: -0.02em; line-height: 1.1; margin: 0 0 2rem; color: #2a2218; }
      .abt-v8__text { font-family: 'Space Grotesk', sans-serif; font-size: 0.95rem; line-height: 1.8; color: #6b5e50; margin: 0 0 1.25rem; }
      .abt-v8__tagline { font-family: 'Share Tech Mono', monospace; font-size: 0.68rem; letter-spacing: 0.15em; text-transform: uppercase; color: #a09080; display: block; margin: 0.5rem 0 1.5rem; padding-top: 1rem; border-top: 1px solid rgba(0,0,0,0.08); }
      .abt-v8__cta { display: inline-flex; align-items: center; gap: 0.5rem; font-family: 'Space Grotesk', sans-serif; font-size: 0.75rem; text-transform: uppercase; letter-spacing: 0.1em; color: #f0ece6; background: #2a2218; padding: 0.75rem 1.5rem; border-radius: 4px; text-decoration: none; transition: background 0.3s; }
      .abt-v8__cta:hover { background: #3d3225; }
      .abt-v8__right { display: flex; flex-direction: column; }
      .abt-v8__card { flex: 1; display: flex; flex-direction: column; border: 1px solid rgba(0,0,0,0.1); border-radius: 6px; overflow: hidden; background: #ddd5c9; box-shadow: 0 6px 30px rgba(42,34,24,0.1); }
      .abt-v8__img { height: 210px; position: relative; overflow: hidden; }
      .abt-v8__slide { position: absolute; inset: 0; background-size: cover; background-position: center; opacity: 0; transition: opacity 0.6s ease; }
      .abt-v8__slide.active { opacity: 1; }
      .abt-v8__body { flex: 1; padding: 1.25rem; position: relative; display: grid; }
      .abt-v8__body::before { content: ''; position: absolute; inset: 0; background: linear-gradient(150deg, rgba(42,34,24,0.55) 0%, rgba(42,34,24,0.45) 15%, transparent 50%); pointer-events: none; z-index: 0; }
      .abt-v8__item { grid-area: 1 / 1; opacity: 0; transition: opacity 0.4s ease; position: relative; z-index: 1; }
      .abt-v8__item.active { opacity: 1; }
      .abt-v8__verb { font-family: 'Share Tech Mono', monospace; font-size: 2rem; font-weight: 400; color: #f0ece6; line-height: 1; display: block; margin-bottom: 0.2rem; text-transform: uppercase; letter-spacing: 0.05em; }
      .abt-v8__noun { font-family: 'Share Tech Mono', monospace; font-size: 0.8rem; color: #d5cfc5; display: block; margin-bottom: 0.5rem; text-transform: uppercase; letter-spacing: 0.1em; }
      .abt-v8__body p { font-size: 0.8rem; line-height: 1.6; color: #5a5045; font-family: 'Space Grotesk', sans-serif; }
      .abt-v8__footer { display: flex; align-items: center; justify-content: space-between; padding: 0.6rem 1.25rem; border-top: 1px solid rgba(0,0,0,0.08); }
      .abt-v8__dots { display: flex; gap: 4px; }
      .abt-v8__dot { width: 4px; height: 12px; background: #c0b8a8; cursor: pointer; transition: all 0.3s; border-radius: 1px; }
      .abt-v8__dot.active { background: #2a2218; }
      .abt-v8__arrows { display: flex; gap: 0.25rem; }
      .abt-v8__arrows button { background: none; border: 1px solid #c0b8a8; border-radius: 3px; padding: 0.3rem; cursor: pointer; color: #2a2218; display: flex; transition: border-color 0.2s; }
      .abt-v8__arrows button:hover { border-color: #2a2218; }

      /* === V9: Pull Quote === */
      .abt-v9__layout { display: grid; grid-template-columns: 1fr 1fr; gap: 4rem; align-items: stretch; }
      .abt-v9__left { display: flex; flex-direction: column; justify-content: center; }
      .abt-v9__quote { font-family: 'Space Grotesk', sans-serif; font-size: clamp(1.2rem, 2vw, 1.6rem); font-weight: 300; line-height: 1.5; color: #1a1a1a; margin: 0 0 1.5rem; padding-left: 1.5rem; border-left: 3px solid #1a1a1a; font-style: italic; }
      .abt-v9__text { font-family: 'Space Grotesk', sans-serif; font-size: 0.92rem; line-height: 1.8; color: #666; margin: 0 0 1.5rem; }
      .abt-v9__author { margin-bottom: 1.5rem; padding-top: 1rem; border-top: 1px solid #e8e6e2; }
      .abt-v9__author-name { display: block; font-family: 'Space Grotesk', sans-serif; font-size: 0.85rem; font-weight: 600; color: #1a1a1a; margin-bottom: 0.15rem; }
      .abt-v9__author-title { display: block; font-family: 'Share Tech Mono', monospace; font-size: 0.65rem; letter-spacing: 0.12em; text-transform: uppercase; color: #999; }
      .abt-v9__cta { display: inline-flex; align-items: center; gap: 0.5rem; font-family: 'Space Grotesk', sans-serif; font-size: 0.75rem; text-transform: uppercase; letter-spacing: 0.1em; color: #1a1a1a; text-decoration: none; border-bottom: 1px solid #ccc; padding-bottom: 0.25rem; transition: border-color 0.3s; }
      .abt-v9__cta:hover { border-color: #1a1a1a; }
      .abt-v9__right { display: flex; flex-direction: column; }
      .abt-v9__card { flex: 1; display: flex; flex-direction: column; border: 1px solid rgba(0,0,0,0.12); border-radius: 4px; background: #e8e4df; overflow: hidden; box-shadow: 0 4px 20px rgba(0,0,0,0.08); }
      .abt-v9__img { height: 190px; position: relative; overflow: hidden; margin-bottom: -4px; z-index: 2; }
      .abt-v9__slide { position: absolute; inset: 0; background-size: cover; background-position: center; opacity: 0; transition: opacity 0.6s ease; }
      .abt-v9__slide.active { opacity: 1; }
      .abt-v9__body { flex: 1; padding: 1.25rem; position: relative; display: grid; }
      .abt-v9__body::before { content: ''; position: absolute; inset: 0; background: linear-gradient(160deg, rgba(0,0,0,0.65) 0%, rgba(0,0,0,0.6) 15%, transparent 50%); pointer-events: none; z-index: 0; }
      .abt-v9__item { grid-area: 1 / 1; opacity: 0; transition: opacity 0.4s ease; position: relative; z-index: 1; }
      .abt-v9__item.active { opacity: 1; }
      .abt-v9__verb { font-family: 'Share Tech Mono', monospace; font-size: 2rem; font-weight: 400; color: #fff; line-height: 1; display: block; margin-bottom: 0.2rem; text-transform: uppercase; letter-spacing: 0.05em; }
      .abt-v9__noun { font-family: 'Share Tech Mono', monospace; font-size: 0.8rem; color: #e0e0e0; display: block; margin-bottom: 0.5rem; text-transform: uppercase; letter-spacing: 0.1em; }
      .abt-v9__body p { font-size: 0.8rem; line-height: 1.6; color: #4a4a4a; font-family: 'Space Grotesk', sans-serif; }
      .abt-v9__footer { display: flex; align-items: center; justify-content: space-between; padding: 0.6rem 1.25rem; border-top: 1px solid #e8e6e2; }
      .abt-v9__dots { display: flex; gap: 4px; }
      .abt-v9__dot { width: 4px; height: 12px; background: #d0d0d0; cursor: pointer; transition: all 0.3s; border-radius: 1px; }
      .abt-v9__dot.active { background: #1a1a1a; }
      .abt-v9__arrows { display: flex; gap: 0.25rem; }
      .abt-v9__arrows button { background: none; border: 1px solid #d0d0d0; border-radius: 3px; padding: 0.3rem; cursor: pointer; color: #1a1a1a; display: flex; transition: border-color 0.2s; }
      .abt-v9__arrows button:hover { border-color: #1a1a1a; }

      /* === V10: Minimal Wire === */
      .abt-v10__layout { display: grid; grid-template-columns: 1fr 1fr; gap: 4rem; align-items: stretch; }
      .abt-v10__left { display: flex; flex-direction: column; justify-content: center; }
      .abt-v10__mono-head { display: flex; align-items: center; gap: 0.75rem; margin-bottom: 2rem; flex-wrap: wrap; }
      .abt-v10__mono-head span { font-family: 'Share Tech Mono', monospace; font-size: 0.65rem; letter-spacing: 0.15em; text-transform: uppercase; color: #999; }
      .abt-v10__mono-sep { width: 1px; height: 12px; background: #ddd; display: inline-block; }
      .abt-v10__text { font-family: 'Space Grotesk', sans-serif; font-size: 0.92rem; line-height: 1.8; color: #666; margin: 0 0 1rem; }
      .abt-v10__services { display: grid; grid-template-columns: 1fr 1fr; gap: 0; border: 1px solid #e8e6e2; margin: 1.5rem 0; }
      .abt-v10__svc { display: flex; align-items: center; gap: 0.75rem; padding: 0.75rem 1rem; border-bottom: 1px solid #e8e6e2; }
      .abt-v10__svc:nth-child(odd) { border-right: 1px solid #e8e6e2; }
      .abt-v10__svc:nth-child(n+3) { border-bottom: none; }
      .abt-v10__svc-num { font-family: 'Share Tech Mono', monospace; font-size: 0.6rem; color: #ccc; letter-spacing: 0.1em; }
      .abt-v10__svc span:last-child { font-family: 'Space Grotesk', sans-serif; font-size: 0.75rem; font-weight: 600; text-transform: uppercase; letter-spacing: 0.06em; color: #1a1a1a; }
      .abt-v10__cta { display: inline-flex; align-items: center; gap: 0.5rem; font-family: 'Space Grotesk', sans-serif; font-size: 0.75rem; text-transform: uppercase; letter-spacing: 0.1em; color: #1a1a1a; text-decoration: none; border-bottom: 1px solid #ccc; padding-bottom: 0.25rem; transition: border-color 0.3s; }
      .abt-v10__cta:hover { border-color: #1a1a1a; }
      .abt-v10__right { display: flex; flex-direction: column; }
      .abt-v10__card { flex: 1; display: flex; flex-direction: column; border: 1px solid #e8e6e2; overflow: hidden; background: #fff; }
      .abt-v10__img { height: 180px; position: relative; overflow: hidden; border-bottom: 1px solid #e8e6e2; }
      .abt-v10__slide { position: absolute; inset: 0; background-size: cover; background-position: center; opacity: 0; transition: opacity 0.6s ease; filter: grayscale(0.3); }
      .abt-v10__slide.active { opacity: 1; }
      .abt-v10__body { flex: 1; padding: 1.25rem; display: grid; }
      .abt-v10__item { grid-area: 1 / 1; opacity: 0; transition: opacity 0.4s ease; }
      .abt-v10__item.active { opacity: 1; }
      .abt-v10__verb { font-family: 'Share Tech Mono', monospace; font-size: 1.6rem; font-weight: 400; color: #1a1a1a; line-height: 1; display: block; margin-bottom: 0.2rem; text-transform: uppercase; letter-spacing: 0.08em; }
      .abt-v10__noun { font-family: 'Share Tech Mono', monospace; font-size: 0.7rem; color: #aaa; display: block; margin-bottom: 0.5rem; text-transform: uppercase; letter-spacing: 0.15em; }
      .abt-v10__body p { font-size: 0.8rem; line-height: 1.6; color: #888; font-family: 'Share Tech Mono', monospace; }
      .abt-v10__footer { display: flex; align-items: center; justify-content: space-between; padding: 0.6rem 1.25rem; border-top: 1px solid #e8e6e2; }
      .abt-v10__dots { display: flex; gap: 3px; }
      .abt-v10__dot { width: 3px; height: 14px; background: #e8e6e2; cursor: pointer; transition: all 0.3s; }
      .abt-v10__dot.active { background: #1a1a1a; }
      .abt-v10__arrows { display: flex; gap: 0.25rem; }
      .abt-v10__arrows button { background: none; border: 1px solid #e8e6e2; padding: 0.3rem; cursor: pointer; color: #1a1a1a; display: flex; transition: border-color 0.2s; }
      .abt-v10__arrows button:hover { border-color: #1a1a1a; }

      /* V6-V10 Responsive */
      @media (max-width: 768px) {
        .abt-v6__layout, .abt-v7__layout, .abt-v8__layout, .abt-v9__layout, .abt-v10__layout { grid-template-columns: 1fr; gap: 2rem; }
        .abt-v6__layout { grid-template-columns: 1fr; }
        .abt-v10__services { grid-template-columns: 1fr; }
        .abt-v10__svc:nth-child(odd) { border-right: none; }
        .abt-v10__svc:nth-child(n+3) { border-bottom: 1px solid #e8e6e2; }
        .abt-v10__svc:last-child { border-bottom: none; }
      }

        /* ================================================================
           HERO VARIATIONS — 10 Alternatives
           ================================================================ */
        .hero-sec { margin-bottom: 4rem; }
        .hero-sec > div { height: calc(100vh - 49px) !important; min-height: unset !important; max-height: calc(100vh - 49px); overflow: hidden; }
        .hero-sec__label {
          display: block;
          font-family: 'Share Tech Mono', monospace;
          font-size: 0.6rem;
          text-transform: uppercase;
          letter-spacing: 0.2em;
          color: #999;
          text-align: center;
          padding: 1rem 0;
          border-bottom: 1px solid #e8e6e2;
          margin-bottom: 0;
        }

        /* ===== V1: Cinematic Split ===== */
        .hv1 { position: relative; height: 85vh; min-height: 500px; overflow: hidden; background: #0a0a0a; }
        .hv1__bg-img { position: absolute; inset: 0; background-size: cover; background-position: center; opacity: 0; transition: opacity 1s ease; }
        .hv1__bg-img.active { opacity: 1; }
        .hv1__overlay { position: absolute; inset: 0; background: linear-gradient(105deg, rgba(0,0,0,0.85) 0%, rgba(0,0,0,0.5) 50%, rgba(0,0,0,0.2) 100%); z-index: 1; }
        .hv1__content { position: relative; z-index: 2; height: 100%; display: flex; align-items: center; max-width: 1200px; margin: 0 auto; padding: 0 3rem; }
        .hv1__left { flex: 1; }
        .hv1__right { width: 120px; display: flex; flex-direction: column; align-items: flex-end; }
        .hv1__coords { font-family: 'Share Tech Mono', monospace; font-size: 0.6rem; letter-spacing: 0.15em; color: rgba(255,255,255,0.35); display: block; margin-bottom: 2rem; }
        .hv1__pre { font-family: 'Share Tech Mono', monospace; font-size: 0.7rem; text-transform: uppercase; letter-spacing: 0.25em; color: rgba(255,255,255,0.5); display: block; margin-bottom: 1rem; }
        .hv1__headline { font-family: 'Space Grotesk', sans-serif; font-size: clamp(2.5rem, 6vw, 5rem); font-weight: 700; text-transform: uppercase; line-height: 1; letter-spacing: -0.02em; margin: 0 0 1.5rem; display: flex; flex-wrap: wrap; gap: 0.3em; }
        .hv1__word--1 { color: #fff; }
        .hv1__word--2 { color: rgba(255,255,255,0.6); }
        .hv1__word--3 { color: rgba(255,255,255,0.35); }
        .hv1__desc { font-family: 'Space Grotesk', sans-serif; font-size: 1rem; color: rgba(255,255,255,0.5); line-height: 1.6; max-width: 450px; margin-bottom: 2.5rem; }
        .hv1__cta { display: inline-flex; align-items: center; gap: 0.5rem; padding: 0.9rem 1.8rem; font-family: 'Space Grotesk', sans-serif; font-size: 0.7rem; font-weight: 600; text-transform: uppercase; letter-spacing: 0.08em; text-decoration: none; background: #fff; color: #0a0a0a; border-radius: 4px; transition: all 0.3s; }
        .hv1__cta:hover { background: #e0e0e0; }
        .hv1__counter { text-align: right; }
        .hv1__counter-current { font-family: 'Space Grotesk', sans-serif; font-size: 3rem; font-weight: 700; color: #fff; display: block; line-height: 1; }
        .hv1__counter-sep { font-family: 'Share Tech Mono', monospace; font-size: 0.8rem; color: rgba(255,255,255,0.3); }
        .hv1__counter-total { font-family: 'Share Tech Mono', monospace; font-size: 0.8rem; color: rgba(255,255,255,0.3); }
        .hv1__dots { position: absolute; bottom: 2rem; left: 50%; transform: translateX(-50%); display: flex; gap: 0.5rem; z-index: 3; }
        .hv1__dot { width: 40px; height: 3px; background: rgba(255,255,255,0.2); border: none; cursor: pointer; transition: all 0.3s; padding: 0; }
        .hv1__dot.active { background: #fff; }

        /* ===== V2: Instrument Panel ===== */
        .hv2 { position: relative; min-height: 85vh; background: #faf9f6; border: 1px solid #e8e6e2; overflow: hidden; display: flex; flex-direction: column; }
        .hv2__grid { position: absolute; inset: 0; pointer-events: none; z-index: 0; }
        .hv2__grid-line { position: absolute; background: #e8e6e2; }
        .hv2__grid-line--v1 { top: 0; bottom: 0; left: 5%; width: 1px; }
        .hv2__grid-line--v2 { top: 0; bottom: 0; left: 50%; width: 1px; }
        .hv2__grid-line--v3 { top: 0; bottom: 0; right: 5%; width: 1px; }
        .hv2__grid-line--h1 { left: 0; right: 0; top: 15%; height: 1px; }
        .hv2__grid-line--h2 { left: 0; right: 0; bottom: 15%; height: 1px; }
        .hv2__top-bar { display: flex; justify-content: space-between; align-items: center; padding: 1.25rem 3rem; border-bottom: 1px solid #e8e6e2; position: relative; z-index: 1; }
        .hv2__logo { font-family: 'Space Grotesk', sans-serif; font-size: 0.85rem; font-weight: 700; text-transform: uppercase; letter-spacing: 0.05em; color: #1a1a1a; }
        .hv2__datum { font-family: 'Share Tech Mono', monospace; font-size: 0.6rem; letter-spacing: 0.15em; color: #999; text-transform: uppercase; }
        .hv2__center { flex: 1; display: flex; align-items: center; justify-content: center; gap: 4rem; padding: 3rem; position: relative; z-index: 1; }
        .hv2__readout { text-align: center; }
        .hv2__readout-label { font-family: 'Share Tech Mono', monospace; font-size: 0.5rem; text-transform: uppercase; letter-spacing: 0.2em; color: #bbb; display: block; margin-bottom: 0.3rem; }
        .hv2__readout-num { font-family: 'Space Grotesk', sans-serif; font-size: 3.5rem; font-weight: 700; color: #1a1a1a; line-height: 1; }
        .hv2__text { text-align: center; max-width: 500px; }
        .hv2__pre { font-family: 'Share Tech Mono', monospace; font-size: 0.65rem; text-transform: uppercase; letter-spacing: 0.25em; color: #999; display: block; margin-bottom: 1rem; }
        .hv2__headline { font-family: 'Space Grotesk', sans-serif; font-size: clamp(2rem, 4.5vw, 3.5rem); font-weight: 700; text-transform: uppercase; line-height: 1.05; letter-spacing: -0.02em; color: #1a1a1a; margin: 0 0 1rem; }
        .hv2__desc { font-family: 'Space Grotesk', sans-serif; font-size: 0.9rem; color: #666; line-height: 1.6; margin: 0; }
        .hv2__img-strip { display: flex; gap: 0.5rem; padding: 0 3rem; position: relative; z-index: 1; }
        .hv2__thumb { flex: 1; height: 120px; background-size: cover; background-position: center; border: 1px solid #e8e6e2; opacity: 0.4; transition: all 0.4s; cursor: pointer; }
        .hv2__thumb.active { opacity: 1; border-color: #1a1a1a; }
        .hv2__bottom-bar { display: flex; justify-content: space-between; align-items: center; padding: 1.25rem 3rem; border-top: 1px solid #e8e6e2; position: relative; z-index: 1; margin-top: 1.5rem; }
        .hv2__coord { font-family: 'Share Tech Mono', monospace; font-size: 0.6rem; letter-spacing: 0.15em; color: #bbb; }
        .hv2__nav { display: flex; gap: 0.25rem; }
        .hv2__nav-btn { all: unset; font-family: 'Share Tech Mono', monospace; font-size: 0.6rem; letter-spacing: 0.05em; padding: 0.4rem 0.75rem; border: 1px solid #e8e6e2; cursor: pointer; color: #999; transition: all 0.3s; }
        .hv2__nav-btn.active { background: #1a1a1a; color: #fff; border-color: #1a1a1a; }

        /* ===== V3: Full Bleed Takeover ===== */
        .hv3 { position: relative; height: 90vh; min-height: 550px; overflow: hidden; }
        .hv3__bg-img { position: absolute; inset: 0; background-size: cover; background-position: center; opacity: 0; transition: opacity 1.2s ease; }
        .hv3__bg-img.active { opacity: 1; }
        .hv3__overlay { position: absolute; inset: 0; background: rgba(0,0,0,0.45); z-index: 1; }
        .hv3__content { position: absolute; inset: 0; z-index: 2; display: flex; flex-direction: column; align-items: center; justify-content: center; text-align: center; padding: 3rem; }
        .hv3__pre { font-family: 'Share Tech Mono', monospace; font-size: 0.7rem; text-transform: uppercase; letter-spacing: 0.3em; color: rgba(255,255,255,0.5); margin-bottom: 1.5rem; }
        .hv3__headline { font-family: 'Space Grotesk', sans-serif; font-size: clamp(3rem, 8vw, 6rem); font-weight: 700; text-transform: uppercase; line-height: 0.95; letter-spacing: -0.03em; margin: 0 0 1.5rem; }
        .hv3__word--1 { color: #fff; }
        .hv3__word--2 { color: rgba(255,255,255,0.6); }
        .hv3__word--3 { color: rgba(255,255,255,0.35); }
        .hv3__desc { font-family: 'Space Grotesk', sans-serif; font-size: 1.1rem; color: rgba(255,255,255,0.6); max-width: 500px; margin-bottom: 2.5rem; line-height: 1.6; }
        .hv3__actions { display: flex; gap: 1rem; }
        .hv3__cta { padding: 1rem 2rem; font-family: 'Space Grotesk', sans-serif; font-size: 0.7rem; font-weight: 600; text-transform: uppercase; letter-spacing: 0.1em; text-decoration: none; background: #fff; color: #0a0a0a; border: 2px solid #fff; transition: all 0.3s; }
        .hv3__cta--outline { background: transparent; color: #fff; border-color: rgba(255,255,255,0.4); }
        .hv3__cta--outline:hover { border-color: #fff; background: rgba(255,255,255,0.1); }
        .hv3__footer { position: absolute; bottom: 0; left: 0; right: 0; z-index: 3; display: flex; justify-content: space-between; align-items: center; padding: 1.5rem 3rem; }
        .hv3__coords { font-family: 'Share Tech Mono', monospace; font-size: 0.6rem; letter-spacing: 0.15em; color: rgba(255,255,255,0.3); }
        .hv3__progress { display: flex; gap: 0.4rem; }
        .hv3__bar { width: 40px; height: 3px; background: rgba(255,255,255,0.2); transition: background 0.3s; }
        .hv3__bar.active { background: #fff; }
        .hv3__scroll { font-family: 'Share Tech Mono', monospace; font-size: 0.6rem; letter-spacing: 0.15em; color: rgba(255,255,255,0.3); text-transform: uppercase; }

        /* ===== V4: Editorial Masthead ===== */
        .hv4 { background: #faf9f6; min-height: 80vh; display: flex; flex-direction: column; }
        .hv4__masthead { display: flex; align-items: center; gap: 1.5rem; padding: 1.5rem 3rem; border-bottom: 1px solid #e8e6e2; }
        .hv4__masthead-line { flex: 1; height: 1px; background: #e8e6e2; }
        .hv4__masthead-text { font-family: 'Space Grotesk', sans-serif; font-size: 0.7rem; font-weight: 700; text-transform: uppercase; letter-spacing: 0.15em; color: #1a1a1a; white-space: nowrap; }
        .hv4__body { flex: 1; display: grid; grid-template-columns: 1fr 1.2fr 0.8fr; min-height: 0; }
        .hv4__col { padding: 3rem; display: flex; flex-direction: column; }
        .hv4__col--left { border-right: 1px solid #e8e6e2; }
        .hv4__col--center { align-items: center; text-align: center; justify-content: center; }
        .hv4__col--right { border-left: 1px solid #e8e6e2; }
        .hv4__img-frame { flex: 1; position: relative; overflow: hidden; min-height: 300px; }
        .hv4__img { position: absolute; inset: 0; background-size: cover; background-position: center; opacity: 0; transition: opacity 0.8s ease; }
        .hv4__img.active { opacity: 1; }
        .hv4__edition { font-family: 'Share Tech Mono', monospace; font-size: 0.55rem; text-transform: uppercase; letter-spacing: 0.25em; color: #999; margin-bottom: 2rem; }
        .hv4__headline { font-family: 'Space Grotesk', sans-serif; font-size: clamp(1.8rem, 3.5vw, 2.8rem); font-weight: 700; text-transform: uppercase; line-height: 1.05; letter-spacing: -0.02em; color: #1a1a1a; margin: 0 0 1.5rem; }
        .hv4__rule { width: 40px; height: 2px; background: #1a1a1a; margin: 0 auto 1.5rem; }
        .hv4__desc { font-family: 'Space Grotesk', sans-serif; font-size: 0.9rem; color: #666; line-height: 1.7; max-width: 380px; margin-bottom: 2rem; }
        .hv4__nav { display: flex; gap: 0.5rem; justify-content: center; margin-bottom: 2rem; }
        .hv4__dot { width: 8px; height: 8px; border-radius: 50%; border: 1px solid #ccc; background: transparent; cursor: pointer; padding: 0; transition: all 0.3s; }
        .hv4__dot.active { background: #1a1a1a; border-color: #1a1a1a; }
        .hv4__cta { font-family: 'Space Grotesk', sans-serif; font-size: 0.7rem; font-weight: 600; text-transform: uppercase; letter-spacing: 0.08em; text-decoration: none; color: #1a1a1a; border-bottom: 1px solid #ccc; padding-bottom: 0.25rem; transition: border-color 0.3s; }
        .hv4__cta:hover { border-color: #1a1a1a; }
        .hv4__sidebar { display: flex; flex-direction: column; gap: 0; }
        .hv4__sidebar-label { font-family: 'Share Tech Mono', monospace; font-size: 0.55rem; text-transform: uppercase; letter-spacing: 0.25em; color: #bbb; margin-bottom: 1.5rem; }
        .hv4__sidebar-item { font-family: 'Space Grotesk', sans-serif; font-size: 0.8rem; font-weight: 500; text-transform: uppercase; letter-spacing: 0.05em; color: #1a1a1a; padding: 1rem 0; border-bottom: 1px solid #e8e6e2; }

        /* ===== V5: Parallax Cards ===== */
        .hv5 { position: relative; min-height: 80vh; background: #faf9f6; display: flex; flex-direction: column; align-items: center; justify-content: center; padding: 4rem 2rem; overflow: hidden; }
        .hv5__cards { position: absolute; inset: 0; display: flex; gap: 1rem; padding: 2rem; opacity: 0.15; }
        .hv5__card { flex: 1; background-size: cover; background-position: center; border-radius: 8px; position: relative; transition: opacity 0.6s; }
        .hv5__card.active { opacity: 1; }
        .hv5__card-overlay { position: absolute; inset: 0; background: rgba(0,0,0,0.3); border-radius: 8px; }
        .hv5__center { position: relative; z-index: 2; text-align: center; max-width: 600px; }
        .hv5__badge { font-family: 'Share Tech Mono', monospace; font-size: 0.55rem; text-transform: uppercase; letter-spacing: 0.2em; color: #999; border: 1px solid #e8e6e2; padding: 0.4rem 1rem; display: inline-block; margin-bottom: 2rem; border-radius: 2px; }
        .hv5__pre { font-family: 'Share Tech Mono', monospace; font-size: 0.65rem; text-transform: uppercase; letter-spacing: 0.25em; color: #999; display: block; margin-bottom: 1rem; }
        .hv5__headline { font-family: 'Space Grotesk', sans-serif; font-size: clamp(2.5rem, 5.5vw, 4.5rem); font-weight: 700; text-transform: uppercase; line-height: 1; letter-spacing: -0.02em; margin: 0 0 1.5rem; display: flex; flex-wrap: wrap; gap: 0.2em; justify-content: center; }
        .hv5__word--1 { color: #1a1a1a; }
        .hv5__word--2 { color: #4a4a4a; }
        .hv5__word--3 { color: #7a7a7a; }
        .hv5__desc { font-family: 'Space Grotesk', sans-serif; font-size: 1rem; color: #666; line-height: 1.6; margin-bottom: 2rem; }
        .hv5__dots { display: flex; gap: 0.5rem; justify-content: center; }
        .hv5__dot { width: 8px; height: 8px; border-radius: 50%; border: 1px solid #ccc; background: transparent; cursor: pointer; padding: 0; transition: all 0.3s; }
        .hv5__dot.active { background: #1a1a1a; border-color: #1a1a1a; }

        /* ===== V6: Dossier Briefing ===== */
        .hv6 { background: #f5f4f1; border: 1px solid #e8e6e2; font-family: 'Share Tech Mono', monospace; }
        .hv6__header { display: flex; justify-content: space-between; align-items: center; padding: 1rem 2rem; border-bottom: 2px solid #1a1a1a; }
        .hv6__class { font-size: 0.6rem; text-transform: uppercase; letter-spacing: 0.2em; color: #1a1a1a; font-weight: 700; }
        .hv6__ref { font-size: 0.55rem; letter-spacing: 0.15em; color: #999; }
        .hv6__body { display: grid; grid-template-columns: 1fr 1fr; min-height: 450px; }
        .hv6__left { padding: 2.5rem; border-right: 1px solid #e8e6e2; display: flex; flex-direction: column; gap: 1.5rem; }
        .hv6__right { padding: 2.5rem; display: flex; flex-direction: column; }
        .hv6__field { }
        .hv6__field-label { display: block; font-size: 0.5rem; text-transform: uppercase; letter-spacing: 0.2em; color: #999; margin-bottom: 0.4rem; }
        .hv6__field-value { font-family: 'Space Grotesk', sans-serif; font-size: 0.85rem; color: #1a1a1a; line-height: 1.5; margin: 0; }
        .hv6__field-value--large { font-size: clamp(1.5rem, 3vw, 2.2rem); font-weight: 700; text-transform: uppercase; letter-spacing: -0.01em; line-height: 1.1; }
        .hv6__field-row { display: flex; gap: 2rem; padding-top: 1rem; border-top: 1px solid #e8e6e2; }
        .hv6__img-wrap { flex: 1; position: relative; border: 1px solid #e8e6e2; overflow: hidden; min-height: 300px; }
        .hv6__img { position: absolute; inset: 0; background-size: cover; background-position: center; opacity: 0; transition: opacity 0.8s; }
        .hv6__img.active { opacity: 1; }
        .hv6__img-label { font-size: 0.5rem; text-transform: uppercase; letter-spacing: 0.2em; color: #999; margin-top: 0.75rem; display: block; }
        .hv6__cta { display: inline-flex; align-items: center; gap: 0.5rem; padding: 0.7rem 1.3rem; font-family: 'Space Grotesk', sans-serif; font-size: 0.65rem; font-weight: 600; text-transform: uppercase; letter-spacing: 0.06em; text-decoration: none; background: #1a1a1a; color: #faf9f6; border-radius: 4px; transition: all 0.3s; align-self: flex-start; margin-top: auto; }
        .hv6__cta:hover { background: #333; }
        .hv6__footer { display: flex; border-top: 2px solid #1a1a1a; }
        .hv6__tab { all: unset; flex: 1; padding: 0.9rem 1.5rem; font-family: 'Share Tech Mono', monospace; font-size: 0.55rem; text-transform: uppercase; letter-spacing: 0.1em; color: #999; cursor: pointer; border-right: 1px solid #e8e6e2; text-align: center; transition: all 0.3s; }
        .hv6__tab:last-child { border-right: none; }
        .hv6__tab.active { background: #1a1a1a; color: #fff; }
        .hv6__tab:hover:not(.active) { background: #e8e6e2; }

        /* ===== V7: Vertical Scroll ===== */
        .hv7 { position: relative; height: 85vh; min-height: 500px; overflow: hidden; }
        .hv7__bg-img { position: absolute; inset: 0; background-size: cover; background-position: center; opacity: 0; transition: opacity 1s ease; }
        .hv7__bg-img.active { opacity: 1; }
        .hv7__overlay { position: absolute; inset: 0; background: rgba(0,0,0,0.55); z-index: 1; }
        .hv7__side { position: absolute; left: 2.5rem; top: 50%; transform: translateY(-50%); z-index: 3; display: flex; flex-direction: column; align-items: center; gap: 1rem; }
        .hv7__side-text { font-family: 'Share Tech Mono', monospace; font-size: 0.55rem; text-transform: uppercase; letter-spacing: 0.2em; color: rgba(255,255,255,0.35); writing-mode: vertical-rl; text-orientation: mixed; }
        .hv7__side-line { width: 1px; height: 60px; background: rgba(255,255,255,0.15); }
        .hv7__center { position: relative; z-index: 2; height: 100%; display: flex; align-items: center; justify-content: center; }
        .hv7__slide { position: absolute; text-align: center; opacity: 0; transform: translateY(30px); transition: all 0.6s ease; max-width: 600px; padding: 0 2rem; }
        .hv7__slide.active { opacity: 1; transform: translateY(0); }
        .hv7__num { font-family: 'Space Grotesk', sans-serif; font-size: 5rem; font-weight: 700; color: rgba(255,255,255,0.08); display: block; line-height: 1; margin-bottom: -1rem; }
        .hv7__pre { font-family: 'Share Tech Mono', monospace; font-size: 0.65rem; text-transform: uppercase; letter-spacing: 0.25em; color: rgba(255,255,255,0.45); display: block; margin-bottom: 1rem; }
        .hv7__headline { font-family: 'Space Grotesk', sans-serif; font-size: clamp(2rem, 5vw, 3.5rem); font-weight: 700; text-transform: uppercase; line-height: 1.05; letter-spacing: -0.02em; color: #fff; margin: 0 0 1rem; }
        .hv7__desc { font-family: 'Space Grotesk', sans-serif; font-size: 0.95rem; color: rgba(255,255,255,0.5); line-height: 1.6; }
        .hv7__track { position: absolute; right: 2.5rem; top: 50%; transform: translateY(-50%); z-index: 3; display: flex; flex-direction: column; gap: 0.75rem; }
        .hv7__tick { width: 3px; height: 30px; background: rgba(255,255,255,0.15); cursor: pointer; transition: all 0.3s; }
        .hv7__tick.active { background: #fff; height: 50px; }

        /* ===== V8: Asymmetric Magazine ===== */
        .hv8 { display: grid; grid-template-columns: 1.2fr 1fr; min-height: 80vh; background: #faf9f6; }
        .hv8__left { position: relative; overflow: hidden; min-height: 500px; }
        .hv8__img-stack { position: relative; height: 100%; }
        .hv8__img { position: absolute; inset: 0; background-size: cover; background-position: center; opacity: 0; transition: opacity 0.8s ease; }
        .hv8__img.active { opacity: 1; }
        .hv8__right { padding: 4rem 3rem; display: flex; flex-direction: column; justify-content: center; }
        .hv8__tag { display: flex; align-items: center; gap: 0.75rem; margin-bottom: 2rem; }
        .hv8__tag span { font-family: 'Share Tech Mono', monospace; font-size: 0.55rem; letter-spacing: 0.12em; color: #999; text-transform: uppercase; }
        .hv8__tag-sep { color: #e8e6e2 !important; }
        .hv8__pre { font-family: 'Share Tech Mono', monospace; font-size: 0.65rem; text-transform: uppercase; letter-spacing: 0.25em; color: #999; display: block; margin-bottom: 1rem; }
        .hv8__headline { font-family: 'Space Grotesk', sans-serif; font-size: clamp(2rem, 4vw, 3.2rem); font-weight: 700; text-transform: uppercase; line-height: 1.05; letter-spacing: -0.02em; margin: 0 0 1.5rem; display: flex; flex-wrap: wrap; gap: 0.2em; }
        .hv8__word--1 { color: #1a1a1a; }
        .hv8__word--2 { color: #4a4a4a; }
        .hv8__word--3 { color: #7a7a7a; }
        .hv8__desc { font-family: 'Space Grotesk', sans-serif; font-size: 0.95rem; color: #666; line-height: 1.7; max-width: 420px; margin-bottom: 2rem; }
        .hv8__meta { display: flex; gap: 1.5rem; margin-bottom: 2.5rem; }
        .hv8__meta span { font-family: 'Share Tech Mono', monospace; font-size: 0.55rem; text-transform: uppercase; letter-spacing: 0.1em; color: #999; }
        .hv8__cta { display: inline-flex; align-items: center; gap: 0.5rem; padding: 0.9rem 1.8rem; font-family: 'Space Grotesk', sans-serif; font-size: 0.7rem; font-weight: 600; text-transform: uppercase; letter-spacing: 0.08em; text-decoration: none; background: #1a1a1a; color: #faf9f6; border-radius: 4px; transition: all 0.3s; align-self: flex-start; margin-bottom: 2rem; }
        .hv8__cta:hover { background: #333; }
        .hv8__dots { display: flex; gap: 0.5rem; }
        .hv8__dot { width: 40px; height: 3px; background: #e0e0e0; border: none; cursor: pointer; padding: 0; transition: all 0.3s; }
        .hv8__dot.active { background: #1a1a1a; }

        /* ===== V9: Ticker Poster ===== */
        .hv9 { position: relative; height: 90vh; min-height: 550px; overflow: hidden; }
        .hv9__bg-img { position: absolute; inset: 0; background-size: cover; background-position: center; opacity: 0; transition: opacity 1s ease; }
        .hv9__bg-img.active { opacity: 1; }
        .hv9__overlay { position: absolute; inset: 0; background: rgba(0,0,0,0.5); z-index: 1; }
        .hv9__ticker { position: absolute; left: 0; right: 0; z-index: 3; overflow: hidden; padding: 0.75rem 0; border-top: 1px solid rgba(255,255,255,0.1); border-bottom: 1px solid rgba(255,255,255,0.1); }
        .hv9__ticker:first-of-type { top: 0; }
        .hv9__ticker--bottom { bottom: 0; top: auto; }
        .hv9__ticker-track { display: flex; white-space: nowrap; animation: hv9Scroll 30s linear infinite; }
        .hv9__ticker-track--reverse { animation-direction: reverse; }
        .hv9__ticker-text { font-family: 'Share Tech Mono', monospace; font-size: 0.6rem; text-transform: uppercase; letter-spacing: 0.2em; color: rgba(255,255,255,0.3); flex-shrink: 0; }
        @keyframes hv9Scroll { 0% { transform: translateX(0); } 100% { transform: translateX(-33.33%); } }
        .hv9__center { position: relative; z-index: 2; height: 100%; display: flex; flex-direction: column; align-items: center; justify-content: center; text-align: center; padding: 3rem; }
        .hv9__headline { font-family: 'Space Grotesk', sans-serif; font-size: clamp(3.5rem, 9vw, 7rem); font-weight: 700; text-transform: uppercase; line-height: 0.9; letter-spacing: -0.03em; margin: 0 0 1.5rem; }
        .hv9__word--1 { color: #fff; }
        .hv9__word--2 { color: rgba(255,255,255,0.55); }
        .hv9__word--3 { color: rgba(255,255,255,0.3); }
        .hv9__desc { font-family: 'Space Grotesk', sans-serif; font-size: 1rem; color: rgba(255,255,255,0.5); max-width: 450px; margin-bottom: 2.5rem; line-height: 1.6; }
        .hv9__nav { display: flex; align-items: center; gap: 1.5rem; }
        .hv9__arrow { all: unset; font-family: 'Space Grotesk', sans-serif; font-size: 1.2rem; color: rgba(255,255,255,0.4); cursor: pointer; transition: color 0.2s; padding: 0.5rem; }
        .hv9__arrow:hover { color: #fff; }
        .hv9__counter { font-family: 'Share Tech Mono', monospace; font-size: 0.7rem; letter-spacing: 0.15em; color: rgba(255,255,255,0.4); }

        /* ===== V10: Minimal Wire ===== */
        .hv10 { position: relative; min-height: 80vh; background: #faf9f6; padding: 4rem 0; overflow: hidden; }
        .hv10__wire { position: absolute; left: 0; right: 0; height: 1px; background: #e8e6e2; }
        .hv10__wire--top { top: 15%; }
        .hv10__wire--mid { top: 50%; }
        .hv10__wire--bot { top: 85%; }
        .hv10__layout { position: relative; z-index: 1; display: grid; grid-template-columns: 1fr 1fr; gap: 4rem; max-width: 1200px; margin: 0 auto; padding: 0 3rem; align-items: center; min-height: 65vh; }
        .hv10__left { display: flex; flex-direction: column; }
        .hv10__mono { font-family: 'Share Tech Mono', monospace; font-size: 0.65rem; text-transform: uppercase; letter-spacing: 0.15em; color: #1a1a1a; display: block; line-height: 1.8; }
        .hv10__mono--muted { color: #999; }
        .hv10__rule { width: 40px; height: 1px; background: #1a1a1a; margin: 1.5rem 0; }
        .hv10__pre { font-family: 'Share Tech Mono', monospace; font-size: 0.65rem; text-transform: uppercase; letter-spacing: 0.25em; color: #999; display: block; margin-bottom: 0.75rem; }
        .hv10__headline { font-family: 'Space Grotesk', sans-serif; font-size: clamp(2rem, 4.5vw, 3.5rem); font-weight: 700; text-transform: uppercase; line-height: 1.05; letter-spacing: -0.02em; margin: 0 0 1.25rem; display: flex; flex-wrap: wrap; gap: 0.2em; }
        .hv10__word--1 { color: #1a1a1a; }
        .hv10__word--2 { color: #4a4a4a; }
        .hv10__word--3 { color: #7a7a7a; }
        .hv10__desc { font-family: 'Space Grotesk', sans-serif; font-size: 0.95rem; color: #666; line-height: 1.7; max-width: 420px; margin-bottom: 2rem; }
        .hv10__services { display: flex; flex-direction: column; gap: 0; margin-bottom: 2rem; }
        .hv10__services span { font-family: 'Share Tech Mono', monospace; font-size: 0.6rem; text-transform: uppercase; letter-spacing: 0.1em; color: #999; padding: 0.6rem 0; border-bottom: 1px solid #e8e6e2; }
        .hv10__cta { display: inline-flex; align-items: center; gap: 0.5rem; padding: 0.9rem 1.8rem; font-family: 'Space Grotesk', sans-serif; font-size: 0.7rem; font-weight: 600; text-transform: uppercase; letter-spacing: 0.08em; text-decoration: none; background: #1a1a1a; color: #faf9f6; border-radius: 4px; transition: all 0.3s; align-self: flex-start; }
        .hv10__cta:hover { background: #333; }
        .hv10__right { position: relative; }
        .hv10__img-frame { position: relative; overflow: hidden; border-radius: 4px; aspect-ratio: 4/3; }
        .hv10__img { position: absolute; inset: 0; background-size: cover; background-position: center; opacity: 0; transition: opacity 0.8s ease; }
        .hv10__img.active { opacity: 1; }
        .hv10__img-border { position: absolute; inset: 8px; border: 1px solid rgba(255,255,255,0.25); border-radius: 2px; pointer-events: none; }
        .hv10__dots { display: flex; gap: 0.5rem; margin-top: 1.25rem; }
        .hv10__dot { width: 40px; height: 3px; background: #e0e0e0; border: none; cursor: pointer; padding: 0; transition: all 0.3s; }
        .hv10__dot.active { background: #1a1a1a; }
        .hv10__coords { position: absolute; bottom: 2rem; left: 50%; transform: translateX(-50%); display: flex; gap: 2rem; z-index: 1; }
        .hv10__coords span { font-family: 'Share Tech Mono', monospace; font-size: 0.6rem; letter-spacing: 0.15em; color: #bbb; }

        @media (max-width: 768px) {
          .hv1__content { flex-direction: column; text-align: center; }
          .hv1__right { width: auto; align-items: center; margin-top: 2rem; }
          .hv2__center { flex-direction: column; gap: 2rem; }
          .hv2__img-strip { flex-direction: column; }
          .hv4__body { grid-template-columns: 1fr; }
          .hv4__col--left { border-right: none; border-bottom: 1px solid #e8e6e2; }
          .hv4__col--right { border-left: none; border-top: 1px solid #e8e6e2; }
          .hv6__body { grid-template-columns: 1fr; }
          .hv6__left { border-right: none; border-bottom: 1px solid #e8e6e2; }
          .hv8 { grid-template-columns: 1fr; }
          .hv8__left { min-height: 300px; }
          .hv10__layout { grid-template-columns: 1fr; }
        }


        /* ===== V11: Horizon Line ===== */
        .hv11 { display: flex; flex-direction: column; min-height: 80vh; }
        .hv11__top { position: relative; flex: 1; min-height: 350px; overflow: hidden; }
        .hv11__bg-img { position: absolute; inset: 0; background-size: cover; background-position: center; opacity: 0; transition: opacity 1s ease; }
        .hv11__bg-img.active { opacity: 1; }
        .hv11__overlay { position: absolute; inset: 0; background: linear-gradient(to bottom, rgba(0,0,0,0.3), rgba(0,0,0,0.6)); z-index: 1; }
        .hv11__top-content { position: relative; z-index: 2; height: 100%; display: flex; flex-direction: column; justify-content: flex-end; padding: 3rem; }
        .hv11__pre { font-family: 'Share Tech Mono', monospace; font-size: 0.65rem; text-transform: uppercase; letter-spacing: 0.25em; color: rgba(255,255,255,0.5); display: block; margin-bottom: 0.75rem; }
        .hv11__headline { font-family: 'Space Grotesk', sans-serif; font-size: clamp(2.5rem, 6vw, 4.5rem); font-weight: 700; text-transform: uppercase; line-height: 0.95; letter-spacing: -0.02em; margin: 0; }
        .hv11__word--1 { color: #fff; }
        .hv11__word--2 { color: rgba(255,255,255,0.6); }
        .hv11__word--3 { color: rgba(255,255,255,0.35); }
        .hv11__horizon { height: 4px; background: linear-gradient(90deg, #1a1a1a, #e8e6e2, #1a1a1a); }
        .hv11__bottom { display: flex; align-items: center; padding: 2rem 3rem; background: #faf9f6; gap: 2rem; }
        .hv11__bottom-left { flex: 1; }
        .hv11__desc { font-family: 'Space Grotesk', sans-serif; font-size: 0.9rem; color: #666; line-height: 1.6; margin: 0 0 1.25rem; }
        .hv11__cta { display: inline-flex; align-items: center; gap: 0.5rem; font-family: 'Space Grotesk', sans-serif; font-size: 0.7rem; font-weight: 600; text-transform: uppercase; letter-spacing: 0.08em; text-decoration: none; color: #1a1a1a; border-bottom: 1px solid #ccc; padding-bottom: 0.25rem; transition: border-color 0.3s; }
        .hv11__cta:hover { border-color: #1a1a1a; }
        .hv11__bottom-center { display: flex; gap: 0.4rem; }
        .hv11__dot { width: 8px; height: 8px; border-radius: 50%; border: 1px solid #ccc; background: transparent; cursor: pointer; padding: 0; transition: all 0.3s; }
        .hv11__dot.active { background: #1a1a1a; border-color: #1a1a1a; }
        .hv11__bottom-right { text-align: right; }
        .hv11__meta { font-family: 'Share Tech Mono', monospace; font-size: 0.55rem; letter-spacing: 0.12em; color: #bbb; text-transform: uppercase; display: block; line-height: 1.8; }

        /* ===== V12: Stacked Type ===== */
        .hv12 { position: relative; min-height: 90vh; overflow: hidden; display: flex; flex-direction: column; justify-content: center; }
        .hv12__bg-img { position: absolute; inset: 0; background-size: cover; background-position: center; opacity: 0; transition: opacity 1s ease; }
        .hv12__bg-img.active { opacity: 1; }
        .hv12__overlay { position: absolute; inset: 0; background: rgba(0,0,0,0.6); z-index: 1; }
        .hv12__content { position: relative; z-index: 2; padding: 0 4rem; }
        .hv12__line { font-family: 'Space Grotesk', sans-serif; font-weight: 700; text-transform: uppercase; line-height: 0.85; letter-spacing: -0.04em; margin: 0; }
        .hv12__line--1 { font-size: clamp(4rem, 12vw, 10rem); color: #fff; }
        .hv12__line--2 { font-size: clamp(4rem, 12vw, 10rem); color: rgba(255,255,255,0.4); }
        .hv12__line--3 { font-size: clamp(4rem, 12vw, 10rem); color: rgba(255,255,255,0.2); }
        .hv12__info { margin-top: 2rem; display: flex; align-items: center; gap: 2rem; }
        .hv12__desc { font-family: 'Space Grotesk', sans-serif; font-size: 1rem; color: rgba(255,255,255,0.55); max-width: 400px; line-height: 1.6; margin: 0; }
        .hv12__divider { width: 1px; height: 40px; background: rgba(255,255,255,0.2); }
        .hv12__tags { display: flex; gap: 1rem; }
        .hv12__tags span { font-family: 'Share Tech Mono', monospace; font-size: 0.55rem; text-transform: uppercase; letter-spacing: 0.12em; color: rgba(255,255,255,0.3); }
        .hv12__nav { position: absolute; bottom: 2.5rem; right: 4rem; z-index: 3; display: flex; align-items: center; gap: 1rem; }
        .hv12__nav button { all: unset; color: rgba(255,255,255,0.4); cursor: pointer; display: flex; padding: 0.5rem; border: 1px solid rgba(255,255,255,0.15); transition: all 0.3s; }
        .hv12__nav button:hover { color: #fff; border-color: rgba(255,255,255,0.4); }
        .hv12__counter { font-family: 'Share Tech Mono', monospace; font-size: 0.65rem; letter-spacing: 0.15em; color: rgba(255,255,255,0.35); }

        /* ===== V13: Corner Anchored ===== */
        .hv13 { position: relative; height: 88vh; min-height: 520px; overflow: hidden; }
        .hv13__bg-img { position: absolute; inset: 0; background-size: cover; background-position: center; opacity: 0; transition: opacity 1s ease; }
        .hv13__bg-img.active { opacity: 1; }
        .hv13__overlay { position: absolute; inset: 0; background: rgba(0,0,0,0.4); z-index: 1; }
        .hv13__tl, .hv13__tr, .hv13__bl, .hv13__br { position: absolute; z-index: 3; }
        .hv13__tl { top: 2.5rem; left: 3rem; }
        .hv13__tl span { font-family: 'Space Grotesk', sans-serif; font-size: 0.85rem; font-weight: 700; text-transform: uppercase; letter-spacing: 0.08em; color: #fff; }
        .hv13__tr { top: 2.5rem; right: 3rem; }
        .hv13__tr span { font-family: 'Share Tech Mono', monospace; font-size: 0.6rem; letter-spacing: 0.15em; color: rgba(255,255,255,0.4); }
        .hv13__bl { bottom: 2.5rem; left: 3rem; display: flex; flex-direction: column; gap: 0.2rem; }
        .hv13__bl span { font-family: 'Share Tech Mono', monospace; font-size: 0.6rem; letter-spacing: 0.15em; color: rgba(255,255,255,0.35); }
        .hv13__br { bottom: 2.5rem; right: 3rem; }
        .hv13__center { position: absolute; inset: 0; z-index: 2; display: flex; flex-direction: column; align-items: center; justify-content: center; text-align: center; padding: 3rem; }
        .hv13__pre { font-family: 'Share Tech Mono', monospace; font-size: 0.7rem; text-transform: uppercase; letter-spacing: 0.3em; color: rgba(255,255,255,0.45); margin-bottom: 1.25rem; }
        .hv13__headline { font-family: 'Space Grotesk', sans-serif; font-size: clamp(2.5rem, 7vw, 5rem); font-weight: 700; text-transform: uppercase; line-height: 1; letter-spacing: -0.02em; color: #fff; margin: 0 0 1.25rem; }
        .hv13__desc { font-family: 'Space Grotesk', sans-serif; font-size: 1rem; color: rgba(255,255,255,0.55); max-width: 480px; line-height: 1.6; margin-bottom: 2rem; }
        .hv13__cta { padding: 0.9rem 2rem; font-family: 'Space Grotesk', sans-serif; font-size: 0.7rem; font-weight: 600; text-transform: uppercase; letter-spacing: 0.1em; text-decoration: none; background: #fff; color: #0a0a0a; transition: all 0.3s; }
        .hv13__cta:hover { background: #e0e0e0; }
        .hv13__dots { display: flex; gap: 0.5rem; }
        .hv13__dot { width: 40px; height: 3px; background: rgba(255,255,255,0.2); border: none; cursor: pointer; padding: 0; transition: all 0.3s; }
        .hv13__dot.active { background: #fff; }

        /* ===== V14: Framed Window ===== */
        .hv14 { background: #faf9f6; padding: 2rem; min-height: 80vh; display: flex; flex-direction: column; }
        .hv14__frame { flex: 1; border: 1px solid #e8e6e2; border-radius: 4px; overflow: hidden; }
        .hv14__window { position: relative; min-height: 450px; height: 100%; }
        .hv14__bg-img { position: absolute; inset: 0; background-size: cover; background-position: center; opacity: 0; transition: opacity 1s ease; }
        .hv14__bg-img.active { opacity: 1; }
        .hv14__overlay { position: absolute; inset: 0; background: rgba(0,0,0,0.35); z-index: 1; }
        .hv14__inner { position: relative; z-index: 2; height: 100%; display: flex; flex-direction: column; align-items: center; justify-content: center; text-align: center; padding: 3rem; }
        .hv14__pre { font-family: 'Share Tech Mono', monospace; font-size: 0.65rem; text-transform: uppercase; letter-spacing: 0.3em; color: rgba(255,255,255,0.5); margin-bottom: 1.25rem; }
        .hv14__headline { font-family: 'Space Grotesk', sans-serif; font-size: clamp(2.5rem, 6vw, 4.5rem); font-weight: 700; text-transform: uppercase; line-height: 0.95; letter-spacing: -0.02em; margin: 0 0 1.25rem; }
        .hv14__word--1 { color: #fff; }
        .hv14__word--2 { color: rgba(255,255,255,0.6); }
        .hv14__word--3 { color: rgba(255,255,255,0.35); }
        .hv14__desc { font-family: 'Space Grotesk', sans-serif; font-size: 1rem; color: rgba(255,255,255,0.55); max-width: 480px; line-height: 1.6; }
        .hv14__bar { display: flex; align-items: center; justify-content: space-between; padding: 1.25rem 0; margin-top: 1rem; }
        .hv14__brand { font-family: 'Share Tech Mono', monospace; font-size: 0.6rem; text-transform: uppercase; letter-spacing: 0.15em; color: #999; }
        .hv14__dots { display: flex; gap: 0.4rem; }
        .hv14__dot { width: 8px; height: 8px; border-radius: 50%; border: 1px solid #ccc; background: transparent; cursor: pointer; padding: 0; transition: all 0.3s; }
        .hv14__dot.active { background: #1a1a1a; border-color: #1a1a1a; }
        .hv14__cta { font-family: 'Space Grotesk', sans-serif; font-size: 0.65rem; font-weight: 600; text-transform: uppercase; letter-spacing: 0.08em; text-decoration: none; color: #1a1a1a; border-bottom: 1px solid #ccc; padding-bottom: 0.2rem; transition: border-color 0.3s; }
        .hv14__cta:hover { border-color: #1a1a1a; }

        /* ===== V15: Bold Mono ===== */
        .hv15 { display: grid; grid-template-columns: 1fr 1fr; min-height: 80vh; background: #faf9f6; }
        .hv15__left { padding: 4rem 3rem; display: flex; flex-direction: column; justify-content: center; }
        .hv15__label-wrap { margin-bottom: 0.5rem; }
        .hv15__label { display: block; font-family: 'Space Grotesk', sans-serif; font-size: clamp(3rem, 7vw, 5.5rem); font-weight: 700; text-transform: uppercase; line-height: 0.9; letter-spacing: -0.03em; color: #1a1a1a; }
        .hv15__label:last-child { color: #999; }
        .hv15__rule { width: 50px; height: 2px; background: #1a1a1a; margin: 1.5rem 0; }
        .hv15__pre { font-family: 'Share Tech Mono', monospace; font-size: 0.65rem; text-transform: uppercase; letter-spacing: 0.25em; color: #999; display: block; margin-bottom: 0.75rem; }
        .hv15__headline { font-family: 'Space Grotesk', sans-serif; font-size: clamp(1.3rem, 2.5vw, 1.8rem); font-weight: 700; text-transform: uppercase; letter-spacing: -0.01em; color: #1a1a1a; margin: 0 0 1rem; }
        .hv15__desc { font-family: 'Space Grotesk', sans-serif; font-size: 0.9rem; color: #666; line-height: 1.7; max-width: 400px; margin-bottom: 2rem; }
        .hv15__stats { display: flex; gap: 2rem; margin-bottom: 2.5rem; padding-top: 1.5rem; border-top: 1px solid #e8e6e2; }
        .hv15__stat { }
        .hv15__stat-num { display: block; font-family: 'Space Grotesk', sans-serif; font-size: 1.5rem; font-weight: 700; color: #1a1a1a; line-height: 1; margin-bottom: 0.2rem; }
        .hv15__stat-label { font-family: 'Share Tech Mono', monospace; font-size: 0.5rem; text-transform: uppercase; letter-spacing: 0.15em; color: #999; }
        .hv15__cta { display: inline-flex; align-items: center; gap: 0.5rem; padding: 0.9rem 1.8rem; font-family: 'Space Grotesk', sans-serif; font-size: 0.7rem; font-weight: 600; text-transform: uppercase; letter-spacing: 0.08em; text-decoration: none; background: #1a1a1a; color: #faf9f6; border-radius: 4px; transition: all 0.3s; align-self: flex-start; }
        .hv15__cta:hover { background: #333; }
        .hv15__right { position: relative; overflow: hidden; }
        .hv15__img-wrap { position: relative; height: 100%; min-height: 400px; }
        .hv15__img { position: absolute; inset: 0; background-size: cover; background-position: center; opacity: 0; transition: opacity 0.8s ease; }
        .hv15__img.active { opacity: 1; }
        .hv15__dots { position: absolute; bottom: 1.5rem; left: 1.5rem; display: flex; gap: 0.4rem; z-index: 1; }
        .hv15__dot { width: 40px; height: 3px; background: rgba(255,255,255,0.3); border: none; cursor: pointer; padding: 0; transition: all 0.3s; }
        .hv15__dot.active { background: #fff; }

        /* ===== V16: Overlapping Panels ===== */
        .hv16 { position: relative; min-height: 80vh; background: #faf9f6; display: flex; align-items: center; padding: 3rem; overflow: hidden; }
        .hv16__panel--img { width: 60%; height: 500px; position: relative; overflow: hidden; border-radius: 4px; z-index: 1; }
        .hv16__img { position: absolute; inset: 0; background-size: cover; background-position: center; opacity: 0; transition: opacity 0.8s ease; }
        .hv16__img.active { opacity: 1; }
        .hv16__panel--text { position: absolute; right: 5%; top: 50%; transform: translateY(-50%); width: 45%; background: #fff; padding: 3rem; border: 1px solid #e8e6e2; border-radius: 4px; box-shadow: 0 8px 40px rgba(0,0,0,0.08); z-index: 2; }
        .hv16__coords { font-family: 'Share Tech Mono', monospace; font-size: 0.55rem; letter-spacing: 0.15em; color: #bbb; text-transform: uppercase; display: block; margin-bottom: 1.5rem; }
        .hv16__pre { font-family: 'Share Tech Mono', monospace; font-size: 0.65rem; text-transform: uppercase; letter-spacing: 0.25em; color: #999; display: block; margin-bottom: 0.75rem; }
        .hv16__headline { font-family: 'Space Grotesk', sans-serif; font-size: clamp(1.8rem, 3.5vw, 2.8rem); font-weight: 700; text-transform: uppercase; line-height: 1.05; letter-spacing: -0.02em; margin: 0 0 1.25rem; display: flex; flex-wrap: wrap; gap: 0.2em; }
        .hv16__word--1 { color: #1a1a1a; }
        .hv16__word--2 { color: #4a4a4a; }
        .hv16__word--3 { color: #7a7a7a; }
        .hv16__desc { font-family: 'Space Grotesk', sans-serif; font-size: 0.9rem; color: #666; line-height: 1.7; margin-bottom: 2rem; }
        .hv16__actions { display: flex; align-items: center; gap: 1.5rem; }
        .hv16__cta { padding: 0.8rem 1.6rem; font-family: 'Space Grotesk', sans-serif; font-size: 0.7rem; font-weight: 600; text-transform: uppercase; letter-spacing: 0.08em; text-decoration: none; background: #1a1a1a; color: #faf9f6; border-radius: 4px; transition: all 0.3s; }
        .hv16__cta:hover { background: #333; }
        .hv16__dots { display: flex; gap: 0.4rem; }
        .hv16__dot { width: 8px; height: 8px; border-radius: 50%; border: 1px solid #ccc; background: transparent; cursor: pointer; padding: 0; transition: all 0.3s; }
        .hv16__dot.active { background: #1a1a1a; border-color: #1a1a1a; }

        /* ===== V17: Gazette ===== */
        .hv17 { background: #faf9f6; border: 1px solid #e8e6e2; }
        .hv17__header { display: flex; align-items: center; gap: 2rem; padding: 1.5rem 3rem; border-bottom: 2px solid #1a1a1a; }
        .hv17__header-line { flex: 1; height: 1px; background: #1a1a1a; }
        .hv17__header-center { text-align: center; flex-shrink: 0; }
        .hv17__header-title { display: block; font-family: 'Space Grotesk', sans-serif; font-size: 2rem; font-weight: 700; text-transform: uppercase; letter-spacing: 0.1em; color: #1a1a1a; line-height: 1.1; }
        .hv17__header-sub { display: block; font-family: 'Share Tech Mono', monospace; font-size: 0.5rem; text-transform: uppercase; letter-spacing: 0.2em; color: #999; }
        .hv17__body { display: grid; grid-template-columns: 1.2fr 1fr 0.7fr; min-height: 450px; }
        .hv17__col { padding: 2rem; }
        .hv17__col--1 { border-right: 1px solid #e8e6e2; display: flex; flex-direction: column; }
        .hv17__col--2 { border-right: 1px solid #e8e6e2; }
        .hv17__img-wrap { flex: 1; position: relative; overflow: hidden; min-height: 280px; }
        .hv17__img { position: absolute; inset: 0; background-size: cover; background-position: center; opacity: 0; transition: opacity 0.8s; }
        .hv17__img.active { opacity: 1; }
        .hv17__caption { font-family: 'Share Tech Mono', monospace; font-size: 0.5rem; text-transform: uppercase; letter-spacing: 0.15em; color: #bbb; margin-top: 0.75rem; display: block; }
        .hv17__kicker { font-family: 'Share Tech Mono', monospace; font-size: 0.6rem; text-transform: uppercase; letter-spacing: 0.2em; color: #999; display: block; margin-bottom: 0.75rem; }
        .hv17__headline { font-family: 'Space Grotesk', sans-serif; font-size: clamp(1.5rem, 2.5vw, 2rem); font-weight: 700; text-transform: uppercase; letter-spacing: -0.01em; color: #1a1a1a; margin: 0 0 1rem; line-height: 1.1; }
        .hv17__rule { width: 30px; height: 2px; background: #1a1a1a; margin-bottom: 1rem; }
        .hv17__lede { font-family: 'Space Grotesk', sans-serif; font-size: 0.9rem; color: #444; line-height: 1.7; font-weight: 500; margin-bottom: 1rem; }
        .hv17__body-text { font-family: 'Space Grotesk', sans-serif; font-size: 0.82rem; color: #777; line-height: 1.7; }
        .hv17__aside-label { font-family: 'Share Tech Mono', monospace; font-size: 0.55rem; text-transform: uppercase; letter-spacing: 0.2em; color: #bbb; display: block; margin-bottom: 1rem; }
        .hv17__aside-list { display: flex; flex-direction: column; }
        .hv17__aside-list span { font-family: 'Space Grotesk', sans-serif; font-size: 0.78rem; color: #1a1a1a; padding: 0.75rem 0; border-bottom: 1px solid #e8e6e2; }
        .hv17__aside-nav { display: flex; gap: 0.25rem; margin-top: 1.5rem; }
        .hv17__nav-btn { all: unset; font-family: 'Share Tech Mono', monospace; font-size: 0.55rem; padding: 0.35rem 0.6rem; border: 1px solid #e8e6e2; cursor: pointer; color: #999; transition: all 0.3s; }
        .hv17__nav-btn.active { background: #1a1a1a; color: #fff; border-color: #1a1a1a; }

        /* ===== V18: Dark Theater ===== */
        .hv18 { background: #0a0a0a; }
        .hv18__stage { position: relative; height: 75vh; min-height: 450px; overflow: hidden; }
        .hv18__bg-img { position: absolute; inset: 0; background-size: cover; background-position: center; opacity: 0; transition: opacity 1.2s ease; }
        .hv18__bg-img.active { opacity: 1; }
        .hv18__vignette { position: absolute; inset: 0; background: radial-gradient(ellipse at center, rgba(0,0,0,0.2) 0%, rgba(0,0,0,0.75) 100%); z-index: 1; }
        .hv18__content { position: relative; z-index: 2; height: 100%; display: flex; flex-direction: column; align-items: center; justify-content: center; text-align: center; padding: 3rem; }
        .hv18__num { font-family: 'Space Grotesk', sans-serif; font-size: 6rem; font-weight: 700; color: rgba(255,255,255,0.06); line-height: 1; margin-bottom: -1.5rem; }
        .hv18__pre { font-family: 'Share Tech Mono', monospace; font-size: 0.65rem; text-transform: uppercase; letter-spacing: 0.3em; color: rgba(255,255,255,0.4); margin-bottom: 1rem; }
        .hv18__headline { font-family: 'Space Grotesk', sans-serif; font-size: clamp(2.5rem, 6vw, 4.5rem); font-weight: 700; text-transform: uppercase; line-height: 0.95; letter-spacing: -0.02em; margin: 0 0 1.25rem; }
        .hv18__word--1 { color: #fff; }
        .hv18__word--2 { color: rgba(255,255,255,0.55); }
        .hv18__word--3 { color: rgba(255,255,255,0.3); }
        .hv18__desc { font-family: 'Space Grotesk', sans-serif; font-size: 1rem; color: rgba(255,255,255,0.45); max-width: 450px; line-height: 1.6; margin-bottom: 2rem; }
        .hv18__cta { padding: 0.9rem 2rem; font-family: 'Space Grotesk', sans-serif; font-size: 0.7rem; font-weight: 600; text-transform: uppercase; letter-spacing: 0.1em; text-decoration: none; background: transparent; color: #fff; border: 1px solid rgba(255,255,255,0.3); transition: all 0.3s; }
        .hv18__cta:hover { background: rgba(255,255,255,0.1); border-color: #fff; }
        .hv18__strip { display: flex; gap: 3px; padding: 3px; background: #0a0a0a; }
        .hv18__thumb { flex: 1; height: 80px; background-size: cover; background-position: center; opacity: 0.3; cursor: pointer; transition: opacity 0.4s; }
        .hv18__thumb.active { opacity: 1; }

        /* ===== V19: Split Reveal ===== */
        .hv19 { display: grid; grid-template-columns: 1fr 1fr; min-height: 85vh; }
        .hv19__left { background: #faf9f6; display: flex; align-items: center; justify-content: center; padding: 4rem; }
        .hv19__left-inner { max-width: 440px; }
        .hv19__eyebrow { font-family: 'Share Tech Mono', monospace; font-size: 0.55rem; text-transform: uppercase; letter-spacing: 0.2em; color: #bbb; display: block; margin-bottom: 2rem; }
        .hv19__pre { font-family: 'Share Tech Mono', monospace; font-size: 0.65rem; text-transform: uppercase; letter-spacing: 0.25em; color: #999; display: block; margin-bottom: 0.75rem; }
        .hv19__headline { font-family: 'Space Grotesk', sans-serif; font-size: clamp(2rem, 4vw, 3rem); font-weight: 700; text-transform: uppercase; line-height: 1.05; letter-spacing: -0.02em; margin: 0 0 1.5rem; display: flex; flex-wrap: wrap; gap: 0.2em; }
        .hv19__word--1 { color: #1a1a1a; }
        .hv19__word--2 { color: #4a4a4a; }
        .hv19__word--3 { color: #7a7a7a; }
        .hv19__rule { width: 40px; height: 2px; background: #1a1a1a; margin-bottom: 1.5rem; }
        .hv19__desc { font-family: 'Space Grotesk', sans-serif; font-size: 0.95rem; color: #666; line-height: 1.7; margin-bottom: 2.5rem; }
        .hv19__actions { display: flex; align-items: center; gap: 1.5rem; }
        .hv19__cta { display: inline-flex; align-items: center; gap: 0.5rem; padding: 0.9rem 1.8rem; font-family: 'Space Grotesk', sans-serif; font-size: 0.7rem; font-weight: 600; text-transform: uppercase; letter-spacing: 0.08em; text-decoration: none; background: #1a1a1a; color: #faf9f6; border-radius: 4px; transition: all 0.3s; }
        .hv19__cta:hover { background: #333; }
        .hv19__link { font-family: 'Space Grotesk', sans-serif; font-size: 0.7rem; font-weight: 600; text-transform: uppercase; letter-spacing: 0.08em; text-decoration: none; color: #1a1a1a; border-bottom: 1px solid #ccc; padding-bottom: 0.2rem; transition: border-color 0.3s; }
        .hv19__link:hover { border-color: #1a1a1a; }
        .hv19__right { position: relative; overflow: hidden; }
        .hv19__img { position: absolute; inset: 0; background-size: cover; background-position: center; opacity: 0; transition: opacity 0.8s ease; }
        .hv19__img.active { opacity: 1; }
        .hv19__right-overlay { position: absolute; bottom: 2rem; right: 2rem; z-index: 1; display: flex; flex-direction: column; align-items: flex-end; gap: 1rem; }
        .hv19__counter { font-family: 'Space Grotesk', sans-serif; font-size: 2.5rem; font-weight: 700; color: #fff; line-height: 1; }
        .hv19__counter span { font-size: 0.9rem; color: rgba(255,255,255,0.4); }
        .hv19__arrows { display: flex; gap: 0.25rem; }
        .hv19__arrows button { all: unset; display: flex; align-items: center; justify-content: center; width: 36px; height: 36px; border: 1px solid rgba(255,255,255,0.3); color: #fff; cursor: pointer; transition: all 0.3s; }
        .hv19__arrows button:hover { background: rgba(255,255,255,0.1); border-color: #fff; }

        /* ===== V20: Grid Mosaic ===== */
        .hv20 { display: grid; grid-template-columns: 3fr 2fr; min-height: 75vh; background: #faf9f6; }
        .hv20__grid { display: grid; grid-template-columns: repeat(3, 1fr); grid-template-rows: repeat(2, 1fr); gap: 3px; }
        .hv20__cell { background-size: cover; background-position: center; opacity: 0.35; transition: opacity 0.6s ease; min-height: 180px; }
        .hv20__cell--active { opacity: 1; }
        .hv20__text-cell { padding: 3rem; display: flex; flex-direction: column; justify-content: center; border-left: 1px solid #e8e6e2; }
        .hv20__badge { font-family: 'Share Tech Mono', monospace; font-size: 0.5rem; text-transform: uppercase; letter-spacing: 0.2em; color: #999; border: 1px solid #e8e6e2; padding: 0.3rem 0.8rem; display: inline-block; align-self: flex-start; margin-bottom: 2rem; border-radius: 2px; }
        .hv20__pre { font-family: 'Share Tech Mono', monospace; font-size: 0.65rem; text-transform: uppercase; letter-spacing: 0.25em; color: #999; display: block; margin-bottom: 0.75rem; }
        .hv20__headline { font-family: 'Space Grotesk', sans-serif; font-size: clamp(1.8rem, 3vw, 2.5rem); font-weight: 700; text-transform: uppercase; line-height: 1.05; letter-spacing: -0.02em; margin: 0 0 1.25rem; display: flex; flex-wrap: wrap; gap: 0.2em; }
        .hv20__word--1 { color: #1a1a1a; }
        .hv20__word--2 { color: #4a4a4a; }
        .hv20__word--3 { color: #7a7a7a; }
        .hv20__desc { font-family: 'Space Grotesk', sans-serif; font-size: 0.9rem; color: #666; line-height: 1.7; margin-bottom: 2rem; }
        .hv20__foot { display: flex; align-items: center; gap: 1.5rem; }
        .hv20__cta { display: inline-flex; align-items: center; gap: 0.5rem; padding: 0.8rem 1.5rem; font-family: 'Space Grotesk', sans-serif; font-size: 0.65rem; font-weight: 600; text-transform: uppercase; letter-spacing: 0.08em; text-decoration: none; background: #1a1a1a; color: #faf9f6; border-radius: 4px; transition: all 0.3s; }
        .hv20__cta:hover { background: #333; }
        .hv20__dots { display: flex; gap: 0.4rem; }
        .hv20__dot { width: 8px; height: 8px; border-radius: 50%; border: 1px solid #ccc; background: transparent; cursor: pointer; padding: 0; transition: all 0.3s; }
        .hv20__dot.active { background: #1a1a1a; border-color: #1a1a1a; }

        @media (max-width: 768px) {
          .hv11__bottom { flex-direction: column; text-align: center; }
          .hv11__bottom-right { text-align: center; }
          .hv12__info { flex-direction: column; }
          .hv15 { grid-template-columns: 1fr; }
          .hv15__right { min-height: 300px; }
          .hv16__panel--img { width: 100%; }
          .hv16__panel--text { position: relative; right: auto; top: auto; transform: none; width: 100%; margin-top: -3rem; }
          .hv17__body { grid-template-columns: 1fr; }
          .hv17__col--1 { border-right: none; border-bottom: 1px solid #e8e6e2; }
          .hv17__col--2 { border-right: none; border-bottom: 1px solid #e8e6e2; }
          .hv19 { grid-template-columns: 1fr; }
          .hv19__right { min-height: 350px; }
          .hv20 { grid-template-columns: 1fr; }
          .hv20__grid { grid-template-columns: repeat(2, 1fr); }
        }


        /* ===== V21: Cockpit HUD ===== */
        .hv21 { position: relative; height: 90vh; min-height: 550px; overflow: hidden; background: #0a0a0a; }
        .hv21__bg-img { position: absolute; inset: 0; background-size: cover; background-position: center; opacity: 0; transition: opacity 1s ease; }
        .hv21__bg-img.active { opacity: 0.4; }
        .hv21__overlay { position: absolute; inset: 0; background: rgba(0,10,5,0.5); z-index: 1; }
        .hv21__hud { position: relative; z-index: 2; height: 100%; display: flex; flex-direction: column; padding: 1.5rem 3rem; }
        .hv21__hud-top { display: flex; justify-content: center; gap: 3rem; padding: 1rem 0; border-bottom: 1px solid rgba(255,255,255,0.08); }
        .hv21__readout { text-align: center; }
        .hv21__readout--center { padding: 0 2rem; border-left: 1px solid rgba(255,255,255,0.08); border-right: 1px solid rgba(255,255,255,0.08); }
        .hv21__readout-label { display: block; font-family: 'Share Tech Mono', monospace; font-size: 0.45rem; text-transform: uppercase; letter-spacing: 0.2em; color: rgba(255,255,255,0.3); margin-bottom: 0.2rem; }
        .hv21__readout-val { font-family: 'Share Tech Mono', monospace; font-size: 0.75rem; letter-spacing: 0.08em; color: rgba(255,255,255,0.7); }
        .hv21__readout-val--green { color: rgba(100,255,150,0.7); }
        .hv21__horizon-line { display: flex; align-items: center; justify-content: center; gap: 2rem; padding: 1rem 0; }
        .hv21__horizon-mark { font-family: 'Share Tech Mono', monospace; font-size: 0.5rem; color: rgba(255,255,255,0.2); }
        .hv21__horizon-center { opacity: 0.5; }
        .hv21__center { flex: 1; display: flex; flex-direction: column; align-items: center; justify-content: center; text-align: center; }
        .hv21__center .hv21__pre { font-family: 'Share Tech Mono', monospace; font-size: 0.7rem; text-transform: uppercase; letter-spacing: 0.3em; color: rgba(255,255,255,0.4); margin-bottom: 1rem; }
        .hv21__center .hv21__headline { font-family: 'Space Grotesk', sans-serif; font-size: clamp(2.5rem, 6vw, 4.5rem); font-weight: 700; text-transform: uppercase; line-height: 1; letter-spacing: -0.02em; color: #fff; margin: 0 0 1rem; }
        .hv21__center .hv21__desc { font-family: 'Space Grotesk', sans-serif; font-size: 0.95rem; color: rgba(255,255,255,0.45); max-width: 450px; line-height: 1.6; margin-bottom: 2rem; }
        .hv21__cta { display: inline-flex; align-items: center; gap: 0.5rem; padding: 0.8rem 1.6rem; font-family: 'Share Tech Mono', monospace; font-size: 0.65rem; text-transform: uppercase; letter-spacing: 0.12em; text-decoration: none; background: transparent; color: rgba(255,255,255,0.7); border: 1px solid rgba(255,255,255,0.2); transition: all 0.3s; }
        .hv21__cta:hover { color: #fff; border-color: rgba(255,255,255,0.5); background: rgba(255,255,255,0.05); }
        .hv21__hud-bottom { display: flex; justify-content: space-between; align-items: center; padding: 1rem 0; border-top: 1px solid rgba(255,255,255,0.08); }
        .hv21__coord-block { }
        .hv21__nav-strip { display: flex; gap: 0.25rem; }
        .hv21__nav-btn { all: unset; width: 36px; height: 28px; display: flex; align-items: center; justify-content: center; font-family: 'Share Tech Mono', monospace; font-size: 0.55rem; color: rgba(255,255,255,0.3); border: 1px solid rgba(255,255,255,0.08); cursor: pointer; transition: all 0.3s; }
        .hv21__nav-btn.active { color: #fff; border-color: rgba(255,255,255,0.4); background: rgba(255,255,255,0.08); }
        .hv21__scanline { position: absolute; top: 0; left: 0; right: 0; height: 2px; background: linear-gradient(90deg, transparent, rgba(100,255,150,0.1), transparent); z-index: 3; animation: hv21scan 4s linear infinite; pointer-events: none; }
        @keyframes hv21scan { 0% { top: 0; } 100% { top: 100%; } }

        /* ===== V22: Letterpress ===== */
        .hv22 { background: #f0ece4; padding: 3rem; min-height: 80vh; display: flex; align-items: center; justify-content: center; }
        .hv22__paper { background: #faf8f3; border: 1px solid #d8d2c4; padding: 4rem; max-width: 800px; width: 100%; text-align: center; box-shadow: 0 2px 20px rgba(0,0,0,0.06); }
        .hv22__ornament { font-size: 1.2rem; color: #c0b8a8; margin-bottom: 1rem; }
        .hv22__foundry { font-family: 'Share Tech Mono', monospace; font-size: 0.55rem; text-transform: uppercase; letter-spacing: 0.3em; color: #a09888; display: block; margin-bottom: 1.5rem; }
        .hv22__ornament-line { display: flex; align-items: center; gap: 1rem; margin: 1.5rem 0; }
        .hv22__ornament-line span:first-child, .hv22__ornament-line span:last-child { flex: 1; height: 1px; background: #d8d2c4; }
        .hv22__ornament-line span:nth-child(2) { color: #c0b8a8; font-size: 0.8rem; }
        .hv22__pre { font-family: 'Share Tech Mono', monospace; font-size: 0.7rem; text-transform: uppercase; letter-spacing: 0.25em; color: #a09888; display: block; margin-bottom: 0.75rem; }
        .hv22__headline { font-family: 'Space Grotesk', sans-serif; font-size: clamp(2.5rem, 5vw, 4rem); font-weight: 700; text-transform: uppercase; line-height: 1; letter-spacing: -0.02em; margin: 0; display: flex; flex-wrap: wrap; gap: 0.2em; justify-content: center; }
        .hv22__word--1 { color: #2a2218; }
        .hv22__word--2 { color: #6b5e50; }
        .hv22__word--3 { color: #a09888; }
        .hv22__desc { font-family: 'Space Grotesk', sans-serif; font-size: 0.95rem; color: #7a7060; line-height: 1.7; max-width: 500px; margin: 0 auto 2rem; }
        .hv22__img-row { display: flex; gap: 0.75rem; margin-bottom: 2rem; }
        .hv22__img { flex: 1; height: 160px; background-size: cover; background-position: center; border: 1px solid #d8d2c4; opacity: 0.5; cursor: pointer; transition: all 0.4s; }
        .hv22__img.active { opacity: 1; box-shadow: 0 4px 15px rgba(0,0,0,0.1); }
        .hv22__footer-row { display: flex; justify-content: space-between; align-items: center; padding-top: 1.5rem; border-top: 1px solid #d8d2c4; }
        .hv22__footer-row span { font-family: 'Share Tech Mono', monospace; font-size: 0.5rem; text-transform: uppercase; letter-spacing: 0.15em; color: #b0a898; }
        .hv22__dots { display: flex; gap: 0.4rem; }
        .hv22__dot { width: 8px; height: 8px; border-radius: 50%; border: 1px solid #c0b8a8; background: transparent; cursor: pointer; padding: 0; transition: all 0.3s; }
        .hv22__dot.active { background: #2a2218; border-color: #2a2218; }

        /* ===== V23: Film Title Sequence ===== */
        .hv23 { position: relative; height: 90vh; min-height: 550px; overflow: hidden; background: #000; }
        .hv23__bg-img { position: absolute; inset: 0; background-size: cover; background-position: center; opacity: 0; transition: opacity 1.5s ease; }
        .hv23__bg-img.active { opacity: 0.35; }
        .hv23__overlay { position: absolute; inset: 0; background: rgba(0,0,0,0.4); z-index: 1; }
        .hv23__bars { position: absolute; inset: 0; z-index: 2; pointer-events: none; }
        .hv23__bar { position: absolute; left: 0; right: 0; background: #000; }
        .hv23__bar--top { top: 0; height: 12%; }
        .hv23__bar--bot { bottom: 0; height: 12%; }
        .hv23__content { position: relative; z-index: 3; height: 100%; display: flex; flex-direction: column; align-items: center; justify-content: center; text-align: center; padding: 3rem; }
        .hv23__studio { font-family: 'Share Tech Mono', monospace; font-size: 0.6rem; text-transform: uppercase; letter-spacing: 0.4em; color: rgba(255,255,255,0.3); margin-bottom: 3rem; }
        .hv23__title-block { margin-bottom: 2rem; }
        .hv23__title { font-family: 'Space Grotesk', sans-serif; font-weight: 700; text-transform: uppercase; line-height: 0.9; letter-spacing: -0.03em; margin: 0; }
        .hv23__title--1 { font-size: clamp(3rem, 9vw, 7rem); color: #fff; }
        .hv23__title--2 { font-size: clamp(3rem, 9vw, 7rem); color: rgba(255,255,255,0.45); }
        .hv23__title--3 { font-size: clamp(3rem, 9vw, 7rem); color: rgba(255,255,255,0.2); }
        .hv23__tagline { font-family: 'Space Grotesk', sans-serif; font-size: 1rem; color: rgba(255,255,255,0.4); font-style: italic; letter-spacing: 0.05em; margin-bottom: 3rem; }
        .hv23__credits { display: flex; gap: 3rem; }
        .hv23__credit { text-align: center; }
        .hv23__credit-role { display: block; font-family: 'Share Tech Mono', monospace; font-size: 0.45rem; text-transform: uppercase; letter-spacing: 0.25em; color: rgba(255,255,255,0.25); margin-bottom: 0.3rem; }
        .hv23__credit-name { font-family: 'Space Grotesk', sans-serif; font-size: 0.8rem; font-weight: 500; color: rgba(255,255,255,0.6); }
        .hv23__nav { position: absolute; bottom: 14%; left: 50%; transform: translateX(-50%); z-index: 4; display: flex; gap: 0.5rem; }
        .hv23__dot { width: 40px; height: 2px; background: rgba(255,255,255,0.15); border: none; cursor: pointer; padding: 0; transition: all 0.3s; }
        .hv23__dot.active { background: rgba(255,255,255,0.7); }

        /* ===== V24: Topographic ===== */
        .hv24 { position: relative; min-height: 80vh; background: #faf9f6; overflow: hidden; display: grid; grid-template-columns: 1fr 1fr; padding: 4rem 3rem; align-items: center; }
        .hv24__topo { position: absolute; inset: 0; width: 100%; height: 100%; z-index: 0; }
        .hv24__pin { position: absolute; top: 48%; left: 48%; z-index: 1; }
        .hv24__pin-dot { width: 8px; height: 8px; border-radius: 50%; background: #1a1a1a; margin-bottom: 0.3rem; }
        .hv24__pin-label { font-family: 'Share Tech Mono', monospace; font-size: 0.5rem; letter-spacing: 0.1em; color: #999; white-space: nowrap; }
        .hv24__content { position: relative; z-index: 2; max-width: 450px; }
        .hv24__pre { font-family: 'Share Tech Mono', monospace; font-size: 0.65rem; text-transform: uppercase; letter-spacing: 0.25em; color: #999; display: block; margin-bottom: 0.75rem; }
        .hv24__headline { font-family: 'Space Grotesk', sans-serif; font-size: clamp(2rem, 4vw, 3rem); font-weight: 700; text-transform: uppercase; line-height: 1.05; letter-spacing: -0.02em; margin: 0 0 1.25rem; display: flex; flex-wrap: wrap; gap: 0.2em; }
        .hv24__word--1 { color: #1a1a1a; }
        .hv24__word--2 { color: #4a4a4a; }
        .hv24__word--3 { color: #7a7a7a; }
        .hv24__desc { font-family: 'Space Grotesk', sans-serif; font-size: 0.95rem; color: #666; line-height: 1.7; margin-bottom: 2rem; }
        .hv24__cta { display: inline-flex; align-items: center; gap: 0.5rem; padding: 0.9rem 1.8rem; font-family: 'Space Grotesk', sans-serif; font-size: 0.7rem; font-weight: 600; text-transform: uppercase; letter-spacing: 0.08em; text-decoration: none; background: #1a1a1a; color: #faf9f6; border-radius: 4px; transition: all 0.3s; }
        .hv24__cta:hover { background: #333; }
        .hv24__img-panel { position: relative; z-index: 2; height: 400px; border-radius: 4px; overflow: hidden; border: 1px solid #e8e6e2; }
        .hv24__img { position: absolute; inset: 0; background-size: cover; background-position: center; opacity: 0; transition: opacity 0.8s; }
        .hv24__img.active { opacity: 1; }
        .hv24__dots { position: absolute; bottom: 2rem; left: 50%; transform: translateX(-50%); z-index: 3; display: flex; gap: 0.4rem; }
        .hv24__dot { width: 8px; height: 8px; border-radius: 50%; border: 1px solid #ccc; background: transparent; cursor: pointer; padding: 0; transition: all 0.3s; }
        .hv24__dot.active { background: #1a1a1a; border-color: #1a1a1a; }
        .hv24__compass { position: absolute; top: 3rem; right: 3rem; z-index: 2; opacity: 0.6; }

        /* ===== V25: Passport Stamp ===== */
        .hv25 { position: relative; height: 88vh; min-height: 520px; overflow: hidden; display: flex; flex-direction: column; align-items: center; justify-content: center; }
        .hv25__bg-img { position: absolute; inset: 0; background-size: cover; background-position: center; opacity: 0; transition: opacity 1s ease; }
        .hv25__bg-img.active { opacity: 1; }
        .hv25__overlay { position: absolute; inset: 0; background: rgba(0,0,0,0.55); z-index: 1; }
        .hv25__stamp { position: relative; z-index: 2; margin-bottom: 2rem; }
        .hv25__stamp-border { width: 320px; height: 320px; border-radius: 50%; border: 2px solid rgba(255,255,255,0.25); display: flex; flex-direction: column; align-items: center; justify-content: center; text-align: center; position: relative; padding: 2rem; }
        .hv25__stamp-arc { font-family: 'Share Tech Mono', monospace; font-size: 0.5rem; text-transform: uppercase; letter-spacing: 0.25em; color: rgba(255,255,255,0.3); position: absolute; top: 1.5rem; }
        .hv25__stamp-center { }
        .hv25__stamp-pre { font-family: 'Share Tech Mono', monospace; font-size: 0.6rem; text-transform: uppercase; letter-spacing: 0.25em; color: rgba(255,255,255,0.45); display: block; margin-bottom: 0.5rem; }
        .hv25__stamp-headline { font-family: 'Space Grotesk', sans-serif; font-size: clamp(1.8rem, 4vw, 2.5rem); font-weight: 700; text-transform: uppercase; line-height: 1.05; letter-spacing: -0.02em; color: #fff; margin: 0 0 0.5rem; }
        .hv25__stamp-date { font-family: 'Share Tech Mono', monospace; font-size: 0.7rem; letter-spacing: 0.15em; color: rgba(255,255,255,0.5); }
        .hv25__stamp-coords { font-family: 'Share Tech Mono', monospace; font-size: 0.5rem; letter-spacing: 0.15em; color: rgba(255,255,255,0.25); position: absolute; bottom: 1.5rem; }
        .hv25__desc { position: relative; z-index: 2; font-family: 'Space Grotesk', sans-serif; font-size: 1rem; color: rgba(255,255,255,0.5); text-align: center; max-width: 450px; line-height: 1.6; margin-bottom: 2rem; }
        .hv25__nav { position: relative; z-index: 2; display: flex; align-items: center; gap: 1.5rem; }
        .hv25__nav button { all: unset; display: flex; align-items: center; justify-content: center; width: 40px; height: 40px; border: 1px solid rgba(255,255,255,0.2); border-radius: 50%; color: rgba(255,255,255,0.5); cursor: pointer; transition: all 0.3s; }
        .hv25__nav button:hover { border-color: #fff; color: #fff; }
        .hv25__counter { font-family: 'Share Tech Mono', monospace; font-size: 0.7rem; letter-spacing: 0.15em; color: rgba(255,255,255,0.4); }

        /* ===== V26: Swiss Poster ===== */
        .hv26 { position: relative; min-height: 85vh; background: #faf9f6; overflow: hidden; }
        .hv26__grid-overlay { position: absolute; inset: 0; pointer-events: none; z-index: 0; }
        .hv26__grid-v { position: absolute; top: 0; bottom: 0; width: 1px; background: rgba(0,0,0,0.03); }
        .hv26__grid-h { position: absolute; left: 0; right: 0; height: 1px; background: rgba(0,0,0,0.03); }
        .hv26__layout { position: relative; z-index: 1; display: grid; grid-template-columns: 1fr 1fr; grid-template-rows: auto auto; max-width: 1200px; margin: 0 auto; padding: 4rem 3rem; gap: 0; }
        .hv26__type-block { grid-column: 1 / -1; margin-bottom: 3rem; display: flex; align-items: flex-end; gap: 2rem; }
        .hv26__num { font-family: 'Space Grotesk', sans-serif; font-size: 8rem; font-weight: 700; line-height: 0.8; color: #e8e6e2; }
        .hv26__headline { font-family: 'Space Grotesk', sans-serif; font-size: clamp(3rem, 8vw, 6rem); font-weight: 700; text-transform: uppercase; line-height: 0.9; letter-spacing: -0.03em; margin: 0; display: flex; flex-wrap: wrap; gap: 0.15em; }
        .hv26__word--1 { color: #1a1a1a; }
        .hv26__word--2 { color: #666; }
        .hv26__word--3 { color: #bbb; }
        .hv26__img-block { position: relative; overflow: hidden; min-height: 350px; }
        .hv26__img { position: absolute; inset: 0; background-size: cover; background-position: center; opacity: 0; transition: opacity 0.8s; }
        .hv26__img.active { opacity: 1; }
        .hv26__info-block { padding: 2rem 0 2rem 3rem; display: flex; flex-direction: column; justify-content: flex-end; }
        .hv26__desc { font-family: 'Space Grotesk', sans-serif; font-size: 1rem; color: #666; line-height: 1.7; margin-bottom: 2rem; }
        .hv26__data { display: flex; flex-direction: column; gap: 0.75rem; margin-bottom: 2rem; }
        .hv26__data div { display: flex; gap: 1rem; align-items: baseline; }
        .hv26__data-label { font-family: 'Share Tech Mono', monospace; font-size: 0.5rem; text-transform: uppercase; letter-spacing: 0.15em; color: #bbb; width: 70px; flex-shrink: 0; }
        .hv26__data-val { font-family: 'Space Grotesk', sans-serif; font-size: 0.85rem; color: #1a1a1a; font-weight: 500; }
        .hv26__dots { display: flex; gap: 0.5rem; }
        .hv26__dot { width: 40px; height: 3px; background: #e0e0e0; border: none; cursor: pointer; padding: 0; transition: all 0.3s; }
        .hv26__dot.active { background: #1a1a1a; }

        /* ===== V27: Logbook ===== */
        .hv27 { display: flex; min-height: 75vh; background: #d4cfc6; padding: 2rem; gap: 0; }
        .hv27__spine { width: 20px; background: linear-gradient(90deg, #8a7e6e, #a0957f, #8a7e6e); border-radius: 2px; flex-shrink: 0; }
        .hv27__page { flex: 1; background: #faf8f3; position: relative; overflow: hidden; }
        .hv27__page--left { border-right: 1px solid #e0d8c8; }
        .hv27__ruled { position: absolute; inset: 0; padding-top: 60px; pointer-events: none; }
        .hv27__rule-line { height: 1px; background: rgba(100,150,200,0.1); margin-bottom: 28px; }
        .hv27__page-content { position: relative; z-index: 1; padding: 2.5rem; }
        .hv27__page-header { font-family: 'Share Tech Mono', monospace; font-size: 0.55rem; text-transform: uppercase; letter-spacing: 0.2em; color: #b0a898; display: block; margin-bottom: 2rem; padding-bottom: 0.75rem; border-bottom: 1px solid #e0d8c8; }
        .hv27__entry { }
        .hv27__entry-date { font-family: 'Share Tech Mono', monospace; font-size: 0.6rem; text-transform: uppercase; letter-spacing: 0.15em; color: #999; display: block; margin-bottom: 0.5rem; }
        .hv27__entry-pre { font-family: 'Share Tech Mono', monospace; font-size: 0.6rem; text-transform: uppercase; letter-spacing: 0.2em; color: #a09888; display: block; margin-bottom: 0.5rem; }
        .hv27__headline { font-family: 'Space Grotesk', sans-serif; font-size: clamp(1.5rem, 3vw, 2.2rem); font-weight: 700; text-transform: uppercase; letter-spacing: -0.01em; color: #2a2218; margin: 0 0 1.25rem; line-height: 1.1; }
        .hv27__entry-text { font-family: 'Space Grotesk', sans-serif; font-size: 0.85rem; color: #6b5e50; line-height: 1.8; margin-bottom: 0.75rem; }
        .hv27__entry-footer { display: flex; justify-content: space-between; margin-top: 2rem; padding-top: 1rem; border-top: 1px solid #e0d8c8; }
        .hv27__entry-footer span { font-family: 'Share Tech Mono', monospace; font-size: 0.5rem; letter-spacing: 0.12em; color: #b0a898; text-transform: uppercase; }
        .hv27__photo-area { position: relative; height: 70%; margin: 2.5rem; overflow: hidden; }
        .hv27__photo { position: absolute; inset: 0; background-size: cover; background-position: center; opacity: 0; transition: opacity 0.8s; }
        .hv27__photo.active { opacity: 1; }
        .hv27__photo-tape { position: absolute; width: 50px; height: 20px; background: rgba(255,245,220,0.6); z-index: 1; }
        .hv27__photo-tape--tl { top: -5px; left: -10px; transform: rotate(-15deg); }
        .hv27__photo-tape--br { bottom: -5px; right: -10px; transform: rotate(-15deg); }
        .hv27__page-nav { display: flex; gap: 0.25rem; padding: 0 2.5rem; }
        .hv27__nav-btn { all: unset; font-family: 'Share Tech Mono', monospace; font-size: 0.55rem; padding: 0.35rem 0.6rem; border: 1px solid #e0d8c8; cursor: pointer; color: #b0a898; transition: all 0.3s; }
        .hv27__nav-btn.active { background: #2a2218; color: #faf8f3; border-color: #2a2218; }

        /* ===== V28: Runway ===== */
        .hv28 { position: relative; height: 88vh; min-height: 520px; overflow: hidden; }
        .hv28__bg-img { position: absolute; inset: 0; background-size: cover; background-position: center; opacity: 0; transition: opacity 1s ease; }
        .hv28__bg-img.active { opacity: 1; }
        .hv28__overlay { position: absolute; inset: 0; background: rgba(0,0,0,0.6); z-index: 1; }
        .hv28__runway { position: absolute; bottom: 0; left: 50%; transform: translateX(-50%); width: 120px; height: 100%; z-index: 2; pointer-events: none; }
        .hv28__marking--threshold { position: absolute; bottom: 2rem; left: 50%; transform: translateX(-50%); display: flex; gap: 6px; }
        .hv28__stripe { width: 8px; height: 50px; background: rgba(255,255,255,0.15); }
        .hv28__centerline { position: absolute; bottom: 80px; left: 50%; transform: translateX(-50%); display: flex; flex-direction: column; gap: 30px; }
        .hv28__dash { width: 3px; height: 20px; background: rgba(255,255,255,0.1); }
        .hv28__designator { position: absolute; bottom: 60px; left: 50%; transform: translateX(-50%); font-family: 'Space Grotesk', sans-serif; font-size: 2rem; font-weight: 700; color: rgba(255,255,255,0.06); }
        .hv28__content { position: relative; z-index: 3; height: 100%; display: flex; flex-direction: column; align-items: center; justify-content: center; text-align: center; padding: 3rem; }
        .hv28__atc-bar { display: flex; gap: 2rem; margin-bottom: 2.5rem; padding: 0.6rem 1.5rem; border: 1px solid rgba(255,255,255,0.1); }
        .hv28__atc-bar span { font-family: 'Share Tech Mono', monospace; font-size: 0.55rem; text-transform: uppercase; letter-spacing: 0.2em; color: rgba(255,255,255,0.35); }
        .hv28__pre { font-family: 'Share Tech Mono', monospace; font-size: 0.7rem; text-transform: uppercase; letter-spacing: 0.3em; color: rgba(255,255,255,0.4); margin-bottom: 1rem; }
        .hv28__headline { font-family: 'Space Grotesk', sans-serif; font-size: clamp(3rem, 7vw, 5.5rem); font-weight: 700; text-transform: uppercase; line-height: 0.95; letter-spacing: -0.02em; margin: 0 0 1.25rem; }
        .hv28__word--1 { color: #fff; }
        .hv28__word--2 { color: rgba(255,255,255,0.55); }
        .hv28__word--3 { color: rgba(255,255,255,0.3); }
        .hv28__desc { font-family: 'Space Grotesk', sans-serif; font-size: 1rem; color: rgba(255,255,255,0.45); max-width: 450px; line-height: 1.6; margin-bottom: 2.5rem; }
        .hv28__cta { display: inline-flex; align-items: center; gap: 0.5rem; padding: 0.9rem 2rem; font-family: 'Space Grotesk', sans-serif; font-size: 0.7rem; font-weight: 600; text-transform: uppercase; letter-spacing: 0.1em; text-decoration: none; background: #fff; color: #0a0a0a; transition: all 0.3s; }
        .hv28__cta:hover { background: #e0e0e0; }
        .hv28__dots { position: absolute; bottom: 2.5rem; left: 50%; transform: translateX(-50%); z-index: 3; display: flex; gap: 0.5rem; }
        .hv28__dot { width: 40px; height: 3px; background: rgba(255,255,255,0.15); border: none; cursor: pointer; padding: 0; transition: all 0.3s; }
        .hv28__dot.active { background: #fff; }

        /* ===== V29: Layered Depth ===== */
        .hv29 { position: relative; height: 90vh; min-height: 550px; overflow: hidden; }
        .hv29__layer { position: absolute; inset: 0; }
        .hv29__layer--bg { z-index: 0; }
        .hv29__bg-img { position: absolute; inset: 0; background-size: cover; background-position: center; opacity: 0; transition: opacity 1s ease; }
        .hv29__bg-img.active { opacity: 1; }
        .hv29__layer--mid { z-index: 1; display: flex; align-items: center; justify-content: center; }
        .hv29__ghost { font-family: 'Space Grotesk', sans-serif; font-size: clamp(6rem, 18vw, 14rem); font-weight: 700; text-transform: uppercase; line-height: 0.85; letter-spacing: -0.04em; color: rgba(255,255,255,0.06); text-align: center; white-space: nowrap; }
        .hv29__layer--overlay { z-index: 2; background: rgba(0,0,0,0.45); }
        .hv29__layer--front { z-index: 3; display: flex; align-items: center; justify-content: center; }
        .hv29__content { text-align: center; max-width: 600px; padding: 2rem; }
        .hv29__pre { font-family: 'Share Tech Mono', monospace; font-size: 0.7rem; text-transform: uppercase; letter-spacing: 0.3em; color: rgba(255,255,255,0.4); display: block; margin-bottom: 1.25rem; }
        .hv29__headline { font-family: 'Space Grotesk', sans-serif; font-size: clamp(2.5rem, 6vw, 4.5rem); font-weight: 700; text-transform: uppercase; line-height: 0.95; letter-spacing: -0.02em; margin: 0 0 1.25rem; }
        .hv29__word--1 { color: #fff; }
        .hv29__word--2 { color: rgba(255,255,255,0.6); }
        .hv29__word--3 { color: rgba(255,255,255,0.3); }
        .hv29__desc { font-family: 'Space Grotesk', sans-serif; font-size: 1rem; color: rgba(255,255,255,0.5); line-height: 1.6; margin-bottom: 2.5rem; }
        .hv29__actions { display: flex; align-items: center; justify-content: center; gap: 2rem; }
        .hv29__cta { padding: 0.9rem 2rem; font-family: 'Space Grotesk', sans-serif; font-size: 0.7rem; font-weight: 600; text-transform: uppercase; letter-spacing: 0.1em; text-decoration: none; background: #fff; color: #0a0a0a; transition: all 0.3s; }
        .hv29__cta:hover { background: #e0e0e0; }
        .hv29__dots { display: flex; gap: 0.5rem; }
        .hv29__dot { width: 40px; height: 3px; background: rgba(255,255,255,0.2); border: none; cursor: pointer; padding: 0; transition: all 0.3s; }
        .hv29__dot.active { background: #fff; }
        .hv29__brand { position: absolute; bottom: 2rem; left: 0; right: 0; z-index: 4; display: flex; align-items: center; justify-content: center; gap: 1.5rem; }
        .hv29__brand span { font-family: 'Share Tech Mono', monospace; font-size: 0.55rem; text-transform: uppercase; letter-spacing: 0.15em; color: rgba(255,255,255,0.25); }
        .hv29__brand-sep { width: 20px; height: 1px; background: rgba(255,255,255,0.15); }

        /* ===== V30: Aviation Chart ===== */
        .hv30 { position: relative; height: 100vh; background: #faf9f6; overflow: hidden; }
        .hv30__chart-bg { position: absolute; inset: 0; z-index: 0; }
        .hv30__chart-svg { width: 100%; height: 100%; }
        .hv30__layout { position: relative; z-index: 1; display: grid; grid-template-columns: 0.6fr 1fr; gap: 2rem; max-width: 1400px; margin: 0 auto; padding: 4rem 3rem; align-items: center; height: 100vh; }
        .hv30__left { position: relative; z-index: 2; }
        .hv30__brand { }
        .hv30__brand-name { display: block; font-family: 'Space Grotesk', sans-serif; font-size: 3rem; font-weight: 700; line-height: 1; margin-bottom: 0; text-transform: uppercase; letter-spacing: -0.01em; -webkit-text-stroke: 2px #faf9f6; paint-order: stroke fill; }
        .hv30__brand-w1 { color: #1a1a1a; }
        .hv30__brand-w2 { color: #4a4a4a; }
        .hv30__brand-sub { display: block; font-family: 'Space Grotesk', sans-serif; font-size: 0.85rem; font-weight: 400; color: #555; margin-bottom: 0.75rem; }
        .hv30__brand-tag { display: inline-flex; align-items: center; font-family: 'Share Tech Mono', monospace; font-size: 0.85rem; letter-spacing: 0.15em; text-transform: uppercase; color: #888; -webkit-text-stroke: 1px #faf9f6; paint-order: stroke fill; }
        .hv30__brand-coords { display: block; font-family: 'Share Tech Mono', monospace; font-size: 0.8rem; letter-spacing: 0.2em; color: #999; margin-top: 0.5rem; -webkit-text-stroke: 1px #faf9f6; paint-order: stroke fill; }
        .hv30__center { text-align: center; position: relative; z-index: 2; }
        .hv30__pre { font-family: 'Share Tech Mono', monospace; font-size: 0.65rem; text-transform: uppercase; letter-spacing: 0.25em; color: #999; display: block; margin-bottom: 0.75rem; }
        .hv30__headline { font-family: 'Space Grotesk', sans-serif; font-size: clamp(2rem, 4vw, 3rem); font-weight: 700; text-transform: uppercase; line-height: 1.05; letter-spacing: -0.02em; margin: 0 0 1.25rem; display: flex; flex-wrap: wrap; gap: 0.2em; justify-content: center; }
        .hv30__word--1 { color: #1a1a1a; }
        .hv30__word--2 { color: #4a4a4a; }
        .hv30__word--3 { color: #7a7a7a; }
        .hv30__desc { font-family: 'Space Grotesk', sans-serif; font-size: 0.95rem; color: #666; line-height: 1.7; max-width: 400px; margin: 0 auto 2rem; }
        .hv30__cta { display: inline-flex; align-items: center; gap: 0.5rem; padding: 0.9rem 1.8rem; font-family: 'Space Grotesk', sans-serif; font-size: 0.7rem; font-weight: 600; text-transform: uppercase; letter-spacing: 0.08em; text-decoration: none; background: #1a1a1a; color: #faf9f6; border-radius: 4px; transition: all 0.3s; }
        .hv30__cta:hover { background: #333; }
        .hv30__chev { position: absolute; top: 50%; transform: translateY(-50%); z-index: 5; background: none; border: none; padding: 1rem; cursor: pointer; color: rgba(26,26,26,0.4); transition: color 0.3s; }
        .hv30__chev:hover { color: #1a1a1a; }
        .hv30__chev svg { width: 20px; height: 20px; stroke: currentColor; stroke-width: 1.5; fill: none; }
        .hv30__chev--prev { left: 1.5rem; }
        .hv30__chev--next { right: 1.5rem; }
        .hv30__right { position: absolute; inset: 0; z-index: 0; pointer-events: none; }
        .hv30__right::before { content: ''; position: absolute; inset: 0; z-index: 1; background: linear-gradient(to right, #faf9f6 0%, rgba(250,249,246,0.6) 15%, transparent 40%, transparent 60%, rgba(250,249,246,0.6) 85%, #faf9f6 100%); pointer-events: none; }
        .hv30__img-panel--full { position: absolute; inset: 0; overflow: hidden; z-index: 0; pointer-events: none; }

        /* Brand placements */
        .hv30__brand--tl { /* default top-left, already in layout grid */ }
        .hv30__brand--center { position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%); z-index: 2; text-align: center; }
        .hv30__brand--bl { position: absolute; bottom: 5rem; left: 3rem; z-index: 2; }
        .hv30__brand--br { position: absolute; bottom: 5rem; right: 3rem; z-index: 2; text-align: right; }
        .hv30__brand--tr { position: absolute; top: 3rem; right: 3rem; z-index: 2; text-align: right; }
        .hv30__brand--cl { position: absolute; top: 50%; left: 3rem; transform: translateY(-50%); z-index: 2; }
        .hv30__brand--cr { position: absolute; top: 50%; right: 3rem; transform: translateY(-50%); z-index: 2; text-align: right; }
        .hv30__brand--lg-center { position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%); z-index: 2; text-align: center; }
        .hv30__brand-name--lg { font-size: 5rem !important; }
        .hv30__brand--stacked-l { position: absolute; top: 50%; left: 3rem; transform: translateY(-50%); z-index: 2; }
        .hv30__brand-name--stacked { font-size: 4rem !important; line-height: 0.9 !important; }
        .hv30__brand--strip { position: absolute; bottom: 5rem; left: 0; right: 0; z-index: 2; display: flex; align-items: center; justify-content: center; gap: 1.5rem; padding: 1.2rem 3rem; background: rgba(250,249,246,0.85); backdrop-filter: blur(6px); }
        .hv30__brand--strip .hv30__brand-name { margin-bottom: 0; }
        .hv30__brand-strip-sep { width: 1px; height: 30px; background: rgba(0,0,0,0.15); }
        .hv30__img-panel { position: absolute; inset: 0; border-radius: 0; overflow: hidden; border: none; }
        .hv30__img { position: absolute; inset: 0; background-size: cover; background-position: center; opacity: 0; transition: opacity 0.8s; }
        .hv30__img.active { opacity: 1; }
        .hv30__thumbs {
          display: flex;
          gap: 0.5rem;
          padding: 1.5rem 3rem;
          overflow-x: auto;
          scrollbar-width: none;
          position: absolute;
          bottom: 0;
          left: 0;
          right: 0;
          z-index: 2;
        }
        .hv30__thumbs::-webkit-scrollbar { display: none; }
        .hv30__thumb {
          flex: 0 0 auto;
          width: 100px;
          height: 65px;
          border-radius: 4px;
          overflow: hidden;
          border: 2px solid transparent;
          padding: 0;
          background: none;
          cursor: pointer;
          opacity: 0.5;
          transition: all 0.3s;
        }
        .hv30__thumb:hover {
          opacity: 0.85;
        }
        .hv30__thumb--active {
          opacity: 1;
          border-color: #1a1a1a;
        }
        .hv30__thumb img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          display: block;
        }

        @media (max-width: 768px) {
          .hv21__hud-top { gap: 1rem; flex-wrap: wrap; }
          .hv22__img-row { flex-direction: column; }
          .hv22__paper { padding: 2rem; }
          .hv23__credits { flex-direction: column; gap: 1rem; }
          .hv24 { grid-template-columns: 1fr; }
          .hv26__layout { grid-template-columns: 1fr; }
          .hv26__info-block { padding-left: 0; }
          .hv27 { flex-direction: column; }
          .hv27__spine { width: 100%; height: 10px; }
          .hv30__layout { grid-template-columns: 1fr; }
          .hv30__right { position: relative; width: 100%; height: 300px; }
          .hv30__right::before { background: none; }
        }

        /* ===== V31: Split Diagonal ===== */
        .hv31 { position: relative; min-height: 80vh; overflow: hidden; background: #faf9f6; display: flex; align-items: center; }
        .hv31__img-side { position: absolute; top: 0; left: 0; width: 55%; height: 100%; }
        .hv31__img-side .hv31__img { position: absolute; inset: 0; background-size: cover; background-position: center; opacity: 0; transition: opacity 0.8s; }
        .hv31__img-side .hv31__img.active { opacity: 1; }
        .hv31__clip { position: absolute; top: 0; left: 50%; width: 60%; height: 100%; background: #faf9f6; transform: skewX(-8deg); transform-origin: top; z-index: 1; }
        .hv31__content { position: relative; z-index: 2; margin-left: auto; width: 45%; padding: 4rem 4rem 4rem 2rem; }
        .hv31__pre { font-family: 'Share Tech Mono', monospace; font-size: 0.65rem; text-transform: uppercase; letter-spacing: 0.25em; color: #999; display: block; margin-bottom: 0.75rem; }
        .hv31__headline { font-family: 'Space Grotesk', sans-serif; font-size: clamp(2rem, 4vw, 3.5rem); font-weight: 700; text-transform: uppercase; line-height: 1.05; margin: 0 0 1.25rem; }
        .hv31__word--1 { color: #1a1a1a; } .hv31__word--2 { color: #666; } .hv31__word--3 { color: #999; }
        .hv31__desc { font-family: 'Space Grotesk', sans-serif; font-size: 0.9rem; color: #666; line-height: 1.7; margin-bottom: 2rem; }
        .hv31__cta { display: inline-flex; align-items: center; gap: 0.5rem; padding: 0.85rem 1.8rem; font-family: 'Space Grotesk', sans-serif; font-size: 0.7rem; font-weight: 600; text-transform: uppercase; letter-spacing: 0.08em; text-decoration: none; background: #1a1a1a; color: #fff; border-radius: 4px; transition: background 0.3s; }
        .hv31__cta:hover { background: #333; }
        .hv31__dots { position: absolute; bottom: 2rem; right: 4rem; display: flex; gap: 0.4rem; z-index: 2; }
        .hv31__dot { width: 8px; height: 8px; border-radius: 50%; border: 1px solid #ccc; background: transparent; cursor: pointer; padding: 0; transition: all 0.3s; }
        .hv31__dot.active { background: #1a1a1a; border-color: #1a1a1a; }

        /* ===== V32: Vertical Ticker ===== */
        .hv32 { position: relative; min-height: 80vh; overflow: hidden; }
        .hv32__bg { position: absolute; inset: 0; } .hv32__bg-img { position: absolute; inset: 0; background-size: cover; background-position: center; opacity: 0; transition: opacity 0.8s; } .hv32__bg-img.active { opacity: 1; }
        .hv32__overlay { position: absolute; inset: 0; background: linear-gradient(135deg, rgba(0,0,0,0.75) 0%, rgba(0,0,0,0.4) 100%); }
        .hv32__inner { position: relative; z-index: 1; max-width: 1200px; margin: 0 auto; padding: 6rem 3rem; display: flex; justify-content: space-between; align-items: flex-end; min-height: 80vh; }
        .hv32__left { max-width: 600px; }
        .hv32__brand { font-family: 'Space Grotesk', sans-serif; font-size: 0.7rem; font-weight: 600; text-transform: uppercase; letter-spacing: 0.15em; color: rgba(255,255,255,0.5); display: block; margin-bottom: 2rem; }
        .hv32__ticker { position: relative; height: 120px; overflow: hidden; margin-bottom: 1.5rem; }
        .hv32__ticker-item { position: absolute; inset: 0; opacity: 0; transform: translateY(20px); transition: all 0.5s; }
        .hv32__ticker-item.active { opacity: 1; transform: translateY(0); }
        .hv32__headline { font-family: 'Space Grotesk', sans-serif; font-size: clamp(2rem, 4vw, 3.5rem); font-weight: 700; text-transform: uppercase; line-height: 1.05; color: #fff; margin: 0 0 0.75rem; }
        .hv32__desc { font-family: 'Space Grotesk', sans-serif; font-size: 0.9rem; color: rgba(255,255,255,0.6); line-height: 1.7; }
        .hv32__cta { display: inline-flex; align-items: center; gap: 0.5rem; padding: 0.85rem 1.8rem; font-family: 'Space Grotesk', sans-serif; font-size: 0.7rem; font-weight: 600; text-transform: uppercase; letter-spacing: 0.08em; text-decoration: none; background: #fff; color: #1a1a1a; border-radius: 4px; transition: all 0.3s; }
        .hv32__cta:hover { background: #e8e6e2; }
        .hv32__counter { font-family: 'Share Tech Mono', monospace; color: rgba(255,255,255,0.3); display: flex; align-items: baseline; gap: 0.25rem; }
        .hv32__num { font-size: 3rem; color: #fff; }
        .hv32__sep { font-size: 1.5rem; } .hv32__total { font-size: 1rem; }
        .hv32__nav { position: absolute; bottom: 2rem; left: 50%; transform: translateX(-50%); display: flex; gap: 0.5rem; z-index: 2; }
        .hv32__nav-btn { width: 30px; height: 3px; border: none; background: rgba(255,255,255,0.3); cursor: pointer; padding: 0; transition: all 0.3s; }
        .hv32__nav-btn.active { background: #fff; }

        /* ===== V33: Mosaic Grid ===== */
        .hv33 { background: #1a1a1a; min-height: 80vh; display: grid; grid-template-columns: 1fr 1fr; gap: 0; align-items: stretch; }
        .hv33__grid { display: grid; grid-template-columns: repeat(3, 1fr); grid-template-rows: 1fr 1fr; gap: 0.5rem; min-height: 80vh; }
        .hv33__tile { background-size: cover; background-position: center; border-radius: 4px; cursor: pointer; opacity: 0.5; transition: all 0.4s; border: 2px solid transparent; }
        .hv33__tile--active { opacity: 1; border-color: #fff; transform: scale(1.03); }
        .hv33__tile:hover { opacity: 0.8; }
        .hv33__content { padding: 3rem; display: flex; flex-direction: column; justify-content: center; }
        .hv33__pre { font-family: 'Share Tech Mono', monospace; font-size: 0.65rem; text-transform: uppercase; letter-spacing: 0.25em; color: #666; display: block; margin-bottom: 0.75rem; }
        .hv33__headline { font-family: 'Space Grotesk', sans-serif; font-size: clamp(2rem, 4vw, 3rem); font-weight: 700; text-transform: uppercase; line-height: 1.05; color: #fff; margin: 0 0 1rem; display: flex; flex-wrap: wrap; gap: 0.2em; }
        .hv33__word--1 { color: #fff; } .hv33__word--2 { color: #888; } .hv33__word--3 { color: #555; }
        .hv33__desc { font-family: 'Space Grotesk', sans-serif; font-size: 0.9rem; color: #999; line-height: 1.7; margin-bottom: 2rem; }
        .hv33__cta { display: inline-flex; align-items: center; gap: 0.5rem; padding: 0.85rem 1.8rem; font-family: 'Space Grotesk', sans-serif; font-size: 0.7rem; font-weight: 600; text-transform: uppercase; letter-spacing: 0.08em; text-decoration: none; border: 1px solid #fff; color: #fff; border-radius: 4px; transition: all 0.3s; }
        .hv33__cta:hover { background: #fff; color: #1a1a1a; }

        /* ===== V34: Cinematic Bars ===== */
        .hv34 { position: relative; min-height: 80vh; overflow: hidden; display: flex; align-items: center; justify-content: center; }
        .hv34__bg { position: absolute; inset: 0; } .hv34__bg-img { position: absolute; inset: 0; background-size: cover; background-position: center; opacity: 0; transition: opacity 0.8s; } .hv34__bg-img.active { opacity: 1; }
        .hv34__bar { position: absolute; left: 0; right: 0; background: #0a0a0a; z-index: 1; }
        .hv34__bar--top { top: 0; height: 12%; }
        .hv34__bar--bottom { bottom: 0; height: 12%; }
        .hv34__center { position: relative; z-index: 2; text-align: center; }
        .hv34__center .hv34__pre { font-family: 'Share Tech Mono', monospace; font-size: 0.65rem; text-transform: uppercase; letter-spacing: 0.3em; color: rgba(255,255,255,0.5); display: block; margin-bottom: 0.75rem; }
        .hv34__center .hv34__headline { font-family: 'Space Grotesk', sans-serif; font-size: clamp(3rem, 6vw, 5rem); font-weight: 700; text-transform: uppercase; line-height: 1; color: #fff; text-shadow: 0 4px 30px rgba(0,0,0,0.5); }
        .hv34__word--1 { color: #fff; } .hv34__word--2 { color: rgba(255,255,255,0.7); } .hv34__word--3 { color: rgba(255,255,255,0.4); }
        .hv34__bottom { position: absolute; bottom: 14%; left: 0; right: 0; z-index: 2; display: flex; justify-content: center; align-items: center; gap: 2rem; }
        .hv34__bottom .hv34__desc { font-family: 'Space Grotesk', sans-serif; font-size: 0.85rem; color: rgba(255,255,255,0.6); }
        .hv34__dots { display: flex; gap: 0.4rem; }
        .hv34__dot { width: 8px; height: 8px; border-radius: 50%; border: 1px solid rgba(255,255,255,0.4); background: transparent; cursor: pointer; padding: 0; transition: all 0.3s; }
        .hv34__dot.active { background: #fff; border-color: #fff; }

        /* ===== V35: Polaroid Stack ===== */
        .hv35 { background: #f5f3ef; min-height: 80vh; display: flex; align-items: center; justify-content: center; gap: 4rem; padding: 4rem 3rem; }
        .hv35__stack { position: relative; width: 350px; height: 400px; }
        .hv35__polaroid { position: absolute; inset: 0; background-size: cover; background-position: center; border: 8px solid #fff; box-shadow: 0 8px 30px rgba(0,0,0,0.15); border-radius: 2px; cursor: pointer; transition: all 0.5s ease; }
        .hv35__polaroid--active { box-shadow: 0 12px 40px rgba(0,0,0,0.25); }
        .hv35__text { max-width: 400px; }
        .hv35__pre { font-family: 'Share Tech Mono', monospace; font-size: 0.65rem; text-transform: uppercase; letter-spacing: 0.25em; color: #999; display: block; margin-bottom: 0.75rem; }
        .hv35__headline { font-family: 'Space Grotesk', sans-serif; font-size: clamp(2rem, 3.5vw, 2.8rem); font-weight: 700; text-transform: uppercase; line-height: 1.05; margin: 0 0 1rem; display: flex; flex-wrap: wrap; gap: 0.2em; }
        .hv35__word--1 { color: #1a1a1a; } .hv35__word--2 { color: #888; } .hv35__word--3 { color: #bbb; }
        .hv35__desc { font-family: 'Space Grotesk', sans-serif; font-size: 0.9rem; color: #666; line-height: 1.7; margin-bottom: 2rem; }
        .hv35__cta { display: inline-flex; align-items: center; gap: 0.5rem; padding: 0.85rem 1.8rem; font-family: 'Space Grotesk', sans-serif; font-size: 0.7rem; font-weight: 600; text-transform: uppercase; letter-spacing: 0.08em; text-decoration: none; background: #1a1a1a; color: #fff; border-radius: 4px; transition: background 0.3s; }
        .hv35__cta:hover { background: #333; }

        /* ===== V36: Bold Overlap ===== */
        .hv36 { position: relative; min-height: 80vh; background: #faf9f6; overflow: hidden; }
        .hv36__img-frame { position: relative; width: 65%; height: 70vh; margin: 5vh 0 0 5%; border-radius: 8px; overflow: hidden; }
        .hv36__img { position: absolute; inset: 0; background-size: cover; background-position: center; opacity: 0; transition: opacity 0.8s; }
        .hv36__img.active { opacity: 1; }
        .hv36__overlay-text { position: absolute; bottom: 15%; left: 8%; z-index: 2; }
        .hv36__overlay-text .hv36__headline { font-family: 'Space Grotesk', sans-serif; font-size: clamp(3rem, 7vw, 6rem); font-weight: 700; text-transform: uppercase; line-height: 0.95; display: flex; flex-wrap: wrap; gap: 0.15em; }
        .hv36__word--1 { color: #1a1a1a; -webkit-text-stroke: 1px #1a1a1a; } .hv36__word--2 { color: transparent; -webkit-text-stroke: 1px #1a1a1a; }
        .hv36__info { position: absolute; top: 50%; right: 5%; transform: translateY(-50%); width: 280px; z-index: 2; }
        .hv36__pre { font-family: 'Share Tech Mono', monospace; font-size: 0.65rem; text-transform: uppercase; letter-spacing: 0.25em; color: #999; display: block; margin-bottom: 0.5rem; }
        .hv36__info .hv36__desc { font-family: 'Space Grotesk', sans-serif; font-size: 0.85rem; color: #666; line-height: 1.7; margin-bottom: 1.5rem; }
        .hv36__info .hv36__cta { display: inline-flex; align-items: center; gap: 0.5rem; padding: 0.75rem 1.5rem; font-family: 'Space Grotesk', sans-serif; font-size: 0.7rem; font-weight: 600; text-transform: uppercase; letter-spacing: 0.08em; text-decoration: none; background: #1a1a1a; color: #fff; border-radius: 4px; transition: background 0.3s; margin-bottom: 1.5rem; display: block; text-align: center; }
        .hv36__info .hv36__cta:hover { background: #333; }
        .hv36__dots { display: flex; gap: 0.4rem; }
        .hv36__dot { width: 8px; height: 8px; border-radius: 50%; border: 1px solid #ccc; background: transparent; cursor: pointer; padding: 0; transition: all 0.3s; }
        .hv36__dot.active { background: #1a1a1a; border-color: #1a1a1a; }

        /* ===== V37: Horizontal Scroll ===== */
        .hv37 { background: #0a0a0a; min-height: 80vh; display: flex; flex-direction: column; justify-content: center; padding: 4rem 0; }
        .hv37__track { display: flex; gap: 1rem; padding: 0 3rem; overflow-x: auto; scrollbar-width: none; margin-bottom: 3rem; }
        .hv37__track::-webkit-scrollbar { display: none; }
        .hv37__card { flex: 0 0 250px; height: 320px; background-size: cover; background-position: center; border-radius: 6px; cursor: pointer; opacity: 0.4; transition: all 0.4s; border: 2px solid transparent; }
        .hv37__card--active { opacity: 1; border-color: #fff; flex: 0 0 350px; }
        .hv37__card:hover { opacity: 0.7; }
        .hv37__content { padding: 0 3rem; max-width: 600px; }
        .hv37__brand { font-family: 'Share Tech Mono', monospace; font-size: 0.6rem; text-transform: uppercase; letter-spacing: 0.2em; color: #555; display: block; margin-bottom: 1rem; }
        .hv37__headline { font-family: 'Space Grotesk', sans-serif; font-size: clamp(1.8rem, 3.5vw, 2.5rem); font-weight: 700; text-transform: uppercase; line-height: 1.05; color: #fff; margin: 0 0 0.75rem; }
        .hv37__word--1 { color: #fff; } .hv37__word--2 { color: #888; } .hv37__word--3 { color: #555; }
        .hv37__desc { font-family: 'Space Grotesk', sans-serif; font-size: 0.85rem; color: #777; line-height: 1.7; }

        /* ===== V38: Vertical Split ===== */
        .hv38 { display: grid; grid-template-columns: 1fr 1fr; min-height: 80vh; }
        .hv38__left { position: relative; overflow: hidden; }
        .hv38__img-wrap { position: absolute; inset: 0; }
        .hv38__img { position: absolute; inset: 0; background-size: cover; background-position: center; opacity: 0; transition: opacity 0.8s; }
        .hv38__img.active { opacity: 1; }
        .hv38__right { display: flex; flex-direction: column; justify-content: center; padding: 4rem; background: #faf9f6; }
        .hv38__right .hv38__brand { font-family: 'Space Grotesk', sans-serif; font-size: 1.2rem; font-weight: 700; text-transform: uppercase; letter-spacing: -0.01em; color: #1a1a1a; display: block; margin-bottom: 2rem; padding-bottom: 1rem; border-bottom: 1px solid #e8e6e2; }
        .hv38__pre { font-family: 'Share Tech Mono', monospace; font-size: 0.65rem; text-transform: uppercase; letter-spacing: 0.25em; color: #999; display: block; margin-bottom: 0.75rem; }
        .hv38__headline { font-family: 'Space Grotesk', sans-serif; font-size: clamp(2rem, 3.5vw, 3rem); font-weight: 700; text-transform: uppercase; line-height: 1.05; margin: 0 0 1rem; display: flex; flex-wrap: wrap; gap: 0.2em; }
        .hv38__word--1 { color: #1a1a1a; } .hv38__word--2 { color: #888; } .hv38__word--3 { color: #bbb; }
        .hv38__desc { font-family: 'Space Grotesk', sans-serif; font-size: 0.9rem; color: #666; line-height: 1.7; margin-bottom: 2rem; }
        .hv38__cta { display: inline-flex; align-items: center; gap: 0.5rem; padding: 0.85rem 1.8rem; font-family: 'Space Grotesk', sans-serif; font-size: 0.7rem; font-weight: 600; text-transform: uppercase; letter-spacing: 0.08em; text-decoration: none; background: #1a1a1a; color: #fff; border-radius: 4px; transition: background 0.3s; margin-bottom: 2rem; }
        .hv38__cta:hover { background: #333; }
        .hv38__dots { display: flex; gap: 0.4rem; }
        .hv38__dot { width: 8px; height: 8px; border-radius: 50%; border: 1px solid #ccc; background: transparent; cursor: pointer; padding: 0; transition: all 0.3s; }
        .hv38__dot.active { background: #1a1a1a; border-color: #1a1a1a; }

        /* ===== V39: Window Pane ===== */
        .hv39 { background: #faf9f6; min-height: 80vh; display: grid; grid-template-columns: 1fr 1fr; gap: 0; align-items: stretch; }
        .hv39__panes { display: grid; grid-template-columns: 2fr 1fr; grid-template-rows: 1fr 1fr; gap: 0.75rem; min-height: 80vh; }
        .hv39__pane { position: relative; border-radius: 6px; overflow: hidden; }
        .hv39__pane--large { grid-row: 1 / -1; }
        .hv39__pane .hv39__img { position: absolute; inset: 0; background-size: cover; background-position: center; opacity: 0; transition: opacity 0.8s; }
        .hv39__pane .hv39__img.active { opacity: 1; }
        .hv39__text { padding: 3rem; display: flex; flex-direction: column; justify-content: center; }
        .hv39__pre { font-family: 'Share Tech Mono', monospace; font-size: 0.65rem; text-transform: uppercase; letter-spacing: 0.25em; color: #999; display: block; margin-bottom: 0.75rem; }
        .hv39__headline { font-family: 'Space Grotesk', sans-serif; font-size: clamp(2rem, 3.5vw, 3rem); font-weight: 700; text-transform: uppercase; line-height: 1.05; margin: 0 0 1rem; }
        .hv39__word--1 { color: #1a1a1a; } .hv39__word--2 { color: #888; } .hv39__word--3 { color: #bbb; }
        .hv39__desc { font-family: 'Space Grotesk', sans-serif; font-size: 0.9rem; color: #666; line-height: 1.7; margin-bottom: 2rem; }
        .hv39__dots { display: flex; gap: 0.4rem; }
        .hv39__dot { width: 8px; height: 8px; border-radius: 50%; border: 1px solid #ccc; background: transparent; cursor: pointer; padding: 0; transition: all 0.3s; }
        .hv39__dot.active { background: #1a1a1a; border-color: #1a1a1a; }

        /* ===== V40: Minimal Edge ===== */
        .hv40 { position: relative; min-height: 80vh; overflow: hidden; }
        .hv40__bg { position: absolute; inset: 0; } .hv40__bg-img { position: absolute; inset: 0; background-size: cover; background-position: center; opacity: 0; transition: opacity 0.8s; } .hv40__bg-img.active { opacity: 1; }
        .hv40__gradient { position: absolute; inset: 0; background: linear-gradient(to top, rgba(0,0,0,0.7) 0%, transparent 50%, rgba(0,0,0,0.3) 100%); }
        .hv40__content { position: relative; z-index: 1; min-height: 80vh; display: flex; flex-direction: column; justify-content: space-between; padding: 3rem; }
        .hv40__top { display: flex; justify-content: space-between; align-items: center; }
        .hv40__top .hv40__brand { font-family: 'Space Grotesk', sans-serif; font-size: 1.1rem; font-weight: 700; text-transform: uppercase; letter-spacing: 0.05em; color: #fff; }
        .hv40__top .hv40__tag { font-family: 'Share Tech Mono', monospace; font-size: 0.6rem; text-transform: uppercase; letter-spacing: 0.15em; color: rgba(255,255,255,0.5); }
        .hv40__bottom {}
        .hv40__headline { font-family: 'Space Grotesk', sans-serif; font-size: clamp(2.5rem, 5vw, 4rem); font-weight: 700; text-transform: uppercase; line-height: 1.05; color: #fff; margin: 0 0 1.5rem; }
        .hv40__word--1 { color: #fff; } .hv40__word--2 { color: rgba(255,255,255,0.7); } .hv40__word--3 { color: rgba(255,255,255,0.4); }
        .hv40__row { display: flex; justify-content: space-between; align-items: center; }
        .hv40__row .hv40__desc { font-family: 'Space Grotesk', sans-serif; font-size: 0.9rem; color: rgba(255,255,255,0.6); max-width: 500px; }
        .hv40__nav { display: flex; align-items: center; gap: 1rem; }
        .hv40__nav button { background: none; border: 1px solid rgba(255,255,255,0.3); border-radius: 50%; width: 36px; height: 36px; display: flex; align-items: center; justify-content: center; cursor: pointer; color: #fff; transition: all 0.3s; padding: 0; }
        .hv40__nav button:hover { border-color: #fff; background: rgba(255,255,255,0.1); }
        .hv40__counter { font-family: 'Share Tech Mono', monospace; font-size: 0.75rem; color: rgba(255,255,255,0.6); letter-spacing: 0.1em; }

        @media (max-width: 768px) {
          .hv31__img-side { width: 100%; height: 40vh; position: relative; } .hv31__clip { display: none; } .hv31__content { width: 100%; padding: 2rem; margin: 0; }
          .hv33 { grid-template-columns: 1fr; } .hv33__grid { grid-template-rows: repeat(2, 120px); }
          .hv35 { flex-direction: column; } .hv35__stack { width: 280px; height: 320px; }
          .hv36__img-frame { width: 90%; margin: 2vh auto 0; } .hv36__info { position: relative; top: auto; right: auto; transform: none; width: 100%; padding: 2rem; }
          .hv37__card { flex: 0 0 200px; height: 250px; } .hv37__card--active { flex: 0 0 260px; }
          .hv38 { grid-template-columns: 1fr; } .hv38__left { height: 50vh; }
          .hv39 { grid-template-columns: 1fr; } .hv39__panes { height: 350px; }
          .hv40__row { flex-direction: column; gap: 1.5rem; align-items: flex-start; }
        }

      `}</style>
    </div>
  );
}

export default Experimentation2;

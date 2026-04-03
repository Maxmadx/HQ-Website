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

import { useState, useEffect, useRef, Fragment } from 'react';
import { Link } from 'react-router-dom';
import { motion, useScroll, useTransform, useInView } from 'framer-motion';
import HeroSectionFinal from './HeroSectionFinal';

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
function ServiceSplitDots({ autoExpand = false }) {
  const [expanded, setExpanded] = useState(false);

  useEffect(() => {
    setExpanded(autoExpand);
  }, [autoExpand]);

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
function DealerSplitDots({ autoExpand = false }) {
  const [expanded, setExpanded] = useState(false);
  const dealerRef = useRef(null);

  useEffect(() => {
    setExpanded(autoExpand);
  }, [autoExpand]);

  return (
    <div className="cert-cloud cert-cloud--dealer" ref={dealerRef}>
      <div className={`cert-cloud__card ${expanded ? 'cert-cloud__card--expanded' : ''}`} onClick={() => setExpanded(!expanded)}>
        <div className="cert-cloud__dots"></div>
        <div className="cert-cloud__split">
          <div className="cert-cloud__upper">
            <img src="/assets/images/robinson-assets/logos/rhc-authorized-dealer-logo-logo-yellow-rotor-black-type.svg" alt="Robinson Authorized Dealer" className="cert-cloud__logo" />
          </div>
        </div>
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
  const [headerVisible, setHeaderVisible] = useState(false);

  // Scroll handler for spotlight animation
  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY;
      // Hero section is 280vh, scrollable = 180vh.
      // Hero logo fades out at progress 0.22→0.26, which is ~140-167vh of scroll.
      // Show header when hero animations are nearly done.
      const heroEndPx = window.innerHeight * 1.45; // ~145vh
      setHeaderVisible(scrollY > heroEndPx);

      // Spotlight animation starts after hero ends
      const adjustedScroll = Math.max(0, scrollY - heroEndPx);

      // Vertical completes FIRST (0 to 1 over first 150px after hero)
      const vProgress = Math.min(adjustedScroll / 150, 1);
      setVerticalProgress(vProgress);

      // Horizontal completes SECOND (0 to 1 over full 300px after hero)
      const hProgress = Math.min(adjustedScroll / 300, 1);
      setHorizontalProgress(hProgress);

      // Color changes at 300px after hero
      setColorDark(adjustedScroll > 300);
      // Position/size changes at 300px after hero
      setScrolled(adjustedScroll > 300);
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

      {/* Header with Spotlight — hidden during hero, fades in after */}
      <header
        className={`Header Header--top ${scrolled ? 'Header--scrolled' : ''}`}
        style={{
          '--spotlight-width': `${spotlightWidth}px`,
          '--spotlight-height': `${spotlightHeight}px`,
          opacity: headerVisible ? 1 : 0,
          pointerEvents: headerVisible ? 'auto' : 'none',
          transition: 'opacity 0.4s ease',
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
  '/assets/images/gallery/flying/foggy-evening-flying.jpg',
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
  const [scrollDest, setScrollDest] = useState(null);
  const [selectedAircraft, setSelectedAircraft] = useState('R44');
  const [scrollAircraft, setScrollAircraft] = useState(null);
  const sfhSectionRef = useRef(null);
  const sfhJourneyRef = useRef(null);
  const sfhGridRef = useRef(null);
  const isHoveringDest = useRef(false);
  const isHoveringFleet = useRef(false);
  const [tlProgress, setTlProgress] = useState(0);

  // Scroll-based destination cycling + timeline progress — starts once grid top scrolls past viewport
  useEffect(() => {
    const grid = sfhGridRef.current;
    const section = sfhSectionRef.current;
    if (!grid || !section) return;
    const handleScroll = () => {
      const gridRect = grid.getBoundingClientRect();
      const stickyOffset = window.innerHeight * 0.15; // 15vh
      // pixels scrolled past the point where the map becomes sticky
      const pastSticky = stickyOffset - gridRect.top;

      if (pastSticky <= 0) {
        setTlProgress(0);
        if (sfhJourneyRef.current) sfhJourneyRef.current.style.setProperty('--tl-progress', 0);
        if (!isHoveringDest.current && lockedDest === null) setScrollDest(null);
        return;
      }

      // total scrollable distance — complete animation at 60% of grid height
      const scrollableDistance = gridRect.height * 0.6;
      const progress = Math.max(0, Math.min(1, pastSticky / Math.max(scrollableDistance, 1)));

      setTlProgress(progress);
      if (sfhJourneyRef.current) {
        sfhJourneyRef.current.style.setProperty('--tl-progress', progress);
      }

      // Step 1: Destination cycling (0–0.33)
      if (!isHoveringDest.current && lockedDest === null) {
        if (progress < 0.02 || progress > 0.33) {
          setScrollDest(null);
        } else {
          const normalized = progress / 0.33;
          const idx = Math.min(Math.floor(normalized * sfhDestCoords.length), sfhDestCoords.length - 1);
          setScrollDest(idx);
        }
      }

      // Step 2: Aircraft cycling (0.33–0.66)
      if (!isHoveringFleet.current) {
        if (progress < 0.33 || progress > 0.66) {
          setScrollAircraft(null);
        } else {
          const normalized = (progress - 0.33) / 0.33;
          const aIdx = Math.min(Math.floor(normalized * sfhFleet.length), sfhFleet.length - 1);
          setScrollAircraft(sfhFleet[aIdx].model);
        }
      }
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, [lockedDest]);

  const activeDest = hoveredDest !== null ? hoveredDest : lockedDest !== null ? lockedDest : scrollDest;
  const activeAircraft = scrollAircraft !== null && !isHoveringFleet.current ? scrollAircraft : selectedAircraft;
  const denham = { x: 310, y: 480 };
  const range = sfhAircraftRanges[activeAircraft];

  return (
    <section className="sfh-map" id="fleet" ref={sfhSectionRef}>
      <style>{`
        .sfh-map { background: #e8e4df; color: #1a1a1a; border-bottom: 1px solid rgba(0, 0, 0, 0.12); }
        .sfh-map__inner { max-width: 1200px; margin: 0 auto; padding: 4rem 2rem 5rem; }
        .sfh-map__intro { margin-bottom: 1rem; display: grid; grid-template-columns: 1fr 1fr; gap: 1rem; align-items: center; }
        .sfh-map__intro-text { min-width: 0; padding: 0 2rem 0 0; }
        .sfh-map__intro-img { border-radius: 8px; overflow: hidden; background: #f2efea; border: 1px solid #ccc8c1; padding: 0.5rem; box-shadow: 0 4px 20px rgba(0,0,0,0.06); }
        .sfh-map__intro-img img { width: 100%; height: 100%; object-fit: cover; display: block; border-radius: 4px; }
        @media (max-width: 768px) {
          .sfh-map__intro { grid-template-columns: 1fr; }
          .sfh-map__intro-img { width: 100%; }
        }
        .sfh-map__pre-title { display: block; font-family: 'Share Tech Mono', monospace; font-size: 0.6rem; text-transform: uppercase; letter-spacing: 0.3em; color: #777; margin-bottom: 1.5rem; }
        .sfh-map__title { font-family: 'Space Grotesk', sans-serif; font-size: clamp(2rem, 4vw, 3.5rem); font-weight: 700; text-transform: uppercase; line-height: 1.1; margin-bottom: 1.5rem; }
        .sfh-map__title-line { display: block; }
        .sfh-map__title-line--2 { color: #999; }
        .sfh-map__tagline { font-size: 0.9rem; color: #555; line-height: 1.7; }

        .sfh-map__grid { display: grid; grid-template-columns: 1fr 1fr; gap: 1rem; align-items: start; }

        /* ── Map ── */
        .sfh-map__map-box { background: #f2efea; border: 1px solid #ccc8c1; border-radius: 8px; padding: 1.5rem; position: sticky; top: 15vh; box-shadow: 0 4px 20px rgba(0,0,0,0.06); max-height: 82.5vh; display: flex; flex-direction: column; overflow: hidden; }
        .sfh-map__map-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.75rem; }
        .sfh-map__map-header span { font-family: 'Share Tech Mono', monospace; font-size: 0.75rem; text-transform: uppercase; letter-spacing: 0.12em; color: #777; }
        .sfh-map__map-aircraft-label { display: block; font-family: 'Share Tech Mono', monospace; font-size: 0.7rem; text-transform: uppercase; letter-spacing: 0.1em; color: #777; margin-bottom: 1rem; }
        .sfh-map__map-aircraft-label strong { color: #1a1a1a; }
        .sfh-map__map { flex: 1; min-height: 0; overflow: hidden; }
        .sfh-map__map svg { width: 100%; height: 100%; max-height: 100%; display: block; }
        .sfh-map__pin { cursor: pointer; }
        .sfh-map__pin text { font-family: 'Space Grotesk', sans-serif; font-size: 12px; font-weight: 600; fill: #888; text-transform: uppercase; pointer-events: none; transition: fill 0.2s; }
        .sfh-map__pin--active text { fill: #1a1a1a; }
        .sfh-map__rlabel { font-family: 'Share Tech Mono', monospace; font-size: 9px; fill: #999; }
        .sfh-map__range-ring { transition: r 0.4s ease, stroke 0.3s; }

        /* ── Journey Timeline ── */
        .sfh-map__journey { padding: 2rem 0 0 2rem; }\n
        .sfh-map__journey-label { display: block; font-size: 0.6rem; text-transform: uppercase; letter-spacing: 0.3em; color: #777; margin-bottom: 2rem; font-family: 'Share Tech Mono', monospace; }

        .sfh-map__tl-step { display: grid; grid-template-columns: 36px 1fr; gap: 1rem; position: relative; }
        .sfh-map__tl-step::before { content: ''; position: absolute; left: 17px; top: 36px; bottom: 0; width: 2px; background: #ccc8c1; transition: none; }
        .sfh-map__tl-step::after { content: ''; position: absolute; left: 17px; top: 36px; bottom: 0; width: 2px; background: #1a1a1a; transform-origin: top; transform: scaleY(0); }
        .sfh-map__tl-step:nth-child(2)::after { transform: scaleY(clamp(0, calc(var(--tl-progress, 0) / 0.33), 1)); }
        .sfh-map__tl-step:nth-child(3)::after { transform: scaleY(clamp(0, calc((var(--tl-progress, 0) - 0.33) / 0.33), 1)); }
        .sfh-map__tl-num { width: 36px; height: 36px; border-radius: 50%; border: 1px solid #aaa; display: flex; align-items: center; justify-content: center; font-family: 'Share Tech Mono', monospace; font-size: 0.65rem; color: #777; background: #e8e4df; position: relative; z-index: 1; transition: border-color 0.3s, color 0.3s, background 0.3s; }
        .sfh-map__tl-step--active .sfh-map__tl-num { border-color: #1a1a1a; color: #fff; background: #1a1a1a; }
        .sfh-map__tl-title { font-family: 'Space Grotesk', sans-serif; font-size: 0.8rem; font-weight: 700; text-transform: uppercase; letter-spacing: 0.05em; color: #777; padding-top: 0.5rem; transition: color 0.3s; }
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
        .sfh-map__tl-step-03::before, .sfh-map__tl-step-03::after { display: none; }
        .sfh-map__fly-text { font-size: 0.85rem; color: #555; line-height: 1.6; padding-top: 0.5rem; }

        .sfh-map__fleet-row { display: flex; align-items: center; gap: 0.75rem; padding: 0.6rem 0.75rem; border: 1px solid #ccc8c1; color: #1a1a1a; transition: all 0.3s; margin-bottom: 0.5rem; cursor: pointer; text-decoration: none; }
        .sfh-map__fleet-row:hover { border-color: #888; }
        .sfh-map__fleet-row--active { border-color: #1a1a1a; background: rgba(0,0,0,0.04); }
        .sfh-map__fleet-row img { height: 28px; object-fit: contain; width: 48px; }
        .sfh-map__fleet-model { font-family: 'Space Grotesk', sans-serif; font-weight: 700; text-transform: uppercase; font-size: 0.75rem; }
        .sfh-map__fleet-info { font-size: 0.6rem; color: #777; }
        .sfh-map__fleet-rate { margin-left: auto; font-family: 'Share Tech Mono', monospace; font-size: 0.7rem; color: #555; }

        .sfh-map__cta { display: block; width: 100%; padding: 0.85rem; background: #1a1a1a; color: #fff; text-decoration: none; font-size: 0.7rem; text-transform: uppercase; letter-spacing: 0.1em; text-align: center; font-family: 'Space Grotesk', sans-serif; font-weight: 600; margin-top: 1.5rem; transition: background 0.3s; }
        .sfh-map__cta:hover { background: #333; color: #fff; }

        @media (max-width: 900px) {
          .sfh-map__grid { grid-template-columns: 1fr; }
        }
      `}</style>

      <div className="sfh-map__inner">
        <div className="sfh-map__intro">
          <div className="sfh-map__intro-text">
            <span className="sfh-map__pre-title">Freedom to Fly Yourself Anywhere</span>
            <h2 className="sfh-map__title">
              <span className="sfh-map__title-line">Your Aircraft</span>
              <span className="sfh-map__title-line sfh-map__title-line--2">Awaits</span>
            </h2>
            <p className="sfh-map__tagline">
              You've earned your licence. Now use it. Hire from our fleet of R22s, R44s and R66s — fuelled, washed and waiting on the pad for you, ready to go. Fly yourself to lunch in France, a weekend in the Cotswolds, a business meeting across the country, or just flying around for the beauty and fun of it. Available by the hour, day or week. No crew, no waiting, no compromise.
            </p>
          </div>
          <div className="sfh-map__intro-img">
            <img src="/assets/images/facility/hq-0167.jpg" alt="Helicopter on the pad" loading="lazy" />
          </div>
        </div>

        <div className="sfh-map__grid" ref={sfhGridRef}>
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
              <text x={denham.x + 12} y={denham.y + 3} fontFamily="Share Tech Mono" fontSize="10" fill="#666" fontWeight="700">DENHAM</text>

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
        <div className="sfh-map__journey" ref={sfhJourneyRef}>
          <span className="sfh-map__journey-label">Self-Fly Hire</span>

          <div className={`sfh-map__tl-step ${tlProgress > 0.02 ? 'sfh-map__tl-step--active' : ''}`}>
            <span className="sfh-map__tl-num">01</span>
            <div>
              <div className="sfh-map__tl-title">Select Destination</div>
              <ul className="sfh-map__dest-list">
                {sfhDestCoords.map((d, i) => (
                  <li
                    key={d.name}
                    className={`sfh-map__dest-item ${activeDest === i ? 'sfh-map__dest-item--active' : ''}`}
                    onMouseEnter={() => { isHoveringDest.current = true; setHoveredDest(i); }}
                    onMouseLeave={() => { isHoveringDest.current = false; setHoveredDest(null); }}
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

          <div className={`sfh-map__tl-step sfh-map__tl-step-02 ${tlProgress > 0.33 ? 'sfh-map__tl-step--active' : ''}`}>
            <span className="sfh-map__tl-num">02</span>
            <div>
              <div className="sfh-map__tl-title">Choose Your Aircraft</div>
              <div style={{ paddingTop: '1rem' }}>
                {sfhFleet.map(f => (
                  <div key={f.model} className={`sfh-map__fleet-row ${activeAircraft === f.model ? 'sfh-map__fleet-row--active' : ''}`} onMouseEnter={() => { isHoveringFleet.current = true; setSelectedAircraft(f.model); }} onMouseLeave={() => { isHoveringFleet.current = false; }} onClick={() => setSelectedAircraft(f.model)}>
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

          <div className={`sfh-map__tl-step sfh-map__tl-step-03 ${tlProgress > 0.66 ? 'sfh-map__tl-step--active' : ''}`}>
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

function ZigzagTrainingItem({ slide, index, isEven }) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.1 });

  return (
    <motion.div
      ref={ref}
      className={`fd-zigzag__item ${isEven ? 'fd-zigzag__item--left' : 'fd-zigzag__item--right'}`}
      initial={{ opacity: 0, y: 40 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
    >
      <div className="fd-zigzag__item-image">
        <img src={slide.image} alt={slide.title} />
        <span className="fd-zigzag__item-num">{String(index + 1).padStart(2, '0')}</span>
      </div>
      <div className="fd-zigzag__item-content">
        <span className="fd-zigzag__item-tag">{slide.tag} · {slide.duration}</span>
        <h3 className="fd-zigzag__item-title">{slide.title}</h3>
        <p className="fd-zigzag__item-desc">{slide.description}</p>
        <Link to={slide.link} className="fd-zigzag__card-btn">
          <span>{slide.cta}</span>
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M6 3L11 8L6 13" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg>
        </Link>
      </div>
    </motion.div>
  );
}

function EndOfMarchVersion() {
  const [activeNavSection, setActiveNavSection] = useState(null);
  const [rebuildStep, setRebuildStep] = useState(0);
  const [salesExpanded, setSalesExpanded] = useState({ new: false, preowned: false, rebuilt: false, unmanned: false });
  const [rebuildView, setRebuildView] = useState('option1');
  const [rebuildPortfolioIndex, setRebuildPortfolioIndex] = useState(0);
  const [rebuildDetailOpen, setRebuildDetailOpen] = useState(null); // index of open portfolio item
  const [stripImgIndex, setStripImgIndex] = useState({}); // { cardIndex: imageIndex }
  const [preownedImgIndex, setPreownedImgIndex] = useState({}); // { cardIndex: imageIndex }
  const [rebuildLightbox, setRebuildLightbox] = useState(null); // { src, alt } for full-screen image
  const [pricingTab, setPricingTab] = useState('training');
  const [pricingOpen, setPricingOpen] = useState(false);
  // Team carousel state
  const [teamSlide, setTeamSlide] = useState(0);
  const [facilitySlide, setFacilitySlide] = useState(0);
  const [partsAircraft, setPartsAircraft] = useState('');
  const [galleryFullscreen, setGalleryFullscreen] = useState(false);
  const [gallerySlide, setGallerySlide] = useState(0);
  const [galleryShowClock, setGalleryShowClock] = useState(false);
  const [clockTime, setClockTime] = useState('');
  const galleryImages = [
    { src: '/assets/images/facility/maintenance-.jpg', alt: 'Maintenance facility' },
    { src: '/assets/images/facility/hq-0391.jpg', alt: 'Engineering workshop' },
    { src: '/assets/images/facility/hq-0477.jpg', alt: 'Engine work' },
    { src: '/assets/images/facility/hq-0354.jpg', alt: 'Rotor inspection' },
    { src: '/assets/images/facility/hq-0035.jpg', alt: 'Hangar floor' },
    { src: '/assets/images/facility/hq-0089.jpg', alt: 'Component detail' },
    { src: '/assets/images/facility/hq-0745.jpg', alt: 'Aircraft on apron' },
    { src: '/assets/images/facility/sales-rebuild.jpg', alt: 'Rebuild in progress' },
    { src: '/assets/images/facility/hq-0167.jpg', alt: 'Avionics bench' },
    { src: '/assets/images/facility/okey-paint-quality.jpg', alt: 'Paint shop' },
  ];
  const facilityItems = [
    { icon: 'fa-warehouse', label: 'Main Hangar · 12,000 sq ft', images: [null, null, null, null, null] },
    { icon: 'fa-wrench', label: 'Service Bay · 8 Heated Bays', images: [null, null, null, null, null] },
    { icon: 'fa-spray-can', label: 'Paint Shop · Custom Livery', images: [null, null, null, null, null] },
    { icon: 'fa-microchip', label: 'Avionics Workshop', images: [null, null, null, null, null] },
    { icon: 'fa-boxes', label: 'Parts Store · £500K+ Inventory', images: [null, null, null, null, null] },
  ];
  const additionalTeam = [
    { initials: 'JB', name: 'James Barrett', desc: 'Airframe Specialist · 14 years · Robinson & Cabri certified' },
    { initials: 'ST', name: 'Simon Turner', desc: 'Paint & Refurbishment Lead · 10 years · Custom livery specialist' },
    { initials: 'RL', name: 'Richard Lloyd', desc: 'Avionics Technician · 8 years · Glass cockpit installations' },
    { initials: 'AP', name: 'Andrew Parsons', desc: 'Engine Workshop Lead · 12 years · Lycoming & RR300' },
    { initials: '+12', name: 'Supporting Team', desc: 'Workshop & support crew · Skilled technicians · Denham facility' },
  ];
  const [activeService, setActiveService] = useState(null);
  const rebuildShowcaseRef = useRef(null);

  useEffect(() => {
    if (rebuildDetailOpen !== null) {
      requestAnimationFrame(() => {
        if (rebuildShowcaseRef.current) {
          const top = rebuildShowcaseRef.current.getBoundingClientRect().top + window.scrollY - 120;
          window.scrollTo({ top, behavior: 'smooth' });
        }
      });
    }
  }, [rebuildDetailOpen]);

  // Blog state
  const [blogPersona, setBlogPersona] = useState('press');
  const [blogVisible, setBlogVisible] = useState(6);
  const [blogSort, setBlogSort] = useState('popular');
  const [blogSearch, setBlogSearch] = useState('');

  // Sales three-phase sticky
  const salesIntroRef = useRef(null);
  const salesHeaderRef = useRef(null);
  const salesPreTitleRef = useRef(null);
  const salesDealerRef = useRef(null);
  const [dealerAutoExpand, setDealerAutoExpand] = useState(false);

  useEffect(() => {
    const dealerEl = salesDealerRef.current;
    const introEl = salesIntroRef.current;
    const headerEl = salesHeaderRef.current;
    const ptEl = salesPreTitleRef.current;
    if (!dealerEl || !introEl || !headerEl || !ptEl) return;

    let phase1Top, phase3Top;
    const measure = () => {
      const vh10 = window.innerHeight * 0.10;
      phase1Top = vh10 + headerEl.offsetHeight;
      phase3Top = vh10 + 32 + ptEl.offsetHeight + 8;
      dealerEl.style.top = phase1Top + 'px';
    };

    let currentPhase = 1;
    const handleScroll = () => {
      const rect = introEl.getBoundingClientRect();
      const scrolled = -rect.top;
      const vh = window.innerHeight;
      const threshold = vh * 0.10;
      const newPhase = scrolled >= threshold ? 3 : 1;
      if (newPhase !== currentPhase) {
        currentPhase = newPhase;
        dealerEl.style.top = (newPhase === 1 ? phase1Top : phase3Top) + 'px';
      }
      const expandThreshold = threshold + vh * 0.10;
      if (scrolled >= expandThreshold) {
        setDealerAutoExpand(true);
      } else {
        setDealerAutoExpand(false);
      }
    };

    measure();
    window.addEventListener('scroll', handleScroll, { passive: true });
    const onResize = () => { measure(); currentPhase = 0; handleScroll(); };
    window.addEventListener('resize', onResize);
    return () => { window.removeEventListener('scroll', handleScroll); window.removeEventListener('resize', onResize); };
  }, []);

  // Maintenance three-phase sticky (same pattern as sales)
  const maintIntroRef = useRef(null);
  const maintHeaderRef = useRef(null);
  const maintPreTitleRef = useRef(null);
  const maintServiceRef = useRef(null);
  const [serviceAutoExpand, setServiceAutoExpand] = useState(false);

  useEffect(() => {
    const serviceEl = maintServiceRef.current;
    const introEl = maintIntroRef.current;
    const headerEl = maintHeaderRef.current;
    const ptEl = maintPreTitleRef.current;
    if (!serviceEl || !introEl || !headerEl || !ptEl) return;

    let phase1Top, phase3Top;
    const measure = () => {
      const vh10 = window.innerHeight * 0.10;
      phase1Top = vh10 + headerEl.offsetHeight;
      phase3Top = vh10 + 32 + ptEl.offsetHeight + 8;
      serviceEl.style.top = phase1Top + 'px';
    };

    let currentPhase = 1;
    const handleScroll = () => {
      const rect = introEl.getBoundingClientRect();
      const scrolled = -rect.top;
      const vh = window.innerHeight;
      const threshold = vh * 0.10;
      const newPhase = scrolled >= threshold ? 3 : 1;
      if (newPhase !== currentPhase) {
        currentPhase = newPhase;
        serviceEl.style.top = (newPhase === 1 ? phase1Top : phase3Top) + 'px';
      }
      const expandThreshold = threshold + vh * 0.10;
      if (scrolled >= expandThreshold) {
        setServiceAutoExpand(true);
      } else {
        setServiceAutoExpand(false);
      }
    };

    measure();
    window.addEventListener('scroll', handleScroll, { passive: true });
    const onResize = () => { measure(); currentPhase = 0; handleScroll(); };
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
  }, [salesExpanded.preowned]);

  const [navCompact, setNavCompact] = useState(false);
  const [trainingSlide, setTrainingSlide] = useState(0); // Start on Discovery Flight
  const [whyFlyOpen, setWhyFlyOpen] = useState(false);
  const [whyFlySlide, setWhyFlySlide] = useState(0);
  const [whyFlySlideV9, setWhyFlySlideV9] = useState(0);

  // Shared why-fly data
  const whyFlyBenefits = [
    { verb: 'Join', noun: 'a Community', desc: 'Connect with fellow pilots, business leaders, and adventurers who share your passion for aviation at exclusive flying events and beyond.' },
    { verb: 'Enjoy', noun: 'the Journey', desc: "For a pilot, the journey is never just a means of getting somewhere — it is the experience itself. The best memories are made not at the destination, but somewhere above the clouds on the way there." },
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


  const containerRef = useRef(null);
  const navRef = useRef(null);
  const navSentinelRef = useRef(null);
  const videoLinesRef = useRef(null);
  const scrollingStripsWrapperRef = useRef(null);
  const trainingInnerRef = useRef(null);
  const trainingStickyRef = useRef(null);
  const hscrollRef = useRef(null);
  const hscrollInnerRef = useRef(null);
  const hscrollRunwayRef = useRef(null);
  const [hscrollAtStart, setHscrollAtStart] = useState(true);
  const [hscrollAtEnd, setHscrollAtEnd] = useState(false);
  const [hscrollMask, setHscrollMask] = useState('none');

  // hscroll mask/chevron state is now driven from the main scroll handler below
  const hscrollProgressRef = useRef(0);
  const updateHscrollMask = (scrollPos, maxScroll) => {
    setHscrollAtStart(scrollPos <= 5);
    setHscrollAtEnd(scrollPos >= maxScroll - 5);
    const fadeRange = 260;
    const leftPct = Math.min(scrollPos / fadeRange, 1) * 6;
    const rightRemaining = maxScroll - scrollPos;
    const rightPct = 100 - Math.min(rightRemaining / fadeRange, 1) * 6;
    setHscrollMask(`linear-gradient(to right, transparent, black ${leftPct}%, black ${rightPct}%, transparent)`);
  };

  // Vertical scroll → horizontal scroll mapping for hscroll runway
  // Uses JS-driven fixed positioning because CSS sticky is blocked by overflow-x:clip on section
  useEffect(() => {
    const runway = hscrollRunwayRef.current;
    const scroller = hscrollRef.current;
    if (!runway || !scroller) return;

    const stickyEl = runway.querySelector('.fd-hscroll-sticky');
    if (!stickyEl) return;

    const inner = hscrollInnerRef.current;
    if (!inner) return;

    const setRunwayHeight = () => {
      const overflow = inner.scrollWidth - scroller.clientWidth;
      runway.style.height = `${overflow + window.innerHeight}px`;
    };
    setRunwayHeight();
    window.addEventListener('resize', setRunwayHeight);

    const onScroll = () => {
      const runwayRect = runway.getBoundingClientRect();
      const overflow = inner.scrollWidth - scroller.clientWidth;
      if (overflow <= 0) return;

      // Center the hscroll vertically in available space below header+nav
      const headerNav = document.querySelector('.Header');
      const headerNavHeight = headerNav ? headerNav.offsetHeight : 0;
      const availableHeight = window.innerHeight - headerNavHeight;
      const scrollerHeight = stickyEl.offsetHeight;
      const stickAt = headerNavHeight + (availableHeight - scrollerHeight) / 2 + 20;
      const scrolled = stickAt - runwayRect.top;
      const totalStuckDistance = overflow;

      if (scrolled <= 0) {
        stickyEl.style.position = '';
        stickyEl.style.top = '';
        stickyEl.style.left = '';
        stickyEl.style.width = '';
        stickyEl.style.zIndex = '';
        inner.style.transform = 'translateX(0)';
        updateHscrollMask(0, overflow);
      } else if (scrolled < totalStuckDistance) {
        stickyEl.style.position = 'fixed';
        stickyEl.style.top = `${stickAt}px`;
        stickyEl.style.left = `${runwayRect.left}px`;
        stickyEl.style.width = `${runway.clientWidth}px`;
        stickyEl.style.zIndex = '1';
        const scrollPos = Math.min(scrolled, overflow);
        inner.style.transform = `translateX(${-scrollPos}px)`;
        updateHscrollMask(scrollPos, overflow);
      } else {
        stickyEl.style.position = 'absolute';
        stickyEl.style.top = `${totalStuckDistance}px`;
        stickyEl.style.left = '0';
        stickyEl.style.width = '';
        stickyEl.style.zIndex = '';
        inner.style.transform = `translateX(${-overflow}px)`;
        updateHscrollMask(overflow, overflow);
      }
    };

    window.addEventListener('scroll', onScroll, { passive: true });
    return () => {
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', setRunwayHeight);
    };
  }, []);

  const clubhouseRef = useRef(null);
  const globeRef = useRef(null);
  const [clubhouseOpacity, setClubhouseOpacity] = useState(0.12);
  const videoLinesInView = useInView(videoLinesRef, { once: true, amount: 0.5, margin: "0px 0px -200px 0px" });


  // Position globe center on the map pin center (fixed px so it doesn't shift when gallery expands)
  useEffect(() => {
    const positionGlobe = () => {
      const globe = globeRef.current;
      if (!globe) return;
      const cinematic = globe.closest('.fd-exped__cinematic');
      if (!cinematic) return;
      const pin = cinematic.querySelector('.exp-barcode__pin');
      if (!pin) return;
      const cinematicTop = cinematic.getBoundingClientRect().top + window.scrollY;
      const pinTop = pin.getBoundingClientRect().top + window.scrollY;
      const pinSvgHeight = pin.querySelector('svg')?.getBoundingClientRect().height || 36;
      // cy=14 out of viewBox height 36 is the white circle center
      const pinCenterY = pinTop + (14 / 36) * pinSvgHeight;
      const topPx = pinCenterY - cinematicTop;
      globe.style.top = topPx + 'px';
    };
    // Wait for layout to settle
    const t1 = setTimeout(positionGlobe, 100);
    const t2 = setTimeout(positionGlobe, 600);
    const t3 = setTimeout(positionGlobe, 1500);
    window.addEventListener('resize', positionGlobe);
    return () => {
      clearTimeout(t1); clearTimeout(t2); clearTimeout(t3);
      window.removeEventListener('resize', positionGlobe);
    };
  }, []);

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
      image: '/assets/images/gallery/carousel/rotating1.jpg',
      description: 'Flying is the ultimate dream pursued by mankind. Should you want to live it for real, the discovery flight will certainly fulfil your expectations: After a pre-flight briefing, you will enjoy a full hands-on flying experience with one of our instructors.',
      cta: 'Learn More',
      link: '/training/trial-lessons',
      duration: '1 hour',
      tag: 'First step',
    },
    {
      title: 'Private Pilot Licence',
      image: '/assets/images/gallery/carousel/rotating2.jpg',
      description: 'Let aside the ground exams that most students self study before taking the tests on site, the obtention of a PPL(H) requires a minimum of 45 hrs of flight training, including 10 hrs of solo. The duration varies depending on commitment.',
      cta: 'Learn More',
      link: '/training/ppl',
      duration: '45+ hours',
      tag: 'Foundation',
    },
    {
      title: 'Type Rating',
      image: '/assets/images/gallery/carousel/rotating-4.jpg',
      description: 'Having achieved your PPL(H), you may wish to fly different types of helicopter. A type specific ground training course followed by a minimum of 5 Hrs of flight training will suffice to put you to the Type Rating test.',
      cta: 'Learn More',
      link: '/training/type-rating',
      duration: '5+ hours',
      tag: 'Specialisation',
    },
    {
      title: 'Commercial Pilot Licence',
      image: '/assets/images/gallery/carousel/rotating-3.jpg',
      description: 'Holding a Commercial Pilot Licence, CPL(H) gives you the status of professional helicopter pilot. To achieve this, 155 hrs of flying time post licence is required, of which 50 hrs must be Pilot In Command (PIC).',
      cta: 'Learn More',
      link: '/training',
      duration: '155+ hours',
      tag: 'Professional',
    },
    {
      title: 'Night Rating',
      image: '/assets/images/gallery/carousel/rotating6.jpg',
      description: 'Holding a night rating gives you the most flexibility, as sunset will no longer prevent you from flying. To achieve this, 100 hrs of flying post licence is required, of which 60 Hrs must be Pilot In Command.',
      cta: 'Learn More',
      link: '/training/night-rating',
      duration: '100+ hours',
      tag: 'Advanced',
    },
    {
      title: 'Self-Fly Hire',
      image: '/assets/images/gallery/carousel/rotating8.jpg',
      description: 'With an impressive fleet of over 30 helicopters, HQ will certainly be able to facilitate your flying requirements, either on a short term hiring or on a long term leasing basis.',
      cta: 'Learn More',
      link: '/services',
      duration: 'Flexible',
      tag: 'Freedom',
    },
    {
      title: 'Tours of London',
      image: '/assets/images/lifestyle/london-battersea-heliport.jpg',
      description: 'Experience London from above with a breathtaking helicopter tour. Fly over iconic landmarks including the Tower of London, Buckingham Palace, the London Eye, and the Thames — an unforgettable aerial perspective of one of the world\'s greatest cities.',
      cta: 'Learn More',
      link: '/helicopter-tour-of-london',
      duration: '30 minutes',
      tag: 'Experience',
    },
  ];

  const hscrollTitles = ['Commercial Pilot Licence', 'Self-Fly Hire', 'Night Rating', 'Tours of London'];
  const zigzagSlides = trainingSlides.filter(s => !hscrollTitles.includes(s.title));
  const hscrollSlides = trainingSlides.filter(s => hscrollTitles.includes(s.title));

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
    { id: 'contact', label: 'Contact', icon: '06' },
  ];

  // Nav section highlighting on scroll
  useEffect(() => {
    const handleScroll = () => {
      const windowHeight = window.innerHeight;
      const navSectionIds = ['training', 'fleet', 'expeditions', 'sales', 'maintenance', 'contact'];
      let currentNavSection = null;

      for (const sectionId of navSectionIds) {
        const element = document.getElementById(sectionId);
        if (element) {
          const rect = element.getBoundingClientRect();
          if (rect.top <= windowHeight * 0.5 && rect.bottom >= 100) {
            currentNavSection = sectionId;
          }
        }
      }

      setActiveNavSection(currentNavSection);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Gallery fullscreen auto-rotate + clock
  useEffect(() => {
    if (!galleryFullscreen) return;
    const interval = setInterval(() => {
      setGallerySlide((prev) => (prev + 1) % galleryImages.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [galleryFullscreen, galleryImages.length]);

  useEffect(() => {
    if (!galleryFullscreen || !galleryShowClock) return;
    const tick = () => {
      const now = new Date();
      setClockTime(now.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit', second: '2-digit' }));
    };
    tick();
    const interval = setInterval(tick, 1000);
    return () => clearInterval(interval);
  }, [galleryFullscreen, galleryShowClock]);

  // Compact nav: after the nav has been stuck for 200px, hide the "Explore" header
  useEffect(() => {
    if (!navRef.current) return;
    const COMPACT_SCROLL_DISTANCE = 200;

    const handleScroll = () => {
      const navTop = navRef.current.getBoundingClientRect().top;
      // When sticky kicks in, navTop stays at ~49px (header height).
      // The sentinel sits right above the nav — when it's 200px+ above the stuck position, go compact.
      const isStuck = navSentinelRef.current
        ? navSentinelRef.current.getBoundingClientRect().top < navTop
        : false;
      const stuckDistance = isStuck
        ? navTop - navSentinelRef.current.getBoundingClientRect().top
        : 0;
      setNavCompact(stuckDistance > COMPACT_SCROLL_DISTANCE);
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

  const preownedInventory = [
    // Available aircraft first
    {
      id: 'r66-ghkcc', model: 'R66 Turbine', year: 2021, hours: 485, registration: 'G-HKCC',
      price: '£995,000', status: 'available',
      images: [
        '/assets/images/used-aircraft/r66/r66-turbine-ghkcc.jpg',
        '/assets/images/new-aircraft/r66/blue-r66-palo-verde-left-v4.png',
        '/assets/images/used-aircraft/r66/chris-r66-alps.jpg',
      ],
    },
    {
      id: 'r44-grrob', model: 'R44 Raven II', year: 2019, hours: 890, registration: 'G-RROB',
      price: '£385,000', status: 'available',
      images: [
        '/assets/images/new-aircraft/r44/r44blueprint.jpg',
        '/assets/images/new-aircraft/r44/raven-ii-front-alpha.png',
      ],
    },
    {
      id: 'r66-gnxg', model: 'R66 Turbine', year: 2020, hours: 650, registration: 'G-NXG1',
      price: '£925,000', status: 'reserved',
      images: [
        '/assets/images/used-aircraft/r66/chris-r66-alps.jpg',
        '/assets/images/new-aircraft/r66/blue-r66-palo-verde-left-v4.png',
      ],
    },
    {
      id: 'r44-cadet', model: 'R44 Cadet', year: 2022, hours: 320, registration: 'G-CADB',
      price: '£345,000', status: 'available',
      images: [
        '/assets/images/new-aircraft/r44/raven-ii-front-alpha.png',
        '/assets/images/new-aircraft/r44/r44blueprint.jpg',
      ],
    },
    {
      id: 'r44-raven1', model: 'R44 Raven I', year: 2017, hours: 1450, registration: 'G-RAVI',
      price: '£295,000', status: 'available',
      images: [
        '/assets/images/new-aircraft/r44/r44blueprint.jpg',
        '/assets/images/new-aircraft/r44/raven-ii-front-alpha.png',
      ],
    },
    // Sold aircraft at the end
    {
      id: 'sold-r66-1', model: 'R66 Turbine', year: 2019, registration: 'G-SOLD', status: 'sold',
      images: ['/assets/images/used-aircraft/r66/r66-turbine-ghkcc.jpg'],
    },
    {
      id: 'sold-r44-1', model: 'R44 Raven II', year: 2020, registration: 'G-SOLD', status: 'sold',
      images: ['/assets/images/new-aircraft/r44/r44blueprint.jpg'],
    },
    {
      id: 'sold-r22-1', model: 'R22 Beta II', year: 2019, registration: 'G-SOLD', status: 'sold',
      images: ['/assets/images/new-aircraft/r22/r22-red-volcano-front-alpha-v3.png'],
    },
    {
      id: 'sold-r44-2', model: 'R44 Cadet', year: 2021, registration: 'G-SOLD', status: 'sold',
      images: ['/assets/images/new-aircraft/r44/raven-ii-front-alpha.png'],
    },
  ];

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

      {/* ===== HERO SECTION (Diagonal Split) ===== */}
      <HeroSectionFinal />

      {/* ===== ABOUT US VIDEO SECTION ===== */}
      <section className="fd-about" id="about">
        <div className="fd-about__content">
          <div className="fd-about__label">
            <span className="fd-about__label-line"></span>
            <span>About Us</span>
            <span className="fd-about__label-line"></span>
          </div>
          <h2 className="fd-about__headline fd-about__headline--single-line">
            <span>The Story</span> <span>Behind the</span> <span>Journey</span>
          </h2>

          <div className="fd-about__video" ref={videoLinesRef}>
            <div className={`fd-about__video-lines ${videoLinesInView ? 'visible' : ''}`}>
              <span className="fd-about__line fd-about__line--1"></span>
              <span className="fd-about__line fd-about__line--2"></span>
              <span className="fd-about__line fd-about__line--3"></span>
            </div>
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

          <div className="fd-about__divider">
            <span className="fd-about__divider-line"></span>
            <div className="fd-about__socials">
              <a href="https://www.instagram.com/haborhelicopters/" target="_blank" rel="noopener noreferrer" className="fd-about__social" aria-label="Instagram">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><rect x="2" y="2" width="20" height="20" rx="5"/><circle cx="12" cy="12" r="5"/><circle cx="17.5" cy="6.5" r="1.5" fill="currentColor" stroke="none"/></svg>
              </a>
              <a href="https://www.facebook.com/haborhelicopters" target="_blank" rel="noopener noreferrer" className="fd-about__social" aria-label="Facebook">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M18 2h-3a5 5 0 00-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 011-1h3z"/></svg>
              </a>
              <a href="https://www.youtube.com/@hqaviation" target="_blank" rel="noopener noreferrer" className="fd-about__social" aria-label="YouTube">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M22.54 6.42a2.78 2.78 0 00-1.94-2C18.88 4 12 4 12 4s-6.88 0-8.6.46a2.78 2.78 0 00-1.94 2A29 29 0 001 11.75a29 29 0 00.46 5.33A2.78 2.78 0 003.4 19.1c1.72.46 8.6.46 8.6.46s6.88 0 8.6-.46a2.78 2.78 0 001.94-2 29 29 0 00.46-5.25 29 29 0 00-.46-5.43z"/><polygon points="9.75,15.02 15.5,11.75 9.75,8.48" fill="currentColor" stroke="none"/></svg>
              </a>
            </div>
            <span className="fd-about__divider-line"></span>
          </div>



        </div>
      </section>

      {/* ===== ABOUT US — Integrated (Company + Founder) ===== */}
      <section className="abt-v9">
        <div className="abt-v9__inner">

          <span className="abt-v9__pre">About HQ Aviation</span>
          <h2 className="abt-v9__headline">Where Passion Meets Precision</h2>

          <div className="abt-v9__columns">
            <div className="abt-v9__portrait">
              <img src="/assets/images/team/world-helicopter-champion-quentin-smith.webp" alt="Captain Quentin Smith" />
              <div className="abt-v9__caption">
                <span className="abt-v9__name">Capt. Quentin Smith</span>
                <span className="abt-v9__role">Founder &amp; Chief Pilot</span>
              </div>
            </div>

            <div className="abt-v9__content">
              <div className="abt-v9__meta">
                <span className="abt-v9__meta-item"><strong>12,000+</strong> Hours PIC</span>
                <span className="abt-v9__sep" />
                <span className="abt-v9__meta-item"><strong>55+</strong> Years Flying</span>
                <span className="abt-v9__sep" />
                <span className="abt-v9__meta-item"><strong>2×</strong> World Champion</span>
                <span className="abt-v9__sep" />
                <span className="abt-v9__meta-item"><strong>4</strong> World Records</span>
              </div>

              <p className="abt-v9__lead">Founded in 2010 by Captain Quentin Smith at Denham Aerodrome, HQ Aviation has grown into the UK's leading Robinson helicopter specialists.</p>
              <p className="abt-v9__text">For over three decades, we've trained hundreds of pilots, sold and maintained Robinson helicopters across the fleet — R22, R44, and R66 — and led expeditions to some of the most remote places on earth.</p>

              <div className="abt-v9__milestones">
                {[
                  { year: '1994', icon: 'fas fa-trophy', text: 'World Aerobatics Gold', sub: 'Moscow, Russia' },
                  { year: '1997', icon: 'fas fa-globe-americas', text: 'First Piston Heli Around the World', sub: 'Now in the Smithsonian' },
                  { year: '2002', icon: 'fas fa-compass', text: 'First Piston Heli to North Pole', sub: 'Guinness World Record' },
                  { year: '2005', icon: 'fas fa-flag', text: 'First Crew to Both Poles', sub: 'Guinness World Record' },
                  { year: '2012', icon: 'fas fa-medal', text: 'Second World Championship', sub: 'Backwards Autorotation' },
                  { year: '2016', icon: 'fas fa-snowflake', text: 'Solo to All 3 North Poles', sub: 'World First' },
                  { year: '2019', icon: 'fas fa-award', text: 'FAI Gold Rotorcraft Medal', sub: 'Lifetime Achievement' },
                ].map((m, i) => (
                  <div key={i} className="abt-v9__milestone">
                    <i className={m.icon}></i>
                    <span className="abt-v9__milestone-year">{m.year}</span>
                    <span className="abt-v9__milestone-text">{m.text}</span>
                    <span className="abt-v9__milestone-sub">{m.sub}</span>
                  </div>
                ))}
              </div>

              <Link to="/about-us/captain-q" className="abt-v9__link">
                Read the Full Story
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
              </Link>
            </div>
          </div>

          {/* Why Fly — horizontal panel */}
          <div className="abt-v9__whyfly">
            <div className="abt-v9__whyfly-visual">
              {whyFlyImages.map((s, i) => (
                <div key={i} className={`abt-v9__whyfly-slide ${i === whyFlySlideV9 ? 'active' : ''}`} style={{ backgroundImage: `url(${s})` }} />
              ))}
            </div>
            <div className="abt-v9__whyfly-content">
              <span className="abt-v9__whyfly-label">Why Fly a Helicopter?</span>
              <div className="abt-v9__whyfly-items">
                {whyFlyBenefits.map((b, i) => (
                  <div key={i} className={`abt-v9__whyfly-item ${i === whyFlySlideV9 ? 'active' : ''}`}>
                    <h3 className="abt-v9__whyfly-verb">{b.verb} <span>{b.noun}</span></h3>
                    <p>{b.desc}</p>
                  </div>
                ))}
              </div>
              <div className="abt-v9__whyfly-nav">
                <div className="abt-v9__whyfly-dots">
                  {whyFlyBenefits.map((_, i) => (
                    <button key={i} className={`abt-v9__whyfly-dot ${i === whyFlySlideV9 ? 'active' : ''}`} onClick={() => setWhyFlySlideV9(i)} />
                  ))}
                </div>
                <div className="abt-v9__whyfly-arrows">
                  <button onClick={() => setWhyFlySlideV9(prev => prev === 0 ? whyFlyBenefits.length - 1 : prev - 1)} aria-label="Previous">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M15 18l-6-6 6-6" /></svg>
                  </button>
                  <button onClick={() => setWhyFlySlideV9(prev => prev === whyFlyBenefits.length - 1 ? 0 : prev + 1)} aria-label="Next">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M9 18l6-6-6-6" /></svg>
                  </button>
                </div>
              </div>
            </div>
          </div>

          <div className="abt-v9__bottom">
            <span className="abt-v9__tagline">Training · Sales · Maintenance · Expeditions</span>
            <Link to="/about-us" className="abt-v9__cta">About HQ Aviation <span>→</span></Link>
          </div>

        </div>
      </section>

      {/* Sentinel for compact-mode distance calculation */}
      <div ref={navSentinelRef} style={{ height: 0, margin: 0, padding: 0 }} />

      {/* ===== HORIZONTAL ACCORDION NAVIGATION ===== */}
      <nav className={`fd-nav ${navCompact ? 'fd-nav--compact' : ''}`} ref={navRef}>
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
        <section className="fd-training-section" id="training">
          <div className="fd-training-inner" ref={trainingInnerRef}>
            <div className="fd-training-sticky" ref={trainingStickyRef}>
              <div className="fd-training-sticky__bg">
                <ScrollPathAnimation
                  iconSrc="/assets/images/icons/r66-icon-transparent going right.svg"
                  iconSize={120}
                  colorStart="#FFFFFF"
                  colorMid="#5B9BD5"
                  colorEnd="#1E3A5F"
                  scrollTargetRef={trainingInnerRef}
                  stickyRef={trainingStickyRef}
                  stickyTop={0.35}
                />
              </div>
              <div className="fd-training-sticky__text">
                <span className="fd-training-header__pretitle">CAA Approved Training Organisation</span>
                <h2 className="fd-training-header__headline">
                  <span>Explore Our</span>
                  <span>Flying Services</span>
                </h2>
                <p className="fd-training-header__desc">
                  From your first discovery flight to advanced commercial ratings, our experienced instructors guide you every step of the way.
                </p>
                <hr className="fd-training-header__divider" />
              </div>
            </div>
            <div className="fd-training-courses">
              {zigzagSlides.map((slide, i) => {
                const isEven = i % 2 === 0;
                return (
                  <ZigzagTrainingItem key={i} slide={slide} index={i} isEven={isEven} />
                );
              })}
            </div>
          <div className="fd-hscroll-runway" ref={hscrollRunwayRef}>
            <div className="fd-hscroll-sticky">
              <div className="fd-zigzag__hscroll" ref={hscrollRef} style={{ maskImage: hscrollMask, WebkitMaskImage: hscrollMask }}>
                <div className="fd-zigzag__hscroll-inner" ref={hscrollInnerRef}>
                {hscrollSlides.map((slide, i) => (
                  <div key={i} className="fd-zigzag__card">
                    <div className="fd-zigzag__card-image"><img src={slide.image} alt={slide.title} /></div>
                    <div className="fd-zigzag__card-body">
                      <div className="fd-zigzag__card-header">
                        <span className="fd-zigzag__card-num">{String(zigzagSlides.length + i + 1).padStart(2, '0')}</span>
                        <span className="fd-zigzag__card-tag">{slide.tag}</span>
                      </div>
                      <h3 className="fd-zigzag__card-title">{slide.title}</h3>
                      <p className="fd-zigzag__card-desc">{slide.description}</p>
                      <div className="fd-zigzag__card-footer">
                        <span className="fd-zigzag__card-duration">{slide.duration}</span>
                        <Link to={slide.link} className="fd-zigzag__card-btn">
                          <span>{slide.cta}</span>
                          <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M6 3L11 8L6 13" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg>
                        </Link>
                      </div>
                    </div>
                  </div>
                ))}
                {[
                  { num: String(zigzagSlides.length + hscrollSlides.length + 1).padStart(2, '0'), tag: 'Specialist', title: 'SuperYacht Ops & Private Owner Management', description: 'Deck ops, pilot provisioning, maintenance coordination, and worldwide logistics for yacht-based helicopters.', duration: 'Bespoke', link: '/contact?subject=special-ops', cta: 'Enquire', image: '/assets/images/lifestyle/superyacht-ops.jpg' },
                  { num: String(zigzagSlides.length + hscrollSlides.length + 2).padStart(2, '0'), tag: 'Specialist', title: 'Pilot Provisioning', description: 'Crewing, safety pilots, and ferry flights. Fully rated, insured and experienced across the Robinson range.', duration: 'Bespoke', link: '/contact?subject=pilot-services', cta: 'Enquire', image: '/assets/images/gallery/flying/flying--1.jpg' },
                  { num: String(zigzagSlides.length + hscrollSlides.length + 3).padStart(2, '0'), tag: 'Advanced', title: 'Advanced Training', description: 'Autorotations with Captain Q, confined area training, mountain flying, and safety courses.', duration: 'Various', link: '/contact?subject=training', cta: 'Enquire', image: '/assets/images/gallery/flying/flying-.jpg' },
                ].map((item, i) => (
                  <div key={`serv-${i}`} className="fd-zigzag__card">
                    <div className="fd-zigzag__card-image"><img src={item.image} alt={item.title} /></div>
                    <div className="fd-zigzag__card-body">
                      <div className="fd-zigzag__card-header">
                        <span className="fd-zigzag__card-num">{item.num}</span>
                        <span className="fd-zigzag__card-tag">{item.tag}</span>
                      </div>
                      <h3 className="fd-zigzag__card-title">{item.title}</h3>
                      <p className="fd-zigzag__card-desc">{item.description}</p>
                      <div className="fd-zigzag__card-footer">
                        <span className="fd-zigzag__card-duration">{item.duration}</span>
                        <Link to={item.link} className="fd-zigzag__card-btn">
                          <span>{item.cta}</span>
                          <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M6 3L11 8L6 13" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg>
                        </Link>
                      </div>
                    </div>
                  </div>
                ))}
                </div>
              </div>
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
          {/* Globe SVG underlay */}
          <div className="fd-exped__globe" ref={globeRef}>
            <svg viewBox="0 0 600 600" fill="none" xmlns="http://www.w3.org/2000/svg">
              {/* V3: Dense Wireframe — tilted 15° toward viewer */}
              <defs><clipPath id="gc3"><circle cx="300" cy="300" r="279" /></clipPath></defs>
              <circle cx="300" cy="300" r="280" stroke="currentColor" strokeWidth="1" opacity="0.18" />
              <g clipPath="url(#gc3)">
                {/* Axis — pole to pole */}
                <line x1="300" y1="30" x2="300" y2="570" stroke="currentColor" strokeWidth="0.4" opacity="0.1" />
                {/* Meridians every 15° — ry = 280·cos(15°) = 270 */}
                {Array.from({ length: 11 }, (_, i) => {
                  const d = (i + 1) * 15;
                  return <ellipse key={`m${i}`} cx="300" cy="300" rx={Math.round(280 * Math.sin(d * Math.PI / 180))} ry="270" stroke="currentColor" strokeWidth="0.6" opacity="0.09" />;
                })}
                {/* Equator — ry = 280·sin(15°) = 72 */}
                <ellipse cx="300" cy="300" rx="280" ry="72" stroke="currentColor" strokeWidth="1" opacity="0.14" />
                {/* Parallels ±20°, ±40°, ±60° */}
                {[20, 40, 60].map(lat => {
                  const latRad = lat * Math.PI / 180;
                  const cyN = Math.round(300 - 270 * Math.sin(latRad));
                  const rx = Math.round(280 * Math.cos(latRad));
                  const ry = Math.round(72 * Math.cos(latRad));
                  return [
                    <ellipse key={`n${lat}`} cx="300" cy={cyN} rx={rx} ry={ry} stroke="currentColor" strokeWidth="0.6" opacity="0.09" />,
                    <ellipse key={`s${lat}`} cx="300" cy={600 - cyN} rx={rx} ry={ry} stroke="currentColor" strokeWidth="0.6" opacity="0.09" />
                  ];
                })}
                {/* Pole markers */}
                <circle cx="300" cy="30" r="2" fill="currentColor" opacity="0.12" />
                <circle cx="300" cy="570" r="2" fill="currentColor" opacity="0.12" />
              </g>
            </svg>
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
            <div style={{ textAlign: 'center', marginTop: '12px' }}>
              <Link to="/expeditions" className="fd-exped__btn fd-exped__btn--primary">View All Expeditions</Link>
            </div>
          </div>
        </div>


      </section>

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
              <DealerSplitDots autoExpand={dealerAutoExpand} />
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


        {/* ── Section 1: New Aircraft ── */}
        <div className="fd-sales__subsection">
        <h3 className="fd-sales__section-title fd-sales__section-title--toggle" onClick={() => setSalesExpanded(prev => ({ ...prev, new: !prev.new }))}>
          New Aircraft
          <span className={`fd-sales__chevron ${salesExpanded.new ? 'fd-sales__chevron--open' : ''}`}><i className="fas fa-chevron-down"></i></span>
        </h3>
        <div className={`fd-sales__collapse ${salesExpanded.new ? 'fd-sales__collapse--open' : ''}`}>
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
        </div>
        </div>

        {/* ── Section 2: Pre-Owned Aircraft ── */}
        <div className="fd-sales__subsection">
        <h3 className="fd-sales__section-title fd-sales__section-title--toggle" onClick={() => setSalesExpanded(prev => ({ ...prev, preowned: !prev.preowned }))}>
          Pre-Owned Aircraft
          <span className={`fd-sales__chevron ${salesExpanded.preowned ? 'fd-sales__chevron--open' : ''}`}><i className="fas fa-chevron-down"></i></span>
        </h3>
        <div className={`fd-sales__collapse ${salesExpanded.preowned ? 'fd-sales__collapse--open' : ''}`}>
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
            {preownedInventory.map((ac, i) => {
              const imgIdx = preownedImgIndex[i] || 0;
              const images = ac.images;
              const isSold = ac.status === 'sold';
              const isReserved = ac.status === 'reserved';
              return (
              <div className="fd-sales__sold-card" key={ac.id}>
                {isSold && <div className="fd-sales__sold-badge">SOLD</div>}
                {isReserved && <div className="fd-sales__sold-badge" style={{ background: '#d4880f' }}>UNDER OFFER</div>}
                {!isSold && !isReserved && ac.price && <div className="fd-sales__sold-badge" style={{ background: '#1a1a1a' }}>{ac.price}</div>}
                <div className={`fd-sales__sold-image ${isSold ? '' : 'fd-sales__sold-image--active'}`}>
                  <img src={images[imgIdx]} alt={ac.model} />
                  {images.length > 1 && (
                    <>
                      <button
                        className="rb-stats__strip-nav rb-stats__strip-nav--prev"
                        onClick={(e) => { e.stopPropagation(); setPreownedImgIndex(prev => ({ ...prev, [i]: (imgIdx - 1 + images.length) % images.length })); }}
                      >
                        <i className="fas fa-chevron-left"></i>
                      </button>
                      <button
                        className="rb-stats__strip-nav rb-stats__strip-nav--next"
                        onClick={(e) => { e.stopPropagation(); setPreownedImgIndex(prev => ({ ...prev, [i]: (imgIdx + 1) % images.length })); }}
                      >
                        <i className="fas fa-chevron-right"></i>
                      </button>
                      <div className="rb-stats__strip-dots">
                        {images.map((_, di) => (
                          <span
                            key={di}
                            className={`rb-stats__strip-dot ${di === imgIdx ? 'rb-stats__strip-dot--active' : ''}`}
                            onClick={(e) => { e.stopPropagation(); setPreownedImgIndex(prev => ({ ...prev, [i]: di })); }}
                          />
                        ))}
                      </div>
                    </>
                  )}
                </div>
                <div className="fd-sales__sold-info">
                  <strong>{ac.model}</strong>
                  <span>{ac.registration} &middot; {ac.year}{ac.hours ? ` · ${ac.hours.toLocaleString()} hrs` : ''}</span>
                </div>
              </div>
              );
            })}
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
        </div>
        </div>

        {/* ── Section 3: Rebuilt Aircraft ── */}
        <div className="fd-sales__subsection">
        <h3 className="fd-sales__section-title fd-sales__section-title--toggle" onClick={() => setSalesExpanded(prev => ({ ...prev, rebuilt: !prev.rebuilt }))}>
          Rebuilt Aircraft
          <span className={`fd-sales__chevron ${salesExpanded.rebuilt ? 'fd-sales__chevron--open' : ''}`}><i className="fas fa-chevron-down"></i></span>
        </h3>
        <div className={`fd-sales__collapse ${salesExpanded.rebuilt ? 'fd-sales__collapse--open' : ''}`}>
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
              {rebuildPortfolio.map((rb, i) => {
                const imgIdx = stripImgIndex[i] || 0;
                const images = rb.gallery && rb.gallery.length > 0 ? rb.gallery : [rb.img];
                return (
                <div className="rb-stats__strip-card" key={i} onClick={() => setRebuildDetailOpen(i)} style={{ cursor: 'pointer' }}>
                  <div className="rb-stats__strip-gallery">
                    <img src={images[imgIdx]} alt={rb.model} />
                    {images.length > 1 && (
                      <>
                        <button
                          className="rb-stats__strip-nav rb-stats__strip-nav--prev"
                          onClick={(e) => { e.stopPropagation(); setStripImgIndex(prev => ({ ...prev, [i]: (imgIdx - 1 + images.length) % images.length })); }}
                        >
                          <i className="fas fa-chevron-left"></i>
                        </button>
                        <button
                          className="rb-stats__strip-nav rb-stats__strip-nav--next"
                          onClick={(e) => { e.stopPropagation(); setStripImgIndex(prev => ({ ...prev, [i]: (imgIdx + 1) % images.length })); }}
                        >
                          <i className="fas fa-chevron-right"></i>
                        </button>
                        <div className="rb-stats__strip-dots">
                          {images.map((_, di) => (
                            <span
                              key={di}
                              className={`rb-stats__strip-dot ${di === imgIdx ? 'rb-stats__strip-dot--active' : ''}`}
                              onClick={(e) => { e.stopPropagation(); setStripImgIndex(prev => ({ ...prev, [i]: di })); }}
                            />
                          ))}
                        </div>
                      </>
                    )}
                  </div>
                  <div className="rb-stats__strip-info">
                    <strong>{rb.model}</strong>
                    <span>{rb.reg} · {rb.year}</span>
                  </div>
                  <div className="rb-stats__strip-cta">
                    <span>View Full Rebuild</span>
                    <i className="fas fa-arrow-right"></i>
                  </div>
                </div>
                );
              })}
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
          <div className="rb-showcase" ref={rebuildShowcaseRef}>
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
        </div>
        </div>

        {/* ── Section 4: Robinson Unmanned ── */}
        <div className="fd-sales__subsection">
        <h3 className="fd-sales__section-title fd-sales__section-title--toggle" onClick={() => setSalesExpanded(prev => ({ ...prev, unmanned: !prev.unmanned }))}>
          Robinson Unmanned
          <span className={`fd-sales__chevron ${salesExpanded.unmanned ? 'fd-sales__chevron--open' : ''}`}><i className="fas fa-chevron-down"></i></span>
        </h3>
        <div className={`fd-sales__collapse ${salesExpanded.unmanned ? 'fd-sales__collapse--open' : ''}`}>
            <p className="fd-sales__section-desc">
              Robinson's unmanned aerial systems — purpose-built for commercial, agricultural, and industrial operations. Engineered with the same reliability and support that defines the Robinson brand.
            </p>
            <div className="fd-sales__unmanned-coming">
              <span className="fd-sales__unmanned-icon"><i className="fas fa-helicopter"></i></span>
              <p>More information coming soon. Contact our sales team for early enquiries.</p>
              <Link to="/contact?subject=unmanned" className="fd-sales__btn fd-sales__btn--primary">Enquire About Robinson Unmanned</Link>
            </div>
        </div>
        </div>

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

        <div className="fd-maint__intro" ref={maintIntroRef}>
          <div className="fd-maint__left">
            <div className="fd-maint__header-sticky" ref={maintHeaderRef}>
              <span className="fd-sales__pre-title" ref={maintPreTitleRef}>The Robinson Specialists Since 2010</span>
              <h2 className="fd-sales__title">
                <span className="fd-sales__title-word fd-sales__title-word--1">Expert</span>
                <span className="fd-sales__title-word fd-sales__title-word--2">Aircraft</span>
                <span className="fd-sales__title-word fd-sales__title-word--3">Care</span>
              </h2>
              <p className="fd-maint__text">
                As Robinson Authorised Dealer, Factory
                Distributor, and Designated Service Centre for the full Robinson range — R22, R44,
                and R66 — plus Guimbal Cabri G2 certified.
              </p>
              <div className="fd-sales__header-divider"></div>
            </div>
            <div className="fd-maint__service-catch" ref={maintServiceRef}>
              <ServiceSplitDots autoExpand={serviceAutoExpand} />
            </div>
          </div>
          <div className="fd-maint__intro-bg" />
          <div className="fd-maint__intro-border" />
          <div className="fd-maint__intro-gallery">
            <div className="fd-sales__intro-img fd-sales__intro-img--wide">
              <img src="/assets/images/facility/maintenance-.jpg" alt="Maintenance facility" loading="lazy" />
            </div>
            <div className="fd-sales__intro-img fd-sales__intro-img--wide">
              <img src="/assets/images/facility/hq-0391.jpg" alt="Engineering workshop" loading="lazy" />
            </div>
            <div className="fd-sales__intro-img">
              <img src="/assets/images/facility/hq-0477.jpg" alt="Engine work" loading="lazy" />
            </div>
            <div className="fd-sales__intro-img">
              <img src="/assets/images/facility/hq-0354.jpg" alt="Rotor inspection" loading="lazy" />
            </div>
            <div className="fd-sales__intro-img fd-sales__intro-img--wide">
              <img src="/assets/images/facility/hq-0035.jpg" alt="Hangar floor" loading="lazy" />
            </div>
            <div className="fd-sales__intro-img">
              <img src="/assets/images/facility/hq-0089.jpg" alt="Component detail" loading="lazy" />
            </div>
            <div className="fd-sales__intro-img">
              <img src="/assets/images/facility/hq-0745.jpg" alt="Aircraft on apron" loading="lazy" />
            </div>
            <div className="fd-sales__intro-img fd-sales__intro-img--wide">
              <img src="/assets/images/facility/sales-rebuild.jpg" alt="Rebuild in progress" loading="lazy" />
            </div>
            <div className="fd-sales__intro-img">
              <img src="/assets/images/facility/hq-0167.jpg" alt="Avionics bench" loading="lazy" />
            </div>
            <div className="fd-sales__intro-img">
              <img src="/assets/images/facility/okey-paint-quality.jpg" alt="Paint shop" loading="lazy" />
            </div>
          </div>
        </div>

        {/* Fullscreen gallery overlay */}
        {galleryFullscreen && (
          <div className="fd-gallery-fs">
            <div className="fd-gallery-fs__img-wrap">
              <img src={galleryImages[gallerySlide].src} alt={galleryImages[gallerySlide].alt} className="fd-gallery-fs__img" />
            </div>
            {galleryShowClock && (
              <div className="fd-gallery-fs__clock">{clockTime}</div>
            )}
            <div className="fd-gallery-fs__controls">
              <button onClick={() => setGallerySlide((prev) => (prev - 1 + galleryImages.length) % galleryImages.length)} aria-label="Previous">&lsaquo;</button>
              <span className="fd-gallery-fs__counter">{gallerySlide + 1} / {galleryImages.length}</span>
              <button onClick={() => setGallerySlide((prev) => (prev + 1) % galleryImages.length)} aria-label="Next">&rsaquo;</button>
            </div>
            <button className="fd-gallery-fs__clock-toggle" onClick={() => setGalleryShowClock(!galleryShowClock)} aria-label="Toggle clock">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10" /><path d="M12 6v6l4 2" /></svg>
            </button>
            <button className="fd-gallery-fs__close" onClick={() => setGalleryFullscreen(false)} aria-label="Close fullscreen">&times;</button>
          </div>
        )}

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
            <h3 className="mv12-crosshead">Our Facilities</h3>
            <div className="fd-maint__facility-carousel">
              <button className="fd-maint__facility-chevron fd-maint__facility-chevron--left" onClick={() => setFacilitySlide((prev) => (prev - 1 + facilityItems.length) % facilityItems.length)} aria-label="Previous">&lsaquo;</button>
              <div className="fd-maint__facility-track" style={{ transform: `translateX(-${facilitySlide * 100}%)` }}>
                {facilityItems.map((item, i) => (
                  <div className="fd-maint__facility-slide" key={i}>
                    <div className="fd-maint__facility-images">
                      {item.images.map((img, j) => (
                        <div className="fd-maint__facility-img" key={j}>
                          {img ? <img src={img} alt={`${item.label} ${j + 1}`} loading="lazy" /> : <i className={`fas ${item.icon}`}></i>}
                        </div>
                      ))}
                    </div>
                    <span>{item.label}</span>
                  </div>
                ))}
              </div>
              <button className="fd-maint__facility-chevron fd-maint__facility-chevron--right" onClick={() => setFacilitySlide((prev) => (prev + 1) % facilityItems.length)} aria-label="Next">&rsaquo;</button>
            </div>
            <div className="fd-maint__facility-dots">
              {facilityItems.map((_, i) => (
                <button key={i} className={`fd-maint__facility-dot ${i === facilitySlide ? 'fd-maint__facility-dot--active' : ''}`} onClick={() => setFacilitySlide(i)} aria-label={`Slide ${i + 1}`} />
              ))}
            </div>
            <div className="fd-maint__actions">
              <Link to="/maintenance" className="fd-maint__btn fd-maint__btn--primary">Explore Our Maintenance</Link>
            </div>
          </div>
        </div>
      </section>

      {/* ===== SECTION: PART SALES ===== */}
      <section className="fd-parts" id="part-sales">
        <div className="fd-parts__inner">
          <div className="fd-parts__left">
            <span className="fd-section-pre">Robinson Parts Specialists</span>
            <h2 className="fd-section-title">
              <span className="fd-section-title__word fd-section-title__word--1">Part</span>
              <span className="fd-section-title__word fd-section-title__word--2">Sales</span>
            </h2>
            <p className="fd-parts__text">
              As one of the biggest Robinson service centres in Europe, we have a constant influx of parts
              and excellent relations with the Robinson factory. Our &pound;500K+ genuine parts inventory
              spans engine components, airframe parts, consumables, avionics, and accessories — with same-day
              dispatch available for AOG situations. Our established relationships with specialist freight forwarders mean that whether a part is on the shelf at HQ or shipping direct from the Robinson factory, it won't be sitting in a loading bay for long.
            </p>
          </div>
          <div className="fd-parts__right">
            <form className="fd-parts__enquiry" onSubmit={(e) => e.preventDefault()}>
              <h4>Request Parts</h4>
              <span className="fd-parts__enquiry-subtitle">Fill in the details and we'll get back to you</span>
              <div className="fd-parts__enquiry-field">
                <label>Aircraft Type</label>
                <div className="fd-parts__aircraft-btns">
                  {['R22', 'R44', 'R66', 'N/A'].map((type) => (
                    <button
                      key={type}
                      type="button"
                      className={`fd-parts__aircraft-btn ${partsAircraft === type ? 'fd-parts__aircraft-btn--active' : ''}`}
                      onClick={() => setPartsAircraft(partsAircraft === type ? '' : type)}
                    >{type}</button>
                  ))}
                </div>
              </div>
              <div className="fd-parts__enquiry-field">
                <label htmlFor="parts-desc">Part Description</label>
                <input id="parts-desc" type="text" className="fd-parts__enquiry-input" placeholder="Part number or description" />
              </div>
              <div className="fd-parts__enquiry-field">
                <label htmlFor="parts-email">Email</label>
                <input id="parts-email" type="email" className="fd-parts__enquiry-input" placeholder="your@email.com" />
              </div>
              <div className="fd-parts__enquiry-field">
                <label htmlFor="parts-message">Additional Information</label>
                <textarea id="parts-message" className="fd-parts__enquiry-input" rows="3" placeholder="Any additional details..."></textarea>
              </div>
              <button type="submit" className="fd-parts__submit">Send Parts Enquiry<span>→</span></button>
            </form>
          </div>
        </div>
      </section>

      {/* ===== SECTION: RATES & PRICING ===== */}
      <section className={`fd-pricing ${pricingOpen ? 'fd-pricing--open' : ''}`} id="pricing">
        <div className="fd-pricing__inner">
          <div className="fd-pricing__header" onClick={() => setPricingOpen(!pricingOpen)}>
            <div>
              <span className="fd-section-pre">Transparent Pricing</span>
              <h2 className="fd-section-title">
                <span className="fd-section-title__word fd-section-title__word--1">Rates</span>
                <span className="fd-section-title__word fd-section-title__word--2">&amp; Pricing</span>
              </h2>
            </div>
            <button className="fd-pricing__toggle" aria-label={pricingOpen ? 'Collapse' : 'Expand'}>
              <span className={`fd-pricing__toggle-icon ${pricingOpen ? 'fd-pricing__toggle-icon--open' : ''}`}>+</span>
            </button>
          </div>
          <div className="fd-pricing__collapsible">
          <p className="fd-section-desc">
            We believe in transparent pricing. No hidden fees, no surprise charges. Here's what everything costs.
          </p>

          <div className="fd-pricing__tabs">
            {[
              { id: 'training', label: 'Training' },
              { id: 'hire', label: 'Self-Fly Hire' },
              { id: 'hangarage', label: 'Hangarage' },
              { id: 'valet', label: 'Valet Services' },
            ].map(tab => (
              <button
                key={tab.id}
                className={`fd-pricing__tab ${pricingTab === tab.id ? 'fd-pricing__tab--active' : ''}`}
                onClick={() => setPricingTab(tab.id)}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {pricingTab === 'training' && (
            <div className="fd-pricing__table-wrap">
              <table className="fd-pricing__table">
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
                    <td className="fd-pricing__price">From £299</td>
                  </tr>
                  <tr>
                    <td><strong>Private Pilot Licence — PPL(H)</strong><br /><span>Min 45 hours flight training, ground school, exams</span></td>
                    <td>6-12 Months</td>
                    <td className="fd-pricing__price">From £15,000</td>
                  </tr>
                  <tr>
                    <td><strong>Commercial Pilot Licence — CPL(H)</strong><br /><span>155 hours total, 50 hours PIC, skill test</span></td>
                    <td>Varies</td>
                    <td className="fd-pricing__price">POA</td>
                  </tr>
                  <tr>
                    <td><strong>Type Rating</strong><br /><span>Ground course + min 5 hours flight training</span></td>
                    <td>1-2 Weeks</td>
                    <td className="fd-pricing__price">POA</td>
                  </tr>
                  <tr>
                    <td><strong>Night Rating</strong><br /><span>100 hours + 60 hours PIC required</span></td>
                    <td>Varies</td>
                    <td className="fd-pricing__price">POA</td>
                  </tr>
                  <tr className="fd-pricing__table-highlight">
                    <td><strong>5-Day Ground School</strong><br /><span>All 9 PPL theory exams, guaranteed pass, small groups</span></td>
                    <td>5 Days</td>
                    <td className="fd-pricing__price">£1,500 + VAT</td>
                  </tr>
                </tbody>
              </table>
              <div className="fd-pricing__note">
                <strong>Mission Rate Flying:</strong> Supporting such a large fleet with client helicopters around the UK can mean our
                engineers need to be moved, helicopters must go to get custom avionics, etc. This allows you access to flying
                at mission rate prices for these trips — a significant saving over standard rates.
              </div>
              <div className="fd-pricing__note">
                <strong>Happy Hour Flying:</strong> Ask about our off-peak rates for flexible pilots who can fly at shorter notice.
              </div>
            </div>
          )}

          {pricingTab === 'hire' && (
            <div className="fd-pricing__table-wrap">
              <table className="fd-pricing__table">
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
                    <td className="fd-pricing__price">From £275/hr</td>
                  </tr>
                  <tr>
                    <td><strong>Robinson R44 Raven II</strong><br /><span>Touring, weekends away, business flights</span></td>
                    <td>4</td>
                    <td className="fd-pricing__price">From £395/hr</td>
                  </tr>
                  <tr>
                    <td><strong>Robinson R66 Turbine</strong><br /><span>Long-range touring, G500H TXi, HeliSAS autopilot, aux tank</span></td>
                    <td>5</td>
                    <td className="fd-pricing__price">From £595/hr</td>
                  </tr>
                </tbody>
              </table>
              <div className="fd-pricing__note">
                We only charge for actual flying time. No membership fees, no bulk payments up front. Discounts available
                when hours are purchased in larger quantities. 28-day recency check required for safety.
              </div>
            </div>
          )}

          {pricingTab === 'hangarage' && (
            <div className="fd-pricing__table-wrap">
              <p className="fd-pricing__valet-intro">
                Secure, heated hangarage at Denham Aerodrome — just 30 minutes from central London. Our facility
                offers 24/7 access, dedicated ground crew, CCTV surveillance, and organised landing slots. Whether
                you're parking overnight or need a permanent home for your aircraft, we have options to suit.
              </p>
              <table className="fd-pricing__table">
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
                    <td className="fd-pricing__price">£75/day</td>
                    <td className="fd-pricing__price">£350/week</td>
                    <td className="fd-pricing__price">£950/month</td>
                  </tr>
                  <tr>
                    <td><strong>R44 / R66</strong><br /><span>Medium single — standard bay</span></td>
                    <td className="fd-pricing__price">£120/day</td>
                    <td className="fd-pricing__price">£550/week</td>
                    <td className="fd-pricing__price">£1,500/month</td>
                  </tr>
                  <tr>
                    <td><strong>AS350 / Bell 206 / 505</strong><br /><span>Light single turbine — larger footprint</span></td>
                    <td className="fd-pricing__price">£160/day</td>
                    <td className="fd-pricing__price">£750/week</td>
                    <td className="fd-pricing__price">£2,200/month</td>
                  </tr>
                  <tr>
                    <td><strong>AW109 / AW169 / EC135</strong><br /><span>Medium twin — wide bay required</span></td>
                    <td className="fd-pricing__price">£250/day</td>
                    <td className="fd-pricing__price">£1,200/week</td>
                    <td className="fd-pricing__price">£3,500/month</td>
                  </tr>
                </tbody>
              </table>
              <div className="fd-pricing__hangarage-includes">
                <h4>All Hangarage Includes</h4>
                <div className="fd-pricing__hangarage-grid">
                  <div className="fd-pricing__hangarage-item">
                    <i className="fas fa-warehouse"></i>
                    <span>Heated, secure hangar</span>
                  </div>
                  <div className="fd-pricing__hangarage-item">
                    <i className="fas fa-video"></i>
                    <span>24/7 CCTV surveillance</span>
                  </div>
                  <div className="fd-pricing__hangarage-item">
                    <i className="fas fa-users"></i>
                    <span>Dedicated ground crew</span>
                  </div>
                  <div className="fd-pricing__hangarage-item">
                    <i className="fas fa-plane-arrival"></i>
                    <span>Organised landing slots</span>
                  </div>
                  <div className="fd-pricing__hangarage-item">
                    <i className="fas fa-key"></i>
                    <span>24/7 owner access</span>
                  </div>
                  <div className="fd-pricing__hangarage-item">
                    <i className="fas fa-plug"></i>
                    <span>GPU &amp; ground power</span>
                  </div>
                </div>
              </div>
              <div className="fd-pricing__note">
                <strong>Long-term contracts:</strong> Discounted rates available for 6-month and 12-month commitments.
                Leaseback programme members receive preferential hangarage rates. Contact us for a bespoke quote.
              </div>
              <div className="fd-pricing__note">
                <strong>Visiting aircraft:</strong> Short stay parking on the apron is available for day visitors at reduced rates.
                Pre-book your slot with our operations team to guarantee availability.
              </div>
            </div>
          )}

          {pricingTab === 'valet' && (
            <div className="fd-pricing__table-wrap">
              <p className="fd-pricing__valet-intro">
                We provide exterior &amp; interior aircraft cleaning and polishing from our conveniently located
                hangar at Elstree Aerodrome. Our expert team use the best products and tools to clean &amp; polish
                your aircraft with the utmost care.
              </p>
              <table className="fd-pricing__table fd-pricing__table--valet">
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
              <div className="fd-pricing__valet-tiers">
                <div className="fd-pricing__valet-tier">
                  <h4>Mini Valet</h4>
                  <ul>
                    <li>Exterior Wash</li>
                    <li>Interior Vacuum</li>
                    <li>Window Clean</li>
                    <li>Soot Removal</li>
                  </ul>
                </div>
                <div className="fd-pricing__valet-tier">
                  <h4>Full Valet</h4>
                  <ul>
                    <li>Everything in Mini</li>
                    <li>Interior Detailing</li>
                    <li>Leather &amp; Upholstery Clean</li>
                    <li>Window Polish</li>
                  </ul>
                </div>
                <div className="fd-pricing__valet-tier">
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
        </div>
      </section>

      {/* ===== SECTION: PRIVATE & SPECIALIST SERVICES ===== */}

      {/* ===== SECTION: LOCATION ===== */}
      <section className="fd-location" id="location">
        <div className="fd-location__inner">
          <div className="fd-location__card">
            <div className="fd-location__map">
              <iframe
                title="HQ Aviation Location"
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2478.8!2d-0.5133!3d51.5786!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x48766a3c3c8a3c3d%3A0x4a0a2c3b8c3b3c3d!2sDenham%20Aerodrome!5e0!3m2!1sen!2suk!4v1"
                width="100%"
                height="100%"
                style={{border: 0}}
                allowFullScreen=""
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              />
            </div>
            <div className="fd-location__info">
              <span className="fd-location__pre">Find Us</span>
              <h2 className="fd-location__title">Denham Aerodrome</h2>
              <div className="fd-location__rule"></div>
              <div className="fd-location__details">
                <div className="fd-location__detail">
                  <span className="fd-location__detail-icon"><i className="fas fa-map-marker-alt"></i></span>
                  <div>
                    <span className="fd-location__detail-label">Address</span>
                    <p className="fd-location__detail-text">Tilehouse Lane, Denham<br/>Buckinghamshire, UB9 5DF</p>
                  </div>
                </div>
                <div className="fd-location__detail">
                  <span className="fd-location__detail-icon"><i className="fas fa-phone-alt"></i></span>
                  <div>
                    <span className="fd-location__detail-label">Telephone</span>
                    <p className="fd-location__detail-text">01895 833 838</p>
                  </div>
                </div>
                <div className="fd-location__detail">
                  <span className="fd-location__detail-icon"><i className="fas fa-envelope"></i></span>
                  <div>
                    <span className="fd-location__detail-label">Email</span>
                    <p className="fd-location__detail-text">info@hqaviation.com</p>
                  </div>
                </div>
                <div className="fd-location__detail">
                  <span className="fd-location__detail-icon"><i className="fas fa-clock"></i></span>
                  <div>
                    <span className="fd-location__detail-label">Hours</span>
                    <p className="fd-location__detail-text">Monday – Sunday: 08:30 – 17:00</p>
                  </div>
                </div>
              </div>
              <div className="fd-location__tags">
                <span className="fd-location__tag">ICAO: EGLD</span>
                <span className="fd-location__tag">20 min from Central London</span>
                <span className="fd-location__tag">Robinson Authorized Dealer</span>
              </div>
              <Link to="/contact" className="fd-location__cta">Get Directions <span>→</span></Link>
            </div>
          </div>
        </div>
      </section>

      {/* ===== SECTION: CLIENT REVIEWS ===== */}
      <section className="fd-testimonials" id="testimonials">
        <div className="fd-testimonials__top">
          <span className="fd-section-pre">What People Say About Us</span>
          <h2 className="fd-testimonials__heading">Client <span>Reviews</span></h2>
          <p className="fd-testimonials__sub">
            From student pilots to helicopter owners, our community shares their experiences flying with HQ Aviation.
          </p>
        </div>

        <div className="fd-testimonials__marquee">
          <div className="fd-testimonials__track">
            {[
              { initials: 'PC', name: 'Patrick Curran', role: 'Helicopter Owner · R44 Raven II', category: 'Ownership', stars: 5, text: "HQ Aviation has been looking after my R44 for over five years now. The level of care and attention to detail from David Cross and his engineering team is second to none. They treat my aircraft as if it were their own." },
              { initials: 'AB', name: 'Andy Boniface', role: 'Trial Lesson Student', category: 'Training', stars: 5, text: "What an incredible day. From the moment I arrived, the team made me feel completely at ease. The briefing was thorough, and then actually flying the helicopter — there's nothing quite like it. I'm already looking at booking my PPL course." },
              { initials: 'LL', name: 'Luca Lapegna', role: 'Helicopter Owner · R66 Turbine', category: 'Ownership', stars: 5, text: "The leaseback programme has been fantastic for offsetting ownership costs. HQ manages everything — maintenance, scheduling, insurance coordination. My R66 pays for itself, and I still fly it whenever I want." },
              { initials: 'GR', name: 'Geoff Read', role: 'PPL(H) · Self-Fly Hire Regular', category: 'Hire', stars: 5, text: "The walk-in, walk-out self-fly hire is exactly what I wanted after getting my licence. No membership fees, no hassle. I book an R44, it's fuelled and ready on the pad. Last month I flew to Le Touquet for lunch — try doing that by car." },
              { initials: 'MK', name: 'Maxim Kalyuzhny', role: 'Helicopter Owner · R22 Beta II', category: 'Ownership', stars: 5, text: "Bought my R22 through HQ and they've maintained it impeccably since. The engineering team genuinely cares. When my 2,200-hour overhaul came up, they walked me through every option and the rebuild came back better than factory." },
              { initials: 'SH', name: 'Sarah Henderson', role: 'PPL Student · Hour Building', category: 'Training', stars: 5, text: "The instructors at HQ are patient, professional and genuinely passionate about teaching. I started my PPL in January and passed my skills test in September. The ground school was brilliant — passed all nine exams first time." },
              { initials: 'JM', name: 'James Mitchell', role: 'Expedition Participant · Iceland 2024', category: 'Expeditions', stars: 5, text: "Flying to Iceland with Captain Q was a once-in-a-lifetime experience. The planning was meticulous, the flying was extraordinary, and the camaraderie between the group was something I'll never forget. Already signed up for the next one." },
            ].concat([
              { initials: 'PC', name: 'Patrick Curran', role: 'Helicopter Owner · R44 Raven II', category: 'Ownership', stars: 5, text: "HQ Aviation has been looking after my R44 for over five years now. The level of care and attention to detail from David Cross and his engineering team is second to none. They treat my aircraft as if it were their own." },
              { initials: 'AB', name: 'Andy Boniface', role: 'Trial Lesson Student', category: 'Training', stars: 5, text: "What an incredible day. From the moment I arrived, the team made me feel completely at ease. The briefing was thorough, and then actually flying the helicopter — there's nothing quite like it. I'm already looking at booking my PPL course." },
              { initials: 'LL', name: 'Luca Lapegna', role: 'Helicopter Owner · R66 Turbine', category: 'Ownership', stars: 5, text: "The leaseback programme has been fantastic for offsetting ownership costs. HQ manages everything — maintenance, scheduling, insurance coordination. My R66 pays for itself, and I still fly it whenever I want." },
              { initials: 'GR', name: 'Geoff Read', role: 'PPL(H) · Self-Fly Hire Regular', category: 'Hire', stars: 5, text: "The walk-in, walk-out self-fly hire is exactly what I wanted after getting my licence. No membership fees, no hassle. I book an R44, it's fuelled and ready on the pad. Last month I flew to Le Touquet for lunch — try doing that by car." },
              { initials: 'MK', name: 'Maxim Kalyuzhny', role: 'Helicopter Owner · R22 Beta II', category: 'Ownership', stars: 5, text: "Bought my R22 through HQ and they've maintained it impeccably since. The engineering team genuinely cares. When my 2,200-hour overhaul came up, they walked me through every option and the rebuild came back better than factory." },
              { initials: 'SH', name: 'Sarah Henderson', role: 'PPL Student · Hour Building', category: 'Training', stars: 5, text: "The instructors at HQ are patient, professional and genuinely passionate about teaching. I started my PPL in January and passed my skills test in September. The ground school was brilliant — passed all nine exams first time." },
              { initials: 'JM', name: 'James Mitchell', role: 'Expedition Participant · Iceland 2024', category: 'Expeditions', stars: 5, text: "Flying to Iceland with Captain Q was a once-in-a-lifetime experience. The planning was meticulous, the flying was extraordinary, and the camaraderie between the group was something I'll never forget. Already signed up for the next one." },
            ]).map((t, i) => (
              <div key={i} className="fd-testimonials__card">
                <div className="fd-testimonials__card-stars">
                  {'★'.repeat(t.stars).split('').map((s, j) => <span key={j}>{s}</span>)}
                </div>
                <p className="fd-testimonials__card-text">{t.text}</p>
                <div className="fd-testimonials__card-author">
                  <div className="fd-testimonials__avatar fd-testimonials__avatar--sm">{t.initials}</div>
                  <div>
                    <strong>{t.name}</strong>
                    <span>{t.role}</span>
                  </div>
                </div>
                <span className="fd-testimonials__card-cat">{t.category}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="fd-testimonials__bottom">
          <div className="fd-testimonials__cta-row">
            <div className="fd-testimonials__cta-card">
              <h4>Share Your Experience</h4>
              <p>Flown with HQ Aviation? We'd love to hear about it. Your review helps other pilots discover what makes this place special.</p>
              <Link to="/testimonials" className="fd-btn">Write a Review<span>→</span></Link>
            </div>
            <div className="fd-testimonials__cta-card fd-testimonials__cta-card--google">
              <h4>Review Us on Google</h4>
              <p>Your Google review helps us reach more aspiring pilots and helicopter enthusiasts. Thank you for your support.</p>
              <span className="fd-testimonials__google-stars">{'★★★★★'} <em>4.9 / 5</em></span>
            </div>
          </div>
        </div>
      </section>

      {/* ===== EDITORIAL GRID (Hero 90) ===== */}
      <div className="reveal-element">
        <EditorialGrid />
      </div>

      <div className="fd-about__divider">
        <span className="fd-about__divider-line"></span>
        <div className="fd-about__socials">
          <a href="https://www.instagram.com/haborhelicopters/" target="_blank" rel="noopener noreferrer" className="fd-about__social" aria-label="Instagram">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><rect x="2" y="2" width="20" height="20" rx="5"></rect><circle cx="12" cy="12" r="5"></circle><circle cx="17.5" cy="6.5" r="1.5" fill="currentColor" stroke="none"></circle></svg>
          </a>
          <a href="https://www.facebook.com/haborhelicopters" target="_blank" rel="noopener noreferrer" className="fd-about__social" aria-label="Facebook">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M18 2h-3a5 5 0 00-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 011-1h3z"></path></svg>
          </a>
          <a href="https://www.youtube.com/@hqaviation" target="_blank" rel="noopener noreferrer" className="fd-about__social" aria-label="YouTube">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M22.54 6.42a2.78 2.78 0 00-1.94-2C18.88 4 12 4 12 4s-6.88 0-8.6.46a2.78 2.78 0 00-1.94 2A29 29 0 001 11.75a29 29 0 00.46 5.33A2.78 2.78 0 003.4 19.1c1.72.46 8.6.46 8.6.46s6.88 0 8.6-.46a2.78 2.78 0 001.94-2 29 29 0 00.46-5.25 29 29 0 00-.46-5.43z"></path><polygon points="9.75,15.02 15.5,11.75 9.75,8.48" fill="currentColor" stroke="none"></polygon></svg>
          </a>
        </div>
        <span className="fd-about__divider-line"></span>
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
          overflow-x: clip;
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
          max-width: 1100px;
          text-align: center;
          width: 100%;
        }

        .fd-about__label {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 1.5rem;
          font-size: 0.7rem;
          text-transform: uppercase;
          letter-spacing: 0.2em;
          color: #999;
          margin-bottom: 2rem;
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
          overflow: visible;
          max-width: 640px;
          margin-left: auto;
          margin-right: auto;
        }

        .fd-about__video-lines {
          position: absolute;
          top: 50%;
          left: -4rem;
          right: -4rem;
          transform: translateY(-50%);
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

        /* --- About Split: V8 Warm Tonal --- */
        .fd-about__socials {
          display: flex;
          align-items: center;
          gap: 0.75rem;
        }
        .fd-about__socials-label {
          font-family: 'Share Tech Mono', monospace;
          font-size: 0.65rem;
          letter-spacing: 0.15em;
          text-transform: uppercase;
          color: #999;
        }
        .fd-about__social {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 36px;
          height: 36px;
          border: 1px solid #e8e6e2;
          border-radius: 50%;
          color: #999;
          text-decoration: none;
          transition: all 0.3s ease;
        }
        .fd-about__social:hover {
          color: #1a1a1a;
          border-color: #1a1a1a;
        }

        .fd-about__divider {
          display: flex;
          align-items: center;
          gap: 1.5rem;
          margin-top: 3rem;
          margin-bottom: 3rem;
        }
        .fd-about__divider-line {
          flex: 1;
          height: 1px;
          background: #e8e6e2;
        }
        .fd-about__divider-text {
          font-family: 'Share Tech Mono', monospace;
          font-size: 0.65rem;
          letter-spacing: 0.15em;
          text-transform: uppercase;
          color: #a09080;
          white-space: nowrap;
        }
        @media (max-width: 768px) {
        }

        /* --- About V9: Integrated About + Founder --- */
        .abt-v9 {
          padding: 6rem 2rem;
          background: #faf9f7;
        }
        .abt-v9__inner {
          max-width: 1100px;
          margin: 0 auto;
        }
        .abt-v9__pre {
          font-family: 'Share Tech Mono', monospace;
          font-size: 0.65rem;
          letter-spacing: 0.2em;
          text-transform: uppercase;
          color: #a09080;
          display: block;
          margin-bottom: 1rem;
        }
        .abt-v9__headline {
          font-family: 'Space Grotesk', sans-serif;
          font-size: clamp(1.8rem, 3.5vw, 2.8rem);
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: -0.02em;
          line-height: 1.05;
          margin: 0 0 3rem;
          color: #1a1a1a;
        }

        /* Two-column editorial */
        .abt-v9__columns {
          display: grid;
          grid-template-columns: 300px 1fr;
          gap: 3.5rem;
          align-items: start;
          margin-bottom: 3.5rem;
        }
        .abt-v9__portrait {
          position: relative;
          overflow: hidden;
          border-radius: 2px;
        }
        .abt-v9__portrait img {
          width: 100%;
          aspect-ratio: 3 / 4;
          object-fit: cover;
          object-position: top center;
          display: block;
          filter: saturate(0.85);
          transition: filter 0.5s;
        }
        .abt-v9__portrait:hover img { filter: saturate(1); }
        .abt-v9__caption {
          position: absolute;
          bottom: 0;
          left: 0;
          right: 0;
          padding: 3rem 1rem 1rem;
          background: linear-gradient(to top, rgba(10,10,8,0.8) 0%, transparent 100%);
        }
        .abt-v9__name {
          display: block;
          font-family: 'Space Grotesk', sans-serif;
          font-size: 0.82rem;
          font-weight: 600;
          color: #fff;
          text-transform: uppercase;
          letter-spacing: 0.03em;
        }
        .abt-v9__role {
          display: block;
          font-family: 'Share Tech Mono', monospace;
          font-size: 0.55rem;
          letter-spacing: 0.12em;
          text-transform: uppercase;
          color: rgba(255,255,255,0.55);
          margin-top: 0.25rem;
        }

        /* Content column */
        .abt-v9__meta {
          display: flex;
          align-items: center;
          flex-wrap: wrap;
          gap: 0.75rem;
          padding-bottom: 1.5rem;
          margin-bottom: 1.5rem;
          border-bottom: 1px solid #e8e6e2;
        }
        .abt-v9__meta-item {
          font-family: 'Share Tech Mono', monospace;
          font-size: 0.62rem;
          letter-spacing: 0.08em;
          text-transform: uppercase;
          color: #999;
        }
        .abt-v9__meta-item strong {
          font-family: 'Space Grotesk', sans-serif;
          font-size: 0.9rem;
          font-weight: 600;
          color: #1a1a1a;
          letter-spacing: normal;
          text-transform: none;
        }
        .abt-v9__sep {
          width: 1px;
          height: 14px;
          background: #d8d6d2;
        }
        .abt-v9__lead {
          font-family: 'Space Grotesk', sans-serif;
          font-size: 1rem;
          line-height: 1.75;
          color: #4a4a4a;
          margin: 0 0 1rem;
        }
        .abt-v9__text {
          font-family: 'Space Grotesk', sans-serif;
          font-size: 0.88rem;
          line-height: 1.75;
          color: #6b5e50;
          margin: 0 0 2rem;
        }
        .abt-v9__milestones {
          display: flex;
          gap: 0.75rem;
          margin-bottom: 1.75rem;
          overflow-x: auto;
          scrollbar-width: none;
          -ms-overflow-style: none;
        }
        .abt-v9__milestones::-webkit-scrollbar { display: none; }
        .abt-v9__milestone {
          display: flex;
          flex-direction: column;
          align-items: center;
          text-align: center;
          flex-shrink: 0;
          width: 130px;
          padding: 1.25rem 0.75rem;
          border: 1px solid #e8e4df;
          background: #faf8f5;
          transition: border-color 0.2s;
        }
        .abt-v9__milestone:hover {
          border-color: #c0b8aa;
        }
        .abt-v9__milestone i {
          font-size: 1rem;
          color: #a09080;
          margin-bottom: 0.6rem;
        }
        .abt-v9__milestone-year {
          font-family: 'Share Tech Mono', monospace;
          font-size: 0.55rem;
          letter-spacing: 0.15em;
          color: #a09080;
          margin-bottom: 0.5rem;
        }
        .abt-v9__milestone-text {
          font-family: 'Space Grotesk', sans-serif;
          font-size: 0.7rem;
          font-weight: 700;
          color: #2a2218;
          line-height: 1.3;
          margin-bottom: 0.3rem;
        }
        .abt-v9__milestone-sub {
          font-family: 'Share Tech Mono', monospace;
          font-size: 0.48rem;
          letter-spacing: 0.08em;
          text-transform: uppercase;
          color: #b0a898;
        }
        .abt-v9__link {
          display: inline-flex;
          align-items: center;
          gap: 0.5rem;
          font-family: 'Space Grotesk', sans-serif;
          font-size: 0.72rem;
          font-weight: 500;
          color: #1a1a1a;
          text-decoration: none;
          padding-bottom: 2px;
          border-bottom: 1px solid #1a1a1a;
          transition: all 0.3s;
        }
        .abt-v9__link:hover { color: #6b5e50; border-color: #6b5e50; }
        .abt-v9__link svg { transition: transform 0.3s; }
        .abt-v9__link:hover svg { transform: translateX(3px); }

        /* Why Fly horizontal panel */
        .abt-v9__whyfly {
          display: grid;
          grid-template-columns: 280px 1fr;
          border: 1px solid #e8e6e2;
          border-radius: 3px;
          overflow: hidden;
          background: #fff;
          margin-bottom: 3rem;
        }
        .abt-v9__whyfly-visual {
          position: relative;
          min-height: 220px;
          overflow: hidden;
        }
        .abt-v9__whyfly-slide {
          position: absolute;
          inset: 0;
          background-size: cover;
          background-position: center;
          opacity: 0;
          transition: opacity 0.6s ease;
        }
        .abt-v9__whyfly-slide.active { opacity: 1; }
        .abt-v9__whyfly-content {
          padding: 1.75rem 2rem;
          display: flex;
          flex-direction: column;
          justify-content: center;
        }
        .abt-v9__whyfly-label {
          font-family: 'Share Tech Mono', monospace;
          font-size: 0.6rem;
          letter-spacing: 0.18em;
          text-transform: uppercase;
          color: #a09080;
          margin-bottom: 0.75rem;
        }
        .abt-v9__whyfly-items {
          display: grid;
          min-height: 90px;
          align-content: center;
          margin-bottom: 1rem;
        }
        .abt-v9__whyfly-item {
          grid-area: 1 / 1;
          opacity: 0;
          transition: opacity 0.4s ease;
        }
        .abt-v9__whyfly-item.active { opacity: 1; }
        .abt-v9__whyfly-verb {
          font-family: 'Space Grotesk', sans-serif;
          font-size: 1.1rem;
          font-weight: 600;
          color: #1a1a1a;
          text-transform: uppercase;
          letter-spacing: -0.01em;
          margin: 0 0 0.4rem;
        }
        .abt-v9__whyfly-verb span {
          font-weight: 400;
          color: #6b5e50;
        }
        .abt-v9__whyfly-content p {
          font-family: 'Space Grotesk', sans-serif;
          font-size: 0.82rem;
          line-height: 1.65;
          color: #6b5e50;
          margin: 0;
        }
        .abt-v9__whyfly-nav {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding-top: 1rem;
          border-top: 1px solid #f0eeea;
        }
        .abt-v9__whyfly-dots {
          display: flex;
          gap: 3px;
        }
        .abt-v9__whyfly-dot {
          width: 16px;
          height: 2px;
          background: #d8d6d2;
          border: none;
          padding: 0;
          cursor: pointer;
          transition: all 0.3s;
        }
        .abt-v9__whyfly-dot.active {
          background: #1a1a1a;
          width: 24px;
        }
        .abt-v9__whyfly-arrows {
          display: flex;
          gap: 0.25rem;
        }
        .abt-v9__whyfly-arrows button {
          background: none;
          border: 1px solid #e8e6e2;
          border-radius: 2px;
          padding: 0.3rem;
          cursor: pointer;
          color: #999;
          display: flex;
          transition: all 0.2s;
        }
        .abt-v9__whyfly-arrows button:hover {
          border-color: #1a1a1a;
          color: #1a1a1a;
        }

        /* Bottom bar */
        .abt-v9__bottom {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding-top: 2rem;
          border-top: 1px solid #e8e6e2;
        }
        .abt-v9__tagline {
          font-family: 'Share Tech Mono', monospace;
          font-size: 0.65rem;
          letter-spacing: 0.15em;
          text-transform: uppercase;
          color: #a09080;
        }
        .abt-v9__cta {
          display: inline-flex;
          align-items: center;
          gap: 0.5rem;
          font-family: 'Space Grotesk', sans-serif;
          font-size: 0.72rem;
          text-transform: uppercase;
          letter-spacing: 0.1em;
          color: #fff;
          background: #1a1a1a;
          padding: 0.7rem 1.5rem;
          border-radius: 2px;
          text-decoration: none;
          transition: background 0.3s;
          flex-shrink: 0;
        }
        .abt-v9__cta:hover { background: #333; color: #fff; }

        /* Responsive */
        @media (max-width: 860px) {
          .abt-v9__columns {
            grid-template-columns: 1fr;
            gap: 2.5rem;
          }
          .abt-v9__portrait { max-width: 300px; }
          .abt-v9__whyfly { grid-template-columns: 1fr; }
          .abt-v9__whyfly-visual { min-height: 200px; }
        }
        @media (max-width: 640px) {
          .abt-v9 { padding: 4rem 1.5rem; }
          .abt-v9__portrait { max-width: 240px; }
          .abt-v9__sep { display: none; }
          .abt-v9__meta { gap: 0.5rem; }
          .abt-v9__meta-item { width: calc(50% - 0.25rem); }
          .abt-v9__bottom { flex-direction: column; gap: 1.25rem; text-align: center; }
          .abt-v9__cta { width: 100%; justify-content: center; }
        }

        /* ===== HORIZONTAL ACCORDION NAV ===== */
        .fd-nav {
          position: sticky;
          top: 49px;
          z-index: 100;
          background: #fff;
          border-top: 1px solid #e8e6e2;
          border-bottom: 1px solid #e8e6e2;
          padding: 0;
          overflow: hidden;
          transition: border-top-color 1.2s ease, box-shadow 0.3s ease;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
        }

        .fd-nav--compact {
          border-top-color: transparent;
        }

        .fd-nav__header {
          display: flex;
          align-items: center;
          gap: 1rem;
          padding: 0.5rem 2rem;
          max-height: 40px;
          transition: max-height 1.2s ease, padding 1.2s ease, opacity 0.6s ease;
        }

        .fd-nav--compact .fd-nav__header {
          max-height: 0;
          padding-top: 0;
          padding-bottom: 0;
          opacity: 0;
          pointer-events: none;
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
          border-top: 1px solid #e8e6e2;
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

        /* ===== TRAINING SECTION (two-col like clubhouse) ===== */
        .fd-training-section {
          background: #faf9f6;
          padding: 0;
          position: relative;
          overflow-x: clip;
          z-index: 2;
        }
        .fd-training-inner {
          display: grid;
          grid-template-columns: 1fr 1fr;
          align-items: start;
          padding: 4rem 2rem 0;
        }
        .fd-training-sticky {
          position: sticky;
          top: 35vh;
          padding: 2rem 3rem 2rem 0;
          grid-row: 1 / span 2;
          z-index: 1;
        }
        .fd-training-courses {
          padding: 0;
          min-width: 0;
          overflow: hidden;
          position: relative;
          z-index: 2;
          background: #faf9f6;
        }
        .fd-training-header__pretitle {
          display: block;
          font-size: 0.75rem;
          text-transform: uppercase;
          letter-spacing: 0.15em;
          color: #888;
          margin-bottom: 0.75rem;
          font-family: 'Space Grotesk', sans-serif;
        }
        .fd-training-header__headline {
          display: flex;
          flex-direction: column;
          align-items: flex-start;
          line-height: 1.1;
          margin-bottom: 1rem;
        }
        .fd-training-header__headline span {
          font-family: 'Space Grotesk', sans-serif;
          font-size: clamp(2rem, 4vw, 3rem);
          font-weight: 700;
          line-height: 1.15;
          text-transform: uppercase;
        }
        .fd-training-header__headline span:nth-child(1) {
          color: #1a1a1a;
        }
        .fd-training-header__headline span:nth-child(2) {
          color: #1E3A5F;
        }
        .fd-training-header__desc {
          max-width: 100%;
          font-size: 0.95rem;
          line-height: 1.6;
          color: #555;
          font-family: 'Space Grotesk', sans-serif;
        }
        .fd-training-header__divider {
          border: none;
          border-top: 1px solid #e8e6e2;
          margin: 1.5rem 0;
        }
        .fd-training-sticky__bg {
          position: absolute;
          top: 0;
          left: -2rem;
          width: 100vw;
          height: 100%;
          z-index: 1;
          overflow: visible;
          pointer-events: none;
        }
        .fd-training-sticky__bg .scroll-path-section {
          width: 100%;
          margin-left: 0;
          margin-right: 0;
          min-height: 100%;
          overflow: visible;
        }
        .fd-training-sticky__text {
          position: relative;
          z-index: 2;
        }
        .fd-zigzag__item-content {
          position: relative;
          z-index: 2;
          padding: 1.25rem 1.5rem 1.5rem;
        }

        /* ===== ZIGZAG TRAINING SECTION ===== */
        .fd-zigzag-section {
          padding: 0 2rem 1.5rem;
          background: #faf9f6;
          position: relative;
          z-index: 10;
        }
        .fd-zigzag__list { margin: 0; }
        .fd-zigzag__item {
          display: grid; grid-template-columns: 1fr;
          gap: 0; align-items: center;
          background: #eae8e4;
          border: 1px solid rgba(0,0,0,0.12);
          border-radius: 8px;
          overflow: hidden;
          margin-bottom: 1.5rem;
        }
        .fd-zigzag__item:last-child {
          margin-bottom: 0;
        }
        .fd-zigzag__item--right { direction: ltr; }
        .fd-zigzag__item--right > * { direction: ltr; }
        .fd-zigzag__item-image {
          position: relative;
          overflow: hidden; height: 220px;
        }
        .fd-zigzag__item-image img { width: 100%; height: 100%; object-fit: cover; }
        .fd-zigzag__item-num {
          position: absolute; top: 0.75rem; left: 0.75rem;
          font-family: 'Share Tech Mono', monospace;
          font-size: 1.5rem; font-weight: 300; color: rgba(255,255,255,0.5);
        }
        .fd-zigzag__item-tag {
          font-family: 'Share Tech Mono', monospace;
          font-size: 0.55rem; letter-spacing: 0.15em; text-transform: uppercase;
          color: #999; display: block; margin-bottom: 0.5rem;
        }
        .fd-zigzag__item-title {
          font-size: 1.2rem; font-weight: 600; text-transform: uppercase;
          letter-spacing: 0.03em; margin: 0 0 0.75rem; color: #1a1a1a;
        }
        .fd-zigzag__item-desc {
          color: #666; line-height: 1.7; font-size: 0.85rem; margin: 0 0 1.25rem;
        }

        /* Horizontal scroll cards */
        .fd-hscroll-runway {
          position: relative;
          z-index: 1;
          grid-column: 2;
          min-width: 0;
          margin-top: 0;
        }
        .fd-hscroll-sticky {
          position: relative;
          width: 100%;
        }
        .fd-hscroll-wrap {
          position: relative;
        }
        .fd-zigzag__hscroll {
          overflow: hidden;
          padding: 1rem 0 1rem;
          max-width: 100%;
        }
        .fd-zigzag__hscroll-inner {
          display: grid;
          grid-auto-flow: column;
          grid-template-rows: 1fr 1fr;
          gap: 1.5rem;
          width: max-content;
          will-change: transform;
        }
        .fd-hscroll-chevron {
          position: absolute;
          top: 50%;
          transform: translateY(-50%);
          z-index: 2;
          width: 36px;
          height: 36px;
          border-radius: 50%;
          border: 1px solid #e8e6e2;
          background: #fff;
          color: #999;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          font-size: 0.75rem;
          transition: all 0.2s ease;
        }
        .fd-hscroll-chevron:hover {
          background: #1a1a1a;
          border-color: #1a1a1a;
          color: #fff;
        }
        .fd-hscroll-chevron--left { left: -18px; }
        .fd-hscroll-chevron--right { right: -18px; }
        .fd-zigzag__hscroll::-webkit-scrollbar { display: none; }
        .fd-zigzag__card {
          flex-shrink: 0; width: 260px; min-width: 260px;
          scroll-snap-align: start;
          background: #fff; border: 1px solid #e8e6e2;
          border-radius: 10px; overflow: hidden;
        }
        .fd-zigzag__card-image { height: 140px; overflow: hidden; }
        .fd-zigzag__card-image img { width: 100%; height: 100%; object-fit: cover; }
        .fd-zigzag__card-body { padding: 1rem; }
        .fd-zigzag__card-header {
          display: flex; align-items: center; gap: 0.75rem; margin-bottom: 0.5rem;
        }
        .fd-zigzag__card-num {
          font-family: 'Share Tech Mono', monospace;
          font-size: 1.2rem; font-weight: 300; color: #d1d5db;
        }
        .fd-zigzag__card-tag {
          font-family: 'Share Tech Mono', monospace;
          font-size: 0.5rem; letter-spacing: 0.2em; text-transform: uppercase;
          color: #999;
        }
        .fd-zigzag__card-title {
          font-size: 0.85rem; font-weight: 600; text-transform: uppercase;
          letter-spacing: 0.03em; margin: 0 0 0.5rem; color: #1a1a1a;
        }
        .fd-zigzag__card-desc {
          color: #666; line-height: 1.5; font-size: 0.75rem; margin: 0 0 0.75rem;
          display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden;
        }
        .fd-zigzag__card-footer {
          display: flex; align-items: center; justify-content: space-between;
        }
        .fd-zigzag__card-duration {
          font-family: 'Share Tech Mono', monospace;
          font-size: 0.6rem; color: #999; letter-spacing: 0.1em;
        }
        .fd-zigzag__card-btn {
          display: inline-flex; align-items: center; gap: 0.5rem;
          font-size: 0.75rem; font-weight: 600; text-transform: uppercase;
          letter-spacing: 0.05em; color: #1a1a1a; text-decoration: none;
          transition: color 0.2s ease;
        }
        .fd-zigzag__card-btn:hover { color: #555; }

        @media (max-width: 768px) {
          .fd-training-inner {
            grid-template-columns: 1fr;
            gap: 2rem;
          }
          .fd-training-sticky {
            position: static;
          }
          .fd-zigzag__item { grid-template-columns: 1fr; gap: 1rem; }
          .fd-zigzag__item--right { direction: ltr; }
          .fd-zigzag__item-image { height: 180px; }
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
          padding-bottom: 3rem;
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
          top: 38vh;
          left: 50%;
          transform: translate(-50%, -50%);
          width: min(90vw, 780px);
          height: min(90vw, 780px);
          pointer-events: none;
          z-index: 1;
          color: #1a1a1a;
        }

        .fd-exped__globe svg {
          width: 100%;
          height: 100%;
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
          margin: 0 0 12px;
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
          overflow-x: clip;
        }

        .fd-sales__intro {
          display: grid;
          grid-template-columns: 1fr 1fr;
        }

        .fd-sales__left {
          grid-column: 1;
          grid-row: 1;
          align-self: stretch;
          max-width: 480px;
          margin: 0 auto;
          padding: 0 3rem;
        }

        .fd-sales__header-sticky {
          position: sticky;
          top: 10vh;
          text-align: left;
          padding: 32px 0 1.25rem;
        }

        .fd-sales__dealer-catch {
          position: sticky;
          z-index: 2;
          padding: 0.5rem 0 2rem;
          transition: top 1.6s cubic-bezier(0.16, 1, 0.3, 1);
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
          margin: 0 0 1.25rem;
        }

        .fd-sales__title-word {
          display: block;
          font-family: 'Space Grotesk', sans-serif;
          font-size: clamp(2.2rem, 5vw, 3.8rem);
          font-weight: 700;
          text-transform: uppercase;
          line-height: 1;
          letter-spacing: -0.02em;
        }

        .fd-sales__title-word--1 { color: #1a1a1a; }
        .fd-sales__title-word--2 { color: #4a4a4a; }
        .fd-sales__title-word--3 { color: #7a7a7a; }

        .fd-sales__text {
          font-size: 1rem;
          line-height: 1.7;
          color: #666;
          max-width: 600px;
          margin: 0;
        }

        .fd-sales__header-divider {
          width: 60px;
          height: 1px;
          background: #ccc;
          margin: 1rem 0 0;
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

        .fd-sales__section-title--toggle {
          cursor: pointer;
          user-select: none;
        }

        .fd-sales__chevron {
          font-size: 0.7rem;
          transition: transform 0.3s ease;
          color: #999;
          flex-shrink: 0;
          order: 2;
          width: 1.2rem;
          text-align: center;
        }
        .fd-sales__chevron--open {
          transform: rotate(180deg);
        }

        .fd-sales__collapse {
          max-height: 0;
          overflow: hidden;
          transition: max-height 0.4s ease, opacity 0.3s ease;
          opacity: 0;
        }
        .fd-sales__collapse--open {
          max-height: 3000px;
          opacity: 1;
        }

        .fd-sales__section-title::after {
          content: '';
          flex: 1;
          height: 1px;
          background: #e8e6e2;
          order: 1;
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
          position: relative;
          aspect-ratio: 4/3;
          background: linear-gradient(135deg, #f5f4f0 0%, #eae8e2 100%);
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 1rem;
          overflow: hidden;
        }

        .fd-sales__sold-image img {
          max-width: 85%;
          max-height: 85%;
          object-fit: contain;
          opacity: 0.7;
          filter: grayscale(30%);
        }

        .fd-sales__sold-image--active img {
          opacity: 1;
          filter: none;
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
          overflow-x: clip;
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
          background: linear-gradient(to bottom, #faf9f6 75%, #fff 100%);
          overflow-x: clip;
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
          padding-top: 1.5rem;
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

        /* ===== MAINTENANCE INTRO (sticky gallery layout) ===== */
        .fd-maint__intro {
          display: grid;
          grid-template-columns: 1fr 1fr;
        }

        .fd-maint__left {
          grid-column: 1;
          grid-row: 1;
          align-self: stretch;
          max-width: 480px;
          margin: 0 auto;
          padding: 0 3rem;
        }

        .fd-maint__header-sticky {
          position: sticky;
          top: 10vh;
          text-align: left;
          padding: 32px 0 1.25rem;
        }

        .fd-maint__service-catch {
          position: sticky;
          z-index: 2;
          padding: 0.5rem 0 2rem;
          transition: top 1.6s cubic-bezier(0.16, 1, 0.3, 1);
        }

        .fd-maint__intro-bg {
          grid-column: 2;
          grid-row: 1;
          background: #d6d2cc;
          border-radius: 8px 0 0 8px;
          pointer-events: none;
          align-self: stretch;
          margin: -1rem -50vw -1rem 0;
        }

        .fd-maint__intro-border {
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

        .fd-maint__intro-gallery {
          grid-column: 2;
          grid-row: 1;
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 6px;
          z-index: 1;
          padding: 1.5rem 3rem 0.75rem;
        }

        /* ===== GALLERY FULLSCREEN OVERLAY ===== */
        .fd-gallery-fs {
          position: fixed;
          inset: 0;
          z-index: 10000;
          background: #000;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .fd-gallery-fs__img-wrap {
          position: absolute;
          inset: 0;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .fd-gallery-fs__img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          animation: fdGalleryFade 0.8s ease;
        }
        @keyframes fdGalleryFade {
          from { opacity: 0; transform: scale(1.02); }
          to { opacity: 1; transform: scale(1); }
        }
        .fd-gallery-fs__clock {
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          font-family: 'Space Grotesk', sans-serif;
          font-size: clamp(3rem, 8vw, 8rem);
          font-weight: 300;
          color: #fff;
          letter-spacing: 0.05em;
          text-shadow: 0 2px 40px rgba(0,0,0,0.5);
          z-index: 2;
          pointer-events: none;
        }
        .fd-gallery-fs__controls {
          position: absolute;
          bottom: 2rem;
          left: 50%;
          transform: translateX(-50%);
          display: flex;
          align-items: center;
          gap: 1.5rem;
          z-index: 3;
        }
        .fd-gallery-fs__controls button {
          width: 40px;
          height: 40px;
          border: 1px solid rgba(255,255,255,0.2);
          border-radius: 50%;
          background: rgba(0,0,0,0.3);
          backdrop-filter: blur(8px);
          color: #fff;
          font-size: 1.2rem;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: background 0.2s;
        }
        .fd-gallery-fs__controls button:hover {
          background: rgba(255,255,255,0.15);
        }
        .fd-gallery-fs__counter {
          font-family: 'Share Tech Mono', monospace;
          font-size: 0.7rem;
          color: rgba(255,255,255,0.6);
          letter-spacing: 0.1em;
        }
        .fd-gallery-fs__close {
          position: absolute;
          top: 1.5rem;
          right: 1.5rem;
          width: 40px;
          height: 40px;
          border: 1px solid rgba(255,255,255,0.2);
          border-radius: 50%;
          background: rgba(0,0,0,0.3);
          backdrop-filter: blur(8px);
          color: #fff;
          font-size: 1.5rem;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 3;
          transition: background 0.2s;
        }
        .fd-gallery-fs__close:hover {
          background: rgba(255,255,255,0.15);
        }
        .fd-gallery-fs__clock-toggle {
          position: absolute;
          top: 1.5rem;
          right: 4.5rem;
          width: 40px;
          height: 40px;
          border: 1px solid rgba(255,255,255,0.2);
          border-radius: 50%;
          background: rgba(0,0,0,0.3);
          backdrop-filter: blur(8px);
          color: #fff;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 3;
          transition: background 0.2s;
        }
        .fd-gallery-fs__clock-toggle:hover {
          background: rgba(255,255,255,0.15);
        }

        /* ===== MERGED MAINTENANCE PANEL ===== */
        .fd-maint__merged {
          margin: 1.5rem -2rem 0;
          background: transparent;
          padding: 1.5rem 2rem;
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
          background: #e8e4df;
          border: 1px solid rgba(0,0,0,0.12);
          border-radius: 8px;
          padding: 1.5rem;
        }
        .fd-maint__merged .mv12-crosshead {
          grid-row: 1;
          margin-bottom: 0;
        }
        .fd-maint__facility-card .mv12-crosshead {
          margin-bottom: 1.25rem;
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
          border-radius: 8px;
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
          background: #e8e4df;
          border: 1px solid rgba(0,0,0,0.12);
          border-radius: 8px;
          padding: 1.5rem 1.5rem 2.5rem;
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
          border-radius: 8px;
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
        .fd-maint__facility-carousel {
          position: relative;
          overflow: hidden;
          border-radius: 8px;
        }
        .fd-maint__facility-track {
          display: flex;
          transition: transform 0.4s ease;
        }
        .fd-maint__facility-slide {
          flex: 0 0 100%;
          text-align: center;
        }
        .fd-maint__facility-images {
          display: grid;
          grid-template-columns: repeat(5, 1fr);
          gap: 0.5rem;
          margin-bottom: 0.75rem;
          justify-content: center;
          align-items: center;
        }
        .fd-maint__facility-img {
          height: 160px;
          background: #fff;
          border-radius: 6px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 1.5rem;
          color: #7a7a7a;
          overflow: hidden;
        }
        .fd-maint__facility-img img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }
        .fd-maint__facility-slide span {
          font-size: 0.7rem;
          color: #7a7a7a;
          font-family: 'Share Tech Mono', monospace;
          text-transform: uppercase;
          letter-spacing: 0.05em;
        }
        .fd-maint__facility-chevron {
          position: absolute;
          top: 80px;
          transform: translateY(-50%);
          z-index: 2;
          width: 36px;
          height: 36px;
          border: none;
          border-radius: 0;
          background: rgba(0,0,0,0.04);
          backdrop-filter: blur(4px);
          font-size: 0.9rem;
          font-weight: 300;
          color: #666;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: background 0.2s, color 0.2s;
        }
        .fd-maint__facility-chevron:hover {
          background: rgba(0,0,0,0.08);
          color: #1a1a1a;
        }
        .fd-maint__facility-chevron--left { left: 0; border-radius: 0 4px 4px 0; }
        .fd-maint__facility-chevron--right { right: 0; border-radius: 4px 0 0 4px; }
        .fd-maint__facility-dots {
          display: flex;
          justify-content: center;
          gap: 6px;
          margin-top: 0.75rem;
        }
        .fd-maint__facility-dot {
          width: 6px;
          height: 6px;
          border-radius: 50%;
          border: none;
          background: rgba(0,0,0,0.15);
          cursor: pointer;
          padding: 0;
          transition: background 0.2s;
        }
        .fd-maint__facility-dot--active {
          background: rgba(0,0,0,0.5);
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
        .fd-maint__merged .mv12-crosshead::before,
        .fd-maint__merged .mv12-crosshead::after {
          content: '';
          flex: 1;
          height: 1px;
          background: rgba(0,0,0,0.15);
        }
        @media (max-width: 768px) {
          .fd-maint__merged-cols { grid-template-columns: 1fr; }
          .fd-maint__merged-left { padding-right: 0; }
          .fd-maint__merged .fd-maint__grid6 { grid-template-columns: repeat(2, 1fr); }
          .fd-maint__team-grid { grid-template-columns: repeat(2, 1fr); }
        }
        @media (max-width: 550px) {
          .fd-maint__actions {
            flex-direction: column;
            align-items: center;
          }
          .fd-maint__btn {
            width: 100%;
            max-width: 280px;
          }
        }
        @media (max-width: 480px) {
          .fd-maint__merged .fd-maint__grid6 { grid-template-columns: 1fr; }
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

        /* ===== MAINTENANCE V10 — Card Grid ===== */
        .fd-maint__grid6-wrap {
          background: #e8e4df;
          color: #1a1a1a;
          border-top: 1px solid rgba(0, 0, 0, 0.12);
          border-bottom: 1px solid rgba(0, 0, 0, 0.12);
          padding: 3rem 2rem;
          margin-top: 3rem;
          margin-left: -2rem;
          margin-right: -2rem;
          padding-left: 2rem;
          padding-right: 2rem;
        }
        .fd-maint__grid6 {
          max-width: 1200px;
          margin: 0 auto;
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 1rem;
        }

        .fd-maint__grid6-card {
          padding: 1.25rem;
          background: #fff;
          border: 1px solid rgba(0, 0, 0, 0.12);
          border-radius: 8px;
          text-align: center;
          transition: border-color 0.2s;
        }

        .fd-maint__grid6-card:hover {
          border-color: #1a1a1a;
        }

        .fd-maint__grid6-icon {
          display: block;
          font-size: 1.1rem;
          color: #1a1a1a;
          margin-bottom: 0.75rem;
        }

        .fd-maint__grid6-card h4 {
          font-size: 0.78rem;
          text-transform: uppercase;
          letter-spacing: 0.05em;
          margin-bottom: 0.4rem;
          color: #1a1a1a;
        }

        .fd-maint__grid6-card p {
          font-size: 0.7rem;
          color: #7a7a7a;
          margin: 0;
          line-height: 1.4;
        }

        @media (max-width: 768px) {
          .fd-maint__grid6 {
            grid-template-columns: repeat(2, 1fr);
          }
        }

        @media (max-width: 480px) {
          .fd-maint__grid6 {
            grid-template-columns: 1fr;
          }
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
        .mv12-crosshead::before {
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

        /* Photo Strip */
        .mv12-strip {
          display: flex;
          gap: 0.5rem;
          margin-bottom: 2.5rem;
          overflow-x: auto;
        }
        .mv12-strip__item {
          flex: 1;
          min-width: 140px;
          text-align: center;
        }
        .mv12-strip__img-placeholder {
          height: 100px;
          background: #f0eeeb;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 1.5rem;
          color: #7a7a7a;
          margin-bottom: 0.5rem;
        }
        .mv12-strip__item span {
          font-size: 0.6rem;
          color: #7a7a7a;
          font-family: 'Share Tech Mono', monospace;
        }

        /* Portraits */
        .mv12-portraits {
          margin-top: 3rem;
          margin-bottom: 2.5rem;
        }
        .mv12-portraits__row {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 1rem;
        }
        .mv12-portraits__person { text-align: center; }
        .mv12-portraits__circle {
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
          margin: 0 auto 0.75rem;
        }
        .mv12-portraits__person strong {
          display: block;
          font-size: 0.78rem;
          margin-bottom: 0.25rem;
        }
        .mv12-portraits__person span {
          font-size: 0.6rem;
          color: #7a7a7a;
          line-height: 1.4;
        }

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
          .mv12-portraits__row { grid-template-columns: repeat(2, 1fr); }
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
          .fd-maint__intro { grid-template-columns: 1fr; }
          .fd-maint__left { padding: 0 1.5rem; }
          .fd-maint__header-sticky { position: static; text-align: center; padding: 2rem 0; }
          .fd-maint__service-catch { position: static; transition: none; }
          .fd-maint__intro-bg, .fd-maint__intro-border { display: none; }
          .fd-maint__intro-gallery { grid-column: 1; grid-row: auto; padding: 0 1.5rem 1.5rem; }
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
        .rb-stats__strip-gallery {
          position: relative;
          overflow: hidden;
        }
        .rb-stats__strip-gallery img {
          width: 100%;
          aspect-ratio: 16 / 10;
          object-fit: cover;
          display: block;
          background: #f5f4f1;
        }
        .rb-stats__strip-nav {
          position: absolute;
          top: 50%;
          transform: translateY(-50%);
          width: 24px;
          height: 24px;
          border-radius: 50%;
          background: rgba(255,255,255,0.85);
          border: none;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          opacity: 0;
          transition: opacity 0.2s;
          z-index: 2;
        }
        .rb-stats__strip-nav i {
          font-size: 0.5rem;
          color: #1a1a1a;
        }
        .rb-stats__strip-nav--prev { left: 6px; }
        .rb-stats__strip-nav--next { right: 6px; }
        .rb-stats__strip-card:hover .rb-stats__strip-nav {
          opacity: 1;
        }
        .rb-stats__strip-nav:hover {
          background: #fff;
        }
        .rb-stats__strip-dots {
          position: absolute;
          bottom: 8px;
          left: 50%;
          transform: translateX(-50%);
          display: flex;
          gap: 5px;
          z-index: 2;
        }
        .rb-stats__strip-dot {
          width: 6px;
          height: 6px;
          border-radius: 50%;
          background: rgba(255,255,255,0.45);
          border: 1px solid rgba(255,255,255,0.7);
          cursor: pointer;
          transition: background 0.2s;
        }
        .rb-stats__strip-dot--active {
          background: #fff;
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
        .rb-stats__strip-cta {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 0.6rem 1rem;
          border-top: 1px solid #e8e6e2;
          font-family: 'Share Tech Mono', monospace;
          font-size: 0.55rem;
          letter-spacing: 0.1em;
          text-transform: uppercase;
          color: #999;
          background: #faf9f6;
          transition: all 0.25s ease;
        }
        .rb-stats__strip-cta i {
          font-size: 0.5rem;
          transition: transform 0.25s ease;
        }
        .rb-stats__strip-card:hover .rb-stats__strip-cta {
          background: #1a1a1a;
          color: #fff;
          border-color: #1a1a1a;
        }
        .rb-stats__strip-card:hover .rb-stats__strip-cta i {
          transform: translateX(3px);
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
           SHARED SECTION TYPOGRAPHY (fd- prefix)
           ================================================================ */
        .fd-section-pre {
          display: block;
          font-family: 'Share Tech Mono', monospace;
          font-size: 0.6rem;
          text-transform: uppercase;
          letter-spacing: 0.3em;
          color: #777;
          margin-bottom: 1.5rem;
        }
        .fd-section-title {
          font-family: 'Space Grotesk', sans-serif;
          font-size: clamp(2rem, 4vw, 3.5rem);
          font-weight: 700;
          text-transform: uppercase;
          line-height: 1.1;
          margin-bottom: 1.5rem;
        }
        .fd-section-title__word { display: block; }
        .fd-section-title__word--1 { color: #1a1a1a; }
        .fd-section-title__word--2 { color: #999; }
        .fd-section-title__word--3 { color: #bbb; }
        .fd-section-title__word--4 { color: #ccc; }
        .fd-section-desc {
          font-size: 0.9rem;
          color: #555;
          line-height: 1.7;
          max-width: 680px;
          margin-bottom: 3rem;
        }
        .fd-btn {
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
        .fd-btn:hover { background: #1a1a1a; color: #fff; }
        .fd-btn--dark {
          background: #1a1a1a;
          color: #fff;
          border-color: #1a1a1a;
        }
        .fd-btn--dark:hover { background: #333; }

        /* ================================================================
           PART SALES
           ================================================================ */
        .fd-parts {
          background: #faf9f6;
          padding: 6rem 0;
        }
        .fd-parts__inner {
          max-width: 1200px;
          margin: 0 auto;
          padding: 0 2rem;
          display: grid;
          grid-template-columns: 1fr 1px 1fr;
          gap: 2rem;
          align-items: start;
        }
        .fd-parts__inner::before {
          content: '';
          grid-column: 2;
          grid-row: 1;
          background: linear-gradient(to bottom, transparent, #d6d2cc, transparent);
          align-self: stretch;
        }
        .fd-parts__text {
          font-size: 0.9rem;
          color: #333;
          line-height: 1.8;
          margin-bottom: 1.5rem;
        }
        .fd-parts__secondary {
          font-size: 0.85rem;
          color: #555;
          line-height: 1.7;
        }
        .fd-parts__stats {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 1rem;
          margin-bottom: 2rem;
        }
        .fd-parts__stat {
          background: #faf9f6;
          border: 1px solid #e8e6e2;
          padding: 1.25rem;
          text-align: center;
        }
        .fd-parts__stat-value {
          display: block;
          font-family: 'Space Grotesk', sans-serif;
          font-size: 1.5rem;
          font-weight: 700;
          color: #1a1a1a;
          margin-bottom: 0.25rem;
        }
        .fd-parts__stat-label {
          font-family: 'Share Tech Mono', monospace;
          font-size: 0.55rem;
          text-transform: uppercase;
          letter-spacing: 0.1em;
          color: #999;
        }
        .fd-parts__enquiry {
          background: #fff;
          border: 1px solid #e8e6e2;
          border-radius: 8px;
          padding: 2rem;
          box-shadow: 0 4px 20px rgba(0,0,0,0.06);
        }
        .fd-parts__enquiry h4 {
          font-family: 'Space Grotesk', sans-serif;
          font-size: 0.85rem;
          font-weight: 600;
          color: #1a1a1a;
          margin: 0 0 0.35rem;
        }
        .fd-parts__enquiry-subtitle {
          font-family: 'Share Tech Mono', monospace;
          font-size: 0.6rem;
          text-transform: uppercase;
          letter-spacing: 0.15em;
          color: #999;
          display: block;
          margin-bottom: 1.75rem;
          padding-bottom: 1rem;
          border-bottom: 1px solid #e8e6e2;
        }
        .fd-parts__enquiry-field {
          margin-bottom: 1.25rem;
        }
        .fd-parts__enquiry-field:last-of-type {
          margin-bottom: 1.75rem;
        }
        .fd-parts__enquiry-field label {
          display: block;
          font-family: 'Space Grotesk', sans-serif;
          font-size: 0.7rem;
          font-weight: 600;
          color: #1a1a1a;
          margin-bottom: 0.4rem;
        }
        .fd-parts__enquiry-hint {
          font-family: 'Share Tech Mono', monospace;
          font-size: 0.6rem;
          color: #999;
          letter-spacing: 0.02em;
        }
        .fd-parts__enquiry-input {
          width: 100%;
          padding: 0.6rem 0.75rem;
          font-family: 'Space Grotesk', sans-serif;
          font-size: 0.8rem;
          color: #1a1a1a;
          background: #faf9f6;
          border: 1px solid #e8e6e2;
          border-radius: 4px;
          transition: border-color 0.2s, box-shadow 0.2s;
          appearance: none;
          -webkit-appearance: none;
        }
        .fd-parts__enquiry-input:focus {
          outline: none;
          border-color: #1a1a1a;
          box-shadow: 0 0 0 3px rgba(26,26,26,0.06);
        }
        .fd-parts__enquiry-input::placeholder {
          color: #bbb;
        }
        select.fd-parts__enquiry-input {
          background-image: url("data:image/svg+xml,%3Csvg width='10' height='6' viewBox='0 0 10 6' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M1 1l4 4 4-4' stroke='%23999' stroke-width='1.5' stroke-linecap='round' stroke-linejoin='round'/%3E%3C/svg%3E");
          background-repeat: no-repeat;
          background-position: right 0.75rem center;
          padding-right: 2rem;
          cursor: pointer;
        }
        .fd-parts__aircraft-btns {
          display: flex;
          gap: 0.4rem;
          flex-wrap: wrap;
        }
        .fd-parts__aircraft-btn {
          padding: 0.4rem 0.85rem;
          font-family: 'Share Tech Mono', monospace;
          font-size: 0.65rem;
          letter-spacing: 0.05em;
          border: 1px solid #e8e6e2;
          border-radius: 4px;
          background: #faf9f6;
          color: #777;
          cursor: pointer;
          transition: all 0.15s ease;
        }
        .fd-parts__aircraft-btn:hover {
          border-color: #1a1a1a;
          color: #1a1a1a;
        }
        .fd-parts__aircraft-btn--active {
          background: #1a1a1a;
          border-color: #1a1a1a;
          color: #fff;
        }
        .fd-parts__aircraft-btn--active:hover {
          background: #333;
          border-color: #333;
          color: #fff;
        }
        .fd-parts__submit {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 0.5rem;
          width: 100%;
          padding: 0.75rem 1.5rem;
          font-family: 'Space Grotesk', sans-serif;
          font-size: 0.7rem;
          font-weight: 600;
          text-transform: uppercase;
          letter-spacing: 0.08em;
          color: #fff;
          background: #1a1a1a;
          border: 1px solid #1a1a1a;
          border-radius: 4px;
          cursor: pointer;
          transition: all 0.3s;
        }
        .fd-parts__submit:hover {
          background: #333;
        }
        .fd-parts__submit span {
          font-size: 0.9rem;
          transition: transform 0.2s;
        }
        .fd-parts__submit:hover span {
          transform: translateX(3px);
        }
        @media (max-width: 900px) {
          .fd-parts__inner { grid-template-columns: 1fr; }
          .fd-parts__inner::before { display: none; }
        }

        /* ================================================================
           RATES & PRICING
           ================================================================ */
        .fd-pricing {
          background: #faf9f6;
          padding: 3rem 0;
        }
        .fd-pricing__header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          cursor: pointer;
          padding: 1rem 0;
        }
        .fd-pricing__header .fd-section-pre { margin-bottom: 0.5rem; }
        .fd-pricing__header .fd-section-title { margin-bottom: 0; }
        .fd-pricing__toggle {
          background: none;
          border: 1px solid #e8e6e2;
          border-radius: 50%;
          width: 40px;
          height: 40px;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          flex-shrink: 0;
          transition: all 0.3s;
        }
        .fd-pricing__toggle:hover {
          border-color: #1a1a1a;
        }
        .fd-pricing__toggle-icon {
          font-size: 1.4rem;
          line-height: 1;
          color: #1a1a1a;
          display: block;
          transition: transform 0.4s ease;
        }
        .fd-pricing__toggle-icon--open {
          transform: rotate(45deg);
        }
        .fd-pricing__collapsible {
          max-height: 0;
          overflow: hidden;
          transition: max-height 0.5s ease;
        }
        .fd-pricing--open .fd-pricing__collapsible {
          max-height: 3000px;
          transition: max-height 0.7s ease;
        }
        .fd-pricing--open {
          padding: 3rem 0 6rem;
        }
        .fd-pricing__inner {
          max-width: 1200px;
          margin: 0 auto;
          padding: 0 2rem;
        }
        .fd-pricing__tabs {
          display: flex;
          gap: 0;
          margin-bottom: 2.5rem;
          border-bottom: 1px solid #e8e6e2;
        }
        .fd-pricing__tab {
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
        .fd-pricing__tab:hover { color: #555; }
        .fd-pricing__tab--active {
          color: #1a1a1a;
          border-bottom-color: #1a1a1a;
        }
        .fd-pricing__table-wrap {
          margin-bottom: 2rem;
        }
        .fd-pricing__table {
          width: 100%;
          border-collapse: collapse;
          margin-bottom: 1.5rem;
        }
        .fd-pricing__table th {
          font-family: 'Share Tech Mono', monospace;
          font-size: 0.6rem;
          text-transform: uppercase;
          letter-spacing: 0.1em;
          color: #999;
          text-align: left;
          padding: 0.75rem 1rem;
          border-bottom: 1px solid #e8e6e2;
        }
        .fd-pricing__table td {
          padding: 1rem;
          border-bottom: 1px solid #f0eee9;
          font-size: 0.85rem;
          color: #333;
          vertical-align: top;
        }
        .fd-pricing__table td strong {
          font-family: 'Space Grotesk', sans-serif;
          font-weight: 700;
        }
        .fd-pricing__table td span {
          display: block;
          font-size: 0.75rem;
          color: #777;
          margin-top: 0.25rem;
        }
        .fd-pricing__price {
          font-family: 'Space Grotesk', sans-serif;
          font-weight: 700;
          white-space: nowrap;
        }
        .fd-pricing__table-highlight {
          background: #f2efea;
        }
        .fd-pricing__note {
          background: #fff;
          border: 1px solid #e8e6e2;
          padding: 1.25rem 1.5rem;
          font-size: 0.8rem;
          color: #555;
          line-height: 1.6;
          margin-bottom: 0.75rem;
        }
        .fd-pricing__note strong {
          font-family: 'Space Grotesk', sans-serif;
          color: #1a1a1a;
        }
        .fd-pricing__valet-intro {
          font-size: 0.9rem;
          color: #555;
          line-height: 1.7;
          margin-bottom: 2rem;
        }
        .fd-pricing__table--valet td,
        .fd-pricing__table--valet th {
          text-align: center;
        }
        .fd-pricing__table--valet td:first-child,
        .fd-pricing__table--valet th:first-child {
          text-align: left;
        }
        .fd-pricing__valet-tiers {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 1.25rem;
          margin-top: 1.5rem;
        }
        .fd-pricing__valet-tier {
          background: #fff;
          border: 1px solid #e8e6e2;
          padding: 1.5rem;
        }
        .fd-pricing__valet-tier h4 {
          font-family: 'Space Grotesk', sans-serif;
          font-size: 0.85rem;
          font-weight: 700;
          text-transform: uppercase;
          margin-bottom: 0.75rem;
        }
        .fd-pricing__valet-tier ul {
          list-style: none;
          padding: 0;
          margin: 0;
        }
        .fd-pricing__valet-tier li {
          font-size: 0.75rem;
          color: #555;
          padding: 0.35rem 0;
          border-bottom: 1px solid #f5f3f0;
        }
        .fd-pricing__valet-tier li:last-child { border-bottom: none; }
        .fd-pricing__hangarage-includes {
          background: #fff;
          border: 1px solid #e8e6e2;
          padding: 2rem;
          margin-bottom: 0.75rem;
        }
        .fd-pricing__hangarage-includes h4 {
          font-family: 'Space Grotesk', sans-serif;
          font-size: 0.85rem;
          font-weight: 700;
          text-transform: uppercase;
          margin-bottom: 1.25rem;
        }
        .fd-pricing__hangarage-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 1rem;
        }
        .fd-pricing__hangarage-item {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          font-size: 0.8rem;
          color: #444;
        }
        .fd-pricing__hangarage-item i {
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
          .fd-pricing__valet-tiers { grid-template-columns: 1fr; }
          .fd-pricing__table { font-size: 0.75rem; }
          .fd-pricing__hangarage-grid { grid-template-columns: repeat(2, 1fr); }
          .fd-pricing__tabs { flex-wrap: wrap; }
          .fd-pricing__table-wrap { overflow-x: auto; }
        }

        /* ================================================================
           ADDITIONAL SERVICES — EXPANDABLE DRAWERS
           ================================================================ */
        .fd-addserv {
          background: #faf9f6;
          padding: 5rem 0;
        }
        .fd-addserv__inner {
          max-width: 1200px;
          margin: 0 auto;
          padding: 0 2rem;
        }
        .fd-addserv__pre {
          display: block;
          font-family: 'Share Tech Mono', monospace;
          font-size: 0.55rem;
          text-transform: uppercase;
          letter-spacing: 0.3em;
          color: #999;
          margin-bottom: 1rem;
        }
        .fd-addserv__title {
          font-family: 'Space Grotesk', sans-serif;
          font-size: clamp(1.5rem, 3vw, 2.2rem);
          font-weight: 700;
          text-transform: uppercase;
          color: #1a1a1a;
          margin: 0 0 1rem 0;
          letter-spacing: -0.01em;
        }
        .fd-addserv__rule {
          width: 100%;
          height: 1px;
          background: #e8e6e2;
          margin-bottom: 2rem;
        }

        /* Drawer grid */
        .fd-addserv__grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 1rem;
        }
        .fd-addserv__drawer {
          all: unset;
          display: flex;
          flex-direction: column;
          align-items: center;
          text-align: center;
          gap: 0.75rem;
          border: 1px solid #e8e6e2;
          border-radius: 4px;
          padding: 2rem 1.5rem;
          cursor: pointer;
          box-sizing: border-box;
          background: #fff;
          transition: border-color 0.3s, box-shadow 0.3s;
        }
        .fd-addserv__drawer:hover {
          border-color: #ccc;
          box-shadow: 0 2px 12px rgba(0,0,0,0.04);
        }
        .fd-addserv__drawer--open {
          border-color: #1a1a1a;
          box-shadow: 0 4px 20px rgba(0,0,0,0.06);
        }
        .fd-addserv__drawer-num {
          font-family: 'Share Tech Mono', monospace;
          font-size: 0.6rem;
          color: #bbb;
          letter-spacing: 0.05em;
        }
        .fd-addserv__drawer-title {
          display: block;
          font-family: 'Space Grotesk', sans-serif;
          font-size: 0.8rem;
          font-weight: 700;
          text-transform: uppercase;
          color: #1a1a1a;
          letter-spacing: 0.02em;
          line-height: 1.3;
        }
        .fd-addserv__drawer-oneliner {
          display: block;
          font-family: 'Share Tech Mono', monospace;
          font-size: 0.55rem;
          color: #999;
          letter-spacing: 0.02em;
        }
        .fd-addserv__drawer-toggle {
          font-family: 'Space Grotesk', sans-serif;
          font-size: 1.2rem;
          font-weight: 300;
          color: #bbb;
          width: 28px;
          height: 28px;
          display: flex;
          align-items: center;
          justify-content: center;
          border: 1px solid #e8e6e2;
          border-radius: 3px;
          transition: all 0.3s;
          margin-top: 0.25rem;
        }
        .fd-addserv__drawer--open .fd-addserv__drawer-toggle {
          color: #1a1a1a;
          border-color: #1a1a1a;
        }

        /* Expanded panel — full width below row */
        .fd-addserv__drawer-panel {
          grid-column: 1 / -1;
          border: 1px solid #e8e6e2;
          border-radius: 4px;
          overflow: hidden;
        }
        .fd-addserv__panel-content {
          padding: 0 1.5rem 2rem 1.5rem;
          background: #f5f4f1;
          border-top: 1px solid #e8e6e2;
        }
        .fd-addserv__panel-desc {
          font-size: 0.85rem;
          color: #666;
          line-height: 1.7;
          max-width: 700px;
          padding-top: 2rem;
          margin-bottom: 2rem;
        }

        /* Panel grid for service cards */
        .fd-addserv__panel-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 1rem;
          margin-bottom: 2rem;
        }
        .fd-addserv__panel-grid--3 {
          grid-template-columns: repeat(3, 1fr);
        }
        .fd-addserv__panel-grid--training {
          grid-template-columns: 1fr 1fr;
        }
        .fd-addserv__panel-card {
          border: 1px solid #e8e6e2;
          padding: 1.5rem;
          border-radius: 4px;
          background: #fff;
          transition: border-color 0.2s, box-shadow 0.2s;
        }
        .fd-addserv__panel-card:hover {
          border-color: #ccc;
          box-shadow: 0 2px 12px rgba(0,0,0,0.04);
        }
        .fd-addserv__panel-card--featured {
          grid-column: 1 / -1;
          background: #faf9f6;
          border-color: #d0cdc8;
        }
        .fd-addserv__panel-card-icon {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 36px;
          height: 36px;
          border: 1px solid #e8e6e2;
          border-radius: 50%;
          margin-bottom: 1rem;
          color: #999;
          font-size: 0.9rem;
        }
        .fd-addserv__panel-card h4 {
          font-family: 'Space Grotesk', sans-serif;
          font-size: 0.8rem;
          font-weight: 700;
          text-transform: uppercase;
          color: #1a1a1a;
          letter-spacing: 0.02em;
          margin-bottom: 0.5rem;
        }
        .fd-addserv__panel-card p {
          font-size: 0.78rem;
          color: #777;
          line-height: 1.6;
          margin: 0;
        }
        .fd-addserv__panel-card-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 1rem;
        }
        .fd-addserv__panel-card-num {
          font-family: 'Share Tech Mono', monospace;
          font-size: 0.6rem;
          color: #bbb;
          letter-spacing: 0.05em;
        }
        .fd-addserv__panel-card-header i {
          font-size: 1rem;
          color: #bbb;
        }
        .fd-addserv__panel-card-tag {
          display: inline-block;
          font-family: 'Share Tech Mono', monospace;
          font-size: 0.5rem;
          text-transform: uppercase;
          letter-spacing: 0.1em;
          color: #999;
          border: 1px solid #e8e6e2;
          padding: 0.2rem 0.5rem;
          border-radius: 2px;
          margin-top: 1rem;
        }
        .fd-addserv__panel-card-badge {
          display: inline-block;
          font-family: 'Share Tech Mono', monospace;
          font-size: 0.5rem;
          text-transform: uppercase;
          letter-spacing: 0.12em;
          padding: 0.25rem 0.65rem;
          border: 1px solid #1a1a1a;
          color: #1a1a1a;
          border-radius: 2px;
          margin-bottom: 1.25rem;
        }
        .fd-addserv__panel-card-icon-wrap {
          font-size: 1.3rem;
          color: #999;
          margin-bottom: 0.75rem;
        }
        .fd-addserv__panel-card--featured .fd-addserv__panel-card-icon-wrap {
          color: #666;
        }
        .fd-addserv__panel-card-meta {
          display: flex;
          gap: 1.25rem;
          font-family: 'Share Tech Mono', monospace;
          font-size: 0.55rem;
          text-transform: uppercase;
          letter-spacing: 0.06em;
          color: #999;
          margin-top: 1rem;
        }
        .fd-addserv__panel-card-meta i { margin-right: 0.25rem; }

        /* Panel buttons */
        .fd-addserv__panel-btn {
          display: inline-flex;
          align-items: center;
          gap: 0.5rem;
          padding: 0.7rem 1.3rem;
          font-family: 'Space Grotesk', sans-serif;
          font-size: 0.65rem;
          font-weight: 600;
          text-transform: uppercase;
          letter-spacing: 0.06em;
          text-decoration: none;
          background: #1a1a1a;
          color: #faf9f6;
          border: 1px solid #1a1a1a;
          border-radius: 4px;
          transition: all 0.3s;
          cursor: pointer;
          margin-top: 0.5rem;
        }
        .fd-addserv__panel-btn:hover { background: #333; border-color: #333; }
        .fd-addserv__panel-btn--light {
          background: transparent;
          color: #1a1a1a;
          border-color: #ccc;
        }
        .fd-addserv__panel-btn--light:hover {
          background: rgba(0,0,0,0.04);
          border-color: #1a1a1a;
        }

        /* Panel quote */
        .fd-addserv__panel-quote {
          text-align: center;
          padding: 2rem;
          border: 1px solid #e8e6e2;
          border-radius: 4px;
          background: #fff;
          margin-bottom: 1.5rem;
        }
        .fd-addserv__panel-quote blockquote {
          font-family: 'Space Grotesk', sans-serif;
          font-size: 0.9rem;
          font-style: italic;
          color: #555;
          margin: 0 0 0.5rem 0;
        }
        .fd-addserv__panel-quote span {
          font-family: 'Share Tech Mono', monospace;
          font-size: 0.55rem;
          text-transform: uppercase;
          letter-spacing: 0.12em;
          color: #bbb;
        }

        /* Footer link */
        .fd-addserv__footer {
          text-align: center;
          margin-top: 2.5rem;
        }
        .fd-addserv__footer-link {
          font-family: 'Share Tech Mono', monospace;
          font-size: 0.6rem;
          text-transform: uppercase;
          letter-spacing: 0.15em;
          color: #999;
          text-decoration: none;
          transition: color 0.2s;
        }
        .fd-addserv__footer-link:hover { color: #1a1a1a; }
        .fd-addserv__footer-link span { margin-left: 0.4rem; }

        @media (max-width: 900px) {
          .fd-addserv__grid { grid-template-columns: 1fr; }
          .fd-addserv__panel-grid,
          .fd-addserv__panel-grid--3,
          .fd-addserv__panel-grid--training { grid-template-columns: 1fr; }
        }

        /* ================================================================
           LOCATION CARD
           ================================================================ */
        .fd-location {
          padding: 5rem 0;
          background: #f0eee9;
        }
        .fd-location__inner {
          max-width: 1200px;
          margin: 0 auto;
          padding: 0 2rem;
        }
        .fd-location__card {
          display: grid;
          grid-template-columns: 1fr 1fr;
          background: #fff;
          border: 1px solid #e8e6e2;
          border-radius: 4px;
          overflow: hidden;
          box-shadow: 0 4px 24px rgba(0,0,0,0.06);
        }
        .fd-location__map {
          min-height: 400px;
          background: #e8e6e2;
        }
        .fd-location__map iframe {
          display: block;
          width: 100%;
          height: 100%;
        }
        .fd-location__info {
          padding: 2.5rem;
          display: flex;
          flex-direction: column;
        }
        .fd-location__pre {
          display: block;
          font-family: 'Share Tech Mono', monospace;
          font-size: 0.55rem;
          text-transform: uppercase;
          letter-spacing: 0.3em;
          color: #999;
          margin-bottom: 0.75rem;
        }
        .fd-location__title {
          font-family: 'Space Grotesk', sans-serif;
          font-size: clamp(1.4rem, 2.5vw, 1.8rem);
          font-weight: 700;
          text-transform: uppercase;
          color: #1a1a1a;
          margin: 0 0 1rem 0;
          letter-spacing: -0.01em;
        }
        .fd-location__rule {
          width: 100%;
          height: 1px;
          background: #e8e6e2;
          margin-bottom: 1.5rem;
        }
        .fd-location__details {
          display: flex;
          flex-direction: column;
          gap: 1.25rem;
          margin-bottom: 1.5rem;
        }
        .fd-location__detail {
          display: flex;
          gap: 1rem;
          align-items: flex-start;
        }
        .fd-location__detail-icon {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 32px;
          height: 32px;
          border: 1px solid #e8e6e2;
          border-radius: 50%;
          color: #999;
          font-size: 0.75rem;
          flex-shrink: 0;
          margin-top: 2px;
        }
        .fd-location__detail-label {
          display: block;
          font-family: 'Share Tech Mono', monospace;
          font-size: 0.55rem;
          text-transform: uppercase;
          letter-spacing: 0.15em;
          color: #bbb;
          margin-bottom: 0.2rem;
        }
        .fd-location__detail-text {
          font-family: 'Space Grotesk', sans-serif;
          font-size: 0.82rem;
          color: #555;
          line-height: 1.5;
          margin: 0;
        }
        .fd-location__tags {
          display: flex;
          flex-wrap: wrap;
          gap: 0.5rem;
          margin-bottom: 1.5rem;
        }
        .fd-location__tag {
          font-family: 'Share Tech Mono', monospace;
          font-size: 0.5rem;
          text-transform: uppercase;
          letter-spacing: 0.1em;
          color: #999;
          border: 1px solid #e8e6e2;
          padding: 0.25rem 0.6rem;
          border-radius: 2px;
        }
        .fd-location__cta {
          display: inline-flex;
          align-items: center;
          gap: 0.5rem;
          padding: 0.7rem 1.3rem;
          font-family: 'Space Grotesk', sans-serif;
          font-size: 0.65rem;
          font-weight: 600;
          text-transform: uppercase;
          letter-spacing: 0.06em;
          text-decoration: none;
          background: #1a1a1a;
          color: #faf9f6;
          border: 1px solid #1a1a1a;
          border-radius: 4px;
          transition: all 0.3s;
          margin-top: auto;
          align-self: flex-start;
        }
        .fd-location__cta:hover { background: #333; border-color: #333; }
        @media (max-width: 768px) {
          .fd-location__card { grid-template-columns: 1fr; }
          .fd-location__map { min-height: 250px; }
        }

        /* ================================================================
           CLIENT REVIEWS / TESTIMONIALS
           ================================================================ */
        .fd-testimonials {
          background: #fff;
          padding: 3rem 0 2.5rem;
          overflow: hidden;
        }
        .fd-testimonials__top {
          max-width: 1200px;
          margin: 0 auto;
          padding: 0 2rem 1.5rem;
        }
        .fd-testimonials__heading {
          font-family: 'Space Grotesk', sans-serif;
          font-size: 1.3rem;
          font-weight: 700;
          text-transform: uppercase;
          line-height: 1.2;
          margin: 0 0 0.5rem;
          color: #1a1a1a;
        }
        .fd-testimonials__heading span {
          color: #999;
        }
        .fd-testimonials__sub {
          font-size: 0.78rem;
          color: #777;
          line-height: 1.6;
          max-width: 480px;
          margin: 0 0 0;
        }

        /* ── Marquee ─────────────────────────────── */
        .fd-testimonials__marquee {
          overflow: hidden;
          padding: 1rem 0;
          mask-image: linear-gradient(to right, transparent, black 3%, black 97%, transparent);
          -webkit-mask-image: linear-gradient(to right, transparent, black 3%, black 97%, transparent);
        }
        .fd-testimonials__track {
          display: flex;
          gap: 1rem;
          width: max-content;
          animation: fdTestimonialScroll 45s linear infinite;
        }
        .fd-testimonials__track:hover {
          animation-play-state: paused;
        }
        @keyframes fdTestimonialScroll {
          from { transform: translateX(0); }
          to { transform: translateX(-50%); }
        }

        /* ── Cards ───────────────────────────────── */
        .fd-testimonials__card {
          flex-shrink: 0;
          width: 320px;
          background: #faf9f6;
          border: 1px solid #e8e6e2;
          padding: 1.5rem;
          position: relative;
          transition: border-color 0.2s, transform 0.2s;
        }
        .fd-testimonials__card:hover {
          border-color: #aaa;
          transform: translateY(-2px);
        }
        .fd-testimonials__card-stars {
          display: flex;
          gap: 1px;
          color: #d4a853;
          font-size: 0.75rem;
          margin-bottom: 0.75rem;
        }
        .fd-testimonials__card-text {
          font-size: 0.78rem;
          line-height: 1.65;
          color: #444;
          margin-bottom: 1rem;
        }
        .fd-testimonials__card-author {
          display: flex;
          align-items: center;
          gap: 0.6rem;
        }
        .fd-testimonials__avatar--sm {
          width: 32px;
          height: 32px;
          border-radius: 50%;
          background: #1a1a1a;
          color: #fff;
          display: flex;
          align-items: center;
          justify-content: center;
          font-family: 'Share Tech Mono', monospace;
          font-size: 0.55rem;
          font-weight: 700;
          letter-spacing: 0.05em;
          flex-shrink: 0;
        }
        .fd-testimonials__card-author strong {
          display: block;
          font-family: 'Space Grotesk', sans-serif;
          font-size: 0.7rem;
          font-weight: 700;
        }
        .fd-testimonials__card-author span {
          font-family: 'Share Tech Mono', monospace;
          font-size: 0.5rem;
          color: #777;
          text-transform: uppercase;
          letter-spacing: 0.05em;
        }
        .fd-testimonials__card-cat {
          position: absolute;
          top: 0.75rem;
          right: 0.75rem;
          font-family: 'Share Tech Mono', monospace;
          font-size: 0.45rem;
          text-transform: uppercase;
          letter-spacing: 0.1em;
          color: #aaa;
          border: 1px solid #e8e6e2;
          padding: 0.15rem 0.4rem;
        }

        /* ── CTA row ─────────────────────────────── */
        .fd-testimonials__bottom {
          max-width: 1200px;
          margin: 0 auto;
          padding: 1.5rem 2rem 0;
        }
        .fd-testimonials__cta-row {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 1rem;
        }
        .fd-testimonials__cta-card {
          background: #faf9f6;
          border: 1px solid #e8e6e2;
          padding: 1.5rem;
        }
        .fd-testimonials__cta-card h4 {
          font-family: 'Space Grotesk', sans-serif;
          font-size: 0.85rem;
          font-weight: 700;
          text-transform: uppercase;
          margin-bottom: 0.5rem;
        }
        .fd-testimonials__cta-card p {
          font-size: 0.78rem;
          color: #555;
          line-height: 1.6;
          margin-bottom: 1rem;
        }
        .fd-testimonials__cta-card--google {
          background: #f8f8f8;
          border-color: #e0e0e0;
        }
        .fd-testimonials__google-stars {
          font-size: 1.1rem;
          color: #d4a853;
        }
        .fd-testimonials__google-stars em {
          font-family: 'Share Tech Mono', monospace;
          font-size: 0.65rem;
          color: #777;
          font-style: normal;
          margin-left: 0.5rem;
        }
        @media (max-width: 768px) {
          .fd-testimonials__cta-row { grid-template-columns: 1fr; }
          .fd-testimonials__card { width: 280px; }
        }

        /* ===== V30: Hero ===== */
        .hv30 { position: relative; height: 100vh; background: #faf9f6; overflow: hidden; }
        .hv30__layout { position: relative; z-index: 1; display: grid; grid-template-columns: 0.6fr 1fr; gap: 2rem; max-width: 1400px; margin: 0 auto; padding: 4rem 3rem; align-items: center; height: 100vh; }
        .hv30__left { position: relative; z-index: 2; }
        .hv30__brand-name { display: block; font-family: 'Space Grotesk', sans-serif; font-size: 3rem; font-weight: 700; line-height: 1; margin-bottom: 0; text-transform: uppercase; letter-spacing: -0.01em; -webkit-text-stroke: 2px #faf9f6; paint-order: stroke fill; }
        .hv30__brand-w1 { color: #1a1a1a; }
        .hv30__brand-w2 { color: #4a4a4a; }
        .hv30__brand-tag { display: inline-flex; align-items: center; font-family: 'Share Tech Mono', monospace; font-size: 0.85rem; letter-spacing: 0.15em; text-transform: uppercase; color: #888; -webkit-text-stroke: 1px #faf9f6; paint-order: stroke fill; }
        .hv30__right { position: absolute; inset: 0; z-index: 0; pointer-events: none; }
        .hv30__right::before { content: ''; position: absolute; inset: 0; z-index: 1; background: linear-gradient(to right, #faf9f6 0%, rgba(250,249,246,0.6) 15%, transparent 40%, transparent 60%, rgba(250,249,246,0.6) 85%, #faf9f6 100%); pointer-events: none; }
        .hv30__img-panel { position: absolute; inset: 0; border-radius: 0; overflow: hidden; border: none; }
        .hv30__img { position: absolute; inset: 0; background-size: cover; background-position: center; opacity: 0; transition: opacity 0.8s; }
        .hv30__img.active { opacity: 1; }
        .hv30__thumbs {
          display: flex; gap: 0.5rem; padding: 1.5rem 3rem; overflow-x: auto; scrollbar-width: none;
          position: absolute; bottom: 0; left: 0; right: 0; z-index: 2;
        }
        .hv30__thumbs::-webkit-scrollbar { display: none; }
        .hv30__thumb {
          flex: 0 0 auto; width: 100px; height: 65px; border-radius: 4px; overflow: hidden;
          border: 2px solid transparent; padding: 0; background: none; cursor: pointer; opacity: 0.5; transition: all 0.3s;
        }
        .hv30__thumb:hover { opacity: 0.85; }
        .hv30__thumb--active { opacity: 1; border-color: #1a1a1a; }
        .hv30__thumb img { width: 100%; height: 100%; object-fit: cover; display: block; }
      `}</style>
    </div>
  );
}

export default EndOfMarchVersion;

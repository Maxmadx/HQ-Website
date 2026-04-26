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
import PrecisionEngineering from '../components/AwesomeComponents/PrecisionEngineering';
import EditorialGrid from '../components/AwesomeComponents/EditorialGrid';
import { ScrollingStrips } from '../components';

// Blog Section
import BlogSection from '../components/BlogSection';

// Staggered Dropdown Trigger Component with scroll animations
function StaggeredDropdownTrigger({ isOpen, onClick, images, variation }) {
  const triggerRef = useRef(null);
  const isInView = useInView(triggerRef, { once: false, amount: 0.5 });
  const isGhost = variation?.ghostStyle;

  const { scrollYProgress } = useScroll({
    target: triggerRef,
    offset: ["start end", "end start"]
  });

  // Subtle gradient shift on scroll
  const gradientProgress = useTransform(scrollYProgress, [0, 0.5, 1], [0, 0.5, 1]);
  const springGradient = useSpring(gradientProgress, { stiffness: 100, damping: 30 });

  return (
    <motion.button
      ref={triggerRef}
      className={`fd-why-fly-dropdown__trigger fd-why-fly-dropdown__trigger--staggered ${isGhost ? 'fd-why-fly-dropdown__trigger--staggered-ghost' : ''} ${isOpen ? 'open' : ''}`}
      onClick={onClick}
      style={{
        background: isGhost
          ? 'transparent'
          : useTransform(springGradient, (v) =>
              `linear-gradient(${135 + v * 20}deg, #0a0a0a ${v * 10}%, #1a1a1a ${50 + v * 10}%, #0f0f0f 100%)`
            ),
      }}
    >
      {/* Full Width Image Strip */}
      <div className={`fd-why-fly-dropdown__staggered-images ${isGhost ? 'fd-why-fly-dropdown__staggered-images--ghost' : ''}`}>
        {images.map((src, idx) => (
          <motion.div
            key={idx}
            className={`fd-why-fly-dropdown__staggered-img ${isGhost ? 'fd-why-fly-dropdown__staggered-img--ghost' : ''}`}
            style={{ backgroundImage: `url(${src})` }}
            initial={{
              y: isGhost ? 0 : (idx % 2 === 0 ? -40 : 40),
              scale: isGhost ? 1 : 0.85,
              opacity: isGhost ? 0.15 : 0.5
            }}
            animate={{
              y: isInView ? 0 : (isGhost ? 0 : (idx % 2 === 0 ? -40 : 40)),
              scale: isInView ? 1 : (isGhost ? 1 : 0.85),
              opacity: isInView ? (isGhost ? 0.25 : 0.75) : (isGhost ? 0.15 : 0.5)
            }}
            transition={{
              duration: isGhost ? 0.6 : 1,
              delay: isGhost ? 0 : idx * 0.08,
              ease: 'easeOut'
            }}
          />
        ))}
      </div>

      {/* Centered Text */}
      <div className={`fd-why-fly-dropdown__staggered-content ${isGhost ? 'fd-why-fly-dropdown__staggered-content--ghost' : ''}`}>
        <motion.span
          className={`fd-why-fly-dropdown__staggered-title ${isGhost ? 'fd-why-fly-dropdown__staggered-title--ghost' : ''}`}
          initial={{ opacity: isGhost ? 0.8 : 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3 }}
        >
          Why We Fly Helicopters?
        </motion.span>
        <motion.span
          className={`fd-why-fly-dropdown__staggered-hint ${isGhost ? 'fd-why-fly-dropdown__staggered-hint--ghost' : ''}`}
          initial={{ opacity: 0 }}
          animate={{ opacity: isInView ? 1 : 0 }}
          transition={{ duration: 0.4, delay: 0.5 }}
        >
          {isGhost ? 'click to find out' : 'Click to Discover'}
        </motion.span>
      </div>

      {/* Chevron */}
      <motion.div
        className={`fd-why-fly-dropdown__staggered-chevron ${isGhost ? 'fd-why-fly-dropdown__staggered-chevron--ghost' : ''}`}
        initial={{ opacity: isGhost ? 0.6 : 0 }}
        animate={{ opacity: isGhost ? 0.8 : (isInView ? 1 : 0) }}
        transition={{ duration: 0.3 }}
      >
        <svg
          className={`fd-why-fly-dropdown__chevron ${isOpen ? 'open' : ''}`}
          width={isGhost ? '16' : '24'}
          height={isGhost ? '16' : '24'}
          viewBox="0 0 24 24"
          fill="none"
          stroke={isGhost ? '#999' : '#fff'}
          strokeWidth={isGhost ? '1.5' : '2'}
        >
          <path d="M6 9l6 6 6-6" />
        </svg>
      </motion.div>
    </motion.button>
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

function FinalDraft() {
  const [scrollProgress, setScrollProgress] = useState(0);
  const [activeSection, setActiveSection] = useState(0);
  const [imagesExpanded, setImagesExpanded] = useState(false);
  const [linesVisible, setLinesVisible] = useState(false);
  const [activeNavSection, setActiveNavSection] = useState(null);
  const [navCompact, setNavCompact] = useState(false);
  const [navFixed, setNavFixed] = useState(false);
  const [scrollPromptHidden, setScrollPromptHidden] = useState(false);
  const [heroCollapsed, setHeroCollapsed] = useState(false);
  const [aboutLabelStatic, setAboutLabelStatic] = useState(false);
  const [trainingSlide, setTrainingSlide] = useState(2); // Start on Commercial
  const [whyFlyOpen, setWhyFlyOpen] = useState(false);
  const [whyFlySlide, setWhyFlySlide] = useState(0);
  const [whyFlyVariation, setWhyFlyVariation] = useState(18); // Film Strip (v19)
  const [visibleImages, setVisibleImages] = useState(8);
  const whyFlyTriggerRef = useRef(null);

  // Dynamic image count based on available space
  useEffect(() => {
    const MIN_IMAGE_WIDTH = 55;
    const GAP = 8;
    const CENTER_WIDTH = 250;

    const calculateVisibleImages = () => {
      const trigger = whyFlyTriggerRef.current;
      if (!trigger) return;

      const triggerWidth = trigger.getBoundingClientRect().width;
      const availablePerSide = (triggerWidth - CENTER_WIDTH) / 2;
      const maxImages = Math.floor(availablePerSide / (MIN_IMAGE_WIDTH + GAP));
      const clamped = Math.max(0, Math.min(8, maxImages));

      setVisibleImages(clamped);
    };

    // Run on mount and resize
    calculateVisibleImages();
    window.addEventListener('resize', calculateVisibleImages);

    // Also use ResizeObserver for more accurate tracking
    let observer;
    if (whyFlyTriggerRef.current) {
      observer = new ResizeObserver(calculateVisibleImages);
      observer.observe(whyFlyTriggerRef.current);
    }

    return () => {
      window.removeEventListener('resize', calculateVisibleImages);
      if (observer) observer.disconnect();
    };
  }, []);

  // 20 variations of the collapsed dropdown - different layouts, styles, and arrangements
  const whyFlyVariations = [
    {
      id: 1,
      name: 'Classic Centered',
      bg: 'linear-gradient(135deg, #1a3a52 0%, #2a4a62 100%)',
      layout: 'centered',
      showLeftImages: true,
      showRightImages: true,
      titleSize: '0.9rem',
      padding: '2rem 2.5rem',
      imageStyle: 'portrait',
      borderStyle: 'none'
    },
    {
      id: 2,
      name: 'Left Heavy',
      bg: 'linear-gradient(90deg, #0c2340 0%, #1a4a6e 100%)',
      layout: 'left',
      showLeftImages: true,
      showRightImages: false,
      titleSize: '1.1rem',
      padding: '2.5rem 3rem',
      imageStyle: 'portrait',
      borderStyle: 'none'
    },
    {
      id: 3,
      name: 'Right Heavy',
      bg: 'linear-gradient(270deg, #2c3e50 0%, #1a252f 100%)',
      layout: 'right',
      showLeftImages: false,
      showRightImages: true,
      titleSize: '1.1rem',
      padding: '2.5rem 3rem',
      imageStyle: 'portrait',
      borderStyle: 'none'
    },
    {
      id: 4,
      name: 'Minimal Dark',
      bg: 'linear-gradient(135deg, #0a0a0a 0%, #1a1a1a 100%)',
      layout: 'centered',
      showLeftImages: false,
      showRightImages: false,
      titleSize: '1.2rem',
      padding: '3rem 2rem',
      imageStyle: 'none',
      borderStyle: 'top-bottom'
    },
    {
      id: 5,
      name: 'Wide Landscape',
      bg: 'linear-gradient(135deg, #1e3a5f 0%, #2d5a80 100%)',
      layout: 'centered',
      showLeftImages: true,
      showRightImages: true,
      titleSize: '0.85rem',
      padding: '1.5rem 2rem',
      imageStyle: 'landscape',
      borderStyle: 'none'
    },
    {
      id: 6,
      name: 'Tall Impact',
      bg: 'linear-gradient(180deg, #134e5e 0%, #1a6b7c 100%)',
      layout: 'centered',
      showLeftImages: true,
      showRightImages: true,
      titleSize: '1rem',
      padding: '3rem 2rem',
      imageStyle: 'square',
      borderStyle: 'none'
    },
    {
      id: 7,
      name: 'Compact Strip',
      bg: 'linear-gradient(90deg, #2c3e50 0%, #3d5a73 100%)',
      layout: 'centered',
      showLeftImages: true,
      showRightImages: true,
      titleSize: '0.75rem',
      padding: '1rem 2rem',
      imageStyle: 'strip',
      borderStyle: 'none'
    },
    {
      id: 8,
      name: 'Editorial Left',
      bg: '#1a1a1a',
      layout: 'editorial-left',
      showLeftImages: true,
      showRightImages: false,
      titleSize: '1.3rem',
      padding: '2rem 3rem',
      imageStyle: 'large',
      borderStyle: 'accent-left'
    },
    {
      id: 9,
      name: 'Editorial Right',
      bg: '#1a1a1a',
      layout: 'editorial-right',
      showLeftImages: false,
      showRightImages: true,
      titleSize: '1.3rem',
      padding: '2rem 3rem',
      imageStyle: 'large',
      borderStyle: 'accent-right'
    },
    {
      id: 10,
      name: 'Bordered Light',
      bg: '#faf9f6',
      layout: 'centered',
      showLeftImages: true,
      showRightImages: true,
      titleSize: '0.9rem',
      titleColor: '#1a1a1a',
      padding: '2rem 2.5rem',
      imageStyle: 'portrait',
      borderStyle: 'full'
    },
    {
      id: 11,
      name: 'Split Duo',
      bg: 'linear-gradient(90deg, #1a3a52 50%, #2d5a6e 50%)',
      layout: 'split',
      showLeftImages: true,
      showRightImages: true,
      titleSize: '1rem',
      padding: '2rem 2rem',
      imageStyle: 'portrait',
      borderStyle: 'none'
    },
    {
      id: 12,
      name: 'Overlay Images',
      bg: 'linear-gradient(135deg, #0c2340 0%, #1a3a52 100%)',
      layout: 'overlay',
      showLeftImages: true,
      showRightImages: true,
      titleSize: '1.1rem',
      padding: '2.5rem 2rem',
      imageStyle: 'overlay',
      borderStyle: 'none'
    },
    {
      id: 13,
      name: 'Mono Elegant',
      bg: '#2d2d2d',
      layout: 'centered',
      showLeftImages: false,
      showRightImages: false,
      titleSize: '1.4rem',
      padding: '3.5rem 2rem',
      imageStyle: 'none',
      borderStyle: 'thin-top',
      fontStyle: 'serif'
    },
    {
      id: 14,
      name: 'Technical',
      bg: 'linear-gradient(135deg, #1a2a3a 0%, #2a3a4a 100%)',
      layout: 'technical',
      showLeftImages: true,
      showRightImages: true,
      titleSize: '0.8rem',
      padding: '1.5rem 2rem',
      imageStyle: 'small',
      borderStyle: 'dashed',
      fontStyle: 'mono'
    },
    {
      id: 15,
      name: 'Bold Statement',
      bg: 'linear-gradient(135deg, #003153 0%, #1a4a6e 100%)',
      layout: 'centered',
      showLeftImages: false,
      showRightImages: false,
      titleSize: '1.8rem',
      padding: '4rem 2rem',
      imageStyle: 'none',
      borderStyle: 'none',
      fontStyle: 'bold'
    },
    {
      id: 16,
      name: 'Card Stack Left',
      bg: '#1f1f1f',
      layout: 'cards-left',
      showLeftImages: true,
      showRightImages: false,
      titleSize: '1rem',
      padding: '2rem 2.5rem',
      imageStyle: 'cards',
      borderStyle: 'none'
    },
    {
      id: 17,
      name: 'Card Stack Right',
      bg: '#1f1f1f',
      layout: 'cards-right',
      showLeftImages: false,
      showRightImages: true,
      titleSize: '1rem',
      padding: '2rem 2.5rem',
      imageStyle: 'cards',
      borderStyle: 'none'
    },
    {
      id: 18,
      name: 'Asymmetric',
      bg: 'linear-gradient(120deg, #1a1a2e 0%, #2d3a4a 60%, #1a2a3a 100%)',
      layout: 'asymmetric',
      showLeftImages: true,
      showRightImages: true,
      titleSize: '1rem',
      padding: '2rem 2rem',
      imageStyle: 'mixed',
      borderStyle: 'none'
    },
    {
      id: 19,
      name: 'Film Strip',
      bg: '#0a0a0a',
      layout: 'filmstrip',
      showLeftImages: true,
      showRightImages: true,
      titleSize: '0.9rem',
      padding: '1.75rem 2rem',
      imageStyle: 'filmstrip',
      borderStyle: 'none'
    },
    {
      id: 20,
      name: 'Luxury Gold',
      bg: 'linear-gradient(135deg, #1a1a1a 0%, #2a2a2a 100%)',
      layout: 'centered',
      showLeftImages: true,
      showRightImages: true,
      titleSize: '1rem',
      padding: '2.5rem 3rem',
      imageStyle: 'framed',
      borderStyle: 'gold',
      accentColor: '#c9a227'
    },
    {
      id: 21,
      name: 'Ghost Flow',
      bg: 'transparent',
      layout: 'fullwidth-staggered',
      showLeftImages: false,
      showRightImages: false,
      showFullWidthImages: true,
      titleSize: '0.8rem',
      titleColor: '#333',
      padding: '0',
      imageStyle: 'minimal',
      borderStyle: 'none',
      ghostStyle: true
    },
    // ===== COMPACT VARIATIONS (22-40) =====
    {
      id: 22,
      name: 'Compact Dark',
      bg: '#0a0a0a',
      layout: 'compact',
      showLeftImages: false,
      showRightImages: false,
      titleSize: '0.75rem',
      padding: '0.75rem 1.5rem',
      borderStyle: 'none'
    },
    {
      id: 23,
      name: 'Compact Light',
      bg: '#f5f5f5',
      layout: 'compact',
      showLeftImages: false,
      showRightImages: false,
      titleSize: '0.75rem',
      titleColor: '#1a1a1a',
      padding: '0.75rem 1.5rem',
      borderStyle: 'thin-bottom'
    },
    {
      id: 24,
      name: 'Slim Navy',
      bg: '#1a3a52',
      layout: 'compact',
      showLeftImages: false,
      showRightImages: false,
      titleSize: '0.7rem',
      padding: '0.6rem 1.5rem',
      borderStyle: 'none'
    },
    {
      id: 25,
      name: 'Pill Dark',
      bg: '#1a1a1a',
      layout: 'compact-pill',
      showLeftImages: false,
      showRightImages: false,
      titleSize: '0.7rem',
      padding: '0.5rem 2rem',
      borderStyle: 'none'
    },
    {
      id: 26,
      name: 'Pill Light',
      bg: '#ffffff',
      layout: 'compact-pill',
      showLeftImages: false,
      showRightImages: false,
      titleSize: '0.7rem',
      titleColor: '#1a1a1a',
      padding: '0.5rem 2rem',
      borderStyle: 'outline'
    },
    {
      id: 27,
      name: 'Underline',
      bg: 'transparent',
      layout: 'compact-underline',
      showLeftImages: false,
      showRightImages: false,
      titleSize: '0.8rem',
      titleColor: '#1a1a1a',
      padding: '0.75rem 0',
      borderStyle: 'underline'
    },
    {
      id: 28,
      name: 'Tag Dark',
      bg: '#2d2d2d',
      layout: 'compact-tag',
      showLeftImages: false,
      showRightImages: false,
      titleSize: '0.65rem',
      padding: '0.4rem 1rem',
      borderStyle: 'none'
    },
    {
      id: 29,
      name: 'Tag Outline',
      bg: 'transparent',
      layout: 'compact-tag',
      showLeftImages: false,
      showRightImages: false,
      titleSize: '0.65rem',
      titleColor: '#1a1a1a',
      padding: '0.4rem 1rem',
      borderStyle: 'outline-dark'
    },
    {
      id: 30,
      name: 'Bar Minimal',
      bg: '#faf9f6',
      layout: 'compact-bar',
      showLeftImages: false,
      showRightImages: false,
      titleSize: '0.7rem',
      titleColor: '#666',
      padding: '0.6rem 1.5rem',
      borderStyle: 'top-line'
    },
    {
      id: 31,
      name: 'Bar Dark',
      bg: '#1a1a1a',
      layout: 'compact-bar',
      showLeftImages: false,
      showRightImages: false,
      titleSize: '0.7rem',
      padding: '0.6rem 1.5rem',
      borderStyle: 'none'
    },
    {
      id: 32,
      name: 'Link Style',
      bg: 'transparent',
      layout: 'compact-link',
      showLeftImages: false,
      showRightImages: false,
      titleSize: '0.8rem',
      titleColor: '#1a3a52',
      padding: '0.5rem 0',
      borderStyle: 'none',
      fontStyle: 'underline'
    },
    {
      id: 33,
      name: 'Mono Compact',
      bg: '#1a1a1a',
      layout: 'compact',
      showLeftImages: false,
      showRightImages: false,
      titleSize: '0.65rem',
      padding: '0.6rem 1.5rem',
      borderStyle: 'none',
      fontStyle: 'mono'
    },
    {
      id: 34,
      name: 'Accent Left',
      bg: '#faf9f6',
      layout: 'compact-accent',
      showLeftImages: false,
      showRightImages: false,
      titleSize: '0.75rem',
      titleColor: '#1a1a1a',
      padding: '0.75rem 1.5rem',
      borderStyle: 'accent-left-thin',
      accentColor: '#1a3a52'
    },
    {
      id: 35,
      name: 'Dot Indicator',
      bg: '#1a1a1a',
      layout: 'compact-dot',
      showLeftImages: false,
      showRightImages: false,
      titleSize: '0.7rem',
      padding: '0.6rem 1.5rem',
      borderStyle: 'none',
      accentColor: '#4ade80'
    },
    {
      id: 36,
      name: 'Chevron Only',
      bg: 'transparent',
      layout: 'compact-chevron',
      showLeftImages: false,
      showRightImages: false,
      titleSize: '0.75rem',
      titleColor: '#1a1a1a',
      padding: '0.5rem 1rem',
      borderStyle: 'none'
    },
    {
      id: 37,
      name: 'Split Tone',
      bg: 'linear-gradient(90deg, #1a1a1a 50%, #2d2d2d 50%)',
      layout: 'compact',
      showLeftImages: false,
      showRightImages: false,
      titleSize: '0.7rem',
      padding: '0.6rem 1.5rem',
      borderStyle: 'none'
    },
    {
      id: 38,
      name: 'Filled Rounded',
      bg: '#1a3a52',
      layout: 'compact-rounded',
      showLeftImages: false,
      showRightImages: false,
      titleSize: '0.7rem',
      padding: '0.6rem 1.75rem',
      borderStyle: 'none'
    },
    {
      id: 39,
      name: 'Outline Rounded',
      bg: 'transparent',
      layout: 'compact-rounded',
      showLeftImages: false,
      showRightImages: false,
      titleSize: '0.7rem',
      titleColor: '#1a3a52',
      padding: '0.6rem 1.75rem',
      borderStyle: 'outline-navy'
    },
    {
      id: 40,
      name: 'Inline Text',
      bg: 'transparent',
      layout: 'compact-inline',
      showLeftImages: false,
      showRightImages: false,
      titleSize: '0.85rem',
      titleColor: '#1a1a1a',
      padding: '0.5rem 0',
      borderStyle: 'none',
      fontStyle: 'inline'
    },
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
  const videoLinesInView = useInView(videoLinesRef, { once: true, amount: 0.5, margin: "0px 0px -200px 0px" });

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
    { id: 'contact', label: 'Contact', icon: '06' },
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

          <p className="fd-about__text">
            Founded in 2010 at Denham Aerodrome, HQ Aviation has grown to become
            the UK's leading Robinson helicopter specialists. Our commitment to
            excellence in training, sales, and maintenance has earned us the trust
            of pilots worldwide.
          </p>

          <Link to="/about" className="fd-about__btn" ref={aboutBtnRef}>
            Learn More
            <span>→</span>
          </Link>
        </div>
      </section>

      {/* ===== WHY FLY A HELICOPTER ===== */}
      <div className="fd-why-fly-dropdown">
        {!whyFlyOpen && (
        <button
          ref={whyFlyTriggerRef}
          className={`fd-why-fly-dropdown__trigger fd-why-fly-dropdown__trigger--filmstrip-v19`}
          onClick={() => setWhyFlyOpen(true)}
        >
          <div className="fd-why-fly-dropdown__trigger-thumbs fd-why-fly-dropdown__trigger-thumbs--left">
            {[
              '/assets/images/expeditions/helicopter-expeditions-quentin-smith.webp',
              '/assets/images/expeditions/north-pole.jpg',
              '/assets/images/facility/hq-0089.jpg',
              '/assets/images/expeditions/antartica.jpg',
              '/assets/images/expeditions/channel.jpg',
              '/assets/images/facility/hq-0035.jpg',
              '/assets/images/expeditions/six-helis-in-North-Pole.jpg',
              '/assets/images/facility/busy-hangar.jpg'
            ].slice(0, visibleImages).map((src, idx) => (
              <div
                key={idx}
                className="fd-why-fly-dropdown__thumb"
                style={{ backgroundImage: `url(${src})` }}
              />
            ))}
          </div>
          <div className="fd-why-fly-dropdown__trigger-center">
            <span className="fd-why-fly-dropdown__title">
              Why We Fly Helicopters?
            </span>
            <div className="fd-why-fly-dropdown__click-hint">
              <span className="fd-why-fly-dropdown__click-text">click here</span>
              <span className="fd-why-fly-dropdown__pulse-dot"></span>
            </div>
          </div>
          <div className="fd-why-fly-dropdown__trigger-thumbs fd-why-fly-dropdown__trigger-thumbs--right">
            {[
              '/assets/images/facility/hq-0035.jpg',
              '/assets/images/expeditions/south-pole-by-helicopter-quentin-smith.webp',
              '/assets/images/gallery/carousel/rotating-4.jpg',
              '/assets/images/facility/hq-0053.jpg',
              '/assets/images/facility/hq-0007.jpg',
              '/assets/images/facility/hq-0129.jpg',
              '/assets/images/facility/hq-0075.jpg',
              '/assets/images/lifestyle/q-dubai.jpg'
            ].slice(0, visibleImages).map((src, idx) => (
              <div
                key={idx}
                className="fd-why-fly-dropdown__thumb"
                style={{ backgroundImage: `url(${src})` }}
              />
            ))}
          </div>
        </button>
        )}

        {whyFlyOpen && (
          <div className="fd-why-fly-dropdown__card">
            <button className="fd-why-fly-dropdown__close" onClick={() => setWhyFlyOpen(false)} aria-label="Close">
              ✕
            </button>
            <div className="fd-why-fly-dropdown__body">
              <div className="fd-why-fly-dropdown__text">
                <h3>
                  <span style={{ color: '#1a1a1a' }}>
                    {['Join', 'Save', 'Land', 'Gain', 'Create', 'Experience', 'Access', 'Achieve', 'Build', 'Break', 'Protect', 'Fly', 'Explore', 'Build'][whyFlySlide]}
                  </span>{' '}
                  <span style={{ color: '#5a5a5a' }}>
                    {['a Community', 'Precious Time', 'Anywhere', 'Business Edge', 'Family Memories', 'True Freedom', 'VIP Moments', 'Your Dreams', 'Your Network', 'Free from Traffic', 'Your Investment', 'All Year', 'The World', 'Your Legacy'][whyFlySlide]}
                  </span>
                </h3>
                <p>
                  {[
                    'A community of adventurers, business people, positive and successful people who share your passion for aviation.',
                    'What takes hours by car takes minutes by helicopter. Reclaim your most valuable asset - time.',
                    'No runways needed. Land at private estates, yachts, remote locations, and city centres.',
                    'Arrive fresh, prepared, and on time. Make multiple meetings across the country in a single day.',
                    'Create unforgettable experiences with loved ones. Weekend trips become extraordinary adventures.',
                    'Go where you want, when you want. The ultimate expression of personal freedom and independence.',
                    'Private helipads at exclusive venues, VIP access to events, and experiences unavailable to others.',
                    'Join an elite group who have mastered one of aviation\'s most challenging and rewarding skills.',
                    'Connect with fellow pilots, business leaders, and adventurers at exclusive flying events.',
                    'Rise above congestion and constraints. Your journey becomes part of the adventure.',
                    'Helicopters hold value well. A quality aircraft is both a lifestyle asset and sound investment.',
                    'Unlike fixed-wing, helicopters operate from almost anywhere in nearly any weather conditions.',
                    'From Alpine peaks to Mediterranean coasts, the helicopter opens a world of expedition possibilities.',
                    'Pass on the gift of flight. Many pilots share this passion across generations.'
                  ][whyFlySlide]}
                </p>
              </div>
              <div className="fd-why-fly-dropdown__image">
                {[
                  '/assets/images/expeditions/helicopter-expeditions-quentin-smith.webp',
                  '/assets/images/facility/hq-0035.jpg',
                  '/assets/images/expeditions/channel.jpg',
                  '/assets/images/facility/hq-0089.jpg',
                  '/assets/images/expeditions/north-pole.jpg',
                  '/assets/images/expeditions/antartica.jpg',
                  '/assets/images/facility/busy-hangar.jpg',
                  '/assets/images/facility/hq-0053.jpg',
                  '/assets/images/facility/hq-0075.jpg',
                  '/assets/images/expeditions/south-pole-by-helicopter-quentin-smith.webp',
                  '/assets/images/facility/hq-0129.jpg',
                  '/assets/images/expeditions/six-helis-in-North-Pole.jpg',
                  '/assets/images/facility/hq-0167.jpg',
                  '/assets/images/facility/hq-0209.jpg'
                ].map((src, idx) => (
                  <div
                    key={idx}
                    className={`fd-why-fly-dropdown__image-slide ${idx === whyFlySlide ? 'active' : ''}`}
                    style={{ backgroundImage: `url(${src})` }}
                  />
                ))}
                <div className="fd-why-fly-dropdown__image-label">Lifestyle</div>
              </div>
            </div>

            <div className="fd-why-fly-dropdown__footer">
              <div className="fd-why-fly-dropdown__footer-left">
                <div className="fd-why-fly-dropdown__dots">
                  {Array.from({ length: 14 }).map((_, idx) => (
                    <div
                      key={idx}
                      className={`fd-why-fly-dropdown__dot ${idx === whyFlySlide ? 'active' : ''}`}
                      onClick={() => setWhyFlySlide(idx)}
                    />
                  ))}
                </div>
                <div className="fd-why-fly-dropdown__counter">
                  {String(whyFlySlide + 1).padStart(2, '0')} / 14
                </div>
              </div>
              <div className="fd-why-fly-dropdown__arrows">
                <button
                  className="fd-why-fly-dropdown__arrow"
                  onClick={() => setWhyFlySlide(prev => prev === 0 ? 13 : prev - 1)}
                  aria-label="Previous benefit"
                >
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                    <path d="M15 18l-6-6 6-6" />
                  </svg>
                </button>
                <button
                  className="fd-why-fly-dropdown__arrow"
                  onClick={() => setWhyFlySlide(prev => prev === 13 ? 0 : prev + 1)}
                  aria-label="Next benefit"
                >
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                    <path d="M9 18l6-6-6-6" />
                  </svg>
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

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
        <div className="parallax-section__number-row">
          <span className="parallax-section__line"></span>
          <span className="parallax-section__number">01</span>
          <span className="parallax-section__line"></span>
        </div>
        <span className="parallax-section__label">Learn to Fly</span>
        <h2 className="parallax-section__title">flying</h2>
      </ParallaxSection>

      {/* ===== CONTENT SECTIONS ===== */}
      <div className="fd-training-wrapper">
        <section className="fd-section fd-section--with-carousel reveal-element" id="training">
          {/* ===== TRAINING HEADER ===== */}
          <div className="fd-training-header">
            <div className="fd-training-header__divider"></div>
            <h2 className="fd-training-header__title">Explore Our Courses</h2>
            <p className="fd-training-header__text">
              From your first discovery flight to advanced commercial ratings,
              our experienced instructors guide you every step of the way.
            </p>
          </div>

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
          <div className="fd-section-divider"></div>
          <h2 className="fd-carousel-title">Explore our courses</h2>
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

      {/* ===== PARALLAX: FLEET ===== */}
      <ParallaxSection
        image="/assets/images/facility/hq-aviation-robinsons.jpg"
        alt="Our Fleet"
        className="reveal-element"
        waves={true}
      >
        <div className="parallax-section__number-row">
          <span className="parallax-section__line"></span>
          <span className="parallax-section__number">02</span>
          <span className="parallax-section__line"></span>
        </div>
        <span className="parallax-section__label">Escape The Ordinary</span>
        <h2 className="parallax-section__title">Self-Fly Hire</h2>
      </ParallaxSection>

      {/* ===== IMMERSIVE FLEET SECTION ===== */}
      <section className="fd-fleet reveal-element" id="fleet">
        {/* Hero Statement */}
        <div className="fd-fleet__intro">
          <span className="fd-fleet__number">02</span>
          <h2 className="fd-fleet__title">
            <span className="fd-fleet__title-line fd-fleet__title-line--1">Your Time</span>
            <span className="fd-fleet__title-line fd-fleet__title-line--2">Is Precious</span>
          </h2>
          <p className="fd-fleet__tagline">
            Skip the traffic. Avoid the queues. Arrive in style.
          </p>
        </div>

        {/* Time Comparison Grid - The Hero Feature */}
        <div className="fd-fleet__time-grid">
          <div className="fd-fleet__time-header">
            <span className="fd-fleet__time-label">Journey Time Comparison</span>
            <div className="fd-fleet__time-legend">
              <span className="fd-fleet__legend-item fd-fleet__legend-item--car">
                <span className="fd-fleet__legend-icon">🚗</span> By Car
              </span>
              <span className="fd-fleet__legend-divider">/</span>
              <span className="fd-fleet__legend-item fd-fleet__legend-item--heli">
                <img src="/assets/images/icons/r66-icon-transparent going right.svg" alt="" className="fd-fleet__legend-icon fd-fleet__legend-icon--heli" />
                By Helicopter
              </span>
            </div>
          </div>

          <div className="fd-fleet__destinations">
            {/* Cotswolds */}
            <div className="fd-fleet__dest-card">
              <div className="fd-fleet__dest-image">
                <img src="/assets/images/destinations/cotswolds-aerial.jpg" alt="Cotswolds" />
                <div className="fd-fleet__dest-overlay"></div>
                <div className="fd-fleet__dest-time-badge">
                  <span className="fd-fleet__dest-time-value">35 min</span>
                </div>
              </div>
              <div className="fd-fleet__dest-label">
                <span className="fd-fleet__dest-name">The Cotswolds</span>
              </div>
            </div>

            {/* Le Touquet */}
            <div className="fd-fleet__dest-card">
              <div className="fd-fleet__dest-image">
                <img src="/assets/images/destinations/le-touquet.jpg" alt="Le Touquet" />
                <div className="fd-fleet__dest-overlay"></div>
                <div className="fd-fleet__dest-time-badge">
                  <span className="fd-fleet__dest-time-value">55 min</span>
                </div>
              </div>
              <div className="fd-fleet__dest-label">
                <span className="fd-fleet__dest-name">Le Touquet</span>
              </div>
            </div>

            {/* Scottish Highlands */}
            <div className="fd-fleet__dest-card">
              <div className="fd-fleet__dest-image">
                <img src="/assets/images/destinations/scottish-highlands.jpg" alt="Scottish Highlands" />
                <div className="fd-fleet__dest-overlay"></div>
                <div className="fd-fleet__dest-time-badge">
                  <span className="fd-fleet__dest-time-value">2h 45min</span>
                </div>
              </div>
              <div className="fd-fleet__dest-label">
                <span className="fd-fleet__dest-name">Scottish Highlands</span>
              </div>
            </div>

            {/* Cornwall */}
            <div className="fd-fleet__dest-card">
              <div className="fd-fleet__dest-image">
                <img src="/assets/images/destinations/cornwall.jpg" alt="Cornwall" />
                <div className="fd-fleet__dest-overlay"></div>
                <div className="fd-fleet__dest-time-badge">
                  <span className="fd-fleet__dest-time-value">1h 30min</span>
                </div>
              </div>
              <div className="fd-fleet__dest-label">
                <span className="fd-fleet__dest-name">Cornwall</span>
              </div>
            </div>
          </div>
        </div>

        {/* Benefits Strip */}
        <div className="fd-fleet__benefits">
          <div className="fd-fleet__benefit">
            <span className="fd-fleet__benefit-icon">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <circle cx="12" cy="12" r="10"/>
                <path d="M12 6v6l4 2"/>
              </svg>
            </span>
            <span className="fd-fleet__benefit-stat">30+</span>
            <span className="fd-fleet__benefit-label">Aircraft Available</span>
          </div>
          <div className="fd-fleet__benefit-divider"></div>
          <div className="fd-fleet__benefit">
            <span className="fd-fleet__benefit-icon">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/>
                <line x1="16" y1="2" x2="16" y2="6"/>
                <line x1="8" y1="2" x2="8" y2="6"/>
                <line x1="3" y1="10" x2="21" y2="10"/>
              </svg>
            </span>
            <span className="fd-fleet__benefit-stat">7 Days</span>
            <span className="fd-fleet__benefit-label">A Week Availability</span>
          </div>
          <div className="fd-fleet__benefit-divider"></div>
          <div className="fd-fleet__benefit">
            <span className="fd-fleet__benefit-icon">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/>
                <polyline points="22 4 12 14.01 9 11.01"/>
              </svg>
            </span>
            <span className="fd-fleet__benefit-stat">2,000+</span>
            <span className="fd-fleet__benefit-label">Destinations Reachable</span>
          </div>
        </div>

        {/* Fleet Showcase */}
        <div className="fd-fleet__aircraft">
          <span className="fd-fleet__aircraft-label">Our Fleet</span>
          <div className="fd-fleet__aircraft-grid">
            <Link to="/fleet/r22" className="fd-fleet__aircraft-card">
              <div className="fd-fleet__aircraft-image">
                <img src="/assets/images/new-aircraft/r22/r22-red-volcano-front-alpha-v3.png" alt="R22" />
              </div>
              <div className="fd-fleet__aircraft-info">
                <h4>R22</h4>
                <span className="fd-fleet__aircraft-seats">2 Seats</span>
                <span className="fd-fleet__aircraft-rate">From £275/hr</span>
              </div>
            </Link>
            <Link to="/fleet/r44" className="fd-fleet__aircraft-card fd-fleet__aircraft-card--featured">
              <div className="fd-fleet__aircraft-badge">Most Popular</div>
              <div className="fd-fleet__aircraft-image">
                <img src="/assets/images/new-aircraft/r44/raven-ii-front-alpha.png" alt="R44" />
              </div>
              <div className="fd-fleet__aircraft-info">
                <h4>R44</h4>
                <span className="fd-fleet__aircraft-seats">4 Seats</span>
                <span className="fd-fleet__aircraft-rate">From £395/hr</span>
              </div>
            </Link>
            <Link to="/fleet/r66" className="fd-fleet__aircraft-card">
              <div className="fd-fleet__aircraft-image">
                <img src="/assets/images/new-aircraft/r66/blue-r66-palo-verde-left-v4.png" alt="R66" />
              </div>
              <div className="fd-fleet__aircraft-info">
                <h4>R66 Turbine</h4>
                <span className="fd-fleet__aircraft-seats">5 Seats</span>
                <span className="fd-fleet__aircraft-rate">From £595/hr</span>
              </div>
            </Link>
          </div>
        </div>

        {/* Lifestyle Quote */}
        <div className="fd-fleet__lifestyle">
          <blockquote className="fd-fleet__quote">
            "The helicopter isn't just transport—it's a lifestyle. Land at the golf course,
            arrive at the races, reach your country house for lunch and still be back in
            London for dinner."
          </blockquote>
          <span className="fd-fleet__quote-attr">— The Freedom of Flight</span>
        </div>

      </section>

      {/* ===== SCROLLING STRIPS - DESTINATIONS ===== */}
      <div className="scrolling-strips-wrapper" ref={scrollingStripsWrapperRef}>
        <ScrollingStrips wrapperRef={scrollingStripsWrapperRef} />
        <div className="scrolling-strips-spacer"></div>
      </div>

      {/* ===== PARALLAX: EXPEDITIONS ===== */}
      <ParallaxSection
        image="/assets/images/expeditions/six-helis-in-North-Pole.jpg"
        alt="Global Expeditions"
        className="reveal-element"
        waves={true}
      >
        <div className="parallax-section__number-row">
          <span className="parallax-section__line"></span>
          <span className="parallax-section__number">03</span>
          <span className="parallax-section__line"></span>
        </div>
        <span className="parallax-section__label">Journey of a Lifetime</span>
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
          <div className="fd-exped__cinematic-content">
            <span className="fd-exped__pre-title">With Captain Quentin Smith</span>
            <h2 className="fd-exped__title">
              <span className="fd-exped__title-word fd-exped__title-word--1">Explore</span>
              <span className="fd-exped__title-word fd-exped__title-word--2">The</span>
              <span className="fd-exped__title-word fd-exped__title-word--3">Unreachable</span>
            </h2>
            <p className="fd-exped__cinematic-desc">
              This isn't transport. This is using the helicopter as a gateway to the world—
              a first-class ticket to the beauty of our planet, seeing places in ways that
              very few have ever experienced before.
            </p>
          </div>
        </div>


        {/* Journey Map - Visual Route Display */}
        <div className="fd-exped__journey">
          <div className="fd-exped__journey-header">
            <span className="fd-exped__label">From Denham to the Ends of the Earth</span>
            <h3 className="fd-exped__journey-title">Where Will You Go?</h3>
          </div>
          <div className="fd-exped__journey-map">
            <svg className="fd-exped__map-svg" viewBox="0 0 1000 400" preserveAspectRatio="xMidYMid meet">
              {/* Center point - Denham */}
              <circle cx="500" cy="200" r="8" fill="#1a1a1a" className="fd-exped__map-origin" />
              <text x="500" y="230" textAnchor="middle" className="fd-exped__map-label">DENHAM</text>

              {/* Journey Lines with Destinations */}
              <line x1="500" y1="200" x2="200" y2="80" stroke="#e8e6e2" strokeWidth="1" strokeDasharray="4 4" className="fd-exped__map-line" />
              <circle cx="200" cy="80" r="6" fill="#fff" stroke="#1a1a1a" strokeWidth="2" />
              <text x="200" y="60" textAnchor="middle" className="fd-exped__map-dest">ARCTIC</text>

              <line x1="500" y1="200" x2="150" y2="200" stroke="#e8e6e2" strokeWidth="1" strokeDasharray="4 4" className="fd-exped__map-line" />
              <circle cx="150" cy="200" r="6" fill="#fff" stroke="#1a1a1a" strokeWidth="2" />
              <text x="150" y="180" textAnchor="middle" className="fd-exped__map-dest">ICELAND</text>

              <line x1="500" y1="200" x2="300" y2="320" stroke="#e8e6e2" strokeWidth="1" strokeDasharray="4 4" className="fd-exped__map-line" />
              <circle cx="300" cy="320" r="6" fill="#fff" stroke="#1a1a1a" strokeWidth="2" />
              <text x="300" y="350" textAnchor="middle" className="fd-exped__map-dest">SAHARA</text>

              <line x1="500" y1="200" x2="800" y2="80" stroke="#e8e6e2" strokeWidth="1" strokeDasharray="4 4" className="fd-exped__map-line" />
              <circle cx="800" cy="80" r="6" fill="#fff" stroke="#1a1a1a" strokeWidth="2" />
              <text x="800" y="60" textAnchor="middle" className="fd-exped__map-dest">GREENLAND</text>

              <line x1="500" y1="200" x2="850" y2="200" stroke="#e8e6e2" strokeWidth="1" strokeDasharray="4 4" className="fd-exped__map-line" />
              <circle cx="850" cy="200" r="6" fill="#fff" stroke="#1a1a1a" strokeWidth="2" />
              <text x="850" y="180" textAnchor="middle" className="fd-exped__map-dest">BAHAMAS</text>

              <line x1="500" y1="200" x2="700" y2="350" stroke="#e8e6e2" strokeWidth="1" strokeDasharray="4 4" className="fd-exped__map-line" />
              <circle cx="700" cy="350" r="6" fill="#fff" stroke="#1a1a1a" strokeWidth="2" />
              <text x="700" y="380" textAnchor="middle" className="fd-exped__map-dest">ANTARCTICA</text>
            </svg>
            {/* Animated Helicopter */}
            <img
              src="/assets/images/icons/r66-icon-transparent going right.svg"
              alt=""
              className="fd-exped__map-heli"
            />
          </div>
        </div>

        {/* Featured Expedition Regions - Large Cards */}
        <div className="fd-exped__regions">
          <span className="fd-exped__regions-label">Choose Your Adventure</span>
          <div className="fd-exped__regions-grid">
            {/* Polar */}
            <Link to="/expeditions?region=polar" className="fd-exped__region-card fd-exped__region-card--polar">
              <div className="fd-exped__region-bg">
                <img src="/assets/images/expeditions/south-pole-by-helicopter-quentin-smith.webp" alt="Polar Expeditions" />
              </div>
              <div className="fd-exped__region-overlay"></div>
              <div className="fd-exped__region-content">
                <span className="fd-exped__region-tag">Extreme</span>
                <h3 className="fd-exped__region-title">Polar Expeditions</h3>
                <p className="fd-exped__region-desc">North Pole • South Pole • Greenland • Antarctica</p>
                <div className="fd-exped__region-meta">
                  <span className="fd-exped__region-duration">10-21 Days</span>
                  <span className="fd-exped__region-arrow">→</span>
                </div>
              </div>
              <div className="fd-exped__region-badge">
                <span>World</span>
                <span>Record</span>
                <span>Holder</span>
              </div>
            </Link>

            {/* European */}
            <Link to="/expeditions?region=european" className="fd-exped__region-card fd-exped__region-card--euro">
              <div className="fd-exped__region-bg">
                <img src="/assets/images/expeditions/channel.jpg" alt="European Expeditions" />
              </div>
              <div className="fd-exped__region-overlay"></div>
              <div className="fd-exped__region-content">
                <span className="fd-exped__region-tag">Classic</span>
                <h3 className="fd-exped__region-title">European Journeys</h3>
                <p className="fd-exped__region-desc">Scottish Highlands • Norwegian Fjords • Swiss Alps • Iceland</p>
                <div className="fd-exped__region-meta">
                  <span className="fd-exped__region-duration">4-7 Days</span>
                  <span className="fd-exped__region-arrow">→</span>
                </div>
              </div>
            </Link>

            {/* Tropical */}
            <Link to="/expeditions?region=tropical" className="fd-exped__region-card fd-exped__region-card--tropical">
              <div className="fd-exped__region-bg">
                <img src="/assets/images/expeditions/helicopter-expeditions-quentin-smith.webp" alt="Tropical Expeditions" />
              </div>
              <div className="fd-exped__region-overlay"></div>
              <div className="fd-exped__region-content">
                <span className="fd-exped__region-tag">Paradise</span>
                <h3 className="fd-exped__region-title">Tropical Escapes</h3>
                <p className="fd-exped__region-desc">Bahamas • Costa Rica • Caribbean Islands</p>
                <div className="fd-exped__region-meta">
                  <span className="fd-exped__region-duration">7-10 Days</span>
                  <span className="fd-exped__region-arrow">→</span>
                </div>
              </div>
            </Link>
          </div>
        </div>


        {/* Upcoming Expeditions - Departure Board Style */}
        <div className="fd-exped__departures">
          <div className="fd-exped__departures-header">
            <span className="fd-exped__departures-status">NOW BOARDING</span>
            <h3 className="fd-exped__departures-title">Upcoming Expeditions</h3>
          </div>
          <div className="fd-exped__departures-board">
            <div className="fd-exped__departure">
              <span className="fd-exped__departure-badge fd-exped__departure-badge--new">NEW</span>
              <span className="fd-exped__departure-date">AUG 2025</span>
              <span className="fd-exped__departure-dest">GREENLAND EXPLORER</span>
              <span className="fd-exped__departure-duration">10 Days</span>
              <span className="fd-exped__departure-status fd-exped__departure-status--boarding">BOOKING</span>
            </div>
            <div className="fd-exped__departure">
              <span className="fd-exped__departure-badge fd-exped__departure-badge--spaces">SPACES</span>
              <span className="fd-exped__departure-date">MAR 2026</span>
              <span className="fd-exped__departure-dest">ICELAND: NORTHERN LIGHTS</span>
              <span className="fd-exped__departure-duration">7 Days</span>
              <span className="fd-exped__departure-status fd-exped__departure-status--open">OPEN</span>
            </div>
            <div className="fd-exped__departure">
              <span className="fd-exped__departure-badge fd-exped__departure-badge--filling">FILLING</span>
              <span className="fd-exped__departure-date">JUN 2026</span>
              <span className="fd-exped__departure-dest">SCOTTISH HIGHLANDS</span>
              <span className="fd-exped__departure-duration">5 Days</span>
              <span className="fd-exped__departure-status fd-exped__departure-status--limited">LIMITED</span>
            </div>
          </div>
        </div>

        {/* CTA Section */}
        <div className="fd-exped__cta">
          <div className="fd-exped__cta-content">
            <p className="fd-exped__cta-text">Ready to embark on the journey of a lifetime?</p>
            <div className="fd-exped__cta-buttons">
              <Link to="/expeditions" className="fd-exped__btn fd-exped__btn--primary">View All Expeditions</Link>
              <Link to="/contact?subject=expedition" className="fd-exped__btn fd-exped__btn--outline">Enquire Now</Link>
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
        <span className="parallax-section__label">Premium</span>
        <h2 className="parallax-section__title">Sales</h2>
        <p className="parallax-section__text">
          Your perfect aircraft awaits
        </p>
      </ParallaxSection>

      <section className="fd-sales reveal-element" id="sales">
        {/* Robinson Authorized Dealer - Prominent Certification Card */}
        <div className="fd-cert">
          <div className="fd-cert__card fd-cert__card--dealer">
            <div className="fd-cert__glow"></div>
            <div className="fd-cert__content">
              <div className="fd-cert__logo-wrap">
                <img
                  src="/assets/images/robinson-assets/logos/rhc-authorized-dealer-logo-logo-yellow-rotor-black-type.svg"
                  alt="Robinson Authorized Dealer"
                  className="fd-cert__logo"
                />
              </div>
              <div className="fd-cert__info">
                <span className="fd-cert__label">Official</span>
                <h3 className="fd-cert__title">Robinson Authorized Dealer</h3>
                <p className="fd-cert__desc">
                  The UK's premier Robinson dealership since 1990. Factory-direct pricing,
                  full warranty support, and expert guidance from purchase to delivery.
                </p>
                <div className="fd-cert__stats">
                  <div className="fd-cert__stat">
                    <span className="fd-cert__stat-value">35+</span>
                    <span className="fd-cert__stat-label">Years</span>
                  </div>
                  <div className="fd-cert__stat-divider"></div>
                  <div className="fd-cert__stat">
                    <span className="fd-cert__stat-value">500+</span>
                    <span className="fd-cert__stat-label">Aircraft Sold</span>
                  </div>
                  <div className="fd-cert__stat-divider"></div>
                  <div className="fd-cert__stat">
                    <span className="fd-cert__stat-value">UK</span>
                    <span className="fd-cert__stat-label">Exclusive</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="fd-sales__header">
          <span className="fd-sales__number">04</span>
          <h2 className="fd-sales__title">Aircraft Sales</h2>
          <p className="fd-sales__text">
            New and pre-owned Robinson helicopters, expertly sourced and prepared to the highest standards.
          </p>
        </div>

        <div className="fd-sales__grid">
          <Link to="/sales/new?model=r88" className="fd-sales__card fd-sales__card--featured">
            <div className="fd-sales__card-badge">NEW</div>
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

          <Link to="/sales/new?model=r66" className="fd-sales__card">
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

          <Link to="/sales/new?model=r44" className="fd-sales__card">
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

          <Link to="/sales/new?model=r22" className="fd-sales__card">
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
          <Link to="/sales/new" className="fd-sales__btn fd-sales__btn--primary">New Aircraft</Link>
          <Link to="/sales/pre-owned" className="fd-sales__btn fd-sales__btn--outline">Pre-Owned</Link>
        </div>
      </section>

      {/* ===== PARALLAX: MAINTENANCE ===== */}
      <ParallaxSection
        image="/assets/images/facility/maintenance-.jpg"
        alt="Maintenance"
        className="reveal-element"
        waves={true}
      >
        <span className="parallax-section__label">Excellence</span>
        <h2 className="parallax-section__title">Maintenance</h2>
        <p className="parallax-section__text">
          Factory-trained precision
        </p>
      </ParallaxSection>

      <section className="fd-maint reveal-element" id="maintenance">
        {/* Robinson Authorized Service Center - Prominent Certification Card */}
        <div className="fd-cert">
          <div className="fd-cert__card fd-cert__card--service">
            <div className="fd-cert__glow fd-cert__glow--blue"></div>
            <div className="fd-cert__content">
              <div className="fd-cert__logo-wrap">
                <img
                  src="/assets/images/robinson-assets/logos/rhc_authorized-service-center-logo-logo-yellow-rotor-black-type.svg"
                  alt="Robinson Authorized Service Center"
                  className="fd-cert__logo"
                />
              </div>
              <div className="fd-cert__info">
                <span className="fd-cert__label">Certified</span>
                <h3 className="fd-cert__title">Robinson Authorized Service Center</h3>
                <p className="fd-cert__desc">
                  EASA Part 145 approved facility with factory-trained engineers,
                  genuine Robinson parts, and industry-leading turnaround times.
                </p>
                <div className="fd-cert__stats">
                  <div className="fd-cert__stat">
                    <span className="fd-cert__stat-value">85+</span>
                    <span className="fd-cert__stat-label">Aircraft</span>
                  </div>
                  <div className="fd-cert__stat-divider"></div>
                  <div className="fd-cert__stat">
                    <span className="fd-cert__stat-value">Part 145</span>
                    <span className="fd-cert__stat-label">EASA</span>
                  </div>
                  <div className="fd-cert__stat-divider"></div>
                  <div className="fd-cert__stat">
                    <span className="fd-cert__stat-value">100%</span>
                    <span className="fd-cert__stat-label">Genuine Parts</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="fd-maint__header">
          <span className="fd-maint__number">05</span>
          <h2 className="fd-maint__title">Maintenance</h2>
          <p className="fd-maint__text">
            EASA Part 145 approved facility with factory-trained engineers and genuine parts.
          </p>
        </div>

        <div className="fd-maint__stats">
          <div className="fd-maint__stat">
            <span className="fd-maint__stat-value">85+</span>
            <span className="fd-maint__stat-label">Aircraft Under Care</span>
          </div>
          <div className="fd-maint__stat-divider"></div>
          <div className="fd-maint__stat">
            <span className="fd-maint__stat-value">15+</span>
            <span className="fd-maint__stat-label">Years Experience</span>
          </div>
          <div className="fd-maint__stat-divider"></div>
          <div className="fd-maint__stat">
            <span className="fd-maint__stat-value">Part 145</span>
            <span className="fd-maint__stat-label">EASA Approved</span>
          </div>
          <div className="fd-maint__stat-divider"></div>
          <div className="fd-maint__stat">
            <span className="fd-maint__stat-value">100%</span>
            <span className="fd-maint__stat-label">Genuine Parts</span>
          </div>
        </div>

        <div className="fd-maint__services">
          <div className="fd-maint__service">
            <span className="fd-maint__service-num">01</span>
            <h3>Scheduled Maintenance</h3>
            <p>100-hour, annual, and progressive inspections to manufacturer specifications.</p>
          </div>
          <div className="fd-maint__service">
            <span className="fd-maint__service-num">02</span>
            <h3>Overhaul Services</h3>
            <p>Complete engine, transmission, and component overhauls by factory-trained engineers.</p>
          </div>
          <div className="fd-maint__service">
            <span className="fd-maint__service-num">03</span>
            <h3>Avionics & Upgrades</h3>
            <p>Modern avionics installation, glass cockpit upgrades, and system integration.</p>
          </div>
          <div className="fd-maint__service">
            <span className="fd-maint__service-num">04</span>
            <h3>AOG Support</h3>
            <p>24/7 Aircraft on Ground emergency support to minimize your downtime.</p>
          </div>
        </div>

        <div className="fd-maint__actions">
          <Link to="/maintenance" className="fd-maint__btn fd-maint__btn--primary">View All Services</Link>
          <Link to="/contact?subject=maintenance" className="fd-maint__btn fd-maint__btn--outline">Book Inspection</Link>
        </div>
      </section>

      <section className="fd-section fd-section--alt reveal-element" id="contact">
        <div className="fd-section__inner">
          <span className="fd-section__number">06</span>
          <h2 className="fd-section__title">Contact</h2>
          <p className="fd-section__text">
            Ready to begin your aviation journey? Get in touch with
            our team at Denham Aerodrome.
          </p>
          <Link to="/contact" className="fd-section__link">Get in Touch →</Link>
        </div>
      </section>

      {/* ===== PRECISION ENGINEERING (Hero 92) ===== */}
      <div className="reveal-element">
        <PrecisionEngineering />
      </div>

      {/* ===== EDITORIAL GRID (Hero 90) ===== */}
      <div className="reveal-element">
        <EditorialGrid />
      </div>

      {/* ===== BLOG SECTION ===== */}
      <div className="reveal-element">
        <BlogSection />
      </div>

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
          padding: 2.5rem 2rem 6rem;
          background: #fff;
          width: 100vw;
          margin-left: -50vw;
          margin-right: -50vw;
          left: 50%;
          right: 50%;
          box-sizing: border-box;
          position: relative;
          z-index: 10;
          box-shadow: inset 0 20px 30px -20px rgba(0, 0, 0, 0.15);
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
          .carousel--97 .carousel__main { grid-template-columns: 1fr; gap: 1.5rem; }
          .carousel--97 .carousel__divider { display: none; }
          .carousel--97 .carousel__image { min-height: 200px; }
          .carousel--97 .carousel__body { flex-direction: column; gap: 1rem; }
          .carousel--97 .carousel__arrow { display: none; }
        }

        /* ===== WHY FLY DROPDOWN ===== */
        .fd-why-fly-dropdown {
          width: 100vw;
          margin-left: -50vw;
          margin-right: -50vw;
          left: 50%;
          position: relative;
          background: #faf9f6;
          box-shadow: 0 20px 40px -5px rgba(0, 0, 0, 0.2);
          z-index: 10;
        }

        .fd-why-fly-dropdown--ghost {
          background: transparent;
          box-shadow: none;
        }

        /* Variation Picker */
        .fd-why-fly-dropdown__picker {
          position: absolute;
          top: -44px;
          left: 50%;
          transform: translateX(-50%);
          display: flex;
          align-items: center;
          gap: 1rem;
          background: #0a0a0a;
          padding: 0.5rem 1rem;
          border-radius: 8px 8px 0 0;
          z-index: 10;
          box-shadow: 0 -4px 20px rgba(0, 0, 0, 0.15);
        }

        .fd-why-fly-dropdown__picker-info {
          display: flex;
          align-items: center;
          gap: 0.75rem;
        }

        .fd-why-fly-dropdown__picker-label {
          font-family: 'Share Tech Mono', monospace;
          font-size: 0.6rem;
          color: rgba(255, 255, 255, 0.4);
          text-transform: uppercase;
          letter-spacing: 0.1em;
        }

        .fd-why-fly-dropdown__picker-name {
          font-family: 'Space Grotesk', sans-serif;
          font-size: 0.8rem;
          font-weight: 600;
          color: #fff;
        }

        .fd-why-fly-dropdown__picker-counter {
          font-family: 'Share Tech Mono', monospace;
          font-size: 0.65rem;
          color: rgba(255, 255, 255, 0.5);
        }

        .fd-why-fly-dropdown__picker-nav {
          display: flex;
          gap: 0.25rem;
        }

        .fd-why-fly-dropdown__picker-btn {
          width: 28px;
          height: 28px;
          border: none;
          background: rgba(255, 255, 255, 0.1);
          color: #fff;
          border-radius: 4px;
          cursor: pointer;
          font-size: 14px;
          transition: background 0.2s ease;
        }

        .fd-why-fly-dropdown__picker-btn:hover {
          background: rgba(255, 255, 255, 0.2);
        }

        /* ===== VARIATION STYLES ===== */

        /* Image Styles */
        .fd-why-fly-dropdown__trigger-thumbs--landscape .fd-why-fly-dropdown__thumb {
          aspect-ratio: 16 / 9;
        }

        .fd-why-fly-dropdown__trigger-thumbs--square .fd-why-fly-dropdown__thumb {
          aspect-ratio: 1 / 1;
        }

        .fd-why-fly-dropdown__trigger-thumbs--strip .fd-why-fly-dropdown__thumb {
          aspect-ratio: 2 / 1;
          height: 60%;
        }

        .fd-why-fly-dropdown__trigger-thumbs--large .fd-why-fly-dropdown__thumb {
          aspect-ratio: 4 / 5;
          width: auto;
          height: 100%;
        }

        .fd-why-fly-dropdown__trigger-thumbs--small .fd-why-fly-dropdown__thumb {
          aspect-ratio: 1 / 1;
          height: 50%;
        }

        .fd-why-fly-dropdown__trigger-thumbs--cards .fd-why-fly-dropdown__thumb {
          aspect-ratio: 3 / 4;
          border-radius: 6px;
          box-shadow: 0 4px 12px rgba(0,0,0,0.3);
        }

        .fd-why-fly-dropdown__trigger-thumbs--cards .fd-why-fly-dropdown__thumb:nth-child(2) {
          transform: translateY(8px);
        }

        .fd-why-fly-dropdown__trigger-thumbs--cards .fd-why-fly-dropdown__thumb:nth-child(3) {
          transform: translateY(-8px);
        }

        .fd-why-fly-dropdown__trigger-thumbs--overlay {
          position: absolute;
        }

        .fd-why-fly-dropdown__trigger-thumbs--overlay .fd-why-fly-dropdown__thumb {
          opacity: 0.3;
        }


        .fd-why-fly-dropdown__trigger-thumbs--framed .fd-why-fly-dropdown__thumb {
          border: 2px solid var(--accent-color, #c9a227);
          border-radius: 2px;
          padding: 2px;
          background: #1a1a1a;
        }

        .fd-why-fly-dropdown__trigger-thumbs--mixed .fd-why-fly-dropdown__thumb:nth-child(odd) {
          aspect-ratio: 3 / 5;
        }

        .fd-why-fly-dropdown__trigger-thumbs--mixed .fd-why-fly-dropdown__thumb:nth-child(even) {
          aspect-ratio: 5 / 3;
          height: 70%;
        }

        /* Border Styles */
        .fd-why-fly-dropdown__trigger--border-top-bottom {
          border-top: 1px solid rgba(255,255,255,0.2);
          border-bottom: 1px solid rgba(255,255,255,0.2);
        }

        .fd-why-fly-dropdown__trigger--border-full {
          border: 2px solid #1a1a1a;
        }

        .fd-why-fly-dropdown__trigger--border-accent-left {
          border-left: 4px solid #c9a227;
        }

        .fd-why-fly-dropdown__trigger--border-accent-right {
          border-right: 4px solid #c9a227;
        }

        .fd-why-fly-dropdown__trigger--border-thin-top {
          border-top: 1px solid rgba(255,255,255,0.1);
        }

        .fd-why-fly-dropdown__trigger--border-dashed {
          border: 1px dashed rgba(255,255,255,0.3);
        }

        .fd-why-fly-dropdown__trigger--border-sprocket::before,
        .fd-why-fly-dropdown__trigger--border-sprocket::after {
          content: '';
          position: absolute;
          top: 0;
          bottom: 0;
          width: 12px;
          background: repeating-linear-gradient(
            to bottom,
            transparent 0px,
            transparent 8px,
            rgba(255,255,255,0.2) 8px,
            rgba(255,255,255,0.2) 16px
          );
        }

        .fd-why-fly-dropdown__trigger--border-sprocket::before {
          left: 0;
        }

        .fd-why-fly-dropdown__trigger--border-sprocket::after {
          right: 0;
        }

        .fd-why-fly-dropdown__trigger--border-gold {
          border: 1px solid var(--accent-color, #c9a227);
          box-shadow: inset 0 0 20px rgba(201, 162, 39, 0.1);
        }

        /* Font Styles */
        .fd-why-fly-dropdown__trigger--font-serif .fd-why-fly-dropdown__title {
          font-family: 'Playfair Display', Georgia, serif;
          font-weight: 400;
          letter-spacing: 0.05em;
        }

        .fd-why-fly-dropdown__trigger--font-mono .fd-why-fly-dropdown__title {
          font-family: 'Share Tech Mono', monospace;
          letter-spacing: 0.15em;
          font-weight: 400;
        }

        .fd-why-fly-dropdown__trigger--font-bold .fd-why-fly-dropdown__title {
          font-weight: 900;
          letter-spacing: 0.2em;
        }

        /* Layout Styles */
        .fd-why-fly-dropdown__trigger--left {
          justify-content: flex-start;
        }

        .fd-why-fly-dropdown__trigger--left .fd-why-fly-dropdown__trigger-center {
          margin-left: 2rem;
        }

        .fd-why-fly-dropdown__trigger--right {
          justify-content: flex-end;
        }

        .fd-why-fly-dropdown__trigger--right .fd-why-fly-dropdown__trigger-center {
          margin-right: 2rem;
        }

        .fd-why-fly-dropdown__trigger--editorial-left .fd-why-fly-dropdown__trigger-center,
        .fd-why-fly-dropdown__trigger--editorial-right .fd-why-fly-dropdown__trigger-center {
          flex: 1;
        }

        .fd-why-fly-dropdown__trigger--split {
          justify-content: center;
        }

        .fd-why-fly-dropdown__trigger--technical {
          font-family: 'Share Tech Mono', monospace;
        }

        .fd-why-fly-dropdown__trigger--filmstrip {
          padding-left: 3rem;
          padding-right: 3rem;
        }

        .fd-why-fly-dropdown__trigger--cards-left .fd-why-fly-dropdown__trigger-thumbs--left,
        .fd-why-fly-dropdown__trigger--cards-right .fd-why-fly-dropdown__trigger-thumbs--right {
          gap: -10px;
        }

        .fd-why-fly-dropdown__trigger--asymmetric .fd-why-fly-dropdown__trigger-thumbs--left {
          transform: translateY(-5px);
        }

        .fd-why-fly-dropdown__trigger--asymmetric .fd-why-fly-dropdown__trigger-thumbs--right {
          transform: translateY(5px);
        }

        /* ===== STAGGERED FLOW LAYOUT ===== */
        .fd-why-fly-dropdown__trigger--staggered {
          position: relative;
          width: 100%;
          min-height: 120px;
          display: flex;
          align-items: center;
          justify-content: center;
          border: none;
          cursor: pointer;
          overflow: hidden;
          padding: 0;
        }

        .fd-why-fly-dropdown__staggered-images {
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          padding: 8px;
        }

        .fd-why-fly-dropdown__staggered-img {
          flex: 1;
          height: calc(100% - 16px);
          background-size: cover;
          background-position: center;
          border-radius: 8px;
          transition: opacity 0.3s ease, box-shadow 0.3s ease;
          box-shadow: 0 4px 15px rgba(0, 0, 0, 0.3);
        }

        .fd-why-fly-dropdown__trigger--staggered:hover .fd-why-fly-dropdown__staggered-img {
          opacity: 0.9 !important;
          box-shadow: 0 6px 20px rgba(0, 0, 0, 0.4);
        }

        .fd-why-fly-dropdown__staggered-content {
          position: relative;
          z-index: 2;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 0.5rem;
          padding: 1.5rem 3rem;
          background: rgba(0, 0, 0, 0.6);
          backdrop-filter: blur(8px);
          border-radius: 12px;
          border: 1px solid rgba(255, 255, 255, 0.1);
          box-shadow: 0 8px 32px rgba(0, 0, 0, 0.4);
        }

        .fd-why-fly-dropdown__staggered-title {
          font-family: 'Space Grotesk', sans-serif;
          font-size: 1.2rem;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 0.15em;
          color: #fff;
          text-shadow:
            0 2px 4px rgba(0, 0, 0, 0.8),
            0 4px 12px rgba(0, 0, 0, 0.6),
            0 0 40px rgba(0, 0, 0, 0.9);
        }

        .fd-why-fly-dropdown__staggered-hint {
          font-family: 'Share Tech Mono', monospace;
          font-size: 0.65rem;
          text-transform: uppercase;
          letter-spacing: 0.2em;
          color: rgba(255, 255, 255, 0.6);
          text-shadow: 0 1px 3px rgba(0, 0, 0, 0.8);
        }

        .fd-why-fly-dropdown__staggered-chevron {
          position: absolute;
          right: 2rem;
          top: 50%;
          transform: translateY(-50%);
          z-index: 2;
          background: rgba(0, 0, 0, 0.5);
          border-radius: 50%;
          width: 44px;
          height: 44px;
          display: flex;
          align-items: center;
          justify-content: center;
          backdrop-filter: blur(8px);
          border: 1px solid rgba(255, 255, 255, 0.15);
          box-shadow: 0 4px 16px rgba(0, 0, 0, 0.3);
          transition: all 0.3s ease;
        }

        .fd-why-fly-dropdown__trigger--staggered:hover .fd-why-fly-dropdown__staggered-chevron {
          background: rgba(0, 0, 0, 0.7);
          transform: translateY(-50%) scale(1.05);
        }

        .fd-why-fly-dropdown__staggered-chevron .fd-why-fly-dropdown__chevron {
          filter: drop-shadow(0 2px 4px rgba(0,0,0,0.5));
        }

        /* ===== GHOST FLOW STYLES ===== */
        /* Ghost Flow - Minimal */
        .fd-why-fly-dropdown__staggered-images--ghost {
          opacity: 1;
        }

        .fd-why-fly-dropdown__staggered-img--ghost {
          opacity: 0.08;
          filter: grayscale(100%);
          border-radius: 0;
        }

        .fd-why-fly-dropdown__trigger--staggered:hover .fd-why-fly-dropdown__staggered-img--ghost {
          opacity: 0.15;
          filter: grayscale(60%);
        }

        .fd-why-fly-dropdown__staggered-content--ghost {
          background: transparent;
          border: none;
          padding: 0;
          flex-direction: column;
          gap: 0.35rem;
        }

        .fd-why-fly-dropdown__staggered-title--ghost {
          color: #1a1a1a;
          font-family: 'Space Grotesk', -apple-system, sans-serif;
          font-size: 0.75rem;
          font-weight: 500;
          letter-spacing: 0.2em;
          text-transform: uppercase;
          text-shadow:
            0 0 20px rgba(250, 249, 246, 0.9),
            0 0 40px rgba(250, 249, 246, 0.6);
        }

        .fd-why-fly-dropdown__staggered-hint--ghost {
          color: #999;
          font-family: 'Space Grotesk', -apple-system, sans-serif;
          font-size: 0.6rem;
          font-weight: 400;
          letter-spacing: 0.15em;
          text-transform: lowercase;
          text-shadow:
            0 0 15px rgba(250, 249, 246, 0.8),
            0 0 30px rgba(250, 249, 246, 0.5);
        }

        .fd-why-fly-dropdown__staggered-chevron--ghost {
          display: none;
        }

        .fd-why-fly-dropdown__trigger--staggered-ghost {
          min-height: 70px;
          background: transparent !important;
        }

        .fd-why-fly-dropdown__trigger--staggered-ghost .fd-why-fly-dropdown__staggered-img {
          box-shadow: none;
        }

        .fd-why-fly-dropdown__trigger--staggered-ghost:hover .fd-why-fly-dropdown__staggered-img {
          box-shadow: none;
        }

        /* ===== COMPACT VARIATIONS ===== */
        .fd-why-fly-dropdown__trigger--compact {
          min-height: auto;
        }

        .fd-why-fly-dropdown__trigger--compact-pill {
          width: auto;
          margin: 0 auto;
          border-radius: 100px;
          min-height: auto;
        }

        .fd-why-fly-dropdown__trigger--compact-tag {
          width: auto;
          margin: 0 auto;
          border-radius: 4px;
          min-height: auto;
        }

        .fd-why-fly-dropdown__trigger--compact-bar {
          min-height: auto;
        }

        .fd-why-fly-dropdown__trigger--compact-underline {
          min-height: auto;
          background: transparent !important;
        }

        .fd-why-fly-dropdown__trigger--compact-link {
          min-height: auto;
          width: auto;
          margin: 0 auto;
        }

        .fd-why-fly-dropdown__trigger--compact-accent {
          min-height: auto;
        }

        .fd-why-fly-dropdown__trigger--compact-dot {
          min-height: auto;
        }

        .fd-why-fly-dropdown__trigger--compact-dot::before {
          content: '';
          position: absolute;
          left: 1rem;
          top: 50%;
          transform: translateY(-50%);
          width: 6px;
          height: 6px;
          border-radius: 50%;
          background: var(--accent-color, #4ade80);
          animation: compactDotPulse 2s ease-in-out infinite;
        }

        @keyframes compactDotPulse {
          0%, 100% { opacity: 1; transform: translateY(-50%) scale(1); }
          50% { opacity: 0.6; transform: translateY(-50%) scale(0.8); }
        }

        .fd-why-fly-dropdown__trigger--compact-chevron {
          min-height: auto;
          width: auto;
          margin: 0 auto;
          gap: 0.5rem;
        }

        .fd-why-fly-dropdown__trigger--compact-rounded {
          width: auto;
          margin: 0 auto;
          border-radius: 8px;
          min-height: auto;
        }

        .fd-why-fly-dropdown__trigger--compact-inline {
          min-height: auto;
          width: auto;
          margin: 0 auto;
          gap: 0.75rem;
        }

        /* Compact Border Styles */
        .fd-why-fly-dropdown__trigger--border-thin-bottom {
          border-bottom: 1px solid #e5e5e5;
        }

        .fd-why-fly-dropdown__trigger--border-outline {
          border: 1px solid #e5e5e5;
          box-shadow: 0 1px 3px rgba(0,0,0,0.05);
        }

        .fd-why-fly-dropdown__trigger--border-outline-dark {
          border: 1px solid #1a1a1a;
        }

        .fd-why-fly-dropdown__trigger--border-outline-navy {
          border: 1.5px solid #1a3a52;
        }

        .fd-why-fly-dropdown__trigger--border-underline {
          border-bottom: 2px solid #1a1a1a;
        }

        .fd-why-fly-dropdown__trigger--border-top-line {
          border-top: 1px solid #e5e5e5;
        }

        .fd-why-fly-dropdown__trigger--border-accent-left-thin {
          border-left: 3px solid var(--accent-color, #1a3a52);
        }

        .fd-why-fly-dropdown__trigger--border-dashed-light {
          border: 1px dashed rgba(0,0,0,0.15);
        }

        /* Compact Font Styles */
        .fd-why-fly-dropdown__trigger--font-underline .fd-why-fly-dropdown__title {
          text-decoration: underline;
          text-underline-offset: 3px;
        }

        .fd-why-fly-dropdown__trigger--font-inline .fd-why-fly-dropdown__title {
          font-weight: 400;
          text-transform: none;
          letter-spacing: 0;
        }

        .fd-why-fly-dropdown__trigger--font-inline .fd-why-fly-dropdown__title::after {
          content: ' →';
          opacity: 0.5;
          transition: opacity 0.2s ease;
        }

        .fd-why-fly-dropdown__trigger--font-inline:hover .fd-why-fly-dropdown__title::after {
          opacity: 1;
        }

        /* Compact layout adjustments */
        .fd-why-fly-dropdown__trigger--compact .fd-why-fly-dropdown__trigger-center,
        .fd-why-fly-dropdown__trigger--compact-pill .fd-why-fly-dropdown__trigger-center,
        .fd-why-fly-dropdown__trigger--compact-tag .fd-why-fly-dropdown__trigger-center,
        .fd-why-fly-dropdown__trigger--compact-bar .fd-why-fly-dropdown__trigger-center,
        .fd-why-fly-dropdown__trigger--compact-underline .fd-why-fly-dropdown__trigger-center,
        .fd-why-fly-dropdown__trigger--compact-link .fd-why-fly-dropdown__trigger-center,
        .fd-why-fly-dropdown__trigger--compact-accent .fd-why-fly-dropdown__trigger-center,
        .fd-why-fly-dropdown__trigger--compact-dot .fd-why-fly-dropdown__trigger-center,
        .fd-why-fly-dropdown__trigger--compact-chevron .fd-why-fly-dropdown__trigger-center,
        .fd-why-fly-dropdown__trigger--compact-rounded .fd-why-fly-dropdown__trigger-center,
        .fd-why-fly-dropdown__trigger--compact-inline .fd-why-fly-dropdown__trigger-center {
          position: static;
          transform: none;
        }

        /* Compact chevron sizing */
        .fd-why-fly-dropdown__trigger--compact .fd-why-fly-dropdown__chevron,
        .fd-why-fly-dropdown__trigger--compact-pill .fd-why-fly-dropdown__chevron,
        .fd-why-fly-dropdown__trigger--compact-tag .fd-why-fly-dropdown__chevron,
        .fd-why-fly-dropdown__trigger--compact-bar .fd-why-fly-dropdown__chevron,
        .fd-why-fly-dropdown__trigger--compact-rounded .fd-why-fly-dropdown__chevron {
          width: 14px;
          height: 14px;
        }

        /* Hide hint on compact variations */
        .fd-why-fly-dropdown__trigger--compact .fd-why-fly-dropdown__hint,
        .fd-why-fly-dropdown__trigger--compact-pill .fd-why-fly-dropdown__hint,
        .fd-why-fly-dropdown__trigger--compact-tag .fd-why-fly-dropdown__hint,
        .fd-why-fly-dropdown__trigger--compact-bar .fd-why-fly-dropdown__hint,
        .fd-why-fly-dropdown__trigger--compact-underline .fd-why-fly-dropdown__hint,
        .fd-why-fly-dropdown__trigger--compact-link .fd-why-fly-dropdown__hint,
        .fd-why-fly-dropdown__trigger--compact-accent .fd-why-fly-dropdown__hint,
        .fd-why-fly-dropdown__trigger--compact-dot .fd-why-fly-dropdown__hint,
        .fd-why-fly-dropdown__trigger--compact-chevron .fd-why-fly-dropdown__hint,
        .fd-why-fly-dropdown__trigger--compact-rounded .fd-why-fly-dropdown__hint,
        .fd-why-fly-dropdown__trigger--compact-inline .fd-why-fly-dropdown__hint {
          display: none;
        }

        /* Hide chevron on link and inline styles */
        .fd-why-fly-dropdown__trigger--compact-link .fd-why-fly-dropdown__trigger-right,
        .fd-why-fly-dropdown__trigger--compact-inline .fd-why-fly-dropdown__trigger-right,
        .fd-why-fly-dropdown__trigger--compact-underline .fd-why-fly-dropdown__trigger-right {
          display: none;
        }

        .fd-why-fly-dropdown__trigger {
          width: 100%;
          display: grid;
          grid-template-columns: 1fr auto 1fr;
          align-items: center;
          padding: 1rem 1.5rem;
          border: none;
          cursor: pointer;
          transition: all 0.3s ease;
          min-height: 160px;
        }

        .fd-why-fly-dropdown__trigger:hover {
          filter: brightness(1.1);
        }

        .fd-why-fly-dropdown__trigger-left {
          display: none;
          align-items: center;
          gap: 0.75rem;
          opacity: 0;
          transform: translateX(20px);
          transition: opacity 0.4s ease, transform 0.4s ease;
          position: absolute;
          left: 2.5rem;
        }

        .fd-why-fly-dropdown__trigger-left.open {
          display: flex;
          opacity: 1;
          transform: translateX(0);
        }

        .fd-why-fly-dropdown__trigger-center {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          padding: 1rem 3rem;
          gap: 0.25rem;
        }

        .fd-why-fly-dropdown__title {
          font-family: 'Space Grotesk', sans-serif;
          font-size: 0.9rem;
          font-weight: 600;
          text-transform: uppercase;
          letter-spacing: 0.1em;
          color: #1a1a1a;
        }

        .fd-why-fly-dropdown__click-hint {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 0.5rem;
          margin-top: 0.25rem;
        }

        .fd-why-fly-dropdown__click-text {
          font-family: 'Space Grotesk', sans-serif;
          font-size: 0.6rem;
          font-weight: 400;
          letter-spacing: 0.15em;
          text-transform: lowercase;
          color: rgba(26, 26, 26, 0.5);
        }

        .fd-why-fly-dropdown__pulse-dot {
          width: 10px;
          height: 10px;
          background: rgba(26, 26, 26, 0.8);
          border-radius: 50%;
          animation: pulseDot 2s ease-in-out infinite;
          margin-top: 1rem;
        }

        @keyframes pulseDot {
          0%, 100% {
            opacity: 0.4;
            transform: scale(1);
            box-shadow: 0 0 0 0 rgba(26, 26, 26, 0.4);
          }
          50% {
            opacity: 1;
            transform: scale(1.2);
            box-shadow: 0 0 0 8px rgba(26, 26, 26, 0);
          }
        }

        .fd-why-fly-dropdown__trigger-divider {
          width: 1px;
          height: 16px;
          background: rgba(255, 255, 255, 0.3);
        }

        .fd-why-fly-dropdown__trigger-number {
          font-family: 'Share Tech Mono', monospace;
          font-size: 0.8rem;
          color: rgba(255, 255, 255, 0.6);
        }

        .fd-why-fly-dropdown__trigger-heading {
          font-family: 'Space Grotesk', sans-serif;
          font-size: 0.85rem;
          font-weight: 500;
          color: rgba(255, 255, 255, 0.8);
          opacity: 0;
          transform: translateX(15px);
          transition: opacity 0.4s ease 0.1s, transform 0.4s ease 0.1s;
        }

        .fd-why-fly-dropdown__trigger-heading.open {
          opacity: 1;
          transform: translateX(0);
        }

        .fd-why-fly-dropdown__trigger-thumbs {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          flex: 1;
          height: 120px;
        }

        .fd-why-fly-dropdown__trigger-thumbs--left {
          justify-content: flex-end;
        }

        .fd-why-fly-dropdown__trigger-thumbs--right {
          justify-content: flex-start;
        }

        .fd-why-fly-dropdown__thumb {
          flex: 1;
          min-width: 55px;
          height: 100%;
          background-size: cover;
          background-position: center;
          opacity: 0.7;
          border-radius: 45px;
          transition: transform 0.3s ease, opacity 0.3s ease, filter 0.3s ease;
          filter: brightness(0.85);
        }

        .fd-why-fly-dropdown__thumb:hover {
          transform: scale(1.08);
          opacity: 1;
          filter: brightness(1.1);
          z-index: 2;
        }



        .fd-why-fly-dropdown__trigger:hover .fd-why-fly-dropdown__thumb {
          opacity: 0.85;
        }

        .fd-why-fly-dropdown__thumb:hover {
          opacity: 1;
        }

        .fd-why-fly-dropdown__trigger-right {
          display: flex;
          align-items: center;
          gap: 0.75rem;
        }

        .fd-why-fly-dropdown__hint {
          font-family: 'Share Tech Mono', monospace;
          font-size: 0.7rem;
          color: rgba(255, 255, 255, 0.5);
          text-transform: uppercase;
          letter-spacing: 0.1em;
        }

        .fd-why-fly-dropdown__chevron {
          color: #fff;
          transition: transform 0.3s ease;
        }

        .fd-why-fly-dropdown__chevron.open {
          transform: rotate(180deg);
        }

        .fd-why-fly-dropdown__content {
          max-height: 0;
          overflow: hidden;
          transition: max-height 0.4s ease;
        }

        .fd-why-fly-dropdown__content.open {
          max-height: 600px;
        }

        .fd-why-fly-dropdown__card {
          background: #faf9f6;
          box-shadow: 0 4px 40px rgba(0, 0, 0, 0.06);
          position: relative;
        }
        .fd-why-fly-dropdown__close {
          position: absolute;
          top: 12px;
          right: 12px;
          background: none;
          border: none;
          font-size: 18px;
          color: #999;
          cursor: pointer;
          z-index: 2;
          padding: 4px 8px;
          line-height: 1;
        }
        .fd-why-fly-dropdown__close:hover {
          color: #333;
        }

        .fd-why-fly-dropdown__header {
          background: #1a1a1a;
          padding: 1.25rem 2rem;
          display: flex;
          align-items: center;
          justify-content: space-between;
        }

        .fd-why-fly-dropdown__header-left {
          display: flex;
          align-items: center;
          gap: 1rem;
        }

        .fd-why-fly-dropdown__number {
          font-family: 'Share Tech Mono', monospace;
          font-size: 1.5rem;
          color: rgba(255, 255, 255, 0.2);
          line-height: 1;
        }

        .fd-why-fly-dropdown__divider {
          width: 1px;
          height: 24px;
          background: rgba(255, 255, 255, 0.15);
        }

        .fd-why-fly-dropdown__heading {
          font-size: 0.95rem;
          font-weight: 700;
          margin: 0;
          text-transform: uppercase;
          letter-spacing: 0.02em;
          color: #fff;
        }

        .fd-why-fly-dropdown__label {
          font-family: 'Share Tech Mono', monospace;
          font-size: 0.65rem;
          color: rgba(255, 255, 255, 0.4);
          text-transform: uppercase;
          letter-spacing: 0.08em;
        }

        .fd-why-fly-dropdown__body {
          padding: 2rem;
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 2rem;
          align-items: center;
        }

        .fd-why-fly-dropdown__text h3 {
          font-size: clamp(1.25rem, 2.5vw, 1.5rem);
          font-weight: 700;
          margin: 0 0 1rem;
          text-transform: uppercase;
          letter-spacing: -0.01em;
          line-height: 1.2;
        }

        .fd-why-fly-dropdown__text p {
          font-size: 0.95rem;
          color: #666;
          line-height: 1.7;
          margin: 0;
        }

        .fd-why-fly-dropdown__image {
          width: 100%;
          height: 180px;
          background: #2a2a2a;
          border-radius: 6px;
          overflow: hidden;
          position: relative;
        }

        .fd-why-fly-dropdown__image-slide {
          position: absolute;
          inset: 0;
          background-size: cover;
          background-position: center;
          opacity: 0;
          transition: opacity 0.5s ease;
        }

        .fd-why-fly-dropdown__image-slide.active {
          opacity: 1;
        }

        .fd-why-fly-dropdown__image-label {
          position: absolute;
          bottom: 0.75rem;
          left: 0.75rem;
          font-family: 'Share Tech Mono', monospace;
          font-size: 0.5rem;
          letter-spacing: 0.1em;
          color: rgba(255, 255, 255, 0.5);
          text-transform: uppercase;
        }

        .fd-why-fly-dropdown__footer {
          padding: 1.25rem 2rem;
          border-top: 1px solid rgba(26, 26, 26, 0.06);
          display: flex;
          align-items: center;
          justify-content: space-between;
        }

        .fd-why-fly-dropdown__footer-left {
          display: flex;
          align-items: center;
          gap: 1rem;
        }

        .fd-why-fly-dropdown__dots {
          display: flex;
          gap: 4px;
        }

        .fd-why-fly-dropdown__dot {
          width: 4px;
          height: 4px;
          background: rgba(26, 26, 26, 0.15);
          border-radius: 2px;
          transition: all 0.25s ease;
          cursor: pointer;
        }

        .fd-why-fly-dropdown__dot:hover {
          background: rgba(26, 26, 26, 0.4);
        }

        .fd-why-fly-dropdown__dot.active {
          width: 16px;
          background: #1a1a1a;
        }

        .fd-why-fly-dropdown__counter {
          font-family: 'Share Tech Mono', monospace;
          font-size: 0.6rem;
          color: rgba(26, 26, 26, 0.35);
          letter-spacing: 0.1em;
        }

        .fd-why-fly-dropdown__arrows {
          display: flex;
          gap: 0.5rem;
        }

        .fd-why-fly-dropdown__arrow {
          width: 36px;
          height: 36px;
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

        .fd-why-fly-dropdown__arrow:hover {
          background: #1a1a1a;
          border-color: #1a1a1a;
          color: #fff;
        }

        @media (max-width: 768px) {
          .fd-why-fly-dropdown__body {
            grid-template-columns: 1fr;
            gap: 1.5rem;
          }

          .fd-why-fly-dropdown__trigger {
            grid-template-columns: auto 1fr;
            padding: 1rem 1.5rem;
          }

          .fd-why-fly-dropdown__trigger-thumbs--left {
            display: none;
          }

          .fd-why-fly-dropdown__trigger-center {
            align-items: flex-start;
            text-align: left;
          }

          .fd-why-fly-dropdown__trigger-thumbs--right {
            justify-content: flex-end;
          }

          .fd-why-fly-dropdown__click-row {
            flex-direction: row;
            align-items: center;
          }

          .fd-why-fly-dropdown__trigger-center {
            position: static;
            transform: none;
          }

          .fd-why-fly-dropdown__title {
            font-size: 0.8rem;
          }

          .fd-why-fly-dropdown__staggered-title {
            font-size: 0.9rem;
            letter-spacing: 0.1em;
          }

          .fd-why-fly-dropdown__staggered-content {
            padding: 1rem 1.5rem;
          }

          .fd-why-fly-dropdown__staggered-chevron {
            right: 1rem;
            width: 32px;
            height: 32px;
          }

          .fd-why-fly-dropdown__staggered-img:nth-child(n+6) {
            display: none;
          }

          .fd-why-fly-dropdown__staggered-content--ghost {
            padding: 0;
          }

          .fd-why-fly-dropdown__staggered-chevron--ghost {
            width: auto;
            height: auto;
          }

          .fd-why-fly-dropdown__body,
          .fd-why-fly-dropdown__footer {
            padding-left: 1.5rem;
            padding-right: 1.5rem;
          }

          .fd-why-fly-dropdown__content.open {
            max-height: 800px;
          }
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

        .fd-fleet__number {
          display: block;
          font-family: 'Share Tech Mono', monospace;
          font-size: 0.7rem;
          color: #999;
          margin-bottom: 1.5rem;
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

        /* Sticky-blur transition into Sales (desktop only).
           Mirrors the variants→specs pattern on /aircraft/r66. */
        @media (min-width: 901px) {
          .fd-exped {
            position: sticky;
            top: var(--fd-exped-stick-top, 0);
          }

          @media (prefers-reduced-motion: no-preference) {
            .fd-exped {
              filter: blur(var(--fd-exped-blur, 0px));
              will-change: filter;
            }

            .fd-exped::after {
              content: '';
              position: absolute;
              inset: 0;
              background: #000;
              opacity: var(--fd-exped-darken, 0);
              pointer-events: none;
              z-index: 2;
            }
          }

          /* The Sales ParallaxSection is the immediate next sibling and must
             stack above the pinned, blurred Expeditions while it rises. */
          .fd-exped + .parallax-section {
            position: relative;
            z-index: 3;
          }
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

        .fd-exped__cinematic-content {
          position: relative;
          z-index: 2;
          text-align: center;
          max-width: 900px;
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

        .fd-sales__header {
          text-align: center;
          margin-bottom: 3rem;
        }

        .fd-sales__number {
          display: block;
          font-family: 'Share Tech Mono', monospace;
          font-size: 0.7rem;
          color: #999;
          margin-bottom: 1rem;
        }

        .fd-sales__title {
          font-family: 'Space Grotesk', sans-serif;
          font-size: clamp(2rem, 4vw, 3rem);
          font-weight: 700;
          text-transform: uppercase;
          margin: 0 0 1rem;
          color: #1a1a1a;
        }

        .fd-sales__text {
          font-size: 1rem;
          line-height: 1.7;
          color: #666;
          max-width: 500px;
          margin: 0 auto;
        }

        .fd-sales__grid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 1.5rem;
          max-width: 1100px;
          margin: 0 auto 3rem;
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

        .fd-sales__actions {
          display: flex;
          justify-content: center;
          gap: 1rem;
        }

        .fd-sales__btn {
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

          .fd-sales__actions {
            flex-direction: column;
            align-items: center;
          }

          .fd-sales__btn {
            width: 100%;
            max-width: 280px;
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

        /* ===== PARALLAX SECTIONS ===== */
        .parallax-section {
          position: relative;
          height: 400px;
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
          text-align: center;
          color: #fff;
          padding: 2rem;
        }

        .parallax-section__number-row {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 1rem;
          margin-bottom: 0.75rem;
        }

        .parallax-section__number {
          font-family: 'Share Tech Mono', monospace;
          font-size: 0.75rem;
          letter-spacing: 0.1em;
          opacity: 0.7;
        }

        .parallax-section__line {
          width: 40px;
          height: 1px;
          background: rgba(255, 255, 255, 0.5);
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
          overflow: visible;
        }

        .scrolling-strips-spacer {
          height: 100px;
          pointer-events: none;
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
      `}</style>
    </div>
  );
}

export default FinalDraft;

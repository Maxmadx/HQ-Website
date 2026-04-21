/**
 * HQ AVIATION - ROBINSON R88 AIRCRAFT PAGE
 *
 * Brand: Luxury Minimal Aviation
 * Typography: Space Grotesk + Share Tech Mono
 * Colors: #faf9f6 (warm white), #1a1a1a (charcoal), #4a4a4a (mid), #7a7a7a (light)
 * Aesthetic: Editorial Design, Luxury Aviation, Coming Soon Announcement
 *
 * Sections:
 * 1. Hero - Full viewport "COMING SOON" announcement style
 * 2. Introduction - Robinson's bold new chapter
 * 3. Specifications - Interactive technical specs cards
 * 4. Engine Partnership - Safran Arriel 2W details
 * 5. Avionics - Garmin glass cockpit
 * 6. Development Timeline - Visual timeline from announcement to first flight
 * 7. Reserve/Contact CTA - "Be among the first" / register interest
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

// Import Footer
import FooterMinimal from '../components/FooterMinimal';

// ============================================================================
// COMPONENT: R88Header
// ============================================================================
function R88Header() {
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
              <li><Link to="/contact" onClick={closeMenu}>Contact</Link></li>
            </ul>
          </div>
          <div className="hq-menu-section">
            <h3>Aircraft Sales</h3>
            <ul>
              <li><Link to="/sales/new" onClick={closeMenu}>New Aircraft</Link></li>
              <li><Link to="/aircraft/r66" onClick={closeMenu}>R66 Turbine</Link></li>
              <li><Link to="/aircraft/r44" onClick={closeMenu}>R44</Link></li>
              <li><Link to="/aircraft/r22" onClick={closeMenu}>R22</Link></li>
              <li><Link to="/aircraft/r88" onClick={closeMenu}>R88 (Coming Soon)</Link></li>
              <li><Link to="/sales/pre-owned" onClick={closeMenu}>Pre-Owned Aircraft</Link></li>
            </ul>
          </div>
          <div className="hq-menu-section">
            <h3>Training</h3>
            <ul>
              <li><Link to="/training" onClick={closeMenu}>Training Overview</Link></li>
              <li><Link to="/training/ppl" onClick={closeMenu}>Private Pilot License</Link></li>
              <li><Link to="/training/type-rating" onClick={closeMenu}>Type Ratings</Link></li>
            </ul>
          </div>
          <div className="hq-menu-section">
            <h3>Services</h3>
            <ul>
              <li><Link to="/services" onClick={closeMenu}>Services</Link></li>
              <li><Link to="/maintenance" onClick={closeMenu}>Maintenance</Link></li>
              <li><Link to="/expeditions" onClick={closeMenu}>Expeditions</Link></li>
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
// COMPONENT: Reveal Animation Wrapper
// ============================================================================
function Reveal({ children, delay = 0, direction = 'up', duration = 0.8 }) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.1 });

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
      transition={{ duration, delay, ease: [0.16, 1, 0.3, 1] }}
    >
      {children}
    </motion.div>
  );
}

// ============================================================================
// COMPONENT: AnimatedNumber
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
// DATA
// ============================================================================

const r88Specs = [
  { label: 'Engine', value: 'Safran Arriel 2W', icon: 'fa-cog' },
  { label: 'Power Class', value: '950 SHP', icon: 'fa-bolt' },
  { label: 'Seating', value: '10 Total', icon: 'fa-users' },
  { label: 'Range', value: '350+ nm', icon: 'fa-route' },
  { label: 'Endurance', value: '3.5+ hrs', icon: 'fa-clock' },
  { label: 'Cabin Volume', value: '~275 cu ft', icon: 'fa-cube' },
  { label: 'Internal Payload', value: '2,800 lbs', icon: 'fa-weight-hanging' },
  { label: 'Starting Price', value: '$3.3M', icon: 'fa-tag' },
];

const developmentTimeline = [
  {
    year: 'MAR 2025',
    title: 'Official Announcement',
    description: 'Robinson unveils the R88 at Verticon - their first new helicopter model in 15 years.',
    status: 'completed'
  },
  {
    year: '2025-26',
    title: 'Development & Testing',
    description: 'Continued engineering development, systems integration, and ground testing phases.',
    status: 'active',
    videoId: 'XR7PcQyUIdE'
  },
  {
    year: 'LATE 2026',
    title: 'Ground Runs Expected',
    description: 'First ground run tests of the complete aircraft with the Safran Arriel 2W engine.',
    status: 'upcoming'
  },
  {
    year: 'POST 2026',
    title: 'First Flight',
    description: 'The R88 is expected to take to the skies shortly after successful ground runs.',
    status: 'upcoming'
  },
  {
    year: 'TBD',
    title: 'Certification & Deliveries',
    description: 'FAA certification process followed by first customer deliveries worldwide.',
    status: 'upcoming'
  },
];

const avionicsFeatures = [
  {
    title: 'Garmin G500H TXi Displays',
    description: 'State-of-the-art primary flight displays providing pilots with comprehensive flight data, navigation, and situational awareness in a modern glass cockpit environment.',
    icon: 'fa-desktop',
  },
  {
    title: 'GTN Touchscreen Navigators',
    description: 'Intuitive touchscreen navigation system offering GPS, moving maps, flight planning, and database-driven procedures for streamlined cockpit operations.',
    icon: 'fa-map-marked-alt',
  },
  {
    title: 'Conventional Dual Controls',
    description: 'Unlike the teetering bar design of the R22/R44/R66, the R88 features conventional dual pilot controls for enhanced training and multi-pilot operations.',
    icon: 'fa-sliders-h',
  },
  {
    title: 'Modern Systems Integration',
    description: 'Fully integrated avionics architecture connecting engine monitoring, autopilot interfaces, and communication systems for reduced pilot workload.',
    icon: 'fa-microchip',
  },
];

const r88StandardFeatures = [
  'Garmin G500H TXi Flight Display',
  'GTN Touchscreen Navigator',
  'Conventional Dual Pilot Controls',
  'Integrated Engine Monitoring',
  'Autopilot Interface',
  'Moving-Map Navigation',
  'Database-Driven Flight Planning',
  'Communication Systems Integration',
];

const engineFeatures = [
  {
    title: 'Strategic Partnership',
    description: 'Robinson\'s first major engine partnership outside Lycoming/Rolls-Royce signals a new era of capability and market positioning.',
    stat: '1st',
    statLabel: 'Safran Partnership',
  },
  {
    title: 'Proven Powerplant',
    description: 'The Safran Arriel 2W is part of the legendary Arriel family - one of the most successful turboshaft engines in helicopter aviation history.',
    stat: '30M+',
    statLabel: 'Fleet Flight Hours',
  },
  {
    title: '950 SHP Class',
    description: 'Delivering substantial power in the 950 shaft horsepower class, enabling the R88 to perform utility missions with full passenger loads.',
    stat: '950',
    statLabel: 'SHP Class',
  },
  {
    title: 'Global Support Network',
    description: 'Safran Helicopter Engines provides worldwide support with an extensive network of service centers and parts availability.',
    stat: '270+',
    statLabel: 'Service Centers',
  },
];

const heroStats = [
  { value: '10', label: 'SEATS' },
  { value: '950', label: 'SHP' },
  { value: '350+', label: 'NM RANGE' },
];

// ============================================================================
// SECTION 1: Hero - Coming Soon Announcement Style
// ============================================================================
function R88Hero() {
  const heroRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ['start start', 'end start'],
  });

  const heroOpacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);
  const heroScale = useTransform(scrollYProgress, [0, 0.5], [1, 0.95]);
  const heroY = useTransform(scrollYProgress, [0, 0.5], [0, 100]);

  return (
    <section ref={heroRef} className="r88-hero">
      <div className="r88-hero__bg">
        <div className="r88-hero__gradient" />
        <div className="r88-hero__grid-overlay" />
      </div>

      <motion.div
        className="r88-hero__content"
        style={{ opacity: heroOpacity, scale: heroScale, y: heroY }}
      >
        <motion.span
          className="r88-hero__label"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          ROBINSON HELICOPTER COMPANY
        </motion.span>

        <motion.div
          className="r88-hero__coming-soon"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.8 }}
        >
          <span className="r88-hero__coming-text">COMING SOON</span>
        </motion.div>

        <div className="r88-hero__headline">
          {['R', '8', '8'].map((letter, i) => (
            <motion.span
              key={i}
              className="r88-hero__letter"
              initial={{ opacity: 0, y: 60, rotateX: -45 }}
              animate={{ opacity: 1, y: 0, rotateX: 0 }}
              transition={{
                duration: 0.8,
                delay: 0.6 + i * 0.15,
                ease: [0.16, 1, 0.3, 1]
              }}
            >
              {letter}
            </motion.span>
          ))}
        </div>

        <motion.span
          className="r88-hero__subtitle"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.1 }}
        >
          THE FUTURE OF UTILITY AVIATION
        </motion.span>

        <motion.div
          className="r88-hero__divider"
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ duration: 0.8, delay: 1.3 }}
        />

        <motion.p
          className="r88-hero__tagline"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.5 }}
        >
          Robinson's first new helicopter in 15 years. Eight passengers.
          Safran turbine power. Clean-sheet design.
        </motion.p>

        <motion.div
          className="r88-hero__badges"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.7 }}
        >
          {heroStats.map((stat, i) => (
            <React.Fragment key={i}>
              {i > 0 && <div className="r88-hero__badge-divider" />}
              <div className="r88-hero__badge">
                <span className="r88-hero__badge-value">{stat.value}</span>
                <span className="r88-hero__badge-label">{stat.label}</span>
              </div>
            </React.Fragment>
          ))}
        </motion.div>

      </motion.div>
    </section>
  );
}

// ============================================================================
// SECTION 1B: Highlights - Sticky "At a glance" band
// ============================================================================
function R88Highlights() {
  const ref = useRef(null);
  const [blurPx, setBlurPx] = useState(0);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const update = () => {
      const next = el.nextElementSibling;
      if (!next) return;
      const rect = el.getBoundingClientRect();
      const nextRect = next.getBoundingClientRect();
      const height = rect.height;
      if (height <= 0) return;
      const progress = Math.max(0, Math.min(1, (height - nextRect.top) / height));
      setBlurPx(progress * 16);
    };

    update();
    window.addEventListener('scroll', update, { passive: true });
    window.addEventListener('resize', update);
    return () => {
      window.removeEventListener('scroll', update);
      window.removeEventListener('resize', update);
    };
  }, []);

  return (
    <section
      ref={ref}
      className="r88-highlights"
      style={{ filter: `blur(${blurPx}px)`, WebkitFilter: `blur(${blurPx}px)` }}
    >
      <div className="r88-highlights__container">
        <Reveal>
          <div className="r88-highlights__header">
            <span className="r88-pre-text">AT A GLANCE</span>
            <h2 className="r88-highlights__headline">
              <span className="r88-text--dark">Taking a look</span>{' '}
              <span className="r88-text--mid">at the R88</span>
            </h2>
          </div>
        </Reveal>
        <Reveal delay={0.1} direction="right">
          <div className="r88-highlights__image">
            <img
              src="/assets/images/new-aircraft/r88/r88-jellybean-left.png"
              alt="Robinson R88 front-quarter exterior view"
              loading="lazy"
            />
          </div>
        </Reveal>
      </div>
    </section>
  );
}

// ============================================================================
// SECTION 2: Introduction - Robinson's Bold New Chapter
// ============================================================================
function R88Introduction() {
  return (
    <section className="r88-intro">
      <div className="r88-intro__container">
        <div className="r88-intro__content">
          <div className="r88-intro__top">
            <Reveal>
              <span className="r88-pre-text">A NEW ERA</span>
            </Reveal>
            <Reveal delay={0.1}>
              <h2 className="r88-intro__headline">
                <span className="r88-text--dark">Robinson's</span>{' '}
                <span className="r88-text--mid">Bold</span>{' '}
                <span className="r88-text--light">New Chapter</span>
              </h2>
            </Reveal>
            <Reveal delay={0.2}>
              <p className="r88-intro__text r88-intro__text--lead">
                After 15 years since the revolutionary R66, Robinson Helicopter Company
                is ready to redefine the utility helicopter market with an entirely new,
                clean-sheet design.
              </p>
            </Reveal>
          </div>
          <div className="r88-intro__bottom">
            <Reveal delay={0.3}>
              <p className="r88-intro__text">
                The R88 represents Robinson's ambitious vision for the future: a dual-pilot,
                8-passenger helicopter designed as the next-generation "pickup truck" for
                utility operations worldwide. With a spacious 275 cubic foot cabin and
                2,800 lb internal payload capacity, the R88 brings Robinson reliability
                to a new class of missions.
              </p>
            </Reveal>
            <Reveal delay={0.4}>
              <p className="r88-intro__text r88-intro__text--announced">
                Announced in March 2025 at Verticon to immediate acclaim, the R88 has
                already secured over 150 orders worldwide - a testament to the industry's
                confidence in Robinson's newest creation.
              </p>
            </Reveal>
          </div>
        </div>
        <div className="r88-intro__visual-col">
          <Reveal delay={0.5} direction="right">
            <div className="r88-intro__visual">
              <div className="r88-intro__orders">
                <span className="r88-intro__orders-number">
                  <AnimatedNumber value={150} suffix="+" />
                </span>
                <span className="r88-intro__orders-label">Orders Secured Worldwide</span>
              </div>
              <div className="r88-intro__milestone">
                <div className="r88-intro__milestone-item">
                  <i className="fas fa-check-circle"></i>
                  <span>First new model in 15 years</span>
                </div>
                <div className="r88-intro__milestone-item">
                  <i className="fas fa-check-circle"></i>
                  <span>Clean-sheet design</span>
                </div>
                <div className="r88-intro__milestone-item">
                  <i className="fas fa-check-circle"></i>
                  <span>Safran engine partnership</span>
                </div>
                <div className="r88-intro__milestone-item">
                  <i className="fas fa-check-circle"></i>
                  <span>Utility sector focus</span>
                </div>
              </div>
            </div>
          </Reveal>
          <div className="r88-timeline__track">
            <div className="r88-timeline__line">
              <div className="r88-timeline__line-progress" />
            </div>
            {developmentTimeline.map((event, i) => (
              <Reveal key={i} delay={i * 0.15}>
                <motion.div
                  layout
                  transition={{ layout: { duration: 0.6, ease: [0.22, 1, 0.36, 1] } }}
                  className={`r88-timeline__item r88-timeline__item--${event.status}`}
                >
                  <motion.div layout className="r88-timeline__marker">
                    {event.status === 'completed' && <i className="fas fa-check"></i>}
                    {event.status === 'active' && <div className="r88-timeline__pulse" />}
                    {event.status === 'upcoming' && <div className="r88-timeline__dot" />}
                  </motion.div>
                  <motion.div layout="position" className="r88-timeline__content">
                    <span className="r88-timeline__year">{event.year}</span>
                    <div className="r88-timeline__text">
                      <h4>{event.title}</h4>
                      <p>{event.description}</p>
                    </div>
                    {event.videoId && (
                      <TimelineVideoFacade
                        videoId={event.videoId}
                        label={event.videoLabel}
                        title={event.title}
                      />
                    )}
                  </motion.div>
                </motion.div>
              </Reveal>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

// ============================================================================
// SECTION 3: Technical Specifications
// ============================================================================
function R88Specifications() {
  // Duplicate the card set so the marquee animation loops seamlessly —
  // the keyframes translate by -50%, landing exactly on the start of the
  // second copy, which visually continues the first.
  const loopedSpecs = [...r88Specs, ...r88Specs];

  return (
    <section className="r88-specs">
      <div className="r88-specs__scroller">
        <div className="r88-specs__grid">
          {loopedSpecs.map((spec, i) => (
            <div
              key={i}
              className="r88-specs__item"
              aria-hidden={i >= r88Specs.length ? 'true' : undefined}
            >
              <div className="r88-specs__icon">
                <i className={`fas ${spec.icon}`}></i>
              </div>
              <div className="r88-specs__data">
                <span className="r88-specs__label">{spec.label}</span>
                <span className="r88-specs__value">{spec.value}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ============================================================================
// SECTION 4: Engine Partnership - Safran Arriel 2W
// ============================================================================
function R88Engine() {
  const [enginePage, setEnginePage] = useState(0);
  const engineGridRef = useRef(null);

  return (
    <section className="r88-engine">
      <div className="r88-engine__container">
        <div className="r88-engine__layout">
          {/* Left column top — header + lead */}
          <div className="r88-engine__text-top">
            <Reveal>
              <div className="r88-section-header">
                <span className="r88-pre-text">POWERTRAIN</span>
                <h2>
                  <span className="r88-text--dark">Safran</span>{' '}
                  <span className="r88-text--mid">Partnership</span>
                </h2>
              </div>
            </Reveal>

            <Reveal delay={0.2}>
              <p className="r88-engine__lead">
                The R88 marks Robinson's historic first partnership with Safran Helicopter
                Engines, selecting the proven Arriel 2W turboshaft to power their most
                ambitious helicopter yet.
              </p>
              <img
                className="r88-engine__safran-logo"
                src="/assets/images/logos/partners/safran-logo.png"
                alt="Safran"
                loading="lazy"
              />
            </Reveal>
          </div>

          {/* Left column bottom — body copy */}
          <div className="r88-engine__text-bottom">
            <Reveal delay={0.2}>
              <div className="r88-engine__intro">
                <p>
                  The Safran Arriel family represents one of the most successful turboshaft
                  engine programs in aviation history, with over 66 million flight hours
                  accumulated across the global fleet. This partnership extends Robinson's
                  reliability and affordability heritage to their most ambitious airframe yet —
                  delivering turbine capability at an operating cost that undercuts comparable
                  turbine twins.
                </p>
              </div>
            </Reveal>
          </div>

          {/* Right column — cards + badge */}
          <div className="r88-engine__right">
            <div className="r88-engine__carousel">
              <button
                type="button"
                className="r88-engine__nav r88-engine__nav--prev"
                aria-label="Previous"
                onClick={() => {
                  const el = engineGridRef.current;
                  if (el) el.scrollBy({ left: -el.clientWidth, behavior: 'smooth' });
                }}
              >
                <i className="fas fa-chevron-left"></i>
              </button>
              <div
                className="r88-engine__grid"
                ref={engineGridRef}
                onScroll={() => {
                  const el = engineGridRef.current;
                  if (el) setEnginePage(Math.round(el.scrollLeft / el.clientWidth));
                }}
              >
                {engineFeatures.map((feature, i) => (
                  <div key={i} className="r88-engine__card">
                    <div className="r88-engine__stat">
                      <span className="r88-engine__stat-value">{feature.stat}</span>
                      <span className="r88-engine__stat-label">{feature.statLabel}</span>
                    </div>
                    <h3>{feature.title}</h3>
                    <p>{feature.description}</p>
                  </div>
                ))}
              </div>
              <button
                type="button"
                className="r88-engine__nav r88-engine__nav--next"
                aria-label="Next"
                onClick={() => {
                  const el = engineGridRef.current;
                  if (el) el.scrollBy({ left: el.clientWidth, behavior: 'smooth' });
                }}
              >
                <i className="fas fa-chevron-right"></i>
              </button>
            </div>
            <div className="r88-engine__dots">
              {engineFeatures.map((_, i) => (
                <span
                  key={i}
                  className={`r88-engine__dot${enginePage === i ? ' r88-engine__dot--active' : ''}`}
                  onClick={() => engineGridRef.current?.scrollTo({ left: i * engineGridRef.current.clientWidth, behavior: 'smooth' })}
                />
              ))}
            </div>

            <div className="r88-engine__serenity-slot">
              <Reveal delay={0.3}>
                <div className="r88-engine__serenity">
                  <div className="r88-engine__serenity-header">
                    <span className="r88-pre-text">INCLUDED WITH EVERY R88</span>
                    <h3>Arriel 2W <span className="r88-engine__serenity-accent">Serenity Support</span> Package</h3>
                  </div>
                  <p className="r88-engine__serenity-lead">
                    Robinson is the only helicopter manufacturer to bundle Safran's Serenity
                    engine support standard with every aircraft — a first-of-its-kind offering
                    in commercial rotorcraft.
                  </p>
                  <ul className="r88-engine__serenity-list">
                    <li><i className="fas fa-calendar-check"></i><span>5 years or 2,000 flight hours of coverage (whichever comes first)</span></li>
                    <li><i className="fas fa-wrench"></i><span>Level 3 &amp; 4 unscheduled maintenance included</span></li>
                    <li><i className="fas fa-bolt"></i><span>Aircraft on Ground (AOG) incident service</span></li>
                  </ul>
                </div>
              </Reveal>
            </div>

          </div>

          {/* Partner badge — own grid item for mobile reordering */}
          <div className="r88-engine__partner-col">
            <Reveal delay={0.6}>
              <div className="r88-engine__partner">
                <div className="r88-engine__partner-badge">
                  <span className="r88-engine__partner-text">Official Engine Partner</span>
                  <div className="r88-engine__partner-logos">
                    <span className="r88-engine__partner-logo">SAFRAN</span>
                    <span className="r88-engine__partner-x">+</span>
                    <span className="r88-engine__partner-logo">ROBINSON</span>
                  </div>
                </div>
              </div>
            </Reveal>
          </div>
        </div>
      </div>
    </section>
  );
}

// ============================================================================
// SECTION 5: Avionics - Garmin Glass Cockpit
// ============================================================================
function R88Avionics() {
  return (
    <section className="r88-avionics">
      <div className="r88-avionics__container">
        <div className="r88-avionics__content">
          <div className="r88-avionics__left">
            <Reveal>
              <div className="r88-section-header">
                <span className="r88-pre-text">R88 FLIGHT DECK</span>
                <h2>
                  <span className="r88-text--dark">Garmin</span>{' '}
                  <span className="r88-text--mid">Glass</span>{' '}
                  <span className="r88-text--light">Cockpit</span>
                </h2>
              </div>
            </Reveal>
            <Reveal delay={0.1}>
              <p className="r88-avionics__intro">
                The R88 pairs a full Garmin glass flight deck with conventional dual
                pilot controls and a fully integrated avionics architecture — engine
                monitoring, autopilot interfaces and communication systems all routed
                through a single modern cockpit designed for commercial and multi-pilot
                operations from day one.
              </p>
            </Reveal>
            <Reveal delay={0.2}>
              <div className="r88-avionics__image">
                <img
                  src="/assets/images/new-aircraft/r88/rhc-r88-glass-flight-displays-right-side-cyclic-13216.jpg"
                  alt="R88 Garmin glass flight deck"
                />
                <div className="r88-avionics__image-badge">
                  <span className="r88-avionics__image-badge-label">GARMIN</span>
                  <span className="r88-avionics__image-badge-text">Integrated Avionics</span>
                </div>
              </div>
            </Reveal>
          </div>

          <div className="r88-avionics__features">
            {avionicsFeatures.map((feature, i) => (
              <Reveal key={i} delay={0.1 + i * 0.1}>
                <motion.div
                  className="r88-avionics__feature"
                  whileHover={{ x: 8 }}
                  transition={{ duration: 0.2 }}
                >
                  <div className="r88-avionics__feature-icon">
                    <i className={`fas ${feature.icon}`}></i>
                  </div>
                  <div className="r88-avionics__feature-content">
                    <h4>{feature.title}</h4>
                    <p>{feature.description}</p>
                  </div>
                </motion.div>
              </Reveal>
            ))}
          </div>
        </div>

        <Reveal delay={0.5}>
          <div className="r88-avionics__standard">
            <h3>R88 Standard Flight Deck Equipment</h3>
            <div className="r88-avionics__standard-grid">
              {r88StandardFeatures.map((feature, i) => (
                <div key={i} className="r88-avionics__standard-item">
                  <i className="fas fa-check"></i>
                  <span>{feature}</span>
                </div>
              ))}
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

// ============================================================================
// SECTION 5B: Gallery - R88 Up Close
// ============================================================================
const galleryImages = [
  { src: '/assets/images/new-aircraft/r88/rhc-r88-3-spotlights-left-side-atmospheric-effect-21794_2.jpg', alt: 'R88 dramatic side view with spotlights', label: 'Exterior' },
  { src: '/assets/images/new-aircraft/r88/rhc-r88-glass-flight-displays-right-side-cyclic-13216.jpg', alt: 'R88 Garmin glass cockpit displays', label: 'Glass Cockpit' },
  { src: '/assets/images/new-aircraft/r88/rhc-r88-seat-logo-emboss-angle-shot-13559.jpg', alt: 'R88 embossed seat logo detail', label: 'Seat Detail' },
  { src: '/assets/images/new-aircraft/r88/rhc-r88-2-plus-eight-seats.jpg', alt: 'R88 full cabin with 2+8 seating', label: 'Cabin' },
  { src: '/assets/images/new-aircraft/r88/rhc-r88-left-side-three-quarter-front-view-21797.jpg', alt: 'R88 three-quarter front view', label: 'Front Quarter' },
  { src: '/assets/images/new-aircraft/r88/rhc-r88-rear-cargo-door-open-acute-view-13595.jpg', alt: 'R88 rear cargo door open', label: 'Cargo Door' },
  { src: '/assets/images/new-aircraft/r88/rhc-r88-left-and-right-pilot-seats-13528.jpg', alt: 'R88 pilot seats', label: 'Pilot Seats' },
  { src: '/assets/images/new-aircraft/r88/rhc-r88-atmospheric-effect-front-view-218022.jpg', alt: 'R88 dramatic front view', label: 'Front View' },
  { src: '/assets/images/new-aircraft/r88/rhc-r88-right-side-profile-13579.jpg', alt: 'R88 right-side profile', label: 'Profile' },
  { src: '/assets/images/new-aircraft/r88/rhc-r88-closeup-instrument-panel-14038.jpg', alt: 'R88 instrument panel close-up', label: 'Instruments' },
];

function R88Gallery() {
  const [lightboxIdx, setLightboxIdx] = useState(null);
  const [galleryPage, setGalleryPage] = useState(0);
  const galleryScrollRef = useRef(null);
  const pageImages = usePageImages('r88');
  const cmsGallery = (pageImages['r88-gallery'] ?? SECTION_MAP['r88-gallery'].images).map((img, i) => ({
    ...galleryImages[i],
    src: img.url,
    alt: img.alt,
  }));

  // Editorial mix: strict checkerboard across 4 columns.
  // Row 1: img, spec, img, spec
  // Row 2: spec, img, spec, img
  // Row 3: img, spec, img, spec
  // Row 4: spec, img, spec, img
  // 16 tiles total = 8 images + 8 specs. Images keep their original index
  // so the lightbox can map back to cmsGallery.
  const editorialItems = (() => {
    const items = [];
    let imgIdx = 0;
    let specIdx = 0;
    const totalTiles = 16;
    const cols = 4;
    for (let tile = 0; tile < totalTiles; tile++) {
      const row = Math.floor(tile / cols);
      const col = tile % cols;
      // Even rows start with img, odd rows start with spec.
      const isImg = (row + col) % 2 === 0;
      if (isImg && cmsGallery[imgIdx]) {
        items.push({ kind: 'img', ...cmsGallery[imgIdx], origIdx: imgIdx });
        imgIdx++;
      } else if (!isImg && r88Specs[specIdx]) {
        items.push({ kind: 'spec', ...r88Specs[specIdx] });
        specIdx++;
      }
    }
    return items;
  })();

  const numGalleryPages = Math.ceil(editorialItems.length / 6);

  const handleGalleryScroll = () => {
    const el = galleryScrollRef.current;
    if (!el) return;
    const maxScroll = el.scrollWidth - el.clientWidth;
    if (maxScroll <= 0) return;
    setGalleryPage(Math.round((el.scrollLeft / maxScroll) * (numGalleryPages - 1)));
  };

  return (
    <section className="r88-gallery" data-cms-section="r88-gallery">
      <div className="r88-gallery__container">
        <div className="r88-gallery__scroll" ref={galleryScrollRef} onScroll={handleGalleryScroll}>
        <div className="r88-gallery__grid">
          {editorialItems.map((item, i) => {
            if (item.kind === 'img') {
              return (
                <Reveal key={`img-${i}`} delay={i * 0.03}>
                  <motion.div
                    className="r88-gallery__item"
                    whileHover={{ scale: 1.02 }}
                    transition={{ duration: 0.3 }}
                    onClick={() => setLightboxIdx(item.origIdx)}
                  >
                    <img src={item.src} alt={item.alt} loading="lazy" />
                    <div className="r88-gallery__overlay">
                      <span className="r88-gallery__label">{item.label}</span>
                    </div>
                  </motion.div>
                </Reveal>
              );
            }
            return (
              <Reveal key={`spec-${i}`} delay={i * 0.03}>
                <div className="r88-gallery__item r88-gallery__item--spec">
                  <div className="r88-gallery__spec-icon">
                    <i className={`fas ${item.icon}`}></i>
                  </div>
                  <div className="r88-gallery__spec-body">
                    <span className="r88-gallery__spec-label">{item.label}</span>
                    <span className="r88-gallery__spec-value">{item.value}</span>
                  </div>
                </div>
              </Reveal>
            );
          })}
        </div>
        </div>
      </div>

      {/* Lightbox */}
      <AnimatePresence>
        {lightboxIdx !== null && (
          <motion.div
            className="r88-gallery__lightbox"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setLightboxIdx(null)}
          >
            <motion.img
              key={lightboxIdx}
              src={cmsGallery[lightboxIdx].src}
              alt={cmsGallery[lightboxIdx].alt}
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ duration: 0.3 }}
            />
            <button
              className="r88-gallery__lightbox-close"
              onClick={() => setLightboxIdx(null)}
            >
              <i className="fas fa-times"></i>
            </button>
            {lightboxIdx > 0 && (
              <button
                className="r88-gallery__lightbox-nav r88-gallery__lightbox-nav--prev"
                onClick={(e) => { e.stopPropagation(); setLightboxIdx(lightboxIdx - 1); }}
              >
                <i className="fas fa-chevron-left"></i>
              </button>
            )}
            {lightboxIdx < cmsGallery.length - 1 && (
              <button
                className="r88-gallery__lightbox-nav r88-gallery__lightbox-nav--next"
                onClick={(e) => { e.stopPropagation(); setLightboxIdx(lightboxIdx + 1); }}
              >
                <i className="fas fa-chevron-right"></i>
              </button>
            )}
            <span className="r88-gallery__lightbox-count">
              {lightboxIdx + 1} / {cmsGallery.length}
            </span>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}

// ============================================================================
// SECTION 6: Development Timeline
// ============================================================================

// Lightweight click-to-play YouTube facade: poster image first, swap to iframe
// on user interaction. No YouTube JS SDK, no iframe until requested.
function TimelineVideoFacade({ videoId, label, title, onPlay }) {
  const [playing, setPlaying] = useState(false);
  const frameRef = useRef(null);
  const iframeRef = useRef(null);
  const poster = `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`;
  // enablejsapi=1 lets us send `postMessage` commands (e.g. pauseVideo)
  const embedSrc = `https://www.youtube-nocookie.com/embed/${videoId}?autoplay=1&controls=0&modestbranding=1&rel=0&showinfo=0&iv_load_policy=3&disablekb=1&fs=0&cc_load_policy=0&playsinline=1&enablejsapi=1`;

  const handlePlay = () => {
    setPlaying(true);
    if (onPlay) onPlay();
  };

  const handleClose = () => {
    if (iframeRef.current && iframeRef.current.contentWindow) {
      iframeRef.current.contentWindow.postMessage(
        '{"event":"command","func":"pauseVideo","args":""}',
        '*'
      );
    }
    setPlaying(false);
  };

  // Close the lightbox on Escape for keyboard users.
  useEffect(() => {
    if (!playing) return;
    const onKey = (e) => { if (e.key === 'Escape') handleClose(); };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [playing]);

  // Listen to YouTube's postMessage state events so we can auto-close the
  // lightbox the moment the video ends — this prevents YouTube's end-screen
  // overlay ("Watch again" / suggested videos) from ever appearing.
  useEffect(() => {
    if (!playing) return;
    const registerListener = () => {
      const cw = iframeRef.current && iframeRef.current.contentWindow;
      if (!cw) return;
      // Subscribe to the player's state change events.
      cw.postMessage(
        '{"event":"listening","id":"player","channel":"widget"}',
        '*'
      );
      cw.postMessage(
        JSON.stringify({ event: 'command', func: 'addEventListener', args: ['onStateChange'] }),
        '*'
      );
    };
    const onMessage = (e) => {
      if (typeof e.origin === 'string' && e.origin.indexOf('youtube') === -1) return;
      let data = e.data;
      if (typeof data === 'string') {
        try { data = JSON.parse(data); } catch (_) { return; }
      }
      if (!data) return;
      // Retry registration once the player reports ready.
      if (data.event === 'onReady' || data.event === 'initialDelivery') {
        registerListener();
      }
      // state 0 = ENDED
      if (
        (data.event === 'onStateChange' || data.event === 'infoDelivery') &&
        (data.info === 0 || (data.info && data.info.playerState === 0))
      ) {
        handleClose();
      }
    };
    window.addEventListener('message', onMessage);
    // Fire registration a few times in case the iframe isn't ready yet.
    const t1 = setTimeout(registerListener, 400);
    const t2 = setTimeout(registerListener, 1200);
    const t3 = setTimeout(registerListener, 2500);
    return () => {
      window.removeEventListener('message', onMessage);
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
    };
  }, [playing]);

  const transition = { duration: 0.55, ease: [0.22, 1, 0.36, 1] };
  const layoutId = `r88-video-${videoId}`;

  return (
    <div className="r88-timeline__video">
      {!playing && (
        <motion.div
          layoutId={layoutId}
          transition={transition}
          className="r88-timeline__video-frame"
        >
          <button
            type="button"
            className="r88-timeline__video-poster"
            onClick={handlePlay}
            aria-label={`Play ${title} development film`}
            style={{ backgroundImage: `url(${poster})` }}
          >
            <span className="r88-timeline__video-scrim" aria-hidden="true" />
            <span className="r88-timeline__video-play" aria-hidden="true" />
          </button>
        </motion.div>
      )}
      {label && <span className="r88-timeline__video-label">{label}</span>}

      <AnimatePresence>
        {playing && (
          <motion.div
            key="backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="r88-timeline__video-backdrop"
            onClick={handleClose}
            aria-hidden="true"
          />
        )}
        {playing && (
          <motion.div
            key="lightbox"
            layoutId={layoutId}
            transition={transition}
            className="r88-timeline__video-lightbox"
          >
            <div className="r88-timeline__video-frame r88-timeline__video-frame--lightbox">
              <iframe
                ref={iframeRef}
                className="r88-timeline__video-iframe"
                src={embedSrc}
                title={`${title} — development footage`}
                loading="lazy"
                tabIndex={-1}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                allowFullScreen
              />
              {/* Transparent mask: swallows hover/click so YouTube never
                  surfaces its controls, title bar, or end-screen overlays. */}
              <div
                className="r88-timeline__video-mask"
                aria-hidden="true"
              />
            </div>
            <button
              type="button"
              className="r88-timeline__video-close"
              onClick={handleClose}
              aria-label="Close video"
            >
              ×
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function R88Timeline() {
  const [cinema, setCinema] = useState(false);
  return (
    <section className={`r88-timeline${cinema ? ' r88-timeline--cinema' : ''}`}>
      <div className="r88-timeline__container">
        <Reveal>
          <div className="r88-section-header r88-section-header--center">
            <span className="r88-pre-text">DEVELOPMENT ROADMAP</span>
            <h2>
              <span className="r88-text--dark">From Announcement</span>{' '}
              <span className="r88-text--mid">to First Flight</span>
            </h2>
          </div>
        </Reveal>

        <div className="r88-timeline__track">
          <div className="r88-timeline__line">
            <div className="r88-timeline__line-progress" />
          </div>

          {developmentTimeline.map((event, i) => (
            <Reveal key={i} delay={i * 0.15}>
              <motion.div
                layout
                transition={{ layout: { duration: 0.6, ease: [0.22, 1, 0.36, 1] } }}
                className={`r88-timeline__item r88-timeline__item--${event.status}`}
              >
                <motion.div layout className="r88-timeline__marker">
                  {event.status === 'completed' && <i className="fas fa-check"></i>}
                  {event.status === 'active' && <div className="r88-timeline__pulse" />}
                  {event.status === 'upcoming' && <div className="r88-timeline__dot" />}
                </motion.div>
                <motion.div layout="position" className="r88-timeline__content">
                  <span className="r88-timeline__year">{event.year}</span>
                  <div className="r88-timeline__text">
                    <h4>{event.title}</h4>
                    <p>{event.description}</p>
                  </div>
                  {event.videoId && (
                    <TimelineVideoFacade
                      videoId={event.videoId}
                      label={event.videoLabel}
                      title={event.title}
                      onPlay={() => setCinema(true)}
                    />
                  )}
                </motion.div>
              </motion.div>
            </Reveal>
          ))}
        </div>

        <Reveal delay={0.8}>
          <div className="r88-timeline__status">
            <div className="r88-timeline__status-item r88-timeline__status-item--active">
              <span className="r88-timeline__status-dot" />
              <span>Currently in Development</span>
            </div>
            <div className="r88-timeline__status-note">
              Ground runs expected late 2026, first flight to follow shortly after
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

// ============================================================================
// COMPONENT: Custom Select
// ============================================================================
function CustomSelect({ options, value, onChange }) {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);
  const selected = options.find(o => o.value === value) || options[0];

  useEffect(() => {
    const handler = (e) => { if (ref.current && !ref.current.contains(e.target)) setOpen(false); };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  return (
    <div className="r88-select" ref={ref}>
      <button type="button" className="r88-select__trigger" onClick={() => setOpen(o => !o)}>
        <span>{selected.label}</span>
        <svg className={`r88-select__chevron${open ? ' r88-select__chevron--open' : ''}`} width="12" height="8" viewBox="0 0 12 8" fill="none">
          <path d="M1 1l5 5 5-5" stroke="rgba(255,255,255,0.6)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      </button>
      {open && (
        <ul className="r88-select__menu">
          {options.map(o => (
            <li
              key={o.value}
              className={`r88-select__option${o.value === value ? ' r88-select__option--active' : ''}`}
              onClick={() => { onChange(o.value); setOpen(false); }}
            >
              {o.label}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

// ============================================================================
// SECTION 7: Reserve/Contact CTA
// ============================================================================
const ctaContent = {
  commercial: {
    preText: 'REDEFINING COST-PER-HOUR',
    preTextShort: 'BETTER ECONOMICS',
    headingDark: 'Understand How',
    headingLight: 'the R88 Fits',
    lead: "150+ operators have already registered. The R88's lower operating cost per seat means that if your competitors adopt it before you, they can undercut your rates, win more contracts, and scale faster — while you're still flying older, more expensive iron.",
    benefits: [
      { icon: 'fa-chart-line', text: 'Understand How the R88 Fits Your Operation' },
      { icon: 'fa-users',      text: 'Learn How Peer Operators Are Deploying' },
      { icon: 'fa-headset',    text: 'Direct Consultation With Our Sales Team' },
    ],
    formTitle: 'Express Your Interest',
    selectDefault: 'fleet',
  },
  private: {
    preText: 'A NEW STANDARD IN PRIVATE ROTORCRAFT',
    preTextShort: 'THE NEW STANDARD',
    headingDark: 'Own the',
    headingLight: 'Unfair Advantage',
    lead: "Ten seats, turbine power, 350+ nm range. The R88 does what no Robinson has ever done — and at a fraction of what comparable turbine aircraft cost to own and operate. Reserve your position before deliveries fill.",
    benefits: [
      { icon: 'fa-shield-alt', text: 'Reserve Your Delivery Position Now' },
      { icon: 'fa-tag',        text: 'Lock In Pre-Production Pricing' },
      { icon: 'fa-headset',    text: 'Dedicated Private Sales Adviser' },
    ],
    formTitle: 'Reserve Your Position',
    selectDefault: 'purchase',
  },
};

function R88CTA() {
  const [useType, setUseType] = useState('commercial');
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    interest: 'fleet',
    message: ''
  });
  const [formStatus, setFormStatus] = useState('idle');

  const content = ctaContent[useType];

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormStatus('sending');
    const interestLabels = {
      fleet: 'Fleet Operator',
      purchase: 'Interested in Purchasing',
      information: 'Requesting Information',
      other: 'Other Inquiry',
    };
    const messageParts = [];
    const interestLabel = interestLabels[formData.interest] || formData.interest;
    if (interestLabel) messageParts.push(`Interest: ${interestLabel}`);
    if (formData.message) messageParts.push(formData.message);
    try {
      const res = await fetch('/api/leads', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          phone: formData.phone,
          subject: `R88 Register — ${useType === 'commercial' ? 'Commercial' : 'Private'} Use`,
          message: messageParts.join('\n'),
          source: 'R88 Register',
        }),
      });
      setFormStatus(res.ok ? 'success' : 'error');
    } catch {
      setFormStatus('error');
    }
  };

  const handleToggle = (type) => {
    setUseType(type);
    setFormData(prev => ({ ...prev, interest: ctaContent[type].selectDefault }));
  };

  return (
    <section id="register" className="r88-cta">

      <div className="r88-cta__toggle">
        <button
          className={`r88-cta__toggle-btn${useType === 'commercial' ? ' r88-cta__toggle-btn--active' : ''}`}
          onClick={() => handleToggle('commercial')}
        >
          Commercial Use
        </button>
        <button
          className={`r88-cta__toggle-btn${useType === 'private' ? ' r88-cta__toggle-btn--active' : ''}`}
          onClick={() => handleToggle('private')}
        >
          Private Use
        </button>
      </div>

      <div className="r88-cta__container">
        <div className="r88-cta__content">
          <Reveal>
            <div className="r88-section-header">
              <span className="r88-pre-text r88-pre-text--light">
                {content.preTextShort ? (
                  <>
                    <span className="r88-pre-text__full">{content.preText}</span>
                    <span className="r88-pre-text__short">{content.preTextShort}</span>
                  </>
                ) : (
                  content.preText
                )}
              </span>
              <h2>
                <span style={{ color: '#fff' }}>{content.headingDark}</span>{' '}
                <span style={{ color: 'rgba(255,255,255,0.7)' }}>{content.headingLight}</span>
              </h2>
            </div>
          </Reveal>

          <Reveal delay={0.2}>
            <p className="r88-cta__lead">{content.lead}</p>
          </Reveal>

          <Reveal delay={0.3}>
            <div className="r88-cta__benefits-card">
              <div className="r88-cta__benefits">
                {content.benefits.map((b, i) => (
                  <div key={i} className="r88-cta__benefit">
                    <i className={`fas ${b.icon}`}></i>
                    <span>{b.text}</span>
                  </div>
                ))}
              </div>
            </div>
          </Reveal>
        </div>

        <Reveal delay={0.4} direction="right">
          {formStatus === 'success' ? (
            <div className="r88-cta__form r88-cta__success">
              <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/>
                <polyline points="22 4 12 14.01 9 11.01"/>
              </svg>
              <p>Thank you for your interest in the R88! Our team will contact you shortly.</p>
            </div>
          ) : (
          <form className="r88-cta__form" onSubmit={handleSubmit}>
            <h3>{content.formTitle}</h3>
            <div className="r88-cta__form-group">
              <input
                type="text"
                placeholder="Full Name *"
                required
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              />
            </div>
            <div className="r88-cta__form-group">
              <input
                type="email"
                placeholder="Email Address *"
                required
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              />
            </div>
            <div className="r88-cta__form-group">
              <input
                type="tel"
                placeholder="Phone Number"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              />
            </div>
            <div className="r88-cta__form-group">
              <CustomSelect
                value={formData.interest}
                onChange={(val) => setFormData({ ...formData, interest: val })}
                options={useType === 'commercial' ? [
                  { value: 'fleet',       label: 'Fleet Operator' },
                  { value: 'purchase',    label: 'Interested in Purchasing' },
                  { value: 'information', label: 'Requesting Information' },
                  { value: 'other',       label: 'Other Inquiry' },
                ] : [
                  { value: 'purchase',    label: 'Interested in Purchasing' },
                  { value: 'information', label: 'Requesting Information' },
                  { value: 'other',       label: 'Other Inquiry' },
                ]}
              />
            </div>
            <div className="r88-cta__form-group">
              <textarea
                placeholder="Additional Comments"
                rows="3"
                value={formData.message}
                onChange={(e) => setFormData({ ...formData, message: e.target.value })}
              />
            </div>
            {formStatus === 'error' && (
              <p className="r88-cta__error">
                Something went wrong — please try again or email{' '}
                <a href="mailto:sales@hqaviation.com">sales@hqaviation.com</a>
              </p>
            )}
            <button
              type="submit"
              className="r88-btn r88-btn--submit"
              disabled={formStatus === 'sending'}
            >
              {formStatus === 'sending' ? 'Sending…' : 'Submit Interest'}
              <i className="fas fa-paper-plane"></i>
            </button>
          </form>
          )}
        </Reveal>
      </div>

      <Reveal delay={0.6}>
        <div className="r88-cta__contact">
          <div className="r88-cta__contact-inner">
            <div className="r88-cta__contact-item">
              <i className="fas fa-phone"></i>
              <span>+44 1895 833 373</span>
            </div>
            <div className="r88-cta__contact-item">
              <i className="fas fa-envelope"></i>
              <span>sales@hqaviation.com</span>
            </div>
            <div className="r88-cta__contact-item">
              <i className="fas fa-map-marker-alt"></i>
              <span>Denham Aerodrome, UK</span>
            </div>
          </div>
        </div>
      </Reveal>
    </section>
  );
}

// ============================================================================
// STYLES (Inline for page-specific styles)
// ============================================================================
const R88Styles = () => (
  <style>{`
    /* ====================================================================
       R88 PAGE STYLES
       ==================================================================== */

    body { overflow-x: hidden; }

    /* Typography Variables */
    .r88-pre-text {
      display: block;
      font-family: 'Share Tech Mono', monospace;
      font-size: 0.75rem;
      letter-spacing: 0.25em;
      text-transform: uppercase;
      color: #999;
      margin-bottom: 1rem;
    }

    .r88-pre-text--light {
      color: rgba(255, 255, 255, 0.6);
    }

    .r88-pre-text__short {
      display: none;
    }

    @media (max-width: 768px) {
      .r88-pre-text__full {
        display: none;
      }
      .r88-pre-text__short {
        display: inline;
      }
    }

    /* Mobile: horizontal dividers either side of the pretitle (non-hero sections) */
    @media (max-width: 768px) {
      .r88-pre-text {
        display: flex;
        align-items: center;
        justify-content: center;
        gap: 1rem;
        text-align: center;
        margin-bottom: 0.75rem;
        min-width: 0;
      }
      .r88-pre-text::before,
      .r88-pre-text::after {
        content: '';
        flex: 1;
        height: 1px;
        background: #bbb;
        min-width: 20px;
      }
      .r88-pre-text--light::before,
      .r88-pre-text--light::after,
      .r88-section-header--light .r88-pre-text::before,
      .r88-section-header--light .r88-pre-text::after {
        background: rgba(255, 255, 255, 0.35);
      }
      /* Match the clubhouse pretitle → title spacing on mobile */
      .r88-pre-text + h2,
      .r88-intro__top .r88-intro__headline {
        margin-top: 1.5rem;
      }
    }

    .r88-text--dark { color: #1a1a1a; }
    .r88-text--mid { color: #4a4a4a; }
    .r88-text--light { color: #7a7a7a; }

    .r88-section-header {
      margin-bottom: 3rem;
    }

    .r88-section-header--center {
    }

    .r88-section-header--light .r88-pre-text {
      color: rgba(255, 255, 255, 0.6);
    }

    .r88-section-header h2 {
      font-family: 'Space Grotesk', sans-serif;
      font-size: clamp(2rem, 5vw, 3.5rem);
      font-weight: 500;
      line-height: 1.1;
      margin: 0;
    }

    .r88-section-subtext {
      font-family: 'Space Grotesk', sans-serif;
      font-size: 0.95rem;
      color: #7a7a7a;
      margin-top: 1rem;
      font-style: italic;
    }

    /* Buttons */
    .r88-btn {
      display: inline-flex;
      align-items: center;
      gap: 0.75rem;
      padding: 1rem 2rem;
      font-family: 'Space Grotesk', sans-serif;
      font-size: 0.9rem;
      font-weight: 500;
      letter-spacing: 0.05em;
      text-transform: uppercase;
      text-decoration: none;
      border: none;
      cursor: pointer;
      transition: all 0.3s ease;
    }

    .r88-btn--primary {
      background: #1a1a1a;
      color: #fff;
    }

    .r88-btn--primary:hover {
      background: #333;
      color: #fff;
      transform: translateY(-2px);
    }

    .r88-btn--glow {
      background: #1a1a1a;
      color: #fff;
      border: 1px solid rgba(255, 255, 255, 0.2);
      box-shadow: 0 0 30px rgba(255, 255, 255, 0.1);
    }

    .r88-btn--glow:hover {
      background: #fff;
      color: #1a1a1a;
      box-shadow: 0 0 50px rgba(255, 255, 255, 0.3);
      transform: translateY(-2px);
    }

    .r88-btn--submit {
      width: 100%;
      justify-content: center;
      background: #fff;
      color: #1a1a1a;
      padding: 1.25rem 2rem;
    }

    .r88-btn--submit:hover {
      background: #f5f5f5;
      transform: translateY(-2px);
    }

    /* ====================================================================
       HERO SECTION - Coming Soon Announcement Style
       ==================================================================== */
    .r88-hero {
      position: relative;
      height: 100vh;
      min-height: 800px;
      overflow: hidden;
      display: flex;
      align-items: center;
      justify-content: center;
      background: #1a1a1a;
    }

    .r88-hero__bg {
      position: absolute;
      inset: 0;
      z-index: 0;
      background: url('/assets/images/new-aircraft/r88/rhc-r88-3-spotlights-left-side-atmospheric-effect-21794_2.jpg') center center / cover no-repeat;
    }

    .r88-hero__gradient {
      position: absolute;
      inset: 0;
      background: rgba(26, 26, 26, 0.7);
    }

    .r88-hero__grid-overlay {
      position: absolute;
      inset: 0;
      background-image:
        linear-gradient(rgba(255, 255, 255, 0.03) 1px, transparent 1px),
        linear-gradient(90deg, rgba(255, 255, 255, 0.03) 1px, transparent 1px);
      background-size: 50px 50px;
      opacity: 0.5;
    }

    .r88-hero__content {
      position: relative;
      z-index: 2;
      text-align: center;
      color: #fff;
      max-width: 1000px;
      padding: 6rem 2rem 0;
    }

    .r88-hero__announcement {
      margin-bottom: 1.5rem;
    }

    .r88-hero__badge-new {
      display: inline-block;
      padding: 0.5rem 1.5rem;
      font-family: 'Share Tech Mono', monospace;
      font-size: 0.7rem;
      letter-spacing: 0.3em;
      background: linear-gradient(135deg, #4a4a4a 0%, #2a2a2a 100%);
      border: 1px solid rgba(255, 255, 255, 0.2);
      color: #fff;
    }

    .r88-hero__label {
      display: block;
      font-family: 'Share Tech Mono', monospace;
      font-size: 0.75rem;
      letter-spacing: 0.3em;
      color: rgba(255, 255, 255, 0.5);
      margin-bottom: 2rem;
    }

    .r88-hero__coming-soon {
      margin-bottom: 1rem;
    }

    .r88-hero__coming-text {
      font-family: 'Space Grotesk', sans-serif;
      font-size: clamp(1rem, 2.5vw, 1.5rem);
      font-weight: 300;
      letter-spacing: 0.5em;
      color: rgba(255, 255, 255, 0.7);
    }

    .r88-hero__headline {
      display: flex;
      justify-content: center;
      gap: 0.5rem;
      margin-bottom: 0.5rem;
    }

    .r88-hero__letter {
      font-family: 'Space Grotesk', sans-serif;
      font-size: clamp(6rem, 18vw, 14rem);
      font-weight: 500;
      line-height: 1;
      color: #fff;
      text-shadow: 0 0 100px rgba(255, 255, 255, 0.2);
    }

    .r88-hero__subtitle {
      display: block;
      font-family: 'Share Tech Mono', monospace;
      font-size: clamp(0.9rem, 2vw, 1.25rem);
      letter-spacing: 0.4em;
      color: rgba(255, 255, 255, 0.6);
      margin-bottom: 2.5rem;
    }

    .r88-hero__divider {
      width: 120px;
      height: 1px;
      background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.5), transparent);
      margin: 0 auto 2.5rem;
      transform-origin: center;
    }

    .r88-hero__tagline {
      font-family: 'Space Grotesk', sans-serif;
      font-size: 1.125rem;
      line-height: 1.7;
      color: rgba(255, 255, 255, 0.8);
      max-width: 650px;
      margin: 0 auto 3rem;
    }

    .r88-hero__badges {
      display: flex;
      justify-content: center;
      align-items: center;
      gap: 2.5rem;
      margin-bottom: 3rem;
    }

    .r88-hero__badge {
      text-align: center;
    }

    .r88-hero__badge-value {
      display: block;
      font-family: 'Space Grotesk', sans-serif;
      font-size: 2.5rem;
      font-weight: 500;
      color: #fff;
    }

    .r88-hero__badge-label {
      display: block;
      font-family: 'Share Tech Mono', monospace;
      font-size: 0.7rem;
      letter-spacing: 0.2em;
      color: rgba(255, 255, 255, 0.5);
      margin-top: 0.25rem;
    }

    .r88-hero__badge-divider {
      width: 1px;
      height: 50px;
      background: rgba(255, 255, 255, 0.2);
    }

    .r88-hero__cta {
      margin-top: 2rem;
    }

    .r88-hero__scroll {
      position: absolute;
      bottom: 3rem;
      left: 50%;
      transform: translateX(-50%);
      z-index: 2;
      text-align: center;
    }

    .r88-hero__scroll span {
      display: block;
      font-family: 'Share Tech Mono', monospace;
      font-size: 0.7rem;
      letter-spacing: 0.2em;
      color: rgba(255, 255, 255, 0.4);
      margin-bottom: 0.5rem;
    }

    .r88-hero__scroll-line {
      width: 1px;
      height: 50px;
      background: rgba(255, 255, 255, 0.15);
      margin: 0 auto;
      position: relative;
      overflow: hidden;
    }

    .r88-hero__scroll-dot {
      width: 3px;
      height: 10px;
      background: #fff;
      border-radius: 2px;
      position: absolute;
      left: -1px;
      animation: scrollDot 2s infinite;
    }

    @keyframes scrollDot {
      0% { top: 0; opacity: 0; }
      20% { opacity: 1; }
      80% { opacity: 1; }
      100% { top: 100%; opacity: 0; }
    }

    /* ====================================================================
       STICKY STACK WRAPPER (bounds the sticky highlights so it un-pins at
       the bottom of the introduction instead of persisting over the rest
       of the page)
       ==================================================================== */
    .r88-sticky-stack {
      position: relative;
    }

    /* ====================================================================
       HIGHLIGHTS SECTION
       ==================================================================== */
    .r88-highlights {
      position: sticky;
      top: 0;
      padding: 2.5rem 2rem;
      background: linear-gradient(to right, #faf9f6 50%, #ececec 50%);
      border-bottom: 1px solid rgba(0, 0, 0, 0.15);
    }

    .r88-highlights::before {
      content: '';
      position: absolute;
      left: 50%;
      top: 0;
      bottom: 0;
      width: 40px;
      transform: translateX(-39px);
      background: linear-gradient(to left,
        rgba(0, 0, 0, 0.05) 0%,
        rgba(0, 0, 0, 0.02) 40%,
        rgba(0, 0, 0, 0) 100%);
      pointer-events: none;
      z-index: 0;
    }

    .r88-highlights__container {
      position: relative;
      z-index: 1;
      max-width: 1200px;
      margin: 0 auto;
      display: grid;
      grid-template-columns: minmax(260px, 1fr) 2fr;
      gap: 3rem;
      align-items: center;
    }

    .r88-highlights__header {
      display: flex;
      flex-direction: column;
      gap: 1rem;
    }

    .r88-highlights__headline {
      font-family: 'Space Grotesk', sans-serif;
      font-size: clamp(2rem, 4vw, 3rem);
      font-weight: 500;
      line-height: 1.2;
      margin: 0;
    }

    .r88-highlights__image {
      display: flex;
      justify-content: flex-end;
    }

    .r88-highlights__image img {
      width: 100%;
      max-width: 640px;
      max-height: 320px;
      height: auto;
      object-fit: contain;
      display: block;
    }

    @media (max-width: 900px) {
      .r88-highlights {
        background: #faf9f6;
      }
      .r88-highlights::before {
        display: none;
      }
      .r88-highlights__container {
        grid-template-columns: 1fr;
        gap: 2rem;
      }
      .r88-highlights__image {
        justify-content: center;
      }
    }

    @media (max-width: 768px) {
      .r88-highlights {
        padding: 2rem 1.5rem;
      }
      .r88-highlights__image img {
        max-height: 220px;
      }
    }

    /* ====================================================================
       INTRODUCTION SECTION
       ==================================================================== */
    .r88-intro {
      position: relative;
      z-index: 1;
      padding: 4rem 2rem 0;
      /* Split background mirrors R66/highlights: left half lighter, right
         half warm cream — creates a subtle vertical seam behind the content. */
      background: linear-gradient(to right, #ececec 50%, #faf9f6 50%);
    }

    .r88-intro::before {
      content: '';
      position: absolute;
      left: 50%;
      top: 0;
      bottom: 0;
      width: 40px;
      transform: translateX(-1px);
      background: linear-gradient(to right,
        rgba(0, 0, 0, 0.05) 0%,
        rgba(0, 0, 0, 0.02) 40%,
        rgba(0, 0, 0, 0) 100%);
      pointer-events: none;
      z-index: 0;
    }

    .r88-intro__container {
      position: relative;
      z-index: 1;
      max-width: 1200px;
      margin: 0 auto;
      display: grid;
      grid-template-columns: 1fr 1.2fr;
      gap: 0 4rem;
      align-items: start;
    }

    /* Swap left/right: visual column renders on the left, text on the right.
       Text column becomes sticky while the visual column (card + timeline)
       scrolls past it. Mirrors the R66 order-swap pattern. */
    .r88-intro__content { order: 2; }
    .r88-intro__visual-col { order: 1; }

    @media (min-width: 901px) {
      .r88-intro__content {
        position: sticky;
        top: max(10vh, var(--catch-top, 90px));
      }
    }

    .r88-intro__bottom {
      margin-top: 2rem;
    }

    .r88-intro__visual-col {
      display: flex;
      flex-direction: column;
      gap: 3rem;
    }

    .r88-intro__headline {
      font-family: 'Space Grotesk', sans-serif;
      font-size: clamp(2rem, 4vw, 3rem);
      font-weight: 500;
      line-height: 1.2;
      margin-bottom: 2rem;
    }

    .r88-intro__text {
      font-family: 'Space Grotesk', sans-serif;
      font-size: 1.1rem;
      line-height: 1.8;
      color: #4a4a4a;
      margin-bottom: 1.5rem;
    }

    .r88-intro__text--lead {
      font-size: 1.1rem;
      color: #4a4a4a;
    }

    .r88-intro__visual {
      background: #fff;
      border: 1px solid #eee;
      border-radius: 8px;
      padding: 3rem;
    }

    .r88-intro__orders {
      text-align: center;
      padding-bottom: 2rem;
      border-bottom: 1px solid #eee;
      margin-bottom: 2rem;
    }

    .r88-intro__orders-number {
      display: block;
      font-family: 'Space Grotesk', sans-serif;
      font-size: 4rem;
      font-weight: 500;
      color: #1a1a1a;
      line-height: 1;
    }

    .r88-intro__orders-label {
      display: block;
      font-family: 'Share Tech Mono', monospace;
      font-size: 0.75rem;
      letter-spacing: 0.15em;
      text-transform: uppercase;
      color: #999;
      margin-top: 0.5rem;
    }

    .r88-intro__milestone {
      display: flex;
      flex-direction: column;
      gap: 1rem;
    }

    .r88-intro__milestone-item {
      display: flex;
      align-items: center;
      gap: 1rem;
      font-family: 'Space Grotesk', sans-serif;
      font-size: 1rem;
      color: #4a4a4a;
    }

    .r88-intro__milestone-item i {
      color: #1a1a1a;
      font-size: 1.25rem;
    }

    /* ====================================================================
       SPECIFICATIONS SECTION
       ==================================================================== */
    .r88-specs {
      padding: 2rem 0 0;
      background: #0a0a0a;
      overflow: hidden;
      box-sizing: border-box;
    }

    .r88-specs__scroller {
      width: 100%;
      overflow: hidden;
      position: relative;
    }

    @keyframes r88-specs-marquee {
      from { transform: translate3d(0, 0, 0); }
      to   { transform: translate3d(-50%, 0, 0); }
    }

    .r88-specs__grid {
      display: flex;
      flex-wrap: nowrap;
      gap: 1.25rem;
      width: max-content;
      margin: 0;
      padding: 0;
      will-change: transform;
      animation: r88-specs-marquee 40s linear infinite;
    }

    .r88-specs__scroller:hover .r88-specs__grid {
      animation-play-state: paused;
    }

    .r88-specs__grid > * {
      flex: 0 0 240px;
    }

    .r88-specs__dots {
      display: none;
    }

    .r88-specs__dot {
      width: 6px;
      height: 6px;
      border-radius: 50%;
      background: #ccc;
      transition: background 0.2s;
      cursor: pointer;
    }

    .r88-specs__dot--active {
      background: #1a1a1a;
    }

    .r88-specs__item {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 0.75rem;
      padding: 1.5rem 1rem;
      background: #141414;
      border: 1px solid rgba(255, 255, 255, 0.1);
      border-radius: 4px;
      transition: all 0.3s ease;
      cursor: pointer;
      position: relative;
      overflow: hidden;
    }

    .r88-specs__item:hover,
    .r88-specs__item.active {
      border-color: rgba(255, 255, 255, 0.4);
      background: #1a1a1a;
      box-shadow: 0 4px 20px rgba(0, 0, 0, 0.4);
    }

    .r88-specs__indicator {
      position: absolute;
      bottom: 0;
      left: 0;
      right: 0;
      height: 2px;
      background: #fff;
      transform: scaleX(0);
      transition: transform 0.3s ease;
    }

    .r88-specs__item:hover .r88-specs__indicator {
      transform: scaleX(1);
    }

    .r88-specs__icon {
      width: 44px;
      height: 44px;
      display: flex;
      align-items: center;
      justify-content: center;
      background: #fff;
      border-radius: 50%;
      color: #0a0a0a;
      font-size: 1rem;
    }

    .r88-specs__data {
      text-align: center;
    }

    .r88-specs__label {
      display: block;
      font-family: 'Share Tech Mono', monospace;
      font-size: 0.65rem;
      letter-spacing: 0.1em;
      text-transform: uppercase;
      color: #888;
      margin-bottom: 0.25rem;
    }

    .r88-specs__value {
      display: block;
      font-family: 'Space Grotesk', sans-serif;
      font-size: 1rem;
      font-weight: 500;
      color: #fff;
    }

    .r88-specs__highlight {
      display: grid;
      grid-template-columns: 1fr auto 1fr auto 1fr;
      gap: 2rem;
      align-items: center;
      background: #1a1a1a;
      padding: 3rem;
      border-radius: 8px;
      margin-top: 3rem;
    }

    .r88-specs__highlight-divider {
      width: 1px;
      height: 80px;
      background: rgba(255, 255, 255, 0.2);
    }

    .r88-specs__highlight-item {
      display: flex;
      align-items: flex-start;
      gap: 1.5rem;
    }

    .r88-specs__highlight-icon {
      width: 50px;
      height: 50px;
      display: flex;
      align-items: center;
      justify-content: center;
      background: rgba(255, 255, 255, 0.1);
      border-radius: 50%;
      color: #fff;
      flex-shrink: 0;
    }

    .r88-specs__highlight-content h4 {
      font-family: 'Share Tech Mono', monospace;
      font-size: 0.7rem;
      letter-spacing: 0.15em;
      text-transform: uppercase;
      color: rgba(255, 255, 255, 0.5);
      margin: 0 0 0.5rem;
    }

    .r88-specs__highlight-value {
      display: block;
      font-family: 'Space Grotesk', sans-serif;
      font-size: 1.75rem;
      font-weight: 500;
      color: #fff;
    }

    .r88-specs__highlight-content p {
      font-family: 'Space Grotesk', sans-serif;
      font-size: 0.85rem;
      color: rgba(255, 255, 255, 0.6);
      margin: 0.5rem 0 0;
      line-height: 1.5;
    }

    /* ====================================================================
       ENGINE PARTNERSHIP SECTION
       ==================================================================== */
    .r88-engine {
      padding: 4rem 2rem;
      background: #fff;
    }

    .r88-engine__container {
      max-width: 1200px;
      margin: 0 auto;
    }

    .r88-engine__layout {
      display: grid;
      grid-template-columns: minmax(0, 1fr) minmax(0, 1fr);
      grid-template-rows: auto auto auto;
      gap: 0 4rem;
      align-items: start;
    }

    .r88-engine__text-top {
      grid-column: 1;
      grid-row: 1;
    }

    .r88-engine__text-bottom {
      grid-column: 1;
      grid-row: 2;
      padding-top: 1.5rem;
    }

    .r88-engine__right {
      grid-column: 2;
      grid-row: 1 / 4;
      align-self: stretch;
      display: flex;
      flex-direction: column;
    }

    .r88-engine__serenity-slot {
      margin-top: auto;
    }

    .r88-engine__partner-col {
      grid-column: 1;
      grid-row: 3;
      padding-top: 1.5rem;
      align-self: stretch;
      display: flex;
      flex-direction: column;
    }

    .r88-engine__partner-col > * {
      flex: 1;
      display: flex;
      flex-direction: column;
      min-height: 0;
    }

    .r88-engine__text {
      position: sticky;
      top: 6rem;
    }

    .r88-engine__intro {
      margin-bottom: 0;
    }

    .r88-engine__lead,
    .r88-engine__text-top .r88-engine__lead {
      font-family: 'Space Grotesk', sans-serif;
      font-size: 1.1rem;
      line-height: 1.8;
      color: #4a4a4a;
      margin-bottom: 1.5rem;
      margin-top: 1.5rem;
    }

    .r88-engine__safran-logo {
      display: block;
      width: auto;
      max-width: 200px;
      height: auto;
      margin: 3rem auto 1.5rem;
    }

    .r88-engine__intro p {
      font-family: 'Space Grotesk', sans-serif;
      font-size: 1.1rem;
      line-height: 1.8;
      color: #4a4a4a;
    }

    .r88-engine__serenity {
      margin-top: 16px;
      margin-left: calc(44px + 1rem);
      margin-right: calc(44px + 1rem);
      padding: 2rem;
      background: #faf9f6;
      border: 1px solid #eee;
      border-radius: 4px;
    }

    .r88-engine__serenity-header {
      margin-bottom: 1.25rem;
    }

    .r88-engine__serenity-header .r88-pre-text {
      display: block;
      margin-bottom: 0.5rem;
    }

    .r88-engine__serenity-header h3 {
      font-family: 'Space Grotesk', sans-serif;
      font-size: 1.5rem;
      font-weight: 500;
      color: #1a1a1a;
      margin: 0;
      line-height: 1.2;
    }

    .r88-engine__serenity-accent {
      color: #3AA1D6;
    }

    .r88-engine__serenity-lead {
      font-family: 'Space Grotesk', sans-serif;
      font-size: 1rem;
      line-height: 1.7;
      color: #4a4a4a;
      margin: 0 0 1.5rem;
    }

    .r88-engine__serenity-list {
      list-style: none;
      padding: 0;
      margin: 0;
      display: grid;
      gap: 0.85rem;
    }

    .r88-engine__serenity-list li {
      display: flex;
      align-items: center;
      gap: 0.85rem;
      font-family: 'Space Grotesk', sans-serif;
      font-size: 0.95rem;
      line-height: 1.5;
      color: #4a4a4a;
      text-align: left;
    }

    .r88-engine__serenity-list i {
      flex-shrink: 0;
      width: 28px;
      height: 28px;
      display: flex;
      align-items: center;
      justify-content: center;
      background: #1a1a1a;
      color: #fff;
      border-radius: 50%;
      font-size: 0.75rem;
    }

    .r88-engine__dots {
      display: flex;
      justify-content: center;
      gap: 8px;
      padding: 1rem 0 0;
    }

    .r88-engine__dot {
      width: 6px;
      height: 6px;
      border-radius: 50%;
      background: #ccc;
      transition: background 0.2s;
      cursor: pointer;
    }

    .r88-engine__dot--active {
      background: #1a1a1a;
    }

    .r88-engine__carousel {
      display: flex;
      align-items: stretch;
      gap: 1rem;
      min-width: 0;
    }

    .r88-engine__nav {
      flex: 0 0 auto;
      width: 44px;
      height: 44px;
      align-self: center;
      background: transparent;
      border: 1px solid #1a1a1a;
      color: #1a1a1a;
      border-radius: 50%;
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 0.85rem;
      transition: all 0.2s ease;
      padding: 0;
    }

    .r88-engine__nav:hover {
      background: #1a1a1a;
      color: #fff;
    }

    .r88-engine__nav:active {
      transform: scale(0.95);
    }

    .r88-engine__grid {
      display: flex;
      overflow-x: auto;
      overflow-y: hidden;
      scroll-snap-type: x mandatory;
      scrollbar-width: none;
      gap: 0;
      flex: 1;
      align-items: stretch;
      width: 100%;
      min-width: 0;
    }

    .r88-engine__grid::-webkit-scrollbar {
      display: none;
    }

    .r88-engine__grid > * {
      flex: 0 0 100%;
      min-width: 0;
      scroll-snap-align: start;
      box-sizing: border-box;
      display: flex;
      flex-direction: column;
    }

    .r88-engine__grid > * .r88-engine__card {
      flex: 1;
      width: 100%;
      box-sizing: border-box;
    }

    .r88-engine__card {
      background: #faf9f6;
      padding: 2rem;
      border-radius: 4px;
      border: 1px solid #eee;
      transition: all 0.3s ease;
    }

    .r88-engine__card:hover {
      border-color: #1a1a1a;
      box-shadow: 0 10px 40px rgba(0, 0, 0, 0.08);
    }

    .r88-engine__stat {
      margin-bottom: 1.5rem;
      padding-bottom: 1.5rem;
      border-bottom: 1px solid #eee;
    }

    .r88-engine__stat-value {
      display: block;
      font-family: 'Space Grotesk', sans-serif;
      font-size: 2.25rem;
      font-weight: 500;
      color: #1a1a1a;
      line-height: 1;
    }

    .r88-engine__stat-label {
      display: block;
      font-family: 'Share Tech Mono', monospace;
      font-size: 0.65rem;
      letter-spacing: 0.1em;
      text-transform: uppercase;
      color: #999;
      margin-top: 0.5rem;
    }

    .r88-engine__card h3 {
      font-family: 'Space Grotesk', sans-serif;
      font-size: 1.1rem;
      font-weight: 500;
      color: #1a1a1a;
      margin: 0 0 0.75rem;
    }

    .r88-engine__card p {
      font-family: 'Space Grotesk', sans-serif;
      font-size: 0.9rem;
      line-height: 1.6;
      color: #666;
      margin: 0;
    }

    .r88-engine__partner {
      margin-top: 1.25rem;
      text-align: center;
      flex: 1;
      display: flex;
      flex-direction: column;
    }

    .r88-engine__partner-badge {
      display: flex;
      flex-direction: column;
      justify-content: center;
      flex: 1;
      padding: 1.5rem 2rem;
      background: #1a1a1a;
      border: 1px solid rgba(255, 255, 255, 0.2);
      border-radius: 8px;
    }

    .r88-engine__partner-text {
      display: block;
      font-family: 'Share Tech Mono', monospace;
      font-size: 0.7rem;
      letter-spacing: 0.2em;
      text-transform: uppercase;
      color: rgba(255, 255, 255, 0.5);
      margin-bottom: 1rem;
    }

    .r88-engine__partner-logos {
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 2rem;
    }

    .r88-engine__partner-logo {
      font-family: 'Space Grotesk', sans-serif;
      font-size: 1.5rem;
      font-weight: 500;
      color: #fff;
      letter-spacing: 0.15em;
    }

    .r88-engine__partner-x {
      font-family: 'Space Grotesk', sans-serif;
      font-size: 1.25rem;
      color: rgba(255, 255, 255, 0.4);
    }

    /* ====================================================================
       AVIONICS SECTION
       ==================================================================== */
    .r88-avionics {
      padding: 5rem 2rem;
      background: #1a1a1a;
      color: #fff;
    }

    .r88-avionics__container {
      max-width: 1400px;
      margin: 0 auto;
    }

    .r88-avionics .r88-section-header h2 {
      color: #fff;
    }

    .r88-avionics .r88-text--dark { color: #fff; }
    .r88-avionics .r88-text--mid { color: rgba(255, 255, 255, 0.8); }
    .r88-avionics .r88-text--light { color: rgba(255, 255, 255, 0.6); }

    .r88-avionics__intro {
      font-family: 'Space Grotesk', sans-serif;
      font-size: 1.15rem;
      line-height: 1.8;
      color: rgba(255, 255, 255, 0.75);
      margin-top: 1.5rem;
    }

    .r88-avionics__content {
      display: grid;
      grid-template-columns: 1.2fr 1fr;
      gap: 4rem;
      align-items: end;
      margin-bottom: 4rem;
    }

    .r88-avionics__image {
      position: relative;
      border-radius: 8px;
      overflow: hidden;
    }

    .r88-avionics__image img {
      width: 100%;
      display: block;
    }

    .r88-avionics__image-badge {
      position: absolute;
      bottom: 1.5rem;
      left: 1.5rem;
      background: rgba(0, 0, 0, 0.85);
      backdrop-filter: blur(10px);
      padding: 1rem 1.5rem;
      border-radius: 4px;
      border: 1px solid rgba(255, 255, 255, 0.1);
    }

    .r88-avionics__image-badge-label {
      display: block;
      font-family: 'Share Tech Mono', monospace;
      font-size: 0.65rem;
      letter-spacing: 0.2em;
      color: rgba(255, 255, 255, 0.5);
      margin-bottom: 0.25rem;
    }

    .r88-avionics__image-badge-text {
      display: block;
      font-family: 'Space Grotesk', sans-serif;
      font-size: 1rem;
      font-weight: 500;
      color: #fff;
    }

    .r88-avionics__features {
      display: flex;
      flex-direction: column;
      gap: 1.5rem;
    }

    .r88-avionics__feature {
      display: flex;
      gap: 1.25rem;
      padding: 1.5rem;
      background: rgba(255, 255, 255, 0.03);
      border: 1px solid rgba(255, 255, 255, 0.08);
      border-radius: 4px;
      transition: all 0.3s ease;
    }

    .r88-avionics__feature:hover {
      background: rgba(255, 255, 255, 0.06);
      border-color: rgba(255, 255, 255, 0.15);
    }

    .r88-avionics__feature-icon {
      width: 48px;
      height: 48px;
      display: flex;
      align-items: center;
      justify-content: center;
      background: rgba(255, 255, 255, 0.1);
      border-radius: 4px;
      color: #fff;
      font-size: 1.1rem;
      flex-shrink: 0;
    }

    .r88-avionics__feature-content h4 {
      font-family: 'Space Grotesk', sans-serif;
      font-size: 1.1rem;
      font-weight: 500;
      color: #fff;
      margin: 0 0 0.5rem;
    }

    .r88-avionics__feature-content p {
      font-family: 'Space Grotesk', sans-serif;
      font-size: 0.9rem;
      line-height: 1.6;
      color: rgba(255, 255, 255, 0.6);
      margin: 0;
    }

    .r88-avionics__standard {
      background: rgba(255, 255, 255, 0.03);
      border: 1px solid rgba(255, 255, 255, 0.08);
      border-radius: 8px;
      padding: 3rem;
    }

    .r88-avionics__standard h3 {
      font-family: 'Space Grotesk', sans-serif;
      font-size: 1.5rem;
      font-weight: 500;
      color: #fff;
      margin: 0 0 2rem;
      text-align: center;
    }

    .r88-avionics__standard-grid {
      display: grid;
      grid-template-columns: repeat(4, 1fr);
      gap: 1rem;
    }

    .r88-avionics__standard-item {
      display: flex;
      align-items: center;
      gap: 0.75rem;
      padding: 1rem;
      background: rgba(255, 255, 255, 0.03);
      border-radius: 4px;
    }

    .r88-avionics__standard-item i {
      color: rgba(255, 255, 255, 0.4);
      font-size: 0.8rem;
    }

    .r88-avionics__standard-item span {
      font-family: 'Space Grotesk', sans-serif;
      font-size: 0.9rem;
      color: rgba(255, 255, 255, 0.8);
    }

    /* ====================================================================
       GALLERY SECTION
       ==================================================================== */
    .r88-gallery {
      padding: 0 2rem 6rem;
      background: #0a0a0a;
    }

    .r88-gallery__container {
      max-width: 1200px;
      margin: 0 auto;
    }

    .r88-gallery__grid {
      display: grid;
      grid-template-columns: repeat(4, 1fr);
      gap: 0.75rem;
      margin-top: 0;
      padding-top: 3rem;
    }

    .r88-gallery__item {
      position: relative;
      overflow: hidden;
      border-radius: 4px;
      cursor: pointer;
      aspect-ratio: 4 / 3;
    }
    .r88-gallery__item--wide {
      grid-column: span 2;
    }

    /* Spec tile — same cell as an image tile, but showing a KPI. */
    .r88-gallery__item--spec {
      cursor: default;
      background: #141414;
      border: 1px solid rgba(255, 255, 255, 0.08);
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      align-items: flex-start;
      padding: 1.5rem;
      gap: 1rem;
    }

    .r88-gallery__spec-icon {
      width: 40px;
      height: 40px;
      display: flex;
      align-items: center;
      justify-content: center;
      background: rgba(255, 255, 255, 0.08);
      border-radius: 50%;
      color: #fff;
      font-size: 0.95rem;
    }

    .r88-gallery__spec-body {
      display: flex;
      flex-direction: column;
      gap: 0.35rem;
    }

    .r88-gallery__spec-label {
      font-family: 'Share Tech Mono', monospace;
      font-size: 0.65rem;
      letter-spacing: 0.14em;
      text-transform: uppercase;
      color: #888;
    }

    .r88-gallery__spec-value {
      font-family: 'Space Grotesk', sans-serif;
      font-size: clamp(1.1rem, 1.6vw, 1.5rem);
      font-weight: 500;
      color: #fff;
      line-height: 1.2;
    }

    .r88-gallery__item img {
      width: 100%;
      height: 100%;
      object-fit: cover;
      display: block;
      transition: transform 0.5s ease;
    }
    .r88-gallery__item:hover img {
      transform: scale(1.05);
    }

    .r88-gallery__overlay {
      position: absolute;
      inset: 0;
      background: linear-gradient(to top, rgba(0,0,0,0.5) 0%, transparent 50%);
      opacity: 0;
      transition: opacity 0.3s ease;
      display: flex;
      align-items: flex-end;
      padding: 1rem;
    }
    .r88-gallery__item:hover .r88-gallery__overlay {
      opacity: 1;
    }

    .r88-gallery__label {
      font-family: 'Share Tech Mono', monospace;
      font-size: 0.6rem;
      letter-spacing: 0.15em;
      text-transform: uppercase;
      color: #fff;
    }

    /* Lightbox */
    .r88-gallery__lightbox {
      position: fixed;
      inset: 0;
      z-index: 9999;
      background: rgba(0, 0, 0, 0.95);
      display: flex;
      align-items: center;
      justify-content: center;
      cursor: pointer;
    }
    .r88-gallery__lightbox img {
      max-width: 90vw;
      max-height: 85vh;
      object-fit: contain;
      border-radius: 4px;
    }
    .r88-gallery__lightbox-close {
      position: absolute;
      top: 1.5rem;
      right: 1.5rem;
      width: 40px;
      height: 40px;
      border: 1px solid rgba(255,255,255,0.2);
      border-radius: 50%;
      background: transparent;
      color: #fff;
      font-size: 1rem;
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      transition: border-color 0.2s;
    }
    .r88-gallery__lightbox-close:hover {
      border-color: #fff;
    }
    .r88-gallery__lightbox-nav {
      position: absolute;
      top: 50%;
      transform: translateY(-50%);
      width: 44px;
      height: 44px;
      border: 1px solid rgba(255,255,255,0.2);
      border-radius: 50%;
      background: transparent;
      color: #fff;
      font-size: 0.9rem;
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      transition: border-color 0.2s;
    }
    .r88-gallery__lightbox-nav:hover {
      border-color: #fff;
    }
    .r88-gallery__lightbox-nav--prev { left: 1.5rem; }
    .r88-gallery__lightbox-nav--next { right: 1.5rem; }
    .r88-gallery__lightbox-count {
      position: absolute;
      bottom: 1.5rem;
      left: 50%;
      transform: translateX(-50%);
      font-family: 'Share Tech Mono', monospace;
      font-size: 0.7rem;
      letter-spacing: 0.15em;
      color: rgba(255,255,255,0.5);
    }

    @media (max-width: 768px) {
      .r88-gallery__scroll {
        overflow-x: auto;
        overflow-y: hidden;
        scrollbar-width: none;
        margin: 0 -1rem;
        scroll-snap-type: x mandatory;
      }

      .r88-gallery__scroll::-webkit-scrollbar {
        display: none;
      }

      .r88-gallery__grid {
        grid-template-rows: repeat(2, 160px);
        grid-template-columns: unset;
        grid-auto-flow: column;
        grid-auto-columns: calc(50vw - 1.25rem);
        width: max-content;
        margin-top: 1.5rem;
        gap: 0.5rem;
      }

      /* Snap at the start of every 2-column page (4 items = 2 cols × 2 rows) */
      .r88-gallery__grid > *:nth-child(4n+1) {
        scroll-snap-align: start;
      }

      .r88-gallery__item--wide {
        grid-column: span 1;
      }

      .r88-gallery__grid > * {
        height: 100%;
        min-width: 0;
      }

      .r88-gallery__item {
        aspect-ratio: unset;
        height: 100%;
        width: 100%;
      }

      .r88-gallery__dots {
        display: flex;
        justify-content: center;
        gap: 6px;
        padding: 14px 0 0;
      }

      .r88-gallery__dot {
        width: 6px;
        height: 6px;
        border-radius: 50%;
        background: #ccc;
        border: none;
        padding: 0;
        cursor: pointer;
        transition: background 0.2s;
      }

      .r88-gallery__dot--active {
        background: #1a1a1a;
      }
    }

    /* ====================================================================
       TIMELINE SECTION
       ==================================================================== */
    .r88-timeline {
      padding: 4rem 2rem;
      background: #fff;
    }

    .r88-timeline__container {
      max-width: 1200px;
      margin: 0 auto;
    }

    .r88-timeline__track {
      position: relative;
      margin-top: 4rem;
    }

    .r88-timeline__line {
      position: absolute;
      left: 24px;
      top: 0;
      bottom: 0;
      width: 2px;
      background: #ddd;
    }

    .r88-timeline__line-progress {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 25%;
      background: #1a1a1a;
    }

    .r88-timeline__item {
      display: flex;
      gap: 2rem;
      margin-bottom: 3rem;
      position: relative;
    }

    .r88-timeline__marker {
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

    .r88-timeline__item--completed .r88-timeline__marker {
      background: #1a1a1a;
      border-color: #1a1a1a;
      color: #fff;
    }

    .r88-timeline__item--active .r88-timeline__marker {
      background: #fff;
      border-color: #1a1a1a;
      border-width: 3px;
    }

    .r88-timeline__pulse {
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

    .r88-timeline__dot {
      width: 8px;
      height: 8px;
      background: #ddd;
      border-radius: 50%;
    }

    .r88-timeline__content {
      padding-top: 0.5rem;
    }

    .r88-timeline__year {
      display: inline-block;
      font-family: 'Share Tech Mono', monospace;
      font-size: 0.75rem;
      letter-spacing: 0.15em;
      background: #1a1a1a;
      color: #fff;
      padding: 0.25rem 0.75rem;
      margin-bottom: 0;
    }

    .r88-timeline__text {
      margin-top: 0;
      padding-top: 12px;
    }

    .r88-timeline__item--upcoming .r88-timeline__year {
      background: #ddd;
      color: #666;
    }

    .r88-timeline__content h4 {
      font-family: 'Space Grotesk', sans-serif;
      font-size: 1.25rem;
      font-weight: 500;
      color: #1a1a1a;
      margin: 0 0 0.5rem;
    }

    .r88-timeline__content p {
      font-family: 'Space Grotesk', sans-serif;
      font-size: 1rem;
      line-height: 1.6;
      color: #666;
      margin: 0;
    }

    .r88-timeline__video {
      margin-top: 1.25rem;
      max-width: 560px;
    }

    .r88-timeline__video-frame {
      position: relative;
      aspect-ratio: 16 / 9;
      background: transparent;
      border-radius: 4px;
      overflow: hidden;
      transition: box-shadow 0.6s cubic-bezier(0.22, 1, 0.36, 1);
    }

    .r88-timeline--cinema .r88-timeline__video-frame {
      box-shadow:
        0 40px 100px -30px rgba(10, 10, 10, 0.45),
        0 18px 45px -15px rgba(0, 0, 0, 0.22);
    }

    .r88-timeline__video-poster {
      position: absolute;
      inset: 0;
      width: 100%;
      height: 100%;
      padding: 0;
      border: 0;
      background-color: #0a0a0a;
      background-size: cover;
      background-position: center;
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      transition: transform 0.3s ease;
    }

    .r88-timeline__video-scrim {
      position: absolute;
      inset: 0;
      background: linear-gradient(180deg, rgba(0,0,0,0.15), rgba(0,0,0,0.45));
      transition: background 0.25s ease;
    }

    .r88-timeline__video-play {
      position: relative;
      width: 58px;
      height: 58px;
      border-radius: 50%;
      border: 1px solid rgba(255, 255, 255, 0.75);
      background: rgba(0, 0, 0, 0.25);
      backdrop-filter: blur(4px);
      display: flex;
      align-items: center;
      justify-content: center;
      transition: transform 0.25s ease, border-color 0.25s ease, background 0.25s ease;
    }

    .r88-timeline__video-play::after {
      content: '';
      border-left: 11px solid #fff;
      border-top: 7px solid transparent;
      border-bottom: 7px solid transparent;
      margin-left: 4px;
    }

    .r88-timeline__video-poster:hover .r88-timeline__video-scrim,
    .r88-timeline__video-poster:focus-visible .r88-timeline__video-scrim {
      background: linear-gradient(180deg, rgba(0,0,0,0.05), rgba(0,0,0,0.3));
    }

    .r88-timeline__video-poster:hover .r88-timeline__video-play,
    .r88-timeline__video-poster:focus-visible .r88-timeline__video-play {
      transform: scale(1.06);
      border-color: #fff;
      background: rgba(0, 0, 0, 0.4);
    }

    .r88-timeline__video-poster:focus-visible {
      outline: 2px solid #1a1a1a;
      outline-offset: 2px;
    }

    .r88-timeline__video-iframe {
      position: absolute;
      inset: 0;
      width: 100%;
      height: 100%;
      border: 0;
      outline: none;
      display: block;
    }

    .r88-timeline__video-label {
      display: block;
      margin-top: 0.75rem;
      font-family: 'Share Tech Mono', monospace;
      font-size: 0.7rem;
      letter-spacing: 0.18em;
      text-transform: uppercase;
      color: #999;
    }

    .r88-timeline__video-backdrop {
      position: fixed;
      inset: 0;
      background: rgba(10, 10, 10, 0.88);
      backdrop-filter: blur(4px);
      -webkit-backdrop-filter: blur(4px);
      z-index: 1000;
      cursor: pointer;
    }

    .r88-timeline__video-lightbox {
      position: fixed;
      inset: 0;
      margin: auto;
      width: min(92vw, 1100px);
      height: min(calc(min(92vw, 1100px) * 9 / 16), 80vh);
      max-width: none;
      z-index: 1001;
      border-radius: 8px;
    }

    .r88-timeline__video-frame--lightbox {
      position: absolute;
      inset: 0;
      width: 100%;
      height: 100%;
      aspect-ratio: auto;
      border-radius: 8px;
      overflow: hidden;
      box-shadow:
        0 40px 100px -30px rgba(10, 10, 10, 0.6),
        0 18px 45px -15px rgba(0, 0, 0, 0.4);
    }

    .r88-timeline__video-mask {
      position: absolute;
      inset: 0;
      background: transparent;
      cursor: default;
      z-index: 2;
    }

    .r88-timeline__video-close {
      position: absolute;
      top: -18px;
      right: -18px;
      width: 36px;
      height: 36px;
      display: inline-flex;
      align-items: center;
      justify-content: center;
      background: rgba(20, 20, 20, 0.92);
      border: 1px solid rgba(255, 255, 255, 0.35);
      color: #fff;
      font-size: 1.6rem;
      line-height: 1;
      cursor: pointer;
      border-radius: 50%;
      z-index: 3;
      transition: background 0.2s ease, border-color 0.2s ease, transform 0.2s ease;
    }

    .r88-timeline__video-close:hover,
    .r88-timeline__video-close:focus-visible {
      background: rgba(0, 0, 0, 1);
      border-color: rgba(255, 255, 255, 0.6);
      transform: scale(1.05);
      outline: none;
    }

    @media (max-width: 640px) {
      .r88-timeline__video--playing {
        width: 94vw;
      }
      .r88-timeline__video-close {
        top: -16px;
        right: -16px;
        width: 32px;
        height: 32px;
        font-size: 1.4rem;
      }
    }

    /* Cinema mode: when the video is playing, morph the timeline to the
       mobile-style stacked/center layout and let the video frame grow to
       fill the container. Framer Motion handles item/content/video layout
       animation via transforms (see R88Timeline). */
    .r88-timeline__line {
      transition: left 0.6s cubic-bezier(0.22, 1, 0.36, 1),
                  transform 0.6s cubic-bezier(0.22, 1, 0.36, 1);
    }

    .r88-timeline--cinema .r88-timeline__line {
      left: 50%;
      transform: translateX(-50%);
      z-index: 0;
    }

    .r88-timeline--cinema .r88-timeline__item {
      flex-direction: column;
      align-items: center;
      gap: 0.75rem;
      text-align: center;
      margin-bottom: 0;
      padding-bottom: 20px;
    }

    .r88-timeline--cinema .r88-timeline__track > *:last-child .r88-timeline__item {
      padding-bottom: 0;
    }

    .r88-timeline--cinema .r88-timeline__marker {
      position: relative;
      z-index: 2;
      flex-shrink: 0;
    }

    .r88-timeline--cinema .r88-timeline__content {
      position: relative;
      z-index: 1;
      width: 100%;
      padding: 0 0.5rem 0.75rem;
      text-align: center;
    }

    .r88-timeline--cinema .r88-timeline__text {
      background: #fff;
    }

    .r88-timeline--cinema .r88-timeline__video {
      max-width: 100%;
      margin-left: auto;
      margin-right: auto;
    }

    .r88-timeline--cinema .r88-timeline__status {
      text-align: center;
    }

    .r88-timeline__status {
      margin-top: 4rem;
      text-align: left;
    }

    .r88-timeline__status-item {
      display: inline-flex;
      align-items: center;
      gap: 0.75rem;
      font-family: 'Space Grotesk', sans-serif;
      font-size: 1rem;
      font-weight: 500;
      color: #1a1a1a;
      padding: 1rem 2rem;
      background: #fff;
      border: 1px solid #eee;
      border-radius: 50px;
    }

    .r88-timeline__status-dot {
      width: 10px;
      height: 10px;
      background: #1a1a1a;
      border-radius: 50%;
      animation: pulse 2s infinite;
    }

    .r88-timeline__status-note {
      font-family: 'Space Grotesk', sans-serif;
      font-size: 0.9rem;
      color: #7a7a7a;
      margin-top: 1rem;
    }

    /* ====================================================================
       CTA SECTION
       ==================================================================== */
    .r88-cta {
      padding: 4rem 2rem;
      background: #1a1a1a;
    }

    .r88-cta__toggle {
      display: flex;
      justify-content: center;
      gap: 0;
      max-width: 1200px;
      margin: 0 auto 3rem;
      padding: 0 2rem;
    }

    .r88-cta__toggle-btn {
      flex: 0 0 auto;
      padding: 0.65rem 2rem;
      font-family: 'Share Tech Mono', monospace;
      font-size: 0.75rem;
      letter-spacing: 0.12em;
      text-transform: uppercase;
      background: transparent;
      color: rgba(255, 255, 255, 0.4);
      border: 1px solid rgba(255, 255, 255, 0.15);
      cursor: pointer;
      transition: all 0.2s ease;
    }

    .r88-cta__toggle-btn:first-child {
      border-radius: 4px 0 0 4px;
      border-right: none;
    }

    .r88-cta__toggle-btn:last-child {
      border-radius: 0 4px 4px 0;
    }

    .r88-cta__toggle-btn--active {
      background: rgba(255, 255, 255, 0.1);
      color: #fff;
      border-color: rgba(255, 255, 255, 0.35);
    }

    .r88-cta__toggle-btn:not(.r88-cta__toggle-btn--active):hover {
      color: rgba(255, 255, 255, 0.7);
      border-color: rgba(255, 255, 255, 0.25);
    }

    .r88-cta__container {
      max-width: 1200px;
      margin: 0 auto;
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 4rem;
      align-items: start;
    }

    .r88-cta__content h2 {
      font-family: 'Space Grotesk', sans-serif;
      font-size: clamp(2rem, 4vw, 3rem);
      font-weight: 500;
      line-height: 1.2;
      margin: 0;
    }

    .r88-cta__lead {
      font-family: 'Space Grotesk', sans-serif;
      font-size: 1.1rem;
      line-height: 1.8;
      color: rgba(255, 255, 255, 0.7);
      margin: 2rem 0;
    }

    .r88-cta__benefits-card {
      background: rgba(255, 255, 255, 0.06);
      border: 1px solid rgba(255, 255, 255, 0.12);
      border-radius: 8px;
      padding: 1rem 1.5rem;
      margin: 1rem 0;
    }

    .r88-cta__benefits {
      display: flex;
      flex-direction: column;
      gap: 1rem;
    }

    .r88-cta__benefit {
      display: flex;
      align-items: center;
      gap: 1rem;
      font-family: 'Space Grotesk', sans-serif;
      font-size: 1rem;
      color: rgba(255, 255, 255, 0.8);
      text-align: left;
    }

    .r88-cta__benefit span {
      text-align: left;
    }

    .r88-cta__benefit i {
      width: 40px;
      height: 40px;
      min-width: 40px;
      min-height: 40px;
      aspect-ratio: 1;
      flex-shrink: 0;
      display: flex;
      align-items: center;
      justify-content: center;
      background: rgba(255, 255, 255, 0.1);
      border-radius: 50%;
      color: #fff;
    }

    .r88-cta__form {
      background: rgba(255, 255, 255, 0.05);
      border: 1px solid rgba(255, 255, 255, 0.1);
      border-radius: 8px;
      padding: 2.5rem;
    }

    .r88-cta__success {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      gap: 1.25rem;
      padding: 3rem 2rem;
      text-align: center;
    }

    .r88-cta__success p {
      font-family: 'Space Grotesk', sans-serif;
      font-size: 1rem;
      line-height: 1.6;
      color: rgba(255, 255, 255, 0.85);
      margin: 0;
    }

    .r88-cta__error {
      font-family: 'Space Grotesk', sans-serif;
      font-size: 0.85rem;
      color: #fca5a5;
      margin: 0 0 1rem;
    }

    .r88-cta__error a {
      color: #fca5a5;
      text-decoration: underline;
    }

    .r88-cta__form h3 {
      font-family: 'Space Grotesk', sans-serif;
      font-size: 1.25rem;
      font-weight: 500;
      color: #fff;
      margin: 0 0 2rem;
      text-align: center;
    }

    .r88-cta__form-group {
      margin-bottom: 1rem;
    }

    .r88-cta__form input,
    .r88-cta__form select,
    .r88-cta__form textarea {
      width: 100%;
      padding: 1rem 1.25rem;
      font-family: 'Space Grotesk', sans-serif;
      font-size: 0.95rem;
      background: rgba(255, 255, 255, 0.05);
      border: 1px solid rgba(255, 255, 255, 0.1);
      border-radius: 4px;
      color: #fff;
      transition: all 0.3s ease;
    }

    .r88-cta__form input::placeholder,
    .r88-cta__form textarea::placeholder {
      color: rgba(255, 255, 255, 0.4);
    }

    .r88-cta__form input:focus,
    .r88-cta__form select:focus,
    .r88-cta__form textarea:focus {
      outline: none;
      border-color: rgba(255, 255, 255, 0.3);
      background: rgba(255, 255, 255, 0.08);
    }

    .r88-select {
      position: relative;
      width: 100%;
    }

    .r88-select__trigger {
      width: 100%;
      padding: 1rem 1.25rem;
      display: flex;
      align-items: center;
      justify-content: space-between;
      font-family: 'Space Grotesk', sans-serif;
      font-size: 0.95rem;
      color: #fff;
      background: rgba(255, 255, 255, 0.05);
      border: 1px solid rgba(255, 255, 255, 0.15);
      border-radius: 4px;
      cursor: pointer;
      text-align: left;
      transition: border-color 0.2s, background 0.2s;
    }

    .r88-select__trigger:focus {
      outline: none;
      border-color: rgba(255, 255, 255, 0.3);
      background: rgba(255, 255, 255, 0.08);
    }

    .r88-select__chevron {
      flex-shrink: 0;
      margin-left: 0.75rem;
      transition: transform 0.2s ease;
    }

    .r88-select__chevron--open {
      transform: rotate(180deg);
    }

    .r88-select__menu {
      position: absolute;
      top: calc(100% + 4px);
      left: 0;
      right: 0;
      background: #1e1e1e;
      border: 1px solid rgba(255, 255, 255, 0.15);
      border-radius: 4px;
      list-style: none;
      margin: 0;
      padding: 0.35rem 0;
      z-index: 100;
      box-shadow: 0 8px 32px rgba(0, 0, 0, 0.5);
    }

    .r88-select__option {
      padding: 0.75rem 1.25rem;
      font-family: 'Space Grotesk', sans-serif;
      font-size: 0.9rem;
      color: rgba(255, 255, 255, 0.75);
      cursor: pointer;
      transition: background 0.15s, color 0.15s;
    }

    .r88-select__option:hover {
      background: rgba(255, 255, 255, 0.07);
      color: #fff;
    }

    .r88-select__option--active {
      color: #fff;
      background: rgba(255, 255, 255, 0.1);
    }

    .r88-cta__form textarea {
      resize: vertical;
      min-height: 80px;
    }

    .r88-cta__contact {
      grid-column: 1 / -1;
      margin-top: 3rem;
      padding-top: 3rem;
      border-top: 1px solid rgba(255, 255, 255, 0.1);
    }

    .r88-cta__contact-inner {
      display: flex;
      justify-content: center;
      gap: 4rem;
    }

    .r88-cta__contact-item {
      display: flex;
      align-items: center;
      gap: 0.75rem;
      font-family: 'Space Grotesk', sans-serif;
      font-size: 0.95rem;
      color: rgba(255, 255, 255, 0.7);
    }

    .r88-cta__contact-item i {
      color: rgba(255, 255, 255, 0.4);
    }

    /* ====================================================================
       RESPONSIVE STYLES
       ==================================================================== */
    @media (max-width: 1200px) {
      .r88-specs__highlight {
        grid-template-columns: 1fr;
        gap: 2rem;
      }

      .r88-specs__highlight-divider {
        width: 100%;
        height: 1px;
      }
    }

    @media (max-width: 1024px) {
      .r88-intro__container {
        grid-template-columns: 1fr;
        gap: 2rem;
      }

      .r88-intro__text {
        margin-bottom: 0;
      }

      .r88-intro__text--lead {
        margin-bottom: 0;
      }

      .r88-intro__visual {
        padding: 1.5rem;
      }

      .r88-intro__orders {
        padding-bottom: 1rem;
        margin-bottom: 1rem;
      }

      .r88-intro__orders-number {
        font-size: 2.5rem;
      }

      .r88-intro__orders-label {
        font-size: 0.65rem;
        margin-top: 0.75rem;
      }

      .r88-intro__milestone {
        gap: 0.6rem;
      }

      .r88-intro__milestone-item {
        font-size: 0.9rem;
        gap: 0.75rem;
      }

      .r88-intro__milestone-item i {
        font-size: 1rem;
      }

      .r88-cta__container {
        grid-template-columns: 1fr;
      }

      .r88-engine__layout {
        grid-template-columns: 1fr;
        grid-template-rows: unset;
        gap: 1rem;
      }

      .r88-engine__text-top      { order: 1; grid-column: 1; grid-row: unset; }
      .r88-engine__right         { display: contents; }
      .r88-engine__carousel      { order: 2; grid-column: 1; }
      .r88-engine__dots          { order: 3; grid-column: 1; }
      .r88-engine__text-bottom   { order: 4; grid-column: 1; grid-row: unset; padding-top: 0; }
      .r88-engine__serenity-slot { order: 5; grid-column: 1; }
      .r88-engine__partner-col   { order: 6; grid-column: 1; grid-row: unset; padding-top: 0; }


      .r88-specs {
        padding: 1.5rem 0;
      }
      .r88-specs__grid > * {
        flex: 0 0 200px;
      }

      .r88-avionics__content {
        grid-template-columns: 1fr;
        gap: 3rem;
      }

      .r88-avionics__standard-grid {
        grid-template-columns: repeat(2, 1fr);
      }
    }

    @media (max-width: 768px) {
      .r88-gallery .r88-section-header {
        margin-bottom: 0;
      }

      .r88-gallery {
        padding-top: 48px;
        padding-bottom: 48px;
      }

      .r88-section-header,
      .r88-intro__top,
      .r88-intro__bottom,
      .r88-engine__text-top,
      .r88-engine__text-bottom,
      .r88-engine__intro,
      .r88-timeline__content,
      .r88-cta__content,
      .r88-specs__item {
        text-align: center;
      }

      .r88-timeline__line {
        left: 50%;
        transform: translateX(-50%);
        z-index: 0;
      }

      .r88-timeline__item {
        flex-direction: column;
        align-items: center;
        gap: 0.75rem;
        text-align: center;
        margin-bottom: 0;
        padding-bottom: 20px;
      }

      .r88-timeline__track > *:last-child .r88-timeline__item {
        padding-bottom: 0;
      }

      .r88-timeline__status {
        margin-top: 2px;
        text-align: center;
      }

      .r88-timeline__marker {
        position: relative;
        z-index: 2;
        flex-shrink: 0;
      }

      .r88-timeline__content {
        position: relative;
        z-index: 1;
        width: 100%;
        padding: 0 0.5rem 0.75rem;
        text-align: center;
      }

      .r88-timeline__text {
        background: #fff;
      }

      /* Mobile poster state: keep video inside the content column (small). */
      .r88-timeline__video {
        max-width: 100%;
        margin-left: auto;
        margin-right: auto;
      }

      /* Mobile cinema state: video grows edge-to-edge once played. */
      .r88-timeline--cinema .r88-timeline__video {
        width: 100vw;
        max-width: 100vw;
        margin-left: calc(50% - 50vw);
        margin-right: calc(50% - 50vw);
      }

      .r88-timeline--cinema .r88-timeline__video-frame {
        border-radius: 0;
      }

      .r88-hero__badges {
        flex-direction: row;
        gap: 1rem;
      }

      .r88-hero__badge-divider {
        width: 1px;
        height: 40px;
      }

      .r88-specs__scroller {
        scroll-snap-type: x mandatory;
      }

      .r88-specs__grid {
        gap: 0.75rem;
      }

      .r88-specs__grid > * {
        flex: 0 0 calc(60% - 0.375rem);
        scroll-snap-align: start;
      }

      .r88-specs__item {
        min-height: 150px;
        box-sizing: border-box;
        border: 1px solid #e8e6e2;
        transform: none !important;
      }

      .r88-specs__item:hover,
      .r88-specs__item.active {
        box-shadow: none;
        transform: none !important;
      }

      .r88-specs__item:hover .r88-specs__indicator,
      .r88-specs__item.active .r88-specs__indicator {
        transform: scaleX(0);
      }

      .r88-intro__text--announced {
        display: none;
      }

      .r88-engine__right {
        min-width: 0;
        width: 100%;
      }

      .r88-engine__nav {
        display: none;
      }

      .r88-engine__carousel {
        gap: 0;
      }

      .r88-engine__serenity {
        margin-left: 0;
        margin-right: 0;
        width: 100%;
        box-sizing: border-box;
        padding: 1.25rem 1.25rem;
        text-align: center;
      }

      .r88-engine__serenity-list li {
        justify-content: center;
      }

      .r88-engine__grid {
        display: flex;
        overflow-x: auto;
        overflow-y: hidden;
        scroll-snap-type: x mandatory;
        scrollbar-width: none;
        gap: 0;
        margin-bottom: 0;
        width: 100%;
        min-width: 0;
      }

      .r88-engine__grid::-webkit-scrollbar {
        display: none;
      }

      .r88-engine__grid > * {
        flex: 0 0 100%;
        min-width: 0;
        scroll-snap-align: start;
        margin-right: 1rem;
        box-sizing: border-box;
      }

      .r88-engine__grid > *:last-child {
        margin-right: 0;
      }

      .r88-engine__card {
        width: 100%;
        box-sizing: border-box;
        text-align: center;
      }

      .r88-engine__card .r88-engine__stat {
        display: flex;
        flex-direction: column;
        align-items: center;
      }

      .r88-avionics__feature {
        flex-direction: column;
        text-align: center;
      }

      .r88-avionics__feature-icon {
        margin: 0 auto;
      }

      .r88-avionics__standard-grid {
        grid-template-columns: 1fr;
      }

      .r88-engine__dots {
        display: flex;
        justify-content: center;
        gap: 6px;
        padding: 14px 0 0;
        margin-bottom: 1.25rem;
      }

      .r88-engine__partner-logos {
        gap: 1rem;
      }

      .r88-engine__partner-logo {
        font-size: 1.1rem;
        letter-spacing: 0.08em;
      }

      .r88-engine__partner-x {
        font-size: 1rem;
      }

      .r88-engine__partner-badge {
        padding: 1.25rem 1.25rem;
        width: 100%;
        box-sizing: border-box;
      }

      .r88-cta__contact-inner {
        flex-direction: column;
        gap: 1rem;
        align-items: center;
      }
    }

    @media (max-width: 480px) {
      .r88-hero__letter {
        font-size: 5rem;
      }

      .r88-hero__coming-text {
        letter-spacing: 0.3em;
      }

      .r88-intro,
      .r88-specs,
      .r88-engine,
      .r88-avionics,
      .r88-timeline,
      .r88-cta {
        padding: 3rem 1.5rem;
      }

      /* CTA section: let inner elements shrink below ~380px */
      .r88-cta {
        padding: 3rem 1rem;
      }
      .r88-cta__content,
      .r88-cta__form,
      .r88-cta__benefits-card,
      .r88-cta__benefit,
      .r88-cta__toggle,
      .r88-cta__contact {
        min-width: 0;
      }
      .r88-cta__toggle {
        padding: 0;
        margin-bottom: 2rem;
        flex-wrap: wrap;
      }
      .r88-cta__toggle-btn {
        flex: 1 1 0;
        min-width: 0;
        padding: 0.6rem 0.5rem;
        font-size: 0.7rem;
        letter-spacing: 0.08em;
      }
      .r88-cta__form {
        padding: 1rem;
      }
      .r88-cta__form h3 {
        font-size: 1.1rem;
        margin-bottom: 1.25rem;
      }
      .r88-cta__benefits-card {
        padding: 0.85rem 1rem;
      }
      .r88-cta__benefit {
        font-size: 0.9rem;
        gap: 0.75rem;
      }
      .r88-cta__benefit span {
        min-width: 0;
        flex: 1 1 auto;
      }
      .r88-cta__benefit i {
        width: 32px;
        height: 32px;
        min-width: 32px;
        min-height: 32px;
        font-size: 0.85rem;
      }
      .r88-cta__lead {
        font-size: 1rem;
      }
      .r88-cta__form input,
      .r88-cta__form select,
      .r88-cta__form textarea,
      .r88-select__trigger {
        padding: 0.85rem 0.9rem;
        font-size: 0.9rem;
      }
      .r88-btn--submit {
        padding: 0.9rem 1rem;
        font-size: 0.85rem;
      }
    }
  `}</style>
);

// ============================================================================
// MAIN PAGE COMPONENT
// ============================================================================
function AircraftR88() {
  useCmsHighlight();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="r88-page">
      <R88Styles />
      <R88Header />
      <main>
        <R88Hero />
        <div className="r88-sticky-stack">
          <R88Highlights />
          <R88Introduction />
        </div>
        <R88Gallery />
        <R88Engine />
        <R88Avionics />
        <R88CTA />
      </main>
      <FooterMinimal />
    </div>
  );
}

export default AircraftR88;

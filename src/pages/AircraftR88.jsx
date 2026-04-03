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
  { label: 'Configuration', value: 'Dual Pilot + 8 Pax', icon: 'fa-user-friends' },
  { label: 'Range', value: '350+ nm', icon: 'fa-route' },
  { label: 'Endurance', value: '3.5+ hrs', icon: 'fa-clock' },
  { label: 'Cabin Volume', value: '~275 cu ft', icon: 'fa-cube' },
  { label: 'Internal Payload', value: '2,800 lbs', icon: 'fa-weight-hanging' },
  { label: 'Starting Price', value: '$3.3M', icon: 'fa-tag' },
  { label: 'Orders Secured', value: '150+', icon: 'fa-clipboard-check' },
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
    status: 'active'
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

const engineFeatures = [
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
    stat: '2,500+',
    statLabel: 'Service Centers',
  },
  {
    title: 'Strategic Partnership',
    description: 'Robinson\'s first major engine partnership outside Lycoming/Rolls-Royce signals a new era of capability and market positioning.',
    stat: '1st',
    statLabel: 'Safran Partnership',
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
// SECTION 2: Introduction - Robinson's Bold New Chapter
// ============================================================================
function R88Introduction() {
  return (
    <section className="r88-intro">
      <div className="r88-intro__container">
        <div className="r88-intro__content">
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
            <p className="r88-intro__text">
              Announced in March 2025 at Verticon to immediate acclaim, the R88 has
              already secured over 150 orders worldwide - a testament to the industry's
              confidence in Robinson's newest creation.
            </p>
          </Reveal>
        </div>
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
      </div>
    </section>
  );
}

// ============================================================================
// SECTION 3: Technical Specifications
// ============================================================================
function R88Specifications() {
  const [activeSpec, setActiveSpec] = useState(null);
  const [expandedCard, setExpandedCard] = useState(null);

  return (
    <section className="r88-specs">
      <div className="r88-specs__container">
        <Reveal>
          <div className="r88-section-header r88-section-header--center">
            <span className="r88-pre-text">PERFORMANCE DATA</span>
            <h2>
              <span className="r88-text--dark">Technical</span>{' '}
              <span className="r88-text--mid">Specifications</span>
            </h2>
            <p className="r88-section-subtext">
              Preliminary specifications based on announced data. Subject to change during development.
            </p>
          </div>
        </Reveal>

        <div className="r88-specs__grid">
          {r88Specs.map((spec, i) => (
            <Reveal key={i} delay={i * 0.05}>
              <motion.div
                className={`r88-specs__item ${activeSpec === i ? 'active' : ''}`}
                onHoverStart={() => setActiveSpec(i)}
                onHoverEnd={() => setActiveSpec(null)}
                whileHover={{ scale: 1.02, y: -4 }}
                onClick={() => setExpandedCard(expandedCard === i ? null : i)}
              >
                <div className="r88-specs__icon">
                  <i className={`fas ${spec.icon}`}></i>
                </div>
                <div className="r88-specs__data">
                  <span className="r88-specs__label">{spec.label}</span>
                  <span className="r88-specs__value">{spec.value}</span>
                </div>
                <div className="r88-specs__indicator" />
              </motion.div>
            </Reveal>
          ))}
        </div>

        <Reveal delay={0.5}>
          <div className="r88-specs__highlight">
            <div className="r88-specs__highlight-item">
              <div className="r88-specs__highlight-icon">
                <i className="fas fa-expand-arrows-alt"></i>
              </div>
              <div className="r88-specs__highlight-content">
                <h4>Cabin Volume</h4>
                <span className="r88-specs__highlight-value">~275 cu ft</span>
                <p>Spacious passenger cabin designed for utility operations</p>
              </div>
            </div>
            <div className="r88-specs__highlight-divider" />
            <div className="r88-specs__highlight-item">
              <div className="r88-specs__highlight-icon">
                <i className="fas fa-weight-hanging"></i>
              </div>
              <div className="r88-specs__highlight-content">
                <h4>Internal Payload</h4>
                <span className="r88-specs__highlight-value">2,800 lbs</span>
                <p>Predicted payload for maximum utility capability</p>
              </div>
            </div>
            <div className="r88-specs__highlight-divider" />
            <div className="r88-specs__highlight-item">
              <div className="r88-specs__highlight-icon">
                <i className="fas fa-dollar-sign"></i>
              </div>
              <div className="r88-specs__highlight-content">
                <h4>Starting Price</h4>
                <span className="r88-specs__highlight-value">$3.3M</span>
                <p>Standard configuration pricing (estimated)</p>
              </div>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

// ============================================================================
// SECTION 4: Engine Partnership - Safran Arriel 2W
// ============================================================================
function R88Engine() {
  return (
    <section className="r88-engine">
      <div className="r88-engine__container">
        <div className="r88-engine__layout">
          {/* Left column — text */}
          <div className="r88-engine__text">
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
              <div className="r88-engine__intro">
                <p className="r88-engine__lead">
                  The R88 marks Robinson's historic first partnership with Safran Helicopter
                  Engines, selecting the proven Arriel 2W turboshaft to power their most
                  ambitious helicopter yet.
                </p>
                <p>
                  The Safran Arriel family represents one of the most successful turboshaft
                  engine programs in aviation history, with over 30 million flight hours
                  accumulated across the global fleet. This partnership signals Robinson's
                  commitment to delivering a world-class utility helicopter.
                </p>
              </div>
            </Reveal>
          </div>

          {/* Right column — cards + badge */}
          <div className="r88-engine__right">
            <div className="r88-engine__grid">
              {engineFeatures.map((feature, i) => (
                <Reveal key={i} delay={0.3 + i * 0.1}>
                  <motion.div
                    className="r88-engine__card"
                    whileHover={{ y: -4 }}
                    transition={{ duration: 0.3 }}
                  >
                    <div className="r88-engine__stat">
                      <span className="r88-engine__stat-value">{feature.stat}</span>
                      <span className="r88-engine__stat-label">{feature.statLabel}</span>
                    </div>
                    <h3>{feature.title}</h3>
                    <p>{feature.description}</p>
                  </motion.div>
                </Reveal>
              ))}
            </div>

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
        <Reveal>
          <div className="r88-section-header r88-section-header--center">
            <span className="r88-pre-text">FLIGHT DECK</span>
            <h2>
              <span className="r88-text--dark">Garmin</span>{' '}
              <span className="r88-text--mid">Glass Cockpit</span>
            </h2>
          </div>
        </Reveal>

        <div className="r88-avionics__grid">
          {avionicsFeatures.map((feature, i) => (
            <Reveal key={i} delay={i * 0.15}>
              <motion.div
                className="r88-avionics__card"
                whileHover={{ y: -8 }}
                transition={{ duration: 0.3 }}
              >
                <div className="r88-avionics__icon">
                  <i className={`fas ${feature.icon}`}></i>
                </div>
                <h3>{feature.title}</h3>
                <p>{feature.description}</p>
              </motion.div>
            </Reveal>
          ))}
        </div>


      </div>
    </section>
  );
}

// ============================================================================
// SECTION 5B: Gallery - R88 Up Close
// ============================================================================
const galleryImages = [
  { src: '/assets/images/new-aircraft/r88/rhc-r88-3-spotlights-left-side-atmospheric-effect-21794_2.jpg', alt: 'R88 dramatic side view with spotlights', label: 'Exterior', span: 'wide' },
  { src: '/assets/images/new-aircraft/r88/rhc-r88-glass-flight-displays-right-side-cyclic-13216.jpg', alt: 'R88 Garmin glass cockpit displays', label: 'Glass Cockpit' },
  { src: '/assets/images/new-aircraft/r88/rhc-r88-seat-logo-emboss-angle-shot-13559.jpg', alt: 'R88 embossed seat logo detail', label: 'Seat Detail' },
  { src: '/assets/images/new-aircraft/r88/rhc-r88-2-plus-eight-seats.jpg', alt: 'R88 full cabin with 2+8 seating', label: 'Cabin', span: 'wide' },
  { src: '/assets/images/new-aircraft/r88/rhc-r88-left-side-three-quarter-front-view-21797.jpg', alt: 'R88 three-quarter front view', label: 'Front Quarter' },
  { src: '/assets/images/new-aircraft/r88/rhc-r88-rear-cargo-door-open-acute-view-13595.jpg', alt: 'R88 rear cargo door open', label: 'Cargo Door' },
  { src: '/assets/images/new-aircraft/r88/rhc-r88-left-and-right-pilot-seats-13528.jpg', alt: 'R88 pilot seats', label: 'Pilot Seats' },
  { src: '/assets/images/new-aircraft/r88/rhc-r88-atmospheric-effect-front-view-218022.jpg', alt: 'R88 dramatic front view', label: 'Front View', span: 'wide' },
];

function R88Gallery() {
  const [lightboxIdx, setLightboxIdx] = useState(null);

  return (
    <section className="r88-gallery">
      <div className="r88-gallery__container">
        <Reveal>
          <div className="r88-section-header">
            <span className="r88-pre-text">GALLERY</span>
            <h2>
              <span className="r88-text--dark">Up Close</span>{' '}
              <span className="r88-text--mid">with the R88</span>
            </h2>
          </div>
        </Reveal>

        <div className="r88-gallery__grid">
          {galleryImages.map((img, i) => (
            <Reveal key={i} delay={i * 0.05}>
              <motion.div
                className={`r88-gallery__item ${img.span === 'wide' ? 'r88-gallery__item--wide' : ''}`}
                whileHover={{ scale: 1.02 }}
                transition={{ duration: 0.3 }}
                onClick={() => setLightboxIdx(i)}
              >
                <img src={img.src} alt={img.alt} loading="lazy" />
                <div className="r88-gallery__overlay">
                  <span className="r88-gallery__label">{img.label}</span>
                </div>
              </motion.div>
            </Reveal>
          ))}
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
              src={galleryImages[lightboxIdx].src}
              alt={galleryImages[lightboxIdx].alt}
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
            {lightboxIdx < galleryImages.length - 1 && (
              <button
                className="r88-gallery__lightbox-nav r88-gallery__lightbox-nav--next"
                onClick={(e) => { e.stopPropagation(); setLightboxIdx(lightboxIdx + 1); }}
              >
                <i className="fas fa-chevron-right"></i>
              </button>
            )}
            <span className="r88-gallery__lightbox-count">
              {lightboxIdx + 1} / {galleryImages.length}
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
function R88Timeline() {
  return (
    <section className="r88-timeline">
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
              <div className={`r88-timeline__item r88-timeline__item--${event.status}`}>
                <div className="r88-timeline__marker">
                  {event.status === 'completed' && <i className="fas fa-check"></i>}
                  {event.status === 'active' && <div className="r88-timeline__pulse" />}
                  {event.status === 'upcoming' && <div className="r88-timeline__dot" />}
                </div>
                <div className="r88-timeline__content">
                  <span className="r88-timeline__year">{event.year}</span>
                  <h4>{event.title}</h4>
                  <p>{event.description}</p>
                </div>
              </div>
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
// SECTION 7: Reserve/Contact CTA
// ============================================================================
function R88CTA() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    interest: 'purchase',
    message: ''
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    // Form submission logic would go here
    alert('Thank you for your interest in the R88! Our team will contact you shortly.');
  };

  return (
    <section id="register" className="r88-cta">
      <div className="r88-cta__container">
        <div className="r88-cta__content">
          <Reveal>
            <div className="r88-section-header">
              <span className="r88-pre-text r88-pre-text--light">BE AMONG THE FIRST</span>
              <h2>
                <span style={{ color: '#fff' }}>Register Your</span>{' '}
                <span style={{ color: 'rgba(255,255,255,0.7)' }}>Interest</span>
              </h2>
            </div>
          </Reveal>

          <Reveal delay={0.2}>
            <p className="r88-cta__lead">
              With over 150 orders already secured, the R88 is generating unprecedented
              interest worldwide. Be among the first to receive updates on development
              milestones, certification progress, and delivery timelines.
            </p>
          </Reveal>

          <Reveal delay={0.3}>
            <div className="r88-cta__benefits">
              <div className="r88-cta__benefit">
                <i className="fas fa-bell"></i>
                <span>Priority Development Updates</span>
              </div>
              <div className="r88-cta__benefit">
                <i className="fas fa-calendar-check"></i>
                <span>Early Delivery Slot Access</span>
              </div>
              <div className="r88-cta__benefit">
                <i className="fas fa-headset"></i>
                <span>Direct Sales Consultation</span>
              </div>
            </div>
          </Reveal>
        </div>

        <Reveal delay={0.4} direction="right">
          <form className="r88-cta__form" onSubmit={handleSubmit}>
            <h3>Express Your Interest</h3>
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
              <select
                value={formData.interest}
                onChange={(e) => setFormData({ ...formData, interest: e.target.value })}
              >
                <option value="purchase">Interested in Purchasing</option>
                <option value="information">Requesting Information</option>
                <option value="demo">Demo/Test Flight</option>
                <option value="fleet">Fleet Operator</option>
                <option value="other">Other Inquiry</option>
              </select>
            </div>
            <div className="r88-cta__form-group">
              <textarea
                placeholder="Additional Comments"
                rows="3"
                value={formData.message}
                onChange={(e) => setFormData({ ...formData, message: e.target.value })}
              />
            </div>
            <button type="submit" className="r88-btn r88-btn--submit">
              Submit Interest
              <i className="fas fa-paper-plane"></i>
            </button>
          </form>
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

    .r88-text--dark { color: #1a1a1a; }
    .r88-text--mid { color: #4a4a4a; }
    .r88-text--light { color: #7a7a7a; }

    .r88-section-header {
      margin-bottom: 3rem;
    }

    .r88-section-header--center {
      text-align: center;
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
       INTRODUCTION SECTION
       ==================================================================== */
    .r88-intro {
      padding: 4rem 2rem;
      background: #faf9f6;
    }

    .r88-intro__container {
      max-width: 1400px;
      margin: 0 auto;
      display: grid;
      grid-template-columns: 1.2fr 1fr;
      gap: 4rem;
      align-items: center;
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
      padding: 4rem 2rem;
      background: #fff;
    }

    .r88-specs__container {
      max-width: 1200px;
      margin: 0 auto;
    }

    .r88-specs__grid {
      display: grid;
      grid-template-columns: repeat(5, 1fr);
      gap: 1rem;
      margin: 3rem 0;
    }

    .r88-specs__item {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 0.75rem;
      padding: 1.5rem 1rem;
      background: #faf9f6;
      border: 1px solid transparent;
      border-radius: 4px;
      transition: all 0.3s ease;
      cursor: pointer;
      position: relative;
      overflow: hidden;
    }

    .r88-specs__item:hover,
    .r88-specs__item.active {
      border-color: #1a1a1a;
      background: #fff;
      box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
    }

    .r88-specs__indicator {
      position: absolute;
      bottom: 0;
      left: 0;
      right: 0;
      height: 2px;
      background: #1a1a1a;
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
      background: #1a1a1a;
      border-radius: 50%;
      color: #fff;
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
      color: #999;
      margin-bottom: 0.25rem;
    }

    .r88-specs__value {
      display: block;
      font-family: 'Space Grotesk', sans-serif;
      font-size: 1rem;
      font-weight: 500;
      color: #1a1a1a;
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
      background: #faf9f6;
    }

    .r88-engine__container {
      max-width: 1200px;
      margin: 0 auto;
    }

    .r88-engine__layout {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 4rem;
      align-items: start;
    }

    .r88-engine__text {
      position: sticky;
      top: 6rem;
    }

    .r88-engine__intro {
      margin-bottom: 0;
    }

    .r88-engine__lead {
      font-family: 'Space Grotesk', sans-serif;
      font-size: 1.35rem;
      line-height: 1.7;
      color: #1a1a1a;
      margin-bottom: 1.5rem;
    }

    .r88-engine__intro p {
      font-family: 'Space Grotesk', sans-serif;
      font-size: 1.1rem;
      line-height: 1.8;
      color: #4a4a4a;
    }

    .r88-engine__grid {
      display: grid;
      grid-template-columns: repeat(2, 1fr);
      gap: 1.25rem;
    }

    .r88-engine__card {
      background: #fff;
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
    }

    .r88-engine__partner-badge {
      display: block;
      padding: 1.5rem 2rem;
      background: #1a1a1a;
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
      padding: 4rem 2rem;
      background: #fff;
    }

    .r88-avionics__container {
      max-width: 1200px;
      margin: 0 auto;
    }

    .r88-avionics__grid {
      display: grid;
      grid-template-columns: repeat(4, 1fr);
      gap: 1.5rem;
      margin: 3rem 0;
    }

    .r88-avionics__card {
      padding: 2rem;
      background: #faf9f6;
      border-radius: 4px;
      transition: all 0.3s ease;
    }

    .r88-avionics__card:hover {
      background: #fff;
      box-shadow: 0 10px 40px rgba(0, 0, 0, 0.1);
    }

    .r88-avionics__icon {
      width: 50px;
      height: 50px;
      display: flex;
      align-items: center;
      justify-content: center;
      background: #1a1a1a;
      color: #fff;
      border-radius: 4px;
      margin-bottom: 1.5rem;
      font-size: 1.25rem;
    }

    .r88-avionics__card h3 {
      font-family: 'Space Grotesk', sans-serif;
      font-size: 1.15rem;
      font-weight: 500;
      color: #1a1a1a;
      margin: 0 0 1rem;
    }

    .r88-avionics__card p {
      font-family: 'Space Grotesk', sans-serif;
      font-size: 0.9rem;
      line-height: 1.7;
      color: #666;
      margin: 0;
    }

    .r88-avionics__highlight {
      display: flex;
      align-items: center;
      justify-content: space-between;
      background: linear-gradient(135deg, #1a1a1a 0%, #2a2a2a 100%);
      padding: 3rem;
      border-radius: 8px;
      margin-top: 3rem;
    }

    .r88-avionics__highlight-content {
      max-width: 600px;
    }

    .r88-avionics__highlight-content h3 {
      font-family: 'Space Grotesk', sans-serif;
      font-size: 1.5rem;
      font-weight: 500;
      color: #fff;
      margin: 0 0 1rem;
    }

    .r88-avionics__highlight-content p {
      font-family: 'Space Grotesk', sans-serif;
      font-size: 1rem;
      line-height: 1.7;
      color: rgba(255, 255, 255, 0.7);
      margin: 0;
    }

    .r88-avionics__highlight-badge {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      width: 150px;
      height: 150px;
      border: 2px solid rgba(255, 255, 255, 0.2);
      border-radius: 50%;
      text-align: center;
    }

    .r88-avionics__highlight-badge span:first-child {
      font-family: 'Share Tech Mono', monospace;
      font-size: 0.65rem;
      letter-spacing: 0.1em;
      text-transform: uppercase;
      color: rgba(255, 255, 255, 0.5);
    }

    .r88-avionics__highlight-badge span:last-child {
      font-family: 'Space Grotesk', sans-serif;
      font-size: 0.9rem;
      font-weight: 500;
      color: #fff;
      margin-top: 0.25rem;
    }

    /* ====================================================================
       GALLERY SECTION
       ==================================================================== */
    .r88-gallery {
      padding: 0 2rem 6rem;
      background: #fff;
    }

    .r88-gallery__container {
      max-width: 1200px;
      margin: 0 auto;
    }

    .r88-gallery__grid {
      display: grid;
      grid-template-columns: repeat(4, 1fr);
      gap: 0.75rem;
      margin-top: 3rem;
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
      .r88-gallery__grid {
        grid-template-columns: repeat(2, 1fr);
      }
      .r88-gallery__item--wide {
        grid-column: span 2;
      }
    }

    @media (max-width: 480px) {
      .r88-gallery__grid {
        grid-template-columns: 1fr;
      }
      .r88-gallery__item--wide {
        grid-column: span 1;
      }
    }

    /* ====================================================================
       TIMELINE SECTION
       ==================================================================== */
    .r88-timeline {
      padding: 4rem 2rem;
      background: #faf9f6;
    }

    .r88-timeline__container {
      max-width: 900px;
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
      margin-bottom: 0.75rem;
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

    .r88-timeline__status {
      margin-top: 4rem;
      text-align: center;
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
    }

    .r88-cta__benefit i {
      width: 40px;
      height: 40px;
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

    .r88-cta__form select {
      cursor: pointer;
    }

    .r88-cta__form select option {
      background: #1a1a1a;
      color: #fff;
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
      .r88-specs__grid {
        grid-template-columns: repeat(4, 1fr);
      }

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
      .r88-intro__container,
      .r88-cta__container {
        grid-template-columns: 1fr;
      }

      .r88-engine__layout {
        grid-template-columns: 1fr;
        gap: 3rem;
      }

      .r88-engine__text {
        position: static;
      }

      .r88-engine__grid,
      .r88-avionics__grid {
        grid-template-columns: repeat(2, 1fr);
      }

      .r88-specs__grid {
        grid-template-columns: repeat(3, 1fr);
      }

      .r88-avionics__highlight {
        flex-direction: column;
        gap: 2rem;
        text-align: center;
      }

      .r88-avionics__highlight-content {
        max-width: 100%;
      }
    }

    @media (max-width: 768px) {
      .r88-hero__badges {
        flex-direction: column;
        gap: 1.5rem;
      }

      .r88-hero__badge-divider {
        width: 50px;
        height: 1px;
      }

      .r88-specs__grid {
        grid-template-columns: repeat(2, 1fr);
      }

      .r88-engine__grid,
      .r88-avionics__grid {
        grid-template-columns: 1fr;
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

      .r88-specs__grid {
        grid-template-columns: 1fr;
      }

      .r88-intro,
      .r88-specs,
      .r88-engine,
      .r88-avionics,
      .r88-timeline,
      .r88-cta {
        padding: 3rem 1.5rem;
      }
    }
  `}</style>
);

// ============================================================================
// MAIN PAGE COMPONENT
// ============================================================================
function AircraftR88() {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="r88-page">
      <R88Styles />
      <R88Header />
      <main>
        <R88Hero />
        <R88Introduction />
        <R88Specifications />
        <R88Engine />
        <R88Avionics />
        <R88Gallery />
        <R88Timeline />
        <R88CTA />
      </main>
      <FooterMinimal />
    </div>
  );
}

export default AircraftR88;

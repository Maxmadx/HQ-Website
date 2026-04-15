/**
 * HQ AVIATION - ROBINSON R44 AIRCRAFT PAGE
 *
 * A comprehensive showcase of the Robinson R44 helicopter featuring:
 * - Full viewport hero with animated title
 * - History timeline (First flight 1990, certified 1992, 6,500+ built)
 * - Technical specifications interactive card
 * - Flight characteristics section
 * - Captain Quentin Smith achievement section (CRITICAL)
 * - Variants showcase (Raven I, Raven II, Cadet, Clipper)
 * - Expeditions map showing Captain Q's routes
 * - Image gallery
 * - CTA sections
 *
 * Brand: Luxury Minimal Aviation
 * Typography: Space Grotesk (headlines) + Share Tech Mono (technical data)
 * Colors: #faf9f6 (warm white), #1a1a1a (charcoal), #4a4a4a (mid), #7a7a7a (light)
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
// COMPONENT 1: R44Header - Page Header with Spotlight Animation
// ============================================================================
function R44Header() {
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
              <li><Link to="/training/type-rating" onClick={closeMenu}>Type Ratings</Link></li>
            </ul>
          </div>
          <div className="hq-menu-section">
            <h3>Services</h3>
            <ul>
              <li><Link to="/services" onClick={closeMenu}>Services Overview</Link></li>
              <li><Link to="/maintenance" onClick={closeMenu}>Maintenance</Link></li>
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
// COMPONENT 2: Reveal Animation Wrapper
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
// COMPONENT 3: AnimatedNumber
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
// R44 DATA
// ============================================================================
const r44Specs = {
  engine: 'Lycoming IO-540-AE1A5',
  engineType: '6-cylinder air-cooled horizontally-opposed piston',
  power: '245 HP',
  maxSpeed: '130 kts',
  cruiseSpeed: '117 kts',
  range: '300 nm',
  rangeAux: '~400 mi',
  usefulLoad: '900 lbs',
  seats: 4,
  rotorDiameter: '33 ft',
  rotorSystem: 'Semi-rigid two-blade',
  emptyWeight: '1500 lbs',
  maxWeight: '2500 lbs',
  fuelCapacity: '45 gal',
  ceiling: '14,000 ft',
  endurance: '3.5 hrs',
};

// Detailed variant comparison data
const variantComparison = {
  ravenI: {
    name: 'Raven I',
    introduced: '1993',
    engine: 'Lycoming O-540-F1B5',
    engineType: 'Carbureted',
    power: '260 HP derated to 225 HP',
    maxGrossWeight: '2,400 lbs',
    blades: 'Standard width',
    fuelSystem: 'Carbureted',
    altitudePerformance: 'Standard',
    bestFor: 'Training, personal use, cost-conscious operators',
  },
  ravenII: {
    name: 'Raven II',
    introduced: '2002',
    engine: 'Lycoming IO-540-AE1A5',
    engineType: 'Fuel-injected',
    power: '245 HP',
    maxGrossWeight: '2,500 lbs',
    blades: 'Wider blades',
    fuelSystem: 'Fuel-injected',
    altitudePerformance: 'Superior hot & high',
    bestFor: 'Touring, commercial ops, high altitude',
  },
  cadet: {
    name: 'Cadet',
    introduced: 'Nov 2015',
    engine: 'Lycoming IO-540-AE1A5',
    engineType: 'Fuel-injected',
    power: '210 HP takeoff / 185 HP continuous',
    maxGrossWeight: '2,200 lbs',
    blades: 'Wider blades',
    fuelSystem: 'Fuel-injected',
    altitudePerformance: 'Good',
    configuration: 'Cargo area instead of back seats',
    bestFor: 'Flight training, two-person operations',
  },
};

const r44Timeline = [
  { year: '1986', title: 'Development Begins', desc: 'Frank Robinson begins R44 development program' },
  { year: '1990', title: 'First Flight', desc: 'R44 prototype makes its first flight on March 31st' },
  { year: '1992', title: 'FAA Certification', desc: 'Receives FAA Type Certificate for production' },
  { year: '2002', title: 'Raven II Launch', desc: 'Fuel-injected Raven II model introduced' },
  { year: '2016', title: 'Cadet Introduced', desc: 'Two-seat training variant launches' },
  { year: '2024', title: '6,500+ Built', desc: 'Over 6,500 R44s delivered worldwide' },
];

const autopilotModes = [
  {
    mode: 'ALT',
    name: 'Altitude Hold',
    description: 'Automatically maintains selected altitude, reducing pilot workload during cruise flight.',
  },
  {
    mode: 'HDG',
    name: 'Heading Select',
    description: 'Holds or intercepts selected headings, simplifying navigation and traffic pattern work.',
  },
  {
    mode: 'NAV',
    name: 'Navigation Mode',
    description: 'Tracks GPS flight plans and VOR courses for hands-off enroute navigation.',
  },
  {
    mode: 'APR',
    name: 'Approach Mode',
    description: 'Provides precise lateral and vertical guidance during instrument approaches.',
  },
];

const r44Variants = [
  {
    name: 'R44 Raven I',
    description: 'The original carbureted model with hydraulic controls. Reliable and economical for training and personal use.',
    engine: 'Lycoming O-540 (carbureted)',
    power: '245 HP derated',
    features: ['Hydraulic controls', 'Carbureted engine', 'Cost-effective operation'],
    image: '/assets/images/new-aircraft/r44/r44-cutout.png',
  },
  {
    name: 'R44 Raven II',
    description: 'The fuel-injected evolution offering improved hot and high performance. The most popular R44 variant.',
    engine: 'Lycoming IO-540 (fuel-injected)',
    power: '260 HP',
    features: ['Fuel injection', 'Better hot/high performance', 'Increased useful load'],
    image: '/assets/images/new-aircraft/r44/raven-ii-front-alpha.png',
  },
  {
    name: 'R44 Cadet',
    description: 'Purpose-built two-seat trainer with rear baggage area. Ideal for flight schools.',
    engine: 'Lycoming IO-540 (fuel-injected)',
    power: '260 HP',
    features: ['2-seat configuration', 'Large baggage area', 'Training optimized'],
    image: '/assets/images/new-aircraft/r44/r44-cutout.png',
  },
  {
    name: 'R44 Clipper',
    description: 'Amphibious version with pop-out floats. Versatile for water operations.',
    engine: 'Lycoming IO-540 (fuel-injected)',
    power: '260 HP',
    features: ['Pop-out floats', 'Water landing capable', 'Versatile operations'],
    image: '/assets/images/new-aircraft/r44/raven-ii-front-alpha.png',
  },
];

const expeditionRoutes = [
  { name: 'North Pole Flight', year: '2019', coords: '90.0000°N', distance: '3,500 nm' },
  { name: 'South Pole Expedition', year: '2021', coords: '90.0000°S', distance: '4,200 nm' },
  { name: 'First Circumnavigation', year: '2016', coords: 'Global', distance: '26,000 nm' },
  { name: 'Second Circumnavigation', year: '2022', coords: 'Both Poles', distance: '31,000 nm' },
];

const galleryImages = [
  '/assets/images/new-aircraft/r44/r44-cutout.png',
  '/assets/images/new-aircraft/r44/raven-ii-front-alpha.png',
  '/assets/images/new-aircraft/r44/r44blueprint.jpg',
  '/assets/images/used-aircraft/r44/r44-south-pole.jpg',
  '/assets/images/expeditions/antartica.jpg',
  '/assets/images/expeditions/north-pole.jpg',
];

// ============================================================================
// COMPONENT 4: R44Hero - Full Viewport Hero
// ============================================================================
function R44Hero() {
  const heroRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ['start start', 'end start'],
  });

  const heroOpacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);
  const heroScale = useTransform(scrollYProgress, [0, 0.5], [1, 0.95]);
  const heroY = useTransform(scrollYProgress, [0, 0.5], [0, 100]);
  const imageY = useTransform(scrollYProgress, [0, 1], [0, -100]);

  return (
    <section ref={heroRef} className="r44-hero">
      <motion.div
        className="r44-hero__bg"
        style={{ y: imageY }}
      >
        <img src="/assets/images/new-aircraft/r44/raven-ii-front-alpha.png" alt="Robinson R44 Raven II" />
      </motion.div>

      <div className="r44-hero__overlay" />

      <motion.div
        className="r44-hero__content"
        style={{ opacity: heroOpacity, scale: heroScale, y: heroY }}
      >
        <motion.span
          className="r44-hero__label"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          THE WORLD'S BEST-SELLING CIVIL HELICOPTER
        </motion.span>

        <div className="r44-hero__headline">
          <motion.span
            className="r44-hero__word r44-hero__word--1"
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4, ease: [0.16, 1, 0.3, 1] }}
          >
            ROBINSON
          </motion.span>
          <motion.span
            className="r44-hero__word r44-hero__word--2"
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6, ease: [0.16, 1, 0.3, 1] }}
          >
            R44
          </motion.span>
        </div>

        <motion.div
          className="r44-hero__divider"
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ duration: 0.8, delay: 0.8 }}
        />

        <motion.p
          className="r44-hero__sub"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1 }}
        >
          The helicopter that has redefined private aviation. With over 6,500 units
          delivered worldwide, the R44 is the benchmark for reliability, performance,
          and value in four-seat helicopters.
        </motion.p>

        <motion.div
          className="r44-hero__badges"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.2 }}
        >
          <div className="r44-hero__badge">
            <span className="r44-hero__badge-value">6,500+</span>
            <span className="r44-hero__badge-label">Built</span>
          </div>
          <div className="r44-hero__badge-divider" />
          <div className="r44-hero__badge">
            <span className="r44-hero__badge-value">1992</span>
            <span className="r44-hero__badge-label">Certified</span>
          </div>
          <div className="r44-hero__badge-divider" />
          <div className="r44-hero__badge">
            <span className="r44-hero__badge-value">4</span>
            <span className="r44-hero__badge-label">Seats</span>
          </div>
        </motion.div>
      </motion.div>

      <motion.div
        className="r44-hero__scroll"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5 }}
      >
        <span>Scroll to explore</span>
        <div className="r44-hero__scroll-line">
          <div className="r44-hero__scroll-dot" />
        </div>
      </motion.div>
    </section>
  );
}

// ============================================================================
// COMPONENT 5: R44Intro - Introduction Section
// ============================================================================
function R44Intro() {
  return (
    <section className="r44-intro">
      <div className="r44-intro__container">
        <Reveal>
          <div className="r44-intro__header">
            <span className="r44-pre-text">Since 1992</span>
            <h2>
              <span className="r44-text--dark">The</span>{' '}
              <span className="r44-text--mid">Benchmark</span>{' '}
              <span className="r44-text--light">For Excellence</span>
            </h2>
            <p>
              When Frank Robinson set out to create a four-seat helicopter, he envisioned
              an aircraft that would make helicopter ownership accessible without compromising
              on quality or performance. The result was the R44 - a helicopter that has sold
              more units than any other civil helicopter in history.
            </p>
            <p>
              From private owners to flight schools, aerial tour operators to law enforcement,
              the R44's versatility and reliability have made it the helicopter of choice
              for discerning pilots worldwide.
            </p>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

// ============================================================================
// COMPONENT 6: R44Counter - Statistics Bar
// ============================================================================
function R44Counter() {
  const stats = [
    { value: 6500, suffix: '+', label: 'Aircraft Delivered' },
    { value: 10, suffix: 'M+', label: 'Fleet Flight Hours' },
    { value: 100, suffix: '+', label: 'Countries Operating' },
    { value: 32, suffix: '+', label: 'Years In Production' },
  ];

  return (
    <section className="r44-counter">
      <div className="r44-counter__container">
        {stats.map((stat, i) => (
          <Reveal key={i} delay={i * 0.1}>
            <div className="r44-counter__item">
              <span className="r44-counter__value">
                <AnimatedNumber value={stat.value} suffix={stat.suffix} />
              </span>
              <span className="r44-counter__label">{stat.label}</span>
            </div>
          </Reveal>
        ))}
      </div>
    </section>
  );
}

// ============================================================================
// COMPONENT 7: R44History - Timeline Section
// ============================================================================
function R44History() {
  return (
    <section className="r44-history">
      <div className="r44-history__container">
        <Reveal>
          <div className="r44-section-header">
            <span className="r44-pre-text">Heritage</span>
            <h2>
              <span className="r44-text--dark">A Legacy</span>{' '}
              <span className="r44-text--mid">Of Innovation</span>
            </h2>
          </div>
        </Reveal>

        <div className="r44-history__track">
          <div className="r44-history__line" />
          {r44Timeline.map((event, i) => (
            <Reveal key={i} delay={i * 0.1}>
              <motion.div
                className="r44-history__event"
                whileHover={{ y: -5 }}
              >
                <div className="r44-history__dot" />
                <div className="r44-history__year">{event.year}</div>
                <h4 className="r44-history__title">{event.title}</h4>
                <p className="r44-history__desc">{event.desc}</p>
              </motion.div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

// ============================================================================
// COMPONENT 8: R44Specs - Interactive Technical Specifications
// ============================================================================
function R44Specs() {
  const [activeTab, setActiveTab] = useState('performance');

  const specCategories = {
    performance: [
      { label: 'Max Speed', value: r44Specs.maxSpeed },
      { label: 'Cruise Speed', value: r44Specs.cruiseSpeed },
      { label: 'Range', value: r44Specs.range },
      { label: 'Range (Aux Tank)', value: r44Specs.rangeAux },
      { label: 'Service Ceiling', value: r44Specs.ceiling },
      { label: 'Endurance', value: r44Specs.endurance },
    ],
    powerplant: [
      { label: 'Engine', value: r44Specs.engine },
      { label: 'Power Output', value: r44Specs.power },
      { label: 'Fuel Capacity', value: r44Specs.fuelCapacity },
    ],
    dimensions: [
      { label: 'Seats', value: r44Specs.seats.toString() },
      { label: 'Rotor Diameter', value: r44Specs.rotorDiameter },
      { label: 'Empty Weight', value: r44Specs.emptyWeight },
      { label: 'Max Weight', value: r44Specs.maxWeight },
      { label: 'Useful Load', value: r44Specs.usefulLoad },
    ],
  };

  return (
    <section className="r44-specs">
      <div className="r44-specs__container">
        <div className="r44-specs__visual">
          <Reveal direction="left">
            <img
              src="/assets/images/new-aircraft/r44/r44blueprint.jpg"
              alt="R44 Technical Blueprint"
              className="r44-specs__blueprint"
            />
          </Reveal>
        </div>

        <div className="r44-specs__data">
          <Reveal direction="right">
            <div className="r44-section-header r44-section-header--left">
              <span className="r44-pre-text">Technical Data</span>
              <h2>
                <span className="r44-text--dark">Specifications</span>
              </h2>
            </div>

            <div className="r44-specs__tabs">
              {['performance', 'powerplant', 'dimensions'].map((tab) => (
                <button
                  key={tab}
                  className={`r44-specs__tab ${activeTab === tab ? 'active' : ''}`}
                  onClick={() => setActiveTab(tab)}
                >
                  {tab.charAt(0).toUpperCase() + tab.slice(1)}
                </button>
              ))}
            </div>

            <AnimatePresence mode="wait">
              <motion.div
                key={activeTab}
                className="r44-specs__grid"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
              >
                {specCategories[activeTab].map((spec, i) => (
                  <div key={i} className="r44-specs__item">
                    <span className="r44-specs__label">{spec.label}</span>
                    <span className="r44-specs__value">{spec.value}</span>
                  </div>
                ))}
              </motion.div>
            </AnimatePresence>
          </Reveal>
        </div>
      </div>
    </section>
  );
}

// ============================================================================
// COMPONENT 9: R44Characteristics - Flight Characteristics
// ============================================================================
function R44Characteristics() {
  const characteristics = [
    {
      title: 'Stability',
      desc: 'Exceptional stability in all flight regimes, making it ideal for touring and training alike.',
      icon: 'balance',
    },
    {
      title: 'Visibility',
      desc: '360-degree visibility with large windows providing excellent situational awareness.',
      icon: 'eye',
    },
    {
      title: 'Forgiving',
      desc: 'Predictable handling characteristics that are forgiving for pilots of all experience levels.',
      icon: 'shield',
    },
    {
      title: 'Efficient',
      desc: 'Low operating costs with excellent fuel efficiency and long overhaul intervals.',
      icon: 'fuel',
    },
  ];

  return (
    <section className="r44-characteristics">
      <div className="r44-characteristics__container">
        <Reveal>
          <div className="r44-section-header">
            <span className="r44-pre-text">Why Pilots Love It</span>
            <h2>
              <span className="r44-text--dark">Flight</span>{' '}
              <span className="r44-text--mid">Characteristics</span>
            </h2>
            <p>
              The R44 is renowned for its docile handling and forgiving nature,
              making it the preferred choice for both new pilots and seasoned veterans.
            </p>
          </div>
        </Reveal>

        <div className="r44-characteristics__grid">
          {characteristics.map((char, i) => (
            <Reveal key={i} delay={i * 0.1}>
              <motion.div
                className="r44-characteristics__card"
                whileHover={{ y: -8 }}
              >
                <div className="r44-characteristics__icon">
                  {char.icon === 'balance' && (
                    <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                      <path d="M12 3v18M3 12h18M6 9l6-6 6 6M6 15l6 6 6-6"/>
                    </svg>
                  )}
                  {char.icon === 'eye' && (
                    <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
                      <circle cx="12" cy="12" r="3"/>
                    </svg>
                  )}
                  {char.icon === 'shield' && (
                    <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
                      <path d="M9 12l2 2 4-4"/>
                    </svg>
                  )}
                  {char.icon === 'fuel' && (
                    <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                      <path d="M3 22V8a2 2 0 012-2h6a2 2 0 012 2v14"/>
                      <path d="M13 14h4a2 2 0 012 2v6"/>
                      <path d="M13 10h5l2-2v5"/>
                      <path d="M5 22h8M5 6V3h6v3"/>
                    </svg>
                  )}
                </div>
                <h4 className="r44-characteristics__title">{char.title}</h4>
                <p className="r44-characteristics__desc">{char.desc}</p>
              </motion.div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

// ============================================================================
// COMPONENT 10: R44VariantComparison - Detailed Comparison Table
// ============================================================================
function R44VariantComparison() {
  const comparisonRows = [
    { label: 'Introduced', key: 'introduced' },
    { label: 'Engine', key: 'engine' },
    { label: 'Fuel System', key: 'fuelSystem' },
    { label: 'Power', key: 'power' },
    { label: 'Max Gross Weight', key: 'maxGrossWeight' },
    { label: 'Rotor Blades', key: 'blades' },
    { label: 'Hot/High Performance', key: 'altitudePerformance' },
    { label: 'Best For', key: 'bestFor' },
  ];

  return (
    <section className="r44-comparison">
      <div className="r44-comparison__container">
        <Reveal>
          <div className="r44-section-header">
            <span className="r44-pre-text">Technical Comparison</span>
            <h2>
              <span className="r44-text--dark">Variant</span>{' '}
              <span className="r44-text--mid">Comparison</span>
            </h2>
            <p>
              Understanding the differences between R44 variants helps you choose
              the right helicopter for your mission requirements.
            </p>
          </div>
        </Reveal>

        <Reveal delay={0.2}>
          <div className="r44-comparison__table-wrapper">
            <table className="r44-comparison__table">
              <thead>
                <tr>
                  <th className="r44-comparison__header-label">Specification</th>
                  <th className="r44-comparison__header-variant">
                    <span className="r44-comparison__variant-name">Raven I</span>
                    <span className="r44-comparison__variant-tag">Original</span>
                  </th>
                  <th className="r44-comparison__header-variant r44-comparison__header-variant--featured">
                    <span className="r44-comparison__variant-name">Raven II</span>
                    <span className="r44-comparison__variant-tag">Most Popular</span>
                  </th>
                  <th className="r44-comparison__header-variant">
                    <span className="r44-comparison__variant-name">Cadet</span>
                    <span className="r44-comparison__variant-tag">Training</span>
                  </th>
                </tr>
              </thead>
              <tbody>
                {comparisonRows.map((row, i) => (
                  <tr key={i}>
                    <td className="r44-comparison__row-label">{row.label}</td>
                    <td className="r44-comparison__cell">
                      {variantComparison.ravenI[row.key] || '-'}
                    </td>
                    <td className="r44-comparison__cell r44-comparison__cell--featured">
                      {variantComparison.ravenII[row.key] || '-'}
                    </td>
                    <td className="r44-comparison__cell">
                      {variantComparison.cadet[row.key] || (row.key === 'configuration' ? variantComparison.cadet.configuration : '-')}
                    </td>
                  </tr>
                ))}
                <tr>
                  <td className="r44-comparison__row-label">Configuration</td>
                  <td className="r44-comparison__cell">4-seat standard</td>
                  <td className="r44-comparison__cell r44-comparison__cell--featured">4-seat standard</td>
                  <td className="r44-comparison__cell">{variantComparison.cadet.configuration}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </Reveal>

        <div className="r44-comparison__highlights">
          <Reveal delay={0.3}>
            <div className="r44-comparison__highlight">
              <div className="r44-comparison__highlight-icon">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M12 2L2 7l10 5 10-5-10-5z" />
                  <path d="M2 17l10 5 10-5" />
                  <path d="M2 12l10 5 10-5" />
                </svg>
              </div>
              <h4>Raven II Advantages</h4>
              <p>
                The fuel-injected engine eliminates carburetor icing concerns and provides
                more consistent power output. The wider blades and higher gross weight make
                it ideal for hot and high altitude operations.
              </p>
            </div>
          </Reveal>

          <Reveal delay={0.4}>
            <div className="r44-comparison__highlight">
              <div className="r44-comparison__highlight-icon">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M22 11.08V12a10 10 0 11-5.93-9.14" />
                  <path d="M22 4L12 14.01l-3-3" />
                </svg>
              </div>
              <h4>Cadet Purpose-Built</h4>
              <p>
                Announced November 2015, the Cadet replaces rear seats with a cargo area,
                reducing weight and simplifying flight training operations. Lower power
                settings extend engine life and reduce operating costs.
              </p>
            </div>
          </Reveal>

          <Reveal delay={0.5}>
            <div className="r44-comparison__highlight">
              <div className="r44-comparison__highlight-icon">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <circle cx="12" cy="12" r="10" />
                  <path d="M12 6v6l4 2" />
                </svg>
              </div>
              <h4>Performance Note</h4>
              <p>
                Cruise speed of 117 knots with a no-reserve maximum range of approximately
                400 miles. The Lycoming IO-540-AE1A5 six-cylinder air-cooled engine provides
                reliable performance across all variants.
              </p>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}

// ============================================================================
// COMPONENT 12: R44Autopilot - Garmin GFC 600H Autopilot Section
// ============================================================================
function R44Autopilot() {
  const [activeMode, setActiveMode] = useState(0);

  return (
    <section className="r44-autopilot">
      <div className="r44-autopilot__container">
        <Reveal>
          <div className="r44-section-header">
            <span className="r44-pre-text">GARMIN GFC 600H</span>
            <h2>
              <span className="r44-text--dark">Two-Axis</span>{' '}
              <span className="r44-text--mid">Autopilot</span>
            </h2>
          </div>
        </Reveal>

        <Reveal delay={0.1}>
          <p className="r44-autopilot__intro">
            The optional Garmin GFC 600H autopilot brings advanced automation to the R44.
            With altitude hold, heading select, navigation, and approach modes, it significantly
            reduces pilot workload during longer flights.
          </p>
        </Reveal>

        <div className="r44-autopilot__modes-section">
          <Reveal delay={0.2}>
            <div className="r44-autopilot__modes-header">
              <h3>Autopilot Modes</h3>
            </div>
          </Reveal>

          <div className="r44-autopilot__modes-content">
            <Reveal delay={0.3} direction="left">
              <div className="r44-autopilot__modes-selector">
                {autopilotModes.map((mode, i) => (
                  <motion.button
                    key={i}
                    className={`r44-autopilot__mode-btn ${activeMode === i ? 'active' : ''}`}
                    onClick={() => setActiveMode(i)}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <span className="r44-autopilot__mode-code">{mode.mode}</span>
                    <span className="r44-autopilot__mode-name">{mode.name}</span>
                  </motion.button>
                ))}
              </div>
            </Reveal>

            <Reveal delay={0.4} direction="right">
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeMode}
                  className="r44-autopilot__mode-detail"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.3 }}
                >
                  <div className="r44-autopilot__mode-display">
                    <span className="r44-autopilot__mode-display-code">
                      {autopilotModes[activeMode].mode}
                    </span>
                  </div>
                  <h4>{autopilotModes[activeMode].name}</h4>
                  <p>{autopilotModes[activeMode].description}</p>
                </motion.div>
              </AnimatePresence>
            </Reveal>
          </div>
        </div>
      </div>
    </section>
  );
}

// ============================================================================
// COMPONENT 11: R44Variants - Model Variants Section
// ============================================================================
function R44Variants() {
  const [activeVariant, setActiveVariant] = useState(0);

  return (
    <section className="r44-variants">
      <div className="r44-variants__container">
        <Reveal>
          <div className="r44-section-header">
            <span className="r44-pre-text">Model Range</span>
            <h2>
              <span className="r44-text--dark">R44</span>{' '}
              <span className="r44-text--mid">Variants</span>
            </h2>
            <p>
              The R44 family offers a variant for every mission, from training
              to touring to amphibious operations.
            </p>
          </div>
        </Reveal>

        <div className="r44-variants__tabs">
          {r44Variants.map((variant, i) => (
            <motion.button
              key={i}
              className={`r44-variants__tab ${activeVariant === i ? 'active' : ''}`}
              onClick={() => setActiveVariant(i)}
              whileHover={{ y: -2 }}
              whileTap={{ scale: 0.98 }}
            >
              {variant.name.replace('R44 ', '')}
            </motion.button>
          ))}
        </div>

        <AnimatePresence mode="wait">
          <motion.div
            key={activeVariant}
            className="r44-variants__detail"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.4 }}
          >
            <div className="r44-variants__image">
              <img
                src={r44Variants[activeVariant].image}
                alt={r44Variants[activeVariant].name}
              />
            </div>
            <div className="r44-variants__info">
              <h3>{r44Variants[activeVariant].name}</h3>
              <p className="r44-variants__desc">{r44Variants[activeVariant].description}</p>

              <div className="r44-variants__specs">
                <div className="r44-variants__spec">
                  <span className="r44-variants__spec-label">Engine</span>
                  <span className="r44-variants__spec-value">{r44Variants[activeVariant].engine}</span>
                </div>
                <div className="r44-variants__spec">
                  <span className="r44-variants__spec-label">Power</span>
                  <span className="r44-variants__spec-value">{r44Variants[activeVariant].power}</span>
                </div>
              </div>

              <ul className="r44-variants__features">
                {r44Variants[activeVariant].features.map((feature, i) => (
                  <li key={i}>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M20 6L9 17l-5-5"/>
                    </svg>
                    {feature}
                  </li>
                ))}
              </ul>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>
    </section>
  );
}

// ============================================================================
// COMPONENT 12: R44ExpeditionsMap - Visual Route Display
// ============================================================================
function R44ExpeditionsMap() {
  return (
    <section className="r44-expeditions-map">
      <div className="r44-expeditions-map__container">
        <Reveal>
          <div className="r44-section-header">
            <span className="r44-pre-text">Where R44 Has Flown</span>
            <h2>
              <span className="r44-text--dark">Expedition</span>{' '}
              <span className="r44-text--mid">Routes</span>
            </h2>
            <p>
              Captain Q has taken the R44 to every corner of the globe, proving
              its capability in the most demanding environments on Earth.
            </p>
          </div>
        </Reveal>

        <div className="r44-expeditions-map__visual">
          <Reveal delay={0.2}>
            <div className="r44-expeditions-map__globe">
              <img
                src="/assets/images/expeditions/antartica.jpg"
                alt="Antarctic Expedition"
                className="r44-expeditions-map__image"
              />
              <div className="r44-expeditions-map__routes">
                {expeditionRoutes.map((route, i) => (
                  <motion.div
                    key={i}
                    className="r44-expeditions-map__route"
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.3 + i * 0.1 }}
                    viewport={{ once: true }}
                  >
                    <div className="r44-expeditions-map__route-marker" />
                    <div className="r44-expeditions-map__route-info">
                      <h4>{route.name}</h4>
                      <span className="r44-expeditions-map__route-year">{route.year}</span>
                      <span className="r44-expeditions-map__route-coords">{route.coords}</span>
                      <span className="r44-expeditions-map__route-distance">{route.distance}</span>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </Reveal>
        </div>

        <div className="r44-expeditions-map__images">
          <Reveal delay={0.3}>
            <div className="r44-expeditions-map__image-grid">
              <motion.div
                className="r44-expeditions-map__image-item"
                whileHover={{ scale: 1.03 }}
              >
                <img src="/assets/images/expeditions/north-pole.jpg" alt="North Pole" />
                <span>North Pole - 90.0000°N</span>
              </motion.div>
              <motion.div
                className="r44-expeditions-map__image-item"
                whileHover={{ scale: 1.03 }}
              >
                <img src="/assets/images/used-aircraft/r44/r44-south-pole.jpg" alt="South Pole" />
                <span>South Pole - 90.0000°S</span>
              </motion.div>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}

// ============================================================================
// COMPONENT 13: R44Gallery - Image Gallery
// ============================================================================
function R44Gallery() {
  return (
    <section className="r44-gallery">
      <Reveal>
        <div className="r44-section-header r44-section-header--centered">
          <span className="r44-pre-text">Gallery</span>
          <h2>
            <span className="r44-text--dark">The</span>{' '}
            <span className="r44-text--mid">R44</span>{' '}
            <span className="r44-text--light">In Action</span>
          </h2>
        </div>
      </Reveal>

      <div className="r44-gallery__grid">
        {galleryImages.map((img, i) => (
          <Reveal key={i} delay={i * 0.1}>
            <motion.div
              className={`r44-gallery__item r44-gallery__item--${i + 1}`}
              whileHover={{ scale: 1.02 }}
            >
              <img src={img} alt={`R44 Gallery ${i + 1}`} />
            </motion.div>
          </Reveal>
        ))}
      </div>
    </section>
  );
}

// ============================================================================
// COMPONENT 14: R44CTA - Call to Action
// ============================================================================
function R44CTA() {
  return (
    <section className="r44-cta">
      <div className="r44-cta__container">
        <Reveal>
          <h2 className="r44-cta__title">
            <span className="r44-text--light-inv">Ready To</span>{' '}
            <span className="r44-text--white">Experience The R44?</span>
          </h2>
        </Reveal>
        <Reveal delay={0.1}>
          <p className="r44-cta__desc">
            Whether you're looking to purchase, train, or join an expedition,
            HQ Aviation is your gateway to the world of Robinson helicopters.
          </p>
        </Reveal>
        <Reveal delay={0.2}>
          <div className="r44-cta__actions">
            <Link to="/contact" className="r44-btn r44-btn--light">
              Enquire about Aircraft
            </Link>
            <Link to="/training/ppl" className="r44-btn r44-btn--outline-light">
              Learn to Fly
            </Link>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

// ============================================================================
// MAIN R44 PAGE COMPONENT
// ============================================================================
function AircraftR44() {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="r44">
      <R44Header />
      <R44Hero />
      <R44Intro />
      <R44Counter />
      <R44History />
      <R44Specs />
      <R44Characteristics />
      <R44Variants />
      <R44VariantComparison />
      <R44Autopilot />
      <R44ExpeditionsMap />
      <R44Gallery />
      <R44CTA />
      <FooterMinimal />

      {/* ================================================================== */}
      {/* STYLES */}
      {/* ================================================================== */}
      <style>{`
        /* ===== BASE STYLES ===== */
        .r44 {
          font-family: 'Space Grotesk', -apple-system, sans-serif;
          background: #faf9f6;
          color: #1a1a1a;
        }

        .r44-pre-text {
          font-size: 0.75rem;
          font-weight: 400;
          letter-spacing: 0.25em;
          text-transform: uppercase;
          color: #999;
          display: block;
          margin-bottom: 0.75rem;
        }

        .r44-pre-text--light {
          color: rgba(255,255,255,0.6);
        }

        .r44-text--dark { color: #1a1a1a; }
        .r44-text--mid { color: #4a4a4a; }
        .r44-text--light { color: #7a7a7a; }
        .r44-text--white { color: #ffffff; }
        .r44-text--light-inv { color: rgba(255,255,255,0.6); }

        .r44-section-header {
          text-align: center;
          max-width: 650px;
          margin: 0 auto 2.5rem;
        }

        .r44-section-header--left {
          text-align: left;
          margin: 0 0 2rem;
        }

        .r44-section-header--centered {
          text-align: center;
        }

        .r44-section-header h2 {
          font-size: clamp(1.75rem, 4vw, 2.5rem);
          font-weight: 700;
          line-height: 1.1;
          text-transform: uppercase;
          margin: 0 0 1rem;
        }

        .r44-section-header p {
          color: #666;
          font-size: 1rem;
          line-height: 1.7;
        }

        /* ===== BUTTONS ===== */
        .r44-btn {
          display: inline-flex;
          align-items: center;
          gap: 0.5rem;
          padding: 0.75rem 1.5rem;
          font-family: 'Space Grotesk', sans-serif;
          font-size: 0.75rem;
          font-weight: 500;
          letter-spacing: 0.1em;
          text-transform: uppercase;
          text-decoration: none;
          border: none;
          cursor: pointer;
          transition: all 0.3s ease;
        }

        .r44-btn--primary {
          background: #1a1a1a;
          color: #fff;
        }

        .r44-btn--primary:hover {
          background: #333;
          color: #fff;
        }

        .r44-btn--light {
          background: #fff;
          color: #1a1a1a;
        }

        .r44-btn--light:hover {
          background: #f0f0f0;
        }

        .r44-btn--outline-light {
          background: transparent;
          color: #fff;
          border: 2px solid rgba(255,255,255,0.5);
        }

        .r44-btn--outline-light:hover {
          background: rgba(255,255,255,0.1);
          border-color: #fff;
        }

        /* ===== HERO ===== */
        .r44-hero {
          min-height: 100vh;
          position: relative;
          display: flex;
          flex-direction: column;
          justify-content: center;
          overflow: hidden;
          background: linear-gradient(135deg, #faf9f6 0%, #f5f3ef 100%);
        }

        .r44-hero__bg {
          position: absolute;
          right: -5%;
          bottom: -10%;
          width: 65%;
          z-index: 1;
          opacity: 0.9;
        }

        .r44-hero__bg img {
          width: 100%;
          height: auto;
          object-fit: contain;
        }

        .r44-hero__overlay {
          position: absolute;
          inset: 0;
          z-index: 2;
          background: linear-gradient(90deg, rgba(250,249,246,1) 0%, rgba(250,249,246,0.9) 40%, rgba(250,249,246,0.3) 70%, transparent 100%);
        }

        .r44-hero__content {
          position: relative;
          z-index: 3;
          padding: 8rem 4rem 4rem;
          max-width: 650px;
        }

        .r44-hero__label {
          font-size: 0.7rem;
          letter-spacing: 0.25em;
          color: #888;
          display: block;
          margin-bottom: 1rem;
        }

        .r44-hero__headline {
          display: flex;
          flex-direction: column;
          line-height: 0.9;
          margin-bottom: 1.5rem;
        }

        .r44-hero__word {
          font-weight: 700;
          font-size: clamp(3rem, 10vw, 6rem);
          letter-spacing: -0.03em;
          text-transform: uppercase;
        }

        .r44-hero__word--1 { color: #1a1a1a; }
        .r44-hero__word--2 { color: #4a4a4a; }

        .r44-hero__divider {
          width: 80px;
          height: 3px;
          background: #1a1a1a;
          margin-bottom: 1.5rem;
          transform-origin: left;
        }

        .r44-hero__sub {
          font-size: 1rem;
          color: #666;
          line-height: 1.7;
          max-width: 500px;
          margin-bottom: 2rem;
        }

        .r44-hero__badges {
          display: flex;
          align-items: center;
          gap: 1.5rem;
        }

        .r44-hero__badge {
          text-align: center;
        }

        .r44-hero__badge-value {
          display: block;
          font-family: 'Share Tech Mono', monospace;
          font-size: 1.5rem;
          font-weight: 700;
          color: #1a1a1a;
        }

        .r44-hero__badge-label {
          font-size: 0.65rem;
          letter-spacing: 0.12em;
          text-transform: uppercase;
          color: #888;
        }

        .r44-hero__badge-divider {
          width: 1px;
          height: 40px;
          background: linear-gradient(to bottom, transparent, rgba(26,26,26,0.3), transparent);
        }

        .r44-hero__scroll {
          position: absolute;
          bottom: 2rem;
          left: 50%;
          transform: translateX(-50%);
          z-index: 3;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 0.75rem;
        }

        .r44-hero__scroll span {
          font-size: 0.6rem;
          letter-spacing: 0.15em;
          text-transform: uppercase;
          color: rgba(26,26,26,0.5);
        }

        .r44-hero__scroll-line {
          width: 1px;
          height: 50px;
          background: rgba(26,26,26,0.2);
          position: relative;
          overflow: hidden;
        }

        .r44-hero__scroll-dot {
          position: absolute;
          width: 100%;
          height: 30%;
          background: #1a1a1a;
          animation: scrollDot 2s ease-in-out infinite;
        }

        @keyframes scrollDot {
          0% { top: -30%; }
          100% { top: 100%; }
        }

        /* ===== INTRO ===== */
        .r44-intro {
          padding: 5rem 2rem;
          background: #fff;
        }

        .r44-intro__container {
          max-width: 800px;
          margin: 0 auto;
        }

        .r44-intro__header {
          text-align: center;
        }

        .r44-intro__header h2 {
          font-size: clamp(1.75rem, 4vw, 2.5rem);
          text-transform: uppercase;
          margin: 0.5rem 0 1.5rem;
        }

        .r44-intro__header p {
          color: #666;
          font-size: 1rem;
          line-height: 1.8;
          margin-bottom: 1rem;
        }

        /* ===== COUNTER ===== */
        .r44-counter {
          padding: 1.5rem 2rem;
          background: #1a1a1a;
        }

        .r44-counter__container {
          max-width: 1000px;
          margin: 0 auto;
          display: flex;
          justify-content: center;
          gap: 3rem;
          flex-wrap: wrap;
        }

        .r44-counter__item {
          display: flex;
          align-items: center;
          gap: 0.75rem;
        }

        .r44-counter__value {
          font-family: 'Share Tech Mono', monospace;
          font-size: 1.5rem;
          font-weight: 700;
          color: #fff;
        }

        .r44-counter__label {
          font-size: 0.65rem;
          letter-spacing: 0.1em;
          text-transform: uppercase;
          color: rgba(255,255,255,0.5);
        }

        /* ===== HISTORY TIMELINE ===== */
        .r44-history {
          padding: 4rem 2rem;
          background: #faf9f6;
        }

        .r44-history__container {
          max-width: 1100px;
          margin: 0 auto;
        }

        .r44-history__track {
          display: grid;
          grid-template-columns: repeat(6, 1fr);
          gap: 0.75rem;
          position: relative;
          padding-top: 1.5rem;
        }

        .r44-history__line {
          position: absolute;
          top: 1.5rem;
          left: 0;
          right: 0;
          height: 2px;
          background: #1a1a1a;
          z-index: 0;
          transform: translateY(-50%);
        }

        .r44-history__event {
          position: relative;
          padding-top: 1.25rem;
          text-align: center;
        }

        .r44-history__dot {
          position: absolute;
          top: 0;
          left: 50%;
          transform: translate(-50%, -50%);
          width: 14px;
          height: 14px;
          background: #1a1a1a;
          border-radius: 50%;
          border: 3px solid #faf9f6;
          z-index: 1;
        }

        .r44-history__year {
          font-family: 'Share Tech Mono', monospace;
          font-size: 0.85rem;
          font-weight: 700;
          color: #1a1a1a;
          margin-bottom: 0.35rem;
        }

        .r44-history__title {
          font-size: 0.75rem;
          font-weight: 600;
          text-transform: uppercase;
          margin: 0 0 0.35rem;
        }

        .r44-history__desc {
          font-size: 0.7rem;
          color: #666;
          line-height: 1.4;
          margin: 0;
        }

        /* ===== SPECS ===== */
        .r44-specs {
          padding: 5rem 2rem;
          background: #fff;
        }

        .r44-specs__container {
          max-width: 1100px;
          margin: 0 auto;
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 4rem;
          align-items: center;
        }

        .r44-specs__visual {
          position: relative;
        }

        .r44-specs__blueprint {
          width: 100%;
          height: auto;
          filter: contrast(1.1);
        }

        .r44-specs__tabs {
          display: flex;
          gap: 0.5rem;
          margin-bottom: 1.5rem;
        }

        .r44-specs__tab {
          padding: 0.6rem 1.25rem;
          font-family: 'Space Grotesk', sans-serif;
          font-size: 0.7rem;
          font-weight: 500;
          letter-spacing: 0.08em;
          text-transform: uppercase;
          background: transparent;
          color: #666;
          border: 1px solid #e0deda;
          cursor: pointer;
          transition: all 0.3s ease;
        }

        .r44-specs__tab:hover {
          border-color: #1a1a1a;
          color: #1a1a1a;
        }

        .r44-specs__tab.active {
          background: #1a1a1a;
          color: #fff;
          border-color: #1a1a1a;
        }

        .r44-specs__grid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 1rem;
        }

        .r44-specs__item {
          padding: 1rem;
          background: #faf9f6;
          border: 1px solid #e8e6e2;
        }

        .r44-specs__label {
          display: block;
          font-size: 0.65rem;
          letter-spacing: 0.1em;
          text-transform: uppercase;
          color: #888;
          margin-bottom: 0.25rem;
        }

        .r44-specs__value {
          font-family: 'Share Tech Mono', monospace;
          font-size: 1.1rem;
          font-weight: 600;
          color: #1a1a1a;
        }

        /* ===== CHARACTERISTICS ===== */
        .r44-characteristics {
          padding: 5rem 2rem;
          background: #faf9f6;
        }

        .r44-characteristics__container {
          max-width: 1100px;
          margin: 0 auto;
        }

        .r44-characteristics__grid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 1.5rem;
        }

        .r44-characteristics__card {
          padding: 2rem 1.5rem;
          background: #fff;
          border: 1px solid #e8e6e2;
          text-align: center;
          transition: all 0.3s ease;
        }

        .r44-characteristics__card:hover {
          border-color: #1a1a1a;
        }

        .r44-characteristics__icon {
          display: flex;
          justify-content: center;
          margin-bottom: 1rem;
          color: #1a1a1a;
        }

        .r44-characteristics__title {
          font-size: 0.9rem;
          font-weight: 600;
          text-transform: uppercase;
          letter-spacing: 0.05em;
          margin: 0 0 0.75rem;
        }

        .r44-characteristics__desc {
          font-size: 0.85rem;
          color: #666;
          line-height: 1.6;
          margin: 0;
        }

        /* ===== CAPTAIN Q SECTION ===== */
        .r44-captain-q {
          position: relative;
          min-height: 100vh;
          display: flex;
          align-items: center;
          overflow: hidden;
        }

        .r44-captain-q__bg {
          position: absolute;
          inset: 0;
          z-index: 1;
        }

        .r44-captain-q__bg img {
          width: 100%;
          height: 120%;
          object-fit: cover;
          object-position: center;
        }

        .r44-captain-q__overlay {
          position: absolute;
          inset: 0;
          background: linear-gradient(90deg, rgba(0,0,0,0.85) 0%, rgba(0,0,0,0.7) 50%, rgba(0,0,0,0.5) 100%);
        }

        .r44-captain-q__content {
          position: relative;
          z-index: 2;
          max-width: 1200px;
          margin: 0 auto;
          padding: 6rem 3rem;
        }

        .r44-captain-q__title {
          font-size: clamp(2rem, 5vw, 3.5rem);
          font-weight: 700;
          text-transform: uppercase;
          margin: 0 0 1.5rem;
          line-height: 1.1;
        }

        .r44-captain-q__intro {
          font-size: 1.1rem;
          color: rgba(255,255,255,0.8);
          line-height: 1.8;
          max-width: 700px;
          margin-bottom: 3rem;
        }

        .r44-captain-q__achievements {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 1.5rem;
          margin-bottom: 3rem;
        }

        .r44-captain-q__achievement {
          padding: 1.5rem;
          background: rgba(255,255,255,0.05);
          border: 1px solid rgba(255,255,255,0.1);
          backdrop-filter: blur(10px);
        }

        .r44-captain-q__achievement-stat {
          font-family: 'Share Tech Mono', monospace;
          font-size: 2rem;
          font-weight: 700;
          color: #fff;
          margin-bottom: 0.5rem;
        }

        .r44-captain-q__achievement-title {
          font-size: 0.8rem;
          font-weight: 600;
          text-transform: uppercase;
          letter-spacing: 0.05em;
          color: #fff;
          margin: 0 0 0.5rem;
        }

        .r44-captain-q__achievement-desc {
          font-size: 0.8rem;
          color: rgba(255,255,255,0.6);
          line-height: 1.5;
          margin: 0;
        }

        .r44-captain-q__quote {
          max-width: 800px;
          padding: 2rem 0;
          border-top: 1px solid rgba(255,255,255,0.1);
          margin: 0 0 2rem;
        }

        .r44-captain-q__quote p {
          font-size: 1.25rem;
          font-style: italic;
          color: rgba(255,255,255,0.9);
          line-height: 1.8;
          margin: 0 0 1rem;
        }

        .r44-captain-q__quote cite {
          font-size: 0.85rem;
          font-style: normal;
          color: rgba(255,255,255,0.5);
          letter-spacing: 0.1em;
          text-transform: uppercase;
        }

        .r44-captain-q__cta {
          display: flex;
          gap: 1rem;
        }

        /* ===== VARIANTS ===== */
        .r44-variants {
          padding: 5rem 2rem;
          background: #fff;
        }

        .r44-variants__container {
          max-width: 1100px;
          margin: 0 auto;
        }

        .r44-variants__tabs {
          display: flex;
          justify-content: center;
          gap: 0.5rem;
          margin-bottom: 3rem;
          flex-wrap: wrap;
        }

        .r44-variants__tab {
          padding: 0.75rem 1.5rem;
          font-family: 'Space Grotesk', sans-serif;
          font-size: 0.75rem;
          font-weight: 500;
          letter-spacing: 0.08em;
          text-transform: uppercase;
          background: transparent;
          color: #666;
          border: 1px solid #e0deda;
          cursor: pointer;
          transition: all 0.3s ease;
        }

        .r44-variants__tab:hover {
          border-color: #1a1a1a;
          color: #1a1a1a;
        }

        .r44-variants__tab.active {
          background: #1a1a1a;
          color: #fff;
          border-color: #1a1a1a;
        }

        .r44-variants__detail {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 3rem;
          align-items: center;
        }

        .r44-variants__image {
          background: #faf9f6;
          padding: 2rem;
          display: flex;
          justify-content: center;
          align-items: center;
        }

        .r44-variants__image img {
          max-width: 100%;
          max-height: 350px;
          object-fit: contain;
        }

        .r44-variants__info h3 {
          font-size: 1.75rem;
          font-weight: 700;
          text-transform: uppercase;
          margin: 0 0 1rem;
        }

        .r44-variants__desc {
          font-size: 1rem;
          color: #666;
          line-height: 1.7;
          margin-bottom: 1.5rem;
        }

        .r44-variants__specs {
          display: flex;
          gap: 2rem;
          margin-bottom: 1.5rem;
        }

        .r44-variants__spec {
          display: flex;
          flex-direction: column;
        }

        .r44-variants__spec-label {
          font-size: 0.65rem;
          letter-spacing: 0.1em;
          text-transform: uppercase;
          color: #888;
        }

        .r44-variants__spec-value {
          font-family: 'Share Tech Mono', monospace;
          font-size: 0.9rem;
          color: #1a1a1a;
        }

        .r44-variants__features {
          list-style: none;
          padding: 0;
          margin: 0;
        }

        .r44-variants__features li {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          padding: 0.5rem 0;
          font-size: 0.9rem;
          color: #444;
          border-bottom: 1px solid #f0f0f0;
        }

        .r44-variants__features li svg {
          color: #1a1a1a;
          flex-shrink: 0;
        }

        /* ===== EXPEDITIONS MAP ===== */
        .r44-expeditions-map {
          padding: 5rem 2rem;
          background: #1a1a1a;
          color: #fff;
        }

        .r44-expeditions-map__container {
          max-width: 1100px;
          margin: 0 auto;
        }

        .r44-expeditions-map .r44-section-header h2 span {
          color: #fff;
        }

        .r44-expeditions-map .r44-section-header h2 .r44-text--mid {
          color: rgba(255,255,255,0.6);
        }

        .r44-expeditions-map .r44-section-header p {
          color: rgba(255,255,255,0.6);
        }

        .r44-expeditions-map__visual {
          margin-bottom: 3rem;
        }

        .r44-expeditions-map__globe {
          position: relative;
        }

        .r44-expeditions-map__image {
          width: 100%;
          height: 400px;
          object-fit: cover;
          border-radius: 4px;
          opacity: 0.7;
        }

        .r44-expeditions-map__routes {
          position: absolute;
          top: 50%;
          left: 2rem;
          transform: translateY(-50%);
          display: flex;
          flex-direction: column;
          gap: 1rem;
        }

        .r44-expeditions-map__route {
          display: flex;
          align-items: flex-start;
          gap: 1rem;
          padding: 1rem;
          background: rgba(0,0,0,0.7);
          backdrop-filter: blur(10px);
        }

        .r44-expeditions-map__route-marker {
          width: 12px;
          height: 12px;
          background: #fff;
          border-radius: 50%;
          margin-top: 0.25rem;
          flex-shrink: 0;
        }

        .r44-expeditions-map__route-info h4 {
          font-size: 0.85rem;
          font-weight: 600;
          margin: 0 0 0.25rem;
          text-transform: uppercase;
          letter-spacing: 0.05em;
        }

        .r44-expeditions-map__route-year,
        .r44-expeditions-map__route-coords,
        .r44-expeditions-map__route-distance {
          display: block;
          font-family: 'Share Tech Mono', monospace;
          font-size: 0.75rem;
          color: rgba(255,255,255,0.6);
        }

        .r44-expeditions-map__image-grid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 1.5rem;
        }

        .r44-expeditions-map__image-item {
          position: relative;
          overflow: hidden;
          aspect-ratio: 16/10;
        }

        .r44-expeditions-map__image-item img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          transition: transform 0.6s ease;
        }

        .r44-expeditions-map__image-item:hover img {
          transform: scale(1.05);
        }

        .r44-expeditions-map__image-item span {
          position: absolute;
          bottom: 0;
          left: 0;
          right: 0;
          padding: 1rem;
          background: linear-gradient(transparent, rgba(0,0,0,0.8));
          font-family: 'Share Tech Mono', monospace;
          font-size: 0.8rem;
          letter-spacing: 0.1em;
        }

        /* ===== GALLERY ===== */
        .r44-gallery {
          padding: 5rem 2rem;
          background: #faf9f6;
        }

        .r44-gallery__grid {
          max-width: 1200px;
          margin: 0 auto;
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          grid-template-rows: repeat(2, 250px);
          gap: 1rem;
        }

        .r44-gallery__item {
          overflow: hidden;
          background: #e8e6e2;
        }

        .r44-gallery__item img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          transition: transform 0.6s ease;
        }

        .r44-gallery__item:hover img {
          transform: scale(1.05);
        }

        .r44-gallery__item--1 {
          grid-column: span 2;
        }

        .r44-gallery__item--4 {
          grid-column: span 2;
        }

        /* ===== AUTOPILOT SECTION ===== */
        .r44-autopilot {
          padding: 6rem 2rem;
          background: #f0efec;
        }

        .r44-autopilot__container {
          max-width: 1200px;
          margin: 0 auto;
        }

        .r44-autopilot__intro {
          max-width: 800px;
          margin: 0 auto 3rem;
          text-align: center;
          font-size: 1.1rem;
          line-height: 1.8;
          color: #4a4a4a;
        }

        .r44-autopilot__modes-section {
          margin-top: 2rem;
        }

        .r44-autopilot__modes-header h3 {
          font-family: 'Space Grotesk', sans-serif;
          font-size: 1.25rem;
          font-weight: 600;
          text-transform: uppercase;
          letter-spacing: 0.1em;
          color: #1a1a1a;
          margin-bottom: 1.5rem;
          text-align: center;
        }

        .r44-autopilot__modes-content {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 2rem;
          align-items: start;
        }

        .r44-autopilot__modes-selector {
          display: flex;
          flex-direction: column;
          gap: 0.75rem;
        }

        .r44-autopilot__mode-btn {
          display: flex;
          align-items: center;
          gap: 1rem;
          padding: 1rem 1.25rem;
          background: #fff;
          border: 1px solid #e0deda;
          border-radius: 4px;
          cursor: pointer;
          transition: all 0.3s ease;
          text-align: left;
        }

        .r44-autopilot__mode-btn:hover {
          border-color: #1a1a1a;
        }

        .r44-autopilot__mode-btn.active {
          background: #1a1a1a;
          border-color: #1a1a1a;
        }

        .r44-autopilot__mode-code {
          font-family: 'Share Tech Mono', monospace;
          font-size: 1.25rem;
          font-weight: 700;
          color: #1a1a1a;
          min-width: 50px;
          padding: 0.25rem 0.5rem;
          background: #f0efec;
          border-radius: 3px;
          text-align: center;
        }

        .r44-autopilot__mode-btn.active .r44-autopilot__mode-code {
          background: #333;
          color: #faf9f6;
        }

        .r44-autopilot__mode-name {
          font-family: 'Space Grotesk', sans-serif;
          font-size: 1rem;
          font-weight: 500;
          color: #4a4a4a;
        }

        .r44-autopilot__mode-btn.active .r44-autopilot__mode-name {
          color: #faf9f6;
        }

        .r44-autopilot__mode-detail {
          background: #fff;
          padding: 2rem;
          border-radius: 4px;
          border: 1px solid #e0deda;
          min-height: 200px;
        }

        .r44-autopilot__mode-display {
          margin-bottom: 1.5rem;
        }

        .r44-autopilot__mode-display-code {
          font-family: 'Share Tech Mono', monospace;
          font-size: 3rem;
          font-weight: 700;
          color: #1a1a1a;
          background: #f0efec;
          padding: 0.5rem 1.5rem;
          border-radius: 4px;
          display: inline-block;
        }

        .r44-autopilot__mode-detail h4 {
          font-family: 'Space Grotesk', sans-serif;
          font-size: 1.5rem;
          font-weight: 600;
          color: #1a1a1a;
          margin: 0 0 1rem;
        }

        .r44-autopilot__mode-detail p {
          font-family: 'Space Grotesk', sans-serif;
          font-size: 1rem;
          line-height: 1.7;
          color: #666;
          margin: 0;
        }

        @media (max-width: 768px) {
          .r44-autopilot__modes-content {
            grid-template-columns: 1fr;
          }

          .r44-autopilot__modes-selector {
            flex-direction: row;
            flex-wrap: wrap;
          }

          .r44-autopilot__mode-btn {
            flex: 1 1 calc(50% - 0.5rem);
          }
        }

        /* ===== CTA ===== */
        .r44-cta {
          padding: 6rem 2rem;
          background: #1a1a1a;
          text-align: center;
        }

        .r44-cta__container {
          max-width: 800px;
          margin: 0 auto;
        }

        .r44-cta__title {
          font-size: clamp(1.75rem, 4vw, 2.5rem);
          font-weight: 700;
          text-transform: uppercase;
          margin: 0 0 1rem;
        }

        .r44-cta__desc {
          font-size: 1rem;
          color: rgba(255,255,255,0.7);
          line-height: 1.7;
          margin-bottom: 2rem;
        }

        .r44-cta__actions {
          display: flex;
          justify-content: center;
          gap: 1rem;
          flex-wrap: wrap;
        }

        /* ===== SAFETY SYSTEMS ===== */
        .r44-safety {
          padding: 5rem 2rem;
          background: #fff;
        }

        .r44-safety__container {
          max-width: 1200px;
          margin: 0 auto;
        }

        .r44-safety__grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 1.5rem;
          margin-bottom: 3rem;
        }

        .r44-safety__card {
          padding: 2rem 1.5rem;
          background: #faf9f6;
          border: 1px solid #e8e6e2;
          position: relative;
          transition: all 0.3s ease;
        }

        .r44-safety__card:hover {
          border-color: #1a1a1a;
        }

        .r44-safety__card--critical {
          border-color: #1a1a1a;
          border-width: 2px;
        }

        .r44-safety__critical-badge {
          position: absolute;
          top: -0.65rem;
          left: 1rem;
          background: #1a1a1a;
          color: #fff;
          font-size: 0.6rem;
          font-weight: 500;
          letter-spacing: 0.1em;
          text-transform: uppercase;
          padding: 0.25rem 0.75rem;
        }

        .r44-safety__icon {
          display: flex;
          margin-bottom: 1rem;
          color: #1a1a1a;
        }

        .r44-safety__title {
          font-size: 0.9rem;
          font-weight: 600;
          text-transform: uppercase;
          letter-spacing: 0.05em;
          margin: 0 0 0.75rem;
        }

        .r44-safety__desc {
          font-size: 0.85rem;
          color: #666;
          line-height: 1.7;
          margin: 0;
        }

        .r44-safety__note {
          display: flex;
          gap: 1.5rem;
          padding: 2rem;
          background: #faf9f6;
          border-left: 4px solid #1a1a1a;
        }

        .r44-safety__note-icon {
          flex-shrink: 0;
          color: #1a1a1a;
        }

        .r44-safety__note-content h5 {
          font-size: 0.85rem;
          font-weight: 600;
          text-transform: uppercase;
          letter-spacing: 0.05em;
          margin: 0 0 0.5rem;
        }

        .r44-safety__note-content p {
          font-size: 0.85rem;
          color: #666;
          line-height: 1.7;
          margin: 0;
        }

        /* ===== VARIANT COMPARISON ===== */
        .r44-comparison {
          padding: 5rem 2rem;
          background: #faf9f6;
        }

        .r44-comparison__container {
          max-width: 1200px;
          margin: 0 auto;
        }

        .r44-comparison__table-wrapper {
          overflow-x: auto;
          margin-bottom: 3rem;
        }

        .r44-comparison__table {
          width: 100%;
          border-collapse: collapse;
          background: #fff;
          border: 1px solid #e8e6e2;
        }

        .r44-comparison__table thead {
          background: #1a1a1a;
          color: #fff;
        }

        .r44-comparison__header-label,
        .r44-comparison__header-variant {
          padding: 1.25rem 1rem;
          text-align: left;
          font-size: 0.75rem;
          font-weight: 500;
          letter-spacing: 0.1em;
          text-transform: uppercase;
        }

        .r44-comparison__header-label {
          width: 20%;
          background: #1a1a1a;
        }

        .r44-comparison__header-variant {
          width: 26.66%;
          text-align: center;
        }

        .r44-comparison__header-variant--featured {
          background: #333;
        }

        .r44-comparison__variant-name {
          display: block;
          font-size: 1rem;
          font-weight: 600;
          margin-bottom: 0.25rem;
        }

        .r44-comparison__variant-tag {
          display: inline-block;
          font-size: 0.6rem;
          font-weight: 400;
          letter-spacing: 0.15em;
          text-transform: uppercase;
          padding: 0.2rem 0.5rem;
          background: rgba(255,255,255,0.15);
          border-radius: 2px;
        }

        .r44-comparison__row-label {
          padding: 1rem;
          font-size: 0.75rem;
          font-weight: 500;
          letter-spacing: 0.08em;
          text-transform: uppercase;
          color: #666;
          background: #faf9f6;
          border-bottom: 1px solid #e8e6e2;
        }

        .r44-comparison__cell {
          padding: 1rem;
          font-family: 'Share Tech Mono', monospace;
          font-size: 0.85rem;
          color: #1a1a1a;
          text-align: center;
          border-bottom: 1px solid #e8e6e2;
          border-left: 1px solid #e8e6e2;
        }

        .r44-comparison__cell--featured {
          background: rgba(26,26,26,0.03);
        }

        .r44-comparison__highlights {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 1.5rem;
        }

        .r44-comparison__highlight {
          padding: 2rem;
          background: #fff;
          border: 1px solid #e8e6e2;
        }

        .r44-comparison__highlight-icon {
          display: flex;
          margin-bottom: 1rem;
          color: #1a1a1a;
        }

        .r44-comparison__highlight h4 {
          font-size: 0.9rem;
          font-weight: 600;
          text-transform: uppercase;
          letter-spacing: 0.05em;
          margin: 0 0 0.75rem;
        }

        .r44-comparison__highlight p {
          font-size: 0.85rem;
          color: #666;
          line-height: 1.7;
          margin: 0;
        }

        /* ===== RESPONSIVE ===== */
        @media (max-width: 1024px) {
          .r44-hero__bg {
            width: 80%;
            right: -15%;
          }

          .r44-specs__container {
            grid-template-columns: 1fr;
            gap: 2rem;
          }

          .r44-captain-q__achievements {
            grid-template-columns: repeat(2, 1fr);
          }

          .r44-variants__detail {
            grid-template-columns: 1fr;
          }

          .r44-history__track {
            grid-template-columns: repeat(3, 1fr);
          }

          .r44-characteristics__grid {
            grid-template-columns: repeat(2, 1fr);
          }

          .r44-safety__grid {
            grid-template-columns: repeat(2, 1fr);
          }

          .r44-comparison__highlights {
            grid-template-columns: repeat(2, 1fr);
          }
        }

        @media (max-width: 768px) {
          .r44-hero {
            min-height: auto;
            padding-bottom: 3rem;
          }

          .r44-hero__bg {
            position: relative;
            width: 100%;
            right: 0;
            bottom: 0;
            order: -1;
            margin-top: 5rem;
          }

          .r44-hero__overlay {
            background: rgba(250,249,246,0.95);
          }

          .r44-hero__content {
            padding: 3rem 1.5rem;
          }

          .r44-hero__badges {
            gap: 1rem;
          }

          .r44-history__track {
            grid-template-columns: repeat(2, 1fr);
          }

          .r44-counter__container {
            gap: 1.5rem;
          }

          .r44-captain-q__content {
            padding: 4rem 1.5rem;
          }

          .r44-captain-q__achievements {
            grid-template-columns: 1fr;
          }

          .r44-captain-q__quote p {
            font-size: 1rem;
          }

          .r44-captain-q__cta {
            flex-direction: column;
          }

          .r44-gallery__grid {
            grid-template-columns: 1fr;
            grid-template-rows: auto;
          }

          .r44-gallery__item--1,
          .r44-gallery__item--4 {
            grid-column: span 1;
          }

          .r44-expeditions-map__routes {
            position: static;
            transform: none;
            margin-bottom: 2rem;
          }

          .r44-expeditions-map__image {
            height: 250px;
          }

          .r44-expeditions-map__image-grid {
            grid-template-columns: 1fr;
          }

          .r44-cta__actions {
            flex-direction: column;
            align-items: center;
          }

          .r44-characteristics__grid {
            grid-template-columns: 1fr;
          }

          .r44-safety__grid {
            grid-template-columns: 1fr;
          }

          .r44-safety__note {
            flex-direction: column;
            gap: 1rem;
          }

          .r44-comparison__table {
            font-size: 0.75rem;
          }

          .r44-comparison__header-label,
          .r44-comparison__header-variant {
            padding: 0.75rem 0.5rem;
          }

          .r44-comparison__cell,
          .r44-comparison__row-label {
            padding: 0.75rem 0.5rem;
          }

          .r44-comparison__highlights {
            grid-template-columns: 1fr;
          }
        }

        @media (max-width: 480px) {
          .r44-hero__word {
            font-size: 2.5rem;
          }

          .r44-hero__badges {
            flex-wrap: wrap;
            justify-content: center;
          }

          .r44-history__track {
            grid-template-columns: 1fr 1fr;
          }

          .r44-specs__tabs {
            flex-wrap: wrap;
            justify-content: center;
          }

          .r44-specs__grid {
            grid-template-columns: 1fr;
          }

          .r44-variants__tabs {
            flex-direction: column;
            align-items: center;
          }

          .r44-variants__tab {
            width: 100%;
            max-width: 200px;
          }
        }
      `}</style>
    </div>
  );
}

export default AircraftR44;

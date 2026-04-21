/**
 * HQ AVIATION - FLEET PAGE
 *
 * Brand: Luxury Minimal Aviation
 * Typography: Space Grotesk + Share Tech Mono
 * Colors: #faf9f6 (warm white), #1a1a1a (charcoal), gradient headlines
 *
 * 20 Components:
 * 1. FleetHeader - Page header with spotlight animation
 * 2. FleetHero - Full-screen hero with dramatic imagery
 * 3. FleetIntro - Introduction with gradient headline
 * 4. FleetCounter - Animated statistics display
 * 5. FleetTimeline - Fleet history since 2010
 * 6. FleetShowcase - Main aircraft grid/carousel
 * 7. AircraftCard - Individual aircraft card
 * 8. AircraftSpecs - Technical specifications
 * 9. FleetComparison - Side-by-side comparison
 * 10. FleetGallery - Photo gallery with parallax
 * 11. FleetCategories - Category filter tabs
 * 12. FleetHighlight - Featured aircraft spotlight
 * 13. FleetTrust - Robinson partnership section
 * 14. FleetAvailability - Availability indicators
 * 15. FleetPricing - Hire rate cards
 * 16. FleetExperience - Customer testimonials
 * 17. FleetSafety - Safety & maintenance features
 * 18. FleetCTA - Call to action section
 * 19. FleetContact - Quick contact form
 * 20. FleetDiscovery - Discovery flight CTA
 */

import React, { useRef, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, useInView, useScroll, useTransform, AnimatePresence } from 'framer-motion';
import { usePageImages } from '../hooks/usePageImages';
import { useCmsHighlight } from '../hooks/useCmsHighlight';

// Import styles
import '../assets/css/main.css';
import '../assets/css/components.css';

// Import Footer
import FooterMinimal from '../components/FooterMinimal';

// ============================================================================
// COMPONENT 1: FleetHeader
// ============================================================================
function FleetHeader() {
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
            <h3>Fleet</h3>
            <ul>
              <li><Link to="/fleet" onClick={closeMenu}>Our Fleet</Link></li>
              <li><Link to="/self-fly-hire" onClick={closeMenu}>Self-Fly Hire</Link></li>
              <li><Link to="/aircraft-sales" onClick={closeMenu}>Aircraft Sales</Link></li>
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
// FLEET DATA
// ============================================================================
const fleetData = [
  {
    id: 'r66',
    model: 'Robinson R66',
    variant: 'Turbine',
    category: 'Turbine',
    image: '/assets/images/gallery/carousel/rotating6.jpg',
    heroImage: '/assets/images/gallery/carousel/rotating6.jpg',
    seats: 5,
    engine: 'Rolls-Royce RR300',
    power: '300 SHP',
    maxSpeed: '140 kts',
    cruiseSpeed: '120 kts',
    range: '350 nm',
    endurance: '3.5 hrs',
    emptyWeight: '1280 lbs',
    maxWeight: '2700 lbs',
    rotorDiameter: '33 ft',
    description: 'Turbine power meets Robinson reliability. The ultimate in private helicopter ownership.',
    features: ['Turbine reliability', '5-seat capacity', 'Executive interior', 'Exceptional performance'],
    hourlyRate: 795,
    available: true,
    registrations: ['G-HQTB', 'G-HQTC'],
  },
  {
    id: 'r44',
    model: 'Robinson R44',
    variant: 'Raven II',
    category: 'Touring',
    image: '/assets/images/gallery/carousel/rotating2.jpg',
    heroImage: '/assets/images/gallery/carousel/rotating2.jpg',
    seats: 4,
    engine: 'Lycoming IO-540',
    power: '260 HP',
    maxSpeed: '130 kts',
    cruiseSpeed: '113 kts',
    range: '300 nm',
    endurance: '3.5 hrs',
    emptyWeight: '1500 lbs',
    maxWeight: '2500 lbs',
    rotorDiameter: '33 ft',
    description: 'The world\'s best-selling helicopter. Perfect for touring and travel.',
    features: ['4-seat touring', 'Glass cockpit available', 'Comfortable cabin', 'Long range'],
    hourlyRate: 495,
    available: true,
    registrations: ['G-HQRV', 'G-HQSV', 'G-HQTV', 'G-HQUV'],
  },
  {
    id: 'r22',
    model: 'Robinson R22',
    variant: 'Beta II',
    category: 'Training',
    image: '/assets/images/new-aircraft/r22/r22-red-volcano-front-alpha-v3.png',
    heroImage: '/assets/images/gallery/carousel/rotating1.jpg',
    seats: 2,
    engine: 'Lycoming O-360',
    power: '180 HP',
    maxSpeed: '102 kts',
    cruiseSpeed: '96 kts',
    range: '185 nm',
    endurance: '2.5 hrs',
    emptyWeight: '856 lbs',
    maxWeight: '1370 lbs',
    rotorDiameter: '25.2 ft',
    description: 'The perfect training helicopter. Light, responsive, and economical.',
    features: ['Ideal for PPL training', 'Responsive controls', 'Economical operation', 'Proven reliability'],
    hourlyRate: 295,
    available: true,
    registrations: ['G-HQAV', 'G-HQBV', 'G-HQCV'],
  },
  {
    id: 'h500',
    model: 'MD 500',
    variant: 'Series',
    category: 'Turbine',
    image: '/assets/images/aircraft/md500.jpg',
    heroImage: '/assets/images/aircraft/md500-hero.jpg',
    seats: 5,
    engine: 'Rolls-Royce 250-C20B',
    power: '420 SHP',
    maxSpeed: '152 kts',
    cruiseSpeed: '135 kts',
    range: '260 nm',
    endurance: '2.5 hrs',
    emptyWeight: '1591 lbs',
    maxWeight: '3000 lbs',
    rotorDiameter: '26.4 ft',
    description: 'The iconic turbine helicopter. Agile, powerful, and proven worldwide.',
    features: ['Turbine reliability', 'Exceptional manoeuvrability', 'Compact design', 'Proven platform'],
    hourlyRate: 895,
    available: true,
    registrations: ['G-HQMD'],
  },
];

const fleetStats = [
  { value: 15, suffix: '+', label: 'Aircraft in Fleet' },
  { value: 15, suffix: '+', label: 'Years Experience' },
  { value: 50000, suffix: '+', label: 'Hours Flown' },
  { value: 2010, suffix: '', label: 'Established', prefix: '' },
];

const timelineEvents = [
  { year: 2010, title: 'Foundation', description: 'HQ Aviation founded at Denham Aerodrome' },
  { year: 2012, title: 'First R22', description: 'Acquired first Robinson R22 for training operations' },
  { year: 2014, title: 'R44 Fleet', description: 'Expanded fleet with Robinson R44 touring helicopters' },
  { year: 2016, title: 'R66 Turbine', description: 'Added Robinson R66 turbine to the fleet' },
  { year: 2020, title: 'New Facility', description: 'Purpose-built maintenance hangar completed' },
  { year: 2024, title: 'MD 500', description: 'Added MD 500 turbine to expand capabilities' },
];

// ============================================================================
// COMPONENT 4: FleetHero
// ============================================================================
function FleetHero() {
  const heroRef = useRef(null);
  const pageImages = usePageImages('fleet');
  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ['start start', 'end start'],
  });

  const heroOpacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);
  const heroScale = useTransform(scrollYProgress, [0, 0.5], [1, 0.95]);
  const heroY = useTransform(scrollYProgress, [0, 0.5], [0, 100]);
  const overlayOpacity = useTransform(scrollYProgress, [0, 0.3], [0.4, 0.7]);

  return (
    <section ref={heroRef} className="fleet-hero" data-cms-section="fleet-hero">
      <motion.div
        className="fleet-hero__bg"
        initial={{ scale: 1.1, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 1.5 }}
      >
        <img src={pageImages['fleet-hero']?.[0]?.url || '/assets/images/facility/busy-hangar.jpg'} alt="HQ Aviation Fleet" />
      </motion.div>

      <motion.div
        className="fleet-hero__overlay"
        style={{ opacity: overlayOpacity }}
      />

      <motion.div
        className="fleet-hero__content"
        style={{ opacity: heroOpacity, scale: heroScale, y: heroY }}
      >
        <motion.span
          className="fleet-hero__label"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          THE ROBINSON SPECIALISTS
        </motion.span>

        <div className="fleet-hero__headline">
          <motion.span
            className="fleet-hero__word fleet-hero__word--1"
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4, ease: [0.16, 1, 0.3, 1] }}
          >
            OUR
          </motion.span>
          <motion.span
            className="fleet-hero__word fleet-hero__word--2"
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6, ease: [0.16, 1, 0.3, 1] }}
          >
            FLEET
          </motion.span>
        </div>

        <motion.div
          className="fleet-hero__divider"
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ duration: 0.8, delay: 0.8 }}
        />

        <motion.p
          className="fleet-hero__sub"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1 }}
        >
          A meticulously maintained collection of Robinson helicopters,
          ready for training, touring, and adventure.
        </motion.p>

        <motion.div
          className="fleet-hero__badges"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.2 }}
        >
          <div className="fleet-hero__badge">
            <span className="fleet-hero__badge-value">15+</span>
            <span className="fleet-hero__badge-label">Aircraft</span>
          </div>
          <div className="fleet-hero__badge-divider" />
          <div className="fleet-hero__badge">
            <span className="fleet-hero__badge-value">4</span>
            <span className="fleet-hero__badge-label">Models</span>
          </div>
          <div className="fleet-hero__badge-divider" />
          <div className="fleet-hero__badge">
            <span className="fleet-hero__badge-value">UK</span>
            <span className="fleet-hero__badge-label">Based</span>
          </div>
        </motion.div>
      </motion.div>

      <motion.div
        className="fleet-hero__scroll"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5 }}
      >
        <span>Scroll to explore</span>
        <div className="fleet-hero__scroll-line">
          <div className="fleet-hero__scroll-dot" />
        </div>
      </motion.div>
    </section>
  );
}

// ============================================================================
// COMPONENT 5: FleetIntro
// ============================================================================
function FleetIntro() {
  return (
    <section className="fleet-intro">
      <div className="fleet-intro__container">
        <Reveal>
          <div className="fleet-intro__header">
            <span className="fleet-pre-text">Since 2010</span>
            <h2>
              <span className="fleet-text--dark">Excellence</span>{' '}
              <span className="fleet-text--mid">In</span>{' '}
              <span className="fleet-text--light">Aviation</span>
            </h2>
            <p>
              For over 15 years, HQ Aviation has built and maintained one of the UK's finest
              Robinson helicopter fleets. Each aircraft is maintained to the highest standards,
              ready for training, self-fly hire, or your next adventure.
            </p>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

// ============================================================================
// COMPONENT 6: FleetCounter
// ============================================================================
function FleetCounter() {
  return (
    <section className="fleet-counter">
      <div className="fleet-counter__container">
        {fleetStats.map((stat, i) => (
          <Reveal key={i} delay={i * 0.1}>
            <div className="fleet-counter__item">
              <span className="fleet-counter__value">
                <AnimatedNumber value={stat.value} suffix={stat.suffix} prefix={stat.prefix} />
              </span>
              <span className="fleet-counter__label">{stat.label}</span>
            </div>
          </Reveal>
        ))}
      </div>
    </section>
  );
}

// ============================================================================
// COMPONENT 7: FleetTimeline
// ============================================================================
function FleetTimeline() {
  return (
    <section className="fleet-timeline">
      <div className="fleet-timeline__container">
        <Reveal>
          <div className="fleet-section-header">
            <span className="fleet-pre-text">Our Journey</span>
            <h2>
              <span className="fleet-text--dark">Fleet</span>{' '}
              <span className="fleet-text--mid">History</span>
            </h2>
          </div>
        </Reveal>

        <div className="fleet-timeline__track">
          <div className="fleet-timeline__line" />
          {timelineEvents.map((event, i) => (
            <Reveal key={i} delay={i * 0.1}>
              <motion.div
                className="fleet-timeline__event"
                whileHover={{ y: -5 }}
              >
                <div className="fleet-timeline__dot" />
                <div className="fleet-timeline__year">{event.year}</div>
                <h4 className="fleet-timeline__title">{event.title}</h4>
                <p className="fleet-timeline__desc">{event.description}</p>
              </motion.div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

// ============================================================================
// COMPONENT 8: FleetCategories
// ============================================================================
function FleetCategories({ activeCategory, onCategoryChange }) {
  const categories = ['All', 'Training', 'Touring', 'Turbine', 'Premium'];

  return (
    <div className="fleet-categories">
      {categories.map((cat) => (
        <motion.button
          key={cat}
          className={`fleet-categories__btn ${activeCategory === cat ? 'active' : ''}`}
          onClick={() => onCategoryChange(cat)}
          whileHover={{ y: -2 }}
          whileTap={{ scale: 0.98 }}
        >
          {cat}
        </motion.button>
      ))}
    </div>
  );
}

// ============================================================================
// COMPONENT 9: AircraftCard
// ============================================================================
function AircraftCard({ aircraft, index, onClick }) {
  return (
    <motion.div
      className="aircraft-card"
      whileHover={{ y: -8 }}
      onClick={() => onClick(aircraft)}
    >
      <div className="aircraft-card__image">
        <img src={aircraft.image} alt={aircraft.model} />
      </div>

      <div className="aircraft-card__content">
        <div className="aircraft-card__header">
          <h3 className="aircraft-card__model">{aircraft.model}</h3>
          <span className="aircraft-card__variant">{aircraft.variant}</span>
        </div>

        <p className="aircraft-card__desc">{aircraft.description}</p>

        <div className="aircraft-card__specs">
          <div className="aircraft-card__spec">
            <span className="aircraft-card__spec-value">{aircraft.seats}</span>
            <span className="aircraft-card__spec-label">Seats</span>
          </div>
          <div className="aircraft-card__spec">
            <span className="aircraft-card__spec-value">{aircraft.cruiseSpeed}</span>
            <span className="aircraft-card__spec-label">Cruise</span>
          </div>
          <div className="aircraft-card__spec">
            <span className="aircraft-card__spec-value">{aircraft.range}</span>
            <span className="aircraft-card__spec-label">Range</span>
          </div>
        </div>

        <button className="aircraft-card__btn">
          <span>View Details</span>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M5 12h14M12 5l7 7-7 7"/>
          </svg>
        </button>
      </div>
    </motion.div>
  );
}

// ============================================================================
// COMPONENT 10: AircraftSpecs
// ============================================================================
function AircraftSpecs({ aircraft }) {
  const specs = [
    { label: 'Engine', value: aircraft.engine },
    { label: 'Power', value: aircraft.power },
    { label: 'Max Speed', value: aircraft.maxSpeed },
    { label: 'Cruise Speed', value: aircraft.cruiseSpeed },
    { label: 'Range', value: aircraft.range },
    { label: 'Endurance', value: aircraft.endurance },
    { label: 'Empty Weight', value: aircraft.emptyWeight },
    { label: 'Max Weight', value: aircraft.maxWeight },
    { label: 'Rotor Diameter', value: aircraft.rotorDiameter },
  ];

  return (
    <div className="aircraft-specs">
      <div className="aircraft-specs__header">
        <span className="aircraft-specs__label">Technical Data</span>
        <h4>{aircraft.model} Specifications</h4>
      </div>

      <div className="aircraft-specs__grid">
        {specs.map((spec, i) => (
          <div key={i} className="aircraft-specs__item">
            <span className="aircraft-specs__item-label">{spec.label}</span>
            <span className="aircraft-specs__item-value">{spec.value}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

// ============================================================================
// COMPONENT 11: FleetShowcase
// ============================================================================
function FleetShowcase() {
  const [selectedAircraft, setSelectedAircraft] = useState(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);
  const scrollRef = useRef(null);

  const checkScrollPosition = () => {
    if (scrollRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;
      setCanScrollLeft(scrollLeft > 5);
      setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 5);
    }
  };

  useEffect(() => {
    const scrollEl = scrollRef.current;
    if (scrollEl) {
      checkScrollPosition();
      scrollEl.addEventListener('scroll', checkScrollPosition);
      window.addEventListener('resize', checkScrollPosition);
      return () => {
        scrollEl.removeEventListener('scroll', checkScrollPosition);
        window.removeEventListener('resize', checkScrollPosition);
      };
    }
  }, []);

  const scroll = (direction) => {
    if (scrollRef.current) {
      const scrollAmount = 340;
      scrollRef.current.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth'
      });
    }
  };

  return (
    <section className="fleet-showcase">
      <div className="fleet-showcase__container">
        <Reveal>
          <div className="fleet-section-header">
            <span className="fleet-pre-text">Available Aircraft</span>
            <h2>
              <span className="fleet-text--dark">The</span>{' '}
              <span className="fleet-text--mid">Fleet</span>
            </h2>
          </div>
        </Reveal>

        <div className="fleet-showcase__wrapper">
          {/* Left Chevron */}
          {canScrollLeft && (
            <button
              className="fleet-showcase__chevron fleet-showcase__chevron--left"
              onClick={() => scroll('left')}
              aria-label="Scroll left"
            >
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M15 18l-6-6 6-6"/>
              </svg>
            </button>
          )}

          {/* Left Fade */}
          {canScrollLeft && <div className="fleet-showcase__fade fleet-showcase__fade--left" />}

          <div className="fleet-showcase__scroll" ref={scrollRef}>
            {fleetData.map((aircraft, i) => (
              <AircraftCard
                key={aircraft.id}
                aircraft={aircraft}
                index={i}
                onClick={setSelectedAircraft}
              />
            ))}
          </div>

          {/* Right Fade */}
          {canScrollRight && <div className="fleet-showcase__fade fleet-showcase__fade--right" />}

          {/* Right Chevron */}
          {canScrollRight && (
            <button
              className="fleet-showcase__chevron fleet-showcase__chevron--right"
              onClick={() => scroll('right')}
              aria-label="Scroll right"
            >
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M9 18l6-6-6-6"/>
              </svg>
            </button>
          )}
        </div>

        {/* Book a Taster */}
        <Reveal delay={0.2}>
          <div className="fleet-showcase__taster">
            <div className="fleet-showcase__taster-content">
              <h3>Book a Taster</h3>
              <p>
                Book a 30-minute taster flight in the aircraft of your choice.
                Take the controls, experience the thrill, and fly wherever you want for that time.
              </p>
              <Link to="/contact?subject=taster-flight" className="fleet-btn fleet-btn--primary">
                Book Your Taster Flight
              </Link>
            </div>
          </div>
        </Reveal>
      </div>

      {/* Aircraft Detail Modal */}
      <AnimatePresence>
        {selectedAircraft && (
          <motion.div
            className="fleet-modal"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSelectedAircraft(null)}
          >
            <motion.div
              className="fleet-modal__content"
              initial={{ scale: 0.9, y: 50 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 50 }}
              onClick={(e) => e.stopPropagation()}
            >
              <button
                className="fleet-modal__close"
                onClick={() => setSelectedAircraft(null)}
              >
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M18 6L6 18M6 6l12 12"/>
                </svg>
              </button>

              <div className="fleet-modal__image">
                <img src={selectedAircraft.heroImage} alt={selectedAircraft.model} />
              </div>

              <div className="fleet-modal__body">
                <div className="fleet-modal__header">
                  <span className="fleet-modal__category">{selectedAircraft.category}</span>
                  <h3>{selectedAircraft.model}</h3>
                  <span className="fleet-modal__variant">{selectedAircraft.variant}</span>
                </div>

                <p className="fleet-modal__desc">{selectedAircraft.description}</p>

                <div className="fleet-modal__features">
                  <h5>Key Features</h5>
                  <ul>
                    {selectedAircraft.features.map((f, i) => (
                      <li key={i}>{f}</li>
                    ))}
                  </ul>
                </div>

                <AircraftSpecs aircraft={selectedAircraft} />

                {selectedAircraft.registrations.length > 0 && (
                  <div className="fleet-modal__registrations">
                    <span className="fleet-modal__reg-label">Fleet Registrations</span>
                    <div className="fleet-modal__reg-list">
                      {selectedAircraft.registrations.map((reg, i) => (
                        <span key={i} className="fleet-modal__reg">{reg}</span>
                      ))}
                    </div>
                  </div>
                )}

                {selectedAircraft.hourlyRate && (
                  <div className="fleet-modal__cta">
                    <div className="fleet-modal__price">
                      <span className="fleet-modal__price-from">From</span>
                      <span className="fleet-modal__price-amount">£{selectedAircraft.hourlyRate}</span>
                      <span className="fleet-modal__price-per">per hour</span>
                    </div>
                    <Link to="/contact?subject=fleet-enquiry" className="fleet-btn fleet-btn--primary">
                      Enquire Now
                    </Link>
                  </div>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}

// ============================================================================
// COMPONENT 12: FleetComparison
// ============================================================================
function FleetComparison() {
  return (
    <section className="fleet-comparison">
      <div className="fleet-comparison__container">
        <Reveal>
          <div className="fleet-section-header">
            <span className="fleet-pre-text">At a Glance</span>
            <h2>
              <span className="fleet-text--dark">Compare</span>{' '}
              <span className="fleet-text--mid">Models</span>
            </h2>
          </div>
        </Reveal>

        <Reveal delay={0.1}>
          <div className="fleet-comparison__table-wrap">
            <table className="fleet-comparison__table">
              <thead>
                <tr>
                  <th>Specification</th>
                  {fleetData.map(a => (
                    <th key={a.id}>{a.model.replace('Robinson ', '')}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>Seats</td>
                  {fleetData.map(a => <td key={a.id}>{a.seats}</td>)}
                </tr>
                <tr>
                  <td>Engine</td>
                  {fleetData.map(a => <td key={a.id}>{a.engine}</td>)}
                </tr>
                <tr>
                  <td>Max Speed</td>
                  {fleetData.map(a => <td key={a.id}>{a.maxSpeed}</td>)}
                </tr>
                <tr>
                  <td>Cruise Speed</td>
                  {fleetData.map(a => <td key={a.id}>{a.cruiseSpeed}</td>)}
                </tr>
                <tr>
                  <td>Range</td>
                  {fleetData.map(a => <td key={a.id}>{a.range}</td>)}
                </tr>
                <tr>
                  <td>Hourly Rate</td>
                  {fleetData.map(a => (
                    <td key={a.id}>
                      {a.hourlyRate ? `£${a.hourlyRate}` : 'Contact Us'}
                    </td>
                  ))}
                </tr>
              </tbody>
            </table>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

// ============================================================================
// COMPONENT 13: FleetGallery (Two-row scrolling gallery)
// ============================================================================
function FleetGallery() {
  const galleryRow1 = [
    '/assets/images/gallery/carousel/rotating1.jpg',
    '/assets/images/gallery/carousel/rotating2.jpg',
    '/assets/images/gallery/carousel/rotating6.jpg',
    '/assets/images/gallery/flying/foggy-evening-flying.jpg',
    '/assets/images/facility/busy-hangar.jpg',
    '/assets/images/gallery/carousel/rotating8.jpg',
    '/assets/images/gallery/carousel/rotating1.jpg',
    '/assets/images/gallery/carousel/rotating2.jpg',
  ];

  const galleryRow2 = [
    '/assets/images/gallery/carousel/rotating8.jpg',
    '/assets/images/facility/busy-hangar.jpg',
    '/assets/images/gallery/flying/foggy-evening-flying.jpg',
    '/assets/images/gallery/carousel/rotating6.jpg',
    '/assets/images/gallery/carousel/rotating2.jpg',
    '/assets/images/gallery/carousel/rotating1.jpg',
    '/assets/images/gallery/carousel/rotating8.jpg',
    '/assets/images/facility/busy-hangar.jpg',
  ];

  return (
    <section className="fleet-gallery">
      <Reveal>
        <div className="fleet-section-header fleet-section-header--centered">
          <span className="fleet-pre-text">Gallery</span>
          <h2>
            <span className="fleet-text--dark">See</span>{' '}
            <span className="fleet-text--mid">The</span>{' '}
            <span className="fleet-text--light">Fleet</span>
          </h2>
        </div>
      </Reveal>

      {/* Row 1 - Right to Left */}
      <div className="fleet-gallery__carousel">
        <div className="fleet-gallery__track">
          <div className="fleet-gallery__slides">
            {[...galleryRow1, ...galleryRow1].map((src, i) => (
              <div key={i} className="fleet-gallery__slide">
                <img src={src} alt="" />
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Row 2 - Left to Right */}
      <div className="fleet-gallery__carousel">
        <div className="fleet-gallery__track">
          <div className="fleet-gallery__slides fleet-gallery__slides--reverse">
            {[...galleryRow2, ...galleryRow2].map((src, i) => (
              <div key={i} className="fleet-gallery__slide">
                <img src={src} alt="" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

// ============================================================================
// COMPONENT 14: FleetHighlight
// ============================================================================
function FleetHighlight() {
  const h500 = fleetData.find(a => a.id === 'h500');
  const pageImages = usePageImages('fleet');

  return (
    <section className="fleet-highlight" data-cms-section="fleet-highlight">
      <div className="fleet-highlight__bg">
        <img src={pageImages['fleet-highlight']?.[0]?.url || '/assets/images/gallery/carousel/rotating6.jpg'} alt="MD 500 Helicopter" />
      </div>
      <div className="fleet-highlight__overlay" />

      <div className="fleet-highlight__content">
        <Reveal>
          <span className="fleet-highlight__badge">FLEET HIGHLIGHT</span>
        </Reveal>
        <Reveal delay={0.1}>
          <h2 className="fleet-highlight__title">
            <span>MD</span>
            <span>500</span>
          </h2>
        </Reveal>
        <Reveal delay={0.2}>
          <p className="fleet-highlight__desc">
            The iconic turbine helicopter. Agile, powerful, and proven worldwide.
            Experience unmatched manoeuvrability and reliability with HQ Aviation.
          </p>
        </Reveal>
        <Reveal delay={0.3}>
          <div className="fleet-highlight__specs">
            <div className="fleet-highlight__spec">
              <span className="fleet-highlight__spec-value">5</span>
              <span className="fleet-highlight__spec-label">Seats</span>
            </div>
            <div className="fleet-highlight__spec">
              <span className="fleet-highlight__spec-value">420</span>
              <span className="fleet-highlight__spec-label">SHP</span>
            </div>
            <div className="fleet-highlight__spec">
              <span className="fleet-highlight__spec-value">152</span>
              <span className="fleet-highlight__spec-label">Knots</span>
            </div>
            <div className="fleet-highlight__spec">
              <span className="fleet-highlight__spec-value">260</span>
              <span className="fleet-highlight__spec-label">nm Range</span>
            </div>
          </div>
        </Reveal>
        <Reveal delay={0.4}>
          <Link to="/contact?subject=h500-enquiry" className="fleet-btn fleet-btn--light">
            Enquire About MD 500
          </Link>
        </Reveal>
      </div>
    </section>
  );
}

// ============================================================================
// COMPONENT 15: FleetTrust
// ============================================================================
function FleetTrust() {
  return (
    <section className="fleet-trust">
      <div className="fleet-trust__container">
        <Reveal>
          <div className="fleet-trust__badge">
            <img src="/assets/images/robinson-assets/logos/rhc-authorized-dealer-logo-logo-yellow-rotor-black-type.svg" alt="Robinson Authorized Dealer" />
          </div>
        </Reveal>
        <Reveal delay={0.1}>
          <h3 className="fleet-trust__title">Authorized Robinson Dealer</h3>
        </Reveal>
        <Reveal delay={0.2}>
          <p className="fleet-trust__desc">
            As the UK's leading Robinson specialists since 2010, HQ Aviation maintains the highest standards
            of service, maintenance, and pilot training. Our relationship with Robinson Helicopter Company
            spans over 15 years.
          </p>
        </Reveal>
        <Reveal delay={0.3}>
          <div className="fleet-trust__credentials">
            <div className="fleet-trust__credential">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M20 6L9 17l-5-5"/>
              </svg>
              <span>Factory Authorized Service Centre</span>
            </div>
            <div className="fleet-trust__credential">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M20 6L9 17l-5-5"/>
              </svg>
              <span>CAA Approved Training Organization</span>
            </div>
            <div className="fleet-trust__credential">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M20 6L9 17l-5-5"/>
              </svg>
              <span>Robinson Safety Course Provider</span>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

// ============================================================================
// COMPONENT 16: FleetAvailability
// ============================================================================
function FleetAvailability() {
  return (
    <section className="fleet-availability">
      <div className="fleet-availability__container">
        <Reveal>
          <div className="fleet-section-header">
            <span className="fleet-pre-text">Real-Time Status</span>
            <h2>
              <span className="fleet-text--dark">Aircraft</span>{' '}
              <span className="fleet-text--mid">Availability</span>
            </h2>
          </div>
        </Reveal>

        <div className="fleet-availability__grid">
          {fleetData.filter(a => !a.comingSoon).map((aircraft, i) => (
            <Reveal key={aircraft.id} delay={i * 0.1}>
              <div className="fleet-availability__item">
                <div className="fleet-availability__info">
                  <h4>{aircraft.model.replace('Robinson ', '')}</h4>
                  <span className="fleet-availability__count">
                    {aircraft.registrations.length} aircraft
                  </span>
                </div>
                <div className={`fleet-availability__status ${aircraft.available ? 'available' : 'unavailable'}`}>
                  <span className="fleet-availability__dot" />
                  <span>{aircraft.available ? 'Available' : 'Booked'}</span>
                </div>
              </div>
            </Reveal>
          ))}
        </div>

        <Reveal delay={0.4}>
          <p className="fleet-availability__note">
            For real-time availability and bookings, please contact our operations team.
          </p>
        </Reveal>
      </div>
    </section>
  );
}

// ============================================================================
// COMPONENT 17: FleetPricing
// ============================================================================
function FleetPricing() {
  return (
    <section className="fleet-pricing">
      <div className="fleet-pricing__container">
        <Reveal>
          <div className="fleet-section-header">
            <span className="fleet-pre-text">Self-Fly Hire</span>
            <h2>
              <span className="fleet-text--dark">Hire</span>{' '}
              <span className="fleet-text--mid">Rates</span>
            </h2>
          </div>
        </Reveal>

        <div className="fleet-pricing__grid">
          {fleetData.filter(a => a.hourlyRate).map((aircraft, i) => (
            <Reveal key={aircraft.id} delay={i * 0.1}>
              <motion.div
                className="fleet-pricing__card"
                whileHover={{ y: -5 }}
              >
                <div className="fleet-pricing__header">
                  <h4>{aircraft.model.replace('Robinson ', '')}</h4>
                  <span className="fleet-pricing__variant">{aircraft.variant}</span>
                </div>
                <div className="fleet-pricing__price">
                  <span className="fleet-pricing__amount">£{aircraft.hourlyRate}</span>
                  <span className="fleet-pricing__per">per hour</span>
                </div>
                <ul className="fleet-pricing__features">
                  <li>{aircraft.seats} seats</li>
                  <li>{aircraft.cruiseSpeed} cruise</li>
                  <li>{aircraft.range} range</li>
                  <li>Fully insured</li>
                </ul>
              </motion.div>
            </Reveal>
          ))}
        </div>

        <Reveal delay={0.4}>
          <div className="fleet-pricing__cta">
            <Link to="/self-fly-hire" className="fleet-btn fleet-btn--primary">
              Understand Self-Fly Hire
            </Link>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

// ============================================================================
// COMPONENT 18: FleetExperience
// ============================================================================
function FleetExperience() {
  const testimonials = [
    {
      quote: "The R66 is absolutely superb. HQ Aviation keeps it in perfect condition, and the team is always helpful with bookings.",
      author: "James M.",
      role: "Private Pilot",
      aircraft: "R66 Turbine"
    },
    {
      quote: "I trained on their R22s and now hire the R44 regularly. The fleet is immaculate and the service is second to none.",
      author: "Sarah L.",
      role: "PPL(H) Holder",
      aircraft: "R22 & R44"
    },
    {
      quote: "Having access to such a well-maintained fleet makes all the difference. HQ truly are the Robinson specialists.",
      author: "David P.",
      role: "Commercial Pilot",
      aircraft: "R66 Turbine"
    },
  ];

  return (
    <section className="fleet-experience">
      <div className="fleet-experience__container">
        <Reveal>
          <div className="fleet-section-header">
            <span className="fleet-pre-text">Pilot Feedback</span>
            <h2>
              <span className="fleet-text--dark">What</span>{' '}
              <span className="fleet-text--mid">Pilots</span>{' '}
              <span className="fleet-text--light">Say</span>
            </h2>
          </div>
        </Reveal>

        <div className="fleet-experience__grid">
          {testimonials.map((t, i) => (
            <Reveal key={i} delay={i * 0.1}>
              <div className="fleet-experience__card">
                <svg className="fleet-experience__quote" width="32" height="32" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z"/>
                </svg>
                <p className="fleet-experience__text">{t.quote}</p>
                <div className="fleet-experience__author">
                  <div className="fleet-experience__author-info">
                    <span className="fleet-experience__name">{t.author}</span>
                    <span className="fleet-experience__role">{t.role}</span>
                  </div>
                  <span className="fleet-experience__aircraft">{t.aircraft}</span>
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

// ============================================================================
// COMPONENT 19: FleetSafety
// ============================================================================
function FleetSafety() {
  const safetyFeatures = [
    {
      icon: '🔧',
      title: 'Factory Maintenance',
      desc: 'All aircraft maintained to Robinson factory standards by certified engineers'
    },
    {
      icon: '📋',
      title: 'Regular Inspections',
      desc: '100-hour and annual inspections performed on schedule, every time'
    },
    {
      icon: '🛡️',
      title: 'Full Insurance',
      desc: 'Comprehensive hull and liability insurance on all fleet aircraft'
    },
    {
      icon: '📡',
      title: 'Modern Avionics',
      desc: 'Garmin GPS, transponders, and communication equipment throughout'
    },
  ];

  return (
    <section className="fleet-safety">
      <div className="fleet-safety__container">
        <Reveal>
          <div className="fleet-section-header">
            <span className="fleet-pre-text">Your Safety</span>
            <h2>
              <span className="fleet-text--dark">Maintained</span>{' '}
              <span className="fleet-text--mid">To</span>{' '}
              <span className="fleet-text--light">Perfection</span>
            </h2>
            <p>
              Every aircraft in our fleet undergoes rigorous maintenance and inspection protocols.
              Safety is not just a priority—it's our foundation.
            </p>
          </div>
        </Reveal>

        <div className="fleet-safety__grid">
          {safetyFeatures.map((feature, i) => (
            <Reveal key={i} delay={i * 0.1}>
              <motion.div
                className="fleet-safety__card"
                whileHover={{ y: -5 }}
              >
                <span className="fleet-safety__icon">{feature.icon}</span>
                <h4 className="fleet-safety__title">{feature.title}</h4>
                <p className="fleet-safety__desc">{feature.desc}</p>
              </motion.div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

// ============================================================================
// COMPONENT 20: FleetCTA
// ============================================================================
function FleetCTA() {
  return (
    <section className="fleet-cta">
      <div className="fleet-cta__container">
        <Reveal>
          <h2 className="fleet-cta__title">
            <span className="fleet-text--light-inv">Ready to</span>{' '}
            <span className="fleet-text--white">Fly?</span>
          </h2>
        </Reveal>
        <Reveal delay={0.1}>
          <p className="fleet-cta__desc">
            Whether you're looking to train, hire, or purchase, our team is ready to help
            you find the perfect helicopter for your needs.
          </p>
        </Reveal>
        <Reveal delay={0.2}>
          <div className="fleet-cta__actions">
            <Link to="/contact" className="fleet-btn fleet-btn--light">
              Contact Us
            </Link>
            <Link to="/training/ppl" className="fleet-btn fleet-btn--outline-light">
              Start Training
            </Link>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

// ============================================================================
// COMPONENT 21: FleetContact
// ============================================================================
function FleetContact() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    interest: 'hire',
    message: ''
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    // Handle form submission
    console.log('Form submitted:', formData);
  };

  return (
    <section className="fleet-contact">
      <div className="fleet-contact__container">
        <div className="fleet-contact__info">
          <Reveal>
            <span className="fleet-pre-text">Get in Touch</span>
            <h2>
              <span className="fleet-text--dark">Fleet</span>{' '}
              <span className="fleet-text--mid">Enquiries</span>
            </h2>
            <p>
              Have questions about our fleet? Interested in hiring or training?
              Fill out the form and our team will be in touch shortly.
            </p>
          </Reveal>

          <Reveal delay={0.1}>
            <div className="fleet-contact__details">
              <div className="fleet-contact__detail">
                <span className="fleet-contact__detail-label">Phone</span>
                <a href="tel:+441234567890">+44 (0) 1234 567 890</a>
              </div>
              <div className="fleet-contact__detail">
                <span className="fleet-contact__detail-label">Email</span>
                <a href="mailto:fleet@hqaviation.com">fleet@hqaviation.com</a>
              </div>
              <div className="fleet-contact__detail">
                <span className="fleet-contact__detail-label">Location</span>
                <span>Denham Aerodrome, UB9 5DF</span>
              </div>
            </div>
          </Reveal>
        </div>

        <Reveal delay={0.2}>
          <form className="fleet-contact__form" onSubmit={handleSubmit}>
            <div className="fleet-contact__field">
              <label htmlFor="name">Name</label>
              <input
                type="text"
                id="name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                required
              />
            </div>
            <div className="fleet-contact__field">
              <label htmlFor="email">Email</label>
              <input
                type="email"
                id="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                required
              />
            </div>
            <div className="fleet-contact__field">
              <label htmlFor="interest">Interest</label>
              <select
                id="interest"
                value={formData.interest}
                onChange={(e) => setFormData({ ...formData, interest: e.target.value })}
              >
                <option value="hire">Self-Fly Hire</option>
                <option value="training">Training</option>
                <option value="purchase">Aircraft Purchase</option>
                <option value="other">Other</option>
              </select>
            </div>
            <div className="fleet-contact__field fleet-contact__field--full">
              <label htmlFor="message">Message</label>
              <textarea
                id="message"
                rows="4"
                value={formData.message}
                onChange={(e) => setFormData({ ...formData, message: e.target.value })}
              />
            </div>
            <button type="submit" className="fleet-btn fleet-btn--primary fleet-btn--full">
              Send Enquiry
            </button>
          </form>
        </Reveal>
      </div>
    </section>
  );
}

// ============================================================================
// COMPONENT 22: FleetDiscovery (Discovery Flight CTA)
// ============================================================================
function FleetDiscovery() {
  return (
    <section id="discovery" className="fleet-discovery">
      <div className="fleet-discovery__inner">
        <div className="fleet-discovery__image">
          <img
            alt="Discovery flight over countryside"
            src="/assets/images/gallery/carousel/rotating1.jpg"
          />
          <div className="fleet-discovery__image-overlay" />
        </div>
        <div className="fleet-discovery__content">
          <div className="fleet-discovery__header">
            <span className="fleet-pre-text">Experience Flight</span>
            <h2>
              <span className="fleet-text--white">Discovery</span>{' '}
              <span className="fleet-text--light-inv">Flight</span>
            </h2>
          </div>
          <p className="fleet-discovery__desc">
            Experience our fleet firsthand. Take the controls and discover the freedom of helicopter flight.
          </p>
          <div className="fleet-discovery__compact-row">
            <div className="fleet-discovery__selling-points">
              <div className="fleet-discovery__point">
                <span className="fleet-discovery__point-icon">⏱</span>
                <span className="fleet-discovery__point-text">30 min flight</span>
              </div>
              <div className="fleet-discovery__point">
                <span className="fleet-discovery__point-icon">✓</span>
                <span className="fleet-discovery__point-text">Counts to PPL</span>
              </div>
              <div className="fleet-discovery__point">
                <span className="fleet-discovery__point-icon">🎮</span>
                <span className="fleet-discovery__point-text">You fly</span>
              </div>
            </div>
            <div className="fleet-discovery__booking">
              <div className="fleet-discovery__price">
                <span className="fleet-discovery__price-from">From</span>
                <span className="fleet-discovery__price-amount">£199</span>
              </div>
              <Link to="/contact?subject=discovery-flight" className="fleet-btn fleet-btn--light">
                Book Now →
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

// ============================================================================
// MAIN FLEET PAGE COMPONENT
// ============================================================================
function Fleet() {
  useCmsHighlight();
  // Scroll to top on mount
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="fleet">
      <FleetHeader />
      <FleetHero />
      <FleetIntro />
      <FleetCounter />
      <FleetShowcase />
      <FleetPricing />
      <FleetTrust />
      <FleetGallery />
      <FooterMinimal />

      {/* ================================================================== */}
      {/* STYLES */}
      {/* ================================================================== */}
      <style>{`
        /* ===== BASE STYLES ===== */
        .fleet {
          font-family: 'Space Grotesk', -apple-system, sans-serif;
          background: #faf9f6;
          color: #1a1a1a;
        }

        .fleet-pre-text {
          font-size: 0.7rem;
          font-weight: 400;
          letter-spacing: 0.25em;
          text-transform: uppercase;
          color: #888;
          display: block;
          margin-bottom: 0.75rem;
        }

        .fleet-text--dark { color: #1a1a1a; }
        .fleet-text--mid { color: #4a4a4a; }
        .fleet-text--light { color: #7a7a7a; }
        .fleet-text--white { color: #ffffff; }
        .fleet-text--light-inv { color: rgba(255,255,255,0.6); }

        .fleet-section-header {
          text-align: center;
          max-width: 600px;
          margin: 0 auto 1.5rem;
        }

        .fleet-section-header h2 {
          font-size: clamp(1.5rem, 3vw, 2rem);
          font-weight: 700;
          line-height: 1.1;
          text-transform: uppercase;
          margin: 0 0 0.5rem;
        }

        .fleet-section-header p {
          color: #666;
          font-size: 0.9rem;
          line-height: 1.6;
        }

        /* ===== BUTTONS ===== */
        .fleet-btn {
          display: inline-flex;
          align-items: center;
          gap: 0.35rem;
          padding: 0.6rem 1.25rem;
          font-family: 'Space Grotesk', sans-serif;
          font-size: 0.65rem;
          font-weight: 500;
          letter-spacing: 0.1em;
          text-transform: uppercase;
          text-decoration: none;
          border: none;
          cursor: pointer;
          transition: all 0.3s ease;
        }

        .fleet-btn--primary {
          background: #1a1a1a;
          color: #fff;
        }

        .fleet-btn--primary:hover {
          background: #333;
          color: #fff;
        }

        .fleet-btn--outline {
          background: transparent;
          color: #1a1a1a;
          border: 2px solid #1a1a1a;
        }

        .fleet-btn--outline:hover {
          background: #1a1a1a;
          color: #fff;
        }

        .fleet-btn--light {
          background: #fff;
          color: #1a1a1a;
        }

        .fleet-btn--light:hover {
          background: #f0f0f0;
        }

        .fleet-btn--outline-light {
          background: transparent;
          color: #fff;
          border: 2px solid rgba(255,255,255,0.5);
        }

        .fleet-btn--outline-light:hover {
          background: rgba(255,255,255,0.1);
          border-color: #fff;
        }

        .fleet-btn--full {
          width: 100%;
          justify-content: center;
        }

        /* ===== HERO ===== */
        .fleet-hero {
          min-height: 70vh;
          position: relative;
          display: flex;
          flex-direction: column;
          justify-content: center;
          overflow: hidden;
        }

        .fleet-hero__bg {
          position: absolute;
          inset: 0;
          z-index: 1;
        }

        .fleet-hero__bg img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }

        .fleet-hero__overlay {
          position: absolute;
          inset: 0;
          z-index: 2;
          background: linear-gradient(90deg, rgba(250,249,246,1) 0%, rgba(250,249,246,0.95) 35%, rgba(250,249,246,0.7) 60%, rgba(250,249,246,0.2) 100%);
        }

        .fleet-hero__content {
          position: relative;
          z-index: 3;
          padding: 3rem 3rem;
          max-width: 700px;
        }

        .fleet-hero__label {
          font-size: 0.6rem;
          letter-spacing: 0.25em;
          color: #888;
          display: block;
          margin-bottom: 0.75rem;
        }

        .fleet-hero__headline {
          display: flex;
          flex-direction: column;
          line-height: 0.9;
          margin-bottom: 1rem;
        }

        .fleet-hero__word {
          font-weight: 700;
          font-size: clamp(3rem, 10vw, 5.5rem);
          letter-spacing: -0.03em;
          text-transform: uppercase;
        }

        .fleet-hero__word--1 { color: #1a1a1a; }
        .fleet-hero__word--2 { color: #4a4a4a; }

        .fleet-hero__divider {
          width: 60px;
          height: 2px;
          background: #1a1a1a;
          margin-bottom: 1rem;
          transform-origin: left;
        }

        .fleet-hero__sub {
          font-size: 0.95rem;
          color: #666;
          line-height: 1.6;
          max-width: 420px;
          margin-bottom: 1.25rem;
        }

        .fleet-hero__badges {
          display: flex;
          align-items: center;
          gap: 1rem;
        }

        .fleet-hero__badge {
          text-align: center;
        }

        .fleet-hero__badge-value {
          display: block;
          font-family: 'Share Tech Mono', monospace;
          font-size: 1.25rem;
          font-weight: 700;
          color: #1a1a1a;
        }

        .fleet-hero__badge-label {
          font-size: 0.55rem;
          letter-spacing: 0.12em;
          text-transform: uppercase;
          color: #888;
        }

        .fleet-hero__badge-divider {
          width: 1px;
          height: 30px;
          background: linear-gradient(to bottom, transparent, rgba(26,26,26,0.3), transparent);
        }

        .fleet-hero__scroll {
          position: absolute;
          bottom: 1.5rem;
          left: 50%;
          transform: translateX(-50%);
          z-index: 3;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 0.5rem;
        }

        .fleet-hero__scroll span {
          font-size: 0.55rem;
          letter-spacing: 0.15em;
          text-transform: uppercase;
          color: rgba(26,26,26,0.5);
        }

        .fleet-hero__scroll-line {
          width: 1px;
          height: 35px;
          background: rgba(26,26,26,0.2);
          position: relative;
          overflow: hidden;
        }

        .fleet-hero__scroll-dot {
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
        .fleet-intro {
          padding: 2.5rem 1.5rem;
          background: #fff;
        }

        .fleet-intro__container {
          max-width: 700px;
          margin: 0 auto;
        }

        .fleet-intro__header {
          text-align: center;
        }

        .fleet-intro__header h2 {
          font-size: clamp(1.5rem, 3vw, 2rem);
          text-transform: uppercase;
          margin: 0.35rem 0 0.75rem;
        }

        .fleet-intro__header p {
          color: #666;
          font-size: 0.9rem;
          line-height: 1.6;
        }

        /* ===== COUNTER (Compact) ===== */
        .fleet-counter {
          padding: 1rem 1.5rem;
          background: #1a1a1a;
        }

        .fleet-counter__container {
          max-width: 900px;
          margin: 0 auto;
          display: flex;
          justify-content: center;
          gap: 2.5rem;
        }

        .fleet-counter__item {
          display: flex;
          align-items: center;
          gap: 0.5rem;
        }

        .fleet-counter__value {
          font-family: 'Share Tech Mono', monospace;
          font-size: 1.25rem;
          font-weight: 700;
          color: #fff;
        }

        .fleet-counter__label {
          font-size: 0.55rem;
          letter-spacing: 0.1em;
          text-transform: uppercase;
          color: rgba(255,255,255,0.5);
        }

        /* ===== TIMELINE ===== */
        .fleet-timeline {
          padding: 2.5rem 1.5rem;
          background: #faf9f6;
        }

        .fleet-timeline__container {
          max-width: 1000px;
          margin: 0 auto;
        }

        .fleet-timeline__track {
          display: grid;
          grid-template-columns: repeat(6, 1fr);
          gap: 0.5rem;
          position: relative;
          padding-top: 1.25rem;
        }

        .fleet-timeline__line {
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          height: 1px;
          background: linear-gradient(90deg, transparent, #e0deda, transparent);
        }

        .fleet-timeline__event {
          position: relative;
          padding-top: 1rem;
        }

        .fleet-timeline__dot {
          position: absolute;
          top: -4px;
          left: 50%;
          transform: translateX(-50%);
          width: 8px;
          height: 8px;
          background: #1a1a1a;
          border-radius: 50%;
          border: 2px solid #faf9f6;
        }

        .fleet-timeline__year {
          font-family: 'Share Tech Mono', monospace;
          font-size: 0.75rem;
          font-weight: 700;
          color: #1a1a1a;
          margin-bottom: 0.25rem;
        }

        .fleet-timeline__title {
          font-size: 0.7rem;
          font-weight: 600;
          text-transform: uppercase;
          margin: 0 0 0.25rem;
        }

        .fleet-timeline__desc {
          font-size: 0.65rem;
          color: #666;
          line-height: 1.4;
          margin: 0;
        }

        /* ===== CATEGORIES ===== */
        .fleet-categories {
          display: flex;
          justify-content: center;
          gap: 0.35rem;
          margin-bottom: 1.5rem;
          flex-wrap: wrap;
        }

        .fleet-categories__btn {
          padding: 0.5rem 1rem;
          font-family: 'Space Grotesk', sans-serif;
          font-size: 0.65rem;
          font-weight: 500;
          letter-spacing: 0.08em;
          text-transform: uppercase;
          background: transparent;
          color: #666;
          border: 1px solid #e0deda;
          cursor: pointer;
          transition: all 0.3s ease;
        }

        .fleet-categories__btn:hover {
          border-color: #1a1a1a;
          color: #1a1a1a;
        }

        .fleet-categories__btn.active {
          background: #1a1a1a;
          color: #fff;
          border-color: #1a1a1a;
        }

        /* ===== SHOWCASE ===== */
        .fleet-showcase {
          padding: 2.5rem 0;
          background: #fff;
        }

        .fleet-showcase__container {
          max-width: 1200px;
          margin: 0 auto;
          padding: 0 1.5rem;
        }

        .fleet-showcase__wrapper {
          position: relative;
          max-width: calc(100% - 120px);
          margin: 0 auto;
        }

        .fleet-showcase__scroll {
          display: flex;
          gap: 1.25rem;
          padding: 1rem 0;
          overflow-x: auto;
          scroll-snap-type: x mandatory;
          scrollbar-width: none;
          -ms-overflow-style: none;
        }

        .fleet-showcase__scroll::-webkit-scrollbar {
          display: none;
        }

        .fleet-showcase__chevron {
          position: absolute;
          top: 50%;
          transform: translateY(-50%);
          z-index: 10;
          width: 44px;
          height: 44px;
          display: flex;
          align-items: center;
          justify-content: center;
          background: #fff;
          border: 1px solid #e8e6e2;
          border-radius: 50%;
          cursor: pointer;
          transition: all 0.3s ease;
          box-shadow: 0 2px 8px rgba(0,0,0,0.1);
        }

        .fleet-showcase__chevron:hover {
          background: #1a1a1a;
          color: #fff;
          border-color: #1a1a1a;
        }

        .fleet-showcase__chevron--left {
          left: -60px;
        }

        .fleet-showcase__chevron--right {
          right: -60px;
        }

        .fleet-showcase__fade {
          position: absolute;
          top: 0;
          bottom: 0;
          width: 7px;
          pointer-events: none;
          z-index: 5;
        }

        .fleet-showcase__fade--left {
          left: 0;
          background: linear-gradient(to right, #fff 0%, transparent 100%);
        }

        .fleet-showcase__fade--right {
          right: 0;
          background: linear-gradient(to left, #fff 0%, transparent 100%);
        }

        /* ===== AIRCRAFT CARD ===== */
        .aircraft-card {
          flex: 0 0 300px;
          min-height: 420px;
          display: flex;
          flex-direction: column;
          background: #faf9f6;
          border: 1px solid #e8e6e2;
          overflow: hidden;
          cursor: pointer;
          transition: all 0.3s ease;
          scroll-snap-align: start;
        }

        .aircraft-card:hover {
          border-color: #1a1a1a;
        }

        .aircraft-card--coming-soon {
          opacity: 0.85;
        }

        .aircraft-card__image {
          position: relative;
          aspect-ratio: 16/10;
          overflow: hidden;
        }

        .aircraft-card__image img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          transition: transform 0.6s ease;
        }

        .aircraft-card:hover .aircraft-card__image img {
          transform: scale(1.05);
        }

        .aircraft-card__category {
          position: absolute;
          top: 0.5rem;
          left: 0.5rem;
          padding: 0.2rem 0.5rem;
          font-size: 0.5rem;
          font-weight: 500;
          letter-spacing: 0.08em;
          text-transform: uppercase;
          background: rgba(0,0,0,0.7);
          color: #fff;
        }

        .aircraft-card__coming-soon-badge {
          position: absolute;
          top: 0.5rem;
          right: 0.5rem;
          padding: 0.2rem 0.5rem;
          font-size: 0.5rem;
          font-weight: 600;
          letter-spacing: 0.08em;
          text-transform: uppercase;
          background: #1a1a1a;
          color: #fff;
        }

        .aircraft-card__content {
          padding: 0.875rem;
          flex: 1;
          display: flex;
          flex-direction: column;
        }

        .aircraft-card__desc {
          flex: 1;
        }

        .aircraft-card__header {
          margin-bottom: 0.35rem;
        }

        .aircraft-card__model {
          font-size: 0.95rem;
          font-weight: 700;
          text-transform: uppercase;
          margin: 0;
        }

        .aircraft-card__variant {
          font-size: 0.55rem;
          letter-spacing: 0.08em;
          color: #888;
          text-transform: uppercase;
        }

        .aircraft-card__desc {
          font-size: 0.75rem;
          color: #666;
          line-height: 1.5;
          margin: 0 0 0.5rem;
        }

        .aircraft-card__specs {
          display: flex;
          gap: 0.5rem;
          padding: 0.5rem 0;
          border-top: 1px solid #e8e6e2;
          border-bottom: 1px solid #e8e6e2;
          margin-bottom: 0.5rem;
        }

        .aircraft-card__spec {
          flex: 1;
          text-align: center;
        }

        .aircraft-card__spec-value {
          display: block;
          font-family: 'Share Tech Mono', monospace;
          font-size: 0.8rem;
          font-weight: 600;
          color: #1a1a1a;
        }

        .aircraft-card__spec-label {
          font-size: 0.5rem;
          letter-spacing: 0.08em;
          text-transform: uppercase;
          color: #888;
        }

        .aircraft-card__rate {
          display: flex;
          align-items: baseline;
          gap: 0.2rem;
          margin-bottom: 0.5rem;
        }

        .aircraft-card__rate-from {
          font-size: 0.55rem;
          color: #888;
        }

        .aircraft-card__rate-amount {
          font-family: 'Share Tech Mono', monospace;
          font-size: 1.1rem;
          font-weight: 700;
          color: #1a1a1a;
        }

        .aircraft-card__rate-per {
          font-size: 0.6rem;
          color: #888;
        }

        .aircraft-card__btn {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 0.35rem;
          width: 100%;
          padding: 0.5rem;
          font-family: 'Space Grotesk', sans-serif;
          font-size: 0.6rem;
          font-weight: 500;
          letter-spacing: 0.08em;
          text-transform: uppercase;
          background: transparent;
          color: #1a1a1a;
          border: 1px solid #1a1a1a;
          cursor: pointer;
          transition: all 0.3s ease;
        }

        .aircraft-card__btn:hover {
          background: #1a1a1a;
          color: #fff;
        }

        /* ===== MODAL ===== */
        .fleet-modal {
          position: fixed;
          inset: 0;
          z-index: 1000;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 1rem;
          background: rgba(0,0,0,0.8);
          backdrop-filter: blur(4px);
        }

        .fleet-modal__content {
          position: relative;
          width: 100%;
          max-width: 700px;
          max-height: 90vh;
          background: #fff;
          overflow-y: auto;
        }

        .fleet-modal__close {
          position: absolute;
          top: 0.5rem;
          right: 0.5rem;
          z-index: 10;
          width: 32px;
          height: 32px;
          display: flex;
          align-items: center;
          justify-content: center;
          background: rgba(255,255,255,0.9);
          border: none;
          cursor: pointer;
          transition: background 0.3s ease;
        }

        .fleet-modal__close:hover {
          background: #fff;
        }

        .fleet-modal__image {
          aspect-ratio: 2/1;
        }

        .fleet-modal__image img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }

        .fleet-modal__body {
          padding: 1.25rem;
        }

        .fleet-modal__header {
          margin-bottom: 0.75rem;
        }

        .fleet-modal__category {
          display: inline-block;
          padding: 0.2rem 0.5rem;
          font-size: 0.5rem;
          font-weight: 500;
          letter-spacing: 0.08em;
          text-transform: uppercase;
          background: #f5f5f2;
          color: #666;
          margin-bottom: 0.5rem;
        }

        .fleet-modal__header h3 {
          font-size: 1.25rem;
          font-weight: 700;
          text-transform: uppercase;
          margin: 0;
        }

        .fleet-modal__variant {
          font-size: 0.6rem;
          letter-spacing: 0.08em;
          color: #888;
          text-transform: uppercase;
        }

        .fleet-modal__desc {
          font-size: 0.85rem;
          color: #666;
          line-height: 1.5;
          margin-bottom: 0.75rem;
        }

        .fleet-modal__features {
          margin-bottom: 1rem;
        }

        .fleet-modal__features h5 {
          font-size: 0.55rem;
          letter-spacing: 0.12em;
          text-transform: uppercase;
          color: #888;
          margin: 0 0 0.5rem;
        }

        .fleet-modal__features ul {
          display: flex;
          flex-wrap: wrap;
          gap: 0.35rem;
          list-style: none;
          padding: 0;
          margin: 0;
        }

        .fleet-modal__features li {
          padding: 0.35rem 0.65rem;
          font-size: 0.65rem;
          background: #f5f5f2;
          border-left: 2px solid #1a1a1a;
        }

        .fleet-modal__registrations {
          margin-top: 0.75rem;
          padding-top: 0.75rem;
          border-top: 1px solid #e8e6e2;
        }

        .fleet-modal__reg-label {
          display: block;
          font-size: 0.55rem;
          letter-spacing: 0.12em;
          text-transform: uppercase;
          color: #888;
          margin-bottom: 0.35rem;
        }

        .fleet-modal__reg-list {
          display: flex;
          gap: 0.35rem;
          flex-wrap: wrap;
        }

        .fleet-modal__reg {
          font-family: 'Share Tech Mono', monospace;
          font-size: 0.7rem;
          font-weight: 600;
          padding: 0.2rem 0.5rem;
          background: #1a1a1a;
          color: #fff;
        }

        .fleet-modal__cta {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-top: 1rem;
          padding-top: 1rem;
          border-top: 1px solid #e8e6e2;
        }

        .fleet-modal__price {
          display: flex;
          align-items: baseline;
          gap: 0.25rem;
        }

        .fleet-modal__price-from {
          font-size: 0.6rem;
          color: #888;
        }

        .fleet-modal__price-amount {
          font-family: 'Share Tech Mono', monospace;
          font-size: 1.5rem;
          font-weight: 700;
          color: #1a1a1a;
        }

        .fleet-modal__price-per {
          font-size: 0.65rem;
          color: #888;
        }

        /* ===== SPECS ===== */
        .aircraft-specs {
          background: #faf9f6;
          padding: 0.75rem;
          margin-bottom: 0.75rem;
        }

        .aircraft-specs__header {
          margin-bottom: 0.5rem;
        }

        .aircraft-specs__label {
          font-size: 0.5rem;
          letter-spacing: 0.1em;
          text-transform: uppercase;
          color: #888;
        }

        .aircraft-specs__header h4 {
          font-size: 0.75rem;
          font-weight: 600;
          margin: 0.15rem 0 0;
        }

        .aircraft-specs__grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 0.5rem;
        }

        .aircraft-specs__item {
          display: flex;
          justify-content: space-between;
          padding: 0.25rem 0;
          border-bottom: 1px solid #e8e6e2;
        }

        .aircraft-specs__item-label {
          font-size: 0.6rem;
          color: #888;
        }

        .aircraft-specs__item-value {
          font-family: 'Share Tech Mono', monospace;
          font-size: 0.7rem;
          font-weight: 600;
          color: #1a1a1a;
        }

        /* ===== COMPARISON ===== */
        .fleet-comparison {
          padding: 2.5rem 1.5rem;
          background: #faf9f6;
        }

        .fleet-comparison__container {
          max-width: 900px;
          margin: 0 auto;
        }

        .fleet-comparison__table-wrap {
          overflow-x: auto;
        }

        .fleet-comparison__table {
          width: 100%;
          border-collapse: collapse;
        }

        .fleet-comparison__table th,
        .fleet-comparison__table td {
          padding: 0.5rem;
          text-align: center;
          border-bottom: 1px solid #e8e6e2;
        }

        .fleet-comparison__table th {
          font-size: 0.6rem;
          font-weight: 600;
          text-transform: uppercase;
          letter-spacing: 0.05em;
          background: #1a1a1a;
          color: #fff;
        }

        .fleet-comparison__table th:first-child {
          text-align: left;
        }

        .fleet-comparison__table td:first-child {
          text-align: left;
          font-size: 0.65rem;
          color: #666;
        }

        .fleet-comparison__table td {
          font-family: 'Share Tech Mono', monospace;
          font-size: 0.7rem;
        }

        .fleet-comparison__table tr:nth-child(even) {
          background: rgba(255,255,255,0.5);
        }

        /* ===== GALLERY ===== */
        .fleet-gallery {
          padding: 2rem 0;
          background: #f5f4f0;
          overflow: hidden;
          border-top: 1px solid #e8e6e2;
        }

        .fleet-gallery .fleet-section-header--centered {
          padding: 0 1.5rem 1.5rem;
        }

        .fleet-gallery__carousel {
          padding: 0.25rem 0;
          overflow: hidden;
        }

        .fleet-gallery__track {
          width: 100%;
        }

        .fleet-gallery__slides {
          display: flex;
          gap: 0.5rem;
          animation: fleetCarouselScroll 35s linear infinite;
        }

        .fleet-gallery__slides--reverse {
          animation: fleetCarouselScrollReverse 40s linear infinite;
        }

        .fleet-gallery__slides:hover {
          animation-play-state: paused;
        }

        @keyframes fleetCarouselScroll {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }

        @keyframes fleetCarouselScrollReverse {
          0% { transform: translateX(-50%); }
          100% { transform: translateX(0); }
        }

        .fleet-gallery__slide {
          flex-shrink: 0;
          width: 280px;
          height: 180px;
          overflow: hidden;
        }

        .fleet-gallery__slide img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          opacity: 0.9;
          transition: all 0.4s ease;
        }

        .fleet-gallery__slide:hover img {
          opacity: 1;
          transform: scale(1.05);
        }

        /* ===== TASTER SECTION ===== */
        .fleet-showcase__taster {
          margin-top: 3rem;
          text-align: center;
        }

        .fleet-showcase__taster-content {
          max-width: 600px;
          margin: 0 auto;
          padding: 2.5rem;
          background: #f5f4f0;
          border: 1px solid #e8e6e2;
        }

        .fleet-showcase__taster h3 {
          font-size: 1.5rem;
          font-weight: 700;
          text-transform: uppercase;
          margin: 0 0 1rem;
          color: #1a1a1a;
        }

        .fleet-showcase__taster p {
          font-size: 1rem;
          color: #666;
          line-height: 1.7;
          margin: 0 0 1.5rem;
        }

        /* ===== HIGHLIGHT ===== */
        .fleet-highlight {
          position: relative;
          min-height: 50vh;
          display: flex;
          align-items: center;
          padding: 3rem 2.5rem;
          overflow: hidden;
        }

        .fleet-highlight__bg {
          position: absolute;
          inset: 0;
          z-index: 1;
        }

        .fleet-highlight__bg img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }

        .fleet-highlight__overlay {
          position: absolute;
          inset: 0;
          z-index: 2;
          background: linear-gradient(135deg, rgba(0,0,0,0.85) 0%, rgba(0,0,0,0.5) 100%);
        }

        .fleet-highlight__content {
          position: relative;
          z-index: 3;
          max-width: 500px;
        }

        .fleet-highlight__badge {
          display: inline-block;
          padding: 0.3rem 0.65rem;
          font-size: 0.5rem;
          font-weight: 600;
          letter-spacing: 0.12em;
          text-transform: uppercase;
          background: #fff;
          color: #1a1a1a;
          margin-bottom: 0.75rem;
        }

        .fleet-highlight__title {
          display: flex;
          flex-direction: column;
          line-height: 0.9;
          margin: 0 0 0.75rem;
        }

        .fleet-highlight__title span:first-child {
          font-size: clamp(0.9rem, 2vw, 1.25rem);
          font-weight: 300;
          color: rgba(255,255,255,0.6);
          text-transform: uppercase;
          letter-spacing: 0.15em;
        }

        .fleet-highlight__title span:last-child {
          font-size: clamp(2.5rem, 8vw, 4.5rem);
          font-weight: 700;
          color: #fff;
          text-transform: uppercase;
          letter-spacing: -0.02em;
        }

        .fleet-highlight__desc {
          font-size: 0.85rem;
          color: rgba(255,255,255,0.8);
          line-height: 1.5;
          margin-bottom: 1rem;
        }

        .fleet-highlight__specs {
          display: flex;
          gap: 1.25rem;
          margin-bottom: 1rem;
        }

        .fleet-highlight__spec {
          text-align: center;
        }

        .fleet-highlight__spec-value {
          display: block;
          font-family: 'Share Tech Mono', monospace;
          font-size: 1.25rem;
          font-weight: 700;
          color: #fff;
        }

        .fleet-highlight__spec-label {
          font-size: 0.5rem;
          letter-spacing: 0.1em;
          text-transform: uppercase;
          color: rgba(255,255,255,0.5);
        }

        /* ===== TRUST ===== */
        .fleet-trust {
          padding: 2rem 1.5rem;
          background: #f5f5f2;
          text-align: center;
        }

        .fleet-trust__container {
          max-width: 600px;
          margin: 0 auto;
        }

        .fleet-trust__badge {
          margin-bottom: 0.75rem;
        }

        .fleet-trust__badge img {
          height: 35px;
          width: auto;
          filter: grayscale(100%);
          opacity: 0.8;
        }

        .fleet-trust__title {
          font-size: 1rem;
          font-weight: 700;
          text-transform: uppercase;
          margin: 0 0 0.5rem;
        }

        .fleet-trust__desc {
          color: #666;
          font-size: 0.8rem;
          line-height: 1.5;
          margin-bottom: 1rem;
        }

        .fleet-trust__credentials {
          display: flex;
          flex-direction: column;
          gap: 0.35rem;
        }

        .fleet-trust__credential {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 0.5rem;
          font-size: 0.7rem;
          color: #1a1a1a;
        }

        .fleet-trust__credential svg {
          width: 16px;
          height: 16px;
          color: #1a1a1a;
        }

        /* ===== AVAILABILITY ===== */
        .fleet-availability {
          padding: 2.5rem 1.5rem;
          background: #fff;
        }

        .fleet-availability__container {
          max-width: 700px;
          margin: 0 auto;
        }

        .fleet-availability__grid {
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
          margin-bottom: 1rem;
        }

        .fleet-availability__item {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 0.6rem 1rem;
          background: #faf9f6;
          border: 1px solid #e8e6e2;
        }

        .fleet-availability__info h4 {
          font-size: 0.8rem;
          font-weight: 600;
          text-transform: uppercase;
          margin: 0;
        }

        .fleet-availability__count {
          font-size: 0.6rem;
          color: #888;
        }

        .fleet-availability__status {
          display: flex;
          align-items: center;
          gap: 0.35rem;
          font-size: 0.6rem;
          font-weight: 500;
          text-transform: uppercase;
          letter-spacing: 0.05em;
        }

        .fleet-availability__dot {
          width: 6px;
          height: 6px;
          border-radius: 50%;
        }

        .fleet-availability__status.available .fleet-availability__dot {
          background: #22c55e;
        }

        .fleet-availability__status.unavailable .fleet-availability__dot {
          background: #ef4444;
        }

        .fleet-availability__note {
          text-align: center;
          font-size: 0.7rem;
          color: #888;
        }

        /* ===== PRICING ===== */
        .fleet-pricing {
          padding: 2.5rem 1.5rem;
          background: #faf9f6;
        }

        .fleet-pricing__container {
          max-width: 850px;
          margin: 0 auto;
        }

        .fleet-pricing__grid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 0.75rem;
          margin-bottom: 1rem;
        }

        .fleet-pricing__card {
          background: #fff;
          border: 1px solid #e8e6e2;
          padding: 1rem;
          text-align: center;
          transition: all 0.3s ease;
        }

        .fleet-pricing__card:hover {
          border-color: #1a1a1a;
        }

        .fleet-pricing__header {
          margin-bottom: 0.75rem;
        }

        .fleet-pricing__header h4 {
          font-size: 0.9rem;
          font-weight: 700;
          text-transform: uppercase;
          margin: 0;
        }

        .fleet-pricing__variant {
          font-size: 0.55rem;
          letter-spacing: 0.08em;
          color: #888;
          text-transform: uppercase;
        }

        .fleet-pricing__price {
          margin-bottom: 0.75rem;
        }

        .fleet-pricing__amount {
          display: block;
          font-family: 'Share Tech Mono', monospace;
          font-size: 1.5rem;
          font-weight: 700;
          color: #1a1a1a;
        }

        .fleet-pricing__per {
          font-size: 0.6rem;
          color: #888;
        }

        .fleet-pricing__features {
          list-style: none;
          padding: 0;
          margin: 0 0 0.75rem;
        }

        .fleet-pricing__features li {
          padding: 0.3rem 0;
          font-size: 0.65rem;
          color: #666;
          border-bottom: 1px solid #f0f0f0;
        }

        .fleet-pricing__disclaimer {
          text-align: center;
          font-size: 0.65rem;
          color: #888;
        }

        .fleet-pricing__cta {
          text-align: center;
          margin-top: 1.25rem;
        }

        /* ===== SAFETY ===== */
        .fleet-safety {
          padding: 2.5rem 1.5rem;
          background: #fff;
        }

        .fleet-safety__container {
          max-width: 900px;
          margin: 0 auto;
        }

        .fleet-safety__grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
          gap: 0.75rem;
        }

        .fleet-safety__card {
          background: #faf9f6;
          border: 1px solid #e8e6e2;
          padding: 1rem;
          text-align: center;
          transition: all 0.3s ease;
        }

        .fleet-safety__card:hover {
          border-color: #1a1a1a;
        }

        .fleet-safety__icon {
          font-size: 1.25rem;
          margin-bottom: 0.5rem;
        }

        .fleet-safety__title {
          font-size: 0.75rem;
          font-weight: 600;
          text-transform: uppercase;
          margin: 0 0 0.35rem;
        }

        .fleet-safety__desc {
          font-size: 0.65rem;
          color: #666;
          line-height: 1.4;
          margin: 0;
        }

        /* ===== EXPERIENCE ===== */
        .fleet-experience {
          padding: 2.5rem 1.5rem;
          background: #faf9f6;
        }

        .fleet-experience__container {
          max-width: 950px;
          margin: 0 auto;
        }

        .fleet-experience__grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
          gap: 0.75rem;
        }

        .fleet-experience__card {
          background: #fff;
          border: 1px solid #e8e6e2;
          padding: 1rem;
          position: relative;
        }

        .fleet-experience__quote {
          color: #e8e6e2;
          width: 20px;
          height: 20px;
          margin-bottom: 0.5rem;
        }

        .fleet-experience__text {
          font-size: 0.8rem;
          color: #1a1a1a;
          line-height: 1.5;
          margin: 0 0 0.75rem;
          font-style: italic;
        }

        .fleet-experience__author {
          display: flex;
          justify-content: space-between;
          align-items: flex-end;
          padding-top: 0.5rem;
          border-top: 1px solid #e8e6e2;
        }

        .fleet-experience__name {
          display: block;
          font-weight: 600;
          font-size: 0.7rem;
        }

        .fleet-experience__role {
          font-size: 0.55rem;
          color: #888;
        }

        .fleet-experience__aircraft {
          font-family: 'Share Tech Mono', monospace;
          font-size: 0.6rem;
          color: #666;
        }

        /* ===== CONTACT ===== */
        .fleet-contact {
          padding: 2.5rem 1.5rem;
          background: #fff;
        }

        .fleet-contact__container {
          max-width: 850px;
          margin: 0 auto;
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 2rem;
        }

        .fleet-contact__info h2 {
          font-size: clamp(1.25rem, 2.5vw, 1.5rem);
          font-weight: 700;
          text-transform: uppercase;
          margin: 0.35rem 0 0.5rem;
        }

        .fleet-contact__info p {
          color: #666;
          font-size: 0.8rem;
          line-height: 1.5;
          margin-bottom: 1rem;
        }

        .fleet-contact__details {
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
        }

        .fleet-contact__detail {
          padding-left: 0.65rem;
          border-left: 2px solid #1a1a1a;
        }

        .fleet-contact__detail-label {
          display: block;
          font-size: 0.5rem;
          letter-spacing: 0.1em;
          text-transform: uppercase;
          color: #888;
          margin-bottom: 0.15rem;
        }

        .fleet-contact__detail a,
        .fleet-contact__detail span {
          font-size: 0.75rem;
          color: #1a1a1a;
          text-decoration: none;
        }

        .fleet-contact__detail a:hover {
          text-decoration: underline;
        }

        .fleet-contact__form {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 0.5rem;
        }

        .fleet-contact__field {
          display: flex;
          flex-direction: column;
        }

        .fleet-contact__field--full {
          grid-column: span 2;
        }

        .fleet-contact__field label {
          font-size: 0.55rem;
          font-weight: 500;
          letter-spacing: 0.08em;
          text-transform: uppercase;
          color: #666;
          margin-bottom: 0.25rem;
        }

        .fleet-contact__field input,
        .fleet-contact__field select,
        .fleet-contact__field textarea {
          padding: 0.5rem 0.65rem;
          font-family: 'Space Grotesk', sans-serif;
          font-size: 0.8rem;
          background: #faf9f6;
          border: 1px solid #e8e6e2;
          transition: border-color 0.3s ease;
        }

        .fleet-contact__field input:focus,
        .fleet-contact__field select:focus,
        .fleet-contact__field textarea:focus {
          outline: none;
          border-color: #1a1a1a;
        }

        .fleet-contact__form .fleet-btn {
          grid-column: span 2;
          margin-top: 0.25rem;
        }

        /* ===== CTA ===== */
        .fleet-cta {
          padding: 2.5rem 1.5rem;
          background: #1a1a1a;
          text-align: center;
        }

        .fleet-cta__container {
          max-width: 550px;
          margin: 0 auto;
        }

        .fleet-cta__title {
          font-size: clamp(1.75rem, 4vw, 2.5rem);
          font-weight: 700;
          text-transform: uppercase;
          margin: 0 0 0.5rem;
        }

        .fleet-cta__desc {
          font-size: 0.85rem;
          color: rgba(255,255,255,0.7);
          line-height: 1.5;
          margin-bottom: 1rem;
        }

        .fleet-cta__actions {
          display: flex;
          justify-content: center;
          gap: 0.5rem;
          flex-wrap: wrap;
        }

        /* ===== DISCOVERY ===== */
        .fleet-discovery {
          background: #2a2a2a;
          position: relative;
          overflow: hidden;
        }

        .fleet-discovery::after {
          content: '';
          position: absolute;
          bottom: 0;
          left: 0;
          right: 0;
          height: 3px;
          background: linear-gradient(to right, #333 0%, #333 35%, #555 50%, #333 65%, #333 100%);
        }

        .fleet-discovery__inner {
          display: flex;
          min-height: 180px;
        }

        .fleet-discovery__image {
          position: relative;
          flex: 0 0 35%;
        }

        .fleet-discovery__image img {
          position: absolute;
          inset: 0;
          width: 100%;
          height: 100%;
          object-fit: cover;
        }

        .fleet-discovery__image-overlay {
          position: absolute;
          inset: 0;
          background: linear-gradient(90deg, transparent 0%, rgba(42,42,42,1) 100%);
        }

        .fleet-discovery__content {
          flex: 1;
          display: flex;
          flex-direction: column;
          justify-content: center;
          padding: 1.5rem 2rem;
        }

        .fleet-discovery__header {
          margin-bottom: 0.5rem;
        }

        .fleet-discovery__header h2 {
          font-size: clamp(1.25rem, 2.5vw, 1.75rem);
          font-weight: 700;
          text-transform: uppercase;
          margin: 0.25rem 0 0;
        }

        .fleet-discovery__desc {
          color: rgba(255,255,255,0.7);
          font-size: 0.8rem;
          line-height: 1.5;
          margin: 0 0 0.75rem;
          max-width: 350px;
        }

        .fleet-discovery__compact-row {
          display: flex;
          align-items: center;
          gap: 1.5rem;
        }

        .fleet-discovery__selling-points {
          display: flex;
          gap: 1rem;
        }

        .fleet-discovery__point {
          display: flex;
          align-items: center;
          gap: 0.35rem;
        }

        .fleet-discovery__point-icon {
          font-size: 0.8rem;
        }

        .fleet-discovery__point-text {
          font-size: 0.65rem;
          color: rgba(255,255,255,0.8);
        }

        .fleet-discovery__booking {
          display: flex;
          align-items: center;
          gap: 1rem;
        }

        .fleet-discovery__price {
          display: flex;
          align-items: baseline;
          gap: 0.15rem;
        }

        .fleet-discovery__price-from {
          font-size: 0.55rem;
          color: rgba(255,255,255,0.5);
        }

        .fleet-discovery__price-amount {
          font-family: 'Share Tech Mono', monospace;
          font-size: 1.25rem;
          font-weight: 700;
          color: #fff;
        }

        /* ===== RESPONSIVE ===== */
        @media (max-width: 1024px) {
          .fleet-timeline__track {
            grid-template-columns: repeat(3, 1fr);
          }

          .fleet-contact__container {
            grid-template-columns: 1fr;
            gap: 3rem;
          }
        }

        @media (max-width: 768px) {
          .fleet-hero__content {
            padding: 4rem 2rem;
          }

          .fleet-counter__container {
            grid-template-columns: repeat(2, 1fr);
          }

          .fleet-timeline__track {
            grid-template-columns: repeat(2, 1fr);
          }

          .fleet-highlight {
            padding: 4rem 2rem;
          }

          .fleet-highlight__specs {
            gap: 1.5rem;
          }

          .fleet-discovery__inner {
            flex-direction: column;
          }

          .fleet-discovery__image {
            flex: 0 0 200px;
          }

          .fleet-discovery__image-overlay {
            background: linear-gradient(180deg, transparent 0%, rgba(42,42,42,1) 100%);
          }

          .fleet-discovery__content {
            padding: 2rem;
          }

          .fleet-discovery__compact-row {
            flex-direction: column;
            align-items: flex-start;
            gap: 1.5rem;
          }

          .fleet-discovery__selling-points {
            flex-wrap: wrap;
          }

          .fleet-contact__form {
            grid-template-columns: 1fr;
          }

          .fleet-contact__field--full {
            grid-column: span 1;
          }

          .fleet-contact__form .fleet-btn {
            grid-column: span 1;
          }

          .aircraft-specs__grid {
            grid-template-columns: repeat(2, 1fr);
          }
        }

        @media (max-width: 480px) {
          .fleet-hero__badges {
            flex-direction: column;
            gap: 1rem;
          }

          .fleet-hero__badge-divider {
            width: 40px;
            height: 1px;
          }

          .fleet-counter__container {
            grid-template-columns: 1fr;
          }

          .fleet-timeline__track {
            grid-template-columns: 1fr;
          }

          .fleet-cta__actions {
            flex-direction: column;
          }

          .fleet-cta__actions .fleet-btn {
            width: 100%;
            justify-content: center;
          }
        }
      `}</style>
    </div>
  );
}

export default Fleet;

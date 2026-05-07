/**
 * HQ AVIATION - HUGHES 500 / MD 500 AIRCRAFT PAGE
 *
 * Brand: Luxury Minimal Aviation
 * Typography: Space Grotesk + Share Tech Mono
 * Colors: #faf9f6 (warm white), #1a1a1a (charcoal), #4a4a4a (mid), #7a7a7a (light)
 * Aesthetic: Editorial Design, Luxury Aviation
 *
 * Sections:
 * 1. Hero - Full viewport with animated title - "ICONIC PERFORMER" / "LEGEND"
 * 2. Introduction - The legendary light turbine
 * 3. History Timeline - 1963 to present
 * 4. Technical Specifications - Interactive specs card
 * 5. Flight Characteristics - Agility, speed, hot/high capability
 * 6. NOTAR Technology - MD 520N revolutionary design
 * 7. Variants - OH-6 Cayuse, 500C, 500D, 500E, MD 530F, MD 520N
 * 8. Gallery - Grid of H500 images
 * 9. Services CTA - Maintenance, type rating at HQ Aviation
 */

import React, { useRef, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, useInView, useScroll, useTransform, AnimatePresence } from 'framer-motion';

// Import styles
import '../assets/css/main.css';
import '../assets/css/components.css';

// Import Footer
import FooterMinimal from '../components/FooterMinimal';
import HqMenuPanel from '../components/HqMenuPanel';
import Seo from '../components/seo/Seo';
import { buildBreadcrumbList } from '../components/seo/jsonLd';

// ============================================================================
// COMPONENT: H500Header
// ============================================================================
function H500Header() {
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

const h500Specs = [
  { label: 'Engine', value: 'Rolls-Royce 250-C20B/R', icon: 'fa-cog' },
  { label: 'Power', value: '420-450 SHP', icon: 'fa-bolt' },
  { label: 'Max Speed', value: '152 kts', icon: 'fa-tachometer-alt' },
  { label: 'Cruise Speed', value: '135 kts', icon: 'fa-plane' },
  { label: 'Range', value: '235 nm', icon: 'fa-route' },
  { label: 'Service Ceiling', value: '16,000 ft', icon: 'fa-mountain' },
  { label: 'Seats', value: '5', icon: 'fa-users' },
  { label: 'Main Rotor', value: '5-Blade', icon: 'fa-circle-notch' },
  { label: 'Empty Weight', value: '1,494 lbs', icon: 'fa-weight-hanging' },
  { label: 'Max Gross Weight', value: '3,000 lbs', icon: 'fa-balance-scale' },
];

const historyTimeline = [
  { year: '1963', title: 'First Flight', description: 'The Hughes Model 369 (OH-6 Cayuse) made its maiden flight on February 27, winning the U.S. Army Light Observation Helicopter competition.' },
  { year: '1966', title: 'Civilian Variant', description: 'The civilian Hughes 500 first flew, designed as a commercial adaptation of the military OH-6A.' },
  { year: '1967', title: 'Market Introduction', description: 'The Hughes 500 entered commercial service, quickly becoming popular for its performance and versatility.' },
  { year: '1976', title: 'Hughes 500D', description: 'Introduction of the improved 500D model with a T-tail and upgraded performance characteristics.' },
  { year: '1984', title: 'McDonnell Douglas Acquisition', description: 'Hughes Helicopters was acquired by McDonnell Douglas in January 1984, beginning a new era for the aircraft.' },
  { year: '1985', title: 'MD Rebranding', description: 'The helicopter line was rebranded as MD 500E and MD 530F in August, featuring the distinctive five-blade main rotor.' },
  { year: '1991', title: 'NOTAR Introduction', description: 'The revolutionary MD 520N introduced NOTAR technology, eliminating the conventional tail rotor entirely.' },
  { year: '1999', title: 'MD Helicopters', description: 'Boeing sold the helicopter division to the newly created MD Helicopters, ensuring the legacy continues.' },
];

const flightCharacteristics = [
  {
    title: 'Agile Control Response',
    description: 'The short-diameter main rotor and compact tail design deliver exceptionally crisp, responsive handling that pilots love. Quick cyclic response makes precision flying intuitive.',
    icon: 'fa-bullseye',
  },
  {
    title: 'Hot & High Performance',
    description: 'Legendary performance at altitude and in high temperatures. The turboshaft powerplant maintains authority where other helicopters struggle, ideal for mountain and desert operations.',
    icon: 'fa-mountain',
  },
  {
    title: 'Speed & Maneuverability',
    description: 'With a cruise speed of 135 knots and nimble handling, the 500 series excels in demanding missions from law enforcement pursuit to utility work in confined spaces.',
    icon: 'fa-tachometer-alt',
  },
  {
    title: 'Weather Stability',
    description: 'The compact design is less susceptible to weather-cocking in crosswinds and gusty conditions, providing stable performance when other helicopters are challenged.',
    icon: 'fa-wind',
  },
];

const notarFeatures = [
  {
    title: 'No Tail Rotor',
    description: 'The NOTAR system completely eliminates the conventional tail rotor, replacing it with a revolutionary fan and thruster system.',
    icon: 'fa-ban',
  },
  {
    title: 'Coanda Effect',
    description: 'Exhaust from an internal fan is directed through slots in the tailboom, using the Coanda effect to counteract main rotor torque.',
    icon: 'fa-wind',
  },
  {
    title: 'Enhanced Safety',
    description: 'No exposed tail rotor means dramatically reduced risk of tail rotor strikes in confined areas and around ground personnel.',
    icon: 'fa-shield-alt',
  },
  {
    title: 'Reduced Noise',
    description: 'NOTAR aircraft are significantly quieter than conventional helicopters, ideal for noise-sensitive operations and urban environments.',
    icon: 'fa-volume-down',
  },
];

const h500Variants = [
  {
    name: 'OH-6 Cayuse',
    description: 'The original military observation helicopter that started it all. Nicknamed "Loach" by Army crews, it served with distinction in Vietnam and remains a symbol of light helicopter capability.',
    features: ['Military Light Observation', 'Allison T63 Engine', 'Combat Proven Design', 'U.S. Army Service'],
  },
  {
    name: 'Hughes 500C',
    description: 'The first widely successful civilian variant, establishing the 500 series reputation for reliability and performance in commercial operations worldwide.',
    features: ['Allison 250-C18 Engine', 'Civilian Certification', 'Executive Transport', 'Utility Configuration'],
  },
  {
    name: 'Hughes 500D',
    description: 'Introduced the distinctive T-tail and improved performance. Became the benchmark for light turbine helicopters in the 1970s and 1980s.',
    features: ['T-Tail Configuration', 'Allison 250-C20B Engine', 'Improved Performance', 'Updated Avionics'],
  },
  {
    name: 'MD 500E',
    description: 'The McDonnell Douglas evolution featuring a five-blade main rotor for smoother operation, improved visibility, and enhanced performance characteristics.',
    features: ['Five-Blade Main Rotor', 'Rolls-Royce 250-C20B', 'Improved Visibility', 'Reduced Vibration'],
  },
  {
    name: 'MD 530F',
    description: 'The high-performance variant with increased power and payload capacity. Favored for demanding operations in hot and high conditions.',
    features: ['Rolls-Royce 250-C30 Engine', '650 SHP Available', 'Hot/High Optimized', 'Military & Civilian Versions'],
  },
  {
    name: 'MD 520N',
    description: 'The revolutionary NOTAR variant eliminating the conventional tail rotor. Offers unmatched safety and reduced noise for urban and confined-area operations.',
    features: ['NOTAR Anti-Torque System', 'No Tail Rotor', 'Reduced Noise Signature', 'Enhanced Safety'],
  },
];

const legacyStats = [
  { label: 'Years in Service', value: '60', suffix: '+' },
  { label: 'Aircraft Produced', value: '4900', suffix: '+' },
  { label: 'Countries Operating', value: '30', suffix: '+' },
  { label: 'Combat Missions', value: '2000000', suffix: '+' },
];

const galleryImages = [
  { src: '/assets/images/aircraft/h500/h500-flight-1.jpg', alt: 'Hughes 500 in Flight' },
  { src: '/assets/images/aircraft/h500/h500-cockpit.jpg', alt: 'Hughes 500 Cockpit' },
  { src: '/assets/images/aircraft/h500/md500e-exterior.jpg', alt: 'MD 500E Exterior' },
  { src: '/assets/images/aircraft/h500/md520n-notar.jpg', alt: 'MD 520N NOTAR' },
  { src: '/assets/images/aircraft/h500/h500-utility.jpg', alt: 'Hughes 500 Utility Operations' },
  { src: '/assets/images/aircraft/h500/oh6-cayuse.jpg', alt: 'OH-6 Cayuse Military' },
];

// ============================================================================
// SECTION 1: Hero
// ============================================================================
function H500Hero() {
  const heroRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ['start start', 'end start'],
  });

  const heroOpacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);
  const heroScale = useTransform(scrollYProgress, [0, 0.5], [1, 0.95]);
  const heroY = useTransform(scrollYProgress, [0, 0.5], [0, 100]);
  const overlayOpacity = useTransform(scrollYProgress, [0, 0.3], [0.4, 0.8]);

  return (
    <section ref={heroRef} className="h500-hero">
      <motion.div
        className="h500-hero__bg"
        initial={{ scale: 1.1, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 1.5 }}
      >
        <div className="h500-hero__bg-gradient" />
      </motion.div>

      <motion.div
        className="h500-hero__overlay"
        style={{ opacity: overlayOpacity }}
      />

      <motion.div
        className="h500-hero__content"
        style={{ opacity: heroOpacity, scale: heroScale, y: heroY }}
      >
        <motion.span
          className="h500-hero__label"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          HUGHES / MD HELICOPTERS
        </motion.span>

        <div className="h500-hero__headline">
          {['5', '0', '0'].map((letter, i) => (
            <motion.span
              key={i}
              className="h500-hero__letter"
              initial={{ opacity: 0, y: 60, rotateX: -45 }}
              animate={{ opacity: 1, y: 0, rotateX: 0 }}
              transition={{
                duration: 0.8,
                delay: 0.4 + i * 0.15,
                ease: [0.16, 1, 0.3, 1]
              }}
            >
              {letter}
            </motion.span>
          ))}
        </div>

        <motion.span
          className="h500-hero__subtitle"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.9 }}
        >
          ICONIC LEGEND
        </motion.span>

        <motion.div
          className="h500-hero__divider"
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ duration: 0.8, delay: 1.1 }}
        />

        <motion.p
          className="h500-hero__tagline"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.3 }}
        >
          The helicopter that defined an era. Sixty years of proven performance,
          agility, and innovation in rotary-wing aviation.
        </motion.p>

        <motion.div
          className="h500-hero__badges"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.5 }}
        >
          <div className="h500-hero__badge">
            <span className="h500-hero__badge-value">135</span>
            <span className="h500-hero__badge-label">KTS</span>
          </div>
          <div className="h500-hero__badge-divider" />
          <div className="h500-hero__badge">
            <span className="h500-hero__badge-value">16K</span>
            <span className="h500-hero__badge-label">FT CEILING</span>
          </div>
          <div className="h500-hero__badge-divider" />
          <div className="h500-hero__badge">
            <span className="h500-hero__badge-value">5</span>
            <span className="h500-hero__badge-label">SEATS</span>
          </div>
        </motion.div>
      </motion.div>

      <motion.div
        className="h500-hero__scroll"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.8 }}
      >
        <span>Scroll to explore</span>
        <div className="h500-hero__scroll-line">
          <div className="h500-hero__scroll-dot" />
        </div>
      </motion.div>
    </section>
  );
}

// ============================================================================
// SECTION 2: Introduction
// ============================================================================
function H500Introduction() {
  return (
    <section className="h500-intro">
      <div className="h500-intro__container">
        <div className="h500-intro__content">
          <Reveal>
            <span className="h500-pre-text">THE LEGENDARY LIGHT TURBINE</span>
          </Reveal>
          <Reveal delay={0.1}>
            <h2 className="h500-intro__headline">
              <span className="h500-text--dark">An Icon</span>{' '}
              <span className="h500-text--mid">of Rotary</span>{' '}
              <span className="h500-text--light">Aviation</span>
            </h2>
          </Reveal>
          <Reveal delay={0.2}>
            <p className="h500-intro__text">
              Born from a U.S. Army competition in the early 1960s, the Hughes 500 series
              has become one of the most recognized and respected light turbine helicopters
              in aviation history. From the jungles of Vietnam to the streets of modern cities,
              the 500 has proven itself in every environment imaginable.
            </p>
          </Reveal>
          <Reveal delay={0.3}>
            <p className="h500-intro__text">
              With its distinctive egg-shaped fuselage, responsive controls, and legendary
              hot-and-high performance, the 500 series continues to set the standard for
              light turbine helicopter capability. Today, HQ Aviation maintains and supports
              this iconic aircraft, keeping the legend flying.
            </p>
          </Reveal>
        </div>
        <Reveal delay={0.4} direction="right">
          <div className="h500-intro__visual">
            <div className="h500-intro__stat-card">
              <div className="h500-intro__stat">
                <span className="h500-intro__stat-value">1963</span>
                <span className="h500-intro__stat-label">First Flight</span>
              </div>
              <div className="h500-intro__stat">
                <span className="h500-intro__stat-value">60+</span>
                <span className="h500-intro__stat-label">Years of Service</span>
              </div>
              <div className="h500-intro__stat">
                <span className="h500-intro__stat-value">4,900+</span>
                <span className="h500-intro__stat-label">Aircraft Built</span>
              </div>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

// ============================================================================
// SECTION 3: History Timeline
// ============================================================================
function H500History() {
  return (
    <section className="h500-history">
      <div className="h500-history__container">
        <Reveal>
          <div className="h500-section-header">
            <span className="h500-pre-text">SIX DECADES OF EXCELLENCE</span>
            <h2>
              <span className="h500-text--dark">History</span>{' '}
              <span className="h500-text--mid">of the</span>{' '}
              <span className="h500-text--light">500 Series</span>
            </h2>
          </div>
        </Reveal>

        <div className="h500-history__timeline">
          {historyTimeline.map((event, i) => (
            <Reveal key={i} delay={i * 0.1}>
              <div className="h500-history__item">
                <div className="h500-history__year">{event.year}</div>
                <div className="h500-history__line">
                  <div className="h500-history__dot" />
                </div>
                <div className="h500-history__content">
                  <h4>{event.title}</h4>
                  <p>{event.description}</p>
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
// SECTION 4: Technical Specifications
// ============================================================================
function H500Specifications() {
  const [activeSpec, setActiveSpec] = useState(null);

  return (
    <section className="h500-specs">
      <div className="h500-specs__container">
        <div className="h500-specs__left">
          <Reveal>
            <div className="h500-section-header">
              <span className="h500-pre-text">PERFORMANCE DATA</span>
              <h2>
                <span className="h500-text--dark">Technical</span>{' '}
                <span className="h500-text--mid">Specifications</span>
              </h2>
              <p className="h500-specs__subtitle">MD 500E Configuration</p>
            </div>
          </Reveal>

          <div className="h500-specs__grid">
            {h500Specs.map((spec, i) => (
              <Reveal key={i} delay={i * 0.05}>
                <motion.div
                  className={`h500-specs__item ${activeSpec === i ? 'active' : ''}`}
                  onHoverStart={() => setActiveSpec(i)}
                  onHoverEnd={() => setActiveSpec(null)}
                  whileHover={{ scale: 1.02 }}
                >
                  <div className="h500-specs__icon">
                    <i className={`fas ${spec.icon}`}></i>
                  </div>
                  <div className="h500-specs__data">
                    <span className="h500-specs__label">{spec.label}</span>
                    <span className="h500-specs__value">{spec.value}</span>
                  </div>
                </motion.div>
              </Reveal>
            ))}
          </div>
        </div>

        <Reveal delay={0.3} direction="right">
          <div className="h500-specs__right">
            <div className="h500-specs__design">
              <h3>Design Features</h3>
              <ul className="h500-specs__features">
                <li>
                  <i className="fas fa-check"></i>
                  <span>Short-diameter main rotor for agile response</span>
                </li>
                <li>
                  <i className="fas fa-check"></i>
                  <span>Compact tail design reduces weather-cocking</span>
                </li>
                <li>
                  <i className="fas fa-check"></i>
                  <span>Shock-absorbing landing skid struts</span>
                </li>
                <li>
                  <i className="fas fa-check"></i>
                  <span>Turboshaft engine mounted at 45-degree angle</span>
                </li>
                <li>
                  <i className="fas fa-check"></i>
                  <span>Fuel tank under floor for low center of gravity</span>
                </li>
                <li>
                  <i className="fas fa-check"></i>
                  <span>Battery positioned in nose for optimal balance</span>
                </li>
              </ul>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

// ============================================================================
// SECTION 5: Flight Characteristics
// ============================================================================
function H500FlightCharacteristics() {
  return (
    <section className="h500-flight">
      <div className="h500-flight__container">
        <Reveal>
          <div className="h500-section-header h500-section-header--center">
            <span className="h500-pre-text">IN THE AIR</span>
            <h2>
              <span className="h500-text--dark">Flight</span>{' '}
              <span className="h500-text--mid">Characteristics</span>
            </h2>
          </div>
        </Reveal>

        <div className="h500-flight__grid">
          {flightCharacteristics.map((char, i) => (
            <Reveal key={i} delay={i * 0.15}>
              <motion.div
                className="h500-flight__card"
                whileHover={{ y: -8 }}
                transition={{ duration: 0.3 }}
              >
                <div className="h500-flight__icon">
                  <i className={`fas ${char.icon}`}></i>
                </div>
                <h3>{char.title}</h3>
                <p>{char.description}</p>
              </motion.div>
            </Reveal>
          ))}
        </div>

        <Reveal delay={0.6}>
          <div className="h500-flight__quote">
            <blockquote>
              "The 500 is a pilot's helicopter. It goes where you point it, instantly.
              There's nothing quite like the responsiveness and precision of this aircraft."
            </blockquote>
            <cite>- Veteran Hughes 500 Pilot</cite>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

// ============================================================================
// SECTION 6: NOTAR Technology
// ============================================================================
function H500Notar() {
  const sectionRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start end', 'end start'],
  });

  const bgY = useTransform(scrollYProgress, [0, 1], ['-10%', '10%']);

  return (
    <section ref={sectionRef} className="h500-notar">
      <motion.div className="h500-notar__bg" style={{ y: bgY }}>
        <div className="h500-notar__bg-pattern" />
      </motion.div>
      <div className="h500-notar__overlay" />

      <div className="h500-notar__container">
        <Reveal>
          <div className="h500-section-header h500-section-header--light h500-section-header--center">
            <span className="h500-pre-text h500-pre-text--light">REVOLUTIONARY TECHNOLOGY</span>
            <h2>
              <span style={{ color: '#fff' }}>NOTAR</span>
            </h2>
            <h3 className="h500-notar__subtitle">
              <span style={{ color: 'rgba(255,255,255,0.8)' }}>No Tail Rotor System</span>
            </h3>
          </div>
        </Reveal>

        <Reveal delay={0.2}>
          <div className="h500-notar__intro">
            <p>
              The MD 520N introduced one of the most significant innovations in helicopter history:
              NOTAR (No Tail Rotor). This revolutionary anti-torque system completely eliminates
              the conventional tail rotor, replacing it with an enclosed fan and Coanda-effect
              circulation control system.
            </p>
          </div>
        </Reveal>

        <div className="h500-notar__grid">
          {notarFeatures.map((feature, i) => (
            <Reveal key={i} delay={0.3 + i * 0.1}>
              <motion.div
                className="h500-notar__card"
                whileHover={{ scale: 1.02 }}
              >
                <div className="h500-notar__icon">
                  <i className={`fas ${feature.icon}`}></i>
                </div>
                <h4>{feature.title}</h4>
                <p>{feature.description}</p>
              </motion.div>
            </Reveal>
          ))}
        </div>

        <Reveal delay={0.7}>
          <div className="h500-notar__how-it-works">
            <h3>How NOTAR Works</h3>
            <div className="h500-notar__steps">
              <div className="h500-notar__step">
                <div className="h500-notar__step-num">01</div>
                <div className="h500-notar__step-content">
                  <h4>Variable-Pitch Fan</h4>
                  <p>An enclosed variable-pitch fan draws air into the tailboom.</p>
                </div>
              </div>
              <div className="h500-notar__step">
                <div className="h500-notar__step-num">02</div>
                <div className="h500-notar__step-content">
                  <h4>Circulation Control</h4>
                  <p>Air is forced through slots on the right side of the tailboom.</p>
                </div>
              </div>
              <div className="h500-notar__step">
                <div className="h500-notar__step-num">03</div>
                <div className="h500-notar__step-content">
                  <h4>Coanda Effect</h4>
                  <p>The Coanda effect creates a boundary layer that generates anti-torque force.</p>
                </div>
              </div>
              <div className="h500-notar__step">
                <div className="h500-notar__step-num">04</div>
                <div className="h500-notar__step-content">
                  <h4>Direct Jet Thruster</h4>
                  <p>A rotating thruster at the tail provides additional yaw control.</p>
                </div>
              </div>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

// ============================================================================
// SECTION 7: Variants
// ============================================================================
function H500Variants() {
  const [activeVariant, setActiveVariant] = useState(0);

  return (
    <section className="h500-variants">
      <div className="h500-variants__container">
        <Reveal>
          <div className="h500-section-header h500-section-header--center">
            <span className="h500-pre-text">THE FAMILY TREE</span>
            <h2>
              <span className="h500-text--dark">500 Series</span>{' '}
              <span className="h500-text--mid">Variants</span>
            </h2>
          </div>
        </Reveal>

        <div className="h500-variants__tabs">
          {h500Variants.map((variant, i) => (
            <button
              key={i}
              className={`h500-variants__tab ${activeVariant === i ? 'active' : ''}`}
              onClick={() => setActiveVariant(i)}
            >
              {variant.name}
            </button>
          ))}
        </div>

        <AnimatePresence mode="wait">
          <motion.div
            key={activeVariant}
            className="h500-variants__content"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.4 }}
          >
            <div className="h500-variants__info">
              <h3>{h500Variants[activeVariant].name}</h3>
              <p>{h500Variants[activeVariant].description}</p>
              <ul className="h500-variants__features">
                {h500Variants[activeVariant].features.map((feature, i) => (
                  <li key={i}>
                    <i className="fas fa-check"></i>
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
// SECTION 8: Legacy Stats
// ============================================================================
function H500Legacy() {
  return (
    <section className="h500-legacy">
      <div className="h500-legacy__container">
        <Reveal>
          <div className="h500-section-header h500-section-header--center">
            <span className="h500-pre-text">A PROVEN LEGACY</span>
            <h2>
              <span className="h500-text--dark">By the</span>{' '}
              <span className="h500-text--mid">Numbers</span>
            </h2>
          </div>
        </Reveal>

        <div className="h500-legacy__grid">
          {legacyStats.map((stat, i) => (
            <Reveal key={i} delay={i * 0.15}>
              <div className="h500-legacy__stat">
                <span className="h500-legacy__stat-value">
                  <AnimatedNumber value={stat.value} suffix={stat.suffix} />
                </span>
                <span className="h500-legacy__stat-label">{stat.label}</span>
              </div>
            </Reveal>
          ))}
        </div>

        <Reveal delay={0.6}>
          <div className="h500-legacy__uses">
            <h3>Worldwide Applications</h3>
            <div className="h500-legacy__uses-grid">
              <div className="h500-legacy__use">
                <i className="fas fa-shield-alt"></i>
                <span>Law Enforcement</span>
              </div>
              <div className="h500-legacy__use">
                <i className="fas fa-fighter-jet"></i>
                <span>Military Operations</span>
              </div>
              <div className="h500-legacy__use">
                <i className="fas fa-briefcase"></i>
                <span>Executive Transport</span>
              </div>
              <div className="h500-legacy__use">
                <i className="fas fa-tools"></i>
                <span>Utility Work</span>
              </div>
              <div className="h500-legacy__use">
                <i className="fas fa-ambulance"></i>
                <span>Emergency Medical</span>
              </div>
              <div className="h500-legacy__use">
                <i className="fas fa-broadcast-tower"></i>
                <span>Electronic News Gathering</span>
              </div>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

// ============================================================================
// SECTION 9: Gallery
// ============================================================================
function H500Gallery() {
  const [selectedImage, setSelectedImage] = useState(null);

  return (
    <section className="h500-gallery">
      <div className="h500-gallery__container">
        <Reveal>
          <div className="h500-section-header h500-section-header--center">
            <span className="h500-pre-text">VISUALS</span>
            <h2>
              <span className="h500-text--dark">500 Series</span>{' '}
              <span className="h500-text--mid">Gallery</span>
            </h2>
          </div>
        </Reveal>

        <div className="h500-gallery__grid">
          {galleryImages.map((image, i) => (
            <Reveal key={i} delay={i * 0.1}>
              <motion.div
                className="h500-gallery__item"
                whileHover={{ scale: 1.02 }}
                onClick={() => setSelectedImage(image)}
              >
                <div className="h500-gallery__placeholder">
                  <i className="fas fa-helicopter"></i>
                  <span>{image.alt}</span>
                </div>
                <div className="h500-gallery__overlay">
                  <i className="fas fa-expand"></i>
                </div>
              </motion.div>
            </Reveal>
          ))}
        </div>
      </div>

      <AnimatePresence>
        {selectedImage && (
          <motion.div
            className="h500-gallery__lightbox"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSelectedImage(null)}
          >
            <motion.div
              className="h500-gallery__lightbox-content"
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.9 }}
            >
              <div className="h500-gallery__lightbox-placeholder">
                <i className="fas fa-helicopter"></i>
                <span>{selectedImage.alt}</span>
              </div>
              <button
                className="h500-gallery__lightbox-close"
                onClick={() => setSelectedImage(null)}
              >
                <i className="fas fa-times"></i>
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}

// ============================================================================
// SECTION 10: Services CTA
// ============================================================================
function H500CTA() {
  return (
    <section className="h500-cta">
      <div className="h500-cta__container">
        <Reveal>
          <span className="h500-pre-text">HQ AVIATION SERVICES</span>
          <h2>
            <span className="h500-text--dark">Experience</span>{' '}
            <span className="h500-text--mid">the</span>{' '}
            <span className="h500-text--light">Legend</span>
          </h2>
          <p>
            HQ Aviation maintains and operates Hughes 500 aircraft, offering comprehensive
            maintenance services and type rating training for this iconic helicopter.
          </p>
        </Reveal>

        <Reveal delay={0.2}>
          <div className="h500-cta__services">
            <div className="h500-cta__service">
              <div className="h500-cta__service-icon">
                <i className="fas fa-wrench"></i>
              </div>
              <h3>Maintenance</h3>
              <p>Expert maintenance and support for Hughes 500 and MD 500 series helicopters. Our experienced engineers keep your aircraft flying safely.</p>
              <Link to="/maintenance" className="h500-btn h500-btn--outline">
                Learn More
              </Link>
            </div>
            <div className="h500-cta__service">
              <div className="h500-cta__service-icon">
                <i className="fas fa-graduation-cap"></i>
              </div>
              <h3>Type Rating</h3>
              <p>Comprehensive type rating training for the Hughes 500 series. Learn from experienced instructors who know this aircraft inside and out.</p>
              <Link to="/training/type-rating" className="h500-btn h500-btn--outline">
                View Training
              </Link>
            </div>
          </div>
        </Reveal>

        <Reveal delay={0.4}>
          <div className="h500-cta__actions">
            <Link to="/fleet" className="h500-btn h500-btn--secondary">
              <i className="fas fa-helicopter"></i>
              View Fleet
            </Link>
          </div>
        </Reveal>

        <Reveal delay={0.5}>
          <div className="h500-cta__contact">
            <div className="h500-cta__contact-item">
              <i className="fas fa-phone"></i>
              <span>+44 1895 833 373</span>
            </div>
            <div className="h500-cta__contact-item">
              <i className="fas fa-envelope"></i>
              <span>maintenance@hqaviation.com</span>
            </div>
            <div className="h500-cta__contact-item">
              <i className="fas fa-map-marker-alt"></i>
              <span>Denham Aerodrome, UK</span>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

// ============================================================================
// STYLES (Inline for page-specific styles)
// ============================================================================
const H500Styles = () => (
  <style>{`
    /* ====================================================================
       H500 PAGE STYLES
       ==================================================================== */

    /* Typography Variables */
    .h500-pre-text {
      display: block;
      font-family: 'Share Tech Mono', monospace;
      font-size: 0.75rem;
      letter-spacing: 0.25em;
      text-transform: uppercase;
      color: #999;
      margin-bottom: 1rem;
    }

    .h500-pre-text--light {
      color: rgba(255, 255, 255, 0.6);
    }

    .h500-text--dark { color: #1a1a1a; }
    .h500-text--mid { color: #4a4a4a; }
    .h500-text--light { color: #7a7a7a; }

    .h500-section-header {
      margin-bottom: 3rem;
    }

    .h500-section-header--center {
      text-align: center;
    }

    .h500-section-header--light .h500-pre-text {
      color: rgba(255, 255, 255, 0.6);
    }

    .h500-section-header h2 {
      font-family: 'Space Grotesk', sans-serif;
      font-size: clamp(2rem, 5vw, 3.5rem);
      font-weight: 500;
      line-height: 1.1;
      margin: 0;
    }

    /* Buttons */
    .h500-btn {
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

    .h500-btn--primary {
      background: #1a1a1a;
      color: #fff;
    }

    .h500-btn--primary:hover {
      background: #333;
      color: #fff;
      transform: translateY(-2px);
    }

    .h500-btn--secondary {
      background: #4a4a4a;
      color: #fff;
    }

    .h500-btn--secondary:hover {
      background: #5a5a5a;
      transform: translateY(-2px);
    }

    .h500-btn--outline {
      background: transparent;
      color: #1a1a1a;
      border: 1px solid #1a1a1a;
    }

    .h500-btn--outline:hover {
      background: #1a1a1a;
      color: #fff;
    }

    .h500-btn--light {
      background: rgba(255, 255, 255, 0.1);
      color: #fff;
      border: 1px solid rgba(255, 255, 255, 0.3);
      backdrop-filter: blur(10px);
    }

    .h500-btn--light:hover {
      background: rgba(255, 255, 255, 0.2);
    }

    /* ====================================================================
       HERO SECTION
       ==================================================================== */
    .h500-hero {
      position: relative;
      height: 100vh;
      min-height: 700px;
      overflow: hidden;
      display: flex;
      align-items: center;
      justify-content: center;
    }

    .h500-hero__bg {
      position: absolute;
      inset: 0;
      z-index: 0;
      background: linear-gradient(135deg, #1a1a1a 0%, #2d2d2d 50%, #1a1a1a 100%);
    }

    .h500-hero__bg-gradient {
      position: absolute;
      inset: 0;
      background:
        radial-gradient(ellipse at 30% 20%, rgba(255,255,255,0.05) 0%, transparent 50%),
        radial-gradient(ellipse at 70% 80%, rgba(255,255,255,0.03) 0%, transparent 50%);
    }

    .h500-hero__overlay {
      position: absolute;
      inset: 0;
      background: linear-gradient(
        to bottom,
        rgba(0, 0, 0, 0.2) 0%,
        rgba(0, 0, 0, 0.4) 100%
      );
      z-index: 1;
    }

    .h500-hero__content {
      position: relative;
      z-index: 2;
      text-align: center;
      color: #fff;
      max-width: 900px;
      padding: 0 2rem;
    }

    .h500-hero__label {
      display: block;
      font-family: 'Share Tech Mono', monospace;
      font-size: 0.75rem;
      letter-spacing: 0.3em;
      color: rgba(255, 255, 255, 0.7);
      margin-bottom: 1.5rem;
    }

    .h500-hero__headline {
      display: flex;
      justify-content: center;
      gap: 0.5rem;
      margin-bottom: 0.5rem;
    }

    .h500-hero__letter {
      font-family: 'Space Grotesk', sans-serif;
      font-size: clamp(5rem, 15vw, 12rem);
      font-weight: 500;
      line-height: 1;
      color: #fff;
    }

    .h500-hero__subtitle {
      display: block;
      font-family: 'Share Tech Mono', monospace;
      font-size: clamp(1.25rem, 3vw, 2rem);
      letter-spacing: 0.5em;
      color: rgba(255, 255, 255, 0.8);
      margin-bottom: 2rem;
    }

    .h500-hero__divider {
      width: 100px;
      height: 1px;
      background: rgba(255, 255, 255, 0.4);
      margin: 0 auto 2rem;
      transform-origin: center;
    }

    .h500-hero__tagline {
      font-family: 'Space Grotesk', sans-serif;
      font-size: 1.125rem;
      line-height: 1.6;
      color: rgba(255, 255, 255, 0.9);
      max-width: 600px;
      margin: 0 auto 3rem;
    }

    .h500-hero__badges {
      display: flex;
      justify-content: center;
      align-items: center;
      gap: 2rem;
    }

    .h500-hero__badge {
      text-align: center;
    }

    .h500-hero__badge-value {
      display: block;
      font-family: 'Space Grotesk', sans-serif;
      font-size: 2.5rem;
      font-weight: 500;
      color: #fff;
    }

    .h500-hero__badge-label {
      display: block;
      font-family: 'Share Tech Mono', monospace;
      font-size: 0.75rem;
      letter-spacing: 0.2em;
      color: rgba(255, 255, 255, 0.6);
    }

    .h500-hero__badge-divider {
      width: 1px;
      height: 40px;
      background: rgba(255, 255, 255, 0.3);
    }

    .h500-hero__scroll {
      position: absolute;
      bottom: 3rem;
      left: 50%;
      transform: translateX(-50%);
      z-index: 2;
      text-align: center;
    }

    .h500-hero__scroll span {
      display: block;
      font-family: 'Share Tech Mono', monospace;
      font-size: 0.7rem;
      letter-spacing: 0.2em;
      color: rgba(255, 255, 255, 0.5);
      margin-bottom: 0.5rem;
    }

    .h500-hero__scroll-line {
      width: 1px;
      height: 50px;
      background: rgba(255, 255, 255, 0.2);
      margin: 0 auto;
      position: relative;
      overflow: hidden;
    }

    .h500-hero__scroll-dot {
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
    .h500-intro {
      padding: 8rem 2rem;
      background: #faf9f6;
    }

    .h500-intro__container {
      max-width: 1400px;
      margin: 0 auto;
      display: grid;
      grid-template-columns: 1.2fr 0.8fr;
      gap: 4rem;
      align-items: center;
    }

    .h500-intro__headline {
      font-family: 'Space Grotesk', sans-serif;
      font-size: clamp(2rem, 4vw, 3rem);
      font-weight: 500;
      line-height: 1.2;
      margin-bottom: 2rem;
    }

    .h500-intro__text {
      font-family: 'Space Grotesk', sans-serif;
      font-size: 1.1rem;
      line-height: 1.8;
      color: #4a4a4a;
      margin-bottom: 1.5rem;
    }

    .h500-intro__visual {
      position: relative;
    }

    .h500-intro__stat-card {
      background: #1a1a1a;
      padding: 3rem;
      display: flex;
      flex-direction: column;
      gap: 2rem;
    }

    .h500-intro__stat {
      text-align: center;
      padding: 1.5rem 0;
      border-bottom: 1px solid rgba(255,255,255,0.1);
    }

    .h500-intro__stat:last-child {
      border-bottom: none;
    }

    .h500-intro__stat-value {
      display: block;
      font-family: 'Space Grotesk', sans-serif;
      font-size: 3rem;
      font-weight: 500;
      color: #fff;
    }

    .h500-intro__stat-label {
      display: block;
      font-family: 'Share Tech Mono', monospace;
      font-size: 0.75rem;
      letter-spacing: 0.15em;
      text-transform: uppercase;
      color: rgba(255,255,255,0.6);
      margin-top: 0.5rem;
    }

    /* ====================================================================
       HISTORY TIMELINE SECTION
       ==================================================================== */
    .h500-history {
      padding: 8rem 2rem;
      background: #fff;
    }

    .h500-history__container {
      max-width: 1200px;
      margin: 0 auto;
    }

    .h500-history__timeline {
      margin-top: 4rem;
      position: relative;
    }

    .h500-history__timeline::before {
      content: '';
      position: absolute;
      top: 6px;
      left: calc(100px + 1rem + 30px);
      width: 2px;
      height: calc(100% - 2rem);
      background: #1a1a1a;
      z-index: 0;
    }

    .h500-history__item {
      display: grid;
      grid-template-columns: 100px 60px 1fr;
      gap: 1rem;
      margin-bottom: 2rem;
      position: relative;
    }

    .h500-history__year {
      font-family: 'Share Tech Mono', monospace;
      font-size: 1.25rem;
      font-weight: 600;
      color: #1a1a1a;
      text-align: right;
      padding-top: 0.25rem;
    }

    .h500-history__line {
      display: flex;
      flex-direction: column;
      align-items: center;
      position: relative;
      z-index: 1;
    }

    .h500-history__dot {
      width: 14px;
      height: 14px;
      background: #1a1a1a;
      border-radius: 50%;
      flex-shrink: 0;
      position: relative;
      z-index: 2;
    }

    .h500-history__content h4 {
      font-family: 'Space Grotesk', sans-serif;
      font-size: 1.25rem;
      font-weight: 500;
      color: #1a1a1a;
      margin: 0 0 0.5rem;
    }

    .h500-history__content p {
      font-family: 'Space Grotesk', sans-serif;
      font-size: 1rem;
      color: #666;
      line-height: 1.6;
      margin: 0;
    }

    /* ====================================================================
       SPECIFICATIONS SECTION
       ==================================================================== */
    .h500-specs {
      padding: 8rem 2rem;
      background: #faf9f6;
    }

    .h500-specs__container {
      max-width: 1400px;
      margin: 0 auto;
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 4rem;
    }

    .h500-specs__subtitle {
      font-family: 'Space Grotesk', sans-serif;
      font-size: 1rem;
      color: #666;
      margin-top: 0.5rem;
    }

    .h500-specs__grid {
      display: grid;
      grid-template-columns: repeat(2, 1fr);
      gap: 1rem;
      margin-top: 2rem;
    }

    .h500-specs__item {
      display: flex;
      align-items: center;
      gap: 1rem;
      padding: 1.25rem;
      background: #fff;
      border: 1px solid #eee;
      border-radius: 4px;
      transition: all 0.3s ease;
    }

    .h500-specs__item:hover,
    .h500-specs__item.active {
      border-color: #1a1a1a;
      box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
    }

    .h500-specs__icon {
      width: 40px;
      height: 40px;
      display: flex;
      align-items: center;
      justify-content: center;
      background: #f5f5f5;
      border-radius: 4px;
      color: #4a4a4a;
    }

    .h500-specs__data {
      display: flex;
      flex-direction: column;
    }

    .h500-specs__label {
      font-family: 'Share Tech Mono', monospace;
      font-size: 0.7rem;
      letter-spacing: 0.1em;
      text-transform: uppercase;
      color: #999;
    }

    .h500-specs__value {
      font-family: 'Space Grotesk', sans-serif;
      font-size: 1.1rem;
      font-weight: 500;
      color: #1a1a1a;
    }

    .h500-specs__right {
      position: relative;
    }

    .h500-specs__design {
      background: #1a1a1a;
      padding: 3rem;
      height: 100%;
    }

    .h500-specs__design h3 {
      font-family: 'Space Grotesk', sans-serif;
      font-size: 1.5rem;
      font-weight: 500;
      color: #fff;
      margin: 0 0 2rem;
    }

    .h500-specs__features {
      list-style: none;
      padding: 0;
      margin: 0;
    }

    .h500-specs__features li {
      display: flex;
      align-items: flex-start;
      gap: 1rem;
      padding: 1rem 0;
      border-bottom: 1px solid rgba(255,255,255,0.1);
      font-family: 'Space Grotesk', sans-serif;
      font-size: 1rem;
      color: rgba(255,255,255,0.9);
    }

    .h500-specs__features li:last-child {
      border-bottom: none;
    }

    .h500-specs__features i {
      color: rgba(255,255,255,0.5);
      margin-top: 0.25rem;
    }

    /* ====================================================================
       FLIGHT CHARACTERISTICS SECTION
       ==================================================================== */
    .h500-flight {
      padding: 8rem 2rem;
      background: #fff;
    }

    .h500-flight__container {
      max-width: 1200px;
      margin: 0 auto;
    }

    .h500-flight__grid {
      display: grid;
      grid-template-columns: repeat(4, 1fr);
      gap: 2rem;
      margin-top: 3rem;
    }

    .h500-flight__card {
      padding: 2rem;
      background: #faf9f6;
      border-radius: 4px;
      transition: all 0.3s ease;
    }

    .h500-flight__card:hover {
      background: #fff;
      box-shadow: 0 10px 40px rgba(0, 0, 0, 0.1);
    }

    .h500-flight__icon {
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

    .h500-flight__card h3 {
      font-family: 'Space Grotesk', sans-serif;
      font-size: 1.25rem;
      font-weight: 500;
      color: #1a1a1a;
      margin: 0 0 1rem;
    }

    .h500-flight__card p {
      font-family: 'Space Grotesk', sans-serif;
      font-size: 0.95rem;
      line-height: 1.7;
      color: #666;
      margin: 0;
    }

    .h500-flight__quote {
      max-width: 700px;
      margin: 4rem auto 0;
      text-align: center;
      padding: 3rem;
      border-left: 2px solid #ddd;
      border-right: 2px solid #ddd;
    }

    .h500-flight__quote blockquote {
      font-family: 'Space Grotesk', sans-serif;
      font-size: 1.25rem;
      font-style: italic;
      line-height: 1.8;
      color: #4a4a4a;
      margin: 0 0 1.5rem;
    }

    .h500-flight__quote cite {
      font-family: 'Share Tech Mono', monospace;
      font-size: 0.85rem;
      letter-spacing: 0.1em;
      color: #999;
    }

    /* ====================================================================
       NOTAR SECTION
       ==================================================================== */
    .h500-notar {
      position: relative;
      padding: 10rem 2rem;
      overflow: hidden;
    }

    .h500-notar__bg {
      position: absolute;
      inset: -10%;
      z-index: 0;
      background: linear-gradient(135deg, #0d0d0d 0%, #1a1a1a 50%, #0d0d0d 100%);
    }

    .h500-notar__bg-pattern {
      position: absolute;
      inset: 0;
      background:
        radial-gradient(circle at 20% 30%, rgba(255,255,255,0.03) 0%, transparent 40%),
        radial-gradient(circle at 80% 70%, rgba(255,255,255,0.02) 0%, transparent 40%);
    }

    .h500-notar__overlay {
      position: absolute;
      inset: 0;
      background: linear-gradient(
        to bottom,
        rgba(0, 0, 0, 0.3) 0%,
        rgba(0, 0, 0, 0.5) 100%
      );
      z-index: 1;
    }

    .h500-notar__container {
      position: relative;
      z-index: 2;
      max-width: 1200px;
      margin: 0 auto;
    }

    .h500-notar__subtitle {
      font-family: 'Space Grotesk', sans-serif;
      font-size: clamp(1.25rem, 3vw, 1.75rem);
      font-weight: 400;
      margin-top: 0.5rem;
    }

    .h500-notar__intro {
      max-width: 800px;
      margin: 0 auto 4rem;
      text-align: center;
    }

    .h500-notar__intro p {
      font-family: 'Space Grotesk', sans-serif;
      font-size: 1.15rem;
      line-height: 1.8;
      color: rgba(255,255,255,0.85);
    }

    .h500-notar__grid {
      display: grid;
      grid-template-columns: repeat(4, 1fr);
      gap: 2rem;
      margin-bottom: 4rem;
    }

    .h500-notar__card {
      padding: 2rem;
      background: rgba(255,255,255,0.05);
      border: 1px solid rgba(255,255,255,0.1);
      border-radius: 4px;
      text-align: center;
    }

    .h500-notar__icon {
      width: 60px;
      height: 60px;
      display: flex;
      align-items: center;
      justify-content: center;
      background: rgba(255,255,255,0.1);
      border-radius: 50%;
      margin: 0 auto 1.5rem;
      font-size: 1.5rem;
      color: #fff;
    }

    .h500-notar__card h4 {
      font-family: 'Space Grotesk', sans-serif;
      font-size: 1.1rem;
      font-weight: 500;
      color: #fff;
      margin: 0 0 0.75rem;
    }

    .h500-notar__card p {
      font-family: 'Space Grotesk', sans-serif;
      font-size: 0.9rem;
      line-height: 1.6;
      color: rgba(255,255,255,0.7);
      margin: 0;
    }

    .h500-notar__how-it-works {
      background: rgba(255,255,255,0.03);
      border: 1px solid rgba(255,255,255,0.1);
      padding: 3rem;
      border-radius: 4px;
    }

    .h500-notar__how-it-works h3 {
      font-family: 'Space Grotesk', sans-serif;
      font-size: 1.5rem;
      font-weight: 500;
      color: #fff;
      margin: 0 0 2rem;
      text-align: center;
    }

    .h500-notar__steps {
      display: grid;
      grid-template-columns: repeat(4, 1fr);
      gap: 2rem;
    }

    .h500-notar__step {
      text-align: center;
    }

    .h500-notar__step-num {
      font-family: 'Share Tech Mono', monospace;
      font-size: 2rem;
      color: rgba(255,255,255,0.3);
      margin-bottom: 1rem;
    }

    .h500-notar__step-content h4 {
      font-family: 'Space Grotesk', sans-serif;
      font-size: 1rem;
      font-weight: 500;
      color: #fff;
      margin: 0 0 0.5rem;
    }

    .h500-notar__step-content p {
      font-family: 'Space Grotesk', sans-serif;
      font-size: 0.85rem;
      line-height: 1.5;
      color: rgba(255,255,255,0.6);
      margin: 0;
    }

    /* ====================================================================
       VARIANTS SECTION
       ==================================================================== */
    .h500-variants {
      padding: 8rem 2rem;
      background: #faf9f6;
    }

    .h500-variants__container {
      max-width: 1200px;
      margin: 0 auto;
    }

    .h500-variants__tabs {
      display: flex;
      justify-content: center;
      gap: 0.5rem;
      margin: 3rem 0;
      flex-wrap: wrap;
    }

    .h500-variants__tab {
      padding: 0.75rem 1.5rem;
      font-family: 'Space Grotesk', sans-serif;
      font-size: 0.85rem;
      font-weight: 500;
      background: transparent;
      border: 1px solid #ddd;
      border-radius: 4px;
      cursor: pointer;
      transition: all 0.3s ease;
    }

    .h500-variants__tab:hover {
      border-color: #1a1a1a;
    }

    .h500-variants__tab.active {
      background: #1a1a1a;
      border-color: #1a1a1a;
      color: #fff;
    }

    .h500-variants__content {
      max-width: 800px;
      margin: 0 auto;
      text-align: center;
      padding: 3rem;
      background: #fff;
      border-radius: 4px;
    }

    .h500-variants__info h3 {
      font-family: 'Space Grotesk', sans-serif;
      font-size: 2rem;
      font-weight: 500;
      color: #1a1a1a;
      margin: 0 0 1rem;
    }

    .h500-variants__info p {
      font-family: 'Space Grotesk', sans-serif;
      font-size: 1.1rem;
      line-height: 1.7;
      color: #666;
      margin-bottom: 2rem;
    }

    .h500-variants__features {
      list-style: none;
      padding: 0;
      margin: 0;
      display: flex;
      flex-wrap: wrap;
      justify-content: center;
      gap: 1rem;
    }

    .h500-variants__features li {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      font-family: 'Space Grotesk', sans-serif;
      font-size: 0.9rem;
      color: #4a4a4a;
      padding: 0.5rem 1rem;
      background: #faf9f6;
      border-radius: 4px;
    }

    .h500-variants__features i {
      color: #1a1a1a;
    }

    /* ====================================================================
       LEGACY SECTION
       ==================================================================== */
    .h500-legacy {
      padding: 8rem 2rem;
      background: #fff;
    }

    .h500-legacy__container {
      max-width: 1200px;
      margin: 0 auto;
    }

    .h500-legacy__grid {
      display: grid;
      grid-template-columns: repeat(4, 1fr);
      gap: 2rem;
      margin: 4rem 0;
    }

    .h500-legacy__stat {
      text-align: center;
      padding: 2rem;
      background: #faf9f6;
      border-radius: 4px;
    }

    .h500-legacy__stat-value {
      display: block;
      font-family: 'Space Grotesk', sans-serif;
      font-size: 3rem;
      font-weight: 500;
      color: #1a1a1a;
    }

    .h500-legacy__stat-label {
      display: block;
      font-family: 'Share Tech Mono', monospace;
      font-size: 0.7rem;
      letter-spacing: 0.15em;
      text-transform: uppercase;
      color: #999;
      margin-top: 0.5rem;
    }

    .h500-legacy__uses {
      background: #1a1a1a;
      padding: 3rem;
      border-radius: 4px;
    }

    .h500-legacy__uses h3 {
      font-family: 'Space Grotesk', sans-serif;
      font-size: 1.5rem;
      font-weight: 500;
      color: #fff;
      margin: 0 0 2rem;
      text-align: center;
    }

    .h500-legacy__uses-grid {
      display: grid;
      grid-template-columns: repeat(6, 1fr);
      gap: 1.5rem;
    }

    .h500-legacy__use {
      text-align: center;
      padding: 1.5rem 1rem;
      background: rgba(255,255,255,0.05);
      border-radius: 4px;
    }

    .h500-legacy__use i {
      font-size: 1.5rem;
      color: rgba(255,255,255,0.6);
      margin-bottom: 0.75rem;
      display: block;
    }

    .h500-legacy__use span {
      font-family: 'Space Grotesk', sans-serif;
      font-size: 0.85rem;
      color: rgba(255,255,255,0.9);
    }

    /* ====================================================================
       GALLERY SECTION
       ==================================================================== */
    .h500-gallery {
      padding: 8rem 2rem;
      background: #faf9f6;
    }

    .h500-gallery__container {
      max-width: 1400px;
      margin: 0 auto;
    }

    .h500-gallery__grid {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: 1.5rem;
      margin-top: 3rem;
    }

    .h500-gallery__item {
      position: relative;
      aspect-ratio: 4/3;
      overflow: hidden;
      border-radius: 4px;
      cursor: pointer;
      background: #e5e5e5;
    }

    .h500-gallery__placeholder {
      position: absolute;
      inset: 0;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      gap: 1rem;
      color: #999;
    }

    .h500-gallery__placeholder i {
      font-size: 3rem;
    }

    .h500-gallery__placeholder span {
      font-family: 'Space Grotesk', sans-serif;
      font-size: 0.9rem;
    }

    .h500-gallery__overlay {
      position: absolute;
      inset: 0;
      background: rgba(0, 0, 0, 0.3);
      display: flex;
      align-items: center;
      justify-content: center;
      opacity: 0;
      transition: opacity 0.3s ease;
    }

    .h500-gallery__item:hover .h500-gallery__overlay {
      opacity: 1;
    }

    .h500-gallery__overlay i {
      color: #fff;
      font-size: 1.5rem;
    }

    .h500-gallery__lightbox {
      position: fixed;
      inset: 0;
      background: rgba(0, 0, 0, 0.95);
      z-index: 1000;
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 2rem;
    }

    .h500-gallery__lightbox-content {
      position: relative;
      max-width: 90vw;
      max-height: 90vh;
    }

    .h500-gallery__lightbox-placeholder {
      width: 600px;
      height: 400px;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      gap: 1rem;
      background: #333;
      color: #666;
      border-radius: 4px;
    }

    .h500-gallery__lightbox-placeholder i {
      font-size: 4rem;
    }

    .h500-gallery__lightbox-close {
      position: absolute;
      top: -3rem;
      right: 0;
      width: 40px;
      height: 40px;
      background: transparent;
      border: 1px solid rgba(255, 255, 255, 0.3);
      border-radius: 50%;
      color: #fff;
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      transition: all 0.3s ease;
    }

    .h500-gallery__lightbox-close:hover {
      background: #fff;
      color: #1a1a1a;
    }

    /* ====================================================================
       CTA SECTION
       ==================================================================== */
    .h500-cta {
      padding: 8rem 2rem;
      background: #fff;
      text-align: center;
    }

    .h500-cta__container {
      max-width: 1000px;
      margin: 0 auto;
    }

    .h500-cta h2 {
      font-family: 'Space Grotesk', sans-serif;
      font-size: clamp(2rem, 4vw, 3rem);
      font-weight: 500;
      line-height: 1.2;
      margin-bottom: 1.5rem;
    }

    .h500-cta p {
      font-family: 'Space Grotesk', sans-serif;
      font-size: 1.1rem;
      line-height: 1.7;
      color: #666;
      max-width: 700px;
      margin: 0 auto 3rem;
    }

    .h500-cta__services {
      display: grid;
      grid-template-columns: repeat(2, 1fr);
      gap: 2rem;
      margin-bottom: 3rem;
    }

    .h500-cta__service {
      padding: 3rem;
      background: #faf9f6;
      border-radius: 4px;
      text-align: left;
    }

    .h500-cta__service-icon {
      width: 60px;
      height: 60px;
      display: flex;
      align-items: center;
      justify-content: center;
      background: #1a1a1a;
      color: #fff;
      border-radius: 4px;
      font-size: 1.5rem;
      margin-bottom: 1.5rem;
    }

    .h500-cta__service h3 {
      font-family: 'Space Grotesk', sans-serif;
      font-size: 1.5rem;
      font-weight: 500;
      color: #1a1a1a;
      margin: 0 0 1rem;
    }

    .h500-cta__service p {
      font-family: 'Space Grotesk', sans-serif;
      font-size: 1rem;
      line-height: 1.7;
      color: #666;
      margin: 0 0 1.5rem;
      text-align: left;
    }

    .h500-cta__actions {
      display: flex;
      justify-content: center;
      gap: 1rem;
      flex-wrap: wrap;
      margin-bottom: 4rem;
    }

    .h500-cta__contact {
      display: flex;
      justify-content: center;
      gap: 3rem;
      padding-top: 3rem;
      border-top: 1px solid #eee;
    }

    .h500-cta__contact-item {
      display: flex;
      align-items: center;
      gap: 0.75rem;
      font-family: 'Space Grotesk', sans-serif;
      font-size: 0.95rem;
      color: #666;
    }

    .h500-cta__contact-item i {
      color: #1a1a1a;
    }

    /* ====================================================================
       RESPONSIVE STYLES
       ==================================================================== */
    @media (max-width: 1024px) {
      .h500-intro__container,
      .h500-specs__container {
        grid-template-columns: 1fr;
      }

      .h500-flight__grid,
      .h500-notar__grid,
      .h500-legacy__grid {
        grid-template-columns: repeat(2, 1fr);
      }

      .h500-notar__steps {
        grid-template-columns: repeat(2, 1fr);
      }

      .h500-gallery__grid {
        grid-template-columns: repeat(2, 1fr);
      }

      .h500-legacy__uses-grid {
        grid-template-columns: repeat(3, 1fr);
      }

      .h500-cta__services {
        grid-template-columns: 1fr;
      }
    }

    @media (max-width: 768px) {
      .h500-hero__headline {
        gap: 0.25rem;
      }

      .h500-hero__badges {
        flex-direction: column;
        gap: 1.5rem;
      }

      .h500-hero__badge-divider {
        width: 40px;
        height: 1px;
      }

      .h500-history__item {
        grid-template-columns: 80px 40px 1fr;
      }

      .h500-flight__grid,
      .h500-notar__grid,
      .h500-legacy__grid {
        grid-template-columns: 1fr;
      }

      .h500-notar__steps {
        grid-template-columns: 1fr;
      }

      .h500-specs__grid {
        grid-template-columns: 1fr;
      }

      .h500-variants__tabs {
        flex-direction: column;
        align-items: center;
      }

      .h500-gallery__grid {
        grid-template-columns: 1fr;
      }

      .h500-legacy__uses-grid {
        grid-template-columns: repeat(2, 1fr);
      }

      .h500-cta__actions {
        flex-direction: column;
        align-items: center;
      }

      .h500-cta__contact {
        flex-direction: column;
        gap: 1rem;
        align-items: center;
      }
    }

    @media (max-width: 480px) {
      .h500-hero__letter {
        font-size: 4rem;
      }

      .h500-hero__subtitle {
        font-size: 1.25rem;
        letter-spacing: 0.3em;
      }

      .h500-intro,
      .h500-history,
      .h500-specs,
      .h500-flight,
      .h500-variants,
      .h500-legacy,
      .h500-gallery,
      .h500-cta {
        padding: 5rem 1.5rem;
      }

      .h500-notar {
        padding: 6rem 1.5rem;
      }

      .h500-legacy__uses-grid {
        grid-template-columns: 1fr;
      }
    }
  `}</style>
);

// ============================================================================
// MAIN PAGE COMPONENT
// ============================================================================
function AircraftH500() {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="h500-page">
      <Seo
        title="Hughes/Schweizer 300 (H500) — Reference"
        description="The Hughes/Schweizer 300 (H500) — a piston-engine helicopter with a long history. Reference page; HQ Aviation does not sell new H500 aircraft."
        jsonLd={[
          buildBreadcrumbList([
            { name: 'Home', path: '/' },
            { name: 'Aircraft', path: '/sales/new' },
            { name: 'H500', path: '/aircraft/h500' },
          ]),
        ]}
      />
      <H500Styles />
      <H500Header />
      <main>
        <H500Hero />
        <H500Introduction />
        <H500History />
        <H500Specifications />
        <H500FlightCharacteristics />
        <H500Notar />
        <H500Variants />
        <H500Legacy />
        <H500Gallery />
        <H500CTA />
      </main>
      <FooterMinimal />
    </div>
  );
}

export default AircraftH500;

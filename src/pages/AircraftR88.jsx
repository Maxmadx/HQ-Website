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
import { createPortal } from 'react-dom';
import { Link } from 'react-router-dom';
import { motion, useInView, useScroll, useTransform, AnimatePresence } from 'framer-motion';
import { usePageImages } from '../hooks/usePageImages';
import { useAircraftSpecRows } from '../hooks/useAircraftSpecs';
import { useCmsHighlight } from '../hooks/useCmsHighlight';
import { SECTION_MAP } from '../lib/imageSections';
import Seo from '../components/seo/Seo';
import { buildProduct, buildBreadcrumbList } from '../components/seo/jsonLd';

// Import styles
import '../assets/css/main.css';
import '../assets/css/components.css';

// Import Footer
import FooterMinimal from '../components/FooterMinimal';
import HqMenuPanel from '../components/HqMenuPanel';

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
                width={405}
                height={245}
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
              width={2500}
              height={1406}
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
  const sectionRef = useRef(null);

  useEffect(() => {
    // Sticky-at-end pattern (mirrors /aircraft/r66): intro scrolls normally
    // so its internal sticky text column works, then pins only when its
    // bottom reaches the viewport bottom so the gallery can rise up over it.
    // --r88-intro-stick-top = min(0, vh - introH).
    const update = () => {
      const el = sectionRef.current;
      if (!el) return;
      const vh = window.innerHeight;
      const introH = el.offsetHeight;
      const stickTop = Math.min(0, vh - introH);
      document.documentElement.style.setProperty('--r88-intro-stick-top', `${stickTop}px`);
    };
    update();

    // Progressively blur + darken intro as the gallery rises over it.
    const MAX_BLUR = 10;
    const nextSection = document.querySelector('.r88-gallery');

    const onScroll = () => {
      const el = sectionRef.current;
      if (!el || !nextSection) return;
      const rect = nextSection.getBoundingClientRect();
      const vh = window.innerHeight;
      // Gallery pins at top: catchTop, so its rect.top bottoms out there.
      // Ramp progress 0→1 as rect.top goes from vh down to catchTop, so the
      // intro reaches full dark right when the gallery takes over the screen.
      const catchTopVar = parseFloat(
        getComputedStyle(document.documentElement).getPropertyValue('--catch-top')
      );
      const catchTop = Number.isFinite(catchTopVar) ? catchTopVar : 90;
      const span = Math.max(1, vh - catchTop);
      const progress = Math.min(1, Math.max(0, 1 - (rect.top - catchTop) / span));
      el.style.setProperty('--r88-intro-blur', `${progress * MAX_BLUR}px`);
      // Ease-in darken: stays light most of the way, then ramps up fast so
      // the intro hits solid dark before the gallery fully covers it.
      const DARK_COMPLETE = 0.95;
      const adjusted = Math.min(1, progress / DARK_COMPLETE);
      const darken = Math.pow(adjusted, 8);
      el.style.setProperty('--r88-intro-darken', `${darken}`);
    };
    onScroll();

    window.addEventListener('resize', update);
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);
    const ro = new ResizeObserver(update);
    if (sectionRef.current) ro.observe(sectionRef.current);
    return () => {
      window.removeEventListener('resize', update);
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
      ro.disconnect();
    };
  }, []);

  return (
    <section ref={sectionRef} className="r88-intro">
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
      </div>
    </section>
  );
}

// ============================================================================
// SECTION 3: Technical Specifications
// ============================================================================
function R88Specifications() {
  const adminRows = useAircraftSpecRows('r88');
  const baseSpecs = adminRows.length ? adminRows : r88Specs;
  // Duplicate the card set so the marquee animation loops seamlessly —
  // the keyframes translate by -50%, landing exactly on the start of the
  // second copy, which visually continues the first.
  const loopedSpecs = [...baseSpecs, ...baseSpecs];

  return (
    <section className="r88-specs">
      <div className="r88-specs__scroller">
        <div className="r88-specs__grid">
          {loopedSpecs.map((spec, i) => (
            <div
              key={i}
              className="r88-specs__item"
              aria-hidden={i >= baseSpecs.length ? 'true' : undefined}
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
  const sceneRef = useRef(null);

  // JS-driven pin: emulates position:sticky for the engine without
  // relying on CSS sticky (which was failing to engage — likely a
  // containment issue in the page's ancestor chain).
  //
  // The engine stays in normal flow (so its layout space is preserved).
  // During the pin phase we apply a translateY offset equal to the
  // scroll delta, which visually holds the engine in place while the
  // underlying document continues to scroll. Register's negative
  // margin + z-index handles rising over it.
  //
  // Pin trigger: scrollY = engineDocBottom - vh + 48 (engine's bottom
  //   has just passed the "touches viewport bottom" point by 48px).
  // Pin release: pinStart + 100vh (matches the scene's padding-bottom).
  useEffect(() => {
    const scene = sceneRef.current;
    if (!scene) return;
    const engine = scene.querySelector('.r88-engine');
    if (!engine) return;
    const onScroll = () => {
      const rect = scene.getBoundingClientRect();
      const vh = window.innerHeight;
      const scrollY = window.scrollY;
      const engineRect = engine.getBoundingClientRect();
      // Recover engine's natural (untransformed) doc position. Since we
      // set transform ourselves, engineRect.top reflects the transformed
      // position; subtract the current translateY to get natural top.
      const currentTY = parseFloat(engine.dataset.ty || '0');
      const engineDocTop = engineRect.top + scrollY - currentTY;
      const engineHeight = engine.offsetHeight;
      const engineDocBottom = engineDocTop + engineHeight;
      const pinStart = engineDocBottom - vh + 48;
      const pinRange = vh;
      const pinEnd = pinStart + pinRange;

      let ty;
      if (scrollY < pinStart) ty = 0;
      else if (scrollY > pinEnd) ty = pinRange;
      else ty = scrollY - pinStart;

      engine.style.transform = ty === 0 ? '' : `translateY(${ty}px)`;
      engine.dataset.ty = ty.toString();

      const fade = Math.min(1, Math.max(0, (2 * vh - rect.bottom) / vh));
      scene.style.setProperty('--engine-fade', fade.toString());
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);
    return () => {
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
    };
  }, []);

  return (
    <div ref={sceneRef} className="r88-engine-scene">
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
                width={3840}
                height={834}
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
                  reliability and affordability heritage to their most ambitious airframe yet,
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
                    engine support standard with every aircraft, a first-of-its-kind offering
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
      <div className="r88-engine__overlay" aria-hidden="true" />
    </section>
    </div>
  );
}

// ============================================================================
// SECTION 5: Avionics - Garmin Glass Cockpit
// ============================================================================
// Sticky hero runs a two-phase internal scroll:
//   Phase A — cockpit image fades in on the right as you scroll into the scene.
//   Phase B — image dissolves top-to-bottom while the 4 feature cards rise
//             and fade in on top of it, ending fully visible.
// The scene wrapper (.r88-avionics-scene) provides the extra scroll range;
// the .r88-avionics element stays pinned at 100vh throughout.
function R88Avionics() {
  const sceneRef = useRef(null);

  useEffect(() => {
    const scene = sceneRef.current;
    if (!scene) return;
    const onScroll = () => {
      const rect = scene.getBoundingClientRect();
      const vh = window.innerHeight;
      // Phases tied to how far the scene top has scrolled past the viewport top.
      const phaseA = vh * 0.8;  // dwell (first image fully visible)
      const phaseB = vh * 0.8;  // first image dissolves top→bottom, cards pop
      const phaseC = vh * 0.8;  // second image loads in top→bottom, covers cards
      const scrolled = Math.max(0, -rect.top);
      const revealProg = Math.min(1, scrolled / phaseA);
      const afterReveal = Math.max(0, scrolled - phaseA);
      const transitionProg = Math.min(1, afterReveal / phaseB);
      const afterTransition = Math.max(0, scrolled - phaseA - phaseB);
      const secondReveal = Math.min(1, afterTransition / phaseC);
      scene.style.setProperty('--av-image-reveal', revealProg.toString());
      scene.style.setProperty('--av-transition', transitionProg.toString());
      scene.style.setProperty('--av-second-reveal', secondReveal.toString());
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);
    return () => {
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
    };
  }, []);

  return (
    <div ref={sceneRef} className="r88-avionics-scene">
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
                  pilot controls and a fully integrated avionics architecture: engine
                  monitoring, autopilot interfaces and communication systems all routed
                  through a single modern cockpit designed for commercial and multi-pilot
                  operations from day one.
                </p>
              </Reveal>
            </div>

            <div className="r88-avionics__features-col">
              <div className="r88-avionics__cockpit" aria-hidden="true">
                <img
                  src="/assets/images/new-aircraft/r88/rhc-r88-wide-view-instrument-panel-13175.jpg"
                  alt=""
                  loading="lazy"
                  width={2500}
                  height={1666}
                />
              </div>
              {/* Second cockpit image — sits in the same absolute slot as
                  the first (inset:0 of .r88-avionics__features-col) so
                  their dimensions always match. z-index:200 puts it above
                  the popped cards. Mask loads it in top→bottom during
                  phase C. */}
              <div className="r88-avionics__cockpit-2" aria-hidden="true">
                <img
                  src="/assets/images/new-aircraft/r88/rhc-r88-glass-flight-displays-right-side-cyclic-13216.jpg"
                  alt=""
                  loading="lazy"
                  width={2500}
                  height={1667}
                />
              </div>
              <div className="r88-avionics__features">
                {avionicsFeatures.map((feature, i) => (
                  <motion.div
                    key={i}
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
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
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
  const [splitProgress, setSplitProgress] = useState(0);
  const sceneRef = useRef(null);
  // Headline revealed letter-by-letter as the split progresses. Each letter
  // has its own threshold along the [letterReveal.start, letterReveal.end]
  // range of split progress, producing a staggered type-on reveal.
  const headline = "The Most Capable Aircraft in It's class";
  const letters = Array.from(headline);
  const letterReveal = { start: 0.22, end: 0.88 };
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

  // Split the 4-col grid into two 2-col panes by column position so the
  // panes can slide apart horizontally. Left pane = cols 0-1, right = cols 2-3.
  // Original indices are preserved for Reveal staggering + lightbox mapping.
  const withIdx = editorialItems.map((item, i) => ({ item, i }));
  const leftTiles = withIdx.filter(({ i }) => i % 4 < 2);
  const rightTiles = withIdx.filter(({ i }) => i % 4 >= 2);

  const renderTile = (item, i) => {
    if (item.kind === 'img') {
      return (
        <Reveal key={`img-${i}`} delay={i * 0.03}>
          <motion.div
            className="r88-gallery__item"
            whileHover={{ scale: 1.02 }}
            transition={{ duration: 0.3 }}
            onClick={() => setLightboxIdx(item.origIdx)}
          >
            <img src={item.src} alt={item.alt} loading="lazy" width={1500} height={1000} />
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
  };

  // Scroll-driven split progress: as the user scrolls through the scene
  // while the pin is locked, the two panes translate apart horizontally.
  useEffect(() => {
    const scene = sceneRef.current;
    if (!scene) return;
    const onScroll = () => {
      const rect = scene.getBoundingClientRect();
      const vh = window.innerHeight;
      const catchTopVar = parseFloat(
        getComputedStyle(document.documentElement).getPropertyValue('--catch-top')
      );
      const catchTop = Number.isFinite(catchTopVar) ? catchTopVar : 90;
      const pinH = vh - catchTop;
      const splitScroll = Math.max(1, scene.offsetHeight - pinH);
      // rect.top = catchTop at pin start, decreases to (catchTop - splitScroll)
      // when the pin is about to release.
      const scrolled = catchTop - rect.top;
      const progress = Math.min(1, Math.max(0, scrolled / splitScroll));
      // Phase split: first half of progress drives the pane split + letter
      // reveal; second half drives the video expand/fade that uncovers the
      // reconfigurable scene layered behind.
      const splitProg = Math.min(1, progress * 2);
      const expandProg = Math.max(0, Math.min(1, (progress - 0.5) * 2));
      scene.style.setProperty('--split-progress', splitProg.toString());
      scene.style.setProperty('--expand-progress', expandProg.toString());
      setSplitProgress(splitProg);
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);
    return () => {
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
    };
  }, []);

  return (
    <>
    <section ref={sceneRef} className="r88-gallery-scene">
      <div className="r88-gallery-pin">
        <section className="r88-gallery" data-cms-section="r88-gallery">
          <div className="r88-gallery__container">
            {/* Reveal: centered video + letter-by-letter headline that
                the split-apart panes uncover as the user scrolls. */}
            <div className="r88-gallery__reveal" aria-hidden="true">
              <h3 className="r88-gallery__reveal-headline">
                {letters.map((ch, i) => {
                  const threshold =
                    letterReveal.start +
                    (i / Math.max(1, letters.length - 1)) *
                      (letterReveal.end - letterReveal.start);
                  const visible = splitProgress >= threshold;
                  return (
                    <span
                      key={i}
                      className={`r88-gallery__reveal-letter${
                        visible ? ' r88-gallery__reveal-letter--visible' : ''
                      }`}
                    >
                      {ch === ' ' ? '\u00A0' : ch}
                    </span>
                  );
                })}
              </h3>
              <video
                className="r88-gallery__reveal-video"
                src="/assets/images/new-aircraft/r88/capability.mp4"
                autoPlay
                muted
                loop
                playsInline
                preload="auto"
              />
            </div>
            <div className="r88-gallery__grid">
              <div className="r88-gallery__pane r88-gallery__pane--left">
                {leftTiles.map(({ item, i }) => renderTile(item, i))}
              </div>
              <div className="r88-gallery__pane r88-gallery__pane--right">
                {rightTiles.map(({ item, i }) => renderTile(item, i))}
              </div>
            </div>
          </div>
        </section>
      </div>
    </section>

      {/* Lightbox — rendered at page level so its z-index is not capped by
          the scene's stacking context (scene has z-index:3). */}
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
    </>
  );
}

// ============================================================================
// SECTION 5C: Easily Reconfigurable - Cabin flexibility
// ============================================================================
function R88Reconfigurable() {
  const sceneRef = useRef(null);

  // Scroll-driven animation: the scene pins while the GIF animates from a
  // tall, left-overlaid state to its compact resting place on the right.
  useEffect(() => {
    const scene = sceneRef.current;
    if (!scene) return;
    const onScroll = () => {
      const rect = scene.getBoundingClientRect();
      const vh = window.innerHeight;
      const catchTopVar = parseFloat(
        getComputedStyle(document.documentElement).getPropertyValue('--catch-top')
      );
      const catchTop = Number.isFinite(catchTopVar) ? catchTopVar : 90;
      const pinH = vh - catchTop;
      // Three phases driven by scroll into the scene:
      //  1. slide (100vh): image slides in from offscreen-right and
      //                    comes to rest covering the right half.
      //  2. hold  (80vh):  image sits still. Avionics features behind
      //                    the image fade out; left text cross-fades
      //                    from avionics → reconfigurable.
      //  3. anim  (80vh):  image shrinks in place (anchored to the
      //                    right) from --start-w → --end-w.
      const slide = vh;
      const hold = vh * 0.8;
      const anim = vh * 0.8;
      const scrolled = Math.max(0, catchTop - rect.top);
      const slideProg = Math.min(1, scrolled / slide);
      const afterSlide = Math.max(0, scrolled - slide);
      const holdProg = Math.min(1, afterSlide / hold);
      // Shrink spans from 70% through the slide (starts while the image
      // is still travelling left toward its rest position) all the way
      // to the end of the scene — which is the exact point the sticky
      // pin releases and the page resumes normal scrolling. So the
      // shrink overlaps the end of the slide and finishes as the
      // section unpins.
      const shrinkStart = slide * 0.7;
      const shrinkEnd = slide + hold + anim;
      const reconfigProg = Math.min(
        1,
        Math.max(0, (scrolled - shrinkStart) / (shrinkEnd - shrinkStart))
      );
      // Text swap (left column) and features fade (right column) run
      // DURING the slide so the transition from avionics → reconfigurable
      // is already underway as the image is coming into view from the
      // right. Both finish exactly as the slide ends. Hold phase then
      // becomes a dwell (everything already in its end state) before
      // the image starts shrinking in the anim phase.
      const textSwap = slideProg;
      const featuresShrink = slideProg;

      scene.style.setProperty('--slide-progress', slideProg.toString());
      scene.style.setProperty('--reconfig-progress', reconfigProg.toString());
      scene.style.setProperty('--text-swap', textSwap.toString());
      scene.style.setProperty('--features-shrink', featuresShrink.toString());
      // Also expose slide + text-swap on the root so the avionics section
      // (rendered earlier in the tree) can read them without prop drilling.
      document.documentElement.style.setProperty('--av-rec-slide', slideProg.toString());
      document.documentElement.style.setProperty('--av-rec-text-swap', textSwap.toString());
      document.documentElement.style.setProperty(
        '--av-rec-features-shrink',
        featuresShrink.toString()
      );
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);
    return () => {
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
    };
  }, []);

  return (
    <section ref={sceneRef} className="r88-reconfigurable-scene">
      <div className="r88-reconfigurable-pin">
        <section className="r88-reconfigurable" data-cms-section="r88-reconfigurable">
          <div className="r88-reconfigurable__container">
            <div className="r88-reconfigurable__content">
              <Reveal>
                <div className="r88-section-header">
                  <span className="r88-pre-text">CABIN FLEXIBILITY</span>
                  <h2>
                    <span className="r88-text--dark">Easily</span>{' '}
                    <span className="r88-text--mid">Reconfigurable</span>
                  </h2>
                </div>
              </Reveal>

              <Reveal delay={0.1}>
                <p className="r88-reconfigurable__lead">
                  Switch the R88 from a full eight-passenger commuter to a cargo hauler,
                  medevac platform, or executive shuttle without tools or a trip to the
                  hangar. Every seat row slides on rails, latches into floor tracks, and
                  removes in seconds, letting a single operator reshape the cabin to
                  match the mission.
                </p>
              </Reveal>

              <div className="r88-reconfigurable__features">
                {[
                  { icon: 'fa-chair', title: 'Executive Shuttle', copy: 'Rearrange seating for club-four layouts and VIP transport.' },
                  { icon: 'fa-users', title: 'Eight-Seat Commuter', copy: 'Full dual-row configuration for charter and transport operations.' },
                  { icon: 'fa-briefcase-medical', title: 'Medevac Ready', copy: 'Accommodates stretcher and attendant seating for EMS missions.' },
                  { icon: 'fa-box-open', title: 'Cargo Mode', copy: 'Remove rear rows in under a minute to open a flat cargo floor.' },
                ].map((f, i) => (
                  <Reveal key={i} delay={0.15 + i * 0.08}>
                    <div className="r88-reconfigurable__feature">
                      <div className="r88-reconfigurable__feature-icon">
                        <i className={`fas ${f.icon}`}></i>
                      </div>
                      <div className="r88-reconfigurable__feature-body">
                        <h4>{f.title}</h4>
                        <p>{f.copy}</p>
                      </div>
                    </div>
                  </Reveal>
                ))}
              </div>
            </div>

            <div className="r88-reconfigurable__visual">
              <img
                src="/assets/images/new-aircraft/r88/reconfigurable-mobile.gif"
                alt="R88 cabin reconfiguring between seating layouts"
                loading="lazy"
                width={360}
                height={844}
              />
              <div className="r88-reconfigurable__visual-badge">
                <span className="r88-reconfigurable__visual-badge-label">TOOL-FREE</span>
                <span className="r88-reconfigurable__visual-badge-text">Seat Rails &amp; Floor Tracks</span>
              </div>
            </div>
          </div>
        </section>
      </div>
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

      {/* Portal to document.body so position:fixed is truly viewport-fixed,
          not trapped by any transformed ancestor on the page. Ensures the
          lightbox centers on the user's current viewport regardless of
          scroll position when the poster is clicked. */}
      {typeof document !== 'undefined' && createPortal(
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
                  title={`${title} development footage`}
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
        </AnimatePresence>,
        document.body
      )}
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
    lead: "150+ operators have already registered. The R88's lower operating cost per seat means that if your competitors adopt it before you, they can undercut your rates, win more contracts, and scale faster, while you're still flying older, more expensive iron.",
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
    lead: "Ten seats, turbine power, 350+ nm range. The R88 does what no Robinson has ever done, and at a fraction of what comparable turbine aircraft cost to own and operate. Reserve your position before deliveries fill.",
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
          subject: `R88 Register: ${useType === 'commercial' ? 'Commercial' : 'Private'} Use`,
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
                Something went wrong. Please try again or email{' '}
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
      /* Sticky-at-end pattern (mirrors /aircraft/r66): intro scrolls normally
         so its internal sticky text column works, then pins only when its
         bottom reaches the viewport bottom so the gallery can rise up over it.
         --r88-intro-stick-top is set in JS to min(0, viewportH - introH). */
      position: sticky;
      top: var(--r88-intro-stick-top, 0);
      z-index: 1;
      padding: 4rem 2rem 0;
      /* Split background mirrors R66/highlights: left half lighter, right
         half warm cream — creates a subtle vertical seam behind the content. */
      background: linear-gradient(to right, #ececec 50%, #faf9f6 50%);
      /* Scroll-linked blur; darken is applied via ::after overlay so it
         actually lands on a solid dark frame at progress=1. */
      filter: blur(var(--r88-intro-blur, 0px));
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

    /* Dark overlay that fades in as the gallery rises, so intro visually
       turns into the dark gallery palette before the gallery physically
       covers it. */
    .r88-intro::after {
      content: '';
      position: absolute;
      inset: 0;
      background: linear-gradient(to right, #0a0a0a 50%, #000 50%);
      opacity: var(--r88-intro-darken, 0);
      pointer-events: none;
      z-index: 2;
    }

    .r88-intro__container {
      position: relative;
      z-index: 1;
      max-width: 1200px;
      margin: 0 auto;
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 0 4rem;
      align-items: start;
    }

    /* Swap left/right: visual column renders on the left, text on the right.
       Text column becomes sticky while the visual column (card + timeline)
       scrolls past it. Mirrors the R66 order-swap pattern. */
    .r88-intro__content { order: 2; padding-left: 3rem; }
    .r88-intro__visual-col { order: 1; padding-right: 3rem; }

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
    /* Scene wrapper: gives the engine 100vh of trailing scroll room so
       position: sticky on .r88-engine has somewhere to be pinned after
       the user has scrolled past the engine's content. Using an explicit
       min-height of (content-auto + 100vh) by way of padding-bottom; also
       setting display:block explicitly to avoid any flex/grid inheritance
       that could break sticky containment. */
    .r88-engine-scene {
      position: relative;
      display: block;
      padding-bottom: 100vh;
      overflow: visible;
    }

    .r88-engine {
      padding: 4rem 2rem;
      background: #fff;
      /* Pinning is handled via JS — see R88Engine scroll handler.
         The scroll handler applies translateY to visually hold the
         engine in place during the rise phase. position:relative +
         z-index so register (z-index:3) still paints on top. */
      position: relative;
      z-index: 1;
      will-change: transform;
    }

    /* Blur + darken overlay that fades in as --engine-fade → 1.
       Backdrop-filter blurs the engine content behind it; the tinted
       background darkens. Sits above the engine content but below any
       sibling (register) that has higher z-index. */
    .r88-engine__overlay {
      position: absolute;
      inset: 0;
      pointer-events: none;
      background: rgba(0, 0, 0, calc(var(--engine-fade, 0) * 0.55));
      backdrop-filter: blur(calc(var(--engine-fade, 0) * 14px));
      -webkit-backdrop-filter: blur(calc(var(--engine-fade, 0) * 14px));
      opacity: var(--engine-fade, 0);
      z-index: 5;
      will-change: opacity, backdrop-filter;
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
       AVIONICS → RECONFIGURABLE TRANSITION SCENE
       - wrapper containing the pinned avionics + the reconfigurable scene
       - constrains avionics' position:sticky so it unpins when the
         transition ends (rather than staying sticky to <main>) */
    .r88-av-rec-scene {
      position: relative;
      /* Pulled up one viewport so the avionics section (z-index:1) sits
         directly behind the last 100vh of the gallery scene (z-index:3).
         As the gallery's dark bg fades out during the video-expand phase,
         avionics is revealed in place — no blank scroll gap between the
         disappearing video and the next section. */
      margin-top: -100vh;
    }

    /* ====================================================================
       RECONFIGURABLE SECTION — scroll-pinned scene
       Three scroll phases (driven in JS):
       1. slide  — .r88-reconfigurable-pin translates from X=-100% to 0,
                   sliding in over the pinned avionics from the left
       2. hold   — image dwells at its full-left start position
       3. anim   — image travels left → small-right while avionics features
                   shrink/fade and get covered
       ==================================================================== */
    .r88-reconfigurable-scene {
      position: relative;
      /* z-index 2 so the reconfigurable-pin paints over the pinned avionics
         section during the slide-in. */
      z-index: 2;
      background: transparent;
      /* Total scene = pin height + 100vh slide + 80vh hold + 80vh anim. */
      min-height: calc((100vh - var(--catch-top, 90px)) + 100vh + 80vh + 80vh);
      /* Pull the scene up so it starts exactly at the end of phase C
         (second cockpit image fully revealed). The avionics-scene is
         440vh tall: phase B ends at 160vh, phase C at 240vh. Natural
         start of reconfigurable-scene (end of avionics-scene) is at
         440vh, so pull back 200vh to land at 240vh. Avionics stays
         pinned until 340vh (= end of reconfig slide), so the slide
         still paints over pinned avionics. */
      margin-top: -200vh;
    }

    .r88-reconfigurable-pin {
      position: sticky;
      top: var(--catch-top, 90px);
      height: calc(100vh - var(--catch-top, 90px));
      /* Pin itself is transparent — only the image slides; the pin's
         text content fades in during the text-swap. overflow:visible so
         the image can sit offscreen-left before sliding in. */
      overflow: visible;
    }

    /* Cream background cover — fades in SIMULTANEOUSLY with the avionics
       fade-out (both driven by text-swap 0→0.5), so the cream replaces
       the dark avionics bg with no mid-transition dead zone. Fully opaque
       by text-swap=0.5; reconfigurable content then fades in on top
       during text-swap 0.5→1. Sits at z-index 0 within the pin so the
       image (z:3) and text (z:1) both paint on top.
       Top is pulled up by --catch-top so the cream extends above the pin
       to cover the strip between the sticky header and the pin's top —
       otherwise the pinned avionics bg would show through that gap. */
    .r88-reconfigurable-pin::before {
      content: "";
      position: absolute;
      top: calc(-1 * var(--catch-top, 90px));
      left: 0;
      right: 0;
      bottom: 0;
      background: #f5f1ea;
      z-index: 0;
      opacity: calc(min(1, var(--text-swap, 0) * 2));
      pointer-events: none;
    }

    .r88-reconfigurable {
      height: 100%;
      padding: 3rem 2rem;
      box-sizing: border-box;
      display: flex;
      align-items: center;
    }

    .r88-reconfigurable__container {
      /* Hoisted animation vars — both the visual and the cream cover
         reference these so they stay in sync. */
      --p: var(--reconfig-progress, 0);
      --inv: calc(1 - var(--p));
      /* Start width must stay clear of the left content column so the
         image never overlaps the feature cards or text. Content column
         uses max-width: 54%, so the image occupies the remaining 46%
         minus the right inset and a 2rem gutter. Anchored at
         right:--end-right-inset, left edge = 54% + 2rem. */
      --start-w: calc(46% - var(--end-right-inset) - 2rem);
      --start-h: calc(100vh - var(--catch-top, 90px) - 4rem);
      /* End size = 80% of start (a subtle 20% shrink, uniform on both
         axes so the aspect ratio is preserved). */
      --end-w: calc(var(--start-w) * 0.8);
      --end-h: calc(var(--start-h) * 0.8);
      --w-now: calc(var(--end-w) + (var(--start-w) - var(--end-w)) * var(--inv));
      --h-now: calc(var(--end-h) + (var(--start-h) - var(--end-h)) * var(--inv));
      --end-right-inset: 6rem;
      --visual-left: calc((100% - var(--w-now) - var(--end-right-inset)) * var(--p));
      --visual-right: calc(var(--visual-left) + var(--w-now));

      max-width: 1400px;
      margin: 0 auto;
      width: 100%;
      height: 100%;
      position: relative;
      display: flex;
      align-items: center;
    }

    /* Cream cover removed for the new avionics→reconfigurable transition:
       the right half of the pin is intentionally transparent so the
       avionics features beneath stay visible until the image traverses
       over them. Left-half coverage is handled by .r88-reconfigurable-pin::before. */

    .r88-reconfigurable__content {
      display: flex;
      flex-direction: column;
      gap: 1.25rem;
      max-width: 54%;
      position: relative;
      z-index: 1;
      /* Fades in during the SECOND half of the hold phase (text-swap
         0.5→1 maps to opacity 0→1), after the avionics text has fully
         faded out — avoids both being visible at reduced opacity. */
      opacity: calc(max(0, var(--text-swap, 0) * 2 - 1));
    }

    .r88-reconfigurable__lead {
      font-family: 'Space Grotesk', sans-serif;
      font-size: 1.05rem;
      line-height: 1.7;
      color: #444;
      max-width: 52ch;
    }

    .r88-reconfigurable__features {
      display: grid;
      grid-template-columns: 1fr 1fr;
      /* Every row is forced to the height of the tallest row, so all
         four cards end up the same height regardless of which one has
         the longest copy — avoids the uneven/messy look when one card
         is noticeably taller than the others. */
      grid-auto-rows: 1fr;
      gap: 1rem;
      margin-top: 0.75rem;
    }

    .r88-reconfigurable__feature {
      display: flex;
      gap: 0.85rem;
      padding: 1rem;
      background: #fff;
      border: 1px solid rgba(0, 0, 0, 0.06);
      border-radius: 8px;
      /* Fill the grid cell completely so siblings in the same row
         line up with each other and with cards in the other row. */
      height: 100%;
      box-sizing: border-box;
      transition: transform 0.2s ease, box-shadow 0.2s ease;
    }

    .r88-reconfigurable__feature:hover {
      transform: translateY(-2px);
      box-shadow: 0 8px 24px rgba(0, 0, 0, 0.06);
    }

    .r88-reconfigurable__feature-icon {
      flex: 0 0 auto;
      width: 36px;
      height: 36px;
      display: flex;
      align-items: center;
      justify-content: center;
      background: #1a1a1a;
      color: #fff;
      border-radius: 6px;
      font-size: 1rem;
    }

    .r88-reconfigurable__feature-body h4 {
      font-family: 'Space Grotesk', sans-serif;
      font-size: 0.95rem;
      font-weight: 600;
      margin: 0 0 0.25rem;
      color: #1a1a1a;
      letter-spacing: -0.01em;
    }

    .r88-reconfigurable__feature-body p {
      font-family: 'Space Grotesk', sans-serif;
      font-size: 0.85rem;
      line-height: 1.5;
      color: #555;
      margin: 0;
    }

    /* Visual — scroll-driven size + position.
       Uses animation vars hoisted onto .r88-reconfigurable__container. */
    .r88-reconfigurable__visual {
      position: absolute;
      z-index: 3;
      top: 50%;
      /* Horizontal anchor: at the post-slide resting position, right edge
         sits at --end-right-inset (width = --start-w). As the image
         shrinks during the anim phase, we offset the right value by
         half the width-change so the image CENTER X stays fixed — both
         the left AND right edges contract inward equally, mirroring the
         vertical shrink (top/bottom already contract toward 50% via
         translateY(-50%)). Net effect: all four corners pull toward
         the image own centre. */
      right: calc(var(--end-right-inset) + (var(--start-w) - var(--w-now)) / 2);
      left: auto;
      width: var(--w-now);
      height: var(--h-now);
      /* Slide-in from the right: at slide=0 the image is offscreen
         right (+100vw); at slide=1 it rests at right:--end-right-inset. */
      transform: translateY(-50%)
        translateX(calc((1 - var(--slide-progress, 1)) * 100vw));
      background: transparent;
      will-change: transform, width, height;
    }

    .r88-reconfigurable__visual img {
      display: block;
      width: 100%;
      height: 100%;
      object-fit: cover;
      object-position: center;
      border-radius: 12px;
      box-shadow: 0 20px 60px rgba(0, 0, 0, 0.18);
      position: relative;
      z-index: 1;
    }

    .r88-reconfigurable__visual-badge {
      position: absolute;
      bottom: 1rem;
      left: 1rem;
      background: rgba(26, 26, 26, 0.92);
      color: #fff;
      padding: 0.6rem 0.9rem;
      border-radius: 6px;
      backdrop-filter: blur(6px);
      display: flex;
      flex-direction: column;
      gap: 0.1rem;
    }

    .r88-reconfigurable__visual-badge-label {
      font-family: 'Space Grotesk', sans-serif;
      font-size: 0.7rem;
      letter-spacing: 0.12em;
      text-transform: uppercase;
      color: rgba(255, 255, 255, 0.65);
    }

    .r88-reconfigurable__visual-badge-text {
      font-family: 'Space Grotesk', sans-serif;
      font-size: 0.85rem;
      font-weight: 500;
    }

    @media (max-width: 900px) {
      /* Drop the pinned animation on mobile — static stacked layout. */
      .r88-av-rec-scene {
        margin-top: 0;
      }
      .r88-reconfigurable-scene {
        min-height: 0;
        margin-top: 0;
      }
      .r88-reconfigurable-pin {
        position: relative;
        top: 0;
        height: auto;
        overflow: visible;
      }
      .r88-avionics {
        /* No sticky on mobile — normal stacked layout. */
        position: static;
      }
      .r88-avionics__left { opacity: 1 !important; }
      .r88-avionics__features { transform: none !important; opacity: 1 !important; }
      .r88-avionics__feature { transform: none !important; z-index: auto !important; box-shadow: none !important; border-color: rgba(255, 255, 255, 0.1) !important; }
      .r88-reconfigurable__content { opacity: 1 !important; }
      .r88-reconfigurable {
        padding: 4rem 1.25rem;
        height: auto;
      }
      .r88-reconfigurable__container {
        flex-direction: column-reverse;
        gap: 2.5rem;
        height: auto;
      }
      .r88-reconfigurable__content {
        max-width: 100%;
      }
      .r88-reconfigurable__features {
        grid-template-columns: 1fr;
      }
      .r88-reconfigurable__visual {
        position: relative;
        top: 0;
        left: 0;
        width: 280px;
        height: 520px;
        max-width: 100%;
        margin: 0 auto;
        transform: none;
      }
    }

    /* ====================================================================
       AVIONICS SECTION
       ==================================================================== */
    /* Scene wrapper gives the sticky avionics section extra scroll range
       for its internal two-phase animation (image reveal → gradient fade
       while cards rise). Total ~440vh = 100vh of visible pin + 160vh of
       phase scroll + 100vh of "hold while reconfigurable image slides
       over" + 80vh of "hold while reconfigurable cream cover + text
       crossfade runs on top". Avionics must stay pinned through the end
       of the reconfigurable HOLD phase (text-swap=1 / cream-cover fully
       opaque) — after that, the cream cover hides avionics even as it
       scrolls off underneath. --av-transition clamps at 1 during the
       trailing 180vh so cards stay fully revealed. The reconfigurable-
       scene below overlaps this tail via its own negative margin-top. */
    .r88-avionics-scene {
      position: relative;
      min-height: 440vh;
    }

    .r88-avionics {
      /* Top padding absorbs the header height so the visible content
         starts at the same place as before, while the dark background
         extends all the way up to y=0 (behind the fixed header). */
      padding: calc(5rem + var(--catch-top, 90px)) 2rem 5rem;
      background: #1a1a1a;
      color: #fff;
      /* Sticky at top:0 so the dark background fills flush up to the
         header's top edge (no white strip between header and section).
         The header sits in front via its own higher stacking. z-index:1
         keeps avionics beneath the reconfigurable-pin during the
         slide-in transition. */
      position: sticky;
      top: 0;
      z-index: 1;
      /* Constrain to exactly one viewport so the sticky range aligns with
         the reconfigurable pin that follows. */
      height: 100vh;
      overflow: hidden;
      box-sizing: border-box;
      display: flex;
      align-items: center;
    }

    /* Staggered crossfade: avionics text fades out during the FIRST
       half of the hold phase (text-swap 0→0.5 maps to opacity 1→0).
       Reconfigurable content fades in during the SECOND half — so the
       two never appear simultaneously at reduced opacity. */
    .r88-avionics__left {
      opacity: calc(1 - min(1, var(--av-rec-text-swap, 0) * 2));
      transition: opacity 0s;
    }

    /* (.r88-avionics__features opacity/transform is defined further
       down, combining phase-B reveal with the reconfigurable fade.) */

    .r88-avionics__container {
      max-width: 1400px;
      margin: 0 auto;
      width: 100%;
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
      align-items: center;
      width: 100%;
    }

    /* Right column: stacks cockpit image (backdrop) and feature cards
       (on top) in the same space so the cards can fade in over the
       dissolving image. min-height ensures both stack to the same size. */
    .r88-avionics__features-col {
      position: relative;
      min-height: 520px;
      display: flex;
      align-items: stretch;
    }

    /* Cockpit images — shared sizing/positioning/clipping so the first
       and second images always occupy the EXACT same box. Only z-index
       and mask differ between them. */
    .r88-avionics__cockpit,
    .r88-avionics__cockpit-2 {
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      width: 100%;
      height: 100%;
      box-sizing: border-box;
      border-radius: 8px;
      overflow: hidden;
      border: 1px solid rgba(255, 255, 255, 0.15);
      pointer-events: none;
      will-change: mask-image;
    }

    .r88-avionics__cockpit img,
    .r88-avionics__cockpit-2 img {
      width: 100%;
      height: 100%;
      object-fit: cover;
      object-position: center;
      display: block;
    }

    /* First image — fully opaque when section enters view so it
       completely covers the feature cards beneath (no fade-in —
       otherwise card text bleeds through semi-transparent image and
       spoils the top-down reveal). Dissolves top-first during phase B:
       mask pushes a transparent cutoff from top to bottom. */
    .r88-avionics__cockpit {
      z-index: 2;
      opacity: 1;
      -webkit-mask-image: linear-gradient(
        to bottom,
        transparent 0%,
        transparent calc(var(--av-transition, 0) * 104% - 4%),
        #000 calc(var(--av-transition, 0) * 104%),
        #000 100%
      );
      mask-image: linear-gradient(
        to bottom,
        transparent 0%,
        transparent calc(var(--av-transition, 0) * 104% - 4%),
        #000 calc(var(--av-transition, 0) * 104%),
        #000 100%
      );
    }

    /* Second image — appears AFTER phase B. Inverted mask: opaque
       region grows from top→bottom as --av-second-reveal progresses
       0→1, so the image "loads" in from the top. Sits above the
       popped cards (max card z-index ~101) so it covers them up again
       as it draws in. When fully revealed the reconfig section slides
       in over the top.
       Scaled to 1.02 to match the popped-card scale so its edges
       line up with the expanded card footprint — otherwise popped
       cards poke out past the image on left/right/bottom. */
    .r88-avionics__cockpit-2 {
      z-index: 200;
      transform: scale(1.02);
      transform-origin: center;
      -webkit-mask-image: linear-gradient(
        to bottom,
        #000 0%,
        #000 calc(var(--av-second-reveal, 0) * 104% - 4%),
        transparent calc(var(--av-second-reveal, 0) * 104%),
        transparent 100%
      );
      mask-image: linear-gradient(
        to bottom,
        #000 0%,
        #000 calc(var(--av-second-reveal, 0) * 104% - 4%),
        transparent calc(var(--av-second-reveal, 0) * 104%),
        transparent 100%
      );
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
      position: relative;
      z-index: 1;
      width: 100%;
      /* Cards sit beneath the cockpit image (z:2). As the image's mask
         dissolves top-down, each card is progressively uncovered. Once
         a card is ~3/4 uncovered it pops ABOVE the image (see per-card
         rules below). Opacity then drives the reconfigurable fade-out. */
      opacity: calc(1 - min(1, var(--av-rec-features-shrink, 0) * 2));
      will-change: opacity;
    }

    /* Per-card reveal thresholds. A card is ~3/4 uncovered when the
       mask cutoff has descended past (cardIndex + 0.75) / totalCards of
       the column height. Pop animation triggers at that point. */
    .r88-avionics__feature:nth-child(1) { --card-reveal-point: 0.1875; }
    .r88-avionics__feature:nth-child(2) { --card-reveal-point: 0.4375; }
    .r88-avionics__feature:nth-child(3) { --card-reveal-point: 0.6875; }
    .r88-avionics__feature:nth-child(4) { --card-reveal-point: 0.9375; }

    .r88-avionics__feature {
      --pop-duration: 0.06;
      --pop-progress: clamp(
        0,
        calc((var(--av-transition, 0) - var(--card-reveal-point, 1)) / var(--pop-duration)),
        1
      );
      position: relative;
      /* Lift above cockpit image (z:2) when popping. */
      z-index: calc(1 + var(--pop-progress) * 100);
      display: flex;
      gap: 1.25rem;
      padding: 1.5rem;
      /* Solid dark fill (matches section background) so the card fully
         occludes anything behind it once it has popped forward. */
      background: #1a1a1a;
      border: 1px solid rgba(255, 255, 255, calc(0.1 + var(--pop-progress) * 0.5));
      border-radius: 4px;
      /* Subtle grow + momentary vertical hop (sin bump peaks mid-pop). */
      transform:
        scale(calc(1 + var(--pop-progress) * 0.02))
        translateY(calc(sin(calc(var(--pop-progress) * 180deg)) * -6px));
      box-shadow: none;
      transition: background 0.3s ease;
      will-change: transform, z-index, border-color;
    }

    .r88-avionics__feature:hover {
      background: #232323;
      border-color: rgba(255, 255, 255, 0.2);
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

    /* ====================================================================
       GALLERY SECTION
       ==================================================================== */
    /* ----- Gallery scene: pin + split-to-reveal ------------------------ */
    /* Scene is a tall scroll region. Inside it, the pin sticks at catch-top
       and fills (100vh - catch-top). Extra scroll past the pin drives the
       --split-progress variable (set in JS) which translates the two panes
       apart horizontally — revealing the section below as they slide off. */
    .r88-gallery-scene {
      position: relative;
      z-index: 3;
      /* Scene height = pin height (100vh - catchTop) + 100vh of split scroll
         + 100vh of expand/fade scroll. Progress 0→0.5 drives the split,
         0.5→1 drives the video expand + fade that exposes the reconfigurable
         scene layered behind. */
      height: calc(300vh - var(--catch-top, 90px));
      /* Non-linear fade: held near 1 until expand=0.70, then slow 0.70→0.85,
         then fast 0.85→1.00. Quadratic of the post-0.70 portion. */
      --fade-raw: max(0, calc((var(--expand-progress, 0) - 0.70) / 0.30));
      --fade-eased: calc(var(--fade-raw) * var(--fade-raw));
      /* Dark scene bg fades out during the expand phase so the cream
         reconfigurable section behind can show through. */
      background: rgba(10, 10, 10, calc(1 - var(--fade-eased)));
    }

    .r88-gallery-pin {
      position: sticky;
      top: var(--catch-top, 90px);
      height: calc(100vh - var(--catch-top, 90px));
      overflow: hidden;
    }

    .r88-gallery {
      position: relative;
      /* Stack above the pinned intro so the gallery visually rises over it
         while intro stays fixed at the viewport bottom. */
      z-index: 3;
      padding: 1.5rem 2rem;
      /* Inner bg also fades in sync with the scene so the cream backdrop
         can come through cleanly. Uses the same eased fade as the scene. */
      background: rgba(10, 10, 10, calc(1 - var(--fade-eased, 0)));
      height: 100%;
      display: flex;
      align-items: stretch;
    }

    .r88-gallery__container {
      max-width: 1200px;
      margin: 0 auto;
      width: 100%;
      height: 100%;
      position: relative;
    }

    /* Reveal layer: sits behind the grid so the panes cover it at
       progress=0. As the panes translate apart, the reveal is exposed
       through the gap. */
    .r88-gallery__reveal {
      position: absolute;
      inset: 0;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      gap: 1.75rem;
      padding: 1rem;
      z-index: 1;
      pointer-events: none;
      /* Fade in with the split (0.08→0.3), then fade out with the eased
         expand curve (held until 0.70, then quadratic). */
      opacity: min(
        calc((var(--split-progress, 0) - 0.08) / 0.22),
        calc(1 - var(--fade-eased, 0))
      );
    }

    .r88-gallery__reveal-video {
      display: block;
      height: min(62vh, calc(100vh - var(--catch-top, 90px) - 12rem));
      width: auto;
      aspect-ratio: 810 / 1080;
      max-width: 90%;
      object-fit: cover;
      border-radius: 18px;
      box-shadow: 0 30px 80px rgba(0, 0, 0, 0.55);
      background: #111;
      /* Scale from the split-in size, then grow fast during the expand
         phase so the video looks like it's zooming toward the viewer as
         it fades out. */
      transform: scale(
        calc((0.9 + 0.1 * var(--split-progress, 0))
             * (1 + 2.5 * var(--expand-progress, 0)))
      );
      transform-origin: center;
      will-change: transform;
    }

    .r88-gallery__reveal-headline {
      font-family: 'Space Grotesk', sans-serif;
      font-size: clamp(0.85rem, 2vw, 1.8rem);
      font-weight: 500;
      color: #fff;
      letter-spacing: -0.01em;
      text-align: center;
      margin: 0;
      line-height: 1.2;
      white-space: nowrap;
    }

    .r88-gallery__reveal-letter {
      display: inline-block;
      opacity: 0;
      transform: translateY(14px);
      transition: opacity 0.45s cubic-bezier(0.22, 1, 0.36, 1),
                  transform 0.45s cubic-bezier(0.22, 1, 0.36, 1);
    }

    .r88-gallery__reveal-letter--visible {
      opacity: 1;
      transform: translateY(0);
    }

    .r88-gallery__grid {
      display: grid;
      /* Two panes side-by-side; each pane is a 2-col sub-grid, so the
         overall look is still a 4-column grid when progress = 0. */
      grid-template-columns: 1fr 1fr;
      gap: 0.75rem;
      height: 100%;
      /* Panes sit above the reveal so they hide it at progress=0 and
         expose it as they translate apart. */
      position: relative;
      z-index: 2;
    }

    .r88-gallery__pane {
      display: grid;
      grid-template-columns: 1fr 1fr;
      grid-template-rows: repeat(4, 1fr);
      gap: 0.75rem;
      min-height: 0;
      will-change: transform;
    }
    /* Each <Reveal> wraps a tile in an extra motion.div, so we need that
       wrapper to stretch to fill the grid-row track; otherwise the tile
       collapses to its content height and the 4×4 grid won't fill the pin. */
    .r88-gallery__pane > * {
      min-height: 0;
      min-width: 0;
      height: 100%;
    }
    .r88-gallery__pane > * > .r88-gallery__item {
      height: 100%;
      width: 100%;
    }
    /* Translate by viewport units so panes slide fully off-screen at
       progress=1 on any viewport width (50vw is more than each pane's
       ~600px width on a 1200px container, so the pane clears the pin
       even on ultrawide displays). */
    .r88-gallery__pane--left {
      transform: translate3d(calc(-60vw * var(--split-progress, 0)), 0, 0);
    }
    .r88-gallery__pane--right {
      transform: translate3d(calc(60vw * var(--split-progress, 0)), 0, 0);
    }

    /* Mobile: disable the pin + split effect; revert to a natural scroll
       layout (the 4×4 grid at 4/3 aspect tiles is too tall for a pin on
       short viewports). */
    @media (max-width: 900px) {
      .r88-gallery-scene { height: auto; }
      .r88-gallery-pin {
        position: static;
        height: auto;
        overflow: visible;
      }
      .r88-gallery {
        height: auto;
        padding: 3rem 1.25rem;
      }
      .r88-gallery__container { height: auto; }
      /* The split reveal relies on the pinned scroll animation — skip on
         mobile since the pin is disabled and panes no longer translate. */
      .r88-gallery__reveal { display: none; }
      .r88-gallery__grid { height: auto; }
      .r88-gallery__pane {
        grid-template-rows: auto;
        transform: none !important;
      }
      .r88-gallery__pane > * { height: auto; }
      .r88-gallery__pane > * > .r88-gallery__item {
        height: auto;
        aspect-ratio: 4 / 3;
      }
    }

    .r88-gallery__item {
      position: relative;
      overflow: hidden;
      border-radius: 4px;
      cursor: pointer;
      /* Inside the scene pin the grid rows already size the tile — override
         the 4/3 aspect-ratio so tiles fill their row track. */
      aspect-ratio: auto;
      min-height: 0;
      min-width: 0;
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
      margin-top: 0;
      margin-bottom: 4rem;
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
      /* Rise over the pinned engine: negative margin pulls the register
         section up into the scene's trailing 100vh, so register rises
         into view from the viewport bottom (starting exactly when engine
         sticks) and scrolls up to fully cover the pinned engine. */
      position: relative;
      z-index: 3;
      margin-top: -100vh;
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
      <Seo
        title="New Robinson R88 · Consultation UK and Europe"
        description="New Robinson R88 — 10-seat utility turbine. UK consultations, pricing info, delivery slots, pre-order enquiries with HQ Aviation, Robinson dealer."
        ogImage="/assets/images/new-aircraft/r88/rhc-r88-wide-view-instrument-panel-13175.jpg"
        jsonLd={[
          buildProduct({
            name: 'Robinson R88',
            description: 'New Robinson R88 — 10-seat utility turbine, Safran Arriel 2W. Pre-certification, UK and Europe delivery interest registration.',
            image: '/assets/images/new-aircraft/r88/rhc-r88-wide-view-instrument-panel-13175.jpg',
            brand: 'Robinson Helicopter Company',
            url: '/aircraft/r88',
            offers: {
              '@type': 'Offer',
              availability: 'https://schema.org/PreOrder',
              priceCurrency: 'GBP',
              url: 'https://hqaviation.com/aircraft/r88',
            },
          }),
          buildBreadcrumbList([
            { name: 'Home', path: '/' },
            { name: 'New Aircraft Sales', path: '/sales/new' },
            { name: 'Robinson R88', path: '/aircraft/r88' },
          ]),
        ]}
      />
      <h1 style={{ position: 'absolute', left: '-10000px', width: '1px', height: '1px', overflow: 'hidden' }}>
        New Robinson R88 — 10-Seat Utility Turbine, United Kingdom UK & Europe Consultation
      </h1>
      <R88Styles />
      <R88Header />
      <main>
        <R88Hero />
        <div className="r88-sticky-stack">
          <R88Highlights />
          <R88Introduction />
          <R88Gallery />
        </div>
        {/* Avionics → Reconfigurable transition: reconfigurable-pin slides
            in from the left over the pinned avionics, text/features morph
            from avionics into reconfigurable, then the reconfigurable
            image animates rightward covering where features used to be. */}
        <div className="r88-av-rec-scene">
          <R88Avionics />
          <R88Reconfigurable />
        </div>
        <R88Engine />
        <R88CTA />
      </main>
      <FooterMinimal />
    </div>
  );
}

export default AircraftR88;

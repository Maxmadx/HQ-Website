/**
 * SELF-FLY HIRE PAGE
 *
 * Brand: Luxury Minimal Aviation
 * Typography: Space Grotesk + Share Tech Mono
 * Colors: #faf9f6 (warm white), #1a1a1a (charcoal), #2563eb (accent)
 */

import React, { useRef, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, useInView, useScroll, useTransform } from 'framer-motion';

// Import styles
import '../assets/css/main.css';
import '../assets/css/components.css';

// Import FooterMinimal component
import FooterMinimal from '../components/FooterMinimal';

/**
 * SELF-FLY HIRE PAGE HEADER COMPONENT
 */
function SelfFlyHireHeader() {
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
              <li><Link to="/training/ppl" onClick={closeMenu}>Private Pilot License</Link></li>
              <li><Link to="/training/faq" onClick={closeMenu}>Training FAQ</Link></li>
            </ul>
          </div>
          <div className="hq-menu-section">
            <h3>Services</h3>
            <ul>
              <li><Link to="/services" onClick={closeMenu}>Services Overview</Link></li>
              <li><Link to="/self-fly-hire" onClick={closeMenu}>Self-Fly Hire</Link></li>
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

// Animated reveal wrapper
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

// Animated counter
function AnimatedNumber({ value, suffix = '' }) {
  const [count, setCount] = useState(0);
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });

  useEffect(() => {
    if (isInView) {
      const num = parseInt(value.replace(/[^0-9]/g, ''));
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

  return <span ref={ref}>{count}{suffix}</span>;
}

// Fleet data
const fleetData = [
  {
    model: 'R22',
    image: '/assets/images/fleet/r22-g-ulze.png',
    seats: 2,
    speed: '96 kts',
    range: '185 nm',
    hourlyRate: '£275',
    description: 'Perfect for solo adventures or training continuation. Light, nimble, and economical.',
    features: ['Garmin GPS', 'Intercom System', 'Leather Seats']
  },
  {
    model: 'R44 Raven II',
    image: '/assets/images/fleet/r44-g-mxpi.png',
    seats: 4,
    speed: '113 kts',
    range: '300 nm',
    hourlyRate: '£395',
    description: 'Our most popular hire aircraft. Ideal for day trips, golf outings, and family flights.',
    features: ['Air Conditioning', 'Garmin G500', 'Leather Interior', 'USB Charging']
  },
  {
    model: 'R66 Turbine',
    image: '/assets/images/fleet/r66-g-tlmi.png',
    seats: 5,
    speed: '120 kts',
    range: '350 nm',
    hourlyRate: '£595',
    description: 'Turbine reliability with exceptional performance. Perfect for longer journeys and higher altitudes.',
    features: ['Turbine Engine', 'Garmin G500H', 'Premium Interior', 'Enhanced Safety Features']
  }
];

// Requirements data
const requirements = [
  {
    icon: '01',
    title: 'Valid PPL(H)',
    desc: 'Current Private Pilot License for helicopters with valid medical certificate'
  },
  {
    icon: '02',
    title: 'Type Rating',
    desc: 'Current type rating for the aircraft you wish to hire (R22, R44, or R66)'
  },
  {
    icon: '03',
    title: 'Currency Check',
    desc: 'Recent flight experience or checkout flight with our instructors'
  },
  {
    icon: '04',
    title: 'Insurance',
    desc: 'Comprehensive insurance included in all hire rates'
  }
];

// Benefits data
const benefits = [
  { stat: '30+', label: 'Aircraft Available', desc: 'The largest Robinson fleet in Europe' },
  { stat: '7', label: 'Days a Week', desc: 'Flexible scheduling to suit your plans' },
  { stat: '2,000+', label: 'Destinations', desc: 'Fly anywhere in the UK and Europe' }
];

// Destinations data
const allDestinations = [
  // UK destinations
  { name: 'Goodwood', type: 'UK', time: '25 mins', image: '/assets/images/gallery/carousel/rotating4.jpg' },
  { name: 'Cotswolds', type: 'UK', time: '35 mins', image: '/assets/images/gallery/carousel/rotating5.jpg' },
  { name: 'Cambridge', type: 'UK', time: '30 mins', image: '/assets/images/gallery/carousel/rotating2.jpg' },
  { name: 'Oxford', type: 'UK', time: '25 mins', image: '/assets/images/gallery/carousel/rotating3.jpg' },
  { name: 'Lake District', type: 'UK', time: '1h 50m', image: '/assets/images/gallery/carousel/rotating6.jpg' },
  { name: 'Channel Islands', type: 'UK', time: '1h 15m', image: '/assets/images/gallery/carousel/rotating7.jpg' },
  { name: 'St Andrews', type: 'UK', time: '2h 45m', image: '/assets/images/gallery/carousel/rotating8.jpg' },
  { name: 'Brighton', type: 'UK', time: '30 mins', image: '/assets/images/gallery/carousel/rotating9.jpg' },
  { name: 'Bath', type: 'UK', time: '45 mins', image: '/assets/images/gallery/carousel/rotating10.jpg' },
  { name: 'Cardiff', type: 'UK', time: '1h 10m', image: '/assets/images/gallery/carousel/rotating2.jpg' },
  { name: 'Edinburgh', type: 'UK', time: '3h', image: '/assets/images/gallery/carousel/rotating3.jpg' },
  { name: 'Silverstone', type: 'UK', time: '35 mins', image: '/assets/images/gallery/carousel/rotating4.jpg' },
  // Europe destinations
  { name: 'Le Touquet', type: 'France', time: '45 mins', image: '/assets/images/gallery/carousel/rotating5.jpg' },
  { name: 'Paris', type: 'France', time: '1h 30m', image: '/assets/images/gallery/carousel/rotating6.jpg' },
  { name: 'Deauville', type: 'France', time: '1h', image: '/assets/images/gallery/carousel/rotating7.jpg' },
  { name: 'Chantilly', type: 'France', time: '1h 15m', image: '/assets/images/gallery/carousel/rotating8.jpg' },
  { name: 'Reims', type: 'France', time: '1h 25m', image: '/assets/images/gallery/carousel/rotating9.jpg' },
  { name: 'Bruges', type: 'Europe', time: '1h 10m', image: '/assets/images/gallery/carousel/rotating10.jpg' },
  { name: 'Amsterdam', type: 'Europe', time: '1h 45m', image: '/assets/images/gallery/carousel/rotating2.jpg' },
  { name: 'Brussels', type: 'Europe', time: '1h 20m', image: '/assets/images/gallery/carousel/rotating3.jpg' },
];

function SelfFlyHire() {
  const heroRef = useRef(null);
  const [openFaq, setOpenFaq] = useState(null);
  const [activeFleet, setActiveFleet] = useState(1);
  const [destFilter, setDestFilter] = useState('All');
  const [visibleDests, setVisibleDests] = useState(6);
  const [destsExpanded, setDestsExpanded] = useState(false);
  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ['start start', 'end start'],
  });

  const heroOpacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);
  const heroScale = useTransform(scrollYProgress, [0, 0.5], [1, 0.95]);
  const heroY = useTransform(scrollYProgress, [0, 0.5], [0, 100]);

  // Scroll to top on mount
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const faqs = [
    {
      q: 'What are the minimum requirements to hire?',
      a: 'You need a valid PPL(H) with a current medical certificate, the appropriate type rating for your chosen aircraft, and recent flight experience. If you haven\'t flown recently, we can arrange a currency check flight.'
    },
    {
      q: 'How far in advance should I book?',
      a: 'We recommend booking at least 48 hours in advance, especially for weekends and holidays. However, subject to availability, we can accommodate same-day bookings.'
    },
    {
      q: 'Is insurance included?',
      a: 'Yes, comprehensive hull and liability insurance is included in all hire rates. Your excess is £5,000 for the R22, £7,500 for the R44, and £10,000 for the R66.'
    },
    {
      q: 'Can I fly abroad?',
      a: 'Yes, with prior arrangement. We can assist with flight planning, customs requirements, and necessary permissions for international flights.'
    },
    {
      q: 'What happens if I need to cancel?',
      a: 'Cancellations made more than 24 hours before your booking receive a full refund. Cancellations within 24 hours are charged at 50% of the booking value.'
    },
    {
      q: 'Do you offer block booking discounts?',
      a: 'Yes, we offer discounted rates for block bookings of 10 hours or more. Contact us for a personalized quote based on your flying requirements.'
    }
  ];

  return (
    <div className="sfh">
      <SelfFlyHireHeader />

      {/* ========== HERO SECTION ========== */}
      <section ref={heroRef} className="sfh-hero">
        <motion.div
          className="sfh-hero__bg"
          initial={{ scale: 1.1, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 1.5 }}
        >
          <img src="/assets/images/gallery/carousel/rotating1.jpg" alt="" />
        </motion.div>
        <div className="sfh-hero__overlay" />

        <motion.div
          className="sfh-hero__content"
          style={{ opacity: heroOpacity, scale: heroScale, y: heroY }}
        >
          <div className="sfh-hero__left">
            <motion.span
              className="sfh-hero__label"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              HELICOPTER HIRE
            </motion.span>

            <div className="sfh-hero__headline">
              <motion.span
                className="sfh-hero__word sfh-hero__word--1"
                initial={{ opacity: 0, y: 40 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.4, ease: [0.16, 1, 0.3, 1] }}
              >
                SELF-FLY
              </motion.span>
              <motion.span
                className="sfh-hero__word sfh-hero__word--2"
                initial={{ opacity: 0, y: 40 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.6, ease: [0.16, 1, 0.3, 1] }}
              >
                HIRE
              </motion.span>
            </div>

            <motion.div
              className="sfh-hero__divider-line"
              initial={{ scaleX: 0 }}
              animate={{ scaleX: 1 }}
              transition={{ duration: 0.8, delay: 0.8, ease: [0.16, 1, 0.3, 1] }}
            />

            <motion.p
              className="sfh-hero__sub"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1 }}
            >
              Access Europe's largest Robinson fleet. Fly where you want, when you want—with the freedom only helicopter travel provides.
            </motion.p>

            <motion.div
              className="sfh-hero__stats"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.2 }}
            >
              <div className="sfh-hero__stat">
                <span className="sfh-hero__stat-value">30+</span>
                <span className="sfh-hero__stat-label">Aircraft</span>
              </div>
              <div className="sfh-hero__stat-divider" />
              <div className="sfh-hero__stat">
                <span className="sfh-hero__stat-value">3</span>
                <span className="sfh-hero__stat-label">Models</span>
              </div>
              <div className="sfh-hero__stat-divider" />
              <div className="sfh-hero__stat">
                <span className="sfh-hero__stat-value">7</span>
                <span className="sfh-hero__stat-label">Days/Week</span>
              </div>
            </motion.div>
          </div>
        </motion.div>
      </section>

      {/* ========== INTRO SECTION ========== */}
      <section className="sfh-intro">
        <div className="sfh-intro__container">
          <div className="sfh-intro__image">
            <img
              src="/assets/images/facility/fleet-lineup.jpg"
              alt="HQ Aviation helicopter fleet lined up"
            />
          </div>

          <div className="sfh-intro__right">
            <Reveal>
              <div className="sfh-intro__header">
                <span className="sfh-pre-text">Freedom to Fly</span>
                <h2>
                  <span className="sfh-text--dark">Self-Fly Hire:</span>{' '}
                  <span className="sfh-text--mid">Your Aircraft</span>{' '}
                  <span className="sfh-text--light">Awaits</span>
                </h2>
                <p>
                  With an impressive fleet of over 30 helicopters, HQ Aviation offers unparalleled choice and availability
                  for licensed pilots. Whether you're planning a day trip to the coast, a golf weekend in Scotland, or
                  a business meeting across the country, we have the perfect aircraft for your mission.
                </p>
              </div>
            </Reveal>

            <Reveal delay={0.2}>
              <div className="sfh-process__steps sfh-process__steps--horizontal" style={{ marginTop: '1.5rem' }}>
                <div className="sfh-process__step">
                  <div className="sfh-process__step-num">01</div>
                  <div className="sfh-process__step-content">
                    <h4>Call Operations</h4>
                    <p className="sfh-process__desc">Confirm Booking</p>
                    <span className="sfh-process__time">1-2 mins</span>
                  </div>
                </div>
                <div className="sfh-process__arrow">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M5 12h14M12 5l7 7-7 7"/>
                  </svg>
                </div>
                <div className="sfh-process__step sfh-process__step--fly">
                  <div className="sfh-process__step-num">02</div>
                  <div className="sfh-process__step-content">
                    <h4>Fly</h4>
                    <p className="sfh-process__desc">Arrive at your aircraft already on the pad ready for your imminent departure.</p>
                  </div>
                </div>
              </div>
            </Reveal>

            <Reveal delay={0.3}>
              <div className="sfh-intro__benefits">
                {benefits.map((benefit, i) => (
                  <div key={i} className="sfh-intro__benefit">
                    <span className="sfh-intro__benefit-stat"><AnimatedNumber value={benefit.stat} /></span>
                    <span className="sfh-intro__benefit-label">{benefit.label}</span>
                  </div>
                ))}
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* ========== FLEET SECTION ========== */}
      <section className="sfh-fleet">
        <div className="sfh-fleet__container">
          <Reveal>
            <div className="sfh-section-header">
              <span className="sfh-pre-text">Our Fleet</span>
              <h2>
                <span className="sfh-text--dark">Choose</span>{' '}
                <span className="sfh-text--mid">Your</span>{' '}
                <span className="sfh-text--light">Aircraft</span>
              </h2>
            </div>
          </Reveal>

          <div className="sfh-fleet__selector">
            {fleetData.map((aircraft, i) => (
              <button
                key={i}
                className={`sfh-fleet__tab ${activeFleet === i ? 'sfh-fleet__tab--active' : ''}`}
                onClick={() => setActiveFleet(i)}
              >
                <span className="sfh-fleet__tab-num">{String(i + 1).padStart(2, '0')}</span>
                <span className="sfh-fleet__tab-model">{aircraft.model}</span>
              </button>
            ))}
          </div>

          <Reveal delay={0.1}>
            <div className="sfh-fleet__card">
              <div className="sfh-fleet__image">
                <img src={fleetData[activeFleet].image} alt={fleetData[activeFleet].model} />
                <div className="sfh-fleet__image-overlay">
                  <span className="sfh-fleet__model">{fleetData[activeFleet].model}</span>
                </div>
              </div>
              <div className="sfh-fleet__info">
                <div className="sfh-fleet__specs">
                  <div className="sfh-fleet__spec">
                    <span className="sfh-fleet__spec-value">{fleetData[activeFleet].seats}</span>
                    <span className="sfh-fleet__spec-label">Seats</span>
                  </div>
                  <div className="sfh-fleet__spec-divider" />
                  <div className="sfh-fleet__spec">
                    <span className="sfh-fleet__spec-value">{fleetData[activeFleet].speed}</span>
                    <span className="sfh-fleet__spec-label">Cruise Speed</span>
                  </div>
                  <div className="sfh-fleet__spec-divider" />
                  <div className="sfh-fleet__spec">
                    <span className="sfh-fleet__spec-value">{fleetData[activeFleet].range}</span>
                    <span className="sfh-fleet__spec-label">Range</span>
                  </div>
                </div>
                <p className="sfh-fleet__desc">{fleetData[activeFleet].description}</p>
                <div className="sfh-fleet__features">
                  {fleetData[activeFleet].features.map((feature, i) => (
                    <span key={i} className="sfh-fleet__feature">{feature}</span>
                  ))}
                </div>
              </div>
            </div>
          </Reveal>
        </div>

        <div className="sfh-destinations__container">
          <Reveal>
            <div className="sfh-destinations__collapsible-card">
              <button
                className="sfh-destinations__toggle"
                onClick={() => setDestsExpanded(!destsExpanded)}
              >
                <div>
                  <span className="sfh-pre-text" style={{ marginBottom: 0 }}>Where Will You Go?</span>
                  <h2 style={{ margin: '0.25rem 0 0' }}>
                    <span className="sfh-text--dark">See Where</span>{' '}
                    <span className="sfh-text--mid">You Can</span>{' '}
                    <span className="sfh-text--light">Fly To</span>
                  </h2>
                </div>
                <span className={`sfh-destinations__toggle-icon ${destsExpanded ? 'sfh-destinations__toggle-icon--open' : ''}`}>
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M6 9l6 6 6-6"/>
                  </svg>
                </span>
              </button>

              <div className={`sfh-destinations__collapse ${destsExpanded ? 'sfh-destinations__collapse--open' : ''}`}>
                <p className="sfh-section-desc" style={{ textAlign: 'center', marginBottom: '1.5rem' }}>
                  From coastal escapes to countryside retreats, the helicopter opens doors to destinations unreachable by road.
                </p>

          <Reveal delay={0.1}>
            <div className="sfh-destinations__filters">
              {['All', 'UK', 'Europe', 'France'].map((filter) => (
                <button
                  key={filter}
                  className={`sfh-destinations__filter ${destFilter === filter ? 'sfh-destinations__filter--active' : ''}`}
                  onClick={() => { setDestFilter(filter); setVisibleDests(6); }}
                >
                  {filter}
                </button>
              ))}
            </div>
          </Reveal>

          <div className="sfh-destinations__grid">
            {allDestinations
              .filter(d => destFilter === 'All' || d.type === destFilter || (destFilter === 'Europe' && (d.type === 'Europe' || d.type === 'France')))
              .slice(0, visibleDests)
              .map((dest, i) => (
                <Reveal key={dest.name} delay={i * 0.05}>
                  <div className="sfh-destinations__card">
                    <div className="sfh-destinations__image">
                      <img src={dest.image} alt={dest.name} />
                      <div className="sfh-destinations__overlay">
                        <span className="sfh-destinations__time">{dest.time}</span>
                      </div>
                    </div>
                    <div className="sfh-destinations__info">
                      <span className="sfh-destinations__type">{dest.type}</span>
                      <h4>{dest.name}</h4>
                    </div>
                  </div>
                </Reveal>
              ))}
          </div>

          {visibleDests < allDestinations.filter(d => destFilter === 'All' || d.type === destFilter || (destFilter === 'Europe' && (d.type === 'Europe' || d.type === 'France'))).length && (
            <Reveal delay={0.2}>
              <div className="sfh-destinations__load-more">
                <button
                  className="sfh-destinations__chevron"
                  onClick={() => setVisibleDests(prev => prev + 6)}
                >
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M6 9l6 6 6-6"/>
                  </svg>
                  <span>Load More</span>
                </button>
              </div>
            </Reveal>
          )}
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      {/* Hire Rates section moved to /components (ComponentShowcase) as SelfFlyHireRates */}

      {/* Booking process moved into sfh-intro__right */}

      {/* Destination Partners section moved to /components (ComponentShowcase) as DestinationPartners */}
      {/* Safety/Maintained section removed */}

      {/* Gallery section removed */}

      {/* Additional Services section moved to /components (ComponentShowcase) */}


      {/* ========== FAQ & LOCATION SECTION ========== */}
      <section className="sfh-faq-location">
        <div className="sfh-faq-location__container">
          <div className="sfh-faq-location__map">
            <Reveal>
              <div className="sfh-section-header">
                <span className="sfh-pre-text">Visit Us</span>
                <h2>
                  <span className="sfh-text--dark">Find Us</span>
                </h2>
              </div>
            </Reveal>
            <div className="sfh-faq-location__map-frame">
              <img
                src="/assets/images/maps/denham-map.png"
                alt="Denham Aerodrome location map"
                className="sfh-faq-location__map-image"
              />
              <div className="sfh-faq-location__map-info">
                <h4>Denham Aerodrome</h4>
                <p>Tilehouse Lane, Denham, UB9 5DF</p>
                <div className="sfh-faq-location__actions">
                  <span className="sfh-faq-location__icao">EGLD</span>
                  <a
                    href="https://www.google.com/maps/dir//Denham+Aerodrome"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="sfh-btn sfh-btn--outline sfh-btn--small"
                  >
                    Get Directions
                  </a>
                </div>
              </div>
            </div>
          </div>
          <div className="sfh-faq-location__faq">
            <Reveal>
              <div className="sfh-section-header">
                <span className="sfh-pre-text">Common Questions</span>
                <h2>
                  <span className="sfh-text--dark">FAQ</span>
                </h2>
              </div>
            </Reveal>

            <div className="sfh-faq__list">
              {faqs.map((faq, i) => (
                <div
                  key={i}
                  className={`sfh-faq__item ${openFaq === i ? 'sfh-faq__item--open' : ''}`}
                  onClick={() => setOpenFaq(openFaq === i ? null : i)}
                >
                  <div className="sfh-faq__number">{String(i + 1).padStart(2, '0')}</div>
                  <div className="sfh-faq__content">
                    <h4>
                      {faq.q}
                      <span className="sfh-faq__toggle">{openFaq === i ? '−' : '+'}</span>
                    </h4>
                    <motion.div
                      className="sfh-faq__answer"
                      initial={false}
                      animate={{ height: openFaq === i ? 'auto' : 0, opacity: openFaq === i ? 1 : 0 }}
                      transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
                    >
                      <p>{faq.a}</p>
                    </motion.div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ========== CTA SECTION ========== */}
      <section className="sfh-cta">
        <div className="sfh-cta__inner">
          <div className="sfh-cta__image">
            <motion.img
              src="/assets/images/gallery/carousel/rotating8.jpg"
              alt="Helicopter in flight"
              initial={{ scale: 1.05 }}
              whileInView={{ scale: 1 }}
              transition={{ duration: 1.5, ease: [0.16, 1, 0.3, 1] }}
              viewport={{ once: true }}
            />
            <div className="sfh-cta__image-overlay" />
          </div>

          <div className="sfh-cta__content">
            <div className="sfh-cta__header">
              <span className="sfh-pre-text">Ready to Fly?</span>
              <h2>
                <span className="sfh-text--dark">Book</span>{' '}
                <span className="sfh-text--mid">Your</span>{' '}
                <span className="sfh-text--light">Aircraft</span>
              </h2>
            </div>

            <p className="sfh-cta__desc">
              Contact our team to check availability and make your booking. We're here to help make your flight plans a reality.
            </p>

            <div className="sfh-cta__contact">
              <a href="tel:+441895833373" className="sfh-cta__contact-item">
                <span className="sfh-cta__contact-label">Call Us</span>
                <span className="sfh-cta__contact-value">+44 1895 833 373</span>
              </a>
              <div className="sfh-cta__contact-divider" />
              <a href="mailto:hire@hqaviation.com" className="sfh-cta__contact-item">
                <span className="sfh-cta__contact-label">Email</span>
                <span className="sfh-cta__contact-value">hire@hqaviation.com</span>
              </a>
            </div>

            <div className="sfh-cta__buttons">
              <a href="/contact?subject=hire" className="sfh-btn sfh-btn--primary sfh-btn--large">
                Make a Booking
              </a>
              <Link to="/training/ppl" className="sfh-btn sfh-btn--outline">
                Get Your License
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ========== FOOTER ========== */}
      <FooterMinimal />

      {/* ========== STYLES ========== */}
      <style>{`
        /* ===== BASE ===== */
        .sfh {
          font-family: 'Space Grotesk', -apple-system, sans-serif;
          background: #faf9f6;
          color: #1a1a1a;
        }

        .sfh-pre-text {
          display: block;
          font-size: 0.7rem;
          text-transform: uppercase;
          letter-spacing: 0.25em;
          color: #999;
          margin-bottom: 1rem;
        }

        .sfh-text--dark { color: #1a1a1a; }
        .sfh-text--mid { color: #4a4a4a; }
        .sfh-text--light { color: #7a7a7a; }

        .sfh-section-header {
          text-align: center;
          max-width: 700px;
          margin: 0 auto 3rem;
        }

        .sfh-section-header h2 {
          font-size: clamp(2rem, 4vw, 3rem);
          margin: 0.5rem 0;
          line-height: 1.1;
          text-transform: uppercase;
          font-weight: 700;
        }

        .sfh-section-desc {
          color: #666;
          font-size: 1rem;
          margin-top: 1rem;
        }

        /* Buttons */
        .sfh-btn {
          display: inline-block;
          padding: 1rem 2rem;
          font-size: 0.75rem;
          font-weight: 400;
          text-decoration: none;
          text-transform: uppercase;
          letter-spacing: 0.1em;
          border: none;
          cursor: pointer;
          transition: all 0.3s ease;
          font-family: inherit;
          text-align: center;
        }

        .sfh-btn--primary {
          background: #1a1a1a;
          color: #fff;
        }

        .sfh-btn--primary:hover {
          background: #333;
          color: #fff;
        }

        .sfh-btn--outline {
          background: transparent;
          color: #1a1a1a;
          border: 2px solid #1a1a1a;
        }

        .sfh-btn--outline:hover {
          background: #1a1a1a;
          color: #fff;
        }

        .sfh-btn--large {
          padding: 1.1rem 2.5rem;
          font-size: 0.8rem;
        }

        /* ===== HERO ===== */
        .sfh-hero {
          min-height: 100vh;
          position: relative;
          display: flex;
          flex-direction: column;
          overflow: hidden;
          background: #faf9f6;
        }

        .sfh-hero__bg {
          position: absolute;
          inset: 0;
          z-index: 1;
        }

        .sfh-hero__bg img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }

        .sfh-hero__overlay {
          position: absolute;
          inset: 0;
          z-index: 2;
          background: linear-gradient(90deg, rgba(250,249,246,0.97) 0%, rgba(250,249,246,0.92) 45%, rgba(250,249,246,0.4) 100%);
        }

        .sfh-hero__content {
          position: relative;
          z-index: 3;
          flex: 1;
          display: flex;
          align-items: center;
          padding: 2rem 4rem 2rem;
        }

        .sfh-hero__left {
          max-width: 550px;
        }

        .sfh-hero__label {
          font-size: 0.7rem;
          font-weight: 400;
          letter-spacing: 0.2em;
          text-transform: uppercase;
          color: #999;
          display: block;
          margin-bottom: 1.5rem;
        }

        .sfh-hero__headline {
          display: flex;
          flex-direction: column;
          line-height: 1;
          margin-bottom: 1.5rem;
        }

        .sfh-hero__word {
          font-weight: 700;
          font-size: clamp(3rem, 8vw, 5.5rem);
          letter-spacing: -0.02em;
          text-transform: uppercase;
        }

        .sfh-hero__word--1 { color: #1a1a1a; }
        .sfh-hero__word--2 { color: #4a4a4a; }

        .sfh-hero__divider-line {
          width: 80px;
          height: 2px;
          background: #1a1a1a;
          margin-bottom: 1.5rem;
          transform-origin: left;
        }

        .sfh-hero__sub {
          font-size: 1.1rem;
          color: #666;
          line-height: 1.8;
          max-width: 420px;
          margin-bottom: 2rem;
        }

        .sfh-hero__stats {
          display: flex;
          align-items: center;
          gap: 1.5rem;
        }

        .sfh-hero__stat {
          text-align: center;
        }

        .sfh-hero__stat-value {
          display: block;
          font-family: 'Share Tech Mono', monospace;
          font-size: 1.5rem;
          font-weight: 700;
          color: #1a1a1a;
        }

        .sfh-hero__stat-label {
          font-size: 0.65rem;
          color: #888;
          text-transform: uppercase;
          letter-spacing: 0.1em;
        }

        .sfh-hero__stat-divider {
          width: 1px;
          height: 30px;
          background: linear-gradient(to bottom, transparent, #e8e6e2, transparent);
        }

        /* ===== INTRO ===== */
        .sfh-intro {
          padding: 5rem 2rem;
          background: #fff;
          position: relative;
        }

        .sfh-intro::before {
          content: '';
          position: absolute;
          top: 0;
          left: 50%;
          transform: translateX(-50%);
          width: min(80%, 600px);
          height: 1px;
          background: linear-gradient(90deg, transparent, #e0deda, transparent);
        }

        .sfh-intro__container {
          max-width: 1100px;
          margin: 0 auto;
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 3rem;
          align-items: start;
        }

        .sfh-intro__image {
          position: sticky;
          top: 120px;
          border-radius: 6px;
          max-height: 400px;
        }

        .sfh-intro__image img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          display: block;
          border-radius: 6px;
          max-height: 400px;
        }

        .sfh-intro__right {
          display: flex;
          flex-direction: column;
        }

        .sfh-intro__header {
          text-align: left;
          margin: 0;
        }

        .sfh-intro__header h2 {
          font-size: clamp(1.75rem, 3.5vw, 2.5rem);
          margin: 0.5rem 0 1.5rem;
          text-transform: uppercase;
        }

        .sfh-intro__header p {
          color: #666;
          font-size: 1rem;
          line-height: 1.8;
        }

        .sfh-intro__benefits {
          display: flex;
          gap: 2rem;
          flex-wrap: wrap;
          margin-top: 1.5rem;
        }

        .sfh-intro__benefit {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          text-align: left;
          padding: 0;
          background: transparent;
          border: none;
        }

        .sfh-intro__benefit-stat {
          font-family: 'Share Tech Mono', monospace;
          font-size: 1.25rem;
          font-weight: 700;
          color: #1a1a1a;
          line-height: 1;
        }

        .sfh-intro__benefit-label {
          font-size: 0.7rem;
          font-weight: 500;
          text-transform: uppercase;
          letter-spacing: 0.05em;
          color: #666;
        }

        /* ===== FLEET ===== */
        .sfh-fleet {
          padding: 2.5rem 1.5rem;
          background: #faf9f6;
          position: relative;
        }

        .sfh-fleet::before {
          content: '';
          position: absolute;
          top: 0;
          left: 50%;
          transform: translateX(-50%);
          width: min(80%, 600px);
          height: 1px;
          background: linear-gradient(90deg, transparent, #e0deda, transparent);
        }

        .sfh-fleet__container {
          max-width: 1000px;
          margin: 0 auto;
        }

        .sfh-fleet__selector {
          display: flex;
          justify-content: center;
          gap: 0.35rem;
          margin-bottom: 1rem;
        }

        .sfh-fleet__tab {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          padding: 0.5rem 1rem;
          background: #fff;
          border: 1px solid #e8e6e2;
          cursor: pointer;
          transition: all 0.3s ease;
          border-radius: 6px;
        }

        .sfh-fleet__tab:hover {
          border-color: #1a1a1a;
        }

        .sfh-fleet__tab--active {
          background: #1a1a1a;
          border-color: #1a1a1a;
        }

        .sfh-fleet__tab--active .sfh-fleet__tab-num,
        .sfh-fleet__tab--active .sfh-fleet__tab-model {
          color: #fff;
        }

        .sfh-fleet__tab-num {
          font-family: 'Share Tech Mono', monospace;
          font-size: 0.7rem;
          color: #999;
        }

        .sfh-fleet__tab-model {
          font-size: 0.8rem;
          font-weight: 600;
          text-transform: uppercase;
          letter-spacing: 0.05em;
          color: #1a1a1a;
        }

        .sfh-fleet__card {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 1.5rem;
          background: #fff;
          border-radius: 8px;
          overflow: hidden;
          border: 1px solid #e8e6e2;
        }

        .sfh-fleet__image {
          position: relative;
          min-height: 220px;
        }

        .sfh-fleet__image img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }

        .sfh-fleet__image-overlay {
          position: absolute;
          bottom: 0;
          left: 0;
          right: 0;
          padding: 1.5rem;
          background: linear-gradient(to top, rgba(0,0,0,0.7), transparent);
        }

        .sfh-fleet__model {
          font-size: 1.5rem;
          font-weight: 700;
          color: #fff;
          text-transform: uppercase;
        }

        .sfh-fleet__info {
          padding: 1.25rem;
          display: flex;
          flex-direction: column;
        }

        .sfh-fleet__specs {
          display: flex;
          align-items: center;
          gap: 1rem;
          margin-bottom: 0.75rem;
          padding-bottom: 0.75rem;
          border-bottom: 1px solid #e8e6e2;
        }

        .sfh-fleet__spec {
          text-align: center;
        }

        .sfh-fleet__spec-value {
          display: block;
          font-family: 'Share Tech Mono', monospace;
          font-size: 1.25rem;
          font-weight: 700;
          color: #1a1a1a;
        }

        .sfh-fleet__spec-label {
          font-size: 0.65rem;
          color: #888;
          text-transform: uppercase;
          letter-spacing: 0.1em;
        }

        .sfh-fleet__spec-divider {
          width: 1px;
          height: 30px;
          background: #e8e6e2;
        }

        .sfh-fleet__desc {
          color: #666;
          font-size: 0.85rem;
          line-height: 1.6;
          margin-bottom: 0.75rem;
        }

        .sfh-fleet__features {
          display: flex;
          flex-wrap: wrap;
          gap: 0.35rem;
        }

        .sfh-fleet__feature {
          padding: 0.4rem 0.8rem;
          background: #faf9f6;
          font-size: 0.7rem;
          color: #666;
          border-radius: 4px;
        }

        .sfh-fleet__price {
          margin-top: auto;
          padding-top: 1.5rem;
          border-top: 1px solid #e8e6e2;
        }

        .sfh-fleet__price-label {
          font-size: 0.7rem;
          color: #888;
          text-transform: uppercase;
          letter-spacing: 0.1em;
        }

        .sfh-fleet__price-value {
          font-family: 'Share Tech Mono', monospace;
          font-size: 2rem;
          font-weight: 700;
          color: #1a1a1a;
          margin: 0 0.25rem;
        }

        .sfh-fleet__price-unit {
          font-size: 0.9rem;
          color: #666;
        }

        /* ===== RATES ===== */
        .sfh-rates {
          padding: 2.5rem 1.5rem;
          background: #fff;
          position: relative;
        }

        .sfh-rates::before {
          content: '';
          position: absolute;
          top: 0;
          left: 50%;
          transform: translateX(-50%);
          width: min(80%, 600px);
          height: 1px;
          background: linear-gradient(90deg, transparent, #e0deda, transparent);
        }

        .sfh-rates__container {
          max-width: 900px;
          margin: 0 auto;
        }

        .sfh-rates__grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 0.75rem;
          margin-bottom: 1rem;
        }

        .sfh-rates__card {
          background: #faf9f6;
          padding: 1rem 1.25rem;
          text-align: center;
          border: 1px solid #e0deda;
          border-radius: 8px;
        }

        .sfh-rates__card-header {
          margin-bottom: 0.75rem;
        }

        .sfh-rates__card-model {
          display: block;
          font-size: 1rem;
          font-weight: 700;
          text-transform: uppercase;
          color: #1a1a1a;
          margin-bottom: 0.15rem;
        }

        .sfh-rates__card-seats {
          font-size: 0.65rem;
          color: #888;
        }

        .sfh-rates__card-price {
          margin-bottom: 0.75rem;
        }

        .sfh-rates__card-amount {
          font-family: 'Share Tech Mono', monospace;
          font-size: 1.75rem;
          font-weight: 700;
          color: #1a1a1a;
        }

        .sfh-rates__card-unit {
          font-size: 0.75rem;
          color: #666;
        }

        .sfh-rates__card-features {
          list-style: none;
          padding: 0;
          margin: 0 0 0.75rem;
        }

        .sfh-rates__card-features li {
          font-size: 0.7rem;
          color: #666;
          padding: 0.3rem 0;
          border-bottom: 1px solid #e8e6e2;
        }

        .sfh-rates__card-features li:last-child {
          border-bottom: none;
        }

        .sfh-rates__note {
          display: flex;
          align-items: flex-start;
          gap: 0.75rem;
          padding: 0.75rem 1rem;
          background: #faf9f6;
          border-radius: 8px;
        }

        .sfh-rates__note-icon {
          width: 18px;
          height: 18px;
          background: #1a1a1a;
          color: #fff;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 0.6rem;
          font-weight: 700;
          flex-shrink: 0;
        }

        .sfh-rates__note p {
          margin: 0;
          font-size: 0.7rem;
          color: #666;
          line-height: 1.5;
        }

        /* ===== REQUIREMENTS ===== */
        .sfh-requirements {
          padding: 5rem 2rem;
          background: #faf9f6;
          position: relative;
        }

        .sfh-requirements::before {
          content: '';
          position: absolute;
          top: 0;
          left: 50%;
          transform: translateX(-50%);
          width: min(80%, 600px);
          height: 1px;
          background: linear-gradient(90deg, transparent, #e0deda, transparent);
        }

        .sfh-requirements__container {
          max-width: 900px;
          margin: 0 auto;
        }

        .sfh-requirements__grid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 1.5rem;
          margin-bottom: 3rem;
        }

        .sfh-requirements__card {
          display: flex;
          gap: 1.25rem;
          background: #fff;
          padding: 1.5rem;
          border-left: 3px solid #1a1a1a;
          border-radius: 0 8px 8px 0;
        }

        .sfh-requirements__num {
          width: 44px;
          height: 44px;
          background: #1a1a1a;
          color: #fff;
          display: flex;
          align-items: center;
          justify-content: center;
          font-family: 'Share Tech Mono', monospace;
          font-size: 0.85rem;
          flex-shrink: 0;
        }

        .sfh-requirements__text h4 {
          margin: 0 0 0.5rem;
          font-size: 1rem;
          font-weight: 600;
        }

        .sfh-requirements__text p {
          margin: 0;
          font-size: 0.85rem;
          color: #666;
          line-height: 1.5;
        }

        .sfh-requirements__cta {
          text-align: center;
          padding: 2rem;
          background: #fff;
          border-radius: 8px;
          border: 1px solid #e8e6e2;
        }

        .sfh-requirements__cta p {
          margin: 0 0 1.5rem;
          color: #666;
        }

        /* ===== PROCESS ===== */
        .sfh-process {
          padding: 2rem 1.5rem;
          background: #fff;
          position: relative;
        }

        .sfh-process::before {
          content: '';
          position: absolute;
          top: 0;
          left: 50%;
          transform: translateX(-50%);
          width: min(80%, 600px);
          height: 1px;
          background: linear-gradient(90deg, transparent, #e0deda, transparent);
        }

        .sfh-process__container {
          max-width: 800px;
          margin: 0 auto;
        }

        .sfh-process__steps {
          display: flex;
          flex-direction: column;
          gap: 0;
        }

        .sfh-process__steps--horizontal {
          flex-direction: row;
          align-items: center;
          justify-content: center;
          gap: 0.75rem;
        }

        .sfh-process__steps--horizontal .sfh-process__step {
          flex-direction: column;
          align-items: center;
          text-align: center;
          border: 1px solid #e0deda;
          border-radius: 8px;
          padding: 1rem 1.25rem;
          flex: 1;
          min-height: 120px;
          display: flex;
          justify-content: flex-start;
        }

        .sfh-process__steps--horizontal .sfh-process__step--fly {
          flex: 1;
          border: 2px solid #1a1a1a;
          background: #faf9f6;
        }

        .sfh-process__steps--horizontal .sfh-process__step-num {
          width: 36px;
          height: 36px;
          font-size: 0.85rem;
          margin-bottom: 0.5rem;
        }

        .sfh-process__steps--horizontal .sfh-process__step-content h4 {
          font-size: 0.9rem;
          margin-bottom: 0.25rem;
        }

        .sfh-process__time {
          font-family: 'Share Tech Mono', monospace;
          font-size: 0.7rem;
          color: #888;
          background: #f0efec;
          padding: 0.2rem 0.5rem;
          border-radius: 4px;
          margin-top: 0.25rem;
          display: inline-block;
        }

        .sfh-process__arrow {
          color: #ccc;
          flex-shrink: 0;
        }

        .sfh-process__desc {
          margin: 0;
          font-size: 0.75rem;
          color: #666;
          line-height: 1.4;
          max-width: 160px;
        }

        .sfh-process__steps--horizontal .sfh-process__desc {
          text-align: center;
        }

        .sfh-process__step {
          display: flex;
          gap: 1.5rem;
          padding: 1.5rem;
          background: #faf9f6;
          border-left: 3px solid #1a1a1a;
          border-radius: 0 8px 8px 0;
        }

        .sfh-process__step-num {
          width: 50px;
          height: 50px;
          background: #1a1a1a;
          color: #fff;
          display: flex;
          align-items: center;
          justify-content: center;
          font-family: 'Share Tech Mono', monospace;
          font-size: 1rem;
          font-weight: 700;
          flex-shrink: 0;
        }

        .sfh-process__step-content h4 {
          margin: 0 0 0.5rem;
          font-size: 1.1rem;
          font-weight: 600;
        }

        .sfh-process__step-content p {
          margin: 0;
          font-size: 0.9rem;
          color: #666;
          line-height: 1.6;
        }

        .sfh-process__connector {
          width: 3px;
          height: 20px;
          background: #e8e6e2;
          margin-left: 24px;
        }

        /* ===== FAQ ===== */
        .sfh-faq {
          padding: 5rem 2rem;
          background: #faf9f6;
          position: relative;
        }

        .sfh-faq::before {
          content: '';
          position: absolute;
          top: 0;
          left: 50%;
          transform: translateX(-50%);
          width: min(80%, 600px);
          height: 1px;
          background: linear-gradient(90deg, transparent, #e0deda, transparent);
        }

        .sfh-faq__container {
          max-width: 800px;
          margin: 0 auto;
        }

        .sfh-faq__list {
          display: flex;
          flex-direction: column;
          gap: 0;
        }

        .sfh-faq__item {
          display: flex;
          gap: 1.5rem;
          padding: 1.25rem 0;
          border-bottom: 1px solid #e8e6e2;
          cursor: pointer;
          transition: background 0.2s ease;
          border-radius: 0;
        }

        .sfh-faq__item:hover {
          background: rgba(0,0,0,0.01);
        }

        .sfh-faq__item--open {
          background: rgba(0,0,0,0.02);
        }

        .sfh-faq__number {
          font-family: 'Share Tech Mono', monospace;
          font-size: 0.75rem;
          color: #ccc;
          flex-shrink: 0;
          padding-top: 0.1rem;
        }

        .sfh-faq__content {
          flex: 1;
        }

        .sfh-faq__content h4 {
          margin: 0;
          font-size: 1rem;
          font-weight: 600;
          display: flex;
          justify-content: space-between;
          align-items: center;
          gap: 1rem;
        }

        .sfh-faq__toggle {
          font-size: 1.25rem;
          font-weight: 300;
          color: #999;
          flex-shrink: 0;
        }

        .sfh-faq__answer {
          overflow: hidden;
        }

        .sfh-faq__answer p {
          margin: 0.75rem 0 0;
          color: #666;
          line-height: 1.7;
          font-size: 0.95rem;
        }

        /* ===== FAQ & LOCATION MERGED ===== */
        .sfh-faq-location {
          padding: 2.5rem 1.5rem;
          background: #faf9f6;
        }

        .sfh-faq-location__container {
          max-width: 1200px;
          margin: 0 auto;
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 2rem;
          align-items: start;
        }

        .sfh-faq-location__map {
          display: flex;
          flex-direction: column;
        }

        .sfh-faq-location__map .sfh-section-header {
          margin-bottom: 1rem;
        }

        .sfh-faq-location__map-frame {
          position: relative;
          border-radius: 8px;
          overflow: hidden;
          flex: 1;
          min-height: 350px;
        }

        .sfh-faq-location__map-frame iframe {
          position: absolute;
          inset: 0;
          width: 100%;
          height: 100%;
        }

        .sfh-faq-location__map-image {
          position: absolute;
          inset: 0;
          width: 100%;
          height: 100%;
          object-fit: cover;
          object-position: 25% 30%;
          transform: scale(1.5);
        }

        .sfh-faq-location__map-info {
          position: absolute;
          bottom: 0;
          left: 0;
          right: 0;
          padding: 1.25rem;
          background: rgba(26,26,26,0.95);
          color: #fff;
        }

        .sfh-faq-location__map-info h4 {
          margin: 0 0 0.25rem;
          font-size: 1rem;
          font-weight: 600;
          color: #fff;
        }

        .sfh-faq-location__map-info p {
          margin: 0 0 0.5rem;
          font-size: 0.8rem;
          color: rgba(255,255,255,0.7);
        }

        .sfh-faq-location__icao {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          font-family: 'Share Tech Mono', monospace;
          font-size: 0.7rem;
          background: rgba(255,255,255,0.15);
          padding: 0;
          border-radius: 4px;
          margin-right: 10px;
          height: 32px;
          padding: 0 0.75rem;
          box-sizing: border-box;
        }

        .sfh-faq-location__actions {
          display: flex;
          align-items: center;
          margin-top: 0.75rem;
        }

        .sfh-faq-location__map-info .sfh-btn--small {
          height: 32px;
          padding: 0 0.75rem;
          font-size: 0.7rem;
          color: #fff;
          border-color: #fff;
          display: inline-flex;
          align-items: center;
          box-sizing: border-box;
        }

        .sfh-faq-location__map-info .sfh-btn--small:hover {
          background: #fff;
          color: #1a1a1a;
        }

        .sfh-faq-location__faq {
          padding: 0;
        }

        .sfh-faq-location__faq .sfh-section-header {
          margin-bottom: 1rem;
        }

        .sfh-faq-location__faq .sfh-faq__list {
          gap: 0;
        }

        .sfh-faq-location__faq .sfh-faq__item {
          padding: 0.75rem 0;
        }

        .sfh-faq-location__faq .sfh-faq__content h4 {
          font-size: 0.9rem;
        }

        .sfh-faq-location__faq .sfh-faq__answer p {
          font-size: 0.85rem;
        }

        @media (max-width: 900px) {
          .sfh-faq-location__container {
            grid-template-columns: 1fr;
          }

          .sfh-faq-location__map {
            min-height: 300px;
          }
        }

        /* ===== CTA ===== */
        .sfh-cta {
          background: #1a1a1a;
          position: relative;
          overflow: hidden;
          border-radius: 0;
        }

        .sfh-cta__inner {
          display: grid;
          grid-template-columns: 40% 60%;
          min-height: 500px;
        }

        .sfh-cta__image {
          position: relative;
          overflow: hidden;
          border-radius: 0;
        }

        .sfh-cta__image img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }

        .sfh-cta__image-overlay {
          position: absolute;
          inset: 0;
          background: linear-gradient(90deg, rgba(26,26,26,0.3) 0%, transparent 50%);
          border-radius: 0;
        }

        .sfh-cta__content {
          padding: 3rem;
          display: flex;
          flex-direction: column;
          justify-content: center;
          color: #fff;
        }

        .sfh-cta__content .sfh-pre-text {
          color: rgba(255,255,255,0.5);
        }

        .sfh-cta__header h2 {
          font-size: clamp(1.75rem, 3.5vw, 2.5rem);
          font-weight: 700;
          text-transform: uppercase;
          line-height: 1.1;
          margin: 0 0 1.5rem;
        }

        .sfh-cta__header .sfh-text--dark { color: #fff; }
        .sfh-cta__header .sfh-text--mid { color: rgba(255,255,255,0.7); }
        .sfh-cta__header .sfh-text--light { color: rgba(255,255,255,0.5); }

        .sfh-cta__desc {
          color: rgba(255,255,255,0.7);
          font-size: 1rem;
          line-height: 1.7;
          margin-bottom: 2rem;
        }

        .sfh-cta__contact {
          display: flex;
          align-items: center;
          gap: 2rem;
          margin-bottom: 2rem;
          padding-bottom: 2rem;
          border-bottom: 1px solid rgba(255,255,255,0.15);
        }

        .sfh-cta__contact-item {
          text-decoration: none;
        }

        .sfh-cta__contact-label {
          display: block;
          font-size: 0.65rem;
          text-transform: uppercase;
          letter-spacing: 0.15em;
          color: rgba(255,255,255,0.5);
          margin-bottom: 0.25rem;
        }

        .sfh-cta__contact-value {
          display: block;
          font-family: 'Share Tech Mono', monospace;
          font-size: 1rem;
          color: #fff;
        }

        .sfh-cta__contact-divider {
          width: 1px;
          height: 40px;
          background: rgba(255,255,255,0.2);
        }

        .sfh-cta__buttons {
          display: flex;
          gap: 1rem;
        }

        .sfh-cta__buttons .sfh-btn--primary {
          background: #fff;
          color: #1a1a1a;
        }

        .sfh-cta__buttons .sfh-btn--primary:hover {
          background: #f0f0f0;
        }

        .sfh-cta__buttons .sfh-btn--outline {
          color: #fff;
          border-color: rgba(255,255,255,0.5);
        }

        .sfh-cta__buttons .sfh-btn--outline:hover {
          background: rgba(255,255,255,0.1);
          border-color: #fff;
        }

        /* ===== DESTINATIONS ===== */
        .sfh-destinations__collapsible-card {
          background: #faf9f6;
          border: 1px solid #e8e6e2;
          border-radius: 8px;
          overflow: hidden;
        }
        .sfh-destinations__toggle {
          width: 100%;
          padding: 1.5rem 2rem;
          background: none;
          border: none;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: space-between;
          text-align: left;
        }
        .sfh-destinations__toggle:hover {
          background: rgba(0,0,0,0.02);
        }
        .sfh-destinations__toggle h2 {
          font-size: clamp(1rem, 2vw, 1.4rem);
        }
        .sfh-destinations__toggle-icon {
          transition: transform 0.3s ease;
          color: #999;
          flex-shrink: 0;
        }
        .sfh-destinations__toggle-icon--open {
          transform: rotate(180deg);
        }
        .sfh-destinations__collapse {
          max-height: 0;
          overflow: hidden;
          transition: max-height 0.5s ease;
        }
        .sfh-destinations__collapse--open {
          max-height: 3000px;
        }
        .sfh-destinations__collapse > * {
          padding-left: 0.5rem;
          padding-right: 0.5rem;
        }

        .sfh-destinations {
          padding: 5rem 2rem;
          background: #fff;
          position: relative;
        }

        .sfh-destinations::before {
          content: '';
          position: absolute;
          top: 0;
          left: 50%;
          transform: translateX(-50%);
          width: min(80%, 600px);
          height: 1px;
          background: linear-gradient(90deg, transparent, #e0deda, transparent);
        }

        .sfh-destinations__container {
          max-width: 1000px;
          margin: 1.5rem auto 0;
        }

        .sfh-destinations__grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 1.5rem;
          padding-bottom: 20px;
        }

        .sfh-destinations__card {
          position: relative;
          overflow: hidden;
          border-radius: 8px;
          cursor: pointer;
        }

        .sfh-destinations__image {
          position: relative;
          aspect-ratio: 4/3;
        }

        .sfh-destinations__image img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          transition: transform 0.5s ease;
        }

        .sfh-destinations__card:hover .sfh-destinations__image img {
          transform: scale(1.05);
        }

        .sfh-destinations__overlay {
          position: absolute;
          top: 1rem;
          right: 1rem;
          background: rgba(255,255,255,0.95);
          padding: 0.5rem 0.75rem;
          border-radius: 4px;
        }

        .sfh-destinations__time {
          font-family: 'Share Tech Mono', monospace;
          font-size: 0.75rem;
          color: #1a1a1a;
        }

        .sfh-destinations__info {
          position: absolute;
          bottom: 0;
          left: 0;
          right: 0;
          padding: 1.5rem;
          background: linear-gradient(to top, rgba(0,0,0,0.8), transparent);
        }

        .sfh-destinations__type {
          display: block;
          font-size: 0.65rem;
          text-transform: uppercase;
          letter-spacing: 0.15em;
          color: rgba(255,255,255,0.7);
          margin-bottom: 0.25rem;
        }

        .sfh-destinations__info h4 {
          margin: 0;
          font-size: 1.25rem;
          color: #fff;
          font-weight: 600;
        }

        .sfh-destinations__filters {
          display: flex;
          justify-content: center;
          gap: 0.5rem;
          margin-bottom: 1.5rem;
        }

        .sfh-destinations__filter {
          padding: 0.5rem 1rem;
          font-family: 'Space Grotesk', sans-serif;
          font-size: 0.75rem;
          font-weight: 500;
          text-transform: uppercase;
          letter-spacing: 0.08em;
          background: #fff;
          border: 1px solid #e8e6e2;
          color: #666;
          cursor: pointer;
          transition: all 0.3s ease;
          border-radius: 4px;
        }

        .sfh-destinations__filter:hover {
          border-color: #1a1a1a;
          color: #1a1a1a;
        }

        .sfh-destinations__filter--active {
          background: #1a1a1a;
          border-color: #1a1a1a;
          color: #fff;
        }

        .sfh-destinations__load-more {
          display: flex;
          justify-content: center;
          margin-top: 1.5rem;
          margin-bottom: 12px;
        }

        .sfh-destinations__chevron {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 0.25rem;
          padding: 0.5rem 1.5rem;
          background: transparent;
          border: 1px solid #e8e6e2;
          color: #666;
          cursor: pointer;
          transition: all 0.3s ease;
          border-radius: 4px;
          font-family: 'Space Grotesk', sans-serif;
          font-size: 0.7rem;
          text-transform: uppercase;
          letter-spacing: 0.08em;
        }

        .sfh-destinations__chevron:hover {
          border-color: #1a1a1a;
          color: #1a1a1a;
        }

        .sfh-destinations__chevron svg {
          animation: bounceDown 1.5s ease-in-out infinite;
        }

        @keyframes bounceDown {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(4px); }
        }

        /* ===== SAFETY ===== */
        .sfh-safety {
          padding: 5rem 2rem;
          background: #faf9f6;
          position: relative;
        }

        .sfh-safety--compact {
          padding: 2rem 1.5rem;
        }

        .sfh-safety::before {
          content: '';
          position: absolute;
          top: 0;
          left: 50%;
          transform: translateX(-50%);
          width: min(80%, 600px);
          height: 1px;
          background: linear-gradient(90deg, transparent, #e0deda, transparent);
        }

        .sfh-safety__container {
          max-width: 1100px;
          margin: 0 auto;
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 4rem;
          align-items: center;
        }

        .sfh-safety__container--compact {
          display: block;
          max-width: 700px;
          text-align: center;
        }

        .sfh-safety__header h2 {
          font-size: clamp(1.75rem, 3.5vw, 2.5rem);
          margin: 0.5rem 0 1.5rem;
          text-transform: uppercase;
          font-weight: 700;
        }

        .sfh-safety__container--compact .sfh-safety__header h2 {
          margin-bottom: 0.75rem;
        }

        .sfh-safety__desc {
          color: #666;
          line-height: 1.8;
          margin-bottom: 2rem;
        }

        .sfh-safety__container--compact .sfh-safety__desc {
          margin-bottom: 0;
          font-size: 0.9rem;
        }

        .sfh-safety__features {
          display: flex;
          flex-direction: column;
          gap: 1rem;
        }

        .sfh-safety__feature {
          display: flex;
          gap: 1rem;
          padding: 1rem;
          background: #fff;
          border-left: 3px solid #1a1a1a;
          border-radius: 0 8px 8px 0;
        }

        .sfh-safety__feature-num {
          width: 36px;
          height: 36px;
          background: #1a1a1a;
          color: #fff;
          display: flex;
          align-items: center;
          justify-content: center;
          font-family: 'Share Tech Mono', monospace;
          font-size: 0.75rem;
          flex-shrink: 0;
        }

        .sfh-safety__feature h4 {
          margin: 0 0 0.25rem;
          font-size: 0.95rem;
        }

        .sfh-safety__feature p {
          margin: 0;
          font-size: 0.8rem;
          color: #888;
        }

        .sfh-safety__image {
          border-radius: 8px;
          overflow: hidden;
        }

        .sfh-safety__image img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }

        /* ===== HOURS ===== */
        .sfh-hours {
          padding: 5rem 2rem;
          background: #fff;
          position: relative;
        }

        .sfh-hours::before {
          content: '';
          position: absolute;
          top: 0;
          left: 50%;
          transform: translateX(-50%);
          width: min(80%, 600px);
          height: 1px;
          background: linear-gradient(90deg, transparent, #e0deda, transparent);
        }

        .sfh-hours__container {
          max-width: 900px;
          margin: 0 auto;
        }

        .sfh-hours__grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 1.5rem;
        }

        .sfh-hours__card {
          background: #faf9f6;
          padding: 2rem;
          text-align: center;
          border-left: 3px solid #1a1a1a;
          border-radius: 0 8px 8px 0;
        }

        .sfh-hours__card--special {
          border-left-color: #2563eb;
        }

        .sfh-hours__icon {
          margin-bottom: 1.5rem;
        }

        .sfh-hours__icon span {
          font-family: 'Share Tech Mono', monospace;
          font-size: 0.85rem;
          font-weight: 700;
          color: #1a1a1a;
          letter-spacing: 0.1em;
        }

        .sfh-hours__times {
          margin-bottom: 1rem;
        }

        .sfh-hours__time {
          display: block;
          font-family: 'Share Tech Mono', monospace;
          font-size: 1.25rem;
          color: #1a1a1a;
          margin-bottom: 0.25rem;
        }

        .sfh-hours__note {
          font-size: 0.7rem;
          color: #888;
        }

        .sfh-hours__special-note {
          margin: 0.5rem 0 0;
          font-size: 0.8rem;
          color: #2563eb;
        }

        /* ===== WEATHER ===== */
        .sfh-weather {
          padding: 5rem 2rem;
          background: #faf9f6;
          position: relative;
        }

        .sfh-weather::before {
          content: '';
          position: absolute;
          top: 0;
          left: 50%;
          transform: translateX(-50%);
          width: min(80%, 600px);
          height: 1px;
          background: linear-gradient(90deg, transparent, #e0deda, transparent);
        }

        .sfh-weather__container {
          max-width: 700px;
          margin: 0 auto;
        }

        .sfh-weather__table {
          background: #fff;
          border-radius: 8px;
          overflow: hidden;
          margin-bottom: 2rem;
        }

        .sfh-weather__row {
          display: grid;
          grid-template-columns: 1fr 1fr 1fr;
          border-bottom: 1px solid #e8e6e2;
        }

        .sfh-weather__row:last-child {
          border-bottom: none;
        }

        .sfh-weather__row--header {
          background: #1a1a1a;
        }

        .sfh-weather__row--header span {
          color: #fff;
          font-size: 0.75rem;
          text-transform: uppercase;
          letter-spacing: 0.1em;
        }

        .sfh-weather__row span {
          padding: 1rem 1.25rem;
          font-size: 0.9rem;
        }

        .sfh-weather__cell--label {
          font-weight: 600;
        }

        .sfh-weather__resources {
          display: flex;
          justify-content: center;
          gap: 1rem;
        }

        .sfh-weather__link {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          padding: 0.75rem 1.25rem;
          background: #fff;
          border: 1px solid #e8e6e2;
          border-radius: 8px;
          text-decoration: none;
          color: #1a1a1a;
          font-size: 0.85rem;
          transition: all 0.3s ease;
        }

        .sfh-weather__link:hover {
          border-color: #1a1a1a;
        }

        .sfh-weather__link-icon {
          font-size: 1rem;
        }

        /* ===== FUEL ===== */
        .sfh-fuel {
          padding: 5rem 2rem;
          background: #1a1a1a;
          position: relative;
        }

        .sfh-fuel__inner {
          max-width: 700px;
          margin: 0 auto;
          text-align: center;
        }

        .sfh-fuel__content h2 {
          font-size: clamp(1.75rem, 3.5vw, 2.5rem);
          margin: 0.5rem 0 1.5rem;
          text-transform: uppercase;
          font-weight: 700;
        }

        .sfh-fuel__content .sfh-pre-text {
          color: rgba(255,255,255,0.5);
        }

        .sfh-fuel__content .sfh-text--dark { color: #fff; }
        .sfh-fuel__content .sfh-text--mid { color: rgba(255,255,255,0.7); }

        .sfh-fuel__content p {
          color: rgba(255,255,255,0.7);
          line-height: 1.8;
          margin-bottom: 2rem;
        }

        .sfh-fuel__points {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 1rem;
          text-align: left;
        }

        .sfh-fuel__point {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          color: #fff;
          font-size: 0.9rem;
        }

        .sfh-fuel__point-icon {
          color: #4ade80;
          font-size: 1rem;
        }

        /* ===== INSURANCE ===== */
        .sfh-insurance {
          padding: 5rem 2rem;
          background: #fff;
          position: relative;
        }

        .sfh-insurance::before {
          content: '';
          position: absolute;
          top: 0;
          left: 50%;
          transform: translateX(-50%);
          width: min(80%, 600px);
          height: 1px;
          background: linear-gradient(90deg, transparent, #e0deda, transparent);
        }

        .sfh-insurance__container {
          max-width: 900px;
          margin: 0 auto;
        }

        .sfh-insurance__grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 1.5rem;
          margin-bottom: 2rem;
        }

        .sfh-insurance__card {
          background: #faf9f6;
          padding: 2rem;
          text-align: center;
          border-left: 3px solid #1a1a1a;
          border-radius: 0 8px 8px 0;
        }

        .sfh-insurance__card h4 {
          margin: 0 0 1rem;
          font-size: 0.85rem;
          text-transform: uppercase;
          letter-spacing: 0.05em;
          color: #666;
        }

        .sfh-insurance__value {
          display: block;
          font-family: 'Share Tech Mono', monospace;
          font-size: 2rem;
          font-weight: 700;
          color: #1a1a1a;
          margin-bottom: 0.5rem;
        }

        .sfh-insurance__desc {
          font-size: 0.8rem;
          color: #888;
          margin: 0;
        }

        .sfh-insurance__excess {
          background: #faf9f6;
          padding: 2rem;
          border-radius: 8px;
          text-align: center;
        }

        .sfh-insurance__excess h4 {
          margin: 0 0 1.5rem;
          font-size: 1rem;
        }

        .sfh-insurance__excess-grid {
          display: flex;
          justify-content: center;
          gap: 3rem;
          margin-bottom: 1rem;
        }

        .sfh-insurance__excess-item {
          text-align: center;
        }

        .sfh-insurance__excess-model {
          display: block;
          font-size: 0.75rem;
          text-transform: uppercase;
          letter-spacing: 0.1em;
          color: #888;
          margin-bottom: 0.25rem;
        }

        .sfh-insurance__excess-amount {
          font-family: 'Share Tech Mono', monospace;
          font-size: 1.25rem;
          font-weight: 700;
          color: #1a1a1a;
        }

        .sfh-insurance__excess-note {
          font-size: 0.8rem;
          color: #2563eb;
          margin: 0;
        }

        /* ===== CURRENCY ===== */
        .sfh-currency {
          padding: 5rem 2rem;
          background: #faf9f6;
          position: relative;
        }

        .sfh-currency::before {
          content: '';
          position: absolute;
          top: 0;
          left: 50%;
          transform: translateX(-50%);
          width: min(80%, 600px);
          height: 1px;
          background: linear-gradient(90deg, transparent, #e0deda, transparent);
        }

        .sfh-currency__container {
          max-width: 700px;
          margin: 0 auto;
        }

        .sfh-currency__content h2 {
          font-size: clamp(1.75rem, 3.5vw, 2.5rem);
          margin: 0.5rem 0 1.5rem;
          text-transform: uppercase;
          font-weight: 700;
        }

        .sfh-currency__desc {
          color: #666;
          line-height: 1.8;
          margin-bottom: 2rem;
        }

        .sfh-currency__requirements {
          display: flex;
          flex-direction: column;
          gap: 1rem;
          margin-bottom: 2rem;
        }

        .sfh-currency__req {
          background: #fff;
          padding: 1.5rem;
          border-left: 3px solid #1a1a1a;
          border-radius: 0 8px 8px 0;
        }

        .sfh-currency__req-header {
          display: flex;
          align-items: baseline;
          gap: 0.75rem;
          margin-bottom: 0.5rem;
        }

        .sfh-currency__req-hours {
          font-family: 'Share Tech Mono', monospace;
          font-size: 2rem;
          font-weight: 700;
          color: #1a1a1a;
        }

        .sfh-currency__req-label {
          font-size: 0.9rem;
          color: #666;
        }

        .sfh-currency__req p {
          margin: 0;
          font-size: 0.85rem;
          color: #888;
        }

        .sfh-currency__checkout {
          background: #fff;
          padding: 2rem;
          border-radius: 8px;
          text-align: center;
          border: 1px solid #e8e6e2;
        }

        .sfh-currency__checkout h4 {
          margin: 0 0 0.5rem;
        }

        .sfh-currency__checkout p {
          margin: 0 0 1.5rem;
          color: #666;
          font-size: 0.9rem;
        }

        /* ===== INTERNATIONAL ===== */
        .sfh-international {
          padding: 5rem 2rem;
          background: #fff;
          position: relative;
        }

        .sfh-international::before {
          content: '';
          position: absolute;
          top: 0;
          left: 50%;
          transform: translateX(-50%);
          width: min(80%, 600px);
          height: 1px;
          background: linear-gradient(90deg, transparent, #e0deda, transparent);
        }

        .sfh-international__container {
          max-width: 800px;
          margin: 0 auto;
        }

        .sfh-international__steps {
          display: flex;
          flex-direction: column;
          gap: 1rem;
          margin-bottom: 2rem;
        }

        .sfh-international__step {
          display: flex;
          gap: 1.5rem;
          padding: 1.5rem;
          background: #faf9f6;
          border-left: 3px solid #1a1a1a;
          border-radius: 0 8px 8px 0;
        }

        .sfh-international__step-num {
          width: 44px;
          height: 44px;
          background: #1a1a1a;
          color: #fff;
          display: flex;
          align-items: center;
          justify-content: center;
          font-family: 'Share Tech Mono', monospace;
          font-size: 0.85rem;
          flex-shrink: 0;
        }

        .sfh-international__step-content h4 {
          margin: 0 0 0.5rem;
          font-size: 1rem;
        }

        .sfh-international__step-content p {
          margin: 0;
          font-size: 0.85rem;
          color: #666;
        }

        .sfh-international__popular {
          background: #faf9f6;
          padding: 2rem;
          border-radius: 8px;
          text-align: center;
        }

        .sfh-international__popular h4 {
          margin: 0 0 1.5rem;
          font-size: 0.85rem;
          text-transform: uppercase;
          letter-spacing: 0.1em;
          color: #666;
        }

        .sfh-international__destinations {
          display: flex;
          flex-wrap: wrap;
          justify-content: center;
          gap: 0.75rem;
        }

        .sfh-international__destinations span {
          padding: 0.5rem 1rem;
          background: #fff;
          border: 1px solid #e8e6e2;
          border-radius: 4px;
          font-size: 0.85rem;
        }

        /* ===== TESTIMONIALS ===== */
        .sfh-testimonials {
          padding: 5rem 2rem;
          background: #faf9f6;
          position: relative;
        }

        .sfh-testimonials::before {
          content: '';
          position: absolute;
          top: 0;
          left: 50%;
          transform: translateX(-50%);
          width: min(80%, 600px);
          height: 1px;
          background: linear-gradient(90deg, transparent, #e0deda, transparent);
        }

        .sfh-testimonials__container {
          max-width: 1000px;
          margin: 0 auto;
        }

        .sfh-testimonials__grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 1.5rem;
        }

        .sfh-testimonials__card {
          background: #fff;
          padding: 2rem;
          border-left: 3px solid #1a1a1a;
          border-radius: 0 8px 8px 0;
          position: relative;
        }

        .sfh-testimonials__quote {
          position: absolute;
          top: 0.5rem;
          left: 1.5rem;
          font-family: Georgia, serif;
          font-size: 4rem;
          color: #e8e6e2;
          line-height: 1;
        }

        .sfh-testimonials__card p {
          margin: 0 0 1.5rem;
          color: #666;
          line-height: 1.7;
          font-size: 0.95rem;
          position: relative;
          z-index: 1;
        }

        .sfh-testimonials__author {
          display: flex;
          flex-direction: column;
          gap: 0.25rem;
        }

        .sfh-testimonials__name {
          font-weight: 600;
          color: #1a1a1a;
        }

        .sfh-testimonials__role {
          font-size: 0.8rem;
          color: #888;
        }

        .sfh-testimonials__hours {
          font-family: 'Share Tech Mono', monospace;
          font-size: 0.75rem;
          color: #999;
        }

        /* ===== GALLERY ===== */
        .sfh-gallery {
          padding: 5rem 2rem;
          background: #fff;
          position: relative;
        }

        .sfh-gallery::before {
          content: '';
          position: absolute;
          top: 0;
          left: 50%;
          transform: translateX(-50%);
          width: min(80%, 600px);
          height: 1px;
          background: linear-gradient(90deg, transparent, #e0deda, transparent);
        }

        .sfh-gallery__container {
          max-width: 1100px;
          margin: 0 auto;
        }

        .sfh-gallery__grid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 1rem;
        }

        .sfh-gallery__item {
          aspect-ratio: 1;
          overflow: hidden;
          border-radius: 8px;
        }

        .sfh-gallery__item img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          transition: transform 0.5s ease;
        }

        .sfh-gallery__item:hover img {
          transform: scale(1.1);
        }

        /* ===== COMPARISON ===== */
        .sfh-comparison {
          padding: 5rem 2rem;
          background: #faf9f6;
          position: relative;
        }

        .sfh-comparison::before {
          content: '';
          position: absolute;
          top: 0;
          left: 50%;
          transform: translateX(-50%);
          width: min(80%, 600px);
          height: 1px;
          background: linear-gradient(90deg, transparent, #e0deda, transparent);
        }

        .sfh-comparison__container {
          max-width: 800px;
          margin: 0 auto;
        }

        .sfh-comparison__table {
          background: #fff;
          border-radius: 8px;
          overflow: hidden;
        }

        .sfh-comparison__header,
        .sfh-comparison__row {
          display: grid;
          grid-template-columns: 1.5fr 1fr 1fr 1fr;
        }

        .sfh-comparison__header {
          background: #1a1a1a;
        }

        .sfh-comparison__header .sfh-comparison__cell {
          color: #fff;
          font-size: 0.85rem;
          font-weight: 600;
          text-transform: uppercase;
        }

        .sfh-comparison__row {
          border-bottom: 1px solid #e8e6e2;
        }

        .sfh-comparison__row:last-child {
          border-bottom: none;
        }

        .sfh-comparison__cell {
          padding: 1rem 1.25rem;
          font-size: 0.9rem;
        }

        .sfh-comparison__cell--label {
          font-weight: 600;
          color: #1a1a1a;
        }

        /* ===== ADDONS ===== */
        .sfh-addons {
          padding: 5rem 2rem;
          background: #fff;
          position: relative;
        }

        .sfh-addons::before {
          content: '';
          position: absolute;
          top: 0;
          left: 50%;
          transform: translateX(-50%);
          width: min(80%, 600px);
          height: 1px;
          background: linear-gradient(90deg, transparent, #e0deda, transparent);
        }

        .sfh-addons__container {
          max-width: 900px;
          margin: 0 auto;
        }

        .sfh-addons__grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 1.5rem;
        }

        .sfh-addons__card {
          background: #faf9f6;
          padding: 1.5rem;
          border-left: 3px solid #1a1a1a;
          border-radius: 0 8px 8px 0;
        }

        .sfh-addons__header {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          margin-bottom: 0.75rem;
        }

        .sfh-addons__header h4 {
          margin: 0;
          font-size: 0.95rem;
        }

        .sfh-addons__price {
          font-family: 'Share Tech Mono', monospace;
          font-size: 0.85rem;
          color: #1a1a1a;
          font-weight: 700;
        }

        .sfh-addons__card p {
          margin: 0;
          font-size: 0.8rem;
          color: #888;
        }

        /* ===== VOUCHERS ===== */
        .sfh-vouchers {
          padding: 0;
          background: #faf9f6;
          position: relative;
        }

        .sfh-vouchers__inner {
          display: grid;
          grid-template-columns: 1fr 1fr;
        }

        .sfh-vouchers__image {
          height: 500px;
        }

        .sfh-vouchers__image img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }

        .sfh-vouchers__content {
          padding: 4rem;
          display: flex;
          flex-direction: column;
          justify-content: center;
        }

        .sfh-vouchers__content h2 {
          font-size: clamp(1.75rem, 3.5vw, 2.5rem);
          margin: 0.5rem 0 1.5rem;
          text-transform: uppercase;
          font-weight: 700;
        }

        .sfh-vouchers__content p {
          color: #666;
          line-height: 1.8;
          margin-bottom: 2rem;
        }

        .sfh-vouchers__options {
          display: flex;
          gap: 1.5rem;
          margin-bottom: 2rem;
        }

        .sfh-vouchers__option {
          text-align: center;
          padding: 1rem 1.5rem;
          background: #fff;
          border: 1px solid #e8e6e2;
          border-radius: 8px;
        }

        .sfh-vouchers__amount {
          display: block;
          font-family: 'Share Tech Mono', monospace;
          font-size: 1.5rem;
          font-weight: 700;
          color: #1a1a1a;
        }

        .sfh-vouchers__desc {
          font-size: 0.75rem;
          color: #888;
        }

        /* ===== BLOCK BOOKING ===== */
        .sfh-block {
          padding: 5rem 2rem;
          background: #fff;
          position: relative;
        }

        .sfh-block--compact {
          padding: 1.5rem;
          background: #f5f4f0;
        }

        .sfh-block--compact::before {
          display: none;
        }

        .sfh-block__compact-content {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 1.5rem;
          max-width: 900px;
          margin: 0 auto;
        }

        .sfh-block__compact-text h3 {
          margin: 0 0 0.25rem;
          font-size: 1rem;
          font-weight: 600;
        }

        .sfh-block__compact-text p {
          margin: 0;
          font-size: 0.85rem;
          color: #666;
        }

        .sfh-block__compact-text strong {
          color: #1a1a1a;
        }

        @media (max-width: 600px) {
          .sfh-block__compact-content {
            flex-direction: column;
            text-align: center;
          }
        }

        .sfh-block::before {
          content: '';
          position: absolute;
          top: 0;
          left: 50%;
          transform: translateX(-50%);
          width: min(80%, 600px);
          height: 1px;
          background: linear-gradient(90deg, transparent, #e0deda, transparent);
        }

        .sfh-block__container {
          max-width: 900px;
          margin: 0 auto;
        }

        .sfh-block__tiers {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 1.5rem;
        }

        .sfh-block__tier {
          background: #faf9f6;
          padding: 2rem;
          text-align: center;
          border-radius: 8px;
          position: relative;
        }

        .sfh-block__tier--popular {
          background: #1a1a1a;
          color: #fff;
        }

        .sfh-block__tier-badge {
          position: absolute;
          top: -10px;
          left: 50%;
          transform: translateX(-50%);
          padding: 0.25rem 0.75rem;
          background: #e8e6e2;
          font-size: 0.65rem;
          text-transform: uppercase;
          letter-spacing: 0.1em;
          color: #666;
          border-radius: 4px;
        }

        .sfh-block__tier--popular .sfh-block__tier-badge {
          background: #2563eb;
          color: #fff;
        }

        .sfh-block__tier-hours {
          font-size: 0.85rem;
          color: #888;
          margin: 1rem 0 0.5rem;
        }

        .sfh-block__tier--popular .sfh-block__tier-hours {
          color: rgba(255,255,255,0.7);
        }

        .sfh-block__tier-discount {
          font-family: 'Share Tech Mono', monospace;
          font-size: 2rem;
          font-weight: 700;
          margin-bottom: 1.5rem;
        }

        .sfh-block__tier ul {
          list-style: none;
          padding: 0;
          margin: 0;
        }

        .sfh-block__tier li {
          padding: 0.5rem 0;
          font-size: 0.85rem;
          border-bottom: 1px solid #e8e6e2;
        }

        .sfh-block__tier--popular li {
          border-color: rgba(255,255,255,0.2);
        }

        .sfh-block__tier li:last-child {
          border-bottom: none;
        }

        /* ===== RESOURCES ===== */
        .sfh-resources {
          padding: 5rem 2rem;
          background: #faf9f6;
          position: relative;
        }

        .sfh-resources::before {
          content: '';
          position: absolute;
          top: 0;
          left: 50%;
          transform: translateX(-50%);
          width: min(80%, 600px);
          height: 1px;
          background: linear-gradient(90deg, transparent, #e0deda, transparent);
        }

        .sfh-resources__container {
          max-width: 900px;
          margin: 0 auto;
        }

        .sfh-resources__grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 1.5rem;
        }

        .sfh-resources__card {
          background: #fff;
          padding: 2rem;
          text-align: center;
          border-radius: 8px;
          text-decoration: none;
          transition: all 0.3s ease;
          border: 1px solid #e8e6e2;
        }

        .sfh-resources__card:hover {
          border-color: #1a1a1a;
          transform: translateY(-2px);
        }

        .sfh-resources__icon {
          font-size: 2rem;
          margin-bottom: 1rem;
        }

        .sfh-resources__card h4 {
          margin: 0 0 0.5rem;
          color: #1a1a1a;
          font-size: 1rem;
        }

        .sfh-resources__card p {
          margin: 0;
          font-size: 0.8rem;
          color: #888;
        }

        /* ===== PARTNERS ===== */
        .sfh-partners {
          padding: 5rem 2rem;
          background: #fff;
          position: relative;
        }

        .sfh-partners::before {
          content: '';
          position: absolute;
          top: 0;
          left: 50%;
          transform: translateX(-50%);
          width: min(80%, 600px);
          height: 1px;
          background: linear-gradient(90deg, transparent, #e0deda, transparent);
        }

        .sfh-partners__container {
          max-width: 900px;
          margin: 0 auto;
        }

        .sfh-partners__grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 1.5rem;
        }

        .sfh-partners__card {
          background: #faf9f6;
          padding: 1.5rem;
          text-align: center;
          border-left: 3px solid #1a1a1a;
          border-radius: 0 8px 8px 0;
        }

        .sfh-partners__card h4 {
          margin: 0 0 0.25rem;
          font-size: 1.1rem;
        }

        .sfh-partners__type {
          display: block;
          font-size: 0.75rem;
          color: #888;
          margin-bottom: 0.75rem;
        }

        .sfh-partners__benefit {
          display: inline-block;
          padding: 0.35rem 0.75rem;
          background: #1a1a1a;
          color: #fff;
          font-size: 0.7rem;
          text-transform: uppercase;
          letter-spacing: 0.05em;
          border-radius: 4px;
        }

        /* ===== EXPERIENCE ===== */
        .sfh-experience {
          padding: 5rem 2rem;
          background: #1a1a1a;
          position: relative;
        }

        .sfh-experience__inner {
          max-width: 1000px;
          margin: 0 auto;
        }

        .sfh-experience__header {
          text-align: center;
          margin-bottom: 3rem;
        }

        .sfh-experience__header .sfh-pre-text {
          color: rgba(255,255,255,0.5);
        }

        .sfh-experience__header h2 {
          font-size: clamp(1.75rem, 3.5vw, 2.5rem);
          text-transform: uppercase;
          font-weight: 700;
          margin: 0.5rem 0;
        }

        .sfh-experience__header .sfh-text--dark { color: #fff; }
        .sfh-experience__header .sfh-text--mid { color: rgba(255,255,255,0.7); }

        .sfh-experience__stats {
          display: grid;
          grid-template-columns: repeat(6, 1fr);
          gap: 2rem;
        }

        .sfh-experience__stat {
          text-align: center;
        }

        .sfh-experience__value {
          display: block;
          font-family: 'Share Tech Mono', monospace;
          font-size: 2rem;
          font-weight: 700;
          color: #fff;
          margin-bottom: 0.5rem;
        }

        .sfh-experience__label {
          font-size: 0.75rem;
          text-transform: uppercase;
          letter-spacing: 0.1em;
          color: rgba(255,255,255,0.6);
        }

        /* ===== TEAM ===== */
        .sfh-team {
          padding: 5rem 2rem;
          background: #faf9f6;
          position: relative;
        }

        .sfh-team::before {
          content: '';
          position: absolute;
          top: 0;
          left: 50%;
          transform: translateX(-50%);
          width: min(80%, 600px);
          height: 1px;
          background: linear-gradient(90deg, transparent, #e0deda, transparent);
        }

        .sfh-team__container {
          max-width: 900px;
          margin: 0 auto;
        }

        .sfh-team__grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 1.5rem;
        }

        .sfh-team__card {
          background: #fff;
          padding: 2rem;
          text-align: center;
          border-radius: 8px;
        }

        .sfh-team__avatar {
          width: 60px;
          height: 60px;
          background: #1a1a1a;
          color: #fff;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-family: 'Share Tech Mono', monospace;
          font-size: 1.25rem;
          margin: 0 auto 1rem;
        }

        .sfh-team__card h4 {
          margin: 0 0 0.25rem;
          font-size: 1rem;
        }

        .sfh-team__role {
          display: block;
          font-size: 0.75rem;
          text-transform: uppercase;
          letter-spacing: 0.1em;
          color: #2563eb;
          margin-bottom: 0.75rem;
        }

        .sfh-team__card p {
          margin: 0;
          font-size: 0.85rem;
          color: #888;
        }

        /* Compact Team Styles */
        .sfh-team--compact {
          padding: 1.5rem 2rem;
          background: #f5f4f1;
        }

        .sfh-team--compact::before {
          display: none;
        }

        .sfh-team--compact .sfh-team__container {
          max-width: 1000px;
        }

        .sfh-team__inline {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 2rem;
          flex-wrap: wrap;
        }

        .sfh-team__label {
          font-family: 'Share Tech Mono', monospace;
          font-size: 0.7rem;
          text-transform: uppercase;
          letter-spacing: 0.15em;
          color: #888;
        }

        .sfh-team__members {
          display: flex;
          gap: 2rem;
          flex-wrap: wrap;
          flex: 1;
          justify-content: center;
        }

        .sfh-team__member-compact {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 0.15rem;
        }

        .sfh-team__name {
          font-size: 0.85rem;
          font-weight: 600;
          color: #1a1a1a;
        }

        .sfh-team__role-compact {
          font-size: 0.65rem;
          text-transform: uppercase;
          letter-spacing: 0.05em;
          color: #888;
        }

        /* ===== CONTACT FORM ===== */
        .sfh-contact {
          padding: 5rem 2rem;
          background: #fff;
          position: relative;
        }

        .sfh-contact::before {
          content: '';
          position: absolute;
          top: 0;
          left: 50%;
          transform: translateX(-50%);
          width: min(80%, 600px);
          height: 1px;
          background: linear-gradient(90deg, transparent, #e0deda, transparent);
        }

        .sfh-contact__container {
          max-width: 1000px;
          margin: 0 auto;
          display: grid;
          grid-template-columns: 1fr 1.5fr;
          gap: 4rem;
        }

        .sfh-contact__content h2 {
          font-size: clamp(1.75rem, 3.5vw, 2.5rem);
          margin: 0.5rem 0 1.5rem;
          text-transform: uppercase;
          font-weight: 700;
        }

        .sfh-contact__content p {
          color: #666;
          line-height: 1.7;
          margin-bottom: 2rem;
        }

        .sfh-contact__details {
          display: flex;
          flex-direction: column;
          gap: 1rem;
        }

        .sfh-contact__detail {
          padding-bottom: 1rem;
          border-bottom: 1px solid #e8e6e2;
        }

        .sfh-contact__detail-label {
          display: block;
          font-size: 0.7rem;
          text-transform: uppercase;
          letter-spacing: 0.15em;
          color: #999;
          margin-bottom: 0.25rem;
        }

        .sfh-contact__detail a,
        .sfh-contact__detail span {
          font-family: 'Share Tech Mono', monospace;
          font-size: 0.95rem;
          color: #1a1a1a;
          text-decoration: none;
        }

        .sfh-contact__form {
          background: #faf9f6;
          padding: 2rem;
          border-radius: 8px;
        }

        .sfh-contact__row {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 1rem;
          margin-bottom: 1rem;
        }

        .sfh-contact__field {
          margin-bottom: 1rem;
        }

        .sfh-contact__field label {
          display: block;
          font-size: 0.75rem;
          text-transform: uppercase;
          letter-spacing: 0.1em;
          color: #666;
          margin-bottom: 0.5rem;
        }

        .sfh-contact__field input,
        .sfh-contact__field select,
        .sfh-contact__field textarea {
          width: 100%;
          padding: 0.75rem 1rem;
          border: 1px solid #e8e6e2;
          border-radius: 4px;
          font-family: inherit;
          font-size: 0.9rem;
          background: #fff;
          transition: border-color 0.3s ease;
        }

        .sfh-contact__field input:focus,
        .sfh-contact__field select:focus,
        .sfh-contact__field textarea:focus {
          outline: none;
          border-color: #1a1a1a;
        }

        .sfh-contact__field textarea {
          resize: vertical;
        }

        /* ===== LOCATION ===== */
        .sfh-location {
          background: #faf9f6;
          position: relative;
        }

        .sfh-location__inner {
          display: grid;
          grid-template-columns: 1fr 1fr;
        }

        .sfh-location__map {
          min-height: 400px;
        }

        .sfh-location__map iframe {
          width: 100%;
          height: 100%;
        }

        .sfh-location__content {
          padding: 4rem;
          display: flex;
          flex-direction: column;
          justify-content: center;
        }

        .sfh-location__content h2 {
          font-size: clamp(1.75rem, 3.5vw, 2.5rem);
          margin: 0.5rem 0 1.5rem;
          text-transform: uppercase;
          font-weight: 700;
        }

        .sfh-location__content p {
          color: #666;
          line-height: 1.7;
          margin-bottom: 2rem;
        }

        .sfh-location__info {
          display: flex;
          gap: 2rem;
          margin-bottom: 2rem;
        }

        .sfh-location__info-item {
          display: flex;
          flex-direction: column;
          gap: 0.25rem;
        }

        .sfh-location__info-label {
          font-size: 0.7rem;
          text-transform: uppercase;
          letter-spacing: 0.15em;
          color: #999;
        }

        .sfh-location__info-item span:last-child {
          font-size: 0.9rem;
          color: #1a1a1a;
        }

        /* ===== FINAL CTA ===== */
        .sfh-final-cta {
          padding: 5rem 2rem;
          background: #faf9f6;
          text-align: center;
          position: relative;
        }

        .sfh-final-cta::before {
          content: '';
          position: absolute;
          top: 0;
          left: 50%;
          transform: translateX(-50%);
          width: min(80%, 600px);
          height: 1px;
          background: linear-gradient(90deg, transparent, #e0deda, transparent);
        }

        .sfh-final-cta__container {
          max-width: 600px;
          margin: 0 auto;
        }

        .sfh-final-cta h2 {
          font-size: clamp(2rem, 4vw, 3rem);
          margin: 0.5rem 0 1.5rem;
          text-transform: uppercase;
          font-weight: 700;
        }

        .sfh-final-cta p {
          color: #666;
          line-height: 1.7;
          margin-bottom: 2rem;
        }

        .sfh-final-cta__buttons {
          display: flex;
          justify-content: center;
          gap: 1rem;
        }

        /* ===== RESPONSIVE ===== */
        @media (max-width: 1024px) {
          .sfh-intro__container {
            grid-template-columns: 1fr;
          }
          .sfh-intro__header {
            text-align: center;
          }
          .sfh-intro__benefits {
            justify-content: center;
            gap: 1rem;
          }

          .sfh-fleet__card {
            grid-template-columns: 1fr;
          }

          .sfh-fleet__image {
            min-height: 250px;
          }

          .sfh-cta__inner {
            grid-template-columns: 1fr;
          }

          .sfh-cta__image {
            height: 250px;
          }

          .sfh-destinations__grid {
            grid-template-columns: repeat(2, 1fr);
          }

          .sfh-safety__container {
            grid-template-columns: 1fr;
            gap: 2rem;
          }

          .sfh-safety__image {
            order: -1;
            height: 300px;
          }

          .sfh-hours__grid {
            grid-template-columns: 1fr;
          }

          .sfh-insurance__grid {
            grid-template-columns: 1fr;
          }

          .sfh-testimonials__grid {
            grid-template-columns: 1fr;
          }

          .sfh-gallery__grid {
            grid-template-columns: repeat(2, 1fr);
          }

          .sfh-addons__grid {
            grid-template-columns: repeat(2, 1fr);
          }

          .sfh-vouchers__inner {
            grid-template-columns: 1fr;
          }

          .sfh-vouchers__image {
            height: 300px;
          }

          .sfh-block__tiers {
            grid-template-columns: 1fr;
          }

          .sfh-resources__grid {
            grid-template-columns: repeat(2, 1fr);
          }

          .sfh-partners__grid {
            grid-template-columns: repeat(2, 1fr);
          }

          .sfh-experience__stats {
            grid-template-columns: repeat(3, 1fr);
          }

          .sfh-team__grid {
            grid-template-columns: 1fr;
          }

          .sfh-contact__container {
            grid-template-columns: 1fr;
            gap: 2rem;
          }

          .sfh-location__inner {
            grid-template-columns: 1fr;
          }

          .sfh-location__map {
            height: 300px;
          }
        }

        @media (max-width: 768px) {
          .sfh-hero__content {
            padding: 5rem 2rem 2rem;
            justify-content: center;
          }

          .sfh-hero__left {
            text-align: center;
            max-width: 100%;
          }

          .sfh-hero__headline {
            align-items: center;
          }

          .sfh-hero__divider-line {
            margin: 1.5rem auto;
          }

          .sfh-hero__sub {
            margin: 0 auto 2rem;
            text-align: center;
          }

          .sfh-hero__stats {
            justify-content: center;
          }

          .sfh-hero__overlay {
            background: linear-gradient(180deg, rgba(250,249,246,0.97) 0%, rgba(250,249,246,0.92) 60%, rgba(250,249,246,0.7) 100%);
          }

          .sfh-intro__benefits {
            gap: 1.5rem;
          }

          .sfh-fleet__selector {
            flex-direction: column;
          }

          .sfh-rates__grid {
            grid-template-columns: 1fr;
          }

          .sfh-requirements__grid {
            grid-template-columns: 1fr;
          }

          .sfh-cta__contact {
            flex-direction: column;
            gap: 1rem;
          }

          .sfh-cta__contact-divider {
            width: 40px;
            height: 1px;
          }

          .sfh-cta__buttons {
            flex-direction: column;
          }

          .sfh-cta__buttons .sfh-btn {
            width: 100%;
          }

          .sfh-destinations__grid {
            grid-template-columns: repeat(2, 1fr);
          }

          .sfh-process__steps--horizontal {
            flex-direction: column;
            gap: 0.5rem;
          }

          .sfh-process__steps--horizontal .sfh-process__step {
            flex-direction: row;
            max-width: 100%;
            text-align: left;
            min-height: auto;
          }

          .sfh-process__steps--horizontal .sfh-process__step--fly {
            max-width: 100%;
          }

          .sfh-process__arrow {
            display: none;
          }

          .sfh-destinations__filters {
            flex-wrap: wrap;
          }

          .sfh-fuel__points {
            grid-template-columns: 1fr;
          }

          .sfh-insurance__excess-grid {
            flex-direction: column;
            gap: 1rem;
          }

          .sfh-comparison__header,
          .sfh-comparison__row {
            grid-template-columns: 1.2fr 1fr 1fr 1fr;
          }

          .sfh-comparison__cell {
            padding: 0.75rem;
            font-size: 0.8rem;
          }

          .sfh-addons__grid {
            grid-template-columns: 1fr;
          }

          .sfh-vouchers__content {
            padding: 2rem;
          }

          .sfh-vouchers__options {
            flex-direction: column;
            gap: 1rem;
          }

          .sfh-resources__grid {
            grid-template-columns: 1fr;
          }

          .sfh-partners__grid {
            grid-template-columns: 1fr;
          }

          .sfh-experience__stats {
            grid-template-columns: repeat(2, 1fr);
            gap: 1.5rem;
          }

          .sfh-contact__row {
            grid-template-columns: 1fr;
          }

          .sfh-location__content {
            padding: 2rem;
          }

          .sfh-location__info {
            flex-direction: column;
            gap: 1rem;
          }

          .sfh-final-cta__buttons {
            flex-direction: column;
          }

          .sfh-gallery__grid {
            grid-template-columns: repeat(2, 1fr);
          }
        }

        @media (max-width: 480px) {
          .sfh-experience__stats {
            grid-template-columns: repeat(2, 1fr);
          }

          .sfh-experience__value {
            font-size: 1.5rem;
          }

          .sfh-comparison__header,
          .sfh-comparison__row {
            grid-template-columns: 1fr 0.8fr 0.8fr 0.8fr;
          }

          .sfh-comparison__cell {
            padding: 0.5rem;
            font-size: 0.7rem;
          }

          .sfh-gallery__grid {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </div>
  );
}

export default SelfFlyHire;

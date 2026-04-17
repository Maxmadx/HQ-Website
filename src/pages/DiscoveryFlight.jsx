/**
 * DISCOVERY FLIGHT PAGE - The Most Important Page
 *
 * Top of funnel for all customers. Must justify the price point
 * and sell the dream of flight.
 *
 * Brand: Luxury Minimal Aviation
 * Typography: Space Grotesk + Share Tech Mono
 * Colors: #faf9f6 (warm white), #1a1a1a (charcoal)
 */

import React, { useRef, useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { usePricing } from '../hooks/usePricing';
import { usePageImages } from '../hooks/usePageImages';
import { useCmsHighlight } from '../hooks/useCmsHighlight';
import { usePageText } from '../hooks/usePageText';
import { useFaqs } from '../hooks/useFaqs';
import { motion, useInView, useScroll, useTransform, AnimatePresence } from 'framer-motion';

// Import styles
import '../assets/css/main.css';
import '../assets/css/components.css';

// Import FooterMinimal
import FooterMinimal from '../components/FooterMinimal';

// ============================================================================
// REVEAL COMPONENT
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
// ANIMATED NUMBER
// ============================================================================
function AnimatedNumber({ value, suffix = '' }) {
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

  return <span ref={ref}>{count}{suffix}</span>;
}

// ============================================================================
// HEADER WITH SPOTLIGHT ANIMATION (from PPL page)
// ============================================================================
function DiscoveryHeader() {
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
              <li><Link to="/training/trial-lessons" onClick={closeMenu}>Discovery Flights</Link></li>
              <li><Link to="/training/ppl" onClick={closeMenu}>Private Pilot License</Link></li>
              <li><Link to="/training/type-rating" onClick={closeMenu}>Type Rating</Link></li>
              <li><Link to="/training/faq" onClick={closeMenu}>Training FAQ</Link></li>
            </ul>
          </div>
          <div className="hq-menu-section">
            <h3>Services</h3>
            <ul>
              <li><Link to="/maintenance" onClick={closeMenu}>Maintenance</Link></li>
              <li><Link to="/expeditions" onClick={closeMenu}>Expeditions</Link></li>
              <li><Link to="/self-fly-hire" onClick={closeMenu}>Self-Fly Hire</Link></li>
            </ul>
          </div>
          <div className="hq-menu-section">
            <h3>Contact</h3>
            <ul>
              <li><Link to="/contact" onClick={closeMenu}>Contact Us</Link></li>
              <li><Link to="/blog" onClick={closeMenu}>Blog</Link></li>
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

// ============================================================================
// DATA
// ============================================================================
const aircraftData = [
  {
    id: 'r22',
    name: 'ROBINSON R22',
    tagline: 'The 2-Seat Trainer',
    description: 'Nimble and responsive. The perfect introduction to helicopter flight.',
    image: '/assets/images/new-aircraft/r22/r22-red-volcano-front-alpha-v3.png',
    seats: 2,
    featured: false,
    pricing: { 30: 180, 60: 360 },
  },
  {
    id: 'r44',
    name: 'ROBINSON R44',
    tagline: 'The 4-Seat Icon',
    description: 'Bring passengers along. The world\'s most popular helicopter.',
    image: '/assets/images/new-aircraft/r44/raven-ii-front-alpha.png',
    seats: 4,
    featured: false,
    pricing: { 30: 305, 60: 605 },
  },
  {
    id: 'r66',
    name: 'ROBINSON R66',
    tagline: 'Turbine Power',
    description: 'Experience the smooth power of a turbine engine.',
    image: '/assets/images/new-aircraft/r66/blue-r66-palo-verde-front-v4.png',
    seats: 5,
    featured: false,
    pricing: { 30: 450, 60: 850 },
  },
];

const testimonials = [
  {
    quote: "An absolutely incredible experience. From the moment I arrived, I felt welcomed. The instructor was fantastic and I actually flew the helicopter myself!",
    name: "James M.",
    initials: "JM",
    role: "Trial Lesson Student · 60 Min Discovery Flight",
  },
  {
    quote: "Bought this as a gift for my husband's 50th birthday. He hasn't stopped talking about it since. Already looking at PPL courses!",
    name: "Sarah T.",
    initials: "ST",
    role: "Gift Experience · 30 Min Discovery Flight",
  },
  {
    quote: "Professional, safe, and exhilarating. The views over the Chilterns were breathtaking. Highly recommend the 60-minute option.",
    name: "Michael R.",
    initials: "MR",
    role: "Trial Lesson Student · 60 Min Discovery Flight",
  },
];


// ============================================================================
// HERO SECTION
// ============================================================================
function DiscoveryHero() {
  const pageImages = usePageImages('discovery');
  const { t } = usePageText('discovery');
  const { fmt } = usePricing();
  const heroRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ['start start', 'end start'],
  });

  const heroOpacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);
  const heroScale = useTransform(scrollYProgress, [0, 0.5], [1, 0.95]);
  const heroY = useTransform(scrollYProgress, [0, 0.5], [0, 100]);

  return (
    <section ref={heroRef} className="df-hero" data-cms-section="discovery-hero">
      {/* Background image */}
      <motion.div
        className="df-hero__bg"
        initial={{ scale: 1.1, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 1.5 }}
      >
        <img src={pageImages['discovery-hero']?.[0]?.url ?? '/assets/images/gallery/carousel/rotating8.jpg'} alt="" />
      </motion.div>
      <div className="df-hero__overlay" />

      {/* Main content */}
      <motion.div
        className="df-hero__content"
        style={{ opacity: heroOpacity, scale: heroScale, y: heroY }}
      >
        <div className="df-hero__left">
          <motion.span
            className="df-hero__label"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            {t('discovery-hero', 'pre_label')}
          </motion.span>

          <div className="df-hero__headline">
            <motion.span
              className="df-hero__word df-hero__word--1"
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4, ease: [0.16, 1, 0.3, 1] }}
            >
              {t('discovery-hero', 'headline_1')}
            </motion.span>
            <motion.span
              className="df-hero__word df-hero__word--2"
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.6, ease: [0.16, 1, 0.3, 1] }}
            >
              {t('discovery-hero', 'headline_2')}
            </motion.span>
            <motion.span
              className="df-hero__word df-hero__word--3"
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.8, ease: [0.16, 1, 0.3, 1] }}
            >
              {t('discovery-hero', 'headline_3')}
            </motion.span>
          </div>

          <motion.div
            className="df-hero__divider-line"
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ duration: 0.8, delay: 1, ease: [0.16, 1, 0.3, 1] }}
          />

          {/* Flight Ticket */}
          <motion.div
            className="df-hero__ticket"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.2, duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          >
            <div className="df-hero__ticket-main">
              <div className="df-hero__ticket-header">
                <img src="/assets/images/logos/hq/hq-aviation-logo-black.png" alt="HQ Aviation" className="df-hero__ticket-logo" />
                <span className="df-hero__ticket-type">FLIGHT EXPERIENCE</span>
                <span className="df-hero__ticket-class">DISCOVERY</span>
              </div>
              <div className="df-hero__ticket-route">
                <div className="df-hero__ticket-point">
                  <span className="df-hero__ticket-code">DREAMER</span>
                  <span className="df-hero__ticket-city">Ground</span>
                </div>
                <div className="df-hero__ticket-arrow">
                  <svg width="24" height="8" viewBox="0 0 24 8" fill="none">
                    <path d="M0 4H22M22 4L18 1M22 4L18 7" stroke="#999" strokeWidth="1"/>
                  </svg>
                </div>
                <div className="df-hero__ticket-point">
                  <span className="df-hero__ticket-code">AVIATOR</span>
                  <span className="df-hero__ticket-city">Sky</span>
                </div>
              </div>
            </div>
            <div className="df-hero__ticket-perf"></div>
            <div className="df-hero__ticket-stub">
              <div className="df-hero__ticket-stub-row">
                <div><span className="df-hero__ticket-lbl">FROM</span><span>{fmt('discovery_r22_30min')}</span></div>
                <div><span className="df-hero__ticket-lbl">GATE</span><span>EGLD</span></div>
                <div><span className="df-hero__ticket-lbl">TIME</span><span>30+</span></div>
              </div>
            </div>
          </motion.div>

          <motion.p
            className="df-hero__sub"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.4 }}
          >
            {t('discovery-hero', 'subtitle')}
          </motion.p>

          <motion.div
            className="df-hero__cta"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.6 }}
          >
            <a href="#select-flight" className="df-btn df-btn--primary">
              {t('discovery-hero', 'cta_primary')}
            </a>
          </motion.div>
        </div>
      </motion.div>
    </section>
  );
}

// ============================================================================
// VALUE PROPOSITION
// ============================================================================
function ValueProposition() {
  const [selectedCard, setSelectedCard] = useState(null);
  const [selectedTime, setSelectedTime] = useState(null);
  const [isMobile, setIsMobile] = useState(false);
  const [openCard, setOpenCard] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const mq = window.matchMedia('(max-width: 1024px)');
    setIsMobile(mq.matches);
    if (mq.matches) setOpenCard('r22');
    const handler = (e) => {
      setIsMobile(e.matches);
      if (!e.matches) setOpenCard(null);
    };
    mq.addEventListener('change', handler);
    return () => mq.removeEventListener('change', handler);
  }, []);
  const { p, fmt } = usePricing();
  const pageImages = usePageImages('discovery');
  const { t } = usePageText('discovery');

  const sectionForAircraft = {
    r22: 'discovery-aircraft-r22',
    r44: 'discovery-aircraft-r44',
    r66: 'discovery-aircraft-r66',
  };

  const aircraftWithPricing = aircraftData.map((a, i) => ({
    ...a,
    image: pageImages['discovery-aircraft']?.[i]?.url ?? a.image,
    pricing: {
      30: p(`discovery_${a.id}_30min`) / 100,
      60: p(`discovery_${a.id}_60min`) / 100,
    },
    priceFmt: {
      30: fmt(`discovery_${a.id}_30min`),
      60: fmt(`discovery_${a.id}_60min`),
    },
  }));

  const handleTimeSelect = (cardId, time) => { setSelectedCard(cardId); setSelectedTime(time); };
  const handleBook = (cardId) => {
    if (selectedCard === cardId && selectedTime) {
      const aircraft = aircraftWithPricing.find(a => a.id === cardId);
      navigate(`/checkout?aircraft=${cardId}&duration=${selectedTime}&price=${aircraft.pricing[selectedTime]}`);
    }
  };

  const handleAccordionToggle = (id) => {
    setOpenCard(prev => prev === id ? null : id);
  };

  return (
    <section id="select-flight" className="df-value">
      <div className="df-value__container">
        <div className="df-value__content">
          <Reveal>
            <span className="df-pre-text">{t('discovery-value-prop', 'pre_label')}</span>
            <h2>
              <span className="df-text--dark">{t('discovery-value-prop', 'heading_1')}</span>{' '}
              <span className="df-text--light">{t('discovery-value-prop', 'heading_2')}</span>
            </h2>
            <p className="df-value__intro">
              {t('discovery-value-prop', 'paragraph_1')}
            </p>
          </Reveal>

          <div className={`df-cards ${selectedCard ? 'has-focus' : ''}`} data-cms-section="discovery-aircraft">
            {aircraftWithPricing.map((aircraft, index) => (
              <Reveal key={aircraft.id} delay={index * 0.1}>
                {isMobile ? (
                  /* ---- MOBILE: accordion ---- */
                  <div className={`df-card ${aircraft.featured ? 'df-card--featured' : ''}`}>
                    <div
                      className="df-card__acc-header"
                      onClick={() => handleAccordionToggle(aircraft.id)}
                    >
                      <div className="df-card__acc-thumb">
                        <img src={aircraft.image} alt={aircraft.name} />
                      </div>
                      <div className="df-card__acc-meta">
                        {aircraft.featured && (
                          <span className="df-card__acc-rec">Recommended</span>
                        )}
                        <span className="df-card__acc-name">{t(sectionForAircraft[aircraft.id], 'name')}</span>
                        <span className="df-card__acc-from">from {aircraft.priceFmt[30]}</span>
                      </div>
                      <span className={`df-card__acc-chevron ${openCard === aircraft.id ? 'df-card__acc-chevron--open' : ''}`}>▼</span>
                    </div>

                    {selectedCard === aircraft.id && selectedTime && openCard !== aircraft.id && (
                      <div className="df-card__acc-strip">
                        <span className="df-card__acc-strip-text">
                          {t(sectionForAircraft[aircraft.id], 'name')} · {selectedTime} min · {aircraft.priceFmt[selectedTime]}
                        </span>
                        <button className="df-card__acc-strip-btn" onClick={() => handleBook(aircraft.id)}>
                          Book Now
                        </button>
                      </div>
                    )}

                    <AnimatePresence>
                      {openCard === aircraft.id && (
                        <motion.div
                          key="body"
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: 'auto', opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
                          style={{ overflow: 'hidden' }}
                        >
                          <div className="df-card__content">
                            <div className="df-card__header">
                              <h3 className="df-card__name">{t(sectionForAircraft[aircraft.id], 'name')}</h3>
                              <p className="df-card__tagline">{t(sectionForAircraft[aircraft.id], 'tagline')}</p>
                              <p className="df-card__desc">{t(sectionForAircraft[aircraft.id], 'description')}</p>
                              <div className="df-card__seats"><span>{t(sectionForAircraft[aircraft.id], 'seats')}</span></div>
                            </div>
                            <div className="df-card__pricing">
                              <div
                                className={`df-card__time ${selectedCard === aircraft.id && selectedTime === 30 ? 'selected' : ''}`}
                                onClick={() => handleTimeSelect(aircraft.id, 30)}
                              >
                                <div className="df-card__time-info">
                                  <span className="df-card__time-duration">{t(sectionForAircraft[aircraft.id], 'label_30min')}</span>
                                  <span className="df-card__time-desc">{t(sectionForAircraft[aircraft.id], 'desc_30min')}</span>
                                </div>
                                <span className="df-card__price">{aircraft.priceFmt[30]}</span>
                              </div>
                              <div
                                className={`df-card__time ${selectedCard === aircraft.id && selectedTime === 60 ? 'selected' : ''}`}
                                onClick={() => handleTimeSelect(aircraft.id, 60)}
                              >
                                <div className="df-card__time-info">
                                  <span className="df-card__time-duration">{t(sectionForAircraft[aircraft.id], 'label_60min')}</span>
                                  <span className="df-card__time-desc">{t(sectionForAircraft[aircraft.id], 'desc_60min')}</span>
                                </div>
                                <span className="df-card__price">{aircraft.priceFmt[60]}</span>
                              </div>
                            </div>
                            <button
                              className={`df-card__btn ${selectedCard === aircraft.id && selectedTime ? 'active' : ''}`}
                              onClick={() => handleBook(aircraft.id)}
                              disabled={selectedCard !== aircraft.id || !selectedTime}
                            >
                              {selectedCard === aircraft.id && selectedTime
                                ? `Book Now - ${aircraft.priceFmt[selectedTime]}`
                                : 'Select Duration'}
                            </button>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                ) : (
                  /* ---- DESKTOP: unchanged ---- */
                  <motion.div
                    className={`df-card ${aircraft.featured ? 'df-card--featured' : ''} ${selectedCard === aircraft.id ? 'df-card--focused' : ''}`}
                    whileHover={{ y: -4 }}
                  >
                    {aircraft.featured && !selectedCard && (
                      <span className="df-card__badge">RECOMMENDED</span>
                    )}
                    <div className="df-card__image">
                      <img src={aircraft.image} alt={aircraft.name} />
                    </div>
                    <div className="df-card__content">
                      <div className="df-card__header">
                        <h3 className="df-card__name">{t(sectionForAircraft[aircraft.id], 'name')}</h3>
                        <p className="df-card__tagline">{t(sectionForAircraft[aircraft.id], 'tagline')}</p>
                        <p className="df-card__desc">{t(sectionForAircraft[aircraft.id], 'description')}</p>
                        <div className="df-card__seats"><span>{t(sectionForAircraft[aircraft.id], 'seats')}</span></div>
                      </div>
                      <div className="df-card__pricing">
                        <div
                          className={`df-card__time ${selectedCard === aircraft.id && selectedTime === 30 ? 'selected' : ''}`}
                          onClick={() => handleTimeSelect(aircraft.id, 30)}
                        >
                          <div className="df-card__time-info">
                            <span className="df-card__time-duration">{t(sectionForAircraft[aircraft.id], 'label_30min')}</span>
                            <span className="df-card__time-desc">{t(sectionForAircraft[aircraft.id], 'desc_30min')}</span>
                          </div>
                          <span className="df-card__price">{aircraft.priceFmt[30]}</span>
                        </div>
                        <div
                          className={`df-card__time ${selectedCard === aircraft.id && selectedTime === 60 ? 'selected' : ''}`}
                          onClick={() => handleTimeSelect(aircraft.id, 60)}
                        >
                          <div className="df-card__time-info">
                            <span className="df-card__time-duration">{t(sectionForAircraft[aircraft.id], 'label_60min')}</span>
                            <span className="df-card__time-desc">{t(sectionForAircraft[aircraft.id], 'desc_60min')}</span>
                          </div>
                          <span className="df-card__price">{aircraft.priceFmt[60]}</span>
                        </div>
                      </div>
                      <button
                        className={`df-card__btn ${selectedCard === aircraft.id && selectedTime ? 'active' : ''}`}
                        onClick={() => handleBook(aircraft.id)}
                        disabled={selectedCard !== aircraft.id || !selectedTime}
                      >
                        {selectedCard === aircraft.id && selectedTime
                          ? `Book Now - ${aircraft.priceFmt[selectedTime]}`
                          : 'Select Duration'}
                      </button>
                    </div>
                  </motion.div>
                )}
              </Reveal>
            ))}
          </div>

          <Reveal delay={0.2}>
            <div className="df-selector__note">
              <div className="df-selector__note-inner">
                <span className="df-selector__note-icon">💳</span>
                <p>
                  <strong>{t('discovery-gift', 'bold_text')}</strong>
                </p>
              </div>
            </div>
          </Reveal>

          <Reveal>
            <p className="df-value__intro">
              {t('discovery-value-prop', 'paragraph_2')}
            </p>
            <p className="df-value__intro">
              {t('discovery-value-prop', 'paragraph_3')}
            </p>
          </Reveal>
        </div>
      </div>
    </section>
  );
}

// ============================================================================
// INSTRUCTOR SECTION
// ============================================================================
function InstructorSection() {
  const pageImages = usePageImages('discovery');
  const { t } = usePageText('discovery');
  return (
    <section className="df-instructor" data-cms-section="discovery-instructor">
      <div className="df-instructor__container">
        <div className="df-instructor__content">
          <Reveal>
            <span className="df-pre-text">{t('discovery-instructor', 'pre_label')}</span>
            <h2>
              <span className="df-text--dark">{t('discovery-instructor', 'heading')}</span>
            </h2>
            <p>
              {t('discovery-instructor', 'intro')}
            </p>
          </Reveal>

          <div className="df-instructor__row">
            <Reveal delay={0.2}>
              <div className="df-instructor__card">
                <div className="df-instructor__image">
                  <img src={pageImages['discovery-instructor']?.[0]?.url ?? '/assets/images/team/quentin-smith-profile-picture.jpg'} alt={t('discovery-instructor', 'name')} />
                </div>
                <div className="df-instructor__info">
                  <h3>{t('discovery-instructor', 'name')}</h3>
                  <span className="df-instructor__title">{t('discovery-instructor', 'title')}</span>
                  <div className="df-instructor__stats">
                    <div className="df-instructor__stat">
                      <span className="df-instructor__stat-value"><AnimatedNumber value="18000" />+</span>
                      <span className="df-instructor__stat-label">{t('discovery-instructor', 'hours_label')}</span>
                    </div>
                    <div className="df-instructor__divider" />
                    <div className="df-instructor__stat">
                      <span className="df-instructor__stat-value"><AnimatedNumber value="35" />+</span>
                      <span className="df-instructor__stat-label">{t('discovery-instructor', 'years_label')}</span>
                    </div>
                  </div>
                  <p>
                    {t('discovery-instructor', 'bio')}
                  </p>
                </div>
              </div>
            </Reveal>

            <Reveal delay={0.3}>
              <div className="df-instructor__team">
                <span className="df-instructor__team-label">Full Instructor Team</span>
                <div className="df-instructor__team-list">
                  {[
                    { name: 'Mackie Alcantara', title: 'Chief Flight Instructor', hours: '8,500+' },
                    { name: 'George Agnelli', title: 'Flight Instructor', hours: '3,000+' },
                    { name: 'Phil Summers', title: 'Flight Instructor', hours: '2,500+' },
                  ].map((instructor, i) => (
                    <motion.div
                      key={i}
                      className="df-instructor__team-member"
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      transition={{ delay: i * 0.1, ease: [0.16, 1, 0.3, 1] }}
                      viewport={{ once: true }}
                    >
                      <span className="df-instructor__team-name">{instructor.name}</span>
                      <span className="df-instructor__team-title">{instructor.title}</span>
                      <span className="df-instructor__team-hours">{instructor.hours} hours</span>
                    </motion.div>
                  ))}
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
// WHAT TO EXPECT (JOURNEY)
// ============================================================================
function WhatToExpect() {
  const { t } = usePageText('discovery');

  const steps = [
    { num: '01', titleKey: 'step_1_title', descKey: 'step_1_desc', timeKey: 'step_1_time' },
    { num: '02', titleKey: 'step_2_title', descKey: 'step_2_desc', timeKey: 'step_2_time' },
    { num: '03', titleKey: 'step_3_title', descKey: 'step_3_desc', timeKey: 'step_3_time' },
    { num: '04', titleKey: 'step_4_title', descKey: 'step_4_desc', timeKey: 'step_4_time' },
    { num: '05', titleKey: 'step_5_title', descKey: 'step_5_desc', timeKey: 'step_5_time' },
  ];

  return (
    <section className="df-expect">
      <div className="df-expect__container">
        <Reveal>
          <div className="df-section-header">
            <span className="df-pre-text">{t('discovery-steps', 'pre_label')}</span>
            <h2>
              <span className="df-text--dark">{t('discovery-steps', 'heading')}</span>
            </h2>
            <p>{t('discovery-steps', 'intro')}</p>
          </div>
        </Reveal>

        <div className="df-expect__timeline">
          {steps.map((step, index) => (
            <Reveal key={index} delay={index * 0.1}>
              <div className="df-expect__step">
                <div className="df-expect__step-marker">
                  <span className="df-expect__step-num">{step.num}</span>
                  {index < steps.length - 1 && <div className="df-expect__step-line" />}
                </div>
                <div className="df-expect__step-content">
                  <div className="df-expect__step-header">
                    <h3>{t('discovery-steps', step.titleKey)}</h3>
                    <span className="df-expect__step-duration">{t('discovery-steps', step.timeKey)}</span>
                  </div>
                  <p>{t('discovery-steps', step.descKey)}</p>
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
// GALLERY
// ============================================================================
function DiscoveryGallery() {
  const images = [
    { src: '/assets/images/gallery/carousel/rotating1.jpg', alt: 'Helicopter in flight' },
    { src: '/assets/images/gallery/carousel/rotating2.jpg', alt: 'Scenic flying' },
    { src: '/assets/images/gallery/flying/foggy-evening-flying.jpg', alt: 'Evening flight' },
    { src: '/assets/images/gallery/carousel/rotating6.jpg', alt: 'Helicopter adventure' },
  ];

  return (
    <section className="df-gallery">
      <div className="df-gallery__track">
        {images.map((img, i) => (
          <motion.div
            key={i}
            className="df-gallery__item"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.08, ease: [0.16, 1, 0.3, 1] }}
            viewport={{ once: true }}
          >
            <img src={img.src} alt={img.alt} />
          </motion.div>
        ))}
      </div>
    </section>
  );
}

// ============================================================================
// LOCATION & FAQ
// ============================================================================
function LocationAndFAQ() {
  const [openFaq, setOpenFaq] = useState(null);
  const { t } = usePageText('discovery');
  const { faqs } = useFaqs('discovery', { visibleOnly: true });

  return (
    <section className="df-location-faq" data-cms-section="faqs-discovery">
      <div className="df-location-faq__container">
        {/* Left: Location */}
        <div className="df-location-faq__left">
          <Reveal>
            <div className="df-location">
              <div className="df-location__header">
                <span className="df-label">Visit Us</span>
                <h2>Denham Aerodrome</h2>
              </div>
              <div className="df-location__map">
                <div className="df-location__map-placeholder">
                  <i className="fas fa-map-marked-alt"></i>
                  <span>Interactive Map</span>
                </div>
              </div>
              <div className="df-location__info">
                <p className="df-location__desc">
                  Just 20 minutes from Central London, our purpose-built facility is easily accessible from the M40 and M25.
                </p>
                <div className="df-location__details">
                  <div className="df-location__detail">
                    <span className="df-location__detail-label">Address</span>
                    <p>HQ Aviation<br />Tilehouse Lane<br />Denham, UB9 5DF</p>
                  </div>
                  <div className="df-location__detail">
                    <span className="df-location__detail-label">Getting Here</span>
                    <p>5 min from M40 J1<br />20 min from M25 J16<br />Free Parking</p>
                  </div>
                </div>
              </div>
            </div>
          </Reveal>
        </div>

        {/* Divider */}
        <div className="df-location-faq__divider"></div>

        {/* Right: FAQ */}
        <div className="df-location-faq__right">
          <Reveal>
            <div className="df-faq__header">
              <span className="df-label">{t('discovery-faq', 'pre_label')}</span>
              <h2>{t('discovery-faq', 'heading')}</h2>
            </div>
          </Reveal>

          <div className="df-faq__list">
            {faqs.map((faq, i) => (
              <Reveal key={faq.id} delay={i * 0.1}>
                <div
                  className={`df-faq__item ${openFaq === i ? 'df-faq__item--open' : ''}`}
                  onClick={() => setOpenFaq(openFaq === i ? null : i)}
                >
                  <div className="df-faq__number">{String(i + 1).padStart(2, '0')}</div>
                  <div className="df-faq__content">
                    <h4>
                      {faq.question}
                      <span className="df-faq__toggle">{openFaq === i ? '−' : '+'}</span>
                    </h4>
                    <motion.div
                      className="df-faq__answer"
                      initial={false}
                      animate={{ height: openFaq === i ? 'auto' : 0, opacity: openFaq === i ? 1 : 0 }}
                      transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
                    >
                      <p>{faq.answer}</p>
                    </motion.div>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <Reveal delay={0.3}>
        <div className="df-location-faq__actions">
          <a href="https://maps.google.com/?q=HQ+Aviation+Denham" target="_blank" rel="noopener noreferrer" className="df-btn df-btn--outline">
            Get Directions
          </a>
          <Link to="/training/faq" className="df-btn df-btn--outline">View All FAQs</Link>
        </div>
      </Reveal>
    </section>
  );
}

// ============================================================================
// FINAL CTA
// ============================================================================
function FinalCTA() {
  const { fmt } = usePricing();
  const { t } = usePageText('discovery');
  return (
    <section className="df-final-cta">
      <div className="df-final-cta__bg">
        <img src="/assets/images/gallery/carousel/rotating1.jpg" alt="" />
        <div className="df-final-cta__overlay" />
      </div>

      <div className="df-final-cta__content">
        <Reveal>
          <span className="df-pre-text df-pre-text--light">{t('discovery-final-cta', 'pre_label')}</span>
          <h2>
            <span className="df-text--white">{t('discovery-final-cta', 'heading')}</span>
          </h2>
          <p>
            {t('discovery-final-cta', 'description')}
          </p>
        </Reveal>

        <Reveal delay={0.2}>
          <div className="df-final-cta__pricing">
            <div className="df-final-cta__price-item">
              <span className="df-final-cta__price-label">{t('discovery-final-cta', 'label_30min')}</span>
              <span className="df-final-cta__price-value">from {fmt('discovery_r22_30min')}</span>
            </div>
            <div className="df-final-cta__price-divider" />
            <div className="df-final-cta__price-item">
              <span className="df-final-cta__price-label">{t('discovery-final-cta', 'label_60min')}</span>
              <span className="df-final-cta__price-value">from {fmt('discovery_r22_60min')}</span>
            </div>
          </div>
        </Reveal>

        <Reveal delay={0.3}>
          <div className="df-final-cta__buttons">
            <a href="#select-flight" className="df-btn df-btn--light df-btn--large">
              {t('discovery-final-cta', 'cta_primary')}
            </a>
            <Link to="/contact" className="df-btn df-btn--outline-light">
              {t('discovery-final-cta', 'cta_secondary')}
            </Link>
          </div>
        </Reveal>

        <Reveal delay={0.4}>
          <div className="df-final-cta__trust">
            <span>🎁 {t('discovery-final-cta', 'badge_gift')}</span>
            <span>✓ {t('discovery-final-cta', 'badge_valid')}</span>
            <span>✓ {t('discovery-final-cta', 'badge_ppl')}</span>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

// ============================================================================
// MAIN PAGE COMPONENT
// ============================================================================
function DiscoveryFlight() {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);
  useCmsHighlight();

  return (
    <div className="df">
      <DiscoveryHeader />
      <DiscoveryHero />
      <ValueProposition />
      <InstructorSection />
      <WhatToExpect />
      <DiscoveryGallery />
      <LocationAndFAQ />
      <FooterMinimal />

      {/* ================================================================== */}
      {/* STYLES */}
      {/* ================================================================== */}
      <style>{`
        /* ===== BASE STYLES ===== */
        .df {
          font-family: 'Space Grotesk', -apple-system, sans-serif;
          background: #faf9f6;
          color: #1a1a1a;
          overflow-x: hidden;
        }

        .df-label {
          display: inline-block;
          font-size: 0.7rem;
          text-transform: uppercase;
          letter-spacing: 0.25em;
          color: #888;
          font-weight: 400;
          margin-bottom: 0.75rem;
        }

        .df-pre-text {
          display: block;
          font-size: 0.7rem;
          text-transform: uppercase;
          letter-spacing: 0.25em;
          color: #999;
          margin-bottom: 1rem;
        }

        .df-pre-text--light {
          color: rgba(255,255,255,0.5);
        }

        .df-text--dark { color: #1a1a1a; }
        .df-text--mid { color: #4a4a4a; }
        .df-text--light { color: #7a7a7a; }
        .df-text--white { color: #ffffff; }
        .df-text--mid-inv { color: rgba(255,255,255,0.6); }

        .df-section-header {
          text-align: center;
          max-width: 700px;
          margin: 0 auto 3rem;
        }

        .df-section-header h2 {
          font-size: clamp(2rem, 4vw, 3rem);
          margin: 0.5rem 0;
          line-height: 1.1;
          text-transform: uppercase;
          font-weight: 700;
        }

        .df-section-header p {
          color: #666;
          font-size: 1.1rem;
          line-height: 1.7;
        }

        .df-section-header--light {
          color: #fff;
        }

        /* Buttons */
        .df-btn {
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
        }

        .df-btn--primary {
          background: #1a1a1a;
          color: #fff;
        }

        .df-btn--primary:hover {
          background: #333;
          color: #fff;
        }

        .df-btn--outline {
          background: transparent;
          color: #1a1a1a;
          border: 2px solid #1a1a1a;
        }

        .df-btn--outline:hover {
          background: #1a1a1a;
          color: #fff;
        }

        .df-btn--light {
          background: #fff;
          color: #1a1a1a;
        }

        .df-btn--light:hover {
          background: #f0f0f0;
        }

        .df-btn--outline-light {
          background: transparent;
          color: #fff;
          border: 2px solid rgba(255,255,255,0.3);
        }

        .df-btn--outline-light:hover {
          background: rgba(255,255,255,0.1);
          border-color: rgba(255,255,255,0.6);
        }

        .df-btn--large {
          padding: 1.1rem 2.5rem;
          font-size: 0.8rem;
        }

        .df-link {
          display: inline-flex;
          align-items: center;
          gap: 0.5rem;
          font-size: 0.75rem;
          text-transform: uppercase;
          letter-spacing: 0.1em;
          color: #1a1a1a;
          text-decoration: none;
          border-bottom: 1px solid #ccc;
          padding-bottom: 0.25rem;
          transition: border-color 0.3s ease;
        }

        .df-link:hover {
          border-color: #1a1a1a;
        }

        /* ===== HERO ===== */
        .df-hero {
          min-height: 100vh;
          position: relative;
          display: flex;
          flex-direction: column;
          overflow: hidden;
          background: #faf9f6;
        }

        .df-hero__bg {
          position: absolute;
          inset: 0;
          z-index: 1;
        }

        .df-hero__bg img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }

        .df-hero__overlay {
          position: absolute;
          inset: 0;
          z-index: 2;
          background: linear-gradient(90deg, rgba(250,249,246,0.97) 0%, rgba(250,249,246,0.92) 45%, rgba(250,249,246,0.4) 100%);
        }

        .df-hero__content {
          position: relative;
          z-index: 3;
          flex: 1;
          display: flex;
          align-items: center;
          padding: 2rem 4rem 2rem;
        }

        .df-hero__left {
          max-width: 550px;
        }

        .df-hero__label {
          font-family: 'Space Grotesk', sans-serif;
          font-size: 0.7rem;
          font-weight: 400;
          letter-spacing: 0.2em;
          text-transform: uppercase;
          color: #999;
          display: block;
          margin-bottom: 1.5rem;
        }

        .df-hero__headline {
          display: flex;
          flex-direction: column;
          line-height: 1;
          margin-bottom: 1.5rem;
        }

        .df-hero__word {
          font-family: 'Space Grotesk', sans-serif;
          font-weight: 700;
          font-size: clamp(3rem, 8vw, 5.5rem);
          letter-spacing: -0.02em;
          text-transform: uppercase;
        }

        .df-hero__word--1 { color: #1a1a1a; }
        .df-hero__word--2 { color: #4a4a4a; }
        .df-hero__word--3 { color: #7a7a7a; }

        .df-hero__divider-line {
          width: 80px;
          height: 2px;
          background: #1a1a1a;
          margin-bottom: 1.5rem;
          transform-origin: left;
        }

        .df-hero__sub {
          font-size: 1.1rem;
          color: #666;
          line-height: 1.8;
          max-width: 420px;
          margin-bottom: 2rem;
        }

        .df-hero__cta {
          display: flex;
          gap: 1rem;
        }

        /* Flight Ticket */
        .df-hero__ticket {
          display: flex;
          align-items: stretch;
          background: #fff;
          max-width: 320px;
          margin-bottom: 1.5rem;
          box-shadow: 0 4px 20px rgba(0,0,0,0.08);
          border-radius: 8px;
          overflow: hidden;
          border: 1px solid #e8e6e2;
          -webkit-mask-image:
            radial-gradient(circle at calc(100% - 83px) 0, transparent 6px, black 6.5px),
            radial-gradient(circle at calc(100% - 83px) 100%, transparent 6px, black 6.5px);
          -webkit-mask-composite: source-in;
          mask-image:
            radial-gradient(circle at calc(100% - 83px) 0, transparent 6px, black 6.5px),
            radial-gradient(circle at calc(100% - 83px) 100%, transparent 6px, black 6.5px);
          mask-composite: intersect;
        }

        .df-hero__ticket-main {
          flex: 1;
          padding: 0.75rem 1rem;
          padding-right: 1.5rem;
          position: relative;
        }

        .df-hero__ticket-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 0.5rem;
          padding-bottom: 0.5rem;
          border-bottom: 1px solid #f0f0f0;
          gap: 0.5rem;
        }

        .df-hero__ticket-logo {
          height: 14px;
          width: auto;
          opacity: 0.8;
        }

        .df-hero__ticket-type {
          font-family: 'Space Grotesk', sans-serif;
          font-size: 0.5rem;
          letter-spacing: 0.15em;
          color: #999;
          text-transform: uppercase;
          flex: 1;
          text-align: center;
        }

        .df-hero__ticket-class {
          font-family: 'Space Grotesk', sans-serif;
          font-size: 0.6rem;
          font-weight: 700;
          letter-spacing: 0.1em;
          color: #1a1a1a;
          background: #f5f5f2;
          padding: 0.15rem 0.4rem;
        }

        .df-hero__ticket-route {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 0.75rem;
        }

        .df-hero__ticket-point {
          text-align: center;
        }

        .df-hero__ticket-code {
          display: block;
          font-family: 'Space Grotesk', sans-serif;
          font-size: 0.85rem;
          font-weight: 700;
          color: #1a1a1a;
          text-transform: uppercase;
          letter-spacing: -0.01em;
        }

        .df-hero__ticket-city {
          font-size: 0.55rem;
          color: #888;
          text-transform: uppercase;
          letter-spacing: 0.05em;
        }

        .df-hero__ticket-arrow {
          display: flex;
          align-items: center;
        }

        .df-hero__ticket-perf {
          width: 14px;
          background: #fff;
          position: relative;
        }

        .df-hero__ticket-perf::before {
          content: '';
          position: absolute;
          top: 8px;
          bottom: 8px;
          left: 100%;
          transform: translateX(-50%);
          width: 1px;
          background-image: repeating-linear-gradient(
            to bottom,
            #ccc 0px,
            #ccc 3px,
            transparent 3px,
            transparent 6px
          );
        }

        .df-hero__ticket-stub {
          background: #fafafa;
          padding: 0.5rem 0.75rem;
          display: flex;
          align-items: center;
        }

        .df-hero__ticket-stub-row {
          display: flex;
          flex-direction: column;
          gap: 0.35rem;
        }

        .df-hero__ticket-stub-row > div {
          display: flex;
          align-items: center;
          gap: 0.4rem;
        }

        .df-hero__ticket-lbl {
          font-family: 'Space Grotesk', sans-serif;
          font-size: 0.45rem;
          color: #999;
          letter-spacing: 0.1em;
          min-width: 28px;
        }

        .df-hero__ticket-stub-row > div > span:not(.df-hero__ticket-lbl) {
          font-family: 'Share Tech Mono', monospace;
          font-weight: 600;
          font-size: 0.7rem;
          color: #1a1a1a;
        }

        /* ===== VALUE PROPOSITION ===== */
        .df-value {
          padding: 5rem 2rem 4rem;
          background: #fff;
        }

        .df-value__container {
          max-width: 1200px;
          margin: 0 auto;
        }

        .df-value__content {
          text-align: center;
          margin: 0 auto;
        }

        .df-value__content h2 {
          font-size: clamp(2rem, 4vw, 2.75rem);
          margin: 0.5rem 0 1.5rem;
          text-transform: uppercase;
          line-height: 1.1;
        }

        .df-value__intro {
          font-size: 1.1rem;
          line-height: 1.8;
          color: #666;
        }

        .df-value__stats {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 2rem;
          padding: 2.5rem;
          background: #faf9f6;
          border: 1px solid #e8e6e2;
          margin-bottom: 3rem;
        }

        .df-value__stat {
          text-align: center;
        }

        .df-value__stat-value {
          display: block;
          font-family: 'Share Tech Mono', monospace;
          font-size: 2.5rem;
          font-weight: 700;
          color: #1a1a1a;
          line-height: 1;
          margin-bottom: 0.5rem;
        }

        .df-value__stat-label {
          font-size: 0.7rem;
          text-transform: uppercase;
          letter-spacing: 0.15em;
          color: #888;
        }

        .df-value__features {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 1.5rem;
        }

        .df-value__feature {
          display: flex;
          gap: 1rem;
          padding: 1.5rem;
          background: #faf9f6;
          border-left: 3px solid #1a1a1a;
        }

        .df-value__feature-icon {
          font-size: 1.5rem;
        }

        .df-value__feature-text h4 {
          font-size: 0.9rem;
          font-weight: 600;
          margin: 0 0 0.25rem;
          text-transform: uppercase;
        }

        .df-value__feature-text p {
          font-size: 0.85rem;
          color: #666;
          margin: 0;
        }

        /* ===== FLIGHT SELECTOR ===== */
        .df-cards {
          display: flex;
          gap: 25px;
          align-items: stretch;
          min-height: 520px;
          padding: 2rem 0 0;
        }

        .df-cards > * {
          flex: 1;
          min-width: 0;
        }

        .df-card {
          background: #fff;
          border-radius: 16px;
          border: 1px solid #f0f0f0;
          box-shadow: 0 20px 40px -10px rgba(0,0,0,0.08);
          transition: all 0.4s cubic-bezier(0.25, 0.8, 0.25, 1);
          overflow: hidden;
          position: relative;
          flex: 1;
          display: flex;
          flex-direction: column;
        }

        .df-card--featured {
          flex: 1.3;
          transform: scale(1.02);
          z-index: 2;
          border: 2px solid #1a1a1a;
          box-shadow: 0 30px 60px -15px rgba(0,0,0,0.15);
        }

        .df-cards.has-focus .df-card--featured {
          transform: scale(1);
          border: 1px solid #f0f0f0;
          flex: 1;
          z-index: 1;
          box-shadow: 0 20px 40px -10px rgba(0,0,0,0.08);
        }

        .df-cards.has-focus .df-card--focused {
          flex: 1.3;
          transform: scale(1.02);
          border: 2px solid #1a1a1a;
          z-index: 10;
          box-shadow: 0 40px 80px -20px rgba(0,0,0,0.2);
        }

        .df-card__badge {
          position: absolute;
          top: 15px;
          right: 15px;
          background: #1a1a1a;
          color: #fff;
          font-size: 0.65rem;
          padding: 6px 14px;
          border-radius: 20px;
          font-weight: 700;
          letter-spacing: 0.05em;
          z-index: 10;
        }

        .df-card__image {
          height: 180px;
          display: flex;
          align-items: center;
          justify-content: center;
          background: radial-gradient(circle at center, #f9f9f9 0%, #fff 70%);
          padding: 1rem;
        }

        .df-card__image img {
          width: 100%;
          max-height: 150px;
          object-fit: contain;
        }

        .df-card__content {
          padding: 1.5rem;
          flex-grow: 1;
          display: flex;
          flex-direction: column;
        }

        .df-card__header {
          text-align: center;
          margin-bottom: 1.25rem;
        }

        .df-card__name {
          font-family: 'Space Grotesk', sans-serif;
          font-size: 1.1rem;
          font-weight: 700;
          color: #1a1a1a;
          margin: 0 0 0.25rem;
        }

        .df-card__tagline {
          font-size: 0.8rem;
          color: #666;
          margin: 0 0 0.5rem;
          font-weight: 500;
        }

        .df-card__desc {
          font-size: 0.8rem;
          color: #999;
          margin: 0 0 0.75rem;
          line-height: 1.5;
        }

        .df-card__seats {
          font-size: 0.7rem;
          color: #888;
          text-transform: uppercase;
          letter-spacing: 0.1em;
        }

        .df-card__pricing {
          margin-bottom: 1rem;
        }

        .df-card__time {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 1rem;
          background: #f9f9f9;
          border-radius: 8px;
          margin-bottom: 0.5rem;
          cursor: pointer;
          transition: all 0.2s ease;
          border: 1px solid transparent;
        }

        .df-card__time:hover {
          background: #f0f0f0;
        }

        .df-card__time.selected {
          background: #1a1a1a;
          color: #fff;
        }

        .df-card__time.selected .df-card__price,
        .df-card__time.selected .df-card__time-desc {
          color: #fff;
        }

        .df-card__time-info {
          display: flex;
          flex-direction: column;
        }

        .df-card__time-duration {
          font-size: 0.85rem;
          font-weight: 600;
        }

        .df-card__time-desc {
          font-size: 0.7rem;
          color: #888;
        }

        .df-card__price {
          font-family: 'Share Tech Mono', monospace;
          font-size: 1.1rem;
          font-weight: 700;
          color: #1a1a1a;
        }

        .df-card__btn {
          width: 100%;
          padding: 0.9rem;
          margin-top: auto;
          border-radius: 30px;
          font-family: 'Space Grotesk', sans-serif;
          font-size: 0.7rem;
          font-weight: 700;
          letter-spacing: 0.1em;
          text-transform: uppercase;
          transition: all 0.3s ease;
          border: 2px solid #e0e0e0;
          background: #e0e0e0;
          color: #999;
          cursor: not-allowed;
        }

        .df-card__btn.active {
          background: #1a1a1a;
          color: #fff;
          border-color: #1a1a1a;
          cursor: pointer;
        }

        .df-card__btn.active:hover {
          background: #333;
          border-color: #333;
        }

        .df-selector__note {
          display: flex;
          align-items: center;
          gap: 1.25rem;
          margin-top: 2rem;
          margin-bottom: 2rem;
        }

        .df-selector__note::before,
        .df-selector__note::after {
          content: '';
          flex: 1;
          height: 1px;
          background: #e0ddd8;
        }

        .df-selector__note-inner {
          display: inline-flex;
          align-items: center;
          gap: 0.4rem;
          padding: 0.35rem 0.75rem;
          background: #fff;
          border: 1px solid #e8e6e2;
          border-left: 3px solid #1a1a1a;
          white-space: nowrap;
        }

        .df-selector__note-icon {
          font-size: 0.8rem;
        }

        .df-selector__note-inner p {
          margin: 0;
          color: #666;
          font-size: 0.72rem;
        }

        .df-selector__note-inner strong {
          color: #1a1a1a;
        }

        /* ===== INSTRUCTOR SECTION ===== */
        .df-instructor {
          padding: 4rem 2rem;
          background: #f0efec;
        }

        .df-instructor__container {
          max-width: 1000px;
          margin: 0 auto;
        }

        .df-instructor__content h2 {
          font-size: clamp(1.75rem, 3.5vw, 2.5rem);
          margin: 0.5rem 0 1rem;
          text-transform: uppercase;
        }

        .df-instructor__content > p {
          color: #666;
          font-size: 1rem;
          line-height: 1.7;
          max-width: 600px;
          margin-bottom: 2rem;
        }

        .df-instructor__row {
          display: flex;
          gap: 2rem;
          align-items: stretch;
        }

        .df-instructor__row > * {
          flex: 1;
          display: flex;
          flex-direction: column;
        }

        .df-instructor__row .df-instructor__card,
        .df-instructor__row .df-instructor__team {
          flex: 1;
          box-sizing: border-box;
        }

        .df-instructor__card {
          display: flex;
          align-items: center;
          gap: 2rem;
          background: #fff;
          padding: 1.5rem;
          border-radius: 8px;
          border-left: 4px solid #1a1a1a;
        }

        .df-instructor__image {
          flex-shrink: 0;
        }

        .df-instructor__image img {
          width: 120px;
          height: 120px;
          object-fit: cover;
          border-radius: 4px;
        }

        .df-instructor__info h3 {
          margin: 0 0 0.25rem;
          font-size: 1.25rem;
          text-transform: uppercase;
        }

        .df-instructor__title {
          display: block;
          color: #666;
          font-size: 0.7rem;
          letter-spacing: 0.15em;
          text-transform: uppercase;
          margin-bottom: 1rem;
        }

        .df-instructor__stats {
          display: flex;
          align-items: center;
          gap: 1.5rem;
          margin-bottom: 1rem;
        }

        .df-instructor__divider {
          width: 1px;
          height: 30px;
          background: linear-gradient(to bottom, transparent, #e8e6e2, transparent);
        }

        .df-instructor__stat-value {
          display: block;
          font-family: 'Share Tech Mono', monospace;
          font-size: 1.5rem;
          font-weight: 700;
          color: #1a1a1a;
        }

        .df-instructor__stat-label {
          font-size: 0.6rem;
          color: #888;
          text-transform: uppercase;
          letter-spacing: 0.15em;
        }

        .df-instructor__info p {
          color: #666;
          font-size: 0.9rem;
          line-height: 1.6;
          margin: 0;
        }

        .df-instructor__team {
          background: #faf9f6;
          padding: 1.5rem;
          border-radius: 8px;
        }

        .df-instructor__team-label {
          display: block;
          font-size: 0.7rem;
          letter-spacing: 0.2em;
          text-transform: uppercase;
          color: #999;
          margin-bottom: 1rem;
        }

        .df-instructor__team-list {
          display: grid;
          grid-template-columns: 1fr;
          gap: 1rem;
        }

        .df-instructor__team-member {
          background: #fff;
          padding: 1rem;
          border-left: 3px solid #1a1a1a;
          display: flex;
          flex-direction: column;
        }

        .df-instructor__team-name {
          font-weight: 600;
          font-size: 0.9rem;
          margin-bottom: 0.25rem;
        }

        .df-instructor__team-title {
          font-size: 0.75rem;
          color: #666;
          margin-bottom: 0.5rem;
        }

        .df-instructor__team-hours {
          font-family: 'Share Tech Mono', monospace;
          font-size: 0.75rem;
          color: #999;
        }

        /* ===== WHAT TO EXPECT ===== */
        .df-expect {
          padding: 6rem 2rem;
          background: #faf9f6;
        }

        .df-expect__container {
          max-width: 800px;
          margin: 0 auto;
        }

        .df-expect__timeline {
          position: relative;
        }

        .df-expect__step {
          display: flex;
          gap: 2rem;
          margin-bottom: 0;
        }

        .df-expect__step-marker {
          display: flex;
          flex-direction: column;
          align-items: center;
          width: 60px;
          flex-shrink: 0;
        }

        .df-expect__step-num {
          width: 48px;
          height: 48px;
          background: #1a1a1a;
          color: #fff;
          display: flex;
          align-items: center;
          justify-content: center;
          font-family: 'Share Tech Mono', monospace;
          font-size: 0.9rem;
          font-weight: 700;
        }

        .df-expect__step-line {
          width: 2px;
          flex: 1;
          min-height: 40px;
          background: linear-gradient(to bottom, #1a1a1a, #e0deda);
        }

        .df-expect__step-content {
          flex: 1;
          padding-bottom: 2.5rem;
        }

        .df-expect__step-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 0.5rem;
        }

        .df-expect__step-content h3 {
          font-size: 1.1rem;
          font-weight: 600;
          margin: 0;
          text-transform: uppercase;
        }

        .df-expect__step-duration {
          font-family: 'Share Tech Mono', monospace;
          font-size: 0.75rem;
          color: #888;
          background: #f0efec;
          padding: 0.25rem 0.75rem;
        }

        .df-expect__step-content p {
          color: #666;
          font-size: 0.95rem;
          line-height: 1.6;
          margin: 0;
        }

        /* ===== GALLERY ===== */
        .df-gallery {
          position: relative;
          width: 100vw;
          margin-left: 50%;
          transform: translateX(-50%);
        }

        .df-gallery::before,
        .df-gallery::after {
          content: '';
          position: absolute;
          left: 0;
          right: 0;
          height: 25%;
          z-index: 6;
          pointer-events: none;
        }

        .df-gallery::before {
          top: 0;
          background: linear-gradient(to bottom, rgba(0,0,0,0.4) 0%, transparent 100%);
        }

        .df-gallery::after {
          bottom: 0;
          background: linear-gradient(to top, rgba(0,0,0,0.4) 0%, transparent 100%);
        }

        .df-gallery__track {
          display: flex;
          gap: 0;
          position: relative;
        }

        .df-gallery__track::before,
        .df-gallery__track::after {
          content: '';
          position: absolute;
          top: 0;
          width: 30%;
          height: 100%;
          z-index: 5;
          pointer-events: none;
        }

        .df-gallery__track::before {
          left: 0;
          background: linear-gradient(to right, rgba(0,0,0,1) 0%, rgba(0,0,0,0.5) 40%, transparent 100%);
        }

        .df-gallery__track::after {
          right: 0;
          background: linear-gradient(to left, rgba(0,0,0,1) 0%, rgba(0,0,0,0.5) 40%, transparent 100%);
        }

        .df-gallery__item {
          flex: 1;
          min-width: 0;
          aspect-ratio: 16/9;
          overflow: hidden;
          position: relative;
        }

        .df-gallery__item img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          transition: transform 0.6s ease;
        }

        .df-gallery__item:hover img {
          transform: scale(1.05);
        }

        .df-gallery__item:not(:last-child)::after {
          content: '';
          position: absolute;
          top: 0;
          right: 0;
          width: 3px;
          height: 100%;
          background: linear-gradient(to bottom, transparent 15%, rgba(128,128,128,0.25) 50%, transparent 85%);
          z-index: 3;
        }

        /* ===== LOCATION & FAQ ===== */
        .df-location-faq {
          padding: 5rem 2rem 4rem;
          background: #fff;
        }

        .df-location-faq__container {
          max-width: 1100px;
          margin: 0 auto;
          display: grid;
          grid-template-columns: 1fr auto 1fr;
          gap: 3rem;
          align-items: stretch;
        }

        .df-location-faq__left,
        .df-location-faq__right {
          min-width: 0;
          display: flex;
          flex-direction: column;
        }

        .df-location-faq__divider {
          width: 1px;
          background: linear-gradient(to bottom, transparent, #e0deda 20%, #e0deda 80%, transparent);
        }

        .df-location-faq__actions {
          display: grid;
          grid-template-columns: 1fr 1fr;
          align-items: center;
          gap: 3rem;
          max-width: 1100px;
          margin: 2rem auto 0;
        }

        .df-location-faq__actions .df-btn {
          width: 100%;
          text-align: center;
        }

        /* Location */
        .df-location {
          display: flex;
          flex-direction: column;
          height: 100%;
        }

        .df-location__header {
          margin-bottom: 1.5rem;
        }

        .df-location__header h2 {
          font-size: 1.5rem;
          font-weight: 700;
          text-transform: uppercase;
          margin: 0;
        }

        .df-location__map {
          background: linear-gradient(135deg, #e8e6e2 0%, #d8d6d2 100%);
          min-height: 180px;
          display: flex;
          align-items: center;
          justify-content: center;
          border-radius: 4px;
          margin-bottom: 1.5rem;
          position: relative;
          overflow: hidden;
        }

        .df-location__map::before {
          content: '';
          position: absolute;
          inset: 0;
          background:
            linear-gradient(90deg, transparent 49.5%, rgba(0,0,0,0.05) 49.5%, rgba(0,0,0,0.05) 50.5%, transparent 50.5%),
            linear-gradient(0deg, transparent 49.5%, rgba(0,0,0,0.05) 49.5%, rgba(0,0,0,0.05) 50.5%, transparent 50.5%);
          background-size: 40px 40px;
        }

        .df-location__map-placeholder {
          text-align: center;
          color: #888;
          position: relative;
          z-index: 1;
        }

        .df-location__map-placeholder i {
          font-size: 2rem;
          margin-bottom: 0.5rem;
          display: block;
          color: #999;
        }

        .df-location__map-placeholder span {
          font-size: 0.7rem;
          text-transform: uppercase;
          letter-spacing: 0.15em;
        }

        .df-location__desc {
          font-size: 0.9rem;
          color: #666;
          line-height: 1.7;
          margin-bottom: 1.5rem;
        }

        .df-location__details {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 1.5rem;
          margin-top: auto;
        }

        .df-location__detail {
          padding: 1rem;
          background: #faf9f6;
          border-left: 2px solid #1a1a1a;
        }

        .df-location__detail-label {
          display: block;
          font-family: 'Share Tech Mono', monospace;
          font-size: 0.6rem;
          letter-spacing: 0.15em;
          color: #999;
          text-transform: uppercase;
          margin-bottom: 0.5rem;
        }

        .df-location__detail p {
          font-size: 0.85rem;
          line-height: 1.6;
          margin: 0;
          color: #1a1a1a;
        }

        /* FAQ */
        .df-faq__header {
          margin-bottom: 2rem;
        }

        .df-faq__header h2 {
          font-size: 1.5rem;
          font-weight: 700;
          text-transform: uppercase;
          margin: 0;
        }

        .df-faq__list {
          display: flex;
          flex-direction: column;
          gap: 0;
        }

        .df-faq__item {
          display: flex;
          gap: 1.5rem;
          padding: 1.25rem 0;
          border-bottom: 1px solid #e8e6e2;
          cursor: pointer;
          transition: background 0.2s ease;
        }

        .df-faq__item:hover {
          background: rgba(0,0,0,0.01);
        }

        .df-faq__item--open {
          background: rgba(0,0,0,0.02);
        }

        .df-faq__number {
          font-family: 'Share Tech Mono', monospace;
          font-size: 0.75rem;
          color: #ccc;
          flex-shrink: 0;
          padding-top: 0.1rem;
        }

        .df-faq__content {
          flex: 1;
        }

        .df-faq__content h4 {
          margin: 0;
          font-size: 1rem;
          font-weight: 600;
          display: flex;
          justify-content: space-between;
          align-items: center;
          gap: 1rem;
        }

        .df-faq__toggle {
          font-size: 1.25rem;
          font-weight: 300;
          color: #999;
          flex-shrink: 0;
        }

        .df-faq__answer {
          overflow: hidden;
        }

        .df-faq__answer p {
          margin: 0.75rem 0 0;
          color: #666;
          line-height: 1.7;
          font-size: 0.95rem;
        }

        /* ===== FINAL CTA ===== */
        .df-final-cta {
          position: relative;
          padding: 6rem 2rem;
          min-height: 500px;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .df-final-cta__bg {
          position: absolute;
          inset: 0;
          z-index: 0;
        }

        .df-final-cta__bg img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }

        .df-final-cta__overlay {
          position: absolute;
          inset: 0;
          background: linear-gradient(
            to bottom,
            rgba(26,26,26,0.85) 0%,
            rgba(26,26,26,0.9) 100%
          );
        }

        .df-final-cta__content {
          position: relative;
          z-index: 1;
          text-align: center;
          max-width: 700px;
        }

        .df-final-cta__content h2 {
          font-size: clamp(2rem, 5vw, 3rem);
          margin: 0.5rem 0 1.5rem;
          text-transform: uppercase;
          line-height: 1.1;
        }

        .df-final-cta__content p {
          color: rgba(255,255,255,0.7);
          font-size: 1.1rem;
          line-height: 1.7;
          margin-bottom: 2rem;
        }

        .df-final-cta__pricing {
          display: flex;
          justify-content: center;
          align-items: center;
          gap: 3rem;
          margin-bottom: 2rem;
        }

        .df-final-cta__price-item {
          text-align: center;
        }

        .df-final-cta__price-label {
          display: block;
          font-size: 0.7rem;
          text-transform: uppercase;
          letter-spacing: 0.15em;
          color: rgba(255,255,255,0.5);
          margin-bottom: 0.25rem;
        }

        .df-final-cta__price-value {
          font-family: 'Share Tech Mono', monospace;
          font-size: 1.5rem;
          font-weight: 700;
          color: #fff;
        }

        .df-final-cta__price-divider {
          width: 1px;
          height: 40px;
          background: linear-gradient(to bottom, transparent, rgba(255,255,255,0.3), transparent);
        }

        .df-final-cta__buttons {
          display: flex;
          gap: 1rem;
          justify-content: center;
          margin-bottom: 2rem;
        }

        .df-final-cta__trust {
          display: flex;
          justify-content: center;
          gap: 2rem;
          flex-wrap: wrap;
        }

        .df-final-cta__trust span {
          color: rgba(255,255,255,0.6);
          font-size: 0.85rem;
        }

        /* ===== ACCORDION (mobile) ===== */
        .df-card__acc-header {
          display: flex;
          align-items: center;
          gap: 10px;
          padding: 12px;
          cursor: pointer;
          user-select: none;
        }

        .df-card__acc-thumb {
          width: 50px;
          height: 42px;
          flex-shrink: 0;
          background: radial-gradient(circle at center, #f4f3f0 0%, #fff 80%);
          border-radius: 8px;
          display: flex;
          align-items: center;
          justify-content: center;
          overflow: hidden;
        }

        .df-card__acc-thumb img {
          width: 100%;
          height: 100%;
          object-fit: contain;
        }

        .df-card__acc-meta {
          flex: 1;
          min-width: 0;
        }

        .df-card__acc-rec {
          display: inline-block;
          background: #1a1a1a;
          color: #fff;
          font-family: 'Space Grotesk', sans-serif;
          font-size: 0.38rem;
          font-weight: 700;
          letter-spacing: 0.08em;
          text-transform: uppercase;
          padding: 2px 7px;
          border-radius: 10px;
          margin-bottom: 3px;
        }

        .df-card__acc-name {
          font-family: 'Space Grotesk', sans-serif;
          font-size: 0.7rem;
          font-weight: 700;
          color: #1a1a1a;
          display: block;
        }

        .df-card__acc-from {
          font-family: 'Share Tech Mono', monospace;
          font-size: 0.55rem;
          color: #888;
          margin-top: 2px;
          display: block;
        }

        .df-card__acc-chevron {
          font-size: 0.55rem;
          color: #aaa;
          flex-shrink: 0;
          transition: transform 0.25s ease, color 0.25s ease;
          line-height: 1;
        }

        .df-card__acc-chevron--open {
          transform: rotate(180deg);
          color: #1a1a1a;
        }

        .df-card__acc-strip {
          background: #1a1a1a;
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 6px 12px;
        }

        .df-card__acc-strip-text {
          font-family: 'Share Tech Mono', monospace;
          font-size: 0.45rem;
          color: #fff;
          letter-spacing: 0.05em;
        }

        .df-card__acc-strip-btn {
          font-family: 'Space Grotesk', sans-serif;
          font-size: 0.42rem;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 0.06em;
          background: #fff;
          color: #1a1a1a;
          border: none;
          border-radius: 8px;
          padding: 3px 9px;
          cursor: pointer;
        }

        /* ===== RESPONSIVE ===== */
        @media (max-width: 1024px) {
          .df-hero__overlay {
            background: linear-gradient(180deg, rgba(250,249,246,0.97) 0%, rgba(250,249,246,0.92) 60%, rgba(250,249,246,0.7) 100%);
          }

          .df-hero__content {
            padding: 5rem 2rem 2rem;
            justify-content: center;
          }

          .df-hero__left {
            text-align: center;
            max-width: 100%;
          }

          .df-hero__headline {
            align-items: center;
          }

          .df-hero__divider-line {
            margin: 1.5rem auto;
          }

          .df-hero__sub {
            margin: 0 auto 2rem;
            text-align: center;
          }

          .df-hero__ticket {
            margin: 0 auto 1.5rem;
          }

          .df-hero__cta {
            justify-content: center;
          }

          .df-value__stats {
            grid-template-columns: repeat(2, 1fr);
          }

          .df-value__features {
            grid-template-columns: repeat(2, 1fr);
          }

          .df-cards {
            flex-direction: column;
            min-height: auto;
            gap: 10px;
            padding: 1rem 0 0;
          }

          .df-cards > * {
            flex: none;
            width: 100%;
          }

          .df-card,
          .df-card--featured,
          .df-cards.has-focus .df-card--featured,
          .df-cards.has-focus .df-card--focused {
            flex: none;
            transform: none;
            width: 100%;
            margin-bottom: 0;
          }

          .df-card--featured {
            border: 2px solid #1a1a1a;
          }

          .df-instructor__row {
            flex-direction: column;
          }

          .df-instructor__card {
            flex-direction: column;
            text-align: center;
          }

          .df-instructor__image {
            margin: 0 auto;
          }

          .df-instructor__stats {
            justify-content: center;
          }

          .df-instructor__team-list {
            grid-template-columns: repeat(2, 1fr);
          }

          .df-location-faq__container {
            grid-template-columns: 1fr;
            gap: 2.5rem;
          }

          .df-location-faq__divider {
            width: 100%;
            height: 1px;
            background: linear-gradient(to right, transparent, #e0deda 20%, #e0deda 80%, transparent);
          }

          .df-location-faq__actions {
            grid-template-columns: 1fr;
            gap: 1rem;
          }

        @media (max-width: 768px) {
          .df-location-faq__actions {
            display: none;
          }

          .df-value__stats {
            grid-template-columns: 1fr 1fr;
            gap: 1.5rem;
          }

          .df-value__features {
            grid-template-columns: 1fr;
          }

          .df-expect__step {
            flex-direction: column;
            gap: 1rem;
          }

          .df-expect__step-marker {
            flex-direction: row;
            width: 100%;
          }

          .df-expect__step-line {
            width: auto;
            flex: 1;
            height: 2px;
            min-height: auto;
          }

          .df-location__details {
            grid-template-columns: 1fr;
          }

          .df-faq__item {
            flex-direction: column;
            gap: 0.5rem;
          }

          .df-final-cta__buttons {
            flex-direction: column;
          }

          .df-final-cta__buttons .df-btn {
            width: 100%;
          }

          .df-final-cta__pricing {
            gap: 2rem;
          }

          .df-final-cta__trust {
            gap: 1rem;
          }
        }

        @media (max-width: 480px) {
          .df-hero__ticket {
            max-width: 280px;
          }

          .df-value__stat-value {
            font-size: 2rem;
          }

          .df-selector__note {
            flex-direction: column;
            text-align: center;
            gap: 0.75rem;
          }

          .df-instructor__image img {
            width: 100px;
            height: 100px;
          }

          .df-instructor__team-list {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </div>
  );
}

export default DiscoveryFlight;

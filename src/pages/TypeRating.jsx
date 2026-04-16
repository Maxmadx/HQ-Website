/**
 * TYPE RATING PAGE
 *
 * A comprehensive page for pilots who already have a PPL(H) and want to
 * fly different types of helicopters.
 *
 * Brand: Luxury Minimal Aviation
 * Typography: Space Grotesk + Share Tech Mono
 * Colors: #faf9f6 (warm white), #1a1a1a (charcoal), gradient text
 */

import React, { useRef, useEffect, useState } from 'react';
import { useFaqs } from '../hooks/useFaqs';
import { Link } from 'react-router-dom';
import { motion, useInView, useScroll, useTransform, AnimatePresence } from 'framer-motion';

// Import styles for Header/Navigation
import '../assets/css/main.css';
import '../assets/css/components.css';

// Import FooterMinimal component
import FooterMinimal from '../components/FooterMinimal';

/**
 * TYPE RATING PAGE HEADER COMPONENT
 * Spotlight animation header consistent with other final pages
 */
function TypeRatingHeader() {
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
              <li><Link to="/training/trial-lessons" onClick={closeMenu}>Trial Lessons</Link></li>
              <li><Link to="/training/ppl" onClick={closeMenu}>Private Pilot License</Link></li>
              <li><Link to="/training/type-rating" onClick={closeMenu}>Type Rating</Link></li>
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

// Animated counter component
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

// Aircraft card for fleet section - transforms into expanded view when selected
function AircraftCard({ aircraft, isActive, onClick, onEnquire }) {
  return (
    <motion.div
      className={`tr-aircraft-card ${isActive ? 'tr-aircraft-card--active' : ''}`}
      onClick={onClick}
      layout
      transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
    >
      <AnimatePresence mode="wait">
        {!isActive ? (
          // Collapsed State
          <motion.div
            key="collapsed"
            className="tr-aircraft-card__collapsed"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
          >
            <div className="tr-aircraft-card__image">
              <img src={aircraft.image} alt={aircraft.model} />
              <div className="tr-aircraft-card__overlay">
                <span className="tr-aircraft-card__select">Select Type</span>
              </div>
            </div>
            <div className="tr-aircraft-card__content">
              <h4 className="tr-aircraft-card__model">{aircraft.model}</h4>
              <div className="tr-aircraft-card__specs">
                {aircraft.specs.map((spec, i) => (
                  <div key={i} className="tr-aircraft-card__spec">
                    <span className="tr-aircraft-card__spec-value">{spec.value}</span>
                    <span className="tr-aircraft-card__spec-label">{spec.label}</span>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        ) : (
          // Expanded State
          <motion.div
            key="expanded"
            className="tr-aircraft-card__expanded"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
          >
            <div className="tr-aircraft-card__expanded-header">
              <div className="tr-aircraft-card__expanded-title">
                <h4>{aircraft.model} Type Rating</h4>
                <button
                  className="tr-aircraft-card__close"
                  onClick={(e) => { e.stopPropagation(); onClick(); }}
                >
                  ✕
                </button>
              </div>
            </div>

            <p className="tr-aircraft-card__expanded-desc">{aircraft.description}</p>

            <div className="tr-aircraft-card__expanded-specs">
              <div className="tr-aircraft-card__expanded-spec">
                <span className="tr-aircraft-card__expanded-value">{aircraft.groundHours}</span>
                <span className="tr-aircraft-card__expanded-label">Ground Hours</span>
              </div>
              <div className="tr-aircraft-card__expanded-spec">
                <span className="tr-aircraft-card__expanded-value">{aircraft.flightHours}</span>
                <span className="tr-aircraft-card__expanded-label">Flight Hours</span>
              </div>
              <div className="tr-aircraft-card__expanded-spec">
                <span className="tr-aircraft-card__expanded-value">1</span>
                <span className="tr-aircraft-card__expanded-label">Skill Test</span>
              </div>
            </div>

            <button
              type="button"
              className="tr-enquire-btn"
              aria-label={`Enquire about ${aircraft.model} type rating`}
              onClick={(e) => { e.stopPropagation(); onEnquire?.(aircraft.model); }}
            >
              <span className="tr-enquire-btn__icon">↗</span>
              <span className="tr-enquire-btn__title">Enquire About This Type Rating</span>
              <span className="tr-enquire-btn__sub">Tell us your experience level and goals. We'll get back to you within 24 hours.</span>
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

function TypeRating() {
  const heroRef = useRef(null);
  const [openFaq, setOpenFaq] = useState(null);
  const [selectedAircraft, setSelectedAircraft] = useState(0);

  // Enquiry form state
  const [enquiryAircraft, setEnquiryAircraft] = useState('');
  const [formVisible, setFormVisible] = useState(false);
  const [formData, setFormData] = useState({ name: '', email: '', phone: '', message: '' });
  const [formStatus, setFormStatus] = useState('idle'); // 'idle' | 'submitting' | 'success' | 'error'
  const enquiryFormRef = useRef(null);

  function handleEnquire(model) {
    setEnquiryAircraft(model);
    setFormStatus('idle');
    if (!formVisible) {
      setFormVisible(true);
      setTimeout(() => {
        enquiryFormRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }, 100);
    } else {
      enquiryFormRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }

  function handleFormChange(e) {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  }

  async function handleFormSubmit(e) {
    e.preventDefault();
    setFormStatus('submitting');
    try {
      const res = await fetch('/api/leads', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          phone: formData.phone,
          subject: `Type Rating — ${enquiryAircraft}`,
          message: formData.message,
          source: 'type-rating-page',
        }),
      });
      if (!res.ok) throw new Error('Submit failed');
      setFormStatus('success');
      setFormData({ name: '', email: '', phone: '', message: '' });
    } catch {
      setFormStatus('error');
    }
  }

  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ['start start', 'end start'],
  });

  // Scroll to top on mount
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const heroOpacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);
  const heroScale = useTransform(scrollYProgress, [0, 0.5], [1, 0.95]);
  const heroY = useTransform(scrollYProgress, [0, 0.5], [0, 100]);

  // Aircraft fleet data
  const fleet = [
    {
      model: 'Robinson R22',
      image: '/assets/images/fleet/r22-g-ulze.png',
      specs: [
        { value: '2', label: 'Seats' },
        { value: '102', label: 'Knots' },
        { value: '5', label: 'Min Hours' },
      ],
      description: 'The ideal training helicopter. Lightweight and responsive, the R22 teaches precision flying and develops sharp skills that transfer to any aircraft.',
      groundHours: 8,
      flightHours: 5,
    },
    {
      model: 'Robinson R44',
      image: '/assets/images/fleet/r44-g-mxpi.png',
      specs: [
        { value: '4', label: 'Seats' },
        { value: '130', label: 'Knots' },
        { value: '5', label: 'Min Hours' },
      ],
      description: 'The world\'s best-selling helicopter. Spacious, powerful, and versatile—perfect for touring, business travel, and family flying.',
      groundHours: 8,
      flightHours: 5,
    },
    {
      model: 'Robinson R66',
      image: '/assets/images/fleet/r66-g-tlmi.png',
      specs: [
        { value: '5', label: 'Seats' },
        { value: '140', label: 'Knots' },
        { value: '5', label: 'Min Hours' },
      ],
      description: 'Turbine power and unmatched performance. The R66 delivers exceptional range, speed, and reliability for serious pilots.',
      groundHours: 10,
      flightHours: 5,
    },
    {
      model: 'Hughes 500',
      image: '/assets/images/fleet/hughes-500.jpg',
      specs: [
        { value: '5', label: 'Seats' },
        { value: '130', label: 'Knots' },
        { value: '5', label: 'Min Hours' },
      ],
      description: 'The iconic light turbine helicopter. Renowned for its agility and performance, the Hughes 500 is a favourite among experienced pilots seeking a responsive, capable aircraft.',
      groundHours: 10,
      flightHours: 5,
    },
    {
      model: 'AS350 Squirrel',
      image: '/assets/images/fleet/as350-squirrel.jpg',
      specs: [
        { value: '6', label: 'Seats' },
        { value: '130', label: 'Knots' },
        { value: '5', label: 'Min Hours' },
      ],
      description: 'The legendary single-engine workhorse. The AS350 combines exceptional performance with proven reliability—a favourite for utility, tours, and aerial work worldwide.',
      groundHours: 10,
      flightHours: 5,
    },
    {
      model: 'Bell 407',
      image: '/assets/images/fleet/bell-407.jpg',
      specs: [
        { value: '7', label: 'Seats' },
        { value: '140', label: 'Knots' },
        { value: '5', label: 'Min Hours' },
      ],
      description: 'Premium single-turbine performance. The Bell 407 combines spacious cabin comfort with outstanding power and speed—a favourite for corporate and charter operations.',
      groundHours: 12,
      flightHours: 5,
    },
  ];

  // Training process steps
  const processSteps = [
    {
      num: '01',
      title: 'Ground School',
      duration: '1-2 Days',
      description: 'Comprehensive aircraft systems training covering the specific type\'s engine, avionics, performance data, and emergency procedures.',
    },
    {
      num: '02',
      title: 'Flight Training',
      duration: '5+ Hours',
      description: 'Hands-on flight instruction covering normal operations, emergency procedures, and developing proficiency on the new type.',
    },
    {
      num: '03',
      title: 'Skill Test',
      duration: '1-2 Hours',
      description: 'Final assessment with a CAA examiner demonstrating your competency on the aircraft type.',
    },
    {
      num: '04',
      title: 'Certification',
      duration: 'Same Day',
      description: 'Upon successful completion, the type rating is added to your license and you\'re cleared to fly.',
    },
  ];

  const { faqs } = useFaqs('type-rating', { visibleOnly: true });

  // Prerequisites
  const prerequisites = [
    { icon: '✓', text: 'Valid PPL(H) or higher license' },
    { icon: '✓', text: 'Valid Class 2 Medical or LAPL Medical' },
    { icon: '✓', text: 'Pilot logbook with flight history' },
    { icon: '✓', text: 'Passport or ID for CAA verification' },
  ];

  return (
    <div className="tr">
      <TypeRatingHeader />

      {/* ========== HERO SECTION ========== */}
      <section ref={heroRef} className="tr-hero">
        <motion.div
          className="tr-hero__bg"
          initial={{ scale: 1.1, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 1.5 }}
        >
          <img src="/assets/images/fleet/r66-turbine-flying.jpg" alt="Robinson R66 in flight" />
        </motion.div>
        <div className="tr-hero__overlay" />

        <motion.div
          className="tr-hero__content"
          style={{ opacity: heroOpacity, scale: heroScale, y: heroY }}
        >
          <div className="tr-hero__left">
            <motion.span
              className="tr-hero__label"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              Advanced Training
            </motion.span>

            <div className="tr-hero__headline">
              <motion.span
                className="tr-hero__word tr-hero__word--1"
                initial={{ opacity: 0, y: 40 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.4, ease: [0.16, 1, 0.3, 1] }}
              >
                TYPE
              </motion.span>
              <motion.span
                className="tr-hero__word tr-hero__word--2"
                initial={{ opacity: 0, y: 40 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.6, ease: [0.16, 1, 0.3, 1] }}
              >
                RATING
              </motion.span>
            </div>

            <motion.div
              className="tr-hero__divider-line"
              initial={{ scaleX: 0 }}
              animate={{ scaleX: 1 }}
              transition={{ duration: 0.8, delay: 0.8, ease: [0.16, 1, 0.3, 1] }}
            />

            {/* Type Rating Badge Card */}
            <motion.div
              className="tr-hero__badge"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1, duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            >
              <div className="tr-hero__badge-header">
                <span className="tr-hero__badge-label">Qualification</span>
                <span className="tr-hero__badge-type">TYPE RATING</span>
              </div>
              <div className="tr-hero__badge-content">
                <div className="tr-hero__badge-stat">
                  <span className="tr-hero__badge-num">5+</span>
                  <span className="tr-hero__badge-desc">Min Flight Hours</span>
                </div>
                <div className="tr-hero__badge-divider" />
                <div className="tr-hero__badge-stat">
                  <span className="tr-hero__badge-num">3-5</span>
                  <span className="tr-hero__badge-desc">Days Duration</span>
                </div>
              </div>
            </motion.div>

            <motion.p
              className="tr-hero__sub"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.2 }}
            >
              Expand your flying capabilities. Get certified to fly different helicopter types with our comprehensive type rating courses.
            </motion.p>
          </div>
        </motion.div>
      </section>

      {/* ========== WHAT IS TYPE RATING ========== */}
      <section className="tr-intro">
        <div className="tr-intro__container">
          <Reveal>
            <div className="tr-intro__header">
              <span className="tr-pre-text">Expand Your Horizons</span>
              <h2>
                <span className="tr-text--dark">Fly</span>{' '}
                <span className="tr-text--mid">Different</span>{' '}
                <span className="tr-text--light">Types</span>
              </h2>
              <p>
                Having achieved your PPL(H), you may wish to fly different types of helicopter.
                A type-specific ground training course followed by a minimum of 5 hours of flight
                training will prepare you for the Type Rating test, adding new aircraft to your license.
              </p>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ========== FLEET / AIRCRAFT SELECTION ========== */}
      <section className="tr-fleet" id="fleet">
        <div className="tr-fleet__container">
          <div className="tr-fleet__grid">
            {fleet.map((aircraft, i) => (
              <Reveal key={i} delay={i * 0.1}>
                <AircraftCard
                  aircraft={aircraft}
                  isActive={selectedAircraft === i}
                  onClick={() => setSelectedAircraft(selectedAircraft === i ? null : i)}
                  onEnquire={handleEnquire}
                />
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ========== ENQUIRY FORM ========== */}
      <AnimatePresence>
        {formVisible && (
          <motion.section
            ref={enquiryFormRef}
            className="tr-enquiry"
            key="enquiry-form"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1, transitionEnd: { overflow: 'visible' } }}
            exit={{ height: 0, opacity: 0, overflow: 'hidden' }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
            style={{ overflow: 'hidden' }}
          >
            <div className="tr-enquiry__container">
              {formStatus === 'success' ? (
                <div className="tr-enquiry__success">
                  <span className="tr-enquiry__success-icon">✓</span>
                  <h3>Enquiry Sent</h3>
                  <p>We'll be in touch within 24 hours.</p>
                  <button
                    type="button"
                    className="tr-btn tr-btn--outline"
                    onClick={() => { setFormStatus('idle'); setFormVisible(false); }}
                  >
                    Close
                  </button>
                </div>
              ) : (
                <>
                  <div className="tr-enquiry__header">
                    <span className="tr-pre-text">Type Rating Enquiry</span>
                    <h2>
                      <span className="tr-text--dark">{enquiryAircraft || 'Aircraft'}</span>
                    </h2>
                  </div>

                  <form className="tr-enquiry__form" onSubmit={handleFormSubmit} noValidate>
                    <div className="tr-enquiry__field tr-enquiry__field--readonly">
                      <label htmlFor="enq-aircraft">Aircraft</label>
                      <input id="enq-aircraft" type="text" value={enquiryAircraft} readOnly aria-readonly="true" />
                    </div>

                    <div className="tr-enquiry__row">
                      <div className="tr-enquiry__field">
                        <label htmlFor="enq-name">Name <span aria-hidden="true">*</span></label>
                        <input
                          id="enq-name"
                          type="text"
                          name="name"
                          value={formData.name}
                          onChange={handleFormChange}
                          required
                          placeholder="Your full name"
                        />
                      </div>
                      <div className="tr-enquiry__field">
                        <label htmlFor="enq-email">Email <span aria-hidden="true">*</span></label>
                        <input
                          id="enq-email"
                          type="email"
                          name="email"
                          value={formData.email}
                          onChange={handleFormChange}
                          required
                          placeholder="your@email.com"
                        />
                      </div>
                    </div>

                    <div className="tr-enquiry__field">
                      <label htmlFor="enq-phone">Phone</label>
                      <input
                        id="enq-phone"
                        type="tel"
                        name="phone"
                        value={formData.phone}
                        onChange={handleFormChange}
                        placeholder="+44 7700 000000"
                      />
                    </div>

                    <div className="tr-enquiry__field">
                      <label htmlFor="enq-message">Message</label>
                      <textarea
                        id="enq-message"
                        name="message"
                        value={formData.message}
                        onChange={handleFormChange}
                        rows={4}
                        placeholder="Tell us about your experience and what you're hoping to achieve..."
                      />
                    </div>

                    {formStatus === 'error' && (
                      <p className="tr-enquiry__error" role="alert">
                        Something went wrong. Please try again or contact us directly.
                      </p>
                    )}

                    <button
                      type="submit"
                      className="tr-btn tr-btn--primary tr-btn--full"
                      disabled={formStatus === 'submitting'}
                    >
                      {formStatus === 'submitting' ? 'Sending...' : 'Send Enquiry'}
                    </button>
                  </form>
                </>
              )}
            </div>
          </motion.section>
        )}
      </AnimatePresence>

      {/* ========== TRAINING PROCESS ========== */}
      <section className="tr-process">
        <div className="tr-process__container">
          <Reveal>
            <div className="tr-section-header tr-section-header--light">
              <span className="tr-pre-text tr-pre-text--light">The Journey</span>
              <h2>
                <span className="tr-text--white">Training</span>{' '}
                <span className="tr-text--white-mid">Process</span>
              </h2>
            </div>
          </Reveal>

          <div className="tr-process__steps">
            {processSteps.map((step, i) => (
              <Reveal key={i} delay={i * 0.1}>
                <div className="tr-process__step">
                  <div className="tr-process__step-num">{step.num}</div>
                  <div className="tr-process__step-content">
                    <div className="tr-process__step-header">
                      <h4>{step.title}</h4>
                      <span className="tr-process__step-duration">{step.duration}</span>
                    </div>
                    <p>{step.description}</p>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>

          <Reveal delay={0.5}>
            <div className="tr-process__timeline">
              <div className="tr-process__timeline-track">
                {processSteps.map((_, i) => (
                  <React.Fragment key={i}>
                    <div className="tr-process__timeline-dot" />
                    {i < processSteps.length - 1 && <div className="tr-process__timeline-line" />}
                  </React.Fragment>
                ))}
              </div>
              <div className="tr-process__timeline-label">
                <span>Start</span>
                <span>3-5 Days</span>
                <span>Certified</span>
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ========== FAQ SECTION ========== */}
      {faqs.length > 0 && (
        <section className="tr-faq" data-cms-section="faqs-type-rating">
          <div className="tr-faq__container">
            <Reveal>
              <div className="tr-section-header">
                <span className="tr-pre-text">Common Questions</span>
                <h2>
                  <span className="tr-text--dark">Frequently</span>{' '}
                  <span className="tr-text--mid">Asked</span>
                </h2>
              </div>
            </Reveal>

            <div className="tr-faq__list">
              {faqs.map((faq, i) => (
                <Reveal key={faq.id} delay={i * 0.05}>
                  <div
                    className={`tr-faq__item ${openFaq === i ? 'tr-faq__item--open' : ''}`}
                    onClick={() => setOpenFaq(openFaq === i ? null : i)}
                  >
                    <span className="tr-faq__number">{String(i + 1).padStart(2, '0')}</span>
                    <div className="tr-faq__content">
                      <h4>
                        {faq.question}
                        <span className="tr-faq__toggle">{openFaq === i ? '−' : '+'}</span>
                      </h4>
                      <motion.div
                        className="tr-faq__answer"
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
        </section>
      )}

      {/* ========== CTA SECTION ========== */}
      <section className="tr-cta">
        <div className="tr-cta__inner">
          <div className="tr-cta__image">
            <motion.img
              src="/assets/images/gallery/carousel/rotating6.jpg"
              alt="Helicopter flying"
              initial={{ scale: 1.05 }}
              whileInView={{ scale: 1 }}
              transition={{ duration: 1.5, ease: [0.16, 1, 0.3, 1] }}
              viewport={{ once: true }}
            />
            <div className="tr-cta__image-overlay" />
          </div>

          <div className="tr-cta__content">
            <Reveal>
              <span className="tr-pre-text tr-pre-text--light">Ready to Expand?</span>
              <h2>
                <span className="tr-text--white">Start Your</span>{' '}
                <span className="tr-text--white-mid">Type Rating</span>
              </h2>
              <p>
                Get in touch to discuss your type rating goals. Our team will help you
                choose the right aircraft and create a training schedule that works for you.
              </p>
              <div className="tr-cta__buttons">
                <a href="/contact?subject=type-rating" className="tr-btn tr-btn--primary tr-btn--white">
                  Contact Us
                </a>
                <Link to="/training" className="tr-cta__link">
                  View All Training
                  <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                    <path d="M6 3L11 8L6 13" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </Link>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* ========== FOOTER ========== */}
      <FooterMinimal />

      {/* ========== STYLES ========== */}
      <style>{`
        /* ===== BASE ===== */
        .tr {
          font-family: 'Space Grotesk', -apple-system, sans-serif;
          background: var(--hq-background, #faf9f6);
          color: #1a1a1a;
          overflow-x: hidden;
        }

        .tr-pre-text {
          display: block;
          font-size: 0.7rem;
          text-transform: uppercase;
          letter-spacing: 0.25em;
          color: #999;
          margin-bottom: 1rem;
        }

        .tr-pre-text--light {
          color: rgba(255,255,255,0.5);
        }

        .tr-text--dark { color: #1a1a1a; }
        .tr-text--mid { color: #4a4a4a; }
        .tr-text--light { color: #7a7a7a; }
        .tr-text--white { color: #ffffff; }
        .tr-text--white-mid { color: rgba(255,255,255,0.6); }

        .tr-section-header {
          text-align: center;
          max-width: 700px;
          margin: 0 auto 3rem;
        }

        .tr-section-header h2 {
          font-size: clamp(2rem, 4vw, 3rem);
          margin: 0.5rem 0 1rem;
          line-height: 1.1;
          text-transform: uppercase;
          font-weight: 700;
        }

        .tr-section-header p {
          color: #666;
          font-size: 1.1rem;
          line-height: 1.7;
        }

        .tr-section-header--light p {
          color: rgba(255,255,255,0.7);
        }

        /* Buttons */
        .tr-btn {
          display: inline-block;
          padding: 1rem 2rem;
          font-size: 0.75rem;
          font-weight: 500;
          text-decoration: none;
          text-transform: uppercase;
          letter-spacing: 0.1em;
          border: none;
          cursor: pointer;
          transition: all 0.3s ease;
          font-family: inherit;
          text-align: center;
        }

        .tr-btn--primary {
          background: #1a1a1a;
          color: #fff;
        }

        .tr-btn--primary:hover {
          background: #333;
          color: #fff;
        }

        .tr-btn--white {
          background: #fff;
          color: #1a1a1a;
        }

        .tr-btn--white:hover {
          background: #f0f0f0;
        }

        .tr-btn--outline {
          background: transparent;
          color: #1a1a1a;
          border: 2px solid #1a1a1a;
        }

        .tr-btn--outline:hover {
          background: #1a1a1a;
          color: #fff;
        }

        .tr-btn--full {
          width: 100%;
        }

        /* ===== HERO ===== */
        .tr-hero {
          min-height: 100vh;
          position: relative;
          display: flex;
          flex-direction: column;
          overflow: hidden;
          background: var(--hq-background, #faf9f6);
        }

        .tr-hero__bg {
          position: absolute;
          inset: 0;
          z-index: 1;
        }

        .tr-hero__bg img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }

        .tr-hero__overlay {
          position: absolute;
          inset: 0;
          z-index: 2;
          background: linear-gradient(90deg, rgba(250,249,246,0.97) 0%, rgba(250,249,246,0.92) 45%, rgba(250,249,246,0.4) 100%);
        }

        .tr-hero__content {
          position: relative;
          z-index: 3;
          flex: 1;
          display: flex;
          align-items: center;
          padding: 2rem 4rem;
        }

        .tr-hero__left {
          max-width: 550px;
        }

        .tr-hero__label {
          font-size: 0.7rem;
          font-weight: 400;
          letter-spacing: 0.2em;
          text-transform: uppercase;
          color: #999;
          display: block;
          margin-bottom: 1.5rem;
        }

        .tr-hero__headline {
          display: flex;
          flex-direction: column;
          line-height: 1;
          margin-bottom: 1.5rem;
        }

        .tr-hero__word {
          font-family: 'Space Grotesk', sans-serif;
          font-weight: 700;
          font-size: clamp(3rem, 8vw, 5.5rem);
          letter-spacing: -0.02em;
          text-transform: uppercase;
        }

        .tr-hero__word--1 { color: #1a1a1a; }
        .tr-hero__word--2 { color: #4a4a4a; }

        .tr-hero__divider-line {
          width: 80px;
          height: 2px;
          background: #1a1a1a;
          margin-bottom: 1.5rem;
          transform-origin: left;
        }

        .tr-hero__sub {
          font-size: 1.1rem;
          color: #666;
          line-height: 1.8;
          max-width: 420px;
        }

        /* Hero Badge Card */
        .tr-hero__badge {
          background: #fff;
          max-width: 280px;
          margin-bottom: 1.5rem;
          box-shadow: 0 4px 20px rgba(0,0,0,0.08);
          border-radius: 8px;
          overflow: hidden;
          border: 1px solid #e8e6e2;
        }

        .tr-hero__badge-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 0.75rem 1rem;
          border-bottom: 1px solid #f0f0f0;
        }

        .tr-hero__badge-label {
          font-size: 0.55rem;
          letter-spacing: 0.15em;
          color: #999;
          text-transform: uppercase;
        }

        .tr-hero__badge-type {
          font-size: 0.6rem;
          font-weight: 700;
          letter-spacing: 0.1em;
          color: #1a1a1a;
          background: #f5f5f2;
          padding: 0.15rem 0.5rem;
        }

        .tr-hero__badge-content {
          display: flex;
          align-items: center;
          justify-content: space-around;
          padding: 1rem;
        }

        .tr-hero__badge-stat {
          text-align: center;
        }

        .tr-hero__badge-num {
          display: block;
          font-family: 'Share Tech Mono', monospace;
          font-size: 1.5rem;
          font-weight: 700;
          color: #1a1a1a;
          line-height: 1;
        }

        .tr-hero__badge-desc {
          font-size: 0.55rem;
          color: #888;
          text-transform: uppercase;
          letter-spacing: 0.05em;
        }

        .tr-hero__badge-divider {
          width: 1px;
          height: 30px;
          background: linear-gradient(to bottom, transparent, #e8e6e2, transparent);
        }

        /* ===== INTRO SECTION ===== */
        .tr-intro {
          padding: 5rem 2rem;
          background: #fff;
          position: relative;
        }

        .tr-intro::before {
          content: '';
          position: absolute;
          top: 0;
          left: 50%;
          transform: translateX(-50%);
          width: min(80%, 600px);
          height: 1px;
          background: linear-gradient(90deg, transparent, #e0deda, transparent);
        }

        .tr-intro__container {
          max-width: 1100px;
          margin: 0 auto;
        }

        .tr-intro__header {
          text-align: center;
          max-width: 700px;
          margin: 0 auto 3rem;
        }

        .tr-intro__header h2 {
          font-size: clamp(1.75rem, 3.5vw, 2.5rem);
          margin: 0.5rem 0 1rem;
          text-transform: uppercase;
          font-weight: 700;
        }

        .tr-intro__header p {
          color: #666;
          font-size: 1.05rem;
          line-height: 1.7;
        }

        .tr-intro__grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 1.5rem;
        }

        .tr-intro__card {
          background: var(--hq-background, #faf9f6);
          padding: 2rem;
          border-left: 3px solid #1a1a1a;
          position: relative;
        }

        .tr-intro__card-num {
          font-family: 'Share Tech Mono', monospace;
          font-size: 0.7rem;
          color: #ccc;
          margin-bottom: 1rem;
        }

        .tr-intro__card h3 {
          font-size: 1.1rem;
          font-weight: 600;
          margin: 0 0 0.75rem;
          text-transform: uppercase;
        }

        .tr-intro__card p {
          font-size: 0.9rem;
          color: #666;
          line-height: 1.6;
          margin: 0;
        }

        /* ===== PREREQUISITES ===== */
        .tr-prereq {
          padding: 5rem 2rem;
          background: var(--hq-background, #faf9f6);
        }

        .tr-prereq__container {
          max-width: 900px;
          margin: 0 auto;
        }

        .tr-prereq__content {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 2rem;
        }

        .tr-prereq__list {
          display: flex;
          flex-direction: column;
          gap: 1rem;
        }

        .tr-prereq__item {
          display: flex;
          align-items: center;
          gap: 1rem;
          padding: 1rem 1.5rem;
          background: #fff;
          border: 1px solid #e8e6e2;
          border-radius: 4px;
        }

        .tr-prereq__icon {
          width: 24px;
          height: 24px;
          display: flex;
          align-items: center;
          justify-content: center;
          background: #1a1a1a;
          color: #fff;
          font-size: 0.75rem;
          border-radius: 50%;
          flex-shrink: 0;
        }

        .tr-prereq__text {
          font-size: 0.95rem;
          color: #1a1a1a;
        }

        .tr-prereq__note {
          background: #fff;
          border-left: 3px solid #1a1a1a;
          padding: 1.5rem;
        }

        .tr-prereq__note-label {
          display: block;
          font-size: 0.65rem;
          text-transform: uppercase;
          letter-spacing: 0.15em;
          color: #999;
          margin-bottom: 0.75rem;
        }

        .tr-prereq__note p {
          font-size: 0.95rem;
          color: #666;
          line-height: 1.7;
          margin: 0;
        }

        /* ===== FLEET SECTION ===== */
        .tr-fleet {
          padding: 5rem 2rem;
          background: #fff;
          position: relative;
        }

        .tr-fleet::before {
          content: '';
          position: absolute;
          top: 0;
          left: 50%;
          transform: translateX(-50%);
          width: min(80%, 600px);
          height: 1px;
          background: linear-gradient(90deg, transparent, #e0deda, transparent);
        }

        .tr-fleet__container {
          max-width: 1100px;
          margin: 0 auto;
        }

        .tr-fleet__grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 1.5rem;
        }

        /* Aircraft Card - Transforms when selected */
        .tr-aircraft-card {
          background: var(--hq-background, #faf9f6);
          border: 2px solid transparent;
          border-radius: 8px;
          overflow: hidden;
          cursor: pointer;
          transition: border-color 0.3s ease, box-shadow 0.3s ease;
        }

        .tr-aircraft-card:hover {
          border-color: #e8e6e2;
        }

        .tr-aircraft-card--active {
          background: #1a1a1a;
          border-color: #1a1a1a;
          box-shadow: 0 12px 40px rgba(0,0,0,0.2);
        }

        /* Collapsed State */
        .tr-aircraft-card__collapsed {
          display: flex;
          flex-direction: column;
        }

        .tr-aircraft-card__image {
          position: relative;
          aspect-ratio: 16/10;
          overflow: hidden;
        }

        .tr-aircraft-card__image img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          transition: transform 0.5s ease;
        }

        .tr-aircraft-card:hover .tr-aircraft-card__image img {
          transform: scale(1.05);
        }

        .tr-aircraft-card__overlay {
          position: absolute;
          inset: 0;
          background: rgba(0,0,0,0.4);
          display: flex;
          align-items: center;
          justify-content: center;
          opacity: 0;
          transition: opacity 0.3s ease;
        }

        .tr-aircraft-card:hover .tr-aircraft-card__overlay {
          opacity: 1;
        }

        .tr-aircraft-card__select {
          font-size: 0.7rem;
          text-transform: uppercase;
          letter-spacing: 0.1em;
          color: #fff;
          padding: 0.5rem 1rem;
          border: 1px solid #fff;
        }

        .tr-aircraft-card__content {
          padding: 1.25rem;
        }

        .tr-aircraft-card__model {
          font-size: 1rem;
          font-weight: 600;
          margin: 0 0 1rem;
          text-transform: uppercase;
        }

        .tr-aircraft-card__specs {
          display: flex;
          gap: 1.5rem;
        }

        .tr-aircraft-card__spec {
          text-align: center;
        }

        .tr-aircraft-card__spec-value {
          display: block;
          font-family: 'Share Tech Mono', monospace;
          font-size: 1.1rem;
          font-weight: 700;
          color: #1a1a1a;
        }

        .tr-aircraft-card__spec-label {
          font-size: 0.6rem;
          color: #999;
          text-transform: uppercase;
          letter-spacing: 0.1em;
        }

        /* Expanded State */
        .tr-aircraft-card__expanded {
          padding: 1.5rem;
        }

        .tr-aircraft-card__expanded-header {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          margin-bottom: 1rem;
        }

        .tr-aircraft-card__expanded-title {
          display: flex;
          align-items: center;
          gap: 1rem;
        }

        .tr-aircraft-card__expanded-title h4 {
          font-size: 1.1rem;
          font-weight: 600;
          margin: 0;
          color: #fff;
          text-transform: uppercase;
        }

        .tr-aircraft-card__close {
          background: rgba(255,255,255,0.1);
          border: none;
          color: rgba(255,255,255,0.6);
          width: 28px;
          height: 28px;
          border-radius: 50%;
          cursor: pointer;
          font-size: 0.8rem;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: all 0.2s ease;
        }

        .tr-aircraft-card__close:hover {
          background: rgba(255,255,255,0.2);
          color: #fff;
        }

        .tr-aircraft-card__expanded-desc {
          font-size: 0.9rem;
          color: rgba(255,255,255,0.7);
          line-height: 1.6;
          margin: 0 0 1.25rem;
        }

        .tr-aircraft-card__expanded-specs {
          display: flex;
          gap: 2rem;
          margin-bottom: 1.5rem;
          padding: 1.25rem 0;
          border-top: 1px solid rgba(255,255,255,0.15);
          border-bottom: 1px solid rgba(255,255,255,0.15);
        }

        .tr-aircraft-card__expanded-spec {
          text-align: center;
        }

        .tr-aircraft-card__expanded-value {
          display: block;
          font-family: 'Share Tech Mono', monospace;
          font-size: 1.5rem;
          font-weight: 700;
          color: #fff;
          line-height: 1;
          margin-bottom: 0.35rem;
        }

        .tr-aircraft-card__expanded-label {
          font-size: 0.6rem;
          color: rgba(255,255,255,0.5);
          text-transform: uppercase;
          letter-spacing: 0.1em;
        }

        .tr-btn--small {
          padding: 0.75rem 1.5rem;
          font-size: 0.7rem;
        }

        /* ===== PROCESS SECTION ===== */
        .tr-process {
          padding: 5rem 2rem;
          background: #1a1a1a;
        }

        .tr-process__container {
          max-width: 900px;
          margin: 0 auto;
        }

        .tr-process__steps {
          display: flex;
          flex-direction: column;
          gap: 0;
        }

        .tr-process__step {
          display: flex;
          gap: 1.5rem;
          padding: 1.5rem 0;
          border-bottom: 1px solid rgba(255,255,255,0.1);
        }

        .tr-process__step:last-child {
          border-bottom: none;
        }

        .tr-process__step-num {
          font-family: 'Share Tech Mono', monospace;
          font-size: 0.75rem;
          color: rgba(255,255,255,0.3);
          flex-shrink: 0;
          padding-top: 0.2rem;
        }

        .tr-process__step-content {
          flex: 1;
        }

        .tr-process__step-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 0.5rem;
        }

        .tr-process__step-header h4 {
          font-size: 1rem;
          font-weight: 600;
          margin: 0;
          color: #fff;
          text-transform: uppercase;
        }

        .tr-process__step-duration {
          font-family: 'Share Tech Mono', monospace;
          font-size: 0.7rem;
          color: rgba(255,255,255,0.5);
          letter-spacing: 0.1em;
        }

        .tr-process__step-content p {
          font-size: 0.9rem;
          color: rgba(255,255,255,0.6);
          line-height: 1.6;
          margin: 0;
        }

        /* Process Timeline */
        .tr-process__timeline {
          margin-top: 3rem;
          padding-top: 2rem;
          border-top: 1px solid rgba(255,255,255,0.1);
        }

        .tr-process__timeline-track {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 1rem;
        }

        .tr-process__timeline-dot {
          width: 12px;
          height: 12px;
          background: #fff;
          border-radius: 50%;
        }

        .tr-process__timeline-line {
          flex: 1;
          height: 2px;
          background: linear-gradient(90deg, #fff, rgba(255,255,255,0.3));
        }

        .tr-process__timeline-label {
          display: flex;
          justify-content: space-between;
          font-size: 0.65rem;
          color: rgba(255,255,255,0.5);
          text-transform: uppercase;
          letter-spacing: 0.15em;
        }

        /* ===== PRICING SECTION ===== */
        .tr-pricing {
          padding: 5rem 2rem;
          background: var(--hq-background, #faf9f6);
        }

        .tr-pricing__container {
          max-width: 1100px;
          margin: 0 auto;
        }

        .tr-pricing__grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 1.5rem;
          margin-bottom: 2rem;
        }

        .tr-pricing__card {
          background: #fff;
          border: 1px solid #e8e6e2;
          border-radius: 8px;
          padding: 2rem;
          display: flex;
          flex-direction: column;
        }

        .tr-pricing__card-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 1.5rem;
        }

        .tr-pricing__card-type {
          font-size: 1rem;
          font-weight: 600;
          text-transform: uppercase;
        }

        .tr-pricing__card-badge {
          font-size: 0.55rem;
          text-transform: uppercase;
          letter-spacing: 0.1em;
          color: #666;
          background: #f5f5f2;
          padding: 0.25rem 0.5rem;
          border-radius: 2px;
        }

        .tr-pricing__card-price {
          margin-bottom: 1.5rem;
        }

        .tr-pricing__card-from {
          display: block;
          font-size: 0.65rem;
          text-transform: uppercase;
          letter-spacing: 0.15em;
          color: #999;
          margin-bottom: 0.25rem;
        }

        .tr-pricing__card-amount {
          font-family: 'Share Tech Mono', monospace;
          font-size: 2.5rem;
          font-weight: 700;
          color: #1a1a1a;
        }

        .tr-pricing__card-includes {
          flex: 1;
          margin-bottom: 1.5rem;
        }

        .tr-pricing__card-includes-label {
          display: block;
          font-size: 0.65rem;
          text-transform: uppercase;
          letter-spacing: 0.15em;
          color: #999;
          margin-bottom: 0.75rem;
        }

        .tr-pricing__card-includes ul {
          list-style: none;
          padding: 0;
          margin: 0;
        }

        .tr-pricing__card-includes li {
          font-size: 0.85rem;
          color: #666;
          padding: 0.4rem 0;
          border-bottom: 1px solid #f0f0f0;
          position: relative;
          padding-left: 1.25rem;
        }

        .tr-pricing__card-includes li::before {
          content: '✓';
          position: absolute;
          left: 0;
          color: #1a1a1a;
          font-size: 0.7rem;
        }

        .tr-pricing__card-includes li:last-child {
          border-bottom: none;
        }

        .tr-pricing__note {
          text-align: center;
          max-width: 700px;
          margin: 0 auto;
        }

        .tr-pricing__note p {
          font-size: 0.9rem;
          color: #888;
          line-height: 1.6;
        }

        /* ===== WHY HQ SECTION ===== */
        .tr-why {
          background: #fff;
          position: relative;
        }

        .tr-why::before {
          content: '';
          position: absolute;
          top: 0;
          left: 50%;
          transform: translateX(-50%);
          width: min(80%, 600px);
          height: 1px;
          background: linear-gradient(90deg, transparent, #e0deda, transparent);
        }

        .tr-why__container {
          display: grid;
          grid-template-columns: 55% 45%;
          min-height: 500px;
        }

        .tr-why__content {
          padding: 4rem 3rem;
        }

        .tr-why__header {
          margin-bottom: 2.5rem;
        }

        .tr-why__header h2 {
          font-size: clamp(1.75rem, 3.5vw, 2.5rem);
          margin: 0.5rem 0 0;
          text-transform: uppercase;
          font-weight: 700;
        }

        .tr-why__grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 1.5rem;
        }

        .tr-why__item {
          display: flex;
          gap: 1rem;
        }

        .tr-why__item-icon {
          width: 48px;
          height: 48px;
          background: #1a1a1a;
          color: #fff;
          display: flex;
          align-items: center;
          justify-content: center;
          font-family: 'Share Tech Mono', monospace;
          font-size: 0.85rem;
          font-weight: 700;
          flex-shrink: 0;
        }

        .tr-why__item-text h4 {
          font-size: 0.9rem;
          font-weight: 600;
          margin: 0 0 0.25rem;
          text-transform: uppercase;
        }

        .tr-why__item-text p {
          font-size: 0.85rem;
          color: #666;
          line-height: 1.5;
          margin: 0;
        }

        .tr-why__image {
          position: relative;
          overflow: hidden;
        }

        .tr-why__image img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }

        /* ===== FAQ SECTION ===== */
        .tr-faq {
          padding: 5rem 2rem;
          background: var(--hq-background, #faf9f6);
        }

        .tr-faq__container {
          max-width: 800px;
          margin: 0 auto;
        }

        .tr-faq__list {
          display: flex;
          flex-direction: column;
        }

        .tr-faq__item {
          display: flex;
          gap: 1.5rem;
          padding: 1.25rem 0;
          border-bottom: 1px solid #e8e6e2;
          cursor: pointer;
          transition: background 0.2s ease;
        }

        .tr-faq__item:hover {
          background: rgba(0,0,0,0.01);
        }

        .tr-faq__item--open {
          background: rgba(0,0,0,0.02);
        }

        .tr-faq__number {
          font-family: 'Share Tech Mono', monospace;
          font-size: 0.75rem;
          color: #ccc;
          flex-shrink: 0;
          padding-top: 0.1rem;
        }

        .tr-faq__content {
          flex: 1;
        }

        .tr-faq__content h4 {
          margin: 0;
          font-size: 1rem;
          font-weight: 600;
          display: flex;
          justify-content: space-between;
          align-items: center;
          gap: 1rem;
        }

        .tr-faq__toggle {
          font-size: 1.25rem;
          font-weight: 300;
          color: #999;
          flex-shrink: 0;
        }

        .tr-faq__answer {
          overflow: hidden;
        }

        .tr-faq__answer p {
          margin: 0.75rem 0 0;
          color: #666;
          line-height: 1.7;
          font-size: 0.95rem;
        }

        /* ===== CTA SECTION ===== */
        .tr-cta {
          background: #1a1a1a;
          position: relative;
          overflow: hidden;
        }

        .tr-cta__inner {
          display: grid;
          grid-template-columns: 40% 60%;
          min-height: 400px;
        }

        .tr-cta__image {
          position: relative;
          overflow: hidden;
        }

        .tr-cta__image img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }

        .tr-cta__image-overlay {
          position: absolute;
          inset: 0;
          background: linear-gradient(90deg, transparent 0%, rgba(26,26,26,0.5) 100%);
        }

        .tr-cta__content {
          padding: 3rem;
          display: flex;
          flex-direction: column;
          justify-content: center;
          color: #fff;
        }

        .tr-cta__content h2 {
          font-size: clamp(1.75rem, 3.5vw, 2.5rem);
          font-weight: 700;
          text-transform: uppercase;
          line-height: 1.1;
          margin: 0.5rem 0 1.5rem;
        }

        .tr-cta__content p {
          color: rgba(255,255,255,0.7);
          font-size: 1rem;
          line-height: 1.7;
          margin-bottom: 2rem;
          max-width: 450px;
        }

        .tr-cta__buttons {
          display: flex;
          align-items: center;
          gap: 2rem;
        }

        .tr-cta__link {
          display: inline-flex;
          align-items: center;
          gap: 0.5rem;
          font-size: 0.75rem;
          text-transform: uppercase;
          letter-spacing: 0.1em;
          color: rgba(255,255,255,0.7);
          text-decoration: none;
          transition: color 0.3s ease;
        }

        .tr-cta__link:hover {
          color: #fff;
        }

        .tr-cta__link svg {
          transition: transform 0.3s ease;
        }

        .tr-cta__link:hover svg {
          transform: translateX(3px);
        }

        /* ===== RESPONSIVE ===== */
        @media (max-width: 1024px) {
          .tr-intro__grid,
          .tr-fleet__grid,
          .tr-pricing__grid {
            grid-template-columns: 1fr;
          }

          .tr-prereq__content {
            grid-template-columns: 1fr;
          }

          .tr-why__container {
            grid-template-columns: 1fr;
          }

          .tr-why__image {
            height: 300px;
          }

          .tr-cta__inner {
            grid-template-columns: 1fr;
          }

          .tr-cta__image {
            height: 250px;
          }
        }

        @media (max-width: 768px) {
          .tr-hero__content {
            padding: 6rem 2rem 2rem;
            justify-content: center;
          }

          .tr-hero__left {
            text-align: center;
            max-width: 100%;
          }

          .tr-hero__headline {
            align-items: center;
          }

          .tr-hero__divider-line {
            margin: 1.5rem auto;
          }

          .tr-hero__badge {
            margin: 0 auto 1.5rem;
          }

          .tr-hero__sub {
            margin: 0 auto;
            text-align: center;
          }

          .tr-hero__overlay {
            background: linear-gradient(180deg, rgba(250,249,246,0.97) 0%, rgba(250,249,246,0.92) 60%, rgba(250,249,246,0.7) 100%);
          }

          .tr-why__grid {
            grid-template-columns: 1fr;
          }

          .tr-why__content {
            padding: 3rem 2rem;
          }

          .tr-process__step {
            flex-direction: column;
            gap: 0.5rem;
          }

          .tr-fleet__details-breakdown {
            flex-direction: column;
            gap: 1rem;
          }

          .tr-fleet__details-divider {
            width: 40px;
            height: 1px;
          }

          .tr-faq__item {
            flex-direction: column;
            gap: 0.5rem;
          }

          .tr-cta__buttons {
            flex-direction: column;
            align-items: flex-start;
            gap: 1rem;
          }
        }
      `}</style>
    </div>
  );
}

export default TypeRating;

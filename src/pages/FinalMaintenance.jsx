/**
 * HQ AVIATION - FINAL MAINTENANCE PAGE
 * =====================================
 *
 * A premium, immersive maintenance page with 20 unique components
 * Brand: Luxury Minimal Aviation
 * Typography: Space Grotesk + Share Tech Mono
 * Colors: #faf9f6 (warm white), #1a1a1a (charcoal)
 *
 * COMPONENTS:
 * 01. Hero - Full viewport with animated grid + status board
 * 02. ScrollProgress - Fixed progress indicator
 * 03. StatsStrip - Animated counters with icons
 * 04. Philosophy - Split text with floating elements
 * 05. ServicesGrid - 3D hover cards for services
 * 06. Timeline - Maintenance history/milestones
 * 07. CertificationBadges - EASA/CAA badges with hover
 * 08. ProcessFlow - Step-by-step diagram
 * 09. TeamProfiles - Engineer spotlight cards with +team count
 * 10. FacilityShowcase - Parallax image gallery
 * 12. EquipmentGallery - Scrolling tool showcase
 * 14. MaintenanceSchedule - Interactive booking table
 * 15. PartsInventory - Technical specification cards
 * 18. ContactCTA - Split action section with AOG support
 * 20. EmergencySupport - 24/7 support highlight
 */

import React, { useRef, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, useInView, useScroll, useTransform, AnimatePresence } from 'framer-motion';

import '../assets/css/main.css';
import '../assets/css/components.css';
import { usePageText } from '../hooks/usePageText';
import { usePageImages } from '../hooks/usePageImages';
import { useCmsHighlight } from '../hooks/useCmsHighlight';
import FooterMinimal from '../components/FooterMinimal';
import FacilityGallery from '../components/Maintenance/FacilityGallery';
import PartsEnquiry from '../components/Maintenance/PartsEnquiry';

// ============================================
// UTILITY COMPONENTS
// ============================================

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
      transition={{ duration: 0.4, delay, ease: [0.16, 1, 0.3, 1] }}
    >
      {children}
    </motion.div>
  );
}

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

// ============================================
// HEADER COMPONENT
// ============================================

function MaintenanceHeader() {
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
              <li><Link to="/sales" onClick={closeMenu}>New Aircraft</Link></li>
              <li><Link to="/sales/r66" onClick={closeMenu}>Robinson R66</Link></li>
              <li><Link to="/sales/r44" onClick={closeMenu}>Robinson R44</Link></li>
              <li><Link to="/sales/r22" onClick={closeMenu}>Robinson R22</Link></li>
            </ul>
          </div>
          <div className="hq-menu-section">
            <h3>Flight Training</h3>
            <ul>
              <li><Link to="/training" onClick={closeMenu}>Training Overview</Link></li>
              <li><Link to="/training/ppl" onClick={closeMenu}>Private Pilot License</Link></li>
              <li><Link to="/training/trial-lessons" onClick={closeMenu}>Trial Lessons</Link></li>
            </ul>
          </div>
          <div className="hq-menu-section">
            <h3>Services</h3>
            <ul>
              <li><Link to="/services" onClick={closeMenu}>Services Overview</Link></li>
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
                <Link to="/training" className="Header-nav-item">Training</Link>
                <Link to="/sales" className="Header-nav-item">Aircraft</Link>
                <Link to="/maintenance" className="Header-nav-item">Maintenance</Link>
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

// ============================================
// PARALLAX IMAGE SECTION WITH WAVE OVERLAYS
// ============================================

function ParallaxSection({ image, number, label, largeText }) {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start end', 'end start'],
  });
  const y = useTransform(scrollYProgress, [0, 1], ['-15%', '15%']);

  return (
    <section ref={ref} className="maint-parallax">
      <motion.div className="maint-parallax__bg" style={{ y }}>
        <img src={image} alt="" />
      </motion.div>
      <div className="maint-parallax__overlay" />

      {/* Wave overlays */}
      <svg className="maint-parallax__wave maint-parallax__wave--top" viewBox="0 0 1440 100" preserveAspectRatio="none">
        <path d="M0,50 C360,100 1080,0 1440,50 L1440,0 L0,0 Z" fill="#faf9f6"/>
      </svg>
      <svg className="maint-parallax__wave maint-parallax__wave--bottom" viewBox="0 0 1440 100" preserveAspectRatio="none">
        <path d="M0,50 C360,0 1080,100 1440,50 L1440,100 L0,100 Z" fill="#ffffff"/>
      </svg>

      <div className="maint-parallax__content">
        <span className="maint-parallax__number">— {number} —</span>
        <span className="maint-parallax__label">{label}</span>
        <span className="maint-parallax__large">{largeText}</span>
      </div>
    </section>
  );
}

// ============================================
// COMPONENT 01: HERO WITH STATUS BOARD
// ============================================

function HeroSection() {
  const { t } = usePageText('maintenance');
  const heroRef = useRef(null);
  const pageImages = usePageImages('maintenance');
  useCmsHighlight();

  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ['start start', 'end start'],
  });

  const heroOpacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);
  const heroScale = useTransform(scrollYProgress, [0, 0.5], [1, 0.95]);

  return (
    <section ref={heroRef} className="maint-hero" data-cms-section="maintenance-hero">
      <motion.div
        className="maint-hero__bg"
        initial={{ scale: 1.1, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 1.5 }}
      >
        <img src={pageImages['maintenance-hero']?.[0]?.url || '/assets/images/facility/hq-0056.jpg'} alt="Helicopter maintenance" />
      </motion.div>
      <div className="maint-hero__overlay" />
      <div className="maint-hero__blueprint-grid" />

      <motion.div
        className="maint-hero__content"
        style={{ opacity: heroOpacity, scale: heroScale }}
      >
        <motion.span
          className="maint-hero__label"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          {t('maintenance-hero', 'pre_label')}
        </motion.span>

        <div className="maint-hero__headline">
          <motion.span
            className="maint-hero__word maint-hero__word--1"
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4, ease: [0.16, 1, 0.3, 1] }}
          >
            {t('maintenance-hero', 'heading')}
          </motion.span>
        </div>

        <motion.div
          className="maint-hero__divider"
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ duration: 0.8, delay: 1, ease: [0.16, 1, 0.3, 1] }}
        />

        <motion.span
          className="maint-hero__coords"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2 }}
        >
          {t('maintenance-hero', 'subtitle')}
        </motion.span>
      </motion.div>
    </section>
  );
}

// ============================================
// COMPONENT 02: SCROLL PROGRESS
// ============================================

function ScrollProgress() {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.scrollY;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      setProgress(scrollTop / docHeight);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="maint-scroll-progress">
      <div className="maint-scroll-progress__track">
        <motion.div
          className="maint-scroll-progress__bar"
          style={{ scaleY: progress }}
        />
      </div>
      <span className="maint-scroll-progress__label">{Math.round(progress * 100)}%</span>
    </div>
  );
}

// ============================================
// COMPONENT 03: STATS STRIP
// ============================================

function StatsStrip() {
  const stats = [
    { icon: 'fa-helicopter', value: 85, suffix: '+', label: 'Aircraft Under Care' },
    { icon: 'fa-calendar-check', value: 15, suffix: '+', label: 'Years Experience' },
    { icon: 'fa-wrench', value: 2500, suffix: '+', label: 'Services Completed' },
    { icon: 'fa-users', value: 12, suffix: '', label: 'Expert Engineers' },
  ];

  return (
    <section className="maint-stats">
      <div className="maint-stats__container">
        {stats.map((stat, i) => (
          <motion.div
            key={i}
            className="maint-stats__item"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: i * 0.1 }}
            viewport={{ once: true }}
          >
            <span className="maint-stats__value">
              <AnimatedNumber value={stat.value} suffix={stat.suffix} />
            </span>
            <span className="maint-stats__label">{stat.label}</span>
          </motion.div>
        ))}
      </div>
    </section>
  );
}

// ============================================
// COMPONENT 04: PHILOSOPHY SECTION
// ============================================

function PhilosophySection() {
  const { t } = usePageText('maintenance');
  const [partsForm, setPartsForm] = useState({ aircraft: '', part: '', urgency: 'standard', email: '' });
  const [partsSubmitted, setPartsSubmitted] = useState(false);
  const [partsOpen, setPartsOpen] = useState(false);

  const [partsSubmitting, setPartsSubmitting] = useState(false);
  const [partsError, setPartsError] = useState(false);

  const handlePartsSubmit = async (e) => {
    e.preventDefault();
    if (!partsForm.email || !partsForm.part) return;
    setPartsSubmitting(true);
    setPartsError(false);
    const messageParts = [];
    if (partsForm.aircraft) messageParts.push(`Aircraft: ${partsForm.aircraft}`);
    messageParts.push(`Part: ${partsForm.part}`);
    messageParts.push(`Urgency: ${partsForm.urgency}`);
    if (partsForm.description) messageParts.push(`Details: ${partsForm.description}`);
    try {
      const res = await fetch('/api/leads', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: partsForm.email,
          email: partsForm.email,
          subject: 'Parts Enquiry',
          message: messageParts.join('\n'),
          source: 'Maintenance — Parts Enquiry',
        }),
      });
      if (res.ok) {
        setPartsSubmitted(true);
      } else {
        setPartsError(true);
      }
    } catch {
      setPartsError(true);
    } finally {
      setPartsSubmitting(false);
    }
  };

  return (
    <section className="maint-philosophy">
      <div className="maint-philosophy__container">
        {/* LEFT — Maintenance */}
        <div className="maint-philosophy__left">
          <Reveal>
            <span className="maint-pre-text">Maintenance Services</span>
            <h2 className="maint-philosophy__headline">
              {t('maintenance-intro', 'heading')}
            </h2>
          </Reveal>
          <Reveal delay={0.2}>
            <p className="maint-philosophy__body">
              {t('maintenance-intro', 'description')}
            </p>
          </Reveal>
          <Reveal delay={0.3}>
            <div className="maint-philosophy__pillars">
              <div className="maint-philosophy__pillar">
                <div className="maint-philosophy__pillar-icon">
                  <i className="fas fa-search-plus"></i>
                </div>
                <h4>Proactive Care</h4>
                <p>Identifying issues before they become problems</p>
              </div>
              <div className="maint-philosophy__pillar">
                <div className="maint-philosophy__pillar-icon">
                  <i className="fas fa-clock"></i>
                </div>
                <h4>Rapid Turnaround</h4>
                <p>Up to 8 bays to get you back in the air fast</p>
              </div>
              <div className="maint-philosophy__pillar">
                <div className="maint-philosophy__pillar-icon">
                  <i className="fas fa-handshake"></i>
                </div>
                <h4>Trusted Partnership</h4>
                <p>Long-term relationships built on expertise</p>
              </div>
            </div>
          </Reveal>
        </div>

        {/* DIVIDER */}
        <div className="maint-philosophy__divider" />

        {/* RIGHT — Parts */}
        <div className="maint-philosophy__right">
          <Reveal>
            <span className="maint-pre-text">Robinson Parts Specialists</span>
            <h2 className="maint-philosophy__headline">
              <span className="maint-text--dark">Need </span>
              <span className="maint-text--mid">a </span>
              <span className="maint-text--light">Part?</span>
            </h2>
          </Reveal>
          <Reveal delay={0.2}>
            <p className="maint-philosophy__body">
              As one of the biggest Robinson service centres in Europe, we hold a £500K+ genuine
              parts inventory — engine components, airframe parts, consumables, avionics, and
              accessories. Same-day dispatch available for AOG situations.
            </p>
          </Reveal>
          <Reveal delay={0.3}>
            <p className="maint-philosophy__parts-quote">
              Fill in the details and we'll get back to you within 24hrs.
            </p>
            <div className="maint-philosophy__parts-form">
              <button
                type="button"
                className="maint-philosophy__parts-form-toggle"
                onClick={() => setPartsOpen(prev => !prev)}
              >
                <span>Parts Enquiry Form</span>
                <i className={`fas fa-chevron-down maint-philosophy__parts-chevron ${partsOpen ? 'maint-philosophy__parts-chevron--open' : ''}`}></i>
              </button>
              <div className={`maint-philosophy__parts-collapse ${partsOpen ? 'maint-philosophy__parts-collapse--open' : ''}`}>
                <form onSubmit={handlePartsSubmit}>
                  <div className="maint-philosophy__parts-field">
                    <label className="maint-philosophy__parts-field-label">Aircraft Type</label>
                    <div className="maint-philosophy__parts-toggles">
                      {['R22', 'R44', 'R66'].map(type => (
                        <button
                          key={type}
                          type="button"
                          className={`maint-philosophy__parts-toggle ${partsForm.aircraft === type ? 'maint-philosophy__parts-toggle--active' : ''}`}
                          onClick={() => setPartsForm(prev => ({ ...prev, aircraft: type }))}
                        >
                          {type}
                        </button>
                      ))}
                    </div>
                  </div>
                  <div className="maint-philosophy__parts-field">
                    <label className="maint-philosophy__parts-field-label">Part Needed</label>
                    <input
                      type="text"
                      className="maint-philosophy__parts-input"
                      placeholder="Part number or description"
                      value={partsForm.part}
                      onChange={e => setPartsForm(prev => ({ ...prev, part: e.target.value }))}
                    />
                  </div>
                  <div className="maint-philosophy__parts-field">
                    <label className="maint-philosophy__parts-field-label">Urgency</label>
                    <div className="maint-philosophy__parts-toggles">
                      {[
                        { value: 'standard', label: 'Standard' },
                        { value: 'urgent', label: 'Urgent' },
                        { value: 'aog', label: 'AOG' },
                      ].map(u => (
                        <button
                          key={u.value}
                          type="button"
                          className={`maint-philosophy__parts-toggle ${partsForm.urgency === u.value ? 'maint-philosophy__parts-toggle--active' : ''} ${u.value === 'aog' ? 'maint-philosophy__parts-toggle--aog' : ''}`}
                          onClick={() => setPartsForm(prev => ({ ...prev, urgency: u.value }))}
                        >
                          {u.label}
                        </button>
                      ))}
                    </div>
                  </div>
                  <div className="maint-philosophy__parts-field">
                    <label className="maint-philosophy__parts-field-label">Description <span style={{ fontWeight: 400, color: '#bbb' }}>(optional)</span></label>
                    <textarea
                      className="maint-philosophy__parts-textarea"
                      placeholder="Any additional details — e.g. hit my tail rotor, need a new blade..."
                      value={partsForm.description || ''}
                      onChange={e => setPartsForm(prev => ({ ...prev, description: e.target.value }))}
                      rows={3}
                    />
                  </div>
                  <div className="maint-philosophy__parts-field">
                    <label className="maint-philosophy__parts-field-label">Your Email</label>
                    <input
                      type="email"
                      className="maint-philosophy__parts-input"
                      placeholder="email@example.com"
                      value={partsForm.email}
                      onChange={e => setPartsForm(prev => ({ ...prev, email: e.target.value }))}
                      required
                    />
                  </div>
                  <div className="maint-philosophy__parts-submit">
                    {partsSubmitted ? (
                      <div className="maint-philosophy__parts-success">
                        <i className="fas fa-check"></i> Enquiry sent — we'll be in touch shortly
                      </div>
                    ) : (
                      <>
                        <button type="submit" className="maint-btn maint-btn--primary" style={{ width: '100%', justifyContent: 'center', opacity: partsSubmitting ? 0.7 : 1, cursor: partsSubmitting ? 'wait' : 'pointer' }} disabled={partsSubmitting}>
                          {partsSubmitting ? 'Sending…' : <> Send Parts Enquiry <i className="fas fa-arrow-right" style={{ fontSize: '0.65rem' }}></i></>}
                        </button>
                        {partsError && <p style={{ marginTop: '0.5rem', fontSize: '0.75rem', color: '#c0392b', textAlign: 'center' }}>Something went wrong — please try again.</p>}
                      </>
                    )}
                  </div>
                </form>
              </div>
            </div>
          </Reveal>
          <Reveal delay={0.4}>
            <a href="tel:+441234567890" className="maint-philosophy__parts-phone">
              <i className="fas fa-phone"></i> Or call our parts desk directly
            </a>
          </Reveal>
        </div>
      </div>
    </section>
  );
}

// ============================================
// COMPONENT 05: SERVICES GRID
// ============================================

function ServicesGrid() {
  const services = [
    {
      id: '01',
      title: 'Scheduled Maintenance',
      desc: '100-hour, annual, and progressive inspections performed to manufacturer specifications.',
      icon: 'fa-calendar-alt',
      features: ['100 Hour Inspections', 'Annual Inspections', 'Progressive Checks']
    },
    {
      id: '02',
      title: 'Overhaul Services',
      desc: 'Complete component and engine overhauls with certified parts and expert craftsmanship.',
      icon: 'fa-cogs',
      features: ['Engine Overhauls', 'Component Rebuild', 'Transmission Service']
    },
    {
      id: '03',
      title: 'Avionics & Upgrades',
      desc: 'Modern avionics installation, panel upgrades, and system integration services.',
      icon: 'fa-satellite-dish',
      features: ['Glass Cockpit', 'GPS/NAV Systems', 'Transponder Upgrades']
    },
    {
      id: '04',
      title: 'AOG Support',
      desc: '24/7 Aircraft on Ground response for urgent maintenance needs anywhere in Europe.',
      icon: 'fa-bolt',
      features: ['24/7 Response', 'Mobile Service', 'Parts Sourcing']
    },
    {
      id: '05',
      title: 'Pre-Purchase Inspection',
      desc: 'Comprehensive evaluation before you buy, ensuring complete peace of mind.',
      icon: 'fa-search',
      features: ['Full Inspection', 'Documentation Review', 'Value Assessment']
    },
    {
      id: '06',
      title: 'Paint & Refurbishment',
      desc: 'Complete interior and exterior restoration to factory-new condition.',
      icon: 'fa-paint-brush',
      features: ['Custom Paint', 'Interior Refresh', 'Corrosion Treatment']
    }
  ];

  return (
    <section className="maint-services">
      <div className="maint-services__container">
        <Reveal>
          <div className="maint-section-header">
            <span className="maint-pre-text">What We Offer</span>
            <h2>
              <span className="maint-text--dark">Comprehensive </span>
              <span className="maint-text--mid">Maintenance </span>
              <span className="maint-text--light">Services</span>
            </h2>
          </div>
        </Reveal>

        <div className="maint-services__grid">
          {services.map((service, i) => (
            <Reveal key={service.id} delay={i * 0.1}>
              <motion.div
                className="maint-services__card"
                whileHover={{ y: -8, transition: { duration: 0.3 } }}
              >
                <div className="maint-services__card-header">
                  <span className="maint-services__card-num">{service.id}</span>
                  <i className={`fas ${service.icon}`}></i>
                </div>
                <h3>{service.title}</h3>
                <p>{service.desc}</p>
                <ul className="maint-services__features">
                  {service.features.map((f, j) => (
                    <li key={j}><i className="fas fa-check"></i>{f}</li>
                  ))}
                </ul>
                <div className="maint-services__card-footer">
                  <Link to="/contact" className="maint-services__link">
                    Learn More <i className="fas fa-arrow-right"></i>
                  </Link>
                </div>
              </motion.div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

// ============================================
// COMPONENT 05B: REBUILDS SECTION
// ============================================

function RebuildsSection() {
  const scrollRef = useRef(null);
  const [stripImgIndex, setStripImgIndex] = useState({});
  const [rebuildDetailOpen, setRebuildDetailOpen] = useState(null);
  const [rebuildLightbox, setRebuildLightbox] = useState(null);

  const rebuilds = [
    {
      model: 'R44 Raven II', reg: 'G-RROB', year: '2019',
      img: '/assets/images/new-aircraft/r44/raven-ii-front-alpha.png',
      duration: '8 months',
      details: 'Complete strip-down and rebuild to zero-time specification. Full glass cockpit upgrade with Garmin G500H TXi and GTN 650Xi. Interior finished in hand-stitched navy leather. Exterior resprayed in a custom metallic blue livery with platinum pinstripe.',
      gallery: [
        '/assets/images/new-aircraft/r44/raven-ii-front-alpha.png',
        '/assets/images/new-aircraft/r44/r44blueprint.jpg',
        '/assets/images/new-aircraft/r44/raven-ii-front-alpha.png',
      ],
    },
    {
      model: 'R22 Beta II', reg: 'G-BWZZ', year: '2016',
      img: '/assets/images/new-aircraft/r22/r22-red-volcano-front-alpha-v3.png',
      duration: '5 months',
      details: 'Fleet rebuild for a UK flight school. Engine replaced with factory-new Lycoming O-360, paired with a Garmin G5 digital display. High-visibility orange and white paint scheme designed for training operations. Noise-dampening kit fitted throughout.',
      gallery: [
        '/assets/images/new-aircraft/r22/r22-red-volcano-front-alpha-v3.png',
        '/assets/images/new-aircraft/r22/r22-red-volcano-front-alpha-v3.png',
        '/assets/images/new-aircraft/r22/r22-red-volcano-front-alpha-v3.png',
      ],
    },
    {
      model: 'R66 Turbine', reg: 'G-NXG1', year: '2018',
      img: '/assets/images/new-aircraft/r66/blue-r66-palo-verde-left-v4.png',
      duration: '11 months',
      details: 'Rolls-Royce RR300 overhauled to zero-time, paired with GTN 750Xi navigator and GI 275 standby. Interior retrimmed in charcoal Alcantara with brushed aluminium accents. Exterior finished with a ceramic-coated charcoal-to-slate gradient paint.',
      gallery: [
        '/assets/images/new-aircraft/r66/blue-r66-palo-verde-left-v4.png',
        '/assets/images/new-aircraft/r66/blue-r66-palo-verde-left-v4.png',
        '/assets/images/new-aircraft/r66/blue-r66-palo-verde-left-v4.png',
      ],
    },
    {
      model: 'R44 Cadet', reg: 'G-CADB', year: '2020',
      img: '/assets/images/new-aircraft/r44/r44-cutout.png',
      duration: '6 months',
      details: 'Training-optimised rebuild for a UK ATO. Zero-timed IO-540 with JPI EDM-900 engine monitor. Reinforced skid gear and ground-handling wheels for student operations. Simplified VFR panel with Garmin GI 275 and GTR 225A comm.',
      gallery: [
        '/assets/images/new-aircraft/r44/r44-cutout.png',
        '/assets/images/new-aircraft/r44/raven-ii-front-alpha.png',
        '/assets/images/new-aircraft/r44/r44-cutout.png',
      ],
    },
    {
      model: 'R44 Raven II', reg: 'G-HQAV', year: '2015',
      img: '/assets/images/new-aircraft/r44/r44blueprint.jpg',
      duration: '9 months',
      details: 'Full strip-down for a private owner wanting a touring-spec aircraft. Comprehensive corrosion treatment and NDT inspection of all critical components. Aux fuel tank fitted for extended range. Bespoke two-tone ivory and charcoal livery with gold detailing.',
      gallery: [
        '/assets/images/new-aircraft/r44/r44blueprint.jpg',
        '/assets/images/new-aircraft/r44/raven-ii-front-alpha.png',
        '/assets/images/new-aircraft/r44/r44blueprint.jpg',
      ],
    },
  ];

  const scrollStrip = (dir) => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({ left: dir * 280, behavior: 'smooth' });
    }
  };

  return (
    <section className="maint-rb">
      <div className="maint-rb__container">
        <div className="maint-rb__header">
          <Reveal>
            <span className="maint-pre-text">Major Service</span>
            <h2 className="maint-rb__headline">
              <span className="maint-text--dark">12-Year / 2200-Hour </span>
              <span className="maint-text--light">Overhaul</span>
            </h2>
          </Reveal>
          <Reveal delay={0.2}>
            <p className="maint-rb__body">
              At 2200 hours or 12 years — whichever comes first — Robinson helicopters require a complete
              overhaul. We don't just check it, we transform it. Complete disassembly, inspection of every
              component, replacement of what's needed, and reassembly to factory-fresh condition.
            </p>
          </Reveal>
        </div>

        {rebuildDetailOpen === null && (
          <Reveal delay={0.3}>
            <div className="maint-rb__strip-section">
              <div className="maint-rb__strip-header">
                <h4>Examples of Our Rebuilds</h4>
                <div className="maint-rb__strip-nav">
                  <button onClick={() => scrollStrip(-1)} className="maint-rb__arrow-btn">
                    <i className="fas fa-chevron-left"></i>
                  </button>
                  <button onClick={() => scrollStrip(1)} className="maint-rb__arrow-btn">
                    <i className="fas fa-chevron-right"></i>
                  </button>
                </div>
              </div>
              <div className="maint-rb__strip" ref={scrollRef}>
                {rebuilds.map((rb, i) => {
                  const imgIdx = stripImgIndex[i] || 0;
                  const images = rb.gallery || [rb.img];
                  return (
                    <div key={i} className="maint-rb__card" onClick={() => setRebuildDetailOpen(i)} style={{ cursor: 'pointer' }}>
                      <div className="maint-rb__card-gallery">
                        <img src={images[imgIdx]} alt={rb.model} />
                        {images.length > 1 && (
                          <>
                            <button
                              className="maint-rb__gallery-nav maint-rb__gallery-nav--prev"
                              onClick={(e) => { e.stopPropagation(); setStripImgIndex(prev => ({ ...prev, [i]: (imgIdx - 1 + images.length) % images.length })); }}
                            >
                              <i className="fas fa-chevron-left"></i>
                            </button>
                            <button
                              className="maint-rb__gallery-nav maint-rb__gallery-nav--next"
                              onClick={(e) => { e.stopPropagation(); setStripImgIndex(prev => ({ ...prev, [i]: (imgIdx + 1) % images.length })); }}
                            >
                              <i className="fas fa-chevron-right"></i>
                            </button>
                            <div className="maint-rb__gallery-dots">
                              {images.map((_, di) => (
                                <span
                                  key={di}
                                  className={`maint-rb__gallery-dot${di === imgIdx ? ' maint-rb__gallery-dot--active' : ''}`}
                                  onClick={(e) => { e.stopPropagation(); setStripImgIndex(prev => ({ ...prev, [i]: di })); }}
                                />
                              ))}
                            </div>
                          </>
                        )}
                      </div>
                      <div className="maint-rb__card-info">
                        <strong>{rb.model}</strong>
                        <span>{rb.reg} · {rb.year}</span>
                      </div>
                      <div className="maint-rb__card-cta">
                        <span>View Full Rebuild</span>
                        <i className="fas fa-arrow-right"></i>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </Reveal>
        )}

        {rebuildDetailOpen !== null && (() => {
          const rb = rebuilds[rebuildDetailOpen];
          return (
            <div className="maint-rb__showcase">
              <div className="maint-rb__showcase-inner">
                <div className="maint-rb__showcase-topbar">
                  <span className="maint-rb__showcase-counter">{String(rebuildDetailOpen + 1).padStart(2, '0')} / {String(rebuilds.length).padStart(2, '0')}</span>
                  <span className="maint-rb__showcase-label">HQ Aviation — Rebuild Portfolio</span>
                  <button className="maint-rb__showcase-close" onClick={() => setRebuildDetailOpen(null)}>Close</button>
                </div>
                <div className="maint-rb__showcase-content">
                  <div className="maint-rb__showcase-gallery">
                    <div className="maint-rb__showcase-hero" onClick={() => setRebuildLightbox({ src: rb.img, alt: rb.model })}>
                      <img src={rb.img} alt={rb.model} />
                      <div className="maint-rb__showcase-overlay"><i className="fas fa-search-plus"></i></div>
                    </div>
                    <div className="maint-rb__showcase-thumbs">
                      {rb.gallery.map((src, ti) => (
                        <button key={ti} className="maint-rb__showcase-thumb" onClick={() => setRebuildLightbox({ src, alt: `${rb.model} — ${ti + 1}` })}>
                          <img src={src} alt="" />
                        </button>
                      ))}
                    </div>
                  </div>
                  <div className="maint-rb__showcase-info">
                    <span className="maint-rb__showcase-overline">Completed Rebuild · {rb.year}</span>
                    <h2 className="maint-rb__showcase-title">{rb.model}</h2>
                    <span className="maint-rb__showcase-reg">{rb.reg}</span>
                    <div className="maint-rb__showcase-divider"></div>
                    <p className="maint-rb__showcase-desc">{rb.details}</p>
                    <div className="maint-rb__showcase-spec">
                      <div className="maint-rb__showcase-spec-item">
                        <span className="maint-rb__showcase-spec-label">Build Duration</span>
                        <span className="maint-rb__showcase-spec-value">{rb.duration}</span>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="maint-rb__showcase-nav">
                  <button className="maint-rb__showcase-nav-btn" disabled={rebuildDetailOpen === 0} onClick={() => setRebuildDetailOpen(rebuildDetailOpen - 1)}>
                    <span className="maint-rb__showcase-nav-arrow">&larr;</span>
                    <span className="maint-rb__showcase-nav-lbl">{rebuildDetailOpen > 0 ? rebuilds[rebuildDetailOpen - 1].model : ''}</span>
                  </button>
                  <button className="maint-rb__showcase-nav-btn maint-rb__showcase-nav-btn--next" disabled={rebuildDetailOpen === rebuilds.length - 1} onClick={() => setRebuildDetailOpen(rebuildDetailOpen + 1)}>
                    <span className="maint-rb__showcase-nav-lbl">{rebuildDetailOpen < rebuilds.length - 1 ? rebuilds[rebuildDetailOpen + 1].model : ''}</span>
                    <span className="maint-rb__showcase-nav-arrow">&rarr;</span>
                  </button>
                </div>
              </div>
              {rebuildLightbox && (
                <div className="maint-rb__lightbox" onClick={() => setRebuildLightbox(null)}>
                  <img src={rebuildLightbox.src} alt={rebuildLightbox.alt} className="maint-rb__lightbox-img" />
                </div>
              )}
            </div>
          );
        })()}

        <Reveal delay={0.35}>
          <p className="maint-rb__tagline">
            With 35+ rebuilds completed and 30 years of experience rebuilding R22, R44 and R66 types.
          </p>
        </Reveal>

        <Reveal delay={0.4}>
          <div className="maint-rb__actions">
            <Link to="/sales/rebuilds" className="maint-btn maint-btn--primary">
              Understand and View Our Rebuilds
            </Link>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

// ============================================
// COMPONENT 05C: WE BUY ANY ROBINSON
// ============================================

function WeBuySection() {
  return (
    <section className="maint-webuy">
      <div className="maint-webuy__container">
        <div className="maint-webuy__badge">
          <i className="fas fa-hand-holding-usd"></i>
        </div>
        <div className="maint-webuy__content">
          <Reveal>
            <span className="maint-pre-text maint-pre-text--light">Aircraft Acquisition</span>
            <h2>
              <span style={{ color: '#fff' }}>We Buy </span>
              <span style={{ color: 'rgba(255,255,255,0.7)' }}>Any </span>
              <span style={{ color: 'rgba(255,255,255,0.5)' }}>Robinson</span>
            </h2>
          </Reveal>

          <Reveal delay={0.2}>
            <p className="maint-webuy__body">
              If you're a Robinson aircraft owner, we're interested in purchasing your helicopter.
              We're especially keen on aircraft from private owners who are running lower on years
              but still have plentiful hours remaining. We can put your aircraft on our training
              school fleet and use those hours up before the 12-year rebuild—maximising the value
              for everyone.
            </p>
          </Reveal>

          <Reveal delay={0.3}>
            <div className="maint-webuy__features">
              <div className="maint-webuy__feature">
                <i className="fas fa-check-circle"></i>
                <span>Fair Market Valuations</span>
              </div>
              <div className="maint-webuy__feature">
                <i className="fas fa-check-circle"></i>
                <span>Quick Decision Process</span>
              </div>
              <div className="maint-webuy__feature">
                <i className="fas fa-check-circle"></i>
                <span>All Robinson Models</span>
              </div>
            </div>
          </Reveal>

          <Reveal delay={0.4}>
            <div className="maint-webuy__cta">
              <Link to="/contact" className="maint-btn maint-btn--light">
                Get a Valuation
              </Link>
              <a href="tel:+441234567890" className="maint-webuy__phone">
                <i className="fas fa-phone"></i>
                <span>Or call us directly</span>
              </a>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}

function WeBuySectionCompact() {
  return (
    <section className="maint-webuy-compact">
      <div className="maint-webuy-compact__inner">
        <div className="maint-webuy-compact__left">
          <i className="fas fa-hand-holding-usd maint-webuy-compact__icon"></i>
          <div>
            <span className="maint-webuy-compact__pre">Aircraft Acquisition</span>
            <p className="maint-webuy-compact__headline">We Buy Any Robinson</p>
          </div>
        </div>
        <div className="maint-webuy-compact__pills">
          <span className="maint-webuy-compact__pill"><i className="fas fa-check"></i> Fair Market Value</span>
          <span className="maint-webuy-compact__pill"><i className="fas fa-check"></i> Quick Decision</span>
          <span className="maint-webuy-compact__pill"><i className="fas fa-check"></i> All Models</span>
        </div>
        <Link to="/contact" className="maint-btn maint-btn--light maint-webuy-compact__btn">
          Get a Valuation
        </Link>
      </div>
    </section>
  );
}

// ============================================
// COMPONENT 06: TIMELINE
// ============================================

function Timeline() {
  const milestones = [
    { year: '2010', title: 'Founded', desc: 'HQ Aviation established at Denham Aerodrome' },
    { year: '1995', title: 'EASA Approval', desc: 'Achieved Part 145 maintenance organization approval' },
    { year: '2000', title: 'Robinson Service Centre', desc: 'Appointed as authorized Robinson service facility' },
    { year: '2010', title: 'New Hangar', desc: 'Purpose-built maintenance facility opened' },
    { year: '2015', title: 'Fleet Expansion', desc: 'Over 50 aircraft under management' },
    { year: '2024', title: 'Industry Leader', desc: '85+ aircraft, 15 years of excellence' },
  ];

  return (
    <section className="maint-timeline">
      <div className="maint-timeline__container">
        <Reveal>
          <div className="maint-section-header maint-section-header--light">
            <span className="maint-pre-text maint-pre-text--light">Our Journey</span>
            <h2>
              <span style={{ color: '#fff' }}>15 Years </span>
              <span style={{ color: 'rgba(255,255,255,0.7)' }}>of </span>
              <span style={{ color: 'rgba(255,255,255,0.5)' }}>Excellence</span>
            </h2>
          </div>
        </Reveal>

        <div className="maint-timeline__track">
          <div className="maint-timeline__line" />
          {milestones.map((m, i) => (
            <Reveal key={i} delay={i * 0.15}>
              <div className={`maint-timeline__item ${i % 2 === 0 ? 'maint-timeline__item--top' : 'maint-timeline__item--bottom'}`}>
                <div className="maint-timeline__dot" />
                <div className="maint-timeline__content">
                  <span className="maint-timeline__year">{m.year}</span>
                  <h4>{m.title}</h4>
                  <p>{m.desc}</p>
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

// ============================================
// COMPONENT 07: CERTIFICATION BADGES (COMPACT)
// ============================================

function CertificationBadges() {
  const pageImages = usePageImages('maintenance');
  const certs = [
    { logo: '/assets/images/logos/certifications/caa-logo.png', name: 'UK CAA Certified' },
    { logo: '/assets/images/robinson-assets/logos/rhc_authorized-service-center-logo-logo-yellow-rotor-black-type.svg', name: 'Robinson Authorized Service Centre' },
  ];

  return (
    <section className="maint-certs" data-cms-section="maintenance-cert-logo">
      <div className="maint-certs__container">
        <Reveal>
          <div className="maint-certs__grid maint-certs__grid--two">
            {certs.map((cert, i) => (
              <div key={i} className="maint-certs__card">
                <div className="maint-certs__logo">
                  <img src={pageImages['maintenance-cert-logo']?.[i]?.url || cert.logo} alt={cert.name} onError={(e) => { e.target.style.display = 'none'; e.target.nextSibling.style.display = 'flex'; }} />
                  <div className="maint-certs__logo-fallback" style={{ display: 'none' }}>
                    <i className="fas fa-certificate"></i>
                  </div>
                </div>
                <span className="maint-certs__name">{cert.name}</span>
              </div>
            ))}
          </div>
        </Reveal>
      </div>
    </section>
  );
}

// ============================================
// COMPONENT 08: PROCESS FLOW
// ============================================

function ProcessFlow() {
  const steps = [
    { num: '01', title: 'Initial Consultation', desc: 'Discuss your needs, schedule, and specific requirements', icon: 'fa-comments' },
    { num: '02', title: 'Inspection & Assessment', desc: 'Thorough evaluation of your aircraft\'s condition', icon: 'fa-search-plus' },
    { num: '03', title: 'Detailed Quote', desc: 'Transparent pricing with no hidden costs', icon: 'fa-file-invoice' },
    { num: '04', title: 'Expert Service', desc: 'Skilled engineers perform all work to highest standards', icon: 'fa-tools' },
    { num: '05', title: 'Quality Assurance', desc: 'Multiple inspections ensure perfect completion', icon: 'fa-clipboard-check' },
    { num: '06', title: 'Return to Service', desc: 'Full documentation and test flight if required', icon: 'fa-plane-departure' },
  ];

  return (
    <section className="maint-process">
      <div className="maint-process__container">
        <Reveal>
          <div className="maint-section-header">
            <span className="maint-pre-text">How We Work</span>
            <h2>
              <span className="maint-text--dark">The HQ </span>
              <span className="maint-text--mid">Maintenance </span>
              <span className="maint-text--light">Process</span>
            </h2>
          </div>
        </Reveal>

        <div className="maint-process__flow">
          {steps.map((step, i) => (
            <Reveal key={i} delay={i * 0.1}>
              <div className="maint-process__step">
                <div className="maint-process__step-num">{step.num}</div>
                <div className="maint-process__step-icon">
                  <i className={`fas ${step.icon}`}></i>
                </div>
                <h4>{step.title}</h4>
                <p>{step.desc}</p>
                {i < steps.length - 1 && <div className="maint-process__connector" />}
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

// ============================================
// COMPONENT 09: TEAM PROFILES
// ============================================

function TeamProfiles() {
  const team = [
    { name: 'David Cross', role: 'Chief Engineer', exp: '25 years', img: '/assets/images/team/engineer-1.jpg', certs: ['EASA Part 66', 'Robinson Certified'] },
    { name: 'Michael Fowler', role: 'Senior Engineer', exp: '18 years', img: '/assets/images/team/engineer-2.jpg', certs: ['EASA Part 66', 'Avionics Specialist'] },
    { name: 'David Clarke', role: 'Engine Specialist', exp: '15 years', img: '/assets/images/team/engineer-3.jpg', certs: ['Lycoming Certified', 'Robinson Certified'] },
  ];

  const teamCount = 12;

  return (
    <section className="maint-team">
      <div className="maint-team__container">
        <Reveal>
          <div className="maint-section-header maint-section-header--light">
            <span className="maint-pre-text maint-pre-text--light">Our Engineers</span>
            <h2>
              <span style={{ color: '#fff' }}>Expert </span>
              <span style={{ color: 'rgba(255,255,255,0.7)' }}>Hands, </span>
              <span style={{ color: 'rgba(255,255,255,0.5)' }}>Trusted Care</span>
            </h2>
          </div>
        </Reveal>

        <div className="maint-team__grid">
          {team.map((member, i) => (
            <Reveal key={i} delay={i * 0.15}>
              <div className="maint-team__card">
                <div className="maint-team__photo">
                  <div className="maint-team__photo-placeholder">
                    <i className="fas fa-user"></i>
                  </div>
                </div>
                <div className="maint-team__info">
                  <h4>{member.name}</h4>
                  <span className="maint-team__role">{member.role}</span>
                  <span className="maint-team__exp">{member.exp} experience</span>
                  <div className="maint-team__certs">
                    {member.certs.map((c, j) => (
                      <span key={j} className="maint-team__cert">{c}</span>
                    ))}
                  </div>
                </div>
              </div>
            </Reveal>
          ))}
          <Reveal delay={0.45}>
            <div className="maint-team__card maint-team__card--count">
              <div className="maint-team__count">
                <span className="maint-team__count-plus">+</span>
                <span className="maint-team__count-number">{teamCount}</span>
              </div>
              <div className="maint-team__count-label">
                <span>Skilled Engineers</span>
                <span>& Technicians</span>
              </div>
            </div>
          </Reveal>
        </div>

        <Reveal delay={0.5}>
          <div className="maint-team__cta">
            <p>A team that lives and breathes rotary-wing aviation — factory-trained, continuously developing, and always investing in the latest techniques</p>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

// ============================================
// COMPONENT 11: FACILITY SHOWCASE
// ============================================

function FacilityShowcase() {
  const facilities = [
    { img: '/assets/images/facility/hq-0035.jpg', title: 'Main Hangar', desc: 'Climate controlled, 12,000 sq ft' },
    { img: '/assets/images/facility/hq-0089.jpg', title: 'Paint Shop', desc: 'Professional finishing facility' },
    { img: '/assets/images/facility/busy-hangar.jpg', title: 'Service Bays', desc: 'Up to 8 aircraft simultaneously' },
  ];

  return (
    <section className="maint-facility">
      <div className="maint-facility__container">
        <Reveal>
          <div className="maint-section-header">
            <span className="maint-pre-text">Our Home</span>
            <h2>
              <span className="maint-text--dark">Purpose-Built </span>
              <span className="maint-text--mid">Modern </span>
              <span className="maint-text--light">Facility</span>
            </h2>
          </div>
        </Reveal>

        <div className="maint-facility__gallery">
          {facilities.map((f, i) => (
            <Reveal key={i} delay={i * 0.15}>
              <motion.div
                className="maint-facility__item"
                whileHover={{ scale: 1.02 }}
              >
                <img src={f.img} alt={f.title} />
                <div className="maint-facility__overlay">
                  <h4>{f.title}</h4>
                  <p>{f.desc}</p>
                </div>
              </motion.div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

// ============================================
// COMPONENT 12: EQUIPMENT GALLERY
// ============================================

function EquipmentGallery() {
  const equipment = [
    { name: 'Vibration Analysis', icon: 'fa-wave-square' },
    { name: 'Track & Balance', icon: 'fa-balance-scale' },
    { name: 'Precision Tooling', icon: 'fa-tools' },
    { name: 'Diagnostic Systems', icon: 'fa-laptop-medical' },
    { name: 'Lifting Equipment', icon: 'fa-arrow-up' },
    { name: 'Cleaning Systems', icon: 'fa-spray-can' },
  ];

  return (
    <section className="maint-equipment">
      <div className="maint-equipment__container">
        <Reveal>
          <div className="maint-section-header maint-section-header--left">
            <span className="maint-pre-text">Professional Tools</span>
            <h2>
              <span className="maint-text--dark">State-of-the-Art </span>
              <span className="maint-text--light">Equipment</span>
            </h2>
          </div>
        </Reveal>

        <div className="maint-equipment__scroll">
          <div className="maint-equipment__track">
            {[...equipment, ...equipment].map((eq, i) => (
              <div key={i} className="maint-equipment__item">
                <i className={`fas ${eq.icon}`}></i>
                <span>{eq.name}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

// ============================================
// COMPONENT 14: MAINTENANCE SCHEDULE
// ============================================

function MaintenanceSchedule() {
  const schedule = [
    { interval: '50 HR', work: 'Periodic Inspection', duration: '1-2 days', includes: 'Oil change, visual inspection, minor adjustments' },
    { interval: '100 HR', work: 'Scheduled Inspection', duration: '2-3 days', includes: 'Comprehensive inspection, filter changes, lubrication' },
    { interval: 'Annual', work: 'Annual Inspection', duration: '3-5 days', includes: 'Full inspection, compliance checks, airworthiness review' },
    { interval: '2200 HR', work: 'Engine Overhaul', duration: '4-6 weeks', includes: 'Complete engine disassembly, inspection, rebuild' },
    { interval: '12 YR', work: 'Major Overhaul', duration: '6-8 weeks', includes: 'Airframe inspection, component overhauls, repainting' },
  ];

  return (
    <section className="maint-schedule">
      <div className="maint-schedule__container">
        <Reveal>
          <div className="maint-section-header">
            <span className="maint-pre-text">Planning</span>
            <h2>
              <span className="maint-text--dark">Maintenance </span>
              <span className="maint-text--mid">Schedule </span>
              <span className="maint-text--light">Overview</span>
            </h2>
          </div>
        </Reveal>

        <div className="maint-schedule__table">
          <div className="maint-schedule__header">
            <span>Interval</span>
            <span>Service</span>
            <span>Duration</span>
            <span>Includes</span>
          </div>
          {schedule.map((item, i) => (
            <Reveal key={i} delay={i * 0.1}>
              <div className="maint-schedule__row">
                <span className="maint-schedule__interval">{item.interval}</span>
                <span className="maint-schedule__work">{item.work}</span>
                <span className="maint-schedule__duration">{item.duration}</span>
                <span className="maint-schedule__includes">{item.includes}</span>
              </div>
            </Reveal>
          ))}
        </div>

        <Reveal delay={0.5}>
          <div className="maint-schedule__note">
            <i className="fas fa-info-circle"></i>
            <p>Durations are estimates and may vary based on aircraft condition and parts availability</p>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

// ============================================
// COMPONENT 15: PARTS INVENTORY
// ============================================

function PartsInventory() {
  return (
    <section className="maint-parts">
      <div className="maint-parts__container">
        <div className="maint-parts__content">
          <Reveal>
            <span className="maint-pre-text maint-pre-text--light">Parts Supply</span>
            <h2>
              <span style={{ color: '#fff' }}>Factory </span>
              <span style={{ color: 'rgba(255,255,255,0.7)' }}>Authorized </span>
              <span style={{ color: 'rgba(255,255,255,0.5)' }}>Parts</span>
            </h2>
          </Reveal>

          <Reveal delay={0.2}>
            <p>As an authorized Robinson Service Centre, we maintain extensive parts inventory ensuring minimal downtime for your aircraft.</p>
          </Reveal>

          <Reveal delay={0.3}>
            <div className="maint-parts__features">
              <div className="maint-parts__feature">
                <i className="fas fa-warehouse"></i>
                <span>£500K+ Stock Value</span>
              </div>
              <div className="maint-parts__feature">
                <i className="fas fa-truck-fast"></i>
                <span>Same Day Dispatch</span>
              </div>
              <div className="maint-parts__feature">
                <i className="fas fa-globe-europe"></i>
                <span>European Coverage</span>
              </div>
            </div>
          </Reveal>

          <Reveal delay={0.4}>
            <Link to="/contact" className="maint-btn maint-btn--light">
              Request Part Quote
            </Link>
          </Reveal>
        </div>

        <div className="maint-parts__visual">
          <div className="maint-parts__grid">
            <div className="maint-parts__item">
              <span className="maint-parts__item-cat">Engine</span>
              <span className="maint-parts__item-count">1,200+</span>
            </div>
            <div className="maint-parts__item">
              <span className="maint-parts__item-cat">Airframe</span>
              <span className="maint-parts__item-count">800+</span>
            </div>
            <div className="maint-parts__item">
              <span className="maint-parts__item-cat">Avionics</span>
              <span className="maint-parts__item-count">450+</span>
            </div>
            <div className="maint-parts__item">
              <span className="maint-parts__item-cat">Consumables</span>
              <span className="maint-parts__item-count">2,000+</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}


// ============================================
// COMPONENT 18: CONTACT CTA
// ============================================

function ContactCTA() {
  return (
    <section className="maint-contact-cta">
      <div className="maint-contact-cta__container">
        <div className="maint-contact-cta__content">
          <Reveal>
            <span className="maint-pre-text">Get In Touch</span>
            <h2>
              <span className="maint-text--dark">Ready to </span>
              <span className="maint-text--mid">Book </span>
              <span className="maint-text--light">Your Service?</span>
            </h2>
            <p>Our team is ready to discuss your maintenance needs and provide a comprehensive quote.</p>
          </Reveal>

          <Reveal delay={0.2}>
            <div className="maint-contact-cta__actions">
              <Link to="/contact" className="maint-btn maint-btn--primary maint-btn--large">
                <i className="fas fa-paper-plane"></i>
                Request Quote
              </Link>
              <a href="tel:+441234567890" className="maint-btn maint-btn--outline maint-btn--large">
                <i className="fas fa-phone"></i>
                Call Us
              </a>
            </div>
          </Reveal>
        </div>

        <div className="maint-contact-cta__info">
          <Reveal delay={0.3}>
            <div className="maint-contact-cta__card">
              <div className="maint-contact-cta__item">
                <i className="fas fa-map-marker-alt"></i>
                <div>
                  <h4>Location</h4>
                  <p>Denham Aerodrome<br />Tilehouse Lane, UB9 5DF</p>
                </div>
              </div>
              <div className="maint-contact-cta__item">
                <i className="fas fa-clock"></i>
                <div>
                  <h4>Hours</h4>
                  <p>Mon-Fri: 08:00 - 18:00<br />Sat: 08:00 - 14:00</p>
                </div>
              </div>
              <div className="maint-contact-cta__item">
                <i className="fas fa-envelope"></i>
                <div>
                  <h4>Email</h4>
                  <p>maintenance@hq-aviation.co.uk</p>
                </div>
              </div>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}


// ============================================
// COMPONENT 20: EMERGENCY SUPPORT
// ============================================

function EmergencySupport() {
  return (
    <section className="maint-emergency">
      <div className="maint-emergency__container">
        <div className="maint-emergency__icon">
          <i className="fas fa-exclamation-triangle"></i>
        </div>
        <div className="maint-emergency__content">
          <h3>24/7 AOG Support</h3>
          <p>Aircraft on Ground? Our emergency response team is available around the clock for urgent maintenance needs anywhere in Europe.</p>
        </div>
        <div className="maint-emergency__action">
          <a href="tel:+441234567890" className="maint-emergency__phone">
            <i className="fas fa-phone"></i>
            <span>Emergency Line</span>
            <strong>+44 (0) 1234 567 890</strong>
          </a>
        </div>
      </div>
    </section>
  );
}

// ============================================
// STYLES
// ============================================

const styles = `
/* ========================================
   HQ AVIATION MAINTENANCE PAGE
   20 Component Design System
   ======================================== */

/* === BASE === */
.maint {
  font-family: 'Space Grotesk', -apple-system, sans-serif;
  background: #faf9f6;
  color: #1a1a1a;
  line-height: 1.6;
  overflow-x: hidden;
}

.maint * {
  box-sizing: border-box;
}

/* === TYPOGRAPHY === */
.maint-pre-text {
  font-family: 'Share Tech Mono', monospace;
  font-size: 0.7rem;
  letter-spacing: 0.25em;
  text-transform: uppercase;
  color: #888;
  margin-bottom: 1rem;
  display: block;
}

.maint-pre-text--light {
  color: rgba(255,255,255,0.6);
}

.maint-text--dark { color: #1a1a1a; }
.maint-text--mid { color: #4a4a4a; }
.maint-text--light { color: #7a7a7a; }

.maint-section-header {
  text-align: center;
  max-width: 700px;
  margin: 0 auto 3rem;
}

.maint-section-header--left {
  text-align: left;
  margin-left: 0;
}

.maint-section-header--light {
  color: #fff;
}

.maint-section-header h2 {
  font-size: clamp(2rem, 4vw, 3rem);
  margin: 0.5rem 0;
  line-height: 1.1;
  text-transform: uppercase;
  font-weight: 700;
}

/* === BUTTONS === */
.maint-btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  padding: 1rem 2rem;
  font-size: 0.75rem;
  font-weight: 500;
  text-decoration: none;
  text-transform: uppercase;
  letter-spacing: 0.1em;
  border: 2px solid transparent;
  cursor: pointer;
  transition: all 0.3s ease;
  font-family: inherit;
}

.maint-btn--primary {
  background: #1a1a1a;
  color: #fff;
  border-color: #1a1a1a;
}

.maint-btn--primary:hover {
  background: #333;
  border-color: #333;
  color: #fff;
}

.maint-btn--outline {
  background: transparent;
  color: #1a1a1a;
  border-color: #1a1a1a;
}

.maint-btn--outline:hover {
  background: #1a1a1a;
  color: #fff;
}

.maint-btn--light {
  background: #fff;
  color: #1a1a1a;
  border-color: #fff;
}

.maint-btn--light:hover {
  background: transparent;
  color: #fff;
}

.maint-btn--large {
  padding: 1.25rem 2.5rem;
  font-size: 0.8rem;
}

/* === 01. HERO === */
.maint-hero {
  position: relative;
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
}

.maint-hero__bg {
  position: absolute;
  inset: 0;
  z-index: 0;
}

.maint-hero__bg img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.maint-hero__overlay {
  position: absolute;
  inset: 0;
  background: linear-gradient(
    to bottom,
    rgba(0,0,0,0.4) 0%,
    rgba(0,0,0,0.6) 50%,
    rgba(0,0,0,0.8) 100%
  );
  z-index: 1;
}

.maint-hero__blueprint-grid {
  position: absolute;
  inset: 0;
  z-index: 2;
  pointer-events: none;
  background-image:
    linear-gradient(to right, rgba(255,255,255,0.06) 1px, transparent 1px),
    linear-gradient(to bottom, rgba(255,255,255,0.06) 1px, transparent 1px);
  background-size: calc(100% / 5) calc(100% / 5);
}

.maint-hero__content {
  position: relative;
  z-index: 3;
  text-align: center;
  color: #faf9f6;
  padding: 2rem;
  max-width: 1000px;
}

/* Status Board */
.maint-hero__status-board {
  background: rgba(0,0,0,0.7);
  border: 1px solid rgba(255,255,255,0.2);
  padding: 1rem 1.5rem;
  margin-bottom: 3rem;
  max-width: 500px;
  margin-left: auto;
  margin-right: auto;
}

.maint-hero__status-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-bottom: 0.75rem;
  border-bottom: 1px solid rgba(255,255,255,0.2);
  margin-bottom: 0.75rem;
}

.maint-hero__status-title {
  font-family: 'Share Tech Mono', monospace;
  font-size: 0.65rem;
  letter-spacing: 0.2em;
  color: rgba(255,255,255,0.7);
}

.maint-hero__status-time {
  font-family: 'Share Tech Mono', monospace;
  font-size: 0.75rem;
  color: #4ade80;
}

.maint-hero__status-rows {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.maint-hero__status-row {
  display: grid;
  grid-template-columns: 1fr 0.8fr 1fr 1.2fr;
  gap: 1rem;
  font-family: 'Share Tech Mono', monospace;
  font-size: 0.7rem;
  padding: 0.4rem 0;
  border-bottom: 1px dashed rgba(255,255,255,0.1);
}

.maint-hero__status-reg {
  color: #fff;
  font-weight: 600;
}

.maint-hero__status-type {
  color: rgba(255,255,255,0.6);
}

.maint-hero__status-work {
  color: rgba(255,255,255,0.8);
}

.maint-hero__status-state {
  text-align: right;
  font-size: 0.6rem;
  padding: 0.15rem 0.5rem;
  border-radius: 2px;
}

.maint-hero__status-state--complete {
  background: rgba(74, 222, 128, 0.2);
  color: #4ade80;
}

.maint-hero__status-state--progress {
  background: rgba(250, 204, 21, 0.2);
  color: #facc15;
}

.maint-hero__status-state--scheduled {
  background: rgba(96, 165, 250, 0.2);
  color: #60a5fa;
}

.maint-hero__label {
  font-family: 'Share Tech Mono', monospace;
  font-size: 0.65rem;
  letter-spacing: 0.3em;
  text-transform: uppercase;
  color: rgba(250,249,246,0.7);
  margin-bottom: 2rem;
  display: block;
}

.maint-hero__headline {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.25rem;
}

.maint-hero__word {
  font-size: clamp(2.5rem, 8vw, 6rem);
  font-weight: 700;
  line-height: 1;
  text-transform: uppercase;
  letter-spacing: -0.02em;
}

.maint-hero__word--1 { color: #faf9f6; }
.maint-hero__word--2 { color: rgba(250,249,246,0.7); }
.maint-hero__word--3 { color: rgba(250,249,246,0.5); }

.maint-hero__divider {
  width: 80px;
  height: 2px;
  background: #faf9f6;
  margin: 2rem auto;
  transform-origin: center;
}

.maint-hero__coords {
  font-family: 'Share Tech Mono', monospace;
  font-size: 0.7rem;
  letter-spacing: 0.15em;
  color: rgba(250,249,246,0.6);
}

.maint-hero__scroll {
  position: absolute;
  bottom: 2rem;
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.75rem;
  z-index: 10;
}

.maint-hero__scroll span {
  font-family: 'Share Tech Mono', monospace;
  font-size: 0.6rem;
  letter-spacing: 0.2em;
  color: rgba(255,255,255,0.5);
}

.maint-hero__scroll-line {
  width: 1px;
  height: 50px;
  background: rgba(255,255,255,0.2);
  position: relative;
  overflow: hidden;
}

.maint-hero__scroll-dot {
  position: absolute;
  width: 100%;
  height: 20px;
  background: rgba(255,255,255,0.8);
  animation: scrollDot 1.5s ease-in-out infinite;
}

@keyframes scrollDot {
  0% { top: -20px; }
  100% { top: 50px; }
}

/* === 02. SCROLL PROGRESS === */
.maint-scroll-progress {
  position: fixed;
  right: 2rem;
  top: 50%;
  transform: translateY(-50%);
  z-index: 100;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.5rem;
}

.maint-scroll-progress__track {
  width: 3px;
  height: 100px;
  background: rgba(0,0,0,0.1);
  border-radius: 2px;
  overflow: hidden;
}

.maint-scroll-progress__bar {
  width: 100%;
  height: 100%;
  background: #1a1a1a;
  transform-origin: top;
}

.maint-scroll-progress__label {
  font-family: 'Share Tech Mono', monospace;
  font-size: 0.6rem;
  color: #888;
}

/* === 03. STATS === */
.maint-stats {
  background: #1a1a1a;
  padding: 1rem 2rem;
}

.maint-stats__container {
  max-width: 1200px;
  margin: 0 auto;
  display: flex;
  justify-content: center;
  gap: 3rem;
  flex-wrap: wrap;
}

.maint-stats__item {
  text-align: center;
  min-width: 110px;
}

.maint-stats__value {
  font-family: 'Share Tech Mono', monospace;
  font-size: 1.4rem;
  color: #faf9f6;
  display: block;
  font-weight: 600;
}

.maint-stats__label {
  font-size: 0.55rem;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  color: rgba(250,249,246,0.5);
  margin-top: 0.1rem;
  display: block;
}

/* === 04. PHILOSOPHY (SPLIT: MAINTENANCE | PARTS) === */
.maint-philosophy {
  padding: 6rem 2rem;
  background: #faf9f6;
}
.maint-philosophy__container {
  max-width: 1200px;
  margin: 0 auto;
  display: grid;
  grid-template-columns: 1fr auto 1fr;
  gap: 3rem;
  align-items: start;
}
.maint-philosophy__divider {
  width: 1px;
  background: #e8e6e2;
  align-self: stretch;
}
.maint-philosophy__headline {
  font-size: clamp(1.5rem, 3vw, 2.2rem);
  font-weight: 700;
  line-height: 1.1;
  margin-bottom: 1.25rem;
  text-transform: uppercase;
}
.maint-philosophy__body {
  font-size: 0.9rem;
  color: #666;
  line-height: 1.8;
  margin-bottom: 1.5rem;
}
.maint-philosophy__pillars {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 0.75rem;
}
.maint-philosophy__pillar {
  text-align: center;
  padding: 0.9rem 0.5rem;
  background: #fff;
  border: 1px solid #e8e6e2;
}
.maint-philosophy__pillar-icon {
  width: 36px;
  height: 36px;
  background: #1a1a1a;
  color: #fff;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto 0.6rem;
  font-size: 0.8rem;
}
.maint-philosophy__pillar h4 {
  font-size: 0.7rem;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  margin-bottom: 0.3rem;
}
.maint-philosophy__pillar p {
  font-size: 0.65rem;
  color: #666;
  margin: 0;
  line-height: 1.4;
}

/* Parts enquiry form */
.maint-philosophy__parts-form {
  background: #fff;
  border: 1px solid #e8e6e2;
  margin-bottom: 1rem;
}
.maint-philosophy__parts-field {
  padding: 0.85rem 1rem;
  border-bottom: 1px solid #e8e6e2;
}
.maint-philosophy__parts-field-label {
  display: block;
  font-family: 'Space Grotesk', sans-serif;
  font-size: 0.68rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.04em;
  color: #1a1a1a;
  margin-bottom: 0.45rem;
}
.maint-philosophy__parts-input {
  width: 100%;
  border: none;
  border-bottom: 1px solid #e8e6e2;
  padding: 0.4rem 0;
  font-family: 'Share Tech Mono', monospace;
  font-size: 0.75rem;
  color: #1a1a1a;
  background: transparent;
  outline: none;
  transition: border-color 0.2s ease;
}
.maint-philosophy__parts-input::placeholder {
  color: #ccc;
}
.maint-philosophy__parts-input:focus {
  border-color: #1a1a1a;
}
.maint-philosophy__parts-textarea {
  width: 100%;
  border: 1px solid #e8e6e2;
  padding: 0.5rem;
  font-family: 'Share Tech Mono', monospace;
  font-size: 0.72rem;
  color: #1a1a1a;
  background: transparent;
  outline: none;
  resize: vertical;
  min-height: 60px;
  transition: border-color 0.2s ease;
}
.maint-philosophy__parts-textarea::placeholder {
  color: #ccc;
}
.maint-philosophy__parts-textarea:focus {
  border-color: #1a1a1a;
}
.maint-philosophy__parts-toggles {
  display: flex;
  gap: 0.4rem;
  flex-wrap: wrap;
}
.maint-philosophy__parts-toggle {
  padding: 0.35rem 0.7rem;
  font-family: 'Share Tech Mono', monospace;
  font-size: 0.62rem;
  letter-spacing: 0.04em;
  text-transform: uppercase;
  border: 1px solid #e8e6e2;
  background: transparent;
  color: #999;
  cursor: pointer;
  transition: all 0.2s ease;
}
.maint-philosophy__parts-toggle:hover {
  border-color: #1a1a1a;
  color: #1a1a1a;
}
.maint-philosophy__parts-toggle--active {
  background: #1a1a1a;
  border-color: #1a1a1a;
  color: #fff;
}
.maint-philosophy__parts-toggle--aog.maint-philosophy__parts-toggle--active {
  background: #8b0000;
  border-color: #8b0000;
}
.maint-philosophy__parts-submit {
  padding: 0.85rem 1rem;
}
.maint-philosophy__parts-success {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  padding: 0.75rem;
  background: #f0faf0;
  border: 1px solid #c8e6c8;
  font-family: 'Space Grotesk', sans-serif;
  font-size: 0.75rem;
  color: #2d6a2d;
  font-weight: 500;
}
.maint-philosophy__parts-actions {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}
.maint-philosophy__parts-phone {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 0.4rem;
  font-size: 0.7rem;
  font-weight: 500;
  text-transform: uppercase;
  letter-spacing: 0.06em;
  color: #1a1a1a;
  text-decoration: none;
  border-bottom: 1px solid #ccc;
  padding-bottom: 0.15rem;
  transition: border-color 0.3s ease;
  align-self: flex-start;
}
.maint-philosophy__parts-phone:hover {
  border-color: #1a1a1a;
}
.maint-philosophy__parts-phone i {
  font-size: 0.6rem;
}
.maint-philosophy__parts-quote {
  font-size: 0.78rem;
  color: #888;
  line-height: 1.6;
  margin: 0 0 1rem;
  font-style: italic;
}
.maint-philosophy__parts-form-toggle {
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  padding: 0.75rem 1rem;
  background: #f5f4f0;
  border: 1px solid #e8e6e2;
  cursor: pointer;
  font-family: 'Space Grotesk', sans-serif;
  font-size: 0.72rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  color: #1a1a1a;
  transition: background 0.2s ease;
}
.maint-philosophy__parts-form-toggle:hover {
  background: #eeedea;
}
.maint-philosophy__parts-chevron {
  font-size: 0.6rem;
  transition: transform 0.3s ease;
}
.maint-philosophy__parts-chevron--open {
  transform: rotate(180deg);
}
.maint-philosophy__parts-collapse {
  max-height: 0;
  overflow: hidden;
  transition: max-height 0.4s ease;
}
.maint-philosophy__parts-collapse--open {
  max-height: 800px;
}

/* ========== PARALLAX SECTIONS ========== */
.maint-parallax {
  position: relative;
  height: 400px;
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: center;
}

.maint-parallax__bg {
  position: absolute;
  inset: -15%;
  z-index: 0;
}

.maint-parallax__bg img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.maint-parallax__overlay {
  position: absolute;
  inset: 0;
  background: rgba(0,0,0,0.5);
  z-index: 1;
}

.maint-parallax__wave {
  position: absolute;
  left: 0;
  width: 100%;
  height: 100px;
  z-index: 2;
}

.maint-parallax__wave--top {
  top: 0;
}

.maint-parallax__wave--bottom {
  bottom: 0;
}

.maint-parallax__content {
  position: relative;
  z-index: 3;
  text-align: center;
  color: #faf9f6;
}

.maint-parallax__number {
  font-family: 'Share Tech Mono', monospace;
  font-size: 0.75rem;
  letter-spacing: 0.2em;
  display: block;
  margin-bottom: 0.5rem;
}

.maint-parallax__label {
  font-family: 'Share Tech Mono', monospace;
  font-size: 0.7rem;
  letter-spacing: 0.15em;
  text-transform: uppercase;
  color: rgba(250,249,246,0.7);
  display: block;
  margin-bottom: 1rem;
}

.maint-parallax__large {
  font-size: clamp(4rem, 12vw, 9rem);
  font-weight: 600;
  text-transform: uppercase;
  opacity: 0.7;
  letter-spacing: 0.05em;
  -webkit-text-stroke: 1px rgba(250,249,246,0.3);
  color: transparent;
}

/* ========== SECTION 6-7: CORE SERVICES ========== */
.maint-core-services {
  background: #ffffff;
  padding: 5rem 2rem;
  position: relative;
}

.maint-core-services::before {
  content: '';
  position: absolute;
  top: 0;
  left: 50%;
  transform: translateX(-50%);
  width: 80px;
  height: 1px;
  background: linear-gradient(90deg, transparent, #bbb, transparent);
}

.maint-core-services__header {
  text-align: center;
  max-width: 700px;
  margin: 0 auto 3rem;
}

.maint-core-services__headline {
  font-size: clamp(2rem, 4vw, 3rem);
  font-weight: 600;
  margin-bottom: 1rem;
}

.maint-core-services__grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 1px;
  background: #e8e6e2;
  border-radius: 8px;
  overflow: hidden;
  max-width: 900px;
  margin: 0 auto;
  align-items: stretch;
}

.maint-core-services__grid > * {
  height: 100%;
}

.maint-core-services__card {
  background: #ffffff;
  padding: 1.5rem;
  display: flex;
  align-items: flex-start;
  gap: 1rem;
  transition: transform 0.3s ease;
  height: 100%;
}

.maint-core-services__card:hover {
  transform: translateY(-3px);
}

.maint-core-services__num {
  width: 44px;
  height: 44px;
  background: #1a1a1a;
  color: #faf9f6;
  display: flex;
  align-items: center;
  justify-content: center;
  font-family: 'Share Tech Mono', monospace;
  font-size: 0.8rem;
  flex-shrink: 0;
}

.maint-core-services__text h4 {
  font-size: 0.9rem;
  font-weight: 600;
  margin: 0 0 0.25rem;
}

.maint-core-services__text p {
  font-size: 0.75rem;
  color: #666;
  margin: 0;
  line-height: 1.4;
}

/* ========== SECTION 8: PARTS BADGE ========== */
.maint-badge {
  display: flex;
  justify-content: center;
  padding: 2rem;
  background: #ffffff;
}

.maint-badge__inner {
  display: inline-flex;
  align-items: center;
  gap: 1rem;
  padding: 0.75rem 1.5rem;
  border: 1px solid #e8e6e2;
  border-radius: 4px;
  font-size: 0.8rem;
}

.maint-badge__label {
  color: #666;
}

.maint-badge__tag {
  background: #1a1a1a;
  color: #faf9f6;
  padding: 0.25rem 0.75rem;
  border-radius: 2px;
  font-family: 'Share Tech Mono', monospace;
  font-size: 0.65rem;
  letter-spacing: 0.1em;
}

@media (max-width: 768px) {
  .maint-core-services__grid {
    display: flex;
    flex-direction: row;
    overflow-x: auto;
    overflow-y: hidden;
    -webkit-overflow-scrolling: touch;
    scroll-snap-type: x mandatory;
    gap: 8px;
    align-items: stretch;
    background: transparent;
    border-radius: 0;
    max-width: 100%;
    padding: 0 1rem 0;
    scrollbar-width: thin;
    scrollbar-color: #1a1a1a transparent;
  }

  .maint-core-services__grid::-webkit-scrollbar {
    height: 3px;
  }

  .maint-core-services__grid::-webkit-scrollbar-track {
    background: transparent;
  }

  .maint-core-services__grid::-webkit-scrollbar-thumb {
    background: #1a1a1a;
    border-radius: 2px;
  }

  .maint-core-services__grid > * {
    flex: 0 0 calc((100vw - 2rem - 8px) / 2);
    scroll-snap-align: start;
    display: flex;
    flex-direction: column;
  }

  .maint-core-services__card {
    flex: 1;
    padding: 0.875rem;
    flex-direction: row;
    flex-wrap: wrap;
    align-items: center;
    column-gap: 0.5rem;
    row-gap: 0.25rem;
    border: 1px solid #e8e6e2;
    border-radius: 4px;
  }

  .maint-core-services__card:hover {
    transform: none;
  }

  .maint-core-services__text {
    display: contents;
  }

  .maint-core-services__num {
    width: 28px;
    height: 28px;
    font-size: 0.65rem;
    flex-shrink: 0;
  }

  .maint-core-services__text h4 {
    flex: 1;
    min-width: 0;
    font-size: 0.8rem;
    margin: 0;
  }

  .maint-core-services__text p {
    flex: 0 0 100%;
    font-size: 0.7rem;
    margin: 0;
  }
}

/* ========== SECTIONS 11-13: CERTIFICATIONS ========== */
.maint-cert {
  padding: 4rem 2rem;
}

.maint-cert__grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 3rem;
  max-width: 1000px;
  margin: 0 auto;
  align-items: center;
}

.maint-cert__image {
  display: flex;
  align-items: center;
  justify-content: center;
}

.maint-cert__image img {
  max-width: 200px;
  height: auto;
}

.maint-cert__content h3 {
  font-size: 1.5rem;
  font-weight: 600;
  margin: 0 0 1rem;
}

.maint-cert__content p {
  color: #666;
  line-height: 1.7;
  margin-bottom: 1.5rem;
}

.maint-cert__list {
  list-style: none;
  padding: 0;
  margin: 0;
}

.maint-cert__list li {
  position: relative;
  padding-left: 1.5rem;
  margin-bottom: 0.5rem;
  font-size: 0.9rem;
  color: #666;
}

.maint-cert__list li::before {
  content: '\u2713';
  position: absolute;
  left: 0;
  color: #1a1a1a;
}

@media (max-width: 768px) {
  .maint-cert__grid {
    grid-template-columns: 1fr;
    text-align: center;
  }
}

/* ========== SECTION 14: LOGOS STRIP ========== */
.maint-logos {
  background: #ffffff;
  padding: 3rem 2rem;
}

.maint-logos__container {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 3rem;
  flex-wrap: wrap;
}

.maint-logos__item {
  filter: grayscale(100%);
  opacity: 0.6;
  transition: all 0.3s ease;
}

.maint-logos__item:hover {
  filter: grayscale(0%);
  opacity: 1;
}

.maint-logos__item img {
  height: 50px;
  width: auto;
}

/* ========== SECTION 17: AIRCRAFT CARDS ========== */
.maint-aircraft {
  padding: 0 2rem 5rem;
}

.maint-aircraft__grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 1.5rem;
  max-width: 1100px;
  margin: 0 auto;
}

.maint-aircraft__card {
  border-left: 3px solid #1a1a1a;
  padding-left: 1rem;
}

.maint-aircraft__image {
  aspect-ratio: 4/3;
  border-radius: 8px;
  overflow: hidden;
  margin-bottom: 1rem;
}

.maint-aircraft__image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.5s ease;
}

.maint-aircraft__card:hover .maint-aircraft__image img {
  transform: scale(1.05);
}

.maint-aircraft__model {
  font-size: 0.9rem;
  font-weight: 600;
  text-transform: uppercase;
  margin-bottom: 0.25rem;
}

.maint-aircraft__notes {
  font-size: 0.75rem;
  color: #888;
}

@media (max-width: 900px) {
  .maint-aircraft__grid {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (max-width: 500px) {
  .maint-aircraft__grid {
    grid-template-columns: 1fr;
  }
}

/* ========== SECTION 18-19: TEAM ========== */
.maint-team {
  padding: 1.5rem 2rem 1rem;
  background: #faf9f6;
}

.maint-team__header {
  text-align: center;
  margin-bottom: 0.75rem;
}

.maint-profile {
  max-width: 700px;
  margin: 0 auto;
  background: #ffffff;
  border-left: 3px solid #1a1a1a;
  padding: 1.25rem 1.5rem;
  display: flex;
  align-items: center;
  gap: 1.25rem;
}

.maint-profile__image {
  width: 70px;
  height: 70px;
  border-radius: 50%;
  overflow: hidden;
  flex-shrink: 0;
}

.maint-profile__image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.maint-profile__name {
  font-size: 1rem;
  font-weight: 600;
  margin: 0 0 0.15rem;
}

.maint-profile__title {
  font-family: 'Share Tech Mono', monospace;
  font-size: 0.65rem;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  color: #888;
  display: block;
  margin-bottom: 0.5rem;
}

.maint-profile__stats {
  display: flex;
  gap: 1.25rem;
  margin-bottom: 0.5rem;
}

.maint-profile__stat-value {
  font-family: 'Share Tech Mono', monospace;
  font-size: 1rem;
  display: block;
}

.maint-profile__stat-label {
  font-size: 0.6rem;
  color: #888;
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.maint-profile__bio {
  font-size: 0.8rem;
  color: #666;
  line-height: 1.5;
  margin: 0;
}

@media (max-width: 500px) {
  .maint-profile {
    flex-direction: column;
    text-align: center;
  }
  .maint-profile__image {
    margin: 0 auto;
  }
  .maint-profile__stats {
    justify-content: center;
  }
}

.maint-team-grid {
  display: flex;
  flex-wrap: wrap;
  justify-content: flex-start;
  gap: 0.5rem;
  max-width: 700px;
  margin: 0.75rem auto 0;
}

.maint-team-member {
  background: #ffffff;
  border-left: 2px solid #1a1a1a;
  padding: 0.75rem 1rem;
  min-width: 140px;
}

.maint-team-member__name {
  font-size: 0.75rem;
  font-weight: 600;
  margin: 0 0 0.1rem;
}

.maint-team-member__role {
  font-size: 0.6rem;
  color: #888;
}

.maint-team-member--count {
  background: #1a1a1a;
  color: #faf9f6;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}

.maint-team-member__plus {
  font-family: 'Space Grotesk', sans-serif;
  font-size: 2rem;
  font-weight: 700;
  line-height: 1;
}

.maint-team-member__count-label {
  font-family: 'Share Tech Mono', monospace;
  font-size: 0.6rem;
  text-transform: uppercase;
  letter-spacing: 0.1em;
  opacity: 0.7;
  margin-top: 0.25rem;
}

/* === COMPACT CERTIFICATIONS === */
.maint-certs-compact {
  background: #faf9f6;
  padding: 2.5rem 2rem;
}

.maint-certs-compact__title {
  text-align: center;
  font-size: 0.9rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.1em;
  color: #1a1a1a;
  margin: 0 0 1.25rem;
}

.maint-certs-compact__grid {
  display: flex;
  justify-content: center;
  gap: 1rem;
  max-width: 900px;
  margin: 0 auto;
  flex-wrap: wrap;
}

.maint-certs-compact__card {
  background: #fff;
  padding: 0.75rem 1.25rem;
  border: 1px solid #e8e6e2;
  border-radius: 4px;
  display: flex;
  align-items: center;
  gap: 1rem;
}

.maint-certs-compact__logo {
  height: 40px;
  width: auto;
  object-fit: contain;
  flex-shrink: 0;
}

.maint-certs-compact__text {
  text-align: left;
}

.maint-certs-compact__card h4 {
  font-size: 0.8rem;
  font-weight: 600;
  margin: 0;
  color: #1a1a1a;
}

.maint-certs-compact__card p {
  font-size: 0.7rem;
  color: #888;
  line-height: 1.4;
  margin: 0.15rem 0 0;
}

@media (max-width: 768px) {
  .maint-certs-compact__grid {
    flex-direction: column;
    align-items: center;
  }
  .maint-certs-compact__card {
    width: 100%;
    max-width: 300px;
  }
}

/* === 05. SERVICES === */
.maint-services {
  padding: 4rem 2rem;
  background: #fff;
}

.maint-services__container {
  max-width: 1200px;
  margin: 0 auto;
}

.maint-services__grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 1rem;
}

.maint-services__card {
  background: #faf9f6;
  padding: 1.25rem;
  border: 1px solid #e8e6e2;
  transition: all 0.3s ease;
}

.maint-services__card:hover {
  border-color: #1a1a1a;
  box-shadow: 0 8px 30px rgba(0,0,0,0.08);
}

.maint-services__card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 0.75rem;
}

.maint-services__card-num {
  font-family: 'Share Tech Mono', monospace;
  font-size: 0.65rem;
  color: #ccc;
}

.maint-services__card-header i {
  font-size: 1rem;
  color: #1a1a1a;
}

.maint-services__card h3 {
  font-size: 0.9rem;
  text-transform: uppercase;
  letter-spacing: 0.02em;
  margin-bottom: 0.5rem;
}

.maint-services__card p {
  font-size: 0.8rem;
  color: #666;
  line-height: 1.5;
  margin-bottom: 0.75rem;
}

.maint-services__features {
  list-style: none;
  padding: 0;
  margin: 0 0 0.75rem 0;
}

.maint-services__features li {
  font-size: 0.7rem;
  color: #666;
  padding: 0.2rem 0;
  display: flex;
  align-items: center;
  gap: 0.4rem;
}

.maint-services__features li i {
  color: #4ade80;
  font-size: 0.6rem;
}

.maint-services__card-footer {
  padding-top: 0.75rem;
  border-top: 1px solid #e8e6e2;
}

.maint-services__link {
  font-size: 0.7rem;
  text-transform: uppercase;
  letter-spacing: 0.1em;
  color: #1a1a1a;
  text-decoration: none;
  display: inline-flex;
  align-items: center;
  gap: 0.4rem;
  transition: gap 0.3s ease;
}

/* === 05B. REBUILDS (STRIP CARDS) === */
.maint-rb {
  padding: 5rem 2rem;
  background: #faf9f6;
}
.maint-rb__container {
  max-width: 1100px;
  margin: 0 auto;
}
.maint-rb__header {
  text-align: center;
  margin-bottom: 3rem;
}
.maint-rb__headline {
  font-size: clamp(1.75rem, 3.5vw, 2.5rem);
  font-weight: 700;
  line-height: 1.1;
  margin-bottom: 1.5rem;
  text-transform: uppercase;
}
.maint-rb__body {
  font-size: 0.95rem;
  color: #666;
  line-height: 1.8;
  margin: 0 auto 1.25rem;
  max-width: 700px;
}
.maint-rb__meta {
  display: flex;
  justify-content: center;
  gap: 2rem;
  flex-wrap: wrap;
}
.maint-rb__meta-item {
  display: inline-flex;
  align-items: center;
  gap: 0.4rem;
  font-family: 'Share Tech Mono', monospace;
  font-size: 0.72rem;
  color: #1a1a1a;
  letter-spacing: 0.04em;
  padding: 0.4rem 0.75rem;
  background: #f0efec;
  border-radius: 3px;
}
.maint-rb__meta-item i {
  font-size: 0.65rem;
  color: #999;
}

/* Strip cards */
.maint-rb__strip-section {
  margin-bottom: 1.5rem;
}
.maint-rb__strip-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 1.25rem;
}
.maint-rb__strip-header h4 {
  font-family: 'Space Grotesk', sans-serif;
  font-size: 1.1rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.04em;
  margin: 0;
  color: #1a1a1a;
}
.maint-rb__strip-nav {
  display: flex;
  gap: 0.35rem;
}
.maint-rb__arrow-btn {
  width: 36px;
  height: 36px;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 1px solid #e8e6e2;
  border-radius: 50%;
  background: #fff;
  cursor: pointer;
  color: #1a1a1a;
  font-size: 0.7rem;
  transition: all 0.2s ease;
  box-shadow: 0 2px 8px rgba(0,0,0,0.06);
}
.maint-rb__arrow-btn:hover {
  background: #1a1a1a;
  color: #fff;
  border-color: #1a1a1a;
}
.maint-rb__strip {
  display: flex;
  gap: 1.25rem;
  overflow-x: auto;
  scroll-snap-type: x mandatory;
  scrollbar-width: none;
  -ms-overflow-style: none;
  padding-bottom: 0.5rem;
}
.maint-rb__strip::-webkit-scrollbar {
  display: none;
}
.maint-rb__card {
  flex: 0 0 calc((100% - 3.75rem) / 4);
  min-width: 220px;
  scroll-snap-align: start;
  border: 1px solid #e8e6e2;
  border-radius: 6px;
  background: #fff;
  text-decoration: none;
  color: inherit;
  transition: all 0.3s ease;
  display: flex;
  flex-direction: column;
  overflow: hidden;
}
.maint-rb__card:hover {
  border-color: #1a1a1a;
  box-shadow: 0 8px 24px rgba(0,0,0,0.08);
}
.maint-rb__card-img {
  aspect-ratio: 16 / 10;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 1.25rem;
  background: #f5f4f1;
}
.maint-rb__card-img img {
  max-width: 100%;
  max-height: 100%;
  object-fit: contain;
}
.maint-rb__card-info {
  padding: 0.75rem 1rem;
  display: flex;
  flex-direction: column;
  gap: 0.2rem;
}
.maint-rb__card-info strong {
  display: block;
  font-family: 'Space Grotesk', sans-serif;
  font-size: 0.78rem;
  font-weight: 600;
  text-transform: uppercase;
  color: #1a1a1a;
}
.maint-rb__card-info span {
  font-family: 'Share Tech Mono', monospace;
  font-size: 0.6rem;
  color: #7a7a7a;
  letter-spacing: 0.05em;
}
.maint-rb__card-cta {
  padding: 0.6rem 1rem;
  border-top: 1px solid #e8e6e2;
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-top: auto;
  background: #faf9f6;
  transition: all 0.25s ease;
}
.maint-rb__card-cta span {
  font-family: 'Share Tech Mono', monospace;
  font-size: 0.55rem;
  text-transform: uppercase;
  letter-spacing: 0.1em;
  color: #999;
}
.maint-rb__card-cta i {
  font-size: 0.5rem;
  color: #999;
  transition: transform 0.25s ease;
}
.maint-rb__card:hover .maint-rb__card-cta {
  background: #1a1a1a;
  color: #fff;
  border-color: #1a1a1a;
}
.maint-rb__card:hover .maint-rb__card-cta span {
  color: #fff;
}
.maint-rb__card:hover .maint-rb__card-cta i {
  transform: translateX(3px);
  color: #fff;
}

/* Card gallery (replaces card-img) */
.maint-rb__card-gallery {
  position: relative;
  overflow: hidden;
  aspect-ratio: 16 / 10;
  background: #f5f4f1;
}
.maint-rb__card-gallery img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
}
.maint-rb__gallery-nav {
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  width: 24px;
  height: 24px;
  border-radius: 50%;
  background: rgba(255,255,255,0.85);
  border: none;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  opacity: 0;
  transition: opacity 0.2s;
  z-index: 2;
  font-size: 0.5rem;
  color: #1a1a1a;
}
.maint-rb__gallery-nav--prev { left: 6px; }
.maint-rb__gallery-nav--next { right: 6px; }
.maint-rb__card:hover .maint-rb__gallery-nav { opacity: 1; }
.maint-rb__gallery-nav:hover { background: #fff; }
.maint-rb__gallery-dots {
  position: absolute;
  bottom: 8px;
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  gap: 5px;
  z-index: 2;
}
.maint-rb__gallery-dot {
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: rgba(255,255,255,0.45);
  border: 1px solid rgba(255,255,255,0.7);
  cursor: pointer;
  transition: background 0.2s;
}
.maint-rb__gallery-dot--active { background: #fff; }

/* Rebuild Showcase */
.maint-rb__showcase {
  background: #faf9f6;
  border: 1px solid #e8e6e2;
  margin-bottom: 1.5rem;
  animation: maintShowcaseIn 0.35s cubic-bezier(0.16, 1, 0.3, 1);
}
@keyframes maintShowcaseIn {
  from { opacity: 0; transform: translateY(8px); }
  to { opacity: 1; transform: translateY(0); }
}
.maint-rb__showcase-topbar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.6rem 1.5rem;
  border-bottom: 1px solid #e8e6e2;
}
.maint-rb__showcase-counter {
  font-family: 'Share Tech Mono', monospace;
  font-size: 0.65rem;
  letter-spacing: 0.08em;
  color: #1a1a1a;
}
.maint-rb__showcase-label {
  font-family: 'Share Tech Mono', monospace;
  font-size: 0.6rem;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  color: #7a7a7a;
}
.maint-rb__showcase-close {
  background: none;
  border: 1px solid #e8e6e2;
  font-family: 'Share Tech Mono', monospace;
  font-size: 0.6rem;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  color: #1a1a1a;
  padding: 0.35rem 1rem;
  cursor: pointer;
  transition: all 0.2s;
}
.maint-rb__showcase-close:hover { background: #1a1a1a; border-color: #1a1a1a; color: #fff; }
.maint-rb__showcase-content {
  display: grid;
  grid-template-columns: 1.2fr 1fr;
}
.maint-rb__showcase-gallery {
  padding: 1.25rem;
  display: flex;
  flex-direction: column;
  gap: 0.4rem;
}
.maint-rb__showcase-hero {
  position: relative;
  min-height: 200px;
  max-height: 360px;
  overflow: hidden;
  background: #eeedeb;
  cursor: pointer;
}
.maint-rb__showcase-hero img { width: 100%; height: 100%; object-fit: cover; transition: transform 0.6s cubic-bezier(0.16,1,0.3,1); }
.maint-rb__showcase-hero:hover img { transform: scale(1.04); }
.maint-rb__showcase-overlay {
  position: absolute;
  inset: 0;
  background: rgba(0,0,0,0);
  display: flex;
  align-items: center;
  justify-content: center;
  transition: background 0.3s;
}
.maint-rb__showcase-overlay i { color: #fff; font-size: 1.2rem; opacity: 0; transform: scale(0.8); transition: all 0.3s; }
.maint-rb__showcase-hero:hover .maint-rb__showcase-overlay { background: rgba(0,0,0,0.15); }
.maint-rb__showcase-hero:hover .maint-rb__showcase-overlay i { opacity: 1; transform: scale(1); }
.maint-rb__showcase-thumbs {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 0.4rem;
}
.maint-rb__showcase-thumb {
  background: none;
  border: none;
  padding: 0;
  cursor: pointer;
  overflow: hidden;
  aspect-ratio: 16 / 10;
}
.maint-rb__showcase-thumb img { width: 100%; height: 100%; object-fit: cover; display: block; transition: transform 0.4s ease; }
.maint-rb__showcase-thumb:hover img { transform: scale(1.06); }
.maint-rb__showcase-info {
  padding: 1.5rem 1.75rem;
  border-left: 1px solid #e8e6e2;
  display: flex;
  flex-direction: column;
  justify-content: center;
}
.maint-rb__showcase-overline {
  font-family: 'Share Tech Mono', monospace;
  font-size: 0.55rem;
  letter-spacing: 0.18em;
  text-transform: uppercase;
  color: #999;
  margin-bottom: 0.5rem;
}
.maint-rb__showcase-title {
  font-family: 'Space Grotesk', sans-serif;
  font-size: clamp(1.4rem, 2.5vw, 1.8rem);
  font-weight: 700;
  color: #1a1a1a;
  margin: 0 0 0.2rem;
  line-height: 1.1;
}
.maint-rb__showcase-reg {
  font-family: 'Share Tech Mono', monospace;
  font-size: 0.65rem;
  color: #999;
  letter-spacing: 0.08em;
}
.maint-rb__showcase-divider { width: 30px; height: 1px; background: #ddd9d3; margin: 1rem 0; }
.maint-rb__showcase-desc { font-size: 0.78rem; line-height: 1.7; color: #4a4a4a; margin: 0 0 1rem; }
.maint-rb__showcase-spec { display: flex; gap: 2.5rem; }
.maint-rb__showcase-spec-item { display: flex; flex-direction: column; gap: 0.25rem; }
.maint-rb__showcase-spec-label { font-family: 'Share Tech Mono', monospace; font-size: 0.5rem; letter-spacing: 0.15em; text-transform: uppercase; color: #999; }
.maint-rb__showcase-spec-value { font-family: 'Space Grotesk', sans-serif; font-size: 0.95rem; font-weight: 600; color: #1a1a1a; }
.maint-rb__showcase-nav {
  display: flex;
  border-top: 1px solid #e8e6e2;
}
.maint-rb__showcase-nav-btn {
  flex: 1;
  display: flex;
  align-items: center;
  gap: 0.6rem;
  padding: 0.7rem 1.5rem;
  background: none;
  border: none;
  cursor: pointer;
  transition: background 0.2s;
  font-family: 'Share Tech Mono', monospace;
  font-size: 0.6rem;
  letter-spacing: 0.08em;
  color: #1a1a1a;
}
.maint-rb__showcase-nav-btn:first-child { border-right: 1px solid #e8e6e2; }
.maint-rb__showcase-nav-btn--next { justify-content: flex-end; }
.maint-rb__showcase-nav-btn:hover:not(:disabled) { background: #fff; }
.maint-rb__showcase-nav-btn:disabled { opacity: 0.3; cursor: default; }
.maint-rb__showcase-nav-arrow { font-size: 0.9rem; }
.maint-rb__lightbox {
  position: fixed;
  inset: 0;
  background: rgba(0,0,0,0.92);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 9999;
  cursor: zoom-out;
}
.maint-rb__lightbox-img { max-width: 90vw; max-height: 90vh; object-fit: contain; }
@media (max-width: 768px) {
  .maint-rb__showcase-content { grid-template-columns: 1fr; }
  .maint-rb__showcase-info { border-left: none; border-top: 1px solid #e8e6e2; padding: 1.25rem; }
  .maint-rb__showcase-gallery { padding: 1.25rem; }
  .maint-rb__showcase-label { display: none; }
}

.maint-rb__tagline {
  font-family: 'Space Grotesk', sans-serif;
  font-size: 0.78rem;
  line-height: 1.7;
  color: #4a4a4a;
  text-align: center;
  margin: 0 0 1rem;
}

/* Actions */
.maint-rb__actions {
  display: flex;
  justify-content: center;
  gap: 1rem;
  flex-wrap: wrap;
  margin-top: 1rem;
}

@media (max-width: 768px) {
  .maint-rb__meta {
    flex-direction: column;
    align-items: center;
    gap: 0.5rem;
  }
  .maint-rb__card {
    flex: 0 0 calc((100% - 1.25rem) / 2);
    min-width: 200px;
  }
  .maint-rb__actions {
    flex-direction: column;
    align-items: center;
  }
}

/* === 05C. WE BUY ANY ROBINSON === */
.maint-webuy {
  padding: 4rem 2rem;
  background: linear-gradient(135deg, #1a1a1a 0%, #2d2d2d 100%);
}

.maint-webuy__container {
  max-width: 900px;
  margin: 0 auto;
  display: flex;
  align-items: flex-start;
  gap: 2rem;
}

.maint-webuy__badge {
  width: 80px;
  height: 80px;
  background: rgba(255,255,255,0.1);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.maint-webuy__badge i {
  font-size: 2rem;
  color: #4ade80;
}

.maint-webuy__content h2 {
  font-size: clamp(1.5rem, 3vw, 2rem);
  margin-bottom: 1rem;
  text-transform: uppercase;
}

.maint-webuy__body {
  font-size: 1rem;
  color: rgba(255,255,255,0.8);
  line-height: 1.7;
  margin-bottom: 1.5rem;
}

.maint-webuy__features {
  display: flex;
  flex-wrap: wrap;
  gap: 1rem;
  margin-bottom: 2rem;
}

.maint-webuy__feature {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  color: #fff;
}

.maint-webuy__feature i {
  color: #4ade80;
  font-size: 0.85rem;
}

.maint-webuy__feature span {
  font-size: 0.85rem;
}

.maint-webuy__cta {
  display: flex;
  align-items: center;
  gap: 2rem;
  flex-wrap: wrap;
}

.maint-webuy__phone {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  color: rgba(255,255,255,0.6);
  text-decoration: none;
  font-size: 0.85rem;
  transition: color 0.3s ease;
}

.maint-webuy__phone:hover {
  color: #fff;
}

.maint-services__link:hover {
  gap: 1rem;
}

/* === 05C-COMPACT. WE BUY ANY ROBINSON (compact banner) === */
.maint-webuy-compact {
  background: linear-gradient(135deg, #1a1a1a 0%, #2d2d2d 100%);
  padding: 1.25rem 2rem;
  border-top: 1px solid rgba(255,255,255,0.06);
}
.maint-webuy-compact__inner {
  max-width: 1100px;
  margin: 0 auto;
  display: flex;
  align-items: center;
  gap: 2rem;
  flex-wrap: wrap;
}
.maint-webuy-compact__left {
  display: flex;
  align-items: center;
  gap: 1rem;
  flex: 1;
  min-width: 200px;
}
.maint-webuy-compact__icon {
  font-size: 1.4rem;
  color: #4ade80;
  flex-shrink: 0;
}
.maint-webuy-compact__pre {
  display: block;
  font-family: 'Share Tech Mono', monospace;
  font-size: 0.55rem;
  letter-spacing: 0.2em;
  text-transform: uppercase;
  color: rgba(255,255,255,0.4);
  margin-bottom: 0.2rem;
}
.maint-webuy-compact__headline {
  font-family: 'Space Grotesk', sans-serif;
  font-size: 1rem;
  font-weight: 700;
  color: #fff;
  text-transform: uppercase;
  letter-spacing: 0.03em;
  margin: 0;
}
.maint-webuy-compact__pills {
  display: flex;
  gap: 0.5rem;
  flex-wrap: wrap;
  flex: 1;
  justify-content: center;
}
.maint-webuy-compact__pill {
  display: inline-flex;
  align-items: center;
  gap: 0.35rem;
  font-size: 0.65rem;
  color: rgba(255,255,255,0.6);
  border: 1px solid rgba(255,255,255,0.12);
  padding: 0.3rem 0.75rem;
  border-radius: 20px;
  white-space: nowrap;
}
.maint-webuy-compact__pill i {
  font-size: 0.5rem;
  color: #4ade80;
}
.maint-webuy-compact__btn {
  flex-shrink: 0;
  white-space: nowrap;
}
@media (max-width: 768px) {
  .maint-webuy-compact__inner { flex-direction: column; align-items: flex-start; gap: 1rem; }
  .maint-webuy-compact__pills { justify-content: flex-start; }
}

/* === 06. TIMELINE === */
.maint-timeline {
  padding: 6rem 2rem;
  background: #1a1a1a;
  overflow: hidden;
}

.maint-timeline__container {
  max-width: 1200px;
  margin: 0 auto;
}

.maint-timeline__track {
  position: relative;
  display: flex;
  justify-content: space-between;
  padding: 4rem 0;
}

.maint-timeline__line {
  position: absolute;
  top: 50%;
  left: 0;
  right: 0;
  height: 2px;
  background: rgba(255,255,255,0.2);
}

.maint-timeline__item {
  position: relative;
  flex: 1;
  text-align: center;
}

.maint-timeline__item--top .maint-timeline__content {
  position: absolute;
  bottom: 100%;
  left: 50%;
  transform: translateX(-50%);
  padding-bottom: 2rem;
}

.maint-timeline__item--bottom .maint-timeline__content {
  position: absolute;
  top: 100%;
  left: 50%;
  transform: translateX(-50%);
  padding-top: 2rem;
}

.maint-timeline__dot {
  width: 16px;
  height: 16px;
  background: #1a1a1a;
  border: 3px solid #faf9f6;
  border-radius: 50%;
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  z-index: 2;
}

.maint-timeline__year {
  font-family: 'Share Tech Mono', monospace;
  font-size: 0.8rem;
  color: rgba(255,255,255,0.5);
  display: block;
  margin-bottom: 0.5rem;
}

.maint-timeline__content h4 {
  font-size: 0.9rem;
  color: #fff;
  text-transform: uppercase;
  margin-bottom: 0.35rem;
  white-space: nowrap;
}

.maint-timeline__content p {
  font-size: 0.75rem;
  color: rgba(255,255,255,0.6);
  margin: 0;
  max-width: 150px;
}

/* === 07. CERTIFICATIONS (COMPACT) === */
.maint-certs {
  padding: 3rem 2rem;
  background: #faf9f6;
}

.maint-certs__container {
  max-width: 800px;
  margin: 0 auto;
}

.maint-certs__grid {
  display: flex;
  justify-content: center;
  gap: 2rem;
  flex-wrap: wrap;
}

.maint-certs__grid--two {
  display: flex;
  justify-content: center;
  gap: 3rem;
}

.maint-certs__card {
  display: flex;
  align-items: center;
  gap: 1rem;
  background: transparent;
  padding: 0;
  border: none;
}

.maint-certs__card:hover {
  opacity: 0.8;
}

.maint-certs__logo {
  height: 48px;
  width: 48px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.maint-certs__logo img {
  max-height: 100%;
  max-width: 100%;
  object-fit: contain;
}

.maint-certs__logo-fallback {
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.5rem;
  color: #999;
}

.maint-certs__name {
  font-size: 0.75rem;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  color: #666;
}

/* === 08. PROCESS === */
.maint-process {
  padding: 6rem 2rem;
  background: #fff;
}

.maint-process__container {
  max-width: 1200px;
  margin: 0 auto;
}

.maint-process__flow {
  display: grid;
  grid-template-columns: repeat(6, 1fr);
  gap: 0;
  align-items: stretch;
}

.maint-process__flow > * {
  height: 100%;
}

.maint-process__step {
  text-align: center;
  padding: 2rem 1rem;
  position: relative;
  background: #faf9f6;
  border: 1px solid #e8e6e2;
  margin-right: -1px;
  height: 100%;
  display: flex;
  flex-direction: column;
}

.maint-process__step-num {
  font-family: 'Share Tech Mono', monospace;
  font-size: 0.65rem;
  color: #ccc;
  margin-bottom: 0.75rem;
}

.maint-process__step-icon {
  width: 50px;
  height: 50px;
  background: #1a1a1a;
  color: #fff;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto 1rem;
  font-size: 1.1rem;
}

.maint-process__step h4 {
  font-size: 0.8rem;
  text-transform: uppercase;
  letter-spacing: 0.03em;
  margin-bottom: 0.5rem;
}

.maint-process__step p {
  font-size: 0.75rem;
  color: #666;
  margin: 0;
  line-height: 1.5;
  flex-grow: 1;
}

.maint-process__connector {
  position: absolute;
  right: -12px;
  top: 50%;
  transform: translateY(-50%);
  width: 24px;
  height: 24px;
  background: #fff;
  border: 1px solid #e8e6e2;
  border-radius: 50%;
  z-index: 2;
  display: flex;
  align-items: center;
  justify-content: center;
}

.maint-process__connector::after {
  content: '→';
  font-size: 0.8rem;
  color: #1a1a1a;
}

/* === 09. TEAM === */
.maint-team {
  padding: 6rem 2rem;
  background: #1a1a1a;
}

.maint-team__container {
  max-width: 1000px;
  margin: 0 auto;
}

.maint-team__grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 2rem;
}

.maint-team__card {
  background: rgba(255,255,255,0.05);
  border: 1px solid rgba(255,255,255,0.1);
  padding: 2rem;
  text-align: center;
}

.maint-team__photo {
  margin-bottom: 1.5rem;
}

.maint-team__photo-placeholder {
  width: 80px;
  height: 80px;
  background: rgba(255,255,255,0.1);
  border-radius: 50%;
  margin: 0 auto;
  display: flex;
  align-items: center;
  justify-content: center;
}

.maint-team__photo-placeholder i {
  font-size: 2rem;
  color: rgba(255,255,255,0.3);
}

.maint-team__info h4 {
  font-size: 1rem;
  color: #fff;
  margin-bottom: 0.25rem;
}

.maint-team__role {
  display: block;
  font-size: 0.75rem;
  color: rgba(255,255,255,0.6);
  text-transform: uppercase;
  letter-spacing: 0.1em;
  margin-bottom: 0.35rem;
}

.maint-team__exp {
  display: block;
  font-size: 0.7rem;
  color: rgba(255,255,255,0.4);
  margin-bottom: 1rem;
}

.maint-team__certs {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 0.5rem;
}

.maint-team__cert {
  font-size: 0.6rem;
  background: rgba(255,255,255,0.1);
  color: rgba(255,255,255,0.7);
  padding: 0.25rem 0.5rem;
  border-radius: 2px;
}

.maint-team__cta {
  text-align: center;
  margin-top: 3rem;
  padding-top: 2rem;
  border-top: 1px solid rgba(255,255,255,0.1);
}

.maint-team__cta p {
  color: rgba(255,255,255,0.6);
  font-size: 0.9rem;
}

.maint-team__card--count {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background: rgba(255,255,255,0.08);
  border: 1px dashed rgba(255,255,255,0.2);
}

.maint-team__count {
  display: flex;
  align-items: baseline;
  gap: 0.25rem;
  margin-bottom: 1rem;
}

.maint-team__count-plus {
  font-size: 2rem;
  color: rgba(255,255,255,0.5);
  font-weight: 300;
}

.maint-team__count-number {
  font-family: 'Share Tech Mono', monospace;
  font-size: 3.5rem;
  color: #fff;
  font-weight: 600;
  line-height: 1;
}

.maint-team__count-label {
  display: flex;
  flex-direction: column;
  text-align: center;
}

.maint-team__count-label span {
  font-size: 0.75rem;
  color: rgba(255,255,255,0.6);
  text-transform: uppercase;
  letter-spacing: 0.1em;
}

/* === 11. FACILITY === */
.maint-facility {
  padding: 6rem 2rem;
  background: #fff;
}

.maint-facility__container {
  max-width: 1200px;
  margin: 0 auto;
}

.maint-facility__gallery {
  display: grid;
  grid-template-columns: 2fr 1fr 1fr;
  gap: 1rem;
}

.maint-facility__gallery > div:first-child {
  grid-row: span 2;
}

.maint-facility__item {
  position: relative;
  overflow: hidden;
  height: 200px;
}

.maint-facility__gallery > div:first-child .maint-facility__item {
  height: 100%;
}

.maint-facility__item img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.5s ease;
}

.maint-facility__item:hover img {
  transform: scale(1.05);
}

.maint-facility__overlay {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  padding: 1.5rem;
  background: linear-gradient(transparent, rgba(0,0,0,0.8));
  color: #fff;
}

.maint-facility__overlay h4 {
  font-size: 0.9rem;
  text-transform: uppercase;
  margin-bottom: 0.25rem;
}

.maint-facility__overlay p {
  font-size: 0.75rem;
  color: rgba(255,255,255,0.7);
  margin: 0;
}

/* === 12. EQUIPMENT === */
.maint-equipment {
  padding: 4rem 2rem;
  background: #faf9f6;
  overflow: hidden;
}

.maint-equipment__container {
  max-width: 1200px;
  margin: 0 auto;
}

.maint-equipment__scroll {
  margin-top: 2rem;
  overflow: hidden;
}

.maint-equipment__track {
  display: flex;
  gap: 2rem;
  animation: equipmentScroll 20s linear infinite;
}

@keyframes equipmentScroll {
  0% { transform: translateX(0); }
  100% { transform: translateX(-50%); }
}

.maint-equipment__item {
  flex-shrink: 0;
  display: flex;
  align-items: center;
  gap: 0.75rem;
  background: #fff;
  padding: 1rem 1.5rem;
  border: 1px solid #e8e6e2;
}

.maint-equipment__item i {
  font-size: 1.25rem;
  color: #1a1a1a;
}

.maint-equipment__item span {
  font-size: 0.8rem;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  white-space: nowrap;
}

/* === 14. SCHEDULE === */
.maint-schedule {
  padding: 6rem 2rem;
  background: #faf9f6;
}

.maint-schedule__container {
  max-width: 1000px;
  margin: 0 auto;
}

.maint-schedule__table {
  background: #fff;
  border: 1px solid #e8e6e2;
}

.maint-schedule__header {
  display: grid;
  grid-template-columns: 100px 180px 120px 1fr;
  gap: 1rem;
  padding: 1rem 1.5rem;
  background: #1a1a1a;
  color: #fff;
  font-size: 0.7rem;
  text-transform: uppercase;
  letter-spacing: 0.1em;
}

.maint-schedule__row {
  display: grid;
  grid-template-columns: 100px 180px 120px 1fr;
  gap: 1rem;
  padding: 1rem 1.5rem;
  border-bottom: 1px solid #e8e6e2;
  align-items: center;
}

.maint-schedule__row:last-child {
  border-bottom: none;
}

.maint-schedule__interval {
  font-family: 'Share Tech Mono', monospace;
  font-size: 0.85rem;
  font-weight: 600;
}

.maint-schedule__work {
  font-size: 0.9rem;
  font-weight: 500;
}

.maint-schedule__duration {
  font-size: 0.85rem;
  color: #666;
}

.maint-schedule__includes {
  font-size: 0.8rem;
  color: #888;
}

.maint-schedule__note {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  margin-top: 1.5rem;
  padding: 1rem;
  background: rgba(0,0,0,0.02);
  border-left: 3px solid #1a1a1a;
}

.maint-schedule__note i {
  color: #1a1a1a;
}

.maint-schedule__note p {
  font-size: 0.8rem;
  color: #666;
  margin: 0;
}

/* === 15. PARTS === */
.maint-parts {
  padding: 6rem 2rem;
  background: #1a1a1a;
}

.maint-parts__container {
  max-width: 1200px;
  margin: 0 auto;
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 4rem;
  align-items: center;
}

.maint-parts__content p {
  font-size: 1.1rem;
  color: rgba(255,255,255,0.7);
  line-height: 1.8;
  margin-bottom: 2rem;
}

.maint-parts__features {
  display: flex;
  flex-wrap: wrap;
  gap: 1.5rem;
  margin-bottom: 2rem;
}

.maint-parts__feature {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  color: #fff;
}

.maint-parts__feature i {
  font-size: 1.25rem;
  color: rgba(255,255,255,0.5);
}

.maint-parts__feature span {
  font-size: 0.85rem;
}

.maint-parts__grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 1rem;
}

.maint-parts__item {
  background: rgba(255,255,255,0.05);
  border: 1px solid rgba(255,255,255,0.1);
  padding: 1.5rem;
  text-align: center;
}

.maint-parts__item-cat {
  display: block;
  font-size: 0.7rem;
  text-transform: uppercase;
  letter-spacing: 0.15em;
  color: rgba(255,255,255,0.5);
  margin-bottom: 0.5rem;
}

.maint-parts__item-count {
  font-family: 'Share Tech Mono', monospace;
  font-size: 2rem;
  color: #fff;
  font-weight: 600;
}


/* === 18. CONTACT CTA === */
.maint-contact-cta {
  padding: 6rem 2rem;
  background: #fff;
}

.maint-contact-cta__container {
  max-width: 1100px;
  margin: 0 auto;
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 4rem;
  align-items: center;
}

.maint-contact-cta__content h2 {
  font-size: clamp(2rem, 4vw, 2.5rem);
  text-transform: uppercase;
  margin-bottom: 1rem;
}

.maint-contact-cta__content p {
  font-size: 1rem;
  color: #666;
  margin-bottom: 2rem;
}

.maint-contact-cta__actions {
  display: flex;
  gap: 1rem;
  flex-wrap: wrap;
}

.maint-contact-cta__card {
  background: #faf9f6;
  padding: 2rem;
  border: 1px solid #e8e6e2;
}

.maint-contact-cta__item {
  display: flex;
  gap: 1rem;
  padding: 1rem 0;
  border-bottom: 1px solid #e8e6e2;
}

.maint-contact-cta__item:last-child {
  border-bottom: none;
}

.maint-contact-cta__item i {
  font-size: 1.25rem;
  color: #1a1a1a;
  width: 24px;
}

.maint-contact-cta__item h4 {
  font-size: 0.75rem;
  text-transform: uppercase;
  letter-spacing: 0.1em;
  margin-bottom: 0.35rem;
}

.maint-contact-cta__item p {
  font-size: 0.85rem;
  color: #666;
  margin: 0;
  line-height: 1.5;
}

/* === 20. EMERGENCY === */
.maint-emergency {
  padding: 2rem;
  background: linear-gradient(135deg, #dc2626 0%, #b91c1c 100%);
}

.maint-emergency__container {
  max-width: 1000px;
  margin: 0 auto;
  display: flex;
  align-items: center;
  gap: 2rem;
  flex-wrap: wrap;
}

.maint-emergency__icon {
  width: 60px;
  height: 60px;
  background: rgba(255,255,255,0.2);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.maint-emergency__icon i {
  font-size: 1.5rem;
  color: #fff;
}

.maint-emergency__content {
  flex: 1;
}

.maint-emergency__content h3 {
  color: #fff;
  font-size: 1.25rem;
  text-transform: uppercase;
  margin-bottom: 0.25rem;
}

.maint-emergency__content p {
  color: rgba(255,255,255,0.8);
  font-size: 0.9rem;
  margin: 0;
}

.maint-emergency__phone {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.25rem;
  background: #fff;
  padding: 1rem 2rem;
  text-decoration: none;
  color: #1a1a1a;
  transition: transform 0.3s ease;
}

.maint-emergency__phone:hover {
  transform: scale(1.05);
}

.maint-emergency__phone i {
  font-size: 1.25rem;
}

.maint-emergency__phone span {
  font-size: 0.65rem;
  text-transform: uppercase;
  letter-spacing: 0.1em;
  color: #888;
}

.maint-emergency__phone strong {
  font-family: 'Share Tech Mono', monospace;
  font-size: 1rem;
}

/* === RESPONSIVE === */
@media (max-width: 1024px) {
  .maint-philosophy__container {
    grid-template-columns: 1fr;
    gap: 2rem;
  }

  .maint-parts__container,
  .maint-contact-cta__container,
  .maint-rebuilds__container {
    grid-template-columns: 1fr;
  }

  .maint-services__grid {
    grid-template-columns: repeat(2, 1fr);
  }

  .maint-team__grid {
    grid-template-columns: repeat(2, 1fr);
  }

  .maint-process__flow {
    grid-template-columns: repeat(3, 1fr);
  }

  .maint-certs__grid {
    grid-template-columns: repeat(2, 1fr);
  }

  .maint-timeline__track {
    flex-direction: column;
    gap: 2rem;
    padding: 2rem;
  }

  .maint-timeline__line {
    display: none;
  }

  .maint-timeline__item--top .maint-timeline__content,
  .maint-timeline__item--bottom .maint-timeline__content {
    position: static;
    transform: none;
    padding: 0;
  }

  .maint-timeline__dot {
    display: none;
  }

  .maint-webuy__container {
    flex-direction: column;
    text-align: center;
  }

  .maint-webuy__features {
    justify-content: center;
  }

  .maint-webuy__cta {
    justify-content: center;
  }
}

@media (max-width: 768px) {
  .maint-services__grid,
  .maint-team__grid {
    grid-template-columns: 1fr;
  }

  .maint-process__flow {
    grid-template-columns: repeat(2, 1fr);
  }

  .maint-process__connector {
    display: none;
  }

  .maint-philosophy__container {
    grid-template-columns: 1fr;
    gap: 0;
  }
  .maint-philosophy__divider {
    width: 100%;
    height: 1px;
    margin: 1rem 0;
  }
  .maint-philosophy__pillars {
    grid-template-columns: 1fr;
  }

  .maint-facility__gallery {
    grid-template-columns: 1fr;
  }

  .maint-facility__gallery > div:first-child {
    grid-row: auto;
  }

  .maint-schedule__header,
  .maint-schedule__row {
    grid-template-columns: 80px 1fr;
  }

  .maint-schedule__duration,
  .maint-schedule__includes {
    display: none;
  }

  .maint-certs__grid--two {
    flex-direction: column;
    align-items: center;
  }

  .maint-scroll-progress {
    display: none;
  }

  .maint-emergency__container {
    flex-direction: column;
    text-align: center;
  }
}

/* ========== SECTION 21: INSPECTION STICKY SCROLL ========== */
.maint-inspect {
  display: flex;
  min-height: 300vh;
}

.maint-inspect__left {
  position: sticky;
  top: 0;
  height: 100vh;
  width: 40%;
  background: #1a1a1a;
  color: #faf9f6;
  display: flex;
  flex-direction: column;
  justify-content: center;
  padding: 3rem;
}

.maint-inspect__number {
  font-family: 'Share Tech Mono', monospace;
  font-size: 4rem;
  opacity: 0.3;
}

.maint-inspect__title {
  font-size: 0.7rem;
  letter-spacing: 0.2em;
  text-transform: uppercase;
  margin-bottom: 1rem;
}

.maint-inspect__current {
  font-size: 1.5rem;
  font-weight: 600;
}

.maint-inspect__dots {
  display: flex;
  gap: 0.5rem;
  margin-top: 2rem;
}

.maint-inspect__dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: rgba(250,249,246,0.3);
  transition: background 0.3s;
}

.maint-inspect__dot--active {
  background: #faf9f6;
}

.maint-inspect__right {
  width: 60%;
  background: #faf9f6;
}

.maint-inspect__item {
  min-height: 100vh;
  display: flex;
  align-items: center;
  padding: 4rem;
}

.maint-inspect__content h3 {
  font-size: 2rem;
  font-weight: 600;
  margin: 0 0 1rem;
}

.maint-inspect__content p {
  color: #666;
  line-height: 1.7;
  margin-bottom: 2rem;
}

.maint-inspect__details {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 1.5rem;
}

.maint-inspect__detail-label {
  font-family: 'Share Tech Mono', monospace;
  font-size: 0.65rem;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  color: #888;
  display: block;
  margin-bottom: 0.25rem;
}

.maint-inspect__detail-value {
  font-size: 0.9rem;
  font-weight: 500;
}

@media (max-width: 900px) {
  .maint-inspect {
    flex-direction: column;
    min-height: auto;
  }
  .maint-inspect__left {
    position: relative;
    width: 100%;
    height: auto;
    padding: 3rem 2rem;
  }
  .maint-inspect__right {
    width: 100%;
  }
  .maint-inspect__item {
    min-height: auto;
    padding: 3rem 2rem;
  }
}

/* ========== SECTION 22: OVERHAUL ========== */
.maint-overhaul {
  padding: 5rem 2rem;
  background: #ffffff;
}

.maint-overhaul__grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 3rem;
  max-width: 1000px;
  margin: 0 auto;
  align-items: center;
}

.maint-overhaul__image {
  border-radius: 8px;
  overflow: hidden;
}

.maint-overhaul__image img {
  width: 100%;
  height: auto;
}

.maint-overhaul__timeline {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  background: #faf9f6;
  padding: 0.5rem 1rem;
  border-radius: 4px;
  margin-top: 1.5rem;
}

.maint-overhaul__timeline-icon {
  font-size: 1rem;
}

.maint-overhaul__timeline-text {
  font-family: 'Share Tech Mono', monospace;
  font-size: 0.8rem;
}

.maint-overhaul__features {
  list-style: none;
  padding: 0;
  margin: 1.5rem 0 0;
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 0.5rem;
}

.maint-overhaul__features li {
  font-size: 0.85rem;
  color: #666;
  padding-left: 1.25rem;
  position: relative;
}

.maint-overhaul__features li::before {
  content: '→';
  position: absolute;
  left: 0;
  color: #1a1a1a;
}

@media (max-width: 768px) {
  .maint-overhaul__grid {
    grid-template-columns: 1fr;
  }
  .maint-overhaul__features {
    grid-template-columns: 1fr;
  }
}

/* ========== SECTION 23: COMPONENT ACCORDION ========== */
.maint-accordion {
  padding: 5rem 2rem;
  background: #faf9f6;
}

.maint-accordion__container {
  max-width: 800px;
  margin: 0 auto;
}

.maint-accordion__header {
  text-align: center;
  margin-bottom: 3rem;
}

.maint-accordion__item {
  background: #ffffff;
  margin-bottom: 1px;
  overflow: hidden;
}

.maint-accordion__trigger {
  width: 100%;
  padding: 1.25rem 1.5rem;
  display: flex;
  align-items: center;
  gap: 1rem;
  border: none;
  background: none;
  cursor: pointer;
  text-align: left;
  font-family: inherit;
  transition: background 0.2s;
}

.maint-accordion__trigger:hover {
  background: #faf9f6;
}

.maint-accordion__num {
  font-family: 'Share Tech Mono', monospace;
  font-size: 0.75rem;
  color: #888;
  width: 24px;
}

.maint-accordion__title {
  flex: 1;
  font-size: 1rem;
  font-weight: 500;
}

.maint-accordion__icon {
  width: 20px;
  height: 20px;
  position: relative;
}

.maint-accordion__icon::before,
.maint-accordion__icon::after {
  content: '';
  position: absolute;
  background: #1a1a1a;
  transition: transform 0.3s;
}

.maint-accordion__icon::before {
  width: 12px;
  height: 1px;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
}

.maint-accordion__icon::after {
  width: 1px;
  height: 12px;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
}

.maint-accordion__item--open .maint-accordion__icon::after {
  transform: translate(-50%, -50%) rotate(90deg);
}

.maint-accordion__content {
  max-height: 0;
  overflow: hidden;
  transition: max-height 0.3s ease;
}

.maint-accordion__item--open .maint-accordion__content {
  max-height: 200px;
}

.maint-accordion__text {
  padding: 0 1.5rem 1.5rem;
  padding-left: calc(1.5rem + 24px + 1rem);
  color: #666;
  font-size: 0.9rem;
  line-height: 1.6;
}

/* ========== SECTION 25: REFURBISHMENT ========== */
.maint-refurb {
  padding: 5rem 2rem;
  background: #faf9f6;
}

.maint-refurb__container {
  max-width: 900px;
  margin: 0 auto;
}

.maint-refurb__tabs {
  display: flex;
  justify-content: center;
  gap: 0.5rem;
  margin-bottom: 3rem;
  flex-wrap: wrap;
}

.maint-refurb__tab {
  padding: 0.75rem 1.5rem;
  background: transparent;
  border: 1px solid #e8e6e2;
  border-radius: 4px;
  font-family: inherit;
  font-size: 0.85rem;
  cursor: pointer;
  transition: all 0.2s;
}

.maint-refurb__tab:hover {
  border-color: #1a1a1a;
}

.maint-refurb__tab--active {
  background: #1a1a1a;
  color: #faf9f6;
  border-color: #1a1a1a;
}

.maint-refurb__content {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 3rem;
  align-items: center;
}

.maint-refurb__image {
  border-radius: 8px;
  overflow: hidden;
}

.maint-refurb__image img {
  width: 100%;
  height: auto;
}

.maint-refurb__text h3 {
  font-size: 1.5rem;
  font-weight: 600;
  margin: 0 0 1rem;
}

.maint-refurb__text p {
  color: #666;
  line-height: 1.7;
}

@media (max-width: 768px) {
  .maint-refurb__content {
    grid-template-columns: 1fr;
  }
}

/* ========== SECTION 26: TURNAROUND & PRICING ========== */
.maint-pricing {
  padding: 5rem 2rem;
  background: #ffffff;
}

.maint-pricing__grid {
  display: grid;
  grid-template-columns: 1fr 1px 1fr;
  gap: 3rem;
  max-width: 900px;
  margin: 0 auto;
}

.maint-pricing__divider {
  background: #e8e6e2;
}

.maint-pricing__col h3 {
  font-size: 1.25rem;
  font-weight: 600;
  margin: 0 0 1.5rem;
}

.maint-pricing__list {
  list-style: none;
  padding: 0;
  margin: 0;
}

.maint-pricing__list li {
  display: flex;
  justify-content: space-between;
  padding: 0.75rem 0;
  border-bottom: 1px solid #f0f0f0;
  font-size: 0.9rem;
}

.maint-pricing__list li span:last-child {
  font-family: 'Share Tech Mono', monospace;
  color: #666;
}

.maint-pricing__text {
  color: #666;
  line-height: 1.7;
  margin-bottom: 1.5rem;
}

.maint-pricing__btn {
  display: inline-block;
  padding: 0.875rem 1.75rem;
  background: #1a1a1a;
  color: #faf9f6;
  text-decoration: none;
  font-size: 0.85rem;
  font-weight: 500;
  border-radius: 4px;
  transition: transform 0.2s;
}

.maint-pricing__btn:hover {
  transform: translateY(-2px);
}

@media (max-width: 768px) {
  .maint-pricing__grid {
    grid-template-columns: 1fr;
    gap: 2rem;
  }
  .maint-pricing__divider {
    display: none;
  }
}

/* ========== SECTION 27: LOCATION ========== */
.maint-location {
  padding: 5rem 2rem;
  background: #faf9f6;
}

.maint-location__container {
  max-width: 800px;
  margin: 0 auto;
}

.maint-location__map {
  height: 180px;
  background: #e8e6e2;
  border-radius: 8px;
  margin-bottom: 2rem;
  display: flex;
  align-items: center;
  justify-content: center;
  background-image:
    linear-gradient(rgba(0,0,0,0.05) 1px, transparent 1px),
    linear-gradient(90deg, rgba(0,0,0,0.05) 1px, transparent 1px);
  background-size: 20px 20px;
}

.maint-location__map-text {
  font-family: 'Share Tech Mono', monospace;
  font-size: 0.7rem;
  color: #888;
  letter-spacing: 0.1em;
}

.maint-location__grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 2rem;
}

.maint-location__col h4 {
  font-size: 0.7rem;
  font-weight: 600;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  color: #888;
  margin: 0 0 0.75rem;
}

.maint-location__col p {
  font-size: 0.9rem;
  line-height: 1.6;
  margin: 0;
}

@media (max-width: 600px) {
  .maint-location__grid {
    grid-template-columns: 1fr;
  }
}

/* ========== SECTION 29: CTA ========== */
.maint-cta {
  background: #1a1a1a;
  color: #faf9f6;
  padding: 5rem 2rem;
}

.maint-cta__container {
  max-width: 1000px;
  margin: 0 auto;
  display: grid;
  grid-template-columns: auto 1fr;
  gap: 4rem;
  align-items: center;
}

/* Service Ticket */
.maint-ticket {
  background: #faf9f6;
  color: #1a1a1a;
  border-radius: 8px;
  overflow: hidden;
  width: 280px;
  box-shadow: 0 8px 32px rgba(0,0,0,0.3);
}

.maint-ticket__header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem;
  border-bottom: 1px dashed #e8e6e2;
}

.maint-ticket__logo {
  height: 20px;
  width: auto;
}

.maint-ticket__type {
  font-family: 'Share Tech Mono', monospace;
  font-size: 0.6rem;
  letter-spacing: 0.1em;
  color: #888;
}

.maint-ticket__class {
  font-family: 'Share Tech Mono', monospace;
  font-size: 0.7rem;
  background: #1a1a1a;
  color: #faf9f6;
  padding: 0.25rem 0.5rem;
  border-radius: 2px;
}

.maint-ticket__route {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 1.5rem 1rem;
}

.maint-ticket__point {
  text-align: center;
}

.maint-ticket__code {
  display: block;
  font-size: 1.25rem;
  font-weight: 600;
}

.maint-ticket__city {
  display: block;
  font-size: 0.65rem;
  color: #888;
  margin-top: 0.25rem;
}

.maint-ticket__arrow {
  color: #ccc;
}

.maint-ticket__perf {
  height: 20px;
  background: repeating-linear-gradient(
    90deg,
    transparent,
    transparent 8px,
    #e8e6e2 8px,
    #e8e6e2 16px
  );
  position: relative;
}

.maint-ticket__perf::before,
.maint-ticket__perf::after {
  content: '';
  position: absolute;
  width: 20px;
  height: 20px;
  background: #1a1a1a;
  border-radius: 50%;
  top: 50%;
  transform: translateY(-50%);
}

.maint-ticket__perf::before { left: -10px; }
.maint-ticket__perf::after { right: -10px; }

.maint-ticket__stub {
  padding: 1rem;
  background: #f5f4f2;
}

.maint-ticket__stub-row {
  display: flex;
  justify-content: space-between;
}

.maint-ticket__stub-row > div {
  text-align: center;
}

.maint-ticket__lbl {
  display: block;
  font-family: 'Share Tech Mono', monospace;
  font-size: 0.55rem;
  color: #888;
  letter-spacing: 0.05em;
  margin-bottom: 0.25rem;
}

.maint-ticket__stub-row span:not(.maint-ticket__lbl) {
  font-weight: 600;
  font-size: 0.9rem;
}

.maint-cta__content {
  max-width: 500px;
}

.maint-cta__headline {
  font-size: clamp(1.75rem, 4vw, 2.5rem);
  font-weight: 600;
  margin-bottom: 1rem;
}

.maint-cta__body {
  color: rgba(250,249,246,0.7);
  line-height: 1.7;
  margin-bottom: 2rem;
}

.maint-cta__buttons {
  display: flex;
  gap: 1rem;
  flex-wrap: wrap;
}

.maint-cta__btn {
  display: inline-block;
  padding: 1rem 2rem;
  font-size: 0.85rem;
  font-weight: 500;
  text-decoration: none;
  border-radius: 4px;
  transition: transform 0.2s;
}

.maint-cta__btn:hover {
  transform: translateY(-2px);
}

.maint-cta__btn--primary {
  background: #faf9f6;
  color: #1a1a1a;
}

.maint-cta__btn--outline {
  background: transparent;
  color: #faf9f6;
  border: 1px solid rgba(250,249,246,0.3);
}

.maint-cta__aog {
  margin-top: 2rem;
  padding-top: 2rem;
  border-top: 1px solid rgba(250,249,246,0.1);
  display: flex;
  align-items: center;
  gap: 1rem;
}

.maint-cta__aog-label {
  font-size: 0.7rem;
  text-transform: uppercase;
  letter-spacing: 0.1em;
  color: rgba(250,249,246,0.5);
}

.maint-cta__aog-phone {
  font-family: 'Share Tech Mono', monospace;
  font-size: 1.1rem;
  color: #faf9f6;
  text-decoration: none;
  transition: opacity 0.2s;
}

.maint-cta__aog-phone:hover {
  opacity: 0.7;
}

@media (max-width: 900px) {
  .maint-cta__container {
    grid-template-columns: 1fr;
    text-align: center;
  }
  .maint-ticket {
    margin: 0 auto;
  }
  .maint-cta__buttons {
    justify-content: center;
  }
  .maint-cta__aog {
    flex-direction: column;
    gap: 0.5rem;
    justify-content: center;
  }
}
`;

// ============================================
// MAINTENANCE ENQUIRY FORM
// ============================================

function MaintenanceEnquiryForm() {
  const [formOpen, setFormOpen] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [aircraftType, setAircraftType] = useState('');
  const [reg, setReg] = useState('');
  const [notes, setNotes] = useState('');

  async function handleSubmit(e) {
    e.preventDefault();
    if (!email) { setError('Email is required'); return; }
    setSubmitting(true);
    setError('');
    try {
      const body = [
        `Aircraft: ${aircraftType || 'Not specified'}`,
        reg ? `Registration: ${reg}` : '',
        notes ? `Notes: ${notes}` : '',
      ].filter(Boolean).join('\n');
      const res = await fetch('/api/leads', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name, email, phone,
          subject: 'Maintenance Enquiry',
          message: body || 'No additional information provided.',
          source: 'maintenance-enquiry',
        }),
      });
      if (!res.ok) throw new Error('Request failed');
      setSubmitted(true);
    } catch {
      setError('Something went wrong. Please try again or call us directly.');
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div style={{ background: '#f0efec', padding: '0 2rem 2rem' }}>
      <div style={{ maxWidth: '1000px', margin: '0 auto' }}>
        <div style={{ width: '100%' }}>

          {!formOpen && !submitted && (
            <button className="fd-sales__intent-btn fd-sales__intent-btn--full" onClick={() => setFormOpen(true)}>
              <span className="fd-sales__intent-icon">↗</span>
              <span className="fd-sales__intent-title">Start Your Maintenance with HQ</span>
              <span className="fd-sales__intent-sub">50-hour, 100-hour, annual, or full overhaul — tell us what your aircraft needs and we'll take it from there.</span>
            </button>
          )}

          {formOpen && !submitted && (
            <form className="fd-sales__unmanned-form" onSubmit={handleSubmit}>
              <div className="fd-sales__unmanned-form-header">
                <span className="fd-sales__unmanned-form-badge">Maintenance Enquiry</span>
                <button type="button" className="fd-sales__unmanned-back" onClick={() => { setFormOpen(false); setError(''); }}>← Back</button>
              </div>

              <div className="fd-sales__unmanned-form-row fd-sales__unmanned-form-row--2col">
                <div className="fd-sales__unmanned-field">
                  <label className="fd-sales__unmanned-label">Aircraft Type</label>
                  <input className="fd-sales__unmanned-input" type="text" placeholder="e.g. Robinson R44 Raven II" value={aircraftType} onChange={e => setAircraftType(e.target.value)} />
                </div>
                <div className="fd-sales__unmanned-field">
                  <label className="fd-sales__unmanned-label">Registration <span className="fd-sales__unmanned-optional">(optional)</span></label>
                  <input className="fd-sales__unmanned-input" type="text" placeholder="e.g. G-HQAV" value={reg} onChange={e => setReg(e.target.value)} />
                </div>
              </div>

              <div className="fd-sales__unmanned-form-row">
                <div className="fd-sales__unmanned-field">
                  <label className="fd-sales__unmanned-label">Name</label>
                  <input className="fd-sales__unmanned-input" type="text" placeholder="Full name" value={name} onChange={e => setName(e.target.value)} />
                </div>
                <div className="fd-sales__unmanned-field">
                  <label className="fd-sales__unmanned-label">Email <span style={{ color: '#c00' }}>*</span></label>
                  <input className="fd-sales__unmanned-input" type="email" placeholder="you@example.com" required value={email} onChange={e => setEmail(e.target.value)} />
                </div>
                <div className="fd-sales__unmanned-field">
                  <label className="fd-sales__unmanned-label">Phone <span className="fd-sales__unmanned-optional">(optional)</span></label>
                  <input className="fd-sales__unmanned-input" type="tel" placeholder="+44" value={phone} onChange={e => setPhone(e.target.value)} />
                </div>
              </div>

              <div className="fd-sales__unmanned-field">
                <label className="fd-sales__unmanned-label">Additional Notes <span className="fd-sales__unmanned-optional">(optional)</span></label>
                <textarea className="fd-sales__unmanned-input fd-sales__unmanned-textarea" placeholder="Any other details — defects noticed, parts needed, access constraints…" rows={3} value={notes} onChange={e => setNotes(e.target.value)} />
              </div>

              {error && <p className="fd-sales__unmanned-error">{error}</p>}
              <div className="fd-sales__unmanned-form-footer">
                <button type="submit" className="fd-sales__unmanned-submit" disabled={submitting}>
                  {submitting ? 'Sending…' : 'Submit Enquiry'}
                </button>
                <span className="fd-sales__unmanned-form-note">We'll be in touch shortly.</span>
              </div>
            </form>
          )}

          {submitted && (
            <div className="fd-sales__unmanned-success">
              <span className="fd-sales__unmanned-success-icon">✓</span>
              <p className="fd-sales__unmanned-success-title">Enquiry Received</p>
              <p className="fd-sales__unmanned-success-sub">Thank you — a member of our maintenance team will be in touch to confirm the details.</p>
            </div>
          )}
        </div>

        <a href="tel:+441895833838" className="rb__cta-phone">
          <span>Or call directly</span>
          <strong>+44 (0) 1895 833 838</strong>
        </a>
      </div>
    </div>
  );
}

// ============================================
// TURNAROUND & CERTIFICATIONS SECTION
// ============================================

function TurnaroundTimes() {
  const times = [
    { service: '50-Hour Inspection', time: '1-2 days' },
    { service: '100-Hour Inspection', time: '2-3 days' },
    { service: 'Annual Inspection', time: '3-5 days' },
    { service: '2200-Hour Overhaul', time: '4-6 weeks' },
    { service: 'AOG Response', time: 'Same day' },
  ];

  const certs = [
    { logo: '/assets/images/logos/easa-logo.png', title: 'EASA Part 145', desc: 'European approved maintenance organisation' },
    { logo: '/assets/images/robinson-assets/logos/rhc_authorized-service-center-logo-logo-yellow-rotor-black-type.svg', title: 'Robinson Authorized', desc: 'Factory-authorized since 1990' },
    { logo: '/assets/images/logos/guimbal-logo.png', title: 'Guimbal Certified', desc: 'UK service centre for Cabri G2' },
  ];

  return (
    <>
    <section className="maint-turnaround">
      <div className="maint-turnaround__container">
        {/* Left: Turnaround Times */}
        <div className="maint-turnaround__left">
          <h3 className="maint-turnaround__title">Typical Turnaround</h3>
          <div className="maint-turnaround__list">
            {times.map((item) => (
              <div key={item.service} className="maint-turnaround__item">
                <span className="maint-turnaround__service">{item.service}</span>
                <span className="maint-turnaround__time">{item.time}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Vertical Divider */}
        <div className="maint-turnaround__divider"></div>

        {/* Right: Certifications */}
        <div className="maint-turnaround__right">
          <h3 className="maint-turnaround__title">Approved & Certified</h3>
          <div className="maint-turnaround__certs">
            {certs.map((cert) => (
              <div key={cert.title} className="maint-turnaround__cert">
                <img src={cert.logo} alt={cert.title} />
                <div className="maint-turnaround__cert-text">
                  <h4>{cert.title}</h4>
                  <p>{cert.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <style>{`
        .maint-turnaround {
          background: #f0efec;
          padding: 2rem 2rem;
        }
        .maint-turnaround__container {
          max-width: 1000px;
          margin: 0 auto;
          display: grid;
          grid-template-columns: 1fr 1px 1fr;
          gap: 2rem;
          align-items: stretch;
        }
        .maint-turnaround__divider {
          background: #ddd;
        }
        .maint-turnaround__left,
        .maint-turnaround__right {
          display: flex;
          flex-direction: column;
        }
        .maint-turnaround__title {
          font-family: 'Space Grotesk', sans-serif;
          font-size: 0.8rem;
          font-weight: 600;
          text-transform: uppercase;
          letter-spacing: 0.1em;
          color: #1a1a1a;
          margin: 0 0 0.75rem;
          flex-shrink: 0;
        }
        .maint-turnaround__list,
        .maint-turnaround__certs {
          display: flex;
          flex-direction: column;
          gap: 0.4rem;
          flex: 1;
          min-height: 0;
        }
        .maint-turnaround__item,
        .maint-turnaround__cert {
          display: flex;
          align-items: center;
          padding: 0.5rem 0.75rem;
          background: #fff;
          border-radius: 4px;
          box-shadow: 0 1px 4px rgba(0,0,0,0.04);
          flex: 1;
          min-height: 0;
        }
        .maint-turnaround__item {
          justify-content: space-between;
        }
        .maint-turnaround__cert {
          gap: 0.75rem;
        }
        .maint-turnaround__service {
          font-size: 0.8rem;
          font-weight: 500;
          color: #1a1a1a;
        }
        .maint-turnaround__time {
          font-size: 0.7rem;
          font-weight: 600;
          color: #888;
          font-family: 'Share Tech Mono', monospace;
        }
        .maint-turnaround__cert img {
          width: 160px;
          height: 90px;
          object-fit: contain;
        }
        .maint-turnaround__cert-text h4 {
          font-size: 0.8rem;
          font-weight: 600;
          margin: 0 0 0.1rem;
          color: #1a1a1a;
        }
        .maint-turnaround__cert-text p {
          font-size: 0.7rem;
          color: #666;
          margin: 0;
        }
        @media (max-width: 768px) {
          .maint-turnaround__container {
            grid-template-columns: 1fr;
            gap: 1.5rem;
          }
          .maint-turnaround__divider {
            display: none;
          }
          .maint-turnaround__item,
          .maint-turnaround__cert {
            flex: none;
          }
        }
        .fd-sales__intent-btn {
          display: flex; flex-direction: column; align-items: flex-start; gap: 0.4rem;
          background: #faf9f6; border: 1px solid #e0deda; padding: 1.25rem 1.5rem;
          cursor: pointer; text-align: left; transition: border-color 0.2s, background 0.2s; width: 100%;
          text-decoration: none; box-sizing: border-box;
        }
        .fd-sales__intent-btn:hover { border-color: #1a1a1a; background: #f3f1ed; }
        .fd-sales__intent-btn--full { max-width: 100%; }
        .fd-sales__intent-icon { font-size: 1.2rem; color: #1a1a1a; }
        .fd-sales__intent-title { font-family: 'Space Grotesk', sans-serif; font-size: 0.9rem; font-weight: 700; color: #1a1a1a; }
        .fd-sales__intent-sub { font-size: 0.78rem; color: #888; line-height: 1.5; }
        .fd-sales__rebuild-interest { margin-top: 0; }
        .fd-sales__rebuild-intents { background: #fff; border: 1px solid #e0deda; padding: 2rem; }
        .fd-sales__rebuild-intents-header { display: flex; align-items: center; justify-content: space-between; margin-bottom: 1.5rem; padding-bottom: 1rem; border-bottom: 1px solid #e8e6e2; }
        .fd-sales__rebuild-intents-grid { display: grid; grid-template-columns: 1fr; gap: 1rem; }
        .fd-sales__unmanned-form { background: #fff; border: 1px solid #e0deda; padding: 2rem; text-align: left; margin-top: 0; width: 100%; box-sizing: border-box; }
        .fd-sales__unmanned-form-header { display: flex; align-items: center; justify-content: space-between; margin-bottom: 1.75rem; padding-bottom: 1rem; border-bottom: 1px solid #e8e6e2; }
        .fd-sales__unmanned-form-badge { font-family: 'Share Tech Mono', monospace; font-size: 0.58rem; letter-spacing: 0.2em; text-transform: uppercase; background: #1a1a1a; color: #fff; padding: 0.3rem 0.7rem; }
        .fd-sales__unmanned-back { background: none; border: none; color: #bbb; font-family: 'Share Tech Mono', monospace; font-size: 0.62rem; letter-spacing: 0.1em; cursor: pointer; padding: 0; transition: color 0.2s; }
        .fd-sales__unmanned-back:hover { color: #1a1a1a; }
        .fd-sales__unmanned-form-row { display: grid; grid-template-columns: repeat(3, 1fr); gap: 1rem; margin-bottom: 1rem; align-items: end; }
        .fd-sales__unmanned-form-row--2col { grid-template-columns: repeat(2, 1fr); }
        .fd-sales__unmanned-field { display: flex; flex-direction: column; gap: 0.4rem; margin-bottom: 1rem; }
        .fd-sales__unmanned-form-row .fd-sales__unmanned-field { margin-bottom: 0; }
        .fd-sales__unmanned-label { font-family: 'Share Tech Mono', monospace; font-size: 0.58rem; letter-spacing: 0.2em; text-transform: uppercase; color: #999; white-space: nowrap; }
        .fd-sales__unmanned-optional { color: #ccc; font-size: 0.55rem; text-transform: none; letter-spacing: 0; font-family: 'Space Grotesk', sans-serif; }
        .fd-sales__unmanned-input { background: #faf9f6; border: 1px solid #e0ddd8; padding: 0.7rem 0.9rem; color: #1a1a1a; font-family: 'Space Grotesk', sans-serif; font-size: 0.88rem; transition: border-color 0.2s; width: 100%; box-sizing: border-box; }
        .fd-sales__unmanned-input::placeholder { color: #bbb; }
        .fd-sales__unmanned-input:focus { outline: none; border-color: #1a1a1a; }
        .fd-sales__unmanned-textarea { resize: vertical; min-height: 80px; }
        .fd-sales__unmanned-error { font-size: 0.78rem; color: #c00; margin-bottom: 0.75rem; }
        .fd-sales__unmanned-form-footer { display: flex; align-items: center; gap: 1.25rem; padding-top: 1.25rem; border-top: 1px solid #e8e6e2; margin-top: 0.5rem; }
        .fd-sales__unmanned-submit { padding: 0.8rem 2rem; background: #1a1a1a; border: none; color: #fff; font-family: 'Space Grotesk', sans-serif; font-size: 0.75rem; font-weight: 700; text-transform: uppercase; letter-spacing: 0.08em; cursor: pointer; transition: background 0.2s; }
        .fd-sales__unmanned-submit:hover:not(:disabled) { background: #333; }
        .fd-sales__unmanned-submit:disabled { opacity: 0.6; cursor: not-allowed; }
        .fd-sales__unmanned-form-note { font-family: 'Share Tech Mono', monospace; font-size: 0.6rem; letter-spacing: 0.05em; color: #bbb; }
        .fd-sales__unmanned-success { text-align: center; padding: 2rem; }
        .fd-sales__unmanned-success-icon { display: flex; align-items: center; justify-content: center; width: 48px; height: 48px; background: #1a1a1a; color: #fff; border-radius: 50%; font-size: 1.1rem; margin: 0 auto 1rem; }
        .fd-sales__unmanned-success-title { font-family: 'Space Grotesk', sans-serif; font-size: 1rem; font-weight: 700; text-transform: uppercase; letter-spacing: -0.01em; color: #1a1a1a; margin-bottom: 0.5rem; }
        .fd-sales__unmanned-success-sub { font-size: 0.82rem; color: #888; line-height: 1.6; margin: 0; }
        .rb__cta-phone { display: flex; flex-direction: column; align-items: center; gap: 0.15rem; text-decoration: none; color: #1a1a1a; margin-top: 0.75rem; width: 100%; }
        .rb__cta-phone span { font-size: 0.7rem; color: #999; }
        .rb__cta-phone strong { font-family: 'Share Tech Mono', monospace; font-size: 1.1rem; }
        @media (max-width: 640px) {
          .fd-sales__unmanned-form-row, .fd-sales__unmanned-form-row--2col { grid-template-columns: 1fr; }
        }
      `}</style>
    </section>
    <MaintenanceEnquiryForm />
    </>
  );
}

// ============================================
// SUPPORTED AIRCRAFT SECTION
// ============================================

function SupportedAircraft() {
  const pageImages = usePageImages('maintenance');
  const aircraft = [
    { model: 'Robinson R22', image: '/assets/images/new-aircraft/r22-beta.webp', notes: 'Beta II, all variants' },
    { model: 'Robinson R44', image: '/assets/images/new-aircraft/r44-raven.webp', notes: 'Raven, Cadet, Clipper' },
    { model: 'Robinson R66', image: '/assets/images/new-aircraft/r66-turbine.webp', notes: 'Turbine expertise' },
    { model: 'Guimbal Cabri G2', image: '/assets/images/new-aircraft/cabri-g2.webp', notes: 'Certified centre' },
  ];

  return (
    <section className="maint-supported" data-cms-section="maintenance-aircraft">
      <div className="maint-supported__inner">
        <div className="maint-container maint-container--narrow" style={{ textAlign: 'center' }}>
          <Reveal>
            <span className="maint-pre-text">Supported Aircraft</span>
            <h2 className="maint-headline">
              <span className="maint-text--dark">Robinson </span>
              <span className="maint-text--mid">& </span>
              <span className="maint-text--light">Guimbal</span>
            </h2>
            <p className="maint-body" style={{ margin: '0 auto' }}>
              We provide full maintenance support for the complete Robinson range
              and Guimbal Cabri G2.
            </p>
          </Reveal>
        </div>

        <div className="maint-supported__grid">
          {aircraft.map((a, i) => (
            <Reveal key={a.model} delay={i * 0.1}>
              <div className="maint-supported__card">
                <div className="maint-supported__image">
                  <img src={pageImages['maintenance-aircraft']?.[i]?.url || a.image} alt={a.model} />
                </div>
                <div className="maint-supported__model">{a.model}</div>
                <div className="maint-supported__notes">{a.notes}</div>
              </div>
            </Reveal>
          ))}
        </div>
      </div>

      <style>{`
        .maint-supported {
          background: #f0efec;
          padding: 4rem 0;
          position: relative;
        }
        .maint-supported::before {
          content: '';
          position: absolute;
          top: 0;
          left: 50%;
          transform: translateX(-50%);
          width: 80px;
          height: 1px;
          background: linear-gradient(90deg, transparent, #bbb, transparent);
        }
        .maint-supported__inner {
          max-width: 1200px;
          margin: 0 auto;
          padding: 0 2rem;
        }
        .maint-supported__grid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 1.5rem;
          margin-top: 3rem;
        }
        .maint-supported__card {
          background: #fff;
          border-radius: 8px;
          overflow: hidden;
          box-shadow: 0 2px 12px rgba(0,0,0,0.06);
          transition: transform 0.3s ease, box-shadow 0.3s ease;
        }
        .maint-supported__card:hover {
          transform: translateY(-4px);
          box-shadow: 0 8px 24px rgba(0,0,0,0.1);
        }
        .maint-supported__image {
          aspect-ratio: 16/10;
          overflow: hidden;
          background: #f5f5f5;
        }
        .maint-supported__image img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }
        .maint-supported__model {
          font-size: 1rem;
          font-weight: 600;
          color: #1a1a1a;
          padding: 1rem 1rem 0.25rem;
        }
        .maint-supported__notes {
          font-size: 0.8rem;
          color: #666;
          padding: 0 1rem 1rem;
        }
        @media (max-width: 900px) {
          .maint-supported__grid {
            grid-template-columns: repeat(2, 1fr);
            gap: 1rem;
          }
        }
      `}</style>
    </section>
  );
}

// ============================================
// MAIN COMPONENT
// ============================================

function FinalMaintenance() {
  const [activeInspection, setActiveInspection] = useState(0);
  const [openAccordion, setOpenAccordion] = useState(null);
  const [activeRefurb, setActiveRefurb] = useState('interior');

  const refurbOptions = [
    { id: 'interior', title: 'Interior Refurbishment', desc: 'Complete interior overhaul including seats, carpets, panels, and headliners. We source premium materials to match or exceed original specifications.', image: '/assets/images/facility/interior-refurb.jpg' },
    { id: 'paint', title: 'Exterior Paint', desc: 'Custom paint schemes, touch-ups, or full repaints. Our paint facility delivers showroom finishes with industry-leading durability.', image: '/assets/images/facility/paint-booth.jpg' },
    { id: 'avionics', title: 'Avionics Upgrades', desc: 'Modern glass cockpits, upgraded navigation systems, and the latest safety equipment. We handle everything from basic radio swaps to complete panel overhauls.', image: '/assets/images/facility/avionics-panel.jpg' },
    { id: 'corrosion', title: 'Corrosion Treatment', desc: 'Comprehensive corrosion prevention and repair services. We identify, treat, and protect against corrosion to extend your aircraft\'s service life.', image: '/assets/images/facility/corrosion-treatment.jpg' },
  ];

  const inspections = [
    {
      id: '01',
      title: '50-Hour Inspection',
      desc: 'A routine inspection ensuring all critical systems are functioning correctly. Ideal for aircraft in regular use.',
      duration: '1-2 days',
      checks: 'Engine, transmission, controls, fluid levels',
      docs: 'Full compliance report',
    },
    {
      id: '02',
      title: '100-Hour Inspection',
      desc: 'Comprehensive scheduled maintenance required for commercial operations and recommended for private use.',
      duration: '2-3 days',
      checks: 'All 50-hour items plus deeper inspection',
      docs: 'Maintenance release certificate',
    },
    {
      id: '03',
      title: 'Annual Inspection',
      desc: 'Complete airworthiness review required yearly regardless of flight hours.',
      duration: '3-5 days',
      checks: 'Full aircraft inspection, AD compliance',
      docs: 'Annual airworthiness certificate',
    },
  ];

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  useEffect(() => {
    const handleInspectScroll = () => {
      const inspectSection = document.querySelector('.maint-inspect');
      if (!inspectSection) return;

      const rect = inspectSection.getBoundingClientRect();
      const sectionHeight = inspectSection.offsetHeight;
      const scrollInSection = -rect.top;
      const itemHeight = sectionHeight / 3;

      if (scrollInSection >= 0 && scrollInSection < sectionHeight) {
        const index = Math.min(2, Math.floor(scrollInSection / itemHeight));
        setActiveInspection(index);
      }
    };

    window.addEventListener('scroll', handleInspectScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleInspectScroll);
  }, []);

  return (
    <div className="maint">
      <style>{styles}</style>
      <MaintenanceHeader />

      {/* 01 */ } <HeroSection />
      {/* 02 */ } <StatsStrip />
      {/* 04 */ } <PhilosophySection />

      {/* ========== SECTION 6-7: CORE SERVICES ========== */}
      <section className="maint-core-services">
        <div className="maint-core-services__header">
          <Reveal>
            <span className="maint-pre-text">Our Services</span>
            <h2 className="maint-core-services__headline">
              <span className="maint-text--dark">9 </span>
              <span className="maint-text--mid">Core </span>
              <span className="maint-text--light">Services</span>
            </h2>
            <p className="maint-body" style={{ margin: '0 auto' }}>
              Premium maintenance standards for Robinson and Guimbal helicopters,
              delivered by a team that lives and breathes rotary-wing aviation using the latest tooling and genuine parts.
            </p>
          </Reveal>
        </div>

        <div className="maint-core-services__grid">
          {[
            { num: '01', title: '50-Hour Inspections', desc: 'Routine checks to maintain airworthiness' },
            { num: '02', title: '100-Hour Inspections', desc: 'Comprehensive scheduled maintenance' },
            { num: '03', title: 'Annual Inspections', desc: 'Full yearly airworthiness review' },
            { num: '04', title: '2200-Hour Overhauls', desc: 'Complete engine and component overhaul' },
            { num: '05', title: 'Component Repairs', desc: 'Expert repair of all aircraft systems' },
            { num: '06', title: 'Avionics Services', desc: 'Navigation, communication, and displays' },
            { num: '07', title: 'Pre-Purchase Inspections', desc: 'Thorough evaluation before purchase' },
            { num: '08', title: 'AOG Support', desc: 'Emergency Aircraft on Ground assistance' },
            { num: '09', title: 'Refurbishment', desc: 'Interior and exterior restoration' },
          ].map((service, i) => (
            <Reveal key={service.num} delay={i * 0.05}>
              <div className="maint-core-services__card">
                <span className="maint-core-services__num">{service.num}</span>
                <div className="maint-core-services__text">
                  <h4>{service.title}</h4>
                  <p>{service.desc}</p>
                </div>
              </div>
            </Reveal>
          ))}
        </div>

      </section>

      {/* ========== SECTION 22: REBUILDS ========== */}
      <RebuildsSection />

      {/* ========== SECTION 7: TURNAROUND & CERTIFICATIONS ========== */}
      <TurnaroundTimes />

      {/* ========== SECTION 25: FACILITY GALLERY ========== */}
      <FacilityGallery />

      {/* ========== SECTION 29: WE BUY ANY ROBINSON (compact test) ========== */}
      <WeBuySectionCompact />

      {/* ========== SECTION 30: FOOTER ========== */}
      <FooterMinimal />
    </div>
  );
}

export default FinalMaintenance;

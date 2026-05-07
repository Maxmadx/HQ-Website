/**
 * PILOT PROVISIONING PAGE
 *
 * Crewing, safety pilots, and ferry flights for the Robinson range and beyond.
 * Fully rated, insured, and experienced — the right pilot for every mission.
 *
 * Brand: Luxury Minimal Aviation
 * Typography: Space Grotesk + Share Tech Mono
 * CSS prefix: pp-
 * Route: /pilot-provisioning
 */

import React, { useRef, useEffect, useState } from 'react';
import { usePageImages } from '../hooks/usePageImages';
import { useCmsHighlight } from '../hooks/useCmsHighlight';
import { Link } from 'react-router-dom';
import { motion, useInView, useScroll, useTransform, AnimatePresence } from 'framer-motion';
import '../assets/css/main.css';
import '../assets/css/components.css';
import FooterMinimal from '../components/FooterMinimal';
import HqMenuPanel from '../components/HqMenuPanel';

// ─── Header ──────────────────────────────────────────────────────────────────

function PilotProvisioningHeader() {
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
      <HqMenuPanel open={menuOpen} onClose={closeMenu} />

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
          '--spotlight-height': `${spotlightHeight}px`,
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

// ─── Reveal ──────────────────────────────────────────────────────────────────

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

// ─── Main Component ───────────────────────────────────────────────────────────

function PilotProvisioning() {
  const heroRef = useRef(null);
  const pageImages = usePageImages('pilot-provisioning');
  useCmsHighlight();
  const { scrollYProgress } = useScroll({ target: heroRef, offset: ['start start', 'end start'] });
  useEffect(() => { window.scrollTo(0, 0); }, []);
  const heroOpacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);
  const heroScale = useTransform(scrollYProgress, [0, 0.5], [1, 0.95]);
  const heroY = useTransform(scrollYProgress, [0, 0.5], [0, 100]);

  const [formData, setFormData] = useState({ name: '', email: '', phone: '', aircraftType: '', mission: '', message: '' });
  const [formStatus, setFormStatus] = useState('idle');
  const [formOpen, setFormOpen] = useState(false);
  const setField = (field) => (e) => setFormData((f) => ({ ...f, [field]: e.target.value }));

  async function handleFormSubmit(e) {
    e.preventDefault();
    if (!formData.name.trim() || !formData.email.trim()) { setFormStatus('error'); return; }
    setFormStatus('submitting');
    try {
      const res = await fetch('/api/leads', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...formData, subject: 'Pilot Provisioning Enquiry', source: 'pilot-provisioning-page' }),
      });
      if (!res.ok) throw new Error();
      setFormStatus('success');
      setFormData({ name: '', email: '', phone: '', aircraftType: '', mission: '', message: '' });
    } catch {
      setFormStatus('error');
    }
  }

  // ─── Data ──────────────────────────────────────────────────────────────────

  const servicePanels = [
    {
      num: '01', title: 'Safety Pilots',
      description: 'A safety pilot flies alongside you to provide an additional layer of oversight, particularly useful when operating in unfamiliar airspace, carrying passengers on long legs, or flying in marginal conditions where a second set of eyes and hands provides genuine reassurance. All HQ safety pilots are experienced instructors.',
      details: ['Current FI(H) rating', 'Minimum 500 hours total time', 'Type-rated on your aircraft', 'Fully insured for the operation'],
      image: pageImages['pp-panel-1']?.[0]?.url || '/assets/images/gallery/carousel/rotating1.jpg',
    },
    {
      num: '02', title: 'Ferry Flights',
      description: 'Need an aircraft moved? Whether from a maintenance facility back to base, delivery from a purchase, or repositioning for an operation, HQ\'s ferry pilots move your aircraft wherever it needs to go. We handle fuel planning, weather routing, PPR, and all logistics.',
      details: ['Pre-flight inspection included', 'Weather routing and fuel planning', 'Insurance documentation prepared', 'Full handover record on arrival'],
      image: pageImages['pp-panel-2']?.[0]?.url || '/assets/images/gallery/flying/flying-.jpg',
    },
    {
      num: '03', title: 'Dedicated Crewing',
      description: 'For ongoing operations such as seasonal superyacht programmes, corporate fleet management, or extended filming contracts, HQ provides a dedicated crew member on a contract basis with rostering, currency maintenance, and compliance all managed.',
      details: ['Rostered availability agreed in advance', 'Currency and recurrency training maintained', 'Compliance documentation managed', 'Regular operational briefings included'],
      image: pageImages['pp-panel-3']?.[0]?.url || '/assets/images/gallery/carousel/rotating2.jpg',
    },
  ];

  const aircraft = ['Robinson R22', 'Robinson R44', 'Robinson R66', 'Hughes 500', 'AS350 Squirrel', 'EC130', 'Bell 407'];

  // ─── JSX ──────────────────────────────────────────────────────────────────

  return (
    <div className="pp">
      <PilotProvisioningHeader />

      {/* ========== HERO ========== */}
      <section
        ref={heroRef}
        className="pp-hero"
        data-cms-section="pp-hero"
        style={{ backgroundImage: `url('${pageImages['pp-hero']?.[0]?.url || '/assets/images/gallery/flying/flying--1.jpg'}')` }}
      >
        <div className="pp-hero__overlay" />
        <motion.div
          className="pp-hero__content"
          style={{ opacity: heroOpacity, scale: heroScale, y: heroY }}
        >
          <div className="pp-hero__inner">
            <motion.span
              className="pp-hero__label"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            >
              Crewing Services
            </motion.span>

            <div className="pp-hero__headline">
              <motion.span
                className="pp-hero__word pp-hero__word--1"
                initial={{ opacity: 0, y: 40 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.4, ease: [0.16, 1, 0.3, 1] }}
              >
                PILOT
              </motion.span>
              <motion.span
                className="pp-hero__word pp-hero__word--2"
                initial={{ opacity: 0, y: 40 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.6, ease: [0.16, 1, 0.3, 1] }}
              >
                PROVISIONING
              </motion.span>
            </div>

            <motion.div
              className="pp-hero__divider-line"
              initial={{ scaleX: 0 }}
              animate={{ scaleX: 1 }}
              transition={{ duration: 0.8, delay: 0.8, ease: [0.16, 1, 0.3, 1] }}
            />

            <motion.p
              className="pp-hero__sub"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.2, duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            >
              Crewing, safety pilots, and ferry flights. Fully rated and experienced across
              the Robinson range and beyond. The right pilot for every mission.
            </motion.p>
          </div>
        </motion.div>
      </section>

      {/* ========== INTRO ========== */}
      <section className="pp-intro" data-cms-section="pp-intro">
        <div className="pp-intro__container">
          <div className="pp-intro__grid">
            <div className="pp-intro__text">
              <Reveal>
                <span className="pp-pre-text">The Right Pilot</span>
                <h2 className="pp-intro__heading">For Every Mission</h2>
                <p className="pp-intro__body">
                  Whether you need a safety pilot for an unfamiliar route, a ferry pilot to move an
                  aircraft across the country, or a dedicated crew member for a longer operation. HQ
                  can provide a fully qualified, current pilot from our experienced team. Every pilot
                  we provision holds the appropriate type ratings, is fully insured, and is briefed on
                  your specific operation before they fly.
                </p>
              </Reveal>
            </div>
          </div>
        </div>
      </section>

      {/* ========== SERVICE PANELS ========== */}
      <section className="pp-services" data-cms-section="pp-services">
        <div className="pp-services__container">
          <div className="pp-panels">
            {servicePanels.map((panel, i) => (
              <Reveal key={panel.num} delay={0.05}>
                <div className={`pp-panel ${i % 2 === 1 ? 'pp-panel--flipped' : ''}`}>
                  <div className="pp-panel__image">
                    <img src={panel.image} alt={panel.title} />
                  </div>
                  <div className="pp-panel__content">
                    <div className="pp-panel__num">{panel.num}</div>
                    <h3 className="pp-panel__title">{panel.title}</h3>
                    <p className="pp-panel__desc">{panel.description}</p>
                    <ul className="pp-panel__details">
                      {panel.details.map((detail) => (
                        <li key={detail}>{detail}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ========== AIRCRAFT COVERED ========== */}
      <section className="pp-aircraft">
        <div className="pp-aircraft__container">
          <Reveal>
            <div className="pp-section-header">
              <span className="pp-pre-text">Type Ratings Held</span>
              <h2>Aircraft We Fly</h2>
              <p className="pp-aircraft__desc">
                Our pilot team holds current type ratings across the Robinson range and a growing
                number of turbine types.
              </p>
            </div>
          </Reveal>
          <Reveal delay={0.15}>
            <div className="pp-aircraft__chips">
              {aircraft.map((ac) => (
                <span key={ac} className="pp-aircraft__chip">{ac}</span>
              ))}
            </div>
          </Reveal>
        </div>
      </section>

      {/* ========== ENQUIRY FORM ========== */}
      <section className="pp-enquiry" id="enquire">
        <div className="pp-enquiry__inner">
          <Reveal>
            <div className="pp-enquiry__head">
              <span className="pp-pre-text">Need a Pilot?</span>
              <h2 className="pp-enquiry__heading">Get in Touch</h2>
              <p className="pp-enquiry__desc">
                Tell us your mission, aircraft, and dates and we'll come back with availability and
                costs. Most enquiries get a response within a few hours.
              </p>
            </div>
          </Reveal>

          <Reveal delay={0.15}>
            <div className="pp-enquiry__body">
              {formStatus === 'success' ? (
                <div className="pp-enquiry__success">
                  <div className="pp-enquiry__success-icon">
                    <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
                      <circle cx="14" cy="14" r="13" stroke="#1a1a1a" strokeWidth="1.5" />
                      <path d="M8.5 14L12.5 18L19.5 10" stroke="#1a1a1a" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </div>
                  <p className="pp-enquiry__success-text">We'll be in touch within 24 hours.</p>
                </div>
              ) : (
                <>
                  {!formOpen && (
                    <button
                      type="button"
                      className="pp-intent-btn"
                      onClick={() => setFormOpen(true)}
                      aria-expanded={formOpen}
                      aria-controls="pp-enquiry-form"
                    >
                      <span className="pp-intent-btn__icon">→</span>
                      <span className="pp-intent-btn__title">Check Availability</span>
                      <span className="pp-intent-btn__sub">Share your mission, aircraft, and dates. We'll come back with availability and a quote, usually within a few hours.</span>
                    </button>
                  )}
                  <AnimatePresence initial={false}>
                    {formOpen && (
                      <motion.div
                        key="pp-enquiry-form-wrap"
                        id="pp-enquiry-form"
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                        style={{ overflow: 'hidden' }}
                      >
                        <form className="pp-enquiry__form" onSubmit={handleFormSubmit} noValidate>
                  <div className="pp-enquiry__row">
                    <div className="pp-field">
                      <label htmlFor="pp-name">Name <span className="pp-field-req">*</span></label>
                      <input
                        id="pp-name"
                        type="text"
                        placeholder="Your full name"
                        value={formData.name}
                        onChange={setField('name')}
                        required
                      />
                    </div>
                    <div className="pp-field">
                      <label htmlFor="pp-email">Email <span className="pp-field-req">*</span></label>
                      <input
                        id="pp-email"
                        type="email"
                        placeholder="your@email.com"
                        value={formData.email}
                        onChange={setField('email')}
                        required
                      />
                    </div>
                  </div>

                  <div className="pp-enquiry__row">
                    <div className="pp-field">
                      <label htmlFor="pp-phone">Phone</label>
                      <input
                        id="pp-phone"
                        type="tel"
                        placeholder="+44 7700 000000"
                        value={formData.phone}
                        onChange={setField('phone')}
                      />
                    </div>
                    <div className="pp-field">
                      <label htmlFor="pp-aircraft">Aircraft Type</label>
                      <input
                        id="pp-aircraft"
                        type="text"
                        placeholder="e.g. Robinson R66, AS350"
                        value={formData.aircraftType}
                        onChange={setField('aircraftType')}
                      />
                    </div>
                  </div>

                  <div className="pp-field">
                    <label htmlFor="pp-mission">Mission</label>
                    <input
                      id="pp-mission"
                      type="text"
                      placeholder="Safety pilot, ferry flight, dedicated crew..."
                      value={formData.mission}
                      onChange={setField('mission')}
                    />
                  </div>

                  <div className="pp-field">
                    <label htmlFor="pp-message">Message</label>
                    <textarea
                      id="pp-message"
                      rows={5}
                      placeholder="Route, dates, and anything else we should know..."
                      value={formData.message}
                      onChange={setField('message')}
                    />
                  </div>

                  {formStatus === 'error' && (
                    <p className="pp-enquiry__error">Please fill in your name and email to continue.</p>
                  )}

                  <button
                    type="submit"
                    className="pp-btn pp-btn--primary"
                    disabled={formStatus === 'submitting'}
                  >
                    {formStatus === 'submitting' ? 'Sending...' : 'Send Enquiry'}
                  </button>
                </form>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </>
              )}
            </div>
          </Reveal>
        </div>
      </section>

      {/* ========== FOOTER ========== */}
      <FooterMinimal />

      {/* ========== STYLES ========== */}
      <style>{`

        /* ===================================================
           BASE
           =================================================== */

        .pp {
          font-family: 'Space Grotesk', -apple-system, sans-serif;
          background: #faf9f6;
          color: #1a1a1a;
          overflow-x: hidden;
        }

        /* Pre-text label */
        .pp-pre-text {
          display: block;
          font-size: 0.7rem;
          text-transform: uppercase;
          letter-spacing: 0.25em;
          color: #999;
          margin-bottom: 1rem;
        }

        .pp-pre-text--light {
          color: rgba(255, 255, 255, 0.5);
        }

        /* Section header — centred, used across multiple sections */
        .pp-section-header {
          text-align: center;
          max-width: 700px;
          margin: 0 auto 3.5rem;
        }

        .pp-section-header h2 {
          font-size: clamp(2rem, 4vw, 3rem);
          font-weight: 700;
          text-transform: uppercase;
          margin: 0.5rem 0 1rem;
          line-height: 1.1;
          color: #1a1a1a;
        }

        .pp-section-header--light h2 {
          color: #ffffff;
        }

        /* Shared button */
        .pp-btn {
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

        .pp-btn--primary {
          background: #1a1a1a;
          color: #fff;
        }

        .pp-btn--primary:hover {
          background: #333;
          color: #fff;
        }

        .pp-btn--white {
          background: #fff;
          color: #1a1a1a;
        }

        .pp-btn--white:hover {
          background: #f0f0f0;
          color: #1a1a1a;
        }


        /* ===================================================
           HERO
           =================================================== */

        .pp-hero {
          min-height: 100vh;
          position: relative;
          display: flex;
          flex-direction: column;
          overflow: hidden;
          background-size: cover;
          background-position: center;
          background-repeat: no-repeat;
        }

        .pp-hero__overlay {
          position: absolute;
          inset: 0;
          background: linear-gradient(
            135deg,
            rgba(0, 0, 0, 0.72) 0%,
            rgba(0, 0, 0, 0.45) 55%,
            rgba(0, 0, 0, 0.3) 100%
          );
          z-index: 1;
        }

        .pp-hero__content {
          position: relative;
          z-index: 3;
          flex: 1;
          display: flex;
          align-items: center;
          padding: 2rem 4rem;
        }

        .pp-hero__inner {
          max-width: 600px;
        }

        .pp-hero__label {
          font-size: 0.7rem;
          font-weight: 400;
          letter-spacing: 0.2em;
          text-transform: uppercase;
          color: rgba(255, 255, 255, 0.55);
          display: block;
          margin-bottom: 1.5rem;
        }

        .pp-hero__headline {
          display: flex;
          flex-direction: column;
          line-height: 1;
          margin-bottom: 1.5rem;
        }

        .pp-hero__word {
          font-family: 'Space Grotesk', sans-serif;
          font-weight: 700;
          font-size: clamp(3rem, 8vw, 5.5rem);
          letter-spacing: -0.02em;
          text-transform: uppercase;
        }

        .pp-hero__word--1 {
          background: linear-gradient(180deg, #fff 0%, rgba(255, 255, 255, 0.85) 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }

        .pp-hero__word--2 {
          background: linear-gradient(180deg, rgba(255, 255, 255, 0.75) 0%, rgba(255, 255, 255, 0.45) 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }

        .pp-hero__divider-line {
          width: 80px;
          height: 2px;
          background: rgba(255, 255, 255, 0.35);
          margin-bottom: 1.5rem;
          transform-origin: left;
        }

        .pp-hero__sub {
          font-size: 1.05rem;
          color: rgba(255, 255, 255, 0.62);
          line-height: 1.8;
          max-width: 440px;
          margin: 0;
        }


        /* ===================================================
           INTRO
           =================================================== */

        .pp-intro {
          background: #faf9f6;
          padding: 6rem 4rem;
        }

        .pp-intro__container {
          max-width: 1200px;
          margin: 0 auto;
        }

        .pp-intro__grid {
          display: grid;
          grid-template-columns: 1fr;
          gap: 5rem;
          align-items: center;
          max-width: 800px;
          margin: 0 auto;
          text-align: center;
        }

        .pp-intro__heading {
          font-size: clamp(1.75rem, 3.5vw, 2.6rem);
          font-weight: 700;
          text-transform: uppercase;
          color: #1a1a1a;
          margin: 0 0 1.5rem;
          line-height: 1.1;
        }

        .pp-intro__body {
          color: #555;
          font-size: 1.05rem;
          line-height: 1.75;
          margin: 0;
        }

        /* ===================================================
           SERVICE PANELS
           =================================================== */

        .pp-services {
          background: #faf9f6;
          padding: 2rem 4rem;
        }

        .pp-services__container {
          max-width: 1200px;
          margin: 0 auto;
        }

        .pp-panels {
          display: flex;
          flex-direction: column;
          gap: 2.5rem;
        }

        /* Panel base — image LEFT, content RIGHT */
        .pp-panel {
          display: grid;
          grid-template-columns: 50% 50%;
          min-height: 420px;
        }

        /* Flipped panel — content LEFT, image RIGHT */
        .pp-panel--flipped {
          grid-template-columns: 50% 50%;
        }

        .pp-panel--flipped .pp-panel__image {
          order: 2;
        }

        .pp-panel--flipped .pp-panel__content {
          order: 1;
        }

        .pp-panel__image {
          overflow: hidden;
        }

        .pp-panel__image img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          display: block;
          transition: transform 0.5s ease;
        }

        .pp-panel:hover .pp-panel__image img {
          transform: scale(1.03);
        }

        .pp-panel__content {
          background: #fff;
          padding: 3rem;
          display: flex;
          flex-direction: column;
          justify-content: center;
        }

        .pp-panel__num {
          font-family: 'Share Tech Mono', monospace;
          font-size: 0.6rem;
          color: #ccc;
          letter-spacing: 0.1em;
          margin-bottom: 0.5rem;
        }

        .pp-panel__title {
          font-size: 1.4rem;
          font-weight: 700;
          color: #1a1a1a;
          margin: 0 0 1rem;
          text-transform: uppercase;
        }

        .pp-panel__desc {
          color: #555;
          line-height: 1.7;
          font-size: 0.95rem;
          margin-bottom: 1.5rem;
        }

        .pp-panel__details {
          list-style: none;
          padding: 0;
          margin: 0 0 1.75rem;
          display: flex;
          flex-direction: column;
          gap: 0.4rem;
        }

        .pp-panel__details li {
          font-size: 0.875rem;
          color: #444;
          display: flex;
          align-items: flex-start;
          gap: 0.5rem;
        }

        .pp-panel__details li::before {
          content: '✓';
          font-weight: 700;
          color: #1a1a1a;
          flex-shrink: 0;
        }

        .pp-panel__cta {
          display: inline-block;
          align-self: flex-start;
          padding: 0.7rem 1.4rem;
          background: #1a1a1a;
          color: #fff;
          font-size: 0.7rem;
          font-weight: 600;
          text-transform: uppercase;
          letter-spacing: 0.12em;
          text-decoration: none;
          transition: background 0.25s ease;
        }

        .pp-panel__cta:hover {
          background: #333;
          color: #fff;
        }


        /* ===================================================
           AIRCRAFT COVERED
           =================================================== */

        .pp-aircraft {
          background: #faf9f6;
          padding: 4rem 4rem;
        }

        .pp-aircraft__container {
          max-width: 900px;
          margin: 0 auto;
        }

        .pp-aircraft__desc {
          color: #666;
          font-size: 1rem;
          line-height: 1.7;
          max-width: 500px;
          margin: 0 auto;
        }

        .pp-aircraft__chips {
          display: flex;
          flex-wrap: wrap;
          gap: 0.75rem;
          justify-content: center;
          margin-top: 2rem;
        }

        .pp-aircraft__chip {
          border: 1.5px solid #1a1a1a;
          border-radius: 100px;
          padding: 0.5rem 1.25rem;
          font-size: 0.8rem;
          font-weight: 600;
          color: #1a1a1a;
          letter-spacing: 0.03em;
          transition: background 0.2s ease, color 0.2s ease;
          cursor: default;
        }

        .pp-aircraft__chip:hover {
          background: #1a1a1a;
          color: #fff;
        }


        /* ===================================================
           ENQUIRY FORM
           =================================================== */

        .pp-enquiry {
          background: #ffffff;
          padding: 6rem 4rem;
        }

        .pp-enquiry__inner {
          max-width: 760px;
          margin: 0 auto;
          display: flex;
          flex-direction: column;
          gap: 2rem;
        }

        .pp-enquiry__head {
          text-align: center;
        }

        .pp-enquiry__heading {
          font-size: clamp(1.6rem, 3vw, 2.25rem);
          font-weight: 700;
          text-transform: uppercase;
          color: #1a1a1a;
          margin: 0.5rem 0 1.25rem;
          line-height: 1.2;
        }

        .pp-enquiry__desc {
          font-size: 1rem;
          line-height: 1.75;
          color: #666;
          margin: 0;
        }

        .pp-intent-btn {
          display: grid;
          grid-template-columns: auto 1fr;
          grid-template-rows: auto auto;
          column-gap: 0.6rem;
          row-gap: 0.3rem;
          align-items: center;
          padding: 1.1rem 1.4rem;
          background: #fff;
          border: 1px solid #e8e6e2;
          cursor: pointer;
          transition: all 0.22s ease;
          text-align: left;
          color: #1a1a1a;
          font-family: inherit;
          width: 100%;
        }

        .pp-intent-btn:hover {
          border-color: #1a1a1a;
          background: #faf9f6;
        }

        .pp-intent-btn__icon {
          grid-column: 1;
          grid-row: 1 / span 2;
          font-family: 'Share Tech Mono', monospace;
          font-size: 1rem;
          color: #999;
          line-height: 1;
          align-self: center;
        }

        .pp-intent-btn__title {
          grid-column: 2;
          grid-row: 1;
          font-size: 0.78rem;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 0.06em;
          color: #1a1a1a;
        }

        .pp-intent-btn__sub {
          grid-column: 2;
          grid-row: 2;
          font-size: 0.78rem;
          color: #999;
          line-height: 1.55;
        }

        .pp-field {
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
          margin-bottom: 1.25rem;
        }

        .pp-field label {
          font-size: 0.8rem;
          font-weight: 600;
          color: #333;
          text-transform: uppercase;
          letter-spacing: 0.05em;
        }

        .pp-field-req {
          color: #999;
          font-weight: 400;
        }

        .pp-field input,
        .pp-field textarea {
          padding: 0.85rem 1rem;
          border: 1.5px solid #e0e0e0;
          border-radius: 6px;
          font-family: 'Space Grotesk', sans-serif;
          font-size: 0.9rem;
          color: #1a1a1a;
          background: #fafaf8;
          transition: border-color 0.2s;
          outline: none;
          resize: vertical;
        }

        .pp-field input:focus,
        .pp-field textarea:focus {
          border-color: #1a1a1a;
        }

        .pp-enquiry__row {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 1rem;
        }

        .pp-enquiry__error {
          font-size: 0.85rem;
          color: #c0392b;
          margin: 0 0 1rem;
        }

        .pp-enquiry__success {
          display: flex;
          align-items: center;
          gap: 1rem;
          padding: 2rem;
          border: 1.5px solid #e8e6e2;
          border-radius: 8px;
          background: #faf9f6;
        }

        .pp-enquiry__success-icon {
          flex-shrink: 0;
          opacity: 0.6;
        }

        .pp-enquiry__success-text {
          font-size: 1rem;
          color: #1a1a1a;
          margin: 0;
          line-height: 1.5;
        }



        /* ===================================================
           RESPONSIVE — 1024px (tablet landscape)
           =================================================== */

        @media (max-width: 1024px) {
          .pp-intro__grid {
            gap: 3rem;
          }

          .pp-services {
            padding: 2rem 2.5rem;
          }

          .pp-enquiry {
            padding: 5rem 3rem;
          }
        }


        /* ===================================================
           RESPONSIVE — 768px (tablet / large mobile)
           =================================================== */

        @media (max-width: 768px) {
          /* Hero */
          .pp-hero__content {
            padding: 7rem 1.5rem 3rem;
            align-items: flex-start;
          }

          .pp-hero__inner {
            max-width: 100%;
          }

          .pp-hero__sub {
            max-width: 100%;
          }

          /* Intro */
          .pp-intro {
            padding: 4rem 1.5rem;
          }

          .pp-intro__grid {
            grid-template-columns: 1fr;
            gap: 2rem;
          }

          /* Services */
          .pp-services {
            padding: 2rem 1.5rem;
          }

          .pp-section-header {
            margin-bottom: 2.5rem;
          }

          /* Panels — stack to single column */
          .pp-panel {
            grid-template-columns: 1fr !important;
            min-height: auto;
          }

          .pp-panel--flipped .pp-panel__image {
            order: 0;
          }

          .pp-panel--flipped .pp-panel__content {
            order: 1;
          }

          .pp-panel__image {
            aspect-ratio: 16 / 9;
            height: auto;
          }

          .pp-panel__image img {
            height: 100%;
            width: 100%;
          }

          .pp-panel__content {
            padding: 2rem 1.5rem;
          }

          /* Aircraft */
          .pp-aircraft {
            padding: 4rem 1.5rem;
          }

          .pp-aircraft__chips {
            gap: 0.5rem;
          }

          /* Enquiry */
          .pp-enquiry {
            padding: 4rem 1.5rem;
          }

          .pp-enquiry__row {
            grid-template-columns: 1fr;
          }
        }


        /* ===================================================
           RESPONSIVE — 480px (mobile)
           =================================================== */

        @media (max-width: 480px) {
          .pp-hero__word {
            font-size: clamp(2.5rem, 13vw, 3.5rem);
          }

          .pp-panel__title {
            font-size: 1.2rem;
          }

          .pp-aircraft__chip {
            font-size: 0.75rem;
            padding: 0.4rem 1rem;
          }
        }

      `}</style>
    </div>
  );
}

export default PilotProvisioning;

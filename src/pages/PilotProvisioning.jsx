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
import { useFaqs } from '../hooks/useFaqs';
import { usePageImages } from '../hooks/usePageImages';
import { useCmsHighlight } from '../hooks/useCmsHighlight';
import { Link } from 'react-router-dom';
import { motion, useInView, useScroll, useTransform, AnimatePresence } from 'framer-motion';
import '../assets/css/main.css';
import '../assets/css/components.css';
import FooterMinimal from '../components/FooterMinimal';
import HqMenuPanel from '../components/HqMenuPanel';
import Seo from '../components/seo/Seo';
import { buildService, buildBreadcrumbList } from '../components/seo/jsonLd';
import { SITE_URL, AREA_SERVED } from '../lib/seoDefaults';

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
  const [openFaq, setOpenFaq] = useState(null);
  const [showAllFaqs, setShowAllFaqs] = useState(false);
  const pageImages = usePageImages('pilot-provisioning');
  useCmsHighlight();
  const { scrollYProgress } = useScroll({ target: heroRef, offset: ['start start', 'end start'] });
  useEffect(() => { window.scrollTo(0, 0); }, []);
  const heroOpacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);
  const heroScale = useTransform(scrollYProgress, [0, 0.5], [1, 0.95]);
  const heroY = useTransform(scrollYProgress, [0, 0.5], [0, 100]);
  const { faqs: rawFaqs } = useFaqs('pilot-provisioning', { visibleOnly: true });
  const fallbackFaqs = [
    { id: 'f1', question: 'How quickly can you provide a pilot?', answer: 'For planned operations, we ask for at least 48 hours notice to arrange briefing and documentation. For urgent requirements, contact us directly and we\'ll do our best to accommodate you.' },
    { id: 'f2', question: 'Is the pilot insured by HQ or do I need my own cover?', answer: 'HQ arranges appropriate insurance for provisioning engagements. Details are confirmed at the time of booking and we want to be completely clear on cover before any pilot departs.' },
    { id: 'f3', question: 'Can you provide pilots for aircraft not in the Robinson range?', answer: 'Our core team is Robinson-specialised, but we have relationships with pilots rated on turbine types including the AS350, Hughes 500, and Bell 407. Contact us with your specific requirement.' },
    { id: 'f4', question: 'What if the mission changes on the day?', answer: 'Our pilots are briefed to make go/no-go decisions independently based on conditions. Any significant change to the planned mission is discussed with you before departure.' },
    { id: 'f5', question: 'Do you provide pilots for overseas operations?', answer: 'Yes, we support European and further afield operations. Additional lead time and documentation requirements apply. See our SuperYacht Operations service for yacht-based seasonal programmes.' },
  ];
  const faqs = rawFaqs.length > 0 ? rawFaqs : fallbackFaqs;

  // ─── Data ──────────────────────────────────────────────────────────────────

  const servicePanels = [
    {
      tag: 'Most Requested', num: '01', title: 'Safety Pilots',
      description: 'A safety pilot flies alongside you to provide an additional layer of oversight, particularly useful when operating in unfamiliar airspace, carrying passengers on long legs, or flying in marginal conditions where a second set of eyes and hands provides genuine reassurance. All HQ safety pilots are experienced instructors.',
      details: ['Current FI(H) rating', 'Minimum 500 hours total time', 'Type-rated on your aircraft', 'Fully insured for the operation'],
      image: pageImages['pp-panel-1']?.[0]?.url || '/assets/images/gallery/carousel/rotating1.jpg',
    },
    {
      tag: 'Logistics', num: '02', title: 'Ferry Flights',
      description: 'Need an aircraft moved? Whether from a maintenance facility back to base, delivery from a purchase, or repositioning for an operation, HQ\'s ferry pilots move your aircraft wherever it needs to go. We handle fuel planning, weather routing, PPR, and all logistics.',
      details: ['Pre-flight inspection included', 'Weather routing and fuel planning', 'Insurance documentation prepared', 'Full handover record on arrival'],
      image: pageImages['pp-panel-2']?.[0]?.url || '/assets/images/gallery/flying/flying-.jpg',
    },
    {
      tag: 'Extended Operations', num: '03', title: 'Dedicated Crewing',
      description: 'For ongoing operations such as seasonal superyacht programmes, corporate fleet management, or extended filming contracts, HQ provides a dedicated crew member on a contract basis with rostering, currency maintenance, and compliance all managed.',
      details: ['Rostered availability agreed in advance', 'Currency and recurrency training maintained', 'Compliance documentation managed', 'Regular operational briefings included'],
      image: pageImages['pp-panel-3']?.[0]?.url || '/assets/images/gallery/carousel/rotating2.jpg',
    },
  ];

  const pilotStandards = [
    { num: '01', title: 'Current Type Rating', desc: 'Appropriate type rating on the aircraft to be flown, always' },
    { num: '02', title: '500+ Hours Minimum', desc: 'No newly-qualified pilots. Everyone has proven operational experience.' },
    { num: '03', title: 'Full Insurance Cover', desc: 'HQ arranges appropriate insurance for every provisioning engagement' },
    { num: '04', title: 'Pre-Brief Required', desc: 'Every pilot is briefed on your specific operation and aircraft history before departure' },
  ];

  const processSteps = [
    { num: '01', title: 'Brief', duration: '30 mins', description: 'Tell us the mission: aircraft type, route, date, purpose, and any specific requirements or concerns. The more we know, the better we can match the right pilot.' },
    { num: '02', title: 'Match', duration: '24 hours', description: 'We identify the most suitable pilot from our team based on type rating, experience, and availability. We won\'t dispatch someone who isn\'t the right fit.' },
    { num: '03', title: 'Pre-Brief', duration: '1 hour', description: 'Your pilot contacts you directly to discuss the operation. No surprises on the day. Everything is agreed in advance.' },
    { num: '04', title: 'Debrief', duration: 'Post-mission', description: 'After the mission, a brief report is provided. For extended contracts, regular operational reviews are included as standard.' },
  ];

  const aircraft = ['Robinson R22', 'Robinson R44', 'Robinson R66', 'Hughes 500', 'AS350 Squirrel', 'Bell 407'];

  // ─── JSX ──────────────────────────────────────────────────────────────────

  return (
    <div className="pp">
      <Seo
        title="Helicopter Pilot Provisioning — Contract Crew, UK"
        description="Qualified helicopter pilot supply and contract crew for owner-operators and yacht operators. UK-wide deployment from Denham."
        jsonLd={[
          buildService({
            name: 'Pilot Provisioning',
            serviceType: 'Helicopter pilot supply and contract crew',
            description: 'Helicopter pilot supply and contract crew services for owner-operators and yacht operators.',
            url: `${SITE_URL}/pilot-provisioning`,
            areaServed: AREA_SERVED,
          }),
          buildBreadcrumbList([
            { name: 'Home', path: '/' },
            { name: 'Pilot Provisioning', path: '/pilot-provisioning' },
          ]),
        ]}
      />
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

            {/* Badge */}
            <motion.div
              className="pp-hero__badge"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1, duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            >
              <div className="pp-hero__badge-stat">
                <span className="pp-hero__badge-label">Rated</span>
                <span className="pp-hero__badge-sub">&amp; Current</span>
              </div>
              <div className="pp-hero__badge-divider" />
              <div className="pp-hero__badge-stat">
                <span className="pp-hero__badge-label">Insured</span>
                <span className="pp-hero__badge-sub">&amp; Ready</span>
              </div>
            </motion.div>

            <motion.p
              className="pp-hero__sub"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.2, duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            >
              Crewing, safety pilots, and ferry flights. Fully rated, insured, and experienced across
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
            <Reveal direction="left" delay={0.15}>
              <div className="pp-intro__image-wrap">
                <img
                  src={pageImages['pp-intro']?.[0]?.url || '/assets/images/gallery/carousel/rotating8.jpg'}
                  alt="HQ Pilot Network"
                  className="pp-intro__image"
                />
                <span className="pp-intro__caption">HQ Pilot Network</span>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* ========== SERVICE PANELS ========== */}
      <section className="pp-services" data-cms-section="pp-services">
        <div className="pp-services__container">
          <Reveal>
            <div className="pp-section-header">
              <span className="pp-pre-text">What We Provide</span>
              <h2>Provisioning Services</h2>
            </div>
          </Reveal>

          <div className="pp-panels">
            {servicePanels.map((panel, i) => (
              <Reveal key={panel.num} delay={0.05}>
                <div className={`pp-panel ${i % 2 === 1 ? 'pp-panel--flipped' : ''}`}>
                  <div className="pp-panel__image">
                    <img src={panel.image} alt={panel.title} />
                  </div>
                  <div className="pp-panel__content">
                    <span className="pp-panel__tag">{panel.tag}</span>
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

      {/* ========== STANDARDS ========== */}
      <section className="pp-standards">
        <div className="pp-standards__container">
          <Reveal>
            <div className="pp-section-header pp-section-header--light">
              <span className="pp-pre-text pp-pre-text--light">Our People</span>
              <h2 className="pp-standards__heading">Pilot Standards</h2>
              <p className="pp-standards__desc">
                Every pilot we provision meets the same standards we hold our own instructors to.
                We do not provide bodies. We provide people we would be happy to put in front of
                our own students.
              </p>
            </div>
          </Reveal>

          <div className="pp-standards__grid">
            {pilotStandards.map((standard, i) => (
              <Reveal key={standard.num} delay={i * 0.1}>
                <div className="pp-standard-card">
                  <div className="pp-standard-card__num">{standard.num}</div>
                  <h4 className="pp-standard-card__title">{standard.title}</h4>
                  <p className="pp-standard-card__desc">{standard.desc}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ========== PROCESS ========== */}
      <section className="pp-process">
        <div className="pp-process__container">
          <Reveal>
            <div className="pp-section-header">
              <span className="pp-pre-text">How It Works</span>
              <h2>Simple Process</h2>
            </div>
          </Reveal>

          <div className="pp-process__steps">
            {processSteps.map((step, i) => (
              <Reveal key={step.num} delay={i * 0.1}>
                <div className="pp-process__step">
                  <div className="pp-process__step-num">{step.num}</div>
                  <div className="pp-process__step-content">
                    <div className="pp-process__step-header">
                      <h4>{step.title}</h4>
                      <span className="pp-process__step-duration">{step.duration}</span>
                    </div>
                    <p>{step.description}</p>
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

      {/* ========== FAQ ========== */}
      <section className="pp-faq" data-cms-section="faqs-pilot-provisioning">
        <div className="pp-faq__container">
          <Reveal>
            <div className="pp-section-header">
              <span className="pp-pre-text">Common Questions</span>
              <h2>Frequently Asked</h2>
            </div>
          </Reveal>

          <div className="pp-faq__list">
            {(showAllFaqs ? faqs : faqs.slice(0, 6)).map((faq, i) => (
              <Reveal key={faq.id} delay={i * 0.05}>
                <div
                  className={`pp-faq__item ${openFaq === i ? 'pp-faq__item--open' : ''}`}
                  onClick={() => setOpenFaq(openFaq === i ? null : i)}
                >
                  <span className="pp-faq__number">{String(i + 1).padStart(2, '0')}</span>
                  <div className="pp-faq__content">
                    <h4>
                      {faq.question}
                      <span className="pp-faq__toggle">{openFaq === i ? '−' : '+'}</span>
                    </h4>
                    <AnimatePresence>
                      {openFaq === i && (
                        <motion.div
                          className="pp-faq__answer"
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: 'auto', opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
                        >
                          <p>{faq.answer}</p>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
          {!showAllFaqs && faqs.length > 6 && (
            <button className="pp-faq__load-more" onClick={() => setShowAllFaqs(true)}>Load More</button>
          )}
        </div>
      </section>

      {/* ========== CTA ========== */}
      <section className="pp-cta">
        <div className="pp-cta__inner">
          <Reveal>
            <span className="pp-pre-text pp-pre-text--light">Need a Pilot?</span>
            <h2 className="pp-cta__heading">Get in Touch</h2>
            <p className="pp-cta__body">
              Tell us your mission and we'll come back with availability and costs.
              Most enquiries get a response within a few hours.
            </p>
            <div className="pp-cta__buttons">
              <Link to="/superyacht-ops" className="pp-cta__link">
                SuperYacht Ops
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
                  <path d="M6 3L11 8L6 13" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </Link>
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

        /* Hero Badge */
        .pp-hero__badge {
          display: flex;
          align-items: center;
          gap: 1.5rem;
          background: rgba(255, 255, 255, 0.07);
          backdrop-filter: blur(10px);
          border: 1px solid rgba(255, 255, 255, 0.12);
          border-radius: 8px;
          padding: 0.9rem 1.4rem;
          max-width: 280px;
          margin-bottom: 1.75rem;
        }

        .pp-hero__badge-stat {
          display: flex;
          flex-direction: column;
          gap: 0.15rem;
        }

        .pp-hero__badge-label {
          font-family: 'Share Tech Mono', monospace;
          font-size: 1rem;
          font-weight: 700;
          color: #fff;
          line-height: 1;
        }

        .pp-hero__badge-sub {
          font-size: 0.6rem;
          color: rgba(255, 255, 255, 0.5);
          text-transform: uppercase;
          letter-spacing: 0.08em;
        }

        .pp-hero__badge-divider {
          width: 1px;
          height: 34px;
          background: linear-gradient(to bottom, transparent, rgba(255, 255, 255, 0.2), transparent);
          flex-shrink: 0;
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
          grid-template-columns: 1fr 1fr;
          gap: 5rem;
          align-items: center;
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

        .pp-intro__image-wrap {
          position: relative;
        }

        .pp-intro__image {
          width: 100%;
          aspect-ratio: 4 / 3;
          object-fit: cover;
          display: block;
        }

        .pp-intro__caption {
          display: block;
          margin-top: 0.6rem;
          font-size: 0.65rem;
          text-transform: uppercase;
          letter-spacing: 0.15em;
          color: #aaa;
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
        }

        /* Panel base — image LEFT, content RIGHT */
        .pp-panel {
          display: grid;
          grid-template-columns: 60% 40%;
          min-height: 420px;
          border-bottom: 1px solid #e8e6e2;
        }

        .pp-panel:last-child {
          border-bottom: none;
        }

        /* Flipped panel — content LEFT, image RIGHT */
        .pp-panel--flipped {
          grid-template-columns: 40% 60%;
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

        .pp-panel__tag {
          display: inline-block;
          padding: 0.25rem 0.75rem;
          background: #f5f5f2;
          border-radius: 100px;
          font-size: 0.6rem;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 0.15em;
          color: #666;
          margin-bottom: 1rem;
          align-self: flex-start;
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
           STANDARDS (dark)
           =================================================== */

        .pp-standards {
          background: #1a1a1a;
          padding: 6rem 4rem;
        }

        .pp-standards__container {
          max-width: 1200px;
          margin: 0 auto;
        }

        .pp-standards__heading {
          color: #fff;
        }

        .pp-standards__desc {
          color: rgba(255, 255, 255, 0.7);
          font-size: 1.05rem;
          line-height: 1.7;
          max-width: 620px;
          margin: 0 auto;
        }

        .pp-standards__grid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 1.5rem;
          max-width: 900px;
          margin: 0 auto;
        }

        .pp-standard-card {
          background: rgba(255, 255, 255, 0.05);
          border: 1px solid rgba(255, 255, 255, 0.1);
          border-radius: 8px;
          padding: 1.75rem;
        }

        .pp-standard-card__num {
          font-family: 'Share Tech Mono', monospace;
          font-size: 0.65rem;
          color: rgba(255, 255, 255, 0.3);
          letter-spacing: 0.1em;
          margin-bottom: 0.75rem;
          display: block;
        }

        .pp-standard-card__title {
          font-size: 1rem;
          font-weight: 700;
          color: #fff;
          text-transform: uppercase;
          margin: 0 0 0.5rem;
        }

        .pp-standard-card__desc {
          font-size: 0.875rem;
          color: rgba(255, 255, 255, 0.55);
          line-height: 1.6;
          margin: 0;
        }


        /* ===================================================
           PROCESS
           =================================================== */

        .pp-process {
          background: #faf9f6;
          padding: 6rem 4rem;
        }

        .pp-process__container {
          max-width: 900px;
          margin: 0 auto;
        }

        .pp-process__steps {
          display: flex;
          flex-direction: column;
          gap: 0;
        }

        .pp-process__step {
          display: flex;
          gap: 1.5rem;
          padding: 1.75rem 0;
          border-bottom: 1px solid #e8e6e2;
        }

        .pp-process__step:last-child {
          border-bottom: none;
        }

        .pp-process__step-num {
          font-family: 'Share Tech Mono', monospace;
          font-size: 0.75rem;
          color: #ccc;
          flex-shrink: 0;
          padding-top: 0.2rem;
          min-width: 2rem;
        }

        .pp-process__step-content {
          flex: 1;
        }

        .pp-process__step-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 0.5rem;
        }

        .pp-process__step-header h4 {
          font-size: 1rem;
          font-weight: 700;
          margin: 0;
          color: #1a1a1a;
          text-transform: uppercase;
        }

        .pp-process__step-duration {
          font-family: 'Share Tech Mono', monospace;
          font-size: 0.7rem;
          color: #aaa;
          letter-spacing: 0.1em;
          flex-shrink: 0;
        }

        .pp-process__step-content p {
          font-size: 0.9rem;
          color: #666;
          line-height: 1.65;
          margin: 0;
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
           FAQ
           =================================================== */

        .pp-faq {
          background: #faf9f6;
          padding: 6rem 4rem;
        }

        .pp-faq__container {
          max-width: 800px;
          margin: 0 auto;
        }

        .pp-faq__list {
          display: flex;
          flex-direction: column;
        }

        .pp-faq__load-more { margin-top: 1.5rem; display: block; width: 100%; padding: 0.9rem 1.5rem; background: transparent; border: 1px solid #1a1a1a; color: #1a1a1a; font-family: 'Share Tech Mono', monospace; font-size: 0.72rem; letter-spacing: 0.12em; text-transform: uppercase; cursor: pointer; transition: background 0.2s ease, color 0.2s ease; }
        .pp-faq__load-more:hover { background: #1a1a1a; color: #fff; }

        .pp-faq__item {
          display: flex;
          gap: 1.5rem;
          padding: 1.25rem 0;
          border-bottom: 1px solid #e8e6e2;
          cursor: pointer;
          transition: background 0.2s ease;
        }

        .pp-faq__item:first-child {
          border-top: 1px solid #e8e6e2;
        }

        .pp-faq__item:hover {
          background: rgba(0, 0, 0, 0.01);
        }

        .pp-faq__item--open {
          background: rgba(0, 0, 0, 0.02);
        }

        .pp-faq__number {
          font-family: 'Share Tech Mono', monospace;
          font-size: 0.75rem;
          color: #ccc;
          flex-shrink: 0;
          padding-top: 0.1rem;
          min-width: 2rem;
        }

        .pp-faq__content {
          flex: 1;
        }

        .pp-faq__content h4 {
          margin: 0;
          font-size: 1rem;
          font-weight: 600;
          display: flex;
          justify-content: space-between;
          align-items: center;
          gap: 1rem;
          color: #1a1a1a;
          line-height: 1.4;
        }

        .pp-faq__toggle {
          font-size: 1.25rem;
          font-weight: 300;
          color: #999;
          flex-shrink: 0;
          line-height: 1;
        }

        .pp-faq__answer {
          overflow: hidden;
        }

        .pp-faq__answer p {
          margin: 0.75rem 0 0;
          color: #666;
          line-height: 1.7;
          font-size: 0.95rem;
        }


        /* ===================================================
           CTA (dark)
           =================================================== */

        .pp-cta {
          background: #1a1a1a;
          padding: 0;
        }

        .pp-cta__inner {
          max-width: 700px;
          margin: 0 auto;
          padding: 6rem 4rem;
          text-align: center;
        }

        .pp-cta__heading {
          font-size: clamp(1.75rem, 3.5vw, 2.8rem);
          font-weight: 700;
          text-transform: uppercase;
          color: #fff;
          margin: 0.5rem 0 1.5rem;
          line-height: 1.1;
        }

        .pp-cta__body {
          color: rgba(255, 255, 255, 0.7);
          font-size: 1rem;
          line-height: 1.75;
          margin: 0 0 2.5rem;
          max-width: 500px;
          margin-left: auto;
          margin-right: auto;
        }

        .pp-cta__buttons {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 2rem;
          flex-wrap: wrap;
        }

        .pp-cta__link {
          display: inline-flex;
          align-items: center;
          gap: 0.5rem;
          font-size: 0.75rem;
          text-transform: uppercase;
          letter-spacing: 0.1em;
          color: rgba(255, 255, 255, 0.65);
          text-decoration: none;
          transition: color 0.3s ease;
        }

        .pp-cta__link:hover {
          color: #fff;
        }

        .pp-cta__link svg {
          transition: transform 0.3s ease;
        }

        .pp-cta__link:hover svg {
          transform: translateX(3px);
        }


        /* ===================================================
           RESPONSIVE — 1024px (tablet landscape)
           =================================================== */

        @media (max-width: 1024px) {
          .pp-intro__grid {
            grid-template-columns: 1fr;
            gap: 3rem;
          }

          .pp-intro__image-wrap {
            order: -1;
          }

          .pp-standards__grid {
            grid-template-columns: 1fr;
          }

          .pp-services {
            padding: 2rem 2.5rem;
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

          /* Standards */
          .pp-standards {
            padding: 4rem 1.5rem;
          }

          .pp-standards__grid {
            grid-template-columns: 1fr;
            gap: 1rem;
          }

          /* Process */
          .pp-process {
            padding: 4rem 1.5rem;
          }

          .pp-process__step {
            flex-direction: column;
            gap: 0.5rem;
            padding: 1.25rem 0;
          }

          .pp-process__step-header {
            flex-direction: column;
            align-items: flex-start;
            gap: 0.25rem;
          }

          /* Aircraft */
          .pp-aircraft {
            padding: 4rem 1.5rem;
          }

          .pp-aircraft__chips {
            gap: 0.5rem;
          }

          /* FAQ */
          .pp-faq {
            padding: 4rem 1.5rem;
          }

          .pp-faq__item {
            gap: 1rem;
          }

          /* CTA */
          .pp-cta__inner {
            padding: 4rem 1.5rem;
          }

          .pp-cta__buttons {
            flex-direction: column;
            gap: 1.25rem;
          }
        }


        /* ===================================================
           RESPONSIVE — 480px (mobile)
           =================================================== */

        @media (max-width: 480px) {
          .pp-hero__word {
            font-size: clamp(2.5rem, 13vw, 3.5rem);
          }

          .pp-hero__badge {
            max-width: 100%;
          }

          .pp-panel__title {
            font-size: 1.2rem;
          }

          .pp-faq__content h4 {
            font-size: 0.9rem;
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

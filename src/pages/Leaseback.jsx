/**
 * HQ AVIATION — LEASEBACK PAGE
 *
 * Lightweight educational landing page for the Leaseback Program.
 * Destination for the "Learn More" button on the Leaseback card on /sales/new.
 *
 * Brand: Luxury Minimal Aviation
 * Typography: Space Grotesk + Share Tech Mono
 * Colors: #faf9f6 (warm white), #1a1a1a (charcoal), #4a4a4a (mid), #7a7a7a (light)
 * CSS prefix: lb-
 *
 * Sections:
 * 1. Hero — animated headline over editorial image
 * 2. Intro — what is leaseback
 * 3. How It Works — 3-step process
 * 4. Benefits — 4-card grid
 * 5. Eligible Aircraft — R44, R66, Hughes 500 strip linking to aircraft pages
 */

import React, { useRef, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, useInView, useScroll, useTransform } from 'framer-motion';
import { usePageImages } from '../hooks/usePageImages';
import { useCmsHighlight } from '../hooks/useCmsHighlight';

import '../assets/css/main.css';
import '../assets/css/components.css';

import FooterMinimal from '../components/FooterMinimal';
import HqMenuPanel from '../components/HqMenuPanel';

// ─────────────────────────────────────────────────────────────────────────────
// HEADER COMPONENT
// ─────────────────────────────────────────────────────────────────────────────

function LeasebackHeader() {
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
      >
        <span></span>
        <span></span>
        <span></span>
      </button>

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
              />
            </Link>
            <nav className="Header-nav Header-nav--secondary" data-nc-element="secondary-nav">
              <div className="Header-nav-inner">
                <Link to="/flying" className="Header-nav-item">Flying</Link>
                <Link to="/training" className="Header-nav-item">Training</Link>
                <Link to="/sales" className="Header-nav-item">Aircraft</Link>
              </div>
            </nav>
          </div>
          <div data-nc-container="top-right"></div>
        </div>
      </header>
    </>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// REVEAL COMPONENT
// ─────────────────────────────────────────────────────────────────────────────

function Reveal({ children, delay = 0, direction = 'up' }) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.2 });

  const variants = {
    hidden: {
      opacity: 0,
      y: direction === 'up' ? 40 : direction === 'down' ? -40 : 0,
      x: direction === 'left' ? 40 : direction === 'right' ? -40 : 0,
    },
    visible: { opacity: 1, y: 0, x: 0 },
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

// ─────────────────────────────────────────────────────────────────────────────
// SECTION 1: HERO
// ─────────────────────────────────────────────────────────────────────────────

function LeasebackHero({ pageImages }) {
  const heroRef = useRef(null);
  const { scrollYProgress } = useScroll({ target: heroRef, offset: ['start start', 'end start'] });
  const heroOpacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);
  const heroScale = useTransform(scrollYProgress, [0, 0.5], [1, 0.95]);
  const heroY = useTransform(scrollYProgress, [0, 0.5], [0, 100]);

  const heroImage =
    pageImages['lb-hero']?.[0]?.url ||
    '/assets/images/new-aircraft/r66/rhc-r66-nxg-pv-left-side-wide-shot-from-rear-13751.jpg';

  const words = ['LEASEBACK', 'PROGRAM'];

  return (
    <section ref={heroRef} className="lb-hero" data-cms-section="lb-hero">
      <motion.div
        className="lb-hero__bg"
        initial={{ scale: 1.08, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 1.6, ease: [0.16, 1, 0.3, 1] }}
      >
        <img src={heroImage} alt="HQ Aviation Leaseback Program" />
      </motion.div>
      <div className="lb-hero__overlay" />

      <motion.div
        className="lb-hero__content"
        style={{ opacity: heroOpacity, scale: heroScale, y: heroY }}
      >
        <motion.span
          className="lb-hero__label"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          Earn While You Own
        </motion.span>

        <h1 className="lb-hero__headline">
          {words.map((word, i) => (
            <motion.span
              key={word}
              className="lb-hero__word"
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 + i * 0.08, duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
            >
              {word}
            </motion.span>
          ))}
        </h1>

        <motion.div
          className="lb-hero__divider"
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ delay: 0.7, duration: 0.8 }}
        />

        <motion.p
          className="lb-hero__tagline"
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.85 }}
        >
          Put your aircraft to work when you're not flying.
        </motion.p>

        <motion.p
          className="lb-hero__subtitle"
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.0 }}
        >
          Earn revenue through charter and training operations, professionally managed by HQ.
        </motion.p>
      </motion.div>
    </section>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// SECTION 2: INTRO — WHAT IS LEASEBACK
// ─────────────────────────────────────────────────────────────────────────────

function LeasebackIntro() {
  return (
    <section className="lb-intro" data-cms-section="lb-intro">
      <div className="lb-intro__container">
        <div className="lb-intro__left">
          <Reveal>
            <span className="lb-pre-text">The Program</span>
            <h2 className="lb-intro__heading">A second life for your aircraft.</h2>
            <p className="lb-intro__body">
              A leaseback agreement places your aircraft into HQ's commercial operation. We fly it on charter and training work, you receive a share of the revenue earned, and the aircraft remains yours throughout.
            </p>
            <p className="lb-intro__body">
              Maintenance, scheduling, pilot management, and operational compliance all sit with HQ. You retain priority personal use under the terms of your agreement.
            </p>
          </Reveal>
        </div>
        <div className="lb-intro__right">
          <Reveal delay={0.15} direction="left">
            <div className="lb-intro__quote">
              <span className="lb-pre-text">Why Leaseback</span>
              <p className="lb-intro__quote-text">
                "Charter and training operations turn idle ownership cost into productive revenue."
              </p>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// SECTION 3: HOW IT WORKS
// ─────────────────────────────────────────────────────────────────────────────

const HOW_STEPS = [
  {
    num: '01',
    title: 'Aircraft Assessment',
    description: 'Independent valuation, hours, and condition review.',
  },
  {
    num: '02',
    title: 'Operating Agreement',
    description: 'Revenue split, scheduling, and insurance terms agreed in writing.',
  },
  {
    num: '03',
    title: 'Earn While You Own',
    description: 'HQ flies and maintains the aircraft on your behalf. You receive monthly statements.',
  },
];

function LeasebackHowItWorks() {
  return (
    <section className="lb-how" data-cms-section="lb-how">
      <div className="lb-how__container">
        <Reveal>
          <span className="lb-pre-text lb-how__pre">The Process</span>
          <h2 className="lb-how__heading">From handover to revenue.</h2>
        </Reveal>
        <div className="lb-how__steps">
          {HOW_STEPS.map((step, i) => (
            <Reveal key={step.num} delay={0.1 + i * 0.1}>
              <div className="lb-how__step">
                <span className="lb-how__num">{step.num}</span>
                <h3 className="lb-how__title">{step.title}</h3>
                <p className="lb-how__desc">{step.description}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// SECTION 4: BENEFITS
// ─────────────────────────────────────────────────────────────────────────────

const BENEFITS = [
  {
    title: 'Offset Ownership Costs',
    description: 'Charter and training revenue offsets fixed costs like insurance and hangarage.',
  },
  {
    title: 'Professional Management',
    description: 'HQ-employed pilots, scheduled maintenance, and full operational oversight.',
  },
  {
    title: 'Insurance & Liability Handled',
    description: 'Commercial cover and operating liability sit with HQ during leaseback hours.',
  },
  {
    title: 'Transparent Reporting',
    description: 'Monthly statements showing flight hours, revenue, and aircraft status.',
  },
];

function LeasebackBenefits() {
  return (
    <section className="lb-benefits" data-cms-section="lb-benefits">
      <div className="lb-benefits__container">
        <Reveal>
          <span className="lb-pre-text">Why Leaseback</span>
          <h2 className="lb-benefits__heading">What owners gain.</h2>
        </Reveal>
        <div className="lb-benefits__grid">
          {BENEFITS.map((benefit, i) => (
            <Reveal key={benefit.title} delay={0.1 + i * 0.08}>
              <div className="lb-benefits__card">
                <span className="lb-benefits__icon" aria-hidden="true">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                </span>
                <h3 className="lb-benefits__title">{benefit.title}</h3>
                <p className="lb-benefits__desc">{benefit.description}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// SECTION 5: ELIGIBLE AIRCRAFT
// ─────────────────────────────────────────────────────────────────────────────

const AIRCRAFT_CARDS = [
  {
    href: '/aircraft/r44',
    eyebrow: 'Piston',
    name: 'Robinson R44',
    role: 'Four-seat workhorse for charter and training.',
    fallback: '/assets/images/used-aircraft/r44/r44-raven-ii-grrob.jpg',
    alt: 'Robinson R44 Raven II',
  },
  {
    href: '/aircraft/r66',
    eyebrow: 'Turbine',
    name: 'Robinson R66',
    role: 'Five-seat turbine for premium charter and instruction.',
    fallback: '/assets/images/new-aircraft/r66/r66-turbine.png',
    alt: 'Robinson R66 Turbine',
  },
  {
    href: '/aircraft/h500',
    eyebrow: 'Turbine',
    name: 'Hughes 500',
    role: 'Compact turbine for utility, charter, and specialty work.',
    fallback: '/assets/images/used-aircraft/other/hughes-369e-gumby.jpg',
    alt: 'Hughes 500 in flight',
  },
];

function LeasebackEligibleAircraft({ pageImages }) {
  const cardImages = pageImages['lb-aircraft'] || [];
  return (
    <section className="lb-aircraft" data-cms-section="lb-aircraft">
      <div className="lb-aircraft__container">
        <Reveal>
          <span className="lb-pre-text">Eligible Aircraft</span>
          <h2 className="lb-aircraft__heading">Aircraft we can place.</h2>
        </Reveal>
        <div className="lb-aircraft__grid">
          {AIRCRAFT_CARDS.map((card, i) => {
            const imgUrl = cardImages[i]?.url || card.fallback;
            const imgAlt = cardImages[i]?.alt || card.alt;
            return (
              <Reveal key={card.href} delay={0.1 + i * 0.1}>
                <Link to={card.href} className="lb-aircraft__card">
                  <div className="lb-aircraft__img-wrap">
                    <img src={imgUrl} alt={imgAlt} className="lb-aircraft__img" />
                  </div>
                  <div className="lb-aircraft__body">
                    <span className="lb-pre-text">{card.eyebrow}</span>
                    <h3 className="lb-aircraft__name">{card.name}</h3>
                    <p className="lb-aircraft__role">{card.role}</p>
                    <span className="lb-aircraft__arrow" aria-hidden="true">→</span>
                  </div>
                </Link>
              </Reveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// STYLES
// ─────────────────────────────────────────────────────────────────────────────

function LeasebackStyles() {
  return (
    <style>{`
      .lb-page {
        background: #faf9f6;
        color: #1a1a1a;
        font-family: 'Space Grotesk', sans-serif;
      }
      .lb-pre-text {
        font-family: 'Share Tech Mono', monospace;
        text-transform: uppercase;
        letter-spacing: 0.3em;
        font-size: 11px;
        color: #7a7a7a;
      }

      /* ── SECTION 1: HERO ────────────────────────────────────────────────── */
      .lb-hero {
        position: relative;
        height: 100vh;
        min-height: 640px;
        overflow: hidden;
        display: flex;
        align-items: center;
        justify-content: center;
      }
      .lb-hero__bg {
        position: absolute;
        inset: 0;
        z-index: 0;
      }
      .lb-hero__bg img {
        width: 100%;
        height: 100%;
        object-fit: cover;
        object-position: center;
      }
      .lb-hero__overlay {
        position: absolute;
        inset: 0;
        background: linear-gradient(180deg, rgba(0,0,0,0.45) 0%, rgba(0,0,0,0.65) 100%);
        z-index: 1;
      }
      .lb-hero__content {
        position: relative;
        z-index: 2;
        max-width: 1200px;
        width: 100%;
        padding: 0 48px;
        color: #faf9f6;
        text-align: left;
      }
      .lb-hero__label {
        display: inline-block;
        font-family: 'Share Tech Mono', monospace;
        text-transform: uppercase;
        letter-spacing: 0.3em;
        font-size: 12px;
        color: #faf9f6;
        margin-bottom: 28px;
        opacity: 0.85;
      }
      .lb-hero__headline {
        font-family: 'Space Grotesk', sans-serif;
        font-weight: 600;
        font-size: clamp(48px, 8vw, 120px);
        line-height: 1;
        letter-spacing: -0.02em;
        margin: 0 0 32px;
        color: #faf9f6;
        display: flex;
        flex-wrap: wrap;
        gap: 0.25em;
      }
      .lb-hero__word {
        display: inline-block;
      }
      .lb-hero__divider {
        width: 80px;
        height: 1px;
        background: #faf9f6;
        opacity: 0.5;
        transform-origin: left center;
        margin-bottom: 24px;
      }
      .lb-hero__tagline {
        font-family: 'Space Grotesk', sans-serif;
        font-size: clamp(18px, 2vw, 24px);
        line-height: 1.4;
        font-weight: 400;
        color: #faf9f6;
        margin: 0 0 16px;
        max-width: 640px;
      }
      .lb-hero__subtitle {
        font-family: 'Space Grotesk', sans-serif;
        font-size: 15px;
        line-height: 1.6;
        color: #faf9f6;
        opacity: 0.75;
        margin: 0;
        max-width: 540px;
      }
      @media (max-width: 768px) {
        .lb-hero__content { padding: 0 24px; }
        .lb-hero__headline { font-size: clamp(40px, 12vw, 72px); }
      }
      /* ── SECTION 2: INTRO ──────────────────────────────────────────────── */
      .lb-intro {
        background: #faf9f6;
        padding: 120px 48px;
      }
      .lb-intro__container {
        max-width: 1200px;
        margin: 0 auto;
        display: grid;
        grid-template-columns: 1.4fr 1fr;
        gap: 80px;
        align-items: start;
      }
      .lb-intro__left .lb-pre-text { display: block; margin-bottom: 16px; }
      .lb-intro__heading {
        font-family: 'Space Grotesk', sans-serif;
        font-weight: 500;
        font-size: clamp(32px, 4vw, 56px);
        line-height: 1.1;
        letter-spacing: -0.02em;
        margin: 0 0 32px;
        color: #1a1a1a;
      }
      .lb-intro__body {
        font-size: 16px;
        line-height: 1.7;
        color: #4a4a4a;
        margin: 0 0 20px;
        max-width: 560px;
      }
      .lb-intro__body:last-child { margin-bottom: 0; }
      .lb-intro__quote {
        border-top: 1px solid #1a1a1a;
        padding-top: 24px;
      }
      .lb-intro__quote .lb-pre-text { display: block; margin-bottom: 16px; }
      .lb-intro__quote-text {
        font-family: 'Space Grotesk', sans-serif;
        font-size: 20px;
        line-height: 1.5;
        font-style: italic;
        color: #1a1a1a;
        margin: 0;
      }
      @media (max-width: 900px) {
        .lb-intro { padding: 80px 24px; }
        .lb-intro__container { grid-template-columns: 1fr; gap: 40px; }
      }
      /* ── SECTION 3: HOW IT WORKS ───────────────────────────────────────── */
      .lb-how {
        background: #1a1a1a;
        color: #faf9f6;
        padding: 120px 48px;
      }
      .lb-how__container {
        max-width: 1200px;
        margin: 0 auto;
      }
      .lb-how__pre {
        display: block;
        margin-bottom: 16px;
        color: #7a7a7a;
      }
      .lb-how__heading {
        font-family: 'Space Grotesk', sans-serif;
        font-weight: 500;
        font-size: clamp(32px, 4vw, 56px);
        line-height: 1.1;
        letter-spacing: -0.02em;
        margin: 0 0 64px;
        color: #faf9f6;
        max-width: 640px;
      }
      .lb-how__steps {
        display: grid;
        grid-template-columns: repeat(3, 1fr);
        gap: 48px;
        border-top: 1px solid rgba(250,249,246,0.15);
        padding-top: 48px;
      }
      .lb-how__step {
        position: relative;
      }
      .lb-how__num {
        font-family: 'Share Tech Mono', monospace;
        font-size: clamp(40px, 5vw, 64px);
        font-weight: 400;
        color: #7a7a7a;
        display: block;
        margin-bottom: 24px;
        letter-spacing: -0.02em;
      }
      .lb-how__title {
        font-family: 'Space Grotesk', sans-serif;
        font-weight: 500;
        font-size: 22px;
        line-height: 1.2;
        color: #faf9f6;
        margin: 0 0 16px;
      }
      .lb-how__desc {
        font-size: 15px;
        line-height: 1.6;
        color: #7a7a7a;
        margin: 0;
      }
      @media (max-width: 900px) {
        .lb-how { padding: 80px 24px; }
        .lb-how__steps { grid-template-columns: 1fr; gap: 40px; }
        .lb-how__heading { margin-bottom: 40px; }
      }
      /* ── SECTION 4: BENEFITS ───────────────────────────────────────────── */
      .lb-benefits {
        background: #faf9f6;
        padding: 120px 48px;
      }
      .lb-benefits__container {
        max-width: 1200px;
        margin: 0 auto;
      }
      .lb-benefits__heading {
        font-family: 'Space Grotesk', sans-serif;
        font-weight: 500;
        font-size: clamp(32px, 4vw, 56px);
        line-height: 1.1;
        letter-spacing: -0.02em;
        margin: 16px 0 64px;
        color: #1a1a1a;
        max-width: 640px;
      }
      .lb-benefits__grid {
        display: grid;
        grid-template-columns: 1fr 1fr;
        gap: 32px;
      }
      .lb-benefits__card {
        border-top: 1px solid #1a1a1a;
        padding: 28px 0 0;
      }
      .lb-benefits__icon {
        display: inline-flex;
        align-items: center;
        justify-content: center;
        width: 32px;
        height: 32px;
        border-radius: 50%;
        background: #1a1a1a;
        color: #faf9f6;
        margin-bottom: 20px;
      }
      .lb-benefits__title {
        font-family: 'Space Grotesk', sans-serif;
        font-weight: 500;
        font-size: 20px;
        line-height: 1.25;
        color: #1a1a1a;
        margin: 0 0 12px;
      }
      .lb-benefits__desc {
        font-size: 15px;
        line-height: 1.6;
        color: #4a4a4a;
        margin: 0;
        max-width: 440px;
      }
      @media (max-width: 900px) {
        .lb-benefits { padding: 80px 24px; }
        .lb-benefits__grid { grid-template-columns: 1fr; gap: 24px; }
        .lb-benefits__heading { margin-bottom: 40px; }
      }
      /* ── SECTION 5: ELIGIBLE AIRCRAFT ──────────────────────────────────── */
      .lb-aircraft {
        background: #faf9f6;
        padding: 0 48px 120px;
      }
      .lb-aircraft__container {
        max-width: 1200px;
        margin: 0 auto;
      }
      .lb-aircraft__heading {
        font-family: 'Space Grotesk', sans-serif;
        font-weight: 500;
        font-size: clamp(32px, 4vw, 56px);
        line-height: 1.1;
        letter-spacing: -0.02em;
        margin: 16px 0 64px;
        color: #1a1a1a;
        max-width: 640px;
      }
      .lb-aircraft__grid {
        display: grid;
        grid-template-columns: repeat(3, 1fr);
        gap: 32px;
      }
      .lb-aircraft__card {
        display: block;
        text-decoration: none;
        color: inherit;
        background: #ffffff;
        border: 1px solid rgba(26,26,26,0.08);
        transition: transform 0.4s ease, border-color 0.4s ease;
      }
      .lb-aircraft__card:hover {
        transform: translateY(-4px);
        border-color: rgba(26,26,26,0.25);
      }
      .lb-aircraft__img-wrap {
        aspect-ratio: 4 / 3;
        overflow: hidden;
        background: #1a1a1a;
      }
      .lb-aircraft__img {
        width: 100%;
        height: 100%;
        object-fit: cover;
        transition: transform 0.6s ease;
      }
      .lb-aircraft__card:hover .lb-aircraft__img { transform: scale(1.04); }
      .lb-aircraft__body {
        padding: 24px;
        position: relative;
      }
      .lb-aircraft__body .lb-pre-text { display: block; margin-bottom: 12px; }
      .lb-aircraft__name {
        font-family: 'Space Grotesk', sans-serif;
        font-weight: 500;
        font-size: 22px;
        line-height: 1.2;
        color: #1a1a1a;
        margin: 0 0 12px;
      }
      .lb-aircraft__role {
        font-size: 14px;
        line-height: 1.55;
        color: #4a4a4a;
        margin: 0 32px 0 0;
      }
      .lb-aircraft__arrow {
        position: absolute;
        right: 24px;
        bottom: 24px;
        font-size: 20px;
        color: #1a1a1a;
        transition: transform 0.3s ease;
      }
      .lb-aircraft__card:hover .lb-aircraft__arrow { transform: translateX(4px); }
      @media (max-width: 900px) {
        .lb-aircraft { padding: 0 24px 80px; }
        .lb-aircraft__grid { grid-template-columns: 1fr; gap: 20px; }
        .lb-aircraft__heading { margin-bottom: 40px; }
      }
    `}</style>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// MAIN COMPONENT
// ─────────────────────────────────────────────────────────────────────────────

export default function Leaseback() {
  const pageImages = usePageImages('leaseback');
  useCmsHighlight();
  useEffect(() => { window.scrollTo(0, 0); }, []);

  return (
    <div className="lb-page">
      <LeasebackStyles />
      <LeasebackHeader />
      <main>
        <LeasebackHero pageImages={pageImages} />
        <LeasebackIntro />
        <LeasebackHowItWorks />
        <LeasebackBenefits />
        <LeasebackEligibleAircraft pageImages={pageImages} />
      </main>
      <FooterMinimal />
    </div>
  );
}

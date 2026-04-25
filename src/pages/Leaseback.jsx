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
      </main>
      <FooterMinimal />
    </div>
  );
}

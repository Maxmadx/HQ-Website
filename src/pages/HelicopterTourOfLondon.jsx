/**
 * HELICOPTER TOUR OF LONDON PAGE
 *
 * A complete tour booking page featuring:
 * - Custom header with spotlight animation
 * - Hero section with interactive ticket component
 * - Image gallery showcasing London landmarks
 * - Features & highlights
 * - FAQ section
 * - Booking CTA
 * - Minimal footer
 *
 * Brand: Luxury Minimal Aviation
 * Typography: Space Grotesk + Share Tech Mono
 */

import React, { useRef, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, useInView, useScroll, useTransform } from 'framer-motion';
import { useFaqs } from '../hooks/useFaqs';
import { usePageImages } from '../hooks/usePageImages';
import { useCmsHighlight } from '../hooks/useCmsHighlight';

// Import styles
import '../assets/css/main.css';
import '../assets/css/components.css';

// Import components
import FooterMinimal from '../components/FooterMinimal';
import LondonTourTicket from '../components/LondonTourTicket';
import HqMenuPanel from '../components/HqMenuPanel';
import Seo from '../components/seo/Seo';
import { buildProduct, buildTouristTrip, buildBreadcrumbList } from '../components/seo/jsonLd';
import { SITE_URL } from '../lib/seoDefaults';

/**
 * PAGE HEADER COMPONENT
 * Spotlight animation header
 */
function TourHeader() {
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
                width={405}
                height={245}
              />
            </Link>
            <nav className="Header-nav Header-nav--secondary" data-nc-element="secondary-nav">
              <div className="Header-nav-inner">
                <Link to="/flying" className="Header-nav-item">Flying</Link>
                <Link to="/training" className="Header-nav-item">Training</Link>
                <span className="Header-nav-item Header-nav-item--folder">
                  <Link to="/expeditions" className="Header-nav-folder-title">Exploration</Link>
                  <span className="Header-nav-folder">
                    <Link to="/helicopter-tour-of-london" className="Header-nav-folder-item">Tour of London</Link>
                    <Link to="/expeditions" className="Header-nav-folder-item">Worldwide Expeditions</Link>
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
function Reveal({ children, delay = 0, direction = 'up', duration = 0.8, amount = 0.2 }) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount });

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

// London landmarks gallery data
const galleryImages = [
  { src: '/assets/images/gallery/london-tour/buckingham-palace.jpg', alt: 'Helicopter over St James\'s Park with Buckingham Palace', caption: 'Buckingham Palace' },
  { src: '/assets/images/gallery/london-tour/thames-city-skyline.jpg', alt: 'Aerial view of the Thames toward the City of London', caption: 'Thames & City' },
  { src: '/assets/images/gallery/london-tour/canary-wharf.jpg', alt: 'Aerial view of Canary Wharf and the O2 Arena', caption: 'Canary Wharf' },
  { src: '/assets/images/gallery/london-tour/above-westminster.jpg', alt: 'Helicopter over the Thames above Westminster', caption: 'Above Westminster' },
];

// Tour highlights data
const tourHighlights = [
  { icon: 'fa-clock', title: '~50 Minutes', desc: 'Flight time over London' },
  { icon: 'fa-route', title: 'West to East and back West', desc: 'Full Loop of the London Skyline' },
  { icon: 'fa-champagne-glasses', title: 'Champagne', desc: 'Welcome reception included' },
  { icon: 'fa-helicopter', title: 'Turbine R66', desc: 'Premium helicopter experience' },
];

// Landmarks you'll see
const landmarks = [
  'Tower Bridge',
  'The Shard',
  'London Eye',
  'Big Ben',
  'Buckingham Palace',
  'St Paul\'s Cathedral',
  'Canary Wharf',
  'Olympic Park',
  'Greenwich',
  'The O2 Arena',
];


function LondonTourVideo() {
  const [videoMuted, setVideoMuted] = useState(true);
  const [videoPaused, setVideoPaused] = useState(false);
  const [videoProgress, setVideoProgress] = useState(0);
  const [controlsVisible, setControlsVisible] = useState(false);
  const videoRef = useRef(null);
  const containerRef = useRef(null);
  const controlsTimerRef = useRef(null);

  const showControls = () => {
    setControlsVisible(true);
    clearTimeout(controlsTimerRef.current);
    controlsTimerRef.current = setTimeout(() => setControlsVisible(false), 3000);
  };

  useEffect(() => {
    const el = containerRef.current;
    const v = videoRef.current;
    if (!el || !v) return;
    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !videoPaused) v.play().catch(() => {});
        else v.pause();
      },
      { threshold: 0.2 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, [videoPaused]);

  useEffect(() => {
    const v = videoRef.current;
    if (!v) return;
    v.muted = videoMuted;
  }, [videoMuted]);

  return (
    <div className="ltour-video" ref={containerRef}>
      <div className={`ltour-video__placeholder${controlsVisible ? ' ltour-video__placeholder--controls-visible' : ''}`}>
        <video
          ref={videoRef}
          className="ltour-video__media"
          src="/assets/videos/over-london-night.mp4"
          autoPlay
          muted
          loop
          playsInline
          preload="metadata"
          onTimeUpdate={(e) => {
            const dur = e.currentTarget.duration;
            if (dur > 0) setVideoProgress(e.currentTarget.currentTime / dur);
          }}
        />
        <div
          style={{ position: 'absolute', inset: 0, zIndex: 2, cursor: 'pointer' }}
          onPointerDown={(e) => { e.currentTarget.dataset.startX = e.clientX; e.currentTarget.dataset.startY = e.clientY; }}
          onPointerUp={(e) => {
            const dx = Math.abs(e.clientX - Number(e.currentTarget.dataset.startX || 0));
            const dy = Math.abs(e.clientY - Number(e.currentTarget.dataset.startY || 0));
            if (dx > 10 || dy > 10) return;
            showControls();
            const v = videoRef.current;
            if (!v) return;
            if (videoPaused) { v.play().catch(() => {}); setVideoPaused(false); }
            else { v.pause(); setVideoPaused(true); }
          }}
        />
        <button
          className="ltour-video__mute-btn"
          onClick={() => setVideoMuted(m => !m)}
          aria-label={videoMuted ? 'Unmute' : 'Mute'}
        >
          {videoMuted ? (
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M11 5L6 9H2v6h4l5 4V5z"/><line x1="23" y1="9" x2="17" y2="15"/><line x1="17" y1="9" x2="23" y2="15"/></svg>
          ) : (
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M11 5L6 9H2v6h4l5 4V5z"/><path d="M15.54 8.46a5 5 0 010 7.07"/></svg>
          )}
        </button>
        <div className="ltour-video__controls" onPointerDown={showControls}>
          <button
            className="ltour-video__vc-btn"
            onClick={() => {
              const v = videoRef.current;
              if (!v) return;
              if (videoPaused) { v.play().catch(() => {}); setVideoPaused(false); }
              else { v.pause(); setVideoPaused(true); }
            }}
            aria-label={videoPaused ? 'Play' : 'Pause'}
          >
            {videoPaused ? (
              <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M8 5v14l11-7z"/></svg>
            ) : (
              <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><rect x="6" y="4" width="4" height="16"/><rect x="14" y="4" width="4" height="16"/></svg>
            )}
          </button>
          <div
            className="ltour-video__vc-progress"
            onClick={(e) => {
              const v = videoRef.current;
              if (!v || !v.duration) return;
              const rect = e.currentTarget.getBoundingClientRect();
              const ratio = (e.clientX - rect.left) / rect.width;
              v.currentTime = ratio * v.duration;
            }}
          >
            <div className="ltour-video__vc-progress-fill" style={{ width: `${videoProgress * 100}%` }} />
          </div>
        </div>
      </div>
    </div>
  );
}

function HelicopterTourOfLondon() {
  const heroRef = useRef(null);
  const [openFaq, setOpenFaq] = useState(null);
  const [showAllFaqs, setShowAllFaqs] = useState(false);

  const highlightsRef = useRef(null);
  const [highlightIdx, setHighlightIdx] = useState(0);
  const { faqs } = useFaqs('helicopter-tour', { visibleOnly: true });
  const pageImages = usePageImages('helicopter-tour');
  useCmsHighlight();

  // Scroll to top on mount
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ['start start', 'end start'],
  });

  const heroOpacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);
  const heroScale = useTransform(scrollYProgress, [0, 0.5], [1, 0.95]);

  return (
    <div className="ltour">
      <Seo
        title="Helicopter Tour of London — 30 Minutes Over the City"
        description="Take a 30-minute aerial tour over central London by Robinson R44 from Denham Aerodrome. London Eye, Tower Bridge, Canary Wharf — see the city as a pilot does."
        ogImage="/assets/images/gallery/london-tour/above-westminster.jpg"
        ogType="product"
        jsonLd={[
          buildProduct({
            name: 'Helicopter Tour of London',
            description: 'A 30-minute aerial tour over central London by Robinson R44 from Denham Aerodrome.',
            image: '/assets/images/gallery/london-tour/above-westminster.jpg',
            brand: 'HQ Aviation',
            url: `${SITE_URL}/helicopter-tour-of-london`,
            offers: {
              price: '395',
              priceCurrency: 'GBP',
              availability: 'https://schema.org/InStock',
              valueAddedTaxIncluded: false,
            },
          }),
          buildTouristTrip({
            name: 'Helicopter Tour of London',
            description: 'A 30-minute aerial tour over central London by Robinson R44 from Denham Aerodrome.',
            image: '/assets/images/gallery/london-tour/above-westminster.jpg',
            url: `${SITE_URL}/helicopter-tour-of-london`,
            offers: {
              price: '395',
              priceCurrency: 'GBP',
              availability: 'https://schema.org/InStock',
            },
          }),
          buildBreadcrumbList([
            { name: 'Home', path: '/' },
            { name: 'Helicopter Tour of London', path: '/helicopter-tour-of-london' },
          ]),
        ]}
      />
      <TourHeader />

      {/* ========== HERO SECTION ========== */}
      <section ref={heroRef} className="ltour-hero" data-cms-section="helicopter-tour-hero">
        <motion.div
          className="ltour-hero__bg"
          initial={{ scale: 1.1, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 1.5 }}
        >
          <img src={pageImages['helicopter-tour-hero']?.[0]?.url || '/assets/images/gallery/flying/flying-.jpg'} alt="London aerial view" width={2500} height={1667} />
        </motion.div>
        <div className="ltour-hero__overlay" />

        <motion.div
          className="ltour-hero__content"
          style={{ opacity: heroOpacity, scale: heroScale }}
        >
          <div className="ltour-hero__text">
            <motion.span
              className="ltour-hero__label"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              HELICOPTER EXPERIENCE
            </motion.span>

            <div className="ltour-hero__headline">
              <motion.span
                className="ltour-hero__word ltour-hero__word--1"
                initial={{ opacity: 0, y: 40 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.4, ease: [0.16, 1, 0.3, 1] }}
              >
                LONDON
              </motion.span>
              <motion.span
                className="ltour-hero__word ltour-hero__word--2"
                initial={{ opacity: 0, y: 40 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.6, ease: [0.16, 1, 0.3, 1] }}
              >
                FROM
              </motion.span>
              <motion.span
                className="ltour-hero__word ltour-hero__word--3"
                initial={{ opacity: 0, y: 40 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.8, ease: [0.16, 1, 0.3, 1] }}
              >
                ABOVE
              </motion.span>
            </div>

            <motion.div
              className="ltour-hero__divider-line"
              initial={{ scaleX: 0 }}
              animate={{ scaleX: 1 }}
              transition={{ duration: 0.8, delay: 1, ease: [0.16, 1, 0.3, 1] }}
            />

            <motion.p
              className="ltour-hero__sub"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.2 }}
            >
              Experience the world's most iconic skyline from a unique vantage point.
              Soar over Tower Bridge, The Shard, Big Ben, and more aboard our Robinson R66 Turbine helicopter.
            </motion.p>
          </div>

        </motion.div>
      </section>

      {/* ========== INTRO SECTION ========== */}
      <section className="ltour-intro">
        <div className="ltour-intro__container">
          <div className="ltour-intro__row">
            <div className="ltour-intro__copy">
              <Reveal>
                <div className="ltour-intro__header">
                  <span className="ltour-pre-text">The Experience</span>
                  <h2>
                    <span className="ltour-text--dark">Unforgettable Views</span>
                  </h2>
                </div>
              </Reveal>
              <p className="ltour-intro__p1">
                Take to the skies over one of the most impressive skylines in the world.
                With our airfield located within Greater London, we are just a short hop from
                a beautiful skyline and an unforgettable flight experience.
              </p>

              <div className="ltour-intro__highlights-wrap">
                <div
                  className="ltour-intro__highlights"
                  ref={highlightsRef}
                  onScroll={e => {
                    const el = e.currentTarget;
                    const idx = Math.round(el.scrollLeft / el.clientWidth);
                    if (idx !== highlightIdx) setHighlightIdx(idx);
                  }}
                >
                  {tourHighlights.map((item, i) => (
                    <Reveal key={i} delay={i * 0.05} duration={0.35} amount={0.05}>
                      <motion.div
                        className="ltour-intro__highlight"
                        whileHover={{ y: -3 }}
                        transition={{ type: 'spring', stiffness: 400 }}
                      >
                        <i className={`fas ${item.icon}`}></i>
                        <h4>{item.title}</h4>
                        <p>{item.desc}</p>
                      </motion.div>
                    </Reveal>
                  ))}
                </div>
                <div className="ltour-intro__highlights-dots">
                  {tourHighlights.map((_, i) => (
                    <span key={i} className={`ltour-intro__highlights-dot${highlightIdx === i ? ' ltour-intro__highlights-dot--active' : ''}`} />
                  ))}
                </div>
              </div>

              <p className="ltour-intro__p2">
                Spanning the length of London from East to West and back again, you'll observe
                in stunning detail the whole of London, from its historic landmarks to its modern marvels.
              </p>

              <Reveal delay={0.3}>
                <div className="ltour-landmarks__ticket">
                  <LondonTourTicket />
                </div>
              </Reveal>

              <p className="ltour-intro__cta-desc">
                Whether you're celebrating a special occasion or simply want an unforgettable experience,
                our London helicopter tour is the perfect choice.
              </p>
              <p className="ltour-intro__cta-desc">
                Contact us to book your flight today.
              </p>
              <div className="ltour-intro__cta-note">
                <strong>Gift Vouchers Available.</strong> The perfect present for aviation enthusiasts
              </div>
            </div>

            <div className="ltour-intro__video-wrap">
              <Reveal delay={0.15}>
                <LondonTourVideo />
              </Reveal>
            </div>
          </div>
        </div>
      </section>

      {/* ========== GALLERY SECTION ========== */}
      <section className="ltour-gallery" data-cms-section="helicopter-tour-gallery">
        <div className="ltour-gallery__heading">
          <span className="ltour-pre-text">Your Flight Path</span>
          <h2>
            <span className="ltour-text--dark">Iconic</span>{' '}
            <span className="ltour-text--light">Landmarks</span>
          </h2>
        </div>
        <div className="ltour-gallery__track">
          {galleryImages.map((img, i) => (
            <motion.div
              key={i}
              className="ltour-gallery__item"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1, ease: [0.16, 1, 0.3, 1] }}
              viewport={{ once: true }}
            >
              <img src={pageImages['helicopter-tour-gallery']?.[i]?.url || img.src} alt={pageImages['helicopter-tour-gallery']?.[i]?.alt || img.alt} width={2500} height={1667} />
              <span className="ltour-gallery__caption">{img.caption}</span>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ========== FAQ SECTION ========== */}
      <section className="ltour-faq" data-cms-section="faqs-helicopter-tour">
        <div className="ltour-faq__container">
          <Reveal>
            <div className="ltour-section-header">
              <span className="ltour-pre-text">Common Questions</span>
              <h2>
                <span className="ltour-text--dark">Frequently</span>{' '}
                <span className="ltour-text--mid">Asked</span>{' '}
                <span className="ltour-text--light">Questions</span>
              </h2>
            </div>
          </Reveal>

          <div className="ltour-faq__list">
            {(showAllFaqs ? faqs : faqs.slice(0, 6)).map((faq, i) => (
              <Reveal key={faq.id || i} delay={i * 0.1}>
                <div
                  className={`ltour-faq__item ${openFaq === i ? 'ltour-faq__item--open' : ''}`}
                  onClick={() => setOpenFaq(openFaq === i ? null : i)}
                >
                  <div className="ltour-faq__number">{String(i + 1).padStart(2, '0')}</div>
                  <div className="ltour-faq__content">
                    <h4>
                      {faq.question}
                      <span className="ltour-faq__toggle">{openFaq === i ? '−' : '+'}</span>
                    </h4>
                    <motion.div
                      className="ltour-faq__answer"
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
          {!showAllFaqs && faqs.length > 6 && (
            <button className="ltour-faq__load-more" onClick={() => setShowAllFaqs(true)}>Load More</button>
          )}
        </div>
      </section>

      {/* ========== FOOTER ========== */}
      <FooterMinimal />

      {/* ========== STYLES ========== */}
      <style>{`
        /* ===== BASE ===== */
        .ltour {
          font-family: 'Space Grotesk', -apple-system, sans-serif;
          background: #faf9f6;
          color: #1a1a1a;
          overflow-x: clip;
        }

        .ltour-pre-text {
          display: block;
          font-size: 0.7rem;
          text-transform: uppercase;
          letter-spacing: 0.25em;
          color: #999;
          margin-bottom: 1rem;
        }

        .ltour-text--dark { color: #1a1a1a; }
        .ltour-text--mid { color: #4a4a4a; }
        .ltour-text--light { color: #7a7a7a; }

        .ltour-section-header {
          text-align: center;
          max-width: 700px;
          margin: 0 auto 3rem;
        }

        .ltour-section-header h2 {
          font-size: clamp(2rem, 4vw, 3rem);
          margin: 0.5rem 0;
          line-height: 1.1;
          text-transform: uppercase;
          font-weight: 700;
        }

        /* Buttons */
        .ltour-btn {
          display: inline-flex;
          align-items: center;
          gap: 0.5rem;
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
        }

        .ltour-btn--primary {
          background: #1a1a1a;
          color: #fff;
        }

        .ltour-btn--primary:hover {
          background: #333;
          color: #fff;
          transform: translateY(-2px);
        }

        .ltour-btn--outline {
          background: transparent;
          color: #fff;
          border: 2px solid rgba(255,255,255,0.5);
        }

        .ltour-btn--outline:hover {
          background: rgba(255,255,255,0.1);
          border-color: #fff;
        }

        /* ===== HERO ===== */
        .ltour-hero {
          min-height: 100vh;
          position: relative;
          display: flex;
          align-items: center;
          overflow: hidden;
        }

        .ltour-hero__bg {
          position: absolute;
          inset: 0;
          z-index: 1;
        }

        .ltour-hero__bg img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }

        .ltour-hero__overlay {
          position: absolute;
          inset: 0;
          z-index: 2;
          background: linear-gradient(90deg, rgba(250,249,246,0.92) 0%, rgba(250,249,246,0.88) 30%, rgba(250,249,246,0.3) 65%, rgba(250,249,246,0) 100%);
        }

        .ltour-hero__content {
          position: relative;
          z-index: 3;
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 4rem;
          width: 100%;
          max-width: 1400px;
          margin: 0 auto;
          padding: 6rem 4rem 4rem;
        }

        .ltour-hero__text {
          max-width: 500px;
        }

        .ltour-hero__label {
          font-size: 0.7rem;
          font-weight: 400;
          letter-spacing: 0.2em;
          text-transform: uppercase;
          color: #999;
          display: block;
          margin-bottom: 1.5rem;
        }

        .ltour-hero__headline {
          display: flex;
          flex-direction: column;
          line-height: 1;
          margin-bottom: 1.5rem;
        }

        .ltour-hero__word {
          font-weight: 700;
          font-size: clamp(2.5rem, 6vw, 4.5rem);
          letter-spacing: -0.02em;
          text-transform: uppercase;
        }

        .ltour-hero__word--1 { color: #1a1a1a; }
        .ltour-hero__word--2 { color: #4a4a4a; }
        .ltour-hero__word--3 { color: #7a7a7a; }

        .ltour-hero__divider-line {
          width: 80px;
          height: 2px;
          background: #1a1a1a;
          margin-bottom: 1.5rem;
          transform-origin: left;
        }

        .ltour-hero__sub {
          font-size: 1rem;
          color: #666;
          line-height: 1.8;
          max-width: 420px;
        }

        /* ===== INTRO ===== */
        .ltour-intro {
          padding: 5rem 2rem;
          background: #fff;
        }

        .ltour-intro__container {
          max-width: 1100px;
          margin: 0 auto;
          display: flex;
          flex-direction: column;
        }

        .ltour-intro__header {
          text-align: center;
          max-width: 800px;
          margin: 0 auto 3rem;
        }

        .ltour-intro__header h2 {
          font-size: clamp(1.75rem, 3.5vw, 2.5rem);
          margin: 0.5rem 0 1.5rem;
          text-transform: uppercase;
          font-weight: 700;
        }

        .ltour-intro__row {
          display: grid;
          grid-template-columns: minmax(0, 1fr) minmax(0, 380px);
          gap: 3rem;
          align-items: start;
        }

        .ltour-intro__copy { grid-column: 1; }
        .ltour-intro__video-wrap {
          grid-column: 2;
          position: sticky;
          top: max(10vh, var(--catch-top, 90px));
          align-self: start;
        }

        .ltour-intro__row .ltour-video {
          max-width: 380px;
          width: 100%;
          margin-left: auto;
          margin-right: auto;
        }

        .ltour-intro__copy {
          display: flex;
          flex-direction: column;
          gap: 1.5rem;
        }

        .ltour-intro__copy > .ltour-intro__header {
          margin: 0;
          max-width: none;
          text-align: left;
        }

        .ltour-intro__copy > p {
          color: #666;
          font-size: 1rem;
          line-height: 1.8;
          margin: 0;
        }

        .ltour-intro__cta-desc {
          padding-top: 24px;
        }

        .ltour-intro__cta-desc + .ltour-intro__cta-desc {
          padding-top: 0;
        }

        .ltour-intro__cta-note {
          font-size: 0.8rem;
          color: #666;
          padding: 0.85rem 1rem;
          background: #faf9f6;
          border-left: 3px solid #b38728;
          border-radius: 4px;
        }

        .ltour-intro__cta-note strong {
          color: #1a1a1a;
        }

        .ltour-intro__copy .ltour-intro__highlights-wrap {
          margin-top: 0.5rem;
        }

        .ltour-intro__copy .ltour-intro__highlights {
          grid-template-columns: repeat(auto-fit, minmax(130px, 1fr));
          gap: 0.75rem;
        }

        .ltour-intro__copy .ltour-intro__highlight {
          padding: 1rem 0.75rem;
        }

        .ltour-intro__highlights-wrap {
          position: relative;
        }


        .ltour-intro__highlights-dots {
          display: none;
          justify-content: center;
          gap: 6px;
          padding-top: 14px;
        }

        .ltour-intro__highlights-dot {
          width: 6px;
          height: 6px;
          border-radius: 50%;
          background: #ccc8c1;
          transition: background 0.2s;
        }

        .ltour-intro__highlights-dot--active {
          background: #1a1a1a;
        }

        .ltour-intro__highlights {
          display: grid;
          grid-template-columns: repeat(5, 1fr);
          gap: 1.5rem;
          align-items: stretch;
        }

        .ltour-intro__highlights > * {
          display: flex;
        }

        .ltour-intro__highlight {
          text-align: center;
          padding: 1.5rem 1rem;
          background: #faf9f6;
          border: 1px solid #e8e6e2;
          border-radius: 8px;
          width: 100%;
        }

        .ltour-intro__highlight i {
          font-size: 1.5rem;
          color: #1a1a1a;
          margin-bottom: 1rem;
        }

        .ltour-intro__highlight h4 {
          font-size: 0.9rem;
          font-weight: 700;
          margin: 0 0 0.5rem;
          text-transform: uppercase;
        }

        .ltour-intro__highlight p {
          font-size: 0.75rem;
          color: #888;
          margin: 0;
        }

        /* ===== INTRO VIDEO ===== */
        .ltour-video {
          max-width: 380px;
          margin: 2rem auto 3rem;
        }

        .ltour-video__placeholder {
          position: relative;
          aspect-ratio: 478 / 850;
          background: #111;
          overflow: hidden;
          border-radius: 12px;
          box-shadow: 0 20px 60px rgba(0,0,0,0.15);
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .ltour-video__media {
          display: block;
          max-width: 100%;
          max-height: 100%;
          width: auto;
          height: auto;
          margin: auto;
        }

        .ltour-video__mute-btn {
          position: absolute;
          bottom: 12px;
          right: 12px;
          z-index: 4;
          background: rgba(0,0,0,0.45);
          border: none;
          border-radius: 50%;
          width: 34px;
          height: 34px;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          color: rgba(255,255,255,0.85);
          backdrop-filter: blur(8px);
          -webkit-backdrop-filter: blur(8px);
          transition: background 0.2s, color 0.2s;
        }

        .ltour-video__mute-btn:hover {
          background: rgba(0,0,0,0.65);
          color: #fff;
        }

        .ltour-video__controls {
          position: absolute;
          bottom: 10px;
          left: 10px;
          right: 56px;
          z-index: 3;
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 6px 10px;
          background: rgba(0,0,0,0.35);
          backdrop-filter: blur(12px);
          -webkit-backdrop-filter: blur(12px);
          border-radius: 8px;
          opacity: 0;
          transition: opacity 0.3s;
        }

        .ltour-video__placeholder:hover .ltour-video__controls,
        .ltour-video__placeholder--controls-visible .ltour-video__controls {
          opacity: 1;
        }

        .ltour-video__vc-btn {
          background: none;
          border: none;
          color: rgba(255,255,255,0.85);
          cursor: pointer;
          padding: 4px;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
          transition: color 0.2s;
        }

        .ltour-video__vc-btn:hover { color: #fff; }

        .ltour-video__vc-progress {
          flex: 1;
          height: 3px;
          background: rgba(255,255,255,0.2);
          border-radius: 2px;
          cursor: pointer;
        }

        .ltour-video__vc-progress-fill {
          height: 100%;
          background: rgba(255,255,255,0.7);
          border-radius: 2px;
          transition: width 0.3s linear;
        }

        /* ===== GALLERY ===== */
        .ltour-gallery {
          width: 100vw;
          position: relative;
          left: 50%;
          transform: translateX(-50%);
          overflow: hidden;
        }

        .ltour-gallery__heading {
          display: none;
        }

        .ltour-gallery__track {
          display: flex;
          gap: 4px;
        }

        .ltour-gallery__item {
          flex: 1;
          min-width: 0;
          aspect-ratio: 16/10;
          overflow: hidden;
          position: relative;
        }

        .ltour-gallery__item img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          transition: transform 0.6s ease;
        }

        .ltour-gallery__item:hover img {
          transform: scale(1.05);
        }

        .ltour-gallery__caption {
          position: absolute;
          bottom: 0;
          left: 0;
          right: 0;
          padding: 2rem 1rem 1rem;
          background: linear-gradient(to top, rgba(0,0,0,0.7), transparent);
          color: #fff;
          font-size: 0.75rem;
          text-transform: uppercase;
          letter-spacing: 0.1em;
        }

        /* ===== LANDMARKS ===== */
        .ltour-landmarks {
          padding: 1.5rem 1rem 4rem;
          background: #faf9f6;
        }

        .ltour-landmarks__container {
          max-width: 900px;
          margin: 0 auto;
        }

        .ltour-landmarks__grid {
          display: grid;
          grid-template-columns: repeat(5, 1fr);
          gap: 1px;
          background: #e8e6e2;
          border-radius: 8px;
          overflow: hidden;
        }

        .ltour-landmarks__item {
          background: #fff;
          padding: 1.25rem;
          display: flex;
          align-items: center;
          gap: 1rem;
          cursor: default;
        }

        .ltour-landmarks__num {
          font-family: 'Share Tech Mono', monospace;
          font-size: 0.7rem;
          color: #ccc;
        }

        .ltour-landmarks__name {
          font-size: 0.85rem;
          font-weight: 500;
        }

        .ltour-landmarks__ticket {
          max-width: 900px;
          margin: 0 auto 0;
          padding-top: 3rem;
          border-top: 1px solid #e8e6e2;
        }

        /* ===== FAQ ===== */
        .ltour-faq {
          padding: 5rem 2rem;
          background: #fff;
        }

        .ltour-faq__container {
          max-width: 800px;
          margin: 0 auto;
        }

        .ltour-faq__list {
          display: flex;
          flex-direction: column;
        }

        .ltour-faq__load-more { margin-top: 1.5rem; display: block; width: 100%; padding: 0.9rem 1.5rem; background: transparent; border: 1px solid #1a1a1a; color: #1a1a1a; font-family: 'Share Tech Mono', monospace; font-size: 0.72rem; letter-spacing: 0.12em; text-transform: uppercase; cursor: pointer; transition: background 0.2s ease, color 0.2s ease; }
        .ltour-faq__load-more:hover { background: #1a1a1a; color: #fff; }

        .ltour-faq__item {
          display: flex;
          gap: 1.5rem;
          padding: 1.25rem 0;
          border-bottom: 1px solid #e8e6e2;
          cursor: pointer;
          transition: background 0.2s ease;
        }

        .ltour-faq__item:hover {
          background: rgba(0,0,0,0.01);
        }

        .ltour-faq__item--open {
          background: rgba(0,0,0,0.02);
        }

        .ltour-faq__number {
          font-family: 'Share Tech Mono', monospace;
          font-size: 0.75rem;
          color: #ccc;
          flex-shrink: 0;
          padding-top: 0.1rem;
        }

        .ltour-faq__content {
          flex: 1;
        }

        .ltour-faq__content h4 {
          margin: 0;
          font-size: 1rem;
          font-weight: 600;
          display: flex;
          justify-content: space-between;
          align-items: center;
          gap: 1rem;
        }

        .ltour-faq__toggle {
          font-size: 1.25rem;
          font-weight: 300;
          color: #999;
          flex-shrink: 0;
        }

        .ltour-faq__answer {
          overflow: hidden;
        }

        .ltour-faq__answer p {
          margin: 0.75rem 0 0;
          color: #666;
          line-height: 1.7;
          font-size: 0.95rem;
        }

        /* ===== CTA ===== */
        .ltour-cta {
          background: #3a3a3a;
          position: relative;
          overflow: hidden;
        }

        .ltour-cta__inner {
          display: grid;
          grid-template-columns: 1fr 1fr;
          min-height: 500px;
        }

        .ltour-cta__image {
          position: relative;
          overflow: hidden;
        }

        .ltour-cta__image img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }

        .ltour-cta__image-overlay {
          position: absolute;
          inset: 0;
          background: linear-gradient(90deg, rgba(26,26,26,0.3) 0%, transparent 50%);
        }

        .ltour-cta__content {
          padding: 4rem;
          display: flex;
          flex-direction: column;
          justify-content: center;
          color: #fff;
        }

        .ltour-cta__content .ltour-pre-text {
          color: rgba(255,255,255,0.5);
        }

        .ltour-cta__header h2 {
          font-size: clamp(1.75rem, 3.5vw, 2.5rem);
          font-weight: 700;
          text-transform: uppercase;
          line-height: 1.1;
          margin: 0 0 1.5rem;
        }

        .ltour-cta__header .ltour-text--dark { color: #fff; }
        .ltour-cta__header .ltour-text--mid { color: rgba(255,255,255,0.7); }
        .ltour-cta__header .ltour-text--light { color: rgba(255,255,255,0.5); }

        .ltour-cta__desc {
          color: rgba(255,255,255,0.7);
          font-size: 1rem;
          line-height: 1.7;
          margin-bottom: 2rem;
          max-width: 450px;
        }

        .ltour-cta__actions {
          display: flex;
          gap: 1rem;
          margin-bottom: 2rem;
        }

        .ltour-cta__note {
          font-size: 0.8rem;
          color: rgba(255,255,255,0.5);
          padding: 1rem;
          background: rgba(255,255,255,0.05);
          border-left: 3px solid rgba(255,255,255,0.2);
        }

        .ltour-cta__note strong {
          color: #fff;
        }

        /* ===== RESPONSIVE ===== */
        @media (max-width: 1200px) {
          .ltour-hero__content {
            flex-direction: column;
            text-align: center;
            padding: 8rem 2rem 4rem;
          }

          .ltour-hero__text {
            max-width: 600px;
          }

          .ltour-hero__headline {
            align-items: center;
          }

          .ltour-hero__divider-line {
            margin: 1.5rem auto;
          }

          .ltour-hero__sub {
            margin: 0 auto;
          }

          .ltour-hero__overlay {
            background: linear-gradient(180deg, rgba(250,249,246,0.45) 0%, rgba(250,249,246,0.92) 28%, rgba(250,249,246,0.92) 78%, rgba(250,249,246,0.35) 100%);
          }
        }

        @media (max-width: 1024px) {
          .ltour-intro__highlights {
            grid-template-columns: repeat(3, 1fr);
          }

          .ltour-landmarks__grid {
            grid-template-columns: repeat(2, 1fr);
          }

          .ltour-cta__inner {
            grid-template-columns: 1fr;
          }

          .ltour-cta__image {
            display: none;
          }

          .ltour-cta__content {
            padding: 3rem 2rem;
          }

          .ltour-cta__actions {
            flex-direction: column;
          }

          .ltour-btn {
            justify-content: center;
          }
        }

        @media (max-width: 768px) {
          .ltour-intro {
            padding-bottom: 0.875rem;
            padding-left: 1rem;
            padding-right: 1rem;
          }

          .ltour-intro__header {
            margin-bottom: 0;
          }

          .ltour-intro__row {
            display: flex;
            flex-direction: column;
            gap: 1.5rem;
            margin-bottom: 1.5rem;
          }

          .ltour-intro__copy {
            display: contents;
          }

          .ltour-intro__row > *,
          .ltour-intro__copy > * {
            min-width: 0;
            max-width: 100%;
          }

          .ltour-intro__video-wrap {
            min-width: 0;
            align-self: stretch;
          }

          .ltour-intro__highlights-wrap {
            align-self: stretch;
          }

          /* Mobile order: header → p1 → video → p2 → ticket → cta-desc1 → cta-note → cta-desc2 → highlights */
          .ltour-intro__copy > div:has(> .ltour-intro__header) { order: 1; }
          .ltour-intro__p1 { order: 2; }
          .ltour-intro__video-wrap { order: 3; }
          .ltour-intro__p2 { order: 4; }
          .ltour-intro__copy > div:has(> .ltour-landmarks__ticket) { order: 5; }
          .ltour-intro__cta-desc:has(+ .ltour-intro__cta-desc) { order: 6; }
          .ltour-intro__cta-note { order: 7; }
          .ltour-intro__cta-desc + .ltour-intro__cta-desc { order: 8; }
          .ltour-intro__highlights-wrap { order: 9; }

          .ltour-intro__copy .ltour-landmarks__ticket {
            max-width: 100%;
          }

          .ltour-intro__copy .london-ticket {
            width: 100%;
            max-width: 100%;
          }

          .ltour-intro__copy .ticket-wrapper {
            max-width: 100%;
          }

          .ltour-intro__video-wrap {
            position: static;
            top: auto;
          }

          .ltour-intro__row .ltour-video {
            height: 70vh;
            aspect-ratio: 478 / 850;
            width: auto;
            max-width: 100%;
            margin: 1rem auto 3rem;
          }

          .ltour-intro__row .ltour-video__placeholder {
            width: 100%;
            height: 100%;
            aspect-ratio: auto;
            border: 1px solid rgba(0, 0, 0, 0.12);
          }

          .ltour-intro__copy > p {
            text-align: left;
          }

          .ltour-section-header {
            margin-bottom: 1.5rem;
          }

          .ltour-intro__highlights-dots {
            display: flex;
          }

          .ltour-intro__highlights {
            display: flex;
            overflow-x: auto;
            overflow-y: hidden;
            -webkit-overflow-scrolling: touch;
            scrollbar-width: none;
            scroll-snap-type: x mandatory;
            gap: 1rem;
          }

          .ltour-intro__highlights::-webkit-scrollbar {
            display: none;
          }

          .ltour-intro__highlights > * {
            flex: 0 0 100%;
            flex-shrink: 0;
            scroll-snap-align: start;
          }

          .ltour-intro__highlight {
            padding: 1.25rem 1rem;
          }

          .ltour-intro__highlight i {
            font-size: 1.25rem;
            margin-bottom: 0.6rem;
          }

          .ltour-intro__highlight h4 {
            font-size: 0.85rem;
            margin-bottom: 0.3rem;
          }

          .ltour-intro__highlight p {
            font-size: 0.72rem;
          }

          .ltour-gallery__heading {
            display: block;
            text-align: center;
            padding: 2.5rem 1rem 1.5rem;
          }

          .ltour-gallery__heading h2 {
            font-size: clamp(1.5rem, 6vw, 2rem);
            margin: 0.5rem 0 0;
            text-transform: uppercase;
            font-weight: 700;
          }

          .ltour-gallery__track {
            flex-direction: column;
          }

          .ltour-gallery__item {
            aspect-ratio: 16/9;
          }

          .ltour-faq__item {
            gap: 0.75rem;
          }
        }

        @media (max-width: 480px) {
          .ltour-landmarks {
            padding-bottom: 24px;
          }

          .ltour-landmarks__grid {
            grid-template-columns: 1fr;
          }

          .ltour-hero__word {
            font-size: 2.5rem;
          }
        }
      `}</style>
    </div>
  );
}

export default HelicopterTourOfLondon;

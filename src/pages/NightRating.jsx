/**
 * NIGHT RATING PAGE
 *
 * A comprehensive page for pilots who want to extend their flying
 * privileges beyond sunset with a Night Rating qualification.
 *
 * Brand: Luxury Minimal Aviation
 * Typography: Space Grotesk + Share Tech Mono
 * Theme: Dark starfield (inspired by FloatingStars component)
 */

import React, { useRef, useEffect, useState, useMemo } from 'react';
import { useFaqs } from '../hooks/useFaqs';
import { Link } from 'react-router-dom';
import { motion, useInView, useScroll, useTransform, AnimatePresence } from 'framer-motion';

// Import styles for Header/Navigation
import '../assets/css/main.css';
import '../assets/css/components.css';

// Import FooterMinimal component
import FooterMinimal from '../components/FooterMinimal';

/**
 * NIGHT RATING PAGE HEADER COMPONENT
 * Spotlight animation header consistent with other final pages
 * Uses light-on-dark colors for the dark-themed hero
 */
function NightRatingHeader() {
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
              <li><Link to="/training/night-rating" onClick={closeMenu}>Night Rating</Link></li>
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

// Generate random stars for the hero starfield
function generateStars(count) {
  const stars = [];
  for (let i = 0; i < count; i++) {
    const size = Math.random() * 3 + 1;
    stars.push({
      id: i,
      left: `${Math.random() * 100}%`,
      top: `${Math.random() * 100}%`,
      size: `${size}px`,
      animationDelay: `${Math.random() * 5}s`,
      animationDuration: `${Math.random() * 3 + 2}s`,
      opacity: Math.random() * 0.5 + 0.3,
    });
  }
  return stars;
}

function NightRating() {
  const heroRef = useRef(null);
  const [openFaq, setOpenFaq] = useState(null);
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

  // Memoize stars so they don't regenerate on re-render
  const stars = useMemo(() => generateStars(100), []);

  // Training process steps
  const processSteps = [
    {
      num: '01',
      title: 'Ground School',
      duration: '1-2 Days',
      description: 'Comprehensive theory covering night operations, visual illusions, spatial disorientation, physiological factors, equipment requirements, and flight planning considerations specific to night flying.',
    },
    {
      num: '02',
      title: 'Dual Night Circuits',
      duration: '2-3 Hours',
      description: 'Circuit work at Denham Aerodrome with its excellent lighting systems. Learn to judge height and distance using runway lights, develop night scan patterns, and practise approaches and landings in altered visual conditions.',
    },
    {
      num: '03',
      title: 'Night Navigation',
      duration: '2-3 Hours',
      description: 'Cross-country navigation exercises learning to read a new landscape of lights — towns, motorways, and illuminated features. Includes flight to and from another aerodrome and emergency procedures training.',
    },
    {
      num: '04',
      title: 'Skills Test',
      duration: '1-2 Hours',
      description: 'Final assessment with a CAA examiner demonstrating your ability to handle all aspects of night operations safely. Upon passing, the Night Rating is entered in your licence.',
    },
  ];

  const { faqs } = useFaqs('night-rating', { visibleOnly: true });

  // Prerequisites
  const prerequisites = [
    { icon: '01', label: 'PPL(H) Holder', description: 'Valid Private Pilot Licence for Helicopters' },
    { icon: '02', label: '100 Hours Total', description: 'Minimum total flight time accumulated' },
    { icon: '03', label: '60 Hours PIC', description: 'As Pilot in Command, demonstrating experience' },
    { icon: '04', label: 'Medical Certificate', description: 'Valid Class 2 medical or LAPL medical' },
  ];

  return (
    <div className="nr">
      <NightRatingHeader />

      {/* ========== HERO SECTION — Dark Starfield ========== */}
      <section ref={heroRef} className="nr-hero">
        {/* Starfield background */}
        <div className="nr-hero__stars">
          {stars.map((star) => (
            <div
              key={star.id}
              className="nr-star"
              style={{
                left: star.left,
                top: star.top,
                width: star.size,
                height: star.size,
                opacity: star.opacity,
                animationDelay: star.animationDelay,
                animationDuration: star.animationDuration,
              }}
            />
          ))}
        </div>

        {/* Moon */}
        <div className="nr-hero__moon" />

        <motion.div
          className="nr-hero__content"
          style={{ opacity: heroOpacity, scale: heroScale, y: heroY }}
        >
          <div className="nr-hero__left">
            <motion.span
              className="nr-hero__label"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              Advanced Training
            </motion.span>

            <div className="nr-hero__headline">
              <motion.span
                className="nr-hero__word nr-hero__word--1"
                initial={{ opacity: 0, y: 40 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.4, ease: [0.16, 1, 0.3, 1] }}
              >
                NIGHT
              </motion.span>
              <motion.span
                className="nr-hero__word nr-hero__word--2"
                initial={{ opacity: 0, y: 40 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.6, ease: [0.16, 1, 0.3, 1] }}
              >
                RATING
              </motion.span>
            </div>

            <motion.div
              className="nr-hero__divider-line"
              initial={{ scaleX: 0 }}
              animate={{ scaleX: 1 }}
              transition={{ duration: 0.8, delay: 0.8, ease: [0.16, 1, 0.3, 1] }}
            />

            {/* Night Rating Badge Card */}
            <motion.div
              className="nr-hero__badge"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1, duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            >
              <div className="nr-hero__badge-header">
                <span className="nr-hero__badge-label">Qualification</span>
                <span className="nr-hero__badge-type">NIGHT RATING</span>
              </div>
              <div className="nr-hero__badge-content">
                <div className="nr-hero__badge-stat">
                  <span className="nr-hero__badge-num">5</span>
                  <span className="nr-hero__badge-desc">Min Flight Hours</span>
                </div>
                <div className="nr-hero__badge-divider" />
                <div className="nr-hero__badge-stat">
                  <span className="nr-hero__badge-num">100</span>
                  <span className="nr-hero__badge-desc">Hrs Post-Licence</span>
                </div>
              </div>
            </motion.div>

            <motion.p
              className="nr-hero__sub"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.2 }}
            >
              Extend your flying beyond sunset. The Night Rating opens a new dimension of aviation —
              cities glittering below, smooth air, quiet radio, and experiences that daylight flying simply cannot match.
            </motion.p>
          </div>
        </motion.div>
      </section>

      {/* ========== OVERVIEW SECTION ========== */}
      <section className="nr-overview">
        <div className="nr-overview__container">
          <Reveal>
            <div className="nr-overview__header">
              <span className="nr-pre-text">Fly After Dark</span>
              <h2>
                <span className="nr-text--dark">Extend</span>{' '}
                <span className="nr-text--mid">Your</span>{' '}
                <span className="nr-text--light">Horizons</span>
              </h2>
              <p>
                The Night Rating is an additional qualification that allows Private Pilot Licence
                holders to exercise the privileges of their licence during the hours of darkness.
                Without this rating, PPL holders are restricted to flight from thirty minutes
                before sunrise to thirty minutes after sunset. The Night Rating removes this
                limitation, opening up the full twenty-four hours of the clock to your flying.
              </p>
            </div>
          </Reveal>

          <div className="nr-overview__grid">
            <Reveal delay={0.1}>
              <div className="nr-overview__card">
                <span className="nr-overview__card-num">01</span>
                <h3>Practical Flexibility</h3>
                <p>
                  No longer must you rush to complete a flight before sunset or cancel because
                  winter daylight hours are too short. Cross-country flights that would be
                  impossible in a single winter day become feasible. Evening departures and
                  arrivals open up entirely new possibilities.
                </p>
              </div>
            </Reveal>
            <Reveal delay={0.2}>
              <div className="nr-overview__card">
                <span className="nr-overview__card-num">02</span>
                <h3>A Different World</h3>
                <p>
                  London viewed from a helicopter at night becomes a living map of light and
                  shadow — the Thames a dark ribbon winding through illuminated streets. The peace of
                  night flying, the radio quieter, the airspace less congested, offers a meditative
                  quality many pilots find profoundly satisfying.
                </p>
              </div>
            </Reveal>
            <Reveal delay={0.3}>
              <div className="nr-overview__card">
                <span className="nr-overview__card-num">03</span>
                <h3>Sharper Skills</h3>
                <p>
                  Night flying demands greater precision, more thorough planning, and heightened
                  situational awareness. Pilots who complete a Night Rating invariably report
                  that their daylight flying improves as well — the disciplines learned at night
                  carry over into all operations.
                </p>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* ========== REQUIREMENTS SECTION ========== */}
      <section className="nr-prereq">
        <div className="nr-prereq__container">
          <Reveal>
            <div className="nr-section-header">
              <span className="nr-pre-text">Before You Begin</span>
              <h2>
                <span className="nr-text--dark">Prerequisites</span>
              </h2>
            </div>
          </Reveal>

          <div className="nr-prereq__grid">
            {prerequisites.map((prereq, i) => (
              <Reveal key={i} delay={i * 0.1}>
                <div className="nr-prereq__card">
                  <div className="nr-prereq__icon">{prereq.icon}</div>
                  <div className="nr-prereq__text">
                    <h4>{prereq.label}</h4>
                    <p>{prereq.description}</p>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>

          <Reveal delay={0.5}>
            <div className="nr-prereq__note">
              <span className="nr-prereq__note-label">Recommendation</span>
              <p>
                Beyond the regulatory minimums, we recommend that students are genuinely comfortable
                with all aspects of daytime flight before beginning night training. Your basic
                handling should be instinctive, your navigation skills reliable, and your general
                airmanship sound. If you have not flown recently, consider a few daytime refresher
                flights first.
              </p>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ========== TRAINING PROCESS ========== */}
      <section className="nr-process">
        <div className="nr-process__container">
          <Reveal>
            <div className="nr-section-header nr-section-header--light">
              <span className="nr-pre-text nr-pre-text--light">The Journey</span>
              <h2>
                <span className="nr-text--white">Training</span>{' '}
                <span className="nr-text--white-mid">Process</span>
              </h2>
            </div>
          </Reveal>

          <div className="nr-process__steps">
            {processSteps.map((step, i) => (
              <Reveal key={i} delay={i * 0.1}>
                <div className="nr-process__step">
                  <div className="nr-process__step-num">{step.num}</div>
                  <div className="nr-process__step-content">
                    <div className="nr-process__step-header">
                      <h4>{step.title}</h4>
                      <span className="nr-process__step-duration">{step.duration}</span>
                    </div>
                    <p>{step.description}</p>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>

          <Reveal delay={0.5}>
            <div className="nr-process__timeline">
              <div className="nr-process__timeline-track">
                {processSteps.map((_, i) => (
                  <React.Fragment key={i}>
                    <div className="nr-process__timeline-dot" />
                    {i < processSteps.length - 1 && <div className="nr-process__timeline-line" />}
                  </React.Fragment>
                ))}
              </div>
              <div className="nr-process__timeline-label">
                <span>Ground School</span>
                <span>5 Hours Flight</span>
                <span>Certified</span>
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ========== FAQ SECTION ========== */}
      <section className="nr-faq" data-cms-section="faqs-night-rating">
        <div className="nr-faq__container">
          <Reveal>
            <div className="nr-section-header">
              <span className="nr-pre-text">Common Questions</span>
              <h2>
                <span className="nr-text--dark">Frequently</span>{' '}
                <span className="nr-text--mid">Asked</span>
              </h2>
            </div>
          </Reveal>

          <div className="nr-faq__list">
            {faqs.map((faq, i) => (
              <Reveal key={faq.id} delay={i * 0.05}>
                <div
                  className={`nr-faq__item ${openFaq === i ? 'nr-faq__item--open' : ''}`}
                  onClick={() => setOpenFaq(openFaq === i ? null : i)}
                >
                  <span className="nr-faq__number">{String(i + 1).padStart(2, '0')}</span>
                  <div className="nr-faq__content">
                    <h4>
                      {faq.question}
                      <span className="nr-faq__toggle">{openFaq === i ? '−' : '+'}</span>
                    </h4>
                    <AnimatePresence>
                      {openFaq === i && (
                        <motion.div
                          className="nr-faq__answer"
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
        </div>
      </section>

      {/* ========== CTA SECTION ========== */}
      <section className="nr-cta">
        <div className="nr-cta__inner">
          <div className="nr-cta__stars">
            {stars.slice(0, 40).map((star) => (
              <div
                key={`cta-${star.id}`}
                className="nr-star"
                style={{
                  left: star.left,
                  top: star.top,
                  width: star.size,
                  height: star.size,
                  opacity: star.opacity * 0.6,
                  animationDelay: star.animationDelay,
                  animationDuration: star.animationDuration,
                }}
              />
            ))}
          </div>
          <div className="nr-cta__content">
            <Reveal>
              <span className="nr-pre-text nr-pre-text--light">Ready to Fly at Night?</span>
              <h2>
                <span className="nr-text--white">Discover the</span>{' '}
                <span className="nr-text--white-mid">Night Sky</span>
              </h2>
              <p>
                Contact our training team to discuss the Night Rating, review your logbook,
                and check whether you meet the prerequisites. Training is typically conducted
                during winter months when early darkness makes scheduling practical.
              </p>
              <div className="nr-cta__buttons">
                <a href="/contact?subject=night-rating" className="nr-btn nr-btn--primary nr-btn--white">
                  Enquire Now
                </a>
                <Link to="/training" className="nr-cta__link">
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
        /* ===== STARFIELD KEYFRAMES ===== */
        @keyframes nr-twinkle {
          0%, 100% { opacity: 0.3; transform: scale(1); }
          50% { opacity: 1; transform: scale(1.2); }
        }

        /* ===== BASE ===== */
        .nr {
          font-family: 'Space Grotesk', -apple-system, sans-serif;
          background: var(--hq-background, #faf9f6);
          color: #1a1a1a;
          overflow-x: hidden;
        }

        .nr-pre-text {
          display: block;
          font-size: 0.7rem;
          text-transform: uppercase;
          letter-spacing: 0.25em;
          color: #999;
          margin-bottom: 1rem;
        }

        .nr-pre-text--light {
          color: rgba(255,255,255,0.5);
        }

        .nr-text--dark { color: #1a1a1a; }
        .nr-text--mid { color: #4a4a4a; }
        .nr-text--light { color: #7a7a7a; }
        .nr-text--white { color: #ffffff; }
        .nr-text--white-mid { color: rgba(255,255,255,0.6); }

        .nr-section-header {
          text-align: center;
          max-width: 700px;
          margin: 0 auto 3rem;
        }

        .nr-section-header h2 {
          font-size: clamp(2rem, 4vw, 3rem);
          margin: 0.5rem 0 1rem;
          line-height: 1.1;
          text-transform: uppercase;
          font-weight: 700;
        }

        .nr-section-header p {
          color: #666;
          font-size: 1.1rem;
          line-height: 1.7;
        }

        .nr-section-header--light p {
          color: rgba(255,255,255,0.7);
        }

        /* Stars */
        .nr-star {
          position: absolute;
          border-radius: 50%;
          background: #fff;
          box-shadow: 0 0 6px 2px rgba(255, 255, 255, 0.3);
          animation: nr-twinkle ease-in-out infinite;
          pointer-events: none;
        }

        /* Buttons */
        .nr-btn {
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

        .nr-btn--primary {
          background: #1a1a1a;
          color: #fff;
        }

        .nr-btn--primary:hover {
          background: #333;
          color: #fff;
        }

        .nr-btn--white {
          background: #fff;
          color: #1a1a1a;
        }

        .nr-btn--white:hover {
          background: #f0f0f0;
        }

        /* ===== HERO — Dark Starfield ===== */
        .nr-hero {
          min-height: 100vh;
          position: relative;
          display: flex;
          flex-direction: column;
          overflow: hidden;
          background: linear-gradient(180deg, #0a0a12 0%, #1a1a2e 50%, #0f0f1a 100%);
        }

        .nr-hero__stars {
          position: absolute;
          inset: 0;
          overflow: hidden;
          pointer-events: none;
        }

        .nr-hero__moon {
          position: absolute;
          top: 12%;
          right: 12%;
          width: 80px;
          height: 80px;
          border-radius: 50%;
          background: radial-gradient(circle at 30% 30%, #fffde7 0%, #ffecb3 50%, #fff8e1 100%);
          box-shadow: 0 0 60px 15px rgba(255, 253, 231, 0.2);
          opacity: 0.85;
          z-index: 1;
        }

        .nr-hero__content {
          position: relative;
          z-index: 3;
          flex: 1;
          display: flex;
          align-items: center;
          padding: 2rem 4rem;
        }

        .nr-hero__left {
          max-width: 550px;
        }

        .nr-hero__label {
          font-size: 0.7rem;
          font-weight: 400;
          letter-spacing: 0.2em;
          text-transform: uppercase;
          color: rgba(255,255,255,0.5);
          display: block;
          margin-bottom: 1.5rem;
        }

        .nr-hero__headline {
          display: flex;
          flex-direction: column;
          line-height: 1;
          margin-bottom: 1.5rem;
        }

        .nr-hero__word {
          font-family: 'Space Grotesk', sans-serif;
          font-weight: 700;
          font-size: clamp(3rem, 8vw, 5.5rem);
          letter-spacing: -0.02em;
          text-transform: uppercase;
        }

        .nr-hero__word--1 {
          background: linear-gradient(180deg, #fff 0%, rgba(255,255,255,0.8) 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }

        .nr-hero__word--2 {
          background: linear-gradient(180deg, rgba(255,255,255,0.7) 0%, rgba(255,255,255,0.4) 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }

        .nr-hero__divider-line {
          width: 80px;
          height: 2px;
          background: rgba(255,255,255,0.4);
          margin-bottom: 1.5rem;
          transform-origin: left;
        }

        .nr-hero__sub {
          font-size: 1.1rem;
          color: rgba(255,255,255,0.6);
          line-height: 1.8;
          max-width: 420px;
        }

        /* Hero Badge Card — Dark variant */
        .nr-hero__badge {
          background: rgba(255,255,255,0.05);
          backdrop-filter: blur(10px);
          max-width: 280px;
          margin-bottom: 1.5rem;
          border-radius: 8px;
          overflow: hidden;
          border: 1px solid rgba(255,255,255,0.1);
        }

        .nr-hero__badge-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 0.75rem 1rem;
          border-bottom: 1px solid rgba(255,255,255,0.08);
        }

        .nr-hero__badge-label {
          font-size: 0.55rem;
          letter-spacing: 0.15em;
          color: rgba(255,255,255,0.5);
          text-transform: uppercase;
        }

        .nr-hero__badge-type {
          font-size: 0.6rem;
          font-weight: 700;
          letter-spacing: 0.1em;
          color: #fff;
          background: rgba(255,255,255,0.1);
          padding: 0.15rem 0.5rem;
        }

        .nr-hero__badge-content {
          display: flex;
          align-items: center;
          justify-content: space-around;
          padding: 1rem;
        }

        .nr-hero__badge-stat {
          text-align: center;
        }

        .nr-hero__badge-num {
          display: block;
          font-family: 'Share Tech Mono', monospace;
          font-size: 1.5rem;
          font-weight: 700;
          color: #fff;
          line-height: 1;
        }

        .nr-hero__badge-desc {
          font-size: 0.55rem;
          color: rgba(255,255,255,0.5);
          text-transform: uppercase;
          letter-spacing: 0.05em;
        }

        .nr-hero__badge-divider {
          width: 1px;
          height: 30px;
          background: linear-gradient(to bottom, transparent, rgba(255,255,255,0.2), transparent);
        }

        /* ===== OVERVIEW SECTION ===== */
        .nr-overview {
          padding: 5rem 2rem;
          background: #fff;
          position: relative;
        }

        .nr-overview::before {
          content: '';
          position: absolute;
          top: 0;
          left: 50%;
          transform: translateX(-50%);
          width: min(80%, 600px);
          height: 1px;
          background: linear-gradient(90deg, transparent, #e0deda, transparent);
        }

        .nr-overview__container {
          max-width: 1100px;
          margin: 0 auto;
        }

        .nr-overview__header {
          text-align: center;
          max-width: 700px;
          margin: 0 auto 3rem;
        }

        .nr-overview__header h2 {
          font-size: clamp(1.75rem, 3.5vw, 2.5rem);
          margin: 0.5rem 0 1rem;
          text-transform: uppercase;
          font-weight: 700;
        }

        .nr-overview__header p {
          color: #666;
          font-size: 1.05rem;
          line-height: 1.7;
        }

        .nr-overview__grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 1.5rem;
        }

        .nr-overview__card {
          background: var(--hq-background, #faf9f6);
          padding: 2rem;
          border-left: 3px solid #1a1a1a;
        }

        .nr-overview__card-num {
          font-family: 'Share Tech Mono', monospace;
          font-size: 0.7rem;
          color: #ccc;
          margin-bottom: 1rem;
          display: block;
        }

        .nr-overview__card h3 {
          font-size: 1.1rem;
          font-weight: 600;
          margin: 0 0 0.75rem;
          text-transform: uppercase;
        }

        .nr-overview__card p {
          font-size: 0.9rem;
          color: #666;
          line-height: 1.6;
          margin: 0;
        }

        /* ===== PREREQUISITES ===== */
        .nr-prereq {
          padding: 5rem 2rem;
          background: var(--hq-background, #faf9f6);
        }

        .nr-prereq__container {
          max-width: 900px;
          margin: 0 auto;
        }

        .nr-prereq__grid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 1.5rem;
          margin-bottom: 2rem;
        }

        .nr-prereq__card {
          display: flex;
          align-items: center;
          gap: 1.25rem;
          padding: 1.5rem;
          background: #fff;
          border: 1px solid #e8e6e2;
          border-radius: 4px;
        }

        .nr-prereq__icon {
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

        .nr-prereq__text h4 {
          font-size: 0.95rem;
          font-weight: 600;
          margin: 0 0 0.25rem;
          text-transform: uppercase;
        }

        .nr-prereq__text p {
          font-size: 0.85rem;
          color: #666;
          line-height: 1.5;
          margin: 0;
        }

        .nr-prereq__note {
          background: #fff;
          border-left: 3px solid #1a1a1a;
          padding: 1.5rem;
        }

        .nr-prereq__note-label {
          display: block;
          font-size: 0.65rem;
          text-transform: uppercase;
          letter-spacing: 0.15em;
          color: #999;
          margin-bottom: 0.75rem;
        }

        .nr-prereq__note p {
          font-size: 0.95rem;
          color: #666;
          line-height: 1.7;
          margin: 0;
        }

        /* ===== PROCESS SECTION ===== */
        .nr-process {
          padding: 5rem 2rem;
          background: #1a1a1a;
        }

        .nr-process__container {
          max-width: 900px;
          margin: 0 auto;
        }

        .nr-process__steps {
          display: flex;
          flex-direction: column;
          gap: 0;
        }

        .nr-process__step {
          display: flex;
          gap: 1.5rem;
          padding: 1.5rem 0;
          border-bottom: 1px solid rgba(255,255,255,0.1);
        }

        .nr-process__step:last-child {
          border-bottom: none;
        }

        .nr-process__step-num {
          font-family: 'Share Tech Mono', monospace;
          font-size: 0.75rem;
          color: rgba(255,255,255,0.3);
          flex-shrink: 0;
          padding-top: 0.2rem;
        }

        .nr-process__step-content {
          flex: 1;
        }

        .nr-process__step-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 0.5rem;
        }

        .nr-process__step-header h4 {
          font-size: 1rem;
          font-weight: 600;
          margin: 0;
          color: #fff;
          text-transform: uppercase;
        }

        .nr-process__step-duration {
          font-family: 'Share Tech Mono', monospace;
          font-size: 0.7rem;
          color: rgba(255,255,255,0.5);
          letter-spacing: 0.1em;
        }

        .nr-process__step-content p {
          font-size: 0.9rem;
          color: rgba(255,255,255,0.6);
          line-height: 1.6;
          margin: 0;
        }

        /* Process Timeline */
        .nr-process__timeline {
          margin-top: 3rem;
          padding-top: 2rem;
          border-top: 1px solid rgba(255,255,255,0.1);
        }

        .nr-process__timeline-track {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 1rem;
        }

        .nr-process__timeline-dot {
          width: 12px;
          height: 12px;
          background: #fff;
          border-radius: 50%;
        }

        .nr-process__timeline-line {
          flex: 1;
          height: 2px;
          background: linear-gradient(90deg, #fff, rgba(255,255,255,0.3));
        }

        .nr-process__timeline-label {
          display: flex;
          justify-content: space-between;
          font-size: 0.65rem;
          color: rgba(255,255,255,0.5);
          text-transform: uppercase;
          letter-spacing: 0.15em;
        }

        /* ===== FAQ SECTION ===== */
        .nr-faq {
          padding: 5rem 2rem;
          background: var(--hq-background, #faf9f6);
        }

        .nr-faq__container {
          max-width: 800px;
          margin: 0 auto;
        }

        .nr-faq__list {
          display: flex;
          flex-direction: column;
        }

        .nr-faq__item {
          display: flex;
          gap: 1.5rem;
          padding: 1.25rem 0;
          border-bottom: 1px solid #e8e6e2;
          cursor: pointer;
          transition: background 0.2s ease;
        }

        .nr-faq__item:hover {
          background: rgba(0,0,0,0.01);
        }

        .nr-faq__item--open {
          background: rgba(0,0,0,0.02);
        }

        .nr-faq__number {
          font-family: 'Share Tech Mono', monospace;
          font-size: 0.75rem;
          color: #ccc;
          flex-shrink: 0;
          padding-top: 0.1rem;
        }

        .nr-faq__content {
          flex: 1;
        }

        .nr-faq__content h4 {
          margin: 0;
          font-size: 1rem;
          font-weight: 600;
          display: flex;
          justify-content: space-between;
          align-items: center;
          gap: 1rem;
        }

        .nr-faq__toggle {
          font-size: 1.25rem;
          font-weight: 300;
          color: #999;
          flex-shrink: 0;
        }

        .nr-faq__answer {
          overflow: hidden;
        }

        .nr-faq__answer p {
          margin: 0.75rem 0 0;
          color: #666;
          line-height: 1.7;
          font-size: 0.95rem;
        }

        /* ===== CTA SECTION ===== */
        .nr-cta {
          background: linear-gradient(180deg, #0f0f1a 0%, #1a1a2e 50%, #0a0a12 100%);
          position: relative;
          overflow: hidden;
        }

        .nr-cta__inner {
          position: relative;
          min-height: 400px;
        }

        .nr-cta__stars {
          position: absolute;
          inset: 0;
          overflow: hidden;
          pointer-events: none;
        }

        .nr-cta__content {
          position: relative;
          z-index: 1;
          padding: 5rem 2rem;
          max-width: 700px;
          margin: 0 auto;
          text-align: center;
          color: #fff;
        }

        .nr-cta__content h2 {
          font-size: clamp(1.75rem, 3.5vw, 2.5rem);
          font-weight: 700;
          text-transform: uppercase;
          line-height: 1.1;
          margin: 0.5rem 0 1.5rem;
        }

        .nr-cta__content p {
          color: rgba(255,255,255,0.7);
          font-size: 1rem;
          line-height: 1.7;
          margin-bottom: 2rem;
          max-width: 500px;
          margin-left: auto;
          margin-right: auto;
        }

        .nr-cta__buttons {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 2rem;
        }

        .nr-cta__link {
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

        .nr-cta__link:hover {
          color: #fff;
        }

        .nr-cta__link svg {
          transition: transform 0.3s ease;
        }

        .nr-cta__link:hover svg {
          transform: translateX(3px);
        }

        /* ===== RESPONSIVE ===== */
        @media (max-width: 1024px) {
          .nr-overview__grid {
            grid-template-columns: 1fr;
          }

          .nr-prereq__grid {
            grid-template-columns: 1fr;
          }
        }

        @media (max-width: 768px) {
          .nr-hero__content {
            padding: 6rem 2rem 2rem;
            justify-content: center;
          }

          .nr-hero__left {
            text-align: center;
            max-width: 100%;
          }

          .nr-hero__headline {
            align-items: center;
          }

          .nr-hero__divider-line {
            margin: 1.5rem auto;
          }

          .nr-hero__badge {
            margin: 0 auto 1.5rem;
          }

          .nr-hero__sub {
            margin: 0 auto;
            text-align: center;
          }

          .nr-process__step {
            flex-direction: column;
            gap: 0.5rem;
          }

          .nr-faq__item {
            flex-direction: column;
            gap: 0.5rem;
          }

          .nr-cta__buttons {
            flex-direction: column;
            gap: 1rem;
          }
        }
      `}</style>
    </div>
  );
}

export default NightRating;

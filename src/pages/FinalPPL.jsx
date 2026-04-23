/**
 * FINAL PPL PAGE - Redesigned
 *
 * Brand: Luxury Minimal Aviation
 * Typography: Space Grotesk + Share Tech Mono
 * Colors: #faf9f6 (warm white), #1a1a1a (charcoal), #2563eb (accent)
 */

import React, { useRef, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, useInView, useScroll, useTransform, useSpring } from 'framer-motion';
import { useFaqs } from '../hooks/useFaqs';
import { usePricing } from '../hooks/usePricing';
import { usePageImages } from '../hooks/usePageImages';
import { useCmsHighlight } from '../hooks/useCmsHighlight';

// Import styles for Header/Navigation
import '../assets/css/main.css';
import '../assets/css/components.css';

// Import FooterMinimal component
import FooterMinimal from '../components/FooterMinimal';
import { arrivalStyles } from '../components/ArrivalSection';


/**
 * PPL PAGE HEADER COMPONENT
 * This header has the spotlight animation that works on this page
 */
function PPLHeader() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [colorDark, setColorDark] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [verticalProgress, setVerticalProgress] = useState(0);
  const [horizontalProgress, setHorizontalProgress] = useState(0);

  // Scroll handler for spotlight animation
  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY;

      // Vertical completes FIRST (0 to 1 over first 150px)
      const vProgress = Math.min(scrollY / 150, 1);
      setVerticalProgress(vProgress);

      // Horizontal completes SECOND (0 to 1 over full 300px)
      const hProgress = Math.min(scrollY / 300, 1);
      setHorizontalProgress(hProgress);

      // Color changes at 300px
      setColorDark(scrollY > 300);
      // Position/size changes at 300px
      setScrolled(scrollY > 300);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close on Escape key
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape') setMenuOpen(false);
    };
    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, []);

  const toggleMenu = () => setMenuOpen(!menuOpen);
  const closeMenu = () => setMenuOpen(false);

  // Spotlight dimensions
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

// Floating particle animation
function FloatingParticles() {
  return (
    <div className="fppl-particles">
      {[...Array(6)].map((_, i) => (
        <motion.div
          key={i}
          className="fppl-particle"
          initial={{ opacity: 0, y: 100, x: Math.random() * 100 - 50 }}
          animate={{
            opacity: [0, 0.3, 0],
            y: [100, -100],
            x: [Math.random() * 100 - 50, Math.random() * 100 - 50],
          }}
          transition={{
            duration: 8 + Math.random() * 4,
            repeat: Infinity,
            delay: i * 1.5,
            ease: 'linear',
          }}
          style={{ left: `${10 + i * 15}%` }}
        />
      ))}
    </div>
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

function FinalPPL() {
  const heroRef = useRef(null);
  const groundGridRef = useRef(null);
  const [groundPage, setGroundPage] = useState(0);
  const [openFaq, setOpenFaq] = useState(null);
  const pageImages = usePageImages('ppl');
  useCmsHighlight();
  const { fmt } = usePricing();
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

  const { faqs } = useFaqs('ppl', { visibleOnly: true });
  const [showAllFaqs, setShowAllFaqs] = useState(false);

  return (
    <div className="fppl">
      <PPLHeader />

      {/* ========== HERO: Split Layout with Boarding Pass ========== */}
      <section ref={heroRef} className="fppl-hero" data-cms-section="ppl-hero">
        {/* Background image */}
        <motion.div
          className="fppl-hero__bg"
          initial={{ scale: 1.1, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 1.5 }}
        >
          <img src={pageImages['ppl-hero']?.[0]?.url || '/assets/images/gallery/carousel/rotating6.jpg'} alt="" />
        </motion.div>
        <div className="fppl-hero__overlay" />

        {/* Main content */}
        <motion.div
          className="fppl-hero__content"
          style={{ opacity: heroOpacity, scale: heroScale, y: heroY }}
        >
          <div className="fppl-hero__left">
            <motion.span
              className="fppl-hero__label"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              PPL(H) TRAINING
            </motion.span>

            <div className="fppl-hero__headline">
              <motion.span
                className="fppl-hero__word fppl-hero__word--1"
                initial={{ opacity: 0, y: 40 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.4, ease: [0.16, 1, 0.3, 1] }}
              >
                LEARN
              </motion.span>
              <motion.span
                className="fppl-hero__word fppl-hero__word--2"
                initial={{ opacity: 0, y: 40 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.6, ease: [0.16, 1, 0.3, 1] }}
              >
                TO
              </motion.span>
              <motion.span
                className="fppl-hero__word fppl-hero__word--3"
                initial={{ opacity: 0, y: 40 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.8, ease: [0.16, 1, 0.3, 1] }}
              >
                FLY
              </motion.span>
            </div>

            <motion.div
              className="fppl-hero__divider-line"
              initial={{ scaleX: 0 }}
              animate={{ scaleX: 1 }}
              transition={{ duration: 0.8, delay: 1, ease: [0.16, 1, 0.3, 1] }}
            />

            {/* Boarding Pass - Compact with Perforation */}
            <motion.div
              className="fppl-hero__ticket"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.2, duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            >
              <div className="fppl-hero__ticket-main">
                <div className="fppl-hero__ticket-header">
                  <img src="/assets/images/logos/hq/hq-aviation-logo-black.png" alt="HQ Aviation" className="fppl-hero__ticket-logo" />
                  <span className="fppl-hero__ticket-type">BOARDING PASS</span>
                  <span className="fppl-hero__ticket-class">PPL(H)</span>
                </div>
                <div className="fppl-hero__ticket-route">
                  <div className="fppl-hero__ticket-point">
                    <span className="fppl-hero__ticket-code">STUDENT</span>
                    <span className="fppl-hero__ticket-city">Beginner</span>
                  </div>
                  <div className="fppl-hero__ticket-arrow">
                    <svg width="24" height="8" viewBox="0 0 24 8" fill="none">
                      <path d="M0 4H22M22 4L18 1M22 4L18 7" stroke="#999" strokeWidth="1"/>
                    </svg>
                  </div>
                  <div className="fppl-hero__ticket-point">
                    <span className="fppl-hero__ticket-code">PILOT</span>
                    <span className="fppl-hero__ticket-city">Licensed</span>
                  </div>
                </div>
              </div>
              <div className="fppl-hero__ticket-perf"></div>
              <div className="fppl-hero__ticket-stub">
                <div className="fppl-hero__ticket-stub-row">
                  <div><span className="fppl-hero__ticket-lbl">HRS</span><span>45+</span></div>
                  <div><span className="fppl-hero__ticket-lbl">GATE</span><span>EGLD</span></div>
                  <div><span className="fppl-hero__ticket-lbl">SEAT</span><span>1A</span></div>
                </div>
              </div>
            </motion.div>

            <motion.p
              className="fppl-hero__sub"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.4 }}
            >
              The journey of a lifetime starts with a single lesson. Master the art of helicopter flight with expert instructors.
            </motion.p>
          </div>
        </motion.div>

      </section>

      {/* ========== INTRO: Instructor Network ========== */}
      <section className="fppl-intro">
        <div className="fppl-intro__container">
          <Reveal>
            <div className="fppl-intro__header">
              <span className="fppl-pre-text">World-Class Training</span>
              <h2>
                <span className="fppl-text--dark">Training</span>{' '}
                <span className="fppl-text--mid">Under</span>{' '}
                <span className="fppl-text--light">Extraordinary Instructors</span>
              </h2>
              <p>
                If the quality of instructing counts for anything—and it certainly does—you will learn at an
                exceptionally high standard, develop no bad habits, and become a better pilot at a much faster
                pace with our rigorous, hands-on training program.
              </p>
            </div>
          </Reveal>

          <div className="fppl-intro__network" data-cms-section="ppl-instructors">
            <div className="fppl-intro__leads">
              <Reveal delay={0.2}>
                <div className="fppl-intro__q-card">
                  <div className="fppl-intro__q-top">
                    <div className="fppl-intro__q-image">
                      <img src={pageImages['ppl-instructors']?.[0]?.url || '/assets/images/team/quentin-smith-profile-picture.jpg'} alt="Quentin Smith" />
                    </div>
                    <div className="fppl-intro__q-info">
                      <h3>Quentin Smith</h3>
                      <span className="fppl-intro__q-title">Founder & Managing Director</span>
                      <div className="fppl-intro__q-stats">
                        <div className="fppl-intro__q-stat">
                          <span className="fppl-intro__stat-value"><AnimatedNumber value="18000" />+</span>
                          <span className="fppl-intro__stat-label">Flight Hours</span>
                        </div>
                        <div className="fppl-intro__q-stat">
                          <span className="fppl-intro__stat-value"><AnimatedNumber value="35" />+</span>
                          <span className="fppl-intro__stat-label">Years Flying</span>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="fppl-intro__q-bio-row">
                    <p>
                      World Helicopter Champion and the first person to fly a helicopter to the South Pole and back.
                    </p>
                  </div>
                </div>
              </Reveal>

              <Reveal delay={0.3}>
                <div className="fppl-intro__q-card">
                  <div className="fppl-intro__q-top">
                    <div className="fppl-intro__q-image">
                      <img src={pageImages['ppl-instructors']?.[1]?.url || '/assets/images/team/mackie-alcantara-profile-picture.jpg'} alt="Mackie Alcantara" />
                    </div>
                    <div className="fppl-intro__q-info">
                      <h3>Mackie Alcantara</h3>
                      <span className="fppl-intro__q-title">Chief Flight Instructor</span>
                      <div className="fppl-intro__q-stats">
                        <div className="fppl-intro__q-stat">
                          <span className="fppl-intro__stat-value"><AnimatedNumber value="8500" />+</span>
                          <span className="fppl-intro__stat-label">Flight Hours</span>
                        </div>
                        <div className="fppl-intro__q-stat">
                          <span className="fppl-intro__stat-value"><AnimatedNumber value="15" />+</span>
                          <span className="fppl-intro__stat-label">Years Teaching</span>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="fppl-intro__q-bio-row">
                    <p>
                      Leading our instructor team with exceptional skill and dedication to every lesson.
                    </p>
                  </div>
                </div>
              </Reveal>
            </div>

            <Reveal delay={0.4}>
              <div className="fppl-intro__team">
                <div className="fppl-intro__instructors">
                  {[
                    { name: 'George Agnelli', title: 'Flight Instructor' },
                    { name: 'Phil Summers', title: 'Flight Instructor' },
                  ].map((item, i) => (
                    <motion.div
                      key={i}
                      className="fppl-intro__instructor"
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      transition={{ delay: i * 0.1, ease: [0.16, 1, 0.3, 1] }}
                      viewport={{ once: true }}
                    >
                      <span className="fppl-intro__instructor-name">{item.name}</span>
                      <span className="fppl-intro__instructor-title">{item.title}</span>
                    </motion.div>
                  ))}
                </div>
              </div>
            </Reveal>
          </div>
          <Reveal delay={0.5}>
            <p className="fppl-intro__body">
              Let aside the ground exams that most students self study before taking the tests on site, the obtention of a PPL(H) requires a minimum of 45 hrs of flight training, including 10 hrs of solo. The duration varies depending on commitment.
            </p>
          </Reveal>
        </div>
      </section>

      {/* ========== GROUND SCHOOL: 9 Subjects ========== */}
      <section className="fppl-ground">
        <div className="fppl-ground__container">
          <Reveal>
            <div className="fppl-section-header">
              <span className="fppl-pre-text">Theory Training</span>
              <h2>
                <span className="fppl-text--dark">9</span>{' '}
                <span className="fppl-text--mid">Ground School</span>{' '}
                <span className="fppl-text--light">Subjects</span>
              </h2>
            </div>
          </Reveal>

          <div
            className="fppl-ground__grid"
            ref={groundGridRef}
            onScroll={() => {
              const el = groundGridRef.current;
              if (!el) return;
              setGroundPage(Math.round(el.scrollLeft / el.clientWidth));
            }}
          >
            {[
              { num: '01', title: 'Air Law', desc: 'Regulations & procedures' },
              { num: '02', title: 'Navigation', desc: 'Charts & flight planning' },
              { num: '03', title: 'Meteorology', desc: 'Weather understanding' },
              { num: '04', title: 'Human Performance', desc: 'Physiology & psychology' },
              { num: '05', title: 'Principles of Flight', desc: 'Aerodynamics' },
              { num: '06', title: 'Operations', desc: 'Flight procedures' },
              { num: '07', title: 'Performance', desc: 'Weight & balance' },
              { num: '08', title: 'Communications', desc: 'Radio procedures' },
              { num: '09', title: 'Aircraft Knowledge', desc: 'Systems & engines' },
            ].map((subject, i) => (
              <motion.div
                key={i}
                className="fppl-ground__card"
                initial={{ opacity: 0, y: 8 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0 }}
                transition={{ duration: 0.2, delay: i * 0.015, ease: [0.16, 1, 0.3, 1] }}
                whileHover={{ y: -3 }}
              >
                <span className="fppl-ground__num">{subject.num}</span>
                <div className="fppl-ground__text">
                  <h4>{subject.title}</h4>
                  <p>{subject.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
          <div className="fppl-ground__dots">
            {[0, 1, 2].map(i => (
              <button
                key={i}
                className={`fppl-ground__dot${groundPage === i ? ' fppl-ground__dot--active' : ''}`}
                onClick={() => {
                  const el = groundGridRef.current;
                  if (!el) return;
                  el.scrollTo({ left: el.clientWidth * i, behavior: 'smooth' });
                }}
              />
            ))}
          </div>

          <Reveal delay={0.5}>
            <div className="fppl-ground__exams">
              <p>
                All nine subjects are examined through multiple-choice tests directly at HQ as an approved CAA test centre.
                You can take the exams in any order and at your own pace throughout your training, with a 75% pass mark required for each subject.
                All you need is the Air Law exam to go Solo.
              </p>
            </div>
            <div className="fppl-ground__included">
              <span className="fppl-ground__included-text">Ground School</span>
              <span className="fppl-ground__included-badge">INCLUDED</span>
            </div>
          </Reveal>
        </div>
      </section>


      {/* ========== CTA: Visit Us ========== */}
      <section className="fppl-visit">
        <div className="fppl-visit__content-wrap">
          <div className="fppl-visit__content">
            <Reveal>
              <div className="fppl-visit__header">
                <span className="fppl-pre-text">Denham Aerodrome, UK</span>
                <h2>
                  <span className="fppl-text--dark">Visit</span>{' '}
                  <span className="fppl-text--mid">Our</span>{' '}
                  <span className="fppl-text--light">Clubhouse</span>
                </h2>
                <p>
                  Our helicopter collection is extensive. If you love helicopters as much as we do,
                  come visit us anytime during working hours. We'll give you a tour you won't forget.
                </p>
              </div>
            </Reveal>

            <Reveal>
              <div className="fppl-discovery-card">
              <section id="discovery" className="fppl-discovery fppl-discovery--compact" data-cms-section="ppl-cta">
                <div className="fppl-discovery__inner">
                  <div className="fppl-discovery__image">
                    <img alt="Discovery flight over countryside" src={pageImages['ppl-cta']?.[0]?.url || '/assets/images/gallery/carousel/rotating1.jpg'} style={{ transform: 'none' }} />
                    <div className="fppl-discovery__image-overlay"></div>
                    <div className="fppl-discovery__price fppl-discovery__price--image">
                      <span className="fppl-discovery__price-from">From</span>
                      <span className="fppl-discovery__price-amount">{fmt('discovery_r22_30min')}</span>
                    </div>
                  </div>
                  <div className="fppl-discovery__content">
                    <div className="fppl-discovery__header">
                      <span className="fppl-pre-text">Your First Flight</span>
                      <h2><span className="fppl-text--dark">Discovery</span> <span className="fppl-text--mid">Flight</span></h2>
                    </div>
                    <p className="fppl-discovery__desc">Not sure if flying is for you? A Discovery Flight puts you in the seat and at the controls in under an hour — no experience needed, no commitment required.</p>
                    <div className="fppl-discovery__selling-points fppl-discovery__selling-points--below">
                      <div className="fppl-discovery__point">
                        <span className="fppl-discovery__point-icon">⏱</span>
                        <span className="fppl-discovery__point-text">30 min airborne</span>
                      </div>
                      <div className="fppl-discovery__point">
                        <span className="fppl-discovery__point-icon">✓</span>
                        <span className="fppl-discovery__point-text">
                          <span className="fppl-discovery__pt-wide">Counts toward PPL</span>
                          <span className="fppl-discovery__pt-narrow">Counts for PPL</span>
                        </span>
                      </div>
                      <div className="fppl-discovery__point">
                        <span className="fppl-discovery__point-icon">◎</span>
                        <span className="fppl-discovery__point-text">
                          <span className="fppl-discovery__pt-wide">You take the controls</span>
                          <span className="fppl-discovery__pt-narrow">You're In Control</span>
                        </span>
                      </div>
                    </div>
                    <div className="fppl-discovery__compact-row">
                      <div className="fppl-discovery__booking">
                        <div className="fppl-discovery__price fppl-discovery__price--booking">
                          <span className="fppl-discovery__price-from">From</span>
                          <span className="fppl-discovery__price-amount">{fmt('discovery_r22_30min')}</span>
                        </div>
                        <a href="/training/trial-lessons" className="fppl-discovery__book-btn">
                          <span className="fppl-discovery__book-btn-text">See More Details</span>
                          <span className="fppl-discovery__book-btn-arrow">→</span>
                        </a>
                      </div>
                      <div className="fppl-discovery__selling-points fppl-discovery__selling-points--inline">
                        <div className="fppl-discovery__point">
                          <span className="fppl-discovery__point-icon">⏱</span>
                          <span className="fppl-discovery__point-text">30 min airborne</span>
                        </div>
                        <div className="fppl-discovery__point">
                          <span className="fppl-discovery__point-icon">✓</span>
                          <span className="fppl-discovery__point-text">
                            <span className="fppl-discovery__pt-wide">Counts toward PPL</span>
                            <span className="fppl-discovery__pt-narrow">Counts for PPL</span>
                          </span>
                        </div>
                        <div className="fppl-discovery__point">
                          <span className="fppl-discovery__point-icon">◎</span>
                          <span className="fppl-discovery__point-text">
                            <span className="fppl-discovery__pt-wide">You take the controls</span>
                            <span className="fppl-discovery__pt-narrow">You're In Control</span>
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </section>
              <div className="fppl-visit__note-card">
                <div className="fppl-visit__note-wrap">
                  <span className="fppl-visit__note-title">If You Love Helicopters</span>
                  <p className="fppl-visit__note">
                    No appointment needed · Coffee always on · Pilots happy to chat · Extensive Fleet
                  </p>
                </div>
              </div>
              </div>{/* end fppl-discovery-card */}
            </Reveal>

          </div>
        </div>
      </section>

      {/* ========== WHERE & FAQ + DISCOVERY (swapped on mobile) ========== */}
      <div className="fppl__faq-discovery-wrap">

      {/* ========== WHERE & FAQ ========== */}
      <section className="df-location-faq" data-cms-section="faqs-ppl">
        <style>{arrivalStyles}</style>
        <div className="df-location-faq__container">
          {/* Left: Location */}
          <div className="df-location-faq__left">
            <Reveal>
              <div className="df-location__header">
                <span className="df-label">Visit Us</span>
                <h2>Denham Aerodrome</h2>
              </div>
            </Reveal>
            <Reveal>
              <div className="df-location">
                <div className="arrival__card">
                  <div className="arrival__map">
                    <div className="arrival__map-inner">
                      <iframe
                        title="HQ Aviation Denham Aerodrome"
                        src="https://maps.google.com/maps?q=HQ+Aviation,+Denham+Aerodrome,+UB9+5DF&ll=51.578,0.05&t=&z=9&ie=UTF8&iwloc=&output=embed"
                        width="100%"
                        height="100%"
                        style={{ border: 0 }}
                        allowFullScreen=""
                        loading="lazy"
                        referrerPolicy="no-referrer-when-downgrade"
                      />
                    </div>
                  </div>
                  <div className="arrival__info">
                    <div className="arrival__rule"></div>
                    <div className="arrival__details">
                      <div className="arrival__detail">
                        <span className="arrival__detail-icon"><i className="fas fa-map-marker-alt"></i></span>
                        <div>
                          <span className="arrival__detail-label">Address</span>
                          <p className="arrival__detail-text">Hangar E, Denham Aerodrome<br />Uxbridge, London, UB9 5DF</p>
                        </div>
                      </div>
                      <div className="arrival__detail">
                        <span className="arrival__detail-icon"><i className="fas fa-phone-alt"></i></span>
                        <div>
                          <span className="arrival__detail-label">Operations</span>
                          <p className="arrival__detail-text"><a href="tel:+441895833373" className="arrival__detail-link">+44 1895 833373</a></p>
                        </div>
                      </div>
                      <div className="arrival__detail">
                        <span className="arrival__detail-icon"><i className="fas fa-wrench"></i></span>
                        <div>
                          <span className="arrival__detail-label">Maintenance</span>
                          <p className="arrival__detail-text"><a href="tel:+441895832833" className="arrival__detail-link">+44 1895 832833</a></p>
                        </div>
                      </div>
                      <div className="arrival__detail">
                        <span className="arrival__detail-icon"><i className="fas fa-envelope"></i></span>
                        <div>
                          <span className="arrival__detail-label">Email</span>
                          <p className="arrival__detail-text"><a href="mailto:Operations@HQAviation.com" className="arrival__detail-link">Operations@HQAviation.com</a></p>
                        </div>
                      </div>
                      <div className="arrival__detail">
                        <span className="arrival__detail-icon"><i className="fas fa-clock"></i></span>
                        <div>
                          <span className="arrival__detail-label">Hours</span>
                          <p className="arrival__detail-text">Monday – Sunday<br />09:00 – 17:00</p>
                        </div>
                      </div>
                    </div>
                    <div className="arrival__rating">
                      <div className="arrival__rating-stars">
                        <span>★</span><span>★</span><span>★</span><span>★</span><span>★</span>
                      </div>
                      <div className="arrival__rating-text">
                        <span className="arrival__rating-score">4.9</span>
                        <span className="arrival__rating-total"> / 5</span>
                      </div>
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
                <span className="df-label">Common Questions</span>
                <h2>Frequently Asked</h2>
              </div>
            </Reveal>

            <div className="df-faq__list">
              {faqs.map((faq, i) => (
                <Reveal key={faq.id} delay={i * 0.1}>
                  <div
                    className={`df-faq__item ${openFaq === i ? 'df-faq__item--open' : ''}${i >= 6 && !showAllFaqs ? ' df-faq__item--mobile-hidden' : ''}`}
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
            {faqs.length > 6 && !showAllFaqs && (
              <button className="df-faq__load-more" onClick={() => setShowAllFaqs(true)}>
                Load More
              </button>
            )}
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


      </div>{/* end fppl__faq-discovery-wrap */}

      {/* ========== FOOTER ========== */}
      <FooterMinimal />

      {/* ========== STYLES ========== */}
      <style>{`
        /* ===== BASE ===== */
        .fppl {
          font-family: 'Space Grotesk', -apple-system, sans-serif;
          background: #faf9f6;
          color: #1a1a1a;
          overflow-x: hidden;
        }

        .fppl-label {
          display: inline-block;
          font-size: 0.7rem;
          text-transform: uppercase;
          letter-spacing: 0.25em;
          color: #888;
          font-weight: 400;
          margin-bottom: 0.75rem;
        }

        .fppl-accent { color: #2563eb; }

        .fppl-section-header {
          text-align: center;
          max-width: 700px;
          margin: 0 auto 3rem;
        }

        .fppl-section-header h2 {
          font-size: clamp(2rem, 4vw, 3rem);
          margin: 0.5rem 0;
          line-height: 1.1;
          text-transform: uppercase;
          font-weight: 700;
        }

        .fppl-section-header p {
          color: #666;
          font-size: 1.1rem;
          line-height: 1.7;
        }

        /* Buttons */
        .fppl-btn {
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

        .fppl-btn--primary {
          background: #1a1a1a;
          color: #fff;
        }

        .fppl-btn--primary:hover {
          background: #333;
          color: #fff;
        }

        .fppl-btn--outline {
          background: transparent;
          color: #1a1a1a;
          border: 2px solid #1a1a1a;
        }

        .fppl-btn--outline:hover {
          background: #1a1a1a;
          color: #fff;
        }

        .fppl-btn--large {
          padding: 1.1rem 2.5rem;
          font-size: 0.8rem;
        }

        /* ===== HERO ===== */
        .fppl-hero {
          min-height: 100vh;
          position: relative;
          display: flex;
          flex-direction: column;
          overflow: hidden;
          background: #faf9f6;
        }

        .fppl-hero__bg {
          position: absolute;
          inset: 0;
          z-index: 1;
        }

        .fppl-hero__bg img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }

        .fppl-hero__overlay {
          position: absolute;
          inset: 0;
          z-index: 2;
          background: linear-gradient(90deg, rgba(250,249,246,0.97) 0%, rgba(250,249,246,0.92) 45%, rgba(250,249,246,0.4) 100%);
        }

        .fppl-hero__content {
          position: relative;
          z-index: 3;
          flex: 1;
          display: flex;
          align-items: center;
          padding: 2rem 4rem 2rem;
        }

        .fppl-hero__left {
          max-width: 550px;
        }

        .fppl-hero__label {
          display: block;
          font-family: 'Share Tech Mono', monospace;
          font-size: 0.7rem;
          letter-spacing: 0.2em;
          text-transform: uppercase;
          color: #999;
          margin-bottom: 1.5rem;
        }

        .fppl-hero__headline {
          display: flex;
          flex-direction: column;
          line-height: 1;
          margin-bottom: 1.5rem;
        }

        .fppl-hero__word {
          font-family: 'Space Grotesk', sans-serif;
          font-weight: 700;
          font-size: clamp(3rem, 8vw, 5.5rem);
          letter-spacing: -0.02em;
          text-transform: uppercase;
        }

        .fppl-hero__word--1 {
          color: #1a1a1a;
        }

        .fppl-hero__word--2 {
          color: #4a4a4a;
        }

        .fppl-hero__word--3 {
          color: #7a7a7a;
        }

        .fppl-hero__divider-line {
          width: 80px;
          height: 2px;
          background: #1a1a1a;
          margin-bottom: 1.5rem;
          transform-origin: left;
        }

        .fppl-hero__sub {
          font-size: 1.1rem;
          color: #666;
          line-height: 1.8;
          max-width: 420px;
        }

        /* Boarding Pass Ticket - Compact with Perforation */
        .fppl-hero__ticket {
          display: flex;
          align-items: stretch;
          background: #fff;
          max-width: 320px;
          margin-bottom: 1.5rem;
          box-shadow: 0 4px 20px rgba(0,0,0,0.08);
          border-radius: 8px;
          overflow: hidden;
          border: 1px solid #e8e6e2;
        }

        .fppl-hero__ticket-main {
          flex: 1;
          padding: 0.75rem 1rem;
          padding-right: 1.5rem;
          position: relative;
        }

        .fppl-hero__ticket-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 0.5rem;
          padding-bottom: 0.5rem;
          border-bottom: 1px solid #f0f0f0;
          gap: 0.5rem;
        }

        .fppl-hero__ticket-logo {
          height: 14px;
          width: auto;
          opacity: 0.8;
        }

        .fppl-hero__ticket-type {
          font-family: 'Space Grotesk', sans-serif;
          font-size: 0.5rem;
          letter-spacing: 0.15em;
          color: #999;
          text-transform: uppercase;
          flex: 1;
          text-align: center;
        }

        .fppl-hero__ticket-class {
          font-family: 'Space Grotesk', sans-serif;
          font-size: 0.6rem;
          font-weight: 700;
          letter-spacing: 0.1em;
          color: #1a1a1a;
          background: #f5f5f2;
          padding: 0.15rem 0.4rem;
        }

        .fppl-hero__ticket-route {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 0.75rem;
        }

        .fppl-hero__ticket-point {
          text-align: center;
        }

        .fppl-hero__ticket-code {
          display: block;
          font-family: 'Space Grotesk', sans-serif;
          font-size: 0.85rem;
          font-weight: 700;
          color: #1a1a1a;
          text-transform: uppercase;
          letter-spacing: -0.01em;
        }

        .fppl-hero__ticket-city {
          font-size: 0.55rem;
          color: #888;
          text-transform: uppercase;
          letter-spacing: 0.05em;
        }

        .fppl-hero__ticket-arrow {
          display: flex;
          align-items: center;
        }

        /* Perforation Effect with True Cutouts */
        .fppl-hero__ticket-perf {
          width: 14px;
          background: #fff;
          position: relative;
        }

        .fppl-hero__ticket-perf::before {
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

        /* Ticket container with mask for true transparent holes */
        .fppl-hero__ticket {
          -webkit-mask-image:
            radial-gradient(circle at calc(100% - 83px) 0, transparent 6px, black 6.5px),
            radial-gradient(circle at calc(100% - 83px) 100%, transparent 6px, black 6.5px);
          -webkit-mask-composite: source-in;
          mask-image:
            radial-gradient(circle at calc(100% - 83px) 0, transparent 6px, black 6.5px),
            radial-gradient(circle at calc(100% - 83px) 100%, transparent 6px, black 6.5px);
          mask-composite: intersect;
        }

        /* Stub Section */
        .fppl-hero__ticket-stub {
          background: #fafafa;
          padding: 0.5rem 0.75rem;
          display: flex;
          align-items: center;
        }

        .fppl-hero__ticket-stub-row {
          display: flex;
          flex-direction: column;
          gap: 0.35rem;
        }

        .fppl-hero__ticket-stub-row > div {
          display: flex;
          align-items: center;
          gap: 0.4rem;
        }

        .fppl-hero__ticket-lbl {
          font-family: 'Space Grotesk', sans-serif;
          font-size: 0.45rem;
          color: #999;
          letter-spacing: 0.1em;
          min-width: 28px;
        }

        .fppl-hero__ticket-stub-row > div > span:not(.fppl-hero__ticket-lbl) {
          font-family: 'Share Tech Mono', monospace;
          font-weight: 600;
          font-size: 0.7rem;
          color: #1a1a1a;
        }


        /* Particles - keep for other sections */
        .fppl-particles {
          position: absolute;
          inset: 0;
          pointer-events: none;
          overflow: hidden;
        }

        .fppl-particle {
          position: absolute;
          width: 4px;
          height: 4px;
          background: #1a1a1a;
          border-radius: 50%;
        }

        /* ===== SECTION DIVIDERS ===== */
        .fppl-intro,
        .fppl-ground,
        .fppl-where-faq,
        .fppl-visit,
        .fppl-summary {
          position: relative;
        }

        .fppl-intro::before,
        .fppl-ground::before,
        .fppl-where-faq::before,
        .fppl-visit::before {
          content: '';
          position: absolute;
          top: 0;
          left: 50%;
          transform: translateX(-50%);
          width: min(80%, 600px);
          height: 1px;
          background: linear-gradient(90deg, transparent, #e0deda, transparent);
        }

        /* ===== INTRO ===== */
        .fppl-intro {
          padding: 3rem 2rem;
          background: #fff;
        }

        .fppl-intro__container {
          max-width: 1000px;
          margin: 0 auto;
        }

        .fppl-intro__header {
          text-align: center;
          max-width: 800px;
          margin: 0 auto 2rem;
        }

        .fppl-intro__header h2 {
          font-size: clamp(1.75rem, 3.5vw, 2.5rem);
          margin: 0.5rem 0 1rem;
          text-transform: uppercase;
        }

        .fppl-intro__header p {
          color: #666;
          font-size: 1rem;
          line-height: 1.7;
        }

        .fppl-intro__body {
          color: #666;
          font-size: 1rem;
          line-height: 1.7;
          padding-top: 2rem;
          text-align: center;
        }

        .fppl-intro__network {
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
        }

        .fppl-intro__leads {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 0.5rem;
        }

        .fppl-intro__leads > div {
          height: 100%;
        }

        .fppl-intro__leads .fppl-intro__q-card {
          height: 100%;
          display: flex;
          flex-direction: row;
        }

        .fppl-intro__q-card {
          display: flex;
          flex-wrap: wrap;
          gap: 1rem;
          background: #faf9f6;
          padding: 1rem;
          border: 1px solid rgba(0,0,0,0.12);
          border-radius: 6px;
          position: relative;
        }

        .fppl-intro__q-card::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          width: 3px;
          height: 100%;
          background: #1a1a1a;
          border-radius: 6px 0 0 6px;
        }

        /* display:contents makes q-top transparent to the parent flex layout;
           image and info become direct flex children of q-card on desktop.
           Do not add ARIA roles here — display:contents removes the element
           from the accessibility tree in most browsers. */
        .fppl-intro__q-top {
          display: contents;
        }

        .fppl-intro__q-bio-row {
          flex-basis: 100%;
          padding-top: 0.625rem;
          border-top: 1px solid #f0f0ee;
        }

        .fppl-intro__q-bio-row p {
          color: #666;
          line-height: 1.5;
          margin: 0;
          font-size: 0.85rem;
        }

        .fppl-intro__q-image {
          position: relative;
          flex-shrink: 0;
        }

        .fppl-intro__q-image img {
          width: 100px;
          height: 100px;
          object-fit: cover;
        }

        .fppl-intro__q-info h3 {
          margin: 0 0 0.1rem;
          font-size: 1.1rem;
          text-transform: uppercase;
        }

        .fppl-intro__q-title {
          display: block;
          color: #666;
          font-size: 0.6rem;
          letter-spacing: 0.15em;
          text-transform: uppercase;
          margin-bottom: 0.75rem;
        }

        .fppl-intro__q-stats {
          display: flex;
          align-items: center;
          gap: 1rem;
          margin-bottom: 0.75rem;
        }

        .fppl-intro__divider {
          width: 1px;
          height: 24px;
          background: linear-gradient(to bottom, transparent, #e8e6e2, transparent);
        }

        .fppl-intro__q-stat {
          text-align: center;
        }

        .fppl-intro__stat-value {
          display: block;
          font-size: 1.25rem;
          font-weight: 700;
          color: #1a1a1a;
          font-family: 'Share Tech Mono', monospace;
        }

        .fppl-intro__stat-label {
          font-size: 0.6rem;
          color: #999;
          text-transform: uppercase;
          letter-spacing: 0.15em;
          white-space: nowrap;
        }

        .fppl-intro__team {
          display: flex;
          flex-direction: column;
          align-items: stretch;
          gap: 0.5rem;
        }

        .fppl-intro__team-label {
          font-size: 0.6rem;
          letter-spacing: 0.2em;
          text-transform: uppercase;
          color: #999;
          white-space: nowrap;
          text-align: center;
        }

        .fppl-intro__instructors {
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
        }

        .fppl-intro__instructor {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          background: #faf9f6;
          padding: 0.5rem 1rem;
          border: 1px solid rgba(0,0,0,0.12);
          border-left: 3px solid #1a1a1a;
          border-radius: 6px;
        }

        .fppl-intro__instructor-name {
          font-size: 0.75rem;
          font-weight: 600;
        }

        .fppl-intro__instructor-title {
          font-size: 0.6rem;
          color: #888;
          margin-left: auto;
        }

        .fppl-intro__instructor-num {
          display: block;
          font-family: 'Share Tech Mono', monospace;
          font-size: 0.65rem;
          color: #ccc;
          margin-bottom: 0.35rem;
        }

        .fppl-intro__instructor-title {
          display: block;
          font-size: 0.8rem;
          font-weight: 500;
          text-transform: uppercase;
          letter-spacing: 0.05em;
        }

        /* ===== GROUND SCHOOL ===== */
        .fppl-ground {
          padding: 5rem 2rem 30px;
          background: #faf9f6;
        }

        .fppl-ground__container {
          max-width: 900px;
          margin: 0 auto;
        }

        .fppl-ground__grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 6px;
        }

        .fppl-ground__dots {
          display: none;
        }

        .fppl-ground__card {
          background: #fff;
          padding: 1.5rem;
          display: flex;
          gap: 1.25rem;
          align-items: flex-start;
          cursor: default;
          border-radius: 8px;
          border: 1px solid rgba(0,0,0,0.08);
        }

        .fppl-ground__num {
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

        .fppl-ground__text h4 {
          margin: 0 0 0.25rem;
          font-size: 0.95rem;
          font-weight: 600;
        }

        .fppl-ground__text p {
          margin: 0;
          font-size: 0.8rem;
          color: #888;
        }

        .fppl-ground__exams {
          margin-top: 2rem;
          text-align: center;
          max-width: 700px;
          margin-left: auto;
          margin-right: auto;
        }

        .fppl-ground__exams p {
          font-size: 0.95rem;
          color: #666;
          line-height: 1.7;
          margin: 0;
        }

        .fppl-ground__included {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 0.5rem;
          background: #fff;
          border: 1px solid #e8e6e2;
          padding: 0.5rem 1rem;
          margin-top: 1.5rem;
          border-radius: 4px;
          width: fit-content;
          margin-left: auto;
          margin-right: auto;
        }

        .fppl-ground__included-text {
          font-size: 0.75rem;
          font-weight: 600;
          color: #1a1a1a;
        }

        .fppl-ground__included-badge {
          background: rgba(34, 197, 94, 0.1);
          border: 1px solid rgba(34, 197, 94, 0.3);
          color: #16a34a;
          padding: 0.2rem 0.5rem;
          font-size: 0.55rem;
          font-weight: 700;
          letter-spacing: 0.1em;
          border-radius: 3px;
          text-transform: uppercase;
        }

        .fppl-ground::after {
          content: '';
          position: absolute;
          bottom: 0;
          left: 50%;
          transform: translateX(-50%);
          width: min(80%, 600px);
          height: 1px;
          background: linear-gradient(90deg, transparent, #e0deda, transparent);
        }

        /* ===== WHERE & FAQ (df-location-faq) ===== */
        .df-label {
          display: flex;
          align-items: center;
          gap: 1rem;
          white-space: nowrap;
          font-family: 'Share Tech Mono', monospace;
          font-size: 0.7rem;
          text-transform: uppercase;
          letter-spacing: 0.2em;
          color: #999;
          margin-bottom: 0.75rem;
        }

        .df-label::before,
        .df-label::after {
          content: '';
          flex: 1;
          height: 1px;
          background: #e0ddd8;
          min-width: 20px;
        }

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

        .df-btn--outline {
          background: transparent;
          color: #1a1a1a;
          border: 2px solid #1a1a1a;
        }

        .df-btn--outline:hover {
          background: #1a1a1a;
          color: #fff;
        }

        .df-location-faq {
          padding: 0 2rem 4rem;
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

        .df-location {
          display: flex;
          flex-direction: column;
          height: 100%;
        }

        .df-location .arrival__card {
          padding-left: 0;
          padding-right: 0;
          margin-left: 0;
          margin-right: 0;
        }

        .df-location__header {
          display: block;
          margin-bottom: 1.5rem;
          text-align: center;
        }

        @media (min-width: 1025px) {
          .df-location__header {
            display: block;
          }
        }


        .df-location__header h2 {
          font-size: 1.5rem;
          font-weight: 700;
          text-transform: uppercase;
          margin: 0;
        }

        /* FAQ (df) */
        .df-faq__header {
          margin-bottom: 2rem;
          text-align: center;
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
          flex: 1;
          min-height: 0;
          overflow-y: auto;
          scrollbar-width: thin;
          scrollbar-color: #e0deda transparent;
        }

        .df-faq__load-more {
          display: none;
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

        @media (min-width: 1025px) {
          .df-faq__header .df-label,
          .df-location__header .df-label {
            display: block;
          }
          .df-faq__header .df-label::before,
          .df-faq__header .df-label::after,
          .df-location__header .df-label::before,
          .df-location__header .df-label::after {
            display: none;
          }
          .df-faq__header h2,
          .df-location__header h2 {
            text-align: center;
          }
        }

        /* ===== PRE-TEXT & GRADIENT TEXT ===== */
        .fppl-pre-text {
          display: block;
          font-family: 'Share Tech Mono', monospace;
          font-size: 0.7rem;
          text-transform: uppercase;
          letter-spacing: 0.2em;
          color: #999;
          margin-bottom: 0.75rem;
        }

        .fppl-text--dark { color: #1a1a1a; }
        .fppl-text--mid { color: #4a4a4a; }
        .fppl-text--light { color: #7a7a7a; }

        .fppl-link {
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

        .fppl-link:hover {
          border-color: #1a1a1a;
        }

        .fppl-link svg {
          transition: transform 0.3s ease;
        }

        .fppl-link:hover svg {
          transform: translateX(3px);
        }

        /* ===== DISCOVERY CTA ===== */
        .fppl-discovery-card {
          border: 1px solid rgba(0,0,0,0.28);
          border-radius: 8px;
        }

        .fppl-discovery {
          background: #3a3a3a;
          position: relative;
          overflow: hidden;
          border-radius: 8px 8px 0 0;
        }

        .fppl-discovery::after {
          content: '';
          position: absolute;
          bottom: 0;
          left: 0;
          right: 0;
          height: 4px;
          background: linear-gradient(to right, #444 0%, #444 35%, #777 50%, #444 65%, #444 100%);
        }

        .fppl-discovery__inner {
          display: grid;
          grid-template-columns: 1fr 1fr;
          height: 300px;
          border-radius: 8px 8px 0 0;
        }

        .fppl-discovery__image {
          position: relative;
          overflow: hidden;
          border-radius: 8px 0 0 0;
        }

        .fppl-discovery__image img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }

        .fppl-discovery__image-overlay {
          position: absolute;
          inset: 0;
          background: linear-gradient(90deg, rgba(26,26,26,0.3) 0%, transparent 50%);
          border-radius: 8px 0 0 0;
        }

        .fppl-discovery__price--image {
          display: none;
        }

        .fppl-discovery__content {
          padding: 3rem 3rem;
          display: flex;
          flex-direction: column;
          justify-content: center;
          color: #fff;
          border-radius: 0 8px 0 0;
        }

        .fppl-discovery__content .fppl-pre-text {
          display: block;
          color: rgba(255,255,255,0.5);
        }

        .fppl-discovery__content .fppl-pre-text::before,
        .fppl-discovery__content .fppl-pre-text::after {
          display: none;
        }

        .fppl-discovery__header h2 {
          font-size: clamp(1.75rem, 3.5vw, 2.5rem);
          font-weight: 700;
          text-transform: uppercase;
          line-height: 1.1;
          margin: 0 0 1.25rem;
        }

        .fppl-discovery__header .fppl-text--dark { color: #fff; }
        .fppl-discovery__header .fppl-text--mid { color: rgba(255,255,255,0.6); }

        .fppl-discovery__desc {
          color: rgba(255,255,255,0.7);
          font-size: 1rem;
          line-height: 1.7;
          margin-bottom: 1.5rem;
          max-width: 480px;
        }

        .fppl-discovery__details {
          display: flex;
          align-items: center;
          gap: 1.5rem;
          margin-bottom: 1.5rem;
          padding-bottom: 1.25rem;
          border-bottom: 1px solid rgba(255,255,255,0.15);
        }

        .fppl-discovery__detail {
          text-align: center;
        }

        .fppl-discovery__detail-num {
          display: block;
          font-family: 'Share Tech Mono', monospace;
          font-size: 1.5rem;
          font-weight: 700;
          color: #fff;
          line-height: 1;
          margin-bottom: 0.35rem;
        }

        .fppl-discovery__detail-label {
          display: block;
          font-size: 0.6rem;
          text-transform: uppercase;
          letter-spacing: 0.12em;
          color: rgba(255,255,255,0.5);
        }

        .fppl-discovery__detail-divider {
          width: 1px;
          height: 30px;
          background: linear-gradient(to bottom, transparent, rgba(255,255,255,0.3), transparent);
        }

        .fppl-discovery__price-block {
          display: flex;
          align-items: flex-end;
          gap: 2rem;
        }

        .fppl-discovery__price {
          display: flex;
          flex-direction: column;
        }

        .fppl-discovery__price-from {
          font-size: 0.7rem;
          text-transform: uppercase;
          letter-spacing: 0.15em;
          color: rgba(255,255,255,0.5);
          margin-bottom: 0.25rem;
        }

        .fppl-discovery__price-amount {
          font-family: 'Share Tech Mono', monospace;
          font-size: 2.25rem;
          font-weight: 700;
          color: #fff;
          line-height: 1;
        }

        .fppl-discovery__actions {
          display: flex;
          flex-direction: column;
          gap: 0.75rem;
        }

        .fppl-discovery__actions .fppl-btn--primary {
          background: #fff;
          color: #1a1a1a;
        }

        .fppl-discovery__actions .fppl-btn--primary:hover {
          background: #f0f0f0;
        }

        .fppl-discovery__actions .fppl-link {
          color: rgba(255,255,255,0.7);
          border-color: rgba(255,255,255,0.3);
        }

        .fppl-discovery__actions .fppl-link:hover {
          color: #fff;
          border-color: rgba(255,255,255,0.6);
        }

        /* ===== COMPACT DISCOVERY VARIANT ===== */
        .fppl-discovery--compact .fppl-discovery__inner {
          grid-template-columns: 35% 65%;
          min-height: 320px;
        }

        .fppl-discovery--compact .fppl-discovery__content {
          padding: 2rem;
        }

        .fppl-discovery--compact .fppl-discovery__header {
          margin-bottom: 0.5rem;
        }

        .fppl-discovery--compact .fppl-discovery__header h2 {
          font-size: 1.5rem;
          margin-bottom: 0.5rem;
        }

        .fppl-discovery--compact .fppl-pre-text {
          margin-bottom: 0.5rem;
        }

        .fppl-discovery--compact .fppl-discovery__desc {
          font-size: 0.9rem;
          margin-bottom: 1rem;
          max-width: 380px;
        }

        .fppl-discovery__compact-row {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 2rem;
          padding-top: 1.25rem;
          margin-top: auto;
          border-top: 1px solid rgba(255,255,255,0.15);
          border-radius: 0;
        }

        .fppl-discovery__selling-points {
          display: flex;
          flex-wrap: nowrap;
          gap: 0.75rem 1.5rem;
        }

        .fppl-discovery__selling-points--below {
          display: none;
        }

        .fppl-discovery__selling-points--inline {
          order: -1;
        }

        .fppl-discovery__pt-narrow {
          display: none;
        }

        .fppl-discovery__point {
          display: flex;
          align-items: center;
          gap: 0.5rem;
        }

        .fppl-discovery__point-icon {
          font-size: 0.9rem;
        }

        .fppl-discovery__point-text {
          font-size: 0.8rem;
          color: rgba(255,255,255,0.8);
          white-space: nowrap;
        }

        .fppl-discovery__booking {
          display: flex;
          align-items: center;
          gap: 1.5rem;
          flex-shrink: 0;
        }

        .fppl-discovery__book-btn {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          padding: 0.9rem 1.5rem;
          background: #fff;
          color: #1a1a1a;
          text-decoration: none;
          font-size: 0.75rem;
          font-weight: 600;
          text-transform: uppercase;
          letter-spacing: 0.1em;
          transition: all 0.3s ease;
          border: none;
        }

        .fppl-discovery__book-btn:hover {
          background: #f0f0f0;
          gap: 1rem;
        }

        .fppl-discovery__book-btn-text {
          white-space: nowrap;
        }

        .fppl-discovery__book-btn-arrow {
          font-size: 1rem;
          transition: transform 0.3s ease;
        }

        .fppl-discovery__book-btn:hover .fppl-discovery__book-btn-arrow {
          transform: translateX(4px);
        }

        .fppl-discovery--compact .fppl-discovery__details {
          margin-bottom: 0;
          padding-bottom: 0;
          border-bottom: none;
          gap: 1rem;
        }

        .fppl-discovery--compact .fppl-discovery__detail-num {
          font-size: 1.25rem;
        }

        .fppl-discovery--compact .fppl-discovery__price-block {
          flex-direction: row;
          align-items: center;
          gap: 1.5rem;
        }

        .fppl-discovery--compact .fppl-discovery__price-amount {
          font-size: 1.75rem;
        }

        /* ===== VISIT CTA ===== */
        .fppl-visit {
          background: #fff;
        }

        .fppl-visit__content-wrap {
          padding: 40px clamp(0px, calc(50vw - 153px), 2rem) 30px;
        }

        /* Gallery Styles */
        .fppl-visit__gallery {
          margin: 1rem 0 1.5rem;
          width: 100vw;
          position: relative;
          left: 50%;
          transform: translateX(-50%);
        }

        .fppl-visit__gallery-track {
          display: flex;
          gap: 4px;
        }

        .fppl-visit__gallery-item {
          flex: 1;
          min-width: 0;
          aspect-ratio: 4/3;
          overflow: hidden;
          position: relative;
        }

        .fppl-visit__gallery-item img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          transition: transform 0.6s ease;
        }

        .fppl-visit__gallery-item:hover img {
          transform: scale(1.05);
        }

        /* V3: Seamless Panorama */
        .gallery-v3 {
          position: relative;
        }

        .gallery-v3::before,
        .gallery-v3::after {
          content: '';
          position: absolute;
          left: 0;
          right: 0;
          height: 25%;
          z-index: 6;
          pointer-events: none;
        }

        .gallery-v3::before {
          top: 0;
          background: linear-gradient(to bottom, rgba(0,0,0,0.4) 0%, transparent 100%);
        }

        .gallery-v3::after {
          bottom: 0;
          background: linear-gradient(to top, rgba(0,0,0,0.4) 0%, transparent 100%);
        }

        .gallery-v3 .fppl-visit__gallery-track {
          gap: 0;
          position: relative;
        }

        .gallery-v3 .fppl-visit__gallery-track::before,
        .gallery-v3 .fppl-visit__gallery-track::after {
          content: '';
          position: absolute;
          top: 0;
          width: 30%;
          height: 100%;
          z-index: 5;
          pointer-events: none;
        }

        .gallery-v3 .fppl-visit__gallery-track::before {
          left: 0;
          background: linear-gradient(to right, rgba(0,0,0,1) 0%, rgba(0,0,0,0.5) 40%, transparent 100%);
        }

        .gallery-v3 .fppl-visit__gallery-track::after {
          right: 0;
          background: linear-gradient(to left, rgba(0,0,0,1) 0%, rgba(0,0,0,0.5) 40%, transparent 100%);
        }

        .gallery-v3 .fppl-visit__gallery-item {
          aspect-ratio: 16/9;
        }

        .gallery-v3 .fppl-visit__gallery-item:not(:last-child)::after {
          content: '';
          position: absolute;
          top: 0;
          right: 0;
          width: 3px;
          height: 100%;
          background: linear-gradient(to bottom, transparent 15%, rgba(128,128,128,0.25) 50%, transparent 85%);
          z-index: 3;
        }


        /* FAQ/Discovery wrapper — transparent on desktop */
        .fppl__faq-discovery-wrap {
          display: contents;
        }

        .fppl-visit__content {
          max-width: 100%;
          margin: 0 auto;
        }

        .fppl-visit__header {
          text-align: center;
          margin-bottom: 1.25rem;
        }

        .fppl-visit__header h2 {
          font-size: clamp(2rem, 4vw, 3rem);
          font-weight: 700;
          text-transform: uppercase;
          line-height: 1.1;
          margin: 0 0 1.5rem;
        }

        .fppl-visit__header p {
          color: #666;
          font-size: 0.9rem;
          line-height: 1.5;
          max-width: 600px;
          margin: 0 auto;
        }

        .fppl-visit__details {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 2rem;
          margin-bottom: 3rem;
        }

        .fppl-visit__detail-card {
          display: flex;
          gap: 1.25rem;
          padding: 1.5rem;
          background: #fff;
          border: 1px solid #e8e6e2;
        }

        .fppl-visit__detail-icon {
          color: #2563eb;
          flex-shrink: 0;
        }

        .fppl-visit__detail-text {
          display: flex;
          flex-direction: column;
        }

        .fppl-visit__detail-label {
          font-size: 0.65rem;
          text-transform: uppercase;
          letter-spacing: 0.2em;
          color: #999;
          margin-bottom: 0.5rem;
        }

        .fppl-visit__detail-value {
          font-size: 1rem;
          font-weight: 600;
          color: #1a1a1a;
          margin-bottom: 0.25rem;
        }

        .fppl-visit__detail-value--mono {
          font-family: 'Share Tech Mono', monospace;
        }

        .fppl-visit__detail-sub {
          font-size: 0.85rem;
          color: #888;
        }

        .fppl-visit__detail-sub--mono {
          font-family: 'Share Tech Mono', monospace;
        }

        .fppl-visit__fleet {
          text-align: center;
          padding: 2rem 0;
          border-top: 1px solid #e8e6e2;
          border-bottom: 1px solid #e8e6e2;
          margin-bottom: 2.5rem;
        }

        .fppl-visit__fleet-label {
          display: block;
          font-size: 0.65rem;
          text-transform: uppercase;
          letter-spacing: 0.2em;
          color: #999;
          margin-bottom: 1rem;
        }

        .fppl-visit__fleet-list {
          display: flex;
          justify-content: center;
          gap: 1rem;
        }

        .fppl-visit__fleet-list span {
          padding: 0.6rem 1.5rem;
          background: #fff;
          border: 1px solid #e8e6e2;
          font-size: 0.8rem;
          font-weight: 500;
          transition: all 0.3s ease;
        }

        .fppl-visit__fleet-list span:hover {
          border-color: #1a1a1a;
        }

        .fppl-visit__cta {
          display: flex;
          justify-content: center;
          align-items: center;
          gap: 2rem;
          margin-bottom: 1.5rem;
        }

        .fppl-visit__note-card {
          background: #faf9f6;
          border-radius: 0 0 8px 8px;
          padding: 1.25rem 1.5rem;
        }

        .fppl-visit__note-wrap {
          text-align: center;
          margin-top: 0;
          padding-bottom: 0;
        }

        .fppl-visit__note-divider {
          width: 60px;
          height: 1px;
          background: #e8e6e2;
          margin: 0 auto 1.5rem;
        }

        .fppl-visit__note-title {
          font-family: 'Space Grotesk', sans-serif;
          font-size: 0.8rem;
          font-weight: 600;
          letter-spacing: 0.1em;
          text-transform: uppercase;
          color: #1a1a1a;
          display: block;
          margin-bottom: 0.5rem;
        }

        .fppl-visit__note {
          text-align: center;
          font-size: 0.85rem;
          color: #888;
          margin: 0;
        }

        /* ===== RESPONSIVE ===== */
        @media (max-width: 1400px) {
          .fppl-discovery__selling-points--below {
            display: flex;
          }

          .fppl-discovery__selling-points--inline {
            display: none;
          }

          .fppl-discovery__booking {
            width: 100%;
          }

          .fppl-discovery__book-btn {
            margin-left: auto;
          }
        }

        @media (max-width: 1024px) {
          .fppl-hero__panel {
            display: none;
          }

          .fppl-hero__grid {
            grid-template-columns: 1fr;
          }

          .df-location-faq__container {
            grid-template-columns: 1fr;
            gap: 2.5rem;
          }

          .df-location-faq__divider {
            display: none;
          }

          .df-location-faq__actions {
            grid-template-columns: 1fr;
            gap: 1rem;
          }

          .df-faq__header h2 {
            text-align: center;
          }

          .df-location__header h2 {
            text-align: center;
          }

          .fppl-discovery--compact .fppl-discovery__compact-row {
            flex-direction: column;
            align-items: flex-start;
            gap: 1rem;
          }

          .fppl-discovery--compact .fppl-discovery__price-block {
            width: 100%;
            justify-content: space-between;
          }

          .fppl-discovery__compact-row {
            flex-direction: column;
            align-items: flex-start;
            gap: 1.25rem;
          }

          .fppl-discovery__selling-points {
            gap: 0.5rem 1rem;
          }

          .fppl-discovery__booking {
            width: 100%;
            justify-content: space-between;
          }

          .fppl-discovery__inner {
            grid-template-columns: 40% 60%;
            min-height: 420px;
          }

          .fppl-discovery__content {
            padding: 2.5rem 2rem;
          }

          .fppl-visit__details {
            grid-template-columns: 1fr;
            gap: 1rem;
          }

          .fppl-visit__cta {
            flex-direction: column;
            gap: 1rem;
          }

        }

        @media (max-width: 850px) {
          .fppl-ground__grid {
            grid-template-columns: unset;
            grid-template-rows: repeat(3, auto);
            grid-auto-flow: column;
            grid-auto-columns: 100%;
            overflow-x: auto;
            overflow-y: hidden;
            -webkit-overflow-scrolling: touch;
            scrollbar-width: none;
            scroll-snap-type: x mandatory;
            background: transparent;
            padding: 0;
            gap: 6px;
          }

          .fppl-ground__grid::-webkit-scrollbar {
            display: none;
          }

          .fppl-ground__grid > * {
            scroll-snap-align: start;
          }

          .fppl-ground__dots {
            display: flex;
            justify-content: center;
            gap: 6px;
            padding-top: 14px;
          }

          .fppl-ground__dot {
            width: 6px;
            height: 6px;
            border-radius: 50%;
            border: none;
            padding: 0;
            background: #d0cdc8;
            cursor: pointer;
            transition: background 0.2s;
          }

          .fppl-ground__dot--active {
            background: #1a1a1a;
          }

          .fppl-ground__exams {
            margin-top: 0.75rem;
          }

          .fppl-intro {
            padding: 3rem 1rem 1.5rem;
          }

          .fppl-ground {
            padding-top: 2rem;
          }

          .fppl-intro__network {
            gap: 12px;
          }

          .fppl-intro__leads {
            grid-template-columns: 1fr;
            gap: 12px;
          }

          .fppl-intro__instructors {
            gap: 12px;
          }

          /* Grid replaces flex on the card so image spans the full height
             of the name/title/stats column.
             Uses higher-specificity selector to beat the base
             .fppl-intro__leads .fppl-intro__q-card { display: flex } rule. */
          .fppl-intro__leads .fppl-intro__q-card {
            display: grid;
            height: auto;
            grid-template-areas:
              "photo name"
              "photo title"
              "photo stats"
              "bio   bio";
            grid-template-columns: 72px 1fr;
            grid-template-rows: auto auto 1fr auto;
            column-gap: 0.875rem;
            row-gap: 0.2rem;
          }

          /* Both wrappers become transparent so their children are
             direct grid items placed by grid-area below. */
          .fppl-intro__q-top {
            display: contents;
          }

          .fppl-intro__q-info {
            display: contents;
          }

          .fppl-intro__q-image {
            grid-area: photo;
            align-self: stretch;
          }

          .fppl-intro__q-image img {
            width: 72px;
            height: 100%;
            object-fit: cover;
            object-position: top center;
            border-radius: 6px;
          }

          .fppl-intro__q-card h3 {
            grid-area: name;
            align-self: end;
            margin-bottom: 0;
          }

          .fppl-intro__q-title {
            grid-area: title;
            align-self: start;
            margin-bottom: 0;
          }

          .fppl-intro__q-stats {
            grid-area: stats;
            margin-bottom: 0;
            margin-top: 0.4rem;
            align-self: start;
          }

          .fppl-intro__q-bio-row {
            grid-area: bio;
            flex-basis: auto;
            padding-top: 0.5rem;
          }


          .df-location-faq__actions {
            display: none;
          }

          .fppl-visit__header {
            margin-bottom: 0.875rem;
          }

          .fppl__faq-discovery-wrap {
            display: flex;
            flex-direction: column;
          }

          #discovery {
            order: -1;
          }

          .df-location-faq {
            padding-top: 2.5rem;
          }

          .fppl-discovery__inner {
            display: flex;
            flex-direction: column;
            height: unset;
          }

          .fppl-discovery__image {
            height: 200px;
          }

          .fppl-discovery__image img {
            object-position: center 20%;
          }

          .fppl-discovery__price--image {
            display: flex;
            position: absolute;
            bottom: 0.75rem;
            left: 0.75rem;
            flex-direction: column;
            background: rgba(0,0,0,0.45);
            padding: 0.35rem 0.6rem;
            border-radius: 4px;
          }

          .fppl-discovery__price--booking {
            display: none;
          }

          .fppl-discovery__book-btn {
            width: 100%;
            justify-content: center;
          }

          .fppl-discovery__selling-points--below {
            display: none;
          }

          .fppl-discovery__selling-points--inline {
            display: flex;
            order: 0;
            justify-content: space-between;
            width: 100%;
          }

          .fppl-pre-text {
            display: flex;
            align-items: center;
            gap: 1rem;
            white-space: nowrap;
          }

          .fppl-pre-text::before,
          .fppl-pre-text::after {
            content: '';
            flex: 1;
            height: 1px;
            background: #e0ddd8;
            min-width: 20px;
          }

          .fppl-visit__gallery {
            display: none;
          }

          .fppl-hero__overlay {
            background: linear-gradient(180deg, rgba(250,249,246,0.97) 0%, rgba(250,249,246,0.92) 60%, rgba(250,249,246,0.7) 100%);
          }

          .fppl-hero__content {
            padding: 5rem 2rem 2rem;
            justify-content: center;
          }

          .fppl-hero__left {
            text-align: center;
            max-width: 100%;
          }

          .fppl-hero__headline {
            align-items: center;
          }

          .fppl-hero__divider-line {
            margin: 1.5rem auto;
          }

          .fppl-hero__sub {
            margin: 0 auto;
            text-align: center;
          }

          .fppl-hero__ticket {
            max-width: 280px;
            margin: 0 auto 1.5rem;
          }

          .fppl-hero__ticket-stub-row {
            gap: 0.25rem;
          }

          .fppl-discovery__inner {
            grid-template-columns: 35% 65%;
            min-height: auto;
          }

          .fppl-discovery__content {
            padding: 2rem 1.5rem 18px;
          }

          .fppl-discovery__header h2 {
            font-size: 1.35rem;
            margin-bottom: 0.75rem;
          }

          .fppl-discovery__desc {
            font-size: 0.85rem;
            margin-bottom: 1rem;
          }

          .fppl-discovery__details {
            flex-direction: column;
            gap: 0.75rem;
            margin-bottom: 1rem;
            padding-bottom: 1rem;
          }

          .fppl-discovery__detail-num {
            font-size: 1.25rem;
          }

          .fppl-discovery__detail-divider {
            width: 40px;
            height: 1px;
          }

          .fppl-discovery__price-block {
            flex-direction: column;
            align-items: flex-start;
            gap: 1rem;
          }

          .fppl-discovery__price-amount {
            font-size: 1.75rem;
          }

          .fppl-visit__fleet-list {
            flex-wrap: wrap;
            justify-content: center;
          }
        }

        @media (max-width: 768px) {
          .df-faq__list {
            overflow-y: visible;
            flex: unset;
            min-height: unset;
          }
          .df-faq__item--mobile-hidden {
            display: none;
          }
          .df-faq__load-more {
            display: block;
            width: 100%;
            margin-top: 1.5rem;
            padding: 0.9rem 1.5rem;
            background: transparent;
            border: 1px solid #1a1a1a;
            color: #1a1a1a;
            font-family: 'Share Tech Mono', monospace;
            font-size: 0.72rem;
            letter-spacing: 0.12em;
            text-transform: uppercase;
            cursor: pointer;
            transition: background 0.2s ease, color 0.2s ease;
          }
          .df-faq__load-more:hover {
            background: #1a1a1a;
            color: #fff;
          }
        }

        @media (max-width: 555px) {
          .fppl-discovery__inner {
            grid-template-columns: 30% 70%;
          }

          .fppl-discovery__content {
            padding: 1.5rem 0.75rem;
          }

          .fppl-discovery__header h2 {
            font-size: 1.25rem;
          }

          .fppl-discovery__desc {
            font-size: 0.85rem;
            line-height: 1.6;
          }

          .fppl-discovery__selling-points {
            gap: 0.25rem 0.5rem;
          }

          .fppl-discovery__point {
            gap: 0.25rem;
          }

          .fppl-discovery__point-text {
            font-size: 0.62rem;
          }

          .fppl-discovery__point-icon {
            font-size: 0.62rem;
          }

          .fppl-discovery__booking {
            flex-direction: row;
            align-items: center;
            justify-content: space-between;
            gap: 0.75rem;
          }

          .fppl-discovery__book-btn {
            padding: 0.75rem 1.25rem;
            font-size: 0.7rem;
          }

          .fppl-discovery__details {
            gap: 0.75rem;
          }

          .fppl-discovery__detail-num {
            font-size: 1rem;
            margin-bottom: 0.25rem;
          }

          .fppl-discovery__detail-label {
            font-size: 0.55rem;
          }

          .fppl-discovery__price-amount {
            font-size: 1.5rem;
          }

          .fppl-discovery__actions {
            width: 100%;
          }

          .fppl-discovery__actions .fppl-btn {
            width: 100%;
            text-align: center;
            padding: 0.75rem 1rem;
            font-size: 0.65rem;
          }

          .fppl-discovery--compact .fppl-discovery__inner {
            min-height: 280px;
          }

          .fppl-discovery--compact .fppl-discovery__content {
            padding: 1.5rem 1rem;
          }

          .fppl-visit__detail-card {
            flex-direction: column;
            text-align: center;
          }

          .fppl-visit__detail-icon {
            align-self: center;
          }

          .fppl-summary__grid {
            flex-direction: column;
            gap: 2rem;
          }

          .fppl-summary__hours {
            flex-wrap: wrap;
            gap: 0.5rem;
          }

          .fppl-summary__rates {
            flex-wrap: wrap;
            gap: 1rem;
          }

          .fppl-summary__rate-divider {
            display: none;
          }

          .fppl-summary__divider {
            display: none;
          }

          .fppl-summary__included {
            padding: 0.75rem 1rem;
            gap: 0.5rem;
          }

          .fppl-summary__included-text {
            font-size: 0.75rem;
          }
        }

        @media (max-width: 440px) {
          .fppl-discovery__pt-wide {
            display: none;
          }

          .fppl-discovery__pt-narrow {
            display: inline;
          }
        }
      `}</style>
    </div>
  );
}

export default FinalPPL;

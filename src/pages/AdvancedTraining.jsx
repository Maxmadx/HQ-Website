/**
 * ADVANCED TRAINING PAGE
 *
 * Autorotations, confined areas, mountain flying, and safety courses —
 * all delivered by instructors who live and breathe this aircraft.
 *
 * Brand: Luxury Minimal Aviation
 * Typography: Space Grotesk + Share Tech Mono
 * CSS prefix: adv-
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
import { buildCourse, buildBreadcrumbList } from '../components/seo/jsonLd';
import { SITE_URL } from '../lib/seoDefaults';

/**
 * ADVANCED TRAINING PAGE HEADER COMPONENT
 * Spotlight animation header consistent with other final pages
 */
function AdvancedTrainingHeader() {
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

function AdvancedTraining() {
  const heroRef = useRef(null);
  const [openFaq, setOpenFaq] = useState(null);
  const [showAllFaqs, setShowAllFaqs] = useState(false);
  const [activeCourse, setActiveCourse] = useState(null);
  const pageImages = usePageImages('advanced-training');
  useCmsHighlight();
  const { scrollYProgress } = useScroll({ target: heroRef, offset: ['start start', 'end start'] });
  useEffect(() => { window.scrollTo(0, 0); }, []);
  const heroOpacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);
  const heroScale = useTransform(scrollYProgress, [0, 0.5], [1, 0.95]);
  const heroY = useTransform(scrollYProgress, [0, 0.5], [0, 100]);
  const { faqs: rawFaqs } = useFaqs('advanced-training', { visibleOnly: true });
  const fallbackFaqs = [
    { id: 'f1', question: 'Do I need to be an experienced pilot for advanced training?', answer: 'Different courses suit different experience levels. The autorotation clinic is open to PPL(H) holders from 50 hours. Mountain flying and confined area work are better suited to pilots with 100+ hours. Safety courses are open to anyone. We\'ll tell you honestly if we think you need more experience first.' },
    { id: 'f2', question: 'Can I do multiple courses back to back?', answer: 'Yes, and it\'s often the most efficient way to advance your skills. We can structure a multi-day programme around your availability.' },
    { id: 'f3', question: 'Is Captain Q personally available for every session?', answer: 'Autorotation clinics are led by Captain Q directly. Other courses are conducted by HQ\'s experienced instructors. Contact us to discuss availability and scheduling.' },
    { id: 'f4', question: 'Will advanced training show on my licence?', answer: 'Training flights are entered in your logbook and contribute to your overall flight time. Some courses may contribute to specific ratings or qualifications depending on your goals; discuss this with us when booking.' },
    { id: 'f5', question: 'Where is the training conducted?', answer: 'Based at Denham Aerodrome, with mountain flying training involving day trips to suitable UK terrain. All courses use HQ\'s own aircraft.' },
  ];
  const faqs = rawFaqs.length > 0 ? rawFaqs : fallbackFaqs;

  // ── Data ──────────────────────────────────────────────────────────────────

  const skills = [
    // Emergencies
    { cat: 'Emergencies', title: 'Full Autorotations', desc: 'Engine-off landings to a point, not just routine practice flares.' },
    { cat: 'Emergencies', title: 'Tail Rotor Failures', desc: 'Jammed, broken and loss-of-drive scenarios worked through properly.' },
    { cat: 'Emergencies', title: 'Loss of Tail Rotor Effectiveness', desc: 'Recognising LTE before it bites, and getting out of it if it does.' },
    { cat: 'Emergencies', title: 'Vortex Ring State Recovery', desc: 'Entry, recognition and the correct recovery technique.' },
    { cat: 'Emergencies', title: 'Engine Failure Drills', desc: 'Hover, takeoff, cruise and climb. Every phase, under pressure.' },
    { cat: 'Emergencies', title: 'Hydraulic Failure', desc: 'Flying the aircraft heavy-stick and landing it safely.' },
    { cat: 'Emergencies', title: 'Governor Failure', desc: 'Manual throttle handling when the governor quits.' },
    { cat: 'Emergencies', title: 'Inadvertent IMC', desc: 'What to do in the first 60 seconds after losing visual reference.' },
    { cat: 'Emergencies', title: 'Carburettor Icing', desc: 'Detection, prevention and recovery on piston Robinsons.' },

    // Handling & Performance
    { cat: 'Handling', title: 'Power Management', desc: 'Knowing your margins, and flying inside them with precision.' },
    { cat: 'Handling', title: 'Quick Stops', desc: 'Aggressive deceleration drills for tight approaches.' },
    { cat: 'Handling', title: 'Precision Hovering', desc: 'Spot landings, wind corrections and close-quarters control.' },
    { cat: 'Handling', title: 'Unusual Attitude Recovery', desc: 'Disorienting attitudes and how to get back to level flight.' },
    { cat: 'Handling', title: 'Low-Inertia Rotor Technique', desc: 'Flying the Robinson rotor system the way it wants to be flown.' },
    { cat: 'Handling', title: 'Running Landings & Takeoffs', desc: 'When hovering isn\'t an option: performance-limited operations.' },

    // Terrain
    { cat: 'Terrain', title: 'Mountain Flying', desc: 'Route planning, density altitude and turbulence in the hills.' },
    { cat: 'Terrain', title: 'Pinnacle Landings', desc: 'Approach and departure from elevated, exposed sites.' },
    { cat: 'Terrain', title: 'Slope Landings', desc: 'Left-slope, right-slope, nose-up and nose-down techniques.' },
    { cat: 'Terrain', title: 'Confined Area Operations', desc: 'Reconnaissance, power checks and the go/no-go decision.' },
    { cat: 'Terrain', title: 'Off-Airport Site Assessment', desc: 'Judging a field or paddock before you commit to landing.' },
    { cat: 'Terrain', title: 'Over-Water Operations', desc: 'Planning, survival briefing and the specifics of flying blue.' },

    // Conditions
    { cat: 'Conditions', title: 'Hot-and-High Performance', desc: 'Density altitude maths that actually gets used in the cockpit.' },
    { cat: 'Conditions', title: 'Night Flying', desc: 'Night currency and the sensory traps of dark-sky operations.' },
    { cat: 'Conditions', title: 'Crosswind & Gusty Conditions', desc: 'Wind strategy, cyclic input and when to wait it out.' },
    { cat: 'Conditions', title: 'Weather Decision-Making', desc: 'Reading weather products, and the discipline to turn back.' },

    // Airmanship
    { cat: 'Airmanship', title: 'Performance Planning', desc: 'Weight and balance, H-V diagram and real mission planning.' },
    { cat: 'Airmanship', title: 'Single-Pilot CRM', desc: 'Workload management and self-checking when you\'re alone up front.' },
    { cat: 'Airmanship', title: 'Decision-Making Frameworks', desc: 'The mental models professional pilots actually use.' },
    { cat: 'Airmanship', title: 'Precision Navigation', desc: 'Map-reading, VFR navigation and in-cockpit nav discipline.' },
    { cat: 'Airmanship', title: 'Lost Comms & Radio Failure', desc: 'Procedure, lighting signals, and staying calm when radios die.' },

    // Signature
    { cat: 'Signature', title: 'Aerobatic Principles', desc: 'Insights from Q\'s aerobatic world records, applied to everyday flying.' },
    { cat: 'Signature', title: 'Long-Range Expedition Planning', desc: 'Lessons from circumnavigating the globe and crossing the poles.' },
  ];

  const instructorStats = [
    { value: '30+', label: 'Years Flying' },
    { value: '3', label: 'World Records' },
    { value: '18,000+', label: 'Flight Hours' },
    { value: 'CAA', label: 'Authorised Examiner' },
  ];

  // ── Render ─────────────────────────────────────────────────────────────────

  return (
    <div className="adv">
      <Seo
        title="Advanced Helicopter Training — UK Pilot Skills"
        description="Advanced post-licence training — confined areas, autorotations, formation flying."
        jsonLd={[
          buildCourse({
            name: 'Advanced Helicopter Training',
            description: 'Advanced post-licence training — confined areas, autorotations, formation flying.',
            url: `${SITE_URL}/training/advanced`,
            courseInstance: {
              '@type': 'CourseInstance',
              courseMode: 'in-person',
              location: 'Denham Aerodrome, UK',
            },
          }),
          buildBreadcrumbList([
            { name: 'Home', path: '/' },
            { name: 'Training', path: '/training/advanced' },
            { name: 'Advanced', path: '/training/advanced' },
          ]),
        ]}
      />
      <AdvancedTrainingHeader />

      {/* ========== HERO SECTION ========== */}
      <section ref={heroRef} className="adv-hero">
        {/* Background image */}
        <div
          className="adv-hero__bg"
          style={{
            backgroundImage: `url('${pageImages['advanced-hero']?.[0]?.url || '/assets/images/gallery/flying/flying--1.jpg'}')`,
          }}
        />
        <div className="adv-hero__overlay" />

        <motion.div
          className="adv-hero__content"
          style={{ opacity: heroOpacity, scale: heroScale, y: heroY }}
        >
          <div className="adv-hero__left">
            <motion.span
              className="adv-hero__label"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              Expert Instruction
            </motion.span>

            <div className="adv-hero__headline">
              <motion.span
                className="adv-hero__word adv-hero__word--1"
                initial={{ opacity: 0, y: 40 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.4, ease: [0.16, 1, 0.3, 1] }}
              >
                ADVANCED
              </motion.span>
              <motion.span
                className="adv-hero__word adv-hero__word--2"
                initial={{ opacity: 0, y: 40 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.6, ease: [0.16, 1, 0.3, 1] }}
              >
                TRAINING
              </motion.span>
            </div>

            <motion.div
              className="adv-hero__divider-line"
              initial={{ scaleX: 0 }}
              animate={{ scaleX: 1 }}
              transition={{ duration: 0.8, delay: 0.8, ease: [0.16, 1, 0.3, 1] }}
            />

            {/* Badge Card */}
            <motion.div
              className="adv-hero__badge"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1, duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            >
              <div className="adv-hero__badge-header">
                <span className="adv-hero__badge-label">Advanced Programme</span>
                <span className="adv-hero__badge-type">HQ AVIATION</span>
              </div>
              <div className="adv-hero__badge-content">
                <div className="adv-hero__badge-stat">
                  <span className="adv-hero__badge-num">4</span>
                  <span className="adv-hero__badge-desc">Specialisms</span>
                </div>
                <div className="adv-hero__badge-divider" />
                <div className="adv-hero__badge-stat">
                  <span className="adv-hero__badge-num adv-hero__badge-num--text">Captain Q</span>
                  <span className="adv-hero__badge-desc">Lead Instructor</span>
                </div>
              </div>
            </motion.div>

            <motion.p
              className="adv-hero__sub"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.2 }}
            >
              Autorotations, confined areas, mountain flying, and safety courses, all delivered by instructors who live and breathe this aircraft. Push your skills further with HQ's advanced programme.
            </motion.p>
          </div>
        </motion.div>
      </section>

      {/* ========== INTRO SECTION ========== */}
      <section className="adv-intro">
        <div className="adv-intro__container">
          <div className="adv-intro__grid">
            <div className="adv-intro__text">
              <Reveal>
                <span className="adv-pre-text">Beyond the Licence</span>
                <h2 className="adv-intro__heading">Sharp Skills.<br />Safer Pilot.</h2>
                <p className="adv-intro__body">
                  Holding a PPL(H) is the beginning of your journey, not the end of it. Advanced training at HQ covers the techniques and scenarios that your initial licence didn't: the situations that separate a merely-legal pilot from a genuinely capable one.
                </p>
                <p className="adv-intro__body">
                  Captain Quentin Smith, world helicopter aerobatics champion and holder of multiple world records, leads HQ's advanced programme. You won't find this calibre of instruction anywhere else in the UK.
                </p>
              </Reveal>
            </div>
            <div className="adv-intro__media">
              <Reveal delay={0.15} direction="left">
                <div className="adv-intro__image-wrap">
                  <img
                    src={pageImages['advanced-intro']?.[0]?.url || '/assets/images/team/quentin-smith-world-record-holder-helicopter-aerobatics.webp'}
                    alt="Captain Quentin Smith, World Aerobatics Champion"
                    className="adv-intro__image"
                    loading="lazy"
                    decoding="async"
                  />
                  <span className="adv-intro__caption">Quentin Smith, World Aerobatics Champion</span>
                </div>
              </Reveal>
            </div>
          </div>
        </div>
      </section>

      {/* ========== WHAT YOU'LL LEARN ========== */}
      <section className="adv-courses">
        <div className="adv-courses__container">
          <Reveal>
            <div className="adv-section-header">
              <span className="adv-pre-text">Training with Captain Q</span>
              <h2 className="adv-section-header__title">What You'll Learn</h2>
            </div>
          </Reveal>

          <div className="adv-courses__grid">
            {skills.map((skill, i) => (
              <Reveal key={skill.title} delay={(i % 6) * 0.05}>
                <div className="adv-skill-card">
                  <span className="adv-skill-card__tag">{skill.cat}</span>
                  <h3 className="adv-skill-card__title">{skill.title}</h3>
                  <p className="adv-skill-card__desc">{skill.desc}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ========== INSTRUCTOR SPOTLIGHT ========== */}
      <section className="adv-instructor">
        <div className="adv-instructor__container">
          <div className="adv-instructor__grid">
            <div className="adv-instructor__text">
              <Reveal>
                <span className="adv-pre-text adv-pre-text--light">Your Instructor</span>
                <h2 className="adv-instructor__heading">Captain Quentin Smith</h2>
                <p className="adv-instructor__body">
                  Quentin Smith has flown around the world solo, crossed the poles by helicopter, and set multiple world records in aerobatics and long-distance flying. As HQ's founder and managing director, he brings 30 years of frontline flying experience to every advanced training session. This is not classroom instruction. It's knowledge earned at altitude, across continents, in conditions most pilots will never see.
                </p>

                <div className="adv-instructor__stats">
                  {instructorStats.map((stat, i) => (
                    <div key={i} className="adv-instructor__stat">
                      <span className="adv-instructor__stat-value">{stat.value}</span>
                      <span className="adv-instructor__stat-label">{stat.label}</span>
                    </div>
                  ))}
                </div>
              </Reveal>
            </div>

            <div className="adv-instructor__media">
              <Reveal delay={0.2} direction="left">
                <div className="adv-instructor__image-wrap">
                  <img
                    src={pageImages['advanced-instructor']?.[0]?.url || '/assets/images/team/quentin-smith-world-record-holder-helicopter-aerobatics.webp'}
                    alt="Captain Quentin Smith, HQ Aviation Founder"
                    className="adv-instructor__image"
                    loading="lazy"
                    decoding="async"
                  />
                </div>
              </Reveal>
            </div>
          </div>
        </div>
      </section>

      {/* ========== FAQ SECTION ========== */}
      <section className="adv-faq" data-cms-section="faqs-advanced-training">
        <div className="adv-faq__container">
          <Reveal>
            <div className="adv-section-header">
              <span className="adv-pre-text">Common Questions</span>
              <h2 className="adv-section-header__title">
                <span>Frequently</span> <span>Asked</span>
              </h2>
            </div>
          </Reveal>

          <div className="adv-faq__list">
            {(showAllFaqs ? faqs : faqs.slice(0, 6)).map((faq, i) => (
              <Reveal key={faq.id} delay={i * 0.05}>
                <div
                  className={`adv-faq__item ${openFaq === i ? 'adv-faq__item--open' : ''}`}
                  onClick={() => setOpenFaq(openFaq === i ? null : i)}
                >
                  <span className="adv-faq__number">{String(i + 1).padStart(2, '0')}</span>
                  <div className="adv-faq__content">
                    <h4>
                      {faq.question}
                      <span className="adv-faq__toggle">{openFaq === i ? '−' : '+'}</span>
                    </h4>
                    <AnimatePresence>
                      {openFaq === i && (
                        <motion.div
                          className="adv-faq__answer"
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
            <button className="adv-faq__load-more" onClick={() => setShowAllFaqs(true)}>Load More</button>
          )}
        </div>
      </section>

      {/* ========== CTA SECTION ========== */}
      <section className="adv-cta">
        <div className="adv-cta__inner">
          <Reveal>
            <span className="adv-pre-text adv-pre-text--light">Ready to Push Further?</span>
            <h2 className="adv-cta__heading">Book Advanced Training</h2>
            <p className="adv-cta__body">
              Contact our training team to discuss which course suits your hours and goals. Captain Q's autorotation clinic books up early, so reach out to secure your place.
            </p>
            <div className="adv-cta__buttons">
              <Link to="/about-us/captain-q" className="adv-cta__link">
                Meet Captain Q
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                  <path d="M6 3L11 8L6 13" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
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

        .adv {
          font-family: 'Space Grotesk', -apple-system, sans-serif;
          background: #faf9f6;
          color: #1a1a1a;
          overflow-x: hidden;
        }

        /* Pre-text label */
        .adv-pre-text {
          display: block;
          font-size: 0.7rem;
          text-transform: uppercase;
          letter-spacing: 0.25em;
          color: #999;
          margin-bottom: 1rem;
          font-family: 'Share Tech Mono', monospace;
        }

        .adv-pre-text--light {
          color: rgba(255, 255, 255, 0.5);
        }

        /* Section header */
        .adv-section-header {
          text-align: center;
          max-width: 700px;
          margin: 0 auto 3rem;
        }

        .adv-section-header__title {
          font-size: clamp(2rem, 4vw, 3rem);
          margin: 0.5rem 0 1rem;
          line-height: 1.1;
          text-transform: uppercase;
          font-weight: 700;
          color: #1a1a1a;
        }

        .adv-section-header__desc {
          color: #666;
          font-size: 1.05rem;
          line-height: 1.7;
          margin: 0;
        }

        /* Buttons */
        .adv-btn {
          display: inline-block;
          padding: 0.85rem 1.75rem;
          font-size: 0.7rem;
          font-weight: 500;
          text-decoration: none;
          text-transform: uppercase;
          letter-spacing: 0.12em;
          cursor: pointer;
          transition: all 0.3s ease;
          font-family: 'Space Grotesk', sans-serif;
          text-align: center;
          border-radius: 2px;
        }

        .adv-btn--outline {
          background: transparent;
          color: #1a1a1a;
          border: 1px solid #1a1a1a;
        }

        .adv-btn--outline:hover {
          background: #1a1a1a;
          color: #fff;
        }

        .adv-btn--white {
          background: #fff;
          color: #1a1a1a;
          border: 1px solid #fff;
        }

        .adv-btn--white:hover {
          background: #f0f0ee;
          border-color: #f0f0ee;
        }

        /* ===================================================
           HERO
        =================================================== */

        .adv-hero {
          min-height: 100vh;
          position: relative;
          display: flex;
          flex-direction: column;
          overflow: hidden;
        }

        .adv-hero__bg {
          position: absolute;
          inset: 0;
          background-size: cover;
          background-position: center 30%;
          background-repeat: no-repeat;
          transform: scale(1.05);
          transition: transform 0.1s linear;
        }

        .adv-hero__overlay {
          position: absolute;
          inset: 0;
          background: linear-gradient(
            135deg,
            rgba(0, 0, 0, 0.72) 0%,
            rgba(0, 0, 0, 0.45) 50%,
            rgba(0, 0, 0, 0.25) 100%
          );
        }

        .adv-hero__content {
          position: relative;
          z-index: 3;
          flex: 1;
          display: flex;
          align-items: center;
          padding: 2rem 4rem;
        }

        .adv-hero__left {
          max-width: 580px;
        }

        .adv-hero__label {
          font-size: 0.7rem;
          font-weight: 400;
          letter-spacing: 0.2em;
          text-transform: uppercase;
          color: rgba(255, 255, 255, 0.5);
          display: block;
          margin-bottom: 1.5rem;
          font-family: 'Share Tech Mono', monospace;
        }

        .adv-hero__headline {
          display: flex;
          flex-direction: column;
          line-height: 1;
          margin-bottom: 1.5rem;
        }

        .adv-hero__word {
          font-family: 'Space Grotesk', sans-serif;
          font-weight: 700;
          font-size: clamp(3rem, 8vw, 5.5rem);
          letter-spacing: -0.02em;
          text-transform: uppercase;
        }

        .adv-hero__word--1 {
          background: linear-gradient(180deg, #fff 0%, rgba(255, 255, 255, 0.85) 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }

        .adv-hero__word--2 {
          background: linear-gradient(180deg, rgba(255, 255, 255, 0.7) 0%, rgba(255, 255, 255, 0.4) 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }

        .adv-hero__divider-line {
          width: 80px;
          height: 2px;
          background: rgba(255, 255, 255, 0.4);
          margin-bottom: 1.5rem;
          transform-origin: left;
        }

        /* Hero Badge Card */
        .adv-hero__badge {
          background: rgba(255, 255, 255, 0.07);
          backdrop-filter: blur(12px);
          -webkit-backdrop-filter: blur(12px);
          max-width: 300px;
          margin-bottom: 1.5rem;
          border-radius: 8px;
          overflow: hidden;
          border: 1px solid rgba(255, 255, 255, 0.12);
        }

        .adv-hero__badge-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 0.75rem 1rem;
          border-bottom: 1px solid rgba(255, 255, 255, 0.08);
        }

        .adv-hero__badge-label {
          font-size: 0.55rem;
          letter-spacing: 0.15em;
          color: rgba(255, 255, 255, 0.5);
          text-transform: uppercase;
          font-family: 'Share Tech Mono', monospace;
        }

        .adv-hero__badge-type {
          font-size: 0.6rem;
          font-weight: 700;
          letter-spacing: 0.1em;
          color: #fff;
          background: rgba(255, 255, 255, 0.1);
          padding: 0.15rem 0.5rem;
          font-family: 'Share Tech Mono', monospace;
        }

        .adv-hero__badge-content {
          display: flex;
          align-items: center;
          justify-content: space-around;
          padding: 1rem;
        }

        .adv-hero__badge-stat {
          text-align: center;
        }

        .adv-hero__badge-num {
          display: block;
          font-family: 'Share Tech Mono', monospace;
          font-size: 1.5rem;
          font-weight: 700;
          color: #fff;
          line-height: 1;
        }

        .adv-hero__badge-num--text {
          font-size: 0.9rem;
        }

        .adv-hero__badge-desc {
          font-size: 0.55rem;
          color: rgba(255, 255, 255, 0.5);
          text-transform: uppercase;
          letter-spacing: 0.05em;
          font-family: 'Share Tech Mono', monospace;
        }

        .adv-hero__badge-divider {
          width: 1px;
          height: 30px;
          background: linear-gradient(to bottom, transparent, rgba(255, 255, 255, 0.2), transparent);
        }

        .adv-hero__sub {
          font-size: 1.05rem;
          color: rgba(255, 255, 255, 0.65);
          line-height: 1.8;
          max-width: 440px;
          margin: 0;
        }

        /* ===================================================
           INTRO
        =================================================== */

        .adv-intro {
          background: #faf9f6;
          padding: 6rem 4rem;
        }

        .adv-intro__container {
          max-width: 1200px;
          margin: 0 auto;
        }

        .adv-intro__grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 5rem;
          align-items: center;
        }

        .adv-intro__heading {
          font-size: clamp(2rem, 3.5vw, 2.8rem);
          font-weight: 700;
          line-height: 1.15;
          text-transform: uppercase;
          color: #1a1a1a;
          margin: 0.5rem 0 1.5rem;
        }

        .adv-intro__body {
          color: #555;
          font-size: 1.05rem;
          line-height: 1.75;
          margin: 0 0 1.2rem;
        }

        .adv-intro__body:last-of-type {
          margin-bottom: 0;
        }

        .adv-intro__image-wrap {
          position: relative;
        }

        .adv-intro__image {
          width: 100%;
          aspect-ratio: 4 / 5;
          object-fit: cover;
          object-position: top center;
          display: block;
          border-radius: 4px;
        }

        .adv-intro__caption {
          display: block;
          margin-top: 0.75rem;
          font-size: 0.65rem;
          text-transform: uppercase;
          letter-spacing: 0.15em;
          color: #aaa;
          font-family: 'Share Tech Mono', monospace;
        }

        /* ===================================================
           COURSES
        =================================================== */

        .adv-courses {
          background: #faf9f6;
          padding: 6rem 4rem;
          border-top: 1px solid #eeece8;
        }

        .adv-courses__container {
          max-width: 1200px;
          margin: 0 auto;
        }

        .adv-courses__grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 1rem;
          margin-top: 2.5rem;
        }

        /* Skill Card */
        .adv-skill-card {
          background: #fff;
          border: 1px solid #e8e6e2;
          border-radius: 10px;
          padding: 1.5rem 1.5rem 1.75rem;
          display: flex;
          flex-direction: column;
          gap: 0.55rem;
          height: 100%;
          transition: box-shadow 0.3s ease, border-color 0.3s ease, transform 0.3s ease;
        }

        .adv-skill-card:hover {
          box-shadow: 0 8px 32px rgba(0, 0, 0, 0.06);
          border-color: #d4d2ce;
          transform: translateY(-2px);
        }

        .adv-skill-card__tag {
          font-family: 'Share Tech Mono', monospace;
          font-size: 0.6rem;
          text-transform: uppercase;
          letter-spacing: 0.18em;
          color: #999;
        }

        .adv-skill-card__title {
          font-size: 1.05rem;
          font-weight: 700;
          color: #1a1a1a;
          line-height: 1.3;
          margin: 0;
        }

        .adv-skill-card__desc {
          font-size: 0.85rem;
          color: #666;
          line-height: 1.55;
          margin: 0;
        }

        /* ===================================================
           INSTRUCTOR SPOTLIGHT
        =================================================== */

        .adv-instructor {
          background: #1a1a1a;
          padding: 6rem 4rem;
        }

        .adv-instructor__container {
          max-width: 1200px;
          margin: 0 auto;
        }

        .adv-instructor__grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 5rem;
          align-items: center;
        }

        .adv-instructor__heading {
          font-size: clamp(2rem, 3.5vw, 2.8rem);
          font-weight: 700;
          color: #fff;
          text-transform: uppercase;
          line-height: 1.1;
          margin: 0.5rem 0 1.5rem;
        }

        .adv-instructor__body {
          color: rgba(255, 255, 255, 0.7);
          font-size: 1.05rem;
          line-height: 1.75;
          margin: 0 0 2.5rem;
        }

        /* Stats row */
        .adv-instructor__stats {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 1.5rem;
          padding-top: 2rem;
          border-top: 1px solid rgba(255, 255, 255, 0.1);
        }

        .adv-instructor__stat {
          display: flex;
          flex-direction: column;
          gap: 0.3rem;
        }

        .adv-instructor__stat-value {
          font-family: 'Share Tech Mono', monospace;
          font-size: 1.5rem;
          font-weight: 700;
          color: #fff;
          line-height: 1;
        }

        .adv-instructor__stat-label {
          font-size: 0.65rem;
          text-transform: uppercase;
          letter-spacing: 0.15em;
          color: rgba(255, 255, 255, 0.5);
          font-family: 'Share Tech Mono', monospace;
        }

        /* Instructor image */
        .adv-instructor__image-wrap {
          position: relative;
          overflow: hidden;
          border-radius: 4px;
        }

        .adv-instructor__image {
          width: 100%;
          aspect-ratio: 3 / 4;
          object-fit: cover;
          object-position: top center;
          display: block;
          filter: grayscale(40%) sepia(15%);
          transition: filter 0.4s ease;
        }

        .adv-instructor__image-wrap:hover .adv-instructor__image {
          filter: grayscale(20%) sepia(8%);
        }

        /* ===================================================
           FAQ
        =================================================== */

        .adv-faq {
          background: #faf9f6;
          padding: 6rem 4rem;
          border-top: 1px solid #eeece8;
        }

        .adv-faq__container {
          max-width: 800px;
          margin: 0 auto;
        }

        .adv-faq__list {
          display: flex;
          flex-direction: column;
        }

        .adv-faq__load-more { margin-top: 1.5rem; display: block; width: 100%; padding: 0.9rem 1.5rem; background: transparent; border: 1px solid #1a1a1a; color: #1a1a1a; font-family: 'Share Tech Mono', monospace; font-size: 0.72rem; letter-spacing: 0.12em; text-transform: uppercase; cursor: pointer; transition: background 0.2s ease, color 0.2s ease; }
        .adv-faq__load-more:hover { background: #1a1a1a; color: #fff; }

        .adv-faq__item {
          display: flex;
          gap: 1.5rem;
          padding: 1.25rem 0;
          border-bottom: 1px solid #e8e6e2;
          cursor: pointer;
          transition: background 0.2s ease;
        }

        .adv-faq__item:first-of-type {
          border-top: 1px solid #e8e6e2;
        }

        .adv-faq__item:hover {
          background: rgba(0, 0, 0, 0.01);
        }

        .adv-faq__item--open {
          background: rgba(0, 0, 0, 0.02);
        }

        .adv-faq__number {
          font-family: 'Share Tech Mono', monospace;
          font-size: 0.75rem;
          color: #ccc;
          flex-shrink: 0;
          padding-top: 0.1rem;
          min-width: 28px;
        }

        .adv-faq__content {
          flex: 1;
        }

        .adv-faq__content h4 {
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

        .adv-faq__toggle {
          font-size: 1.25rem;
          font-weight: 300;
          color: #999;
          flex-shrink: 0;
        }

        .adv-faq__answer {
          overflow: hidden;
        }

        .adv-faq__answer p {
          margin: 0.75rem 0 0;
          color: #666;
          line-height: 1.75;
          font-size: 0.95rem;
        }

        /* ===================================================
           CTA
        =================================================== */

        .adv-cta {
          background: #1a1a1a;
          padding: 6rem 4rem;
        }

        .adv-cta__inner {
          max-width: 680px;
          margin: 0 auto;
          text-align: center;
          color: #fff;
        }

        .adv-cta__heading {
          font-size: clamp(2rem, 4vw, 3rem);
          font-weight: 700;
          text-transform: uppercase;
          line-height: 1.1;
          color: #fff;
          margin: 0.5rem 0 1.5rem;
        }

        .adv-cta__body {
          color: rgba(255, 255, 255, 0.7);
          font-size: 1.05rem;
          line-height: 1.75;
          margin: 0 auto 2.5rem;
          max-width: 520px;
        }

        .adv-cta__buttons {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 2rem;
          flex-wrap: wrap;
        }

        .adv-cta__link {
          display: inline-flex;
          align-items: center;
          gap: 0.5rem;
          font-size: 0.75rem;
          text-transform: uppercase;
          letter-spacing: 0.1em;
          color: rgba(255, 255, 255, 0.7);
          text-decoration: none;
          transition: color 0.3s ease;
          font-family: 'Share Tech Mono', monospace;
        }

        .adv-cta__link:hover {
          color: #fff;
        }

        .adv-cta__link svg {
          transition: transform 0.3s ease;
        }

        .adv-cta__link:hover svg {
          transform: translateX(4px);
        }

        /* ===================================================
           RESPONSIVE — 1024px
        =================================================== */

        @media (max-width: 1024px) {
          .adv-intro {
            padding: 5rem 3rem;
          }

          .adv-intro__grid {
            gap: 3rem;
          }

          .adv-courses {
            padding: 5rem 3rem;
          }

          .adv-courses__grid {
            grid-template-columns: repeat(2, 1fr);
          }

          .adv-instructor {
            padding: 5rem 3rem;
          }

          .adv-instructor__grid {
            gap: 3rem;
          }

          .adv-instructor__stats {
            grid-template-columns: repeat(2, 1fr);
            gap: 1.25rem;
          }

          .adv-faq {
            padding: 5rem 3rem;
          }

          .adv-cta {
            padding: 5rem 3rem;
          }
        }

        /* ===================================================
           RESPONSIVE — 768px
        =================================================== */

        @media (max-width: 768px) {
          /* Hero */
          .adv-hero__content {
            padding: 6rem 1.5rem 2.5rem;
            align-items: flex-end;
            padding-bottom: 3rem;
          }

          .adv-hero__left {
            max-width: 100%;
          }

          .adv-hero__headline {
            margin-bottom: 1.25rem;
          }

          .adv-hero__badge {
            max-width: 280px;
          }

          .adv-hero__sub {
            max-width: 100%;
          }

          /* Intro */
          .adv-intro {
            padding: 4rem 1.5rem;
          }

          .adv-intro__grid {
            grid-template-columns: 1fr;
            gap: 2.5rem;
          }

          .adv-intro__media {
            order: -1;
          }

          .adv-intro__image {
            aspect-ratio: 16 / 9;
          }

          /* Courses */
          .adv-courses {
            padding: 4rem 1.5rem;
          }

          .adv-courses__grid {
            grid-template-columns: 1fr;
          }

          .adv-skill-card {
            padding: 1.25rem 1.25rem 1.5rem;
          }

          /* Instructor */
          .adv-instructor {
            padding: 4rem 1.5rem;
          }

          .adv-instructor__grid {
            grid-template-columns: 1fr;
            gap: 2.5rem;
          }

          .adv-instructor__media {
            order: -1;
          }

          .adv-instructor__image {
            aspect-ratio: 4 / 3;
          }

          .adv-instructor__stats {
            grid-template-columns: repeat(2, 1fr);
            gap: 1rem;
          }

          .adv-instructor__stat-value {
            font-size: 1.25rem;
          }

          /* FAQ */
          .adv-faq {
            padding: 4rem 1.5rem;
          }

          .adv-faq__content h4 {
            font-size: 0.92rem;
          }

          /* CTA */
          .adv-cta {
            padding: 4rem 1.5rem;
          }

          .adv-cta__buttons {
            flex-direction: column;
            gap: 1.25rem;
          }

          .adv-cta__heading {
            font-size: clamp(1.75rem, 6vw, 2.5rem);
          }
        }

        /* ===================================================
           RESPONSIVE — 480px
        =================================================== */

        @media (max-width: 480px) {
          .adv-hero__content {
            padding: 5rem 1.25rem 2.5rem;
          }

          .adv-intro {
            padding: 3rem 1.25rem;
          }

          .adv-courses {
            padding: 3rem 1.25rem;
          }

          .adv-skill-card {
            padding: 1.25rem;
          }

          .adv-instructor {
            padding: 3rem 1.25rem;
          }

          .adv-faq {
            padding: 3rem 1.25rem;
          }

          .adv-cta {
            padding: 3rem 1.25rem;
          }

          .adv-instructor__stats {
            grid-template-columns: repeat(2, 1fr);
          }
        }

      `}</style>
    </div>
  );
}

export default AdvancedTraining;

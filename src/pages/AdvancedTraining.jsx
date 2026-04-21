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
              <li><Link to="/training/advanced" onClick={closeMenu}>Advanced Training</Link></li>
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

function AdvancedTraining() {
  const heroRef = useRef(null);
  const [openFaq, setOpenFaq] = useState(null);
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
    { id: 'f2', question: 'Can I do multiple courses back to back?', answer: 'Yes — and it\'s often the most efficient way to advance your skills. We can structure a multi-day programme around your availability.' },
    { id: 'f3', question: 'Is Captain Q personally available for every session?', answer: 'Autorotation clinics are led by Captain Q directly. Other courses are conducted by HQ\'s experienced instructors. Contact us to discuss availability and scheduling.' },
    { id: 'f4', question: 'Will advanced training show on my licence?', answer: 'Training flights are entered in your logbook and contribute to your overall flight time. Some courses may contribute to specific ratings or qualifications depending on your goals — discuss this with us when booking.' },
    { id: 'f5', question: 'Where is the training conducted?', answer: 'Based at Denham Aerodrome, with mountain flying training involving day trips to suitable UK terrain. All courses use HQ\'s own aircraft.' },
  ];
  const faqs = rawFaqs.length > 0 ? rawFaqs : fallbackFaqs;

  // ── Data ──────────────────────────────────────────────────────────────────

  const courses = [
    {
      num: '01', tag: 'Signature Course', title: 'Autorotations with Captain Q',
      description: 'Autorotations are the helicopter\'s ultimate safety manoeuvre — and they require skill and confidence to execute well. Captain Q\'s autorotation clinic goes beyond routine practice to develop genuine mastery: full autorotations to a landing point, engine-off landings, and practice under genuinely simulated emergency conditions. Available exclusively at HQ.',
      duration: 'Half day or full day',
      suitable: 'PPL(H) holders with 50+ hours',
      enquiry: 'autorotations',
      image: '/assets/images/gallery/carousel/rotating1.jpg',
    },
    {
      num: '02', tag: 'Skills', title: 'Confined Area Operations',
      description: 'Flying into and out of restricted spaces — paddocks, clearings, narrow valleys — is one of the most demanding and most useful helicopter skills. HQ\'s confined area training covers reconnaissance, approach planning, power checks, and the go/no-go decision framework used by professional operators.',
      duration: '2–3 days',
      suitable: 'PPL(H) holders, 100+ hours recommended',
      enquiry: 'confined-area',
      image: '/assets/images/gallery/flying/flying--1.jpg',
    },
    {
      num: '03', tag: 'Terrain', title: 'Mountain Flying',
      description: 'Mountain flying introduces weather, terrain, density altitude, and turbulence considerations that lowland flying rarely prepares you for. Training covers route planning in mountainous terrain, weather decision-making, slope landings, and the performance margins needed to fly safely in the hills.',
      duration: '2–4 days',
      suitable: 'PPL(H) holders, 100+ hours',
      enquiry: 'mountain-flying',
      image: '/assets/images/gallery/carousel/rotating8.jpg',
    },
    {
      num: '04', tag: 'Currency', title: 'Safety Courses',
      description: 'Regular safety-focused refresher sessions covering emergency procedures, decision-making frameworks, accident analysis, and handling drills. Suitable for any PPL holder wanting to sharpen their airmanship — particularly recommended for pilots who fly infrequently or have returned after a break.',
      duration: 'Half day',
      suitable: 'All PPL(H) holders',
      enquiry: 'safety-courses',
      image: '/assets/images/gallery/carousel/rotating2.jpg',
    },
  ];

  const instructorStats = [
    { value: '30+', label: 'Years Flying' },
    { value: '3', label: 'World Records' },
    { value: '18,000+', label: 'Flight Hours' },
    { value: 'CAA', label: 'Authorised Examiner' },
  ];

  const prerequisites = [
    { num: '01', title: 'Valid PPL(H) or Higher', desc: 'Minimum entry requirement for all advanced courses' },
    { num: '02', title: 'Valid Medical Certificate', desc: 'Class 2 or LAPL medical in date' },
    { num: '03', title: 'Recent Flying Currency', desc: 'Recent flight time recommended — refresher available if needed' },
    { num: '04', title: 'Open to Learning', desc: 'No strict hour threshold for most courses — just a desire to improve' },
  ];

  // ── Render ─────────────────────────────────────────────────────────────────

  return (
    <div className="adv">
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
              Autorotations, confined areas, mountain flying, and safety courses — all delivered by instructors who live and breathe this aircraft. Push your skills further with HQ's advanced programme.
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
                  Holding a PPL(H) is the beginning of your journey, not the end of it. Advanced training at HQ covers the techniques and scenarios that your initial licence didn't — the situations that separate a merely-legal pilot from a genuinely capable one.
                </p>
                <p className="adv-intro__body">
                  Captain Quentin Smith — world helicopter aerobatics champion and holder of multiple world records — leads HQ's advanced programme. You won't find this calibre of instruction anywhere else in the UK.
                </p>
              </Reveal>
            </div>
            <div className="adv-intro__media">
              <Reveal delay={0.15} direction="left">
                <div className="adv-intro__image-wrap">
                  <img
                    src={pageImages['advanced-intro']?.[0]?.url || '/assets/images/team/quentin-smith-world-record-holder-helicopter-aerobatics.webp'}
                    alt="Captain Quentin Smith — World Aerobatics Champion"
                    className="adv-intro__image"
                    loading="lazy"
                    decoding="async"
                  />
                  <span className="adv-intro__caption">Quentin Smith — World Aerobatics Champion</span>
                </div>
              </Reveal>
            </div>
          </div>
        </div>
      </section>

      {/* ========== COURSES SECTION ========== */}
      <section className="adv-courses">
        <div className="adv-courses__container">
          <Reveal>
            <div className="adv-section-header">
              <span className="adv-pre-text">The Specialisms</span>
              <h2 className="adv-section-header__title">Advanced Courses</h2>
            </div>
          </Reveal>

          <div className="adv-courses__grid">
            {courses.map((course, i) => (
              <Reveal key={course.num} delay={i * 0.1}>
                <div className="adv-course-card">
                  <div className="adv-course-card__top">
                    <span className="adv-course-card__tag">{course.tag}</span>
                    <span className="adv-course-card__num">{course.num}</span>
                  </div>
                  <h3 className="adv-course-card__title">{course.title}</h3>
                  <p className="adv-course-card__desc">{course.description}</p>
                  <div className="adv-course-card__divider" />
                  <div className="adv-course-card__footer">
                    <div className="adv-course-card__meta">
                      <span className="adv-course-card__meta-label">Duration</span>
                      <span className="adv-course-card__meta-value">{course.duration}</span>
                    </div>
                    <div className="adv-course-card__meta">
                      <span className="adv-course-card__meta-label">Suitable for</span>
                      <span className="adv-course-card__meta-value">{course.suitable}</span>
                    </div>
                    <Link
                      to={`/contact?subject=${course.enquiry}`}
                      className="adv-btn adv-btn--outline"
                    >
                      Enquire
                    </Link>
                  </div>
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
                  Quentin Smith has flown around the world solo, crossed the poles by helicopter, and set multiple world records in aerobatics and long-distance flying. As HQ's founder and managing director, he brings 30 years of frontline flying experience to every advanced training session. This is not classroom instruction — it's knowledge earned at altitude, across continents, in conditions most pilots will never see.
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
                    alt="Captain Quentin Smith — HQ Aviation Founder"
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

      {/* ========== PREREQUISITES SECTION ========== */}
      <section className="adv-prereq">
        <div className="adv-prereq__container">
          <Reveal>
            <div className="adv-section-header">
              <span className="adv-pre-text">Who This Is For</span>
              <h2 className="adv-section-header__title">Requirements</h2>
              <p className="adv-section-header__desc">
                Advanced training at HQ is open to all PPL(H) holders. Different courses have different recommended experience levels — see the course cards above. If in doubt, contact us and we'll advise on which course suits your current hours and ambitions.
              </p>
            </div>
          </Reveal>

          <div className="adv-prereq__grid">
            {prerequisites.map((prereq, i) => (
              <Reveal key={prereq.num} delay={i * 0.1}>
                <div className="adv-prereq__card">
                  <div className="adv-prereq__icon">{prereq.num}</div>
                  <div className="adv-prereq__text">
                    <h4>{prereq.title}</h4>
                    <p>{prereq.desc}</p>
                  </div>
                </div>
              </Reveal>
            ))}
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
            {faqs.map((faq, i) => (
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
        </div>
      </section>

      {/* ========== CTA SECTION ========== */}
      <section className="adv-cta">
        <div className="adv-cta__inner">
          <Reveal>
            <span className="adv-pre-text adv-pre-text--light">Ready to Push Further?</span>
            <h2 className="adv-cta__heading">Book Advanced Training</h2>
            <p className="adv-cta__body">
              Contact our training team to discuss which course suits your hours and goals. Captain Q's autorotation clinic books up early — reach out to secure your place.
            </p>
            <div className="adv-cta__buttons">
              <a href="/contact?subject=advanced-training" className="adv-btn adv-btn--white">
                Enquire Now
              </a>
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
          grid-template-columns: repeat(2, 1fr);
          gap: 1.5rem;
        }

        /* Course Card */
        .adv-course-card {
          background: #fff;
          border: 1px solid #e8e6e2;
          border-radius: 12px;
          padding: 2.5rem;
          display: flex;
          flex-direction: column;
          transition: box-shadow 0.3s ease, border-color 0.3s ease;
        }

        .adv-course-card:hover {
          box-shadow: 0 8px 32px rgba(0, 0, 0, 0.06);
          border-color: #d4d2ce;
        }

        .adv-course-card__top {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 1.25rem;
        }

        .adv-course-card__tag {
          display: inline-block;
          background: #f5f5f2;
          border: 1px solid #e8e6e2;
          border-radius: 100px;
          font-size: 0.65rem;
          text-transform: uppercase;
          letter-spacing: 0.15em;
          color: #777;
          padding: 0.3rem 0.85rem;
          font-family: 'Share Tech Mono', monospace;
        }

        .adv-course-card__num {
          font-family: 'Share Tech Mono', monospace;
          font-size: 0.75rem;
          color: #ccc;
          font-weight: 400;
        }

        .adv-course-card__title {
          font-size: 1.2rem;
          font-weight: 700;
          color: #1a1a1a;
          margin: 0 0 0.85rem;
          line-height: 1.25;
        }

        .adv-course-card__desc {
          font-size: 0.92rem;
          color: #666;
          line-height: 1.7;
          margin: 0 0 1.5rem;
          flex: 1;
        }

        .adv-course-card__divider {
          height: 1px;
          background: #e8e6e2;
          margin-bottom: 1.5rem;
        }

        .adv-course-card__footer {
          display: flex;
          flex-direction: column;
          gap: 0.6rem;
        }

        .adv-course-card__meta {
          display: flex;
          gap: 0.5rem;
          align-items: baseline;
        }

        .adv-course-card__meta-label {
          font-family: 'Share Tech Mono', monospace;
          font-size: 0.6rem;
          text-transform: uppercase;
          letter-spacing: 0.12em;
          color: #aaa;
          flex-shrink: 0;
          min-width: 72px;
        }

        .adv-course-card__meta-value {
          font-family: 'Share Tech Mono', monospace;
          font-size: 0.65rem;
          color: #555;
          line-height: 1.4;
        }

        .adv-course-card__footer .adv-btn {
          margin-top: 0.5rem;
          align-self: flex-start;
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
           PREREQUISITES
        =================================================== */

        .adv-prereq {
          background: #faf9f6;
          padding: 6rem 4rem;
          border-top: 1px solid #eeece8;
        }

        .adv-prereq__container {
          max-width: 1200px;
          margin: 0 auto;
        }

        .adv-prereq__grid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 1.25rem;
        }

        .adv-prereq__card {
          display: flex;
          flex-direction: row;
          align-items: flex-start;
          gap: 1rem;
          padding: 1.5rem;
          background: #fff;
          border: 1px solid #e8e6e2;
          border-radius: 8px;
          transition: box-shadow 0.3s ease;
        }

        .adv-prereq__card:hover {
          box-shadow: 0 4px 16px rgba(0, 0, 0, 0.05);
        }

        .adv-prereq__icon {
          width: 44px;
          height: 44px;
          background: #1a1a1a;
          color: #fff;
          display: flex;
          align-items: center;
          justify-content: center;
          font-family: 'Share Tech Mono', monospace;
          font-size: 0.8rem;
          font-weight: 700;
          flex-shrink: 0;
          border-radius: 2px;
        }

        .adv-prereq__text h4 {
          font-size: 0.88rem;
          font-weight: 600;
          margin: 0 0 0.35rem;
          text-transform: uppercase;
          color: #1a1a1a;
          line-height: 1.3;
        }

        .adv-prereq__text p {
          font-size: 0.8rem;
          color: #777;
          line-height: 1.55;
          margin: 0;
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

          .adv-prereq {
            padding: 5rem 3rem;
          }

          .adv-prereq__grid {
            grid-template-columns: repeat(2, 1fr);
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

          .adv-course-card {
            padding: 2rem;
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

          /* Prerequisites */
          .adv-prereq {
            padding: 4rem 1.5rem;
          }

          .adv-prereq__grid {
            grid-template-columns: 1fr;
            gap: 1rem;
          }

          .adv-prereq__card {
            padding: 1.25rem;
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

          .adv-course-card {
            padding: 1.5rem;
          }

          .adv-instructor {
            padding: 3rem 1.25rem;
          }

          .adv-prereq {
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

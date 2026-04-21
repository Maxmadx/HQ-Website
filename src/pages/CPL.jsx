/**
 * COMMERCIAL PILOT LICENCE PAGE
 *
 * A comprehensive page for pilots pursuing their CPL(H) — the gateway
 * to a professional career in helicopter aviation.
 *
 * Brand: Luxury Minimal Aviation
 * Typography: Space Grotesk + Share Tech Mono
 * Colors: #faf9f6 (warm white), #1a1a1a (charcoal)
 * Route: /training/commercial
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
 * CPL PAGE HEADER COMPONENT
 * Spotlight animation header — adds CPL entry to Flight Training menu section.
 */
function CPLHeader() {
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
              <li><Link to="/training/commercial" onClick={closeMenu}>Commercial Pilot Licence</Link></li>
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

function CPL() {
  const heroRef = useRef(null);
  const [openFaq, setOpenFaq] = useState(null);
  const pageImages = usePageImages('cpl');
  useCmsHighlight();
  const { scrollYProgress } = useScroll({ target: heroRef, offset: ['start start', 'end start'] });
  useEffect(() => { window.scrollTo(0, 0); }, []);
  const heroOpacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);
  const heroScale = useTransform(scrollYProgress, [0, 0.5], [1, 0.95]);
  const heroY = useTransform(scrollYProgress, [0, 0.5], [0, 100]);
  const [formData, setFormData] = useState({ name: '', email: '', phone: '', message: '' });
  const [formStatus, setFormStatus] = useState('idle');
  const { faqs: rawFaqs } = useFaqs('cpl', { visibleOnly: true });

  const fallbackFaqs = [
    { id: 'f1', question: 'Do I need my PPL before starting CPL training?', answer: 'Yes. The PPL(H) is a prerequisite for CPL(H) training. You must also have accumulated the required flight hours before the skill test.' },
    { id: 'f2', question: 'Can I do CPL training on the Robinson R22?', answer: 'The R22 can be used for some CPL training, but most focused CPL hours are conducted on the R44 or R66 as these better represent the aircraft used in commercial operations.' },
    { id: 'f3', question: 'How long does the whole CPL process take?', answer: 'It varies significantly depending on your starting hours. Coming from a freshly-minted PPL with 45 hours, you\'ll need at least 110 more hours before the skill test. With focused flying, some candidates complete the process in 18–24 months.' },
    { id: 'f4', question: 'What are the ATPL(H) Frozen exams?', answer: 'These are the theoretical knowledge examinations required for the CPL(H). They\'re the same exams used for the full ATPL(H) — hence \'frozen\' when held at CPL level. There are 9 subjects, all taken at a CAA-approved examination centre.' },
    { id: 'f5', question: 'Is CPL(H) training at HQ approved?', answer: 'HQ Aviation is a CAA Approved Declared Training Organisation (DTO). CPL training conducted with HQ counts towards your CAA licence requirements.' },
    { id: 'f6', question: 'What does CPL training cost?', answer: 'Costs vary depending on hours required and aircraft type. Contact us for a detailed breakdown based on your current hours and goals.' },
  ];
  const faqs = rawFaqs.length > 0 ? rawFaqs : fallbackFaqs;

  async function handleFormSubmit(e) {
    e.preventDefault();
    if (!formData.name.trim() || !formData.email.trim()) { setFormStatus('error'); return; }
    setFormStatus('submitting');
    try {
      const res = await fetch('/api/leads', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...formData, subject: 'CPL Enquiry', source: 'cpl-page' }),
      });
      if (!res.ok) throw new Error();
      setFormStatus('success');
      setFormData({ name: '', email: '', phone: '', message: '' });
    } catch { setFormStatus('error'); }
  }

  // ===== DATA ARRAYS =====

  const groundSubjects = [
    { num: '01', title: 'Air Law', desc: 'Regulations, airspace classification, rules of the air' },
    { num: '02', title: 'Aircraft General Knowledge', desc: 'Systems, structures, powerplants, instruments' },
    { num: '03', title: 'Flight Performance & Planning', desc: 'Weight, balance, fuel, performance calculations' },
    { num: '04', title: 'Human Performance', desc: 'CRM, fatigue, decision-making, stress management' },
    { num: '05', title: 'Meteorology', desc: 'Weather patterns, forecasting, icing, turbulence' },
    { num: '06', title: 'Navigation', desc: 'Dead reckoning, radio navigation, GPS, charts' },
    { num: '07', title: 'Operational Procedures', desc: 'Standard operating procedures, safety management' },
    { num: '08', title: 'Principles of Flight', desc: 'Aerodynamics, rotor mechanics, stability' },
    { num: '09', title: 'Radio Navigation', desc: 'VOR, ILS, ADF, transponders, GNSS' },
  ];

  const pathway = [
    { num: '01', title: 'PPL(H)', value: '45 Hours', desc: 'Your foundation licence — the entry point to all further helicopter training' },
    { num: '02', title: 'Hour Building', value: '110+ Hours', desc: 'Accumulate flight time to reach 155 total hours including 50 as Pilot in Command' },
    { num: '03', title: 'Ground Exams', value: '9 Subjects', desc: 'ATPL(H) Frozen theoretical knowledge examinations at approved centre' },
    { num: '04', title: 'CPL Training', value: '15+ Hours', desc: 'Focused CPL-standard instruction with an HQ approved FI(H) instructor' },
    { num: '05', title: 'Skill Test', value: '1 Day', desc: 'CAA skill test with an authorised examiner — your CPL awaits' },
  ];

  const processSteps = [
    { num: '01', title: 'Ground School', duration: '9 Exams', description: 'Complete ATPL(H) Frozen theory examinations. Most candidates self-study with a ground school provider; HQ can recommend approved courses and supports you through the process.' },
    { num: '02', title: 'Hour Building', duration: '100+ Hours', description: 'Build the required flight time through training flights, self-fly hire, and type ratings. HQ\'s fleet and instructors support this phase throughout.' },
    { num: '03', title: 'CPL Flight Training', duration: '15+ Hours', description: 'Focused CPL-standard training covering advanced manoeuvres, precision flying, and the commercial operating standards examiners expect.' },
    { num: '04', title: 'Skill Test', duration: '1 Day', description: 'Final assessment with a CAA-authorised examiner. HQ prepares you thoroughly — we know what examiners look for and we train to that standard, not just the minimums.' },
  ];

  const careers = [
    { num: '01', title: 'Charter & Air Taxi', desc: 'Private passenger transport, corporate travel, and VIP operations across the UK and Europe.' },
    { num: '02', title: 'Tours & Sightseeing', desc: 'Helicopter tours over major cities and scenic locations. London, Scotland, the Lake District.' },
    { num: '03', title: 'Aerial Survey & Photography', desc: 'Mapping, inspection, infrastructure surveys, film and TV production work.' },
    { num: '04', title: 'Flight Instruction', desc: 'Teach the next generation of pilots. Requires an additional FI(H) rating after your CPL.' },
    { num: '05', title: 'Emergency Services', desc: 'Police aviation, coastguard, HEMS. Typically require significant additional hours and ratings.' },
    { num: '06', title: 'Corporate Aviation', desc: 'Fleet management and dedicated piloting roles for private companies and high-net-worth individuals.' },
  ];

  return (
    <div className="cpl">
      <CPLHeader />

      {/* ========== HERO SECTION ========== */}
      <section ref={heroRef} className="cpl-hero" data-cms-section="cpl-hero">
        <motion.div
          className="cpl-hero__bg"
          initial={{ scale: 1.1, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 1.5 }}
        >
          <img
            src={pageImages['cpl-hero']?.[0]?.url || '/assets/images/gallery/carousel/rotating-3.jpg'}
            alt="Commercial helicopter pilot training"
          />
        </motion.div>
        <div className="cpl-hero__overlay" />

        <motion.div
          className="cpl-hero__content"
          style={{ opacity: heroOpacity, scale: heroScale, y: heroY }}
        >
          <div className="cpl-hero__left">
            <motion.span
              className="cpl-hero__label"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              Professional Training
            </motion.span>

            <div className="cpl-hero__headline">
              <motion.span
                className="cpl-hero__word cpl-hero__word--1"
                initial={{ opacity: 0, y: 40 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.4, ease: [0.16, 1, 0.3, 1] }}
              >
                COMMERCIAL
              </motion.span>
              <motion.span
                className="cpl-hero__word cpl-hero__word--2"
                initial={{ opacity: 0, y: 40 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.6, ease: [0.16, 1, 0.3, 1] }}
              >
                PILOT
              </motion.span>
            </div>

            <motion.div
              className="cpl-hero__divider-line"
              initial={{ scaleX: 0 }}
              animate={{ scaleX: 1 }}
              transition={{ duration: 0.8, delay: 0.8, ease: [0.16, 1, 0.3, 1] }}
            />

            {/* CPL Badge Card */}
            <motion.div
              className="cpl-hero__badge"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1, duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            >
              <div className="cpl-hero__badge-header">
                <span className="cpl-hero__badge-label">Qualification</span>
                <span className="cpl-hero__badge-type">CPL(H)</span>
              </div>
              <div className="cpl-hero__badge-content">
                <div className="cpl-hero__badge-stat">
                  <span className="cpl-hero__badge-num">155+</span>
                  <span className="cpl-hero__badge-desc">Total Hours</span>
                </div>
                <div className="cpl-hero__badge-divider" />
                <div className="cpl-hero__badge-stat">
                  <span className="cpl-hero__badge-num">CPL(H)</span>
                  <span className="cpl-hero__badge-desc">Qualification</span>
                </div>
              </div>
            </motion.div>

            <motion.p
              className="cpl-hero__sub"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.2 }}
            >
              Holding a Commercial Pilot Licence, CPL(H) gives you the status of professional helicopter pilot.
              Train with HQ — one of the UK's most experienced Robinson training organisations.
            </motion.p>
          </div>
        </motion.div>
      </section>

      {/* ========== INTRO SECTION ========== */}
      <section className="cpl-intro" data-cms-section="cpl-intro">
        <div className="cpl-intro__container">
          <Reveal>
            <div className="cpl-intro__header">
              <span className="cpl-pre-text">From Passion to Profession</span>
              <h2>
                <span className="cpl-text--dark">Fly</span>{' '}
                <span className="cpl-text--mid">For</span>{' '}
                <span className="cpl-text--light">A Living</span>
              </h2>
              <p>
                The Commercial Pilot Licence (CPL/H) is the gateway to a professional career in helicopter aviation.
                Whether you're aiming for charter work, aerial survey, emergency services, or flight instruction,
                the CPL is the qualification that makes it possible. HQ Aviation offers CPL training on the
                Robinson range — the aircraft type you're most likely to fly in your early commercial career.
              </p>
            </div>
          </Reveal>
          <Reveal delay={0.2}>
            <div className="cpl-intro__image">
              <img
                src={pageImages['cpl-intro']?.[0]?.url || '/assets/images/gallery/carousel/rotating-3.jpg'}
                alt="Professional helicopter pilot training at HQ Aviation"
              />
              <div className="cpl-intro__image-caption">
                <span className="cpl-intro__image-caption-num">500+</span>
                <span>Pilots Trained</span>
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ========== PATHWAY SECTION ========== */}
      <section className="cpl-pathway">
        <div className="cpl-pathway__container">
          <Reveal>
            <div className="cpl-section-header">
              <span className="cpl-pre-text">Your Route to CPL</span>
              <h2>
                <span className="cpl-text--dark">The</span>{' '}
                <span className="cpl-text--mid">Journey</span>
              </h2>
            </div>
          </Reveal>

          <div className="cpl-pathway__steps">
            {pathway.map((step, i) => (
              <Reveal key={i} delay={i * 0.1}>
                <div className="cpl-pathway__step">
                  <div className="cpl-pathway__step-inner">
                    <div className="cpl-pathway__num">{step.num}</div>
                    <h4 className="cpl-pathway__title">{step.title}</h4>
                    <div className="cpl-pathway__value">{step.value}</div>
                    <p className="cpl-pathway__desc">{step.desc}</p>
                  </div>
                  {i < pathway.length - 1 && <div className="cpl-pathway__connector" aria-hidden="true" />}
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ========== GROUND SCHOOL SECTION ========== */}
      <section className="cpl-ground">
        <div className="cpl-ground__container">
          <Reveal>
            <div className="cpl-section-header cpl-section-header--light">
              <span className="cpl-pre-text cpl-pre-text--light">Academic Foundation</span>
              <h2>
                <span className="cpl-text--white">Ground School</span>{' '}
                <span className="cpl-text--white-mid">Subjects</span>
              </h2>
              <p className="cpl-ground__desc">
                The CPL(H) requires passing 9 ATPL(H) Frozen examinations. These cover a broad range
                of subjects — some familiar from your PPL study, others covering entirely new material.
              </p>
            </div>
          </Reveal>

          <div className="cpl-ground__grid">
            {groundSubjects.map((subject, i) => (
              <Reveal key={i} delay={i * 0.05}>
                <div className="cpl-ground__card">
                  <span className="cpl-ground__card-num">{subject.num}</span>
                  <h4 className="cpl-ground__card-title">{subject.title}</h4>
                  <p className="cpl-ground__card-desc">{subject.desc}</p>
                </div>
              </Reveal>
            ))}
          </div>

          <Reveal delay={0.4}>
            <div className="cpl-ground__badge-row">
              <span className="cpl-ground__included-badge">INCLUDED WITH TRAINING</span>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ========== HOURS SECTION ========== */}
      <section className="cpl-hours">
        <div className="cpl-hours__container">
          <Reveal>
            <div className="cpl-section-header">
              <span className="cpl-pre-text">The Numbers</span>
              <h2>
                <span className="cpl-text--dark">Flight Hour</span>{' '}
                <span className="cpl-text--mid">Requirements</span>
              </h2>
            </div>
          </Reveal>

          <div className="cpl-hours__stats">
            <Reveal delay={0.1}>
              <div className="cpl-hours__stat">
                <span className="cpl-hours__stat-num">155</span>
                <span className="cpl-hours__stat-label">Total Flight Hours Required</span>
              </div>
            </Reveal>
            <Reveal delay={0.2}>
              <div className="cpl-hours__stat">
                <span className="cpl-hours__stat-num">50</span>
                <span className="cpl-hours__stat-label">Hours as Pilot in Command</span>
              </div>
            </Reveal>
            <Reveal delay={0.3}>
              <div className="cpl-hours__stat">
                <span className="cpl-hours__stat-num">35</span>
                <span className="cpl-hours__stat-label">Hours PIC Cross-Country</span>
              </div>
            </Reveal>
            <Reveal delay={0.4}>
              <div className="cpl-hours__stat">
                <span className="cpl-hours__stat-num">10</span>
                <span className="cpl-hours__stat-label">Hours IFR / Instrument</span>
              </div>
            </Reveal>
          </div>

          <Reveal delay={0.5}>
            <p className="cpl-hours__note">
              These are the regulatory minimums. In practice, most students arrive at CPL training with considerably
              more hours, which is an advantage — additional flight time builds the judgment and decision-making
              that examiners look for.
            </p>
          </Reveal>
        </div>
      </section>

      {/* ========== PROCESS SECTION ========== */}
      <section className="cpl-process">
        <div className="cpl-process__container">
          <Reveal>
            <div className="cpl-section-header cpl-section-header--light">
              <span className="cpl-pre-text cpl-pre-text--light">The Journey</span>
              <h2>
                <span className="cpl-text--white">Training</span>{' '}
                <span className="cpl-text--white-mid">Process</span>
              </h2>
            </div>
          </Reveal>

          <div className="cpl-process__steps">
            {processSteps.map((step, i) => (
              <Reveal key={i} delay={i * 0.1}>
                <div className="cpl-process__step">
                  <div className="cpl-process__step-num">{step.num}</div>
                  <div className="cpl-process__step-content">
                    <div className="cpl-process__step-header">
                      <h4>{step.title}</h4>
                      <span className="cpl-process__step-duration">{step.duration}</span>
                    </div>
                    <p>{step.description}</p>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>

          <Reveal delay={0.5}>
            <div className="cpl-process__timeline">
              <div className="cpl-process__timeline-track">
                {processSteps.map((_, i) => (
                  <React.Fragment key={i}>
                    <div className="cpl-process__timeline-dot" />
                    {i < processSteps.length - 1 && <div className="cpl-process__timeline-line" />}
                  </React.Fragment>
                ))}
              </div>
              <div className="cpl-process__timeline-label">
                <span>Start</span>
                <span>18–24 Months</span>
                <span>Certified</span>
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ========== CAREERS SECTION ========== */}
      <section className="cpl-careers">
        <div className="cpl-careers__container">
          <Reveal>
            <div className="cpl-section-header">
              <span className="cpl-pre-text">Where It Takes You</span>
              <h2>
                <span className="cpl-text--dark">Career</span>{' '}
                <span className="cpl-text--mid">Pathways</span>
              </h2>
              <p>
                The CPL(H) opens doors across commercial helicopter aviation. Here are some of the sectors
                that regularly hire newly-qualified commercial pilots.
              </p>
            </div>
          </Reveal>

          <div className="cpl-careers__grid">
            {careers.map((career, i) => (
              <Reveal key={i} delay={i * 0.08}>
                <div className="cpl-careers__card">
                  <span className="cpl-careers__card-num">{career.num}</span>
                  <h4 className="cpl-careers__card-title">{career.title}</h4>
                  <p className="cpl-careers__card-desc">{career.desc}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ========== FAQ SECTION ========== */}
      <section className="cpl-faq" data-cms-section="faqs-cpl">
        <div className="cpl-faq__container">
          <Reveal>
            <div className="cpl-section-header">
              <span className="cpl-pre-text">Common Questions</span>
              <h2>
                <span className="cpl-text--dark">Frequently</span>{' '}
                <span className="cpl-text--mid">Asked</span>
              </h2>
            </div>
          </Reveal>

          <div className="cpl-faq__list">
            {faqs.map((faq, i) => (
              <Reveal key={faq.id} delay={i * 0.05}>
                <div
                  className={`cpl-faq__item ${openFaq === i ? 'cpl-faq__item--open' : ''}`}
                  onClick={() => setOpenFaq(openFaq === i ? null : i)}
                >
                  <span className="cpl-faq__number">{String(i + 1).padStart(2, '0')}</span>
                  <div className="cpl-faq__content">
                    <h4>
                      {faq.question}
                      <span className="cpl-faq__toggle">{openFaq === i ? '−' : '+'}</span>
                    </h4>
                    <AnimatePresence>
                      {openFaq === i && (
                        <motion.div
                          className="cpl-faq__answer"
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

      {/* ========== ENQUIRY FORM SECTION ========== */}
      <section className="cpl-enquiry">
        <div className="cpl-enquiry__container">
          <div className="cpl-enquiry__left">
            <Reveal>
              <span className="cpl-pre-text">Get Started</span>
              <h2>
                <span className="cpl-text--dark">Enquire About</span>
                <br />
                <span className="cpl-text--mid">CPL Training</span>
              </h2>
              <p className="cpl-enquiry__desc">
                Tell us about your current licence, hours, and goals. We'll give you an honest
                assessment of where you stand and a clear path to your CPL.
              </p>
              <ul className="cpl-enquiry__checklist">
                <li>CAA Declared Training Organisation</li>
                <li>Robinson R22, R44 &amp; R66 fleet</li>
                <li>Experienced commercial instructors</li>
                <li>Based at Denham Aerodrome, Buckinghamshire</li>
              </ul>
            </Reveal>
          </div>

          <div className="cpl-enquiry__right">
            <Reveal delay={0.2}>
              {formStatus === 'success' ? (
                <div className="cpl-enquiry__success">
                  <div className="cpl-enquiry__success-icon" aria-hidden="true">&#10003;</div>
                  <h3>Enquiry Sent</h3>
                  <p>Thank you — we'll be in touch within 24 hours to discuss your CPL journey.</p>
                  <button
                    type="button"
                    className="cpl-btn cpl-btn--outline"
                    onClick={() => setFormStatus('idle')}
                  >
                    Send Another
                  </button>
                </div>
              ) : (
                <form className="cpl-enquiry__form" onSubmit={handleFormSubmit} noValidate>
                  <div className="cpl-enquiry__row">
                    <div className="cpl-enquiry__field">
                      <label htmlFor="cpl-name">Name <span aria-hidden="true">*</span></label>
                      <input
                        id="cpl-name"
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                        required
                        placeholder="Your full name"
                      />
                    </div>
                    <div className="cpl-enquiry__field">
                      <label htmlFor="cpl-email">Email <span aria-hidden="true">*</span></label>
                      <input
                        id="cpl-email"
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                        required
                        placeholder="your@email.com"
                      />
                    </div>
                  </div>

                  <div className="cpl-enquiry__field">
                    <label htmlFor="cpl-phone">Phone</label>
                    <input
                      id="cpl-phone"
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
                      placeholder="+44 7700 000000"
                    />
                  </div>

                  <div className="cpl-enquiry__field">
                    <label htmlFor="cpl-message">Tell us about your current hours and goals</label>
                    <textarea
                      id="cpl-message"
                      name="message"
                      value={formData.message}
                      onChange={(e) => setFormData(prev => ({ ...prev, message: e.target.value }))}
                      rows={5}
                      placeholder="e.g. I hold a PPL(H) with 80 hours, flying an R44. I'd like to work towards CPL and eventually fly commercially..."
                    />
                  </div>

                  {formStatus === 'error' && (
                    <p className="cpl-enquiry__error" role="alert">
                      Please fill in your name and email, then try again.
                    </p>
                  )}

                  <button
                    type="submit"
                    className="cpl-btn cpl-btn--primary cpl-btn--full"
                    disabled={formStatus === 'submitting'}
                  >
                    {formStatus === 'submitting' ? 'Sending...' : 'Send Enquiry'}
                  </button>
                </form>
              )}
            </Reveal>
          </div>
        </div>
      </section>

      {/* ========== CTA SECTION ========== */}
      <section className="cpl-cta">
        <div className="cpl-cta__inner">
          <Reveal>
            <span className="cpl-pre-text cpl-pre-text--light">Ready to Turn Professional?</span>
            <h2>
              <span className="cpl-text--white">Take The</span>{' '}
              <span className="cpl-text--white-mid">Next Step</span>
            </h2>
            <p>
              Talk to our training team about your current hours, your goals, and how HQ can support
              your CPL journey. We'll give you an honest assessment of where you stand and a clear
              path forward.
            </p>
            <div className="cpl-cta__buttons">
              <a href="/contact?subject=cpl" className="cpl-btn cpl-btn--primary cpl-btn--white">
                Enquire Now
              </a>
              <Link to="/training" className="cpl-cta__link">
                View All Training
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
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
        /* =====================================================
           CPL PAGE — COMPLETE STYLESHEET
           Prefix: cpl-
           Brand: Luxury Minimal Aviation
           Fonts: Space Grotesk + Share Tech Mono
        ===================================================== */

        /* ===== BASE ===== */
        .cpl {
          font-family: 'Space Grotesk', -apple-system, sans-serif;
          background: #faf9f6;
          color: #1a1a1a;
          overflow-x: hidden;
        }

        /* ===== UTILITY TEXT COLOURS ===== */
        .cpl-text--dark  { color: #1a1a1a; }
        .cpl-text--mid   { color: #4a4a4a; }
        .cpl-text--light { color: #7a7a7a; }
        .cpl-text--white     { color: #ffffff; }
        .cpl-text--white-mid { color: rgba(255,255,255,0.6); }

        /* ===== PRE-TEXT LABEL ===== */
        .cpl-pre-text {
          display: block;
          font-size: 0.7rem;
          text-transform: uppercase;
          letter-spacing: 0.25em;
          color: #999;
          margin-bottom: 1rem;
          font-family: 'Share Tech Mono', monospace;
        }

        .cpl-pre-text--light {
          color: rgba(255,255,255,0.5);
        }

        /* ===== SECTION HEADER ===== */
        .cpl-section-header {
          text-align: center;
          max-width: 700px;
          margin: 0 auto 3.5rem;
        }

        .cpl-section-header h2 {
          font-size: clamp(2rem, 4vw, 3rem);
          margin: 0.5rem 0 1rem;
          line-height: 1.1;
          text-transform: uppercase;
          font-weight: 700;
          letter-spacing: -0.01em;
        }

        .cpl-section-header p {
          color: #666;
          font-size: 1.05rem;
          line-height: 1.75;
          max-width: 620px;
          margin: 0 auto;
        }

        .cpl-section-header--light h2 {
          color: #fff;
        }

        .cpl-section-header--light p {
          color: rgba(255,255,255,0.65);
        }

        /* ===== BUTTONS ===== */
        .cpl-btn {
          display: inline-block;
          padding: 1rem 2rem;
          font-size: 0.75rem;
          font-weight: 500;
          text-decoration: none;
          text-transform: uppercase;
          letter-spacing: 0.12em;
          border: none;
          cursor: pointer;
          transition: all 0.3s ease;
          font-family: 'Space Grotesk', -apple-system, sans-serif;
          text-align: center;
          border-radius: 2px;
        }

        .cpl-btn--primary {
          background: #1a1a1a;
          color: #fff;
          border: 1px solid #1a1a1a;
        }

        .cpl-btn--primary:hover {
          background: #333;
          border-color: #333;
          color: #fff;
        }

        .cpl-btn--outline {
          background: transparent;
          color: #1a1a1a;
          border: 1px solid #1a1a1a;
        }

        .cpl-btn--outline:hover {
          background: #1a1a1a;
          color: #fff;
        }

        .cpl-btn--white {
          background: #fff;
          color: #1a1a1a;
          border: 1px solid #fff;
        }

        .cpl-btn--white:hover {
          background: #f0f0f0;
          border-color: #f0f0f0;
        }

        .cpl-btn--full {
          width: 100%;
          display: block;
          text-align: center;
        }

        /* =====================================================
           HERO SECTION
        ===================================================== */
        .cpl-hero {
          min-height: 100vh;
          position: relative;
          display: flex;
          flex-direction: column;
          overflow: hidden;
          background: #faf9f6;
        }

        .cpl-hero__bg {
          position: absolute;
          inset: 0;
          z-index: 1;
        }

        .cpl-hero__bg img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          object-position: center 30%;
        }

        .cpl-hero__overlay {
          position: absolute;
          inset: 0;
          z-index: 2;
          background: linear-gradient(
            90deg,
            rgba(250,249,246,0.97) 0%,
            rgba(250,249,246,0.93) 40%,
            rgba(250,249,246,0.55) 70%,
            rgba(250,249,246,0.15) 100%
          );
        }

        .cpl-hero__content {
          position: relative;
          z-index: 3;
          flex: 1;
          display: flex;
          align-items: center;
          padding: 2rem 4rem;
          padding-top: 8rem;
        }

        .cpl-hero__left {
          max-width: 580px;
        }

        .cpl-hero__label {
          font-size: 0.7rem;
          font-weight: 400;
          letter-spacing: 0.2em;
          text-transform: uppercase;
          color: #999;
          display: block;
          margin-bottom: 1.5rem;
          font-family: 'Share Tech Mono', monospace;
        }

        .cpl-hero__headline {
          display: flex;
          flex-direction: column;
          line-height: 1;
          margin-bottom: 1.5rem;
        }

        .cpl-hero__word {
          font-family: 'Space Grotesk', sans-serif;
          font-weight: 700;
          font-size: clamp(3rem, 8vw, 5.5rem);
          letter-spacing: -0.02em;
          text-transform: uppercase;
        }

        .cpl-hero__word--1 { color: #1a1a1a; }
        .cpl-hero__word--2 { color: #4a4a4a; }

        .cpl-hero__divider-line {
          width: 80px;
          height: 2px;
          background: #1a1a1a;
          margin-bottom: 1.5rem;
          transform-origin: left;
        }

        .cpl-hero__sub {
          font-size: 1.05rem;
          color: #666;
          line-height: 1.8;
          max-width: 440px;
          margin: 0;
        }

        /* ===== Hero Badge Card ===== */
        .cpl-hero__badge {
          background: #fff;
          max-width: 290px;
          margin-bottom: 1.75rem;
          box-shadow: 0 4px 24px rgba(0,0,0,0.08);
          border-radius: 8px;
          overflow: hidden;
          border: 1px solid #e8e6e2;
        }

        .cpl-hero__badge-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 0.75rem 1rem;
          border-bottom: 1px solid #f0eeea;
          background: #faf9f6;
        }

        .cpl-hero__badge-label {
          font-size: 0.55rem;
          letter-spacing: 0.15em;
          color: #999;
          text-transform: uppercase;
          font-family: 'Share Tech Mono', monospace;
        }

        .cpl-hero__badge-type {
          font-size: 0.6rem;
          font-weight: 700;
          letter-spacing: 0.12em;
          color: #1a1a1a;
          background: #f0eeea;
          padding: 0.18rem 0.55rem;
          font-family: 'Share Tech Mono', monospace;
          border-radius: 2px;
        }

        .cpl-hero__badge-content {
          display: flex;
          align-items: center;
          justify-content: space-around;
          padding: 1rem 1.25rem;
        }

        .cpl-hero__badge-stat {
          text-align: center;
        }

        .cpl-hero__badge-num {
          display: block;
          font-family: 'Share Tech Mono', monospace;
          font-size: 1.5rem;
          font-weight: 700;
          color: #1a1a1a;
          line-height: 1;
          margin-bottom: 0.25rem;
        }

        .cpl-hero__badge-desc {
          font-size: 0.55rem;
          color: #888;
          text-transform: uppercase;
          letter-spacing: 0.06em;
          font-family: 'Share Tech Mono', monospace;
        }

        .cpl-hero__badge-divider {
          width: 1px;
          height: 32px;
          background: linear-gradient(to bottom, transparent, #e8e6e2, transparent);
        }

        /* =====================================================
           INTRO SECTION
        ===================================================== */
        .cpl-intro {
          padding: 6rem 4rem;
          background: #faf9f6;
          position: relative;
        }

        .cpl-intro::before {
          content: '';
          position: absolute;
          top: 0;
          left: 50%;
          transform: translateX(-50%);
          width: min(80%, 600px);
          height: 1px;
          background: linear-gradient(90deg, transparent, #e0deda, transparent);
        }

        .cpl-intro__container {
          max-width: 1200px;
          margin: 0 auto;
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 5rem;
          align-items: center;
        }

        .cpl-intro__header {
          margin: 0;
        }

        .cpl-intro__header h2 {
          font-size: clamp(1.8rem, 3.5vw, 2.8rem);
          margin: 0.5rem 0 1.25rem;
          text-transform: uppercase;
          font-weight: 700;
          line-height: 1.1;
          letter-spacing: -0.01em;
        }

        .cpl-intro__header p {
          color: #555;
          font-size: 1.05rem;
          line-height: 1.8;
          margin: 0;
        }

        .cpl-intro__image {
          position: relative;
        }

        .cpl-intro__image img {
          width: 100%;
          height: 100%;
          min-height: 400px;
          object-fit: cover;
          display: block;
        }

        .cpl-intro__image-caption {
          position: absolute;
          bottom: -20px;
          right: -20px;
          background: #1a1a1a;
          color: #fff;
          padding: 1.5rem 2rem;
          display: flex;
          flex-direction: column;
        }

        .cpl-intro__image-caption-num {
          font-size: 2rem;
          font-weight: 700;
          line-height: 1;
          font-family: 'Share Tech Mono', monospace;
        }

        .cpl-intro__image-caption span:last-child {
          font-size: 0.7rem;
          text-transform: uppercase;
          letter-spacing: 0.08em;
          opacity: 0.7;
          margin-top: 0.3rem;
        }

        /* =====================================================
           PATHWAY SECTION
        ===================================================== */
        .cpl-pathway {
          padding: 6rem 4rem;
          background: #faf9f6;
        }

        .cpl-pathway__container {
          max-width: 1200px;
          margin: 0 auto;
        }

        .cpl-pathway__steps {
          display: flex;
          align-items: flex-start;
          gap: 0;
          position: relative;
          overflow-x: auto;
          padding-bottom: 1rem;
          -webkit-overflow-scrolling: touch;
          scrollbar-width: none;
        }

        .cpl-pathway__steps::-webkit-scrollbar {
          display: none;
        }

        .cpl-pathway__step {
          display: flex;
          align-items: center;
          flex: 1;
          min-width: 180px;
        }

        .cpl-pathway__step-inner {
          flex: 1;
          text-align: center;
          padding: 2rem 1rem;
          background: #fff;
          border: 1px solid #e8e6e2;
          border-radius: 6px;
          transition: box-shadow 0.3s ease, transform 0.3s ease;
          min-height: 200px;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: flex-start;
        }

        .cpl-pathway__step-inner:hover {
          box-shadow: 0 8px 30px rgba(0,0,0,0.08);
          transform: translateY(-3px);
        }

        .cpl-pathway__num {
          font-family: 'Share Tech Mono', monospace;
          font-size: 0.65rem;
          color: #ccc;
          margin-bottom: 0.75rem;
          display: block;
          letter-spacing: 0.1em;
        }

        .cpl-pathway__title {
          font-size: 0.9rem;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 0.05em;
          margin: 0 0 0.6rem;
          color: #1a1a1a;
        }

        .cpl-pathway__value {
          display: inline-block;
          font-family: 'Share Tech Mono', monospace;
          font-size: 0.75rem;
          font-weight: 700;
          color: #fff;
          background: #1a1a1a;
          padding: 0.2rem 0.65rem;
          border-radius: 2px;
          margin-bottom: 0.85rem;
          letter-spacing: 0.05em;
        }

        .cpl-pathway__desc {
          font-size: 0.8rem;
          color: #777;
          line-height: 1.55;
          margin: 0;
        }

        .cpl-pathway__connector {
          width: 2.5rem;
          height: 2px;
          background: linear-gradient(90deg, #e8e6e2, #c8c4be);
          flex-shrink: 0;
          margin: 0 -1px;
          align-self: center;
          margin-top: -3.5rem;
        }

        /* =====================================================
           GROUND SCHOOL SECTION
        ===================================================== */
        .cpl-ground {
          padding: 6rem 4rem;
          background: #1a1a1a;
        }

        .cpl-ground__container {
          max-width: 1200px;
          margin: 0 auto;
        }

        .cpl-ground__desc {
          color: rgba(255,255,255,0.65);
          font-size: 1rem;
          line-height: 1.75;
          max-width: 640px;
          margin: 0 auto 3rem;
          text-align: center;
          display: block;
        }

        .cpl-ground__grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 1.25rem;
          margin-bottom: 3rem;
        }

        .cpl-ground__card {
          background: rgba(255,255,255,0.05);
          border: 1px solid rgba(255,255,255,0.1);
          padding: 1.5rem;
          border-radius: 8px;
          transition: background 0.3s ease, border-color 0.3s ease;
        }

        .cpl-ground__card:hover {
          background: rgba(255,255,255,0.08);
          border-color: rgba(255,255,255,0.18);
        }

        .cpl-ground__card-num {
          display: block;
          font-family: 'Share Tech Mono', monospace;
          font-size: 0.6rem;
          color: rgba(255,255,255,0.3);
          letter-spacing: 0.1em;
          margin-bottom: 0.6rem;
        }

        .cpl-ground__card-title {
          font-size: 0.95rem;
          font-weight: 700;
          color: #fff;
          margin: 0 0 0.5rem;
          text-transform: uppercase;
          letter-spacing: 0.03em;
        }

        .cpl-ground__card-desc {
          font-size: 0.82rem;
          color: rgba(255,255,255,0.55);
          line-height: 1.55;
          margin: 0;
        }

        .cpl-ground__badge-row {
          text-align: center;
        }

        .cpl-ground__included-badge {
          display: inline-block;
          font-family: 'Share Tech Mono', monospace;
          font-size: 0.6rem;
          letter-spacing: 0.2em;
          color: rgba(255,255,255,0.4);
          border: 1px solid rgba(255,255,255,0.15);
          padding: 0.5rem 1.25rem;
          border-radius: 2px;
          text-transform: uppercase;
        }

        /* =====================================================
           HOURS SECTION
        ===================================================== */
        .cpl-hours {
          padding: 6rem 4rem;
          background: #faf9f6;
        }

        .cpl-hours__container {
          max-width: 1200px;
          margin: 0 auto;
        }

        .cpl-hours__stats {
          display: flex;
          gap: 2rem;
          justify-content: center;
          flex-wrap: wrap;
          margin-bottom: 3rem;
        }

        .cpl-hours__stat {
          flex: 1;
          min-width: 160px;
          max-width: 240px;
          text-align: center;
          padding: 2.5rem 1.5rem;
          background: #fff;
          border: 1px solid #e8e6e2;
          border-radius: 8px;
          transition: box-shadow 0.3s ease, transform 0.3s ease;
        }

        .cpl-hours__stat:hover {
          box-shadow: 0 8px 30px rgba(0,0,0,0.07);
          transform: translateY(-3px);
        }

        .cpl-hours__stat-num {
          display: block;
          font-family: 'Share Tech Mono', monospace;
          font-size: clamp(3rem, 5vw, 4.5rem);
          font-weight: 800;
          color: #1a1a1a;
          line-height: 1;
          margin-bottom: 0.75rem;
          letter-spacing: -0.02em;
        }

        .cpl-hours__stat-label {
          display: block;
          font-size: 0.78rem;
          color: #888;
          line-height: 1.4;
          text-transform: uppercase;
          letter-spacing: 0.06em;
        }

        .cpl-hours__note {
          max-width: 720px;
          margin: 0 auto;
          text-align: center;
          color: #666;
          font-size: 0.95rem;
          line-height: 1.75;
          padding: 1.5rem 2rem;
          background: #fff;
          border: 1px solid #e8e6e2;
          border-left: 3px solid #1a1a1a;
          border-radius: 0 4px 4px 0;
        }

        /* =====================================================
           PROCESS SECTION
        ===================================================== */
        .cpl-process {
          padding: 6rem 4rem;
          background: #1a1a1a;
        }

        .cpl-process__container {
          max-width: 900px;
          margin: 0 auto;
        }

        .cpl-process__steps {
          display: flex;
          flex-direction: column;
          gap: 0;
        }

        .cpl-process__step {
          display: flex;
          gap: 1.75rem;
          padding: 1.75rem 0;
          border-bottom: 1px solid rgba(255,255,255,0.1);
        }

        .cpl-process__step:last-child {
          border-bottom: none;
        }

        .cpl-process__step-num {
          font-family: 'Share Tech Mono', monospace;
          font-size: 0.75rem;
          color: rgba(255,255,255,0.3);
          flex-shrink: 0;
          padding-top: 0.2rem;
          letter-spacing: 0.05em;
        }

        .cpl-process__step-content {
          flex: 1;
        }

        .cpl-process__step-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 0.6rem;
          gap: 1rem;
          flex-wrap: wrap;
        }

        .cpl-process__step-header h4 {
          font-size: 1rem;
          font-weight: 600;
          margin: 0;
          color: #fff;
          text-transform: uppercase;
          letter-spacing: 0.04em;
        }

        .cpl-process__step-duration {
          font-family: 'Share Tech Mono', monospace;
          font-size: 0.7rem;
          color: rgba(255,255,255,0.5);
          letter-spacing: 0.1em;
          white-space: nowrap;
        }

        .cpl-process__step-content p {
          font-size: 0.9rem;
          color: rgba(255,255,255,0.6);
          line-height: 1.65;
          margin: 0;
        }

        .cpl-process__timeline {
          margin-top: 3rem;
          padding-top: 2rem;
          border-top: 1px solid rgba(255,255,255,0.1);
        }

        .cpl-process__timeline-track {
          display: flex;
          align-items: center;
          gap: 0;
          margin-bottom: 0.75rem;
        }

        .cpl-process__timeline-dot {
          width: 10px;
          height: 10px;
          border-radius: 50%;
          background: rgba(255,255,255,0.5);
          flex-shrink: 0;
        }

        .cpl-process__timeline-line {
          flex: 1;
          height: 1px;
          background: rgba(255,255,255,0.2);
        }

        .cpl-process__timeline-label {
          display: flex;
          justify-content: space-between;
        }

        .cpl-process__timeline-label span {
          font-family: 'Share Tech Mono', monospace;
          font-size: 0.6rem;
          color: rgba(255,255,255,0.4);
          letter-spacing: 0.1em;
          text-transform: uppercase;
        }

        /* =====================================================
           CAREERS SECTION
        ===================================================== */
        .cpl-careers {
          padding: 6rem 4rem;
          background: #faf9f6;
        }

        .cpl-careers__container {
          max-width: 1200px;
          margin: 0 auto;
        }

        .cpl-careers__grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 1.5rem;
        }

        .cpl-careers__card {
          border: 1px solid #e8e6e2;
          padding: 1.75rem;
          border-radius: 8px;
          background: #fff;
          transition: box-shadow 0.3s ease, transform 0.3s ease, border-color 0.3s ease;
        }

        .cpl-careers__card:hover {
          box-shadow: 0 8px 30px rgba(0,0,0,0.07);
          transform: translateY(-2px);
          border-color: #ccc;
        }

        .cpl-careers__card-num {
          display: block;
          font-family: 'Share Tech Mono', monospace;
          font-size: 0.6rem;
          color: #ccc;
          letter-spacing: 0.1em;
          margin-bottom: 0.6rem;
        }

        .cpl-careers__card-title {
          font-size: 1rem;
          font-weight: 700;
          color: #1a1a1a;
          margin: 0 0 0.6rem;
          text-transform: uppercase;
          letter-spacing: 0.03em;
        }

        .cpl-careers__card-desc {
          font-size: 0.88rem;
          color: #666;
          line-height: 1.6;
          margin: 0;
        }

        /* =====================================================
           FAQ SECTION
        ===================================================== */
        .cpl-faq {
          padding: 6rem 4rem;
          background: #faf9f6;
        }

        .cpl-faq__container {
          max-width: 800px;
          margin: 0 auto;
        }

        .cpl-faq__list {
          display: flex;
          flex-direction: column;
        }

        .cpl-faq__item {
          display: flex;
          gap: 1.5rem;
          padding: 1.25rem 0;
          border-bottom: 1px solid #e8e6e2;
          cursor: pointer;
          transition: background 0.2s ease;
          user-select: none;
        }

        .cpl-faq__item:hover {
          background: rgba(0,0,0,0.01);
        }

        .cpl-faq__item--open {
          background: rgba(0,0,0,0.02);
        }

        .cpl-faq__number {
          font-family: 'Share Tech Mono', monospace;
          font-size: 0.75rem;
          color: #ccc;
          flex-shrink: 0;
          padding-top: 0.1rem;
          letter-spacing: 0.05em;
        }

        .cpl-faq__content {
          flex: 1;
        }

        .cpl-faq__content h4 {
          margin: 0;
          font-size: 1rem;
          font-weight: 600;
          display: flex;
          justify-content: space-between;
          align-items: center;
          gap: 1rem;
          line-height: 1.4;
        }

        .cpl-faq__toggle {
          font-size: 1.25rem;
          font-weight: 300;
          color: #999;
          flex-shrink: 0;
          line-height: 1;
        }

        .cpl-faq__answer {
          overflow: hidden;
        }

        .cpl-faq__answer p {
          margin: 0.75rem 0 0;
          color: #666;
          line-height: 1.75;
          font-size: 0.95rem;
        }

        /* =====================================================
           ENQUIRY FORM SECTION
        ===================================================== */
        .cpl-enquiry {
          padding: 6rem 4rem;
          background: #fff;
        }

        .cpl-enquiry__container {
          max-width: 1200px;
          margin: 0 auto;
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 5rem;
          align-items: start;
        }

        .cpl-enquiry__left h2 {
          font-size: clamp(1.75rem, 3vw, 2.5rem);
          font-weight: 700;
          text-transform: uppercase;
          margin: 0.5rem 0 1.25rem;
          line-height: 1.15;
          letter-spacing: -0.01em;
        }

        .cpl-enquiry__desc {
          color: #666;
          font-size: 1rem;
          line-height: 1.75;
          margin-bottom: 2rem;
        }

        .cpl-enquiry__checklist {
          list-style: none;
          padding: 0;
          margin: 0;
          display: flex;
          flex-direction: column;
          gap: 0.6rem;
        }

        .cpl-enquiry__checklist li {
          display: flex;
          align-items: center;
          gap: 0.6rem;
          font-size: 0.88rem;
          color: #555;
        }

        .cpl-enquiry__checklist li::before {
          content: '';
          display: inline-block;
          width: 6px;
          height: 6px;
          background: #1a1a1a;
          border-radius: 50%;
          flex-shrink: 0;
        }

        .cpl-enquiry__form {
          display: flex;
          flex-direction: column;
          gap: 1.25rem;
        }

        .cpl-enquiry__row {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 1rem;
        }

        .cpl-enquiry__field {
          display: flex;
          flex-direction: column;
          gap: 0.4rem;
        }

        .cpl-enquiry__field label {
          font-size: 0.72rem;
          text-transform: uppercase;
          letter-spacing: 0.1em;
          color: #666;
          font-weight: 500;
        }

        .cpl-enquiry__field label span {
          color: #c00;
          margin-left: 2px;
        }

        .cpl-enquiry__field input,
        .cpl-enquiry__field textarea {
          font-family: 'Space Grotesk', -apple-system, sans-serif;
          font-size: 0.95rem;
          color: #1a1a1a;
          background: #faf9f6;
          border: 1px solid #e8e6e2;
          padding: 0.75rem 1rem;
          border-radius: 4px;
          width: 100%;
          box-sizing: border-box;
          transition: border-color 0.25s ease, box-shadow 0.25s ease;
          appearance: none;
          -webkit-appearance: none;
          resize: none;
        }

        .cpl-enquiry__field input:focus,
        .cpl-enquiry__field textarea:focus {
          outline: none;
          border-color: #1a1a1a;
          box-shadow: 0 0 0 2px rgba(26,26,26,0.07);
        }

        .cpl-enquiry__field input::placeholder,
        .cpl-enquiry__field textarea::placeholder {
          color: #bbb;
        }

        .cpl-enquiry__error {
          font-size: 0.82rem;
          color: #c00;
          margin: 0;
          padding: 0.6rem 0.9rem;
          background: rgba(204,0,0,0.05);
          border-left: 2px solid #c00;
          border-radius: 0 2px 2px 0;
        }

        .cpl-enquiry__success {
          text-align: center;
          padding: 3rem 2rem;
          background: #faf9f6;
          border: 1px solid #e8e6e2;
          border-radius: 8px;
        }

        .cpl-enquiry__success-icon {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 56px;
          height: 56px;
          background: #1a1a1a;
          color: #fff;
          border-radius: 50%;
          font-size: 1.4rem;
          margin: 0 auto 1.25rem;
        }

        .cpl-enquiry__success h3 {
          font-size: 1.25rem;
          font-weight: 700;
          margin: 0 0 0.5rem;
          text-transform: uppercase;
        }

        .cpl-enquiry__success p {
          color: #666;
          font-size: 0.95rem;
          line-height: 1.6;
          margin-bottom: 1.5rem;
        }

        /* =====================================================
           CTA SECTION
        ===================================================== */
        .cpl-cta {
          background: #1a1a1a;
          position: relative;
          overflow: hidden;
        }

        .cpl-cta::before {
          content: '';
          position: absolute;
          inset: 0;
          background: radial-gradient(ellipse 80% 60% at 50% 100%, rgba(255,255,255,0.03), transparent);
          pointer-events: none;
        }

        .cpl-cta__inner {
          max-width: 700px;
          margin: 0 auto;
          padding: 6rem 4rem;
          text-align: center;
          position: relative;
          z-index: 1;
        }

        .cpl-cta__inner h2 {
          font-size: clamp(2rem, 4vw, 3rem);
          margin: 0.5rem 0 1.25rem;
          line-height: 1.1;
          text-transform: uppercase;
          font-weight: 700;
          letter-spacing: -0.01em;
        }

        .cpl-cta__inner p {
          color: rgba(255,255,255,0.65);
          font-size: 1.05rem;
          line-height: 1.75;
          max-width: 560px;
          margin: 0 auto 2.5rem;
        }

        .cpl-cta__buttons {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 2rem;
          flex-wrap: wrap;
        }

        .cpl-cta__link {
          display: inline-flex;
          align-items: center;
          gap: 0.5rem;
          font-size: 0.75rem;
          text-transform: uppercase;
          letter-spacing: 0.1em;
          color: rgba(255,255,255,0.65);
          text-decoration: none;
          transition: color 0.25s ease, gap 0.25s ease;
        }

        .cpl-cta__link:hover {
          color: #fff;
          gap: 0.75rem;
        }

        .cpl-cta__link svg {
          transition: transform 0.25s ease;
        }

        .cpl-cta__link:hover svg {
          transform: translateX(3px);
        }

        /* =====================================================
           RESPONSIVE — 1024px
        ===================================================== */
        @media (max-width: 1024px) {
          .cpl-intro,
          .cpl-pathway,
          .cpl-hours,
          .cpl-careers,
          .cpl-faq,
          .cpl-enquiry {
            padding: 5rem 3rem;
          }

          .cpl-ground,
          .cpl-process {
            padding: 5rem 3rem;
          }

          .cpl-cta__inner {
            padding: 5rem 3rem;
          }

          .cpl-intro__container {
            gap: 3.5rem;
          }

          .cpl-enquiry__container {
            gap: 3.5rem;
          }

          .cpl-careers__grid {
            grid-template-columns: repeat(2, 1fr);
          }

          .cpl-ground__grid {
            grid-template-columns: repeat(3, 1fr);
          }

          .cpl-pathway__step {
            min-width: 160px;
          }

          .cpl-pathway__connector {
            width: 1.5rem;
          }
        }

        /* =====================================================
           RESPONSIVE — 768px
        ===================================================== */
        @media (max-width: 768px) {
          .cpl-intro,
          .cpl-pathway,
          .cpl-hours,
          .cpl-careers,
          .cpl-faq,
          .cpl-enquiry {
            padding: 4rem 1.5rem;
          }

          .cpl-ground,
          .cpl-process {
            padding: 4rem 1.5rem;
          }

          .cpl-cta__inner {
            padding: 4rem 1.5rem;
          }

          /* Hero */
          .cpl-hero__content {
            padding: 2rem 1.5rem;
            padding-top: 7rem;
            align-items: flex-end;
            padding-bottom: 3rem;
          }

          .cpl-hero__overlay {
            background: linear-gradient(
              180deg,
              rgba(250,249,246,0.85) 0%,
              rgba(250,249,246,0.92) 60%,
              rgba(250,249,246,0.97) 100%
            );
          }

          .cpl-hero__left {
            max-width: 100%;
          }

          .cpl-hero__word {
            font-size: clamp(2.5rem, 12vw, 4rem);
          }

          .cpl-hero__sub {
            font-size: 0.95rem;
            max-width: 100%;
          }

          /* Intro */
          .cpl-intro__container {
            grid-template-columns: 1fr;
            gap: 3rem;
          }

          .cpl-intro__image {
            margin-right: 1rem;
            margin-bottom: 1.5rem;
          }

          .cpl-intro__image img {
            min-height: 280px;
          }

          .cpl-intro__image-caption {
            bottom: -15px;
            right: -10px;
            padding: 1rem 1.25rem;
          }

          .cpl-intro__image-caption-num {
            font-size: 1.5rem;
          }

          /* Pathway — horizontal scroll on mobile */
          .cpl-pathway__steps {
            flex-direction: row;
            overflow-x: auto;
            padding-bottom: 1.5rem;
            gap: 0;
          }

          .cpl-pathway__step {
            min-width: 200px;
            flex-shrink: 0;
          }

          .cpl-pathway__step-inner {
            min-height: 220px;
          }

          .cpl-pathway__connector {
            margin-top: -4rem;
          }

          /* Ground */
          .cpl-ground__grid {
            grid-template-columns: 1fr;
            gap: 0.85rem;
          }

          /* Hours */
          .cpl-hours__stats {
            flex-direction: column;
            align-items: center;
          }

          .cpl-hours__stat {
            max-width: 100%;
            width: 100%;
          }

          .cpl-hours__stat-num {
            font-size: clamp(2.5rem, 10vw, 3.5rem);
          }

          /* Careers */
          .cpl-careers__grid {
            grid-template-columns: 1fr;
          }

          /* Enquiry */
          .cpl-enquiry__container {
            grid-template-columns: 1fr;
            gap: 2.5rem;
          }

          .cpl-enquiry__row {
            grid-template-columns: 1fr;
          }

          /* Section header */
          .cpl-section-header {
            margin-bottom: 2.5rem;
          }

          .cpl-section-header h2 {
            font-size: clamp(1.75rem, 6vw, 2.25rem);
          }

          /* CTA */
          .cpl-cta__buttons {
            flex-direction: column;
            gap: 1.25rem;
          }

          /* Process */
          .cpl-process__step {
            flex-direction: column;
            gap: 0.75rem;
            padding: 1.5rem 0;
          }

          .cpl-process__step-header {
            flex-direction: column;
            align-items: flex-start;
            gap: 0.25rem;
          }
        }

        /* =====================================================
           RESPONSIVE — 480px
        ===================================================== */
        @media (max-width: 480px) {
          .cpl-intro,
          .cpl-pathway,
          .cpl-hours,
          .cpl-careers,
          .cpl-faq,
          .cpl-enquiry {
            padding: 3.5rem 1.25rem;
          }

          .cpl-ground,
          .cpl-process {
            padding: 3.5rem 1.25rem;
          }

          .cpl-cta__inner {
            padding: 3.5rem 1.25rem;
          }

          .cpl-hero__content {
            padding: 1.25rem;
            padding-top: 6rem;
          }

          .cpl-hero__badge {
            max-width: 100%;
          }

          .cpl-hero__word {
            font-size: clamp(2.25rem, 14vw, 3.5rem);
          }

          .cpl-hero__sub {
            font-size: 0.88rem;
          }

          .cpl-faq__item {
            gap: 0.75rem;
          }

          .cpl-faq__content h4 {
            font-size: 0.9rem;
          }

          .cpl-pathway__step {
            min-width: 175px;
          }

          .cpl-hours__stat-num {
            font-size: clamp(2.25rem, 12vw, 3.5rem);
          }

          .cpl-btn {
            padding: 0.875rem 1.5rem;
          }
        }
      `}</style>
    </div>
  );
}

export default CPL;

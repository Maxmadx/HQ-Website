/**
 * SUPERYACHT OPERATIONS PAGE
 *
 * A premium, understated page targeting ultra-high-net-worth yacht owners.
 * Covers deck ops training, pilot provisioning, maintenance coordination,
 * permit handling, and worldwide logistics for yacht-based helicopter operations.
 *
 * Brand: Luxury Minimal Aviation
 * Typography: Space Grotesk + Share Tech Mono
 * CSS prefix: syo-
 * Route: /superyacht-ops
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

/* ─────────────────────────────────────────────────────────────────────────────
   HEADER COMPONENT
───────────────────────────────────────────────────────────────────────────── */
function SuperYachtOpsHeader() {
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
              <li><Link to="/superyacht-ops" onClick={closeMenu}>SuperYacht Operations</Link></li>
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

/* ─────────────────────────────────────────────────────────────────────────────
   REVEAL COMPONENT
───────────────────────────────────────────────────────────────────────────── */
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

/* ─────────────────────────────────────────────────────────────────────────────
   DATA
───────────────────────────────────────────────────────────────────────────── */
const services = [
  {
    num: '01',
    title: 'Deck Operations Training',
    desc: 'Crew training for safe deck operations — marshalling, blade-folding, tie-down, fuelling, emergency procedures. CAA-compliant training records maintained.',
  },
  {
    num: '02',
    title: 'Pilot Provisioning',
    desc: 'Fully rated, current, and insured pilots for your operations. All hold appropriate type ratings and are experienced in yacht deck operations.',
  },
  {
    num: '03',
    title: 'Maintenance Coordination',
    desc: 'We manage your maintenance schedule regardless of where in the world the vessel is — coordinating with approved engineers at the nearest certified facility.',
  },
  {
    num: '04',
    title: 'Permit & Documentation',
    desc: 'Overflight permits, landing authorisations, customs documentation, flag state requirements across every jurisdiction your season covers.',
  },
  {
    num: '05',
    title: 'Worldwide Logistics',
    desc: 'Fuel planning, ground handling, FBO coordination, and route support. Mediterranean, Caribbean, Pacific — wherever your season takes you.',
  },
  {
    num: '06',
    title: 'Owner Management Advisory',
    desc: 'Strategic advice on aircraft selection, insurance, crewing structure, and operational setup for new or evolving yacht helicopter programmes.',
  },
];

const regions = [
  { num: '01', name: 'Mediterranean', detail: 'Balearics, French Riviera, Italian coast, Greece, Croatia, Turkish coast' },
  { num: '02', name: 'Caribbean', detail: 'BVI, Antigua, St Barths, Grenada, Bahamas, US Virgin Islands' },
  { num: '03', name: 'Northern Europe', detail: 'Norwegian fjords, Scotland, Ireland, Scandinavia, Iceland' },
  { num: '04', name: 'Indian Ocean', detail: 'Maldives, Seychelles, Mauritius, Red Sea, East Africa' },
  { num: '05', name: 'Pacific & Americas', detail: 'Hawaii, French Polynesia, Pacific Coast, Galapagos' },
];

const trust = [
  {
    title: 'CAA Approved',
    desc: 'Declared Training Organisation — all training meets regulatory requirements',
  },
  {
    title: 'Robinson Authorised',
    desc: 'Factory-authorised service centre for the full Robinson range',
  },
  {
    title: 'Independent Advice',
    desc: 'We work for the owner, not the manufacturer or insurer',
  },
  {
    title: 'Discreet Operations',
    desc: 'All client information treated with absolute confidentiality',
  },
];

/* ─────────────────────────────────────────────────────────────────────────────
   MAIN COMPONENT
───────────────────────────────────────────────────────────────────────────── */
export default function SuperYachtOps() {
  const heroRef = useRef(null);
  const [openFaq, setOpenFaq] = useState(null);
  const [showAllFaqs, setShowAllFaqs] = useState(false);
  const pageImages = usePageImages('superyacht-ops');
  useCmsHighlight();
  const { scrollYProgress } = useScroll({ target: heroRef, offset: ['start start', 'end start'] });
  useEffect(() => { window.scrollTo(0, 0); }, []);
  const heroOpacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);
  const heroScale = useTransform(scrollYProgress, [0, 0.5], [1, 0.95]);
  const heroY = useTransform(scrollYProgress, [0, 0.5], [0, 100]);
  const [formData, setFormData] = useState({ name: '', email: '', phone: '', vessel: '', aircraftType: '', message: '' });
  const [formStatus, setFormStatus] = useState('idle');
  const { faqs: rawFaqs } = useFaqs('superyacht-ops', { visibleOnly: true });
  const fallbackFaqs = [
    { id: 'f1', question: 'What aircraft types does HQ support for yacht operations?', answer: 'HQ specialises in the Robinson range (R44, R66) which are the most common yacht-based helicopters due to their compact size and reliability. We also support AW109, H135, and other light turbine types through our partner network.' },
    { id: 'f2', question: 'Do you provide pilots for the whole season?', answer: 'Yes — we can provide a dedicated pilot for the duration of your Mediterranean or Caribbean season, or for specific legs. All pilots are fully current on type, insured, and experienced in yacht deck operations.' },
    { id: 'f3', question: 'How do you handle maintenance when the yacht is overseas?', answer: 'We maintain a schedule for your aircraft and coordinate with approved engineers at facilities near your itinerary. For Robinson aircraft, we work with factory-authorised service centres in key cruising regions.' },
    { id: 'f4', question: 'Can you help set up a new yacht helicopter programme from scratch?', answer: 'Absolutely. We advise on aircraft selection, deck modifications, crew training, insurance, and operational procedures — everything needed to start operating safely and compliantly.' },
    { id: 'f5', question: 'Is the service confidential?', answer: 'Completely. All client and vessel information is held in strict confidence. We do not discuss client operations or identities.' },
  ];
  const faqs = rawFaqs.length > 0 ? rawFaqs : fallbackFaqs;

  const setField = (field) => (e) => setFormData((f) => ({ ...f, [field]: e.target.value }));

  async function handleFormSubmit(e) {
    e.preventDefault();
    if (!formData.name.trim() || !formData.email.trim()) { setFormStatus('error'); return; }
    setFormStatus('submitting');
    try {
      const res = await fetch('/api/leads', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...formData, subject: 'SuperYacht Ops Enquiry', source: 'superyacht-ops-page' }),
      });
      if (!res.ok) throw new Error();
      setFormStatus('success');
      setFormData({ name: '', email: '', phone: '', vessel: '', aircraftType: '', message: '' });
    } catch {
      setFormStatus('error');
    }
  }

  const heroImage = pageImages['syo-hero']?.[0]?.url || '/assets/images/lifestyle/superyacht-ops.jpg';
  const introImage = pageImages['syo-intro']?.[0]?.url || '/assets/images/lifestyle/superyacht-ops.jpg';

  return (
    <div className="syo">
      <SuperYachtOpsHeader />

      {/* ===================================================================
          1. HERO
      =================================================================== */}
      <section ref={heroRef} className="syo-hero" data-cms-section="syo-hero">
        <div
          className="syo-hero__bg"
          style={{ backgroundImage: `url(${heroImage})` }}
        />
        <div className="syo-hero__overlay" />

        <motion.div
          className="syo-hero__content"
          style={{ opacity: heroOpacity, scale: heroScale, y: heroY }}
        >
          <motion.span
            className="syo-hero__label"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          >
            Specialist Aviation
          </motion.span>

          <div className="syo-hero__headline">
            <motion.span
              className="syo-hero__word syo-hero__word--1"
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4, ease: [0.16, 1, 0.3, 1] }}
            >
              SUPERYACHT
            </motion.span>
            <motion.span
              className="syo-hero__word syo-hero__word--2"
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.6, ease: [0.16, 1, 0.3, 1] }}
            >
              OPERATIONS
            </motion.span>
          </div>

          <motion.div
            className="syo-hero__divider"
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ duration: 0.8, delay: 0.8, ease: [0.16, 1, 0.3, 1] }}
          />

          <motion.div
            className="syo-hero__badge"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.0, duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          >
            <div className="syo-hero__badge-item">
              <span className="syo-hero__badge-strong">Worldwide</span>
              <span className="syo-hero__badge-weak">Operations</span>
            </div>
            <div className="syo-hero__badge-divider" />
            <div className="syo-hero__badge-item">
              <span className="syo-hero__badge-strong">Bespoke</span>
              <span className="syo-hero__badge-weak">Service</span>
            </div>
          </motion.div>

          <motion.p
            className="syo-hero__sub"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.2, duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          >
            Deck operations, pilot provisioning, maintenance coordination, permit handling, and worldwide
            logistics for yacht-based helicopter operations. HQ manages the aviation side so you can focus
            on the voyage.
          </motion.p>
        </motion.div>
      </section>

      {/* ===================================================================
          2. INTRO
      =================================================================== */}
      <section className="syo-intro" data-cms-section="syo-intro">
        <div className="syo-intro__inner">
          <div className="syo-intro__left">
            <Reveal>
              <span className="syo-pre-text">The Complete Solution</span>
              <h2 className="syo-intro__heading">Your Helicopter. Our Expertise.</h2>
              <p className="syo-intro__body">
                Operating a helicopter from a superyacht is a uniquely complex proposition. Beyond the
                aircraft itself, there are crew licensing requirements, flag state permits, international
                airspace authorities, landing permissions, fuel coordination, and the logistical reality
                of operating a maintenance-dependent machine thousands of miles from your home base.
              </p>
              <p className="syo-intro__body">
                HQ has been managing yacht-based helicopter operations for private owners for over a
                decade. We handle the complexity so you don't have to.
              </p>
            </Reveal>

            <Reveal delay={0.15}>
              <div className="syo-intro__stats">
                <div className="syo-intro__stat">
                  <span className="syo-intro__stat-num">3</span>
                  <span className="syo-intro__stat-label">Continents</span>
                  <span className="syo-intro__stat-sub">Active Operations</span>
                </div>
                <div className="syo-intro__stat-divider" />
                <div className="syo-intro__stat">
                  <span className="syo-intro__stat-num">10+</span>
                  <span className="syo-intro__stat-label">Years</span>
                  <span className="syo-intro__stat-sub">Yacht Aviation</span>
                </div>
                <div className="syo-intro__stat-divider" />
                <div className="syo-intro__stat">
                  <span className="syo-intro__stat-num">24/7</span>
                  <span className="syo-intro__stat-label">&nbsp;</span>
                  <span className="syo-intro__stat-sub">Operations Support</span>
                </div>
              </div>
            </Reveal>
          </div>

          <Reveal direction="left" delay={0.2}>
            <div className="syo-intro__right">
              <div className="syo-intro__image-wrap">
                <img src={introImage} alt="HQ superyacht helicopter operations" className="syo-intro__image" />
                <div className="syo-intro__caption">Global Operations Network</div>
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ===================================================================
          3. SERVICES GRID
      =================================================================== */}
      <section className="syo-services">
        <div className="syo-services__inner">
          <Reveal>
            <div className="syo-section-header">
              <span className="syo-pre-text">What We Handle</span>
              <h2 className="syo-section-h2">Our Services</h2>
            </div>
          </Reveal>

          <div className="syo-services__grid">
            {services.map((svc, i) => (
              <Reveal key={svc.num} delay={i * 0.07}>
                <div className="syo-services__card">
                  <span className="syo-services__card-num">{svc.num}</span>
                  <h3 className="syo-services__card-title">{svc.title}</h3>
                  <p className="syo-services__card-desc">{svc.desc}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ===================================================================
          4. REGIONS
      =================================================================== */}
      <section className="syo-regions">
        <div className="syo-regions__inner">
          <Reveal>
            <div className="syo-section-header syo-section-header--light">
              <span className="syo-pre-text syo-pre-text--light">Where We Operate</span>
              <h2 className="syo-section-h2 syo-section-h2--light">Global Reach</h2>
              <p className="syo-regions__intro">
                HQ supports yacht helicopter operations across all major cruising regions. Our network
                of trusted partners, approved maintenance facilities, and permit agents covers the routes
                that superyachts actually sail.
              </p>
            </div>
          </Reveal>

          <div className="syo-regions__cards">
            {regions.map((region, i) => (
              <Reveal key={region.num} delay={i * 0.08}>
                <div className="syo-regions__card">
                  <span className="syo-regions__card-num">{region.num}</span>
                  <h3 className="syo-regions__card-name">{region.name}</h3>
                  <p className="syo-regions__card-detail">{region.detail}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ===================================================================
          5. TRUST
      =================================================================== */}
      <section className="syo-trust">
        <div className="syo-trust__inner">
          <Reveal>
            <div className="syo-section-header syo-section-header--light">
              <span className="syo-pre-text syo-pre-text--light">Why HQ</span>
              <h2 className="syo-section-h2 syo-section-h2--light">Built on Experience</h2>
            </div>
          </Reveal>

          <div className="syo-trust__grid">
            {trust.map((item, i) => (
              <Reveal key={item.title} delay={i * 0.1}>
                <div className="syo-trust__block">
                  <h4 className="syo-trust__block-title">{item.title}</h4>
                  <p className="syo-trust__block-desc">{item.desc}</p>
                </div>
              </Reveal>
            ))}
          </div>

          <Reveal delay={0.3}>
            <div className="syo-trust__quote-wrap">
              <p className="syo-trust__quote">
                "The difference between a smooth operation and an operational headache is almost always
                preparation and local knowledge. We provide both."
              </p>
              <span className="syo-trust__attribution">HQ Aviation Operations Team</span>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ===================================================================
          6. ENQUIRY FORM
      =================================================================== */}
      <section className="syo-enquiry" id="enquire">
        <div className="syo-enquiry__inner">
          <Reveal>
            <div className="syo-enquiry__left">
              <span className="syo-pre-text">Start a Conversation</span>
              <h2 className="syo-enquiry__heading">Get In Touch</h2>
              <p className="syo-enquiry__desc">
                Every yacht operation is different. Tell us about your vessel, your aircraft, and your
                season plans — we'll come back with a clear picture of how we can support you.
              </p>
            </div>
          </Reveal>

          <Reveal delay={0.15}>
            <div className="syo-enquiry__right">
              {formStatus === 'success' ? (
                <div className="syo-enquiry__success">
                  <div className="syo-enquiry__success-icon">
                    <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
                      <circle cx="14" cy="14" r="13" stroke="#1a1a1a" strokeWidth="1.5" />
                      <path d="M8.5 14L12.5 18L19.5 10" stroke="#1a1a1a" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </div>
                  <p className="syo-enquiry__success-text">We'll be in touch within 24 hours.</p>
                </div>
              ) : (
                <form className="syo-enquiry__form" onSubmit={handleFormSubmit} noValidate>
                  <div className="syo-enquiry__row">
                    <div className="syo-field">
                      <label htmlFor="syo-name">Name <span className="syo-field-req">*</span></label>
                      <input
                        id="syo-name"
                        type="text"
                        placeholder="Your full name"
                        value={formData.name}
                        onChange={setField('name')}
                        required
                      />
                    </div>
                    <div className="syo-field">
                      <label htmlFor="syo-email">Email <span className="syo-field-req">*</span></label>
                      <input
                        id="syo-email"
                        type="email"
                        placeholder="your@email.com"
                        value={formData.email}
                        onChange={setField('email')}
                        required
                      />
                    </div>
                  </div>

                  <div className="syo-enquiry__row">
                    <div className="syo-field">
                      <label htmlFor="syo-phone">Phone</label>
                      <input
                        id="syo-phone"
                        type="tel"
                        placeholder="+44 7700 000000"
                        value={formData.phone}
                        onChange={setField('phone')}
                      />
                    </div>
                    <div className="syo-field">
                      <label htmlFor="syo-vessel">Vessel Name</label>
                      <input
                        id="syo-vessel"
                        type="text"
                        placeholder="Optional"
                        value={formData.vessel}
                        onChange={setField('vessel')}
                      />
                    </div>
                  </div>

                  <div className="syo-field">
                    <label htmlFor="syo-aircraft">Aircraft Type</label>
                    <input
                      id="syo-aircraft"
                      type="text"
                      placeholder="e.g. Robinson R66, AW109"
                      value={formData.aircraftType}
                      onChange={setField('aircraftType')}
                    />
                  </div>

                  <div className="syo-field">
                    <label htmlFor="syo-message">Message</label>
                    <textarea
                      id="syo-message"
                      rows={5}
                      placeholder="Tell us about your vessel, season plans, and how we can help..."
                      value={formData.message}
                      onChange={setField('message')}
                    />
                  </div>

                  {formStatus === 'error' && (
                    <p className="syo-enquiry__error">Please fill in your name and email to continue.</p>
                  )}

                  <button
                    type="submit"
                    className="syo-btn syo-btn--primary"
                    disabled={formStatus === 'submitting'}
                  >
                    {formStatus === 'submitting' ? 'Sending...' : 'Send Enquiry'}
                  </button>
                </form>
              )}
            </div>
          </Reveal>
        </div>
      </section>

      {/* ===================================================================
          7. FAQ
      =================================================================== */}
      <section className="syo-faq" data-cms-section="faqs-superyacht-ops">
        <div className="syo-faq__inner">
          <Reveal>
            <div className="syo-section-header">
              <span className="syo-pre-text">Common Questions</span>
              <h2 className="syo-section-h2">
                <span style={{ color: '#1a1a1a' }}>Frequently</span>{' '}
                <span style={{ color: '#4a4a4a' }}>Asked</span>
              </h2>
            </div>
          </Reveal>

          <div className="syo-faq__list">
            {(showAllFaqs ? faqs : faqs.slice(0, 6)).map((faq, i) => (
              <Reveal key={faq.id} delay={i * 0.05}>
                <div
                  className={`syo-faq__item${openFaq === i ? ' syo-faq__item--open' : ''}`}
                  onClick={() => setOpenFaq(openFaq === i ? null : i)}
                  role="button"
                  tabIndex={0}
                  onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') setOpenFaq(openFaq === i ? null : i); }}
                  aria-expanded={openFaq === i}
                >
                  <span className="syo-faq__number">{String(i + 1).padStart(2, '0')}</span>
                  <div className="syo-faq__content">
                    <h4 className="syo-faq__question">
                      {faq.question}
                      <span className="syo-faq__toggle">{openFaq === i ? '−' : '+'}</span>
                    </h4>
                    <AnimatePresence>
                      {openFaq === i && (
                        <motion.div
                          className="syo-faq__answer"
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: 'auto', opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
                          style={{ overflow: 'hidden' }}
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
            <button className="syo-faq__load-more" onClick={() => setShowAllFaqs(true)}>Load More</button>
          )}
        </div>
      </section>

      {/* ===================================================================
          8. CTA
      =================================================================== */}
      <section className="syo-cta">
        <div className="syo-cta__inner">
          <Reveal>
            <span className="syo-pre-text syo-pre-text--light">Ready to Discuss Your Operation?</span>
            <h2 className="syo-cta__heading">Talk to the Team</h2>
            <p className="syo-cta__body">
              Whether you're planning a new programme or looking to improve an existing one, our
              operations team is ready to help. Reach out for a confidential conversation.
            </p>
            <Link
              to="/contact?subject=superyacht-ops"
              className="syo-btn syo-btn--white"
            >
              Contact Operations Team
            </Link>
          </Reveal>
        </div>
      </section>

      {/* ===================================================================
          FOOTER
      =================================================================== */}
      <FooterMinimal />

      {/* ===================================================================
          STYLES
      =================================================================== */}
      <style>{`

        /* ================================================================
           BASE
        ================================================================ */
        .syo {
          font-family: 'Space Grotesk', -apple-system, sans-serif;
          background: #faf9f6;
          color: #1a1a1a;
          overflow-x: hidden;
        }

        /* Pre-text */
        .syo-pre-text {
          display: block;
          font-size: 0.7rem;
          text-transform: uppercase;
          letter-spacing: 0.25em;
          color: #999;
          margin-bottom: 1rem;
          font-family: 'Share Tech Mono', monospace;
        }

        .syo-pre-text--light {
          color: rgba(255, 255, 255, 0.45);
        }

        /* Section headers */
        .syo-section-header {
          text-align: center;
          max-width: 700px;
          margin: 0 auto 3.5rem;
        }

        .syo-section-h2 {
          font-size: clamp(2rem, 4vw, 3rem);
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: -0.01em;
          line-height: 1.1;
          margin: 0.5rem 0 0;
          color: #1a1a1a;
        }

        .syo-section-h2--light {
          color: #ffffff;
        }

        /* Buttons */
        .syo-btn {
          display: inline-block;
          padding: 1rem 2.25rem;
          font-family: 'Space Grotesk', -apple-system, sans-serif;
          font-size: 0.75rem;
          font-weight: 500;
          text-transform: uppercase;
          letter-spacing: 0.1em;
          text-decoration: none;
          cursor: pointer;
          border: none;
          transition: background 0.25s ease, color 0.25s ease, opacity 0.2s ease;
          border-radius: 3px;
        }

        .syo-btn--primary {
          background: #1a1a1a;
          color: #ffffff;
        }

        .syo-btn--primary:hover {
          background: #333;
        }

        .syo-btn--primary:disabled {
          opacity: 0.55;
          cursor: not-allowed;
        }

        .syo-btn--white {
          background: #ffffff;
          color: #1a1a1a;
        }

        .syo-btn--white:hover {
          background: #f0efec;
        }

        /* ================================================================
           1. HERO
        ================================================================ */
        .syo-hero {
          position: relative;
          min-height: 100vh;
          display: flex;
          align-items: center;
          overflow: hidden;
        }

        .syo-hero__bg {
          position: absolute;
          inset: 0;
          background-size: cover;
          background-position: center;
          background-repeat: no-repeat;
          transform-origin: center;
          will-change: transform;
        }

        .syo-hero__overlay {
          position: absolute;
          inset: 0;
          background: rgba(0, 0, 0, 0.65);
          z-index: 1;
        }

        .syo-hero__content {
          position: relative;
          z-index: 2;
          width: 100%;
          max-width: 1200px;
          margin: 0 auto;
          padding: 8rem 4rem 5rem;
          will-change: transform, opacity;
        }

        .syo-hero__label {
          display: block;
          font-family: 'Share Tech Mono', monospace;
          font-size: 0.7rem;
          letter-spacing: 0.25em;
          text-transform: uppercase;
          color: rgba(255, 255, 255, 0.5);
          margin-bottom: 1.5rem;
        }

        .syo-hero__headline {
          display: flex;
          flex-direction: column;
          line-height: 1;
          margin-bottom: 1.5rem;
        }

        .syo-hero__word {
          font-family: 'Space Grotesk', sans-serif;
          font-weight: 700;
          font-size: clamp(3rem, 8vw, 5.5rem);
          letter-spacing: -0.02em;
          line-height: 1;
          display: block;
        }

        .syo-hero__word--1 {
          color: #ffffff;
        }

        .syo-hero__word--2 {
          color: rgba(255, 255, 255, 0.45);
        }

        .syo-hero__divider {
          width: 60px;
          height: 1px;
          background: rgba(255, 255, 255, 0.35);
          margin-bottom: 1.75rem;
          transform-origin: left;
        }

        .syo-hero__badge {
          display: inline-flex;
          align-items: center;
          gap: 1.25rem;
          border: 1px solid rgba(255, 255, 255, 0.2);
          padding: 0.75rem 1.25rem;
          border-radius: 4px;
          margin-bottom: 2rem;
          background: rgba(255, 255, 255, 0.05);
          backdrop-filter: blur(8px);
        }

        .syo-hero__badge-item {
          display: flex;
          flex-direction: column;
          gap: 0.1rem;
        }

        .syo-hero__badge-strong {
          font-family: 'Share Tech Mono', monospace;
          font-size: 0.75rem;
          color: #ffffff;
          text-transform: uppercase;
          letter-spacing: 0.1em;
        }

        .syo-hero__badge-weak {
          font-size: 0.7rem;
          color: rgba(255, 255, 255, 0.45);
          letter-spacing: 0.05em;
        }

        .syo-hero__badge-divider {
          width: 1px;
          height: 32px;
          background: rgba(255, 255, 255, 0.2);
        }

        .syo-hero__sub {
          max-width: 560px;
          font-size: 1rem;
          line-height: 1.7;
          color: rgba(255, 255, 255, 0.65);
          margin: 0;
        }

        /* ================================================================
           2. INTRO
        ================================================================ */
        .syo-intro {
          background: #faf9f6;
          padding: 6rem 4rem;
        }

        .syo-intro__inner {
          max-width: 1200px;
          margin: 0 auto;
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 5rem;
          align-items: center;
        }

        .syo-intro__heading {
          font-size: clamp(1.6rem, 3vw, 2.25rem);
          font-weight: 700;
          color: #1a1a1a;
          margin: 0 0 1.5rem;
          line-height: 1.2;
        }

        .syo-intro__body {
          font-size: 1rem;
          line-height: 1.75;
          color: #555;
          margin: 0 0 1.25rem;
        }

        .syo-intro__stats {
          display: flex;
          align-items: stretch;
          gap: 0;
          margin-top: 2.5rem;
          border-top: 1px solid #e8e6e2;
          padding-top: 2rem;
        }

        .syo-intro__stat {
          flex: 1;
          display: flex;
          flex-direction: column;
          gap: 0.2rem;
          padding: 0 1.5rem;
        }

        .syo-intro__stat:first-child {
          padding-left: 0;
        }

        .syo-intro__stat-num {
          font-family: 'Share Tech Mono', monospace;
          font-size: 2rem;
          color: #1a1a1a;
          line-height: 1;
        }

        .syo-intro__stat-label {
          font-size: 0.8rem;
          font-weight: 600;
          color: #1a1a1a;
          text-transform: uppercase;
          letter-spacing: 0.05em;
        }

        .syo-intro__stat-sub {
          font-size: 0.75rem;
          color: #999;
        }

        .syo-intro__stat-divider {
          width: 1px;
          background: #e8e6e2;
          align-self: stretch;
          flex-shrink: 0;
        }

        .syo-intro__image-wrap {
          position: relative;
        }

        .syo-intro__image {
          width: 100%;
          height: 480px;
          object-fit: cover;
          border-radius: 6px;
          display: block;
        }

        .syo-intro__caption {
          position: absolute;
          bottom: 1rem;
          left: 1rem;
          background: rgba(26, 26, 26, 0.75);
          color: rgba(255, 255, 255, 0.85);
          font-family: 'Share Tech Mono', monospace;
          font-size: 0.6rem;
          letter-spacing: 0.15em;
          text-transform: uppercase;
          padding: 0.45rem 0.85rem;
          border-radius: 3px;
          backdrop-filter: blur(6px);
        }

        /* ================================================================
           3. SERVICES GRID
        ================================================================ */
        .syo-services {
          background: #faf9f6;
          padding: 6rem 4rem;
          border-top: 1px solid #e8e6e2;
        }

        .syo-services__inner {
          max-width: 1200px;
          margin: 0 auto;
        }

        .syo-services__grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 1.25rem;
        }

        .syo-services__card {
          background: #ffffff;
          border: 1px solid #e8e6e2;
          border-radius: 8px;
          padding: 1.75rem;
          transition: border-color 0.2s ease, box-shadow 0.2s ease;
        }

        .syo-services__card:hover {
          border-color: #c8c6c2;
          box-shadow: 0 4px 20px rgba(0, 0, 0, 0.06);
        }

        .syo-services__card-num {
          display: block;
          font-family: 'Share Tech Mono', monospace;
          font-size: 0.6rem;
          color: #ccc;
          letter-spacing: 0.1em;
          margin-bottom: 0.75rem;
        }

        .syo-services__card-title {
          font-size: 1rem;
          font-weight: 700;
          color: #1a1a1a;
          margin: 0 0 0.75rem;
          line-height: 1.3;
        }

        .syo-services__card-desc {
          font-size: 0.9rem;
          color: #666;
          line-height: 1.65;
          margin: 0;
        }

        /* ================================================================
           4. REGIONS
        ================================================================ */
        .syo-regions {
          background: #1a1a1a;
          padding: 6rem 4rem;
        }

        .syo-regions__inner {
          max-width: 1200px;
          margin: 0 auto;
        }

        .syo-regions__intro {
          color: rgba(255, 255, 255, 0.6);
          font-size: 1rem;
          line-height: 1.7;
          margin: 1rem 0 0;
          max-width: 640px;
          margin-left: auto;
          margin-right: auto;
        }

        .syo-regions__cards {
          display: flex;
          gap: 1rem;
          margin-top: 3rem;
          overflow-x: auto;
          -webkit-overflow-scrolling: touch;
          scrollbar-width: none;
          padding-bottom: 0.5rem;
        }

        .syo-regions__cards::-webkit-scrollbar {
          display: none;
        }

        .syo-regions__card {
          flex: 1;
          min-width: 200px;
          background: rgba(255, 255, 255, 0.05);
          border: 1px solid rgba(255, 255, 255, 0.1);
          border-radius: 8px;
          padding: 1.75rem;
          transition: background 0.2s ease, border-color 0.2s ease;
        }

        .syo-regions__card:hover {
          background: rgba(255, 255, 255, 0.08);
          border-color: rgba(255, 255, 255, 0.18);
        }

        .syo-regions__card-num {
          display: block;
          font-family: 'Share Tech Mono', monospace;
          font-size: 0.6rem;
          color: rgba(255, 255, 255, 0.3);
          letter-spacing: 0.1em;
          margin-bottom: 0.75rem;
        }

        .syo-regions__card-name {
          font-size: 1.1rem;
          font-weight: 700;
          color: #ffffff;
          margin: 0 0 0.75rem;
          line-height: 1.2;
        }

        .syo-regions__card-detail {
          font-size: 0.85rem;
          color: rgba(255, 255, 255, 0.55);
          line-height: 1.6;
          margin: 0;
          font-style: italic;
        }

        /* ================================================================
           5. TRUST
        ================================================================ */
        .syo-trust {
          background: #1a1a1a;
          padding: 6rem 4rem;
          border-top: 1px solid rgba(255, 255, 255, 0.07);
        }

        .syo-trust__inner {
          max-width: 1200px;
          margin: 0 auto;
        }

        .syo-trust__grid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 0 3rem;
          margin-top: 0.5rem;
        }

        .syo-trust__block {
          border-top: 1px solid rgba(255, 255, 255, 0.1);
          padding: 1.5rem 0;
        }

        .syo-trust__block-title {
          font-size: 1rem;
          font-weight: 700;
          color: #ffffff;
          margin: 0 0 0.5rem;
        }

        .syo-trust__block-desc {
          font-size: 0.9rem;
          color: rgba(255, 255, 255, 0.6);
          margin: 0;
          line-height: 1.6;
        }

        .syo-trust__quote-wrap {
          margin-top: 3.5rem;
          max-width: 700px;
        }

        .syo-trust__quote {
          font-size: 1.1rem;
          color: rgba(255, 255, 255, 0.6);
          font-style: italic;
          line-height: 1.75;
          margin: 0 0 0.75rem;
        }

        .syo-trust__attribution {
          font-family: 'Share Tech Mono', monospace;
          font-size: 0.6rem;
          color: rgba(255, 255, 255, 0.3);
          letter-spacing: 0.12em;
          text-transform: uppercase;
        }

        /* ================================================================
           6. ENQUIRY FORM
        ================================================================ */
        .syo-enquiry {
          background: #ffffff;
          padding: 6rem 4rem;
        }

        .syo-enquiry__inner {
          max-width: 1200px;
          margin: 0 auto;
          display: grid;
          grid-template-columns: 1fr 1.3fr;
          gap: 5rem;
          align-items: start;
        }

        .syo-enquiry__heading {
          font-size: clamp(1.6rem, 3vw, 2.25rem);
          font-weight: 700;
          color: #1a1a1a;
          margin: 0 0 1.25rem;
          line-height: 1.2;
        }

        .syo-enquiry__desc {
          font-size: 1rem;
          line-height: 1.75;
          color: #666;
          margin: 0;
        }

        /* Form fields */
        .syo-field {
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
          margin-bottom: 1.25rem;
        }

        .syo-field label {
          font-size: 0.8rem;
          font-weight: 600;
          color: #333;
          text-transform: uppercase;
          letter-spacing: 0.05em;
        }

        .syo-field-req {
          color: #999;
          font-weight: 400;
        }

        .syo-field input,
        .syo-field textarea,
        .syo-field select {
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

        .syo-field input:focus,
        .syo-field textarea:focus,
        .syo-field select:focus {
          border-color: #1a1a1a;
        }

        .syo-enquiry__row {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 1rem;
        }

        .syo-enquiry__error {
          font-size: 0.85rem;
          color: #c0392b;
          margin-bottom: 1rem;
        }

        .syo-enquiry__success {
          display: flex;
          align-items: center;
          gap: 1rem;
          padding: 2rem;
          border: 1.5px solid #e8e6e2;
          border-radius: 8px;
          background: #faf9f6;
        }

        .syo-enquiry__success-icon {
          flex-shrink: 0;
          opacity: 0.6;
        }

        .syo-enquiry__success-text {
          font-size: 1rem;
          color: #1a1a1a;
          margin: 0;
          line-height: 1.5;
        }

        /* ================================================================
           7. FAQ
        ================================================================ */
        .syo-faq {
          background: #faf9f6;
          padding: 6rem 4rem;
        }

        .syo-faq__inner {
          max-width: 1200px;
          margin: 0 auto;
        }

        .syo-faq__list {
          max-width: 800px;
          margin: 0 auto;
        }

        .syo-faq__load-more { margin-top: 1.5rem; display: block; width: 100%; padding: 0.9rem 1.5rem; background: transparent; border: 1px solid #1a1a1a; color: #1a1a1a; font-family: 'Share Tech Mono', monospace; font-size: 0.72rem; letter-spacing: 0.12em; text-transform: uppercase; cursor: pointer; transition: background 0.2s ease, color 0.2s ease; }
        .syo-faq__load-more:hover { background: #1a1a1a; color: #fff; }

        .syo-faq__item {
          display: flex;
          gap: 1.5rem;
          align-items: flex-start;
          padding: 1.5rem 0;
          border-bottom: 1px solid #e8e6e2;
          cursor: pointer;
          transition: background 0.15s ease;
        }

        .syo-faq__item:first-child {
          border-top: 1px solid #e8e6e2;
        }

        .syo-faq__number {
          font-family: 'Share Tech Mono', monospace;
          font-size: 0.65rem;
          color: #bbb;
          letter-spacing: 0.1em;
          margin-top: 0.2rem;
          flex-shrink: 0;
          width: 1.8rem;
        }

        .syo-faq__content {
          flex: 1;
        }

        .syo-faq__question {
          font-size: 1rem;
          font-weight: 600;
          color: #1a1a1a;
          margin: 0;
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          gap: 1rem;
          line-height: 1.4;
        }

        .syo-faq__toggle {
          font-size: 1.2rem;
          font-weight: 300;
          color: #999;
          flex-shrink: 0;
          margin-top: -0.1rem;
          transition: color 0.2s ease;
        }

        .syo-faq__item--open .syo-faq__toggle {
          color: #1a1a1a;
        }

        .syo-faq__answer {
          overflow: hidden;
        }

        .syo-faq__answer p {
          font-size: 0.95rem;
          color: #666;
          line-height: 1.7;
          margin: 0.75rem 0 0;
          padding-bottom: 0.25rem;
        }

        /* ================================================================
           8. CTA
        ================================================================ */
        .syo-cta {
          background: #1a1a1a;
          padding: 6rem 4rem;
        }

        .syo-cta__inner {
          max-width: 1200px;
          margin: 0 auto;
          max-width: 640px;
        }

        .syo-cta__heading {
          font-size: clamp(2rem, 4vw, 3rem);
          font-weight: 700;
          text-transform: uppercase;
          color: #ffffff;
          margin: 0.5rem 0 1.25rem;
          line-height: 1.1;
        }

        .syo-cta__body {
          font-size: 1rem;
          line-height: 1.75;
          color: rgba(255, 255, 255, 0.6);
          margin: 0 0 2rem;
        }

        /* ================================================================
           RESPONSIVE — 1024px
        ================================================================ */
        @media (max-width: 1024px) {
          .syo-intro {
            padding: 5rem 3rem;
          }

          .syo-intro__inner {
            grid-template-columns: 1fr;
            gap: 3rem;
          }

          .syo-intro__right {
            order: -1;
          }

          .syo-intro__image {
            height: 360px;
          }

          .syo-services {
            padding: 5rem 3rem;
          }

          .syo-services__grid {
            grid-template-columns: repeat(2, 1fr);
          }

          .syo-regions {
            padding: 5rem 3rem;
          }

          .syo-trust {
            padding: 5rem 3rem;
          }

          .syo-trust__grid {
            grid-template-columns: 1fr 1fr;
            gap: 0 2rem;
          }

          .syo-enquiry {
            padding: 5rem 3rem;
          }

          .syo-enquiry__inner {
            grid-template-columns: 1fr;
            gap: 3rem;
          }

          .syo-faq {
            padding: 5rem 3rem;
          }

          .syo-cta {
            padding: 5rem 3rem;
          }
        }

        /* ================================================================
           RESPONSIVE — 768px
        ================================================================ */
        @media (max-width: 768px) {
          .syo-hero__content {
            padding: 7rem 1.5rem 4rem;
          }

          .syo-hero__word {
            font-size: clamp(2.25rem, 12vw, 3.5rem);
          }

          .syo-hero__badge {
            flex-wrap: wrap;
            gap: 0.75rem;
          }

          .syo-intro {
            padding: 4rem 1.5rem;
          }

          .syo-intro__stats {
            flex-direction: column;
            gap: 1.25rem;
          }

          .syo-intro__stat {
            padding: 0;
          }

          .syo-intro__stat-divider {
            display: none;
          }

          .syo-services {
            padding: 4rem 1.5rem;
          }

          .syo-services__grid {
            grid-template-columns: 1fr;
          }

          .syo-regions {
            padding: 4rem 1.5rem;
          }

          .syo-regions__cards {
            gap: 0.85rem;
          }

          .syo-regions__card {
            min-width: 220px;
          }

          .syo-trust {
            padding: 4rem 1.5rem;
          }

          .syo-trust__grid {
            grid-template-columns: 1fr;
          }

          .syo-enquiry {
            padding: 4rem 1.5rem;
          }

          .syo-enquiry__row {
            grid-template-columns: 1fr;
          }

          .syo-faq {
            padding: 4rem 1.5rem;
          }

          .syo-cta {
            padding: 4rem 1.5rem;
          }

          .syo-section-header {
            margin-bottom: 2.5rem;
          }
        }

        /* ================================================================
           RESPONSIVE — 480px
        ================================================================ */
        @media (max-width: 480px) {
          .syo-hero__sub {
            font-size: 0.9rem;
          }

          .syo-intro__image {
            height: 260px;
          }

          .syo-services__card {
            padding: 1.25rem;
          }

          .syo-regions__card {
            min-width: 200px;
            padding: 1.25rem;
          }

          .syo-trust__quote {
            font-size: 1rem;
          }

          .syo-faq__item {
            gap: 1rem;
          }
        }

      `}</style>
    </div>
  );
}

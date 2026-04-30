/**
 * AIRCRAFT CONSULTING PAGE
 *
 * Helicopter consulting page. Robinson specialists.
 * Buying, owning & operating, valuations, and independent expert work.
 *
 * Brand: Luxury Minimal Aviation
 * Typography: Space Grotesk + Share Tech Mono
 * Theme: Light editorial with dark sections for authority
 * CSS prefix: ac-
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
import { INITIAL_FORM_STATE, SERVICE_TYPES, getServiceFields, clearConditionalFields } from './aircraftConsultingForm';

// ─────────────────────────────────────────────────────────────────────────────
// HEADER COMPONENT
// ─────────────────────────────────────────────────────────────────────────────

function AircraftConsultingHeader() {
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

// ─────────────────────────────────────────────────────────────────────────────
// MAIN COMPONENT
// ─────────────────────────────────────────────────────────────────────────────

function AircraftConsulting() {
  const heroRef = useRef(null);
  const [openFaq, setOpenFaq] = useState(null);
  const [showAllFaqs, setShowAllFaqs] = useState(false);
  const [activeService, setActiveService] = useState(null);
  const pageImages = usePageImages('aircraft-consulting');
  useCmsHighlight();
  const { scrollYProgress } = useScroll({ target: heroRef, offset: ['start start', 'end start'] });
  useEffect(() => { window.scrollTo(0, 0); }, []);
  const heroOpacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);
  const heroScale = useTransform(scrollYProgress, [0, 0.5], [1, 0.95]);
  const heroY = useTransform(scrollYProgress, [0, 0.5], [0, 100]);
  const [formData, setFormData] = useState(INITIAL_FORM_STATE);
  const [formStatus, setFormStatus] = useState('idle');
  const { faqs: rawFaqs } = useFaqs('aircraft-consulting', { visibleOnly: true });
  const fallbackFaqs = [
    { id: 'f1', question: 'Do you inspect aircraft other than Robinson types?', answer: 'Our core expertise is the Robinson range — R22, R44, R66, and R88. We can arrange inspections on other types through our network of type-specialist engineers, but the Robinson range is where our direct expertise sits.' },
    { id: 'f2', question: 'How much does a pre-purchase inspection cost?', answer: "Fees depend on the type and location of the aircraft. Contact us with details and we'll provide a fixed fee upfront — no surprises." },
    { id: 'f3', question: 'Can you negotiate on my behalf?', answer: "Yes — as part of our Acquisition Services offering. We're effective negotiators because we understand the market, the aircraft, and realistic rectification costs." },
    { id: 'f4', question: 'What if the inspection finds problems?', answer: 'We document every finding with photographs and reference the applicable maintenance data. For defects, we estimate rectification costs so you can factor them into your offer or walk away with a clear understanding of why.' },
    { id: 'f5', question: 'How quickly can you conduct an inspection?', answer: "Typically within 3–5 working days of the request, subject to the aircraft's location. For time-sensitive transactions, contact us and we'll do our best." },
    { id: 'f6', question: 'Do you provide ongoing advisory retainers?', answer: 'Yes — for owners who want regular access to our knowledge. Contact us to discuss a structure that suits your needs.' },
  ];
  const faqs = rawFaqs.length > 0 ? rawFaqs : fallbackFaqs;

  async function handleFormSubmit(e) {
    e.preventDefault();
    if (!formData.name.trim() || !formData.email.trim()) { setFormStatus('error'); return; }
    setFormStatus('submitting');
    try {
      const res = await fetch('/api/leads', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ ...formData, subject: 'Aircraft Consulting Enquiry', source: 'aircraft-consulting-page' }) });
      if (!res.ok) throw new Error();
      setFormStatus('success');
      setFormData(INITIAL_FORM_STATE);
    } catch { setFormStatus('error'); }
  }

  function handleServiceTypeChange(e) {
    const nextServiceType = e.target.value;
    setFormData(p => ({
      ...clearConditionalFields(p),
      serviceType: nextServiceType,
    }));
  }

  function handleServiceCtaClick(enquirySlug) {
    setFormData(p => ({
      ...clearConditionalFields(p),
      serviceType: enquirySlug,
    }));
    requestAnimationFrame(() => {
      document.getElementById('ac-enquiry')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
  }

  // ── Data Arrays ────────────────────────────────────────────────────────────

  const services = [
    // GROUP: Buying a helicopter
    {
      num: '01',
      group: 'buying',
      title: 'Pre-Purchase Inspection',
      scope: 'Robinson only',
      chip: 'Most common',
      description: "A full airframe, engine, avionics, and logbook inspection of any Robinson helicopter under offer. Factory-authorised verdict in writing — buy, renegotiate, or walk — within 48 hours.",
      includes: [
        'Physical airframe inspection',
        'Engine and systems check',
        'Full logbook audit',
        'Written report with photography',
        'Rectification cost estimates',
        'Price-position guidance',
      ],
      enquiry: 'pre-purchase-inspection',
    },
    {
      num: '02',
      group: 'buying',
      title: 'Acquisition Advisory',
      scope: 'All helicopters',
      description: "We find the right aircraft, negotiate the deal, manage independent surveys, and run the paperwork through to delivery. A hands-off route to ownership for buyers who'd rather hire it done.",
      includes: [
        'Aircraft sourcing in the UK and abroad',
        'Seller and broker negotiation',
        'Independent survey management',
        'Import/export documentation',
        'Delivery coordination and handover',
        'First-year operating support',
      ],
      enquiry: 'acquisition-advisory',
    },
    {
      num: '03',
      group: 'buying',
      title: 'Valuation & Appraisal',
      scope: 'All helicopters · Robinson-deep',
      description: "An independent written value opinion for purchase, finance, insurance, tax, lease return, divorce, or estate purposes. Methodology you can hand to a banker, lender, lawyer, or insurer.",
      includes: [
        'Inspection-based or desk-based valuation',
        'Robinson type-specific market context',
        'Methodology and comparables',
        'Litigation-ready report formats',
        'Lender / insurer-acceptable templates',
        'Single-aircraft or fleet portfolio',
      ],
      enquiry: 'valuation',
    },
    // GROUP: Owning & operating
    {
      num: '04',
      group: 'owning',
      title: 'Aircraft Management',
      scope: 'All helicopters',
      chip: 'Retainer',
      description: "An ongoing relationship for owners who'd rather not run the aircraft themselves. We oversee maintenance, engineer relationships, scheduling, and keep the file in order so the aircraft stays serviceable and saleable.",
      includes: [
        'Maintenance scheduling oversight',
        'Engineer and operator coordination',
        'Records and documentation upkeep',
        'Hangarage, insurance, and currency tracking',
        'Quarterly cost reviews',
        'Single point of contact across the lifecycle',
      ],
      enquiry: 'aircraft-management',
    },
    {
      num: '05',
      group: 'owning',
      title: 'Operating Cost & TCO',
      scope: 'All helicopters',
      description: "A defensible total cost of ownership model for a specific aircraft, fleet, or use case. Numbers built from real maintenance bills and live insurance market — not OEM brochures.",
      includes: [
        'Type-specific fixed and variable costs',
        'One, five, and ten-year projections',
        'Maintenance reserves modelling',
        'Hours-flown sensitivity and break-even',
        'Financing scenario comparisons',
        'Cross-type comparison',
      ],
      enquiry: 'tco-modelling',
    },
    {
      num: '06',
      group: 'owning',
      title: 'Insurance Advisory',
      scope: 'All helicopters',
      description: "Independent review of hull and liability cover, broker introductions, and policy comparisons. We read the policy with the aircraft in mind — what's actually flown, where, and by whom — not just what's quoted.",
      includes: [
        'Cover review against operating reality',
        'Broker selection and introduction',
        'Policy and exclusion comparison',
        'Claims advocacy and support',
        'Renewal-cycle reviews',
        'Lessor and financier requirement alignment',
      ],
      enquiry: 'insurance-advisory',
    },
    {
      num: '07',
      group: 'owning',
      title: 'Import / Export & Register Transfer',
      scope: 'All helicopters',
      description: "Cross-border transactions and register transfers handled end-to-end — UK CAA, FAA, IoM, Guernsey — with the documentation, customs, and airworthiness pieces sequenced correctly.",
      includes: [
        'Import and export documentation',
        'Customs and duty handling',
        'De-registration and re-registration',
        'Airworthiness review handover',
        'Transit and ferry coordination',
        'VAT and tax sequencing in partnership',
      ],
      enquiry: 'import-export',
    },
    // GROUP: Independent expert work
    {
      num: '08',
      group: 'expert',
      title: 'Expert Witness & Litigation Support',
      scope: 'All helicopters · Robinson-deep',
      description: "Independent expert opinion for legal, insurance, and dispute matters. Written reports, expert determination, and court-acceptable testimony — drawn from 35 years on the hangar floor.",
      includes: [
        'Pre-action expert opinion',
        'Formal CPR Part 35 expert reports',
        'Insurance loss adjusting support',
        'Maintenance dispute resolution',
        'Sale dispute and warranty claims',
        'Single joint expert appointments',
      ],
      enquiry: 'expert-witness',
    },
  ];

  const SERVICE_GROUPS = [
    { id: 'buying',  label: 'Buying a helicopter' },
    { id: 'owning',  label: 'Owning & operating' },
    { id: 'expert',  label: 'Independent expert work' },
  ];

  const processSteps = [
    {
      num: '01',
      title: 'Brief',
      description: "Tell us what you need. We confirm scope and whether we're the right firm.",
    },
    {
      num: '02',
      title: 'Scope & fee',
      description: "Written, upfront. What's in, what's out, what it costs. Fixed where possible; capped where not.",
    },
    {
      num: '03',
      title: 'Engagement',
      description: 'The work itself: an inspection, a market search, a model build, a documentation sequence, a written opinion.',
    },
    {
      num: '04',
      title: 'Deliverable',
      description: 'In writing. Report, valuation, TCO model, policy recommendation, expert opinion — with a clear position you can act on.',
    },
    {
      num: '05',
      title: 'Continued',
      description: 'Open line afterwards. Available to talk through findings, support negotiations, take the next call. For retainer clients, this is the relationship.',
    },
  ];

  const credentials = [
    {
      title: 'Robinson Authorised Service Centre',
      desc: "Factory-authorised on every Robinson type — the qualification that backs the inspection, the valuation, the expert opinion, and every Robinson recommendation HQ writes.",
    },
    {
      title: 'CAA Part 145 Approved',
      desc: 'Approved Maintenance Organisation. Airworthiness standards in operational detail, not theory.',
    },
    {
      title: '35 Years of Robinson Experience',
      desc: 'More Robinson hours, more Robinson logbooks, and more Robinson problems solved than almost any organisation in Europe.',
    },
    {
      title: '500+ Transactions Supported',
      desc: 'Acquisitions, ownership transitions, valuations, and disputes — a track record across the helicopter ownership lifecycle, not just at the point of sale.',
    },
  ];

  const independencePoints = [
    {
      num: '01',
      title: "What you can't see, we can",
      desc: "Every aircraft we look at — to buy, to manage, to value, or to defend — is read through a working hangar floor and 500+ transactions of memory. Photos, seller demos, broker write-ups, and OEM brochures don't catch what we catch. For Robinsons specifically, factory authorisation means we know the type at the level the people who built it do.",
    },
    {
      num: '02',
      title: 'What good actually looks like',
      desc: "Thirty-five years across the Robinson fleet means we know what 500-hour wear looks like, what 1,500-hour wear looks like, what's normal for a 2010 R44, and what's drifting. That context is what a first-time buyer or single-aircraft owner doesn't have — and what makes the difference between an opinion and an answer.",
    },
    {
      num: '03',
      title: 'A clear position, not a hedged one',
      desc: "Every engagement ends with something concrete — a number, a verdict, or a position you can act on. We get hired to make calls, not to write neutral surveys you have to interpret yourself. That's true of a pre-purchase report, a TCO model, a cover review, or an expert opinion in a dispute.",
    },
  ];

  // ── Render ─────────────────────────────────────────────────────────────────

  const visibleConditionalFields = getServiceFields(formData.serviceType);
  const isVisible = (name) => visibleConditionalFields.includes(name);

  return (
    <div className="ac">
      <AircraftConsultingHeader />

      {/* ====================================================================
          HERO — Photo background with parallax fade
      ==================================================================== */}
      <section ref={heroRef} className="ac-hero" data-cms-section="ac-hero">
        <motion.div
          className="ac-hero__bg"
          initial={{ scale: 1.08, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 1.6, ease: [0.16, 1, 0.3, 1] }}
        >
          <img
            src={pageImages['ac-hero']?.[0]?.url || '/assets/images/facility/hq-0354.jpg'}
            alt="HQ Aviation aircraft consulting"
          />
        </motion.div>
        <div className="ac-hero__overlay" />

        <motion.div
          className="ac-hero__content"
          style={{ opacity: heroOpacity, scale: heroScale, y: heroY }}
        >
          <div className="ac-hero__left">
            <motion.span
              className="ac-hero__label"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              For buyers, owners, and disputes
            </motion.span>

            <div className="ac-hero__headline">
              <motion.span
                className="ac-hero__word ac-hero__word--1"
                initial={{ opacity: 0, y: 40 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.4, ease: [0.16, 1, 0.3, 1] }}
              >
                HELICOPTER
              </motion.span>
              <motion.span
                className="ac-hero__word ac-hero__word--2"
                initial={{ opacity: 0, y: 40 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.6, ease: [0.16, 1, 0.3, 1] }}
              >
                CONSULTING
              </motion.span>
            </div>

            <motion.div
              className="ac-hero__divider-line"
              initial={{ scaleX: 0 }}
              animate={{ scaleX: 1 }}
              transition={{ duration: 0.8, delay: 0.8, ease: [0.16, 1, 0.3, 1] }}
            />

            {/* Badge */}
            <motion.div
              className="ac-hero__badge"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1, duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            >
              <div className="ac-hero__badge-content">
                <div className="ac-hero__badge-stat">
                  <span className="ac-hero__badge-num">Independent</span>
                  <span className="ac-hero__badge-desc">Advice</span>
                </div>
                <div className="ac-hero__badge-divider" />
                <div className="ac-hero__badge-stat">
                  <span className="ac-hero__badge-num">35+&nbsp;Years</span>
                  <span className="ac-hero__badge-desc">Experience</span>
                </div>
              </div>
            </motion.div>

            <motion.p
              className="ac-hero__sub"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.2 }}
            >
              Robinson specialists. Independent advice across the helicopter ownership lifecycle —
              from short-list to settlement, and through the disputes and decisions in between.
              Grounded in 35 years and 500+ transactions.
            </motion.p>
          </div>
        </motion.div>
      </section>

      {/* ====================================================================
          INTRO — 2-col editorial
      ==================================================================== */}
      <section className="ac-intro" data-cms-section="ac-intro">
        <div className="ac-intro__container">
          <div className="ac-intro__left">
            <Reveal>
              <span className="ac-pre-text">Expertise Before Commitment</span>
              <h2 className="ac-intro__heading">Independent.&nbsp;Thorough.&nbsp;Honest.</h2>
              <p className="ac-intro__body">
                Buyers shortlisting their first helicopter. Owners running one or several. Lawyers,
                insurers, and lenders who need an independent expert on a matter where opinions
                cost real money. HQ Aviation consults across the helicopter ownership lifecycle —
                with Robinson factory authorisation backing the work where type-specific depth
                changes the answer.
              </p>
              <p className="ac-intro__body">
                The same hangar floor, logbook library, and maintenance experience that informs
                every Robinson service-centre engagement is what backs every consulting opinion
                we write — for any helicopter, not just the ones we are authorised to certify.
                Brought to bear on your aircraft, your budget, your policy, your plan, or your
                dispute.
              </p>
            </Reveal>
            <Reveal delay={0.2}>
              <div className="ac-intro__stats">
                <div className="ac-intro__stat">
                  <span className="ac-intro__stat-num">500+</span>
                  <span className="ac-intro__stat-label">Aircraft Assessed</span>
                </div>
                <div className="ac-intro__stat-divider" />
                <div className="ac-intro__stat">
                  <span className="ac-intro__stat-num">35+</span>
                  <span className="ac-intro__stat-label">Years</span>
                </div>
                <div className="ac-intro__stat-divider" />
                <div className="ac-intro__stat">
                  <span className="ac-intro__stat-num">Factory</span>
                  <span className="ac-intro__stat-label">Authorised</span>
                </div>
              </div>
            </Reveal>
          </div>

          <Reveal delay={0.15} direction="left">
            <div className="ac-intro__right">
              <div className="ac-intro__image-wrap">
                <img
                  src={pageImages['ac-intro']?.[0]?.url || '/assets/images/facility/hq-0153.jpg'}
                  alt="HQ Aviation facility — Factory Authorised Service Centre"
                />
                <div className="ac-intro__caption">Factory Authorised Service Centre</div>
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ====================================================================
          SERVICES — 3 groups, 8 cards total
      ==================================================================== */}
      <section className="ac-services">
        <div className="ac-services__container">
          <Reveal>
            <div className="ac-section-header">
              <span className="ac-pre-text">What We Offer</span>
              <h2 className="ac-section-header__h2">Consulting Services</h2>
            </div>
          </Reveal>

          {SERVICE_GROUPS.map((group) => {
            const groupServices = services.filter(s => s.group === group.id);
            return (
              <div key={group.id} className="ac-services__group">
                <Reveal>
                  <h3 className="ac-services__group-title">{group.label}</h3>
                </Reveal>
                <div className="ac-services__grid">
                  {groupServices.map((service, i) => (
                    <Reveal key={service.num} delay={i * 0.1}>
                      <div className="ac-service-card">
                        <div className="ac-service-card__top">
                          <span className="ac-service-card__tag">{service.scope}</span>
                          <span className="ac-service-card__num">{service.num}</span>
                        </div>
                        {service.chip && (
                          <span className="ac-service-card__chip">{service.chip}</span>
                        )}
                        <h3 className="ac-service-card__title">{service.title}</h3>
                        <p className="ac-service-card__desc">{service.description}</p>
                        <p className="ac-service-card__includes-label">What's included</p>
                        <ul className="ac-service-card__includes">
                          {service.includes.map((item) => (
                            <li key={item} className="ac-service-card__include-item">
                              <span className="ac-service-card__check">✓</span>
                              {item}
                            </li>
                          ))}
                        </ul>
                        <button
                          type="button"
                          className="ac-service-card__cta"
                          onClick={() => handleServiceCtaClick(service.enquiry)}
                        >
                          Enquire about this →
                        </button>
                      </div>
                    </Reveal>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* ====================================================================
          WHY INDEPENDENT — Dark authority section
      ==================================================================== */}
      <section className="ac-why">
        <div className="ac-why__container">
          <Reveal>
            <div className="ac-section-header ac-section-header--light">
              <span className="ac-pre-text ac-pre-text--light">Why It Matters</span>
              <h2 className="ac-section-header__h2 ac-section-header__h2--light">
                The Independent Advantage
              </h2>
              <p className="ac-why__intro-body">
                Thirty-five years of Robinson experience and 500+ transactions sit behind every
                engagement on the menu — buying, owning, valuing, defending. The job is the same
                each time: an accurate, independent read on the aircraft, the cost, the policy,
                or the dispute, written in a way you can act on.
              </p>
            </div>
          </Reveal>

          <div className="ac-why__grid">
            {independencePoints.map((point, i) => (
              <Reveal key={point.num} delay={i * 0.1}>
                <div className="ac-why__card">
                  <span className="ac-why__card-num">{point.num}</span>
                  <h4 className="ac-why__card-title">{point.title}</h4>
                  <p className="ac-why__card-desc">{point.desc}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ====================================================================
          PROCESS — Numbered steps, light background
      ==================================================================== */}
      <section className="ac-process">
        <div className="ac-process__container">
          <Reveal>
            <div className="ac-section-header">
              <span className="ac-pre-text">How It Works</span>
              <h2 className="ac-section-header__h2">The Process</h2>
            </div>
          </Reveal>

          <div className="ac-process__steps">
            {processSteps.map((step, i) => (
              <Reveal key={step.num} delay={i * 0.08}>
                <div className="ac-process__step">
                  <div className="ac-process__step-num">{step.num}</div>
                  <div className="ac-process__step-content">
                    <div className="ac-process__step-header">
                      <h4 className="ac-process__step-title">{step.title}</h4>
                    </div>
                    <p className="ac-process__step-desc">{step.description}</p>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ====================================================================
          CREDENTIALS — Horizontal authority bars
      ==================================================================== */}
      <section className="ac-credentials">
        <div className="ac-credentials__container">
          <Reveal>
            <div className="ac-section-header">
              <span className="ac-pre-text">Our Credentials</span>
              <h2 className="ac-section-header__h2">Why Trust HQ</h2>
            </div>
          </Reveal>

          <div className="ac-credentials__list">
            {credentials.map((cred, i) => (
              <Reveal key={cred.title} delay={i * 0.08}>
                <div className="ac-credential-bar">
                  <h4 className="ac-credential-bar__title">{cred.title}</h4>
                  <p className="ac-credential-bar__desc">{cred.desc}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ====================================================================
          ENQUIRY FORM — 2-col layout
      ==================================================================== */}
      <section className="ac-enquiry" id="ac-enquiry">
        <div className="ac-enquiry__container">
          <div className="ac-enquiry__left">
            <Reveal>
              <span className="ac-pre-text">Get in Touch</span>
              <h2 className="ac-enquiry__heading">Request Consulting</h2>
              <p className="ac-enquiry__desc">
                Tell us about the aircraft you're assessing or the situation you need advice on.
                We'll come back with a clear proposal and fixed fee.
              </p>
            </Reveal>
          </div>

          <div className="ac-enquiry__right">
            {formStatus === 'success' ? (
              <motion.div
                className="ac-enquiry__success"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
              >
                <span className="ac-enquiry__success-icon" aria-hidden="true">✓</span>
                <h3>Enquiry Sent</h3>
                <p>We'll be in touch within 24 hours with a proposal and fixed fee.</p>
                <button
                  type="button"
                  className="ac-btn ac-btn--outline"
                  onClick={() => setFormStatus('idle')}
                >
                  Send Another
                </button>
              </motion.div>
            ) : (
              <Reveal delay={0.1}>
                <form className="ac-enquiry__form" onSubmit={handleFormSubmit} noValidate>
                  <div className="ac-enquiry__row">
                    <div className="ac-field">
                      <label htmlFor="ac-name">Name <span aria-hidden="true">*</span></label>
                      <input
                        id="ac-name"
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={(e) => setFormData(p => ({ ...p, name: e.target.value }))}
                        required
                        placeholder="Your full name"
                      />
                    </div>
                    <div className="ac-field">
                      <label htmlFor="ac-email">Email <span aria-hidden="true">*</span></label>
                      <input
                        id="ac-email"
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={(e) => setFormData(p => ({ ...p, email: e.target.value }))}
                        required
                        placeholder="your@email.com"
                      />
                    </div>
                  </div>

                  <div className="ac-enquiry__row">
                    <div className="ac-field">
                      <label htmlFor="ac-phone">Phone</label>
                      <input
                        id="ac-phone"
                        type="tel"
                        name="phone"
                        value={formData.phone}
                        onChange={(e) => setFormData(p => ({ ...p, phone: e.target.value }))}
                        placeholder="+44 7700 000000"
                      />
                    </div>
                    {isVisible('registration') && (
                      <div className="ac-field">
                        <label htmlFor="ac-registration">Aircraft Registration</label>
                        <input
                          id="ac-registration"
                          type="text"
                          name="registration"
                          value={formData.registration}
                          onChange={(e) => setFormData(p => ({ ...p, registration: e.target.value }))}
                          placeholder="e.g. G-ABCD"
                        />
                      </div>
                    )}
                  </div>

                  <div className="ac-field">
                    <label htmlFor="ac-service-type">Service Type</label>
                    <select
                      id="ac-service-type"
                      name="serviceType"
                      value={formData.serviceType}
                      onChange={handleServiceTypeChange}
                    >
                      <option value="">Select a service...</option>
                      {SERVICE_TYPES.map(s => (
                        <option key={s.slug} value={s.slug}>{s.label}</option>
                      ))}
                      <option value="other">Something else</option>
                    </select>
                  </div>

                  {formData.serviceType && (
                    <>
                      {isVisible('askingPrice') && (
                        <div className="ac-enquiry__row">
                          <div className="ac-field">
                            <label htmlFor="ac-asking-price">Asking Price</label>
                            <input
                              id="ac-asking-price"
                              type="text"
                              name="askingPrice"
                              value={formData.askingPrice}
                              onChange={(e) => setFormData(p => ({ ...p, askingPrice: e.target.value }))}
                              placeholder="e.g. £450,000"
                            />
                          </div>
                          {isVisible('targetInspectionDate') && (
                            <div className="ac-field">
                              <label htmlFor="ac-target-date">Target Inspection Date</label>
                              <input
                                id="ac-target-date"
                                type="text"
                                name="targetInspectionDate"
                                value={formData.targetInspectionDate}
                                onChange={(e) => setFormData(p => ({ ...p, targetInspectionDate: e.target.value }))}
                                placeholder="e.g. within 2 weeks"
                              />
                            </div>
                          )}
                        </div>
                      )}

                      {isVisible('budgetRange') && (
                        <div className="ac-enquiry__row">
                          <div className="ac-field">
                            <label htmlFor="ac-budget">Budget Range</label>
                            <input
                              id="ac-budget"
                              type="text"
                              name="budgetRange"
                              value={formData.budgetRange}
                              onChange={(e) => setFormData(p => ({ ...p, budgetRange: e.target.value }))}
                              placeholder="e.g. £300k–£500k"
                            />
                          </div>
                          <div className="ac-field">
                            <label htmlFor="ac-timeline">Timeline</label>
                            <input
                              id="ac-timeline"
                              type="text"
                              name="timeline"
                              value={formData.timeline}
                              onChange={(e) => setFormData(p => ({ ...p, timeline: e.target.value }))}
                              placeholder="e.g. ready to buy in 3 months"
                            />
                          </div>
                        </div>
                      )}
                      {isVisible('intendedUse') && (
                        <div className="ac-field">
                          <label htmlFor="ac-intended-use">Intended Use</label>
                          <input
                            id="ac-intended-use"
                            type="text"
                            name="intendedUse"
                            value={formData.intendedUse}
                            onChange={(e) => setFormData(p => ({ ...p, intendedUse: e.target.value }))}
                            placeholder="Private, training, charter, utility…"
                          />
                        </div>
                      )}

                      {isVisible('valuationPurpose') && (
                        <div className="ac-field">
                          <label htmlFor="ac-valuation-purpose">Valuation Purpose</label>
                          <select
                            id="ac-valuation-purpose"
                            name="valuationPurpose"
                            value={formData.valuationPurpose}
                            onChange={(e) => setFormData(p => ({ ...p, valuationPurpose: e.target.value }))}
                          >
                            <option value="">Select a purpose…</option>
                            <option value="purchase">Purchase</option>
                            <option value="finance">Finance / lender</option>
                            <option value="insurance">Insurance</option>
                            <option value="tax">Tax</option>
                            <option value="legal">Legal / dispute</option>
                            <option value="other">Other</option>
                          </select>
                        </div>
                      )}

                      {isVisible('aircraftType') && (
                        <div className="ac-enquiry__row">
                          <div className="ac-field">
                            <label htmlFor="ac-aircraft-type">Aircraft Type</label>
                            <input
                              id="ac-aircraft-type"
                              type="text"
                              name="aircraftType"
                              value={formData.aircraftType}
                              onChange={(e) => setFormData(p => ({ ...p, aircraftType: e.target.value }))}
                              placeholder="e.g. R44 Raven II, AS350"
                            />
                          </div>
                          {isVisible('ownershipStatus') && (
                            <div className="ac-field">
                              <label htmlFor="ac-ownership">Ownership Status</label>
                              <select
                                id="ac-ownership"
                                name="ownershipStatus"
                                value={formData.ownershipStatus}
                                onChange={(e) => setFormData(p => ({ ...p, ownershipStatus: e.target.value }))}
                              >
                                <option value="">Select…</option>
                                <option value="own">Owned outright</option>
                                <option value="spv">Held in SPV / company</option>
                                <option value="lease">Leased</option>
                                <option value="prospective">Prospective</option>
                              </select>
                            </div>
                          )}
                          {isVisible('expectedAnnualHours') && (
                            <div className="ac-field">
                              <label htmlFor="ac-annual-hours">Expected Annual Hours</label>
                              <input
                                id="ac-annual-hours"
                                type="text"
                                name="expectedAnnualHours"
                                value={formData.expectedAnnualHours}
                                onChange={(e) => setFormData(p => ({ ...p, expectedAnnualHours: e.target.value }))}
                                placeholder="e.g. 120"
                              />
                            </div>
                          )}
                          {isVisible('currentRenewalDate') && (
                            <div className="ac-field">
                              <label htmlFor="ac-renewal-date">Current Renewal Date</label>
                              <input
                                id="ac-renewal-date"
                                type="text"
                                name="currentRenewalDate"
                                value={formData.currentRenewalDate}
                                onChange={(e) => setFormData(p => ({ ...p, currentRenewalDate: e.target.value }))}
                                placeholder="e.g. 2026-09-01"
                              />
                            </div>
                          )}
                        </div>
                      )}

                      {isVisible('fromRegistry') && (
                        <div className="ac-enquiry__row">
                          <div className="ac-field">
                            <label htmlFor="ac-from-registry">From Registry</label>
                            <input
                              id="ac-from-registry"
                              type="text"
                              name="fromRegistry"
                              value={formData.fromRegistry}
                              onChange={(e) => setFormData(p => ({ ...p, fromRegistry: e.target.value }))}
                              placeholder="e.g. G (UK CAA), N (FAA)"
                            />
                          </div>
                          {isVisible('toRegistry') && (
                            <div className="ac-field">
                              <label htmlFor="ac-to-registry">To Registry</label>
                              <input
                                id="ac-to-registry"
                                type="text"
                                name="toRegistry"
                                value={formData.toRegistry}
                                onChange={(e) => setFormData(p => ({ ...p, toRegistry: e.target.value }))}
                                placeholder="e.g. M (IoM), 2 (Guernsey)"
                              />
                            </div>
                          )}
                        </div>
                      )}

                      {isVisible('matterType') && (
                        <div className="ac-enquiry__row">
                          <div className="ac-field">
                            <label htmlFor="ac-matter-type">Matter Type</label>
                            <select
                              id="ac-matter-type"
                              name="matterType"
                              value={formData.matterType}
                              onChange={(e) => setFormData(p => ({ ...p, matterType: e.target.value }))}
                            >
                              <option value="">Select…</option>
                              <option value="purchase">Purchase / sale dispute</option>
                              <option value="maintenance">Maintenance dispute</option>
                              <option value="insurance">Insurance / loss</option>
                              <option value="accident">Accident / incident</option>
                              <option value="other">Other</option>
                            </select>
                          </div>
                          <div className="ac-field">
                            <label htmlFor="ac-party">Instructing Party</label>
                            <select
                              id="ac-party"
                              name="party"
                              value={formData.party}
                              onChange={(e) => setFormData(p => ({ ...p, party: e.target.value }))}
                            >
                              <option value="">Select…</option>
                              <option value="claimant">Claimant</option>
                              <option value="defendant">Defendant</option>
                              <option value="single-joint">Single joint expert</option>
                              <option value="insurer">Insurer</option>
                              <option value="other">Other</option>
                            </select>
                          </div>
                        </div>
                      )}
                    </>
                  )}

                  <div className="ac-field">
                    <label htmlFor="ac-message">Message</label>
                    <textarea
                      id="ac-message"
                      name="message"
                      value={formData.message}
                      onChange={(e) => setFormData(p => ({ ...p, message: e.target.value }))}
                      rows={5}
                      placeholder="Tell us about the aircraft, your situation, and what you need from us..."
                    />
                  </div>

                  {formStatus === 'error' && (
                    <p className="ac-enquiry__error" role="alert">
                      Please complete the required fields (name and email) and try again.
                    </p>
                  )}

                  <button
                    type="submit"
                    className="ac-btn ac-btn--primary ac-btn--full"
                    disabled={formStatus === 'submitting'}
                  >
                    {formStatus === 'submitting' ? 'Sending...' : 'Send Enquiry'}
                  </button>
                </form>
              </Reveal>
            )}
          </div>
        </div>
      </section>

      {/* ====================================================================
          FAQ — Accordion
      ==================================================================== */}
      <section className="ac-faq" data-cms-section="faqs-aircraft-consulting">
        <div className="ac-faq__container">
          <Reveal>
            <div className="ac-section-header">
              <span className="ac-pre-text">Common Questions</span>
              <h2 className="ac-section-header__h2">Frequently Asked</h2>
            </div>
          </Reveal>

          <div className="ac-faq__list">
            {(showAllFaqs ? faqs : faqs.slice(0, 6)).map((faq, i) => (
              <Reveal key={faq.id} delay={i * 0.05}>
                <div
                  className={`ac-faq__item${openFaq === i ? ' ac-faq__item--open' : ''}`}
                  onClick={() => setOpenFaq(openFaq === i ? null : i)}
                  role="button"
                  tabIndex={0}
                  onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); setOpenFaq(openFaq === i ? null : i); }}}
                  aria-expanded={openFaq === i}
                >
                  <span className="ac-faq__number">{String(i + 1).padStart(2, '0')}</span>
                  <div className="ac-faq__content">
                    <h4>
                      {faq.question}
                      <span className="ac-faq__toggle" aria-hidden="true">{openFaq === i ? '−' : '+'}</span>
                    </h4>
                    <AnimatePresence>
                      {openFaq === i && (
                        <motion.div
                          className="ac-faq__answer"
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
            <button className="ac-faq__load-more" onClick={() => setShowAllFaqs(true)}>Load More</button>
          )}
        </div>
      </section>

      {/* ====================================================================
          CTA — Dark close
      ==================================================================== */}
      <section className="ac-cta">
        <div className="ac-cta__inner">
          <Reveal>
            <span className="ac-pre-text ac-pre-text--light">No matter what you're working on</span>
            <h2 className="ac-cta__heading">Tell us what you're working on.</h2>
            <p className="ac-cta__body">
              Whether it's a shortlist, a renewal, a model in spreadsheet form, a paper trail, or
              a dispute on the desk — an hour with us is the cheapest read you'll get. No
              obligation, no sales pitch, just an honest opinion you can act on.
            </p>
            <div className="ac-cta__buttons">
              <Link to="/fleet" className="ac-cta__link">
                View Our Fleet
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
                  <path d="M6 3L11 8L6 13" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </Link>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ====================================================================
          FOOTER
      ==================================================================== */}
      <FooterMinimal />

      {/* ====================================================================
          STYLES
      ==================================================================== */}
      <style>{`
        /* ============================================================
           BASE
        ============================================================ */
        .ac {
          font-family: 'Space Grotesk', -apple-system, sans-serif;
          background: #faf9f6;
          color: #1a1a1a;
          overflow-x: hidden;
        }

        /* Pre-text label */
        .ac-pre-text {
          display: block;
          font-family: 'Share Tech Mono', monospace;
          font-size: 0.7rem;
          text-transform: uppercase;
          letter-spacing: 0.25em;
          color: #999;
          margin-bottom: 1rem;
        }
        .ac-pre-text--light {
          color: rgba(255, 255, 255, 0.5);
        }

        /* Section header */
        .ac-section-header {
          text-align: center;
          max-width: 700px;
          margin: 0 auto 3.5rem;
        }
        .ac-section-header__h2 {
          font-size: clamp(1.8rem, 3.5vw, 2.75rem);
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: -0.02em;
          color: #1a1a1a;
          margin: 0.25rem 0 0;
          line-height: 1.1;
        }
        .ac-section-header__h2--light {
          color: #ffffff;
        }
        .ac-section-header--light .ac-pre-text {
          color: rgba(255, 255, 255, 0.5);
        }

        /* Buttons */
        .ac-btn {
          display: inline-block;
          padding: 1rem 2rem;
          font-family: 'Space Grotesk', sans-serif;
          font-size: 0.75rem;
          font-weight: 600;
          text-decoration: none;
          text-transform: uppercase;
          letter-spacing: 0.1em;
          border: none;
          cursor: pointer;
          transition: all 0.25s ease;
          text-align: center;
        }
        .ac-btn--primary {
          background: #1a1a1a;
          color: #ffffff;
        }
        .ac-btn--primary:hover {
          background: #333333;
        }
        .ac-btn--primary:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }
        .ac-btn--white {
          background: #ffffff;
          color: #1a1a1a;
        }
        .ac-btn--white:hover {
          background: #f0f0ee;
        }
        .ac-btn--outline {
          background: transparent;
          color: #1a1a1a;
          border: 1.5px solid #1a1a1a;
        }
        .ac-btn--outline:hover {
          background: #1a1a1a;
          color: #ffffff;
        }
        .ac-btn--full {
          width: 100%;
          display: block;
        }

        /* ============================================================
           HERO
        ============================================================ */
        .ac-hero {
          position: relative;
          min-height: 100vh;
          display: flex;
          align-items: flex-end;
          overflow: hidden;
          background: #0a0a0a;
        }
        .ac-hero__bg {
          position: absolute;
          inset: 0;
          z-index: 0;
        }
        .ac-hero__bg img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          object-position: center;
          display: block;
        }
        .ac-hero__overlay {
          position: absolute;
          inset: 0;
          z-index: 1;
          background: linear-gradient(
            to bottom,
            rgba(0, 0, 0, 0.25) 0%,
            rgba(0, 0, 0, 0.5) 50%,
            rgba(0, 0, 0, 0.75) 100%
          );
        }
        .ac-hero__content {
          position: relative;
          z-index: 2;
          width: 100%;
          padding: 3rem 4rem 5rem;
        }
        .ac-hero__left {
          max-width: 600px;
        }
        .ac-hero__label {
          font-family: 'Share Tech Mono', monospace;
          font-size: 0.7rem;
          font-weight: 400;
          letter-spacing: 0.2em;
          text-transform: uppercase;
          color: rgba(255, 255, 255, 0.55);
          display: block;
          margin-bottom: 1.5rem;
        }
        .ac-hero__headline {
          display: flex;
          flex-direction: column;
          line-height: 1;
          margin-bottom: 1.75rem;
        }
        .ac-hero__word {
          font-family: 'Space Grotesk', sans-serif;
          font-weight: 700;
          font-size: clamp(3.2rem, 8vw, 5.5rem);
          letter-spacing: -0.02em;
          text-transform: uppercase;
          line-height: 0.95;
        }
        .ac-hero__word--1 {
          color: #ffffff;
        }
        .ac-hero__word--2 {
          color: rgba(255, 255, 255, 0.55);
        }
        .ac-hero__divider-line {
          height: 1px;
          background: rgba(255, 255, 255, 0.25);
          width: 240px;
          margin-bottom: 1.5rem;
          transform-origin: left center;
        }
        .ac-hero__badge {
          display: inline-flex;
          background: rgba(255, 255, 255, 0.08);
          border: 1px solid rgba(255, 255, 255, 0.15);
          backdrop-filter: blur(8px);
          -webkit-backdrop-filter: blur(8px);
          border-radius: 8px;
          padding: 0.85rem 1.25rem;
          margin-bottom: 1.5rem;
        }
        .ac-hero__badge-content {
          display: flex;
          align-items: center;
          gap: 1.25rem;
        }
        .ac-hero__badge-stat {
          display: flex;
          flex-direction: column;
          gap: 0.2rem;
        }
        .ac-hero__badge-num {
          font-family: 'Share Tech Mono', monospace;
          font-size: 0.85rem;
          color: #ffffff;
          letter-spacing: 0.05em;
        }
        .ac-hero__badge-desc {
          font-size: 0.7rem;
          color: rgba(255, 255, 255, 0.5);
          text-transform: uppercase;
          letter-spacing: 0.1em;
        }
        .ac-hero__badge-divider {
          width: 1px;
          height: 30px;
          background: rgba(255, 255, 255, 0.2);
        }
        .ac-hero__sub {
          font-size: 1rem;
          line-height: 1.7;
          color: rgba(255, 255, 255, 0.7);
          max-width: 520px;
          margin: 0;
        }

        /* ============================================================
           INTRO
        ============================================================ */
        .ac-intro {
          background: #faf9f6;
          padding: 6rem 4rem;
        }
        .ac-intro__container {
          max-width: 1200px;
          margin: 0 auto;
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 5rem;
          align-items: start;
        }
        .ac-intro__left {
          padding-top: 0.5rem;
        }
        .ac-intro__heading {
          font-size: clamp(1.6rem, 3vw, 2.4rem);
          font-weight: 700;
          color: #1a1a1a;
          margin: 0 0 1.5rem;
          line-height: 1.15;
          letter-spacing: -0.02em;
        }
        .ac-intro__body {
          font-size: 1rem;
          line-height: 1.75;
          color: #555555;
          margin: 0 0 1.1rem;
        }
        .ac-intro__stats {
          display: flex;
          align-items: center;
          gap: 1.5rem;
          margin-top: 2.5rem;
          padding-top: 2rem;
          border-top: 1px solid #e8e6e2;
        }
        .ac-intro__stat {
          display: flex;
          flex-direction: column;
          gap: 0.3rem;
        }
        .ac-intro__stat-num {
          font-family: 'Share Tech Mono', monospace;
          font-size: 1.4rem;
          color: #1a1a1a;
          line-height: 1;
          letter-spacing: -0.01em;
        }
        .ac-intro__stat-label {
          font-family: 'Share Tech Mono', monospace;
          font-size: 0.65rem;
          color: #999;
          text-transform: uppercase;
          letter-spacing: 0.15em;
        }
        .ac-intro__stat-divider {
          width: 1px;
          height: 36px;
          background: #e0ddd8;
          flex-shrink: 0;
        }
        .ac-intro__image-wrap {
          position: relative;
          border-radius: 4px;
          overflow: hidden;
          aspect-ratio: 4 / 5;
        }
        .ac-intro__image-wrap img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          object-position: center;
          display: block;
        }
        .ac-intro__caption {
          position: absolute;
          bottom: 0;
          left: 0;
          right: 0;
          padding: 0.75rem 1rem;
          background: rgba(0, 0, 0, 0.55);
          font-family: 'Share Tech Mono', monospace;
          font-size: 0.65rem;
          color: rgba(255, 255, 255, 0.75);
          text-transform: uppercase;
          letter-spacing: 0.12em;
        }

        /* ============================================================
           SERVICES
        ============================================================ */
        .ac-services {
          background: #faf9f6;
          padding: 6rem 4rem;
          border-top: 1px solid #eeecea;
        }
        .ac-services__container {
          max-width: 1200px;
          margin: 0 auto;
        }
        .ac-services__group {
          margin-top: 3.5rem;
        }
        .ac-services__group:first-of-type {
          margin-top: 2.5rem;
        }
        .ac-services__group-title {
          font-family: 'Space Grotesk', sans-serif;
          font-size: 1.25rem;
          font-weight: 600;
          letter-spacing: 0.02em;
          color: #1a1a1a;
          margin: 0 0 1.5rem;
          padding-bottom: 0.75rem;
          border-bottom: 1px solid #eeecea;
        }
        .ac-service-card__chip {
          display: inline-block;
          font-family: 'Share Tech Mono', monospace;
          font-size: 0.6rem;
          letter-spacing: 0.15em;
          text-transform: uppercase;
          color: #6b6b6b;
          background: #f1efeb;
          padding: 0.25rem 0.6rem;
          border-radius: 999px;
          margin-bottom: 0.75rem;
        }
        .ac-service-card__cta {
          margin-top: 1.5rem;
          font-family: 'Space Grotesk', sans-serif;
          font-size: 0.85rem;
          font-weight: 600;
          letter-spacing: 0.02em;
          color: #1a1a1a;
          background: transparent;
          border: 0;
          padding: 0;
          cursor: pointer;
          transition: opacity 0.2s ease;
          align-self: flex-start;
        }
        .ac-service-card__cta:hover {
          opacity: 0.7;
        }
        .ac-services__grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 1.5rem;
        }
        .ac-service-card {
          background: #ffffff;
          border: 1px solid #e8e6e2;
          border-radius: 12px;
          padding: 2.5rem;
          display: flex;
          flex-direction: column;
          transition: box-shadow 0.25s ease, border-color 0.25s ease;
        }
        .ac-service-card:hover {
          border-color: #d4d1cb;
          box-shadow: 0 8px 32px rgba(0, 0, 0, 0.07);
        }
        .ac-service-card__top {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 1.25rem;
        }
        .ac-service-card__tag {
          display: inline-block;
          font-family: 'Share Tech Mono', monospace;
          font-size: 0.6rem;
          text-transform: uppercase;
          letter-spacing: 0.15em;
          color: #1a1a1a;
          background: #f0eeea;
          border-radius: 20px;
          padding: 0.3rem 0.75rem;
          border: 1px solid #e4e1db;
        }
        .ac-service-card__num {
          font-family: 'Share Tech Mono', monospace;
          font-size: 0.7rem;
          color: #cccccc;
          letter-spacing: 0.05em;
        }
        .ac-service-card__title {
          font-size: 1.15rem;
          font-weight: 700;
          color: #1a1a1a;
          margin: 0 0 0.85rem;
          line-height: 1.3;
        }
        .ac-service-card__desc {
          font-size: 0.9rem;
          line-height: 1.7;
          color: #666666;
          margin: 0 0 1.5rem;
          flex: 0;
        }
        .ac-service-card__includes-label {
          font-family: 'Share Tech Mono', monospace;
          font-size: 0.6rem;
          text-transform: uppercase;
          letter-spacing: 0.18em;
          color: #999999;
          margin: 0 0 0.65rem;
        }
        .ac-service-card__includes {
          list-style: none;
          padding: 0;
          margin: 0 0 2rem;
          flex: 1;
        }
        .ac-service-card__include-item {
          display: flex;
          align-items: flex-start;
          gap: 0.6rem;
          font-size: 0.875rem;
          color: #555555;
          line-height: 1.55;
          padding: 0.3rem 0;
          border-bottom: 1px solid #f5f4f1;
        }
        .ac-service-card__include-item:last-child {
          border-bottom: none;
        }
        .ac-service-card__check {
          color: #1a1a1a;
          font-size: 0.75rem;
          font-weight: 700;
          flex-shrink: 0;
          margin-top: 0.15rem;
        }

        /* ============================================================
           WHY INDEPENDENT (dark)
        ============================================================ */
        .ac-why {
          background: #1a1a1a;
          padding: 6rem 4rem;
        }
        .ac-why__container {
          max-width: 1200px;
          margin: 0 auto;
        }
        .ac-why__intro-body {
          font-size: 1rem;
          line-height: 1.75;
          color: rgba(255, 255, 255, 0.7);
          max-width: 640px;
          margin: 1rem auto 0;
        }
        .ac-why__grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 1.25rem;
          margin-top: 4rem;
        }
        .ac-why__card {
          background: rgba(255, 255, 255, 0.04);
          border: 1px solid rgba(255, 255, 255, 0.08);
          border-radius: 8px;
          padding: 1.75rem;
          transition: background 0.2s ease;
        }
        .ac-why__card:hover {
          background: rgba(255, 255, 255, 0.07);
        }
        .ac-why__card-num {
          display: block;
          font-family: 'Share Tech Mono', monospace;
          font-size: 0.6rem;
          color: rgba(255, 255, 255, 0.3);
          letter-spacing: 0.15em;
          margin-bottom: 0.75rem;
        }
        .ac-why__card-title {
          font-size: 1rem;
          font-weight: 700;
          color: #ffffff;
          margin: 0 0 0.6rem;
          line-height: 1.3;
        }
        .ac-why__card-desc {
          font-size: 0.9rem;
          line-height: 1.65;
          color: rgba(255, 255, 255, 0.55);
          margin: 0;
        }

        /* ============================================================
           PROCESS
        ============================================================ */
        .ac-process {
          background: #faf9f6;
          padding: 6rem 4rem;
          border-top: 1px solid #eeecea;
        }
        .ac-process__container {
          max-width: 860px;
          margin: 0 auto;
        }
        .ac-process__steps {
          display: flex;
          flex-direction: column;
        }
        .ac-process__step {
          display: flex;
          gap: 2.5rem;
          align-items: flex-start;
          padding: 2rem 0;
          border-bottom: 1px solid #e8e6e2;
          border-left: 3px solid transparent;
          padding-left: 1.5rem;
          transition: border-color 0.2s ease;
        }
        .ac-process__step:first-child {
          padding-top: 0;
        }
        .ac-process__step:hover {
          border-left-color: #1a1a1a;
        }
        .ac-process__step-num {
          font-family: 'Share Tech Mono', monospace;
          font-size: 0.6rem;
          color: #cccccc;
          letter-spacing: 0.1em;
          flex-shrink: 0;
          padding-top: 0.25rem;
          min-width: 24px;
        }
        .ac-process__step-content {
          flex: 1;
        }
        .ac-process__step-header {
          display: flex;
          align-items: center;
          gap: 0.85rem;
          margin-bottom: 0.6rem;
          flex-wrap: wrap;
        }
        .ac-process__step-title {
          font-size: 1rem;
          font-weight: 700;
          color: #1a1a1a;
          margin: 0;
          line-height: 1.3;
        }
        .ac-process__step-duration {
          font-family: 'Share Tech Mono', monospace;
          font-size: 0.65rem;
          color: #777777;
          background: #f5f5f2;
          padding: 0.2rem 0.65rem;
          border-radius: 4px;
          letter-spacing: 0.05em;
          border: 1px solid #eeecea;
        }
        .ac-process__step-desc {
          font-size: 0.9rem;
          line-height: 1.65;
          color: #666666;
          margin: 0;
        }

        /* ============================================================
           CREDENTIALS
        ============================================================ */
        .ac-credentials {
          background: #faf9f6;
          padding: 6rem 4rem;
          border-top: 1px solid #eeecea;
        }
        .ac-credentials__container {
          max-width: 1200px;
          margin: 0 auto;
        }
        .ac-credentials__list {
          display: flex;
          flex-direction: column;
          border-top: 1px solid #e8e6e2;
          margin-top: 0.5rem;
        }
        .ac-credential-bar {
          display: flex;
          align-items: baseline;
          gap: 3rem;
          padding: 1.75rem 0;
          border-bottom: 1px solid #e8e6e2;
          transition: background 0.15s ease;
        }
        .ac-credential-bar:hover {
          padding-left: 0.5rem;
        }
        .ac-credential-bar__title {
          font-size: 1rem;
          font-weight: 700;
          color: #1a1a1a;
          margin: 0;
          min-width: 280px;
          flex-shrink: 0;
          line-height: 1.4;
        }
        .ac-credential-bar__desc {
          font-size: 0.95rem;
          line-height: 1.6;
          color: #666666;
          margin: 0;
        }

        /* ============================================================
           ENQUIRY FORM
        ============================================================ */
        .ac-enquiry {
          background: #ffffff;
          padding: 6rem 4rem;
          border-top: 1px solid #eeecea;
        }
        .ac-enquiry__container {
          max-width: 1200px;
          margin: 0 auto;
          display: grid;
          grid-template-columns: 1fr 1.4fr;
          gap: 5rem;
          align-items: start;
        }
        .ac-enquiry__heading {
          font-size: clamp(1.6rem, 3vw, 2.4rem);
          font-weight: 700;
          color: #1a1a1a;
          margin: 0 0 1rem;
          letter-spacing: -0.02em;
          line-height: 1.15;
        }
        .ac-enquiry__desc {
          font-size: 1rem;
          line-height: 1.75;
          color: #666666;
          margin: 0;
        }
        .ac-enquiry__form {
          width: 100%;
        }
        .ac-enquiry__row {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 1rem;
        }
        .ac-enquiry__error {
          font-size: 0.82rem;
          color: #c0392b;
          margin: 0 0 1rem;
        }
        .ac-enquiry__success {
          display: flex;
          flex-direction: column;
          align-items: flex-start;
          gap: 0.75rem;
          padding: 2.5rem;
          background: #faf9f6;
          border: 1px solid #e8e6e2;
          border-radius: 8px;
        }
        .ac-enquiry__success-icon {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 44px;
          height: 44px;
          border-radius: 50%;
          background: #1a1a1a;
          color: #ffffff;
          font-size: 1.1rem;
          font-weight: 700;
        }
        .ac-enquiry__success h3 {
          font-size: 1.2rem;
          font-weight: 700;
          color: #1a1a1a;
          margin: 0;
        }
        .ac-enquiry__success p {
          font-size: 0.95rem;
          line-height: 1.65;
          color: #666666;
          margin: 0;
        }

        /* Form fields */
        .ac-field {
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
          margin-bottom: 1.25rem;
        }
        .ac-field label {
          font-size: 0.8rem;
          font-weight: 600;
          color: #333333;
          text-transform: uppercase;
          letter-spacing: 0.05em;
        }
        .ac-field label span {
          color: #c0392b;
          margin-left: 0.1em;
        }
        .ac-field input,
        .ac-field textarea,
        .ac-field select {
          padding: 0.85rem 1rem;
          border: 1.5px solid #e0e0e0;
          border-radius: 6px;
          font-family: 'Space Grotesk', sans-serif;
          font-size: 0.9rem;
          color: #1a1a1a;
          background: #fafaf8;
          transition: border-color 0.2s ease;
          outline: none;
          width: 100%;
          box-sizing: border-box;
        }
        .ac-field input:focus,
        .ac-field textarea:focus,
        .ac-field select:focus {
          border-color: #1a1a1a;
          background: #ffffff;
        }
        .ac-field textarea {
          resize: vertical;
          min-height: 120px;
          line-height: 1.6;
        }
        .ac-field select {
          appearance: none;
          -webkit-appearance: none;
          background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='16' height='16' viewBox='0 0 24 24' fill='none' stroke='%23666' stroke-width='2'%3E%3Cpolyline points='6 9 12 15 18 9'%3E%3C/polyline%3E%3C/svg%3E");
          background-repeat: no-repeat;
          background-position: right 1rem center;
          background-size: 16px;
          padding-right: 2.5rem;
          cursor: pointer;
        }
        .ac-field input::placeholder,
        .ac-field textarea::placeholder {
          color: #b0b0b0;
        }

        /* ============================================================
           FAQ
        ============================================================ */
        .ac-faq {
          background: #faf9f6;
          padding: 6rem 4rem;
          border-top: 1px solid #eeecea;
        }
        .ac-faq__container {
          max-width: 860px;
          margin: 0 auto;
        }
        .ac-faq__list {
          display: flex;
          flex-direction: column;
          border-top: 1px solid #e8e6e2;
          margin-top: 0.5rem;
        }
        .ac-faq__load-more { margin-top: 1.5rem; display: block; width: 100%; padding: 0.9rem 1.5rem; background: transparent; border: 1px solid #1a1a1a; color: #1a1a1a; font-family: 'Share Tech Mono', monospace; font-size: 0.72rem; letter-spacing: 0.12em; text-transform: uppercase; cursor: pointer; transition: background 0.2s ease, color 0.2s ease; }
        .ac-faq__load-more:hover { background: #1a1a1a; color: #fff; }
        .ac-faq__item {
          display: flex;
          gap: 1.5rem;
          align-items: flex-start;
          padding: 1.5rem 0;
          border-bottom: 1px solid #e8e6e2;
          cursor: pointer;
          transition: background 0.15s ease;
          outline: none;
        }
        .ac-faq__item:focus-visible {
          outline: 2px solid #1a1a1a;
          outline-offset: 2px;
        }
        .ac-faq__number {
          font-family: 'Share Tech Mono', monospace;
          font-size: 0.65rem;
          color: #cccccc;
          letter-spacing: 0.1em;
          flex-shrink: 0;
          padding-top: 0.25rem;
          min-width: 24px;
        }
        .ac-faq__content {
          flex: 1;
        }
        .ac-faq__content h4 {
          font-size: 0.95rem;
          font-weight: 600;
          color: #1a1a1a;
          margin: 0;
          line-height: 1.5;
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          gap: 1rem;
        }
        .ac-faq__toggle {
          font-family: 'Share Tech Mono', monospace;
          font-size: 1.1rem;
          color: #999999;
          flex-shrink: 0;
          line-height: 1;
          user-select: none;
        }
        .ac-faq__item--open .ac-faq__toggle {
          color: #1a1a1a;
        }
        .ac-faq__answer {
          overflow: hidden;
        }
        .ac-faq__answer p {
          font-size: 0.9rem;
          line-height: 1.7;
          color: #666666;
          margin: 0.85rem 0 0;
          padding-bottom: 0.25rem;
        }

        /* ============================================================
           CTA
        ============================================================ */
        .ac-cta {
          background: #1a1a1a;
          padding: 6rem 4rem;
        }
        .ac-cta__inner {
          max-width: 700px;
          margin: 0 auto;
          text-align: center;
        }
        .ac-cta__heading {
          font-size: clamp(1.8rem, 3.5vw, 2.8rem);
          font-weight: 700;
          color: #ffffff;
          text-transform: uppercase;
          letter-spacing: -0.02em;
          margin: 0.5rem 0 1.25rem;
          line-height: 1.1;
        }
        .ac-cta__body {
          font-size: 1rem;
          line-height: 1.75;
          color: rgba(255, 255, 255, 0.65);
          margin: 0 0 2.5rem;
        }
        .ac-cta__buttons {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 2rem;
          flex-wrap: wrap;
        }
        .ac-cta__link {
          display: inline-flex;
          align-items: center;
          gap: 0.45rem;
          font-size: 0.8rem;
          font-weight: 600;
          text-transform: uppercase;
          letter-spacing: 0.1em;
          color: rgba(255, 255, 255, 0.6);
          text-decoration: none;
          transition: color 0.2s ease;
        }
        .ac-cta__link:hover {
          color: #ffffff;
        }
        .ac-cta__link svg {
          transition: transform 0.2s ease;
        }
        .ac-cta__link:hover svg {
          transform: translateX(3px);
        }

        /* ============================================================
           RESPONSIVE — 1024px
        ============================================================ */
        @media (max-width: 1024px) {
          .ac-intro__container {
            grid-template-columns: 1fr;
            gap: 3rem;
          }
          .ac-intro__right {
            max-width: 560px;
          }
          .ac-intro__image-wrap {
            aspect-ratio: 16 / 9;
          }
          .ac-services__grid {
            grid-template-columns: 1fr;
          }
          .ac-why__grid {
            grid-template-columns: 1fr;
          }
          .ac-enquiry__container {
            grid-template-columns: 1fr;
            gap: 3rem;
          }
          .ac-credential-bar {
            gap: 2rem;
          }
          .ac-credential-bar__title {
            min-width: 220px;
          }
        }

        /* ============================================================
           RESPONSIVE — 768px
        ============================================================ */
        @media (max-width: 768px) {
          .ac-hero__content {
            padding: 2rem 1.5rem 4rem;
          }
          .ac-intro {
            padding: 4rem 1.5rem;
          }
          .ac-services {
            padding: 4rem 1.5rem;
          }
          .ac-why {
            padding: 4rem 1.5rem;
          }
          .ac-process {
            padding: 4rem 1.5rem;
          }
          .ac-credentials {
            padding: 4rem 1.5rem;
          }
          .ac-enquiry {
            padding: 4rem 1.5rem;
          }
          .ac-faq {
            padding: 4rem 1.5rem;
          }
          .ac-cta {
            padding: 4rem 1.5rem;
          }
          .ac-service-card {
            padding: 1.75rem;
          }
          .ac-intro__stats {
            gap: 1rem;
          }
          .ac-enquiry__row {
            grid-template-columns: 1fr;
          }
          .ac-process__step {
            gap: 1.5rem;
          }
          .ac-credential-bar {
            flex-direction: column;
            gap: 0.6rem;
          }
          .ac-credential-bar__title {
            min-width: unset;
          }
          .ac-why__grid {
            grid-template-columns: 1fr;
          }
          .ac-cta__buttons {
            flex-direction: column;
            gap: 1.25rem;
          }
        }

        /* ============================================================
           RESPONSIVE — 480px
        ============================================================ */
        @media (max-width: 480px) {
          .ac-hero__word {
            font-size: clamp(2.6rem, 12vw, 3.6rem);
          }
          .ac-hero__badge-content {
            gap: 1rem;
          }
          .ac-hero__badge-num {
            font-size: 0.75rem;
          }
          .ac-intro__stats {
            flex-direction: column;
            align-items: flex-start;
            gap: 1.25rem;
          }
          .ac-intro__stat-divider {
            display: none;
          }
          .ac-section-header__h2 {
            font-size: 1.6rem;
          }
          .ac-services__grid {
            grid-template-columns: 1fr;
          }
          .ac-service-card {
            padding: 1.5rem;
          }
          .ac-process__step {
            padding-left: 0;
            border-left: none;
          }
          .ac-cta__buttons {
            width: 100%;
          }
          .ac-btn--white {
            width: 100%;
            text-align: center;
          }
        }
      `}</style>
    </div>
  );
}

export default AircraftConsulting;

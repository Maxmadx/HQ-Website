/**
 * HQ AVIATION - REBUILDS PAGE
 * ============================
 * Reserve a spot for a fully rebuilt helicopter.
 * Brand Identity: Space Grotesk + gradient headlines + #faf9f6
 */

import React, { useState, useRef, useEffect } from 'react';
import { useFaqs } from '../hooks/useFaqs';
import { Link } from 'react-router-dom';
import { motion, useInView } from 'framer-motion';
import FooterMinimal from '../components/FooterMinimal';

// ============================================
// HEADER (Spotlight animation)
// ============================================

function FinalDraftHeader() {
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
    const handleEscape = (e) => { if (e.key === 'Escape') setMenuOpen(false); };
    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, []);

  const toggleMenu = () => setMenuOpen(!menuOpen);
  const closeMenu = () => setMenuOpen(false);
  const spotlightHeight = 95 + Math.round(verticalProgress * 405);
  const spotlightWidth = 214 + Math.round(horizontalProgress * 1786);

  return (
    <>
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
              <li><Link to="/sales/pre-owned" onClick={closeMenu}>Pre-Owned</Link></li>
              <li><Link to="/sales/rebuilds" onClick={closeMenu}>Rebuilds</Link></li>
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
      <header
        className={`Header Header--top ${scrolled ? 'Header--scrolled' : ''}`}
        style={{ '--spotlight-width': `${spotlightWidth}px`, '--spotlight-height': `${spotlightHeight}px`, top: 0 }}
      >
        <div className="Header-inner Header-inner--top" data-nc-group="top">
          <div data-nc-container="top-left"></div>
          <div data-nc-container="top-center">
            <Link to="/" className="Header-branding" data-nc-element="branding">
              <img src="/assets/images/logos/hq/hq-aviation-logo-black.png" alt="HQ Aviation" className="Header-branding-logo" loading="lazy" decoding="async" />
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

// ============================================
// UTILITY COMPONENTS
// ============================================

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
    <motion.div ref={ref} initial="hidden" animate={isInView ? 'visible' : 'hidden'} variants={variants} transition={{ duration: 0.8, delay, ease: [0.16, 1, 0.3, 1] }}>
      {children}
    </motion.div>
  );
}

// ============================================
// DATA
// ============================================

const rebuildStepsByModel = {
  R22: [
    { label: 'Airframe', before: '/assets/images/rebuilds/r22/airframe-before.jpg', after: '/assets/images/rebuilds/r22/airframe-after.jpg', beforeDesc: 'Corrosion and fatigue across the tubular steel frame after 12,000 hours.', afterDesc: 'Stripped, inspected, repaired and re-protected — ready for another lifetime.' },
    { label: 'Engine', before: '/assets/images/rebuilds/r22/engine-before.jpg', after: '/assets/images/rebuilds/r22/engine-after.jpg', beforeDesc: '2,200 hours on the Lycoming O-360. Worn cam lobes, degraded seals.', afterDesc: 'Zero-time overhaul. Factory-new components throughout, test-run and certified.' },
    { label: 'Avionics', before: '/assets/images/rebuilds/r22/avionics-before.jpg', after: '/assets/images/rebuilds/r22/avionics-after.jpg', beforeDesc: 'Original steam gauges. Faded placards, intermittent radios, no GPS.', afterDesc: 'Modern glass panel. Garmin G5, GPS/COM, ADS-B Out, digital engine monitor.' },
    { label: 'Wiring', before: '/assets/images/rebuilds/r22/wiring-before.jpg', after: '/assets/images/rebuilds/r22/wiring-after.jpg', beforeDesc: 'Brittle insulation, spliced repairs, corroded connectors throughout.', afterDesc: 'Complete rewire. New looms, mil-spec connectors, laser-etched labels.' },
    { label: 'Interior', before: '/assets/images/rebuilds/r22/interior-before.jpg', after: '/assets/images/rebuilds/r22/interior-after.jpg', beforeDesc: 'Worn seat cushions, cracked plastics, sun-bleached trim.', afterDesc: 'New upholstery, replacement plastics, noise-dampening panels.' },
    { label: 'Paint', before: '/assets/images/rebuilds/r22/paint-before.jpg', after: '/assets/images/rebuilds/r22/paint-after.jpg', beforeDesc: 'Oxidised, chipped and faded. Multiple touch-ups visible.', afterDesc: 'Stripped to bare metal and refinished in custom livery. UV-sealed.' },
  ],
  R44: [
    { label: 'Airframe', before: '/assets/images/rebuilds/r44/airframe-before.jpg', after: '/assets/images/rebuilds/r44/airframe-after.jpg', beforeDesc: 'Corrosion, fatigue cracks and fifteen years of wear across the bare airframe.', afterDesc: 'Stripped, inspected, repaired and re-protected — ready for another lifetime.' },
    { label: 'Engine', before: '/assets/images/rebuilds/r44/engine-before.jpg', after: '/assets/images/rebuilds/r44/engine-after.jpg', beforeDesc: '2,200 hours on the IO-540. Worn bearings, degraded seals, metal in the filter.', afterDesc: 'Zero-time overhaul. Factory-new components throughout, test-run and certified.' },
    { label: 'Avionics', before: '/assets/images/rebuilds/r44/avionics-before.jpg', after: '/assets/images/rebuilds/r44/avionics-after.jpg', beforeDesc: 'Original analogue panel. Faded placards, intermittent radios, no GPS.', afterDesc: 'Full glass cockpit. Garmin suite, GPS/NAV/COM, ADS-B, four-axis autopilot.' },
    { label: 'Wiring', before: '/assets/images/rebuilds/r44/wiring-before.jpg', after: '/assets/images/rebuilds/r44/wiring-after.jpg', beforeDesc: 'Brittle insulation, spliced repairs, corroded connectors. An electrician\'s nightmare.', afterDesc: 'Complete rewire. New looms, mil-spec connectors, laser-etched labels throughout.' },
    { label: 'Interior', before: '/assets/images/rebuilds/r44/interior-before.jpg', after: '/assets/images/rebuilds/r44/interior-after.jpg', beforeDesc: 'Cracked leather, worn carpet, sun-bleached trim. Functional but tired.', afterDesc: 'Hand-stitched leather, custom upholstery, noise-dampening panels. Better than new.' },
    { label: 'Paint', before: '/assets/images/rebuilds/r44/paint-before.jpg', after: '/assets/images/rebuilds/r44/paint-after.jpg', beforeDesc: 'Oxidised, chipped and faded. The livery has seen better days.', afterDesc: 'Stripped to bare metal and refinished in custom livery. Mirror finish, UV-sealed.' },
  ],
  R66: [
    { label: 'Airframe', before: '/assets/images/rebuilds/r66/airframe-before.jpg', after: '/assets/images/rebuilds/r66/airframe-after.jpg', beforeDesc: 'Stress fractures and corrosion across the aluminium airframe.', afterDesc: 'Full strip, NDT inspection, repair and re-protection to exceed factory spec.' },
    { label: 'Engine', before: '/assets/images/rebuilds/r66/engine-before.jpg', after: '/assets/images/rebuilds/r66/engine-after.jpg', beforeDesc: 'RR300 turbine at TBO. Hot section wear, compressor erosion, oil leaks.', afterDesc: 'Factory-overhauled RR300. Zero-time, new hot section, test-run and certified.' },
    { label: 'Avionics', before: '/assets/images/rebuilds/r66/avionics-before.jpg', after: '/assets/images/rebuilds/r66/avionics-after.jpg', beforeDesc: 'First-gen panel. Basic GPS, ageing radios, no synthetic vision.', afterDesc: 'Garmin G500H TXi, GTN 750Xi, GFC 600H autopilot, ADS-B In/Out, HTAWS.' },
    { label: 'Wiring', before: '/assets/images/rebuilds/r66/wiring-before.jpg', after: '/assets/images/rebuilds/r66/wiring-after.jpg', beforeDesc: 'Degraded looms, corroded connectors, aftermarket splices throughout.', afterDesc: 'Complete rewire. New looms, mil-spec connectors, laser-etched labels throughout.' },
    { label: 'Interior', before: '/assets/images/rebuilds/r66/interior-before.jpg', after: '/assets/images/rebuilds/r66/interior-after.jpg', beforeDesc: 'Worn leather, faded carpet, scuffed trim. Shows its hours.', afterDesc: 'Premium leather, Alcantara headliner, USB charging, noise-dampening throughout.' },
    { label: 'Paint', before: '/assets/images/rebuilds/r66/paint-before.jpg', after: '/assets/images/rebuilds/r66/paint-after.jpg', beforeDesc: 'Faded metallic finish, stone chips along the belly, oxidised trim.', afterDesc: 'Full respray in custom livery. Metallic or solid, mirror finish, ceramic coated.' },
  ],
};

const rebuildModels = [
  {
    model: 'Robinson R22 Beta II',
    image: '/assets/images/new-aircraft/r22/r22-red-volcano-front-alpha-v3.png',
    description: 'Ideal training platform rebuilt to zero-time specification.',
    rebuildFrom: '£55,000',
    donorEstimate: '£80,000–£120,000',
    specs: ['Lycoming O-360 overhaul', 'New blades available', 'Glass cockpit option', 'Custom paint scheme'],
  },
  {
    model: 'Robinson R44 Raven II',
    image: '/assets/images/new-aircraft/r44/raven-ii-front-alpha.png',
    description: 'The world\'s best-selling helicopter, rebuilt to exceed factory standards.',
    rebuildFrom: '£85,000',
    donorEstimate: '£120,000–£200,000',
    specs: ['IO-540 zero-time engine', 'Full avionics upgrade', 'Leather interior', 'Aux tank option'],
  },
  {
    model: 'Robinson R66 Turbine',
    image: '/assets/images/used-aircraft/r66/r66-turbine-ghkcc.jpg',
    description: 'Turbine power, rebuilt with modern avionics and bespoke specification.',
    rebuildFrom: '£150,000',
    donorEstimate: '£350,000–£550,000',
    specs: ['RR300 turbine overhaul', 'Garmin G500H TXi', 'Premium interior', 'Extended range tank'],
  },
];

const processSteps = [
  { num: '01', title: 'Consultation', desc: 'We discuss your requirements — model, specification, avionics, paint scheme, and timeline.' },
  { num: '02', title: 'Donor Sourcing', desc: 'We source an ideal donor airframe from our network, or you supply your own aircraft.' },
  { num: '03', title: 'Strip & Inspect', desc: 'Complete disassembly. Every component inspected, measured, and documented against factory limits.' },
  { num: '04', title: 'Rebuild', desc: 'Zero-time engine overhaul, new wiring looms, avionics install, interior fit, and custom paintwork.' },
  { num: '05', title: 'Test & Certify', desc: 'Ground runs, flight testing, CAA paperwork, and final sign-off by our approved engineers.' },
  { num: '06', title: 'Handover', desc: 'Your rebuilt helicopter delivered with full documentation, warranty, and ongoing support.' },
];

const customisationOptions = [
  { icon: 'fa-palette', title: 'Paint & Livery', desc: 'Custom colour scheme and livery design. From classic to corporate branding.' },
  { icon: 'fa-microchip', title: 'Avionics Suite', desc: 'Choose from Garmin, Aspen, or hybrid panels. ADS-B, autopilot, HTAWS.' },
  { icon: 'fa-couch', title: 'Interior', desc: 'Leather, fabric, or synthetic. Noise dampening, USB charging, custom trim.' },
  { icon: 'fa-gas-pump', title: 'Fuel & Range', desc: 'Auxiliary tanks, bladder upgrades, long-range ferry configurations.' },
  { icon: 'fa-camera', title: 'Equipment', desc: 'Wire strike kits, cargo hooks, camera mounts, pop-out floats.' },
  { icon: 'fa-shield-alt', title: 'Safety', desc: 'Crash-resistant fuel systems, ELT upgrades, enhanced lighting packages.' },
];


// ============================================
// BEFORE/AFTER COMPONENT
// ============================================

function BeforeAfter() {
  const [activeModel, setActiveModel] = useState('R44');
  const [rebuildStep, setRebuildStep] = useState(0);
  const steps = rebuildStepsByModel[activeModel];

  const handleModelChange = (model) => {
    setActiveModel(model);
    setRebuildStep(0);
  };

  return (
    <div className="rb__beforeafter">
      <span className="rb__beforeafter-label">The Transformation</span>
      <div className="rb__beforeafter-item">
        <div className="rb__beforeafter-before">
          <div className="rb__beforeafter-img">
            <img src={steps[rebuildStep].before} alt={`${steps[rebuildStep].label} — before`} />
          </div>
          <span>BEFORE</span>
          <p>{steps[rebuildStep].beforeDesc}</p>
        </div>
        <div className="rb__beforeafter-arrow">&rarr;</div>
        <div className="rb__beforeafter-after">
          <div className="rb__beforeafter-img">
            <img src={steps[rebuildStep].after} alt={`${steps[rebuildStep].label} — after`} />
          </div>
          <span>AFTER</span>
          <p>{steps[rebuildStep].afterDesc}</p>
        </div>
      </div>

      <div className="rb__beforeafter-controls">
        <div className="rb__beforeafter-models">
          {['R22', 'R44', 'R66'].map(model => (
            <button
              key={model}
              className={`rb__beforeafter-step ${activeModel === model ? 'rb__beforeafter-step--active' : ''}`}
              onClick={() => handleModelChange(model)}
            >
              <span className="rb__beforeafter-step-label">{model}</span>
            </button>
          ))}
        </div>
        <div className="rb__beforeafter-controls-divider" />
        <div className="rb__beforeafter-steps">
          {steps.map((step, i) => (
            <button
              key={i}
              className={`rb__beforeafter-step ${rebuildStep === i ? 'rb__beforeafter-step--active' : ''}`}
              onClick={() => setRebuildStep(i)}
            >
              <span className="rb__beforeafter-step-label">{step.label}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

// ============================================
// FAQ COMPONENT
// ============================================

function FAQ() {
  const [openIndex, setOpenIndex] = useState(null);
  const { faqs } = useFaqs('rebuilds', { visibleOnly: true });

  return (
    <div className="rb__faq-list" data-cms-section="faqs-rebuilds">
      {faqs.map((item, i) => (
        <div key={item.id || i} className={`rb__faq-item ${openIndex === i ? 'rb__faq-item--open' : ''}`} onClick={() => setOpenIndex(openIndex === i ? null : i)}>
          <span className="rb__faq-number">{String(i + 1).padStart(2, '0')}</span>
          <div className="rb__faq-content">
            <h4>
              <span>{item.question}</span>
              <span className="rb__faq-toggle">{openIndex === i ? '−' : '+'}</span>
            </h4>
            <div className="rb__faq-answer" style={{ maxHeight: openIndex === i ? '500px' : '0', overflow: 'hidden', transition: 'max-height 0.3s ease' }}>
              <p>{item.answer}</p>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

// ============================================
// MAIN COMPONENT
// ============================================

function Rebuilds() {
  return (
    <div className="rb">
      <style>{pageStyles}</style>
      <FinalDraftHeader />

      {/* Hero */}
      <section className="rb__hero">
        <div className="rb__hero-inner">
          <div className="rb__hero-image">
            <img src="/assets/images/facility/main-sales-pic.jpg" alt="Helicopter Rebuild" />
          </div>
          <div className="rb__hero-text">
            <div className="rb__grid-lines" />
            <span className="rb__pre-title">Robinson Specialists Since 1990</span>
            <h1 className="rb__headline">
              <span className="rb__hw rb__hw--1">Reserve</span>{' '}
              <span className="rb__hw rb__hw--2">Your</span>{' '}
              <span className="rb__hw rb__hw--3">Rebuild</span>
            </h1>
            <p className="rb__body">Factory-new condition. Full customisation. Zero-time components. Built to your specification at our CAA-approved facility.</p>
          </div>
        </div>
      </section>

      {/* Why Rebuild */}
      <section className="rb__why">
        <div className="rb__container">
          <Reveal>
            <div className="rb__section-label">Why Rebuild</div>
          </Reveal>
          <div className="rb__why-grid">
            <Reveal delay={0.1}>
              <div className="rb__why-card">
                <div className="rb__why-icon"><i className="fas fa-pound-sign"></i></div>
                <h3>Factory-New at Lower Cost</h3>
                <p>A fully rebuilt helicopter delivers new-aircraft condition at a significant saving over factory prices.</p>
              </div>
            </Reveal>
            <Reveal delay={0.2}>
              <div className="rb__why-card">
                <div className="rb__why-icon"><i className="fas fa-sliders-h"></i></div>
                <h3>Full Customisation</h3>
                <p>Choose your avionics, interior, paint scheme, and equipment. Every rebuild is built to your exact specification.</p>
              </div>
            </Reveal>
            <Reveal delay={0.3}>
              <div className="rb__why-card">
                <div className="rb__why-icon"><i className="fas fa-clock"></i></div>
                <h3>Zero-Time Airframe</h3>
                <p>All life-limited components replaced. Fresh overhaul with full component life ahead — and a comprehensive warranty.</p>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* Models */}
      <section className="rb__models">
        <div className="rb__container">
          <Reveal>
            <div className="rb__section-label">Models</div>
          </Reveal>
          <div className="rb__models-grid">
            {rebuildModels.map((m, i) => (
              <Reveal key={i} delay={i * 0.1}>
                <div className="rb__model-card">
                  <div className="rb__model-img">
                    <img src={m.image} alt={m.model} />
                  </div>
                  <div className="rb__model-body">
                    <h3>{m.model}</h3>
                    <div className="rb__model-pricing">
                      <div className="rb__model-price-line">
                        <span>Rebuild from</span>
                        <strong>{m.rebuildFrom}</strong>
                      </div>
                      <div className="rb__model-price-donor">
                        + donor aircraft <span>({m.donorEstimate})</span>
                      </div>
                      <div className="rb__model-price-note">We can source a suitable donor or rebuild your existing aircraft.</div>
                    </div>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
          <Reveal delay={0.1}>
            <BeforeAfter />
          </Reveal>
        </div>
      </section>

      {/* Process + Customise */}
      <section className="rb__process-customise">
        <div className="rb__container">
          <Reveal>
            <div className="rb__section-label">The Process</div>
          </Reveal>
          <div className="rb__process-grid">
            {processSteps.map((step, i) => (
              <Reveal key={i} delay={i * 0.1}>
                <div className="rb__process-step">
                  <span className="rb__process-num">{step.num}</span>
                  <h3>{step.title}</h3>
                  <p>{step.desc}</p>
                </div>
              </Reveal>
            ))}
          </div>
          <Reveal>
            <div className="rb__section-label" style={{ marginTop: '3rem' }}>Customise Your Build</div>
          </Reveal>
          <div className="rb__custom-grid">
            {customisationOptions.map((opt, i) => (
              <Reveal key={i} delay={i * 0.08}>
                <div className="rb__custom-card">
                  <i className={`fas ${opt.icon}`}></i>
                  <h4>{opt.title}</h4>
                  <p>{opt.desc}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* CTA + FAQ side by side */}
      <section className="rb__cta-faq">
        <div className="rb__container">
          <div className="rb__cta-faq-grid">
            <div className="rb__cta-faq-left">
              <Reveal>
                <span className="rb__pre-title" style={{ color: '#999' }}>Ready to Start?</span>
                <h2 className="rb__headline" style={{ fontSize: 'clamp(1.8rem, 4vw, 3rem)' }}>
                  <span className="rb__hw rb__hw--1">Reserve</span>{' '}
                  <span className="rb__hw rb__hw--2">Your</span>{' '}
                  <span className="rb__hw rb__hw--3">Build Slot</span>
                </h2>
                <p className="rb__body">Contact our sales team to discuss your requirements and secure your place in our build schedule.</p>
              </Reveal>
              <Reveal delay={0.2}>
                <div className="rb__cta-actions">
                  <Link to="/contact?subject=rebuild" className="rb__btn rb__btn--primary rb__btn--large">Contact Sales Team</Link>
                  <a href="tel:+441895833838" className="rb__cta-phone">
                    <span>Or call directly</span>
                    <strong>+44 (0) 1895 833 838</strong>
                  </a>
                </div>
              </Reveal>
            </div>
            <div className="rb__cta-faq-divider"></div>
            <div className="rb__cta-faq-right">
              <Reveal>
                <div className="rb__faq-header">
                  <span className="rb__pre-title">FAQ</span>
                  <h2 className="rb__headline" style={{ fontSize: 'clamp(1.5rem, 3vw, 2rem)' }}>
                    <span className="rb__hw rb__hw--1">Common </span>
                    <span className="rb__hw rb__hw--2">Questions</span>
                  </h2>
                </div>
              </Reveal>
              <Reveal delay={0.1}>
                <FAQ />
              </Reveal>
            </div>
          </div>
        </div>
      </section>

      <FooterMinimal />
    </div>
  );
}

export default Rebuilds;

// ============================================
// STYLES
// ============================================

const pageStyles = `
@import url('https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@400;500;600;700&family=Share+Tech+Mono&display=swap');

/* === BASE === */
.rb {
  background: #faf9f6;
  font-family: 'Space Grotesk', -apple-system, sans-serif;
  color: #1a1a1a;
  line-height: 1.6;
  min-height: 100vh;
  position: relative;
  overflow-x: hidden;
}

.rb__container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 2rem;
}

/* === TYPOGRAPHY === */
.rb__pre-title {
  font-family: 'Space Grotesk', sans-serif;
  font-size: 0.75rem;
  letter-spacing: 0.25em;
  text-transform: uppercase;
  color: #888;
  display: block;
  margin-bottom: 1.5rem;
}
.rb__headline {
  font-family: 'Space Grotesk', sans-serif;
  font-size: clamp(2rem, 5vw, 3.5rem);
  font-weight: 700;
  line-height: 1.1;
  text-transform: uppercase;
  margin: 0 0 1.5rem 0;
}
.rb__hw--1 { color: #1a1a1a; }
.rb__hw--2 { color: #4a4a4a; }
.rb__hw--3 { color: #7a7a7a; }
.rb__body {
  font-family: 'Space Grotesk', sans-serif;
  font-size: 1.1rem;
  line-height: 1.8;
  color: #666;
  margin: 0 0 2rem 0;
  max-width: 500px;
}

/* === SECTION LABELS === */
.rb__section-label {
  font-family: 'Space Grotesk', sans-serif;
  font-size: 0.7rem;
  font-weight: 400;
  letter-spacing: 0.2em;
  text-transform: uppercase;
  color: #999;
  margin-bottom: 2rem;
  display: flex;
  align-items: center;
  gap: 1rem;
}
.rb__section-label::after {
  content: '';
  flex: 1;
  height: 1px;
  background: #e0ddd8;
}

/* === HERO === */
.rb__hero {
  padding: 2rem 0 0;
}
.rb__hero-inner {
  display: flex;
  align-items: stretch;
  min-height: 500px;
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem 2rem;
  gap: 3rem;
}
.rb__hero-image {
  flex: 1;
  border-radius: 8px;
  overflow: hidden;
}
.rb__hero-image img { width: 100%; height: 100%; object-fit: cover; }
.rb__hero-text {
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: center;
  position: relative;
  overflow: visible;
}
.rb__hero-text .rb__pre-title,
.rb__hero-text .rb__headline,
.rb__hero-text .rb__body { position: relative; z-index: 1; }
.rb__grid-lines {
  position: absolute;
  top: 50%; left: 50%;
  transform: translate(-50%, -50%);
  width: 200%; height: 200%;
  pointer-events: none;
  z-index: 0;
  background-image:
    linear-gradient(#ddd9d3 1.5px, transparent 1.5px),
    linear-gradient(90deg, #ddd9d3 1.5px, transparent 1.5px);
  background-size: 60px 60px;
  opacity: 0.5;
  -webkit-mask-image: radial-gradient(ellipse at center, rgba(0,0,0,1) 0%, rgba(0,0,0,0) 45%);
  mask-image: radial-gradient(ellipse at center, rgba(0,0,0,1) 0%, rgba(0,0,0,0) 45%);
}
@media (max-width: 768px) {
  .rb__hero-inner { flex-direction: column; min-height: auto; gap: 2rem; }
  .rb__hero-image { height: 300px; }
}

/* === WHY REBUILD === */
.rb__why {
  padding: 3rem 0;
}
.rb__why-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 2rem;
}
.rb__why-card {
  padding: 2rem;
  border: 1px solid #e8e6e2;
  background: #fff;
}
.rb__why-icon {
  width: 40px; height: 40px;
  display: flex; align-items: center; justify-content: center;
  background: #1a1a1a; color: #fff;
  font-size: 0.85rem;
  margin-bottom: 1.25rem;
}
.rb__why-card h3 {
  font-family: 'Space Grotesk', sans-serif;
  font-size: 1rem;
  font-weight: 700;
  text-transform: uppercase;
  margin: 0 0 0.75rem;
}
.rb__why-card p {
  font-size: 0.9rem;
  color: #666;
  line-height: 1.6;
  margin: 0;
}
@media (max-width: 768px) {
  .rb__why-grid { grid-template-columns: 1fr; }
}

/* === PROCESS === */
.rb__process {
  padding: 0;
  background: #fff;
}
.rb__process-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 2rem;
}
.rb__process-step {
  padding: 1.5rem;
  border-left: 2px solid #e8e6e2;
  transition: border-color 0.3s ease;
}
.rb__process-step:hover { border-color: #1a1a1a; }
.rb__process-num {
  font-family: 'Share Tech Mono', monospace;
  font-size: 0.7rem;
  letter-spacing: 0.15em;
  color: #999;
  display: block;
  margin-bottom: 0.5rem;
}
.rb__process-step h3 {
  font-family: 'Space Grotesk', sans-serif;
  font-size: 0.95rem;
  font-weight: 700;
  text-transform: uppercase;
  margin: 0 0 0.5rem;
}
.rb__process-step p {
  font-size: 0.85rem;
  color: #666;
  line-height: 1.6;
  margin: 0;
}
@media (max-width: 768px) {
  .rb__process-grid { grid-template-columns: 1fr; }
}

/* === PROCESS + CUSTOMISE === */
.rb__process-customise {
  padding: 3rem 0;
  background: #faf9f6;
}
/* === BEFORE/AFTER === */
.rb__beforeafter {
  border: 1px solid #e8e6e2;
  background: #fff;
  padding: 1.5rem;
  margin-top: 3rem;
}
.rb__beforeafter-label {
  font-family: 'Share Tech Mono', monospace;
  font-size: 0.6rem;
  letter-spacing: 0.15em;
  text-transform: uppercase;
  color: #7a7a7a;
  display: block;
  margin-bottom: 1.25rem;
}
.rb__beforeafter-item {
  display: grid;
  grid-template-columns: 1fr auto 1fr;
  gap: 1.25rem;
  align-items: center;
}
.rb__beforeafter-before,
.rb__beforeafter-after {
  padding: 0;
}
.rb__beforeafter-before span,
.rb__beforeafter-after span {
  display: block;
  font-family: 'Share Tech Mono', monospace;
  font-size: 0.6rem;
  letter-spacing: 0.15em;
  color: #999;
  margin: 0.75rem 0 0.25rem;
}
.rb__beforeafter-before p,
.rb__beforeafter-after p {
  font-size: 0.8rem;
  line-height: 1.5;
  color: #666;
  margin: 0;
}
.rb__beforeafter-arrow {
  font-size: 1.25rem;
  color: #ccc;
  display: flex;
  align-items: center;
  justify-content: center;
}
.rb__beforeafter-img {
  aspect-ratio: 16/9;
  background: linear-gradient(135deg, #f5f4f0 0%, #eae8e4 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  border-radius: 4px;
}
.rb__beforeafter-img img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}
.rb__beforeafter-controls {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.75rem;
  margin-top: 1.5rem;
  padding-top: 1.25rem;
  border-top: 1px solid #e8e6e2;
  flex-wrap: wrap;
}
.rb__beforeafter-models {
  display: flex;
  gap: 0.4rem;
}
.rb__beforeafter-controls-divider {
  width: 1px;
  height: 24px;
  background: #ddd;
}
.rb__beforeafter-steps {
  display: flex;
  gap: 0.4rem;
  flex-wrap: wrap;
}
.rb__beforeafter-step {
  display: flex;
  align-items: center;
  gap: 0.35rem;
  padding: 0.4rem 0.85rem;
  background: #faf9f6;
  border: 1px solid #e8e6e2;
  cursor: pointer;
  transition: all 0.25s ease;
  font-family: inherit;
  border-radius: 3px;
}
.rb__beforeafter-step:hover { border-color: #ccc; background: #f0eeea; }
.rb__beforeafter-step--active {
  border-color: #1a1a1a;
  background: #1a1a1a;
  color: #fff;
}
.rb__beforeafter-step--active .rb__beforeafter-step-label { color: #fff; }
.rb__beforeafter-step-label {
  font-size: 0.65rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.06em;
  color: #666;
}
@media (max-width: 640px) {
  .rb__beforeafter-item { grid-template-columns: 1fr; }
  .rb__beforeafter-arrow { transform: rotate(90deg); text-align: center; padding-top: 0; }
  .rb__beforeafter { padding: 1rem; }
}

/* === MODELS & LEAD TIMES === */
.rb__models {
  padding: 3rem 0;
  background: #fff;
}
.rb__models-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 2rem;
}
.rb__model-card {
  border: 1px solid #e8e6e2;
  background: #faf9f6;
  overflow: hidden;
  display: flex;
  flex-direction: column;
}
.rb__model-img {
  height: 200px;
  overflow: hidden;
  background: #f0eeea;
  display: flex;
  align-items: center;
  justify-content: center;
}
.rb__model-img img { width: 100%; height: 100%; object-fit: cover; }
.rb__model-body {
  padding: 1.5rem;
  display: flex;
  flex-direction: column;
  flex: 1;
}
.rb__model-body h3 {
  font-family: 'Space Grotesk', sans-serif;
  font-size: 1rem;
  font-weight: 700;
  text-transform: uppercase;
  margin: 0 0 0.5rem;
}
.rb__model-lead {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-family: 'Share Tech Mono', monospace;
  font-size: 0.75rem;
  color: #999;
  margin-bottom: 0.75rem;
}
.rb__model-lead i { font-size: 0.7rem; }
.rb__model-pricing {
  margin-bottom: 0;
  padding: 0;
}
.rb__model-price-line {
  display: flex;
  justify-content: space-between;
  align-items: baseline;
  margin-bottom: 0.25rem;
}
.rb__model-price-line span {
  font-family: 'Share Tech Mono', monospace;
  font-size: 0.7rem;
  letter-spacing: 0.05em;
  text-transform: uppercase;
  color: #999;
}
.rb__model-price-line strong {
  font-family: 'Space Grotesk', sans-serif;
  font-size: 1.1rem;
  font-weight: 700;
  color: #1a1a1a;
}
.rb__model-price-donor {
  font-size: 0.75rem;
  color: #666;
}
.rb__model-price-donor span {
  color: #999;
}
.rb__model-price-note {
  font-size: 0.7rem;
  color: #999;
  margin-top: 0.5rem;
  font-style: italic;
}
.rb__model-body p {
  font-size: 0.85rem;
  color: #666;
  line-height: 1.6;
  margin: 0 0 1rem;
}
.rb__model-specs {
  list-style: none;
  padding: 0;
  margin: 0 0 1.25rem;
  display: flex;
  flex-direction: column;
  gap: 0.35rem;
  flex: 1;
}
.rb__model-specs li {
  font-size: 0.75rem;
  color: #666;
  padding-left: 1rem;
  position: relative;
}
.rb__model-specs li::before {
  content: '—';
  position: absolute;
  left: 0;
  color: #ccc;
}
.rb__model-btn {
  display: inline-block;
  padding: 0.65rem 1.5rem;
  font-family: 'Space Grotesk', sans-serif;
  font-size: 0.7rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.1em;
  text-decoration: none;
  text-align: center;
  background: #1a1a1a;
  color: #fff;
  border: 1.5px solid #1a1a1a;
  transition: all 0.3s ease;
}
.rb__model-btn:hover {
  background: transparent;
  color: #1a1a1a;
}
@media (max-width: 768px) {
  .rb__models-grid { grid-template-columns: 1fr; }
}

/* === DIVIDER === */
.rb__divider {
  border: none;
  height: 1px;
  background: #e0ddd8;
  margin: 3rem 0;
}

/* === CUSTOMISE === */
.rb__custom-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 1.5rem;
}
.rb__custom-card {
  padding: 1.5rem;
  border: 1px solid #e8e6e2;
  background: #fff;
  transition: border-color 0.3s ease;
}
.rb__custom-card:hover { border-color: #1a1a1a; }
.rb__custom-card i {
  font-size: 1rem;
  color: #1a1a1a;
  margin-bottom: 0.75rem;
  display: block;
}
.rb__custom-card h4 {
  font-family: 'Space Grotesk', sans-serif;
  font-size: 0.85rem;
  font-weight: 700;
  text-transform: uppercase;
  margin: 0 0 0.5rem;
}
.rb__custom-card p {
  font-size: 0.8rem;
  color: #666;
  line-height: 1.5;
  margin: 0;
}
@media (max-width: 768px) {
  .rb__custom-grid { grid-template-columns: 1fr 1fr; }
}
@media (max-width: 480px) {
  .rb__custom-grid { grid-template-columns: 1fr; }
}

/* === CTA + FAQ SIDE BY SIDE === */
.rb__cta-faq {
  padding: 3rem 0;
  background: #fff;
}
.rb__cta-faq-grid {
  display: grid;
  grid-template-columns: 1fr auto 1fr;
  gap: 4rem;
  align-items: start;
}
.rb__cta-faq-left {
  position: sticky;
  top: 120px;
}
.rb__cta-faq-divider {
  width: 1px;
  background: #e0ddd8;
  align-self: stretch;
}
@media (max-width: 768px) {
  .rb__cta-faq-grid { grid-template-columns: 1fr; gap: 3rem; }
  .rb__cta-faq-left { position: static; }
  .rb__cta-faq-divider { width: 100%; height: 1px; }
}

/* === FAQ === */
.rb__faq-header {
  margin-bottom: 2rem;
}
.rb__faq-list {
  display: flex;
  flex-direction: column;
}
.rb__faq-item {
  display: flex;
  gap: 1.5rem;
  padding: 1.25rem 0;
  border-bottom: 1px solid #e8e6e2;
  cursor: pointer;
  transition: background 0.2s ease;
}
.rb__faq-item:hover {
  background: rgba(0,0,0,0.01);
}
.rb__faq-item--open {
  background: rgba(0,0,0,0.02);
}
.rb__faq-number {
  font-family: 'Share Tech Mono', monospace;
  font-size: 0.75rem;
  color: #ccc;
  flex-shrink: 0;
  padding-top: 0.1rem;
}
.rb__faq-content {
  flex: 1;
}
.rb__faq-content h4 {
  margin: 0;
  font-family: 'Space Grotesk', sans-serif;
  font-size: 1rem;
  font-weight: 600;
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 1rem;
}
.rb__faq-toggle {
  font-size: 1.25rem;
  font-weight: 300;
  color: #999;
  flex-shrink: 0;
}
.rb__faq-answer p {
  margin: 0.75rem 0 0;
  color: #666;
  line-height: 1.7;
  font-size: 0.95rem;
}

/* === CTA === */
.rb__cta-actions {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1.5rem;
}
.rb__btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  padding: 1rem 2rem;
  font-family: 'Space Grotesk', sans-serif;
  font-size: 0.75rem;
  font-weight: 600;
  text-decoration: none;
  text-transform: uppercase;
  letter-spacing: 0.1em;
  border: 1.5px solid transparent;
  cursor: pointer;
  transition: all 0.3s ease;
}
.rb__btn--primary { background: #1a1a1a; color: #fff; border-color: #1a1a1a; }
.rb__btn--primary:hover { background: #333; border-color: #333; color: #fff; }
.rb__btn--large { padding: 1.25rem 2.5rem; font-size: 0.85rem; }
.rb__cta-phone {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.15rem;
  text-decoration: none;
  color: #1a1a1a;
}
.rb__cta-phone span { font-size: 0.7rem; color: #999; }
.rb__cta-phone strong { font-family: 'Share Tech Mono', monospace; font-size: 1.1rem; }
`;

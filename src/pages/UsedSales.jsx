/**
 * HQ AVIATION - USED AIRCRAFT SALES PAGE
 * =======================================
 * Brand Standard V1: Space Grotesk + gradient headlines + #faf9f6
 * Preserved sections: AlertSignup, VirtualTourCTA, ComparisonTool, FinalCTA
 */

import React, { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion, useInView } from 'framer-motion';

import '../assets/css/main.css';
import '../assets/css/components.css';
import FooterMinimal from '../components/FooterMinimal';

// ============================================
// DATA
// ============================================

const availableHelicopters = [
  {
    id: 'r66-ghkcc', model: 'Robinson R66 Turbine', year: 2021, registration: 'G-HKCC',
    totalHours: 485, hoursSinceOverhaul: 85, condition: 'Excellent', priceDisplay: '£995,000',
    images: [
      { url: '/assets/images/used-aircraft/r66/r66-turbine-ghkcc.jpg', alt: 'R66 Turbine G-HKCC' },
      { url: '/assets/images/used-aircraft/r66/chris-r66-alps.jpg', alt: 'R66 Turbine Alps' },
    ],
    status: 'available',
  },
  {
    id: 'r44-grrob', model: 'Robinson R44 Raven II', year: 2019, registration: 'G-RROB',
    totalHours: 890, hoursSinceOverhaul: 290, condition: 'Very Good', priceDisplay: '£385,000',
    images: [{ url: '/assets/images/new-aircraft/r44/r44blueprint.jpg', alt: 'R44 Raven II G-RROB' }],
    status: 'available',
  },
  {
    id: 'r66-gnxg', model: 'Robinson R66 Turbine', year: 2020, registration: 'G-NXG1',
    totalHours: 650, hoursSinceOverhaul: 150, condition: 'Excellent', priceDisplay: '£925,000',
    images: [{ url: '/assets/images/used-aircraft/r66/chris-r66-alps.jpg', alt: 'R66 Turbine NXG' }],
    status: 'reserved',
  },
  {
    id: 'r44-cadet', model: 'Robinson R44 Cadet', year: 2022, registration: 'G-CADB',
    totalHours: 320, hoursSinceOverhaul: 120, condition: 'Excellent', priceDisplay: '£345,000',
    images: [{ url: '/assets/images/new-aircraft/r44/raven-ii-front-alpha.png', alt: 'R44 Cadet' }],
    status: 'available',
  },
  {
    id: 'r44-raven1', model: 'Robinson R44 Raven I', year: 2017, registration: 'G-RAVI',
    totalHours: 1450, hoursSinceOverhaul: 450, condition: 'Good', priceDisplay: '£295,000',
    images: [{ url: '/assets/images/new-aircraft/r44/r44blueprint.jpg', alt: 'R44 Raven I' }],
    status: 'available',
  },
];

const soldHelicopters = [
  { id: 'sold-r66-1', model: 'Robinson R66 Turbine', year: 2019, images: [{ url: '/assets/images/used-aircraft/r66/r66-turbine-ghkcc.jpg', alt: 'R66 Sold' }] },
  { id: 'sold-r44-1', model: 'Robinson R44 Raven II', year: 2020, images: [{ url: '/assets/images/new-aircraft/r44/r44blueprint.jpg', alt: 'R44 Sold' }] },
  { id: 'sold-r22-1', model: 'Robinson R22 Beta II', year: 2019, images: [{ url: '/assets/images/new-aircraft/r22/r22-red-volcano-front-alpha-v3.png', alt: 'R22 Sold' }] },
  { id: 'sold-r44-2', model: 'Robinson R44 Cadet', year: 2021, images: [{ url: '/assets/images/new-aircraft/r44/raven-ii-front-alpha.png', alt: 'R44 Cadet Sold' }] },
];

const aircraftSpecs = [
  {
    model: 'R66 Turbine', seats: 5, engine: 'RR300 Turbine', maxSpeed: '140 kts',
    cruiseSpeed: '110 kts', range: '350 nm', endurance: '3.0 hrs',
    usefulLoad: '1,200 lbs', fuelCapacity: '73.4 gal', hasAuxTank: true,
    auxTankSpecs: { range: '400 nm', endurance: '3.5 hrs', fuelCapacity: '91.5 gal' }
  },
  {
    model: 'R44 Raven II', seats: 4, engine: 'IO-540 Piston', maxSpeed: '130 kts',
    cruiseSpeed: '110 kts', range: '300 nm', endurance: '3.0 hrs',
    usefulLoad: '882 lbs', fuelCapacity: '48.5 gal'
  },
  {
    model: 'R44 Raven I', seats: 4, engine: 'O-540 Piston', maxSpeed: '130 kts',
    cruiseSpeed: '105 kts', range: '300 nm', endurance: '3.0 hrs',
    usefulLoad: '800 lbs', fuelCapacity: '48.5 gal'
  },
  {
    model: 'R44 Cadet', seats: 2, engine: 'IO-540 Piston', maxSpeed: '130 kts',
    cruiseSpeed: '110 kts', range: '350 nm', endurance: '3.5 hrs',
    usefulLoad: '770 lbs', fuelCapacity: '48.5 gal'
  },
  {
    model: 'R22 Beta II', seats: 2, engine: 'O-360 Piston', maxSpeed: '102 kts',
    cruiseSpeed: '96 kts', range: '185 nm', endurance: '2.5 hrs',
    usefulLoad: '400 lbs', fuelCapacity: '26.4 gal'
  },
];

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

// ============================================
// SHARED SUB-COMPONENTS
// ============================================

function ImageCarousel({ images, model }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const hasMultiple = images && images.length > 1;
  if (!images || images.length === 0) {
    return (
      <div className="usv-carousel">
        <div className="usv-carousel__slides">
          <div className="usv-carousel__slide usv-carousel__slide--active">
            <img src="/assets/images/used-aircraft/r44/r44-raven-ii-grrob.jpg" alt={model} loading="lazy" />
          </div>
        </div>
      </div>
    );
  }
  const goToSlide = (index) => {
    if (index < 0) index = images.length - 1;
    if (index >= images.length) index = 0;
    setCurrentIndex(index);
  };
  return (
    <div className="usv-carousel">
      <div className="usv-carousel__slides">
        {images.map((img, i) => (
          <div key={i} className={`usv-carousel__slide ${i === currentIndex ? 'usv-carousel__slide--active' : ''}`}>
            <img src={img.url} alt={img.alt || model} loading="lazy" />
          </div>
        ))}
      </div>
      {hasMultiple && (
        <>
          <button className="usv-carousel__arrow usv-carousel__arrow--prev" onClick={(e) => { e.preventDefault(); e.stopPropagation(); goToSlide(currentIndex - 1); }}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="15 18 9 12 15 6" /></svg>
          </button>
          <button className="usv-carousel__arrow usv-carousel__arrow--next" onClick={(e) => { e.preventDefault(); e.stopPropagation(); goToSlide(currentIndex + 1); }}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="9 18 15 12 9 6" /></svg>
          </button>
          <div className="usv-carousel__dots">
            {images.map((_, i) => (
              <span key={i} className={`usv-carousel__dot ${i === currentIndex ? 'usv-carousel__dot--active' : ''}`} onClick={(e) => { e.preventDefault(); e.stopPropagation(); goToSlide(i); }} />
            ))}
          </div>
        </>
      )}
    </div>
  );
}

function CardV1({ h }) {
  return (
    <Link to={`/sales/pre-owned/${h.id}`} className="usv__card" style={{ textDecoration: 'none', color: 'inherit' }}>
      <div className="usv__card-img"><ImageCarousel images={h.images} model={h.model} />
        {h.status === 'reserved' && <span className="usv__badge usv__badge--reserved">Reserved</span>}
      </div>
      <div className="usv__card-body">
        <h3 className="usv__card-model">{h.model}</h3>
        <div className="usv__card-price">{h.priceDisplay}</div>
        <span className="usv__card-cta"></span>
        <div className="usv__card-meta"><span>{h.year}</span><span className="usv__card-reg">{h.registration}</span><span>{h.hoursSinceOverhaul} hrs since overhaul</span></div>
      </div>
    </Link>
  );
}

function SoldCardV1({ h }) {
  return (
    <div className="usv__sold-card">
      <div className="usv__sold-card-img">
        <ImageCarousel images={h.images} model={h.model} />
        <span className="usv__badge usv__badge--sold">Sold</span>
      </div>
      <div className="usv__sold-card-body">
        <h3>{h.model} <span className="usv__sold-year">({h.year})</span></h3>
      </div>
    </div>
  );
}

// ============================================
// PRESERVED SECTIONS FROM ORIGINAL
// ============================================

function VirtualTourCTA() {
  return (
    <section className="used-tour">
      <div className="used-tour__container">
        <Reveal>
          <span className="used-pre-text">See It First</span>
          <h2><span className="used-text--dark">Schedule </span><span className="used-text--mid">a Viewing</span></h2>
          <p>Visit our facility at Denham Aerodrome or arrange a virtual tour.</p>
        </Reveal>
        <Reveal delay={0.2}>
          <Link to="/contact?subject=viewing" className="used-btn used-btn--primary">Book a Viewing</Link>
        </Reveal>
      </div>
    </section>
  );
}

function ComparisonTool() {
  const [selected, setSelected] = useState([]);
  const [auxTankEnabled, setAuxTankEnabled] = useState(false);

  const toggleSelect = (model) => {
    if (selected.includes(model)) {
      setSelected(selected.filter(s => s !== model));
      if (model === 'R66 Turbine') setAuxTankEnabled(false);
    } else if (selected.length < 3) {
      setSelected([...selected, model]);
    }
  };

  const selectedSpecs = aircraftSpecs.filter(a => selected.includes(a.model));
  const r66Selected = selected.includes('R66 Turbine');

  const getValue = (aircraft, field) => {
    if (auxTankEnabled && aircraft.model === 'R66 Turbine' && aircraft.auxTankSpecs?.[field]) {
      return aircraft.auxTankSpecs[field];
    }
    return aircraft[field];
  };

  return (
    <section className="used-compare">
      <div className="used-compare__container">
        <Reveal>
          <div className="used-section-header">
            <span className="used-pre-text">Decision Tool</span>
            <h2><span className="used-text--dark">Compare </span><span className="used-text--mid">Aircraft</span></h2>
            <p>Select up to 3 aircraft models to compare specifications</p>
          </div>
        </Reveal>
        <Reveal delay={0.2}>
          <div className="used-compare__selector">
            {aircraftSpecs.map(aircraft => (
              <div key={aircraft.model} className="used-compare__chip-wrapper">
                <button className={`used-compare__chip ${selected.includes(aircraft.model) ? 'selected' : ''}`} onClick={() => toggleSelect(aircraft.model)} disabled={!selected.includes(aircraft.model) && selected.length >= 3}>
                  {aircraft.model}
                  {selected.includes(aircraft.model) && <i className="fas fa-check"></i>}
                </button>
                {aircraft.model === 'R66 Turbine' && r66Selected && (
                  <motion.div
                    className="used-compare__aux-dropdown"
                    initial={{ opacity: 0, height: 0, marginTop: 0 }}
                    animate={{ opacity: 1, height: 'auto', marginTop: 8 }}
                    exit={{ opacity: 0, height: 0, marginTop: 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    <label className="used-compare__aux-label">
                      <input
                        type="checkbox"
                        checked={auxTankEnabled}
                        onChange={(e) => setAuxTankEnabled(e.target.checked)}
                        className="used-compare__aux-checkbox"
                      />
                      <span className="used-compare__aux-check">
                        {auxTankEnabled && <i className="fas fa-check"></i>}
                      </span>
                      <span className="used-compare__aux-text">+ Auxiliary Tank</span>
                    </label>
                  </motion.div>
                )}
              </div>
            ))}
          </div>
        </Reveal>
        {selectedSpecs.length > 0 && (
          <motion.div className="used-compare__table" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <div className="used-compare__row used-compare__row--header">
              <div className="used-compare__cell">Specification</div>
              {selectedSpecs.map(a => (
                <div key={a.model} className="used-compare__cell">
                  {a.model}
                  {a.model === 'R66 Turbine' && auxTankEnabled && <span className="used-compare__aux-badge">+ AUX</span>}
                </div>
              ))}
            </div>
            <div className="used-compare__row">
              <div className="used-compare__cell used-compare__cell--label">Seats</div>
              {selectedSpecs.map(a => <div key={a.model} className="used-compare__cell">{a.seats}</div>)}
            </div>
            <div className="used-compare__row">
              <div className="used-compare__cell used-compare__cell--label">Engine</div>
              {selectedSpecs.map(a => <div key={a.model} className="used-compare__cell">{a.engine}</div>)}
            </div>
            <div className="used-compare__row">
              <div className="used-compare__cell used-compare__cell--label">Max Speed</div>
              {selectedSpecs.map(a => <div key={a.model} className="used-compare__cell">{a.maxSpeed}</div>)}
            </div>
            <div className="used-compare__row">
              <div className="used-compare__cell used-compare__cell--label">Cruise Speed</div>
              {selectedSpecs.map(a => <div key={a.model} className="used-compare__cell">{a.cruiseSpeed}</div>)}
            </div>
            <div className="used-compare__row">
              <div className="used-compare__cell used-compare__cell--label">Range</div>
              {selectedSpecs.map(a => (
                <div key={a.model} className={`used-compare__cell ${a.model === 'R66 Turbine' && auxTankEnabled ? 'used-compare__cell--highlighted' : ''}`}>
                  {getValue(a, 'range')}
                </div>
              ))}
            </div>
            <div className="used-compare__row">
              <div className="used-compare__cell used-compare__cell--label">Endurance</div>
              {selectedSpecs.map(a => (
                <div key={a.model} className={`used-compare__cell ${a.model === 'R66 Turbine' && auxTankEnabled ? 'used-compare__cell--highlighted' : ''}`}>
                  {getValue(a, 'endurance')}
                </div>
              ))}
            </div>
            <div className="used-compare__row">
              <div className="used-compare__cell used-compare__cell--label">Useful Load</div>
              {selectedSpecs.map(a => <div key={a.model} className="used-compare__cell">{a.usefulLoad}</div>)}
            </div>
            <div className="used-compare__row">
              <div className="used-compare__cell used-compare__cell--label">Fuel Capacity</div>
              {selectedSpecs.map(a => (
                <div key={a.model} className={`used-compare__cell ${a.model === 'R66 Turbine' && auxTankEnabled ? 'used-compare__cell--highlighted' : ''}`}>
                  {getValue(a, 'fuelCapacity')}
                </div>
              ))}
            </div>
          </motion.div>
        )}
      </div>
    </section>
  );
}

function AlertSignup() {
  const [email, setEmail] = useState('');
  const [preferences, setPreferences] = useState([]);

  return (
    <section className="used-final-cta__alert-section">
      <div className="used-final-cta__alert">
        <div className="used-final-cta__alert-col">
          <div className="used-final-cta__alert-label"><i className="fas fa-bell"></i> Get Aircraft Alerts</div>
          <div className="used-final-cta__alert-checks">
            {['R66 Turbine', 'R44 Raven II', 'R44 Cadet', 'R22 Beta II'].map(model => (
              <label key={model} className="used-final-cta__check">
                <input type="checkbox" checked={preferences.includes(model)} onChange={(e) => setPreferences(e.target.checked ? [...preferences, model] : preferences.filter(p => p !== model))} />
                <span>{model}</span>
              </label>
            ))}
          </div>
          <div className="used-final-cta__alert-form">
            <input type="email" placeholder="Your email" value={email} onChange={(e) => setEmail(e.target.value)} className="used-final-cta__email" />
            <button className="used-btn used-btn--primary">Register</button>
          </div>
        </div>
        <div className="used-final-cta__alert-divider" />
        <div className="used-final-cta__alert-col">
          <div className="used-final-cta__alert-label"><i className="fas fa-phone"></i> Or Contact Us Directly</div>
          <div className="used-final-cta__contact-details">
            <a href="mailto:sales@hqaviation.com">sales@hqaviation.com</a>
            <a href="tel:+441895833838">+44 (0) 1895 833 838</a>
          </div>
        </div>
      </div>
    </section>
  );
}

function FinalCTA() {
  return (
    <section className="used-final-cta">
      <div className="used-final-cta__container">
        <Reveal>
          <h2><span style={{ color: '#fff' }}>Ready to Find </span><span style={{ color: 'rgba(255,255,255,0.7)' }}>Your Aircraft?</span></h2>
          <p>Our team is standing by to help you find the perfect pre-owned helicopter</p>
        </Reveal>
        <Reveal delay={0.2}>
          <div className="used-final-cta__actions">
            <Link to="/contact" className="used-btn used-btn--light used-btn--large">Contact Sales Team</Link>
            <a href="tel:+441895833838" className="used-final-cta__phone">
              <i className="fas fa-phone"></i>
              <span>Or call directly:</span>
              <strong>+44 (0) 1895 833 838</strong>
            </a>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

// ============================================
// MAIN COMPONENT
// ============================================

function UsedSales() {
  return (
    <div className="usv usv--v1">
      <style>{pageStyles}</style>
      <FinalDraftHeader />
      <section className="usv__hero-split">
        <div className="usv__hero-image">
          <img src="/assets/images/facility/main-sales-pic.jpg" alt="Pre-Owned Helicopters" />
        </div>
        <div className="usv__hero-text">
          <div className="usv__grid-lines" />
          <span className="usv__pre-title">Pre-Owned Aircraft</span>
          <h1 className="usv__headline">
            <span className="usv__hw usv__hw--1">Pre-Owned</span>{' '}
            <span className="usv__hw usv__hw--2">Helicopters</span>
          </h1>
          <p className="usv__body">Every aircraft undergoes comprehensive inspection at our CAA-approved facility before listing.</p>
        </div>
      </section>
      <section className="usv__listings">
        <div className="usv__section-label">Current Listings</div>
        <div className="usv__grid">
          {availableHelicopters.map(h => <CardV1 key={h.id} h={h} />)}
        </div>
      </section>
      <section className="usv__sold-section">
        <div className="usv__section-label">Recently Sold</div>
        <div className="usv__sold-scroll-wrapper">
          <div className="usv__sold-scroll">
            {soldHelicopters.map(h => (
              <div key={h.id} className="usv__sold-card-wrap">
                <div className="usv__card usv__card--sold">
                  <div className="usv__card-img">
                    <ImageCarousel images={h.images} model={h.model} />
                    <span className="usv__badge usv__badge--sold">Sold</span>
                  </div>
                  <div className="usv__card-body">
                    <h3 className="usv__card-model">{h.model}</h3>
                    <div className="usv__card-meta"><span>{h.year}</span></div>
                  </div>
                </div>
              </div>
            ))}
            <div className="usv__sold-fade">
              <span>...</span>
            </div>
          </div>
        </div>
      </section>
      <AlertSignup />
      <FooterMinimal />
    </div>
  );
}

export default UsedSales;

// ============================================
// STYLES
// ============================================

const pageStyles = `
@import url('https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@400;500;600;700&family=Share+Tech+Mono&family=Montserrat:wght@400;500;600;700;800&family=Inter:wght@300;400;500;600&display=swap');

/* === V1 BASE === */
.usv--v1 {
  background: #faf9f6;
  font-family: 'Space Grotesk', -apple-system, sans-serif;
  color: #1a1a1a;
  line-height: 1.6;
  min-height: 100vh;
  position: relative;
  overflow-x: hidden;
}

/* === HERO === */
.usv--v1 .usv__hero-text { position: relative; overflow: visible; }
.usv--v1 .usv__hero-text .usv__pre-title,
.usv--v1 .usv__hero-text .usv__headline,
.usv--v1 .usv__hero-text .usv__body { position: relative; z-index: 1; }
.usv--v1 .usv__grid-lines {
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
.usv__hero-split {
  display: flex; align-items: stretch; min-height: 500px;
  max-width: 1200px; margin: 4rem auto 0; padding: 4rem 2rem;
  gap: 4rem;
}
.usv__hero-image {
  flex: 1; border-radius: 8px; overflow: hidden;
}
.usv__hero-image img { width: 100%; height: 100%; object-fit: cover; }
.usv__hero-text {
  flex: 1; display: flex; flex-direction: column; justify-content: center;
}
@media (max-width: 768px) {
  .usv__hero-split { flex-direction: column; min-height: auto; gap: 2rem; }
  .usv__hero-image { height: 300px; }
}

/* === BRAND TYPOGRAPHY === */
.usv__pre-title {
  font-family: 'Space Grotesk', sans-serif;
  font-size: 0.75rem;
  letter-spacing: 0.25em;
  text-transform: uppercase;
  color: #888;
  display: block;
  margin-bottom: 1.5rem;
}

.usv__headline {
  font-family: 'Space Grotesk', sans-serif;
  font-size: clamp(2rem, 5vw, 3.5rem);
  font-weight: 700;
  line-height: 1.1;
  text-transform: uppercase;
  margin: 0 0 1.5rem 0;
}

.usv__hw--1 { color: #1a1a1a; }
.usv__hw--2 { color: #4a4a4a; }
.usv__hw--3 { color: #7a7a7a; }

.usv__body {
  font-family: 'Space Grotesk', sans-serif;
  font-size: 1.1rem;
  line-height: 1.8;
  color: #666;
  margin: 0 0 2rem 0;
  max-width: 500px;
}

/* === SECTION LABELS === */
.usv__section-label {
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
.usv__section-label::after {
  content: '';
  flex: 1;
  height: 1px;
  background: #e0ddd8;
}

/* === LISTINGS === */
.usv__listings, .usv__sold-section {
  max-width: 1200px;
  margin: 0 auto;
  padding: 4rem 2rem;
}
.usv__sold-section { padding-top: 0; }

/* === GRID === */
.usv__grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(340px, 1fr));
  gap: 30px;
}
/* === SOLD HORIZONTAL SCROLL === */
.usv__sold-scroll-wrapper {
  position: relative;
  overflow: hidden;
}
.usv__sold-scroll {
  display: flex;
  gap: 24px;
  overflow-x: auto;
  padding-bottom: 12px;
  scrollbar-width: thin;
  scrollbar-color: #ccc transparent;
}
.usv__sold-scroll::-webkit-scrollbar { height: 4px; }
.usv__sold-scroll::-webkit-scrollbar-thumb { background: #ccc; border-radius: 2px; }
.usv__sold-card-wrap {
  flex: 0 0 359px;
}
.usv__card--sold {
  opacity: 0.7;
  pointer-events: none;
}
.usv__card--sold::before,
.usv__card--sold::after { display: none; }
.usv__sold-fade {
  flex: 0 0 80px;
  min-width: 80px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-family: 'Space Grotesk', sans-serif;
  font-size: 1.5rem;
  color: #999;
  letter-spacing: 0.2em;
  position: relative;
}
.usv__sold-scroll-wrapper::after {
  content: '';
  position: absolute;
  top: 0; right: 0;
  width: 120px; height: 100%;
  background: linear-gradient(to right, transparent, #faf9f6);
  pointer-events: none;
  z-index: 2;
}

/* === CARD === */
.usv__card {
  background: #fff;
  border-radius: 8px;
  overflow: visible;
  box-shadow: 0 5px 15px rgba(0,0,0,0.1);
  border: 1px solid #e8e6e2;
  display: flex;
  flex-direction: column;
  position: relative;
}
.usv__card::before,
.usv__card::after {
  content: '';
  position: absolute;
  inset: -3px;
  border-radius: 10px;
  border: 1.85px solid #1a1a1a;
  opacity: 0;
  transition: clip-path 0.4s ease, opacity 0.3s ease;
}
.usv__card::before {
  clip-path: inset(0 50% 0 0);
}
.usv__card::after {
  clip-path: inset(0 0 0 50%);
}
.usv__card:hover::before {
  opacity: 1;
  clip-path: inset(0 0 0 0);
}
.usv__card:hover::after {
  opacity: 1;
  clip-path: inset(0 0 0 0);
}
.usv__card-img { overflow: hidden; border-radius: 8px 8px 0 0; }
.usv__card-img {
  position: relative;
  width: 100%;
  height: 180px;
  overflow: hidden;
  background: #f5f5f2;
}
.usv__card-img img { width: 100%; height: 100%; object-fit: cover; }

.usv__badge {
  position: absolute;
  top: 12px; right: 12px;
  padding: 5px 12px;
  font-family: 'Share Tech Mono', monospace;
  font-size: 0.65rem;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  z-index: 20;
}
.usv__badge--reserved { background: #ff9800; color: #fff; }
.usv__badge--sold { top: auto; bottom: 12px; left: 12px; right: auto; background: #1a1a1a; color: #fff; }

.usv__card-body { padding: 16px; position: relative; }

.usv__card-model {
  font-family: 'Space Grotesk', sans-serif;
  font-size: 1rem;
  font-weight: 700;
  color: #1a1a1a;
  margin: 0 0 6px 0;
  text-transform: uppercase;
}

.usv__card-meta {
  display: flex;
  gap: 10px;
  font-size: 0.8rem;
  color: #666;
  margin-bottom: 10px;
  font-family: 'Space Grotesk', sans-serif;
}
.usv__card-reg { color: #999; }

.usv__card-price {
  font-family: 'Space Grotesk', sans-serif;
  font-size: 1.15rem;
  font-weight: 700;
  color: #1a1a1a;
}

.usv__card-cta {
  position: absolute;
  bottom: 16px; right: 16px;
  display: inline-block;
  width: 20px;
  height: 2px;
  background: #bbb;
  transition: width 0.3s ease;
  margin-right: 6px;
}
.usv__card-cta::after {
  content: '';
  position: absolute;
  right: -6px; top: 50%;
  transform: translateY(-50%);
  width: 0; height: 0;
  border-left: 6px solid #bbb;
  border-top: 4px solid transparent;
  border-bottom: 4px solid transparent;
}
.usv__card:hover .usv__card-cta {
  width: 34px;
}


/* === CAROUSEL === */
.usv-carousel { position: relative; width: 100%; height: 100%; }
.usv-carousel__slides { position: relative; width: 100%; height: 100%; overflow: hidden; }
.usv-carousel__slide { position: absolute; inset: 0; opacity: 0; transition: opacity 0.4s ease; }
.usv-carousel__slide--active { opacity: 1; z-index: 1; }
.usv-carousel__slide img { width: 100%; height: 100%; object-fit: cover; }
.usv-carousel__arrow { position: absolute; top: 50%; transform: translateY(-50%); z-index: 10; width: 32px; height: 32px; background: rgba(255,255,255,0.9); border: none; border-radius: 50%; cursor: pointer; display: flex; align-items: center; justify-content: center; opacity: 0; transition: opacity 0.3s ease; box-shadow: 0 2px 8px rgba(0,0,0,0.15); }
.usv__card:hover .usv-carousel__arrow, .usv__sold-card:hover .usv-carousel__arrow { opacity: 1; }
.usv-carousel__arrow--prev { left: 8px; }
.usv-carousel__arrow--next { right: 8px; }
.usv-carousel__dots { position: absolute; bottom: 10px; left: 50%; transform: translateX(-50%); z-index: 10; display: flex; gap: 6px; padding: 4px 8px; background: rgba(0,0,0,0.4); border-radius: 20px; }
.usv-carousel__dot { width: 6px; height: 6px; background: rgba(255,255,255,0.5); border-radius: 50%; cursor: pointer; transition: background 0.3s ease; }
.usv-carousel__dot--active { background: #fff; }

/* === PRESERVED SECTION STYLES === */

/* Typography helpers */
.used-pre-text {
  font-family: 'Share Tech Mono', monospace;
  font-size: 0.7rem;
  letter-spacing: 0.25em;
  text-transform: uppercase;
  color: #888;
  margin-bottom: 1rem;
  display: block;
}
.used-text--dark { color: #1a1a1a; }
.used-text--mid { color: #4a4a4a; }

.used-section-header {
  text-align: center;
  max-width: 700px;
  margin: 0 auto 3rem;
}
.used-section-header h2 {
  font-size: clamp(2rem, 4vw, 3rem);
  margin: 0.5rem 0;
  line-height: 1.1;
  text-transform: uppercase;
  font-weight: 700;
}
.used-section-header p {
  color: #666;
  font-size: 1rem;
  margin-top: 1rem;
}

/* Buttons */
.used-btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  padding: 1rem 2rem;
  font-size: 0.75rem;
  font-weight: 500;
  text-decoration: none;
  text-transform: uppercase;
  letter-spacing: 0.1em;
  border: 2px solid transparent;
  cursor: pointer;
  transition: all 0.3s ease;
  font-family: inherit;
}
.used-btn--primary { background: #1a1a1a; color: #fff; border-color: #1a1a1a; }
.used-btn--primary:hover { background: #333; border-color: #333; color: #fff; }
.used-btn--light { background: #fff; color: #1a1a1a; border-color: #fff; }
.used-btn--light:hover { background: transparent; color: #fff; }
.used-btn--large { padding: 1.25rem 2.5rem; font-size: 0.85rem; }

/* Alert Signup */

/* Virtual Tour */
.used-tour { padding: 4rem 2rem; background: #f0efec; text-align: center; }
.used-tour__container { max-width: 600px; margin: 0 auto; }
.used-tour h2 { font-size: clamp(1.5rem, 3vw, 2rem); text-transform: uppercase; margin: 0.5rem 0 1rem; }
.used-tour p { color: #666; margin-bottom: 1.5rem; }

/* Compare */
.used-compare { padding: 6rem 2rem; background: #fff; }
.used-compare__container { max-width: 1000px; margin: 0 auto; }
.used-compare__selector { display: flex; flex-wrap: wrap; justify-content: center; gap: 0.75rem; margin-bottom: 2rem; }
.used-compare__chip { display: flex; align-items: center; gap: 0.5rem; padding: 0.6rem 1.25rem; font-size: 0.75rem; font-weight: 500; text-transform: uppercase; letter-spacing: 0.05em; background: #faf9f6; border: 1px solid #e8e6e2; cursor: pointer; transition: all 0.3s ease; font-family: inherit; }
.used-compare__chip:hover:not(:disabled) { border-color: #1a1a1a; }
.used-compare__chip.selected { background: #1a1a1a; color: #fff; border-color: #1a1a1a; }
.used-compare__chip:disabled { opacity: 0.5; cursor: not-allowed; }
.used-compare__table { overflow-x: auto; }
.used-compare__row { display: grid; grid-template-columns: 150px repeat(3, 1fr); border-bottom: 1px solid #e8e6e2; }
.used-compare__row--header { background: #1a1a1a; color: #fff; font-weight: 600; border-bottom: none; }
.used-compare__row--header .used-compare__cell { border-right-color: rgba(255,255,255,0.1); }
.used-compare__cell { padding: 1rem; text-align: center; border-right: 1px solid #e8e6e2; font-size: 0.85rem; }
.used-compare__cell:last-child { border-right: none; }
.used-compare__cell--label { text-align: left; font-weight: 600; background: #faf9f6; font-size: 0.75rem; text-transform: uppercase; letter-spacing: 0.05em; }
.used-compare__row:nth-child(even) .used-compare__cell:not(.used-compare__cell--label) { background: #faf9f6; }
.used-compare__chip-wrapper { display: flex; flex-direction: column; align-items: center; }
.used-compare__aux-dropdown { overflow: hidden; }
.used-compare__aux-label { display: flex; align-items: center; gap: 0.5rem; cursor: pointer; padding: 0.4rem 0.75rem; background: #1a1a1a; border-radius: 3px; transition: all 0.2s ease; }
.used-compare__aux-label:hover { background: #2a2a2a; }
.used-compare__aux-checkbox { display: none; }
.used-compare__aux-check { width: 14px; height: 14px; border: 1.5px solid rgba(255,255,255,0.5); border-radius: 2px; display: flex; align-items: center; justify-content: center; transition: all 0.2s ease; }
.used-compare__aux-check i { font-size: 8px; color: #fff; }
.used-compare__aux-checkbox:checked + .used-compare__aux-check { background: #fff; border-color: #fff; }
.used-compare__aux-checkbox:checked + .used-compare__aux-check i { color: #1a1a1a; }
.used-compare__aux-text { font-family: 'Share Tech Mono', monospace; font-size: 0.65rem; color: rgba(255,255,255,0.9); letter-spacing: 0.03em; }
.used-compare__aux-badge { display: inline-block; font-family: 'Share Tech Mono', monospace; font-size: 0.55rem; background: #1a1a1a; color: #fff; padding: 0.15rem 0.4rem; border-radius: 2px; margin-left: 0.5rem; vertical-align: middle; }
.used-compare__cell--highlighted { background: rgba(26, 26, 26, 0.06) !important; font-weight: 600; position: relative; }
.used-compare__cell--highlighted::before { content: ''; position: absolute; left: 0; top: 0; bottom: 0; width: 2px; background: #1a1a1a; }

/* Final CTA */
.used-final-cta { padding: 5rem 2rem; background: linear-gradient(135deg, #1a1a1a 0%, #2d2d2d 100%); text-align: center; }
.used-final-cta__container { max-width: 700px; margin: 0 auto; }
.used-final-cta h2 { font-size: clamp(1.5rem, 4vw, 2.5rem); text-transform: uppercase; margin: 0 0 1rem; }
.used-final-cta p { color: rgba(255,255,255,0.7); margin-bottom: 2rem; }
.used-final-cta__actions { display: flex; flex-direction: column; align-items: center; gap: 1.5rem; }
.used-final-cta__phone { display: flex; flex-direction: column; align-items: center; gap: 0.25rem; text-decoration: none; color: #fff; }
.used-final-cta__phone i { font-size: 1.25rem; margin-bottom: 0.25rem; }
.used-final-cta__phone span { font-size: 0.7rem; opacity: 0.6; }
.used-final-cta__phone strong { font-family: 'Share Tech Mono', monospace; font-size: 1.1rem; }
.used-final-cta__alert-section { background: #f0efec; padding: 2.5rem 2rem; }
.used-final-cta__alert { max-width: 900px; margin: 0 auto; display: flex; align-items: center; gap: 3rem; }
.used-final-cta__alert-col { flex: 1; display: flex; flex-direction: column; align-items: center; text-align: center; }
.used-final-cta__alert-divider { width: 1px; background: #ddd; align-self: stretch; }
.used-final-cta__alert-label { font-family: 'Share Tech Mono', monospace; font-size: 0.7rem; letter-spacing: 0.15em; text-transform: uppercase; color: #999; margin-bottom: 1rem; }
.used-final-cta__alert-label i { margin-right: 0.5rem; }
.used-final-cta__alert-checks { display: flex; flex-wrap: wrap; justify-content: center; gap: 0.5rem; margin-bottom: 1.25rem; }
.used-final-cta__check { display: flex; align-items: center; gap: 0.35rem; cursor: pointer; font-size: 0.75rem; color: #666; }
.used-final-cta__check input { width: 14px; height: 14px; accent-color: #1a1a1a; }
.used-final-cta__alert-form { display: flex; gap: 0.5rem; width: 100%; }
.used-final-cta__email { flex: 1; padding: 0.6rem 0.75rem; font-size: 0.85rem; border: 1px solid #ddd; background: #fff; color: #1a1a1a; font-family: inherit; box-sizing: border-box; }
.used-final-cta__email::placeholder { color: #999; }
.used-final-cta__email:focus { outline: none; border-color: #1a1a1a; }
.used-final-cta__alert-form .used-btn { padding: 0.6rem 1.25rem; font-size: 0.7rem; }
.used-final-cta__contact-details { display: flex; flex-direction: column; gap: 0.75rem; margin-top: 1rem; }
.used-final-cta__contact-details a { font-family: 'Space Grotesk', sans-serif; font-size: 0.85rem; color: #1a1a1a; text-decoration: none; }
.used-final-cta__contact-details a:hover { text-decoration: underline; }
@media (max-width: 768px) {
  .used-final-cta__alert { flex-direction: column; gap: 2rem; }
  .used-final-cta__alert-divider { width: 100%; height: 1px; align-self: auto; }
}
@media (max-width: 480px) {
  .used-final-cta__alert-form { flex-direction: column; }
}

/* === RESPONSIVE === */
@media (max-width: 768px) {
  .usv__grid { grid-template-columns: 1fr; }
  .usv__listings, .usv__sold-section { padding: 2rem 1rem; }
}
`;

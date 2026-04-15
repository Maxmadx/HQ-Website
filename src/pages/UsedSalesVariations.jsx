/**
 * HQ AVIATION - USED AIRCRAFT SALES PAGE VARIATIONS
 * ==================================================
 * 10 improved variations of the /sales/used-2 page
 * Uses Picker component for browsing + brand identity
 * Standard Header component
 */

import React, { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion, useInView } from 'framer-motion';
import FooterMinimal from '../components/FooterMinimal';
import Picker from '../components/Picker';

// ============================================
// SHARED DATA
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

// ============================================
// HEADER (Spotlight animation - same as Experimentation)
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
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="9 6 15 12 9 18" /></svg>
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

// ============================================
// VARIATION 1 — Brand Standard (Space Grotesk + faf9f6)
// ============================================

function Variation1() {
  return (
    <div className="usv usv--v1">
      <style>{v1Styles}</style>
      <section className="usv__hero-split">
        <div className="usv__hero-image">
          <img src="/assets/images/facility/main-sales-pic.jpg" alt="Pre-Owned Helicopters" />
        </div>
        <div className="usv__hero-text">
          <div className="usv__grid-lines" />
          <span className="usv__pre-title">Pre-Owned Aircraft</span>
          <h1 className="usv__headline">
            <span className="usv__hw usv__hw--1">Certified</span>{' '}
            <span className="usv__hw usv__hw--2">Pre-Owned</span>{' '}
            <span className="usv__hw usv__hw--3">Helicopters</span>
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
        <div className="usv__sold-grid">
          {soldHelicopters.map(h => <SoldCardV1 key={h.id} h={h} />)}
        </div>
      </section>
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
        <span className="usv__card-cta"><span className="usv__card-cta-text">View Details </span>→</span>
        <div className="usv__card-meta"><span>{h.year}</span><span className="usv__card-reg">{h.registration}</span><span>{h.hoursSinceOverhaul} hrs since overhaul</span></div>
      </div>
    </Link>
  );
}

function SoldCardV1({ h }) {
  return (
    <div className="usv__sold-card">
      <div className="usv__sold-card-img"><ImageCarousel images={h.images} model={h.model} /><span className="usv__badge usv__badge--sold">Sold</span></div>
      <div className="usv__sold-card-body"><h3>{h.model} <span className="usv__sold-year">— {h.year}</span></h3></div>
    </div>
  );
}

// ============================================
// VARIATION 2 — Dark Luxury
// ============================================

function Variation2() {
  return (
    <div className="usv usv--v2">
      <style>{v2Styles}</style>
      <section className="usv__hero-full">
        <img src="/assets/images/facility/main-sales-pic.jpg" alt="Pre-Owned" className="usv__hero-bg" />
        <div className="usv__hero-overlay">
          <span className="usv__coords">51.5751°N / 0.5059°W</span>
          <h1 className="usv__headline-dark">Pre-Owned<br />Collection</h1>
          <p className="usv__body-dark">Inspected. Certified. Ready to fly.</p>
        </div>
      </section>
      <section className="usv__listings-dark">
        <div className="usv__section-label-dark">Available Aircraft</div>
        <div className="usv__grid">
          {availableHelicopters.map(h => <CardV1 key={h.id} h={h} />)}
        </div>
      </section>
      <section className="usv__sold-section-dark">
        <div className="usv__section-label-dark">Recently Sold</div>
        <div className="usv__sold-grid">
          {soldHelicopters.map(h => <SoldCardV1 key={h.id} h={h} />)}
        </div>
      </section>
    </div>
  );
}

// ============================================
// VARIATION 3 — Editorial Grid
// ============================================

function Variation3() {
  return (
    <div className="usv usv--v3">
      <style>{v3Styles}</style>
      <section className="usv__hero-editorial">
        <div className="usv__hero-editorial-left">
          <span className="usv__pre-title">Pre-Owned Aircraft</span>
          <h1 className="usv__headline">
            <span className="usv__hw usv__hw--1">Find</span>{' '}
            <span className="usv__hw usv__hw--2">Your</span>{' '}
            <span className="usv__hw usv__hw--3">Aircraft</span>
          </h1>
          <p className="usv__body">Browse our curated selection of pre-owned helicopters, each inspected and prepared at our Denham facility.</p>
          <Link to="/contact" className="usv__btn-outline">Get in Touch</Link>
        </div>
        <div className="usv__hero-editorial-right">
          <img src="/assets/images/facility/main-sales-pic.jpg" alt="Pre-Owned" />
        </div>
      </section>
      <section className="usv__listings">
        <div className="usv__section-label">Current Listings</div>
        <div className="usv__grid usv__grid--2col">
          {availableHelicopters.map(h => <CardV1 key={h.id} h={h} />)}
        </div>
      </section>
      <section className="usv__sold-section">
        <div className="usv__section-label">Recently Sold</div>
        <div className="usv__sold-grid">
          {soldHelicopters.map(h => <SoldCardV1 key={h.id} h={h} />)}
        </div>
      </section>
    </div>
  );
}

// ============================================
// VARIATION 4 — Minimal List
// ============================================

function Variation4() {
  return (
    <div className="usv usv--v4">
      <style>{v4Styles}</style>
      <section className="usv__hero-minimal">
        <span className="usv__pre-title">Pre-Owned Helicopters</span>
        <h1 className="usv__headline-center">
          <span className="usv__hw usv__hw--1">Available</span>{' '}
          <span className="usv__hw usv__hw--2">Aircraft</span>
        </h1>
        <div className="usv__divider" />
      </section>
      <section className="usv__list-section">
        {availableHelicopters.map(h => (
          <Link to={`/sales/pre-owned/${h.id}`} key={h.id} className="usv__list-item" style={{ textDecoration: 'none', color: 'inherit' }}>
            <div className="usv__list-img"><ImageCarousel images={h.images} model={h.model} /></div>
            <div className="usv__list-info">
              <h3 className="usv__list-model">{h.model}</h3>
              <span className="usv__list-meta">{h.year} · {h.registration} · {h.totalHours?.toLocaleString()} hrs</span>
            </div>
            <div className="usv__list-price">{h.priceDisplay}</div>
            <span className="usv__list-arrow">→</span>
          </Link>
        ))}
      </section>
      <section className="usv__sold-section">
        <div className="usv__section-label">Recently Sold</div>
        <div className="usv__sold-grid">
          {soldHelicopters.map(h => <SoldCardV1 key={h.id} h={h} />)}
        </div>
      </section>
    </div>
  );
}

// ============================================
// VARIATION 5 — Full-Width Hero + Cards
// ============================================

function Variation5() {
  return (
    <div className="usv usv--v5">
      <style>{v5Styles}</style>
      <section className="usv__hero-fullwidth">
        <img src="/assets/images/facility/main-sales-pic.jpg" alt="Pre-Owned" />
        <div className="usv__hero-fullwidth-content">
          <span className="usv__pre-title-light">The Robinson Specialists since 1990</span>
          <h1 className="usv__headline-white">Pre-Owned Helicopters</h1>
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
        <div className="usv__sold-grid">
          {soldHelicopters.map(h => <SoldCardV1 key={h.id} h={h} />)}
        </div>
      </section>
    </div>
  );
}

// ============================================
// VARIATION 6 — Split Hero Card (Original Faithful)
// ============================================

function Variation6() {
  return (
    <div className="usv usv--v6">
      <style>{v6Styles}</style>
      <section className="usv__hero-card-wrap">
        <div className="usv__hero-card">
          <div className="usv__hero-card-img">
            <img src="/assets/images/facility/main-sales-pic.jpg" alt="Helicopter on tarmac" />
          </div>
          <div className="usv__hero-card-text">
            <h2>Explore Our Current Selection of Available Aircraft</h2>
          </div>
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
        <div className="usv__sold-grid">
          {soldHelicopters.map(h => <SoldCardV1 key={h.id} h={h} />)}
        </div>
      </section>
    </div>
  );
}

// ============================================
// VARIATION 7 — Asymmetric Hero + Grid Numbers
// ============================================

function Variation7() {
  return (
    <div className="usv usv--v7">
      <style>{v7Styles}</style>
      <section className="usv__hero-asym">
        <div className="usv__hero-asym-text">
          <span className="usv__counter">01</span>
          <span className="usv__pre-title">Pre-Owned Aircraft</span>
          <h1 className="usv__headline">
            <span className="usv__hw usv__hw--1">Curated</span>{' '}
            <span className="usv__hw usv__hw--2">Collection</span>
          </h1>
          <p className="usv__body">Hand-selected helicopters from the UK's leading Robinson specialist.</p>
        </div>
        <div className="usv__hero-asym-img">
          <img src="/assets/images/facility/main-sales-pic.jpg" alt="Pre-Owned" />
        </div>
      </section>
      <section className="usv__listings">
        <div className="usv__section-label"><span className="usv__counter">02</span> Available Aircraft</div>
        <div className="usv__grid">
          {availableHelicopters.map(h => <CardV1 key={h.id} h={h} />)}
        </div>
      </section>
      <section className="usv__sold-section">
        <div className="usv__section-label"><span className="usv__counter">03</span> Recently Sold</div>
        <div className="usv__sold-grid">
          {soldHelicopters.map(h => <SoldCardV1 key={h.id} h={h} />)}
        </div>
      </section>
    </div>
  );
}

// ============================================
// VARIATION 8 — Centered Elegant
// ============================================

function Variation8() {
  return (
    <div className="usv usv--v8">
      <style>{v8Styles}</style>
      <section className="usv__hero-centered">
        <span className="usv__pre-title">Denham Aerodrome, UK</span>
        <h1 className="usv__headline-center">
          <span className="usv__hw usv__hw--1">Pre-Owned</span>{' '}
          <span className="usv__hw usv__hw--2">Helicopters</span>
        </h1>
        <p className="usv__body" style={{ textAlign: 'center', maxWidth: 500, margin: '0 auto' }}>
          Browse our selection of inspected and certified helicopters, prepared at our CAA-approved maintenance facility.
        </p>
        <div className="usv__divider" />
      </section>
      <section className="usv__featured-img">
        <img src="/assets/images/facility/main-sales-pic.jpg" alt="Pre-Owned" />
      </section>
      <section className="usv__listings">
        <div className="usv__section-label">Current Listings</div>
        <div className="usv__grid">
          {availableHelicopters.map(h => <CardV1 key={h.id} h={h} />)}
        </div>
      </section>
      <section className="usv__sold-section">
        <div className="usv__section-label">Recently Sold</div>
        <div className="usv__sold-grid">
          {soldHelicopters.map(h => <SoldCardV1 key={h.id} h={h} />)}
        </div>
      </section>
    </div>
  );
}

// ============================================
// VARIATION 9 — Magazine / Sotheby's
// ============================================

function Variation9() {
  return (
    <div className="usv usv--v9">
      <style>{v9Styles}</style>
      <section className="usv__hero-magazine">
        <div className="usv__hero-magazine-img">
          <img src="/assets/images/facility/main-sales-pic.jpg" alt="Pre-Owned" />
        </div>
        <div className="usv__hero-magazine-text">
          <span className="usv__pre-title">HQ Aviation</span>
          <h1 className="usv__headline">
            <span className="usv__hw usv__hw--1">Pre-Owned</span><br />
            <span className="usv__hw usv__hw--2">Aircraft</span>{' '}
            <span className="usv__hw usv__hw--3">Sales</span>
          </h1>
          <div className="usv__divider" />
          <p className="usv__body">Each aircraft in our pre-owned collection undergoes comprehensive inspection at our CAA-approved maintenance facility.</p>
          <span className="usv__coords">51.5751°N / 0.5059°W · Denham Aerodrome</span>
        </div>
      </section>
      <section className="usv__listings">
        <div className="usv__section-label">Available</div>
        <div className="usv__grid">
          {availableHelicopters.map(h => <CardV1 key={h.id} h={h} />)}
        </div>
      </section>
      <section className="usv__sold-section">
        <div className="usv__section-label">Sold</div>
        <div className="usv__sold-grid">
          {soldHelicopters.map(h => <SoldCardV1 key={h.id} h={h} />)}
        </div>
      </section>
    </div>
  );
}

// ============================================
// VARIATION 10 — Technical Instrumentation
// ============================================

function Variation10() {
  return (
    <div className="usv usv--v10">
      <style>{v10Styles}</style>
      <section className="usv__hero-tech">
        <div className="usv__tech-grid-lines" />
        <div className="usv__hero-tech-content">
          <div className="usv__tech-label">PRE-OWNED INVENTORY</div>
          <h1 className="usv__headline-tech">Available Aircraft</h1>
          <div className="usv__tech-stats">
            <div className="usv__tech-stat"><span className="usv__tech-stat-num">{availableHelicopters.length}</span><span className="usv__tech-stat-label">Available</span></div>
            <div className="usv__tech-stat"><span className="usv__tech-stat-num">{soldHelicopters.length}</span><span className="usv__tech-stat-label">Recently Sold</span></div>
            <div className="usv__tech-stat"><span className="usv__tech-stat-num">35+</span><span className="usv__tech-stat-label">Years Experience</span></div>
          </div>
        </div>
        <div className="usv__hero-tech-img">
          <img src="/assets/images/facility/main-sales-pic.jpg" alt="Pre-Owned" />
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
        <div className="usv__sold-grid">
          {soldHelicopters.map(h => <SoldCardV1 key={h.id} h={h} />)}
        </div>
      </section>
    </div>
  );
}

// ============================================
// PICKER SETUP
// ============================================

const variations = {
  layouts: [
    { id: 'v1', name: 'Brand Standard', category: 'Warm White', desc: 'Space Grotesk + gradient headlines + #faf9f6' },
    { id: 'v2', name: 'Dark Luxury', category: 'Dark', desc: 'Full dark hero with coordinates overlay' },
    { id: 'v3', name: 'Editorial Grid', category: 'Split', desc: 'Text left / image right editorial layout' },
    { id: 'v4', name: 'Minimal List', category: 'Minimal', desc: 'Horizontal list rows instead of cards' },
    { id: 'v5', name: 'Full-Width Hero', category: 'Bold', desc: 'Full-width hero image with overlay text' },
    { id: 'v6', name: 'Split Hero Card', category: 'Card', desc: 'Original hq-hero-card from HTML faithfully transferred' },
    { id: 'v7', name: 'Asymmetric + Numbers', category: 'Technical', desc: 'Section counters with asymmetric hero' },
    { id: 'v8', name: 'Centered Elegant', category: 'Centered', desc: 'Centered text hero with featured image below' },
    { id: 'v9', name: 'Magazine / Sothebys', category: 'Editorial', desc: 'Magazine-style layout with coordinates' },
    { id: 'v10', name: 'Technical Instrumentation', category: 'Technical', desc: 'Grid lines + stats + instrument-like feel' },
  ],
};

const tabs = [
  { key: 'layouts', label: 'Layouts', color: 'default' },
];

const variationMap = { v1: Variation1, v2: Variation2, v3: Variation3, v4: Variation4, v5: Variation5, v6: Variation6, v7: Variation7, v8: Variation8, v9: Variation9, v10: Variation10 };

// ============================================
// MAIN PAGE
// ============================================

export default function UsedSalesVariations() {
  const [currentVariation, setCurrentVariation] = useState('v1');
  const VariationComponent = variationMap[currentVariation] || Variation1;

  return (
    <>
      <style>{sharedStyles}</style>
      <FinalDraftHeader />
      <div className="usv-page">
        <VariationComponent />
        <FooterMinimal />
      </div>
      <Picker
        sections={variations}
        tabs={tabs}
        storageKey="used-sales-variations-favorites"
        title="Used Sales Variations"
        onItemSelect={(item) => setCurrentVariation(item.id)}
      />
    </>
  );
}

// ============================================
// SHARED STYLES (carousel, cards, common)
// ============================================

const sharedStyles = `
@import url('https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@400;500;600;700&family=Share+Tech+Mono&family=Montserrat:wght@400;500;600;700;800&family=Inter:wght@300;400;500;600&display=swap');

.usv-page {
  min-height: 100vh;
}

/* Brand typography */
.usv__pre-title {
  font-family: 'Space Grotesk', sans-serif;
  font-size: 0.75rem;
  letter-spacing: 0.25em;
  text-transform: uppercase;
  color: #888;
  display: block;
  margin-bottom: 1.5rem;
}

.usv__pre-title-light {
  font-family: 'Space Grotesk', sans-serif;
  font-size: 0.75rem;
  letter-spacing: 0.25em;
  text-transform: uppercase;
  color: rgba(255,255,255,0.6);
  display: block;
  margin-bottom: 1.5rem;
}

.usv__headline, .usv__headline-center {
  font-family: 'Space Grotesk', sans-serif;
  font-size: clamp(2rem, 5vw, 3.5rem);
  font-weight: 700;
  line-height: 1.1;
  text-transform: uppercase;
  margin: 0 0 1.5rem 0;
}

.usv__headline-center { text-align: center; }

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

.usv__coords {
  font-family: 'Share Tech Mono', monospace;
  font-size: 0.65rem;
  letter-spacing: 0.1em;
  color: #999;
}

.usv__counter {
  font-family: 'Share Tech Mono', monospace;
  font-size: 0.65rem;
  letter-spacing: 0.1em;
  color: #999;
  margin-right: 0.75rem;
}

.usv__divider {
  width: 40px;
  height: 1px;
  background: linear-gradient(to right, transparent, #c0bdb8, transparent);
  margin: 2rem auto;
}

/* Buttons */
.usv__btn-primary {
  display: inline-block;
  padding: 1rem 2rem;
  background: #1a1a1a;
  color: #fff;
  text-decoration: none;
  font-family: 'Space Grotesk', sans-serif;
  font-size: 0.75rem;
  font-weight: 400;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  transition: all 0.3s ease;
}

.usv__btn-primary:hover { background: #333; }

.usv__btn-outline {
  display: inline-block;
  padding: 21px 34px;
  background: transparent;
  color: #222;
  border: 2px solid #222;
  text-decoration: none;
  font-family: 'Space Grotesk', sans-serif;
  font-size: 15px;
  text-transform: uppercase;
  letter-spacing: 0.8px;
  transition: 0.1s background-color linear, 0.1s color linear;
}

.usv__btn-outline:hover { background: #222; color: #fff; }

/* Section labels */
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

/* Listings section */
.usv__listings, .usv__sold-section {
  max-width: 1200px;
  margin: 0 auto;
  padding: 4rem 2rem;
}

.usv__sold-section { padding-top: 0; }

/* Grid */
.usv__grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(340px, 1fr));
  gap: 30px;
}

.usv__grid--2col {
  grid-template-columns: repeat(2, 1fr);
}

.usv__sold-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(260px, 1fr));
  gap: 24px;
}

/* Card */
.usv__card {
  background: #fff;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 5px 15px rgba(0,0,0,0.1);
  transition: transform 0.3s ease, box-shadow 0.3s ease;
  border: 1px solid #e8e6e2;
  display: flex;
  flex-direction: column;
}

.usv__card:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 24px rgba(0,0,0,0.1);
}

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
  top: 12px;
  right: 12px;
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

.usv__card-specs {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 6px;
  padding: 10px 0;
  border-top: 1px solid #e8e6e2;
  border-bottom: 1px solid #e8e6e2;
  margin-bottom: 10px;
}

.usv__spec-label {
  display: block;
  font-family: 'Share Tech Mono', monospace;
  font-size: 0.65rem;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  color: #999;
}

.usv__spec-val {
  display: block;
  font-family: 'Space Grotesk', sans-serif;
  font-size: 0.85rem;
  font-weight: 600;
  color: #333;
}

.usv__card-footer {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.usv__card-price {
  font-family: 'Space Grotesk', sans-serif;
  font-size: 1.15rem;
  font-weight: 700;
  color: #1a1a1a;
}

.usv__card-cta {
  position: absolute;
  bottom: 16px;
  right: 16px;
  font-family: 'Share Tech Mono', monospace;
  font-size: 0.65rem;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  color: #999;
  text-decoration: none;
}

.usv__card-cta-text {
  display: inline-block;
  max-width: 0;
  overflow: hidden;
  vertical-align: middle;
  white-space: nowrap;
  transition: max-width 0.3s ease;
}

.usv__card:hover .usv__card-cta-text { max-width: 100px; }

/* Sold card */
.usv__sold-card {
  background: #fff;
  border-radius: 8px;
  overflow: hidden;
  border: 1px solid #e8e6e2;
  opacity: 0.8;
}

.usv__sold-card-img {
  position: relative;
  width: 100%;
  height: 160px;
  overflow: hidden;
  background: #f5f5f2;
}

.usv__sold-card-img img { width: 100%; height: 100%; object-fit: cover; }

.usv__sold-card-body {
  padding: 16px;
}

.usv__sold-card-body h3 {
  font-family: 'Space Grotesk', sans-serif;
  font-size: 1rem;
  font-weight: 600;
  color: #1a1a1a;
  margin: 0;
  text-transform: uppercase;
}

.usv__sold-year {
  font-weight: 400;
  color: #999;
  font-size: 0.9rem;
}

/* Carousel */
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

/* Responsive */
@media (max-width: 768px) {
  .usv__grid { grid-template-columns: 1fr; }
  .usv__grid--2col { grid-template-columns: 1fr; }
  .usv__sold-grid { grid-template-columns: 1fr 1fr; }
  .usv__listings, .usv__sold-section { padding: 2rem 1rem; }
}
@media (max-width: 480px) {
  .usv__sold-grid { grid-template-columns: 1fr; }
}
`;

// ============================================
// VARIATION-SPECIFIC STYLES
// ============================================

const v1Styles = `
.usv--v1 { background: #faf9f6; position: relative; }
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
    linear-gradient(#e8e6e2 1px, transparent 1px),
    linear-gradient(90deg, #e8e6e2 1px, transparent 1px);
  background-size: 60px 60px;
  opacity: 0.35;
  -webkit-mask-image: radial-gradient(ellipse at center, rgba(0,0,0,1) 0%, rgba(0,0,0,0) 70%);
  mask-image: radial-gradient(ellipse at center, rgba(0,0,0,1) 0%, rgba(0,0,0,0) 70%);
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
`;

const v2Styles = `
.usv--v2 { background: #1a1a1a; color: #fff; }
.usv--v2 .usv__card { background: #222; border-color: #333; }
.usv--v2 .usv__card-model { color: #fff; }
.usv--v2 .usv__card-price { color: #fff; }
.usv--v2 .usv__spec-val { color: #ccc; }
.usv--v2 .usv__card-specs { border-color: #333; }
.usv--v2 .usv__sold-card { background: #222; border-color: #333; }
.usv--v2 .usv__sold-card-body h3 { color: #fff; }
.usv__hero-full {
  position: relative; height: 70vh; min-height: 400px; overflow: hidden;
}
.usv__hero-bg { width: 100%; height: 100%; object-fit: cover; }
.usv__hero-overlay {
  position: absolute; inset: 0; background: linear-gradient(to right, rgba(0,0,0,0.7) 0%, rgba(0,0,0,0.3) 100%);
  display: flex; flex-direction: column; justify-content: center; padding: 4rem;
}
.usv__hero-overlay .usv__coords { color: rgba(255,255,255,0.5); margin-bottom: 1rem; }
.usv__headline-dark {
  font-family: 'Space Grotesk', sans-serif; font-size: clamp(2.5rem, 6vw, 4.5rem);
  font-weight: 700; line-height: 1; text-transform: uppercase; color: #fff; margin: 0 0 1rem 0;
}
.usv__body-dark { color: rgba(255,255,255,0.6); font-family: 'Space Grotesk', sans-serif; font-size: 1.1rem; }
.usv__section-label-dark { font-family: 'Space Grotesk', sans-serif; font-size: 0.7rem; letter-spacing: 0.2em; text-transform: uppercase; color: rgba(255,255,255,0.4); margin-bottom: 2rem; }
`;

const v3Styles = `
.usv--v3 { background: #faf9f6; }
.usv__hero-editorial {
  display: flex; align-items: center; max-width: 1200px; margin: 0 auto; padding: 6rem 2rem;
  gap: 4rem;
}
.usv__hero-editorial-left { flex: 1; }
.usv__hero-editorial-right { flex: 1; border-radius: 8px; overflow: hidden; box-shadow: 0 20px 60px rgba(0,0,0,0.2); }
.usv__hero-editorial-right img { width: 100%; display: block; }
@media (max-width: 768px) {
  .usv__hero-editorial { flex-direction: column-reverse; gap: 2rem; padding: 3rem 1rem; }
}
`;

const v4Styles = `
.usv--v4 { background: #faf9f6; }
.usv__hero-minimal {
  text-align: center; padding: 6rem 2rem 2rem;
  max-width: 600px; margin: 0 auto;
}
.usv__list-section {
  max-width: 1000px; margin: 0 auto; padding: 0 2rem 4rem;
}
.usv__list-item {
  display: flex; align-items: center; gap: 24px;
  padding: 20px 0; border-bottom: 1px solid #e8e6e2;
  transition: background 0.2s ease;
}
.usv__list-item:hover { background: #f5f5f2; margin: 0 -1rem; padding: 20px 1rem; border-radius: 8px; border-color: transparent; }
.usv__list-img { width: 120px; height: 80px; border-radius: 6px; overflow: hidden; flex-shrink: 0; }
.usv__list-img img { width: 100%; height: 100%; object-fit: cover; }
.usv__list-info { flex: 1; }
.usv__list-model { font-family: 'Space Grotesk', sans-serif; font-size: 1rem; font-weight: 700; text-transform: uppercase; margin: 0 0 4px 0; color: #1a1a1a; }
.usv__list-meta { font-family: 'Share Tech Mono', monospace; font-size: 0.75rem; color: #999; letter-spacing: 0.05em; }
.usv__list-price { font-family: 'Space Grotesk', sans-serif; font-size: 1.1rem; font-weight: 700; color: #1a1a1a; flex-shrink: 0; }
.usv__list-arrow { font-size: 1.2rem; color: #ccc; transition: color 0.2s; flex-shrink: 0; }
.usv__list-item:hover .usv__list-arrow { color: #1a1a1a; }
@media (max-width: 768px) {
  .usv__list-img { width: 80px; height: 60px; }
  .usv__list-price { font-size: 0.9rem; }
}
`;

const v5Styles = `
.usv--v5 { background: #faf9f6; }
.usv__hero-fullwidth {
  position: relative; height: 50vh; min-height: 350px; overflow: hidden;
}
.usv__hero-fullwidth img { width: 100%; height: 100%; object-fit: cover; }
.usv__hero-fullwidth-content {
  position: absolute; inset: 0;
  background: linear-gradient(to top, rgba(0,0,0,0.6) 0%, transparent 60%);
  display: flex; flex-direction: column; justify-content: flex-end; padding: 4rem;
}
.usv__headline-white {
  font-family: 'Space Grotesk', sans-serif; font-size: clamp(2rem, 5vw, 3.5rem);
  font-weight: 700; text-transform: uppercase; color: #fff; margin: 0;
}
`;

const v6Styles = `
.usv--v6 { background: #ffffff; }
.usv__hero-card-wrap { max-width: 1100px; margin: 0 auto; padding: 40px 2rem; }
.usv__hero-card {
  display: flex; flex-direction: row; flex-wrap: nowrap; align-items: stretch;
  background: #fff; border-radius: 12px; border: 1px solid #e0e0e0;
  box-shadow: 0 4px 12px rgba(0,0,0,0.03); overflow: hidden;
}
.usv__hero-card-img { flex: 0 0 50%; width: 50%; min-height: 280px; }
.usv__hero-card-img img { width: 100%; height: 100%; object-fit: cover; display: block; border-radius: 11px 0 0 11px; }
.usv__hero-card-text {
  flex: 0 0 50%; width: 50%; display: flex; align-items: center; padding: 50px; box-sizing: border-box;
}
.usv__hero-card-text h2 {
  font-family: 'Montserrat', sans-serif; font-size: 2.4rem; font-weight: 800;
  color: #000; line-height: 1.2; letter-spacing: -0.5px; margin: 0; text-transform: uppercase;
}
@media (max-width: 768px) {
  .usv__hero-card { flex-direction: column; }
  .usv__hero-card-img { flex: none; width: 100%; min-height: 250px; }
  .usv__hero-card-img img { border-radius: 11px 11px 0 0; }
  .usv__hero-card-text { flex: none; width: 100%; padding: 25px 30px 35px; }
  .usv__hero-card-text h2 { font-size: 1.5rem; }
}
`;

const v7Styles = `
.usv--v7 { background: #faf9f6; }
.usv__hero-asym {
  display: flex; align-items: stretch; max-width: 1200px; margin: 0 auto; padding: 6rem 2rem; gap: 3rem;
}
.usv__hero-asym-text { flex: 0 0 40%; display: flex; flex-direction: column; justify-content: center; }
.usv__hero-asym-img { flex: 1; border-radius: 8px; overflow: hidden; }
.usv__hero-asym-img img { width: 100%; height: 100%; object-fit: cover; min-height: 400px; }
@media (max-width: 768px) {
  .usv__hero-asym { flex-direction: column; gap: 2rem; padding: 3rem 1rem; }
  .usv__hero-asym-img img { min-height: 250px; }
}
`;

const v8Styles = `
.usv--v8 { background: #faf9f6; }
.usv__hero-centered {
  text-align: center; padding: 6rem 2rem 2rem;
  max-width: 600px; margin: 0 auto;
}
.usv__hero-centered .usv__pre-title { margin-bottom: 1rem; }
.usv__featured-img {
  max-width: 1000px; margin: 0 auto; padding: 0 2rem;
  border-radius: 8px; overflow: hidden;
}
.usv__featured-img img { width: 100%; display: block; border-radius: 8px; box-shadow: 0 20px 60px rgba(0,0,0,0.2); }
`;

const v9Styles = `
.usv--v9 { background: #faf9f6; }
.usv__hero-magazine {
  display: grid; grid-template-columns: 1.2fr 1fr; min-height: 600px;
  max-width: 1200px; margin: 0 auto;
}
.usv__hero-magazine-img { overflow: hidden; }
.usv__hero-magazine-img img { width: 100%; height: 100%; object-fit: cover; }
.usv__hero-magazine-text {
  display: flex; flex-direction: column; justify-content: center;
  padding: 4rem;
}
.usv__hero-magazine-text .usv__coords { margin-top: 2rem; }
@media (max-width: 768px) {
  .usv__hero-magazine { grid-template-columns: 1fr; }
  .usv__hero-magazine-img { height: 300px; }
  .usv__hero-magazine-text { padding: 2rem; }
}
`;

const v10Styles = `
.usv--v10 { background: #faf9f6; }
.usv__hero-tech {
  display: flex; align-items: stretch; max-width: 1200px; margin: 0 auto; padding: 4rem 2rem;
  gap: 3rem; position: relative;
}
.usv__tech-grid-lines {
  position: absolute; inset: 0; pointer-events: none;
  background-image:
    linear-gradient(#e8e6e2 1px, transparent 1px),
    linear-gradient(90deg, #e8e6e2 1px, transparent 1px);
  background-size: 60px 60px;
  opacity: 0.3;
}
.usv__hero-tech-content { flex: 1; position: relative; z-index: 1; display: flex; flex-direction: column; justify-content: center; }
.usv__tech-label {
  font-family: 'Share Tech Mono', monospace; font-size: 0.65rem; letter-spacing: 0.2em;
  text-transform: uppercase; color: #999; margin-bottom: 1rem;
}
.usv__headline-tech {
  font-family: 'Space Grotesk', sans-serif; font-size: clamp(2rem, 4vw, 3rem);
  font-weight: 700; text-transform: uppercase; color: #1a1a1a; margin: 0 0 2rem 0;
}
.usv__tech-stats { display: flex; gap: 2rem; }
.usv__tech-stat { display: flex; flex-direction: column; gap: 4px; }
.usv__tech-stat-num { font-family: 'Share Tech Mono', monospace; font-size: 1.5rem; color: #1a1a1a; }
.usv__tech-stat-label { font-family: 'Share Tech Mono', monospace; font-size: 0.6rem; letter-spacing: 0.1em; text-transform: uppercase; color: #999; }
.usv__hero-tech-img {
  flex: 1; border-radius: 8px; overflow: hidden; position: relative; z-index: 1;
  box-shadow: 0 20px 60px rgba(0,0,0,0.2);
}
.usv__hero-tech-img img { width: 100%; height: 100%; object-fit: cover; min-height: 400px; }
@media (max-width: 768px) {
  .usv__hero-tech { flex-direction: column; gap: 2rem; }
  .usv__hero-tech-img img { min-height: 250px; }
  .usv__tech-stats { flex-wrap: wrap; }
}
`;

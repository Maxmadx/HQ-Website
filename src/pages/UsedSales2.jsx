/**
 * HQ AVIATION - USED AIRCRAFT SALES PAGE V2
 * ==========================================
 * Rebuilt from used-aircraft-2.html + helicopters.css
 * Polished card-based layout with image carousels
 * Typography: Montserrat + Inter
 */

import React, { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion, useInView } from 'framer-motion';
import FooterMinimal from '../components/FooterMinimal';

// ============================================
// DATA
// ============================================

const availableHelicopters = [
  {
    id: 'r66-ghkcc',
    model: 'Robinson R66 Turbine',
    year: 2021,
    registration: 'G-HKCC',
    totalHours: 485,
    condition: 'Excellent',
    priceDisplay: '£995,000',
    images: [
      { url: '/assets/images/used-aircraft/r66/r66-turbine-ghkcc.jpg', alt: 'R66 Turbine G-HKCC' },
      { url: '/assets/images/used-aircraft/r66/chris-r66-alps.jpg', alt: 'R66 Turbine Alps' },
    ],
    status: 'available',
  },
  {
    id: 'r44-grrob',
    model: 'Robinson R44 Raven II',
    year: 2019,
    registration: 'G-RROB',
    totalHours: 890,
    condition: 'Very Good',
    priceDisplay: '£385,000',
    images: [
      { url: '/assets/images/new-aircraft/r44/r44blueprint.jpg', alt: 'R44 Raven II G-RROB' },
    ],
    status: 'available',
  },
  {
    id: 'r66-gnxg',
    model: 'Robinson R66 Turbine',
    year: 2020,
    registration: 'G-NXG1',
    totalHours: 650,
    condition: 'Excellent',
    priceDisplay: '£925,000',
    images: [
      { url: '/assets/images/used-aircraft/r66/chris-r66-alps.jpg', alt: 'R66 Turbine NXG' },
    ],
    status: 'reserved',
  },
  {
    id: 'r44-cadet',
    model: 'Robinson R44 Cadet',
    year: 2022,
    registration: 'G-CADB',
    totalHours: 320,
    condition: 'Excellent',
    priceDisplay: '£345,000',
    images: [
      { url: '/assets/images/new-aircraft/r44/raven-ii-front-alpha.png', alt: 'R44 Cadet' },
    ],
    status: 'available',
  },
  {
    id: 'r44-raven1',
    model: 'Robinson R44 Raven I',
    year: 2017,
    registration: 'G-RAVI',
    totalHours: 1450,
    condition: 'Good',
    priceDisplay: '£295,000',
    images: [
      { url: '/assets/images/new-aircraft/r44/r44blueprint.jpg', alt: 'R44 Raven I' },
    ],
    status: 'available',
  },
];

const soldHelicopters = [
  {
    id: 'sold-r66-1',
    model: 'Robinson R66 Turbine',
    year: 2019,
    images: [
      { url: '/assets/images/used-aircraft/r66/r66-turbine-ghkcc.jpg', alt: 'R66 Turbine Sold' },
    ],
  },
  {
    id: 'sold-r44-1',
    model: 'Robinson R44 Raven II',
    year: 2020,
    images: [
      { url: '/assets/images/new-aircraft/r44/r44blueprint.jpg', alt: 'R44 Raven II Sold' },
    ],
  },
  {
    id: 'sold-r22-1',
    model: 'Robinson R22 Beta II',
    year: 2019,
    images: [
      { url: '/assets/images/new-aircraft/r22/r22-red-volcano-front-alpha-v3.png', alt: 'R22 Beta II Sold' },
    ],
  },
  {
    id: 'sold-r44-2',
    model: 'Robinson R44 Cadet',
    year: 2021,
    images: [
      { url: '/assets/images/new-aircraft/r44/raven-ii-front-alpha.png', alt: 'R44 Cadet Sold' },
    ],
  },
];

// ============================================
// IMAGE CAROUSEL COMPONENT
// ============================================

function ImageCarousel({ images, model }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const hasMultiple = images && images.length > 1;

  if (!images || images.length === 0) {
    return (
      <div className="us2-carousel">
        <div className="us2-carousel__slides">
          <div className="us2-carousel__slide us2-carousel__slide--active">
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
    <div className="us2-carousel">
      <div className="us2-carousel__slides">
        {images.map((img, i) => (
          <div
            key={i}
            className={`us2-carousel__slide ${i === currentIndex ? 'us2-carousel__slide--active' : ''}`}
          >
            <img src={img.url} alt={img.alt || model} loading="lazy" />
          </div>
        ))}
      </div>
      {hasMultiple && (
        <>
          <button
            className="us2-carousel__arrow us2-carousel__arrow--prev"
            onClick={(e) => { e.preventDefault(); e.stopPropagation(); goToSlide(currentIndex - 1); }}
            aria-label="Previous image"
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <polyline points="15 18 9 12 15 6" />
            </svg>
          </button>
          <button
            className="us2-carousel__arrow us2-carousel__arrow--next"
            onClick={(e) => { e.preventDefault(); e.stopPropagation(); goToSlide(currentIndex + 1); }}
            aria-label="Next image"
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <polyline points="9 6 15 12 9 18" />
            </svg>
          </button>
          <div className="us2-carousel__dots">
            {images.map((_, i) => (
              <span
                key={i}
                className={`us2-carousel__dot ${i === currentIndex ? 'us2-carousel__dot--active' : ''}`}
                onClick={(e) => { e.preventDefault(); e.stopPropagation(); goToSlide(i); }}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
}

// ============================================
// HELICOPTER CARD (Available)
// ============================================

function HelicopterCard({ helicopter }) {
  return (
    <Link to={`/sales/pre-owned/${helicopter.id}`} className="us2-card" style={{ textDecoration: 'none', color: 'inherit' }}>
      <div className="us2-card__image">
        <ImageCarousel images={helicopter.images} model={helicopter.model} />
        {helicopter.status === 'reserved' && (
          <span className="us2-badge us2-badge--reserved">Reserved</span>
        )}
      </div>
      <div className="us2-card__content">
        <h3 className="us2-card__title">{helicopter.model}</h3>
        <div className="us2-card__details">
          <span className="us2-card__year">{helicopter.year}</span>
          <span className="us2-card__reg">{helicopter.registration || ''}</span>
        </div>
        <div className="us2-card__specs">
          <div className="us2-card__spec">
            <span className="us2-card__spec-label">Hours</span>
            <span className="us2-card__spec-value">{helicopter.totalHours?.toLocaleString() || 'TBD'}</span>
          </div>
          <div className="us2-card__spec">
            <span className="us2-card__spec-label">Condition</span>
            <span className="us2-card__spec-value">{helicopter.condition || 'Excellent'}</span>
          </div>
        </div>
        <div className="us2-card__price">{helicopter.priceDisplay || 'POA'}</div>
        <span className="us2-card__btn">View Details</span>
      </div>
    </Link>
  );
}

// ============================================
// SOLD CARD
// ============================================

function SoldCard({ helicopter }) {
  return (
    <div className="us2-card us2-card--sold">
      <div className="us2-card__image us2-card__image--sold">
        <ImageCarousel images={helicopter.images} model={helicopter.model} />
        <span className="us2-badge us2-badge--sold">Sold</span>
      </div>
      <div className="us2-card__content us2-card__content--sold">
        <h3 className="us2-card__title us2-card__title--sold">
          {helicopter.model}
          <span className="us2-card__title-divider">—</span>
          <span className="us2-card__title-year">{helicopter.year}</span>
        </h3>
      </div>
    </div>
  );
}

// ============================================
// SECTION HEADER WITH ANIMATED LINE
// ============================================

function SectionHeader({ title, subtitle }) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-50px' });

  return (
    <div className="us2-section-header" ref={ref}>
      <h2 className={`us2-section-header__title ${isInView ? 'us2-section-header__title--visible' : ''}`}>
        {title}
      </h2>
      {subtitle && <p className="us2-section-header__subtitle">{subtitle}</p>}
    </div>
  );
}

// ============================================
// HERO SECTION
// ============================================

function HeroSection() {
  return (
    <div className="us2-hero">
      <div className="us2-hero__card">
        <div className="us2-hero__image">
          <img
            src="/assets/images/facility/main-sales-pic.jpg"
            alt="Pre-Owned Helicopters"
            loading="eager"
          />
        </div>
        <div className="us2-hero__content">
          <h2 className="us2-hero__title">
            Explore Our Current Selection of Available Aircraft
          </h2>
        </div>
      </div>
    </div>
  );
}

// ============================================
// MAIN PAGE
// ============================================

export default function UsedSales2() {
  return (
    <>
      <style>{styles}</style>
      <div className="us2-page">
        {/* Navigation */}
        <nav className="us2-nav">
          <Link to="/" className="us2-nav__logo">
            <img src="/assets/images/logos/hq/hq-aviation-logo-black.png" alt="HQ Aviation" />
          </Link>
          <div className="us2-nav__links">
            <Link to="/sales/new">New Aircraft</Link>
            <Link to="/sales/pre-owned" className="us2-nav__link--active">Pre-Owned</Link>
            <Link to="/maintenance">Maintenance</Link>
            <Link to="/contact">Contact</Link>
          </div>
        </nav>

        {/* Hero */}
        <HeroSection />

        {/* Current Listings */}
        <section className="us2-section">
          <SectionHeader
            title="Current Listings"
            subtitle="Browse our selection of inspected, prepared and ready-to-fly helicopters."
          />
          <div className="us2-grid">
            {availableHelicopters.map((heli) => (
              <HelicopterCard key={heli.id} helicopter={heli} />
            ))}
          </div>
        </section>

        {/* Recently Sold */}
        <section className="us2-section us2-section--sold">
          <SectionHeader
            title="Recently Sold"
          />
          <div className="us2-grid us2-grid--sold">
            {soldHelicopters.map((heli) => (
              <SoldCard key={heli.id} helicopter={heli} />
            ))}
          </div>
        </section>

        {/* CTA */}
        <section className="us2-cta-section">
          <h2 className="us2-cta__title">Looking for a specific aircraft?</h2>
          <p className="us2-cta__text">
            We source pre-owned helicopters worldwide. Tell us what you're looking for
            and our team will find the right aircraft for you.
          </p>
          <Link to="/contact" className="us2-cta__btn">Get in Touch</Link>
        </section>

        <FooterMinimal />
      </div>
    </>
  );
}

// ============================================
// STYLES
// ============================================

const styles = `
@import url('https://fonts.googleapis.com/css2?family=Montserrat:wght@400;500;600;700;800&family=Inter:wght@300;400;500;600&display=swap');

/* Page */
.us2-page {
  background: #ffffff;
  min-height: 100vh;
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
  color: #1a1a1a;
}

/* Navigation */
.us2-nav {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 20px 60px;
  background: #fff;
  border-bottom: 1px solid #f0f0f0;
  position: sticky;
  top: 0;
  z-index: 100;
}

.us2-nav__logo img {
  height: 40px;
}

.us2-nav__links {
  display: flex;
  gap: 30px;
}

.us2-nav__links a {
  text-decoration: none;
  color: #666;
  font-size: 0.9rem;
  font-weight: 500;
  letter-spacing: 0.3px;
  transition: color 0.3s ease;
}

.us2-nav__links a:hover,
.us2-nav__link--active {
  color: #1a1a1a !important;
}

/* Hero */
.us2-hero {
  padding: 60px;
  max-width: 1400px;
  margin: 0 auto;
}

.us2-hero__card {
  display: flex;
  flex-direction: row;
  flex-wrap: nowrap;
  align-items: stretch;
  background: #ffffff;
  border-radius: 12px;
  border: 1px solid #e0e0e0;
  box-shadow: 0 4px 12px rgba(0,0,0,0.03);
  overflow: hidden;
  margin: 40px auto;
  max-width: 1100px;
}

.us2-hero__image {
  flex: 0 0 50%;
  width: 50%;
  min-height: 280px;
  overflow: hidden;
}

.us2-hero__image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
  border-radius: 11px 0 0 11px;
}

.us2-hero__content {
  flex: 0 0 50%;
  width: 50%;
  display: flex;
  align-items: center;
  padding: 50px;
  box-sizing: border-box;
}

.us2-hero__title {
  font-family: 'Montserrat', sans-serif;
  font-size: 2.4rem;
  font-weight: 800;
  color: #000;
  line-height: 1.2;
  text-transform: uppercase;
  letter-spacing: -0.5px;
  margin: 0;
}

/* Sections */
.us2-section {
  max-width: 1400px;
  margin: 0 auto;
  padding: 40px 60px 60px;
}

.us2-section--sold {
  padding-top: 20px;
}

/* Section Header with animated line */
.us2-section-header {
  margin-bottom: 30px;
}

.us2-section-header__title {
  font-family: 'Montserrat', sans-serif;
  font-size: 1.4rem;
  font-weight: 700;
  color: #1a1a1a;
  text-transform: uppercase;
  letter-spacing: 1px;
  display: flex;
  align-items: center;
  white-space: nowrap;
  width: 100%;
  margin: 0 0 8px 0;
}

.us2-section-header__title::after {
  content: '';
  height: 2px;
  margin-left: 30px;
  flex-grow: 1;
  background: linear-gradient(90deg, rgba(0,0,0,0) 0%, rgba(0,0,0,1) 50%, rgba(0,0,0,0) 100%);
  transform-origin: center right;
  transform: scaleX(0);
  opacity: 0;
  transition: transform 1.2s cubic-bezier(0.22, 1, 0.36, 1), opacity 1s ease;
}

.us2-section-header__title--visible::after {
  transform: scaleX(1);
  opacity: 1;
}

.us2-section-header__subtitle {
  font-size: 0.95rem;
  color: #888;
  margin: 0;
  font-weight: 400;
}

/* Grid */
.us2-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(340px, 1fr));
  gap: 30px;
  padding: 20px 0;
}

.us2-grid--sold {
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
}

/* =============================================
   HELICOPTER CARD
   ============================================= */
.us2-card {
  background: #ffffff;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
  transition: transform 0.3s ease, box-shadow 0.3s ease;
  border: 1px solid #e8e8e8;
  display: flex;
  flex-direction: column;
}

.us2-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 12px 40px rgba(0, 0, 0, 0.12);
}

.us2-card--sold {
  opacity: 0.85;
  pointer-events: none;
  cursor: default;
}

.us2-card--sold:hover {
  transform: none;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
}

/* Card Image */
.us2-card__image {
  position: relative;
  width: 100%;
  height: 220px;
  overflow: hidden;
  background: #f5f5f5;
}

.us2-card__image--sold {
  height: 180px;
}

.us2-card__image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.5s ease;
}

.us2-card:hover .us2-card__image img {
  transform: scale(1.05);
}

.us2-card--sold:hover .us2-card__image img {
  transform: none;
}

/* Badges */
.us2-badge {
  position: absolute;
  top: 15px;
  right: 15px;
  padding: 6px 14px;
  font-size: 0.75rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  border-radius: 4px;
  z-index: 20;
}

.us2-badge--reserved {
  background: #ff9800;
  color: #fff;
}

.us2-badge--sold {
  position: absolute;
  top: auto;
  bottom: 15px;
  left: 15px;
  right: auto;
  background: #1a1a1a;
  color: #fff;
  border-radius: 4px;
  padding: 8px 14px;
  font-weight: 600;
  font-size: 0.7rem;
  letter-spacing: 1.5px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.3);
}

/* Card Content */
.us2-card__content {
  padding: 25px;
}

.us2-card__content--sold {
  padding: 20px;
}

.us2-card__title {
  font-family: 'Montserrat', sans-serif;
  font-size: 1.25rem;
  font-weight: 700;
  color: #1a1a1a;
  margin: 0 0 10px 0;
  text-transform: uppercase;
  letter-spacing: -0.3px;
}

.us2-card__title--sold {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  margin-bottom: 0;
}

.us2-card__title-divider {
  font-weight: 400;
  color: #999;
  margin: 0 8px;
}

.us2-card__title-year {
  font-weight: 500;
  font-size: 1rem;
  color: #666;
}

.us2-card__details {
  display: flex;
  gap: 15px;
  margin-bottom: 15px;
  font-size: 0.9rem;
  color: #666;
}

.us2-card__year {
  font-weight: 600;
  color: #333;
}

.us2-card__reg {
  color: #888;
}

/* Specs Grid */
.us2-card__specs {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 12px;
  padding: 15px 0;
  border-top: 1px solid #eee;
  border-bottom: 1px solid #eee;
  margin-bottom: 15px;
}

.us2-card__spec {
  display: flex;
  flex-direction: column;
  gap: 3px;
}

.us2-card__spec-label {
  font-size: 0.7rem;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  color: #999;
  font-weight: 600;
}

.us2-card__spec-value {
  font-size: 0.95rem;
  font-weight: 600;
  color: #333;
}

/* Price */
.us2-card__price {
  font-family: 'Montserrat', sans-serif;
  font-size: 1.4rem;
  font-weight: 800;
  color: #000;
  margin-bottom: 15px;
}

/* CTA Button */
.us2-card__btn {
  display: block;
  width: 100%;
  box-sizing: border-box;
  padding: 14px 20px;
  background: #1a1a1a;
  color: #fff;
  text-align: center;
  text-decoration: none;
  font-size: 0.85rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 1px;
  border-radius: 6px;
  transition: background 0.3s ease;
}

.us2-card__btn:hover {
  background: #c00;
}

/* =============================================
   IMAGE CAROUSEL
   ============================================= */
.us2-carousel {
  position: relative;
  width: 100%;
  height: 100%;
}

.us2-carousel__slides {
  position: relative;
  width: 100%;
  height: 100%;
  overflow: hidden;
}

.us2-carousel__slide {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  opacity: 0;
  transition: opacity 0.4s ease;
}

.us2-carousel__slide--active {
  opacity: 1;
  z-index: 1;
}

.us2-carousel__slide img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

/* Carousel Arrows */
.us2-carousel__arrow {
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  z-index: 10;
  width: 36px;
  height: 36px;
  background: rgba(255, 255, 255, 0.9);
  border: none;
  border-radius: 50%;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  opacity: 0;
  transition: opacity 0.3s ease, background 0.3s ease, transform 0.2s ease;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
}

.us2-card:hover .us2-carousel__arrow {
  opacity: 1;
}

.us2-carousel__arrow:hover {
  background: #fff;
  transform: translateY(-50%) scale(1.1);
}

.us2-carousel__arrow:active {
  transform: translateY(-50%) scale(0.95);
}

.us2-carousel__arrow svg {
  width: 20px;
  height: 20px;
  stroke: #333;
}

.us2-carousel__arrow--prev {
  left: 10px;
}

.us2-carousel__arrow--next {
  right: 10px;
}

/* Carousel Dots */
.us2-carousel__dots {
  position: absolute;
  bottom: 12px;
  left: 50%;
  transform: translateX(-50%);
  z-index: 10;
  display: flex;
  gap: 8px;
  padding: 6px 10px;
  background: rgba(0, 0, 0, 0.4);
  border-radius: 20px;
}

.us2-carousel__dot {
  width: 8px;
  height: 8px;
  background: rgba(255, 255, 255, 0.5);
  border-radius: 50%;
  cursor: pointer;
  transition: background 0.3s ease, transform 0.2s ease;
}

.us2-carousel__dot:hover {
  background: rgba(255, 255, 255, 0.8);
}

.us2-carousel__dot--active {
  background: #fff;
  transform: scale(1.2);
}

/* Sold card dark overlay on image */
.us2-card--sold .us2-card__image::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 3px;
  background: rgba(0, 0, 0, 0.2);
  z-index: 15;
}

/* =============================================
   CTA SECTION
   ============================================= */
.us2-cta-section {
  text-align: center;
  padding: 80px 60px;
  max-width: 700px;
  margin: 0 auto;
}

.us2-cta__title {
  font-family: 'Montserrat', sans-serif;
  font-size: 2rem;
  font-weight: 700;
  color: #1a1a1a;
  margin: 0 0 15px 0;
}

.us2-cta__text {
  font-size: 1rem;
  color: #666;
  line-height: 1.7;
  margin: 0 0 30px 0;
}

.us2-cta__btn {
  display: inline-block;
  padding: 16px 40px;
  background: #1a1a1a;
  color: #fff;
  text-decoration: none;
  font-family: 'Montserrat', sans-serif;
  font-weight: 600;
  font-size: 0.85rem;
  letter-spacing: 1px;
  text-transform: uppercase;
  border-radius: 6px;
  transition: all 0.3s ease;
}

.us2-cta__btn:hover {
  background: #c00;
  transform: translateY(-2px);
  box-shadow: 0 8px 20px rgba(0,0,0,0.15);
}

/* =============================================
   RESPONSIVE
   ============================================= */
@media (max-width: 768px) {
  .us2-nav {
    padding: 15px 20px;
  }
  .us2-nav__links {
    display: none;
  }
  .us2-hero {
    padding: 20px;
  }
  .us2-hero__card {
    flex-direction: column;
    margin: 20px auto;
  }
  .us2-hero__image {
    flex: none;
    width: 100%;
    min-height: 250px;
  }
  .us2-hero__image img {
    border-radius: 11px 11px 0 0;
  }
  .us2-hero__content {
    flex: none;
    width: 100%;
    padding: 25px 30px 35px;
  }
  .us2-hero__title {
    font-size: 1.5rem;
  }
  .us2-section {
    padding: 30px 20px 40px;
  }
  .us2-grid {
    grid-template-columns: 1fr;
    gap: 20px;
  }
  .us2-grid--sold {
    grid-template-columns: 1fr 1fr;
  }
  .us2-card__image {
    height: 200px;
  }
  .us2-card__content {
    padding: 20px;
  }
  .us2-card__title {
    font-size: 1.1rem;
  }
  .us2-card__price {
    font-size: 1.2rem;
  }
  .us2-carousel__arrow {
    width: 32px;
    height: 32px;
    opacity: 0.8;
  }
  .us2-carousel__arrow svg {
    width: 16px;
    height: 16px;
  }
  .us2-carousel__arrow--prev {
    left: 8px;
  }
  .us2-carousel__arrow--next {
    right: 8px;
  }
  .us2-carousel__dots {
    bottom: 8px;
    padding: 4px 8px;
    gap: 6px;
  }
  .us2-carousel__dot {
    width: 6px;
    height: 6px;
  }
  .us2-cta-section {
    padding: 60px 20px;
  }
  .us2-cta__title {
    font-size: 1.5rem;
  }
}

@media (max-width: 480px) {
  .us2-grid--sold {
    grid-template-columns: 1fr;
  }
}
`;

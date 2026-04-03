/**
 * HQ AVIATION - USED AIRCRAFT DETAIL PAGE
 * ========================================
 * Converted from listing-template.html
 * Split-panel layout: sticky gallery left, scrollable details right
 */

import React, { useState, useEffect, useCallback } from 'react';
import { Link, useParams } from 'react-router-dom';
import Header from '../components/Header';

// ============================================
// INVENTORY DATA (shared with UsedSales)
// ============================================

const usedInventory = [
  {
    id: 'r66-ghkcc', model: 'R66 Turbine', year: 2021, hours: 485, price: '£995,000',
    status: 'Available', registration: 'G-HKCC', engine: 'RR300', serial: 'R66-0892',
    remainingHours: 1515, remainingLife: '9 Years',
    images: [
      '/assets/images/used-aircraft/r66/r66-turbine-ghkcc.jpg',
      '/assets/images/new-aircraft/r66/blue-r66-palo-verde-left-v4.png',
      '/assets/images/used-aircraft/r66/chris-r66-alps.jpg',
    ],
    equipment: ['Garmin G500H', 'Leather Interior', 'Air Conditioning', 'Pop-Out Floats', 'Corrosion Protection', 'Auxiliary Fuel System', 'Heated Pitot Tube', 'USB Ports'],
    description: 'A superb example of a Robinson R66 Turbine in excellent condition. Low hours, fully maintained by HQ Aviation since new. Finished in a stunning dark metallic livery with leather interior throughout.',
  },
  {
    id: 'r44-grrob', model: 'R44 Raven II', year: 2019, hours: 890, price: '£385,000',
    status: 'Available', registration: 'G-RAVX', engine: 'IO-540', serial: 'R44-14521',
    remainingHours: 1310, remainingLife: '6 Years',
    images: [
      '/assets/images/new-aircraft/r44/r44blueprint.jpg',
      '/assets/images/new-aircraft/r44/raven-ii-front-alpha.png',
    ],
    equipment: ['Garmin GTN 650', 'Blade Tie-Downs', 'Ground Handling Wheels', 'Corrosion Protection', 'Leather Seats', 'Heated Pitot Tube'],
    description: 'Well-maintained R44 Raven II with Garmin GTN 650 and low airframe hours. Full logbooks available, maintained by HQ Aviation throughout its life.',
  },
  {
    id: 'r66-gnxg', model: 'R66 Turbine', year: 2020, hours: 650, price: '£925,000',
    status: 'Under Offer', registration: 'G-NXG1', engine: 'RR300', serial: 'R66-0756',
    remainingHours: 1350, remainingLife: '8 Years',
    images: [
      '/assets/images/used-aircraft/r66/chris-r66-alps.jpg',
      '/assets/images/new-aircraft/r66/blue-r66-palo-verde-left-v4.png',
    ],
    equipment: ['NXG Package', 'Pop-Out Floats', 'Enhanced Avionics', 'Garmin G500H', 'SAS Autopilot', 'Auxiliary Fuel System', '5-Point Harness', 'Halon Fire Extinguisher'],
    description: 'Robinson R66 Turbine with the full NXG package. Enhanced avionics suite, pop-out floats and SAS autopilot. Currently under offer — contact us for similar aircraft.',
  },
  {
    id: 'r44-cadet', model: 'R44 Cadet', year: 2022, hours: 320, price: '£345,000',
    status: 'Available', registration: 'G-CDTX', engine: 'IO-540', serial: 'R44-31205',
    remainingHours: 1880, remainingLife: '10 Years',
    images: [
      '/assets/images/new-aircraft/r44/raven-ii-front-alpha.png',
      '/assets/images/new-aircraft/r44/r44blueprint.jpg',
    ],
    equipment: ['Training Configuration', 'Dual Controls', 'Extended Range', 'Corrosion Protection', 'Ground Handling Wheels'],
    description: 'Low-time R44 Cadet in training configuration. Perfect for flight schools or individual owners seeking a cost-effective, two-seat helicopter with excellent performance.',
  },
  {
    id: 'r22-gbxii', model: 'R22 Beta II', year: 2018, hours: 1200, price: '£165,000',
    status: 'Sold', registration: 'G-BXII', engine: 'O-360', serial: 'R22-4892',
    remainingHours: 1000, remainingLife: '3 Years',
    images: [
      '/assets/images/new-aircraft/r22/r22-red-volcano-front-alpha-v3.png',
    ],
    equipment: ['Training Ready', 'Low Time Engine', 'Fresh Annual', 'Dual Controls'],
    description: 'R22 Beta II with fresh annual inspection and low-time engine. Ideal training helicopter.',
  },
  {
    id: 'r44-raven1', model: 'R44 Raven I', year: 2017, hours: 1450, price: '£295,000',
    status: 'Available', registration: 'G-RVNI', engine: 'O-540', serial: 'R44-12087',
    remainingHours: 750, remainingLife: '4 Years',
    images: [
      '/assets/images/new-aircraft/r44/r44blueprint.jpg',
      '/assets/images/new-aircraft/r44/raven-ii-front-alpha.png',
    ],
    equipment: ['Recent Overhaul', 'New Paint', 'Leather Seats', 'Garmin GTN 650', 'Corrosion Protection', 'Ground Handling Wheels'],
    description: 'Recently overhauled R44 Raven I with new paint and leather interior. Excellent value for a well-presented, fully serviced helicopter.',
  },
];

// ============================================
// STYLES
// ============================================

const styles = `
/* ========================================
   USED AIRCRAFT DETAIL PAGE
   ======================================== */

.uad-page {
  font-family: 'Space Grotesk', -apple-system, sans-serif;
  background: #fff;
  color: #1a1a1a;
  line-height: 1.6;
  -webkit-font-smoothing: antialiased;
}
.uad-page .Header-breadcrumb {
  display: none;
}

.uad-wrapper {
  display: flex;
  min-height: 100vh;
  padding-top: 60px;
}

/* Left Column */
.uad-left {
  width: 45%;
  max-width: 600px;
  position: sticky;
  top: 60px;
  height: calc(100vh - 60px);
  display: flex;
  flex-direction: column;
  border-right: 1px solid #eee;
}

.uad-back {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  color: #888;
  text-decoration: none;
  font-size: 0.75rem;
  padding: 20px 30px;
  text-transform: uppercase;
  letter-spacing: 0.1em;
  font-weight: 500;
  font-family: 'Share Tech Mono', monospace;
}
.uad-back:hover { color: #1a1a1a; }

.uad-image-section {
  flex: 1;
  display: flex;
  flex-direction: column;
}

/* Carousel */
.uad-main-image {
  flex: 0 0 auto;
  height: 45vh;
  overflow: hidden;
  margin: 0 30px;
  position: relative;
}

.uad-carousel {
  position: relative;
  width: 100%;
  height: 100%;
}

.uad-slide {
  position: absolute;
  top: 0; left: 0;
  width: 100%; height: 100%;
  opacity: 0;
  transition: opacity 0.4s ease;
  display: flex;
  align-items: center;
  justify-content: center;
}

.uad-slide--active {
  opacity: 1;
  z-index: 1;
}

.uad-slide img {
  max-width: 100%;
  max-height: 100%;
  object-fit: contain;
  cursor: pointer;
}

.uad-arrow {
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  z-index: 10;
  width: 36px; height: 36px;
  background: rgba(255,255,255,0.95);
  border: none;
  border-radius: 50%;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  opacity: 0;
  transition: opacity 0.3s, transform 0.2s;
  box-shadow: 0 2px 8px rgba(0,0,0,0.15);
}

.uad-main-image:hover .uad-arrow { opacity: 1; }
.uad-arrow:hover { transform: translateY(-50%) scale(1.1); }
.uad-arrow svg { width: 18px; height: 18px; stroke: #333; stroke-width: 2; fill: none; }
.uad-arrow--prev { left: 12px; }
.uad-arrow--next { right: 12px; }

.uad-dots {
  position: absolute;
  bottom: 12px;
  left: 50%;
  transform: translateX(-50%);
  z-index: 10;
  display: flex;
  gap: 6px;
  padding: 6px 10px;
  background: rgba(0,0,0,0.5);
  border-radius: 20px;
}

.uad-dot {
  width: 7px; height: 7px;
  background: rgba(255,255,255,0.4);
  border-radius: 50%;
  cursor: pointer;
  transition: all 0.3s;
  border: none;
  padding: 0;
}
.uad-dot:hover { background: rgba(255,255,255,0.7); }
.uad-dot--active { background: #fff; transform: scale(1.3); }

/* Thumbnails */
.uad-thumbs {
  display: flex;
  justify-content: center;
  gap: 8px;
  padding: 16px 30px;
}

.uad-thumb {
  width: 65px; height: 45px;
  overflow: hidden;
  cursor: pointer;
  opacity: 0.4;
  transition: all 0.2s;
  border: 2px solid transparent;
}
.uad-thumb:hover, .uad-thumb--active { opacity: 1; border-color: #1a1a1a; }
.uad-thumb img { width: 100%; height: 100%; object-fit: cover; }

/* About */
.uad-about {
  flex: 1;
  padding: 20px 30px 30px;
  background: #faf9f6;
  border-top: 1px solid #eee;
  overflow-y: auto;
}

.uad-about-label {
  font-family: 'Share Tech Mono', monospace;
  font-size: 0.6rem;
  text-transform: uppercase;
  letter-spacing: 0.15em;
  color: #999;
  margin-bottom: 10px;
  font-weight: 600;
}

.uad-about-text {
  font-size: 0.9rem;
  line-height: 1.8;
  color: #555;
}

/* Right Column */
.uad-right {
  flex: 1;
  overflow-y: auto;
  padding: 40px 50px 80px;
}

/* Header */
.uad-header { margin-bottom: 30px; }

.uad-model {
  font-size: clamp(1.6rem, 3vw, 2.2rem);
  font-weight: 700;
  letter-spacing: -0.5px;
  margin-bottom: 10px;
  text-transform: uppercase;
}

.uad-meta {
  display: flex;
  gap: 16px;
  color: #666;
  font-size: 0.85rem;
  margin-bottom: 12px;
  font-family: 'Share Tech Mono', monospace;
}

.uad-badge {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 5px 12px;
  font-size: 0.6rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.1em;
  font-family: 'Share Tech Mono', monospace;
}

.uad-badge--available { background: #f0fdf4; color: #166534; }
.uad-badge--available::before { content: ''; width: 5px; height: 5px; background: #22c55e; border-radius: 50%; }
.uad-badge--under-offer { background: #fffbeb; color: #92400e; }
.uad-badge--sold { background: #fef2f2; color: #991b1b; }

/* Price */
.uad-price-section {
  display: flex;
  align-items: baseline;
  gap: 12px;
  padding-top: 18px;
  border-top: 1px solid #eee;
  margin-bottom: 25px;
}

.uad-price {
  font-family: 'Share Tech Mono', monospace;
  font-size: 1.6rem;
  font-weight: 700;
}

.uad-price-note { font-size: 0.75rem; color: #888; }

/* Section Titles */
.uad-section-title {
  font-size: 0.65rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.15em;
  color: #999;
  margin-bottom: 16px;
  display: flex;
  align-items: center;
  gap: 12px;
  font-family: 'Share Tech Mono', monospace;
}
.uad-section-title::after { content: ''; flex: 1; height: 1px; background: #eee; }

/* Specs */
.uad-specs { margin-bottom: 35px; }

.uad-specs-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  border: 1px solid #eee;
  overflow: hidden;
}

.uad-spec {
  padding: 14px 16px;
  background: #faf9f6;
  border-bottom: 1px solid #eee;
  border-right: 1px solid #eee;
}
.uad-spec:nth-child(even) { border-right: none; }
.uad-spec:nth-last-child(-n+2) { border-bottom: none; }

.uad-spec-label {
  font-family: 'Share Tech Mono', monospace;
  font-size: 0.6rem;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  color: #888;
  margin-bottom: 3px;
}

.uad-spec-value { font-size: 0.9rem; font-weight: 600; }

/* Equipment */
.uad-equipment { margin-bottom: 35px; }

.uad-equipment-list {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.uad-equipment-item {
  display: flex;
  align-items: center;
  gap: 7px;
  padding: 8px 14px;
  background: #faf9f6;
  font-size: 0.8rem;
  color: #444;
  border: 1px solid #eee;
}
.uad-equipment-item::before {
  content: '\\2713';
  color: #22c55e;
  font-weight: bold;
  font-size: 0.75rem;
}

/* Register Interest */
.uad-register {
  background: #faf9f6;
  padding: 24px;
  margin-top: 25px;
  border: 1px solid #e8e6e2;
}

.uad-register-header {
  display: flex;
  align-items: flex-start;
  gap: 14px;
  margin-bottom: 18px;
}

.uad-register-icon {
  width: 40px; height: 40px;
  background: #1a1a1a;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}
.uad-register-icon svg { width: 18px; height: 18px; stroke: #fff; }

.uad-register-title { font-size: 0.9rem; font-weight: 600; margin-bottom: 4px; }
.uad-register-subtitle { font-size: 0.8rem; color: #666; }

/* Call */
.uad-call {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px 16px;
  background: #fff;
  margin-bottom: 14px;
  border: 1px solid #e8e6e2;
}

.uad-call-icon {
  width: 34px; height: 34px;
  background: #f0fdf4;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}
.uad-call-icon svg { width: 15px; height: 15px; stroke: #22c55e; }

.uad-call-label {
  font-family: 'Share Tech Mono', monospace;
  font-size: 0.6rem;
  text-transform: uppercase;
  letter-spacing: 0.1em;
  color: #888;
  margin-bottom: 2px;
}
.uad-call-number {
  font-size: 0.95rem;
  font-weight: 600;
  color: #1a1a1a;
  text-decoration: none;
}
.uad-call-number:hover { color: #22c55e; }

.uad-divider-or {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 14px;
  color: #999;
  font-size: 0.7rem;
}
.uad-divider-or::before, .uad-divider-or::after { content: ''; flex: 1; height: 1px; background: #ddd; }

.uad-form {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 10px;
}

.uad-form input, .uad-form textarea {
  padding: 11px 14px;
  border: 1px solid #ddd;
  font-size: 0.85rem;
  font-family: inherit;
  background: #fff;
}
.uad-form input:focus, .uad-form textarea:focus { outline: none; border-color: #1a1a1a; }
.uad-form .uad-form--full { grid-column: 1 / -1; }
.uad-form textarea { grid-column: 1 / -1; min-height: 70px; resize: vertical; }

.uad-form button {
  grid-column: 1 / -1;
  padding: 13px 24px;
  background: #1a1a1a;
  color: #fff;
  border: none;
  font-size: 0.75rem;
  font-weight: 600;
  font-family: inherit;
  text-transform: uppercase;
  letter-spacing: 0.1em;
  cursor: pointer;
}
.uad-form button:hover { background: #333; }

/* Lightbox */
.uad-lightbox {
  position: fixed;
  top: 0; left: 0;
  width: 100%; height: 100%;
  background: rgba(0,0,0,0.92);
  z-index: 10000;
  display: flex;
  align-items: center;
  justify-content: center;
}

.uad-lightbox img {
  max-width: 90vw;
  max-height: 90vh;
  object-fit: contain;
}

.uad-lightbox-close {
  position: absolute;
  top: 20px; right: 20px;
  width: 44px; height: 44px;
  background: rgba(255,255,255,0.1);
  border: none; border-radius: 50%;
  cursor: pointer;
  display: flex; align-items: center; justify-content: center;
}
.uad-lightbox-close:hover { background: rgba(255,255,255,0.2); }
.uad-lightbox-close svg { width: 22px; height: 22px; stroke: #fff; stroke-width: 2; }

.uad-lightbox-nav {
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  width: 44px; height: 44px;
  background: rgba(255,255,255,0.1);
  border: none; border-radius: 50%;
  cursor: pointer;
  display: flex; align-items: center; justify-content: center;
}
.uad-lightbox-nav:hover { background: rgba(255,255,255,0.2); }
.uad-lightbox-nav svg { width: 22px; height: 22px; stroke: #fff; stroke-width: 2; fill: none; }
.uad-lightbox-prev { left: 20px; }
.uad-lightbox-next { right: 20px; }

/* Responsive */
@media (max-width: 900px) {
  .uad-wrapper { flex-direction: column; padding-top: 50px; }
  .uad-left {
    width: 100%;
    max-width: none;
    height: auto;
    position: relative;
    top: 0;
    border-right: none;
    border-bottom: 1px solid #eee;
  }
  .uad-back { display: none; }
  .uad-main-image { height: 35vh; min-height: 250px; margin: 0 20px; }
  .uad-image-section { flex: 0 0 auto; }
  .uad-about { flex: 0 0 auto; }
  .uad-right { padding: 30px 25px 60px; }
  .uad-model { font-size: 1.5rem; }
  .uad-specs-grid { grid-template-columns: 1fr; }
  .uad-spec { border-right: none !important; }
  .uad-form { grid-template-columns: 1fr; }
}

@media (max-width: 480px) {
  .uad-main-image { height: 30vh; min-height: 200px; margin: 0 15px; }
  .uad-thumbs { padding: 12px 15px; }
  .uad-thumb { width: 50px; height: 36px; }
}
`;

// ============================================
// COMPONENT
// ============================================

function UsedAircraftDetail() {
  const { id } = useParams();
  const aircraft = usedInventory.find(a => a.id === id);

  const [currentSlide, setCurrentSlide] = useState(0);
  const [lightboxOpen, setLightboxOpen] = useState(false);

  const goToSlide = useCallback((index) => {
    if (!aircraft) return;
    const len = aircraft.images.length;
    setCurrentSlide(((index % len) + len) % len);
  }, [aircraft]);

  // Keyboard nav for lightbox
  useEffect(() => {
    if (!lightboxOpen) return;
    const handleKey = (e) => {
      if (e.key === 'Escape') setLightboxOpen(false);
      if (e.key === 'ArrowLeft') goToSlide(currentSlide - 1);
      if (e.key === 'ArrowRight') goToSlide(currentSlide + 1);
    };
    document.addEventListener('keydown', handleKey);
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', handleKey);
      document.body.style.overflow = '';
    };
  }, [lightboxOpen, currentSlide, goToSlide]);

  if (!aircraft) {
    return (
      <div className="uad-page" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '100vh' }}>
        <style>{styles}</style>
        <div style={{ textAlign: 'center' }}>
          <h2>Aircraft Not Found</h2>
          <p style={{ color: '#666', margin: '1rem 0' }}>This listing may no longer be available.</p>
          <Link to="/sales/pre-owned" className="uad-back" style={{ display: 'inline-flex' }}>&larr; Back to Listings</Link>
        </div>
      </div>
    );
  }

  const badgeClass = aircraft.status === 'Available' ? 'uad-badge--available'
    : aircraft.status === 'Under Offer' ? 'uad-badge--under-offer' : 'uad-badge--sold';

  return (
    <div className="uad-page">
      <style>{styles}</style>
      <Header />

      <div className="uad-wrapper">
        {/* Left Column - Sticky Image & About */}
        <div className="uad-left">
          <Link to="/sales/pre-owned" className="uad-back">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <polyline points="15 18 9 12 15 6" />
            </svg>
            Back to Listings
          </Link>
          <div className="uad-image-section">
            <div className="uad-main-image">
              <div className="uad-carousel">
                {aircraft.images.map((img, i) => (
                  <div
                    key={i}
                    className={`uad-slide ${i === currentSlide ? 'uad-slide--active' : ''}`}
                    onClick={() => setLightboxOpen(true)}
                  >
                    <img src={img} alt={`${aircraft.model} - ${i + 1}`} />
                  </div>
                ))}

                {aircraft.images.length > 1 && (
                  <>
                    <button className="uad-arrow uad-arrow--prev" onClick={(e) => { e.stopPropagation(); goToSlide(currentSlide - 1); }}>
                      <svg viewBox="0 0 24 24"><polyline points="15 18 9 12 15 6" /></svg>
                    </button>
                    <button className="uad-arrow uad-arrow--next" onClick={(e) => { e.stopPropagation(); goToSlide(currentSlide + 1); }}>
                      <svg viewBox="0 0 24 24"><polyline points="9 6 15 12 9 18" /></svg>
                    </button>

                    <div className="uad-dots">
                      {aircraft.images.map((_, i) => (
                        <button key={i} className={`uad-dot ${i === currentSlide ? 'uad-dot--active' : ''}`} onClick={(e) => { e.stopPropagation(); goToSlide(i); }} />
                      ))}
                    </div>
                  </>
                )}
              </div>
            </div>

            {aircraft.images.length > 1 && (
              <div className="uad-thumbs">
                {aircraft.images.map((img, i) => (
                  <div key={i} className={`uad-thumb ${i === currentSlide ? 'uad-thumb--active' : ''}`} onClick={() => goToSlide(i)}>
                    <img src={img} alt="" />
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="uad-about">
            <div className="uad-about-label">About This Aircraft</div>
            <p className="uad-about-text">{aircraft.description}</p>
          </div>
        </div>

        {/* Right Column - Scrollable */}
        <div className="uad-right">
          <header className="uad-header">
            <h1 className="uad-model">{aircraft.model}</h1>
            <div className="uad-meta">
              <span>{aircraft.year}</span>
              <span>{aircraft.registration}</span>
              <span>{aircraft.hours.toLocaleString()} Total Hours</span>
            </div>
            <div className={`uad-badge ${badgeClass}`}>{aircraft.status}</div>
          </header>

          <div className="uad-price-section">
            <div className="uad-price">{aircraft.price}</div>
            <div className="uad-price-note">Excluding VAT</div>
          </div>

          <div className="uad-specs">
            <div className="uad-section-title">Specifications</div>
            <div className="uad-specs-grid">
              <div className="uad-spec">
                <div className="uad-spec-label">Year</div>
                <div className="uad-spec-value">{aircraft.year}</div>
              </div>
              <div className="uad-spec">
                <div className="uad-spec-label">Registration</div>
                <div className="uad-spec-value">{aircraft.registration}</div>
              </div>
              <div className="uad-spec">
                <div className="uad-spec-label">Engine</div>
                <div className="uad-spec-value">{aircraft.engine}</div>
              </div>
              <div className="uad-spec">
                <div className="uad-spec-label">Serial</div>
                <div className="uad-spec-value">{aircraft.serial}</div>
              </div>
              <div className="uad-spec">
                <div className="uad-spec-label">Remaining Hours</div>
                <div className="uad-spec-value">{aircraft.remainingHours?.toLocaleString()}</div>
              </div>
              <div className="uad-spec">
                <div className="uad-spec-label">Remaining Life</div>
                <div className="uad-spec-value">{aircraft.remainingLife}</div>
              </div>
            </div>
          </div>

          <div className="uad-equipment">
            <div className="uad-section-title">Equipment &amp; Features</div>
            <div className="uad-equipment-list">
              {aircraft.equipment.map((item, i) => (
                <div key={i} className="uad-equipment-item">{item}</div>
              ))}
            </div>
          </div>

          <div className="uad-register">
            <div className="uad-register-header">
              <div className="uad-register-icon">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M22 17H2a3 3 0 0 0 3-3V9a7 7 0 0 1 14 0v5a3 3 0 0 0 3 3zm-8.27 4a2 2 0 0 1-3.46 0" />
                </svg>
              </div>
              <div>
                <div className="uad-register-title">Register Your Interest</div>
                <div className="uad-register-subtitle">Get in touch about this aircraft and similar listings</div>
              </div>
            </div>

            <div className="uad-call">
              <div className="uad-call-icon">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
                </svg>
              </div>
              <div>
                <div className="uad-call-label">Call Our Sales Team</div>
                <a href="tel:+441895833838" className="uad-call-number">+44 (0) 1895 833 838</a>
              </div>
            </div>

            <div className="uad-divider-or">or send an enquiry</div>

            <form className="uad-form" onSubmit={(e) => e.preventDefault()}>
              <input type="text" placeholder="First name" required />
              <input type="text" placeholder="Last name" required />
              <input type="email" placeholder="Email address" required className="uad-form--full" />
              <input type="tel" placeholder="Phone number" className="uad-form--full" />
              <textarea placeholder={`Tell us about your interest in this ${aircraft.model}...`} />
              <button type="submit">Submit Enquiry</button>
            </form>
          </div>
        </div>
      </div>

      {/* Lightbox */}
      {lightboxOpen && (
        <div className="uad-lightbox" onClick={() => setLightboxOpen(false)}>
          <button className="uad-lightbox-close" onClick={() => setLightboxOpen(false)}>
            <svg viewBox="0 0 24 24" fill="none"><line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" /></svg>
          </button>
          {aircraft.images.length > 1 && (
            <>
              <button className="uad-lightbox-nav uad-lightbox-prev" onClick={(e) => { e.stopPropagation(); goToSlide(currentSlide - 1); }}>
                <svg viewBox="0 0 24 24"><polyline points="15 18 9 12 15 6" /></svg>
              </button>
              <button className="uad-lightbox-nav uad-lightbox-next" onClick={(e) => { e.stopPropagation(); goToSlide(currentSlide + 1); }}>
                <svg viewBox="0 0 24 24"><polyline points="9 6 15 12 9 18" /></svg>
              </button>
            </>
          )}
          <img src={aircraft.images[currentSlide]} alt={aircraft.model} onClick={(e) => e.stopPropagation()} />
        </div>
      )}
    </div>
  );
}

export default UsedAircraftDetail;

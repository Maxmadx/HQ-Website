/**
 * ArrivalSection — "The Arrival"
 * Combined Location + Testimonials component.
 * Concept: arriving at HQ Aviation — you see the place,
 * and all around you are the voices of people who've been there.
 * Location and social proof woven into one experience.
 */

import { useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, useInView } from 'framer-motion';
import { useCollection } from '../hooks/useFirestore';
import { usePricing } from '../hooks/usePricing';



const contactDetails = [
  { icon: 'fas fa-map-marker-alt', label: 'Address', text: 'Hangar E, Denham Aerodrome', text2: 'Uxbridge, London, UB9 5DF' },
  { icon: 'fas fa-phone-alt', label: 'Operations', text: '+44 1895 833373', href: 'tel:+441895833373' },
  { icon: 'fas fa-wrench', label: 'Maintenance', text: '+44 1895 832833', href: 'tel:+441895832833' },
  { icon: 'fas fa-envelope', label: 'Email', text: 'Operations@HQAviation.com', href: 'mailto:Operations@HQAviation.com' },
  { icon: 'fas fa-clock', label: 'Hours', text: 'Monday – Sunday', text2: '09:00 – 17:00' },
];

const MAPS_SRC = "https://maps.google.com/maps?q=HQ+Aviation,+Denham+Aerodrome,+UB9+5DF&ll=51.578,0.25&t=&z=9&ie=UTF8&iwloc=&output=embed";

/* ── Component ── */
export default function ArrivalSection() {
  const reviewTrackRef = useRef(null);
  const [reviewIdx, setReviewIdx] = useState(0);
  const [pricingTab, setPricingTab] = useState('discovery');
  const [pricingOpen, setPricingOpen] = useState(false);
  const { fmt } = usePricing();

  const pricingTabs = [
    { id: 'discovery', label: 'Discovery Experience' },
    { id: 'dual', label: 'Dual Training' },
    { id: 'hire', label: 'Self-Fly Hire' },
    { id: 'advanced', label: 'Advanced Training with Q' },
  ];
  const tabIndex = pricingTabs.findIndex(t => t.id === pricingTab);
  const goPrev = () => setPricingTab(pricingTabs[(tabIndex - 1 + pricingTabs.length) % pricingTabs.length].id);
  const goNext = () => setPricingTab(pricingTabs[(tabIndex + 1) % pricingTabs.length].id);

  const { docs: reviewDocs } = useCollection('reviews', 'displayOrder');
  const testimonials = reviewDocs
    .filter((r) => r.visible)
    .sort((a, b) => (a.displayOrder ?? 999) - (b.displayOrder ?? 999))
    .map((r) => ({
      initials: (r.author || '??').split(' ').map((w) => w[0]).join('').slice(0, 2).toUpperCase(),
      name: r.author,
      role: r.role ?? '',
      stars: r.rating ?? 5,
      text: r.text,
    }));

  return (
    <section className="arrival" id="the-arrival">
      <style>{arrivalStyles}</style>

      <div className="arrival__layout">
      {/* ── The Card (full-bleed) — map + info woven together ── */}
      <div className="arrival__card">
        {/* Map */}
        <div className="arrival__map">
          <div className="arrival__map-inner">
            <iframe
              title="HQ Aviation Location"
              src={MAPS_SRC}
              width="100%"
              height="100%"
              style={{ border: 0 }}
              allowFullScreen=""
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />
          </div>
        </div>

        {/* Info panel */}
        <div className="arrival__info">
          <span className="arrival__pre">Find Us</span>
          <h3 className="arrival__title">Denham Aerodrome</h3>
          <div className="arrival__rule"></div>

          {/* Contact details */}
          <div className="arrival__details">
            {contactDetails.map((d) => (
              <div
                key={d.label}
                className="arrival__detail"
              >
                <span className="arrival__detail-icon"><i className={d.icon}></i></span>
                <div>
                  <span className="arrival__detail-label">{d.label}</span>
                  <p className="arrival__detail-text">
                    {d.href ? <a href={d.href} className="arrival__detail-link">{d.text}</a> : d.text}
                    {d.text2 && <><br />{d.text2}</>}
                  </p>
                </div>
              </div>
            ))}
          </div>

          <div className="arrival__rating">
            <div className="arrival__rating-stars">
              <span>★</span><span>★</span><span>★</span><span>★</span><span>★</span>
            </div>
            <div className="arrival__rating-text">
              <span className="arrival__rating-score">4.9</span>
              <span className="arrival__rating-total"> / 5</span>
            </div>
          </div>
        </div>
        <div className="arrival__actions">
          <Link to="/contact" className="arrival__cta">Get Directions <span>→</span></Link>
        </div>
      </div>

      {/* Testimonial River (desktop) / Carousel (mobile) */}
      <div className="arrival__marquee arrival__marquee--desktop">
        <div className="arrival__marquee-track">
          {testimonials.concat(testimonials).map((t, i) => (
            <div key={i} className="arrival__marquee-card">
              <p className="arrival__marquee-text">{t.text}</p>
              <div className="arrival__marquee-author">
                <div className="arrival__avatar arrival__avatar--sm">{t.initials}</div>
                <div>
                  <strong>{t.name}</strong>
                  <span>{t.role}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
        <a href="https://www.google.com/maps/place/HQ+Aviation+Ltd/@51.5918637,-0.5143918,17z/data=!4m8!3m7!1s0x48766ed1ec88a2df:0x78f17fa958e197be!8m2!3d51.5918637!4d-0.5118169!9m1!1b1!16s%2Fg%2F1wfcnn43" target="_blank" rel="noopener noreferrer" className="arrival__cta arrival__cta--outline arrival__marquee-cta">Leave a Review <span>→</span></a>
      </div>
      <div className="arrival__reviews-mobile">
        <div
          className="arrival__reviews-track"
          ref={reviewTrackRef}
          onScroll={(e) => {
            const el = e.currentTarget;
            const card = el.firstElementChild;
            if (!card) return;
            const cardWidth = card.offsetWidth + 12;
            const idx = Math.round(el.scrollLeft / cardWidth);
            if (idx !== reviewIdx && idx >= 0 && idx < testimonials.length) setReviewIdx(idx);
          }}
        >
          {testimonials.map((t, i) => (
            <div key={i} className="arrival__reviews-card">
              <p className="arrival__marquee-text">{t.text}</p>
              <div className="arrival__marquee-author">
                <div className="arrival__avatar arrival__avatar--sm">{t.initials}</div>
                <div>
                  <strong>{t.name}</strong>
                  <span>{t.role}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
        <div className="arrival__reviews-controls">
          <button className="rb-stats__chevron" onClick={() => {
            const next = (reviewIdx - 1 + testimonials.length) % testimonials.length;
            setReviewIdx(next);
            reviewTrackRef.current?.children[next]?.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
          }}><i className="fas fa-chevron-left"></i></button>
          <div className="arrival__reviews-dots">
            {testimonials.map((_, i) => (
              <span key={i} className={`fd-sales__carousel-dot ${reviewIdx === i ? 'fd-sales__carousel-dot--active' : ''}`} />
            ))}
          </div>
          <button className="rb-stats__chevron" onClick={() => {
            const next = (reviewIdx + 1) % testimonials.length;
            setReviewIdx(next);
            reviewTrackRef.current?.children[next]?.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
          }}><i className="fas fa-chevron-right"></i></button>
        </div>
        <a href="https://www.google.com/maps/place/HQ+Aviation+Ltd/@51.5918637,-0.5143918,17z/data=!4m8!3m7!1s0x48766ed1ec88a2df:0x78f17fa958e197be!8m2!3d51.5918637!4d-0.5118169!9m1!1b1!16s%2Fg%2F1wfcnn43" target="_blank" rel="noopener noreferrer" className="arrival__cta arrival__cta--outline" style={{ display: 'block', textAlign: 'center', marginTop: '0.75rem' }}>Leave a Review <span>→</span></a>
      </div>
      </div>
      {/* ===== RATES & PRICING ===== */}
      <div>
        <style>{`
        .fd-pricing { background: #faf9f6; padding: 3rem 2rem 3rem; border-radius: 12px; border: 1px solid rgba(0,0,0,0.08); }
        .fd-pricing__header { display: flex; align-items: center; justify-content: space-between; cursor: pointer; padding: 1rem 0; }
        .fd-pricing__header .fd-pricing__pre { font-family: 'Share Tech Mono', monospace; font-size: 0.6rem; letter-spacing: 0.2em; text-transform: uppercase; color: #999; display: block; margin-bottom: 0.5rem; }
        .fd-pricing__header .fd-pricing__title { font-family: 'Space Grotesk', sans-serif; font-size: clamp(1.6rem, 3vw, 2.2rem); font-weight: 700; text-transform: uppercase; letter-spacing: -0.02em; color: #1a1a1a; margin: 0; }
        .fd-pricing__toggle { background: none; border: 1px solid #e8e6e2; border-radius: 50%; width: 40px; height: 40px; display: flex; align-items: center; justify-content: center; cursor: pointer; flex-shrink: 0; transition: all 0.3s; }
        .fd-pricing__toggle:hover { border-color: #1a1a1a; }
        .fd-pricing__toggle-icon { font-size: 1.4rem; line-height: 1; color: #1a1a1a; display: block; transition: transform 0.4s ease; }
        .fd-pricing__toggle-icon--open { transform: rotate(45deg); }
        .fd-pricing__collapsible { max-height: 0; overflow: hidden; transition: max-height 0.5s ease; }
        .fd-pricing--open .fd-pricing__collapsible { max-height: 3000px; transition: max-height 0.7s ease; }
        .fd-pricing--open { padding: 3rem 2rem 3rem; }
        .fd-pricing__inner { max-width: 1200px; margin: 0 auto; padding: 0 2rem; }
        .fd-pricing__desc { font-family: 'Space Grotesk', sans-serif; font-size: 0.9rem; color: #777; line-height: 1.7; margin-bottom: 2rem; }
        .fd-pricing__tab-nav { display: flex; align-items: stretch; border-bottom: 1px solid #e8e6e2; margin-bottom: 1.25rem; padding-top: 1.75rem; }
        .fd-pricing__tab-chevron { all: unset; cursor: pointer; padding: 0 1.25rem 0.75rem; color: #bbb; font-size: 0.65rem; transition: color 0.2s; display: flex; align-items: center; flex-shrink: 0; }
        .fd-pricing__tab-chevron:hover { color: #1a1a1a; }
        .fd-pricing__tab-current { font-family: 'Space Grotesk', sans-serif; font-size: 0.75rem; font-weight: 600; text-transform: uppercase; letter-spacing: 0.05em; color: #1a1a1a; flex: 1; text-align: center; padding-bottom: 0.75rem; border-bottom: 2px solid #1a1a1a; margin-bottom: -1px; }
        .fd-pricing__table-wrap { margin-bottom: 2rem; }
        .fd-pricing__table { width: 100%; border-collapse: collapse; margin-bottom: 1.5rem; }
        .fd-pricing__table th { font-family: 'Share Tech Mono', monospace; font-size: 0.6rem; text-transform: uppercase; letter-spacing: 0.1em; color: #999; text-align: left; padding: 0.75rem 1rem; border-bottom: 1px solid #e8e6e2; }
        .fd-pricing__table td { padding: 1rem; border-bottom: 1px solid #f0eee9; font-size: 0.85rem; color: #333; vertical-align: top; }
        .fd-pricing__table td strong { font-family: 'Space Grotesk', sans-serif; font-weight: 700; }
        .fd-pricing__table td span { display: block; font-size: 0.75rem; color: #777; margin-top: 0.25rem; }
        .fd-pricing__price { font-family: 'Space Grotesk', sans-serif; font-weight: 700; white-space: nowrap; }
        .fd-pricing__table-highlight { background: #f2efea; }
        .fd-pricing__note { background: #fff; border: 1px solid #e8e6e2; border-radius: 8px; padding: 1.25rem 1.5rem; font-size: 0.8rem; color: #555; line-height: 1.6; margin-bottom: 0.75rem; }
        .fd-pricing__note strong { font-family: 'Space Grotesk', sans-serif; color: #1a1a1a; }
        .fd-pricing__valet-intro { font-size: 0.9rem; color: #555; line-height: 1.7; margin-bottom: 2rem; }
        .fd-pricing__section-label { font-family: 'Share Tech Mono', monospace; font-size: 0.58rem; letter-spacing: 0.18em; text-transform: uppercase; color: #999; margin: 1.75rem 0 0.75rem; }
        .fd-pricing__section-label:first-child { margin-top: 0; }
        .fd-pricing__vat-note { font-family: 'Share Tech Mono', monospace; font-size: 0.62rem; letter-spacing: 0.05em; color: #aaa; margin-top: 1.25rem; }
        .fd-pricing__vat-note + .fd-pricing__vat-note { margin-top: 0.2rem; }
        .fd-pricing__bulk { background: #1a1a1a; padding: 1.75rem; margin-top: 1rem; }
        .fd-pricing__bulk-header { margin-bottom: 1.25rem; }
        .fd-pricing__bulk-pre { font-family: 'Share Tech Mono', monospace; font-size: 0.58rem; letter-spacing: 0.18em; text-transform: uppercase; color: #888; display: block; margin-bottom: 0.4rem; }
        .fd-pricing__bulk-title { font-family: 'Space Grotesk', sans-serif; font-size: 1rem; font-weight: 700; text-transform: uppercase; letter-spacing: -0.01em; color: #fff; margin: 0; }
        .fd-pricing__bulk-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 1px; background: #333; }
        .fd-pricing__bulk-card { background: #1a1a1a; padding: 1.25rem 1rem; display: flex; flex-direction: column; gap: 0.3rem; }
        .fd-pricing__bulk-aircraft { font-family: 'Share Tech Mono', monospace; font-size: 0.65rem; letter-spacing: 0.15em; text-transform: uppercase; color: #888; }
        .fd-pricing__bulk-price { font-family: 'Space Grotesk', sans-serif; font-size: 1.5rem; font-weight: 700; color: #fff; line-height: 1; }
        .fd-pricing__bulk-price span { font-size: 0.8rem; font-weight: 400; color: #888; margin-left: 2px; }
        .fd-pricing__bulk-saving { font-size: 0.72rem; color: #666; }
        @media (max-width: 600px) { .fd-pricing__bulk-grid { grid-template-columns: 1fr; } }
        .fd-pricing__table--valet td, .fd-pricing__table--valet th { text-align: center; }
        .fd-pricing__table--valet td:first-child, .fd-pricing__table--valet th:first-child { text-align: left; }
        .fd-pricing__valet-tiers { display: grid; grid-template-columns: repeat(3, 1fr); gap: 1.25rem; margin-top: 1.5rem; }
        .fd-pricing__valet-tier { background: #fff; border: 1px solid #e8e6e2; padding: 1.5rem; }
        .fd-pricing__valet-tier h4 { font-family: 'Space Grotesk', sans-serif; font-size: 0.85rem; font-weight: 700; text-transform: uppercase; margin-bottom: 0.75rem; }
        .fd-pricing__valet-tier ul { list-style: none; padding: 0; margin: 0; }
        .fd-pricing__valet-tier li { font-size: 0.75rem; color: #555; padding: 0.35rem 0; border-bottom: 1px solid #f5f3f0; }
        .fd-pricing__valet-tier li:last-child { border-bottom: none; }
        .fd-pricing__hangarage-includes { background: #fff; border: 1px solid #e8e6e2; padding: 2rem; margin-bottom: 0.75rem; }
        .fd-pricing__hangarage-includes h4 { font-family: 'Space Grotesk', sans-serif; font-size: 0.85rem; font-weight: 700; text-transform: uppercase; margin-bottom: 1.25rem; }
        .fd-pricing__hangarage-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 1rem; }
        .fd-pricing__hangarage-item { display: flex; align-items: center; gap: 0.75rem; font-size: 0.8rem; color: #444; }
        .fd-pricing__hangarage-item i { width: 32px; height: 32px; display: flex; align-items: center; justify-content: center; border: 1px solid #e8e6e2; color: #999; font-size: 0.8rem; flex-shrink: 0; }
        .fd-pricing__tab-intro { font-family: 'Space Grotesk', sans-serif; font-size: 0.82rem; color: #777; line-height: 1.65; margin: 0.75rem 0 1rem; padding: 0 1rem; }
        .fd-pricing__enquire { padding: 2rem 0; }
        .fd-pricing__enquire-text { font-family: 'Space Grotesk', sans-serif; font-size: 0.9rem; color: #555; line-height: 1.7; margin-bottom: 1.5rem; max-width: 480px; }
        @media (max-width: 768px) {
          .fd-pricing { margin: 0 1rem; padding: 0.75rem 1rem; }
          .fd-pricing--open { padding: 0.75rem 1rem; }
          .fd-pricing__header { flex-direction: column; align-items: center; gap: 1rem; text-align: center; padding-bottom: 0; }
          .fd-pricing__valet-tiers { grid-template-columns: 1fr; }
          .fd-pricing__table { font-size: 0.75rem; }
          .fd-pricing__hangarage-grid { grid-template-columns: repeat(2, 1fr); }
          .fd-pricing__inner { padding: 0; }
          .fd-pricing__table-wrap { overflow-x: auto; padding: 0 1rem; }
        }
        @media (max-width: 580px) {
          .fd-pricing__table-wrap { overflow-x: visible; padding: 0 0.75rem; margin-bottom: 0.75rem; }
          .fd-pricing__table thead { display: none; }
          .fd-pricing__table tbody tr { display: block; padding: 0.75rem 0; border-bottom: 1px solid #e8e6e2; }
          .fd-pricing__table tbody tr:last-child { border-bottom: none; }
          .fd-pricing__table tbody td { display: flex; justify-content: space-between; align-items: center; padding: 0.2rem 0; border: none; font-size: 0.82rem; text-align: left !important; }
          .fd-pricing__table tbody td:first-child { display: block; padding-bottom: 0.5rem; margin-bottom: 0.35rem; border-bottom: 1px solid #f0eee9; font-size: 0.88rem; }
          .fd-pricing__table tbody td[data-label]::before { content: attr(data-label); font-family: 'Share Tech Mono', monospace; font-size: 0.6rem; text-transform: uppercase; letter-spacing: 0.08em; color: #999; flex-shrink: 0; margin-right: 0.75rem; }
          .fd-pricing__note { padding: 0.5rem 0.75rem; font-size: 0.76rem; margin-bottom: 0.25rem; border-radius: 4px; }
        }
        `}</style>
        <section className={`fd-pricing ${pricingOpen ? 'fd-pricing--open' : ''}`} id="pricing">
          <div className="fd-pricing__inner">
            <div className="fd-pricing__header" onClick={() => setPricingOpen(!pricingOpen)}>
              <div>
                <span className="fd-pricing__pre">Transparent Pricing</span>
                <h2 className="fd-pricing__title">Rates &amp; Pricing</h2>
              </div>
              <button className="fd-pricing__toggle" aria-label={pricingOpen ? 'Collapse' : 'Expand'}>
                <span className={`fd-pricing__toggle-icon ${pricingOpen ? 'fd-pricing__toggle-icon--open' : ''}`}>+</span>
              </button>
            </div>
            <div className="fd-pricing__collapsible">
              <div className="fd-pricing__tab-nav">
                <button className="fd-pricing__tab-chevron" onClick={goPrev} aria-label="Previous tab">
                  <i className="fas fa-chevron-left"></i>
                </button>
                <span className="fd-pricing__tab-current">{pricingTabs[tabIndex].label}</span>
                <button className="fd-pricing__tab-chevron" onClick={goNext} aria-label="Next tab">
                  <i className="fas fa-chevron-right"></i>
                </button>
              </div>
              {pricingTab === 'discovery' && (
                <>
                  <p className="fd-pricing__tab-intro">An introductory flight with one of our qualified instructors. No experience necessary — just turn up and fly.</p>
                  <div className="fd-pricing__table-wrap">
                    <table className="fd-pricing__table">
                      <thead><tr><th>Aircraft</th><th style={{textAlign:'center'}}>30 min</th><th style={{textAlign:'center'}}>60 min</th></tr></thead>
                      <tbody>
                        <tr><td><strong>Robinson R22</strong></td><td data-label="30 min" className="fd-pricing__price" style={{textAlign:'center'}}>{fmt('discovery_r22_30min')}</td><td data-label="60 min" className="fd-pricing__price" style={{textAlign:'center'}}>{fmt('discovery_r22_60min')}</td></tr>
                        <tr><td><strong>Robinson R44</strong></td><td data-label="30 min" className="fd-pricing__price" style={{textAlign:'center'}}>{fmt('discovery_r44_30min')}</td><td data-label="60 min" className="fd-pricing__price" style={{textAlign:'center'}}>{fmt('discovery_r44_60min')}</td></tr>
                        <tr><td><strong>Robinson R66</strong></td><td data-label="30 min" className="fd-pricing__price" style={{textAlign:'center'}}>{fmt('discovery_r66_30min')}</td><td data-label="60 min" className="fd-pricing__price" style={{textAlign:'center'}}>{fmt('discovery_r66_60min')}</td></tr>
                      </tbody>
                    </table>
                  </div>
                  <p className="fd-pricing__vat-note">* Flying time, additional instruction on the ground included within the price</p>
                  <p className="fd-pricing__vat-note">* All prices exclude VAT</p>
                </>
              )}
              {pricingTab === 'dual' && (
                <>
                  <p className="fd-pricing__tab-intro">All flights conducted dual with a qualified instructor. Billed per flight hour.</p>
                  <div className="fd-pricing__table-wrap">
                    <table className="fd-pricing__table">
                      <thead><tr><th>Aircraft</th><th>Hourly Rate</th></tr></thead>
                      <tbody>
                        <tr><td><strong>Robinson R22</strong></td><td data-label="Hourly Rate" className="fd-pricing__price">{fmt('discovery_r22_60min')}/hr</td></tr>
                        <tr><td><strong>Robinson R44</strong></td><td data-label="Hourly Rate" className="fd-pricing__price">{fmt('discovery_r44_60min')}/hr</td></tr>
                        <tr><td><strong>Robinson R66</strong></td><td data-label="Hourly Rate" className="fd-pricing__price">{fmt('discovery_r66_60min')}/hr</td></tr>
                      </tbody>
                    </table>
                  </div>
                  <div className="fd-pricing__note"><strong>Happy Hour Flying:</strong> Off-peak rates for flexible pilots who can fly at shorter notice.</div>
                  <div className="fd-pricing__note"><strong>Mission Rate Flying:</strong> When fleet aircraft need repositioning or ferrying, qualified pilots can join at mission rates.</div>
                  <div className="fd-pricing__note"><strong>Bulk Hour Discounts:</strong> Discounted training rates are available when hours are purchased in larger blocks.</div>
                  <p className="fd-pricing__vat-note">* Flying time, additional instruction on the ground included within the price</p>
                  <p className="fd-pricing__vat-note">* All prices exclude VAT</p>
                </>
              )}
              {pricingTab === 'hire' && (
                <>
                  <p className="fd-pricing__tab-intro">Available to PPL(H) holders with appropriate type rating and recent experience. All rates are wet — fuel included.</p>
                  <div className="fd-pricing__table-wrap">
                    <table className="fd-pricing__table">
                      <thead><tr><th>Aircraft</th><th style={{textAlign:'center'}}>Seats</th><th>Rate (60 min)</th></tr></thead>
                      <tbody>
                        <tr><td><strong>Robinson R22</strong></td><td data-label="Seats" style={{textAlign:'center', verticalAlign:'middle'}}>2</td><td data-label="Rate (60 min)" className="fd-pricing__price" style={{verticalAlign:'middle'}}>From {fmt('sfh_r22_wet')}/hr</td></tr>
                        <tr><td><strong>Robinson R44 Raven II</strong></td><td data-label="Seats" style={{textAlign:'center', verticalAlign:'middle'}}>4</td><td data-label="Rate (60 min)" className="fd-pricing__price" style={{verticalAlign:'middle'}}>From {fmt('sfh_r44_wet')}/hr</td></tr>
                        <tr><td><strong>Robinson R66 Turbine</strong></td><td data-label="Seats" style={{textAlign:'center', verticalAlign:'middle'}}>5</td><td data-label="Rate (60 min)" className="fd-pricing__price" style={{verticalAlign:'middle'}}>From {fmt('sfh_r66_wet')}/hr</td></tr>
                      </tbody>
                    </table>
                  </div>
                  <div className="fd-pricing__note"><strong>Happy Hour Flying:</strong> Off-peak rates for flexible pilots who can fly at shorter notice.</div>
                  <div className="fd-pricing__note"><strong>Mission Rate Flying:</strong> When fleet aircraft need repositioning or ferrying, qualified pilots can join at mission rates.</div>
                  <div className="fd-pricing__note"><strong>Bulk Hour Discounts:</strong> Discounted training rates are available when hours are purchased in larger blocks.</div>
                  <p className="fd-pricing__vat-note">* Other aircraft available upon request</p>
                  <p className="fd-pricing__vat-note">* All prices exclude VAT</p>
                </>
              )}
              {pricingTab === 'advanced' && (
                <div className="fd-pricing__enquire">
                  <p className="fd-pricing__enquire-text">Advanced training with Quentin Smith is available on request. Pricing is tailored to your experience level and training objectives.</p>
                  <Link to="/contact" className="arrival__cta">Please Enquire <span>→</span></Link>
                </div>
              )}
            </div>
          </div>
        </section>
      </div>
    </section>
  );
}

/* ── Styles ── */
export const arrivalStyles = `
  /* ===== THE ARRIVAL ===== */
  .arrival {
    background: #fff;
    padding: 0px clamp(2rem, 8vw, 12rem) 3rem;
  }
  .arrival__layout {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 16px;
    max-width: 100%;
    margin: 0 0 3rem;
    padding: 0;
  }
  .arrival__layout > .arrival__card {
    grid-column: 1;
    grid-row: 1;
  }
  .arrival__layout > .arrival__marquee {
    grid-column: 2;
    grid-row: 1;
    align-self: stretch;
  }
  @media (max-width: 768px) {
    .arrival__layout {
      grid-template-columns: 1fr;
    }
    .arrival__layout > .arrival__card {
      grid-column: 1;
      grid-row: auto;
    }
    .arrival__layout > .arrival__marquee {
      grid-column: 1;
      grid-row: auto;
    }
  }

  .arrival__header {
    text-align: center;
    margin-bottom: 2.5rem;
    padding: 0 2rem;
  }
  .arrival__pretitle {
    display: block;
    font-size: 0.75rem;
    text-transform: uppercase;
    letter-spacing: 0.15em;
    color: #888;
    margin-bottom: 0.75rem;
    font-family: 'Space Grotesk', sans-serif;
  }
  .arrival__headline {
    display: flex;
    flex-direction: column;
    align-items: center;
    line-height: 1.1;
    margin: 0;
  }
  .arrival__headline span {
    font-family: 'Space Grotesk', sans-serif;
    font-size: clamp(2rem, 4vw, 3rem);
    font-weight: 700;
    line-height: 1.15;
    text-transform: uppercase;
  }
  .arrival__headline span:nth-child(1) {
    color: #1a1a1a;
  }
  .arrival__headline span:nth-child(2) {
    color: #999;
  }

  /* ── The Card ── */
  .arrival__card {
    display: grid;
    grid-template-columns: 1fr;
    background: #faf9f6;
    border: 1px solid #e8e6e2;
    border-radius: 8px;
    overflow: hidden;
  }

  /* Map */
  .arrival__map {
    position: relative;
    overflow: hidden;
    min-height: 260px;
    background: #e8e6e2;
    border: 1px solid #e8e6e2;
  }
  .arrival__map-inner {
    position: absolute;
    inset: 0;
    width: 100%;
    height: 100%;
  }
  .arrival__map-inner iframe {
    width: 100%;
    height: 100%;
    display: block;
  }

  /* Info panel */
  .arrival__info {
    padding: 1.25rem 1.5rem;
    display: flex;
    flex-direction: column;
  }
  .arrival__pre {
    display: block;
    font-family: 'Share Tech Mono', monospace;
    font-size: 0.55rem;
    text-transform: uppercase;
    letter-spacing: 0.3em;
    color: #999;
    margin-bottom: 0.4rem;
  }
  .arrival__title {
    font-family: 'Space Grotesk', sans-serif;
    font-size: clamp(1.2rem, 2vw, 1.5rem);
    font-weight: 700;
    text-transform: uppercase;
    color: #1a1a1a;
    margin: 0 0 0.6rem 0;
    letter-spacing: -0.01em;
  }
  .arrival__rule {
    width: 100%;
    height: 1px;
    background: #e8e6e2;
    margin-bottom: 0.75rem;
  }

  /* Contact details */
  .arrival__details {
    display: flex;
    flex-direction: column;
    gap: 0.7rem;
    margin-bottom: 0.75rem;
  }
  .arrival__detail {
    display: flex;
    gap: 0.6rem;
    align-items: flex-start;
  }
  .arrival__detail-icon {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 26px;
    height: 26px;
    border: 1px solid #e8e6e2;
    border-radius: 50%;
    color: #999;
    font-size: 0.6rem;
    flex-shrink: 0;
    margin-top: 1px;
  }
  .arrival__detail-label {
    display: block;
    font-family: 'Share Tech Mono', monospace;
    font-size: 0.5rem;
    text-transform: uppercase;
    letter-spacing: 0.15em;
    color: #bbb;
    margin-bottom: 0.1rem;
  }
  .arrival__detail-text {
    font-family: 'Space Grotesk', sans-serif;
    font-size: 0.75rem;
    color: #555;
    line-height: 1.4;
    margin: 0;
  }
  .arrival__detail-link {
    color: #555;
    text-decoration: none;
    transition: color 0.2s;
  }
  .arrival__detail-link:hover {
    color: #1a1a1a;
  }

  .arrival__avatar {
    width: 32px;
    height: 32px;
    border-radius: 50%;
    background: #1a1a1a;
    color: #fff;
    font-family: 'Share Tech Mono', monospace;
    font-size: 0.55rem;
    font-weight: 700;
    letter-spacing: 0.05em;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
  }
  .arrival__avatar--sm {
    width: 32px;
    height: 32px;
    font-size: 0.55rem;
  }

  .arrival__rating {
    display: flex;
    align-items: center;
    gap: 1rem;
    margin-top: 1.5rem;
    padding-top: 1.5rem;
    border-top: 1px solid #e8e6e2;
  }
  .arrival__rating-stars {
    display: flex;
    gap: 2px;
    color: #d4a853;
    font-size: 0.85rem;
  }
  .arrival__rating-text {
    display: flex;
    align-items: baseline;
    gap: 0.25rem;
  }
  .arrival__rating-score {
    font-family: 'Space Grotesk', sans-serif;
    font-size: 0.95rem;
    font-weight: 700;
    color: #1a1a1a;
  }
  .arrival__rating-total {
    font-family: 'Share Tech Mono', monospace;
    font-size: 0.7rem;
    color: #999;
  }
  .arrival__rating-label {
    font-family: 'Share Tech Mono', monospace;
    font-size: 0.6rem;
    text-transform: uppercase;
    letter-spacing: 0.1em;
    color: #aaa;
    margin-left: 0.5rem;
  }

  /* Actions — location + review CTAs side by side */
  .arrival__actions {
    display: flex;
    gap: 0.75rem;
  }
  .arrival__actions .arrival__cta {
    flex: 1;
    justify-content: center;
  }
  .arrival__cta {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    gap: 0.5rem;
    padding: 1rem 1.3rem;
    font-family: 'Space Grotesk', sans-serif;
    font-size: 0.65rem;
    font-weight: 600;
    text-transform: uppercase;
    letter-spacing: 0.06em;
    text-decoration: none;
    background: #1a1a1a;
    color: #faf9f6;
    border: 1px solid #1a1a1a;
    border-radius: 4px;
    transition: all 0.3s ease;
  }
  .arrival__cta:hover {
    background: #333;
    border-color: #333;
  }
  .arrival__cta--outline {
    background: transparent;
    color: #1a1a1a;
    border-color: #1a1a1a;
  }
  .arrival__cta--outline:hover {
    background: #1a1a1a;
    color: #faf9f6;
  }

  /* ── C. Marquee — flows directly, no separate heading ── */
  .arrival__reviews-mobile {
    display: none;
  }
  .arrival__reviews-track {
    display: flex;
    overflow-x: auto;
    scroll-snap-type: x mandatory;
    -webkit-overflow-scrolling: touch;
    scrollbar-width: none;
    gap: 12px;
  }
  .arrival__reviews-track::-webkit-scrollbar { display: none; }
  .arrival__reviews-card {
    flex: 0 0 100%;
    scroll-snap-align: center;
    background: #faf9f6;
    border: 1px solid #e8e6e2;
    border-radius: 8px;
    padding: 1.5rem;
    box-sizing: border-box;
  }
  .arrival__reviews-controls {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 0.5rem;
    padding-top: 0.75rem;
  }
  .arrival__reviews-controls .rb-stats__chevron {
    position: relative;
    left: auto;
    right: auto;
    top: auto;
    transform: none;
    margin: 0;
  }
  .arrival__reviews-dots {
    display: flex;
    align-items: center;
    gap: 6px;
  }

  .arrival__marquee {
    position: relative;
    overflow: hidden;
    padding: 0;
    border: 1px solid #e8e6e2;
    border-radius: 8px;
  }
  .arrival__marquee::before,
  .arrival__marquee::after {
    content: '';
    position: absolute;
    left: 0;
    right: 0;
    height: 3rem;
    z-index: 2;
    pointer-events: none;
  }
  .arrival__marquee::before {
    top: 0;
    background: linear-gradient(to bottom, #fff, transparent);
  }
  .arrival__marquee::after {
    bottom: 3rem;
    background: linear-gradient(to top, #fff, transparent);
  }
  .arrival__marquee-track {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    display: flex;
    flex-direction: column;
    gap: 1rem;
    padding: 1rem 0;
    animation: arrivalMarquee 45s linear infinite;
  }
  .arrival__marquee-cta {
    position: absolute;
    bottom: 0;
    left: 0;
    right: 0;
    display: block;
    text-align: center;
    padding: 1rem;
    background: #1a1a1a;
    color: #fff;
    z-index: 3;
    border-radius: 0 0 7px 7px;
    border: none;
  }
  .arrival__marquee-track:has(.arrival__marquee-card:hover) {
    animation-play-state: paused;
  }
  @keyframes arrivalMarquee {
    from { transform: translateY(0); }
    to { transform: translateY(-50%); }
  }
  .arrival__marquee-card {
    flex-shrink: 0;
    width: 100%;
    background: transparent;
    border: none;
    border-bottom: 1px solid #e8e6e2;
    padding: 10px 1.5rem;
    position: relative;
  }
  .arrival__marquee-card:hover {
    background: rgba(0,0,0,0.02);
  }
  .arrival__marquee-stars {
    display: flex;
    gap: 1px;
    color: #d4a853;
    font-size: 0.75rem;
    margin-bottom: 0.75rem;
  }
  .arrival__marquee-text {
    font-size: 0.78rem;
    line-height: 1.65;
    color: #444;
    margin: 0 0 1rem;
    display: -webkit-box;
    -webkit-line-clamp: 4;
    -webkit-box-orient: vertical;
    overflow: hidden;
  }
  .arrival__marquee-author {
    display: flex;
    align-items: center;
    gap: 0.6rem;
    margin-bottom: 0.75rem;
  }
  .arrival__marquee-author strong {
    display: block;
    font-family: 'Space Grotesk', sans-serif;
    font-size: 0.7rem;
    font-weight: 700;
  }
  .arrival__marquee-author span {
    font-family: 'Share Tech Mono', monospace;
    font-size: 0.5rem;
    color: #777;
    text-transform: uppercase;
    letter-spacing: 0.05em;
    display: block;
  }
  .arrival__marquee-cat {
    position: absolute;
    top: 0.75rem;
    right: 0.75rem;
    font-family: 'Share Tech Mono', monospace;
    font-size: 0.45rem;
    text-transform: uppercase;
    letter-spacing: 0.1em;
    color: #aaa;
    border: 1px solid #e8e6e2;
    padding: 0.15rem 0.4rem;
  }

  /* ── Responsive ── */
  @media (max-width: 768px) {
    .arrival__card {
      grid-template-columns: 1fr;
    }
    .arrival__map {
      min-height: 220px;
    }
    .arrival__info {
      padding: 1.25rem 1.25rem;
    }
    .arrival__actions {
      flex-direction: column;
    }
    .arrival {
      padding-left: 0;
      padding-right: 0;
      overflow: hidden;
    }
    .arrival__layout {
      max-width: 100vw;
    }
    .arrival__card {
      margin: 0 1rem;
    }
    .arrival__marquee--desktop {
      display: none;
    }
    .arrival__reviews-mobile {
      display: block;
      padding: 0 1rem;
      max-width: 100%;
      box-sizing: border-box;
      overflow: hidden;
    }
    .arrival__reviews-card {
      flex: 0 0 calc(100% - 2rem);
      width: calc(100% - 2rem);
    }
  }
`;

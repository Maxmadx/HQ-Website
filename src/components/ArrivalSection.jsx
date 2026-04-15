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



const contactDetails = [
  { icon: 'fas fa-map-marker-alt', label: 'Address', text: 'Hangar E, Denham Aerodrome', text2: 'Uxbridge, London, UB9 5DF' },
  { icon: 'fas fa-phone-alt', label: 'Operations', text: '+44 1895 833373', href: 'tel:+441895833373' },
  { icon: 'fas fa-wrench', label: 'Maintenance', text: '+44 1895 832833', href: 'tel:+441895832833' },
  { icon: 'fas fa-envelope', label: 'Email', text: 'Operations@HQAviation.com', href: 'mailto:Operations@HQAviation.com' },
  { icon: 'fas fa-clock', label: 'Hours', text: 'Monday – Sunday', text2: '09:00 – 17:00' },
];

const MAPS_SRC = "https://maps.google.com/maps?q=HQ+Aviation,+Denham+Aerodrome,+UB9+5DF&ll=51.55,-0.51&t=&z=10&ie=UTF8&iwloc=&output=embed";

/* ── Component ── */
export default function ArrivalSection() {
  const cardRef = useRef(null);
  const cardInView = useInView(cardRef, { once: true, margin: '-60px' });
  const reviewTrackRef = useRef(null);
  const [reviewIdx, setReviewIdx] = useState(0);

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
      <motion.div
        className="arrival__card"
        ref={cardRef}
        initial={{ opacity: 0, y: 30 }}
        animate={cardInView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.6, ease: 'easeOut' }}
      >
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
            {contactDetails.map((d, i) => (
              <motion.div
                key={d.label}
                className="arrival__detail"
                initial={{ opacity: 0, y: 12 }}
                animate={cardInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.5, delay: 0.1 + i * 0.05, ease: 'easeOut' }}
              >
                <span className="arrival__detail-icon"><i className={d.icon}></i></span>
                <div>
                  <span className="arrival__detail-label">{d.label}</span>
                  <p className="arrival__detail-text">
                    {d.href ? <a href={d.href} className="arrival__detail-link">{d.text}</a> : d.text}
                    {d.text2 && <><br />{d.text2}</>}
                  </p>
                </div>
              </motion.div>
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
      </motion.div>

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
        <Link to="/testimonials" className="arrival__cta arrival__cta--outline arrival__marquee-cta">Leave a Review <span>→</span></Link>
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
        <Link to="/testimonials" className="arrival__cta arrival__cta--outline" style={{ display: 'block', textAlign: 'center', marginTop: '0.75rem' }}>Leave a Review <span>→</span></Link>
      </div>
      </div>
    </section>
  );
}

/* ── Styles ── */
const arrivalStyles = `
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
    margin: 0;
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

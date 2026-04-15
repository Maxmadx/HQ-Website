import React, { useRef } from 'react';
import { Link } from 'react-router-dom';
import { useInView } from 'framer-motion';

/**
 * Founder Spotlight - Captain Quentin Smith
 * Condensed founder section with portrait, stats meta bar, and milestone timeline.
 * Status: approved
 * Feedback: "Integrated into about us, tasteful, matches brand identity"
 */

const milestones = [
  { year: '1994', text: 'World Aerobatics Gold, Moscow' },
  { year: '2002', text: 'First piston helicopter to North Pole' },
  { year: '2005', text: 'First crew to both Poles' },
  { year: '2012', text: 'Second World Championship' },
  { year: '2018', text: 'Trained Tom Cruise, Mission: Impossible' },
  { year: '2019', text: 'FAI Gold Rotorcraft Medal' },
];

const FounderSpotlight = () => {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, amount: 0.05 });

  return (
    <>
      <section className="cq-spot" ref={ref}>
        <div className="cq-spot__inner">
          <div className={`cq-spot__image ${inView ? 'cq-spot__image--visible' : ''}`}>
            <img src="/assets/images/team/world-helicopter-champion-quentin-smith.webp" alt="Captain Quentin Smith" />
          </div>

          <div className={`cq-spot__content ${inView ? 'cq-spot__content--visible' : ''}`}>
            <span className="cq-spot__pre">The Founder</span>
            <h2 className="cq-spot__name">Captain Quentin Smith</h2>

            <div className="cq-spot__meta">
              <span className="cq-spot__meta-item"><strong>12,000+</strong> Hours PIC</span>
              <span className="cq-spot__meta-sep" />
              <span className="cq-spot__meta-item"><strong>55+</strong> Years Flying</span>
              <span className="cq-spot__meta-sep" />
              <span className="cq-spot__meta-item"><strong>2x</strong> World Champion</span>
              <span className="cq-spot__meta-sep" />
              <span className="cq-spot__meta-item"><strong>4</strong> World Records</span>
            </div>

            <div className="cq-spot__milestones">
              {milestones.map((m, i) => (
                <div key={i} className={`cq-spot__milestone ${inView ? 'cq-spot__milestone--visible' : ''}`} style={{ transitionDelay: `${0.3 + i * 0.08}s` }}>
                  <span className="cq-spot__milestone-year">{m.year}</span>
                  <span className="cq-spot__milestone-text">{m.text}</span>
                </div>
              ))}
            </div>

            <Link to="/about-us/captain-q" className="cq-spot__link">
              Read the Full Story
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
            </Link>
          </div>
        </div>
      </section>

      <style>{`
        .cq-spot {
          padding: 6rem 2rem;
          background: #fff;
          border-top: 1px solid #e8e6e2;
        }
        .cq-spot__inner {
          max-width: 1100px;
          margin: 0 auto;
          display: grid;
          grid-template-columns: 320px 1fr;
          gap: 3rem;
          align-items: start;
        }
        .cq-spot__image {
          opacity: 0;
          transform: translateY(20px);
          transition: all 0.7s cubic-bezier(0.16, 1, 0.3, 1);
        }
        .cq-spot__image--visible {
          opacity: 1;
          transform: translateY(0);
        }
        .cq-spot__image img {
          width: 100%;
          aspect-ratio: 3 / 4;
          object-fit: cover;
          object-position: top center;
          border-radius: 3px;
          display: block;
          filter: saturate(0.85);
        }
        .cq-spot__image img:hover {
          filter: saturate(1);
        }
        .cq-spot__content {
          opacity: 0;
          transform: translateY(20px);
          transition: all 0.7s cubic-bezier(0.16, 1, 0.3, 1) 0.15s;
          padding-top: 0.5rem;
        }
        .cq-spot__content--visible {
          opacity: 1;
          transform: translateY(0);
        }
        .cq-spot__pre {
          font-family: 'Share Tech Mono', monospace;
          font-size: 0.65rem;
          letter-spacing: 0.2em;
          text-transform: uppercase;
          color: #999;
          display: block;
          margin-bottom: 1rem;
        }
        .cq-spot__name {
          font-family: 'Space Grotesk', sans-serif;
          font-size: clamp(1.6rem, 3vw, 2.4rem);
          font-weight: 700;
          color: #1a1a1a;
          line-height: 1.1;
          margin: 0 0 1.5rem;
          text-transform: uppercase;
          letter-spacing: -0.02em;
        }
        .cq-spot__meta {
          display: flex;
          align-items: center;
          flex-wrap: wrap;
          gap: 0.75rem;
          padding: 1.25rem 0;
          margin: 0.75rem 0 1.5rem;
          border-top: 1px solid #e8e6e2;
          border-bottom: 1px solid #e8e6e2;
        }
        .cq-spot__meta-item {
          font-family: 'Share Tech Mono', monospace;
          font-size: 0.65rem;
          letter-spacing: 0.1em;
          text-transform: uppercase;
          color: #999;
        }
        .cq-spot__meta-item strong {
          font-family: 'Space Grotesk', sans-serif;
          font-size: 0.85rem;
          font-weight: 600;
          color: #1a1a1a;
          letter-spacing: normal;
          text-transform: none;
        }
        .cq-spot__meta-sep {
          width: 1px;
          height: 12px;
          background: #d8d6d2;
        }
        .cq-spot__milestones {
          display: flex;
          flex-direction: column;
          gap: 0;
          margin-bottom: 2rem;
        }
        .cq-spot__milestone {
          display: flex;
          align-items: baseline;
          gap: 1rem;
          padding: 0.5rem 0;
          border-bottom: 1px solid #f0eeea;
          opacity: 0;
          transform: translateY(8px);
          transition: all 0.4s cubic-bezier(0.16, 1, 0.3, 1);
        }
        .cq-spot__milestone--visible {
          opacity: 1;
          transform: translateY(0);
        }
        .cq-spot__milestone:last-child {
          border-bottom: none;
        }
        .cq-spot__milestone-year {
          font-family: 'Share Tech Mono', monospace;
          font-size: 0.65rem;
          letter-spacing: 0.1em;
          color: #999;
          flex-shrink: 0;
          width: 36px;
        }
        .cq-spot__milestone-text {
          font-family: 'Space Grotesk', sans-serif;
          font-size: 0.82rem;
          color: #666;
          line-height: 1.4;
        }
        .cq-spot__link {
          display: inline-flex;
          align-items: center;
          gap: 0.5rem;
          font-family: 'Space Grotesk', sans-serif;
          font-size: 0.75rem;
          color: #1a1a1a;
          text-decoration: none;
          padding-bottom: 2px;
          border-bottom: 1px solid #1a1a1a;
          transition: all 0.3s;
        }
        .cq-spot__link:hover {
          color: #666;
          border-color: #666;
        }
        .cq-spot__link svg {
          transition: transform 0.3s;
        }
        .cq-spot__link:hover svg {
          transform: translateX(3px);
        }
        @media (max-width: 768px) {
          .cq-spot__inner {
            grid-template-columns: 1fr;
            gap: 2rem;
          }
          .cq-spot__image {
            max-width: 280px;
          }
          .cq-spot__meta {
            gap: 0.5rem;
          }
          .cq-spot__meta-sep {
            display: none;
          }
        }
      `}</style>
    </>
  );
};

export default FounderSpotlight;

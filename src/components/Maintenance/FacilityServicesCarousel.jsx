/**
 * FACILITY SERVICES CAROUSEL
 * Combines scrolling facility images with maintenance service cards
 * in a dark, crossing-images layout.
 */

import React from 'react';

const serviceCards = [
  { icon: 'fa-search', title: 'Inspections', desc: '50-hour, 100-hour, annual & progressive. Spectrometric oil analysis, compression checks, and full control system review on Robinson & Cabri fleets.' },
  { icon: 'fa-cogs', title: 'Overhauls & Rebuilds', desc: '12-year and 2,200-hour major overhauls. Complete strip-down, NDT testing, factory-spec rebuild. 40+ Robinsons rebuilt by our chief engineer alone.' },
  { icon: 'fa-microchip', title: 'Avionics & Upgrades', desc: 'Dedicated avionics workshop. Glass cockpit conversions, GPS/NAV systems, ADS-B, transponder upgrades. Modern situational awareness by qualified specialists.' },
  { icon: 'fa-exclamation-triangle', title: '24/7 AOG & Parts', desc: 'Aircraft on Ground emergency response across Europe. £500K parts inventory: 1,200+ engine, 800+ airframe, 2,000+ consumables. Same-day dispatch.' },
  { icon: 'fa-paint-roller', title: 'Paint & Refurbishment', desc: 'Dedicated in-house paint shop. Complete interior/exterior restoration, corrosion treatment, and custom livery. Factory-new finish from our Denham facility.' },
  { icon: 'fa-helicopter', title: 'Ownership Services', desc: 'Pre-purchase inspections, aircraft management, leaseback revenue programmes, secure heated hangarage, worldwide ferry flights, and new & used sales.' },
];

const facilityImages = [
  '/assets/images/facility/hq-0345.jpg',
  '/assets/images/facility/hq-0354.jpg',
  '/assets/images/facility/hq-0053.jpg',
  '/assets/images/facility/hq-0300.jpg',
  '/assets/images/facility/hq-0477.jpg',
  '/assets/images/facility/hq-0388.jpg',
  '/assets/images/facility/hq-0153-3.jpg',
  '/assets/images/facility/hq-0391.jpg',
  '/assets/images/facility/hq-0696.jpg',
];

// Interleave: card, image, card, image, card, image...
const buildRow = (cards, images, reverse = false) => {
  const items = [];
  let ci = 0, ii = 0;
  for (let i = 0; ci < cards.length || ii < images.length; i++) {
    if (i % 2 === (reverse ? 1 : 0) && ci < cards.length) {
      items.push({ type: 'card', data: cards[ci++] });
    } else if (ii < images.length) {
      items.push({ type: 'image', src: images[ii++] });
    }
  }
  return items;
};

const renderSlides = (items) =>
  items.map((item, i) => (
    <div key={i} className="fsc__slide">
      {item.type === 'image' ? (
        <img src={item.src} alt="" width={800} height={600} loading="lazy" />
      ) : (
        <div className="fsc__card">
          <i className={`fas ${item.data.icon}`} />
          <h4>{item.data.title}</h4>
          <p>{item.data.desc}</p>
        </div>
      )}
    </div>
  ));

const FacilityServicesCarousel = () => {
  const row1Cards = serviceCards.slice(0, 3);
  const row2Cards = serviceCards.slice(3);
  const row1Images = facilityImages.slice(0, 5);
  const row2Images = facilityImages.slice(4);

  const row1 = buildRow(row1Cards, row1Images);
  const row2 = buildRow(row2Cards, row2Images, true);

  return (
    <section className="fsc">
      <div className="fsc__carousel">
        <div className="fsc__track">
          <div className="fsc__slides">
            <div className="fsc__set">{renderSlides(row1)}</div>
            <div className="fsc__set">{renderSlides(row1)}</div>
          </div>
        </div>
      </div>

      <div className="fsc__carousel fsc__carousel--reverse">
        <div className="fsc__track">
          <div className="fsc__slides fsc__slides--reverse">
            <div className="fsc__set">{renderSlides(row2)}</div>
            <div className="fsc__set">{renderSlides(row2)}</div>
          </div>
        </div>
      </div>

      <style>{`
        .fsc {
          background: linear-gradient(to bottom, #d6d2cc 0%, #0f0f0f 2.5%);
          padding: 2rem 0;
          overflow: hidden;
          border-top: 1px solid #c2beb8;
          border-bottom: 1px solid rgba(0,0,0,0.12);
        }

        .fsc__carousel {
          padding: 0.5rem 0;
        }

        .fsc__track {
          width: 100%;
        }

        .fsc__slides {
          display: flex;
          animation: fscScroll 50s linear infinite;
        }

        .fsc__slides--reverse {
          animation: fscScrollReverse 45s linear infinite;
        }

        .fsc__set {
          display: flex;
          gap: 0.75rem;
          flex-shrink: 0;
          padding-right: 0.75rem;
        }

        @keyframes fscScroll {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }

        @keyframes fscScrollReverse {
          0% { transform: translateX(-50%); }
          100% { transform: translateX(0); }
        }

        .fsc__slide {
          flex-shrink: 0;
          width: 240px;
          height: 180px;
          border-radius: 6px;
          overflow: hidden;
        }

        .fsc__slide img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          opacity: 0.7;
        }

        .fsc__card {
          width: 100%;
          height: 100%;
          background: rgba(255,255,255,0.06);
          border: 1px solid rgba(255,255,255,0.1);
          border-radius: 6px;
          padding: 1.25rem;
          display: flex;
          flex-direction: column;
          box-sizing: border-box;
        }

        .fsc__card i {
          font-size: 0.9rem;
          color: rgba(255,255,255,0.5);
          margin-bottom: 0.6rem;
        }

        .fsc__card h4 {
          font-family: 'Space Grotesk', sans-serif;
          font-size: 0.7rem;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 0.05em;
          color: #fff;
          margin: 0 0 0.5rem;
        }

        .fsc__card p {
          font-family: 'Space Grotesk', sans-serif;
          font-size: 0.6rem;
          line-height: 1.6;
          color: rgba(255,255,255,0.45);
          margin: 0;
          overflow: hidden;
        }

        @media (max-width: 600px) {
          .fsc__slide {
            width: 180px;
            height: 140px;
          }
          .fsc__card {
            padding: 1rem;
          }
          .fsc__card h4 {
            font-size: 0.6rem;
          }
          .fsc__card p {
            font-size: 0.55rem;
          }
        }
      `}</style>
    </section>
  );
};

export default FacilityServicesCarousel;

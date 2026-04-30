/**
 * FACILITY SERVICES DETAIL
 * Left: service list, Right: scrolling facility images
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

const imagesRow1 = [
  '/assets/images/facility/hq-0345.jpg',
  '/assets/images/facility/hq-0354.jpg',
  '/assets/images/facility/hq-0053.jpg',
  '/assets/images/facility/hq-0300.jpg',
  '/assets/images/facility/hq-0477.jpg',
];

const imagesRow2 = [
  '/assets/images/facility/hq-0388.jpg',
  '/assets/images/facility/hq-0153-3.jpg',
  '/assets/images/facility/hq-0391.jpg',
  '/assets/images/facility/hq-0696.jpg',
  '/assets/images/facility/hq-0345.jpg',
];

const FacilityServicesDetail = () => (
  <section className="fsd">
    <div className="fsd__inner">
      <div className="fsd__left">
        {serviceCards.map((card, i) => (
          <div key={i} className="fsd__service">
            <div className="fsd__service-icon">
              <i className={`fas ${card.icon}`} />
            </div>
            <div className="fsd__service-content">
              <h4>{card.title}</h4>
              <p>{card.desc}</p>
            </div>
          </div>
        ))}
      </div>
      <div className="fsd__right">
        <div className="fsd__img-carousel">
          <div className="fsd__img-track">
            <div className="fsd__img-set">
              {imagesRow1.map((src, i) => (
                <div key={i} className="fsd__img"><img src={src} alt="" loading="lazy" /></div>
              ))}
            </div>
            <div className="fsd__img-set">
              {imagesRow1.map((src, i) => (
                <div key={`d${i}`} className="fsd__img"><img src={src} alt="" loading="lazy" /></div>
              ))}
            </div>
          </div>
        </div>
        <div className="fsd__img-carousel fsd__img-carousel--reverse">
          <div className="fsd__img-track fsd__img-track--reverse">
            <div className="fsd__img-set">
              {imagesRow2.map((src, i) => (
                <div key={i} className="fsd__img"><img src={src} alt="" loading="lazy" /></div>
              ))}
            </div>
            <div className="fsd__img-set">
              {imagesRow2.map((src, i) => (
                <div key={`d${i}`} className="fsd__img"><img src={src} alt="" loading="lazy" /></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>

    <style>{`
      .fsd {
        background: #0f0f0f;
        padding: 3rem 0;
      }

      .fsd__inner {
        display: grid;
        grid-template-columns: 340px 1fr;
        gap: 2rem;
        max-width: 100%;
      }

      .fsd__left {
        padding: 0 2rem;
        display: flex;
        flex-direction: column;
        gap: 1.5rem;
      }

      .fsd__service {
        display: flex;
        gap: 1rem;
        align-items: flex-start;
      }

      .fsd__service-icon {
        flex-shrink: 0;
        width: 32px;
        height: 32px;
        display: flex;
        align-items: center;
        justify-content: center;
        background: rgba(255,255,255,0.06);
        border: 1px solid rgba(255,255,255,0.1);
        border-radius: 6px;
      }

      .fsd__service-icon i {
        font-size: 0.75rem;
        color: rgba(255,255,255,0.5);
      }

      .fsd__service-content h4 {
        font-family: 'Space Grotesk', sans-serif;
        font-size: 0.75rem;
        font-weight: 700;
        text-transform: uppercase;
        letter-spacing: 0.05em;
        color: #fff;
        margin: 0 0 0.35rem;
      }

      .fsd__service-content p {
        font-family: 'Space Grotesk', sans-serif;
        font-size: 0.65rem;
        line-height: 1.6;
        color: rgba(255,255,255,0.45);
        margin: 0;
      }

      .fsd__right {
        overflow: hidden;
        display: flex;
        flex-direction: column;
        gap: 0.75rem;
        justify-content: center;
        position: relative;
      }

      .fsd__img-carousel {
        overflow: hidden;
      }

      .fsd__img-track {
        display: flex;
        animation: fsdScroll 40s linear infinite;
      }

      .fsd__img-track--reverse {
        animation: fsdScrollReverse 35s linear infinite;
      }

      .fsd__img-set {
        display: flex;
        gap: 0.75rem;
        flex-shrink: 0;
        padding-right: 0.75rem;
      }

      @keyframes fsdScroll {
        0% { transform: translateX(0); }
        100% { transform: translateX(-50%); }
      }

      @keyframes fsdScrollReverse {
        0% { transform: translateX(0); }
        100% { transform: translateX(-50%); }
      }

      .fsd__img {
        flex-shrink: 0;
        width: 220px;
        height: 150px;
        border-radius: 6px;
        overflow: hidden;
      }

      .fsd__img img {
        width: 100%;
        height: 100%;
        object-fit: cover;
        opacity: 0.7;
      }

      @media (max-width: 768px) {
        .fsd__inner {
          grid-template-columns: 1fr;
        }
        .fsd__left {
          padding: 0 1.5rem;
        }
        .fsd__img {
          width: 180px;
          height: 120px;
        }
      }
    `}</style>
  </section>
);

export default FacilityServicesDetail;

import React from 'react';
import { usePricing } from '../../hooks/usePricing';

export default function AdditionalServices() {
  const { fmt } = usePricing();

  const addons = [
    { title: 'Safety Pilot',     price: `${fmt('addon_safety_pilot')}/hr`, desc: 'Experienced pilot accompanies your flight' },
    { title: 'Customs Handling', price: fmt('addon_customs'),               desc: 'International flight paperwork assistance' },
    { title: 'PPR Booking',      price: 'Free',                             desc: 'We handle destination PPR requests' },
  ];

  return (
    <section className="sfh-addons">
      <style>{styles}</style>
      <div className="sfh-addons__container">
        <div className="sfh-section-header">
          <span className="sfh-pre-text">Enhance Your Flight</span>
          <h2>
            <span className="sfh-text--dark">Additional</span>{' '}
            <span className="sfh-text--mid">Services</span>
          </h2>
        </div>

        <div className="sfh-addons__grid">
          {addons.map((addon, i) => (
            <div key={i} className="sfh-addons__card">
              <div className="sfh-addons__header">
                <h4>{addon.title}</h4>
                <span className="sfh-addons__price">{addon.price}</span>
              </div>
              <p>{addon.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

const styles = `
  .sfh-addons {
    padding: 6rem 2rem;
    background: #fff;
    position: relative;
  }
  .sfh-addons::before {
    content: '';
    position: absolute;
    top: 0;
    left: 10%;
    right: 10%;
    height: 1px;
    background: linear-gradient(to right, transparent, #e8e6e2, transparent);
  }
  .sfh-addons__container {
    max-width: 1100px;
    margin: 0 auto;
  }
  .sfh-addons__grid {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 1.25rem;
    margin-top: 2rem;
  }
  .sfh-addons__card {
    background: #faf9f6;
    padding: 1.5rem;
    border-left: 3px solid #1a1a1a;
  }
  .sfh-addons__header {
    display: flex;
    justify-content: space-between;
    align-items: baseline;
    margin-bottom: 0.5rem;
  }
  .sfh-addons__header h4 {
    font-family: 'Space Grotesk', sans-serif;
    font-size: 1rem;
    font-weight: 700;
    margin: 0;
  }
  .sfh-addons__price {
    font-family: 'Share Tech Mono', monospace;
    font-size: 0.85rem;
    color: #1a1a1a;
    font-weight: 600;
  }
  .sfh-addons__card p {
    font-family: 'Space Grotesk', sans-serif;
    font-size: 0.85rem;
    color: #777;
    line-height: 1.5;
    margin: 0;
  }
  .sfh-section-header {
    text-align: center;
    margin-bottom: 1rem;
  }
  .sfh-pre-text {
    display: block;
    font-family: 'Share Tech Mono', monospace;
    font-size: 0.6rem;
    text-transform: uppercase;
    letter-spacing: 0.3em;
    color: #999;
    margin-bottom: 0.75rem;
  }
  .sfh-section-header h2 {
    font-family: 'Space Grotesk', sans-serif;
    font-size: clamp(1.75rem, 3.5vw, 2.5rem);
    font-weight: 800;
    text-transform: uppercase;
    margin: 0 0 0.75rem;
  }
  .sfh-text--dark { color: #1a1a1a; }
  .sfh-text--mid { color: #7a7a7a; }
  @media (max-width: 768px) {
    .sfh-addons__grid {
      grid-template-columns: 1fr;
    }
  }
`;

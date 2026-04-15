import React from 'react';

const partners = [
  { name: 'The Grove', type: 'Hotel & Spa', benefit: '15% discount' },
  { name: 'Wentworth', type: 'Golf Club', benefit: 'Priority tee times' },
  { name: 'Gleneagles', type: 'Resort', benefit: '10% room rate' },
  { name: 'Le Manoir', type: 'Restaurant', benefit: 'Complimentary welcome' },
  { name: 'Ascot', type: 'Racecourse', benefit: 'VIP parking' },
  { name: 'Goodwood', type: 'Motor Circuit', benefit: 'Paddock access' },
];

export default function DestinationPartners() {
  return (
    <section className="sfh-partners">
      <style>{styles}</style>
      <div className="sfh-partners__container">
        <div className="sfh-section-header">
          <span className="sfh-pre-text">Preferred Partners</span>
          <h2>
            <span className="sfh-text--dark">Destination</span>{' '}
            <span className="sfh-text--mid">Partners</span>
          </h2>
          <p className="sfh-section-desc">
            Exclusive benefits at these partner locations when you arrive by helicopter.
          </p>
        </div>

        <div className="sfh-partners__grid">
          {partners.map((partner, i) => (
            <div key={i} className="sfh-partners__card">
              <h4>{partner.name}</h4>
              <span className="sfh-partners__type">{partner.type}</span>
              <span className="sfh-partners__benefit">{partner.benefit}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

const styles = `
  .sfh-partners {
    padding: 6rem 2rem;
    background: #fff;
    position: relative;
  }
  .sfh-partners::before {
    content: '';
    position: absolute;
    top: 0;
    left: 10%;
    right: 10%;
    height: 1px;
    background: linear-gradient(to right, transparent, #e8e6e2, transparent);
  }
  .sfh-partners__container {
    max-width: 1100px;
    margin: 0 auto;
  }
  .sfh-partners__grid {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 1.25rem;
    margin-top: 2rem;
  }
  .sfh-partners__card {
    background: #faf9f6;
    padding: 2rem 1.5rem;
    text-align: center;
    border-left: 3px solid #1a1a1a;
  }
  .sfh-partners__card h4 {
    font-family: 'Space Grotesk', sans-serif;
    font-size: 1.1rem;
    font-weight: 700;
    margin: 0 0 0.25rem;
  }
  .sfh-partners__type {
    display: block;
    font-family: 'Space Grotesk', sans-serif;
    font-size: 0.8rem;
    color: #777;
    margin-bottom: 1rem;
  }
  .sfh-partners__benefit {
    display: inline-block;
    font-family: 'Space Grotesk', sans-serif;
    font-size: 0.65rem;
    font-weight: 600;
    text-transform: uppercase;
    letter-spacing: 0.05em;
    background: #1a1a1a;
    color: #fff;
    padding: 0.5rem 1rem;
    border-radius: 3px;
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
  .sfh-section-desc {
    font-family: 'Space Grotesk', sans-serif;
    font-size: 0.95rem;
    color: #777;
    max-width: 600px;
    margin: 0 auto;
    line-height: 1.6;
  }
  @media (max-width: 768px) {
    .sfh-partners__grid {
      grid-template-columns: repeat(2, 1fr);
    }
  }
  @media (max-width: 480px) {
    .sfh-partners__grid {
      grid-template-columns: 1fr;
    }
  }
`;

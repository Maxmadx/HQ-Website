import React from 'react';

const IMAGES = [
  { src: '/assets/images/gallery/social/img-20241004-wa0001.jpg', alt: 'Community' },
  { src: '/assets/images/gallery/flying/foggy-evening-flying.jpg', alt: 'Flying' },
  { src: '/assets/images/gallery/social/img-20230425-wa0001.jpg', alt: 'Team' },
  { src: '/assets/images/expeditions/north-pole.jpg', alt: 'North Pole' },
  { src: '/assets/images/expeditions/six-helis-in-North-Pole.jpg', alt: 'Expedition' },
  { src: '/assets/images/lifestyle/superyacht-ops.jpg', alt: 'Superyacht' },
  { src: '/assets/images/facility/fleet-lineup-sunset.jpg', alt: 'Fleet' },
  { src: '/assets/images/gallery/flying/james-shadow-night.jpg', alt: 'Night flying' },
];

const CenterCard = () => (
  <div className="fc-cell fc-cell--final">
    <div className="fc-cheatlines" aria-hidden="true">
      <span className="fc-cheatlines__red" />
      <span className="fc-cheatlines__white" />
    </div>
    <div className="fc-final__body">
      <h2 className="fc-final__title">Community Wall</h2>
      <span className="fc-final__subtitle">Helicopter Adventures</span>
      <div className="fc-final__nav">
        <button className="fc-final__chevron" aria-label="Previous page" disabled>
          <i className="fas fa-chevron-left" />
        </button>
        <span className="fc-final__count">01 / 04</span>
        <button className="fc-final__chevron" aria-label="Next page">
          <i className="fas fa-chevron-right" />
        </button>
      </div>
    </div>
  </div>
);

export default function WallOfCoolFinalCard() {
  return (
    <div className="fc-page">
      <header className="fc-topnav">
        <div className="fc-topnav__title">Wall of Cool · Final Centre Card</div>
        <a className="fc-topnav__back" href="/wall-of-cool-compass-card">← Compasses</a>
      </header>

      <section className="fc-variant">
        <div className="fc-variant__sticky">
          <div className="fc-variant__label">
            <span className="fc-variant__number">FINAL</span>
            <div>
              <h2 className="fc-variant__title">Community Wall: Helicopter Adventures</h2>
              <p className="fc-variant__desc">Aircraft-cheatline header: red line on top, white line underneath. Bold uppercase title and mono subtitle, circular chevrons with page counter.</p>
            </div>
          </div>
          <div className="fc-variant__canvas">
            <div className="fc-stack">
              <div className="fc-gallery">
                <div className="fc-grid">
                  {IMAGES.slice(0, 4).map((img, i) => (
                    <div className="fc-cell fc-cell--img" key={`a-${i}`}>
                      <img src={img.src} alt={img.alt} loading="lazy" />
                    </div>
                  ))}
                  <CenterCard />
                  {IMAGES.slice(4).map((img, i) => (
                    <div className="fc-cell fc-cell--img" key={`b-${i}`}>
                      <img src={img.src} alt={img.alt} loading="lazy" />
                    </div>
                  ))}
                </div>
              </div>
              <footer className="fc-footer">
                <div className="fc-footer__issue">Are you an HQ'er with some cool footage?</div>
                <button className="fc-footer__btn">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                    <polyline points="17 8 12 3 7 8" />
                    <line x1="12" y1="3" x2="12" y2="15" />
                  </svg>
                  Upload
                </button>
                <button className="fc-footer__btn" aria-label="Fullscreen gallery">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M8 3H5a2 2 0 00-2 2v3m18 0V5a2 2 0 00-2-2h-3m0 18h3a2 2 0 002-2v-3M3 16v3a2 2 0 002 2h3" />
                  </svg>
                  Fullscreen
                </button>
              </footer>
            </div>
          </div>
        </div>
      </section>

      <style>{`
        .fc-page { font-family: 'Space Grotesk', -apple-system, sans-serif; background: #faf9f6; min-height: 100vh; color: #1a1a1a; }

        .fc-topnav { position: sticky; top: 0; z-index: 100; display: flex; align-items: center; justify-content: space-between; gap: 1rem; padding: 0.65rem 1.25rem; background: rgba(255,255,255,0.92); backdrop-filter: blur(10px); border-bottom: 1px solid #e5e7eb; }
        .fc-topnav__title { font-weight: 600; font-size: 0.9rem; }
        .fc-topnav__back { padding: 0.25rem 0.55rem; background: #1a1a1a; color: #fff; border: 1px solid #1a1a1a; border-radius: 4px; font-family: 'Share Tech Mono', monospace; font-size: 0.7rem; letter-spacing: 0.05em; text-decoration: none; }

        .fc-variant { position: relative; height: 130vh; padding: 2rem 1.5rem 0; }
        .fc-variant__sticky { position: sticky; top: 70px; display: flex; flex-direction: column; gap: 0.9rem; height: calc(100vh - 90px); }
        .fc-variant__label { flex: 0 0 auto; display: flex; align-items: flex-start; gap: 0.9rem; }
        .fc-variant__number { display: inline-flex; align-items: center; justify-content: center; min-width: 56px; height: 40px; padding: 0 0.55rem; background: #1a1a1a; color: #fff; border-radius: 6px; font-family: 'Share Tech Mono', monospace; font-size: 0.7rem; letter-spacing: 0.1em; }
        .fc-variant__title { margin: 0; font-size: 1.1rem; font-weight: 600; }
        .fc-variant__desc { margin: 0.2rem 0 0; color: #666; font-size: 0.82rem; max-width: 820px; }
        .fc-variant__canvas { flex: 1 1 auto; min-height: 0; display: flex; }
        .fc-variant__canvas > * { width: 100%; }

        .fc-stack { display: flex; flex-direction: column; height: 100%; }
        .fc-gallery { flex: 1 1 auto; position: relative; overflow: hidden; border-radius: 10px; background: linear-gradient(to bottom, #ffffff 0%, #000000 100%); }
        .fc-grid { display: grid; grid-template-columns: repeat(3, 1fr); grid-template-rows: repeat(3, 1fr); gap: 8px; padding: 8px; height: 100%; }
        .fc-cell { position: relative; overflow: hidden; border-radius: 8px; border: 1px solid rgba(255,255,255,0.22); background: #1a1a1a; }
        .fc-cell--img img { width: 100%; height: 100%; object-fit: cover; display: block; }

        .fc-footer { flex: 0 0 auto; display: flex; flex-wrap: wrap; align-items: center; justify-content: center; gap: 1rem; padding: 0.9rem 1.25rem; margin-top: 8px; background: #1a1a1a; color: #fff; border-radius: 10px; }
        .fc-footer__issue { flex: 1 1 auto; min-width: 160px; font-size: 0.85rem; color: rgba(255,255,255,0.85); }
        .fc-footer__btn { display: inline-flex; align-items: center; gap: 0.45rem; padding: 0.45rem 0.85rem; background: transparent; border: 1px solid rgba(255,255,255,0.25); border-radius: 6px; color: #fff; font-family: 'Share Tech Mono', monospace; font-size: 0.72rem; letter-spacing: 0.08em; text-transform: uppercase; cursor: pointer; }
        .fc-footer__btn:hover { background: rgba(255,255,255,0.1); }

        /* ===== Final centre card ===== */
        .fc-cell--final {
          background: #ffffff;
          color: #0a0a0a;
          border: 1px solid rgba(0,0,0,0.1);
          padding: 0;
          display: flex;
          flex-direction: column;
        }
        .fc-cheatlines {
          display: flex;
          flex-direction: column;
          flex: 0 0 auto;
        }
        .fc-cheatlines__red {
          display: block;
          height: 14px;
          background: #b71c1c;
        }
        .fc-cheatlines__white {
          display: block;
          height: 14px;
          background: #ffffff;
          border-bottom: 1px solid rgba(0,0,0,0.18);
        }
        .fc-final__body {
          flex: 1 1 auto;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          gap: 0.5rem;
          padding: 0.85rem 0.95rem;
          text-align: center;
        }
        .fc-final__title {
          margin: auto 0 0;
          font-family: 'Inter', sans-serif;
          font-weight: 800;
          font-size: clamp(1.05rem, 2.2vw, 1.7rem);
          line-height: 1;
          letter-spacing: -0.005em;
          text-transform: uppercase;
        }
        .fc-final__subtitle {
          font-family: 'Share Tech Mono', monospace;
          font-size: 0.6rem;
          letter-spacing: 0.22em;
          text-transform: uppercase;
          color: #6b7280;
        }
        .fc-final__nav {
          display: flex;
          align-items: center;
          gap: 0.55rem;
          margin-top: auto;
        }
        .fc-final__chevron {
          width: 28px;
          height: 28px;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          border-radius: 50%;
          border: 1px solid rgba(0,0,0,0.25);
          background: transparent;
          color: #0a0a0a;
          cursor: pointer;
          font-size: 0.65rem;
        }
        .fc-final__chevron:disabled { opacity: 0.32; cursor: not-allowed; }
        .fc-final__chevron:hover:not(:disabled) { background: rgba(0,0,0,0.05); }
        .fc-final__count {
          font-family: 'Share Tech Mono', monospace;
          font-size: 0.72rem;
          letter-spacing: 0.12em;
          min-width: 3.2rem;
          text-align: center;
          color: #0a0a0a;
        }

        @media (max-width: 768px) {
          .fc-variant { height: 110vh; }
          .fc-variant__title { font-size: 1rem; }
          .fc-variant__desc { font-size: 0.75rem; }
        }
      `}</style>
    </div>
  );
}

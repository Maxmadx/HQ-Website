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
  <div className="fcs-cell fcs-cell--final">
    <span className="fcs-cheatline" aria-hidden="true" />
    <div className="fcs-final__body">
      <h2 className="fcs-final__title">Community Wall</h2>
      <span className="fcs-final__subtitle">Helicopter Adventures</span>
      <div className="fcs-final__nav">
        <button className="fcs-final__chevron" aria-label="Previous page" disabled>
          <i className="fas fa-chevron-left" />
        </button>
        <span className="fcs-final__count">01 / 04</span>
        <button className="fcs-final__chevron" aria-label="Next page">
          <i className="fas fa-chevron-right" />
        </button>
      </div>
    </div>
  </div>
);

export default function WallOfCoolFinalCardSky() {
  return (
    <div className="fcs-page">
      <header className="fcs-topnav">
        <div className="fcs-topnav__title">Wall of Cool — Final Centre Card · Sky</div>
        <a className="fcs-topnav__back" href="/wall-of-cool-final-card">← Red version</a>
      </header>

      <section className="fcs-variant">
        <div className="fcs-variant__sticky">
          <div className="fcs-variant__label">
            <span className="fcs-variant__number">SKY</span>
            <div>
              <h2 className="fcs-variant__title">Community Wall — Helicopter Adventures</h2>
              <p className="fcs-variant__desc">Single light-sky-blue cheatline at the top of the centre card. The gallery gradient picks up sky-blue in the middle so the card and the surrounding grid speak the same language.</p>
            </div>
          </div>
          <div className="fcs-variant__canvas">
            <div className="fcs-stack">
              <div className="fcs-gallery">
                <div className="fcs-grid">
                  {IMAGES.slice(0, 4).map((img, i) => (
                    <div className="fcs-cell fcs-cell--img" key={`a-${i}`}>
                      <img src={img.src} alt={img.alt} loading="lazy" />
                    </div>
                  ))}
                  <CenterCard />
                  {IMAGES.slice(4).map((img, i) => (
                    <div className="fcs-cell fcs-cell--img" key={`b-${i}`}>
                      <img src={img.src} alt={img.alt} loading="lazy" />
                    </div>
                  ))}
                </div>
              </div>
              <footer className="fcs-footer">
                <div className="fcs-footer__issue">Are you an HQ'er with some cool footage?</div>
                <button className="fcs-footer__btn">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                    <polyline points="17 8 12 3 7 8" />
                    <line x1="12" y1="3" x2="12" y2="15" />
                  </svg>
                  Upload
                </button>
                <button className="fcs-footer__btn" aria-label="Fullscreen gallery">
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
        .fcs-page { font-family: 'Space Grotesk', -apple-system, sans-serif; background: #faf9f6; min-height: 100vh; color: #1a1a1a; }

        .fcs-topnav { position: sticky; top: 0; z-index: 100; display: flex; align-items: center; justify-content: space-between; gap: 1rem; padding: 0.65rem 1.25rem; background: rgba(255,255,255,0.92); backdrop-filter: blur(10px); border-bottom: 1px solid #e5e7eb; }
        .fcs-topnav__title { font-weight: 600; font-size: 0.9rem; }
        .fcs-topnav__back { padding: 0.25rem 0.55rem; background: #1a1a1a; color: #fff; border: 1px solid #1a1a1a; border-radius: 4px; font-family: 'Share Tech Mono', monospace; font-size: 0.7rem; letter-spacing: 0.05em; text-decoration: none; }

        .fcs-variant { position: relative; height: 130vh; padding: 2rem 1.5rem 0; }
        .fcs-variant__sticky { position: sticky; top: 70px; display: flex; flex-direction: column; gap: 0.9rem; height: calc(100vh - 90px); }
        .fcs-variant__label { flex: 0 0 auto; display: flex; align-items: flex-start; gap: 0.9rem; }
        .fcs-variant__number { display: inline-flex; align-items: center; justify-content: center; min-width: 56px; height: 40px; padding: 0 0.55rem; background: #1a1a1a; color: #fff; border-radius: 6px; font-family: 'Share Tech Mono', monospace; font-size: 0.7rem; letter-spacing: 0.1em; }
        .fcs-variant__title { margin: 0; font-size: 1.1rem; font-weight: 600; }
        .fcs-variant__desc { margin: 0.2rem 0 0; color: #666; font-size: 0.82rem; max-width: 820px; }
        .fcs-variant__canvas { flex: 1 1 auto; min-height: 0; display: flex; }
        .fcs-variant__canvas > * { width: 100%; }

        .fcs-stack { display: flex; flex-direction: column; height: 100%; }
        .fcs-gallery {
          flex: 1 1 auto;
          position: relative;
          overflow: hidden;
          border-radius: 10px;
          background: linear-gradient(to bottom,
            #ffffff 0%,
            #cfeafd 35%,
            lightskyblue 55%,
            #2a4a66 80%,
            #000000 100%
          );
        }
        .fcs-grid { display: grid; grid-template-columns: repeat(3, 1fr); grid-template-rows: repeat(3, 1fr); gap: 8px; padding: 8px; height: 100%; }
        .fcs-cell { position: relative; overflow: hidden; border-radius: 8px; border: 1px solid rgba(255,255,255,0.22); background: #1a1a1a; }
        .fcs-cell--img img { width: 100%; height: 100%; object-fit: cover; display: block; }

        .fcs-footer { flex: 0 0 auto; display: flex; flex-wrap: wrap; align-items: center; justify-content: center; gap: 1rem; padding: 0.9rem 1.25rem; margin-top: 8px; background: #1a1a1a; color: #fff; border-radius: 10px; }
        .fcs-footer__issue { flex: 1 1 auto; min-width: 160px; font-size: 0.85rem; color: rgba(255,255,255,0.85); }
        .fcs-footer__btn { display: inline-flex; align-items: center; gap: 0.45rem; padding: 0.45rem 0.85rem; background: transparent; border: 1px solid rgba(255,255,255,0.25); border-radius: 6px; color: #fff; font-family: 'Share Tech Mono', monospace; font-size: 0.72rem; letter-spacing: 0.08em; text-transform: uppercase; cursor: pointer; }
        .fcs-footer__btn:hover { background: rgba(255,255,255,0.1); }

        /* ===== Final centre card — sky variant ===== */
        .fcs-cell--final {
          background: #ffffff;
          color: #0a0a0a;
          border: 1px solid rgba(0,0,0,0.1);
          padding: 0;
          display: flex;
          flex-direction: column;
        }
        .fcs-cheatline {
          display: block;
          height: 14px;
          background: lightskyblue;
          flex: 0 0 auto;
        }
        .fcs-final__body {
          flex: 1 1 auto;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          gap: 0.5rem;
          padding: 0.85rem 0.95rem;
          text-align: center;
        }
        .fcs-final__title {
          margin: auto 0 0;
          font-family: 'Inter', sans-serif;
          font-weight: 800;
          font-size: clamp(1.05rem, 2.2vw, 1.7rem);
          line-height: 1;
          letter-spacing: -0.005em;
          text-transform: uppercase;
        }
        .fcs-final__subtitle {
          font-family: 'Share Tech Mono', monospace;
          font-size: 0.6rem;
          letter-spacing: 0.22em;
          text-transform: uppercase;
          color: #6b7280;
        }
        .fcs-final__nav {
          display: flex;
          align-items: center;
          gap: 0.55rem;
          margin-top: auto;
        }
        .fcs-final__chevron {
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
        .fcs-final__chevron:disabled { opacity: 0.32; cursor: not-allowed; }
        .fcs-final__chevron:hover:not(:disabled) { background: rgba(0,0,0,0.05); }
        .fcs-final__count {
          font-family: 'Share Tech Mono', monospace;
          font-size: 0.72rem;
          letter-spacing: 0.12em;
          min-width: 3.2rem;
          text-align: center;
          color: #0a0a0a;
        }

        @media (max-width: 768px) {
          .fcs-variant { height: 110vh; }
          .fcs-variant__title { font-size: 1rem; }
          .fcs-variant__desc { font-size: 0.75rem; }
        }
      `}</style>
    </div>
  );
}

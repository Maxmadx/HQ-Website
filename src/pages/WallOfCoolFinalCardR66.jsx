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

const R66_SRC = '/assets/images/icons/r66-icon-transparent going right.svg';

const VARIATIONS = [
  { id: 'h1', title: 'Helicopter Above Title',     desc: 'R66 silhouette sits between the cheatlines and the title — straightforward editorial lockup.' },
  { id: 'h2', title: 'Helicopter Trailing Cheatlines', desc: 'The red and white stripes become a motion trail; the R66 emerges from the right edge of them.' },
  { id: 'h3', title: 'Helicopter Watermark',       desc: 'Large faint R66 sits behind the title as a watermark, the cheatlines and type stay confidently in front.' },
  { id: 'h4', title: 'Helicopter Replaces Title',  desc: 'The R66 is the dominant graphic; the wordmark drops to a fine mono caption beneath.' },
];

const CenterCard = ({ id }) => {
  switch (id) {
    case 'h1':
      return (
        <div className="r66-cell r66-cell--h1">
          <div className="r66-h1__heli-strip">
            <img className="r66-h1__heli" src={R66_SRC} alt="" aria-hidden="true" />
          </div>
          <div className="r66-h1__title-strip">
            <h2 className="r66-h1__title">Community Wall</h2>
            <span className="r66-h1__subtitle">Helicopter Adventures</span>
          </div>
          <div className="r66-h1__nav-wrap"><Chevrons /></div>
        </div>
      );

    case 'h2':
      return (
        <div className="r66-cell r66-cell--h2">
          <div className="r66-h2__lines" aria-hidden="true">
            <span className="r66-h2__red" />
            <span className="r66-h2__white" />
            <img className="r66-h2__heli" src={R66_SRC} alt="" />
          </div>
          <div className="r66-h2__body">
            <h2 className="r66-h2__title">Community Wall</h2>
            <span className="r66-h2__subtitle">Helicopter Adventures</span>
            <Chevrons />
          </div>
        </div>
      );

    case 'h3':
      return (
        <div className="r66-cell r66-cell--h3">
          <img className="r66-h3__watermark" src={R66_SRC} alt="" aria-hidden="true" />
          <div className="r66-h3__body">
            <h2 className="r66-h3__title">Community Wall</h2>
            <span className="r66-h3__subtitle">Helicopter Adventures</span>
            <Chevrons />
          </div>
        </div>
      );

    case 'h4':
      return (
        <div className="r66-cell r66-cell--h4">
          <div className="r66-h4__body">
            <img className="r66-h4__heli" src={R66_SRC} alt="" aria-hidden="true" />
            <span className="r66-h4__caption">Community Wall · Helicopter Adventures</span>
            <Chevrons />
          </div>
        </div>
      );

    default: return null;
  }
};

const Chevrons = () => (
  <div className="r66-nav">
    <button className="r66-chevron" aria-label="Previous page" disabled>
      <i className="fas fa-chevron-left" />
    </button>
    <span className="r66-count">01 / 04</span>
    <button className="r66-chevron" aria-label="Next page">
      <i className="fas fa-chevron-right" />
    </button>
  </div>
);

const Layout = ({ variantId }) => (
  <div className="r66-stack">
    <div className="r66-gallery">
      <div className="r66-grid">
        {IMAGES.slice(0, 4).map((img, i) => (
          <div className="r66-cell r66-cell--img" key={`a-${i}`}>
            <img src={img.src} alt={img.alt} loading="lazy" />
          </div>
        ))}
        <CenterCard id={variantId} />
        {IMAGES.slice(4).map((img, i) => (
          <div className="r66-cell r66-cell--img" key={`b-${i}`}>
            <img src={img.src} alt={img.alt} loading="lazy" />
          </div>
        ))}
      </div>
    </div>
    <footer className="r66-footer">
      <div className="r66-footer__issue">Are you an HQ'er with some cool footage?</div>
      <button className="r66-footer__btn">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
          <polyline points="17 8 12 3 7 8" />
          <line x1="12" y1="3" x2="12" y2="15" />
        </svg>
        Upload
      </button>
      <button className="r66-footer__btn" aria-label="Fullscreen gallery">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M8 3H5a2 2 0 00-2 2v3m18 0V5a2 2 0 00-2-2h-3m0 18h3a2 2 0 002-2v-3M3 16v3a2 2 0 002 2h3" />
        </svg>
        Fullscreen
      </button>
    </footer>
  </div>
);

export default function WallOfCoolFinalCardR66() {
  return (
    <div className="r66-page">
      <header className="r66-topnav">
        <div className="r66-topnav__title">Wall of Cool — Final Card · with R66</div>
        <nav className="r66-topnav__links">
          <a className="r66-topnav__back" href="/wall-of-cool-final-card">← Final (no heli)</a>
          {VARIATIONS.map((v) => (
            <a key={v.id} href={`#${v.id}`}>{v.id.toUpperCase()}</a>
          ))}
        </nav>
      </header>

      {VARIATIONS.map((v) => (
        <section className="r66-variant" data-variant={v.id} id={v.id} key={v.id}>
          <div className="r66-variant__sticky">
            <div className="r66-variant__label">
              <span className="r66-variant__number">{v.id.toUpperCase()}</span>
              <div>
                <h2 className="r66-variant__title">{v.title}</h2>
                <p className="r66-variant__desc">{v.desc}</p>
              </div>
            </div>
            <div className="r66-variant__canvas">
              <Layout variantId={v.id} />
            </div>
          </div>
        </section>
      ))}

      <style>{`
        .r66-page { font-family: 'Space Grotesk', -apple-system, sans-serif; background: #faf9f6; min-height: 100vh; color: #1a1a1a; }

        .r66-topnav { position: sticky; top: 0; z-index: 100; display: flex; align-items: center; justify-content: space-between; gap: 1rem; padding: 0.65rem 1.25rem; background: rgba(255,255,255,0.92); backdrop-filter: blur(10px); border-bottom: 1px solid #e5e7eb; }
        .r66-topnav__title { font-weight: 600; font-size: 0.9rem; }
        .r66-topnav__links { display: flex; gap: 0.35rem; flex-wrap: wrap; }
        .r66-topnav__links a { display: inline-block; padding: 0.25rem 0.55rem; border: 1px solid #e5e7eb; border-radius: 4px; font-family: 'Share Tech Mono', monospace; font-size: 0.7rem; letter-spacing: 0.05em; text-decoration: none; color: #333; background: #fff; }
        .r66-topnav__back { background: #1a1a1a !important; color: #fff !important; border-color: #1a1a1a !important; }
        .r66-topnav__links a:hover { background: #1a1a1a; color: #fff; }

        .r66-variant { position: relative; height: 150vh; padding: 2rem 1.5rem 0; }
        .r66-variant__sticky { position: sticky; top: 70px; display: flex; flex-direction: column; gap: 0.9rem; height: calc(100vh - 90px); }
        .r66-variant__label { flex: 0 0 auto; display: flex; align-items: flex-start; gap: 0.9rem; }
        .r66-variant__number { display: inline-flex; align-items: center; justify-content: center; min-width: 48px; height: 40px; padding: 0 0.55rem; background: #1a1a1a; color: #fff; border-radius: 6px; font-family: 'Share Tech Mono', monospace; font-size: 0.75rem; letter-spacing: 0.08em; }
        .r66-variant__title { margin: 0; font-size: 1.1rem; font-weight: 600; }
        .r66-variant__desc { margin: 0.2rem 0 0; color: #666; font-size: 0.82rem; max-width: 820px; }
        .r66-variant__canvas { flex: 1 1 auto; min-height: 0; display: flex; }
        .r66-variant__canvas > * { width: 100%; }

        .r66-stack { display: flex; flex-direction: column; height: 100%; }
        .r66-gallery { flex: 1 1 auto; position: relative; overflow: hidden; border-radius: 10px; background: linear-gradient(to bottom, #ffffff 0%, #000000 100%); }
        .r66-grid { display: grid; grid-template-columns: repeat(3, 1fr); grid-template-rows: repeat(3, 1fr); gap: 8px; padding: 8px; height: 100%; }
        .r66-cell { position: relative; overflow: hidden; border-radius: 8px; border: 1px solid rgba(255,255,255,0.22); background: #1a1a1a; }
        .r66-cell--img img { width: 100%; height: 100%; object-fit: cover; display: block; }

        .r66-footer { flex: 0 0 auto; display: flex; flex-wrap: wrap; align-items: center; justify-content: center; gap: 1rem; padding: 0.9rem 1.25rem; margin-top: 8px; background: #1a1a1a; color: #fff; border-radius: 10px; }
        .r66-footer__issue { flex: 1 1 auto; min-width: 160px; font-size: 0.85rem; color: rgba(255,255,255,0.85); }
        .r66-footer__btn { display: inline-flex; align-items: center; gap: 0.45rem; padding: 0.45rem 0.85rem; background: transparent; border: 1px solid rgba(255,255,255,0.25); border-radius: 6px; color: #fff; font-family: 'Share Tech Mono', monospace; font-size: 0.72rem; letter-spacing: 0.08em; text-transform: uppercase; cursor: pointer; }
        .r66-footer__btn:hover { background: rgba(255,255,255,0.1); }

        /* shared chevrons */
        .r66-nav { display: flex; align-items: center; gap: 0.55rem; margin-top: auto; }
        .r66-chevron { width: 28px; height: 28px; display: inline-flex; align-items: center; justify-content: center; border-radius: 50%; border: 1px solid rgba(0,0,0,0.25); background: transparent; color: #0a0a0a; cursor: pointer; font-size: 0.65rem; }
        .r66-chevron:disabled { opacity: 0.32; cursor: not-allowed; }
        .r66-chevron:hover:not(:disabled) { background: rgba(0,0,0,0.05); }
        .r66-count { font-family: 'Share Tech Mono', monospace; font-size: 0.72rem; letter-spacing: 0.12em; min-width: 3.2rem; text-align: center; color: #0a0a0a; }

        /* shared cheatlines */
        .r66-cheatlines { display: flex; flex-direction: column; flex: 0 0 auto; }
        .r66-cheatlines__red { display: block; height: 14px; background: #b71c1c; }
        .r66-cheatlines__white { display: block; height: 14px; background: #fff; border-bottom: 1px solid rgba(0,0,0,0.18); }

        /* ===== H1 — Helicopter Above Title ===== */
        .r66-cell--h1 { background: #fff; border: 1px solid rgba(0,0,0,0.1); padding: 0; display: flex; flex-direction: column; align-items: center; justify-content: center; }
        .r66-h1__heli-strip {
          width: 100%;
          background: linear-gradient(90deg,
            rgba(135, 206, 250, 0.55) 0%,
            rgba(135, 206, 250, 0.42) 12%,
            rgba(135, 206, 250, 0.05) 38%,
            rgba(135, 206, 250, 0.05) 62%,
            rgba(135, 206, 250, 0.42) 88%,
            rgba(135, 206, 250, 0.55) 100%
          );
          padding: 0.7rem 0.9rem;
          display: flex;
          align-items: center;
          justify-content: center;
          margin: auto 0 0;
        }
        .r66-h1__heli { display: block; width: 32%; max-width: 100px; height: auto; margin: 0; }
        .r66-h1__title-strip {
          width: 100%;
          background: transparent;
          padding: 0.55rem 0.9rem;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 0.25rem;
          text-align: center;
        }
        .r66-h1__title { margin: 0; font-family: 'Inter', sans-serif; font-weight: 800; font-size: clamp(1.05rem, 2.2vw, 1.7rem); line-height: 1; letter-spacing: -0.005em; text-transform: uppercase; }
        .r66-h1__subtitle { font-family: 'Share Tech Mono', monospace; font-size: 0.6rem; letter-spacing: 0.22em; text-transform: uppercase; color: #6b7280; }
        .r66-h1__nav-wrap { padding: 0.55rem 0.9rem 0.85rem; margin-top: auto; }

        /* ===== H2 — Helicopter Trailing Cheatlines ===== */
        .r66-cell--h2 { background: #fff; border: 1px solid rgba(0,0,0,0.1); padding: 0; display: flex; flex-direction: column; }
        .r66-h2__lines {
          position: relative;
          height: 36px;
          flex-shrink: 0;
        }
        .r66-h2__red {
          position: absolute;
          left: 0; right: 22%;
          top: 8px;
          height: 6px;
          background: #b71c1c;
        }
        .r66-h2__white {
          position: absolute;
          left: 0; right: 22%;
          top: 17px;
          height: 6px;
          background: #fff;
          border-top: 1px solid rgba(0,0,0,0.05);
          border-bottom: 1px solid rgba(0,0,0,0.18);
        }
        .r66-h2__heli {
          position: absolute;
          right: 4px;
          top: -3px;
          height: 38px;
          width: auto;
          max-width: 50%;
        }
        .r66-h2__body {
          flex: 1 1 auto;
          display: flex; flex-direction: column;
          align-items: center; justify-content: center;
          gap: 0.45rem; padding: 0.5rem 0.9rem 0.85rem;
          text-align: center;
        }
        .r66-h2__title { margin: auto 0 0; font-family: 'Inter', sans-serif; font-weight: 800; font-size: clamp(1.05rem, 2.2vw, 1.7rem); line-height: 1; letter-spacing: -0.005em; text-transform: uppercase; }
        .r66-h2__subtitle { font-family: 'Share Tech Mono', monospace; font-size: 0.6rem; letter-spacing: 0.22em; text-transform: uppercase; color: #6b7280; }

        /* ===== H3 — Helicopter Watermark ===== */
        .r66-cell--h3 { background: #fff; border: 1px solid rgba(0,0,0,0.1); padding: 0; display: flex; flex-direction: column; position: relative; }
        .r66-h3__watermark {
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -45%);
          width: 130%;
          max-width: none;
          height: auto;
          opacity: 0.08;
          pointer-events: none;
          z-index: 0;
        }
        .r66-h3__body {
          flex: 1 1 auto;
          display: flex; flex-direction: column;
          align-items: center; justify-content: center;
          gap: 0.45rem; padding: 0.85rem 0.9rem;
          text-align: center;
          position: relative;
          z-index: 1;
        }
        .r66-h3__title { margin: auto 0 0; font-family: 'Inter', sans-serif; font-weight: 800; font-size: clamp(1.05rem, 2.2vw, 1.7rem); line-height: 1; letter-spacing: -0.005em; text-transform: uppercase; }
        .r66-h3__subtitle { font-family: 'Share Tech Mono', monospace; font-size: 0.6rem; letter-spacing: 0.22em; text-transform: uppercase; color: #6b7280; }

        /* ===== H4 — Helicopter Replaces Title ===== */
        .r66-cell--h4 { background: #fff; border: 1px solid rgba(0,0,0,0.1); padding: 0; display: flex; flex-direction: column; }
        .r66-h4__body { flex: 1 1 auto; display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 0.5rem; padding: 0.85rem 0.9rem; text-align: center; }
        .r66-h4__heli { display: block; width: 92%; max-width: 280px; height: auto; margin: auto auto 0; }
        .r66-h4__caption { font-family: 'Share Tech Mono', monospace; font-size: 0.62rem; letter-spacing: 0.18em; text-transform: uppercase; color: #0a0a0a; }

        @media (max-width: 768px) {
          .r66-variant { height: 130vh; }
          .r66-variant__title { font-size: 1rem; }
          .r66-variant__desc { font-size: 0.75rem; }
        }
      `}</style>
    </div>
  );
}

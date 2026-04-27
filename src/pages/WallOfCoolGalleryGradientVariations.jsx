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
  { id: 'gg1',  title: 'Sky to Dusk',           desc: 'Vertical aviation palette — clouds at the top, lightskyblue mid-gradient, dusk navy descending into black.' },
  { id: 'gg2',  title: 'Sunrise',               desc: 'Pale gold → coral → burgundy → black. Warm vertical sweep, like a Denham sunrise.' },
  { id: 'gg3',  title: 'Slate',                 desc: 'Cool monochrome — white through three slate greys to near-black. Restrained and editorial.' },
  { id: 'gg4',  title: 'Horizon Inversion',     desc: 'Sky blue at the top, white through the middle, charcoal at the bottom — sky over land.' },
  { id: 'gg5',  title: 'Diagonal Sunrise',      desc: '135° diagonal — warm cream from the top-left, coral midpoint, deep navy in the bottom-right.' },
  { id: 'gg6',  title: 'Radial Spotlight',      desc: 'Radial gradient — bright at the centre top, ringing out to black at the corners. Stage-lit.' },
  { id: 'gg7',  title: 'Top-Edge Vignette',     desc: 'Radial from the very top-centre — soft daylight crowning the grid, the corners falling into shadow.' },
  { id: 'gg8',  title: 'Conic Sweep',           desc: 'Conic gradient through cream, sky blue, navy and back. Distinctive — the gradient circles the centre.' },
  { id: 'gg9',  title: 'Polar Light',           desc: 'Cool aurora — alabaster, mint, glacier blue, deep arctic. Clean, cold, expedition-feel.' },
  { id: 'gg10', title: 'Hard Bands',            desc: 'Three solid colour zones with no fade between them — white, mid-grey, black. Graphic and confident.' },
];

const Chevrons = () => (
  <div className="gg-nav">
    <button className="gg-chevron" aria-label="Previous page" disabled>
      <i className="fas fa-chevron-left" />
    </button>
    <span className="gg-count">01 / 04</span>
    <button className="gg-chevron" aria-label="Next page">
      <i className="fas fa-chevron-right" />
    </button>
  </div>
);

const CenterCard = () => (
  <div className="gg-cell gg-cell--final">
    <div className="gg-heli-strip">
      <img className="gg-heli" src={R66_SRC} alt="" aria-hidden="true" />
    </div>
    <div className="gg-title-strip">
      <h2 className="gg-title">Community Wall</h2>
      <span className="gg-subtitle">Helicopter Adventures</span>
    </div>
    <div className="gg-nav-wrap"><Chevrons /></div>
  </div>
);

const Layout = ({ variantId }) => (
  <div className="gg-stack">
    <div className={`gg-gallery gg-gallery--${variantId}`}>
      <div className="gg-grid">
        {IMAGES.slice(0, 4).map((img, i) => (
          <div className="gg-cell gg-cell--img" key={`a-${i}`}>
            <img src={img.src} alt={img.alt} loading="lazy" />
          </div>
        ))}
        <CenterCard />
        {IMAGES.slice(4).map((img, i) => (
          <div className="gg-cell gg-cell--img" key={`b-${i}`}>
            <img src={img.src} alt={img.alt} loading="lazy" />
          </div>
        ))}
      </div>
    </div>
    <footer className="gg-footer">
      <div className="gg-footer__issue">Are you an HQ'er with some cool footage?</div>
      <button className="gg-footer__btn">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
          <polyline points="17 8 12 3 7 8" />
          <line x1="12" y1="3" x2="12" y2="15" />
        </svg>
        Upload
      </button>
      <button className="gg-footer__btn" aria-label="Fullscreen gallery">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M8 3H5a2 2 0 00-2 2v3m18 0V5a2 2 0 00-2-2h-3m0 18h3a2 2 0 002-2v-3M3 16v3a2 2 0 002 2h3" />
        </svg>
        Fullscreen
      </button>
    </footer>
  </div>
);

export default function WallOfCoolGalleryGradientVariations() {
  return (
    <div className="gg-page">
      <header className="gg-topnav">
        <div className="gg-topnav__title">Wall of Cool — Gallery Gradient · 10</div>
        <nav className="gg-topnav__links">
          <a className="gg-topnav__back" href="/wall-of-cool-gradient-variations">← Strip Gradient</a>
          {VARIATIONS.map((v) => (
            <a key={v.id} href={`#${v.id}`}>{v.id.toUpperCase()}</a>
          ))}
        </nav>
      </header>

      {VARIATIONS.map((v) => (
        <section className="gg-variant" data-variant={v.id} id={v.id} key={v.id}>
          <div className="gg-variant__sticky">
            <div className="gg-variant__label">
              <span className="gg-variant__number">{v.id.toUpperCase()}</span>
              <div>
                <h2 className="gg-variant__title">{v.title}</h2>
                <p className="gg-variant__desc">{v.desc}</p>
              </div>
            </div>
            <div className="gg-variant__canvas">
              <Layout variantId={v.id} />
            </div>
          </div>
        </section>
      ))}

      <style>{`
        .gg-page { font-family: 'Space Grotesk', -apple-system, sans-serif; background: #faf9f6; min-height: 100vh; color: #1a1a1a; }

        .gg-topnav { position: sticky; top: 0; z-index: 100; display: flex; align-items: center; justify-content: space-between; gap: 1rem; padding: 0.65rem 1.25rem; background: rgba(255,255,255,0.92); backdrop-filter: blur(10px); border-bottom: 1px solid #e5e7eb; }
        .gg-topnav__title { font-weight: 600; font-size: 0.9rem; }
        .gg-topnav__links { display: flex; gap: 0.35rem; flex-wrap: wrap; }
        .gg-topnav__links a { display: inline-block; padding: 0.25rem 0.55rem; border: 1px solid #e5e7eb; border-radius: 4px; font-family: 'Share Tech Mono', monospace; font-size: 0.7rem; letter-spacing: 0.05em; text-decoration: none; color: #333; background: #fff; }
        .gg-topnav__back { background: #1a1a1a !important; color: #fff !important; border-color: #1a1a1a !important; }
        .gg-topnav__links a:hover { background: #1a1a1a; color: #fff; }

        .gg-variant { position: relative; height: 150vh; padding: 2rem 1.5rem 0; }
        .gg-variant__sticky { position: sticky; top: 70px; display: flex; flex-direction: column; gap: 0.9rem; height: calc(100vh - 90px); }
        .gg-variant__label { flex: 0 0 auto; display: flex; align-items: flex-start; gap: 0.9rem; }
        .gg-variant__number { display: inline-flex; align-items: center; justify-content: center; min-width: 56px; height: 40px; padding: 0 0.55rem; background: #1a1a1a; color: #fff; border-radius: 6px; font-family: 'Share Tech Mono', monospace; font-size: 0.7rem; letter-spacing: 0.1em; }
        .gg-variant__title { margin: 0; font-size: 1.1rem; font-weight: 600; }
        .gg-variant__desc { margin: 0.2rem 0 0; color: #666; font-size: 0.82rem; max-width: 820px; }
        .gg-variant__canvas { flex: 1 1 auto; min-height: 0; display: flex; }
        .gg-variant__canvas > * { width: 100%; }

        .gg-stack { display: flex; flex-direction: column; height: 100%; }
        .gg-gallery { flex: 1 1 auto; position: relative; overflow: hidden; border-radius: 10px; }
        .gg-grid { display: grid; grid-template-columns: repeat(3, 1fr); grid-template-rows: repeat(3, 1fr); gap: 8px; padding: 8px; height: 100%; }
        .gg-cell { position: relative; overflow: hidden; border-radius: 8px; border: 1px solid rgba(255,255,255,0.22); background: #1a1a1a; }
        .gg-cell--img img { width: 100%; height: 100%; object-fit: cover; display: block; }

        .gg-footer { flex: 0 0 auto; display: flex; flex-wrap: wrap; align-items: center; justify-content: center; gap: 1rem; padding: 0.9rem 1.25rem; margin-top: 8px; background: #1a1a1a; color: #fff; border-radius: 10px; }
        .gg-footer__issue { flex: 1 1 auto; min-width: 160px; font-size: 0.85rem; color: rgba(255,255,255,0.85); }
        .gg-footer__btn { display: inline-flex; align-items: center; gap: 0.45rem; padding: 0.45rem 0.85rem; background: transparent; border: 1px solid rgba(255,255,255,0.25); border-radius: 6px; color: #fff; font-family: 'Share Tech Mono', monospace; font-size: 0.72rem; letter-spacing: 0.08em; text-transform: uppercase; cursor: pointer; }
        .gg-footer__btn:hover { background: rgba(255,255,255,0.1); }

        /* Centre card (helicopter sky strip + clean text) */
        .gg-cell--final { background: #fff; color: #0a0a0a; border: 1px solid rgba(0,0,0,0.1); padding: 0; display: flex; flex-direction: column; align-items: center; justify-content: center; }
        .gg-heli-strip {
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
        .gg-heli { display: block; width: 32%; max-width: 100px; height: auto; margin: 0; }
        .gg-title-strip { width: 100%; padding: 0.55rem 0.9rem; display: flex; flex-direction: column; align-items: center; gap: 0.25rem; text-align: center; }
        .gg-title { margin: 0; font-family: 'Inter', sans-serif; font-weight: 800; font-size: clamp(1.05rem, 2.2vw, 1.7rem); line-height: 1; letter-spacing: -0.005em; text-transform: uppercase; }
        .gg-subtitle { font-family: 'Share Tech Mono', monospace; font-size: 0.6rem; letter-spacing: 0.22em; text-transform: uppercase; color: #6b7280; }
        .gg-nav-wrap { padding: 0.55rem 0.9rem 0.85rem; margin-top: auto; }

        .gg-nav { display: flex; align-items: center; gap: 0.55rem; }
        .gg-chevron { width: 28px; height: 28px; display: inline-flex; align-items: center; justify-content: center; border-radius: 50%; border: 1px solid rgba(0,0,0,0.25); background: transparent; color: #0a0a0a; cursor: pointer; font-size: 0.65rem; }
        .gg-chevron:disabled { opacity: 0.32; cursor: not-allowed; }
        .gg-chevron:hover:not(:disabled) { background: rgba(0,0,0,0.05); }
        .gg-count { font-family: 'Share Tech Mono', monospace; font-size: 0.72rem; letter-spacing: 0.12em; min-width: 3.2rem; text-align: center; color: #0a0a0a; }

        /* ============ Gallery gradient variants ============ */

        /* GG1 — Sky to Dusk */
        .gg-gallery--gg1 {
          background: linear-gradient(180deg,
            #ffffff 0%,
            #cfeafd 28%,
            #87CEFA 50%,
            #2a4a66 78%,
            #000000 100%
          );
        }

        /* GG2 — Sunrise */
        .gg-gallery--gg2 {
          background: linear-gradient(180deg,
            #fff7e8 0%,
            #ffd9a8 28%,
            #f08c5b 55%,
            #5a1a3a 82%,
            #0a0a0a 100%
          );
        }

        /* GG3 — Slate */
        .gg-gallery--gg3 {
          background: linear-gradient(180deg,
            #ffffff 0%,
            #d4d4d8 25%,
            #71717a 55%,
            #27272a 82%,
            #0a0a0a 100%
          );
        }

        /* GG4 — Horizon Inversion */
        .gg-gallery--gg4 {
          background: linear-gradient(180deg,
            #87CEFA 0%,
            #cfeafd 22%,
            #ffffff 48%,
            #4a4a4a 75%,
            #0a0a0a 100%
          );
        }

        /* GG5 — Diagonal Sunrise */
        .gg-gallery--gg5 {
          background: linear-gradient(135deg,
            #fff7e8 0%,
            #ffc890 28%,
            #ff8a65 55%,
            #2a3a6a 85%,
            #0a0a0a 100%
          );
        }

        /* GG6 — Radial Spotlight */
        .gg-gallery--gg6 {
          background: radial-gradient(ellipse 80% 90% at 50% 28%,
            #ffffff 0%,
            #d4d4d8 28%,
            #525252 60%,
            #0a0a0a 100%
          );
        }

        /* GG7 — Top-Edge Vignette */
        .gg-gallery--gg7 {
          background: radial-gradient(ellipse 130% 100% at 50% 0%,
            #ffffff 0%,
            #cfeafd 22%,
            #6b6b6b 60%,
            #0a0a0a 100%
          );
        }

        /* GG8 — Conic Sweep */
        .gg-gallery--gg8 {
          background: conic-gradient(from 200deg at 50% 50%,
            #ffffff,
            #cfeafd,
            #87CEFA,
            #2a4a66,
            #0a0a0a,
            #2a4a66,
            #87CEFA,
            #cfeafd,
            #ffffff
          );
        }

        /* GG9 — Polar Light */
        .gg-gallery--gg9 {
          background: linear-gradient(180deg,
            #f4faf7 0%,
            #c8e8df 25%,
            #6fb5c8 50%,
            #2a4a6a 78%,
            #0a1a2a 100%
          );
        }

        /* GG10 — Hard Bands */
        .gg-gallery--gg10 {
          background: linear-gradient(180deg,
            #ffffff 0%,
            #ffffff 33%,
            #888 33%,
            #888 66%,
            #1a1a1a 66%,
            #1a1a1a 100%
          );
        }

        @media (max-width: 768px) {
          .gg-variant { height: 130vh; }
          .gg-variant__title { font-size: 1rem; }
          .gg-variant__desc { font-size: 0.75rem; }
        }
      `}</style>
    </div>
  );
}

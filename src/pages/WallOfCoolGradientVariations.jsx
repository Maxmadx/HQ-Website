import React from 'react';

const IMAGES = [
  { src: '/assets/images/gallery/social/img-20241004-wa0001.jpg', alt: 'Community' },
  { src: '/assets/images/gallery/flying/flying--1.jpg', alt: 'Flying' },
  { src: '/assets/images/gallery/social/img-20230425-wa0001.jpg', alt: 'Team' },
  { src: '/assets/images/expeditions/north-pole.jpg', alt: 'North Pole' },
  { src: '/assets/images/expeditions/six-helis-in-North-Pole.jpg', alt: 'Expedition' },
  { src: '/assets/images/lifestyle/superyacht-ops.jpg', alt: 'Superyacht' },
  { src: '/assets/images/facility/fleet-lineup-sunset.jpg', alt: 'Fleet' },
  { src: '/assets/images/gallery/flying/james-shadow-night.jpg', alt: 'Night flying' },
];

const R66_SRC = '/assets/images/icons/r66-icon-transparent going right.svg';

const VARIATIONS = [
  { id: 'gr1',  title: 'Symmetric Edge Fade',     desc: 'Dark only on the very left and very right edges, fully transparent through the centre.' },
  { id: 'gr2',  title: 'Single-Side Sweep',       desc: 'Heaviest at the left edge, gracefully fading away to nothing past the centre.' },
  { id: 'gr3',  title: 'Vertical Cap',            desc: 'Darker along the top of the strip, fading down to transparent — like a soft drop shadow above the text.' },
  { id: 'gr4',  title: 'Radial Halo',             desc: 'Radial gradient — a soft dark ring hugs the strip, the text sits in a clear elliptical spotlight.' },
  { id: 'gr5',  title: 'Hard-Edge Tabs',          desc: 'Sharp solid blocks at both ends with no fade — graphic, punchy.' },
  { id: 'gr6',  title: 'Sky-Blue Tint',           desc: 'Lightskyblue carries the strip instead of grey. Picks up the gallery gradient if you\'re using the sky variant.' },
  { id: 'gr7',  title: 'Light Streak',            desc: 'Pale highlight in the middle (whiter than the card body) flanked by faint grey — like sun glare across a surface.' },
  { id: 'gr8',  title: 'Diagonal Fade',           desc: '135° gradient — corners hold the grey, the text sits in a diagonal clearing.' },
  { id: 'gr9',  title: 'Soft Continuous',         desc: 'Gentle gradient that never reaches transparent. Quieter and more uniform; the strip stays as one band.' },
  { id: 'gr10', title: 'Pinstripe Pair',          desc: 'Two thin grey rules on each end of the strip with hard transparent gaps between them — editorial detailing.' },
  { id: 'gr11', title: 'Title Bar Above Grid',    desc: 'Compact GR10-style title card sits across the top, with two rows of three images below it (same width as the bar).' },
  { id: 'gr12', title: 'Chevrons Beside Strip',   desc: 'Same as GR10, but with prev/next chevrons positioned on either side of the centred title strip.' },
];

const Chevrons = () => (
  <div className="gv-nav">
    <button className="gv-chevron" aria-label="Previous page" disabled>
      <i className="fas fa-chevron-left" />
    </button>
    <span className="gv-count">01 / 04</span>
    <button className="gv-chevron" aria-label="Next page">
      <i className="fas fa-chevron-right" />
    </button>
  </div>
);

const CenterCard = ({ id }) => (
  <div className={`gv-cell gv-cell--final gv-cell--${id}`}>
    <img className="gv-heli" src={R66_SRC} alt="" aria-hidden="true" />
    {id === 'gr12' && (
      <button className="gv-strip-chevron gv-strip-chevron--left" aria-label="Previous">
        <i className="fas fa-chevron-left" />
      </button>
    )}
    <div className="gv-title-strip">
      <h2 className="gv-title">Community Wall</h2>
      <span className="gv-subtitle">Helicopter Adventures</span>
    </div>
    {id === 'gr12' && (
      <button className="gv-strip-chevron gv-strip-chevron--right" aria-label="Next">
        <i className="fas fa-chevron-right" />
      </button>
    )}
  </div>
);

const Gr11Gallery = () => {
  const [expanded, setExpanded] = React.useState(false);
  return (
    <div className={`gv-gallery gv-gallery--gr11 ${expanded ? 'gv-gallery--gr11-expanded' : 'gv-gallery--gr11-collapsed'}`}>
      <div className="gv-cell gv-cell--final gv-cell--gr10 gv-cell--gr11-titlebar">
        <div className="gv-title-strip">
          <h2 className="gv-title">Community Wall</h2>
          <span className="gv-subtitle">Helicopter Adventures</span>
        </div>
      </div>
      {expanded ? (
        <div className="gv-grid gv-grid--gr11">
          {IMAGES.slice(0, 6).map((img, i) => (
            <div className="gv-cell gv-cell--img" key={`gr11-${i}`}>
              <img src={img.src} alt={img.alt} loading="lazy" />
            </div>
          ))}
        </div>
      ) : (
        <button
          type="button"
          className="gv-gr11-teaser"
          onClick={() => setExpanded(true)}
          aria-expanded="false"
        >
          <div className="gv-gr11-teaser__strip">
            {IMAGES.slice(0, 6).map((img, i) => (
              <div className="gv-gr11-teaser__cell" key={`teaser-${i}`}>
                <img src={img.src} alt="" loading="lazy" />
              </div>
            ))}
          </div>
        </button>
      )}
    </div>
  );
};

const Layout = ({ variantId }) => (
  <div className="gv-stack">
    {variantId === 'gr11' ? (
      <Gr11Gallery />
    ) : (
      <div className="gv-gallery">
        <div className="gv-grid">
          {IMAGES.slice(0, 4).map((img, i) => (
            <div className="gv-cell gv-cell--img" key={`a-${i}`}>
              <img src={img.src} alt={img.alt} loading="lazy" />
            </div>
          ))}
          <CenterCard id={variantId} />
          {IMAGES.slice(4).map((img, i) => (
            <div className="gv-cell gv-cell--img" key={`b-${i}`}>
              <img src={img.src} alt={img.alt} loading="lazy" />
            </div>
          ))}
        </div>
      </div>
    )}
    <footer className="gv-footer">
      <div className="gv-footer__issue">Are you an HQ'er with some cool footage?</div>
      <Chevrons />
      <button className="gv-footer__btn">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
          <polyline points="17 8 12 3 7 8" />
          <line x1="12" y1="3" x2="12" y2="15" />
        </svg>
        Upload
      </button>
      <button className="gv-footer__btn" aria-label="Fullscreen gallery">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M8 3H5a2 2 0 00-2 2v3m18 0V5a2 2 0 00-2-2h-3m0 18h3a2 2 0 002-2v-3M3 16v3a2 2 0 002 2h3" />
        </svg>
        Fullscreen
      </button>
    </footer>
  </div>
);

export default function WallOfCoolGradientVariations() {
  return (
    <div className="gv-page">
      <header className="gv-topnav">
        <div className="gv-topnav__title">Wall of Cool — Title-Strip Gradient · 10</div>
        <nav className="gv-topnav__links">
          <a className="gv-topnav__back" href="/wall-of-cool-final-card-r66">← R66 card</a>
          {VARIATIONS.map((v) => (
            <a key={v.id} href={`#${v.id}`}>{v.id.toUpperCase()}</a>
          ))}
        </nav>
      </header>

      {VARIATIONS.map((v) => (
        <section className="gv-variant" data-variant={v.id} id={v.id} key={v.id}>
          <div className="gv-variant__sticky">
            <div className="gv-variant__label">
              <span className="gv-variant__number">{v.id.toUpperCase()}</span>
              <div>
                <h2 className="gv-variant__title">{v.title}</h2>
                <p className="gv-variant__desc">{v.desc}</p>
              </div>
            </div>
            <div className="gv-variant__canvas">
              <Layout variantId={v.id} />
            </div>
          </div>
        </section>
      ))}

      <style>{`
        .gv-page { font-family: 'Space Grotesk', -apple-system, sans-serif; background: #faf9f6; min-height: 100vh; color: #1a1a1a; }

        .gv-topnav { position: sticky; top: 0; z-index: 100; display: flex; align-items: center; justify-content: space-between; gap: 1rem; padding: 0.65rem 1.25rem; background: rgba(255,255,255,0.92); backdrop-filter: blur(10px); border-bottom: 1px solid #e5e7eb; }
        .gv-topnav__title { font-weight: 600; font-size: 0.9rem; }
        .gv-topnav__links { display: flex; gap: 0.35rem; flex-wrap: wrap; }
        .gv-topnav__links a { display: inline-block; padding: 0.25rem 0.55rem; border: 1px solid #e5e7eb; border-radius: 4px; font-family: 'Share Tech Mono', monospace; font-size: 0.7rem; letter-spacing: 0.05em; text-decoration: none; color: #333; background: #fff; }
        .gv-topnav__back { background: #1a1a1a !important; color: #fff !important; border-color: #1a1a1a !important; }
        .gv-topnav__links a:hover { background: #1a1a1a; color: #fff; }

        .gv-variant { position: relative; height: 150vh; padding: 2rem 1.5rem 0; }
        .gv-variant__sticky { position: sticky; top: 70px; display: flex; flex-direction: column; gap: 0.9rem; height: calc(100vh - 90px); }
        .gv-variant__label { flex: 0 0 auto; display: flex; align-items: flex-start; gap: 0.9rem; }
        .gv-variant__number { display: inline-flex; align-items: center; justify-content: center; min-width: 56px; height: 40px; padding: 0 0.55rem; background: #1a1a1a; color: #fff; border-radius: 6px; font-family: 'Share Tech Mono', monospace; font-size: 0.7rem; letter-spacing: 0.1em; }
        .gv-variant__title { margin: 0; font-size: 1.1rem; font-weight: 600; }
        .gv-variant__desc { margin: 0.2rem 0 0; color: #666; font-size: 0.82rem; max-width: 820px; }
        .gv-variant__canvas { flex: 1 1 auto; min-height: 0; display: flex; }
        .gv-variant__canvas > * { width: 100%; }

        .gv-stack { display: flex; flex-direction: column; height: 100%; }
        .gv-gallery { flex: 1 1 auto; position: relative; overflow: hidden; border-radius: 10px 10px 0 0; background: #000000; }
        .gv-grid { display: grid; grid-template-columns: repeat(3, 1fr); grid-template-rows: repeat(3, 1fr); gap: 0; padding: 0; height: 100%; }
        .gv-cell { position: relative; overflow: hidden; border-radius: 0; border: 1px solid #ffffff; background: #1a1a1a; }
        .gv-cell--img img { width: 100%; height: 100%; object-fit: cover; display: block; }

        .gv-footer { position: relative; flex: 0 0 auto; display: flex; flex-wrap: wrap; align-items: center; justify-content: center; gap: 1rem; padding: 0.9rem 1.25rem; margin-top: 0; background: #1a1a1a; color: #fff; border-radius: 0 0 10px 10px; border-bottom: 1px solid #9ca3af; border-left: 1px solid #9ca3af; border-right: 1px solid #9ca3af; }
        .gv-footer .gv-nav { position: absolute; left: 50%; top: 50%; transform: translate(-50%, -50%); }
        .gv-footer__issue { flex: 1 1 auto; min-width: 160px; font-size: 0.85rem; color: rgba(255,255,255,0.85); }
        .gv-footer__btn { display: inline-flex; align-items: center; gap: 0.45rem; padding: 0.45rem 0.85rem; background: transparent; border: 1px solid rgba(255,255,255,0.25); border-radius: 6px; color: #fff; font-family: 'Share Tech Mono', monospace; font-size: 0.72rem; letter-spacing: 0.08em; text-transform: uppercase; cursor: pointer; }
        .gv-footer__btn:hover { background: rgba(255,255,255,0.1); }

        /* Shared chevrons */
        .gv-nav { display: flex; align-items: center; gap: 0.55rem; }
        .gv-chevron { width: 28px; height: 28px; display: inline-flex; align-items: center; justify-content: center; border-radius: 50%; border: 1px solid rgba(0,0,0,0.25); background: transparent; color: #0a0a0a; cursor: pointer; font-size: 0.65rem; }
        .gv-chevron:disabled { opacity: 0.32; cursor: not-allowed; }
        .gv-chevron:hover:not(:disabled) { background: rgba(0,0,0,0.05); }
        .gv-count { font-family: 'Share Tech Mono', monospace; font-size: 0.72rem; letter-spacing: 0.12em; min-width: 3.2rem; text-align: center; color: #0a0a0a; }

        /* Centre card shell — identical across variants */
        .gv-cell--final {
          background: #fff;
          color: #0a0a0a;
          border: 1px solid rgba(0,0,0,0.1);
          border-radius: 8px;
          padding: 0;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          margin: -6px;
          z-index: 5;
          box-shadow: 0 4px 16px rgba(0,0,0,0.15);
        }
        .gv-heli { display: block; width: 32%; max-width: 100px; height: auto; margin: auto auto 0.5rem; }
        .gv-title-strip {
          width: 100%;
          padding: 0.55rem 0.9rem;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 0.25rem;
          text-align: center;
        }
        .gv-title { margin: 0; font-family: 'Inter', sans-serif; font-weight: 800; font-size: clamp(1.05rem, 2.2vw, 1.7rem); line-height: 1; letter-spacing: -0.005em; text-transform: uppercase; }
        .gv-subtitle { font-family: 'Share Tech Mono', monospace; font-size: 0.6rem; letter-spacing: 0.22em; text-transform: uppercase; color: #6b7280; }

        /* Chevrons live in the footer now — re-tone for the dark footer bar */
        .gv-footer .gv-chevron { border-color: rgba(255,255,255,0.28); color: #fff; }
        .gv-footer .gv-chevron:hover:not(:disabled) { background: rgba(255,255,255,0.1); }
        .gv-footer .gv-count { color: #fff; }

        /* ============ Gradient variants — only the .gv-title-strip background changes ============ */

        /* GR1 — Symmetric Edge Fade */
        .gv-cell--gr1 .gv-title-strip {
          background: linear-gradient(90deg,
            rgba(0,0,0,0.085) 0%,
            rgba(0,0,0,0.08) 6%,
            rgba(0,0,0,0) 22%,
            rgba(0,0,0,0) 78%,
            rgba(0,0,0,0.08) 94%,
            rgba(0,0,0,0.085) 100%
          );
        }

        /* GR2 — Single-Side Sweep */
        .gv-cell--gr2 .gv-title-strip {
          background: linear-gradient(90deg,
            rgba(0,0,0,0.13) 0%,
            rgba(0,0,0,0.07) 25%,
            rgba(0,0,0,0.02) 55%,
            rgba(0,0,0,0) 80%
          );
        }

        /* GR3 — Vertical Cap */
        .gv-cell--gr3 .gv-title-strip {
          background: linear-gradient(180deg,
            rgba(0,0,0,0.13) 0%,
            rgba(0,0,0,0.05) 45%,
            rgba(0,0,0,0) 100%
          );
        }

        /* GR4 — Radial Halo */
        .gv-cell--gr4 .gv-title-strip {
          background: radial-gradient(ellipse 65% 130% at 50% 50%,
            rgba(0,0,0,0) 0%,
            rgba(0,0,0,0) 35%,
            rgba(0,0,0,0.06) 70%,
            rgba(0,0,0,0.11) 100%
          );
        }

        /* GR5 — Hard-Edge Tabs */
        .gv-cell--gr5 .gv-title-strip {
          background: linear-gradient(90deg,
            rgba(0,0,0,0.12) 0%,
            rgba(0,0,0,0.12) 10%,
            rgba(0,0,0,0) 10%,
            rgba(0,0,0,0) 90%,
            rgba(0,0,0,0.12) 90%,
            rgba(0,0,0,0.12) 100%
          );
        }

        /* GR6 — Sky-Blue Tint */
        .gv-cell--gr6 .gv-title-strip {
          background: linear-gradient(90deg,
            rgba(135, 206, 250, 0.45) 0%,
            rgba(135, 206, 250, 0.35) 12%,
            rgba(135, 206, 250, 0) 35%,
            rgba(135, 206, 250, 0) 65%,
            rgba(135, 206, 250, 0.35) 88%,
            rgba(135, 206, 250, 0.45) 100%
          );
        }

        /* GR7 — Light Streak */
        .gv-cell--gr7 .gv-title-strip {
          background: linear-gradient(90deg,
            rgba(0,0,0,0.06) 0%,
            rgba(0,0,0,0.06) 25%,
            rgba(255,255,255,0.85) 50%,
            rgba(0,0,0,0.06) 75%,
            rgba(0,0,0,0.06) 100%
          );
        }

        /* GR8 — Diagonal Fade */
        .gv-cell--gr8 .gv-title-strip {
          background: linear-gradient(135deg,
            rgba(0,0,0,0.12) 0%,
            rgba(0,0,0,0.06) 25%,
            rgba(0,0,0,0) 50%,
            rgba(0,0,0,0.06) 75%,
            rgba(0,0,0,0.12) 100%
          );
        }

        /* GR9 — Soft Continuous */
        .gv-cell--gr9 .gv-title-strip {
          background: linear-gradient(90deg,
            rgba(0,0,0,0.07) 0%,
            rgba(0,0,0,0.04) 50%,
            rgba(0,0,0,0.07) 100%
          );
        }

        /* GR10 — Pinstripe Pair (refined) */
        /* Pinstripes span the entire height of the cell. Title strip is
           vertically centred; helicopter sits just above it. */
        .gv-cell--gr10 {
          background-color: #fff;
          box-shadow: 0 2px 6px rgba(0,0,0,0.08), 0 8px 24px rgba(0,0,0,0.12);
        }
        .gv-cell--gr10 .gv-title-strip {
          position: absolute;
          top: 50%;
          left: 0;
          right: 0;
          transform: translateY(-50%);
          margin: 0;
          background: transparent;
        }
        .gv-cell--gr10 .gv-heli {
          display: none;
        }

        /* GR11 — Compact title bar above two rows of images.
           Title spans the full gallery width; image grid below is 3 cols x 2 rows. */
        .gv-gallery--gr11 { display: flex; flex-direction: column; }
        .gv-cell--gr11-titlebar {
          flex: 0 0 auto;
          margin: 0;
          z-index: 1;
          box-shadow: none;
          padding: 0.55rem 0.9rem;
          min-height: 0;
          border-radius: 10px 10px 0 0;
          border-top-color: #9ca3af;
          border-left-color: #9ca3af;
          border-right-color: #9ca3af;
          border-bottom: none;
        }
        .gv-cell--gr11-titlebar .gv-title-strip {
          position: static;
          transform: none;
          padding: 0;
          gap: 0.15rem;
        }
        .gv-cell--gr11-titlebar .gv-title {
          font-size: clamp(0.85rem, 1.6vw, 1.1rem);
        }
        .gv-cell--gr11-titlebar .gv-subtitle {
          font-size: 0.55rem;
        }
        .gv-grid--gr11 {
          flex: 1 1 auto;
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          grid-template-rows: repeat(2, 1fr);
          gap: 0;
          padding: 0;
          min-height: 0;
          border-top: 1px solid #9ca3af;
        }
        .gv-grid--gr11 .gv-cell--img:nth-child(-n+3) { border-top: none; }
        .gv-grid--gr11 .gv-cell--img:nth-child(n+4) { border-bottom: none; }
        .gv-grid--gr11 .gv-cell--img:nth-child(3n+1) { border-left-color: #9ca3af; }
        .gv-grid--gr11 .gv-cell--img:nth-child(3n)   { border-right-color: #9ca3af; }

        /* GR11 collapsed/expanded — gallery shrinks when collapsed so the
           stack and surrounding canvas don't keep its full expanded height. */
        .gv-gallery--gr11-collapsed { flex: 0 0 auto; border-radius: 10px; }
        .gv-stack:has(.gv-gallery--gr11-collapsed) {
          height: auto;
          align-self: flex-start;
        }
        .gv-stack:has(.gv-gallery--gr11-collapsed) .gv-footer { display: none; }

        /* GR11 collapsed teaser — enticing call-to-action */
        .gv-gr11-teaser {
          position: relative;
          flex: 0 0 auto;
          display: block;
          width: 100%;
          height: 160px;
          padding: 0;
          border: none;
          border-top: 1px solid #9ca3af;
          background: #0a0a0a;
          cursor: pointer;
          overflow: hidden;
          font: inherit;
          color: inherit;
          text-align: center;
        }
        .gv-gr11-teaser__strip {
          display: grid;
          grid-template-columns: repeat(6, 1fr);
          height: 100%;
          width: 100%;
          filter: brightness(0.45) saturate(0.9);
          transition: filter 0.3s ease, transform 0.4s ease;
        }
        .gv-gr11-teaser:hover .gv-gr11-teaser__strip {
          filter: brightness(0.65) saturate(1);
          transform: scale(1.015);
        }
        .gv-gr11-teaser__cell {
          position: relative;
          overflow: hidden;
        }
        .gv-gr11-teaser__cell img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          object-position: center 50%;
          transform: scale(1.6);
          display: block;
        }

        /* GR12 — same as GR10 (white card, centred strip) but with prev/next
           chevrons positioned on either side of the title strip. */
        .gv-cell--gr12 {
          background-color: #fff;
          box-shadow: 0 2px 6px rgba(0,0,0,0.08), 0 8px 24px rgba(0,0,0,0.12);
        }
        .gv-cell--gr12 .gv-title-strip {
          position: absolute;
          top: 50%;
          left: 0;
          right: 0;
          transform: translateY(-50%);
          margin: 0;
          background: transparent;
        }
        .gv-cell--gr12 .gv-heli { display: none; }
        .gv-cell--gr12 .gv-strip-chevron {
          position: absolute;
          top: 50%;
          transform: translateY(-50%);
          width: 30px;
          height: 30px;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          border: 1px solid rgba(0,0,0,0.2);
          border-radius: 50%;
          background: rgba(255,255,255,0.95);
          color: #1a1a1a;
          cursor: pointer;
          font-size: 0.7rem;
          z-index: 3;
        }
        .gv-cell--gr12 .gv-strip-chevron--left { left: 8px; }
        .gv-cell--gr12 .gv-strip-chevron--right { right: 8px; }
        .gv-cell--gr12 .gv-strip-chevron:hover { background: #fff; }

        @media (max-width: 768px) {
          .gv-variant { height: 130vh; }
          .gv-variant__title { font-size: 1rem; }
          .gv-variant__desc { font-size: 0.75rem; }
        }
      `}</style>
    </div>
  );
}

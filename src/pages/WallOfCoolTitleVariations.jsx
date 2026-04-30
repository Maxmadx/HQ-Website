import React, { useEffect } from 'react';

const IMAGES = [
  { src: '/assets/images/gallery/social/img-20241004-wa0001.jpg', alt: 'Community' },
  { src: '/assets/images/gallery/flying/foggy-evening-flying.jpg', alt: 'Flying' },
  { src: '/assets/images/gallery/social/img-20230425-wa0001.jpg', alt: 'Team' },
  { src: '/assets/images/expeditions/north-pole.jpg', alt: 'North Pole' },
  { src: '/assets/images/expeditions/antartica.jpg', alt: 'Antarctica' },
  { src: '/assets/images/expeditions/six-helis-in-North-Pole.jpg', alt: 'Expedition' },
  { src: '/assets/images/lifestyle/superyacht-ops.jpg', alt: 'Superyacht' },
  { src: '/assets/images/facility/fleet-lineup-sunset.jpg', alt: 'Fleet' },
  { src: '/assets/images/gallery/flying/james-shadow-night.jpg', alt: 'Night flying' },
];

const VARIATIONS = [
  { id: 't1', title: 'Classic Top Header', desc: 'Centered pretitle + title above the gallery (current baseline).' },
  { id: 't2', title: 'Huge Display Title', desc: 'Oversized display type above; meta line below.' },
  { id: 't3', title: 'Left-Aligned + Counter', desc: 'Title flush left with a monospace page counter on the right.' },
  { id: 't4', title: 'Vertical Left Spine', desc: 'Title rotated 90°, running up the left side of the gallery.' },
  { id: 't5', title: 'Floating Glass Badge', desc: 'Frosted-glass pill in the gallery’s top-left corner.' },
  { id: 't6', title: 'Split Across Top', desc: 'Title broken into two words with a hairline divider spanning between.' },
  { id: 't7', title: 'Bottom Bar', desc: 'Title moved below the gallery as a caption-style footer.' },
  { id: 't8', title: 'Title as First Cell', desc: 'Top-left grid cell is replaced with a typographic title block.' },
  { id: 't9', title: 'Giant Outline Behind', desc: 'Oversized stroked title peeks out above the gallery as a backdrop.' },
  { id: 't10', title: 'Corner Tag Inside', desc: 'Compact editorial tag anchored inside the gallery’s bottom-left.' },
  { id: 't11', title: 'Title as Center Cell', desc: 'The middle cell of the 3×3 grid is replaced with a title card the exact size of an image cell.' },
  { id: 't12', title: 'Detached — No Card', desc: 'Title floats above with whitespace, gallery has no border or rounded corners. Pure photo grid.' },
  { id: 't13', title: 'Glass Overlay Bar', desc: 'Full-width frosted-glass title bar sitting OVER the top of the photo grid.' },
  { id: 't14', title: 'No Title — Issue Stamp', desc: 'Title removed entirely; only a tiny editorial "ISSUE No. 02" stamp anchors the gallery.' },
  { id: 't15', title: 'Full-Bleed Dark Banner', desc: 'Edge-to-edge black banner with a big serif display title above the gallery.' },
  { id: 't16', title: 'Section Heading Outside', desc: 'Gallery has no card chrome — just photos. Title sits above as a normal section heading.' },
  { id: 't17', title: 'Magazine Masthead', desc: 'Left-aligned stacked editorial typography: issue, date, title — like a newsprint masthead.' },
  { id: 't18', title: 'Reveal — Rows Slide In', desc: 'Title sits behind the gallery. Top row slides in from the left, bottom row from the right. As they meet, they cover the title.' },
];

const Grid = () => (
  <div className="tv-grid">
    {IMAGES.map((img, i) => (
      <div className="tv-cell" key={i}>
        <img src={img.src} alt={img.alt} loading="lazy" />
      </div>
    ))}
  </div>
);

const Pretitle = () => <div className="tv-pretitle">Community</div>;
const Title = ({ className = '' }) => <h2 className={`tv-title ${className}`}>Wall of Cool</h2>;

const renderVariant = (id) => {
  switch (id) {
    case 't1':
      return (
        <div className="tv-stack">
          <header className="tv-header tv-header--classic">
            <Pretitle />
            <Title />
          </header>
          <div className="tv-gallery"><Grid /></div>
        </div>
      );
    case 't2':
      return (
        <div className="tv-stack">
          <header className="tv-header tv-header--display">
            <h2 className="tv-title-huge">Wall of Cool</h2>
            <div className="tv-display-meta">Community · 01 — 04</div>
          </header>
          <div className="tv-gallery"><Grid /></div>
        </div>
      );
    case 't3':
      return (
        <div className="tv-stack">
          <header className="tv-header tv-header--left">
            <div>
              <Pretitle />
              <Title />
            </div>
            <span className="tv-counter">01 / 04</span>
          </header>
          <div className="tv-gallery"><Grid /></div>
        </div>
      );
    case 't4':
      return (
        <div className="tv-row tv-row--vertical-left">
          <div className="tv-vertical">
            <span className="tv-pretitle tv-pretitle--vert">Community</span>
            <h2 className="tv-title tv-title--vert">Wall of Cool</h2>
          </div>
          <div className="tv-gallery tv-gallery--flex"><Grid /></div>
        </div>
      );
    case 't5':
      return (
        <div className="tv-gallery tv-gallery--has-badge">
          <div className="tv-badge">
            <Pretitle />
            <Title />
          </div>
          <Grid />
        </div>
      );
    case 't6':
      return (
        <div className="tv-stack">
          <header className="tv-header tv-header--split">
            <span className="tv-split-word">Wall</span>
            <span className="tv-split-line" aria-hidden="true" />
            <span className="tv-split-word">Of Cool</span>
          </header>
          <div className="tv-gallery"><Grid /></div>
        </div>
      );
    case 't7':
      return (
        <div className="tv-stack">
          <div className="tv-gallery"><Grid /></div>
          <footer className="tv-header tv-header--bottom">
            <h2 className="tv-title">Wall of Cool</h2>
            <span className="tv-display-meta">Community · 01 / 04</span>
          </footer>
        </div>
      );
    case 't8':
      return (
        <div className="tv-gallery">
          <div className="tv-grid">
            <div className="tv-cell tv-cell--title">
              <span className="tv-pretitle">Community</span>
              <h2 className="tv-title tv-title--cell">Wall of Cool</h2>
              <span className="tv-cell-meta">01 / 04</span>
            </div>
            {IMAGES.slice(1).map((img, i) => (
              <div className="tv-cell" key={i}>
                <img src={img.src} alt={img.alt} loading="lazy" />
              </div>
            ))}
          </div>
        </div>
      );
    case 't9':
      return (
        <div className="tv-stack tv-stack--outline">
          <span className="tv-outline-title" aria-hidden="true">Wall of Cool</span>
          <div className="tv-gallery"><Grid /></div>
        </div>
      );
    case 't10':
      return (
        <div className="tv-gallery tv-gallery--has-tag">
          <Grid />
          <div className="tv-corner-tag">
            <span className="tv-corner-num">01 — 04</span>
            <h2 className="tv-corner-title">Wall of Cool</h2>
            <span className="tv-corner-sub">Community</span>
          </div>
        </div>
      );
    case 't11': {
      // Title card at grid position 5 (center of 3x3). Surrounding 8 images fill positions 1-4, 6-9.
      const surrounding = [0, 1, 2, 3, 5, 6, 7, 8].map((idx) => IMAGES[idx]);
      return (
        <div className="tv-stack">
          <div className="tv-gallery">
            <div className="tv-grid">
              {surrounding.slice(0, 4).map((img, i) => (
                <div className="tv-cell" key={`a-${i}`}>
                  <img src={img.src} alt={img.alt} loading="lazy" />
                </div>
              ))}
              <div className="tv-cell tv-cell--title tv-cell--center-title">
                <div className="tv-center-top">
                  <span className="tv-pretitle">Community</span>
                  <span className="tv-center-issue">No. 01</span>
                </div>
                <div className="tv-center-middle">
                  <span className="tv-center-kicker">The</span>
                  <h2 className="tv-title tv-title--cell tv-title--center">Wall of Cool</h2>
                  <span className="tv-center-sub">Est. 2011 · Denham</span>
                </div>
                <div className="tv-center-nav">
                  <button className="tv-center-chevron" aria-label="Previous page" disabled>
                    <i className="fas fa-chevron-left" />
                  </button>
                  <span className="tv-center-count">1 / 4</span>
                  <button className="tv-center-chevron" aria-label="Next page">
                    <i className="fas fa-chevron-right" />
                  </button>
                </div>
              </div>
              {surrounding.slice(4).map((img, i) => (
                <div className="tv-cell" key={`b-${i}`}>
                  <img src={img.src} alt={img.alt} loading="lazy" />
                </div>
              ))}
            </div>
          </div>
          <footer className="tv-footer">
            <div className="tv-footer__issue">Are you an HQ'er with some cool footage?</div>
            <button className="tv-footer__btn">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                <polyline points="17 8 12 3 7 8" />
                <line x1="12" y1="3" x2="12" y2="15" />
              </svg>
              Upload
            </button>
            <button className="tv-footer__btn" aria-label="Fullscreen gallery">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M8 3H5a2 2 0 00-2 2v3m18 0V5a2 2 0 00-2-2h-3m0 18h3a2 2 0 002-2v-3M3 16v3a2 2 0 002 2h3" />
              </svg>
              Fullscreen
            </button>
          </footer>
        </div>
      );
    }
    case 't12':
      return (
        <div className="tv-stack tv-stack--detached">
          <header className="tv-detached-header">
            <Pretitle />
            <Title className="tv-title--detached" />
          </header>
          <div className="tv-gallery tv-gallery--bare"><Grid /></div>
        </div>
      );
    case 't13':
      return (
        <div className="tv-stack">
          <div className="tv-gallery tv-gallery--has-overlay">
            <div className="tv-overlay-bar">
              <Pretitle />
              <Title className="tv-title--overlay" />
              <span className="tv-overlay-meta">No. 02 · 2025</span>
            </div>
            <Grid />
          </div>
        </div>
      );
    case 't14':
      return (
        <div className="tv-stack">
          <div className="tv-gallery tv-gallery--has-stamp">
            <Grid />
            <span className="tv-issue-stamp">Issue No. 02</span>
          </div>
        </div>
      );
    case 't15':
      return (
        <div className="tv-stack">
          <div className="tv-bleed-banner">
            <span className="tv-bleed-meta">Issue 02 — Helicopter Adventures</span>
            <h2 className="tv-bleed-title">Wall of Cool</h2>
          </div>
          <div className="tv-gallery tv-gallery--banner-attached"><Grid /></div>
        </div>
      );
    case 't16':
      return (
        <div className="tv-stack tv-stack--outside">
          <header className="tv-outside-header">
            <span className="tv-pretitle">Community</span>
            <h2 className="tv-outside-title">Wall of Cool</h2>
          </header>
          <div className="tv-gallery tv-gallery--bare"><Grid /></div>
        </div>
      );
    case 't17':
      return (
        <div className="tv-stack">
          <header className="tv-masthead">
            <div className="tv-masthead-row">
              <span className="tv-masthead-issue">Issue 02</span>
              <span className="tv-masthead-rule" />
              <span className="tv-masthead-date">EST. 2011</span>
            </div>
            <h2 className="tv-masthead-title">The Wall of Cool</h2>
            <span className="tv-masthead-tagline">Photographs from the HQ Aviation community · Denham Aerodrome</span>
          </header>
          <div className="tv-gallery"><Grid /></div>
        </div>
      );
    case 't18': {
      const topRow = IMAGES.slice(0, 3);
      const bottomRow = IMAGES.slice(3, 6);
      return (
        <div className="tv-stack">
          <div className="tv-mask-shell">
            <div className="tv-mask-title-wrap">
              <span className="tv-pretitle">Community</span>
              <h2 className="tv-mask-title">Wall of Cool</h2>
              <span className="tv-mask-tagline">Helicopter Adventures</span>
            </div>
            <div className="tv-mask-grid">
              <div className="tv-mask-row tv-mask-row--top">
                {topRow.map((img, i) => (
                  <div className="tv-mask-cell" key={`top-${i}`}>
                    <img src={img.src} alt={img.alt} loading="lazy" />
                  </div>
                ))}
              </div>
              <div className="tv-mask-row tv-mask-row--bottom">
                {bottomRow.map((img, i) => (
                  <div className="tv-mask-cell" key={`bot-${i}`}>
                    <img src={img.src} alt={img.alt} loading="lazy" />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      );
    }
    default:
      return null;
  }
};

export default function WallOfCoolTitleVariations() {
  useEffect(() => {
    const wrappers = Array.from(document.querySelectorAll('.tv-variant'));
    let rafId = null;
    const update = () => {
      rafId = null;
      const vh = window.innerHeight;
      wrappers.forEach((wrapper) => {
        const sticky = wrapper.querySelector('.tv-variant__sticky');
        if (!sticky) return;
        const rect = sticky.getBoundingClientRect();
        const stickyTop = parseFloat(getComputedStyle(sticky).top) || 0;
        const start = vh * 0.65;
        const end = stickyTop;
        const range = start - end;
        const raw = range > 0 ? (start - rect.top) / range : 0;
        const p = Math.max(0, Math.min(1, raw));
        wrapper.style.setProperty('--p', p.toFixed(4));
      });
    };
    const onScroll = () => { if (rafId == null) rafId = requestAnimationFrame(update); };
    update();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);
    return () => {
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
      if (rafId) cancelAnimationFrame(rafId);
    };
  }, []);

  return (
    <div className="tv-page">
      <header className="tv-nav">
        <div className="tv-nav__title">Wall of Cool — Title Positioning (18 variants)</div>
        <nav className="tv-nav__links">
          {VARIATIONS.map((v) => (
            <a key={v.id} href={`#${v.id}`}>{v.id.toUpperCase()}</a>
          ))}
        </nav>
      </header>

      {VARIATIONS.map((v) => (
        <section className="tv-variant" data-variant={v.id} id={v.id} key={v.id}>
          <div className="tv-variant__sticky">
            <div className="tv-variant__label">
              <span className="tv-variant__number">{v.id.toUpperCase()}</span>
              <div className="tv-variant__label-text">
                <h2 className="tv-variant__title">{v.title}</h2>
                <p className="tv-variant__desc">{v.desc}</p>
              </div>
            </div>
            <div className="tv-variant__canvas">
              {renderVariant(v.id)}
            </div>
          </div>
        </section>
      ))}

      <style>{`
        .tv-page {
          font-family: 'Space Grotesk', -apple-system, sans-serif;
          background: #faf9f6;
          min-height: 100vh;
          color: #1a1a1a;
        }

        /* Top nav */
        .tv-nav {
          position: sticky;
          top: 0;
          z-index: 100;
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 1rem;
          padding: 0.65rem 1.25rem;
          background: rgba(255,255,255,0.92);
          backdrop-filter: blur(10px);
          border-bottom: 1px solid #e5e7eb;
        }
        .tv-nav__title {
          font-weight: 600;
          font-size: 0.9rem;
        }
        .tv-nav__links {
          display: flex;
          gap: 0.35rem;
          flex-wrap: wrap;
        }
        .tv-nav__links a {
          display: inline-block;
          padding: 0.25rem 0.55rem;
          border: 1px solid #e5e7eb;
          border-radius: 4px;
          font-family: 'Share Tech Mono', monospace;
          font-size: 0.7rem;
          letter-spacing: 0.05em;
          text-decoration: none;
          color: #333;
          background: #fff;
        }
        .tv-nav__links a:hover { background: #1a1a1a; color: #fff; }

        /* Variant section shell */
        .tv-variant {
          position: relative;
          height: 165vh;
          padding: 2rem 1.5rem 0;
        }
        .tv-variant__sticky {
          position: sticky;
          top: 70px;
          display: flex;
          flex-direction: column;
          gap: 0.9rem;
          height: calc(100vh - 90px);
        }
        .tv-variant__label {
          flex: 0 0 auto;
          display: flex;
          align-items: flex-start;
          gap: 0.9rem;
        }
        .tv-variant__number {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          min-width: 48px;
          height: 40px;
          padding: 0 0.55rem;
          background: #1a1a1a;
          color: #fff;
          border-radius: 6px;
          font-family: 'Share Tech Mono', monospace;
          font-size: 0.75rem;
          letter-spacing: 0.08em;
          flex-shrink: 0;
        }
        .tv-variant__title { margin: 0; font-size: 1.1rem; font-weight: 600; }
        .tv-variant__desc { margin: 0.2rem 0 0; color: #666; font-size: 0.82rem; }
        .tv-variant__canvas {
          flex: 1 1 auto;
          min-height: 0;
          display: flex;
        }
        .tv-variant__canvas > * { width: 100%; }

        /* Stacks & rows */
        .tv-stack {
          display: flex;
          flex-direction: column;
          height: 100%;
          gap: 0;
        }
        .tv-row--vertical-left {
          display: flex;
          height: 100%;
          gap: 0.75rem;
        }

        /* Gallery + grid base (reused from animation variations) */
        .tv-gallery {
          position: relative;
          flex: 1 1 auto;
          overflow: hidden;
          border-radius: 10px;
          background: linear-gradient(to bottom, #ffffff 0%, #000000 100%);
        }
        .tv-gallery--flex { flex: 1 1 auto; }
        .tv-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          grid-template-rows: repeat(3, 1fr);
          gap: 8px;
          padding: 8px;
          height: 100%;
        }
        .tv-cell {
          position: relative;
          overflow: hidden;
          border-radius: 8px;
          border: 1px solid rgba(255,255,255,0.22);
          background: #1a1a1a;
          will-change: transform;
        }
        .tv-cell img {
          width: 100%; height: 100%;
          object-fit: cover;
          display: block;
        }

        /* Baseline animation: alternating horizontal (same for all title variants) */
        .tv-cell:nth-child(6n+1),
        .tv-cell:nth-child(6n+2),
        .tv-cell:nth-child(6n+3) {
          transform: translateX(calc((1 - var(--p, 0)) * 110vw));
        }
        .tv-cell:nth-child(6n+4),
        .tv-cell:nth-child(6n+5),
        .tv-cell:nth-child(6n) {
          transform: translateX(calc((1 - var(--p, 0)) * -110vw));
        }
        /* Title cell in T8 doesn't animate */
        .tv-cell--title { transform: none !important; }

        /* Shared type */
        .tv-pretitle {
          font-family: 'Share Tech Mono', monospace;
          font-size: 0.65rem;
          font-weight: 700;
          letter-spacing: 0.18em;
          text-transform: uppercase;
          color: #6b7280;
          margin: 0 0 4px;
        }
        .tv-title {
          margin: 0;
          font-family: 'Inter', -apple-system, sans-serif;
          font-size: 1.05rem;
          font-weight: 700;
          letter-spacing: 0.02em;
          text-transform: uppercase;
          color: #111;
        }

        /* ========= T1: Classic Top Header ========= */
        .tv-header--classic {
          display: flex;
          flex-direction: column;
          align-items: center;
          padding: 0.9rem 1rem;
          border-bottom: 1px solid rgba(0,0,0,0.08);
          background: #fff;
          text-align: center;
        }

        /* ========= T2: Huge Display Title ========= */
        .tv-header--display {
          padding: 1.25rem 1.25rem 1rem;
          border-bottom: 1px solid rgba(0,0,0,0.08);
          background: #fff;
          text-align: center;
        }
        .tv-title-huge {
          margin: 0;
          font-family: 'Inter', -apple-system, sans-serif;
          font-weight: 800;
          font-size: clamp(2.4rem, 6.5vw, 5.25rem);
          letter-spacing: -0.02em;
          line-height: 0.95;
          text-transform: uppercase;
          color: #0a0a0a;
        }
        .tv-display-meta {
          margin-top: 0.35rem;
          font-family: 'Share Tech Mono', monospace;
          font-size: 0.7rem;
          color: #6b7280;
          letter-spacing: 0.1em;
        }

        /* ========= T3: Left-Aligned + Counter ========= */
        .tv-header--left {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 0.8rem 1rem;
          border-bottom: 1px solid rgba(0,0,0,0.08);
          background: #fff;
        }
        .tv-counter {
          font-family: 'Share Tech Mono', monospace;
          font-size: 0.8rem;
          color: #111;
          letter-spacing: 0.1em;
        }

        /* ========= T4: Vertical Left Spine ========= */
        .tv-vertical {
          flex: 0 0 auto;
          display: flex;
          align-items: center;
          justify-content: center;
          writing-mode: vertical-rl;
          transform: rotate(180deg);
          padding: 0.5rem 0.25rem;
          gap: 1.25rem;
          border-right: 1px solid rgba(0,0,0,0.08);
          background: #fff;
          border-radius: 10px 0 0 10px;
        }
        .tv-pretitle--vert { margin: 0; }
        .tv-title--vert {
          font-size: 1.5rem;
          letter-spacing: 0.15em;
        }

        /* ========= T5: Floating Glass Badge ========= */
        .tv-gallery--has-badge { position: relative; }
        .tv-badge {
          position: absolute;
          top: 18px;
          left: 18px;
          z-index: 5;
          padding: 0.6rem 0.85rem;
          background: rgba(20, 20, 20, 0.55);
          backdrop-filter: blur(14px);
          -webkit-backdrop-filter: blur(14px);
          border: 1px solid rgba(255,255,255,0.2);
          border-radius: 10px;
          color: #fff;
          max-width: 240px;
        }
        .tv-badge .tv-pretitle { color: rgba(255,255,255,0.65); }
        .tv-badge .tv-title { color: #fff; }

        /* ========= T6: Split Across Top ========= */
        .tv-header--split {
          display: flex;
          align-items: center;
          gap: 1rem;
          padding: 0.95rem 1rem;
          border-bottom: 1px solid rgba(0,0,0,0.08);
          background: #fff;
        }
        .tv-split-word {
          font-family: 'Inter', -apple-system, sans-serif;
          font-weight: 700;
          font-size: clamp(1.4rem, 3.5vw, 2.4rem);
          letter-spacing: 0.05em;
          text-transform: uppercase;
          color: #0a0a0a;
          white-space: nowrap;
        }
        .tv-split-line {
          flex: 1;
          height: 1px;
          background: #1a1a1a;
          opacity: 0.35;
        }

        /* ========= T7: Bottom Bar ========= */
        .tv-header--bottom {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 0.9rem 1rem;
          border-top: 1px solid rgba(0,0,0,0.08);
          background: #fff;
        }

        /* ========= T8: Title as First Cell ========= */
        .tv-cell--title {
          background: #0a0a0a;
          border: 1px solid rgba(255,255,255,0.15);
          display: flex;
          flex-direction: column;
          justify-content: space-between;
          padding: 0.9rem;
          color: #fff;
        }
        .tv-cell--title .tv-pretitle { color: rgba(255,255,255,0.55); margin: 0; }
        .tv-cell--title .tv-cell-meta {
          font-family: 'Share Tech Mono', monospace;
          font-size: 0.7rem;
          color: rgba(255,255,255,0.5);
          letter-spacing: 0.08em;
        }
        .tv-title--cell {
          color: #fff;
          font-size: clamp(1.25rem, 2.5vw, 1.85rem);
          line-height: 1.05;
          letter-spacing: 0.01em;
          text-align: left;
          margin-top: auto;
        }

        /* ========= T9: Giant Outline Behind ========= */
        .tv-stack--outline { position: relative; }
        .tv-outline-title {
          display: block;
          font-family: 'Inter', -apple-system, sans-serif;
          font-weight: 900;
          font-size: clamp(3rem, 11vw, 9rem);
          letter-spacing: -0.03em;
          line-height: 0.85;
          text-transform: uppercase;
          color: transparent;
          -webkit-text-stroke: 1.5px #1a1a1a;
          text-stroke: 1.5px #1a1a1a;
          white-space: nowrap;
          padding: 0.25rem 0;
          margin-bottom: -1rem;
          pointer-events: none;
        }

        /* ========= T11: Title as Center Cell — editorial masthead ========= */
        .tv-cell--center-title {
          background: #ffffff;
          border: none;
          box-shadow: inset 0 1px 0 rgba(0,0,0,0.9), inset 0 -1px 0 rgba(0,0,0,0.9);
          color: #0a0a0a;
          display: flex;
          flex-direction: column;
          justify-content: space-between;
          align-items: stretch;
          text-align: center;
          gap: 0.4rem;
          padding: 0.9rem 0.9rem;
        }
        .tv-center-top {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 0.5rem;
        }
        .tv-cell--center-title .tv-pretitle {
          color: #0a0a0a;
          margin: 0;
          font-size: 0.6rem;
          letter-spacing: 0.22em;
        }
        .tv-center-issue {
          font-family: 'Share Tech Mono', monospace;
          font-size: 0.6rem;
          color: #6b7280;
          letter-spacing: 0.15em;
          text-transform: uppercase;
        }
        .tv-center-middle {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          gap: 0.25rem;
          flex: 1 1 auto;
        }
        .tv-center-kicker {
          font-family: 'Inter', -apple-system, sans-serif;
          font-style: italic;
          font-weight: 400;
          font-size: clamp(0.7rem, 1vw, 0.85rem);
          color: #4b5563;
          letter-spacing: 0.02em;
        }
        .tv-title--center {
          margin: 0;
          text-align: center;
          color: #0a0a0a;
          font-family: 'Inter', -apple-system, sans-serif;
          font-weight: 800;
          font-size: clamp(1.25rem, 2.6vw, 2.1rem);
          line-height: 0.95;
          letter-spacing: -0.01em;
          text-transform: uppercase;
        }
        .tv-center-sub {
          font-family: 'Share Tech Mono', monospace;
          font-size: 0.58rem;
          color: #6b7280;
          letter-spacing: 0.18em;
          text-transform: uppercase;
          margin-top: 0.15rem;
        }
        .tv-center-nav {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 0.55rem;
        }
        .tv-center-chevron {
          width: 26px;
          height: 26px;
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
        .tv-center-chevron:disabled { opacity: 0.3; cursor: not-allowed; }
        .tv-center-chevron:hover:not(:disabled) { background: rgba(0,0,0,0.06); }
        .tv-center-count {
          font-family: 'Share Tech Mono', monospace;
          font-size: 0.72rem;
          letter-spacing: 0.12em;
          color: #0a0a0a;
          min-width: 3rem;
          text-align: center;
        }
        /* T11: all cells are static — no slide animation */
        [data-variant="t11"] .tv-cell {
          transform: none !important;
        }

        /* ========= T11 footer ========= */
        .tv-footer {
          flex: 0 0 auto;
          display: flex;
          flex-wrap: wrap;
          align-items: center;
          justify-content: center;
          gap: 1rem;
          padding: 0.9rem 1.25rem;
          margin-top: 8px;
          background: #1a1a1a;
          color: #fff;
          border-radius: 10px;
        }
        .tv-footer__issue {
          flex: 1 1 auto;
          min-width: 160px;
          font-size: 0.85rem;
          color: rgba(255,255,255,0.85);
        }
        .tv-footer__nav {
          display: flex;
          align-items: center;
          gap: 0.55rem;
        }
        .tv-footer__chevron {
          width: 30px;
          height: 30px;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          border-radius: 50%;
          border: 1px solid rgba(255,255,255,0.2);
          background: transparent;
          color: #fff;
          cursor: pointer;
          font-size: 0.7rem;
        }
        .tv-footer__chevron:disabled { opacity: 0.4; cursor: not-allowed; }
        .tv-footer__chevron:hover:not(:disabled) { background: rgba(255,255,255,0.1); }
        .tv-footer__page-count {
          font-family: 'Share Tech Mono', monospace;
          font-size: 0.75rem;
          letter-spacing: 0.1em;
        }
        .tv-footer__btn {
          display: inline-flex;
          align-items: center;
          gap: 0.45rem;
          padding: 0.45rem 0.85rem;
          background: transparent;
          border: 1px solid rgba(255,255,255,0.25);
          border-radius: 6px;
          color: #fff;
          font-family: 'Share Tech Mono', monospace;
          font-size: 0.72rem;
          letter-spacing: 0.08em;
          text-transform: uppercase;
          cursor: pointer;
        }
        .tv-footer__btn:hover { background: rgba(255,255,255,0.1); }

        /* ========= T10: Corner Tag Inside ========= */
        .tv-gallery--has-tag { position: relative; }
        .tv-corner-tag {
          position: absolute;
          left: 18px;
          bottom: 18px;
          z-index: 5;
          display: flex;
          flex-direction: column;
          gap: 0.2rem;
          padding: 0.7rem 0.85rem;
          background: rgba(255,255,255,0.92);
          backdrop-filter: blur(8px);
          border-radius: 4px;
          border-left: 3px solid #0a0a0a;
        }
        .tv-corner-num {
          font-family: 'Share Tech Mono', monospace;
          font-size: 0.65rem;
          color: #666;
          letter-spacing: 0.1em;
        }
        .tv-corner-title {
          margin: 0;
          font-family: 'Inter', -apple-system, sans-serif;
          font-weight: 700;
          font-size: 0.95rem;
          letter-spacing: 0.02em;
          text-transform: uppercase;
          color: #0a0a0a;
        }
        .tv-corner-sub {
          font-family: 'Share Tech Mono', monospace;
          font-size: 0.62rem;
          color: #6b7280;
          letter-spacing: 0.15em;
          text-transform: uppercase;
        }

        /* ===== t12: Detached — No Card ===== */
        .tv-stack--detached { gap: 1.75rem; }
        .tv-detached-header { text-align: center; }
        .tv-title--detached {
          font-size: clamp(1.4rem, 2.6vw, 2rem);
          letter-spacing: 0.01em;
        }
        .tv-gallery--bare {
          background: transparent;
          border: none;
          border-radius: 0;
          overflow: visible;
        }
        .tv-gallery--bare .tv-grid {
          border: none;
          border-radius: 0;
        }

        /* ===== t13: Glass Overlay Bar ===== */
        .tv-gallery--has-overlay { position: relative; }
        .tv-overlay-bar {
          position: absolute;
          top: 0; left: 0; right: 0;
          z-index: 5;
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 1rem;
          padding: 0.85rem 1.25rem;
          background: rgba(255, 255, 255, 0.55);
          backdrop-filter: blur(14px) saturate(1.05);
          -webkit-backdrop-filter: blur(14px) saturate(1.05);
          border-bottom: 1px solid rgba(255, 255, 255, 0.35);
        }
        .tv-title--overlay { font-size: clamp(0.95rem, 1.4vw, 1.15rem); }
        .tv-overlay-meta {
          font-family: 'Share Tech Mono', monospace;
          font-size: 0.65rem;
          letter-spacing: 0.18em;
          text-transform: uppercase;
          color: #1a1a1a;
        }

        /* ===== t14: No Title — Issue Stamp ===== */
        .tv-gallery--has-stamp { position: relative; }
        .tv-issue-stamp {
          position: absolute;
          top: 14px;
          left: 14px;
          z-index: 5;
          padding: 0.35rem 0.6rem;
          background: rgba(0, 0, 0, 0.72);
          color: #fff;
          font-family: 'Share Tech Mono', monospace;
          font-size: 0.6rem;
          letter-spacing: 0.18em;
          text-transform: uppercase;
          border-radius: 2px;
          border: 1px solid rgba(255, 255, 255, 0.18);
        }

        /* ===== t15: Full-Bleed Dark Banner ===== */
        .tv-bleed-banner {
          background: #0a0a0a;
          color: #fff;
          padding: 2rem 1.5rem;
          text-align: center;
          border-radius: 10px 10px 0 0;
        }
        .tv-bleed-meta {
          display: block;
          font-family: 'Share Tech Mono', monospace;
          font-size: 0.7rem;
          letter-spacing: 0.22em;
          text-transform: uppercase;
          color: rgba(255, 255, 255, 0.55);
          margin-bottom: 0.75rem;
        }
        .tv-bleed-title {
          margin: 0;
          font-family: 'Times New Roman', Georgia, serif;
          font-weight: 400;
          font-style: italic;
          font-size: clamp(2rem, 5vw, 3.6rem);
          line-height: 1.05;
          letter-spacing: -0.01em;
        }
        .tv-gallery--banner-attached {
          border-top: none;
          border-radius: 0 0 10px 10px;
        }

        /* ===== t16: Section Heading Outside ===== */
        .tv-stack--outside { gap: 1.25rem; }
        .tv-outside-header { padding: 0 0.25rem; }
        .tv-outside-title {
          margin: 0.4rem 0 0;
          font-family: 'Space Grotesk', sans-serif;
          font-weight: 800;
          font-size: clamp(1.6rem, 3.2vw, 2.4rem);
          line-height: 1.1;
          letter-spacing: -0.02em;
          text-transform: uppercase;
        }

        /* ===== t17: Magazine Masthead ===== */
        .tv-masthead {
          padding: 1.25rem 0 1.5rem;
          border-bottom: 1px solid #1a1a1a;
          margin-bottom: 1rem;
          text-align: left;
        }
        .tv-masthead-row {
          display: flex;
          align-items: center;
          gap: 0.85rem;
          margin-bottom: 0.6rem;
        }
        .tv-masthead-issue,
        .tv-masthead-date {
          font-family: 'Share Tech Mono', monospace;
          font-size: 0.7rem;
          letter-spacing: 0.18em;
          text-transform: uppercase;
          color: #444;
        }
        .tv-masthead-rule {
          flex: 1 1 auto;
          height: 1px;
          background: #c8c5be;
        }
        .tv-masthead-title {
          margin: 0;
          font-family: 'Times New Roman', Georgia, serif;
          font-weight: 400;
          font-style: italic;
          font-size: clamp(2.2rem, 5.5vw, 4rem);
          line-height: 0.95;
          letter-spacing: -0.015em;
          color: #0a0a0a;
        }
        .tv-masthead-tagline {
          display: block;
          margin-top: 0.6rem;
          font-size: 0.78rem;
          color: #555;
          font-style: italic;
        }

        /* ===== t18: Reveal — Rows Slide In ===== */
        .tv-mask-shell {
          position: relative;
          overflow: hidden;
          background: #0a0a0a;
          border-radius: 10px;
          aspect-ratio: 3 / 2;
        }
        .tv-mask-title-wrap {
          position: absolute;
          inset: 0;
          z-index: 1;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          gap: 0.5rem;
          color: #fff;
          text-align: center;
          padding: 1rem;
        }
        .tv-mask-title-wrap .tv-pretitle {
          color: rgba(255, 255, 255, 0.55);
        }
        .tv-mask-title {
          margin: 0;
          font-family: 'Space Grotesk', sans-serif;
          font-weight: 800;
          font-size: clamp(2rem, 5vw, 3.6rem);
          line-height: 1;
          letter-spacing: -0.015em;
          text-transform: uppercase;
        }
        .tv-mask-tagline {
          font-family: 'Share Tech Mono', monospace;
          font-size: 0.7rem;
          letter-spacing: 0.18em;
          text-transform: uppercase;
          color: rgba(255, 255, 255, 0.55);
        }
        .tv-mask-grid {
          position: relative;
          z-index: 2;
          display: grid;
          grid-template-rows: 1fr 1fr;
          height: 100%;
        }
        .tv-mask-row {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 0;
          will-change: transform;
        }
        /* Top row enters from off-screen left → rests at 0.
           Bottom row enters from off-screen right → rests at 0.
           --p comes from the variant wrapper's scroll-progress hook. */
        .tv-mask-row--top {
          transform: translateX(calc((var(--p, 0) - 1) * 100%));
        }
        .tv-mask-row--bottom {
          transform: translateX(calc((1 - var(--p, 0)) * 100%));
        }
        .tv-mask-cell {
          overflow: hidden;
          position: relative;
        }
        .tv-mask-cell img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          display: block;
        }

        /* Mobile */
        @media (max-width: 768px) {
          .tv-variant { height: 135vh; }
          .tv-variant__title { font-size: 1rem; }
          .tv-variant__desc { font-size: 0.75rem; }
          .tv-outline-title { font-size: clamp(2rem, 14vw, 4rem); }
          .tv-row--vertical-left { flex-direction: row; gap: 0.5rem; }
          .tv-vertical { padding: 0.4rem 0.2rem; }
          .tv-title--vert { font-size: 1.1rem; }
          .tv-bleed-title { font-size: clamp(1.6rem, 8vw, 2.4rem); }
          .tv-masthead-title { font-size: clamp(1.8rem, 9vw, 2.6rem); }
          .tv-overlay-bar { padding: 0.6rem 0.85rem; }
          .tv-overlay-meta { display: none; }
          .tv-mask-title { font-size: clamp(1.6rem, 8vw, 2.4rem); }
          .tv-mask-shell { aspect-ratio: 4 / 3; }
        }
      `}</style>
    </div>
  );
}

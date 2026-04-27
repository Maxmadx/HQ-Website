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

const VARIATIONS = [
  { id: 'c1',  title: 'Quiet Wordmark',        desc: 'Full-card thin display type. Confidence through restraint — let the gallery breathe around it.' },
  { id: 'c2',  title: 'Flight Brief',          desc: 'Aviation data-card language: labelled rows (ISSUE / LOCATION / CATEGORY) in monospace with a ruled header.' },
  { id: 'c3',  title: 'Solid Dark Anchor',     desc: 'Near-black card. Anchors the grid’s centre; inverts against the light end of the gradient.' },
  { id: 'c4',  title: 'Ampersand Focal',       desc: 'Typography as the art — "Wall" above, giant italic ampersand, "Cool" below. One-glance identity.' },
  { id: 'c5',  title: 'Two-Column Split',      desc: 'Vertical hairline divides the card: title block left, issue number + nav right.' },
  { id: 'c6',  title: 'Mid-Gradient Card',     desc: 'Card tone matches the grid’s mid-grey so it feels excavated from the background, not dropped on top.' },
  { id: 'c7',  title: 'Ruled Index',           desc: 'Three horizontal zones separated by hairlines — pretitle, display title, controls. Magazine-index clarity.' },
  { id: 'c8',  title: 'Stacked Poster',        desc: 'Title stacked WALL / OF / COOL, tight leading, all caps. Reads like a framed print.' },
  { id: 'c9',  title: 'Tail Registration',     desc: 'Mono callsign "G-HQAV" dominant — directly quotes aircraft tail numbers. Aviation-native identity.' },
  { id: 'c10', title: 'Editorial № 01',        desc: 'Classical editorial — oversized serif-weight "№ 01" above a compact title lockup and fine-print credit.' },
];

const Chevrons = ({ tone = 'light' }) => (
  <div className={`cc-nav cc-nav--${tone}`}>
    <button className="cc-chevron" aria-label="Previous page" disabled>
      <i className="fas fa-chevron-left" />
    </button>
    <span className="cc-count">01 / 04</span>
    <button className="cc-chevron" aria-label="Next page">
      <i className="fas fa-chevron-right" />
    </button>
  </div>
);

const renderCenterCard = (id) => {
  switch (id) {
    /* =========================================================
       C1 — Quiet Wordmark
       ========================================================= */
    case 'c1':
      return (
        <div className="cc-cell cc-cell--c1">
          <span className="cc-c1__corner cc-c1__corner--tl">01 / 04</span>
          <span className="cc-c1__corner cc-c1__corner--tr">Community</span>
          <h2 className="cc-c1__title">Wall of Cool</h2>
          <Chevrons tone="light" />
        </div>
      );

    /* =========================================================
       C2 — Flight Brief
       ========================================================= */
    case 'c2':
      return (
        <div className="cc-cell cc-cell--c2">
          <div className="cc-c2__head">
            <span>Wall of Cool</span>
            <span>v.01</span>
          </div>
          <dl className="cc-c2__rows">
            <div><dt>Issue</dt><dd>01 / 04</dd></div>
            <div><dt>Location</dt><dd>EGLD · Denham</dd></div>
            <div><dt>Category</dt><dd>Community</dd></div>
          </dl>
          <Chevrons tone="light" />
        </div>
      );

    /* =========================================================
       C3 — Solid Dark Anchor
       ========================================================= */
    case 'c3':
      return (
        <div className="cc-cell cc-cell--c3">
          <span className="cc-c3__pretitle">Community · Est. 2011</span>
          <h2 className="cc-c3__title">Wall of Cool</h2>
          <span className="cc-c3__count">01 / 04</span>
          <Chevrons tone="dark" />
        </div>
      );

    /* =========================================================
       C4 — Ampersand Focal
       ========================================================= */
    case 'c4':
      return (
        <div className="cc-cell cc-cell--c4">
          <span className="cc-c4__word cc-c4__word--top">Wall</span>
          <span className="cc-c4__amp" aria-hidden="true">&amp;</span>
          <span className="cc-c4__word cc-c4__word--bot">Cool</span>
          <span className="cc-c4__meta">Community · 01 / 04</span>
          <Chevrons tone="light" />
        </div>
      );

    /* =========================================================
       C5 — Two-Column Split
       ========================================================= */
    case 'c5':
      return (
        <div className="cc-cell cc-cell--c5">
          <div className="cc-c5__left">
            <span className="cc-c5__pretitle">Community</span>
            <h2 className="cc-c5__title">Wall<br />of Cool</h2>
          </div>
          <div className="cc-c5__right">
            <span className="cc-c5__issue">01</span>
            <span className="cc-c5__of">of 04</span>
            <Chevrons tone="light" />
          </div>
        </div>
      );

    /* =========================================================
       C6 — Mid-Gradient Card
       ========================================================= */
    case 'c6':
      return (
        <div className="cc-cell cc-cell--c6">
          <span className="cc-c6__pretitle">Community</span>
          <h2 className="cc-c6__title">Wall of Cool</h2>
          <span className="cc-c6__sub">A gallery of HQ, from our community</span>
          <Chevrons tone="dark" />
        </div>
      );

    /* =========================================================
       C7 — Ruled Index
       ========================================================= */
    case 'c7':
      return (
        <div className="cc-cell cc-cell--c7">
          <div className="cc-c7__zone cc-c7__zone--pretitle">
            <span>Community</span>
            <span>01 / 04</span>
          </div>
          <div className="cc-c7__zone cc-c7__zone--title">
            <h2>Wall of Cool</h2>
          </div>
          <div className="cc-c7__zone cc-c7__zone--nav">
            <Chevrons tone="light" />
          </div>
        </div>
      );

    /* =========================================================
       C8 — Stacked Poster
       ========================================================= */
    case 'c8':
      return (
        <div className="cc-cell cc-cell--c8">
          <span className="cc-c8__kicker">Community · Est. 2011</span>
          <div className="cc-c8__stack">
            <span>Wall</span>
            <span>of</span>
            <span>Cool</span>
          </div>
          <Chevrons tone="light" />
        </div>
      );

    /* =========================================================
       C9 — Tail Registration
       ========================================================= */
    case 'c9':
      return (
        <div className="cc-cell cc-cell--c9">
          <span className="cc-c9__reg">G-HQAV</span>
          <div className="cc-c9__meta">
            <h2 className="cc-c9__title">Wall of Cool</h2>
            <span className="cc-c9__sub">Community · 01 / 04 · Denham</span>
          </div>
          <Chevrons tone="dark" />
        </div>
      );

    /* =========================================================
       C10 — Editorial № 01
       ========================================================= */
    case 'c10':
      return (
        <div className="cc-cell cc-cell--c10">
          <span className="cc-c10__numero">№ 01</span>
          <div className="cc-c10__lockup">
            <span className="cc-c10__pretitle">The</span>
            <h2 className="cc-c10__title">Wall of Cool</h2>
            <span className="cc-c10__credit">Community · Est. 2011 · Denham</span>
          </div>
          <Chevrons tone="light" />
        </div>
      );

    default:
      return null;
  }
};

const CenterLayout = ({ variantId }) => (
  <div className="cc-stack">
    <div className="cc-gallery">
      <div className="cc-grid">
        {IMAGES.slice(0, 4).map((img, i) => (
          <div className="cc-cell cc-cell--img" key={`a-${i}`}>
            <img src={img.src} alt={img.alt} loading="lazy" />
          </div>
        ))}
        {renderCenterCard(variantId)}
        {IMAGES.slice(4).map((img, i) => (
          <div className="cc-cell cc-cell--img" key={`b-${i}`}>
            <img src={img.src} alt={img.alt} loading="lazy" />
          </div>
        ))}
      </div>
    </div>
    <footer className="cc-footer">
      <div className="cc-footer__issue">Are you an HQ'er with some cool footage?</div>
      <button className="cc-footer__btn">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
          <polyline points="17 8 12 3 7 8" />
          <line x1="12" y1="3" x2="12" y2="15" />
        </svg>
        Upload
      </button>
      <button className="cc-footer__btn" aria-label="Fullscreen gallery">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M8 3H5a2 2 0 00-2 2v3m18 0V5a2 2 0 00-2-2h-3m0 18h3a2 2 0 002-2v-3M3 16v3a2 2 0 002 2h3" />
        </svg>
        Fullscreen
      </button>
    </footer>
  </div>
);

export default function WallOfCoolCenterCardVariations() {
  return (
    <div className="cc-page">
      <header className="cc-topnav">
        <div className="cc-topnav__title">Wall of Cool — Centre Card (10 variations)</div>
        <nav className="cc-topnav__links">
          {VARIATIONS.map((v) => (
            <a key={v.id} href={`#${v.id}`}>{v.id.toUpperCase()}</a>
          ))}
        </nav>
      </header>

      {VARIATIONS.map((v) => (
        <section className="cc-variant" data-variant={v.id} id={v.id} key={v.id}>
          <div className="cc-variant__sticky">
            <div className="cc-variant__label">
              <span className="cc-variant__number">{v.id.toUpperCase()}</span>
              <div>
                <h2 className="cc-variant__title">{v.title}</h2>
                <p className="cc-variant__desc">{v.desc}</p>
              </div>
            </div>
            <div className="cc-variant__canvas">
              <CenterLayout variantId={v.id} />
            </div>
          </div>
        </section>
      ))}

      <style>{`
        .cc-page {
          font-family: 'Space Grotesk', -apple-system, sans-serif;
          background: #faf9f6;
          min-height: 100vh;
          color: #1a1a1a;
        }

        /* Top nav */
        .cc-topnav {
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
        .cc-topnav__title { font-weight: 600; font-size: 0.9rem; }
        .cc-topnav__links { display: flex; gap: 0.35rem; flex-wrap: wrap; }
        .cc-topnav__links a {
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
        .cc-topnav__links a:hover { background: #1a1a1a; color: #fff; }

        /* Variant shell */
        .cc-variant {
          position: relative;
          height: 150vh;
          padding: 2rem 1.5rem 0;
        }
        .cc-variant__sticky {
          position: sticky;
          top: 70px;
          display: flex;
          flex-direction: column;
          gap: 0.9rem;
          height: calc(100vh - 90px);
        }
        .cc-variant__label {
          flex: 0 0 auto;
          display: flex;
          align-items: flex-start;
          gap: 0.9rem;
        }
        .cc-variant__number {
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
        }
        .cc-variant__title { margin: 0; font-size: 1.1rem; font-weight: 600; }
        .cc-variant__desc { margin: 0.2rem 0 0; color: #666; font-size: 0.82rem; max-width: 820px; }
        .cc-variant__canvas {
          flex: 1 1 auto;
          min-height: 0;
          display: flex;
        }
        .cc-variant__canvas > * { width: 100%; }

        /* Gallery / grid */
        .cc-stack { display: flex; flex-direction: column; height: 100%; gap: 0; }
        .cc-gallery {
          flex: 1 1 auto;
          position: relative;
          overflow: hidden;
          border-radius: 10px;
          background: linear-gradient(to bottom, #ffffff 0%, #000000 100%);
        }
        .cc-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          grid-template-rows: repeat(3, 1fr);
          gap: 8px;
          padding: 8px;
          height: 100%;
        }
        .cc-cell {
          position: relative;
          overflow: hidden;
          border-radius: 8px;
          border: 1px solid rgba(255,255,255,0.22);
          background: #1a1a1a;
        }
        .cc-cell--img img {
          width: 100%; height: 100%;
          object-fit: cover;
          display: block;
        }

        /* Footer */
        .cc-footer {
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
        .cc-footer__issue {
          flex: 1 1 auto;
          min-width: 160px;
          font-size: 0.85rem;
          color: rgba(255,255,255,0.85);
        }
        .cc-footer__btn {
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
        .cc-footer__btn:hover { background: rgba(255,255,255,0.1); }

        /* Chevrons — neutral shared component, tone-able */
        .cc-nav { display: inline-flex; align-items: center; gap: 0.5rem; }
        .cc-chevron {
          width: 26px; height: 26px;
          display: inline-flex; align-items: center; justify-content: center;
          border-radius: 50%;
          border: 1px solid currentColor;
          background: transparent;
          cursor: pointer;
          font-size: 0.62rem;
          color: inherit;
        }
        .cc-chevron:disabled { opacity: 0.35; cursor: not-allowed; }
        .cc-chevron:hover:not(:disabled) { background: currentColor; }
        .cc-chevron:hover:not(:disabled) i { color: var(--chev-hover-fg, #fff); mix-blend-mode: difference; }
        .cc-count {
          font-family: 'Share Tech Mono', monospace;
          font-size: 0.66rem;
          letter-spacing: 0.14em;
          min-width: 3.2rem;
          text-align: center;
          color: inherit;
        }
        .cc-nav--light { color: #0a0a0a; }
        .cc-nav--dark  { color: rgba(255,255,255,0.75); }

        /* =========================================================
           C1 — Quiet Wordmark
           ========================================================= */
        .cc-cell--c1 {
          background: #ffffff;
          border: 1px solid rgba(0,0,0,0.08);
          color: #0a0a0a;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          gap: 1rem;
          padding: 1rem;
          text-align: center;
        }
        .cc-c1__corner {
          position: absolute;
          top: 12px;
          font-family: 'Share Tech Mono', monospace;
          font-size: 0.58rem;
          letter-spacing: 0.2em;
          color: #6b7280;
          text-transform: uppercase;
        }
        .cc-c1__corner--tl { left: 14px; }
        .cc-c1__corner--tr { right: 14px; }
        .cc-c1__title {
          margin: 0;
          font-family: 'Inter', -apple-system, sans-serif;
          font-weight: 300;
          font-size: clamp(1.35rem, 2.6vw, 2.1rem);
          line-height: 1;
          letter-spacing: -0.012em;
        }

        /* =========================================================
           C2 — Flight Brief
           ========================================================= */
        .cc-cell--c2 {
          background: #ffffff;
          border: 1px solid rgba(0,0,0,0.12);
          color: #0a0a0a;
          display: flex;
          flex-direction: column;
          justify-content: space-between;
          padding: 0.85rem 0.95rem;
          gap: 0.75rem;
          font-family: 'Share Tech Mono', monospace;
        }
        .cc-c2__head {
          display: flex;
          justify-content: space-between;
          align-items: baseline;
          padding-bottom: 0.5rem;
          border-bottom: 1px solid #0a0a0a;
          font-size: 0.72rem;
          letter-spacing: 0.16em;
          text-transform: uppercase;
          font-weight: 700;
        }
        .cc-c2__rows {
          margin: 0;
          display: flex;
          flex-direction: column;
          gap: 0.35rem;
        }
        .cc-c2__rows > div {
          display: flex;
          justify-content: space-between;
          align-items: baseline;
          gap: 0.75rem;
          font-size: 0.68rem;
          letter-spacing: 0.1em;
        }
        .cc-c2__rows dt {
          margin: 0;
          color: #6b7280;
          text-transform: uppercase;
          letter-spacing: 0.18em;
          font-size: 0.6rem;
        }
        .cc-c2__rows dd { margin: 0; color: #0a0a0a; }

        /* =========================================================
           C3 — Solid Dark Anchor
           ========================================================= */
        .cc-cell--c3 {
          background: #0a0a0a;
          border: 1px solid rgba(255,255,255,0.06);
          color: #fff;
          display: flex;
          flex-direction: column;
          justify-content: space-between;
          align-items: center;
          padding: 1rem 0.9rem;
          text-align: center;
        }
        .cc-c3__pretitle {
          font-family: 'Share Tech Mono', monospace;
          font-size: 0.58rem;
          letter-spacing: 0.22em;
          text-transform: uppercase;
          color: rgba(255,255,255,0.5);
        }
        .cc-c3__title {
          margin: auto 0 0.35rem;
          font-family: 'Inter', -apple-system, sans-serif;
          font-weight: 300;
          font-size: clamp(1.35rem, 2.7vw, 2.15rem);
          line-height: 1;
          letter-spacing: -0.01em;
        }
        .cc-c3__count {
          font-family: 'Share Tech Mono', monospace;
          font-size: 0.6rem;
          letter-spacing: 0.22em;
          color: rgba(255,255,255,0.4);
          margin-bottom: 0.6rem;
        }

        /* =========================================================
           C4 — Ampersand Focal
           ========================================================= */
        .cc-cell--c4 {
          background: #fafaf7;
          border: 1px solid rgba(0,0,0,0.08);
          color: #0a0a0a;
          display: grid;
          grid-template-rows: auto 1fr auto auto;
          padding: 0.9rem 1rem;
          text-align: center;
        }
        .cc-c4__word {
          font-family: 'Inter', -apple-system, sans-serif;
          font-style: italic;
          font-weight: 400;
          font-size: clamp(0.9rem, 1.8vw, 1.4rem);
          letter-spacing: 0.01em;
          line-height: 1;
        }
        .cc-c4__word--top { text-align: left; }
        .cc-c4__word--bot { text-align: right; }
        .cc-c4__amp {
          align-self: center;
          justify-self: center;
          font-family: 'Inter', serif;
          font-style: italic;
          font-weight: 300;
          font-size: clamp(4rem, 10vw, 7.5rem);
          line-height: 0.85;
          color: #0a0a0a;
          margin: -0.3em 0;
        }
        .cc-c4__meta {
          font-family: 'Share Tech Mono', monospace;
          font-size: 0.58rem;
          letter-spacing: 0.2em;
          text-transform: uppercase;
          color: #6b7280;
          text-align: center;
          padding-top: 0.5rem;
        }

        /* =========================================================
           C5 — Two-Column Split
           ========================================================= */
        .cc-cell--c5 {
          background: #ffffff;
          border: 1px solid rgba(0,0,0,0.1);
          color: #0a0a0a;
          display: grid;
          grid-template-columns: 1fr 1px 1fr;
          gap: 0;
        }
        .cc-cell--c5::before {
          content: "";
          grid-column: 2 / 3;
          background: rgba(0,0,0,0.12);
        }
        .cc-c5__left, .cc-c5__right {
          display: flex;
          flex-direction: column;
          padding: 0.9rem;
        }
        .cc-c5__left { justify-content: space-between; }
        .cc-c5__right { justify-content: space-between; align-items: flex-end; text-align: right; }
        .cc-c5__pretitle {
          font-family: 'Share Tech Mono', monospace;
          font-size: 0.58rem;
          letter-spacing: 0.22em;
          text-transform: uppercase;
          color: #6b7280;
        }
        .cc-c5__title {
          margin: 0;
          font-family: 'Inter', -apple-system, sans-serif;
          font-weight: 700;
          font-size: clamp(1.1rem, 2.2vw, 1.7rem);
          line-height: 0.95;
          letter-spacing: -0.01em;
          text-transform: uppercase;
        }
        .cc-c5__issue {
          font-family: 'Inter', -apple-system, sans-serif;
          font-weight: 800;
          font-size: clamp(2.6rem, 6vw, 4.8rem);
          line-height: 0.85;
          letter-spacing: -0.04em;
        }
        .cc-c5__of {
          font-family: 'Share Tech Mono', monospace;
          font-size: 0.6rem;
          letter-spacing: 0.2em;
          text-transform: uppercase;
          color: #6b7280;
          margin-top: -0.3rem;
        }

        /* =========================================================
           C6 — Mid-Gradient Card
           ========================================================= */
        .cc-cell--c6 {
          background: #6f6f6f;
          border: 1px solid rgba(255,255,255,0.12);
          color: #fff;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          gap: 0.35rem;
          padding: 1rem 0.9rem;
          text-align: center;
        }
        .cc-c6__pretitle {
          font-family: 'Share Tech Mono', monospace;
          font-size: 0.58rem;
          letter-spacing: 0.22em;
          text-transform: uppercase;
          color: rgba(255,255,255,0.65);
        }
        .cc-c6__title {
          margin: 0;
          font-family: 'Inter', -apple-system, sans-serif;
          font-weight: 400;
          font-size: clamp(1.2rem, 2.4vw, 1.9rem);
          line-height: 1;
          letter-spacing: -0.005em;
        }
        .cc-c6__sub {
          font-family: 'Inter', -apple-system, sans-serif;
          font-style: italic;
          font-size: 0.72rem;
          color: rgba(255,255,255,0.7);
          line-height: 1.3;
          max-width: 18ch;
          margin-bottom: 0.4rem;
        }

        /* =========================================================
           C7 — Ruled Index
           ========================================================= */
        .cc-cell--c7 {
          background: #ffffff;
          border: 1px solid rgba(0,0,0,0.1);
          color: #0a0a0a;
          display: grid;
          grid-template-rows: auto 1fr auto;
        }
        .cc-c7__zone { padding: 0.55rem 0.9rem; display: flex; align-items: center; }
        .cc-c7__zone--pretitle {
          justify-content: space-between;
          border-bottom: 1px solid rgba(0,0,0,0.15);
          font-family: 'Share Tech Mono', monospace;
          font-size: 0.6rem;
          letter-spacing: 0.22em;
          text-transform: uppercase;
          color: #0a0a0a;
        }
        .cc-c7__zone--title {
          justify-content: center;
          padding: 0.75rem 0.9rem;
        }
        .cc-c7__zone--title h2 {
          margin: 0;
          font-family: 'Inter', -apple-system, sans-serif;
          font-weight: 700;
          font-size: clamp(1.2rem, 2.6vw, 2rem);
          line-height: 1;
          letter-spacing: -0.01em;
          text-transform: uppercase;
        }
        .cc-c7__zone--nav {
          justify-content: center;
          border-top: 1px solid rgba(0,0,0,0.15);
        }

        /* =========================================================
           C8 — Stacked Poster
           ========================================================= */
        .cc-cell--c8 {
          background: #ffffff;
          border: 1px solid rgba(0,0,0,0.1);
          color: #0a0a0a;
          display: flex;
          flex-direction: column;
          justify-content: space-between;
          align-items: center;
          padding: 0.85rem 0.9rem;
          text-align: center;
        }
        .cc-c8__kicker {
          font-family: 'Share Tech Mono', monospace;
          font-size: 0.58rem;
          letter-spacing: 0.22em;
          text-transform: uppercase;
          color: #6b7280;
        }
        .cc-c8__stack {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          flex: 1 1 auto;
          font-family: 'Inter', -apple-system, sans-serif;
          font-weight: 800;
          text-transform: uppercase;
          line-height: 0.88;
          letter-spacing: -0.015em;
        }
        .cc-c8__stack span:nth-child(1),
        .cc-c8__stack span:nth-child(3) {
          font-size: clamp(1.5rem, 3.2vw, 2.6rem);
        }
        .cc-c8__stack span:nth-child(2) {
          font-style: italic;
          font-weight: 400;
          font-size: clamp(0.9rem, 1.8vw, 1.3rem);
          color: #6b7280;
          margin: 0.1em 0;
        }

        /* =========================================================
           C9 — Tail Registration
           ========================================================= */
        .cc-cell--c9 {
          background: #0a0a0a;
          color: #fff;
          border: 1px solid rgba(255,255,255,0.08);
          display: flex;
          flex-direction: column;
          justify-content: space-between;
          padding: 0.9rem;
        }
        .cc-c9__reg {
          display: block;
          font-family: 'Share Tech Mono', monospace;
          font-weight: 700;
          font-size: clamp(1.8rem, 4.5vw, 3.2rem);
          letter-spacing: 0.08em;
          color: #fff;
          line-height: 1;
          padding: 0.25rem 0.5rem;
          border: 2px solid #fff;
          border-radius: 4px;
          text-align: center;
          background: #0a0a0a;
          width: max-content;
          margin: 0 auto;
        }
        .cc-c9__meta {
          text-align: center;
        }
        .cc-c9__title {
          margin: 0 0 0.25rem;
          font-family: 'Inter', -apple-system, sans-serif;
          font-weight: 500;
          font-size: clamp(0.95rem, 1.9vw, 1.35rem);
          line-height: 1;
          letter-spacing: 0.01em;
        }
        .cc-c9__sub {
          font-family: 'Share Tech Mono', monospace;
          font-size: 0.58rem;
          letter-spacing: 0.18em;
          text-transform: uppercase;
          color: rgba(255,255,255,0.5);
        }

        /* =========================================================
           C10 — Editorial № 01
           ========================================================= */
        .cc-cell--c10 {
          background: #ffffff;
          border: 1px solid rgba(0,0,0,0.1);
          color: #0a0a0a;
          display: grid;
          grid-template-columns: auto 1fr;
          grid-template-rows: 1fr auto;
          gap: 0.6rem;
          padding: 0.9rem;
          align-items: center;
        }
        .cc-c10__numero {
          grid-row: 1 / 2;
          grid-column: 1 / 2;
          font-family: 'Inter', -apple-system, sans-serif;
          font-weight: 900;
          font-style: italic;
          font-size: clamp(3rem, 7vw, 5.5rem);
          line-height: 0.82;
          letter-spacing: -0.05em;
          color: #0a0a0a;
        }
        .cc-c10__lockup {
          grid-row: 1 / 2;
          grid-column: 2 / 3;
          display: flex;
          flex-direction: column;
          gap: 0.2rem;
          align-items: flex-start;
        }
        .cc-c10__pretitle {
          font-family: 'Inter', -apple-system, sans-serif;
          font-style: italic;
          font-size: clamp(0.7rem, 1.1vw, 0.9rem);
          color: #4b5563;
        }
        .cc-c10__title {
          margin: 0;
          font-family: 'Inter', -apple-system, sans-serif;
          font-weight: 800;
          font-size: clamp(1rem, 2vw, 1.55rem);
          line-height: 1;
          letter-spacing: -0.01em;
          text-transform: uppercase;
          text-align: left;
        }
        .cc-c10__credit {
          font-family: 'Share Tech Mono', monospace;
          font-size: 0.56rem;
          letter-spacing: 0.18em;
          text-transform: uppercase;
          color: #6b7280;
        }
        .cc-cell--c10 .cc-nav {
          grid-row: 2 / 3;
          grid-column: 1 / 3;
          justify-content: center;
          padding-top: 0.35rem;
          border-top: 1px solid rgba(0,0,0,0.12);
        }

        @media (max-width: 768px) {
          .cc-variant { height: 130vh; }
          .cc-variant__title { font-size: 1rem; }
          .cc-variant__desc { font-size: 0.75rem; }
        }
      `}</style>
    </div>
  );
}

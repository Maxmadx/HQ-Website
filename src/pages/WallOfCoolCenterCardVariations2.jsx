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
  { id: 'd1',  title: 'Auction Lot Card',     desc: 'Sotheby\'s-style: italic LOT 01 over a hairline rule, restrained provenance line. Premium, quiet, collected.' },
  { id: 'd2',  title: 'Magazine Drop Cap',    desc: 'Editorial-spread opener — a single oversized italic "W" anchors the card; the rest of the title flows next to it.' },
  { id: 'd3',  title: 'Swiss Asymmetric',     desc: 'International typographic style — strict 3×3 internal grid, blocks pinned to grid intersections, generous negative space.' },
  { id: 'd4',  title: 'Engraved Plate',       desc: 'Solid charcoal card with type rendered like an embossed brass plaque. Tactile and monumental.' },
  { id: 'd5',  title: 'Pull Quote',           desc: 'Italic editorial pull-quote in serif weight, with the title acting as attribution beneath.' },
  { id: 'd6',  title: 'Pilot\'s Logbook',     desc: 'Authentic logbook columns (Date / Type / Remarks) with light blue rule lines. Aviation-genuine, distinct from a pre-flight brief.' },
  { id: 'd7',  title: 'Heritage Crest',       desc: 'Concentric-circle HQ monogram crest in cream stock with a Latin motto. British aviation heritage, restrained.' },
  { id: 'd8',  title: 'Roman Numeral Folio',  desc: 'Classical book-folio — large Roman numeral I beside a compact title lockup, MMXXVI year stamp.' },
  { id: 'd9',  title: 'Negative Space',       desc: 'Rule-of-thirds composition. One small mark, one title, one count. Maximum confidence through emptiness.' },
  { id: 'd10', title: 'Type Specimen',        desc: 'Foundry specimen page — display "Aa" character beside metadata pairs (Title / Series / Issue / Year).' },
];

const Chevrons = ({ tone = 'light' }) => (
  <div className={`cc2-nav cc2-nav--${tone}`}>
    <button className="cc2-chevron" aria-label="Previous page" disabled>
      <i className="fas fa-chevron-left" />
    </button>
    <span className="cc2-count">01 / 04</span>
    <button className="cc2-chevron" aria-label="Next page">
      <i className="fas fa-chevron-right" />
    </button>
  </div>
);

const renderCenterCard = (id) => {
  switch (id) {

    /* =================== D1 — Auction Lot Card =================== */
    case 'd1':
      return (
        <div className="cc2-cell cc2-cell--d1">
          <div className="cc2-d1__lot">
            <span className="cc2-d1__lot-label">Lot</span>
            <span className="cc2-d1__lot-num">01</span>
          </div>
          <div className="cc2-d1__title-block">
            <h2 className="cc2-d1__title">Wall of Cool</h2>
            <span className="cc2-d1__provenance">Provenance · HQ Aviation, Denham · est. 2011</span>
          </div>
          <Chevrons tone="light" />
        </div>
      );

    /* =================== D2 — Magazine Drop Cap =================== */
    case 'd2':
      return (
        <div className="cc2-cell cc2-cell--d2">
          <span className="cc2-d2__dropcap" aria-hidden="true">W</span>
          <div className="cc2-d2__cont">
            <h2 className="cc2-d2__title">all of Cool</h2>
            <span className="cc2-d2__rule" aria-hidden="true" />
            <p className="cc2-d2__lede">Pictures from inside HQ — flown, gathered, framed.</p>
            <span className="cc2-d2__credit">No. 01 · Community</span>
          </div>
          <Chevrons tone="light" />
        </div>
      );

    /* =================== D3 — Swiss Asymmetric =================== */
    case 'd3':
      return (
        <div className="cc2-cell cc2-cell--d3">
          <span className="cc2-d3__cat">Community<br />Photography</span>
          <span className="cc2-d3__num">01</span>
          <h2 className="cc2-d3__title">Wall<br />of Cool</h2>
          <span className="cc2-d3__label">No. of 04</span>
          <Chevrons tone="light" />
        </div>
      );

    /* =================== D4 — Engraved Plate =================== */
    case 'd4':
      return (
        <div className="cc2-cell cc2-cell--d4">
          <span className="cc2-d4__rule" aria-hidden="true" />
          <h2 className="cc2-d4__title">Wall of Cool</h2>
          <span className="cc2-d4__sub">Community · Est. 2011</span>
          <span className="cc2-d4__rule" aria-hidden="true" />
          <Chevrons tone="dark" />
        </div>
      );

    /* =================== D5 — Pull Quote =================== */
    case 'd5':
      return (
        <div className="cc2-cell cc2-cell--d5">
          <span className="cc2-d5__mark" aria-hidden="true">&ldquo;</span>
          <p className="cc2-d5__quote">From those who fly, for those who fly.</p>
          <span className="cc2-d5__attribution">— Wall of Cool, No. 01</span>
          <Chevrons tone="light" />
        </div>
      );

    /* =================== D6 — Pilot's Logbook =================== */
    case 'd6':
      return (
        <div className="cc2-cell cc2-cell--d6">
          <div className="cc2-d6__head">
            <span>Date</span>
            <span>Type</span>
            <span>Remarks</span>
          </div>
          <div className="cc2-d6__row cc2-d6__row--feature">
            <span>26.04</span>
            <span>R66</span>
            <span><strong>Wall of Cool</strong> · Community</span>
          </div>
          <div className="cc2-d6__row cc2-d6__row--blank"><span>—</span><span>—</span><span>—</span></div>
          <div className="cc2-d6__row cc2-d6__row--blank"><span>—</span><span>—</span><span>—</span></div>
          <Chevrons tone="light" />
        </div>
      );

    /* =================== D7 — Heritage Crest =================== */
    case 'd7':
      return (
        <div className="cc2-cell cc2-cell--d7">
          <svg className="cc2-d7__crest" viewBox="0 0 100 100" aria-hidden="true">
            <circle cx="50" cy="50" r="42" fill="none" stroke="#0a0a0a" strokeWidth="1.4" />
            <circle cx="50" cy="50" r="34" fill="none" stroke="#0a0a0a" strokeWidth="0.5" />
            <text x="50" y="58" textAnchor="middle" fontFamily="Georgia, serif" fontSize="26" fontWeight="700" fontStyle="italic" fill="#0a0a0a">HQ</text>
            <text x="50" y="13" textAnchor="middle" fontFamily="ui-monospace, monospace" fontSize="6" letterSpacing="2" fill="#0a0a0a">EST · MMXI</text>
            <text x="50" y="93" textAnchor="middle" fontFamily="ui-monospace, monospace" fontSize="6" letterSpacing="2" fill="#0a0a0a">DENHAM · UK</text>
          </svg>
          <h2 className="cc2-d7__title">Wall of Cool</h2>
          <span className="cc2-d7__motto">Per Volatum, Communitas</span>
          <Chevrons tone="light" />
        </div>
      );

    /* =================== D8 — Roman Numeral Folio =================== */
    case 'd8':
      return (
        <div className="cc2-cell cc2-cell--d8">
          <span className="cc2-d8__roman">I</span>
          <div className="cc2-d8__title-block">
            <span className="cc2-d8__year">MMXXVI</span>
            <h2 className="cc2-d8__title">Wall of Cool</h2>
            <span className="cc2-d8__sub">Community · Vol. I</span>
          </div>
          <Chevrons tone="light" />
        </div>
      );

    /* =================== D9 — Negative Space =================== */
    case 'd9':
      return (
        <div className="cc2-cell cc2-cell--d9">
          <span className="cc2-d9__mark" aria-hidden="true" />
          <span className="cc2-d9__count">01 / 04</span>
          <h2 className="cc2-d9__title">Wall of Cool</h2>
          <Chevrons tone="light" />
        </div>
      );

    /* =================== D10 — Type Specimen =================== */
    case 'd10':
      return (
        <div className="cc2-cell cc2-cell--d10">
          <span className="cc2-d10__hero" aria-hidden="true">Aa</span>
          <dl className="cc2-d10__meta">
            <div><dt>Title</dt><dd>Wall of Cool</dd></div>
            <div><dt>Series</dt><dd>Community</dd></div>
            <div><dt>Issue</dt><dd>01 / 04</dd></div>
            <div><dt>Year</dt><dd>2026</dd></div>
          </dl>
          <Chevrons tone="light" />
        </div>
      );

    default:
      return null;
  }
};

const CenterLayout = ({ variantId }) => (
  <div className="cc2-stack">
    <div className="cc2-gallery">
      <div className="cc2-grid">
        {IMAGES.slice(0, 4).map((img, i) => (
          <div className="cc2-cell cc2-cell--img" key={`a-${i}`}>
            <img src={img.src} alt={img.alt} loading="lazy" />
          </div>
        ))}
        {renderCenterCard(variantId)}
        {IMAGES.slice(4).map((img, i) => (
          <div className="cc2-cell cc2-cell--img" key={`b-${i}`}>
            <img src={img.src} alt={img.alt} loading="lazy" />
          </div>
        ))}
      </div>
    </div>
    <footer className="cc2-footer">
      <div className="cc2-footer__issue">Are you an HQ'er with some cool footage?</div>
      <button className="cc2-footer__btn">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
          <polyline points="17 8 12 3 7 8" />
          <line x1="12" y1="3" x2="12" y2="15" />
        </svg>
        Upload
      </button>
      <button className="cc2-footer__btn" aria-label="Fullscreen gallery">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M8 3H5a2 2 0 00-2 2v3m18 0V5a2 2 0 00-2-2h-3m0 18h3a2 2 0 002-2v-3M3 16v3a2 2 0 002 2h3" />
        </svg>
        Fullscreen
      </button>
    </footer>
  </div>
);

export default function WallOfCoolCenterCardVariations2() {
  return (
    <div className="cc2-page">
      <header className="cc2-topnav">
        <div className="cc2-topnav__title">Wall of Cool — Centre Card · Batch 2</div>
        <nav className="cc2-topnav__links">
          <a className="cc2-topnav__back" href="/wall-of-cool-center-card-variations">← Batch 1</a>
          {VARIATIONS.map((v) => (
            <a key={v.id} href={`#${v.id}`}>{v.id.toUpperCase()}</a>
          ))}
        </nav>
      </header>

      {VARIATIONS.map((v) => (
        <section className="cc2-variant" data-variant={v.id} id={v.id} key={v.id}>
          <div className="cc2-variant__sticky">
            <div className="cc2-variant__label">
              <span className="cc2-variant__number">{v.id.toUpperCase()}</span>
              <div>
                <h2 className="cc2-variant__title">{v.title}</h2>
                <p className="cc2-variant__desc">{v.desc}</p>
              </div>
            </div>
            <div className="cc2-variant__canvas">
              <CenterLayout variantId={v.id} />
            </div>
          </div>
        </section>
      ))}

      <style>{`
        .cc2-page {
          font-family: 'Space Grotesk', -apple-system, sans-serif;
          background: #faf9f6;
          min-height: 100vh;
          color: #1a1a1a;
        }

        /* Top nav */
        .cc2-topnav {
          position: sticky; top: 0; z-index: 100;
          display: flex; align-items: center; justify-content: space-between; gap: 1rem;
          padding: 0.65rem 1.25rem;
          background: rgba(255,255,255,0.92);
          backdrop-filter: blur(10px);
          border-bottom: 1px solid #e5e7eb;
        }
        .cc2-topnav__title { font-weight: 600; font-size: 0.9rem; }
        .cc2-topnav__links { display: flex; gap: 0.35rem; flex-wrap: wrap; }
        .cc2-topnav__links a {
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
        .cc2-topnav__back { background: #1a1a1a !important; color: #fff !important; border-color: #1a1a1a !important; }
        .cc2-topnav__links a:hover { background: #1a1a1a; color: #fff; }

        /* Variant shell */
        .cc2-variant { position: relative; height: 150vh; padding: 2rem 1.5rem 0; }
        .cc2-variant__sticky {
          position: sticky; top: 70px;
          display: flex; flex-direction: column; gap: 0.9rem;
          height: calc(100vh - 90px);
        }
        .cc2-variant__label { flex: 0 0 auto; display: flex; align-items: flex-start; gap: 0.9rem; }
        .cc2-variant__number {
          display: inline-flex; align-items: center; justify-content: center;
          min-width: 48px; height: 40px; padding: 0 0.55rem;
          background: #1a1a1a; color: #fff; border-radius: 6px;
          font-family: 'Share Tech Mono', monospace; font-size: 0.75rem; letter-spacing: 0.08em;
        }
        .cc2-variant__title { margin: 0; font-size: 1.1rem; font-weight: 600; }
        .cc2-variant__desc { margin: 0.2rem 0 0; color: #666; font-size: 0.82rem; max-width: 820px; }
        .cc2-variant__canvas { flex: 1 1 auto; min-height: 0; display: flex; }
        .cc2-variant__canvas > * { width: 100%; }

        /* Gallery */
        .cc2-stack { display: flex; flex-direction: column; height: 100%; }
        .cc2-gallery {
          flex: 1 1 auto; position: relative; overflow: hidden;
          border-radius: 10px;
          background: linear-gradient(to bottom, #ffffff 0%, #000000 100%);
        }
        .cc2-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          grid-template-rows: repeat(3, 1fr);
          gap: 8px; padding: 8px; height: 100%;
        }
        .cc2-cell {
          position: relative; overflow: hidden; border-radius: 8px;
          border: 1px solid rgba(255,255,255,0.22);
          background: #1a1a1a;
        }
        .cc2-cell--img img { width: 100%; height: 100%; object-fit: cover; display: block; }

        /* Footer */
        .cc2-footer {
          flex: 0 0 auto;
          display: flex; flex-wrap: wrap; align-items: center; justify-content: center;
          gap: 1rem; padding: 0.9rem 1.25rem; margin-top: 8px;
          background: #1a1a1a; color: #fff; border-radius: 10px;
        }
        .cc2-footer__issue { flex: 1 1 auto; min-width: 160px; font-size: 0.85rem; color: rgba(255,255,255,0.85); }
        .cc2-footer__btn {
          display: inline-flex; align-items: center; gap: 0.45rem;
          padding: 0.45rem 0.85rem;
          background: transparent; border: 1px solid rgba(255,255,255,0.25);
          border-radius: 6px; color: #fff;
          font-family: 'Share Tech Mono', monospace;
          font-size: 0.72rem; letter-spacing: 0.08em; text-transform: uppercase;
          cursor: pointer;
        }
        .cc2-footer__btn:hover { background: rgba(255,255,255,0.1); }

        /* Chevrons */
        .cc2-nav { display: inline-flex; align-items: center; gap: 0.5rem; }
        .cc2-chevron {
          width: 26px; height: 26px;
          display: inline-flex; align-items: center; justify-content: center;
          border-radius: 50%; border: 1px solid currentColor; background: transparent;
          cursor: pointer; font-size: 0.62rem; color: inherit;
        }
        .cc2-chevron:disabled { opacity: 0.35; cursor: not-allowed; }
        .cc2-count {
          font-family: 'Share Tech Mono', monospace;
          font-size: 0.66rem; letter-spacing: 0.14em;
          min-width: 3.2rem; text-align: center; color: inherit;
        }
        .cc2-nav--light { color: #0a0a0a; }
        .cc2-nav--dark  { color: rgba(255,255,255,0.75); }

        /* =================== D1 — Auction Lot Card =================== */
        .cc2-cell--d1 {
          background: #fdfcf8;
          border: 1px solid rgba(0,0,0,0.1);
          color: #0a0a0a;
          display: grid;
          grid-template-rows: auto 1fr auto;
          gap: 0.5rem;
          padding: 0.85rem 0.95rem;
        }
        .cc2-d1__lot {
          display: flex; align-items: baseline; gap: 0.5rem;
          padding-bottom: 0.45rem;
          border-bottom: 1px solid #8b1a1a;
        }
        .cc2-d1__lot-label {
          font-family: 'Share Tech Mono', monospace;
          font-size: 0.6rem;
          letter-spacing: 0.22em;
          text-transform: uppercase;
          color: #6b7280;
          flex: 0 0 auto;
          padding-bottom: 0.15rem;
        }
        .cc2-d1__lot-num {
          font-family: Georgia, 'Times New Roman', serif;
          font-style: italic;
          font-weight: 700;
          font-size: clamp(1.8rem, 4.2vw, 3rem);
          color: #8b1a1a;
          line-height: 0.9;
          letter-spacing: -0.02em;
        }
        .cc2-d1__title-block {
          display: flex; flex-direction: column; align-items: center; justify-content: center;
          gap: 0.4rem; text-align: center;
        }
        .cc2-d1__title {
          margin: 0;
          font-family: Georgia, 'Times New Roman', serif;
          font-style: italic;
          font-weight: 500;
          font-size: clamp(1.05rem, 2vw, 1.55rem);
          letter-spacing: 0;
          line-height: 1;
        }
        .cc2-d1__provenance {
          font-family: 'Share Tech Mono', monospace;
          font-size: 0.55rem;
          letter-spacing: 0.16em;
          text-transform: uppercase;
          color: #6b7280;
          max-width: 22ch;
        }

        /* =================== D2 — Magazine Drop Cap =================== */
        .cc2-cell--d2 {
          background: #fff;
          border: 1px solid rgba(0,0,0,0.1);
          color: #0a0a0a;
          display: grid;
          grid-template-columns: auto 1fr;
          grid-template-rows: 1fr auto;
          gap: 0.4rem 0.85rem;
          padding: 0.85rem 0.95rem;
        }
        .cc2-d2__dropcap {
          font-family: Georgia, 'Times New Roman', serif;
          font-style: italic;
          font-weight: 700;
          font-size: clamp(4.5rem, 11vw, 8rem);
          line-height: 0.78;
          letter-spacing: -0.05em;
          color: #0a0a0a;
          align-self: center;
        }
        .cc2-d2__cont {
          display: flex; flex-direction: column; gap: 0.3rem;
          align-self: center;
        }
        .cc2-d2__title {
          margin: 0;
          font-family: 'Inter', sans-serif;
          font-weight: 700;
          font-size: clamp(0.95rem, 1.85vw, 1.3rem);
          letter-spacing: 0.01em;
          text-transform: uppercase;
          line-height: 1;
        }
        .cc2-d2__rule { display: block; width: 24px; height: 1px; background: #0a0a0a; }
        .cc2-d2__lede {
          margin: 0;
          font-family: Georgia, serif;
          font-style: italic;
          font-size: 0.78rem;
          line-height: 1.3;
          color: #4b5563;
        }
        .cc2-d2__credit {
          font-family: 'Share Tech Mono', monospace;
          font-size: 0.55rem;
          letter-spacing: 0.18em;
          text-transform: uppercase;
          color: #6b7280;
        }
        .cc2-cell--d2 .cc2-nav {
          grid-column: 1 / 3;
          justify-content: center;
          padding-top: 0.35rem;
          border-top: 1px solid rgba(0,0,0,0.1);
        }

        /* =================== D3 — Swiss Asymmetric =================== */
        .cc2-cell--d3 {
          background: #fff;
          border: 1px solid rgba(0,0,0,0.08);
          color: #0a0a0a;
          display: grid;
          grid-template-columns: 1fr 1fr 1fr;
          grid-template-rows: auto 1fr auto auto;
          gap: 0.35rem;
          padding: 0.9rem 0.95rem;
          background-image:
            linear-gradient(rgba(0,0,0,0.05) 1px, transparent 1px),
            linear-gradient(90deg, rgba(0,0,0,0.05) 1px, transparent 1px);
          background-size: 33.333% 33.333%;
          background-position: 0.9rem 0.9rem;
        }
        .cc2-d3__cat {
          grid-column: 1 / 2; grid-row: 1 / 2;
          font-family: 'Share Tech Mono', monospace;
          font-size: 0.55rem;
          letter-spacing: 0.18em;
          text-transform: uppercase;
          color: #6b7280;
          line-height: 1.4;
        }
        .cc2-d3__num {
          grid-column: 3 / 4; grid-row: 1 / 2;
          font-family: 'Inter', sans-serif;
          font-weight: 700;
          font-size: clamp(1.5rem, 3.4vw, 2.6rem);
          line-height: 0.85;
          letter-spacing: -0.04em;
          text-align: right;
        }
        .cc2-d3__title {
          grid-column: 1 / 3; grid-row: 2 / 3;
          margin: 0; align-self: end;
          font-family: 'Inter', sans-serif;
          font-weight: 700;
          font-size: clamp(1.05rem, 2.2vw, 1.7rem);
          line-height: 0.95;
          letter-spacing: -0.012em;
          text-transform: uppercase;
        }
        .cc2-d3__label {
          grid-column: 3 / 4; grid-row: 3 / 4;
          font-family: 'Share Tech Mono', monospace;
          font-size: 0.55rem;
          letter-spacing: 0.18em;
          text-transform: uppercase;
          color: #6b7280;
          text-align: right;
          align-self: end;
        }
        .cc2-cell--d3 .cc2-nav {
          grid-column: 1 / 4; grid-row: 4 / 5;
          justify-content: flex-start;
          padding-top: 0.4rem;
          border-top: 1px solid rgba(0,0,0,0.1);
        }

        /* =================== D4 — Engraved Plate =================== */
        .cc2-cell--d4 {
          background: linear-gradient(150deg, #3a3a3a 0%, #1a1a1a 65%, #2a2a2a 100%);
          border: 1px solid rgba(255,255,255,0.06);
          color: #2a2a2a;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          gap: 0.6rem;
          padding: 1rem 0.9rem;
          text-align: center;
        }
        .cc2-d4__rule {
          display: block; width: 60%; height: 1px;
          background: linear-gradient(90deg, transparent, rgba(255,255,255,0.18), transparent);
        }
        .cc2-d4__title {
          margin: 0;
          font-family: 'Inter', sans-serif;
          font-weight: 700;
          font-size: clamp(1.2rem, 2.5vw, 1.95rem);
          letter-spacing: 0.04em;
          text-transform: uppercase;
          color: #2a2a2a;
          text-shadow:
            -1px -1px 0 rgba(0,0,0,0.7),
            1px 1px 0 rgba(255,255,255,0.18);
        }
        .cc2-d4__sub {
          font-family: 'Share Tech Mono', monospace;
          font-size: 0.58rem;
          letter-spacing: 0.22em;
          text-transform: uppercase;
          color: rgba(255,255,255,0.45);
          text-shadow: none;
        }

        /* =================== D5 — Pull Quote =================== */
        .cc2-cell--d5 {
          background: #fff;
          border: 1px solid rgba(0,0,0,0.1);
          color: #0a0a0a;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          padding: 0.9rem;
          gap: 0.45rem;
          position: relative;
          text-align: center;
        }
        .cc2-d5__mark {
          position: absolute; top: 0.2rem; left: 0.6rem;
          font-family: Georgia, serif;
          font-style: italic;
          font-weight: 700;
          font-size: clamp(2.2rem, 5vw, 3.6rem);
          line-height: 1;
          color: rgba(0,0,0,0.12);
        }
        .cc2-d5__quote {
          margin: auto 0 0;
          font-family: Georgia, serif;
          font-style: italic;
          font-weight: 400;
          font-size: clamp(0.9rem, 1.7vw, 1.25rem);
          line-height: 1.3;
          color: #0a0a0a;
          max-width: 18ch;
        }
        .cc2-d5__attribution {
          font-family: 'Share Tech Mono', monospace;
          font-size: 0.55rem;
          letter-spacing: 0.18em;
          text-transform: uppercase;
          color: #6b7280;
          margin-top: auto;
        }

        /* =================== D6 — Pilot's Logbook =================== */
        .cc2-cell--d6 {
          background: #fdfaf0;
          border: 1px solid rgba(0,0,0,0.1);
          color: #0a0a0a;
          padding: 0.65rem 0.7rem 0.55rem;
          display: flex;
          flex-direction: column;
          gap: 0;
          font-family: 'Share Tech Mono', monospace;
          font-size: 0.6rem;
          letter-spacing: 0.04em;
        }
        .cc2-d6__head {
          display: grid;
          grid-template-columns: 0.8fr 0.7fr 1.5fr;
          gap: 0.4rem;
          padding: 0.25rem 0;
          border-bottom: 1px solid #0a0a0a;
          font-weight: 700;
          letter-spacing: 0.18em;
          text-transform: uppercase;
          font-size: 0.58rem;
        }
        .cc2-d6__row {
          display: grid;
          grid-template-columns: 0.8fr 0.7fr 1.5fr;
          gap: 0.4rem;
          padding: 0.4rem 0;
          border-bottom: 1px solid rgba(110, 160, 220, 0.55);
          align-items: baseline;
        }
        .cc2-d6__row--blank { color: #b8b8b8; }
        .cc2-d6__row--feature strong {
          font-family: 'Inter', sans-serif;
          font-weight: 700;
          letter-spacing: 0;
          font-size: 0.72rem;
          text-transform: none;
        }
        .cc2-cell--d6 .cc2-nav {
          margin-top: auto;
          padding-top: 0.35rem;
          justify-content: flex-end;
        }

        /* =================== D7 — Heritage Crest =================== */
        .cc2-cell--d7 {
          background: #f7f3e8;
          border: 1px solid rgba(0,0,0,0.1);
          color: #0a0a0a;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: space-between;
          padding: 0.75rem 0.9rem 0.85rem;
          text-align: center;
        }
        .cc2-d7__crest {
          width: 56px; height: 56px;
          margin-top: 0.15rem;
        }
        .cc2-d7__title {
          margin: 0;
          font-family: Georgia, serif;
          font-style: italic;
          font-weight: 500;
          font-size: clamp(0.95rem, 1.95vw, 1.5rem);
          line-height: 1;
        }
        .cc2-d7__motto {
          font-family: 'Share Tech Mono', monospace;
          font-size: 0.55rem;
          letter-spacing: 0.2em;
          text-transform: uppercase;
          color: #6b7280;
        }

        /* =================== D8 — Roman Numeral Folio =================== */
        .cc2-cell--d8 {
          background: #fdfcf8;
          border: 1px solid rgba(0,0,0,0.1);
          color: #0a0a0a;
          display: grid;
          grid-template-columns: auto 1fr;
          grid-template-rows: 1fr auto;
          gap: 0.4rem 0.85rem;
          padding: 0.9rem 1rem;
          align-items: center;
        }
        .cc2-d8__roman {
          font-family: Georgia, serif;
          font-weight: 400;
          font-size: clamp(4rem, 9vw, 6.5rem);
          line-height: 0.85;
          letter-spacing: -0.02em;
          color: #0a0a0a;
        }
        .cc2-d8__title-block {
          display: flex; flex-direction: column; gap: 0.18rem; align-items: flex-start;
        }
        .cc2-d8__year {
          font-family: 'Share Tech Mono', monospace;
          font-size: 0.55rem;
          letter-spacing: 0.22em;
          text-transform: uppercase;
          color: #6b7280;
        }
        .cc2-d8__title {
          margin: 0;
          font-family: Georgia, serif;
          font-style: italic;
          font-weight: 500;
          font-size: clamp(0.95rem, 1.85vw, 1.4rem);
          line-height: 1;
          letter-spacing: 0;
        }
        .cc2-d8__sub {
          font-family: 'Share Tech Mono', monospace;
          font-size: 0.55rem;
          letter-spacing: 0.18em;
          text-transform: uppercase;
          color: #6b7280;
        }
        .cc2-cell--d8 .cc2-nav {
          grid-column: 1 / 3;
          justify-content: center;
          padding-top: 0.4rem;
          border-top: 1px solid rgba(0,0,0,0.12);
        }

        /* =================== D9 — Negative Space =================== */
        .cc2-cell--d9 {
          background: #fff;
          border: 1px solid rgba(0,0,0,0.08);
          color: #0a0a0a;
          display: grid;
          grid-template-columns: 1fr 1fr 1fr;
          grid-template-rows: 1fr 1fr 1fr;
          padding: 0.9rem;
          position: relative;
        }
        .cc2-d9__mark {
          grid-column: 3 / 4; grid-row: 1 / 2;
          align-self: start; justify-self: end;
          display: block; width: 6px; height: 6px;
          background: #0a0a0a; border-radius: 50%;
        }
        .cc2-d9__count {
          grid-column: 1 / 2; grid-row: 1 / 2;
          align-self: start; justify-self: start;
          font-family: 'Share Tech Mono', monospace;
          font-size: 0.55rem;
          letter-spacing: 0.22em;
          color: #6b7280;
        }
        .cc2-d9__title {
          margin: 0;
          grid-column: 1 / 3; grid-row: 2 / 4;
          align-self: end;
          font-family: 'Inter', sans-serif;
          font-weight: 600;
          font-size: clamp(1.1rem, 2.3vw, 1.75rem);
          line-height: 0.95;
          letter-spacing: -0.012em;
        }
        .cc2-cell--d9 .cc2-nav {
          grid-column: 3 / 4; grid-row: 3 / 4;
          align-self: end; justify-self: end;
        }

        /* =================== D10 — Type Specimen =================== */
        .cc2-cell--d10 {
          background: #fff;
          border: 1px solid rgba(0,0,0,0.1);
          color: #0a0a0a;
          display: grid;
          grid-template-columns: auto 1fr;
          grid-template-rows: 1fr auto;
          gap: 0.5rem 0.9rem;
          padding: 0.85rem 0.95rem;
          align-items: center;
        }
        .cc2-d10__hero {
          font-family: Georgia, serif;
          font-weight: 700;
          font-size: clamp(3rem, 7vw, 5.5rem);
          line-height: 0.85;
          letter-spacing: -0.04em;
          color: #0a0a0a;
        }
        .cc2-d10__meta {
          margin: 0;
          display: flex; flex-direction: column; gap: 0.22rem;
          font-family: 'Share Tech Mono', monospace;
          font-size: 0.6rem;
          letter-spacing: 0.06em;
        }
        .cc2-d10__meta div {
          display: flex; justify-content: space-between; gap: 0.5rem;
          border-bottom: 1px dotted rgba(0,0,0,0.18);
          padding-bottom: 0.18rem;
        }
        .cc2-d10__meta dt {
          margin: 0;
          color: #6b7280;
          text-transform: uppercase;
          letter-spacing: 0.18em;
          font-size: 0.55rem;
        }
        .cc2-d10__meta dd { margin: 0; color: #0a0a0a; }
        .cc2-cell--d10 .cc2-nav {
          grid-column: 1 / 3;
          justify-content: center;
          padding-top: 0.45rem;
          border-top: 1px solid rgba(0,0,0,0.12);
        }

        @media (max-width: 768px) {
          .cc2-variant { height: 130vh; }
          .cc2-variant__title { font-size: 1rem; }
          .cc2-variant__desc { font-size: 0.75rem; }
        }
      `}</style>
    </div>
  );
}

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
  { id: 'g1', title: 'Cartographer\'s Compass', desc: 'Antique 16-point rose with fleur-de-lis at North, the title arced along the inner ring. Cream parchment, ink-black detail.' },
  { id: 'g2', title: 'Minimal Geometric',       desc: 'White cell, single-weight strokes, clean star and ticks. Title set in fine type at the centre.' },
  { id: 'g3', title: 'Cockpit HSI',             desc: 'Black instrument face — yellow heading numerals, triangle index, "Wall of Cool" engraved across the bezel.' },
  { id: 'g4', title: 'Ship\'s Brass',           desc: 'Warm brass tones, baroque sun-rays, engraved title and ornamented cardinal points. Maritime gravitas.' },
];

const renderCompass = (id) => {
  switch (id) {

    /* ============= G1 — Cartographer's Compass ============= */
    case 'g1':
      return (
        <div className="cmp-cell cmp-cell--g1">
          <svg viewBox="0 0 200 200" className="cmp-svg" aria-hidden="true">
            <defs>
              <path id="g1-arc-top" d="M 30 100 a 70 70 0 0 1 140 0" />
              <path id="g1-arc-bot" d="M 30 100 a 70 70 0 0 0 140 0" />
            </defs>
            {/* outer ring */}
            <circle cx="100" cy="100" r="92" fill="none" stroke="#1a1a1a" strokeWidth="1"/>
            <circle cx="100" cy="100" r="86" fill="none" stroke="#1a1a1a" strokeWidth="0.4"/>
            {/* 360 degree ticks */}
            {Array.from({length: 72}).map((_, i) => {
              const a = (i * 5 - 90) * Math.PI / 180;
              const major = i % 6 === 0;
              const len = major ? 6 : 3;
              return <line key={i} x1={100 + Math.cos(a) * (86)} y1={100 + Math.sin(a) * (86)} x2={100 + Math.cos(a) * (86 - len)} y2={100 + Math.sin(a) * (86 - len)} stroke="#1a1a1a" strokeWidth={major ? 0.9 : 0.4}/>;
            })}
            {/* title arced top */}
            <text fill="#1a1a1a" fontFamily="Georgia, serif" fontStyle="italic" fontWeight="500" fontSize="9" letterSpacing="3">
              <textPath href="#g1-arc-top" startOffset="50%" textAnchor="middle">Wall · of · Cool</textPath>
            </text>
            {/* meta arced bottom */}
            <text fill="#1a1a1a" fontFamily="ui-monospace, monospace" fontSize="6" letterSpacing="2.5" opacity="0.85">
              <textPath href="#g1-arc-bot" startOffset="50%" textAnchor="middle">DENHAM · EGLD · MMXI</textPath>
            </text>
            {/* inner ring with cardinals */}
            <circle cx="100" cy="100" r="62" fill="none" stroke="#1a1a1a" strokeWidth="0.4"/>
            <circle cx="100" cy="100" r="58" fill="none" stroke="#1a1a1a" strokeWidth="0.3" opacity="0.6"/>
            {/* intercardinal letters */}
            {[
              {label: 'NE', x: 144, y: 60},
              {label: 'SE', x: 144, y: 144},
              {label: 'SW', x: 56, y: 144},
              {label: 'NW', x: 56, y: 60},
            ].map(c => (
              <text key={c.label} x={c.x} y={c.y + 2} textAnchor="middle" fontFamily="Georgia, serif" fontSize="7" fontWeight="700" fill="#1a1a1a">{c.label}</text>
            ))}
            {/* large 4-point star (compass rose) */}
            <polygon points="100,20 108,100 100,180 92,100" fill="#1a1a1a"/>
            <polygon points="20,100 100,92 180,100 100,108" fill="#1a1a1a" opacity="0.45"/>
            {/* secondary 4-point star (rotated 45°) */}
            <polygon points="44,44 100,96 156,44 104,100 156,156 100,104 44,156 96,100" fill="#1a1a1a" opacity="0.18"/>
            {/* North fleur-de-lis */}
            <g transform="translate(100, 24)">
              <path d="M 0 -4 C -2 -8 -7 -10 -8 -6 C -9 -2 -4 0 0 -1 C 4 0 9 -2 8 -6 C 7 -10 2 -8 0 -4 Z" fill="#1a1a1a"/>
              <path d="M -3 -1 L 0 6 L 3 -1 Z" fill="#1a1a1a"/>
              <line x1="-7" y1="2" x2="7" y2="2" stroke="#1a1a1a" strokeWidth="0.6"/>
            </g>
            {/* cardinal letters at tips (in white over star) */}
            <text x="100" y="38" textAnchor="middle" fontFamily="Georgia, serif" fontSize="11" fontWeight="700" fill="#fdfcf6">N</text>
            <text x="166" y="103" textAnchor="middle" fontFamily="Georgia, serif" fontSize="9" fontWeight="700" fill="#1a1a1a">E</text>
            <text x="100" y="174" textAnchor="middle" fontFamily="Georgia, serif" fontSize="9" fontWeight="700" fill="#1a1a1a">S</text>
            <text x="34" y="103" textAnchor="middle" fontFamily="Georgia, serif" fontSize="9" fontWeight="700" fill="#1a1a1a">W</text>
            {/* center pivot */}
            <circle cx="100" cy="100" r="3" fill="#1a1a1a"/>
            <circle cx="100" cy="100" r="1.4" fill="#fdfcf6"/>
          </svg>
        </div>
      );

    /* ============= G2 — Minimal Geometric ============= */
    case 'g2':
      return (
        <div className="cmp-cell cmp-cell--g2">
          <svg viewBox="0 0 200 200" className="cmp-svg" aria-hidden="true">
            <circle cx="100" cy="100" r="92" fill="none" stroke="#0a0a0a" strokeWidth="0.6"/>
            <circle cx="100" cy="100" r="68" fill="none" stroke="#0a0a0a" strokeWidth="0.4" opacity="0.5"/>
            {Array.from({length: 36}).map((_, i) => {
              const a = (i * 10 - 90) * Math.PI / 180;
              const major = i % 9 === 0;
              const len = major ? 10 : 4;
              return <line key={i} x1={100 + Math.cos(a) * 92} y1={100 + Math.sin(a) * 92} x2={100 + Math.cos(a) * (92 - len)} y2={100 + Math.sin(a) * (92 - len)} stroke="#0a0a0a" strokeWidth={major ? 1.2 : 0.4}/>;
            })}
            <line x1="100" y1="20" x2="100" y2="180" stroke="#0a0a0a" strokeWidth="0.4" opacity="0.25"/>
            <line x1="20" y1="100" x2="180" y2="100" stroke="#0a0a0a" strokeWidth="0.4" opacity="0.25"/>
            {/* needle */}
            <polygon points="100,30 104,100 100,170 96,100" fill="#0a0a0a"/>
            <text x="100" y="14" textAnchor="middle" fontFamily="ui-monospace, monospace" fontSize="9" fontWeight="700" fill="#0a0a0a">N</text>
            <text x="190" y="103" textAnchor="middle" fontFamily="ui-monospace, monospace" fontSize="9" fontWeight="700" fill="#0a0a0a">E</text>
            <text x="100" y="194" textAnchor="middle" fontFamily="ui-monospace, monospace" fontSize="9" fontWeight="700" fill="#0a0a0a">S</text>
            <text x="10" y="103" textAnchor="middle" fontFamily="ui-monospace, monospace" fontSize="9" fontWeight="700" fill="#0a0a0a">W</text>
            <circle cx="100" cy="100" r="2.5" fill="#0a0a0a"/>
            <text x="100" y="118" textAnchor="middle" fontFamily="Inter, sans-serif" fontSize="8" fontWeight="500" letterSpacing="2" fill="#0a0a0a">WALL OF COOL</text>
            <text x="100" y="128" textAnchor="middle" fontFamily="ui-monospace, monospace" fontSize="5" fill="#0a0a0a" opacity="0.55" letterSpacing="2">No. 01 / 04</text>
          </svg>
        </div>
      );

    /* ============= G3 — Cockpit HSI ============= */
    case 'g3':
      return (
        <div className="cmp-cell cmp-cell--g3">
          <svg viewBox="0 0 200 200" className="cmp-svg" aria-hidden="true">
            <rect width="200" height="200" fill="#0a0a0a"/>
            <circle cx="100" cy="100" r="90" fill="#101010" stroke="#222" strokeWidth="2"/>
            <circle cx="100" cy="100" r="84" fill="none" stroke="#f5b73a" strokeWidth="0.5" opacity="0.3"/>
            {/* triangle index at top */}
            <polygon points="100,12 96,22 104,22" fill="#f5b73a"/>
            {/* heading marks */}
            {Array.from({length: 36}).map((_, i) => {
              const a = (i * 10 - 90) * Math.PI / 180;
              const major = i % 3 === 0;
              const len = major ? 10 : 5;
              return <line key={i} x1={100 + Math.cos(a) * 84} y1={100 + Math.sin(a) * 84} x2={100 + Math.cos(a) * (84 - len)} y2={100 + Math.sin(a) * (84 - len)} stroke="#f5b73a" strokeWidth={major ? 1.4 : 0.7}/>;
            })}
            {/* heading numerals */}
            {[0, 3, 6, 9, 12, 15, 18, 21, 24, 27, 30, 33].map(num => {
              const a = (num * 10 - 90) * Math.PI / 180;
              return <text key={num} x={100 + Math.cos(a) * 64} y={100 + Math.sin(a) * 64 + 3} textAnchor="middle" fontFamily="ui-monospace, monospace" fontSize="7.5" fontWeight="700" fill="#f5b73a">{num === 0 ? 'N' : num === 9 ? 'E' : num === 18 ? 'S' : num === 27 ? 'W' : String(num).padStart(2,'0')}</text>;
            })}
            {/* needle (course pointer) */}
            <line x1="100" y1="38" x2="100" y2="162" stroke="#fdfcf6" strokeWidth="2"/>
            <polygon points="100,32 95,48 105,48" fill="#fdfcf6"/>
            <polygon points="100,168 95,152 105,152" fill="#fdfcf6"/>
            {/* center indicator */}
            <circle cx="100" cy="100" r="14" fill="none" stroke="#f5b73a" strokeWidth="0.8"/>
            <text x="100" y="98" textAnchor="middle" fontFamily="ui-monospace, monospace" fontSize="6" fontWeight="700" letterSpacing="1.5" fill="#f5b73a">WALL OF</text>
            <text x="100" y="108" textAnchor="middle" fontFamily="ui-monospace, monospace" fontSize="6" fontWeight="700" letterSpacing="1.5" fill="#f5b73a">COOL</text>
            {/* heading readout */}
            <rect x="80" y="172" width="40" height="14" fill="#101010" stroke="#f5b73a" strokeWidth="0.6"/>
            <text x="100" y="183" textAnchor="middle" fontFamily="ui-monospace, monospace" fontSize="9" fontWeight="700" fill="#f5b73a">014°</text>
          </svg>
        </div>
      );

    /* ============= G4 — Ship's Brass ============= */
    case 'g4':
      return (
        <div className="cmp-cell cmp-cell--g4">
          <svg viewBox="0 0 200 200" className="cmp-svg" aria-hidden="true">
            <defs>
              <radialGradient id="brass-bg" cx="50%" cy="42%" r="60%">
                <stop offset="0%" stopColor="#dcc18b"/>
                <stop offset="55%" stopColor="#b6925a"/>
                <stop offset="100%" stopColor="#8a6837"/>
              </radialGradient>
              <radialGradient id="brass-rim" cx="50%" cy="50%" r="55%">
                <stop offset="80%" stopColor="#8a6837" stopOpacity="0"/>
                <stop offset="100%" stopColor="#3d2a14" stopOpacity="0.6"/>
              </radialGradient>
              <path id="g4-arc-top" d="M 30 100 a 70 70 0 0 1 140 0" />
              <path id="g4-arc-bot" d="M 30 100 a 70 70 0 0 0 140 0" />
            </defs>
            <rect width="200" height="200" fill="url(#brass-bg)"/>
            <rect width="200" height="200" fill="url(#brass-rim)"/>
            {/* outer engraved ring */}
            <circle cx="100" cy="100" r="92" fill="none" stroke="#3d2a14" strokeWidth="1.4"/>
            <circle cx="100" cy="100" r="86" fill="none" stroke="#3d2a14" strokeWidth="0.6"/>
            {/* sun rays */}
            {Array.from({length: 32}).map((_, i) => {
              const a = (i * 11.25 - 90) * Math.PI / 180;
              return <line key={i} x1={100 + Math.cos(a) * 86} y1={100 + Math.sin(a) * 86} x2={100 + Math.cos(a) * (i % 2 === 0 ? 76 : 80)} y2={100 + Math.sin(a) * (i % 2 === 0 ? 76 : 80)} stroke="#3d2a14" strokeWidth="0.5"/>;
            })}
            {/* engraved title arc top */}
            <text fill="#3d2a14" fontFamily="Georgia, serif" fontStyle="italic" fontWeight="700" fontSize="11" letterSpacing="3">
              <textPath href="#g4-arc-top" startOffset="50%" textAnchor="middle">Wall · of · Cool</textPath>
            </text>
            <text fill="#3d2a14" fontFamily="Georgia, serif" fontStyle="italic" fontSize="7" letterSpacing="2.5">
              <textPath href="#g4-arc-bot" startOffset="50%" textAnchor="middle">Per Volatum · Communitas</textPath>
            </text>
            {/* inner ring */}
            <circle cx="100" cy="100" r="60" fill="#dcc18b"/>
            <circle cx="100" cy="100" r="60" fill="none" stroke="#3d2a14" strokeWidth="1"/>
            <circle cx="100" cy="100" r="54" fill="none" stroke="#3d2a14" strokeWidth="0.4"/>
            {/* large 8-point star */}
            <polygon points="100,42 105,98 100,158 95,98" fill="#3d2a14"/>
            <polygon points="42,100 98,105 158,100 98,95" fill="#3d2a14" opacity="0.55"/>
            <polygon points="60,60 100,98 102,100 98,102 60,140 100,102 142,140 102,100 100,98 102,98 142,60 100,98" fill="none"/>
            <polygon points="65,65 100,99 65,135 99,100" fill="#3d2a14" opacity="0.3"/>
            <polygon points="135,65 101,99 135,135 100,100" fill="#3d2a14" opacity="0.3"/>
            {/* cardinal letters */}
            <text x="100" y="56" textAnchor="middle" fontFamily="Georgia, serif" fontSize="11" fontWeight="700" fill="#dcc18b">N</text>
            <text x="146" y="103" textAnchor="middle" fontFamily="Georgia, serif" fontSize="9" fontWeight="700" fill="#3d2a14">E</text>
            <text x="100" y="151" textAnchor="middle" fontFamily="Georgia, serif" fontSize="9" fontWeight="700" fill="#3d2a14">S</text>
            <text x="54" y="103" textAnchor="middle" fontFamily="Georgia, serif" fontSize="9" fontWeight="700" fill="#3d2a14">W</text>
            {/* center pivot — domed brass */}
            <circle cx="100" cy="100" r="6" fill="#dcc18b" stroke="#3d2a14" strokeWidth="0.8"/>
            <circle cx="100" cy="100" r="2.5" fill="#3d2a14"/>
            {/* corner ornaments */}
            {[[28,28],[172,28],[28,172],[172,172]].map(([x,y], i) => (
              <g key={i} transform={`translate(${x}, ${y})`}>
                <circle r="3" fill="#3d2a14"/>
                <circle r="1.4" fill="#dcc18b"/>
              </g>
            ))}
          </svg>
        </div>
      );

    default: return null;
  }
};

const CenterLayout = ({ variantId }) => (
  <div className="cmp-stack">
    <div className="cmp-gallery">
      <div className="cmp-grid">
        {IMAGES.slice(0, 4).map((img, i) => (
          <div className="cmp-cell cmp-cell--img" key={`a-${i}`}>
            <img src={img.src} alt={img.alt} loading="lazy" />
          </div>
        ))}
        {renderCompass(variantId)}
        {IMAGES.slice(4).map((img, i) => (
          <div className="cmp-cell cmp-cell--img" key={`b-${i}`}>
            <img src={img.src} alt={img.alt} loading="lazy" />
          </div>
        ))}
      </div>
    </div>
    <footer className="cmp-footer">
      <div className="cmp-footer__issue">Are you an HQ'er with some cool footage?</div>
      <div className="cmp-footer__nav">
        <button className="cmp-footer__chevron" aria-label="Previous page" disabled>
          <i className="fas fa-chevron-left" />
        </button>
        <span className="cmp-footer__count">01 / 04</span>
        <button className="cmp-footer__chevron" aria-label="Next page">
          <i className="fas fa-chevron-right" />
        </button>
      </div>
      <button className="cmp-footer__btn">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
          <polyline points="17 8 12 3 7 8" />
          <line x1="12" y1="3" x2="12" y2="15" />
        </svg>
        Upload
      </button>
      <button className="cmp-footer__btn" aria-label="Fullscreen gallery">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M8 3H5a2 2 0 00-2 2v3m18 0V5a2 2 0 00-2-2h-3m0 18h3a2 2 0 002-2v-3M3 16v3a2 2 0 002 2h3" />
        </svg>
        Fullscreen
      </button>
    </footer>
  </div>
);

export default function WallOfCoolCompassCard() {
  return (
    <div className="cmp-page">
      <header className="cmp-topnav">
        <div className="cmp-topnav__title">Wall of Cool — Compass-Only Centre</div>
        <nav className="cmp-topnav__links">
          <a className="cmp-topnav__back" href="/wall-of-cool-center-card-variations-4">← Travel II</a>
          {VARIATIONS.map((v) => (
            <a key={v.id} href={`#${v.id}`}>{v.id.toUpperCase()}</a>
          ))}
        </nav>
      </header>

      {VARIATIONS.map((v) => (
        <section className="cmp-variant" data-variant={v.id} id={v.id} key={v.id}>
          <div className="cmp-variant__sticky">
            <div className="cmp-variant__label">
              <span className="cmp-variant__number">{v.id.toUpperCase()}</span>
              <div>
                <h2 className="cmp-variant__title">{v.title}</h2>
                <p className="cmp-variant__desc">{v.desc}</p>
              </div>
            </div>
            <div className="cmp-variant__canvas">
              <CenterLayout variantId={v.id} />
            </div>
          </div>
        </section>
      ))}

      <style>{`
        .cmp-page { font-family: 'Space Grotesk', -apple-system, sans-serif; background: #faf9f6; min-height: 100vh; color: #1a1a1a; }

        .cmp-topnav { position: sticky; top: 0; z-index: 100; display: flex; align-items: center; justify-content: space-between; gap: 1rem; padding: 0.65rem 1.25rem; background: rgba(255,255,255,0.92); backdrop-filter: blur(10px); border-bottom: 1px solid #e5e7eb; }
        .cmp-topnav__title { font-weight: 600; font-size: 0.9rem; }
        .cmp-topnav__links { display: flex; gap: 0.35rem; flex-wrap: wrap; }
        .cmp-topnav__links a { display: inline-block; padding: 0.25rem 0.55rem; border: 1px solid #e5e7eb; border-radius: 4px; font-family: 'Share Tech Mono', monospace; font-size: 0.7rem; letter-spacing: 0.05em; text-decoration: none; color: #333; background: #fff; }
        .cmp-topnav__back { background: #1a1a1a !important; color: #fff !important; border-color: #1a1a1a !important; }
        .cmp-topnav__links a:hover { background: #1a1a1a; color: #fff; }

        .cmp-variant { position: relative; height: 150vh; padding: 2rem 1.5rem 0; }
        .cmp-variant__sticky { position: sticky; top: 70px; display: flex; flex-direction: column; gap: 0.9rem; height: calc(100vh - 90px); }
        .cmp-variant__label { flex: 0 0 auto; display: flex; align-items: flex-start; gap: 0.9rem; }
        .cmp-variant__number { display: inline-flex; align-items: center; justify-content: center; min-width: 48px; height: 40px; padding: 0 0.55rem; background: #1a1a1a; color: #fff; border-radius: 6px; font-family: 'Share Tech Mono', monospace; font-size: 0.75rem; letter-spacing: 0.08em; }
        .cmp-variant__title { margin: 0; font-size: 1.1rem; font-weight: 600; }
        .cmp-variant__desc { margin: 0.2rem 0 0; color: #666; font-size: 0.82rem; max-width: 820px; }
        .cmp-variant__canvas { flex: 1 1 auto; min-height: 0; display: flex; }
        .cmp-variant__canvas > * { width: 100%; }

        .cmp-stack { display: flex; flex-direction: column; height: 100%; }
        .cmp-gallery { flex: 1 1 auto; position: relative; overflow: hidden; border-radius: 10px; background: linear-gradient(to bottom, #ffffff 0%, #000000 100%); }
        .cmp-grid { display: grid; grid-template-columns: repeat(3, 1fr); grid-template-rows: repeat(3, 1fr); gap: 8px; padding: 8px; height: 100%; }
        .cmp-cell { position: relative; overflow: hidden; border-radius: 8px; border: 1px solid rgba(255,255,255,0.22); background: #1a1a1a; }
        .cmp-cell--img img { width: 100%; height: 100%; object-fit: cover; display: block; }
        .cmp-svg { width: 100%; height: 100%; display: block; }

        .cmp-footer { flex: 0 0 auto; display: flex; flex-wrap: wrap; align-items: center; justify-content: center; gap: 1rem; padding: 0.9rem 1.25rem; margin-top: 8px; background: #1a1a1a; color: #fff; border-radius: 10px; }
        .cmp-footer__issue { flex: 1 1 auto; min-width: 160px; font-size: 0.85rem; color: rgba(255,255,255,0.85); }
        .cmp-footer__nav { display: flex; align-items: center; gap: 0.5rem; }
        .cmp-footer__chevron { width: 30px; height: 30px; display: inline-flex; align-items: center; justify-content: center; border-radius: 50%; border: 1px solid rgba(255,255,255,0.25); background: transparent; color: #fff; cursor: pointer; font-size: 0.7rem; }
        .cmp-footer__chevron:disabled { opacity: 0.4; cursor: not-allowed; }
        .cmp-footer__chevron:hover:not(:disabled) { background: rgba(255,255,255,0.1); }
        .cmp-footer__count { font-family: 'Share Tech Mono', monospace; font-size: 0.75rem; letter-spacing: 0.12em; min-width: 3.5rem; text-align: center; }
        .cmp-footer__btn { display: inline-flex; align-items: center; gap: 0.45rem; padding: 0.45rem 0.85rem; background: transparent; border: 1px solid rgba(255,255,255,0.25); border-radius: 6px; color: #fff; font-family: 'Share Tech Mono', monospace; font-size: 0.72rem; letter-spacing: 0.08em; text-transform: uppercase; cursor: pointer; }
        .cmp-footer__btn:hover { background: rgba(255,255,255,0.1); }

        /* ===== Compass cells: borderless, no padding, full SVG ===== */
        .cmp-cell--g1, .cmp-cell--g2, .cmp-cell--g3, .cmp-cell--g4 {
          border-radius: 8px;
          padding: 0;
          overflow: hidden;
          border: 1px solid rgba(255,255,255,0.22);
        }

        .cmp-cell--g1 { background: #fdfcf3; }
        .cmp-cell--g2 { background: #ffffff; }
        .cmp-cell--g3 { background: #0a0a0a; border-color: rgba(255,255,255,0.1); }
        .cmp-cell--g4 { background: #b6925a; }

        @media (max-width: 768px) {
          .cmp-variant { height: 130vh; }
          .cmp-variant__title { font-size: 1rem; }
          .cmp-variant__desc { font-size: 0.75rem; }
        }
      `}</style>
    </div>
  );
}

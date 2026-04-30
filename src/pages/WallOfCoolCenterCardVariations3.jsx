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
  { id: 'e1',  title: 'Compass Rose',          desc: 'Classical cartographer\'s compass — N·E·S·W with a four-point star, title set inside the dial.' },
  { id: 'e2',  title: 'Boarding Pass',         desc: 'Two-up boarding-pass with perforated stub. IATA codes, flight number, sequence — direct aviation language.' },
  { id: 'e3',  title: 'Atlas Spread',          desc: 'Cream cartography page — concentric topographic rings, latitude / longitude coordinates, place-name set in italic Georgia.' },
  { id: 'e4',  title: 'Departure Board',       desc: 'Black mechanical split-flap — destination, gate, scheduled. Amber mono on black, very Heathrow Terminal 2.' },
  { id: 'e5',  title: 'Great Circle Route',    desc: 'Two waypoints on a small globe joined by a curved great-circle arc, distance and heading labelled.' },
  { id: 'e6',  title: 'Three Time Zones',      desc: 'Three minimalist analog clocks — Denham · Cabo · NYC — sitting under a quiet wordmark. Hotel-lobby grace.' },
  { id: 'e7',  title: 'Travel Poster',         desc: 'Cassandre-era poster — deep teal block, geometric uppercase title, single graphic mark, "FLY HQ" strap.' },
  { id: 'e8',  title: 'Postcard',              desc: 'Reverse of a postcard — postage in the corner, ringed postmark, divider rule, handwritten-feel signoff.' },
  { id: 'e9',  title: 'Customs Stamp',         desc: 'Two concentric ink rings with curved place-name text and a slight rotation, on parchment.' },
  { id: 'e10', title: 'Way-Marker',            desc: 'Wooden-signpost vertical pole with arrowed direction-plates pointing to Wall of Cool, Denham, the Pole.' },
];

const Chevrons = ({ tone = 'light' }) => (
  <div className={`cc3-nav cc3-nav--${tone}`}>
    <button className="cc3-chevron" aria-label="Previous page" disabled>
      <i className="fas fa-chevron-left" />
    </button>
    <span className="cc3-count">01 / 04</span>
    <button className="cc3-chevron" aria-label="Next page">
      <i className="fas fa-chevron-right" />
    </button>
  </div>
);

const renderCenterCard = (id) => {
  switch (id) {

    /* ============= E1 — Compass Rose ============= */
    case 'e1':
      return (
        <div className="cc3-cell cc3-cell--e1">
          <svg className="cc3-e1__rose" viewBox="0 0 200 200" aria-hidden="true">
            <circle cx="100" cy="100" r="86" fill="none" stroke="#0a0a0a" strokeWidth="1" />
            <circle cx="100" cy="100" r="74" fill="none" stroke="#0a0a0a" strokeWidth="0.5" />
            {/* tick marks every 22.5° */}
            {Array.from({ length: 16 }).map((_, i) => {
              const a = (i * 22.5 - 90) * Math.PI / 180;
              const x1 = 100 + Math.cos(a) * 78;
              const y1 = 100 + Math.sin(a) * 78;
              const x2 = 100 + Math.cos(a) * 86;
              const y2 = 100 + Math.sin(a) * 86;
              return <line key={i} x1={x1} y1={y1} x2={x2} y2={y2} stroke="#0a0a0a" strokeWidth={i % 4 === 0 ? 1 : 0.4} />;
            })}
            {/* four-point star */}
            <polygon points="100,18 108,100 100,182 92,100" fill="#0a0a0a" />
            <polygon points="18,100 100,92 182,100 100,108" fill="#0a0a0a" opacity="0.35" />
            <circle cx="100" cy="100" r="3" fill="#0a0a0a" />
            {/* cardinal labels */}
            <text x="100" y="11" textAnchor="middle" fontFamily="Georgia, serif" fontSize="11" fontWeight="700" fill="#0a0a0a">N</text>
            <text x="194" y="104" textAnchor="middle" fontFamily="Georgia, serif" fontSize="11" fontWeight="700" fill="#0a0a0a">E</text>
            <text x="100" y="197" textAnchor="middle" fontFamily="Georgia, serif" fontSize="11" fontWeight="700" fill="#0a0a0a">S</text>
            <text x="6" y="104" textAnchor="middle" fontFamily="Georgia, serif" fontSize="11" fontWeight="700" fill="#0a0a0a">W</text>
          </svg>
          <div className="cc3-e1__center">
            <span className="cc3-e1__pretitle">Community · No. 01</span>
            <h2 className="cc3-e1__title">Wall of Cool</h2>
          </div>
          <Chevrons tone="light" />
        </div>
      );

    /* ============= E2 — Boarding Pass ============= */
    case 'e2':
      return (
        <div className="cc3-cell cc3-cell--e2">
          <div className="cc3-e2__main">
            <div className="cc3-e2__head">
              <span className="cc3-e2__brand">HQ Aviation</span>
              <span className="cc3-e2__type">Boarding</span>
            </div>
            <div className="cc3-e2__route">
              <div className="cc3-e2__port">
                <span className="cc3-e2__code">HQ</span>
                <span className="cc3-e2__city">Denham</span>
              </div>
              <svg className="cc3-e2__plane" viewBox="0 0 32 12" aria-hidden="true">
                <path d="M2 6 L26 6 M22 2 L26 6 L22 10" stroke="#0a0a0a" strokeWidth="1.2" fill="none" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              <div className="cc3-e2__port">
                <span className="cc3-e2__code">WoC</span>
                <span className="cc3-e2__city">The Wall</span>
              </div>
            </div>
            <dl className="cc3-e2__rows">
              <div><dt>Flight</dt><dd>HQ 0011</dd></div>
              <div><dt>Issue</dt><dd>01 / 04</dd></div>
            </dl>
          </div>
          <div className="cc3-e2__stub" aria-hidden="true">
            <span className="cc3-e2__stub-label">SEQ</span>
            <span className="cc3-e2__stub-num">01</span>
          </div>
          <Chevrons tone="light" />
        </div>
      );

    /* ============= E3 — Atlas Spread ============= */
    case 'e3':
      return (
        <div className="cc3-cell cc3-cell--e3">
          <svg className="cc3-e3__map" viewBox="0 0 200 200" aria-hidden="true">
            <defs>
              <pattern id="grid-e3" width="20" height="20" patternUnits="userSpaceOnUse">
                <path d="M 20 0 L 0 0 0 20" fill="none" stroke="#b8a98a" strokeWidth="0.4"/>
              </pattern>
            </defs>
            <rect width="200" height="200" fill="url(#grid-e3)" />
            {/* topographic rings */}
            {[60, 50, 40, 30, 20].map((r, i) => (
              <ellipse key={r} cx="100" cy="100" rx={r * 1.4} ry={r} fill="none" stroke="#9a8a6a" strokeWidth="0.6" opacity={0.55 - i * 0.07} />
            ))}
            <circle cx="100" cy="100" r="3" fill="#0a0a0a" />
            <line x1="100" y1="100" x2="160" y2="60" stroke="#0a0a0a" strokeWidth="0.5" strokeDasharray="2 2" />
          </svg>
          <div className="cc3-e3__overlay">
            <div className="cc3-e3__top">
              <span>51°34'N</span>
              <span>0°30'W</span>
            </div>
            <h2 className="cc3-e3__title">Wall of Cool</h2>
            <span className="cc3-e3__place">Denham · EGLD</span>
            <Chevrons tone="light" />
          </div>
        </div>
      );

    /* ============= E4 — Departure Board ============= */
    case 'e4':
      return (
        <div className="cc3-cell cc3-cell--e4">
          <div className="cc3-e4__head">
            <span>Departures</span>
            <span className="cc3-e4__live">● live</span>
          </div>
          <div className="cc3-e4__rows">
            <div className="cc3-e4__row cc3-e4__row--feature">
              <span className="cc3-e4__time">14:30</span>
              <span className="cc3-e4__dest">Wall of Cool</span>
              <span className="cc3-e4__gate">G·01</span>
            </div>
            <div className="cc3-e4__row">
              <span className="cc3-e4__time">15:05</span>
              <span className="cc3-e4__dest">Cabo Verde</span>
              <span className="cc3-e4__gate">G·02</span>
            </div>
            <div className="cc3-e4__row">
              <span className="cc3-e4__time">17:45</span>
              <span className="cc3-e4__dest">Reykjavik</span>
              <span className="cc3-e4__gate">G·04</span>
            </div>
          </div>
          <Chevrons tone="dark" />
        </div>
      );

    /* ============= E5 — Great Circle Route ============= */
    case 'e5':
      return (
        <div className="cc3-cell cc3-cell--e5">
          <svg className="cc3-e5__globe" viewBox="0 0 200 130" aria-hidden="true">
            <ellipse cx="100" cy="65" rx="90" ry="55" fill="none" stroke="#0a0a0a" strokeWidth="0.7"/>
            {[1, 2, 3].map((i) => (
              <ellipse key={`m${i}`} cx="100" cy="65" rx={90 - i * 22} ry="55" fill="none" stroke="#0a0a0a" strokeWidth="0.3" opacity="0.35"/>
            ))}
            {[1, 2].map((i) => (
              <line key={`p${i}`} x1="10" y1={65 - i * 18} x2="190" y2={65 - i * 18} stroke="#0a0a0a" strokeWidth="0.3" opacity="0.35"/>
            ))}
            {[1, 2].map((i) => (
              <line key={`p2${i}`} x1="10" y1={65 + i * 18} x2="190" y2={65 + i * 18} stroke="#0a0a0a" strokeWidth="0.3" opacity="0.35"/>
            ))}
            <path d="M 35 80 Q 100 5 165 50" stroke="#0a0a0a" strokeWidth="1.4" fill="none" strokeDasharray="3 2"/>
            <circle cx="35" cy="80" r="4" fill="#0a0a0a"/>
            <circle cx="165" cy="50" r="4" fill="#0a0a0a"/>
            <text x="35" y="100" textAnchor="middle" fontFamily="ui-monospace, monospace" fontSize="7" letterSpacing="1.5" fill="#0a0a0a">DEN</text>
            <text x="165" y="40" textAnchor="middle" fontFamily="ui-monospace, monospace" fontSize="7" letterSpacing="1.5" fill="#0a0a0a">POL</text>
          </svg>
          <div className="cc3-e5__meta">
            <h2 className="cc3-e5__title">Wall of Cool</h2>
            <div className="cc3-e5__data">
              <span>2,348 NM</span>
              <span>·</span>
              <span>HDG 014°</span>
            </div>
          </div>
          <Chevrons tone="light" />
        </div>
      );

    /* ============= E6 — Three Time Zones ============= */
    case 'e6': {
      const Clock = ({ hours, minutes, label, sub }) => {
        const h = ((hours % 12) + minutes / 60) * 30 - 90;
        const m = minutes * 6 - 90;
        const hr = h * Math.PI / 180;
        const mr = m * Math.PI / 180;
        return (
          <div className="cc3-e6__zone">
            <svg viewBox="0 0 60 60" className="cc3-e6__face" aria-hidden="true">
              <circle cx="30" cy="30" r="26" fill="none" stroke="#0a0a0a" strokeWidth="1"/>
              {Array.from({ length: 12 }).map((_, i) => {
                const a = (i * 30 - 90) * Math.PI / 180;
                return <line key={i} x1={30 + Math.cos(a) * 22} y1={30 + Math.sin(a) * 22} x2={30 + Math.cos(a) * 25} y2={30 + Math.sin(a) * 25} stroke="#0a0a0a" strokeWidth="0.6"/>;
              })}
              <line x1="30" y1="30" x2={30 + Math.cos(hr) * 14} y2={30 + Math.sin(hr) * 14} stroke="#0a0a0a" strokeWidth="1.5" strokeLinecap="round"/>
              <line x1="30" y1="30" x2={30 + Math.cos(mr) * 20} y2={30 + Math.sin(mr) * 20} stroke="#0a0a0a" strokeWidth="0.8" strokeLinecap="round"/>
              <circle cx="30" cy="30" r="1.4" fill="#0a0a0a"/>
            </svg>
            <span className="cc3-e6__label">{label}</span>
            <span className="cc3-e6__sub">{sub}</span>
          </div>
        );
      };
      return (
        <div className="cc3-cell cc3-cell--e6">
          <h2 className="cc3-e6__title">Wall of Cool</h2>
          <div className="cc3-e6__clocks">
            <Clock hours={14} minutes={30} label="DEN" sub="GMT" />
            <Clock hours={11} minutes={30} label="CVO" sub="−3h" />
            <Clock hours={9} minutes={30} label="JFK" sub="−5h" />
          </div>
          <Chevrons tone="light" />
        </div>
      );
    }

    /* ============= E7 — Travel Poster ============= */
    case 'e7':
      return (
        <div className="cc3-cell cc3-cell--e7">
          <div className="cc3-e7__top">
            <span>Fly HQ</span>
            <span>No. 01</span>
          </div>
          <div className="cc3-e7__hero">
            <h2 className="cc3-e7__title"><span>Wall</span><span className="cc3-e7__of">of</span><span>Cool</span></h2>
            <svg className="cc3-e7__mark" viewBox="0 0 60 60" aria-hidden="true">
              <circle cx="30" cy="30" r="26" fill="none" stroke="#fff" strokeWidth="1.5"/>
              <path d="M8 30 L52 30 M30 8 L30 52 M14 14 L46 46 M46 14 L14 46" stroke="#fff" strokeWidth="0.6" opacity="0.5"/>
              <path d="M18 35 L30 22 L42 35" stroke="#fff" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
          <div className="cc3-e7__strap">Denham · est. MMXI</div>
          <Chevrons tone="dark" />
        </div>
      );

    /* ============= E8 — Postcard ============= */
    case 'e8':
      return (
        <div className="cc3-cell cc3-cell--e8">
          <div className="cc3-e8__head">
            <span className="cc3-e8__heading">Post Card</span>
            <div className="cc3-e8__stamp" aria-hidden="true">
              <span className="cc3-e8__stamp-num">01</span>
              <span className="cc3-e8__stamp-label">HQ · UK</span>
            </div>
          </div>
          <div className="cc3-e8__body">
            <span className="cc3-e8__postmark" aria-hidden="true">
              <svg viewBox="0 0 44 44">
                <circle cx="22" cy="22" r="20" fill="none" stroke="#8b3a2e" strokeWidth="1.2"/>
                <circle cx="22" cy="22" r="13" fill="none" stroke="#8b3a2e" strokeWidth="0.6"/>
                <text x="22" y="14" textAnchor="middle" fontFamily="ui-monospace, monospace" fontSize="3.5" fill="#8b3a2e" letterSpacing="0.5">25 · IV · 26</text>
                <text x="22" y="35" textAnchor="middle" fontFamily="ui-monospace, monospace" fontSize="3.5" fill="#8b3a2e" letterSpacing="0.5">DENHAM</text>
                <line x1="6" y1="22" x2="13" y2="22" stroke="#8b3a2e" strokeWidth="0.6"/>
                <line x1="31" y1="22" x2="38" y2="22" stroke="#8b3a2e" strokeWidth="0.6"/>
              </svg>
            </span>
            <h2 className="cc3-e8__title">Wall of Cool</h2>
            <span className="cc3-e8__sub">— sent from HQ Aviation,<br/>with love.</span>
          </div>
          <Chevrons tone="light" />
        </div>
      );

    /* ============= E9 — Customs Stamp ============= */
    case 'e9':
      return (
        <div className="cc3-cell cc3-cell--e9">
          <svg className="cc3-e9__stamp" viewBox="0 0 200 200" aria-hidden="true">
            <defs>
              <path id="cc3-e9-top" d="M 30 100 a 70 70 0 0 1 140 0" />
              <path id="cc3-e9-bot" d="M 30 100 a 70 70 0 0 0 140 0" />
            </defs>
            <circle cx="100" cy="100" r="78" fill="none" stroke="#234a8b" strokeWidth="2"/>
            <circle cx="100" cy="100" r="60" fill="none" stroke="#234a8b" strokeWidth="0.8"/>
            <text fill="#234a8b" fontFamily="Georgia, serif" fontSize="13" fontWeight="700" letterSpacing="3">
              <textPath href="#cc3-e9-top" startOffset="50%" textAnchor="middle">WALL · OF · COOL</textPath>
            </text>
            <text fill="#234a8b" fontFamily="ui-monospace, monospace" fontSize="9" letterSpacing="2">
              <textPath href="#cc3-e9-bot" startOffset="50%" textAnchor="middle">DENHAM · UK · EGLD</textPath>
            </text>
            <text x="100" y="92" textAnchor="middle" fontFamily="Georgia, serif" fontSize="11" fontStyle="italic" fontWeight="700" fill="#234a8b">No.</text>
            <text x="100" y="118" textAnchor="middle" fontFamily="Georgia, serif" fontSize="32" fontWeight="700" fill="#234a8b">01</text>
            <line x1="60" y1="100" x2="78" y2="100" stroke="#234a8b" strokeWidth="0.8"/>
            <line x1="122" y1="100" x2="140" y2="100" stroke="#234a8b" strokeWidth="0.8"/>
          </svg>
          <Chevrons tone="light" />
        </div>
      );

    /* ============= E10 — Way-Marker ============= */
    case 'e10':
      return (
        <div className="cc3-cell cc3-cell--e10">
          <div className="cc3-e10__post" aria-hidden="true" />
          <div className="cc3-e10__signs">
            <div className="cc3-e10__sign cc3-e10__sign--right">
              <span className="cc3-e10__sign-place">Denham</span>
              <span className="cc3-e10__sign-dist">5 min</span>
            </div>
            <div className="cc3-e10__sign cc3-e10__sign--left cc3-e10__sign--feature">
              <span className="cc3-e10__sign-place">Wall of Cool</span>
              <span className="cc3-e10__sign-dist">No. 01</span>
            </div>
            <div className="cc3-e10__sign cc3-e10__sign--right">
              <span className="cc3-e10__sign-place">North Pole</span>
              <span className="cc3-e10__sign-dist">2,348 NM</span>
            </div>
          </div>
          <Chevrons tone="light" />
        </div>
      );

    default: return null;
  }
};

const CenterLayout = ({ variantId }) => (
  <div className="cc3-stack">
    <div className="cc3-gallery">
      <div className="cc3-grid">
        {IMAGES.slice(0, 4).map((img, i) => (
          <div className="cc3-cell cc3-cell--img" key={`a-${i}`}>
            <img src={img.src} alt={img.alt} loading="lazy" />
          </div>
        ))}
        {renderCenterCard(variantId)}
        {IMAGES.slice(4).map((img, i) => (
          <div className="cc3-cell cc3-cell--img" key={`b-${i}`}>
            <img src={img.src} alt={img.alt} loading="lazy" />
          </div>
        ))}
      </div>
    </div>
    <footer className="cc3-footer">
      <div className="cc3-footer__issue">Are you an HQ'er with some cool footage?</div>
      <button className="cc3-footer__btn">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
          <polyline points="17 8 12 3 7 8" />
          <line x1="12" y1="3" x2="12" y2="15" />
        </svg>
        Upload
      </button>
      <button className="cc3-footer__btn" aria-label="Fullscreen gallery">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M8 3H5a2 2 0 00-2 2v3m18 0V5a2 2 0 00-2-2h-3m0 18h3a2 2 0 002-2v-3M3 16v3a2 2 0 002 2h3" />
        </svg>
        Fullscreen
      </button>
    </footer>
  </div>
);

export default function WallOfCoolCenterCardVariations3() {
  return (
    <div className="cc3-page">
      <header className="cc3-topnav">
        <div className="cc3-topnav__title">Wall of Cool — Centre Card · Travel Batch</div>
        <nav className="cc3-topnav__links">
          <a className="cc3-topnav__back" href="/wall-of-cool-center-card-variations-2">← Batch 2</a>
          {VARIATIONS.map((v) => (
            <a key={v.id} href={`#${v.id}`}>{v.id.toUpperCase()}</a>
          ))}
        </nav>
      </header>

      {VARIATIONS.map((v) => (
        <section className="cc3-variant" data-variant={v.id} id={v.id} key={v.id}>
          <div className="cc3-variant__sticky">
            <div className="cc3-variant__label">
              <span className="cc3-variant__number">{v.id.toUpperCase()}</span>
              <div>
                <h2 className="cc3-variant__title">{v.title}</h2>
                <p className="cc3-variant__desc">{v.desc}</p>
              </div>
            </div>
            <div className="cc3-variant__canvas">
              <CenterLayout variantId={v.id} />
            </div>
          </div>
        </section>
      ))}

      <style>{`
        .cc3-page {
          font-family: 'Space Grotesk', -apple-system, sans-serif;
          background: #faf9f6;
          min-height: 100vh;
          color: #1a1a1a;
        }

        /* Top nav */
        .cc3-topnav {
          position: sticky; top: 0; z-index: 100;
          display: flex; align-items: center; justify-content: space-between; gap: 1rem;
          padding: 0.65rem 1.25rem;
          background: rgba(255,255,255,0.92);
          backdrop-filter: blur(10px);
          border-bottom: 1px solid #e5e7eb;
        }
        .cc3-topnav__title { font-weight: 600; font-size: 0.9rem; }
        .cc3-topnav__links { display: flex; gap: 0.35rem; flex-wrap: wrap; }
        .cc3-topnav__links a {
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
        .cc3-topnav__back { background: #1a1a1a !important; color: #fff !important; border-color: #1a1a1a !important; }
        .cc3-topnav__links a:hover { background: #1a1a1a; color: #fff; }

        /* Variant shell */
        .cc3-variant { position: relative; height: 150vh; padding: 2rem 1.5rem 0; }
        .cc3-variant__sticky {
          position: sticky; top: 70px;
          display: flex; flex-direction: column; gap: 0.9rem;
          height: calc(100vh - 90px);
        }
        .cc3-variant__label { flex: 0 0 auto; display: flex; align-items: flex-start; gap: 0.9rem; }
        .cc3-variant__number {
          display: inline-flex; align-items: center; justify-content: center;
          min-width: 48px; height: 40px; padding: 0 0.55rem;
          background: #1a1a1a; color: #fff; border-radius: 6px;
          font-family: 'Share Tech Mono', monospace; font-size: 0.75rem; letter-spacing: 0.08em;
        }
        .cc3-variant__title { margin: 0; font-size: 1.1rem; font-weight: 600; }
        .cc3-variant__desc { margin: 0.2rem 0 0; color: #666; font-size: 0.82rem; max-width: 820px; }
        .cc3-variant__canvas { flex: 1 1 auto; min-height: 0; display: flex; }
        .cc3-variant__canvas > * { width: 100%; }

        /* Gallery */
        .cc3-stack { display: flex; flex-direction: column; height: 100%; }
        .cc3-gallery {
          flex: 1 1 auto; position: relative; overflow: hidden;
          border-radius: 10px;
          background: linear-gradient(to bottom, #ffffff 0%, #000000 100%);
        }
        .cc3-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          grid-template-rows: repeat(3, 1fr);
          gap: 8px; padding: 8px; height: 100%;
        }
        .cc3-cell {
          position: relative; overflow: hidden; border-radius: 8px;
          border: 1px solid rgba(255,255,255,0.22);
          background: #1a1a1a;
        }
        .cc3-cell--img img { width: 100%; height: 100%; object-fit: cover; display: block; }

        /* Footer */
        .cc3-footer {
          flex: 0 0 auto;
          display: flex; flex-wrap: wrap; align-items: center; justify-content: center;
          gap: 1rem; padding: 0.9rem 1.25rem; margin-top: 8px;
          background: #1a1a1a; color: #fff; border-radius: 10px;
        }
        .cc3-footer__issue { flex: 1 1 auto; min-width: 160px; font-size: 0.85rem; color: rgba(255,255,255,0.85); }
        .cc3-footer__btn {
          display: inline-flex; align-items: center; gap: 0.45rem;
          padding: 0.45rem 0.85rem;
          background: transparent; border: 1px solid rgba(255,255,255,0.25);
          border-radius: 6px; color: #fff;
          font-family: 'Share Tech Mono', monospace;
          font-size: 0.72rem; letter-spacing: 0.08em; text-transform: uppercase;
          cursor: pointer;
        }
        .cc3-footer__btn:hover { background: rgba(255,255,255,0.1); }

        /* Chevrons */
        .cc3-nav { display: inline-flex; align-items: center; gap: 0.5rem; }
        .cc3-chevron {
          width: 26px; height: 26px;
          display: inline-flex; align-items: center; justify-content: center;
          border-radius: 50%; border: 1px solid currentColor; background: transparent;
          cursor: pointer; font-size: 0.62rem; color: inherit;
        }
        .cc3-chevron:disabled { opacity: 0.35; cursor: not-allowed; }
        .cc3-count {
          font-family: 'Share Tech Mono', monospace;
          font-size: 0.66rem; letter-spacing: 0.14em;
          min-width: 3.2rem; text-align: center; color: inherit;
        }
        .cc3-nav--light { color: #0a0a0a; }
        .cc3-nav--dark { color: rgba(255,255,255,0.75); }

        /* ============= E1 — Compass Rose ============= */
        .cc3-cell--e1 {
          background: #faf6ec;
          border: 1px solid rgba(0,0,0,0.1);
          color: #0a0a0a;
          display: grid;
          place-items: center;
          padding: 0.5rem;
        }
        .cc3-e1__rose {
          grid-row: 1; grid-column: 1;
          width: 100%; height: 100%; max-height: 100%;
          opacity: 0.85;
        }
        .cc3-e1__center {
          grid-row: 1; grid-column: 1;
          z-index: 2;
          background: #faf6ec;
          padding: 0.4rem 0.7rem;
          border: 1px solid #0a0a0a;
          text-align: center;
          display: flex; flex-direction: column; gap: 0.2rem;
          max-width: 70%;
        }
        .cc3-e1__pretitle {
          font-family: 'Share Tech Mono', monospace;
          font-size: 0.55rem;
          letter-spacing: 0.2em;
          text-transform: uppercase;
          color: #6b7280;
        }
        .cc3-e1__title {
          margin: 0;
          font-family: Georgia, serif;
          font-style: italic;
          font-weight: 500;
          font-size: clamp(0.95rem, 1.85vw, 1.4rem);
          line-height: 1;
        }
        .cc3-cell--e1 .cc3-nav {
          grid-row: 1; grid-column: 1;
          align-self: end;
          margin-bottom: 0.4rem;
          z-index: 3;
        }

        /* ============= E2 — Boarding Pass ============= */
        .cc3-cell--e2 {
          background: #fff;
          border: 1px solid rgba(0,0,0,0.1);
          color: #0a0a0a;
          display: grid;
          grid-template-columns: 1fr auto;
          grid-template-rows: 1fr auto;
        }
        .cc3-e2__main { padding: 0.7rem 0.85rem; display: flex; flex-direction: column; gap: 0.45rem; }
        .cc3-e2__head {
          display: flex; justify-content: space-between; align-items: baseline;
          padding-bottom: 0.4rem;
          border-bottom: 1px dashed rgba(0,0,0,0.3);
        }
        .cc3-e2__brand {
          font-family: 'Inter', sans-serif;
          font-weight: 700;
          font-size: 0.7rem;
          letter-spacing: 0.06em;
          text-transform: uppercase;
        }
        .cc3-e2__type {
          font-family: 'Share Tech Mono', monospace;
          font-size: 0.55rem;
          letter-spacing: 0.18em;
          text-transform: uppercase;
          color: #6b7280;
        }
        .cc3-e2__route {
          display: flex; align-items: center; justify-content: space-between;
          gap: 0.5rem;
          padding: 0.2rem 0;
        }
        .cc3-e2__port { display: flex; flex-direction: column; align-items: center; }
        .cc3-e2__code {
          font-family: 'Inter', sans-serif;
          font-weight: 800;
          font-size: clamp(1.3rem, 2.6vw, 2rem);
          letter-spacing: -0.02em;
          line-height: 1;
        }
        .cc3-e2__city {
          font-family: 'Share Tech Mono', monospace;
          font-size: 0.5rem;
          letter-spacing: 0.18em;
          text-transform: uppercase;
          color: #6b7280;
          margin-top: 0.1rem;
        }
        .cc3-e2__plane { width: 32px; height: 12px; }
        .cc3-e2__rows {
          margin: 0;
          display: flex; gap: 0.85rem;
          padding-top: 0.3rem;
          border-top: 1px dashed rgba(0,0,0,0.2);
          font-family: 'Share Tech Mono', monospace;
        }
        .cc3-e2__rows div { display: flex; flex-direction: column; gap: 0.1rem; }
        .cc3-e2__rows dt { font-size: 0.5rem; letter-spacing: 0.16em; text-transform: uppercase; color: #6b7280; margin: 0; }
        .cc3-e2__rows dd { font-size: 0.7rem; letter-spacing: 0.06em; margin: 0; color: #0a0a0a; }

        .cc3-e2__stub {
          grid-column: 2 / 3; grid-row: 1 / 3;
          display: flex; flex-direction: column; align-items: center; justify-content: center;
          padding: 0 0.8rem;
          border-left: 2px dashed rgba(0,0,0,0.3);
          background: #fbfaf6;
          gap: 0.2rem;
        }
        .cc3-e2__stub-label {
          font-family: 'Share Tech Mono', monospace;
          font-size: 0.5rem;
          letter-spacing: 0.2em;
          color: #6b7280;
          text-transform: uppercase;
        }
        .cc3-e2__stub-num {
          font-family: 'Inter', sans-serif;
          font-weight: 800;
          font-size: clamp(1.6rem, 3.4vw, 2.5rem);
          letter-spacing: -0.02em;
          line-height: 1;
        }
        .cc3-cell--e2 .cc3-nav {
          grid-column: 1 / 2; grid-row: 2 / 3;
          padding: 0.35rem 0.85rem;
          justify-content: center;
          border-top: 1px dashed rgba(0,0,0,0.2);
        }

        /* ============= E3 — Atlas Spread ============= */
        .cc3-cell--e3 {
          background: #f6efde;
          border: 1px solid rgba(0,0,0,0.12);
          color: #0a0a0a;
          display: grid;
          place-items: stretch;
          position: relative;
        }
        .cc3-e3__map {
          grid-row: 1; grid-column: 1;
          width: 100%; height: 100%;
        }
        .cc3-e3__overlay {
          grid-row: 1; grid-column: 1;
          padding: 0.7rem 0.8rem;
          display: flex; flex-direction: column;
          z-index: 2;
        }
        .cc3-e3__top {
          display: flex; justify-content: space-between;
          font-family: 'Share Tech Mono', monospace;
          font-size: 0.55rem;
          letter-spacing: 0.16em;
          color: #5a4f33;
        }
        .cc3-e3__title {
          margin: auto 0 0.15rem;
          font-family: Georgia, serif;
          font-style: italic;
          font-weight: 500;
          font-size: clamp(1.1rem, 2.2vw, 1.65rem);
          line-height: 1;
          color: #0a0a0a;
        }
        .cc3-e3__place {
          font-family: 'Share Tech Mono', monospace;
          font-size: 0.55rem;
          letter-spacing: 0.18em;
          text-transform: uppercase;
          color: #5a4f33;
        }
        .cc3-cell--e3 .cc3-nav {
          margin-top: 0.4rem;
          align-self: flex-start;
        }

        /* ============= E4 — Departure Board ============= */
        .cc3-cell--e4 {
          background: #0d0d0d;
          border: 1px solid rgba(255,255,255,0.06);
          color: #f5b73a;
          padding: 0.6rem 0.7rem;
          font-family: 'Share Tech Mono', monospace;
          display: flex;
          flex-direction: column;
          gap: 0.35rem;
        }
        .cc3-e4__head {
          display: flex; justify-content: space-between; align-items: baseline;
          padding-bottom: 0.35rem;
          border-bottom: 1px solid rgba(245, 183, 58, 0.3);
          font-size: 0.62rem;
          letter-spacing: 0.16em;
          text-transform: uppercase;
        }
        .cc3-e4__live { color: #f15c5c; font-size: 0.55rem; }
        .cc3-e4__rows { display: flex; flex-direction: column; gap: 0.25rem; flex: 1; }
        .cc3-e4__row {
          display: grid;
          grid-template-columns: auto 1fr auto;
          gap: 0.5rem;
          padding: 0.18rem 0;
          font-size: 0.65rem;
          letter-spacing: 0.06em;
          align-items: baseline;
          color: rgba(245, 183, 58, 0.7);
        }
        .cc3-e4__row--feature { color: #f5b73a; font-size: 0.78rem; font-weight: 700; }
        .cc3-e4__time { font-variant-numeric: tabular-nums; }
        .cc3-e4__dest { letter-spacing: 0.12em; text-transform: uppercase; }
        .cc3-e4__gate { font-variant-numeric: tabular-nums; }
        .cc3-cell--e4 .cc3-nav {
          margin-top: auto;
          padding-top: 0.3rem;
          border-top: 1px solid rgba(245, 183, 58, 0.3);
          color: rgba(245, 183, 58, 0.7);
        }
        .cc3-cell--e4 .cc3-chevron { border-color: rgba(245, 183, 58, 0.7); }
        .cc3-cell--e4 .cc3-count { color: rgba(245, 183, 58, 0.85); }

        /* ============= E5 — Great Circle Route ============= */
        .cc3-cell--e5 {
          background: #fff;
          border: 1px solid rgba(0,0,0,0.1);
          color: #0a0a0a;
          padding: 0.7rem 0.85rem;
          display: flex; flex-direction: column;
          gap: 0.35rem;
        }
        .cc3-e5__globe { width: 100%; height: auto; flex: 0 0 auto; }
        .cc3-e5__meta { text-align: center; }
        .cc3-e5__title {
          margin: 0;
          font-family: 'Inter', sans-serif;
          font-weight: 700;
          font-size: clamp(1rem, 2.1vw, 1.6rem);
          letter-spacing: -0.01em;
          line-height: 1;
          text-transform: uppercase;
        }
        .cc3-e5__data {
          display: flex; align-items: center; justify-content: center; gap: 0.45rem;
          font-family: 'Share Tech Mono', monospace;
          font-size: 0.6rem;
          letter-spacing: 0.14em;
          text-transform: uppercase;
          color: #6b7280;
          margin-top: 0.2rem;
        }
        .cc3-cell--e5 .cc3-nav { margin-top: auto; align-self: center; }

        /* ============= E6 — Three Time Zones ============= */
        .cc3-cell--e6 {
          background: #fff;
          border: 1px solid rgba(0,0,0,0.1);
          color: #0a0a0a;
          padding: 0.85rem 0.9rem;
          display: flex; flex-direction: column;
          align-items: center;
          gap: 0.55rem;
        }
        .cc3-e6__title {
          margin: 0;
          font-family: 'Inter', sans-serif;
          font-weight: 600;
          font-size: clamp(0.95rem, 1.85vw, 1.4rem);
          letter-spacing: -0.005em;
          line-height: 1;
        }
        .cc3-e6__clocks {
          display: flex; gap: 0.65rem;
          flex: 1;
          align-items: center;
        }
        .cc3-e6__zone {
          display: flex; flex-direction: column; align-items: center; gap: 0.2rem;
        }
        .cc3-e6__face { width: 48px; height: 48px; }
        .cc3-e6__label {
          font-family: 'Share Tech Mono', monospace;
          font-size: 0.55rem;
          letter-spacing: 0.18em;
          font-weight: 700;
        }
        .cc3-e6__sub {
          font-family: 'Share Tech Mono', monospace;
          font-size: 0.5rem;
          letter-spacing: 0.16em;
          color: #6b7280;
        }

        /* ============= E7 — Travel Poster ============= */
        .cc3-cell--e7 {
          background: #15464d;
          color: #fff;
          border: 1px solid rgba(0,0,0,0.2);
          padding: 0.85rem 0.95rem;
          display: flex; flex-direction: column;
          gap: 0.3rem;
        }
        .cc3-e7__top {
          display: flex; justify-content: space-between; align-items: baseline;
          padding-bottom: 0.3rem;
          border-bottom: 1px solid rgba(255,255,255,0.3);
          font-family: 'Share Tech Mono', monospace;
          font-size: 0.55rem;
          letter-spacing: 0.2em;
          text-transform: uppercase;
          color: rgba(255,255,255,0.7);
        }
        .cc3-e7__hero {
          flex: 1;
          display: flex; align-items: center; justify-content: space-between;
          gap: 0.5rem;
        }
        .cc3-e7__title {
          margin: 0;
          font-family: 'Inter', sans-serif;
          font-weight: 900;
          font-size: clamp(1.1rem, 2.4vw, 1.85rem);
          line-height: 0.85;
          letter-spacing: -0.025em;
          text-transform: uppercase;
          display: flex; flex-direction: column;
        }
        .cc3-e7__title .cc3-e7__of {
          font-style: italic;
          font-weight: 400;
          font-size: 0.55em;
          color: rgba(255,255,255,0.7);
          margin: 0.05em 0;
        }
        .cc3-e7__mark {
          width: 50px; height: 50px;
          flex-shrink: 0;
        }
        .cc3-e7__strap {
          font-family: 'Share Tech Mono', monospace;
          font-size: 0.55rem;
          letter-spacing: 0.22em;
          text-transform: uppercase;
          color: rgba(255,255,255,0.55);
        }

        /* ============= E8 — Postcard ============= */
        .cc3-cell--e8 {
          background: #f8f1de;
          border: 1px solid rgba(0,0,0,0.12);
          color: #0a0a0a;
          padding: 0.6rem 0.75rem;
          display: flex; flex-direction: column;
          gap: 0.4rem;
        }
        .cc3-e8__head {
          display: flex; justify-content: space-between; align-items: flex-start;
          padding-bottom: 0.35rem;
          border-bottom: 2px solid #0a0a0a;
        }
        .cc3-e8__heading {
          font-family: Georgia, serif;
          font-style: italic;
          font-weight: 500;
          font-size: 0.85rem;
          letter-spacing: 0.04em;
        }
        .cc3-e8__stamp {
          width: 38px; height: 44px;
          padding: 0.2rem;
          border: 1.5px solid #0a0a0a;
          background: #d8c8a8;
          display: flex; flex-direction: column; align-items: center; justify-content: center;
          gap: 0.1rem;
          /* perforated edge effect */
          background-image: radial-gradient(circle at 0 50%, transparent 1.5px, transparent 0), radial-gradient(circle at 100% 50%, transparent 1.5px, transparent 0);
        }
        .cc3-e8__stamp-num {
          font-family: Georgia, serif;
          font-weight: 700;
          font-size: 0.95rem;
          color: #0a0a0a;
          line-height: 1;
        }
        .cc3-e8__stamp-label {
          font-family: 'Share Tech Mono', monospace;
          font-size: 0.42rem;
          letter-spacing: 0.12em;
          color: #0a0a0a;
        }
        .cc3-e8__body {
          flex: 1;
          display: flex; flex-direction: column; align-items: center; justify-content: center;
          position: relative;
          gap: 0.3rem;
          text-align: center;
        }
        .cc3-e8__postmark {
          position: absolute; top: 0; right: 0;
          width: 44px; height: 44px;
          opacity: 0.7;
          transform: rotate(-12deg);
        }
        .cc3-e8__postmark svg { width: 100%; height: 100%; }
        .cc3-e8__title {
          margin: 0;
          font-family: Georgia, serif;
          font-style: italic;
          font-weight: 500;
          font-size: clamp(1rem, 2vw, 1.5rem);
          line-height: 1;
        }
        .cc3-e8__sub {
          font-family: Georgia, serif;
          font-style: italic;
          font-size: 0.7rem;
          color: #5a4f33;
          line-height: 1.3;
        }
        .cc3-cell--e8 .cc3-nav {
          padding-top: 0.3rem;
          border-top: 1px solid rgba(0,0,0,0.15);
          align-self: center;
        }

        /* ============= E9 — Customs Stamp ============= */
        .cc3-cell--e9 {
          background: #f7f1de;
          border: 1px solid rgba(0,0,0,0.12);
          color: #234a8b;
          display: grid;
          place-items: center;
          padding: 0.5rem;
        }
        .cc3-e9__stamp {
          grid-row: 1; grid-column: 1;
          width: 100%; height: 100%;
          max-width: 90%; max-height: 90%;
          transform: rotate(-6deg);
          opacity: 0.9;
        }
        .cc3-cell--e9 .cc3-nav {
          grid-row: 1; grid-column: 1;
          align-self: end;
          margin-bottom: 0.3rem;
          color: #234a8b;
        }

        /* ============= E10 — Way-Marker ============= */
        .cc3-cell--e10 {
          background: #f7f3e8;
          border: 1px solid rgba(0,0,0,0.12);
          color: #0a0a0a;
          padding: 0.7rem 0.85rem;
          display: flex; flex-direction: column;
          align-items: center;
          gap: 0.3rem;
          position: relative;
          overflow: hidden;
        }
        .cc3-e10__post {
          position: absolute;
          left: 50%;
          top: 0.5rem;
          bottom: 2.5rem;
          width: 4px;
          background: #5a4f33;
          transform: translateX(-50%);
          z-index: 0;
        }
        .cc3-e10__signs {
          display: flex; flex-direction: column;
          gap: 0.3rem;
          width: 100%;
          flex: 1;
          z-index: 1;
          padding-top: 0.2rem;
          justify-content: center;
        }
        .cc3-e10__sign {
          background: #fdfbf2;
          border: 1.5px solid #0a0a0a;
          padding: 0.3rem 0.55rem;
          width: max-content;
          max-width: 95%;
          display: flex; align-items: baseline; gap: 0.4rem;
          box-shadow: 0 1px 0 rgba(0,0,0,0.1);
        }
        .cc3-e10__sign--left {
          align-self: flex-start;
          clip-path: polygon(0 0, 100% 0, 100% 100%, 0 100%, -8px 50%);
          padding-left: 0.85rem;
        }
        .cc3-e10__sign--right {
          align-self: flex-end;
          clip-path: polygon(0 0, calc(100% + 8px) 50%, 100% 100%, 0 100%);
          padding-right: 0.85rem;
        }
        .cc3-e10__sign--feature {
          background: #0a0a0a;
          color: #fdfbf2;
          border-color: #0a0a0a;
        }
        .cc3-e10__sign--feature .cc3-e10__sign-dist { color: rgba(253,251,242,0.75); }
        .cc3-e10__sign-place {
          font-family: 'Inter', sans-serif;
          font-weight: 700;
          font-size: 0.78rem;
          letter-spacing: 0.02em;
          text-transform: uppercase;
        }
        .cc3-e10__sign-dist {
          font-family: 'Share Tech Mono', monospace;
          font-size: 0.55rem;
          letter-spacing: 0.14em;
          color: #6b7280;
        }
        .cc3-cell--e10 .cc3-nav {
          margin-top: auto;
          z-index: 2;
        }

        @media (max-width: 768px) {
          .cc3-variant { height: 130vh; }
          .cc3-variant__title { font-size: 1rem; }
          .cc3-variant__desc { font-size: 0.75rem; }
        }
      `}</style>
    </div>
  );
}

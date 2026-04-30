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
  { id: 'f1',  title: 'ATC Flight Strip',         desc: 'Yellow paper strip from a tower controller — callsign, type, route, FL, squawk. Pilot vernacular.' },
  { id: 'f2',  title: 'METAR Report',             desc: 'Coded aviation weather observation in mono with a quiet plain-English line below.' },
  { id: 'f3',  title: 'VOR Rose',                 desc: 'Navaid rose — radial degree markings every 10°, station identifier and frequency at centre.' },
  { id: 'f4',  title: 'Airfield Diagram',         desc: 'Top-down runway sketch — 08/26 designators, threshold markings, taxiways. Like a Jeppesen plate.' },
  { id: 'f5',  title: 'Wind Rose',                desc: 'Cardinal-petal wind frequency chart, larger petals showing prevailing direction.' },
  { id: 'f6',  title: 'Luggage Tag',              desc: 'Cream paper tag, punch-hole at top with twine knot, address lines, PRIORITY stamp.' },
  { id: 'f7',  title: 'Passport Stamps',          desc: 'Collage of customs stamps in three inks — different shapes, slight rotations, the feature stamp on top.' },
  { id: 'f8',  title: 'Hotel Key Card',           desc: 'Minimalist black plastic card — embossed room number, hotel mark, magnetic stripe at the bottom.' },
  { id: 'f9',  title: 'Travel Journal',           desc: 'Lined journal page — handwritten date, italic title, one small ink sketch alongside.' },
  { id: 'f10', title: 'Polaroid',                 desc: 'Square Polaroid with thick white border, generous bottom strip for a handwritten caption.' },
  { id: 'f11', title: 'Highway Shield',           desc: 'US-Interstate-style shield — number "01" red top, name "WALL OF COOL" blue bottom.' },
  { id: 'f12', title: 'Metro Line Marker',        desc: 'Solid coloured circle with a letter inside — line name and stop list beside it. Subway-system clarity.' },
  { id: 'f13', title: 'Star Chart',               desc: 'Black sky panel with constellation dots and lines, the constellation named "Wall of Cool".' },
  { id: 'f14', title: 'Vintage Airline Ticket',   desc: 'Cream multi-coupon ticket envelope — passenger row, fare row, perforated coupon stub.' },
  { id: 'f15', title: 'Steamer Trunk Label',      desc: 'Aged paper shipping label with a "WANTED IN STATEROOM" header and steamship line accents.' },
  { id: 'f16', title: 'Globe & Banner',           desc: 'Hand-drawn globe with longitude lines and a heraldic ribbon-banner across the equator carrying the title.' },
  { id: 'f17', title: 'Tide Chart',               desc: 'Sinusoidal tide curve over a 24-hour ruler with high/low tide markers and a place name.' },
  { id: 'f18', title: 'Aircraft Tail Livery',     desc: 'White vertical fin with a painted tail registration "G-HQAV" — corporate jet livery codes.' },
  { id: 'f19', title: 'Subway Stop List',         desc: 'Vertical line with stops, the highlighted stop is "Wall of Cool". Clean transit map vocabulary.' },
  { id: 'f20', title: 'Postage Stamp Sheet',      desc: 'A single perforated stamp on a sheet — denomination, country, illustration of a helicopter.' },
];

const Chevrons = ({ tone = 'light' }) => (
  <div className={`cc4-nav cc4-nav--${tone}`}>
    <button className="cc4-chevron" aria-label="Previous page" disabled>
      <i className="fas fa-chevron-left" />
    </button>
    <span className="cc4-count">01 / 04</span>
    <button className="cc4-chevron" aria-label="Next page">
      <i className="fas fa-chevron-right" />
    </button>
  </div>
);

const renderCenterCard = (id) => {
  switch (id) {

    /* ===== F1 — ATC Flight Strip ===== */
    case 'f1':
      return (
        <div className="cc4-cell cc4-cell--f1">
          <div className="cc4-f1__top">
            <span className="cc4-f1__callsign">HQ011</span>
            <span className="cc4-f1__type">R66</span>
            <span className="cc4-f1__sq">SQ 7000</span>
          </div>
          <div className="cc4-f1__route">EGLD ▸ WoC ▸ EGLD</div>
          <dl className="cc4-f1__data">
            <div><dt>FL</dt><dd>015</dd></div>
            <div><dt>EOBT</dt><dd>1430</dd></div>
            <div><dt>EET</dt><dd>0:45</dd></div>
          </dl>
          <h2 className="cc4-f1__title">Wall of Cool</h2>
          <Chevrons tone="light" />
        </div>
      );

    /* ===== F2 — METAR Report ===== */
    case 'f2':
      return (
        <div className="cc4-cell cc4-cell--f2">
          <div className="cc4-f2__head">
            <span>METAR</span>
            <span>EGLD</span>
            <span>251420Z</span>
          </div>
          <code className="cc4-f2__code">24010KT 9999 FEW030 18/12 Q1015 NOSIG</code>
          <h2 className="cc4-f2__title">Wall of Cool</h2>
          <span className="cc4-f2__plain">Light SW wind, scattered cumulus, fly day.</span>
          <Chevrons tone="light" />
        </div>
      );

    /* ===== F3 — VOR Rose ===== */
    case 'f3':
      return (
        <div className="cc4-cell cc4-cell--f3">
          <svg className="cc4-f3__rose" viewBox="0 0 200 200" aria-hidden="true">
            <circle cx="100" cy="100" r="86" fill="none" stroke="#0a0a0a" strokeWidth="1"/>
            <circle cx="100" cy="100" r="74" fill="none" stroke="#0a0a0a" strokeWidth="0.4"/>
            {Array.from({length: 36}).map((_, i) => {
              const a = (i * 10 - 90) * Math.PI / 180;
              const major = i % 3 === 0;
              return <line key={i} x1={100 + Math.cos(a) * 78} y1={100 + Math.sin(a) * 78} x2={100 + Math.cos(a) * 86} y2={100 + Math.sin(a) * 86} stroke="#0a0a0a" strokeWidth={major ? 1 : 0.4}/>;
            })}
            {[0, 90, 180, 270, 30, 60, 120, 150, 210, 240, 300, 330].map((deg) => {
              const a = (deg - 90) * Math.PI / 180;
              const r = 66;
              return <text key={deg} x={100 + Math.cos(a) * r} y={100 + Math.sin(a) * r + 3} textAnchor="middle" fontFamily="ui-monospace, monospace" fontSize="7" fill="#0a0a0a">{String(deg).padStart(3,'0')}</text>;
            })}
            <text x="100" y="92" textAnchor="middle" fontFamily="ui-monospace, monospace" fontSize="9" fontWeight="700" letterSpacing="2" fill="#0a0a0a">DEN</text>
            <text x="100" y="105" textAnchor="middle" fontFamily="ui-monospace, monospace" fontSize="6" letterSpacing="1" fill="#0a0a0a">115.10</text>
            <text x="100" y="116" textAnchor="middle" fontFamily="ui-monospace, monospace" fontSize="5" letterSpacing="1" fill="#0a0a0a">VOR</text>
          </svg>
          <div className="cc4-f3__caption">
            <h2 className="cc4-f3__title">Wall of Cool</h2>
            <span className="cc4-f3__sub">RADIAL 014°</span>
          </div>
          <Chevrons tone="light" />
        </div>
      );

    /* ===== F4 — Airfield Diagram ===== */
    case 'f4':
      return (
        <div className="cc4-cell cc4-cell--f4">
          <svg className="cc4-f4__diagram" viewBox="0 0 200 200" aria-hidden="true">
            <rect width="200" height="200" fill="#1a3a2a"/>
            <g transform="translate(100,100) rotate(-22)">
              <rect x="-12" y="-72" width="24" height="144" fill="#3a3a3a"/>
              <line x1="0" y1="-72" x2="0" y2="72" stroke="#fff" strokeWidth="1" strokeDasharray="6 4"/>
              <text x="0" y="-58" textAnchor="middle" fontFamily="ui-monospace, monospace" fontSize="9" fontWeight="700" fill="#fff">26</text>
              <text x="0" y="65" textAnchor="middle" fontFamily="ui-monospace, monospace" fontSize="9" fontWeight="700" fill="#fff">08</text>
              {[-66, -56, 56, 66].map((y) => (
                <line key={y} x1="-9" y1={y} x2="9" y2={y} stroke="#fff" strokeWidth="0.6"/>
              ))}
            </g>
            <g transform="translate(100,100)" stroke="#fff" strokeWidth="0.5" opacity="0.6">
              <path d="M -50 25 L 0 50" fill="none"/>
              <path d="M 30 -40 L 50 -25" fill="none"/>
            </g>
            <text x="10" y="14" fontFamily="ui-monospace, monospace" fontSize="7" fill="#fff" letterSpacing="1.5">EGLD · DENHAM</text>
            <text x="10" y="190" fontFamily="ui-monospace, monospace" fontSize="6" fill="#fff" letterSpacing="1" opacity="0.7">ELEV 249'</text>
          </svg>
          <div className="cc4-f4__caption">
            <h2 className="cc4-f4__title">Wall of Cool</h2>
            <span className="cc4-f4__sub">No. 01 / 04</span>
          </div>
          <Chevrons tone="dark" />
        </div>
      );

    /* ===== F5 — Wind Rose ===== */
    case 'f5':
      return (
        <div className="cc4-cell cc4-cell--f5">
          <svg className="cc4-f5__rose" viewBox="0 0 200 200" aria-hidden="true">
            <circle cx="100" cy="100" r="80" fill="none" stroke="#0a0a0a" strokeWidth="0.6"/>
            <circle cx="100" cy="100" r="55" fill="none" stroke="#0a0a0a" strokeWidth="0.3" opacity="0.5"/>
            <circle cx="100" cy="100" r="30" fill="none" stroke="#0a0a0a" strokeWidth="0.3" opacity="0.5"/>
            {[
              {deg: 0, len: 40, w: 18},
              {deg: 45, len: 25, w: 14},
              {deg: 90, len: 20, w: 14},
              {deg: 135, len: 30, w: 14},
              {deg: 180, len: 35, w: 18},
              {deg: 225, len: 60, w: 18},
              {deg: 270, len: 45, w: 14},
              {deg: 315, len: 30, w: 14},
            ].map(({deg, len, w}) => {
              const a = (deg - 90) * Math.PI / 180;
              const x = 100 + Math.cos(a) * len;
              const y = 100 + Math.sin(a) * len;
              const px = 100 + Math.cos(a + Math.PI/2) * (w/2);
              const py = 100 + Math.sin(a + Math.PI/2) * (w/2);
              const px2 = 100 + Math.cos(a - Math.PI/2) * (w/2);
              const py2 = 100 + Math.sin(a - Math.PI/2) * (w/2);
              return <polygon key={deg} points={`100,100 ${px},${py} ${x},${y} ${px2},${py2}`} fill="#0a0a0a" opacity="0.78"/>;
            })}
            <text x="100" y="14" textAnchor="middle" fontFamily="ui-monospace, monospace" fontSize="9" fontWeight="700" fill="#0a0a0a">N</text>
            <text x="186" y="104" textAnchor="middle" fontFamily="ui-monospace, monospace" fontSize="9" fontWeight="700" fill="#0a0a0a">E</text>
            <text x="100" y="194" textAnchor="middle" fontFamily="ui-monospace, monospace" fontSize="9" fontWeight="700" fill="#0a0a0a">S</text>
            <text x="14" y="104" textAnchor="middle" fontFamily="ui-monospace, monospace" fontSize="9" fontWeight="700" fill="#0a0a0a">W</text>
          </svg>
          <div className="cc4-f5__caption">
            <h2 className="cc4-f5__title">Wall of Cool</h2>
            <span className="cc4-f5__sub">Prevailing 240° · Denham</span>
          </div>
          <Chevrons tone="light" />
        </div>
      );

    /* ===== F6 — Luggage Tag ===== */
    case 'f6':
      return (
        <div className="cc4-cell cc4-cell--f6">
          <div className="cc4-f6__hole" aria-hidden="true">
            <span />
          </div>
          <div className="cc4-f6__priority">Priority · 01</div>
          <div className="cc4-f6__lines">
            <div><dt>To</dt><dd>Wall of Cool</dd></div>
            <div><dt>From</dt><dd>HQ Aviation</dd></div>
            <div><dt>Via</dt><dd>EGLD · Denham</dd></div>
          </div>
          <Chevrons tone="light" />
        </div>
      );

    /* ===== F7 — Passport Stamps ===== */
    case 'f7':
      return (
        <div className="cc4-cell cc4-cell--f7">
          <svg className="cc4-f7__a" viewBox="0 0 80 80" aria-hidden="true">
            <rect x="4" y="4" width="72" height="72" fill="none" stroke="#234a8b" strokeWidth="1.5"/>
            <text x="40" y="36" textAnchor="middle" fontFamily="Georgia, serif" fontSize="9" fontWeight="700" fill="#234a8b">CABO</text>
            <text x="40" y="50" textAnchor="middle" fontFamily="ui-monospace, monospace" fontSize="6" fill="#234a8b" letterSpacing="1">2024</text>
          </svg>
          <svg className="cc4-f7__b" viewBox="0 0 80 80" aria-hidden="true">
            <circle cx="40" cy="40" r="34" fill="none" stroke="#1c5f3f" strokeWidth="1.5"/>
            <text x="40" y="36" textAnchor="middle" fontFamily="Georgia, serif" fontSize="9" fontWeight="700" fill="#1c5f3f">REYK</text>
            <text x="40" y="50" textAnchor="middle" fontFamily="ui-monospace, monospace" fontSize="6" fill="#1c5f3f" letterSpacing="1">2025</text>
          </svg>
          <svg className="cc4-f7__feature" viewBox="0 0 100 100" aria-hidden="true">
            <rect x="3" y="3" width="94" height="94" fill="none" stroke="#8b1a1a" strokeWidth="2"/>
            <rect x="9" y="9" width="82" height="82" fill="none" stroke="#8b1a1a" strokeWidth="0.5"/>
            <text x="50" y="38" textAnchor="middle" fontFamily="Georgia, serif" fontStyle="italic" fontSize="11" fontWeight="700" fill="#8b1a1a">Wall of Cool</text>
            <line x1="20" y1="50" x2="80" y2="50" stroke="#8b1a1a" strokeWidth="0.6"/>
            <text x="50" y="66" textAnchor="middle" fontFamily="ui-monospace, monospace" fontSize="7" letterSpacing="2" fill="#8b1a1a">DENHAM · UK</text>
            <text x="50" y="82" textAnchor="middle" fontFamily="ui-monospace, monospace" fontSize="6" letterSpacing="1" fill="#8b1a1a">25 · IV · 26</text>
          </svg>
          <Chevrons tone="light" />
        </div>
      );

    /* ===== F8 — Hotel Key Card ===== */
    case 'f8':
      return (
        <div className="cc4-cell cc4-cell--f8">
          <div className="cc4-f8__head">
            <span className="cc4-f8__brand">HQ</span>
            <span className="cc4-f8__hotel">Hotel Aviation</span>
          </div>
          <div className="cc4-f8__room">
            <span className="cc4-f8__room-label">Room</span>
            <span className="cc4-f8__room-num">01</span>
          </div>
          <h2 className="cc4-f8__title">Wall of Cool</h2>
          <div className="cc4-f8__stripe" aria-hidden="true" />
          <Chevrons tone="dark" />
        </div>
      );

    /* ===== F9 — Travel Journal ===== */
    case 'f9':
      return (
        <div className="cc4-cell cc4-cell--f9">
          <div className="cc4-f9__date">25 April · MMXXVI</div>
          <h2 className="cc4-f9__title">Wall of Cool</h2>
          <p className="cc4-f9__entry">A community gallery — pictures from the people we fly with.</p>
          <svg className="cc4-f9__sketch" viewBox="0 0 60 30" aria-hidden="true">
            <path d="M5 22 L18 22 M22 22 L55 22" stroke="#0a0a0a" strokeWidth="1" strokeLinecap="round"/>
            <circle cx="20" cy="22" r="2.5" fill="#0a0a0a"/>
            <path d="M20 20 L20 8 M16 8 L24 8" stroke="#0a0a0a" strokeWidth="1" strokeLinecap="round"/>
            <path d="M20 16 L26 12 M20 16 L14 12" stroke="#0a0a0a" strokeWidth="0.7" strokeLinecap="round"/>
          </svg>
          <Chevrons tone="light" />
        </div>
      );

    /* ===== F10 — Polaroid ===== */
    case 'f10':
      return (
        <div className="cc4-cell cc4-cell--f10">
          <div className="cc4-f10__photo" aria-hidden="true">
            <svg viewBox="0 0 100 70">
              <rect width="100" height="70" fill="#2c4660"/>
              <circle cx="78" cy="20" r="9" fill="#f6e1a3" opacity="0.85"/>
              <path d="M0 55 L25 40 L48 50 L70 35 L100 48 L100 70 L0 70 Z" fill="#1a2a3c"/>
              <path d="M30 30 L36 26 L42 30 L40 32 L34 32 Z" fill="#0a0a0a"/>
              <line x1="36" y1="26" x2="36" y2="20" stroke="#0a0a0a" strokeWidth="0.8"/>
            </svg>
          </div>
          <span className="cc4-f10__caption">Wall of Cool · 2026</span>
          <Chevrons tone="light" />
        </div>
      );

    /* ===== F11 — Highway Shield ===== */
    case 'f11':
      return (
        <div className="cc4-cell cc4-cell--f11">
          <div className="cc4-f11__shield">
            <div className="cc4-f11__top">
              <span className="cc4-f11__county">Wall of Cool</span>
            </div>
            <div className="cc4-f11__bottom">
              <span className="cc4-f11__num">01</span>
            </div>
          </div>
          <div className="cc4-f11__strap">Community Route · Denham</div>
          <Chevrons tone="light" />
        </div>
      );

    /* ===== F12 — Metro Line Marker ===== */
    case 'f12':
      return (
        <div className="cc4-cell cc4-cell--f12">
          <div className="cc4-f12__circle">W</div>
          <div className="cc4-f12__info">
            <h2 className="cc4-f12__title">Wall of Cool</h2>
            <span className="cc4-f12__line">Line 01 · Community</span>
            <span className="cc4-f12__service">Denham — All Trains</span>
          </div>
          <Chevrons tone="light" />
        </div>
      );

    /* ===== F13 — Star Chart ===== */
    case 'f13':
      return (
        <div className="cc4-cell cc4-cell--f13">
          <svg className="cc4-f13__sky" viewBox="0 0 200 200" aria-hidden="true">
            <rect width="200" height="200" fill="#0b1530"/>
            {[
              [40,30,2],[70,55,1.5],[120,40,3],[160,70,2],[55,90,1.5],
              [100,100,2.5],[150,120,2],[80,130,1.5],[125,150,1.8],[40,160,1.5],
              [175,40,1],[20,70,1],[180,160,1.2],[90,180,1],[160,180,1.5],
            ].map(([x,y,r],i) => (
              <circle key={i} cx={x} cy={y} r={r} fill="#fff" opacity={0.65 + r/10}/>
            ))}
            <path d="M70 55 L120 40 L160 70 L150 120 L100 100 L70 55 M100 100 L80 130 L125 150" stroke="#fff" strokeWidth="0.5" fill="none" opacity="0.55"/>
            <text x="100" y="195" textAnchor="middle" fontFamily="Georgia, serif" fontStyle="italic" fontSize="9" fill="#fff" opacity="0.65">CONSTELLATION · MURUS FRIGIDUS</text>
          </svg>
          <div className="cc4-f13__caption">
            <h2 className="cc4-f13__title">Wall of Cool</h2>
            <span className="cc4-f13__sub">Mag. 4.2 · 14h32m</span>
          </div>
          <Chevrons tone="dark" />
        </div>
      );

    /* ===== F14 — Vintage Airline Ticket ===== */
    case 'f14':
      return (
        <div className="cc4-cell cc4-cell--f14">
          <div className="cc4-f14__head">
            <span>HQ Aviation · Passenger Ticket</span>
            <span>01 / 04</span>
          </div>
          <dl className="cc4-f14__rows">
            <div><dt>Passenger</dt><dd>HQ'er</dd></div>
            <div><dt>From / To</dt><dd>Denham → Wall of Cool</dd></div>
            <div><dt>Class</dt><dd>Community</dd></div>
            <div><dt>Fare</dt><dd>Cool footage</dd></div>
          </dl>
          <div className="cc4-f14__perf" aria-hidden="true" />
          <div className="cc4-f14__coupon">Coupon · One Wall of Cool</div>
          <Chevrons tone="light" />
        </div>
      );

    /* ===== F15 — Steamer Trunk Label ===== */
    case 'f15':
      return (
        <div className="cc4-cell cc4-cell--f15">
          <div className="cc4-f15__band">
            <span>Wanted in Stateroom</span>
          </div>
          <div className="cc4-f15__body">
            <h2 className="cc4-f15__title">Wall of Cool</h2>
            <span className="cc4-f15__route">HQ · Denham → S/Y Various Seas</span>
            <div className="cc4-f15__rows">
              <span>Cabin No. 01</span>
              <span>Stamped 25·IV·MMXXVI</span>
            </div>
          </div>
          <Chevrons tone="light" />
        </div>
      );

    /* ===== F16 — Globe & Banner ===== */
    case 'f16':
      return (
        <div className="cc4-cell cc4-cell--f16">
          <svg className="cc4-f16__globe" viewBox="0 0 200 200" aria-hidden="true">
            <circle cx="100" cy="100" r="76" fill="none" stroke="#0a0a0a" strokeWidth="1"/>
            {[-60,-30,0,30,60].map(lat => (
              <ellipse key={lat} cx="100" cy="100" rx="76" ry={Math.cos(lat*Math.PI/180)*76} fill="none" stroke="#0a0a0a" strokeWidth="0.4" opacity="0.4"/>
            ))}
            {[-60,-30,0,30,60].map(lng => (
              <line key={lng} x1={100 + Math.sin(lng*Math.PI/180)*76} y1="24" x2={100 + Math.sin(lng*Math.PI/180)*76} y2="176" stroke="#0a0a0a" strokeWidth="0.4" opacity="0.4"/>
            ))}
          </svg>
          <div className="cc4-f16__banner">
            <span>Wall of Cool</span>
          </div>
          <span className="cc4-f16__sub">Community · No. 01</span>
          <Chevrons tone="light" />
        </div>
      );

    /* ===== F17 — Tide Chart ===== */
    case 'f17':
      return (
        <div className="cc4-cell cc4-cell--f17">
          <div className="cc4-f17__head">
            <span>Tide · Denham Reach</span>
            <span>25 · IV</span>
          </div>
          <svg className="cc4-f17__chart" viewBox="0 0 200 80" aria-hidden="true">
            <line x1="0" y1="40" x2="200" y2="40" stroke="#0a0a0a" strokeWidth="0.4" opacity="0.4"/>
            {[0,50,100,150,200].map(x => <line key={x} x1={x} y1="35" x2={x} y2="45" stroke="#0a0a0a" strokeWidth="0.5"/>)}
            <path d="M 0 40 Q 25 8, 50 40 T 100 40 T 150 40 T 200 40" fill="none" stroke="#234a8b" strokeWidth="2"/>
            <circle cx="25" cy="14" r="3" fill="#234a8b"/>
            <text x="25" y="8" textAnchor="middle" fontFamily="ui-monospace, monospace" fontSize="6" fill="#234a8b">HW 06:14</text>
            <circle cx="125" cy="63" r="3" fill="#234a8b"/>
            <text x="125" y="76" textAnchor="middle" fontFamily="ui-monospace, monospace" fontSize="6" fill="#234a8b">LW 12:43</text>
            <text x="0" y="55" fontFamily="ui-monospace, monospace" fontSize="5.5" fill="#0a0a0a" opacity="0.6">00</text>
            <text x="100" y="55" textAnchor="middle" fontFamily="ui-monospace, monospace" fontSize="5.5" fill="#0a0a0a" opacity="0.6">12</text>
            <text x="200" y="55" textAnchor="end" fontFamily="ui-monospace, monospace" fontSize="5.5" fill="#0a0a0a" opacity="0.6">24</text>
          </svg>
          <h2 className="cc4-f17__title">Wall of Cool</h2>
          <Chevrons tone="light" />
        </div>
      );

    /* ===== F18 — Aircraft Tail Livery ===== */
    case 'f18':
      return (
        <div className="cc4-cell cc4-cell--f18">
          <div className="cc4-f18__tail">
            <div className="cc4-f18__stripe cc4-f18__stripe--1" aria-hidden="true"/>
            <div className="cc4-f18__stripe cc4-f18__stripe--2" aria-hidden="true"/>
            <span className="cc4-f18__reg">G-HQAV</span>
          </div>
          <div className="cc4-f18__caption">
            <h2 className="cc4-f18__title">Wall of Cool</h2>
            <span className="cc4-f18__sub">Robinson R66 · HQ Aviation</span>
          </div>
          <Chevrons tone="light" />
        </div>
      );

    /* ===== F19 — Subway Stop List ===== */
    case 'f19':
      return (
        <div className="cc4-cell cc4-cell--f19">
          <div className="cc4-f19__head">
            <span className="cc4-f19__line-dot" />
            <span>Community Line</span>
          </div>
          <ol className="cc4-f19__stops">
            <li><span className="cc4-f19__node"/>Denham Central</li>
            <li><span className="cc4-f19__node"/>Hangar E</li>
            <li className="cc4-f19__stop--feature"><span className="cc4-f19__node"/>Wall of Cool</li>
            <li><span className="cc4-f19__node"/>The Clubhouse</li>
            <li><span className="cc4-f19__node"/>Expeditions</li>
          </ol>
          <Chevrons tone="light" />
        </div>
      );

    /* ===== F20 — Postage Stamp Sheet ===== */
    case 'f20':
      return (
        <div className="cc4-cell cc4-cell--f20">
          <div className="cc4-f20__stamp">
            <div className="cc4-f20__stamp-head">
              <span>HQ Aviation</span>
              <span>£01</span>
            </div>
            <svg className="cc4-f20__art" viewBox="0 0 100 50" aria-hidden="true">
              <rect width="100" height="50" fill="#dfe7d8"/>
              <path d="M10 38 L90 38" stroke="#0a0a0a" strokeWidth="0.6"/>
              <g transform="translate(50,28)">
                <ellipse cx="0" cy="0" rx="14" ry="3" fill="#0a0a0a"/>
                <rect x="-6" y="-7" width="12" height="6" fill="#0a0a0a"/>
                <line x1="-22" y1="-9" x2="22" y2="-9" stroke="#0a0a0a" strokeWidth="1.2"/>
                <line x1="0" y1="-9" x2="0" y2="-12" stroke="#0a0a0a" strokeWidth="0.8"/>
                <line x1="6" y1="0" x2="14" y2="6" stroke="#0a0a0a" strokeWidth="0.8"/>
              </g>
            </svg>
            <div className="cc4-f20__stamp-foot">
              <span>Wall of Cool</span>
              <span>No. 01</span>
            </div>
          </div>
          <Chevrons tone="light" />
        </div>
      );

    default: return null;
  }
};

const CenterLayout = ({ variantId }) => (
  <div className="cc4-stack">
    <div className="cc4-gallery">
      <div className="cc4-grid">
        {IMAGES.slice(0, 4).map((img, i) => (
          <div className="cc4-cell cc4-cell--img" key={`a-${i}`}>
            <img src={img.src} alt={img.alt} loading="lazy" />
          </div>
        ))}
        {renderCenterCard(variantId)}
        {IMAGES.slice(4).map((img, i) => (
          <div className="cc4-cell cc4-cell--img" key={`b-${i}`}>
            <img src={img.src} alt={img.alt} loading="lazy" />
          </div>
        ))}
      </div>
    </div>
    <footer className="cc4-footer">
      <div className="cc4-footer__issue">Are you an HQ'er with some cool footage?</div>
      <button className="cc4-footer__btn">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
          <polyline points="17 8 12 3 7 8" />
          <line x1="12" y1="3" x2="12" y2="15" />
        </svg>
        Upload
      </button>
      <button className="cc4-footer__btn" aria-label="Fullscreen gallery">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M8 3H5a2 2 0 00-2 2v3m18 0V5a2 2 0 00-2-2h-3m0 18h3a2 2 0 002-2v-3M3 16v3a2 2 0 002 2h3" />
        </svg>
        Fullscreen
      </button>
    </footer>
  </div>
);

export default function WallOfCoolCenterCardVariations4() {
  return (
    <div className="cc4-page">
      <header className="cc4-topnav">
        <div className="cc4-topnav__title">Wall of Cool — Centre Card · Travel Batch II (20)</div>
        <nav className="cc4-topnav__links">
          <a className="cc4-topnav__back" href="/wall-of-cool-center-card-variations-3">← Travel I</a>
          {VARIATIONS.map((v) => (
            <a key={v.id} href={`#${v.id}`}>{v.id.toUpperCase()}</a>
          ))}
        </nav>
      </header>

      {VARIATIONS.map((v) => (
        <section className="cc4-variant" data-variant={v.id} id={v.id} key={v.id}>
          <div className="cc4-variant__sticky">
            <div className="cc4-variant__label">
              <span className="cc4-variant__number">{v.id.toUpperCase()}</span>
              <div>
                <h2 className="cc4-variant__title">{v.title}</h2>
                <p className="cc4-variant__desc">{v.desc}</p>
              </div>
            </div>
            <div className="cc4-variant__canvas">
              <CenterLayout variantId={v.id} />
            </div>
          </div>
        </section>
      ))}

      <style>{`
        .cc4-page { font-family: 'Space Grotesk', -apple-system, sans-serif; background: #faf9f6; min-height: 100vh; color: #1a1a1a; }
        .cc4-topnav { position: sticky; top: 0; z-index: 100; display: flex; align-items: center; justify-content: space-between; gap: 1rem; padding: 0.65rem 1.25rem; background: rgba(255,255,255,0.92); backdrop-filter: blur(10px); border-bottom: 1px solid #e5e7eb; }
        .cc4-topnav__title { font-weight: 600; font-size: 0.9rem; }
        .cc4-topnav__links { display: flex; gap: 0.35rem; flex-wrap: wrap; }
        .cc4-topnav__links a { display: inline-block; padding: 0.25rem 0.55rem; border: 1px solid #e5e7eb; border-radius: 4px; font-family: 'Share Tech Mono', monospace; font-size: 0.7rem; letter-spacing: 0.05em; text-decoration: none; color: #333; background: #fff; }
        .cc4-topnav__back { background: #1a1a1a !important; color: #fff !important; border-color: #1a1a1a !important; }
        .cc4-topnav__links a:hover { background: #1a1a1a; color: #fff; }

        .cc4-variant { position: relative; height: 150vh; padding: 2rem 1.5rem 0; }
        .cc4-variant__sticky { position: sticky; top: 70px; display: flex; flex-direction: column; gap: 0.9rem; height: calc(100vh - 90px); }
        .cc4-variant__label { flex: 0 0 auto; display: flex; align-items: flex-start; gap: 0.9rem; }
        .cc4-variant__number { display: inline-flex; align-items: center; justify-content: center; min-width: 48px; height: 40px; padding: 0 0.55rem; background: #1a1a1a; color: #fff; border-radius: 6px; font-family: 'Share Tech Mono', monospace; font-size: 0.75rem; letter-spacing: 0.08em; }
        .cc4-variant__title { margin: 0; font-size: 1.1rem; font-weight: 600; }
        .cc4-variant__desc { margin: 0.2rem 0 0; color: #666; font-size: 0.82rem; max-width: 820px; }
        .cc4-variant__canvas { flex: 1 1 auto; min-height: 0; display: flex; }
        .cc4-variant__canvas > * { width: 100%; }

        .cc4-stack { display: flex; flex-direction: column; height: 100%; }
        .cc4-gallery { flex: 1 1 auto; position: relative; overflow: hidden; border-radius: 10px; background: linear-gradient(to bottom, #ffffff 0%, #000000 100%); }
        .cc4-grid { display: grid; grid-template-columns: repeat(3, 1fr); grid-template-rows: repeat(3, 1fr); gap: 8px; padding: 8px; height: 100%; }
        .cc4-cell { position: relative; overflow: hidden; border-radius: 8px; border: 1px solid rgba(255,255,255,0.22); background: #1a1a1a; }
        .cc4-cell--img img { width: 100%; height: 100%; object-fit: cover; display: block; }

        .cc4-footer { flex: 0 0 auto; display: flex; flex-wrap: wrap; align-items: center; justify-content: center; gap: 1rem; padding: 0.9rem 1.25rem; margin-top: 8px; background: #1a1a1a; color: #fff; border-radius: 10px; }
        .cc4-footer__issue { flex: 1 1 auto; min-width: 160px; font-size: 0.85rem; color: rgba(255,255,255,0.85); }
        .cc4-footer__btn { display: inline-flex; align-items: center; gap: 0.45rem; padding: 0.45rem 0.85rem; background: transparent; border: 1px solid rgba(255,255,255,0.25); border-radius: 6px; color: #fff; font-family: 'Share Tech Mono', monospace; font-size: 0.72rem; letter-spacing: 0.08em; text-transform: uppercase; cursor: pointer; }
        .cc4-footer__btn:hover { background: rgba(255,255,255,0.1); }

        .cc4-nav { display: inline-flex; align-items: center; gap: 0.5rem; }
        .cc4-chevron { width: 26px; height: 26px; display: inline-flex; align-items: center; justify-content: center; border-radius: 50%; border: 1px solid currentColor; background: transparent; cursor: pointer; font-size: 0.62rem; color: inherit; }
        .cc4-chevron:disabled { opacity: 0.35; cursor: not-allowed; }
        .cc4-count { font-family: 'Share Tech Mono', monospace; font-size: 0.66rem; letter-spacing: 0.14em; min-width: 3.2rem; text-align: center; color: inherit; }
        .cc4-nav--light { color: #0a0a0a; }
        .cc4-nav--dark { color: rgba(255,255,255,0.78); }

        /* ===== F1 ATC Strip ===== */
        .cc4-cell--f1 { background: #fbe66a; color: #0a0a0a; padding: 0.55rem 0.7rem; display: flex; flex-direction: column; gap: 0.3rem; font-family: 'Share Tech Mono', monospace; border: 1px solid rgba(0,0,0,0.25); }
        .cc4-f1__top { display: flex; justify-content: space-between; align-items: baseline; padding-bottom: 0.3rem; border-bottom: 1px solid #0a0a0a; font-size: 0.62rem; letter-spacing: 0.12em; }
        .cc4-f1__callsign { font-size: 0.95rem; font-weight: 700; letter-spacing: 0.08em; }
        .cc4-f1__route { font-size: 0.7rem; letter-spacing: 0.18em; padding: 0.15rem 0; }
        .cc4-f1__data { margin: 0; display: flex; gap: 0.7rem; font-size: 0.55rem; padding-top: 0.25rem; border-top: 1px dashed rgba(0,0,0,0.4); }
        .cc4-f1__data div { display: flex; flex-direction: column; gap: 0.05rem; }
        .cc4-f1__data dt { color: rgba(0,0,0,0.55); letter-spacing: 0.16em; }
        .cc4-f1__data dd { margin: 0; font-weight: 700; letter-spacing: 0.06em; font-size: 0.7rem; }
        .cc4-f1__title { margin: auto 0 0.2rem; font-family: 'Inter', sans-serif; font-weight: 800; font-size: clamp(0.95rem, 1.9vw, 1.35rem); letter-spacing: -0.01em; line-height: 1; text-transform: uppercase; }
        .cc4-cell--f1 .cc4-nav { padding-top: 0.25rem; border-top: 1px solid rgba(0,0,0,0.3); justify-content: flex-end; }

        /* ===== F2 METAR ===== */
        .cc4-cell--f2 { background: #fff; border: 1px solid rgba(0,0,0,0.1); color: #0a0a0a; padding: 0.7rem 0.85rem; display: flex; flex-direction: column; gap: 0.4rem; }
        .cc4-f2__head { display: flex; justify-content: space-between; align-items: baseline; padding-bottom: 0.35rem; border-bottom: 1px solid #0a0a0a; font-family: 'Share Tech Mono', monospace; font-size: 0.6rem; letter-spacing: 0.18em; text-transform: uppercase; font-weight: 700; }
        .cc4-f2__code { font-family: 'Share Tech Mono', monospace; font-size: 0.62rem; letter-spacing: 0.05em; line-height: 1.4; color: #234a8b; word-spacing: 0.1em; }
        .cc4-f2__title { margin: auto 0 0; font-family: 'Inter', sans-serif; font-weight: 700; font-size: clamp(1rem, 2vw, 1.5rem); letter-spacing: -0.01em; line-height: 1; text-transform: uppercase; }
        .cc4-f2__plain { font-family: Georgia, serif; font-style: italic; font-size: 0.72rem; color: #4b5563; line-height: 1.3; }
        .cc4-cell--f2 .cc4-nav { padding-top: 0.3rem; border-top: 1px solid rgba(0,0,0,0.12); justify-content: flex-end; }

        /* ===== F3 VOR Rose ===== */
        .cc4-cell--f3 { background: #fdfcf6; border: 1px solid rgba(0,0,0,0.1); color: #0a0a0a; display: grid; grid-template-rows: 1fr auto auto; padding: 0.5rem; place-items: center; }
        .cc4-f3__rose { width: 100%; height: 100%; max-height: 75%; }
        .cc4-f3__caption { text-align: center; }
        .cc4-f3__title { margin: 0; font-family: 'Inter', sans-serif; font-weight: 700; font-size: clamp(0.95rem, 1.85vw, 1.35rem); letter-spacing: -0.005em; line-height: 1; text-transform: uppercase; }
        .cc4-f3__sub { font-family: 'Share Tech Mono', monospace; font-size: 0.55rem; letter-spacing: 0.2em; color: #6b7280; }
        .cc4-cell--f3 .cc4-nav { padding-top: 0.4rem; }

        /* ===== F4 Airfield Diagram ===== */
        .cc4-cell--f4 { background: #1a3a2a; color: #fff; border: 1px solid rgba(0,0,0,0.2); padding: 0; display: grid; grid-template-rows: 1fr auto auto; place-items: center; overflow: hidden; }
        .cc4-f4__diagram { width: 100%; height: 100%; }
        .cc4-f4__caption { padding: 0 0.85rem; text-align: center; }
        .cc4-f4__title { margin: 0; font-family: 'Inter', sans-serif; font-weight: 700; font-size: clamp(0.95rem, 1.9vw, 1.45rem); letter-spacing: -0.005em; line-height: 1; text-transform: uppercase; color: #fff; }
        .cc4-f4__sub { font-family: 'Share Tech Mono', monospace; font-size: 0.55rem; letter-spacing: 0.18em; color: rgba(255,255,255,0.6); }
        .cc4-cell--f4 .cc4-nav { padding: 0.5rem 0; color: rgba(255,255,255,0.78); }

        /* ===== F5 Wind Rose ===== */
        .cc4-cell--f5 { background: #fff; border: 1px solid rgba(0,0,0,0.1); color: #0a0a0a; display: grid; grid-template-rows: 1fr auto auto; padding: 0.5rem; place-items: center; }
        .cc4-f5__rose { width: 100%; height: 100%; max-height: 70%; }
        .cc4-f5__caption { text-align: center; }
        .cc4-f5__title { margin: 0; font-family: 'Inter', sans-serif; font-weight: 700; font-size: clamp(0.95rem, 1.85vw, 1.35rem); letter-spacing: -0.005em; line-height: 1; text-transform: uppercase; }
        .cc4-f5__sub { font-family: 'Share Tech Mono', monospace; font-size: 0.55rem; letter-spacing: 0.2em; color: #6b7280; text-transform: uppercase; }
        .cc4-cell--f5 .cc4-nav { padding-top: 0.4rem; }

        /* ===== F6 Luggage Tag ===== */
        .cc4-cell--f6 { background: #f3e6c8; color: #0a0a0a; border: 1px solid rgba(0,0,0,0.2); padding: 1.4rem 0.8rem 0.7rem; display: flex; flex-direction: column; gap: 0.4rem; position: relative; }
        .cc4-f6__hole { position: absolute; top: 0.4rem; left: 50%; transform: translateX(-50%); width: 18px; height: 18px; display: flex; align-items: center; justify-content: center; }
        .cc4-f6__hole span { display: block; width: 12px; height: 12px; border-radius: 50%; background: #faf9f6; border: 1.5px solid #0a0a0a; }
        .cc4-f6__priority { font-family: Georgia, serif; font-style: italic; font-weight: 700; font-size: 0.85rem; text-align: center; padding: 0.15rem 0; border: 2px solid #8b1a1a; color: #8b1a1a; letter-spacing: 0.1em; text-transform: uppercase; }
        .cc4-f6__lines { display: flex; flex-direction: column; gap: 0.25rem; padding-top: 0.3rem; border-top: 1px dashed rgba(0,0,0,0.4); }
        .cc4-f6__lines div { display: flex; align-items: baseline; gap: 0.5rem; padding-bottom: 0.2rem; border-bottom: 1px solid rgba(0,0,0,0.18); font-family: 'Share Tech Mono', monospace; font-size: 0.6rem; }
        .cc4-f6__lines dt { margin: 0; color: #6b7280; letter-spacing: 0.16em; text-transform: uppercase; flex-basis: 3rem; font-size: 0.5rem; }
        .cc4-f6__lines dd { margin: 0; font-family: Georgia, serif; font-style: italic; font-size: 0.78rem; }
        .cc4-cell--f6 .cc4-nav { margin-top: auto; justify-content: flex-end; }

        /* ===== F7 Passport Stamps ===== */
        .cc4-cell--f7 { background: #f6efde; border: 1px solid rgba(0,0,0,0.1); color: #0a0a0a; padding: 0.7rem 0.8rem; display: grid; grid-template-rows: 1fr auto; place-items: center; position: relative; overflow: hidden; }
        .cc4-f7__a { position: absolute; top: 0.6rem; right: 0.6rem; width: 50px; height: 50px; transform: rotate(8deg); opacity: 0.85; }
        .cc4-f7__b { position: absolute; bottom: 1.6rem; left: 0.4rem; width: 46px; height: 46px; transform: rotate(-12deg); opacity: 0.8; }
        .cc4-f7__feature { width: 78%; max-width: 110px; aspect-ratio: 1; transform: rotate(-3deg); z-index: 2; }
        .cc4-cell--f7 .cc4-nav { z-index: 3; padding-top: 0.4rem; border-top: 1px solid rgba(0,0,0,0.15); width: 100%; justify-content: center; }

        /* ===== F8 Hotel Key Card ===== */
        .cc4-cell--f8 { background: linear-gradient(135deg, #1a1a1a 0%, #0a0a0a 100%); color: #fff; border: 1px solid rgba(255,255,255,0.1); padding: 0.85rem 0.9rem; display: flex; flex-direction: column; gap: 0.45rem; position: relative; }
        .cc4-f8__head { display: flex; align-items: baseline; gap: 0.5rem; padding-bottom: 0.35rem; border-bottom: 1px solid rgba(255,255,255,0.15); }
        .cc4-f8__brand { font-family: 'Inter', serif; font-style: italic; font-weight: 700; font-size: 1.2rem; letter-spacing: -0.02em; }
        .cc4-f8__hotel { font-family: 'Share Tech Mono', monospace; font-size: 0.55rem; letter-spacing: 0.22em; text-transform: uppercase; color: rgba(255,255,255,0.5); }
        .cc4-f8__room { display: flex; flex-direction: column; gap: 0.05rem; }
        .cc4-f8__room-label { font-family: 'Share Tech Mono', monospace; font-size: 0.55rem; letter-spacing: 0.22em; text-transform: uppercase; color: rgba(255,255,255,0.5); }
        .cc4-f8__room-num { font-family: 'Inter', sans-serif; font-weight: 700; font-size: clamp(2.4rem, 5.5vw, 4rem); line-height: 0.85; letter-spacing: -0.04em; color: #fff; }
        .cc4-f8__title { margin: 0; font-family: 'Inter', sans-serif; font-weight: 500; font-size: clamp(0.85rem, 1.7vw, 1.2rem); letter-spacing: 0.01em; text-transform: uppercase; color: rgba(255,255,255,0.85); }
        .cc4-f8__stripe { height: 12px; background: repeating-linear-gradient(90deg, #4a3a2a 0 4px, #2a1a0a 4px 8px); border-radius: 1px; margin-top: 0.3rem; }
        .cc4-cell--f8 .cc4-nav { color: rgba(255,255,255,0.65); padding-top: 0.3rem; justify-content: flex-end; }

        /* ===== F9 Travel Journal ===== */
        .cc4-cell--f9 { background: #fdfaf0; border: 1px solid rgba(0,0,0,0.1); color: #0a0a0a; padding: 0.7rem 0.85rem; display: flex; flex-direction: column; gap: 0.35rem; background-image: linear-gradient(rgba(110, 160, 220, 0.4) 1px, transparent 1px); background-size: 100% 18px; background-position: 0 12px; }
        .cc4-f9__date { font-family: Georgia, serif; font-style: italic; font-size: 0.72rem; color: #5a4f33; align-self: flex-start; padding-bottom: 0.05rem; }
        .cc4-f9__title { margin: 0; font-family: Georgia, serif; font-style: italic; font-weight: 600; font-size: clamp(1.1rem, 2.2vw, 1.6rem); line-height: 1; }
        .cc4-f9__entry { margin: 0; font-family: Georgia, serif; font-style: italic; font-size: 0.72rem; color: #4b5563; line-height: 1.45; max-width: 22ch; }
        .cc4-f9__sketch { width: 56px; height: 30px; align-self: flex-end; margin-top: auto; opacity: 0.75; }
        .cc4-cell--f9 .cc4-nav { padding-top: 0.3rem; justify-content: flex-end; }

        /* ===== F10 Polaroid ===== */
        .cc4-cell--f10 { background: #fff; border: 1px solid rgba(0,0,0,0.12); color: #0a0a0a; padding: 0.7rem 0.7rem 0.5rem; display: flex; flex-direction: column; gap: 0.4rem; box-shadow: inset 0 0 0 1px rgba(0,0,0,0.04); }
        .cc4-f10__photo { flex: 1 1 auto; background: #2c4660; border: 1px solid rgba(0,0,0,0.15); overflow: hidden; }
        .cc4-f10__photo svg { width: 100%; height: 100%; display: block; }
        .cc4-f10__caption { font-family: 'Caveat', 'Bradley Hand', cursive, sans-serif; font-size: 1.1rem; text-align: center; color: #0a0a0a; line-height: 1; transform: rotate(-1deg); }
        .cc4-cell--f10 .cc4-nav { justify-content: center; }

        /* ===== F11 Highway Shield ===== */
        .cc4-cell--f11 { background: #fff; border: 1px solid rgba(0,0,0,0.1); color: #0a0a0a; padding: 0.85rem 0.9rem; display: flex; flex-direction: column; align-items: center; justify-content: space-between; gap: 0.4rem; }
        .cc4-f11__shield { width: 78%; max-width: 130px; aspect-ratio: 1.05/1; border: 3px solid #0a0a0a; border-radius: 4px 4px 50% 50% / 4px 4px 14% 14%; overflow: hidden; display: flex; flex-direction: column; }
        .cc4-f11__top { background: #b71c1c; color: #fff; padding: 0.3rem 0.4rem; text-align: center; flex: 0 0 auto; }
        .cc4-f11__county { font-family: 'Inter', sans-serif; font-weight: 700; font-size: clamp(0.55rem, 1.1vw, 0.78rem); letter-spacing: 0.04em; text-transform: uppercase; line-height: 1; }
        .cc4-f11__bottom { background: #0d2b6b; color: #fff; flex: 1 1 auto; display: flex; align-items: center; justify-content: center; }
        .cc4-f11__num { font-family: 'Inter', sans-serif; font-weight: 800; font-size: clamp(1.8rem, 4.5vw, 3rem); letter-spacing: -0.04em; line-height: 1; }
        .cc4-f11__strap { font-family: 'Share Tech Mono', monospace; font-size: 0.55rem; letter-spacing: 0.2em; text-transform: uppercase; color: #6b7280; }

        /* ===== F12 Metro Line ===== */
        .cc4-cell--f12 { background: #fff; border: 1px solid rgba(0,0,0,0.1); color: #0a0a0a; padding: 0.85rem 0.9rem; display: grid; grid-template-columns: auto 1fr; gap: 0.6rem 0.9rem; align-items: center; }
        .cc4-f12__circle { width: clamp(48px, 10vw, 72px); aspect-ratio: 1; border-radius: 50%; background: #0a0a0a; color: #fff; display: flex; align-items: center; justify-content: center; font-family: 'Inter', sans-serif; font-weight: 800; font-size: clamp(1.5rem, 3.5vw, 2.6rem); }
        .cc4-f12__info { display: flex; flex-direction: column; gap: 0.15rem; }
        .cc4-f12__title { margin: 0; font-family: 'Inter', sans-serif; font-weight: 700; font-size: clamp(0.95rem, 1.9vw, 1.45rem); letter-spacing: -0.005em; line-height: 1; }
        .cc4-f12__line { font-family: 'Share Tech Mono', monospace; font-size: 0.6rem; letter-spacing: 0.18em; color: #0a0a0a; text-transform: uppercase; }
        .cc4-f12__service { font-family: 'Share Tech Mono', monospace; font-size: 0.55rem; letter-spacing: 0.16em; color: #6b7280; text-transform: uppercase; }
        .cc4-cell--f12 .cc4-nav { grid-column: 1 / 3; padding-top: 0.4rem; border-top: 1px solid rgba(0,0,0,0.1); justify-content: center; }

        /* ===== F13 Star Chart ===== */
        .cc4-cell--f13 { background: #0b1530; color: #fff; border: 1px solid rgba(255,255,255,0.08); display: grid; grid-template-rows: 1fr auto auto; place-items: center; padding: 0; overflow: hidden; }
        .cc4-f13__sky { width: 100%; height: 100%; }
        .cc4-f13__caption { text-align: center; padding: 0 0.85rem; }
        .cc4-f13__title { margin: 0; font-family: Georgia, serif; font-style: italic; font-weight: 500; font-size: clamp(1rem, 2vw, 1.5rem); color: #fff; }
        .cc4-f13__sub { font-family: 'Share Tech Mono', monospace; font-size: 0.55rem; letter-spacing: 0.2em; color: rgba(255,255,255,0.6); }
        .cc4-cell--f13 .cc4-nav { padding: 0.5rem 0; color: rgba(255,255,255,0.75); }

        /* ===== F14 Vintage Airline Ticket ===== */
        .cc4-cell--f14 { background: #fcf5e2; border: 1px solid rgba(0,0,0,0.18); color: #0a0a0a; padding: 0.6rem 0.7rem; display: flex; flex-direction: column; gap: 0.35rem; position: relative; }
        .cc4-f14__head { display: flex; justify-content: space-between; align-items: baseline; padding-bottom: 0.3rem; border-bottom: 2px solid #0a0a0a; font-family: 'Share Tech Mono', monospace; font-size: 0.55rem; letter-spacing: 0.18em; text-transform: uppercase; font-weight: 700; }
        .cc4-f14__rows { margin: 0; display: flex; flex-direction: column; gap: 0.18rem; }
        .cc4-f14__rows div { display: flex; justify-content: space-between; gap: 0.5rem; padding: 0.18rem 0; border-bottom: 1px dotted rgba(0,0,0,0.25); font-family: 'Share Tech Mono', monospace; font-size: 0.6rem; }
        .cc4-f14__rows dt { margin: 0; color: #6b7280; letter-spacing: 0.14em; text-transform: uppercase; font-size: 0.5rem; }
        .cc4-f14__rows dd { margin: 0; color: #0a0a0a; }
        .cc4-f14__perf { display: block; height: 1px; border-top: 2px dashed rgba(0,0,0,0.45); margin: 0.2rem 0; }
        .cc4-f14__coupon { font-family: Georgia, serif; font-style: italic; font-size: 0.78rem; text-align: center; color: #5a4f33; }
        .cc4-cell--f14 .cc4-nav { margin-top: auto; justify-content: flex-end; }

        /* ===== F15 Steamer Trunk Label ===== */
        .cc4-cell--f15 { background: #f0e3c2; border: 1px solid rgba(0,0,0,0.2); color: #0a0a0a; padding: 0; display: flex; flex-direction: column; }
        .cc4-f15__band { background: #8b1a1a; color: #f7f1de; padding: 0.4rem 0.7rem; text-align: center; font-family: Georgia, serif; font-style: italic; font-weight: 700; font-size: clamp(0.78rem, 1.6vw, 1.1rem); letter-spacing: 0.04em; line-height: 1; }
        .cc4-f15__body { flex: 1; padding: 0.55rem 0.85rem; display: flex; flex-direction: column; gap: 0.3rem; align-items: center; text-align: center; }
        .cc4-f15__title { margin: auto 0 0.1rem; font-family: Georgia, serif; font-style: italic; font-weight: 600; font-size: clamp(1rem, 2vw, 1.55rem); line-height: 1; }
        .cc4-f15__route { font-family: 'Share Tech Mono', monospace; font-size: 0.55rem; letter-spacing: 0.18em; text-transform: uppercase; color: #5a4f33; }
        .cc4-f15__rows { display: flex; justify-content: space-between; width: 100%; padding-top: 0.3rem; margin-top: auto; border-top: 1px solid rgba(0,0,0,0.25); font-family: 'Share Tech Mono', monospace; font-size: 0.5rem; letter-spacing: 0.14em; text-transform: uppercase; color: #5a4f33; }
        .cc4-cell--f15 .cc4-nav { padding: 0.35rem 0.7rem; border-top: 1px solid rgba(0,0,0,0.18); justify-content: center; }

        /* ===== F16 Globe & Banner ===== */
        .cc4-cell--f16 { background: #faf6ec; border: 1px solid rgba(0,0,0,0.1); color: #0a0a0a; display: grid; grid-template-rows: 1fr auto auto; place-items: center; padding: 0.55rem; }
        .cc4-f16__globe { width: 100%; height: 100%; max-height: 70%; }
        .cc4-f16__banner { background: #0a0a0a; color: #fff; padding: 0.35rem 0.85rem; font-family: Georgia, serif; font-style: italic; font-weight: 600; font-size: clamp(0.95rem, 2vw, 1.4rem); letter-spacing: 0.02em; line-height: 1; clip-path: polygon(8px 0, calc(100% - 8px) 0, 100% 50%, calc(100% - 8px) 100%, 8px 100%, 0 50%); }
        .cc4-f16__sub { font-family: 'Share Tech Mono', monospace; font-size: 0.55rem; letter-spacing: 0.2em; color: #6b7280; text-transform: uppercase; margin-top: 0.25rem; }
        .cc4-cell--f16 .cc4-nav { padding-top: 0.3rem; }

        /* ===== F17 Tide Chart ===== */
        .cc4-cell--f17 { background: #fff; border: 1px solid rgba(0,0,0,0.1); color: #0a0a0a; padding: 0.7rem 0.85rem; display: flex; flex-direction: column; gap: 0.4rem; }
        .cc4-f17__head { display: flex; justify-content: space-between; align-items: baseline; padding-bottom: 0.3rem; border-bottom: 1px solid rgba(0,0,0,0.15); font-family: 'Share Tech Mono', monospace; font-size: 0.6rem; letter-spacing: 0.16em; text-transform: uppercase; font-weight: 700; color: #234a8b; }
        .cc4-f17__chart { width: 100%; height: auto; }
        .cc4-f17__title { margin: auto 0 0; font-family: 'Inter', sans-serif; font-weight: 700; font-size: clamp(1rem, 2vw, 1.5rem); letter-spacing: -0.005em; line-height: 1; text-transform: uppercase; }
        .cc4-cell--f17 .cc4-nav { padding-top: 0.3rem; border-top: 1px solid rgba(0,0,0,0.12); justify-content: flex-end; }

        /* ===== F18 Aircraft Tail Livery ===== */
        .cc4-cell--f18 { background: #fff; border: 1px solid rgba(0,0,0,0.1); color: #0a0a0a; padding: 0; display: grid; grid-template-rows: 1fr auto auto; place-items: stretch; overflow: hidden; }
        .cc4-f18__tail { position: relative; flex: 1; display: flex; align-items: center; justify-content: center; padding: 0.4rem; min-height: 0; }
        .cc4-f18__stripe { position: absolute; left: 0; right: 0; height: 14px; }
        .cc4-f18__stripe--1 { top: 28%; background: #8b1a1a; }
        .cc4-f18__stripe--2 { top: calc(28% + 14px); background: #0d2b6b; }
        .cc4-f18__reg { position: relative; z-index: 2; font-family: 'Share Tech Mono', monospace; font-weight: 700; font-size: clamp(1.2rem, 3.2vw, 2.2rem); letter-spacing: 0.12em; padding: 0.25rem 0.55rem; background: #fff; border: 2px solid #0a0a0a; }
        .cc4-f18__caption { padding: 0.5rem 0.85rem 0; text-align: center; }
        .cc4-f18__title { margin: 0; font-family: 'Inter', sans-serif; font-weight: 700; font-size: clamp(0.95rem, 1.9vw, 1.4rem); letter-spacing: -0.005em; line-height: 1; text-transform: uppercase; }
        .cc4-f18__sub { font-family: 'Share Tech Mono', monospace; font-size: 0.55rem; letter-spacing: 0.18em; color: #6b7280; text-transform: uppercase; }
        .cc4-cell--f18 .cc4-nav { padding: 0.4rem 0.85rem 0.55rem; justify-content: center; }

        /* ===== F19 Subway Stop List ===== */
        .cc4-cell--f19 { background: #fff; border: 1px solid rgba(0,0,0,0.1); color: #0a0a0a; padding: 0.85rem 1rem; display: flex; flex-direction: column; gap: 0.5rem; }
        .cc4-f19__head { display: flex; align-items: center; gap: 0.45rem; font-family: 'Inter', sans-serif; font-weight: 700; font-size: 0.78rem; letter-spacing: 0.04em; text-transform: uppercase; padding-bottom: 0.3rem; border-bottom: 1px solid rgba(0,0,0,0.12); }
        .cc4-f19__line-dot { display: block; width: 14px; height: 14px; border-radius: 50%; background: #b71c1c; }
        .cc4-f19__stops { list-style: none; margin: 0; padding: 0; display: flex; flex-direction: column; flex: 1; position: relative; }
        .cc4-f19__stops::before { content: ""; position: absolute; left: 6px; top: 8px; bottom: 8px; width: 3px; background: #b71c1c; border-radius: 2px; }
        .cc4-f19__stops li { display: flex; align-items: center; gap: 0.55rem; padding: 0.18rem 0; font-family: 'Inter', sans-serif; font-weight: 500; font-size: 0.72rem; color: #4b5563; }
        .cc4-f19__node { display: block; width: 10px; height: 10px; border-radius: 50%; background: #fff; border: 2.5px solid #b71c1c; z-index: 1; flex-shrink: 0; margin-left: 1px; }
        .cc4-f19__stop--feature { color: #0a0a0a; font-weight: 800; font-size: 0.92rem; text-transform: uppercase; letter-spacing: 0.01em; }
        .cc4-f19__stop--feature .cc4-f19__node { width: 14px; height: 14px; background: #b71c1c; margin-left: -1px; }
        .cc4-cell--f19 .cc4-nav { padding-top: 0.3rem; border-top: 1px solid rgba(0,0,0,0.1); justify-content: flex-end; }

        /* ===== F20 Postage Stamp Sheet ===== */
        .cc4-cell--f20 { background: #fdfcf6; border: 1px solid rgba(0,0,0,0.1); color: #0a0a0a; padding: 0.65rem; display: grid; place-items: center; }
        .cc4-f20__stamp { width: 90%; max-width: 180px; background: #f7eed5; padding: 0.45rem 0.5rem; border: 1.5px solid #0a0a0a; display: flex; flex-direction: column; gap: 0.25rem; box-shadow: 0 0 0 4px #fdfcf6, 0 0 0 5.5px #0a0a0a; --p: radial-gradient(circle 4px at 0 50%, transparent 99%, #fdfcf6 100%) 0 0/8px 8px repeat-y, radial-gradient(circle 4px at 100% 50%, transparent 99%, #fdfcf6 100%) 100% 0/8px 8px repeat-y, radial-gradient(circle 4px at 50% 0, transparent 99%, #fdfcf6 100%) 0 0/8px 8px repeat-x, radial-gradient(circle 4px at 50% 100%, transparent 99%, #fdfcf6 100%) 0 100%/8px 8px repeat-x; }
        .cc4-f20__stamp-head { display: flex; justify-content: space-between; align-items: baseline; font-family: Georgia, serif; font-style: italic; font-weight: 700; font-size: 0.7rem; padding-bottom: 0.18rem; border-bottom: 1px solid #0a0a0a; }
        .cc4-f20__art { width: 100%; height: auto; max-height: 60%; }
        .cc4-f20__stamp-foot { display: flex; justify-content: space-between; align-items: baseline; padding-top: 0.18rem; border-top: 1px solid #0a0a0a; font-family: 'Share Tech Mono', monospace; font-size: 0.55rem; letter-spacing: 0.14em; text-transform: uppercase; }
        .cc4-cell--f20 .cc4-nav { margin-top: 0.4rem; }

        @media (max-width: 768px) {
          .cc4-variant { height: 130vh; }
          .cc4-variant__title { font-size: 1rem; }
          .cc4-variant__desc { font-size: 0.75rem; }
        }
      `}</style>
    </div>
  );
}

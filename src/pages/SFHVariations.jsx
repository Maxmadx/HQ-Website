import React, { useState } from 'react';
import { Link } from 'react-router-dom';

/* ─── Shared data ─── */
const DESTINATIONS = [
  { name: 'The Cotswolds', nm: 70, carTime: '1h 45min', desc: 'Fly over the rolling hills and honey-stone villages. Lunch at a country pub, back to Denham before dark.' },
  { name: 'Le Touquet', nm: 110, carTime: '3h 30min', desc: 'Cross the Channel in under an hour. Fresh seafood on the French coast, no passport queues, no ferry timetables.' },
  { name: 'Scottish Highlands', nm: 330, carTime: '8h+', desc: 'Glens, lochs and castles from the air. Two and a half hours to a landscape most people drive a full day to reach.' },
  { name: 'Cornwall', nm: 180, carTime: '4h 30min', desc: 'Skip the M5 entirely. Land near the coast for a weekend of surfing, cream teas and dramatic clifftop walks.' },
];

const FLEET = [
  { model: 'R66 Turbine', seats: '5 Seats', cruise: '~140 kts', cruiseKts: 140, img: '/assets/images/new-aircraft/r66/blue-r66-palo-verde-front-v4.png' },
  { model: 'R44', seats: '4 Seats', cruise: '~120 kts', cruiseKts: 120, img: '/assets/images/new-aircraft/r44/raven-ii-front-alpha.png' },
  { model: 'R22', seats: '2 Seats', cruise: '~100 kts', cruiseKts: 100, img: '/assets/images/new-aircraft/r22/r22-red-volcano-front-alpha-v3.png' },
];

const fmt = (nm, kts) => {
  const mins = Math.round((nm / kts) * 60);
  if (mins < 60) return `${mins} min`;
  const h = Math.floor(mins / 60);
  const m = mins % 60;
  return m === 0 ? `${h}h` : `${h}h ${m}m`;
};

const CTA = () => <Link to="/contact?subject=hire" className="sv__cta">Enquire About Hire</Link>;

const UK_PATH = "M224.5 476.8 L199.8 492.6 L189.1 490.9 L176.2 478.9 L162.5 480.4 L168.2 474.2 L156.5 468.8 L136.2 476.6 L122.0 459.4 L165.9 429.1 L172.6 414.4 L168.6 410.0 L167.8 389.1 L144.9 396.6 L161.2 373.6 L194.4 360.3 L207.5 365.9 L204.8 356.7 L208.8 354.6 L221.3 362.4 L208.8 348.7 L214.3 333.7 L210.1 331.0 L210.4 322.1 L215.3 318.3 L216.6 303.6 L204.8 307.0 L188.0 277.4 L193.0 263.3 L209.9 251.0 L189.6 251.5 L173.5 262.8 L139.5 258.3 L135.8 268.9 L126.9 257.5 L125.5 248.9 L130.1 248.7 L145.0 214.0 L136.6 200.6 L139.2 184.9 L148.7 184.3 L138.5 176.7 L140.2 169.4 L123.8 187.6 L123.5 175.6 L132.3 164.3 L117.1 178.8 L110.3 221.5 L101.9 223.3 L112.3 193.5 L107.7 192.8 L111.1 163.2 L124.8 128.8 L106.4 144.1 L87.5 131.5 L103.4 122.3 L98.2 118.9 L110.1 96.6 L99.9 82.8 L109.3 75.3 L102.9 67.0 L108.3 52.7 L126.1 52.7 L116.0 39.9 L119.0 28.5 L131.9 26.8 L128.8 18.6 L133.2 5.3 L154.7 9.9 L209.2 1.6 L203.0 22.8 L172.2 47.4 L170.5 54.7 L177.5 56.9 L166.5 73.3 L199.7 64.2 L247.9 64.8 L256.2 70.9 L259.6 80.2 L231.1 137.0 L199.1 155.5 L215.9 153.2 L224.3 162.9 L197.1 178.2 L180.2 173.7 L209.5 183.4 L227.2 178.3 L245.1 186.7 L264.6 209.3 L281.3 268.0 L303.5 281.5 L326.7 307.6 L321.8 314.2 L334.6 342.2 L303.9 334.3 L318.4 336.6 L340.8 360.7 L344.0 372.6 L331.8 389.9 L341.0 396.4 L352.1 385.7 L380.3 388.6 L395.6 400.1 L399.0 412.0 L393.0 443.1 L378.8 453.1 L380.5 461.7 L359.7 469.5 L365.5 472.2 L365.2 480.2 L346.7 487.4 L386.0 494.3 L385.3 506.7 L367.9 524.0 L338.1 535.0 L298.9 534.9 L274.0 526.0 L277.3 531.1 L249.6 537.6 L252.4 544.2 L249.5 545.8 L211.4 538.2 L195.4 543.8 L184.4 570.4 L164.1 560.1 L143.0 567.0 L127.6 584.1 L106.4 581.5 L136.5 550.5 L148.7 534.1 L151.1 520.6 L160.1 517.1 L164.4 506.2 L205.9 505.0 L233.8 468.8 L224.5 476.8 Z";
const DENHAM = { x: 310, y: 480 };
const DEST_COORDS = [
  { name: 'The Cotswolds', x: 265, y: 458 },
  { name: 'Le Touquet', x: 355, y: 548 },
  { name: 'Scottish Highlands', x: 210, y: 175 },
  { name: 'Cornwall', x: 145, y: 560 },
];
const RANGES = {
  R22: { r30: 56, r60: 112, r120: 223 },
  R44: { r30: 67, r60: 134, r120: 268 },
  'R66 Turbine': { r30: 78, r60: 156, r120: 312 },
};

const FullMap = ({ aircraft, activeDest = null, height = '300px' }) => {
  const r = RANGES[aircraft];
  return (
    <svg viewBox="0 0 560 710" fill="none" style={{ width: '100%', height, objectFit: 'contain', display: 'block' }}>
      <path d={UK_PATH} stroke="#b5b0a8" strokeWidth="1.2" fill="#d6d1ca" />
      <circle cx={DENHAM.x} cy={DENHAM.y} r={r.r30} fill="none" stroke="#aaa" strokeWidth="1" strokeDasharray="4 3" />
      <circle cx={DENHAM.x} cy={DENHAM.y} r={r.r60} fill="none" stroke="#bbb" strokeWidth="1" strokeDasharray="6 4" />
      <circle cx={DENHAM.x} cy={DENHAM.y} r={r.r120} fill="none" stroke="#ccc8c1" strokeWidth="1" strokeDasharray="8 5" />
      <text x={DENHAM.x + r.r30 + 4} y={DENHAM.y - 4} fontFamily="Share Tech Mono" fontSize="9" fill="#999">30 MIN</text>
      <text x={DENHAM.x + r.r60 + 4} y={DENHAM.y - 4} fontFamily="Share Tech Mono" fontSize="9" fill="#999">1 HR</text>
      <circle cx={DENHAM.x} cy={DENHAM.y} r="5" fill="#1a1a1a" />
      <text x={DENHAM.x + 12} y={DENHAM.y + 3} fontFamily="Share Tech Mono" fontSize="10" fill="#666" fontWeight="700">DENHAM</text>
      {DEST_COORDS.map((d, i) => {
        const isActive = activeDest === i;
        return (
          <g key={d.name}>
            <line x1={DENHAM.x} y1={DENHAM.y} x2={d.x} y2={d.y} stroke={isActive ? '#1a1a1a' : '#b5b0a8'} strokeWidth={isActive ? 1.5 : 0.75} strokeDasharray="4 3" />
            <circle cx={d.x} cy={d.y} r={isActive ? 7 : 4} fill={isActive ? '#1a1a1a' : '#999'} style={{ transition: 'all 0.2s' }} />
            <text x={d.x + (d.x < DENHAM.x ? -10 : 12)} y={d.y + (d.y < DENHAM.y ? -10 : 16)} textAnchor={d.x < DENHAM.x ? 'end' : 'start'} fontFamily="Space Grotesk" fontSize="10" fill={isActive ? '#1a1a1a' : '#888'} fontWeight="600" style={{ textTransform: 'uppercase' }}>{d.name}</text>
          </g>
        );
      })}
    </svg>
  );
};

const JourneyIntro = () => (
  <>
    <p className="sv__desc">In a helicopter you can land at a significant amount of spots in comparison to even a light airplane due to not needing a runway.</p>
    <p className="sv__desc">Gardens, pubs, hotels, golf courses, race courses — it opens up a new world of possibilities and is a great tool to have in your arsenal of activities you are able to do.</p>
  </>
);

const StepNum = ({ n, active }) => (
  <span className={`sv__step-num ${active ? 'sv__step-num--active' : ''}`}>{String(n).padStart(2, '0')}</span>
);

const StepTitle = ({ children, active }) => (
  <span className={`sv__step-title ${active ? 'sv__step-title--active' : ''}`}>{children}</span>
);


/* ═══════════════════════════════════════════════
   V1: Linear flow — no map, everything stacked.
   Steps flow naturally. Destinations as tappable list.
   ═══════════════════════════════════════════════ */
function V1() {
  const [aircraft, setAircraft] = useState('R66 Turbine');
  const ac = FLEET.find(f => f.model === aircraft);
  return (
    <div className="sv">
      <JourneyIntro />

      <div className="sv__step-header"><StepNum n={1} active /><StepTitle active>Select Destination</StepTitle></div>
      <div className="sv__dest-list">
        {DESTINATIONS.map((d, i) => (
          <div key={i} className="sv__dest-row">
            <span className="sv__dest-name">{d.name}</span>
            <span className="sv__dest-time">{fmt(d.nm, ac.cruiseKts)}</span>
          </div>
        ))}
        <div className="sv__dest-endless">Endless Destinations...</div>
      </div>

      <div className="sv__step-header"><StepNum n={2} active /><StepTitle active>Choose Your Aircraft</StepTitle></div>
      <div className="sv__fleet">
        {FLEET.map(f => (
          <div key={f.model} className={`sv__fleet-row ${aircraft === f.model ? 'sv__fleet-row--active' : ''}`} onClick={() => setAircraft(f.model)}>
            <img src={f.img} alt={f.model} />
            <div><div className="sv__fleet-model">{f.model}</div><div className="sv__fleet-info">{f.seats} · {f.cruise}</div></div>
          </div>
        ))}
      </div>

      <div className="sv__step-header"><StepNum n={3} active /><StepTitle active>Fly</StepTitle></div>
      <p className="sv__desc">No crew, no waiting, no compromise. Available by the hour, day or week.</p>
      <CTA />
    </div>
  );
}


/* ═══════════════════════════════════════════════
   V2: Destination cards — swipeable horizontal
   cards with flight time + description. No map.
   ═══════════════════════════════════════════════ */
function V2() {
  const [aircraft, setAircraft] = useState('R66 Turbine');
  const ac = FLEET.find(f => f.model === aircraft);
  return (
    <div className="sv">
      <JourneyIntro />

      <div className="sv__step-header"><StepNum n={1} active /><StepTitle active>Select Destination</StepTitle></div>
      <div className="sv2__cards">
        {DESTINATIONS.map((d, i) => (
          <div key={i} className="sv2__card">
            <div className="sv2__card-top">
              <span className="sv2__card-name">{d.name}</span>
              <span className="sv2__card-time">{fmt(d.nm, ac.cruiseKts)}</span>
            </div>
            <p className="sv2__card-desc">{d.desc}</p>
            <div className="sv2__card-compare">
              <span>By car: {d.carTime}</span>
            </div>
          </div>
        ))}
      </div>

      <div className="sv__step-header"><StepNum n={2} active /><StepTitle active>Choose Your Aircraft</StepTitle></div>
      <div className="sv__fleet">
        {FLEET.map(f => (
          <div key={f.model} className={`sv__fleet-row ${aircraft === f.model ? 'sv__fleet-row--active' : ''}`} onClick={() => setAircraft(f.model)}>
            <img src={f.img} alt={f.model} />
            <div><div className="sv__fleet-model">{f.model}</div><div className="sv__fleet-info">{f.seats} · {f.cruise}</div></div>
          </div>
        ))}
      </div>

      <div className="sv__step-header"><StepNum n={3} active /><StepTitle active>Fly</StepTitle></div>
      <p className="sv__desc">No crew, no waiting, no compromise. Available by the hour, day or week.</p>
      <CTA />
    </div>
  );
}


/* ═══════════════════════════════════════════════
   V3: Compact map — map cropped to a landscape
   aspect ratio (shorter height) with destinations
   below as a list.
   ═══════════════════════════════════════════════ */
function V3() {
  const [aircraft, setAircraft] = useState('R66 Turbine');
  const ac = FLEET.find(f => f.model === aircraft);
  const r = { R22: { r30: 56, r60: 112 }, R44: { r30: 67, r60: 134 }, 'R66 Turbine': { r30: 78, r60: 156 } }[aircraft];
  return (
    <div className="sv">
      <JourneyIntro />

      {/* Cropped map — show only southern England */}
      <div className="sv3__map-wrap">
        <div className="sv3__map-label">Range from Denham · <strong>{ac.model}</strong></div>
        <div className="sv3__map">
          <svg viewBox="100 350 400 280" fill="none">
            <path d="M224.5 476.8 L199.8 492.6 L189.1 490.9 L176.2 478.9 L162.5 480.4 L168.2 474.2 L156.5 468.8 L136.2 476.6 L122.0 459.4 L165.9 429.1 L172.6 414.4 L168.6 410.0 L167.8 389.1 L144.9 396.6 L161.2 373.6 L194.4 360.3 L207.5 365.9 L204.8 356.7 L208.8 354.6 L221.3 362.4 L340.8 360.7 L344.0 372.6 L331.8 389.9 L341.0 396.4 L352.1 385.7 L380.3 388.6 L395.6 400.1 L399.0 412.0 L393.0 443.1 L378.8 453.1 L380.5 461.7 L359.7 469.5 L365.5 472.2 L365.2 480.2 L346.7 487.4 L386.0 494.3 L385.3 506.7 L367.9 524.0 L338.1 535.0 L298.9 534.9 L274.0 526.0 L277.3 531.1 L249.6 537.6 L252.4 544.2 L249.5 545.8 L211.4 538.2 L195.4 543.8 L184.4 570.4 L164.1 560.1 L143.0 567.0 L127.6 584.1 L106.4 581.5 L136.5 550.5 L148.7 534.1 L151.1 520.6 L160.1 517.1 L164.4 506.2 L205.9 505.0 L233.8 468.8 L224.5 476.8 Z" stroke="#b5b0a8" strokeWidth="1.2" fill="#d6d1ca" />
            <circle cx="310" cy="480" r={r.r30} fill="none" stroke="#aaa" strokeWidth="1" strokeDasharray="4 3" />
            <circle cx="310" cy="480" r={r.r60} fill="none" stroke="#bbb" strokeWidth="1" strokeDasharray="6 4" />
            <circle cx="310" cy="480" r="5" fill="#1a1a1a" />
            <text x="322" y="483" fontFamily="Share Tech Mono" fontSize="9" fill="#666" fontWeight="700">DENHAM</text>
            <circle cx="265" cy="458" r="4" fill="#999" /><text x="200" y="452" fontFamily="Space Grotesk" fontSize="10" fill="#888" fontWeight="600">COTSWOLDS</text>
            <circle cx="355" cy="548" r="4" fill="#999" /><text x="367" y="553" fontFamily="Space Grotesk" fontSize="10" fill="#888" fontWeight="600">LE TOUQUET</text>
            <circle cx="145" cy="560" r="4" fill="#999" /><text x="110" y="575" fontFamily="Space Grotesk" fontSize="10" fill="#888" fontWeight="600">CORNWALL</text>
          </svg>
        </div>
      </div>

      <div className="sv__step-header"><StepNum n={1} active /><StepTitle active>Select Destination</StepTitle></div>
      <div className="sv__dest-list">
        {DESTINATIONS.map((d, i) => (
          <div key={i} className="sv__dest-row">
            <span className="sv__dest-name">{d.name}</span>
            <span className="sv__dest-time">{fmt(d.nm, ac.cruiseKts)}</span>
          </div>
        ))}
      </div>

      <div className="sv__step-header"><StepNum n={2} active /><StepTitle active>Choose Your Aircraft</StepTitle></div>
      <div className="sv__fleet">
        {FLEET.map(f => (
          <div key={f.model} className={`sv__fleet-row ${aircraft === f.model ? 'sv__fleet-row--active' : ''}`} onClick={() => setAircraft(f.model)}>
            <img src={f.img} alt={f.model} />
            <div><div className="sv__fleet-model">{f.model}</div><div className="sv__fleet-info">{f.seats} · {f.cruise}</div></div>
          </div>
        ))}
      </div>

      <div className="sv__step-header"><StepNum n={3} active /><StepTitle active>Fly</StepTitle></div>
      <p className="sv__desc">No crew, no waiting, no compromise. Available by the hour, day or week.</p>
      <CTA />
    </div>
  );
}


/* ═══════════════════════════════════════════════
   V4: Accordion steps — each step is collapsible.
   Aircraft selector above, destinations expand.
   ═══════════════════════════════════════════════ */
function V4() {
  const [open, setOpen] = useState(0);
  const [aircraft, setAircraft] = useState('R66 Turbine');
  const ac = FLEET.find(f => f.model === aircraft);
  return (
    <div className="sv">
      <JourneyIntro />

      <div className="sv4__accordion">
        <button className={`sv4__header ${open === 0 ? 'sv4__header--open' : ''}`} onClick={() => setOpen(open === 0 ? -1 : 0)}>
          <div className="sv4__header-left"><StepNum n={1} active={open === 0} /><span>Select Destination</span></div>
          <span className="sv4__chevron">{open === 0 ? '−' : '+'}</span>
        </button>
        {open === 0 && (
          <div className="sv4__body">
            {DESTINATIONS.map((d, i) => (
              <div key={i} className="sv__dest-row">
                <div>
                  <span className="sv__dest-name">{d.name}</span>
                  <p className="sv4__dest-desc">{d.desc}</p>
                </div>
                <span className="sv__dest-time">{fmt(d.nm, ac.cruiseKts)}</span>
              </div>
            ))}
            <div className="sv__dest-endless">Endless Destinations...</div>
          </div>
        )}

        <button className={`sv4__header ${open === 1 ? 'sv4__header--open' : ''}`} onClick={() => setOpen(open === 1 ? -1 : 1)}>
          <div className="sv4__header-left"><StepNum n={2} active={open === 1} /><span>Choose Your Aircraft</span></div>
          <span className="sv4__chevron">{open === 1 ? '−' : '+'}</span>
        </button>
        {open === 1 && (
          <div className="sv4__body">
            {FLEET.map(f => (
              <div key={f.model} className={`sv__fleet-row ${aircraft === f.model ? 'sv__fleet-row--active' : ''}`} onClick={() => setAircraft(f.model)}>
                <img src={f.img} alt={f.model} />
                <div><div className="sv__fleet-model">{f.model}</div><div className="sv__fleet-info">{f.seats} · {f.cruise}</div></div>
              </div>
            ))}
          </div>
        )}

        <button className={`sv4__header ${open === 2 ? 'sv4__header--open' : ''}`} onClick={() => setOpen(open === 2 ? -1 : 2)}>
          <div className="sv4__header-left"><StepNum n={3} active={open === 2} /><span>Fly</span></div>
          <span className="sv4__chevron">{open === 2 ? '−' : '+'}</span>
        </button>
        {open === 2 && (
          <div className="sv4__body">
            <p className="sv__desc">No crew, no waiting, no compromise. Available by the hour, day or week. Your licence, your aircraft, your schedule.</p>
          </div>
        )}
      </div>
      <CTA />
    </div>
  );
}


/* ═══════════════════════════════════════════════
   V5: Tabbed — Aircraft picker as pills at top,
   destinations show flight times that update live.
   ═══════════════════════════════════════════════ */
function V5() {
  const [aircraft, setAircraft] = useState('R66 Turbine');
  const [expandedDest, setExpandedDest] = useState(null);
  const ac = FLEET.find(f => f.model === aircraft);
  return (
    <div className="sv">
      <JourneyIntro />

      {/* Aircraft pills */}
      <div className="sv5__pills">
        {FLEET.map(f => (
          <button key={f.model} className={`sv5__pill ${aircraft === f.model ? 'sv5__pill--active' : ''}`} onClick={() => setAircraft(f.model)}>
            {f.model}
          </button>
        ))}
      </div>

      <div className="sv5__aircraft-info">
        <img src={ac.img} alt={ac.model} className="sv5__aircraft-img" />
        <div>
          <div className="sv__fleet-model">{ac.model}</div>
          <div className="sv__fleet-info">{ac.seats} · {ac.cruise}</div>
        </div>
      </div>

      {/* Destinations with expandable details */}
      <div className="sv__step-header" style={{ marginTop: '1.5rem' }}><StepNum n={1} active /><StepTitle active>Where Will You Go?</StepTitle></div>
      {DESTINATIONS.map((d, i) => (
        <div key={i} className="sv5__dest" onClick={() => setExpandedDest(expandedDest === i ? null : i)}>
          <div className="sv5__dest-top">
            <span className="sv__dest-name">{d.name}</span>
            <div className="sv5__dest-times">
              <span className="sv5__dest-fly">{fmt(d.nm, ac.cruiseKts)}</span>
              <span className="sv5__dest-car">vs {d.carTime} by car</span>
            </div>
          </div>
          {expandedDest === i && <p className="sv5__dest-detail">{d.desc}</p>}
        </div>
      ))}
      <div className="sv__dest-endless">Endless Destinations...</div>
      <CTA />
    </div>
  );
}


/* ═══════════════════════════════════════════════
   V6: Stat-focused — Big flight time numbers,
   compact layout, no map. Visual emphasis on speed.
   ═══════════════════════════════════════════════ */
function V6() {
  const [aircraft, setAircraft] = useState('R66 Turbine');
  const ac = FLEET.find(f => f.model === aircraft);
  return (
    <div className="sv">
      <JourneyIntro />

      {/* Aircraft selector */}
      <div className="sv__fleet">
        {FLEET.map(f => (
          <div key={f.model} className={`sv__fleet-row ${aircraft === f.model ? 'sv__fleet-row--active' : ''}`} onClick={() => setAircraft(f.model)}>
            <img src={f.img} alt={f.model} />
            <div><div className="sv__fleet-model">{f.model}</div><div className="sv__fleet-info">{f.seats} · {f.cruise}</div></div>
          </div>
        ))}
      </div>

      {/* Big stat destination cards */}
      <div className="sv6__grid">
        {DESTINATIONS.map((d, i) => (
          <div key={i} className="sv6__stat-card">
            <span className="sv6__stat-time">{fmt(d.nm, ac.cruiseKts)}</span>
            <span className="sv6__stat-name">{d.name}</span>
            <span className="sv6__stat-car">vs {d.carTime} drive</span>
          </div>
        ))}
      </div>
      <div className="sv__dest-endless">Endless Destinations...</div>

      <p className="sv__desc" style={{ marginTop: '1.5rem' }}>No crew, no waiting, no compromise. Available by the hour, day or week.</p>
      <CTA />
    </div>
  );
}


/* ═══════════════════════════════════════════════
   V7: Horizontal step flow — Three numbered
   steps as horizontal swipeable cards.
   ═══════════════════════════════════════════════ */
function V7() {
  const [aircraft, setAircraft] = useState('R66 Turbine');
  const ac = FLEET.find(f => f.model === aircraft);
  return (
    <div className="sv">
      <JourneyIntro />

      <div className="sv7__steps">
        {/* Step 1 */}
        <div className="sv7__step-card">
          <div className="sv7__step-badge">01</div>
          <h4 className="sv7__step-name">Select Destination</h4>
          {DESTINATIONS.map((d, i) => (
            <div key={i} className="sv__dest-row">
              <span className="sv__dest-name">{d.name}</span>
              <span className="sv__dest-time">{fmt(d.nm, ac.cruiseKts)}</span>
            </div>
          ))}
          <div className="sv__dest-endless">Endless Destinations...</div>
        </div>

        {/* Step 2 */}
        <div className="sv7__step-card">
          <div className="sv7__step-badge">02</div>
          <h4 className="sv7__step-name">Choose Your Aircraft</h4>
          {FLEET.map(f => (
            <div key={f.model} className={`sv__fleet-row ${aircraft === f.model ? 'sv__fleet-row--active' : ''}`} onClick={() => setAircraft(f.model)}>
              <img src={f.img} alt={f.model} />
              <div><div className="sv__fleet-model">{f.model}</div><div className="sv__fleet-info">{f.seats} · {f.cruise}</div></div>
            </div>
          ))}
        </div>

        {/* Step 3 */}
        <div className="sv7__step-card">
          <div className="sv7__step-badge">03</div>
          <h4 className="sv7__step-name">Fly</h4>
          <p className="sv__desc">No crew, no waiting, no compromise. Your licence, your aircraft, your schedule.</p>
          <CTA />
        </div>
      </div>
    </div>
  );
}


/* ═══════════════════════════════════════════════
   V8: Timeline with destination details inline.
   Each destination expands to show description.
   Vertical timeline line on the left.
   ═══════════════════════════════════════════════ */
function V8() {
  const [aircraft, setAircraft] = useState('R66 Turbine');
  const [expandedDest, setExpandedDest] = useState(null);
  const ac = FLEET.find(f => f.model === aircraft);
  return (
    <div className="sv">
      <JourneyIntro />

      <div className="sv8__timeline">
        <div className="sv8__tl-item">
          <div className="sv8__tl-dot sv8__tl-dot--active" />
          <div className="sv8__tl-content">
            <h4 className="sv8__tl-title">01 — Select Destination</h4>
            {DESTINATIONS.map((d, i) => (
              <div key={i} className={`sv8__dest ${expandedDest === i ? 'sv8__dest--open' : ''}`} onClick={() => setExpandedDest(expandedDest === i ? null : i)}>
                <div className="sv8__dest-row">
                  <span className="sv__dest-name">{d.name}</span>
                  <span className="sv__dest-time">{fmt(d.nm, ac.cruiseKts)}</span>
                </div>
                {expandedDest === i && (
                  <div className="sv8__dest-detail">
                    <p>{d.desc}</p>
                    <span className="sv8__dest-car">By car: {d.carTime}</span>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        <div className="sv8__tl-item">
          <div className="sv8__tl-dot sv8__tl-dot--active" />
          <div className="sv8__tl-content">
            <h4 className="sv8__tl-title">02 — Choose Your Aircraft</h4>
            {FLEET.map(f => (
              <div key={f.model} className={`sv__fleet-row ${aircraft === f.model ? 'sv__fleet-row--active' : ''}`} onClick={() => setAircraft(f.model)}>
                <img src={f.img} alt={f.model} />
                <div><div className="sv__fleet-model">{f.model}</div><div className="sv__fleet-info">{f.seats} · {f.cruise}</div></div>
              </div>
            ))}
          </div>
        </div>

        <div className="sv8__tl-item sv8__tl-item--last">
          <div className="sv8__tl-dot sv8__tl-dot--active" />
          <div className="sv8__tl-content">
            <h4 className="sv8__tl-title">03 — Fly</h4>
            <p className="sv__desc">No crew, no waiting, no compromise. Available by the hour, day or week.</p>
          </div>
        </div>
      </div>
      <CTA />
    </div>
  );
}


/* ═══════════════════════════════════════════════
   V9: Split comparison — Helicopter vs car times
   side by side for each destination. Visual impact.
   ═══════════════════════════════════════════════ */
function V9() {
  const [aircraft, setAircraft] = useState('R66 Turbine');
  const ac = FLEET.find(f => f.model === aircraft);
  return (
    <div className="sv">
      <JourneyIntro />

      <div className="sv__fleet">
        {FLEET.map(f => (
          <div key={f.model} className={`sv__fleet-row ${aircraft === f.model ? 'sv__fleet-row--active' : ''}`} onClick={() => setAircraft(f.model)}>
            <img src={f.img} alt={f.model} />
            <div><div className="sv__fleet-model">{f.model}</div><div className="sv__fleet-info">{f.seats} · {f.cruise}</div></div>
          </div>
        ))}
      </div>

      <div className="sv9__compare-header">
        <span>Destination</span>
        <span>Helicopter</span>
        <span>Car</span>
      </div>
      {DESTINATIONS.map((d, i) => (
        <div key={i} className="sv9__compare-row">
          <span className="sv9__compare-name">{d.name}</span>
          <span className="sv9__compare-heli">{fmt(d.nm, ac.cruiseKts)}</span>
          <span className="sv9__compare-car">{d.carTime}</span>
        </div>
      ))}
      <div className="sv__dest-endless">Endless Destinations...</div>

      <p className="sv__desc" style={{ marginTop: '1.5rem' }}>No crew, no waiting, no compromise. Available by the hour, day or week.</p>
      <CTA />
    </div>
  );
}


/* ═══════════════════════════════════════════════
   V10: Full-width cards — Each step is a distinct
   full-width card with background colour, stacked.
   ═══════════════════════════════════════════════ */
function V10() {
  const [aircraft, setAircraft] = useState('R66 Turbine');
  const ac = FLEET.find(f => f.model === aircraft);
  return (
    <div className="sv sv10">
      <JourneyIntro />

      <div className="sv10__card">
        <div className="sv10__card-header"><span className="sv10__card-num">01</span> Select Destination</div>
        {DESTINATIONS.map((d, i) => (
          <div key={i} className="sv10__dest">
            <div className="sv10__dest-main">
              <span className="sv__dest-name">{d.name}</span>
              <span className="sv__dest-time">{fmt(d.nm, ac.cruiseKts)}</span>
            </div>
            <p className="sv10__dest-desc">{d.desc}</p>
          </div>
        ))}
      </div>

      <div className="sv10__card">
        <div className="sv10__card-header"><span className="sv10__card-num">02</span> Choose Your Aircraft</div>
        {FLEET.map(f => (
          <div key={f.model} className={`sv__fleet-row ${aircraft === f.model ? 'sv__fleet-row--active' : ''}`} onClick={() => setAircraft(f.model)}>
            <img src={f.img} alt={f.model} />
            <div><div className="sv__fleet-model">{f.model}</div><div className="sv__fleet-info">{f.seats} · {f.cruise}</div></div>
          </div>
        ))}
      </div>

      <div className="sv10__card sv10__card--dark">
        <div className="sv10__card-header" style={{ color: '#fff' }}><span className="sv10__card-num" style={{ background: '#fff', color: '#1a1a1a' }}>03</span> Fly</div>
        <p className="sv__desc" style={{ color: 'rgba(255,255,255,0.8)' }}>No crew, no waiting, no compromise. Available by the hour, day or week.</p>
        <CTA />
      </div>
    </div>
  );
}


/* ═══════════════════════════════════════════════
   V11: Horizontally scrollable full map — user can
   pan the map left/right inside a fixed-height window.
   ═══════════════════════════════════════════════ */
function V11() {
  const [aircraft, setAircraft] = useState('R66 Turbine');
  const [activeDest, setActiveDest] = useState(null);
  const ac = FLEET.find(f => f.model === aircraft);
  return (
    <div className="sv">
      <JourneyIntro />

      <div className="sv11__map-scroll">
        <div className="sv11__map-inner">
          <FullMap aircraft={aircraft} activeDest={activeDest} height="500px" />
        </div>
      </div>
      <div className="sv3__map-label" style={{ textAlign: 'center', padding: '0.5rem', color: '#999', fontSize: '0.6rem' }}>← Scroll to pan map →</div>

      <div className="sv__step-header"><StepNum n={1} active /><StepTitle active>Select Destination</StepTitle></div>
      <div className="sv__dest-list">
        {DESTINATIONS.map((d, i) => (
          <div key={i} className={`sv__dest-row ${activeDest === i ? 'sv__dest-row--active' : ''}`} onClick={() => setActiveDest(activeDest === i ? null : i)}>
            <span className="sv__dest-name">{d.name}</span>
            <span className="sv__dest-time">{fmt(d.nm, ac.cruiseKts)}</span>
          </div>
        ))}
      </div>

      <div className="sv__step-header"><StepNum n={2} active /><StepTitle active>Choose Your Aircraft</StepTitle></div>
      <div className="sv__fleet">
        {FLEET.map(f => (
          <div key={f.model} className={`sv__fleet-row ${aircraft === f.model ? 'sv__fleet-row--active' : ''}`} onClick={() => setAircraft(f.model)}>
            <img src={f.img} alt={f.model} />
            <div><div className="sv__fleet-model">{f.model}</div><div className="sv__fleet-info">{f.seats} · {f.cruise}</div></div>
          </div>
        ))}
      </div>
      <CTA />
    </div>
  );
}


/* ═══════════════════════════════════════════════
   V12: Map as collapsible — starts collapsed with
   a "Show Range Map" button. Tapping expands it.
   ═══════════════════════════════════════════════ */
function V12() {
  const [aircraft, setAircraft] = useState('R66 Turbine');
  const [activeDest, setActiveDest] = useState(null);
  const [mapOpen, setMapOpen] = useState(false);
  const ac = FLEET.find(f => f.model === aircraft);
  return (
    <div className="sv">
      <JourneyIntro />

      <button className="sv12__map-toggle" onClick={() => setMapOpen(!mapOpen)}>
        <span>{mapOpen ? 'Hide' : 'Show'} Range Map</span>
        <span style={{ fontSize: '0.7rem', color: '#777', transition: 'transform 0.3s', transform: mapOpen ? 'rotate(180deg)' : 'none' }}>&#9660;</span>
      </button>
      {mapOpen && (
        <div className="sv12__map-container">
          <div className="sv3__map-label">Range from Denham · <strong>{ac.model}</strong></div>
          <FullMap aircraft={aircraft} activeDest={activeDest} height="auto" />
        </div>
      )}

      <div className="sv__step-header"><StepNum n={1} active /><StepTitle active>Select Destination</StepTitle></div>
      <div className="sv__dest-list">
        {DESTINATIONS.map((d, i) => (
          <div key={i} className={`sv__dest-row ${activeDest === i ? 'sv__dest-row--active' : ''}`} onClick={() => setActiveDest(activeDest === i ? null : i)}>
            <span className="sv__dest-name">{d.name}</span>
            <span className="sv__dest-time">{fmt(d.nm, ac.cruiseKts)}</span>
          </div>
        ))}
      </div>

      <div className="sv__step-header"><StepNum n={2} active /><StepTitle active>Choose Your Aircraft</StepTitle></div>
      <div className="sv__fleet">
        {FLEET.map(f => (
          <div key={f.model} className={`sv__fleet-row ${aircraft === f.model ? 'sv__fleet-row--active' : ''}`} onClick={() => setAircraft(f.model)}>
            <img src={f.img} alt={f.model} />
            <div><div className="sv__fleet-model">{f.model}</div><div className="sv__fleet-info">{f.seats} · {f.cruise}</div></div>
          </div>
        ))}
      </div>
      <CTA />
    </div>
  );
}


/* ═══════════════════════════════════════════════
   V13: Map + tabs — Map always visible at a
   constrained height. Below it, tabs switch between
   Destinations / Aircraft / Fly.
   ═══════════════════════════════════════════════ */
function V13() {
  const [aircraft, setAircraft] = useState('R66 Turbine');
  const [activeDest, setActiveDest] = useState(null);
  const [tab, setTab] = useState(0);
  const ac = FLEET.find(f => f.model === aircraft);
  return (
    <div className="sv">
      <JourneyIntro />

      <div className="sv13__map-box">
        <div className="sv3__map-label">Range from Denham · <strong>{ac.model}</strong></div>
        <FullMap aircraft={aircraft} activeDest={activeDest} height="280px" />
      </div>

      <div className="sv13__tabs">
        {['Destinations', 'Aircraft', 'Fly'].map((label, i) => (
          <button key={i} className={`sv13__tab ${tab === i ? 'sv13__tab--active' : ''}`} onClick={() => setTab(i)}>
            <span className="sv13__tab-num">{String(i + 1).padStart(2, '0')}</span> {label}
          </button>
        ))}
      </div>

      {tab === 0 && (
        <div className="sv13__panel">
          {DESTINATIONS.map((d, i) => (
            <div key={i} className={`sv__dest-row ${activeDest === i ? 'sv__dest-row--active' : ''}`} onClick={() => setActiveDest(activeDest === i ? null : i)}>
              <div>
                <span className="sv__dest-name">{d.name}</span>
                {activeDest === i && <p style={{ fontSize: '0.72rem', color: '#888', margin: '4px 0 0', lineHeight: 1.4 }}>{d.desc}</p>}
              </div>
              <span className="sv__dest-time">{fmt(d.nm, ac.cruiseKts)}</span>
            </div>
          ))}
          <div className="sv__dest-endless">Endless Destinations...</div>
        </div>
      )}
      {tab === 1 && (
        <div className="sv13__panel">
          {FLEET.map(f => (
            <div key={f.model} className={`sv__fleet-row ${aircraft === f.model ? 'sv__fleet-row--active' : ''}`} onClick={() => setAircraft(f.model)}>
              <img src={f.img} alt={f.model} />
              <div><div className="sv__fleet-model">{f.model}</div><div className="sv__fleet-info">{f.seats} · {f.cruise}</div></div>
            </div>
          ))}
        </div>
      )}
      {tab === 2 && (
        <div className="sv13__panel">
          <p className="sv__desc">No crew, no waiting, no compromise. Available by the hour, day or week. Your licence, your aircraft, your schedule.</p>
          <CTA />
        </div>
      )}
    </div>
  );
}


/* ═══════════════════════════════════════════════
   V14: Small map top-right — Compact thumbnail map
   floats to the right of the intro text, then full
   content flows below.
   ═══════════════════════════════════════════════ */
function V14() {
  const [aircraft, setAircraft] = useState('R66 Turbine');
  const [activeDest, setActiveDest] = useState(null);
  const ac = FLEET.find(f => f.model === aircraft);
  return (
    <div className="sv">
      <div className="sv14__intro">
        <div className="sv14__intro-text">
          <p className="sv__desc" style={{ margin: '0 0 0.5rem' }}>In a helicopter you can land at a significant amount of spots — gardens, pubs, hotels, golf courses, race courses.</p>
        </div>
        <div className="sv14__mini-map">
          <FullMap aircraft={aircraft} activeDest={activeDest} height="140px" />
        </div>
      </div>

      <div className="sv5__pills" style={{ marginTop: '1rem' }}>
        {FLEET.map(f => (
          <button key={f.model} className={`sv5__pill ${aircraft === f.model ? 'sv5__pill--active' : ''}`} onClick={() => setAircraft(f.model)}>
            {f.model}
          </button>
        ))}
      </div>

      {DESTINATIONS.map((d, i) => (
        <div key={i} className={`sv__dest-row ${activeDest === i ? 'sv__dest-row--active' : ''}`} onClick={() => setActiveDest(activeDest === i ? null : i)} style={{ cursor: 'pointer' }}>
          <div>
            <span className="sv__dest-name">{d.name}</span>
            {activeDest === i && <p style={{ fontSize: '0.72rem', color: '#888', margin: '4px 0 0', lineHeight: 1.4 }}>{d.desc}</p>}
          </div>
          <div style={{ textAlign: 'right', flexShrink: 0 }}>
            <span className="sv__dest-time" style={{ display: 'block', fontWeight: 700, color: '#1a1a1a' }}>{fmt(d.nm, ac.cruiseKts)}</span>
            <span style={{ fontSize: '0.6rem', color: '#999' }}>vs {d.carTime}</span>
          </div>
        </div>
      ))}
      <div className="sv__dest-endless">Endless Destinations...</div>

      <p className="sv__desc" style={{ marginTop: '1.5rem' }}>No crew, no waiting, no compromise. Available by the hour, day or week.</p>
      <CTA />
    </div>
  );
}


/* ═══════════════════════════════════════════════
   V15: Map hero with aircraft selector bar —
   Full-bleed map, aircraft switcher bar with
   chevrons + helicopter image underneath, then text.
   ═══════════════════════════════════════════════ */
function V15() {
  const [aircraftIdx, setAircraftIdx] = useState(0);
  const aircraft = FLEET[aircraftIdx].model;
  const ac = FLEET[aircraftIdx];
  const prev = () => setAircraftIdx((aircraftIdx - 1 + FLEET.length) % FLEET.length);
  const next = () => setAircraftIdx((aircraftIdx + 1) % FLEET.length);
  return (
    <div className="sv sv15">
      <div className="sv15__above-map">
        <p className="sv__desc">In a helicopter you can land at a significant amount of spots in comparison to even a light airplane due to not needing a runway.</p>
      </div>

      <div className="sv15__map-hero">
        <FullMap aircraft={aircraft} height="320px" />
      </div>

      {/* Aircraft selector bar — full width with chevrons */}
      <div className="sv15__aircraft-bar">
        <button className="sv15__chevron" onClick={prev} aria-label="Previous aircraft">&#8249;</button>
        <div className="sv15__aircraft-center">
          <img src={ac.img} alt={ac.model} className="sv15__aircraft-img" />
          <div className="sv15__aircraft-info">
            <span className="sv15__aircraft-model">{ac.model}</span>
            <span className="sv15__aircraft-detail">{ac.seats} · {ac.cruise}</span>
          </div>
        </div>
        <button className="sv15__chevron" onClick={next} aria-label="Next aircraft">&#8250;</button>
      </div>

      <div className="sv15__body">
        <p className="sv__desc">Gardens, pubs, hotels, golf courses, race courses — it opens up a new world of possibilities and is a great tool to have in your arsenal of activities you are able to do.</p>

        <div className="sv6__grid" style={{ margin: '1rem 0' }}>
          {DESTINATIONS.map((d, i) => (
            <div key={i} className="sv6__stat-card">
              <span className="sv6__stat-time">{fmt(d.nm, ac.cruiseKts)}</span>
              <span className="sv6__stat-name">{d.name}</span>
              <span className="sv6__stat-car">vs {d.carTime} drive</span>
            </div>
          ))}
        </div>
        <div className="sv__dest-endless">Endless Destinations...</div>

        <p className="sv__desc" style={{ marginTop: '1rem' }}>No crew, no waiting, no compromise. Available by the hour, day or week.</p>
        <CTA />
      </div>
    </div>
  );
}


/* ═══════════════════════════════════════════════
   Variations list & page
   ═══════════════════════════════════════════════ */
const VARIATIONS = [
  { id: 1, name: 'Linear Flow', desc: 'No map. Steps, destinations, and fleet stacked vertically in natural reading order.', Component: V1 },
  { id: 2, name: 'Destination Cards', desc: 'Swipeable horizontal cards per destination with flight time, description, and car comparison.', Component: V2 },
  { id: 3, name: 'Compact Map', desc: 'Cropped map showing only southern England. Destinations and fleet listed below.', Component: V3 },
  { id: 4, name: 'Accordion Steps', desc: 'Each step is a collapsible section. Only one open at a time. Destinations show descriptions.', Component: V4 },
  { id: 5, name: 'Pill Selector', desc: 'Aircraft as tappable pills at top. Destinations expand to show details. Flight times update live.', Component: V5 },
  { id: 6, name: 'Stat Focus', desc: 'Big flight-time numbers in a 2-column grid. Visual emphasis on speed vs driving.', Component: V6 },
  { id: 7, name: 'Swipeable Steps', desc: 'Three numbered step cards in a horizontal scroll. Each is self-contained.', Component: V7 },
  { id: 8, name: 'Timeline', desc: 'Vertical timeline with dot markers. Destinations expand inline. Faithful to desktop style.', Component: V8 },
  { id: 9, name: 'Comparison Table', desc: 'Helicopter vs car times in a clear table layout. Fleet selector above.', Component: V9 },
  { id: 10, name: 'Full-Width Cards', desc: 'Each step as a distinct full-width card. Step 3 has dark background for contrast.', Component: V10 },
  { id: 11, name: 'Scrollable Map', desc: 'Full UK map in a horizontally scrollable window. Tap destinations to highlight on map.', Component: V11 },
  { id: 12, name: 'Collapsible Map', desc: 'Map hidden by default behind a toggle button. Expands when tapped. Saves vertical space.', Component: V12 },
  { id: 13, name: 'Map + Tabs', desc: 'Map always visible at constrained height. Tabs below switch between Destinations, Aircraft, and Fly.', Component: V13 },
  { id: 14, name: 'Mini Map + List', desc: 'Small map thumbnail floats alongside intro text. Aircraft pills + expandable destination list below.', Component: V14 },
  { id: 15, name: 'Map Hero + Aircraft Bar', desc: 'Intro text above map, full-bleed map, aircraft switcher bar with chevrons and helicopter image underneath.', Component: V15 },
];

function SFHVariations() {
  const [activeId, setActiveId] = useState(null);
  return (
    <>
      <style>{styles}</style>
      <div className="svp">
        <div className="svp__header">
          <h1 className="svp__h1">Self-Fly Hire — Mobile Variations</h1>
          <p className="svp__subtitle">15 variations for the expandable grid section — view on mobile viewport</p>
        </div>
        <div className="svp__picker">
          {VARIATIONS.map(v => (
            <button key={v.id} className={`svp__pick ${activeId === v.id ? 'svp__pick--active' : ''}`} onClick={() => { setActiveId(activeId === v.id ? null : v.id); setTimeout(() => document.getElementById(`sv-${v.id}`)?.scrollIntoView({ behavior: 'smooth', block: 'start' }), 50); }}>
              <span className="svp__pick-num">V{v.id}</span>
              <span className="svp__pick-name">{v.name}</span>
            </button>
          ))}
        </div>
        <div className="svp__variations">
          {VARIATIONS.filter(v => activeId === null || activeId === v.id).map(v => (
            <div key={v.id} id={`sv-${v.id}`} className="svp__section">
              <div className="svp__section-label">
                <span className="svp__section-num">V{v.id}</span>
                <div><h2 className="svp__section-title">{v.name}</h2><p className="svp__section-desc">{v.desc}</p></div>
              </div>
              <div className="svp__phone">
                <div className="svp__phone-screen"><v.Component /></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}

/* ═══════════════════════════════════════════════
   Styles
   ═══════════════════════════════════════════════ */
const styles = `
  @import url('https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@400;500;600;700&family=Share+Tech+Mono&display=swap');

  /* Page shell */
  .svp { font-family: 'Space Grotesk', sans-serif; background: #f5f4f1; min-height: 100vh; padding: 2rem 1rem; }
  .svp__header { text-align: center; margin-bottom: 2rem; }
  .svp__h1 { font-size: 1.8rem; font-weight: 700; color: #1a1a1a; margin: 0 0 0.5rem; }
  .svp__subtitle { color: #888; font-size: 0.85rem; margin: 0; }
  .svp__picker { display: flex; flex-wrap: wrap; gap: 8px; justify-content: center; margin-bottom: 2.5rem; max-width: 900px; margin-left: auto; margin-right: auto; }
  .svp__pick { display: flex; align-items: center; gap: 6px; padding: 6px 14px; border: 1px solid #ddd; border-radius: 20px; background: #fff; cursor: pointer; font-family: inherit; font-size: 0.75rem; color: #555; transition: all 0.15s; }
  .svp__pick:hover { border-color: #1a1a1a; color: #1a1a1a; }
  .svp__pick--active { background: #1a1a1a; border-color: #1a1a1a; color: #fff; }
  .svp__pick-num { font-family: 'Share Tech Mono', monospace; font-size: 0.65rem; opacity: 0.6; }
  .svp__pick-name { font-weight: 500; }
  .svp__section { max-width: 500px; margin: 0 auto 4rem; }
  .svp__section-label { display: flex; align-items: flex-start; gap: 12px; margin-bottom: 1rem; }
  .svp__section-num { font-family: 'Share Tech Mono', monospace; font-size: 0.7rem; color: #999; background: #eee; padding: 3px 8px; border-radius: 4px; flex-shrink: 0; margin-top: 2px; }
  .svp__section-title { font-size: 1.1rem; font-weight: 600; color: #1a1a1a; margin: 0 0 4px; }
  .svp__section-desc { font-size: 0.78rem; color: #888; margin: 0; line-height: 1.4; }
  .svp__phone { border: 2px solid #ddd; border-radius: 24px; background: #fff; overflow: hidden; box-shadow: 0 8px 30px rgba(0,0,0,0.08); }
  .svp__phone-screen { max-height: 75vh; overflow-y: auto; overflow-x: hidden; -webkit-overflow-scrolling: touch; }

  /* ─── Shared variation styles ─── */
  .sv { font-family: 'Space Grotesk', sans-serif; background: #fff; padding: 1.5rem 1.25rem 2rem; }
  .sv__desc { font-size: 0.82rem; line-height: 1.7; color: #555; margin: 0 0 1rem; }
  .sv__cta { display: block; width: 100%; padding: 0.85rem; background: #1a1a1a; color: #fff; text-decoration: none; font-size: 0.7rem; text-transform: uppercase; letter-spacing: 0.1em; text-align: center; font-weight: 600; margin-top: 1.5rem; transition: background 0.3s; }

  /* Step header */
  .sv__step-header { display: flex; align-items: center; gap: 10px; margin: 1.5rem 0 0.75rem; }
  .sv__step-num { width: 30px; height: 30px; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-family: 'Share Tech Mono', monospace; font-size: 0.6rem; border: 1px solid #aaa; color: #777; background: #f2efea; flex-shrink: 0; }
  .sv__step-num--active { background: #1a1a1a; color: #fff; border-color: #1a1a1a; }
  .sv__step-title { font-size: 0.8rem; font-weight: 700; text-transform: uppercase; letter-spacing: 0.05em; color: #777; }
  .sv__step-title--active { color: #1a1a1a; }

  /* Destination list */
  .sv__dest-list { margin-bottom: 0.5rem; }
  .sv__dest-row { display: flex; justify-content: space-between; align-items: center; padding: 0.85rem 0.75rem; background: rgba(0,0,0,0.02); margin-bottom: 6px; border-left: 2px solid transparent; }
  .sv__dest-name { font-size: 0.82rem; font-weight: 600; color: #444; }
  .sv__dest-time { font-family: 'Share Tech Mono', monospace; font-size: 0.7rem; color: #999; flex-shrink: 0; margin-left: 8px; }
  .sv__dest-endless { text-align: right; font-size: 0.78rem; font-weight: 600; color: #999; padding: 0.5rem 0.75rem; }

  /* Fleet */
  .sv__fleet { margin-bottom: 0.5rem; }
  .sv__fleet-row { display: flex; align-items: center; gap: 0.75rem; padding: 0.75rem; border: 1px solid #ccc8c1; margin-bottom: 6px; cursor: pointer; transition: all 0.2s; }
  .sv__fleet-row--active { border-color: #1a1a1a; background: rgba(0,0,0,0.03); }
  .sv__fleet-row img { height: 36px; width: 60px; object-fit: contain; }
  .sv__fleet-model { font-weight: 700; text-transform: uppercase; font-size: 0.8rem; color: #1a1a1a; }
  .sv__fleet-info { font-size: 0.68rem; color: #777; }

  /* V2 — destination cards */
  .sv2__cards { display: flex; gap: 10px; overflow-x: auto; scroll-snap-type: x mandatory; -webkit-overflow-scrolling: touch; padding-bottom: 0.5rem; margin: 0 -1.25rem 1rem; padding-left: 1.25rem; scrollbar-width: none; }
  .sv2__cards::-webkit-scrollbar { display: none; }
  .sv2__card { flex: 0 0 80%; scroll-snap-align: start; border: 1px solid rgba(0,0,0,0.08); border-radius: 10px; padding: 1rem; }
  .sv2__card:last-child { margin-right: 1.25rem; }
  .sv2__card-top { display: flex; justify-content: space-between; align-items: baseline; margin-bottom: 0.5rem; }
  .sv2__card-name { font-weight: 700; font-size: 0.9rem; color: #1a1a1a; }
  .sv2__card-time { font-family: 'Share Tech Mono', monospace; font-size: 0.75rem; color: #1a1a1a; font-weight: 700; }
  .sv2__card-desc { font-size: 0.75rem; color: #666; line-height: 1.5; margin: 0 0 0.5rem; }
  .sv2__card-compare { font-size: 0.65rem; color: #999; font-family: 'Share Tech Mono', monospace; text-transform: uppercase; letter-spacing: 0.05em; }

  /* V3 — compact map */
  .sv3__map-wrap { border: 1px solid #ccc8c1; border-radius: 8px; overflow: hidden; margin-bottom: 1.5rem; background: #f2efea; }
  .sv3__map-label { font-family: 'Share Tech Mono', monospace; font-size: 0.65rem; text-transform: uppercase; letter-spacing: 0.1em; color: #777; padding: 0.75rem 1rem; }
  .sv3__map-label strong { color: #1a1a1a; }
  .sv3__map { padding: 0 0.5rem 0.5rem; }
  .sv3__map svg { width: 100%; height: auto; display: block; }

  /* V4 — accordion */
  .sv4__accordion { border: 1px solid rgba(0,0,0,0.08); border-radius: 8px; overflow: hidden; }
  .sv4__header { display: flex; justify-content: space-between; align-items: center; width: 100%; padding: 0.85rem 1rem; border: none; background: #fff; cursor: pointer; font-family: 'Space Grotesk', sans-serif; font-size: 0.85rem; font-weight: 600; color: #1a1a1a; border-bottom: 1px solid rgba(0,0,0,0.06); }
  .sv4__header--open { background: rgba(0,0,0,0.02); }
  .sv4__header-left { display: flex; align-items: center; gap: 10px; }
  .sv4__chevron { font-size: 1.1rem; color: #999; }
  .sv4__body { padding: 0.75rem 1rem 1rem; animation: svFadeIn 0.2s ease; }
  .sv4__dest-desc { font-size: 0.7rem; color: #888; line-height: 1.4; margin: 4px 0 0; }

  /* V5 — pill selector */
  .sv5__pills { display: flex; gap: 6px; margin-bottom: 1rem; }
  .sv5__pill { padding: 8px 14px; border: 1px solid #ccc8c1; border-radius: 20px; background: #fff; font-family: inherit; font-size: 0.72rem; font-weight: 600; cursor: pointer; color: #777; transition: all 0.15s; }
  .sv5__pill--active { background: #1a1a1a; color: #fff; border-color: #1a1a1a; }
  .sv5__aircraft-info { display: flex; align-items: center; gap: 1rem; padding: 0.75rem; border: 1px solid rgba(0,0,0,0.08); border-radius: 8px; background: rgba(0,0,0,0.015); }
  .sv5__aircraft-img { height: 40px; width: 65px; object-fit: contain; }
  .sv5__dest { padding: 0.85rem 0.75rem; background: rgba(0,0,0,0.02); margin-bottom: 6px; cursor: pointer; }
  .sv5__dest-top { display: flex; justify-content: space-between; align-items: center; }
  .sv5__dest-times { text-align: right; }
  .sv5__dest-fly { display: block; font-family: 'Share Tech Mono', monospace; font-size: 0.75rem; font-weight: 700; color: #1a1a1a; }
  .sv5__dest-car { font-size: 0.6rem; color: #999; }
  .sv5__dest-detail { font-size: 0.75rem; color: #666; line-height: 1.5; margin: 0.5rem 0 0; animation: svFadeIn 0.2s ease; }

  /* V6 — stat grid */
  .sv6__grid { display: grid; grid-template-columns: 1fr 1fr; gap: 8px; margin: 1rem 0; }
  .sv6__stat-card { border: 1px solid rgba(0,0,0,0.08); border-radius: 8px; padding: 1rem; text-align: center; }
  .sv6__stat-time { display: block; font-family: 'Share Tech Mono', monospace; font-size: 1.4rem; font-weight: 700; color: #1a1a1a; margin-bottom: 2px; }
  .sv6__stat-name { display: block; font-size: 0.72rem; font-weight: 600; color: #444; text-transform: uppercase; letter-spacing: 0.03em; }
  .sv6__stat-car { display: block; font-size: 0.6rem; color: #999; margin-top: 4px; }

  /* V7 — swipeable steps */
  .sv7__steps { display: flex; gap: 10px; overflow-x: auto; scroll-snap-type: x mandatory; -webkit-overflow-scrolling: touch; margin: 0 -1.25rem; padding: 0 1.25rem 0.5rem; scrollbar-width: none; }
  .sv7__steps::-webkit-scrollbar { display: none; }
  .sv7__step-card { flex: 0 0 85%; scroll-snap-align: start; border: 1px solid rgba(0,0,0,0.08); border-radius: 10px; padding: 1.25rem; }
  .sv7__step-card:last-child { margin-right: 1.25rem; }
  .sv7__step-badge { width: 28px; height: 28px; border-radius: 50%; background: #1a1a1a; color: #fff; display: flex; align-items: center; justify-content: center; font-family: 'Share Tech Mono', monospace; font-size: 0.6rem; margin-bottom: 0.75rem; }
  .sv7__step-name { font-size: 0.85rem; font-weight: 700; text-transform: uppercase; letter-spacing: 0.03em; color: #1a1a1a; margin: 0 0 0.75rem; }

  /* V8 — timeline */
  .sv8__timeline { padding-left: 20px; position: relative; }
  .sv8__tl-item { position: relative; padding-left: 24px; padding-bottom: 1.5rem; border-left: 2px solid #ccc8c1; }
  .sv8__tl-item--last { border-left-color: transparent; }
  .sv8__tl-dot { position: absolute; left: -7px; top: 0; width: 12px; height: 12px; border-radius: 50%; border: 2px solid #aaa; background: #f2efea; }
  .sv8__tl-dot--active { background: #1a1a1a; border-color: #1a1a1a; }
  .sv8__tl-title { font-size: 0.78rem; font-weight: 700; text-transform: uppercase; letter-spacing: 0.05em; color: #1a1a1a; margin: 0 0 0.75rem; }
  .sv8__dest { padding: 0.75rem; background: rgba(0,0,0,0.02); margin-bottom: 6px; cursor: pointer; border-radius: 4px; }
  .sv8__dest--open { background: rgba(0,0,0,0.04); }
  .sv8__dest-row { display: flex; justify-content: space-between; align-items: center; }
  .sv8__dest-detail { margin-top: 0.5rem; animation: svFadeIn 0.2s ease; }
  .sv8__dest-detail p { font-size: 0.75rem; color: #666; line-height: 1.5; margin: 0 0 4px; }
  .sv8__dest-car { font-size: 0.6rem; color: #999; font-family: 'Share Tech Mono', monospace; }

  /* V9 — comparison table */
  .sv9__compare-header { display: grid; grid-template-columns: 1.4fr 1fr 1fr; padding: 0.6rem 0.75rem; margin-top: 1rem; border-bottom: 1px solid rgba(0,0,0,0.08); }
  .sv9__compare-header span { font-family: 'Share Tech Mono', monospace; font-size: 0.6rem; text-transform: uppercase; letter-spacing: 0.08em; color: #999; }
  .sv9__compare-row { display: grid; grid-template-columns: 1.4fr 1fr 1fr; padding: 0.85rem 0.75rem; border-bottom: 1px solid rgba(0,0,0,0.04); }
  .sv9__compare-name { font-size: 0.8rem; font-weight: 600; color: #444; }
  .sv9__compare-heli { font-family: 'Share Tech Mono', monospace; font-size: 0.78rem; font-weight: 700; color: #1a1a1a; }
  .sv9__compare-car { font-family: 'Share Tech Mono', monospace; font-size: 0.72rem; color: #999; text-decoration: line-through; }

  /* V10 — full-width cards */
  .sv10 { padding: 1.5rem 0 0; }
  .sv10 > .sv__desc { padding: 0 1.25rem; }
  .sv10__card { background: #faf9f6; padding: 1.25rem; margin-bottom: 8px; }
  .sv10__card--dark { background: #1a1a1a; }
  .sv10__card-header { font-size: 0.85rem; font-weight: 700; text-transform: uppercase; letter-spacing: 0.03em; color: #1a1a1a; margin-bottom: 1rem; display: flex; align-items: center; gap: 10px; }
  .sv10__card-num { width: 26px; height: 26px; border-radius: 50%; background: #1a1a1a; color: #fff; display: flex; align-items: center; justify-content: center; font-family: 'Share Tech Mono', monospace; font-size: 0.6rem; flex-shrink: 0; }
  .sv10__dest { margin-bottom: 8px; padding: 0.75rem; background: #fff; border-radius: 6px; }
  .sv10__dest-main { display: flex; justify-content: space-between; align-items: center; }
  .sv10__dest-desc { font-size: 0.7rem; color: #888; line-height: 1.4; margin: 4px 0 0; }
  .sv10__card--dark .sv__cta { background: #fff; color: #1a1a1a; }

  /* Active destination row */
  .sv__dest-row--active { border-left-color: #1a1a1a; background: rgba(0,0,0,0.05); }
  .sv__dest-row--active .sv__dest-name { color: #1a1a1a; }
  .sv__dest-row { cursor: pointer; transition: all 0.15s; }

  /* V11 — horizontally scrollable map */
  .sv11__map-scroll {
    overflow-x: auto;
    overflow-y: hidden;
    -webkit-overflow-scrolling: touch;
    margin: 0 -1.25rem;
    border-top: 1px solid rgba(0,0,0,0.06);
    border-bottom: 1px solid rgba(0,0,0,0.06);
    background: #f2efea;
  }
  .sv11__map-scroll::-webkit-scrollbar { display: none; }
  .sv11__map-scroll { scrollbar-width: none; }
  .sv11__map-inner {
    width: 400px;
    min-width: 400px;
    padding: 0.5rem;
  }

  /* V12 — collapsible map */
  .sv12__map-toggle {
    display: flex;
    align-items: center;
    justify-content: space-between;
    width: 100%;
    padding: 0.85rem 1rem;
    background: #f2efea;
    border: 1px solid #ccc8c1;
    border-radius: 8px;
    cursor: pointer;
    font-family: 'Space Grotesk', sans-serif;
    font-size: 0.85rem;
    font-weight: 600;
    color: #1a1a1a;
    margin-bottom: 1rem;
  }
  .sv12__map-container {
    border: 1px solid #ccc8c1;
    border-radius: 8px;
    overflow: hidden;
    background: #f2efea;
    margin-bottom: 1rem;
    padding: 0 0.5rem 0.5rem;
    animation: svFadeIn 0.2s ease;
  }

  /* V13 — map + tabs */
  .sv13__map-box {
    border: 1px solid #ccc8c1;
    border-radius: 8px;
    overflow: hidden;
    background: #f2efea;
    margin-bottom: 1rem;
    padding: 0 0.5rem 0.5rem;
  }
  .sv13__tabs {
    display: flex;
    gap: 0;
    border: 1px solid rgba(0,0,0,0.1);
    border-radius: 8px;
    overflow: hidden;
    margin-bottom: 1rem;
  }
  .sv13__tab {
    flex: 1;
    padding: 10px 6px;
    font-family: 'Space Grotesk', sans-serif;
    font-size: 0.68rem;
    font-weight: 600;
    text-transform: uppercase;
    letter-spacing: 0.02em;
    border: none;
    background: #fff;
    color: #999;
    cursor: pointer;
    transition: all 0.15s;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 4px;
  }
  .sv13__tab--active { background: #1a1a1a; color: #fff; }
  .sv13__tab + .sv13__tab { border-left: 1px solid rgba(0,0,0,0.1); }
  .sv13__tab-num { font-family: 'Share Tech Mono', monospace; font-size: 0.55rem; opacity: 0.5; }
  .sv13__panel { animation: svFadeIn 0.2s ease; }

  /* V14 — mini map + list */
  .sv14__intro {
    display: grid;
    grid-template-columns: 1fr 130px;
    gap: 12px;
    align-items: start;
    margin-bottom: 0.5rem;
  }
  .sv14__mini-map {
    border: 1px solid #ccc8c1;
    border-radius: 6px;
    overflow: hidden;
    background: #f2efea;
    padding: 4px;
  }

  /* V15 — map hero with aircraft bar */
  .sv15 { padding: 0; }
  .sv15__above-map {
    padding: 1.5rem 1.25rem 0.5rem;
  }
  .sv15__map-hero {
    background: #f2efea;
    padding: 0.5rem 0.5rem 0;
  }
  .sv15__aircraft-bar {
    display: flex;
    align-items: center;
    gap: 0;
    background: #f2efea;
    border-bottom: 1px solid #ccc8c1;
    padding: 0.75rem 0.5rem;
  }
  .sv15__chevron {
    width: 36px;
    height: 36px;
    border: 1px solid rgba(0,0,0,0.1);
    border-radius: 50%;
    background: #fff;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 1.4rem;
    color: #555;
    cursor: pointer;
    flex-shrink: 0;
    transition: all 0.15s;
    font-family: sans-serif;
    line-height: 1;
    padding: 0 0 2px 0;
  }
  .sv15__chevron:active { background: #eee; }
  .sv15__aircraft-center {
    flex: 1;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 12px;
  }
  .sv15__aircraft-img {
    height: 44px;
    width: 72px;
    object-fit: contain;
  }
  .sv15__aircraft-info {
    display: flex;
    flex-direction: column;
    gap: 1px;
  }
  .sv15__aircraft-model {
    font-size: 0.85rem;
    font-weight: 700;
    text-transform: uppercase;
    color: #1a1a1a;
  }
  .sv15__aircraft-detail {
    font-size: 0.65rem;
    color: #777;
  }
  .sv15__body { padding: 1.25rem 1.25rem 2rem; }

  @keyframes svFadeIn {
    from { opacity: 0; transform: translateY(6px); }
    to { opacity: 1; transform: translateY(0); }
  }
`;

export default SFHVariations;

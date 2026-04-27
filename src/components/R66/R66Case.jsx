// R66 Case — "Nine reasons the R66 is the one that gets flown."
//
// Chaptered Narrative (Variant A from R66BenefitsVariations.jsx, lifted into a
// self-contained component for AircraftR66.jsx. The closing argument uses a
// trimmed dark band — CTA buttons removed because R66CTA handles conversion
// further down the page.
//
// Visual vocabulary: Space Grotesk + Share Tech Mono, warm-paper palette
// (#faf9f6 / #1a1a1a / #4a4a4a / #7a7a7a / #e8e6e2 / #a67b3f), center-seam,
// multi-weight headline spans. All CSS scoped under .r66b-*.

import { useEffect, useRef, useState } from 'react';

// UK outline path (same as Experimentation.jsx sfh-map). ViewBox-native coords
// — Denham (EGLD) sits at (310, 480). 1 NM ≈ 1.114 SVG units at this scale.
const R66B_UK_PATH = "M224.5 476.8 L199.8 492.6 L189.1 490.9 L176.2 478.9 L162.5 480.4 L168.2 474.2 L156.5 468.8 L136.2 476.6 L122.0 459.4 L165.9 429.1 L172.6 414.4 L168.6 410.0 L167.8 389.1 L144.9 396.6 L161.2 373.6 L194.4 360.3 L207.5 365.9 L204.8 356.7 L208.8 354.6 L221.3 362.4 L208.8 348.7 L214.3 333.7 L210.1 331.0 L210.4 322.1 L215.3 318.3 L216.6 303.6 L204.8 307.0 L188.0 277.4 L193.0 263.3 L209.9 251.0 L189.6 251.5 L173.5 262.8 L139.5 258.3 L135.8 268.9 L126.9 257.5 L125.5 248.9 L130.1 248.7 L145.0 214.0 L136.6 200.6 L139.2 184.9 L148.7 184.3 L138.5 176.7 L140.2 169.4 L123.8 187.6 L123.5 175.6 L132.3 164.3 L117.1 178.8 L110.3 221.5 L101.9 223.3 L112.3 193.5 L107.7 192.8 L111.1 163.2 L124.8 128.8 L106.4 144.1 L87.5 131.5 L103.4 122.3 L98.2 118.9 L110.1 96.6 L99.9 82.8 L109.3 75.3 L102.9 67.0 L108.3 52.7 L126.1 52.7 L116.0 39.9 L119.0 28.5 L131.9 26.8 L128.8 18.6 L133.2 5.3 L154.7 9.9 L209.2 1.6 L203.0 22.8 L172.2 47.4 L170.5 54.7 L177.5 56.9 L166.5 73.3 L199.7 64.2 L247.9 64.8 L256.2 70.9 L259.6 80.2 L231.1 137.0 L199.1 155.5 L215.9 153.2 L224.3 162.9 L197.1 178.2 L180.2 173.7 L209.5 183.4 L227.2 178.3 L245.1 186.7 L264.6 209.3 L281.3 268.0 L303.5 281.5 L326.7 307.6 L321.8 314.2 L334.6 342.2 L303.9 334.3 L318.4 336.6 L340.8 360.7 L344.0 372.6 L331.8 389.9 L341.0 396.4 L352.1 385.7 L380.3 388.6 L395.6 400.1 L399.0 412.0 L393.0 443.1 L378.8 453.1 L380.5 461.7 L359.7 469.5 L365.5 472.2 L365.2 480.2 L346.7 487.4 L386.0 494.3 L385.3 506.7 L367.9 524.0 L338.1 535.0 L298.9 534.9 L274.0 526.0 L277.3 531.1 L249.6 537.6 L252.4 544.2 L249.5 545.8 L211.4 538.2 L195.4 543.8 L184.4 570.4 L164.1 560.1 L143.0 567.0 L127.6 584.1 L106.4 581.5 L136.5 550.5 L148.7 534.1 L151.1 520.6 L160.1 517.1 L164.4 506.2 L205.9 505.0 L233.8 468.8 L224.5 476.8 Z";

// Denham origin in UK-path coords; 1 NM ≈ 1.114 SVG units (derived from
// sfh-map's R66 Turbine r30=78 over 70 NM).
const R66B_DENHAM = { x: 310, y: 480 };
const R66B_NM_TO_UNITS = 1.114;
const R66B_R_STD = 350 * R66B_NM_TO_UNITS; // ~390
const R66B_R_AUX = 550 * R66B_NM_TO_UNITS; // ~613

// ===========================================================================
// Nine approved arguments
// ===========================================================================
const ARGUMENTS = {
  1: {
    code: 'OWN-01', group: 'Ownership',
    parts: [
      { t: 'A turbine',           w: 'dark' },
      { t: 'you can actually',    w: 'mid' },
      { t: 'afford to fly.',      w: 'light' },
    ],
    body:
      'Operators put real hours on R66s because the per-hour maths works. ' +
      'Jet-A burn, Robinson-priced inspections and a TBO that arrives on ' +
      'schedule, not before.',
    stat: { label: 'DIRECT OPERATING COST', value: '~£400–£500', unit: '/ hr' },
  },
  2: {
    code: 'OWN-02', group: 'Ownership',
    parts: [
      { t: 'The top of',          w: 'dark' },
      { t: 'the Robinson',        w: 'mid' },
      { t: 'ladder.',             w: 'light' },
    ],
    body:
      'Pilots graduate into the R66 from the R22 and R44 without leaving the ' +
      'manufacturer that taught them. Same philosophy, same factory, same ' +
      'discipline, with turbine performance added on top.',
    stat: { label: 'POSITION IN RANGE', value: 'Flagship' },
  },
  3: {
    code: 'ENG-01', group: 'Engine',
    parts: [
      { t: 'A Rolls-Royce', w: 'dark' },
      { t: 'with headroom,', w: 'mid' },
      { t: 'on purpose.',   w: 'light' },
    ],
    body:
      'The RR300 produces more power than the R66 asks of it, and Robinson ' +
      'caps it below that limit on purpose. No carb heat or complex engine ' +
      'routine to learn. The result is a takeoff chart at 6,000 ft density ' +
      'altitude that reads the same as sea level.',
    stat: { label: 'CORE ENGINE', value: 'Rolls-Royce RR300' },
  },
  4: {
    code: 'OWN-03', group: 'Ownership',
    parts: [
      { t: 'Robinson discipline,', w: 'dark' },
      { t: 'turbine',              w: 'mid' },
      { t: 'performance.',         w: 'light' },
    ],
    body:
      'Published overhaul schedules. Open safety notices. Component life ' +
      'limits you can plan around. The ownership model Robinson built its ' +
      'reputation on, applied to a turbine.',
    stat: { label: 'TBO', value: '2,000', unit: 'HRS' },
  },
  5: {
    code: 'ENG-02', group: 'Engine',
    parts: [
      { t: 'A Rolls-Royce',       w: 'dark' },
      { t: 'in the back.',        w: 'mid' },
      { t: 'Flat-rated on purpose.', w: 'light' },
    ],
    body:
      'The RR300 produces more power than the airframe uses. Robinson caps ' +
      'it deliberately so it delivers the same takeoff figures at 6,000 ft ' +
      'density altitude as it does at sea level. Hot-and-high stops being ' +
      'an asterisk.',
    stat: { label: 'CORE ENGINE', value: 'Rolls-Royce RR300' },
  },
  6: {
    code: 'ENG-03', group: 'Engine',
    parts: [
      { t: 'The simplest',        w: 'dark' },
      { t: 'turbine cockpit',     w: 'mid' },
      { t: 'in production.',      w: 'light' },
    ],
    body:
      'Garmin G500H TXi, digital engine monitoring, TAWS, ADS-B. All ' +
      'factory, all integrated.',
    stat: { label: 'AVIONICS', value: 'Factory G500H TXi' },
  },
  7: {
    code: 'AIR-01', group: 'Aircraft',
    parts: [
      { t: 'Spacious cargo hold', w: 'dark' },
      { t: 'and',                 w: 'mid' },
      { t: 'underseat storage.',  w: 'light' },
    ],
    body:
      'Three hundred pounds of secure baggage loaded from outside the ' +
      'cabin, plus roughly fifty pounds of underseat stowage for personal ' +
      'items. Rifle cases, camera rigs, golf clubs, overnight bags. They ' +
      'ride in the aircraft, not on pilot laps.',
    stat: { label: 'TOTAL STOWAGE', value: '~350', unit: 'LB' },
  },
  8: {
    code: 'AIR-02', group: 'Aircraft',
    parts: [
      { t: 'Five seats,',       w: 'dark' },
      { t: 'one more than',     w: 'mid' },
      { t: 'the R44.',          w: 'light' },
    ],
    body:
      'The R66 is not the largest light turbine on the market, but stepping ' +
      'from four seats to five changes what the aircraft can do for you. ' +
      'Forward-facing, adult-sized, with a useful load that holds up once ' +
      'everyone is aboard. Where the R44 leaves a passenger on the ground, ' +
      'the R66 keeps the trip intact.',
    stat: { label: 'USEFUL LOAD', value: '~1,157', unit: 'LB' },
  },
  9: {
    code: 'AIR-03', group: 'Aircraft',
    parts: [
      { t: 'An auxiliary tank',   w: 'dark' },
      { t: 'makes it',            w: 'mid' },
      { t: 'a transport.',        w: 'light' },
    ],
    body:
      'The 43.5-gallon auxiliary tank extends range to roughly 550 nautical ' +
      'miles and endurance past five hours. London to the Highlands, the ' +
      'Alps, or the South of France on a single tank, single leg.',
    stat: { label: 'RANGE (w/ AUX)', value: '~550', unit: 'NM' },
  },
};

// ===========================================================================
// Shared primitives
// ===========================================================================
function Headline({ parts, className = '', inverted = false }) {
  const prefix = inverted ? 'r66b-inv' : 'r66b';
  return (
    <h2 className={className}>
      {parts.map((p, i) => (
        <span key={i} className={`${prefix}-text--${p.w}`}>
          {p.t}{i < parts.length - 1 ? ' ' : ''}
        </span>
      ))}
    </h2>
  );
}

function useInView(ref, threshold = 0.25) {
  const [inView, setInView] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return undefined;
    const obs = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) setInView(true); },
      { threshold }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, [ref, threshold]);
  return inView;
}

function GlobalTokens() {
  return (
    <style>{`
      .r66b-text--dark  { color: #1a1a1a; font-weight: 500; }
      .r66b-text--mid   { color: #4a4a4a; font-weight: 300; }
      .r66b-text--light { color: #7a7a7a; font-weight: 300; }
      .r66b-inv-text--dark  { color: #faf9f6; font-weight: 500; }
      .r66b-inv-text--mid   { color: rgba(250,249,246,0.75); font-weight: 300; }
      .r66b-inv-text--light { color: rgba(250,249,246,0.5);  font-weight: 300; }
      .r66b-exp, .r66b-seamD, .r66b-seamP,
      .r66b-range, .r66b-ladder, .r66b-closeA {
        font-family: 'Space Grotesk', -apple-system, sans-serif;
        color: #1a1a1a;
      }
      .r66b-exp *, .r66b-seamD *, .r66b-seamP *,
      .r66b-range *, .r66b-ladder *, .r66b-closeA * {
        box-sizing: border-box;
      }
      .r66b-mono {
        font-family: 'Share Tech Mono', monospace;
        letter-spacing: 0.2em;
      }
    `}</style>
  );
}

// ===========================================================================
// Opener (sticky left, image right)
// ===========================================================================
function OpenerSticky() {
  return (
    <section className="r66b-open-sticky">
      <div className="r66b-open-sticky__container">
        <div className="r66b-open-sticky__left">
          <span className="r66b-mono r66b-open-sticky__pre">THE R66 CASE · ARGUMENT LIST</span>
          <h2 className="r66b-open-sticky__h">
            <span className="r66b-text--dark">Nine reasons</span>{' '}
            <span className="r66b-text--mid">the R66 is</span>{' '}
            <span className="r66b-text--light">the one that gets flown.</span>
          </h2>
          <p className="r66b-open-sticky__lede">
            The R66 is the only light turbine that arrives with Robinson&apos;s
            ownership model attached. What follows are the arguments that
            actually move an owner from considering a turbine to flying one.
          </p>
          <div className="r66b-open-sticky__meta">
            <div className="r66b-open-sticky__meta-row">
              <span className="r66b-mono r66b-open-sticky__meta-l">ENGINE</span>
              <span className="r66b-open-sticky__meta-v">Rolls-Royce RR300</span>
            </div>
            <div className="r66b-open-sticky__meta-row">
              <span className="r66b-mono r66b-open-sticky__meta-l">CRUISE</span>
              <span className="r66b-open-sticky__meta-v">~125 kt</span>
            </div>
            <div className="r66b-open-sticky__meta-row">
              <span className="r66b-mono r66b-open-sticky__meta-l">TBO</span>
              <span className="r66b-open-sticky__meta-v">2,000 hrs</span>
            </div>
            <div className="r66b-open-sticky__meta-row">
              <span className="r66b-mono r66b-open-sticky__meta-l">FIRST CERT.</span>
              <span className="r66b-open-sticky__meta-v">2010</span>
            </div>
          </div>
        </div>
        <div className="r66b-open-sticky__right">
          <img
            src="/assets/images/new-aircraft/r66/rhc-r66-nxg-riviera-center-spotlight-vertical-format-14184-2.jpg"
            alt=""
            onError={(e) => { e.currentTarget.style.visibility = 'hidden'; }}
          />
        </div>
      </div>
      <style>{`
        .r66b-open-sticky {
          background: #faf9f6;
          padding: clamp(4rem, 8vw, 7rem) 0;
        }
        .r66b-open-sticky__container {
          max-width: 1360px;
          margin: 0 auto;
          padding: 0 clamp(1.25rem, 4vw, 2.5rem);
          display: grid;
          grid-template-columns: 1fr;
          gap: clamp(2.5rem, 6vw, 4.5rem);
        }
        @media (min-width: 960px) {
          .r66b-open-sticky__container {
            grid-template-columns: 1.05fr 1fr;
            align-items: start;
          }
        }
        .r66b-open-sticky__left { position: sticky; top: max(10vh, 110px); }
        .r66b-open-sticky__pre {
          display: block;
          font-size: 0.72rem;
          color: #4a4a4a;
          margin-bottom: 1.25rem;
        }
        .r66b-open-sticky__h {
          font-size: clamp(2rem, 4.5vw, 3.4rem);
          line-height: 1.08;
          letter-spacing: -0.015em;
          margin: 0 0 1.75rem;
          font-weight: 300;
        }
        .r66b-open-sticky__lede {
          font-size: 1.0625rem;
          line-height: 1.7;
          color: #4a4a4a;
          max-width: 48ch;
          margin: 0 0 2.5rem;
        }
        .r66b-open-sticky__meta {
          display: grid;
          max-width: 420px;
          border-top: 1px solid #e8e6e2;
        }
        .r66b-open-sticky__meta-row {
          display: grid;
          grid-template-columns: 140px 1fr;
          padding: 0.9rem 0;
          border-bottom: 1px solid #e8e6e2;
          align-items: baseline;
        }
        .r66b-open-sticky__meta-l { font-size: 0.7rem; color: #7a7a7a; }
        .r66b-open-sticky__meta-v { font-size: 0.95rem; font-weight: 500; }
        .r66b-open-sticky__right img {
          width: 100%;
          height: auto;
          display: block;
          aspect-ratio: 4 / 5;
          object-fit: cover;
          background: #ececec;
        }
      `}</style>
    </section>
  );
}

// ===========================================================================
// Explainer (paper, image + text, alternating sides)
// ===========================================================================
function ExplainerSplit({ argId, index, side = 'right', statHero = false }) {
  const arg = ARGUMENTS[argId];
  const imgMap = {
    1: 'rhc-r66-nxg-pv-right-side-full-shot-21825.jpg',
    2: 'rhc-r66-nxg-pv-left-side-wide-view-13611.jpg',
    3: 'rhc-r66-nxg-pv-engine-cowling-logo-13765.jpg',
    4: 'blue-r66-palo-verde-front-v4.png',
    5: 'rhc-r66-nxg-pv-left-side-and-engine-logo-med-cu-13776.jpg',
    6: 'rhc-r66-nxg-riviera-all-glass-cockpit-13338.jpg',
    7: 'rhc-r66-nxg-pv-left-side-wide-shot-from-rear-13751.jpg',
    8: 'rhc-r66-nxg-pv-aft-cabin-seats-13653.jpg',
    9: 'rhc-r66-nxg-pv-right-side-slight-angle-shot-21831.jpg',
  };
  const src = `/assets/images/new-aircraft/r66/${imgMap[argId]}`;
  return (
    <section className={`r66b-exp r66b-exp--${side}${statHero ? ' r66b-exp--hero' : ''}`}>
      <div className="r66b-exp__container">
        <div className="r66b-exp__text">
          <div className="r66b-exp__meta">
            <span className="r66b-mono r66b-exp__idx">
              {String(index).padStart(2, '0')} / 07
            </span>
          </div>
          <Headline parts={arg.parts} className="r66b-exp__h" />
          <p className="r66b-exp__p">{arg.body}</p>
          {arg.stat ? (
            <div className="r66b-exp__stat">
              <span className="r66b-mono r66b-exp__stat-l">{arg.stat.label}</span>
              <span className="r66b-exp__stat-v">
                {arg.stat.value}{arg.stat.unit ? <em>{' '}{arg.stat.unit}</em> : null}
              </span>
            </div>
          ) : null}
        </div>
        <div className="r66b-exp__img">
          <img src={src} alt="" onError={(e) => { e.currentTarget.style.visibility = 'hidden'; }} />
        </div>
      </div>
      <style>{`
        .r66b-exp {
          background: #faf9f6;
          padding: clamp(4rem, 7vw, 6rem) 0;
          border-top: 1px solid #e8e6e2;
        }
        .r66b-exp__container {
          max-width: 1360px;
          margin: 0 auto;
          padding: 0 clamp(1.25rem, 4vw, 2.5rem);
          display: grid;
          grid-template-columns: 1fr;
          gap: clamp(2rem, 5vw, 4rem);
          align-items: center;
        }
        @media (min-width: 960px) {
          .r66b-exp__container { grid-template-columns: 1fr 1fr; }
          .r66b-exp--left .r66b-exp__img   { order: 1; }
          .r66b-exp--left .r66b-exp__text  { order: 2; }
        }
        .r66b-exp__meta {
          display: flex;
          gap: 1.25rem;
          margin-bottom: 1.5rem;
          font-size: 0.7rem;
        }
        .r66b-exp__idx  { color: #1a1a1a; }
        .r66b-exp__code { color: #a67b3f; }
        .r66b-exp__h {
          font-size: clamp(1.8rem, 4vw, 2.8rem);
          line-height: 1.1;
          letter-spacing: -0.01em;
          margin: 0 0 1.5rem;
          font-weight: 300;
        }
        .r66b-exp--hero .r66b-exp__h { font-size: clamp(2.2rem, 5vw, 3.2rem); }
        .r66b-exp__p {
          font-size: 1.0625rem;
          line-height: 1.75;
          color: #4a4a4a;
          margin: 0 0 2rem;
          max-width: 52ch;
        }
        .r66b-exp__stat {
          display: inline-flex;
          flex-direction: column;
          gap: 0.4rem;
          padding-top: 1.25rem;
          border-top: 1px solid #e8e6e2;
          min-width: 220px;
        }
        .r66b-exp--hero .r66b-exp__stat { min-width: 320px; }
        .r66b-exp__stat-l { color: #a67b3f; font-size: 0.7rem; }
        .r66b-exp__stat-v {
          font-size: clamp(1.4rem, 2.6vw, 1.9rem);
          font-weight: 500;
          color: #1a1a1a;
        }
        .r66b-exp--hero .r66b-exp__stat-v {
          font-size: clamp(2.2rem, 4.5vw, 3rem);
        }
        .r66b-exp__stat-v em {
          font-style: normal;
          font-family: 'Share Tech Mono', monospace;
          font-size: 0.7em;
          color: #7a7a7a;
          letter-spacing: 0.18em;
        }
        .r66b-exp__img {
          width: 100%;
          aspect-ratio: 4 / 3;
          background: #ececec;
          overflow: hidden;
        }
        .r66b-exp__img img {
          width: 100%; height: 100%;
          object-fit: cover;
          display: block;
        }
      `}</style>
    </section>
  );
}

// ===========================================================================
// Dark seam band
// ===========================================================================
function SeamDark({ argId, index }) {
  const arg = ARGUMENTS[argId];
  return (
    <section className="r66b-seamD">
      <div className="r66b-seamD__container">
        <div className="r66b-seamD__text">
          <div className="r66b-seamD__meta">
            <span className="r66b-mono r66b-seamD__idx">
              {String(index).padStart(2, '0')} / 07
            </span>
            <span className="r66b-mono r66b-seamD__code">{arg.code}</span>
          </div>
          <Headline parts={arg.parts} className="r66b-seamD__h" inverted />
          <p className="r66b-seamD__p">{arg.body}</p>
          {arg.stat ? (
            <div className="r66b-seamD__stat">
              <span className="r66b-mono r66b-seamD__stat-l">{arg.stat.label}</span>
              <span className="r66b-seamD__stat-v">{arg.stat.value}</span>
            </div>
          ) : null}
        </div>
        <div className="r66b-seamD__img">
          <img
            src="/assets/images/new-aircraft/r66/rhc-r66-nxg-pv-left-side-and-engine-logo-med-cu-13776.jpg"
            alt=""
            onError={(e) => { e.currentTarget.style.visibility = 'hidden'; }}
          />
        </div>
      </div>
      <style>{`
        .r66b-seamD {
          background: linear-gradient(to right, #282828 50%, #1c1c1c 50%);
          color: #faf9f6;
          padding: clamp(5rem, 9vw, 8rem) 0;
        }
        .r66b-seamD__container {
          max-width: 1360px;
          margin: 0 auto;
          padding: 0 clamp(1.25rem, 4vw, 2.5rem);
          display: grid;
          grid-template-columns: 1fr;
          gap: clamp(2.5rem, 5vw, 4rem);
          align-items: center;
        }
        @media (min-width: 960px) {
          .r66b-seamD__container { grid-template-columns: 1fr 1fr; }
        }
        .r66b-seamD__meta {
          display: flex;
          gap: 1.25rem;
          margin-bottom: 1.5rem;
          font-size: 0.7rem;
        }
        .r66b-seamD__idx  { color: rgba(250,249,246,0.55); }
        .r66b-seamD__code { color: #a67b3f; }
        .r66b-seamD__h {
          font-size: clamp(2rem, 4.8vw, 3.4rem);
          line-height: 1.08;
          letter-spacing: -0.015em;
          margin: 0 0 1.75rem;
          font-weight: 300;
        }
        .r66b-seamD__p {
          font-size: 1.0625rem;
          line-height: 1.75;
          color: rgba(250,249,246,0.78);
          max-width: 52ch;
          margin: 0 0 2.5rem;
        }
        .r66b-seamD__stat {
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
          padding-top: 1.5rem;
          border-top: 1px solid rgba(250,249,246,0.15);
          max-width: 320px;
        }
        .r66b-seamD__stat-l { color: #a67b3f; font-size: 0.7rem; }
        .r66b-seamD__stat-v {
          font-size: clamp(1.5rem, 2.5vw, 1.85rem);
          font-weight: 500;
        }
        .r66b-seamD__img {
          width: 100%;
          aspect-ratio: 4 / 3;
          overflow: hidden;
          background: #111;
          box-shadow: 0 24px 60px rgba(0,0,0,0.4);
        }
        .r66b-seamD__img img {
          width: 100%; height: 100%; object-fit: cover; display: block;
        }
      `}</style>
    </section>
  );
}

// ===========================================================================
// Paper seam with featured figure
// ===========================================================================
function SeamPaperStat({ argId, index }) {
  const arg = ARGUMENTS[argId];
  return (
    <section className="r66b-seamP">
      <div className="r66b-seamP__container">
        <div className="r66b-seamP__text">
          <div className="r66b-seamP__meta">
            <span className="r66b-mono r66b-seamP__idx">
              {String(index).padStart(2, '0')} / 07
            </span>
            <span className="r66b-mono r66b-seamP__code">{arg.code}</span>
          </div>
          <Headline parts={arg.parts} className="r66b-seamP__h" />
          <p className="r66b-seamP__p">{arg.body}</p>
        </div>
        <div className="r66b-seamP__fig">
          <span className="r66b-mono r66b-seamP__fig-l">{arg.stat.label}</span>
          <div className="r66b-seamP__fig-v">
            <span>{arg.stat.value}</span>
            <em className="r66b-mono">{arg.stat.unit}</em>
          </div>
          <div className="r66b-seamP__fig-n">
            Published operating cost band. Jet-A fuel, scheduled inspections
            amortised across TBO, excluding insurance and hangarage.
          </div>
        </div>
      </div>
      <style>{`
        .r66b-seamP {
          background: linear-gradient(to right, #faf9f6 50%, #ececec 50%);
          padding: clamp(5rem, 9vw, 8rem) 0;
        }
        .r66b-seamP__container {
          max-width: 1360px;
          margin: 0 auto;
          padding: 0 clamp(1.25rem, 4vw, 2.5rem);
          display: grid;
          grid-template-columns: 1fr;
          gap: clamp(2rem, 5vw, 4rem);
          align-items: center;
        }
        @media (min-width: 960px) {
          .r66b-seamP__container { grid-template-columns: 1fr 1fr; }
        }
        .r66b-seamP__meta {
          display: flex;
          gap: 1.25rem;
          margin-bottom: 1.5rem;
          font-size: 0.7rem;
          color: #7a7a7a;
        }
        .r66b-seamP__idx  { color: #1a1a1a; }
        .r66b-seamP__code { color: #a67b3f; }
        .r66b-seamP__h {
          font-size: clamp(2rem, 4.5vw, 3.4rem);
          line-height: 1.08;
          letter-spacing: -0.015em;
          margin: 0 0 1.75rem;
          font-weight: 300;
        }
        .r66b-seamP__p {
          font-size: 1.0625rem;
          line-height: 1.75;
          color: #4a4a4a;
          max-width: 48ch;
          margin: 0;
        }
        .r66b-seamP__fig {
          padding: clamp(2rem, 4vw, 3rem);
          border: 1px solid #e8e6e2;
          background: #faf9f6;
          max-width: 460px;
        }
        .r66b-seamP__fig-l {
          display: block;
          font-size: 0.72rem;
          color: #a67b3f;
          margin-bottom: 1.25rem;
        }
        .r66b-seamP__fig-v {
          display: flex;
          align-items: baseline;
          gap: 0.5rem;
          margin-bottom: 1.5rem;
        }
        .r66b-seamP__fig-v span {
          font-size: clamp(3rem, 7vw, 5rem);
          font-weight: 500;
          color: #1a1a1a;
          letter-spacing: -0.02em;
          line-height: 1;
        }
        .r66b-seamP__fig-v em {
          font-style: normal;
          font-size: 0.95rem;
          color: #7a7a7a;
        }
        .r66b-seamP__fig-n {
          font-size: 0.9rem;
          line-height: 1.65;
          color: #6b6b6b;
          padding-top: 1.25rem;
          border-top: 1px solid #e8e6e2;
        }
      `}</style>
    </section>
  );
}

// ===========================================================================
// Range map (dark seam with SVG route)
// ===========================================================================
function RangeMap({ argId, index }) {
  const arg = ARGUMENTS[argId];
  const ref = useRef(null);
  const inView = useInView(ref);
  return (
    <section className="r66b-range" ref={ref}>
      <div className="r66b-range__container">
        <div className="r66b-range__grid">
          <div className="r66b-range__map">
            <svg viewBox="-310 -180 1240 1240" xmlns="http://www.w3.org/2000/svg"
              className={`r66b-range__svg${inView ? ' is-drawn' : ''}`}
              preserveAspectRatio="xMidYMid meet"
              aria-hidden="true">
              <defs>
                <radialGradient id="r66b-range-aux-glow" cx="50%" cy="50%" r="50%">
                  <stop offset="0%" stopColor="rgba(166,123,63,0.18)" />
                  <stop offset="70%" stopColor="rgba(166,123,63,0.04)" />
                  <stop offset="100%" stopColor="rgba(166,123,63,0)" />
                </radialGradient>
                <radialGradient id="r66b-range-std-glow" cx="50%" cy="50%" r="50%">
                  <stop offset="0%" stopColor="rgba(26,26,26,0.06)" />
                  <stop offset="70%" stopColor="rgba(26,26,26,0.02)" />
                  <stop offset="100%" stopColor="rgba(26,26,26,0)" />
                </radialGradient>
              </defs>

              {/* AUX range ring (with auxiliary tank) */}
              <circle
                cx={R66B_DENHAM.x} cy={R66B_DENHAM.y} r={R66B_R_AUX}
                fill="url(#r66b-range-aux-glow)"
                stroke="#a67b3f" strokeWidth="1.5" strokeDasharray="6 5"
                className="r66b-range__ring r66b-range__ring--aux" />

              {/* Standard range ring */}
              <circle
                cx={R66B_DENHAM.x} cy={R66B_DENHAM.y} r={R66B_R_STD}
                fill="url(#r66b-range-std-glow)"
                stroke="rgba(26,26,26,0.55)" strokeWidth="1.25" strokeDasharray="4 5"
                className="r66b-range__ring r66b-range__ring--std" />

              {/* UK outline — faint fill, subtle stroke */}
              <path d={R66B_UK_PATH}
                fill="rgba(26,26,26,0.06)"
                stroke="rgba(26,26,26,0.45)" strokeWidth="1.2" />

              {/* Denham origin */}
              <circle cx={R66B_DENHAM.x} cy={R66B_DENHAM.y} r="6" fill="#1a1a1a" />
              <circle cx={R66B_DENHAM.x} cy={R66B_DENHAM.y} r="12"
                fill="none" stroke="#1a1a1a" strokeOpacity="0.35" strokeWidth="1" />
              <text x={R66B_DENHAM.x + 14} y={R66B_DENHAM.y + 4}
                fill="rgba(26,26,26,0.8)"
                fontFamily="Share Tech Mono, monospace" fontSize="13" letterSpacing="2">
                EGLD · DENHAM
              </text>

              {/* Range ring labels — positioned on the top arc of each ring */}
              <text x={R66B_DENHAM.x} y={R66B_DENHAM.y - R66B_R_STD - 10}
                fill="rgba(26,26,26,0.7)"
                fontFamily="Share Tech Mono, monospace" fontSize="16" letterSpacing="3"
                textAnchor="middle">
                STD · 350 NM
              </text>
              <text x={R66B_DENHAM.x} y={R66B_DENHAM.y - R66B_R_AUX - 10}
                fill="#a67b3f"
                fontFamily="Share Tech Mono, monospace" fontSize="16" letterSpacing="3"
                textAnchor="middle">
                AUX · 550 NM
              </text>
            </svg>
            <p className="r66b-range__note">
              * Assuming 120 kts cruise and no wind.
            </p>
          </div>
          <div className="r66b-range__text">
            <div className="r66b-range__meta">
              <span className="r66b-mono r66b-range__idx">
                {String(index).padStart(2, '0')} / 07
              </span>
              <span className="r66b-mono r66b-range__code">{arg.code}</span>
            </div>
            <Headline parts={arg.parts} className="r66b-range__h" />
            <p className="r66b-range__p">{arg.body}</p>
            <div className="r66b-range__stats">
              <div className="r66b-range__stat">
                <span className="r66b-mono r66b-range__stat-l">STD RANGE</span>
                <span className="r66b-range__stat-v">~350 NM</span>
              </div>
              <div className="r66b-range__stat">
                <span className="r66b-mono r66b-range__stat-l">AUX TANK</span>
                <span className="r66b-range__stat-v">+43.5 GAL</span>
              </div>
              <div className="r66b-range__stat r66b-range__stat--hero">
                <span className="r66b-mono r66b-range__stat-l">TOTAL RANGE</span>
                <span className="r66b-range__stat-v">~550 NM</span>
              </div>
              <div className="r66b-range__stat">
                <span className="r66b-mono r66b-range__stat-l">ENDURANCE</span>
                <span className="r66b-range__stat-v">~5 HRS</span>
              </div>
            </div>
          </div>
        </div>
      </div>
      <style>{`
        .r66b-range {
          background: linear-gradient(to right, #faf9f6 50%, #ececec 50%);
          color: #1a1a1a;
          padding: clamp(5rem, 9vw, 8rem) 0;
        }
        .r66b-range__container {
          max-width: 1360px;
          margin: 0 auto;
          padding: 0 clamp(1.25rem, 4vw, 2.5rem);
        }
        .r66b-range__meta {
          display: flex;
          gap: 1.25rem;
          margin-bottom: 1.5rem;
          font-size: 0.7rem;
        }
        .r66b-range__idx  { color: #1a1a1a; }
        .r66b-range__code { color: #a67b3f; }
        .r66b-range__h {
          font-size: clamp(2rem, 4.5vw, 3.3rem);
          line-height: 1.08;
          letter-spacing: -0.015em;
          margin: 0 0 3rem;
          font-weight: 300;
          max-width: 22ch;
        }
        .r66b-range__grid {
          display: grid;
          grid-template-columns: 1fr;
          gap: clamp(2rem, 5vw, 4rem);
          align-items: start;
        }
        @media (min-width: 960px) {
          .r66b-range__grid { grid-template-columns: 1fr 1fr; }
        }
        /* Right-column order: meta → title → copy → stats, aligned from the
           top so the headline lands above the paragraph exactly. */
        .r66b-range__text {
          display: flex;
          flex-direction: column;
          position: relative;
          z-index: 2;
        }
        /* Pseudo-panel layered above the map so range circles can't bleed into
           the right column. Extends left past the grid gap to cover the seam. */
        @media (min-width: 960px) {
          .r66b-range__text::before {
            content: '';
            position: absolute;
            top: 0;
            bottom: 0;
            right: 0;
            left: calc(-1 * clamp(3rem, 8vw, 6rem));
            background: #ececec;
            z-index: -1;
          }
        }
        .r66b-range__text .r66b-range__meta {
          margin-top: 0;
        }
        .r66b-range__map {
          width: 100%;
          padding: clamp(1rem, 2vw, 1.5rem);
          display: flex;
          flex-direction: column;
          gap: 0.75rem;
          position: relative;
          z-index: 1;
        }
        .r66b-range__svg {
          width: 100%;
          aspect-ratio: 1 / 1;
          display: block;
        }
        /* Range rings fade in as the section enters view. Rendered by default
           so they stay visible even if IntersectionObserver hasn't fired (the
           section is taller than the 25% threshold of its ref). */
        .r66b-range__ring {
          opacity: 0.55;
          transition: opacity 1.1s ease-out;
        }
        .r66b-range__svg.is-drawn .r66b-range__ring { opacity: 1; }
        .r66b-range__svg.is-drawn .r66b-range__ring--aux {
          transition-delay: 0.15s;
        }
        .r66b-range__note {
          font-family: 'Share Tech Mono', monospace;
          font-size: 0.72rem;
          letter-spacing: 0.12em;
          color: rgba(26,26,26,0.55);
          margin: 0;
          text-align: right;
        }
        .r66b-range__p {
          font-size: 1.0625rem;
          line-height: 1.75;
          color: #4a4a4a;
          margin: 0 0 2rem;
          max-width: 42ch;
        }
        .r66b-range__stats {
          display: grid;
          grid-template-columns: 1fr 1fr;
          border-top: 1px solid #e8e6e2;
        }
        .r66b-range__stat {
          display: flex;
          flex-direction: column;
          gap: 0.35rem;
          padding: 1rem 0;
          border-bottom: 1px solid #e8e6e2;
        }
        .r66b-range__stat--hero .r66b-range__stat-v { color: #a67b3f; }
        .r66b-range__stat-l {
          font-size: 0.65rem;
          color: #a67b3f;
        }
        .r66b-range__stat-v {
          font-size: 1.25rem;
          font-weight: 500;
        }
      `}</style>
    </section>
  );
}

// ===========================================================================
// Robinson ladder (R22 / R44 / R66 cards, R66 active)
// ===========================================================================
function RobinsonLadder({ argId, index }) {
  const arg = ARGUMENTS[argId];
  const rungs = [
    { code: 'R22', name: 'The trainer', prose: 'Two seats. Piston. Where every Robinson pilot starts.', spec: 'O-320 · 2 SEATS' },
    { code: 'R44', name: 'The owner',   prose: 'Four seats. Piston. The best-selling civil helicopter in the world.', spec: 'IO-540 · 4 SEATS' },
    { code: 'R66', name: 'The turbine', prose: 'Five seats. Rolls-Royce. The step up without leaving the factory.', spec: 'RR300 · 5 SEATS', active: true },
  ];
  return (
    <section className="r66b-ladder">
      <div className="r66b-ladder__container">
        <div className="r66b-ladder__head">
          <div className="r66b-ladder__meta">
            <span className="r66b-mono r66b-ladder__idx">
              {String(index).padStart(2, '0')} / 07
            </span>
            <span className="r66b-mono r66b-ladder__code">{arg.code}</span>
          </div>
          <Headline parts={arg.parts} className="r66b-ladder__h" />
          <p className="r66b-ladder__p">{arg.body}</p>
        </div>
        <div className="r66b-ladder__grid">
          {rungs.map((r) => (
            <div key={r.code} className={`r66b-ladder__card${r.active ? ' is-active' : ''}`}>
              <div className="r66b-ladder__card-head">
                <span className="r66b-mono r66b-ladder__card-code">{r.code}</span>
                {r.active ? (
                  <span className="r66b-mono r66b-ladder__card-flag">YOU ARE HERE</span>
                ) : null}
              </div>
              <h3 className="r66b-ladder__card-name">{r.name}</h3>
              <p className="r66b-ladder__card-p">{r.prose}</p>
              <span className="r66b-mono r66b-ladder__card-spec">{r.spec}</span>
            </div>
          ))}
        </div>
      </div>
      <style>{`
        .r66b-ladder {
          background: #faf9f6;
          padding: clamp(5rem, 9vw, 7rem) 0;
          border-top: 1px solid #e8e6e2;
        }
        .r66b-ladder__container {
          max-width: 1360px;
          margin: 0 auto;
          padding: 0 clamp(1.25rem, 4vw, 2.5rem);
        }
        .r66b-ladder__meta {
          display: flex;
          gap: 1.25rem;
          margin-bottom: 1.5rem;
          font-size: 0.7rem;
          color: #7a7a7a;
        }
        .r66b-ladder__idx  { color: #1a1a1a; }
        .r66b-ladder__code { color: #a67b3f; }
        .r66b-ladder__h {
          font-size: clamp(2rem, 4.5vw, 3.2rem);
          line-height: 1.08;
          letter-spacing: -0.015em;
          margin: 0 0 1.5rem;
          font-weight: 300;
          max-width: 22ch;
        }
        .r66b-ladder__p {
          font-size: 1.0625rem;
          line-height: 1.75;
          color: #4a4a4a;
          max-width: 58ch;
          margin: 0 0 3rem;
        }
        .r66b-ladder__grid {
          display: grid;
          grid-template-columns: 1fr;
          border-top: 1px solid #e8e6e2;
        }
        @media (min-width: 760px) {
          .r66b-ladder__grid {
            grid-template-columns: repeat(3, 1fr);
            border-top: none;
          }
        }
        .r66b-ladder__card {
          padding: clamp(1.75rem, 3vw, 2.5rem);
          border-bottom: 1px solid #e8e6e2;
          background: #faf9f6;
          display: flex;
          flex-direction: column;
          gap: 1rem;
        }
        @media (min-width: 760px) {
          .r66b-ladder__card {
            border-bottom: none;
            border-top: 1px solid #e8e6e2;
            border-right: 1px solid #e8e6e2;
          }
          .r66b-ladder__card:last-child { border-right: none; }
        }
        .r66b-ladder__card.is-active {
          background: #1a1a1a;
          color: #faf9f6;
        }
        .r66b-ladder__card-head {
          display: flex;
          justify-content: space-between;
          align-items: baseline;
          font-size: 0.7rem;
        }
        .r66b-ladder__card-code { font-size: 0.85rem; color: #7a7a7a; }
        .r66b-ladder__card.is-active .r66b-ladder__card-code { color: #a67b3f; }
        .r66b-ladder__card-flag { color: #a67b3f; }
        .r66b-ladder__card-name {
          font-size: clamp(1.5rem, 2.5vw, 1.9rem);
          font-weight: 400;
          letter-spacing: -0.01em;
          margin: 0.5rem 0 0;
        }
        .r66b-ladder__card-p {
          font-size: 0.98rem;
          line-height: 1.65;
          color: #4a4a4a;
          margin: 0;
        }
        .r66b-ladder__card.is-active .r66b-ladder__card-p {
          color: rgba(250,249,246,0.75);
        }
        .r66b-ladder__card-spec {
          margin-top: auto;
          padding-top: 1rem;
          border-top: 1px solid #e8e6e2;
          font-size: 0.7rem;
          color: #7a7a7a;
        }
        .r66b-ladder__card.is-active .r66b-ladder__card-spec {
          border-top-color: rgba(250,249,246,0.15);
          color: rgba(250,249,246,0.6);
        }
      `}</style>
    </section>
  );
}

// ===========================================================================
// Closing argument — dark band, no CTA buttons (R66CTA handles conversion).
// ===========================================================================
function ClosingArgument({ argId, index }) {
  const arg = ARGUMENTS[argId];
  return (
    <section className="r66b-closeA">
      <div className="r66b-closeA__container">
        <div className="r66b-closeA__text">
          <div className="r66b-closeA__meta">
            <span className="r66b-mono r66b-closeA__idx">
              {String(index).padStart(2, '0')} / 07
            </span>
            <span className="r66b-mono r66b-closeA__code">{arg.code}</span>
          </div>
          <Headline parts={arg.parts} className="r66b-closeA__h" inverted />
          <p className="r66b-closeA__p">{arg.body}</p>
        </div>
        <div className="r66b-closeA__fig">
          <span className="r66b-mono r66b-closeA__fig-l">{arg.stat.label}</span>
          <div className="r66b-closeA__fig-v">
            <span>{arg.stat.value}</span>
            {arg.stat.unit ? <em className="r66b-mono">{arg.stat.unit}</em> : null}
          </div>
          <div className="r66b-closeA__meta-row">
            <span className="r66b-mono r66b-closeA__meta-l">DEALER</span>
            <span className="r66b-closeA__meta-v">HQ Aviation · Denham</span>
          </div>
          <div className="r66b-closeA__meta-row">
            <span className="r66b-mono r66b-closeA__meta-l">FACTORY</span>
            <span className="r66b-closeA__meta-v">Robinson · Torrance, CA</span>
          </div>
        </div>
      </div>
      <style>{`
        .r66b-closeA {
          background: #1a1a1a;
          color: #faf9f6;
          padding: clamp(5rem, 9vw, 8rem) 0;
        }
        .r66b-closeA__container {
          max-width: 1360px;
          margin: 0 auto;
          padding: 0 clamp(1.25rem, 4vw, 2.5rem);
          display: grid;
          grid-template-columns: 1fr;
          gap: clamp(2.5rem, 5vw, 4rem);
          align-items: center;
        }
        @media (min-width: 960px) {
          .r66b-closeA__container { grid-template-columns: 1.2fr 1fr; }
        }
        .r66b-closeA__meta {
          display: flex;
          gap: 1.25rem;
          margin-bottom: 1.5rem;
          font-size: 0.7rem;
        }
        .r66b-closeA__idx  { color: rgba(250,249,246,0.55); }
        .r66b-closeA__code { color: #a67b3f; }
        .r66b-closeA__h {
          font-size: clamp(2rem, 4.5vw, 3.3rem);
          line-height: 1.08;
          letter-spacing: -0.015em;
          margin: 0 0 1.5rem;
          font-weight: 300;
          max-width: 22ch;
        }
        .r66b-closeA__p {
          font-size: 1.0625rem;
          line-height: 1.75;
          color: rgba(250,249,246,0.78);
          max-width: 52ch;
          margin: 0;
        }
        .r66b-closeA__fig {
          padding: clamp(1.75rem, 3vw, 2.5rem);
          border: 1px solid rgba(250,249,246,0.15);
        }
        .r66b-closeA__fig-l {
          display: block;
          font-size: 0.72rem;
          color: #a67b3f;
          margin-bottom: 1.25rem;
        }
        .r66b-closeA__fig-v {
          display: flex;
          align-items: baseline;
          gap: 0.5rem;
          margin-bottom: 1.5rem;
        }
        .r66b-closeA__fig-v span {
          font-size: clamp(2.8rem, 6vw, 4rem);
          font-weight: 500;
          color: #faf9f6;
          letter-spacing: -0.02em;
          line-height: 1;
        }
        .r66b-closeA__fig-v em {
          font-style: normal;
          font-size: 0.9rem;
          color: rgba(250,249,246,0.55);
        }
        .r66b-closeA__meta-row {
          display: grid;
          grid-template-columns: 100px 1fr;
          padding: 0.9rem 0;
          border-bottom: 1px solid rgba(250,249,246,0.12);
          align-items: baseline;
        }
        .r66b-closeA__meta-row:first-of-type {
          border-top: 1px solid rgba(250,249,246,0.12);
          margin-top: 1.25rem;
        }
        .r66b-closeA__meta-l {
          font-size: 0.7rem;
          color: rgba(250,249,246,0.5);
        }
        .r66b-closeA__meta-v {
          font-size: 0.95rem;
          color: #faf9f6;
          font-weight: 500;
        }
      `}</style>
    </section>
  );
}

// ===========================================================================
// Composition — "Chaptered Flow": opener → argued body → ladder → closer.
// ===========================================================================
export default function R66Case() {
  // Render sections as a fragment so AircraftR66 can wrap them together with
  // R66Gallery + R66CTA in a single sticky-stack containing block.
  return (
    <>
      <GlobalTokens />
      <ExplainerSplit argId={3} index={1} side="right" />
      <ExplainerSplit argId={6} index={2} side="left" />
      <ExplainerSplit argId={7} index={3} side="right" statHero />
      <ExplainerSplit argId={8} index={4} side="left" />
      <RangeMap        argId={9} index={5} />
      <SeamPaperStat   argId={1} index={6} />
      <ClosingArgument argId={4} index={7} />
    </>
  );
}

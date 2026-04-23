// R66 Benefits — ten brand-native variants.
// Each variant composes the nine agreed R66 ownership arguments using only the
// visual vocabulary audited from /aircraft/r44, /aircraft/r66, /aircraft/r88,
// /discovery-flight and /ppl (Space Grotesk + Share Tech Mono, the real
// palette, center-seam device, multi-weight headline spans, mono eyebrows,
// hairline rules). No new aesthetic is introduced — variants differ only in
// which existing archetypes they use and how they're arranged.
//
// View at /r66-benefits-variations. Once one variant is chosen, lift it
// straight into AircraftR66.jsx.

import { useEffect, useMemo, useRef, useState } from 'react';

// ===========================================================================
// 1. Shared data — the nine approved arguments
// ===========================================================================
const ARGUMENTS = {
  1: {
    code: 'OWN-01', group: 'Ownership',
    parts: [
      { t: 'A turbine',           w: 'dark' },
      { t: 'you can actually',    w: 'mid' },
      { t: 'afford to fly.',      w: 'light' },
    ],
    short: 'Per-hour maths that works',
    body:
      'Operators put real hours on R66s because the per-hour maths works. ' +
      'Jet-A burn, Robinson-priced inspections and a TBO that arrives on ' +
      'schedule, not before.',
    stat: { label: 'DIRECT OPERATING COST', value: '~£400–£500', unit: '/ hr' },
    counter: { value: 450, prefix: '£', suffix: '/hr', label: 'OPERATING COST' },
  },
  2: {
    code: 'OWN-02', group: 'Ownership',
    parts: [
      { t: 'The top of',          w: 'dark' },
      { t: 'the Robinson',        w: 'mid' },
      { t: 'ladder.',             w: 'light' },
    ],
    short: 'Graduate from R22 / R44',
    body:
      'Pilots graduate into the R66 from the R22 and R44 without leaving the ' +
      'manufacturer that taught them. Same philosophy, same factory, same ' +
      'discipline — turbine performance added on top.',
    stat: { label: 'POSITION IN RANGE', value: 'Flagship' },
    counter: { value: 3, prefix: '', suffix: 'rd rung', label: 'IN THE ROBINSON RANGE' },
  },
  3: {
    code: 'ENG-01', group: 'Engine',
    parts: [
      { t: 'A powerplant',        w: 'dark' },
      { t: 'that asks less of',   w: 'mid' },
      { t: 'the pilot.',          w: 'light' },
    ],
    short: 'Single-lever power',
    body:
      'Single-lever power. No mixture, no carb heat, no shock cooling to ' +
      'avoid. Start the RR300 with a switch and spend the workload on the ' +
      'flight, not on managing the engine.',
    stat: { label: 'POWER LEVERS', value: '1' },
    counter: { value: 1, prefix: '', suffix: ' lever', label: 'POWER CONTROL' },
  },
  4: {
    code: 'OWN-03', group: 'Ownership',
    parts: [
      { t: 'Robinson discipline,', w: 'dark' },
      { t: 'turbine',              w: 'mid' },
      { t: 'performance.',         w: 'light' },
    ],
    short: 'Published schedules, open notices',
    body:
      'Published overhaul schedules. Open safety notices. Component life ' +
      'limits you can plan around. The ownership model Robinson built its ' +
      'reputation on, applied to a turbine.',
    stat: { label: 'TBO', value: '2,000', unit: 'HRS' },
    counter: { value: 2000, prefix: '', suffix: ' hrs', label: 'TBO' },
  },
  5: {
    code: 'ENG-02', group: 'Engine',
    parts: [
      { t: 'A Rolls-Royce',       w: 'dark' },
      { t: 'in the back.',        w: 'mid' },
      { t: 'Flat-rated on purpose.', w: 'light' },
    ],
    short: 'Rolls-Royce RR300, flat-rated',
    body:
      'The RR300 produces more power than the airframe uses. Robinson caps ' +
      'it deliberately so it delivers the same takeoff figures at 6,000 ft ' +
      'density altitude as it does at sea level. Hot-and-high stops being ' +
      'an asterisk.',
    stat: { label: 'CORE ENGINE', value: 'Rolls-Royce RR300' },
    counter: { value: 6000, prefix: '', suffix: ' ft', label: 'FLAT-RATED TO' },
  },
  6: {
    code: 'ENG-03', group: 'Engine',
    parts: [
      { t: 'The simplest',        w: 'dark' },
      { t: 'turbine cockpit',     w: 'mid' },
      { t: 'in production.',      w: 'light' },
    ],
    short: 'Garmin G500H TXi factory',
    body:
      'Garmin G500H TXi, digital engine monitoring, TAWS, ADS-B — all ' +
      'factory, all integrated. None of the retrofit patchwork the used-' +
      'turbine market is built on.',
    stat: { label: 'AVIONICS', value: 'Factory G500H TXi' },
    counter: { value: 100, prefix: '', suffix: '% factory', label: 'AVIONICS INTEGRATION' },
  },
  7: {
    code: 'AIR-01', group: 'Aircraft',
    parts: [
      { t: 'A cargo hold',        w: 'dark' },
      { t: 'that',                w: 'mid' },
      { t: 'locks.',              w: 'light' },
    ],
    short: '300 lb locking baggage hold',
    body:
      'Three hundred pounds of secure baggage, loaded from outside the ' +
      'cabin. Rifle cases, camera rigs, overnight bags — they ride in the ' +
      'aircraft, not on pilot laps.',
    stat: { label: 'CARGO CAPACITY', value: '300', unit: 'LB' },
    counter: { value: 300, prefix: '', suffix: ' lb', label: 'CARGO CAPACITY' },
  },
  8: {
    code: 'AIR-02', group: 'Aircraft',
    parts: [
      { t: 'Five seats',          w: 'dark' },
      { t: 'that mean',           w: 'mid' },
      { t: 'five adults.',        w: 'light' },
    ],
    short: 'Five full-size seats',
    body:
      'Not four plus a child. Not four plus luggage. Five full-size seats, ' +
      'forward-facing, with shoulder room that matches the passenger ' +
      'weights on the load sheet.',
    stat: { label: 'USEFUL LOAD', value: '~1,157', unit: 'LB' },
    counter: { value: 5, prefix: '', suffix: ' seats', label: 'OCCUPANTS' },
  },
  9: {
    code: 'AIR-03', group: 'Aircraft',
    parts: [
      { t: 'An auxiliary tank',   w: 'dark' },
      { t: 'makes it',            w: 'mid' },
      { t: 'a transport.',        w: 'light' },
    ],
    short: 'Aux tank, ~550 NM range',
    body:
      'The 43.5-gallon auxiliary tank extends range to roughly 550 nautical ' +
      'miles and endurance past five hours. London to the Highlands, the ' +
      'Alps, or the South of France — single tank, single leg.',
    stat: { label: 'RANGE (w/ AUX)', value: '~550', unit: 'NM' },
    counter: { value: 550, prefix: '~', suffix: ' nm', label: 'RANGE WITH AUX' },
  },
};
const IDS = [1,2,3,4,5,6,7,8,9];

// ===========================================================================
// 2. Shared primitives
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

function AnimatedNumber({ target, duration = 1800, inView }) {
  const [n, setN] = useState(0);
  useEffect(() => {
    if (!inView) return undefined;
    const start = performance.now();
    let raf;
    const tick = (now) => {
      const p = Math.min(1, (now - start) / duration);
      const eased = 1 - Math.pow(1 - p, 3);
      setN(Math.round(target * eased));
      if (p < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [target, duration, inView]);
  return <>{n.toLocaleString()}</>;
}

// ===========================================================================
// 3. Shared global tokens CSS — multi-weight spans (light + dark variants)
// ===========================================================================
function GlobalTokens() {
  return (
    <style>{`
      .r66b-text--dark  { color: #1a1a1a; font-weight: 500; }
      .r66b-text--mid   { color: #4a4a4a; font-weight: 300; }
      .r66b-text--light { color: #7a7a7a; font-weight: 300; }
      .r66b-inv-text--dark  { color: #faf9f6; font-weight: 500; }
      .r66b-inv-text--mid   { color: rgba(250,249,246,0.75); font-weight: 300; }
      .r66b-inv-text--light { color: rgba(250,249,246,0.5);  font-weight: 300; }
      .r66b * { box-sizing: border-box; }
      .r66b {
        font-family: 'Space Grotesk', -apple-system, sans-serif;
        color: #1a1a1a;
      }
      .r66b-mono {
        font-family: 'Share Tech Mono', monospace;
        letter-spacing: 0.2em;
      }
    `}</style>
  );
}

// ===========================================================================
// Variant A — CHAPTERED FLOW
// Sticky opener → explainers + seam bands interleaved → ladder → CTA close.
// The "cinematic descending narrative" pattern.
// ===========================================================================
function VariantA() {
  return (
    <div className="r66b r66b-A">
      <OpenerSticky />
      <ExplainerSplit argId={3} index={1} side="right" />
      <SeamDark argId={5} index={2} />
      <ExplainerSplit argId={6} index={3} side="left" />
      <ExplainerSplit argId={7} index={4} side="right" statHero />
      <ExplainerSplit argId={8} index={5} side="left" />
      <RangeMap argId={9} index={6} />
      <SeamPaperStat argId={1} index={7} />
      <RobinsonLadder argId={2} index={8} />
      <ClosingCTA argId={4} index={9} />
    </div>
  );
}

// ===========================================================================
// Variant B — THREE ACTS
// Paper opener → three dark chapter headers (Engine / Aircraft / Ownership),
// each introducing its three paper explainers. Closing CTA.
// ===========================================================================
function VariantB() {
  const engine    = [3, 5, 6];
  const aircraft  = [7, 8, 9];
  const ownership = [1, 2, 4];
  return (
    <div className="r66b r66b-B">
      <OpenerSimple
        preText="THE R66 CASE · THREE ACTS"
        parts={[
          { t: 'Nine arguments,',  w: 'dark' },
          { t: 'three movements —', w: 'mid' },
          { t: 'engine, aircraft, ownership.', w: 'light' },
        ]}
        lede="Each movement opens with why it exists, then three arguments that make it real. Read the whole thing, or jump to the movement that answers your question."
      />

      <ChapterHeader numeral="I" title="THE ENGINE" subtitle="Why the RR300 changes what single-engine means." />
      {engine.map((id, i) => (
        <ExplainerSplit key={id} argId={id} index={i + 1} side={i % 2 === 0 ? 'right' : 'left'} />
      ))}

      <ChapterHeader numeral="II" title="THE AIRCRAFT" subtitle="What five seats and a cargo door unlock." />
      {aircraft.map((id, i) => (
        <ExplainerSplit key={id} argId={id} index={i + 4} side={i % 2 === 0 ? 'right' : 'left'} />
      ))}

      <ChapterHeader numeral="III" title="THE OWNERSHIP" subtitle="What actually makes it the one that gets flown." />
      {ownership.map((id, i) => (
        <ExplainerSplit key={id} argId={id} index={i + 7} side={i % 2 === 0 ? 'right' : 'left'} statHero={id === 1} />
      ))}

      <ClosingCTA argId={4} index={9} hidePreText />
    </div>
  );
}

// ===========================================================================
// Variant C — CAROUSEL CENTREPIECE
// Opener → one dark __expedition carousel cycling through all 9 arguments
// → paper CTA close.
// ===========================================================================
function VariantC() {
  const [i, setI] = useState(0);
  const id = IDS[i];
  const arg = ARGUMENTS[id];
  const prev = () => setI((i + IDS.length - 1) % IDS.length);
  const next = () => setI((i + 1) % IDS.length);
  return (
    <div className="r66b r66b-C">
      <OpenerSimple
        preText="THE R66 CASE · NINE ARGUMENTS, ONE AT A TIME"
        parts={[
          { t: 'The case,',  w: 'dark' },
          { t: 'delivered one',   w: 'mid' },
          { t: 'argument at a time.', w: 'light' },
        ]}
        lede="Work through all nine or skip to the one that concerns your operation. Dark, single-focus — the way the R44 Expedition section handles long-form content."
      />

      <section className="r66b-C-stage">
        <div className="r66b-C-stage__container">
          <div className="r66b-C-stage__header">
            <span className="r66b-mono r66b-C-stage__counter">
              {String(i + 1).padStart(2, '0')} / {String(IDS.length).padStart(2, '0')}
            </span>
            <span className="r66b-mono r66b-C-stage__code">{arg.code}</span>
          </div>

          <Headline
            parts={arg.parts}
            className="r66b-C-stage__headline"
            inverted
          />

          <p className="r66b-C-stage__body">{arg.body}</p>

          {arg.stat ? (
            <div className="r66b-C-stage__stat">
              <span className="r66b-mono r66b-C-stage__stat-label">{arg.stat.label}</span>
              <span className="r66b-C-stage__stat-value">
                {arg.stat.value}
                {arg.stat.unit ? <em>{' '}{arg.stat.unit}</em> : null}
              </span>
            </div>
          ) : null}

          <div className="r66b-C-stage__nav">
            <button type="button" className="r66b-C-stage__chev" onClick={prev} aria-label="Previous">‹</button>
            <div className="r66b-C-stage__dots">
              {IDS.map((_, j) => (
                <button
                  key={j}
                  type="button"
                  className={`r66b-C-stage__dot${j === i ? ' is-active' : ''}`}
                  onClick={() => setI(j)}
                  aria-label={`Argument ${j + 1}`}
                />
              ))}
            </div>
            <button type="button" className="r66b-C-stage__chev" onClick={next} aria-label="Next">›</button>
          </div>
        </div>

        <style>{`
          .r66b-C-stage {
            background: linear-gradient(to right, #282828 50%, #1c1c1c 50%);
            color: #faf9f6;
            padding: clamp(5rem, 9vw, 8rem) 0;
          }
          .r66b-C-stage__container {
            max-width: 1020px;
            margin: 0 auto;
            padding: 0 clamp(1.25rem, 4vw, 2.5rem);
          }
          .r66b-C-stage__header {
            display: flex;
            gap: 1.25rem;
            margin-bottom: 2rem;
            font-size: 0.72rem;
          }
          .r66b-C-stage__counter { color: rgba(250,249,246,0.55); }
          .r66b-C-stage__code    { color: #a67b3f; }
          .r66b-C-stage__headline {
            font-size: clamp(2.2rem, 5vw, 3.6rem);
            line-height: 1.08;
            letter-spacing: -0.015em;
            font-weight: 300;
            margin: 0 0 2rem;
            min-height: 3em;
          }
          .r66b-C-stage__body {
            font-size: 1.1rem;
            line-height: 1.75;
            color: rgba(250,249,246,0.78);
            max-width: 52ch;
            margin: 0 0 2.5rem;
            min-height: 5em;
          }
          .r66b-C-stage__stat {
            display: flex;
            flex-direction: column;
            gap: 0.4rem;
            padding-top: 1.25rem;
            border-top: 1px solid rgba(250,249,246,0.15);
            max-width: 360px;
            margin-bottom: 2.5rem;
          }
          .r66b-C-stage__stat-label {
            font-size: 0.7rem;
            color: #a67b3f;
          }
          .r66b-C-stage__stat-value {
            font-size: clamp(1.4rem, 2.5vw, 1.8rem);
            font-weight: 500;
          }
          .r66b-C-stage__stat-value em {
            font-style: normal;
            font-family: 'Share Tech Mono', monospace;
            font-size: 0.7em;
            color: rgba(250,249,246,0.5);
            letter-spacing: 0.18em;
            margin-left: 0.25rem;
          }
          .r66b-C-stage__nav {
            display: flex;
            align-items: center;
            gap: 1.5rem;
            padding-top: 1.5rem;
            border-top: 1px solid rgba(250,249,246,0.12);
          }
          .r66b-C-stage__chev {
            width: 48px;
            height: 48px;
            border-radius: 50%;
            background: rgba(255,255,255,0.08);
            backdrop-filter: blur(8px);
            color: #faf9f6;
            border: 1px solid rgba(250,249,246,0.18);
            font-size: 1.25rem;
            cursor: pointer;
            transition: all 0.2s ease;
          }
          .r66b-C-stage__chev:hover {
            background: rgba(166,123,63,0.2);
            border-color: #a67b3f;
          }
          .r66b-C-stage__dots {
            display: flex;
            gap: 0.6rem;
          }
          .r66b-C-stage__dot {
            width: 8px; height: 8px; border-radius: 50%;
            border: 0;
            background: rgba(250,249,246,0.25);
            cursor: pointer;
            padding: 0;
            transition: background 0.2s;
          }
          .r66b-C-stage__dot.is-active { background: #a67b3f; }
        `}</style>
      </section>

      <ClosingCTA argId={4} index={9} />
    </div>
  );
}

// ===========================================================================
// Variant D — DOSSIER / DENSE DATA TABLE
// Paper opener → specs-table-style data grid listing all 9 → three featured
// seam bands (args 5, 9, 1 — the wow moments) → CTA.
// ===========================================================================
function VariantD() {
  return (
    <div className="r66b r66b-D">
      <OpenerSimple
        preText="CLASSIFIED · R66 CASE FILE"
        parts={[
          { t: 'The full',           w: 'dark' },
          { t: 'case file,',         w: 'mid' },
          { t: 'line by line.',      w: 'light' },
        ]}
        lede="Every argument catalogued before any of them is expanded. Operators who want to scan before they read start here."
      />

      <section className="r66b-D-table-sec">
        <div className="r66b-D-table-sec__container">
          <div className="r66b-D-table-sec__head">
            <span className="r66b-mono r66b-D-table-sec__head-code">CODE</span>
            <span className="r66b-mono r66b-D-table-sec__head-title">ARGUMENT</span>
            <span className="r66b-mono r66b-D-table-sec__head-stat">FIGURE</span>
          </div>
          {IDS.map((id, i) => {
            const a = ARGUMENTS[id];
            return (
              <div key={id} className="r66b-D-row">
                <span className="r66b-mono r66b-D-row__idx">{String(i + 1).padStart(2, '0')}</span>
                <span className="r66b-mono r66b-D-row__code">{a.code}</span>
                <div className="r66b-D-row__body">
                  <span className="r66b-D-row__short">{a.short}</span>
                  <span className="r66b-D-row__prose">{a.body}</span>
                </div>
                <span className="r66b-D-row__stat">
                  <span className="r66b-D-row__stat-val">{a.stat.value}</span>
                  {a.stat.unit ? <em className="r66b-mono">{a.stat.unit}</em> : null}
                </span>
              </div>
            );
          })}
        </div>

        <style>{`
          .r66b-D-table-sec {
            background: #faf9f6;
            padding: clamp(4rem, 8vw, 7rem) 0;
            border-top: 1px solid #e8e6e2;
          }
          .r66b-D-table-sec__container {
            max-width: 1280px;
            margin: 0 auto;
            padding: 0 clamp(1.25rem, 4vw, 2.5rem);
          }
          .r66b-D-table-sec__head {
            display: grid;
            grid-template-columns: 60px 110px 1fr 180px;
            gap: 1.5rem;
            padding: 1rem 0;
            border-bottom: 2px solid #1a1a1a;
            font-size: 0.7rem;
            color: #1a1a1a;
          }
          .r66b-D-row {
            display: grid;
            grid-template-columns: 60px 110px 1fr 180px;
            gap: 1.5rem;
            padding: 1.5rem 0;
            border-bottom: 1px solid #e8e6e2;
            align-items: baseline;
          }
          .r66b-D-row__idx  { color: #7a7a7a; font-size: 0.78rem; }
          .r66b-D-row__code { color: #a67b3f; font-size: 0.8rem; }
          .r66b-D-row__body {
            display: flex;
            flex-direction: column;
            gap: 0.5rem;
          }
          .r66b-D-row__short {
            font-size: 1.05rem;
            font-weight: 500;
            color: #1a1a1a;
          }
          .r66b-D-row__prose {
            font-size: 0.95rem;
            line-height: 1.65;
            color: #4a4a4a;
          }
          .r66b-D-row__stat {
            text-align: right;
            font-size: 1.1rem;
            font-weight: 500;
            color: #1a1a1a;
          }
          .r66b-D-row__stat em {
            font-style: normal;
            font-size: 0.7em;
            color: #7a7a7a;
            margin-left: 0.25rem;
          }
          @media (max-width: 760px) {
            .r66b-D-table-sec__head,
            .r66b-D-row {
              grid-template-columns: 50px 1fr;
              gap: 0.75rem;
            }
            .r66b-D-table-sec__head-stat,
            .r66b-D-row__stat { display: none; }
          }
        `}</style>
      </section>

      <SeamDark argId={5} index={null} featured />
      <RangeMap argId={9} index={null} />
      <SeamPaperStat argId={1} index={null} />

      <ClosingCTA argId={4} index={null} />
    </div>
  );
}

// ===========================================================================
// Variant E — INDEX + LONG-FORM
// TOC index page, then each argument as a numbered editorial section in a
// centred column. No images — argument stands on its prose.
// ===========================================================================
function VariantE() {
  return (
    <div className="r66b r66b-E">
      <OpenerSimple
        preText="THE R66 CASE · CONTENTS"
        parts={[
          { t: 'Nine arguments,', w: 'dark' },
          { t: 'indexed first.',  w: 'mid' },
        ]}
        lede="A contents page, then the long-form. No images. Prose and data only — the format you'd write if you were defending the case in writing."
      />

      <section className="r66b-E-toc">
        <div className="r66b-E-toc__container">
          {IDS.map((id, i) => {
            const a = ARGUMENTS[id];
            return (
              <a key={id} href={`#arg-${id}`} className="r66b-E-toc__row">
                <span className="r66b-mono r66b-E-toc__idx">{String(i + 1).padStart(2, '0')}</span>
                <span className="r66b-mono r66b-E-toc__code">{a.code}</span>
                <span className="r66b-E-toc__title">{a.short}</span>
                <span className="r66b-E-toc__dots" aria-hidden="true" />
                <span className="r66b-mono r66b-E-toc__page">PG. {String(i + 1).padStart(2, '0')}</span>
              </a>
            );
          })}
        </div>
        <style>{`
          .r66b-E-toc {
            background: #faf9f6;
            padding: clamp(3rem, 6vw, 5rem) 0;
            border-top: 1px solid #e8e6e2;
          }
          .r66b-E-toc__container {
            max-width: 900px;
            margin: 0 auto;
            padding: 0 clamp(1.25rem, 4vw, 2.5rem);
          }
          .r66b-E-toc__row {
            display: grid;
            grid-template-columns: 48px 100px 1fr auto 80px;
            gap: 1rem;
            padding: 0.95rem 0;
            border-bottom: 1px solid #e8e6e2;
            align-items: baseline;
            text-decoration: none;
            color: inherit;
            transition: color 0.2s ease;
          }
          .r66b-E-toc__row:hover { color: #a67b3f; }
          .r66b-E-toc__idx  { color: #7a7a7a; font-size: 0.72rem; }
          .r66b-E-toc__code { color: #a67b3f; font-size: 0.72rem; }
          .r66b-E-toc__title {
            font-size: 1.05rem;
            font-weight: 500;
          }
          .r66b-E-toc__dots {
            border-bottom: 1px dotted #c9c5bd;
            height: 0.6em;
          }
          .r66b-E-toc__page { color: #7a7a7a; font-size: 0.7rem; }
        `}</style>
      </section>

      <section className="r66b-E-body">
        <div className="r66b-E-body__container">
          {IDS.map((id, i) => {
            const a = ARGUMENTS[id];
            return (
              <article key={id} id={`arg-${id}`} className="r66b-E-section">
                <div className="r66b-E-section__meta">
                  <span className="r66b-mono r66b-E-section__idx">
                    {String(i + 1).padStart(2, '0')} / 09
                  </span>
                  <span className="r66b-mono r66b-E-section__code">{a.code}</span>
                </div>
                <Headline parts={a.parts} className="r66b-E-section__h" />
                <p className="r66b-E-section__p">{a.body}</p>
                {a.stat ? (
                  <div className="r66b-E-section__stat">
                    <span className="r66b-mono r66b-E-section__stat-l">{a.stat.label}</span>
                    <span className="r66b-E-section__stat-v">
                      {a.stat.value}{a.stat.unit ? <em>{' '}{a.stat.unit}</em> : null}
                    </span>
                  </div>
                ) : null}
              </article>
            );
          })}
        </div>
        <style>{`
          .r66b-E-body {
            background: #faf9f6;
            padding: clamp(4rem, 7vw, 6rem) 0 clamp(5rem, 8vw, 7rem);
          }
          .r66b-E-body__container {
            max-width: 720px;
            margin: 0 auto;
            padding: 0 clamp(1.25rem, 4vw, 2.5rem);
          }
          .r66b-E-section {
            padding: 3rem 0;
            border-bottom: 1px solid #e8e6e2;
            scroll-margin-top: 120px;
          }
          .r66b-E-section:first-child { padding-top: 0; }
          .r66b-E-section:last-child { border-bottom: none; }
          .r66b-E-section__meta {
            display: flex;
            gap: 1.25rem;
            margin-bottom: 1.25rem;
            font-size: 0.7rem;
          }
          .r66b-E-section__idx  { color: #1a1a1a; }
          .r66b-E-section__code { color: #a67b3f; }
          .r66b-E-section__h {
            font-size: clamp(1.65rem, 3.5vw, 2.35rem);
            line-height: 1.15;
            letter-spacing: -0.01em;
            margin: 0 0 1.25rem;
            font-weight: 300;
          }
          .r66b-E-section__p {
            font-size: 1.0625rem;
            line-height: 1.8;
            color: #4a4a4a;
            margin: 0 0 1.75rem;
          }
          .r66b-E-section__stat {
            display: flex;
            flex-direction: column;
            gap: 0.4rem;
            padding-top: 1.25rem;
            border-top: 1px solid #e8e6e2;
            max-width: 280px;
          }
          .r66b-E-section__stat-l { color: #a67b3f; font-size: 0.7rem; }
          .r66b-E-section__stat-v {
            font-size: 1.4rem;
            font-weight: 500;
            color: #1a1a1a;
          }
          .r66b-E-section__stat-v em {
            font-style: normal;
            font-family: 'Share Tech Mono', monospace;
            font-size: 0.7em;
            color: #7a7a7a;
            letter-spacing: 0.18em;
          }
        `}</style>
      </section>

      <ClosingCTA argId={4} index={null} />
    </div>
  );
}

// ===========================================================================
// Variant F — ROMAN TIMELINE
// Vertical numbered milestones (I–IX), left gutter for Roman + stat, right
// gutter for headline + prose. Closes with summary seam + CTA.
// ===========================================================================
function VariantF() {
  const roman = ['I','II','III','IV','V','VI','VII','VIII','IX'];
  return (
    <div className="r66b r66b-F">
      <OpenerSimple
        preText="THE R66 CASE · MILESTONES"
        parts={[
          { t: 'Nine arguments,', w: 'dark' },
          { t: 'nine milestones.', w: 'mid' },
        ]}
        lede="Roman numerals are how the R66 page marks chapters. The nine arguments read top to bottom as a sequence, with left-gutter markers and right-gutter prose."
      />

      <section className="r66b-F-timeline">
        <div className="r66b-F-timeline__container">
          {IDS.map((id, i) => {
            const a = ARGUMENTS[id];
            return (
              <div key={id} className="r66b-F-item">
                <div className="r66b-F-item__gutter">
                  <span className="r66b-F-item__roman">{roman[i]}</span>
                  <span className="r66b-mono r66b-F-item__code">{a.code}</span>
                  {a.stat ? (
                    <span className="r66b-mono r66b-F-item__stat">
                      {a.stat.value}{a.stat.unit ? ` ${a.stat.unit}` : ''}
                    </span>
                  ) : null}
                </div>
                <div className="r66b-F-item__content">
                  <Headline parts={a.parts} className="r66b-F-item__h" />
                  <p className="r66b-F-item__p">{a.body}</p>
                </div>
              </div>
            );
          })}
        </div>
        <style>{`
          .r66b-F-timeline {
            background: #faf9f6;
            padding: clamp(4rem, 8vw, 6rem) 0;
            border-top: 1px solid #e8e6e2;
          }
          .r66b-F-timeline__container {
            max-width: 1160px;
            margin: 0 auto;
            padding: 0 clamp(1.25rem, 4vw, 2.5rem);
            position: relative;
          }
          .r66b-F-timeline__container::before {
            content: '';
            position: absolute;
            top: 0;
            bottom: 0;
            left: calc(clamp(1.25rem, 4vw, 2.5rem) + 180px);
            width: 1px;
            background: #e8e6e2;
          }
          @media (max-width: 760px) {
            .r66b-F-timeline__container::before { display: none; }
          }
          .r66b-F-item {
            display: grid;
            grid-template-columns: 180px 1fr;
            gap: clamp(2rem, 4vw, 3.5rem);
            padding: 2.5rem 0;
            border-bottom: 1px solid #e8e6e2;
          }
          .r66b-F-item:last-child { border-bottom: none; }
          @media (max-width: 760px) {
            .r66b-F-item { grid-template-columns: 1fr; gap: 1rem; }
          }
          .r66b-F-item__gutter {
            display: flex;
            flex-direction: column;
            gap: 0.6rem;
            padding-right: clamp(1rem, 3vw, 2.5rem);
          }
          .r66b-F-item__roman {
            font-family: 'Space Grotesk', sans-serif;
            font-size: 2.5rem;
            font-weight: 300;
            color: #1a1a1a;
            line-height: 1;
            letter-spacing: -0.02em;
          }
          .r66b-F-item__code { color: #a67b3f; font-size: 0.72rem; }
          .r66b-F-item__stat { color: #7a7a7a; font-size: 0.72rem; }
          .r66b-F-item__h {
            font-size: clamp(1.5rem, 3vw, 2rem);
            line-height: 1.15;
            letter-spacing: -0.01em;
            margin: 0 0 1rem;
            font-weight: 300;
          }
          .r66b-F-item__p {
            font-size: 1.0125rem;
            line-height: 1.75;
            color: #4a4a4a;
            margin: 0;
            max-width: 56ch;
          }
        `}</style>
      </section>

      <ClosingCTA argId={4} index={null} />
    </div>
  );
}

// ===========================================================================
// Variant G — COUNTER GRID
// 3×3 grid of big animated stat tiles (paper). Every argument pairs with a
// number. Closes with one dark summary band + CTA.
// ===========================================================================
function VariantG() {
  return (
    <div className="r66b r66b-G">
      <OpenerSimple
        preText="THE R66 CASE · BY THE NUMBERS"
        parts={[
          { t: 'Nine arguments,', w: 'dark' },
          { t: 'nine numbers.',   w: 'mid' },
        ]}
        lede="Each argument distilled to a single figure. The case you'd make on one slide — then read the caption underneath if you want the prose."
      />

      <section className="r66b-G-grid-sec">
        <div className="r66b-G-grid-sec__container">
          <div className="r66b-G-grid">
            {IDS.map((id, i) => {
              const a = ARGUMENTS[id];
              return <CounterTile key={id} arg={a} i={i} />;
            })}
          </div>
        </div>
        <style>{`
          .r66b-G-grid-sec {
            background: #faf9f6;
            padding: clamp(4rem, 8vw, 6rem) 0;
            border-top: 1px solid #e8e6e2;
          }
          .r66b-G-grid-sec__container {
            max-width: 1360px;
            margin: 0 auto;
            padding: 0 clamp(1.25rem, 4vw, 2.5rem);
          }
          .r66b-G-grid {
            display: grid;
            grid-template-columns: 1fr;
            gap: 0;
            border-top: 1px solid #e8e6e2;
            border-left: 1px solid #e8e6e2;
          }
          @media (min-width: 760px) {
            .r66b-G-grid { grid-template-columns: 1fr 1fr; }
          }
          @media (min-width: 1080px) {
            .r66b-G-grid { grid-template-columns: repeat(3, 1fr); }
          }
        `}</style>
      </section>

      <ClosingCTA argId={4} index={null} />
    </div>
  );
}

function CounterTile({ arg, i }) {
  const ref = useRef(null);
  const inView = useInView(ref);
  return (
    <div className="r66b-G-tile" ref={ref}>
      <div className="r66b-G-tile__top">
        <span className="r66b-mono r66b-G-tile__idx">{String(i + 1).padStart(2, '0')}</span>
        <span className="r66b-mono r66b-G-tile__code">{arg.code}</span>
      </div>
      <div className="r66b-G-tile__num">
        {arg.counter.prefix}
        <AnimatedNumber target={arg.counter.value} inView={inView} />
        <em>{arg.counter.suffix}</em>
      </div>
      <span className="r66b-mono r66b-G-tile__label">{arg.counter.label}</span>
      <p className="r66b-G-tile__caption">{arg.short}</p>

      <style>{`
        .r66b-G-tile {
          padding: clamp(1.75rem, 3vw, 2.5rem);
          border-right: 1px solid #e8e6e2;
          border-bottom: 1px solid #e8e6e2;
          background: #faf9f6;
          display: flex;
          flex-direction: column;
          gap: 1rem;
          min-height: 280px;
        }
        .r66b-G-tile__top {
          display: flex;
          justify-content: space-between;
          font-size: 0.7rem;
        }
        .r66b-G-tile__idx  { color: #7a7a7a; }
        .r66b-G-tile__code { color: #a67b3f; }
        .r66b-G-tile__num {
          font-size: clamp(2.4rem, 5vw, 3.6rem);
          font-weight: 400;
          color: #1a1a1a;
          letter-spacing: -0.02em;
          line-height: 1;
          margin-top: auto;
        }
        .r66b-G-tile__num em {
          font-style: normal;
          font-family: 'Share Tech Mono', monospace;
          font-size: 0.35em;
          color: #7a7a7a;
          letter-spacing: 0.15em;
          margin-left: 0.25rem;
        }
        .r66b-G-tile__label {
          font-size: 0.7rem;
          color: #a67b3f;
        }
        .r66b-G-tile__caption {
          font-size: 0.95rem;
          line-height: 1.55;
          color: #4a4a4a;
          margin: 0;
        }
      `}</style>
    </div>
  );
}

// ===========================================================================
// Variant H — HIGHLIGHTS DIRECTORY + SCROLL REVEAL
// Opener → horizontal __highlights row (9 mono tiles) → 9 stacked paper
// explainers, alternating sides → CTA.
// ===========================================================================
function VariantH() {
  return (
    <div className="r66b r66b-H">
      <OpenerSimple
        preText="THE R66 CASE · INDEX ROW"
        parts={[
          { t: 'See all nine,', w: 'dark' },
          { t: 'then read',     w: 'mid' },
          { t: 'them in order.', w: 'light' },
        ]}
        lede="Tile row first — nine codes, nine headline figures, one glance. Read the whole page underneath, or jump to the one that applies."
      />

      <section className="r66b-H-highlights">
        <div className="r66b-H-highlights__container">
          <div className="r66b-H-highlights__row">
            {IDS.map((id, i) => {
              const a = ARGUMENTS[id];
              return (
                <a href={`#h-arg-${id}`} key={id} className="r66b-H-tile">
                  <span className="r66b-mono r66b-H-tile__idx">
                    {String(i + 1).padStart(2, '0')}
                  </span>
                  <span className="r66b-mono r66b-H-tile__code">{a.code}</span>
                  <span className="r66b-H-tile__val">
                    {a.stat.value}
                    {a.stat.unit ? <em className="r66b-mono">{' '}{a.stat.unit}</em> : null}
                  </span>
                  <span className="r66b-H-tile__tag">{a.short}</span>
                </a>
              );
            })}
          </div>
        </div>
        <style>{`
          .r66b-H-highlights {
            background: #faf9f6;
            padding: clamp(3rem, 6vw, 4.5rem) 0;
            border-top: 1px solid #e8e6e2;
          }
          .r66b-H-highlights__container {
            max-width: 1360px;
            margin: 0 auto;
            padding: 0 clamp(1.25rem, 4vw, 2.5rem);
          }
          .r66b-H-highlights__row {
            display: grid;
            grid-template-columns: repeat(9, minmax(140px, 1fr));
            gap: 0;
            border-top: 1px solid #e8e6e2;
            border-left: 1px solid #e8e6e2;
            overflow-x: auto;
          }
          @media (max-width: 1080px) {
            .r66b-H-highlights__row {
              grid-template-columns: repeat(9, 180px);
            }
          }
          .r66b-H-tile {
            padding: 1.25rem;
            border-right: 1px solid #e8e6e2;
            border-bottom: 1px solid #e8e6e2;
            text-decoration: none;
            color: inherit;
            display: flex;
            flex-direction: column;
            gap: 0.5rem;
            transition: background 0.2s;
            min-height: 140px;
          }
          .r66b-H-tile:hover { background: #f6f3ed; }
          .r66b-H-tile__idx  { font-size: 0.65rem; color: #7a7a7a; }
          .r66b-H-tile__code { font-size: 0.65rem; color: #a67b3f; }
          .r66b-H-tile__val {
            font-size: 1.4rem;
            font-weight: 500;
            letter-spacing: -0.01em;
            margin-top: auto;
          }
          .r66b-H-tile__val em {
            font-style: normal;
            font-size: 0.5em;
            color: #7a7a7a;
            margin-left: 0.2rem;
          }
          .r66b-H-tile__tag {
            font-size: 0.8rem;
            line-height: 1.4;
            color: #4a4a4a;
          }
        `}</style>
      </section>

      {IDS.map((id, i) => (
        <div key={id} id={`h-arg-${id}`}>
          <ExplainerSplit
            argId={id}
            index={i + 1}
            side={i % 2 === 0 ? 'right' : 'left'}
          />
        </div>
      ))}

      <ClosingCTA argId={4} index={null} />
    </div>
  );
}

// ===========================================================================
// Variant I — SEAM SYMPHONY
// Every argument is its own center-seam band, alternating paper and dark.
// No images — the seam device is the entire visual language.
// ===========================================================================
function VariantI() {
  return (
    <div className="r66b r66b-I">
      <OpenerSimple
        preText="THE R66 CASE · NINE SEAMS"
        parts={[
          { t: 'One device,', w: 'dark' },
          { t: 'nine times.',  w: 'mid' },
        ]}
        lede="The signature HQ center-seam used as the only visual structure. Paper / dark / paper / dark — the argument is the art."
      />

      {IDS.map((id, i) => {
        const a = ARGUMENTS[id];
        const dark = i % 2 === 1;
        return (
          <SeamArgument
            key={id}
            arg={a}
            index={i + 1}
            dark={dark}
          />
        );
      })}

      <ClosingCTA argId={4} index={null} />
    </div>
  );
}

function SeamArgument({ arg, index, dark }) {
  const textInv = dark;
  return (
    <section className={`r66b-I-seam${dark ? ' r66b-I-seam--dark' : ''}`}>
      <div className="r66b-I-seam__container">
        <div className="r66b-I-seam__left">
          <div className="r66b-I-seam__meta">
            <span className="r66b-mono r66b-I-seam__idx">
              {String(index).padStart(2, '0')} / 09
            </span>
            <span className="r66b-mono r66b-I-seam__code">{arg.code}</span>
          </div>
          <Headline parts={arg.parts} className="r66b-I-seam__h" inverted={textInv} />
        </div>
        <div className="r66b-I-seam__right">
          <p className="r66b-I-seam__p">{arg.body}</p>
          {arg.stat ? (
            <div className="r66b-I-seam__stat">
              <span className="r66b-mono r66b-I-seam__stat-l">{arg.stat.label}</span>
              <span className="r66b-I-seam__stat-v">
                {arg.stat.value}{arg.stat.unit ? <em>{' '}{arg.stat.unit}</em> : null}
              </span>
            </div>
          ) : null}
        </div>
      </div>

      <style>{`
        .r66b-I-seam {
          background: linear-gradient(to right, #faf9f6 50%, #ececec 50%);
          padding: clamp(4rem, 7vw, 6rem) 0;
          color: #1a1a1a;
        }
        .r66b-I-seam--dark {
          background: linear-gradient(to right, #282828 50%, #1c1c1c 50%);
          color: #faf9f6;
        }
        .r66b-I-seam__container {
          max-width: 1360px;
          margin: 0 auto;
          padding: 0 clamp(1.25rem, 4vw, 2.5rem);
          display: grid;
          grid-template-columns: 1fr;
          gap: clamp(2rem, 4vw, 3.5rem);
          align-items: center;
        }
        @media (min-width: 960px) {
          .r66b-I-seam__container { grid-template-columns: 1.1fr 1fr; }
        }
        .r66b-I-seam__meta {
          display: flex;
          gap: 1.25rem;
          margin-bottom: 1.5rem;
          font-size: 0.7rem;
        }
        .r66b-I-seam__idx  { color: #7a7a7a; }
        .r66b-I-seam--dark .r66b-I-seam__idx { color: rgba(250,249,246,0.55); }
        .r66b-I-seam__code { color: #a67b3f; }
        .r66b-I-seam__h {
          font-size: clamp(1.8rem, 4vw, 2.8rem);
          line-height: 1.1;
          letter-spacing: -0.01em;
          margin: 0;
          font-weight: 300;
        }
        .r66b-I-seam__p {
          font-size: 1.0625rem;
          line-height: 1.75;
          margin: 0 0 1.75rem;
          color: #4a4a4a;
          max-width: 52ch;
        }
        .r66b-I-seam--dark .r66b-I-seam__p { color: rgba(250,249,246,0.75); }
        .r66b-I-seam__stat {
          display: flex;
          flex-direction: column;
          gap: 0.4rem;
          padding-top: 1.25rem;
          border-top: 1px solid #e8e6e2;
          max-width: 280px;
        }
        .r66b-I-seam--dark .r66b-I-seam__stat {
          border-top-color: rgba(250,249,246,0.15);
        }
        .r66b-I-seam__stat-l { color: #a67b3f; font-size: 0.7rem; }
        .r66b-I-seam__stat-v {
          font-size: 1.35rem;
          font-weight: 500;
        }
        .r66b-I-seam__stat-v em {
          font-style: normal;
          font-family: 'Share Tech Mono', monospace;
          font-size: 0.7em;
          color: #7a7a7a;
          letter-spacing: 0.18em;
        }
        .r66b-I-seam--dark .r66b-I-seam__stat-v em { color: rgba(250,249,246,0.5); }
      `}</style>
    </section>
  );
}

// ===========================================================================
// Variant J — EDITORIAL COLUMN
// Single centred ~720px column. Nine numbered prose sections with gutter
// Roman numerals. Inline pull quotes and stat captions. Long-form feature
// energy.
// ===========================================================================
function VariantJ() {
  const roman = ['I','II','III','IV','V','VI','VII','VIII','IX'];
  return (
    <div className="r66b r66b-J">
      <OpenerSimple
        preText="FEATURE · THE R66 CASE"
        parts={[
          { t: 'The long',      w: 'dark' },
          { t: 'answer.',       w: 'mid' },
        ]}
        lede="A feature-length read, structured as nine numbered sections in a single column. The prose version of the case — closest in form to a magazine article."
      />

      <article className="r66b-J-article">
        <div className="r66b-J-article__container">
          {IDS.map((id, i) => {
            const a = ARGUMENTS[id];
            return (
              <section key={id} className="r66b-J-sec">
                <aside className="r66b-J-sec__gutter">
                  <span className="r66b-J-sec__roman">{roman[i]}</span>
                  <span className="r66b-mono r66b-J-sec__code">{a.code}</span>
                </aside>
                <div className="r66b-J-sec__body">
                  <Headline parts={a.parts} className="r66b-J-sec__h" />
                  <p className="r66b-J-sec__p">{a.body}</p>
                  {a.stat ? (
                    <figure className="r66b-J-sec__fig">
                      <span className="r66b-mono r66b-J-sec__fig-l">
                        FIG. {String(i + 1).padStart(2, '0')} · {a.stat.label}
                      </span>
                      <span className="r66b-J-sec__fig-v">
                        {a.stat.value}{a.stat.unit ? <em>{' '}{a.stat.unit}</em> : null}
                      </span>
                    </figure>
                  ) : null}
                </div>
              </section>
            );
          })}
        </div>

        <style>{`
          .r66b-J-article {
            background: #faf9f6;
            padding: clamp(4rem, 7vw, 6rem) 0 clamp(5rem, 8vw, 7rem);
            border-top: 1px solid #e8e6e2;
          }
          .r66b-J-article__container {
            max-width: 920px;
            margin: 0 auto;
            padding: 0 clamp(1.25rem, 4vw, 2.5rem);
          }
          .r66b-J-sec {
            display: grid;
            grid-template-columns: 100px 1fr;
            gap: clamp(1.25rem, 3vw, 2.5rem);
            padding: 3rem 0;
            border-bottom: 1px solid #e8e6e2;
          }
          .r66b-J-sec:first-child { padding-top: 0; }
          @media (max-width: 760px) {
            .r66b-J-sec { grid-template-columns: 1fr; gap: 1rem; }
          }
          .r66b-J-sec__gutter {
            display: flex;
            flex-direction: column;
            gap: 0.5rem;
          }
          .r66b-J-sec__roman {
            font-size: 2.25rem;
            font-weight: 300;
            letter-spacing: -0.02em;
            color: #1a1a1a;
            line-height: 1;
          }
          .r66b-J-sec__code { color: #a67b3f; font-size: 0.7rem; }
          .r66b-J-sec__h {
            font-size: clamp(1.6rem, 3vw, 2.1rem);
            line-height: 1.15;
            letter-spacing: -0.01em;
            margin: 0 0 1.25rem;
            font-weight: 300;
          }
          .r66b-J-sec__p {
            font-size: 1.075rem;
            line-height: 1.85;
            color: #4a4a4a;
            margin: 0 0 1.5rem;
          }
          .r66b-J-sec__fig {
            display: inline-flex;
            flex-direction: column;
            gap: 0.4rem;
            margin: 0;
            padding: 1rem 1.25rem;
            background: #fbfaf7;
            border-left: 2px solid #a67b3f;
          }
          .r66b-J-sec__fig-l { color: #a67b3f; font-size: 0.68rem; }
          .r66b-J-sec__fig-v {
            font-size: 1.2rem;
            font-weight: 500;
            color: #1a1a1a;
          }
          .r66b-J-sec__fig-v em {
            font-style: normal;
            font-family: 'Share Tech Mono', monospace;
            font-size: 0.7em;
            color: #7a7a7a;
            letter-spacing: 0.18em;
          }
        `}</style>
      </article>

      <ClosingCTA argId={4} index={null} />
    </div>
  );
}

// ===========================================================================
// Shared section components (used across multiple variants)
// ===========================================================================

// --- OPENER: sticky split with image right ---
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
            The R66 is the only light turbine that arrives with Robinson's
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
            src="/assets/images/new-aircraft/r66/rhc-r66-exterior-marketing.jpg"
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

// --- OPENER: simple, no image ---
function OpenerSimple({ preText, parts, lede }) {
  return (
    <section className="r66b-open-simple">
      <div className="r66b-open-simple__container">
        <span className="r66b-mono r66b-open-simple__pre">{preText}</span>
        <Headline parts={parts} className="r66b-open-simple__h" />
        <p className="r66b-open-simple__lede">{lede}</p>
      </div>
      <style>{`
        .r66b-open-simple {
          background: #faf9f6;
          padding: clamp(4rem, 8vw, 6rem) 0 clamp(3rem, 5vw, 4rem);
        }
        .r66b-open-simple__container {
          max-width: 1020px;
          margin: 0 auto;
          padding: 0 clamp(1.25rem, 4vw, 2.5rem);
        }
        .r66b-open-simple__pre {
          display: block;
          font-size: 0.72rem;
          color: #4a4a4a;
          margin-bottom: 1.5rem;
        }
        .r66b-open-simple__h {
          font-size: clamp(2rem, 4.5vw, 3.4rem);
          line-height: 1.08;
          letter-spacing: -0.015em;
          margin: 0 0 1.75rem;
          font-weight: 300;
          max-width: 22ch;
        }
        .r66b-open-simple__lede {
          font-size: 1.0625rem;
          line-height: 1.7;
          color: #4a4a4a;
          max-width: 56ch;
          margin: 0;
        }
      `}</style>
    </section>
  );
}

// --- Chapter header (dark center-seam) ---
function ChapterHeader({ numeral, title, subtitle }) {
  return (
    <section className="r66b-chap">
      <div className="r66b-chap__container">
        <span className="r66b-chap__numeral">{numeral}</span>
        <h3 className="r66b-chap__title">{title}</h3>
        <p className="r66b-chap__sub">{subtitle}</p>
      </div>
      <style>{`
        .r66b-chap {
          background: linear-gradient(to right, #282828 50%, #1c1c1c 50%);
          color: #faf9f6;
          padding: clamp(3rem, 6vw, 5rem) 0;
        }
        .r66b-chap__container {
          max-width: 1160px;
          margin: 0 auto;
          padding: 0 clamp(1.25rem, 4vw, 2.5rem);
          display: grid;
          grid-template-columns: 100px 1fr;
          gap: clamp(1rem, 3vw, 2rem);
          align-items: baseline;
        }
        .r66b-chap__numeral {
          font-size: clamp(2.4rem, 5vw, 3.6rem);
          font-weight: 300;
          letter-spacing: -0.02em;
          color: #a67b3f;
          line-height: 1;
        }
        .r66b-chap__title {
          font-family: 'Share Tech Mono', monospace;
          font-size: clamp(0.85rem, 1.5vw, 1.05rem);
          letter-spacing: 0.3em;
          font-weight: 400;
          margin: 0 0 0.6rem;
          color: #faf9f6;
        }
        .r66b-chap__sub {
          font-size: 1.0625rem;
          line-height: 1.6;
          color: rgba(250,249,246,0.72);
          margin: 0;
          max-width: 60ch;
          font-weight: 300;
        }
      `}</style>
    </section>
  );
}

// --- Explainer (paper, image + text, alternating sides) ---
function ExplainerSplit({ argId, index, side = 'right', statHero = false }) {
  const arg = ARGUMENTS[argId];
  const imgMap = {
    1: 'rhc-r66-cost-operations.jpg',
    2: 'rhc-r66-fleet-lineup-ladder.jpg',
    3: 'rhc-r66-engine-rr300-atmospheric.jpg',
    4: 'rhc-r66-maintenance-hangar.jpg',
    5: 'rhc-r66-rr300-engine-closeup.jpg',
    6: 'rhc-r66-cockpit-g500h-txi.jpg',
    7: 'rhc-r66-cargo-hold-loaded.jpg',
    8: 'rhc-r66-cabin-five-seats.jpg',
    9: 'rhc-r66-long-range-flight.jpg',
  };
  const src = `/assets/images/new-aircraft/r66/${imgMap[argId]}`;
  return (
    <section className={`r66b-exp r66b-exp--${side}${statHero ? ' r66b-exp--hero' : ''}`}>
      <div className="r66b-exp__container">
        <div className="r66b-exp__text">
          {index ? (
            <div className="r66b-exp__meta">
              <span className="r66b-mono r66b-exp__idx">
                {String(index).padStart(2, '0')} / 09
              </span>
              <span className="r66b-mono r66b-exp__code">{arg.code}</span>
            </div>
          ) : (
            <div className="r66b-exp__meta">
              <span className="r66b-mono r66b-exp__code">{arg.code}</span>
            </div>
          )}
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

// --- Dark Seam Band ---
function SeamDark({ argId, index, featured = false }) {
  const arg = ARGUMENTS[argId];
  return (
    <section className={`r66b-seamD${featured ? ' r66b-seamD--featured' : ''}`}>
      <div className="r66b-seamD__container">
        <div className="r66b-seamD__text">
          <div className="r66b-seamD__meta">
            {index ? (
              <span className="r66b-mono r66b-seamD__idx">
                {String(index).padStart(2, '0')} / 09
              </span>
            ) : (
              <span className="r66b-mono r66b-seamD__idx">FEATURED</span>
            )}
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
            src="/assets/images/new-aircraft/r66/rhc-r66-rr300-engine-closeup.jpg"
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

// --- Paper Seam Stat ---
function SeamPaperStat({ argId, index }) {
  const arg = ARGUMENTS[argId];
  return (
    <section className="r66b-seamP">
      <div className="r66b-seamP__container">
        <div className="r66b-seamP__text">
          <div className="r66b-seamP__meta">
            {index ? (
              <span className="r66b-mono r66b-seamP__idx">
                {String(index).padStart(2, '0')} / 09
              </span>
            ) : (
              <span className="r66b-mono r66b-seamP__idx">FEATURED</span>
            )}
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

// --- Range Map (dark seam with SVG route) ---
function RangeMap({ argId, index }) {
  const arg = ARGUMENTS[argId];
  const ref = useRef(null);
  const inView = useInView(ref);
  return (
    <section className="r66b-range" ref={ref}>
      <div className="r66b-range__container">
        <div className="r66b-range__head">
          <div className="r66b-range__meta">
            {index ? (
              <span className="r66b-mono r66b-range__idx">
                {String(index).padStart(2, '0')} / 09
              </span>
            ) : (
              <span className="r66b-mono r66b-range__idx">FEATURED</span>
            )}
            <span className="r66b-mono r66b-range__code">{arg.code}</span>
          </div>
          <Headline parts={arg.parts} className="r66b-range__h" inverted />
        </div>
        <div className="r66b-range__grid">
          <div className="r66b-range__map">
            <svg viewBox="0 0 600 400" xmlns="http://www.w3.org/2000/svg"
              className={`r66b-range__svg${inView ? ' is-drawn' : ''}`}
              aria-hidden="true">
              <defs>
                <radialGradient id="r66b-range-glow" cx="20%" cy="55%" r="70%">
                  <stop offset="0%" stopColor="rgba(166,123,63,0.18)" />
                  <stop offset="100%" stopColor="rgba(166,123,63,0)" />
                </radialGradient>
              </defs>
              <rect width="600" height="400" fill="url(#r66b-range-glow)" />
              <circle cx="120" cy="220" r="90"
                fill="none" stroke="rgba(250,249,246,0.18)"
                strokeDasharray="3 5" strokeWidth="1" />
              <circle cx="120" cy="220" r="170"
                fill="none" stroke="#a67b3f"
                strokeDasharray="4 6" strokeWidth="1.25" />
              <path d="M 120 220 Q 260 130 430 90"
                fill="none" stroke="#faf9f6" strokeWidth="1.5"
                className="r66b-range__route" />
              <circle cx="120" cy="220" r="4" fill="#faf9f6" />
              <circle cx="120" cy="220" r="10"
                fill="none" stroke="#faf9f6" strokeOpacity="0.3" strokeWidth="1" />
              <circle cx="430" cy="90" r="4" fill="#a67b3f" />
              <circle cx="430" cy="90" r="10"
                fill="none" stroke="#a67b3f" strokeOpacity="0.45" strokeWidth="1" />
              <text x="120" y="260" fill="rgba(250,249,246,0.55)"
                fontFamily="Share Tech Mono, monospace" fontSize="11" letterSpacing="2"
                textAnchor="middle">EGLD</text>
              <text x="430" y="75" fill="#a67b3f"
                fontFamily="Share Tech Mono, monospace" fontSize="11" letterSpacing="2"
                textAnchor="middle">550 NM</text>
              <text x="215" y="310" fill="rgba(250,249,246,0.4)"
                fontFamily="Share Tech Mono, monospace" fontSize="9" letterSpacing="2">
                STD TANK · ~350 NM
              </text>
              <text x="325" y="360" fill="rgba(166,123,63,0.75)"
                fontFamily="Share Tech Mono, monospace" fontSize="9" letterSpacing="2">
                AUX TANK · ~550 NM
              </text>
            </svg>
          </div>
          <div className="r66b-range__text">
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
          background: linear-gradient(to right, #1c1c1c 50%, #141414 50%);
          color: #faf9f6;
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
        .r66b-range__idx  { color: rgba(250,249,246,0.55); }
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
          align-items: center;
        }
        @media (min-width: 960px) {
          .r66b-range__grid { grid-template-columns: 1.4fr 1fr; }
        }
        .r66b-range__map {
          width: 100%;
          aspect-ratio: 3 / 2;
          border: 1px solid rgba(250,249,246,0.12);
        }
        .r66b-range__svg { width: 100%; height: 100%; display: block; }
        .r66b-range__route {
          stroke-dasharray: 600;
          stroke-dashoffset: 600;
          transition: stroke-dashoffset 2s ease-out;
        }
        .r66b-range__svg.is-drawn .r66b-range__route { stroke-dashoffset: 0; }
        .r66b-range__p {
          font-size: 1.0625rem;
          line-height: 1.75;
          color: rgba(250,249,246,0.78);
          margin: 0 0 2rem;
          max-width: 42ch;
        }
        .r66b-range__stats {
          display: grid;
          grid-template-columns: 1fr 1fr;
          border-top: 1px solid rgba(250,249,246,0.12);
        }
        .r66b-range__stat {
          display: flex;
          flex-direction: column;
          gap: 0.35rem;
          padding: 1rem 0;
          border-bottom: 1px solid rgba(250,249,246,0.12);
        }
        .r66b-range__stat--hero .r66b-range__stat-v { color: #a67b3f; }
        .r66b-range__stat-l {
          font-size: 0.65rem;
          color: rgba(250,249,246,0.5);
        }
        .r66b-range__stat-v {
          font-size: 1.25rem;
          font-weight: 500;
        }
      `}</style>
    </section>
  );
}

// --- Robinson Ladder ---
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
            {index ? (
              <span className="r66b-mono r66b-ladder__idx">
                {String(index).padStart(2, '0')} / 09
              </span>
            ) : null}
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

// --- Closing CTA ---
function ClosingCTA({ argId, index, hidePreText = false }) {
  const arg = ARGUMENTS[argId];
  return (
    <section className="r66b-close">
      <div className="r66b-close__container">
        <div className="r66b-close__text">
          {!hidePreText && (
            <div className="r66b-close__meta">
              {index ? (
                <span className="r66b-mono r66b-close__idx">
                  {String(index).padStart(2, '0')} / 09
                </span>
              ) : null}
              <span className="r66b-mono r66b-close__code">{arg.code}</span>
            </div>
          )}
          <Headline parts={arg.parts} className="r66b-close__h" inverted />
          <p className="r66b-close__p">{arg.body}</p>
        </div>
        <div className="r66b-close__actions">
          <a href="#register" className="r66b-close__btn r66b-close__btn--primary">
            Register interest
          </a>
          <a href="/aircraft/r66" className="r66b-close__btn r66b-close__btn--ghost">
            Full R66 specification
          </a>
          <div className="r66b-close__meta-row">
            <span className="r66b-mono r66b-close__meta-l">DEALER</span>
            <span className="r66b-close__meta-v">HQ Aviation · Denham</span>
          </div>
          <div className="r66b-close__meta-row">
            <span className="r66b-mono r66b-close__meta-l">FACTORY</span>
            <span className="r66b-close__meta-v">Robinson · Torrance, CA</span>
          </div>
        </div>
      </div>
      <style>{`
        .r66b-close {
          background: #1a1a1a;
          color: #faf9f6;
          padding: clamp(5rem, 9vw, 8rem) 0;
        }
        .r66b-close__container {
          max-width: 1360px;
          margin: 0 auto;
          padding: 0 clamp(1.25rem, 4vw, 2.5rem);
          display: grid;
          grid-template-columns: 1fr;
          gap: clamp(2.5rem, 5vw, 4rem);
          align-items: center;
        }
        @media (min-width: 960px) {
          .r66b-close__container { grid-template-columns: 1.2fr 1fr; }
        }
        .r66b-close__meta {
          display: flex;
          gap: 1.25rem;
          margin-bottom: 1.5rem;
          font-size: 0.7rem;
        }
        .r66b-close__idx  { color: rgba(250,249,246,0.55); }
        .r66b-close__code { color: #a67b3f; }
        .r66b-close__h {
          font-size: clamp(2rem, 4.5vw, 3.3rem);
          line-height: 1.08;
          letter-spacing: -0.015em;
          margin: 0 0 1.5rem;
          font-weight: 300;
          max-width: 22ch;
        }
        .r66b-close__p {
          font-size: 1.0625rem;
          line-height: 1.75;
          color: rgba(250,249,246,0.78);
          max-width: 52ch;
          margin: 0;
        }
        .r66b-close__actions {
          display: flex;
          flex-direction: column;
          gap: 1rem;
        }
        .r66b-close__btn {
          display: inline-block;
          padding: 1.05rem 1.75rem;
          font-family: 'Share Tech Mono', monospace;
          font-size: 0.78rem;
          letter-spacing: 0.2em;
          text-transform: uppercase;
          text-decoration: none;
          text-align: center;
          transition: all 0.2s ease;
          border-radius: 2px;
        }
        .r66b-close__btn--primary {
          background: #faf9f6;
          color: #1a1a1a;
          border: 1px solid #faf9f6;
        }
        .r66b-close__btn--primary:hover {
          background: #a67b3f;
          color: #1a1a1a;
          border-color: #a67b3f;
        }
        .r66b-close__btn--ghost {
          background: transparent;
          color: #faf9f6;
          border: 1px solid rgba(250,249,246,0.3);
        }
        .r66b-close__btn--ghost:hover { border-color: #faf9f6; }
        .r66b-close__meta-row {
          display: grid;
          grid-template-columns: 100px 1fr;
          padding: 0.9rem 0;
          border-bottom: 1px solid rgba(250,249,246,0.12);
          align-items: baseline;
        }
        .r66b-close__meta-row:first-of-type {
          border-top: 1px solid rgba(250,249,246,0.12);
          margin-top: 1rem;
        }
        .r66b-close__meta-l {
          font-size: 0.7rem;
          color: rgba(250,249,246,0.5);
        }
        .r66b-close__meta-v {
          font-size: 0.95rem;
          color: #faf9f6;
          font-weight: 500;
        }
      `}</style>
    </section>
  );
}

// ===========================================================================
// 4. Page — selector header + all variants stacked
// ===========================================================================
export default function R66BenefitsVariations() {
  const variants = [
    { label: 'Variant A — Chaptered Flow',             note: 'Cinematic descending narrative. Sticky opener, alternating explainers, three wow seam bands placed to carry the page rhythm.', Component: VariantA },
    { label: 'Variant B — Three Acts',                 note: 'Engine / Aircraft / Ownership. Dark chapter headers, three paper explainers per act. Slowest read, most structured.', Component: VariantB },
    { label: 'Variant C — Carousel Centrepiece',       note: 'One dark expedition-style carousel cycling through all nine arguments. Compact vertically, single focus at any time.', Component: VariantC },
    { label: 'Variant D — Dossier Dense Table',        note: 'Specs-table catalogue of all nine, then three featured seam bands for the wow arguments. Scanner-first format.', Component: VariantD },
    { label: 'Variant E — Index + Long-form',          note: 'Contents page, then each argument as a centred long-form section. Text only. Closest to a white paper.', Component: VariantE },
    { label: 'Variant F — Roman Timeline',             note: 'Vertical I–IX milestones with left gutter Roman numerals and stats. Sequential read, strong vertical spine.', Component: VariantF },
    { label: 'Variant G — Counter Grid',               note: 'Nine arguments, nine animated stat tiles (3×3). One-slide visual summary of the case.', Component: VariantG },
    { label: 'Variant H — Highlights + Reveal',        note: 'Horizontal mono directory row of all nine at the top, nine stacked paper explainers below.', Component: VariantH },
    { label: 'Variant I — Seam Symphony',              note: 'The signature center-seam used as the only structural device. Paper / dark / paper / dark — one per argument.', Component: VariantI },
    { label: 'Variant J — Editorial Column',           note: 'Single 720-wide centred column. Nine numbered prose sections with left-gutter Roman numerals and FIG. stat captions.', Component: VariantJ },
  ];
  return (
    <>
      <GlobalTokens />
      <main style={{ background: '#faf9f6' }}>
        <header style={{
          background: '#1a1a1a',
          color: '#faf9f6',
          padding: '5rem 2rem',
          textAlign: 'center',
          fontFamily: "'Space Grotesk', sans-serif",
        }}>
          <span style={{
            fontFamily: "'Share Tech Mono', monospace",
            fontSize: '0.75rem',
            letterSpacing: '0.2em',
            color: '#a67b3f',
          }}>R66 BENEFITS · TEN BRAND-NATIVE VARIANTS</span>
          <h1 style={{
            fontSize: 'clamp(2.2rem, 5vw, 3.5rem)',
            fontWeight: 300,
            letterSpacing: '-0.02em',
            margin: '0.75rem 0',
            maxWidth: 920,
            marginLeft: 'auto',
            marginRight: 'auto',
          }}>
            Ten arrangements of the same nine arguments — pick one.
          </h1>
          <p style={{
            fontSize: '1rem',
            color: 'rgba(255,255,255,0.7)',
            margin: '0 auto',
            maxWidth: 820,
            lineHeight: 1.6,
          }}>
            Every variant uses only the vocabulary already on /aircraft/r44,
            /aircraft/r66, /aircraft/r88, /discovery-flight and /ppl — Space
            Grotesk, Share Tech Mono, the warm-paper palette, the center-seam
            device, multi-weight headline spans, mono eyebrows, hairline rules.
            Variants differ only in which existing archetypes they use and how
            they're ordered.
          </p>
        </header>

        {variants.map(({ label, note, Component }, i) => (
          <div key={i}>
            <div style={{
              background: '#2a2a2a',
              color: '#faf9f6',
              padding: '1.5rem 2rem',
              fontFamily: "'Space Grotesk', sans-serif",
              borderTop: '1px solid #3a3a3a',
            }}>
              <div style={{ maxWidth: 1280, margin: '0 auto' }}>
                <span style={{
                  fontFamily: "'Share Tech Mono', monospace",
                  fontSize: '0.7rem',
                  letterSpacing: '0.2em',
                  color: '#a67b3f',
                }}>{String(i + 1).padStart(2, '0')} / {variants.length}</span>
                <h2 style={{
                  fontSize: '1.25rem',
                  fontWeight: 500,
                  margin: '0.25rem 0',
                }}>{label}</h2>
                <p style={{
                  fontSize: '0.85rem',
                  color: 'rgba(255,255,255,0.7)',
                  margin: 0,
                  maxWidth: 860,
                  lineHeight: 1.5,
                }}>{note}</p>
              </div>
            </div>
            <Component />
          </div>
        ))}
      </main>
    </>
  );
}

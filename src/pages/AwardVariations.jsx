/**
 * AWARD VARIATIONS — 10 card style treatments for the awards horizontal scroll
 * All share the same horizontal scroll track, just different card designs.
 * Route: /award-variations
 */

import React, { useState } from 'react';
import Picker from '../components/Picker';

const AWARDS = [
  { year: '2019', icon: 'fas fa-award',          text: 'FAI Gold Rotorcraft Medal',           sub: 'Lifetime Achievement' },
  { year: '2016', icon: 'fas fa-snowflake',       text: 'Solo to All 3 North Poles',           sub: 'World First' },
  { year: '2012', icon: 'fas fa-medal',           text: 'Second World Championship',           sub: 'Backwards Autorotation' },
  { year: '2005', icon: 'fas fa-flag',            text: 'First Crew to Both Poles',            sub: 'Guinness World Record' },
  { year: '2002', icon: 'fas fa-compass',         text: 'First Piston Heli to North Pole',     sub: 'Guinness World Record' },
  { year: '1997', icon: 'fas fa-globe-americas',  text: 'First Piston Heli Around the World',  sub: 'Now in the Smithsonian' },
  { year: '1994', icon: 'fas fa-trophy',          text: 'World Aerobatics Gold',               sub: 'Moscow, Russia' },
];

const TRACK_CSS = `
  display: flex; gap: 0.75rem; overflow-x: auto; scroll-snap-type: x mandatory;
  padding-bottom: 1rem; -webkit-overflow-scrolling: touch;
  mask-image: linear-gradient(to right, black 80%, transparent 100%);
  -webkit-mask-image: linear-gradient(to right, black 80%, transparent 100%);
`;
const SCROLLBAR_CSS = (prefix) => `
  .${prefix}__track::-webkit-scrollbar { height: 4px; }
  .${prefix}__track::-webkit-scrollbar-track { background: transparent; }
  .${prefix}__track::-webkit-scrollbar-thumb { background: #c0b8aa; border-radius: 2px; }
`;
const TITLE_CSS = `font-family: 'Share Tech Mono', monospace; font-size: 0.6rem; font-weight: 600; text-transform: uppercase; letter-spacing: 0.15em; color: #a09080; margin-bottom: 1.25rem;`;

/* V1 — Original: centered card, icon top, rounded border */
function AwardsV1() {
  return (
    <section className="aw-v1">
      <style>{`
        .aw-v1 { padding: 2rem 0; }
        .aw-v1__title { ${TITLE_CSS} }
        .aw-v1__track { ${TRACK_CSS} }
        ${SCROLLBAR_CSS('aw-v1')}
        .aw-v1__card {
          display: flex; flex-direction: column; align-items: center; text-align: center;
          min-width: 180px; flex-shrink: 0; scroll-snap-align: start;
          padding: 1.25rem 1rem; border: 1px solid #e0dcd6; background: #fff;
          border-radius: 8px; transition: border-color 0.2s;
        }
        .aw-v1__card:hover { border-color: #c0b8aa; }
        .aw-v1__card i { font-size: 1rem; color: #a09080; margin-bottom: 0.6rem; }
        .aw-v1__year { font-family: 'Share Tech Mono', monospace; font-size: 0.55rem; letter-spacing: 0.15em; color: #a09080; margin-bottom: 0.5rem; }
        .aw-v1__text { font-family: 'Space Grotesk', sans-serif; font-size: 0.7rem; font-weight: 700; text-transform: uppercase; line-height: 1.3; margin-bottom: 0.3rem; color: #1a1a1a; }
        .aw-v1__sub { font-family: 'Share Tech Mono', monospace; font-size: 0.48rem; letter-spacing: 0.08em; text-transform: uppercase; color: #a09080; }
      `}</style>
      <h3 className="aw-v1__title">Recommendations</h3>
      <div className="aw-v1__track">
        {AWARDS.map((m, i) => (
          <div key={i} className="aw-v1__card">
            <i className={m.icon} />
            <span className="aw-v1__year">{m.year}</span>
            <span className="aw-v1__text">{m.text}</span>
            <span className="aw-v1__sub">{m.sub}</span>
          </div>
        ))}
      </div>
    </section>
  );
}

/* V2 — Dark cards: dark bg, light text, no border-radius */
function AwardsV2() {
  return (
    <section className="aw-v2">
      <style>{`
        .aw-v2 { padding: 2rem 0; }
        .aw-v2__title { ${TITLE_CSS} }
        .aw-v2__track { ${TRACK_CSS} }
        ${SCROLLBAR_CSS('aw-v2')}
        .aw-v2__card {
          display: flex; flex-direction: column; align-items: center; text-align: center;
          min-width: 180px; flex-shrink: 0; scroll-snap-align: start;
          padding: 1.5rem 1rem; background: #1a1a1a; color: #fff;
          transition: background 0.2s;
        }
        .aw-v2__card:hover { background: #2a2a2a; }
        .aw-v2__card i { font-size: 1rem; color: #a09080; margin-bottom: 0.6rem; }
        .aw-v2__year { font-family: 'Share Tech Mono', monospace; font-size: 0.55rem; letter-spacing: 0.15em; color: #777; margin-bottom: 0.5rem; }
        .aw-v2__text { font-family: 'Space Grotesk', sans-serif; font-size: 0.7rem; font-weight: 700; text-transform: uppercase; line-height: 1.3; margin-bottom: 0.3rem; }
        .aw-v2__sub { font-family: 'Share Tech Mono', monospace; font-size: 0.48rem; letter-spacing: 0.08em; text-transform: uppercase; color: #666; }
      `}</style>
      <h3 className="aw-v2__title">Recommendations</h3>
      <div className="aw-v2__track">
        {AWARDS.map((m, i) => (
          <div key={i} className="aw-v2__card">
            <i className={m.icon} />
            <span className="aw-v2__year">{m.year}</span>
            <span className="aw-v2__text">{m.text}</span>
            <span className="aw-v2__sub">{m.sub}</span>
          </div>
        ))}
      </div>
    </section>
  );
}

/* V3 — Top accent border: white card with coloured top stripe */
function AwardsV3() {
  return (
    <section className="aw-v3">
      <style>{`
        .aw-v3 { padding: 2rem 0; }
        .aw-v3__title { ${TITLE_CSS} }
        .aw-v3__track { ${TRACK_CSS} }
        ${SCROLLBAR_CSS('aw-v3')}
        .aw-v3__card {
          display: flex; flex-direction: column; align-items: flex-start; text-align: left;
          min-width: 200px; flex-shrink: 0; scroll-snap-align: start;
          padding: 1.25rem 1.25rem; background: #fff;
          border: 1px solid #e0dcd6; border-top: 3px solid #a09080;
          border-radius: 0 0 6px 6px; transition: border-top-color 0.2s;
        }
        .aw-v3__card:hover { border-top-color: #1a1a1a; }
        .aw-v3__year { font-family: 'Share Tech Mono', monospace; font-size: 0.55rem; letter-spacing: 0.15em; color: #a09080; margin-bottom: 0.6rem; }
        .aw-v3__card i { font-size: 0.85rem; color: #a09080; margin-bottom: 0.5rem; }
        .aw-v3__text { font-family: 'Space Grotesk', sans-serif; font-size: 0.7rem; font-weight: 700; text-transform: uppercase; line-height: 1.3; margin-bottom: 0.3rem; color: #1a1a1a; }
        .aw-v3__sub { font-family: 'Share Tech Mono', monospace; font-size: 0.48rem; letter-spacing: 0.08em; text-transform: uppercase; color: #a09080; }
      `}</style>
      <h3 className="aw-v3__title">Recommendations</h3>
      <div className="aw-v3__track">
        {AWARDS.map((m, i) => (
          <div key={i} className="aw-v3__card">
            <span className="aw-v3__year">{m.year}</span>
            <i className={m.icon} />
            <span className="aw-v3__text">{m.text}</span>
            <span className="aw-v3__sub">{m.sub}</span>
          </div>
        ))}
      </div>
    </section>
  );
}

/* V4 — Pill badges: rounded pill shape, cream bg, horizontal icon+text layout */
function AwardsV4() {
  return (
    <section className="aw-v4">
      <style>{`
        .aw-v4 { padding: 2rem 0; }
        .aw-v4__title { ${TITLE_CSS} }
        .aw-v4__track { ${TRACK_CSS} gap: 0.5rem; }
        ${SCROLLBAR_CSS('aw-v4')}
        .aw-v4__card {
          display: flex; align-items: center; gap: 0.75rem;
          min-width: 240px; flex-shrink: 0; scroll-snap-align: start;
          padding: 0.75rem 1.25rem; background: #f2efea;
          border-radius: 100px; transition: background 0.2s;
        }
        .aw-v4__card:hover { background: #e8e4df; }
        .aw-v4__icon { width: 2rem; height: 2rem; border-radius: 50%; background: #fff; display: flex; align-items: center; justify-content: center; flex-shrink: 0; }
        .aw-v4__icon i { font-size: 0.7rem; color: #a09080; }
        .aw-v4__info { min-width: 0; }
        .aw-v4__text { font-family: 'Space Grotesk', sans-serif; font-size: 0.65rem; font-weight: 700; text-transform: uppercase; line-height: 1.3; color: #1a1a1a; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
        .aw-v4__meta { font-family: 'Share Tech Mono', monospace; font-size: 0.45rem; letter-spacing: 0.08em; text-transform: uppercase; color: #a09080; }
      `}</style>
      <h3 className="aw-v4__title">Recommendations</h3>
      <div className="aw-v4__track">
        {AWARDS.map((m, i) => (
          <div key={i} className="aw-v4__card">
            <div className="aw-v4__icon"><i className={m.icon} /></div>
            <div className="aw-v4__info">
              <div className="aw-v4__text">{m.text}</div>
              <div className="aw-v4__meta">{m.year} — {m.sub}</div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

/* V5 — Big year: oversized year number, small text below, minimal card */
function AwardsV5() {
  return (
    <section className="aw-v5">
      <style>{`
        .aw-v5 { padding: 2rem 0; }
        .aw-v5__title { ${TITLE_CSS} }
        .aw-v5__track { ${TRACK_CSS} }
        ${SCROLLBAR_CSS('aw-v5')}
        .aw-v5__card {
          display: flex; flex-direction: column; align-items: center; text-align: center;
          min-width: 160px; flex-shrink: 0; scroll-snap-align: start;
          padding: 1.5rem 1rem;
        }
        .aw-v5__year { font-family: 'Space Grotesk', sans-serif; font-size: 2rem; font-weight: 700; color: #e0dcd6; line-height: 1; margin-bottom: 0.5rem; }
        .aw-v5__card:hover .aw-v5__year { color: #1a1a1a; }
        .aw-v5__text { font-family: 'Space Grotesk', sans-serif; font-size: 0.65rem; font-weight: 700; text-transform: uppercase; line-height: 1.3; margin-bottom: 0.25rem; color: #1a1a1a; }
        .aw-v5__sub { font-family: 'Share Tech Mono', monospace; font-size: 0.45rem; letter-spacing: 0.08em; text-transform: uppercase; color: #a09080; }
        .aw-v5__card i { display: none; }
      `}</style>
      <h3 className="aw-v5__title">Recommendations</h3>
      <div className="aw-v5__track">
        {AWARDS.map((m, i) => (
          <div key={i} className="aw-v5__card">
            <span className="aw-v5__year">{m.year}</span>
            <span className="aw-v5__text">{m.text}</span>
            <span className="aw-v5__sub">{m.sub}</span>
          </div>
        ))}
      </div>
    </section>
  );
}

/* V6 — Icon circle card: prominent circular icon, card with shadow */
function AwardsV6() {
  return (
    <section className="aw-v6">
      <style>{`
        .aw-v6 { padding: 2rem 0; }
        .aw-v6__title { ${TITLE_CSS} }
        .aw-v6__track { ${TRACK_CSS} }
        ${SCROLLBAR_CSS('aw-v6')}
        .aw-v6__card {
          display: flex; flex-direction: column; align-items: center; text-align: center;
          min-width: 180px; flex-shrink: 0; scroll-snap-align: start;
          padding: 2rem 1rem 1.25rem; background: #fff;
          border-radius: 12px; box-shadow: 0 2px 12px rgba(0,0,0,0.06);
          transition: box-shadow 0.2s, transform 0.2s;
        }
        .aw-v6__card:hover { box-shadow: 0 6px 24px rgba(0,0,0,0.1); transform: translateY(-2px); }
        .aw-v6__icon { width: 3rem; height: 3rem; border-radius: 50%; background: #f2efea; display: flex; align-items: center; justify-content: center; margin-bottom: 0.75rem; }
        .aw-v6__icon i { font-size: 1.1rem; color: #a09080; }
        .aw-v6__year { font-family: 'Share Tech Mono', monospace; font-size: 0.55rem; letter-spacing: 0.15em; color: #a09080; margin-bottom: 0.5rem; }
        .aw-v6__text { font-family: 'Space Grotesk', sans-serif; font-size: 0.7rem; font-weight: 700; text-transform: uppercase; line-height: 1.3; margin-bottom: 0.3rem; color: #1a1a1a; }
        .aw-v6__sub { font-family: 'Share Tech Mono', monospace; font-size: 0.48rem; letter-spacing: 0.08em; text-transform: uppercase; color: #a09080; }
      `}</style>
      <h3 className="aw-v6__title">Recommendations</h3>
      <div className="aw-v6__track">
        {AWARDS.map((m, i) => (
          <div key={i} className="aw-v6__card">
            <div className="aw-v6__icon"><i className={m.icon} /></div>
            <span className="aw-v6__year">{m.year}</span>
            <span className="aw-v6__text">{m.text}</span>
            <span className="aw-v6__sub">{m.sub}</span>
          </div>
        ))}
      </div>
    </section>
  );
}

/* V7 — Left-aligned text card: no icon visible, left-aligned, underline accent */
function AwardsV7() {
  return (
    <section className="aw-v7">
      <style>{`
        .aw-v7 { padding: 2rem 0; }
        .aw-v7__title { ${TITLE_CSS} }
        .aw-v7__track { ${TRACK_CSS} }
        ${SCROLLBAR_CSS('aw-v7')}
        .aw-v7__card {
          display: flex; flex-direction: column; align-items: flex-start; text-align: left;
          min-width: 200px; flex-shrink: 0; scroll-snap-align: start;
          padding: 1rem 1.25rem 1.25rem; background: #fff;
          border: 1px solid #e0dcd6; border-radius: 4px;
          position: relative;
        }
        .aw-v7__card::after { content: ''; position: absolute; bottom: 0; left: 1.25rem; right: 1.25rem; height: 2px; background: #e0dcd6; transition: background 0.2s; }
        .aw-v7__card:hover::after { background: #1a1a1a; }
        .aw-v7__year { font-family: 'Share Tech Mono', monospace; font-size: 0.5rem; letter-spacing: 0.15em; color: #a09080; margin-bottom: 0.75rem; }
        .aw-v7__text { font-family: 'Space Grotesk', sans-serif; font-size: 0.75rem; font-weight: 700; text-transform: uppercase; line-height: 1.3; margin-bottom: 0.3rem; color: #1a1a1a; }
        .aw-v7__sub { font-family: 'Share Tech Mono', monospace; font-size: 0.48rem; letter-spacing: 0.08em; text-transform: uppercase; color: #a09080; }
      `}</style>
      <h3 className="aw-v7__title">Recommendations</h3>
      <div className="aw-v7__track">
        {AWARDS.map((m, i) => (
          <div key={i} className="aw-v7__card">
            <span className="aw-v7__year">{m.year}</span>
            <span className="aw-v7__text">{m.text}</span>
            <span className="aw-v7__sub">{m.sub}</span>
          </div>
        ))}
      </div>
    </section>
  );
}

/* V8 — Cream filled: cream background, left border accent, horizontal layout */
function AwardsV8() {
  return (
    <section className="aw-v8">
      <style>{`
        .aw-v8 { padding: 2rem 0; }
        .aw-v8__title { ${TITLE_CSS} }
        .aw-v8__track { ${TRACK_CSS} }
        ${SCROLLBAR_CSS('aw-v8')}
        .aw-v8__card {
          display: flex; align-items: center; gap: 1rem;
          min-width: 260px; flex-shrink: 0; scroll-snap-align: start;
          padding: 1rem 1.25rem; background: #f2efea;
          border-left: 3px solid #d6d2cc; border-radius: 0 6px 6px 0;
          transition: border-left-color 0.2s;
        }
        .aw-v8__card:hover { border-left-color: #1a1a1a; }
        .aw-v8__card i { font-size: 1rem; color: #a09080; flex-shrink: 0; }
        .aw-v8__info { min-width: 0; }
        .aw-v8__text { font-family: 'Space Grotesk', sans-serif; font-size: 0.7rem; font-weight: 700; text-transform: uppercase; line-height: 1.3; color: #1a1a1a; margin-bottom: 0.15rem; }
        .aw-v8__meta { font-family: 'Share Tech Mono', monospace; font-size: 0.45rem; letter-spacing: 0.08em; text-transform: uppercase; color: #a09080; }
      `}</style>
      <h3 className="aw-v8__title">Recommendations</h3>
      <div className="aw-v8__track">
        {AWARDS.map((m, i) => (
          <div key={i} className="aw-v8__card">
            <i className={m.icon} />
            <div className="aw-v8__info">
              <div className="aw-v8__text">{m.text}</div>
              <div className="aw-v8__meta">{m.year} — {m.sub}</div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

/* V9 — Numbered badges: large index number, stacked info, bordered card */
function AwardsV9() {
  return (
    <section className="aw-v9">
      <style>{`
        .aw-v9 { padding: 2rem 0; }
        .aw-v9__title { ${TITLE_CSS} }
        .aw-v9__track { ${TRACK_CSS} }
        ${SCROLLBAR_CSS('aw-v9')}
        .aw-v9__card {
          display: flex; align-items: flex-start; gap: 0.75rem;
          min-width: 220px; flex-shrink: 0; scroll-snap-align: start;
          padding: 1.25rem; background: #fff;
          border: 1px solid #e0dcd6; border-radius: 8px;
          transition: border-color 0.2s;
        }
        .aw-v9__card:hover { border-color: #c0b8aa; }
        .aw-v9__num { font-family: 'Space Grotesk', sans-serif; font-size: 1.5rem; font-weight: 700; color: #e0dcd6; line-height: 1; flex-shrink: 0; min-width: 1.75rem; }
        .aw-v9__card:hover .aw-v9__num { color: #a09080; }
        .aw-v9__info { min-width: 0; }
        .aw-v9__text { font-family: 'Space Grotesk', sans-serif; font-size: 0.7rem; font-weight: 700; text-transform: uppercase; line-height: 1.3; color: #1a1a1a; margin-bottom: 0.2rem; }
        .aw-v9__year { font-family: 'Share Tech Mono', monospace; font-size: 0.5rem; letter-spacing: 0.12em; color: #a09080; }
        .aw-v9__sub { font-family: 'Share Tech Mono', monospace; font-size: 0.45rem; letter-spacing: 0.08em; text-transform: uppercase; color: #a09080; display: block; margin-top: 0.1rem; }
      `}</style>
      <h3 className="aw-v9__title">Recommendations</h3>
      <div className="aw-v9__track">
        {AWARDS.map((m, i) => (
          <div key={i} className="aw-v9__card">
            <span className="aw-v9__num">{String(i + 1).padStart(2, '0')}</span>
            <div className="aw-v9__info">
              <div className="aw-v9__text">{m.text}</div>
              <span className="aw-v9__year">{m.year}</span>
              <span className="aw-v9__sub">{m.sub}</span>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

/* V10 — Glass card: translucent bg, blur, subtle border, refined feel */
function AwardsV10() {
  return (
    <section className="aw-v10">
      <style>{`
        .aw-v10 { padding: 2rem 0; }
        .aw-v10__title { ${TITLE_CSS} }
        .aw-v10__track { ${TRACK_CSS} }
        ${SCROLLBAR_CSS('aw-v10')}
        .aw-v10__card {
          display: flex; flex-direction: column; align-items: center; text-align: center;
          min-width: 180px; flex-shrink: 0; scroll-snap-align: start;
          padding: 1.5rem 1rem; background: rgba(255,255,255,0.6);
          backdrop-filter: blur(8px); -webkit-backdrop-filter: blur(8px);
          border: 1px solid rgba(0,0,0,0.06); border-radius: 12px;
          transition: background 0.2s, border-color 0.2s;
        }
        .aw-v10__card:hover { background: rgba(255,255,255,0.85); border-color: rgba(0,0,0,0.12); }
        .aw-v10__card i { font-size: 1rem; color: #a09080; margin-bottom: 0.6rem; }
        .aw-v10__year { font-family: 'Share Tech Mono', monospace; font-size: 0.55rem; letter-spacing: 0.15em; color: #a09080; margin-bottom: 0.5rem; }
        .aw-v10__text { font-family: 'Space Grotesk', sans-serif; font-size: 0.7rem; font-weight: 700; text-transform: uppercase; line-height: 1.3; margin-bottom: 0.3rem; color: #1a1a1a; }
        .aw-v10__sub { font-family: 'Share Tech Mono', monospace; font-size: 0.48rem; letter-spacing: 0.08em; text-transform: uppercase; color: #a09080; }
      `}</style>
      <h3 className="aw-v10__title">Recommendations</h3>
      <div className="aw-v10__track">
        {AWARDS.map((m, i) => (
          <div key={i} className="aw-v10__card">
            <i className={m.icon} />
            <span className="aw-v10__year">{m.year}</span>
            <span className="aw-v10__text">{m.text}</span>
            <span className="aw-v10__sub">{m.sub}</span>
          </div>
        ))}
      </div>
    </section>
  );
}

/* ── Picker config ── */
const sections = {
  awards: [
    { id: 'v1',  name: 'Original Cards',       category: 'Card', desc: 'Centered, icon top, rounded border' },
    { id: 'v2',  name: 'Dark Cards',            category: 'Card', desc: 'Dark background, light text, sharp edges' },
    { id: 'v3',  name: 'Top Accent Border',     category: 'Card', desc: 'White card with coloured top stripe' },
    { id: 'v4',  name: 'Pill Badges',           category: 'Card', desc: 'Rounded pill shape, horizontal layout' },
    { id: 'v5',  name: 'Big Year',              category: 'Minimal', desc: 'Oversized year number, minimal card' },
    { id: 'v6',  name: 'Icon Circle + Shadow',  category: 'Card', desc: 'Prominent circular icon, soft shadow' },
    { id: 'v7',  name: 'Underline Accent',      category: 'Card', desc: 'Left-aligned, animated bottom line' },
    { id: 'v8',  name: 'Cream + Left Border',   category: 'Card', desc: 'Cream bg, left border accent, horizontal' },
    { id: 'v9',  name: 'Numbered Badges',       category: 'Card', desc: 'Large index number with stacked info' },
    { id: 'v10', name: 'Glass Card',            category: 'Card', desc: 'Translucent, blur, subtle border' },
  ],
};

const tabs = [{ key: 'awards', label: 'Awards', color: 'default' }];

const variationMap = { v1: AwardsV1, v2: AwardsV2, v3: AwardsV3, v4: AwardsV4, v5: AwardsV5, v6: AwardsV6, v7: AwardsV7, v8: AwardsV8, v9: AwardsV9, v10: AwardsV10 };

export default function AwardVariations() {
  const [currentVariation, setCurrentVariation] = useState('v1');
  const VariationComponent = variationMap[currentVariation] || AwardsV1;

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@400;500;600;700&family=Share+Tech+Mono&display=swap');
        .aw-page { min-height: 100vh; background: #faf9f6; padding: 4rem 2rem; }
      `}</style>
      <div className="aw-page">
        <VariationComponent />
      </div>
      <Picker
        sections={sections}
        tabs={tabs}
        storageKey="award-variations-picker"
        title="Awards Picker"
        onItemSelect={(item) => setCurrentVariation(item.id)}
      />
    </>
  );
}

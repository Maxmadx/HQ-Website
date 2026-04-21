// R66 Benefits — display-pattern variants.
// Five distinct approaches for surfacing the R66 benefits/selling points from
// src/lib/robinsonBenefits.json. Each variant is self-contained and can be
// lifted straight into AircraftR66.jsx once the preferred pattern is chosen.

import { useEffect, useMemo, useRef, useState } from 'react';
import benefits from '../lib/robinsonBenefits.json';

// ---------- Shared data & labels ----------
const r66 = benefits.r66;

const CATEGORY_LABELS = {
  turbineAdvantages:    'Turbine Advantages',
  missionCapability:    'Mission Capability',
  economics:            'Economics',
  performance:          'Performance',
  systemsAndCockpit:    'Systems & Cockpit',
  ownershipAndSupport:  'Ownership & Support',
  marketPosition:       'Market Position',
  safety:               'Safety',
};

const CATEGORY_INTRO = {
  turbineAdvantages:    "Robinson built the R66 around the Rolls-Royce RR300. Everything that follows — the simplicity, the altitude performance, the Jet-A footprint — flows from that single engine choice.",
  missionCapability:    "Five seats, a lockable cargo hold, single-pilot IFR and a factory-built variant list covering news, police, utility and floats.",
  economics:            "Turbine reliability with published annual operating costs. The only single-engine turbine where Robinson's cost transparency applies to every figure.",
  performance:          "125 kt cruise, 14,000 ft service ceiling, flat-rated power at altitude — built to stay capable when density altitude works against you.",
  systemsAndCockpit:    "Garmin G500H TXi, digital engine monitoring, TAWS, ADS-B — all factory-standard. Turbine cockpit without turbine complexity.",
  ownershipAndSupport:  "Factory support from Torrance, Rolls-Royce global support, dealer network in 70+ countries. The most supported light turbine in production.",
  marketPosition:       "1,500+ built, a liquid used market, and the flagship of the Robinson range.",
  safety:               "Robinson Safety Course, published component life limits, open Safety Notices, and single-pilot IFR certification.",
};

const CATEGORY_KEYS = Object.keys(CATEGORY_LABELS);

// ===========================================================================
// VARIANT A — Tabbed Category Board
// Horizontal tabs across top; 2-col card grid below. High information density.
// ===========================================================================
function VariantTabbed() {
  const [activeKey, setActiveKey] = useState(CATEGORY_KEYS[0]);
  const items = r66.benefits[activeKey] || [];

  return (
    <section className="rbv-a">
      <div className="rbv-a__container">
        <div className="rbv-a__header">
          <span className="r66-pre-text">WHY THE R66</span>
          <h2 className="rbv-a__title">The benefits, by category.</h2>
        </div>

        <div className="rbv-a__tabs" role="tablist">
          {CATEGORY_KEYS.map((key) => (
            <button
              key={key}
              role="tab"
              aria-selected={key === activeKey}
              onClick={() => setActiveKey(key)}
              className={`rbv-a__tab${key === activeKey ? ' rbv-a__tab--active' : ''}`}
            >
              {CATEGORY_LABELS[key]}
              <span className="rbv-a__tab-count">{r66.benefits[key]?.length || 0}</span>
            </button>
          ))}
        </div>

        <p className="rbv-a__intro">{CATEGORY_INTRO[activeKey]}</p>

        <div className="rbv-a__grid">
          {items.map((b, i) => (
            <div key={i} className="rbv-a__card">
              <span className="rbv-a__card-num">{String(i + 1).padStart(2, '0')}</span>
              <h4 className="rbv-a__card-title">{b.headline}</h4>
              <p className="rbv-a__card-body">{b.body}</p>
            </div>
          ))}
        </div>
      </div>

      <style>{`
        .rbv-a { background: #faf9f6; padding: 6rem 0; color: #1a1a1a; }
        .rbv-a__container { max-width: 1280px; margin: 0 auto; padding: 0 2rem; }
        .rbv-a__header { margin-bottom: 2.5rem; }
        .rbv-a__title {
          font-family: 'Space Grotesk', sans-serif;
          font-size: clamp(2rem, 4vw, 3rem);
          font-weight: 300;
          letter-spacing: -0.02em;
          margin: 0.75rem 0 0;
        }
        .rbv-a__tabs {
          display: flex;
          flex-wrap: wrap;
          gap: 0.5rem;
          margin-bottom: 2rem;
          border-bottom: 1px solid #e0ded8;
          padding-bottom: 1rem;
        }
        .rbv-a__tab {
          position: relative;
          background: transparent;
          border: 1px solid #d8d6d0;
          padding: 0.6rem 1rem;
          font-family: 'Space Grotesk', sans-serif;
          font-size: 0.82rem;
          font-weight: 500;
          color: #4a4a4a;
          cursor: pointer;
          transition: all 0.2s ease;
          display: inline-flex;
          gap: 0.5rem;
          align-items: center;
        }
        .rbv-a__tab:hover { border-color: #1a1a1a; color: #1a1a1a; }
        .rbv-a__tab--active {
          background: #1a1a1a;
          color: #faf9f6;
          border-color: #1a1a1a;
        }
        .rbv-a__tab-count {
          font-family: 'Share Tech Mono', monospace;
          font-size: 0.65rem;
          opacity: 0.7;
          padding: 0.1rem 0.4rem;
          border: 1px solid currentColor;
          border-radius: 2px;
        }
        .rbv-a__intro {
          font-family: 'Space Grotesk', sans-serif;
          font-size: 1.05rem;
          line-height: 1.6;
          color: #4a4a4a;
          max-width: 800px;
          margin: 0 0 2.5rem;
        }
        .rbv-a__grid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 1.5rem;
        }
        @media (max-width: 768px) { .rbv-a__grid { grid-template-columns: 1fr; } }
        .rbv-a__card {
          background: #fff;
          border: 1px solid #e8e6e2;
          padding: 1.75rem;
          position: relative;
          transition: all 0.3s ease;
        }
        .rbv-a__card:hover {
          border-color: #a67b3f;
          transform: translateY(-2px);
        }
        .rbv-a__card-num {
          font-family: 'Share Tech Mono', monospace;
          font-size: 0.7rem;
          color: #a67b3f;
          letter-spacing: 0.15em;
        }
        .rbv-a__card-title {
          font-family: 'Space Grotesk', sans-serif;
          font-size: 1.05rem;
          font-weight: 600;
          margin: 0.5rem 0 0.75rem;
          line-height: 1.35;
        }
        .rbv-a__card-body {
          font-family: 'Space Grotesk', sans-serif;
          font-size: 0.88rem;
          line-height: 1.6;
          color: #666;
          margin: 0;
        }
      `}</style>
    </section>
  );
}

// ===========================================================================
// VARIANT B — Editorial Vertical Stack
// Each category = a full-bleed magazine section with intro + grid.
// Slower, premium read. Alternating warm/charcoal backgrounds.
// ===========================================================================
function VariantEditorial() {
  return (
    <section className="rbv-b">
      <div className="rbv-b__hero">
        <div className="rbv-b__hero-inner">
          <span className="r66-pre-text">WHY THE R66</span>
          <h2 className="rbv-b__hero-title">Every reason owners choose it.</h2>
        </div>
      </div>

      {CATEGORY_KEYS.map((key, idx) => {
        const items = r66.benefits[key] || [];
        const dark = idx % 2 === 1;
        return (
          <div key={key} className={`rbv-b__block${dark ? ' rbv-b__block--dark' : ''}`}>
            <div className="rbv-b__block-inner">
              <div className="rbv-b__block-head">
                <span className="rbv-b__block-index">{String(idx + 1).padStart(2, '0')}</span>
                <div>
                  <span className="r66-pre-text">{CATEGORY_LABELS[key].toUpperCase()}</span>
                  <h3 className="rbv-b__block-title">{CATEGORY_LABELS[key]}</h3>
                </div>
              </div>
              <p className="rbv-b__block-intro">{CATEGORY_INTRO[key]}</p>
              <ul className="rbv-b__list">
                {items.map((b, i) => (
                  <li key={i} className="rbv-b__item">
                    <span className="rbv-b__item-bullet" />
                    <div>
                      <h4 className="rbv-b__item-head">{b.headline}</h4>
                      <p className="rbv-b__item-body">{b.body}</p>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        );
      })}

      <style>{`
        .rbv-b { font-family: 'Space Grotesk', sans-serif; }
        .rbv-b__hero {
          background: #1a1a1a;
          color: #faf9f6;
          padding: 6rem 2rem;
        }
        .rbv-b__hero-inner { max-width: 1280px; margin: 0 auto; }
        .rbv-b__hero-title {
          font-family: 'Space Grotesk', sans-serif;
          font-size: clamp(2.5rem, 6vw, 4.5rem);
          font-weight: 300;
          letter-spacing: -0.02em;
          margin: 0.75rem 0 0;
          max-width: 900px;
        }
        .rbv-b__block {
          background: #faf9f6;
          padding: 5rem 2rem;
        }
        .rbv-b__block--dark {
          background: #ececec;
        }
        .rbv-b__block-inner { max-width: 1280px; margin: 0 auto; }
        .rbv-b__block-head {
          display: flex;
          gap: 2rem;
          align-items: flex-start;
          padding-bottom: 1.5rem;
          border-bottom: 1px solid #c8c6bf;
          margin-bottom: 2rem;
        }
        .rbv-b__block-index {
          font-family: 'Share Tech Mono', monospace;
          font-size: 3rem;
          font-weight: 400;
          color: #a67b3f;
          line-height: 1;
        }
        .rbv-b__block-title {
          font-size: clamp(1.75rem, 3.5vw, 2.75rem);
          font-weight: 300;
          letter-spacing: -0.02em;
          margin: 0.5rem 0 0;
        }
        .rbv-b__block-intro {
          font-size: 1.1rem;
          line-height: 1.6;
          color: #4a4a4a;
          max-width: 780px;
          margin: 0 0 3rem;
        }
        .rbv-b__list {
          list-style: none;
          padding: 0;
          margin: 0;
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          column-gap: 3rem;
          row-gap: 1.75rem;
        }
        @media (max-width: 768px) { .rbv-b__list { grid-template-columns: 1fr; } }
        .rbv-b__item { display: flex; gap: 1rem; }
        .rbv-b__item-bullet {
          flex-shrink: 0;
          width: 8px;
          height: 8px;
          border-radius: 50%;
          background: #a67b3f;
          margin-top: 0.5rem;
        }
        .rbv-b__item-head {
          font-size: 1rem;
          font-weight: 600;
          margin: 0 0 0.35rem;
          line-height: 1.35;
        }
        .rbv-b__item-body {
          font-size: 0.9rem;
          line-height: 1.6;
          color: #666;
          margin: 0;
        }
      `}</style>
    </section>
  );
}

// ===========================================================================
// VARIANT C — Horizontal Snap Carousels (one per category)
// Matches the existing R66 page aesthetic: dark section with frosted cards.
// ===========================================================================
function VariantCarousel() {
  return (
    <section className="rbv-c">
      <div className="rbv-c__container">
        <div className="rbv-c__header">
          <span className="r66-pre-text rbv-c__pre">WHY THE R66</span>
          <h2 className="rbv-c__title">Eight reasons, eight angles.</h2>
        </div>

        {CATEGORY_KEYS.map((key) => {
          const items = r66.benefits[key] || [];
          return (
            <div key={key} className="rbv-c__row">
              <div className="rbv-c__row-head">
                <h3 className="rbv-c__row-title">{CATEGORY_LABELS[key]}</h3>
                <span className="rbv-c__row-count">{items.length} points</span>
              </div>
              <div className="rbv-c__scroller">
                {items.map((b, i) => (
                  <article key={i} className="rbv-c__card">
                    <span className="rbv-c__card-idx">{String(i + 1).padStart(2, '0')}</span>
                    <h4 className="rbv-c__card-head">{b.headline}</h4>
                    <p className="rbv-c__card-body">{b.body}</p>
                  </article>
                ))}
              </div>
            </div>
          );
        })}
      </div>

      <style>{`
        .rbv-c {
          background: #1a1a1a;
          color: #faf9f6;
          padding: 6rem 0;
          font-family: 'Space Grotesk', sans-serif;
        }
        .rbv-c__container { max-width: 1400px; margin: 0 auto; padding: 0 2rem; }
        .rbv-c__header { margin-bottom: 3rem; }
        .rbv-c__pre { color: #a67b3f; }
        .rbv-c__title {
          font-size: clamp(2rem, 4vw, 3rem);
          font-weight: 300;
          letter-spacing: -0.02em;
          margin: 0.75rem 0 0;
        }
        .rbv-c__row { margin-bottom: 3rem; }
        .rbv-c__row-head {
          display: flex;
          justify-content: space-between;
          align-items: baseline;
          margin-bottom: 1rem;
          padding-bottom: 0.75rem;
          border-bottom: 1px solid rgba(255,255,255,0.15);
        }
        .rbv-c__row-title {
          font-size: 1.25rem;
          font-weight: 500;
          margin: 0;
        }
        .rbv-c__row-count {
          font-family: 'Share Tech Mono', monospace;
          font-size: 0.75rem;
          letter-spacing: 0.1em;
          text-transform: uppercase;
          color: #a67b3f;
        }
        .rbv-c__scroller {
          display: flex;
          gap: 1rem;
          overflow-x: auto;
          scroll-snap-type: x mandatory;
          padding-bottom: 1rem;
          scrollbar-width: thin;
          scrollbar-color: #a67b3f #2a2a2a;
        }
        .rbv-c__scroller::-webkit-scrollbar { height: 6px; }
        .rbv-c__scroller::-webkit-scrollbar-track { background: #2a2a2a; }
        .rbv-c__scroller::-webkit-scrollbar-thumb { background: #a67b3f; }
        .rbv-c__card {
          flex: 0 0 320px;
          scroll-snap-align: start;
          background: rgba(255,255,255,0.03);
          border: 1px solid rgba(255,255,255,0.08);
          padding: 1.75rem;
          transition: all 0.3s ease;
        }
        .rbv-c__card:hover {
          background: rgba(255,255,255,0.06);
          border-color: #a67b3f;
        }
        .rbv-c__card-idx {
          font-family: 'Share Tech Mono', monospace;
          font-size: 0.7rem;
          color: #a67b3f;
          letter-spacing: 0.15em;
        }
        .rbv-c__card-head {
          font-size: 1rem;
          font-weight: 600;
          margin: 0.5rem 0 0.75rem;
          line-height: 1.35;
        }
        .rbv-c__card-body {
          font-size: 0.85rem;
          line-height: 1.6;
          color: rgba(255,255,255,0.7);
          margin: 0;
        }
      `}</style>
    </section>
  );
}

// ===========================================================================
// VARIANT D — Competitor Face-Off
// Interactive competitor selector. User picks what they're cross-shopping
// against; R66's case appears as a bulleted argument. Pure sales mode.
// ===========================================================================
function VariantFaceOff() {
  const [activeIdx, setActiveIdx] = useState(0);
  const comps = r66.comparisonPoints;
  const active = comps[activeIdx];

  return (
    <section className="rbv-d">
      <div className="rbv-d__container">
        <div className="rbv-d__header">
          <span className="r66-pre-text">CROSS-SHOPPING THE R66</span>
          <h2 className="rbv-d__title">What are you considering instead?</h2>
          <p className="rbv-d__sub">Pick the alternative — the R66's case against it appears below.</p>
        </div>

        <div className="rbv-d__chips">
          {comps.map((c, i) => (
            <button
              key={c.competitor}
              onClick={() => setActiveIdx(i)}
              className={`rbv-d__chip${i === activeIdx ? ' rbv-d__chip--active' : ''}`}
            >
              {c.competitor}
            </button>
          ))}
        </div>

        <div className="rbv-d__board">
          <div className="rbv-d__side rbv-d__side--them">
            <span className="r66-pre-text">THE ALTERNATIVE</span>
            <h3 className="rbv-d__side-title">{active.competitor}</h3>
          </div>
          <div className="rbv-d__divider">
            <span>VS</span>
          </div>
          <div className="rbv-d__side rbv-d__side--us">
            <span className="r66-pre-text rbv-d__accent">ROBINSON R66</span>
            <h3 className="rbv-d__side-title">The case for the R66</h3>
            <ul className="rbv-d__points">
              {active.points.map((p, i) => (
                <li key={i} className="rbv-d__point">
                  <span className="rbv-d__point-mark">▸</span>
                  <span>{p}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      <style>{`
        .rbv-d {
          background: #faf9f6;
          padding: 6rem 0;
          font-family: 'Space Grotesk', sans-serif;
          color: #1a1a1a;
        }
        .rbv-d__container { max-width: 1280px; margin: 0 auto; padding: 0 2rem; }
        .rbv-d__header { text-align: center; margin-bottom: 2.5rem; }
        .rbv-d__title {
          font-size: clamp(2rem, 4vw, 3rem);
          font-weight: 300;
          letter-spacing: -0.02em;
          margin: 0.75rem 0 0.5rem;
        }
        .rbv-d__sub { color: #666; margin: 0; }
        .rbv-d__chips {
          display: flex;
          flex-wrap: wrap;
          justify-content: center;
          gap: 0.5rem;
          margin-bottom: 3rem;
        }
        .rbv-d__chip {
          background: transparent;
          border: 1px solid #c8c6bf;
          padding: 0.6rem 1rem;
          font-family: 'Space Grotesk', sans-serif;
          font-size: 0.85rem;
          font-weight: 500;
          color: #4a4a4a;
          cursor: pointer;
          border-radius: 999px;
          transition: all 0.2s ease;
        }
        .rbv-d__chip:hover { border-color: #1a1a1a; color: #1a1a1a; }
        .rbv-d__chip--active {
          background: #1a1a1a;
          color: #faf9f6;
          border-color: #1a1a1a;
        }
        .rbv-d__board {
          display: grid;
          grid-template-columns: 1fr auto 1.25fr;
          gap: 2rem;
          align-items: stretch;
          background: #fff;
          border: 1px solid #e8e6e2;
          padding: 2.5rem;
          min-height: 380px;
        }
        @media (max-width: 900px) {
          .rbv-d__board { grid-template-columns: 1fr; gap: 1.5rem; }
          .rbv-d__divider { order: 2; }
        }
        .rbv-d__side { padding: 0.5rem 0; }
        .rbv-d__side--them { color: #7a7a7a; }
        .rbv-d__side-title {
          font-size: 1.5rem;
          font-weight: 400;
          margin: 0.5rem 0 1.5rem;
          letter-spacing: -0.01em;
        }
        .rbv-d__side--us .rbv-d__side-title { color: #1a1a1a; }
        .rbv-d__accent { color: #a67b3f !important; }
        .rbv-d__divider {
          display: flex;
          align-items: center;
          justify-content: center;
          font-family: 'Share Tech Mono', monospace;
          font-size: 0.7rem;
          letter-spacing: 0.3em;
          color: #c8c6bf;
          border-left: 1px solid #e8e6e2;
          border-right: 1px solid #e8e6e2;
          padding: 0 1.5rem;
        }
        @media (max-width: 900px) {
          .rbv-d__divider { border: none; border-top: 1px solid #e8e6e2; border-bottom: 1px solid #e8e6e2; padding: 0.75rem 0; }
        }
        .rbv-d__points {
          list-style: none;
          padding: 0;
          margin: 0;
          display: flex;
          flex-direction: column;
          gap: 0.85rem;
        }
        .rbv-d__point {
          display: flex;
          gap: 0.75rem;
          font-size: 0.95rem;
          line-height: 1.55;
        }
        .rbv-d__point-mark {
          color: #a67b3f;
          font-weight: 700;
        }
      `}</style>
    </section>
  );
}

// ===========================================================================
// VARIANT E — Bento / Feature Tiles
// Mixed-size tile layout that surfaces a curated hero selection of benefits.
// Each category contributes its lead point; a few large feature tiles hold
// the "headline stats" (cruise, TBO, range).
// ===========================================================================
function VariantBento() {
  const featured = useMemo(() => {
    // First item of each category — the most persuasive per taxonomy.
    return CATEGORY_KEYS.map((k) => ({
      category: CATEGORY_LABELS[k],
      ...r66.benefits[k][0],
    }));
  }, []);

  return (
    <section className="rbv-e">
      <div className="rbv-e__container">
        <div className="rbv-e__header">
          <span className="r66-pre-text">WHY THE R66 — AT A GLANCE</span>
          <h2 className="rbv-e__title">The case, distilled.</h2>
        </div>

        <div className="rbv-e__grid">
          <div className="rbv-e__tile rbv-e__tile--stat rbv-e__tile--span2">
            <span className="rbv-e__stat-value">125</span>
            <span className="rbv-e__stat-unit">kt cruise</span>
            <p className="rbv-e__stat-note">Point-to-point flight starts making real sense.</p>
          </div>
          <div className="rbv-e__tile rbv-e__tile--stat">
            <span className="rbv-e__stat-value">2,000</span>
            <span className="rbv-e__stat-unit">hours to TBO</span>
          </div>
          <div className="rbv-e__tile rbv-e__tile--stat">
            <span className="rbv-e__stat-value">14,000</span>
            <span className="rbv-e__stat-unit">ft ceiling</span>
          </div>

          {featured.map((b, i) => (
            <div key={i} className={`rbv-e__tile${i === 0 ? ' rbv-e__tile--span2' : ''}${i === 3 ? ' rbv-e__tile--dark' : ''}`}>
              <span className="rbv-e__tile-cat">{b.category}</span>
              <h4 className="rbv-e__tile-head">{b.headline}</h4>
              <p className="rbv-e__tile-body">{b.body}</p>
            </div>
          ))}

          <div className="rbv-e__tile rbv-e__tile--cta rbv-e__tile--span2">
            <span className="r66-pre-text">SEE IT FULLY</span>
            <h3 className="rbv-e__cta-head">39 reasons, organised eight ways.</h3>
            <p className="rbv-e__cta-body">Read the full R66 case — turbine, cabin, economics, support — section by section.</p>
          </div>
        </div>
      </div>

      <style>{`
        .rbv-e {
          background: #faf9f6;
          padding: 6rem 0;
          font-family: 'Space Grotesk', sans-serif;
          color: #1a1a1a;
        }
        .rbv-e__container { max-width: 1280px; margin: 0 auto; padding: 0 2rem; }
        .rbv-e__header { margin-bottom: 2.5rem; }
        .rbv-e__title {
          font-size: clamp(2rem, 4vw, 3rem);
          font-weight: 300;
          letter-spacing: -0.02em;
          margin: 0.75rem 0 0;
        }
        .rbv-e__grid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 1rem;
        }
        @media (max-width: 900px) { .rbv-e__grid { grid-template-columns: repeat(2, 1fr); } }
        @media (max-width: 600px) { .rbv-e__grid { grid-template-columns: 1fr; } }
        .rbv-e__tile {
          background: #fff;
          border: 1px solid #e8e6e2;
          padding: 1.5rem;
          min-height: 180px;
          display: flex;
          flex-direction: column;
          justify-content: flex-end;
          transition: all 0.3s ease;
        }
        .rbv-e__tile:hover { border-color: #a67b3f; transform: translateY(-2px); }
        .rbv-e__tile--span2 { grid-column: span 2; }
        @media (max-width: 600px) { .rbv-e__tile--span2 { grid-column: span 1; } }
        .rbv-e__tile--stat {
          background: #1a1a1a;
          color: #faf9f6;
          border-color: #1a1a1a;
          min-height: 220px;
        }
        .rbv-e__tile--stat:hover { border-color: #a67b3f; }
        .rbv-e__tile--dark { background: #1a1a1a; color: #faf9f6; border-color: #1a1a1a; }
        .rbv-e__stat-value {
          font-family: 'Space Grotesk', sans-serif;
          font-size: clamp(3rem, 6vw, 5rem);
          font-weight: 300;
          letter-spacing: -0.04em;
          line-height: 1;
          color: #a67b3f;
        }
        .rbv-e__stat-unit {
          font-family: 'Share Tech Mono', monospace;
          font-size: 0.85rem;
          letter-spacing: 0.15em;
          text-transform: uppercase;
          margin-top: 0.5rem;
        }
        .rbv-e__stat-note {
          font-size: 0.85rem;
          line-height: 1.55;
          color: rgba(255,255,255,0.7);
          margin: 0.75rem 0 0;
          max-width: 280px;
        }
        .rbv-e__tile-cat {
          font-family: 'Share Tech Mono', monospace;
          font-size: 0.65rem;
          letter-spacing: 0.2em;
          text-transform: uppercase;
          color: #a67b3f;
        }
        .rbv-e__tile-head {
          font-size: 1.05rem;
          font-weight: 600;
          margin: 0.5rem 0 0.5rem;
          line-height: 1.35;
        }
        .rbv-e__tile-body {
          font-size: 0.85rem;
          line-height: 1.55;
          color: #666;
          margin: 0;
        }
        .rbv-e__tile--dark .rbv-e__tile-body { color: rgba(255,255,255,0.7); }
        .rbv-e__tile--cta {
          background: linear-gradient(135deg, #a67b3f 0%, #8a6330 100%);
          color: #faf9f6;
          border-color: transparent;
          justify-content: center;
        }
        .rbv-e__tile--cta .r66-pre-text { color: rgba(255,255,255,0.8); }
        .rbv-e__cta-head {
          font-size: clamp(1.3rem, 2.5vw, 1.8rem);
          font-weight: 400;
          letter-spacing: -0.01em;
          margin: 0.5rem 0;
        }
        .rbv-e__cta-body {
          font-size: 0.9rem;
          line-height: 1.5;
          margin: 0;
          color: rgba(255,255,255,0.85);
        }
      `}</style>
    </section>
  );
}

// ===========================================================================
// VARIANT F — Flight Profile Scroll Path
// Scroll-linked: as the user scrolls through this section, a helicopter icon
// traverses an SVG flight path (taxi → climb → cruise → approach → land).
// Each phase of flight surfaces the benefits that actually matter there.
// ===========================================================================
function VariantFlightProfile() {
  const sectionRef = useRef(null);
  const [progress, setProgress] = useState(0); // 0 to 1

  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;
    const update = () => {
      const rect = el.getBoundingClientRect();
      const vh = window.innerHeight;
      const total = rect.height - vh;
      if (total <= 0) return;
      const passed = -rect.top;
      setProgress(Math.max(0, Math.min(1, passed / total)));
    };
    update();
    window.addEventListener('scroll', update, { passive: true });
    window.addEventListener('resize', update);
    return () => {
      window.removeEventListener('scroll', update);
      window.removeEventListener('resize', update);
    };
  }, []);

  const phases = [
    {
      label: 'PRE-FLIGHT',
      title: 'Turbine start. No drama.',
      benefits: [
        'No mixture, no carb heat, no priming sequence',
        'Digital engine monitoring enforces limits automatically',
        'Jet-A on the ramp — no AvGas logistics',
      ],
    },
    {
      label: 'CLIMB',
      title: 'Flat-rated power, to altitude.',
      benefits: [
        'RR300 delivers full rated power deep into density altitude',
        '14,000 ft service ceiling — meaningful capability at the top',
        'Hot-and-high performance a piston single cannot match',
      ],
    },
    {
      label: 'CRUISE',
      title: '125 kt. Three hours. Jet-A.',
      benefits: [
        '350 nm range on a standard tank',
        'Quiet cabin — turbine smoothness, low vibration',
        'Garmin G500H TXi + TAWS + ADS-B factory-standard',
      ],
    },
    {
      label: 'APPROACH',
      title: 'Single-pilot IFR capable.',
      benefits: [
        'IFR-certified variant available from factory',
        'Synthetic vision and moving map included',
        'Low switch-count panel — workload stays low in IMC',
      ],
    },
    {
      label: 'ARRIVAL',
      title: 'Five seats, locked cargo, any surface.',
      benefits: [
        '300 lb external-access cargo hold',
        'Utility / Hi-Skid variant for rough surfaces',
        'Cargo hook for external load missions',
      ],
    },
  ];

  const activePhase = Math.min(phases.length - 1, Math.floor(progress * phases.length));

  // Helicopter position along the SVG flight path
  const pathX = 60 + progress * 1080; // sweep across the viewport
  const pathY = 260 - Math.sin(progress * Math.PI) * 160; // arc

  return (
    <section ref={sectionRef} className="rbv-f">
      <div className="rbv-f__sticky">
        <div className="rbv-f__header">
          <span className="r66-pre-text rbv-f__pre">R66 · A FLIGHT, DECONSTRUCTED</span>
          <h2 className="rbv-f__title">Every phase of flight has a benefit.</h2>
        </div>

        <svg className="rbv-f__svg" viewBox="0 0 1200 300" preserveAspectRatio="none" aria-hidden="true">
          {/* ground line */}
          <line x1="0" y1="260" x2="1200" y2="260" stroke="rgba(255,255,255,0.15)" strokeWidth="1" />
          {/* flight arc */}
          <path
            d="M 60 260 Q 300 100, 600 100 T 1140 260"
            fill="none"
            stroke="rgba(255,255,255,0.25)"
            strokeWidth="2"
            strokeDasharray="4 6"
          />
          {/* traversed arc */}
          <path
            d="M 60 260 Q 300 100, 600 100 T 1140 260"
            fill="none"
            stroke="#a67b3f"
            strokeWidth="3"
            strokeDasharray="1200"
            strokeDashoffset={1200 - progress * 1200}
            style={{ transition: 'stroke-dashoffset 0.1s linear' }}
          />
          {/* phase markers */}
          {phases.map((p, i) => {
            const t = i / (phases.length - 1);
            const x = 60 + t * 1080;
            const y = 260 - Math.sin(t * Math.PI) * 160;
            const active = i <= activePhase;
            return (
              <g key={i}>
                <circle cx={x} cy={y} r="8" fill={active ? '#a67b3f' : '#2a2a2a'} stroke={active ? '#faf9f6' : 'rgba(255,255,255,0.35)'} strokeWidth="2" />
                <text x={x} y={y - 22} textAnchor="middle" fill={active ? '#faf9f6' : 'rgba(255,255,255,0.5)'} fontSize="10" fontFamily="Share Tech Mono, monospace" letterSpacing="0.15em">{p.label}</text>
              </g>
            );
          })}
          {/* helicopter marker */}
          <g transform={`translate(${pathX}, ${pathY})`}>
            <circle r="14" fill="#faf9f6" />
            <text textAnchor="middle" y="5" fontSize="14">🚁</text>
          </g>
        </svg>

        <div className="rbv-f__card">
          <span className="rbv-f__phase-label">{phases[activePhase].label}</span>
          <h3 className="rbv-f__phase-title">{phases[activePhase].title}</h3>
          <ul className="rbv-f__phase-list">
            {phases[activePhase].benefits.map((b, i) => (
              <li key={i}>
                <span className="rbv-f__tick">✦</span>
                <span>{b}</span>
              </li>
            ))}
          </ul>
          <div className="rbv-f__progress">
            <span>{String(activePhase + 1).padStart(2, '0')} / {String(phases.length).padStart(2, '0')}</span>
            <div className="rbv-f__progress-bar"><div style={{ width: `${progress * 100}%` }} /></div>
          </div>
        </div>
      </div>

      {/* scroll spacer — gives the sticky section room to animate through */}
      <div style={{ height: '240vh' }} />

      <style>{`
        .rbv-f {
          background: #0e0e0e;
          color: #faf9f6;
          font-family: 'Space Grotesk', sans-serif;
          position: relative;
        }
        .rbv-f__sticky {
          position: sticky;
          top: 0;
          height: 100vh;
          padding: 4rem 2rem 2rem;
          display: flex;
          flex-direction: column;
          gap: 2rem;
          overflow: hidden;
        }
        .rbv-f__pre { color: #a67b3f; }
        .rbv-f__title {
          font-size: clamp(1.8rem, 3.5vw, 2.8rem);
          font-weight: 300;
          letter-spacing: -0.02em;
          margin: 0.75rem 0 0;
          max-width: 900px;
        }
        .rbv-f__header { max-width: 1280px; margin: 0 auto; width: 100%; }
        .rbv-f__svg {
          width: 100%;
          height: 260px;
          flex-shrink: 0;
          max-width: 1280px;
          margin: 0 auto;
        }
        .rbv-f__card {
          max-width: 760px;
          margin: 0 auto;
          background: rgba(255,255,255,0.04);
          border: 1px solid rgba(255,255,255,0.1);
          border-left: 3px solid #a67b3f;
          padding: 1.75rem 2rem;
          transition: all 0.3s ease;
        }
        .rbv-f__phase-label {
          font-family: 'Share Tech Mono', monospace;
          font-size: 0.75rem;
          letter-spacing: 0.25em;
          color: #a67b3f;
        }
        .rbv-f__phase-title {
          font-size: clamp(1.4rem, 2.5vw, 2rem);
          font-weight: 400;
          letter-spacing: -0.01em;
          margin: 0.5rem 0 1.25rem;
        }
        .rbv-f__phase-list {
          list-style: none;
          padding: 0;
          margin: 0 0 1.25rem;
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
        }
        .rbv-f__phase-list li {
          display: flex;
          gap: 0.85rem;
          align-items: baseline;
          font-size: 0.95rem;
          line-height: 1.5;
          color: rgba(255,255,255,0.85);
        }
        .rbv-f__tick { color: #a67b3f; }
        .rbv-f__progress {
          display: flex;
          gap: 1rem;
          align-items: center;
          font-family: 'Share Tech Mono', monospace;
          font-size: 0.7rem;
          color: rgba(255,255,255,0.55);
          letter-spacing: 0.15em;
        }
        .rbv-f__progress-bar {
          flex: 1;
          height: 1px;
          background: rgba(255,255,255,0.15);
          overflow: hidden;
        }
        .rbv-f__progress-bar > div {
          height: 100%;
          background: #a67b3f;
          transition: width 0.1s linear;
        }
      `}</style>
    </section>
  );
}

// ===========================================================================
// VARIANT G — Data Terminal
// Ops-room aesthetic. Monospaced, dense, colour-coded by category. Every
// benefit is a row with a category code, severity indicator, and text.
// ===========================================================================
function VariantDataTerminal() {
  const [filter, setFilter] = useState('ALL');

  // Flatten all benefits with their category code
  const rows = useMemo(() => {
    const codeMap = {
      turbineAdvantages:    'TRB',
      missionCapability:    'MSN',
      economics:            'ECO',
      performance:          'PRF',
      systemsAndCockpit:    'SYS',
      ownershipAndSupport:  'OWN',
      marketPosition:       'MKT',
      safety:               'SFE',
    };
    return CATEGORY_KEYS.flatMap((key) =>
      r66.benefits[key].map((b, i) => ({
        code: codeMap[key],
        category: CATEGORY_LABELS[key],
        idx: String(i + 1).padStart(2, '0'),
        headline: b.headline,
        body: b.body,
      })),
    );
  }, []);

  const filtered = filter === 'ALL' ? rows : rows.filter((r) => r.code === filter);
  const codes = ['ALL', ...Array.from(new Set(rows.map((r) => r.code)))];

  return (
    <section className="rbv-g">
      <div className="rbv-g__container">
        <div className="rbv-g__bar">
          <div className="rbv-g__bar-left">
            <span className="rbv-g__dot rbv-g__dot--live" />
            <span className="rbv-g__brand">R66 · BENEFITS.TERMINAL</span>
            <span className="rbv-g__meta">v2026.04 · {rows.length} records</span>
          </div>
          <div className="rbv-g__bar-right">
            {new Date().toISOString().replace('T', ' ').slice(0, 19)} UTC
          </div>
        </div>

        <div className="rbv-g__filters">
          {codes.map((c) => (
            <button
              key={c}
              onClick={() => setFilter(c)}
              className={`rbv-g__filter${filter === c ? ' rbv-g__filter--active' : ''}`}
            >
              {c}
              <span>{c === 'ALL' ? rows.length : rows.filter((r) => r.code === c).length}</span>
            </button>
          ))}
        </div>

        <div className="rbv-g__table">
          <div className="rbv-g__thead">
            <span>#</span>
            <span>CODE</span>
            <span>HEADLINE</span>
            <span>SUPPORT</span>
          </div>
          {filtered.map((r, i) => (
            <div key={i} className="rbv-g__trow">
              <span className="rbv-g__num">{String(i + 1).padStart(3, '0')}</span>
              <span className={`rbv-g__code rbv-g__code--${r.code}`}>{r.code}</span>
              <span className="rbv-g__head">{r.headline}</span>
              <span className="rbv-g__support">{r.body}</span>
            </div>
          ))}
        </div>
      </div>

      <style>{`
        .rbv-g {
          background: #0a0a0a;
          color: #e8e6e2;
          padding: 4rem 0;
          font-family: 'Share Tech Mono', monospace;
        }
        .rbv-g__container { max-width: 1400px; margin: 0 auto; padding: 0 1.5rem; }
        .rbv-g__bar {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 0.75rem 1rem;
          background: #111;
          border: 1px solid #1f1f1f;
          font-size: 0.72rem;
          letter-spacing: 0.1em;
          margin-bottom: 1rem;
        }
        .rbv-g__bar-left { display: flex; gap: 1rem; align-items: center; }
        .rbv-g__dot {
          width: 8px;
          height: 8px;
          border-radius: 50%;
          background: #a67b3f;
          box-shadow: 0 0 8px #a67b3f;
        }
        .rbv-g__dot--live { animation: rbv-g-pulse 1.8s infinite; }
        @keyframes rbv-g-pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.3; }
        }
        .rbv-g__brand { color: #a67b3f; font-weight: 700; }
        .rbv-g__meta { color: #666; }
        .rbv-g__bar-right { color: #666; font-size: 0.7rem; }
        .rbv-g__filters {
          display: flex;
          flex-wrap: wrap;
          gap: 0.35rem;
          margin-bottom: 0.75rem;
        }
        .rbv-g__filter {
          background: #111;
          border: 1px solid #1f1f1f;
          padding: 0.4rem 0.7rem;
          color: #7a7a7a;
          font-family: 'Share Tech Mono', monospace;
          font-size: 0.7rem;
          letter-spacing: 0.1em;
          cursor: pointer;
          display: inline-flex;
          gap: 0.4rem;
          align-items: center;
          transition: all 0.15s ease;
        }
        .rbv-g__filter:hover { color: #e8e6e2; border-color: #a67b3f; }
        .rbv-g__filter--active {
          background: #a67b3f;
          color: #0a0a0a;
          border-color: #a67b3f;
          font-weight: 700;
        }
        .rbv-g__filter span {
          opacity: 0.7;
          font-size: 0.6rem;
        }
        .rbv-g__table {
          border: 1px solid #1f1f1f;
        }
        .rbv-g__thead {
          display: grid;
          grid-template-columns: 60px 80px 1.2fr 1.5fr;
          padding: 0.6rem 1rem;
          background: #111;
          border-bottom: 1px solid #1f1f1f;
          font-size: 0.65rem;
          letter-spacing: 0.2em;
          color: #666;
        }
        .rbv-g__trow {
          display: grid;
          grid-template-columns: 60px 80px 1.2fr 1.5fr;
          padding: 0.7rem 1rem;
          border-bottom: 1px solid #151515;
          font-size: 0.78rem;
          align-items: center;
          transition: background 0.12s ease;
        }
        .rbv-g__trow:hover { background: #0e0e0e; }
        .rbv-g__trow:last-child { border-bottom: none; }
        @media (max-width: 900px) {
          .rbv-g__thead { display: none; }
          .rbv-g__trow {
            grid-template-columns: 1fr;
            gap: 0.4rem;
          }
        }
        .rbv-g__num { color: #555; }
        .rbv-g__code {
          display: inline-block;
          padding: 0.15rem 0.45rem;
          border: 1px solid currentColor;
          font-size: 0.65rem;
          letter-spacing: 0.1em;
          width: fit-content;
        }
        .rbv-g__code--TRB { color: #d4a45f; }
        .rbv-g__code--MSN { color: #7fb069; }
        .rbv-g__code--ECO { color: #68a2c9; }
        .rbv-g__code--PRF { color: #e07856; }
        .rbv-g__code--SYS { color: #b286c9; }
        .rbv-g__code--OWN { color: #c2a77e; }
        .rbv-g__code--MKT { color: #8db596; }
        .rbv-g__code--SFE { color: #d06666; }
        .rbv-g__head {
          color: #faf9f6;
          font-family: 'Space Grotesk', sans-serif;
          font-size: 0.9rem;
          font-weight: 500;
        }
        .rbv-g__support {
          color: #7a7a7a;
          font-family: 'Space Grotesk', sans-serif;
          font-size: 0.82rem;
          line-height: 1.5;
        }
      `}</style>
    </section>
  );
}

// ===========================================================================
// VARIANT H — Typographic Manifesto
// No cards. No boxes. Just statements at scale, stacked, with rhythm.
// The supporting body text shows on hover/tap as a footnote beneath.
// ===========================================================================
function VariantManifesto() {
  const [hovered, setHovered] = useState(null);

  // Curated subset — only the most declarative lines work at manifesto scale.
  const statements = [
    { t: '125 kt.',                              s: 'Three hours in the air. 350 nautical miles. Jet-A.',                                       size: 'xl' },
    { t: 'Jet-A at every field.',                s: 'Globally stocked. Unlike AvGas, the R66 is supported where the world refuels.',           size: 'lg' },
    { t: 'Five seats. One cargo hold.',          s: '300 lb lockable bag space behind the cabin — unique in the class.',                       size: 'lg' },
    { t: 'Rolls-Royce RR300.',                   s: 'Flat-rated turbine. Full power deep into density altitude.',                              size: 'xl' },
    { t: 'Single-pilot IFR, certified.',         s: 'Not just legal. Certified to be flown alone in IMC.',                                     size: 'md' },
    { t: 'Operating cost published, yearly.',    s: 'Robinson publishes an Estimated Operating Cost sheet per variant. No hidden numbers.',   size: 'md' },
    { t: 'Third the price of an AStar.',         s: 'Same mission profile for most owner-flyers. One-third the acquisition.',                   size: 'lg' },
    { t: 'One in every market.',                 s: '1,500+ airframes flying. Dealer network in 70+ countries.',                               size: 'md' },
    { t: 'Fly it tomorrow.',                     s: 'Factory-run Safety Course, Torrance. R66-specific syllabus.',                             size: 'xl' },
  ];

  return (
    <section className="rbv-h">
      <div className="rbv-h__container">
        <span className="r66-pre-text rbv-h__pre">R66 · THE CASE IN SENTENCES</span>

        <div className="rbv-h__stack">
          {statements.map((st, i) => (
            <div
              key={i}
              className={`rbv-h__stmt rbv-h__stmt--${st.size}${hovered === i ? ' rbv-h__stmt--active' : ''}`}
              onMouseEnter={() => setHovered(i)}
              onMouseLeave={() => setHovered(null)}
              onFocus={() => setHovered(i)}
              onBlur={() => setHovered(null)}
              tabIndex={0}
            >
              <div className="rbv-h__line">
                <span className="rbv-h__idx">{String(i + 1).padStart(2, '0')}</span>
                <span className="rbv-h__t">{st.t}</span>
              </div>
              <div className="rbv-h__s">{st.s}</div>
            </div>
          ))}
        </div>
      </div>

      <style>{`
        .rbv-h {
          background: #faf9f6;
          color: #1a1a1a;
          padding: 7rem 0;
          font-family: 'Space Grotesk', sans-serif;
        }
        .rbv-h__container { max-width: 1200px; margin: 0 auto; padding: 0 2rem; }
        .rbv-h__pre { display: inline-block; margin-bottom: 4rem; }
        .rbv-h__stack {
          display: flex;
          flex-direction: column;
          gap: 2.5rem;
        }
        .rbv-h__stmt {
          cursor: default;
          transition: all 0.3s ease;
          border-bottom: 1px solid transparent;
          padding-bottom: 0.5rem;
        }
        .rbv-h__stmt:hover, .rbv-h__stmt--active {
          border-bottom-color: #a67b3f;
        }
        .rbv-h__line {
          display: flex;
          align-items: baseline;
          gap: 1.25rem;
        }
        .rbv-h__idx {
          font-family: 'Share Tech Mono', monospace;
          font-size: 0.75rem;
          color: #a67b3f;
          letter-spacing: 0.2em;
          flex-shrink: 0;
        }
        .rbv-h__t {
          font-weight: 300;
          letter-spacing: -0.03em;
          line-height: 1;
        }
        .rbv-h__stmt--xl .rbv-h__t { font-size: clamp(3rem, 7vw, 6rem); }
        .rbv-h__stmt--lg .rbv-h__t { font-size: clamp(2.25rem, 5vw, 4.25rem); }
        .rbv-h__stmt--md .rbv-h__t { font-size: clamp(1.75rem, 3.5vw, 2.75rem); }
        .rbv-h__stmt:hover .rbv-h__t, .rbv-h__stmt--active .rbv-h__t {
          color: #a67b3f;
        }
        .rbv-h__s {
          max-height: 0;
          overflow: hidden;
          opacity: 0;
          transition: all 0.35s ease;
          font-size: 1rem;
          line-height: 1.55;
          color: #666;
          padding-left: calc(0.75rem + 1.25rem);
          margin-top: 0;
          max-width: 640px;
        }
        .rbv-h__stmt:hover .rbv-h__s, .rbv-h__stmt--active .rbv-h__s {
          max-height: 120px;
          opacity: 1;
          margin-top: 0.75rem;
        }
      `}</style>
    </section>
  );
}

// ===========================================================================
// VARIANT I — Decision Tree Qualifier
// Four sequential questions. Each answer advances the user through a
// visualised flowchart. At the end: the R66, with the benefits that answered
// their specific qualification path.
// ===========================================================================
function VariantDecisionTree() {
  const [path, setPath] = useState([]); // indices into each step's answer list

  const steps = [
    {
      question: 'How many seats do you actually need?',
      answers: [
        { label: '2 — just me and a pax', next: 'skip', note: 'Look at R22 / R44 Cadet.' },
        { label: '4 — family / business', next: 'ok', note: 'R44 likely, R66 if turbine matters.' },
        { label: '5 — full cabin regularly', next: 'r66', note: 'R66 territory — only Robinson with 5 seats.' },
      ],
    },
    {
      question: 'Will you operate at altitude, hot, or heavy?',
      answers: [
        { label: 'Sea level, temperate', next: 'ok', note: 'Piston viable; turbine is upgrade.' },
        { label: 'Sometimes hot-and-high', next: 'r66', note: 'Flat-rated turbine matters here.' },
        { label: 'Frequently — mountains / desert', next: 'r66', note: 'Piston will struggle; R66 is built for it.' },
      ],
    },
    {
      question: 'What is your acquisition ceiling?',
      answers: [
        { label: 'Under £500k',        next: 'skip', note: 'R22 / used R44.' },
        { label: '£500k – £1.3M',      next: 'r66', note: 'R66 is the only new turbine in this band.' },
        { label: '£1.3M – £3M',        next: 'ok',  note: 'R66 still the efficient choice; alternatives exist.' },
        { label: 'Above £3M',          next: 'ok',  note: 'H125 / H130 territory — R66 as a second.' },
      ],
    },
    {
      question: 'Do you need IFR / single-pilot IMC capability?',
      answers: [
        { label: 'No, VFR only',                       next: 'ok', note: '' },
        { label: 'Occasionally — training IFR',        next: 'r66', note: 'R66 IFR trainer variant built for this.' },
        { label: 'Operational IFR — single pilot',     next: 'r66', note: 'R66 is certified for single-pilot IFR.' },
      ],
    },
  ];

  const atEnd = path.length === steps.length;
  const currentStep = atEnd ? null : steps[path.length];

  const choose = (i) => setPath((p) => [...p, i]);
  const reset = () => setPath([]);

  // If they end up qualified, surface relevant R66 benefits.
  const verdict = atEnd ? (() => {
    const hits = path.filter((i, step) => steps[step].answers[i].next === 'r66').length;
    return {
      label: hits >= 2 ? 'LAND ON THE R66' : 'CONSIDER THE R66',
      body:  hits >= 2
        ? 'Based on your answers, the R66 is the tightest fit in the Robinson range — and typically the tightest in civil aviation at this price.'
        : 'Your brief is flexible. The R66 is worth a test flight against the R44 and — at the higher end — the Bell 505.',
    };
  })() : null;

  // Curated benefits pulled from the JSON
  const verdictBenefits = atEnd ? [
    r66.benefits.turbineAdvantages[0],
    r66.benefits.missionCapability[0],
    r66.benefits.economics[0],
    r66.benefits.safety[3],
  ] : [];

  return (
    <section className="rbv-i">
      <div className="rbv-i__container">
        <div className="rbv-i__header">
          <span className="r66-pre-text">R66 · QUALIFIER</span>
          <h2 className="rbv-i__title">Four questions. One aircraft.</h2>
        </div>

        <div className="rbv-i__progress">
          {steps.map((_, i) => (
            <div key={i} className={`rbv-i__step${i < path.length ? ' rbv-i__step--done' : ''}${i === path.length ? ' rbv-i__step--active' : ''}`}>
              <span>{String(i + 1).padStart(2, '0')}</span>
            </div>
          ))}
          <div className={`rbv-i__step rbv-i__step--end${atEnd ? ' rbv-i__step--active' : ''}`}>
            <span>✓</span>
          </div>
        </div>

        {!atEnd && (
          <div className="rbv-i__card">
            <span className="rbv-i__step-label">QUESTION {path.length + 1} / {steps.length}</span>
            <h3 className="rbv-i__q">{currentStep.question}</h3>
            <div className="rbv-i__answers">
              {currentStep.answers.map((a, i) => (
                <button key={i} onClick={() => choose(i)} className="rbv-i__answer">
                  <span className="rbv-i__answer-label">{a.label}</span>
                  {a.note && <span className="rbv-i__answer-note">{a.note}</span>}
                </button>
              ))}
            </div>
          </div>
        )}

        {atEnd && (
          <div className="rbv-i__verdict">
            <span className="rbv-i__verdict-label">VERDICT</span>
            <h3 className="rbv-i__verdict-title">{verdict.label}</h3>
            <p className="rbv-i__verdict-body">{verdict.body}</p>

            <div className="rbv-i__path">
              {path.map((ai, si) => (
                <div key={si} className="rbv-i__path-row">
                  <span className="rbv-i__path-q">Q{si + 1}</span>
                  <span className="rbv-i__path-a">{steps[si].answers[ai].label}</span>
                </div>
              ))}
            </div>

            <div className="rbv-i__benefits">
              {verdictBenefits.map((b, i) => (
                <div key={i} className="rbv-i__benefit">
                  <h4>{b.headline}</h4>
                  <p>{b.body}</p>
                </div>
              ))}
            </div>

            <button className="rbv-i__reset" onClick={reset}>Start over</button>
          </div>
        )}
      </div>

      <style>{`
        .rbv-i {
          background: #1a1a1a;
          color: #faf9f6;
          padding: 6rem 0;
          font-family: 'Space Grotesk', sans-serif;
        }
        .rbv-i__container { max-width: 980px; margin: 0 auto; padding: 0 2rem; }
        .rbv-i__header { text-align: center; margin-bottom: 2.5rem; }
        .rbv-i__title {
          font-size: clamp(2rem, 4vw, 3rem);
          font-weight: 300;
          letter-spacing: -0.02em;
          margin: 0.75rem 0 0;
        }
        .rbv-i__progress {
          display: flex;
          justify-content: center;
          gap: 0.5rem;
          align-items: center;
          margin-bottom: 2.5rem;
        }
        .rbv-i__step {
          width: 44px;
          height: 44px;
          border: 1px solid rgba(255,255,255,0.2);
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-family: 'Share Tech Mono', monospace;
          font-size: 0.75rem;
          color: rgba(255,255,255,0.4);
          transition: all 0.3s ease;
        }
        .rbv-i__step--done {
          background: rgba(166,123,63,0.2);
          border-color: #a67b3f;
          color: #a67b3f;
        }
        .rbv-i__step--active {
          background: #a67b3f;
          border-color: #a67b3f;
          color: #1a1a1a;
          font-weight: 700;
          transform: scale(1.1);
        }
        .rbv-i__step--end { margin-left: 0.5rem; }
        .rbv-i__card, .rbv-i__verdict {
          background: rgba(255,255,255,0.03);
          border: 1px solid rgba(255,255,255,0.1);
          padding: 2.5rem;
        }
        .rbv-i__step-label {
          font-family: 'Share Tech Mono', monospace;
          font-size: 0.7rem;
          letter-spacing: 0.2em;
          color: #a67b3f;
        }
        .rbv-i__q {
          font-size: clamp(1.5rem, 3vw, 2.25rem);
          font-weight: 400;
          letter-spacing: -0.01em;
          margin: 0.75rem 0 1.75rem;
        }
        .rbv-i__answers {
          display: flex;
          flex-direction: column;
          gap: 0.6rem;
        }
        .rbv-i__answer {
          text-align: left;
          background: rgba(255,255,255,0.03);
          border: 1px solid rgba(255,255,255,0.1);
          padding: 1.1rem 1.4rem;
          color: #faf9f6;
          cursor: pointer;
          transition: all 0.2s ease;
          display: flex;
          flex-direction: column;
          gap: 0.35rem;
          font-family: inherit;
        }
        .rbv-i__answer:hover {
          background: rgba(166,123,63,0.15);
          border-color: #a67b3f;
          transform: translateX(4px);
        }
        .rbv-i__answer-label {
          font-size: 1rem;
          font-weight: 500;
        }
        .rbv-i__answer-note {
          font-size: 0.78rem;
          color: rgba(255,255,255,0.5);
        }
        .rbv-i__verdict-label {
          font-family: 'Share Tech Mono', monospace;
          font-size: 0.75rem;
          letter-spacing: 0.25em;
          color: #a67b3f;
        }
        .rbv-i__verdict-title {
          font-size: clamp(1.8rem, 4vw, 3rem);
          font-weight: 300;
          letter-spacing: -0.02em;
          margin: 0.75rem 0 1rem;
          color: #a67b3f;
        }
        .rbv-i__verdict-body {
          font-size: 1.05rem;
          line-height: 1.6;
          color: rgba(255,255,255,0.8);
          margin: 0 0 2rem;
          max-width: 680px;
        }
        .rbv-i__path {
          display: flex;
          flex-wrap: wrap;
          gap: 0.5rem;
          margin-bottom: 2rem;
          padding-bottom: 1.5rem;
          border-bottom: 1px solid rgba(255,255,255,0.1);
        }
        .rbv-i__path-row {
          display: inline-flex;
          gap: 0.5rem;
          align-items: baseline;
          padding: 0.4rem 0.75rem;
          background: rgba(255,255,255,0.04);
          border: 1px solid rgba(255,255,255,0.1);
          font-size: 0.78rem;
        }
        .rbv-i__path-q {
          font-family: 'Share Tech Mono', monospace;
          font-size: 0.7rem;
          color: #a67b3f;
        }
        .rbv-i__benefits {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 1rem;
          margin-bottom: 2rem;
        }
        @media (max-width: 700px) { .rbv-i__benefits { grid-template-columns: 1fr; } }
        .rbv-i__benefit {
          background: rgba(166,123,63,0.08);
          border-left: 2px solid #a67b3f;
          padding: 1rem 1.25rem;
        }
        .rbv-i__benefit h4 {
          font-size: 0.95rem;
          margin: 0 0 0.4rem;
          font-weight: 600;
        }
        .rbv-i__benefit p {
          font-size: 0.82rem;
          line-height: 1.55;
          color: rgba(255,255,255,0.7);
          margin: 0;
        }
        .rbv-i__reset {
          background: transparent;
          border: 1px solid rgba(255,255,255,0.3);
          padding: 0.7rem 1.4rem;
          color: rgba(255,255,255,0.7);
          font-family: inherit;
          font-size: 0.85rem;
          letter-spacing: 0.1em;
          cursor: pointer;
          transition: all 0.2s ease;
        }
        .rbv-i__reset:hover {
          border-color: #a67b3f;
          color: #a67b3f;
        }
      `}</style>
    </section>
  );
}

// ===========================================================================
// VARIANT J — Annotated Specimen
// Full-width R66 image. Numbered pins sit over key components. Clicking a pin
// highlights the component and extends an annotation line to a benefit card.
// ===========================================================================
function VariantAnnotatedSpecimen() {
  const [activePin, setActivePin] = useState(0);

  // Pin positions approx over a typical R66 side-profile photograph.
  // Coordinates are percentage-based so they work regardless of viewport.
  const pins = [
    { id: 'engine', x: 52, y: 32, label: 'RR300 TURBINE',
      headline: 'Rolls-Royce RR300 — flat-rated, industry-proven',
      body: 'Derated in cruise for long life. Full power available deep into density altitude.' },
    { id: 'rotor', x: 50, y: 12, label: 'TWO-BLADE ROTOR',
      headline: 'Simple two-blade teetering rotor',
      body: 'Fewer parts, inspectable in minutes, lightweight — the Robinson signature carried into turbine.' },
    { id: 'cabin', x: 38, y: 48, label: 'FIVE-SEAT CABIN',
      headline: 'Pilot plus four passengers with real useful load',
      body: 'Cruise a family of five with bags and fuel at density altitudes a piston single cannot clear.' },
    { id: 'panel', x: 32, y: 45, label: 'GARMIN G500H TXi',
      headline: 'Touchscreen glass, factory-standard',
      body: 'Synthetic vision, engine monitoring, moving map, TAWS, ADS-B — all standard, all integrated.' },
    { id: 'hold',  x: 68, y: 50, label: 'CARGO HOLD',
      headline: '300 lb external-access lockable hold',
      body: 'Unique in the light turbine class. A real bag bay, not just footwells.' },
    { id: 'skids', x: 50, y: 82, label: 'SKIDS',
      headline: 'Hi-Skid / Utility variant available',
      body: 'Factory-built for rough surfaces, crew shuttle, or cargo hook external load work.' },
    { id: 'tail',  x: 85, y: 38, label: 'TAIL ROTOR',
      headline: 'Proven Robinson tail rotor system',
      body: 'Same design philosophy — simple, serviceable, field-repairable.' },
  ];

  const active = pins[activePin];

  return (
    <section className="rbv-j">
      <div className="rbv-j__container">
        <div className="rbv-j__header">
          <span className="r66-pre-text">R66 · SPECIMEN</span>
          <h2 className="rbv-j__title">Every component, earning its place.</h2>
          <p className="rbv-j__sub">Tap a marker to see what it does for you.</p>
        </div>

        <div className="rbv-j__stage">
          <div className="rbv-j__silhouette" aria-label="R66 outline with annotation pins">
            {/* Stylised R66 silhouette using SVG (no image asset required) */}
            <svg viewBox="0 0 1000 500" className="rbv-j__svg">
              {/* main rotor disc */}
              <ellipse cx="500" cy="60" rx="380" ry="10" fill="none" stroke="rgba(166,123,63,0.4)" strokeWidth="1" strokeDasharray="4 4" />
              {/* rotor mast */}
              <rect x="495" y="60" width="10" height="90" fill="#2a2a2a" />
              {/* cabin pod */}
              <path d="M 250 150 Q 220 200, 260 280 L 620 280 Q 660 260, 640 150 Q 500 120, 250 150 Z" fill="#1a1a1a" stroke="#a67b3f" strokeWidth="1.5" />
              {/* windshield */}
              <path d="M 260 155 Q 270 185, 300 210 L 400 215 L 420 160 Z" fill="#3a3a3a" opacity="0.6" />
              {/* tail boom */}
              <path d="M 620 200 L 900 230 L 900 250 L 620 260 Z" fill="#1a1a1a" stroke="#a67b3f" strokeWidth="1.5" />
              {/* tail rotor */}
              <circle cx="895" cy="195" r="40" fill="none" stroke="rgba(166,123,63,0.4)" strokeWidth="1" strokeDasharray="3 3" />
              <rect x="892" y="175" width="6" height="40" fill="#2a2a2a" />
              {/* skids */}
              <rect x="260" y="395" width="380" height="6" fill="#2a2a2a" />
              <rect x="280" y="280" width="4" height="115" fill="#2a2a2a" />
              <rect x="620" y="280" width="4" height="115" fill="#2a2a2a" />
              {/* pins */}
              {pins.map((p, i) => {
                const isActive = i === activePin;
                const cx = (p.x / 100) * 1000;
                const cy = (p.y / 100) * 500;
                return (
                  <g key={p.id}
                     onClick={() => setActivePin(i)}
                     style={{ cursor: 'pointer' }}>
                    {isActive && (
                      <circle cx={cx} cy={cy} r="22" fill="none" stroke="#a67b3f" strokeWidth="1">
                        <animate attributeName="r" values="18;28;18" dur="2s" repeatCount="indefinite" />
                        <animate attributeName="opacity" values="1;0;1" dur="2s" repeatCount="indefinite" />
                      </circle>
                    )}
                    <circle cx={cx} cy={cy} r="14" fill={isActive ? '#a67b3f' : 'rgba(166,123,63,0.3)'} stroke="#faf9f6" strokeWidth="2" />
                    <text x={cx} y={cy + 5} textAnchor="middle" fill={isActive ? '#1a1a1a' : '#faf9f6'} fontSize="13" fontWeight="700" fontFamily="Space Grotesk, sans-serif" pointerEvents="none">{i + 1}</text>
                  </g>
                );
              })}
            </svg>
          </div>

          <div className="rbv-j__panel">
            <div className="rbv-j__panel-head">
              <span className="rbv-j__pin-badge">{String(activePin + 1).padStart(2, '0')}</span>
              <span className="rbv-j__pin-label">{active.label}</span>
            </div>
            <h3 className="rbv-j__pin-headline">{active.headline}</h3>
            <p className="rbv-j__pin-body">{active.body}</p>

            <div className="rbv-j__nav">
              <button onClick={() => setActivePin((p) => (p - 1 + pins.length) % pins.length)} aria-label="Previous pin">←</button>
              <span className="rbv-j__count">{activePin + 1} / {pins.length}</span>
              <button onClick={() => setActivePin((p) => (p + 1) % pins.length)} aria-label="Next pin">→</button>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        .rbv-j {
          background: #0e0e0e;
          color: #faf9f6;
          padding: 5rem 0;
          font-family: 'Space Grotesk', sans-serif;
        }
        .rbv-j__container { max-width: 1400px; margin: 0 auto; padding: 0 2rem; }
        .rbv-j__header { margin-bottom: 2.5rem; }
        .rbv-j__title {
          font-size: clamp(2rem, 4vw, 3rem);
          font-weight: 300;
          letter-spacing: -0.02em;
          margin: 0.75rem 0 0.75rem;
        }
        .rbv-j__sub { color: rgba(255,255,255,0.55); margin: 0; }
        .rbv-j__stage {
          display: grid;
          grid-template-columns: 1.4fr 1fr;
          gap: 2rem;
          align-items: center;
        }
        @media (max-width: 900px) { .rbv-j__stage { grid-template-columns: 1fr; } }
        .rbv-j__silhouette {
          background: radial-gradient(ellipse at center, rgba(166,123,63,0.08), transparent 70%);
          padding: 1rem;
        }
        .rbv-j__svg { width: 100%; height: auto; display: block; }
        .rbv-j__panel {
          background: rgba(255,255,255,0.04);
          border-left: 3px solid #a67b3f;
          padding: 2rem;
        }
        .rbv-j__panel-head {
          display: flex;
          gap: 0.75rem;
          align-items: center;
          margin-bottom: 1rem;
        }
        .rbv-j__pin-badge {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          width: 34px;
          height: 34px;
          background: #a67b3f;
          color: #1a1a1a;
          border-radius: 50%;
          font-family: 'Share Tech Mono', monospace;
          font-size: 0.8rem;
          font-weight: 700;
        }
        .rbv-j__pin-label {
          font-family: 'Share Tech Mono', monospace;
          font-size: 0.72rem;
          letter-spacing: 0.2em;
          color: #a67b3f;
        }
        .rbv-j__pin-headline {
          font-size: clamp(1.3rem, 2.5vw, 1.75rem);
          font-weight: 400;
          letter-spacing: -0.01em;
          margin: 0 0 1rem;
        }
        .rbv-j__pin-body {
          font-size: 0.95rem;
          line-height: 1.6;
          color: rgba(255,255,255,0.75);
          margin: 0 0 1.75rem;
        }
        .rbv-j__nav {
          display: flex;
          gap: 1rem;
          align-items: center;
        }
        .rbv-j__nav button {
          width: 40px;
          height: 40px;
          background: transparent;
          border: 1px solid rgba(255,255,255,0.2);
          color: #faf9f6;
          font-size: 1.1rem;
          cursor: pointer;
          transition: all 0.2s ease;
        }
        .rbv-j__nav button:hover {
          background: #a67b3f;
          border-color: #a67b3f;
          color: #1a1a1a;
        }
        .rbv-j__count {
          font-family: 'Share Tech Mono', monospace;
          font-size: 0.75rem;
          color: rgba(255,255,255,0.55);
          letter-spacing: 0.15em;
        }
      `}</style>
    </section>
  );
}

// ===========================================================================
// VARIANT K — Ownership Timeline
// Horizontal 10-year ownership timeline. Benefits appear at the year they
// matter. Scrub the timeline; benefits update. Answers the question:
// "What does this actually feel like over a decade?"
// ===========================================================================
function VariantOwnershipTimeline() {
  const [yearIdx, setYearIdx] = useState(0);

  const milestones = [
    {
      year: 0, label: 'ACQUISITION',
      headline: 'Factory-new turbine for under $1.4M',
      body: 'The cheapest certified single-engine turbine on the new market. Financeable through mainstream GA lenders with standardised terms.',
    },
    {
      year: 1, label: 'FIRST YEAR',
      headline: 'Operating-cost sheet holds',
      body: "Robinson's published EOC figures track within a few percent of reality. Fuel (~24 gph Jet-A) is the dominant line. Insurance settles as hours on type build.",
    },
    {
      year: 2, label: 'SAFETY COURSE',
      headline: 'Torrance for the week',
      body: 'Robinson Safety Course, R66 syllabus. Insurance recognition, factory contact, and the only airframe-specific safety programme in general aviation.',
    },
    {
      year: 3, label: 'RESERVE MATURITY',
      headline: 'Overhaul reserve compounding predictably',
      body: 'Engine and airframe reserves fixed against the published 2,000-hour TBO. You set the number on day one — three years in, it still holds.',
    },
    {
      year: 5, label: 'MID-LIFE',
      headline: 'Residual value holds',
      body: 'R66 used market is deep enough that mid-life airframes trade within a narrow band. Unlike most turbines, resale is predictable at year five.',
    },
    {
      year: 7, label: 'UPGRADE OPTIONS',
      headline: 'Avionics and interior upgrades available',
      body: 'Factory-approved GFC 600H autopilot, IFR-spec panels, interior refreshes. Parts in production, upgrade paths documented.',
    },
    {
      year: 10, label: 'DECADE MARK',
      headline: 'Second owner-ready',
      body: '10-year-old R66s are liquid assets. Used-market depth, continuing factory support, and a proven service history make resale straightforward.',
    },
    {
      year: '2,000h', label: 'ENGINE TBO',
      headline: 'Overhaul cost published, not discovered',
      body: 'RR300 overhaul follows a published scope at approved facilities. Your reserve equals the invoice — no budget surprise.',
    },
  ];

  const m = milestones[yearIdx];

  return (
    <section className="rbv-k">
      <div className="rbv-k__container">
        <div className="rbv-k__header">
          <span className="r66-pre-text">R66 · OWNERSHIP DECADE</span>
          <h2 className="rbv-k__title">Year by year, the numbers keep working.</h2>
        </div>

        <div className="rbv-k__track">
          <div className="rbv-k__line">
            <div className="rbv-k__line-fill" style={{ width: `${(yearIdx / (milestones.length - 1)) * 100}%` }} />
          </div>
          <div className="rbv-k__markers">
            {milestones.map((ms, i) => (
              <button
                key={i}
                onClick={() => setYearIdx(i)}
                className={`rbv-k__marker${i === yearIdx ? ' rbv-k__marker--active' : ''}${i < yearIdx ? ' rbv-k__marker--past' : ''}`}
              >
                <span className="rbv-k__marker-dot" />
                <span className="rbv-k__marker-year">Y{ms.year}</span>
              </button>
            ))}
          </div>
        </div>

        <div className="rbv-k__panel">
          <div className="rbv-k__panel-left">
            <span className="rbv-k__panel-label">{m.label}</span>
            <h3 className="rbv-k__panel-year">Year {m.year}</h3>
          </div>
          <div className="rbv-k__panel-right">
            <h4 className="rbv-k__panel-headline">{m.headline}</h4>
            <p className="rbv-k__panel-body">{m.body}</p>
          </div>
        </div>
      </div>

      <style>{`
        .rbv-k {
          background: #faf9f6;
          color: #1a1a1a;
          padding: 6rem 0;
          font-family: 'Space Grotesk', sans-serif;
        }
        .rbv-k__container { max-width: 1280px; margin: 0 auto; padding: 0 2rem; }
        .rbv-k__header { margin-bottom: 3rem; }
        .rbv-k__title {
          font-size: clamp(2rem, 4vw, 3rem);
          font-weight: 300;
          letter-spacing: -0.02em;
          margin: 0.75rem 0 0;
        }
        .rbv-k__track {
          position: relative;
          padding: 2rem 0 3rem;
          margin-bottom: 2rem;
        }
        .rbv-k__line {
          position: absolute;
          top: 50%;
          left: 0;
          right: 0;
          height: 1px;
          background: #d8d6d0;
          transform: translateY(-50%);
        }
        .rbv-k__line-fill {
          height: 100%;
          background: #a67b3f;
          transition: width 0.35s ease;
        }
        .rbv-k__markers {
          position: relative;
          display: flex;
          justify-content: space-between;
        }
        .rbv-k__marker {
          background: transparent;
          border: none;
          cursor: pointer;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 0.5rem;
          padding: 0;
          font-family: inherit;
        }
        .rbv-k__marker-dot {
          width: 14px;
          height: 14px;
          border-radius: 50%;
          background: #fff;
          border: 2px solid #d8d6d0;
          transition: all 0.25s ease;
        }
        .rbv-k__marker--past .rbv-k__marker-dot {
          background: #a67b3f;
          border-color: #a67b3f;
        }
        .rbv-k__marker--active .rbv-k__marker-dot {
          background: #a67b3f;
          border-color: #1a1a1a;
          transform: scale(1.5);
          box-shadow: 0 0 0 6px rgba(166,123,63,0.2);
        }
        .rbv-k__marker-year {
          font-family: 'Share Tech Mono', monospace;
          font-size: 0.7rem;
          letter-spacing: 0.1em;
          color: #7a7a7a;
          transition: color 0.2s ease;
        }
        .rbv-k__marker--active .rbv-k__marker-year,
        .rbv-k__marker--past .rbv-k__marker-year {
          color: #1a1a1a;
          font-weight: 700;
        }
        .rbv-k__panel {
          display: grid;
          grid-template-columns: 1fr 2.5fr;
          gap: 3rem;
          background: #fff;
          border: 1px solid #e8e6e2;
          padding: 2.5rem;
          min-height: 180px;
        }
        @media (max-width: 768px) { .rbv-k__panel { grid-template-columns: 1fr; gap: 1.5rem; } }
        .rbv-k__panel-left { border-right: 1px solid #e8e6e2; padding-right: 2rem; }
        @media (max-width: 768px) { .rbv-k__panel-left { border-right: none; border-bottom: 1px solid #e8e6e2; padding-bottom: 1rem; padding-right: 0; } }
        .rbv-k__panel-label {
          font-family: 'Share Tech Mono', monospace;
          font-size: 0.72rem;
          letter-spacing: 0.2em;
          color: #a67b3f;
        }
        .rbv-k__panel-year {
          font-size: clamp(2rem, 4vw, 3rem);
          font-weight: 300;
          letter-spacing: -0.02em;
          margin: 0.5rem 0 0;
        }
        .rbv-k__panel-headline {
          font-size: clamp(1.2rem, 2.2vw, 1.6rem);
          font-weight: 500;
          letter-spacing: -0.01em;
          margin: 0 0 0.75rem;
        }
        .rbv-k__panel-body {
          font-size: 1rem;
          line-height: 1.65;
          color: #666;
          margin: 0;
        }
      `}</style>
    </section>
  );
}

// ===========================================================================
// Preview page: stacks all eleven variants with labels so you can compare
// patterns side-by-side at /r66-benefits-variations.
// ===========================================================================
// ===========================================================================
// VARIANT L — Spec Deck
// Two-column sticky-scroll. Left column holds a fixed multi-weight headline and
// a Share Tech Mono progress readout; right column scrolls through eight
// "decks" — one per benefit category — each rendered as a spec table with
// supporting prose. Brand-aligned with AircraftR66.jsx (palette, typography,
// multi-weight spans, Share Tech Mono labels, bronze accent).
// ===========================================================================
const CATEGORY_CODES = {
  turbineAdvantages:   'TRB',
  missionCapability:   'MSN',
  economics:           'ECO',
  performance:         'PRF',
  systemsAndCockpit:   'SYS',
  ownershipAndSupport: 'OWN',
  marketPosition:      'MKT',
  safety:              'SFE',
};

const CATEGORY_ARGUMENT = {
  turbineAdvantages:   'Turbine reliability at Robinson economics.',
  missionCapability:   'Five seats. Lockable cargo hold. Single-pilot IFR capable.',
  economics:           'Cheapest new certified turbine single — with published annual costs.',
  performance:         '125 kt cruise. 14,000 ft ceiling. Flat-rated at altitude.',
  systemsAndCockpit:   'G500H TXi, TAWS, ADS-B — factory standard, not retrofit.',
  ownershipAndSupport: 'Torrance factory support. Dealer network in 70+ countries.',
  marketPosition:      '1,500+ built. Liquid resale. Flagship of the Robinson range.',
  safety:              'Robinson Safety Course. Open notices. Published life limits.',
};

function VariantSpecDeck() {
  const [activeIdx, setActiveIdx] = useState(0);
  const deckRefs = useRef([]);

  useEffect(() => {
    const obs = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
        if (!visible) return;
        const idx = Number(visible.target.dataset.idx);
        if (!Number.isNaN(idx)) setActiveIdx(idx);
      },
      { rootMargin: '-40% 0px -40% 0px', threshold: [0, 0.25, 0.5, 0.75, 1] }
    );
    deckRefs.current.forEach((el) => el && obs.observe(el));
    return () => obs.disconnect();
  }, []);

  const metaRows = [
    ['POWERPLANT',   r66.powerplant],
    ['CONFIGURATION', r66.configuration],
    ['TBO',          r66.tbo],
    ['CRUISE',       r66.cruise],
    ['FUEL BURN',    r66.fuelBurn],
    ['USEFUL LOAD',  '~1,200 lb'],
    ['CERTIFIED',    r66.firstCertified],
    ['BUILT',        r66.builtToDate],
  ];

  return (
    <section className="rbv-L">
      <div className="rbv-L__container">
        <header className="rbv-L__head">
          <span className="rbv-L__eyebrow">THE R66 CASE / SPECIFICATION</span>
          <h2 className="rbv-L__title">
            <span className="rbv-L__text--dark">Eight reasons.</span>{' '}
            <span className="rbv-L__text--mid">One aircraft.</span>{' '}
            <span className="rbv-L__text--light">No compromise.</span>
          </h2>
          <p className="rbv-L__lede">
            The ownership case for the R66, read as a specification. Eight chapters —
            each a single argument, a tabled set of supporting points, and the context
            that makes them matter.
          </p>
        </header>

        <div className="rbv-L__split">
          <aside className="rbv-L__rail">
            <div className="rbv-L__rail-inner">
              <span className="rbv-L__rail-label">SECTION</span>
              <div className="rbv-L__rail-count">
                <span className="rbv-L__rail-current">{String(activeIdx + 1).padStart(2, '0')}</span>
                <span className="rbv-L__rail-sep">/</span>
                <span className="rbv-L__rail-total">{String(CATEGORY_KEYS.length).padStart(2, '0')}</span>
              </div>

              <ul className="rbv-L__toc">
                {CATEGORY_KEYS.map((key, i) => (
                  <li
                    key={key}
                    className={`rbv-L__toc-item${i === activeIdx ? ' rbv-L__toc-item--active' : ''}`}
                  >
                    <span className="rbv-L__toc-code">{CATEGORY_CODES[key]}</span>
                    <span className="rbv-L__toc-label">{CATEGORY_LABELS[key]}</span>
                  </li>
                ))}
              </ul>

              <div className="rbv-L__rail-meta">
                <span className="rbv-L__rail-meta-label">MODEL</span>
                <span className="rbv-L__rail-meta-value">{r66.name}</span>
                <span className="rbv-L__rail-meta-label">TAGLINE</span>
                <span className="rbv-L__rail-meta-value">{r66.tagline}</span>
              </div>
            </div>
          </aside>

          <div className="rbv-L__stream">
            {CATEGORY_KEYS.map((key, i) => {
              const items = r66.benefits[key] || [];
              const code = CATEGORY_CODES[key];
              return (
                <article
                  key={key}
                  ref={(el) => { deckRefs.current[i] = el; }}
                  data-idx={i}
                  className="rbv-L__deck"
                >
                  <div className="rbv-L__deck-meta">
                    <span className="rbv-L__deck-code">{code}</span>
                    <span className="rbv-L__deck-sep" aria-hidden="true" />
                    <span className="rbv-L__deck-count">{String(i + 1).padStart(2, '0')} / {String(CATEGORY_KEYS.length).padStart(2, '0')}</span>
                    <span className="rbv-L__deck-sep" aria-hidden="true" />
                    <span className="rbv-L__deck-cat">{CATEGORY_LABELS[key]}</span>
                  </div>

                  <h3 className="rbv-L__deck-headline">{CATEGORY_ARGUMENT[key]}</h3>

                  <p className="rbv-L__deck-prose">{CATEGORY_INTRO[key]}</p>

                  <div className="rbv-L__table" role="table">
                    {items.map((b, j) => (
                      <div key={j} className="rbv-L__row" role="row">
                        <div className="rbv-L__cell rbv-L__cell--code" role="cell">
                          {code}-{String(j + 1).padStart(2, '0')}
                        </div>
                        <div className="rbv-L__cell rbv-L__cell--body" role="cell">
                          <span className="rbv-L__cell-headline">{b.headline}</span>
                          <span className="rbv-L__cell-body">{b.body}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </article>
              );
            })}

            <article className="rbv-L__deck rbv-L__deck--footer">
              <div className="rbv-L__deck-meta">
                <span className="rbv-L__deck-code">R66</span>
                <span className="rbv-L__deck-sep" aria-hidden="true" />
                <span className="rbv-L__deck-cat">Airframe Specification</span>
              </div>
              <h3 className="rbv-L__deck-headline">
                <span className="rbv-L__text--dark">The figures.</span>{' '}
                <span className="rbv-L__text--mid">For reference.</span>
              </h3>
              <div className="rbv-L__meta-grid">
                {metaRows.map(([label, value]) => (
                  <div key={label} className="rbv-L__meta-row">
                    <span className="rbv-L__meta-label">{label}</span>
                    <span className="rbv-L__meta-value">{value}</span>
                  </div>
                ))}
              </div>
            </article>
          </div>
        </div>
      </div>

      <style>{`
        .rbv-L {
          background: #faf9f6;
          color: #1a1a1a;
          padding: 5rem 2rem;
          font-family: 'Space Grotesk', sans-serif;
        }
        .rbv-L__container {
          max-width: 1400px;
          margin: 0 auto;
        }

        .rbv-L__head {
          max-width: 880px;
          margin: 0 0 4rem;
        }
        .rbv-L__eyebrow {
          font-family: 'Share Tech Mono', monospace;
          font-size: 0.75rem;
          letter-spacing: 0.2em;
          color: #a67b3f;
          display: block;
          margin-bottom: 1.25rem;
        }
        .rbv-L__title {
          font-size: clamp(2rem, 4.5vw, 3.5rem);
          font-weight: 300;
          letter-spacing: -0.02em;
          line-height: 1.05;
          margin: 0 0 1.25rem;
        }
        .rbv-L__text--dark { color: #1a1a1a; font-weight: 400; }
        .rbv-L__text--mid  { color: #4a4a4a; font-weight: 300; }
        .rbv-L__text--light { color: #999;    font-weight: 300; }
        .rbv-L__lede {
          font-size: 1rem;
          line-height: 1.65;
          color: #4a4a4a;
          max-width: 640px;
          margin: 0;
        }

        .rbv-L__split {
          display: grid;
          grid-template-columns: 1fr;
          gap: 3rem;
        }
        @media (min-width: 901px) {
          .rbv-L__split {
            grid-template-columns: 300px 1fr;
            gap: 5rem;
          }
        }

        /* Sticky rail */
        .rbv-L__rail { min-width: 0; }
        .rbv-L__rail-inner {
          display: flex;
          flex-direction: column;
          gap: 1.5rem;
        }
        @media (min-width: 901px) {
          .rbv-L__rail-inner {
            position: sticky;
            top: max(10vh, 110px);
            padding-right: 1rem;
            border-right: 1px solid #e8e6e2;
          }
        }
        .rbv-L__rail-label {
          font-family: 'Share Tech Mono', monospace;
          font-size: 0.7rem;
          letter-spacing: 0.2em;
          color: #999;
        }
        .rbv-L__rail-count {
          display: flex;
          align-items: baseline;
          gap: 0.35rem;
          font-family: 'Share Tech Mono', monospace;
          line-height: 1;
        }
        .rbv-L__rail-current {
          font-size: 3.25rem;
          color: #1a1a1a;
          font-weight: 400;
        }
        .rbv-L__rail-sep { color: #999; font-size: 1.75rem; }
        .rbv-L__rail-total { color: #7a7a7a; font-size: 1.75rem; }

        .rbv-L__toc {
          list-style: none;
          padding: 0;
          margin: 0.5rem 0 0;
          display: flex;
          flex-direction: column;
          gap: 0.1rem;
        }
        .rbv-L__toc-item {
          display: flex;
          align-items: baseline;
          gap: 0.85rem;
          padding: 0.55rem 0;
          border-top: 1px solid #e8e6e2;
          font-size: 0.85rem;
          color: #7a7a7a;
          transition: color 0.25s ease, border-color 0.25s ease;
        }
        .rbv-L__toc-item:last-child { border-bottom: 1px solid #e8e6e2; }
        .rbv-L__toc-code {
          font-family: 'Share Tech Mono', monospace;
          font-size: 0.7rem;
          letter-spacing: 0.1em;
          color: #a67b3f;
          min-width: 2.5rem;
        }
        .rbv-L__toc-label {
          font-family: 'Space Grotesk', sans-serif;
          letter-spacing: -0.005em;
        }
        .rbv-L__toc-item--active {
          color: #1a1a1a;
        }
        .rbv-L__toc-item--active .rbv-L__toc-code {
          color: #1a1a1a;
        }
        .rbv-L__toc-item--active .rbv-L__toc-label {
          font-weight: 500;
        }

        .rbv-L__rail-meta {
          display: grid;
          grid-template-columns: auto 1fr;
          gap: 0.4rem 1rem;
          align-items: baseline;
          margin-top: 0.5rem;
          padding-top: 1.25rem;
          border-top: 1px solid #e8e6e2;
        }
        .rbv-L__rail-meta-label {
          font-family: 'Share Tech Mono', monospace;
          font-size: 0.65rem;
          letter-spacing: 0.15em;
          color: #999;
        }
        .rbv-L__rail-meta-value {
          font-size: 0.85rem;
          color: #1a1a1a;
          line-height: 1.35;
        }

        /* Stream */
        .rbv-L__stream {
          min-width: 0;
          display: flex;
          flex-direction: column;
          gap: 5rem;
        }

        .rbv-L__deck {
          scroll-margin-top: 10vh;
        }
        .rbv-L__deck-meta {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          font-family: 'Share Tech Mono', monospace;
          font-size: 0.7rem;
          letter-spacing: 0.2em;
          color: #7a7a7a;
          margin-bottom: 1.25rem;
        }
        .rbv-L__deck-code {
          color: #a67b3f;
          border: 1px solid #a67b3f;
          padding: 0.2rem 0.55rem;
          border-radius: 2px;
          letter-spacing: 0.15em;
        }
        .rbv-L__deck-sep {
          width: 14px;
          height: 1px;
          background: #c8c4bd;
        }
        .rbv-L__deck-count { color: #1a1a1a; }
        .rbv-L__deck-cat { color: #7a7a7a; }

        .rbv-L__deck-headline {
          font-size: clamp(1.65rem, 3.2vw, 2.4rem);
          font-weight: 300;
          letter-spacing: -0.015em;
          line-height: 1.15;
          color: #1a1a1a;
          margin: 0 0 1.25rem;
          max-width: 700px;
        }
        .rbv-L__deck-headline .rbv-L__text--dark { font-weight: 400; }

        .rbv-L__deck-prose {
          font-size: 0.975rem;
          line-height: 1.7;
          color: #4a4a4a;
          max-width: 640px;
          margin: 0 0 2rem;
        }

        .rbv-L__table {
          border-top: 1px solid #1a1a1a;
          border-bottom: 1px solid #e8e6e2;
        }
        .rbv-L__row {
          display: grid;
          grid-template-columns: 90px 1fr;
          gap: 1.5rem;
          padding: 1.1rem 0;
          border-bottom: 1px solid #e8e6e2;
          align-items: baseline;
        }
        .rbv-L__row:last-child { border-bottom: none; }
        @media (min-width: 601px) {
          .rbv-L__row {
            grid-template-columns: 110px 1fr;
            gap: 2rem;
          }
        }
        .rbv-L__cell--code {
          font-family: 'Share Tech Mono', monospace;
          font-size: 0.75rem;
          letter-spacing: 0.1em;
          color: #a67b3f;
          padding-top: 0.1rem;
        }
        .rbv-L__cell--body {
          display: flex;
          flex-direction: column;
          gap: 0.35rem;
          min-width: 0;
        }
        .rbv-L__cell-headline {
          font-size: 1.05rem;
          color: #1a1a1a;
          font-weight: 500;
          letter-spacing: -0.005em;
          line-height: 1.35;
        }
        .rbv-L__cell-body {
          font-size: 0.9rem;
          color: #7a7a7a;
          line-height: 1.55;
        }

        /* Footer deck (specification figures) */
        .rbv-L__deck--footer {
          padding-top: 2rem;
          border-top: 1px solid #e8e6e2;
        }
        .rbv-L__meta-grid {
          display: grid;
          grid-template-columns: 1fr;
          gap: 0;
        }
        @media (min-width: 601px) {
          .rbv-L__meta-grid {
            grid-template-columns: 1fr 1fr;
            column-gap: 3rem;
          }
        }
        .rbv-L__meta-row {
          display: grid;
          grid-template-columns: 120px 1fr;
          gap: 1.5rem;
          padding: 0.9rem 0;
          border-bottom: 1px solid #e8e6e2;
          align-items: baseline;
        }
        .rbv-L__meta-label {
          font-family: 'Share Tech Mono', monospace;
          font-size: 0.7rem;
          letter-spacing: 0.15em;
          color: #a67b3f;
        }
        .rbv-L__meta-value {
          font-size: 0.95rem;
          color: #1a1a1a;
          line-height: 1.4;
        }
      `}</style>
    </section>
  );
}

export default function R66BenefitsVariations() {
  const variants = [
    { label: 'Variant L — Spec Deck (brand-aligned)',    note: 'Sticky left rail with progress + TOC; right column scrolls through eight category "decks" rendered as spec tables. Matches R66/R44 typography, palette, bronze accent and multi-weight spans.', Component: VariantSpecDeck },
    { label: 'Variant A — Tabbed Category Board',       note: 'Horizontal tabs, 2-col card grid. Highest information density; best for deep scanners who want to pick a category.', Component: VariantTabbed },
    { label: 'Variant B — Editorial Vertical Stack',    note: 'Each category is its own full-bleed section with intro paragraph. Slowest read, most premium feel, longest page.',    Component: VariantEditorial },
    { label: 'Variant C — Horizontal Snap Carousels',   note: 'One carousel per category, dark palette matches existing R66 aesthetic. Compact vertically, swipe-friendly.',         Component: VariantCarousel },
    { label: 'Variant D — Competitor Face-Off',         note: 'Interactive "vs" selector. Pure sales tool — not a benefit list, a decision tool for cross-shoppers.',                 Component: VariantFaceOff },
    { label: 'Variant E — Bento Feature Tiles',         note: 'Mixed-size tiles with headline stats + one featured benefit per category. Curated, highest visual impact, lowest depth.', Component: VariantBento },
    { label: 'Variant F — Flight Profile Scroll Path',  note: 'Scroll-linked. A helicopter traverses an SVG flight path as you scroll; benefits surface by phase of flight.',           Component: VariantFlightProfile },
    { label: 'Variant G — Data Terminal',               note: 'Ops-room / Bloomberg aesthetic. Monospaced dense grid. Every benefit is a record with a category code and stat badge.', Component: VariantDataTerminal },
    { label: 'Variant H — Typographic Manifesto',       note: 'No cards. Just declarative statements at scale. Hover reveals the supporting sentence. Rolex / Apple manifesto energy.',  Component: VariantManifesto },
    { label: 'Variant I — Decision Tree Qualifier',     note: 'Four questions. Visualised flowchart routes the user to the R66, with benefits surfaced at their specific answer path.', Component: VariantDecisionTree },
    { label: 'Variant J — Annotated Specimen',          note: 'SVG R66 silhouette with numbered pins. Click a pin; an annotation card appears. Technical-cutaway aesthetic.',           Component: VariantAnnotatedSpecimen },
    { label: 'Variant K — Ownership Timeline',          note: 'Horizontal 10-year timeline. Scrub years; benefits surface at the moment they matter (Y1 costs, Y3 reserves, Y10 resale).', Component: VariantOwnershipTimeline },
  ];

  return (
    <main style={{ background: '#faf9f6' }}>
      <header style={{ background: '#1a1a1a', color: '#faf9f6', padding: '5rem 2rem', textAlign: 'center', fontFamily: "'Space Grotesk', sans-serif" }}>
        <span style={{ fontFamily: "'Share Tech Mono', monospace", fontSize: '0.75rem', letterSpacing: '0.2em', color: '#a67b3f' }}>R66 BENEFITS — DISPLAY VARIANTS</span>
        <h1 style={{ fontSize: 'clamp(2.2rem, 5vw, 3.5rem)', fontWeight: 300, letterSpacing: '-0.02em', margin: '0.75rem 0 0.75rem' }}>Twelve ways to show the R66 case.</h1>
        <p style={{ fontSize: '1rem', color: 'rgba(255,255,255,0.7)', margin: '0 auto', maxWidth: 720 }}>Same data (src/lib/robinsonBenefits.json), twelve layouts with genuinely different information architectures — not just different styling. Variant L (first) is the new brand-aligned "Spec Deck" matching AircraftR66.jsx typography and palette. Scroll through — each variant is labelled and self-contained.</p>
      </header>

      {variants.map(({ label, note, Component }, i) => (
        <div key={i}>
          <div style={{ background: '#2a2a2a', color: '#faf9f6', padding: '1.5rem 2rem', fontFamily: "'Space Grotesk', sans-serif" }}>
            <div style={{ maxWidth: 1280, margin: '0 auto' }}>
              <span style={{ fontFamily: "'Share Tech Mono', monospace", fontSize: '0.7rem', letterSpacing: '0.2em', color: '#a67b3f' }}>{String(i + 1).padStart(2, '0')} / {variants.length}</span>
              <h2 style={{ fontSize: '1.25rem', fontWeight: 500, margin: '0.25rem 0 0.25rem' }}>{label}</h2>
              <p style={{ fontSize: '0.85rem', color: 'rgba(255,255,255,0.7)', margin: 0, maxWidth: 820 }}>{note}</p>
            </div>
          </div>
          <Component />
        </div>
      ))}
    </main>
  );
}

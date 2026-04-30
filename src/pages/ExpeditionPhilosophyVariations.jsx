// Expedition Philosophy — ten brand-native variants of the "This isn't transport"
// section. Visual vocabulary lifted from /aircraft/r66, /r66-benefits-variations,
// /ppl and /discovery-flight: Space Grotesk + Share Tech Mono, the warm-white +
// charcoal palette, multi-weight headline spans, mono eyebrows + numbered codes,
// hairline rules, center-seam device, stat-block aesthetic. No new aesthetic.
//
// View at /expeditions-philosophy-variations. Once one variant is chosen, lift
// it into FinalExpeditions.jsx → ExpeditionHistory.

import React, { useEffect, useRef, useState } from 'react';

// ===========================================================================
// 1. Locked content shared across every variant
// ===========================================================================
const LEAD = "This isn't transport.";

const BODY_1 =
  "This isn't transport. This is using the helicopter as a gateway to the " +
  "world — a first-class ticket to the beauty of our planet, seeing places " +
  "in ways that very few have ever experienced before.";

const BODY_2 =
  "We also offer fully bespoke expeditions tailored to your dreams. Tell us " +
  "where you want to go, and we'll make it happen.";

const FEATURES = [
  {
    code: 'PHIL-01',
    label: 'On the ground',
    title: 'Operations Team',
    body:
      "Our dedicated team works behind the scenes — ground contacts in constant " +
      "communication, facilitating every aspect of travel for a seamless experience.",
  },
  {
    code: 'PHIL-02',
    label: 'In the air',
    title: 'Real-World Skills',
    body:
      "You'll learn valuable flying skills in fully immersive, real-world " +
      "scenarios that can't be replicated in a classroom.",
  },
  {
    code: 'PHIL-03',
    label: 'Before departure',
    title: 'Full Preparation',
    body:
      "We provide packing lists, safety gear, briefing materials, and handle " +
      "all logistics so you can focus on the adventure.",
  },
];

const HEADLINE_PARTS = [
  { t: "This isn't",    w: 'dark' },
  { t: 'transport.',    w: 'mid' },
];
const HEADLINE_PARTS_LONG = [
  { t: 'A helicopter',         w: 'dark' },
  { t: 'is the gateway',       w: 'mid' },
  { t: 'to the world.',        w: 'light' },
];

// ===========================================================================
// 2. Shared primitives
// ===========================================================================
function Headline({ parts, className = '', inverted = false }) {
  const prefix = inverted ? 'expp-inv' : 'expp';
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

function useInView(ref, threshold = 0.2) {
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

function VariantFrame({ id, label, name, blurb, tone = 'light', children }) {
  return (
    <section id={id} className={`expp-frame expp-frame--${tone}`}>
      <header className="expp-frame__head">
        <div className="expp-frame__head-inner">
          <span className="expp-frame__tag">VARIANT {label}</span>
          <h3 className="expp-frame__name">{name}</h3>
          <p className="expp-frame__blurb">{blurb}</p>
        </div>
      </header>
      <div className="expp-frame__body">{children}</div>
    </section>
  );
}

// ===========================================================================
// 3. Tokens — multi-weight spans + base typography
// ===========================================================================
function GlobalTokens() {
  return (
    <style>{`
      .expp-text--dark  { color: #1a1a1a; font-weight: 500; }
      .expp-text--mid   { color: #4a4a4a; font-weight: 300; }
      .expp-text--light { color: #7a7a7a; font-weight: 300; }
      .expp-inv-text--dark  { color: #faf9f6; font-weight: 500; }
      .expp-inv-text--mid   { color: rgba(250,249,246,0.75); font-weight: 300; }
      .expp-inv-text--light { color: rgba(250,249,246,0.5);  font-weight: 300; }

      .expp { font-family: 'Space Grotesk', -apple-system, sans-serif; color: #1a1a1a; background: #faf9f6; min-height: 100vh; }
      .expp * { box-sizing: border-box; }
      .expp-mono { font-family: 'Share Tech Mono', monospace; letter-spacing: 0.2em; }

      .expp-page-head {
        padding: 6rem 2rem 3rem;
        max-width: 1200px;
        margin: 0 auto;
        text-align: center;
      }
      .expp-page-head__eyebrow {
        font-family: 'Share Tech Mono', monospace;
        font-size: 0.65rem;
        letter-spacing: 0.3em;
        color: #999;
        text-transform: uppercase;
        margin-bottom: 1.25rem;
      }
      .expp-page-head__title {
        font-size: clamp(2rem, 4vw, 3.2rem);
        font-weight: 700;
        letter-spacing: -0.02em;
        line-height: 1;
        margin: 0 0 1.5rem;
      }
      .expp-page-head__sub {
        max-width: 720px;
        margin: 0 auto;
        color: #555;
        line-height: 1.7;
        font-size: 0.95rem;
      }

      .expp-frame { padding: 0; border-top: 1px solid #e6e3df; }
      .expp-frame--dark { background: #0e0e0e; color: #faf9f6; border-top-color: #1a1a1a; }
      .expp-frame__head {
        padding: 3.25rem 2rem 1.75rem;
        border-bottom: 1px dashed rgba(0,0,0,0.08);
      }
      .expp-frame--dark .expp-frame__head { border-bottom-color: rgba(255,255,255,0.08); }
      .expp-frame__head-inner { max-width: 1200px; margin: 0 auto; }
      .expp-frame__tag {
        font-family: 'Share Tech Mono', monospace;
        font-size: 0.6rem;
        letter-spacing: 0.3em;
        color: #999;
        display: inline-block;
        margin-bottom: 0.5rem;
      }
      .expp-frame--dark .expp-frame__tag { color: rgba(255,255,255,0.45); }
      .expp-frame__name {
        font-size: 1.15rem;
        font-weight: 700;
        letter-spacing: -0.01em;
        text-transform: uppercase;
        margin: 0 0 0.4rem;
      }
      .expp-frame__blurb {
        max-width: 640px;
        font-size: 0.8rem;
        color: #777;
        line-height: 1.55;
        margin: 0;
      }
      .expp-frame--dark .expp-frame__blurb { color: rgba(255,255,255,0.55); }
      .expp-frame__body {
        padding: 4rem 2rem 6rem;
      }

      .expp-toc {
        position: sticky; top: 0;
        background: rgba(250,249,246,0.92);
        backdrop-filter: blur(8px);
        -webkit-backdrop-filter: blur(8px);
        border-bottom: 1px solid #e6e3df;
        z-index: 50;
      }
      .expp-toc__inner {
        max-width: 1200px; margin: 0 auto; padding: 0.85rem 2rem;
        display: flex; gap: 0.75rem; flex-wrap: wrap; align-items: center;
      }
      .expp-toc__label {
        font-family: 'Share Tech Mono', monospace;
        font-size: 0.55rem;
        letter-spacing: 0.3em;
        color: #999;
        text-transform: uppercase;
        margin-right: 0.5rem;
      }
      .expp-toc a {
        font-family: 'Share Tech Mono', monospace;
        font-size: 0.62rem;
        letter-spacing: 0.18em;
        color: #1a1a1a;
        text-decoration: none;
        padding: 0.35rem 0.6rem;
        border: 1px solid #e0deda;
        background: #fff;
        transition: background 0.15s, color 0.15s;
      }
      .expp-toc a:hover { background: #1a1a1a; color: #faf9f6; }
    `}</style>
  );
}

// ===========================================================================
// VARIANT A — Editorial Manifesto
// Oversized split headline, body column on the left, features as numbered
// editorial entries beneath with hairline rules.
// ===========================================================================
function VariantA() {
  return (
    <div className="expp-A">
      <div className="expp-A__opener">
        <span className="expp-mono expp-A__eyebrow">PHILOSOPHY · 01</span>
        <Headline className="expp-A__headline" parts={HEADLINE_PARTS_LONG} />
      </div>

      <div className="expp-A__body">
        <div className="expp-A__body-col">
          <p className="expp-A__lede">{BODY_1}</p>
          <p className="expp-A__copy">{BODY_2}</p>
        </div>
      </div>

      <div className="expp-A__features">
        {FEATURES.map((f, i) => (
          <article key={f.code} className="expp-A__feature">
            <div className="expp-A__feature-meta">
              <span className="expp-mono expp-A__feature-num">{String(i + 1).padStart(2, '0')}</span>
              <span className="expp-mono expp-A__feature-code">{f.code}</span>
            </div>
            <h4 className="expp-A__feature-title">{f.title}</h4>
            <p className="expp-A__feature-body">{f.body}</p>
          </article>
        ))}
      </div>

      <style>{`
        .expp-A { max-width: 1200px; margin: 0 auto; }
        .expp-A__opener { padding: 1rem 0 4rem; }
        .expp-A__eyebrow { display: block; font-size: 0.6rem; color: #999; margin-bottom: 1.25rem; }
        .expp-A__headline {
          font-size: clamp(2.6rem, 6.5vw, 5.4rem);
          line-height: 0.96;
          letter-spacing: -0.03em;
          margin: 0;
        }
        .expp-A__body { padding: 0 0 4rem; max-width: 760px; }
        .expp-A__lede { font-size: 1.05rem; line-height: 1.7; color: #2a2a2a; margin: 0 0 1.25rem; }
        .expp-A__copy { font-size: 0.95rem; line-height: 1.75; color: #666; margin: 0; }
        .expp-A__features {
          display: grid; grid-template-columns: repeat(3, 1fr);
          border-top: 1px solid #1a1a1a;
        }
        .expp-A__feature {
          padding: 2rem 1.75rem 0 0;
          border-right: 1px solid #e6e3df;
        }
        .expp-A__feature:last-child { border-right: none; padding-right: 0; }
        .expp-A__feature-meta {
          display: flex; align-items: center; gap: 0.75rem;
          margin-bottom: 1.25rem;
        }
        .expp-A__feature-num { font-size: 0.7rem; color: #1a1a1a; }
        .expp-A__feature-code { font-size: 0.55rem; color: #aaa; }
        .expp-A__feature-title {
          font-size: 0.95rem; font-weight: 700; text-transform: uppercase;
          letter-spacing: -0.01em; margin: 0 0 0.75rem;
        }
        .expp-A__feature-body { font-size: 0.85rem; line-height: 1.65; color: #666; margin: 0; }
        @media (max-width: 900px) {
          .expp-A__features { grid-template-columns: 1fr; }
          .expp-A__feature { border-right: none; border-bottom: 1px solid #e6e3df; padding: 2rem 0; }
          .expp-A__feature:last-child { border-bottom: none; }
        }
      `}</style>
    </div>
  );
}

// ===========================================================================
// VARIANT B — Center-Seam Split
// Vertical hairline divides left manifesto from right feature stack with
// mono codes on each.
// ===========================================================================
function VariantB() {
  return (
    <div className="expp-B">
      <div className="expp-B__layout">
        <div className="expp-B__left">
          <span className="expp-mono expp-B__eyebrow">EXPEDITION PHILOSOPHY</span>
          <Headline className="expp-B__headline" parts={HEADLINE_PARTS} />
          <p className="expp-B__lede">{BODY_1}</p>
          <p className="expp-B__copy">{BODY_2}</p>
        </div>

        <div className="expp-B__seam" aria-hidden="true">
          <div className="expp-B__seam-line" />
          <div className="expp-B__seam-cap"><span className="expp-mono">·</span></div>
        </div>

        <div className="expp-B__right">
          {FEATURES.map((f) => (
            <div key={f.code} className="expp-B__row">
              <div className="expp-B__row-meta">
                <span className="expp-mono expp-B__row-code">{f.code}</span>
                <span className="expp-mono expp-B__row-label">{f.label}</span>
              </div>
              <h4 className="expp-B__row-title">{f.title}</h4>
              <p className="expp-B__row-body">{f.body}</p>
            </div>
          ))}
        </div>
      </div>

      <style>{`
        .expp-B { max-width: 1200px; margin: 0 auto; }
        .expp-B__layout {
          display: grid;
          grid-template-columns: 1fr 1px 1fr;
          gap: 3rem;
          align-items: start;
        }
        .expp-B__eyebrow { display: block; font-size: 0.55rem; color: #999; margin-bottom: 1.25rem; }
        .expp-B__headline {
          font-size: clamp(2rem, 4.5vw, 3.6rem);
          line-height: 1.02;
          letter-spacing: -0.025em;
          margin: 0 0 1.75rem;
        }
        .expp-B__lede { font-size: 1rem; line-height: 1.7; color: #2a2a2a; margin: 0 0 1rem; }
        .expp-B__copy { font-size: 0.9rem; line-height: 1.7; color: #666; margin: 0; }
        .expp-B__seam { position: relative; }
        .expp-B__seam-line { position: absolute; top: 0; bottom: 0; left: 0; width: 1px; background: #d8d6d2; }
        .expp-B__seam-cap {
          position: absolute; top: 50%; left: -7px;
          width: 15px; height: 15px; border-radius: 50%;
          background: #faf9f6; border: 1px solid #1a1a1a;
          display: flex; align-items: center; justify-content: center;
          font-size: 0.65rem; color: #1a1a1a;
        }
        .expp-B__right { display: flex; flex-direction: column; gap: 2.5rem; }
        .expp-B__row { padding-bottom: 2rem; border-bottom: 1px solid #e6e3df; }
        .expp-B__row:last-child { border-bottom: none; padding-bottom: 0; }
        .expp-B__row-meta { display: flex; align-items: center; gap: 1rem; margin-bottom: 0.75rem; }
        .expp-B__row-code { font-size: 0.55rem; color: #1a1a1a; }
        .expp-B__row-label { font-size: 0.55rem; color: #aaa; }
        .expp-B__row-title { font-size: 1rem; font-weight: 700; text-transform: uppercase; letter-spacing: -0.01em; margin: 0 0 0.5rem; }
        .expp-B__row-body { font-size: 0.85rem; line-height: 1.65; color: #666; margin: 0; }
        @media (max-width: 900px) {
          .expp-B__layout { grid-template-columns: 1fr; gap: 2rem; }
          .expp-B__seam { display: none; }
        }
      `}</style>
    </div>
  );
}

// ===========================================================================
// VARIANT C — Numbered Triptych
// Manifesto banner above three giant 01/02/03 markers — one per feature.
// ===========================================================================
function VariantC() {
  return (
    <div className="expp-C">
      <div className="expp-C__manifesto">
        <span className="expp-mono expp-C__eyebrow">A DIFFERENT KIND OF FLYING</span>
        <Headline className="expp-C__headline" parts={HEADLINE_PARTS} />
        <p className="expp-C__copy">{BODY_1}</p>
        <p className="expp-C__copy expp-C__copy--quiet">{BODY_2}</p>
      </div>

      <div className="expp-C__grid">
        {FEATURES.map((f, i) => (
          <article key={f.code} className="expp-C__cell">
            <div className="expp-C__numeral">{String(i + 1).padStart(2, '0')}</div>
            <div className="expp-C__cell-body">
              <span className="expp-mono expp-C__cell-code">{f.code}</span>
              <h4 className="expp-C__cell-title">{f.title}</h4>
              <p className="expp-C__cell-text">{f.body}</p>
            </div>
          </article>
        ))}
      </div>

      <style>{`
        .expp-C { max-width: 1200px; margin: 0 auto; }
        .expp-C__manifesto { text-align: center; max-width: 720px; margin: 0 auto 4rem; }
        .expp-C__eyebrow { display: block; font-size: 0.6rem; color: #999; margin-bottom: 1.25rem; }
        .expp-C__headline {
          font-size: clamp(2.4rem, 5.5vw, 4.4rem);
          line-height: 1;
          letter-spacing: -0.025em;
          margin: 0 0 1.75rem;
        }
        .expp-C__copy { font-size: 1rem; line-height: 1.7; color: #444; margin: 0 0 1rem; }
        .expp-C__copy--quiet { color: #777; font-size: 0.9rem; }
        .expp-C__grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 0; border-top: 1px solid #1a1a1a; }
        .expp-C__cell { display: flex; flex-direction: column; padding: 2.5rem 1.75rem; border-right: 1px solid #e6e3df; }
        .expp-C__cell:last-child { border-right: none; }
        .expp-C__numeral {
          font-family: 'Space Grotesk', sans-serif;
          font-size: clamp(3.5rem, 7vw, 5.5rem);
          font-weight: 200;
          color: #1a1a1a;
          line-height: 1;
          margin-bottom: 1.75rem;
          letter-spacing: -0.04em;
        }
        .expp-C__cell-code { font-family: 'Share Tech Mono', monospace; font-size: 0.55rem; letter-spacing: 0.2em; color: #aaa; display: block; margin-bottom: 0.75rem; }
        .expp-C__cell-title { font-size: 1rem; font-weight: 700; text-transform: uppercase; letter-spacing: -0.01em; margin: 0 0 0.75rem; }
        .expp-C__cell-text { font-size: 0.85rem; line-height: 1.65; color: #666; margin: 0; }
        @media (max-width: 900px) {
          .expp-C__grid { grid-template-columns: 1fr; }
          .expp-C__cell { border-right: none; border-bottom: 1px solid #e6e3df; }
          .expp-C__cell:last-child { border-bottom: none; }
        }
      `}</style>
    </div>
  );
}

// ===========================================================================
// VARIANT D — Magazine Pull-Quote
// Massive editorial pull-quote treatment for the lead, body underneath,
// features as a thin horizontal track at the bottom.
// ===========================================================================
function VariantD() {
  return (
    <div className="expp-D">
      <div className="expp-D__quote-block">
        <span className="expp-mono expp-D__eyebrow">— FIELD NOTE</span>
        <blockquote className="expp-D__quote">
          <span className="expp-D__quote-mark" aria-hidden="true">“</span>
          <span className="expp-D__quote-text">{LEAD}</span>
        </blockquote>
        <p className="expp-D__attribution expp-mono">CAPTAIN Q · HQ AVIATION · DENHAM</p>
      </div>

      <div className="expp-D__body">
        <p className="expp-D__lede">{BODY_1}</p>
        <p className="expp-D__copy">{BODY_2}</p>
      </div>

      <div className="expp-D__track">
        {FEATURES.map((f) => (
          <div key={f.code} className="expp-D__track-item">
            <span className="expp-mono expp-D__track-code">{f.code}</span>
            <h4 className="expp-D__track-title">{f.title}</h4>
            <p className="expp-D__track-text">{f.body}</p>
          </div>
        ))}
      </div>

      <style>{`
        .expp-D { max-width: 1100px; margin: 0 auto; }
        .expp-D__quote-block { text-align: center; padding: 1rem 0 4rem; border-bottom: 1px solid #e6e3df; }
        .expp-D__eyebrow { display: block; font-size: 0.6rem; color: #999; margin-bottom: 1.5rem; }
        .expp-D__quote {
          margin: 0 auto;
          max-width: 880px;
          font-family: 'Space Grotesk', sans-serif;
          font-weight: 500;
          font-size: clamp(2.4rem, 6vw, 5rem);
          line-height: 1;
          letter-spacing: -0.025em;
          color: #1a1a1a;
          position: relative;
        }
        .expp-D__quote-mark { color: #c9c4bd; padding-right: 0.25em; }
        .expp-D__attribution { display: block; font-size: 0.6rem; color: #999; margin-top: 1.75rem; }
        .expp-D__body { max-width: 680px; margin: 4rem auto; text-align: center; }
        .expp-D__lede { font-size: 1rem; line-height: 1.7; color: #444; margin: 0 0 1rem; }
        .expp-D__copy { font-size: 0.9rem; line-height: 1.7; color: #777; margin: 0; }
        .expp-D__track {
          display: grid; grid-template-columns: repeat(3, 1fr);
          gap: 0; border-top: 1px solid #1a1a1a;
        }
        .expp-D__track-item { padding: 1.75rem 1.25rem; border-right: 1px solid #e6e3df; }
        .expp-D__track-item:last-child { border-right: none; }
        .expp-D__track-code { font-size: 0.55rem; color: #aaa; display: block; margin-bottom: 0.6rem; }
        .expp-D__track-title { font-size: 0.85rem; font-weight: 700; text-transform: uppercase; letter-spacing: -0.005em; margin: 0 0 0.5rem; }
        .expp-D__track-text { font-size: 0.78rem; line-height: 1.6; color: #666; margin: 0; }
        @media (max-width: 900px) {
          .expp-D__track { grid-template-columns: 1fr; }
          .expp-D__track-item { border-right: none; border-bottom: 1px solid #e6e3df; }
          .expp-D__track-item:last-child { border-bottom: none; }
        }
      `}</style>
    </div>
  );
}

// ===========================================================================
// VARIANT E — Mono-Code Grid (2×2)
// Manifesto + 3 features arranged as a 2×2 stat-block grid, each cell carries
// a mono code and hairline border — echoes the R66 stat aesthetic.
// ===========================================================================
function VariantE() {
  return (
    <div className="expp-E">
      <div className="expp-E__grid">
        <article className="expp-E__cell expp-E__cell--manifesto">
          <span className="expp-mono expp-E__cell-code">PHIL-00</span>
          <Headline className="expp-E__cell-title expp-E__cell-title--lead" parts={HEADLINE_PARTS} />
          <p className="expp-E__cell-body">{BODY_1}</p>
          <p className="expp-E__cell-body expp-E__cell-body--quiet">{BODY_2}</p>
        </article>

        {FEATURES.map((f) => (
          <article key={f.code} className="expp-E__cell">
            <span className="expp-mono expp-E__cell-code">{f.code}</span>
            <h4 className="expp-E__cell-title">{f.title}</h4>
            <p className="expp-E__cell-body">{f.body}</p>
            <span className="expp-mono expp-E__cell-tag">{f.label.toUpperCase()}</span>
          </article>
        ))}
      </div>

      <style>{`
        .expp-E { max-width: 1200px; margin: 0 auto; }
        .expp-E__grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 1px;
          background: #e0deda;
          border: 1px solid #e0deda;
        }
        .expp-E__cell {
          background: #faf9f6;
          padding: 2.25rem 2rem;
          display: flex; flex-direction: column;
        }
        .expp-E__cell--manifesto { padding: 2.5rem 2rem; }
        .expp-E__cell-code { font-size: 0.55rem; color: #aaa; margin-bottom: 1.25rem; }
        .expp-E__cell-title {
          font-size: 1.05rem;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: -0.01em;
          margin: 0 0 0.85rem;
        }
        .expp-E__cell-title--lead {
          font-size: clamp(1.8rem, 3.4vw, 2.6rem);
          line-height: 1.05;
          margin-bottom: 1.5rem;
        }
        .expp-E__cell-body { font-size: 0.88rem; line-height: 1.7; color: #555; margin: 0 0 1rem; }
        .expp-E__cell-body--quiet { color: #888; font-size: 0.82rem; }
        .expp-E__cell-tag { font-size: 0.55rem; color: #aaa; margin-top: auto; padding-top: 1.25rem; }
        @media (max-width: 900px) {
          .expp-E__grid { grid-template-columns: 1fr; }
        }
      `}</style>
    </div>
  );
}

// ===========================================================================
// VARIANT F — Vertical Timeline Rail
// Manifesto top, three features stacked vertically connected by a left rail
// (echoes the booking-step rail aesthetic).
// ===========================================================================
function VariantF() {
  return (
    <div className="expp-F">
      <div className="expp-F__manifesto">
        <span className="expp-mono expp-F__eyebrow">PHILOSOPHY</span>
        <Headline className="expp-F__headline" parts={HEADLINE_PARTS} />
        <p className="expp-F__copy">{BODY_1}</p>
        <p className="expp-F__copy expp-F__copy--quiet">{BODY_2}</p>
      </div>

      <div className="expp-F__rail">
        {FEATURES.map((f, i) => (
          <article key={f.code} className="expp-F__node">
            <div className="expp-F__node-rail" aria-hidden="true">
              <div className="expp-F__node-dot">{String(i + 1).padStart(2, '0')}</div>
              {i < FEATURES.length - 1 && <div className="expp-F__node-line" />}
            </div>
            <div className="expp-F__node-body">
              <div className="expp-F__node-meta">
                <span className="expp-mono expp-F__node-code">{f.code}</span>
                <span className="expp-mono expp-F__node-label">{f.label}</span>
              </div>
              <h4 className="expp-F__node-title">{f.title}</h4>
              <p className="expp-F__node-text">{f.body}</p>
            </div>
          </article>
        ))}
      </div>

      <style>{`
        .expp-F { max-width: 1100px; margin: 0 auto; }
        .expp-F__manifesto { max-width: 760px; margin-bottom: 4rem; }
        .expp-F__eyebrow { display: block; font-size: 0.6rem; color: #999; margin-bottom: 1rem; }
        .expp-F__headline {
          font-size: clamp(2rem, 4.4vw, 3.6rem);
          line-height: 1.02;
          letter-spacing: -0.025em;
          margin: 0 0 1.5rem;
        }
        .expp-F__copy { font-size: 1rem; line-height: 1.7; color: #444; margin: 0 0 0.75rem; }
        .expp-F__copy--quiet { color: #777; font-size: 0.9rem; }
        .expp-F__rail { display: flex; flex-direction: column; }
        .expp-F__node { display: grid; grid-template-columns: 60px 1fr; gap: 1.5rem; padding-bottom: 2.25rem; }
        .expp-F__node:last-child { padding-bottom: 0; }
        .expp-F__node-rail { display: flex; flex-direction: column; align-items: center; }
        .expp-F__node-dot {
          width: 36px; height: 36px;
          border: 1px solid #1a1a1a; border-radius: 50%;
          display: flex; align-items: center; justify-content: center;
          font-family: 'Share Tech Mono', monospace; font-size: 0.62rem;
          background: #faf9f6;
          flex-shrink: 0;
        }
        .expp-F__node-line { flex: 1; width: 1px; background: linear-gradient(to bottom, #1a1a1a, #d8d6d2); margin-top: 0.5rem; }
        .expp-F__node-meta { display: flex; gap: 1rem; margin-bottom: 0.5rem; }
        .expp-F__node-code { font-size: 0.55rem; color: #1a1a1a; }
        .expp-F__node-label { font-size: 0.55rem; color: #aaa; }
        .expp-F__node-title { font-size: 1.05rem; font-weight: 700; text-transform: uppercase; letter-spacing: -0.01em; margin: 0 0 0.5rem; }
        .expp-F__node-text { font-size: 0.9rem; line-height: 1.7; color: #555; margin: 0; max-width: 620px; }
      `}</style>
    </div>
  );
}

// ===========================================================================
// VARIANT G — Asymmetric Magazine Spread
// Print-magazine asymmetric layout: large lead, indented body, features
// arranged in offset columns at different vertical offsets.
// ===========================================================================
function VariantG() {
  return (
    <div className="expp-G">
      <div className="expp-G__top">
        <span className="expp-mono expp-G__folio">EXPEDITIONS · ISSUE 01 · PHILOSOPHY</span>
        <Headline className="expp-G__headline" parts={HEADLINE_PARTS_LONG} />
      </div>

      <div className="expp-G__columns">
        <div className="expp-G__col expp-G__col--body">
          <p className="expp-G__lede"><span className="expp-G__dropcap">T</span>{BODY_1.replace(/^This isn't transport\.\s*/, '')}</p>
          <p className="expp-G__copy">{BODY_2}</p>
        </div>

        <div className="expp-G__col expp-G__col--features">
          {FEATURES.map((f, i) => (
            <article key={f.code} className={`expp-G__feature expp-G__feature--${i}`}>
              <span className="expp-mono expp-G__feature-code">{f.code}</span>
              <h4 className="expp-G__feature-title">{f.title}</h4>
              <p className="expp-G__feature-body">{f.body}</p>
            </article>
          ))}
        </div>
      </div>

      <style>{`
        .expp-G { max-width: 1200px; margin: 0 auto; }
        .expp-G__top { padding-bottom: 3rem; border-bottom: 1px solid #1a1a1a; margin-bottom: 4rem; }
        .expp-G__folio { display: block; font-size: 0.55rem; color: #999; margin-bottom: 1.5rem; }
        .expp-G__headline {
          font-size: clamp(2.6rem, 7vw, 6rem);
          line-height: 0.96;
          letter-spacing: -0.035em;
          margin: 0;
        }
        .expp-G__columns { display: grid; grid-template-columns: 1.1fr 1fr; gap: 4rem; align-items: start; }
        .expp-G__lede { font-size: 1.05rem; line-height: 1.75; color: #2a2a2a; margin: 0 0 1.25rem; }
        .expp-G__dropcap {
          float: left; font-size: 4.5rem; line-height: 0.85; padding: 0.4rem 0.6rem 0 0;
          font-weight: 700; color: #1a1a1a;
        }
        .expp-G__copy { font-size: 0.92rem; line-height: 1.75; color: #666; margin: 0; }
        .expp-G__col--features { display: flex; flex-direction: column; gap: 1.75rem; }
        .expp-G__feature { padding: 1.25rem 0; border-top: 1px solid #1a1a1a; }
        .expp-G__feature--1 { margin-left: 1.5rem; }
        .expp-G__feature--2 { margin-left: 3rem; }
        .expp-G__feature-code { font-size: 0.55rem; color: #aaa; display: block; margin-bottom: 0.6rem; }
        .expp-G__feature-title { font-size: 1rem; font-weight: 700; text-transform: uppercase; letter-spacing: -0.01em; margin: 0 0 0.5rem; }
        .expp-G__feature-body { font-size: 0.85rem; line-height: 1.65; color: #666; margin: 0; }
        @media (max-width: 900px) {
          .expp-G__columns { grid-template-columns: 1fr; gap: 2.5rem; }
          .expp-G__feature--1, .expp-G__feature--2 { margin-left: 0; }
        }
      `}</style>
    </div>
  );
}

// ===========================================================================
// VARIANT H — Cinematic Stack
// Full-bleed dark frame, vertically stacked sections one feature at a time
// with maximum negative space. Mono labels.
// ===========================================================================
function VariantH() {
  return (
    <div className="expp-H">
      <div className="expp-H__opener">
        <span className="expp-mono expp-H__eyebrow">CHAPTER · 01 / PHILOSOPHY</span>
        <Headline className="expp-H__headline" parts={HEADLINE_PARTS_LONG} inverted />
        <p className="expp-H__copy">{BODY_1}</p>
        <p className="expp-H__copy expp-H__copy--quiet">{BODY_2}</p>
      </div>

      {FEATURES.map((f, i) => (
        <section key={f.code} className="expp-H__act">
          <div className="expp-H__act-meta">
            <span className="expp-mono expp-H__act-num">/ {String(i + 1).padStart(2, '0')}</span>
            <span className="expp-mono expp-H__act-code">{f.code}</span>
          </div>
          <h4 className="expp-H__act-title">{f.title}</h4>
          <p className="expp-H__act-body">{f.body}</p>
        </section>
      ))}

      <style>{`
        .expp-H { max-width: 920px; margin: 0 auto; color: #faf9f6; }
        .expp-H__opener { padding: 1rem 0 5rem; border-bottom: 1px solid rgba(255,255,255,0.1); margin-bottom: 5rem; }
        .expp-H__eyebrow { display: block; font-size: 0.6rem; color: rgba(255,255,255,0.5); margin-bottom: 1.5rem; }
        .expp-H__headline {
          font-size: clamp(2.4rem, 6vw, 5rem);
          line-height: 0.98;
          letter-spacing: -0.03em;
          margin: 0 0 2rem;
        }
        .expp-H__copy { font-size: 1rem; line-height: 1.75; color: rgba(255,255,255,0.75); margin: 0 0 0.75rem; max-width: 620px; }
        .expp-H__copy--quiet { color: rgba(255,255,255,0.5); font-size: 0.9rem; }
        .expp-H__act { padding: 4rem 0; border-bottom: 1px solid rgba(255,255,255,0.08); }
        .expp-H__act:last-child { border-bottom: none; }
        .expp-H__act-meta { display: flex; gap: 1rem; margin-bottom: 1.25rem; }
        .expp-H__act-num { font-size: 0.65rem; color: rgba(255,255,255,0.6); }
        .expp-H__act-code { font-size: 0.55rem; color: rgba(255,255,255,0.35); }
        .expp-H__act-title {
          font-size: clamp(1.4rem, 3vw, 2rem);
          font-weight: 700;
          letter-spacing: -0.02em;
          margin: 0 0 1rem;
          color: #faf9f6;
          text-transform: uppercase;
        }
        .expp-H__act-body { font-size: 0.95rem; line-height: 1.75; color: rgba(255,255,255,0.65); margin: 0; max-width: 620px; }
      `}</style>
    </div>
  );
}

// ===========================================================================
// VARIANT I — Editorial Stat Cards
// Features rebuilt as R66-style stat blocks with prefix labels, suffix units,
// and arrow accents. Manifesto sits left, stat cards right.
// ===========================================================================
function VariantI() {
  return (
    <div className="expp-I">
      <div className="expp-I__layout">
        <div className="expp-I__manifesto">
          <span className="expp-mono expp-I__eyebrow">PHILOSOPHY · NO. 01</span>
          <Headline className="expp-I__headline" parts={HEADLINE_PARTS} />
          <p className="expp-I__copy">{BODY_1}</p>
          <p className="expp-I__copy expp-I__copy--quiet">{BODY_2}</p>
        </div>

        <div className="expp-I__stats">
          {FEATURES.map((f) => (
            <article key={f.code} className="expp-I__stat">
              <div className="expp-I__stat-head">
                <span className="expp-mono expp-I__stat-code">{f.code}</span>
                <span className="expp-mono expp-I__stat-arrow">→</span>
              </div>
              <h4 className="expp-I__stat-title">{f.title}</h4>
              <p className="expp-I__stat-body">{f.body}</p>
              <span className="expp-mono expp-I__stat-foot">{f.label.toUpperCase()}</span>
            </article>
          ))}
        </div>
      </div>

      <style>{`
        .expp-I { max-width: 1200px; margin: 0 auto; }
        .expp-I__layout { display: grid; grid-template-columns: 1fr 1.2fr; gap: 4rem; align-items: start; }
        .expp-I__eyebrow { display: block; font-size: 0.55rem; color: #999; margin-bottom: 1rem; }
        .expp-I__headline {
          font-size: clamp(2rem, 4.5vw, 3.6rem);
          line-height: 1.02;
          letter-spacing: -0.025em;
          margin: 0 0 1.5rem;
        }
        .expp-I__copy { font-size: 1rem; line-height: 1.7; color: #444; margin: 0 0 0.75rem; }
        .expp-I__copy--quiet { color: #777; font-size: 0.9rem; }
        .expp-I__stats { display: grid; grid-template-columns: 1fr; gap: 1rem; }
        .expp-I__stat {
          padding: 1.5rem 1.5rem 1.25rem;
          border: 1px solid #e0deda;
          background: #fff;
          transition: border-color 0.2s, transform 0.2s;
        }
        .expp-I__stat:hover { border-color: #1a1a1a; transform: translateY(-2px); }
        .expp-I__stat-head { display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.85rem; }
        .expp-I__stat-code { font-size: 0.55rem; color: #aaa; }
        .expp-I__stat-arrow { font-size: 0.85rem; color: #1a1a1a; }
        .expp-I__stat-title { font-size: 1rem; font-weight: 700; text-transform: uppercase; letter-spacing: -0.01em; margin: 0 0 0.5rem; }
        .expp-I__stat-body { font-size: 0.85rem; line-height: 1.65; color: #666; margin: 0 0 1rem; }
        .expp-I__stat-foot { font-size: 0.5rem; color: #bbb; }
        @media (max-width: 900px) {
          .expp-I__layout { grid-template-columns: 1fr; gap: 2.5rem; }
        }
      `}</style>
    </div>
  );
}

// ===========================================================================
// VARIANT J — Inverted Triptych
// Full-bleed dark band for the manifesto, three light-card features below as
// a horizontal triptych. Intentional dark/light contrast.
// ===========================================================================
function VariantJ() {
  return (
    <div className="expp-J">
      <div className="expp-J__band">
        <div className="expp-J__band-inner">
          <span className="expp-mono expp-J__eyebrow">PHILOSOPHY</span>
          <Headline className="expp-J__headline" parts={HEADLINE_PARTS_LONG} inverted />
          <p className="expp-J__copy">{BODY_1}</p>
          <p className="expp-J__copy expp-J__copy--quiet">{BODY_2}</p>
        </div>
      </div>

      <div className="expp-J__triptych">
        {FEATURES.map((f, i) => (
          <article key={f.code} className="expp-J__panel">
            <div className="expp-J__panel-num">{String(i + 1).padStart(2, '0')}</div>
            <span className="expp-mono expp-J__panel-code">{f.code}</span>
            <h4 className="expp-J__panel-title">{f.title}</h4>
            <p className="expp-J__panel-body">{f.body}</p>
          </article>
        ))}
      </div>

      <style>{`
        .expp-J { max-width: 1200px; margin: 0 auto; }
        .expp-J__band {
          background: #0e0e0e;
          color: #faf9f6;
          padding: 3rem 2.5rem;
          margin-bottom: -2rem;
          position: relative;
          z-index: 1;
        }
        .expp-J__band-inner { max-width: 760px; }
        .expp-J__eyebrow { display: block; font-size: 0.6rem; color: rgba(255,255,255,0.5); margin-bottom: 1rem; }
        .expp-J__headline {
          font-size: clamp(2rem, 4.8vw, 3.8rem);
          line-height: 1.02;
          letter-spacing: -0.025em;
          margin: 0 0 1.25rem;
        }
        .expp-J__copy { font-size: 0.95rem; line-height: 1.7; color: rgba(255,255,255,0.75); margin: 0 0 0.5rem; }
        .expp-J__copy--quiet { color: rgba(255,255,255,0.5); font-size: 0.85rem; }
        .expp-J__triptych {
          display: grid; grid-template-columns: repeat(3, 1fr);
          gap: 1px;
          background: #e0deda;
          margin: 0 1.5rem;
          position: relative;
          z-index: 2;
          box-shadow: 0 6px 24px rgba(0,0,0,0.06);
        }
        .expp-J__panel { background: #faf9f6; padding: 2.25rem 1.75rem; }
        .expp-J__panel-num {
          font-family: 'Space Grotesk', sans-serif;
          font-size: 2.4rem; font-weight: 200;
          color: #1a1a1a;
          margin-bottom: 1rem;
          line-height: 1;
          letter-spacing: -0.04em;
        }
        .expp-J__panel-code { font-family: 'Share Tech Mono', monospace; font-size: 0.55rem; letter-spacing: 0.2em; color: #aaa; display: block; margin-bottom: 0.65rem; }
        .expp-J__panel-title { font-size: 1rem; font-weight: 700; text-transform: uppercase; letter-spacing: -0.01em; margin: 0 0 0.6rem; }
        .expp-J__panel-body { font-size: 0.85rem; line-height: 1.65; color: #666; margin: 0; }
        @media (max-width: 900px) {
          .expp-J__triptych { grid-template-columns: 1fr; margin: 0; }
          .expp-J__band { margin-bottom: 0; padding: 2.5rem 1.5rem; }
        }
      `}</style>
    </div>
  );
}

// ===========================================================================
// 4. Page composer
// ===========================================================================
const VARIANTS = [
  { id: 'A', name: 'Editorial Manifesto', blurb: 'Oversized split headline, body column, and a numbered editorial entry per feature beneath a heavy hairline rule.', tone: 'light', Component: VariantA },
  { id: 'B', name: 'Center-Seam Split', blurb: 'Vertical hairline divides left manifesto from right feature stack with mono codes on each row.', tone: 'light', Component: VariantB },
  { id: 'C', name: 'Numbered Triptych', blurb: 'Manifesto banner above three giant 01 / 02 / 03 markers — one per feature.', tone: 'light', Component: VariantC },
  { id: 'D', name: 'Magazine Pull-Quote', blurb: 'Editorial pull-quote treatment for the lead, body underneath, features as a thin horizontal track.', tone: 'light', Component: VariantD },
  { id: 'E', name: 'Mono-Code Grid', blurb: 'Manifesto + three features arranged as a 2×2 stat-block grid, each cell carrying a mono code.', tone: 'light', Component: VariantE },
  { id: 'F', name: 'Vertical Timeline Rail', blurb: 'Manifesto on top, features stacked vertically connected by a left rail (echoes the booking-step rail).', tone: 'light', Component: VariantF },
  { id: 'G', name: 'Asymmetric Magazine', blurb: 'Print-magazine asymmetric layout: drop-cap lede, indented body, features in offset columns.', tone: 'light', Component: VariantG },
  { id: 'H', name: 'Cinematic Stack', blurb: 'Full-bleed dark frame, vertically stacked sections one feature at a time with maximum negative space.', tone: 'dark', Component: VariantH },
  { id: 'I', name: 'Editorial Stat Cards', blurb: 'Features rebuilt as R66-style stat blocks with arrow accents, prefix labels and suffix tags.', tone: 'light', Component: VariantI },
  { id: 'J', name: 'Inverted Triptych', blurb: 'Full-bleed dark band for the manifesto, three light-card features below as a horizontal triptych.', tone: 'light', Component: VariantJ },
];

export default function ExpeditionPhilosophyVariations() {
  return (
    <div className="expp">
      <GlobalTokens />

      <div className="expp-page-head">
        <div className="expp-page-head__eyebrow">EXPEDITIONS · PHILOSOPHY · 10 VARIANTS</div>
        <h1 className="expp-page-head__title">This isn't transport.</h1>
        <p className="expp-page-head__sub">
          Ten brand-native treatments of the expedition philosophy section. Same
          content, same vocabulary — different composition. Pick a winner; we
          lift it into <code>FinalExpeditions.jsx</code>.
        </p>
      </div>

      <nav className="expp-toc">
        <div className="expp-toc__inner">
          <span className="expp-toc__label">JUMP TO</span>
          {VARIANTS.map(v => (
            <a key={v.id} href={`#variant-${v.id}`}>{v.id} · {v.name}</a>
          ))}
        </div>
      </nav>

      {VARIANTS.map((v) => (
        <VariantFrame
          key={v.id}
          id={`variant-${v.id}`}
          label={v.id}
          name={v.name}
          blurb={v.blurb}
          tone={v.tone}
        >
          <v.Component />
        </VariantFrame>
      ))}
    </div>
  );
}

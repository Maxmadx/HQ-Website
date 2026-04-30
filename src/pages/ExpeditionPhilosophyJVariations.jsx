// Expedition Philosophy — Variant J refinements.
// Base: J ("Inverted Triptych") — full-bleed dark band over a three-card light
// triptych. Each variant J1–J10 below changes ONE dimension of the base
// (overlap, edge handling, tabs, dual-tone, motion, etc.) while keeping the
// core dark-band → triptych skeleton intact.
//
// View at /expeditions-philosophy-j-variations.

import React, { useEffect, useMemo, useRef, useState } from 'react';

// ===========================================================================
// 1. Locked content — same constants as the parent variants page
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
    field: 'Operations',
    pair: 'OPS · 24/7',
    title: 'Operations Team',
    body:
      "Our dedicated team works behind the scenes — ground contacts in constant " +
      "communication, facilitating every aspect of travel for a seamless experience.",
  },
  {
    code: 'PHIL-02',
    label: 'In the air',
    field: 'Method',
    pair: 'AIR · LIVE',
    title: 'Real-World Skills',
    body:
      "You'll learn valuable flying skills in fully immersive, real-world " +
      "scenarios that can't be replicated in a classroom.",
  },
  {
    code: 'PHIL-03',
    label: 'Before departure',
    field: 'Process',
    pair: 'KIT · DOC',
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
  { t: 'A helicopter',   w: 'dark' },
  { t: 'is the gateway', w: 'mid' },
  { t: 'to the world.',  w: 'light' },
];

// ===========================================================================
// 2. Shared primitives
// ===========================================================================
function Headline({ parts, className = '', inverted = false }) {
  const prefix = inverted ? 'jx-inv' : 'jx';
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

function useInView(ref, threshold = 0.18) {
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

function VariantFrame({ id, label, name, blurb, children }) {
  return (
    <section id={id} className="jx-frame">
      <header className="jx-frame__head">
        <div className="jx-frame__head-inner">
          <span className="jx-frame__tag">VARIANT {label}</span>
          <h3 className="jx-frame__name">{name}</h3>
          <p className="jx-frame__blurb">{blurb}</p>
        </div>
      </header>
      <div className="jx-frame__body">{children}</div>
    </section>
  );
}

// ===========================================================================
// 3. Tokens
// ===========================================================================
function GlobalTokens() {
  return (
    <style>{`
      .jx-text--dark  { color: #1a1a1a; font-weight: 500; }
      .jx-text--mid   { color: #4a4a4a; font-weight: 300; }
      .jx-text--light { color: #7a7a7a; font-weight: 300; }
      .jx-inv-text--dark  { color: #faf9f6; font-weight: 500; }
      .jx-inv-text--mid   { color: rgba(250,249,246,0.75); font-weight: 300; }
      .jx-inv-text--light { color: rgba(250,249,246,0.5);  font-weight: 300; }

      .jx { font-family: 'Space Grotesk', -apple-system, sans-serif; color: #1a1a1a; background: #faf9f6; min-height: 100vh; }
      .jx * { box-sizing: border-box; }
      .jx-mono { font-family: 'Share Tech Mono', monospace; letter-spacing: 0.2em; }

      .jx-page-head { padding: 6rem 2rem 3rem; max-width: 1200px; margin: 0 auto; text-align: center; }
      .jx-page-head__eyebrow { font-family: 'Share Tech Mono', monospace; font-size: 0.65rem; letter-spacing: 0.3em; color: #999; text-transform: uppercase; margin-bottom: 1.25rem; }
      .jx-page-head__title { font-size: clamp(2rem, 4vw, 3.2rem); font-weight: 700; letter-spacing: -0.02em; line-height: 1; margin: 0 0 1.5rem; }
      .jx-page-head__sub { max-width: 720px; margin: 0 auto; color: #555; line-height: 1.7; font-size: 0.95rem; }

      .jx-frame { padding: 0; border-top: 1px solid #e6e3df; }
      .jx-frame__head { padding: 3.25rem 2rem 1.75rem; border-bottom: 1px dashed rgba(0,0,0,0.08); }
      .jx-frame__head-inner { max-width: 1200px; margin: 0 auto; }
      .jx-frame__tag { font-family: 'Share Tech Mono', monospace; font-size: 0.6rem; letter-spacing: 0.3em; color: #999; display: inline-block; margin-bottom: 0.5rem; }
      .jx-frame__name { font-size: 1.15rem; font-weight: 700; letter-spacing: -0.01em; text-transform: uppercase; margin: 0 0 0.4rem; }
      .jx-frame__blurb { max-width: 640px; font-size: 0.8rem; color: #777; line-height: 1.55; margin: 0; }
      .jx-frame__body { padding: 4rem 2rem 6rem; }

      .jx-toc {
        position: sticky; top: 0;
        background: rgba(250,249,246,0.92);
        backdrop-filter: blur(8px);
        -webkit-backdrop-filter: blur(8px);
        border-bottom: 1px solid #e6e3df;
        z-index: 50;
      }
      .jx-toc__inner { max-width: 1200px; margin: 0 auto; padding: 0.85rem 2rem; display: flex; gap: 0.5rem; flex-wrap: wrap; align-items: center; }
      .jx-toc__label { font-family: 'Share Tech Mono', monospace; font-size: 0.55rem; letter-spacing: 0.3em; color: #999; text-transform: uppercase; margin-right: 0.5rem; }
      .jx-toc a {
        font-family: 'Share Tech Mono', monospace;
        font-size: 0.6rem; letter-spacing: 0.18em;
        color: #1a1a1a; text-decoration: none;
        padding: 0.3rem 0.55rem;
        border: 1px solid #e0deda; background: #fff;
        transition: background 0.15s, color 0.15s;
      }
      .jx-toc a:hover { background: #1a1a1a; color: #faf9f6; }

      /* Shared band primitive — every J-variant derives from this. */
      .jx-band-base {
        background: #0e0e0e;
        color: #faf9f6;
        padding: 3.25rem 2.5rem;
      }
      .jx-band-base__inner { max-width: 760px; }
      .jx-band-base__eye { display: block; font-size: 0.6rem; color: rgba(255,255,255,0.5); margin-bottom: 1rem; }
      .jx-band-base__head {
        font-size: clamp(2rem, 4.8vw, 3.8rem);
        line-height: 1.02; letter-spacing: -0.025em; margin: 0 0 1.25rem;
      }
      .jx-band-base__copy { font-size: 0.95rem; line-height: 1.7; color: rgba(255,255,255,0.75); margin: 0 0 0.5rem; }
      .jx-band-base__copy--quiet { color: rgba(255,255,255,0.5); font-size: 0.85rem; }
    `}</style>
  );
}

// ===========================================================================
// VARIANT J1 — DEEPER OVERHANG
// Cards push much further up into the band; stronger drop shadow and a larger
// numeral. The dark band loses its lower padding so the cards' top edge cuts
// into the type column.
// ===========================================================================
function VariantJ1() {
  return (
    <div className="jx-J1">
      <div className="jx-J1__band">
        <div className="jx-J1__band-inner">
          <span className="jx-mono jx-J1__eye">PHILOSOPHY</span>
          <Headline className="jx-J1__head" parts={HEADLINE_PARTS_LONG} inverted />
          <p className="jx-J1__copy">{BODY_1}</p>
          <p className="jx-J1__copy jx-J1__copy--quiet">{BODY_2}</p>
        </div>
      </div>
      <div className="jx-J1__triptych">
        {FEATURES.map((f, i) => (
          <article key={f.code} className="jx-J1__panel">
            <div className="jx-J1__num">{String(i + 1).padStart(2, '0')}</div>
            <span className="jx-mono jx-J1__code">{f.code}</span>
            <h4 className="jx-J1__title">{f.title}</h4>
            <p className="jx-J1__body">{f.body}</p>
          </article>
        ))}
      </div>
      <style>{`
        .jx-J1 { max-width: 1200px; margin: 0 auto; }
        .jx-J1__band { background: #0e0e0e; color: #faf9f6; padding: 3rem 2.5rem 6rem; margin-bottom: -4rem; position: relative; z-index: 1; }
        .jx-J1__band-inner { max-width: 760px; }
        .jx-J1__eye { display: block; font-size: 0.6rem; color: rgba(255,255,255,0.5); margin-bottom: 1rem; }
        .jx-J1__head { font-size: clamp(2rem, 4.8vw, 3.8rem); line-height: 1.02; letter-spacing: -0.025em; margin: 0 0 1.25rem; }
        .jx-J1__copy { font-size: 0.95rem; line-height: 1.7; color: rgba(255,255,255,0.75); margin: 0 0 0.5rem; }
        .jx-J1__copy--quiet { color: rgba(255,255,255,0.5); font-size: 0.85rem; }
        .jx-J1__triptych { display: grid; grid-template-columns: repeat(3, 1fr); gap: 1px; background: #e0deda; margin: 0 1.5rem; position: relative; z-index: 2; box-shadow: 0 18px 40px rgba(0,0,0,0.18); }
        .jx-J1__panel { background: #faf9f6; padding: 2.75rem 1.85rem; }
        .jx-J1__num { font-size: 4rem; font-weight: 200; line-height: 0.9; letter-spacing: -0.05em; color: #1a1a1a; margin-bottom: 1.2rem; }
        .jx-J1__code { font-size: 0.55rem; color: #aaa; display: block; margin-bottom: 0.6rem; }
        .jx-J1__title { font-size: 1rem; font-weight: 700; text-transform: uppercase; letter-spacing: -0.01em; margin: 0 0 0.6rem; }
        .jx-J1__body { font-size: 0.85rem; line-height: 1.65; color: #666; margin: 0; }
        @media (max-width: 900px) { .jx-J1__triptych { grid-template-columns: 1fr; margin: 0; } .jx-J1__band { margin-bottom: 0; padding: 2.5rem 1.5rem; } }
      `}</style>
    </div>
  );
}

// ===========================================================================
// VARIANT J2 — EDGE-BLEED
// Cards bleed full width under the band, no horizontal inset. The band/cards
// boundary becomes a single hairline rule. Numerals shrink so the codes lead.
// ===========================================================================
function VariantJ2() {
  return (
    <div className="jx-J2">
      <div className="jx-J2__band">
        <div className="jx-J2__band-inner">
          <span className="jx-mono jx-J2__eye">PHILOSOPHY · NO. 01</span>
          <Headline className="jx-J2__head" parts={HEADLINE_PARTS_LONG} inverted />
          <p className="jx-J2__copy">{BODY_1}</p>
          <p className="jx-J2__copy jx-J2__copy--quiet">{BODY_2}</p>
        </div>
      </div>
      <div className="jx-J2__triptych">
        {FEATURES.map((f, i) => (
          <article key={f.code} className="jx-J2__panel">
            <div className="jx-J2__panel-meta">
              <span className="jx-mono jx-J2__code">{f.code}</span>
              <span className="jx-J2__num">{String(i + 1).padStart(2, '0')}</span>
            </div>
            <h4 className="jx-J2__title">{f.title}</h4>
            <p className="jx-J2__body">{f.body}</p>
            <span className="jx-mono jx-J2__foot">{f.label.toUpperCase()}</span>
          </article>
        ))}
      </div>
      <style>{`
        .jx-J2 { max-width: 1200px; margin: 0 auto; }
        .jx-J2__band { background: #0e0e0e; color: #faf9f6; padding: 3.25rem 2.5rem; }
        .jx-J2__band-inner { max-width: 760px; }
        .jx-J2__eye { display: block; font-size: 0.6rem; color: rgba(255,255,255,0.5); margin-bottom: 1rem; }
        .jx-J2__head { font-size: clamp(2rem, 4.8vw, 3.8rem); line-height: 1.02; letter-spacing: -0.025em; margin: 0 0 1.25rem; }
        .jx-J2__copy { font-size: 0.95rem; line-height: 1.7; color: rgba(255,255,255,0.75); margin: 0 0 0.5rem; }
        .jx-J2__copy--quiet { color: rgba(255,255,255,0.5); font-size: 0.85rem; }
        .jx-J2__triptych { display: grid; grid-template-columns: repeat(3, 1fr); gap: 0; background: #faf9f6; }
        .jx-J2__panel { padding: 2.5rem 2rem; border-right: 1px solid #e0deda; display: flex; flex-direction: column; }
        .jx-J2__panel:last-child { border-right: none; }
        .jx-J2__panel-meta { display: flex; align-items: baseline; justify-content: space-between; margin-bottom: 1rem; }
        .jx-J2__code { font-size: 0.55rem; color: #999; }
        .jx-J2__num { font-size: 1.4rem; font-weight: 200; color: #c9c4bd; letter-spacing: -0.04em; }
        .jx-J2__title { font-size: 1.1rem; font-weight: 700; text-transform: uppercase; letter-spacing: -0.01em; margin: 0 0 0.6rem; }
        .jx-J2__body { font-size: 0.88rem; line-height: 1.7; color: #555; margin: 0 0 1.5rem; }
        .jx-J2__foot { font-size: 0.5rem; color: #bbb; margin-top: auto; }
        @media (max-width: 900px) { .jx-J2__triptych { grid-template-columns: 1fr; } .jx-J2__panel { border-right: none; border-bottom: 1px solid #e0deda; } .jx-J2__panel:last-child { border-bottom: none; } }
      `}</style>
    </div>
  );
}

// ===========================================================================
// VARIANT J3 — PIERCED INDEX TABS
// Each card grows a small "index tab" at its top edge that pierces up into
// the dark band — like a file folder. Tab carries the numeral.
// ===========================================================================
function VariantJ3() {
  return (
    <div className="jx-J3">
      <div className="jx-J3__band">
        <div className="jx-J3__band-inner">
          <span className="jx-mono jx-J3__eye">PHILOSOPHY · INDEX</span>
          <Headline className="jx-J3__head" parts={HEADLINE_PARTS} inverted />
          <p className="jx-J3__copy">{BODY_1}</p>
          <p className="jx-J3__copy jx-J3__copy--quiet">{BODY_2}</p>
        </div>
      </div>
      <div className="jx-J3__triptych">
        {FEATURES.map((f, i) => (
          <article key={f.code} className="jx-J3__panel">
            <div className="jx-J3__tab">
              <span className="jx-J3__tab-num">{String(i + 1).padStart(2, '0')}</span>
              <span className="jx-mono jx-J3__tab-code">{f.code}</span>
            </div>
            <h4 className="jx-J3__title">{f.title}</h4>
            <p className="jx-J3__body">{f.body}</p>
            <span className="jx-mono jx-J3__foot">— {f.field.toUpperCase()}</span>
          </article>
        ))}
      </div>
      <style>{`
        .jx-J3 { max-width: 1200px; margin: 0 auto; }
        .jx-J3__band { background: #0e0e0e; color: #faf9f6; padding: 3rem 2.5rem 5rem; margin-bottom: -3rem; position: relative; z-index: 1; }
        .jx-J3__band-inner { max-width: 760px; }
        .jx-J3__eye { display: block; font-size: 0.6rem; color: rgba(255,255,255,0.5); margin-bottom: 1rem; }
        .jx-J3__head { font-size: clamp(2rem, 4.8vw, 3.8rem); line-height: 1.02; letter-spacing: -0.025em; margin: 0 0 1.25rem; }
        .jx-J3__copy { font-size: 0.95rem; line-height: 1.7; color: rgba(255,255,255,0.75); margin: 0 0 0.5rem; }
        .jx-J3__copy--quiet { color: rgba(255,255,255,0.5); font-size: 0.85rem; }
        .jx-J3__triptych { display: grid; grid-template-columns: repeat(3, 1fr); gap: 1px; background: #e0deda; margin: 0 1.5rem; position: relative; z-index: 2; padding-top: 1.6rem; }
        .jx-J3__panel { background: #faf9f6; padding: 0 1.85rem 2.25rem; position: relative; }
        .jx-J3__tab {
          position: absolute; top: -1.6rem; left: 1.85rem;
          background: #faf9f6; border: 1px solid #e0deda; border-bottom: none;
          padding: 0.45rem 0.85rem 0.5rem; display: flex; gap: 0.85rem; align-items: baseline;
        }
        .jx-J3__tab-num { font-family: 'Space Grotesk', sans-serif; font-size: 0.95rem; font-weight: 700; color: #1a1a1a; letter-spacing: -0.02em; }
        .jx-J3__tab-code { font-size: 0.5rem; color: #aaa; }
        .jx-J3__title { font-size: 1.05rem; font-weight: 700; text-transform: uppercase; letter-spacing: -0.01em; margin: 2rem 0 0.6rem; }
        .jx-J3__body { font-size: 0.85rem; line-height: 1.65; color: #666; margin: 0 0 1.25rem; }
        .jx-J3__foot { display: block; font-size: 0.5rem; color: #bbb; }
        @media (max-width: 900px) { .jx-J3__triptych { grid-template-columns: 1fr; margin: 0; } .jx-J3__band { margin-bottom: 0; } }
      `}</style>
    </div>
  );
}

// ===========================================================================
// VARIANT J4 — DUAL-TONE ECHO
// Each card splits horizontally: dark top half (mini-band echo) carries the
// numeral + code; light bottom half carries the title + body. The triptych
// replicates the parent dichotomy at card scale.
// ===========================================================================
function VariantJ4() {
  return (
    <div className="jx-J4">
      <div className="jx-J4__band">
        <div className="jx-J4__band-inner">
          <span className="jx-mono jx-J4__eye">PHILOSOPHY</span>
          <Headline className="jx-J4__head" parts={HEADLINE_PARTS_LONG} inverted />
          <p className="jx-J4__copy">{BODY_1}</p>
          <p className="jx-J4__copy jx-J4__copy--quiet">{BODY_2}</p>
        </div>
      </div>
      <div className="jx-J4__triptych">
        {FEATURES.map((f, i) => (
          <article key={f.code} className="jx-J4__panel">
            <div className="jx-J4__cap">
              <span className="jx-J4__num">{String(i + 1).padStart(2, '0')}</span>
              <span className="jx-mono jx-J4__cap-code">{f.code}</span>
            </div>
            <div className="jx-J4__well">
              <h4 className="jx-J4__title">{f.title}</h4>
              <p className="jx-J4__body">{f.body}</p>
              <span className="jx-mono jx-J4__well-foot">{f.label.toUpperCase()}</span>
            </div>
          </article>
        ))}
      </div>
      <style>{`
        .jx-J4 { max-width: 1200px; margin: 0 auto; }
        .jx-J4__band { background: #0e0e0e; color: #faf9f6; padding: 3rem 2.5rem; margin-bottom: 1.5rem; }
        .jx-J4__band-inner { max-width: 760px; }
        .jx-J4__eye { display: block; font-size: 0.6rem; color: rgba(255,255,255,0.5); margin-bottom: 1rem; }
        .jx-J4__head { font-size: clamp(2rem, 4.8vw, 3.8rem); line-height: 1.02; letter-spacing: -0.025em; margin: 0 0 1.25rem; }
        .jx-J4__copy { font-size: 0.95rem; line-height: 1.7; color: rgba(255,255,255,0.75); margin: 0 0 0.5rem; }
        .jx-J4__copy--quiet { color: rgba(255,255,255,0.5); font-size: 0.85rem; }
        .jx-J4__triptych { display: grid; grid-template-columns: repeat(3, 1fr); gap: 1.5rem; }
        .jx-J4__panel { display: flex; flex-direction: column; box-shadow: 0 8px 26px rgba(0,0,0,0.08); }
        .jx-J4__cap { background: #1a1a1a; color: #faf9f6; padding: 1.5rem 1.5rem 1.25rem; display: flex; justify-content: space-between; align-items: baseline; }
        .jx-J4__num { font-size: 2.6rem; font-weight: 200; line-height: 1; letter-spacing: -0.04em; }
        .jx-J4__cap-code { font-size: 0.55rem; color: rgba(255,255,255,0.5); }
        .jx-J4__well { background: #faf9f6; padding: 1.5rem 1.5rem 1.75rem; flex: 1; display: flex; flex-direction: column; }
        .jx-J4__title { font-size: 1.05rem; font-weight: 700; text-transform: uppercase; letter-spacing: -0.01em; margin: 0 0 0.65rem; }
        .jx-J4__body { font-size: 0.88rem; line-height: 1.7; color: #555; margin: 0 0 1.25rem; }
        .jx-J4__well-foot { font-size: 0.5rem; color: #bbb; margin-top: auto; }
        @media (max-width: 900px) { .jx-J4__triptych { grid-template-columns: 1fr; } }
      `}</style>
    </div>
  );
}

// ===========================================================================
// VARIANT J5 — NUMERAL BRIDGE
// A single big numeral straddles the band/card boundary — its top half lives
// in the dark band as cream, the bottom half lives in the card as charcoal.
// Visual bridge between the two zones.
// ===========================================================================
function VariantJ5() {
  return (
    <div className="jx-J5">
      <div className="jx-J5__band">
        <div className="jx-J5__band-inner">
          <span className="jx-mono jx-J5__eye">PHILOSOPHY</span>
          <Headline className="jx-J5__head" parts={HEADLINE_PARTS} inverted />
          <p className="jx-J5__copy">{BODY_1}</p>
          <p className="jx-J5__copy jx-J5__copy--quiet">{BODY_2}</p>
        </div>
      </div>
      <div className="jx-J5__triptych">
        {FEATURES.map((f, i) => {
          const num = String(i + 1).padStart(2, '0');
          return (
            <article key={f.code} className="jx-J5__panel">
              <div className="jx-J5__bridge" aria-hidden="true">
                <span className="jx-J5__bridge-num jx-J5__bridge-num--top">{num}</span>
                <span className="jx-J5__bridge-num jx-J5__bridge-num--bot">{num}</span>
              </div>
              <div className="jx-J5__well">
                <span className="jx-mono jx-J5__code">{f.code} · {f.field.toUpperCase()}</span>
                <h4 className="jx-J5__title">{f.title}</h4>
                <p className="jx-J5__body">{f.body}</p>
              </div>
            </article>
          );
        })}
      </div>
      <style>{`
        .jx-J5 { max-width: 1200px; margin: 0 auto; }
        .jx-J5__band { background: #0e0e0e; color: #faf9f6; padding: 3rem 2.5rem 5.5rem; }
        .jx-J5__band-inner { max-width: 760px; }
        .jx-J5__eye { display: block; font-size: 0.6rem; color: rgba(255,255,255,0.5); margin-bottom: 1rem; }
        .jx-J5__head { font-size: clamp(2rem, 4.8vw, 3.8rem); line-height: 1.02; letter-spacing: -0.025em; margin: 0 0 1.25rem; }
        .jx-J5__copy { font-size: 0.95rem; line-height: 1.7; color: rgba(255,255,255,0.75); margin: 0 0 0.5rem; }
        .jx-J5__copy--quiet { color: rgba(255,255,255,0.5); font-size: 0.85rem; }
        .jx-J5__triptych { display: grid; grid-template-columns: repeat(3, 1fr); gap: 1px; background: #e0deda; margin: -3.25rem 1.5rem 0; position: relative; z-index: 2; }
        .jx-J5__panel { background: #faf9f6; padding-top: 0; position: relative; }
        .jx-J5__bridge { position: relative; height: 4.5rem; overflow: visible; }
        .jx-J5__bridge-num { position: absolute; left: 1.5rem; font-family: 'Space Grotesk', sans-serif; font-size: 4.8rem; font-weight: 200; line-height: 1; letter-spacing: -0.05em; }
        .jx-J5__bridge-num--top { top: -3rem; color: rgba(250,249,246,0.9); clip-path: inset(0 0 50% 0); }
        .jx-J5__bridge-num--bot { top: -3rem; color: #1a1a1a; clip-path: inset(50% 0 0 0); }
        .jx-J5__well { padding: 0.5rem 1.85rem 2.25rem; }
        .jx-J5__code { font-size: 0.55rem; color: #aaa; display: block; margin-bottom: 0.7rem; }
        .jx-J5__title { font-size: 1.05rem; font-weight: 700; text-transform: uppercase; letter-spacing: -0.01em; margin: 0 0 0.6rem; }
        .jx-J5__body { font-size: 0.85rem; line-height: 1.65; color: #666; margin: 0; }
        @media (max-width: 900px) { .jx-J5__triptych { grid-template-columns: 1fr; margin: 0; } .jx-J5__band { padding-bottom: 3rem; } }
      `}</style>
    </div>
  );
}

// ===========================================================================
// VARIANT J6 — HAIRLINE COORDINATES
// Cards keep the triptych shape but each gets corner mono coordinates
// (FRAME 01 · OPS / 51.57°N / etc.) — print-coordinate / map aesthetic.
// ===========================================================================
function VariantJ6() {
  const COORDS = [
    { tl: 'FRAME 01', tr: '51.57°N', bl: 'OPS', br: 'GROUND' },
    { tl: 'FRAME 02', tr: '00.50°W', bl: 'AIR', br: 'LIVE' },
    { tl: 'FRAME 03', tr: 'EGLD',    bl: 'KIT', br: 'BRIEF' },
  ];
  return (
    <div className="jx-J6">
      <div className="jx-J6__band">
        <div className="jx-J6__band-inner">
          <span className="jx-mono jx-J6__eye">PHILOSOPHY · CHART</span>
          <Headline className="jx-J6__head" parts={HEADLINE_PARTS_LONG} inverted />
          <p className="jx-J6__copy">{BODY_1}</p>
          <p className="jx-J6__copy jx-J6__copy--quiet">{BODY_2}</p>
        </div>
      </div>
      <div className="jx-J6__triptych">
        {FEATURES.map((f, i) => (
          <article key={f.code} className="jx-J6__panel">
            <span className="jx-mono jx-J6__corner jx-J6__corner--tl">{COORDS[i].tl}</span>
            <span className="jx-mono jx-J6__corner jx-J6__corner--tr">{COORDS[i].tr}</span>
            <span className="jx-mono jx-J6__corner jx-J6__corner--bl">{COORDS[i].bl}</span>
            <span className="jx-mono jx-J6__corner jx-J6__corner--br">{COORDS[i].br}</span>
            <h4 className="jx-J6__title">{f.title}</h4>
            <p className="jx-J6__body">{f.body}</p>
          </article>
        ))}
      </div>
      <style>{`
        .jx-J6 { max-width: 1200px; margin: 0 auto; }
        .jx-J6__band { background: #0e0e0e; color: #faf9f6; padding: 3rem 2.5rem; margin-bottom: 1.5rem; }
        .jx-J6__band-inner { max-width: 760px; }
        .jx-J6__eye { display: block; font-size: 0.6rem; color: rgba(255,255,255,0.5); margin-bottom: 1rem; }
        .jx-J6__head { font-size: clamp(2rem, 4.8vw, 3.8rem); line-height: 1.02; letter-spacing: -0.025em; margin: 0 0 1.25rem; }
        .jx-J6__copy { font-size: 0.95rem; line-height: 1.7; color: rgba(255,255,255,0.75); margin: 0 0 0.5rem; }
        .jx-J6__copy--quiet { color: rgba(255,255,255,0.5); font-size: 0.85rem; }
        .jx-J6__triptych { display: grid; grid-template-columns: repeat(3, 1fr); gap: 1.5rem; }
        .jx-J6__panel { position: relative; background: #faf9f6; border: 1px solid #1a1a1a; padding: 3rem 2rem 3.25rem; min-height: 220px; }
        .jx-J6__corner { position: absolute; font-size: 0.5rem; color: #1a1a1a; padding: 0.25rem 0.5rem; background: #faf9f6; }
        .jx-J6__corner--tl { top: -0.55rem; left: 0.85rem; }
        .jx-J6__corner--tr { top: -0.55rem; right: 0.85rem; }
        .jx-J6__corner--bl { bottom: -0.55rem; left: 0.85rem; }
        .jx-J6__corner--br { bottom: -0.55rem; right: 0.85rem; }
        .jx-J6__title { font-size: 1.1rem; font-weight: 700; text-transform: uppercase; letter-spacing: -0.01em; margin: 0 0 0.7rem; }
        .jx-J6__body { font-size: 0.88rem; line-height: 1.7; color: #555; margin: 0; }
        @media (max-width: 900px) { .jx-J6__triptych { grid-template-columns: 1fr; } }
      `}</style>
    </div>
  );
}

// ===========================================================================
// VARIANT J7 — STAGGERED HEIGHTS
// Three cards with intentionally different heights (short / tall / medium)
// and vertical offsets — print-magazine column rhythm.
// ===========================================================================
function VariantJ7() {
  return (
    <div className="jx-J7">
      <div className="jx-J7__band">
        <div className="jx-J7__band-inner">
          <span className="jx-mono jx-J7__eye">PHILOSOPHY · COLUMNS</span>
          <Headline className="jx-J7__head" parts={HEADLINE_PARTS} inverted />
          <p className="jx-J7__copy">{BODY_1}</p>
          <p className="jx-J7__copy jx-J7__copy--quiet">{BODY_2}</p>
        </div>
      </div>
      <div className="jx-J7__triptych">
        {FEATURES.map((f, i) => (
          <article key={f.code} className={`jx-J7__panel jx-J7__panel--${i}`}>
            <div className="jx-J7__num">{String(i + 1).padStart(2, '0')}</div>
            <span className="jx-mono jx-J7__code">{f.code} · {f.field.toUpperCase()}</span>
            <h4 className="jx-J7__title">{f.title}</h4>
            <p className="jx-J7__body">{f.body}</p>
          </article>
        ))}
      </div>
      <style>{`
        .jx-J7 { max-width: 1200px; margin: 0 auto; }
        .jx-J7__band { background: #0e0e0e; color: #faf9f6; padding: 3rem 2.5rem 5rem; margin-bottom: -3rem; position: relative; z-index: 1; }
        .jx-J7__band-inner { max-width: 760px; }
        .jx-J7__eye { display: block; font-size: 0.6rem; color: rgba(255,255,255,0.5); margin-bottom: 1rem; }
        .jx-J7__head { font-size: clamp(2rem, 4.8vw, 3.8rem); line-height: 1.02; letter-spacing: -0.025em; margin: 0 0 1.25rem; }
        .jx-J7__copy { font-size: 0.95rem; line-height: 1.7; color: rgba(255,255,255,0.75); margin: 0 0 0.5rem; }
        .jx-J7__copy--quiet { color: rgba(255,255,255,0.5); font-size: 0.85rem; }
        .jx-J7__triptych { display: grid; grid-template-columns: repeat(3, 1fr); gap: 1.25rem; align-items: start; padding: 0 1.5rem; position: relative; z-index: 2; }
        .jx-J7__panel { background: #faf9f6; padding: 1.85rem 1.6rem 2rem; box-shadow: 0 12px 30px rgba(0,0,0,0.1); }
        .jx-J7__panel--0 { transform: translateY(0); }
        .jx-J7__panel--1 { transform: translateY(2.5rem); }
        .jx-J7__panel--2 { transform: translateY(1rem); }
        .jx-J7__num { font-size: 2.6rem; font-weight: 200; color: #1a1a1a; line-height: 1; letter-spacing: -0.04em; margin-bottom: 0.85rem; }
        .jx-J7__code { font-size: 0.55rem; color: #aaa; display: block; margin-bottom: 0.6rem; }
        .jx-J7__title { font-size: 1rem; font-weight: 700; text-transform: uppercase; letter-spacing: -0.01em; margin: 0 0 0.55rem; }
        .jx-J7__body { font-size: 0.85rem; line-height: 1.65; color: #666; margin: 0; }
        @media (max-width: 900px) {
          .jx-J7__triptych { grid-template-columns: 1fr; padding: 0; }
          .jx-J7__panel--0, .jx-J7__panel--1, .jx-J7__panel--2 { transform: none; }
          .jx-J7__band { margin-bottom: 0; padding: 2.5rem 1.5rem; }
        }
      `}</style>
    </div>
  );
}

// ===========================================================================
// VARIANT J8 — STAT-BLOCK NUMERALS
// Numerals replaced with R66-style stat blocks: prefix label, big value, mono
// suffix. Reads as a quantified philosophy panel rather than a feature card.
// ===========================================================================
function VariantJ8() {
  const STATS = [
    { value: '24',  unit: '/7',     label: 'GROUND CONTACT' },
    { value: '100', unit: '%',      label: 'IMMERSIVE FLYING' },
    { value: '0',   unit: ' GAPS',  label: 'PREP / KIT / BRIEF' },
  ];
  return (
    <div className="jx-J8">
      <div className="jx-J8__band">
        <div className="jx-J8__band-inner">
          <span className="jx-mono jx-J8__eye">PHILOSOPHY · IN NUMBERS</span>
          <Headline className="jx-J8__head" parts={HEADLINE_PARTS_LONG} inverted />
          <p className="jx-J8__copy">{BODY_1}</p>
          <p className="jx-J8__copy jx-J8__copy--quiet">{BODY_2}</p>
        </div>
      </div>
      <div className="jx-J8__triptych">
        {FEATURES.map((f, i) => (
          <article key={f.code} className="jx-J8__panel">
            <div className="jx-J8__stat">
              <span className="jx-mono jx-J8__stat-prefix">{f.code}</span>
              <div className="jx-J8__stat-row">
                <span className="jx-J8__stat-value">{STATS[i].value}</span>
                <span className="jx-mono jx-J8__stat-unit">{STATS[i].unit}</span>
              </div>
              <span className="jx-mono jx-J8__stat-label">{STATS[i].label}</span>
            </div>
            <h4 className="jx-J8__title">{f.title}</h4>
            <p className="jx-J8__body">{f.body}</p>
          </article>
        ))}
      </div>
      <style>{`
        .jx-J8 { max-width: 1200px; margin: 0 auto; }
        .jx-J8__band { background: #0e0e0e; color: #faf9f6; padding: 3rem 2.5rem; margin-bottom: -2rem; position: relative; z-index: 1; }
        .jx-J8__band-inner { max-width: 760px; }
        .jx-J8__eye { display: block; font-size: 0.6rem; color: rgba(255,255,255,0.5); margin-bottom: 1rem; }
        .jx-J8__head { font-size: clamp(2rem, 4.8vw, 3.8rem); line-height: 1.02; letter-spacing: -0.025em; margin: 0 0 1.25rem; }
        .jx-J8__copy { font-size: 0.95rem; line-height: 1.7; color: rgba(255,255,255,0.75); margin: 0 0 0.5rem; }
        .jx-J8__copy--quiet { color: rgba(255,255,255,0.5); font-size: 0.85rem; }
        .jx-J8__triptych { display: grid; grid-template-columns: repeat(3, 1fr); gap: 1px; background: #e0deda; margin: 0 1.5rem; position: relative; z-index: 2; box-shadow: 0 14px 32px rgba(0,0,0,0.1); }
        .jx-J8__panel { background: #faf9f6; padding: 2.25rem 1.85rem 2rem; }
        .jx-J8__stat { display: flex; flex-direction: column; gap: 0.4rem; padding-bottom: 1rem; margin-bottom: 1.25rem; border-bottom: 1px solid #1a1a1a; }
        .jx-J8__stat-prefix { font-size: 0.55rem; color: #aaa; }
        .jx-J8__stat-row { display: flex; align-items: baseline; gap: 0.4rem; }
        .jx-J8__stat-value { font-size: 3rem; font-weight: 200; line-height: 1; letter-spacing: -0.04em; color: #1a1a1a; }
        .jx-J8__stat-unit { font-size: 0.7rem; color: #1a1a1a; }
        .jx-J8__stat-label { font-size: 0.55rem; color: #777; }
        .jx-J8__title { font-size: 1rem; font-weight: 700; text-transform: uppercase; letter-spacing: -0.01em; margin: 0 0 0.55rem; }
        .jx-J8__body { font-size: 0.85rem; line-height: 1.65; color: #666; margin: 0; }
        @media (max-width: 900px) { .jx-J8__triptych { grid-template-columns: 1fr; margin: 0; } .jx-J8__band { margin-bottom: 0; } }
      `}</style>
    </div>
  );
}

// ===========================================================================
// VARIANT J9 — SEAMLESS SPREAD
// Removes card borders and shadows. The triptych becomes a single editorial
// spread with hairline rules between columns. Band and triptych read as one
// continuous artefact.
// ===========================================================================
function VariantJ9() {
  return (
    <div className="jx-J9">
      <div className="jx-J9__band">
        <div className="jx-J9__band-inner">
          <span className="jx-mono jx-J9__eye">PHILOSOPHY · SPREAD</span>
          <Headline className="jx-J9__head" parts={HEADLINE_PARTS_LONG} inverted />
          <p className="jx-J9__copy">{BODY_1}</p>
          <p className="jx-J9__copy jx-J9__copy--quiet">{BODY_2}</p>
        </div>
      </div>
      <div className="jx-J9__rule" />
      <div className="jx-J9__triptych">
        {FEATURES.map((f, i) => (
          <article key={f.code} className="jx-J9__panel">
            <div className="jx-J9__panel-meta">
              <span className="jx-mono jx-J9__num">— {String(i + 1).padStart(2, '0')}</span>
              <span className="jx-mono jx-J9__code">{f.code}</span>
            </div>
            <h4 className="jx-J9__title">{f.title}</h4>
            <p className="jx-J9__body">{f.body}</p>
          </article>
        ))}
      </div>
      <style>{`
        .jx-J9 { max-width: 1200px; margin: 0 auto; }
        .jx-J9__band { background: #0e0e0e; color: #faf9f6; padding: 3rem 2.5rem; }
        .jx-J9__band-inner { max-width: 760px; }
        .jx-J9__eye { display: block; font-size: 0.6rem; color: rgba(255,255,255,0.5); margin-bottom: 1rem; }
        .jx-J9__head { font-size: clamp(2rem, 4.8vw, 3.8rem); line-height: 1.02; letter-spacing: -0.025em; margin: 0 0 1.25rem; }
        .jx-J9__copy { font-size: 0.95rem; line-height: 1.7; color: rgba(255,255,255,0.75); margin: 0 0 0.5rem; }
        .jx-J9__copy--quiet { color: rgba(255,255,255,0.5); font-size: 0.85rem; }
        .jx-J9__rule { height: 1px; background: #1a1a1a; margin: 0; }
        .jx-J9__triptych { display: grid; grid-template-columns: repeat(3, 1fr); gap: 0; }
        .jx-J9__panel { padding: 2.5rem 2.25rem 0; border-right: 1px solid #d8d6d2; min-height: 240px; }
        .jx-J9__panel:last-child { border-right: none; }
        .jx-J9__panel-meta { display: flex; justify-content: space-between; align-items: baseline; margin-bottom: 1.25rem; }
        .jx-J9__num { font-size: 0.65rem; color: #1a1a1a; }
        .jx-J9__code { font-size: 0.55rem; color: #aaa; }
        .jx-J9__title { font-size: 1.1rem; font-weight: 700; text-transform: uppercase; letter-spacing: -0.01em; margin: 0 0 0.7rem; }
        .jx-J9__body { font-size: 0.9rem; line-height: 1.7; color: #555; margin: 0 0 2.5rem; }
        @media (max-width: 900px) {
          .jx-J9__triptych { grid-template-columns: 1fr; }
          .jx-J9__panel { border-right: none; border-bottom: 1px solid #d8d6d2; }
          .jx-J9__panel:last-child { border-bottom: none; }
        }
      `}</style>
    </div>
  );
}

// ===========================================================================
// VARIANT J10 — CHOREOGRAPHED MOTION
// Same J skeleton, but with IntersectionObserver-driven cascade animation:
// band fades in, hairline draws across, then each card rises into position
// (staggered 120ms). Hover lifts a card slightly.
// ===========================================================================
function VariantJ10() {
  const ref = useRef(null);
  const inView = useInView(ref, 0.18);
  return (
    <div className={`jx-J10 ${inView ? 'is-in' : ''}`} ref={ref}>
      <div className="jx-J10__band">
        <div className="jx-J10__band-inner">
          <span className="jx-mono jx-J10__eye">PHILOSOPHY · MOTION</span>
          <Headline className="jx-J10__head" parts={HEADLINE_PARTS_LONG} inverted />
          <p className="jx-J10__copy">{BODY_1}</p>
          <p className="jx-J10__copy jx-J10__copy--quiet">{BODY_2}</p>
        </div>
        <div className="jx-J10__sweep" aria-hidden="true" />
      </div>
      <div className="jx-J10__triptych">
        {FEATURES.map((f, i) => (
          <article key={f.code} className="jx-J10__panel" style={{ '--d': `${i * 0.12}s` }}>
            <div className="jx-J10__num">{String(i + 1).padStart(2, '0')}</div>
            <span className="jx-mono jx-J10__code">{f.code} · {f.field.toUpperCase()}</span>
            <h4 className="jx-J10__title">{f.title}</h4>
            <p className="jx-J10__body">{f.body}</p>
          </article>
        ))}
      </div>
      <style>{`
        .jx-J10 { max-width: 1200px; margin: 0 auto; }
        .jx-J10__band { background: #0e0e0e; color: #faf9f6; padding: 3rem 2.5rem 5rem; margin-bottom: -2.5rem; position: relative; z-index: 1; opacity: 0; transform: translateY(8px); transition: opacity 0.7s ease, transform 0.7s ease; }
        .jx-J10.is-in .jx-J10__band { opacity: 1; transform: translateY(0); }
        .jx-J10__band-inner { max-width: 760px; }
        .jx-J10__eye { display: block; font-size: 0.6rem; color: rgba(255,255,255,0.5); margin-bottom: 1rem; }
        .jx-J10__head { font-size: clamp(2rem, 4.8vw, 3.8rem); line-height: 1.02; letter-spacing: -0.025em; margin: 0 0 1.25rem; }
        .jx-J10__copy { font-size: 0.95rem; line-height: 1.7; color: rgba(255,255,255,0.75); margin: 0 0 0.5rem; }
        .jx-J10__copy--quiet { color: rgba(255,255,255,0.5); font-size: 0.85rem; }
        .jx-J10__sweep { position: absolute; left: 0; right: 0; bottom: 0; height: 1px; background: #faf9f6; transform-origin: left; transform: scaleX(0); transition: transform 0.9s ease 0.4s; }
        .jx-J10.is-in .jx-J10__sweep { transform: scaleX(1); }
        .jx-J10__triptych { display: grid; grid-template-columns: repeat(3, 1fr); gap: 1px; background: #e0deda; margin: 0 1.5rem; position: relative; z-index: 2; box-shadow: 0 14px 36px rgba(0,0,0,0.12); }
        .jx-J10__panel { background: #faf9f6; padding: 2.25rem 1.85rem; opacity: 0; transform: translateY(24px); transition: opacity 0.6s ease var(--d, 0s), transform 0.6s ease var(--d, 0s), box-shadow 0.25s ease; }
        .jx-J10.is-in .jx-J10__panel { opacity: 1; transform: translateY(0); }
        .jx-J10__panel:hover { transform: translateY(-3px); box-shadow: 0 10px 24px rgba(0,0,0,0.08); }
        .jx-J10__num { font-size: 2.6rem; font-weight: 200; color: #1a1a1a; line-height: 1; letter-spacing: -0.04em; margin-bottom: 0.85rem; }
        .jx-J10__code { font-size: 0.55rem; color: #aaa; display: block; margin-bottom: 0.6rem; }
        .jx-J10__title { font-size: 1rem; font-weight: 700; text-transform: uppercase; letter-spacing: -0.01em; margin: 0 0 0.55rem; }
        .jx-J10__body { font-size: 0.85rem; line-height: 1.65; color: #666; margin: 0; }
        @media (max-width: 900px) {
          .jx-J10__triptych { grid-template-columns: 1fr; margin: 0; }
          .jx-J10__band { margin-bottom: 0; padding: 2.5rem 1.5rem; }
        }
        @media (prefers-reduced-motion: reduce) {
          .jx-J10__band, .jx-J10__panel, .jx-J10__sweep { transition: none !important; }
          .jx-J10__band, .jx-J10__panel { opacity: 1; transform: none; }
          .jx-J10__sweep { transform: scaleX(1); }
        }
      `}</style>
    </div>
  );
}

// ===========================================================================
// 4. Page composer
// ===========================================================================
const VARIANTS = [
  { id: 'J1',  name: 'Deeper Overhang',         blurb: 'Cards push much further up into the band; stronger drop shadow, larger numerals.', Component: VariantJ1 },
  { id: 'J2',  name: 'Edge-Bleed',              blurb: 'No horizontal inset — cards bleed full width under the band, codes lead, numerals shrink.', Component: VariantJ2 },
  { id: 'J3',  name: 'Pierced Index Tabs',      blurb: 'Each card grows a small tab that pierces up into the dark band like a file folder.', Component: VariantJ3 },
  { id: 'J4',  name: 'Dual-Tone Echo',          blurb: 'Each card splits horizontally — dark cap with numeral, light well with body. Card-scale echo of the band.', Component: VariantJ4 },
  { id: 'J5',  name: 'Numeral Bridge',          blurb: 'A single big numeral straddles the band/card boundary — cream above, charcoal below.', Component: VariantJ5 },
  { id: 'J6',  name: 'Hairline Coordinates',    blurb: 'Cards pick up corner mono coordinates (FRAME 01 · 51.57°N) — print-chart aesthetic.', Component: VariantJ6 },
  { id: 'J7',  name: 'Staggered Heights',       blurb: 'Cards sit at intentionally different vertical offsets, like staggered magazine columns.', Component: VariantJ7 },
  { id: 'J8',  name: 'Stat-Block Numerals',     blurb: 'Numerals replaced with R66-style stat blocks (24/7, 100%, 0 GAPS) — quantified philosophy.', Component: VariantJ8 },
  { id: 'J9',  name: 'Seamless Spread',         blurb: 'Borders + shadows removed — one continuous editorial spread split by hairline rules.', Component: VariantJ9 },
  { id: 'J10', name: 'Choreographed Motion',    blurb: 'Same skeleton with IntersectionObserver cascade — band fades, sweep draws, cards rise.', Component: VariantJ10 },
];

export default function ExpeditionPhilosophyJVariations() {
  return (
    <div className="jx">
      <GlobalTokens />

      <div className="jx-page-head">
        <div className="jx-page-head__eyebrow">VARIANT J · 10 REFINEMENTS</div>
        <h1 className="jx-page-head__title">Inverted Triptych — evolved</h1>
        <p className="jx-page-head__sub">
          Ten refinements of Variant J. Same dark band → triptych skeleton; each
          changes one specific dimension (overlap, edge, tabs, dual-tone, motion…)
          while keeping the brand vocabulary locked.
        </p>
      </div>

      <nav className="jx-toc">
        <div className="jx-toc__inner">
          <span className="jx-toc__label">JUMP TO</span>
          {VARIANTS.map(v => (
            <a key={v.id} href={`#variant-${v.id}`}>{v.id} · {v.name}</a>
          ))}
        </div>
      </nav>

      {VARIANTS.map(v => (
        <VariantFrame
          key={v.id}
          id={`variant-${v.id}`}
          label={v.id}
          name={v.name}
          blurb={v.blurb}
        >
          <v.Component />
        </VariantFrame>
      ))}
    </div>
  );
}

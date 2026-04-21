/**
 * V3 — Snappy, compressed feel
 *
 * Uses the same V2 phase-config architecture but with a very different character:
 *   • 200vh scroll height (vs 280vh) — tighter scroll budget
 *   • No initial diagonal rotation — the bar forms directly
 *   • Faster collapse, near-instant logo crossfade
 *   • Single image (no cycling) — editorial stillness
 *
 * This variant proves the config approach: the engine is unchanged,
 * only this file differs.
 */

// ─── Phase definitions ────────────────────────────────────────────────────────
// Compressed into a shorter progress range — transition and collapse happen faster.
const PHASES = {
  // No "rotate" phase — the diagonal is already at 42% on load and holds briefly.
  hold:       { start: 0,    end: 0.04  },  // static hold while content is read
  transition: { start: 0.04, end: 0.14  },  // fast collapse from diagonal to bar
  collapse:   { start: 0.14, end: 0.20  },  // bar thins to header height
  handoff:    { start: 0.195, end: 0.205 }, // near-instant crossfade
};

// ─── Easing helpers (copied from v2) ─────────────────────────────────────────
function cubicBezierAt(x1, y1, x2, y2, t) {
  const cx = 3 * x1, bx = 3 * (x2 - x1) - cx, ax = 1 - cx - bx;
  const cy = 3 * y1, by = 3 * (y2 - y1) - cy, ay = 1 - cy - by;
  const xAt = t => ((ax * t + bx) * t + cx) * t;
  const yAt = t => ((ay * t + by) * t + cy) * t;
  let s = t;
  for (let i = 0; i < 8; i++) {
    const slope = (3 * ax * s + 2 * bx) * s + cx;
    if (Math.abs(slope) < 1e-6) break;
    s -= (xAt(s) - t) / slope;
  }
  return yAt(s);
}

const easeOut    = (t) => cubicBezierAt(0.0, 0, 0.58, 1, t);
const easeInOut  = (t) => cubicBezierAt(0.42, 0, 0.58, 1, t);

function genKeyframes(phase, fromVal, toVal, steps = 5, easeFn = easeOut) {
  const { start, end } = phase;
  const input = [], output = [];
  for (let i = 0; i <= steps; i++) {
    const t = i / steps;
    input.push(start + (end - start) * t);
    output.push(fromVal + (toVal - fromVal) * easeFn(t));
  }
  return { input, output };
}

function mergePhases(a, b) {
  return {
    input:  [...a.input,  ...b.input.slice(1)],
    output: [...a.output, ...b.output.slice(1)],
  };
}

// ─── Polygon keyframes ────────────────────────────────────────────────────────
// No rotation: midX holds at 42 during the "hold" phase, then collapses.
const midX_hold       = { input: [0, PHASES.hold.end], output: [42, 42] };
const midX_transition = genKeyframes(PHASES.transition, 42, 20, 8, easeOut);

const midX = {
  desktop: mergePhases(midX_hold, midX_transition),
  mobile:  mergePhases(
    { input: [0, PHASES.hold.end], output: [100, 100] },
    genKeyframes(PHASES.transition, 100, 20, 8, easeOut)
  ),
};

// rX: stays at its starting position during hold, then locks to 100.
const rX = {
  desktop: mergePhases(
    { input: [0, PHASES.hold.end], output: [42, 42] },
    { input: [PHASES.hold.end, PHASES.transition.start + 0.01], output: [42, 100] }
  ),
  mobile: { input: [0, PHASES.hold.end], output: [100, 100] },
};

// rY: notch appears quickly during transition.
const rY = mergePhases(
  { input: [0, PHASES.transition.start], output: [0, 0] },
  genKeyframes(PHASES.transition, 0, 8, 5, easeOut)
);

// brX: holds at start position, then snaps to 100 during transition.
const brX = {
  desktop: mergePhases(
    { input: [0, PHASES.hold.end], output: [28, 28] },
    genKeyframes(PHASES.transition, 28, 100, 8, easeInOut)
  ),
  mobile: mergePhases(
    { input: [0, PHASES.hold.end], output: [0, 0] },
    genKeyframes(PHASES.transition, 0, 100, 8, easeInOut)
  ),
};

// ─── Logo keyframes ───────────────────────────────────────────────────────────
const logo = {
  // Scale: starts shrinking immediately from the hold, completes by collapse end.
  scale:      { input: [PHASES.hold.end, PHASES.transition.start + 0.04, PHASES.transition.end, PHASES.collapse.end] },
  bottomFade: { input: [PHASES.hold.end, PHASES.hold.end + 0.04] },
  // Y: climbs fast during transition.
  y:          { input: [PHASES.hold.end, PHASES.transition.end - 0.01] },
  // X: slides right during collapse.
  x:          { input: [PHASES.transition.end - 0.02, PHASES.collapse.end - 0.01] },
  colorFlip:  { input: [0, PHASES.transition.start + 0.03, PHASES.transition.end - 0.02] },
  shadowFade: { input: [PHASES.transition.end, PHASES.collapse.end] },
  finalFade:  { input: [PHASES.handoff.start, PHASES.handoff.end] },
};

// ─── Images ───────────────────────────────────────────────────────────────────
// Single image — no cycling. The stillness is part of the character.
const SINGLE_IMAGE = ['/assets/images/facility/hq-0209.jpg'];

// ─── Exported config ──────────────────────────────────────────────────────────
export const V3_CONFIG = {
  name: 'V3 — Snappy',
  description: 'No rotation phase. Fast collapse. Near-instant handoff. Editorial stillness.',
  scrollHeight: '200vh',
  progressScale: 0.21,  // 200vh / 280vh * 0.28 ≈ 0.20, rounded up slightly

  phases: {
    rotate:     PHASES.hold.end,        // no real rotation; "rotate" = hold end
    transition: PHASES.transition.end,
    collapse:   PHASES.collapse.end,
    handoff:    PHASES.handoff.end,
  },

  polygon: { midX, rX, rY, brX },
  logo,

  // imageEnd: 0 means images don't cycle (only the first is shown).
  imageEnd: 0.01,
  desktopImages: SINGLE_IMAGE,
  mobileImages:  SINGLE_IMAGE,

  diagonal: {
    initial: 'polygon(0 0, 42% 0, 28% 100%, 0 100%)',
    colorFrom: 'rgba(26,26,26,0.75)',   // slightly more opaque than V1/V2
    colorTo:   'rgba(255,255,255,1)',
  },
};

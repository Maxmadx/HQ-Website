/**
 * V6 — Snap
 *
 * Mechanical. Angular. No organic curves.
 *
 * Where V1/V2 feel like a slow unfurling and V3 feels like a decisive cut,
 * V6 feels like a machine actuating. Easing is replaced with aggressive
 * power curves that make motion feel abrupt — almost step-like. The polygon
 * doesn't sweep: it SNAPS between positions.
 *
 * Key differences:
 *   • 150vh scroll — the entire animation happens in very little scroll
 *   • Easing is ultra-sharp (power-8 curves): the shape jumps 95% of its
 *     travel in the first 20% of each phase, then barely moves
 *   • Rotation phase is minimal: the shape barely opens before snapping to peak
 *   • Transition is near-instant: a mechanical click, not a sweep
 *   • rY stays 0 for the entire animation (no notch — clean machine edges)
 *   • Single image — stark visual stillness
 *   • Color: cold industrial blue-grey
 */

// ─── Phase definitions ────────────────────────────────────────────────────────
// Very compressed — entire animation in 0→0.18
const PHASES = {
  hold:       { start: 0,     end: 0.02  },  // brief initial hold
  snap_out:   { start: 0.02,  end: 0.06  },  // SNAP outward (very fast)
  snap_back:  { start: 0.06,  end: 0.10  },  // SNAP back (equally fast)
  collapse:   { start: 0.10,  end: 0.16  },  // compress to bar
  handoff:    { start: 0.157, end: 0.160 },  // instant crossfade
};

// ─── Easing helpers ────────────────────────────────────────────────────────────
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

// Mechanical snap: moves nearly all distance immediately, then stalls.
// Power-8 out: 1 - (1-t)^8 — 95% of travel in first 35% of phase duration
const snapOut = (t) => 1 - Math.pow(1 - t, 8);

// Mechanical rebound: holds briefly then snaps hard at the end.
// Power-8 in: t^8 — nothing moves until 65% through phase, then lunges
const snapIn  = (t) => Math.pow(t, 8);

// Standard easeOut for the collapse (still faster than normal)
const easeOut = (t) => cubicBezierAt(0.0, 0, 0.35, 1, t);

function genKeyframes(phase, fromVal, toVal, steps = 4, easeFn = easeOut) {
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

// midX:
//   hold → 42 (static)
//   snap_out → 42 → 88 (snaps almost immediately to near-full)
//   snap_back → 88 → 20 (snaps almost immediately back to bar position)
//   collapse → 20 (static, already in position)
const midX_hold      = { input: [0, PHASES.hold.end], output: [42, 42] };
const midX_snap_out  = genKeyframes(PHASES.snap_out,  42, 88, 5, snapOut);
const midX_snap_back = genKeyframes(PHASES.snap_back, 88, 20, 5, snapIn);
const midX_collapse  = { input: [PHASES.collapse.start, PHASES.collapse.end], output: [20, 20] };

const midX = {
  desktop: mergePhases(mergePhases(mergePhases(midX_hold, midX_snap_out), midX_snap_back), midX_collapse),
  // Mobile: already at 100%, snaps back to 20 without any outward movement
  mobile: mergePhases(
    { input: [0, PHASES.hold.end], output: [100, 100] },
    mergePhases(
      genKeyframes(PHASES.snap_out,  100, 100, 2, snapOut),
      genKeyframes(PHASES.snap_back, 100, 20,  5, snapIn)
    )
  ),
};

// rX: snap_out tracks midX (they move together — no notch during the snap).
//     snap_back: rX holds at 88 then snaps to 100 independently (notch forms).
const rX_hold       = { input: [0, PHASES.hold.end], output: [42, 42] };
const rX_snap_out   = genKeyframes(PHASES.snap_out,  42, 88,  5, snapOut);
const rX_snap_back  = genKeyframes(PHASES.snap_back, 88, 100, 3, snapIn);

const rX = {
  desktop: mergePhases(rX_hold, mergePhases(rX_snap_out, rX_snap_back)),
  mobile:  { input: [0, PHASES.snap_back.end], output: [100, 100] },
};

// rY: 0 throughout — NO NOTCH. Pure mechanical edges, no curves.
// The right edge of the bar is a perfectly hard corner.
const rY = { input: [0, PHASES.handoff.end], output: [0, 0] };

// brX:
//   hold → 28 (static)
//   snap_out → 28 → 0 (snaps left immediately)
//   snap_back → 0 → 100 (snaps right)
const brX_hold      = { input: [0, PHASES.hold.end], output: [28, 28] };
const brX_snap_out  = genKeyframes(PHASES.snap_out,  28,  0, 5, snapOut);
const brX_snap_back = genKeyframes(PHASES.snap_back,  0, 100, 5, snapIn);
const brX_collapse  = { input: [PHASES.collapse.start, PHASES.collapse.end], output: [100, 100] };

const brX = {
  desktop: mergePhases(mergePhases(mergePhases(brX_hold, brX_snap_out), brX_snap_back), brX_collapse),
  mobile: mergePhases(
    { input: [0, PHASES.hold.end], output: [0, 0] },
    mergePhases(
      genKeyframes(PHASES.snap_out,  0,   0, 2, snapOut),
      genKeyframes(PHASES.snap_back, 0, 100, 5, snapIn)
    )
  ),
};

// ─── Logo keyframes ───────────────────────────────────────────────────────────
// Logo barely moves until the snap is done — then it RUSHES to the header position.
const logo = {
  scale:      { input: [PHASES.snap_back.start, PHASES.snap_back.end, PHASES.collapse.start + 0.01, PHASES.collapse.end] },
  bottomFade: { input: [PHASES.snap_back.start, PHASES.snap_back.start + 0.02] },
  y:          { input: [PHASES.snap_back.start, PHASES.collapse.start] },
  x:          { input: [PHASES.collapse.start, PHASES.collapse.end - 0.01] },
  colorFlip:  { input: [0, PHASES.snap_back.end, PHASES.collapse.start + 0.005] },
  shadowFade: { input: [PHASES.collapse.start + 0.01, PHASES.collapse.end] },
  finalFade:  { input: [PHASES.handoff.start, PHASES.handoff.end] },
};

// ─── Images ───────────────────────────────────────────────────────────────────
// Single image — the snap is the show. No distractions.
const SINGLE_IMAGE = ['/assets/images/facility/hq-0209.jpg'];

// ─── Exported config ──────────────────────────────────────────────────────────
export const V6_CONFIG = {
  name: 'V6 — Snap',
  description: 'Mechanical. Abrupt. Power-8 easing makes the shape snap between positions rather than sweep. 150vh, no notch, cold edges.',
  scrollHeight: '150vh',
  progressScale: 0.160,

  phases: {
    rotate:     PHASES.snap_out.end,    // engine uses this for brY timing
    transition: PHASES.snap_back.end,
    collapse:   PHASES.collapse.end,
    handoff:    PHASES.handoff.end,
  },

  polygon: { midX, rX, rY, brX },
  logo,

  imageEnd: 0.01,
  desktopImages: SINGLE_IMAGE,
  mobileImages:  SINGLE_IMAGE,

  diagonal: {
    initial: 'polygon(0 0, 42% 0, 28% 100%, 0 100%)',
    colorFrom: 'rgba(14,18,28,0.90)',   // cold industrial blue-grey
    colorTo:   'rgba(255,255,255,1)',
  },
};

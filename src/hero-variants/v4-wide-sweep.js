/**
 * V4 — Wide Sweep
 *
 * The diagonal sweeps dramatically — the top edge extends to ~95% of screen width
 * during rotation, covering almost the entire image. At peak it reads like a
 * full-screen dark panel with a thin sliver of photo visible on the right.
 * Then it snaps back hard and collapses to the bar.
 *
 * Key differences from V1/V2:
 *   • Rotation goes to 95% width (not 100%) — photo sliver visible at peak
 *   • brX sweeps past 0 and briefly goes negative (off-screen) at the spear tip
 *   • Longer rotation phase (0.13 vs 0.10), shorter transition (0.05)
 *   • Color: warm near-black (dark sepia) vs V1's cool charcoal
 *   • 4 images with faster cycling
 *   • Handoff is faster — near-snap rather than fade
 */

// ─── Phase definitions ────────────────────────────────────────────────────────
const PHASES = {
  rotate:     { start: 0,     end: 0.13  },  // longer rotation, sweeps further
  transition: { start: 0.13,  end: 0.185 },  // fast snap back
  collapse:   { start: 0.185, end: 0.245 },  // normal collapse to bar
  handoff:    { start: 0.239, end: 0.241 },  // near-instant crossfade
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

// Aggressive ease-in for the outward sweep — slow start, then lunges forward
const easeInStrong  = (t) => cubicBezierAt(0.42, 0, 1.0,  1,    t);
// Sharp ease-out for the snap-back — hits fast, decelerates hard
const easeOutStrong = (t) => cubicBezierAt(0.0,  0, 0.35, 1,    t);
const easeOut       = (t) => cubicBezierAt(0.0,  0, 0.58, 1,    t);
const easeInOut     = (t) => cubicBezierAt(0.42, 0, 0.58, 1,    t);

function genKeyframes(phase, fromVal, toVal, steps = 6, easeFn = easeInOut) {
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

// midX: sweeps aggressively to 95 (almost full-screen), snaps back sharply
const midX_rotateDesktop = genKeyframes(PHASES.rotate,     42,  95,  8, easeInStrong);
const midX_rotateMobile  = genKeyframes(PHASES.rotate,    100, 100,  2, easeInStrong);
const midX_transition    = genKeyframes(PHASES.transition,  95, 20,  6, easeOutStrong);

const midX = {
  desktop: mergePhases(midX_rotateDesktop, midX_transition),
  mobile:  mergePhases(midX_rotateMobile,  midX_transition),
};

// rX: tracks midX during rotate, locks to screen right during transition
const rX = {
  desktop: mergePhases(
    genKeyframes(PHASES.rotate, 42, 95, 8, easeInStrong),
    genKeyframes(PHASES.transition, 95, 100, 3, easeOutStrong)
  ),
  mobile: { input: [0, PHASES.rotate.end], output: [100, 100] },
};

// rY: zero during rotation, appears quickly during transition (notch forms as bar takes shape)
const rY = mergePhases(
  { input: [0, PHASES.rotate.end], output: [0, 0] },
  mergePhases(
    genKeyframes(PHASES.transition, 0, 8, 5, easeOutStrong),
    genKeyframes(PHASES.collapse,   8, 8, 2, easeOut)
  )
);

// brX: sweeps left aggressively during rotation (to -5, slightly off-screen = sharper spear tip),
// then snaps to 100 during transition to form the right edge of the bar.
const brX_rotateDesktop = genKeyframes(PHASES.rotate,     28, -5,  8, easeInStrong);
const brX_rotateMobile  = genKeyframes(PHASES.rotate,      0,  0,  2, easeInStrong);
const brX_transition    = genKeyframes(PHASES.transition, -5, 100,  6, easeOutStrong);

const brX = {
  desktop: mergePhases(brX_rotateDesktop, brX_transition),
  mobile:  mergePhases(brX_rotateMobile,  genKeyframes(PHASES.transition, 0, 100, 6, easeOutStrong)),
};

// ─── Logo keyframes ───────────────────────────────────────────────────────────
// Logo starts moving later (more of the sweep is seen first), then catches up fast.
const logo = {
  scale:      { input: [PHASES.rotate.start + 0.05, PHASES.rotate.end, PHASES.transition.end, PHASES.collapse.end - 0.02] },
  bottomFade: { input: [0.04, 0.09] },
  y:          { input: [PHASES.rotate.start + 0.05, PHASES.rotate.end + 0.04] },
  x:          { input: [PHASES.rotate.end + 0.02, PHASES.collapse.end - 0.02] },
  colorFlip:  { input: [0, PHASES.rotate.end + 0.03, PHASES.transition.end - 0.002] },
  shadowFade: { input: [PHASES.collapse.start + 0.02, PHASES.collapse.end] },
  finalFade:  { input: [PHASES.handoff.start, PHASES.handoff.end] },
};

// ─── Images ───────────────────────────────────────────────────────────────────
// 4 images — extra image added, faster cycling to make the wider sweep feel richer
const DESKTOP_IMAGES = [
  '/assets/images/facility/hq-0209.jpg',
  '/assets/images/facility/hq-0345.jpg',
  '/assets/images/facility/hq-0056.jpg',
  '/assets/images/gallery/carousel/rotating6.jpg',
];

const MOBILE_IMAGES = [
  '/assets/images/facility/hq-0209.jpg',
  '/assets/images/facility/hq-0056.jpg',
];

// ─── Exported config ──────────────────────────────────────────────────────────
export const V4_CONFIG = {
  name: 'V4 — Wide Sweep',
  description: 'Diagonal lunges to 95% screen width — near full-screen dark panel at peak. Sharp snap-back. Warm near-black.',
  scrollHeight: '290vh',
  progressScale: 0.245,

  phases: {
    rotate:     PHASES.rotate.end,
    transition: PHASES.transition.end,
    collapse:   PHASES.collapse.end,
    handoff:    PHASES.handoff.end,
  },

  polygon: { midX, rX, rY, brX },
  logo,

  imageEnd: 0.22,
  desktopImages: DESKTOP_IMAGES,
  mobileImages:  MOBILE_IMAGES,

  diagonal: {
    initial: 'polygon(0 0, 42% 0, 28% 100%, 0 100%)',
    colorFrom: 'rgba(18,12,8,0.87)',   // warm near-black (dark sepia)
    colorTo:   'rgba(255,255,255,1)',
  },
};

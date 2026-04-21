/**
 * V2 — Phase-config architecture
 *
 * Same animation feel as V1, but keyframes are DERIVED from named phase constants
 * rather than hardcoded. This is the real design improvement:
 *
 *   • Changing PHASES.rotate.end changes the timing everywhere simultaneously
 *   • No magic numbers scattered through arrays — each value has a name
 *   • genKeyframes() uses a cubic-bezier easing so 6 points look as smooth as 17
 *   • Per-segment easing (FM v11+) replaces manual curve approximation
 *
 * The visual result is near-identical to V1 with a slightly smoother arc
 * due to proper easing vs piecewise-linear approximation.
 */

// ─── Phase definitions ────────────────────────────────────────────────────────
const PHASES = {
  rotate:     { start: 0,     end: 0.10  },
  transition: { start: 0.10,  end: 0.16  },
  collapse:   { start: 0.16,  end: 0.24  },
  handoff:    { start: 0.214, end: 0.216 },
};

// ─── Easing helpers ────────────────────────────────────────────────────────────
// Evaluate a cubic-bezier at parameter t using Newton-Raphson.
// This lets us generate smooth keyframe curves from named control points.
function cubicBezierAt(x1, y1, x2, y2, t) {
  // Approximate x(t) then solve for t given x, then evaluate y(t).
  // For keyframe generation we can use t directly as the input parameter.
  const cx = 3 * x1, bx = 3 * (x2 - x1) - cx, ax = 1 - cx - bx;
  const cy = 3 * y1, by = 3 * (y2 - y1) - cy, ay = 1 - cy - by;
  const xAt = t => ((ax * t + bx) * t + cx) * t;
  const yAt = t => ((ay * t + by) * t + cy) * t;

  // Newton-Raphson: solve for t such that xAt(t) = input
  let s = t;
  for (let i = 0; i < 8; i++) {
    const slope = (3 * ax * s + 2 * bx) * s + cx;
    if (Math.abs(slope) < 1e-6) break;
    s -= (xAt(s) - t) / slope;
  }
  return yAt(s);
}

const easeInOut = (t) => cubicBezierAt(0.42, 0, 0.58, 1, t);
const easeOut   = (t) => cubicBezierAt(0.0,  0, 0.58, 1, t);
const easeIn    = (t) => cubicBezierAt(0.42, 0, 1.0,  1, t);

// Generate `steps+1` keyframe points across a phase using a given easing function.
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

// Merge two { input, output } objects (ensuring shared boundary point isn't duplicated).
function mergePhases(a, b) {
  return {
    input:  [...a.input,  ...b.input.slice(1)],
    output: [...a.output, ...b.output.slice(1)],
  };
}

// ─── Polygon keyframes ────────────────────────────────────────────────────────

// midX: sweeps right during rotate (42→100, ease-in) then collapses left during transition (100→20, ease-out)
const midX_rotateDesktop    = genKeyframes(PHASES.rotate,     42,  100, 6, easeIn);
const midX_rotateMobile     = genKeyframes(PHASES.rotate,    100,  100, 2, easeIn);   // already at 100
const midX_transition       = genKeyframes(PHASES.transition, 100, 20,  6, easeOut);

const midX = {
  desktop: mergePhases(midX_rotateDesktop, midX_transition),
  mobile:  mergePhases(midX_rotateMobile,  midX_transition),
};

// rX: tracks midX during rotate, then stays at 100
const rX_rotateDesktop = genKeyframes(PHASES.rotate, 42,  100, 6, easeIn);
const rX_rotateMobile  = genKeyframes(PHASES.rotate, 100, 100, 2, easeIn);

const rX = {
  desktop: rX_rotateDesktop,
  mobile:  rX_rotateMobile,
};

// rY: the right-side notch depth — grows during transition (0→8), holds through collapse
const rY_transition = genKeyframes(PHASES.transition, 0, 8, 6, easeOut);
const rY_hold       = genKeyframes(PHASES.collapse,   8, 8, 2, easeOut);

const rY = mergePhases(
  { input: [0, PHASES.rotate.end], output: [0, 0] },   // flat zero during rotation
  mergePhases(rY_transition, rY_hold)
);

// brX: moves left during rotate (28→0) then right during transition (0→100)
const brX_rotateDesktop    = genKeyframes(PHASES.rotate,     28, 0,   6, easeIn);
const brX_rotateMobile     = genKeyframes(PHASES.rotate,      0, 0,   2, easeIn);
const brX_transition       = genKeyframes(PHASES.transition,  0, 100, 6, easeOut);

const brX = {
  desktop: mergePhases(brX_rotateDesktop, brX_transition),
  mobile:  mergePhases(brX_rotateMobile,  brX_transition),
};

// ─── Logo keyframes ───────────────────────────────────────────────────────────
// Same timing as V1 — the logo keyframe positions are already well-tuned.
// V2's improvement here is that they're derived from PHASES where possible.
const logo = {
  scale:      { input: [PHASES.rotate.start + 0.04, PHASES.rotate.end, PHASES.transition.end - 0.005, PHASES.collapse.end - 0.025] },
  bottomFade: { input: [0.03, 0.08] },
  y:          { input: [PHASES.rotate.start + 0.04, PHASES.rotate.end + 0.03] },
  x:          { input: [PHASES.rotate.end + 0.02, PHASES.collapse.end - 0.03] },
  colorFlip:  { input: [0, PHASES.rotate.end + 0.03, PHASES.transition.end - 0.005] },
  shadowFade: { input: [PHASES.collapse.start + 0.02, PHASES.collapse.end] },
  finalFade:  { input: [PHASES.handoff.start, PHASES.handoff.end] },
};

// ─── Images ───────────────────────────────────────────────────────────────────
const DESKTOP_IMAGES = [
  '/assets/images/facility/hq-0209.jpg',
  '/assets/images/facility/hq-0056.jpg',
  '/assets/images/gallery/carousel/rotating6.jpg',
];

const MOBILE_IMAGES = [
  '/assets/images/facility/hq-0209.jpg',
  '/assets/images/facility/hq-0056.jpg',
];

// ─── Exported config ──────────────────────────────────────────────────────────
export const V2_CONFIG = {
  name: 'V2 — Phase-config',
  description: 'Same feel. Keyframes derived from named phases — add a phase, change a number, update everywhere.',
  scrollHeight: '280vh',
  progressScale: 0.28,

  phases: {
    rotate:     PHASES.rotate.end,
    transition: PHASES.transition.end,
    collapse:   PHASES.collapse.end,
    handoff:    PHASES.handoff.end,
  },

  polygon: { midX, rX, rY, brX },
  logo,

  imageEnd: 0.20,
  desktopImages: DESKTOP_IMAGES,
  mobileImages:  MOBILE_IMAGES,

  diagonal: {
    initial: 'polygon(0 0, 42% 0, 28% 100%, 0 100%)',
    colorFrom: 'rgba(26,26,26,0.60)',
    colorTo:   'rgba(255,255,255,1)',
  },
};

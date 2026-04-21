/**
 * V5 — Curtain
 *
 * The hero starts as a near-black full-screen overlay — the image is completely
 * hidden on first load. As you scroll, the curtain LIFTS: the dark panel retreats
 * from the top-left, revealing the photo beneath in a diagonal sweep.
 *
 * This inverts the usual dynamic: instead of a narrow stripe becoming a wide
 * shape, the entire screen starts covered and opens up.
 *
 * Key differences:
 *   • Initial state: midX=100, rX=100, brX=100 → full coverage
 *   • No rotation phase — the shape holds static then reveals
 *   • Reveal sweeps midX 100→20 (top retreats to left, photo reveals top-right first)
 *   • brX stays at 100 throughout (the left-anchored vertical edge stays wide)
 *   • Reveal is the longest phase (0.06→0.28) — slow cinematic pull
 *   • 350vh total scroll, very spacious
 *   • Very dark colour (near-opaque black) — maximum drama
 *   • 5 images cycling through the long reveal
 */

// ─── Phase definitions ────────────────────────────────────────────────────────
const PHASES = {
  hold:     { start: 0,    end: 0.06  },  // full coverage — hold while viewer absorbs
  reveal:   { start: 0.06, end: 0.28  },  // long curtain pull (22% of progress range)
  collapse: { start: 0.28, end: 0.34  },  // bar thinning to header height
  handoff:  { start: 0.334, end: 0.337 }, // fast crossfade
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

// Curtain pull: starts slow (letting the viewer register what's happening),
// then eases out smoothly. Feels like a heavy fabric being drawn back.
const curtainPull  = (t) => cubicBezierAt(0.20, 0, 0.55, 1, t);
const easeOut      = (t) => cubicBezierAt(0.0,  0, 0.58, 1, t);
const easeInOut    = (t) => cubicBezierAt(0.42, 0, 0.58, 1, t);

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

// midX: holds at full width, then retreats leftward as the curtain lifts.
// Desktop and mobile start at 100% (full coverage), reveal is the same.
const midX_hold   = { input: [0, PHASES.hold.end], output: [100, 100] };
const midX_reveal = genKeyframes(PHASES.reveal, 100, 20, 10, curtainPull);

const midX = {
  desktop: mergePhases(midX_hold, midX_reveal),
  mobile:  mergePhases(midX_hold, midX_reveal),  // same — curtain starts full on both
};

// rX: stays at 100 throughout. Since the whole top retreats as one clean edge,
// there's no rotation notch — the notch only appears during collapse when the
// bar is thinning. During the reveal phase the right edge is always locked to 100%.
const rX_hold   = { input: [0, PHASES.hold.end], output: [100, 100] };
const rX_reveal = { input: [PHASES.hold.end, PHASES.reveal.end], output: [100, 100] };

const rX = {
  desktop: mergePhases(rX_hold, rX_reveal),
  mobile:  mergePhases(rX_hold, rX_reveal),
};

// rY: zero throughout hold and reveal (clean edge, no notch visible).
// Appears only at the end of reveal to mark the bar top, grows slightly during collapse.
const rY = mergePhases(
  { input: [0, PHASES.reveal.end], output: [0, 0] },
  genKeyframes(PHASES.collapse, 0, 8, 5, easeOut)
);

// brX: stays at 100 throughout. The full-width curtain stays wide at the bottom
// until the very end when brY (driven by engine) pulls it up to bar height.
// brX=100 permanently means the right edge of the bar is always at screen edge.
const brX = {
  desktop: { input: [0, PHASES.collapse.end], output: [100, 100] },
  mobile:  { input: [0, PHASES.collapse.end], output: [100, 100] },
};

// ─── Logo keyframes ───────────────────────────────────────────────────────────
// Logo is visible from the start (shining through the dark overlay via filter).
// Starts moving only once the curtain is mid-reveal so the user has seen the reveal.
const logo = {
  // Scale: starts shrinking once reveal is ~30% through, finishes at collapse end.
  scale:      { input: [PHASES.hold.end + 0.06, PHASES.reveal.start + 0.10, PHASES.reveal.end, PHASES.collapse.end] },
  // Bottom fade: early in the reveal (logo lifts off quickly).
  bottomFade: { input: [PHASES.hold.end, PHASES.hold.end + 0.04] },
  // Y: logo climbs during the second half of reveal.
  y:          { input: [PHASES.hold.end + 0.06, PHASES.reveal.end - 0.02] },
  // X: slides to header position during collapse.
  x:          { input: [PHASES.reveal.end - 0.02, PHASES.collapse.end - 0.01] },
  // Color: flips white→black as the bar forms at the end of reveal.
  colorFlip:  { input: [0, PHASES.reveal.end - 0.04, PHASES.reveal.end + 0.01] },
  // Shadow fades out during collapse.
  shadowFade: { input: [PHASES.collapse.start + 0.02, PHASES.collapse.end] },
  // Final opacity fade at handoff.
  finalFade:  { input: [PHASES.handoff.start, PHASES.handoff.end] },
};

// ─── Images ───────────────────────────────────────────────────────────────────
// 5 images — the long reveal gives time to see all of them.
const DESKTOP_IMAGES = [
  '/assets/images/facility/hq-0209.jpg',
  '/assets/images/facility/fleet-lineup-sunset.jpg',
  '/assets/images/facility/hq-0056.jpg',
  '/assets/images/facility/hq-0345.jpg',
  '/assets/images/gallery/carousel/rotating6.jpg',
];

const MOBILE_IMAGES = [
  '/assets/images/facility/hq-0209.jpg',
  '/assets/images/facility/fleet-lineup-sunset.jpg',
  '/assets/images/facility/hq-0056.jpg',
];

// ─── Exported config ──────────────────────────────────────────────────────────
export const V5_CONFIG = {
  name: 'V5 — Curtain',
  description: 'Starts fully covered. The dark curtain lifts slowly to reveal the image — inverts the usual open-to-closed flow.',
  scrollHeight: '350vh',

  // progressScale: must cover the full 0→handoff.end range.
  progressScale: 0.338,

  // phases: "rotate" is mapped to the reveal.end — that's the pivot point
  // the engine uses for brY height collapse timing.
  phases: {
    rotate:     PHASES.reveal.end,       // engine uses this for brY timing
    transition: PHASES.reveal.end,       // no transition phase; collapse follows reveal
    collapse:   PHASES.collapse.end,
    handoff:    PHASES.handoff.end,
  },

  polygon: { midX, rX, rY, brX },
  logo,

  // imageEnd: images cycle through the long reveal (up to reveal end).
  imageEnd: PHASES.reveal.end,
  desktopImages: DESKTOP_IMAGES,
  mobileImages:  MOBILE_IMAGES,

  diagonal: {
    initial: 'polygon(0 0, 100% 0, 100% 0, 100% 100%, 100% 100%, 0 100%)',
    colorFrom: 'rgba(8,8,8,0.96)',    // near-opaque black — maximum drama
    colorTo:   'rgba(255,255,255,1)',
  },
};

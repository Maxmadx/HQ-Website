/**
 * V1 — useScroll refactor, same animation feel as production
 *
 * This config reproduces the exact same animation as HeroSectionFinalTesting.jsx
 * but expresses it as a clean data object. All keyframe arrays are preserved from
 * production — the improvement is structural (named, separated from render logic)
 * not visual.
 *
 * The 17-point midX arrays intentionally remain — this is V1's honest reproduction.
 * V2 is where we replace them with derived, eased keyframes.
 */

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

// ─── Polygon keyframes ────────────────────────────────────────────────────────
// All values are in scrollYProgress space (0 → 0.28).
// Desktop and mobile differ in the rotation phase only (mobile starts fully open).

const ROTATION_INPUT = [0, 0.01, 0.02, 0.03, 0.04, 0.05, 0.06, 0.07, 0.08, 0.09, 0.10];
const TRANSITION_INPUT = [0.10, 0.105, 0.11, 0.115, 0.12, 0.125, 0.13, 0.135, 0.14, 0.145, 0.15, 0.155, 0.16];
const COMBINED_INPUT = [...ROTATION_INPUT, ...TRANSITION_INPUT.slice(1)];

const midX = {
  desktop: {
    input:  COMBINED_INPUT,
    output: [42, 46, 51, 57, 63, 70, 78, 85, 91, 96, 100, 93, 86, 79, 72, 65, 58, 50, 42, 36, 30, 25, 20],
  },
  mobile: {
    input:  COMBINED_INPUT,
    output: [100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 93, 86, 79, 72, 65, 58, 50, 42, 36, 30, 25, 20],
  },
};

const rX = {
  desktop: { input: ROTATION_INPUT, output: [42, 46, 51, 57, 63, 70, 78, 85, 91, 96, 100] },
  mobile:  { input: [0, 0.10],      output: [100, 100] },
};

const rY = {
  input:  [0, 0.10, 0.105, 0.11, 0.115, 0.12, 0.125, 0.13, 0.135, 0.14, 0.145, 0.15, 0.155, 0.16, 0.18, 0.21, 0.24],
  output: [0, 0,    0.5,   1,    1.5,   2,    3,      4,    4.5,   5,    5.5,   6,    7,     8,    8,    8,    8   ],
};

const brX = {
  desktop: {
    input:  COMBINED_INPUT,
    output: [28, 26, 24, 21, 18, 15, 11, 8, 5, 2, 0, 6, 13, 21, 30, 40, 50, 60, 70, 80, 88, 95, 100],
  },
  mobile: {
    input:  COMBINED_INPUT,
    output: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 6, 13, 21, 30, 40, 50, 60, 70, 80, 88, 95, 100],
  },
};

// ─── Logo keyframes ───────────────────────────────────────────────────────────
// scale output uses [1, holdScale, holdScale, finalScale] — computed at runtime
// from measured hero/header logo widths.
const logo = {
  scale:      { input: [0.04, 0.10, 0.155, 0.215] },
  bottomFade: { input: [0.03, 0.08] },
  y:          { input: [0.04, 0.13] },
  x:          { input: [0.12, 0.21] },
  colorFlip:  { input: [0,    0.13,  0.155] },
  shadowFade: { input: [0.18, 0.24] },
  finalFade:  { input: [0.214, 0.216] },
};

// ─── Exported config ──────────────────────────────────────────────────────────
export const V1_CONFIG = {
  name: 'V1 — useScroll refactor',
  description: 'Same animation as production. Code cleaned up, behaviour preserved.',
  scrollHeight: '280vh',

  // progressScale: maps useScroll's 0→1 to the animation's 0→progressScale space.
  // Keeps keyframes in the familiar 0–0.28 range from production.
  progressScale: 0.28,

  // Phase boundaries used by the debug panel and brY derivation.
  phases: {
    rotate:     0.10,
    transition: 0.16,
    collapse:   0.24,
    handoff:    0.216,
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

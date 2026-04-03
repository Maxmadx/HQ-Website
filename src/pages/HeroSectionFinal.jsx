/**
 * HERO SECTION FINAL — Diagonal Split
 *
 * Standalone page for the diagonal-split hero concept.
 * Scroll phases:
 *   1. Images cycle behind diagonal, diagonal wobbles
 *   2. Diagonal exits left, logo shrinks + bottom fades
 *   3. Logo rises to top, slides to center (header logo)
 *   4. Final image releases from sticky → normal scroll
 */

import React, { useState, useEffect, useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';

// ─── Images ───
const IMGS = {
  hero: '/assets/images/facility/hq-0209.jpg',
  aerial: '/assets/images/facility/hq-0089.jpg',
  expeditionQ: '/assets/images/expeditions/helicopter-expeditions-quentin-smith.webp',
  cockpit: '/assets/images/facility/hq-0354.jpg',
  antartica: '/assets/images/expeditions/antartica.jpg',
  fleet: '/assets/images/facility/hq-0254.jpg',
  hangar: '/assets/images/facility/hq-0745.jpg',
  channel: '/assets/images/expeditions/channel.jpg',
  flying1: '/assets/images/gallery/flying/flying-.jpg',
  flying2: '/assets/images/gallery/flying/foggy-evening-flying.jpg',
  event1: '/assets/images/gallery/events/img_2028.jpg',
  busyHangar: '/assets/images/facility/busy-hangar.jpg',
};

const SLIDE_IMAGES = [
  IMGS.hero, IMGS.aerial, IMGS.expeditionQ, IMGS.cockpit,
  IMGS.antartica, IMGS.fleet, IMGS.hangar, IMGS.channel,
];

const LOGO_SRC = '/assets/images/hq-aviation-logo.webp';

// ─── Tiny components ───
const Logo = ({ width = 'clamp(200px, 30vw, 400px)', light = false, style = {} }) => (
  <img
    src={LOGO_SRC}
    alt="HQ Aviation"
    style={{
      width, height: 'auto', display: 'block',
      filter: light ? 'invert(1) brightness(2)' : 'none',
      ...style,
    }}
  />
);

const UnionJack = ({ size = 14 }) => (
  <img
    src="/assets/images/icons/Union Jack.svg"
    alt="UK"
    style={{
      width: size, height: 'auto',
      filter: 'grayscale(100%) contrast(1.2)',
      opacity: 0.7, display: 'inline-block', verticalAlign: 'middle',
    }}
  />
);

const Coords = ({ light = false }) => (
  <div className="hsf__coords" style={light ? { color: 'rgba(255,255,255,0.5)' } : undefined}>
    <span>51.5751°N</span>
    <UnionJack size={12} />
    <span>0.5059°W</span>
  </div>
);

const GridLines = ({ visible, light = false }) => {
  const vLines = [5, 28, 72, 95];
  const hLines = [15, 85];
  const color = light ? 'rgba(255,255,255,0.08)' : '#e8e6e2';
  return (
    <div className={`hsf__grid ${visible ? 'hsf__grid--visible' : ''}`}>
      {vLines.map((pos, i) => (
        <div key={`v${i}`} className="hsf__line hsf__line--v" style={{ left: `${pos}%`, background: color, transitionDelay: `${0.1 + i * 0.1}s` }} />
      ))}
      {hLines.map((pos, i) => (
        <div key={`h${i}`} className="hsf__line hsf__line--h" style={{ top: `${pos}%`, background: color, transitionDelay: `${0.5 + i * 0.1}s` }} />
      ))}
    </div>
  );
};

const ScrollPrompt = () => (
  <div className="hsf__scroll-prompt">
    <span className="hsf__scroll-text">Scroll to explore</span>
    <div className="hsf__scroll-line"><span /></div>
  </div>
);

// ─── Main component ───
const HeroSectionFinal = () => {
  const [linesVisible, setLinesVisible] = useState(false);
  const heroRef = useRef(null);
  const { scrollYProgress: rawProgress } = useScroll({ target: heroRef, offset: ['start start', 'end end'] });
  // Remap full scroll to 0→0.28 so animations fill the entire section
  const scrollYProgress = useTransform(rawProgress, [0, 1], [0, 0.28]);

  useEffect(() => { setTimeout(() => setLinesVisible(true), 200); }, []);


  // Images cycle quickly, finishing just before final collapse
  const imgEnd = 0.20;

  // ── Diagonal → horizontal bar via 5-point polygon ──
  // polygon(0 0, midX% 0, rX% rY%, brX% brY%, 0 blY%)
  //
  // 5 points: P1=(0,0) fixed, P2=(midX,0) flat top end, P3=(rX,rY) right-side notch,
  //           P4=(brX,brY) bottom-right, P5=(0,blY) bottom-left.
  //
  // During rotation (0→0.16): P2 & P3 overlap (rX=midX, rY=0) → standard 4-pt diagonal.
  // During transition (0.16→0.24): P2 moves left (flat top shortens), P3 stays at x=100
  //   with rY bulging down → creates a notch revealing image at top-right corner.
  //   Meanwhile bottom rises (brY, blY → 10) and brX extends to 100.
  // At 0.24: rY returns to 0 → flat bar from y=0 to y=10%.
  // Collapse (0.28→0.36): bar thins to 5%.

  // midX: end of the flat top edge at y=0
  // Rotation (0→0.10): 55→100. Transition (0.10→0.16): 100→20.
  const midX = useTransform(scrollYProgress,
    [0, 0.01, 0.02, 0.03, 0.04, 0.05, 0.06, 0.07, 0.08, 0.09, 0.10, 0.105, 0.11, 0.115, 0.12, 0.125, 0.13, 0.135, 0.14, 0.145, 0.15, 0.155, 0.16],
    [42, 46,   51,   57,   63,   70,   78,   85,   91,   96,   100,  93,    86,   79,    72,   65,    58,   50,    42,   36,    30,   25,    20]
  );

  // rX: same as midX during rotation, then stays at 100.
  const rX = useTransform(scrollYProgress,
    [0, 0.01, 0.02, 0.03, 0.04, 0.05, 0.06, 0.07, 0.08, 0.09, 0.10],
    [42, 46,   51,   57,   63,   70,   78,   85,   91,   96,   100]
  );

  // rY: vertical drop on right side. Grows during transition, holds, then collapse.
  const rY = useTransform(scrollYProgress,
    [0, 0.10, 0.105, 0.11, 0.115, 0.12, 0.125, 0.13, 0.135, 0.14, 0.145, 0.15, 0.155, 0.16, 0.18, 0.21, 0.24],
    [0, 0,    0.5,   1,    1.5,   2,    3,     4,    4.5,   5,    5.5,   6,    7,     8,    8,    8,    8]
  );

  // brX: Rotation (0→0.10): 40→0. Transition (0.10→0.16): 0→100.
  const brX = useTransform(scrollYProgress,
    [0, 0.01, 0.02, 0.03, 0.04, 0.05, 0.06, 0.07, 0.08, 0.09, 0.10, 0.105, 0.11, 0.115, 0.12, 0.125, 0.13, 0.135, 0.14, 0.145, 0.15, 0.155, 0.16],
    [28, 26,   24,   21,   18,   15,   11,   8,    5,    2,    0,    6,     13,   21,    30,   40,    50,   60,    70,   80,    88,   95,    100]
  );

  // brY: 100 during rotation. Transition (0.10→0.16): 100→10. Collapse (0.18→0.24): 10→5.
  const brY = useTransform(scrollYProgress,
    [0, 0.06, 0.07, 0.08, 0.09, 0.10, 0.11, 0.12, 0.13, 0.16, 0.18, 0.21, 0.24],
    [100, 100, 87,   73,   58,   45,   32,   22,   10,   10,   10,   9.5,  8.5]
  );

  // blY: same as brY.
  const blY = useTransform(scrollYProgress,
    [0, 0.06, 0.07, 0.08, 0.09, 0.10, 0.11, 0.12, 0.13, 0.16, 0.18, 0.21, 0.24],
    [100, 100, 87,   73,   58,   45,   32,   22,   10,   10,   10,   9.5,  8.5]
  );

  // ── Text/grid/pips fade early ──
  const contentOpacity = useTransform(scrollYProgress, [0.01, 0.035], [1, 0]);
  const gridOpacity = useTransform(scrollYProgress, [0, 0.01], [1, 0]);
  const pipsOpacity = useTransform(scrollYProgress, [0.08, 0.16], [1, 0]);
  const scrollPromptOpacity = useTransform(scrollYProgress, [0, 0.05], [1, 0]);

  // ── Logo: shrinks + bottom fades + moves to header, all done by 0.38 ──
  const logoScale = useTransform(scrollYProgress, [0.04, 0.12, 0.18, 0.24], [1, 0.35, 0.35, 0.28]);
  const logoBottomOpacity = useTransform(scrollYProgress, [0.03, 0.08], [1, 0]);

  // Logo moves from in-flow position to top-center header
  const logoYvh = useTransform(scrollYProgress,
    [0, 0.04, 0.12, 0.14],
    [0, 0,    -30,  -30]
  );
  const logoXvw = useTransform(scrollYProgress,
    [0, 0.13, 0.18],
    [0, 0,    32]
  );

  // ── Color transitions during logo X movement (0.13→0.18) ──
  // Logo: inverted white → normal black
  const logoInvert = useTransform(scrollYProgress, [0, 0.13, 0.155], [1, 1, 0]);
  const logoBrightness = useTransform(scrollYProgress, [0, 0.13, 0.155], [2, 2, 1]);
  // Diagonal: charcoal → white
  const diagBg = useTransform(scrollYProgress, [0, 0.13, 0.155], ['rgba(26,26,26,0.60)', 'rgba(26,26,26,0.60)', 'rgba(255,255,255,1)']);
  // Shadow: fade out as bar shrinks (0.18→0.24)
  const shadowOpacity = useTransform(scrollYProgress, [0.18, 0.24], [1, 0]);
  // Hero logo fades out at the end so the real header can take over
  const heroLogoFinalOpacity = useTransform(scrollYProgress, [0.22, 0.26], [1, 0]);

  return (
    <>
      <style>{styles}</style>

      <section className="hsf" ref={heroRef}>
        {/* ── Sticky viewport ── */}
        <div className="hsf__sticky">

          {/* Full-screen image layers */}
          <div className="hsf__images">
            {SLIDE_IMAGES.map((src, i) => {
              const step = imgEnd / SLIDE_IMAGES.length;
              const start = i * step;
              const end = start + step;
              const isLast = i === SLIDE_IMAGES.length - 1;
              return (
                <motion.div
                  key={i}
                  className="hsf__img-layer"
                  style={{
                    opacity: useTransform(scrollYProgress,
                      [Math.max(0, start - step * 0.15), start, end - step * 0.15, end],
                      i === 0 ? [1, 1, 1, 0] : isLast ? [0, 1, 1, 1] : [0, 1, 1, 0]
                    ),
                    zIndex: SLIDE_IMAGES.length - i,
                  }}
                >
                  <img src={src} alt="" />
                </motion.div>
              );
            })}
          </div>

          {/* Shadow along diagonal edge */}
          <motion.div
            className="hsf__shadow"
            style={{
              opacity: shadowOpacity,
              clipPath: useTransform(
                [midX, rX, rY, brX, brY, blY],
                ([mx, rx, ry, bx, by, bl]) => {
                  const s = 0.4;
                  return `polygon(0 0, ${mx + s}% 0, ${mx + s}% ${s}%, ${rx + s}% ${s}%, ${rx + s}% ${ry + s}%, ${bx + s}% ${Math.min(by + s, 100)}%, 0 ${Math.min(bl + s, 100)}%)`;
                }
              ),
            }}
          />

          {/* Diagonal overlay */}
          <motion.div
            className="hsf__diagonal"
            style={{
              background: diagBg,
              clipPath: useTransform(
                [midX, rX, rY, brX, brY, blY],
                ([mx, rx, ry, bx, by, bl]) => `polygon(0 0, ${mx}% 0, ${rx}% 0, ${rx}% ${ry}%, ${bx}% ${by}%, 0 ${bl}%)`
              ),
            }}
          />


          {/* All content as one centered block — text fades, logo animates away */}
          <div className="hsf__content">
<motion.div
              className="hsf__logo-wrap"
              style={{
                scale: logoScale,
                y: useTransform(logoYvh, v => `${v}vh`),
                x: useTransform(logoXvw, v => `${v}vw`),
                opacity: heroLogoFinalOpacity,
              }}
            >
            <motion.div style={{
              maskImage: useTransform(logoBottomOpacity, v =>
                `linear-gradient(to bottom, black 75%, rgba(0,0,0,${v}) 75%)`
              ),
              WebkitMaskImage: useTransform(logoBottomOpacity, v =>
                `linear-gradient(to bottom, black 75%, rgba(0,0,0,${v}) 75%)`
              ),
              filter: useTransform([logoInvert, logoBrightness], ([inv, br]) => `invert(${inv}) brightness(${br})`),
            }}>
              <Logo width="clamp(180px, 25vw, 350px)" />
            </motion.div>
          </motion.div>

            <motion.div style={{ opacity: contentOpacity }}>
              <p className="hsf__desc">The Robinson Specialists since 2010</p>
              <div className="hsf__meta">
                <span>EST. 2010</span>
                <span className="hsf__dot" />
                <UnionJack size={12} />
                <span className="hsf__dot" />
                <span>LONDON</span>
              </div>
            </motion.div>
          </div>


        </div>
      </section>

    </>
  );
};

// ─── Styles ───
const styles = `
  .hsf {
    position: relative;
    width: 100%;
    height: 280vh;
    background: #faf9f6;
    font-family: 'Space Grotesk', sans-serif;
  }

  .hsf__sticky {
    position: sticky;
    top: 0;
    height: 100vh;
    overflow: hidden;
  }

  /* ─ Images ─ */
  .hsf__images {
    position: absolute; inset: 0; z-index: 1;
    mask-image: linear-gradient(to right, rgba(0,0,0,0.7) 0%, black 25%, black 75%, rgba(0,0,0,0.7) 100%),
                linear-gradient(to bottom, black 75%, rgba(0,0,0,0.7) 100%);
    -webkit-mask-image: linear-gradient(to right, rgba(0,0,0,0.7) 0%, black 25%, black 75%, rgba(0,0,0,0.7) 100%),
                        linear-gradient(to bottom, black 75%, rgba(0,0,0,0.7) 100%);
    mask-composite: intersect;
    -webkit-mask-composite: source-in;
  }
  .hsf__img-layer {
    position: absolute; inset: 0;
  }
  .hsf__img-layer img {
    width: 100%; height: 100%; object-fit: cover;
  }

  /* ─ Diagonal overlay ─ */
  .hsf__diagonal {
    position: absolute; inset: 0;
    background: rgba(26, 26, 26, 0.88);
    clip-path: polygon(0 0, 42% 0, 28% 100%, 0 100%);
    z-index: 4;
  }
  .hsf__shadow {
    position: absolute; inset: 0;
    z-index: 3;
    background: rgba(0,0,0,0.7);
    filter: blur(12px);
  }

  /* ─ Grid lines ─ */
  .hsf__grid {
    position: absolute; inset: 0;
    pointer-events: none;
  }
  .hsf__line {
    position: absolute;
    transition: transform 1s cubic-bezier(0.16, 1, 0.3, 1);
  }
  .hsf__line--v {
    top: 0; bottom: 0; width: 1px;
    transform: scaleY(0); transform-origin: top;
  }
  .hsf__line--h {
    left: 0; right: 0; height: 1px;
    transform: scaleX(0); transform-origin: left;
  }
  .hsf__grid--visible .hsf__line--v { transform: scaleY(1); }
  .hsf__grid--visible .hsf__line--h { transform: scaleX(1); }

  /* ─ Content ─ */
  .hsf__content {
    position: absolute;
    top: 0; left: 4%; bottom: 0;
    display: flex; flex-direction: column;
    justify-content: center; align-items: center;
    z-index: 10;
    max-width: 35%;
  }
  .hsf__coords {
    display: flex; gap: 1.5rem; align-items: center;
    font-family: 'Share Tech Mono', monospace;
    font-size: 0.65rem; letter-spacing: 0.1em; color: #999;
    margin-bottom: 1.5rem;
  }
  .hsf__pre {
    display: block;
    font-size: 0.75rem; text-transform: uppercase;
    letter-spacing: 0.25em; color: #888; margin-bottom: 1rem;
  }
  .hsf__desc {
    font-size: 1rem; color: rgba(255,255,255,0.6); max-width: 300px; line-height: 1.6; margin: 0; text-align: center;
  }
  .hsf__meta {
    display: flex; align-items: center; gap: 0.75rem; margin-top: 1.5rem;
    font-family: 'Share Tech Mono', monospace;
    font-size: 0.6rem; letter-spacing: 0.15em; color: rgba(255,255,255,0.5); text-transform: uppercase;
  }
  .hsf__dot {
    width: 3px; height: 3px; background: rgba(255,255,255,0.3); border-radius: 50%;
  }

  /* ─ Logo ─ */
  .hsf__logo-wrap {
    transform-origin: center top;
    margin: 0.5rem 0;
  }

  /* ─ Pips ─ */
  .hsf__pips {
    position: absolute; bottom: 2rem; left: 50%;
    transform: translateX(-50%);
    display: flex; gap: 6px; z-index: 12;
  }
  .hsf__pip {
    width: 8px; height: 8px; border-radius: 50%;
    background: transparent;
    border: 1.5px solid #333;
    box-shadow: 0 0 0 1.5px rgba(255,255,255,0.8);
  }
  .hsf__pip--active {
    background: #fff;
    border-color: #333;
  }

  /* ─ Scroll prompt ─ */
  .hsf__scroll-prompt {
    position: absolute; bottom: 1rem; left: 50%;
    transform: translateX(-50%);
    display: flex; flex-direction: column; align-items: center;
    gap: 1rem; z-index: 20;
  }
  .hsf__scroll-text {
    font-size: 0.65rem; text-transform: uppercase;
    letter-spacing: 0.2em; color: #999;
  }
  .hsf__scroll-line {
    width: 1px; height: 50px; background: rgba(0,0,0,0.7);
    position: relative; overflow: hidden;
  }
  .hsf__scroll-line span {
    position: absolute; top: 0; left: 0; width: 100%; height: 30%;
    background: #1a1a1a;
    animation: hsfScroll 2s ease-in-out infinite;
  }
  @keyframes hsfScroll {
    0% { top: -30%; }
    100% { top: 100%; }
  }

  /* ─ Responsive ─ */
  @media (max-width: 768px) {
    .hsf__content { left: 4%; max-width: 55%; }
  }
`;

export default HeroSectionFinal;

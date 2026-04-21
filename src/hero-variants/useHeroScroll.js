/**
 * useHeroScroll — derives all animation motion values from a config object.
 *
 * Takes:
 *   heroRef    — ref attached to the outer hero container (the scrolling element)
 *   config     — variant config object (v1/v2/v3)
 *   logoTarget — measured logo positions from useLogoTarget()
 *   isMobile   — boolean for mobile vs desktop polygon keyframes
 *
 * Returns a flat object of Framer Motion motion values ready to be applied to
 * motion elements, plus a `_raw` sub-object of the polygon values for the
 * debug panel.
 *
 * Design:
 *   - Uses useScroll({ target: heroRef }) — no manual getBoundingClientRect loop.
 *   - Maps raw 0→1 progress to 0→config.progressScale via a useTransform.
 *   - brY/blY are computed here (not in config) because they depend on the
 *     runtime-measured logoTarget.barPct.
 *   - All useTransform calls are at hook top-level (never inside JSX).
 */
import { useTransform } from 'framer-motion';
import { useScroll } from 'framer-motion';

export function useHeroScroll({ heroRef, config, logoTarget, isMobile }) {
  const { polygon: pc, logo: lc, phases } = config;
  const { yPx, xPx, heroW, headerW, barPct } = logoTarget;

  // ── Scroll progress ────────────────────────────────────────────────────────
  // useScroll gives 0→1 over the full hero scroll range.
  // We remap to 0→progressScale so all config keyframes stay in that familiar space.
  const { scrollYProgress: rawProgress } = useScroll({
    target: heroRef,
    offset: ['start start', 'end end'],
  });
  const scrollYProgress = useTransform(rawProgress, [0, 1], [0, config.progressScale]);

  // ── Polygon axes ───────────────────────────────────────────────────────────
  // Pick desktop or mobile keyframes from the config.
  const pick = (axis) => {
    if (axis.desktop && axis.mobile) return isMobile ? axis.mobile : axis.desktop;
    return axis; // single set covers both
  };

  const midXDef = pick(pc.midX);
  const rXDef   = pick(pc.rX);
  const brXDef  = pick(pc.brX);

  const midX = useTransform(scrollYProgress, midXDef.input, midXDef.output);
  const rX   = useTransform(scrollYProgress, rXDef.input,   rXDef.output);
  const rY   = useTransform(scrollYProgress, pc.rY.input,   pc.rY.output);
  const brX  = useTransform(scrollYProgress, brXDef.input,  brXDef.output);

  // brY / blY: bar height as % of viewport — derived from measured header height.
  const bp    = barPct;
  const bpEnd = bp * 0.9;
  const { rotate: rEnd, transition: tEnd, collapse: cEnd } = phases;

  const brY = useTransform(
    scrollYProgress,
    [0, rEnd * 0.6, rEnd * 0.7, rEnd * 0.8, rEnd * 0.9, rEnd, rEnd + 0.01, rEnd + 0.03, tEnd - 0.03, tEnd, cEnd, cEnd + 0.03, cEnd + 0.08],
    [100, 100,      87,          73,          58,          45,   32,          bp * 2.2,   bp,           bp,   bp,   (bp + bpEnd) / 2, bpEnd]
  );
  const blY = brY;

  // ── Clip paths ─────────────────────────────────────────────────────────────
  const clipPath = useTransform(
    [midX, rX, rY, brX, brY, blY],
    ([mx, rx, ry, bx, by, bl]) =>
      `polygon(0 0, ${mx}% 0, ${rx}% 0, ${rx}% ${ry}%, ${bx}% ${by}%, 0 ${bl}%)`
  );

  const shadowClipPath = useTransform(
    [midX, rX, rY, brX, brY, blY],
    ([mx, rx, ry, bx, by, bl]) => {
      const s = 0.4;
      return `polygon(0 0, ${mx+s}% 0, ${mx+s}% ${s}%, ${rx+s}% ${s}%, ${rx+s}% ${ry+s}%, ${bx+s}% ${Math.min(by+s, 100)}%, 0 ${Math.min(bl+s, 100)}%)`;
    }
  );

  // ── Diagonal colour ────────────────────────────────────────────────────────
  const diagBg = useTransform(
    scrollYProgress,
    lc.colorFlip.input,
    [config.diagonal.colorFrom, config.diagonal.colorFrom, config.diagonal.colorTo]
  );

  // ── Shadow opacity ─────────────────────────────────────────────────────────
  const shadowOpacity = useTransform(scrollYProgress, lc.shadowFade.input, [1, 0]);

  // ── Logo ───────────────────────────────────────────────────────────────────
  // Scale: from 1 down to a hold size matching the header logo, then to exact fit.
  const holdScale  = Math.max((headerW + 10) / heroW, 0.35);
  const finalScale = Math.max(headerW / heroW, 0.25);
  const logoScale  = useTransform(
    scrollYProgress,
    lc.scale.input,
    [1, holdScale, holdScale, finalScale]
  );

  // Bottom-fade: mask fades the lower 25% of the logo out as it rises.
  const logoBottomOpacity = useTransform(scrollYProgress, lc.bottomFade.input, [1, 0]);
  const logoMask = useTransform(
    logoBottomOpacity,
    v => `linear-gradient(to bottom, black 75%, rgba(0,0,0,${v}) 75%)`
  );

  // Position: Y climbs first, X follows (they overlap slightly so motion feels continuous).
  const logoYpx = useTransform(scrollYProgress, lc.y.input, [0, yPx]);
  const logoXpx = useTransform(scrollYProgress, lc.x.input, [0, xPx]);

  // Colour: inverted white → black (occurs as diagonal turns white).
  const logoInvert     = useTransform(scrollYProgress, lc.colorFlip.input, [1, 1, 0]);
  const logoBrightness = useTransform(scrollYProgress, lc.colorFlip.input, [2, 2, 1]);
  const logoFilter     = useTransform(
    [logoInvert, logoBrightness],
    ([inv, br]) => `invert(${inv}) brightness(${br})`
  );

  // Final fade: near-instant crossfade to real header logo.
  const heroLogoOpacity = useTransform(scrollYProgress, lc.finalFade.input, [1, 0]);

  // ── Phase label (for debug panel) ─────────────────────────────────────────
  const phase = useTransform(scrollYProgress, p => {
    if (p < phases.rotate)     return 'rotate';
    if (p < phases.transition) return 'transition';
    if (p < phases.collapse)   return 'collapse';
    return 'handoff';
  });

  return {
    scrollYProgress,
    // Render-ready motion values:
    clipPath,
    shadowClipPath,
    diagBg,
    shadowOpacity,
    logoScale,
    logoYpx,
    logoXpx,
    logoMask,
    logoFilter,
    heroLogoOpacity,
    phase,
    // Raw numeric values exposed for the debug panel:
    _raw: { midX, rX, rY, brX, brY, blY },
  };
}

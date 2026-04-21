/**
 * useLogoTarget — measures the header logo's position relative to the hero logo.
 *
 * Returns { yPx, xPx, heroW, headerW, barPct }:
 *   yPx     — vertical delta: hero logo top → header logo top (negative = up)
 *   xPx     — horizontal delta: hero logo centre → header logo centre
 *   heroW   — hero logo width in px
 *   headerW — header logo width in px
 *   barPct  — header bar height as % of viewport (sizes the final polygon bar)
 *
 * Robustness:
 *   The main historical failure mode was measuring the hero logo via
 *   getBoundingClientRect(), which INCLUDES Framer Motion's applied transforms.
 *   When the page loads or refreshes mid-scroll, Framer Motion has already
 *   moved the logo element, so the "starting position" measurement is wrong and
 *   the entire Y/X journey is calibrated against a bad baseline.
 *
 *   Fix: measure the logo's natural (pre-transform) position using
 *   offsetTop/offsetLeft traversal up to .hsf__content, which does not have
 *   transforms. offsetTop/offsetLeft are layout values — they ignore CSS
 *   transforms entirely. This gives the correct baseline regardless of when
 *   the measurement runs.
 *
 *   .hsf__content is position:absolute and is the nearest positioned ancestor
 *   of the logo chain, so the traversal terminates there correctly.
 */
import { useState, useEffect } from 'react';

const DEFAULTS = { yPx: -300, xPx: 200, heroW: 280, headerW: 80, barPct: 9 };

// Walk the offsetParent chain from `el` up to (but not including) `ancestor`,
// summing offsetTop/offsetLeft. Ignores CSS transforms — layout coords only.
function naturalOffsetFrom(el, ancestor) {
  let top = 0, left = 0, node = el;
  while (node && node !== ancestor) {
    top  += node.offsetTop;
    left += node.offsetLeft;
    node = node.offsetParent;
    if (!node || node === document.body) break; // safety: don't walk past body
  }
  return { top, left };
}

export function useLogoTarget() {
  const [target, setTarget] = useState(DEFAULTS);

  useEffect(() => {
    let debounceTimer;

    const measure = () => {
      const headerLogo = document.querySelector('.Header-branding-logo');
      const heroLogoImg = document.querySelector('.hsf__logo-wrap img');
      const contentEl  = document.querySelector('.hsf__content');
      if (!headerLogo || !heroLogoImg || !contentEl) return;

      // Wait for images to have real dimensions before measuring.
      if (!headerLogo.complete || headerLogo.naturalWidth === 0) {
        headerLogo.addEventListener('load', measure, { once: true });
        return;
      }
      if (!heroLogoImg.complete || heroLogoImg.naturalWidth === 0) {
        heroLogoImg.addEventListener('load', measure, { once: true });
        return;
      }

      // ── Header logo position ──────────────────────────────────────────────
      // Header is position:fixed — getBoundingClientRect is always correct.
      const hRect = headerLogo.getBoundingClientRect();

      // ── Hero logo NATURAL position ────────────────────────────────────────
      // Do NOT use heroLogoImg.getBoundingClientRect() — it includes Framer
      // Motion transforms and will be wrong whenever scrollY > 0.
      //
      // Instead: measure from .hsf__content (no transforms) + offsetTop
      // traversal to the img (ignores transforms, layout coords only).
      //
      // .hsf__content is position:absolute so it is the offsetParent of
      // everything inside the logo chain. The sticky section means
      // contentEl's viewport Y is constant for any scrollY in the hero range.
      const contentRect = contentEl.getBoundingClientRect();
      const { top: imgOffsetTop, left: imgOffsetLeft } = naturalOffsetFrom(heroLogoImg, contentEl);

      const naturalImgTop  = contentRect.top  + imgOffsetTop;
      const naturalImgLeft = contentRect.left + imgOffsetLeft;

      // offsetWidth/offsetHeight are also transform-independent.
      const heroW = heroLogoImg.offsetWidth;

      const yDelta = hRect.top - naturalImgTop;
      const xDelta = (hRect.left + hRect.width / 2) - (naturalImgLeft + heroW / 2);

      // ── Bar height (for the polygon bar that becomes the header) ──────────
      const headerEl = document.querySelector('.Header-inner--top');
      const headerH  = headerEl ? headerEl.getBoundingClientRect().height : 60;
      const barPct   = (headerH / window.innerHeight) * 100 * 1.05;

      setTarget(prev => {
        if (
          Math.abs(prev.yPx     - yDelta)        < 1 &&
          Math.abs(prev.xPx     - xDelta)        < 1 &&
          Math.abs(prev.heroW   - heroW)          < 1 &&
          Math.abs(prev.headerW - hRect.width)   < 1 &&
          Math.abs(prev.barPct  - barPct)        < 0.5
        ) return prev;
        return { yPx: yDelta, xPx: xDelta, heroW, headerW: hRect.width, barPct };
      });
    };

    const debouncedMeasure = () => {
      clearTimeout(debounceTimer);
      debounceTimer = setTimeout(measure, 200);
    };

    // matchMedia fires synchronously with CSS breakpoints.
    const mq = window.matchMedia('(max-width: 767px)');
    const mqHandler = () => requestAnimationFrame(measure);
    mq.addEventListener('change', mqHandler);

    // Observe the hero logo (size changes on load/font-swap/resize) and the
    // header bar (height changes on Header--scrolled compact mode).
    const ro = new ResizeObserver(debouncedMeasure);
    const heroLogo  = document.querySelector('.hsf__logo-wrap img');
    const headerBar = document.querySelector('.Header-inner--top');
    if (heroLogo)  ro.observe(heroLogo);
    if (headerBar) ro.observe(headerBar);

    window.addEventListener('resize', debouncedMeasure);

    // Immediate measurement (covers cases where everything is already in the DOM).
    measure();

    // Also measure after a short settle — catches font-swap and image decode.
    const t = setTimeout(measure, 300);

    return () => {
      window.removeEventListener('resize', debouncedMeasure);
      mq.removeEventListener('change', mqHandler);
      ro.disconnect();
      clearTimeout(debounceTimer);
      clearTimeout(t);
    };
  }, []);

  return target;
}

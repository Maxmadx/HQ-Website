/**
 * HeroEngine — shared render engine for all hero variants.
 *
 * Accepts a config object and renders the full hero section. The engine has no
 * opinion about timing or feel — all of that lives in the config.
 *
 * Props:
 *   config    — variant config (v1/v2/v3)
 *   debugOpen — show/hide the DebugPanel overlay
 */
import React, { useState, useEffect, useRef } from 'react';
import { motion, useTransform } from 'framer-motion';
import { useHeroScroll } from './useHeroScroll';
import { useLogoTarget } from './useLogoTarget';
import { DebugPanel } from './DebugPanel';
import { HeroHeader } from './HeroHeader';

const LOGO_SRC   = '/assets/images/hq-aviation-logo.png';
const UNION_JACK = '/assets/images/icons/Union Jack.svg';

// ─── Tiny presentational components ───────────────────────────────────────────

function HeroLogo({ width }) {
  return <img src={LOGO_SRC} alt="HQ Aviation" style={{ width, height: 'auto', display: 'block' }} />;
}

function UnionJack({ size = 22 }) {
  return (
    <img
      src={UNION_JACK}
      alt="UK"
      style={{ width: size, height: 'auto', filter: 'grayscale(100%) contrast(1.2)', opacity: 0.7, display: 'inline-block', verticalAlign: 'middle' }}
    />
  );
}

function GridLines({ visible }) {
  return (
    <div className={`hsf__grid ${visible ? 'hsf__grid--visible' : ''}`}>
      {[5, 28, 72, 95].map((pos, i) => (
        <div key={`v${i}`} className="hsf__line hsf__line--v"
          style={{ left: `${pos}%`, background: 'rgba(255,255,255,0.06)', transitionDelay: `${0.1 + i * 0.1}s` }} />
      ))}
      {[15, 85].map((pos, i) => (
        <div key={`h${i}`} className="hsf__line hsf__line--h"
          style={{ top: `${pos}%`, background: 'rgba(255,255,255,0.06)', transitionDelay: `${0.5 + i * 0.1}s` }} />
      ))}
    </div>
  );
}

function ScrollPrompt() {
  return (
    <div className="hsf__scroll-prompt">
      <span className="hsf__scroll-text">Scroll to explore</span>
      <div className="hsf__scroll-line"><span /></div>
    </div>
  );
}

// ─── Per-image layer ───────────────────────────────────────────────────────────
// Separate component so useTransform is called at this component's top level
// (not inside .map() in the parent). Each instance is its own component — React
// never sees a variable number of hook calls per component.
function ImageLayer({ src, scrollYProgress, opacityDef, zIndex }) {
  const opacity = useTransform(scrollYProgress, opacityDef.input, opacityDef.output);
  return (
    <motion.div className="hsf__img-layer" style={{ opacity, zIndex }}>
      <img src={src} alt="" />
    </motion.div>
  );
}

// ─── Main engine ──────────────────────────────────────────────────────────────
export function HeroEngine({ config, debugOpen }) {
  const heroRef = useRef(null);
  const [linesVisible, setLinesVisible] = useState(false);
  const [isMobile, setIsMobile] = useState(
    () => typeof window !== 'undefined' && window.matchMedia('(max-width: 767px)').matches
  );

  const logoTarget = useLogoTarget();
  const anim       = useHeroScroll({ heroRef, config, logoTarget, isMobile });

  // Content (meta text) fades out during the first scroll movement.
  const contentOpacity = useTransform(anim.scrollYProgress, [0.01, 0.035], [1, 0]);

  // Sticky section bottom shadow fades in sync with the diagonal edge shadow.
  // Both reach opacity 0 at the same scroll point — no lingering black line at the
  // bottom of the hero viewport after the header has formed.
  const stickyBoxShadow = useTransform(
    anim.shadowOpacity,
    v => `0 8px 24px rgba(0,0,0,${(v * 0.3).toFixed(3)})`
  );

  useEffect(() => {
    const t = setTimeout(() => setLinesVisible(true), 200);
    return () => clearTimeout(t);
  }, []);

  useEffect(() => {
    const mq = window.matchMedia('(max-width: 767px)');
    const handler = (e) => setIsMobile(e.matches);
    mq.addEventListener('change', handler);
    return () => mq.removeEventListener('change', handler);
  }, []);

  const images = isMobile ? config.mobileImages : config.desktopImages;

  // Build opacity definitions for each image based on config.imageEnd.
  const imgOpacityDefs = images.map((_, i) => {
    const step  = config.imageEnd / images.length;
    const start = i * step;
    const end   = start + step;
    const prev  = Math.max(0, start - step * 0.15);
    const isFirst = i === 0;
    const isLast  = i === images.length - 1;
    if (isFirst && isLast) return { input: [0, 1],  output: [1, 1] }; // single image — always visible
    if (isFirst)           return { input: [prev, start, end - step * 0.15, end], output: [1, 1, 1, 0] };
    if (isLast)            return { input: [prev, start],                         output: [0, 1] };
    return                        { input: [prev, start, end - step * 0.15, end], output: [0, 1, 1, 0] };
  });

  return (
    <>
      <style>{CSS}</style>

      {/*
        HeroHeader starts invisible (opacity 0) and fades in only at the handoff point
        — the moment the diagonal bar has fully formed and the hero logo has reached
        the header's logo position. The polygon IS the header during the animation;
        the real header element takes over at the crossfade.
      */}
      <HeroHeader config={config} />

      <section className="hsf" ref={heroRef} style={{ height: config.scrollHeight }}>
        <motion.div className="hsf__sticky" style={{ boxShadow: stickyBoxShadow }}>

          {/* Background images */}
          <div className="hsf__images">
            {images.map((src, i) => (
              <ImageLayer
                key={`${src}-${i}`}
                src={src}
                scrollYProgress={anim.scrollYProgress}
                opacityDef={imgOpacityDefs[i]}
                zIndex={images.length - i}
              />
            ))}
          </div>

          {/* Shadow along diagonal edge */}
          <motion.div
            className="hsf__shadow"
            style={{ opacity: anim.shadowOpacity, clipPath: anim.shadowClipPath }}
          />

          {/* Diagonal overlay */}
          <motion.div
            className="hsf__diagonal"
            style={{ background: anim.diagBg, clipPath: anim.clipPath }}
          />

          {/* Grid lines */}
          <GridLines visible={linesVisible} />

          {/* Content */}
          <div className="hsf__content">
            <motion.div
              className="hsf__logo-wrap"
              style={{
                scale:   anim.logoScale,
                y:       anim.logoYpx,
                x:       anim.logoXpx,
                opacity: anim.heroLogoOpacity,
              }}
            >
              <motion.div
                style={{
                  maskImage:       anim.logoMask,
                  WebkitMaskImage: anim.logoMask,
                  filter:          anim.logoFilter,
                }}
              >
                <HeroLogo width="clamp(150px, 20vw, 280px)" />
              </motion.div>
            </motion.div>

            <motion.div style={{ opacity: contentOpacity }}>
              <div className="hsf__meta">
                <span style={{ whiteSpace: 'nowrap' }}>EST. 2010</span>
                <span className="hsf__dot" />
                <UnionJack size={22} />
                <span className="hsf__dot" />
                <span>LONDON</span>
              </div>
            </motion.div>
          </div>

          {/* Scroll prompt */}
          <ScrollPrompt />

          {/* Debug panel — positioned inside sticky so absolute coords work */}
          <DebugPanel values={anim} open={debugOpen} />

        </motion.div>
      </section>
    </>
  );
}

// ─── Styles ───────────────────────────────────────────────────────────────────
const CSS = `
  .hsf {
    position: relative;
    width: 100%;
    background: #faf9f6;
    font-family: 'Space Grotesk', sans-serif;
    contain: layout style;
    /* Pull the section up behind the fixed header so the image starts at viewport
       top-0, not at header-height. Cancels the 80px padding-top on .hq-main.
       When the header goes compact, no re-crop happens because the image was
       already full-viewport-height behind the header from the start. */
    margin-top: -80px;
  }
  @media (max-width: 768px) {
    .hsf { margin-top: -64px; }
  }
  .hsf__sticky {
    position: sticky;
    top: 0;
    height: 100vh;
    overflow: hidden;
  }
  .hsf__images {
    position: absolute; inset: 0; z-index: 1;
    mask-image:
      linear-gradient(to right, rgba(0,0,0,0.7) 0%, black 25%, black 75%, rgba(0,0,0,0.7) 100%),
      linear-gradient(to bottom, black 75%, rgba(0,0,0,0.7) 100%);
    -webkit-mask-image:
      linear-gradient(to right, rgba(0,0,0,0.7) 0%, black 25%, black 75%, rgba(0,0,0,0.7) 100%),
      linear-gradient(to bottom, black 75%, rgba(0,0,0,0.7) 100%);
    mask-composite: intersect;
    -webkit-mask-composite: source-in;
  }
  .hsf__img-layer { position: absolute; inset: 0; }
  .hsf__img-layer img { width: 100%; height: 100%; object-fit: cover; }
  .hsf__diagonal {
    position: absolute; inset: 0;
    background: rgba(26,26,26,0.88);
    clip-path: polygon(0 0, 42% 0, 28% 100%, 0 100%);
    z-index: 4;
    will-change: clip-path;
    contain: layout style;
  }
  .hsf__shadow {
    position: absolute; inset: 0; z-index: 3;
    background: rgba(0,0,0,0.7);
    filter: blur(12px);
    will-change: clip-path;
    contain: layout style;
  }
  .hsf__grid { position: absolute; inset: 0; pointer-events: none; }
  .hsf__line { position: absolute; transition: transform 1s cubic-bezier(0.16, 1, 0.3, 1); }
  .hsf__line--v { top: 0; bottom: 0; width: 1px; transform: scaleY(0); transform-origin: top; }
  .hsf__line--h { left: 0; right: 0; height: 1px; transform: scaleX(0); transform-origin: left; }
  .hsf__grid--visible .hsf__line--v { transform: scaleY(1); }
  .hsf__grid--visible .hsf__line--h { transform: scaleX(1); }
  .hsf__content {
    position: absolute; top: 0; left: 4%; bottom: 0;
    display: flex; flex-direction: column;
    justify-content: center; align-items: center;
    z-index: 10; max-width: 35%;
  }
  .hsf__logo-wrap { transform-origin: center top; margin: 0.5rem 0; }
  .hsf__meta {
    display: flex; align-items: center; gap: 0.75rem;
    font-family: 'Share Tech Mono', monospace;
    font-size: 0.85rem; letter-spacing: 0.15em;
    color: rgba(255,255,255,0.75); text-transform: uppercase;
    margin-top: 1.5rem;
  }
  .hsf__dot { width: 3px; height: 3px; background: rgba(255,255,255,0.3); border-radius: 50%; }
  .hsf__scroll-prompt {
    position: absolute; bottom: 1rem; left: 50%;
    transform: translateX(-50%);
    display: flex; flex-direction: column; align-items: center;
    gap: 1rem; z-index: 20;
  }
  .hsf__scroll-text { font-size: 0.65rem; text-transform: uppercase; letter-spacing: 0.2em; color: #999; }
  .hsf__scroll-line { width: 1px; height: 50px; background: rgba(0,0,0,0.7); position: relative; overflow: hidden; }
  .hsf__scroll-line span {
    position: absolute; top: 0; left: 0; width: 100%; height: 30%;
    background: #1a1a1a;
    animation: hsfScroll 2s ease-in-out infinite;
  }
  @keyframes hsfScroll { 0% { top: -30%; } 100% { top: 100%; } }
  @media (max-width: 768px) {
    .hsf__content { left: 50%; transform: translateX(-50%); max-width: 85%; text-align: center; }
    .hsf__logo-wrap img { width: clamp(120px, 40vw, 180px) !important; }
    .hsf__meta { font-size: 0.95rem; gap: 0.75rem; text-shadow: 0 1px 3px rgba(0,0,0,1); }
    .hsf__grid .hsf__line--v:nth-child(2),
    .hsf__grid .hsf__line--v:nth-child(3) { display: none; }
  }
`;

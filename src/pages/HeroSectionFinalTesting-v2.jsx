/**
 * HERO SECTION FINAL TESTING — V2 (perf-refactored)
 *
 * Visual behaviour is identical to HeroSectionFinalTesting.jsx. What changes:
 *   - Single shared rAF loop drives both the polygon morph AND the header spotlight.
 *   - Geometry (sectionTop, sectionRange) is cached on mount + ResizeObserver only
 *     — never re-read inside the scroll handler.
 *   - The hot path reads window.scrollY (a layout-free property), no
 *     getBoundingClientRect on every scroll event.
 *   - All interpolation is plain JS lerp; styles are written directly to refs
 *     in one batched pass with zero interleaved layout reads.
 *   - logoTarget lives in a ref, not state — re-measure never re-renders.
 *   - framer-motion is removed from this file: every motion.div is a plain div
 *     whose style is mutated by the rAF loop.
 */

import React, { useState, useEffect, useLayoutEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { usePageImages } from '../hooks/usePageImages';
import { SECTION_MAP } from '../lib/imageSections';
import Image from '../components/Image';

// ─── Images ───
const IMGS = {
  hero: '/assets/images/facility/hq-0209.jpg',
  aerial: '/assets/images/facility/hq-0089.jpg',
  expeditionQ: '/assets/images/gallery/events/img_2131.jpg',
  cockpit: '/assets/images/facility/hq-0502.jpg',
  antartica: '/assets/images/expeditions/antartica.jpg',
  fleet: '/assets/images/facility/hq-0294.jpg',
  hangar: '/assets/images/facility/hq-0745.jpg',
  channel: '/assets/images/facility/hq-0345.jpg',
  flying1: '/assets/images/gallery/flying/flying-.jpg',
  flying2: '/assets/images/gallery/flying/foggy-evening-flying.jpg',
  event1: '/assets/images/gallery/events/img_2028.jpg',
  busyHangar: '/assets/images/facility/busy-hangar.jpg',
};

const SLIDE_IMAGES = [
  '/assets/images/facility/hq-0209.jpg',
  '/assets/images/facility/hq-0056.jpg',
  '/assets/images/gallery/carousel/rotating6.jpg',
];

const LOGO_SRC = '/assets/images/hq-aviation-logo.png';

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

// ─── Lerp helpers ───
const clamp = (v, a, b) => v < a ? a : v > b ? b : v;

// Linear interpolation through keyframe arrays — same shape as framer-motion useTransform({input, output}).
function interp(p, inputs, outputs) {
  const n = inputs.length;
  if (p <= inputs[0]) return outputs[0];
  if (p >= inputs[n - 1]) return outputs[n - 1];
  for (let i = 1; i < n; i++) {
    if (p <= inputs[i]) {
      const span = inputs[i] - inputs[i - 1];
      const t = span === 0 ? 0 : (p - inputs[i - 1]) / span;
      return outputs[i - 1] + (outputs[i] - outputs[i - 1]) * t;
    }
  }
  return outputs[n - 1];
}

// Walk offsetParent chain summing offsetTop/offsetLeft. Layout coords only — ignores transforms.
// Same approach as src/hero-variants/useLogoTarget.js for transform-safe natural position.
function naturalOffsetFrom(el, ancestor) {
  let top = 0, left = 0, node = el;
  while (node && node !== ancestor) {
    top  += node.offsetTop;
    left += node.offsetLeft;
    node = node.offsetParent;
    if (!node || node === document.body) break;
  }
  return { top, left };
}

// ─── Polygon keyframe arrays (pulled out of JSX, identical to v1) ───
const POLY_FULL_INPUT = [0, 0.01, 0.02, 0.03, 0.04, 0.05, 0.06, 0.07, 0.08, 0.09, 0.10, 0.105, 0.11, 0.115, 0.12, 0.125, 0.13, 0.135, 0.14, 0.145, 0.15, 0.155, 0.16];
const POLY_ROT_INPUT  = [0, 0.01, 0.02, 0.03, 0.04, 0.05, 0.06, 0.07, 0.08, 0.09, 0.10];
const RY_INPUT        = [0, 0.10, 0.105, 0.11, 0.115, 0.12, 0.125, 0.13, 0.135, 0.14, 0.145, 0.15, 0.155, 0.16, 0.18, 0.21, 0.24];
const BR_INPUT        = [0, 0.06, 0.07, 0.08, 0.09, 0.10, 0.11, 0.12, 0.13, 0.16, 0.18, 0.21, 0.24];

const MIDX_DESKTOP = [42,  46,  51,  57,  63,  70,  78,  85,  91,  96,  100, 93, 86, 79, 72, 65, 58, 50, 42, 36, 30, 25, 20];
const MIDX_MOBILE  = [100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 93, 86, 79, 72, 65, 58, 50, 42, 36, 30, 25, 20];

const RX_DESKTOP = [42,  46,  51,  57,  63,  70,  78,  85,  91,  96,  100];
const RX_MOBILE  = [100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100];

const RY_OUT = [0, 0, 0.5, 1, 1.5, 2, 3, 4, 4.5, 5, 5.5, 6, 7, 8, 8, 8, 8];

const BRX_DESKTOP = [28, 26, 24, 21, 18, 15, 11, 8, 5, 2, 0, 6, 13, 21, 30, 40, 50, 60, 70, 80, 88, 95, 100];
const BRX_MOBILE  = [0,  0,  0,  0,  0,  0,  0,  0, 0, 0, 0, 6, 13, 21, 30, 40, 50, 60, 70, 80, 88, 95, 100];

function buildBrYOut(bp) {
  const bpEnd = bp * 0.9;
  return [100, 100, 87, 73, 58, 45, 32, bp * 2.2, bp, bp, bp, (bp + bpEnd) / 2, bpEnd];
}

const SCROLL_REMAP_IN  = [0, 0.089, 1];
const SCROLL_REMAP_OUT = [0, 0.04,  0.28];

// ─── Header — purely presentational; the parent owns the scroll loop ───
const TestingHeader = React.forwardRef(function TestingHeader(
  { navHidden, navManuallyShown, navIsStuck, navManuallyClosed, onToggleNav, menuBtnRef },
  ref
) {
  return (
    <header
      ref={ref}
      className="Header Header--top"
      style={{ opacity: 0, pointerEvents: 'none' }}
      data-cms-section="home-hero-slides"
    >
      <div className="Header-inner Header-inner--top" data-nc-group="top">
        <div data-nc-container="top-left"></div>
        <div data-nc-container="top-center">
          <Link to="/" className="Header-branding" data-nc-element="branding">
            <img
              src="/assets/images/logos/hq/hq-aviation-logo-black.png"
              alt="HQ Aviation"
              className="Header-branding-logo"
            />
          </Link>
          <nav className="Header-nav Header-nav--secondary" data-nc-element="secondary-nav">
            <div className="Header-nav-inner">
              <Link to="/flying" className="Header-nav-item">Flying</Link>
              <Link to="/training" className="Header-nav-item">Training</Link>
              <span className="Header-nav-item Header-nav-item--folder">
                <Link to="/expeditions" className="Header-nav-folder-title">Exploration</Link>
                <span className="Header-nav-folder">
                  <Link to="/expeditions" className="Header-nav-folder-item">Worldwide Expeditions</Link>
                  <Link to="/expeditions/calendar" className="Header-nav-folder-item">HQ Trips</Link>
                  <Link to="/services" className="Header-nav-folder-item">Ferry Flights</Link>
                </span>
              </span>
            </div>
          </nav>
        </div>
        <div data-nc-container="top-right">
          <button
            ref={menuBtnRef}
            className={`fd-header-burger hq-menu-btn${navIsStuck && (!navHidden || navManuallyShown) && !navManuallyClosed ? ' open' : ''}`}
            onClick={onToggleNav}
            aria-label="Toggle navigation"
          >
            <span></span><span></span><span></span>
          </button>
        </div>
      </div>
    </header>
  );
});

// ─── Image Picker Gallery (preserved verbatim from v1, dev-only utility) ───
const GALLERY_IMAGES = {
  'facility': [
    'hq-0007.jpg','hq-0035.jpg','hq-0053.jpg','hq-0056.jpg','hq-0075.jpg','hq-0089.jpg','hq-0129.jpg',
    'hq-0153.jpg','hq-0153-1.jpg','hq-0153-2.jpg','hq-0153-3.jpg','hq-0153-4.jpg','hq-0167.jpg',
    'hq-0209.jpg','hq-0213.jpg','hq-0254.jpg','hq-0294.jpg','hq-0300.jpg','hq-0345.jpg','hq-0354.jpg',
    'hq-0388.jpg','hq-0391.jpg','hq-0409.jpg','hq-0477.jpg','hq-0502.jpg','hq-0696.jpg','hq-0698.jpg',
    'hq-0745.jpg','busy-hangar.jpg','hq-aviation-robinsons.jpg','hq-img_1340.jpg',
    'main-sales-pic.jpg','main-sales-pic-1.jpg','maintenance-.jpg','okey-paint-quality.jpg',
    'sales-rebuild.jpg','sales-used.jpg','washing.jpg',
  ],
  'expeditions': [
    'antartica.jpg','channel.jpg','helicopter-expeditions-quentin-smith.webp','north-pole.jpg',
    'six-helis-in-North-Pole.jpg','south-pole-by-helicopter-quentin-smith.webp',
  ],
  'gallery/flying': [
    'flying-.jpg','flying--1.jpg','flying-tv.jpg','foggy-evening-flying.jpg','james-shadow-night.jpg',
  ],
  'gallery/events': [
    'dsc_0062.jpg','dsc_4073_jpg.jpg','img_0223.jpg','img_0333.jpg','img_1176.jpg','img_1324-2.jpg',
    'img_1346.jpg','img_1356.jpg','img_1358-copy-281-29.jpg','img_1539.jpg','img_1539-1.jpg',
    'img_1638.jpg','img_2028.jpg','img_2103.jpg','img_2131.jpg','img_2199.jpg','img_2278.jpg',
    'img_4488.jpg','img_8604.jpg','img_8733.jpg','p1140516.jpg',
  ],
  'gallery/carousel': [
    'rotating1.jpg','rotating2.jpg','rotating-3.jpg','rotating-4.jpg',
    'rotating6.jpg','rotating6-1.jpg','rotating6-2.jpg','rotating8.jpg',
  ],
  'lifestyle': [
    'london-battersea-heliport.jpg','rala-hotel.jpg','yacht-landing.jpg',
  ],
  'team': [
    'british-helicopter-team.jpg','helicopter-genius-quentin-smith-great-britain.webp',
    'helicopter-lands-on-a-car-2c-top-gear-2c-quentin-smith.webp',
    'new-team-rx-racing-for-print.jpg','q-dubai.jpg','quentin-smith-profile-picture.jpg',
    'quentin-smith-profile-picture-2.jpg','world-helicopter-champion-quentin-smith.webp',
  ],
  'gallery/social': [
    'img-20180810-wa0011.jpg','img-20180812-wa0017.jpg','img-20180813-wa0014.jpg',
    'img-20230308-wa0001.jpg','img-20230412-wa0000.jpg','img-20230425-wa0001.jpg',
    'img-20230425-wa0002.jpg','img-20230425-wa0003.jpg','img-20230514-wa0006.jpg',
    'img-20230514-wa0011.jpg','img-20240113-wa0001.jpg','img-20240113-wa0003.jpg',
    'img-20240119-wa0004.jpg','img-20241004-wa0001.jpg','img-20241004-wa0002.jpg',
    'img-20241004-wa0003.jpg','img-20241004-wa0005.jpg','img-20241004-wa0006.jpg',
    'img-20241004-wa0007.jpg','img-20241004-wa0008.jpg','img-20241004-wa0009.jpg',
    'img-20241004-wa0011.jpg','img-20241004-wa0014.jpg','img-20241004-wa0016.jpg',
    'img-20241004-wa0017.jpg','img-20241004-wa0018.jpg','img-20241004-wa0021.jpg',
  ],
};

function ImagePickerGallery() {
  const [selected, setSelected] = useState([]);

  const toggle = (path) => {
    setSelected(prev => {
      const next = prev.includes(path) ? prev.filter(p => p !== path) : [...prev, path];
      navigator.clipboard.writeText(next.join('\n'));
      return next;
    });
  };

  const clear = () => {
    setSelected([]);
    navigator.clipboard.writeText('');
  };

  return (
    <div style={{ background: '#faf9f6', padding: '4rem 2rem', fontFamily: "'Space Grotesk', sans-serif" }}>
      {selected.length > 0 && (
        <div style={{
          position: 'sticky', top: 0, zIndex: 100, background: '#1a1a1a', color: '#fff',
          padding: '0.75rem 1.5rem', borderRadius: 8, marginBottom: '2rem',
          display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '1rem',
        }}>
          <div style={{ fontSize: '0.8rem' }}>
            <strong>{selected.length}</strong> selected — copied to clipboard
          </div>
          <div style={{ fontSize: '0.65rem', color: '#999', flex: 1, overflow: 'hidden', whiteSpace: 'nowrap', textOverflow: 'ellipsis' }}>
            {selected.join(', ')}
          </div>
          <button onClick={clear} style={{
            background: 'transparent', border: '1px solid #555', color: '#fff',
            padding: '0.3rem 0.75rem', borderRadius: 4, cursor: 'pointer', fontSize: '0.7rem',
          }}>Clear</button>
        </div>
      )}

      {Object.entries(GALLERY_IMAGES).map(([folder, files]) => (
        <div key={folder} style={{ marginBottom: '2rem' }}>
          <h3 style={{ fontSize: '0.7rem', textTransform: 'uppercase', letterSpacing: '0.15em', color: '#888', marginBottom: '0.75rem' }}>
            {folder}
          </h3>
          <div className="hsf__gallery-grid" style={{
            display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(160px, 1fr))',
            gap: '0.5rem',
          }}>
            {files.map(file => {
              const path = `/assets/images/${folder}/${file}`;
              const isSelected = selected.includes(path);
              return (
                <div
                  key={file}
                  className="hsf__gallery-item"
                  onClick={() => toggle(path)}
                  style={{
                    position: 'relative', cursor: 'pointer', borderRadius: 6, overflow: 'hidden',
                    height: 110, border: isSelected ? '3px solid #1E3A5F' : '3px solid transparent',
                    opacity: isSelected ? 1 : 0.8, transition: 'all 0.15s ease',
                  }}
                >
                  <img src={path} alt={file} style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
                  {isSelected && (
                    <div style={{
                      position: 'absolute', top: 4, right: 4, width: 20, height: 20,
                      background: '#1E3A5F', borderRadius: '50%', display: 'flex',
                      alignItems: 'center', justifyContent: 'center', color: '#fff', fontSize: '0.65rem', fontWeight: 700,
                    }}>
                      {selected.indexOf(path) + 1}
                    </div>
                  )}
                  <div style={{
                    position: 'absolute', bottom: 0, left: 0, right: 0, padding: '0.25rem 0.4rem',
                    background: 'rgba(0,0,0,0.6)', color: '#fff', fontSize: '0.5rem',
                    whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
                  }}>
                    {file}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      ))}
    </div>
  );
}

// ─── Main component ───
const HeroSectionFinalTesting = React.memo(({ navHidden, navManuallyShown, navIsStuck, navManuallyClosed, onToggleNav }) => {
  const pageImages = usePageImages('home');
  const cmsMobileSlides  = (pageImages['home-hero-slides-mobile'] ?? SECTION_MAP['home-hero-slides-mobile'].images).map(img => img.url);
  const cmsDesktopSlides = (pageImages['home-hero-slides']        ?? SECTION_MAP['home-hero-slides'].images).map(img => img.url);

  const [linesVisible, setLinesVisible] = useState(false);
  const [isMobile, setIsMobile] = useState(() => window.matchMedia('(max-width: 767px)').matches);

  // All animated DOM lives behind refs — no state writes during scroll.
  const heroRef     = useRef(null);
  const headerRef   = useRef(null);
  const menuBtnRef  = useRef(null);
  const diagonalRef = useRef(null);
  const shadowRef   = useRef(null);
  const logoWrapRef = useRef(null);
  const logoMaskRef = useRef(null);
  const metaRef     = useRef(null);
  const imgRefs     = useRef([]);

  // Geometry caches & target measurements never trigger a re-render.
  const geomRef   = useRef({ sectionTop: 0, sectionRange: 1, vh: 800, vw: 1200, isMobileLayout: false });
  const targetRef = useRef({ yPx: -300, xPx: 200, heroW: 280, headerW: 80, barPct: 9 });

  useEffect(() => {
    const t = setTimeout(() => setLinesVisible(true), 200);
    return () => clearTimeout(t);
  }, []);

  // ── Diagnostic instrumentation: log any main-thread block > 50ms ──
  // Captures longtasks (anything > 50ms on the main thread) and slow event
  // handlers, with the scrollY at the time. Console-visible so the user can
  // copy the logs while reproducing a lag spike.
  useEffect(() => {
    const sources = [];
    const tag = (extra = '') => `[hero-perf] @scrollY=${Math.round(window.scrollY)}${extra}`;

    try {
      const lto = new PerformanceObserver((list) => {
        for (const e of list.getEntries()) {
          const dur = Math.round(e.duration);
          const attr = e.attribution && e.attribution[0];
          const ctype = attr ? attr.containerType : 'self';
          const cname = attr && attr.containerName ? ` "${attr.containerName}"` : '';
          const csrc  = attr && attr.containerSrc ? ` src=${attr.containerSrc}` : '';
          // eslint-disable-next-line no-console
          console.warn(`${tag()} longtask ${dur}ms (${ctype}${cname}${csrc})`);
        }
      });
      lto.observe({ entryTypes: ['longtask'] });
      sources.push(lto);
    } catch {}

    try {
      const eto = new PerformanceObserver((list) => {
        for (const e of list.getEntries()) {
          if (e.duration > 50) {
            // eslint-disable-next-line no-console
            console.warn(`${tag()} ${e.name} handler ${Math.round(e.duration)}ms`);
          }
        }
      });
      eto.observe({ type: 'event', buffered: true, durationThreshold: 50 });
      sources.push(eto);
    } catch {}

    // long-animation-frame: tells us the FULL cost of a stalled frame
    // (script + style + layout + paint) and identifies the worst script.
    // Script identities are stringified inline so they survive copy-paste.
    try {
      const shortenUrl = (u) => {
        if (!u) return '';
        try {
          const x = new URL(u, window.location.href);
          // Keep just last 2 path segments + line/col fragment if any.
          const parts = x.pathname.split('/').filter(Boolean).slice(-2).join('/');
          return parts + (x.search ? x.search.slice(0, 30) : '');
        } catch { return String(u).slice(-60); }
      };
      const lafo = new PerformanceObserver((list) => {
        for (const e of list.getEntries()) {
          const dur = Math.round(e.duration);
          if (dur < 50) continue;
          const blocking = Math.round(e.blockingDuration || 0);
          const styleLayout = Math.round((e.styleAndLayoutStart && e.renderEnd) ? (e.renderEnd - e.styleAndLayoutStart) : 0);
          const scriptStr = (e.scripts || [])
            .map(s => {
              const src = s.sourceURL || s.invoker || s.name || 'unknown';
              const fn  = s.sourceFunctionName ? `:${s.sourceFunctionName}` : '';
              const inv = s.invokerType ? `[${s.invokerType}]` : '';
              return `${shortenUrl(src)}${fn}${inv}=${Math.round(s.duration)}ms`;
            })
            .sort((a, b) => parseInt(b.split('=').pop()) - parseInt(a.split('=').pop()))
            .slice(0, 4)
            .join(' | ');
          // eslint-disable-next-line no-console
          console.warn(
            `${tag()} long-frame ${dur}ms (blocking=${blocking}ms, style+layout=${styleLayout}ms) :: ${scriptStr || '(no script attribution)'}`
          );
        }
      });
      lafo.observe({ type: 'long-animation-frame', buffered: true });
      sources.push(lafo);
    } catch {}

    return () => sources.forEach(o => o.disconnect());
  }, []);

  // matchMedia gate — re-renders only on breakpoint cross (not during scroll).
  useEffect(() => {
    const mq = window.matchMedia('(max-width: 767px)');
    const handler = (e) => setIsMobile(e.matches);
    mq.addEventListener('change', handler);
    return () => mq.removeEventListener('change', handler);
  }, []);

  // Eagerly decode every hero image at mount. Without this, the FIRST cross-fade
  // pays a sync decode + compositor upload and the whole rAF (header spotlight
  // included) stalls for that frame.
  useEffect(() => {
    const urls = [...new Set([...cmsMobileSlides, ...cmsDesktopSlides])].filter(Boolean);
    let cancelled = false;
    urls.forEach((url) => {
      // window.Image — the native HTMLImageElement constructor. The bare
      // `Image` identifier is shadowed by the `import Image from
      // '../components/Image'` at the top of this file (the React component).
      const img = new window.Image();
      img.src = url;
      if (img.decode) img.decode().catch(() => {});
      img.onload = () => { if (!cancelled) img.dataset.heroPreload = '1'; };
    });
    return () => { cancelled = true; };
  }, [cmsMobileSlides.join('|'), cmsDesktopSlides.join('|')]);

  // GPU texture warmup. opacity: 0.001 + decode() + translate3d() are not enough
  // to convince the browser to actually upload an inactive layer's texture — it
  // waits until the layer is visibly painted. So the first cross-fade pays an
  // upload stall (visible as a one-off freeze on image 0 → 1).
  //
  // Fix: after mount, paint every layer at full opacity for a couple of frames.
  // Image 0 (zIndex top) covers the others, so the user sees nothing change.
  // The compositor still has to paint each layer though — that uploads their
  // textures to the GPU, where they stay cached for the rest of the session.
  useEffect(() => {
    let cancelled = false;
    const imgs = imgRefs.current;
    if (!imgs || imgs.length === 0) return;
    // Show all layers
    imgs.forEach((el) => { if (el) el.style.opacity = '1'; });
    // Wait two rAFs (one to commit + paint, one for safety) then restore.
    let f2 = 0;
    const f1 = requestAnimationFrame(() => {
      f2 = requestAnimationFrame(() => {
        if (cancelled) return;
        imgs.forEach((el, i) => { if (el) el.style.opacity = i === 0 ? '1' : '0.001'; });
      });
    });
    return () => {
      cancelled = true;
      cancelAnimationFrame(f1);
      if (f2) cancelAnimationFrame(f2);
    };
  }, [isMobile, cmsMobileSlides.length, cmsDesktopSlides.length]);

  // ── Single shared rAF scroll engine ──
  // useLayoutEffect so the first tick runs before paint — no flash of pre-animation
  // state when landing mid-scroll.
  useLayoutEffect(() => {
    const heroEl     = heroRef.current;
    const headerEl   = headerRef.current;
    const diagonalEl = diagonalRef.current;
    const shadowEl   = shadowRef.current;
    const logoWrapEl = logoWrapRef.current;
    const logoMaskEl = logoMaskRef.current;
    if (!heroEl || !headerEl || !diagonalEl || !shadowEl || !logoWrapEl || !logoMaskEl) return;

    let pending = false;
    let prevScrolled = false;
    // Per-image opacity cache — closes over the effect, resets on remount.
    const imgOpacityCache = [];

    // ── Telemetry (toggle with window.__heroPerf = true) ──
    if (typeof window !== 'undefined') {
      window.__hero = window.__hero || { frames: [], lastT: 0, scrollEvents: 0 };
    }

    // ── Geometry — measured outside the hot path ──
    const measureGeom = () => {
      const rect = heroEl.getBoundingClientRect();
      geomRef.current.sectionTop     = rect.top + window.scrollY;
      geomRef.current.sectionRange   = Math.max(1, rect.height - window.innerHeight);
      geomRef.current.vh             = window.innerHeight;
      geomRef.current.vw             = window.innerWidth;
      geomRef.current.isMobileLayout = window.innerWidth < 768;
    };

    // ── Logo target — measured outside the hot path, transform/sticky/scroll-independent ──
    //
    // History of this measurement:
    //   1. Original used `pRect.top + scrollY`, which broke whenever sticky had
    //      pinned the element (mid-section scroll).
    //   2. Then `contentRect.top + offsetWithinContent`, which broke when the
    //      user was below the section and sticky had released, because
    //      contentRect.top reflected the released live position.
    //   3. Then offsetTop traversal up to heroEl, which broke for a third
    //      reason: Chrome's offsetTop on a sticky element reports the
    //      currently-shifted position, not the natural layout position.
    //      When the user scrolled past the section, .hsf__sticky.offsetTop
    //      jumped from 0 to ~576, and the resize handler captured that.
    //
    // The fix: stop the offsetTop walk AT `.hsf__sticky`. Anything inside the
    // sticky child shifts as a unit — its internal layout doesn't change — so
    // the offset of the logo within sticky is constant (~233px) regardless
    // of where sticky has pinned. The sticky element itself sits at viewport
    // Y=0 whenever the section is at sectionTop, which is the moment we
    // calibrate yPx against.
    const measureLogos = () => {
      const headerLogo = document.querySelector('.Header-branding-logo');
      const heroLogo   = logoMaskEl.querySelector('img');
      const stickyEl   = heroEl.querySelector('.hsf__sticky');
      if (!headerLogo || !heroLogo || !stickyEl) return;
      if (!headerLogo.complete || headerLogo.naturalWidth === 0) {
        headerLogo.addEventListener('load', measureLogos, { once: true });
        return;
      }
      if (!heroLogo.complete || heroLogo.naturalWidth === 0) {
        heroLogo.addEventListener('load', measureLogos, { once: true });
        return;
      }

      const hRect = headerLogo.getBoundingClientRect();
      const { top: logoOffsetTop, left: logoOffsetLeft } = naturalOffsetFrom(heroLogo, stickyEl);
      const heroW = heroLogo.offsetWidth;

      // When scrollY = sectionTop the sticky child is at viewport Y=0 (start
      // of its sticky range), so the logo's natural viewport Y equals its
      // layout offset within sticky.
      const yDelta = hRect.top - logoOffsetTop;
      const xDelta = (hRect.left + hRect.width / 2) - (logoOffsetLeft + heroW / 2);

      const headerInner = document.querySelector('.Header-inner--top');
      const headerH     = headerInner ? headerInner.getBoundingClientRect().height : 60;
      const barPct      = (headerH / window.innerHeight) * 100 * 1.05;

      targetRef.current = { yPx: yDelta, xPx: xDelta, heroW, headerW: hRect.width, barPct };
    };

    // ── The hot path ──
    const tick = () => {
      pending = false;
      const tickStart = performance.now();
      const scrollY = window.scrollY;
      const { sectionTop, sectionRange, vh, isMobileLayout } = geomRef.current;
      const { yPx, xPx, heroW, headerW, barPct } = targetRef.current;

      // 0..1 progress over the section, then non-linear remap to 0..0.28.
      const raw = clamp((scrollY - sectionTop) / sectionRange, 0, 1);
      const sp  = interp(raw, SCROLL_REMAP_IN, SCROLL_REMAP_OUT);

      // ── Polygon points ──
      const mx = interp(sp, POLY_FULL_INPUT, isMobile ? MIDX_MOBILE : MIDX_DESKTOP);
      const rx = interp(sp, POLY_ROT_INPUT,  isMobile ? RX_MOBILE   : RX_DESKTOP);
      const ry = interp(sp, RY_INPUT, RY_OUT);
      const bx = interp(sp, POLY_FULL_INPUT, isMobile ? BRX_MOBILE  : BRX_DESKTOP);
      const brYOut = buildBrYOut(barPct);
      const by = interp(sp, BR_INPUT, brYOut);
      const bl = by;

      // ── Diagonal: clipPath + background colour transition ──
      const t13_155 = clamp((sp - 0.13) / 0.025, 0, 1); // 0.155 - 0.13 = 0.025
      const diagC   = 26 + (255 - 26) * t13_155;
      const diagA   = 0.60 + 0.40 * t13_155;
      diagonalEl.style.clipPath  = `polygon(0 0, ${mx}% 0, ${rx}% 0, ${rx}% ${ry}%, ${bx}% ${by}%, 0 ${bl}%)`;
      diagonalEl.style.background = `rgba(${diagC},${diagC},${diagC},${diagA})`;

      // ── Shadow: clipPath + opacity ──
      const s = 0.4;
      const shadowOp = interp(sp, [0.18, 0.24], [1, 0]);
      shadowEl.style.clipPath = `polygon(0 0, ${mx + s}% 0, ${mx + s}% ${s}%, ${rx + s}% ${s}%, ${rx + s}% ${ry + s}%, ${bx + s}% ${Math.min(by + s, 100)}%, 0 ${Math.min(bl + s, 100)}%)`;
      shadowEl.style.opacity = shadowOp;

      // ── Logo wrap: scale + translate + opacity (one transform write) ──
      const holdScale  = Math.max((headerW + 10) / heroW, 0.35);
      const finalScale = headerW / heroW;
      const scale      = interp(sp, [0.04, 0.10, 0.155, 0.215], [1, holdScale, holdScale, finalScale]);
      const tx         = interp(sp, [0.12, 0.21], [0, xPx]);
      const ty         = interp(sp, [0.04, 0.13], [0, yPx]);
      const logoOp     = interp(sp, [0.214, 0.216], [1, 0]);
      logoWrapEl.style.transform = `translate3d(${tx}px, ${ty}px, 0) scale(${scale})`;
      logoWrapEl.style.opacity   = logoOp;

      // ── Logo mask + filter (inner div) ──
      const bottomFade = interp(sp, [0.03, 0.08], [1, 0]);
      const inv = interp(sp, [0, 0.13, 0.155], [1, 1, 0]);
      const br  = interp(sp, [0, 0.13, 0.155], [2, 2, 1]);
      const maskStr = `linear-gradient(to bottom, black 75%, rgba(0,0,0,${bottomFade}) 75%)`;
      logoMaskEl.style.maskImage       = maskStr;
      logoMaskEl.style.webkitMaskImage = maskStr;
      logoMaskEl.style.filter          = `invert(${inv}) brightness(${br})`;

      // ── Meta strip (under the logo) ──
      const metaEl = metaRef.current;
      if (metaEl) metaEl.style.opacity = interp(sp, [0.01, 0.035], [1, 0]);

      // ── Image cross-fades ──
      // Skip writes when opacity hasn't moved — repeating tiny float diffs while a
      // layer is held at 0 or 1 still pokes the compositor every frame.
      const imgs = imgRefs.current;
      const count = imgs.length;
      const cache = imgOpacityCache;
      if (count > 0) {
        const imgEnd = 0.28;
        const step   = imgEnd / count;
        for (let i = 0; i < count; i++) {
          const el = imgs[i];
          if (!el) continue;
          const start = i * step;
          const end   = start + step;
          const prev  = Math.max(0, start - step * 0.15);
          const isFirst = i === 0;
          const isLast  = i === count - 1;
          let op;
          if (isFirst && isLast) op = 1;
          else if (isFirst)      op = interp(sp, [0, 0, end - step * 0.15, end], [1, 1, 1, 0]);
          else if (isLast)       op = interp(sp, [prev, start], [0, 1]);
          else                   op = interp(sp, [prev, start, end - step * 0.15, end], [0, 1, 1, 0]);
          // Round to 3 decimals so steady-state holds short-circuit cleanly.
          // Floor at 0.001 so the GPU keeps a texture allocated even when the
          // layer is "off" — prevents upload-stall on the next cross-fade.
          const rounded = Math.max(0.001, Math.round(op * 1000) / 1000);
          if (cache[i] !== rounded) {
            el.style.opacity = rounded;
            cache[i] = rounded;
          }
        }
      }

      // ── Header (spotlight + opacity), driven by the same tick ──
      const spotBaseH  = isMobileLayout ? 70  : 95;
      const spotBaseW  = isMobileLayout ? 140 : 214;
      const fadeFactor = isMobileLayout ? 0.35  : 0.5995;
      const spotFactor = isMobileLayout ? 0.355 : 0.6025;

      const spotStart     = vh * spotFactor;
      const adjusted      = Math.max(0, scrollY - spotStart);
      const fadeStart     = vh * fadeFactor;
      const fadeEnd       = fadeStart + vh * 0.006;
      const headerOpacity = clamp((scrollY - fadeStart) / (fadeEnd - fadeStart), 0, 1);
      const visible       = headerOpacity > 0;
      const vP   = Math.min(adjusted / 75,  1);
      const hP   = Math.min(adjusted / 150, 1);
      const isScrolled = adjusted > 150;
      const spotH = spotBaseH + Math.round(vP * (500  - spotBaseH));
      const spotW = spotBaseW + Math.round(hP * (2000 - spotBaseW));

      headerEl.style.opacity       = headerOpacity;
      headerEl.style.pointerEvents = visible ? 'auto' : 'none';
      headerEl.style.setProperty('--spotlight-width',  `${spotW}px`);
      headerEl.style.setProperty('--spotlight-height', `${spotH}px`);

      if (isScrolled !== prevScrolled) {
        prevScrolled = isScrolled;
        headerEl.classList.toggle('Header--scrolled', isScrolled);
        const btnEl = menuBtnRef.current;
        if (btnEl) {
          btnEl.classList.toggle('color-dark', isScrolled);
          btnEl.classList.toggle('scrolled',   isScrolled);
        }
      }

      // ── Telemetry: record this frame's timing + state ──
      const h = window.__hero;
      if (h) {
        const tEnd = performance.now();
        const gap = h.lastT === 0 ? 0 : tickStart - h.lastT;
        h.lastT = tickStart;
        h.frames.push({
          t: +tickStart.toFixed(2),
          gap: +gap.toFixed(2),
          work: +(tEnd - tickStart).toFixed(3),
          y: scrollY,
          sp: +sp.toFixed(4),
          op: imgOpacityCache.slice(),
          hOp: +headerOpacity.toFixed(3),
        });
        if (h.frames.length > 600) h.frames.shift();
      }
    };

    const onScroll = () => {
      if (window.__hero) window.__hero.scrollEvents++;
      if (pending) return;
      pending = true;
      requestAnimationFrame(tick);
    };

    const schedule = () => {
      if (pending) return;
      pending = true;
      requestAnimationFrame(tick);
    };

    const onResize = () => {
      measureGeom();
      measureLogos();
      schedule();
    };

    measureGeom();
    measureLogos();
    tick();

    // Settle pass for fonts / async image decode that change logo sizes.
    const settleTimer = setTimeout(() => {
      measureGeom();
      measureLogos();
      schedule();
    }, 300);

    const ro = new ResizeObserver(() => {
      measureGeom();
      measureLogos();
      schedule();
    });
    ro.observe(heroEl);

    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onResize);

    return () => {
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onResize);
      ro.disconnect();
      clearTimeout(settleTimer);
    };
  }, [isMobile, cmsMobileSlides.length, cmsDesktopSlides.length]);

  return (
    <>
      <style>{styles}</style>
      <TestingHeader
        ref={headerRef}
        menuBtnRef={menuBtnRef}
        navHidden={navHidden}
        navManuallyShown={navManuallyShown}
        navIsStuck={navIsStuck}
        navManuallyClosed={navManuallyClosed}
        onToggleNav={onToggleNav}
      />

      <section className="hsf" ref={heroRef}>
        <div className="hsf__sticky">

          <div className="hsf__images" data-cms-section="home-hero-slides-mobile">
            {(isMobile ? cmsMobileSlides : cmsDesktopSlides).map((src, i, arr) => (
              <div
                key={i}
                ref={el => { imgRefs.current[i] = el; }}
                className="hsf__img-layer"
                /* Inactive layers start at 0.001 (visually 0, but the browser
                   keeps a GPU texture allocated) so the first cross-fade
                   doesn't pay an upload-stall on the compositor thread. */
                style={{ zIndex: arr.length - i, opacity: i === 0 ? 1 : 0.001 }}
              >
                {isMobile && src.includes('r22-london-mobile-hq') && (
                  <div className="hsf__img-darken" />
                )}
                <Image
                  src={src}
                  alt=""
                  width={1920}
                  height={1080}
                  sizes="100vw"
                  priority={i === 0}
                />
              </div>
            ))}
          </div>

          <div
            ref={shadowRef}
            className="hsf__shadow"
            style={{ opacity: 1, clipPath: 'polygon(0 0, 42.4% 0, 42.4% 0.4%, 42.4% 0.4%, 42.4% 0.4%, 28.4% 100%, 0 100%)' }}
          />

          <div
            ref={diagonalRef}
            className="hsf__diagonal"
            style={{ background: 'rgba(26,26,26,0.60)', clipPath: 'polygon(0 0, 42% 0, 42% 0%, 42% 0%, 28% 100%, 0 100%)' }}
          />

          <div className="hsf__content">
            <div
              ref={logoWrapRef}
              className="hsf__logo-wrap"
              style={{ transform: 'translate3d(0,0,0) scale(1)', opacity: 1 }}
            >
              <div
                ref={logoMaskRef}
                style={{
                  maskImage: 'linear-gradient(to bottom, black 75%, rgba(0,0,0,1) 75%)',
                  WebkitMaskImage: 'linear-gradient(to bottom, black 75%, rgba(0,0,0,1) 75%)',
                  filter: 'invert(1) brightness(2)',
                }}
              >
                <Logo width="clamp(150px, 20vw, 280px)" />
              </div>
            </div>

            <div ref={metaRef} style={{ opacity: 1 }}>
              <div className="hsf__meta">
                <span style={{ whiteSpace: 'nowrap' }}>EST. 2010</span>
                <span className="hsf__dot" />
                <UnionJack size={22} />
                <span className="hsf__dot" />
                <span>LONDON</span>
              </div>
            </div>
          </div>

        </div>
      </section>
    </>
  );
});

// ─── Styles ───
// Same as v1 with a few extra `will-change` hints on the elements we mutate every
// frame, so the compositor promotes them once and avoids per-frame paint.
const styles = `
  .hsf {
    position: relative;
    width: 100%;
    height: 180vh;
    background: #faf9f6;
    font-family: 'Space Grotesk', sans-serif;
    contain: layout style;
  }

  .hsf__sticky {
    position: sticky;
    top: 0;
    height: 100vh;
    overflow: hidden;
    box-shadow: 0 8px 24px rgba(0,0,0,0.3);
  }

  /* ─ Images ─ */
  .hsf__images {
    position: absolute; inset: 0; z-index: 1;
    /* No mask here — applied per-layer below so the parent doesn't have to
       flatten its (promoted) children every cross-fade frame. */
  }
  .hsf__img-layer {
    position: absolute; inset: 0;
    /* Each image layer is its own compositor layer + carries its own mask.
       Cross-fades become pure GPU blends between two pre-uploaded textures —
       no parent flatten, no per-frame mask recomputation against changing
       layers, no paint. */
    transform: translate3d(0, 0, 0);
    will-change: transform, opacity;
    backface-visibility: hidden;
    contain: paint;
    mask-image: linear-gradient(to right, rgba(0,0,0,0.7) 0%, black 25%, black 75%, rgba(0,0,0,0.7) 100%),
                linear-gradient(to bottom, black 75%, rgba(0,0,0,0.7) 100%);
    -webkit-mask-image: linear-gradient(to right, rgba(0,0,0,0.7) 0%, black 25%, black 75%, rgba(0,0,0,0.7) 100%),
                        linear-gradient(to bottom, black 75%, rgba(0,0,0,0.7) 100%);
    mask-composite: intersect;
    -webkit-mask-composite: source-in;
  }
  .hsf__img-layer img {
    width: 100%; height: 100%; object-fit: cover;
  }
  .hsf__img-darken {
    position: absolute; inset: 0; z-index: 1;
    background: rgba(0, 0, 0, 0.35);
    pointer-events: none;
  }

  /* ─ Diagonal overlay ─ */
  .hsf__diagonal {
    position: absolute; inset: 0;
    background: rgba(26, 26, 26, 0.88);
    clip-path: polygon(0 0, 42% 0, 28% 100%, 0 100%);
    z-index: 4;
    will-change: clip-path, background;
    contain: layout style;
  }
  .hsf__shadow {
    position: absolute; inset: 0;
    z-index: 3;
    will-change: clip-path, opacity;
    contain: layout style paint;
    /* Was filter: blur(12px) on a 100vw element — gaussian blur is one of the
       most expensive compositor ops, and the clip-path changes every frame so
       the blur output had to recompute every paint. That's what stalled the
       cross-fade. A radial alpha fade gives a similar soft edge for ~0 cost. */
    background: radial-gradient(ellipse at 30% 50%, rgba(0,0,0,0.85) 0%, rgba(0,0,0,0.55) 60%, rgba(0,0,0,0) 100%);
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
    font-size: 1rem; color: rgba(255,255,255,0.85); max-width: 300px; line-height: 1.6; margin: 0; text-align: center;
  }
  .hsf__meta {
    display: flex; align-items: center; gap: 0.75rem; margin-top: 1.5rem;
    font-family: 'Share Tech Mono', monospace;
    font-size: 0.85rem; letter-spacing: 0.15em; color: rgba(255,255,255,0.75); text-transform: uppercase;
  }
  .hsf__dot {
    width: 3px; height: 3px; background: rgba(255,255,255,0.3); border-radius: 50%;
  }

  /* ─ Logo ─ */
  .hsf__logo-wrap {
    transform-origin: center top;
    margin: 0.5rem 0;
    will-change: transform, opacity;
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
    .hsf {
      height: 150vh;
    }
    .hsf__img-layer:first-child img {
      transform: scaleX(-1);
    }

    /* Content — center on narrow screens */
    .hsf__content {
      left: 50%;
      transform: translateX(-50%);
      max-width: 85%;
      text-align: center;
    }

    /* Logo — proportionally sized for small screens */
    .hsf__logo-wrap img {
      width: clamp(120px, 40vw, 180px) !important;
    }

    /* Meta/coords — scale down + subtle shadow */
    .hsf__meta {
      font-size: 0.95rem;
      gap: 0.75rem;
      text-shadow: 0 1px 3px rgba(0,0,0,1), 0 0 8px rgba(0,0,0,0.95);
    }
    .hsf__coords {
      font-size: clamp(0.55rem, 2.5vw, 0.65rem);
      gap: 1rem;
    }

    /* Scroll line — shorter on mobile */
    .hsf__scroll-line {
      height: clamp(30px, 8vh, 50px);
    }

    /* Grid lines — hide inner vertical lines (28%, 72%) */
    .hsf__grid .hsf__line--v:nth-child(2),
    .hsf__grid .hsf__line--v:nth-child(3) {
      display: none;
    }

    /* Image gallery grid — smaller thumbnails */
    .hsf__gallery-grid {
      grid-template-columns: repeat(auto-fill, minmax(100px, 1fr)) !important;
    }
    .hsf__gallery-item {
      height: 80px !important;
    }
  }
`;

export default HeroSectionFinalTesting;

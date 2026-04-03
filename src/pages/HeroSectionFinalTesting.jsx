/**
 * HERO SECTION FINAL TESTING — Exact copy for isolated testing
 */

import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { motion, useScroll, useTransform } from 'framer-motion';

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

// ─── Header that appears as diagonal disappears ───
function TestingHeader() {
  const [menuOpen, setMenuOpen] = useState(false);
  const headerRef = useRef(null);
  const menuBtnRef = useRef(null);
  const rafId = useRef(0);

  useEffect(() => {
    const isMobile = window.innerWidth < 768;
    const spotlightBaseH = isMobile ? 70 : 95;
    const spotlightBaseW = isMobile ? 140 : 214;
    let prevScrolled = false;
    let prevVisible = false;

    let settled = false; // true once header animation is fully done

    const update = () => {
      const scrollY = window.scrollY;
      const ih = window.innerHeight;
      const headerEl = headerRef.current;
      const btnEl = menuBtnRef.current;
      if (!headerEl) return;

      // Once the header transition is fully complete (scrolled past spotlight zone),
      // stop doing work on every frame.
      const spotlightStart = ih * 0.6025;
      const adjustedScroll = Math.max(0, scrollY - spotlightStart);

      if (settled) {
        // Only re-enter if user scrolls back up near the hero
        if (scrollY < ih * 0.8) { settled = false; }
        else return;
      }

      const fadeStart = ih * 0.5995;
      const fadeEnd = ih * 0.6055;
      const opacity = Math.max(0, Math.min(1, (scrollY - fadeStart) / (fadeEnd - fadeStart)));
      const visible = opacity > 0;

      const vProgress = Math.min(adjustedScroll / 75, 1);
      const hProgress = Math.min(adjustedScroll / 150, 1);
      const isScrolled = adjustedScroll > 150;

      const spotlightHeight = spotlightBaseH + Math.round(vProgress * (500 - spotlightBaseH));
      const spotlightWidth = spotlightBaseW + Math.round(hProgress * (2000 - spotlightBaseW));

      // Direct DOM updates — no React re-render
      headerEl.style.opacity = opacity;
      headerEl.style.pointerEvents = visible ? 'auto' : 'none';
      headerEl.style.setProperty('--spotlight-width', `${spotlightWidth}px`);
      headerEl.style.setProperty('--spotlight-height', `${spotlightHeight}px`);

      if (isScrolled !== prevScrolled) {
        prevScrolled = isScrolled;
        headerEl.classList.toggle('Header--scrolled', isScrolled);
        if (btnEl) {
          btnEl.classList.toggle('color-dark', isScrolled);
          btnEl.classList.toggle('scrolled', isScrolled);
        }
      }
      if (visible !== prevVisible) {
        prevVisible = visible;
      }

      // Mark settled once fully transitioned
      if (isScrolled && vProgress === 1 && hProgress === 1) {
        settled = true;
      }
    };

    const handleScroll = () => {
      cancelAnimationFrame(rafId.current);
      rafId.current = requestAnimationFrame(update);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    update();
    return () => {
      window.removeEventListener('scroll', handleScroll);
      cancelAnimationFrame(rafId.current);
    };
  }, []);

  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape') setMenuOpen(false);
    };
    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, []);

  const toggleMenu = () => setMenuOpen(!menuOpen);
  const closeMenu = () => setMenuOpen(false);

  return (
    <>
      <div className={`hq-menu-panel ${menuOpen ? 'open' : ''}`}>
        <div className="hq-menu-grid">
          <div className="hq-menu-section">
            <h3>About</h3>
            <ul>
              <li><Link to="/" onClick={closeMenu}>Home</Link></li>
              <li><Link to="/about-us" onClick={closeMenu}>About Us</Link></li>
              <li><Link to="/about-us/team" onClick={closeMenu}>Meet The Team</Link></li>
            </ul>
          </div>
          <div className="hq-menu-section">
            <h3>Aircraft Sales</h3>
            <ul>
              <li><Link to="/aircraft-sales" onClick={closeMenu}>New Aircraft</Link></li>
            </ul>
          </div>
          <div className="hq-menu-section">
            <h3>Flight Training</h3>
            <ul>
              <li><Link to="/training" onClick={closeMenu}>Training Overview</Link></li>
              <li><Link to="/training/trial-lessons" onClick={closeMenu}>Trial Lessons</Link></li>
              <li><Link to="/training/ppl" onClick={closeMenu}>Private Pilot License</Link></li>
            </ul>
          </div>
          <div className="hq-menu-section">
            <h3>Services</h3>
            <ul>
              <li><Link to="/services" onClick={closeMenu}>Services Overview</Link></li>
              <li><Link to="/services/maintenance" onClick={closeMenu}>Maintenance</Link></li>
            </ul>
          </div>
          <div className="hq-menu-section">
            <h3>Experiences</h3>
            <ul>
              <li><Link to="/expeditions" onClick={closeMenu}>Expeditions</Link></li>
            </ul>
          </div>
          <div className="hq-menu-section">
            <h3>Contact</h3>
            <ul>
              <li><Link to="/contact" onClick={closeMenu}>Contact Us</Link></li>
            </ul>
          </div>
        </div>
      </div>

      <button
        ref={menuBtnRef}
        className={`hq-menu-btn ${menuOpen ? 'open' : ''}`}
        onClick={toggleMenu}
        aria-label="Toggle menu"
        aria-expanded={menuOpen}
      >
        <span></span>
        <span></span>
        <span></span>
      </button>

      <header
        ref={headerRef}
        className="Header Header--top"
        style={{ opacity: 0, pointerEvents: 'none' }}
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
          <div data-nc-container="top-right"></div>
        </div>
      </header>
    </>
  );
}

// ─── Image Picker Gallery ───
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
const HeroSectionFinalTesting = React.memo(() => {
  const [linesVisible, setLinesVisible] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  const [logoTarget, setLogoTarget] = useState({ yPx: -300, xPx: 200, heroW: 280, headerW: 80, barPct: 9 });
  const heroRef = useRef(null);
  const { scrollYProgress: rawProgress } = useScroll({ target: heroRef, offset: ['start start', 'end end'] });
  // Non-linear remap: 0→0.04 at original speed (14.3vh), then stretch the rest over remaining scroll
  // 260vh section → 160vh scroll range. 14.3vh = rawProgress 0.089
  const scrollYProgress = useTransform(rawProgress, [0, 0.089, 1], [0, 0.04, 0.28]);

  useEffect(() => { setTimeout(() => setLinesVisible(true), 200); }, []);

  useEffect(() => {
    let resizeTimer;
    const handleResize = () => {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(() => {
        const nowMobile = window.innerWidth < 768;
        setIsMobile(prev => prev === nowMobile ? prev : nowMobile);
      }, 250);
    };
    window.addEventListener('resize', handleResize);
    return () => { window.removeEventListener('resize', handleResize); clearTimeout(resizeTimer); };
  }, []);

  // Measure header logo position for pixel-perfect handoff
  useEffect(() => {
    let resizeDebounce;
    const measure = () => {
      const headerLogo = document.querySelector('.Header-branding-logo');
      const heroLogo = document.querySelector('.hsf__logo-wrap img');
      if (!headerLogo || !heroLogo) return;

      // Wait for both images to have real dimensions
      if (!headerLogo.complete || headerLogo.naturalWidth === 0) {
        headerLogo.addEventListener('load', measure, { once: true });
        return;
      }
      if (!heroLogo.complete || heroLogo.naturalWidth === 0) {
        heroLogo.addEventListener('load', measure, { once: true });
        return;
      }

      // Instead of scrolling to 0, compute natural positions from current scroll offset.
      // Hero logo sits at CSS top in the hero section (scrollYProgress 0 = page top).
      // Header logo sits in the fixed header.
      // At scrollY=0 both are in their natural positions,
      // but we can offset by current scrollY to avoid the scroll-to-top hack.
      const scrollY = window.scrollY;
      const hRect = headerLogo.getBoundingClientRect();
      const pRect = heroLogo.getBoundingClientRect();

      // heroLogo's natural top = pRect.top + scrollY (it's in the flow, not fixed)
      // headerLogo's natural top = hRect.top (it's in the fixed header, position doesn't change with scroll)
      const naturalHeroTop = pRect.top + scrollY;
      const naturalHeroLeft = pRect.left; // horizontal position doesn't change with vertical scroll
      const yDelta = hRect.top - naturalHeroTop;
      const xDelta = (hRect.left + hRect.width / 2) - (naturalHeroLeft + pRect.width / 2);

      // Measure actual header bar height as % of viewport
      const headerEl = document.querySelector('.Header-inner--top');
      const headerH = headerEl ? headerEl.getBoundingClientRect().height : 60;
      const barPct = (headerH / window.innerHeight) * 100 * 1.05;

      setLogoTarget(prev => {
        // Only update if values actually changed (avoid re-render + useTransform recreation)
        if (Math.abs(prev.yPx - yDelta) < 1 && Math.abs(prev.xPx - xDelta) < 1 &&
            Math.abs(prev.heroW - pRect.width) < 1 && Math.abs(prev.headerW - hRect.width) < 1 &&
            Math.abs(prev.barPct - barPct) < 0.5) {
          return prev;
        }
        return { yPx: yDelta, xPx: xDelta, heroW: pRect.width, headerW: hRect.width, barPct };
      });
    };

    const debouncedMeasure = () => {
      clearTimeout(resizeDebounce);
      resizeDebounce = setTimeout(measure, 200);
    };

    // Wait for layout + images
    setTimeout(measure, 300);
    window.addEventListener('resize', debouncedMeasure);
    return () => { window.removeEventListener('resize', debouncedMeasure); clearTimeout(resizeDebounce); };
  }, []);


  // Images cycle quickly, finishing just before final collapse
  const imgEnd = 0.28;

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
  // Desktop rotation (0→0.10): 42→100. Transition (0.10→0.16): 100→20.
  // Mobile: starts at 100 (full corner-to-corner diagonal), holds, then same transition.
  const midX = useTransform(scrollYProgress,
    [0, 0.01, 0.02, 0.03, 0.04, 0.05, 0.06, 0.07, 0.08, 0.09, 0.10, 0.105, 0.11, 0.115, 0.12, 0.125, 0.13, 0.135, 0.14, 0.145, 0.15, 0.155, 0.16],
    isMobile
      ? [100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 93, 86, 79, 72, 65, 58, 50, 42, 36, 30, 25, 20]
      : [42,  46,  51,  57,  63,  70,  78,  85,  91,  96,  100, 93, 86, 79, 72, 65, 58, 50, 42, 36, 30, 25, 20]
  );

  // rX: same as midX during rotation, then stays at 100.
  // Mobile: already at 100 from the start.
  const rX = useTransform(scrollYProgress,
    [0, 0.01, 0.02, 0.03, 0.04, 0.05, 0.06, 0.07, 0.08, 0.09, 0.10],
    isMobile
      ? [100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100]
      : [42,  46,  51,  57,  63,  70,  78,  85,  91,  96,  100]
  );

  // rY: vertical drop on right side. Grows during transition, holds, then collapse.
  const rY = useTransform(scrollYProgress,
    [0, 0.10, 0.105, 0.11, 0.115, 0.12, 0.125, 0.13, 0.135, 0.14, 0.145, 0.15, 0.155, 0.16, 0.18, 0.21, 0.24],
    [0, 0,    0.5,   1,    1.5,   2,    3,     4,    4.5,   5,    5.5,   6,    7,     8,    8,    8,    8]
  );

  // brX: Desktop rotation (0→0.10): 28→0. Transition (0.10→0.16): 0→100.
  // Mobile: starts at 0 (bottom-left corner), holds, then same transition.
  const brX = useTransform(scrollYProgress,
    [0, 0.01, 0.02, 0.03, 0.04, 0.05, 0.06, 0.07, 0.08, 0.09, 0.10, 0.105, 0.11, 0.115, 0.12, 0.125, 0.13, 0.135, 0.14, 0.145, 0.15, 0.155, 0.16],
    isMobile
      ? [0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  6,  13, 21, 30, 40, 50, 60, 70, 80, 88, 95, 100]
      : [28, 26, 24, 21, 18, 15, 11, 8,  5,  2,  0,  6,  13, 21, 30, 40, 50, 60, 70, 80, 88, 95, 100]
  );

  // brY: 100 during rotation → measured header height. Computed from actual header px.
  const bp = logoTarget.barPct;
  const bpEnd = bp * 0.9; // slight taper
  const brY = useTransform(scrollYProgress,
    [0, 0.06, 0.07, 0.08, 0.09, 0.10, 0.11, 0.12, 0.13, 0.16, 0.18, 0.21, 0.24],
    [100, 100, 87,   73,   58,   45,   32,   bp * 2.2, bp, bp, bp, (bp + bpEnd) / 2, bpEnd]
  );

  // blY: same as brY.
  const blY = useTransform(scrollYProgress,
    [0, 0.06, 0.07, 0.08, 0.09, 0.10, 0.11, 0.12, 0.13, 0.16, 0.18, 0.21, 0.24],
    [100, 100, 87,   73,   58,   45,   32,   bp * 2.2, bp, bp, bp, (bp + bpEnd) / 2, bpEnd]
  );

  // ── Text/grid/pips fade early ──
  const contentOpacity = useTransform(scrollYProgress, [0.01, 0.035], [1, 0]);
  const gridOpacity = useTransform(scrollYProgress, [0, 0.01], [1, 0]);
  const pipsOpacity = useTransform(scrollYProgress, [0.08, 0.16], [1, 0]);
  const scrollPromptOpacity = useTransform(scrollYProgress, [0, 0.05], [1, 0]);

  // ── Logo shrink sequence (scale computed from measured pixel widths) ──
  // No percentages — scale values derived from actual pixel measurements
  const { heroW, headerW } = logoTarget;
  const holdScale = Math.max((headerW + 10) / heroW, 0.35);
  const finalScale = headerW / heroW;
  const logoScale = useTransform(scrollYProgress,
    [0.04, 0.10, 0.155, 0.215],
    [1, holdScale, holdScale, finalScale]
  );
  const logoBottomOpacity = useTransform(scrollYProgress, [0.03, 0.08], [1, 0]);

  // Y: moves up to header row (0.04→0.13) — fast climb to align with header bar forming
  const logoYpx = useTransform(scrollYProgress, [0.04, 0.13], [0, logoTarget.yPx]);
  // X: starts just before Y finishes (0.12→0.21) — overlaps so logo never stops
  const logoXpx = useTransform(scrollYProgress, [0.12, 0.21], [0, logoTarget.xPx]);

  // ── Color transitions (logo + diagonal bar change together 0.13→0.155) ──
  const logoInvert = useTransform(scrollYProgress, [0, 0.13, 0.155], [1, 1, 0]);
  const logoBrightness = useTransform(scrollYProgress, [0, 0.13, 0.155], [2, 2, 1]);
  const diagBg = useTransform(scrollYProgress, [0, 0.13, 0.155], ['rgba(26,26,26,0.60)', 'rgba(26,26,26,0.60)', 'rgba(255,255,255,1)']);
  const shadowOpacity = useTransform(scrollYProgress, [0.18, 0.24], [1, 0]);

  // ── Swap at 0.215 — near-instant crossfade ──
  const heroLogoFinalOpacity = useTransform(scrollYProgress, [0.214, 0.216], [1, 0]);

  // ── Pre-computed image opacity transforms (hoisted from JSX to avoid hook recreation) ──
  const imgCount = SLIDE_IMAGES.length;
  const imgStep = imgEnd / imgCount;
  const img0Opacity = useTransform(scrollYProgress,
    [0, 0, imgStep - imgStep * 0.15, imgStep],
    [1, 1, 1, 0]
  );
  const img1Opacity = useTransform(scrollYProgress,
    [Math.max(0, imgStep - imgStep * 0.15), imgStep, 2 * imgStep - imgStep * 0.15, 2 * imgStep],
    [0, 1, 1, 0]
  );
  const img2Opacity = useTransform(scrollYProgress,
    [Math.max(0, 2 * imgStep - imgStep * 0.15), 2 * imgStep],
    [0, 1]
  );
  const imgOpacities = [img0Opacity, img1Opacity, img2Opacity];

  // ── Shadow & diagonal clip-path transforms (hoisted from JSX) ──
  const shadowClipPath = useTransform(
    [midX, rX, rY, brX, brY, blY],
    ([mx, rx, ry, bx, by, bl]) => {
      const s = 0.4;
      return `polygon(0 0, ${mx + s}% 0, ${mx + s}% ${s}%, ${rx + s}% ${s}%, ${rx + s}% ${ry + s}%, ${bx + s}% ${Math.min(by + s, 100)}%, 0 ${Math.min(bl + s, 100)}%)`;
    }
  );
  const diagonalClipPath = useTransform(
    [midX, rX, rY, brX, brY, blY],
    ([mx, rx, ry, bx, by, bl]) => `polygon(0 0, ${mx}% 0, ${rx}% 0, ${rx}% ${ry}%, ${bx}% ${by}%, 0 ${bl}%)`
  );

  // ── Logo mask/filter transforms (hoisted from JSX) ──
  const logoMaskImage = useTransform(logoBottomOpacity, v =>
    `linear-gradient(to bottom, black 75%, rgba(0,0,0,${v}) 75%)`
  );
  const logoWebkitMaskImage = useTransform(logoBottomOpacity, v =>
    `linear-gradient(to bottom, black 75%, rgba(0,0,0,${v}) 75%)`
  );
  const logoFilter = useTransform([logoInvert, logoBrightness], ([inv, br]) => `invert(${inv}) brightness(${br})`);

  return (
    <>
      <style>{styles}</style>
      <TestingHeader />

      <section className="hsf" ref={heroRef}>
        {/* ── Sticky viewport ── */}
        <div className="hsf__sticky">

          {/* Full-screen image layers */}
          <div className="hsf__images">
            {(isMobile ? [SLIDE_IMAGES[1], SLIDE_IMAGES[0], ...SLIDE_IMAGES.slice(2)] : SLIDE_IMAGES).map((src, i) => (
                <motion.div
                  key={i}
                  className="hsf__img-layer"
                  style={{
                    opacity: imgOpacities[i],
                    zIndex: imgCount - i,
                  }}
                >
                  <img src={src} alt="" />
                </motion.div>
            ))}
          </div>

          {/* Shadow along diagonal edge */}
          <motion.div
            className="hsf__shadow"
            style={{
              opacity: shadowOpacity,
              clipPath: shadowClipPath,
            }}
          />

          {/* Diagonal overlay */}
          <motion.div
            className="hsf__diagonal"
            style={{
              background: diagBg,
              clipPath: diagonalClipPath,
            }}
          />


          {/* All content as one centered block — text fades, logo animates away */}
          <div className="hsf__content">
<motion.div
              className="hsf__logo-wrap"
              style={{
                scale: logoScale,
                y: logoYpx,
                x: logoXpx,
                opacity: heroLogoFinalOpacity,
              }}
            >
            <motion.div style={{
              maskImage: logoMaskImage,
              WebkitMaskImage: logoWebkitMaskImage,
              filter: logoFilter,
            }}>
              <Logo width="clamp(150px, 20vw, 280px)" />
            </motion.div>
          </motion.div>

            <motion.div style={{ opacity: contentOpacity }}>
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
});

// ─── Styles ───
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
    will-change: clip-path;
    contain: layout style;
  }
  .hsf__shadow {
    position: absolute; inset: 0;
    z-index: 3;
    will-change: clip-path;
    contain: layout style;
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

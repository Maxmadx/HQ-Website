/**
 * HQ AVIATION - 30 HIGH-FIDELITY HERO VARIATIONS
 * World-class UI/UX Design with Modern Trends
 *
 * Categories:
 * - Cinematic: Film-inspired, dramatic
 * - Glassmorphism: Frosted glass, depth
 * - Editorial: Magazine-style, typography-focused
 * - Immersive: Full-bleed, experiential
 * - Bento: Grid-based, modular
 * - Kinetic: Motion, animation
 * - Minimal: Refined, restrained
 * - Dark: Elegant dark themes
 * - Split: Asymmetric layouts
 * - Interactive: Engaging elements
 */

import { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';

// Hero images
const imgs = {
  hangar: '/assets/images/facility/hq-0745.jpg',
  cockpit: '/assets/images/facility/hq-0354.jpg',
  fleet: '/assets/images/facility/hq-0254.jpg',
  sunset: '/assets/images/gallery/flying/flying-.jpg',
  training: '/assets/images/training/home-2312.jpg',
  aerial: '/assets/images/facility/hq-0089.jpg',
  events: '/assets/images/gallery/events/img_2644.jpeg',
  facility: '/assets/images/facility/hq-0035.jpg',
};

// ============================================
// 1. CINEMATIC LETTERBOX
// Film-style with dramatic letterboxing
// ============================================
export const Hero01_CinematicLetterbox = () => (
  <section className="hero-var hero-var--letterbox">
    <div className="hero-var__letterbox-bar hero-var__letterbox-bar--top"></div>
    <div className="hero-var__bg">
      <img src={imgs.sunset} alt="" />
    </div>
    <div className="hero-var__overlay hero-var__overlay--cinematic"></div>
    <div className="hero-var__content hero-var__content--cinematic">
      <span className="hero-var__chapter">Chapter One</span>
      <h1 className="hero-var__headline--cinematic">The Art of Flight</h1>
      <p className="hero-var__subtitle--cinematic">A journey begins at Denham Aerodrome</p>
    </div>
    <div className="hero-var__letterbox-bar hero-var__letterbox-bar--bottom"></div>
  </section>
);

// ============================================
// 2. GLASSMORPHISM CARD
// Frosted glass floating card
// ============================================
export const Hero02_GlassCard = () => (
  <section className="hero-var hero-var--glass">
    <div className="hero-var__bg">
      <img src={imgs.aerial} alt="" />
    </div>
    <div className="hero-var__glass-orb hero-var__glass-orb--1"></div>
    <div className="hero-var__glass-orb hero-var__glass-orb--2"></div>
    <div className="hero-var__glass-card">
      <span className="hero-var__glass-badge">Est. 1990</span>
      <h1 className="hero-var__headline--glass">HQ Aviation</h1>
      <p className="hero-var__text--glass">Robinson Helicopter Specialists</p>
      <div className="hero-var__glass-stats">
        <div><strong>35+</strong><span>Years</span></div>
        <div><strong>30+</strong><span>Fleet</span></div>
        <div><strong>1000+</strong><span>Pilots</span></div>
      </div>
      <Link to="/contact" className="hero-var__btn--glass">Get Started</Link>
    </div>
  </section>
);

// ============================================
// 3. EDITORIAL MAGAZINE
// Bold typography, magazine layout
// ============================================
export const Hero03_Editorial = () => (
  <section className="hero-var hero-var--editorial">
    <div className="hero-var__editorial-grid">
      <div className="hero-var__editorial-text">
        <span className="hero-var__editorial-issue">Issue 01 / 2024</span>
        <h1 className="hero-var__headline--editorial">
          <span>Elevate</span>
          <span>Your</span>
          <span>Journey</span>
        </h1>
        <p className="hero-var__editorial-lead">
          The definitive guide to helicopter excellence at London's premier aviation centre.
        </p>
      </div>
      <div className="hero-var__editorial-image">
        <img src={imgs.cockpit} alt="" />
        <div className="hero-var__editorial-caption">Denham Aerodrome, UK</div>
      </div>
    </div>
  </section>
);

// ============================================
// 4. IMMERSIVE FULLBLEED
// Edge-to-edge with floating elements
// ============================================
export const Hero04_ImmersiveFullbleed = () => (
  <section className="hero-var hero-var--immersive">
    <div className="hero-var__bg hero-var__bg--zoom">
      <img src={imgs.hangar} alt="" />
    </div>
    <div className="hero-var__overlay hero-var__overlay--radial"></div>
    <div className="hero-var__immersive-content">
      <div className="hero-var__immersive-tag">London's Premier</div>
      <h1 className="hero-var__headline--immersive">Robinson<br/>Specialists</h1>
    </div>
    <div className="hero-var__immersive-scroll">
      <div className="hero-var__scroll-line"></div>
      <span>Scroll to explore</span>
    </div>
    <div className="hero-var__immersive-corner">
      <span>51.5751° N</span>
      <span>0.5128° W</span>
    </div>
  </section>
);

// ============================================
// 5. BENTO GRID
// Apple-inspired grid layout
// ============================================
export const Hero05_BentoGrid = () => (
  <section className="hero-var hero-var--bento">
    <div className="hero-var__bento-grid">
      <div className="hero-var__bento-cell hero-var__bento-cell--hero">
        <img src={imgs.sunset} alt="" />
        <div className="hero-var__bento-overlay">
          <h1>HQ Aviation</h1>
          <p>The Robinson Specialists</p>
        </div>
      </div>
      <div className="hero-var__bento-cell hero-var__bento-cell--stat">
        <span className="hero-var__bento-number">35+</span>
        <span className="hero-var__bento-label">Years of Excellence</span>
      </div>
      <div className="hero-var__bento-cell hero-var__bento-cell--image">
        <img src={imgs.cockpit} alt="" />
      </div>
      <Link to="/training" className="hero-var__bento-cell hero-var__bento-cell--cta">
        <span>Start Training</span>
        <span className="hero-var__bento-arrow">→</span>
      </Link>
      <div className="hero-var__bento-cell hero-var__bento-cell--quote">
        <blockquote>"World-class training"</blockquote>
      </div>
    </div>
  </section>
);

// ============================================
// 6. KINETIC TYPOGRAPHY
// Animated text reveal
// ============================================
export const Hero06_KineticType = () => {
  const [visible, setVisible] = useState(false);
  useEffect(() => { setVisible(true); }, []);

  return (
    <section className="hero-var hero-var--kinetic">
      <div className="hero-var__bg">
        <img src={imgs.aerial} alt="" />
      </div>
      <div className="hero-var__overlay hero-var__overlay--dark"></div>
      <div className={`hero-var__kinetic-text ${visible ? 'visible' : ''}`}>
        <div className="hero-var__kinetic-line"><span>Train.</span></div>
        <div className="hero-var__kinetic-line"><span>Fly.</span></div>
        <div className="hero-var__kinetic-line"><span>Excel.</span></div>
      </div>
      <div className="hero-var__kinetic-cta">
        <Link to="/training">Begin Your Journey →</Link>
      </div>
    </section>
  );
};

// ============================================
// 7. MINIMAL LUXURY
// Ultra-clean, refined elegance
// ============================================
export const Hero07_MinimalLuxury = () => (
  <section className="hero-var hero-var--minimal-luxury">
    <div className="hero-var__minimal-container">
      <div className="hero-var__minimal-header">
        <span>HQ Aviation</span>
        <span>Since 1990</span>
      </div>
      <h1 className="hero-var__headline--minimal">
        Elevate
      </h1>
      <div className="hero-var__minimal-image">
        <img src={imgs.fleet} alt="" />
      </div>
      <p className="hero-var__minimal-tagline">Robinson Helicopter Specialists</p>
    </div>
  </section>
);

// ============================================
// 8. DARK ELEGANCE
// Sophisticated dark theme
// ============================================
export const Hero08_DarkElegance = () => (
  <section className="hero-var hero-var--dark-elegance">
    <div className="hero-var__dark-bg"></div>
    <div className="hero-var__dark-glow"></div>
    <div className="hero-var__dark-content">
      <div className="hero-var__dark-eyebrow">
        <span className="hero-var__dark-line"></span>
        <span>HQ Aviation</span>
        <span className="hero-var__dark-line"></span>
      </div>
      <h1 className="hero-var__headline--dark">
        The Art of<br/><em>Helicopter Flight</em>
      </h1>
      <div className="hero-var__dark-ctas">
        <Link to="/training" className="hero-var__btn--dark-primary">Explore Training</Link>
        <Link to="/contact" className="hero-var__btn--dark-secondary">Contact Us</Link>
      </div>
    </div>
    <div className="hero-var__dark-image">
      <img src={imgs.sunset} alt="" />
    </div>
  </section>
);

// ============================================
// 9. SPLIT DIAGONAL
// Asymmetric diagonal split
// ============================================
export const Hero09_SplitDiagonal = () => (
  <section className="hero-var hero-var--split-diagonal">
    <div className="hero-var__diagonal-content">
      <span className="hero-var__diagonal-tag">Robinson Specialists</span>
      <h1 className="hero-var__headline--diagonal">
        Where Dreams<br/>Take Flight
      </h1>
      <p className="hero-var__diagonal-text">
        From discovery flights to commercial licenses, experience world-class training at Denham Aerodrome.
      </p>
      <Link to="/training" className="hero-var__btn--diagonal">Start Your Journey</Link>
    </div>
    <div className="hero-var__diagonal-image">
      <img src={imgs.hangar} alt="" />
    </div>
    <div className="hero-var__diagonal-clip"></div>
  </section>
);

// ============================================
// 10. INTERACTIVE HOVER
// Reveal on mouse movement
// ============================================
export const Hero10_InteractiveReveal = () => {
  const [mousePos, setMousePos] = useState({ x: 50, y: 50 });

  const handleMouseMove = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    setMousePos({
      x: ((e.clientX - rect.left) / rect.width) * 100,
      y: ((e.clientY - rect.top) / rect.height) * 100,
    });
  };

  return (
    <section className="hero-var hero-var--interactive" onMouseMove={handleMouseMove}>
      <div
        className="hero-var__interactive-reveal"
        style={{ '--mouse-x': `${mousePos.x}%`, '--mouse-y': `${mousePos.y}%` }}
      >
        <img src={imgs.aerial} alt="" />
      </div>
      <div className="hero-var__interactive-content">
        <h1 className="hero-var__headline--interactive">Discover</h1>
        <p>Move your cursor to reveal</p>
      </div>
    </section>
  );
};

// ============================================
// 11. GRADIENT MESH
// Modern gradient background
// ============================================
export const Hero11_GradientMesh = () => (
  <section className="hero-var hero-var--gradient-mesh">
    <div className="hero-var__mesh-bg"></div>
    <div className="hero-var__mesh-content">
      <div className="hero-var__mesh-badge">HQ Aviation</div>
      <h1 className="hero-var__headline--mesh">
        Elevate Your<br/>Journey
      </h1>
      <p className="hero-var__mesh-subtitle">Robinson Helicopter Specialists Since 1990</p>
      <div className="hero-var__mesh-ctas">
        <Link to="/training" className="hero-var__btn--mesh-primary">Start Training</Link>
        <Link to="/aircraft-sales" className="hero-var__btn--mesh-secondary">View Fleet</Link>
      </div>
    </div>
    <div className="hero-var__mesh-image">
      <img src={imgs.fleet} alt="" />
    </div>
  </section>
);

// ============================================
// 12. BRUTALIST
// Raw, bold, unapologetic
// ============================================
export const Hero12_Brutalist = () => (
  <section className="hero-var hero-var--brutalist">
    <div className="hero-var__brutalist-content">
      <h1 className="hero-var__headline--brutalist">FLY</h1>
      <div className="hero-var__brutalist-info">
        <span>HQ AVIATION</span>
        <span>DENHAM UK</span>
        <span>EST. 1990</span>
      </div>
    </div>
    <div className="hero-var__brutalist-image">
      <img src={imgs.cockpit} alt="" />
    </div>
    <div className="hero-var__brutalist-cta">
      <Link to="/contact">GET IN TOUCH →</Link>
    </div>
  </section>
);

// ============================================
// 13. PARALLAX LAYERS
// Multi-layer depth effect
// ============================================
export const Hero13_ParallaxLayers = () => {
  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <section className="hero-var hero-var--parallax-layers">
      <div className="hero-var__layer hero-var__layer--bg" style={{ transform: `translateY(${scrollY * 0.5}px)` }}>
        <img src={imgs.sunset} alt="" />
      </div>
      <div className="hero-var__layer hero-var__layer--mid" style={{ transform: `translateY(${scrollY * 0.3}px)` }}>
        <div className="hero-var__parallax-shape"></div>
      </div>
      <div className="hero-var__layer hero-var__layer--front" style={{ transform: `translateY(${scrollY * 0.1}px)` }}>
        <h1 className="hero-var__headline--parallax">Experience Flight</h1>
        <p>Robinson Helicopter Specialists</p>
      </div>
    </section>
  );
};

// ============================================
// 14. DUOTONE
// Two-color image treatment
// ============================================
export const Hero14_Duotone = () => (
  <section className="hero-var hero-var--duotone">
    <div className="hero-var__duotone-bg">
      <img src={imgs.hangar} alt="" />
    </div>
    <div className="hero-var__duotone-content">
      <h1 className="hero-var__headline--duotone">HQ Aviation</h1>
      <p className="hero-var__duotone-sub">The Robinson Specialists</p>
      <div className="hero-var__duotone-stats">
        <div>35+ Years</div>
        <div>30+ Aircraft</div>
        <div>1000+ Pilots</div>
      </div>
    </div>
  </section>
);

// ============================================
// 15. TEXT MASK
// Image revealed through text
// ============================================
export const Hero15_TextMask = () => (
  <section className="hero-var hero-var--text-mask">
    <div className="hero-var__mask-bg">
      <img src={imgs.aerial} alt="" />
    </div>
    <h1 className="hero-var__headline--mask">FLIGHT</h1>
    <div className="hero-var__mask-footer">
      <span>HQ Aviation</span>
      <span>Robinson Specialists</span>
      <span>Since 1990</span>
    </div>
  </section>
);

// ============================================
// 16. FLOATING CARDS
// Multiple floating glass cards
// ============================================
export const Hero16_FloatingCards = () => (
  <section className="hero-var hero-var--floating">
    <div className="hero-var__bg">
      <img src={imgs.fleet} alt="" />
    </div>
    <div className="hero-var__overlay hero-var__overlay--soft"></div>
    <div className="hero-var__floating-cards">
      <div className="hero-var__floating-card hero-var__floating-card--main">
        <h1>HQ Aviation</h1>
        <p>Robinson Helicopter Specialists</p>
        <Link to="/contact">Contact Us →</Link>
      </div>
      <div className="hero-var__floating-card hero-var__floating-card--stat1">
        <strong>35+</strong>
        <span>Years</span>
      </div>
      <div className="hero-var__floating-card hero-var__floating-card--stat2">
        <strong>30+</strong>
        <span>Fleet</span>
      </div>
    </div>
  </section>
);

// ============================================
// 17. SCROLL PROMPT
// Bold with animated scroll cue
// ============================================
export const Hero17_ScrollPrompt = () => (
  <section className="hero-var hero-var--scroll-prompt">
    <div className="hero-var__bg">
      <img src={imgs.sunset} alt="" />
    </div>
    <div className="hero-var__overlay hero-var__overlay--gradient-up"></div>
    <div className="hero-var__scroll-content">
      <h1 className="hero-var__headline--scroll">Elevate</h1>
    </div>
    <div className="hero-var__scroll-indicator">
      <div className="hero-var__scroll-mouse">
        <div className="hero-var__scroll-wheel"></div>
      </div>
      <span>Scroll to Explore</span>
    </div>
  </section>
);

// ============================================
// 18. ORGANIC SHAPES
// Blob-like organic forms
// ============================================
export const Hero18_OrganicShapes = () => (
  <section className="hero-var hero-var--organic">
    <div className="hero-var__organic-blob hero-var__organic-blob--1"></div>
    <div className="hero-var__organic-blob hero-var__organic-blob--2"></div>
    <div className="hero-var__organic-blob hero-var__organic-blob--3"></div>
    <div className="hero-var__organic-content">
      <h1 className="hero-var__headline--organic">HQ Aviation</h1>
      <p>Robinson Helicopter Specialists</p>
      <Link to="/training" className="hero-var__btn--organic">Explore Training</Link>
    </div>
    <div className="hero-var__organic-image">
      <img src={imgs.cockpit} alt="" />
    </div>
  </section>
);

// ============================================
// 19. NOISE TEXTURE
// Subtle grain overlay
// ============================================
export const Hero19_NoiseTexture = () => (
  <section className="hero-var hero-var--noise">
    <div className="hero-var__noise-overlay"></div>
    <div className="hero-var__bg">
      <img src={imgs.hangar} alt="" />
    </div>
    <div className="hero-var__noise-content">
      <span className="hero-var__noise-tag">London, UK</span>
      <h1 className="hero-var__headline--noise">HQ<br/>Aviation</h1>
      <p className="hero-var__noise-sub">The Robinson Specialists</p>
    </div>
  </section>
);

// ============================================
// 20. ASYMMETRIC GRID
// Offset grid layout
// ============================================
export const Hero20_AsymmetricGrid = () => (
  <section className="hero-var hero-var--asymmetric">
    <div className="hero-var__asymmetric-left">
      <span className="hero-var__asymmetric-tag">Est. 1990</span>
      <h1 className="hero-var__headline--asymmetric">
        The Robinson Specialists
      </h1>
      <p className="hero-var__asymmetric-text">
        World-class helicopter training, sales, and maintenance at Denham Aerodrome.
      </p>
      <Link to="/training" className="hero-var__btn--asymmetric">Start Your Journey</Link>
    </div>
    <div className="hero-var__asymmetric-right">
      <div className="hero-var__asymmetric-image hero-var__asymmetric-image--1">
        <img src={imgs.cockpit} alt="" />
      </div>
      <div className="hero-var__asymmetric-image hero-var__asymmetric-image--2">
        <img src={imgs.fleet} alt="" />
      </div>
    </div>
  </section>
);

// ============================================
// 21. COUNTER ANIMATION
// Animated statistics
// ============================================
export const Hero21_CounterAnimation = () => {
  const [count, setCount] = useState({ years: 0, fleet: 0, pilots: 0 });

  useEffect(() => {
    const duration = 2000;
    const steps = 60;
    const interval = duration / steps;

    let step = 0;
    const timer = setInterval(() => {
      step++;
      const progress = step / steps;
      const eased = 1 - Math.pow(1 - progress, 3);

      setCount({
        years: Math.floor(35 * eased),
        fleet: Math.floor(30 * eased),
        pilots: Math.floor(1000 * eased),
      });

      if (step >= steps) clearInterval(timer);
    }, interval);

    return () => clearInterval(timer);
  }, []);

  return (
    <section className="hero-var hero-var--counter">
      <div className="hero-var__bg">
        <img src={imgs.aerial} alt="" />
      </div>
      <div className="hero-var__overlay hero-var__overlay--dark"></div>
      <div className="hero-var__counter-content">
        <h1 className="hero-var__headline--counter">HQ Aviation</h1>
        <div className="hero-var__counter-stats">
          <div className="hero-var__counter-stat">
            <span className="hero-var__counter-value">{count.years}+</span>
            <span className="hero-var__counter-label">Years</span>
          </div>
          <div className="hero-var__counter-stat">
            <span className="hero-var__counter-value">{count.fleet}+</span>
            <span className="hero-var__counter-label">Aircraft</span>
          </div>
          <div className="hero-var__counter-stat">
            <span className="hero-var__counter-value">{count.pilots}+</span>
            <span className="hero-var__counter-label">Pilots Trained</span>
          </div>
        </div>
      </div>
    </section>
  );
};

// ============================================
// 22. SPLIT SCREEN HOVER
// Two halves with hover reveal
// ============================================
export const Hero22_SplitHover = () => {
  const [hoverSide, setHoverSide] = useState(null);

  return (
    <section className="hero-var hero-var--split-hover">
      <div
        className={`hero-var__split-half hero-var__split-half--left ${hoverSide === 'left' ? 'active' : ''} ${hoverSide === 'right' ? 'inactive' : ''}`}
        onMouseEnter={() => setHoverSide('left')}
        onMouseLeave={() => setHoverSide(null)}
      >
        <img src={imgs.training} alt="" />
        <div className="hero-var__split-content">
          <h2>Training</h2>
          <p>From PPL to CPL</p>
          <Link to="/training">Explore →</Link>
        </div>
      </div>
      <div
        className={`hero-var__split-half hero-var__split-half--right ${hoverSide === 'right' ? 'active' : ''} ${hoverSide === 'left' ? 'inactive' : ''}`}
        onMouseEnter={() => setHoverSide('right')}
        onMouseLeave={() => setHoverSide(null)}
      >
        <img src={imgs.fleet} alt="" />
        <div className="hero-var__split-content">
          <h2>Sales</h2>
          <p>New & Pre-owned</p>
          <Link to="/aircraft-sales">View Fleet →</Link>
        </div>
      </div>
      <div className="hero-var__split-center">
        <span>HQ</span>
      </div>
    </section>
  );
};

// ============================================
// 23. STACKED PANELS
// Overlapping layered panels
// ============================================
export const Hero23_StackedPanels = () => (
  <section className="hero-var hero-var--stacked">
    <div className="hero-var__stacked-panel hero-var__stacked-panel--back">
      <img src={imgs.sunset} alt="" />
    </div>
    <div className="hero-var__stacked-panel hero-var__stacked-panel--mid"></div>
    <div className="hero-var__stacked-panel hero-var__stacked-panel--front">
      <div className="hero-var__stacked-content">
        <h1 className="hero-var__headline--stacked">HQ Aviation</h1>
        <p>Robinson Helicopter Specialists</p>
        <Link to="/contact" className="hero-var__btn--stacked">Contact Us</Link>
      </div>
    </div>
  </section>
);

// ============================================
// 24. MARQUEE
// Scrolling text banner
// ============================================
export const Hero24_Marquee = () => (
  <section className="hero-var hero-var--marquee">
    <div className="hero-var__bg">
      <img src={imgs.hangar} alt="" />
    </div>
    <div className="hero-var__overlay hero-var__overlay--heavy"></div>
    <div className="hero-var__marquee-track">
      <div className="hero-var__marquee-content">
        <span>TRAIN</span>
        <span className="hero-var__marquee-dot">●</span>
        <span>FLY</span>
        <span className="hero-var__marquee-dot">●</span>
        <span>EXCEL</span>
        <span className="hero-var__marquee-dot">●</span>
        <span>TRAIN</span>
        <span className="hero-var__marquee-dot">●</span>
        <span>FLY</span>
        <span className="hero-var__marquee-dot">●</span>
        <span>EXCEL</span>
        <span className="hero-var__marquee-dot">●</span>
      </div>
    </div>
    <div className="hero-var__marquee-center">
      <Link to="/training">Begin Your Journey</Link>
    </div>
  </section>
);

// ============================================
// 25. FOCUS RING
// Circular focus area
// ============================================
export const Hero25_FocusRing = () => (
  <section className="hero-var hero-var--focus-ring">
    <div className="hero-var__bg hero-var__bg--blur">
      <img src={imgs.aerial} alt="" />
    </div>
    <div className="hero-var__focus-circle">
      <img src={imgs.aerial} alt="" />
    </div>
    <div className="hero-var__focus-content">
      <h1 className="hero-var__headline--focus">HQ Aviation</h1>
      <p>The Robinson Specialists</p>
    </div>
    <div className="hero-var__focus-ring-border"></div>
  </section>
);

// ============================================
// 26. VERTICAL SCROLL
// Tall scrolling hero
// ============================================
export const Hero26_VerticalScroll = () => (
  <section className="hero-var hero-var--vertical">
    <div className="hero-var__vertical-sticky">
      <div className="hero-var__bg">
        <img src={imgs.sunset} alt="" />
      </div>
      <div className="hero-var__overlay hero-var__overlay--gradient"></div>
      <div className="hero-var__vertical-content">
        <h1 className="hero-var__headline--vertical">Elevate</h1>
        <p className="hero-var__vertical-sub">Your Journey Starts Here</p>
      </div>
      <div className="hero-var__vertical-scroll">
        <span>↓</span>
      </div>
    </div>
  </section>
);

// ============================================
// 27. SIDEBAR LAYOUT
// Side panel with content
// ============================================
export const Hero27_SidebarLayout = () => (
  <section className="hero-var hero-var--sidebar">
    <div className="hero-var__sidebar-panel">
      <div className="hero-var__sidebar-logo">HQ</div>
      <nav className="hero-var__sidebar-nav">
        <Link to="/training">Training</Link>
        <Link to="/aircraft-sales">Sales</Link>
        <Link to="/services">Services</Link>
        <Link to="/contact">Contact</Link>
      </nav>
      <div className="hero-var__sidebar-contact">
        <span>Denham Aerodrome</span>
        <span>+44 1234 567890</span>
      </div>
    </div>
    <div className="hero-var__sidebar-main">
      <img src={imgs.hangar} alt="" />
      <div className="hero-var__sidebar-overlay">
        <h1 className="hero-var__headline--sidebar">Robinson<br/>Specialists</h1>
        <Link to="/training" className="hero-var__btn--sidebar">Start Training</Link>
      </div>
    </div>
  </section>
);

// ============================================
// 28. TYPEWRITER
// Text typing animation
// ============================================
export const Hero28_Typewriter = () => {
  const [text, setText] = useState('');
  const fullText = 'The Robinson Specialists';

  useEffect(() => {
    let i = 0;
    const timer = setInterval(() => {
      if (i <= fullText.length) {
        setText(fullText.slice(0, i));
        i++;
      } else {
        clearInterval(timer);
      }
    }, 80);
    return () => clearInterval(timer);
  }, []);

  return (
    <section className="hero-var hero-var--typewriter">
      <div className="hero-var__bg">
        <img src={imgs.aerial} alt="" />
      </div>
      <div className="hero-var__overlay hero-var__overlay--dark"></div>
      <div className="hero-var__typewriter-content">
        <span className="hero-var__typewriter-pre">HQ Aviation</span>
        <h1 className="hero-var__headline--typewriter">
          {text}<span className="hero-var__typewriter-cursor">|</span>
        </h1>
      </div>
    </section>
  );
};

// ============================================
// 29. GEOMETRIC PATTERN
// Abstract geometric background
// ============================================
export const Hero29_GeometricPattern = () => (
  <section className="hero-var hero-var--geometric">
    <div className="hero-var__geometric-bg">
      <div className="hero-var__geometric-shape hero-var__geometric-shape--1"></div>
      <div className="hero-var__geometric-shape hero-var__geometric-shape--2"></div>
      <div className="hero-var__geometric-shape hero-var__geometric-shape--3"></div>
      <div className="hero-var__geometric-shape hero-var__geometric-shape--4"></div>
    </div>
    <div className="hero-var__geometric-content">
      <h1 className="hero-var__headline--geometric">HQ Aviation</h1>
      <p>Robinson Helicopter Specialists</p>
      <div className="hero-var__geometric-ctas">
        <Link to="/training">Training</Link>
        <Link to="/aircraft-sales">Sales</Link>
        <Link to="/services">Services</Link>
      </div>
    </div>
  </section>
);

// ============================================
// 30. REVEAL ON SCROLL
// Content reveals as you scroll
// ============================================
export const Hero30_RevealScroll = () => {
  const [scrollProgress, setScrollProgress] = useState(0);
  const sectionRef = useRef(null);

  useEffect(() => {
    const handleScroll = () => {
      if (sectionRef.current) {
        const rect = sectionRef.current.getBoundingClientRect();
        const progress = Math.min(1, Math.max(0, -rect.top / (rect.height * 0.5)));
        setScrollProgress(progress);
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <section className="hero-var hero-var--reveal" ref={sectionRef}>
      <div className="hero-var__reveal-sticky">
        <div
          className="hero-var__reveal-mask"
          style={{ clipPath: `circle(${20 + scrollProgress * 80}% at 50% 50%)` }}
        >
          <img src={imgs.sunset} alt="" />
        </div>
        <div className="hero-var__reveal-content" style={{ opacity: scrollProgress }}>
          <h1 className="hero-var__headline--reveal">Elevate Your Journey</h1>
          <p>HQ Aviation - Robinson Specialists</p>
        </div>
      </div>
    </section>
  );
};

// ============================================
// 31. AURORA GRADIENT
// Animated northern lights effect
// ============================================
export const Hero31_Aurora = () => (
  <section className="hero-var hero-var--aurora">
    <div className="hero-var__aurora-bg">
      <div className="hero-var__aurora-wave hero-var__aurora-wave--1"></div>
      <div className="hero-var__aurora-wave hero-var__aurora-wave--2"></div>
      <div className="hero-var__aurora-wave hero-var__aurora-wave--3"></div>
    </div>
    <div className="hero-var__aurora-content">
      <span className="hero-var__aurora-tag">Experience Excellence</span>
      <h1 className="hero-var__headline--aurora">HQ Aviation</h1>
      <p className="hero-var__aurora-sub">Where dreams take flight</p>
      <Link to="/training" className="hero-var__btn--aurora">Begin Your Journey</Link>
    </div>
  </section>
);

// ============================================
// 32. NEON GLOW
// Cyberpunk-inspired neon aesthetic
// ============================================
export const Hero32_NeonGlow = () => (
  <section className="hero-var hero-var--neon">
    <div className="hero-var__neon-grid"></div>
    <div className="hero-var__neon-content">
      <h1 className="hero-var__headline--neon">
        <span className="hero-var__neon-text" data-text="HQ">HQ</span>
        <span className="hero-var__neon-text hero-var__neon-text--accent" data-text="Aviation">Aviation</span>
      </h1>
      <p className="hero-var__neon-tagline">Robinson Helicopter Specialists</p>
      <div className="hero-var__neon-ctas">
        <Link to="/training" className="hero-var__btn--neon">Train</Link>
        <Link to="/aircraft-sales" className="hero-var__btn--neon hero-var__btn--neon-alt">Fly</Link>
      </div>
    </div>
    <div className="hero-var__neon-scanline"></div>
  </section>
);

// ============================================
// 33. 3D PERSPECTIVE TILT
// Cards with 3D hover effect
// ============================================
export const Hero33_PerspectiveTilt = () => {
  const [tilt, setTilt] = useState({ x: 0, y: 0 });
  const cardRef = useRef(null);

  const handleMouseMove = (e) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    setTilt({ x: y * 20, y: x * -20 });
  };

  const handleMouseLeave = () => setTilt({ x: 0, y: 0 });

  return (
    <section className="hero-var hero-var--perspective">
      <div className="hero-var__perspective-bg">
        <img src={imgs.aerial} alt="" />
      </div>
      <div
        ref={cardRef}
        className="hero-var__perspective-card"
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        style={{ transform: `perspective(1000px) rotateX(${tilt.x}deg) rotateY(${tilt.y}deg)` }}
      >
        <div className="hero-var__perspective-shine" style={{ background: `radial-gradient(circle at ${50 + tilt.y * 2}% ${50 + tilt.x * 2}%, rgba(255,255,255,0.3), transparent 50%)` }}></div>
        <span className="hero-var__perspective-badge">Est. 1990</span>
        <h1 className="hero-var__headline--perspective">HQ Aviation</h1>
        <p>The Robinson Specialists</p>
        <Link to="/contact" className="hero-var__btn--perspective">Get in Touch</Link>
      </div>
    </section>
  );
};

// ============================================
// 34. NEWSPAPER EDITORIAL
// Classic broadsheet newspaper layout
// ============================================
export const Hero34_Newspaper = () => (
  <section className="hero-var hero-var--newspaper">
    <div className="hero-var__newspaper-header">
      <div className="hero-var__newspaper-date">Monday, February 10, 2025</div>
      <h1 className="hero-var__newspaper-masthead">HQ AVIATION</h1>
      <div className="hero-var__newspaper-edition">The Robinson Specialists • Denham Aerodrome</div>
    </div>
    <div className="hero-var__newspaper-rule"></div>
    <div className="hero-var__newspaper-grid">
      <div className="hero-var__newspaper-main">
        <h2 className="hero-var__newspaper-headline">World-Class Helicopter Training Takes Flight at Denham</h2>
        <div className="hero-var__newspaper-byline">By the HQ Aviation Team</div>
        <p className="hero-var__newspaper-lead">From discovery flights to commercial licenses, HQ Aviation continues to set the standard for Robinson helicopter excellence in the United Kingdom.</p>
        <Link to="/training" className="hero-var__newspaper-link">Continue Reading →</Link>
      </div>
      <div className="hero-var__newspaper-image">
        <img src={imgs.hangar} alt="" />
        <span className="hero-var__newspaper-caption">The HQ Aviation hangar at Denham Aerodrome</span>
      </div>
    </div>
  </section>
);

// ============================================
// 35. SPOTLIGHT CURSOR
// Dramatic spotlight follows mouse
// ============================================
export const Hero35_Spotlight = () => {
  const [pos, setPos] = useState({ x: 50, y: 50 });

  const handleMouseMove = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    setPos({
      x: ((e.clientX - rect.left) / rect.width) * 100,
      y: ((e.clientY - rect.top) / rect.height) * 100,
    });
  };

  return (
    <section className="hero-var hero-var--spotlight" onMouseMove={handleMouseMove}>
      <div className="hero-var__spotlight-bg">
        <img src={imgs.fleet} alt="" />
      </div>
      <div
        className="hero-var__spotlight-mask"
        style={{ background: `radial-gradient(circle 200px at ${pos.x}% ${pos.y}%, transparent 0%, rgba(0,0,0,0.85) 100%)` }}
      ></div>
      <div className="hero-var__spotlight-content">
        <h1 className="hero-var__headline--spotlight">Discover Flight</h1>
        <p>Move your cursor to explore</p>
      </div>
      <div className="hero-var__spotlight-cta">
        <Link to="/training">Start Your Journey →</Link>
      </div>
    </section>
  );
};

// ============================================
// 36. VINTAGE FILM
// Retro film aesthetic with grain
// ============================================
export const Hero36_VintageFilm = () => (
  <section className="hero-var hero-var--vintage">
    <div className="hero-var__vintage-bg">
      <img src={imgs.sunset} alt="" />
    </div>
    <div className="hero-var__vintage-grain"></div>
    <div className="hero-var__vintage-vignette"></div>
    <div className="hero-var__vintage-scratches"></div>
    <div className="hero-var__vintage-content">
      <div className="hero-var__vintage-frame">
        <span className="hero-var__vintage-corner hero-var__vintage-corner--tl"></span>
        <span className="hero-var__vintage-corner hero-var__vintage-corner--tr"></span>
        <span className="hero-var__vintage-corner hero-var__vintage-corner--bl"></span>
        <span className="hero-var__vintage-corner hero-var__vintage-corner--br"></span>
        <span className="hero-var__vintage-label">Since 1990</span>
        <h1 className="hero-var__headline--vintage">HQ Aviation</h1>
        <p className="hero-var__vintage-sub">A Legacy of Excellence</p>
      </div>
    </div>
  </section>
);

// ============================================
// 37. HOLOGRAPHIC
// Iridescent holographic effect
// ============================================
export const Hero37_Holographic = () => (
  <section className="hero-var hero-var--holographic">
    <div className="hero-var__holo-bg"></div>
    <div className="hero-var__holo-card">
      <div className="hero-var__holo-shimmer"></div>
      <div className="hero-var__holo-content">
        <div className="hero-var__holo-logo">HQ</div>
        <h1 className="hero-var__headline--holo">Aviation</h1>
        <p className="hero-var__holo-tagline">Robinson Helicopter Specialists</p>
        <div className="hero-var__holo-stats">
          <div><strong>35+</strong><span>Years</span></div>
          <div><strong>30+</strong><span>Fleet</span></div>
          <div><strong>1000+</strong><span>Pilots</span></div>
        </div>
      </div>
    </div>
  </section>
);

// ============================================
// 38. COLOR BLOCKS
// Bold Mondrian-inspired color blocking
// ============================================
export const Hero38_ColorBlocks = () => (
  <section className="hero-var hero-var--colorblocks">
    <div className="hero-var__colorblocks-grid">
      <div className="hero-var__colorblock hero-var__colorblock--main">
        <h1 className="hero-var__headline--colorblock">HQ</h1>
      </div>
      <div className="hero-var__colorblock hero-var__colorblock--accent">
        <span>Aviation</span>
      </div>
      <div className="hero-var__colorblock hero-var__colorblock--image">
        <img src={imgs.cockpit} alt="" />
      </div>
      <div className="hero-var__colorblock hero-var__colorblock--cta">
        <Link to="/training">Start Training</Link>
      </div>
      <div className="hero-var__colorblock hero-var__colorblock--info">
        <p>Robinson Helicopter Specialists since 1990</p>
      </div>
      <div className="hero-var__colorblock hero-var__colorblock--dark"></div>
    </div>
  </section>
);

// ============================================
// 39. LAYERED PAPER
// Stacked paper card effect
// ============================================
export const Hero39_LayeredPaper = () => (
  <section className="hero-var hero-var--paper">
    <div className="hero-var__paper-stack">
      <div className="hero-var__paper-layer hero-var__paper-layer--3"></div>
      <div className="hero-var__paper-layer hero-var__paper-layer--2"></div>
      <div className="hero-var__paper-layer hero-var__paper-layer--1">
        <div className="hero-var__paper-content">
          <div className="hero-var__paper-stamp">EST. 1990</div>
          <h1 className="hero-var__headline--paper">HQ Aviation</h1>
          <div className="hero-var__paper-divider"></div>
          <p className="hero-var__paper-tagline">The Robinson Specialists</p>
          <p className="hero-var__paper-desc">World-class helicopter training, sales, and maintenance at Denham Aerodrome.</p>
          <Link to="/contact" className="hero-var__btn--paper">Contact Us</Link>
        </div>
      </div>
    </div>
  </section>
);

// ============================================
// 40. SPLIT CURTAIN REVEAL
// Two panels reveal content
// ============================================
export const Hero40_CurtainReveal = () => {
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setIsOpen(true), 500);
    return () => clearTimeout(timer);
  }, []);

  return (
    <section className="hero-var hero-var--curtain">
      <div className="hero-var__curtain-bg">
        <img src={imgs.aerial} alt="" />
      </div>
      <div className="hero-var__curtain-content">
        <h1 className="hero-var__headline--curtain">HQ Aviation</h1>
        <p>Robinson Helicopter Specialists</p>
        <Link to="/training" className="hero-var__btn--curtain">Explore</Link>
      </div>
      <div className={`hero-var__curtain-panel hero-var__curtain-panel--left ${isOpen ? 'open' : ''}`}></div>
      <div className={`hero-var__curtain-panel hero-var__curtain-panel--right ${isOpen ? 'open' : ''}`}></div>
    </section>
  );
};

// ============================================
// 41. ANIMATED BORDER
// Pulsing border animation
// ============================================
export const Hero41_AnimatedBorder = () => (
  <section className="hero-var hero-var--animated-border">
    <div className="hero-var__border-bg">
      <img src={imgs.hangar} alt="" />
    </div>
    <div className="hero-var__border-overlay"></div>
    <div className="hero-var__border-frame">
      <div className="hero-var__border-line hero-var__border-line--top"></div>
      <div className="hero-var__border-line hero-var__border-line--right"></div>
      <div className="hero-var__border-line hero-var__border-line--bottom"></div>
      <div className="hero-var__border-line hero-var__border-line--left"></div>
      <div className="hero-var__border-content">
        <span className="hero-var__border-tag">Denham Aerodrome</span>
        <h1 className="hero-var__headline--border">HQ Aviation</h1>
        <p className="hero-var__border-sub">The Robinson Specialists</p>
        <Link to="/contact" className="hero-var__btn--border">Get Started</Link>
      </div>
    </div>
  </section>
);

// ============================================
// 42. TEXT SCRAMBLE
// Characters scramble before revealing
// ============================================
export const Hero42_TextScramble = () => {
  const [text, setText] = useState('');
  const targetText = 'HQ AVIATION';
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';

  useEffect(() => {
    let iteration = 0;
    const interval = setInterval(() => {
      setText(
        targetText
          .split('')
          .map((char, index) => {
            if (char === ' ') return ' ';
            if (index < iteration) return targetText[index];
            return chars[Math.floor(Math.random() * chars.length)];
          })
          .join('')
      );
      iteration += 0.5;
      if (iteration >= targetText.length) clearInterval(interval);
    }, 50);
    return () => clearInterval(interval);
  }, []);

  return (
    <section className="hero-var hero-var--scramble">
      <div className="hero-var__bg">
        <img src={imgs.sunset} alt="" />
      </div>
      <div className="hero-var__overlay hero-var__overlay--dark"></div>
      <div className="hero-var__scramble-content">
        <h1 className="hero-var__headline--scramble">{text || 'HQ AVIATION'}</h1>
        <p className="hero-var__scramble-sub">Robinson Helicopter Specialists</p>
        <Link to="/training" className="hero-var__btn--scramble">Begin Training</Link>
      </div>
    </section>
  );
};

// ============================================
// 43. MONO SANS
// Ultra-minimal monospace aesthetic
// ============================================
export const Hero43_MonoSans = () => (
  <section className="hero-var hero-var--mono">
    <div className="hero-var__mono-container">
      <div className="hero-var__mono-header">
        <span>01</span>
        <span>HQ_AVIATION</span>
        <span>2025</span>
      </div>
      <div className="hero-var__mono-main">
        <h1 className="hero-var__headline--mono">
          THE<br/>ROBINSON<br/>SPECIALISTS
        </h1>
      </div>
      <div className="hero-var__mono-footer">
        <div className="hero-var__mono-info">
          <span>LOCATION</span>
          <span>DENHAM AERODROME, UK</span>
        </div>
        <div className="hero-var__mono-info">
          <span>ESTABLISHED</span>
          <span>1990</span>
        </div>
        <Link to="/contact" className="hero-var__mono-cta">CONTACT →</Link>
      </div>
    </div>
  </section>
);

// ============================================
// 44. PHOTO MOSAIC
// Creative photo grid arrangement
// ============================================
export const Hero44_PhotoMosaic = () => (
  <section className="hero-var hero-var--mosaic">
    <div className="hero-var__mosaic-grid">
      <div className="hero-var__mosaic-cell hero-var__mosaic-cell--1">
        <img src={imgs.hangar} alt="" />
      </div>
      <div className="hero-var__mosaic-cell hero-var__mosaic-cell--2">
        <img src={imgs.cockpit} alt="" />
      </div>
      <div className="hero-var__mosaic-cell hero-var__mosaic-cell--3">
        <img src={imgs.aerial} alt="" />
      </div>
      <div className="hero-var__mosaic-cell hero-var__mosaic-cell--text">
        <h1>HQ</h1>
        <span>Aviation</span>
      </div>
      <div className="hero-var__mosaic-cell hero-var__mosaic-cell--4">
        <img src={imgs.fleet} alt="" />
      </div>
      <div className="hero-var__mosaic-cell hero-var__mosaic-cell--cta">
        <Link to="/training">Start Your Journey</Link>
      </div>
    </div>
  </section>
);

// ============================================
// 45. GRADIENT TEXT
// Large text with animated gradient fill
// ============================================
export const Hero45_GradientText = () => (
  <section className="hero-var hero-var--gradient-text">
    <div className="hero-var__gradient-text-bg"></div>
    <div className="hero-var__gradient-text-content">
      <h1 className="hero-var__headline--gradient-text">ELEVATE</h1>
      <p className="hero-var__gradient-text-sub">HQ Aviation • Robinson Specialists</p>
      <div className="hero-var__gradient-text-ctas">
        <Link to="/training">Training</Link>
        <Link to="/aircraft-sales">Sales</Link>
        <Link to="/services">Services</Link>
      </div>
    </div>
  </section>
);

// ============================================
// 46. ROTATED GRID
// Angled grid layout
// ============================================
export const Hero46_RotatedGrid = () => (
  <section className="hero-var hero-var--rotated">
    <div className="hero-var__rotated-bg">
      <div className="hero-var__rotated-image">
        <img src={imgs.sunset} alt="" />
      </div>
    </div>
    <div className="hero-var__rotated-overlay"></div>
    <div className="hero-var__rotated-content">
      <div className="hero-var__rotated-card">
        <span className="hero-var__rotated-tag">Since 1990</span>
        <h1 className="hero-var__headline--rotated">HQ Aviation</h1>
        <p>The Robinson Specialists</p>
        <Link to="/contact" className="hero-var__btn--rotated">Get Started</Link>
      </div>
    </div>
  </section>
);

// ============================================
// 47. FLOATING ELEMENTS
// Multiple floating UI elements
// ============================================
export const Hero47_FloatingElements = () => (
  <section className="hero-var hero-var--floating-elements">
    <div className="hero-var__bg">
      <img src={imgs.aerial} alt="" />
    </div>
    <div className="hero-var__overlay hero-var__overlay--soft"></div>
    <div className="hero-var__floating-el hero-var__floating-el--1">Training</div>
    <div className="hero-var__floating-el hero-var__floating-el--2">Sales</div>
    <div className="hero-var__floating-el hero-var__floating-el--3">35+ Years</div>
    <div className="hero-var__floating-el hero-var__floating-el--4">Denham</div>
    <div className="hero-var__floating-el hero-var__floating-el--5">Robinson</div>
    <div className="hero-var__floating-main">
      <h1 className="hero-var__headline--floating-el">HQ Aviation</h1>
      <Link to="/contact" className="hero-var__btn--floating-el">Explore</Link>
    </div>
  </section>
);

// ============================================
// 48. CLIP PATH REVEAL
// Creative clip-path shape reveal
// ============================================
export const Hero48_ClipPathReveal = () => {
  const [revealed, setRevealed] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setRevealed(true), 300);
    return () => clearTimeout(timer);
  }, []);

  return (
    <section className="hero-var hero-var--clippath">
      <div className="hero-var__clippath-bg">
        <img src={imgs.hangar} alt="" />
      </div>
      <div className={`hero-var__clippath-reveal ${revealed ? 'revealed' : ''}`}>
        <img src={imgs.sunset} alt="" />
      </div>
      <div className="hero-var__clippath-content">
        <h1 className="hero-var__headline--clippath">HQ Aviation</h1>
        <p>The Robinson Specialists</p>
      </div>
    </section>
  );
};

// ============================================
// 49. PARTICLE DOTS
// Animated dot pattern background
// ============================================
export const Hero49_ParticleDots = () => (
  <section className="hero-var hero-var--particles">
    <div className="hero-var__particles-bg">
      {[...Array(50)].map((_, i) => (
        <div
          key={i}
          className="hero-var__particle"
          style={{
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
            animationDelay: `${Math.random() * 5}s`,
            animationDuration: `${3 + Math.random() * 4}s`,
          }}
        ></div>
      ))}
    </div>
    <div className="hero-var__particles-content">
      <span className="hero-var__particles-tag">Est. 1990</span>
      <h1 className="hero-var__headline--particles">HQ Aviation</h1>
      <p className="hero-var__particles-sub">Robinson Helicopter Specialists</p>
      <Link to="/training" className="hero-var__btn--particles">Start Training</Link>
    </div>
  </section>
);

// ============================================
// 50. HORIZONTAL SCROLL
// Side-scrolling hero panels
// ============================================
export const Hero50_HorizontalScroll = () => (
  <section className="hero-var hero-var--horizontal">
    <div className="hero-var__horizontal-track">
      <div className="hero-var__horizontal-panel hero-var__horizontal-panel--intro">
        <h1>HQ Aviation</h1>
        <p>Scroll horizontally →</p>
      </div>
      <div className="hero-var__horizontal-panel hero-var__horizontal-panel--image">
        <img src={imgs.hangar} alt="" />
        <span>Our Facility</span>
      </div>
      <div className="hero-var__horizontal-panel hero-var__horizontal-panel--image">
        <img src={imgs.fleet} alt="" />
        <span>The Fleet</span>
      </div>
      <div className="hero-var__horizontal-panel hero-var__horizontal-panel--cta">
        <h2>Ready to Fly?</h2>
        <Link to="/training">Start Training</Link>
      </div>
    </div>
  </section>
);

// ============================================
// 51. SPLIT PERSONALITY
// Day/Night toggle split
// ============================================
export const Hero51_SplitPersonality = () => {
  const [isDark, setIsDark] = useState(false);

  return (
    <section className={`hero-var hero-var--personality ${isDark ? 'dark' : 'light'}`}>
      <div className="hero-var__personality-bg hero-var__personality-bg--light">
        <img src={imgs.fleet} alt="" />
      </div>
      <div className="hero-var__personality-bg hero-var__personality-bg--dark">
        <img src={imgs.sunset} alt="" />
      </div>
      <div className="hero-var__personality-content">
        <h1 className="hero-var__headline--personality">HQ Aviation</h1>
        <p>The Robinson Specialists</p>
        <button className="hero-var__personality-toggle" onClick={() => setIsDark(!isDark)}>
          {isDark ? '☀️ Light' : '🌙 Dark'}
        </button>
      </div>
    </section>
  );
};

// ============================================
// 52. STICKY CARDS STACK
// Cards stack on scroll
// ============================================
export const Hero52_StickyStack = () => (
  <section className="hero-var hero-var--sticky-stack">
    <div className="hero-var__sticky-card hero-var__sticky-card--1">
      <h1>HQ Aviation</h1>
      <p>The Robinson Specialists</p>
    </div>
    <div className="hero-var__sticky-card hero-var__sticky-card--2">
      <img src={imgs.hangar} alt="" />
      <span>World-Class Facility</span>
    </div>
    <div className="hero-var__sticky-card hero-var__sticky-card--3">
      <img src={imgs.fleet} alt="" />
      <span>Premium Fleet</span>
    </div>
    <div className="hero-var__sticky-card hero-var__sticky-card--4">
      <h2>Ready to Start?</h2>
      <Link to="/training">Begin Training →</Link>
    </div>
  </section>
);

// ============================================
// 53. OUTLINE TEXT
// Large outlined typography
// ============================================
export const Hero53_OutlineText = () => (
  <section className="hero-var hero-var--outline">
    <div className="hero-var__bg">
      <img src={imgs.aerial} alt="" />
    </div>
    <div className="hero-var__overlay hero-var__overlay--dark"></div>
    <div className="hero-var__outline-content">
      <h1 className="hero-var__headline--outline">
        <span className="hero-var__outline-stroke">HQ</span>
        <span className="hero-var__outline-fill">Aviation</span>
      </h1>
      <p className="hero-var__outline-sub">Robinson Helicopter Specialists Since 1990</p>
      <Link to="/contact" className="hero-var__btn--outline">Contact Us</Link>
    </div>
  </section>
);

// ============================================
// 54. MORPHING SHAPES
// Animated morphing background shapes
// ============================================
export const Hero54_MorphingShapes = () => (
  <section className="hero-var hero-var--morphing">
    <div className="hero-var__morphing-bg">
      <svg viewBox="0 0 500 500" className="hero-var__morphing-blob">
        <path>
          <animate
            attributeName="d"
            dur="10s"
            repeatCount="indefinite"
            values="M440.5,320.5Q418,391,355.5,442.5Q293,494,226,450.5Q159,407,99,339Q39,271,49.5,192.5Q60,114,125,72.5Q190,31,265.5,35.5Q341,40,396,94.5Q451,149,462,224.5Q473,300,440.5,320.5Z;
                    M453.5,320Q415,390,351,436Q287,482,218.5,457Q150,432,102,366Q54,300,60,225Q66,150,120,94Q174,38,251,36Q328,34,386.5,88.5Q445,143,470,221.5Q495,300,453.5,320Z;
                    M440.5,320.5Q418,391,355.5,442.5Q293,494,226,450.5Q159,407,99,339Q39,271,49.5,192.5Q60,114,125,72.5Q190,31,265.5,35.5Q341,40,396,94.5Q451,149,462,224.5Q473,300,440.5,320.5Z"
          />
        </path>
      </svg>
      <svg viewBox="0 0 500 500" className="hero-var__morphing-blob hero-var__morphing-blob--2">
        <path>
          <animate
            attributeName="d"
            dur="12s"
            repeatCount="indefinite"
            values="M384,302Q365,354,320.5,389.5Q276,425,213.5,424Q151,423,110,370Q69,317,60.5,245.5Q52,174,106,126.5Q160,79,232.5,54Q305,29,361.5,82.5Q418,136,418,218Q418,300,384,302Z;
                    M412.5,298.5Q388,347,347.5,384.5Q307,422,239,435.5Q171,449,121,393.5Q71,338,52.5,262.5Q34,187,87.5,130.5Q141,74,218,50Q295,26,358,73.5Q421,121,430.5,185.5Q440,250,412.5,298.5Z;
                    M384,302Q365,354,320.5,389.5Q276,425,213.5,424Q151,423,110,370Q69,317,60.5,245.5Q52,174,106,126.5Q160,79,232.5,54Q305,29,361.5,82.5Q418,136,418,218Q418,300,384,302Z"
          />
        </path>
      </svg>
    </div>
    <div className="hero-var__morphing-content">
      <h1 className="hero-var__headline--morphing">HQ Aviation</h1>
      <p>The Robinson Specialists</p>
      <Link to="/training" className="hero-var__btn--morphing">Start Training</Link>
    </div>
  </section>
);

// ============================================
// 55. VIDEO HERO
// Video background with overlay
// ============================================
export const Hero55_VideoHero = () => (
  <section className="hero-var hero-var--video">
    <div className="hero-var__video-bg">
      <img src={imgs.aerial} alt="" className="hero-var__video-fallback" />
    </div>
    <div className="hero-var__video-overlay"></div>
    <div className="hero-var__video-content">
      <div className="hero-var__video-play">
        <span>▶</span>
      </div>
      <h1 className="hero-var__headline--video">Experience Flight</h1>
      <p className="hero-var__video-sub">HQ Aviation • Robinson Specialists</p>
    </div>
    <div className="hero-var__video-controls">
      <span>00:00</span>
      <div className="hero-var__video-progress"></div>
      <span>02:30</span>
    </div>
  </section>
);

// ============================================
// 56. PRICE TAG
// E-commerce inspired hero
// ============================================
export const Hero56_PriceTag = () => (
  <section className="hero-var hero-var--pricetag">
    <div className="hero-var__pricetag-grid">
      <div className="hero-var__pricetag-main">
        <span className="hero-var__pricetag-category">Training</span>
        <h1 className="hero-var__headline--pricetag">Private Pilot License</h1>
        <p className="hero-var__pricetag-desc">Complete your PPL(H) training with the UK's leading Robinson specialists.</p>
        <div className="hero-var__pricetag-price">
          <span className="hero-var__pricetag-from">from</span>
          <span className="hero-var__pricetag-amount">£175</span>
          <span className="hero-var__pricetag-unit">/hour</span>
        </div>
        <Link to="/training" className="hero-var__btn--pricetag">Book Now</Link>
      </div>
      <div className="hero-var__pricetag-image">
        <img src={imgs.training} alt="" />
        <div className="hero-var__pricetag-badge">Popular</div>
      </div>
    </div>
  </section>
);

// ============================================
// 57. COMPARISON SLIDER
// Before/after comparison effect
// ============================================
export const Hero57_ComparisonSlider = () => {
  const [sliderPos, setSliderPos] = useState(50);

  const handleMove = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    setSliderPos(Math.min(95, Math.max(5, x)));
  };

  return (
    <section className="hero-var hero-var--comparison" onMouseMove={handleMove}>
      <div className="hero-var__comparison-before">
        <img src={imgs.hangar} alt="" />
        <span className="hero-var__comparison-label">Our Facility</span>
      </div>
      <div className="hero-var__comparison-after" style={{ clipPath: `inset(0 ${100 - sliderPos}% 0 0)` }}>
        <img src={imgs.fleet} alt="" />
        <span className="hero-var__comparison-label">Our Fleet</span>
      </div>
      <div className="hero-var__comparison-slider" style={{ left: `${sliderPos}%` }}>
        <div className="hero-var__comparison-handle"></div>
      </div>
      <div className="hero-var__comparison-content">
        <h1 className="hero-var__headline--comparison">HQ Aviation</h1>
      </div>
    </section>
  );
};

// ============================================
// 58. MAGAZINE COVER
// Fashion magazine cover style
// ============================================
export const Hero58_MagazineCover = () => (
  <section className="hero-var hero-var--magazine">
    <div className="hero-var__magazine-bg">
      <img src={imgs.cockpit} alt="" />
    </div>
    <div className="hero-var__magazine-overlay"></div>
    <div className="hero-var__magazine-masthead">HQ</div>
    <div className="hero-var__magazine-content">
      <div className="hero-var__magazine-headline">
        <span className="hero-var__magazine-kicker">The Ultimate Guide to</span>
        <h1>Helicopter Flight</h1>
      </div>
      <div className="hero-var__magazine-features">
        <span>35+ Years of Excellence</span>
        <span>Robinson Specialists</span>
        <span>World-Class Training</span>
      </div>
    </div>
    <div className="hero-var__magazine-barcode">
      <div className="hero-var__magazine-bars"></div>
      <span>Feb 2025 | £9.99</span>
    </div>
  </section>
);

// ============================================
// 59. TERMINAL
// Developer/hacker aesthetic
// ============================================
export const Hero59_Terminal = () => {
  const [lines, setLines] = useState([]);
  const terminalLines = [
    '> Initializing HQ Aviation...',
    '> Loading Robinson database...',
    '> Connecting to Denham Aerodrome...',
    '> System ready.',
    '',
    '  ╦ ╦╔═╗  ╔═╗╦  ╦╦╔═╗╔╦╗╦╔═╗╔╗╔',
    '  ╠═╣║═╬╗ ╠═╣╚╗╔╝║╠═╣ ║ ║║ ║║║║',
    '  ╩ ╩╚═╝╚ ╩ ╩ ╚╝ ╩╩ ╩ ╩ ╩╚═╝╝╚╝',
    '',
    '> The Robinson Specialists',
    '> Type "start" to begin training_',
  ];

  useEffect(() => {
    let i = 0;
    const timer = setInterval(() => {
      if (i < terminalLines.length) {
        setLines(prev => [...prev, terminalLines[i]]);
        i++;
      } else {
        clearInterval(timer);
      }
    }, 200);
    return () => clearInterval(timer);
  }, []);

  return (
    <section className="hero-var hero-var--terminal">
      <div className="hero-var__terminal-window">
        <div className="hero-var__terminal-header">
          <span className="hero-var__terminal-dot hero-var__terminal-dot--red"></span>
          <span className="hero-var__terminal-dot hero-var__terminal-dot--yellow"></span>
          <span className="hero-var__terminal-dot hero-var__terminal-dot--green"></span>
          <span className="hero-var__terminal-title">hq-aviation — bash</span>
        </div>
        <div className="hero-var__terminal-body">
          {lines.map((line, i) => (
            <div key={i} className="hero-var__terminal-line">{line}</div>
          ))}
          <span className="hero-var__terminal-cursor"></span>
        </div>
      </div>
      <Link to="/training" className="hero-var__btn--terminal">$ start</Link>
    </section>
  );
};

// ============================================
// 60. LUXURY BRAND
// High-end luxury brand aesthetic
// ============================================
export const Hero60_LuxuryBrand = () => (
  <section className="hero-var hero-var--luxury">
    <div className="hero-var__luxury-bg">
      <img src={imgs.sunset} alt="" />
    </div>
    <div className="hero-var__luxury-overlay"></div>
    <div className="hero-var__luxury-frame">
      <div className="hero-var__luxury-corner hero-var__luxury-corner--tl"></div>
      <div className="hero-var__luxury-corner hero-var__luxury-corner--tr"></div>
      <div className="hero-var__luxury-corner hero-var__luxury-corner--bl"></div>
      <div className="hero-var__luxury-corner hero-var__luxury-corner--br"></div>
    </div>
    <div className="hero-var__luxury-content">
      <div className="hero-var__luxury-crest">
        <span>EST.</span>
        <span className="hero-var__luxury-year">1990</span>
      </div>
      <h1 className="hero-var__headline--luxury">HQ Aviation</h1>
      <div className="hero-var__luxury-divider">
        <span></span>
        <span>★</span>
        <span></span>
      </div>
      <p className="hero-var__luxury-tagline">The Robinson Specialists</p>
      <Link to="/contact" className="hero-var__btn--luxury">Book a Consultation</Link>
    </div>
  </section>
);

// ============================================
// 61. ZEN MINIMAL (Japanese Wabi-Sabi)
// Asymmetric balance, muted earth tones, serene
// ============================================
export const Hero61_ZenMinimal = () => (
  <section className="hero-var hero-var--zen">
    <div className="hero-var__zen-bg"></div>
    <div className="hero-var__zen-brush hero-var__zen-brush--1"></div>
    <div className="hero-var__zen-brush hero-var__zen-brush--2"></div>
    <div className="hero-var__zen-grid">
      <div className="hero-var__zen-left">
        <div className="hero-var__zen-vertical">飛行</div>
      </div>
      <div className="hero-var__zen-center">
        <div className="hero-var__zen-circle"></div>
        <span className="hero-var__zen-label">空の道</span>
        <h1 className="hero-var__headline--zen">
          <span>The Way</span>
          <span>of Flight</span>
        </h1>
        <p className="hero-var__zen-philosophy">
          "In stillness, we find the path to the sky"
        </p>
        <div className="hero-var__zen-divider">
          <span></span>
          <span className="hero-var__zen-kanji">和</span>
          <span></span>
        </div>
        <Link to="/training" className="hero-var__btn--zen">Begin Journey</Link>
      </div>
      <div className="hero-var__zen-right">
        <div className="hero-var__zen-stats">
          <div>
            <span className="hero-var__zen-stat-num">三十五</span>
            <span className="hero-var__zen-stat-label">Years</span>
          </div>
          <div>
            <span className="hero-var__zen-stat-num">千</span>
            <span className="hero-var__zen-stat-label">Pilots</span>
          </div>
        </div>
      </div>
    </div>
    <div className="hero-var__zen-footer">
      <span>Denham Aerodrome</span>
      <span>•</span>
      <span>Est. 1990</span>
    </div>
  </section>
);

// ============================================
// 62. SWISS PRECISION (Bauhaus/International)
// Strict grid, geometric, primary colors
// ============================================
export const Hero62_SwissPrecision = () => (
  <section className="hero-var hero-var--swiss">
    <div className="hero-var__swiss-grid">
      <div className="hero-var__swiss-cell hero-var__swiss-cell--red"></div>
      <div className="hero-var__swiss-cell hero-var__swiss-cell--content">
        <div className="hero-var__swiss-header">
          <span className="hero-var__swiss-logo">HQ</span>
          <span className="hero-var__swiss-year">1990</span>
        </div>
        <h1 className="hero-var__headline--swiss">
          AVIATION
        </h1>
        <div className="hero-var__swiss-rule"></div>
        <p className="hero-var__swiss-sub">
          Helicopter Training & Sales
        </p>
        <div className="hero-var__swiss-data">
          <div className="hero-var__swiss-data-item">
            <span className="hero-var__swiss-data-num">35</span>
            <span className="hero-var__swiss-data-label">Jahre</span>
          </div>
          <div className="hero-var__swiss-data-item">
            <span className="hero-var__swiss-data-num">30+</span>
            <span className="hero-var__swiss-data-label">Flotte</span>
          </div>
          <div className="hero-var__swiss-data-item">
            <span className="hero-var__swiss-data-num">1K</span>
            <span className="hero-var__swiss-data-label">Piloten</span>
          </div>
        </div>
      </div>
      <div className="hero-var__swiss-cell hero-var__swiss-cell--blue">
        <div className="hero-var__swiss-circle"></div>
      </div>
      <div className="hero-var__swiss-cell hero-var__swiss-cell--image">
        <img src={imgs.cockpit} alt="" />
      </div>
      <div className="hero-var__swiss-cell hero-var__swiss-cell--yellow">
        <Link to="/contact" className="hero-var__btn--swiss">
          <span>Kontakt</span>
          <span className="hero-var__swiss-arrow">→</span>
        </Link>
      </div>
      <div className="hero-var__swiss-cell hero-var__swiss-cell--black">
        <span className="hero-var__swiss-coords">51°N 0°W</span>
      </div>
    </div>
  </section>
);

// ============================================
// 63. ART DECO OPULENCE
// Black/gold, geometric patterns, 1920s glamour
// ============================================
export const Hero63_ArtDeco = () => (
  <section className="hero-var hero-var--deco">
    <div className="hero-var__deco-bg">
      <img src={imgs.sunset} alt="" />
    </div>
    <div className="hero-var__deco-overlay"></div>
    <div className="hero-var__deco-pattern"></div>
    <div className="hero-var__deco-frame">
      <div className="hero-var__deco-corner hero-var__deco-corner--tl"></div>
      <div className="hero-var__deco-corner hero-var__deco-corner--tr"></div>
      <div className="hero-var__deco-corner hero-var__deco-corner--bl"></div>
      <div className="hero-var__deco-corner hero-var__deco-corner--br"></div>
      <div className="hero-var__deco-line hero-var__deco-line--top"></div>
      <div className="hero-var__deco-line hero-var__deco-line--bottom"></div>
    </div>
    <div className="hero-var__deco-content">
      <div className="hero-var__deco-sunburst"></div>
      <div className="hero-var__deco-badge">
        <span>★ ESTABLISHED ★</span>
        <span className="hero-var__deco-badge-year">MCMXC</span>
      </div>
      <h1 className="hero-var__headline--deco">
        <span className="hero-var__deco-h1-top">HQ</span>
        <span className="hero-var__deco-h1-main">AVIATION</span>
        <span className="hero-var__deco-h1-bottom">LONDON</span>
      </h1>
      <div className="hero-var__deco-ornament">
        <span></span>
        <span className="hero-var__deco-diamond">◆</span>
        <span></span>
      </div>
      <p className="hero-var__deco-tagline">The Finest in Rotorcraft Excellence</p>
      <div className="hero-var__deco-ctas">
        <Link to="/training" className="hero-var__btn--deco">Discover Training</Link>
        <Link to="/aircraft-sales" className="hero-var__btn--deco hero-var__btn--deco-outline">View Fleet</Link>
      </div>
    </div>
    <div className="hero-var__deco-footer">
      <div className="hero-var__deco-footer-item">
        <span className="hero-var__deco-footer-num">XXXV</span>
        <span className="hero-var__deco-footer-label">Years</span>
      </div>
      <div className="hero-var__deco-footer-divider">|</div>
      <div className="hero-var__deco-footer-item">
        <span className="hero-var__deco-footer-num">M+</span>
        <span className="hero-var__deco-footer-label">Flight Hours</span>
      </div>
    </div>
  </section>
);

// ============================================
// 64. NEO-TOKYO CYBER
// Neon magenta/cyan, glitch, digital aesthetic
// ============================================
export const Hero64_NeoTokyo = () => {
  const [glitch, setGlitch] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      setGlitch(true);
      setTimeout(() => setGlitch(false), 150);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  return (
    <section className="hero-var hero-var--cyber">
      <div className="hero-var__cyber-grid-bg"></div>
      <div className="hero-var__cyber-scanlines"></div>
      <div className="hero-var__cyber-vignette"></div>

      <div className="hero-var__cyber-sidebar">
        <div className="hero-var__cyber-logo">
          <span className="hero-var__cyber-logo-jp">航空</span>
          <span className="hero-var__cyber-logo-en">HQ//AVN</span>
        </div>
        <div className="hero-var__cyber-nav">
          <span data-jp="訓練">TRAIN</span>
          <span data-jp="販売">SALES</span>
          <span data-jp="探検">EXPD</span>
        </div>
        <div className="hero-var__cyber-status">
          <span className="hero-var__cyber-status-dot"></span>
          <span>SYSTEM ONLINE</span>
        </div>
      </div>

      <div className="hero-var__cyber-main">
        <div className={`hero-var__cyber-headline ${glitch ? 'glitch' : ''}`}>
          <h1 className="hero-var__headline--cyber" data-text="ELEVATE">
            ELEVATE
          </h1>
          <div className="hero-var__cyber-subtitle">
            <span className="hero-var__cyber-bracket">[</span>
            <span>ROBINSON SPECIALISTS</span>
            <span className="hero-var__cyber-bracket">]</span>
          </div>
        </div>

        <div className="hero-var__cyber-stats">
          <div className="hero-var__cyber-stat">
            <span className="hero-var__cyber-stat-label">YRS_ACTIVE</span>
            <span className="hero-var__cyber-stat-value">035</span>
          </div>
          <div className="hero-var__cyber-stat">
            <span className="hero-var__cyber-stat-label">FLEET_SZ</span>
            <span className="hero-var__cyber-stat-value">030</span>
          </div>
          <div className="hero-var__cyber-stat">
            <span className="hero-var__cyber-stat-label">PLT_CERT</span>
            <span className="hero-var__cyber-stat-value">1.2K</span>
          </div>
        </div>

        <div className="hero-var__cyber-cta">
          <Link to="/training" className="hero-var__btn--cyber">
            <span className="hero-var__cyber-btn-icon">▶</span>
            <span>INITIALIZE_TRAINING.exe</span>
          </Link>
        </div>
      </div>

      <div className="hero-var__cyber-corner">
        <span>LAT: 51.5751</span>
        <span>LNG: -0.5128</span>
        <span>ALT: 77M</span>
      </div>

      <div className="hero-var__cyber-time">
        <span className="hero-var__cyber-time-label">LOCAL//</span>
        <span className="hero-var__cyber-time-value">{new Date().toLocaleTimeString('en-GB', { hour12: false })}</span>
      </div>
    </section>
  );
};

// ============================================
// 65. ORGANIC BIOPHILIC
// Flowing curves, natural palette, sustainable
// ============================================
export const Hero65_OrganicBio = () => (
  <section className="hero-var hero-var--organic-bio">
    <div className="hero-var__bio-bg">
      <svg className="hero-var__bio-wave hero-var__bio-wave--1" viewBox="0 0 1440 320" preserveAspectRatio="none">
        <path d="M0,160L48,176C96,192,192,224,288,213.3C384,203,480,149,576,138.7C672,128,768,160,864,181.3C960,203,1056,213,1152,197.3C1248,181,1344,139,1392,117.3L1440,96L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"></path>
      </svg>
      <svg className="hero-var__bio-wave hero-var__bio-wave--2" viewBox="0 0 1440 320" preserveAspectRatio="none">
        <path d="M0,64L48,80C96,96,192,128,288,128C384,128,480,96,576,106.7C672,117,768,171,864,181.3C960,192,1056,160,1152,144C1248,128,1344,128,1392,128L1440,128L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"></path>
      </svg>
    </div>

    <div className="hero-var__bio-leaves">
      <div className="hero-var__bio-leaf hero-var__bio-leaf--1"></div>
      <div className="hero-var__bio-leaf hero-var__bio-leaf--2"></div>
      <div className="hero-var__bio-leaf hero-var__bio-leaf--3"></div>
    </div>

    <div className="hero-var__bio-content">
      <div className="hero-var__bio-badge">
        <span className="hero-var__bio-badge-icon">🌿</span>
        <span>Sustainable Aviation</span>
      </div>

      <h1 className="hero-var__headline--bio">
        <span className="hero-var__bio-h1-script">naturally</span>
        <span className="hero-var__bio-h1-main">Elevated</span>
      </h1>

      <p className="hero-var__bio-desc">
        Where the rhythm of flight meets the harmony of nature.
        Training that respects both sky and earth.
      </p>

      <div className="hero-var__bio-features">
        <div className="hero-var__bio-feature">
          <span className="hero-var__bio-feature-icon">○</span>
          <span>35+ Years of Excellence</span>
        </div>
        <div className="hero-var__bio-feature">
          <span className="hero-var__bio-feature-icon">○</span>
          <span>Eco-Conscious Training</span>
        </div>
        <div className="hero-var__bio-feature">
          <span className="hero-var__bio-feature-icon">○</span>
          <span>Robinson Specialists</span>
        </div>
      </div>

      <div className="hero-var__bio-ctas">
        <Link to="/training" className="hero-var__btn--bio">
          Start Your Journey
          <span className="hero-var__bio-btn-leaf">🍃</span>
        </Link>
        <Link to="/about-us" className="hero-var__btn--bio-outline">Our Story</Link>
      </div>
    </div>

    <div className="hero-var__bio-image">
      <div className="hero-var__bio-image-frame">
        <img src={imgs.aerial} alt="" />
      </div>
      <div className="hero-var__bio-image-accent"></div>
    </div>

    <div className="hero-var__bio-footer">
      <span>Denham Aerodrome</span>
      <span className="hero-var__bio-footer-dot">●</span>
      <span>London, UK</span>
    </div>
  </section>
);

// ============================================
// 66. REFINED MONOCHROME
// Ultra-minimal black/white with exquisite typography
// ============================================
export const Hero66_RefinedMono = () => (
  <section className="hero-var hero-var--refined-mono">
    <div className="hero-var__refined-container">
      <div className="hero-var__refined-top">
        <span className="hero-var__refined-logo">HQ</span>
        <span className="hero-var__refined-est">Est. 1990</span>
      </div>

      <div className="hero-var__refined-center">
        <div className="hero-var__refined-line"></div>
        <h1 className="hero-var__headline--refined">
          <span className="hero-var__refined-word">Precision</span>
          <span className="hero-var__refined-word">in</span>
          <span className="hero-var__refined-word">Flight</span>
        </h1>
        <div className="hero-var__refined-line"></div>
      </div>

      <div className="hero-var__refined-bottom">
        <p className="hero-var__refined-tagline">The Robinson Specialists</p>
        <Link to="/training" className="hero-var__btn--refined">
          <span>Discover</span>
          <span className="hero-var__refined-arrow">→</span>
        </Link>
      </div>
    </div>
  </section>
);

// ============================================
// 67. FLOATING TYPOGRAPHY
// Large floating letters with parallax depth
// ============================================
export const Hero67_FloatingType = () => (
  <section className="hero-var hero-var--floating-type">
    <div className="hero-var__float-bg">
      <img src={imgs.aerial} alt="" />
    </div>
    <div className="hero-var__float-overlay"></div>

    <div className="hero-var__float-letters">
      <span className="hero-var__float-letter" style={{'--delay': '0s', '--x': '-10%'}}>E</span>
      <span className="hero-var__float-letter" style={{'--delay': '0.1s', '--x': '5%'}}>L</span>
      <span className="hero-var__float-letter" style={{'--delay': '0.2s', '--x': '-5%'}}>E</span>
      <span className="hero-var__float-letter" style={{'--delay': '0.3s', '--x': '10%'}}>V</span>
      <span className="hero-var__float-letter" style={{'--delay': '0.4s', '--x': '-8%'}}>A</span>
      <span className="hero-var__float-letter" style={{'--delay': '0.5s', '--x': '3%'}}>T</span>
      <span className="hero-var__float-letter" style={{'--delay': '0.6s', '--x': '-3%'}}>E</span>
    </div>

    <div className="hero-var__float-content">
      <p className="hero-var__float-sub">London's Premier Helicopter Training</p>
      <Link to="/training" className="hero-var__btn--float">Begin Your Journey</Link>
    </div>
  </section>
);

// ============================================
// 68. LUMINOUS GRADIENT
// Soft, sophisticated gradient with glass elements
// ============================================
export const Hero68_Luminous = () => (
  <section className="hero-var hero-var--luminous">
    <div className="hero-var__luminous-bg"></div>
    <div className="hero-var__luminous-orb hero-var__luminous-orb--1"></div>
    <div className="hero-var__luminous-orb hero-var__luminous-orb--2"></div>

    <div className="hero-var__luminous-content">
      <div className="hero-var__luminous-badge">Since 1990</div>
      <h1 className="hero-var__headline--luminous">
        Aspire<span className="hero-var__luminous-dot">.</span>
      </h1>
      <p className="hero-var__luminous-sub">
        Where ambition meets altitude
      </p>
      <div className="hero-var__luminous-ctas">
        <Link to="/training" className="hero-var__btn--luminous">Start Training</Link>
        <Link to="/about-us" className="hero-var__btn--luminous-ghost">Our Story</Link>
      </div>
    </div>

    <div className="hero-var__luminous-stats">
      <div className="hero-var__luminous-stat">
        <span className="hero-var__luminous-stat-num">35+</span>
        <span className="hero-var__luminous-stat-label">Years</span>
      </div>
      <div className="hero-var__luminous-stat">
        <span className="hero-var__luminous-stat-num">1000+</span>
        <span className="hero-var__luminous-stat-label">Pilots Certified</span>
      </div>
    </div>
  </section>
);

// ============================================
// 69. ARCHITECTURAL GRID
// Clean lines inspired by modern architecture
// ============================================
export const Hero69_Architectural = () => (
  <section className="hero-var hero-var--architectural">
    <div className="hero-var__arch-grid">
      <div className="hero-var__arch-line hero-var__arch-line--v1"></div>
      <div className="hero-var__arch-line hero-var__arch-line--v2"></div>
      <div className="hero-var__arch-line hero-var__arch-line--v3"></div>
      <div className="hero-var__arch-line hero-var__arch-line--h1"></div>
      <div className="hero-var__arch-line hero-var__arch-line--h2"></div>
    </div>

    <div className="hero-var__arch-content">
      <div className="hero-var__arch-header">
        <span>HQ Aviation</span>
        <span>51.5751°N</span>
      </div>

      <h1 className="hero-var__headline--arch">
        <span>Built for</span>
        <span className="hero-var__arch-emphasis">Excellence</span>
      </h1>

      <div className="hero-var__arch-info">
        <div className="hero-var__arch-info-item">
          <span className="hero-var__arch-info-label">Established</span>
          <span className="hero-var__arch-info-value">1990</span>
        </div>
        <div className="hero-var__arch-info-item">
          <span className="hero-var__arch-info-label">Location</span>
          <span className="hero-var__arch-info-value">Denham</span>
        </div>
        <div className="hero-var__arch-info-item">
          <span className="hero-var__arch-info-label">Specialty</span>
          <span className="hero-var__arch-info-value">Robinson</span>
        </div>
      </div>

      <Link to="/contact" className="hero-var__btn--arch">
        <span>Get Started</span>
      </Link>
    </div>

    <div className="hero-var__arch-image">
      <img src={imgs.hangar} alt="" />
    </div>
  </section>
);

// ============================================
// 70. SILK MOTION
// Smooth, flowing animated gradients
// ============================================
export const Hero70_SilkMotion = () => (
  <section className="hero-var hero-var--silk">
    <div className="hero-var__silk-bg">
      <div className="hero-var__silk-wave hero-var__silk-wave--1"></div>
      <div className="hero-var__silk-wave hero-var__silk-wave--2"></div>
      <div className="hero-var__silk-wave hero-var__silk-wave--3"></div>
    </div>

    <div className="hero-var__silk-content">
      <span className="hero-var__silk-pre">The Art of</span>
      <h1 className="hero-var__headline--silk">Aviation</h1>
      <p className="hero-var__silk-desc">
        Graceful. Precise. Unforgettable.
      </p>
      <Link to="/training" className="hero-var__btn--silk">
        Experience Flight
      </Link>
    </div>

    <div className="hero-var__silk-footer">
      <span>HQ Aviation</span>
      <span className="hero-var__silk-divider"></span>
      <span>London</span>
    </div>
  </section>
);

// ============================================
// 71. STATEMENT SERIF
// Bold serif typography, editorial luxury
// ============================================
export const Hero71_StatementSerif = () => (
  <section className="hero-var hero-var--statement">
    <div className="hero-var__statement-bg">
      <img src={imgs.sunset} alt="" />
    </div>
    <div className="hero-var__statement-overlay"></div>

    <div className="hero-var__statement-content">
      <div className="hero-var__statement-pre">
        <span>HQ Aviation</span>
        <span className="hero-var__statement-year">MMXXIV</span>
      </div>

      <h1 className="hero-var__headline--statement">
        Rise<br/>Above
      </h1>

      <div className="hero-var__statement-post">
        <p>London's distinguished helicopter training academy, crafting exceptional pilots since 1990.</p>
        <Link to="/training" className="hero-var__btn--statement">
          Begin
        </Link>
      </div>
    </div>
  </section>
);

// ============================================
// 72. NEGATIVE SPACE
// Extreme whitespace, one focal element
// ============================================
export const Hero72_NegativeSpace = () => (
  <section className="hero-var hero-var--negative">
    <div className="hero-var__negative-content">
      <h1 className="hero-var__headline--negative">HQ</h1>
      <p className="hero-var__negative-sub">Aviation</p>
    </div>

    <div className="hero-var__negative-corner">
      <span className="hero-var__negative-label">The Robinson Specialists</span>
      <Link to="/training" className="hero-var__btn--negative">
        Explore →
      </Link>
    </div>

    <div className="hero-var__negative-accent"></div>
  </section>
);

// ============================================
// 73. GOLDEN HOUR
// Warm luxurious tones, cinematic warmth
// ============================================
export const Hero73_GoldenHour = () => (
  <section className="hero-var hero-var--golden">
    <div className="hero-var__golden-bg">
      <img src={imgs.sunset} alt="" />
    </div>
    <div className="hero-var__golden-overlay"></div>
    <div className="hero-var__golden-grain"></div>

    <div className="hero-var__golden-content">
      <div className="hero-var__golden-badge">
        <span>Est.</span>
        <span className="hero-var__golden-badge-year">1990</span>
      </div>

      <h1 className="hero-var__headline--golden">
        Chase the<br/>
        <span className="hero-var__golden-script">horizon</span>
      </h1>

      <div className="hero-var__golden-cta">
        <Link to="/training" className="hero-var__btn--golden">
          Start Your Journey
        </Link>
        <span className="hero-var__golden-hint">Training • Sales • Expeditions</span>
      </div>
    </div>

    <div className="hero-var__golden-time">
      <span>Golden Hour</span>
      <span>Denham Aerodrome</span>
    </div>
  </section>
);

// ============================================
// 74. WHISPER MINIMAL
// Ultra-light typography, barely-there elements
// ============================================
export const Hero74_Whisper = () => (
  <section className="hero-var hero-var--whisper">
    <div className="hero-var__whisper-content">
      <span className="hero-var__whisper-pre">HQ Aviation presents</span>

      <h1 className="hero-var__headline--whisper">
        <span className="hero-var__whisper-light">The quiet</span>
        <span className="hero-var__whisper-medium">pursuit of</span>
        <span className="hero-var__whisper-bold">perfection</span>
      </h1>

      <div className="hero-var__whisper-footer">
        <div className="hero-var__whisper-info">
          <span>Robinson Specialists</span>
          <span>Since 1990</span>
        </div>
        <Link to="/training" className="hero-var__btn--whisper">
          Learn More
        </Link>
      </div>
    </div>

    <div className="hero-var__whisper-image">
      <img src={imgs.cockpit} alt="" />
    </div>
  </section>
);

// ============================================
// 75. PRESTIGE DARK
// Dark luxury with subtle accents
// ============================================
export const Hero75_PrestigeDark = () => (
  <section className="hero-var hero-var--prestige">
    <div className="hero-var__prestige-bg">
      <img src={imgs.hangar} alt="" />
    </div>
    <div className="hero-var__prestige-overlay"></div>

    <div className="hero-var__prestige-header">
      <div className="hero-var__prestige-logo">
        <span className="hero-var__prestige-logo-mark">HQ</span>
        <span className="hero-var__prestige-logo-text">Aviation</span>
      </div>
      <nav className="hero-var__prestige-nav">
        <span>Training</span>
        <span>Fleet</span>
        <span>Expeditions</span>
      </nav>
    </div>

    <div className="hero-var__prestige-content">
      <div className="hero-var__prestige-label">
        <span className="hero-var__prestige-line"></span>
        <span>Excellence Defined</span>
      </div>

      <h1 className="hero-var__headline--prestige">
        Elevate Your<br/>Expectations
      </h1>

      <p className="hero-var__prestige-desc">
        Three decades of uncompromising standards in helicopter training, sales, and adventure.
      </p>

      <div className="hero-var__prestige-ctas">
        <Link to="/training" className="hero-var__btn--prestige">Explore Training</Link>
        <Link to="/contact" className="hero-var__btn--prestige-outline">Contact Us</Link>
      </div>
    </div>

    <div className="hero-var__prestige-footer">
      <div className="hero-var__prestige-stat">
        <span>35+</span>
        <span>Years</span>
      </div>
      <div className="hero-var__prestige-stat">
        <span>30+</span>
        <span>Aircraft</span>
      </div>
      <div className="hero-var__prestige-stat">
        <span>1000+</span>
        <span>Pilots</span>
      </div>
    </div>
  </section>
);

// ============================================
// 76. ARCH DARK
// Dark mode architectural with cream grid lines
// ============================================
export const Hero76_ArchDark = () => (
  <section className="hero-var hero-var--arch-dark">
    <div className="hero-var__arch-grid hero-var__arch-grid--dark">
      <div className="hero-var__arch-line hero-var__arch-line--d1"></div>
      <div className="hero-var__arch-line hero-var__arch-line--d2"></div>
      <div className="hero-var__arch-line hero-var__arch-line--d3"></div>
      <div className="hero-var__arch-line hero-var__arch-line--d4"></div>
      <div className="hero-var__arch-line hero-var__arch-line--dh1"></div>
      <div className="hero-var__arch-line hero-var__arch-line--dh2"></div>
    </div>

    <div className="hero-var__arch-dark-content">
      <div className="hero-var__arch-dark-top">
        <span className="hero-var__arch-dark-logo">HQ</span>
        <span className="hero-var__arch-dark-coords">51.5751°N / 0.5059°W</span>
      </div>

      <h1 className="hero-var__headline--arch-dark">
        <span>Precision</span>
        <span className="hero-var__arch-dark-highlight">Engineering</span>
      </h1>

      <div className="hero-var__arch-dark-meta">
        <div><span>Est.</span><strong>1990</strong></div>
        <div><span>Fleet</span><strong>30+</strong></div>
        <div><span>Robinson</span><strong>Approved</strong></div>
      </div>

      <Link to="/contact" className="hero-var__btn--arch-dark">
        <span>Begin Journey</span>
        <span className="hero-var__btn-arrow">→</span>
      </Link>
    </div>

    <div className="hero-var__arch-dark-image">
      <img src={imgs.r44} alt="" />
      <div className="hero-var__arch-dark-image-overlay"></div>
    </div>
  </section>
);

// ============================================
// 77. ARCH BLUEPRINT
// Blueprint style with technical drawing aesthetic
// ============================================
export const Hero77_ArchBlueprint = () => (
  <section className="hero-var hero-var--arch-blueprint">
    <div className="hero-var__blueprint-grid">
      {[...Array(12)].map((_, i) => (
        <div key={i} className="hero-var__blueprint-line hero-var__blueprint-line--v" style={{left: `${(i + 1) * 8}%`}}></div>
      ))}
      {[...Array(8)].map((_, i) => (
        <div key={i} className="hero-var__blueprint-line hero-var__blueprint-line--h" style={{top: `${(i + 1) * 12}%`}}></div>
      ))}
    </div>

    <div className="hero-var__blueprint-header">
      <div className="hero-var__blueprint-title">HQ AVIATION</div>
      <div className="hero-var__blueprint-ref">REF: HQ-2024-001</div>
    </div>

    <div className="hero-var__blueprint-content">
      <div className="hero-var__blueprint-label">PROJECT DESIGNATION</div>
      <h1 className="hero-var__headline--blueprint">
        FLIGHT<br/>TRAINING<br/>FACILITY
      </h1>
      <div className="hero-var__blueprint-scale">SCALE: 1:1 | SHEET 01 OF 01</div>
    </div>

    <div className="hero-var__blueprint-image">
      <img src={imgs.hangar} alt="" />
      <div className="hero-var__blueprint-frame">
        <span></span><span></span><span></span><span></span>
      </div>
    </div>

    <div className="hero-var__blueprint-footer">
      <div className="hero-var__blueprint-note">DENHAM AERODROME, BUCKINGHAMSHIRE</div>
      <Link to="/contact" className="hero-var__btn--blueprint">REQUEST BRIEFING</Link>
    </div>
  </section>
);

// ============================================
// 78. ARCH GOLDEN
// Golden ratio grid with luxury gold accents
// ============================================
export const Hero78_ArchGolden = () => (
  <section className="hero-var hero-var--arch-golden">
    <div className="hero-var__golden-spiral"></div>
    <div className="hero-var__golden-grid">
      <div className="hero-var__golden-line hero-var__golden-line--phi1"></div>
      <div className="hero-var__golden-line hero-var__golden-line--phi2"></div>
      <div className="hero-var__golden-line hero-var__golden-line--phi3"></div>
      <div className="hero-var__golden-line hero-var__golden-line--phi4"></div>
    </div>

    <div className="hero-var__golden-content">
      <div className="hero-var__golden-badge">
        <span className="hero-var__golden-badge-line"></span>
        <span>φ = 1.618</span>
      </div>

      <h1 className="hero-var__headline--golden">
        <span>Perfectly</span>
        <span className="hero-var__golden-emphasis">Proportioned</span>
      </h1>

      <p className="hero-var__golden-desc">
        Where mathematical precision meets aviation excellence.
      </p>

      <div className="hero-var__golden-cta">
        <Link to="/training" className="hero-var__btn--golden">Discover More</Link>
        <div className="hero-var__golden-ratio">
          <span>0.618</span>
          <span>:</span>
          <span>1.000</span>
        </div>
      </div>
    </div>

    <div className="hero-var__golden-image">
      <img src={imgs.r66} alt="" />
    </div>
  </section>
);

// ============================================
// 79. ARCH BRUTALIST
// Heavy concrete brutalist with bold grid lines
// ============================================
export const Hero79_ArchBrutalist = () => (
  <section className="hero-var hero-var--arch-brutalist">
    <div className="hero-var__brutalist-grid">
      <div className="hero-var__brutalist-block hero-var__brutalist-block--1"></div>
      <div className="hero-var__brutalist-block hero-var__brutalist-block--2"></div>
      <div className="hero-var__brutalist-block hero-var__brutalist-block--3"></div>
    </div>

    <div className="hero-var__brutalist-content">
      <div className="hero-var__brutalist-pre">NO. 001</div>
      <h1 className="hero-var__headline--brutalist">
        RAW<br/>POWER
      </h1>
      <div className="hero-var__brutalist-post">
        HELICOPTER TRAINING & SALES<br/>
        DENHAM AERODROME, UK
      </div>
      <Link to="/contact" className="hero-var__btn--brutalist">ENTER</Link>
    </div>

    <div className="hero-var__brutalist-image">
      <img src={imgs.hangar} alt="" />
    </div>

    <div className="hero-var__brutalist-stamp">
      <span>HQ</span>
      <span>AVIATION</span>
    </div>
  </section>
);

// ============================================
// 80. ARCH ASYMMETRIC
// Off-center composition with dynamic tension
// ============================================
export const Hero80_ArchAsymmetric = () => (
  <section className="hero-var hero-var--arch-asymmetric">
    <div className="hero-var__asym-grid">
      <div className="hero-var__asym-line hero-var__asym-line--1"></div>
      <div className="hero-var__asym-line hero-var__asym-line--2"></div>
      <div className="hero-var__asym-line hero-var__asym-line--3"></div>
    </div>

    <div className="hero-var__asym-image">
      <img src={imgs.r44} alt="" />
    </div>

    <div className="hero-var__asym-content">
      <div className="hero-var__asym-header">
        <span>HQ Aviation</span>
        <span>—</span>
        <span>Since 1990</span>
      </div>

      <h1 className="hero-var__headline--asym">
        Off<span className="hero-var__asym-break">-</span>Center<br/>
        <span className="hero-var__asym-light">Excellence</span>
      </h1>

      <p className="hero-var__asym-desc">
        Breaking convention. Defining standards.
      </p>

      <Link to="/training" className="hero-var__btn--asym">
        Explore <span>→</span>
      </Link>
    </div>

    <div className="hero-var__asym-corner">
      <span>N51°34'31"</span>
      <span>W0°30'21"</span>
    </div>
  </section>
);

// ============================================
// 81. ARCH ANIMATED
// Grid lines animate into position on load
// ============================================
export const Hero81_ArchAnimated = () => (
  <section className="hero-var hero-var--arch-animated">
    <div className="hero-var__anim-grid">
      <div className="hero-var__anim-line hero-var__anim-line--v1"></div>
      <div className="hero-var__anim-line hero-var__anim-line--v2"></div>
      <div className="hero-var__anim-line hero-var__anim-line--v3"></div>
      <div className="hero-var__anim-line hero-var__anim-line--v4"></div>
      <div className="hero-var__anim-line hero-var__anim-line--h1"></div>
      <div className="hero-var__anim-line hero-var__anim-line--h2"></div>
      <div className="hero-var__anim-line hero-var__anim-line--h3"></div>
    </div>

    <div className="hero-var__anim-content">
      <div className="hero-var__anim-eyebrow">
        <span className="hero-var__anim-dot"></span>
        <span>Now Boarding</span>
      </div>

      <h1 className="hero-var__headline--animated">
        <span className="hero-var__anim-word hero-var__anim-word--1">Lines</span>
        <span className="hero-var__anim-word hero-var__anim-word--2">In</span>
        <span className="hero-var__anim-word hero-var__anim-word--3">Motion</span>
      </h1>

      <div className="hero-var__anim-stats">
        <div><strong>35</strong><span>Years</span></div>
        <div><strong>30+</strong><span>Aircraft</span></div>
        <div><strong>∞</strong><span>Horizons</span></div>
      </div>

      <Link to="/contact" className="hero-var__btn--animated">
        Take Flight
      </Link>
    </div>

    <div className="hero-var__anim-image">
      <img src={imgs.hangar} alt="" />
    </div>
  </section>
);

// ============================================
// 82. ARCH MOSAIC
// Multiple images arranged in grid cells
// ============================================
export const Hero82_ArchMosaic = () => (
  <section className="hero-var hero-var--arch-mosaic">
    <div className="hero-var__mosaic-grid">
      <div className="hero-var__mosaic-cell hero-var__mosaic-cell--1">
        <img src={imgs.r22} alt="" />
      </div>
      <div className="hero-var__mosaic-cell hero-var__mosaic-cell--2">
        <img src={imgs.r44} alt="" />
      </div>
      <div className="hero-var__mosaic-cell hero-var__mosaic-cell--3">
        <img src={imgs.r66} alt="" />
      </div>
      <div className="hero-var__mosaic-cell hero-var__mosaic-cell--4">
        <img src={imgs.hangar} alt="" />
      </div>
      <div className="hero-var__mosaic-cell hero-var__mosaic-cell--content">
        <div className="hero-var__mosaic-inner">
          <span className="hero-var__mosaic-pre">The Robinson Specialists</span>
          <h1 className="hero-var__headline--mosaic">HQ Aviation</h1>
          <p className="hero-var__mosaic-desc">Four decades. One passion.</p>
          <Link to="/contact" className="hero-var__btn--mosaic">View Fleet</Link>
        </div>
      </div>
    </div>
  </section>
);

// ============================================
// 83. ARCH VERTICAL
// Vertical emphasis with tall column layout
// ============================================
export const Hero83_ArchVertical = () => (
  <section className="hero-var hero-var--arch-vertical">
    <div className="hero-var__vert-columns">
      <div className="hero-var__vert-col hero-var__vert-col--1">
        <div className="hero-var__vert-label">Training</div>
      </div>
      <div className="hero-var__vert-col hero-var__vert-col--2">
        <img src={imgs.r44} alt="" />
      </div>
      <div className="hero-var__vert-col hero-var__vert-col--3">
        <div className="hero-var__vert-content">
          <h1 className="hero-var__headline--vertical">
            Reach<br/>New<br/>Heights
          </h1>
          <Link to="/training" className="hero-var__btn--vertical">Begin Training</Link>
        </div>
      </div>
      <div className="hero-var__vert-col hero-var__vert-col--4">
        <img src={imgs.hangar} alt="" />
      </div>
      <div className="hero-var__vert-col hero-var__vert-col--5">
        <div className="hero-var__vert-label">Sales</div>
      </div>
    </div>

    <div className="hero-var__vert-header">
      <span>HQ Aviation</span>
      <span>Denham UK</span>
    </div>
  </section>
);

// ============================================
// 84. ARCH INVERTED
// Reversed layout with image on left
// ============================================
export const Hero84_ArchInverted = () => (
  <section className="hero-var hero-var--arch-inverted">
    <div className="hero-var__inv-grid">
      <div className="hero-var__inv-line hero-var__inv-line--1"></div>
      <div className="hero-var__inv-line hero-var__inv-line--2"></div>
      <div className="hero-var__inv-line hero-var__inv-line--3"></div>
      <div className="hero-var__inv-line hero-var__inv-line--h1"></div>
    </div>

    <div className="hero-var__inv-image">
      <img src={imgs.r66} alt="" />
    </div>

    <div className="hero-var__inv-content">
      <div className="hero-var__inv-header">
        <span>0.5059°W</span>
        <span>HQ Aviation</span>
      </div>

      <h1 className="hero-var__headline--inverted">
        <span className="hero-var__inv-small">Inverse</span>
        <span className="hero-var__inv-large">Perfection</span>
      </h1>

      <div className="hero-var__inv-info">
        <div className="hero-var__inv-info-item">
          <span>Location</span>
          <strong>Denham</strong>
        </div>
        <div className="hero-var__inv-info-item">
          <span>Founded</span>
          <strong>1990</strong>
        </div>
        <div className="hero-var__inv-info-item">
          <span>Specialty</span>
          <strong>Robinson</strong>
        </div>
      </div>

      <Link to="/contact" className="hero-var__btn--inverted">
        <span>Start Here</span>
      </Link>
    </div>
  </section>
);

// ============================================
// 85. ARCH NEON
// Dark with subtle neon glowing grid lines
// ============================================
export const Hero85_ArchNeon = () => (
  <section className="hero-var hero-var--arch-neon">
    <div className="hero-var__neon-grid">
      <div className="hero-var__neon-line hero-var__neon-line--v1"></div>
      <div className="hero-var__neon-line hero-var__neon-line--v2"></div>
      <div className="hero-var__neon-line hero-var__neon-line--v3"></div>
      <div className="hero-var__neon-line hero-var__neon-line--h1"></div>
      <div className="hero-var__neon-line hero-var__neon-line--h2"></div>
    </div>

    <div className="hero-var__neon-content">
      <div className="hero-var__neon-tag">
        <span className="hero-var__neon-pulse"></span>
        <span>Online Now</span>
      </div>

      <h1 className="hero-var__headline--neon">
        <span>Electric</span>
        <span className="hero-var__neon-glow">Aviation</span>
      </h1>

      <p className="hero-var__neon-desc">
        Where technology meets tradition at 3,000 feet.
      </p>

      <Link to="/training" className="hero-var__btn--neon">
        <span>Power On</span>
      </Link>
    </div>

    <div className="hero-var__neon-image">
      <img src={imgs.r44} alt="" />
      <div className="hero-var__neon-image-glow"></div>
    </div>

    <div className="hero-var__neon-footer">
      <span>HQ</span>
      <span className="hero-var__neon-divider"></span>
      <span>Aviation</span>
    </div>
  </section>
);

// ============================================
// 86. ARCH TERRACOTTA
// Warm terracotta earth tones
// ============================================
export const Hero86_ArchTerracotta = () => (
  <section className="hero-var hero-var--arch-terracotta">
    <div className="hero-var__terra-grid">
      <div className="hero-var__terra-line hero-var__terra-line--1"></div>
      <div className="hero-var__terra-line hero-var__terra-line--2"></div>
      <div className="hero-var__terra-line hero-var__terra-line--h"></div>
    </div>

    <div className="hero-var__terra-content">
      <div className="hero-var__terra-header">
        <div className="hero-var__terra-logo">HQ</div>
        <nav className="hero-var__terra-nav">
          <span>Training</span>
          <span>Fleet</span>
          <span>Contact</span>
        </nav>
      </div>

      <div className="hero-var__terra-main">
        <span className="hero-var__terra-pre">Rooted in Excellence</span>
        <h1 className="hero-var__headline--terracotta">
          Grounded<br/>
          <span>Ambition</span>
        </h1>
        <p className="hero-var__terra-desc">
          Earthy tones. Sky-high dreams.
        </p>
        <Link to="/contact" className="hero-var__btn--terracotta">Get Started</Link>
      </div>
    </div>

    <div className="hero-var__terra-image">
      <img src={imgs.hangar} alt="" />
    </div>

    <div className="hero-var__terra-accent"></div>
  </section>
);

// ============================================
// 87. ARCH MONOCHROME
// Pure black and white high contrast
// ============================================
export const Hero87_ArchMonochrome = () => (
  <section className="hero-var hero-var--arch-mono">
    <div className="hero-var__mono-grid">
      <div className="hero-var__mono-line hero-var__mono-line--1"></div>
      <div className="hero-var__mono-line hero-var__mono-line--2"></div>
      <div className="hero-var__mono-line hero-var__mono-line--3"></div>
      <div className="hero-var__mono-line hero-var__mono-line--4"></div>
      <div className="hero-var__mono-line hero-var__mono-line--h1"></div>
      <div className="hero-var__mono-line hero-var__mono-line--h2"></div>
    </div>

    <div className="hero-var__mono-content">
      <div className="hero-var__mono-header">
        <span>HQ</span>
        <span>///</span>
        <span>Aviation</span>
      </div>

      <h1 className="hero-var__headline--mono">
        BLACK<br/>
        &<br/>
        WHITE
      </h1>

      <div className="hero-var__mono-tagline">
        No grey areas. Just excellence.
      </div>

      <Link to="/contact" className="hero-var__btn--mono">
        Contact
      </Link>
    </div>

    <div className="hero-var__mono-image">
      <img src={imgs.r66} alt="" />
    </div>

    <div className="hero-var__mono-footer">
      <span>51.5751°N</span>
      <span>Since 1990</span>
      <span>0.5059°W</span>
    </div>
  </section>
);

// ============================================
// 88. GALLERY AESTHETIC
// Quiet Luxury - The Row, Aman, Céline inspired
// ============================================
export const Hero88_GalleryAesthetic = () => (
  <section className="hero-var hero-var--gallery">
    <div className="hero-var__gallery-image">
      <img src={imgs.r66} alt="" />
    </div>

    <div className="hero-var__gallery-content">
      <nav className="hero-var__gallery-nav">
        <span>Training</span>
        <span>Fleet</span>
        <span>Experience</span>
      </nav>

      <div className="hero-var__gallery-center">
        <span className="hero-var__gallery-wordmark">HQ Aviation</span>
      </div>

      <div className="hero-var__gallery-bottom">
        <div className="hero-var__gallery-caption">
          <span>The Robinson Specialists</span>
          <span>Since 1990</span>
        </div>

        <Link to="/contact" className="hero-var__btn--gallery">
          Enquire
        </Link>
      </div>
    </div>

    <div className="hero-var__gallery-scroll">
      <span></span>
    </div>
  </section>
);

// ============================================
// 89. CINEMATIC NARRATIVE
// Immersive - Rolls-Royce, Belmond inspired
// ============================================
export const Hero89_CinematicNarrative = () => (
  <section className="hero-var hero-var--narrative">
    <div className="hero-var__narrative-bg">
      <img src={imgs.hangar} alt="" />
      <div className="hero-var__narrative-overlay"></div>
    </div>

    <div className="hero-var__narrative-vignette"></div>

    <div className="hero-var__narrative-content">
      <div className="hero-var__narrative-pre">
        <span className="hero-var__narrative-line"></span>
        <span>A Journey Begins</span>
      </div>

      <h1 className="hero-var__headline--narrative">
        Beyond<br/>
        <span>Ordinary</span>
      </h1>

      <p className="hero-var__narrative-desc">
        Where every flight becomes a story worth telling.
      </p>
    </div>

    <div className="hero-var__narrative-cta">
      <Link to="/expeditions" className="hero-var__btn--narrative">
        <span className="hero-var__btn-circle"></span>
        <span>Experience</span>
      </Link>
    </div>

    <div className="hero-var__narrative-footer">
      <span>HQ Aviation</span>
      <span className="hero-var__narrative-divider"></span>
      <span>Denham, England</span>
    </div>
  </section>
);

// ============================================
// 90. EDITORIAL GRID
// Curated Commerce - Net-a-Porter, Sotheby's inspired
// ============================================
export const Hero90_EditorialGrid = () => (
  <section className="hero-var hero-var--editorial-grid">
    <header className="hero-var__eg-header">
      <div className="hero-var__eg-logo">HQ</div>
      <div className="hero-var__eg-tagline">The Aviation Edit</div>
      <div className="hero-var__eg-issue">Issue No. 47 — Winter 2024</div>
    </header>

    <div className="hero-var__eg-grid">
      <div className="hero-var__eg-cell hero-var__eg-cell--feature">
        <img src={imgs.r66} alt="" />
        <div className="hero-var__eg-cell-content">
          <span className="hero-var__eg-category">Featured Aircraft</span>
          <h2>The R66 Turbine</h2>
          <p>Redefining private aviation for the discerning pilot</p>
          <Link to="/aircraft">Shop Now →</Link>
        </div>
      </div>

      <div className="hero-var__eg-cell hero-var__eg-cell--training">
        <img src={imgs.hangar} alt="" />
        <div className="hero-var__eg-cell-content">
          <span className="hero-var__eg-category">Training</span>
          <h3>Flight Academy</h3>
          <Link to="/training">Explore</Link>
        </div>
      </div>

      <div className="hero-var__eg-cell hero-var__eg-cell--quote">
        <blockquote>
          "Excellence is not a destination but a continuous journey."
        </blockquote>
        <cite>— Captain Q</cite>
      </div>

      <div className="hero-var__eg-cell hero-var__eg-cell--expeditions">
        <img src={imgs.r44} alt="" />
        <div className="hero-var__eg-cell-content">
          <span className="hero-var__eg-category">Expeditions</span>
          <h3>World Adventures</h3>
          <Link to="/expeditions">Discover</Link>
        </div>
      </div>
    </div>

    <div className="hero-var__eg-ticker">
      <div className="hero-var__eg-ticker-content">
        <span>Robinson Approved Service Centre</span>
        <span>•</span>
        <span>35+ Years Experience</span>
        <span>•</span>
        <span>PPL to ATPL Training</span>
        <span>•</span>
        <span>Aircraft Sales & Acquisition</span>
        <span>•</span>
        <span>Worldwide Expeditions</span>
        <span>•</span>
      </div>
    </div>
  </section>
);

// ============================================
// 91. NEO-BRUTALISM
// Avant-Garde - Ssense, Jil Sander inspired
// ============================================
export const Hero91_NeoBrutalism = () => (
  <section className="hero-var hero-var--neo-brutal">
    <div className="hero-var__nb-grid">
      <div className="hero-var__nb-line hero-var__nb-line--1"></div>
      <div className="hero-var__nb-line hero-var__nb-line--2"></div>
      <div className="hero-var__nb-line hero-var__nb-line--3"></div>
      <div className="hero-var__nb-line hero-var__nb-line--4"></div>
      <div className="hero-var__nb-line hero-var__nb-line--h1"></div>
      <div className="hero-var__nb-line hero-var__nb-line--h2"></div>
    </div>

    <div className="hero-var__nb-header">
      <span>HQ_AVIATION</span>
      <span>[DENHAM.UK]</span>
    </div>

    <div className="hero-var__nb-main">
      <div className="hero-var__nb-image">
        <img src={imgs.r44} alt="" />
        <div className="hero-var__nb-image-label">R44_RAVEN_II</div>
      </div>

      <div className="hero-var__nb-content">
        <div className="hero-var__nb-index">001</div>
        <h1 className="hero-var__headline--neo-brutal">
          FLIGHT<br/>
          TRAINING<br/>
          <span className="hero-var__nb-strike">REDEFINED</span>
        </h1>
        <div className="hero-var__nb-meta">
          <span>[EST.1990]</span>
          <span>[ROBINSON_SPECIALISTS]</span>
        </div>
      </div>
    </div>

    <div className="hero-var__nb-footer">
      <Link to="/training" className="hero-var__btn--neo-brutal">
        [ENTER_SITE]
      </Link>
      <div className="hero-var__nb-coords">
        <span>51.5751°N</span>
        <span>0.5059°W</span>
      </div>
    </div>
  </section>
);

// ============================================
// 92. PRECISION ENGINEERING
// High-Performance - Porsche, Rimowa, VistaJet inspired
// ============================================
export const Hero92_PrecisionEngineering = () => (
  <section className="hero-var hero-var--precision">
    <div className="hero-var__precision-bg">
      <div className="hero-var__precision-gradient"></div>
    </div>

    <div className="hero-var__precision-grid">
      <div className="hero-var__precision-hairline hero-var__precision-hairline--1"></div>
      <div className="hero-var__precision-hairline hero-var__precision-hairline--2"></div>
      <div className="hero-var__precision-hairline hero-var__precision-hairline--3"></div>
      <div className="hero-var__precision-hairline hero-var__precision-hairline--4"></div>
    </div>

    <header className="hero-var__precision-header">
      <div className="hero-var__precision-logo">
        <span>HQ</span>
        <span className="hero-var__precision-logo-line"></span>
        <span>Aviation</span>
      </div>
      <nav className="hero-var__precision-nav">
        <span>Configure</span>
        <span>Fleet</span>
        <span>Training</span>
        <span>Contact</span>
      </nav>
    </header>

    <div className="hero-var__precision-content">
      <div className="hero-var__precision-specs">
        <div className="hero-var__precision-spec">
          <span className="hero-var__precision-spec-value">300</span>
          <span className="hero-var__precision-spec-unit">HP</span>
          <span className="hero-var__precision-spec-label">Engine Power</span>
        </div>
        <div className="hero-var__precision-spec">
          <span className="hero-var__precision-spec-value">140</span>
          <span className="hero-var__precision-spec-unit">KTS</span>
          <span className="hero-var__precision-spec-label">Cruise Speed</span>
        </div>
        <div className="hero-var__precision-spec">
          <span className="hero-var__precision-spec-value">350</span>
          <span className="hero-var__precision-spec-unit">NM</span>
          <span className="hero-var__precision-spec-label">Range</span>
        </div>
      </div>

      <div className="hero-var__precision-hero">
        <img src={imgs.r66} alt="" />
        <div className="hero-var__precision-model">R66 Turbine</div>
      </div>

      <div className="hero-var__precision-cta">
        <h1 className="hero-var__headline--precision">
          Engineered<br/>Excellence
        </h1>
        <Link to="/aircraft" className="hero-var__btn--precision">
          Configure Yours
          <span className="hero-var__btn-arrow-right">→</span>
        </Link>
      </div>
    </div>

    <div className="hero-var__precision-footer">
      <span>Robinson Helicopter Company</span>
      <span>•</span>
      <span>Authorized Service Centre</span>
    </div>
  </section>
);

// ============================================
// 93. HERITAGE STORYTELLING
// Warm Luxury - Patek Philippe, Cartier inspired
// ============================================
export const Hero93_HeritageStorytelling = () => (
  <section className="hero-var hero-var--heritage">
    <div className="hero-var__heritage-texture"></div>

    <div className="hero-var__heritage-border">
      <span></span><span></span><span></span><span></span>
    </div>

    <header className="hero-var__heritage-header">
      <div className="hero-var__heritage-crest">
        <span className="hero-var__heritage-crest-year">1990</span>
        <span className="hero-var__heritage-crest-name">HQ Aviation</span>
        <span className="hero-var__heritage-crest-motto">Excellence in Flight</span>
      </div>
    </header>

    <div className="hero-var__heritage-content">
      <div className="hero-var__heritage-intro">
        <span className="hero-var__heritage-chapter">Chapter One</span>
        <div className="hero-var__heritage-ornament">❧</div>
      </div>

      <h1 className="hero-var__headline--heritage">
        A Legacy of<br/>
        <span>Distinction</span>
      </h1>

      <p className="hero-var__heritage-desc">
        For over three decades, we have devoted ourselves to the art of helicopter aviation.
        Each flight, a testament to our unwavering commitment to excellence.
      </p>

      <div className="hero-var__heritage-timeline">
        <div className="hero-var__heritage-year">
          <span>1990</span>
          <span>Founded</span>
        </div>
        <div className="hero-var__heritage-timeline-line"></div>
        <div className="hero-var__heritage-year">
          <span>2024</span>
          <span>Present</span>
        </div>
      </div>

      <Link to="/about" className="hero-var__btn--heritage">
        Discover Our Story
      </Link>
    </div>

    <div className="hero-var__heritage-image">
      <div className="hero-var__heritage-frame">
        <img src={imgs.hangar} alt="" />
      </div>
      <span className="hero-var__heritage-image-caption">The Hangar at Denham Aerodrome</span>
    </div>
  </section>
);

// ============================================
// 94. ORGANIC SOFTNESS
// Tactile Wellness - Six Senses, Loro Piana inspired
// ============================================
export const Hero94_OrganicSoftness = () => (
  <section className="hero-var hero-var--organic">
    <div className="hero-var__organic-bg">
      <div className="hero-var__organic-shape hero-var__organic-shape--1"></div>
      <div className="hero-var__organic-shape hero-var__organic-shape--2"></div>
    </div>

    <header className="hero-var__organic-header">
      <span className="hero-var__organic-logo">hq aviation</span>
      <nav className="hero-var__organic-nav">
        <span>training</span>
        <span>fleet</span>
        <span>experiences</span>
        <span>contact</span>
      </nav>
    </header>

    <div className="hero-var__organic-content">
      <div className="hero-var__organic-text">
        <span className="hero-var__organic-pre">breathe. fly. discover.</span>

        <h1 className="hero-var__headline--organic">
          The gentle art<br/>
          of taking flight
        </h1>

        <p className="hero-var__organic-desc">
          A sanctuary in the sky. Where every journey is a meditation,
          and every horizon holds the promise of something beautiful.
        </p>

        <Link to="/training" className="hero-var__btn--organic">
          begin your journey
        </Link>
      </div>

      <div className="hero-var__organic-image">
        <img src={imgs.r44} alt="" />
      </div>
    </div>

    <div className="hero-var__organic-footer">
      <div className="hero-var__organic-values">
        <span>mindful</span>
        <span>•</span>
        <span>sustainable</span>
        <span>•</span>
        <span>serene</span>
      </div>
    </div>
  </section>
);

// ============================================
// EXPORT ALL VARIATIONS
// ============================================
export const heroVariations = [
  // Cinematic
  { id: 'hero-01', name: 'Cinematic Letterbox', category: 'Cinematic', desc: 'Film-inspired with dramatic letterboxing', Component: Hero01_CinematicLetterbox },
  { id: 'hero-36', name: 'Vintage Film', category: 'Cinematic', desc: 'Retro film grain and vignette', Component: Hero36_VintageFilm },
  { id: 'hero-55', name: 'Video Hero', category: 'Cinematic', desc: 'Video-style with playback UI', Component: Hero55_VideoHero },

  // Glassmorphism
  { id: 'hero-02', name: 'Glass Card', category: 'Glassmorphism', desc: 'Frosted glass floating card with depth', Component: Hero02_GlassCard },
  { id: 'hero-16', name: 'Floating Cards', category: 'Glassmorphism', desc: 'Multiple floating glass cards', Component: Hero16_FloatingCards },
  { id: 'hero-37', name: 'Holographic', category: 'Glassmorphism', desc: 'Iridescent holographic shimmer', Component: Hero37_Holographic },

  // Editorial
  { id: 'hero-03', name: 'Editorial Magazine', category: 'Editorial', desc: 'Bold typography, magazine layout', Component: Hero03_Editorial },
  { id: 'hero-12', name: 'Brutalist', category: 'Editorial', desc: 'Raw, bold, unapologetic design', Component: Hero12_Brutalist },
  { id: 'hero-34', name: 'Newspaper', category: 'Editorial', desc: 'Classic broadsheet newspaper', Component: Hero34_Newspaper },
  { id: 'hero-58', name: 'Magazine Cover', category: 'Editorial', desc: 'Fashion magazine cover style', Component: Hero58_MagazineCover },

  // Immersive
  { id: 'hero-04', name: 'Immersive Fullbleed', category: 'Immersive', desc: 'Edge-to-edge with floating elements', Component: Hero04_ImmersiveFullbleed },
  { id: 'hero-17', name: 'Scroll Prompt', category: 'Immersive', desc: 'Bold with animated scroll cue', Component: Hero17_ScrollPrompt },
  { id: 'hero-26', name: 'Vertical Scroll', category: 'Immersive', desc: 'Tall scrolling sticky hero', Component: Hero26_VerticalScroll },
  { id: 'hero-50', name: 'Horizontal Scroll', category: 'Immersive', desc: 'Side-scrolling hero panels', Component: Hero50_HorizontalScroll },

  // Bento
  { id: 'hero-05', name: 'Bento Grid', category: 'Bento', desc: 'Apple-inspired modular grid', Component: Hero05_BentoGrid },
  { id: 'hero-20', name: 'Asymmetric Grid', category: 'Bento', desc: 'Offset asymmetric layout', Component: Hero20_AsymmetricGrid },
  { id: 'hero-44', name: 'Photo Mosaic', category: 'Bento', desc: 'Creative photo grid arrangement', Component: Hero44_PhotoMosaic },
  { id: 'hero-38', name: 'Color Blocks', category: 'Bento', desc: 'Mondrian-inspired color blocking', Component: Hero38_ColorBlocks },

  // Kinetic
  { id: 'hero-06', name: 'Kinetic Typography', category: 'Kinetic', desc: 'Animated text reveal', Component: Hero06_KineticType },
  { id: 'hero-24', name: 'Marquee', category: 'Kinetic', desc: 'Scrolling text banner', Component: Hero24_Marquee },
  { id: 'hero-28', name: 'Typewriter', category: 'Kinetic', desc: 'Text typing animation', Component: Hero28_Typewriter },
  { id: 'hero-42', name: 'Text Scramble', category: 'Kinetic', desc: 'Characters scramble on reveal', Component: Hero42_TextScramble },
  { id: 'hero-45', name: 'Gradient Text', category: 'Kinetic', desc: 'Animated gradient text fill', Component: Hero45_GradientText },

  // Minimal
  { id: 'hero-07', name: 'Minimal Luxury', category: 'Minimal', desc: 'Ultra-clean, refined elegance', Component: Hero07_MinimalLuxury },
  { id: 'hero-15', name: 'Text Mask', category: 'Minimal', desc: 'Image revealed through text', Component: Hero15_TextMask },
  { id: 'hero-43', name: 'Mono Sans', category: 'Minimal', desc: 'Ultra-minimal monospace aesthetic', Component: Hero43_MonoSans },
  { id: 'hero-53', name: 'Outline Text', category: 'Minimal', desc: 'Large outlined typography', Component: Hero53_OutlineText },

  // Dark
  { id: 'hero-08', name: 'Dark Elegance', category: 'Dark', desc: 'Sophisticated dark theme', Component: Hero08_DarkElegance },
  { id: 'hero-14', name: 'Duotone', category: 'Dark', desc: 'Two-color image treatment', Component: Hero14_Duotone },
  { id: 'hero-19', name: 'Noise Texture', category: 'Dark', desc: 'Subtle grain overlay', Component: Hero19_NoiseTexture },
  { id: 'hero-32', name: 'Neon Glow', category: 'Dark', desc: 'Cyberpunk neon aesthetic', Component: Hero32_NeonGlow },
  { id: 'hero-59', name: 'Terminal', category: 'Dark', desc: 'Developer/hacker aesthetic', Component: Hero59_Terminal },

  // Split
  { id: 'hero-09', name: 'Split Diagonal', category: 'Split', desc: 'Asymmetric diagonal split', Component: Hero09_SplitDiagonal },
  { id: 'hero-22', name: 'Split Hover', category: 'Split', desc: 'Two halves with hover reveal', Component: Hero22_SplitHover },
  { id: 'hero-27', name: 'Sidebar Layout', category: 'Split', desc: 'Side panel with content', Component: Hero27_SidebarLayout },
  { id: 'hero-40', name: 'Curtain Reveal', category: 'Split', desc: 'Two panels reveal content', Component: Hero40_CurtainReveal },
  { id: 'hero-51', name: 'Split Personality', category: 'Split', desc: 'Day/night toggle split', Component: Hero51_SplitPersonality },
  { id: 'hero-57', name: 'Comparison Slider', category: 'Split', desc: 'Before/after comparison', Component: Hero57_ComparisonSlider },

  // Interactive
  { id: 'hero-10', name: 'Interactive Reveal', category: 'Interactive', desc: 'Reveal on mouse movement', Component: Hero10_InteractiveReveal },
  { id: 'hero-21', name: 'Counter Animation', category: 'Interactive', desc: 'Animated statistics', Component: Hero21_CounterAnimation },
  { id: 'hero-30', name: 'Reveal Scroll', category: 'Interactive', desc: 'Content reveals on scroll', Component: Hero30_RevealScroll },
  { id: 'hero-33', name: 'Perspective Tilt', category: 'Interactive', desc: '3D tilt card on hover', Component: Hero33_PerspectiveTilt },
  { id: 'hero-35', name: 'Spotlight Cursor', category: 'Interactive', desc: 'Spotlight follows mouse', Component: Hero35_Spotlight },

  // Effect
  { id: 'hero-11', name: 'Gradient Mesh', category: 'Effect', desc: 'Modern gradient background', Component: Hero11_GradientMesh },
  { id: 'hero-13', name: 'Parallax Layers', category: 'Effect', desc: 'Multi-layer depth effect', Component: Hero13_ParallaxLayers },
  { id: 'hero-18', name: 'Organic Shapes', category: 'Effect', desc: 'Blob-like organic forms', Component: Hero18_OrganicShapes },
  { id: 'hero-23', name: 'Stacked Panels', category: 'Effect', desc: 'Overlapping layered panels', Component: Hero23_StackedPanels },
  { id: 'hero-25', name: 'Focus Ring', category: 'Effect', desc: 'Circular focus area', Component: Hero25_FocusRing },
  { id: 'hero-29', name: 'Geometric Pattern', category: 'Effect', desc: 'Abstract geometric background', Component: Hero29_GeometricPattern },
  { id: 'hero-31', name: 'Aurora Gradient', category: 'Effect', desc: 'Animated northern lights', Component: Hero31_Aurora },
  { id: 'hero-41', name: 'Animated Border', category: 'Effect', desc: 'Pulsing border animation', Component: Hero41_AnimatedBorder },
  { id: 'hero-48', name: 'Clip Path Reveal', category: 'Effect', desc: 'Creative clip-path shapes', Component: Hero48_ClipPathReveal },
  { id: 'hero-49', name: 'Particle Dots', category: 'Effect', desc: 'Animated dot particles', Component: Hero49_ParticleDots },
  { id: 'hero-54', name: 'Morphing Shapes', category: 'Effect', desc: 'Animated morphing blobs', Component: Hero54_MorphingShapes },

  // Premium
  { id: 'hero-39', name: 'Layered Paper', category: 'Premium', desc: 'Stacked paper card effect', Component: Hero39_LayeredPaper },
  { id: 'hero-46', name: 'Rotated Grid', category: 'Premium', desc: 'Angled grid layout', Component: Hero46_RotatedGrid },
  { id: 'hero-47', name: 'Floating Elements', category: 'Premium', desc: 'Multiple floating UI elements', Component: Hero47_FloatingElements },
  { id: 'hero-52', name: 'Sticky Stack', category: 'Premium', desc: 'Cards stack on scroll', Component: Hero52_StickyStack },
  { id: 'hero-56', name: 'Price Tag', category: 'Premium', desc: 'E-commerce inspired hero', Component: Hero56_PriceTag },
  { id: 'hero-60', name: 'Luxury Brand', category: 'Premium', desc: 'High-end luxury aesthetic', Component: Hero60_LuxuryBrand },

  // Brand Identity Systems
  { id: 'hero-61', name: 'Zen Minimal', category: 'Brand Identity', desc: 'Japanese wabi-sabi aesthetic with asymmetric balance', Component: Hero61_ZenMinimal },
  { id: 'hero-62', name: 'Swiss Precision', category: 'Brand Identity', desc: 'Bauhaus-inspired strict grid with primary colors', Component: Hero62_SwissPrecision },
  { id: 'hero-63', name: 'Art Deco Opulence', category: 'Brand Identity', desc: '1920s glamour with gold and geometric patterns', Component: Hero63_ArtDeco },
  { id: 'hero-64', name: 'Neo-Tokyo Cyber', category: 'Brand Identity', desc: 'Cyberpunk aesthetic with neon and glitch effects', Component: Hero64_NeoTokyo },
  { id: 'hero-65', name: 'Organic Biophilic', category: 'Brand Identity', desc: 'Nature-inspired with flowing curves and earth tones', Component: Hero65_OrganicBio },

  // Luxury Minimal
  { id: 'hero-66', name: 'Refined Monochrome', category: 'Luxury Minimal', desc: 'Ultra-minimal black and white with exquisite typography', Component: Hero66_RefinedMono },
  { id: 'hero-67', name: 'Floating Typography', category: 'Luxury Minimal', desc: 'Large floating letters with parallax depth effect', Component: Hero67_FloatingType },
  { id: 'hero-68', name: 'Luminous Gradient', category: 'Luxury Minimal', desc: 'Soft sophisticated gradient with glass elements', Component: Hero68_Luminous },
  { id: 'hero-69', name: 'Architectural Grid', category: 'Luxury Minimal', desc: 'Clean lines inspired by modern architecture', Component: Hero69_Architectural },
  { id: 'hero-70', name: 'Silk Motion', category: 'Luxury Minimal', desc: 'Smooth flowing animated gradient waves', Component: Hero70_SilkMotion },
  { id: 'hero-71', name: 'Statement Serif', category: 'Luxury Minimal', desc: 'Bold serif typography with editorial luxury', Component: Hero71_StatementSerif },
  { id: 'hero-72', name: 'Negative Space', category: 'Luxury Minimal', desc: 'Extreme whitespace with single focal element', Component: Hero72_NegativeSpace },
  { id: 'hero-73', name: 'Golden Hour', category: 'Luxury Minimal', desc: 'Warm luxurious tones with cinematic warmth', Component: Hero73_GoldenHour },
  { id: 'hero-74', name: 'Whisper', category: 'Luxury Minimal', desc: 'Ultra-light typography with barely-there elements', Component: Hero74_Whisper },
  { id: 'hero-75', name: 'Prestige Dark', category: 'Luxury Minimal', desc: 'Dark luxury with subtle sophisticated accents', Component: Hero75_PrestigeDark },

  // Architectural
  { id: 'hero-76', name: 'Arch Dark', category: 'Architectural', desc: 'Dark mode architectural with cream grid lines', Component: Hero76_ArchDark },
  { id: 'hero-77', name: 'Arch Blueprint', category: 'Architectural', desc: 'Blueprint style with technical drawing aesthetic', Component: Hero77_ArchBlueprint },
  { id: 'hero-78', name: 'Arch Golden', category: 'Architectural', desc: 'Golden ratio grid with luxury gold accents', Component: Hero78_ArchGolden },
  { id: 'hero-79', name: 'Arch Brutalist', category: 'Architectural', desc: 'Heavy concrete brutalist with bold grid lines', Component: Hero79_ArchBrutalist },
  { id: 'hero-80', name: 'Arch Asymmetric', category: 'Architectural', desc: 'Off-center composition with dynamic tension', Component: Hero80_ArchAsymmetric },
  { id: 'hero-81', name: 'Arch Animated', category: 'Architectural', desc: 'Grid lines animate into position on load', Component: Hero81_ArchAnimated },
  { id: 'hero-82', name: 'Arch Mosaic', category: 'Architectural', desc: 'Multiple images arranged in grid cells', Component: Hero82_ArchMosaic },
  { id: 'hero-83', name: 'Arch Vertical', category: 'Architectural', desc: 'Vertical emphasis with tall column layout', Component: Hero83_ArchVertical },
  { id: 'hero-84', name: 'Arch Inverted', category: 'Architectural', desc: 'Reversed layout with image on left', Component: Hero84_ArchInverted },
  { id: 'hero-85', name: 'Arch Neon', category: 'Architectural', desc: 'Dark with subtle neon glowing grid lines', Component: Hero85_ArchNeon },
  { id: 'hero-86', name: 'Arch Terracotta', category: 'Architectural', desc: 'Warm terracotta earth tones', Component: Hero86_ArchTerracotta },
  { id: 'hero-87', name: 'Arch Monochrome', category: 'Architectural', desc: 'Pure black and white high contrast', Component: Hero87_ArchMonochrome },

  // Brand Systems
  { id: 'hero-88', name: 'Gallery Aesthetic', category: 'Brand Systems', desc: 'Quiet Luxury - The Row, Aman, Céline inspired', Component: Hero88_GalleryAesthetic },
  { id: 'hero-89', name: 'Cinematic Narrative', category: 'Brand Systems', desc: 'Immersive - Rolls-Royce, Belmond inspired', Component: Hero89_CinematicNarrative },
  { id: 'hero-90', name: 'Editorial Grid', category: 'Brand Systems', desc: 'Curated Commerce - Net-a-Porter, Sotheby\'s inspired', Component: Hero90_EditorialGrid },
  { id: 'hero-91', name: 'Neo-Brutalism', category: 'Brand Systems', desc: 'Avant-Garde - Ssense, Jil Sander inspired', Component: Hero91_NeoBrutalism },
  { id: 'hero-92', name: 'Precision Engineering', category: 'Brand Systems', desc: 'High-Performance - Porsche, Rimowa inspired', Component: Hero92_PrecisionEngineering },
  { id: 'hero-93', name: 'Heritage Storytelling', category: 'Brand Systems', desc: 'Warm Luxury - Patek Philippe, Cartier inspired', Component: Hero93_HeritageStorytelling },
  { id: 'hero-94', name: 'Organic Softness', category: 'Brand Systems', desc: 'Tactile Wellness - Six Senses, Loro Piana inspired', Component: Hero94_OrganicSoftness },
];

export default heroVariations;

# Maintenance Page Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Build a 30-section immersive maintenance page following HQ Aviation's "Luxury Minimal Aviation" design language.

**Architecture:** Single-file React component with inline styles, Framer Motion animations, and reusable sub-components (MaintenanceHeader, Reveal, AnimatedNumber, ParallaxSection). Page renders outside Layout wrapper for full-screen immersive experience.

**Tech Stack:** React, Framer Motion, react-router-dom, FooterMinimal component

---

## Phase 1: Foundation (Tasks 1-3)

### Task 1: Create Base File Structure

**Files:**
- Create: `src/pages/FinalMaintenance.jsx`
- Modify: `src/App.jsx`

**Step 1: Create the base component file**

```jsx
/**
 * FINAL MAINTENANCE PAGE
 *
 * Brand: Luxury Minimal Aviation
 * Typography: Space Grotesk + Share Tech Mono
 * Colors: #faf9f6 (warm white), #1a1a1a (charcoal)
 * 30 Sections - Immersive Brand Experience
 */

import React, { useRef, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, useInView, useScroll, useTransform } from 'framer-motion';

import '../assets/css/main.css';
import '../assets/css/components.css';
import FooterMinimal from '../components/FooterMinimal';

function FinalMaintenance() {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="maint">
      <p>Maintenance Page - Foundation</p>
      <FooterMinimal />
    </div>
  );
}

export default FinalMaintenance;
```

**Step 2: Add route to App.jsx**

Add after line 29 (after SelfFlyHire import):
```jsx
import FinalMaintenance from './pages/FinalMaintenance';
```

Add route after line 58 (after self-fly-hire route):
```jsx
<Route path="/maintenance" element={<FinalMaintenance />} />
```

**Step 3: Verify dev server runs**

Run: `cd "/Users/maximussmith/Desktop/Squarespace/public website/hq-aviation-react" && npm run dev`
Expected: Dev server starts, navigate to /maintenance shows "Maintenance Page - Foundation"

**Step 4: Commit**

```bash
git add src/pages/FinalMaintenance.jsx src/App.jsx
git commit -m "feat: add FinalMaintenance page foundation

Co-Authored-By: Claude Opus 4.5 <noreply@anthropic.com>"
```

---

### Task 2: Add Inline Styles Foundation

**Files:**
- Modify: `src/pages/FinalMaintenance.jsx`

**Step 1: Add the base styles block**

Add before `function FinalMaintenance()`:

```jsx
const styles = `
/* ========================================
   MAINTENANCE PAGE STYLES
   CSS Prefix: .maint-
   ======================================== */

/* Base Reset & Typography */
.maint {
  font-family: 'Space Grotesk', -apple-system, sans-serif;
  background: #faf9f6;
  color: #1a1a1a;
  line-height: 1.6;
  overflow-x: hidden;
}

.maint * {
  box-sizing: border-box;
}

/* Typography Utilities */
.maint-pre-text {
  font-family: 'Share Tech Mono', monospace;
  font-size: 0.7rem;
  letter-spacing: 0.2em;
  text-transform: uppercase;
  color: #888;
  margin-bottom: 1rem;
  display: block;
}

.maint-headline {
  font-size: clamp(2rem, 5vw, 3.5rem);
  font-weight: 600;
  line-height: 1.1;
  margin: 0 0 1.5rem 0;
}

.maint-text--dark { color: #1a1a1a; }
.maint-text--mid { color: #4a4a4a; }
.maint-text--light { color: #7a7a7a; }

.maint-body {
  font-size: 1rem;
  color: #666;
  max-width: 600px;
  line-height: 1.7;
}

/* Section Spacing */
.maint-section {
  padding: 5rem 2rem;
}

.maint-section--dark {
  background: #1a1a1a;
  color: #faf9f6;
}

.maint-section--alt {
  background: #ffffff;
}

.maint-container {
  max-width: 1200px;
  margin: 0 auto;
}

.maint-container--narrow {
  max-width: 800px;
}

/* Shared Components */
.maint-divider {
  width: 80px;
  height: 1px;
  background: #1a1a1a;
  margin: 1.5rem 0;
}

.maint-divider--white {
  background: #faf9f6;
}
`;
```

**Step 2: Inject styles in component**

Update the return statement:
```jsx
return (
  <div className="maint">
    <style>{styles}</style>
    <p>Maintenance Page - With Styles</p>
    <FooterMinimal />
  </div>
);
```

**Step 3: Verify styles apply**

Run: Dev server should hot reload
Expected: Page has warm white background, Space Grotesk font

**Step 4: Commit**

```bash
git add src/pages/FinalMaintenance.jsx
git commit -m "feat: add base styles for maintenance page

Co-Authored-By: Claude Opus 4.5 <noreply@anthropic.com>"
```

---

### Task 3: Add Reusable Sub-Components

**Files:**
- Modify: `src/pages/FinalMaintenance.jsx`

**Step 1: Add Reveal component**

Add after imports, before styles:

```jsx
// Animated reveal wrapper
function Reveal({ children, delay = 0, direction = 'up' }) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.2 });

  const variants = {
    hidden: {
      opacity: 0,
      y: direction === 'up' ? 40 : direction === 'down' ? -40 : 0,
      x: direction === 'left' ? 40 : direction === 'right' ? -40 : 0,
    },
    visible: {
      opacity: 1,
      y: 0,
      x: 0,
    },
  };

  return (
    <motion.div
      ref={ref}
      initial="hidden"
      animate={isInView ? 'visible' : 'hidden'}
      variants={variants}
      transition={{ duration: 0.8, delay, ease: [0.16, 1, 0.3, 1] }}
    >
      {children}
    </motion.div>
  );
}
```

**Step 2: Add AnimatedNumber component**

```jsx
// Animated counter
function AnimatedNumber({ value, suffix = '' }) {
  const [count, setCount] = useState(0);
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });

  useEffect(() => {
    if (isInView) {
      const num = parseInt(value.toString().replace(/[^0-9]/g, ''));
      const duration = 2000;
      const steps = 60;
      const increment = num / steps;
      let current = 0;
      const timer = setInterval(() => {
        current += increment;
        if (current >= num) {
          setCount(num);
          clearInterval(timer);
        } else {
          setCount(Math.floor(current));
        }
      }, duration / steps);
      return () => clearInterval(timer);
    }
  }, [isInView, value]);

  return <span ref={ref}>{count}{suffix}</span>;
}
```

**Step 3: Test components render**

Update return to test:
```jsx
return (
  <div className="maint">
    <style>{styles}</style>
    <div style={{ padding: '100px 2rem' }}>
      <Reveal>
        <h1>Test Reveal</h1>
      </Reveal>
      <p>Count: <AnimatedNumber value={100} suffix="+" /></p>
    </div>
    <FooterMinimal />
  </div>
);
```

**Step 4: Verify animations work**

Expected: Heading fades in on scroll, number counts up

**Step 5: Commit**

```bash
git add src/pages/FinalMaintenance.jsx
git commit -m "feat: add Reveal and AnimatedNumber sub-components

Co-Authored-By: Claude Opus 4.5 <noreply@anthropic.com>"
```

---

## Phase 2: Header & Hero (Tasks 4-6)

### Task 4: Add MaintenanceHeader Component

**Files:**
- Modify: `src/pages/FinalMaintenance.jsx`

**Step 1: Add MaintenanceHeader component**

Add after AnimatedNumber component:

```jsx
// Header with spotlight animation
function MaintenanceHeader() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [colorDark, setColorDark] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [verticalProgress, setVerticalProgress] = useState(0);
  const [horizontalProgress, setHorizontalProgress] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY;
      const vProgress = Math.min(scrollY / 150, 1);
      setVerticalProgress(vProgress);
      const hProgress = Math.min(scrollY / 300, 1);
      setHorizontalProgress(hProgress);
      setColorDark(scrollY > 300);
      setScrolled(scrollY > 300);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
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

  const spotlightHeight = 95 + Math.round(verticalProgress * 405);
  const spotlightWidth = 214 + Math.round(horizontalProgress * 1786);

  return (
    <>
      {/* Menu Panel */}
      <div className={`hq-menu-panel ${menuOpen ? 'open' : ''}`}>
        <div className="hq-menu-grid">
          <div className="hq-menu-section">
            <h3>About</h3>
            <ul>
              <li><Link to="/" onClick={closeMenu}>Home</Link></li>
              <li><Link to="/about-us" onClick={closeMenu}>About Us</Link></li>
              <li><Link to="/about-us/team" onClick={closeMenu}>Meet The Team</Link></li>
              <li><Link to="/contact" onClick={closeMenu}>Contact</Link></li>
            </ul>
          </div>
          <div className="hq-menu-section">
            <h3>Aircraft Sales</h3>
            <ul>
              <li><Link to="/sales" onClick={closeMenu}>New Aircraft</Link></li>
            </ul>
          </div>
          <div className="hq-menu-section">
            <h3>Flight Training</h3>
            <ul>
              <li><Link to="/training" onClick={closeMenu}>Training Overview</Link></li>
              <li><Link to="/training/ppl" onClick={closeMenu}>Private Pilot License</Link></li>
            </ul>
          </div>
          <div className="hq-menu-section">
            <h3>Services</h3>
            <ul>
              <li><Link to="/services" onClick={closeMenu}>Services Overview</Link></li>
              <li><Link to="/maintenance" onClick={closeMenu}>Maintenance</Link></li>
            </ul>
          </div>
        </div>
      </div>

      {/* Menu Button */}
      <button
        className={`hq-menu-btn ${colorDark ? 'color-dark' : ''} ${scrolled ? 'scrolled' : ''} ${menuOpen ? 'open' : ''}`}
        onClick={toggleMenu}
        aria-label="Toggle menu"
        aria-expanded={menuOpen}
      >
        <span></span>
        <span></span>
        <span></span>
      </button>

      {/* Header with Spotlight */}
      <header
        className={`Header Header--top ${scrolled ? 'Header--scrolled' : ''}`}
        style={{
          '--spotlight-width': `${spotlightWidth}px`,
          '--spotlight-height': `${spotlightHeight}px`
        }}
      >
        <div className="Header-inner Header-inner--top" data-nc-group="top">
          <div data-nc-container="top-left"></div>
          <div data-nc-container="top-center">
            <Link to="/" className="Header-branding" data-nc-element="branding">
              <img
                src="/assets/images/logos/hq/hq-aviation-logo-black.png"
                alt="HQ Aviation"
                className="Header-branding-logo"
                loading="lazy"
              />
            </Link>
            <nav className="Header-nav Header-nav--secondary" data-nc-element="secondary-nav">
              <div className="Header-nav-inner">
                <Link to="/training" className="Header-nav-item">Training</Link>
                <Link to="/sales" className="Header-nav-item">Aircraft</Link>
                <Link to="/maintenance" className="Header-nav-item">Maintenance</Link>
              </div>
            </nav>
          </div>
          <div data-nc-container="top-right"></div>
        </div>
      </header>
    </>
  );
}
```

**Step 2: Use header in main component**

```jsx
return (
  <div className="maint">
    <style>{styles}</style>
    <MaintenanceHeader />
    <div style={{ height: '200vh', padding: '100px 2rem' }}>
      <h1>Scroll to test header</h1>
    </div>
    <FooterMinimal />
  </div>
);
```

**Step 3: Verify header works**

Expected: Header spotlight animation on scroll, menu opens/closes

**Step 4: Commit**

```bash
git add src/pages/FinalMaintenance.jsx
git commit -m "feat: add MaintenanceHeader with spotlight animation

Co-Authored-By: Claude Opus 4.5 <noreply@anthropic.com>"
```

---

### Task 5: Add Hero Section (Section 1)

**Files:**
- Modify: `src/pages/FinalMaintenance.jsx`

**Step 1: Add hero styles to styles constant**

```css
/* ========== SECTION 1: HERO ========== */
.maint-hero {
  position: relative;
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
}

.maint-hero__bg {
  position: absolute;
  inset: 0;
  z-index: 0;
}

.maint-hero__bg img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.maint-hero__overlay {
  position: absolute;
  inset: 0;
  background: linear-gradient(
    to bottom,
    rgba(0,0,0,0.3) 0%,
    rgba(0,0,0,0.5) 50%,
    rgba(0,0,0,0.7) 100%
  );
  z-index: 1;
}

.maint-hero__grid {
  position: absolute;
  inset: 0;
  z-index: 2;
  pointer-events: none;
}

.maint-hero__grid-line {
  position: absolute;
  background: rgba(255,255,255,0.1);
}

.maint-hero__grid-line--v {
  width: 1px;
  height: 100%;
  top: 0;
}

.maint-hero__grid-line--h {
  height: 1px;
  width: 100%;
  left: 0;
}

.maint-hero__content {
  position: relative;
  z-index: 3;
  text-align: center;
  color: #faf9f6;
  padding: 2rem;
}

.maint-hero__label {
  font-family: 'Share Tech Mono', monospace;
  font-size: 0.7rem;
  letter-spacing: 0.3em;
  text-transform: uppercase;
  color: rgba(250,249,246,0.7);
  margin-bottom: 2rem;
  display: block;
}

.maint-hero__headline {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.25rem;
}

.maint-hero__word {
  font-size: clamp(3rem, 10vw, 7rem);
  font-weight: 600;
  line-height: 1;
  text-transform: uppercase;
}

.maint-hero__word--1 { color: #faf9f6; }
.maint-hero__word--2 { color: rgba(250,249,246,0.7); }
.maint-hero__word--3 { color: rgba(250,249,246,0.5); }

.maint-hero__divider {
  width: 80px;
  height: 1px;
  background: #faf9f6;
  margin: 2rem auto;
  transform-origin: center;
}

.maint-hero__coords {
  font-family: 'Share Tech Mono', monospace;
  font-size: 0.75rem;
  letter-spacing: 0.15em;
  color: rgba(250,249,246,0.6);
}
```

**Step 2: Add hero section JSX**

Add hero section in return (replace test content):

```jsx
{/* ========== SECTION 1: HERO ========== */}
<section className="maint-hero">
  <motion.div
    className="maint-hero__bg"
    initial={{ scale: 1.1, opacity: 0 }}
    animate={{ scale: 1, opacity: 1 }}
    transition={{ duration: 1.5 }}
  >
    <img src="/assets/images/facility/maintenance-hangar.jpg" alt="" />
  </motion.div>
  <div className="maint-hero__overlay" />

  {/* Animated grid lines */}
  <div className="maint-hero__grid">
    {[20, 40, 60, 80].map((pos, i) => (
      <motion.div
        key={`v-${i}`}
        className="maint-hero__grid-line maint-hero__grid-line--v"
        style={{ left: `${pos}%` }}
        initial={{ scaleY: 0 }}
        animate={{ scaleY: 1 }}
        transition={{ duration: 1, delay: 0.1 * i, ease: [0.16, 1, 0.3, 1] }}
      />
    ))}
    {[33, 66].map((pos, i) => (
      <motion.div
        key={`h-${i}`}
        className="maint-hero__grid-line maint-hero__grid-line--h"
        style={{ top: `${pos}%` }}
        initial={{ scaleX: 0 }}
        animate={{ scaleX: 1 }}
        transition={{ duration: 1, delay: 0.4 + 0.1 * i, ease: [0.16, 1, 0.3, 1] }}
      />
    ))}
  </div>

  <div className="maint-hero__content">
    <motion.span
      className="maint-hero__label"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2 }}
    >
      EASA PART 145 APPROVED
    </motion.span>

    <div className="maint-hero__headline">
      <motion.span
        className="maint-hero__word maint-hero__word--1"
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.4, ease: [0.16, 1, 0.3, 1] }}
      >
        PRECISION
      </motion.span>
      <motion.span
        className="maint-hero__word maint-hero__word--2"
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.6, ease: [0.16, 1, 0.3, 1] }}
      >
        ENGINEERING
      </motion.span>
      <motion.span
        className="maint-hero__word maint-hero__word--3"
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.8, ease: [0.16, 1, 0.3, 1] }}
      >
        EXCELLENCE
      </motion.span>
    </div>

    <motion.div
      className="maint-hero__divider"
      initial={{ scaleX: 0 }}
      animate={{ scaleX: 1 }}
      transition={{ duration: 0.8, delay: 1, ease: [0.16, 1, 0.3, 1] }}
    />

    <motion.span
      className="maint-hero__coords"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 1.2 }}
    >
      51.5751°N • 0.5059°W
    </motion.span>
  </div>
</section>
```

**Step 3: Verify hero renders**

Expected: Full-screen hero with animated grid lines, staggered text reveal

**Step 4: Commit**

```bash
git add src/pages/FinalMaintenance.jsx
git commit -m "feat: add hero section with spotlight and grid animations

Co-Authored-By: Claude Opus 4.5 <noreply@anthropic.com>"
```

---

### Task 6: Add Scroll Prompt (Section 2)

**Files:**
- Modify: `src/pages/FinalMaintenance.jsx`

**Step 1: Add scroll prompt styles**

```css
/* ========== SECTION 2: SCROLL PROMPT ========== */
.maint-scroll-prompt {
  position: fixed;
  bottom: 1.5rem;
  left: 50%;
  transform: translateX(-50%);
  z-index: 10;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.75rem;
  transition: opacity 0.3s ease;
}

.maint-scroll-prompt--hidden {
  opacity: 0;
  pointer-events: none;
}

.maint-scroll-prompt__text {
  font-family: 'Share Tech Mono', monospace;
  font-size: 0.65rem;
  letter-spacing: 0.2em;
  text-transform: uppercase;
  color: rgba(250,249,246,0.6);
}

.maint-scroll-prompt__line {
  width: 1px;
  height: 50px;
  background: rgba(250,249,246,0.2);
  position: relative;
  overflow: hidden;
}

.maint-scroll-prompt__line::after {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 30%;
  background: rgba(250,249,246,0.8);
  animation: scrollLine 1.5s ease-in-out infinite;
}

@keyframes scrollLine {
  0% { top: -30%; }
  100% { top: 100%; }
}
```

**Step 2: Add scroll prompt state and JSX**

Add state in FinalMaintenance:
```jsx
const [showScrollPrompt, setShowScrollPrompt] = useState(true);

useEffect(() => {
  const handleScroll = () => {
    setShowScrollPrompt(window.scrollY < 100);
  };
  window.addEventListener('scroll', handleScroll, { passive: true });
  return () => window.removeEventListener('scroll', handleScroll);
}, []);
```

Add JSX after hero section:
```jsx
{/* ========== SECTION 2: SCROLL PROMPT ========== */}
<div className={`maint-scroll-prompt ${!showScrollPrompt ? 'maint-scroll-prompt--hidden' : ''}`}>
  <span className="maint-scroll-prompt__text">Scroll to explore</span>
  <div className="maint-scroll-prompt__line" />
</div>
```

**Step 3: Verify scroll prompt**

Expected: Shows at bottom, hides after 100px scroll

**Step 4: Commit**

```bash
git add src/pages/FinalMaintenance.jsx
git commit -m "feat: add scroll prompt with animated line

Co-Authored-By: Claude Opus 4.5 <noreply@anthropic.com>"
```

---

## Phase 3: Stats & Introduction (Tasks 7-8)

### Task 7: Add Stats Counter Strip (Section 3)

**Files:**
- Modify: `src/pages/FinalMaintenance.jsx`

**Step 1: Add stats styles**

```css
/* ========== SECTION 3: STATS STRIP ========== */
.maint-stats {
  background: #1a1a1a;
  padding: 4rem 2rem;
}

.maint-stats__container {
  display: flex;
  justify-content: center;
  gap: 4rem;
  flex-wrap: wrap;
}

.maint-stats__item {
  text-align: center;
}

.maint-stats__value {
  font-family: 'Share Tech Mono', monospace;
  font-size: clamp(2rem, 5vw, 3rem);
  color: #faf9f6;
  display: block;
}

.maint-stats__label {
  font-family: 'Share Tech Mono', monospace;
  font-size: 0.7rem;
  letter-spacing: 0.15em;
  text-transform: uppercase;
  color: rgba(250,249,246,0.5);
  margin-top: 0.5rem;
  display: block;
}

@media (max-width: 768px) {
  .maint-stats__container {
    gap: 2rem;
  }
}
```

**Step 2: Add stats JSX**

```jsx
{/* ========== SECTION 3: STATS STRIP ========== */}
<section className="maint-stats">
  <div className="maint-stats__container">
    <div className="maint-stats__item">
      <span className="maint-stats__value">
        <AnimatedNumber value={85} suffix="+" />
      </span>
      <span className="maint-stats__label">Aircraft Under Care</span>
    </div>
    <div className="maint-stats__item">
      <span className="maint-stats__value">
        <AnimatedNumber value={30} suffix="+" />
      </span>
      <span className="maint-stats__label">Years Experience</span>
    </div>
    <div className="maint-stats__item">
      <span className="maint-stats__value">
        <AnimatedNumber value={100} suffix="%" />
      </span>
      <span className="maint-stats__label">Genuine Parts</span>
    </div>
  </div>
</section>
```

**Step 3: Verify counters animate**

Expected: Numbers count up when section scrolls into view

**Step 4: Commit**

```bash
git add src/pages/FinalMaintenance.jsx
git commit -m "feat: add stats counter strip section

Co-Authored-By: Claude Opus 4.5 <noreply@anthropic.com>"
```

---

### Task 8: Add Philosophy Introduction (Section 4)

**Files:**
- Modify: `src/pages/FinalMaintenance.jsx`

**Step 1: Add philosophy styles**

```css
/* ========== SECTION 4: PHILOSOPHY ========== */
.maint-philosophy {
  padding: 6rem 2rem;
  background: #faf9f6;
}

.maint-philosophy__container {
  max-width: 800px;
  margin: 0 auto;
  text-align: center;
}

.maint-philosophy__headline {
  font-size: clamp(2rem, 4vw, 3rem);
  font-weight: 600;
  line-height: 1.2;
  margin-bottom: 1.5rem;
}

.maint-philosophy__body {
  font-size: 1.1rem;
  color: #666;
  line-height: 1.8;
}
```

**Step 2: Add philosophy JSX**

```jsx
{/* ========== SECTION 4: PHILOSOPHY ========== */}
<section className="maint-philosophy">
  <div className="maint-philosophy__container">
    <Reveal>
      <span className="maint-pre-text">Our Approach</span>
      <h2 className="maint-philosophy__headline">
        <span className="maint-text--dark">Where </span>
        <span className="maint-text--mid">Precision </span>
        <span className="maint-text--light">Meets Care</span>
      </h2>
      <p className="maint-philosophy__body">
        At HQ Aviation, maintenance isn't just a service—it's a commitment to excellence.
        Every inspection, every repair, every overhaul is performed with the same meticulous
        attention to detail that has defined us since 1990.
      </p>
    </Reveal>
  </div>
</section>
```

**Step 3: Verify section renders**

Expected: Centered text with gradient headline, fade-in animation

**Step 4: Commit**

```bash
git add src/pages/FinalMaintenance.jsx
git commit -m "feat: add philosophy introduction section

Co-Authored-By: Claude Opus 4.5 <noreply@anthropic.com>"
```

---

## Phase 4: Parallax & Services Grid (Tasks 9-12)

### Task 9: Add ParallaxSection Component

**Files:**
- Modify: `src/pages/FinalMaintenance.jsx`

**Step 1: Add ParallaxSection component**

```jsx
// Parallax image section with wave overlays
function ParallaxSection({ image, number, label, largeText }) {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start end', 'end start'],
  });
  const y = useTransform(scrollYProgress, [0, 1], ['-15%', '15%']);

  return (
    <section ref={ref} className="maint-parallax">
      <motion.div className="maint-parallax__bg" style={{ y }}>
        <img src={image} alt="" />
      </motion.div>
      <div className="maint-parallax__overlay" />

      {/* Wave overlays */}
      <svg className="maint-parallax__wave maint-parallax__wave--top" viewBox="0 0 1440 100" preserveAspectRatio="none">
        <path d="M0,50 C360,100 1080,0 1440,50 L1440,0 L0,0 Z" fill="#faf9f6"/>
      </svg>
      <svg className="maint-parallax__wave maint-parallax__wave--bottom" viewBox="0 0 1440 100" preserveAspectRatio="none">
        <path d="M0,50 C360,0 1080,100 1440,50 L1440,100 L0,100 Z" fill="#ffffff"/>
      </svg>

      <div className="maint-parallax__content">
        <span className="maint-parallax__number">— {number} —</span>
        <span className="maint-parallax__label">{label}</span>
        <span className="maint-parallax__large">{largeText}</span>
      </div>
    </section>
  );
}
```

**Step 2: Add parallax styles**

```css
/* ========== PARALLAX SECTIONS ========== */
.maint-parallax {
  position: relative;
  height: 400px;
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: center;
}

.maint-parallax__bg {
  position: absolute;
  inset: -15%;
  z-index: 0;
}

.maint-parallax__bg img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.maint-parallax__overlay {
  position: absolute;
  inset: 0;
  background: rgba(0,0,0,0.5);
  z-index: 1;
}

.maint-parallax__wave {
  position: absolute;
  left: 0;
  width: 100%;
  height: 100px;
  z-index: 2;
}

.maint-parallax__wave--top {
  top: 0;
}

.maint-parallax__wave--bottom {
  bottom: 0;
}

.maint-parallax__content {
  position: relative;
  z-index: 3;
  text-align: center;
  color: #faf9f6;
}

.maint-parallax__number {
  font-family: 'Share Tech Mono', monospace;
  font-size: 0.75rem;
  letter-spacing: 0.2em;
  display: block;
  margin-bottom: 0.5rem;
}

.maint-parallax__label {
  font-family: 'Share Tech Mono', monospace;
  font-size: 0.7rem;
  letter-spacing: 0.15em;
  text-transform: uppercase;
  color: rgba(250,249,246,0.7);
  display: block;
  margin-bottom: 1rem;
}

.maint-parallax__large {
  font-size: clamp(4rem, 12vw, 9rem);
  font-weight: 600;
  text-transform: uppercase;
  opacity: 0.7;
  letter-spacing: 0.05em;
  -webkit-text-stroke: 1px rgba(250,249,246,0.3);
  color: transparent;
}
```

**Step 3: Test parallax section**

Add after philosophy:
```jsx
{/* ========== SECTION 5: PARALLAX - HANGAR ========== */}
<ParallaxSection
  image="/assets/images/facility/maintenance-hangar.jpg"
  number="01"
  label="Factory Trained"
  largeText="MAINTENANCE"
/>
```

**Step 4: Verify parallax effect**

Expected: Image moves on scroll, wave overlays visible

**Step 5: Commit**

```bash
git add src/pages/FinalMaintenance.jsx
git commit -m "feat: add ParallaxSection component with wave overlays

Co-Authored-By: Claude Opus 4.5 <noreply@anthropic.com>"
```

---

### Task 10: Add Services Grid Header (Section 6)

**Files:**
- Modify: `src/pages/FinalMaintenance.jsx`

**Step 1: Add services header styles**

```css
/* ========== SECTION 6-7: SERVICES ========== */
.maint-services {
  background: #ffffff;
  padding: 5rem 2rem;
}

.maint-services__header {
  text-align: center;
  max-width: 700px;
  margin: 0 auto 3rem;
}

.maint-services__headline {
  font-size: clamp(2rem, 4vw, 3rem);
  font-weight: 600;
  margin-bottom: 1rem;
}
```

**Step 2: Add header JSX**

```jsx
{/* ========== SECTION 6: SERVICES HEADER ========== */}
<section className="maint-services">
  <div className="maint-services__header">
    <Reveal>
      <span className="maint-pre-text">Our Services</span>
      <h2 className="maint-services__headline">
        <span className="maint-text--dark">9 </span>
        <span className="maint-text--mid">Core </span>
        <span className="maint-text--light">Services</span>
      </h2>
      <p className="maint-body" style={{ margin: '0 auto' }}>
        Comprehensive maintenance solutions for Robinson and Guimbal helicopters,
        delivered by factory-trained engineers using genuine parts.
      </p>
    </Reveal>
  </div>
</section>
```

**Step 3: Commit**

```bash
git add src/pages/FinalMaintenance.jsx
git commit -m "feat: add services grid header section

Co-Authored-By: Claude Opus 4.5 <noreply@anthropic.com>"
```

---

### Task 11: Add Services Grid Cards (Section 7)

**Files:**
- Modify: `src/pages/FinalMaintenance.jsx`

**Step 1: Add services grid styles**

```css
.maint-services__grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 1px;
  background: #e8e6e2;
  border-radius: 8px;
  overflow: hidden;
  max-width: 900px;
  margin: 0 auto;
}

.maint-services__card {
  background: #ffffff;
  padding: 1.5rem;
  display: flex;
  align-items: flex-start;
  gap: 1rem;
  transition: transform 0.3s ease;
}

.maint-services__card:hover {
  transform: translateY(-3px);
}

.maint-services__num {
  width: 44px;
  height: 44px;
  background: #1a1a1a;
  color: #faf9f6;
  display: flex;
  align-items: center;
  justify-content: center;
  font-family: 'Share Tech Mono', monospace;
  font-size: 0.8rem;
  flex-shrink: 0;
}

.maint-services__text h4 {
  font-size: 0.9rem;
  font-weight: 600;
  margin: 0 0 0.25rem;
}

.maint-services__text p {
  font-size: 0.75rem;
  color: #666;
  margin: 0;
  line-height: 1.4;
}

@media (max-width: 768px) {
  .maint-services__grid {
    grid-template-columns: 1fr;
  }
}
```

**Step 2: Add services data and grid JSX**

```jsx
// Add inside FinalMaintenance function
const services = [
  { num: '01', title: '50-Hour Inspections', desc: 'Routine checks to maintain airworthiness' },
  { num: '02', title: '100-Hour Inspections', desc: 'Comprehensive scheduled maintenance' },
  { num: '03', title: 'Annual Inspections', desc: 'Full yearly airworthiness review' },
  { num: '04', title: '2200-Hour Overhauls', desc: 'Complete engine and component overhaul' },
  { num: '05', title: 'Component Repairs', desc: 'Expert repair of all aircraft systems' },
  { num: '06', title: 'Avionics Services', desc: 'Navigation, communication, and displays' },
  { num: '07', title: 'Pre-Purchase Inspections', desc: 'Thorough evaluation before purchase' },
  { num: '08', title: 'AOG Support', desc: 'Emergency Aircraft on Ground assistance' },
  { num: '09', title: 'Refurbishment', desc: 'Interior and exterior restoration' },
];

// JSX inside services section
<div className="maint-services__grid">
  {services.map((service, i) => (
    <Reveal key={service.num} delay={i * 0.05}>
      <div className="maint-services__card">
        <span className="maint-services__num">{service.num}</span>
        <div className="maint-services__text">
          <h4>{service.title}</h4>
          <p>{service.desc}</p>
        </div>
      </div>
    </Reveal>
  ))}
</div>
```

**Step 3: Commit**

```bash
git add src/pages/FinalMaintenance.jsx
git commit -m "feat: add 9-card services grid

Co-Authored-By: Claude Opus 4.5 <noreply@anthropic.com>"
```

---

### Task 12: Add Genuine Parts Badge (Section 8)

**Files:**
- Modify: `src/pages/FinalMaintenance.jsx`

**Step 1: Add badge styles**

```css
/* ========== SECTION 8: PARTS BADGE ========== */
.maint-badge {
  display: flex;
  justify-content: center;
  padding: 2rem;
  background: #ffffff;
}

.maint-badge__inner {
  display: inline-flex;
  align-items: center;
  gap: 1rem;
  padding: 0.75rem 1.5rem;
  border: 1px solid #e8e6e2;
  border-radius: 4px;
  font-size: 0.8rem;
}

.maint-badge__label {
  color: #666;
}

.maint-badge__tag {
  background: #1a1a1a;
  color: #faf9f6;
  padding: 0.25rem 0.75rem;
  border-radius: 2px;
  font-family: 'Share Tech Mono', monospace;
  font-size: 0.65rem;
  letter-spacing: 0.1em;
}
```

**Step 2: Add badge JSX**

```jsx
{/* ========== SECTION 8: PARTS BADGE ========== */}
<div className="maint-badge">
  <Reveal>
    <div className="maint-badge__inner">
      <span className="maint-badge__label">All Services Include</span>
      <span className="maint-badge__tag">GENUINE PARTS</span>
    </div>
  </Reveal>
</div>
```

**Step 3: Commit**

```bash
git add src/pages/FinalMaintenance.jsx
git commit -m "feat: add genuine parts badge section

Co-Authored-By: Claude Opus 4.5 <noreply@anthropic.com>"
```

---

## Phase 5: Certifications (Tasks 13-17)

### Task 13: Add Second Parallax & Certifications Header (Sections 9-10)

**Files:**
- Modify: `src/pages/FinalMaintenance.jsx`

**Step 1: Add parallax and certifications header**

```jsx
{/* ========== SECTION 9: PARALLAX - EXPERTISE ========== */}
<ParallaxSection
  image="/assets/images/facility/engineer-working.jpg"
  number="02"
  label="Expert Team"
  largeText="EXPERTISE"
/>

{/* ========== SECTION 10: CERTIFICATIONS HEADER ========== */}
<section className="maint-section">
  <div className="maint-container maint-container--narrow" style={{ textAlign: 'center' }}>
    <Reveal>
      <span className="maint-pre-text">Approved & Certified</span>
      <h2 className="maint-headline">
        <span className="maint-text--dark">Industry </span>
        <span className="maint-text--mid">Leading </span>
        <span className="maint-text--light">Standards</span>
      </h2>
    </Reveal>
  </div>
</section>
```

**Step 2: Commit**

```bash
git add src/pages/FinalMaintenance.jsx
git commit -m "feat: add expertise parallax and certifications header

Co-Authored-By: Claude Opus 4.5 <noreply@anthropic.com>"
```

---

### Task 14: Add EASA Part 145 Feature (Section 11)

**Files:**
- Modify: `src/pages/FinalMaintenance.jsx`

**Step 1: Add certification feature styles**

```css
/* ========== SECTIONS 11-13: CERTIFICATIONS ========== */
.maint-cert {
  padding: 4rem 2rem;
}

.maint-cert__grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 3rem;
  max-width: 1000px;
  margin: 0 auto;
  align-items: center;
}

.maint-cert__image {
  display: flex;
  align-items: center;
  justify-content: center;
}

.maint-cert__image img {
  max-width: 200px;
  height: auto;
}

.maint-cert__content h3 {
  font-size: 1.5rem;
  font-weight: 600;
  margin: 0 0 1rem;
}

.maint-cert__content p {
  color: #666;
  line-height: 1.7;
  margin-bottom: 1.5rem;
}

.maint-cert__list {
  list-style: none;
  padding: 0;
  margin: 0;
}

.maint-cert__list li {
  position: relative;
  padding-left: 1.5rem;
  margin-bottom: 0.5rem;
  font-size: 0.9rem;
  color: #666;
}

.maint-cert__list li::before {
  content: '✓';
  position: absolute;
  left: 0;
  color: #1a1a1a;
}

@media (max-width: 768px) {
  .maint-cert__grid {
    grid-template-columns: 1fr;
    text-align: center;
  }
}
```

**Step 2: Add EASA section JSX**

```jsx
{/* ========== SECTION 11: EASA PART 145 ========== */}
<section className="maint-cert">
  <div className="maint-cert__grid">
    <Reveal direction="left">
      <div className="maint-cert__image">
        <img src="/assets/images/logos/easa-logo.png" alt="EASA Part 145" />
      </div>
    </Reveal>
    <Reveal direction="right">
      <div className="maint-cert__content">
        <h3>EASA Part 145 Maintenance Organisation</h3>
        <p>
          HQ Aviation operates a fully EASA Part 145 approved maintenance facility
          at Denham Aerodrome. This certification represents the highest European
          standard for aircraft maintenance.
        </p>
        <ul className="maint-cert__list">
          <li>Approved maintenance procedures</li>
          <li>Quality management system</li>
          <li>Continuous airworthiness management</li>
          <li>Trained and qualified personnel</li>
        </ul>
      </div>
    </Reveal>
  </div>
</section>
```

**Step 3: Commit**

```bash
git add src/pages/FinalMaintenance.jsx
git commit -m "feat: add EASA Part 145 certification section

Co-Authored-By: Claude Opus 4.5 <noreply@anthropic.com>"
```

---

### Task 15: Add Robinson & Guimbal Sections (Sections 12-13)

**Files:**
- Modify: `src/pages/FinalMaintenance.jsx`

**Step 1: Add Robinson section**

```jsx
{/* ========== SECTION 12: ROBINSON AUTHORIZED ========== */}
<section className="maint-cert maint-section--alt">
  <div className="maint-cert__grid" style={{ direction: 'rtl' }}>
    <Reveal direction="right">
      <div className="maint-cert__content" style={{ direction: 'ltr' }}>
        <span className="maint-pre-text">Factory Authorized</span>
        <h3>Robinson Helicopter Company Service Centre</h3>
        <p>
          As a Robinson Authorized Service Centre, we are approved to perform
          all maintenance, repairs, and overhauls on R22, R44, and R66 helicopters.
          Our technicians complete regular factory training at Robinson's California facility.
        </p>
      </div>
    </Reveal>
    <Reveal direction="left">
      <div className="maint-cert__image" style={{ direction: 'ltr' }}>
        <img src="/assets/images/logos/robinson-authorized.png" alt="Robinson Authorized" />
        <span className="maint-pre-text" style={{ marginTop: '1rem' }}>Since 1990</span>
      </div>
    </Reveal>
  </div>
</section>

{/* ========== SECTION 13: GUIMBAL CERTIFIED ========== */}
<section className="maint-cert">
  <div className="maint-cert__grid">
    <Reveal direction="left">
      <div className="maint-cert__image">
        <img src="/assets/images/logos/guimbal-logo.png" alt="Guimbal" />
      </div>
    </Reveal>
    <Reveal direction="right">
      <div className="maint-cert__content">
        <span className="maint-pre-text">Certified Centre</span>
        <h3>Guimbal Cabri G2 Service Centre</h3>
        <p>
          We are proud to be one of the UK's certified Guimbal Cabri G2 service
          centres. The Cabri G2 has become increasingly popular for training,
          and our technicians have completed comprehensive factory training.
        </p>
      </div>
    </Reveal>
  </div>
</section>
```

**Step 2: Commit**

```bash
git add src/pages/FinalMaintenance.jsx
git commit -m "feat: add Robinson and Guimbal certification sections

Co-Authored-By: Claude Opus 4.5 <noreply@anthropic.com>"
```

---

### Task 16: Add Certification Logos Strip (Section 14)

**Files:**
- Modify: `src/pages/FinalMaintenance.jsx`

**Step 1: Add logos strip styles**

```css
/* ========== SECTION 14: LOGOS STRIP ========== */
.maint-logos {
  background: #ffffff;
  padding: 3rem 2rem;
}

.maint-logos__container {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 3rem;
  flex-wrap: wrap;
}

.maint-logos__item {
  filter: grayscale(100%);
  opacity: 0.6;
  transition: all 0.3s ease;
}

.maint-logos__item:hover {
  filter: grayscale(0%);
  opacity: 1;
}

.maint-logos__item img {
  height: 50px;
  width: auto;
}
```

**Step 2: Add logos JSX**

```jsx
{/* ========== SECTION 14: LOGOS STRIP ========== */}
<section className="maint-logos">
  <div className="maint-logos__container">
    {['easa', 'robinson', 'guimbal', 'caa'].map((logo, i) => (
      <Reveal key={logo} delay={i * 0.1}>
        <div className="maint-logos__item">
          <img src={`/assets/images/logos/${logo}-logo.png`} alt={logo.toUpperCase()} />
        </div>
      </Reveal>
    ))}
  </div>
</section>
```

**Step 3: Commit**

```bash
git add src/pages/FinalMaintenance.jsx
git commit -m "feat: add certification logos strip

Co-Authored-By: Claude Opus 4.5 <noreply@anthropic.com>"
```

---

## Phase 6: Aircraft & Team (Tasks 17-20)

### Task 17: Add Fleet Parallax & Aircraft Header (Sections 15-16)

**Files:**
- Modify: `src/pages/FinalMaintenance.jsx`

**Step 1: Add parallax and header**

```jsx
{/* ========== SECTION 15: PARALLAX - FLEET ========== */}
<ParallaxSection
  image="/assets/images/facility/hq-aviation-robinsons.jpg"
  number="03"
  label="Supported Models"
  largeText="FLEET"
/>

{/* ========== SECTION 16: AIRCRAFT HEADER ========== */}
<section className="maint-section">
  <div className="maint-container maint-container--narrow" style={{ textAlign: 'center' }}>
    <Reveal>
      <span className="maint-pre-text">Supported Aircraft</span>
      <h2 className="maint-headline">
        <span className="maint-text--dark">Robinson </span>
        <span className="maint-text--mid">& </span>
        <span className="maint-text--light">Guimbal</span>
      </h2>
      <p className="maint-body" style={{ margin: '0 auto' }}>
        We provide full maintenance support for the complete Robinson range
        and Guimbal Cabri G2.
      </p>
    </Reveal>
  </div>
</section>
```

**Step 2: Commit**

```bash
git add src/pages/FinalMaintenance.jsx
git commit -m "feat: add fleet parallax and aircraft header

Co-Authored-By: Claude Opus 4.5 <noreply@anthropic.com>"
```

---

### Task 18: Add Aircraft Cards Grid (Section 17)

**Files:**
- Modify: `src/pages/FinalMaintenance.jsx`

**Step 1: Add aircraft card styles**

```css
/* ========== SECTION 17: AIRCRAFT CARDS ========== */
.maint-aircraft {
  padding: 0 2rem 5rem;
}

.maint-aircraft__grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 1.5rem;
  max-width: 1100px;
  margin: 0 auto;
}

.maint-aircraft__card {
  border-left: 3px solid #1a1a1a;
  padding-left: 1rem;
}

.maint-aircraft__image {
  aspect-ratio: 4/3;
  border-radius: 8px;
  overflow: hidden;
  margin-bottom: 1rem;
}

.maint-aircraft__image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.5s ease;
}

.maint-aircraft__card:hover .maint-aircraft__image img {
  transform: scale(1.05);
}

.maint-aircraft__model {
  font-size: 0.9rem;
  font-weight: 600;
  text-transform: uppercase;
  margin-bottom: 0.25rem;
}

.maint-aircraft__notes {
  font-size: 0.75rem;
  color: #888;
}

@media (max-width: 900px) {
  .maint-aircraft__grid {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (max-width: 500px) {
  .maint-aircraft__grid {
    grid-template-columns: 1fr;
  }
}
```

**Step 2: Add aircraft data and JSX**

```jsx
// Add inside FinalMaintenance
const aircraft = [
  { model: 'Robinson R22', image: '/assets/images/new-aircraft/r22-beta.webp', notes: 'Beta II, all variants' },
  { model: 'Robinson R44', image: '/assets/images/new-aircraft/r44-raven.webp', notes: 'Raven, Cadet, Clipper' },
  { model: 'Robinson R66', image: '/assets/images/new-aircraft/r66-turbine.webp', notes: 'Turbine expertise' },
  { model: 'Guimbal Cabri G2', image: '/assets/images/new-aircraft/cabri-g2.webp', notes: 'Certified centre' },
];

{/* ========== SECTION 17: AIRCRAFT CARDS ========== */}
<section className="maint-aircraft">
  <div className="maint-aircraft__grid">
    {aircraft.map((a, i) => (
      <Reveal key={a.model} delay={i * 0.1}>
        <div className="maint-aircraft__card">
          <div className="maint-aircraft__image">
            <img src={a.image} alt={a.model} />
          </div>
          <div className="maint-aircraft__model">{a.model}</div>
          <div className="maint-aircraft__notes">{a.notes}</div>
        </div>
      </Reveal>
    ))}
  </div>
</section>
```

**Step 3: Commit**

```bash
git add src/pages/FinalMaintenance.jsx
git commit -m "feat: add 4-column aircraft cards grid

Co-Authored-By: Claude Opus 4.5 <noreply@anthropic.com>"
```

---

### Task 19: Add Chief Engineer Profile (Section 18)

**Files:**
- Modify: `src/pages/FinalMaintenance.jsx`

**Step 1: Add profile card styles**

```css
/* ========== SECTION 18-19: TEAM ========== */
.maint-team {
  padding: 5rem 2rem;
  background: #faf9f6;
}

.maint-profile {
  max-width: 600px;
  margin: 0 auto;
  background: #ffffff;
  border-left: 3px solid #1a1a1a;
  padding: 2rem;
  display: flex;
  gap: 1.5rem;
}

.maint-profile__image {
  width: 100px;
  height: 100px;
  border-radius: 50%;
  overflow: hidden;
  flex-shrink: 0;
}

.maint-profile__image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.maint-profile__name {
  font-size: 1.25rem;
  font-weight: 600;
  margin: 0 0 0.25rem;
}

.maint-profile__title {
  font-family: 'Share Tech Mono', monospace;
  font-size: 0.7rem;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  color: #888;
  display: block;
  margin-bottom: 1rem;
}

.maint-profile__stats {
  display: flex;
  gap: 1.5rem;
  margin-bottom: 1rem;
  padding-bottom: 1rem;
  border-bottom: 1px solid #e8e6e2;
}

.maint-profile__stat-value {
  font-family: 'Share Tech Mono', monospace;
  font-size: 1.25rem;
  display: block;
}

.maint-profile__stat-label {
  font-size: 0.65rem;
  color: #888;
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.maint-profile__bio {
  font-size: 0.9rem;
  color: #666;
  line-height: 1.6;
  margin: 0;
}

@media (max-width: 500px) {
  .maint-profile {
    flex-direction: column;
    text-align: center;
  }
  .maint-profile__image {
    margin: 0 auto;
  }
  .maint-profile__stats {
    justify-content: center;
  }
}
```

**Step 2: Add profile JSX**

```jsx
{/* ========== SECTION 18: CHIEF ENGINEER ========== */}
<section className="maint-team">
  <Reveal>
    <div className="maint-profile">
      <div className="maint-profile__image">
        <img src="/assets/images/team/engineer-chief.jpg" alt="Chief Engineer" />
      </div>
      <div className="maint-profile__content">
        <h3 className="maint-profile__name">David Cross</h3>
        <span className="maint-profile__title">Chief Engineer</span>
        <div className="maint-profile__stats">
          <div>
            <span className="maint-profile__stat-value"><AnimatedNumber value={30} />+</span>
            <span className="maint-profile__stat-label">Years Experience</span>
          </div>
          <div>
            <span className="maint-profile__stat-value"><AnimatedNumber value={500} />+</span>
            <span className="maint-profile__stat-label">Overhauls Completed</span>
          </div>
        </div>
        <p className="maint-profile__bio">
          David has been with HQ Aviation since 1995 and leads our team of factory-trained
          engineers. His expertise spans the complete Robinson range and Guimbal aircraft.
        </p>
      </div>
    </div>
  </Reveal>
</section>
```

**Step 3: Commit**

```bash
git add src/pages/FinalMaintenance.jsx
git commit -m "feat: add chief engineer profile card

Co-Authored-By: Claude Opus 4.5 <noreply@anthropic.com>"
```

---

### Task 20: Add Engineering Team Grid (Section 19)

**Files:**
- Modify: `src/pages/FinalMaintenance.jsx`

**Step 1: Add team grid styles**

```css
.maint-team-grid {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 0.5rem;
  max-width: 600px;
  margin: 2rem auto 0;
}

.maint-team-member {
  background: #ffffff;
  border-left: 2px solid #1a1a1a;
  padding: 0.75rem 1rem;
  min-width: 140px;
}

.maint-team-member__name {
  font-size: 0.75rem;
  font-weight: 600;
  margin: 0 0 0.1rem;
}

.maint-team-member__role {
  font-size: 0.6rem;
  color: #888;
}
```

**Step 2: Add team data and JSX**

```jsx
// Add inside FinalMaintenance
const teamMembers = [
  { name: 'James Mitchell', role: 'Licensed Engineer' },
  { name: 'Robert Taylor', role: 'Licensed Engineer' },
  { name: 'Sarah Williams', role: 'Avionics Specialist' },
  { name: 'Tom Anderson', role: 'Engineering Apprentice' },
];

{/* ========== SECTION 19: TEAM GRID ========== */}
<div className="maint-team-grid">
  {teamMembers.map((member, i) => (
    <Reveal key={member.name} delay={i * 0.1}>
      <div className="maint-team-member">
        <div className="maint-team-member__name">{member.name}</div>
        <div className="maint-team-member__role">{member.role}</div>
      </div>
    </Reveal>
  ))}
</div>
```

**Step 3: Commit**

```bash
git add src/pages/FinalMaintenance.jsx
git commit -m "feat: add engineering team grid

Co-Authored-By: Claude Opus 4.5 <noreply@anthropic.com>"
```

---

## Phase 7: Inspection Deep Dive (Tasks 21-22)

### Task 21: Add Precision Parallax & Sticky Scroll Setup (Sections 20-21)

**Files:**
- Modify: `src/pages/FinalMaintenance.jsx`

**Step 1: Add parallax**

```jsx
{/* ========== SECTION 20: PARALLAX - PRECISION ========== */}
<ParallaxSection
  image="/assets/images/facility/precision-tooling.jpg"
  number="04"
  label="Attention to Detail"
  largeText="PRECISION"
/>
```

**Step 2: Add sticky scroll styles**

```css
/* ========== SECTION 21: INSPECTION STICKY SCROLL ========== */
.maint-inspect {
  display: flex;
  min-height: 300vh;
}

.maint-inspect__left {
  position: sticky;
  top: 0;
  height: 100vh;
  width: 40%;
  background: #1a1a1a;
  color: #faf9f6;
  display: flex;
  flex-direction: column;
  justify-content: center;
  padding: 3rem;
}

.maint-inspect__number {
  font-family: 'Share Tech Mono', monospace;
  font-size: 4rem;
  opacity: 0.3;
}

.maint-inspect__title {
  font-size: 0.7rem;
  letter-spacing: 0.2em;
  text-transform: uppercase;
  margin-bottom: 1rem;
}

.maint-inspect__current {
  font-size: 1.5rem;
  font-weight: 600;
}

.maint-inspect__dots {
  display: flex;
  gap: 0.5rem;
  margin-top: 2rem;
}

.maint-inspect__dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: rgba(250,249,246,0.3);
  transition: background 0.3s;
}

.maint-inspect__dot--active {
  background: #faf9f6;
}

.maint-inspect__right {
  width: 60%;
  background: #faf9f6;
}

.maint-inspect__item {
  min-height: 100vh;
  display: flex;
  align-items: center;
  padding: 4rem;
}

.maint-inspect__content h3 {
  font-size: 2rem;
  font-weight: 600;
  margin: 0 0 1rem;
}

.maint-inspect__content p {
  color: #666;
  line-height: 1.7;
  margin-bottom: 2rem;
}

.maint-inspect__details {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 1.5rem;
}

.maint-inspect__detail-label {
  font-family: 'Share Tech Mono', monospace;
  font-size: 0.65rem;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  color: #888;
  display: block;
  margin-bottom: 0.25rem;
}

.maint-inspect__detail-value {
  font-size: 0.9rem;
  font-weight: 500;
}

@media (max-width: 900px) {
  .maint-inspect {
    flex-direction: column;
    min-height: auto;
  }
  .maint-inspect__left {
    position: relative;
    width: 100%;
    height: auto;
    padding: 3rem 2rem;
  }
  .maint-inspect__right {
    width: 100%;
  }
  .maint-inspect__item {
    min-height: auto;
    padding: 3rem 2rem;
  }
}
```

**Step 3: Commit**

```bash
git add src/pages/FinalMaintenance.jsx
git commit -m "feat: add precision parallax and sticky scroll styles

Co-Authored-By: Claude Opus 4.5 <noreply@anthropic.com>"
```

---

### Task 22: Add Inspection Sticky Scroll Content (Section 21)

**Files:**
- Modify: `src/pages/FinalMaintenance.jsx`

**Step 1: Add inspection data and JSX**

```jsx
// Add inside FinalMaintenance
const inspections = [
  {
    id: '01',
    title: '50-Hour Inspection',
    desc: 'A routine inspection ensuring all critical systems are functioning correctly. Ideal for aircraft in regular use.',
    duration: '1-2 days',
    checks: 'Engine, transmission, controls, fluid levels',
    docs: 'Full compliance report',
  },
  {
    id: '02',
    title: '100-Hour Inspection',
    desc: 'Comprehensive scheduled maintenance required for commercial operations and recommended for private use.',
    duration: '2-3 days',
    checks: 'All 50-hour items plus deeper inspection',
    docs: 'Maintenance release certificate',
  },
  {
    id: '03',
    title: 'Annual Inspection',
    desc: 'Complete airworthiness review required yearly regardless of flight hours.',
    duration: '3-5 days',
    checks: 'Full aircraft inspection, AD compliance',
    docs: 'Annual airworthiness certificate',
  },
];

const [activeInspection, setActiveInspection] = useState(0);

// Add scroll tracking in useEffect
useEffect(() => {
  const handleInspectScroll = () => {
    const inspectSection = document.querySelector('.maint-inspect');
    if (!inspectSection) return;

    const rect = inspectSection.getBoundingClientRect();
    const sectionHeight = inspectSection.offsetHeight;
    const scrollInSection = -rect.top;
    const itemHeight = sectionHeight / 3;

    if (scrollInSection >= 0 && scrollInSection < sectionHeight) {
      const index = Math.min(2, Math.floor(scrollInSection / itemHeight));
      setActiveInspection(index);
    }
  };

  window.addEventListener('scroll', handleInspectScroll, { passive: true });
  return () => window.removeEventListener('scroll', handleInspectScroll);
}, []);

{/* ========== SECTION 21: INSPECTION STICKY SCROLL ========== */}
<section className="maint-inspect">
  <div className="maint-inspect__left">
    <span className="maint-inspect__number">{inspections[activeInspection].id}</span>
    <span className="maint-inspect__title">INSPECTIONS</span>
    <span className="maint-inspect__current">{inspections[activeInspection].title}</span>
    <div className="maint-inspect__dots">
      {inspections.map((_, i) => (
        <span
          key={i}
          className={`maint-inspect__dot ${i === activeInspection ? 'maint-inspect__dot--active' : ''}`}
        />
      ))}
    </div>
  </div>
  <div className="maint-inspect__right">
    {inspections.map((insp) => (
      <div key={insp.id} className="maint-inspect__item">
        <div className="maint-inspect__content">
          <h3>{insp.title}</h3>
          <p>{insp.desc}</p>
          <div className="maint-inspect__details">
            <div>
              <span className="maint-inspect__detail-label">Duration</span>
              <span className="maint-inspect__detail-value">{insp.duration}</span>
            </div>
            <div>
              <span className="maint-inspect__detail-label">Checks</span>
              <span className="maint-inspect__detail-value">{insp.checks}</span>
            </div>
            <div>
              <span className="maint-inspect__detail-label">Documentation</span>
              <span className="maint-inspect__detail-value">{insp.docs}</span>
            </div>
          </div>
        </div>
      </div>
    ))}
  </div>
</section>
```

**Step 2: Commit**

```bash
git add src/pages/FinalMaintenance.jsx
git commit -m "feat: add inspection sticky scroll with progress tracking

Co-Authored-By: Claude Opus 4.5 <noreply@anthropic.com>"
```

---

## Phase 8: Overhaul & Components (Tasks 23-25)

### Task 23: Add Overhaul Section (Section 22)

**Files:**
- Modify: `src/pages/FinalMaintenance.jsx`

**Step 1: Add overhaul styles**

```css
/* ========== SECTION 22: OVERHAUL ========== */
.maint-overhaul {
  padding: 5rem 2rem;
  background: #ffffff;
}

.maint-overhaul__grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 3rem;
  max-width: 1000px;
  margin: 0 auto;
  align-items: center;
}

.maint-overhaul__image {
  border-radius: 8px;
  overflow: hidden;
}

.maint-overhaul__image img {
  width: 100%;
  height: auto;
}

.maint-overhaul__timeline {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  background: #faf9f6;
  padding: 0.5rem 1rem;
  border-radius: 4px;
  margin-top: 1.5rem;
}

.maint-overhaul__timeline-icon {
  font-size: 1rem;
}

.maint-overhaul__timeline-text {
  font-family: 'Share Tech Mono', monospace;
  font-size: 0.8rem;
}

.maint-overhaul__features {
  list-style: none;
  padding: 0;
  margin: 1.5rem 0 0;
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 0.5rem;
}

.maint-overhaul__features li {
  font-size: 0.85rem;
  color: #666;
  padding-left: 1.25rem;
  position: relative;
}

.maint-overhaul__features li::before {
  content: '→';
  position: absolute;
  left: 0;
  color: #1a1a1a;
}

@media (max-width: 768px) {
  .maint-overhaul__grid {
    grid-template-columns: 1fr;
  }
  .maint-overhaul__features {
    grid-template-columns: 1fr;
  }
}
```

**Step 2: Add overhaul JSX**

```jsx
{/* ========== SECTION 22: OVERHAUL ========== */}
<section className="maint-overhaul">
  <div className="maint-overhaul__grid">
    <Reveal direction="left">
      <div className="maint-overhaul__content">
        <span className="maint-pre-text">Major Service</span>
        <h2 className="maint-headline">
          <span className="maint-text--dark">2200-Hour </span>
          <span className="maint-text--light">Overhaul</span>
        </h2>
        <p className="maint-body">
          At 2200 hours, Robinson helicopters require a complete overhaul.
          This is a comprehensive process involving disassembly, inspection,
          repair, and reassembly of major components.
        </p>
        <div className="maint-overhaul__timeline">
          <span className="maint-overhaul__timeline-icon">⏱</span>
          <span className="maint-overhaul__timeline-text">Typically 4-6 weeks</span>
        </div>
        <ul className="maint-overhaul__features">
          <li>Engine overhaul</li>
          <li>Transmission rebuild</li>
          <li>Rotor system inspection</li>
          <li>Complete documentation</li>
        </ul>
      </div>
    </Reveal>
    <Reveal direction="right">
      <div className="maint-overhaul__image">
        <img src="/assets/images/facility/overhaul-process.jpg" alt="Overhaul" />
      </div>
    </Reveal>
  </div>
</section>
```

**Step 3: Commit**

```bash
git add src/pages/FinalMaintenance.jsx
git commit -m "feat: add 2200-hour overhaul section

Co-Authored-By: Claude Opus 4.5 <noreply@anthropic.com>"
```

---

### Task 24: Add Component Services Accordion (Section 23)

**Files:**
- Modify: `src/pages/FinalMaintenance.jsx`

**Step 1: Add accordion styles**

```css
/* ========== SECTION 23: COMPONENT ACCORDION ========== */
.maint-accordion {
  padding: 5rem 2rem;
  background: #faf9f6;
}

.maint-accordion__container {
  max-width: 800px;
  margin: 0 auto;
}

.maint-accordion__header {
  text-align: center;
  margin-bottom: 3rem;
}

.maint-accordion__item {
  background: #ffffff;
  margin-bottom: 1px;
  overflow: hidden;
}

.maint-accordion__trigger {
  width: 100%;
  padding: 1.25rem 1.5rem;
  display: flex;
  align-items: center;
  gap: 1rem;
  border: none;
  background: none;
  cursor: pointer;
  text-align: left;
  font-family: inherit;
  transition: background 0.2s;
}

.maint-accordion__trigger:hover {
  background: #faf9f6;
}

.maint-accordion__num {
  font-family: 'Share Tech Mono', monospace;
  font-size: 0.75rem;
  color: #888;
  width: 24px;
}

.maint-accordion__title {
  flex: 1;
  font-size: 1rem;
  font-weight: 500;
}

.maint-accordion__icon {
  width: 20px;
  height: 20px;
  position: relative;
}

.maint-accordion__icon::before,
.maint-accordion__icon::after {
  content: '';
  position: absolute;
  background: #1a1a1a;
  transition: transform 0.3s;
}

.maint-accordion__icon::before {
  width: 12px;
  height: 1px;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
}

.maint-accordion__icon::after {
  width: 1px;
  height: 12px;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
}

.maint-accordion__item--open .maint-accordion__icon::after {
  transform: translate(-50%, -50%) rotate(90deg);
}

.maint-accordion__content {
  max-height: 0;
  overflow: hidden;
  transition: max-height 0.3s ease;
}

.maint-accordion__item--open .maint-accordion__content {
  max-height: 200px;
}

.maint-accordion__text {
  padding: 0 1.5rem 1.5rem;
  padding-left: calc(1.5rem + 24px + 1rem);
  color: #666;
  font-size: 0.9rem;
  line-height: 1.6;
}
```

**Step 2: Add accordion data and JSX**

```jsx
// Add inside FinalMaintenance
const components = [
  { id: '01', title: 'Engine Components', details: 'Pistons, cylinders, crankshaft, bearings, camshafts, and valve assemblies.' },
  { id: '02', title: 'Gearbox & Transmission', details: 'Main rotor gearbox, tail rotor gearbox, freewheeling units, and driveshafts.' },
  { id: '03', title: 'Rotor Systems', details: 'Main rotor blades, tail rotor blades, hub assemblies, pitch links, and grips.' },
  { id: '04', title: 'Avionics', details: 'GPS units, radios, transponders, EFDs, autopilots, and weather radar.' },
  { id: '05', title: 'Electrical Systems', details: 'Wiring harnesses, alternators, batteries, lighting, and circuit breakers.' },
];

const [openAccordion, setOpenAccordion] = useState(null);

{/* ========== SECTION 23: COMPONENT ACCORDION ========== */}
<section className="maint-accordion">
  <div className="maint-accordion__container">
    <div className="maint-accordion__header">
      <Reveal>
        <span className="maint-pre-text">Comprehensive Coverage</span>
        <h2 className="maint-headline">
          <span className="maint-text--dark">Component </span>
          <span className="maint-text--light">Services</span>
        </h2>
      </Reveal>
    </div>
    {components.map((comp) => (
      <div
        key={comp.id}
        className={`maint-accordion__item ${openAccordion === comp.id ? 'maint-accordion__item--open' : ''}`}
      >
        <button
          className="maint-accordion__trigger"
          onClick={() => setOpenAccordion(openAccordion === comp.id ? null : comp.id)}
        >
          <span className="maint-accordion__num">{comp.id}</span>
          <span className="maint-accordion__title">{comp.title}</span>
          <span className="maint-accordion__icon" />
        </button>
        <div className="maint-accordion__content">
          <p className="maint-accordion__text">{comp.details}</p>
        </div>
      </div>
    ))}
  </div>
</section>
```

**Step 3: Commit**

```bash
git add src/pages/FinalMaintenance.jsx
git commit -m "feat: add component services accordion

Co-Authored-By: Claude Opus 4.5 <noreply@anthropic.com>"
```

---

### Task 25: Add AOG Emergency Support (Section 24)

**Files:**
- Modify: `src/pages/FinalMaintenance.jsx`

**Step 1: Add AOG styles**

```css
/* ========== SECTION 24: AOG SUPPORT ========== */
.maint-aog {
  background: #1a1a1a;
  color: #faf9f6;
  padding: 5rem 2rem;
  text-align: center;
}

.maint-aog__container {
  max-width: 700px;
  margin: 0 auto;
}

.maint-aog__headline {
  font-size: clamp(2rem, 5vw, 3rem);
  font-weight: 600;
  margin-bottom: 1rem;
}

.maint-aog__body {
  color: rgba(250,249,246,0.7);
  margin-bottom: 2rem;
  line-height: 1.7;
}

.maint-aog__phone {
  font-family: 'Share Tech Mono', monospace;
  font-size: clamp(1.5rem, 4vw, 2rem);
  color: #faf9f6;
  text-decoration: none;
  display: block;
  margin-bottom: 2rem;
  transition: opacity 0.2s;
}

.maint-aog__phone:hover {
  opacity: 0.8;
}

.maint-aog__btn {
  display: inline-block;
  padding: 1rem 2rem;
  background: #faf9f6;
  color: #1a1a1a;
  text-decoration: none;
  font-size: 0.85rem;
  font-weight: 500;
  border-radius: 4px;
  transition: transform 0.2s, box-shadow 0.2s;
}

.maint-aog__btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0,0,0,0.3);
}

.maint-aog__features {
  display: flex;
  justify-content: center;
  gap: 2rem;
  margin-top: 3rem;
  flex-wrap: wrap;
}

.maint-aog__feature {
  font-size: 0.8rem;
  color: rgba(250,249,246,0.6);
}
```

**Step 2: Add AOG JSX**

```jsx
{/* ========== SECTION 24: AOG SUPPORT ========== */}
<section className="maint-aog">
  <div className="maint-aog__container">
    <Reveal>
      <span className="maint-pre-text" style={{ color: 'rgba(250,249,246,0.5)' }}>24/7 Support</span>
      <h2 className="maint-aog__headline">Aircraft On Ground</h2>
      <p className="maint-aog__body">
        When you need us most, we're here. Our AOG support ensures minimal
        downtime for your aircraft with rapid response and expert diagnosis.
      </p>
      <a href="tel:+441234567890" className="maint-aog__phone">
        +44 (0) 1234 567 890
      </a>
      <Link to="/contact" className="maint-aog__btn">Emergency Contact</Link>
      <div className="maint-aog__features">
        <span className="maint-aog__feature">Rapid Response</span>
        <span className="maint-aog__feature">Mobile Service</span>
        <span className="maint-aog__feature">Parts Network</span>
      </div>
    </Reveal>
  </div>
</section>
```

**Step 3: Commit**

```bash
git add src/pages/FinalMaintenance.jsx
git commit -m "feat: add AOG emergency support section

Co-Authored-By: Claude Opus 4.5 <noreply@anthropic.com>"
```

---

## Phase 9: Refurbishment & Pricing (Tasks 26-27)

### Task 26: Add Refurbishment Tabs (Section 25)

**Files:**
- Modify: `src/pages/FinalMaintenance.jsx`

**Step 1: Add refurbishment styles**

```css
/* ========== SECTION 25: REFURBISHMENT ========== */
.maint-refurb {
  padding: 5rem 2rem;
  background: #faf9f6;
}

.maint-refurb__container {
  max-width: 900px;
  margin: 0 auto;
}

.maint-refurb__tabs {
  display: flex;
  justify-content: center;
  gap: 0.5rem;
  margin-bottom: 3rem;
  flex-wrap: wrap;
}

.maint-refurb__tab {
  padding: 0.75rem 1.5rem;
  background: transparent;
  border: 1px solid #e8e6e2;
  border-radius: 4px;
  font-family: inherit;
  font-size: 0.85rem;
  cursor: pointer;
  transition: all 0.2s;
}

.maint-refurb__tab:hover {
  border-color: #1a1a1a;
}

.maint-refurb__tab--active {
  background: #1a1a1a;
  color: #faf9f6;
  border-color: #1a1a1a;
}

.maint-refurb__content {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 3rem;
  align-items: center;
}

.maint-refurb__image {
  border-radius: 8px;
  overflow: hidden;
}

.maint-refurb__image img {
  width: 100%;
  height: auto;
}

.maint-refurb__text h3 {
  font-size: 1.5rem;
  font-weight: 600;
  margin: 0 0 1rem;
}

.maint-refurb__text p {
  color: #666;
  line-height: 1.7;
}

@media (max-width: 768px) {
  .maint-refurb__content {
    grid-template-columns: 1fr;
  }
}
```

**Step 2: Add refurbishment data and JSX**

```jsx
// Add inside FinalMaintenance
const refurbOptions = [
  { id: 'interior', title: 'Interior Refurbishment', desc: 'Complete interior overhaul including seats, carpets, panels, and headliners. We source premium materials to match or exceed original specifications.', image: '/assets/images/facility/interior-refurb.jpg' },
  { id: 'paint', title: 'Exterior Paint', desc: 'Custom paint schemes, touch-ups, or full repaints. Our paint facility delivers showroom finishes with industry-leading durability.', image: '/assets/images/facility/paint-booth.jpg' },
  { id: 'avionics', title: 'Avionics Upgrades', desc: 'Modern glass cockpits, upgraded navigation systems, and the latest safety equipment. We handle everything from basic radio swaps to complete panel overhauls.', image: '/assets/images/facility/avionics-panel.jpg' },
  { id: 'corrosion', title: 'Corrosion Treatment', desc: 'Comprehensive corrosion prevention and repair services. We identify, treat, and protect against corrosion to extend your aircraft\'s service life.', image: '/assets/images/facility/corrosion-treatment.jpg' },
];

const [activeRefurb, setActiveRefurb] = useState('interior');
const currentRefurb = refurbOptions.find(r => r.id === activeRefurb);

{/* ========== SECTION 25: REFURBISHMENT ========== */}
<section className="maint-refurb">
  <div className="maint-refurb__container">
    <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
      <Reveal>
        <span className="maint-pre-text">Restoration Services</span>
        <h2 className="maint-headline">
          <span className="maint-text--dark">Aircraft </span>
          <span className="maint-text--light">Refurbishment</span>
        </h2>
      </Reveal>
    </div>

    <div className="maint-refurb__tabs">
      {refurbOptions.map((opt) => (
        <button
          key={opt.id}
          className={`maint-refurb__tab ${activeRefurb === opt.id ? 'maint-refurb__tab--active' : ''}`}
          onClick={() => setActiveRefurb(opt.id)}
        >
          {opt.title}
        </button>
      ))}
    </div>

    <div className="maint-refurb__content">
      <div className="maint-refurb__image">
        <img src={currentRefurb.image} alt={currentRefurb.title} />
      </div>
      <div className="maint-refurb__text">
        <h3>{currentRefurb.title}</h3>
        <p>{currentRefurb.desc}</p>
      </div>
    </div>
  </div>
</section>
```

**Step 3: Commit**

```bash
git add src/pages/FinalMaintenance.jsx
git commit -m "feat: add refurbishment tabs section

Co-Authored-By: Claude Opus 4.5 <noreply@anthropic.com>"
```

---

### Task 27: Add Turnaround & Pricing (Section 26)

**Files:**
- Modify: `src/pages/FinalMaintenance.jsx`

**Step 1: Add pricing styles**

```css
/* ========== SECTION 26: TURNAROUND & PRICING ========== */
.maint-pricing {
  padding: 5rem 2rem;
  background: #ffffff;
}

.maint-pricing__grid {
  display: grid;
  grid-template-columns: 1fr 1px 1fr;
  gap: 3rem;
  max-width: 900px;
  margin: 0 auto;
}

.maint-pricing__divider {
  background: #e8e6e2;
}

.maint-pricing__col h3 {
  font-size: 1.25rem;
  font-weight: 600;
  margin: 0 0 1.5rem;
}

.maint-pricing__list {
  list-style: none;
  padding: 0;
  margin: 0;
}

.maint-pricing__list li {
  display: flex;
  justify-content: space-between;
  padding: 0.75rem 0;
  border-bottom: 1px solid #f0f0f0;
  font-size: 0.9rem;
}

.maint-pricing__list li span:last-child {
  font-family: 'Share Tech Mono', monospace;
  color: #666;
}

.maint-pricing__text {
  color: #666;
  line-height: 1.7;
  margin-bottom: 1.5rem;
}

.maint-pricing__btn {
  display: inline-block;
  padding: 0.875rem 1.75rem;
  background: #1a1a1a;
  color: #faf9f6;
  text-decoration: none;
  font-size: 0.85rem;
  font-weight: 500;
  border-radius: 4px;
  transition: transform 0.2s;
}

.maint-pricing__btn:hover {
  transform: translateY(-2px);
}

@media (max-width: 768px) {
  .maint-pricing__grid {
    grid-template-columns: 1fr;
    gap: 2rem;
  }
  .maint-pricing__divider {
    display: none;
  }
}
```

**Step 2: Add pricing JSX**

```jsx
{/* ========== SECTION 26: TURNAROUND & PRICING ========== */}
<section className="maint-pricing">
  <div className="maint-pricing__grid">
    <div className="maint-pricing__col">
      <Reveal>
        <h3>Typical Turnaround</h3>
        <ul className="maint-pricing__list">
          <li><span>50-Hour Inspection</span><span>1-2 days</span></li>
          <li><span>100-Hour Inspection</span><span>2-3 days</span></li>
          <li><span>Annual Inspection</span><span>3-5 days</span></li>
          <li><span>2200-Hour Overhaul</span><span>4-6 weeks</span></li>
          <li><span>AOG Response</span><span>Same day</span></li>
        </ul>
      </Reveal>
    </div>
    <div className="maint-pricing__divider" />
    <div className="maint-pricing__col">
      <Reveal delay={0.2}>
        <h3>Transparent Pricing</h3>
        <p className="maint-pricing__text">
          We provide detailed quotes for all work before commencement.
          No hidden fees, no surprises. Just honest, professional service.
        </p>
        <Link to="/contact" className="maint-pricing__btn">Request a Quote</Link>
      </Reveal>
    </div>
  </div>
</section>
```

**Step 3: Commit**

```bash
git add src/pages/FinalMaintenance.jsx
git commit -m "feat: add turnaround and pricing section

Co-Authored-By: Claude Opus 4.5 <noreply@anthropic.com>"
```

---

## Phase 10: Location, FAQ & CTA (Tasks 28-30)

### Task 28: Add Location Section (Section 27)

**Files:**
- Modify: `src/pages/FinalMaintenance.jsx`

**Step 1: Add location styles**

```css
/* ========== SECTION 27: LOCATION ========== */
.maint-location {
  padding: 5rem 2rem;
  background: #faf9f6;
}

.maint-location__container {
  max-width: 800px;
  margin: 0 auto;
}

.maint-location__map {
  height: 180px;
  background: #e8e6e2;
  border-radius: 8px;
  margin-bottom: 2rem;
  display: flex;
  align-items: center;
  justify-content: center;
  background-image:
    linear-gradient(rgba(0,0,0,0.05) 1px, transparent 1px),
    linear-gradient(90deg, rgba(0,0,0,0.05) 1px, transparent 1px);
  background-size: 20px 20px;
}

.maint-location__map-text {
  font-family: 'Share Tech Mono', monospace;
  font-size: 0.7rem;
  color: #888;
  letter-spacing: 0.1em;
}

.maint-location__grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 2rem;
}

.maint-location__col h4 {
  font-size: 0.7rem;
  font-weight: 600;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  color: #888;
  margin: 0 0 0.75rem;
}

.maint-location__col p {
  font-size: 0.9rem;
  line-height: 1.6;
  margin: 0;
}

@media (max-width: 600px) {
  .maint-location__grid {
    grid-template-columns: 1fr;
  }
}
```

**Step 2: Add location JSX**

```jsx
{/* ========== SECTION 27: LOCATION ========== */}
<section className="maint-location">
  <div className="maint-location__container">
    <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
      <Reveal>
        <span className="maint-pre-text">Visit Us</span>
        <h2 className="maint-headline">
          <span className="maint-text--dark">Denham </span>
          <span className="maint-text--light">Aerodrome</span>
        </h2>
      </Reveal>
    </div>

    <Reveal>
      <div className="maint-location__map">
        <span className="maint-location__map-text">51.5751°N • 0.5059°W</span>
      </div>
    </Reveal>

    <p className="maint-body" style={{ textAlign: 'center', margin: '0 auto 2rem' }}>
      Our purpose-built maintenance facility offers modern workshops,
      climate-controlled storage, and easy access from London.
    </p>

    <div className="maint-location__grid">
      <Reveal>
        <div className="maint-location__col">
          <h4>Address</h4>
          <p>
            HQ Aviation<br />
            Tilehouse Lane<br />
            Denham, UB9 5DF
          </p>
        </div>
      </Reveal>
      <Reveal delay={0.1}>
        <div className="maint-location__col">
          <h4>Getting Here</h4>
          <p>
            5 min from M40 J1<br />
            20 min from M25 J16<br />
            On-site parking available
          </p>
        </div>
      </Reveal>
    </div>
  </div>
</section>
```

**Step 3: Commit**

```bash
git add src/pages/FinalMaintenance.jsx
git commit -m "feat: add location section

Co-Authored-By: Claude Opus 4.5 <noreply@anthropic.com>"
```

---

### Task 29: Add FAQ Section (Section 28)

**Files:**
- Modify: `src/pages/FinalMaintenance.jsx`

**Step 1: Add FAQ data and JSX (reuse accordion styles)**

```jsx
// Add inside FinalMaintenance
const faqs = [
  { id: '01', q: 'How long does a 100-hour inspection take?', a: 'Typically 2-3 working days, depending on any additional work required. We\'ll provide a detailed timeline with your quote.' },
  { id: '02', q: 'Do you provide loan aircraft?', a: 'We can arrange loan aircraft through our network of partners. Contact us to discuss availability and terms.' },
  { id: '03', q: 'Can you collect my aircraft?', a: 'Yes, we offer ferry services throughout the UK and Europe. Our experienced pilots can collect and deliver your aircraft.' },
  { id: '04', q: 'What\'s included in an annual inspection?', a: 'A complete airworthiness review including all scheduled maintenance items, AD compliance check, and full documentation.' },
  { id: '05', q: 'Do you work on other helicopter types?', a: 'We specialize in Robinson and Guimbal aircraft. For other types, please contact us to discuss your requirements.' },
  { id: '06', q: 'What about warranty work?', a: 'As an authorized service centre, we handle all warranty claims directly with the manufacturers.' },
];

const [openFaq, setOpenFaq] = useState(null);

{/* ========== SECTION 28: FAQ ========== */}
<section className="maint-accordion maint-section--alt">
  <div className="maint-accordion__container">
    <div className="maint-accordion__header">
      <Reveal>
        <span className="maint-pre-text">Common Questions</span>
        <h2 className="maint-headline">
          <span className="maint-text--dark">Frequently </span>
          <span className="maint-text--light">Asked</span>
        </h2>
      </Reveal>
    </div>
    {faqs.map((faq) => (
      <div
        key={faq.id}
        className={`maint-accordion__item ${openFaq === faq.id ? 'maint-accordion__item--open' : ''}`}
      >
        <button
          className="maint-accordion__trigger"
          onClick={() => setOpenFaq(openFaq === faq.id ? null : faq.id)}
        >
          <span className="maint-accordion__num">{faq.id}</span>
          <span className="maint-accordion__title">{faq.q}</span>
          <span className="maint-accordion__icon" />
        </button>
        <div className="maint-accordion__content">
          <p className="maint-accordion__text">{faq.a}</p>
        </div>
      </div>
    ))}
  </div>
</section>
```

**Step 2: Commit**

```bash
git add src/pages/FinalMaintenance.jsx
git commit -m "feat: add FAQ accordion section

Co-Authored-By: Claude Opus 4.5 <noreply@anthropic.com>"
```

---

### Task 30: Add CTA & Service Ticket (Section 29)

**Files:**
- Modify: `src/pages/FinalMaintenance.jsx`

**Step 1: Add CTA styles**

```css
/* ========== SECTION 29: CTA ========== */
.maint-cta {
  background: #1a1a1a;
  color: #faf9f6;
  padding: 5rem 2rem;
}

.maint-cta__container {
  max-width: 1000px;
  margin: 0 auto;
  display: grid;
  grid-template-columns: auto 1fr;
  gap: 4rem;
  align-items: center;
}

/* Service Ticket (similar to boarding pass) */
.maint-ticket {
  background: #faf9f6;
  color: #1a1a1a;
  border-radius: 8px;
  overflow: hidden;
  width: 280px;
  box-shadow: 0 8px 32px rgba(0,0,0,0.3);
}

.maint-ticket__header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem;
  border-bottom: 1px dashed #e8e6e2;
}

.maint-ticket__logo {
  height: 20px;
  width: auto;
}

.maint-ticket__type {
  font-family: 'Share Tech Mono', monospace;
  font-size: 0.6rem;
  letter-spacing: 0.1em;
  color: #888;
}

.maint-ticket__class {
  font-family: 'Share Tech Mono', monospace;
  font-size: 0.7rem;
  background: #1a1a1a;
  color: #faf9f6;
  padding: 0.25rem 0.5rem;
  border-radius: 2px;
}

.maint-ticket__route {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 1.5rem 1rem;
}

.maint-ticket__point {
  text-align: center;
}

.maint-ticket__code {
  display: block;
  font-size: 1.25rem;
  font-weight: 600;
}

.maint-ticket__city {
  display: block;
  font-size: 0.65rem;
  color: #888;
  margin-top: 0.25rem;
}

.maint-ticket__arrow {
  color: #ccc;
}

.maint-ticket__perf {
  height: 20px;
  background: repeating-linear-gradient(
    90deg,
    transparent,
    transparent 8px,
    #e8e6e2 8px,
    #e8e6e2 16px
  );
  position: relative;
}

.maint-ticket__perf::before,
.maint-ticket__perf::after {
  content: '';
  position: absolute;
  width: 20px;
  height: 20px;
  background: #1a1a1a;
  border-radius: 50%;
  top: 50%;
  transform: translateY(-50%);
}

.maint-ticket__perf::before { left: -10px; }
.maint-ticket__perf::after { right: -10px; }

.maint-ticket__stub {
  padding: 1rem;
  background: #f5f4f2;
}

.maint-ticket__stub-row {
  display: flex;
  justify-content: space-between;
}

.maint-ticket__stub-row > div {
  text-align: center;
}

.maint-ticket__lbl {
  display: block;
  font-family: 'Share Tech Mono', monospace;
  font-size: 0.55rem;
  color: #888;
  letter-spacing: 0.05em;
  margin-bottom: 0.25rem;
}

.maint-ticket__stub-row span:not(.maint-ticket__lbl) {
  font-weight: 600;
  font-size: 0.9rem;
}

.maint-cta__content {
  max-width: 500px;
}

.maint-cta__headline {
  font-size: clamp(1.75rem, 4vw, 2.5rem);
  font-weight: 600;
  margin-bottom: 1rem;
}

.maint-cta__body {
  color: rgba(250,249,246,0.7);
  line-height: 1.7;
  margin-bottom: 2rem;
}

.maint-cta__buttons {
  display: flex;
  gap: 1rem;
  flex-wrap: wrap;
}

.maint-cta__btn {
  display: inline-block;
  padding: 1rem 2rem;
  font-size: 0.85rem;
  font-weight: 500;
  text-decoration: none;
  border-radius: 4px;
  transition: transform 0.2s;
}

.maint-cta__btn:hover {
  transform: translateY(-2px);
}

.maint-cta__btn--primary {
  background: #faf9f6;
  color: #1a1a1a;
}

.maint-cta__btn--outline {
  background: transparent;
  color: #faf9f6;
  border: 1px solid rgba(250,249,246,0.3);
}

@media (max-width: 900px) {
  .maint-cta__container {
    grid-template-columns: 1fr;
    text-align: center;
  }
  .maint-ticket {
    margin: 0 auto;
  }
  .maint-cta__buttons {
    justify-content: center;
  }
}
```

**Step 2: Add CTA JSX**

```jsx
{/* ========== SECTION 29: CTA ========== */}
<section className="maint-cta">
  <div className="maint-cta__container">
    <Reveal direction="left">
      <div className="maint-ticket">
        <div className="maint-ticket__header">
          <img src="/assets/images/logos/hq/hq-aviation-logo-black.png" alt="HQ" className="maint-ticket__logo" />
          <span className="maint-ticket__type">SERVICE TICKET</span>
          <span className="maint-ticket__class">MAINT</span>
        </div>
        <div className="maint-ticket__route">
          <div className="maint-ticket__point">
            <span className="maint-ticket__code">AIRCRAFT</span>
            <span className="maint-ticket__city">Current</span>
          </div>
          <div className="maint-ticket__arrow">
            <svg width="24" height="8" viewBox="0 0 24 8" fill="none">
              <path d="M0 4H22M22 4L18 1M22 4L18 7" stroke="currentColor" strokeWidth="1"/>
            </svg>
          </div>
          <div className="maint-ticket__point">
            <span className="maint-ticket__code">AIRWORTHY</span>
            <span className="maint-ticket__city">Certified</span>
          </div>
        </div>
        <div className="maint-ticket__perf" />
        <div className="maint-ticket__stub">
          <div className="maint-ticket__stub-row">
            <div><span className="maint-ticket__lbl">TYPE</span><span>Inspection</span></div>
            <div><span className="maint-ticket__lbl">BAY</span><span>01</span></div>
            <div><span className="maint-ticket__lbl">ETA</span><span>TBD</span></div>
          </div>
        </div>
      </div>
    </Reveal>

    <Reveal direction="right">
      <div className="maint-cta__content">
        <span className="maint-pre-text" style={{ color: 'rgba(250,249,246,0.5)' }}>Ready to Schedule?</span>
        <h2 className="maint-cta__headline">Book Your Service</h2>
        <p className="maint-cta__body">
          Contact our maintenance team to discuss your requirements and schedule
          your next inspection or service.
        </p>
        <div className="maint-cta__buttons">
          <Link to="/contact" className="maint-cta__btn maint-cta__btn--primary">Contact Maintenance</Link>
          <Link to="/contact" className="maint-cta__btn maint-cta__btn--outline">Request Quote</Link>
        </div>
      </div>
    </Reveal>
  </div>
</section>

{/* ========== SECTION 30: FOOTER ========== */}
<FooterMinimal />
```

**Step 3: Commit**

```bash
git add src/pages/FinalMaintenance.jsx
git commit -m "feat: add CTA section with service ticket and footer

Co-Authored-By: Claude Opus 4.5 <noreply@anthropic.com>"
```

---

## Final Task: Integration & Testing

### Task 31: Final Integration

**Files:**
- Modify: `src/pages/FinalMaintenance.jsx`

**Step 1: Verify all sections render in correct order**

Ensure return statement has all 30 sections in order:
1. Hero
2. Scroll Prompt
3. Stats Strip
4. Philosophy
5. Parallax - Hangar
6. Services Header
7. Services Grid
8. Parts Badge
9. Parallax - Expertise
10. Certifications Header
11. EASA Part 145
12. Robinson Authorized
13. Guimbal Certified
14. Logos Strip
15. Parallax - Fleet
16. Aircraft Header
17. Aircraft Cards
18. Chief Engineer
19. Team Grid
20. Parallax - Precision
21. Inspection Sticky Scroll
22. Overhaul
23. Component Accordion
24. AOG Support
25. Refurbishment Tabs
26. Turnaround & Pricing
27. Location
28. FAQ
29. CTA + Ticket
30. Footer

**Step 2: Test responsive behavior**

Run: Dev server and test at mobile, tablet, desktop widths

**Step 3: Final commit**

```bash
git add src/pages/FinalMaintenance.jsx
git commit -m "feat: complete 30-section maintenance page

Co-Authored-By: Claude Opus 4.5 <noreply@anthropic.com>"
```

---

## Execution Notes

- Total estimated implementation time: 4-6 hours
- Each task is independently testable
- Commit after each task to enable easy rollback
- Test responsive behavior after completing each phase

## Image Assets Required

Verify these images exist or use placeholders:
- `/assets/images/facility/maintenance-hangar.jpg`
- `/assets/images/facility/engineer-working.jpg`
- `/assets/images/new-aircraft/r22-beta.webp`
- `/assets/images/new-aircraft/r44-raven.webp`
- `/assets/images/new-aircraft/r66-turbine.webp`
- `/assets/images/new-aircraft/cabri-g2.webp`
- `/assets/images/team/` (engineer photos)
- `/assets/images/logos/` (certification logos)

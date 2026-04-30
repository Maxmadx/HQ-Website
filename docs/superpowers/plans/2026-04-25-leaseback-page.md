# Leaseback Page Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a new lightweight educational landing page at `/leaseback` so the "Learn More" button on the Leaseback card on `/sales/new` has a real destination, following the brand DNA established by `/sales/new` and `/aircraft/r66`.

**Architecture:** Single-file React page (`src/pages/Leaseback.jsx`) following the standalone-branded-page convention used by `Sales.jsx`, `AircraftR66.jsx`, and `AircraftConsulting.jsx`: local `*Header` component, local `Reveal` wrapper, inline `<style jsx>` block, `FooterMinimal`. Five content sections (`lb-hero`, `lb-intro`, `lb-how`, `lb-benefits`, `lb-aircraft`). No on-page CTA, no FAQ, no inline form. CMS image sections registered in `src/lib/imageSections.js`.

**Tech Stack:** React 19, React Router 7, framer-motion 12, Vite, Vitest. Existing project hooks: `usePageImages`, `useCmsHighlight`. Existing components reused: `FooterMinimal`, `HqMenuPanel`.

**Spec:** `docs/superpowers/specs/2026-04-25-leaseback-page-design.md`

**Verification model:** This codebase has no per-page test suite. Verification for each section is **build success + dev-server visual check in browser**. The build command is `npm run build`; the dev server is `npm run dev:vite` (which runs Vite alone — `npm run dev` also boots the API server, which isn't needed here). After every task that ships code, the worker runs `npm run build` and confirms it exits 0.

---

## File Structure

- **New file:** `src/pages/Leaseback.jsx` — single page file containing all sub-components, the inline style block, and the default export. ~350–450 lines. Contains:
  - `LeasebackHeader()` — local header with `HqMenuPanel`
  - `Reveal()` — local framer-motion in-view wrapper (copied from `Sales.jsx:113`)
  - `LeasebackHero()` — Section 1
  - `LeasebackIntro()` — Section 2
  - `LeasebackHowItWorks()` — Section 3
  - `LeasebackBenefits()` — Section 4
  - `LeasebackEligibleAircraft()` — Section 5
  - `LeasebackStyles()` — wraps all CSS in a single `<style>` block
  - `Leaseback()` — default export composing the above

- **Modified:** `src/App.jsx` — one new import, one new `<Route>`.
- **Modified:** `src/pages/Sales.jsx:1457` — change one `<a>` to `<Link>`.
- **Modified:** `src/lib/imageSections.js` — add two new entries under a new `LEASEBACK PAGE` block.

---

### Task 1: Register CMS image sections for the Leaseback page

This must happen first so `usePageImages('leaseback')` has registered sections to read from.

**Files:**
- Modify: `src/lib/imageSections.js` — append a new block before `export const SECTION_MAP = ...`

- [ ] **Step 1: Locate the insertion point**

Open `src/lib/imageSections.js`. Find the line `export const SECTION_MAP = Object.fromEntries(SECTIONS.map((s) => [s.id, s]));` (around line 1120). The new section block goes inside the `SECTIONS` array, immediately before the closing `];` of that array (which sits just above the `SECTION_MAP` line).

Read the file around lines 1100–1125 to confirm the exact closing bracket location and the formatting style of the previous block.

- [ ] **Step 2: Add the two new sections**

Insert this block as the last item in the `SECTIONS` array (just before the `];`):

```javascript
  // ─── LEASEBACK PAGE ────────────────────────────────────────────────────────
  {
    id: 'lb-hero',
    page: 'leaseback',
    name: 'Leaseback Hero — Background Image',
    hint: 'Wide editorial aircraft shot behind the hero headline on /leaseback',
    type: 'single',
    images: [
      { id: 'lbh1', url: '/assets/images/new-aircraft/r66/rhc-r66-nxg-pv-left-side-wide-shot-from-rear-13751.jpg', alt: 'Robinson R66 wide rear view' },
    ],
  },
  {
    id: 'lb-aircraft',
    page: 'leaseback',
    name: 'Leaseback — Eligible Aircraft Cards',
    hint: 'Three cards in the Eligible Aircraft strip — R44, R66, Hughes 500',
    type: 'cards',
    slideLabels: ['Robinson R44', 'Robinson R66', 'Hughes 500'],
    images: [
      { id: 'lba1', url: '/assets/images/new-aircraft/r44/r44-raven-ii-ghagl.jpg', alt: 'Robinson R44 Raven II' },
      { id: 'lba2', url: '/assets/images/new-aircraft/r66-turbine.webp', alt: 'Robinson R66 Turbine' },
      { id: 'lba3', url: '/assets/images/aircraft/h500/h500-flight-1.jpg', alt: 'Hughes 500 in flight' },
    ],
  },
```

- [ ] **Step 3: Verify each referenced image path exists on disk**

Run from the repo root:

```bash
ls public/assets/images/new-aircraft/r66/rhc-r66-nxg-pv-left-side-wide-shot-from-rear-13751.jpg \
   public/assets/images/new-aircraft/r44/r44-raven-ii-ghagl.jpg \
   public/assets/images/new-aircraft/r66-turbine.webp \
   public/assets/images/aircraft/h500/h500-flight-1.jpg
```

Expected: each path printed, no `No such file or directory` errors.

If any path is missing, do NOT proceed — instead, find an equivalent existing image in `public/assets/images/` (use `find public/assets/images -type f -name "*r44*"` etc.) and substitute it. Update the spec inline at the same time so the spec and code stay in sync.

- [ ] **Step 4: Verify build still succeeds**

```bash
npm run build
```

Expected: build exits 0 with no errors. Warnings about chunk size are pre-existing and acceptable.

- [ ] **Step 5: Commit**

```bash
git add src/lib/imageSections.js
git commit -m "feat(cms): register lb-hero and lb-aircraft image sections

For the new /leaseback landing page."
```

---

### Task 2: Create the Leaseback page stub (header + footer + empty main)

A minimal page that renders cleanly so we can wire routing in Task 3 and verify navigation before adding content.

**Files:**
- Create: `src/pages/Leaseback.jsx`

- [ ] **Step 1: Create the file with stub content**

Create `src/pages/Leaseback.jsx` with this exact content:

```jsx
/**
 * HQ AVIATION — LEASEBACK PAGE
 *
 * Lightweight educational landing page for the Leaseback Program.
 * Destination for the "Learn More" button on the Leaseback card on /sales/new.
 *
 * Brand: Luxury Minimal Aviation
 * Typography: Space Grotesk + Share Tech Mono
 * Colors: #faf9f6 (warm white), #1a1a1a (charcoal), #4a4a4a (mid), #7a7a7a (light)
 * CSS prefix: lb-
 *
 * Sections:
 * 1. Hero — animated headline over editorial image
 * 2. Intro — what is leaseback
 * 3. How It Works — 3-step process
 * 4. Benefits — 4-card grid
 * 5. Eligible Aircraft — R44, R66, Hughes 500 strip linking to aircraft pages
 */

import React, { useRef, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, useInView, useScroll, useTransform } from 'framer-motion';
import { usePageImages } from '../hooks/usePageImages';
import { useCmsHighlight } from '../hooks/useCmsHighlight';

import '../assets/css/main.css';
import '../assets/css/components.css';

import FooterMinimal from '../components/FooterMinimal';
import HqMenuPanel from '../components/HqMenuPanel';

// ─────────────────────────────────────────────────────────────────────────────
// HEADER COMPONENT
// ─────────────────────────────────────────────────────────────────────────────

function LeasebackHeader() {
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
      <HqMenuPanel open={menuOpen} onClose={closeMenu} />

      <button
        className={`hq-menu-btn ${colorDark ? 'color-dark' : ''} ${scrolled ? 'scrolled' : ''} ${menuOpen ? 'open' : ''}`}
        onClick={toggleMenu}
        aria-label="Toggle menu"
      >
        <span></span>
        <span></span>
        <span></span>
      </button>

      <header
        className={`Header Header--top ${scrolled ? 'Header--scrolled' : ''}`}
        style={{
          '--spotlight-width': `${spotlightWidth}px`,
          '--spotlight-height': `${spotlightHeight}px`,
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
              />
            </Link>
            <nav className="Header-nav Header-nav--secondary" data-nc-element="secondary-nav">
              <div className="Header-nav-inner">
                <Link to="/flying" className="Header-nav-item">Flying</Link>
                <Link to="/training" className="Header-nav-item">Training</Link>
                <Link to="/sales" className="Header-nav-item">Aircraft</Link>
              </div>
            </nav>
          </div>
          <div data-nc-container="top-right"></div>
        </div>
      </header>
    </>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// REVEAL COMPONENT
// ─────────────────────────────────────────────────────────────────────────────

function Reveal({ children, delay = 0, direction = 'up' }) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.2 });

  const variants = {
    hidden: {
      opacity: 0,
      y: direction === 'up' ? 40 : direction === 'down' ? -40 : 0,
      x: direction === 'left' ? 40 : direction === 'right' ? -40 : 0,
    },
    visible: { opacity: 1, y: 0, x: 0 },
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

// ─────────────────────────────────────────────────────────────────────────────
// STYLES
// ─────────────────────────────────────────────────────────────────────────────

function LeasebackStyles() {
  return (
    <style>{`
      .lb-page { background: #faf9f6; color: #1a1a1a; font-family: 'Space Grotesk', sans-serif; }
      .lb-pre-text { font-family: 'Share Tech Mono', monospace; text-transform: uppercase; letter-spacing: 0.3em; font-size: 11px; color: #7a7a7a; }
    `}</style>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// MAIN COMPONENT
// ─────────────────────────────────────────────────────────────────────────────

export default function Leaseback() {
  const pageImages = usePageImages('leaseback');
  useCmsHighlight();
  useEffect(() => { window.scrollTo(0, 0); }, []);

  return (
    <div className="lb-page">
      <LeasebackStyles />
      <LeasebackHeader />
      <main>
        {/* Sections will be added in subsequent tasks */}
      </main>
      <FooterMinimal />
    </div>
  );
}
```

- [ ] **Step 2: Verify build succeeds**

```bash
npm run build
```

Expected: exit 0, no errors. The unused `pageImages` and unused imports (`Link`, `motion`, `useScroll`, `useTransform`, `Reveal`) will become used in subsequent tasks; if Vite complains about any of them, suppress the import temporarily — but Vite production build does not error on unused imports, so this should pass clean.

- [ ] **Step 3: Commit**

```bash
git add src/pages/Leaseback.jsx
git commit -m "feat(leaseback): scaffold Leaseback page stub

Local header (HqMenuPanel pattern), Reveal wrapper, FooterMinimal.
Sections to be added in subsequent commits."
```

---

### Task 3: Wire route + update Sales card link

Make the page reachable, both directly at `/leaseback` and via the "Learn More" button on `/sales/new`.

**Files:**
- Modify: `src/App.jsx` — one new import, one new `<Route>`
- Modify: `src/pages/Sales.jsx:1457` — change `<a>` to `<Link>`

- [ ] **Step 1: Add import to App.jsx**

In `src/App.jsx`, add this import near the cluster of other page imports. The natural place is right after the `import AircraftConsulting from './pages/AircraftConsulting';` line (currently line 81):

```jsx
import Leaseback from './pages/Leaseback';
```

- [ ] **Step 2: Add the route to App.jsx**

In the same file, find the cluster of standalone-branded routes near `<Route path="/aircraft-consulting" element={<AircraftConsulting />} />` (currently line 257). Add this line immediately after it:

```jsx
<Route path="/leaseback" element={<Leaseback />} />
```

- [ ] **Step 3: Update Sales.jsx Leaseback card link**

In `src/pages/Sales.jsx`, find this block at line 1457:

```jsx
<a href="/contact?subject=leaseback" className="sales-btn sales-btn--white">
  Learn More
</a>
```

Replace it with:

```jsx
<Link to="/leaseback" className="sales-btn sales-btn--white">
  Learn More
</Link>
```

`Link` is already imported in `Sales.jsx:11`, so no new import is needed. Verify the import is still present after the edit.

- [ ] **Step 4: Verify build succeeds**

```bash
npm run build
```

Expected: exit 0.

- [ ] **Step 5: Verify in dev server**

Run `npm run dev:vite` in one terminal. In a browser open `http://localhost:5173/leaseback`. Expected: page renders with header (burger button visible), empty main area, footer at bottom. No console errors.

Then visit `http://localhost:5173/sales/new`, scroll to the Leaseback card, click "Learn More". Expected: navigation to `/leaseback` with no full-page reload (URL changes via React Router).

Stop the dev server with Ctrl-C.

- [ ] **Step 6: Commit**

```bash
git add src/App.jsx src/pages/Sales.jsx
git commit -m "feat(leaseback): wire /leaseback route and Sales card link

Sales 'Learn More' on the Leaseback card now navigates via React Router
to the new /leaseback page instead of /contact?subject=leaseback."
```

---

### Task 4: Build the Hero section (`lb-hero`)

Full-viewport image background with overlay, animated word-by-word headline, eyebrow, tagline, divider, subtitle.

**Files:**
- Modify: `src/pages/Leaseback.jsx`

- [ ] **Step 1: Add the hero component**

In `src/pages/Leaseback.jsx`, add this component before the `LeasebackStyles` function (just before the `// STYLES` divider comment):

```jsx
// ─────────────────────────────────────────────────────────────────────────────
// SECTION 1: HERO
// ─────────────────────────────────────────────────────────────────────────────

function LeasebackHero({ pageImages }) {
  const heroRef = useRef(null);
  const { scrollYProgress } = useScroll({ target: heroRef, offset: ['start start', 'end start'] });
  const heroOpacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);
  const heroScale = useTransform(scrollYProgress, [0, 0.5], [1, 0.95]);
  const heroY = useTransform(scrollYProgress, [0, 0.5], [0, 100]);

  const heroImage =
    pageImages['lb-hero']?.[0]?.url ||
    '/assets/images/new-aircraft/r66/rhc-r66-nxg-pv-left-side-wide-shot-from-rear-13751.jpg';

  const words = ['LEASEBACK', 'PROGRAM'];

  return (
    <section ref={heroRef} className="lb-hero" data-cms-section="lb-hero">
      <motion.div
        className="lb-hero__bg"
        initial={{ scale: 1.08, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 1.6, ease: [0.16, 1, 0.3, 1] }}
      >
        <img src={heroImage} alt="HQ Aviation Leaseback Program" />
      </motion.div>
      <div className="lb-hero__overlay" />

      <motion.div
        className="lb-hero__content"
        style={{ opacity: heroOpacity, scale: heroScale, y: heroY }}
      >
        <motion.span
          className="lb-hero__label"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          Earn While You Own
        </motion.span>

        <h1 className="lb-hero__headline">
          {words.map((word, i) => (
            <motion.span
              key={word}
              className="lb-hero__word"
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 + i * 0.08, duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
            >
              {word}
            </motion.span>
          ))}
        </h1>

        <motion.div
          className="lb-hero__divider"
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ delay: 0.7, duration: 0.8 }}
        />

        <motion.p
          className="lb-hero__tagline"
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.85 }}
        >
          Put your aircraft to work when you're not flying.
        </motion.p>

        <motion.p
          className="lb-hero__subtitle"
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.0 }}
        >
          Earn revenue through charter and training operations, professionally managed by HQ.
        </motion.p>
      </motion.div>
    </section>
  );
}
```

- [ ] **Step 2: Use the hero component in the main render**

Replace the empty `<main>` block in the `Leaseback()` function with:

```jsx
<main>
  <LeasebackHero pageImages={pageImages} />
</main>
```

- [ ] **Step 3: Add hero styles to LeasebackStyles**

Replace the entire `LeasebackStyles` function with:

```jsx
function LeasebackStyles() {
  return (
    <style>{`
      .lb-page {
        background: #faf9f6;
        color: #1a1a1a;
        font-family: 'Space Grotesk', sans-serif;
      }
      .lb-pre-text {
        font-family: 'Share Tech Mono', monospace;
        text-transform: uppercase;
        letter-spacing: 0.3em;
        font-size: 11px;
        color: #7a7a7a;
      }

      /* ── SECTION 1: HERO ────────────────────────────────────────────────── */
      .lb-hero {
        position: relative;
        height: 100vh;
        min-height: 640px;
        overflow: hidden;
        display: flex;
        align-items: center;
        justify-content: center;
      }
      .lb-hero__bg {
        position: absolute;
        inset: 0;
        z-index: 0;
      }
      .lb-hero__bg img {
        width: 100%;
        height: 100%;
        object-fit: cover;
        object-position: center;
      }
      .lb-hero__overlay {
        position: absolute;
        inset: 0;
        background: linear-gradient(180deg, rgba(0,0,0,0.45) 0%, rgba(0,0,0,0.65) 100%);
        z-index: 1;
      }
      .lb-hero__content {
        position: relative;
        z-index: 2;
        max-width: 1200px;
        width: 100%;
        padding: 0 48px;
        color: #faf9f6;
        text-align: left;
      }
      .lb-hero__label {
        display: inline-block;
        font-family: 'Share Tech Mono', monospace;
        text-transform: uppercase;
        letter-spacing: 0.3em;
        font-size: 12px;
        color: #faf9f6;
        margin-bottom: 28px;
        opacity: 0.85;
      }
      .lb-hero__headline {
        font-family: 'Space Grotesk', sans-serif;
        font-weight: 600;
        font-size: clamp(48px, 8vw, 120px);
        line-height: 1;
        letter-spacing: -0.02em;
        margin: 0 0 32px;
        color: #faf9f6;
        display: flex;
        flex-wrap: wrap;
        gap: 0.25em;
      }
      .lb-hero__word {
        display: inline-block;
      }
      .lb-hero__divider {
        width: 80px;
        height: 1px;
        background: #faf9f6;
        opacity: 0.5;
        transform-origin: left center;
        margin-bottom: 24px;
      }
      .lb-hero__tagline {
        font-family: 'Space Grotesk', sans-serif;
        font-size: clamp(18px, 2vw, 24px);
        line-height: 1.4;
        font-weight: 400;
        color: #faf9f6;
        margin: 0 0 16px;
        max-width: 640px;
      }
      .lb-hero__subtitle {
        font-family: 'Space Grotesk', sans-serif;
        font-size: 15px;
        line-height: 1.6;
        color: #faf9f6;
        opacity: 0.75;
        margin: 0;
        max-width: 540px;
      }
      @media (max-width: 768px) {
        .lb-hero__content { padding: 0 24px; }
        .lb-hero__headline { font-size: clamp(40px, 12vw, 72px); }
      }
    `}</style>
  );
}
```

- [ ] **Step 4: Verify build succeeds**

```bash
npm run build
```

Expected: exit 0.

- [ ] **Step 5: Verify in dev server**

`npm run dev:vite`, then open `http://localhost:5173/leaseback`. Expected:
- Hero fills the viewport with the R66 image as background.
- Dark overlay sits over the image.
- Eyebrow `EARN WHILE YOU OWN` appears, then headline `LEASEBACK PROGRAM` animates in word-by-word, then divider scales in, then tagline + subtitle fade up.
- Resize browser to ~375px width: hero text doesn't overflow, padding is comfortable, headline scales down.
- Scroll down: hero fades and scales away.
- No console errors. Stop server.

- [ ] **Step 6: Commit**

```bash
git add src/pages/Leaseback.jsx
git commit -m "feat(leaseback): add hero section

Full-viewport image bg, animated word-by-word headline, eyebrow,
divider, tagline, subtitle. Scroll-progressed fade. CMS-editable
via lb-hero section."
```

---

### Task 5: Build the Intro section (`lb-intro`)

Two-column on desktop, single column on mobile. Left: heading + body. Right: pull-quote card.

**Files:**
- Modify: `src/pages/Leaseback.jsx`

- [ ] **Step 1: Add the intro component**

In `src/pages/Leaseback.jsx`, add immediately after the `LeasebackHero` component:

```jsx
// ─────────────────────────────────────────────────────────────────────────────
// SECTION 2: INTRO — WHAT IS LEASEBACK
// ─────────────────────────────────────────────────────────────────────────────

function LeasebackIntro() {
  return (
    <section className="lb-intro" data-cms-section="lb-intro">
      <div className="lb-intro__container">
        <div className="lb-intro__left">
          <Reveal>
            <span className="lb-pre-text">The Program</span>
            <h2 className="lb-intro__heading">A second life for your aircraft.</h2>
            <p className="lb-intro__body">
              A leaseback agreement places your aircraft into HQ's commercial operation. We fly it on charter and training work, you receive a share of the revenue earned, and the aircraft remains yours throughout.
            </p>
            <p className="lb-intro__body">
              Maintenance, scheduling, pilot management, and operational compliance all sit with HQ. You retain priority personal use under the terms of your agreement.
            </p>
          </Reveal>
        </div>
        <div className="lb-intro__right">
          <Reveal delay={0.15} direction="left">
            <div className="lb-intro__quote">
              <span className="lb-pre-text">Why Leaseback</span>
              <p className="lb-intro__quote-text">
                "Charter and training operations turn idle ownership cost into productive revenue."
              </p>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
```

- [ ] **Step 2: Add to main render**

In the `Leaseback()` function's `<main>` block, add `<LeasebackIntro />` immediately after `<LeasebackHero ... />`:

```jsx
<main>
  <LeasebackHero pageImages={pageImages} />
  <LeasebackIntro />
</main>
```

- [ ] **Step 3: Add intro styles**

In `LeasebackStyles`, append this block to the `<style>` content **immediately before the closing `}`** of the template string:

```css
/* ── SECTION 2: INTRO ──────────────────────────────────────────────── */
.lb-intro {
  background: #faf9f6;
  padding: 120px 48px;
}
.lb-intro__container {
  max-width: 1200px;
  margin: 0 auto;
  display: grid;
  grid-template-columns: 1.4fr 1fr;
  gap: 80px;
  align-items: start;
}
.lb-intro__left .lb-pre-text { display: block; margin-bottom: 16px; }
.lb-intro__heading {
  font-family: 'Space Grotesk', sans-serif;
  font-weight: 500;
  font-size: clamp(32px, 4vw, 56px);
  line-height: 1.1;
  letter-spacing: -0.02em;
  margin: 0 0 32px;
  color: #1a1a1a;
}
.lb-intro__body {
  font-size: 16px;
  line-height: 1.7;
  color: #4a4a4a;
  margin: 0 0 20px;
  max-width: 560px;
}
.lb-intro__body:last-child { margin-bottom: 0; }
.lb-intro__quote {
  border-top: 1px solid #1a1a1a;
  padding-top: 24px;
}
.lb-intro__quote .lb-pre-text { display: block; margin-bottom: 16px; }
.lb-intro__quote-text {
  font-family: 'Space Grotesk', sans-serif;
  font-size: 20px;
  line-height: 1.5;
  font-style: italic;
  color: #1a1a1a;
  margin: 0;
}
@media (max-width: 900px) {
  .lb-intro { padding: 80px 24px; }
  .lb-intro__container { grid-template-columns: 1fr; gap: 40px; }
}
```

- [ ] **Step 4: Verify build + dev server**

```bash
npm run build
```

Expected: exit 0.

`npm run dev:vite`, open `http://localhost:5173/leaseback`. Expected:
- Hero remains as before.
- After scrolling, intro section reveals: left column with `THE PROGRAM` eyebrow, large heading, two paragraphs of body text. Right column with a top-rule pull-quote.
- At 768px width and below, the right column drops below the left.
- No console errors. Stop server.

- [ ] **Step 5: Commit**

```bash
git add src/pages/Leaseback.jsx
git commit -m "feat(leaseback): add intro section

Two-column layout on desktop, single column on mobile.
Eyebrow + heading + body on left, pull-quote on right."
```

---

### Task 6: Build the How It Works section (`lb-how`)

Three-step process on a charcoal background. Big mono numbers, short titles, one-sentence descriptions.

**Files:**
- Modify: `src/pages/Leaseback.jsx`

- [ ] **Step 1: Add the how-it-works component**

Add immediately after `LeasebackIntro`:

```jsx
// ─────────────────────────────────────────────────────────────────────────────
// SECTION 3: HOW IT WORKS
// ─────────────────────────────────────────────────────────────────────────────

const HOW_STEPS = [
  {
    num: '01',
    title: 'Aircraft Assessment',
    description: 'Independent valuation, hours, and condition review.',
  },
  {
    num: '02',
    title: 'Operating Agreement',
    description: 'Revenue split, scheduling, and insurance terms agreed in writing.',
  },
  {
    num: '03',
    title: 'Earn While You Own',
    description: 'HQ flies and maintains the aircraft on your behalf. You receive monthly statements.',
  },
];

function LeasebackHowItWorks() {
  return (
    <section className="lb-how" data-cms-section="lb-how">
      <div className="lb-how__container">
        <Reveal>
          <span className="lb-pre-text lb-how__pre">The Process</span>
          <h2 className="lb-how__heading">From handover to revenue.</h2>
        </Reveal>
        <div className="lb-how__steps">
          {HOW_STEPS.map((step, i) => (
            <Reveal key={step.num} delay={0.1 + i * 0.1}>
              <div className="lb-how__step">
                <span className="lb-how__num">{step.num}</span>
                <h3 className="lb-how__title">{step.title}</h3>
                <p className="lb-how__desc">{step.description}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
```

- [ ] **Step 2: Add to main render**

```jsx
<main>
  <LeasebackHero pageImages={pageImages} />
  <LeasebackIntro />
  <LeasebackHowItWorks />
</main>
```

- [ ] **Step 3: Add styles**

Append before the closing `}` of the `<style>` template string:

```css
/* ── SECTION 3: HOW IT WORKS ───────────────────────────────────────── */
.lb-how {
  background: #1a1a1a;
  color: #faf9f6;
  padding: 120px 48px;
}
.lb-how__container {
  max-width: 1200px;
  margin: 0 auto;
}
.lb-how__pre {
  display: block;
  margin-bottom: 16px;
  color: #7a7a7a;
}
.lb-how__heading {
  font-family: 'Space Grotesk', sans-serif;
  font-weight: 500;
  font-size: clamp(32px, 4vw, 56px);
  line-height: 1.1;
  letter-spacing: -0.02em;
  margin: 0 0 64px;
  color: #faf9f6;
  max-width: 640px;
}
.lb-how__steps {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 48px;
  border-top: 1px solid rgba(250,249,246,0.15);
  padding-top: 48px;
}
.lb-how__step {
  position: relative;
}
.lb-how__num {
  font-family: 'Share Tech Mono', monospace;
  font-size: clamp(40px, 5vw, 64px);
  font-weight: 400;
  color: #7a7a7a;
  display: block;
  margin-bottom: 24px;
  letter-spacing: -0.02em;
}
.lb-how__title {
  font-family: 'Space Grotesk', sans-serif;
  font-weight: 500;
  font-size: 22px;
  line-height: 1.2;
  color: #faf9f6;
  margin: 0 0 16px;
}
.lb-how__desc {
  font-size: 15px;
  line-height: 1.6;
  color: #7a7a7a;
  margin: 0;
}
@media (max-width: 900px) {
  .lb-how { padding: 80px 24px; }
  .lb-how__steps { grid-template-columns: 1fr; gap: 40px; }
  .lb-how__heading { margin-bottom: 40px; }
}
```

- [ ] **Step 4: Verify build + dev server**

```bash
npm run build
```

Expected: exit 0.

Dev server: hero → intro → dark "How It Works" section visible. Three steps with mono numbers `01 / 02 / 03`. Reveal animation triggers on scroll. Mobile: steps stack vertically. No console errors.

- [ ] **Step 5: Commit**

```bash
git add src/pages/Leaseback.jsx
git commit -m "feat(leaseback): add How It Works section

Three-step process on dark background. Mono numbers, short
titles, one-sentence descriptions."
```

---

### Task 7: Build the Benefits section (`lb-benefits`)

2×2 grid of benefit cards, each with green-check icon, title, and one-sentence body.

**Files:**
- Modify: `src/pages/Leaseback.jsx`

- [ ] **Step 1: Add the benefits component**

Add after `LeasebackHowItWorks`:

```jsx
// ─────────────────────────────────────────────────────────────────────────────
// SECTION 4: BENEFITS
// ─────────────────────────────────────────────────────────────────────────────

const BENEFITS = [
  {
    title: 'Offset Ownership Costs',
    description: 'Charter and training revenue offsets fixed costs like insurance and hangarage.',
  },
  {
    title: 'Professional Management',
    description: 'HQ-employed pilots, scheduled maintenance, and full operational oversight.',
  },
  {
    title: 'Insurance & Liability Handled',
    description: 'Commercial cover and operating liability sit with HQ during leaseback hours.',
  },
  {
    title: 'Transparent Reporting',
    description: 'Monthly statements showing flight hours, revenue, and aircraft status.',
  },
];

function LeasebackBenefits() {
  return (
    <section className="lb-benefits" data-cms-section="lb-benefits">
      <div className="lb-benefits__container">
        <Reveal>
          <span className="lb-pre-text">Why Leaseback</span>
          <h2 className="lb-benefits__heading">What owners gain.</h2>
        </Reveal>
        <div className="lb-benefits__grid">
          {BENEFITS.map((benefit, i) => (
            <Reveal key={benefit.title} delay={0.1 + i * 0.08}>
              <div className="lb-benefits__card">
                <span className="lb-benefits__icon" aria-hidden="true">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                </span>
                <h3 className="lb-benefits__title">{benefit.title}</h3>
                <p className="lb-benefits__desc">{benefit.description}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
```

- [ ] **Step 2: Add to main render**

```jsx
<main>
  <LeasebackHero pageImages={pageImages} />
  <LeasebackIntro />
  <LeasebackHowItWorks />
  <LeasebackBenefits />
</main>
```

- [ ] **Step 3: Add styles**

Append before the closing `}` of the `<style>` template string:

```css
/* ── SECTION 4: BENEFITS ───────────────────────────────────────────── */
.lb-benefits {
  background: #faf9f6;
  padding: 120px 48px;
}
.lb-benefits__container {
  max-width: 1200px;
  margin: 0 auto;
}
.lb-benefits__heading {
  font-family: 'Space Grotesk', sans-serif;
  font-weight: 500;
  font-size: clamp(32px, 4vw, 56px);
  line-height: 1.1;
  letter-spacing: -0.02em;
  margin: 16px 0 64px;
  color: #1a1a1a;
  max-width: 640px;
}
.lb-benefits__grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 32px;
}
.lb-benefits__card {
  border-top: 1px solid #1a1a1a;
  padding: 28px 0 0;
}
.lb-benefits__icon {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  border-radius: 50%;
  background: #1a1a1a;
  color: #faf9f6;
  margin-bottom: 20px;
}
.lb-benefits__title {
  font-family: 'Space Grotesk', sans-serif;
  font-weight: 500;
  font-size: 20px;
  line-height: 1.25;
  color: #1a1a1a;
  margin: 0 0 12px;
}
.lb-benefits__desc {
  font-size: 15px;
  line-height: 1.6;
  color: #4a4a4a;
  margin: 0;
  max-width: 440px;
}
@media (max-width: 900px) {
  .lb-benefits { padding: 80px 24px; }
  .lb-benefits__grid { grid-template-columns: 1fr; gap: 24px; }
  .lb-benefits__heading { margin-bottom: 40px; }
}
```

- [ ] **Step 4: Verify build + dev server**

```bash
npm run build
```

Expected: exit 0.

Dev server: section appears after How It Works. Four benefit cards in 2×2 grid on desktop, stacked on mobile. Each card has a black-circle check icon, title, body. Reveals stagger in. No console errors.

- [ ] **Step 5: Commit**

```bash
git add src/pages/Leaseback.jsx
git commit -m "feat(leaseback): add benefits 2x2 grid

Four benefit cards with check icons, top-rule editorial styling."
```

---

### Task 8: Build the Eligible Aircraft strip (`lb-aircraft`)

Three editorial cards (R44 / R66 / Hughes 500) linking to their aircraft pages.

**Files:**
- Modify: `src/pages/Leaseback.jsx`

- [ ] **Step 1: Add the eligible-aircraft component**

Add after `LeasebackBenefits`:

```jsx
// ─────────────────────────────────────────────────────────────────────────────
// SECTION 5: ELIGIBLE AIRCRAFT
// ─────────────────────────────────────────────────────────────────────────────

const AIRCRAFT_CARDS = [
  {
    href: '/aircraft/r44',
    eyebrow: 'Piston',
    name: 'Robinson R44',
    role: 'Four-seat workhorse for charter and training.',
    fallback: '/assets/images/new-aircraft/r44/r44-raven-ii-ghagl.jpg',
    alt: 'Robinson R44 Raven II',
  },
  {
    href: '/aircraft/r66',
    eyebrow: 'Turbine',
    name: 'Robinson R66',
    role: 'Five-seat turbine — premium charter and instruction.',
    fallback: '/assets/images/new-aircraft/r66-turbine.webp',
    alt: 'Robinson R66 Turbine',
  },
  {
    href: '/aircraft/h500',
    eyebrow: 'Turbine',
    name: 'Hughes 500',
    role: 'Compact turbine — utility, charter, and specialty work.',
    fallback: '/assets/images/aircraft/h500/h500-flight-1.jpg',
    alt: 'Hughes 500 in flight',
  },
];

function LeasebackEligibleAircraft({ pageImages }) {
  const cardImages = pageImages['lb-aircraft'] || [];
  return (
    <section className="lb-aircraft" data-cms-section="lb-aircraft">
      <div className="lb-aircraft__container">
        <Reveal>
          <span className="lb-pre-text">Eligible Aircraft</span>
          <h2 className="lb-aircraft__heading">Aircraft we can place.</h2>
        </Reveal>
        <div className="lb-aircraft__grid">
          {AIRCRAFT_CARDS.map((card, i) => {
            const imgUrl = cardImages[i]?.url || card.fallback;
            const imgAlt = cardImages[i]?.alt || card.alt;
            return (
              <Reveal key={card.href} delay={0.1 + i * 0.1}>
                <Link to={card.href} className="lb-aircraft__card">
                  <div className="lb-aircraft__img-wrap">
                    <img src={imgUrl} alt={imgAlt} className="lb-aircraft__img" />
                  </div>
                  <div className="lb-aircraft__body">
                    <span className="lb-pre-text">{card.eyebrow}</span>
                    <h3 className="lb-aircraft__name">{card.name}</h3>
                    <p className="lb-aircraft__role">{card.role}</p>
                    <span className="lb-aircraft__arrow" aria-hidden="true">→</span>
                  </div>
                </Link>
              </Reveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}
```

- [ ] **Step 2: Add to main render**

```jsx
<main>
  <LeasebackHero pageImages={pageImages} />
  <LeasebackIntro />
  <LeasebackHowItWorks />
  <LeasebackBenefits />
  <LeasebackEligibleAircraft pageImages={pageImages} />
</main>
```

- [ ] **Step 3: Add styles**

Append before the closing `}` of the `<style>` template string:

```css
/* ── SECTION 5: ELIGIBLE AIRCRAFT ──────────────────────────────────── */
.lb-aircraft {
  background: #faf9f6;
  padding: 0 48px 120px;
}
.lb-aircraft__container {
  max-width: 1200px;
  margin: 0 auto;
}
.lb-aircraft__heading {
  font-family: 'Space Grotesk', sans-serif;
  font-weight: 500;
  font-size: clamp(32px, 4vw, 56px);
  line-height: 1.1;
  letter-spacing: -0.02em;
  margin: 16px 0 64px;
  color: #1a1a1a;
  max-width: 640px;
}
.lb-aircraft__grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 32px;
}
.lb-aircraft__card {
  display: block;
  text-decoration: none;
  color: inherit;
  background: #ffffff;
  border: 1px solid rgba(26,26,26,0.08);
  transition: transform 0.4s ease, border-color 0.4s ease;
}
.lb-aircraft__card:hover {
  transform: translateY(-4px);
  border-color: rgba(26,26,26,0.25);
}
.lb-aircraft__img-wrap {
  aspect-ratio: 4 / 3;
  overflow: hidden;
  background: #1a1a1a;
}
.lb-aircraft__img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.6s ease;
}
.lb-aircraft__card:hover .lb-aircraft__img { transform: scale(1.04); }
.lb-aircraft__body {
  padding: 24px;
  position: relative;
}
.lb-aircraft__body .lb-pre-text { display: block; margin-bottom: 12px; }
.lb-aircraft__name {
  font-family: 'Space Grotesk', sans-serif;
  font-weight: 500;
  font-size: 22px;
  line-height: 1.2;
  color: #1a1a1a;
  margin: 0 0 12px;
}
.lb-aircraft__role {
  font-size: 14px;
  line-height: 1.55;
  color: #4a4a4a;
  margin: 0 32px 0 0;
}
.lb-aircraft__arrow {
  position: absolute;
  right: 24px;
  bottom: 24px;
  font-size: 20px;
  color: #1a1a1a;
  transition: transform 0.3s ease;
}
.lb-aircraft__card:hover .lb-aircraft__arrow { transform: translateX(4px); }
@media (max-width: 900px) {
  .lb-aircraft { padding: 0 24px 80px; }
  .lb-aircraft__grid { grid-template-columns: 1fr; gap: 20px; }
  .lb-aircraft__heading { margin-bottom: 40px; }
}
```

Note: `lb-aircraft` has zero top padding because it sits directly under `lb-benefits` which already has 120px bottom padding — this avoids doubled spacing while keeping bottom padding for the gap before the footer.

- [ ] **Step 4: Verify build + dev server**

```bash
npm run build
```

Expected: exit 0.

Dev server: scroll to the eligible aircraft section. Three cards in a row on desktop. Each card shows image, eyebrow, name, role, arrow. Hovering raises the card and slides the arrow right. Click each card and verify navigation:
- R44 card → `/aircraft/r44`
- R66 card → `/aircraft/r66`
- Hughes 500 card → `/aircraft/h500`

Mobile (375px): cards stack vertically. No horizontal scroll. No console errors.

- [ ] **Step 5: Commit**

```bash
git add src/pages/Leaseback.jsx
git commit -m "feat(leaseback): add Eligible Aircraft strip

Three Link cards (R44, R66, Hughes 500) with image, eyebrow,
name, role, hover arrow. CMS-editable via lb-aircraft section."
```

---

### Task 9: Final verification — responsive + admin + acceptance criteria

End-to-end check against the spec's acceptance criteria.

**Files:** none (verification only)

- [ ] **Step 1: Build**

```bash
npm run build
```

Expected: exit 0, no errors.

- [ ] **Step 2: Verify each acceptance criterion in dev server**

Run `npm run dev:vite`. Check each of these from the spec:

1. `http://localhost:5173/leaseback` renders with no console errors. ✓
2. Visit `http://localhost:5173/sales/new`, scroll to Leaseback card, click "Learn More" — URL should change to `/leaseback` without a full page reload (DevTools Network tab: no `document` request). ✓
3. Test viewports — open DevTools device toolbar and check 360px, 768px, 1024px, 1440px, 1920px. No horizontal scroll on any. ✓
4. Click the burger menu button on `/leaseback` — `HqMenuPanel` opens. Click again or press Escape — it closes. Same behaviour as on `/sales/new`. ✓
5. Click each of the three eligible-aircraft cards — verify each navigates to its `/aircraft/...` page. ✓
6. Scroll the page from top to bottom — every section's reveal animation triggers as it enters the viewport. ✓
7. Sign in to admin and turn on `useCmsHighlight` edit mode (the existing flow used on other pages) — confirm the page's editable images and sections become highlighted as on sibling pages. (If admin login is not available in this environment, skip this check and note it for QA.) ✓

- [ ] **Step 3: Final commit (only if anything was tweaked during verification)**

If responsive testing revealed a layout glitch and you fixed it, commit with:

```bash
git add src/pages/Leaseback.jsx
git commit -m "fix(leaseback): responsive polish from final verification"
```

If no fixes were needed, skip this step.

- [ ] **Step 4: Report**

Output a short summary listing the 5 commits and the URL `/leaseback`. If any acceptance criterion failed, list it explicitly with the failure mode — do not claim the work complete.

---

## Self-Review

Run this checklist after the plan is written. Fix issues inline and move on.

**Spec coverage:**
- ✅ Hero section — Task 4
- ✅ Intro section — Task 5
- ✅ How It Works section — Task 6
- ✅ Benefits 2×2 grid — Task 7
- ✅ Eligible Aircraft strip — Task 8
- ✅ Local `LeasebackHeader` and `Reveal` — Task 2
- ✅ FooterMinimal — Task 2
- ✅ CSS prefix `lb-` — every styled rule uses it
- ✅ No CTA / no FAQ / no form — none added
- ✅ Route `/leaseback` — Task 3
- ✅ Sales card link change — Task 3
- ✅ `imageSections.js` registration — Task 1
- ✅ No `Helmet` / SEO — none added
- ✅ Acceptance criteria — Task 9

**Placeholder scan:** No `TBD`, no "implement later", no "similar to Task N", no "appropriate error handling". Every code step contains the exact code to write.

**Type / API consistency:**
- `pageImages` is passed as a prop into `LeasebackHero` and `LeasebackEligibleAircraft` (the only two sections that need it). All other sections are self-contained.
- `Reveal` signature `{ children, delay, direction }` is consistent with sibling pages.
- `usePageImages('leaseback')` matches the page key registered in Task 1.
- CMS section IDs (`lb-hero`, `lb-aircraft`) match between Task 1 (registration) and Tasks 4 & 8 (consumption).
- Aircraft routes (`/aircraft/r44`, `/aircraft/r66`, `/aircraft/h500`) match what App.jsx already defines (lines 219–225 in current App.jsx).

No issues found.

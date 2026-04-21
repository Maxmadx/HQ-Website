# R22 Page Upgrade — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Bring `src/pages/AircraftR22.jsx` (currently 2,730 lines) to design-and-content parity with `AircraftR44.jsx`, `AircraftR66.jsx`, and `AircraftR88.jsx` — by extracting a component-based architecture, adding a sticky-scroll specs stack, and authoring four new content sections plus an expanded Captain Q narrative.

**Architecture:** Extract an `R22Styles` component (per R66/R88 pattern), decompose the monolithic `AircraftR22()` body into section components, wrap Hero-adjacent sections in `r22-sticky-stack`, then layer in new sections. Three phases, each ending at a shippable state.

**Tech Stack:** React 19, Vite, Framer Motion (`motion`, `useScroll`, `useTransform`, `useInView`, `AnimatePresence`, `LayoutGroup`), Tailwind-agnostic inline styles (scoped via `<style>` tag), Firebase (`usePageImages`), React Router v7 (`Link`).

**Spec:** `docs/superpowers/specs/2026-04-21-r22-page-upgrade-design.md` — authoritative source for copy, data object shapes, CMS markers, and section order. When this plan says "see spec §N", read that section of the spec file.

**Route under test:** `/aircraft/r22` — run `npm run dev:vite` and navigate to `http://localhost:5173/aircraft/r22` for every verification step.

---

## File Structure

Only three files are touched:

- **`src/pages/AircraftR22.jsx`** — primary target. Refactored from monolithic function into component-style page. All changes for Phases 1 and 2 live here; Phase 3 adds new section components in the same file (matching R66/R88's same-file pattern).
- **`src/lib/imageSections.js`** — add default image entries for the new `r22-hero`, `r22-specifications`, `r22-champion`, `r22-fleet` CMS sections so the admin Images panel surfaces them.
- **`src/pages/admin/AdminImages.jsx`** (verify only) — confirm the new `data-cms-section` markers are picked up automatically; no code change expected.

No new files are created. No shared data module is introduced (matches R44/R66/R88 convention of in-file data objects).

---

## Testing strategy

This repo uses Vitest+jsdom for utility/hooks tests (`src/hooks/`, `src/lib/`, `src/components/admin/`) but has no component test coverage for the aircraft landing pages. Forcing a component-test framework here would be inconsistent with existing patterns.

**Verification for visual/structural tasks:** Run the Vite dev server, navigate to `/aircraft/r22`, and manually confirm the behavior described in each task's "Verify" step. The reference pages (`/aircraft/r44`, `/aircraft/r66`, `/aircraft/r88`) stay available in adjacent tabs for side-by-side comparison.

**Unit-testable logic:** The variant selector in Specifications (Task 5) and the multi-select comparison table (Task 10) have pure derivation logic (picking spec rows from variant state). Tests for these are optional and have been left out of the task steps to match existing patterns; add them at your discretion.

**Regression targets:** after each phase, spot-check that `/aircraft/r44`, `/aircraft/r66`, `/aircraft/r88` still render (no shared code should have been touched, so this is a sanity check only).

---

## Commit discipline

One commit per task. Commit messages:
```
feat(r22): <task summary>
```
Examples: `feat(r22): extract R22Styles component`, `feat(r22): add R22WhyTrainer section`.

---

# PHASE 1 — FOUNDATION

Refactor-only phase. No content changes; no new sections. Exit state: the page looks materially identical to today but the code is organised into sections.

---

## Task 1: Extract `R22Styles` component

**Files:**
- Modify: `src/pages/AircraftR22.jsx` — the inline `<style>{`...`}</style>` block currently at lines ~1079–2727 moves into a new `R22Styles()` component.

- [ ] **Step 1: Locate the inline `<style>` block.** Open `src/pages/AircraftR22.jsx` and confirm the `<style>{`` opening at line ~1079 and closing `}</style>` near line ~2727. Note the exact line range — the full CSS body will move out unchanged.

- [ ] **Step 2: Define `R22Styles()` above the `AircraftR22()` function.** Insert this immediately after the `HistoryTimeline` helper (around line 314, before `function AircraftR22()`):

```jsx
// ============================================================================
// R22 STYLES
// ============================================================================
function R22Styles() {
  return (
    <style>{`
      /* CSS body will be pasted here in Step 3 */
    `}</style>
  );
}
```

- [ ] **Step 3: Move the CSS body.** Cut the entire contents between `<style>{\`` and `\`}</style>` in the JSX return (lines ~1080–2727) and paste inside the new `R22Styles()` component's template literal. Delete the now-empty `<style>` / `</style>` lines from the JSX return.

- [ ] **Step 4: Render `<R22Styles />` in the JSX tree.** In the `AircraftR22()` return, replace the spot where the old `<style>` lived with a single line:

```jsx
      <R22Styles />
```

Place it as the first child of the top-level `<div className="r22-page">`, just before `<R22Header />`. This matches R66/R88's ordering.

- [ ] **Step 5: Verify the page renders unchanged.** Run `npm run dev:vite` and open `http://localhost:5173/aircraft/r22`. Scroll the full page. Expected: pixel-identical to before the refactor. No console errors.

- [ ] **Step 6: Commit.**

```bash
git add src/pages/AircraftR22.jsx
git commit -m "feat(r22): extract R22Styles component"
```

---

## Task 2: Decompose body into section components

**Files:**
- Modify: `src/pages/AircraftR22.jsx` — extract each `<section>` in the `AircraftR22()` return into its own component function.

Each section becomes a named component defined above `AircraftR22()`. The `AircraftR22()` function body shrinks to a hook-setup block followed by a JSX return that composes the components.

- [ ] **Step 1: Identify the sections and their current line ranges.** In the current file:
  - Hero: `<section ref={heroRef} className="r22-hero">` at line ~444
  - Intro: `<section className="r22-intro">` at line ~532
  - Counter: `<section className="r22-counter">` at line ~593
  - History: `<section className="r22-history">` at line ~619
  - Specs: `<section className="r22-specs">` at line ~649
  - Characteristics: `<section className="r22-characteristics">` at line ~740
  - Champion (compact): `<section className="r22-champion r22-champion--compact">` at line ~777
  - Variants: `<section className="r22-variants">` at line ~820
  - Training: `<section className="r22-training">` at line ~898
  - Gallery: `<section className="r22-gallery" ...>` at line ~991
  - CTA: `<section className="r22-cta">` at line ~1048

- [ ] **Step 2: Extract hook state at the top of `AircraftR22()`.** The current `AircraftR22()` defines refs (`heroRef`), scroll transforms (`heroScale`, `heroY`), state (`activeSpec`, `activeVariant`, `lightboxImage`), data arrays (`specs`, `historyEvents`, `variants`, etc.), and calls `usePageImages`, `useCmsHighlight`. Some of this is shared across sections; some is section-local. Move section-local state **into** the new section components; keep shared data (`galleryImages`, `usePageImages` result) in `AircraftR22()` and pass via props only where needed.

  Rule of thumb: If a piece of state is used by exactly one section, move it into that section's component. If it's used by multiple sections, leave it in `AircraftR22()` and pass as props.

- [ ] **Step 3: Define each section component.** For each of the 11 sections above, define a component like:

```jsx
// ============================================================================
// R22 HERO
// ============================================================================
function R22Hero() {
  const heroRef = useRef(null);
  const { scrollYProgress } = useScroll({ target: heroRef, offset: ['start start', 'end start'] });
  const heroScale = useTransform(scrollYProgress, [0, 0.5], [1, 0.95]);
  const heroY = useTransform(scrollYProgress, [0, 0.5], [0, 100]);

  return (
    <section ref={heroRef} className="r22-hero">
      {/* existing hero JSX, copied verbatim from AircraftR22()'s return */}
    </section>
  );
}
```

Repeat for: `R22Introduction`, `R22Counter`, `R22HistoryTimeline`, `R22Specifications`, `R22FlightCharacteristics`, `R22Champion`, `R22Variants`, `R22Training`, `R22Gallery`, `R22CTA`.

**Naming collision to resolve:** The file already has a helper at line ~290 called `HistoryTimeline` that renders the dotted timeline inside the section. To avoid colliding with the new `R22HistoryTimeline` section wrapper, rename the private helper to `HistoryTimelineDots` (update the single usage site as well). This is the one content-adjacent change permitted in Task 2.

**Important:** Do not change any JSX content, class names, or copy in this task. This is a mechanical refactor. Content changes come in later tasks.

- [ ] **Step 4: Rewrite `AircraftR22()` return.** After extraction, `AircraftR22()` should look like:

```jsx
function AircraftR22() {
  useCmsHighlight();
  const pageImages = usePageImages('r22');

  return (
    <div className="r22-page">
      <R22Styles />
      <R22Header />
      <R22Hero />
      <R22Introduction />
      <R22Counter />
      <R22HistoryTimeline />
      <R22Specifications />
      <R22FlightCharacteristics />
      <R22Champion />
      <R22Variants />
      <R22Training />
      <R22Gallery pageImages={pageImages} />
      <R22CTA />
      <FooterMinimal />
    </div>
  );
}
```

Note the current section order is preserved. `pageImages` is passed only to `R22Gallery` since it's the only consumer right now.

- [ ] **Step 5: Verify the page renders unchanged.** Run `npm run dev:vite`, navigate to `/aircraft/r22`. Walk through every section, click the specs card items, click gallery items to open the lightbox, click variant tabs. Expected: behavior identical to before.

- [ ] **Step 6: Commit.**

```bash
git add src/pages/AircraftR22.jsx
git commit -m "feat(r22): decompose page body into section components"
```

---

## Task 3: Restyle to R66/R88 design tokens

**Files:**
- Modify: `src/pages/AircraftR22.jsx` — inside `R22Styles()`, refine the existing CSS tokens to match R66/R88.

**Goal:** Tighten typography, spacing, and colour usage so the page *feels* like it belongs next to R66/R88, without changing layout or content.

- [ ] **Step 1: Confirm current tokens.** The existing styles already use the right core palette (`#faf9f6`, `#1a1a1a`, `#4a4a4a`, `#7a7a7a`) — verify this in `R22Styles()` and leave those untouched.

- [ ] **Step 2: Update the `.r22-pre-text` eyebrow** to exactly match R66/R88:

```css
.r22-pre-text {
  display: block;
  font-family: 'Share Tech Mono', 'Courier New', monospace;
  font-size: 0.75rem;
  text-transform: uppercase;
  letter-spacing: 0.25em;
  color: #999;
  margin-bottom: 0.75rem;
}
```

(The existing rule is close — the only likely missing property is `font-family`; add it if absent.)

- [ ] **Step 3: Standardise section-header typography.** Confirm `.r22-section-header h2` uses `font-family: 'Space Grotesk'` and `font-weight: 700`. Update `font-size` to `clamp(2.25rem, 4.5vw, 3.25rem)` to match R66 section headings.

- [ ] **Step 4: Standardise section padding.** Audit each `.r22-<section>` class's padding; normalise to `padding: 8rem 2rem` for large sections and `padding: 6rem 2rem` for dense sections (Counter, Training, CTA). This matches R66's rhythm.

- [ ] **Step 5: Verify visually.** Dev server + `/aircraft/r22`. Expected: noticeable tightening of typography and rhythm; no layout breaks.

- [ ] **Step 6: Commit.**

```bash
git add src/pages/AircraftR22.jsx
git commit -m "feat(r22): align design tokens with R66/R88"
```

---

# PHASE 2 — STICKY STACK + UPGRADED SECTIONS

Add new sticky-scroll machinery and upgrade the biggest existing sections. Exit state: page has the R66/R88 "feel" — sticky highlights band, blueprint split specs, scroll-driven hero.

---

## Task 4: Add `R22Highlights` + sticky-stack wrapper

**Files:**
- Modify: `src/pages/AircraftR22.jsx`

- [ ] **Step 1: Add the `R22_HIGHLIGHTS` data constant** near the top of the file (above `R22Styles()`):

```jsx
const R22_HIGHLIGHTS = [
  { label: 'Seats', value: '2' },
  { label: 'MTOW', value: '1,370 lb' },
  { label: 'Cruise', value: '96 kts' },
  { label: 'Built since 1979', value: '4,800+' },
];
```

- [ ] **Step 2: Define the `R22Highlights` component.** Insert before `R22Hero`:

```jsx
function R22Highlights() {
  return (
    <section className="r22-highlights" aria-label="R22 at a glance">
      <div className="r22-highlights__inner">
        <span className="r22-pre-text">At a glance</span>
        <ul className="r22-highlights__list">
          {R22_HIGHLIGHTS.map((h) => (
            <li key={h.label} className="r22-highlights__item">
              <span className="r22-highlights__value">{h.value}</span>
              <span className="r22-highlights__label">{h.label}</span>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
```

- [ ] **Step 3: Add CSS to `R22Styles()`.** Append:

```css
.r22-sticky-stack {
  position: relative;
}
.r22-highlights {
  position: sticky;
  top: 0;
  z-index: 5;
  background: rgba(250, 249, 246, 0.92);
  backdrop-filter: blur(10px);
  border-bottom: 1px solid rgba(26, 26, 26, 0.08);
  padding: 1.25rem 2rem;
}
.r22-highlights__inner {
  max-width: 1280px;
  margin: 0 auto;
  display: flex;
  align-items: center;
  gap: 2rem;
}
.r22-highlights__list {
  display: flex;
  gap: 2.5rem;
  list-style: none;
  padding: 0;
  margin: 0;
  flex: 1;
  justify-content: flex-end;
}
.r22-highlights__item {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}
.r22-highlights__value {
  font-family: 'Share Tech Mono', monospace;
  font-size: 1.25rem;
  color: #1a1a1a;
}
.r22-highlights__label {
  font-size: 0.7rem;
  text-transform: uppercase;
  letter-spacing: 0.2em;
  color: #7a7a7a;
}
@media (max-width: 768px) {
  .r22-highlights__inner { flex-direction: column; align-items: flex-start; gap: 0.75rem; }
  .r22-highlights__list { gap: 1.25rem; flex-wrap: wrap; justify-content: flex-start; }
}
```

- [ ] **Step 4: Wrap the sticky stack in `AircraftR22()`.** Update the JSX return:

```jsx
<R22Hero />
<div className="r22-sticky-stack">
  <R22Highlights />
  <R22Introduction />
  <R22Specifications />
</div>
<R22FlightCharacteristics />
```

- [ ] **Step 5: Verify.** Dev server + `/aircraft/r22`. Scroll past the hero. Expected: the highlights band appears at the top of the viewport and stays pinned while Intro and Specs scroll past; it leaves the viewport when Specs ends. No layout breaks on mobile.

- [ ] **Step 6: Commit.**

```bash
git add src/pages/AircraftR22.jsx
git commit -m "feat(r22): add sticky highlights band and stack wrapper"
```

---

## Task 5: Upgrade `R22Specifications` — blueprint split layout with variant selector

**Files:**
- Modify: `src/pages/AircraftR22.jsx`

- [ ] **Step 1: Add `R22_VARIANT_DATA` near the other data constants:**

```jsx
const R22_VARIANT_DATA = [
  {
    id: 'beta',
    name: 'R22 Beta',
    years: '1985–1995',
    engine: 'Lycoming O-320-B2C',
    power: '160 HP / 124 HP cont.',
    vne: '102 kts',
    cruise: '96 kts',
    range: '240 nm',
    mtow: '1,370 lb',
    usefulLoad: '440 lb',
    hoverIge: '9,400 ft',
    rotorDia: '25 ft 2 in',
    fuel: '19.2 US gal',
    seats: '2',
    floats: 'Skids',
    notable: 'Defined the modern trainer market.',
  },
  {
    id: 'beta-ii',
    name: 'R22 Beta II',
    years: '1996–Present',
    engine: 'Lycoming O-360-J2A',
    power: '145 HP / 131 HP cont.',
    vne: '102 kts',
    cruise: '96 kts',
    range: '240 nm',
    mtow: '1,370 lb',
    usefulLoad: '440 lb',
    hoverIge: '9,400 ft',
    rotorDia: '25 ft 2 in',
    fuel: '19.2 US gal',
    seats: '2',
    floats: 'Skids',
    notable: 'Current production model.',
  },
  {
    id: 'mariner',
    name: 'R22 Mariner',
    years: '1990–2010',
    engine: 'Lycoming O-360-J2A',
    power: '145 HP / 131 HP cont.',
    vne: '102 kts',
    cruise: '96 kts',
    range: '220 nm',
    mtow: '1,370 lb',
    usefulLoad: '400 lb',
    hoverIge: '9,400 ft',
    rotorDia: '25 ft 2 in',
    fuel: '19.2 US gal',
    seats: '2',
    floats: 'Pop-out floats',
    notable: 'Float-equipped coastal variant.',
  },
];

const R22_SPEC_ROWS = [
  { label: 'Powerplant', key: 'engine' },
  { label: 'Power (takeoff / continuous)', key: 'power' },
  { label: 'Maximum speed (Vne)', key: 'vne' },
  { label: 'Cruise speed', key: 'cruise' },
  { label: 'Range (no reserve)', key: 'range' },
  { label: 'Maximum gross weight', key: 'mtow' },
  { label: 'Useful load', key: 'usefulLoad' },
  { label: 'Hover ceiling IGE', key: 'hoverIge' },
  { label: 'Rotor diameter', key: 'rotorDia' },
  { label: 'Fuel capacity', key: 'fuel' },
  { label: 'Seats', key: 'seats' },
  { label: 'Landing gear', key: 'floats' },
];
```

- [ ] **Step 2: Replace the old `R22Specifications` body.** Delete the current body (built around `InteractiveSpecsCard`) and write:

```jsx
function R22Specifications() {
  const [activeVariantId, setActiveVariantId] = useState('beta-ii');
  const activeVariant = R22_VARIANT_DATA.find((v) => v.id === activeVariantId);

  return (
    <section className="r22-specs" data-cms-section="r22-specifications">
      <div className="r22-specs__inner">
        <div className="r22-specs__header">
          <span className="r22-pre-text">Specifications</span>
          <h2>Anatomy of a trainer</h2>
        </div>
        <div className="r22-specs__split">
          <div className="r22-specs__blueprint">
            <img
              src="/assets/images/new-aircraft/r22/r22blueprint.jpg"
              alt="R22 blueprint"
              loading="lazy"
            />
          </div>
          <div className="r22-specs__table">
            <div className="r22-specs__selector">
              {R22_VARIANT_DATA.map((v) => (
                <button
                  key={v.id}
                  type="button"
                  className={`r22-specs__chip ${activeVariantId === v.id ? 'is-active' : ''}`}
                  onClick={() => setActiveVariantId(v.id)}
                >
                  {v.name}
                </button>
              ))}
            </div>
            <dl className="r22-specs__rows">
              {R22_SPEC_ROWS.map((row) => (
                <div key={row.key} className="r22-specs__row">
                  <dt>{row.label}</dt>
                  <dd>{activeVariant[row.key]}</dd>
                </div>
              ))}
            </dl>
          </div>
        </div>
      </div>
    </section>
  );
}
```

- [ ] **Step 3: Append CSS to `R22Styles()`:**

```css
.r22-specs {
  background: #faf9f6;
  padding: 8rem 2rem;
  position: sticky;
  top: 0;
}
.r22-specs__inner { max-width: 1280px; margin: 0 auto; }
.r22-specs__header { margin-bottom: 3rem; }
.r22-specs__header h2 {
  font-size: clamp(2.25rem, 4.5vw, 3.25rem);
  font-weight: 700;
  margin: 0.5rem 0 0;
  line-height: 1.1;
}
.r22-specs__split {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 4rem;
  align-items: start;
}
.r22-specs__blueprint img {
  width: 100%;
  height: auto;
  display: block;
  mix-blend-mode: multiply;
  opacity: 0.9;
}
.r22-specs__selector {
  display: flex;
  gap: 0.5rem;
  margin-bottom: 2rem;
  flex-wrap: wrap;
}
.r22-specs__chip {
  padding: 0.6rem 1.1rem;
  background: transparent;
  border: 1px solid rgba(26, 26, 26, 0.2);
  color: #4a4a4a;
  font-family: 'Share Tech Mono', monospace;
  font-size: 0.8rem;
  letter-spacing: 0.08em;
  cursor: pointer;
  transition: all 0.2s ease;
}
.r22-specs__chip:hover { border-color: #1a1a1a; color: #1a1a1a; }
.r22-specs__chip.is-active {
  background: #1a1a1a;
  color: #fff;
  border-color: #1a1a1a;
}
.r22-specs__rows {
  display: flex;
  flex-direction: column;
  margin: 0;
}
.r22-specs__row {
  display: grid;
  grid-template-columns: 1fr auto;
  gap: 1rem;
  padding: 1rem 0;
  border-bottom: 1px solid rgba(26, 26, 26, 0.08);
  align-items: baseline;
}
.r22-specs__row dt {
  font-size: 0.85rem;
  color: #7a7a7a;
  text-transform: uppercase;
  letter-spacing: 0.1em;
  margin: 0;
}
.r22-specs__row dd {
  font-family: 'Share Tech Mono', monospace;
  font-size: 1rem;
  color: #1a1a1a;
  margin: 0;
  text-align: right;
}
@media (max-width: 900px) {
  .r22-specs__split { grid-template-columns: 1fr; gap: 2.5rem; }
  .r22-specs { padding: 5rem 1.5rem; position: relative; top: auto; }
}
```

- [ ] **Step 4: Verify.** Dev server + `/aircraft/r22`. Scroll into the specs section. Expected: blueprint on left, variant chip row + spec table on right. Clicking Beta / Beta II / Mariner swaps the right column's values — confirm Mariner shows "Pop-out floats" and range 220 nm. On mobile, the layout stacks.

- [ ] **Step 5: Commit.**

```bash
git add src/pages/AircraftR22.jsx
git commit -m "feat(r22): upgrade specifications to blueprint split with variant selector"
```

---

## Task 6: Upgrade `R22Introduction` to two-column sticky layout

**Files:**
- Modify: `src/pages/AircraftR22.jsx`

- [ ] **Step 1: Replace the existing `R22Introduction` body.** Delete current JSX and write:

```jsx
function R22Introduction() {
  return (
    <section className="r22-intro">
      <div className="r22-intro__inner">
        <div className="r22-intro__copy">
          <span className="r22-pre-text">Origins</span>
          <h2>Designed by Frank Robinson. Proven by four decades of students.</h2>
          <p>
            Frank Robinson drew the R22 in 1973 with a single objective: make personal helicopter
            flight affordable without compromising integrity. He had left Hughes and Bell in pursuit
            of a light two-seater that private pilots could actually own and instructors could
            actually teach on — a gap the industry had failed to close in thirty years.
          </p>
          <p>
            The first flight in 1975 proved the design; production began in 1979. Four decades
            later, more than 4,800 airframes have been delivered and the R22 remains the default
            first helicopter for the majority of rotary pilots worldwide. Every Beta II rolling off
            the Torrance line today is the direct descendant of that original prototype.
          </p>
          <p>
            The reason the design has endured is not nostalgia. It is that the R22's combination of
            low inertia, direct controls and honest handling creates pilots who understand
            rotorcraft at a mechanical level — and that understanding transfers to every aircraft
            they fly afterwards.
          </p>
        </div>
        <div className="r22-intro__image">
          <img
            src="/assets/images/new-aircraft/r22/r22-cutout.png"
            alt="R22 cutout"
            loading="lazy"
          />
        </div>
      </div>
    </section>
  );
}
```

- [ ] **Step 2: Append CSS to `R22Styles()`:**

```css
.r22-intro {
  padding: 8rem 2rem;
  background: #faf9f6;
}
.r22-intro__inner {
  max-width: 1280px;
  margin: 0 auto;
  display: grid;
  grid-template-columns: 3fr 2fr;
  gap: 5rem;
  align-items: center;
}
.r22-intro__copy h2 {
  font-size: clamp(2rem, 3.5vw, 2.75rem);
  font-weight: 700;
  margin: 0.5rem 0 2rem;
  line-height: 1.15;
}
.r22-intro__copy p {
  font-size: 1.05rem;
  line-height: 1.75;
  color: #4a4a4a;
  margin: 0 0 1.25rem;
}
.r22-intro__image img {
  width: 100%;
  height: auto;
  display: block;
}
@media (max-width: 900px) {
  .r22-intro__inner { grid-template-columns: 1fr; gap: 3rem; }
  .r22-intro { padding: 5rem 1.5rem; }
}
```

- [ ] **Step 3: Verify.** Dev server + `/aircraft/r22`. Expected: two-column layout (copy left, cutout image right). On mobile, stacks. Copy reads as three paragraphs. No layout breaks in the sticky stack.

- [ ] **Step 4: Commit.**

```bash
git add src/pages/AircraftR22.jsx
git commit -m "feat(r22): upgrade intro to two-column sticky layout"
```

---

## Task 7: Upgrade `R22Hero` with scroll-driven transforms and refreshed typography

**Files:**
- Modify: `src/pages/AircraftR22.jsx`

- [ ] **Step 1: Confirm the existing hero already uses `useScroll`.** It does (lines ~332–336 before refactor). What changes is typography scale and the application of `heroScale` / `heroY` to the aircraft image wrapper.

- [ ] **Step 2: Update the hero JSX.** Inside `R22Hero()`, wrap the aircraft image in a `<motion.div>` that consumes the scroll transforms:

```jsx
<motion.div
  className="r22-hero__image"
  style={{ scale: heroScale, y: heroY }}
>
  <img src="/assets/images/new-aircraft/r22/r22-cutout.png" alt="R22 helicopter" />
</motion.div>
```

(Replace the existing plain `<img>` wrapper if it is currently static.)

- [ ] **Step 3: Update hero typography in `R22Styles()`.** Find the existing `.r22-hero__title` rule and replace its `font-size` and `letter-spacing`:

```css
.r22-hero__title {
  font-family: 'Space Grotesk', sans-serif;
  font-size: clamp(3rem, 8vw, 6.5rem);
  font-weight: 700;
  letter-spacing: -0.03em;
  line-height: 0.95;
  color: #1a1a1a;
}
```

- [ ] **Step 4: Mark the hero for CMS.** Add `data-cms-section="r22-hero"` to the `<section className="r22-hero">` opening tag.

- [ ] **Step 5: Verify.** Dev server + `/aircraft/r22`. Expected: headline is noticeably larger and tighter; scrolling causes the aircraft image to subtly scale down and shift vertically; no layout jank.

- [ ] **Step 6: Commit.**

```bash
git add src/pages/AircraftR22.jsx
git commit -m "feat(r22): upgrade hero typography and scroll transforms"
```

---

## Task 8: Upgrade `R22Gallery` to masonry layout

**Files:**
- Modify: `src/pages/AircraftR22.jsx`

- [ ] **Step 1: Replace `R22Gallery` body.** Delete the existing grid and write:

```jsx
function R22Gallery({ pageImages }) {
  const [lightbox, setLightbox] = useState(null);
  const defaults = SECTION_MAP['r22-gallery']?.images || [];
  const images = (pageImages?.['r22-gallery'] || defaults);

  // The first two items render as wide (span 2); the rest render regular.
  const WIDE_INDEXES = new Set([0, 1]);

  return (
    <section className="r22-gallery" data-cms-section="r22-gallery">
      <div className="r22-gallery__header r22-section-header">
        <span className="r22-pre-text">Gallery</span>
        <h2>The R22 in the wild</h2>
      </div>
      <div className="r22-gallery__masonry">
        {images.map((img, i) => (
          <button
            key={img.src || i}
            type="button"
            className={`r22-gallery__tile ${WIDE_INDEXES.has(i) ? 'is-wide' : ''}`}
            onClick={() => setLightbox(img)}
          >
            <img src={img.src} alt={img.alt || ''} loading="lazy" />
            {img.alt && <span className="r22-gallery__caption">{img.alt}</span>}
          </button>
        ))}
      </div>

      <AnimatePresence>
        {lightbox && (
          <motion.div
            className="r22-gallery__lightbox"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setLightbox(null)}
          >
            <button
              type="button"
              className="r22-gallery__close"
              onClick={(e) => { e.stopPropagation(); setLightbox(null); }}
              aria-label="Close"
            >×</button>
            <img src={lightbox.src} alt={lightbox.alt || ''} />
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
```

- [ ] **Step 2: Append CSS to `R22Styles()`:**

```css
.r22-gallery { padding: 8rem 2rem; background: #faf9f6; }
.r22-gallery__masonry {
  max-width: 1280px;
  margin: 0 auto;
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  grid-auto-rows: 220px;
  gap: 1rem;
}
.r22-gallery__tile {
  position: relative;
  padding: 0;
  border: 0;
  cursor: pointer;
  overflow: hidden;
  background: #1a1a1a;
}
.r22-gallery__tile.is-wide { grid-column: span 2; }
.r22-gallery__tile img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.4s ease, opacity 0.2s ease;
}
.r22-gallery__tile:hover img { transform: scale(1.04); opacity: 0.9; }
.r22-gallery__caption {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  padding: 0.75rem 1rem;
  font-size: 0.75rem;
  text-transform: uppercase;
  letter-spacing: 0.12em;
  color: #fff;
  background: linear-gradient(to top, rgba(0,0,0,0.75), transparent);
  text-align: left;
  opacity: 0;
  transition: opacity 0.2s ease;
}
.r22-gallery__tile:hover .r22-gallery__caption { opacity: 1; }
.r22-gallery__lightbox {
  position: fixed;
  inset: 0;
  z-index: 200;
  background: rgba(0,0,0,0.92);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 2rem;
}
.r22-gallery__lightbox img { max-width: 92vw; max-height: 88vh; object-fit: contain; }
.r22-gallery__close {
  position: absolute;
  top: 1.5rem; right: 1.5rem;
  width: 48px; height: 48px;
  background: rgba(255,255,255,0.12);
  border: 0;
  color: #fff;
  font-size: 1.5rem;
  cursor: pointer;
  border-radius: 50%;
}
@media (max-width: 768px) {
  .r22-gallery__masonry { grid-template-columns: repeat(2, 1fr); grid-auto-rows: 180px; }
  .r22-gallery__tile.is-wide { grid-column: span 2; }
}
```

- [ ] **Step 3: Verify.** Dev server + `/aircraft/r22`. Expected: first two images span 2 columns each, remaining images fill 1 column each; hover shows caption; click opens lightbox; close button and backdrop click dismiss. Images sourced from the existing `SECTION_MAP['r22-gallery']` defaults until the admin panel overrides them.

- [ ] **Step 4: Commit.**

```bash
git add src/pages/AircraftR22.jsx
git commit -m "feat(r22): upgrade gallery to masonry with hover captions"
```

---

## Task 9: Upgrade `R22CTA` with prefilled enquire dropdown

**Files:**
- Modify: `src/pages/AircraftR22.jsx`

- [ ] **Step 1: Before coding, confirm enquire-form prefill keys.** Open `src/pages/Enquire.jsx` (or the component that handles `/enquire`) and check which query-string parameters it reads. The spec assumes `?type=<value>&aircraft=r22` — if the actual names differ (e.g. `?enquiryType=` or `?interest=`), substitute them in Step 2. **Do not proceed to Step 2 without verifying this.**

  Expected keys, based on existing R44 CTA pattern: copy the R44 CTA select's href format from `src/pages/AircraftR44.jsx` and use the same scheme.

- [ ] **Step 2: Replace `R22CTA` body:**

```jsx
function R22CTA() {
  const [selected, setSelected] = useState('trial-lesson');
  const options = [
    { id: 'trial-lesson', label: 'Trial lesson' },
    { id: 'ppl', label: 'Full PPL(H) training' },
    { id: 'sales', label: 'Aircraft sales' },
    { id: 'general', label: 'General enquiry' },
  ];
  // Adjust the query string keys below to match /enquire's actual param names.
  const enquireHref = `/enquire?type=${selected}&aircraft=r22`;

  return (
    <section className="r22-cta">
      <div className="r22-cta__inner">
        <span className="r22-pre-text">Next step</span>
        <h2>Start your R22 journey</h2>
        <p>Tell us what you'd like to do. We'll route your enquiry to the right person at HQ.</p>
        <div className="r22-cta__controls">
          <select
            className="r22-cta__select"
            value={selected}
            onChange={(e) => setSelected(e.target.value)}
            aria-label="I'm interested in"
          >
            {options.map((o) => (
              <option key={o.id} value={o.id}>{o.label}</option>
            ))}
          </select>
          <Link to={enquireHref} className="r22-btn r22-btn--primary">Enquire now</Link>
        </div>
        <Link to="/training" className="r22-cta__secondary">Explore training →</Link>
      </div>
    </section>
  );
}
```

- [ ] **Step 3: Append CSS to `R22Styles()`:**

```css
.r22-cta { padding: 8rem 2rem; background: #1a1a1a; color: #fff; }
.r22-cta__inner { max-width: 720px; margin: 0 auto; text-align: center; }
.r22-cta__inner h2 {
  font-size: clamp(2.25rem, 4.5vw, 3.25rem);
  font-weight: 700;
  margin: 0.5rem 0 1rem;
  color: #fff;
}
.r22-cta__inner p { font-size: 1.05rem; line-height: 1.7; color: #c8c8c8; margin: 0 0 2.5rem; }
.r22-cta__controls {
  display: flex;
  gap: 1rem;
  justify-content: center;
  flex-wrap: wrap;
  margin-bottom: 1.5rem;
}
.r22-cta__select {
  padding: 0.9rem 1.25rem;
  background: rgba(255,255,255,0.08);
  border: 1px solid rgba(255,255,255,0.2);
  color: #fff;
  font-family: 'Share Tech Mono', monospace;
  font-size: 0.9rem;
  min-width: 240px;
}
.r22-btn--primary {
  display: inline-block;
  padding: 0.9rem 1.75rem;
  background: #fff;
  color: #1a1a1a;
  text-decoration: none;
  font-weight: 600;
  letter-spacing: 0.05em;
  text-transform: uppercase;
  font-size: 0.85rem;
  transition: opacity 0.2s ease;
}
.r22-btn--primary:hover { opacity: 0.88; }
.r22-cta__secondary {
  color: #c8c8c8;
  text-decoration: none;
  font-size: 0.9rem;
  letter-spacing: 0.08em;
}
.r22-cta__secondary:hover { color: #fff; }
```

- [ ] **Step 4: Verify.** Dev server + `/aircraft/r22`. Expected: select dropdown with four options. Change the selection — the Enquire button's `href` updates. Clicking "Enquire now" routes to `/enquire?type=<selected>&aircraft=r22`. Confirm the form prefills correctly.

- [ ] **Step 5: Commit.**

```bash
git add src/pages/AircraftR22.jsx
git commit -m "feat(r22): upgrade CTA with enquiry prefill dropdown"
```

---

# PHASE 3 — NEW SECTIONS + FINAL COPY

Additive only. No existing behaviour changes. Each section plugs into the `AircraftR22()` JSX return between existing sections.

---

## Task 10: Add `R22WhyTrainer` section

**Files:**
- Modify: `src/pages/AircraftR22.jsx`

- [ ] **Step 1: Add `R22_WHY_TRAINER` data constant:**

```jsx
const R22_WHY_TRAINER = [
  {
    eyebrow: 'Economics',
    title: 'The most affordable way to fly',
    copy: 'Hourly rates typically run a third of turbine training and around half of heavier piston types. That keeps PPL(H) syllabi attainable and lets students build real hours rather than rationed ones.',
    stat: { value: '≈£300/hr', caption: 'Typical UK wet rate' },
  },
  {
    eyebrow: 'Skill transfer',
    title: 'Controls that tell you everything',
    copy: 'Direct push-rod controls with no hydraulic assistance mean every input is felt. Pilots trained on the R22 read rotor state instinctively — a habit that carries over to every heavier type they fly afterwards.',
    stat: { value: 'Zero hydraulics', caption: 'Pure mechanical feedback' },
  },
  {
    eyebrow: 'Industry standard',
    title: 'The textbook light trainer',
    copy: 'EASA, CAA and FAA syllabi are built around the R22. Instructor ratings, type-specific Awareness Training (SFAR 73 / UK equivalent) and examiner standards all assume it.',
    stat: { value: '4,800+', caption: 'Delivered worldwide' },
  },
];
```

- [ ] **Step 2: Add component (cards + counter bar):**

```jsx
const R22_WHY_COUNTERS = [
  { value: '4800', suffix: '+', caption: 'Delivered worldwide' },
  { value: '300', prefix: '≈£', suffix: '/hr', caption: 'Typical UK wet rate' },
  { value: '0.7', caption: 'Fatal accidents per 100k hrs (post-SFAR 73)' },
  { value: '40', suffix: '+', caption: 'Years in production' },
];

function R22WhyTrainer() {
  return (
    <section className="r22-why">
      <div className="r22-why__inner">
        <div className="r22-section-header">
          <span className="r22-pre-text">Why the R22</span>
          <h2>Why the world trains on the R22</h2>
        </div>
        <div className="r22-why__grid">
          {R22_WHY_TRAINER.map((item) => (
            <article key={item.eyebrow} className="r22-why__card">
              <span className="r22-pre-text">{item.eyebrow}</span>
              <h3>{item.title}</h3>
              <p>{item.copy}</p>
              <div className="r22-why__stat">
                <span className="r22-why__stat-value">{item.stat.value}</span>
                <span className="r22-why__stat-caption">{item.stat.caption}</span>
              </div>
            </article>
          ))}
        </div>
        <div className="r22-why__counters">
          {R22_WHY_COUNTERS.map((c) => (
            <div key={c.caption} className="r22-why__counter">
              <span className="r22-why__counter-value">
                <AnimatedNumber value={c.value} prefix={c.prefix || ''} suffix={c.suffix || ''} />
              </span>
              <span className="r22-why__counter-caption">{c.caption}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
```

Note: `AnimatedNumber` already exists in the file (line ~203). Confirm its prop signature supports `value`, `prefix`, `suffix`; if not, adapt the call site to match.

- [ ] **Step 3: Append CSS to `R22Styles()`:**

```css
.r22-why { padding: 8rem 2rem; background: #f2f0ea; }
.r22-why__inner { max-width: 1280px; margin: 0 auto; }
.r22-why__grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 1.5rem;
  margin-top: 3rem;
}
.r22-why__card {
  padding: 2.5rem 2rem;
  background: #faf9f6;
  border: 1px solid rgba(26,26,26,0.08);
  display: flex;
  flex-direction: column;
  gap: 1rem;
}
.r22-why__card h3 {
  font-size: 1.4rem;
  font-weight: 600;
  margin: 0 0 0.5rem;
  line-height: 1.25;
}
.r22-why__card p {
  font-size: 1rem;
  line-height: 1.7;
  color: #4a4a4a;
  margin: 0;
  flex: 1;
}
.r22-why__stat {
  margin-top: 1.5rem;
  padding-top: 1.25rem;
  border-top: 1px solid rgba(26,26,26,0.08);
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}
.r22-why__stat-value {
  font-family: 'Share Tech Mono', monospace;
  font-size: 1.4rem;
  color: #1a1a1a;
}
.r22-why__stat-caption {
  font-size: 0.75rem;
  text-transform: uppercase;
  letter-spacing: 0.15em;
  color: #7a7a7a;
}
.r22-why__counters {
  margin-top: 3.5rem;
  padding-top: 3rem;
  border-top: 1px solid rgba(26,26,26,0.12);
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 2rem;
}
.r22-why__counter {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  text-align: center;
}
.r22-why__counter-value {
  font-family: 'Share Tech Mono', monospace;
  font-size: clamp(1.75rem, 3.5vw, 2.5rem);
  color: #1a1a1a;
  line-height: 1;
}
.r22-why__counter-caption {
  font-size: 0.75rem;
  text-transform: uppercase;
  letter-spacing: 0.15em;
  color: #7a7a7a;
  line-height: 1.4;
}
@media (max-width: 900px) {
  .r22-why__grid { grid-template-columns: 1fr; }
  .r22-why__counters { grid-template-columns: repeat(2, 1fr); gap: 2rem 1.5rem; }
  .r22-why { padding: 5rem 1.5rem; }
}
```

- [ ] **Step 4: Insert `<R22WhyTrainer />` in the JSX return**, directly after `<R22FlightCharacteristics />`.

- [ ] **Step 5: Verify.** Dev server + `/aircraft/r22`. Expected: three-card row with eyebrows, titles, bodies, and stat blocks at the bottom of each card. Mobile stacks cleanly.

- [ ] **Step 6: Commit.**

```bash
git add src/pages/AircraftR22.jsx
git commit -m "feat(r22): add Why the R22 Trains the World section"
```

---

## Task 11: Add `R22VariantComparison` section

**Files:**
- Modify: `src/pages/AircraftR22.jsx`

- [ ] **Step 1: Define the component.** It reuses `R22_VARIANT_DATA` (already defined in Task 5). Add:

```jsx
function R22VariantComparison() {
  const [selectedIds, setSelectedIds] = useState(R22_VARIANT_DATA.map((v) => v.id));
  const visible = R22_VARIANT_DATA.filter((v) => selectedIds.includes(v.id));

  const toggle = (id) => {
    setSelectedIds((prev) => {
      if (prev.includes(id)) {
        return prev.length > 1 ? prev.filter((x) => x !== id) : prev; // keep at least one
      }
      return [...prev, id];
    });
  };

  const rows = [
    { label: 'Years produced', key: 'years' },
    { label: 'Engine', key: 'engine' },
    { label: 'Power', key: 'power' },
    { label: 'MTOW', key: 'mtow' },
    { label: 'Range', key: 'range' },
    { label: 'Useful load', key: 'usefulLoad' },
    { label: 'Landing gear', key: 'floats' },
    { label: 'Notable', key: 'notable' },
  ];

  return (
    <section className="r22-compare">
      <div className="r22-compare__inner">
        <div className="r22-section-header">
          <span className="r22-pre-text">Compare</span>
          <h2>The R22 family, side by side</h2>
        </div>
        <div className="r22-compare__pills">
          {R22_VARIANT_DATA.map((v) => (
            <button
              key={v.id}
              type="button"
              className={`r22-compare__pill ${selectedIds.includes(v.id) ? 'is-active' : ''}`}
              onClick={() => toggle(v.id)}
            >
              <span className="r22-compare__check">{selectedIds.includes(v.id) ? '✓' : ''}</span>
              {v.name}
            </button>
          ))}
        </div>
        <div className="r22-compare__table-wrap">
          <table className="r22-compare__table">
            <thead>
              <tr>
                <th></th>
                {visible.map((v) => <th key={v.id}>{v.name}</th>)}
              </tr>
            </thead>
            <tbody>
              {rows.map((row) => (
                <tr key={row.key}>
                  <th scope="row">{row.label}</th>
                  {visible.map((v) => <td key={v.id}>{v[row.key]}</td>)}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
}
```

- [ ] **Step 2: Append CSS to `R22Styles()`:**

```css
.r22-compare { padding: 8rem 2rem; background: #faf9f6; }
.r22-compare__inner { max-width: 1280px; margin: 0 auto; }
.r22-compare__pills {
  display: flex;
  gap: 0.75rem;
  justify-content: center;
  flex-wrap: wrap;
  margin: 2rem 0 3rem;
}
.r22-compare__pill {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.7rem 1.25rem;
  background: transparent;
  border: 1px solid rgba(26,26,26,0.2);
  color: #4a4a4a;
  font-family: 'Share Tech Mono', monospace;
  font-size: 0.85rem;
  cursor: pointer;
  transition: all 0.2s ease;
}
.r22-compare__pill.is-active {
  background: #1a1a1a;
  color: #fff;
  border-color: #1a1a1a;
}
.r22-compare__check {
  display: inline-block;
  width: 1em;
  text-align: center;
}
.r22-compare__table-wrap { overflow-x: auto; }
.r22-compare__table {
  width: 100%;
  border-collapse: collapse;
  font-size: 0.95rem;
}
.r22-compare__table th, .r22-compare__table td {
  padding: 1rem 1.25rem;
  text-align: left;
  border-bottom: 1px solid rgba(26,26,26,0.08);
  vertical-align: top;
}
.r22-compare__table thead th {
  font-family: 'Share Tech Mono', monospace;
  font-size: 0.85rem;
  text-transform: uppercase;
  letter-spacing: 0.12em;
  color: #1a1a1a;
  background: #f2f0ea;
}
.r22-compare__table tbody th {
  font-size: 0.8rem;
  text-transform: uppercase;
  letter-spacing: 0.1em;
  color: #7a7a7a;
  font-weight: 500;
}
.r22-compare__table tbody td {
  font-family: 'Share Tech Mono', monospace;
  color: #1a1a1a;
}
```

- [ ] **Step 3: Insert `<R22VariantComparison />` in the JSX return**, directly after `<R22WhyTrainer />`.

- [ ] **Step 4: Verify.** Dev server + `/aircraft/r22`. Expected: three pill toggles, all active by default; clicking one toggles its column off (but the last remaining column cannot be toggled off). Table scrolls horizontally on narrow screens.

- [ ] **Step 5: Commit.**

```bash
git add src/pages/AircraftR22.jsx
git commit -m "feat(r22): add variant comparison section"
```

---

## Task 12: Expand `R22Champion` with full narrative

**Files:**
- Modify: `src/pages/AircraftR22.jsx`

- [ ] **Step 1: Replace `R22Champion` body.** The current implementation uses `.r22-champion--compact`; we're lifting it to a full section.

```jsx
function R22Champion({ pageImages }) {
  const defaults = SECTION_MAP['r22-champion']?.images
    || [{ src: '/assets/images/used-aircraft/r22/british-team-r22.webp', alt: 'Captain Quentin Smith' }];
  const images = pageImages?.['r22-champion'] || defaults;
  const hero = images[0];

  return (
    <section className="r22-champion" data-cms-section="r22-champion">
      <div className="r22-champion__inner">
        <div className="r22-champion__copy">
          <span className="r22-pre-text">The record holder</span>
          <h2>Captain Q and the R22</h2>
          <p>
            In 2012, Captain Quentin Smith took an R22 to Russia and won the World Helicopter
            Aerobatic Championship — the only piston trainer ever to claim the title, in a field
            otherwise contested by purpose-built turbine types. It was not a quiet win. It was a
            direct statement about what the R22 is capable of when flown by someone who understands
            it completely.
          </p>
          <p>
            Captain Q's flying predates the championship by decades. He is the first pilot to have
            circumnavigated the globe pole-to-pole by helicopter, a feat that required every skill
            the R22 teaches and none of the systems that modern types provide. HQ Aviation's
            instruction ethos — that a pilot trained properly on the R22 can fly anything — comes
            directly from this lineage.
          </p>
          <p>
            Every student who trains with us at Denham trains in the aircraft that a world champion
            chose to prove his point.
          </p>
        </div>
        <div className="r22-champion__image">
          <img src={hero.src} alt={hero.alt || 'Captain Quentin Smith'} loading="lazy" />
        </div>
      </div>
    </section>
  );
}
```

- [ ] **Step 2: Pass `pageImages` to the component in `AircraftR22()`:**

```jsx
<R22Champion pageImages={pageImages} />
```

- [ ] **Step 3: Append CSS to `R22Styles()`.** If an existing `.r22-champion` rule uses `--compact` modifiers, remove the compact-specific padding and replace with:

```css
.r22-champion {
  padding: 8rem 2rem;
  background: #1a1a1a;
  color: #fff;
}
.r22-champion__inner {
  max-width: 1280px;
  margin: 0 auto;
  display: grid;
  grid-template-columns: 3fr 2fr;
  gap: 5rem;
  align-items: center;
}
.r22-champion__copy h2 {
  font-size: clamp(2.25rem, 4.5vw, 3.25rem);
  font-weight: 700;
  margin: 0.5rem 0 2rem;
  line-height: 1.1;
  color: #fff;
}
.r22-champion__copy p {
  font-size: 1.05rem;
  line-height: 1.75;
  color: #c8c8c8;
  margin: 0 0 1.25rem;
}
.r22-champion__image img {
  width: 100%;
  height: auto;
  display: block;
  filter: grayscale(0.2);
}
@media (max-width: 900px) {
  .r22-champion__inner { grid-template-columns: 1fr; gap: 3rem; }
  .r22-champion { padding: 5rem 1.5rem; }
}
```

(Delete any orphaned `.r22-champion--compact` rules.)

- [ ] **Step 4: Verify.** Dev server + `/aircraft/r22`. Expected: dark-backgrounded section with narrative left, photo right. Mobile stacks. If Firestore `site_images` has a `r22-champion` entry, it overrides the default photo.

- [ ] **Step 5: Commit.**

```bash
git add src/pages/AircraftR22.jsx
git commit -m "feat(r22): expand Captain Q champion section with full narrative"
```

---

## Task 13: Extend 2012 `R22_HISTORY` entry

**Files:**
- Modify: `src/pages/AircraftR22.jsx`

- [ ] **Step 1: Locate the `historyEvents` array** (was at line ~349 pre-refactor; may now live inside `R22HistoryTimeline`). Find the 2012 entry.

- [ ] **Step 2: Replace the 2012 entry's `description`** with:

```jsx
{
  year: '2012',
  title: 'World Champion Aircraft',
  description: "Captain Quentin Smith wins the World Helicopter Aerobatic Championship in Russia flying the R22 — the only piston trainer ever to take the title, and the defining moment that confirmed the aircraft's handling pedigree beyond the training arena.",
},
```

- [ ] **Step 3: Verify.** Dev server. Scroll to the history timeline. Expected: the 2012 entry shows the extended description.

- [ ] **Step 4: Commit.**

```bash
git add src/pages/AircraftR22.jsx
git commit -m "feat(r22): extend 2012 history entry to hand off to champion section"
```

---

## Task 14: Add `R22Fleet` section

**Files:**
- Modify: `src/pages/AircraftR22.jsx`

- [ ] **Step 1: Add component:**

```jsx
function R22Fleet({ pageImages }) {
  const defaults = SECTION_MAP['r22-fleet']?.images
    || [{ src: '/assets/images/used-aircraft/r22/hq-r22-lineup.jpg', alt: 'HQ Aviation R22 fleet lineup' }];
  const images = pageImages?.['r22-fleet'] || defaults;
  const hero = images[0];

  return (
    <section className="r22-fleet" data-cms-section="r22-fleet">
      <div className="r22-fleet__image">
        <img src={hero.src} alt={hero.alt || ''} loading="lazy" />
      </div>
      <div className="r22-fleet__overlay">
        <span className="r22-pre-text">The Denham fleet</span>
        <p>Four R22 Beta IIs. Forty years of design discipline on the same apron.</p>
      </div>
    </section>
  );
}
```

- [ ] **Step 2: Append CSS to `R22Styles()`:**

```css
.r22-fleet {
  position: relative;
  width: 100%;
  min-height: 55vh;
  overflow: hidden;
  background: #1a1a1a;
}
.r22-fleet__image img {
  width: 100%;
  height: 100%;
  min-height: 55vh;
  object-fit: cover;
  display: block;
  opacity: 0.85;
}
.r22-fleet__overlay {
  position: absolute;
  left: 3rem;
  bottom: 3rem;
  max-width: 480px;
  color: #fff;
  text-shadow: 0 2px 12px rgba(0,0,0,0.5);
}
.r22-fleet__overlay p {
  font-size: clamp(1.25rem, 2.2vw, 1.75rem);
  font-weight: 500;
  line-height: 1.4;
  margin: 0.5rem 0 0;
}
@media (max-width: 600px) {
  .r22-fleet__overlay { left: 1.25rem; right: 1.25rem; bottom: 1.25rem; }
}
```

- [ ] **Step 3: Insert `<R22Fleet pageImages={pageImages} />` in the JSX return**, directly after `<R22Champion>` and before `<R22Variants />`.

- [ ] **Step 4: Verify.** Dev server + `/aircraft/r22`. Expected: full-bleed image with caption overlay in the bottom-left.

- [ ] **Step 5: Commit.**

```bash
git add src/pages/AircraftR22.jsx
git commit -m "feat(r22): add fleet lineup section"
```

---

## Task 15: Register new CMS section defaults in `imageSections.js`

**Files:**
- Modify: `src/lib/imageSections.js`

- [ ] **Step 1: Open `src/lib/imageSections.js`** and locate the `SECTION_MAP` object. Find the existing `r22-gallery` entry (around line 975).

- [ ] **Step 2: Add four new entries** adjacent to `r22-gallery`:

```js
'r22-hero': {
  page: 'r22',
  label: 'R22 · Hero',
  images: [
    { src: '/assets/images/new-aircraft/r22/r22-cutout.png', alt: 'R22 hero image' },
  ],
},
'r22-specifications': {
  page: 'r22',
  label: 'R22 · Specifications blueprint',
  images: [
    { src: '/assets/images/new-aircraft/r22/r22blueprint.jpg', alt: 'R22 blueprint' },
  ],
},
'r22-champion': {
  page: 'r22',
  label: 'R22 · Captain Q',
  images: [
    { src: '/assets/images/used-aircraft/r22/british-team-r22.webp', alt: 'Captain Quentin Smith with R22' },
  ],
},
'r22-fleet': {
  page: 'r22',
  label: 'R22 · Fleet lineup',
  images: [
    { src: '/assets/images/used-aircraft/r22/hq-r22-lineup.jpg', alt: 'HQ Aviation R22 fleet lineup' },
  ],
},
```

(Match the shape of the existing `r22-gallery` entry exactly. If `r22-gallery` uses different property names or a different object shape, mirror it instead of the example above.)

- [ ] **Step 3: Verify in the Admin panel.** Dev server + `http://localhost:5173/admin/images`. Expected: the four new sections appear in the R22 group; each shows its default image; uploading an override updates the public page.

- [ ] **Step 4: Commit.**

```bash
git add src/lib/imageSections.js
git commit -m "feat(r22): register hero, specs, champion, fleet CMS sections"
```

---

## Task 16: Final integration pass + regression QA

**Files:**
- None modified unless issues found.

- [ ] **Step 1: Confirm the final `AircraftR22()` JSX return matches the spec.** Expected order:

```jsx
<div className="r22-page">
  <R22Styles />
  <R22Header />
  <R22Hero />
  <div className="r22-sticky-stack">
    <R22Highlights />
    <R22Introduction />
    <R22Specifications />
  </div>
  <R22FlightCharacteristics />
  <R22WhyTrainer />
  <R22VariantComparison />
  <R22HistoryTimeline />
  <R22Champion pageImages={pageImages} />
  <R22Fleet pageImages={pageImages} />
  <R22Variants />
  <R22Gallery pageImages={pageImages} />
  <R22CTA />
  <FooterMinimal />
</div>
```

If the order deviates from this, reorder now.

- [ ] **Step 2: Walk the full page.** Dev server + `/aircraft/r22`. Scroll top to bottom. Check every interactive element:
  - Hero: scroll-driven image scale/translate
  - Highlights band: sticky, blurs over intro/specs
  - Specifications: variant chip selector swaps all rows; Mariner shows Pop-out floats and 220 nm range
  - Flight Characteristics: three cards render
  - Why Trainer: three cards with stat blocks
  - Variant Comparison: pill toggles add/remove columns; last remaining column cannot be removed
  - History Timeline: all 7 events animate; 2012 entry has extended copy
  - Champion: dark section with three-paragraph narrative + photo
  - Fleet: full-bleed image + caption overlay
  - Variants (legacy tab): original tab switcher still works, PDF links active
  - Gallery: masonry layout; first two items wide; hover captions; lightbox open/close
  - CTA: select changes Enquire `href`; Enquire routes with correct prefill; "Explore training" link works

- [ ] **Step 3: Regression check on sibling pages.** Open `/aircraft/r44`, `/aircraft/r66`, `/aircraft/r88`. Expected: no visual or console regressions (none of these files should have been touched, so this is a sanity check).

- [ ] **Step 4: Mobile viewport check.** Chrome DevTools → iPhone 12 viewport. Walk the full R22 page. Expected: no horizontal overflow; all grids stack; all tap targets usable.

- [ ] **Step 5: Console check.** DevTools console should be clean (no warnings about keys, no 404s on images, no hydration warnings).

- [ ] **Step 6: Final commit (if any touch-ups were made).**

```bash
git add src/pages/AircraftR22.jsx
git commit -m "feat(r22): final integration pass and regression fixes"
```

- [ ] **Step 7: Open a summary message to the user** listing the commit hashes and confirming all 16 tasks completed.

---

## Appendix — Spec cross-reference

| Spec section | Implemented by task(s) |
|---|---|
| Architecture (`R22Styles`, component breakdown) | 1, 2, 3 |
| `R22_VARIANT_DATA` | 5 |
| `R22_HIGHLIGHTS` | 4 |
| `R22_WHY_TRAINER` | 10 |
| `R22_HISTORY` (2012 extension) | 13 |
| `R22_FLIGHT_CHARACTERISTICS` (restyle only) | 3 |
| §1 Hero | 7 |
| §2 Highlights band | 4 |
| §3 Introduction | 6 |
| §4 Specifications | 5 |
| §5 Flight Characteristics | 3 (restyle in line with design tokens) |
| §6 Why Trainer | 10 |
| §7 Variant Comparison | 11 |
| §8 History Timeline | 13 (2012 extension); structure unchanged |
| §9 Champion | 12 |
| §10 Fleet | 14 |
| §11 Variants (legacy) | 2 (extraction only), 3 (restyle only) |
| §12 Gallery | 8 |
| §13 CTA | 9 |
| CMS section defaults | 15 |
| Final QA | 16 |

## Appendix — Open questions resolved in-plan

1. **Enquire-form prefill keys** — Task 9 Step 1 requires engineer verification against the existing `/enquire` implementation before coding the CTA links. If keys differ, substitute them.
2. **Captain Q portrait** — Task 12 defaults to `british-team-r22.webp`. The `data-cms-section="r22-champion"` marker lets the user drop in a better photo through the admin Images panel post-launch with no code change required.

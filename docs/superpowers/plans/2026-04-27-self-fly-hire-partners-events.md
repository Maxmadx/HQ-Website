# Self-Fly Hire — Partners, Events & Community Wall Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add three new sections to `/self-fly-hire` — Our Partners (3 cards), Events (11 cards), and a drop-in of the existing Community Wall component — between the existing Destinations grid and the Enquiry form.

**Architecture:** Sections 1 and 2 are siblings of `sfh2-destinations` that reuse the same JSX/CSS pattern (one styled-jsx block per page, BEM-ish `sfh2-*` namespace, framer-motion `whileInView` reveals). Section 3 is a one-line render of `WallOfCoolGr11` — no new component, no wrapper. All edits live in a single file: `src/pages/SelfFlyHire.jsx`.

**Tech Stack:** React 18, framer-motion, styled-jsx (inline `<style jsx>` inside the page component), Vite dev server.

---

## File Structure

**Modified:**
- `src/pages/SelfFlyHire.jsx` — add import, two data constants, two state hooks, three section JSX blocks (two new + one drop-in), and CSS rules at desktop and mobile breakpoints.

**No new files. No tests added** (project has no React component test infra; verification is via running dev server and inspecting the page in a browser).

---

## Reference: existing patterns to mirror

When in doubt, look at these existing locations in `src/pages/SelfFlyHire.jsx`:

- **Data constant pattern:** `DESTINATIONS` at lines 165–178.
- **State + ref pattern:** `destPage` / `destGridRef` / `DEST_PAGES` at lines 201–208.
- **Section JSX pattern:** `sfh2-destinations` at lines 534–591.
- **Desktop CSS pattern:** `.sfh2-destinations*` at lines 1379–1454.
- **Mobile (≤768px) CSS pattern:** `.sfh2-destinations__grid` and friends at lines 2015–2049.
- **Tablet (≤1024px) destinations override:** lines 1868–1870.
- **Existing `WallOfCoolGr11` consumer:** `src/pages/Experimentation.jsx:5221`.

---

## Task 1 — Add the WallOfCoolGr11 import

**Files:**
- Modify: `src/pages/SelfFlyHire.jsx` (top-of-file imports, around line 23)

- [ ] **Step 1: Add the import line**

After the existing `FooterMinimal` import at line 23, add:

```jsx
import FooterMinimal from '../components/FooterMinimal';
import HqMenuPanel from '../components/HqMenuPanel';
import WallOfCoolGr11 from '../components/WallOfCoolGr11';
```

(Insert between line 24 and line 25 of the current file. The two existing import lines above are shown as anchors — do not duplicate them.)

- [ ] **Step 2: Verify the file still parses**

Run:
```bash
npm run dev
```
Expected: Vite starts without errors, `/self-fly-hire` still loads. Leave the dev server running for the rest of the plan.

- [ ] **Step 3: Commit**

```bash
git add src/pages/SelfFlyHire.jsx
git commit -m "feat(sfh): import WallOfCoolGr11 component"
```

---

## Task 2 — Add the PARTNERS and EVENTS data constants

**Files:**
- Modify: `src/pages/SelfFlyHire.jsx` (after the `DESTINATIONS` constant ending at line 178)

- [ ] **Step 1: Add both constants**

Immediately after line 178 (`];` closing `DESTINATIONS`), insert:

```jsx
const PARTNERS = [
  { category: 'Shooting Ground', name: 'Holland & Holland', location: 'Northwood' },
  { category: 'Restaurant',      name: 'The Hut',           location: 'Isle of Wight' },
  { category: 'Shooting Ground', name: 'E.J. Churchill',    location: 'West Wycombe' },
];

const EVENTS = [
  { region: 'Berkshire',       name: 'Royal Ascot',                month: 'June' },
  { region: 'Oxfordshire',     name: 'Henley Royal Regatta',       month: 'July' },
  { region: 'West Sussex',     name: 'Goodwood Festival of Speed', month: 'July' },
  { region: 'West Sussex',     name: 'Glorious Goodwood',          month: 'August' },
  { region: 'Gloucestershire', name: 'Cheltenham Festival',        month: 'March' },
  { region: 'Merseyside',      name: 'Grand National (Aintree)',   month: 'April' },
  { region: 'Surrey',          name: 'Epsom Derby',                month: 'June' },
  { region: 'Suffolk',         name: 'Newmarket Racing',           month: 'May–Oct' },
  { region: 'Yorkshire',       name: 'York Racecourse',            month: 'May–Oct' },
  { region: 'Surrey',          name: 'Sandown Park',               month: 'Year-round' },
  { region: 'Berkshire',       name: 'Newbury Racecourse',         month: 'Year-round' },
];
```

- [ ] **Step 2: Verify dev server still hot-reloads cleanly**

Switch to the browser tab on `/self-fly-hire`. Expected: page renders unchanged (constants defined but not yet used).

- [ ] **Step 3: Commit**

```bash
git add src/pages/SelfFlyHire.jsx
git commit -m "feat(sfh): add PARTNERS and EVENTS data constants"
```

---

## Task 3 — Add Events pagination state + ref

**Files:**
- Modify: `src/pages/SelfFlyHire.jsx` (after `DEST_PAGES` declaration around line 208)

Note: Partners section needs no state — it's 3 cards in a fixed row with no pagination. Only Events needs state.

- [ ] **Step 1: Add the events state and ref**

Immediately after line 208 (`const DEST_PAGES = ...`), insert:

```jsx
const [eventsPage, setEventsPage] = useState(0);
const eventsGridRef = useRef(null);
const EVENTS_PAGES = Math.ceil(EVENTS.length / 4); // 4 cards per mobile page (2 rows × 2 cols)
```

- [ ] **Step 2: Verify the page still renders**

Browser tab on `/self-fly-hire`. Expected: no console errors, page unchanged.

- [ ] **Step 3: Commit**

```bash
git add src/pages/SelfFlyHire.jsx
git commit -m "feat(sfh): add events pagination state"
```

---

## Task 4 — Insert the Our Partners JSX section

**Files:**
- Modify: `src/pages/SelfFlyHire.jsx` (insert after the existing destinations section closing `</section>` at line 591)

- [ ] **Step 1: Add the Partners section JSX**

Locate line 591 (the `</section>` that closes `sfh2-destinations`). On the line immediately after it (currently a blank line before `{/* ── Enquiry Form ──...`), insert:

```jsx
      {/* ── Our Partners ────────────────────────────────────────── */}
      <section className="sfh2-partners" data-cms-section="sfh-partners">
        <div className="sfh2-partners__inner">
          <motion.div
            className="sfh2-partners__header"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          >
            <span className="sfh2-pre-label">Trusted By</span>
            <h2 className="sfh2-section-heading">Our Partners</h2>
            <p className="sfh2-partners__intro">
              We work with country estates, sporting grounds and destinations who welcome arrivals by helicopter.
            </p>
          </motion.div>

          <div className="sfh2-partners__grid">
            {PARTNERS.map((partner, i) => (
              <motion.div
                key={partner.name}
                className="sfh2-partners__card"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.05 }}
                transition={{ duration: 0.3, delay: i * 0.05, ease: [0.16, 1, 0.3, 1] }}
              >
                <div className="sfh2-partners__card-region">{partner.category}</div>
                <div className="sfh2-partners__card-name">{partner.name}</div>
                <div className="sfh2-partners__card-time">{partner.location}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
```

- [ ] **Step 2: Verify the section renders unstyled**

Browser tab on `/self-fly-hire`, scroll to between Destinations and the Enquiry form. Expected: see "Our Partners" heading and three cards in unstyled vertical layout (CSS not yet added, so they will look like plain stacked text).

- [ ] **Step 3: Commit**

```bash
git add src/pages/SelfFlyHire.jsx
git commit -m "feat(sfh): add Our Partners section JSX"
```

---

## Task 5 — Insert the Events JSX section

**Files:**
- Modify: `src/pages/SelfFlyHire.jsx` (insert immediately after the new Partners section's `</section>` from Task 4)

- [ ] **Step 1: Add the Events section JSX**

After the `</section>` that closes `sfh2-partners` (added in Task 4), insert:

```jsx
      {/* ── Events ──────────────────────────────────────────────── */}
      <section className="sfh2-events" data-cms-section="sfh-events">
        <div className="sfh2-events__inner">
          <motion.div
            className="sfh2-events__header"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          >
            <span className="sfh2-pre-label">The Season</span>
            <h2 className="sfh2-section-heading">Fly to the Calendar</h2>
            <p className="sfh2-events__intro">
              From the Festival to the Regatta, we fly clients straight to the day.
            </p>
          </motion.div>

          <div
            className="sfh2-events__grid"
            ref={eventsGridRef}
            onScroll={() => {
              const el = eventsGridRef.current;
              if (!el) return;
              setEventsPage(Math.round(el.scrollLeft / el.clientWidth));
            }}
          >
            {EVENTS.map((event, i) => (
              <motion.div
                key={event.name}
                className="sfh2-events__card"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.05 }}
                transition={{ duration: 0.3, delay: (i % 4) * 0.05, ease: [0.16, 1, 0.3, 1] }}
              >
                <div className="sfh2-events__card-region">{event.region}</div>
                <div className="sfh2-events__card-name">{event.name}</div>
                <div className="sfh2-events__card-time">{event.month}</div>
              </motion.div>
            ))}
          </div>
          <div className="sfh2-events__dots">
            {Array.from({ length: EVENTS_PAGES }).map((_, i) => (
              <span
                key={i}
                className={`sfh2-events__dot${eventsPage === i ? ' sfh2-events__dot--active' : ''}`}
                onClick={() => {
                  eventsGridRef.current?.scrollTo({ left: i * eventsGridRef.current.clientWidth, behavior: 'smooth' });
                }}
              />
            ))}
          </div>

          <p className="sfh2-events__footer">
            Plus the rest of the calendar — let us know your day.
          </p>
        </div>
      </section>
```

- [ ] **Step 2: Verify the Events section appears**

Browser tab on `/self-fly-hire`. Expected: "Fly to the Calendar" heading appears below "Our Partners", with 11 unstyled cards listed.

- [ ] **Step 3: Commit**

```bash
git add src/pages/SelfFlyHire.jsx
git commit -m "feat(sfh): add Events section JSX"
```

---

## Task 6 — Insert the WallOfCoolGr11 drop-in

**Files:**
- Modify: `src/pages/SelfFlyHire.jsx` (insert after the Events section's closing `</section>` from Task 5)

- [ ] **Step 1: Add the component render**

After the `</section>` that closes `sfh2-events` (added in Task 5), insert:

```jsx
      {/* ── Community Wall (drop-in component) ──────────────────── */}
      <WallOfCoolGr11 />
```

- [ ] **Step 2: Verify Wall of Cool appears**

Browser tab on `/self-fly-hire`. Expected: between the new Events section and the existing Enquiry form, the "Community Wall" / "Helicopter Adventures" gallery renders. Scroll into view and confirm the two-row image grid animates in. Confirm the dark footer with chevrons and "Upload" button appears.

If the page layout breaks (e.g. horizontal overflow), check the browser console — the component uses `width: 100vw` with negative margins; this is the same pattern that works on `/experimentation` so it should be fine, but if it breaks, look at how `Experimentation.jsx:5220` wraps it.

- [ ] **Step 3: Commit**

```bash
git add src/pages/SelfFlyHire.jsx
git commit -m "feat(sfh): drop in WallOfCoolGr11 community section"
```

---

## Task 7 — Add Partners desktop CSS

**Files:**
- Modify: `src/pages/SelfFlyHire.jsx` (inside the styled-jsx block, after the `.sfh2-destinations__footer` rule that ends around line 1454)

- [ ] **Step 1: Add Partners desktop styles**

Immediately after the closing `}` of `.sfh2-destinations__footer` (line 1454) and before the `/* ── Process ───...` comment (line 1456), insert:

```css
        /* ── Partners ──────────────────────────────────────────── */
        .sfh2-partners {
          background: #fff;
          padding: 5rem 2rem;
          border-top: 1px solid #e8e6e2;
        }
        .sfh2-partners__inner {
          max-width: 1200px;
          margin: 0 auto;
        }
        .sfh2-partners__header {
          max-width: 600px;
          margin-bottom: 3rem;
        }
        .sfh2-partners__intro {
          font-size: 0.95rem;
          line-height: 1.7;
          color: #555;
          margin: 0 0 0.5rem;
        }
        .sfh2-partners__grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 1px;
          background: #e8e6e2;
          border: 1px solid #e8e6e2;
        }
        .sfh2-partners__card {
          background: #fff;
          padding: 1.5rem;
          display: flex;
          flex-direction: column;
          gap: 0.35rem;
          transition: background 0.2s;
        }
        .sfh2-partners__card:hover {
          background: #faf9f6;
        }
        .sfh2-partners__card-region {
          font-family: 'Share Tech Mono', monospace;
          font-size: 0.6rem;
          text-transform: uppercase;
          letter-spacing: 0.12em;
          color: #9ca3af;
        }
        .sfh2-partners__card-name {
          font-family: 'Space Grotesk', sans-serif;
          font-size: 1rem;
          font-weight: 600;
          color: #1a1a1a;
        }
        .sfh2-partners__card-time {
          font-family: 'Share Tech Mono', monospace;
          font-size: 0.85rem;
          color: #666;
          margin-top: auto;
          padding-top: 0.5rem;
        }
```

(Background is `#fff` — different from destinations' `#faf9f6` — to create a subtle visual divider between the two adjacent card grids.)

- [ ] **Step 2: Verify Partners section now looks like destinations**

Browser tab on `/self-fly-hire`. Expected: Partners section now shows three white cards in a row with hairline grey dividers, matching the destinations card style.

- [ ] **Step 3: Commit**

```bash
git add src/pages/SelfFlyHire.jsx
git commit -m "feat(sfh): style Our Partners section desktop"
```

---

## Task 8 — Add Events desktop CSS

**Files:**
- Modify: `src/pages/SelfFlyHire.jsx` (inside the styled-jsx block, immediately after the Partners CSS added in Task 7)

- [ ] **Step 1: Add Events desktop styles**

Immediately after the `.sfh2-partners__card-time` rule from Task 7, insert:

```css
        /* ── Events ────────────────────────────────────────────── */
        .sfh2-events {
          background: #faf9f6;
          padding: 5rem 2rem;
        }
        .sfh2-events__inner {
          max-width: 1200px;
          margin: 0 auto;
        }
        .sfh2-events__header {
          max-width: 600px;
          margin-bottom: 3rem;
        }
        .sfh2-events__intro {
          font-size: 0.95rem;
          line-height: 1.7;
          color: #555;
          margin: 0 0 0.5rem;
        }
        .sfh2-events__grid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 1px;
          background: #e8e6e2;
          border: 1px solid #e8e6e2;
        }
        .sfh2-events__card {
          background: #fff;
          padding: 1.5rem;
          display: flex;
          flex-direction: column;
          gap: 0.35rem;
          transition: background 0.2s;
        }
        .sfh2-events__card:hover {
          background: #faf9f6;
        }
        .sfh2-events__card-region {
          font-family: 'Share Tech Mono', monospace;
          font-size: 0.6rem;
          text-transform: uppercase;
          letter-spacing: 0.12em;
          color: #9ca3af;
        }
        .sfh2-events__card-name {
          font-family: 'Space Grotesk', sans-serif;
          font-size: 1rem;
          font-weight: 600;
          color: #1a1a1a;
        }
        .sfh2-events__card-time {
          font-family: 'Share Tech Mono', monospace;
          font-size: 0.85rem;
          color: #666;
          margin-top: auto;
          padding-top: 0.5rem;
        }
        .sfh2-events__dots {
          display: none;
        }
        .sfh2-events__footer {
          text-align: center;
          margin: 2.5rem 0 0;
          font-family: 'Share Tech Mono', monospace;
          font-size: 0.7rem;
          text-transform: uppercase;
          letter-spacing: 0.12em;
          color: #9ca3af;
        }
```

- [ ] **Step 2: Verify Events section now matches destinations grid**

Browser tab on `/self-fly-hire`. Expected: Events section shows 11 cards in a 4-column grid (last row will have 3 cards). Cards match destinations card styling exactly. Footer caption "Plus the rest of the calendar — let us know your day." appears below in monospace.

- [ ] **Step 3: Commit**

```bash
git add src/pages/SelfFlyHire.jsx
git commit -m "feat(sfh): style Events section desktop"
```

---

## Task 9 — Add tablet (≤1024px) responsive override for Events

**Files:**
- Modify: `src/pages/SelfFlyHire.jsx` (inside the existing `@media (max-width: 1024px)` block around line 1855)

- [ ] **Step 1: Add the events 3-column override**

Find the existing `@media (max-width: 1024px)` block at line 1855. Inside it, immediately after the existing `.sfh2-destinations__grid { grid-template-columns: repeat(3, 1fr); }` rule (line 1868–1870), add:

```css
          .sfh2-events__grid {
            grid-template-columns: repeat(3, 1fr);
          }
```

(Partners is already 3 columns at desktop and stays 3 columns at tablet — no override needed for it.)

- [ ] **Step 2: Verify by resizing**

In the browser, resize viewport to ~900px wide. Expected: Events grid drops from 4 to 3 columns, matching destinations behaviour at the same breakpoint.

- [ ] **Step 3: Commit**

```bash
git add src/pages/SelfFlyHire.jsx
git commit -m "feat(sfh): events tablet responsive override"
```

---

## Task 10 — Add mobile (≤768px) responsive overrides

**Files:**
- Modify: `src/pages/SelfFlyHire.jsx` (inside the existing `@media (max-width: 768px)` block, immediately after the `.sfh2-destinations__dots { display: flex; }` rule around line 2049)

- [ ] **Step 1: Add Partners mobile stack + Events scroll/dots**

Find the closing brace of `.sfh2-destinations__dots { display: flex; }` at line 2050–2051. Immediately after it (before `.sfh2-enquiry__row` at line 2052), insert:

```css
          /* Partners: stack to single column on mobile (only 3 cards) */
          .sfh2-partners__grid {
            grid-template-columns: 1fr;
          }

          /* Events: mirror destinations mobile scroll/snap pattern */
          .sfh2-events__grid {
            grid-template-columns: unset;
            grid-template-rows: repeat(2, auto);
            grid-auto-flow: column;
            grid-auto-columns: 50%;
            overflow-x: auto;
            overflow-y: hidden;
            -webkit-overflow-scrolling: touch;
            scrollbar-width: none;
            scroll-snap-type: x mandatory;
          }
          .sfh2-events__grid::-webkit-scrollbar {
            display: none;
          }
          .sfh2-events__card {
            scroll-snap-align: start;
          }
          .sfh2-events__dots {
            display: flex;
            justify-content: center;
            gap: 6px;
            padding-top: 14px;
          }
          .sfh2-events__dot {
            width: 6px;
            height: 6px;
            border-radius: 50%;
            background: #ccc8c1;
            transition: background 0.2s;
            cursor: pointer;
          }
          .sfh2-events__dot--active {
            background: #1a1a1a;
          }
```

- [ ] **Step 2: Verify mobile layout**

In the browser, narrow viewport to ~375px (iPhone SE width) using devtools.

Expected:
- **Partners**: three cards stacked vertically in a single column.
- **Events**: 2 rows × 2 columns visible, swipeable horizontally; three pagination dots underneath; tapping a dot smooth-scrolls the grid; active dot turns dark.

- [ ] **Step 3: Commit**

```bash
git add src/pages/SelfFlyHire.jsx
git commit -m "feat(sfh): mobile responsive for partners + events"
```

---

## Task 11 — Final cross-section verification

No code changes in this task — pure visual/behaviour QA on the dev server.

- [ ] **Step 1: Desktop walkthrough (1440px)**

Open `/self-fly-hire` at desktop width. Scroll from top to bottom. Verify in order:
- Hero
- Intro
- Fleet
- (other intermediate sections unchanged)
- Destinations grid (existing) — looks unchanged
- **Our Partners** — new white-bg section, three cards in a row
- **Events** — new warm-bg section, 11 cards in 4-col grid + footer caption
- **Community Wall** — full-bleed gallery animates in on scroll, dark footer chrome at the bottom
- Enquiry form — looks unchanged, still scrolls into view properly

- [ ] **Step 2: Tablet walkthrough (~900px)**

Verify:
- Destinations: 3 columns
- Partners: 3 columns
- Events: 3 columns
- Community Wall: still full-bleed and renders without horizontal scroll on the page

- [ ] **Step 3: Mobile walkthrough (~375px)**

Verify:
- Destinations: horizontal scroll with dots (existing behaviour)
- Partners: 3 cards stacked vertically (1 column)
- Events: horizontal scroll with dots (matches destinations)
- Community Wall: collapses to its mobile carousel layout (compact dark header bar + horizontal image carousel + dark footer)

- [ ] **Step 4: Console check**

Open browser devtools console. Expected: no React errors, no warnings about missing keys, no Firebase auth errors triggered by Wall of Cool's Firestore query.

- [ ] **Step 5: Sticky-blur regression check**

Confirm any existing sticky-blur transitions on neighbouring sections (e.g., between the fleet section and the new Partners block) still work without visual glitches. If a sticky-blur boundary now sits at the destinations→partners line and was previously tuned for destinations→enquiry, it may need re-tuning — note this and stop before changing it.

- [ ] **Step 6: Final commit (only if any tweaks were needed in steps 1–5)**

If everything looks correct, no commit needed — close out with a `git status` showing a clean tree. If you adjusted anything during QA:

```bash
git add src/pages/SelfFlyHire.jsx
git commit -m "fix(sfh): post-QA tweaks to partners/events layout"
```

---

## Acceptance Criteria (from spec)

1. ✅ `/self-fly-hire` renders four sections in order between destinations and the enquiry form: existing destinations → Our Partners → Events → Community Wall → existing enquiry. (Tasks 4, 5, 6)
2. ✅ Partners section: 3 cards in a single row on desktop, single column on mobile. (Tasks 4, 7, 10)
3. ✅ Events section: 11 cards in a 4-column grid on desktop, mirrors destinations mobile scroll pattern with working dot pagination. (Tasks 3, 5, 8, 9, 10)
4. ✅ All new partners/events cards use the same typography, spacing, hover state, border treatment as `sfh2-destinations__card`. (Tasks 7, 8 — CSS is direct copy)
5. ✅ Community Wall renders identically to its current appearance on Experimentation.jsx. (Task 6 — drop-in)
6. ✅ No regression to existing destinations / enquiry / sticky-blur. (Task 11 — verification)

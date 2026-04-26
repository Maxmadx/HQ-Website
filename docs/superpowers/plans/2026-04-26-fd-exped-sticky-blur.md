# Home Page (Experimentation) Expeditions Sticky-Blur Transition Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Pin `.fd-exped` to the bottom of the viewport on desktop, blur it, and fade in a black overlay as the next-sibling Sales `<ParallaxSection>` rises over it — mirroring the variants→specs transition on `/aircraft/r66`.

**Architecture:** Single-file change to `src/pages/Experimentation.jsx` (the page mounted at `/`). Add CSS rules inside the existing `<style>` block (sticky positioning, blur filter, `::after` overlay, next-sibling z-index, all gated by `@media (min-width: 901px)` and `prefers-reduced-motion: no-preference`). Add one `useEffect` that wires `scroll`, `resize`, and `matchMedia` change listeners and writes `--fd-exped-stick-top`, `--fd-exped-blur`, and `--fd-exped-darken` CSS variables on the section.

**Tech Stack:** React 18, Vite. No new dependencies. No tests are added because the project has no test infrastructure for scroll-driven CSS-variable animations and the spec defines a manual browser verification plan that this plan executes.

**Spec:** `docs/superpowers/specs/2026-04-26-fd-exped-sticky-blur-design.md` (commit `3029fa8`).

**Key constants (spec):**

| Constant | Value |
|---|---|
| `MAX_BLUR` | `10` (px) |
| `MAX_DARKEN` | `0.55` |
| `FADE_COMPLETE` | `0.95` |
| Easing | `Math.pow(adjusted, 8)` |
| Desktop breakpoint | `min-width: 901px` |

---

## Task 1: Add CSS rules for sticky pin, blur filter, and dark overlay

**Files:**
- Modify: `src/pages/Experimentation.jsx` (insert after the `.fd-exped { ... }` rule at line 8129–8133)

- [ ] **Step 1: Open the file and locate the anchor**

Open `src/pages/Experimentation.jsx`. Find the existing rule (around line 8129):

```css
        .fd-exped {
          background: transparent;
          position: relative;
          z-index: 1;
        }
        .fd-exped__glow {
```

The insertion goes between these two rules (after the `.fd-exped` block, before `.fd-exped__glow`).

- [ ] **Step 2: Insert the new CSS rules immediately after the `.fd-exped` block**

Use the Edit tool. Replace this exact text:

```
        .fd-exped {
          background: transparent;
          position: relative;
          z-index: 1;
        }
        .fd-exped__glow {
```

With this exact text:

```
        .fd-exped {
          background: transparent;
          position: relative;
          z-index: 1;
        }

        /* Sticky-blur transition into Sales (desktop only).
           Mirrors the variants→specs pattern on /aircraft/r66.
           Overrides position: relative above; z-index: 1 is preserved
           and the next-sibling parallax gets z-index: 3 to stack above. */
        @media (min-width: 901px) {
          .fd-exped {
            position: sticky;
            top: var(--fd-exped-stick-top, 0);
          }

          @media (prefers-reduced-motion: no-preference) {
            .fd-exped {
              filter: blur(var(--fd-exped-blur, 0px));
              will-change: filter;
            }

            .fd-exped::after {
              content: '';
              position: absolute;
              inset: 0;
              background: #000;
              opacity: var(--fd-exped-darken, 0);
              pointer-events: none;
              z-index: 2;
            }
          }

          /* The Sales ParallaxSection is the immediate next sibling and must
             stack above the pinned, blurred Expeditions while it rises. */
          .fd-exped + .parallax-section {
            position: relative;
            z-index: 3;
          }
        }

        .fd-exped__glow {
```

- [ ] **Step 3: Verify the file still parses**

Run from the project root:

```bash
node --check src/pages/Experimentation.jsx 2>&1 | head -5
```

Expected: no output (the file is JSX, not pure JS, so `node --check` will object — instead use the dev server smoke test below).

Actually, run the dev server and confirm it starts cleanly:

```bash
npm run dev
```

Expected: vite reports `ready in N ms` with no syntax error. Leave it running for the next steps. If it errors, the inserted CSS broke string interpolation — recheck the Edit.

- [ ] **Step 4: Visual smoke test — sticky engages but blur/overlay are still 0**

In the browser (the dev server URL printed by vite, typically `http://localhost:5173/`), scroll down to the Expeditions section. Expected at this stage (only CSS, no JS yet):

- The section appears and scrolls normally until its content fills the viewport.
- Because `--fd-exped-stick-top` is unset, sticky uses `top: 0` and pins the **top** of the section to the top of the viewport — this looks wrong, but it's expected at this checkpoint. The JS in Task 2 sets the var to a negative number that re-pins to the bottom.
- No blur, no overlay (vars are `0` by default).

If the section never sticks at all, check that `position: sticky` was applied (DevTools → inspect `.fd-exped` → Computed → `position`).

- [ ] **Step 5: Confirm the existing glow/globe positioning still works**

In DevTools, inspect `.fd-exped__glow` and `.fd-exped__globe`. Confirm both have inline `top` (and the glow has inline `left`) being set by the existing positioning useEffect (line 2298). Scroll past the section once — the glow should remain centered on the pin within the section's painted box. If the glow drifts off the pin, note it and proceed; Task 3's visual checks will catch any visible regression.

- [ ] **Step 6: Commit**

```bash
git add src/pages/Experimentation.jsx
git commit -m "$(cat <<'EOF'
feat(home): add sticky-blur CSS for Expeditions→Sales transition

Adds desktop-only position: sticky on .fd-exped, a blur filter wired
to --fd-exped-blur, a black ::after overlay wired to --fd-exped-darken,
and z-index on the next-sibling parallax. CSS-variable values are
provided by a useEffect added in the next commit.

Co-Authored-By: Claude Opus 4.7 <noreply@anthropic.com>
EOF
)"
```

---

## Task 2: Add the useEffect that drives the CSS variables

**Files:**
- Modify: `src/pages/Experimentation.jsx` (insert a new `useEffect` after the phase-text minHeight-sync useEffect that ends at line 2367, immediately before the "Clubhouse: right side overlay" useEffect at line 2370)

- [ ] **Step 1: Locate the insertion point**

Open `src/pages/Experimentation.jsx`. Find the closing of the phase-text minHeight-sync useEffect (around line 2365–2370):

```jsx
    sync();
    window.addEventListener('resize', sync);
    return () => window.removeEventListener('resize', sync);
  }, []);

  // Clubhouse: right side overlay fades in as you scroll (desktop only)
  useEffect(() => {
```

The new useEffect goes between `}, []);` (line 2367) and the `// Clubhouse:` comment (line 2369).

- [ ] **Step 2: Insert the new useEffect**

Use the Edit tool. Replace:

```
    sync();
    window.addEventListener('resize', sync);
    return () => window.removeEventListener('resize', sync);
  }, []);

  // Clubhouse: right side overlay fades in as you scroll (desktop only)
  useEffect(() => {
```

With:

```
    sync();
    window.addEventListener('resize', sync);
    return () => window.removeEventListener('resize', sync);
  }, []);

  // Sticky-blur transition: pins .fd-exped at viewport-bottom on desktop,
  // blurs it, and fades a black overlay in as the next sibling (Sales
  // parallax) rises over it. Mirrors the R66 variants→specs pattern.
  useEffect(() => {
    if (typeof window === 'undefined') return;

    const section = document.querySelector('.fd-exped');
    if (!section) return;

    const MAX_BLUR = 10;
    const MAX_DARKEN = 0.55;
    const FADE_COMPLETE = 0.95;
    const MEDIA = window.matchMedia('(min-width: 901px)');

    const findRisingSection = () => {
      const next = section.nextElementSibling;
      if (next && (next.classList.contains('parallax-section') ||
                   next.querySelector?.('.parallax-section'))) return next;
      const sales = document.getElementById('sales');
      if (!sales) return next;
      return sales.previousElementSibling || next;
    };

    const setStickTop = () => {
      if (!MEDIA.matches) {
        section.style.removeProperty('--fd-exped-stick-top');
        return;
      }
      const vh = window.innerHeight;
      const h = section.offsetHeight;
      section.style.setProperty('--fd-exped-stick-top', `${Math.min(0, vh - h)}px`);
    };

    const onScroll = () => {
      if (!MEDIA.matches) {
        section.style.setProperty('--fd-exped-blur', '0px');
        section.style.setProperty('--fd-exped-darken', '0');
        return;
      }
      const next = findRisingSection();
      if (!next) return;
      const vh = window.innerHeight;
      const rect = next.getBoundingClientRect();
      const progress = Math.min(1, Math.max(0, (vh - rect.top) / vh));
      const adjusted = Math.min(1, progress / FADE_COMPLETE);
      const darken = Math.pow(adjusted, 8) * MAX_DARKEN;

      section.style.setProperty('--fd-exped-blur', `${progress * MAX_BLUR}px`);
      section.style.setProperty('--fd-exped-darken', `${darken}`);
    };

    const onResize = () => { setStickTop(); onScroll(); };
    const onMediaChange = () => { setStickTop(); onScroll(); };

    setStickTop();
    onScroll();

    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onResize);
    MEDIA.addEventListener('change', onMediaChange);

    return () => {
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onResize);
      MEDIA.removeEventListener('change', onMediaChange);
    };
  }, []);

  // Clubhouse: right side overlay fades in as you scroll (desktop only)
  useEffect(() => {
```

- [ ] **Step 3: Verify dev server hot-reloads cleanly**

Watch the terminal where `npm run dev` is running. Expected: vite logs an HMR update, no errors.

If you see "useEffect is not defined", confirm `useEffect` is already imported in this file (it is — the file uses many `useEffect` hooks already). If you see any other error, recheck the Edit.

- [ ] **Step 4: Inspect the CSS vars in DevTools**

In the browser, open DevTools, inspect the `.fd-exped` element, look at the `style` attribute. Expected: it has `--fd-exped-stick-top`, `--fd-exped-blur`, `--fd-exped-darken` defined. Scroll the page and watch the values update live.

- [ ] **Step 5: Commit**

```bash
git add src/pages/Experimentation.jsx
git commit -m "$(cat <<'EOF'
feat(home): wire scroll handler for Expeditions sticky-blur transition

Adds a useEffect that computes --fd-exped-stick-top from viewport height
and section height, and writes --fd-exped-blur and --fd-exped-darken
based on how far the next-sibling Sales parallax has risen. Desktop only
(matchMedia gated). Cleans up listeners on unmount.

Co-Authored-By: Claude Opus 4.7 <noreply@anthropic.com>
EOF
)"
```

---

## Task 3: Manual verification per spec testing plan

**Files:** none modified.

This task is a checklist of manual browser tests. No code changes. If any check fails, stop and diagnose before continuing. Do not commit anything in this task unless a fix is needed.

- [ ] **Step 1: Desktop golden path (≥ 1280px viewport)**

Reload the home page. Scroll down past the hero. When the Expeditions section's bottom reaches the viewport bottom:

- The section pins.
- As you keep scrolling, the Sales parallax (the dark "SALES" hero) rises over Expeditions from the bottom.
- Expeditions visibly blurs and darkens as the parallax rises.
- When the parallax fully covers Expeditions, the rest of the page (`.fd-sales` content) scrolls normally.

Expected: matches the screenshot the user provided. If it doesn't, check DevTools → inspect `.fd-exped` → confirm `position: sticky` is computed and `top` is a negative pixel value.

- [ ] **Step 2: Reverse scroll**

Scroll back up. Expected: effect reverses cleanly. Blur and overlay fade back to 0. No flicker, no stuck state.

- [ ] **Step 3: Verify other sections still work**

Continue scrolling past Sales into Maintenance, Contact, footer. Expected: all sections render and scroll normally. No layout shift, no overlap, no clipped content.

- [ ] **Step 4: Verify scroll-spy nav still tracks correctly**

The fixed top nav (`Experimentation header`) tracks the current section. Cross the Expeditions→Sales transition slowly. Expected: the active section indicator updates from "EXPEDITIONS" to "SALES" at the right time. No stuck states.

- [ ] **Step 5: Resize from desktop to mobile mid-page**

Stay scrolled at the Expeditions transition. In DevTools, switch to a mobile viewport (e.g. 375×812). Expected:

- Sticky disengages.
- Blur clears immediately.
- Overlay clears immediately.
- The page is scrollable normally.

Resize back to desktop (e.g. 1280×800). Expected: sticky re-engages and the effect resumes when scroll position is appropriate.

- [ ] **Step 6: Mobile-only verification**

In a mobile viewport, scroll through the entire page. Expected: no sticky pin on Expeditions, no blur, no overlay — the page scrolls exactly as before this change.

- [ ] **Step 7: Reduced motion**

In DevTools → Rendering pane → "Emulate CSS media feature prefers-reduced-motion" → "reduce". Reload the page. Scroll to the Expeditions transition. Expected:

- Sticky still engages (sticky alone is not a vestibular issue).
- Blur is **disabled** (the `prefers-reduced-motion: no-preference` media query gates it out).
- Overlay is **disabled** (same gate).

This is the explicit reduced-motion behavior from the spec.

- [ ] **Step 8: Console check**

DevTools → Console. Expected: no errors, no warnings related to this change.

- [ ] **Step 9: Confirm fixed header is unaffected**

The top nav (`Experimentation header`) should remain fully visible and clickable throughout the transition. Expected: it sits above the rising Sales parallax (it's in its own fixed layer with higher stacking).

- [ ] **Step 10: Stop dev server**

If everything passed, stop the dev server.

```bash
# In the terminal running npm run dev:
# Ctrl-C
```

If anything failed, do not stop — diagnose, propose a fix, get approval, and add a Task 4 for the fix.

---

## Self-Review

**Spec coverage:**

| Spec section | Plan task |
|---|---|
| Behavior 1–5 (sticky, rising, blur, darken, release) | Task 1 (CSS) + Task 2 (JS) → Task 3.1, 3.2, 3.3 verify |
| Behavior 6 (no effect on mobile) | Task 1 media query + Task 2 matchMedia branch → Task 3.5, 3.6 verify |
| Mechanism CSS | Task 1 |
| Mechanism JS | Task 2 |
| Numerical constants | Task 2 (defined as constants) |
| Affected files | Task 1, Task 2 (only `Experimentation.jsx`) |
| Externalities verified | Task 1.4, 1.5, Task 3.3, 3.9 |
| Risks: nextElementSibling fallback | Task 2 (`findRisingSection` includes fallback) |
| Risks: reduced motion | Task 1 (`prefers-reduced-motion: no-preference`) → Task 3.7 verify |
| Risks: resize desktop→mobile leaves stale vars | Task 2 (mobile branch zeroes vars) → Task 3.5 verify |
| Risks: stacking with cinematic overlay | Task 1 (`::after` z-index 2 on `.fd-exped`) → Task 3.1 verify |
| Testing plan steps 1–11 | Task 3.1–3.9 (consolidated) |

All spec sections covered.

**Placeholder scan:** No "TBD", "TODO", "implement later", or vague handling. All code blocks contain complete code. All commands are exact.

**Type/name consistency:**
- CSS variables: `--fd-exped-stick-top`, `--fd-exped-blur`, `--fd-exped-darken` — used identically in Task 1 (defaults) and Task 2 (writes).
- JS constants: `MAX_BLUR`, `MAX_DARKEN`, `FADE_COMPLETE` — defined and used only in Task 2.
- DOM selectors: `.fd-exped`, `#sales`, `.parallax-section` — used consistently.
- Function names: `findRisingSection`, `setStickTop`, `onScroll`, `onResize`, `onMediaChange` — defined and referenced consistently in Task 2.

No mismatches.

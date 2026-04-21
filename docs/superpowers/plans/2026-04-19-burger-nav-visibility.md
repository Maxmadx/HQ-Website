# Burger Nav Visibility Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Make the burger button always visible once the header has faded in, show as X when `fd-nav` is visible, scroll to the nav's stick point when pressed from above it, and close the nav when pressed while it's stuck and open.

**Architecture:** Two new state variables (`navIsStuck`, `navManuallyClosed`) in `Experimentation.jsx` drive the burger's icon state and the nav's collapsed state. A single `handleBurgerClick` replaces the inline toggle. CSS changes promote the mobile-only `fd-nav--hidden` rule to all screen sizes and make the burger always visible within the header (inheriting the header's own opacity animation).

**Tech Stack:** React 18, CSS-in-JSX `<style>` tag (Experimentation.jsx), external navigation.css

**Spec:** `docs/superpowers/specs/2026-04-19-burger-nav-visibility-design.md`

---

## File Map

| File | Change |
|------|--------|
| `src/pages/Experimentation.jsx` | Add state, click handler, update fd-nav className, update CSS rules, update props |
| `src/pages/HeroSectionFinalTesting.jsx` | Add props, update burger className logic |

---

## Task 1: Add `navIsStuck` and `navManuallyClosed` state + expose `navIsStuck` from compact-nav effect

**Files:**
- Modify: `src/pages/Experimentation.jsx:1998-2000` (state declarations)
- Modify: `src/pages/Experimentation.jsx:2755-2763` (compact-nav update fn)

- [ ] **Step 1: Add two new state variables after the existing nav state declarations (line 2000)**

Find this block:
```jsx
  const [navCompact, setNavCompact] = useState(false);
  const [navHidden, setNavHidden] = useState(false);
  const [navManuallyShown, setNavManuallyShown] = useState(false);
```

Replace with:
```jsx
  const [navCompact, setNavCompact] = useState(false);
  const [navHidden, setNavHidden] = useState(false);
  const [navManuallyShown, setNavManuallyShown] = useState(false);
  const [navIsStuck, setNavIsStuck] = useState(false);
  const [navManuallyClosed, setNavManuallyClosed] = useState(false);
```

- [ ] **Step 2: Expose `isStuck` from the compact-nav `update` function (line 2763)**

Find this block inside the compact-nav `useEffect`:
```jsx
    const update = () => {
      const navTop = navRef.current.getBoundingClientRect().top;
      const isStuck = navSentinelRef.current
        ? navSentinelRef.current.getBoundingClientRect().top < navTop
        : false;
      const stuckDistance = isStuck
        ? navTop - navSentinelRef.current.getBoundingClientRect().top
        : 0;
      setNavCompact(stuckDistance > COMPACT_SCROLL_DISTANCE);
    };
```

Replace with:
```jsx
    const update = () => {
      const navTop = navRef.current.getBoundingClientRect().top;
      const isStuck = navSentinelRef.current
        ? navSentinelRef.current.getBoundingClientRect().top < navTop
        : false;
      const stuckDistance = isStuck
        ? navTop - navSentinelRef.current.getBoundingClientRect().top
        : 0;
      setNavCompact(stuckDistance > COMPACT_SCROLL_DISTANCE);
      setNavIsStuck(isStuck);
    };
```

- [ ] **Step 3: Add a reset effect for `navManuallyClosed` when nav unsticks**

Find this block (around line 2802):
```jsx
  // Reset manual override when clubhouse section leaves view
  useEffect(() => {
    if (!navHidden) setNavManuallyShown(false);
  }, [navHidden]);
```

Add the following immediately after it:
```jsx
  // Reset manual close when nav unsticks (user scrolled back above nav's natural position)
  useEffect(() => {
    if (!navIsStuck) setNavManuallyClosed(false);
  }, [navIsStuck]);
```

- [ ] **Step 4: Verify no runtime errors**

Run `npm run dev` (or the project's dev command) and open the home page (`/`). Open DevTools console — no errors should appear. The page should behave identically to before (we only added state, nothing uses it yet).

- [ ] **Step 5: Commit**

```bash
git add src/pages/Experimentation.jsx
git commit -m "feat(nav): add navIsStuck and navManuallyClosed state"
```

---

## Task 2: Add `handleBurgerClick` and wire up props

**Files:**
- Modify: `src/pages/Experimentation.jsx:3060-3064` (before return / HeroSectionFinalTesting usage)

- [ ] **Step 1: Add `handleBurgerClick` just before the `return (` of the main component**

Find this line (around 3061):
```jsx
  return (
    <div className="final-draft" ref={containerRef}>
      {/* ===== HERO SECTION (Diagonal Split + Header) ===== */}
      <HeroSectionFinalTesting navHidden={navHidden} navManuallyShown={navManuallyShown} onToggleNav={() => setNavManuallyShown(v => !v)} />
```

Replace with:
```jsx
  const handleBurgerClick = () => {
    if (!navRef.current) return;
    const navRect = navRef.current.getBoundingClientRect();

    // If the nav hasn't reached its stick point yet, scroll down to it
    if (navRect.top > 54) {
      window.scrollTo({ top: window.scrollY + navRect.top - 49, behavior: 'smooth' });
      return;
    }

    // Nav is at its sticky position — toggle open/closed
    const isCurrentlyVisible = (!navHidden || navManuallyShown) && !navManuallyClosed;
    if (isCurrentlyVisible) {
      if (navHidden) setNavManuallyShown(false);
      else setNavManuallyClosed(true);
    } else {
      if (navManuallyClosed) setNavManuallyClosed(false);
      else if (navHidden) setNavManuallyShown(true);
    }
  };

  return (
    <div className="final-draft" ref={containerRef}>
      {/* ===== HERO SECTION (Diagonal Split + Header) ===== */}
      <HeroSectionFinalTesting
        navHidden={navHidden}
        navManuallyShown={navManuallyShown}
        navIsStuck={navIsStuck}
        navManuallyClosed={navManuallyClosed}
        onToggleNav={handleBurgerClick}
      />
```

- [ ] **Step 2: Update `fd-nav` className to include `navManuallyClosed` (line 3484)**

Find:
```jsx
        className={`fd-nav ${navCompact ? 'fd-nav--compact' : ''} ${navHidden && !navManuallyShown ? 'fd-nav--hidden' : ''}`}
```

Replace with:
```jsx
        className={`fd-nav ${navCompact ? 'fd-nav--compact' : ''} ${(navHidden && !navManuallyShown) || navManuallyClosed ? 'fd-nav--hidden' : ''}`}
```

- [ ] **Step 3: Verify no runtime errors**

Run `npm run dev` and open the home page. Open DevTools console — no errors. The page should still behave identically (the new handler is wired up but CSS for `fd-nav--hidden` hasn't changed yet so closing on desktop won't animate).

- [ ] **Step 4: Commit**

```bash
git add src/pages/Experimentation.jsx
git commit -m "feat(nav): add handleBurgerClick with scroll-to and close logic"
```

---

## Task 3: Update CSS — promote fd-nav--hidden and make burger always visible

**Files:**
- Modify: `src/pages/Experimentation.jsx:6546-6573` (inline `<style>` block)

- [ ] **Step 1: Remove the `@media (max-width: 768px)` wrapper, promote rules to base, and make burger always visible**

Find this CSS block in the inline `<style>` tag:
```css
        @media (max-width: 768px) {
          .fd-nav {
            overflow: hidden;
            max-height: 300px;
            transition: max-height 0.6s ease, opacity 0.6s ease, border-top-color 1.2s ease, box-shadow 0.3s ease;
          }
          .fd-nav--hidden {
            max-height: 0;
            opacity: 0;
            pointer-events: none;
          }
        }

        /* Burger in header top-right — override fixed positioning, fade in/out */
        .fd-header-burger.hq-menu-btn {
          position: static;
          top: auto;
          right: auto;
          transform: none;
          opacity: 0;
          pointer-events: none;
          transition: opacity 0.6s ease;
        }

        .fd-header-burger--visible.hq-menu-btn {
          opacity: 1;
          pointer-events: auto;
```

Replace with:
```css
        /* fd-nav collapse — works on all screen sizes (was mobile-only before) */
        .fd-nav {
          overflow: hidden;
          max-height: 300px;
          transition: max-height 0.6s ease, opacity 0.6s ease, border-top-color 1.2s ease, box-shadow 0.3s ease;
        }

        .fd-nav--hidden {
          max-height: 0;
          opacity: 0;
          pointer-events: none;
        }

        /* Burger in header top-right — always visible once header fades in.
           Header's own opacity animation gates overall visibility. */
        .fd-header-burger.hq-menu-btn {
          position: static;
          top: auto;
          right: auto;
          transform: none;
          opacity: 1;
          pointer-events: auto;
        }

        .fd-header-burger--visible.hq-menu-btn {
          opacity: 1;
          pointer-events: auto;
```

> **Note:** The `fd-nav` rule now has `overflow: hidden` and `max-height: 300px` on all devices. The existing mobile-only `@media` block that contained these has been replaced by the base rule above. The `fd-nav--hidden` no longer needs a media query. The burger is `opacity: 1` by default (was `0`) — the parent header's own `style.opacity` (animated by the scroll effect in `TestingHeader`) controls whether the user sees it.

- [ ] **Step 2: Manual test — desktop, burger always visible after hero**

Open the home page on a desktop-width browser window. Scroll through the hero. Once the header logo fades in, the burger button should be visible in the top-right of the header.

- [ ] **Step 3: Manual test — desktop, clicking X closes fd-nav**

Scroll past the hero until `fd-nav` is stuck. The burger should now show as X (this won't work yet — needs the HeroSectionFinalTesting changes in Task 4). Skip icon check for now and verify closing: click the burger → `fd-nav` should slide away with a smooth `max-height` animation. Click again → it should slide back.

- [ ] **Step 4: Commit**

```bash
git add src/pages/Experimentation.jsx
git commit -m "feat(nav): promote fd-nav--hidden to all screens, make burger always visible"
```

---

## Task 4: Update `HeroSectionFinalTesting.jsx` — new props and burger icon logic

**Files:**
- Modify: `src/pages/HeroSectionFinalTesting.jsx:92` (`TestingHeader` signature)
- Modify: `src/pages/HeroSectionFinalTesting.jsx:223` (burger `className`)
- Modify: `src/pages/HeroSectionFinalTesting.jsx:374` (`HeroSectionFinalTesting` signature)
- Modify: `src/pages/HeroSectionFinalTesting.jsx:642` (pass-through to `TestingHeader`)

- [ ] **Step 1: Update `TestingHeader` function signature (line 92)**

Find:
```jsx
function TestingHeader({ navHidden = false, navManuallyShown = false, onToggleNav = () => {} }) {
```

Replace with:
```jsx
function TestingHeader({ navHidden = false, navManuallyShown = false, navIsStuck = false, navManuallyClosed = false, onToggleNav = () => {} }) {
```

- [ ] **Step 2: Update burger `className` (line 223)**

Find:
```jsx
              className={`fd-header-burger hq-menu-btn${navHidden ? ' fd-header-burger--visible' : ''}${navManuallyShown ? ' open' : ''}`}
```

Replace with:
```jsx
              className={`fd-header-burger hq-menu-btn${(!navHidden || navManuallyShown) && !navManuallyClosed ? ' open' : ''}`}
```

> **Explanation of the `open` condition:**
> - `(!navHidden || navManuallyShown)` — `fd-nav` is currently rendering (not hidden by mobile clubhouse logic, or manually forced visible)
> - `&& !navManuallyClosed` — and the user hasn't just closed it
> - When this is true → `.open` → spans transform into an X
> - `fd-header-burger--visible` is no longer needed (burger opacity is now always 1 from CSS)

- [ ] **Step 3: Update `HeroSectionFinalTesting` component signature (line 374)**

Find:
```jsx
const HeroSectionFinalTesting = React.memo(({ navHidden, navManuallyShown, onToggleNav }) => {
```

Replace with:
```jsx
const HeroSectionFinalTesting = React.memo(({ navHidden, navManuallyShown, navIsStuck, navManuallyClosed, onToggleNav }) => {
```

- [ ] **Step 4: Update pass-through to `TestingHeader` (line 642)**

Find:
```jsx
      <TestingHeader navHidden={navHidden} navManuallyShown={navManuallyShown} onToggleNav={onToggleNav} />
```

Replace with:
```jsx
      <TestingHeader navHidden={navHidden} navManuallyShown={navManuallyShown} navIsStuck={navIsStuck} navManuallyClosed={navManuallyClosed} onToggleNav={onToggleNav} />
```

- [ ] **Step 5: Commit**

```bash
git add src/pages/HeroSectionFinalTesting.jsx
git commit -m "feat(nav): update TestingHeader burger icon to X/hamburger based on nav visibility"
```

---

## Task 5: Manual end-to-end verification

No code changes — this task is pure verification.

- [ ] **Test A — Desktop: burger visible after hero**

1. Open home page at desktop width (>768px)
2. At page top (hero): burger should NOT be visible (header is transparent)
3. Scroll slowly through the hero diagonal — as the header logo fades in, the burger should fade in with it
4. Expected: burger icon = hamburger (two diagonal lines), visible in top-right of header

- [ ] **Test B — Desktop: burger becomes X when fd-nav is stuck**

1. Continue scrolling past the hero until `fd-nav` sticks at the top
2. Expected: burger transforms to X

- [ ] **Test C — Desktop: clicking X closes fd-nav, re-opens on click**

1. When fd-nav is stuck, click the X
2. Expected: fd-nav slides up with `max-height` animation, burger becomes hamburger
3. Click the hamburger — wait, at this point `navRect.top > 54` is false (nav is still sticky, just collapsed). The click handler's `isCurrentlyVisible` check should be false → calls `setNavManuallyClosed(false)` → nav slides back down, burger becomes X again.

- [ ] **Test D — Desktop: clicking hamburger from hero area scrolls to fd-nav**

1. Scroll back to top (hero)
2. Wait for header to fade in, see hamburger burger
3. Click the burger
4. Expected: page smoothly scrolls down to the point where fd-nav sticks at the top

- [ ] **Test E — Mobile: burger always visible after hero**

1. Open at mobile width (≤640px)
2. Scroll through hero
3. As header fades in: burger should be visible immediately (no navHidden required)
4. Scroll further — burger stays visible through all page sections

- [ ] **Test F — Mobile: clubhouse section still works**

1. On mobile, scroll down to the clubhouse section
2. Expected: fd-nav collapses (existing behaviour)
3. Burger should show as hamburger
4. Click burger: fd-nav slides back, burger becomes X
5. Click X: fd-nav collapses again, burger returns to hamburger

- [ ] **Test G — Scroll back up resets manual close**

1. On desktop: close the fd-nav with X (navManuallyClosed = true)
2. Scroll back up to the hero section so fd-nav unsticks
3. Scroll back down again
4. Expected: fd-nav is visible again (navManuallyClosed was reset to false when navIsStuck became false)

- [ ] **Final commit (if any adjustments made during testing)**

```bash
git add src/pages/Experimentation.jsx src/pages/HeroSectionFinalTesting.jsx
git commit -m "fix(nav): adjust burger/nav behaviour from manual testing"
```

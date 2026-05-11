# Embed Why-Fly-A-Helicopter section into PPL page

**Date:** 2026-05-08
**Status:** Approved (design)

## Goal

Add the sticky-scroll "Why Fly A Helicopter" section (currently rendered standalone at `/final-why-fly-a-helicopter`) to the `/training/ppl` page, immediately after the "Visit Our Clubhouse" section.

## Non-goals

- No content/copy changes to the benefits, titles, descriptions, or imagery.
- No visual redesign of the section — same scroll behavior, same layout, same styles.
- No changes to `/final-why-fly-a-helicopter`'s public URL or rendered output.
- No tests added (presentational refactor with no logic change).

## Approach

Extract the section into a shared component and render it from both pages.

### Files

1. **New** — `src/components/WhyFlyAHelicopter.jsx`
   - Default export `WhyFlyAHelicopter`.
   - Contains the `benefits` array (14 items, three categories: Practical / Experience / Lifestyle).
   - Contains the `useState` / `useRef` / `useEffect` scroll-tracking logic and the `<section>` JSX, moved verbatim from `src/pages/FinalWhyFlyAHelicopter.jsx` lines 13–309.
   - No props.

2. **Edit** — `src/pages/FinalWhyFlyAHelicopter.jsx`
   - Replace body with `import WhyFlyAHelicopter from '../components/WhyFlyAHelicopter'` and `return <WhyFlyAHelicopter />`.
   - Route `/final-why-fly-a-helicopter` continues to render identical output.

3. **Edit** — `src/pages/FinalPPL.jsx`
   - Add `import WhyFlyAHelicopter from '../components/WhyFlyAHelicopter'` near the existing component imports.
   - Render `<WhyFlyAHelicopter />` immediately after the closing `</section>` of the Visit Us block (currently line 769), before the `{/* ========== WHERE & FAQ + DISCOVERY ... ========== */}` wrapper.

## Risks / verification

- The component uses `position: sticky` inside its own outer `<section>`. Sticky binds to the nearest scrolling ancestor — FinalPPL doesn't introduce overflow ancestors at the relevant level, so behavior should match the standalone page. Verify visually on dev server after the change.
- The inline `<style>` block declares a generic `.content-animate` class and `@imports` Google Fonts. Class is locally scoped enough; Google Fonts already loaded on FinalPPL. No conflict expected.
- Section adds ~`14 × 80vh = 1120vh` of scroll height to the PPL page. This is the designed behavior and was approved.

## Out of scope

- Trimming the benefits list or changing per-step scroll factor.
- Making the section collapsible / toggleable.
- Cleanup of FinalPPL.jsx structure (unrelated to this insertion).

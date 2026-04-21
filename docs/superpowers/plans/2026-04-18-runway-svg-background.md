# Runway SVG Background Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add a perspective runway SVG (EGLD 24/06) as an absolute-positioned background behind the video in `fd-about__split-left` in `Experimentation.jsx`.

**Architecture:** Single inline `<svg>` inserted as the first child of `fd-about__split-left`. The SVG is absolutely positioned with `inset:0`, fills the container via `width:100%;height:100%`, and uses `opacity:0.2` and `pointerEvents:none` so it's purely decorative. No CSS changes needed — the parent already has `position:sticky` (containing block) and `overflow:hidden`.

**Tech Stack:** React JSX, inline SVG, no new dependencies.

---

### Task 1: Insert the runway SVG into fd-about__split-left

**Files:**
- Modify: `src/pages/Experimentation.jsx` (~line 3144)

- [ ] **Step 1: Locate the exact insertion point**

Open `src/pages/Experimentation.jsx` and find line ~3144:

```jsx
<div className="fd-about__split-left">
  <div className="fd-about__video">
```

The SVG goes as the first child, immediately after the opening `<div className="fd-about__split-left">` tag.

- [ ] **Step 2: Insert the SVG**

Replace:
```jsx
            <div className="fd-about__split-left">
              <div className="fd-about__video">
```

With:
```jsx
            <div className="fd-about__split-left">
              {/* EGLD runway 24/06 — perspective background */}
              <svg
                viewBox="0 0 400 800"
                xmlns="http://www.w3.org/2000/svg"
                aria-hidden="true"
                style={{
                  position: 'absolute',
                  inset: 0,
                  width: '100%',
                  height: '100%',
                  opacity: 0.2,
                  pointerEvents: 'none',
                }}
                preserveAspectRatio="xMidYMid meet"
              >
                {/* Tarmac strip — wide at bottom (near), narrow at top (far) */}
                <polygon points="80,800 320,800 230,0 170,0" fill="#b8b2a8"/>

                {/* FAR END — runway 06 */}
                <text x="200" y="38" textAnchor="middle" fill="#2a2824"
                  fontFamily="Arial Black, Arial, sans-serif"
                  fontSize="13" fontWeight="900" letterSpacing="3" opacity="0.5">06</text>
                <rect x="176" y="44" width="5" height="10" fill="#2a2824" rx="0.5" opacity="0.55"/>
                <rect x="183" y="44" width="5" height="10" fill="#2a2824" rx="0.5" opacity="0.55"/>
                <rect x="190" y="44" width="5" height="10" fill="#2a2824" rx="0.5" opacity="0.55"/>
                <rect x="197" y="44" width="5" height="10" fill="#2a2824" rx="0.5" opacity="0.55"/>
                <rect x="204" y="44" width="5" height="10" fill="#2a2824" rx="0.5" opacity="0.55"/>
                <rect x="211" y="44" width="5" height="10" fill="#2a2824" rx="0.5" opacity="0.55"/>
                <rect x="218" y="44" width="5" height="10" fill="#2a2824" rx="0.5" opacity="0.55"/>

                {/* CENTRELINE DASHES — perspective scaled, small at top → large at bottom */}
                <rect x="199.5" y="62"  width="1"   height="2"  fill="#2a2824" rx="0.5"/>
                <rect x="199.5" y="68"  width="1"   height="2"  fill="#2a2824" rx="0.5"/>
                <rect x="199"   y="75"  width="1.5" height="3"  fill="#2a2824" rx="0.5"/>
                <rect x="199"   y="82"  width="1.5" height="3"  fill="#2a2824" rx="0.5"/>
                <rect x="199"   y="90"  width="2"   height="4"  fill="#2a2824" rx="0.5"/>
                <rect x="199"   y="99"  width="2"   height="4"  fill="#2a2824" rx="0.5"/>
                <rect x="198.5" y="109" width="2.5" height="5"  fill="#2a2824" rx="0.5"/>
                <rect x="198.5" y="120" width="2.5" height="5"  fill="#2a2824" rx="0.5"/>
                <rect x="198"   y="132" width="3"   height="6"  fill="#2a2824" rx="1"/>
                <rect x="198"   y="145" width="3"   height="7"  fill="#2a2824" rx="1"/>
                <rect x="197.5" y="160" width="3.5" height="8"  fill="#2a2824" rx="1"/>
                <rect x="197"   y="176" width="4"   height="9"  fill="#2a2824" rx="1"/>
                <rect x="197"   y="194" width="4.5" height="11" fill="#2a2824" rx="1"/>
                <rect x="196.5" y="215" width="5"   height="13" fill="#2a2824" rx="1"/>
                <rect x="196"   y="240" width="5.5" height="15" fill="#2a2824" rx="1.5"/>
                <rect x="195.5" y="268" width="6"   height="17" fill="#2a2824" rx="1.5"/>
                <rect x="195"   y="300" width="7"   height="20" fill="#2a2824" rx="2"/>
                <rect x="194.5" y="336" width="8"   height="24" fill="#2a2824" rx="2"/>
                <rect x="194"   y="376" width="9"   height="28" fill="#2a2824" rx="2"/>
                <rect x="193.5" y="422" width="10"  height="32" fill="#2a2824" rx="2"/>
                <rect x="193"   y="474" width="11"  height="36" fill="#2a2824" rx="2"/>
                <rect x="192.5" y="530" width="12"  height="40" fill="#2a2824" rx="2"/>

                {/* AIMING POINT MARKERS — two bars either side of centreline */}
                <rect x="96"  y="480" width="18" height="58" fill="#2a2824" rx="2"/>
                <rect x="286" y="480" width="18" height="58" fill="#2a2824" rx="2"/>

                {/* NEAR END — runway 24 */}
                <text x="200" y="736" textAnchor="middle" fill="#2a2824"
                  fontFamily="Arial Black, Arial, sans-serif"
                  fontSize="60" fontWeight="900" letterSpacing="12">24</text>
                <line x1="83" y1="750" x2="317" y2="750" stroke="#2a2824" strokeWidth="3"/>
                <rect x="86"  y="756" width="22" height="26" fill="#2a2824" rx="1.5"/>
                <rect x="112" y="756" width="22" height="26" fill="#2a2824" rx="1.5"/>
                <rect x="138" y="756" width="22" height="26" fill="#2a2824" rx="1.5"/>
                <rect x="164" y="756" width="22" height="26" fill="#2a2824" rx="1.5"/>
                <rect x="190" y="756" width="22" height="26" fill="#2a2824" rx="1.5"/>
                <rect x="216" y="756" width="22" height="26" fill="#2a2824" rx="1.5"/>
                <rect x="242" y="756" width="22" height="26" fill="#2a2824" rx="1.5"/>
                <rect x="268" y="756" width="22" height="26" fill="#2a2824" rx="1.5"/>
                <rect x="294" y="756" width="22" height="26" fill="#2a2824" rx="1.5"/>
              </svg>
              <div className="fd-about__video">
```

- [ ] **Step 3: Verify in the browser**

Start the dev server if not already running:
```bash
npm run dev
```

Navigate to the Experimentation page. Scroll to the "About" section. Confirm:
- Runway markings are faintly visible in the left column background behind the video
- "24" threshold is at the bottom of the column, "06" at the top
- Centreline dashes converge upward (perspective effect)
- The video renders normally on top — markings don't interfere with it
- On mobile (< ~768px), the runway is not visible (`.fd-about__split-left` is `display:none`)

- [ ] **Step 4: Commit**

```bash
git add src/pages/Experimentation.jsx
git commit -m "feat(about): add EGLD runway 24/06 perspective SVG background to video column"
```

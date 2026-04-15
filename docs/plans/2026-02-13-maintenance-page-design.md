# Maintenance Page Design Document

**Date:** 2026-02-13
**Status:** Approved
**Route:** /maintenance

## Overview

Full immersive brand experience maintenance page with 30 sections following the HQ Aviation "Luxury Minimal Aviation" design language. Inspired by FinalPPL, FinalWhyFlyAHelicopter, and FinalDraft reference pages.

## Design System

### Typography
- **Primary:** Space Grotesk (headlines, titles, brand text)
- **Monospace:** Share Tech Mono (numbers, counters, coordinates, technical data)
- **Fallbacks:** -apple-system, sans-serif

### Colors
| Token | Value | Usage |
|-------|-------|-------|
| Primary | #1a1a1a | Text, buttons, dark sections |
| Background | #faf9f6 | Warm white main background |
| Background Alt | #ffffff | Alternate sections |
| Heading Gradient 1 | #1a1a1a | First word |
| Heading Gradient 2 | #4a4a4a | Second word |
| Heading Gradient 3 | #7a7a7a | Third word |
| Body Text | #666666 | Paragraphs |
| Muted | #888888 | Pre-text, labels |
| Border | #e8e6e2 | Grid lines, dividers |

### Animation
- Framer Motion for scroll-triggered animations
- Easing: cubic-bezier(0.16, 1, 0.3, 1) for expressive movements
- Duration: 0.6s-0.8s for section reveals
- Parallax: useTransform with [-15%, 15%] range

---

## Section Specifications

### SECTION 1: Hero with Spotlight Animation
**Height:** 100vh
**Background:** Maintenance hangar image with gradient overlay
**Components:**
- MaintenanceHeader (spotlight animation matching FinalDraft)
- Animated grid lines (4 vertical, 2 horizontal)
- Content centered in viewport

**Content:**
```
Pre-text: "EASA PART 145 APPROVED"
Headline (gradient):
  - "PRECISION" (#1a1a1a)
  - "ENGINEERING" (#4a4a4a)
  - "EXCELLENCE" (#7a7a7a)
Divider: 80px animated line
Coordinates: 51.5751°N • 0.5059°W
```

**Animations:**
- Grid lines: scaleY(0) → scaleY(1), staggered 0.1s
- Words: opacity 0, translateY(40px) → visible, delay per word
- Divider: scaleX(0) → scaleX(1)

---

### SECTION 2: Scroll Prompt
**Position:** Fixed, bottom 1.5rem, center
**Components:**
- Text: "Scroll to explore" (0.65rem, uppercase, letter-spacing 0.2em)
- Animated line: 1px × 50px with moving 30% segment

**Behavior:** Hides after 100px scroll

---

### SECTION 3: Stats Counter Strip
**Background:** #1a1a1a (dark)
**Padding:** 4rem 2rem
**Layout:** Flex, justify-content: center, gap: 4rem

**Stats:**
| Value | Label | Suffix |
|-------|-------|--------|
| 85 | Aircraft Under Care | + |
| 30 | Years Experience | + |
| 100 | Genuine Parts | % |

**Components:** AnimatedNumber (counts up on scroll into view)
**Typography:** Share Tech Mono, 3rem for numbers, 0.7rem for labels

---

### SECTION 4: Philosophy Introduction
**Background:** #faf9f6
**Padding:** 6rem 2rem
**Max-width:** 800px centered

**Content:**
```
Pre-text: "Our Approach"
Headline (gradient): "Where / Precision / Meets / Care"
Body: "At HQ Aviation, maintenance isn't just a service—it's a commitment
to excellence. Every inspection, every repair, every overhaul is performed
with the same meticulous attention to detail that has defined us since 1990."
```

**Animation:** Reveal wrapper, translateY(40px) → 0

---

### SECTION 5: Parallax Break — Hangar Wide Shot
**Height:** 400px
**Image:** /assets/images/facility/maintenance-.jpg
**Parallax:** y transform [-15%, 15%]
**Overlay:** rgba(0,0,0,0.5)

**Content:**
```
Number row: — 01 —
Label: "Factory Trained"
Large text: "MAINTENANCE" (outlined, 9rem, opacity 0.7)
```

**Wave overlays:** Top and bottom SVG waves (rgba white, layered)

---

### SECTION 6: Services Grid Header
**Background:** #ffffff
**Padding:** 5rem 2rem 2rem

**Content:**
```
Pre-text: "Our Services"
Headline (gradient): "9 / Core / Services"
Body: "Comprehensive maintenance solutions for Robinson and Guimbal helicopters,
delivered by factory-trained engineers using genuine parts."
```

---

### SECTION 7: Services Grid (9 Cards)
**Layout:** 3×3 CSS Grid
**Gap:** 1px (border effect)
**Border radius:** 8px
**Max-width:** 900px

**Card Structure:**
```jsx
<div className="maint-services__card">
  <span className="maint-services__num">01</span>
  <div className="maint-services__text">
    <h4>50-Hour Inspections</h4>
    <p>Routine checks to maintain airworthiness</p>
  </div>
</div>
```

**Services:**
| # | Title | Description |
|---|-------|-------------|
| 01 | 50-Hour Inspections | Routine checks to maintain airworthiness |
| 02 | 100-Hour Inspections | Comprehensive scheduled maintenance |
| 03 | Annual Inspections | Full yearly airworthiness review |
| 04 | 2200-Hour Overhauls | Complete engine and component overhaul |
| 05 | Component Repairs | Expert repair of all aircraft systems |
| 06 | Avionics Services | Navigation, communication, and display systems |
| 07 | Pre-Purchase Inspections | Thorough evaluation before aircraft purchase |
| 08 | AOG Support | Emergency Aircraft on Ground assistance |
| 09 | Refurbishment | Interior and exterior restoration |

**Styling:**
- Number: 44px × 44px black square, white text, Share Tech Mono
- Card: white background, 1.5rem padding
- Hover: translateY(-3px)

---

### SECTION 8: Services Included Badge
**Layout:** Centered flex
**Styling:** White background, 1px border, border-radius 4px

**Content:**
```
"All Services" + Badge: "GENUINE PARTS" (green accent)
```

---

### SECTION 9: Parallax Break — Engineer Close-Up
**Height:** 400px
**Image:** /assets/images/facility/engineer-working.jpg (or similar)
**Large text:** "EXPERTISE"

---

### SECTION 10: Certifications Header
**Background:** #faf9f6
**Content:**
```
Pre-text: "Approved & Certified"
Headline (gradient): "Industry / Leading / Standards"
```

---

### SECTION 11: EASA Part 145 Feature
**Layout:** Two-column grid (1fr 1fr)
**Gap:** 3rem

**Left Column:**
- Large EASA certification image/badge
- Official approval number

**Right Column:**
```
Headline: "EASA Part 145 Maintenance Organisation"
Body: "HQ Aviation operates a fully EASA Part 145 approved maintenance facility
at Denham Aerodrome. This certification represents the highest European standard
for aircraft maintenance, ensuring every procedure meets rigorous safety and
quality requirements."
List:
- Approved maintenance procedures
- Quality management system
- Continuous airworthiness management
- Trained and qualified personnel
```

---

### SECTION 12: Robinson Authorized Section
**Layout:** Two-column (reversed)
**Background:** #ffffff

**Left Column:**
```
Pre-text: "Factory Authorized"
Headline: "Robinson Helicopter Company Authorized Service Centre"
Body: "As a Robinson Authorized Service Centre, we are approved to perform
all maintenance, repairs, and overhauls on R22, R44, and R66 helicopters.
Our technicians complete regular factory training at Robinson's California
facility."
```

**Right Column:**
- Robinson Authorized badge (large)
- "Since 1990" label

---

### SECTION 13: Guimbal Certification
**Layout:** Two-column
**Background:** #faf9f6

**Content:**
```
Pre-text: "Certified Centre"
Headline: "Guimbal Cabri G2 Service Centre"
Body: "We are proud to be one of the UK's certified Guimbal Cabri G2 service
centres. The Cabri G2 has become increasingly popular for training, and our
technicians have completed comprehensive factory training to support this
modern helicopter."
```

---

### SECTION 14: Certification Badges Strip
**Background:** #ffffff
**Layout:** Flex, justify-content: center, gap: 3rem
**Padding:** 3rem

**Badges:**
- EASA logo
- Robinson Authorized logo
- Guimbal logo
- CAA logo

**Styling:** Grayscale, opacity 0.7, hover: full color, opacity 1

---

### SECTION 15: Parallax Break — Aircraft Types
**Height:** 400px
**Image:** /assets/images/facility/hq-aviation-robinsons.jpg
**Large text:** "FLEET"

---

### SECTION 16: Aircraft Types Header
**Content:**
```
Pre-text: "Supported Aircraft"
Headline (gradient): "Robinson / & / Guimbal"
Body: "We provide full maintenance support for the complete Robinson range
and Guimbal Cabri G2."
```

---

### SECTION 17: Aircraft Cards Grid
**Layout:** 4-column grid
**Gap:** 1.5rem

**Aircraft:**
| Model | Image | Notes |
|-------|-------|-------|
| Robinson R22 | /assets/images/new-aircraft/r22-beta.webp | Beta II, all variants |
| Robinson R44 | /assets/images/new-aircraft/r44-raven.webp | Raven, Cadet, Clipper |
| Robinson R66 | /assets/images/new-aircraft/r66-turbine.webp | Turbine expertise |
| Guimbal Cabri G2 | /assets/images/new-aircraft/cabri-g2.webp | Certified centre |

**Card Structure:**
- Image (aspect-ratio 4/3, border-radius 8px)
- Model name (bold, uppercase)
- Notes (muted text)
- Left border accent (3px #1a1a1a)

---

### SECTION 18: Chief Engineer Profile
**Layout:** Featured card (like FinalPPL Quentin card)
**Background:** #faf9f6
**Max-width:** 600px centered

**Content:**
```
Image: Chief Engineer photo (100px × 100px)
Name: "David Cross"
Title: "Chief Engineer"
Stats:
  - 30+ Years Experience
  - 500+ Overhauls Completed
Bio: "David has been with HQ Aviation since 1995 and leads our team of
factory-trained engineers. His expertise spans the complete Robinson range
and Guimbal aircraft."
```

**Styling:**
- Left border 3px #1a1a1a
- Stats with animated counters
- Divider between stats

---

### SECTION 19: Engineering Team Grid
**Layout:** Flex wrap, centered
**Gap:** 0.5rem

**Team Members:**
| Name | Role |
|------|------|
| [Engineer 1] | Licensed Engineer |
| [Engineer 2] | Licensed Engineer |
| [Engineer 3] | Avionics Specialist |
| [Apprentice] | Engineering Apprentice |

**Card Structure:** Compact (like FinalPPL instructor list)
- Name (0.75rem, bold)
- Role (0.6rem, muted)
- Left border accent

---

### SECTION 20: Parallax Break — Precision Work
**Height:** 400px
**Image:** Close-up of precision measurement/tooling
**Large text:** "PRECISION"

---

### SECTION 21: Inspection Deep Dive
**Layout:** Sticky scroll (like FinalWhyFlyAHelicopter)
**Height:** 300vh (3 inspection types worth of scroll)

**Left Panel (sticky):**
```
Background: #1a1a1a
Content:
  - Number (01, 02, 03) with dividers
  - "INSPECTIONS" title
  - Current inspection type
  - Progress dots
```

**Right Panel (scrolling):**
Three scroll sections:

**50-Hour:**
```
Title: "50-Hour Inspection"
Description: "A routine inspection ensuring all critical systems are
functioning correctly. Ideal for aircraft in regular use."
Details:
  - Duration: 1-2 days
  - Checks: Engine, transmission, controls, fluid levels
  - Documentation: Full compliance report
```

**100-Hour:**
```
Title: "100-Hour Inspection"
Description: "Comprehensive scheduled maintenance required for commercial
operations and recommended for private use."
Details:
  - Duration: 2-3 days
  - Checks: All 50-hour items plus deeper inspection
  - Documentation: Maintenance release certificate
```

**Annual:**
```
Title: "Annual Inspection"
Description: "Complete airworthiness review required yearly regardless of
flight hours."
Details:
  - Duration: 3-5 days
  - Checks: Full aircraft inspection, AD compliance
  - Documentation: Annual airworthiness certificate
```

---

### SECTION 22: Overhaul Section
**Layout:** Two-column
**Background:** #ffffff

**Left Column:**
```
Pre-text: "Major Service"
Headline: "2200-Hour Overhaul"
Body: "At 2200 hours, Robinson helicopters require a complete overhaul.
This is a comprehensive process involving disassembly, inspection, repair,
and reassembly of major components."
Timeline: "Typically 4-6 weeks"
```

**Right Column:**
- Image of overhaul process
- Or component breakdown visual

**Features List:**
- Engine overhaul
- Transmission rebuild
- Rotor system inspection
- Complete documentation

---

### SECTION 23: Component Services Accordion
**Layout:** Single column, max-width 800px
**Style:** FAQ accordion (like FinalPPL)

**Items:**
| Component | Details |
|-----------|---------|
| Engine Components | Pistons, cylinders, crankshaft, bearings |
| Gearbox & Transmission | Main rotor gearbox, tail rotor gearbox |
| Rotor Systems | Main rotor blades, tail rotor, hub assemblies |
| Avionics | GPS, radios, transponders, displays |
| Electrical Systems | Wiring, alternators, batteries, lighting |

**Interaction:**
- Click to expand
- Number prefix (01-05)
- Plus/minus toggle

---

### SECTION 24: AOG Emergency Support
**Background:** #1a1a1a (dark)
**Padding:** 5rem 2rem

**Content:**
```
Pre-text: "24/7 Support"
Headline (white): "Aircraft On Ground"
Body: "When you need us most, we're here. Our AOG support ensures minimal
downtime for your aircraft with rapid response and expert diagnosis."
Phone: "+44 (0) 1234 567890" (large, mono)
CTA: "Emergency Contact" button (white)
```

**Features:**
- Rapid response commitment
- Mobile service capability
- Parts sourcing network

---

### SECTION 25: Refurbishment Showcase
**Layout:** Carousel (like FinalDraft training carousel)
**Background:** #faf9f6

**Slides:**
| Type | Description |
|------|-------------|
| Interior Refurbishment | Seats, carpets, panels, headliners |
| Exterior Paint | Custom schemes, touch-ups, full repaints |
| Avionics Upgrades | Modern displays, navigation systems |
| Corrosion Treatment | Prevention and repair |

**Structure:**
- Tabs at top
- Image left, content right
- Progress bar
- Prev/Next arrows

---

### SECTION 26: Turnaround & Pricing
**Layout:** Two-column with divider
**Background:** #ffffff

**Left: Turnaround Times**
```
Title: "Typical Turnaround"
50-Hour: 1-2 days
100-Hour: 2-3 days
Annual: 3-5 days
Overhaul: 4-6 weeks
AOG: Same day response
```

**Right: Pricing**
```
Title: "Transparent Pricing"
Body: "We provide detailed quotes for all work before commencement.
No hidden fees, no surprises."
CTA: "Request a Quote" button
```

---

### SECTION 27: Location & Facility
**Layout:** Like FinalPPL location section
**Background:** #faf9f6

**Content:**
```
Label: "Visit Us"
Headline: "Denham Aerodrome"
Map placeholder (180px height, grid pattern)
Description: "Our purpose-built maintenance facility offers modern workshops,
climate-controlled storage, and easy access from London."
```

**Details Grid (2 columns):**
```
Address:
  HQ Aviation
  Tilehouse Lane
  Denham, UB9 5DF

Getting Here:
  5 min from M40 J1
  20 min from M25 J16
  On-site parking
```

---

### SECTION 28: FAQ Section
**Layout:** Two-column (Location left, FAQ right) — but FAQ only version
**Style:** Accordion like FinalPPL

**Questions:**
| # | Question | Answer |
|---|----------|--------|
| 01 | How long does a 100-hour inspection take? | Typically 2-3 working days... |
| 02 | Do you provide loan aircraft? | We can arrange loan aircraft... |
| 03 | Can you collect my aircraft? | Yes, we offer ferry services... |
| 04 | What's included in an annual? | A complete airworthiness review... |
| 05 | Do you work on other helicopter types? | We specialize in Robinson and Guimbal... |
| 06 | What about warranty work? | As an authorized centre... |

---

### SECTION 29: CTA — Schedule Inspection
**Background:** #1a1a1a
**Layout:** Two-column (ticket left, content right)

**Ticket (like FinalPPL boarding pass):**
```
Header: HQ logo | SERVICE TICKET | MAINT
Route:
  AIRCRAFT → AIRWORTHY
  Current    Certified
Stub:
  TYPE: Inspection
  BAY: 01
  ETA: TBD
```

**Content:**
```
Pre-text: "Ready to Schedule?"
Headline (white): "Book Your Service"
Body: "Contact our maintenance team to discuss your requirements..."
Buttons:
  - "Contact Maintenance" (primary, white bg)
  - "Request Quote" (outline, white border)
```

---

### SECTION 30: Footer Minimal
**Component:** FooterMinimal (existing)
**Content:**
- HQ Aviation logo
- Coordinates
- Copyright
- Navigation links

---

## Technical Implementation

### File Structure
```
src/pages/Maintenance.jsx (new, replaces existing)
```

### Dependencies
- react-router-dom (Link)
- framer-motion (motion, useInView, useScroll, useTransform)
- Existing components: FooterMinimal

### CSS Approach
- Inline `<style>` tag (matching FinalPPL pattern)
- Class prefix: `.maint-`
- CSS custom properties for brand tokens

### Key Components to Create
1. `MaintenanceHeader` — Spotlight animation header
2. `Reveal` — Scroll-triggered reveal wrapper
3. `AnimatedNumber` — Counter animation
4. `ParallaxSection` — Reusable parallax image section
5. `ServiceCard` — Grid card for services
6. `AircraftCard` — Aircraft type card
7. `ProfileCard` — Team member card
8. `InspectionScroll` — Sticky scroll section
9. `ServiceTicket` — Boarding pass style CTA card
10. `Accordion` — FAQ accordion

### Responsive Breakpoints
- Desktop: > 1024px (full layout)
- Tablet: 768px - 1024px (2-column grids become 1-column)
- Mobile: < 768px (single column, hidden parallax images)

---

## Success Criteria

1. Visual consistency with FinalPPL, FinalWhyFlyAHelicopter, FinalDraft
2. All 30 sections implemented with proper animations
3. Responsive across all breakpoints
4. Performance: Smooth 60fps scroll animations
5. Accessibility: Proper heading hierarchy, focus states
6. All images optimized and lazy-loaded

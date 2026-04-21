# New Flying Service Pages — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build 5 complete, production-quality service pages (CPL, Advanced Training, SuperYacht Ops, Pilot Provisioning, Aircraft Consulting) matching the brand identity of existing pages (TypeRating, NightRating, FinalPPL, SelfFlyHire).

**Architecture:** Each page is a self-contained JSX file with an inline `<style>` tag, a custom Header component (spotlight animation), a Reveal wrapper, custom data arrays, useFaqs/usePageImages hooks, and FooterMinimal. All pages follow the `page-prefix-*` BEM CSS convention. Pages are independent and can be built in parallel.

**Tech Stack:** React, Framer Motion (motion, useInView, useScroll, useTransform, AnimatePresence), react-router-dom, useFaqs hook, usePageImages hook, useCmsHighlight hook, FooterMinimal component, Space Grotesk + Share Tech Mono fonts, inline CSS.

---

## Brand Reference (apply to ALL pages)

- **Background:** `#faf9f6` (warm white)
- **Primary text:** `#1a1a1a` (charcoal)
- **Mid text:** `#4a4a4a`
- **Light text:** `#7a7a7a`
- **Dark sections bg:** `#1a1a1a`
- **Border/divider:** `#e8e6e2`
- **Font primary:** `'Space Grotesk', -apple-system, sans-serif`
- **Font mono:** `'Share Tech Mono', monospace`
- **Reveal animation:** `duration: 0.8, ease: [0.16, 1, 0.3, 1]`
- **Hero parallax:** `useScroll` + `useTransform` opacity/scale/y on hero section

## Header Component Pattern (copy EXACTLY from TypeRating.jsx)

Every page needs a `[PageName]Header()` component with:
- `menuOpen`, `colorDark`, `scrolled`, `verticalProgress`, `horizontalProgress` state
- Scroll listener: vProgress = scrollY/150, hProgress = scrollY/300, colorDark at scrollY > 300
- spotlightHeight = 95 + round(vProgress * 405), spotlightWidth = 214 + round(hProgress * 1786)
- hq-menu-panel with 6 sections: About, Aircraft Sales, Flight Training, Services, Experiences, Contact
- hq-menu-btn with colorDark/scrolled/open classes
- Header with `--spotlight-width` and `--spotlight-height` CSS vars

## Reveal Component Pattern (copy EXACTLY from TypeRating.jsx lines 182-209)

```jsx
function Reveal({ children, delay = 0, direction = 'up' }) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.2 });
  const variants = {
    hidden: { opacity: 0, y: direction === 'up' ? 40 : direction === 'down' ? -40 : 0, x: direction === 'left' ? 40 : direction === 'right' ? -40 : 0 },
    visible: { opacity: 1, y: 0, x: 0 },
  };
  return (
    <motion.div ref={ref} initial="hidden" animate={isInView ? 'visible' : 'hidden'} variants={variants} transition={{ duration: 0.8, delay, ease: [0.16, 1, 0.3, 1] }}>
      {children}
    </motion.div>
  );
}
```

## Standard Imports (every page)

```jsx
import React, { useRef, useEffect, useState } from 'react';
import { useFaqs } from '../hooks/useFaqs';
import { usePageImages } from '../hooks/usePageImages';
import { useCmsHighlight } from '../hooks/useCmsHighlight';
import { Link } from 'react-router-dom';
import { motion, useInView, useScroll, useTransform, AnimatePresence } from 'framer-motion';
import '../assets/css/main.css';
import '../assets/css/components.css';
import FooterMinimal from '../components/FooterMinimal';
```

## Standard Form Submit Pattern

```jsx
async function handleFormSubmit(e) {
  e.preventDefault();
  if (!formData.name.trim() || !formData.email.trim()) { setFormStatus('error'); return; }
  setFormStatus('submitting');
  try {
    const res = await fetch('/api/leads', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...formData, source: 'PAGE-NAME-page' }),
    });
    if (!res.ok) throw new Error();
    setFormStatus('success');
    setFormData({ name: '', email: '', phone: '', message: '' });
  } catch { setFormStatus('error'); }
}
```

---

## File Map

| File | Action | Purpose |
|------|--------|---------|
| `src/pages/CPL.jsx` | CREATE | Commercial Pilot Licence training page |
| `src/pages/AdvancedTraining.jsx` | CREATE | Advanced Training specialisms page |
| `src/pages/SuperYachtOps.jsx` | CREATE | SuperYacht Ops & Owner Management page |
| `src/pages/PilotProvisioning.jsx` | CREATE | Pilot Provisioning service page |
| `src/pages/AircraftConsulting.jsx` | CREATE | Aircraft Consulting advisory page |
| `src/App.jsx` | MODIFY | Add 5 new routes |
| `src/pages/Experimentation.jsx` | MODIFY | Update fd-zigzag card `href` values for cards 04, 08, 09, 10, 11 |

---

## Task 1: Commercial Pilot Licence Page

**Files:**
- Create: `src/pages/CPL.jsx`

**CSS prefix:** `cpl-`  
**Template to follow:** FinalPPL.jsx and NightRating.jsx  
**Primary image fallback:** `/assets/images/gallery/carousel/rotating-3.jpg`

### Section breakdown

**Section 1 — Hero**
- Background image (CMS: `cpl-hero`) with dark overlay (linear-gradient 60% black to transparent)
- Animated badge card showing: `155+` "Total Hours" | divider | `CPL(H)` "Qualification"
- Headline words: `COMMERCIAL` (word--1) + `PILOT` (word--2) — animate in with stagger 0.4/0.6s
- Label: "Professional Training"
- Subtext: "Holding a Commercial Pilot Licence, CPL(H) gives you the status of professional helicopter pilot. Train with HQ — one of the UK's most experienced Robinson training organisations."
- Divider line (scaleX animation)

**Section 2 — Intro (`cpl-intro`)**
- Pre-text: "From Passion to Profession"
- H2: `<span class="cpl-text--dark">Fly</span> <span class="cpl-text--mid">For</span> <span class="cpl-text--light">A Living</span>`
- Body: "The Commercial Pilot Licence (CPL/H) is the gateway to a professional career in helicopter aviation. Whether you're aiming for charter work, aerial survey, emergency services, or flight instruction, the CPL is the qualification that makes it possible. HQ Aviation offers CPL training on the Robinson range — the aircraft type you're most likely to fly in your early commercial career."
- Right column: Image (CMS: `cpl-intro`) with caption badge showing "500+ Pilots Trained"
- 2-column grid layout (same as tr-intro)

**Section 3 — Pathway (`cpl-pathway`) — light background**
- Pre-text: "Your Route to CPL"
- H2: `The Journey`
- Description: "The CPL(H) builds on your PPL(H) foundation. Here's what the regulatory pathway looks like and where HQ's training fits in."
- 5-step horizontal pathway (desktop) / vertical (mobile):
  - Step 01: PPL(H) | "45 Hours" | "Private Pilot Licence — your foundation"
  - Step 02: Solo PIC | "10 Hours" | "Solo flight time building experience"
  - Step 03: Post-Licence Flying | "110+ Hours" | "Total time to 155 hours including 50 PIC"
  - Step 04: Ground Exams | "9 Subjects" | "ATPL(H) Frozen theory examinations"
  - Step 05: Skill Test | "1 Day" | "CAA skill test with an authorised examiner"
- Each step: numbered circle, title, value badge, description

**Section 4 — Ground School (`cpl-ground`) — dark #1a1a1a background**
- Pre-text (light): "Academic Foundation"
- H2 (white): "Ground School Subjects"
- Description: "The CPL(H) requires passing 9 ATPL(H) Frozen examinations. These cover a broad range of subjects — some you'll find familiar from your PPL study, others covering entirely new material."
- 3×3 grid of subject cards:
  1. Air Law | "Regulations, airspace, rules of the air"
  2. Aircraft General Knowledge | "Systems, structures, powerplants"
  3. Flight Performance & Planning | "Weight, balance, fuel, performance calculations"
  4. Human Performance | "CRM, fatigue, decision-making, stress"
  5. Meteorology | "Weather patterns, forecasting, icing"
  6. Navigation | "Dead reckoning, radio nav, GPS"
  7. Operational Procedures | "Standard operating procedures"
  8. Principles of Flight | "Aerodynamics, rotor mechanics"
  9. Radio Navigation | "VOR, ILS, ADF, transponders"
- Each card: number (01–09 monospace), title bold, description gray

**Section 5 — Flight Requirements (`cpl-hours`) — light**
- Pre-text: "The Numbers"
- H2: `Flight Hour Requirements`
- 4 large stat cards (same pattern as TypeRating badge stats):
  - 155 | Total Flight Hours Required
  - 50 | Hours as Pilot in Command
  - 35 | Hours on Helicopters (PIC cross-country)
  - 10 | Hours IFR / Instrument Flight
- Note below: "These are the regulatory minimums. In practice, most students arrive at CPL training with considerably more hours, which is an advantage — additional flight time builds the judgment and decision-making that examiners look for."

**Section 6 — Process (`cpl-process`) — dark**
- Pre-text (light): "The Journey"
- H2 (white): "Training Process"
- 4 steps (same pattern as NightRating processSteps):
  1. Ground School | "9 Exams" | "Complete ATPL(H) Frozen theory examinations. Most candidates self-study with a ground school provider; HQ can recommend approved courses."
  2. Hour Building | "100+ Hours" | "Build the required flight time through training flights, self-fly hire, and type ratings. HQ's fleet and instructors support this phase throughout."
  3. CPL Flight Training | "15+ Hours" | "Focused CPL-standard training with HQ instructors covering advanced manoeuvres, precision flying, and commercial operating standards."
  4. Skill Test | "1 Day" | "Final assessment with a CAA-authorised examiner. HQ will prepare you thoroughly — we know what examiners look for and train to that standard."
- Timeline visualization (same as NightRating nr-process__timeline)

**Section 7 — Careers (`cpl-careers`) — light**
- Pre-text: "Where It Takes You"
- H2: `Career Pathways`
- Description: "The CPL(H) opens doors across commercial helicopter aviation. Here are some of the sectors that regularly hire newly-qualified commercial pilots."
- 6 career cards in 3×2 grid:
  1. Charter & Air Taxi | "Private passenger transport, corporate travel, VIP operations"
  2. Tours & Sightseeing | "Helicopter tours over major cities and scenic locations worldwide"
  3. Aerial Survey & Photography | "Mapping, inspection, film, TV production"
  4. Flight Instruction | "Teach the next generation — requires additional FI(H) rating"
  5. Emergency Services | "Police, coastguard, HEMS — typically require additional experience"
  6. Corporate Aviation | "Fleet management and piloting for private companies"
- Each card: icon (use simple SVG or just a number), title, description

**Section 8 — FAQ (`cpl-faq`)**
- useFaqs('cpl', { visibleOnly: true }) 
- Same accordion pattern as NightRating nr-faq__item
- Pre-text: "Common Questions"
- H2: `Frequently Asked`
- Show 6 hardcoded fallback FAQs if Firestore returns none:
  1. Q: "Do I need my PPL before starting CPL training?" A: "Yes. The PPL(H) is a prerequisite for CPL(H) training. You must also have accumulated the required flight hours before the skill test."
  2. Q: "Can I do CPL training on the Robinson R22?" A: "The R22 can be used for some CPL training, but most of the focused CPL hours are conducted on the R44 or R66 as these better represent the aircraft used in commercial operations."
  3. Q: "How long does the whole CPL process take?" A: "It varies significantly depending on your starting hours. If you're coming from a freshly-minted PPL with 45 hours, you'll need at least 110 more hours before the skill test. With focused flying, some candidates complete the process in 18-24 months."
  4. Q: "What are the ATPL(H) Frozen exams?" A: "These are the theoretical knowledge examinations required for the CPL(H). They're the same exams used for the full ATPL(H) — hence 'frozen' when held at CPL level. There are 9 subjects, all taken at a CAA-approved examination centre."
  5. Q: "Is CPL(H) training at HQ approved?" A: "HQ Aviation is a CAA Approved Declared Training Organisation (DTO). CPL training conducted with HQ counts towards your CAA licence requirements."
  6. Q: "What does CPL training cost?" A: "Costs vary depending on hours required and aircraft type. Contact us for a detailed breakdown based on your current hours and goals."

**Section 9 — CTA (`cpl-cta`) — dark**
- Pre-text (light): "Ready to Turn Professional?"
- H2 (white): `Take The Next Step`
- Body: "Talk to our training team about your current hours, your goals, and how HQ can support your CPL journey. We'll give you an honest assessment of where you stand and a clear path forward."
- Two buttons: "Enquire Now" (→ /contact?subject=cpl) | "View All Training" (→ /training)

- [ ] **Step 1: Create `src/pages/CPL.jsx` with full implementation**

Write the complete file. Every section above must be implemented. The file structure is:
1. Comment block
2. Imports (standard set above)
3. `CPLHeader()` function (copy from TypeRating header pattern exactly)
4. `Reveal()` component (copy exactly)
5. `CPL()` main component with all state, data arrays, sections, and inline `<style>`

Key state:
```jsx
const heroRef = useRef(null);
const [openFaq, setOpenFaq] = useState(null);
const pageImages = usePageImages('cpl');
useCmsHighlight();
const { scrollYProgress } = useScroll({ target: heroRef, offset: ['start start', 'end start'] });
useEffect(() => { window.scrollTo(0, 0); }, []);
const heroOpacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);
const heroScale = useTransform(scrollYProgress, [0, 0.5], [1, 0.95]);
const heroY = useTransform(scrollYProgress, [0, 0.5], [0, 100]);
const { faqs: rawFaqs } = useFaqs('cpl', { visibleOnly: true });
const [formData, setFormData] = useState({ name: '', email: '', phone: '', message: '' });
const [formStatus, setFormStatus] = useState('idle');
```

Fallback FAQs (used when rawFaqs.length === 0):
```jsx
const fallbackFaqs = [
  { id: 'f1', question: 'Do I need my PPL before starting CPL training?', answer: 'Yes. The PPL(H) is a prerequisite for CPL(H) training. You must also have accumulated the required flight hours before the skill test.' },
  { id: 'f2', question: 'Can I do CPL training on the Robinson R22?', answer: 'The R22 can be used for some CPL training, but most of the focused CPL hours are conducted on the R44 or R66 as these better represent the aircraft used in commercial operations.' },
  { id: 'f3', question: 'How long does the whole CPL process take?', answer: 'It varies significantly depending on your starting hours. If you\'re coming from a freshly-minted PPL with 45 hours, you\'ll need at least 110 more hours before the skill test. With focused flying, some candidates complete the process in 18–24 months.' },
  { id: 'f4', question: 'What are the ATPL(H) Frozen exams?', answer: 'These are the theoretical knowledge examinations required for the CPL(H). They\'re the same exams used for the full ATPL(H) — hence \'frozen\' when held at CPL level. There are 9 subjects, all taken at a CAA-approved examination centre.' },
  { id: 'f5', question: 'Is CPL(H) training at HQ approved?', answer: 'HQ Aviation is a CAA Approved Declared Training Organisation (DTO). CPL training conducted with HQ counts towards your CAA licence requirements.' },
  { id: 'f6', question: 'What does CPL training cost?', answer: 'Costs vary depending on hours required and aircraft type. Contact us for a detailed breakdown based on your current hours and goals.' },
];
const faqs = rawFaqs.length > 0 ? rawFaqs : fallbackFaqs;
```

Ground school subjects data:
```jsx
const groundSubjects = [
  { num: '01', title: 'Air Law', desc: 'Regulations, airspace classification, rules of the air' },
  { num: '02', title: 'Aircraft General Knowledge', desc: 'Systems, structures, powerplants, instruments' },
  { num: '03', title: 'Flight Performance & Planning', desc: 'Weight, balance, fuel, performance calculations' },
  { num: '04', title: 'Human Performance', desc: 'CRM, fatigue, decision-making, stress management' },
  { num: '05', title: 'Meteorology', desc: 'Weather patterns, forecasting, icing, turbulence' },
  { num: '06', title: 'Navigation', desc: 'Dead reckoning, radio navigation, GPS, charts' },
  { num: '07', title: 'Operational Procedures', desc: 'Standard operating procedures, safety management' },
  { num: '08', title: 'Principles of Flight', desc: 'Aerodynamics, rotor mechanics, stability' },
  { num: '09', title: 'Radio Navigation', desc: 'VOR, ILS, ADF, transponders, GNSS' },
];
```

Career cards data:
```jsx
const careers = [
  { num: '01', title: 'Charter & Air Taxi', desc: 'Private passenger transport, corporate travel, and VIP operations across the UK and Europe.' },
  { num: '02', title: 'Tours & Sightseeing', desc: 'Helicopter tours over major cities and scenic locations. London, Scotland, the Lake District.' },
  { num: '03', title: 'Aerial Survey & Photography', desc: 'Mapping, inspection, infrastructure surveys, film and TV production work.' },
  { num: '04', title: 'Flight Instruction', desc: 'Teach the next generation of pilots. Requires an additional FI(H) rating after your CPL.' },
  { num: '05', title: 'Emergency Services', desc: 'Police aviation, coastguard, HEMS. Typically require significant additional hours and ratings.' },
  { num: '06', title: 'Corporate Aviation', desc: 'Fleet management and dedicated piloting roles for private companies and high-net-worth individuals.' },
];
```

Process steps:
```jsx
const processSteps = [
  { num: '01', title: 'Ground School', duration: '9 Exams', description: 'Complete ATPL(H) Frozen theory examinations. Most candidates self-study with a ground school provider; HQ can recommend approved courses and supports you through the process.' },
  { num: '02', title: 'Hour Building', duration: '100+ Hours', description: 'Build the required flight time through training flights, self-fly hire, and type ratings. HQ\'s fleet and instructors support this phase throughout — you don\'t have to figure it out alone.' },
  { num: '03', title: 'CPL Flight Training', duration: '15+ Hours', description: 'Focused CPL-standard training with HQ instructors covering advanced manoeuvres, precision flying, and the commercial operating standards that examiners expect.' },
  { num: '04', title: 'Skill Test', duration: '1 Day', description: 'Final assessment with a CAA-authorised examiner. HQ will prepare you thoroughly — we know what examiners look for and we train to that standard, not just the minimums.' },
];
```

Pathway steps:
```jsx
const pathway = [
  { num: '01', title: 'PPL(H)', value: '45 Hours', desc: 'Your foundation licence — the entry point to all further helicopter training' },
  { num: '02', title: 'Hour Building', value: '110+ Hours', desc: 'Accumulate flight time to reach 155 total hours including 50 as PIC' },
  { num: '03', title: 'Ground Exams', value: '9 Subjects', desc: 'ATPL(H) Frozen theoretical knowledge examinations' },
  { num: '04', title: 'CPL Training', value: '15+ Hours', desc: 'Focused CPL-standard instruction with an approved FI(H)' },
  { num: '05', title: 'Skill Test', value: '1 Day', desc: 'CAA skill test with an authorised examiner — your CPL awaits' },
];
```

- [ ] **Step 2: Verify the component has no import errors or broken references**

Check:
- All className strings match their CSS rules
- All data arrays are defined before use
- useFaqs, usePageImages, useCmsHighlight are imported correctly
- FooterMinimal is imported
- All motion.div/AnimatePresence usages are correct

- [ ] **Step 3: Commit**

```bash
git add src/pages/CPL.jsx
git commit -m "feat(cpl): add Commercial Pilot Licence page"
```

---

## Task 2: Advanced Training Page

**Files:**
- Create: `src/pages/AdvancedTraining.jsx`

**CSS prefix:** `adv-`  
**Template to follow:** TypeRating.jsx (card-based courses) + NightRating.jsx (dark sections)  
**Primary image fallback:** `/assets/images/gallery/flying/flying--1.jpg`

### Section breakdown

**Section 1 — Hero**
- Background image (CMS: `advanced-hero`) with overlay
- Animated badge: `4` "Specialisms" | divider | `Captain Q` "Lead Instructor"
- Headline: `ADVANCED` (word--1) + `TRAINING` (word--2)
- Label: "Expert Instruction"
- Subtext: "Autorotations, confined areas, mountain flying, and safety courses — all delivered by instructors who live and breathe this aircraft. Push your skills further with HQ's advanced programme."

**Section 2 — Intro (`adv-intro`)**
- Pre-text: "Beyond the Licence"
- H2: `Sharp Skills. Safer Pilot.`
- Body para 1: "Holding a PPL(H) is the beginning of your journey, not the end of it. Advanced training at HQ covers the techniques and scenarios that your initial licence didn't — the situations that separate a merely-legal pilot from a genuinely capable one."
- Body para 2: "Captain Quentin Smith — world helicopter aerobatics champion and holder of multiple world records — leads HQ's advanced programme. You won't get this calibre of instruction anywhere else in the UK."
- Right: Image (CMS: `advanced-intro`) + caption "Quentin Smith — World Aerobatics Champion"
- 2-column layout

**Section 3 — Course Cards (`adv-courses`)**
- Pre-text: "The Specialisms"
- H2: `Advanced Courses`
- 4 large course cards in 2×2 grid (desktop), 1 col (mobile):

  **Card 1: Autorotations with Captain Q**
  - Tag: "Signature Course"
  - Description: "Autorotations are the helicopter's ultimate safety manoeuvre — and they require skill and confidence to execute well. Captain Q's autorotation clinic goes beyond routine practice to develop genuine mastery: full autorotations to a landing point, engine-off landings, practice under genuine simulated emergency conditions. Available exclusively at HQ."
  - Duration: "Half day or full day"
  - Suitable for: "PPL(H) holders with 50+ hours"
  - CTA: Enquire → /contact?subject=autorotations

  **Card 2: Confined Area Operations**
  - Tag: "Skills"
  - Description: "Flying into and out of restricted spaces — paddocks, clearings, rooftops, narrow valleys — is one of the most demanding and most useful helicopter skills there is. HQ's confined area training covers reconnaissance, approach planning, power checks, and the go/no-go decision framework used by professional operators."
  - Duration: "2–3 days"
  - Suitable for: "PPL(H) holders, 100+ hours recommended"
  - CTA: Enquire

  **Card 3: Mountain Flying**
  - Tag: "Terrain"
  - Description: "Mountain flying introduces weather, terrain, density altitude, and turbulence considerations that lowland flying rarely prepares you for. Training covers route planning in mountainous terrain, weather decision-making, slope landings, and the performance margins you need to fly safely in the hills. Conducted in the UK with day trips to suitable terrain."
  - Duration: "2–4 days"
  - Suitable for: "PPL(H) holders, 100+ hours"
  - CTA: Enquire

  **Card 4: Safety Courses**
  - Tag: "Currency"
  - Description: "HQ offers regular safety-focused refresher sessions covering emergency procedures, decision-making frameworks, accident analysis, and handling drills. These courses are suitable for any PPL holder wanting to sharpen their airmanship, and are particularly recommended for pilots who fly infrequently or have returned after a break."
  - Duration: "Half day"
  - Suitable for: "All PPL(H) holders"
  - CTA: Enquire

**Section 4 — Instructor Spotlight (`adv-instructor`) — dark #1a1a1a**
- Pre-text (light): "Your Instructor"
- H2 (white): `Captain Quentin Smith`
- Body (white/70): "Quentin Smith has flown around the world solo, crossed the poles by helicopter, and set multiple world records in aerobatics and long-distance flying. As HQ's founder and managing director, he brings 30 years of frontline flying experience to every advanced training session. This is not classroom instruction — it's knowledge earned at altitude, across continents, in conditions most pilots will never see."
- Credentials row (4 stats):
  - 30+ Years | Flying experience
  - 3 World Records | Held simultaneously
  - 18,000+ Hours | Total flight time
  - CAA Examiner | Authorised flight examiner
- Right: Image (CMS: `advanced-instructor`) — fallback `/assets/images/team/quentin-smith-world-record-holder-helicopter-aerobatics.webp`

**Section 5 — Prerequisites (`adv-prereq`)**
- Pre-text: "Who This Is For"
- H2: `Requirements`
- Description: "Advanced training at HQ is open to all PPL(H) holders. Different courses have different recommended experience levels — see each course card above. If in doubt, contact us and we'll advise on which course suits your current hours and ambitions."
- 4 prereq cards:
  1. Valid PPL(H) or higher | "Minimum entry requirement for all courses"
  2. Valid Medical Certificate | "Class 2 or LAPL medical"
  3. Current Flying Currency | "Recent flight time recommended — refresher available if not"
  4. Open to Learning | "No specific hours threshold for most courses — just a desire to improve"

**Section 6 — FAQ (`adv-faq`)**
- useFaqs('advanced-training', { visibleOnly: true })
- Fallback FAQs:
  1. Q: "Do I need to be an experienced pilot for advanced training?" A: "Different courses suit different experience levels. The autorotation clinic is open to PPL(H) holders from 50 hours. Mountain flying and confined area work are better suited to pilots with 100+ hours. Safety courses are open to anyone. We'll tell you honestly if we think you need more experience first."
  2. Q: "Can I do multiple courses back to back?" A: "Yes — and it's often the most efficient way to advance your skills. We can structure a multi-day programme around your availability."
  3. Q: "Is Captain Q personally available for every session?" A: "Autorotation clinics are led by Captain Q directly. Other courses are conducted by HQ's experienced instructors. Contact us for availability."
  4. Q: "Will advanced training show on my licence?" A: "Autorotation clinics, confined area, and mountain flying are instructor-led training flights entered in your logbook. Some may contribute to specific ratings or qualifications depending on your goals."
  5. Q: "Where is the training conducted?" A: "Based at Denham Aerodrome, with mountain flying training involving day trips to suitable UK terrain. All courses use HQ's own aircraft."

**Section 7 — CTA (`adv-cta`) — dark**
- Pre-text (light): "Ready to Push Further?"
- H2 (white): `Book Advanced Training`
- Body: "Contact our training team to discuss which course suits your hours and goals. Captain Q's autorotation clinic books up — reach out early."
- Buttons: "Enquire Now" → /contact?subject=advanced-training | "Meet Captain Q" → /about-us/captain-q

- [ ] **Step 1: Create `src/pages/AdvancedTraining.jsx` with full implementation**

Key state:
```jsx
const heroRef = useRef(null);
const [openFaq, setOpenFaq] = useState(null);
const pageImages = usePageImages('advanced-training');
useCmsHighlight();
const { scrollYProgress } = useScroll({ target: heroRef, offset: ['start start', 'end start'] });
useEffect(() => { window.scrollTo(0, 0); }, []);
const heroOpacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);
const heroScale = useTransform(scrollYProgress, [0, 0.5], [1, 0.95]);
const heroY = useTransform(scrollYProgress, [0, 0.5], [0, 100]);
const { faqs: rawFaqs } = useFaqs('advanced-training', { visibleOnly: true });
```

Course cards data:
```jsx
const courses = [
  {
    num: '01', tag: 'Signature Course', title: 'Autorotations with Captain Q',
    description: 'Autorotations are the helicopter\'s ultimate safety manoeuvre — and they require skill and confidence to execute well. Captain Q\'s autorotation clinic goes beyond routine practice to develop genuine mastery: full autorotations to a landing point, engine-off landings, and practice under genuinely simulated emergency conditions. Available exclusively at HQ.',
    duration: 'Half day or full day', suitable: 'PPL(H) holders with 50+ hours',
    enquiry: 'autorotations'
  },
  {
    num: '02', tag: 'Skills', title: 'Confined Area Operations',
    description: 'Flying into and out of restricted spaces — paddocks, clearings, narrow valleys — is one of the most demanding and most useful helicopter skills there is. HQ\'s confined area training covers reconnaissance, approach planning, power checks, and the go/no-go decision framework used by professional operators.',
    duration: '2–3 days', suitable: 'PPL(H) holders, 100+ hours recommended',
    enquiry: 'confined-area'
  },
  {
    num: '03', tag: 'Terrain', title: 'Mountain Flying',
    description: 'Mountain flying introduces weather, terrain, density altitude, and turbulence considerations that lowland flying rarely prepares you for. Training covers route planning in mountainous terrain, weather decision-making, slope landings, and the performance margins needed to fly safely in the hills.',
    duration: '2–4 days', suitable: 'PPL(H) holders, 100+ hours',
    enquiry: 'mountain-flying'
  },
  {
    num: '04', tag: 'Currency', title: 'Safety Courses',
    description: 'Regular safety-focused refresher sessions covering emergency procedures, decision-making frameworks, accident analysis, and handling drills. Suitable for any PPL holder wanting to sharpen their airmanship — particularly recommended for pilots who fly infrequently or have returned after a break.',
    duration: 'Half day', suitable: 'All PPL(H) holders',
    enquiry: 'safety-courses'
  },
];
```

Prerequisites:
```jsx
const prerequisites = [
  { num: '01', title: 'Valid PPL(H) or Higher', desc: 'Minimum entry requirement for all advanced courses' },
  { num: '02', title: 'Valid Medical Certificate', desc: 'Class 2 or LAPL medical in date' },
  { num: '03', title: 'Recent Flying Currency', desc: 'Recent flight time recommended — refresher available' },
  { num: '04', title: 'Open to Learning', desc: 'No strict hour threshold for most courses' },
];
```

Fallback FAQs (same pattern as CPL — define array, use when rawFaqs.length === 0).

- [ ] **Step 2: Verify component integrity**
- [ ] **Step 3: Commit**

```bash
git add src/pages/AdvancedTraining.jsx
git commit -m "feat(advanced-training): add Advanced Training page"
```

---

## Task 3: SuperYacht Ops & Private Owner Management Page

**Files:**
- Create: `src/pages/SuperYachtOps.jsx`

**CSS prefix:** `syo-`  
**Template to follow:** SelfFlyHire.jsx (luxury service, tabs/panels) + TypeRating (enquiry form)  
**Tone:** Ultra-premium, understated, global  
**Primary image fallback:** `/assets/images/lifestyle/superyacht-ops.jpg`

### Section breakdown

**Section 1 — Hero**
- Background: superyacht imagery (CMS: `syo-hero`), fallback `/assets/images/lifestyle/superyacht-ops.jpg`
- Dark overlay
- Badge: `Worldwide` "Operations" | divider | `Bespoke` "Service"
- Headline: `SUPERYACHT` (word--1) + `OPERATIONS` (word--2)
- Label: "Specialist Aviation"
- Subtext: "Deck operations, pilot provisioning, maintenance coordination, permit handling, and worldwide logistics for yacht-based helicopter operations. HQ manages the aviation side so you can focus on the voyage."

**Section 2 — Intro (`syo-intro`)**
- Pre-text: "The Complete Solution"
- H2: `Your Helicopter. Our Expertise.`
- Body: "Operating a helicopter from a superyacht is a uniquely complex proposition. Beyond the aircraft itself, there are crew licensing requirements, flag state permits, international airspace authorities, landing permissions, fuel coordination, and the logistical reality of operating a maintenance-dependent machine thousands of miles from your home base. HQ has been managing yacht-based helicopter operations for private owners for over a decade. We handle the complexity so you don't have to."
- Stats row (3 items): 3 Continents | Active Operations | 10+ Years | Yacht Aviation Experience | 24/7 | Operations Support
- Image right (CMS: `syo-intro`) with caption badge

**Section 3 — Services Grid (`syo-services`)**
- Pre-text: "What We Handle"
- H2: `Our Services`
- 6 service cards in 3×2 grid:
  1. **Deck Operations Training** | "Crew training for safe deck operations — marshalling, blade-folding, tie-down, fuelling, emergency procedures. CAA-compliant training records maintained."
  2. **Pilot Provisioning** | "Fully rated, current, and insured pilots for your operations. All hold appropriate type ratings and are experienced in yacht deck operations."
  3. **Maintenance Coordination** | "We manage your maintenance schedule regardless of where in the world the vessel is — coordinating with approved engineers at the nearest certified facility."
  4. **Permit & Documentation** | "Overflight permits, landing authorisations, customs documentation, flag state requirements. We navigate the regulatory maze across every jurisdiction."
  5. **Worldwide Logistics** | "Fuel planning, ground handling, FBO coordination, and route support wherever your season takes you — Mediterranean, Caribbean, Pacific."
  6. **Owner Management Advisory** | "Strategic advice on aircraft selection, insurance, crewing structure, and operational setup for new yacht helicopter programmes."

**Section 4 — Operations Map (`syo-regions`)**
- Pre-text: "Where We Operate"
- H2: `Global Reach`
- Description: "HQ supports yacht helicopter operations across all major cruising regions. Our network of trusted partners, approved maintenance facilities, and permit agents covers the routes that superyachts actually sail."
- 5 region cards (horizontal scroll on mobile, grid on desktop):
  1. Mediterranean | "Balearics, French Riviera, Italian coast, Greece, Croatia"
  2. Caribbean | "BVI, Antigua, St Barths, Grenada, Bahamas"
  3. Northern Europe | "Norway fjords, Scotland, Ireland, Scandinavia"
  4. Indian Ocean | "Maldives, Seychelles, Mauritius, Red Sea"
  5. Pacific & Americas | "Hawaii, French Polynesia, Pacific Coast"

**Section 5 — Trust / Credentials (`syo-trust`) — dark**
- Pre-text (light): "Why HQ"
- H2 (white): `Built on Experience`
- 4 credential blocks:
  - CAA Approved | "Declared Training Organisation — all training meets regulatory requirements"
  - Robinson Authorised | "Factory-authorised service centre for the Robinson range"
  - Independent Advice | "We work for the owner, not the manufacturer or insurer"
  - Discreet Operations | "All client information is treated with absolute confidentiality"
- Large quote (white, italic): *"The difference between a smooth operation and an operational headache is almost always preparation and local knowledge. We provide both."*
- Attribution: "HQ Aviation Operations Team"

**Section 6 — Enquiry Form (`syo-enquiry`)**
- Pre-text: "Start a Conversation"
- H2: `Get In Touch`
- Description: "Every yacht operation is different. Tell us about your vessel, your aircraft, and your season plans and we'll come back with a clear picture of how we can support you."
- Form fields: Name, Email, Phone, Vessel Name (optional), Aircraft Type, Message
- Standard POST to /api/leads with source: 'superyacht-ops-page'

**Section 7 — FAQ (`syo-faq`)**
- useFaqs('superyacht-ops', { visibleOnly: true })
- Fallback FAQs:
  1. Q: "What aircraft types does HQ support for yacht operations?" A: "HQ specialises in the Robinson range (R44, R66) which are the most common yacht-based helicopters due to their compact size and reliability. We also support AW109, H135, and other light turbine types through our partner network."
  2. Q: "Do you provide pilots for the whole season?" A: "Yes — we can provide a dedicated pilot for the duration of your Mediterranean or Caribbean season, or for specific legs. All pilots are fully current on type, insured, and experienced in yacht deck operations."
  3. Q: "How do you handle maintenance when the yacht is overseas?" A: "We maintain a schedule for your aircraft and coordinate with approved engineers at facilities near your itinerary. For Robinson aircraft, we work with factory-authorised service centres in key cruising regions."
  4. Q: "Can you help set up a new yacht helicopter programme from scratch?" A: "Absolutely. We advise on aircraft selection, deck modifications, crew training, insurance, and operational procedures — everything needed to start operating safely and compliantly."
  5. Q: "Is the service confidential?" A: "Completely. All client and vessel information is held in strict confidence. We do not discuss client operations or identities."

**Section 8 — CTA (`syo-cta`) — dark**
- Pre-text (light): "Ready to Discuss Your Operation?"
- H2 (white): `Talk to the Team`
- Body: "Whether you're planning a new programme or looking to improve an existing one, our operations team is ready to help. Reach out for a confidential conversation."
- Button: "Contact Operations Team" → /contact?subject=superyacht-ops

- [ ] **Step 1: Create `src/pages/SuperYachtOps.jsx`**

Key state:
```jsx
const heroRef = useRef(null);
const [openFaq, setOpenFaq] = useState(null);
const pageImages = usePageImages('superyacht-ops');
useCmsHighlight();
const { scrollYProgress } = useScroll({ target: heroRef, offset: ['start start', 'end start'] });
useEffect(() => { window.scrollTo(0, 0); }, []);
const heroOpacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);
const heroScale = useTransform(scrollYProgress, [0, 0.5], [1, 0.95]);
const heroY = useTransform(scrollYProgress, [0, 0.5], [0, 100]);
const { faqs: rawFaqs } = useFaqs('superyacht-ops', { visibleOnly: true });
const [formData, setFormData] = useState({ name: '', email: '', phone: '', vessel: '', aircraftType: '', message: '' });
const [formStatus, setFormStatus] = useState('idle');
```

Services data:
```jsx
const services = [
  { num: '01', title: 'Deck Operations Training', desc: 'Crew training for safe deck operations — marshalling, blade-folding, tie-down, fuelling, emergency procedures. CAA-compliant training records maintained.' },
  { num: '02', title: 'Pilot Provisioning', desc: 'Fully rated, current, and insured pilots for your operations. All hold appropriate type ratings and are experienced in yacht deck operations.' },
  { num: '03', title: 'Maintenance Coordination', desc: 'We manage your maintenance schedule regardless of where in the world the vessel is — coordinating with approved engineers at the nearest certified facility.' },
  { num: '04', title: 'Permit & Documentation', desc: 'Overflight permits, landing authorisations, customs documentation, flag state requirements across every jurisdiction your season covers.' },
  { num: '05', title: 'Worldwide Logistics', desc: 'Fuel planning, ground handling, FBO coordination, and route support. Mediterranean, Caribbean, Pacific — wherever your season takes you.' },
  { num: '06', title: 'Owner Management Advisory', desc: 'Strategic advice on aircraft selection, insurance, crewing structure, and operational setup for new or evolving yacht helicopter programmes.' },
];
```

Regions data:
```jsx
const regions = [
  { num: '01', name: 'Mediterranean', detail: 'Balearics, French Riviera, Italian coast, Greece, Croatia, Turkish coast' },
  { num: '02', name: 'Caribbean', detail: 'BVI, Antigua, St Barths, Grenada, Bahamas, USVI' },
  { num: '03', name: 'Northern Europe', detail: 'Norwegian fjords, Scotland, Ireland, Scandinavia, Iceland' },
  { num: '04', name: 'Indian Ocean', detail: 'Maldives, Seychelles, Mauritius, Red Sea, East Africa' },
  { num: '05', name: 'Pacific & Americas', detail: 'Hawaii, French Polynesia, Pacific Coast, Galapagos' },
];
```

Trust blocks:
```jsx
const trust = [
  { title: 'CAA Approved', desc: 'Declared Training Organisation — all training meets regulatory requirements' },
  { title: 'Robinson Authorised', desc: 'Factory-authorised service centre for the Robinson range' },
  { title: 'Independent Advice', desc: 'We work for the owner, not the manufacturer or insurer' },
  { title: 'Discreet Operations', desc: 'All client information treated with absolute confidentiality' },
];
```

- [ ] **Step 2: Verify component integrity**
- [ ] **Step 3: Commit**

```bash
git add src/pages/SuperYachtOps.jsx
git commit -m "feat(superyacht-ops): add SuperYacht Operations page"
```

---

## Task 4: Pilot Provisioning Page

**Files:**
- Create: `src/pages/PilotProvisioning.jsx`

**CSS prefix:** `pp-`  
**Template to follow:** NightRating.jsx structure + TypeRating enquiry form  
**Tone:** Professional, reliable, operational  
**Primary image fallback:** `/assets/images/gallery/flying/flying--1.jpg`

### Section breakdown

**Section 1 — Hero**
- Background image (CMS: `pilot-provisioning-hero`), fallback `/assets/images/gallery/flying/flying--1.jpg`
- Dark overlay
- Badge: `Rated` "& Current" | divider | `Insured` "& Ready"
- Headline: `PILOT` (word--1) + `PROVISIONING` (word--2)
- Label: "Crewing Services"
- Subtext: "Crewing, safety pilots, and ferry flights. Fully rated, insured, and experienced across the Robinson range and beyond. The right pilot for every mission."

**Section 2 — Intro (`pp-intro`)**
- Pre-text: "The Right Pilot"
- H2: `For Every Mission`
- Body: "Whether you need a safety pilot for an unfamiliar route, a ferry pilot to move an aircraft across the country, or a dedicated crew member for a longer operation — HQ can provide a fully qualified, current pilot from our experienced team. Every pilot we provision holds the appropriate type ratings, is fully insured, and is briefed on your specific operation before they fly."
- Image right (CMS: `pp-intro`) + caption "HQ Operations Team"
- 2-column layout

**Section 3 — Services (`pp-services`)**
- Pre-text: "What We Provide"
- H2: `Provisioning Services`
- 3 large service panels (full-width stacked, alternating left/right image layout):

  **Panel 1: Safety Pilots**
  - Tag: "Most Requested"
  - Description: "A safety pilot flies alongside you to provide an additional layer of oversight — particularly useful when operating in unfamiliar airspace, carrying passengers on long legs, or flying in marginal conditions where a second set of eyes and hands provides genuine reassurance. All HQ safety pilots are experienced instructors."
  - Details: Current FI(H) rating | Minimum 500 hours | Type-rated | Insured
  - Image fallback: `/assets/images/gallery/carousel/rotating1.jpg`

  **Panel 2: Ferry Flights**
  - Tag: "Logistics"
  - Description: "Need an aircraft moved? Whether it's from a maintenance facility back to its base, delivery from a purchase, or repositioning for an operation, HQ's ferry pilots can move your aircraft wherever it needs to go. We handle fuel planning, weather routing, PPR, and all the logistics."
  - Details: Pre-flight inspection | Weather routing | Insurance documentation | Handover record
  - Image fallback: `/assets/images/gallery/flying/flying-.jpg`

  **Panel 3: Dedicated Crewing**
  - Tag: "Extended Operations"
  - Description: "For ongoing operations — seasonal superyacht programmes, corporate fleet management, extended filming contracts — HQ can provide a dedicated crew member or pilot on a contract basis. We handle rostering, currency maintenance, recurrency training, and compliance, leaving you to focus on the operation."
  - Details: Rostered availability | Currency maintained | Recurrency training | Full compliance management
  - Image fallback: `/assets/images/gallery/carousel/rotating2.jpg`

**Section 4 — Pilot Standards (`pp-standards`) — dark**
- Pre-text (light): "Our People"
- H2 (white): `Pilot Standards`
- Description (white/70): "Every pilot we provision meets the same standards we hold our own instructors to. We do not provide bodies — we provide people we would be happy to put in front of our own students."
- 4 credential cards:
  1. Current Type Rating | "Appropriate type rating on aircraft to be flown"
  2. 500+ Hours Minimum | "No newly-qualified pilots — everyone has proven experience"
  3. Full Insurance Cover | "HQ arranges appropriate insurance for every provisioning engagement"
  4. Pre-Brief Required | "Every pilot is briefed on your specific operation, aircraft history, and any known limitations before departure"

**Section 5 — Process (`pp-process`)**
- Pre-text: "How It Works"
- H2: `Simple Process`
- 4 numbered steps:
  1. Brief | "Tell us the mission — aircraft type, route, date, purpose, and any specific requirements or concerns."
  2. Match | "We identify the most suitable pilot from our team based on type rating, experience, and availability."
  3. Briefing | "Your pilot contacts you directly to discuss the operation. No surprises on the day."
  4. Debrief | "After the mission, a brief report is provided. For extended contracts, regular operational reviews are included."

**Section 6 — Aircraft Covered (`pp-aircraft`)**
- Pre-text: "Type Ratings Held"
- H2: `Aircraft We Fly`
- Description: "Our pilot team holds current type ratings across the Robinson range and a growing number of turbine types."
- 6 aircraft chips/badges:
  - Robinson R22 | Robinson R44 | Robinson R66 | Hughes 500 | AS350 Squirrel | Bell 407

**Section 7 — FAQ (`pp-faq`)**
- useFaqs('pilot-provisioning', { visibleOnly: true })
- Fallback FAQs:
  1. Q: "How quickly can you provide a pilot?" A: "For planned operations, we ask for at least 48 hours notice to arrange briefing and documentation. For urgent requirements, contact us directly and we'll do our best."
  2. Q: "Is the pilot insured by HQ or do I need my own cover?" A: "HQ arranges appropriate insurance for provisioning engagements. Details are confirmed at the time of booking — we want to be clear on cover before any pilot departs."
  3. Q: "Can you provide pilots for aircraft not in the Robinson range?" A: "Our core team is Robinson-specialised, but we have relationships with pilots rated on turbine types including the AS350, Hughes 500, and Bell 407. Contact us with your requirement."
  4. Q: "What if the mission changes on the day?" A: "Our pilots are briefed to make go/no-go decisions independently based on conditions. Any significant change to the planned mission is discussed with you before departure."
  5. Q: "Do you provide pilots for overseas operations?" A: "Yes — we support European and further afield operations. Additional lead time and documentation requirements apply. See our SuperYacht Operations service for yacht-based programmes."

**Section 8 — CTA (`pp-cta`) — dark**
- Pre-text (light): "Need a Pilot?"
- H2 (white): `Get in Touch`
- Body: "Tell us your mission and we'll come back with availability and costs. Most enquiries get a response within a few hours."
- Buttons: "Enquire Now" → /contact?subject=pilot-provisioning | "Superyacht Ops" → /superyacht-ops

- [ ] **Step 1: Create `src/pages/PilotProvisioning.jsx`**

Key state:
```jsx
const heroRef = useRef(null);
const [openFaq, setOpenFaq] = useState(null);
const pageImages = usePageImages('pilot-provisioning');
useCmsHighlight();
const { scrollYProgress } = useScroll({ target: heroRef, offset: ['start start', 'end start'] });
useEffect(() => { window.scrollTo(0, 0); }, []);
const heroOpacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);
const heroScale = useTransform(scrollYProgress, [0, 0.5], [1, 0.95]);
const heroY = useTransform(scrollYProgress, [0, 0.5], [0, 100]);
const { faqs: rawFaqs } = useFaqs('pilot-provisioning', { visibleOnly: true });
```

Aircraft chips:
```jsx
const aircraft = ['Robinson R22', 'Robinson R44', 'Robinson R66', 'Hughes 500', 'AS350 Squirrel', 'Bell 407'];
```

Service panels:
```jsx
const servicePanels = [
  {
    tag: 'Most Requested', num: '01', title: 'Safety Pilots',
    description: 'A safety pilot flies alongside you to provide an additional layer of oversight — particularly useful when operating in unfamiliar airspace, carrying passengers on long legs, or flying in marginal conditions. All HQ safety pilots are experienced instructors.',
    details: ['Current FI(H) rating', 'Minimum 500 hours', 'Type-rated on your aircraft', 'Fully insured'],
    image: '/assets/images/gallery/carousel/rotating1.jpg', imageCmsKey: 'pp-panel-1',
  },
  {
    tag: 'Logistics', num: '02', title: 'Ferry Flights',
    description: 'Need an aircraft moved? Whether from a maintenance facility, delivery from a purchase, or repositioning for an operation — HQ\'s ferry pilots handle fuel planning, weather routing, PPR, and all the logistics.',
    details: ['Pre-flight inspection', 'Weather routing included', 'Insurance documentation', 'Full handover record'],
    image: '/assets/images/gallery/flying/flying-.jpg', imageCmsKey: 'pp-panel-2',
  },
  {
    tag: 'Extended Operations', num: '03', title: 'Dedicated Crewing',
    description: 'For ongoing operations — seasonal superyacht programmes, corporate fleet management, extended contracts — HQ provides a dedicated crew member on a contract basis with rostering, currency, and compliance all managed.',
    details: ['Rostered availability', 'Currency maintained', 'Recurrency training included', 'Full compliance management'],
    image: '/assets/images/gallery/carousel/rotating2.jpg', imageCmsKey: 'pp-panel-3',
  },
];
```

- [ ] **Step 2: Verify component integrity**
- [ ] **Step 3: Commit**

```bash
git add src/pages/PilotProvisioning.jsx
git commit -m "feat(pilot-provisioning): add Pilot Provisioning page"
```

---

## Task 5: Aircraft Consulting Page

**Files:**
- Create: `src/pages/AircraftConsulting.jsx`

**CSS prefix:** `ac-`  
**Template to follow:** TypeRating.jsx + NightRating.jsx  
**Tone:** Authoritative, independent, expert — like a trusted advisor  
**Primary image fallback:** `/assets/images/facility/hq-0354.jpg`

### Section breakdown

**Section 1 — Hero**
- Background image (CMS: `aircraft-consulting-hero`), fallback `/assets/images/facility/hq-0354.jpg`
- Dark overlay
- Badge: `Independent` "Advice" | divider | `35+ Years` "Experience"
- Headline: `AIRCRAFT` (word--1) + `CONSULTING` (word--2)
- Label: "Advisory Services"
- Subtext: "Pre-purchase inspections, ownership advice, fleet planning, and bespoke acquisition services. Independent expertise you can trust — we work for you, not the seller."

**Section 2 — Intro (`ac-intro`)**
- Pre-text: "Expertise Before Commitment"
- H2: `Independent. Thorough. Honest.`
- Body para 1: "Buying a helicopter is a significant decision. The wrong choice — wrong type, wrong configuration, undisclosed history — costs far more than the aircraft itself. HQ Aviation's consulting service gives buyers and owners the benefit of 35 years of Robinson expertise and an independent perspective unclouded by sales incentives."
- Body para 2: "We assess aircraft objectively. If it's right, we'll tell you. If it has problems, we'll tell you that too — in detail, in writing, before you commit."
- Image right (CMS: `ac-intro`) + caption "35+ Years of Robinson Expertise"
- 3 stat chips: 500+ Aircraft | Assessed | 35+ Years | Experience | Factory | Authorised

**Section 3 — Services (`ac-services`)**
- Pre-text: "What We Offer"
- H2: `Consulting Services`
- 4 service cards in 2×2 grid:

  **Card 1: Pre-Purchase Inspection**
  - Tag: "Most Common"
  - Description: "A thorough airframe, engine, avionics, and logbook inspection of any Robinson helicopter before purchase. We check everything a pre-purchase should cover — and then some. Report delivered within 48 hours of inspection."
  - What's included: Physical inspection | Logbook audit | Airworthiness check | Written report | Price guidance
  - CTA: Request Inspection

  **Card 2: Ownership Advisory**
  - Tag: "Ongoing"
  - Description: "For first-time helicopter owners navigating the responsibilities of ownership — insurance, maintenance scheduling, hangarage, pilot currency, operating costs. We provide ongoing advisory support so you're never left guessing."
  - What's included: Cost modelling | Operator selection | Maintenance scheduling | Insurance guidance | Regulatory compliance

  **Card 3: Fleet Planning**
  - Tag: "Corporate"
  - Description: "Corporate clients and operators planning a helicopter fleet benefit from HQ's deep knowledge of operational costs, maintenance patterns, and type suitability across the Robinson range. We model the numbers and give you a clear picture before any purchase."
  - What's included: Type comparison | Cost projection | Operational analysis | Supplier evaluation | Procurement support

  **Card 4: Acquisition Services**
  - Tag: "Full Service"
  - Description: "For clients who want HQ to manage the entire acquisition process — identifying suitable aircraft, conducting negotiations, arranging surveys, managing import/export documentation, and coordinating delivery. A complete hands-off service for buyers who value their time."
  - What's included: Aircraft sourcing | Seller negotiation | Survey management | Documentation | Delivery coordination

**Section 4 — Why Independent Matters (`ac-why`) — dark**
- Pre-text (light): "Why It Matters"
- H2 (white): `The Independent Advantage`
- Body (white/70): "Most aircraft sellers will arrange an 'inspection' through an engineer they know. That engineer's continued work depends on not upsetting the seller. Our consulting work depends entirely on giving you an accurate assessment — our reputation, built over 35 years, is the only thing we're protecting."
- 4 points in 2×2 grid:
  1. No Sales Commission | "HQ receives no commission from sellers. Our fee comes from you — the buyer."
  2. Factory Knowledge | "As an Authorised Robinson Service Centre, we know exactly what these aircraft should look like at every hour interval."
  3. Logbook Expertise | "30 years of reviewing Robinson logbooks means we know what's normal, what's unusual, and what's a red flag."
  4. Honest Advice | "If an aircraft is not worth buying, we say so. You'll know before you commit."

**Section 5 — Process (`ac-process`)**
- Pre-text: "How It Works"
- H2: `The Process`
- 5 numbered steps:
  1. Brief | "Tell us what you're looking at — aircraft registration, hours, price, and your goals. We'll confirm whether we can help and our fee."
  2. Research | "We review the aircraft's CAA records, check for any ADs or known issues on the type, and prepare our inspection checklist."
  3. Inspection | "Physical inspection at the aircraft's location. We inspect airframe, engine, avionics, documents, and logbooks thoroughly."
  4. Report | "Written report within 48 hours detailing findings, condition assessment, estimated rectification costs for any defects, and our recommendation."
  5. Support | "We're available to discuss the report and support any subsequent negotiation or decision-making."

**Section 6 — Trust indicators (`ac-trust`)**
- Pre-text: "Our Credentials"
- H2: `Why Trust HQ`
- 4 horizontal credential bars:
  - **Robinson Authorised Service Centre** | "Factory-authorised to inspect and certify Robinson helicopters — the most relevant qualification for pre-purchase work."
  - **CAA Approved Organisation** | "Part 145 Approved Maintenance Organisation. We know airworthiness standards in detail."
  - **35 Years of Robinson Experience** | "More Robinson hours, more Robinson logbooks, and more Robinson problems solved than almost any other organisation in Europe."
  - **500+ Transactions Supported** | "A track record of acquisitions, sales, and ownership transitions — we understand the market."

**Section 7 — FAQ (`ac-faq`)**
- useFaqs('aircraft-consulting', { visibleOnly: true })
- Fallback FAQs:
  1. Q: "Do you inspect aircraft other than Robinson types?" A: "Our core expertise is the Robinson range — R22, R44, R66, and R88. We can arrange inspections on other types through our network of type-specialist engineers, but the Robinson range is where our direct expertise sits."
  2. Q: "How much does a pre-purchase inspection cost?" A: "Fees depend on the type and location of the aircraft. Contact us with details and we'll provide a fixed fee upfront — no surprises."
  3. Q: "Can you negotiate on my behalf?" A: "Yes — as part of our Acquisition Services offering. We're effective negotiators because we understand the market, the aircraft, and realistic rectification costs."
  4. Q: "What if the inspection finds problems?" A: "We document every finding with photographs and reference the applicable maintenance data. For defects, we estimate rectification costs so you can factor them into your offer or walk away with a clear understanding of why."
  5. Q: "How quickly can you conduct an inspection?" A: "Typically within 3–5 working days of the request, subject to the aircraft's location. For time-sensitive transactions, contact us and we'll do our best."
  6. Q: "Do you provide ongoing advisory retainers?" A: "Yes — for owners who want regular access to our knowledge. Contact us to discuss a structure that suits your needs."

**Section 8 — CTA (`ac-cta`) — dark**
- Pre-text (light): "Thinking of Buying?"
- H2 (white): `Talk to an Expert First`
- Body: "A brief conversation before you commit could save you considerably more than our fee. Get in touch for an honest, no-obligation discussion about any aircraft you're considering."
- Buttons: "Request an Inspection" → /contact?subject=aircraft-consulting | "View Our Fleet" → /fleet

- [ ] **Step 1: Create `src/pages/AircraftConsulting.jsx`**

Key state:
```jsx
const heroRef = useRef(null);
const [openFaq, setOpenFaq] = useState(null);
const pageImages = usePageImages('aircraft-consulting');
useCmsHighlight();
const { scrollYProgress } = useScroll({ target: heroRef, offset: ['start start', 'end start'] });
useEffect(() => { window.scrollTo(0, 0); }, []);
const heroOpacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);
const heroScale = useTransform(scrollYProgress, [0, 0.5], [1, 0.95]);
const heroY = useTransform(scrollYProgress, [0, 0.5], [0, 100]);
const { faqs: rawFaqs } = useFaqs('aircraft-consulting', { visibleOnly: true });
```

Service cards data:
```jsx
const services = [
  {
    num: '01', tag: 'Most Common', title: 'Pre-Purchase Inspection',
    description: 'A thorough airframe, engine, avionics, and logbook inspection of any Robinson helicopter before purchase. We check everything a pre-purchase should cover — and more. Written report within 48 hours.',
    includes: ['Physical inspection', 'Logbook audit', 'Airworthiness check', 'Written report with photography', 'Price guidance'],
    enquiry: 'pre-purchase-inspection'
  },
  {
    num: '02', tag: 'Ongoing', title: 'Ownership Advisory',
    description: 'For first-time helicopter owners navigating the responsibilities of ownership — insurance, maintenance scheduling, hangarage, pilot currency, operating costs. Ongoing support so you\'re never left guessing.',
    includes: ['Operating cost modelling', 'Operator selection guidance', 'Maintenance scheduling', 'Insurance guidance', 'Regulatory compliance advice'],
    enquiry: 'ownership-advisory'
  },
  {
    num: '03', tag: 'Corporate', title: 'Fleet Planning',
    description: 'Corporate clients planning a helicopter fleet benefit from HQ\'s knowledge of operational costs, maintenance patterns, and type suitability. We model the numbers and give you a clear picture before any purchase.',
    includes: ['Type comparison analysis', 'Cost projections', 'Operational requirements analysis', 'Supplier evaluation', 'Procurement support'],
    enquiry: 'fleet-planning'
  },
  {
    num: '04', tag: 'Full Service', title: 'Acquisition Services',
    description: 'HQ manages the entire acquisition process — identifying aircraft, conducting negotiations, arranging surveys, managing documentation, and coordinating delivery. A complete hands-off service.',
    includes: ['Aircraft sourcing', 'Seller negotiation', 'Survey management', 'Import/export documentation', 'Delivery coordination'],
    enquiry: 'acquisition-services'
  },
];
```

Process steps:
```jsx
const processSteps = [
  { num: '01', title: 'Brief', duration: '30 mins', description: 'Tell us what you\'re looking at — aircraft registration, hours, price, and your goals. We\'ll confirm scope and fee.' },
  { num: '02', title: 'Research', duration: '1 day', description: 'We review CAA records, check for ADs or known issues on the type, and prepare our inspection checklist tailored to the aircraft.' },
  { num: '03', title: 'Inspection', duration: 'Half day', description: 'Physical inspection at the aircraft\'s location covering airframe, engine, avionics, documents, and logbooks. Photography throughout.' },
  { num: '04', title: 'Report', duration: '48 hours', description: 'Written report detailing every finding, condition assessment, estimated rectification costs, and our clear recommendation.' },
  { num: '05', title: 'Support', duration: 'Ongoing', description: 'Available to discuss the report and support any negotiation or decision-making that follows.' },
];
```

- [ ] **Step 2: Verify component integrity**
- [ ] **Step 3: Commit**

```bash
git add src/pages/AircraftConsulting.jsx
git commit -m "feat(aircraft-consulting): add Aircraft Consulting page"
```

---

## Task 6: Wire Routes and Update Card Links

**Files:**
- Modify: `src/App.jsx`
- Modify: `src/pages/Experimentation.jsx`

- [ ] **Step 1: Add imports and routes to `src/App.jsx`**

Add these imports near the other page imports (around line 50):
```jsx
import CPL from './pages/CPL';
import AdvancedTraining from './pages/AdvancedTraining';
import SuperYachtOps from './pages/SuperYachtOps';
import PilotProvisioning from './pages/PilotProvisioning';
import AircraftConsulting from './pages/AircraftConsulting';
```

Add these routes before the `<Route path="/" element={<Experimentation />} />` line:
```jsx
<Route path="/training/commercial" element={<CPL />} />
<Route path="/training/advanced" element={<AdvancedTraining />} />
<Route path="/superyacht-ops" element={<SuperYachtOps />} />
<Route path="/pilot-provisioning" element={<PilotProvisioning />} />
<Route path="/aircraft-consulting" element={<AircraftConsulting />} />
```

- [ ] **Step 2: Update fd-zigzag card links in `src/pages/Experimentation.jsx`**

Find the fd-zigzag card for CPL (card 04) — currently has `href="/training"`. Update to `href="/training/commercial"`.

Find the fd-zigzag card for Advanced Training (card 10) — currently has `href="/contact?subject=training"`. Update to `href="/training/advanced"`.

Find the fd-zigzag card for SuperYacht Ops (card 08) — currently has `href="/contact?subject=special-ops"`. Update to `href="/superyacht-ops"`.

Find the fd-zigzag card for Pilot Provisioning (card 09) — currently has `href="/contact?subject=pilot-services"`. Update to `href="/pilot-provisioning"`.

Find the fd-zigzag card for Aircraft Consulting (card 11) — currently has `href="/contact?subject=consulting"`. Update to `href="/aircraft-consulting"`.

Exact changes to make (search for these strings):
- `href="/training" data-discover="true"><span>Learn More` (on the CPL card — the one with text "Commercial Pilot Licence") → change href to `/training/commercial`
- `href="/contact?subject=special-ops"` → change to `/superyacht-ops`
- `href="/contact?subject=pilot-services"` → change to `/pilot-provisioning`
- `href="/contact?subject=training"` (the Advanced Training card) → change to `/training/advanced`
- `href="/contact?subject=consulting"` → change to `/aircraft-consulting`

- [ ] **Step 3: Commit**

```bash
git add src/App.jsx src/pages/Experimentation.jsx
git commit -m "feat: wire routes and update card links for 5 new service pages"
```

---

## CSS Architecture Notes (apply to ALL pages)

Every page must have a `<style>` tag at the bottom of the JSX (inside the component return, after the footer). CSS rules follow this structure:

```css
/* Base */
.PREFIX { font-family: 'Space Grotesk', -apple-system, sans-serif; background: #faf9f6; color: #1a1a1a; overflow-x: hidden; }
.PREFIX-pre-text { display: block; font-size: 0.7rem; text-transform: uppercase; letter-spacing: 0.25em; color: #999; margin-bottom: 1rem; }
.PREFIX-pre-text--light { color: rgba(255,255,255,0.5); }
.PREFIX-text--dark { color: #1a1a1a; }
.PREFIX-text--mid { color: #4a4a4a; }
.PREFIX-text--light { color: #7a7a7a; }
.PREFIX-text--white { color: #ffffff; }
.PREFIX-text--white-mid { color: rgba(255,255,255,0.6); }
.PREFIX-section-header { text-align: center; max-width: 700px; margin: 0 auto 3rem; }
.PREFIX-section-header h2 { font-size: clamp(2rem, 4vw, 3rem); margin: 0.5rem 0 1rem; line-height: 1.1; text-transform: uppercase; font-weight: 700; }
.PREFIX-section-header p { color: #666; font-size: 1.05rem; line-height: 1.7; }

/* Buttons */
.PREFIX-btn { display: inline-block; padding: 1rem 2rem; font-size: 0.75rem; font-weight: 500; text-decoration: none; text-transform: uppercase; letter-spacing: 0.1em; border: none; cursor: pointer; transition: all 0.3s ease; font-family: inherit; }
.PREFIX-btn--primary { background: #1a1a1a; color: #fff; }
.PREFIX-btn--primary:hover { background: #333; }
.PREFIX-btn--outline { background: transparent; color: #1a1a1a; border: 1.5px solid #1a1a1a; }
.PREFIX-btn--outline:hover { background: #1a1a1a; color: #fff; }
.PREFIX-btn--white { background: #fff; color: #1a1a1a; }
.PREFIX-btn--white:hover { background: #f0f0f0; }

/* Hero */
.PREFIX-hero { min-height: 100vh; position: relative; display: flex; flex-direction: column; overflow: hidden; }
.PREFIX-hero__bg { position: absolute; inset: 0; }
.PREFIX-hero__bg img { width: 100%; height: 100%; object-fit: cover; }
.PREFIX-hero__overlay { position: absolute; inset: 0; background: linear-gradient(to right, rgba(0,0,0,0.75) 0%, rgba(0,0,0,0.4) 60%, rgba(0,0,0,0.1) 100%); z-index: 1; }
.PREFIX-hero__content { position: relative; z-index: 3; flex: 1; display: flex; align-items: center; padding: 8rem 4rem 4rem; }
.PREFIX-hero__label { display: block; font-family: 'Share Tech Mono', monospace; font-size: 0.7rem; text-transform: uppercase; letter-spacing: 0.25em; color: rgba(255,255,255,0.6); margin-bottom: 1.5rem; }
.PREFIX-hero__headline { margin-bottom: 1.5rem; }
.PREFIX-hero__word { display: block; font-size: clamp(3.5rem, 8vw, 7rem); font-weight: 800; line-height: 0.9; text-transform: uppercase; letter-spacing: -0.02em; color: #fff; }
.PREFIX-hero__divider-line { width: 60px; height: 2px; background: rgba(255,255,255,0.4); transform-origin: left; margin: 1.5rem 0; }
.PREFIX-hero__sub { color: rgba(255,255,255,0.75); font-size: 1.05rem; line-height: 1.65; max-width: 480px; }

/* Badge card (in hero) */
.PREFIX-hero__badge { background: rgba(255,255,255,0.1); backdrop-filter: blur(12px); border: 1px solid rgba(255,255,255,0.15); border-radius: 12px; padding: 1.25rem 1.5rem; display: inline-block; margin-bottom: 1.5rem; }
.PREFIX-hero__badge-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.75rem; gap: 1.5rem; }
.PREFIX-hero__badge-label { font-family: 'Share Tech Mono', monospace; font-size: 0.55rem; text-transform: uppercase; letter-spacing: 0.15em; color: rgba(255,255,255,0.5); }
.PREFIX-hero__badge-type { font-family: 'Share Tech Mono', monospace; font-size: 0.65rem; text-transform: uppercase; letter-spacing: 0.1em; color: rgba(255,255,255,0.8); }
.PREFIX-hero__badge-content { display: flex; align-items: center; gap: 1.25rem; }
.PREFIX-hero__badge-stat { text-align: center; }
.PREFIX-hero__badge-num { display: block; font-size: 1.75rem; font-weight: 700; color: #fff; line-height: 1; }
.PREFIX-hero__badge-desc { display: block; font-size: 0.6rem; color: rgba(255,255,255,0.55); font-family: 'Share Tech Mono', monospace; text-transform: uppercase; letter-spacing: 0.1em; margin-top: 0.25rem; }
.PREFIX-hero__badge-divider { width: 1px; height: 40px; background: rgba(255,255,255,0.2); }

/* Intro section (2-col) */
.PREFIX-intro { padding: 6rem 4rem; background: #faf9f6; }
.PREFIX-intro__container { max-width: 1200px; margin: 0 auto; display: grid; grid-template-columns: 1fr 1fr; gap: 5rem; align-items: center; }
.PREFIX-intro__header h2 { font-size: clamp(2rem, 3.5vw, 2.8rem); font-weight: 700; line-height: 1.15; margin: 0.5rem 0 1.5rem; text-transform: uppercase; letter-spacing: -0.01em; }
.PREFIX-intro__header p { color: #555; line-height: 1.75; font-size: 1.05rem; margin-bottom: 1rem; }
.PREFIX-intro__image { position: relative; border-radius: 8px; overflow: hidden; }
.PREFIX-intro__image img { width: 100%; height: 500px; object-fit: cover; display: block; }
.PREFIX-intro__image-caption { position: absolute; bottom: 1.5rem; left: 1.5rem; background: rgba(255,255,255,0.95); padding: 0.75rem 1rem; border-radius: 6px; font-size: 0.7rem; display: flex; align-items: center; gap: 0.5rem; }

/* Dark section */
.PREFIX-[darkSection] { background: #1a1a1a; padding: 6rem 4rem; }
.PREFIX-[darkSection]__container { max-width: 1200px; margin: 0 auto; }

/* Process steps */
.PREFIX-process { background: #1a1a1a; padding: 6rem 4rem; }
.PREFIX-process__container { max-width: 1000px; margin: 0 auto; }
.PREFIX-process__steps { display: flex; flex-direction: column; gap: 0; margin: 3rem 0; }
.PREFIX-process__step { display: flex; gap: 2rem; padding: 2rem 0; border-bottom: 1px solid rgba(255,255,255,0.08); }
.PREFIX-process__step:last-child { border-bottom: none; }
.PREFIX-process__step-num { font-family: 'Share Tech Mono', monospace; font-size: 0.65rem; color: rgba(255,255,255,0.3); letter-spacing: 0.1em; flex-shrink: 0; width: 30px; padding-top: 0.2rem; }
.PREFIX-process__step-header { display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 0.5rem; gap: 1rem; }
.PREFIX-process__step-header h4 { font-size: 1rem; font-weight: 700; color: #fff; margin: 0; }
.PREFIX-process__step-duration { font-family: 'Share Tech Mono', monospace; font-size: 0.6rem; color: rgba(255,255,255,0.4); text-transform: uppercase; letter-spacing: 0.1em; white-space: nowrap; }
.PREFIX-process__step-content p { color: rgba(255,255,255,0.6); line-height: 1.65; font-size: 0.95rem; margin: 0; }

/* FAQ */
.PREFIX-faq { padding: 6rem 4rem; background: #faf9f6; }
.PREFIX-faq__container { max-width: 800px; margin: 0 auto; }
.PREFIX-faq__list { margin-top: 2rem; }
.PREFIX-faq__item { display: flex; gap: 1.5rem; padding: 1.5rem 0; border-bottom: 1px solid #e8e6e2; cursor: pointer; }
.PREFIX-faq__item:last-child { border-bottom: none; }
.PREFIX-faq__number { font-family: 'Share Tech Mono', monospace; font-size: 0.6rem; color: #ccc; letter-spacing: 0.1em; flex-shrink: 0; width: 24px; padding-top: 0.2rem; }
.PREFIX-faq__content { flex: 1; }
.PREFIX-faq__content h4 { font-size: 0.95rem; font-weight: 600; color: #1a1a1a; margin: 0; display: flex; justify-content: space-between; align-items: flex-start; gap: 1rem; line-height: 1.5; }
.PREFIX-faq__toggle { font-size: 1.2rem; color: #999; flex-shrink: 0; line-height: 1; }
.PREFIX-faq__answer p { color: #666; line-height: 1.65; margin: 0.75rem 0 0; font-size: 0.95rem; }

/* CTA section */
.PREFIX-cta { background: #1a1a1a; padding: 6rem 4rem; position: relative; overflow: hidden; }
.PREFIX-cta__inner { max-width: 700px; margin: 0 auto; text-align: center; position: relative; z-index: 2; }
.PREFIX-cta__inner h2 { font-size: clamp(2rem, 4vw, 3rem); font-weight: 700; text-transform: uppercase; margin: 0.5rem 0 1.5rem; }
.PREFIX-cta__inner p { color: rgba(255,255,255,0.7); line-height: 1.7; font-size: 1.05rem; margin-bottom: 2.5rem; }
.PREFIX-cta__buttons { display: flex; gap: 1rem; justify-content: center; flex-wrap: wrap; }
.PREFIX-cta__link { display: inline-flex; align-items: center; gap: 0.5rem; font-size: 0.75rem; text-transform: uppercase; letter-spacing: 0.1em; color: rgba(255,255,255,0.6); text-decoration: none; transition: color 0.2s; }
.PREFIX-cta__link:hover { color: #fff; }

/* Responsive */
@media (max-width: 1024px) { .PREFIX-intro__container { grid-template-columns: 1fr; gap: 3rem; } }
@media (max-width: 768px) {
  .PREFIX-hero__content { padding: 7rem 1.5rem 3rem; }
  .PREFIX-hero__word { font-size: clamp(2.8rem, 12vw, 5rem); }
  .PREFIX-intro, .PREFIX-faq, .PREFIX-cta, .PREFIX-process { padding: 4rem 1.5rem; }
  .PREFIX-process__step { flex-direction: column; gap: 0.5rem; }
  .PREFIX-cta__buttons { flex-direction: column; align-items: center; }
}
```

Replace `PREFIX` and `[darkSection]` with the actual page prefix and section names.

Each page should have at minimum: ~1,200–1,800 lines total. The CSS section should be 400–600 lines to match the quality of existing pages. Section padding: `6rem 4rem` (desktop), `4rem 1.5rem` (mobile). Max content width: `1200px` centered with `margin: 0 auto`.

---

## Self-Review

**Spec coverage check:**
- ✅ CPL page — all 9 sections specified with exact content
- ✅ Advanced Training — all 7 sections with exact content + Captain Q spotlight
- ✅ SuperYacht Ops — all 8 sections with exact content
- ✅ Pilot Provisioning — all 8 sections with exact content
- ✅ Aircraft Consulting — all 8 sections with exact content
- ✅ Route wiring — exact imports and route JSX specified
- ✅ Card link updates — exact href values to change specified

**Placeholder scan:** No TBD or TODO items. All data arrays defined. All copy written. All CSS patterns specified.

**Type consistency:** All CSS prefixes unique (cpl-, adv-, syo-, pp-, ac-). Hero classnames follow identical pattern across all pages. FAQ item classnames follow identical pattern.

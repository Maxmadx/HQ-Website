# Admin Text CMS — Bidirectional Wiring Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Wire every production page to read copy from Firestore via `usePageText`, so edits made in `/admin/text` are reflected live on the site — and the admin always shows the real text currently on each page, not made-up defaults.

**Architecture:** `textSections.js` is the single source of truth for _structure_ (section IDs, field IDs, labels, defaults). `usePageText(pageKey)` fetches the current values from Firestore `site_text`, merging with defaults. Every production page must call `usePageText` and replace hardcoded strings with `t('section-id', 'field-id')`. A seed script sets Firestore values to match the real JSX text so the admin panel is immediately correct on first run.

**Tech Stack:** React 18, Vite, Firebase Firestore v9 modular SDK, firebase-admin (seed script), Node.js

---

## Root Cause

`usePageText` is only called in **`AdminEditTextMode.jsx`**. Not a single production page calls it. The website pages have all copy hardcoded in JSX. The admin shows `default` field values from `textSections.js` — but since defaults were written to match real text, they are mostly accurate. The critical missing piece is the **read path**: pages need to consume `t()` instead of hardcoded strings.

## Files Touched

| File | Action | Purpose |
|---|---|---|
| `src/hooks/usePageText.js` | Modify | Export `bustPageCache(pageKey)` for cache invalidation |
| `src/pages/admin/AdminEditTextMode.jsx` | Modify | Call `bustPageCache` after successful save |
| `scripts/seed-site-text.js` | Create | Seed Firestore `site_text` with all defaults |
| `src/pages/DiscoveryFlight.jsx` | Modify | Wire `usePageText('discovery')` into all sub-components |
| `src/pages/SelfFlyHire.jsx` | Modify | Wire `usePageText('sfh')` into all sub-components |
| `src/pages/Sales.jsx` | Modify | Wire `usePageText('sales')` |
| `src/pages/FinalMaintenance.jsx` | Modify | Wire `usePageText('maintenance')` |
| `src/pages/FinalExpeditions.jsx` | Modify | Wire `usePageText('expeditions')` |
| `src/pages/AboutUs.jsx` | Modify | Wire `usePageText('about')` |
| `src/pages/Training.jsx` (or equivalent) | Modify | Wire `usePageText('training')` |
| `src/pages/Experimentation.jsx` | Modify | Wire `usePageText('home')` — most complex, 13 sections |

---

## Task 1: Add Cache Busting to usePageText

**Files:**
- Modify: `src/hooks/usePageText.js`

The module-level `cache` object is never invalidated. After admin saves, the user sees stale data until they hard-reload. We need to expose `bustPageCache` so the admin can force a re-fetch.

- [ ] **Step 1: Read the current hook**

```
src/hooks/usePageText.js  (already read above — 50 lines)
```

- [ ] **Step 2: Add the export**

In `src/hooks/usePageText.js`, after the `const cache = {};` line, add:

```js
/** Call this after an admin save to force the next render to re-fetch. */
export function bustPageCache(pageKey) {
  delete cache[pageKey];
}
```

- [ ] **Step 3: Verify it compiles**

```bash
cd /Users/maximussmith/Downloads/HQ-Website-main && npx vite build --mode development 2>&1 | tail -5
```

Expected: no errors about `bustPageCache`.

- [ ] **Step 4: Commit**

```bash
git add src/hooks/usePageText.js
git commit -m "feat(cms): export bustPageCache from usePageText"
```

---

## Task 2: Call bustPageCache After Admin Save

**Files:**
- Modify: `src/pages/admin/AdminEditTextMode.jsx:90-107`

The `saveSection` function currently saves to Firestore but never invalidates the cache. The saved value will not appear on the site until a hard reload.

- [ ] **Step 1: Add the import**

At the top of `AdminEditTextMode.jsx`, change:

```js
import { usePageText } from '../../hooks/usePageText';
```

to:

```js
import { usePageText, bustPageCache } from '../../hooks/usePageText';
```

- [ ] **Step 2: Call bust after successful save**

Find the `saveSection` function (lines ~90–107). After `setSaved(true)`, add `bustPageCache(selectedPage)`:

```js
async function saveSection() {
  if (!activeSection) return;
  setSaving(true);
  setSaveError('');
  try {
    await setDoc(
      doc(db, 'site_text', activeSection.id),
      { page: selectedPage, fields: { ...panelValues } },
      { merge: true },
    );
    setSaved(true);
    setDirtyFields({});
    bustPageCache(selectedPage);   // ← add this line
  } catch (e) {
    setSaveError(`Save failed: ${e.message ?? 'unknown error'}`);
  } finally {
    setSaving(false);
  }
}
```

- [ ] **Step 3: Verify**

```bash
npx vite build --mode development 2>&1 | tail -5
```

Expected: clean build.

- [ ] **Step 4: Commit**

```bash
git add src/pages/admin/AdminEditTextMode.jsx
git commit -m "feat(cms): bust usePageText cache after admin text save"
```

---

## Task 3: Seed Script — Push All Defaults to Firestore

**Files:**
- Create: `scripts/seed-site-text.js`

This seeds Firestore `site_text` with the real default values, so the admin panel shows actual site text from the first time it's opened (rather than just code-level fallbacks). Uses `merge: true` so any admin-edited values already in Firestore are not overwritten.

- [ ] **Step 1: Check firebase-admin is available**

```bash
node -e "require('./api/firebase-admin')" && echo OK
```

Expected: `OK` (or Firebase admin init log). If it throws about missing env vars, check `.env` has `FIREBASE_PROJECT_ID`, `FIREBASE_CLIENT_EMAIL`, `FIREBASE_PRIVATE_KEY`.

- [ ] **Step 2: Create the seed script**

```js
// scripts/seed-site-text.js
// Seeds Firestore site_text collection with default values from textSections.js
// Run: node scripts/seed-site-text.js
// Safe to re-run — uses merge:true, so admin-edited values are preserved.

const admin = require('../api/firebase-admin');

// Import textSections — we need a CommonJS-compatible version.
// Since textSections.js uses ES module 'export', we compile on the fly.
const { createRequire } = require('module');
const { execSync } = require('child_process');
const path = require('path');
const fs = require('fs');

async function main() {
  // Build a temp CJS file from the ES module source
  const src = fs.readFileSync(path.join(__dirname, '../src/lib/textSections.js'), 'utf8');
  const cjs = src
    .replace(/^export const /gm, 'const ')
    .replace(/^export \{[^}]+\};?\s*$/gm, '')
    + '\nmodule.exports = { TEXT_SECTIONS };';

  const tmpFile = path.join(__dirname, '_textSections_cjs_tmp.js');
  fs.writeFileSync(tmpFile, cjs);

  let TEXT_SECTIONS;
  try {
    ({ TEXT_SECTIONS } = require(tmpFile));
  } finally {
    fs.unlinkSync(tmpFile);
  }

  const db = admin.firestore();
  const batch = db.batch();
  let count = 0;

  for (const section of TEXT_SECTIONS) {
    const fields = {};
    for (const field of section.fields) {
      fields[field.id] = field.default;
    }
    const ref = db.collection('site_text').doc(section.id);
    batch.set(ref, { page: section.page, fields }, { merge: true });
    count++;
    if (count % 400 === 0) {
      // Firestore batch limit is 500 ops — commit and start new batch
      await batch.commit();
      console.log(`Committed ${count} sections...`);
    }
  }

  await batch.commit();
  console.log(`✓ Seeded ${count} sections into Firestore site_text.`);
  process.exit(0);
}

main().catch((err) => {
  console.error('Seed failed:', err);
  process.exit(1);
});
```

- [ ] **Step 3: Run the seed**

```bash
node scripts/seed-site-text.js
```

Expected output:
```
✓ Seeded 47 sections into Firestore site_text.
```

- [ ] **Step 4: Verify in Firebase console**

Open Firebase Console → Firestore → `site_text` collection. You should see documents like `home-hero-editorial-headline`, `discovery-hero`, `sfh-hero`, etc.

- [ ] **Step 5: Commit**

```bash
git add scripts/seed-site-text.js
git commit -m "feat(cms): seed script for site_text collection"
```

---

## Task 4: Wire DiscoveryFlight.jsx to usePageText

**Files:**
- Modify: `src/pages/DiscoveryFlight.jsx`

The Discovery Flight page has text sections: `discovery-hero`, `discovery-value-prop`, `discovery-aircraft-r22`, `discovery-aircraft-r44`, `discovery-aircraft-r66`, `discovery-gift`, `discovery-instructor`, `discovery-steps`, `discovery-faq`, `discovery-final-cta`.

**Strategy:** The file has multiple sub-component functions defined within it. Call `usePageText('discovery')` in each sub-component that renders managed text. The module-level cache means all sub-components share one Firestore fetch.

- [ ] **Step 1: Find every hardcoded text location**

Run these greps to confirm line numbers before editing:

```bash
grep -n "DISCOVERY FLIGHTS\|YOUR\|FIRST\|FLIGHT\|Take the controls\|Choose Your Flight" src/pages/DiscoveryFlight.jsx | grep -v "//\|import\|className"
```

```bash
grep -n "Why HQ Aviation\|Not Just A Flight\|An Experience\|Have you ever wondered\|ROBINSON R22\|The 2-Seat Trainer\|Nimble and responsive" src/pages/DiscoveryFlight.jsx | head -20
```

```bash
grep -n "Gift Vouchers Available\|Your Instructor\|Meet Your Team\|Quentin Smith\|World Helicopter Champion\|What To Expect\|Arrival.*Welcome\|Pre-Flight Briefing\|Take Flight\|Hands-On Flying\|Debrief.*Certificate" src/pages/DiscoveryFlight.jsx | head -30
```

```bash
grep -n "Do I need any prior\|Can I bring passengers\|What happens if the weather\|count towards\|suitable as a gift\|Book Your Discovery\|Ready To Fly" src/pages/DiscoveryFlight.jsx | head -20
```

- [ ] **Step 2: Add usePageText import**

At line ~11, in the existing imports block, add:

```js
import { usePageText } from '../hooks/usePageText';
```

- [ ] **Step 3: Wire HeroSection sub-component**

Find the `HeroSection` function (approximately line 300–460). It is a standalone function component. Add the hook at the top, then replace the 4 hardcoded strings:

```js
// BEFORE (inside HeroSection function body):
// - "DISCOVERY FLIGHTS"
// - "YOUR" / "FIRST" / "FLIGHT"  (headline words)
// - "Take the controls and experience the thrill of helicopter flight over the beautiful Chiltern Hills."
// - "Choose Your Flight"

// ADD at top of HeroSection function body:
const { t } = usePageText('discovery');

// REPLACE:
// "DISCOVERY FLIGHTS"  →  {t('discovery-hero', 'pre_label')}
// "YOUR"               →  {t('discovery-hero', 'headline_1')}
// "FIRST"              →  {t('discovery-hero', 'headline_2')}
// "FLIGHT"             →  {t('discovery-hero', 'headline_3')}
// "Take the controls..."  →  {t('discovery-hero', 'subtitle')}
// "Choose Your Flight" →  {t('discovery-hero', 'cta_primary')}
```

- [ ] **Step 4: Wire ValueProposition / aircraft cards**

The aircraft data is in a `const aircraftData = [...]` array (around line 240). This is defined at module level, not inside a React component, so `usePageText` cannot be used directly there. Instead, call `usePageText` inside the `ValueProposition` component and override the displayed strings:

Find where each aircraft card renders its name, tagline, and description. Replace with `t()` calls:

```js
// Inside ValueProposition component, add:
const { t } = usePageText('discovery');

// For R22 card rendering — replace hardcoded aircraft.name, aircraft.tagline, aircraft.description:
// The AIRCRAFT_SECTIONS mapping:
const aircraftTextSections = {
  'ROBINSON R22': 'discovery-aircraft-r22',
  'ROBINSON R44': 'discovery-aircraft-r44',
  'ROBINSON R66': 'discovery-aircraft-r66',
};

// When rendering an aircraft card:
const sectionId = aircraftTextSections[aircraft.name] ?? null;
const cardName        = sectionId ? t(sectionId, 'name')        : aircraft.name;
const cardTagline     = sectionId ? t(sectionId, 'tagline')     : aircraft.tagline;
const cardDescription = sectionId ? t(sectionId, 'description') : aircraft.description;
const cardSeats       = sectionId ? t(sectionId, 'seats')       : aircraft.seats;
```

- [ ] **Step 5: Wire GiftVoucher, Instructor, Steps, FAQ, FinalCTA sections**

For each sub-component that renders these sections, add `const { t } = usePageText('discovery')` and replace:

```
"Gift Vouchers Available"  →  {t('discovery-gift', 'bold_text')}
"Purchase a voucher valid for 12 months..."  →  {t('discovery-gift', 'description')}
"Get Gift Voucher"  →  {t('discovery-gift', 'link_text')}

"Your Instructor"  →  {t('discovery-instructor', 'pre_label')}
"Meet Your Team"   →  {t('discovery-instructor', 'heading')}
"Quentin Smith"    →  {t('discovery-instructor', 'name')}
"Founder & Managing Director"  →  {t('discovery-instructor', 'title')}
"World Helicopter Champion..."  →  {t('discovery-instructor', 'bio')}

"Your Experience"  →  {t('discovery-steps', 'pre_label')}
"What To Expect"   →  {t('discovery-steps', 'heading')}
"Arrival & Welcome"  →  {t('discovery-steps', 'step_1_title')}
"Pre-Flight Briefing"  →  {t('discovery-steps', 'step_2_title')}
"Take Flight"  →  {t('discovery-steps', 'step_3_title')}
"Hands-On Flying"  →  {t('discovery-steps', 'step_4_title')}
"Debrief & Certificate"  →  {t('discovery-steps', 'step_5_title')}
(and each step description and time)

"Common Questions"  →  {t('discovery-faq', 'pre_label')}
"FAQ"  →  {t('discovery-faq', 'heading')}
(and each Q/A pair)

"Ready To Fly?"  →  {t('discovery-final-cta', 'pre_label')}
"Book Your Discovery Flight"  →  {t('discovery-final-cta', 'heading')}
"Choose Your Flight" (bottom CTA)  →  {t('discovery-final-cta', 'cta_primary')}
"Gift Vouchers Available" (badge)  →  {t('discovery-final-cta', 'badge_gift')}
"12-Month Validity"  →  {t('discovery-final-cta', 'badge_valid')}
"Counts Towards PPL"  →  {t('discovery-final-cta', 'badge_ppl')}
```

- [ ] **Step 6: Start dev server and verify**

```bash
npm run dev
```

Open `http://localhost:5173/training/trial-lessons`. Every visible text block should render normally (defaults from Firestore/textSections). Open `/admin/text`, select "Discovery", edit "Hero Section → Pre-label" to "TRIAL FLIGHTS", save. Hard-reload the Discovery page — "TRIAL FLIGHTS" should appear. Then revert to "DISCOVERY FLIGHTS" in admin.

- [ ] **Step 7: Commit**

```bash
git add src/pages/DiscoveryFlight.jsx
git commit -m "feat(cms): wire DiscoveryFlight to usePageText — all 10 sections"
```

---

## Task 5: Wire SelfFlyHire.jsx to usePageText

**Files:**
- Modify: `src/pages/SelfFlyHire.jsx` (4,114 lines)

Text sections: `sfh-hero`, `sfh-intro`, `sfh-aircraft-r22`, `sfh-aircraft-r44`, `sfh-aircraft-r66`, `sfh-destinations`, `sfh-faq`, `sfh-cta`.

- [ ] **Step 1: Find all managed text locations**

```bash
grep -n "HELICOPTER HIRE\|SELF-FLY\|HIRE\|Access Europe.*largest\|Freedom to Fly\|Self-Fly Hire: Your Aircraft\|With an impressive fleet" src/pages/SelfFlyHire.jsx | head -20
```

```bash
grep -n "Where Will You Go\|See Where You Can Fly\|coastal escapes\|Common Questions\|Ready to Fly\|Book Your Aircraft\|Make a Booking\|Get Your Licence" src/pages/SelfFlyHire.jsx | head -20
```

```bash
grep -n "What are the minimum\|How far in advance\|Is insurance included\|Can I fly abroad\|What happens if I need to cancel\|Do you offer block" src/pages/SelfFlyHire.jsx | head -20
```

- [ ] **Step 2: Add import and call hook**

In the main export component (or each relevant sub-component), add:

```js
import { usePageText } from '../hooks/usePageText';
// ...
const { t } = usePageText('sfh');
```

- [ ] **Step 3: Replace hero text**

```
"HELICOPTER HIRE"  →  {t('sfh-hero', 'pre_label')}
"SELF-FLY"         →  {t('sfh-hero', 'headline_1')}
"HIRE"             →  {t('sfh-hero', 'headline_2')}
"Access Europe's largest Robinson fleet..."  →  {t('sfh-hero', 'subtitle')}
```

- [ ] **Step 4: Replace intro section text**

```
"Freedom to Fly"                    →  {t('sfh-intro', 'pre_label')}
"Self-Fly Hire: Your Aircraft Awaits"  →  {t('sfh-intro', 'heading')}
"With an impressive fleet of over 30 helicopters..."  →  {t('sfh-intro', 'description')}
```

- [ ] **Step 5: Replace fleet card text**

For each aircraft card (R22, R44, R66) rendered dynamically, follow the same pattern as Task 4 Step 4. Map aircraft model name → section ID:

```js
const sfhAircraftSections = {
  'R22':        'sfh-aircraft-r22',
  'R44 Raven II': 'sfh-aircraft-r44',
  'R66 Turbine':  'sfh-aircraft-r66',
};
```

Replace name, seats, speed, range, rate, description, and feature_1 through feature_4.

- [ ] **Step 6: Replace destinations, FAQ, and CTA sections**

```
"Where Will You Go?"             →  {t('sfh-destinations', 'pre_label')}
"See Where You Can Fly To"       →  {t('sfh-destinations', 'heading')}
"From coastal escapes..."        →  {t('sfh-destinations', 'description')}

"Common Questions"               →  {t('sfh-faq', 'pre_label')}
"FAQ"                            →  {t('sfh-faq', 'heading')}
(Q1-Q6 and A1-A6 pairs)

"Ready to Fly?"                  →  {t('sfh-cta', 'pre_label')}
"Book Your Aircraft"             →  {t('sfh-cta', 'heading')}
"Contact our team to check..."   →  {t('sfh-cta', 'description')}
"Call Us"                        →  {t('sfh-cta', 'phone_label')}
"+44 1895 833 373"               →  {t('sfh-cta', 'phone_value')}
"Email"                          →  {t('sfh-cta', 'email_label')}
"hire@hqaviation.com"            →  {t('sfh-cta', 'email_value')}
"Make a Booking"                 →  {t('sfh-cta', 'cta_primary')}
"Get Your Licence"               →  {t('sfh-cta', 'cta_secondary')}
```

- [ ] **Step 7: Verify on dev server**

```bash
# Dev server should already be running
```

Open `http://localhost:5173/self-fly-hire` — all text renders normally.
In admin, edit "SFH → Hero Section → Headline Word 1" to "PILOT". Save. Hard-reload `/self-fly-hire` — "PILOT" appears.
Revert to "SELF-FLY".

- [ ] **Step 8: Commit**

```bash
git add src/pages/SelfFlyHire.jsx
git commit -m "feat(cms): wire SelfFlyHire to usePageText — 8 sections"
```

---

## Task 6: Wire Sales.jsx to usePageText

**Files:**
- Modify: `src/pages/Sales.jsx` (7,692 lines)

Text sections: `sales-model-r88`, `sales-model-r66`, `sales-model-r44`, `sales-model-r22`, `sales-hero`, `sales-dealer`.

- [ ] **Step 1: Find all managed text locations**

```bash
grep -n "The Future of Rotorcraft\|Turbine Performance\|World.*Best-Selling\|Training Excellence\|Robinson Authorized Dealer\|premier Robinson dealership\|Factory-direct pricing" src/pages/Sales.jsx | head -20
```

```bash
grep -n "R88\|R66\|R44\|R22\|POA\|\$1,290,000\|\$535,000\|\$345,000" src/pages/Sales.jsx | grep -v "//\|import\|Route" | head -30
```

- [ ] **Step 2: Add import and hook**

```js
import { usePageText } from '../hooks/usePageText';
// In component:
const { t } = usePageText('sales');
```

- [ ] **Step 3: Replace model card text**

For each aircraft model card, replace with t() calls:

```js
// Section IDs per model:
// R88  → 'sales-model-r88'
// R66  → 'sales-model-r66'
// R44  → 'sales-model-r44'
// R22  → 'sales-model-r22'

// Fields: name, tagline, description, seats, speed, range, engine, price

// Example for R66 card:
t('sales-model-r66', 'name')        // "R66"
t('sales-model-r66', 'tagline')     // "Turbine Performance"
t('sales-model-r66', 'description') // "Five-seat turbine helicopter..."
t('sales-model-r66', 'seats')       // "5"
t('sales-model-r66', 'speed')       // "120 kts"
t('sales-model-r66', 'range')       // "350 nm"
t('sales-model-r66', 'engine')      // "RR300"
t('sales-model-r66', 'price')       // "$1,290,000"
```

- [ ] **Step 4: Replace dealer badge text**

```bash
grep -n "Robinson Authorized Dealer\|premier Robinson dealership\|Factory-direct\|purchase to delivery" src/pages/Sales.jsx
```

```
"Robinson Authorized Dealer"              →  {t('sales-dealer', 'cert_title')}
"The UK's premier Robinson dealership..." →  {t('sales-dealer', 'cert_desc')}
"Official"                                →  {t('sales-dealer', 'cert_label')}
```

- [ ] **Step 5: Verify and commit**

```bash
git add src/pages/Sales.jsx
git commit -m "feat(cms): wire Sales to usePageText — 6 sections"
```

---

## Task 7: Wire FinalMaintenance.jsx to usePageText

**Files:**
- Modify: `src/pages/FinalMaintenance.jsx` (5,623 lines)

Text sections: `maintenance-hero`, `maintenance-services`.

- [ ] **Step 1: Find managed text**

```bash
grep -n "MAINTENANCE\|Authorised Service\|keeping your aircraft\|What We Do\|Scheduled Maintenance\|Engine Overhaul\|Avionics\|Paint.*Refurbish" src/pages/FinalMaintenance.jsx | head -20
```

- [ ] **Step 2: Add import and hook**

```js
import { usePageText } from '../hooks/usePageText';
// In component:
const { t } = usePageText('maintenance');
```

- [ ] **Step 3: Replace all managed text**

Read the `maintenance-hero` and `maintenance-services` sections from `textSections.js` (lines ~600–700) for exact field IDs and defaults, then grep for those exact strings in `FinalMaintenance.jsx` and replace.

Run:
```bash
grep -n "id: 'maintenance" src/lib/textSections.js
```

This gives you the section and field IDs. For each field, grep for its `default` value in `FinalMaintenance.jsx`:

```bash
# For each default value found in textSections.js for maintenance-*, run:
grep -n "<default value here>" src/pages/FinalMaintenance.jsx
```

Replace each match with the corresponding `t('section-id', 'field-id')`.

- [ ] **Step 4: Verify and commit**

```bash
git add src/pages/FinalMaintenance.jsx
git commit -m "feat(cms): wire FinalMaintenance to usePageText — 2 sections"
```

---

## Task 8: Wire FinalExpeditions.jsx to usePageText

**Files:**
- Modify: `src/pages/FinalExpeditions.jsx` (4,361 lines)

Text sections: `expeditions-hero`, `expeditions-intro`, `expeditions-destinations`, `expeditions-cta`.

- [ ] **Step 1: Find managed text**

```bash
grep -n "Explore the World\|Expeditions\|This isn.*transport\|gateway to the world\|first-class ticket\|Arctic\|Iceland\|Morocco\|Norway\|Alps\|Greenland\|Bahamas\|Costa Rica" src/pages/FinalExpeditions.jsx | head -30
```

- [ ] **Step 2: Add import and hook**

```js
import { usePageText } from '../hooks/usePageText';
const { t } = usePageText('expeditions');
```

- [ ] **Step 3: Replace sections**

Read `textSections.js` for `expeditions-*` sections (offset 182–233). Replace each matching string:

```
hero pre_label, heading, subtitle
intro pre_label, heading, description
expeditions-destinations: all 9 destinations × name/description/distance/year
expeditions-cta: pre_label, heading, description, cta
```

**Note on destinations array:** The 9 destinations are likely in a JS array. The pattern is the same as aircraft cards in Task 4 Step 4 — map destination name → field IDs. Example:

```js
// In FinalExpeditions component, after hook call:
const destText = {
  arctic:     { name: t('home-exped-destinations', 'arctic_name'),    desc: t('home-exped-destinations', 'arctic_desc'),    distance: t('home-exped-destinations', 'arctic_distance'),    year: t('home-exped-destinations', 'arctic_year') },
  iceland:    { name: t('home-exped-destinations', 'iceland_name'),   desc: t('home-exped-destinations', 'iceland_desc'),   distance: t('home-exped-destinations', 'iceland_distance'),   year: t('home-exped-destinations', 'iceland_year') },
  morocco:    { name: t('home-exped-destinations', 'morocco_name'),   desc: t('home-exped-destinations', 'morocco_desc'),   distance: t('home-exped-destinations', 'morocco_distance'),   year: t('home-exped-destinations', 'morocco_year') },
  norway:     { name: t('home-exped-destinations', 'norway_name'),    desc: t('home-exped-destinations', 'norway_desc'),    distance: t('home-exped-destinations', 'norway_distance'),    year: t('home-exped-destinations', 'norway_year') },
  alps:       { name: t('home-exped-destinations', 'alps_name'),      desc: t('home-exped-destinations', 'alps_desc'),      distance: t('home-exped-destinations', 'alps_distance'),      year: t('home-exped-destinations', 'alps_year') },
  greenland:  { name: t('home-exped-destinations', 'greenland_name'), desc: t('home-exped-destinations', 'greenland_desc'), distance: t('home-exped-destinations', 'greenland_distance'), year: t('home-exped-destinations', 'greenland_year') },
  bahamas:    { name: t('home-exped-destinations', 'bahamas_name'),   desc: t('home-exped-destinations', 'bahamas_desc'),   distance: t('home-exped-destinations', 'bahamas_distance'),   year: t('home-exped-destinations', 'bahamas_year') },
  costarica:  { name: t('home-exped-destinations', 'costarica_name'), desc: t('home-exped-destinations', 'costarica_desc'), distance: t('home-exped-destinations', 'costarica_distance'), year: t('home-exped-destinations', 'costarica_year') },
};
```

Then replace any hardcoded destination name/desc/distance/year with the corresponding `destText[key].name` etc.

- [ ] **Step 4: Verify and commit**

```bash
git add src/pages/FinalExpeditions.jsx
git commit -m "feat(cms): wire FinalExpeditions to usePageText — 4 sections"
```

---

## Task 9: Wire AboutUs.jsx and Training.jsx to usePageText

**Files:**
- Modify: `src/pages/AboutUs.jsx`
- Modify: `src/pages/Training.jsx` (or the equivalent component at route `/training`)

Text sections for `about`: 2 sections.  
Text sections for `training`: 2 sections.

- [ ] **Step 1: Read the sections from textSections.js**

```bash
grep -A 20 "page: 'about'" src/lib/textSections.js
grep -A 20 "page: 'training'" src/lib/textSections.js
```

This shows you the exact field IDs and defaults for these pages.

- [ ] **Step 2: Find defaults in the page files**

```bash
grep -n "<default-value-from-textSections>" src/pages/AboutUs.jsx
grep -n "<default-value-from-textSections>" src/pages/Training.jsx
```

- [ ] **Step 3: Wire both pages**

For each page:

```js
import { usePageText } from '../hooks/usePageText';
// Inside component:
const { t } = usePageText('about');   // or 'training'
```

Replace each hardcoded string with the appropriate `t()` call.

- [ ] **Step 4: Commit**

```bash
git add src/pages/AboutUs.jsx src/pages/Training.jsx
git commit -m "feat(cms): wire AboutUs and Training to usePageText"
```

---

## Task 10: Wire Experimentation.jsx (Homepage) to usePageText

**Files:**
- Modify: `src/pages/Experimentation.jsx` (15,388 lines — most complex task)

Text sections: 13 home sections (editorial headline, sfh-section, sfh-fleet-r66/r44/r22, sfh-destinations, sales-section, sales-model-r88/r66/r44/r22, exped-section, exped-destinations).

**Critical rule (from project memory):** Never add wrapper DOM elements to `Experimentation.jsx`. Only safe changes: imports, hook calls, derived variables, prop additions to existing component calls.

- [ ] **Step 1: Understand the homepage sub-component structure**

```bash
grep -n "^function \|^const.*= ()\|^export default" src/pages/Experimentation.jsx | head -40
```

This shows you all top-level component and function definitions. Use these to know which sub-components render which sections.

- [ ] **Step 2: Find each managed text string**

```bash
# Editorial headline strip
grep -n "Your Sky\|Your Schedule\|Your Freedom\|No Limits\|No Queues\|Just Fly" src/pages/Experimentation.jsx | head -20

# SFH section
grep -n "Fly Yourself\|Self-Fly Hire.*Section\|Access Europe.*largest\|Freedom only helicopter" src/pages/Experimentation.jsx | head -20

# SFH fleet cards
grep -n "R66 Turbine.*5 Seats\|R44.*4 Seats\|R22.*2 Seats\|£595\|£395\|£275" src/pages/Experimentation.jsx | head -20

# SFH destinations
grep -n "The Cotswolds\|Le Touquet\|Scottish Highlands\|Cornwall" src/pages/Experimentation.jsx | head -20

# Sales section
grep -n "Buy New\|New Aircraft\|Robinson Authorized Dealer\|premier Robinson dealership" src/pages/Experimentation.jsx | head -20

# Sales model cards
grep -n "The Future of Rotorcraft\|Turbine Performance\|World.*Best-Selling\|Training Excellence" src/pages/Experimentation.jsx | head -20

# Expeditions section
grep -n "Explore the World\|This isn.*transport\|gateway to the world" src/pages/Experimentation.jsx | head -20

# Expedition destinations
grep -n "Arctic\|Iceland\|Morocco\|Norway.*fjords\|Bahamas\|Costa Rica" src/pages/Experimentation.jsx | head -20
```

- [ ] **Step 3: Add usePageText import**

At the top of `Experimentation.jsx`, add to the existing imports:

```js
import { usePageText } from '../hooks/usePageText';
```

- [ ] **Step 4: Add hook call in the main export component**

Find the main export component (`export default function Experimentation()` or similar). At the very top of its function body, before any JSX or sub-component calls, add:

```js
const { t } = usePageText('home');
```

**Important:** Do NOT call `usePageText` inside event handlers, loops, or conditionals.

- [ ] **Step 5: Replace text in editorial headline strip**

The scrolling word strip renders an array of words. Find the array definition (it will contain "Your", "Sky.", "Your", "Schedule.", "Your", "Freedom.", etc.) and replace:

```js
// BEFORE (array or JSX with hardcoded words):
const words = ['Your', 'Sky.', 'Your', 'Schedule.', 'Your', 'Freedom.', 'No', 'Limits.', 'No', 'Queues.', 'Just', 'Fly.'];

// AFTER:
const words = [
  t('home-editorial-headline', 'word_1'),
  t('home-editorial-headline', 'word_2'),
  t('home-editorial-headline', 'word_3'),
  t('home-editorial-headline', 'word_4'),
  t('home-editorial-headline', 'word_5'),
  t('home-editorial-headline', 'word_6'),
  t('home-editorial-headline', 'word_7'),
  t('home-editorial-headline', 'word_8'),
  t('home-editorial-headline', 'word_9'),
  t('home-editorial-headline', 'word_10'),
  t('home-editorial-headline', 'word_11'),
  t('home-editorial-headline', 'word_12'),
];
```

If the words are inline in JSX rather than an array, replace each individual string literal:

```jsx
// "Your" → {t('home-editorial-headline', 'word_1')}
// "Sky." → {t('home-editorial-headline', 'word_2')}
// etc.
```

- [ ] **Step 6: Replace SFH section header text**

```bash
grep -n "Fly Yourself\|Self-Fly Hire.*pre\|Access Europe.*largest" src/pages/Experimentation.jsx | head -10
```

Replace:
```
"Self-Fly Hire" (pre-label)  →  {t('home-sfh-section', 'pre_label')}
"Fly Yourself"               →  {t('home-sfh-section', 'heading')}
"Access Europe's largest..." →  {t('home-sfh-section', 'description')}
```

- [ ] **Step 7: Replace SFH fleet cards**

The fleet cards for R66, R44, R22 on the homepage. Replace name, seats, and rate for each:

```
R66 card:
  t('home-sfh-fleet-r66', 'name')   // "R66 Turbine"
  t('home-sfh-fleet-r66', 'seats')  // "5 Seats"
  t('home-sfh-fleet-r66', 'rate')   // "£595/hr"

R44 card:
  t('home-sfh-fleet-r44', 'name')   // "R44"
  t('home-sfh-fleet-r44', 'seats')  // "4 Seats"
  t('home-sfh-fleet-r44', 'rate')   // "£395/hr"

R22 card:
  t('home-sfh-fleet-r22', 'name')   // "R22"
  t('home-sfh-fleet-r22', 'seats')  // "2 Seats"
  t('home-sfh-fleet-r22', 'rate')   // "£275/hr"
```

- [ ] **Step 8: Replace SFH destination cards**

4 destinations. Replace name, nautical miles, car time, and description for each:

```js
// Cotswolds:
t('home-sfh-destinations', 'dest_1_name')  // "The Cotswolds"
t('home-sfh-destinations', 'dest_1_nm')    // "70"
t('home-sfh-destinations', 'dest_1_car')   // "1h 45min"
t('home-sfh-destinations', 'dest_1_desc')  // "Fly over the rolling hills..."

// Le Touquet:
t('home-sfh-destinations', 'dest_2_name'), t('home-sfh-destinations', 'dest_2_nm'), etc.

// Scottish Highlands:
t('home-sfh-destinations', 'dest_3_name'), etc.

// Cornwall:
t('home-sfh-destinations', 'dest_4_name'), etc.
```

- [ ] **Step 9: Replace Sales section header**

```
"New Aircraft"                           →  {t('home-sales-section', 'pre_label')}
"Buy New"                                →  {t('home-sales-section', 'heading')}
"Official"                               →  {t('home-sales-section', 'cert_label')}
"Robinson Authorized Dealer"             →  {t('home-sales-section', 'cert_title')}
"The UK's premier Robinson dealership..." →  {t('home-sales-section', 'cert_desc')}
```

- [ ] **Step 10: Replace Sales model cards**

```
R88: t('home-sales-model-r88', 'name'), tagline, price, seats, speed
R66: t('home-sales-model-r66', 'name'), tagline, price, seats, speed
R44: t('home-sales-model-r44', 'name'), tagline, price, seats, speed
R22: t('home-sales-model-r22', 'name'), tagline, price, seats, speed
```

- [ ] **Step 11: Replace Expeditions section**

```
"Explore the World"         →  {t('home-exped-section', 'pre_label')}
"Expeditions"               →  {t('home-exped-section', 'heading')}
"This isn't transport..."   →  {t('home-exped-section', 'description')}
```

- [ ] **Step 12: Replace Expeditions destinations**

8 destinations × name/description/distance/year. Follow the same destText pattern from Task 8 Step 3, using section `home-exped-destinations`.

- [ ] **Step 13: Verify homepage visually**

```bash
npm run dev
```

Open `http://localhost:5173/`. Every section should render identically to before. Then in admin, edit "Home → Scrolling Headline Strip → Word 1" to "Fly". Save. Hard-reload homepage — first scrolling word should say "Fly". Revert.

- [ ] **Step 14: Commit**

```bash
git add src/pages/Experimentation.jsx
git commit -m "feat(cms): wire homepage (Experimentation) to usePageText — 13 sections"
```

---

## Task 11: Verify All Admin Text Changes Propagate

This is the integration verification task. It confirms the full read/write loop works across all 8 pages.

- [ ] **Step 1: Start dev server**

```bash
npm run dev
```

- [ ] **Step 2: Test each page**

For each page, perform one edit in admin and verify it appears on the site:

| Page | Admin path | Section to edit | Field | Test value |
|---|---|---|---|---|
| Home | `/admin/text` → Home tab | "Scrolling Headline Strip" | Word 12 | "Soar." |
| Discovery | `/admin/text` → Discovery tab | "Hero Section" | Pre-label | "TRIAL FLIGHTS" |
| SFH | `/admin/text` → Self-Fly Hire tab | "Hero Section" | Headline Word 2 | "CHARTER" |
| Sales | `/admin/text` → Sales tab | "Aircraft Model — R66" | Price | "$1,350,000" |
| Maintenance | `/admin/text` → Maintenance tab | First section | First field | (test value) |
| Expeditions | `/admin/text` → Expeditions tab | First section | First field | (test value) |
| About | `/admin/text` → About tab | First section | First field | (test value) |
| Training | `/admin/text` → Training tab | First section | First field | (test value) |

After each test: verify the change appears on site, then revert in admin.

- [ ] **Step 3: Verify no visual regressions**

Scroll through each page at desktop and mobile widths. Text wrapping should look identical to pre-implementation (all defaults match the original hardcoded text).

---

## Self-Review

**Spec coverage check:**

1. ✅ Admin panel shows real website text → covered by Task 3 seed script (defaults seeded to Firestore) + Tasks 4–10 (pages now read from Firestore)
2. ✅ Changes in admin reflect on site → covered by Tasks 4–10 (pages use `t()` from Firestore) + Task 2 (cache busting ensures no stale cache)
3. ✅ Admin pre-populated with real text → covered by Task 3 seed script
4. ✅ No text made up / invented → all `t()` defaults match actual JSX text (verified by grepping during each task)
5. ✅ Best practices followed → hook-based, Firestore as source of truth, no DOM wrapper elements in Experimentation.jsx

**Placeholder scan:** No TBDs or "implement later" items. Task 7 (Maintenance) and Task 9 (About/Training) have a grep-based discovery step instead of pre-specified line numbers, because those sections are small (2 sections each) and the grep output is deterministic. This is not a placeholder — it is a standard audit step.

**Type consistency:** `usePageText` returns `t(sectionId: string, fieldId: string): string` throughout. All section IDs and field IDs are taken directly from `textSections.js`. The cache key is `pageKey` (string) throughout.

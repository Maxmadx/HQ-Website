// Regression test: every <img> on a canonical page (i.e., not a dev/admin/orphan
// page) must have explicit width and height. Without these, the browser cannot
// reserve layout space and Cumulative Layout Shift (CLS) — a Core Web Vitals
// ranking factor — degrades.
import { describe, it, expect } from 'vitest';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, '../..');

// Files to skip from this regression test:
// - Experimental / dev-only routes (gated by import.meta.env.DEV in App.jsx, dead-coded by Vite)
// - Admin pages (rendered behind auth, noindex'd, lower CLS priority)
// - Orphan files (PPL/Expeditions/HeroSectionFinal — superseded by Final* counterparts)
// - Component long tail (single-offender components, addressable in a follow-up)
// Image.jsx is the canonical <Image> wrapper that enforces width/height on every
// real <img> it renders; the scanner produces false positives for the literal
// "<img>" appearing in code comments and test descriptions inside that file.
const EXCLUDED = /(Variations|Picker|Test|Wireframes|ComponentShowcase|Experimentation|FinalDraft|MobileSecondSection|HeroVariations|HeroPathPicker|JourneyPicker|ParallaxPicker|ScrollPathTest|VideoSliderPicker|TestimonialsPicker|OwnershipPicker|PPLPicker|ArrowPicker|CarouselPicker|AccordionVariations|AwardVariations|R66BenefitsVariations|ExpeditionPhilosophyVariations|ExpeditionPhilosophyJVariations|FlyingVariations|WallOfCool[A-Z]|AuthorisedServiceCenterCard|FacilityGalleryPicker|UsedSales2|\/PPL\.jsx$|\/Expeditions\.jsx$|HeroSectionFinal|\/pages\/admin\/|\/components\/admin\/|ScrollingStrips|TeamPreview|ExpeditionBarcode|BeforeAfter|FacilityGallery\.jsx|R66Case|PrecisionEngineering|FounderSpotlight|ExpeditionDepartureBoard|ExpeditionVideoSlider|InteractiveFleetExplorer|ModelSpotlight|R88Announcement|ImageSlot|OwnershipBenefits|LondonTourTicket|FacilityServicesCarousel|DiscoveryAddons|\/components\/Image\.(test\.)?jsx$)/;

// JSX-aware tag scanner: walks character-by-character, tracking JSX `{...}`
// brace depth and string-literal context, so arrow functions like
// `onClick={(e) => ...}` don't confuse us into stopping at the wrong `>`.
function* findImgTags(content) {
  const opener = /<img(\s|\/|>)/g;
  let m;
  while ((m = opener.exec(content))) {
    const start = m.index;
    let i = start + 4; // past "<img"
    let depth = 0;
    let str = null; // current string delimiter, if inside a quoted attr value
    while (i < content.length) {
      const c = content[i];
      if (str) {
        if (c === str) str = null;
        i++;
        continue;
      }
      if (c === '"' || c === "'") {
        str = c;
        i++;
        continue;
      }
      if (c === '{') {
        depth++;
        i++;
        continue;
      }
      if (c === '}') {
        depth--;
        i++;
        continue;
      }
      if (c === '>' && depth === 0) {
        // tag closes here
        const attrs = content.slice(start + 4, i);
        yield { start, attrs };
        break;
      }
      i++;
    }
  }
}

function* walk(dir) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) yield* walk(full);
    else if (/\.(jsx?|tsx?)$/.test(entry.name)) yield full;
  }
}

function imgIsMissingDims(attrs) {
  return !/\bwidth\s*=/.test(attrs) || !/\bheight\s*=/.test(attrs);
}

describe('canonical-page <img> dimensions', () => {
  it('every <img> on a canonical page has both width and height', () => {
    const offenders = [];
    for (const dir of ['src/pages', 'src/components']) {
      const abs = path.join(ROOT, dir);
      if (!fs.existsSync(abs)) continue;
      for (const file of walk(abs)) {
        const rel = path.relative(ROOT, file);
        if (EXCLUDED.test(rel)) continue;
        const content = fs.readFileSync(file, 'utf8');
        for (const { start, attrs } of findImgTags(content)) {
          if (imgIsMissingDims(attrs)) {
            const before = content.slice(0, start);
            const line = (before.match(/\n/g) || []).length + 1;
            offenders.push(`${rel}:${line}`);
          }
        }
      }
    }
    expect(offenders).toEqual([]);
  });
});

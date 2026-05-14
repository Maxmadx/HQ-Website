// scripts/audit-word-count.mjs
//
// Spec 17 Phase A — count user-visible text per canonical page to spot
// thin-content pages (<300 words = Google may not index reliably).
//
// Heuristic: strip JSX, attributes, comments, strings inside expressions.
// Count remaining text content + alt text + aria-label content.
//
// Run: node scripts/audit-word-count.mjs > docs/audits/word-count.csv

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { PUBLIC_ROUTES } from '../src/lib/seoRoutes.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, '..');

const PATH_TO_FILE = {
  '/': 'src/pages/Experimentation.jsx',
  '/about-us': 'src/pages/AboutUs.jsx',
  '/training': 'src/pages/Training.jsx',
  '/training/ppl': 'src/pages/FinalPPL.jsx',
  '/training/type-rating': 'src/pages/TypeRating.jsx',
  '/training/night-rating': 'src/pages/NightRating.jsx',
  '/training/faq': 'src/pages/TrainingFAQ.jsx',
  '/maintenance': 'src/pages/FinalMaintenance.jsx',
  '/expeditions': 'src/pages/FinalExpeditions.jsx',
  '/sales/new': 'src/pages/Sales.jsx',
  '/sales/pre-owned': 'src/pages/UsedSales.jsx',
  '/aircraft/r22': 'src/pages/AircraftR22.jsx',
  '/aircraft/r44': 'src/pages/AircraftR44.jsx',
  '/aircraft/r66': 'src/pages/AircraftR66.jsx',
  '/aircraft/r88': 'src/pages/AircraftR88.jsx',
  '/helicopter-tour-of-london': 'src/pages/HelicopterTourOfLondon.jsx',
  '/superyacht-ops': 'src/pages/SuperYachtOps.jsx',
  '/pilot-provisioning': 'src/pages/PilotProvisioning.jsx',
  '/aircraft-consulting': 'src/pages/AircraftConsulting.jsx',
  '/parts': 'src/pages/Parts.jsx',
  '/self-fly-hire': 'src/pages/SelfFlyHire.jsx',
  '/fleet': 'src/pages/Fleet.jsx',
  '/store': 'src/pages/Misc.jsx',
  '/blog': 'src/pages/Blog.jsx',
  '/testimonials': 'src/pages/Testimonials.jsx',
};

function countWords(content) {
  let s = content.replace(/\/\*[\s\S]*?\*\//g, '').replace(/\/\/.*$/gm, '');
  s = s.replace(/^import .*?;$/gm, '');
  s = s.replace(/style=\{\{[^}]*\}\}/g, '');
  s = s.replace(/className=("[^"]*"|'[^']*')/g, '');
  s = s.replace(/data-[a-z-]+=("[^"]*"|'[^']*')/g, '');
  s = s.replace(/\b(key|ref|onClick|onChange|onSubmit|onMouseEnter|onMouseLeave)=\{[^}]*\}/g, '');
  const textNodes = [];
  for (const m of s.matchAll(/>([^<>{}]+)</g)) {
    const txt = m[1].trim();
    if (txt && !/^[\s\d.,;:()]+$/.test(txt)) textNodes.push(txt);
  }
  for (const m of s.matchAll(/(["'`])((?:(?=(\\?))\3.)*?)\1/g)) {
    const txt = m[2].trim();
    if (txt.length > 6 && /\s/.test(txt) && !/^[\/\.\w-]+$/.test(txt)) textNodes.push(txt);
  }
  const combined = textNodes.join(' ');
  const words = combined.split(/\s+/).filter((w) => /[A-Za-z]/.test(w) && w.length > 1);
  return words.length;
}

function csvEscape(s) {
  if (s == null) return '';
  const str = String(s);
  return /[",\n]/.test(str) ? `"${str.replace(/"/g, '""')}"` : str;
}

const rows = [['path', 'file', 'wordCount', 'isThin']];

let thin = 0;
let missing = 0;
for (const route of PUBLIC_ROUTES) {
  const file = PATH_TO_FILE[route.path];
  if (!file) {
    rows.push([route.path, '(unmapped)', '', '?']);
    missing++;
    continue;
  }
  const abs = path.join(ROOT, file);
  if (!fs.existsSync(abs)) {
    rows.push([route.path, file, '', '(file missing)']);
    continue;
  }
  const content = fs.readFileSync(abs, 'utf8');
  const count = countWords(content);
  const isThin = count < 300;
  if (isThin) thin++;
  rows.push([route.path, file, count, isThin ? 'TRUE' : 'FALSE']);
}

console.log(rows.map((row) => row.map(csvEscape).join(',')).join('\n'));
process.stderr.write(`Audited ${PUBLIC_ROUTES.length} routes. ${thin} flagged thin (<300 words). ${missing} unmapped (need PATH_TO_FILE entry).\n`);

// scripts/audit-page-meta.mjs
//
// Spec 17 Phase A — enumerate per-page meta state.
//
// Walks src/lib/seoRoutes.js#PUBLIC_ROUTES, looks up each path in
// src/lib/getMetaForPath.js, and outputs CSV: path, title, description,
// titleLen, descLen, isGeneric.
//
// "isGeneric" heuristic: title contains site name only OR description
// matches a default-looking pattern.
//
// Run: node scripts/audit-page-meta.mjs > docs/audits/page-meta.csv

import { PUBLIC_ROUTES } from '../src/lib/seoRoutes.js';
import { getMetaForPath } from '../src/lib/getMetaForPath.js';

const GENERIC_PATTERNS = [
  /^HQ Aviation$/i,
  /helicopter sales, maintenance, and pilot training/i,
];

function isGeneric(title, description) {
  if (!title || !description) return true;
  if (title === 'HQ Aviation') return true;
  for (const p of GENERIC_PATTERNS) {
    if (p.test(title) || p.test(description)) return true;
  }
  return false;
}

function csvEscape(s) {
  if (s == null) return '';
  const str = String(s);
  return /[",\n]/.test(str) ? `"${str.replace(/"/g, '""')}"` : str;
}

const rows = [['path', 'title', 'description', 'titleLen', 'descLen', 'isGeneric']];

for (const route of PUBLIC_ROUTES) {
  const meta = getMetaForPath(route.path) || {};
  rows.push([
    route.path,
    meta.title || '',
    meta.description || '',
    (meta.title || '').length,
    (meta.description || '').length,
    isGeneric(meta.title, meta.description) ? 'TRUE' : 'FALSE',
  ]);
}

console.log(rows.map((row) => row.map(csvEscape).join(',')).join('\n'));

const totalRoutes = rows.length - 1;
const generic = rows.slice(1).filter((r) => r[5] === 'TRUE').length;
process.stderr.write(`Audited ${totalRoutes} routes. ${generic} flagged as generic / missing meta.\n`);

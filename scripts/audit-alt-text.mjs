// scripts/audit-alt-text.mjs
//
// Spec 17 Phase A — enumerate <img> + <Image> alt-text state across
// src/pages and src/components.
//
// For each tag, classifies alt as:
//   empty       : alt="" or no alt
//   generic     : alt="image", "photo", "img", "picture" etc.
//   dynamic     : alt={var} (CMS-controlled, skip)
//   descriptive : alt="something specific"
//
// Output CSV: file, line, tagKind, altKind, altValue.
// Run: node scripts/audit-alt-text.mjs > docs/audits/alt-text.csv

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, '..');

const GENERIC_VALUES = new Set(['image', 'photo', 'img', 'picture', 'pic', 'icon', '']);

function* walk(dir) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) yield* walk(full);
    else if (/\.(jsx?|tsx?)$/.test(entry.name)) yield full;
  }
}

function* findImgTags(content) {
  const opener = /<(img|Image)(\s|\/|>)/g;
  for (const m of content.matchAll(opener)) {
    const start = m.index;
    const tagName = m[1];
    let i = start + tagName.length + 1;
    let depth = 0;
    let str = null;
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
      if (c === '{') { depth++; i++; continue; }
      if (c === '}') { depth--; i++; continue; }
      if (c === '>' && depth === 0) {
        const attrs = content.slice(start + tagName.length + 1, i);
        yield { start, attrs, tagName };
        break;
      }
      i++;
    }
  }
}

function classifyAlt(attrs) {
  const dyn = attrs.match(/\balt=\{([^}]+)\}/);
  if (dyn) return { kind: 'dynamic', value: dyn[1].trim() };
  const lit = attrs.match(/\balt=("([^"]*)"|'([^']*)')/);
  if (lit) {
    const value = (lit[2] ?? lit[3]) || '';
    if (GENERIC_VALUES.has(value.toLowerCase().trim())) {
      return { kind: 'generic', value };
    }
    return { kind: 'descriptive', value };
  }
  return { kind: 'empty', value: '' };
}

function csvEscape(s) {
  if (s == null) return '';
  const str = String(s);
  return /[",\n]/.test(str) ? `"${str.replace(/"/g, '""')}"` : str;
}

const rows = [['file', 'line', 'tag', 'altKind', 'altValue']];
let totals = { dynamic: 0, descriptive: 0, generic: 0, empty: 0 };

for (const dir of ['src/pages', 'src/components']) {
  const abs = path.join(ROOT, dir);
  if (!fs.existsSync(abs)) continue;
  for (const file of walk(abs)) {
    const rel = path.relative(ROOT, file);
    const content = fs.readFileSync(file, 'utf8');
    for (const { start, attrs, tagName } of findImgTags(content)) {
      const { kind, value } = classifyAlt(attrs);
      totals[kind]++;
      const before = content.slice(0, start);
      const line = (before.match(/\n/g) || []).length + 1;
      rows.push([rel, line, tagName, kind, value]);
    }
  }
}

console.log(rows.map((row) => row.map(csvEscape).join(',')).join('\n'));

process.stderr.write(`Audited ${rows.length - 1} img/Image tags:\n`);
process.stderr.write(`  descriptive: ${totals.descriptive}\n`);
process.stderr.write(`  dynamic    : ${totals.dynamic} (CMS-controlled, OK)\n`);
process.stderr.write(`  generic    : ${totals.generic} (needs rewrite)\n`);
process.stderr.write(`  empty      : ${totals.empty} (decorative or missing — review)\n`);

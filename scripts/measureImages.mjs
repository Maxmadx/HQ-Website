// scripts/measureImages.mjs
//
// D4 measurement orchestrator.
//
// Compares the page-load performance of the site with the image-
// optimisation manifest EMPTY (browser receives original un-optimised
// JPEG/PNG via <Image>'s plain-<img> fallback) vs POPULATED (browser
// receives AVIF/WebP variants via <picture> + srcset).
//
// Run: node scripts/measureImages.mjs

import { execFile, spawn } from 'node:child_process';
import { promisify } from 'node:util';
import { readFile, writeFile, copyFile, unlink } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { runLighthouse } from './lighthouseRunner.mjs';

const execFileP = promisify(execFile);

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, '..');
const MANIFEST = path.join(ROOT, 'public/assets/optimised/optimised-manifest.json');
const MANIFEST_BAK = MANIFEST + '.d4-backup';
const REPORT_DIR = path.join(ROOT, 'docs/superpowers/reports');
const RAW_REPORT = path.join(REPORT_DIR, '2026-05-12-image-optimisation-d4-raw.json');
const PORT = 8788;
const ORIGIN = `http://localhost:${PORT}`;
const RUNS_PER_PAGE = 3;

const PAGES = [
  { path: '/',                          label: 'home' },
  { path: '/aircraft-sales/new/r22',    label: 'r22' },
  { path: '/aircraft-sales/new/r44',    label: 'r44' },
  { path: '/aircraft-sales/used',       label: 'used-sales' },
  { path: '/final/ppl',                 label: 'ppl' },
];

async function buildOnly() {
  console.log('  → npx vite build (no prebuild)');
  await execFileP('npx', ['vite', 'build'], { cwd: ROOT, maxBuffer: 50 * 1024 * 1024 });
}

function startServe() {
  console.log(`  → npx serve dist -p ${PORT}`);
  const child = spawn(
    'npx',
    ['--yes', 'serve', 'dist', '-p', String(PORT), '--single', '--no-clipboard'],
    { cwd: ROOT, stdio: ['ignore', 'pipe', 'pipe'] }
  );
  return new Promise((resolve, reject) => {
    let buf = '';
    const onLine = (chunk) => {
      buf += chunk.toString();
      if (buf.includes(`http://localhost:${PORT}`) || buf.toLowerCase().includes('accepting connections')) {
        child.stdout.off('data', onLine);
        resolve(child);
      }
    };
    child.stdout.on('data', onLine);
    child.stderr.on('data', onLine);
    setTimeout(() => reject(new Error('serve startup timed out')), 20_000);
  });
}

function stopServe(child) {
  return new Promise((resolve) => {
    child.once('exit', () => resolve());
    child.kill('SIGTERM');
    setTimeout(() => { try { child.kill('SIGKILL'); } catch {} resolve(); }, 3000);
  });
}

async function measureAllPages() {
  const results = [];
  for (const page of PAGES) {
    console.log(`  ${page.label} — ${page.path}`);
    const r = await runLighthouse(`${ORIGIN}${page.path}`, { runs: RUNS_PER_PAGE });
    results.push({ ...page, ...r });
  }
  return results;
}

async function runPass(label, manifestContent) {
  console.log(`\n=== Pass: ${label} ===`);
  await writeFile(MANIFEST, manifestContent, 'utf8');
  await buildOnly();
  const child = await startServe();
  let measurements;
  try {
    measurements = await measureAllPages();
  } finally {
    await stopServe(child);
  }
  return { label, pages: measurements };
}

async function main() {
  if (!existsSync(MANIFEST)) {
    console.error(`Manifest not found at ${MANIFEST}. Run 'npm run prebuild' first.`);
    process.exit(1);
  }

  // Backup the real manifest BEFORE anything else
  await copyFile(MANIFEST, MANIFEST_BAK);
  const realManifest = await readFile(MANIFEST_BAK, 'utf8');
  const emptyManifest = JSON.stringify({ version: 1, sources: {} }, null, 2);

  let before, after;
  try {
    before = await runPass('before (manifest emptied → original images)', emptyManifest);
    after  = await runPass('after (manifest populated → AVIF/WebP/responsive)', realManifest);
  } finally {
    // Always restore the real manifest, even on error
    await copyFile(MANIFEST_BAK, MANIFEST);
    await unlink(MANIFEST_BAK);
    console.log('\n  → manifest restored');
  }

  const out = { runsPerPage: RUNS_PER_PAGE, timestamp: new Date().toISOString(), before, after };
  await writeFile(RAW_REPORT, JSON.stringify(out, null, 2), 'utf8');
  console.log(`\n  ✓ raw results → ${path.relative(ROOT, RAW_REPORT)}`);
}

main().catch((err) => {
  console.error('\n  ✗ measurement failed:', err.message);
  console.error('  Check that public/assets/optimised/optimised-manifest.json is intact.');
  process.exit(1);
});

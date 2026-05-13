// scripts/optimize-images.js
//
// CLI wrapper: invokes the imageOptimisation library on
// public/assets/images → public/assets/optimised. Wired to `npm run prebuild`
// so `npm run build` regenerates variants first.
//
// Run manually with: node scripts/optimize-images.js

import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { optimizeImages } from '../src/lib/imageOptimisation.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const REPO_ROOT = path.resolve(__dirname, '..');
const SOURCE_DIR = path.join(REPO_ROOT, 'public', 'assets', 'images');
const OPTIMISED_DIR = path.join(REPO_ROOT, 'public', 'assets', 'optimised');

const t0 = Date.now();
console.log(`[optimize-images] sources: ${path.relative(REPO_ROOT, SOURCE_DIR)}`);
console.log(`[optimize-images] output:  ${path.relative(REPO_ROOT, OPTIMISED_DIR)}`);

try {
  const summary = await optimizeImages(SOURCE_DIR, OPTIMISED_DIR);
  const elapsed = ((Date.now() - t0) / 1000).toFixed(1);
  console.log(`[optimize-images] processed: ${summary.processed}, cached: ${summary.cached}, skipped: ${summary.skipped}, variants: ${summary.totalVariants}, orphans-removed: ${summary.removed}, time: ${elapsed}s`);
} catch (err) {
  console.error('[optimize-images] failed:', err);
  process.exit(1);
}

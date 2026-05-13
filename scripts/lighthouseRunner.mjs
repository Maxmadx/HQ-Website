// scripts/lighthouseRunner.mjs
//
// Spawns `npx lighthouse <url> --output=json` and parses the result.
// `runLighthouse(url, { runs })` returns an object of median metrics
// across `runs` invocations. Median is more robust than mean against
// the occasional cold-Chrome outlier.

import { execFile } from 'node:child_process';
import { promisify } from 'node:util';
import { extractMetrics, median } from './lighthouseMetrics.mjs';

const execFileP = promisify(execFile);

const LH_FLAGS = [
  '--quiet',
  '--output=json',
  '--output-path=stdout',
  '--chrome-flags=--headless=new --no-sandbox --disable-gpu',
  '--throttling-method=simulate',
  '--only-categories=performance',
  '--preset=desktop',
];

async function runOnce(url) {
  const { stdout } = await execFileP(
    'npx',
    ['--yes', 'lighthouse@latest', url, ...LH_FLAGS],
    { maxBuffer: 50 * 1024 * 1024, timeout: 180_000 }
  );
  // Lighthouse writes one big JSON to stdout when --output-path=stdout.
  return JSON.parse(stdout);
}

export async function runLighthouse(url, { runs = 3 } = {}) {
  const samples = [];
  for (let i = 0; i < runs; i++) {
    process.stdout.write(`  run ${i + 1}/${runs}... `);
    const t0 = Date.now();
    const report = await runOnce(url);
    samples.push(extractMetrics(report));
    process.stdout.write(`${((Date.now() - t0) / 1000).toFixed(1)}s\n`);
  }
  return {
    url,
    runs,
    samples,
    median: {
      lcpMs:         Math.round(median(samples.map(s => s.lcpMs))),
      cls:           +median(samples.map(s => s.cls)).toFixed(4),
      tbtMs:         Math.round(median(samples.map(s => s.tbtMs))),
      speedIndexMs:  Math.round(median(samples.map(s => s.speedIndexMs))),
      interactiveMs: Math.round(median(samples.map(s => s.interactiveMs))),
      totalBytes:    Math.round(median(samples.map(s => s.totalBytes))),
      imageBytes:    Math.round(median(samples.map(s => s.imageBytes))),
      imageCount:    Math.round(median(samples.map(s => s.imageCount))),
    },
  };
}

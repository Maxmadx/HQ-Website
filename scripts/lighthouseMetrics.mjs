// scripts/lighthouseMetrics.mjs
//
// Pure helpers — extract a small dictionary of numbers from a Lighthouse
// JSON result, and compute the median across N runs. Kept separate from
// lighthouseRunner.mjs (which shells out to the Lighthouse CLI) so this
// stays unit-testable.

export function extractMetrics(report) {
  const audits = report?.audits || {};

  function num(key) {
    const v = audits[key]?.numericValue;
    return typeof v === 'number' ? v : 0;
  }

  const items = audits['network-requests']?.details?.items || [];
  let totalBytes = 0;
  let imageBytes = 0;
  let imageCount = 0;
  for (const item of items) {
    const size = Number(item.transferSize) || 0;
    totalBytes += size;
    if (item.resourceType === 'Image') {
      imageBytes += size;
      imageCount += 1;
    }
  }

  return {
    lcpMs:         num('largest-contentful-paint'),
    cls:           num('cumulative-layout-shift'),
    tbtMs:         num('total-blocking-time'),
    speedIndexMs:  num('speed-index'),
    interactiveMs: num('interactive'),
    totalBytes,
    imageBytes,
    imageCount,
  };
}

export function median(values) {
  if (!Array.isArray(values) || values.length === 0) {
    throw new Error('median requires a non-empty array');
  }
  const sorted = [...values].sort((a, b) => a - b);
  const mid = Math.floor(sorted.length / 2);
  return sorted.length % 2 ? sorted[mid] : (sorted[mid - 1] + sorted[mid]) / 2;
}

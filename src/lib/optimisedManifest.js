// src/lib/optimisedManifest.js
//
// Loads the build-time-generated optimised manifest as an ESM object.
// Vite resolves JSON imports natively. The shape is what D1's
// scripts/optimize-images.js writes.

import manifest from '../../public/assets/optimised/optimised-manifest.json';

export default manifest;

export function getManifestEntry(srcPath) {
  if (!srcPath || typeof srcPath !== 'string') return null;
  const rel = srcPath.replace(/^\/assets\/images\//, '');
  return manifest.sources?.[rel] ?? null;
}

// src/lib/imageOptimisation.js
import fs from 'node:fs/promises';
import path from 'node:path';

export const SOURCE_EXTS = new Set(['.jpg', '.jpeg', '.png', '.webp']);

/**
 * Recursively walk `rootDir` and return absolute paths to all source image files.
 * Skips directories whose basename matches any entry in `skipDirs`.
 */
export async function walkSources(rootDir, { skipDirs = [] } = {}) {
  const skip = new Set(skipDirs);
  const results = [];

  async function walk(dir) {
    let entries;
    try {
      entries = await fs.readdir(dir, { withFileTypes: true });
    } catch (err) {
      if (err.code === 'ENOENT') return;
      throw err;
    }
    for (const entry of entries) {
      const full = path.join(dir, entry.name);
      if (entry.isDirectory()) {
        if (skip.has(entry.name)) continue;
        await walk(full);
      } else if (entry.isFile()) {
        const ext = path.extname(entry.name).toLowerCase();
        if (SOURCE_EXTS.has(ext)) results.push(full);
      }
    }
  }

  await walk(rootDir);
  return results;
}

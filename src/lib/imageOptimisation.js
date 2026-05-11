// src/lib/imageOptimisation.js
import fs from 'node:fs/promises';
import path from 'node:path';
import sharp from 'sharp';

export const SOURCE_EXTS = new Set(['.jpg', '.jpeg', '.png', '.webp']);
export const SKIP_BELOW_BYTES = 50 * 1024;

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

/**
 * Inspect a source image and decide whether it should be optimised.
 * Returns: { srcPath, sizeBytes, mtimeMs, width, height, hasAlpha, format, skipReason }
 * skipReason is null if the source should be processed normally,
 * or a string explaining why it should be skipped (copied unchanged).
 */
export async function classifySource(srcPath) {
  const stat = await fs.stat(srcPath);
  const meta = await sharp(srcPath).metadata();
  const skipReason = stat.size < SKIP_BELOW_BYTES ? 'below-size-threshold' : null;
  return {
    srcPath,
    sizeBytes: stat.size,
    mtimeMs: stat.mtimeMs,
    width: meta.width,
    height: meta.height,
    hasAlpha: !!meta.hasAlpha,
    format: meta.format,
    skipReason,
  };
}

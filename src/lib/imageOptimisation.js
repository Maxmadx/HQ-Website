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

export const SIZES = [400, 800, 1200, 1600, 2400];

export const FORMAT_CONFIG = {
  avif: { quality: 50, effort: 6 },
  webp: { quality: 75 },
  jpeg: { quality: 80, mozjpeg: true, progressive: true },
  png: { compressionLevel: 9, palette: true },
};

/**
 * Generate one variant of `srcPath` at `width` in `format`, writing to
 * `outDir/<basename>-<width>.<ext>`. Returns { outPath, sizeBytes }.
 *
 * sharp's `withoutEnlargement: true` prevents upscaling — if the source
 * is narrower than the requested width, the output is clamped to source width.
 */
export async function generateVariant(srcPath, outDir, width, format) {
  const ext = format === 'jpeg' ? 'jpg' : format;
  const basename = path.basename(srcPath, path.extname(srcPath));
  const outPath = path.join(outDir, `${basename}-${width}.${ext}`);

  await fs.mkdir(outDir, { recursive: true });

  const config = FORMAT_CONFIG[format];
  if (!config) throw new Error(`Unknown format: ${format}`);

  const pipeline = sharp(srcPath).resize({ width, withoutEnlargement: true });
  await pipeline[format](config).toFile(outPath);

  const stat = await fs.stat(outPath);
  return { outPath, sizeBytes: stat.size };
}

/**
 * Generate a 16×16 base64-encoded AVIF placeholder for the source.
 * Returns a data URL string like `data:image/avif;base64,...`.
 * Used as a CSS background placeholder shown before the real image loads.
 */
export async function generateLqip(srcPath) {
  const buf = await sharp(srcPath)
    .resize(16, 16, { fit: 'cover' })
    .avif({ quality: 30, effort: 4 })
    .toBuffer();
  return `data:image/avif;base64,${buf.toString('base64')}`;
}

export const MANIFEST_FILENAME = 'optimised-manifest.json';

/**
 * Read the optimised-manifest.json. Returns { version, sources } even if the
 * file doesn't exist or is malformed — callers should not have to handle either.
 */
export async function readManifest(manifestPath) {
  try {
    const text = await fs.readFile(manifestPath, 'utf8');
    const parsed = JSON.parse(text);
    if (!parsed.sources) return { version: 1, sources: {} };
    return parsed;
  } catch (err) {
    return { version: 1, sources: {} };
  }
}

/**
 * Write the manifest atomically (write to temp file, then rename).
 * Atomic write prevents partial writes if the process is killed mid-write.
 */
export async function writeManifest(manifestPath, manifest) {
  await fs.mkdir(path.dirname(manifestPath), { recursive: true });
  const tmp = `${manifestPath}.tmp`;
  await fs.writeFile(tmp, JSON.stringify(manifest, null, 2) + '\n');
  await fs.rename(tmp, manifestPath);
}

const VARIANT_NAME_RE = /^(.+)-(\d+|lqip)\.(avif|webp|jpg|jpeg|png|txt)$/i;

/**
 * Walk `optimisedDir`, identify variant files whose corresponding source
 * (in `sourceDir`) no longer exists, delete them, and return their paths.
 * Preserves the manifest and any non-variant files.
 */
export async function collectOrphans(optimisedDir, sourceDir) {
  const removed = [];

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
        await walk(full);
        continue;
      }
      if (entry.name === MANIFEST_FILENAME || entry.name === '.gitkeep') continue;
      if (!entry.isFile()) continue;

      const match = entry.name.match(VARIANT_NAME_RE);
      if (!match) continue;
      const [, basename] = match;
      const relDir = path.relative(optimisedDir, dir);

      // Look for a matching source — try each plausible source extension.
      let sourceExists = false;
      for (const ext of ['.jpg', '.jpeg', '.png', '.webp']) {
        const candidate = path.join(sourceDir, relDir, `${basename}${ext}`);
        try { await fs.stat(candidate); sourceExists = true; break; } catch { /* try next */ }
      }
      if (!sourceExists) {
        await fs.unlink(full);
        removed.push(full);
      }
    }
  }

  await walk(optimisedDir);
  return removed;
}

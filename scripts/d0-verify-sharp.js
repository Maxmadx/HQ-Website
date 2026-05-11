'use strict';

const sharp = require('sharp');
const fs = require('fs');
const path = require('path');
const os = require('os');

async function main() {
  const repoRoot = path.resolve(__dirname, '..');

  const candidates = [
    'public/assets/images/logos/hq/hq-aviation-logo-black.png',
    'public/og-default.jpg',
  ];
  let sample = null;
  for (const c of candidates) {
    const full = path.join(repoRoot, c);
    if (fs.existsSync(full)) { sample = full; break; }
  }
  if (!sample) {
    // Fallback: pick any jpg/png from public/assets/images
    const walk = (dir) => {
      for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
        const f = path.join(dir, e.name);
        if (e.isDirectory()) {
          const result = walk(f);
          if (result) return result;
        } else if (/\.(jpe?g|png)$/i.test(e.name)) {
          return f;
        }
      }
      return null;
    };
    sample = walk(path.join(repoRoot, 'public/assets/images'));
  }
  if (!sample) throw new Error('No sample image found');

  console.log(`Sample: ${path.relative(repoRoot, sample)}`);

  const meta = await sharp(sample).metadata();
  console.log(`Metadata: format=${meta.format} width=${meta.width} height=${meta.height} hasAlpha=${meta.hasAlpha}`);

  const tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), 'sharp-spike-'));
  console.log(`Output: ${tmpDir}`);

  const fallbackFmt = meta.hasAlpha ? 'png' : 'jpeg';
  const fallbackExt = meta.hasAlpha ? 'png' : 'jpg';

  await sharp(sample).resize({ width: 800, withoutEnlargement: true }).avif({ quality: 50, effort: 6 }).toFile(path.join(tmpDir, 'sample-800.avif'));
  await sharp(sample).resize({ width: 800, withoutEnlargement: true }).webp({ quality: 75 }).toFile(path.join(tmpDir, 'sample-800.webp'));
  await sharp(sample).resize({ width: 800, withoutEnlargement: true })[fallbackFmt]({ quality: 80 }).toFile(path.join(tmpDir, `sample-800.${fallbackExt}`));

  for (const ext of ['avif', 'webp', fallbackExt]) {
    const out = path.join(tmpDir, `sample-800.${ext}`);
    const stats = fs.statSync(out);
    const outMeta = await sharp(out).metadata();
    console.log(`  ${ext}: ${stats.size} bytes, ${outMeta.width}x${outMeta.height}`);
  }

  const cacheDir = path.join(repoRoot, '.image-cache-test');
  fs.mkdirSync(cacheDir, { recursive: true });
  fs.writeFileSync(path.join(cacheDir, 'test.txt'), 'ok');
  fs.rmSync(cacheDir, { recursive: true, force: true });
  console.log('Disk cache write test: OK');

  console.log('\nsharp spike complete');
}

main().catch((err) => {
  console.error('sharp spike failed:', err.message);
  console.error(err.stack);
  process.exit(1);
});

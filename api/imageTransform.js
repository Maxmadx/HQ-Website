// api/imageTransform.js
'use strict';

const sharp = require('sharp');

const QUALITY = {
  avif: { quality: 50, effort: 4 }, // lower effort than build-time for speed
  webp: { quality: 75 },
  jpeg: { quality: 80, mozjpeg: true, progressive: true },
  png: { compressionLevel: 8, palette: true }, // lower compression than build-time
};

/**
 * Transform a source image buffer to the requested width and format.
 * Returns { buffer, contentType }.
 *
 * If format is 'jpeg' but the source has an alpha channel, output PNG instead
 * to preserve transparency. The caller's HTTP response content-type reflects
 * the actual format produced.
 */
async function transform({ buffer, width, format }) {
  const meta = await sharp(buffer).metadata();
  let effectiveFormat = format;
  if (format === 'jpeg' && meta.hasAlpha) {
    effectiveFormat = 'png';
  }
  const pipeline = sharp(buffer).resize({ width, withoutEnlargement: true });
  const opts = QUALITY[effectiveFormat];
  const outBuffer = await pipeline[effectiveFormat](opts).toBuffer();
  const contentType = `image/${effectiveFormat === 'jpeg' ? 'jpeg' : effectiveFormat}`;
  return { buffer: outBuffer, contentType };
}

module.exports = { transform, QUALITY };

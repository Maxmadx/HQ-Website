// api/image.js
'use strict';

const express = require('express');
const crypto = require('crypto');
const { createCache } = require('./imageCache');
const { validateSrc, validateWidth, validateFormat } = require('./imageValidation');
const { fetchSource } = require('./imageFetch');
const { transform } = require('./imageTransform');

const CACHE_MAX_BYTES = Number(process.env.IMAGE_CACHE_MAX_BYTES) || 100 * 1024 * 1024;
const CACHE_TTL_MS = Number(process.env.IMAGE_CACHE_TTL_MS) || 60 * 60 * 1000;

const cache = createCache({ maxBytes: CACHE_MAX_BYTES, ttlMs: CACHE_TTL_MS });

function cacheKey(src, width, format) {
  return crypto.createHash('sha1').update(`${src}|${width}|${format}`).digest('hex');
}

const router = express.Router();

router.get('/', async (req, res) => {
  const { src, w, fmt } = req.query;

  const srcCheck = validateSrc(src);
  if (!srcCheck.ok) return res.status(400).json({ error: srcCheck.error });

  const widthCheck = validateWidth(w);
  if (!widthCheck.ok) return res.status(400).json({ error: widthCheck.error });

  const formatCheck = validateFormat(fmt);
  if (!formatCheck.ok) return res.status(400).json({ error: formatCheck.error });

  const url = srcCheck.url;
  const width = widthCheck.value;
  const format = formatCheck.value;
  const key = cacheKey(url, width, format);

  const hit = cache.get(key);
  if (hit) {
    res.set('Content-Type', hit.contentType);
    res.set('Cache-Control', 'public, max-age=31536000, immutable');
    res.set('ETag', `"${key}"`);
    return res.send(hit.buffer);
  }

  try {
    const source = await fetchSource(url);
    const result = await transform({ buffer: source.buffer, width, format });
    cache.set(key, result, result.buffer.length);
    res.set('Content-Type', result.contentType);
    res.set('Cache-Control', 'public, max-age=31536000, immutable');
    res.set('ETag', `"${key}"`);
    return res.send(result.buffer);
  } catch (err) {
    const isFetch = /source fetch|source too large/.test(err.message || '');
    const status = isFetch ? 502 : 500;
    return res.status(status).json({ error: err.message || 'transform failed' });
  }
});

module.exports = router;
module.exports._cache = cache; // exposed for tests

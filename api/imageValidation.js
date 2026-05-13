// api/imageValidation.js
'use strict';

const ALLOWED_PROXY_HOSTS = new Set([
  'firebasestorage.googleapis.com',
  'storage.googleapis.com',
  'hqaviation.com',
  'www.hqaviation.com',
]);

const ALLOWED_WIDTHS = new Set([400, 800, 1200, 1600, 2400]);
const ALLOWED_FORMATS = new Set(['avif', 'webp', 'jpeg', 'png']);

function validateSrc(src) {
  if (typeof src !== 'string' || !src) return { ok: false, error: 'src must be a string' };
  let url;
  try {
    url = new URL(src);
  } catch {
    return { ok: false, error: 'src must be a valid URL' };
  }
  if (url.protocol !== 'https:') return { ok: false, error: 'src must use https' };
  if (!ALLOWED_PROXY_HOSTS.has(url.host)) return { ok: false, error: `src host not allowed: ${url.host}` };
  return { ok: true, url: url.toString() };
}

function validateWidth(w) {
  const n = typeof w === 'number' ? w : Number(w);
  if (!Number.isInteger(n)) return { ok: false, error: 'width must be an integer' };
  if (!ALLOWED_WIDTHS.has(n)) return { ok: false, error: `width must be one of ${[...ALLOWED_WIDTHS].join(', ')}` };
  return { ok: true, value: n };
}

function validateFormat(fmt) {
  if (typeof fmt !== 'string') return { ok: false, error: 'format must be a string' };
  const lower = fmt.toLowerCase();
  const normalized = lower === 'jpg' ? 'jpeg' : lower;
  if (!ALLOWED_FORMATS.has(normalized)) return { ok: false, error: `format must be one of ${[...ALLOWED_FORMATS].join(', ')}` };
  return { ok: true, value: normalized };
}

module.exports = {
  validateSrc,
  validateWidth,
  validateFormat,
  ALLOWED_PROXY_HOSTS,
  ALLOWED_WIDTHS,
  ALLOWED_FORMATS,
};

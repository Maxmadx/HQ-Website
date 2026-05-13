// src/lib/imageVariantUrl.js

const ALLOWED_PROXY_HOSTS = [
  'firebasestorage.googleapis.com',
  'storage.googleapis.com',
  'hqaviation.com',
  'www.hqaviation.com',
];

export function variantUrl(srcPath, width, format) {
  const ext = format === 'jpeg' ? 'jpg' : format;
  const noExt = srcPath.replace(/\.[^.]+$/, '');
  return noExt.replace('/assets/images/', '/assets/optimised/') + `-${width}.${ext}`;
}

export function isLocalPath(src) {
  return typeof src === 'string' && src.startsWith('/assets/images/');
}

export function isProxyableUrl(src) {
  if (typeof src !== 'string' || !/^https?:\/\//i.test(src)) return false;
  try {
    return ALLOWED_PROXY_HOSTS.includes(new URL(src).host);
  } catch {
    return false;
  }
}

export function buildSrcSet(srcPath, format, widths) {
  return widths.map(w => `${variantUrl(srcPath, w, format)} ${w}w`).join(', ');
}

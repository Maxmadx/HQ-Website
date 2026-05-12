// api/imageValidation.test.js
import { describe, it, expect } from 'vitest';
const {
  validateSrc,
  validateWidth,
  validateFormat,
  ALLOWED_PROXY_HOSTS,
  ALLOWED_WIDTHS,
  ALLOWED_FORMATS,
} = require('./imageValidation');

describe('validateSrc', () => {
  it('accepts Firebase Storage URLs', () => {
    const r = validateSrc('https://firebasestorage.googleapis.com/v0/b/x/o/y');
    expect(r.ok).toBe(true);
    expect(r.url).toBe('https://firebasestorage.googleapis.com/v0/b/x/o/y');
  });
  it('accepts storage.googleapis.com', () => {
    expect(validateSrc('https://storage.googleapis.com/x').ok).toBe(true);
  });
  it('accepts hqaviation.com + www', () => {
    expect(validateSrc('https://hqaviation.com/img.jpg').ok).toBe(true);
    expect(validateSrc('https://www.hqaviation.com/img.jpg').ok).toBe(true);
  });
  it('rejects other origins', () => {
    expect(validateSrc('https://example.com/img.jpg').ok).toBe(false);
  });
  it('rejects http (must be https)', () => {
    expect(validateSrc('http://firebasestorage.googleapis.com/x').ok).toBe(false);
  });
  it('rejects non-URL inputs', () => {
    expect(validateSrc(null).ok).toBe(false);
    expect(validateSrc('').ok).toBe(false);
    expect(validateSrc('not a url').ok).toBe(false);
    expect(validateSrc(123).ok).toBe(false);
  });
});

describe('validateWidth', () => {
  it('accepts allowed widths as strings or numbers', () => {
    for (const w of [400, 800, 1200, 1600, 2400]) {
      expect(validateWidth(w).ok).toBe(true);
      expect(validateWidth(String(w)).ok).toBe(true);
    }
  });
  it('returns the parsed integer', () => {
    expect(validateWidth('800').value).toBe(800);
  });
  it('rejects out-of-set widths', () => {
    expect(validateWidth(100).ok).toBe(false);
    expect(validateWidth(401).ok).toBe(false);
    expect(validateWidth(99999).ok).toBe(false);
  });
  it('rejects garbage', () => {
    expect(validateWidth('abc').ok).toBe(false);
    expect(validateWidth(null).ok).toBe(false);
    expect(validateWidth('').ok).toBe(false);
  });
});

describe('validateFormat', () => {
  it('accepts allowed formats', () => {
    for (const f of ['avif', 'webp', 'jpeg', 'png']) {
      expect(validateFormat(f).ok).toBe(true);
      expect(validateFormat(f).value).toBe(f);
    }
  });
  it('normalises jpg to jpeg', () => {
    expect(validateFormat('jpg').ok).toBe(true);
    expect(validateFormat('jpg').value).toBe('jpeg');
  });
  it('is case-insensitive', () => {
    expect(validateFormat('AVIF').ok).toBe(true);
    expect(validateFormat('AVIF').value).toBe('avif');
  });
  it('rejects others', () => {
    expect(validateFormat('gif').ok).toBe(false);
    expect(validateFormat('bmp').ok).toBe(false);
    expect(validateFormat(null).ok).toBe(false);
  });
});

describe('constants exported for reference', () => {
  it('exports allowlists', () => {
    expect(Array.isArray(ALLOWED_PROXY_HOSTS) || ALLOWED_PROXY_HOSTS instanceof Set).toBeTruthy();
    expect(Array.isArray(ALLOWED_WIDTHS) || ALLOWED_WIDTHS instanceof Set).toBeTruthy();
    expect(Array.isArray(ALLOWED_FORMATS) || ALLOWED_FORMATS instanceof Set).toBeTruthy();
  });
});

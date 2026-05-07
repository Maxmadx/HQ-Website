// src/lib/canonicalUrl.test.js
import { describe, it, expect } from 'vitest';
import {
  stripTrailingSlash,
  stripWww,
  forceHttps,
  canonicaliseUrl,
} from './canonicalUrl';

describe('stripTrailingSlash', () => {
  it('strips a trailing slash from a non-root path', () => {
    expect(stripTrailingSlash('/aircraft/r44/')).toBe('/aircraft/r44');
  });
  it('preserves root', () => {
    expect(stripTrailingSlash('/')).toBe('/');
  });
  it('preserves a path with no trailing slash', () => {
    expect(stripTrailingSlash('/aircraft/r44')).toBe('/aircraft/r44');
  });
});

describe('stripWww', () => {
  it('strips www. from the host of a URL', () => {
    expect(stripWww('https://www.hqaviation.com/aircraft/r44'))
      .toBe('https://hqaviation.com/aircraft/r44');
  });
  it('preserves a non-www URL', () => {
    expect(stripWww('https://hqaviation.com/aircraft/r44'))
      .toBe('https://hqaviation.com/aircraft/r44');
  });
});

describe('forceHttps', () => {
  it('upgrades http to https', () => {
    expect(forceHttps('http://hqaviation.com/aircraft/r44'))
      .toBe('https://hqaviation.com/aircraft/r44');
  });
  it('preserves https', () => {
    expect(forceHttps('https://hqaviation.com/aircraft/r44'))
      .toBe('https://hqaviation.com/aircraft/r44');
  });
});

describe('canonicaliseUrl', () => {
  it('applies all three rules', () => {
    expect(canonicaliseUrl('http://www.hqaviation.com/aircraft/r44/'))
      .toBe('https://hqaviation.com/aircraft/r44');
  });
  it('returns null when input is already canonical', () => {
    expect(canonicaliseUrl('https://hqaviation.com/aircraft/r44'))
      .toBeNull();
  });
});

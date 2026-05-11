import { describe, it, expect } from 'vitest';
import { getMetaForPath } from './getMetaForPath';

describe('getMetaForPath', () => {
  it('returns meta for the homepage', () => {
    const m = getMetaForPath('/');
    expect(m.title).toBeTruthy();
    expect(m.canonicalUrl).toBe('https://hqaviation.com/');
  });
  it('returns meta for an aircraft page', () => {
    const m = getMetaForPath('/aircraft/r44');
    expect(m.title).toMatch(/r44/i);
  });
  it('returns null for an unknown path', () => {
    expect(getMetaForPath('/this-does-not-exist')).toBeNull();
  });
  it('returns null for a dynamic path', () => {
    expect(getMetaForPath('/blog/some-post-id')).toBeNull();
  });
});

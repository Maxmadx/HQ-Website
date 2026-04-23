import { describe, it, expect } from 'vitest';
import { buildOrganization, buildWebSite } from './jsonLd';

describe('buildOrganization', () => {
  it('returns Organization with required fields', () => {
    const org = buildOrganization();
    expect(org['@context']).toBe('https://schema.org');
    expect(org['@type']).toBe('Organization');
    expect(org.name).toBe('HQ Aviation');
    expect(org.url).toBe('https://hqaviation.com');
    expect(org.logo).toMatch(/^https:\/\/hqaviation.com/);
  });
});

describe('buildWebSite', () => {
  it('returns WebSite with SearchAction', () => {
    const site = buildWebSite();
    expect(site['@type']).toBe('WebSite');
    expect(site.url).toBe('https://hqaviation.com');
    expect(site.potentialAction['@type']).toBe('SearchAction');
    expect(site.potentialAction.target).toContain('{search_term_string}');
  });
});

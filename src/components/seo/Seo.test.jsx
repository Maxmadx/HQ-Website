// @vitest-environment jsdom
import { describe, it, expect, beforeEach } from 'vitest';
import { render } from '@testing-library/react';
import { HelmetProvider } from 'react-helmet-async';
import Seo from './Seo';

function renderSeo(ui) {
  render(<HelmetProvider>{ui}</HelmetProvider>);
}

function getMetas() {
  return Array.from(document.head.querySelectorAll('meta'));
}

function getLinks() {
  return Array.from(document.head.querySelectorAll('link'));
}

function getScripts() {
  // React 19 + react-helmet-async v3: scripts are rendered into the
  // component tree (body), not hoisted to document.head. Query all.
  return Array.from(document.querySelectorAll('script'));
}

beforeEach(() => {
  // Clean up head between tests
  while (document.head.firstChild) {
    document.head.removeChild(document.head.firstChild);
  }
  document.title = '';
});

describe('Seo', () => {
  it('renders title with org suffix', () => {
    renderSeo(<Seo title="Aircraft Sales" description="Buy a Robinson" />);
    expect(document.title).toContain('Aircraft Sales | HQ Aviation');
  });

  it('renders meta description', () => {
    renderSeo(<Seo title="X" description="A clear description" />);
    const metas = getMetas();
    const desc = metas.find(m => m.getAttribute('name') === 'description');
    expect(desc).toBeTruthy();
    expect(desc.getAttribute('content')).toContain('A clear description');
  });

  it('renders canonical from explicit prop', () => {
    renderSeo(<Seo title="X" canonical="https://hqaviation.com/foo" />);
    const links = getLinks();
    const canonical = links.find(l => l.getAttribute('rel') === 'canonical');
    expect(canonical).toBeTruthy();
    expect(canonical.getAttribute('href')).toContain('https://hqaviation.com/foo');
  });

  it('renders Open Graph and Twitter tags', () => {
    renderSeo(<Seo title="X" description="D" />);
    const metas = getMetas();
    const props = metas.map(m => m.getAttribute('property') || m.getAttribute('name') || '');
    expect(props).toContain('og:title');
    expect(props).toContain('og:description');
    expect(props).toContain('og:image');
    const twitterCard = metas.find(m => m.getAttribute('name') === 'twitter:card');
    expect(twitterCard).toBeTruthy();
  });

  it('renders noindex when prop set', () => {
    renderSeo(<Seo title="X" noindex />);
    const metas = getMetas();
    const robots = metas.find(m => m.getAttribute('name') === 'robots');
    expect(robots).toBeTruthy();
    expect(robots.getAttribute('content')).toContain('noindex');
  });

  it('does not render robots tag when noindex false', () => {
    renderSeo(<Seo title="X" />);
    const metas = getMetas();
    const robots = metas.find(m => m.getAttribute('name') === 'robots');
    expect(robots).toBeFalsy();
  });

  it('renders one JSON-LD script per block', () => {
    renderSeo(
      <Seo title="X" jsonLd={[{ '@type': 'A' }, { '@type': 'B' }]} />
    );
    const scripts = getScripts();
    const ldScripts = scripts.filter(s => s.getAttribute('type') === 'application/ld+json');
    expect(ldScripts.length).toBe(2);
    const texts = ldScripts.map(s => s.textContent);
    expect(texts.some(t => t.includes('"@type":"A"'))).toBe(true);
    expect(texts.some(t => t.includes('"@type":"B"'))).toBe(true);
  });
});

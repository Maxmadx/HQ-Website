// @vitest-environment jsdom
import { describe, it, expect, vi, beforeEach } from 'vitest';

global.fetch = vi.fn(() => Promise.resolve({ ok: true }));

beforeEach(() => {
  sessionStorage.clear();
  vi.clearAllMocks();
});

import { getSessionId, trackEvent } from './analytics';

describe('analytics', () => {
  it('getSessionId returns same id on repeated calls', () => {
    const id1 = getSessionId();
    const id2 = getSessionId();
    expect(id1).toBe(id2);
    expect(typeof id1).toBe('string');
    expect(id1.length).toBeGreaterThan(0);
  });

  it('trackEvent calls fetch with correct body', async () => {
    await trackEvent('cta_click', 'hero-book-btn');
    expect(fetch).toHaveBeenCalledWith(
      '/api/analytics',
      expect.objectContaining({
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: expect.stringContaining('"eventType":"cta_click"'),
      })
    );
  });

  it('trackEvent includes elementId when provided', async () => {
    await trackEvent('cta_click', 'some-btn');
    const body = JSON.parse(fetch.mock.calls[0][1].body);
    expect(body.elementId).toBe('some-btn');
  });

  it('trackEvent does not throw on fetch failure', async () => {
    fetch.mockRejectedValueOnce(new Error('network error'));
    await expect(trackEvent('pageview')).resolves.toBeUndefined();
  });

  it('trackEvent includes UTM params from URL when present', async () => {
    // Simulate URL with UTM params
    delete window.location;
    window.location = { pathname: '/', search: '?utm_source=google&utm_campaign=spring_sale', href: '' };

    await trackEvent('pageview');

    const body = JSON.parse(fetch.mock.calls[0][1].body);
    expect(body.utmSource).toBe('google');
    expect(body.utmCampaign).toBe('spring_sale');
    expect(body.utmMedium).toBeNull();
    expect(body.utmTerm).toBeNull();
    expect(body.utmContent).toBeNull();
  });

  it('trackEvent sends null UTM params when URL has no UTM params', async () => {
    delete window.location;
    window.location = { pathname: '/', search: '', href: '' };

    await trackEvent('pageview');

    const body = JSON.parse(fetch.mock.calls[0][1].body);
    expect(body.utmSource).toBeNull();
    expect(body.utmCampaign).toBeNull();
  });
});

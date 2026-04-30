// @vitest-environment jsdom
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';

global.fetch = vi.fn(() => Promise.resolve({ ok: true }));

const originalLocation = window.location;

beforeEach(() => {
  sessionStorage.clear();
  vi.clearAllMocks();
});

afterEach(() => {
  // Restore window.location if a test replaced it
  Object.defineProperty(window, 'location', { value: originalLocation, writable: true, configurable: true });
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
    expect(body.utmMedium).toBeNull();
    expect(body.utmCampaign).toBeNull();
    expect(body.utmTerm).toBeNull();
    expect(body.utmContent).toBeNull();
  });

  it('trackEvent passes ecommerce payload fields through', async () => {
    await trackEvent('view_item', null, '/training/trial-lessons', {
      items: [{ item_id: 'r44-60', item_name: 'R44 60min', item_category: 'discovery-flight', price: 350, currency: 'gbp' }],
      value: 350,
      currency: 'gbp',
      itemCategory: 'discovery-flight',
    });
    const body = JSON.parse(fetch.mock.calls[0][1].body);
    expect(body.eventType).toBe('view_item');
    expect(body.items).toEqual([{ item_id: 'r44-60', item_name: 'R44 60min', item_category: 'discovery-flight', price: 350, currency: 'gbp' }]);
    expect(body.value).toBe(350);
    expect(body.currency).toBe('gbp');
    expect(body.itemCategory).toBe('discovery-flight');
  });

  it('trackEvent omits ecommerce fields when not provided', async () => {
    await trackEvent('pageview');
    const body = JSON.parse(fetch.mock.calls[0][1].body);
    expect(body.items).toBeUndefined();
    expect(body.value).toBeUndefined();
    expect(body.currency).toBeUndefined();
    expect(body.transactionId).toBeUndefined();
    expect(body.itemCategory).toBeUndefined();
  });

  it('trackEvent passes transactionId for purchase events', async () => {
    await trackEvent('purchase', null, '/booking-confirmed', {
      transactionId: 'pi_123abc',
      value: 350,
      currency: 'gbp',
      items: [{ item_id: 'r44-60', item_category: 'discovery-flight' }],
      itemCategory: 'discovery-flight',
    });
    const body = JSON.parse(fetch.mock.calls[0][1].body);
    expect(body.transactionId).toBe('pi_123abc');
  });
});

// @vitest-environment jsdom
import { describe, it, expect, vi, beforeEach } from 'vitest';

global.fetch = vi.fn(() => Promise.resolve({ ok: true }));

beforeEach(() => vi.clearAllMocks());

import { trackPressClick } from './pressClick';

describe('trackPressClick', () => {
  it('calls POST /api/press-click with the press link id', async () => {
    await trackPressClick('abc123');
    expect(fetch).toHaveBeenCalledWith(
      '/api/press-click',
      expect.objectContaining({
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: 'abc123' }),
      })
    );
  });

  it('does not throw when fetch fails', async () => {
    fetch.mockRejectedValueOnce(new Error('network error'));
    await expect(trackPressClick('abc123')).resolves.toBeUndefined();
  });
});

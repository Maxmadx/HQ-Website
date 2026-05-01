// @vitest-environment jsdom
import { describe, it, expect, vi, beforeEach } from 'vitest';

global.fetch = vi.fn(() => Promise.resolve({ ok: true, json: () => Promise.resolve({ ok: true, cartId: 'cart_xyz' }) }));

beforeEach(() => {
  sessionStorage.clear();
  vi.clearAllMocks();
});

import { upsertCart, rehydrateCartByToken, getCartId, setCartId } from './cart';

describe('cart helper', () => {
  it('upsertCart POSTs to /api/carts with the body', async () => {
    await upsertCart({ sessionId: 'sess_abc', email: 'jane@example.com' });
    expect(fetch).toHaveBeenCalledWith('/api/carts', expect.objectContaining({
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
    }));
    const body = JSON.parse(fetch.mock.calls[0][1].body);
    expect(body.sessionId).toBe('sess_abc');
    expect(body.email).toBe('jane@example.com');
  });

  it('upsertCart stores the returned cartId in sessionStorage', async () => {
    await upsertCart({ sessionId: 'sess_abc', email: 'jane@example.com' });
    expect(getCartId()).toBe('cart_xyz');
  });

  it('upsertCart returns { cartId, email } from the response', async () => {
    fetch.mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve({ ok: true, cartId: 'cart_abc', email: 'lead@example.com' }),
    });
    const result = await upsertCart({ sessionId: 'sess' });
    expect(result).toEqual({ cartId: 'cart_abc', email: 'lead@example.com' });
  });

  it('upsertCart silently swallows fetch errors (analytics-style)', async () => {
    fetch.mockRejectedValueOnce(new Error('network'));
    await expect(upsertCart({ sessionId: 'x', email: 'a@b.c' })).resolves.toBeNull();
  });

  it('rehydrateCartByToken GETs /api/carts/by-token and returns the cart', async () => {
    fetch.mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve({ cartId: 'cart_z', email: 'a@b.c', flight: { aircraftId: 'r44', duration: 60, priceP: 35000 } }),
    });
    const cart = await rehydrateCartByToken('tok_xyz');
    expect(fetch).toHaveBeenCalledWith('/api/carts/by-token?t=tok_xyz');
    expect(cart.cartId).toBe('cart_z');
    expect(cart.email).toBe('a@b.c');
  });

  it('rehydrateCartByToken returns null on 404', async () => {
    fetch.mockResolvedValueOnce({ ok: false, status: 404 });
    const cart = await rehydrateCartByToken('bogus');
    expect(cart).toBeNull();
  });

  it('setCartId/getCartId persist via sessionStorage', () => {
    setCartId('cart_persisted');
    expect(getCartId()).toBe('cart_persisted');
  });
});

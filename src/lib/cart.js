/**
 * Client-side helper for the carts collection.
 * Mirrors the analytics.js pattern: fire-and-forget, never throws.
 */

const CART_ID_KEY = 'hq_cart_id';

export function getCartId() {
  return sessionStorage.getItem(CART_ID_KEY);
}

export function setCartId(id) {
  if (id) sessionStorage.setItem(CART_ID_KEY, id);
}

export function clearCartId() {
  sessionStorage.removeItem(CART_ID_KEY);
}

/**
 * Upsert the in-progress cart on the server.
 * @param {object} payload  Matches CartUpsertSchema on server
 * @returns {Promise<string|null>} The cartId on success, null on failure.
 */
export async function upsertCart(payload) {
  try {
    const res = await fetch('/api/carts', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    if (!res.ok) return null;
    const data = await res.json();
    if (data && data.cartId) {
      setCartId(data.cartId);
      return data.cartId;
    }
    return null;
  } catch {
    return null;
  }
}

/**
 * Fetch a cart by recovery token (used by the resume link in /checkout?t=…).
 * Returns null if the token is invalid, the cart is completed, or any error.
 */
export async function rehydrateCartByToken(token) {
  try {
    const res = await fetch(`/api/carts/by-token?t=${encodeURIComponent(token)}`);
    if (!res.ok) return null;
    return await res.json();
  } catch {
    return null;
  }
}

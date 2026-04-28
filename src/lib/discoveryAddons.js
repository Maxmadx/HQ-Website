export function computeLineTotal({ price, qty, discountPct = 0 }) {
  const pct = Math.max(0, Math.min(100, Number(discountPct) || 0));
  return Math.round(Number(price) * Number(qty) * (1 - pct / 100));
}

export function computeAddonsTotal(items) {
  return items.reduce((sum, it) => sum + computeLineTotal(it), 0);
}

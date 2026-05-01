/**
 * Pure aggregations over GSC daily rows.
 * Each row: { date: 'YYYY-MM-DD', query, page, clicks, impressions, ctr, position }
 */

function weightedAvg(rows, valueKey, weightKey) {
  let totalWeight = 0;
  let weightedSum = 0;
  for (const r of rows) {
    const w = Number(r[weightKey]) || 0;
    const v = Number(r[valueKey]) || 0;
    totalWeight += w;
    weightedSum += v * w;
  }
  return totalWeight > 0 ? weightedSum / totalWeight : 0;
}

export function topLineStats(rows) {
  let clicks = 0, impressions = 0;
  for (const r of rows) {
    clicks += Number(r.clicks) || 0;
    impressions += Number(r.impressions) || 0;
  }
  const ctr = impressions > 0 ? clicks / impressions : 0;
  const avgPosition = weightedAvg(rows, 'position', 'impressions');
  return { clicks, impressions, ctr, avgPosition };
}

function groupBy(rows, key) {
  const grouped = new Map();
  for (const r of rows) {
    const k = r[key];
    if (!grouped.has(k)) grouped.set(k, []);
    grouped.get(k).push(r);
  }
  return grouped;
}

export function byKeyword(rows) {
  const grouped = groupBy(rows, 'query');
  const out = [];
  for (const [query, group] of grouped) {
    let clicks = 0, impressions = 0;
    for (const r of group) {
      clicks += Number(r.clicks) || 0;
      impressions += Number(r.impressions) || 0;
    }
    out.push({
      query,
      clicks,
      impressions,
      ctr: impressions > 0 ? clicks / impressions : 0,
      avgPosition: weightedAvg(group, 'position', 'impressions'),
    });
  }
  return out.sort((a, b) => b.clicks - a.clicks);
}

export function byPage(rows) {
  const grouped = groupBy(rows, 'page');
  const out = [];
  for (const [page, group] of grouped) {
    let clicks = 0, impressions = 0;
    for (const r of group) {
      clicks += Number(r.clicks) || 0;
      impressions += Number(r.impressions) || 0;
    }
    out.push({
      page,
      clicks,
      impressions,
      ctr: impressions > 0 ? clicks / impressions : 0,
      avgPosition: weightedAvg(group, 'position', 'impressions'),
    });
  }
  return out.sort((a, b) => b.clicks - a.clicks);
}

export function monthlySeries(rows) {
  // Group by (month, query) → totals
  const grouped = new Map();
  for (const r of rows) {
    const month = (r.date || '').slice(0, 7); // YYYY-MM
    if (!month) continue;
    const key = `${month}|${r.query}`;
    if (!grouped.has(key)) {
      grouped.set(key, { month, query: r.query, clicks: 0, impressions: 0 });
    }
    const entry = grouped.get(key);
    entry.clicks += Number(r.clicks) || 0;
    entry.impressions += Number(r.impressions) || 0;
  }
  return Array.from(grouped.values()).map((e) => ({
    ...e,
    ctr: e.impressions > 0 ? e.clicks / e.impressions : 0,
  }));
}

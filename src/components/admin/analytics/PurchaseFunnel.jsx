import { useMemo, useState } from 'react';
import {
  computeFunnel,
  computeFunnelValue,
  segmentFunnelBySource,
  medianTimeToConversionHours,
} from './funnelAggregations';
import InfoTooltip from './InfoTooltip';

const STAGE_COLORS = {
  visits: '#5b21b6',
  viewedProduct: '#7c3aed',
  beganCheckout: '#a855f7',
  purchased: '#c084fc',
};

function fmtGbp(n) {
  if (typeof n !== 'number' || !Number.isFinite(n)) return '£0';
  return `£${Math.round(n).toLocaleString('en-GB')}`;
}

function pct(numer, denom) {
  if (!denom) return 0;
  return Math.round((numer / denom) * 100);
}

export default function PurchaseFunnel({ events = [], itemCategory = 'discovery-flight', dateLabel = '' }) {
  const [sourceFilter, setSourceFilter] = useState('all');

  const filteredEvents = useMemo(() => {
    if (sourceFilter === 'all') return events;
    if (sourceFilter === 'direct') {
      return events.filter((e) => !e.utmSource);
    }
    return events.filter((e) => e.utmSource === sourceFilter);
  }, [events, sourceFilter]);

  const funnel = useMemo(() => computeFunnel(filteredEvents, { itemCategory }), [filteredEvents, itemCategory]);
  const value = useMemo(() => computeFunnelValue(filteredEvents, { itemCategory }), [filteredEvents, itemCategory]);
  const ttc = useMemo(() => medianTimeToConversionHours(filteredEvents, { itemCategory }), [filteredEvents, itemCategory]);
  const sources = useMemo(() => segmentFunnelBySource(events, { itemCategory }), [events, itemCategory]);

  const sourceOptions = useMemo(() => {
    const set = new Set(['all']);
    sources.forEach((s) => set.add(s.source));
    return Array.from(set);
  }, [sources]);

  const isEmpty = funnel.purchased === 0 && funnel.viewedProduct === 0;

  // Funnel intentionally starts at "Viewed Product" (people who reached /training/trial-lessons),
  // not total site Visits — most visitors are on the site for other reasons, so including them
  // would make the discovery-flight drop-off look artificially terrible.
  const stages = [
    { key: 'viewedProduct',  label: 'Viewed Product',   count: funnel.viewedProduct,   topic: 'viewedProduct' },
    { key: 'beganCheckout',  label: 'Started Checkout', count: funnel.beganCheckout,   topic: 'startedCheckout' },
    { key: 'purchased',      label: 'Purchased',        count: funnel.purchased,       topic: 'purchased' },
  ];
  const maxCount = Math.max(...stages.map((s) => s.count), 1);

  return (
    <section style={{ background: '#1a1a1a', borderRadius: 12, padding: 24, color: '#fff' }}>
      <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', flexWrap: 'wrap', gap: 12 }}>
        <h2 style={{ margin: 0, fontSize: 18 }}>Purchase Funnel — Discovery Flight<InfoTooltip topic="purchaseFunnel" /></h2>
        <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
          {dateLabel && <span style={{ opacity: 0.7, fontSize: 13 }}>{dateLabel}</span>}
          <label style={{ fontSize: 13 }}>
            Source:<InfoTooltip topic="funnelSourceFilter" />{' '}
            <select
              value={sourceFilter}
              onChange={(e) => setSourceFilter(e.target.value)}
              style={{ background: '#2a2a2a', color: '#fff', border: '1px solid #3a3a3a', padding: '4px 8px', borderRadius: 4 }}
            >
              {sourceOptions.map((s) => <option key={s} value={s}>{s}</option>)}
            </select>
          </label>
        </div>
      </header>

      <div style={{ display: 'flex', gap: 24, margin: '20px 0', flexWrap: 'wrap' }}>
        <Stat label="AOV" value={fmtGbp(value.aov)} topic="aov" />
        <Stat label="Revenue" value={fmtGbp(value.totalValue)} topic="revenue" />
        <Stat label="Median time to convert" value={ttc !== null ? `${ttc.toFixed(1)}h` : '—'} topic="medianTimeToConvert" />
      </div>

      {isEmpty ? (
        <p style={{ opacity: 0.7, fontStyle: 'italic' }}>Awaiting first purchase in this range.</p>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          {stages.map((stage, i) => {
            const widthPct = (stage.count / maxCount) * 100;
            const dropPct = i > 0 ? pct(stage.count, stages[i - 1].count) : null;
            return (
              <div key={stage.key} style={{ display: 'grid', gridTemplateColumns: '160px 1fr 80px 60px', alignItems: 'center', gap: 12 }}>
                <span style={{ fontSize: 14 }}>{stage.label}<InfoTooltip topic={stage.topic} /></span>
                <div style={{ background: '#2a2a2a', borderRadius: 4, overflow: 'hidden', height: 28 }}>
                  <div style={{
                    width: `${widthPct}%`, background: STAGE_COLORS[stage.key],
                    height: '100%', transition: 'width 250ms ease',
                  }} />
                </div>
                <span style={{ fontSize: 14, fontWeight: 600 }}>{stage.count.toLocaleString('en-GB')}</span>
                <span style={{ fontSize: 12, opacity: 0.7 }}>{dropPct !== null ? `${dropPct}%` : ''}</span>
              </div>
            );
          })}
        </div>
      )}
    </section>
  );
}

function Stat({ label, value, topic }) {
  return (
    <div style={{ minWidth: 140 }}>
      <div style={{ fontSize: 11, opacity: 0.6, textTransform: 'uppercase', letterSpacing: 1 }}>
        {label}{topic && <InfoTooltip topic={topic} />}
      </div>
      <div style={{ fontSize: 22, fontWeight: 600 }}>{value}</div>
    </div>
  );
}

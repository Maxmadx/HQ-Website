import { useMemo, useState } from 'react';
import { computeCartFunnel, recoverableCarts } from './cartAggregations';
import InfoTooltip from './InfoTooltip';

const STAGE_COLORS = {
  totalCarts:  '#5b21b6',
  abandoned:   '#7c3aed',
  recoverable: '#a855f7',
  emailed:     '#c084fc',
  recovered:   '#e9d5ff',
};

const AIRCRAFT_NAMES = {
  r22: 'Robinson R22',
  r44: 'Robinson R44',
  r66: 'Robinson R66',
  r88: 'Robinson R88',
};

function fmtGbp(p) {
  if (!p || !Number.isFinite(p)) return '£0';
  return `£${Math.round(p / 100).toLocaleString('en-GB')}`;
}

function fmtTimeAgo(ts) {
  if (!ts || typeof ts.toMillis !== 'function') return '—';
  const ms = Date.now() - ts.toMillis();
  const h = Math.round(ms / 3600000);
  if (h < 1) return 'just now';
  if (h < 24) return `${h}h ago`;
  return `${Math.round(h / 24)}d ago`;
}

export default function AbandonedCartTile({ carts = [], onSendRecovery }) {
  const [busyId, setBusyId] = useState(null);
  const funnel = useMemo(() => computeCartFunnel(carts), [carts]);
  const recoverable = useMemo(() => recoverableCarts(carts), [carts]);

  const stages = [
    { key: 'totalCarts',  label: 'Carts',       count: funnel.totalCarts,  topic: 'cartsTotal' },
    { key: 'abandoned',   label: 'Abandoned',   count: funnel.abandoned,   topic: 'cartsAbandoned' },
    { key: 'recoverable', label: 'Recoverable', count: funnel.recoverable, topic: 'cartsRecoverable' },
    { key: 'emailed',     label: 'Emailed',     count: funnel.emailed,     topic: 'cartsEmailed' },
    { key: 'recovered',   label: 'Recovered',   count: funnel.recovered,   topic: 'cartsRecovered' },
  ];
  const maxCount = Math.max(...stages.map((s) => s.count), 1);

  async function handleClick(cartId) {
    setBusyId(cartId);
    try {
      await onSendRecovery(cartId);
    } finally {
      setBusyId(null);
    }
  }

  return (
    <section style={{ background: '#1a1a1a', borderRadius: 12, padding: 24, color: '#fff' }}>
      <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 20 }}>
        <h2 style={{ margin: 0, fontSize: 18 }}>Abandoned Carts<InfoTooltip topic="abandonedCarts" /></h2>
        <span style={{ fontSize: 22, fontWeight: 600, color: '#a855f7' }}>
          {fmtGbp(funnel.recoverableValueP)} <span style={{ fontSize: 14, fontWeight: 400 }}>recoverable</span>
          <InfoTooltip topic="recoverableHeadline" />
        </span>
      </header>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginBottom: 24 }}>
        {stages.map((stage) => {
          const widthPct = (stage.count / maxCount) * 100;
          return (
            <div key={stage.key} style={{ display: 'grid', gridTemplateColumns: '140px 1fr 60px', alignItems: 'center', gap: 12 }}>
              <span style={{ fontSize: 14 }}>{stage.label}<InfoTooltip topic={stage.topic} /></span>
              <div style={{ background: '#2a2a2a', borderRadius: 4, overflow: 'hidden', height: 24 }}>
                <div style={{ width: `${widthPct}%`, background: STAGE_COLORS[stage.key], height: '100%', transition: 'width 250ms ease' }} />
              </div>
              <span style={{ fontSize: 14, fontWeight: 600, textAlign: 'right' }}>{stage.count.toLocaleString('en-GB')}</span>
            </div>
          );
        })}
      </div>

      {recoverable.length === 0 ? (
        <p style={{ opacity: 0.7, fontStyle: 'italic', margin: 0 }}>Nothing to recover — well done.</p>
      ) : (
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
          <thead>
            <tr style={{ borderBottom: '1px solid #2a2a2a', textAlign: 'left' }}>
              <th style={{ padding: '8px 4px', color: '#94a3b8', fontWeight: 500 }}>Email</th>
              <th style={{ padding: '8px 4px', color: '#94a3b8', fontWeight: 500 }}>Item</th>
              <th style={{ padding: '8px 4px', color: '#94a3b8', fontWeight: 500 }}>Value</th>
              <th style={{ padding: '8px 4px', color: '#94a3b8', fontWeight: 500 }}>When</th>
              <th style={{ padding: '8px 4px', color: '#94a3b8', fontWeight: 500 }}>Sent</th>
              <th style={{ padding: '8px 4px' }}></th>
            </tr>
          </thead>
          <tbody>
            {recoverable.map((cart) => {
              const aircraft = cart.flight ? (AIRCRAFT_NAMES[cart.flight.aircraftId] || cart.flight.aircraftId) : '—';
              const duration = cart.flight && cart.flight.duration ? `${cart.flight.duration}m` : '';
              const sentCount = (cart.recoveryEmailsSent || []).length;
              return (
                <tr key={cart.id} style={{ borderBottom: '1px solid #2a2a2a' }}>
                  <td style={{ padding: '10px 4px' }}>{cart.email}</td>
                  <td style={{ padding: '10px 4px', color: '#cbd5e1' }}>{aircraft} {duration}</td>
                  <td style={{ padding: '10px 4px' }}>{fmtGbp(cart.totalP)}</td>
                  <td style={{ padding: '10px 4px', color: '#94a3b8' }}>{fmtTimeAgo(cart.updatedAt)}</td>
                  <td style={{ padding: '10px 4px', color: '#94a3b8' }}>{sentCount > 0 ? `${sentCount}×` : '—'}</td>
                  <td style={{ padding: '10px 4px', textAlign: 'right' }}>
                    <button
                      type="button"
                      onClick={() => handleClick(cart.id)}
                      disabled={busyId === cart.id}
                      style={{
                        padding: '6px 12px', fontSize: 12, fontWeight: 600,
                        background: busyId === cart.id ? '#475569' : '#a855f7', color: '#fff',
                        border: 'none', borderRadius: 6, cursor: busyId === cart.id ? 'wait' : 'pointer',
                      }}
                    >
                      {busyId === cart.id ? 'Sending…' : 'Send recovery'}
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      )}
    </section>
  );
}

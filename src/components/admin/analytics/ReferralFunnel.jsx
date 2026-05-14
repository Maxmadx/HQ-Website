import { useMemo } from 'react';
import { computeReferralFunnel } from './referralAggregations';
import InfoTooltip from './InfoTooltip';

const STAGE_COLORS = {
  confirmationsViewed: '#5b21b6',
  shareClicked: '#7c3aed',
  friendArrived: '#a855f7',
  friendBooked: '#c084fc',
};

function pct(numer, denom) {
  if (!denom) return 0;
  return Math.round((numer / denom) * 100);
}

export default function ReferralFunnel({ pageEvents = [], friendBookings = [], dateLabel = '' }) {
  const funnel = useMemo(
    () => computeReferralFunnel(pageEvents, friendBookings),
    [pageEvents, friendBookings],
  );

  const stages = [
    { key: 'confirmationsViewed', label: 'Confirmation Viewed', count: funnel.confirmationsViewed, topic: 'referralConfirmationViewed' },
    { key: 'shareClicked',        label: 'Share Clicked',       count: funnel.shareClicked,        topic: 'referralShareClicked' },
    { key: 'friendArrived',       label: 'Friend Arrived',      count: funnel.friendArrived,       topic: 'referralFriendArrived' },
    { key: 'friendBooked',        label: 'Friend Booked',       count: funnel.friendBooked,        topic: 'referralFriendBooked' },
  ];
  const maxCount = Math.max(...stages.map((s) => s.count), 1);
  const isEmpty = stages.every((s) => s.count === 0);

  return (
    <section style={{ background: '#1a1a1a', borderRadius: 12, padding: 24, color: '#fff' }}>
      <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', flexWrap: 'wrap', gap: 12 }}>
        <h2 style={{ margin: 0, fontSize: 18, color: '#fff' }}>Referral Funnel<InfoTooltip topic="referralFunnel" /></h2>
        {dateLabel && <span style={{ opacity: 0.7, fontSize: 13 }}>{dateLabel}</span>}
      </header>

      {isEmpty ? (
        <p style={{ opacity: 0.7, fontStyle: 'italic', marginTop: 16 }}>No referral activity in this range yet.</p>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginTop: 20 }}>
          {stages.map((stage, i) => {
            const widthPct = (stage.count / maxCount) * 100;
            const stepPct = i > 0 ? pct(stage.count, stages[i - 1].count) : null;
            return (
              <div key={stage.key} style={{ display: 'grid', gridTemplateColumns: '180px 1fr 80px 60px', alignItems: 'center', gap: 12 }}>
                <span style={{ fontSize: 14 }}>{stage.label}<InfoTooltip topic={stage.topic} /></span>
                <div style={{ background: '#2a2a2a', borderRadius: 4, overflow: 'hidden', height: 28 }}>
                  <div style={{
                    width: `${widthPct}%`, background: STAGE_COLORS[stage.key],
                    height: '100%', transition: 'width 250ms ease',
                  }} />
                </div>
                <span style={{ fontSize: 14, fontWeight: 600 }}>{stage.count.toLocaleString('en-GB')}</span>
                <span style={{ fontSize: 12, opacity: 0.7 }}>{stepPct !== null ? `${stepPct}%` : ''}</span>
              </div>
            );
          })}
        </div>
      )}
    </section>
  );
}

import ReferralOfferCard from './ReferralOfferCard';
import UpgradeOfferCard from './UpgradeOfferCard';

export default function PostCheckoutOffers({ booking, freeReferralItem, onUpgraded }) {
  if (!booking) return null;
  if (booking.productType === 'misc') return null;

  const isVoucherOnly = booking.voucher?.active === true
    && (!booking.addons || booking.addons.length === 0)
    && (!booking.flightAmountPence || booking.flightAmountPence === 0);
  if (isVoucherOnly) return null;

  const showReferral = !!(booking.referralCode && freeReferralItem);
  const showUpgrade = booking.aircraft === 'r22' && !booking.upgrade;
  const showUpgradedRow = booking.aircraft === 'r44' && booking.upgrade;
  if (!showReferral && !showUpgrade && !showUpgradedRow) return null;

  return (
    <div style={S.wrap}>
      <div style={S.grid} className="pc-offers-grid">
        <style>{`
          @media (min-width: 768px) {
            .pc-offers-grid { grid-template-columns: 1fr 1fr; }
          }
        `}</style>
        {showReferral && <ReferralOfferCard booking={booking} freeItem={freeReferralItem} />}
        {showUpgrade && <UpgradeOfferCard booking={booking} onUpgraded={onUpgraded} />}
      </div>
      {showUpgradedRow && (
        <div style={S.upgradedRow}>
          ✓ Upgraded to Robinson R44 ({booking.duration} min) — see you at HQ.
        </div>
      )}
      <p style={S.note}>These offers are also in your confirmation email — claim later if you'd rather think about it.</p>
    </div>
  );
}

const S = {
  wrap: { margin: '24px 0' },
  grid: { display: 'grid', gridTemplateColumns: '1fr', gap: '16px' },
  note: { fontSize: '0.8rem', color: '#999', textAlign: 'center', marginTop: '12px', fontStyle: 'italic' },
  upgradedRow: {
    background: '#d1fae5', color: '#065f46', borderRadius: '8px',
    padding: '12px 16px', fontWeight: 600, fontSize: '0.9rem',
    textAlign: 'center', border: '1px solid #6ee7b7',
  },
};

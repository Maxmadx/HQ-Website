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
  if (!showReferral && !showUpgrade) return null;

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
      <p style={S.note}>These offers are also in your confirmation email — claim later if you'd rather think about it.</p>
    </div>
  );
}

const S = {
  wrap: { margin: '24px 0' },
  grid: { display: 'grid', gridTemplateColumns: '1fr', gap: '16px' },
  note: { fontSize: '0.8rem', color: '#999', textAlign: 'center', marginTop: '12px', fontStyle: 'italic' },
};

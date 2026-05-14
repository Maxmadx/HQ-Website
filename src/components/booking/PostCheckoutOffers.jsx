import ReferralOfferCard from './ReferralOfferCard';

export default function PostCheckoutOffers({ booking, freeReferralItem }) {
  if (!booking) return null;
  if (booking.productType === 'misc') return null;

  // Voucher-only edge case
  const isVoucherOnly = booking.voucher?.active === true
    && (!booking.addons || booking.addons.length === 0)
    && (!booking.flightAmountPence || booking.flightAmountPence === 0);
  if (isVoucherOnly) return null;

  const showReferral = !!(booking.referralCode && freeReferralItem);
  if (!showReferral) return null;

  return (
    <div style={S.wrap}>
      <ReferralOfferCard booking={booking} freeItem={freeReferralItem} />
      <p style={S.note}>This offer is also in your confirmation email — claim later if you'd rather think about it.</p>
    </div>
  );
}

const S = {
  wrap: { margin: '24px 0' },
  note: { fontSize: '0.8rem', color: '#999', textAlign: 'center', marginTop: '12px', fontStyle: 'italic' },
};

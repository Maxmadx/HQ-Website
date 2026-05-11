import { useState } from 'react';
import { UpgradeModal } from './UpgradeOfferCard';

const R44_PRICE_FALLBACK = { 30: 30500, 60: 60500 };

const fmtGbpNoZeros = (pence) => {
  const n = Number(pence) / 100;
  return Number.isInteger(n)
    ? `£${n.toLocaleString('en-GB')}`
    : `£${n.toLocaleString('en-GB', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
};

/**
 * Hero R44 upgrade pitch shown during the /booking-confirmed loading phase.
 * Visible only when the booker is R22 + not yet upgraded + has a positive
 * upgrade diff. Click "Upgrade now" opens the same modal as the compact
 * green row inside the Booking Summary card.
 *
 * `morphing` (true during the Phase 1 → Phase 2 transition) shifts the card's
 * background + border colours to match the compact green upgrade row, so the
 * hero visually transforms toward the row before it unmounts.
 */
export default function BigUpgradeCard({ booking, onUpgraded, morphing = false }) {
  const [modalOpen, setModalOpen] = useState(false);
  if (!booking) return null;
  if (booking.aircraft !== 'r22') return null;
  if (booking.upgrade) return null;

  const flightPaid = Number(booking.flightAmountPence) || 0;
  const defaultDur = booking.duration === 60 ? 60 : 30;
  const diffPence = (typeof booking.upgradeDiffPence === 'number' && booking.upgradeDiffPence > 0)
    ? booking.upgradeDiffPence
    : (R44_PRICE_FALLBACK[defaultDur] - flightPaid);
  if (diffPence <= 0) return null;

  const cardStyle = morphing
    ? { ...S.card, background: '#ecfdf5', borderColor: '#6ee7b7' }
    : S.card;

  return (
    <>
      <div style={cardStyle}>
        <div style={S.photoFrame}>
          <img
            src="/assets/images/new-aircraft/r44/raven-ii-front-alpha.png"
            alt="Robinson R44"
            style={S.photo}
          />
        </div>
        <div style={S.body}>
          <h2 style={S.title}>UPGRADE TO THE R44</h2>
          <p style={S.pitch}>You at the controls.</p>
          <p style={S.pitch}>Two mates in the back.</p>
          <p style={S.price}>{fmtGbpNoZeros(diffPence)} to upgrade</p>
          <button
            type="button"
            onClick={() => setModalOpen(true)}
            style={S.cta}
            aria-label="Upgrade now"
          >
            Upgrade now →
          </button>
        </div>
      </div>
      <UpgradeModal
        booking={booking}
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        onSuccess={onUpgraded}
      />
    </>
  );
}

const S = {
  card: {
    background: '#fff',
    borderRadius: '12px',
    border: '1px solid #e8e8e8',
    overflow: 'hidden',
    marginBottom: '28px',
    fontFamily: "'Space Grotesk', Arial, sans-serif",
    boxShadow: '0 4px 16px rgba(0,0,0,0.05)',
    transition: 'background 380ms ease, border-color 380ms ease',
  },
  photoFrame: {
    width: '100%',
    height: '240px',
    background: '#f5f5f5',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  photo: {
    width: '100%',
    height: '100%',
    objectFit: 'contain',
    objectPosition: 'center',
  },
  body: {
    padding: '24px 28px',
    textAlign: 'left',
  },
  title: {
    fontSize: '0.78rem',
    fontFamily: "'Share Tech Mono', monospace",
    textTransform: 'uppercase',
    letterSpacing: '0.12em',
    color: '#888',
    margin: '0 0 16px',
    fontWeight: 700,
  },
  pitch: {
    fontSize: '1.05rem',
    color: '#444',
    margin: '0 0 4px',
    lineHeight: 1.5,
    fontWeight: 400,
  },
  price: {
    fontSize: '1.15rem',
    color: '#1a1a1a',
    margin: '18px 0 22px',
    fontWeight: 700,
  },
  cta: {
    width: '100%',
    padding: '14px',
    background: '#1a1a1a',
    color: '#fff',
    border: 'none',
    borderRadius: '8px',
    fontWeight: 600,
    fontSize: '1rem',
    cursor: 'pointer',
    fontFamily: 'inherit',
  },
};

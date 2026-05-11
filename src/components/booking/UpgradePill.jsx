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
 * A single morphing upgrade affordance. Renders in the same DOM slot
 * throughout the confirmation flow and transitions between its two modes
 * via CSS — never unmounts mid-flow:
 *
 *   mode="hero"    — big R44 photo + pitch + price (Phase 1 loading state)
 *   mode="compact" — single-line cream-green pill (Phase 2 confirmed state)
 *
 * The morph: photo collapses (max-height → 0), hero copy collapses
 * (max-height + opacity → 0), compact copy emerges (max-height + opacity
 * → in), and the outer container's bg / border / radius / shadow shift
 * from the hero card style to the compact row style. ~420ms total.
 */
export default function UpgradePill({ booking, onUpgraded, mode = 'compact' }) {
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

  const isHero = mode === 'hero';

  return (
    <>
      <div
        role="button"
        tabIndex={0}
        aria-label="Upgrade to R44"
        onClick={() => setModalOpen(true)}
        onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); setModalOpen(true); } }}
        style={{
          width: '100%',
          marginBottom: isHero ? '28px' : '20px',
          background: isHero ? '#fff' : '#ecfdf5',
          border: isHero ? '1px solid #e8e8e8' : '1px solid #6ee7b7',
          borderRadius: isHero ? '12px' : '8px',
          boxShadow: isHero ? '0 4px 16px rgba(0,0,0,0.05)' : 'none',
          overflow: 'hidden',
          cursor: 'pointer',
          fontFamily: "'Space Grotesk', Arial, sans-serif",
          color: isHero ? '#1a1a1a' : '#065f46',
          textAlign: 'left',
          outline: 'none',
          transition:
            'background 420ms ease, border-color 420ms ease, border-radius 420ms ease, ' +
            'box-shadow 420ms ease, margin-bottom 420ms ease, color 320ms ease',
        }}
      >
        {/* R44 photo — collapses to 0 height in compact mode */}
        <div
          style={{
            width: '100%',
            height: isHero ? '240px' : '0px',
            background: '#f5f5f5',
            overflow: 'hidden',
            transition: 'height 420ms ease',
          }}
        >
          <img
            src="/assets/images/new-aircraft/r44/raven-ii-front-alpha.png"
            alt="Robinson R44"
            style={{
              width: '100%',
              height: '240px',
              objectFit: 'contain',
              objectPosition: 'center',
              opacity: isHero ? 1 : 0,
              transition: 'opacity 280ms ease',
            }}
          />
        </div>

        {/* Hero body — title, pitch lines, price, CTA pill.
            Collapses (max-height + opacity) when transitioning to compact. */}
        <div
          style={{
            maxHeight: isHero ? '360px' : '0px',
            opacity: isHero ? 1 : 0,
            padding: isHero ? '24px 28px' : '0 16px',
            overflow: 'hidden',
            transition:
              'max-height 420ms ease, opacity 240ms ease, padding 420ms ease',
          }}
        >
          <h2
            style={{
              fontSize: '0.78rem',
              fontFamily: "'Share Tech Mono', monospace",
              textTransform: 'uppercase',
              letterSpacing: '0.12em',
              color: '#888',
              margin: '0 0 16px',
              fontWeight: 700,
            }}
          >
            UPGRADE TO THE R44
          </h2>
          <p style={{ fontSize: '1.05rem', color: '#444', margin: '0 0 4px', lineHeight: 1.5, fontWeight: 400 }}>
            You at the controls.
          </p>
          <p style={{ fontSize: '1.05rem', color: '#444', margin: '0 0 4px', lineHeight: 1.5, fontWeight: 400 }}>
            Two mates in the back.
          </p>
          <p style={{ fontSize: '1.15rem', color: '#1a1a1a', margin: '18px 0 22px', fontWeight: 700 }}>
            {fmtGbpNoZeros(diffPence)} to upgrade
          </p>
          <div
            style={{
              width: '100%',
              padding: '14px',
              background: '#1a1a1a',
              color: '#fff',
              borderRadius: '8px',
              fontWeight: 600,
              fontSize: '1rem',
              textAlign: 'center',
              transition: 'background 280ms ease',
            }}
          >
            Upgrade now →
          </div>
        </div>

        {/* Compact body — single line + arrow. Emerges as hero collapses. */}
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            maxHeight: isHero ? '0px' : '60px',
            opacity: isHero ? 0 : 1,
            padding: isHero ? '0 16px' : '14px 16px',
            overflow: 'hidden',
            transition:
              'max-height 420ms ease, opacity 280ms ease ' + (isHero ? '0ms' : '180ms') + ', padding 420ms ease',
            fontSize: '14px',
            lineHeight: 1.4,
          }}
        >
          <span style={{ flex: '1 1 auto' }}>
            Bring 2 extra friends, upgrade to R44 for <strong>{fmtGbpNoZeros(diffPence)}</strong>
          </span>
          <span aria-hidden="true" style={{ fontSize: '18px', color: '#047857', marginLeft: '12px', flexShrink: 0 }}>→</span>
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

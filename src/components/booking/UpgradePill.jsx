import { useEffect, useState } from 'react';
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
  const [ctaHover, setCtaHover] = useState(false);
  // Entry animation: outer wrapper renders collapsed (max-height 0 + opacity 0)
  // on the first paint AFTER the wrapper enters the DOM, then opens on the
  // next frame. Gated on `shouldShow` because the parent mounts UpgradePill
  // with booking=null during the initial /api/booking fetch — if we flipped
  // `appearing` on plain mount, RAF would fire while the early-return is
  // still returning null and the wrapper would later render already-open.
  // Double-RAF guarantees one paint commits the closed state before we flip.
  const shouldShow = !!booking && booking.aircraft === 'r22' && !booking.upgrade;
  const [appearing, setAppearing] = useState(true);
  // Middle (photo + pitches) starts collapsed, expands slowly after the card
  // has landed. Result: title bar + CTA appear first as a thin sandwich,
  // then the helicopter + pitches unfold between them over ~3s.
  const [middleOpen, setMiddleOpen] = useState(false);
  useEffect(() => {
    if (!shouldShow) return;
    let id2;
    const id1 = requestAnimationFrame(() => {
      id2 = requestAnimationFrame(() => setAppearing(false));
    });
    return () => {
      cancelAnimationFrame(id1);
      if (id2) cancelAnimationFrame(id2);
    };
  }, [shouldShow]);
  useEffect(() => {
    if (!shouldShow) return;
    // Delay slightly past the card's fall/unfurl (~1.1s) so the title +
    // CTA visibly land before the middle begins opening.
    const t = setTimeout(() => setMiddleOpen(true), 550);
    return () => clearTimeout(t);
  }, [shouldShow]);
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
        style={{
          // Entry-animation wrapper. On first frame: collapsed + above its
          // final position + invisible. On next frame: opens to full height,
          // descends to translateY(0) with a slight overshoot easing (lands
          // like it's falling under gravity), and fades in.
          maxHeight: appearing ? '0px' : '800px',
          opacity: appearing ? 0 : 1,
          transform: appearing ? 'translateY(-60px)' : 'translateY(0)',
          overflow: 'hidden',
          transition:
            'max-height 1500ms ease, ' +
            'opacity 1000ms ease 200ms, ' +
            'transform 1100ms cubic-bezier(0.34, 1.56, 0.64, 1) 100ms',
        }}
      >
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
            'background 1500ms ease, border-color 1500ms ease, border-radius 1500ms ease, ' +
            'box-shadow 1500ms ease, margin-bottom 1500ms ease, color 1100ms ease',
        }}
      >
        {/* Title — full-width black bar at the top of the card */}
        <div
          style={{
            maxHeight: isHero ? '100px' : '0px',
            opacity: isHero ? 1 : 0,
            padding: isHero ? '22px 28px' : '0 16px',
            background: '#1a1a1a',
            overflow: 'hidden',
            textAlign: 'center',
            transition:
              'max-height 1500ms ease, opacity 850ms ease, padding 1500ms ease',
          }}
        >
          <h2
            style={{
              fontSize: '1.15rem',
              fontFamily: "'Space Grotesk', Arial, sans-serif",
              color: '#fff',
              margin: 0,
              fontWeight: 700,
              letterSpacing: '0.01em',
            }}
          >
            Bring two friends along for the ride.
          </h2>
        </div>

        {/* R44 photo — opens with the rest of the middle. Slow transition
            (~3s) for entry; reuses the same property to collapse on compact. */}
        <div
          style={{
            width: '100%',
            height: isHero && middleOpen ? '240px' : '0px',
            background: '#f5f5f5',
            overflow: 'hidden',
            transition: 'height 600ms ease-out',
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
              opacity: isHero && middleOpen ? 1 : 0,
              transition: 'opacity 500ms ease-out',
            }}
          />
        </div>

        {/* Pitches — white middle band, opens with the photo */}
        <div
          style={{
            maxHeight: isHero && middleOpen ? '180px' : '0px',
            opacity: isHero && middleOpen ? 1 : 0,
            padding: isHero && middleOpen ? '24px 28px 28px' : '0 28px',
            overflow: 'hidden',
            textAlign: 'center',
            transition:
              'max-height 600ms ease-out, opacity 500ms ease-out, padding 600ms ease-out',
          }}
        >
          <p style={{ fontSize: '1.05rem', color: '#444', margin: '0 0 4px', lineHeight: 1.5, fontWeight: 400 }}>
            Upgrade to the R44. With you at the controls.
          </p>
          <p style={{ fontSize: '1.05rem', color: '#444', margin: 0, lineHeight: 1.5, fontWeight: 400 }}>
            Two mates in the back.
          </p>
        </div>

        {/* CTA — full-width black bar flush to the bottom edge.
            No border-radius; outer overflow:hidden + outer 12px radius clips
            the bottom corners so it inherits the card's rounded bottom. */}
        <div
          style={{
            maxHeight: isHero ? '80px' : '0px',
            opacity: isHero ? 1 : 0,
            overflow: 'hidden',
            transition: 'max-height 1500ms ease, opacity 850ms ease',
          }}
        >
          <div
            onMouseEnter={() => setCtaHover(true)}
            onMouseLeave={() => setCtaHover(false)}
            style={{
              width: '100%',
              padding: '22px 16px',
              background: ctaHover ? '#fff' : '#1a1a1a',
              color: ctaHover ? '#1a1a1a' : '#fff',
              borderTop: '1px solid #d4d4d4',
              fontWeight: 600,
              fontSize: '1rem',
              textAlign: 'center',
              transition: 'background 200ms ease, color 200ms ease',
            }}
          >
            Upgrade for {fmtGbpNoZeros(diffPence)} →
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
              'max-height 1500ms ease, opacity 1000ms ease ' + (isHero ? '0ms' : '700ms') + ', padding 1500ms ease',
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

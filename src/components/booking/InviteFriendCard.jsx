import { useEffect, useState } from 'react';

const R22_PHOTO = '/assets/images/new-aircraft/r22/r22-red-volcano-front-alpha-v3.png';
const SHARE_PATH = '/training/trial-lessons';

/**
 * Hero-style invite-a-friend card. Sibling to <UpgradePill> — same visual
 * structure (black title bar / photo / pitches / black CTA) and matching
 * entry animation (fall + middle expand). Click anywhere copies the
 * referral link to the clipboard.
 *
 * Renders only when the booking has a referralCode AND a free referral
 * item is configured (same gating as <ReferralOfferCard>). In the expanded
 * phase (mode='compact') it collapses; the existing ReferralOfferCard in
 * PostCheckoutOffers takes over the referral CTA below the summary card.
 */
export default function InviteFriendCard({ booking, freeItem, mode = 'hero' }) {
  const [copied, setCopied] = useState(false);
  const [ctaHover, setCtaHover] = useState(false);
  const [appearing, setAppearing] = useState(true);
  const [middleOpen, setMiddleOpen] = useState(false);

  const shouldShow = !!(booking?.referralCode && freeItem);

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
    const t = setTimeout(() => setMiddleOpen(true), 550);
    return () => clearTimeout(t);
  }, [shouldShow]);

  if (!shouldShow) return null;

  const isHero = mode === 'hero';
  const shareUrl = `${typeof window !== 'undefined' ? window.location.origin : ''}${SHARE_PATH}?ref=${booking.referralCode}`;

  async function handleClick() {
    try {
      await navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2200);
    } catch {}
  }

  function handleKeyDown(e) {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      handleClick();
    }
  }

  return (
    <div
      style={{
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
        aria-label="Copy referral link"
        onClick={handleClick}
        onKeyDown={handleKeyDown}
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
        {/* Title — full-width black bar */}
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
            Know someone who'd love this?
          </h2>
        </div>

        {/* SVG colour-swap filter — copies the R channel into G so red
            bodywork (high R, low G) becomes yellow (high R, high G).
            Pixels where R is already low (blacks, dark shadows) and pixels
            where all channels are equal (greys, whites) stay unchanged. */}
        <svg width="0" height="0" style={{ position: 'absolute' }} aria-hidden="true">
          <defs>
            <filter id="r22-red-to-yellow" colorInterpolationFilters="sRGB">
              {/* Maps pure red (1,0,0) → mustard #DBB524 (0.86, 0.71, 0.14)
                  while keeping any neutral pixel (R == G == B — greys,
                  blacks, whites, the dark seat fabric) exactly as-is.
                  Each row's coefficients sum to 1 so that grey-scale input
                  produces identical grey-scale output. */}
              <feColorMatrix
                type="matrix"
                values="0.86 0.14 0    0 0
                        0.71 0.29 0    0 0
                        0.14 0    0.86 0 0
                        0    0    0    1 0"
              />
            </filter>
          </defs>
        </svg>

        {/* Two R22s — back one offset behind the front. Both fully opaque
            (no transparency); overlap reads as two distinct helicopters. */}
        <div
          style={{
            position: 'relative',
            width: '100%',
            height: isHero && middleOpen ? '240px' : '0px',
            background: '#f5f5f5',
            overflow: 'hidden',
            transition: 'height 600ms ease-out',
          }}
        >
          <img
            src={R22_PHOTO}
            alt=""
            aria-hidden="true"
            style={{
              position: 'absolute',
              top: 0,
              left: '2%',
              width: '66%',
              height: '240px',
              objectFit: 'contain',
              objectPosition: 'center',
              opacity: isHero && middleOpen ? 1 : 0,
              // Copy R → G so the red bodywork becomes yellow. Greys,
              // blacks, and white-ish pixels (where R is already balanced
              // with the other channels) are unchanged.
              filter: 'url(#r22-red-to-yellow)',
              transition: 'opacity 500ms ease-out',
              // Flip horizontally so the yellow heli faces the red one.
              transform: 'translateY(10px) scaleX(-1)',
            }}
          />
          <img
            src={R22_PHOTO}
            alt="Two Robinson R22s — fly one and bring a friend in theirs"
            style={{
              position: 'absolute',
              top: 0,
              left: '32%',
              width: '66%',
              height: '240px',
              objectFit: 'contain',
              objectPosition: 'center',
              opacity: isHero && middleOpen ? 1 : 0,
              transition: 'opacity 500ms ease-out',
            }}
          />
        </div>

        {/* Pitches */}
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
          <p style={{ fontSize: '1.05rem', color: '#444', margin: 0, lineHeight: 1.5, fontWeight: 400 }}>
            When they book, you'll both have some gifts waiting for you at HQ.
          </p>
        </div>

        {/* CTA — full-width black bar at bottom */}
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
            {copied ? '✓ Link copied' : 'Copy referral link →'}
          </div>
        </div>
      </div>
    </div>
  );
}

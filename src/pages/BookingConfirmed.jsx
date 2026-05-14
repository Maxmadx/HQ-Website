import React, { useEffect, useState } from 'react';
import { useSearchParams, useNavigate, Link } from 'react-router-dom';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { trackEvent } from '../lib/analytics';
import PostCheckoutOffers from '../components/booking/PostCheckoutOffers';
import UpgradePill from '../components/booking/UpgradePill';
import InviteFriendCard from '../components/booking/InviteFriendCard';

const AIRCRAFT_NAMES = {
  r22: 'Robinson R22',
  r44: 'Robinson R44',
  r66: 'Robinson R66',
};

export default function BookingConfirmed() {
  const [searchParams] = useSearchParams();

  const ref = searchParams.get('ref');
  // Misc bookings still carry these URL params from MiscCheckoutForm —
  // the /api/booking endpoint doesn't whitelist itemName/size yet, and
  // misc short-circuits the Phase 1 machine, so the URL is the source.
  const type = searchParams.get('type');
  const itemName = searchParams.get('itemName');
  const apparelSize = searchParams.get('size') || '';
  const isMisc = type === 'misc';

  const navigate = useNavigate();
  // Phases:
  //   'confirming' — spinner + 'Confirming Booking', record-booking in flight
  //   'confirmed'  — ✓ + 'Booking Confirmed' + 'View Booking Summary' button.
  //                  Hero upgrade card still visible. User is in control.
  //   'expanded'   — user clicked the button. Summary card grows in, upgrade
  //                  pill morphs hero→compact, post-checkout offers appear.
  // Misc bookings skip both intermediate states (no record-booking, no upgrade).
  const [phase, setPhase] = useState(isMisc ? 'expanded' : 'confirming');

  const [booking, setBooking] = useState(null);
  const [freeReferralItem, setFreeReferralItem] = useState(null);
  const [purchaseEventFired, setPurchaseEventFired] = useState(false);

  // Fire client-side GA4 purchase event once we have either booking data
  // (Discovery Flight) or URL params (misc). Idempotent via guard flag —
  // the Stripe webhook is the canonical source server-side; this is a fallback.
  useEffect(() => {
    if (!ref || purchaseEventFired) return;
    if (!isMisc && !booking) return; // wait for booking on discovery-flight

    const value = isMisc
      ? parseFloat(searchParams.get('price') || '0')
      : (booking.totalAmountPence / 100);
    const items = isMisc
      ? [{
          item_id: itemName || 'misc',
          item_name: itemName || 'Misc item',
          item_category: 'misc',
          price: value,
          currency: 'gbp',
          quantity: 1,
        }]
      : [{
          item_id: `${booking.aircraft || 'unknown'}-${booking.duration || ''}`,
          item_name: `${AIRCRAFT_NAMES[booking.aircraft] || booking.aircraft || 'Discovery Flight'} ${booking.duration ? booking.duration + 'min ' : ''}Discovery Flight`,
          item_category: 'discovery-flight',
          price: value,
          currency: 'gbp',
          quantity: 1,
        }];
    trackEvent('purchase', ref, '/booking-confirmed', {
      transactionId: ref,
      value,
      currency: 'gbp',
      items,
      itemCategory: isMisc ? 'misc' : 'discovery-flight',
    });
    setPurchaseEventFired(true);
  }, [ref, isMisc, booking, itemName, purchaseEventFired, searchParams]);

  useEffect(() => {
    if (!ref) return;
    let cancelled = false;
    let attempt = 0;
    const MAX_ATTEMPTS = 12;
    const RETRY_DELAY = 700;

    async function fetchOnce() {
      try {
        const res = await fetch(`/api/booking/${encodeURIComponent(ref)}`);
        if (res.ok) {
          const data = await res.json();
          if (!cancelled) setBooking(data);
          return true; // success
        }
        if (res.status === 404) {
          return false; // retry
        }
        return true; // other errors — give up (server-down etc)
      } catch {
        return true; // network error — give up
      }
    }

    (async () => {
      while (!cancelled && attempt < MAX_ATTEMPTS) {
        const done = await fetchOnce();
        if (done) return;
        attempt++;
        await new Promise((r) => setTimeout(r, RETRY_DELAY));
      }
    })();

    return () => { cancelled = true; };
  }, [ref]);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const q = query(collection(db, 'misc_items'), where('freeReferralOffer', '==', true));
        const snap = await getDocs(q);
        if (snap.empty) return;
        const d = snap.docs[0];
        if (!cancelled) setFreeReferralItem({ id: d.id, ...d.data() });
      } catch {}
    })();
    return () => { cancelled = true; };
  }, []);

  useEffect(() => {
    if (isMisc) return;          // misc skips the phase machine
    if (!ref) return;            // no PI to record
    let cancelled = false;

    const NETWORK_TIMEOUT = 15000;

    (async () => {
      try {
        const res = await Promise.race([
          fetch('/api/record-booking', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ paymentIntentId: ref }),
          }),
          new Promise((_, reject) => setTimeout(() => reject(new Error('Network error — please try again')), NETWORK_TIMEOUT)),
        ]);
        if (!res.ok) {
          const data = await res.json().catch(() => ({}));
          throw new Error(data.error || `record-booking failed (${res.status})`);
        }
        if (!cancelled) setPhase('confirmed');
      } catch (err) {
        if (cancelled) return;
        const errMsg = err.message || 'Unknown error';
        // Send the user to the trial-lessons landing page with the error in
        // the URL — they can re-pick aircraft + duration without risking a
        // duplicate charge from a stale checkout form.
        const params = new URLSearchParams();
        params.set('error', errMsg);
        navigate(`/training/trial-lessons?${params.toString()}`, { replace: true });
      }
    })();

    return () => { cancelled = true; };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ref, isMisc]);

  async function refetchBooking(optimistic) {
    if (optimistic && booking) {
      setBooking((b) => ({ ...b, aircraft: optimistic.newAircraft, duration: optimistic.newDuration, upgrade: { newAircraft: optimistic.newAircraft, newDuration: optimistic.newDuration, upgradePaymentIntentId: 'pending', upgradedAt: new Date() } }));
    }
    if (!ref) return;
    try {
      const res = await fetch(`/api/booking/${encodeURIComponent(ref)}`);
      if (res.ok) setBooking(await res.json());
    } catch {}
  }

  // confirmedVisible drives the spinner→✓ and heading-text swap (true for
  // both 'confirmed' and 'expanded'). isExpanded gates the summary card,
  // PostCheckoutOffers, return link, and the pill's hero→compact morph.
  const confirmedVisible = phase !== 'confirming';
  const isExpanded = phase === 'expanded';
  const showSummaryButton = phase === 'confirmed';
  // Once the booking has been upgraded the page should be a clean
  // summary — collapse the divider and the 'Make it even better.'
  // section heading along with the offer pills.
  const hideOffersChrome = isExpanded || !!booking?.upgrade;

  function handleViewSummary() {
    setPhase('expanded');
  }

  return (
    <div style={styles.page}>
      <style>{`
        @keyframes bc-spin { to { transform: rotate(360deg); } }
        @keyframes bc-fade-in { from { opacity: 0; transform: translateY(8px); } to { opacity: 1; transform: translateY(0); } }
      `}</style>
      <div style={styles.container}>

        {/* Centred heading column — narrow, holds spinner/✓, h1, button, divider */}
        <div style={{ ...styles.centerColumn, order: 1 }}>

        {/* Success mark — spinner during Phase 1/fading, ✓ during Phase 2 */}
        <div style={styles.markSlot}>
          {confirmedVisible ? (
            <div style={{ ...styles.checkmark, animation: 'bc-fade-in 400ms ease both' }}>✓</div>
          ) : (
            <div style={styles.spinner} aria-label="Confirming booking" />
          )}
        </div>

        <h1 style={{
          ...styles.heading,
          marginBottom: confirmedVisible ? '12px' : '40px',
          animation: 'bc-fade-in 480ms ease both',
        }}>
          {confirmedVisible
            ? (isMisc ? 'Purchase Confirmed' : 'Booking Confirmed')
            : 'Confirming Booking'}
        </h1>

        {/* 'View Booking Summary' button — appears in 'confirmed' phase, sits
            where the old thank-you subtitle was. Clicking it advances to
            'expanded': summary card grows in, upgrade pill morphs hero→compact. */}
        <div
          style={{
            maxHeight: showSummaryButton ? '90px' : '0px',
            opacity: showSummaryButton ? 1 : 0,
            overflow: 'hidden',
            transition: 'max-height 1500ms ease, opacity 800ms ease',
          }}
        >
          <button
            type="button"
            onClick={handleViewSummary}
            style={styles.viewSummaryBtn}
          >
            View Booking Summary&nbsp;&nbsp;→
          </button>
        </div>

        {/* Divider — visible during 'confirming' AND 'confirmed' as the
            separator between the heading area and the hero upgrade card.
            Collapses on 'expanded' so the summary card can take its place. */}
        <hr
          style={{
            border: 'none',
            borderTop: '1px solid #e0ddd6',
            margin: hideOffersChrome ? '0' : '32px 0',
            maxHeight: hideOffersChrome ? '0px' : '1px',
            opacity: hideOffersChrome ? 0 : 1,
            transition: 'opacity 700ms ease, max-height 1500ms ease, margin 1500ms ease',
          }}
        />

        </div>{/* /centerColumn — heading area */}

        {/* Section heading above the offers — collapses with the cards on
            expand AND once the booking has been upgraded. */}
        <div
          style={{
            maxHeight: hideOffersChrome ? '0px' : '80px',
            opacity: hideOffersChrome ? 0 : 1,
            overflow: 'hidden',
            transition: 'max-height 1500ms ease, opacity 700ms ease',
            order: 2,
          }}
        >
          <h2 style={styles.offersHeading}>Make it even better.</h2>
        </div>

        {/* Cards row — UpgradePill + InviteFriendCard side-by-side on desktop,
            stack on mobile (flex-wrap when ≤ ~992px). In 'expanded' phase
            narrows to 520px to match the booking-summary card width; the
            two compact pills wrap onto separate rows at full 520px each.
            Removed entirely once the booking has been upgraded — both pills
            return null and the row would just leave empty margin space. */}
        {!isMisc && !booking?.upgrade && (
          <div
            style={{
              ...styles.cardsRow,
              maxWidth: isExpanded ? '520px' : '1080px',
              gap: isExpanded ? '8px' : '32px',
              margin: isExpanded ? '0 auto 28px' : '0 auto',
              transition: 'max-width 1500ms ease, gap 1500ms ease, margin 1500ms ease',
              // In expanded, pills sit BELOW the summary card; in confirming
              // they sit above (where the heading expects them). The DOM order
              // is unchanged so the hero→compact morph animation is preserved.
              order: isExpanded ? 4 : 3,
            }}
          >
            <div style={styles.cardsCol}>
              <UpgradePill
                booking={booking}
                onUpgraded={refetchBooking}
                mode={isExpanded ? 'compact' : 'hero'}
              />
            </div>
            <div style={styles.cardsCol}>
              <InviteFriendCard
                booking={booking}
                freeItem={freeReferralItem}
                mode={isExpanded ? 'compact' : 'hero'}
              />
            </div>
          </div>
        )}

        {/* Centred summary column. In expanded phase its order is 3, so it
            sits ABOVE the cards row (order 4). In confirming phase order
            is 4 but it's collapsed (max-height 0) so position is irrelevant. */}
        <div style={{ ...styles.centerColumn, order: isExpanded ? 3 : 4 }}>

        {/* Summary card — grows in when the user clicks 'View Booking Summary'.
            max-height + opacity transition so the pill below shifts down
            gradually rather than snapping. */}
        <div
          style={{
            maxHeight: isExpanded ? '900px' : '0px',
            opacity: isExpanded ? 1 : 0,
            overflow: 'hidden',
            transition: 'max-height 1500ms ease, opacity 800ms ease 400ms',
          }}
        >
          {/* Summary card */}
          <div style={styles.card}>
            <h2 style={styles.cardHeading}>Booking Summary</h2>

            {isMisc ? (
              <>
                {itemName && (
                  <div style={styles.row}>
                    <span style={styles.label}>Item</span>
                    <span style={styles.value}>{itemName}</span>
                  </div>
                )}
                {apparelSize && (
                  <div style={styles.row}>
                    <span style={styles.label}>Size</span>
                    <span style={styles.value}>{apparelSize}</span>
                  </div>
                )}
              </>
            ) : (
              <>
                {(() => {
                  const displayAircraft = booking?.aircraft || '';
                  const displayAircraftName = AIRCRAFT_NAMES[displayAircraft] || booking?.aircraftName || 'Discovery Flight';
                  const displayDuration = booking?.duration || '';
                  const displayPrice = booking ? (booking.totalAmountPence / 100).toFixed(2) : '—';
                  return (
                    <>
                      <div style={styles.row}>
                        <span style={styles.label}>Aircraft</span>
                        <span style={styles.value}>{displayAircraftName}</span>
                      </div>
                      <div style={styles.row}>
                        <span style={styles.label}>Duration</span>
                        <span style={styles.value}>{displayDuration} minutes</span>
                      </div>
                      <div style={styles.row}>
                        <span style={styles.label}>Amount Paid</span>
                        <span style={styles.value}>£{displayPrice}</span>
                      </div>
                    </>
                  );
                })()}
              </>
            )}
            {ref && (
              <div style={{ ...styles.row, borderTop: '1px solid #f0f0f0', marginTop: '12px', paddingTop: '12px' }}>
                <span style={{ ...styles.label, fontSize: '12px', color: '#bbb' }}>Booking Reference</span>
                <span style={{ ...styles.value, fontSize: '12px', color: '#bbb', fontFamily: "'Share Tech Mono', monospace" }}>{ref}</span>
              </div>
            )}
          </div>
        </div>

        </div>{/* /centerColumn — summary */}

        {/* Centred offers/return column — order 5 (always last). Only renders
            content in expanded phase. */}
        <div style={{ ...styles.centerColumn, order: 5 }}>

        {/* Post-checkout offers + outro — only after user clicks View Booking Summary. */}
        {isExpanded && (
          <div style={{ animation: 'bc-fade-in 480ms ease both' }}>
            {!isMisc && (
              <PostCheckoutOffers booking={booking} freeReferralItem={freeReferralItem} />
            )}

            <p style={styles.nextStep}>
              {isMisc
                ? 'The HQ Aviation team will be in touch about your order.'
                : 'A member of the HQ Aviation team will be in touch shortly to arrange a date and time for your flight.'}
            </p>

            <p style={styles.emailNote}>
              A confirmation email will be sent to your inbox shortly.
            </p>

            <Link to="/" style={styles.homeLink}>Return to HQ Aviation</Link>
          </div>
        )}

        </div>{/* /centerColumn — offers/return */}

      </div>
    </div>
  );
}

const styles = {
  page: {
    minHeight: '100vh',
    background: '#faf9f6',
    display: 'flex',
    alignItems: 'flex-start',
    justifyContent: 'center',
    padding: '80px 20px 40px',
    fontFamily: "'Space Grotesk', Arial, sans-serif",
  },
  container: {
    maxWidth: '1080px',
    width: '100%',
    textAlign: 'center',
    display: 'flex',
    flexDirection: 'column',
  },
  centerColumn: {
    maxWidth: '520px',
    width: '100%',
    margin: '0 auto',
  },
  cardsRow: {
    display: 'flex',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: '32px',
    width: '100%',
  },
  cardsCol: {
    flex: '1 1 480px',
    minWidth: 0,
    maxWidth: '520px',
    display: 'flex',
    flexDirection: 'column',
  },
  markSlot: {
    height: '64px',
    marginBottom: '24px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkmark: {
    width: '64px',
    height: '64px',
    borderRadius: '50%',
    background: '#1a1a1a',
    color: '#fff',
    fontSize: '28px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  spinner: {
    width: '64px',
    height: '64px',
    borderRadius: '50%',
    border: '4px solid #e5e7eb',
    borderTopColor: '#1a1a1a',
    animation: 'bc-spin 0.9s linear infinite',
  },
  heading: {
    fontSize: '2rem',
    fontWeight: 700,
    color: '#1a1a1a',
    margin: '0 0 12px',
  },
  subheading: {
    fontSize: '1rem',
    color: '#666',
    margin: '0 0 32px',
    lineHeight: 1.6,
  },
  card: {
    background: '#fff',
    borderRadius: '12px',
    border: '1px solid #e8e8e8',
    padding: '28px',
    textAlign: 'left',
    marginBottom: '28px',
  },
  cardHeading: {
    fontSize: '13px',
    fontFamily: "'Share Tech Mono', monospace",
    textTransform: 'uppercase',
    letterSpacing: '0.1em',
    color: '#888',
    margin: '0 0 20px',
  },
  row: {
    display: 'flex',
    justifyContent: 'space-between',
    padding: '10px 0',
  },
  label: {
    fontSize: '14px',
    color: '#666',
  },
  value: {
    fontSize: '14px',
    color: '#1a1a1a',
    fontWeight: 600,
  },
  nextStep: {
    fontSize: '15px',
    color: '#444',
    lineHeight: 1.7,
    margin: '0 0 12px',
  },
  emailNote: {
    fontSize: '13px',
    color: '#aaa',
    margin: '0 0 32px',
  },
  offersHeading: {
    fontSize: '1.3rem',
    fontWeight: 700,
    color: '#1a1a1a',
    margin: '0 0 28px',
    textAlign: 'center',
    letterSpacing: '-0.01em',
  },
  viewSummaryBtn: {
    display: 'inline-block',
    padding: '12px 24px',
    margin: 0,
    background: '#fff',
    color: '#1a1a1a',
    border: '1px solid #1a1a1a',
    borderRadius: '8px',
    fontFamily: "'Space Grotesk', Arial, sans-serif",
    fontSize: '14px',
    fontWeight: 600,
    letterSpacing: '0.02em',
    cursor: 'pointer',
    transition: 'background 200ms ease, color 200ms ease',
  },
  homeLink: {
    display: 'inline-block',
    padding: '12px 28px',
    background: '#1a1a1a',
    color: '#fff',
    borderRadius: '8px',
    textDecoration: 'none',
    fontSize: '14px',
    fontWeight: 600,
    letterSpacing: '0.02em',
  },
};

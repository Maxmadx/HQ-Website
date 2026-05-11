import React, { useEffect, useState } from 'react';
import { useSearchParams, useNavigate, Link } from 'react-router-dom';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { trackEvent } from '../lib/analytics';
import PostCheckoutOffers from '../components/booking/PostCheckoutOffers';
import UpgradePill from '../components/booking/UpgradePill';

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
  const [phase, setPhase] = useState(isMisc ? 'confirmed' : 'confirming');

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

    const FOUR_SECONDS = 4000;
    const NETWORK_TIMEOUT = 15000;

    const recordPromise = (async () => {
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
        return true;
      } catch (err) {
        if (cancelled) return false;
        const errMsg = err.message || 'Unknown error';
        // Send the user to the trial-lessons landing page with the error in
        // the URL — they can re-pick aircraft + duration without risking a
        // duplicate charge from a stale checkout form.
        const params = new URLSearchParams();
        params.set('error', errMsg);
        navigate(`/training/trial-lessons?${params.toString()}`, { replace: true });
        return false;
      }
    })();

    const timerPromise = new Promise((resolve) => setTimeout(resolve, FOUR_SECONDS));

    Promise.all([recordPromise, timerPromise]).then(([recordOk]) => {
      if (!cancelled && recordOk) {
        // UpgradePill handles its own hero→compact morph via CSS transitions
        // on a single mounted element — no intermediate phase needed.
        setPhase('confirmed');
      }
    });

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

  const confirmedVisible = phase === 'confirmed';

  return (
    <div style={styles.page}>
      <style>{`
        @keyframes bc-spin { to { transform: rotate(360deg); } }
        @keyframes bc-fade-in { from { opacity: 0; transform: translateY(8px); } to { opacity: 1; transform: translateY(0); } }
      `}</style>
      <div style={styles.container}>

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

        {/* THE morphing upgrade pill — single component, one DOM slot, transitions
            between hero (Phase 1) and compact (Phase 2) modes via CSS. Photo
            collapses, hero copy fades + collapses, compact copy emerges, outer
            container shifts bg/border/radius/shadow. The same element you saw
            as the big R44 card IS the green pill you can click later. */}
        {!isMisc && (
          <UpgradePill
            booking={booking}
            onUpgraded={refetchBooking}
            mode={confirmedVisible ? 'compact' : 'hero'}
          />
        )}

        {/* Confirmed UI — subtitle + summary card + offers. Fades in via keyframe. */}
        {confirmedVisible && (
          <div style={{ animation: 'bc-fade-in 480ms ease both' }}>
            <p style={styles.subheading}>
              {booking?.customerName ? `Thank you, ${booking.customerName}.` : 'Thank you.'}{' '}
              {isMisc
                ? 'Your order has been placed. The HQ team will be in touch shortly.'
                : 'Your Discovery Flight has been booked.'}
            </p>

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
    maxWidth: '520px',
    width: '100%',
    textAlign: 'center',
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

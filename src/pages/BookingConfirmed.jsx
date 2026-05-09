import React, { useEffect, useState } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { trackEvent } from '../lib/analytics';
import PostCheckoutOffers from '../components/booking/PostCheckoutOffers';

const AIRCRAFT_NAMES = {
  r22: 'Robinson R22',
  r44: 'Robinson R44',
  r66: 'Robinson R66',
};

export default function BookingConfirmed() {
  const [searchParams] = useSearchParams();

  const ref = searchParams.get('ref');
  const aircraft = searchParams.get('aircraft');
  const duration = searchParams.get('duration');
  const price = searchParams.get('price');
  const name = searchParams.get('name');
  const type = searchParams.get('type');
  const itemName = searchParams.get('itemName');
  const apparelSize = searchParams.get('size') || '';
  const isMisc = type === 'misc';

  const aircraftName = AIRCRAFT_NAMES[aircraft] || aircraft || 'Discovery Flight';

  // Fire client-side purchase event as a fallback for the Stripe webhook.
  // The transactionId (ref = payment_intent.id) is the dedup key — if the
  // webhook also fires server-side, the aggregation layer dedupes via
  // transactionId at read time. No double-count in dashboard counts.
  useEffect(() => {
    if (!ref) return;
    const value = parseFloat(price || '0');
    const itemCategory = isMisc ? 'misc' : 'discovery-flight';
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
          item_id: `${aircraft || 'unknown'}-${duration || ''}`,
          item_name: `${aircraftName} ${duration ? duration + 'min ' : ''}Discovery Flight`,
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
      itemCategory,
    });
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const [booking, setBooking] = useState(null);
  const [freeReferralItem, setFreeReferralItem] = useState(null);

  useEffect(() => {
    if (!ref) return;
    let cancelled = false;
    (async () => {
      try {
        const res = await fetch(`/api/booking/${encodeURIComponent(ref)}`);
        if (!res.ok) return;
        const data = await res.json();
        if (!cancelled) setBooking(data);
      } catch {}
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

  return (
    <div style={styles.page}>
      <div style={styles.container}>

        {/* Success mark */}
        <div style={styles.checkmark}>✓</div>

        <h1 style={styles.heading}>{isMisc ? 'Purchase Confirmed' : 'Booking Confirmed'}</h1>
        <p style={styles.subheading}>
          {name ? `Thank you, ${name}.` : 'Thank you.'}{' '}
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
                const displayAircraft = booking?.aircraft || aircraft;
                const displayAircraftName = AIRCRAFT_NAMES[displayAircraft] || displayAircraft || 'Discovery Flight';
                const displayDuration = booking?.duration || duration;
                const displayPrice = booking ? (booking.totalAmountPence / 100).toFixed(2) : price;
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
          <PostCheckoutOffers booking={booking} freeReferralItem={freeReferralItem} onUpgraded={refetchBooking} />
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
    </div>
  );
}

const styles = {
  page: {
    minHeight: '100vh',
    background: '#faf9f6',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '40px 20px',
    fontFamily: "'Space Grotesk', Arial, sans-serif",
  },
  container: {
    maxWidth: '520px',
    width: '100%',
    textAlign: 'center',
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
    margin: '0 auto 24px',
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

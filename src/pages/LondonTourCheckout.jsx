import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate, Link } from 'react-router-dom';
import { loadStripe } from '@stripe/stripe-js';
import { Elements, CardNumberElement, CardExpiryElement, CardCvcElement, useStripe, useElements } from '@stripe/react-stripe-js';
import FinalDraftHeader from '../components/FinalDraftHeader';

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY);

const fmt = (n) => Number(n).toLocaleString('en-GB', { minimumFractionDigits: 2, maximumFractionDigits: 2 });

const EXPERIENCE_NAMES = {
  shared: 'Shared',
  private: 'Private Charter',
};

const TIME_NAMES = {
  day: 'Daytime',
  sunset: 'Sunset',
  night: 'Night',
};

const CARD_FIELD_STYLE = {
  style: {
    base: {
      fontSize: '16px',
      color: '#1a1a1a',
      fontFamily: "'Space Grotesk', Arial, sans-serif",
      '::placeholder': { color: '#aaa' },
    },
    invalid: { color: '#e74c3c' },
  },
};

// ─── Payment Form ─────────────────────────────────────────────────────────────
function CheckoutForm({ experience, timeOfDay, quantity, price, wantsVoucher, setWantsVoucher, voucherLocation, setVoucherLocation, voucherMessage, setVoucherMessage }) {
  const stripe = useStripe();
  const elements = useElements();
  const navigate = useNavigate();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!stripe || !elements) return;

    setLoading(true);
    setError('');

    let clientSecret;
    try {
      const res = await fetch('/api/create-london-tour-payment-intent', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          experience,
          timeOfDay,
          quantity: Number(quantity),
          customerName: name,
          customerEmail: email,
          customerPhone: phone,
          wantsVoucher,
          voucherLocation: wantsVoucher ? voucherLocation : '',
          voucherMessage: wantsVoucher ? voucherMessage : '',
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to initiate payment.');
      clientSecret = data.clientSecret;
    } catch (err) {
      setError(err.message || 'Something went wrong. Please try again.');
      setLoading(false);
      return;
    }

    const result = await stripe.confirmCardPayment(clientSecret, {
      payment_method: {
        card: elements.getElement(CardNumberElement),
        billing_details: { name, email, phone },
      },
    });

    setLoading(false);

    if (result.error) {
      setError(result.error.message);
    } else if (result.paymentIntent.status === 'succeeded') {
      fetch('/api/record-booking', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ paymentIntentId: result.paymentIntent.id }),
      }).catch(() => {}); // fire-and-forget — webhook is the fallback
      navigate(
        `/london-tour-confirmed?ref=${result.paymentIntent.id}` +
        `&experience=${experience}&timeOfDay=${timeOfDay}&quantity=${quantity}&price=${price}` +
        `&name=${encodeURIComponent(name)}`
      );
    }
  };

  return (
    <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
      <div style={styles.fieldGroup}>
        <label style={styles.label}>Full Name</label>
        <input style={styles.input} type="text" placeholder="Jane Smith" value={name} onChange={e => setName(e.target.value)} required />
      </div>
      <div style={styles.fieldGroup}>
        <label style={styles.label}>Email Address</label>
        <input style={styles.input} type="email" placeholder="jane@example.com" value={email} onChange={e => setEmail(e.target.value)} required />
      </div>
      <div style={styles.fieldGroup}>
        <label style={styles.label}>Phone Number</label>
        <input style={styles.input} type="tel" placeholder="+44 7700 900000" value={phone} onChange={e => setPhone(e.target.value)} required />
      </div>

      {/* Physical Gift Voucher */}
      <div style={styles.voucherBox}>
        <button
          type="button"
          style={{ ...styles.voucherToggle, ...(wantsVoucher ? styles.voucherToggleActive : {}) }}
          onClick={() => setWantsVoucher(!wantsVoucher)}
        >
          <span style={styles.voucherToggleLeft}>
            <span>
              <span style={styles.voucherToggleTitle}>Add a physical gift voucher</span>
              <span style={styles.voucherToggleSub}>A beautifully printed voucher posted to you or a recipient</span>
            </span>
          </span>
          <span style={{ ...styles.voucherCheck, ...(wantsVoucher ? styles.voucherCheckActive : {}) }}>
            {wantsVoucher ? '✓' : '+'}
          </span>
        </button>
        {wantsVoucher && (
          <div style={styles.voucherFields}>
            <div style={styles.fieldGroup}>
              <label style={styles.label}>Delivery address</label>
              <textarea
                style={{ ...styles.input, resize: 'vertical', minHeight: '72px', lineHeight: 1.5 }}
                placeholder="Full postal address for the voucher to be sent to"
                value={voucherLocation}
                onChange={e => setVoucherLocation(e.target.value)}
                required
              />
            </div>
            <div style={styles.fieldGroup}>
              <label style={styles.label}>
                Personal message
                <span style={styles.charCount}>{voucherMessage.length}/150</span>
              </label>
              <textarea
                style={{ ...styles.input, resize: 'vertical', minHeight: '80px', lineHeight: 1.5 }}
                placeholder="A message to print on the voucher — e.g. Happy Birthday!"
                value={voucherMessage}
                maxLength={150}
                onChange={e => setVoucherMessage(e.target.value)}
              />
            </div>
          </div>
        )}
      </div>

      <div style={styles.fieldGroup}>
        <label style={styles.label}>Card Number</label>
        <div style={styles.cardElement}>
          <CardNumberElement options={CARD_FIELD_STYLE} />
        </div>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
        <div style={styles.fieldGroup}>
          <label style={styles.label}>Expiry</label>
          <div style={styles.cardElement}>
            <CardExpiryElement options={CARD_FIELD_STYLE} />
          </div>
        </div>
        <div style={styles.fieldGroup}>
          <label style={styles.label}>CVC</label>
          <div style={styles.cardElement}>
            <CardCvcElement options={CARD_FIELD_STYLE} />
          </div>
        </div>
      </div>

      {error && <p style={styles.error}>{error}</p>}

      <button type="submit" disabled={!stripe || loading} style={loading ? { ...styles.btn, ...styles.btnDisabled } : styles.btn}>
        {loading ? 'Processing…' : `Pay £${fmt(price)}`}
      </button>

      <p style={styles.secureNote}>
        🔒 Payments are processed securely by Stripe. HQ Aviation never sees your card details.
      </p>
    </form>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────
export default function LondonTourCheckout() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const experience = searchParams.get('experience');
  const timeOfDay  = searchParams.get('timeOfDay');
  const quantity   = searchParams.get('quantity');
  const price      = searchParams.get('price');

  const [wantsVoucher, setWantsVoucher] = useState(false);
  const [voucherLocation, setVoucherLocation] = useState('');
  const [voucherMessage, setVoucherMessage] = useState('');

  const isValid =
    ['shared', 'private'].includes(experience) &&
    ['day', 'sunset', 'night'].includes(timeOfDay) &&
    Number(quantity) >= 1 && Number(quantity) <= 4 &&
    Number(price) > 0;

  useEffect(() => {
    if (!isValid) navigate('/helicopter-tour-of-london', { replace: true });
  }, [isValid, navigate]);

  if (!isValid) return null;

  const passengersSummary = experience === 'shared'
    ? `${quantity} passenger${Number(quantity) > 1 ? 's' : ''}`
    : 'Private charter (up to 4)';

  return (
    <>
      <FinalDraftHeader hideMenu />
      <div style={styles.page} className="co-page-wrap">
        <style>{`
          .co-layout {
            display: grid;
            grid-template-columns: 1fr 1.4fr;
            gap: 40px;
            align-items: start;
          }
          @media (max-width: 1024px) {
            .co-page-wrap { padding-top: 80px !important; }
            .co-layout { grid-template-columns: 1fr; gap: 20px; }
            .co-layout .co-summary { order: 2; width: 100%; box-sizing: border-box; }
            .co-layout .co-form   { order: 1; width: 100%; box-sizing: border-box; }
            .co-page-heading   { font-size: 1.5rem !important; }
            .co-page-subheading { font-size: 0.9rem !important; margin-bottom: 24px !important; }
          }
        `}</style>

        <div style={styles.container}>
          <Link to="/helicopter-tour-of-london" style={styles.back}>← Back</Link>

          <h1 style={styles.heading} className="co-page-heading">Complete Your Booking</h1>
          <p style={styles.subheading} className="co-page-subheading">Pay now — we'll call you to confirm your flight date.</p>

          <div className="co-layout">

            {/* Order Summary */}
            <div style={styles.summary} className="co-summary">
              <h2 style={styles.summaryHeading}>Order Summary</h2>
              <div style={styles.summaryRow}>
                <span style={styles.summaryLabel}>Experience</span>
                <span style={styles.summaryValue}>{EXPERIENCE_NAMES[experience]}</span>
              </div>
              <div style={styles.summaryRow}>
                <span style={styles.summaryLabel}>Time of Day</span>
                <span style={styles.summaryValue}>{TIME_NAMES[timeOfDay]}</span>
              </div>
              <div style={styles.summaryRow}>
                <span style={styles.summaryLabel}>Passengers</span>
                <span style={styles.summaryValue}>{passengersSummary}</span>
              </div>
              {wantsVoucher && (
                <div style={styles.summaryRow}>
                  <span style={styles.summaryLabel}>Physical voucher</span>
                  <span style={{ ...styles.summaryValue, color: '#2d7a4f', fontSize: '13px' }}>Included</span>
                </div>
              )}
              <div style={{ ...styles.summaryRow, borderTop: '1px solid #e8e8e8', paddingTop: '16px', marginTop: '8px' }}>
                <span style={{ ...styles.summaryLabel, fontWeight: 700, color: '#1a1a1a' }}>Total</span>
                <span style={{ ...styles.summaryValue, fontWeight: 700, fontSize: '1.25rem' }}>£{fmt(price)}</span>
              </div>
              <p style={styles.summaryNote}>
                After payment, a member of the HQ Aviation team will contact you to arrange a date and time for your tour.
              </p>
            </div>

            {/* Payment Form */}
            <div style={styles.formPanel} className="co-form">
              <h2 style={styles.formHeading}>Your Details &amp; Payment</h2>
              <Elements stripe={stripePromise}>
                <CheckoutForm
                  experience={experience}
                  timeOfDay={timeOfDay}
                  quantity={quantity}
                  price={price}
                  wantsVoucher={wantsVoucher}
                  setWantsVoucher={setWantsVoucher}
                  voucherLocation={voucherLocation}
                  setVoucherLocation={setVoucherLocation}
                  voucherMessage={voucherMessage}
                  setVoucherMessage={setVoucherMessage}
                />
              </Elements>
            </div>

          </div>
        </div>
      </div>
    </>
  );
}

// ─── Styles ───────────────────────────────────────────────────────────────────
const styles = {
  page: {
    minHeight: '100vh',
    width: '100%',
    boxSizing: 'border-box',
    background: '#faf9f6',
    padding: '120px 20px 40px',
    fontFamily: "'Space Grotesk', Arial, sans-serif",
  },
  container: { maxWidth: '960px', margin: '0 auto' },
  back: {
    display: 'inline-block',
    marginBottom: '32px',
    color: '#666',
    textDecoration: 'none',
    fontSize: '14px',
    fontFamily: "'Share Tech Mono', monospace",
    letterSpacing: '0.05em',
  },
  heading: { fontSize: '2rem', fontWeight: 700, color: '#1a1a1a', margin: '0 0 8px' },
  subheading: { fontSize: '1rem', color: '#666', margin: '0 0 40px' },
  summary: { background: '#fff', borderRadius: '12px', border: '1px solid #e8e8e8', padding: '28px' },
  summaryHeading: {
    fontSize: '13px', fontFamily: "'Share Tech Mono', monospace",
    textTransform: 'uppercase', letterSpacing: '0.1em', color: '#888', margin: '0 0 20px',
  },
  summaryRow: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 0' },
  summaryLabel: { fontSize: '14px', color: '#666' },
  summaryValue: { fontSize: '14px', color: '#1a1a1a', fontWeight: 500, textAlign: 'right' },
  summaryNote: { fontSize: '12px', color: '#999', lineHeight: 1.6, marginTop: '20px', paddingTop: '16px', borderTop: '1px solid #f0f0f0' },
  formPanel: { background: '#fff', borderRadius: '12px', border: '1px solid #e8e8e8', padding: '28px' },
  formHeading: {
    fontSize: '13px', fontFamily: "'Share Tech Mono', monospace",
    textTransform: 'uppercase', letterSpacing: '0.1em', color: '#888', margin: '0 0 20px',
  },
  fieldGroup: { display: 'flex', flexDirection: 'column', gap: '6px' },
  label: { fontSize: '13px', fontWeight: 600, color: '#1a1a1a', letterSpacing: '0.02em' },
  input: {
    padding: '12px 14px', border: '1px solid #e0e0e0', borderRadius: '8px',
    fontSize: '15px', fontFamily: "'Space Grotesk', Arial, sans-serif",
    color: '#1a1a1a', background: '#faf9f6', outline: 'none',
  },
  cardElement: { padding: '12px 14px', border: '1px solid #e0e0e0', borderRadius: '8px', background: '#faf9f6' },
  error: { color: '#c0392b', fontSize: '14px', margin: '0', padding: '10px 14px', background: '#fdf0ef', borderRadius: '6px', border: '1px solid #f5c6c2' },
  btn: {
    padding: '14px', background: '#1a1a1a', color: '#fff', border: 'none',
    borderRadius: '8px', fontSize: '15px', fontWeight: 600,
    fontFamily: "'Space Grotesk', Arial, sans-serif", cursor: 'pointer', letterSpacing: '0.02em',
  },
  btnDisabled: { background: '#ccc', cursor: 'not-allowed' },
  secureNote: { fontSize: '12px', color: '#aaa', textAlign: 'center', margin: '0' },
  voucherBox: { border: '1px solid #e0e0e0', borderRadius: '8px', overflow: 'hidden' },
  voucherToggle: {
    display: 'flex', alignItems: 'center', justifyContent: 'space-between',
    width: '100%', padding: '14px 16px', background: '#faf9f6',
    border: 'none', cursor: 'pointer', textAlign: 'left', gap: '12px', transition: 'background 0.15s',
  },
  voucherToggleActive: { background: '#f0f7f3', borderBottom: '1px solid #e0e0e0' },
  voucherToggleLeft: { display: 'flex', alignItems: 'center', gap: '12px' },
  voucherToggleTitle: { display: 'block', fontSize: '14px', fontWeight: 600, color: '#1a1a1a' },
  voucherToggleSub: { display: 'block', fontSize: '12px', color: '#888', marginTop: '2px' },
  voucherCheck: {
    width: '28px', height: '28px', borderRadius: '50%', border: '1px solid #ccc',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    fontSize: '14px', color: '#999', flexShrink: 0, background: '#fff',
  },
  voucherCheckActive: { background: '#1a1a1a', border: '1px solid #1a1a1a', color: '#fff' },
  voucherFields: { display: 'flex', flexDirection: 'column', gap: '14px', padding: '16px', background: '#fff' },
  charCount: { marginLeft: '8px', fontSize: '11px', color: '#aaa', fontWeight: 400 },
};

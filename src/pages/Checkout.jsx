import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate, Link } from 'react-router-dom';
import { loadStripe } from '@stripe/stripe-js';
import { Elements, CardElement, useStripe, useElements } from '@stripe/react-stripe-js';

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY);

const AIRCRAFT_NAMES = {
  r22: 'Robinson R22',
  r44: 'Robinson R44',
  r66: 'Robinson R66',
};

const CARD_ELEMENT_OPTIONS = {
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

// ─── Payment Form ────────────────────────────────────────────────────────────
function CheckoutForm({ aircraft, duration, price }) {
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

    // Step 1: create PaymentIntent on server — price validated server-side
    let clientSecret;
    try {
      const res = await fetch('/api/create-payment-intent', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          aircraft,
          duration: Number(duration),
          customerName: name,
          customerEmail: email,
          customerPhone: phone,
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

    // Step 2: confirm card payment — result.error carries user-friendly decline messages
    const result = await stripe.confirmCardPayment(clientSecret, {
      payment_method: {
        card: elements.getElement(CardElement),
        billing_details: { name, email, phone },
      },
    });

    setLoading(false);

    if (result.error) {
      setError(result.error.message);
    } else if (result.paymentIntent.status === 'succeeded') {
      navigate(
        `/booking-confirmed?ref=${result.paymentIntent.id}` +
        `&aircraft=${aircraft}&duration=${duration}&price=${price}` +
        `&name=${encodeURIComponent(name)}`
      );
    }
  };

  return (
    <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
      <div style={styles.fieldGroup}>
        <label style={styles.label}>Full Name</label>
        <input
          style={styles.input}
          type="text"
          placeholder="Jane Smith"
          value={name}
          onChange={e => setName(e.target.value)}
          required
        />
      </div>

      <div style={styles.fieldGroup}>
        <label style={styles.label}>Email Address</label>
        <input
          style={styles.input}
          type="email"
          placeholder="jane@example.com"
          value={email}
          onChange={e => setEmail(e.target.value)}
          required
        />
      </div>

      <div style={styles.fieldGroup}>
        <label style={styles.label}>Phone Number</label>
        <input
          style={styles.input}
          type="tel"
          placeholder="+44 7700 900000"
          value={phone}
          onChange={e => setPhone(e.target.value)}
          required
        />
      </div>

      <div style={styles.fieldGroup}>
        <label style={styles.label}>Card Details</label>
        <div style={styles.cardElement}>
          <CardElement options={CARD_ELEMENT_OPTIONS} />
        </div>
      </div>

      {error && <p style={styles.error}>{error}</p>}

      <button type="submit" disabled={!stripe || loading} style={loading ? { ...styles.btn, ...styles.btnDisabled } : styles.btn}>
        {loading ? 'Processing…' : `Pay £${price}`}
      </button>

      <p style={styles.secureNote}>
        🔒 Payments are processed securely by Stripe. HQ Aviation never sees your card details.
      </p>
    </form>
  );
}

// ─── Page ────────────────────────────────────────────────────────────────────
export default function Checkout() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const aircraft = searchParams.get('aircraft');
  const duration = searchParams.get('duration');
  const price = searchParams.get('price');

  const isValid = aircraft && duration && Number(price) > 0 && AIRCRAFT_NAMES[aircraft];

  // Redirect back if params are missing, unrecognised, or price is non-numeric.
  // useEffect prevents calling navigate() during render (React anti-pattern).
  useEffect(() => {
    if (!isValid) {
      navigate('/training/trial-lessons', { replace: true });
    }
  }, [isValid, navigate]);

  if (!isValid) return null;

  return (
    <div style={styles.page}>
      <div style={styles.container}>

        {/* Back link */}
        <Link to="/training/trial-lessons" style={styles.back}>← Back</Link>

        <h1 style={styles.heading}>Complete Your Booking</h1>
        <p style={styles.subheading}>Pay now — we'll call you to schedule your flight.</p>

        <div style={styles.layout}>

          {/* Order Summary */}
          <div style={styles.summary}>
            <h2 style={styles.summaryHeading}>Order Summary</h2>
            <div style={styles.summaryRow}>
              <span style={styles.summaryLabel}>Aircraft</span>
              <span style={styles.summaryValue}>{AIRCRAFT_NAMES[aircraft]}</span>
            </div>
            <div style={styles.summaryRow}>
              <span style={styles.summaryLabel}>Experience</span>
              <span style={styles.summaryValue}>{duration} Minute Discovery Flight</span>
            </div>
            <div style={{ ...styles.summaryRow, borderTop: '1px solid #e8e8e8', paddingTop: '16px', marginTop: '8px' }}>
              <span style={{ ...styles.summaryLabel, fontWeight: 700, color: '#1a1a1a' }}>Total</span>
              <span style={{ ...styles.summaryValue, fontWeight: 700, fontSize: '1.25rem' }}>£{price}</span>
            </div>
            <p style={styles.summaryNote}>
              After payment, a member of the HQ Aviation team will contact you to arrange a date and time.
            </p>
          </div>

          {/* Payment Form */}
          <div style={styles.formPanel}>
            <h2 style={styles.formHeading}>Your Details &amp; Payment</h2>
            <Elements stripe={stripePromise}>
              <CheckoutForm aircraft={aircraft} duration={duration} price={price} />
            </Elements>
          </div>

        </div>
      </div>
    </div>
  );
}

// ─── Styles ──────────────────────────────────────────────────────────────────
const styles = {
  page: {
    minHeight: '100vh',
    background: '#faf9f6',
    padding: '40px 20px',
    fontFamily: "'Space Grotesk', Arial, sans-serif",
  },
  container: {
    maxWidth: '960px',
    margin: '0 auto',
  },
  back: {
    display: 'inline-block',
    marginBottom: '32px',
    color: '#666',
    textDecoration: 'none',
    fontSize: '14px',
    fontFamily: "'Share Tech Mono', monospace",
    letterSpacing: '0.05em',
  },
  heading: {
    fontSize: '2rem',
    fontWeight: 700,
    color: '#1a1a1a',
    margin: '0 0 8px',
  },
  subheading: {
    fontSize: '1rem',
    color: '#666',
    margin: '0 0 40px',
  },
  layout: {
    display: 'grid',
    gridTemplateColumns: '1fr 1.4fr',
    gap: '40px',
    alignItems: 'start',
  },
  summary: {
    background: '#fff',
    borderRadius: '12px',
    border: '1px solid #e8e8e8',
    padding: '28px',
  },
  summaryHeading: {
    fontSize: '13px',
    fontFamily: "'Share Tech Mono', monospace",
    textTransform: 'uppercase',
    letterSpacing: '0.1em',
    color: '#888',
    margin: '0 0 20px',
  },
  summaryRow: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '10px 0',
  },
  summaryLabel: {
    fontSize: '14px',
    color: '#666',
  },
  summaryValue: {
    fontSize: '14px',
    color: '#1a1a1a',
    fontWeight: 500,
    textAlign: 'right',
  },
  summaryNote: {
    fontSize: '12px',
    color: '#999',
    lineHeight: 1.6,
    marginTop: '20px',
    paddingTop: '16px',
    borderTop: '1px solid #f0f0f0',
  },
  formPanel: {
    background: '#fff',
    borderRadius: '12px',
    border: '1px solid #e8e8e8',
    padding: '28px',
  },
  formHeading: {
    fontSize: '13px',
    fontFamily: "'Share Tech Mono', monospace",
    textTransform: 'uppercase',
    letterSpacing: '0.1em',
    color: '#888',
    margin: '0 0 20px',
  },
  fieldGroup: {
    display: 'flex',
    flexDirection: 'column',
    gap: '6px',
  },
  label: {
    fontSize: '13px',
    fontWeight: 600,
    color: '#1a1a1a',
    letterSpacing: '0.02em',
  },
  input: {
    padding: '12px 14px',
    border: '1px solid #e0e0e0',
    borderRadius: '8px',
    fontSize: '15px',
    fontFamily: "'Space Grotesk', Arial, sans-serif",
    color: '#1a1a1a',
    background: '#faf9f6',
    outline: 'none',
  },
  cardElement: {
    padding: '12px 14px',
    border: '1px solid #e0e0e0',
    borderRadius: '8px',
    background: '#faf9f6',
  },
  error: {
    color: '#c0392b',
    fontSize: '14px',
    margin: '0',
    padding: '10px 14px',
    background: '#fdf0ef',
    borderRadius: '6px',
    border: '1px solid #f5c6c2',
  },
  btn: {
    padding: '14px',
    background: '#1a1a1a',
    color: '#fff',
    border: 'none',
    borderRadius: '8px',
    fontSize: '15px',
    fontWeight: 600,
    fontFamily: "'Space Grotesk', Arial, sans-serif",
    cursor: 'pointer',
    letterSpacing: '0.02em',
  },
  btnDisabled: {
    background: '#ccc',
    cursor: 'not-allowed',
  },
  secureNote: {
    fontSize: '12px',
    color: '#aaa',
    textAlign: 'center',
    margin: '0',
  },
};

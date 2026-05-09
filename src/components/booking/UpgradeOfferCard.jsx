import { useState, useMemo } from 'react';
import { loadStripe } from '@stripe/stripe-js';
import {
  Elements,
  CardNumberElement, CardExpiryElement, CardCvcElement,
  useStripe, useElements,
} from '@stripe/react-stripe-js';

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY);

const fmtGbp = (pence) => `£${(Number(pence) / 100).toLocaleString('en-GB', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

// Local mirror of the price fallbacks so we can compute the diff client-side
// for live display. Server is source of truth at PI creation; this is purely
// presentational. Keep in sync with api/stripe.js PRICE_FALLBACK.
const R44_PRICE_FALLBACK = { 30: 30500, 60: 60500 };

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

function UpgradeForm({ booking, onSuccess }) {
  const stripe = useStripe();
  const elements = useElements();
  const initialDur = booking.duration === 60 ? 60 : 30;
  const [duration, setDuration] = useState(initialDur);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const flightPaid = Number(booking.flightAmountPence) || 0;
  const diffByDuration = useMemo(() => ({
    30: R44_PRICE_FALLBACK[30] - flightPaid,
    60: R44_PRICE_FALLBACK[60] - flightPaid,
  }), [flightPaid]);

  const diffPence = diffByDuration[duration];
  const canUpgrade = diffPence > 0;
  const r44Price = R44_PRICE_FALLBACK[duration];

  async function handleSubmit(e) {
    e.preventDefault();
    if (!stripe || !elements || !canUpgrade) return;
    setError('');
    setLoading(true);

    let clientSecret;
    try {
      const res = await fetch('/api/create-upgrade-payment-intent', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          originalPaymentIntentId: booking.paymentIntentId,
          newDuration: duration,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to start upgrade');
      clientSecret = data.clientSecret;
    } catch (err) {
      setError(err.message || 'Something went wrong. Please try again.');
      setLoading(false);
      return;
    }

    const result = await stripe.confirmCardPayment(clientSecret, {
      payment_method: {
        card: elements.getElement(CardNumberElement),
        billing_details: {
          name: booking.customerName || '',
          email: booking.customerEmail || '',
        },
      },
    });
    setLoading(false);
    if (result.error) {
      setError(result.error.message);
    } else if (result.paymentIntent?.status === 'succeeded') {
      onSuccess({ newAircraft: 'r44', newDuration: duration });
    }
  }

  return (
    <form onSubmit={handleSubmit} style={S.form}>
      <h3 style={S.title}>Bring 2 extra friends — upgrade to R44</h3>
      <p style={S.hint}>This option is also in your confirmation email — no rush deciding now.</p>

      <div style={S.durationRow} role="radiogroup" aria-label="Upgrade duration">
        {[30, 60].map((d) => {
          const active = duration === d;
          const disabled = diffByDuration[d] <= 0;
          return (
            <button
              key={d}
              type="button"
              role="radio"
              aria-checked={active}
              disabled={disabled}
              onClick={() => setDuration(d)}
              style={{
                flex: '1 1 auto',
                padding: '12px',
                border: active ? '2px solid #1a1a1a' : '1px solid #d1d5db',
                background: active ? '#1a1a1a' : '#fff',
                color: active ? '#fff' : '#1a1a1a',
                borderRadius: '8px',
                fontWeight: 600,
                cursor: disabled ? 'not-allowed' : 'pointer',
                opacity: disabled ? 0.5 : 1,
              }}
            >
              {d} min
            </button>
          );
        })}
      </div>

      <div style={S.math}>
        <div>R44 {duration} min: <strong>{fmtGbp(r44Price)}</strong></div>
        <div>− £{(flightPaid / 100).toLocaleString('en-GB', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} already paid</div>
        <div style={S.mathTotal}>= {fmtGbp(diffPence)} to upgrade</div>
      </div>
      <p style={S.alreadyPaid}>You've already paid {fmtGbp(flightPaid)} for your R22 flight. Today you only pay the difference.</p>

      <div style={S.cardField}><CardNumberElement options={CARD_FIELD_STYLE} /></div>
      <div style={S.cardSplit}>
        <div style={S.cardField}><CardExpiryElement options={CARD_FIELD_STYLE} /></div>
        <div style={S.cardField}><CardCvcElement options={CARD_FIELD_STYLE} /></div>
      </div>

      {error && <div style={S.error}>{error}</div>}

      <button type="submit" disabled={!stripe || loading || !canUpgrade} style={S.payBtn}>
        {loading ? 'Processing…' : `Pay ${fmtGbp(diffPence)} to upgrade`}
      </button>
    </form>
  );
}

export default function UpgradeOfferCard({ booking, onUpgraded }) {
  if (!booking) return null;
  if (booking.aircraft !== 'r22') return null;
  if (booking.upgrade) return null;

  return (
    <div style={S.card}>
      <Elements stripe={stripePromise}>
        <UpgradeForm booking={booking} onSuccess={onUpgraded} />
      </Elements>
    </div>
  );
}

const S = {
  card: { background: '#fff', borderRadius: '12px', border: '1px solid #e8e8e8', padding: '24px' },
  form: { display: 'flex', flexDirection: 'column', gap: '14px' },
  title: { fontSize: '1rem', fontWeight: 700, margin: 0, textTransform: 'uppercase', letterSpacing: '0.05em' },
  hint: { fontSize: '0.8rem', color: '#666', margin: 0, fontStyle: 'italic' },
  durationRow: { display: 'flex', gap: '8px' },
  math: { fontSize: '0.95rem', color: '#1a1a1a', background: '#faf9f6', borderRadius: '8px', padding: '12px', lineHeight: 1.7 },
  mathTotal: { fontWeight: 700, fontSize: '1.1rem', marginTop: '4px' },
  alreadyPaid: { fontSize: '0.85rem', color: '#444', margin: 0 },
  cardField: { padding: '12px 14px', border: '1px solid #e0e0e0', borderRadius: '8px', background: '#faf9f6' },
  cardSplit: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' },
  error: { color: '#c0392b', fontSize: '0.9rem', padding: '10px 14px', background: '#fdf0ef', borderRadius: '6px', border: '1px solid #f5c6c2' },
  payBtn: { padding: '14px', background: '#1a1a1a', color: '#fff', border: 'none', borderRadius: '8px', fontWeight: 600, fontSize: '0.95rem', cursor: 'pointer' },
};

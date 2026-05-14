import { useState, useEffect } from 'react';
import { loadStripe } from '@stripe/stripe-js';
import {
  Elements,
  CardNumberElement, CardExpiryElement, CardCvcElement,
  useStripe, useElements,
} from '@stripe/react-stripe-js';

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY);

const fmtGbp = (pence) => `£${(Number(pence) / 100).toLocaleString('en-GB', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
const fmtGbpNoZeros = (pence) => {
  const n = Number(pence) / 100;
  return Number.isInteger(n) ? `£${n.toLocaleString('en-GB')}` : `£${n.toLocaleString('en-GB', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
};

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

/**
 * Compact trigger row designed to sit INSIDE the Booking Summary card.
 * Default duration matches the original booking. Click opens the modal.
 */
export function UpgradeRow({ booking, onClick }) {
  if (!booking) return null;
  if (booking.aircraft !== 'r22') return null;
  if (booking.upgrade) return null;

  const flightPaid = Number(booking.flightAmountPence) || 0;
  // Default to same-duration upgrade (R22 30 → R44 30; R22 60 → R44 60).
  const defaultDur = booking.duration === 60 ? 60 : 30;
  // Server-computed diff (honours admin override). Falls back to local calc
  // for resilience if the API didn't include it.
  const defaultDiff = (typeof booking.upgradeDiffPence === 'number' && booking.upgradeDiffPence > 0)
    ? booking.upgradeDiffPence
    : (R44_PRICE_FALLBACK[defaultDur] - flightPaid);
  if (defaultDiff <= 0) return null;

  return (
    <button type="button" onClick={onClick} style={S.row} aria-label="Upgrade to R44">
      <span style={S.rowText}>
        Bring 2 extra friends, upgrade to R44 for <strong>{fmtGbpNoZeros(defaultDiff)}</strong>
      </span>
      <span style={S.rowArrow} aria-hidden="true">→</span>
    </button>
  );
}

function UpgradeForm({ booking, onSuccess, onCancel, embedded }) {
  const stripe = useStripe();
  const elements = useElements();
  // Duration is locked to whatever the booker originally chose — no toggle.
  const duration = booking.duration === 60 ? 60 : 30;
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const flightPaid = Number(booking.flightAmountPence) || 0;
  // Honour server-computed override when present (admin may have set a
  // promotional fixed upgrade price). Falls back to local auto-calc.
  const diffPence = (typeof booking.upgradeDiffPence === 'number' && booking.upgradeDiffPence > 0)
    ? booking.upgradeDiffPence
    : (R44_PRICE_FALLBACK[duration] - flightPaid);
  const canUpgrade = diffPence > 0;

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
    if (result.error) {
      setLoading(false);
      setError(result.error.message);
      return;
    }
    if (result.paymentIntent?.status === 'succeeded') {
      // Tell the server to apply the upgrade to the booking right away —
      // don't wait for the Stripe webhook. Endpoint is idempotent, so if
      // the webhook beats us to it, the second write is a no-op.
      // Errors are logged but don't block the success path: Stripe already
      // took the money, and the webhook is the safety net. If you see this
      // log fire, check that the server has the /api/record-upgrade route
      // mounted (added in commit 148a7a7) and was restarted.
      try {
        const res = await fetch('/api/record-upgrade', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ upgradePaymentIntentId: result.paymentIntent.id }),
        });
        if (!res.ok) {
          const body = await res.text().catch(() => '');
          console.error('[upgrade] /api/record-upgrade returned', res.status, body);
        }
      } catch (recErr) {
        console.error('[upgrade] /api/record-upgrade fetch failed:', recErr?.message);
      }
      setLoading(false);
      onSuccess({ newAircraft: 'r44', newDuration: duration });
    } else {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} style={S.form}>
      {!embedded && (
        <>
          <h3 style={S.modalTitle}>Upgrade to Robinson R44</h3>
          <div style={S.modalPhotoFrame}>
            <img
              src="/assets/images/new-aircraft/r44/raven-ii-front-alpha.png"
              alt="Robinson R44"
              width={320}
              height={160}
              style={S.modalPhoto}
            />
          </div>
          <p style={S.modalSub}>You at the controls with two mates in the back.</p>
        </>
      )}

      <div style={S.summary}>
        <span>R44 {duration} min upgrade</span>
        <strong>{fmtGbp(diffPence)}</strong>
      </div>

      <div style={S.cardField}><CardNumberElement options={CARD_FIELD_STYLE} /></div>
      <div style={S.cardSplit}>
        <div style={S.cardField}><CardExpiryElement options={CARD_FIELD_STYLE} /></div>
        <div style={S.cardField}><CardCvcElement options={CARD_FIELD_STYLE} /></div>
      </div>

      {error && <div style={S.error}>{error}</div>}

      <button type="submit" disabled={!stripe || loading || !canUpgrade} style={S.payBtn}>
        {loading ? 'Processing…' : `Pay ${fmtGbp(diffPence)} to upgrade`}
      </button>

      {onCancel && (
        <button type="button" onClick={onCancel} style={S.cancelBtn} disabled={loading}>
          Cancel
        </button>
      )}
    </form>
  );
}

/**
 * Modal that wraps the upgrade form. Used by `<UpgradeOfferCard>` when the
 * compact row is clicked. The standalone `/upgrade` page imports
 * `<UpgradeFormStandalone>` directly instead.
 */
export function UpgradeModal({ booking, open, onClose, onSuccess }) {
  useEffect(() => {
    if (!open) return;
    function onKey(e) { if (e.key === 'Escape') onClose(); }
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Upgrade to R44"
      style={S.modalBackdrop}
      onClick={onClose}
    >
      <div onClick={(e) => e.stopPropagation()} style={S.modalPanel}>
        <button type="button" onClick={onClose} aria-label="Close" style={S.modalClose}>×</button>
        <Elements stripe={stripePromise}>
          <UpgradeForm booking={booking} onSuccess={(p) => { onSuccess(p); onClose(); }} />
        </Elements>
      </div>
    </div>
  );
}

/**
 * Standalone version of the upgrade form (no modal chrome). Used by the
 * `/upgrade` page which renders the form full-screen via the email link.
 */
export function UpgradeFormStandalone({ booking, onUpgraded }) {
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

/**
 * Default export: a row + modal pair. Render this inline (e.g. inside the
 * Booking Summary card). Click the row → modal opens with the form.
 */
export default function UpgradeOfferCard({ booking, onUpgraded }) {
  const [open, setOpen] = useState(false);
  if (!booking) return null;
  if (booking.aircraft !== 'r22') return null;
  if (booking.upgrade) return null;
  return (
    <>
      <UpgradeRow booking={booking} onClick={() => setOpen(true)} />
      <UpgradeModal
        booking={booking}
        open={open}
        onClose={() => setOpen(false)}
        onSuccess={onUpgraded}
      />
    </>
  );
}

const S = {
  // Compact trigger row inside the Booking Summary card
  row: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
    padding: '14px 16px',
    margin: '8px 0',
    background: '#ecfdf5',
    border: '1px solid #6ee7b7',
    borderRadius: '8px',
    cursor: 'pointer',
    fontFamily: "'Space Grotesk', Arial, sans-serif",
    fontSize: '14px',
    color: '#065f46',
    textAlign: 'left',
    transition: 'background 0.15s, border-color 0.15s',
  },
  rowText: { flex: '1 1 auto', lineHeight: 1.4 },
  rowArrow: { fontSize: '18px', color: '#047857', marginLeft: '12px', flexShrink: 0 },

  // Standalone card (used by /upgrade page)
  card: { background: '#fff', borderRadius: '12px', border: '1px solid #e8e8e8', padding: '24px' },

  // Modal
  modalBackdrop: {
    position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.6)',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    zIndex: 1000, padding: '16px',
  },
  modalPanel: {
    background: '#fff', borderRadius: '12px', padding: '24px',
    maxWidth: '480px', width: '100%', maxHeight: 'calc(100vh - 32px)',
    overflowY: 'auto', position: 'relative',
    fontFamily: "'Space Grotesk', Arial, sans-serif",
  },
  modalClose: {
    position: 'absolute', top: '12px', right: '16px',
    background: 'none', border: 'none', fontSize: '1.6rem', cursor: 'pointer', color: '#666',
    lineHeight: 1,
  },
  modalPhotoFrame: {
    width: '100%',
    height: '160px',
    background: '#f5f5f5',
    borderRadius: '8px',
    overflow: 'hidden',
    marginBottom: '16px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  modalPhoto: {
    width: '100%',
    height: '100%',
    objectFit: 'contain',
    objectPosition: 'center',
  },
  modalTitle: { fontSize: '1.1rem', fontWeight: 700, margin: '0 0 16px', textAlign: 'center' },
  modalSub: { fontSize: '0.85rem', color: '#666', margin: '0 0 16px' },

  // Form internals
  form: { display: 'flex', flexDirection: 'column', gap: '14px' },
  summary: {
    display: 'flex', justifyContent: 'space-between', alignItems: 'center',
    padding: '12px 14px', background: '#faf9f6', borderRadius: '8px',
    fontSize: '0.95rem', color: '#1a1a1a',
  },
  cardField: { padding: '12px 14px', border: '1px solid #e0e0e0', borderRadius: '8px', background: '#faf9f6' },
  cardSplit: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' },
  error: { color: '#c0392b', fontSize: '0.9rem', padding: '10px 14px', background: '#fdf0ef', borderRadius: '6px', border: '1px solid #f5c6c2' },
  payBtn: { padding: '14px', background: '#1a1a1a', color: '#fff', border: 'none', borderRadius: '8px', fontWeight: 600, fontSize: '0.95rem', cursor: 'pointer' },
  cancelBtn: { padding: '10px', background: 'transparent', color: '#666', border: 'none', cursor: 'pointer', fontSize: '0.85rem' },
};

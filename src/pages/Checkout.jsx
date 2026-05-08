import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate, Link } from 'react-router-dom';
import { loadStripe } from '@stripe/stripe-js';
import { Elements, CardNumberElement, CardExpiryElement, CardCvcElement, useStripe, useElements } from '@stripe/react-stripe-js';
import FinalDraftHeader from '../components/FinalDraftHeader';
import DiscoveryAddons from '../components/checkout/DiscoveryAddons';
import { computeAddonsTotal, computeLineTotal } from '../lib/discoveryAddons';
import { useDiscoveryAddons } from '../hooks/useDiscoveryAddons';
import { trackEvent, getSessionId } from '../lib/analytics';
import EmailFirstStep from './Checkout/EmailFirstStep';
import ExitIntentModal from '../components/Checkout/ExitIntentModal';
import useExitIntent from '../components/Checkout/useExitIntent';
import useTabReturn from '../components/Checkout/useTabReturn';
import { upsertCart, getCartId, rehydrateCartByToken } from '../lib/cart';

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY);

const fmt = (n) => Number(n).toLocaleString('en-GB', { minimumFractionDigits: 2, maximumFractionDigits: 2 });

const AIRCRAFT_NAMES = {
  r22: 'Robinson R22',
  r44: 'Robinson R44',
  r66: 'Robinson R66',
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

// ─── Payment Form ────────────────────────────────────────────────────────────
function CheckoutForm({
  aircraft, duration, price,
  wantsVoucher, setWantsVoucher, voucherLocation, setVoucherLocation, voucherMessage, setVoucherMessage,
  addons, addonsState, addonsTotalPence,
  prefillEmail, cartId,
}) {
  const stripe = useStripe();
  const elements = useElements();
  const navigate = useNavigate();

  const [name, setName] = useState('');
  const [email, setEmail] = useState(prefillEmail || '');
  const [phone, setPhone] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!stripe || !elements) return;

    // Fire add_payment_info before any network work — captures intent even if Stripe call fails
    const params = new URLSearchParams(window.location.search);
    const aircraftParam = params.get('aircraft');
    const durationParam = params.get('duration');
    const priceParam = parseFloat(params.get('price') || '0');
    trackEvent('add_payment_info', `${aircraftParam}-${durationParam}`, window.location.pathname, {
      itemCategory: 'discovery-flight',
      items: [{
        item_id: `${aircraftParam}-${durationParam}`,
        item_category: 'discovery-flight',
        price: priceParam,
        currency: 'gbp',
        quantity: 1,
      }],
      value: priceParam,
      currency: 'gbp',
    });

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
          wantsVoucher,
          voucherLocation: wantsVoucher ? voucherLocation : '',
          voucherMessage: wantsVoucher ? voucherMessage : '',
          addons: addons.map((a) => ({ itemId: a.itemId, qty: a.qty })),
          fulfilment: addons.length > 0 ? (wantsVoucher ? 'delivery' : addonsState.fulfilment) : null,
          shippingAddress: (addons.length > 0 && (addonsState.fulfilment === 'delivery' || wantsVoucher))
            ? addonsState.shippingAddress
            : null,
          cartId: cartId || '',
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

      {/* Physical Voucher */}
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
                placeholder="A message to print on the voucher, e.g. Happy Birthday!"
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
        {loading ? 'Processing…' : `Pay £${fmt(Number(price) + (Number(addonsTotalPence) || 0) / 100)}`}
      </button>

      <p style={styles.secureNote}>
        🔒 Payments are processed securely by Stripe. HQ Aviation never sees your card details.
      </p>
    </form>
  );
}

// ─── Misc Payment Form ───────────────────────────────────────────────────────
function MiscCheckoutForm({ itemId, itemName, qty, price, requiresShipping, apparelSize }) {
  const stripe = useStripe();
  const elements = useElements();
  const navigate = useNavigate();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [shippingAddress, setShippingAddress] = useState({ line1: '', line2: '', city: '', postcode: '' });

  const total = (Number(price) * Number(qty)).toFixed(2);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!stripe || !elements) return;
    setLoading(true);
    setError('');

    let clientSecret;
    try {
      const res = await fetch('/api/create-misc-payment-intent', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          itemId,
          qty: Number(qty),
          customerName: name,
          customerEmail: email,
          customerPhone: phone,
          ...(requiresShipping ? { shippingAddress } : {}),
          ...(apparelSize ? { size: apparelSize } : {}),
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
      navigate(
        `/booking-confirmed?ref=${result.paymentIntent.id}` +
        `&type=misc` +
        `&itemName=${encodeURIComponent(itemName)}` +
        `&name=${encodeURIComponent(name)}`
      );
    }
  };

  return (
    <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
      <div style={styles.fieldGroup}>
        <label style={styles.label}>Full Name</label>
        <input style={styles.input} type="text" placeholder="Jane Smith" value={name} onChange={(e) => setName(e.target.value)} required />
      </div>
      <div style={styles.fieldGroup}>
        <label style={styles.label}>Email Address</label>
        <input style={styles.input} type="email" placeholder="jane@example.com" value={email} onChange={(e) => setEmail(e.target.value)} required />
      </div>
      <div style={styles.fieldGroup}>
        <label style={styles.label}>Phone Number</label>
        <input style={styles.input} type="tel" placeholder="+44 7700 900000" value={phone} onChange={(e) => setPhone(e.target.value)} required />
      </div>

      {requiresShipping && (
        <>
          <div style={styles.fieldGroup}>
            <label style={styles.label}>Address Line 1</label>
            <input style={styles.input} type="text" placeholder="12 Example Street" value={shippingAddress.line1} onChange={(e) => setShippingAddress((a) => ({ ...a, line1: e.target.value }))} required />
          </div>
          <div style={styles.fieldGroup}>
            <label style={styles.label}>Address Line 2 <span style={{ fontWeight: 400, color: '#9ca3af' }}>(optional)</span></label>
            <input style={styles.input} type="text" placeholder="Flat 2" value={shippingAddress.line2} onChange={(e) => setShippingAddress((a) => ({ ...a, line2: e.target.value }))} />
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
            <div style={styles.fieldGroup}>
              <label style={styles.label}>City</label>
              <input style={styles.input} type="text" placeholder="London" value={shippingAddress.city} onChange={(e) => setShippingAddress((a) => ({ ...a, city: e.target.value }))} required />
            </div>
            <div style={styles.fieldGroup}>
              <label style={styles.label}>Postcode</label>
              <input style={styles.input} type="text" placeholder="SW1A 1AA" value={shippingAddress.postcode} onChange={(e) => setShippingAddress((a) => ({ ...a, postcode: e.target.value }))} required />
            </div>
          </div>
        </>
      )}

      <div style={styles.fieldGroup}>
        <label style={styles.label}>Card Number</label>
        <div style={styles.cardElement}><CardNumberElement options={CARD_FIELD_STYLE} /></div>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
        <div style={styles.fieldGroup}>
          <label style={styles.label}>Expiry</label>
          <div style={styles.cardElement}><CardExpiryElement options={CARD_FIELD_STYLE} /></div>
        </div>
        <div style={styles.fieldGroup}>
          <label style={styles.label}>CVC</label>
          <div style={styles.cardElement}><CardCvcElement options={CARD_FIELD_STYLE} /></div>
        </div>
      </div>

      {error && <div style={{ color: '#e74c3c', fontSize: '14px', padding: '10px', background: '#fef2f2', borderRadius: '6px' }}>{error}</div>}

      <button type="submit" disabled={!stripe || loading} style={loading ? { ...styles.btn, ...styles.btnDisabled } : styles.btn}>
        {loading ? 'Processing…' : `Pay £${fmt(total)}`}
      </button>

      <p style={styles.secureNote}>🔒 Payments are processed securely by Stripe. HQ Aviation never sees your card details.</p>
    </form>
  );
}

// ─── Page ────────────────────────────────────────────────────────────────────
export default function Checkout() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const type = searchParams.get('type');
  const isMisc = type === 'misc';

  // Misc params
  const itemId = searchParams.get('itemId');
  const itemName = searchParams.get('itemName');
  const qty = searchParams.get('qty') || '1';
  const requiresShipping = searchParams.get('requiresShipping') === '1';
  const apparelSize = searchParams.get('size') || '';

  // Flight params (existing)
  const aircraft = searchParams.get('aircraft');
  const duration = searchParams.get('duration');
  const price = searchParams.get('price');

  const [email, setEmail] = useState(null);
  const [cartId, setCartIdState] = useState(getCartId());
  const [resumeError, setResumeError] = useState(null);
  const [resumeChecked, setResumeChecked] = useState(false);

  // Pre-flight lead-match: ask the server if we know the email already from a prior lead form
  useEffect(() => {
    if (email) return; // already have one
    if (isMisc) return; // misc flow doesn't use carts
    if (searchParams.get('t')) return; // resume token path handles its own
    upsertCart({ sessionId: getSessionId() }).then((result) => {
      if (result && result.email) {
        setEmail(result.email);
        setCartIdState(result.cartId);
      }
    });
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // Resume from token (recovery email link)
  useEffect(() => {
    const token = searchParams.get('t');
    if (!token || isMisc) {
      setResumeChecked(true);
      return;
    }
    rehydrateCartByToken(token).then((cart) => {
      if (cart) {
        setEmail(cart.email);
        setCartIdState(cart.cartId);
      } else {
        setResumeError('That booking link has expired or is no longer valid.');
      }
      setResumeChecked(true);
    });
  }, [searchParams, isMisc]);

  async function handleEmailContinue(typedEmail) {
    setEmail(typedEmail);
    const result = await upsertCart({
      sessionId: getSessionId(),
      email: typedEmail,
      flight: aircraft && duration ? { aircraftId: aircraft, duration: parseInt(duration, 10) } : null,
      utm: {
        source: searchParams.get('utm_source'),
        medium: searchParams.get('utm_medium'),
        campaign: searchParams.get('utm_campaign'),
        term: searchParams.get('utm_term'),
        content: searchParams.get('utm_content'),
      },
      referrer: document.referrer || null,
    });
    if (result && result.cartId) setCartIdState(result.cartId);
  }

  const [wantsVoucher, setWantsVoucher] = useState(false);
  const [voucherLocation, setVoucherLocation] = useState('');
  const [voucherMessage, setVoucherMessage] = useState('');
  const [addonsState, setAddonsState] = useState({
    qtyByItemId: {},
    fulfilment: 'collect',
    shippingAddress: { line1: '', line2: '', city: '', postcode: '' },
  });

  const { items: allAddons } = useDiscoveryAddons();

  const basketAddons = (allAddons || []).flatMap((it) => {
    const qty = addonsState.qtyByItemId[it.id] || 0;
    if (qty <= 0) return [];
    return [{
      itemId: it.id,
      name: it.name,
      qty,
      price: it.price,
      discountPct: Number(it.discoveryAddonDiscountPct) || 0,
      lineTotal: computeLineTotal({ price: it.price, qty, discountPct: it.discoveryAddonDiscountPct }),
    }];
  });

  const addonsTotalPence = computeAddonsTotal(
    basketAddons.map((a) => ({ price: a.price, qty: a.qty, discountPct: a.discountPct }))
  );
  const addonsTotalPounds = addonsTotalPence / 100;

  const flightPricePounds = Number(price) || 0;
  const grandTotalPounds = flightPricePounds + addonsTotalPounds;

  const isMiscValid = isMisc && !!itemId && !!itemName && Number(price) > 0 && Number(qty) >= 1;
  const isFlightValid = !isMisc && !!aircraft && !!duration && Number(price) > 0 && !!AIRCRAFT_NAMES[aircraft];
  const isValid = isMiscValid || isFlightValid;

  const [exitDismissed, setExitDismissed] = useState(false);

  const exitTriggered = useExitIntent({ enabled: !isMisc && !email && !exitDismissed });
  const returnTriggered = useTabReturn({ enabled: !isMisc && !email && !exitDismissed });
  const showExitModal = !isMisc && !email && !exitDismissed && (exitTriggered || returnTriggered);

  useEffect(() => {
    if (!isValid) {
      navigate(isMisc ? '/misc' : '/training/trial-lessons', { replace: true });
    }
  }, [isValid, navigate, isMisc]);

  if (!isValid) return null;

  if (resumeError) {
    return (
      <div style={{ maxWidth: 480, margin: '40px auto', padding: 24, color: '#f87171', textAlign: 'center' }}>
        {resumeError}
      </div>
    );
  }

  // Wait for token lookup to settle before deciding whether to show EmailFirstStep
  if (!resumeChecked) {
    return null;
  }

  if (!isMisc && !email) {
    return <EmailFirstStep onContinue={handleEmailContinue} />;
  }

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
          .co-page-wrap {
            padding-top: 80px !important;
          }
          .co-layout {
            grid-template-columns: 1fr;
            gap: 20px;
          }
          .co-layout .co-summary {
            order: 2;
            width: 100%;
            box-sizing: border-box;
          }
          .co-layout .co-form {
            order: 1;
            width: 100%;
            box-sizing: border-box;
          }
          .co-page-heading {
            font-size: 1.5rem !important;
          }
          .co-page-subheading {
            font-size: 0.9rem !important;
            margin-bottom: 24px !important;
          }
        }
      `}</style>
      <div style={styles.container}>

        {/* Back link */}
        <Link to={isMisc ? `/misc/${itemId}` : '/training/trial-lessons'} style={styles.back}>← Back</Link>

        <h1 style={styles.heading} className="co-page-heading">
          {isMisc ? 'Complete Your Purchase' : 'Complete Your Booking'}
        </h1>
        <p style={styles.subheading} className="co-page-subheading">
          {isMisc ? 'Pay securely. The HQ team will be in touch about your order.' : "Pay now. We'll call you to schedule your flight."}
        </p>

        <div className="co-layout">

          {/* Order Summary */}
          <div style={styles.summary} className="co-summary">
            <h2 style={styles.summaryHeading}>Order Summary</h2>
            {isMisc ? (
              <>
                <div style={styles.summaryRow}>
                  <span style={styles.summaryLabel}>Item</span>
                  <span style={styles.summaryValue}>{itemName}</span>
                </div>
                {Number(qty) > 1 && (
                  <div style={styles.summaryRow}>
                    <span style={styles.summaryLabel}>Quantity</span>
                    <span style={styles.summaryValue}>{qty}</span>
                  </div>
                )}
                <div style={{ ...styles.summaryRow, borderTop: '1px solid #e8e8e8', paddingTop: '16px', marginTop: '8px' }}>
                  <span style={{ ...styles.summaryLabel, fontWeight: 700, color: '#1a1a1a' }}>Total</span>
                  <span style={{ ...styles.summaryValue, fontWeight: 700, fontSize: '1.25rem' }}>
                    £{fmt(Number(price) * Number(qty))}
                  </span>
                </div>
                <p style={styles.summaryNote}>
                  After payment, the HQ Aviation team will be in touch to arrange your order.
                </p>
              </>
            ) : (
              <>
                <div style={styles.summaryRow}>
                  <span style={styles.summaryLabel}>Aircraft</span>
                  <span style={styles.summaryValue}>{AIRCRAFT_NAMES[aircraft]}</span>
                </div>
                <div style={styles.summaryRow}>
                  <span style={styles.summaryLabel}>Experience</span>
                  <span style={styles.summaryValue}>{duration} Minute Discovery Flight</span>
                </div>
                {wantsVoucher && (
                  <div style={styles.summaryRow}>
                    <span style={styles.summaryLabel}>Physical voucher</span>
                    <span style={{ ...styles.summaryValue, color: '#2d7a4f', fontSize: '13px' }}>Included</span>
                  </div>
                )}
                {/* DF Add-ons (shown after voucher line) */}
                <DiscoveryAddons
                  value={addonsState}
                  onChange={setAddonsState}
                  voucherActive={wantsVoucher}
                />

                {basketAddons.length > 0 && basketAddons.map((a) => (
                  <div key={a.itemId} style={styles.summaryRow}>
                    <span style={styles.summaryLabel}>{a.name} × {a.qty}{a.discountPct > 0 ? ` (${a.discountPct}% off)` : ''}</span>
                    <span style={styles.summaryValue}>£{fmt(a.lineTotal / 100)}</span>
                  </div>
                ))}

                <div style={{ ...styles.summaryRow, borderTop: '1px solid #e8e8e8', paddingTop: '16px', marginTop: '8px' }}>
                  <span style={{ ...styles.summaryLabel, fontWeight: 700, color: '#1a1a1a' }}>Total</span>
                  <span style={{ ...styles.summaryValue, fontWeight: 700, fontSize: '1.25rem' }}>£{fmt(grandTotalPounds)}</span>
                </div>
                <p style={styles.summaryNote}>
                  After payment, a member of the HQ Aviation team will contact you to arrange a date and time.
                </p>
              </>
            )}
          </div>

          {/* Payment Form */}
          <div style={styles.formPanel} className="co-form">
            <h2 style={styles.formHeading}>Your Details &amp; Payment</h2>
            <Elements stripe={stripePromise}>
              {isMisc ? (
                <MiscCheckoutForm itemId={itemId} itemName={itemName} qty={qty} price={price} requiresShipping={requiresShipping} apparelSize={apparelSize} />
              ) : (
                <CheckoutForm
                  aircraft={aircraft}
                  duration={duration}
                  price={price}
                  wantsVoucher={wantsVoucher}
                  setWantsVoucher={setWantsVoucher}
                  voucherLocation={voucherLocation}
                  setVoucherLocation={setVoucherLocation}
                  voucherMessage={voucherMessage}
                  setVoucherMessage={setVoucherMessage}
                  addons={basketAddons}
                  addonsState={addonsState}
                  addonsTotalPence={addonsTotalPence}
                  prefillEmail={email}
                  cartId={cartId}
                />
              )}
            </Elements>
          </div>

        </div>
      </div>
    </div>
      <ExitIntentModal
        open={showExitModal}
        onSave={(typedEmail) => { setExitDismissed(true); handleEmailContinue(typedEmail); }}
        onDismiss={() => setExitDismissed(true)}
      />
    </>
  );
}

// ─── Styles ──────────────────────────────────────────────────────────────────
const styles = {
  page: {
    minHeight: '100vh',
    width: '100%',
    boxSizing: 'border-box',
    background: '#faf9f6',
    padding: '120px 20px 40px',
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
  voucherBox: {
    border: '1px solid #e0e0e0',
    borderRadius: '8px',
    overflow: 'hidden',
  },
  voucherToggle: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%',
    padding: '14px 16px',
    background: '#faf9f6',
    border: 'none',
    cursor: 'pointer',
    textAlign: 'left',
    gap: '12px',
    transition: 'background 0.15s',
  },
  voucherToggleActive: {
    background: '#f0f7f3',
    borderBottom: '1px solid #e0e0e0',
  },
  voucherToggleLeft: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
  },
  voucherIcon: {
    fontSize: '20px',
    lineHeight: 1,
  },
  voucherToggleTitle: {
    display: 'block',
    fontSize: '14px',
    fontWeight: 600,
    color: '#1a1a1a',
  },
  voucherToggleSub: {
    display: 'block',
    fontSize: '12px',
    color: '#888',
    marginTop: '2px',
  },
  voucherCheck: {
    width: '28px',
    height: '28px',
    borderRadius: '50%',
    border: '1px solid #ccc',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '14px',
    color: '#999',
    flexShrink: 0,
    background: '#fff',
  },
  voucherCheckActive: {
    background: '#1a1a1a',
    border: '1px solid #1a1a1a',
    color: '#fff',
  },
  voucherFields: {
    display: 'flex',
    flexDirection: 'column',
    gap: '14px',
    padding: '16px',
    background: '#fff',
  },
  charCount: {
    marginLeft: '8px',
    fontSize: '11px',
    color: '#aaa',
    fontWeight: 400,
  },
};

import { useEffect, useState } from 'react';
import { useSearchParams, useNavigate, Link } from 'react-router-dom';
import FinalDraftHeader from '../components/FinalDraftHeader';
import { UpgradeFormStandalone } from '../components/booking/UpgradeOfferCard';

const fmtGbp = (pence) => `£${(Number(pence) / 100).toLocaleString('en-GB', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
const AIRCRAFT_NAMES = { r22: 'Robinson R22', r44: 'Robinson R44', r66: 'Robinson R66' };

export default function Upgrade() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const ref = searchParams.get('ref') || '';

  const [booking, setBooking] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!ref) {
      setError('Link expired or invalid. Contact HQ.');
      setLoading(false);
      return;
    }
    (async () => {
      try {
        const res = await fetch(`/api/booking/${encodeURIComponent(ref)}`);
        if (res.status === 404) {
          setError('Link expired or invalid. Contact HQ.');
          setLoading(false);
          return;
        }
        if (!res.ok) throw new Error('Failed to load booking');
        const data = await res.json();
        setBooking(data);
      } catch {
        setError('Link expired or invalid. Contact HQ.');
      } finally {
        setLoading(false);
      }
    })();
  }, [ref]);

  if (loading) {
    return (
      <>
        <FinalDraftHeader hideMenu />
        <div style={S.page}><div style={S.container}><p style={S.loading}>Loading…</p></div></div>
      </>
    );
  }

  if (error || !booking) {
    return (
      <>
        <FinalDraftHeader hideMenu />
        <div style={S.page}>
          <div style={S.container}>
            <h1 style={S.heading}>Upgrade</h1>
            <p style={S.error}>{error}</p>
            <Link to="/" style={S.link}>Return to HQ Aviation</Link>
          </div>
        </div>
      </>
    );
  }

  if (booking.upgrade) {
    return (
      <>
        <FinalDraftHeader hideMenu />
        <div style={S.page}>
          <div style={S.container}>
            <h1 style={S.heading}>You've already upgraded</h1>
            <p style={S.note}>You're booked on a {AIRCRAFT_NAMES[booking.aircraft]} {booking.duration}-minute flight. See you at HQ.</p>
            <Link to="/" style={S.link}>Return to HQ Aviation</Link>
          </div>
        </div>
      </>
    );
  }

  if (booking.aircraft !== 'r22') {
    return (
      <>
        <FinalDraftHeader hideMenu />
        <div style={S.page}>
          <div style={S.container}>
            <h1 style={S.heading}>Not eligible for upgrade</h1>
            <p style={S.note}>This booking isn't eligible for an upgrade. Contact HQ if you'd like to discuss options.</p>
            <Link to="/" style={S.link}>Return to HQ Aviation</Link>
          </div>
        </div>
      </>
    );
  }

  function handleUpgraded() {
    navigate(`/booking-confirmed?ref=${encodeURIComponent(booking.paymentIntentId)}`);
  }

  return (
    <>
      <FinalDraftHeader hideMenu />
      <div style={S.page}>
        <div style={S.container}>
          <h1 style={S.heading}>Upgrade to R44</h1>
          <p style={S.subheading}>
            Your original booking: {AIRCRAFT_NAMES[booking.aircraft]} {booking.duration} min — {fmtGbp(booking.flightAmountPence)} paid.
          </p>
          <UpgradeFormStandalone booking={booking} onUpgraded={handleUpgraded} />
        </div>
      </div>
    </>
  );
}

const S = {
  page: { minHeight: '100vh', background: '#faf9f6', padding: '120px 20px 40px', fontFamily: "'Space Grotesk', Arial, sans-serif" },
  container: { maxWidth: '600px', margin: '0 auto' },
  heading: { fontSize: '2rem', fontWeight: 700, margin: '0 0 8px' },
  subheading: { fontSize: '1rem', color: '#666', margin: '0 0 32px' },
  loading: { color: '#888', textAlign: 'center' },
  error: { color: '#c0392b', margin: '20px 0' },
  note: { color: '#444', lineHeight: 1.6 },
  link: { display: 'inline-block', marginTop: '24px', padding: '12px 28px', background: '#1a1a1a', color: '#fff', borderRadius: '8px', textDecoration: 'none', fontSize: '14px', fontWeight: 600 },
};

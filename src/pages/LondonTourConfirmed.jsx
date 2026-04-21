import React from 'react';
import { useSearchParams, Link } from 'react-router-dom';

const EXPERIENCE_NAMES = {
  shared: 'Shared',
  private: 'Private Charter',
};

const TIME_NAMES = {
  day: 'Daytime',
  sunset: 'Sunset',
  night: 'Night',
};

export default function LondonTourConfirmed() {
  const [searchParams] = useSearchParams();

  const ref        = searchParams.get('ref');
  const experience = searchParams.get('experience');
  const timeOfDay  = searchParams.get('timeOfDay');
  const quantity   = searchParams.get('quantity');
  const price      = searchParams.get('price');
  const name       = searchParams.get('name');

  const experienceName = EXPERIENCE_NAMES[experience] || experience || 'London Tour';
  const timeName       = TIME_NAMES[timeOfDay] || timeOfDay || '';
  const passengerLine  = experience === 'shared'
    ? `${quantity} passenger${Number(quantity) > 1 ? 's' : ''}`
    : 'Private charter (up to 4)';

  return (
    <div style={styles.page}>
      <div style={styles.container}>

        <div style={styles.checkmark}>✓</div>

        <h1 style={styles.heading}>Booking Confirmed</h1>
        <p style={styles.subheading}>
          {name ? `Thank you, ${name}.` : 'Thank you.'} Your London Tour has been booked.
        </p>

        <div style={styles.card}>
          <h2 style={styles.cardHeading}>Booking Summary</h2>

          <div style={styles.row}>
            <span style={styles.label}>Experience</span>
            <span style={styles.value}>{experienceName}</span>
          </div>
          <div style={styles.row}>
            <span style={styles.label}>Time of Day</span>
            <span style={styles.value}>{timeName}</span>
          </div>
          <div style={styles.row}>
            <span style={styles.label}>Passengers</span>
            <span style={styles.value}>{passengerLine}</span>
          </div>
          <div style={styles.row}>
            <span style={styles.label}>Amount Paid</span>
            <span style={styles.value}>£{price}</span>
          </div>
          {ref && (
            <div style={{ ...styles.row, borderTop: '1px solid #f0f0f0', marginTop: '12px', paddingTop: '12px' }}>
              <span style={{ ...styles.label, fontSize: '12px', color: '#bbb' }}>Booking Reference</span>
              <span style={{ ...styles.value, fontSize: '12px', color: '#bbb', fontFamily: "'Share Tech Mono', monospace" }}>{ref}</span>
            </div>
          )}
        </div>

        <p style={styles.nextStep}>
          A member of the HQ Aviation team will be in touch shortly to confirm your flight date and brief you on what to expect.
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
  container: { maxWidth: '520px', width: '100%', textAlign: 'center' },
  checkmark: {
    width: '64px', height: '64px', borderRadius: '50%',
    background: '#1a1a1a', color: '#fff', fontSize: '28px',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    margin: '0 auto 24px',
  },
  heading: { fontSize: '2rem', fontWeight: 700, color: '#1a1a1a', margin: '0 0 12px' },
  subheading: { fontSize: '1rem', color: '#666', margin: '0 0 32px', lineHeight: 1.6 },
  card: {
    background: '#fff', borderRadius: '12px', border: '1px solid #e8e8e8',
    padding: '28px', textAlign: 'left', marginBottom: '28px',
  },
  cardHeading: {
    fontSize: '13px', fontFamily: "'Share Tech Mono', monospace",
    textTransform: 'uppercase', letterSpacing: '0.1em', color: '#888', margin: '0 0 20px',
  },
  row: { display: 'flex', justifyContent: 'space-between', padding: '10px 0' },
  label: { fontSize: '14px', color: '#666' },
  value: { fontSize: '14px', color: '#1a1a1a', fontWeight: 600 },
  nextStep: { fontSize: '15px', color: '#444', lineHeight: 1.7, margin: '0 0 12px' },
  emailNote: { fontSize: '13px', color: '#aaa', margin: '0 0 32px' },
  homeLink: {
    display: 'inline-block', padding: '12px 28px',
    background: '#1a1a1a', color: '#fff', borderRadius: '8px',
    textDecoration: 'none', fontSize: '14px', fontWeight: 600, letterSpacing: '0.02em',
  },
};

import React, { useState, useEffect } from 'react';

/**
 * adv-047: Countdown Blocks
 * Feedback: "That's quite cool"
 */

const styles = {
  container: {
    padding: '4rem 2rem',
    background: 'linear-gradient(135deg, #1a1a1a 0%, #2d2d2d 100%)',
    color: '#fff',
  },
  header: {
    textAlign: 'center',
    marginBottom: '3rem',
  },
  overline: {
    fontFamily: "'Share Tech Mono', monospace",
    fontSize: '0.65rem',
    letterSpacing: '0.2em',
    color: 'var(--hq-accent, #E04A2F)',
    textTransform: 'uppercase',
  },
  title: {
    fontSize: 'clamp(1.5rem, 4vw, 2rem)',
    fontWeight: 700,
    textTransform: 'uppercase',
    margin: '0.5rem 0 0 0',
  },
  subtitle: {
    fontSize: '1rem',
    color: 'rgba(255,255,255,0.6)',
    marginTop: '0.5rem',
  },
  blocksContainer: {
    display: 'flex',
    justifyContent: 'center',
    gap: '1.5rem',
    flexWrap: 'wrap',
    maxWidth: '600px',
    margin: '0 auto',
  },
  block: {
    position: 'relative',
    width: '120px',
    textAlign: 'center',
  },
  blockValue: {
    fontFamily: "'Share Tech Mono', monospace",
    fontSize: '3.5rem',
    fontWeight: 700,
    lineHeight: 1,
    background: 'rgba(255,255,255,0.05)',
    borderRadius: '12px',
    padding: '1.5rem 1rem',
    position: 'relative',
    border: '1px solid rgba(255,255,255,0.1)',
  },
  blockValueAfter: {
    content: '""',
    position: 'absolute',
    left: '10%',
    right: '10%',
    top: '50%',
    height: '1px',
    background: 'rgba(0,0,0,0.2)',
  },
  blockLabel: {
    fontFamily: "'Share Tech Mono', monospace",
    fontSize: '0.65rem',
    letterSpacing: '0.2em',
    textTransform: 'uppercase',
    color: 'rgba(255,255,255,0.5)',
    marginTop: '0.75rem',
  },
  separator: {
    fontFamily: "'Share Tech Mono', monospace",
    fontSize: '2.5rem',
    color: 'var(--hq-accent, #E04A2F)',
    alignSelf: 'flex-start',
    paddingTop: '1.5rem',
    animation: 'blink 1s ease-in-out infinite',
  },
  eventInfo: {
    textAlign: 'center',
    marginTop: '2.5rem',
    padding: '1.5rem',
    background: 'rgba(255,255,255,0.02)',
    borderRadius: '8px',
    border: '1px solid rgba(255,255,255,0.05)',
    maxWidth: '500px',
    margin: '2.5rem auto 0',
  },
  eventName: {
    fontSize: '1.25rem',
    fontWeight: 600,
    marginBottom: '0.5rem',
  },
  eventDate: {
    fontFamily: "'Share Tech Mono', monospace",
    fontSize: '0.8rem',
    color: 'rgba(255,255,255,0.6)',
    letterSpacing: '0.1em',
  },
  note: {
    marginTop: '2rem',
    padding: '1rem 1.25rem',
    background: 'rgba(212, 237, 218, 0.1)',
    borderLeft: '4px solid #28a745',
    borderRadius: '0 8px 8px 0',
    maxWidth: '600px',
    margin: '2rem auto 0',
  },
  noteLabel: {
    fontFamily: "'Share Tech Mono', monospace",
    fontSize: '0.6rem',
    letterSpacing: '0.15em',
    textTransform: 'uppercase',
    color: '#28a745',
    marginBottom: '0.5rem',
  },
  noteText: {
    fontSize: '0.85rem',
    color: 'rgba(255,255,255,0.7)',
    lineHeight: 1.6,
    margin: 0,
  },
};

const CountdownBlocks = ({
  targetDate = new Date('2025-06-15T09:00:00'),
  eventName = "Iceland Expedition Departure",
}) => {
  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });

  useEffect(() => {
    const calculateTimeLeft = () => {
      const difference = targetDate - new Date();

      if (difference > 0) {
        return {
          days: Math.floor(difference / (1000 * 60 * 60 * 24)),
          hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
          minutes: Math.floor((difference / 1000 / 60) % 60),
          seconds: Math.floor((difference / 1000) % 60),
        };
      }

      return { days: 0, hours: 0, minutes: 0, seconds: 0 };
    };

    setTimeLeft(calculateTimeLeft());

    const timer = setInterval(() => {
      setTimeLeft(calculateTimeLeft());
    }, 1000);

    return () => clearInterval(timer);
  }, [targetDate]);

  const formatNumber = (num) => String(num).padStart(2, '0');

  return (
    <div style={styles.container}>
      <style>{`
        @keyframes blink {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.3; }
        }
      `}</style>

      <div style={styles.header}>
        <span style={styles.overline}>Next Adventure</span>
        <h2 style={styles.title}>Countdown</h2>
        <p style={styles.subtitle}>Until lift-off</p>
      </div>

      <div style={styles.blocksContainer}>
        <div style={styles.block}>
          <div style={styles.blockValue}>
            {formatNumber(timeLeft.days)}
            <div style={styles.blockValueAfter} />
          </div>
          <div style={styles.blockLabel}>Days</div>
        </div>

        <span style={styles.separator}>:</span>

        <div style={styles.block}>
          <div style={styles.blockValue}>
            {formatNumber(timeLeft.hours)}
            <div style={styles.blockValueAfter} />
          </div>
          <div style={styles.blockLabel}>Hours</div>
        </div>

        <span style={styles.separator}>:</span>

        <div style={styles.block}>
          <div style={styles.blockValue}>
            {formatNumber(timeLeft.minutes)}
            <div style={styles.blockValueAfter} />
          </div>
          <div style={styles.blockLabel}>Minutes</div>
        </div>

        <span style={styles.separator}>:</span>

        <div style={styles.block}>
          <div style={styles.blockValue}>
            {formatNumber(timeLeft.seconds)}
            <div style={styles.blockValueAfter} />
          </div>
          <div style={styles.blockLabel}>Seconds</div>
        </div>
      </div>

      <div style={styles.eventInfo}>
        <div style={styles.eventName}>{eventName}</div>
        <div style={styles.eventDate}>
          {targetDate.toLocaleDateString('en-GB', {
            weekday: 'long',
            day: 'numeric',
            month: 'long',
            year: 'numeric',
          })}
        </div>
      </div>

      <div style={styles.note}>
        <div style={styles.noteLabel}>adv-047 • Approved</div>
        <p style={styles.noteText}>
          Countdown blocks for upcoming expeditions, events, or course start dates.
        </p>
      </div>
    </div>
  );
};

export default CountdownBlocks;

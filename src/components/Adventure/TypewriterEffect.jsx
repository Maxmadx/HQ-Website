import React, { useState, useEffect } from 'react';

/**
 * anim-006: Typing / Typewriter Effect
 * Feedback: "This would be really cool when enquiring about a discovery flight, when the inquiry is sent"
 * Target: training/trial-lessons - confirmation message after enquiry submission
 */

const styles = {
  container: {
    padding: '4rem 2rem',
    background: 'linear-gradient(135deg, #1a1a1a 0%, #2d2d2d 100%)',
    color: '#fff',
  },
  card: {
    maxWidth: '500px',
    margin: '0 auto',
    background: 'rgba(255,255,255,0.02)',
    borderRadius: '12px',
    border: '1px solid rgba(255,255,255,0.1)',
    overflow: 'hidden',
  },
  header: {
    padding: '1.5rem 2rem',
    borderBottom: '1px solid rgba(255,255,255,0.05)',
    display: 'flex',
    alignItems: 'center',
    gap: '1rem',
  },
  successIcon: {
    width: '50px',
    height: '50px',
    background: '#28a745',
    borderRadius: '50%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    animation: 'scaleIn 0.5s ease',
  },
  checkmark: {
    width: '24px',
    height: '24px',
    color: '#fff',
  },
  headerText: {
    flex: 1,
  },
  overline: {
    fontFamily: "'Share Tech Mono', monospace",
    fontSize: '0.6rem',
    letterSpacing: '0.2em',
    color: '#28a745',
    textTransform: 'uppercase',
  },
  title: {
    fontSize: '1.25rem',
    fontWeight: 600,
    margin: '0.25rem 0 0 0',
  },
  body: {
    padding: '2rem',
  },
  typewriterText: {
    fontFamily: "'Share Tech Mono', monospace",
    fontSize: '0.9rem',
    lineHeight: 1.8,
    color: 'rgba(255,255,255,0.8)',
    minHeight: '120px',
  },
  cursor: {
    display: 'inline-block',
    width: '2px',
    height: '1.1em',
    background: 'var(--hq-accent, #E04A2F)',
    marginLeft: '2px',
    verticalAlign: 'text-bottom',
    animation: 'blink 0.7s step-end infinite',
  },
  details: {
    marginTop: '2rem',
    paddingTop: '1.5rem',
    borderTop: '1px solid rgba(255,255,255,0.05)',
    display: 'grid',
    gridTemplateColumns: 'repeat(2, 1fr)',
    gap: '1rem',
  },
  detailItem: {
    display: 'flex',
    flexDirection: 'column',
    gap: '0.25rem',
  },
  detailLabel: {
    fontFamily: "'Share Tech Mono', monospace",
    fontSize: '0.6rem',
    letterSpacing: '0.15em',
    textTransform: 'uppercase',
    color: 'rgba(255,255,255,0.4)',
  },
  detailValue: {
    fontSize: '0.9rem',
    color: '#fff',
  },
  footer: {
    padding: '1.5rem 2rem',
    background: 'rgba(255,255,255,0.02)',
    borderTop: '1px solid rgba(255,255,255,0.05)',
  },
  footerText: {
    fontFamily: "'Share Tech Mono', monospace",
    fontSize: '0.7rem',
    color: 'rgba(255,255,255,0.4)',
    letterSpacing: '0.1em',
  },
  demo: {
    textAlign: 'center',
    marginBottom: '2rem',
  },
  demoBtn: {
    padding: '0.875rem 2rem',
    background: 'var(--hq-accent, #E04A2F)',
    color: '#fff',
    border: 'none',
    borderRadius: '6px',
    fontFamily: "'Space Grotesk', sans-serif",
    fontSize: '0.75rem',
    fontWeight: 600,
    letterSpacing: '0.1em',
    textTransform: 'uppercase',
    cursor: 'pointer',
    transition: 'background 0.3s ease',
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

const confirmationMessages = [
  "Your enquiry has been received...",
  "",
  "Thank you for your interest in a discovery flight with HQ Aviation.",
  "",
  "One of our team will contact you within 24 hours to discuss available slots and answer any questions.",
  "",
  "In the meantime, feel free to browse our training programmes or explore our fleet.",
  "",
  "We look forward to welcoming you to the skies.",
  "",
  "— The HQ Aviation Team"
];

const TypewriterEffect = () => {
  const [isTyping, setIsTyping] = useState(false);
  const [displayText, setDisplayText] = useState('');
  const [messageIndex, setMessageIndex] = useState(0);
  const [charIndex, setCharIndex] = useState(0);

  const startTyping = () => {
    setIsTyping(true);
    setDisplayText('');
    setMessageIndex(0);
    setCharIndex(0);
  };

  useEffect(() => {
    if (!isTyping) return;

    const currentMessage = confirmationMessages[messageIndex];

    if (charIndex < currentMessage.length) {
      // Still typing current message
      const timer = setTimeout(() => {
        setDisplayText(prev => prev + currentMessage[charIndex]);
        setCharIndex(prev => prev + 1);
      }, 30 + Math.random() * 40); // Variable typing speed for realism

      return () => clearTimeout(timer);
    } else if (messageIndex < confirmationMessages.length - 1) {
      // Move to next message
      const timer = setTimeout(() => {
        setDisplayText(prev => prev + '\n');
        setMessageIndex(prev => prev + 1);
        setCharIndex(0);
      }, currentMessage.length === 0 ? 100 : 500); // Pause between lines

      return () => clearTimeout(timer);
    } else {
      // Finished typing
      setIsTyping(false);
    }
  }, [isTyping, messageIndex, charIndex]);

  return (
    <div style={styles.container}>
      <style>{`
        @keyframes blink {
          50% { opacity: 0; }
        }
        @keyframes scaleIn {
          from { transform: scale(0); }
          to { transform: scale(1); }
        }
        .demo-btn:hover {
          background: #c93e25 !important;
        }
      `}</style>

      <div style={styles.demo}>
        <button
          className="demo-btn"
          style={styles.demoBtn}
          onClick={startTyping}
          disabled={isTyping}
        >
          {isTyping ? 'Typing...' : 'Demo: Submit Enquiry'}
        </button>
      </div>

      <div style={styles.card}>
        <div style={styles.header}>
          <div style={styles.successIcon}>
            <svg style={styles.checkmark} viewBox="0 0 24 24" fill="currentColor">
              <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41L9 16.17z"/>
            </svg>
          </div>
          <div style={styles.headerText}>
            <span style={styles.overline}>Enquiry Submitted</span>
            <h3 style={styles.title}>Message Received</h3>
          </div>
        </div>

        <div style={styles.body}>
          <div style={styles.typewriterText}>
            {displayText.split('\n').map((line, i) => (
              <React.Fragment key={i}>
                {line}
                {i < displayText.split('\n').length - 1 && <br />}
              </React.Fragment>
            ))}
            {isTyping && <span style={styles.cursor} />}
          </div>

          <div style={styles.details}>
            <div style={styles.detailItem}>
              <span style={styles.detailLabel}>Reference</span>
              <span style={styles.detailValue}>#HQ-DF-2025-0842</span>
            </div>
            <div style={styles.detailItem}>
              <span style={styles.detailLabel}>Response Time</span>
              <span style={styles.detailValue}>Within 24 hours</span>
            </div>
          </div>
        </div>

        <div style={styles.footer}>
          <span style={styles.footerText}>
            A copy of this confirmation has been sent to your email
          </span>
        </div>
      </div>

      <div style={styles.note}>
        <div style={styles.noteLabel}>anim-006 • Approved</div>
        <p style={styles.noteText}>
          Typewriter effect for enquiry confirmation messages. Creates engaging feedback
          after form submission on the discovery flight page.
        </p>
      </div>
    </div>
  );
};

export default TypewriterEffect;

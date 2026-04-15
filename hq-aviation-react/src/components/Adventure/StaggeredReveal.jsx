import React, { useEffect, useRef, useState } from 'react';

/**
 * anim-010: Staggered Animation Timing
 * Feedback: "This I want as a reveal for card elements like the Our Team"
 * Target: about-us/team - scroll reveal animation for team cards and similar grid layouts
 */

const styles = {
  container: {
    padding: '4rem 2rem',
    background: 'var(--hq-background, #faf9f6)',
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
    fontSize: 'clamp(1.5rem, 4vw, 2.25rem)',
    fontWeight: 700,
    textTransform: 'uppercase',
    color: 'var(--hq-primary, #1a1a1a)',
    margin: '0.5rem 0 0 0',
  },
  grid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
    gap: '2rem',
    maxWidth: '1000px',
    margin: '0 auto',
  },
  card: {
    background: '#fff',
    borderRadius: '12px',
    overflow: 'hidden',
    boxShadow: '0 10px 30px rgba(0,0,0,0.08)',
    transition: 'transform 0.3s ease, box-shadow 0.3s ease',
    opacity: 0,
    transform: 'translateY(30px)',
  },
  cardVisible: {
    opacity: 1,
    transform: 'translateY(0)',
  },
  cardImage: {
    width: '100%',
    height: '200px',
    backgroundColor: '#e8e6e2',
    backgroundSize: 'cover',
    backgroundPosition: 'center top',
  },
  cardBody: {
    padding: '1.5rem',
    textAlign: 'center',
  },
  cardName: {
    fontSize: '1.1rem',
    fontWeight: 600,
    color: 'var(--hq-primary, #1a1a1a)',
    margin: '0 0 0.25rem 0',
  },
  cardRole: {
    fontFamily: "'Share Tech Mono', monospace",
    fontSize: '0.7rem',
    letterSpacing: '0.1em',
    textTransform: 'uppercase',
    color: 'var(--hq-accent, #E04A2F)',
    marginBottom: '0.75rem',
  },
  cardBio: {
    fontSize: '0.85rem',
    color: 'var(--hq-body, #666666)',
    lineHeight: 1.6,
    margin: 0,
  },
  cardCerts: {
    display: 'flex',
    justifyContent: 'center',
    gap: '0.5rem',
    marginTop: '1rem',
    flexWrap: 'wrap',
  },
  cert: {
    fontFamily: "'Share Tech Mono', monospace",
    fontSize: '0.6rem',
    letterSpacing: '0.05em',
    padding: '0.25rem 0.5rem',
    background: 'var(--hq-hover-bg, #f5f5f2)',
    borderRadius: '4px',
    color: 'var(--hq-muted, #888888)',
  },
  controls: {
    textAlign: 'center',
    marginTop: '2rem',
  },
  resetBtn: {
    padding: '0.875rem 2rem',
    background: 'var(--hq-primary, #1a1a1a)',
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
    background: 'linear-gradient(135deg, #d4edda 0%, #c3e6cb 100%)',
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
    color: '#155724',
    marginBottom: '0.5rem',
  },
  noteText: {
    fontSize: '0.85rem',
    color: '#155724',
    lineHeight: 1.6,
    margin: 0,
  },
};

const teamMembers = [
  {
    name: 'Quentin Smith',
    role: 'Chief Pilot & Founder',
    bio: 'World record holder, aerobatic champion, and aviation visionary.',
    image: '/assets/images/team/quentin.jpg',
    certs: ['ATPL(H)', 'FI', 'FE'],
  },
  {
    name: 'James Mitchell',
    role: 'Head of Training',
    bio: 'Over 8,000 flight hours and a passion for developing new pilots.',
    image: '/assets/images/team/james.jpg',
    certs: ['CPL(H)', 'FI', 'IRI'],
  },
  {
    name: 'Sarah Thompson',
    role: 'Operations Manager',
    bio: 'Keeping HQ running smoothly with 15 years of aviation experience.',
    image: '/assets/images/team/sarah.jpg',
    certs: ['PPL(H)', 'Admin'],
  },
  {
    name: 'Michael Chen',
    role: 'Chief Engineer',
    bio: 'Robinson certified with expertise across the entire fleet.',
    image: '/assets/images/team/michael.jpg',
    certs: ['EASA Part 66', 'RHC'],
  },
  {
    name: 'Emma Williams',
    role: 'Flight Instructor',
    bio: 'Dedicated to making helicopter flying accessible to everyone.',
    image: '/assets/images/team/emma.jpg',
    certs: ['CPL(H)', 'FI'],
  },
  {
    name: 'David Roberts',
    role: 'Sales Manager',
    bio: 'Helping customers find their perfect aircraft since 2015.',
    image: '/assets/images/team/david.jpg',
    certs: ['PPL(H)', 'Sales'],
  },
];

const StaggeredReveal = () => {
  const containerRef = useRef(null);
  const [visibleCards, setVisibleCards] = useState([]);
  const [hasTriggered, setHasTriggered] = useState(false);

  const triggerAnimation = () => {
    setVisibleCards([]);
    setHasTriggered(false);

    // Small delay before starting
    setTimeout(() => {
      setHasTriggered(true);
      teamMembers.forEach((_, index) => {
        setTimeout(() => {
          setVisibleCards(prev => [...prev, index]);
        }, index * 150); // 150ms stagger between each card
      });
    }, 100);
  };

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && !hasTriggered) {
            triggerAnimation();
          }
        });
      },
      { threshold: 0.2 }
    );

    if (containerRef.current) {
      observer.observe(containerRef.current);
    }

    return () => observer.disconnect();
  }, [hasTriggered]);

  const resetAnimation = () => {
    setVisibleCards([]);
    setHasTriggered(false);
    setTimeout(triggerAnimation, 300);
  };

  return (
    <div style={styles.container}>
      <style>{`
        .team-card:hover {
          transform: translateY(-8px) !important;
          box-shadow: 0 20px 50px rgba(0,0,0,0.12) !important;
        }
        .reset-btn:hover {
          background: #333 !important;
        }
      `}</style>

      <div style={styles.header}>
        <span style={styles.overline}>The Crew</span>
        <h2 style={styles.title}>Meet Our Team</h2>
      </div>

      <div ref={containerRef} style={styles.grid}>
        {teamMembers.map((member, index) => (
          <div
            key={index}
            className="team-card"
            style={{
              ...styles.card,
              ...(visibleCards.includes(index) ? styles.cardVisible : {}),
              transition: `opacity 0.6s ease ${index * 0.15}s, transform 0.6s ease ${index * 0.15}s`,
            }}
          >
            <div
              style={{
                ...styles.cardImage,
                backgroundImage: `url('${member.image}')`,
              }}
            />
            <div style={styles.cardBody}>
              <h3 style={styles.cardName}>{member.name}</h3>
              <span style={styles.cardRole}>{member.role}</span>
              <p style={styles.cardBio}>{member.bio}</p>
              <div style={styles.cardCerts}>
                {member.certs.map((cert, i) => (
                  <span key={i} style={styles.cert}>{cert}</span>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>

      <div style={styles.controls}>
        <button
          className="reset-btn"
          style={styles.resetBtn}
          onClick={resetAnimation}
        >
          Replay Animation
        </button>
      </div>

      <div style={styles.note}>
        <div style={styles.noteLabel}>anim-010 • Approved</div>
        <p style={styles.noteText}>
          Staggered reveal animation for team cards. Each card fades in and slides up with a
          150ms delay between each, creating a cascading effect as users scroll into view.
        </p>
      </div>
    </div>
  );
};

export default StaggeredReveal;

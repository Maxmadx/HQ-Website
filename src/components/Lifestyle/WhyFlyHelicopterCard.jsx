import React, { useState } from 'react';

/**
 * Why Fly A Helicopter - Card Component
 * Medium-sized card version with arrow navigation
 *
 * Usage: <WhyFlyHelicopterCard />
 *
 * Brand Identity:
 * - Typography: Space Grotesk (primary), Share Tech Mono (monospace)
 * - Colors: #1a1a1a (charcoal), #faf9f6 (warm white)
 */

const benefits = [
  { title: 'Join a Community', desc: 'A community of adventurers, business people, positive and successful people.', category: 'Lifestyle' },
  { title: 'Vertical Freedom', desc: 'The ultimate cheat code for travel. Land on your own property, yachts, lawns, beaches, or restaurants.', category: 'Practical' },
  { title: 'Weekend Maximization', desc: 'Bypass road gridlock and turn 4-hour drives into 45-minute flights, effectively extending your leisure time—when the journey beats the destination.', category: 'Practical' },
  { title: 'Total Control', desc: 'You leave exactly when you want. Depart from your door and arrive exactly where you need to be.', category: 'Practical' },
  { title: 'Unmatched Access', desc: 'Reach secluded locations inaccessible by any other vehicle, from private islands to deep wilderness.', category: 'Practical' },
  { title: 'Mastery of Machine', desc: 'It satisfies the urge for technical perfection. Mastering the collective and cyclic displays your skills as a master at operating machinery.', category: 'Experience' },
  { title: 'The "007" Factor', desc: 'It is the coolest vehicle on earth. Arriving by helicopter is cinematic, commanding, and undeniably "James Bond."', category: 'Experience' },
  { title: '3D Flight Dynamics', desc: 'Unlike airplanes that just go forward, you have total three-dimensional control—hovering, sliding sideways, and flying backward.', category: 'Experience' },
  { title: 'Business Efficiency', desc: 'The ultimate productivity multiplier, allowing for multiple meetings in a single day.', category: 'Lifestyle' },
  { title: 'Spontaneity', desc: 'The ability to decide on a trip and be in the air within the hour.', category: 'Lifestyle' },
  { title: 'Hobby Enablement', desc: 'Direct access to golf courses or shooting grounds that have helipads.', category: 'Lifestyle' },
  { title: 'Prestige & Networking', desc: 'It is a powerful tool for business or social settings.', category: 'Lifestyle' },
  { title: 'The Ancestral Dream', desc: 'You pull up to find the helicopter fueled, cleaned, and ready. You fly yourself to your destination in a private bubble above the world—a feat our ancestors who looked up at the birds could only dream of.', category: 'Lifestyle' },
  { title: 'Lasting Impact', desc: 'Create memories that last a lifetime.', category: 'Lifestyle' },
];

const WhyFlyHelicopterCard = () => {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);

  const navigate = (direction) => {
    if (isAnimating) return;
    setIsAnimating(true);

    if (direction === 'next') {
      setActiveIndex((prev) => (prev + 1) % benefits.length);
    } else {
      setActiveIndex((prev) => (prev - 1 + benefits.length) % benefits.length);
    }

    setTimeout(() => setIsAnimating(false), 350);
  };

  const currentBenefit = benefits[activeIndex];

  const getCategoryLabel = (category) => {
    switch (category) {
      case 'Practical': return 'The Practical Advantage';
      case 'Experience': return 'The Experience & Skill';
      case 'Lifestyle': return 'The Lifestyle';
      default: return category;
    }
  };

  return (
    <section style={{
      fontFamily: "'Space Grotesk', sans-serif",
      padding: '3rem 0'
    }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@400;500;600;700&family=Share+Tech+Mono&display=swap');

        @keyframes cardSlideIn {
          from { opacity: 0; transform: translateY(15px); }
          to { opacity: 1; transform: translateY(0); }
        }

        .card-content-animate {
          animation: cardSlideIn 0.35s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }

        .card-arrow {
          width: 42px;
          height: 42px;
          border: 1px solid rgba(26, 26, 26, 0.12);
          background: #ffffff;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: all 0.25s ease;
          color: #1a1a1a;
        }

        .card-arrow:hover {
          background: #1a1a1a;
          color: #ffffff;
          border-color: #1a1a1a;
        }
      `}</style>

      <div style={{
        maxWidth: '700px',
        margin: '0 auto',
        padding: '0 1.5rem'
      }}>
        {/* Card Container */}
        <div style={{
          background: '#faf9f6',
          boxShadow: '0 4px 40px rgba(0, 0, 0, 0.06)',
          overflow: 'hidden'
        }}>
          {/* Header Bar */}
          <div style={{
            background: '#1a1a1a',
            padding: '1.25rem 2rem',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
              {/* Number */}
              <div style={{
                fontFamily: "'Share Tech Mono', monospace",
                fontSize: '1.5rem',
                color: 'rgba(255,255,255,0.2)',
                lineHeight: 1
              }}>
                {String(activeIndex + 1).padStart(2, '0')}
              </div>
              {/* Divider */}
              <div style={{
                width: '1px',
                height: '24px',
                background: 'rgba(255,255,255,0.15)'
              }} />
              {/* Title */}
              <h2 style={{
                fontSize: '0.95rem',
                fontWeight: 700,
                margin: 0,
                textTransform: 'uppercase',
                letterSpacing: '0.02em',
                color: '#ffffff'
              }}>
                Why Fly A Helicopter
              </h2>
            </div>

            {/* Category */}
            <div style={{
              fontFamily: "'Share Tech Mono', monospace",
              fontSize: '0.65rem',
              color: 'rgba(255,255,255,0.4)',
              textTransform: 'uppercase',
              letterSpacing: '0.08em'
            }}>
              {getCategoryLabel(currentBenefit?.category)}
            </div>
          </div>

          {/* Content Area - Two Column */}
          <div
            key={activeIndex}
            className="card-content-animate"
            style={{
              padding: '2rem',
              display: 'grid',
              gridTemplateColumns: '1fr 1fr',
              gap: '2rem',
              alignItems: 'center'
            }}
          >
            {/* Left Column - Text */}
            <div>
              {/* Benefit Title */}
              <h3 style={{
                fontSize: 'clamp(1.25rem, 2.5vw, 1.5rem)',
                fontWeight: 700,
                margin: '0 0 1rem',
                textTransform: 'uppercase',
                letterSpacing: '-0.01em',
                lineHeight: 1.2
              }}>
                <span style={{ color: '#1a1a1a' }}>{currentBenefit?.title.split(' ')[0]}</span>{' '}
                <span style={{ color: '#5a5a5a' }}>{currentBenefit?.title.split(' ').slice(1).join(' ')}</span>
              </h3>

              {/* Description */}
              <p style={{
                fontSize: '0.95rem',
                color: '#666666',
                lineHeight: 1.7,
                margin: 0
              }}>
                {currentBenefit?.desc}
              </p>
            </div>

            {/* Right Column - Image */}
            <div style={{
              width: '100%',
              height: '180px',
              background: '#2a2a2a',
              borderRadius: '6px',
              overflow: 'hidden',
              position: 'relative'
            }}>
              <div style={{
                position: 'absolute',
                inset: 0,
                background: "url('/assets/images/lifestyle/heli-yacht.jpg') center/cover",
                transition: 'opacity 0.5s ease',
                opacity: currentBenefit?.category === 'Practical' ? 1 : 0
              }} />
              <div style={{
                position: 'absolute',
                inset: 0,
                background: "url('/assets/images/lifestyle/heli-alps.jpg') center/cover",
                transition: 'opacity 0.5s ease',
                opacity: currentBenefit?.category === 'Experience' ? 1 : 0
              }} />
              <div style={{
                position: 'absolute',
                inset: 0,
                background: "url('/assets/images/lifestyle/heli-city.jpg') center/cover",
                transition: 'opacity 0.5s ease',
                opacity: currentBenefit?.category === 'Lifestyle' ? 1 : 0
              }} />
              <div style={{
                position: 'absolute',
                bottom: '0.75rem',
                left: '0.75rem',
                fontFamily: "'Share Tech Mono', monospace",
                fontSize: '0.5rem',
                letterSpacing: '0.1em',
                color: 'rgba(255,255,255,0.5)',
                textTransform: 'uppercase'
              }}>
                {currentBenefit?.category}
              </div>
            </div>
          </div>

          {/* Footer Navigation */}
          <div style={{
            padding: '1.25rem 2rem',
            borderTop: '1px solid rgba(26, 26, 26, 0.06)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between'
          }}>
            {/* Progress Dots */}
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '1rem'
            }}>
              <div style={{ display: 'flex', gap: '4px' }}>
                {benefits.map((_, i) => (
                  <div
                    key={i}
                    onClick={() => {
                      if (!isAnimating) {
                        setIsAnimating(true);
                        setActiveIndex(i);
                        setTimeout(() => setIsAnimating(false), 350);
                      }
                    }}
                    style={{
                      width: activeIndex === i ? '16px' : '4px',
                      height: '4px',
                      background: activeIndex === i ? '#1a1a1a' : 'rgba(26, 26, 26, 0.15)',
                      borderRadius: '2px',
                      transition: 'all 0.25s ease',
                      cursor: 'pointer'
                    }}
                  />
                ))}
              </div>
              <div style={{
                fontFamily: "'Share Tech Mono', monospace",
                fontSize: '0.6rem',
                color: 'rgba(26, 26, 26, 0.35)',
                letterSpacing: '0.1em'
              }}>
                {String(activeIndex + 1).padStart(2, '0')} / {String(benefits.length).padStart(2, '0')}
              </div>
            </div>

            {/* Arrow Buttons */}
            <div style={{ display: 'flex', gap: '0.5rem' }}>
              <button
                className="card-arrow"
                onClick={() => navigate('prev')}
                aria-label="Previous benefit"
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <path d="M15 18l-6-6 6-6" />
                </svg>
              </button>
              <button
                className="card-arrow"
                onClick={() => navigate('next')}
                aria-label="Next benefit"
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <path d="M9 18l6-6-6-6" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default WhyFlyHelicopterCard;

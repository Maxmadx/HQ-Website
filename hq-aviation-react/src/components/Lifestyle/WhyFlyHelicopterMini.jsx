import React, { useState } from 'react';

/**
 * Why Fly A Helicopter - Mini Component
 * Compact, embeddable version with arrow navigation
 *
 * Usage: <WhyFlyHelicopterMini />
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

const WhyFlyHelicopterMini = () => {
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

    setTimeout(() => setIsAnimating(false), 400);
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
      padding: '4rem 0'
    }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@400;500;600;700&family=Share+Tech+Mono&display=swap');

        @keyframes miniSlideIn {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .mini-content-animate {
          animation: miniSlideIn 0.4s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }

        .mini-arrow-btn {
          width: 48px;
          height: 48px;
          border: 1px solid rgba(26, 26, 26, 0.15);
          background: transparent;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: all 0.3s ease;
          color: #1a1a1a;
        }

        .mini-arrow-btn:hover {
          background: #1a1a1a;
          color: #ffffff;
          border-color: #1a1a1a;
        }

        .mini-arrow-btn:disabled {
          opacity: 0.3;
          cursor: not-allowed;
        }

        .mini-arrow-btn:disabled:hover {
          background: transparent;
          color: #1a1a1a;
        }
      `}</style>

      <div style={{
        maxWidth: '1200px',
        margin: '0 auto',
        padding: '0 2rem'
      }}>
        {/* Two-Panel Layout */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1.2fr',
          gap: '0',
          minHeight: '480px',
          background: '#ffffff',
          boxShadow: '0 4px 60px rgba(0, 0, 0, 0.08)'
        }}>

          {/* Left Panel - Dark */}
          <div style={{
            background: '#1a1a1a',
            padding: '3rem',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
            textAlign: 'center'
          }}>
            {/* Number with Dividers */}
            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '1rem',
              marginBottom: '1.5rem'
            }}>
              <div style={{
                width: '30px',
                height: '1px',
                background: 'rgba(255,255,255,0.2)'
              }} />
              <div style={{
                fontFamily: "'Share Tech Mono', monospace",
                fontSize: '2rem',
                fontWeight: 700,
                color: 'rgba(255,255,255,0.15)',
                lineHeight: 1
              }}>
                {String(activeIndex + 1).padStart(2, '0')}
              </div>
              <div style={{
                width: '30px',
                height: '1px',
                background: 'rgba(255,255,255,0.2)'
              }} />
            </div>

            {/* Title */}
            <h2 style={{
              fontSize: 'clamp(1.5rem, 2.5vw, 2rem)',
              fontWeight: 700,
              margin: '0 0 1.5rem',
              textTransform: 'uppercase',
              letterSpacing: '-0.02em',
              lineHeight: 1.1
            }}>
              <span style={{ color: '#ffffff' }}>Why Fly</span><br />
              <span style={{ color: 'rgba(255,255,255,0.5)' }}>A Helicopter</span>
            </h2>

            {/* Category Label */}
            <div style={{
              fontFamily: "'Space Grotesk', sans-serif",
              fontSize: '0.85rem',
              fontWeight: 600,
              color: '#ffffff',
              textTransform: 'uppercase',
              letterSpacing: '0.05em',
              marginBottom: '2rem',
              transition: 'all 0.4s ease'
            }}>
              {getCategoryLabel(currentBenefit?.category)}
            </div>

            {/* Progress Dots */}
            <div style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: '0.75rem'
            }}>
              <div style={{ display: 'flex', gap: '4px', flexWrap: 'wrap', justifyContent: 'center', maxWidth: '180px' }}>
                {benefits.map((_, i) => (
                  <div
                    key={i}
                    onClick={() => {
                      if (!isAnimating) {
                        setIsAnimating(true);
                        setActiveIndex(i);
                        setTimeout(() => setIsAnimating(false), 400);
                      }
                    }}
                    style={{
                      width: activeIndex === i ? '16px' : '4px',
                      height: '3px',
                      background: activeIndex === i ? '#ffffff' : 'rgba(255,255,255,0.2)',
                      borderRadius: '2px',
                      transition: 'all 0.3s ease',
                      cursor: 'pointer'
                    }}
                  />
                ))}
              </div>
              <div style={{
                fontFamily: "'Share Tech Mono', monospace",
                fontSize: '0.55rem',
                letterSpacing: '0.15em',
                color: 'rgba(255,255,255,0.35)'
              }}>
                {String(activeIndex + 1).padStart(2, '0')} / {String(benefits.length).padStart(2, '0')}
              </div>
            </div>
          </div>

          {/* Right Panel - Light */}
          <div style={{
            background: '#faf9f6',
            padding: '3rem',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            boxShadow: '-10px 0 30px rgba(255, 255, 255, 0.1)'
          }}>
            {/* Content */}
            <div
              key={activeIndex}
              className="mini-content-animate"
              style={{
                flex: 1,
                display: 'flex',
                flexDirection: 'column'
              }}
            >
              {/* Title */}
              <h3 style={{
                fontSize: 'clamp(1.25rem, 2vw, 1.75rem)',
                fontWeight: 700,
                margin: '0 0 1rem',
                textTransform: 'uppercase',
                letterSpacing: '-0.01em',
                lineHeight: 1.2
              }}>
                <span style={{ color: '#1a1a1a' }}>{currentBenefit?.title.split(' ')[0]}</span>{' '}
                <span style={{ color: '#4a4a4a' }}>{currentBenefit?.title.split(' ')[1] || ''}</span>{' '}
                <span style={{ color: '#7a7a7a' }}>{currentBenefit?.title.split(' ').slice(2).join(' ')}</span>
              </h3>

              {/* Description */}
              <p style={{
                fontSize: '1rem',
                color: '#666666',
                lineHeight: 1.7,
                margin: 0
              }}>
                {currentBenefit?.desc}
              </p>

              {/* Image */}
              <div style={{
                width: '100%',
                height: '160px',
                background: '#2a2a2a',
                borderRadius: '6px',
                overflow: 'hidden',
                position: 'relative',
                marginTop: 'auto'
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

            {/* Navigation Arrows */}
            <div style={{
              display: 'flex',
              gap: '0.5rem',
              marginTop: '1.5rem',
              justifyContent: 'flex-end'
            }}>
              <button
                className="mini-arrow-btn"
                onClick={() => navigate('prev')}
                disabled={isAnimating}
                aria-label="Previous benefit"
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <path d="M15 18l-6-6 6-6" />
                </svg>
              </button>
              <button
                className="mini-arrow-btn"
                onClick={() => navigate('next')}
                disabled={isAnimating}
                aria-label="Next benefit"
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
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

export default WhyFlyHelicopterMini;

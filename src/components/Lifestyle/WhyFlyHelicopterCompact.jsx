import React, { useState } from 'react';

/**
 * Why Fly A Helicopter - Compact Component
 * Ultra-minimal inline version with arrow navigation
 *
 * Usage: <WhyFlyHelicopterCompact />
 *
 * Brand Identity:
 * - Typography: Space Grotesk (primary), Share Tech Mono (monospace)
 * - Colors: #1a1a1a (charcoal), #faf9f6 (warm white)
 */

const benefits = [
  { title: 'Join a Community', desc: 'A community of adventurers, business people, positive and successful people.', category: 'Lifestyle' },
  { title: 'Vertical Freedom', desc: 'Land on your own property, yachts, lawns, beaches, or restaurants.', category: 'Practical' },
  { title: 'Weekend Maximization', desc: 'Turn 4-hour drives into 45-minute flights—when the journey beats the destination.', category: 'Practical' },
  { title: 'Total Control', desc: 'Depart from your door and arrive exactly where you need to be.', category: 'Practical' },
  { title: 'Unmatched Access', desc: 'Reach secluded locations inaccessible by any other vehicle.', category: 'Practical' },
  { title: 'Mastery of Machine', desc: 'Mastering the collective and cyclic displays your skills as a master.', category: 'Experience' },
  { title: 'The "007" Factor', desc: 'Arriving by helicopter is cinematic, commanding, and undeniably "James Bond."', category: 'Experience' },
  { title: '3D Flight Dynamics', desc: 'Total three-dimensional control—hovering, sliding sideways, flying backward.', category: 'Experience' },
  { title: 'Business Efficiency', desc: 'The ultimate productivity multiplier for multiple meetings in a day.', category: 'Lifestyle' },
  { title: 'Spontaneity', desc: 'Decide on a trip and be in the air within the hour.', category: 'Lifestyle' },
  { title: 'Hobby Enablement', desc: 'Direct access to golf courses or shooting grounds with helipads.', category: 'Lifestyle' },
  { title: 'Prestige & Networking', desc: 'A powerful tool for business or social settings.', category: 'Lifestyle' },
  { title: 'The Ancestral Dream', desc: 'Fly yourself in a private bubble above the world.', category: 'Lifestyle' },
  { title: 'Lasting Impact', desc: 'Create memories that last a lifetime.', category: 'Lifestyle' },
];

const WhyFlyHelicopterCompact = () => {
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

    setTimeout(() => setIsAnimating(false), 300);
  };

  const currentBenefit = benefits[activeIndex];

  return (
    <section style={{
      fontFamily: "'Space Grotesk', sans-serif",
      padding: '2rem 0'
    }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@400;500;600;700&family=Share+Tech+Mono&display=swap');

        @keyframes compactFadeIn {
          from { opacity: 0; transform: translateX(10px); }
          to { opacity: 1; transform: translateX(0); }
        }

        .compact-content-animate {
          animation: compactFadeIn 0.3s ease-out forwards;
        }

        .compact-arrow {
          width: 36px;
          height: 36px;
          border: 1px solid rgba(255,255,255,0.2);
          background: transparent;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: all 0.2s ease;
          color: rgba(255,255,255,0.6);
          flex-shrink: 0;
        }

        .compact-arrow:hover {
          background: rgba(255,255,255,0.1);
          color: #ffffff;
          border-color: rgba(255,255,255,0.4);
        }
      `}</style>

      <div style={{
        maxWidth: '900px',
        margin: '0 auto',
        padding: '0 1.5rem'
      }}>
        <div style={{
          background: '#1a1a1a',
          boxShadow: '0 2px 20px rgba(0, 0, 0, 0.1)',
          overflow: 'hidden'
        }}>
          {/* Top Row - Content */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '1.5rem',
            padding: '1.5rem 2rem'
          }}>
            {/* Left Arrow */}
            <button
              className="compact-arrow"
              onClick={() => navigate('prev')}
              aria-label="Previous"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <path d="M15 18l-6-6 6-6" />
              </svg>
            </button>

            {/* Number */}
            <div style={{
              fontFamily: "'Share Tech Mono', monospace",
              fontSize: '1.25rem',
              color: 'rgba(255,255,255,0.2)',
              flexShrink: 0,
              width: '32px',
              textAlign: 'center'
            }}>
              {String(activeIndex + 1).padStart(2, '0')}
            </div>

            {/* Content */}
            <div
              key={activeIndex}
              className="compact-content-animate"
              style={{
                flex: 1,
                minWidth: 0
              }}
            >
              <div style={{
                display: 'flex',
                alignItems: 'baseline',
                gap: '0.75rem',
                marginBottom: '0.25rem'
              }}>
                <h3 style={{
                  fontSize: '1rem',
                  fontWeight: 700,
                  margin: 0,
                  color: '#ffffff',
                  textTransform: 'uppercase',
                  letterSpacing: '-0.01em',
                  whiteSpace: 'nowrap'
                }}>
                  {currentBenefit?.title}
                </h3>
                <span style={{
                  fontFamily: "'Share Tech Mono', monospace",
                  fontSize: '0.6rem',
                  color: 'rgba(255,255,255,0.3)',
                  textTransform: 'uppercase',
                  letterSpacing: '0.05em'
                }}>
                  {currentBenefit?.category}
                </span>
              </div>
              <p style={{
                fontSize: '0.85rem',
                color: 'rgba(255,255,255,0.5)',
                margin: 0,
                lineHeight: 1.5,
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                whiteSpace: 'nowrap'
              }}>
                {currentBenefit?.desc}
              </p>
            </div>

            {/* Progress */}
            <div style={{
              display: 'flex',
              gap: '3px',
              flexShrink: 0
            }}>
              {benefits.map((_, i) => (
                <div
                  key={i}
                  onClick={() => {
                    if (!isAnimating) {
                      setIsAnimating(true);
                      setActiveIndex(i);
                      setTimeout(() => setIsAnimating(false), 300);
                    }
                  }}
                  style={{
                    width: activeIndex === i ? '12px' : '3px',
                    height: '3px',
                    background: activeIndex === i ? '#ffffff' : 'rgba(255,255,255,0.2)',
                    borderRadius: '2px',
                    transition: 'all 0.2s ease',
                    cursor: 'pointer'
                  }}
                />
              ))}
            </div>

            {/* Right Arrow */}
            <button
              className="compact-arrow"
              onClick={() => navigate('next')}
              aria-label="Next"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <path d="M9 18l6-6-6-6" />
              </svg>
            </button>
          </div>

          {/* Dynamic Image */}
          <div style={{
            width: '100%',
            height: '160px',
            background: '#2a2a2a',
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
      </div>
    </section>
  );
};

export default WhyFlyHelicopterCompact;

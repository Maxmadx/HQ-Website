import React, { useState, useEffect, useRef } from 'react';

/**
 * Why Fly A Helicopter — sticky-scroll section.
 *
 * Left panel: big number + category label, sticky.
 * Right panel: per-step benefit content, animated on index change.
 *
 * Used on /final-why-fly-a-helicopter and /training/ppl.
 */

const benefits = [
  // The Lifestyle
  { icon: '👥', title: 'Join a Community', desc: 'Surround yourself with a circle of adventurers, entrepreneurs and high-achievers who pull each other higher', stat: '←', statLabel: 'elite network', category: 'Lifestyle' },

  // The Practical Advantage
  { icon: '🚁', title: 'Vertical Freedom', desc: 'Leave exactly when you want, bypass road gridlock, and turn 4-hour drives into 45-minute flights — landing on your own Property, Events, Restaurants, Golf Courses and Shooting Grounds.', stat: '∞', statLabel: 'landing options', category: 'Practical' },
  { icon: '🏝', title: 'Unmatched Access', desc: 'Reach secluded locations inaccessible by any other vehicle, from private islands to deep wilderness.', stat: '2,000+', statLabel: 'landing sites', category: 'Practical' },

  // The Experience & Skill
  { icon: '🔧', title: 'Mastery of Machine', desc: "Master the coolest vehicle on Earth and navigate freely in full three dimensions. Airplanes go forward. Helicopters go anywhere. Arrive from the sky onto your friend's lawn and feel like 007 stepping out.", stat: '∞', statLabel: 'skill ceiling', category: 'Experience' },

  // The Lifestyle
  { icon: '💼', title: 'Business Efficiency', desc: 'The ultimate productivity multiplier, allowing for multiple meetings in a single day.', stat: '3×', statLabel: 'productivity', category: 'Lifestyle' },
  { icon: '🦅', title: 'The Ancestral Dream', desc: 'You pull up to find the helicopter fueled, cleaned, and ready. You fly yourself to your destination in a private bubble above the world, a feat our ancestors who looked up at the birds could only dream of.', stat: '←', statLabel: 'dream realized', category: 'Lifestyle' },
  { icon: '✨', title: 'Lasting Impact', desc: 'Create memories that last a lifetime.', stat: '∞', statLabel: 'memories', category: 'Lifestyle' },
];

const WhyFlyAHelicopter = () => {
  const [activeIndex, setActiveIndex] = useState(0);
  const [prevIndex, setPrevIndex] = useState(0);
  const containerRef = useRef(null);

  useEffect(() => {
    const handleScroll = () => {
      if (!containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      const scrollableHeight = rect.height - window.innerHeight;
      const progress = Math.max(0, Math.min(1, -rect.top / scrollableHeight));
      const newIndex = Math.min(Math.floor(progress * benefits.length), benefits.length - 1);

      if (newIndex !== activeIndex) {
        setPrevIndex(activeIndex);
        setActiveIndex(newIndex);
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [activeIndex]);

  const currentBenefit = benefits[activeIndex];

  return (
    <section
      ref={containerRef}
      style={{
        minHeight: `${benefits.length * 80}vh`,
        position: 'relative',
        fontFamily: "'Space Grotesk', sans-serif"
      }}
    >
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@400;500;600;700&family=Share+Tech+Mono&display=swap');

        @keyframes slideUpIn {
          from {
            opacity: 0;
            transform: translateY(40px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .content-animate {
          animation: slideUpIn 0.5s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }
      `}</style>

      {/* Fixed Two-Panel Layout */}
      <div style={{
        position: 'sticky',
        top: 0,
        height: '100vh',
        display: 'grid',
        gridTemplateColumns: '45% 55%'
      }}>

        {/* ===== LEFT PANEL ===== */}
        <div style={{
          background: '#1a1a1a',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          padding: '4rem',
          overflow: 'hidden'
        }}>
          {/* Big Number with Dividers */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '1.5rem',
            marginBottom: '1.5rem'
          }}>
            {/* Left Divider */}
            <div style={{
              width: '40px',
              height: '1px',
              background: 'rgba(255,255,255,0.2)'
            }} />
            {/* Number */}
            <div style={{
              fontFamily: "'Share Tech Mono', monospace",
              fontSize: 'clamp(3rem, 6vw, 4rem)',
              fontWeight: 700,
              color: 'rgba(255,255,255,0.15)',
              lineHeight: 1,
              transition: 'all 0.4s cubic-bezier(0.16, 1, 0.3, 1)'
            }}>
              {String(activeIndex + 1).padStart(2, '0')}
            </div>
            {/* Right Divider */}
            <div style={{
              width: '40px',
              height: '1px',
              background: 'rgba(255,255,255,0.2)'
            }} />
          </div>

          {/* Main Title */}
          <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
            <h1 style={{
              fontFamily: "'Space Grotesk', sans-serif",
              fontSize: 'clamp(2rem, 4vw, 3rem)',
              fontWeight: 700,
              margin: 0,
              textTransform: 'uppercase',
              letterSpacing: '-0.02em',
              lineHeight: 1.1
            }}>
              <span style={{ color: '#ffffff' }}>Why Fly</span><br />
              <span style={{ color: 'rgba(255,255,255,0.5)' }}>A Helicopter</span>
            </h1>
          </div>

          {/* Category Label */}
          <div style={{
            position: 'relative',
            zIndex: 2,
            textAlign: 'center'
          }}>
            <div style={{
              fontFamily: "'Space Grotesk', sans-serif",
              fontSize: 'clamp(1.25rem, 2.5vw, 1.75rem)',
              fontWeight: 700,
              color: '#ffffff',
              textTransform: 'uppercase',
              letterSpacing: '0.05em',
              transition: 'all 0.4s cubic-bezier(0.16, 1, 0.3, 1)'
            }}>
              {currentBenefit?.category === 'Practical' && 'The Practical Advantage'}
              {currentBenefit?.category === 'Experience' && 'The Experience & Skill'}
              {currentBenefit?.category === 'Lifestyle' && 'The Lifestyle'}
            </div>
          </div>

          {/* Progress Indicator */}
          <div style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '1rem',
            marginTop: '2rem'
          }}>
            <div style={{ display: 'flex', gap: '6px' }}>
              {benefits.map((_, i) => (
                <div
                  key={i}
                  style={{
                    width: activeIndex === i ? '20px' : '6px',
                    height: '3px',
                    background: i < activeIndex
                      ? 'rgba(255,255,255,0.2)'
                      : (activeIndex === i ? '#ffffff' : 'rgba(255,255,255,0.15)'),
                    borderRadius: '2px',
                    transition: 'all 0.3s ease'
                  }}
                />
              ))}
            </div>
            <div style={{
              fontFamily: "'Share Tech Mono', monospace",
              fontSize: '0.6rem',
              letterSpacing: '0.15em',
              color: 'rgba(255,255,255,0.35)'
            }}>
              {String(activeIndex + 1).padStart(2, '0')} / {String(benefits.length).padStart(2, '0')}
            </div>
          </div>
        </div>

        {/* ===== RIGHT PANEL - FIXED CONTENT ===== */}
        <div style={{
          background: '#faf9f6',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '4rem',
          boxShadow: '-20px 0 40px rgba(255, 255, 255, 0.15)'
        }}>
          <div
            key={activeIndex}
            className="content-animate"
            style={{
              maxWidth: '500px',
              display: 'flex',
              flexDirection: 'column',
              height: '450px'
            }}
          >
            {/* Title with Gradient */}
            <h3 style={{
              fontFamily: "'Space Grotesk', sans-serif",
              fontSize: 'clamp(1.75rem, 3.5vw, 2.5rem)',
              fontWeight: 700,
              margin: '0 0 1.5rem',
              textTransform: 'uppercase',
              letterSpacing: '-0.01em',
              lineHeight: 1.15
            }}>
              <span style={{ color: '#1a1a1a' }}>{currentBenefit?.title.split(' ')[0]}</span>{' '}
              <span style={{ color: '#4a4a4a' }}>{currentBenefit?.title.split(' ')[1] || ''}</span>{' '}
              <span style={{ color: '#7a7a7a' }}>{currentBenefit?.title.split(' ').slice(2).join(' ')}</span>
            </h3>

            {/* Description */}
            <p style={{
              fontFamily: "'Space Grotesk', sans-serif",
              fontSize: '1.1rem',
              color: '#666666',
              lineHeight: 1.8,
              margin: 0
            }}>
              {currentBenefit?.desc}
            </p>

            {/* Dynamic Image */}
            <div style={{
              width: '100%',
              height: '200px',
              background: '#2a2a2a',
              borderRadius: '8px',
              overflow: 'hidden',
              position: 'relative',
              marginTop: 'auto'
            }}>
              {/* Practical images */}
              <div style={{
                position: 'absolute',
                inset: 0,
                background: "url('/assets/images/lifestyle/heli-yacht.jpg') center/cover",
                transition: 'opacity 0.5s ease',
                opacity: currentBenefit?.category === 'Practical' ? 1 : 0
              }} />
              {/* Experience images */}
              <div style={{
                position: 'absolute',
                inset: 0,
                background: "url('/assets/images/lifestyle/heli-alps.jpg') center/cover",
                transition: 'opacity 0.5s ease',
                opacity: currentBenefit?.category === 'Experience' ? 1 : 0
              }} />
              {/* Lifestyle images */}
              <div style={{
                position: 'absolute',
                inset: 0,
                background: "url('/assets/images/lifestyle/heli-city.jpg') center/cover",
                transition: 'opacity 0.5s ease',
                opacity: currentBenefit?.category === 'Lifestyle' ? 1 : 0
              }} />
              {/* Category label overlay */}
              <div style={{
                position: 'absolute',
                bottom: '1rem',
                left: '1rem',
                fontFamily: "'Share Tech Mono', monospace",
                fontSize: '0.6rem',
                letterSpacing: '0.1em',
                color: 'rgba(255,255,255,0.5)',
                textTransform: 'uppercase'
              }}>
                {currentBenefit?.category}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default WhyFlyAHelicopter;

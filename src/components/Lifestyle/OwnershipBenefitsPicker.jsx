import React, { useState, useEffect, useCallback } from 'react';

/**
 * OwnershipBenefitsPicker - 20 Premium Design Variations
 * Luxury Aviation Editorial aesthetic
 * Typography: Playfair Display + DM Sans
 * Colors: Deep charcoal, warm cream, burnished copper
 */

// ============================================
// BENEFITS DATA
// ============================================
const benefits = [
  // The Practical Advantage
  { icon: '🚁', title: 'Vertical Freedom', desc: 'The ultimate cheat code for travel. Land on your own property, yachts, lawns, beaches, or restaurants.', stat: '∞', statLabel: 'landing options', category: 'Practical' },
  { icon: '⏱', title: 'Weekend Maximization', desc: 'Bypass road gridlock and turn 4-hour drives into 45-minute flights, effectively extending your leisure time.', stat: '85%', statLabel: 'time saved', category: 'Practical' },
  { icon: '🎯', title: 'Total Control', desc: 'You leave exactly when you want. Depart from your door and arrive exactly where you need to be.', stat: '100%', statLabel: 'your schedule', category: 'Practical' },
  { icon: '🏝', title: 'Unmatched Access', desc: 'Reach secluded locations inaccessible by any other vehicle, from private islands to deep wilderness.', stat: '2,000+', statLabel: 'landing sites', category: 'Practical' },

  // The Experience & Skill
  { icon: '🎬', title: 'The "007" Factor', desc: 'It is the coolest vehicle on earth. Arriving by helicopter is cinematic, commanding, and undeniably "James Bond."', stat: '←', statLabel: 'iconic arrival', category: 'Experience' },
  { icon: '🔧', title: 'Mastery of Machine', desc: 'It satisfies the urge for technical perfection. Mastering the collective and cyclic displays your skills as a master at operating machinery.', stat: '∞', statLabel: 'skill ceiling', category: 'Experience' },
  { icon: '🧭', title: '3D Flight Dynamics', desc: 'Unlike airplanes that just go forward, you have total three-dimensional control—hovering, sliding sideways, and flying backward.', stat: '360°', statLabel: 'freedom', category: 'Experience' },

  // The Lifestyle
  { icon: '💼', title: 'Business Efficiency', desc: 'The ultimate productivity multiplier, allowing for multiple meetings in a single day.', stat: '3×', statLabel: 'productivity', category: 'Lifestyle' },
  { icon: '⚡', title: 'Spontaneity', desc: 'The ability to decide on a trip and be in the air within the hour.', stat: '<1', statLabel: 'hour to wheels up', category: 'Lifestyle' },
  { icon: '⛳', title: 'Hobby Enablement', desc: 'Direct access to golf courses or shooting grounds that have helipads.', stat: '500+', statLabel: 'helipad venues', category: 'Lifestyle' },
  { icon: '🤝', title: 'Prestige & Networking', desc: 'It is a powerful tool for business or social settings.', stat: '←', statLabel: 'elite circles', category: 'Lifestyle' },
  { icon: '✨', title: 'Lasting Impact', desc: 'Create memories that last a lifetime.', stat: '∞', statLabel: 'memories', category: 'Lifestyle' },
  { icon: '🦅', title: 'The Ancestral Dream', desc: 'You pull up to find the helicopter fueled, cleaned, and ready. You fly yourself to your destination in a private bubble above the world—a feat our ancestors who looked up at the birds could only dream of.', stat: '←', statLabel: 'dream realized', category: 'Lifestyle' },
];

// ============================================
// GLOBAL STYLES
// ============================================
const globalStyles = `
  @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,500;0,600;0,700;1,400;1,500&family=DM+Sans:ital,wght@0,400;0,500;0,600;0,700;1,400&family=JetBrains+Mono:wght@400;500&display=swap');

  :root {
    --own-charcoal: #0d0d0d;
    --own-cream: #f8f6f1;
    --own-copper: #c17f59;
    --own-copper-light: #d4a484;
    --own-stone: #e8e4dc;
    --own-muted: #8a8580;
    --own-warm-white: #fdfcfa;
  }

  .own-section {
    font-family: 'DM Sans', sans-serif;
    -webkit-font-smoothing: antialiased;
  }

  .own-section h1, .own-section h2, .own-section h3 {
    font-family: 'Playfair Display', serif;
  }

  .own-mono {
    font-family: 'JetBrains Mono', monospace;
  }

  .own-grain {
    position: relative;
  }

  .own-grain::before {
    content: '';
    position: absolute;
    inset: 0;
    background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E");
    opacity: 0.03;
    pointer-events: none;
    z-index: 1;
  }

  .own-fade-up {
    animation: ownFadeUp 0.8s ease-out forwards;
    opacity: 0;
  }

  @keyframes ownFadeUp {
    from { opacity: 0; transform: translateY(30px); }
    to { opacity: 1; transform: translateY(0); }
  }

  .own-hover-lift {
    transition: transform 0.4s cubic-bezier(0.22, 1, 0.36, 1), box-shadow 0.4s ease;
  }

  .own-hover-lift:hover {
    transform: translateY(-8px);
    box-shadow: 0 30px 60px rgba(0,0,0,0.12);
  }

  .own-line-reveal {
    background: linear-gradient(90deg, var(--own-copper) 0%, var(--own-copper) 100%);
    background-size: 0% 2px;
    background-position: left bottom;
    background-repeat: no-repeat;
    transition: background-size 0.6s cubic-bezier(0.22, 1, 0.36, 1);
    padding-bottom: 4px;
  }

  .own-line-reveal:hover {
    background-size: 100% 2px;
  }
`;

// ============================================
// VERSION 1: Cinematic Split
// ============================================
const Version1_CinematicSplit = () => (
  <section className="own-section own-grain" style={{ minHeight: '100vh', display: 'flex', background: 'var(--own-charcoal)' }}>
    <style>{globalStyles}</style>
    <div style={{ flex: '0 0 55%', position: 'relative', overflow: 'hidden' }}>
      <div style={{ position: 'absolute', inset: 0, background: `url('/assets/images/expeditions/helicopter-expeditions-quentin-smith.webp') center/cover`, filter: 'saturate(0.8)' }} />
      <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(135deg, rgba(13,13,13,0.3) 0%, transparent 50%)' }} />
      <div style={{ position: 'absolute', bottom: '4rem', left: '4rem', right: '4rem' }}>
        <div className="own-mono" style={{ fontSize: '0.7rem', letterSpacing: '0.3em', color: 'rgba(255,255,255,0.6)', marginBottom: '1rem' }}>51.4700° N, 0.4543° W</div>
        <div style={{ width: '60px', height: '1px', background: 'var(--own-copper)' }} />
      </div>
    </div>
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', padding: '5rem', color: 'var(--own-cream)', position: 'relative', zIndex: 2 }}>
      <div className="own-mono" style={{ fontSize: '0.65rem', letterSpacing: '0.35em', color: 'var(--own-copper)', marginBottom: '2rem', textTransform: 'uppercase' }}>Private Helicopter Ownership</div>
      <h1 style={{ fontSize: 'clamp(2.5rem, 4vw, 4rem)', fontWeight: 500, lineHeight: 1.1, margin: '0 0 2rem', letterSpacing: '-0.02em' }}>
        More Than<br />
        <span style={{ fontStyle: 'italic', fontWeight: 400 }}>Transport.</span>
      </h1>
      <p style={{ fontSize: '1.1rem', lineHeight: 1.8, color: 'rgba(248,246,241,0.7)', maxWidth: '420px', marginBottom: '3rem' }}>
        Ownership isn't about luxury—it's about reclaiming the most precious asset: your time.
      </p>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '2rem' }}>
        {benefits.slice(0, 4).map((b, i) => (
          <div key={i} className="own-fade-up" style={{ animationDelay: `${i * 0.1}s` }}>
            <div className="own-mono" style={{ fontSize: '2rem', fontWeight: 500, color: 'var(--own-copper)', marginBottom: '0.5rem' }}>{b.stat}</div>
            <div style={{ fontSize: '0.75rem', letterSpacing: '0.1em', color: 'rgba(248,246,241,0.5)', textTransform: 'uppercase', marginBottom: '0.75rem' }}>{b.statLabel}</div>
            <h3 style={{ fontSize: '1rem', fontWeight: 500, margin: '0 0 0.5rem' }}>{b.title}</h3>
            <p style={{ fontSize: '0.85rem', color: 'rgba(248,246,241,0.6)', lineHeight: 1.6, margin: 0 }}>{b.desc}</p>
          </div>
        ))}
      </div>
    </div>
  </section>
);

// ============================================
// VERSION 2: Editorial Timeline
// ============================================
const Version2_EditorialTimeline = () => (
  <section className="own-section own-grain" style={{ padding: '8rem 2rem', background: 'var(--own-cream)' }}>
    <style>{globalStyles}</style>
    <div style={{ maxWidth: '1000px', margin: '0 auto' }}>
      <div style={{ textAlign: 'center', marginBottom: '6rem' }}>
        <div className="own-mono" style={{ fontSize: '0.65rem', letterSpacing: '0.4em', color: 'var(--own-copper)', marginBottom: '1.5rem' }}>THE OWNERSHIP JOURNEY</div>
        <h2 style={{ fontSize: 'clamp(2.5rem, 5vw, 4rem)', fontWeight: 400, margin: 0, color: 'var(--own-charcoal)', letterSpacing: '-0.03em' }}>
          Transform Your<br /><em style={{ fontStyle: 'italic' }}>Relationship</em> with Travel
        </h2>
      </div>
      <div style={{ position: 'relative' }}>
        <div style={{ position: 'absolute', left: '50%', top: 0, bottom: 0, width: '1px', background: 'linear-gradient(to bottom, var(--own-copper), var(--own-stone))' }} />
        {benefits.slice(0, 6).map((b, i) => (
          <div key={i} className="own-fade-up" style={{
            display: 'grid',
            gridTemplateColumns: i % 2 === 0 ? '1fr 80px 1fr' : '1fr 80px 1fr',
            gap: '2rem',
            marginBottom: '4rem',
            animationDelay: `${i * 0.15}s`
          }}>
            <div style={{ textAlign: i % 2 === 0 ? 'right' : 'left', order: i % 2 === 0 ? 1 : 3, paddingTop: '1rem' }}>
              {i % 2 === 0 && (
                <>
                  <h3 style={{ fontSize: '1.5rem', fontWeight: 500, margin: '0 0 0.75rem', color: 'var(--own-charcoal)' }}>{b.title}</h3>
                  <p style={{ fontSize: '0.95rem', color: 'var(--own-muted)', lineHeight: 1.7, margin: 0 }}>{b.desc}</p>
                </>
              )}
            </div>
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'flex-start', order: 2 }}>
              <div style={{
                width: '56px', height: '56px',
                background: 'var(--own-charcoal)',
                borderRadius: '50%',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: '1.25rem',
                boxShadow: '0 4px 20px rgba(0,0,0,0.15)'
              }}>{b.icon}</div>
            </div>
            <div style={{ textAlign: i % 2 === 0 ? 'left' : 'right', order: i % 2 === 0 ? 3 : 1, paddingTop: '1rem' }}>
              {i % 2 !== 0 && (
                <>
                  <h3 style={{ fontSize: '1.5rem', fontWeight: 500, margin: '0 0 0.75rem', color: 'var(--own-charcoal)' }}>{b.title}</h3>
                  <p style={{ fontSize: '0.95rem', color: 'var(--own-muted)', lineHeight: 1.7, margin: 0 }}>{b.desc}</p>
                </>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  </section>
);

// ============================================
// VERSION 3: Stacked Cards Masonry
// ============================================
const Version3_StackedCards = () => (
  <section className="own-section" style={{ padding: '6rem 2rem', background: 'var(--own-charcoal)' }}>
    <style>{globalStyles}</style>
    <div style={{ maxWidth: '1400px', margin: '0 auto' }}>
      <div style={{ marginBottom: '4rem' }}>
        <div className="own-mono" style={{ fontSize: '0.65rem', letterSpacing: '0.4em', color: 'var(--own-copper)', marginBottom: '1rem' }}>OWNERSHIP BENEFITS</div>
        <h2 style={{ fontSize: 'clamp(2rem, 4vw, 3rem)', fontWeight: 500, color: 'var(--own-cream)', margin: 0, maxWidth: '600px' }}>
          The advantages are <em style={{ fontStyle: 'italic', color: 'var(--own-copper)' }}>undeniable</em>
        </h2>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1.5rem' }}>
        {benefits.slice(0, 6).map((b, i) => (
          <div
            key={i}
            className="own-hover-lift own-fade-up"
            style={{
              background: i === 0 ? 'var(--own-copper)' : 'var(--own-cream)',
              borderRadius: '16px',
              padding: '2.5rem',
              gridRow: i === 0 || i === 3 ? 'span 2' : 'span 1',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: i === 0 || i === 3 ? 'flex-end' : 'flex-start',
              minHeight: i === 0 || i === 3 ? '400px' : '200px',
              animationDelay: `${i * 0.1}s`,
              position: 'relative',
              overflow: 'hidden'
            }}
          >
            {(i === 0 || i === 3) && (
              <div style={{ position: 'absolute', top: '2rem', right: '2rem' }}>
                <div className="own-mono" style={{ fontSize: '4rem', fontWeight: 500, color: i === 0 ? 'rgba(255,255,255,0.2)' : 'rgba(0,0,0,0.05)' }}>{b.stat}</div>
              </div>
            )}
            <div style={{ position: 'relative', zIndex: 2 }}>
              <div style={{ fontSize: '1.5rem', marginBottom: '1rem' }}>{b.icon}</div>
              <h3 style={{
                fontSize: i === 0 || i === 3 ? '1.75rem' : '1.25rem',
                fontWeight: 500,
                margin: '0 0 0.75rem',
                color: i === 0 ? 'var(--own-cream)' : 'var(--own-charcoal)'
              }}>{b.title}</h3>
              <p style={{
                fontSize: '0.9rem',
                color: i === 0 ? 'rgba(248,246,241,0.8)' : 'var(--own-muted)',
                lineHeight: 1.6,
                margin: 0
              }}>{b.desc}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  </section>
);

// ============================================
// VERSION 4: Magazine Editorial
// ============================================
const Version4_MagazineEditorial = () => (
  <section className="own-section own-grain" style={{ padding: '6rem 2rem', background: 'var(--own-warm-white)' }}>
    <style>{globalStyles}</style>
    <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '6rem', alignItems: 'start' }}>
        <div style={{ position: 'sticky', top: '4rem' }}>
          <div style={{ fontSize: '8rem', fontFamily: "'Playfair Display', serif", color: 'var(--own-copper)', lineHeight: 0.8, marginBottom: '1rem', opacity: 0.3 }}>"</div>
          <h2 style={{ fontSize: '2.25rem', fontWeight: 400, fontStyle: 'italic', lineHeight: 1.3, margin: '0 0 1.5rem', color: 'var(--own-charcoal)' }}>
            Ownership isn't just about transport—it's about freedom.
          </h2>
          <div style={{ width: '60px', height: '2px', background: 'var(--own-copper)', marginBottom: '1.5rem' }} />
          <p style={{ fontSize: '0.95rem', color: 'var(--own-muted)', lineHeight: 1.8 }}>
            The helicopter owner experiences travel differently. Every journey becomes an adventure, every destination becomes accessible.
          </p>
        </div>
        <div>
          {benefits.slice(0, 8).map((b, i) => (
            <div
              key={i}
              className="own-fade-up"
              style={{
                padding: '2.5rem 0',
                borderBottom: i < 7 ? '1px solid var(--own-stone)' : 'none',
                display: 'grid',
                gridTemplateColumns: '60px 1fr',
                gap: '2rem',
                alignItems: 'start',
                animationDelay: `${i * 0.08}s`
              }}
            >
              <div className="own-mono" style={{
                fontSize: '0.7rem',
                letterSpacing: '0.1em',
                color: 'var(--own-copper)',
                paddingTop: '0.5rem'
              }}>{String(i + 1).padStart(2, '0')}</div>
              <div>
                <h3 className="own-line-reveal" style={{
                  fontSize: '1.5rem',
                  fontWeight: 500,
                  margin: '0 0 1rem',
                  color: 'var(--own-charcoal)',
                  display: 'inline-block',
                  cursor: 'pointer'
                }}>{b.title}</h3>
                <p style={{ fontSize: '1rem', color: 'var(--own-muted)', lineHeight: 1.8, margin: 0 }}>{b.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  </section>
);

// ============================================
// VERSION 5: Comparison Luxury Table
// ============================================
const Version5_LuxuryComparison = () => (
  <section className="own-section" style={{ padding: '6rem 2rem', background: 'var(--own-cream)' }}>
    <style>{globalStyles}</style>
    <div style={{ maxWidth: '1000px', margin: '0 auto' }}>
      <div style={{ textAlign: 'center', marginBottom: '4rem' }}>
        <div className="own-mono" style={{ fontSize: '0.65rem', letterSpacing: '0.4em', color: 'var(--own-copper)', marginBottom: '1rem' }}>THE DIFFERENCE</div>
        <h2 style={{ fontSize: 'clamp(2rem, 4vw, 3rem)', fontWeight: 400, margin: 0, color: 'var(--own-charcoal)' }}>
          Commercial <em>vs.</em> Private
        </h2>
      </div>
      <div style={{ background: 'var(--own-warm-white)', borderRadius: '24px', overflow: 'hidden', boxShadow: '0 20px 60px rgba(0,0,0,0.08)' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr' }}>
          <div style={{ padding: '1.5rem 2rem' }} />
          <div style={{ padding: '1.5rem 2rem', textAlign: 'center', background: 'var(--own-stone)' }}>
            <span className="own-mono" style={{ fontSize: '0.65rem', letterSpacing: '0.2em', color: 'var(--own-muted)' }}>COMMERCIAL</span>
          </div>
          <div style={{ padding: '1.5rem 2rem', textAlign: 'center', background: 'var(--own-charcoal)' }}>
            <span className="own-mono" style={{ fontSize: '0.65rem', letterSpacing: '0.2em', color: 'var(--own-copper)' }}>HQ OWNERSHIP</span>
          </div>
        </div>
        {[
          ['Door to destination', '3-4 hours', '30 mins'],
          ['Schedule flexibility', 'Fixed times', 'Your choice'],
          ['Airport queues', '1-2 hours', 'None'],
          ['Destinations', 'Major airports', '2,000+ sites'],
          ['Privacy', 'Public', 'Complete'],
          ['Luggage limits', 'Restricted', 'Flexible'],
        ].map(([feature, commercial, hq], i) => (
          <div key={i} className="own-fade-up" style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr', borderTop: '1px solid var(--own-stone)', animationDelay: `${i * 0.1}s` }}>
            <div style={{ padding: '1.25rem 2rem', fontSize: '0.95rem', color: 'var(--own-charcoal)', fontWeight: 500 }}>{feature}</div>
            <div style={{ padding: '1.25rem 2rem', textAlign: 'center', fontSize: '0.9rem', color: 'var(--own-muted)', background: 'rgba(232,228,220,0.3)' }}>{commercial}</div>
            <div style={{ padding: '1.25rem 2rem', textAlign: 'center', fontSize: '0.9rem', fontWeight: 600, color: 'var(--own-cream)', background: 'var(--own-charcoal)' }}>{hq}</div>
          </div>
        ))}
      </div>
    </div>
  </section>
);

// ============================================
// VERSION 6: Data Visualization
// ============================================
const Version6_DataViz = () => (
  <section className="own-section own-grain" style={{ padding: '6rem 2rem', background: 'var(--own-charcoal)' }}>
    <style>{globalStyles}</style>
    <div style={{ maxWidth: '1300px', margin: '0 auto' }}>
      <div style={{ textAlign: 'center', marginBottom: '5rem' }}>
        <div className="own-mono" style={{ fontSize: '0.65rem', letterSpacing: '0.4em', color: 'var(--own-copper)', marginBottom: '1rem' }}>BY THE NUMBERS</div>
        <h2 style={{ fontSize: 'clamp(2rem, 4vw, 3rem)', fontWeight: 400, margin: 0, color: 'var(--own-cream)' }}>
          The Ownership <em style={{ fontStyle: 'italic' }}>Advantage</em>
        </h2>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '1px', background: 'rgba(248,246,241,0.1)', borderRadius: '20px', overflow: 'hidden' }}>
        {benefits.slice(0, 4).map((b, i) => (
          <div key={i} className="own-fade-up" style={{
            background: 'var(--own-charcoal)',
            padding: '3rem 2rem',
            textAlign: 'center',
            animationDelay: `${i * 0.1}s`
          }}>
            <div style={{
              fontSize: 'clamp(3rem, 5vw, 4.5rem)',
              fontWeight: 500,
              color: 'var(--own-copper)',
              lineHeight: 1,
              marginBottom: '0.5rem',
              fontFamily: "'Playfair Display', serif"
            }}>{b.stat}</div>
            <div className="own-mono" style={{ fontSize: '0.65rem', letterSpacing: '0.2em', color: 'rgba(248,246,241,0.4)', textTransform: 'uppercase', marginBottom: '1.5rem' }}>{b.statLabel}</div>
            <h3 style={{ fontSize: '1.1rem', fontWeight: 500, margin: '0 0 0.5rem', color: 'var(--own-cream)' }}>{b.title}</h3>
            <p style={{ fontSize: '0.8rem', color: 'rgba(248,246,241,0.5)', lineHeight: 1.5, margin: 0 }}>{b.desc}</p>
          </div>
        ))}
      </div>
      <div style={{ marginTop: '1px', display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1px', background: 'rgba(248,246,241,0.1)', borderRadius: '0 0 20px 20px', overflow: 'hidden' }}>
        {benefits.slice(4, 7).map((b, i) => (
          <div key={i} className="own-fade-up" style={{
            background: 'rgba(248,246,241,0.03)',
            padding: '2rem',
            animationDelay: `${(i + 4) * 0.1}s`
          }}>
            <h4 style={{ fontSize: '1rem', fontWeight: 500, margin: '0 0 0.5rem', color: 'var(--own-cream)' }}>{b.title}</h4>
            <p style={{ fontSize: '0.85rem', color: 'rgba(248,246,241,0.5)', lineHeight: 1.5, margin: 0 }}>{b.desc}</p>
          </div>
        ))}
      </div>
    </div>
  </section>
);

// ============================================
// VERSION 7: Testimonial Spotlight
// ============================================
const Version7_TestimonialSpotlight = () => (
  <section className="own-section" style={{ padding: '6rem 2rem', background: 'var(--own-cream)' }}>
    <style>{globalStyles}</style>
    <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.3fr', gap: '4rem', alignItems: 'center' }}>
        <div>
          <div className="own-mono" style={{ fontSize: '0.65rem', letterSpacing: '0.4em', color: 'var(--own-copper)', marginBottom: '1rem' }}>OWNER STORIES</div>
          <h2 style={{ fontSize: '2.25rem', fontWeight: 500, margin: '0 0 2rem', color: 'var(--own-charcoal)' }}>What Our Owners Say</h2>
          <div className="own-hover-lift" style={{ background: 'var(--own-warm-white)', padding: '2.5rem', borderRadius: '20px', boxShadow: '0 10px 40px rgba(0,0,0,0.06)', marginBottom: '2rem' }}>
            <p style={{ fontFamily: "'Playfair Display', serif", fontSize: '1.25rem', fontStyle: 'italic', lineHeight: 1.7, color: 'var(--own-charcoal)', margin: '0 0 1.5rem' }}>
              "Owning with HQ changed everything. I reclaimed 20 hours a week that I used to spend in airports. Now I see my family every evening."
            </p>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
              <div style={{ width: '52px', height: '52px', borderRadius: '50%', background: 'linear-gradient(135deg, var(--own-copper), var(--own-copper-light))' }} />
              <div>
                <div style={{ fontWeight: 600, fontSize: '0.95rem', color: 'var(--own-charcoal)' }}>James Wilson</div>
                <div className="own-mono" style={{ fontSize: '0.7rem', color: 'var(--own-muted)', letterSpacing: '0.05em' }}>R66 Owner • 3 years</div>
              </div>
            </div>
          </div>
          <a href="#" className="own-line-reveal" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.75rem', color: 'var(--own-copper)', textDecoration: 'none', fontWeight: 500, fontSize: '0.9rem' }}>
            Read more stories <span style={{ transition: 'transform 0.3s' }}>→</span>
          </a>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
          {benefits.slice(0, 4).map((b, i) => (
            <div key={i} className="own-hover-lift own-fade-up" style={{
              background: 'var(--own-warm-white)',
              padding: '2rem',
              borderRadius: '16px',
              borderLeft: '3px solid var(--own-copper)',
              animationDelay: `${i * 0.1}s`
            }}>
              <div style={{ fontSize: '1.5rem', marginBottom: '1rem' }}>{b.icon}</div>
              <h4 style={{ fontSize: '1.1rem', fontWeight: 500, margin: '0 0 0.5rem', color: 'var(--own-charcoal)' }}>{b.title}</h4>
              <p style={{ fontSize: '0.85rem', color: 'var(--own-muted)', lineHeight: 1.5, margin: 0 }}>{b.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  </section>
);

// ============================================
// VERSION 8: Full Bleed Alternating
// ============================================
const Version8_FullBleedAlternating = () => (
  <section className="own-section">
    <style>{globalStyles}</style>
    {benefits.slice(0, 4).map((b, i) => (
      <div key={i} className="own-fade-up" style={{
        minHeight: '70vh',
        display: 'grid',
        gridTemplateColumns: i % 2 === 0 ? '1fr 1fr' : '1fr 1fr',
        background: i % 2 === 0 ? 'var(--own-cream)' : 'var(--own-charcoal)',
        animationDelay: `${i * 0.2}s`
      }}>
        <div style={{
          order: i % 2 === 0 ? 1 : 2,
          padding: '6rem',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center'
        }}>
          <div className="own-mono" style={{
            fontSize: '0.6rem',
            letterSpacing: '0.4em',
            color: 'var(--own-copper)',
            marginBottom: '1.5rem'
          }}>BENEFIT {String(i + 1).padStart(2, '0')}</div>
          <h3 style={{
            fontSize: 'clamp(2rem, 4vw, 3rem)',
            fontWeight: 500,
            margin: '0 0 1.5rem',
            color: i % 2 === 0 ? 'var(--own-charcoal)' : 'var(--own-cream)'
          }}>{b.title}</h3>
          <p style={{
            fontSize: '1.1rem',
            color: i % 2 === 0 ? 'var(--own-muted)' : 'rgba(248,246,241,0.7)',
            lineHeight: 1.8,
            margin: 0,
            maxWidth: '450px'
          }}>{b.desc}</p>
          <div style={{ marginTop: '2rem' }}>
            <span className="own-mono" style={{
              fontSize: '3rem',
              fontWeight: 500,
              color: 'var(--own-copper)'
            }}>{b.stat}</span>
            <span style={{
              fontSize: '0.75rem',
              color: i % 2 === 0 ? 'var(--own-muted)' : 'rgba(248,246,241,0.5)',
              marginLeft: '1rem',
              textTransform: 'uppercase',
              letterSpacing: '0.1em'
            }}>{b.statLabel}</span>
          </div>
        </div>
        <div style={{
          order: i % 2 === 0 ? 2 : 1,
          background: `linear-gradient(135deg, rgba(193,127,89,0.1), transparent), var(--own-stone)`,
          position: 'relative'
        }}>
          <div style={{ position: 'absolute', inset: '3rem', border: '1px solid var(--own-copper)', opacity: 0.3 }} />
        </div>
      </div>
    ))}
  </section>
);

// ============================================
// VERSION 9: Accordion Elegant
// ============================================
const Version9_AccordionElegant = () => {
  const [openIndex, setOpenIndex] = useState(0);
  return (
    <section className="own-section own-grain" style={{ padding: '6rem 2rem', background: 'var(--own-cream)' }}>
      <style>{globalStyles}</style>
      <div style={{ maxWidth: '800px', margin: '0 auto' }}>
        <div style={{ textAlign: 'center', marginBottom: '4rem' }}>
          <div className="own-mono" style={{ fontSize: '0.65rem', letterSpacing: '0.4em', color: 'var(--own-copper)', marginBottom: '1rem' }}>DISCOVER THE BENEFITS</div>
          <h2 style={{ fontSize: 'clamp(2rem, 4vw, 3rem)', fontWeight: 400, margin: 0, color: 'var(--own-charcoal)' }}>
            Ownership <em style={{ fontStyle: 'italic' }}>Advantages</em>
          </h2>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0' }}>
          {benefits.slice(0, 6).map((b, i) => (
            <div key={i} className="own-fade-up" style={{
              borderBottom: '1px solid var(--own-stone)',
              animationDelay: `${i * 0.08}s`
            }}>
              <button
                onClick={() => setOpenIndex(openIndex === i ? -1 : i)}
                style={{
                  width: '100%',
                  padding: '1.75rem 0',
                  background: 'transparent',
                  border: 'none',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  textAlign: 'left'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
                  <span style={{ fontSize: '1.5rem' }}>{b.icon}</span>
                  <span style={{
                    fontFamily: "'Playfair Display', serif",
                    fontSize: '1.25rem',
                    fontWeight: 500,
                    color: 'var(--own-charcoal)'
                  }}>{b.title}</span>
                </div>
                <span style={{
                  width: '40px', height: '40px',
                  borderRadius: '50%',
                  border: '1px solid var(--own-stone)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: '1.25rem',
                  color: 'var(--own-copper)',
                  transform: openIndex === i ? 'rotate(45deg)' : 'none',
                  transition: 'transform 0.4s cubic-bezier(0.22, 1, 0.36, 1)'
                }}>+</span>
              </button>
              <div style={{
                maxHeight: openIndex === i ? '200px' : '0',
                overflow: 'hidden',
                transition: 'max-height 0.4s cubic-bezier(0.22, 1, 0.36, 1)'
              }}>
                <p style={{
                  color: 'var(--own-muted)',
                  margin: 0,
                  fontSize: '1rem',
                  lineHeight: 1.8,
                  paddingLeft: '4rem',
                  paddingBottom: '1.5rem'
                }}>{b.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

// ============================================
// VERSION 10: Minimal List
// ============================================
const Version10_MinimalList = () => (
  <section className="own-section" style={{ padding: '6rem 2rem', background: 'var(--own-warm-white)' }}>
    <style>{globalStyles}</style>
    <div style={{ maxWidth: '750px', margin: '0 auto' }}>
      <div style={{ marginBottom: '4rem' }}>
        <div className="own-mono" style={{ fontSize: '0.65rem', letterSpacing: '0.4em', color: 'var(--own-copper)', marginBottom: '1rem' }}>WHY OWN</div>
        <h2 style={{ fontSize: 'clamp(2.5rem, 5vw, 4rem)', fontWeight: 400, margin: 0, color: 'var(--own-charcoal)', lineHeight: 1.1 }}>
          The Case for<br /><em style={{ fontStyle: 'italic' }}>Ownership</em>
        </h2>
      </div>
      <div style={{ borderTop: '2px solid var(--own-charcoal)' }}>
        {benefits.slice(0, 8).map((b, i) => (
          <div key={i} className="own-fade-up" style={{
            padding: '2rem 0',
            borderBottom: '1px solid var(--own-stone)',
            display: 'grid',
            gridTemplateColumns: '50px 1fr auto',
            gap: '2rem',
            alignItems: 'start',
            animationDelay: `${i * 0.06}s`
          }}>
            <span className="own-mono" style={{ fontSize: '0.75rem', color: 'var(--own-copper)', paddingTop: '0.25rem' }}>{String(i + 1).padStart(2, '0')}</span>
            <div>
              <h4 className="own-line-reveal" style={{
                fontSize: '1.25rem',
                fontWeight: 500,
                margin: '0 0 0.5rem',
                color: 'var(--own-charcoal)',
                display: 'inline-block',
                cursor: 'pointer'
              }}>{b.title}</h4>
              <p style={{ fontSize: '0.95rem', color: 'var(--own-muted)', lineHeight: 1.7, margin: 0 }}>{b.desc}</p>
            </div>
            <span className="own-mono" style={{ fontSize: '1.5rem', fontWeight: 500, color: 'var(--own-stone)' }}>{b.stat}</span>
          </div>
        ))}
      </div>
    </div>
  </section>
);

// ============================================
// VERSION 11: Icon Showcase
// ============================================
const Version11_IconShowcase = () => (
  <section className="own-section" style={{ padding: '6rem 2rem', background: 'var(--own-charcoal)' }}>
    <style>{globalStyles}</style>
    <div style={{ maxWidth: '1300px', margin: '0 auto' }}>
      <div style={{ textAlign: 'center', marginBottom: '5rem' }}>
        <div className="own-mono" style={{ fontSize: '0.65rem', letterSpacing: '0.4em', color: 'var(--own-copper)', marginBottom: '1rem' }}>BENEFITS</div>
        <h2 style={{ fontSize: 'clamp(2rem, 4vw, 3rem)', fontWeight: 400, margin: 0, color: 'var(--own-cream)' }}>
          Why Choose <em style={{ fontStyle: 'italic' }}>Ownership</em>
        </h2>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '3rem' }}>
        {benefits.slice(0, 8).map((b, i) => (
          <div key={i} className="own-fade-up" style={{ textAlign: 'center', animationDelay: `${i * 0.08}s` }}>
            <div style={{
              width: '100px', height: '100px',
              background: 'linear-gradient(135deg, rgba(193,127,89,0.2), rgba(193,127,89,0.05))',
              borderRadius: '50%',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              margin: '0 auto 1.5rem',
              fontSize: '2.5rem',
              border: '1px solid rgba(193,127,89,0.3)'
            }}>{b.icon}</div>
            <h4 style={{ fontSize: '1.1rem', fontWeight: 500, margin: '0 0 0.75rem', color: 'var(--own-cream)' }}>{b.title}</h4>
            <p style={{ fontSize: '0.85rem', color: 'rgba(248,246,241,0.5)', lineHeight: 1.6, margin: 0 }}>{b.desc}</p>
          </div>
        ))}
      </div>
    </div>
  </section>
);

// ============================================
// VERSION 12: Photo Grid
// ============================================
const Version12_PhotoGrid = () => (
  <section className="own-section" style={{ padding: '6rem 2rem', background: 'var(--own-cream)' }}>
    <style>{globalStyles}</style>
    <div style={{ maxWidth: '1300px', margin: '0 auto' }}>
      <div style={{ textAlign: 'center', marginBottom: '4rem' }}>
        <div className="own-mono" style={{ fontSize: '0.65rem', letterSpacing: '0.4em', color: 'var(--own-copper)', marginBottom: '1rem' }}>EXPERIENCE OWNERSHIP</div>
        <h2 style={{ fontSize: 'clamp(2rem, 4vw, 3rem)', fontWeight: 400, margin: 0, color: 'var(--own-charcoal)' }}>
          Live the <em style={{ fontStyle: 'italic' }}>Dream</em>
        </h2>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1.5rem' }}>
        {benefits.slice(0, 6).map((b, i) => (
          <div key={i} className="own-hover-lift own-fade-up" style={{
            position: 'relative',
            borderRadius: '20px',
            overflow: 'hidden',
            height: '340px',
            background: `linear-gradient(135deg, rgba(13,13,13,0.${3 + i}), transparent), var(--own-stone)`,
            animationDelay: `${i * 0.1}s`
          }}>
            <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(13,13,13,0.9) 0%, transparent 60%)' }} />
            <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, padding: '2rem' }}>
              <span className="own-mono" style={{ fontSize: '0.6rem', letterSpacing: '0.2em', color: 'var(--own-copper)' }}>{String(i + 1).padStart(2, '0')}</span>
              <h4 style={{ fontSize: '1.35rem', fontWeight: 500, margin: '0.5rem 0', color: 'var(--own-cream)' }}>{b.title}</h4>
              <p style={{ fontSize: '0.85rem', color: 'rgba(248,246,241,0.7)', lineHeight: 1.5, margin: 0 }}>{b.desc}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  </section>
);

// ============================================
// VERSION 13: Dashboard
// ============================================
const Version13_Dashboard = () => (
  <section className="own-section" style={{ padding: '6rem 2rem', background: '#050505' }}>
    <style>{globalStyles}</style>
    <div style={{ maxWidth: '1300px', margin: '0 auto' }}>
      <div style={{ display: 'grid', gridTemplateColumns: '320px 1fr', gap: '4rem', alignItems: 'start' }}>
        <div style={{ position: 'sticky', top: '4rem' }}>
          <div className="own-mono" style={{ fontSize: '0.6rem', letterSpacing: '0.4em', color: 'var(--own-copper)', marginBottom: '1rem' }}>OWNER DASHBOARD</div>
          <h2 style={{ fontSize: '2rem', fontWeight: 500, margin: '0 0 1.5rem', color: 'var(--own-cream)' }}>Your Ownership Metrics</h2>
          <p style={{ fontSize: '0.95rem', color: 'rgba(248,246,241,0.5)', lineHeight: 1.7 }}>
            Track the real impact of helicopter ownership on your life and business.
          </p>
          <div style={{ marginTop: '2rem', padding: '1.5rem', background: 'rgba(248,246,241,0.03)', borderRadius: '12px', border: '1px solid rgba(248,246,241,0.08)' }}>
            <div className="own-mono" style={{ fontSize: '0.6rem', letterSpacing: '0.15em', color: 'var(--own-copper)', marginBottom: '0.5rem' }}>TOTAL VALUE</div>
            <div style={{ fontSize: '2.5rem', fontWeight: 500, color: 'var(--own-cream)', fontFamily: "'Playfair Display', serif" }}>£2.4M</div>
            <div style={{ fontSize: '0.75rem', color: 'rgba(248,246,241,0.4)' }}>estimated time savings</div>
          </div>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1rem' }}>
          {[
            { label: 'Hours Saved Weekly', value: '20+', change: '+85% vs commercial' },
            { label: 'Accessible Sites', value: '2,147', change: 'Across UK & Europe' },
            { label: 'Family Dinners Home', value: '100%', change: 'Every evening' },
            { label: 'Airport Time', value: '0 hrs', change: 'No queues ever' },
            { label: 'Schedule Freedom', value: '∞', change: 'Unlimited flexibility' },
            { label: 'Privacy Level', value: 'Total', change: 'Complete discretion' },
          ].map((metric, i) => (
            <div key={i} className="own-fade-up" style={{
              background: 'rgba(248,246,241,0.02)',
              border: '1px solid rgba(248,246,241,0.06)',
              borderRadius: '16px',
              padding: '2rem',
              transition: 'border-color 0.3s, background 0.3s',
              animationDelay: `${i * 0.08}s`
            }}
            onMouseEnter={e => { e.currentTarget.style.borderColor = 'var(--own-copper)'; e.currentTarget.style.background = 'rgba(193,127,89,0.05)'; }}
            onMouseLeave={e => { e.currentTarget.style.borderColor = 'rgba(248,246,241,0.06)'; e.currentTarget.style.background = 'rgba(248,246,241,0.02)'; }}
            >
              <div className="own-mono" style={{ fontSize: '0.6rem', letterSpacing: '0.15em', color: 'rgba(248,246,241,0.4)', textTransform: 'uppercase', marginBottom: '1rem' }}>{metric.label}</div>
              <div style={{ fontSize: '2.5rem', fontWeight: 500, color: 'var(--own-cream)', marginBottom: '0.25rem', fontFamily: "'Playfair Display', serif" }}>{metric.value}</div>
              <div style={{ fontSize: '0.7rem', color: 'var(--own-copper)' }}>{metric.change}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  </section>
);

// ============================================
// VERSION 14: Quote Grid
// ============================================
const Version14_QuoteGrid = () => (
  <section className="own-section own-grain" style={{ padding: '6rem 2rem', background: 'var(--own-cream)' }}>
    <style>{globalStyles}</style>
    <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
      <div style={{ textAlign: 'center', marginBottom: '4rem' }}>
        <div className="own-mono" style={{ fontSize: '0.65rem', letterSpacing: '0.4em', color: 'var(--own-copper)', marginBottom: '1rem' }}>IN THEIR WORDS</div>
        <h2 style={{ fontSize: 'clamp(2rem, 4vw, 3rem)', fontWeight: 400, margin: 0, color: 'var(--own-charcoal)' }}>
          Owners On <em style={{ fontStyle: 'italic' }}>Benefits</em>
        </h2>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '2rem' }}>
        {[
          { quote: 'Time Freedom means I make every school play and sports day.', author: 'R44 Owner', years: '4 years' },
          { quote: 'Landing at my estate instead of driving 2 hours from the airport? Priceless.', author: 'R66 Owner', years: '2 years' },
          { quote: 'Four client meetings in one day, three cities. Try that with British Airways.', author: 'Business Owner', years: '5 years' },
          { quote: 'The joy never fades. Every flight still feels like the first.', author: 'Private Pilot', years: '7 years' },
        ].map((item, i) => (
          <div key={i} className="own-hover-lift own-fade-up" style={{
            background: 'var(--own-warm-white)',
            padding: '2.5rem',
            borderRadius: '20px',
            boxShadow: '0 4px 20px rgba(0,0,0,0.04)',
            position: 'relative',
            animationDelay: `${i * 0.12}s`
          }}>
            <span style={{
              position: 'absolute',
              top: '1.5rem',
              right: '2rem',
              fontSize: '6rem',
              fontFamily: "'Playfair Display', serif",
              color: 'var(--own-copper)',
              opacity: 0.1,
              lineHeight: 1
            }}>"</span>
            <p style={{
              fontFamily: "'Playfair Display', serif",
              fontSize: '1.35rem',
              fontStyle: 'italic',
              lineHeight: 1.6,
              color: 'var(--own-charcoal)',
              margin: '0 0 2rem',
              position: 'relative'
            }}>{item.quote}</p>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
              <div style={{ width: '48px', height: '48px', borderRadius: '50%', background: 'linear-gradient(135deg, var(--own-copper), var(--own-copper-light))' }} />
              <div>
                <div style={{ fontWeight: 500, fontSize: '0.95rem', color: 'var(--own-charcoal)' }}>{item.author}</div>
                <div className="own-mono" style={{ fontSize: '0.65rem', color: 'var(--own-muted)', letterSpacing: '0.05em' }}>{item.years}</div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  </section>
);

// ============================================
// VERSION 15: Feature Hero
// ============================================
const Version15_FeatureHero = () => (
  <section className="own-section" style={{ padding: '6rem 2rem', background: 'var(--own-warm-white)' }}>
    <style>{globalStyles}</style>
    <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '1.5rem' }}>
        <div style={{
          gridColumn: 'span 2',
          background: 'var(--own-charcoal)',
          borderRadius: '24px',
          padding: '4rem',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '3rem'
        }}>
          <div>
            <div className="own-mono" style={{ fontSize: '0.6rem', letterSpacing: '0.4em', color: 'var(--own-copper)', marginBottom: '1rem' }}>OWNERSHIP BENEFITS</div>
            <h2 style={{ fontSize: '2.5rem', fontWeight: 500, margin: '0 0 1rem', color: 'var(--own-cream)' }}>Transform How You Travel</h2>
            <p style={{ fontSize: '1rem', color: 'rgba(248,246,241,0.6)', lineHeight: 1.7, margin: 0, maxWidth: '500px' }}>
              Helicopter ownership unlocks a new dimension of freedom, efficiency, and joy.
            </p>
          </div>
          <a href="#" style={{
            flexShrink: 0,
            padding: '1.25rem 2.5rem',
            background: 'var(--own-copper)',
            color: 'var(--own-cream)',
            textDecoration: 'none',
            borderRadius: '12px',
            fontWeight: 500,
            fontSize: '0.9rem',
            transition: 'transform 0.3s, box-shadow 0.3s'
          }}
          onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = '0 10px 30px rgba(193,127,89,0.3)'; }}
          onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = 'none'; }}
          >Learn More</a>
        </div>
        {benefits.slice(0, 4).map((b, i) => (
          <div key={i} className="own-hover-lift own-fade-up" style={{
            background: 'var(--own-cream)',
            borderRadius: '20px',
            padding: '2.5rem',
            border: '1px solid var(--own-stone)',
            animationDelay: `${i * 0.1}s`
          }}>
            <div style={{
              width: '56px', height: '56px',
              background: 'var(--own-warm-white)',
              borderRadius: '14px',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              marginBottom: '1.5rem',
              fontSize: '1.5rem',
              boxShadow: '0 4px 15px rgba(0,0,0,0.05)'
            }}>{b.icon}</div>
            <h4 style={{ fontSize: '1.25rem', fontWeight: 500, margin: '0 0 0.75rem', color: 'var(--own-charcoal)' }}>{b.title}</h4>
            <p style={{ fontSize: '0.9rem', color: 'var(--own-muted)', lineHeight: 1.6, margin: 0 }}>{b.desc}</p>
          </div>
        ))}
      </div>
    </div>
  </section>
);

// ============================================
// VERSION 16: Checklist
// ============================================
const Version16_Checklist = () => (
  <section className="own-section own-grain" style={{ padding: '6rem 2rem', background: 'var(--own-cream)' }}>
    <style>{globalStyles}</style>
    <div style={{ maxWidth: '1000px', margin: '0 auto' }}>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '5rem', alignItems: 'center' }}>
        <div>
          <div className="own-mono" style={{ fontSize: '0.65rem', letterSpacing: '0.4em', color: 'var(--own-copper)', marginBottom: '1rem' }}>COMPLETE BENEFITS</div>
          <h2 style={{ fontSize: '2.5rem', fontWeight: 400, margin: '0 0 3rem', color: 'var(--own-charcoal)', lineHeight: 1.2 }}>
            Everything Ownership <em style={{ fontStyle: 'italic' }}>Includes</em>
          </h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            {benefits.map((b, i) => (
              <div key={i} className="own-fade-up" style={{ display: 'flex', alignItems: 'center', gap: '1rem', animationDelay: `${i * 0.05}s` }}>
                <div style={{
                  width: '28px', height: '28px',
                  background: 'var(--own-copper)',
                  borderRadius: '50%',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  flexShrink: 0,
                  fontSize: '0.75rem',
                  color: 'var(--own-cream)'
                }}>✓</div>
                <span style={{ fontSize: '1rem', color: 'var(--own-charcoal)', fontWeight: 500 }}>{b.title}</span>
              </div>
            ))}
          </div>
        </div>
        <div className="own-hover-lift" style={{
          background: 'var(--own-warm-white)',
          padding: '3rem',
          borderRadius: '24px',
          boxShadow: '0 20px 60px rgba(0,0,0,0.08)'
        }}>
          <h3 style={{ fontSize: '1.5rem', fontWeight: 500, margin: '0 0 1.25rem', color: 'var(--own-charcoal)' }}>Ready to Experience Ownership?</h3>
          <p style={{ fontSize: '0.95rem', color: 'var(--own-muted)', lineHeight: 1.7, margin: '0 0 2rem' }}>
            Speak with our team about finding the perfect aircraft for your lifestyle.
          </p>
          <a href="#" style={{
            display: 'block',
            textAlign: 'center',
            padding: '1.25rem',
            background: 'var(--own-charcoal)',
            color: 'var(--own-cream)',
            textDecoration: 'none',
            borderRadius: '12px',
            fontWeight: 500,
            transition: 'transform 0.3s, box-shadow 0.3s'
          }}
          onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = '0 10px 30px rgba(0,0,0,0.2)'; }}
          onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = 'none'; }}
          >Schedule Consultation</a>
        </div>
      </div>
    </div>
  </section>
);

// ============================================
// VERSION 17: Staggered Ribbons
// ============================================
const Version17_StaggeredRibbons = () => (
  <section className="own-section" style={{ padding: '6rem 0', background: 'var(--own-warm-white)', overflow: 'hidden' }}>
    <style>{globalStyles}</style>
    <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 2rem' }}>
      <div style={{ textAlign: 'center', marginBottom: '4rem' }}>
        <div className="own-mono" style={{ fontSize: '0.65rem', letterSpacing: '0.4em', color: 'var(--own-copper)', marginBottom: '1rem' }}>KEY ADVANTAGES</div>
        <h2 style={{ fontSize: 'clamp(2rem, 4vw, 3rem)', fontWeight: 400, margin: 0, color: 'var(--own-charcoal)' }}>
          The Ownership <em style={{ fontStyle: 'italic' }}>Edge</em>
        </h2>
      </div>
    </div>
    {benefits.slice(0, 6).map((b, i) => (
      <div key={i} className="own-fade-up" style={{
        background: i % 2 === 0 ? 'var(--own-cream)' : 'var(--own-warm-white)',
        padding: '2rem',
        marginLeft: i % 2 === 0 ? '-30px' : '30px',
        marginRight: i % 2 === 0 ? '30px' : '-30px',
        marginBottom: '4px',
        borderRadius: i % 2 === 0 ? '0 100px 100px 0' : '100px 0 0 100px',
        animationDelay: `${i * 0.1}s`
      }}>
        <div style={{ maxWidth: '900px', margin: '0 auto', display: 'flex', alignItems: 'center', gap: '2.5rem', padding: '0 2rem' }}>
          <span style={{
            fontFamily: "'Playfair Display', serif",
            fontSize: '3rem',
            fontWeight: 400,
            color: 'var(--own-copper)',
            opacity: 0.3,
            width: '80px',
            textAlign: 'center'
          }}>{String(i + 1).padStart(2, '0')}</span>
          <div style={{ flex: 1 }}>
            <h4 style={{ fontSize: '1.35rem', fontWeight: 500, margin: '0 0 0.5rem', color: 'var(--own-charcoal)' }}>{b.title}</h4>
            <p style={{ fontSize: '0.95rem', color: 'var(--own-muted)', margin: 0, lineHeight: 1.6 }}>{b.desc}</p>
          </div>
          <span className="own-mono" style={{ fontSize: '1.5rem', fontWeight: 500, color: 'var(--own-copper)' }}>{b.stat}</span>
        </div>
      </div>
    ))}
  </section>
);

// ============================================
// VERSION 18: Bento Grid
// ============================================
const Version18_BentoGrid = () => (
  <section className="own-section" style={{ padding: '6rem 2rem', background: 'var(--own-cream)' }}>
    <style>{globalStyles}</style>
    <div style={{ maxWidth: '1300px', margin: '0 auto' }}>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gridTemplateRows: 'repeat(3, 200px)', gap: '1.25rem' }}>
        {/* Large title card */}
        <div style={{
          gridColumn: 'span 2',
          background: 'var(--own-charcoal)',
          borderRadius: '24px',
          padding: '2.5rem',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'flex-end'
        }}>
          <div className="own-mono" style={{ fontSize: '0.6rem', letterSpacing: '0.4em', color: 'var(--own-copper)', marginBottom: '0.75rem' }}>OWNERSHIP BENEFITS</div>
          <h2 style={{ fontSize: '2rem', fontWeight: 500, margin: 0, color: 'var(--own-cream)' }}>Why Own With HQ</h2>
        </div>
        {/* Benefit cards */}
        {benefits.slice(0, 6).map((b, i) => (
          <div key={i} className="own-hover-lift own-fade-up" style={{
            gridColumn: i === 1 ? 'span 2' : 'span 1',
            background: 'var(--own-warm-white)',
            borderRadius: '20px',
            padding: '2rem',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            border: '1px solid var(--own-stone)',
            animationDelay: `${i * 0.08}s`
          }}>
            <span style={{ fontSize: '1.5rem' }}>{b.icon}</span>
            <div>
              <h4 style={{ fontSize: '1.1rem', fontWeight: 500, margin: '0 0 0.5rem', color: 'var(--own-charcoal)' }}>{b.title}</h4>
              <p style={{ fontSize: '0.8rem', color: 'var(--own-muted)', lineHeight: 1.5, margin: 0 }}>{b.desc.substring(0, 70)}...</p>
            </div>
          </div>
        ))}
        {/* CTA card */}
        <div style={{
          gridColumn: 'span 2',
          background: 'linear-gradient(135deg, var(--own-copper), var(--own-copper-light))',
          borderRadius: '24px',
          padding: '2.5rem',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between'
        }}>
          <div>
            <h3 style={{ fontSize: '1.5rem', fontWeight: 500, margin: '0 0 0.5rem', color: 'var(--own-cream)' }}>Ready to Own?</h3>
            <p style={{ fontSize: '0.9rem', color: 'rgba(248,246,241,0.8)', margin: 0 }}>Start your journey today</p>
          </div>
          <a href="#" style={{
            padding: '1rem 2rem',
            background: 'var(--own-cream)',
            color: 'var(--own-copper)',
            textDecoration: 'none',
            borderRadius: '10px',
            fontWeight: 600,
            transition: 'transform 0.3s'
          }}
          onMouseEnter={e => e.currentTarget.style.transform = 'scale(1.05)'}
          onMouseLeave={e => e.currentTarget.style.transform = 'scale(1)'}
          >Get Started</a>
        </div>
      </div>
    </div>
  </section>
);

// ============================================
// VERSION 19: Sticky Split Scroll
// ============================================
const Version19_StickySplitScroll = () => (
  <section className="own-section" style={{ padding: '6rem 2rem', background: 'var(--own-warm-white)' }}>
    <style>{globalStyles}</style>
    <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '5rem' }}>
        <div style={{ position: 'sticky', top: '4rem', height: 'fit-content' }}>
          <div style={{
            height: '500px',
            background: `linear-gradient(135deg, rgba(193,127,89,0.1), transparent), var(--own-stone)`,
            borderRadius: '24px',
            overflow: 'hidden',
            position: 'relative'
          }}>
            <div style={{ position: 'absolute', inset: '2rem', border: '1px solid var(--own-copper)', borderRadius: '16px', opacity: 0.3 }} />
            <div style={{ position: 'absolute', bottom: '2rem', left: '2rem', right: '2rem' }}>
              <div className="own-mono" style={{ fontSize: '0.6rem', letterSpacing: '0.3em', color: 'var(--own-copper)' }}>HQ AVIATION</div>
            </div>
          </div>
          <div style={{ marginTop: '2rem' }}>
            <a href="#" style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '1rem',
              padding: '1.25rem 2.5rem',
              background: 'var(--own-charcoal)',
              color: 'var(--own-cream)',
              textDecoration: 'none',
              borderRadius: '12px',
              fontWeight: 500,
              transition: 'transform 0.3s, box-shadow 0.3s'
            }}
            onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = '0 10px 30px rgba(0,0,0,0.2)'; }}
            onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = 'none'; }}
            >
              Explore Ownership <span>→</span>
            </a>
          </div>
        </div>
        <div>
          <div className="own-mono" style={{ fontSize: '0.65rem', letterSpacing: '0.4em', color: 'var(--own-copper)', marginBottom: '1rem' }}>COMPLETE BENEFITS</div>
          <h2 style={{ fontSize: '2.25rem', fontWeight: 400, margin: '0 0 3rem', color: 'var(--own-charcoal)' }}>
            Every Advantage of <em style={{ fontStyle: 'italic' }}>Ownership</em>
          </h2>
          {benefits.map((b, i) => (
            <div key={i} className="own-fade-up" style={{
              padding: '2rem 0',
              borderBottom: '1px solid var(--own-stone)',
              animationDelay: `${i * 0.05}s`
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem', marginBottom: '0.75rem' }}>
                <div style={{
                  width: '44px', height: '44px',
                  background: 'var(--own-cream)',
                  borderRadius: '12px',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: '1.25rem'
                }}>{b.icon}</div>
                <h4 style={{ fontSize: '1.15rem', fontWeight: 500, margin: 0, color: 'var(--own-charcoal)' }}>{b.title}</h4>
              </div>
              <p style={{ fontSize: '0.95rem', color: 'var(--own-muted)', margin: 0, lineHeight: 1.7, paddingLeft: '68px' }}>{b.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  </section>
);

// ============================================
// VERSION 20: Hero Impact
// ============================================
const Version20_HeroImpact = () => (
  <section className="own-section own-grain" style={{
    position: 'relative',
    minHeight: '100vh',
    display: 'flex',
    alignItems: 'center',
    background: 'var(--own-charcoal)'
  }}>
    <style>{globalStyles}</style>
    <div style={{
      position: 'absolute',
      inset: 0,
      background: `url('/assets/images/expeditions/helicopter-expeditions-quentin-smith.webp') center/cover`,
      opacity: 0.15,
      filter: 'saturate(0)'
    }} />
    <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(135deg, var(--own-charcoal) 0%, transparent 60%)' }} />
    <div style={{
      position: 'relative',
      zIndex: 2,
      maxWidth: '1300px',
      margin: '0 auto',
      padding: '4rem 2rem',
      display: 'grid',
      gridTemplateColumns: '1fr 1fr',
      gap: '5rem',
      alignItems: 'center'
    }}>
      <div>
        <div className="own-mono" style={{ fontSize: '0.6rem', letterSpacing: '0.4em', color: 'var(--own-copper)', marginBottom: '2rem' }}>HELICOPTER OWNERSHIP</div>
        <h1 style={{
          fontSize: 'clamp(3rem, 6vw, 5rem)',
          fontWeight: 400,
          lineHeight: 1.05,
          color: 'var(--own-cream)',
          margin: '0 0 2rem',
          letterSpacing: '-0.03em'
        }}>
          Freedom<br />
          <em style={{ fontStyle: 'italic', fontWeight: 500 }}>Redefined.</em>
        </h1>
        <p style={{
          fontSize: '1.2rem',
          color: 'rgba(248,246,241,0.7)',
          lineHeight: 1.8,
          margin: '0 0 3rem',
          maxWidth: '480px'
        }}>
          Ownership isn't just about getting from A to B. It's about reclaiming your time, expanding your world, and living on your terms.
        </p>
        <div style={{ display: 'flex', gap: '1rem' }}>
          <a href="#" style={{
            padding: '1.25rem 2.5rem',
            background: 'var(--own-copper)',
            color: 'var(--own-cream)',
            textDecoration: 'none',
            borderRadius: '12px',
            fontWeight: 500,
            transition: 'transform 0.3s, box-shadow 0.3s'
          }}
          onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = '0 15px 40px rgba(193,127,89,0.3)'; }}
          onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = 'none'; }}
          >Explore Aircraft</a>
          <a href="#" style={{
            padding: '1.25rem 2.5rem',
            background: 'transparent',
            color: 'var(--own-cream)',
            textDecoration: 'none',
            borderRadius: '12px',
            fontWeight: 500,
            border: '1px solid rgba(248,246,241,0.2)',
            transition: 'border-color 0.3s, background 0.3s'
          }}
          onMouseEnter={e => { e.currentTarget.style.borderColor = 'var(--own-copper)'; e.currentTarget.style.background = 'rgba(193,127,89,0.1)'; }}
          onMouseLeave={e => { e.currentTarget.style.borderColor = 'rgba(248,246,241,0.2)'; e.currentTarget.style.background = 'transparent'; }}
          >Contact Us</a>
        </div>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.25rem' }}>
        {benefits.slice(0, 4).map((b, i) => (
          <div key={i} className="own-hover-lift own-fade-up" style={{
            background: 'rgba(248,246,241,0.03)',
            backdropFilter: 'blur(20px)',
            padding: '2rem',
            borderRadius: '20px',
            border: '1px solid rgba(248,246,241,0.08)',
            animationDelay: `${i * 0.1}s`
          }}>
            <span style={{ fontSize: '1.75rem', marginBottom: '1.25rem', display: 'block' }}>{b.icon}</span>
            <h4 style={{ fontSize: '1.1rem', fontWeight: 500, margin: '0 0 0.75rem', color: 'var(--own-cream)' }}>{b.title}</h4>
            <p style={{ fontSize: '0.85rem', color: 'rgba(248,246,241,0.6)', lineHeight: 1.6, margin: 0 }}>{b.desc}</p>
          </div>
        ))}
      </div>
    </div>
    <div style={{ position: 'absolute', bottom: '3rem', left: '50%', transform: 'translateX(-50%)' }}>
      <div className="own-mono" style={{ fontSize: '0.6rem', letterSpacing: '0.3em', color: 'rgba(248,246,241,0.3)', textAlign: 'center' }}>
        SCROLL TO EXPLORE
        <div style={{ marginTop: '0.75rem', width: '1px', height: '40px', background: 'linear-gradient(to bottom, var(--own-copper), transparent)', margin: '0.75rem auto 0' }} />
      </div>
    </div>
  </section>
);

// ============================================
// VERSION 21: Horizontal Scroll Gallery
// ============================================
const Version21_HorizontalGallery = () => (
  <section className="own-section" style={{ padding: '6rem 0', background: 'var(--own-charcoal)', overflow: 'hidden' }}>
    <style>{globalStyles}</style>
    <div style={{ padding: '0 2rem', marginBottom: '4rem', maxWidth: '1200px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
        <div>
          <div className="own-mono" style={{ fontSize: '0.65rem', letterSpacing: '0.4em', color: 'var(--own-copper)', marginBottom: '1rem' }}>THE COLLECTION</div>
          <h2 style={{ fontSize: 'clamp(2rem, 4vw, 3.5rem)', fontWeight: 400, margin: 0, color: 'var(--own-cream)', lineHeight: 1.1 }}>
            Benefits of<br /><em style={{ fontStyle: 'italic' }}>Ownership</em>
          </h2>
        </div>
        <div style={{ display: 'flex', gap: '0.75rem' }}>
          <button style={{ width: '52px', height: '52px', border: '1px solid rgba(248,246,241,0.2)', background: 'transparent', borderRadius: '50%', color: 'var(--own-cream)', cursor: 'pointer', fontSize: '1.25rem', transition: 'all 0.3s' }}>←</button>
          <button style={{ width: '52px', height: '52px', border: '1px solid var(--own-copper)', background: 'var(--own-copper)', borderRadius: '50%', color: 'var(--own-cream)', cursor: 'pointer', fontSize: '1.25rem' }}>→</button>
        </div>
      </div>
    </div>
    <div style={{ display: 'flex', gap: '1.5rem', paddingLeft: '2rem', overflowX: 'auto', scrollbarWidth: 'none', paddingBottom: '2rem' }}>
      {benefits.map((b, i) => (
        <div key={i} className="own-hover-lift own-fade-up" style={{
          flex: '0 0 340px',
          height: '440px',
          background: 'linear-gradient(180deg, rgba(193,127,89,0.1) 0%, rgba(248,246,241,0.03) 100%)',
          borderRadius: '24px',
          padding: '2.5rem',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          border: '1px solid rgba(248,246,241,0.08)',
          animationDelay: `${i * 0.1}s`
        }}>
          <div>
            <div style={{ fontSize: '3rem', marginBottom: '1.5rem' }}>{b.icon}</div>
            <h3 style={{ fontSize: '1.5rem', fontWeight: 500, margin: '0 0 1rem', color: 'var(--own-cream)' }}>{b.title}</h3>
            <p style={{ fontSize: '0.95rem', color: 'rgba(248,246,241,0.6)', lineHeight: 1.7, margin: 0 }}>{b.desc}</p>
          </div>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.5rem' }}>
            <span className="own-mono" style={{ fontSize: '2.5rem', fontWeight: 500, color: 'var(--own-copper)' }}>{b.stat}</span>
            <span style={{ fontSize: '0.75rem', color: 'rgba(248,246,241,0.4)', textTransform: 'uppercase', letterSpacing: '0.1em' }}>{b.statLabel}</span>
          </div>
        </div>
      ))}
    </div>
  </section>
);

// ============================================
// VERSION 22: Newspaper Editorial
// ============================================
const Version22_NewspaperEditorial = () => (
  <section className="own-section" style={{ padding: '6rem 2rem', background: '#fffef9' }}>
    <style>{globalStyles}</style>
    <div style={{ maxWidth: '1100px', margin: '0 auto' }}>
      <div style={{ borderBottom: '4px double var(--own-charcoal)', paddingBottom: '1.5rem', marginBottom: '3rem' }}>
        <div className="own-mono" style={{ fontSize: '0.6rem', letterSpacing: '0.5em', textAlign: 'center', color: 'var(--own-muted)', marginBottom: '0.5rem' }}>THE AVIATION CHRONICLE • OWNERSHIP EDITION</div>
        <h1 style={{ fontSize: 'clamp(2.5rem, 6vw, 5rem)', fontWeight: 400, textAlign: 'center', margin: 0, color: 'var(--own-charcoal)', fontFamily: "'Playfair Display', serif", letterSpacing: '-0.02em' }}>
          The Case for Private<br />Helicopter Ownership
        </h1>
        <div className="own-mono" style={{ fontSize: '0.65rem', letterSpacing: '0.2em', textAlign: 'center', color: 'var(--own-muted)', marginTop: '1rem' }}>SPECIAL REPORT • 12 COMPELLING REASONS</div>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr', gap: '2rem' }}>
        <div style={{ borderRight: '1px solid var(--own-stone)', paddingRight: '2rem' }}>
          <h2 style={{ fontSize: '1.75rem', fontWeight: 500, margin: '0 0 1rem', color: 'var(--own-charcoal)', lineHeight: 1.3 }}>{benefits[0].title}: {benefits[0].desc}</h2>
          <p style={{ fontSize: '1rem', color: 'var(--own-muted)', lineHeight: 1.9, margin: '0 0 2rem', columnCount: 2, columnGap: '1.5rem' }}>
            The modern helicopter owner experiences a fundamentally different relationship with travel. Where others see obstacles, owners see opportunities. Where others wait, owners arrive. The transformation is not merely practical—it's philosophical.
          </p>
          <div style={{ display: 'flex', gap: '1rem', paddingTop: '1.5rem', borderTop: '1px solid var(--own-stone)' }}>
            {benefits.slice(1, 3).map((b, i) => (
              <div key={i} style={{ flex: 1 }}>
                <span style={{ fontSize: '1.25rem' }}>{b.icon}</span>
                <h4 style={{ fontSize: '1rem', fontWeight: 600, margin: '0.5rem 0', color: 'var(--own-charcoal)' }}>{b.title}</h4>
                <p style={{ fontSize: '0.85rem', color: 'var(--own-muted)', lineHeight: 1.6, margin: 0 }}>{b.desc}</p>
              </div>
            ))}
          </div>
        </div>
        <div style={{ borderRight: '1px solid var(--own-stone)', paddingRight: '1.5rem' }}>
          {benefits.slice(3, 7).map((b, i) => (
            <div key={i} style={{ marginBottom: '1.5rem', paddingBottom: '1.5rem', borderBottom: i < 3 ? '1px solid var(--own-stone)' : 'none' }}>
              <h4 style={{ fontSize: '1rem', fontWeight: 600, margin: '0 0 0.5rem', color: 'var(--own-charcoal)' }}>{b.icon} {b.title}</h4>
              <p style={{ fontSize: '0.8rem', color: 'var(--own-muted)', lineHeight: 1.6, margin: 0 }}>{b.desc}</p>
            </div>
          ))}
        </div>
        <div>
          <div style={{ background: 'var(--own-charcoal)', color: 'var(--own-cream)', padding: '1.5rem', borderRadius: '0', marginBottom: '1.5rem' }}>
            <h3 style={{ fontSize: '1.1rem', fontWeight: 500, margin: '0 0 0.75rem' }}>By The Numbers</h3>
            {benefits.slice(0, 3).map((b, i) => (
              <div key={i} style={{ display: 'flex', justifyContent: 'space-between', padding: '0.5rem 0', borderBottom: i < 2 ? '1px solid rgba(248,246,241,0.1)' : 'none' }}>
                <span style={{ fontSize: '0.8rem', opacity: 0.7 }}>{b.title}</span>
                <span className="own-mono" style={{ fontSize: '0.9rem', color: 'var(--own-copper)' }}>{b.stat}</span>
              </div>
            ))}
          </div>
          {benefits.slice(7, 9).map((b, i) => (
            <div key={i} style={{ marginBottom: '1.25rem' }}>
              <h4 style={{ fontSize: '0.9rem', fontWeight: 600, margin: '0 0 0.25rem', color: 'var(--own-charcoal)' }}>{b.title}</h4>
              <p style={{ fontSize: '0.75rem', color: 'var(--own-muted)', lineHeight: 1.5, margin: 0 }}>{b.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  </section>
);

// ============================================
// VERSION 23: Polaroid Album
// ============================================
const Version23_PolaroidAlbum = () => (
  <section className="own-section" style={{ padding: '6rem 2rem', background: 'linear-gradient(180deg, var(--own-stone) 0%, var(--own-cream) 100%)' }}>
    <style>{globalStyles}</style>
    <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
      <div style={{ textAlign: 'center', marginBottom: '5rem' }}>
        <div className="own-mono" style={{ fontSize: '0.65rem', letterSpacing: '0.4em', color: 'var(--own-copper)', marginBottom: '1rem' }}>MEMORIES IN THE MAKING</div>
        <h2 style={{ fontSize: 'clamp(2rem, 4vw, 3.5rem)', fontWeight: 400, margin: 0, color: 'var(--own-charcoal)' }}>
          The Ownership <em style={{ fontStyle: 'italic' }}>Experience</em>
        </h2>
      </div>
      <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: '2rem' }}>
        {benefits.slice(0, 6).map((b, i) => (
          <div key={i} className="own-hover-lift own-fade-up" style={{
            background: '#fff',
            padding: '1rem 1rem 3rem',
            boxShadow: '0 8px 30px rgba(0,0,0,0.12)',
            transform: `rotate(${(i % 3 - 1) * 4}deg)`,
            width: '280px',
            animationDelay: `${i * 0.1}s`
          }}>
            <div style={{
              height: '200px',
              background: `linear-gradient(135deg, rgba(193,127,89,0.${2 + i}), transparent), var(--own-charcoal)`,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              marginBottom: '1.5rem'
            }}>
              <span style={{ fontSize: '4rem', filter: 'drop-shadow(0 4px 8px rgba(0,0,0,0.3))' }}>{b.icon}</span>
            </div>
            <h3 style={{ fontSize: '1.25rem', fontWeight: 500, margin: '0 0 0.5rem', color: 'var(--own-charcoal)', fontFamily: "'Playfair Display', serif" }}>{b.title}</h3>
            <p style={{ fontSize: '0.85rem', color: 'var(--own-muted)', lineHeight: 1.5, margin: 0 }}>{b.desc}</p>
            <div className="own-mono" style={{ position: 'absolute', bottom: '1rem', right: '1rem', fontSize: '0.6rem', color: 'var(--own-muted)', letterSpacing: '0.1em' }}>{b.stat}</div>
          </div>
        ))}
      </div>
    </div>
  </section>
);

// ============================================
// VERSION 24: Flip Cards
// ============================================
const Version24_FlipCards = () => {
  const [flippedCards, setFlippedCards] = useState({});
  const toggleCard = (idx) => setFlippedCards(prev => ({ ...prev, [idx]: !prev[idx] }));
  return (
    <section className="own-section" style={{ padding: '6rem 2rem', background: 'var(--own-cream)' }}>
      <style>{globalStyles}{`
        .flip-card { perspective: 1000px; cursor: pointer; }
        .flip-card-inner { position: relative; width: 100%; height: 100%; transition: transform 0.8s cubic-bezier(0.22, 1, 0.36, 1); transform-style: preserve-3d; }
        .flip-card.flipped .flip-card-inner { transform: rotateY(180deg); }
        .flip-card-front, .flip-card-back { position: absolute; inset: 0; backface-visibility: hidden; border-radius: 20px; }
        .flip-card-back { transform: rotateY(180deg); }
      `}</style>
      <div style={{ maxWidth: '1300px', margin: '0 auto' }}>
        <div style={{ textAlign: 'center', marginBottom: '4rem' }}>
          <div className="own-mono" style={{ fontSize: '0.65rem', letterSpacing: '0.4em', color: 'var(--own-copper)', marginBottom: '1rem' }}>TAP TO REVEAL</div>
          <h2 style={{ fontSize: 'clamp(2rem, 4vw, 3rem)', fontWeight: 400, margin: 0, color: 'var(--own-charcoal)' }}>
            Discover the <em style={{ fontStyle: 'italic' }}>Advantages</em>
          </h2>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '1.25rem' }}>
          {benefits.slice(0, 8).map((b, i) => (
            <div key={i} className={`flip-card own-fade-up ${flippedCards[i] ? 'flipped' : ''}`} onClick={() => toggleCard(i)} style={{ height: '280px', animationDelay: `${i * 0.08}s` }}>
              <div className="flip-card-inner">
                <div className="flip-card-front" style={{ background: 'var(--own-charcoal)', padding: '2rem', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center' }}>
                  <span style={{ fontSize: '3rem', marginBottom: '1.25rem' }}>{b.icon}</span>
                  <h4 style={{ fontSize: '1.2rem', fontWeight: 500, margin: 0, color: 'var(--own-cream)' }}>{b.title}</h4>
                  <div className="own-mono" style={{ fontSize: '0.6rem', color: 'var(--own-copper)', marginTop: '1rem', letterSpacing: '0.15em' }}>TAP TO REVEAL</div>
                </div>
                <div className="flip-card-back" style={{ background: 'var(--own-copper)', padding: '2rem', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                  <p style={{ fontSize: '0.95rem', color: 'var(--own-cream)', lineHeight: 1.7, margin: '0 0 1.5rem' }}>{b.desc}</p>
                  <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.5rem' }}>
                    <span className="own-mono" style={{ fontSize: '2rem', fontWeight: 500, color: 'var(--own-cream)' }}>{b.stat}</span>
                    <span style={{ fontSize: '0.7rem', color: 'rgba(248,246,241,0.7)', textTransform: 'uppercase' }}>{b.statLabel}</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

// ============================================
// VERSION 25: Vertical Progress Journey
// ============================================
const Version25_VerticalProgress = () => (
  <section className="own-section" style={{ padding: '6rem 2rem', background: 'var(--own-warm-white)' }}>
    <style>{globalStyles}</style>
    <div style={{ maxWidth: '800px', margin: '0 auto' }}>
      <div style={{ textAlign: 'center', marginBottom: '5rem' }}>
        <div className="own-mono" style={{ fontSize: '0.65rem', letterSpacing: '0.4em', color: 'var(--own-copper)', marginBottom: '1rem' }}>YOUR JOURNEY BEGINS</div>
        <h2 style={{ fontSize: 'clamp(2rem, 4vw, 3rem)', fontWeight: 400, margin: 0, color: 'var(--own-charcoal)' }}>
          The Path to <em style={{ fontStyle: 'italic' }}>Freedom</em>
        </h2>
      </div>
      <div style={{ position: 'relative', paddingLeft: '4rem' }}>
        <div style={{ position: 'absolute', left: '18px', top: 0, bottom: 0, width: '4px', background: 'linear-gradient(to bottom, var(--own-copper), var(--own-stone))', borderRadius: '2px' }} />
        {benefits.slice(0, 8).map((b, i) => (
          <div key={i} className="own-fade-up" style={{ position: 'relative', marginBottom: '3rem', animationDelay: `${i * 0.1}s` }}>
            <div style={{
              position: 'absolute',
              left: '-4rem',
              width: '40px',
              height: '40px',
              background: 'var(--own-copper)',
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '1.25rem',
              boxShadow: '0 4px 15px rgba(193,127,89,0.3)'
            }}>{b.icon}</div>
            <div className="own-hover-lift" style={{ background: 'var(--own-cream)', padding: '2rem', borderRadius: '16px', border: '1px solid var(--own-stone)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.75rem' }}>
                <h3 style={{ fontSize: '1.25rem', fontWeight: 500, margin: 0, color: 'var(--own-charcoal)' }}>{b.title}</h3>
                <span className="own-mono" style={{ fontSize: '1.25rem', fontWeight: 500, color: 'var(--own-copper)' }}>{b.stat}</span>
              </div>
              <p style={{ fontSize: '0.95rem', color: 'var(--own-muted)', lineHeight: 1.7, margin: 0 }}>{b.desc}</p>
            </div>
          </div>
        ))}
        <div style={{ position: 'relative', textAlign: 'center', paddingTop: '2rem' }}>
          <div style={{
            position: 'absolute',
            left: '-4rem',
            width: '40px',
            height: '40px',
            background: 'var(--own-charcoal)',
            borderRadius: '50%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '1rem',
            color: 'var(--own-cream)'
          }}>✓</div>
          <a href="#" style={{
            display: 'inline-block',
            padding: '1.25rem 3rem',
            background: 'var(--own-charcoal)',
            color: 'var(--own-cream)',
            textDecoration: 'none',
            borderRadius: '12px',
            fontWeight: 500,
            transition: 'transform 0.3s, box-shadow 0.3s'
          }}>Begin Your Journey</a>
        </div>
      </div>
    </div>
  </section>
);

// ============================================
// VERSION 26: Film Strip Cinematic
// ============================================
const Version26_FilmStrip = () => (
  <section className="own-section" style={{ padding: '6rem 0', background: '#0a0a0a', overflow: 'hidden' }}>
    <style>{globalStyles}</style>
    <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 2rem', marginBottom: '4rem' }}>
      <div className="own-mono" style={{ fontSize: '0.65rem', letterSpacing: '0.4em', color: 'var(--own-copper)', marginBottom: '1rem' }}>FRAME BY FRAME</div>
      <h2 style={{ fontSize: 'clamp(2rem, 4vw, 3.5rem)', fontWeight: 400, margin: 0, color: 'var(--own-cream)' }}>
        The Ownership <em style={{ fontStyle: 'italic' }}>Reel</em>
      </h2>
    </div>
    <div style={{ position: 'relative', padding: '2rem 0' }}>
      <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '24px', background: 'var(--own-charcoal)', display: 'flex', justifyContent: 'space-around', alignItems: 'center' }}>
        {[...Array(30)].map((_, i) => <div key={i} style={{ width: '12px', height: '8px', background: '#0a0a0a', borderRadius: '1px' }} />)}
      </div>
      <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: '24px', background: 'var(--own-charcoal)', display: 'flex', justifyContent: 'space-around', alignItems: 'center' }}>
        {[...Array(30)].map((_, i) => <div key={i} style={{ width: '12px', height: '8px', background: '#0a0a0a', borderRadius: '1px' }} />)}
      </div>
      <div style={{ display: 'flex', gap: '1rem', padding: '3rem 2rem', overflowX: 'auto', scrollbarWidth: 'none' }}>
        {benefits.map((b, i) => (
          <div key={i} className="own-fade-up" style={{
            flex: '0 0 280px',
            height: '360px',
            background: 'linear-gradient(180deg, rgba(193,127,89,0.15) 0%, rgba(13,13,13,0.9) 100%)',
            padding: '2rem',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'flex-end',
            position: 'relative',
            animationDelay: `${i * 0.08}s`
          }}>
            <div className="own-mono" style={{ position: 'absolute', top: '1rem', left: '1rem', fontSize: '0.55rem', letterSpacing: '0.15em', color: 'var(--own-copper)' }}>FRAME {String(i + 1).padStart(2, '0')}</div>
            <span style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>{b.icon}</span>
            <h3 style={{ fontSize: '1.25rem', fontWeight: 500, margin: '0 0 0.75rem', color: 'var(--own-cream)' }}>{b.title}</h3>
            <p style={{ fontSize: '0.85rem', color: 'rgba(248,246,241,0.6)', lineHeight: 1.6, margin: 0 }}>{b.desc}</p>
          </div>
        ))}
      </div>
    </div>
  </section>
);

// ============================================
// VERSION 27: 3D Perspective Cards
// ============================================
const Version27_PerspectiveCards = () => (
  <section className="own-section" style={{ padding: '6rem 2rem', background: 'linear-gradient(135deg, var(--own-charcoal) 0%, #1a1815 100%)', perspective: '1000px' }}>
    <style>{globalStyles}</style>
    <div style={{ maxWidth: '1300px', margin: '0 auto' }}>
      <div style={{ textAlign: 'center', marginBottom: '5rem' }}>
        <div className="own-mono" style={{ fontSize: '0.65rem', letterSpacing: '0.4em', color: 'var(--own-copper)', marginBottom: '1rem' }}>A NEW DIMENSION</div>
        <h2 style={{ fontSize: 'clamp(2rem, 4vw, 3.5rem)', fontWeight: 400, margin: 0, color: 'var(--own-cream)' }}>
          Experience <em style={{ fontStyle: 'italic' }}>Elevated</em>
        </h2>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '2rem', transform: 'rotateX(5deg)', transformStyle: 'preserve-3d' }}>
        {benefits.slice(0, 6).map((b, i) => (
          <div key={i} className="own-hover-lift own-fade-up" style={{
            background: 'linear-gradient(180deg, rgba(248,246,241,0.08) 0%, rgba(248,246,241,0.02) 100%)',
            backdropFilter: 'blur(20px)',
            borderRadius: '24px',
            padding: '2.5rem',
            border: '1px solid rgba(248,246,241,0.1)',
            transform: `translateZ(${20 + i * 10}px)`,
            boxShadow: `0 ${30 + i * 5}px ${60 + i * 10}px rgba(0,0,0,0.3)`,
            animationDelay: `${i * 0.1}s`
          }}>
            <div style={{
              width: '64px', height: '64px',
              background: 'linear-gradient(135deg, var(--own-copper), var(--own-copper-light))',
              borderRadius: '16px',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              marginBottom: '1.5rem',
              fontSize: '1.75rem',
              boxShadow: '0 8px 25px rgba(193,127,89,0.3)'
            }}>{b.icon}</div>
            <h3 style={{ fontSize: '1.35rem', fontWeight: 500, margin: '0 0 1rem', color: 'var(--own-cream)' }}>{b.title}</h3>
            <p style={{ fontSize: '0.95rem', color: 'rgba(248,246,241,0.6)', lineHeight: 1.7, margin: '0 0 1.5rem' }}>{b.desc}</p>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.5rem' }}>
              <span className="own-mono" style={{ fontSize: '2rem', fontWeight: 500, color: 'var(--own-copper)' }}>{b.stat}</span>
              <span style={{ fontSize: '0.7rem', color: 'rgba(248,246,241,0.4)', textTransform: 'uppercase' }}>{b.statLabel}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  </section>
);

// ============================================
// VERSION 28: Circular Radial Layout
// ============================================
const Version28_RadialLayout = () => (
  <section className="own-section" style={{ padding: '6rem 2rem', background: 'var(--own-cream)', minHeight: '100vh', display: 'flex', alignItems: 'center' }}>
    <style>{globalStyles}</style>
    <div style={{ maxWidth: '1200px', margin: '0 auto', width: '100%' }}>
      <div style={{ position: 'relative', aspectRatio: '1', maxWidth: '800px', margin: '0 auto' }}>
        {/* Center circle */}
        <div style={{
          position: 'absolute',
          top: '50%', left: '50%',
          transform: 'translate(-50%, -50%)',
          width: '200px', height: '200px',
          background: 'var(--own-charcoal)',
          borderRadius: '50%',
          display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
          textAlign: 'center',
          zIndex: 10,
          boxShadow: '0 20px 60px rgba(0,0,0,0.2)'
        }}>
          <div className="own-mono" style={{ fontSize: '0.55rem', letterSpacing: '0.3em', color: 'var(--own-copper)', marginBottom: '0.5rem' }}>OWNERSHIP</div>
          <h2 style={{ fontSize: '1.25rem', fontWeight: 500, margin: 0, color: 'var(--own-cream)', lineHeight: 1.2 }}>Benefits<br /><em>Hub</em></h2>
        </div>
        {/* Orbiting items */}
        {benefits.slice(0, 8).map((b, i) => {
          const angle = (i / 8) * 360 - 90;
          const radian = angle * (Math.PI / 180);
          const radius = 320;
          const x = Math.cos(radian) * radius;
          const y = Math.sin(radian) * radius;
          return (
            <div key={i} className="own-hover-lift own-fade-up" style={{
              position: 'absolute',
              top: '50%', left: '50%',
              transform: `translate(calc(-50% + ${x}px), calc(-50% + ${y}px))`,
              width: '140px',
              textAlign: 'center',
              animationDelay: `${i * 0.1}s`
            }}>
              <div style={{
                width: '56px', height: '56px',
                background: 'var(--own-warm-white)',
                borderRadius: '50%',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                margin: '0 auto 0.75rem',
                fontSize: '1.5rem',
                boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
                border: '2px solid var(--own-copper)'
              }}>{b.icon}</div>
              <h4 style={{ fontSize: '0.9rem', fontWeight: 600, margin: '0 0 0.25rem', color: 'var(--own-charcoal)' }}>{b.title}</h4>
              <span className="own-mono" style={{ fontSize: '0.7rem', color: 'var(--own-copper)' }}>{b.stat}</span>
            </div>
          );
        })}
        {/* Connection lines */}
        <svg style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', pointerEvents: 'none' }}>
          <circle cx="50%" cy="50%" r="320" fill="none" stroke="var(--own-stone)" strokeWidth="1" strokeDasharray="8 8" />
        </svg>
      </div>
    </div>
  </section>
);

// ============================================
// VERSION 29: Overlapping Layers
// ============================================
const Version29_OverlappingLayers = () => (
  <section className="own-section" style={{ padding: '6rem 2rem', background: 'var(--own-warm-white)' }}>
    <style>{globalStyles}</style>
    <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
      <div style={{ textAlign: 'center', marginBottom: '5rem' }}>
        <div className="own-mono" style={{ fontSize: '0.65rem', letterSpacing: '0.4em', color: 'var(--own-copper)', marginBottom: '1rem' }}>LAYERED BENEFITS</div>
        <h2 style={{ fontSize: 'clamp(2rem, 4vw, 3.5rem)', fontWeight: 400, margin: 0, color: 'var(--own-charcoal)' }}>
          Stacked <em style={{ fontStyle: 'italic' }}>Advantages</em>
        </h2>
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '-3rem' }}>
        {benefits.slice(0, 5).map((b, i) => (
          <div key={i} className="own-hover-lift own-fade-up" style={{
            background: i === 0 ? 'var(--own-charcoal)' : i === 1 ? 'var(--own-copper)' : 'var(--own-cream)',
            padding: '3rem 4rem',
            borderRadius: '24px',
            marginTop: i > 0 ? '-2rem' : 0,
            marginLeft: `${i * 2}rem`,
            marginRight: `${(4 - i) * 2}rem`,
            position: 'relative',
            zIndex: 10 - i,
            boxShadow: '0 20px 50px rgba(0,0,0,0.1)',
            display: 'grid',
            gridTemplateColumns: '1fr auto',
            gap: '3rem',
            alignItems: 'center',
            animationDelay: `${i * 0.15}s`
          }}>
            <div>
              <span style={{ fontSize: '2rem', display: 'block', marginBottom: '1rem' }}>{b.icon}</span>
              <h3 style={{ fontSize: '1.5rem', fontWeight: 500, margin: '0 0 0.75rem', color: i < 2 ? 'var(--own-cream)' : 'var(--own-charcoal)' }}>{b.title}</h3>
              <p style={{ fontSize: '1rem', color: i < 2 ? 'rgba(248,246,241,0.8)' : 'var(--own-muted)', lineHeight: 1.7, margin: 0 }}>{b.desc}</p>
            </div>
            <div style={{ textAlign: 'right' }}>
              <div className="own-mono" style={{ fontSize: '3rem', fontWeight: 500, color: i < 2 ? 'rgba(248,246,241,0.3)' : 'var(--own-stone)' }}>{b.stat}</div>
              <div style={{ fontSize: '0.7rem', color: i < 2 ? 'rgba(248,246,241,0.5)' : 'var(--own-muted)', textTransform: 'uppercase', letterSpacing: '0.1em' }}>{b.statLabel}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  </section>
);

// ============================================
// VERSION 30: Elegant Sidebar Navigation
// ============================================
const Version30_SidebarNav = () => {
  const [activeIndex, setActiveIndex] = useState(0);
  const activeBenefit = benefits[activeIndex];
  return (
    <section className="own-section" style={{ minHeight: '100vh', display: 'flex', background: 'var(--own-charcoal)' }}>
      <style>{globalStyles}</style>
      {/* Sidebar */}
      <div style={{ flex: '0 0 320px', background: 'var(--own-cream)', padding: '3rem 0', display: 'flex', flexDirection: 'column' }}>
        <div style={{ padding: '0 2rem', marginBottom: '2rem' }}>
          <div className="own-mono" style={{ fontSize: '0.6rem', letterSpacing: '0.4em', color: 'var(--own-copper)', marginBottom: '0.5rem' }}>OWNERSHIP</div>
          <h2 style={{ fontSize: '1.5rem', fontWeight: 500, margin: 0, color: 'var(--own-charcoal)' }}>Benefits</h2>
        </div>
        <div style={{ flex: 1, overflowY: 'auto' }}>
          {benefits.map((b, i) => (
            <button key={i} onClick={() => setActiveIndex(i)} style={{
              width: '100%',
              padding: '1rem 2rem',
              background: activeIndex === i ? 'var(--own-warm-white)' : 'transparent',
              border: 'none',
              borderLeft: activeIndex === i ? '3px solid var(--own-copper)' : '3px solid transparent',
              textAlign: 'left',
              cursor: 'pointer',
              transition: 'all 0.3s'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                <span style={{ fontSize: '1.25rem' }}>{b.icon}</span>
                <span style={{ fontSize: '0.95rem', fontWeight: activeIndex === i ? 600 : 400, color: 'var(--own-charcoal)' }}>{b.title}</span>
              </div>
            </button>
          ))}
        </div>
      </div>
      {/* Main content */}
      <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '4rem' }}>
        <div className="own-fade-up" key={activeIndex} style={{ maxWidth: '600px', textAlign: 'center' }}>
          <div style={{
            width: '120px', height: '120px',
            background: 'linear-gradient(135deg, var(--own-copper), var(--own-copper-light))',
            borderRadius: '50%',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            margin: '0 auto 2.5rem',
            fontSize: '3.5rem',
            boxShadow: '0 20px 50px rgba(193,127,89,0.3)'
          }}>{activeBenefit.icon}</div>
          <div className="own-mono" style={{ fontSize: '0.6rem', letterSpacing: '0.4em', color: 'var(--own-copper)', marginBottom: '1rem' }}>BENEFIT {String(activeIndex + 1).padStart(2, '0')}</div>
          <h3 style={{ fontSize: 'clamp(2rem, 4vw, 3rem)', fontWeight: 500, margin: '0 0 1.5rem', color: 'var(--own-cream)' }}>{activeBenefit.title}</h3>
          <p style={{ fontSize: '1.15rem', color: 'rgba(248,246,241,0.7)', lineHeight: 1.8, margin: '0 0 2.5rem' }}>{activeBenefit.desc}</p>
          <div style={{ display: 'flex', justifyContent: 'center', gap: '3rem' }}>
            <div>
              <div className="own-mono" style={{ fontSize: '3rem', fontWeight: 500, color: 'var(--own-copper)' }}>{activeBenefit.stat}</div>
              <div style={{ fontSize: '0.75rem', color: 'rgba(248,246,241,0.5)', textTransform: 'uppercase', letterSpacing: '0.15em' }}>{activeBenefit.statLabel}</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

// ============================================
// VERSION 31: Grid Precision
// ============================================
const Version31_GridPrecision = () => (
  <section className="own-section" style={{ padding: '6rem 2rem', background: '#faf9f6', position: 'relative', overflow: 'hidden' }}>
    <style>{globalStyles}</style>
    {/* Grid lines */}
    <div style={{ position: 'absolute', inset: 0, backgroundImage: 'linear-gradient(#e8e6e2 1px, transparent 1px), linear-gradient(90deg, #e8e6e2 1px, transparent 1px)', backgroundSize: '80px 80px', opacity: 0.5 }} />
    <div style={{ position: 'relative', zIndex: 2, maxWidth: '1200px', margin: '0 auto' }}>
      <div style={{ textAlign: 'center', marginBottom: '4rem' }}>
        <div style={{ fontFamily: "'Share Tech Mono', monospace", fontSize: '0.7rem', letterSpacing: '0.2em', color: '#999999', marginBottom: '1.5rem', textTransform: 'uppercase' }}>Ownership Benefits</div>
        <h2 style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: 'clamp(2rem, 4vw, 3rem)', fontWeight: 700, margin: 0, textTransform: 'uppercase', letterSpacing: '-0.02em' }}>
          <span style={{ color: '#1a1a1a' }}>Precision </span>
          <span style={{ color: '#4a4a4a' }}>Engineered </span>
          <span style={{ color: '#7a7a7a' }}>Benefits</span>
        </h2>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1px', background: '#e8e6e2' }}>
        {benefits.slice(0, 9).map((b, i) => (
          <div key={i} className="own-fade-up" style={{
            background: '#faf9f6',
            padding: '2.5rem',
            animationDelay: `${i * 0.08}s`
          }}>
            <div style={{ fontFamily: "'Share Tech Mono', monospace", fontSize: '0.65rem', color: '#999999', marginBottom: '1.5rem', letterSpacing: '0.1em' }}>
              {String(i + 1).padStart(2, '0')}
            </div>
            <h4 style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: '1.1rem', fontWeight: 700, margin: '0 0 1rem', color: '#1a1a1a', textTransform: 'uppercase', letterSpacing: '0.02em' }}>{b.title}</h4>
            <p style={{ fontSize: '0.95rem', color: '#666666', lineHeight: 1.8, margin: 0 }}>{b.desc}</p>
          </div>
        ))}
      </div>
    </div>
  </section>
);

// ============================================
// VERSION 32: Asymmetric Editorial
// ============================================
const Version32_AsymmetricEditorial = () => (
  <section className="own-section" style={{ padding: '6rem 2rem', background: '#ffffff', minHeight: '100vh' }}>
    <style>{globalStyles}</style>
    <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '4rem', marginBottom: '4rem' }}>
        <div style={{ position: 'sticky', top: '4rem', height: 'fit-content' }}>
          <div style={{ fontFamily: "'Share Tech Mono', monospace", fontSize: '0.7rem', letterSpacing: '0.2em', color: '#999999', marginBottom: '1.5rem', textTransform: 'uppercase' }}>The Ownership Advantage</div>
          <h2 style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: 'clamp(2rem, 4vw, 3rem)', fontWeight: 700, margin: '0 0 1.5rem', textTransform: 'uppercase', lineHeight: 1.1 }}>
            <span style={{ color: '#1a1a1a' }}>Why</span><br />
            <span style={{ color: '#4a4a4a' }}>Owners</span><br />
            <span style={{ color: '#7a7a7a' }}>Choose</span><br />
            <span style={{ color: '#999999' }}>HQ</span>
          </h2>
          <div style={{ width: '40px', height: '1px', background: 'linear-gradient(to right, #1a1a1a, transparent)' }} />
        </div>
        <div>
          {benefits.map((b, i) => (
            <div key={i} className="own-fade-up" style={{
              padding: '2.5rem 0',
              borderBottom: '1px solid #e8e6e2',
              display: 'grid',
              gridTemplateColumns: '60px 1fr',
              gap: '2rem',
              animationDelay: `${i * 0.08}s`
            }}>
              <div style={{ fontFamily: "'Share Tech Mono', monospace", fontSize: '0.65rem', letterSpacing: '0.1em', color: '#999999', paddingTop: '0.25rem' }}>{String(i + 1).padStart(2, '0')}</div>
              <div>
                <h4 style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: '1.25rem', fontWeight: 700, margin: '0 0 0.75rem', color: '#1a1a1a', textTransform: 'uppercase' }}>{b.title}</h4>
                <p style={{ fontSize: '1rem', color: '#666666', lineHeight: 1.8, margin: 0 }}>{b.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  </section>
);

// ============================================
// VERSION 33: Dark Contrast
// ============================================
const Version33_DarkContrast = () => (
  <section className="own-section" style={{ padding: '6rem 2rem', background: '#1a1a1a' }}>
    <style>{globalStyles}</style>
    <div style={{ maxWidth: '1000px', margin: '0 auto' }}>
      <div style={{ textAlign: 'center', marginBottom: '4rem' }}>
        <div style={{ fontFamily: "'Share Tech Mono', monospace", fontSize: '0.65rem', letterSpacing: '0.2em', color: 'rgba(255,255,255,0.5)', marginBottom: '1.5rem', textTransform: 'uppercase' }}>51.5751°N / 0.5059°W</div>
        <h2 style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: 'clamp(2rem, 5vw, 3.5rem)', fontWeight: 700, margin: 0, color: '#ffffff', textTransform: 'uppercase', letterSpacing: '-0.02em' }}>
          Ownership Benefits
        </h2>
      </div>
      {benefits.map((b, i) => (
        <div key={i} className="own-fade-up" style={{
          padding: '2rem 0',
          borderBottom: '1px solid rgba(255,255,255,0.1)',
          display: 'grid',
          gridTemplateColumns: '80px 1fr 100px',
          gap: '2rem',
          alignItems: 'center',
          animationDelay: `${i * 0.08}s`
        }}>
          <div style={{ fontFamily: "'Share Tech Mono', monospace", fontSize: '0.65rem', letterSpacing: '0.1em', color: 'rgba(255,255,255,0.3)' }}>{String(i + 1).padStart(2, '0')}</div>
          <div>
            <h4 style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: '1.1rem', fontWeight: 700, margin: '0 0 0.5rem', color: '#ffffff', textTransform: 'uppercase' }}>{b.title}</h4>
            <p style={{ fontSize: '0.95rem', color: 'rgba(255,255,255,0.5)', lineHeight: 1.7, margin: 0 }}>{b.desc}</p>
          </div>
          <div style={{ textAlign: 'right' }}>
            <div style={{ fontFamily: "'Share Tech Mono', monospace", fontSize: '1.5rem', fontWeight: 500, color: '#ffffff' }}>{b.stat}</div>
            <div style={{ fontSize: '0.6rem', color: 'rgba(255,255,255,0.3)', textTransform: 'uppercase', letterSpacing: '0.1em' }}>{b.statLabel}</div>
          </div>
        </div>
      ))}
    </div>
  </section>
);

// ============================================
// VERSION 34: Split Hero
// ============================================
const Version34_SplitHero = () => (
  <section className="own-section" style={{ minHeight: '100vh', display: 'grid', gridTemplateColumns: '1fr 1fr' }}>
    <style>{globalStyles}</style>
    <div style={{ background: '#1a1a1a', padding: '6rem 4rem', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
      <div style={{ fontFamily: "'Share Tech Mono', monospace", fontSize: '0.65rem', letterSpacing: '0.2em', color: 'rgba(255,255,255,0.5)', marginBottom: '2rem', textTransform: 'uppercase' }}>The Robinson Specialists Since 2010</div>
      <h2 style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: 'clamp(2.5rem, 5vw, 4rem)', fontWeight: 700, margin: '0 0 2rem', color: '#ffffff', textTransform: 'uppercase', lineHeight: 1, letterSpacing: '-0.02em' }}>
        Why Own<br />A Helicopter
      </h2>
      <p style={{ fontSize: '1.1rem', color: 'rgba(255,255,255,0.6)', lineHeight: 1.8, maxWidth: '400px', marginBottom: '3rem' }}>
        Discover the transformative benefits that helicopter ownership brings to your life and business.
      </p>
      <div style={{ display: 'flex', gap: '1rem' }}>
        <a href="#" style={{ padding: '1rem 2rem', background: '#ffffff', color: '#1a1a1a', textDecoration: 'none', fontFamily: "'Space Grotesk', sans-serif", fontSize: '0.75rem', fontWeight: 500, textTransform: 'uppercase', letterSpacing: '0.1em' }}>Explore Fleet</a>
        <a href="#" style={{ padding: '1rem 2rem', background: 'transparent', color: '#ffffff', textDecoration: 'none', fontFamily: "'Space Grotesk', sans-serif", fontSize: '0.75rem', fontWeight: 500, textTransform: 'uppercase', letterSpacing: '0.1em', border: '1px solid rgba(255,255,255,0.3)' }}>Contact Us</a>
      </div>
    </div>
    <div style={{ background: '#faf9f6', padding: '4rem', overflowY: 'auto' }}>
      {benefits.slice(0, 6).map((b, i) => (
        <div key={i} className="own-fade-up" style={{
          padding: '2rem 0',
          borderBottom: '1px solid #e8e6e2',
          animationDelay: `${i * 0.1}s`
        }}>
          <div style={{ display: 'flex', alignItems: 'flex-start', gap: '1.5rem' }}>
            <div style={{ fontFamily: "'Share Tech Mono', monospace", fontSize: '0.65rem', color: '#999999', paddingTop: '0.25rem' }}>{String(i + 1).padStart(2, '0')}</div>
            <div style={{ flex: 1 }}>
              <h4 style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: '1.1rem', fontWeight: 700, margin: '0 0 0.75rem', color: '#1a1a1a', textTransform: 'uppercase' }}>{b.title}</h4>
              <p style={{ fontSize: '0.95rem', color: '#666666', lineHeight: 1.7, margin: 0 }}>{b.desc}</p>
            </div>
          </div>
        </div>
      ))}
    </div>
  </section>
);

// ============================================
// VERSION 35: Focus Selector
// ============================================
const Version35_FocusSelector = () => {
  const [activeIndex, setActiveIndex] = useState(0);
  return (
    <section className="own-section" style={{ padding: '6rem 2rem', background: '#faf9f6', minHeight: '100vh' }}>
      <style>{globalStyles}</style>
      <div style={{ maxWidth: '1100px', margin: '0 auto' }}>
        <div style={{ textAlign: 'center', marginBottom: '4rem' }}>
          <div style={{ fontFamily: "'Share Tech Mono', monospace", fontSize: '0.7rem', letterSpacing: '0.2em', color: '#999999', marginBottom: '1.5rem', textTransform: 'uppercase' }}>Select a Benefit</div>
          <h2 style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: 'clamp(2rem, 4vw, 3rem)', fontWeight: 700, margin: 0, textTransform: 'uppercase' }}>
            <span style={{ color: '#1a1a1a' }}>Explore </span>
            <span style={{ color: '#7a7a7a' }}>Each Advantage</span>
          </h2>
        </div>
        {/* Selector tabs */}
        <div style={{ display: 'flex', justifyContent: 'center', gap: '0', marginBottom: '4rem', borderBottom: '1px solid #e8e6e2' }}>
          {benefits.map((b, i) => (
            <button key={i} onClick={() => setActiveIndex(i)} style={{
              padding: '1rem 1.5rem',
              background: 'transparent',
              border: 'none',
              borderBottom: activeIndex === i ? '2px solid #1a1a1a' : '2px solid transparent',
              cursor: 'pointer',
              fontFamily: "'Share Tech Mono', monospace",
              fontSize: '0.65rem',
              letterSpacing: '0.1em',
              color: activeIndex === i ? '#1a1a1a' : '#999999',
              transition: 'all 0.3s'
            }}>{String(i + 1).padStart(2, '0')}</button>
          ))}
        </div>
        {/* Active benefit display */}
        <div className="own-fade-up" key={activeIndex} style={{ textAlign: 'center', maxWidth: '700px', margin: '0 auto' }}>
          <div style={{ fontFamily: "'Share Tech Mono', monospace", fontSize: '4rem', fontWeight: 500, color: '#e8e6e2', marginBottom: '1rem' }}>{String(activeIndex + 1).padStart(2, '0')}</div>
          <h3 style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: 'clamp(1.75rem, 4vw, 2.5rem)', fontWeight: 700, margin: '0 0 1.5rem', color: '#1a1a1a', textTransform: 'uppercase' }}>{benefits[activeIndex].title}</h3>
          <p style={{ fontSize: '1.15rem', color: '#666666', lineHeight: 1.9, margin: '0 0 2rem' }}>{benefits[activeIndex].desc}</p>
          <div style={{ display: 'flex', justifyContent: 'center', gap: '3rem' }}>
            <div>
              <div style={{ fontFamily: "'Share Tech Mono', monospace", fontSize: '2.5rem', fontWeight: 500, color: '#1a1a1a' }}>{benefits[activeIndex].stat}</div>
              <div style={{ fontSize: '0.7rem', color: '#999999', textTransform: 'uppercase', letterSpacing: '0.15em' }}>{benefits[activeIndex].statLabel}</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

// ============================================
// VERSION 36: Two Column Cards
// ============================================
const Version36_TwoColumnCards = () => (
  <section className="own-section" style={{ padding: '6rem 2rem', background: '#ffffff' }}>
    <style>{globalStyles}</style>
    <div style={{ maxWidth: '1100px', margin: '0 auto' }}>
      <div style={{ textAlign: 'center', marginBottom: '4rem' }}>
        <div style={{ fontFamily: "'Share Tech Mono', monospace", fontSize: '0.7rem', letterSpacing: '0.2em', color: '#999999', marginBottom: '1.5rem', textTransform: 'uppercase' }}>HQ Aviation</div>
        <h2 style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: 'clamp(2rem, 4vw, 3rem)', fontWeight: 700, margin: 0, textTransform: 'uppercase' }}>
          <span style={{ color: '#1a1a1a' }}>Ownership </span>
          <span style={{ color: '#4a4a4a' }}>Benefits</span>
        </h2>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '1.5rem' }}>
        {benefits.map((b, i) => (
          <div key={i} className="own-hover-lift own-fade-up" style={{
            background: '#faf9f6',
            padding: '2.5rem',
            transition: 'all 0.3s ease',
            animationDelay: `${i * 0.08}s`
          }}>
            <div style={{ display: 'flex', alignItems: 'flex-start', gap: '1.5rem' }}>
              <div style={{ fontFamily: "'Share Tech Mono', monospace", fontSize: '0.65rem', color: '#999999', paddingTop: '0.25rem' }}>{String(i + 1).padStart(2, '0')}</div>
              <div style={{ flex: 1 }}>
                <h4 style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: '1.1rem', fontWeight: 700, margin: '0 0 0.75rem', color: '#1a1a1a', textTransform: 'uppercase' }}>{b.title}</h4>
                <p style={{ fontSize: '0.95rem', color: '#666666', lineHeight: 1.7, margin: 0 }}>{b.desc}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  </section>
);

// ============================================
// VERSION 37: Stats Focused
// ============================================
const Version37_StatsFocused = () => (
  <section className="own-section" style={{ padding: '6rem 2rem', background: '#1a1a1a' }}>
    <style>{globalStyles}</style>
    <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
      <div style={{ textAlign: 'center', marginBottom: '4rem' }}>
        <div style={{ fontFamily: "'Share Tech Mono', monospace", fontSize: '0.7rem', letterSpacing: '0.2em', color: 'rgba(255,255,255,0.5)', marginBottom: '1.5rem', textTransform: 'uppercase' }}>By The Numbers</div>
        <h2 style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: 'clamp(2rem, 4vw, 3rem)', fontWeight: 700, margin: 0, color: '#ffffff', textTransform: 'uppercase' }}>
          Ownership Metrics
        </h2>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '1px', background: 'rgba(255,255,255,0.1)' }}>
        {benefits.slice(0, 8).map((b, i) => (
          <div key={i} className="own-fade-up" style={{
            background: '#1a1a1a',
            padding: '2.5rem 2rem',
            textAlign: 'center',
            animationDelay: `${i * 0.08}s`
          }}>
            <div style={{ fontFamily: "'Share Tech Mono', monospace", fontSize: 'clamp(2.5rem, 4vw, 3.5rem)', fontWeight: 500, color: '#ffffff', marginBottom: '0.5rem' }}>{b.stat}</div>
            <div style={{ fontSize: '0.65rem', color: 'rgba(255,255,255,0.4)', textTransform: 'uppercase', letterSpacing: '0.15em', marginBottom: '1.5rem' }}>{b.statLabel}</div>
            <h4 style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: '0.85rem', fontWeight: 700, margin: '0 0 0.5rem', color: '#ffffff', textTransform: 'uppercase' }}>{b.title}</h4>
            <p style={{ fontSize: '0.8rem', color: 'rgba(255,255,255,0.5)', lineHeight: 1.5, margin: 0 }}>{b.desc.substring(0, 60)}...</p>
          </div>
        ))}
      </div>
    </div>
  </section>
);

// ============================================
// VERSION 38: Full Width Sections
// ============================================
const Version38_FullWidthSections = () => (
  <section className="own-section">
    <style>{globalStyles}</style>
    {benefits.slice(0, 5).map((b, i) => (
      <div key={i} className="own-fade-up" style={{
        minHeight: '60vh',
        padding: '6rem 2rem',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: i % 2 === 0 ? '#faf9f6' : '#ffffff',
        borderBottom: '1px solid #e8e6e2',
        animationDelay: `${i * 0.15}s`
      }}>
        <div style={{ maxWidth: '700px', textAlign: 'center' }}>
          <div style={{ fontFamily: "'Share Tech Mono', monospace", fontSize: '0.7rem', letterSpacing: '0.2em', color: '#999999', marginBottom: '2rem', textTransform: 'uppercase' }}>Benefit {String(i + 1).padStart(2, '0')}</div>
          <h3 style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: 'clamp(2rem, 4vw, 3rem)', fontWeight: 700, margin: '0 0 1.5rem', color: '#1a1a1a', textTransform: 'uppercase', lineHeight: 1.1 }}>{b.title}</h3>
          <p style={{ fontSize: '1.1rem', color: '#666666', lineHeight: 1.8, margin: '0 0 2rem' }}>{b.desc}</p>
          <div style={{ display: 'flex', justifyContent: 'center', gap: '0.5rem', alignItems: 'baseline' }}>
            <span style={{ fontFamily: "'Share Tech Mono', monospace", fontSize: '2rem', fontWeight: 500, color: '#1a1a1a' }}>{b.stat}</span>
            <span style={{ fontSize: '0.7rem', color: '#999999', textTransform: 'uppercase', letterSpacing: '0.1em' }}>{b.statLabel}</span>
          </div>
        </div>
      </div>
    ))}
  </section>
);

// ============================================
// VERSION 39: Minimal Centered
// ============================================
const Version39_MinimalCentered = () => (
  <section className="own-section" style={{ padding: '6rem 2rem', background: '#ffffff', minHeight: '100vh' }}>
    <style>{globalStyles}</style>
    <div style={{ maxWidth: '600px', margin: '0 auto' }}>
      <div style={{ textAlign: 'center', marginBottom: '4rem' }}>
        <div style={{ fontFamily: "'Share Tech Mono', monospace", fontSize: '0.7rem', letterSpacing: '0.2em', color: '#999999', marginBottom: '1.5rem', textTransform: 'uppercase' }}>Denham Aerodrome, UK</div>
        <h2 style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: 'clamp(2rem, 4vw, 3rem)', fontWeight: 700, margin: 0, textTransform: 'uppercase' }}>
          <span style={{ color: '#1a1a1a' }}>Benefits</span>
        </h2>
        <div style={{ width: '40px', height: '1px', background: '#1a1a1a', margin: '2rem auto' }} />
      </div>
      {benefits.map((b, i) => (
        <div key={i} className="own-fade-up" style={{
          textAlign: 'center',
          padding: '3rem 0',
          borderBottom: '1px solid #e8e6e2',
          animationDelay: `${i * 0.1}s`
        }}>
          <div style={{ fontFamily: "'Share Tech Mono', monospace", fontSize: '0.65rem', letterSpacing: '0.2em', color: '#999999', marginBottom: '1rem' }}>{String(i + 1).padStart(2, '0')}</div>
          <h3 style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: '1.25rem', fontWeight: 700, margin: '0 0 1rem', color: '#1a1a1a', textTransform: 'uppercase' }}>{b.title}</h3>
          <p style={{ fontSize: '1rem', color: '#666666', lineHeight: 1.8, margin: 0 }}>{b.desc}</p>
        </div>
      ))}
    </div>
  </section>
);

// ============================================
// VERSION 40: Three Column Grid
// ============================================
const Version40_ThreeColumnGrid = () => (
  <section className="own-section" style={{ padding: '6rem 2rem', background: '#faf9f6' }}>
    <style>{globalStyles}</style>
    <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
      <div style={{ textAlign: 'center', marginBottom: '4rem' }}>
        <div style={{ fontFamily: "'Share Tech Mono', monospace", fontSize: '0.7rem', letterSpacing: '0.2em', color: '#999999', marginBottom: '1.5rem', textTransform: 'uppercase' }}>Since 2010</div>
        <h2 style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: 'clamp(2rem, 4vw, 3rem)', fontWeight: 700, margin: 0, textTransform: 'uppercase' }}>
          <span style={{ color: '#1a1a1a' }}>Why </span>
          <span style={{ color: '#4a4a4a' }}>Own </span>
          <span style={{ color: '#7a7a7a' }}>With HQ</span>
        </h2>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '2rem' }}>
        {benefits.slice(0, 9).map((b, i) => (
          <div key={i} className="own-hover-lift own-fade-up" style={{
            background: '#ffffff',
            padding: '2.5rem',
            boxShadow: '0 5px 15px rgba(0,0,0,0.05)',
            transition: 'all 0.3s ease',
            animationDelay: `${i * 0.08}s`
          }}>
            <div style={{ fontFamily: "'Share Tech Mono', monospace", fontSize: '0.65rem', color: '#999999', marginBottom: '1.5rem', letterSpacing: '0.1em' }}>{String(i + 1).padStart(2, '0')}</div>
            <h4 style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: '1.1rem', fontWeight: 700, margin: '0 0 1rem', color: '#1a1a1a', textTransform: 'uppercase' }}>{b.title}</h4>
            <p style={{ fontSize: '0.95rem', color: '#666666', lineHeight: 1.7, margin: 0 }}>{b.desc}</p>
          </div>
        ))}
      </div>
    </div>
  </section>
);

// ============================================
// VERSION 41: Alternating Sides
// ============================================
const Version41_AlternatingSides = () => (
  <section className="own-section" style={{ padding: '6rem 2rem', background: '#ffffff' }}>
    <style>{globalStyles}</style>
    <div style={{ maxWidth: '900px', margin: '0 auto' }}>
      <div style={{ textAlign: 'center', marginBottom: '4rem' }}>
        <div style={{ fontFamily: "'Share Tech Mono', monospace", fontSize: '0.7rem', letterSpacing: '0.2em', color: '#999999', marginBottom: '1.5rem', textTransform: 'uppercase' }}>The Ownership Journey</div>
        <h2 style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: 'clamp(2rem, 4vw, 3rem)', fontWeight: 700, margin: 0, textTransform: 'uppercase' }}>
          <span style={{ color: '#1a1a1a' }}>Every </span>
          <span style={{ color: '#4a4a4a' }}>Advantage </span>
          <span style={{ color: '#7a7a7a' }}>Counts</span>
        </h2>
      </div>
      {benefits.map((b, i) => (
        <div key={i} className="own-fade-up" style={{
          display: 'grid',
          gridTemplateColumns: i % 2 === 0 ? '1fr 60px 1fr' : '1fr 60px 1fr',
          gap: '2rem',
          marginBottom: '3rem',
          alignItems: 'start',
          animationDelay: `${i * 0.1}s`
        }}>
          <div style={{ textAlign: 'right', order: i % 2 === 0 ? 1 : 3, paddingTop: '0.5rem' }}>
            {i % 2 === 0 && (
              <>
                <h4 style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: '1.1rem', fontWeight: 700, margin: '0 0 0.75rem', color: '#1a1a1a', textTransform: 'uppercase' }}>{b.title}</h4>
                <p style={{ fontSize: '0.95rem', color: '#666666', lineHeight: 1.7, margin: 0 }}>{b.desc}</p>
              </>
            )}
          </div>
          <div style={{ display: 'flex', justifyContent: 'center', order: 2 }}>
            <div style={{ width: '48px', height: '48px', background: '#1a1a1a', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <span style={{ fontFamily: "'Share Tech Mono', monospace", fontSize: '0.7rem', color: '#ffffff' }}>{String(i + 1).padStart(2, '0')}</span>
            </div>
          </div>
          <div style={{ textAlign: 'left', order: i % 2 === 0 ? 3 : 1, paddingTop: '0.5rem' }}>
            {i % 2 !== 0 && (
              <>
                <h4 style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: '1.1rem', fontWeight: 700, margin: '0 0 0.75rem', color: '#1a1a1a', textTransform: 'uppercase' }}>{b.title}</h4>
                <p style={{ fontSize: '0.95rem', color: '#666666', lineHeight: 1.7, margin: 0 }}>{b.desc}</p>
              </>
            )}
          </div>
        </div>
      ))}
    </div>
  </section>
);

// ============================================
// VERSION 42: Hover Expand Cards
// ============================================
const Version42_HoverExpand = () => {
  const [hoveredIndex, setHoveredIndex] = useState(null);
  return (
    <section className="own-section" style={{ padding: '6rem 2rem', background: '#faf9f6' }}>
      <style>{globalStyles}</style>
      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
        <div style={{ textAlign: 'center', marginBottom: '4rem' }}>
          <div style={{ fontFamily: "'Share Tech Mono', monospace", fontSize: '0.7rem', letterSpacing: '0.2em', color: '#999999', marginBottom: '1.5rem', textTransform: 'uppercase' }}>Hover to Explore</div>
          <h2 style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: 'clamp(2rem, 4vw, 3rem)', fontWeight: 700, margin: 0, textTransform: 'uppercase' }}>
            <span style={{ color: '#1a1a1a' }}>Ownership </span>
            <span style={{ color: '#7a7a7a' }}>Benefits</span>
          </h2>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1px', background: '#e8e6e2' }}>
          {benefits.slice(0, 6).map((b, i) => (
            <div
              key={i}
              className="own-fade-up"
              onMouseEnter={() => setHoveredIndex(i)}
              onMouseLeave={() => setHoveredIndex(null)}
              style={{
                background: '#faf9f6',
                padding: '3rem 2rem',
                cursor: 'pointer',
                transition: 'all 0.3s ease',
                animationDelay: `${i * 0.08}s`
              }}
            >
              <div style={{ fontFamily: "'Share Tech Mono', monospace", fontSize: '0.65rem', color: '#999999', marginBottom: '1.5rem', letterSpacing: '0.1em' }}>{String(i + 1).padStart(2, '0')}</div>
              <h4 style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: '1.1rem', fontWeight: 700, margin: '0 0 1rem', color: '#1a1a1a', textTransform: 'uppercase' }}>{b.title}</h4>
              <div style={{
                maxHeight: hoveredIndex === i ? '200px' : '0',
                overflow: 'hidden',
                transition: 'max-height 0.4s cubic-bezier(0.16, 1, 0.3, 1)'
              }}>
                <p style={{ fontSize: '0.95rem', color: '#666666', lineHeight: 1.7, margin: '0 0 1.5rem' }}>{b.desc}</p>
                <div style={{ fontFamily: "'Share Tech Mono', monospace", fontSize: '1.25rem', color: '#1a1a1a' }}>{b.stat} <span style={{ fontSize: '0.65rem', color: '#999999' }}>{b.statLabel}</span></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

// ============================================
// VERSION 43: Staggered Cards
// ============================================
const Version43_StaggeredCards = () => (
  <section className="own-section" style={{ padding: '6rem 2rem', background: '#ffffff' }}>
    <style>{globalStyles}</style>
    <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
      <div style={{ textAlign: 'center', marginBottom: '4rem' }}>
        <div style={{ fontFamily: "'Share Tech Mono', monospace", fontSize: '0.7rem', letterSpacing: '0.2em', color: '#999999', marginBottom: '1.5rem', textTransform: 'uppercase' }}>HQ Aviation</div>
        <h2 style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: 'clamp(2rem, 4vw, 3rem)', fontWeight: 700, margin: 0, textTransform: 'uppercase' }}>
          <span style={{ color: '#1a1a1a' }}>Ownership </span>
          <span style={{ color: '#4a4a4a' }}>Advantages</span>
        </h2>
      </div>
      <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: '1.5rem' }}>
        {benefits.slice(0, 6).map((b, i) => (
          <div key={i} className="own-hover-lift own-fade-up" style={{
            width: '320px',
            background: '#faf9f6',
            padding: '2.5rem',
            boxShadow: '0 5px 15px rgba(0,0,0,0.05)',
            marginTop: `${(i % 3) * 2}rem`,
            transition: 'all 0.3s ease',
            animationDelay: `${i * 0.1}s`
          }}>
            <div style={{ fontFamily: "'Share Tech Mono', monospace", fontSize: '0.65rem', color: '#999999', marginBottom: '1.5rem', letterSpacing: '0.1em' }}>{String(i + 1).padStart(2, '0')}</div>
            <h4 style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: '1.1rem', fontWeight: 700, margin: '0 0 1rem', color: '#1a1a1a', textTransform: 'uppercase' }}>{b.title}</h4>
            <p style={{ fontSize: '0.95rem', color: '#666666', lineHeight: 1.7, margin: 0 }}>{b.desc}</p>
          </div>
        ))}
      </div>
    </div>
  </section>
);

// ============================================
// VERSION 44: Large Numbers
// ============================================
const Version44_LargeNumbers = () => (
  <section className="own-section" style={{ padding: '6rem 2rem', background: '#faf9f6' }}>
    <style>{globalStyles}</style>
    <div style={{ maxWidth: '1100px', margin: '0 auto' }}>
      <div style={{ textAlign: 'center', marginBottom: '4rem' }}>
        <div style={{ fontFamily: "'Share Tech Mono', monospace", fontSize: '0.7rem', letterSpacing: '0.2em', color: '#999999', marginBottom: '1.5rem', textTransform: 'uppercase' }}>Benefits Overview</div>
        <h2 style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: 'clamp(2rem, 4vw, 3rem)', fontWeight: 700, margin: 0, textTransform: 'uppercase' }}>
          <span style={{ color: '#1a1a1a' }}>The </span>
          <span style={{ color: '#4a4a4a' }}>Complete </span>
          <span style={{ color: '#7a7a7a' }}>Picture</span>
        </h2>
      </div>
      {benefits.map((b, i) => (
        <div key={i} className="own-fade-up" style={{
          display: 'grid',
          gridTemplateColumns: '120px 1fr',
          gap: '3rem',
          padding: '2.5rem 0',
          borderBottom: '1px solid #e8e6e2',
          alignItems: 'start',
          animationDelay: `${i * 0.08}s`
        }}>
          <div style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: '5rem', fontWeight: 700, color: '#e8e6e2', lineHeight: 0.9 }}>{String(i + 1).padStart(2, '0')}</div>
          <div style={{ paddingTop: '0.5rem' }}>
            <h4 style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: '1.25rem', fontWeight: 700, margin: '0 0 1rem', color: '#1a1a1a', textTransform: 'uppercase' }}>{b.title}</h4>
            <p style={{ fontSize: '1rem', color: '#666666', lineHeight: 1.8, margin: 0 }}>{b.desc}</p>
          </div>
        </div>
      ))}
    </div>
  </section>
);

// ============================================
// VERSION 45: Documentary Editorial
// ============================================
const Version45_Documentary = () => (
  <section className="own-section" style={{ padding: '6rem 2rem', background: '#faf9f6', position: 'relative' }}>
    <style>{globalStyles}</style>
    {/* Subtle grid */}
    <div style={{ position: 'absolute', inset: 0, backgroundImage: 'linear-gradient(90deg, #e8e6e2 1px, transparent 1px)', backgroundSize: '25% 100%', opacity: 0.3 }} />
    <div style={{ position: 'relative', zIndex: 2, maxWidth: '1100px', margin: '0 auto' }}>
      {/* Editorial header */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '4rem', marginBottom: '4rem', alignItems: 'end' }}>
        <div>
          <div style={{ fontFamily: "'Share Tech Mono', monospace", fontSize: '0.65rem', letterSpacing: '0.2em', color: '#999999', marginBottom: '1rem', textTransform: 'uppercase' }}>Issue No. 01</div>
          <h2 style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: 'clamp(2.5rem, 5vw, 3.5rem)', fontWeight: 700, margin: 0, textTransform: 'uppercase', letterSpacing: '-0.02em', lineHeight: 1 }}>
            <span style={{ color: '#1a1a1a' }}>The Case</span><br />
            <span style={{ color: '#4a4a4a' }}>For</span> <span style={{ color: '#7a7a7a' }}>Ownership</span>
          </h2>
        </div>
        <div>
          <p style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: '1rem', color: '#666666', lineHeight: 1.8, margin: 0 }}>
            A comprehensive examination of the practical, experiential, and lifestyle advantages that helicopter ownership delivers.
          </p>
        </div>
      </div>
      {/* Featured benefit */}
      <div style={{ background: '#1a1a1a', padding: '3rem', marginBottom: '2rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '2rem' }}>
          <div style={{ fontFamily: "'Share Tech Mono', monospace", fontSize: '0.65rem', letterSpacing: '0.15em', color: 'rgba(255,255,255,0.4)', textTransform: 'uppercase' }}>Featured Insight</div>
          <div style={{ fontFamily: "'Share Tech Mono', monospace", fontSize: '2.5rem', fontWeight: 700, color: 'rgba(255,255,255,0.1)' }}>01</div>
        </div>
        <h3 style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: 'clamp(1.5rem, 3vw, 2rem)', fontWeight: 700, color: '#ffffff', margin: '0 0 1rem', textTransform: 'uppercase' }}>{benefits[0].title}</h3>
        <p style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: '1.1rem', color: 'rgba(255,255,255,0.7)', lineHeight: 1.8, margin: 0, maxWidth: '600px' }}>{benefits[0].desc}</p>
      </div>
      {/* Numbered list */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '0' }}>
        {benefits.slice(1, 9).map((b, i) => (
          <div key={i} className="own-fade-up" style={{
            padding: '1.5rem 0',
            borderBottom: '1px solid #e8e6e2',
            display: 'flex',
            gap: '1.5rem',
            animationDelay: `${i * 0.05}s`
          }}>
            <div style={{ fontFamily: "'Share Tech Mono', monospace", fontSize: '0.7rem', color: '#999999', letterSpacing: '0.1em' }}>{String(i + 2).padStart(2, '0')}</div>
            <div>
              <h4 style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: '1rem', fontWeight: 700, margin: '0 0 0.5rem', color: '#1a1a1a', textTransform: 'uppercase', letterSpacing: '0.02em' }}>{b.title}</h4>
              <p style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: '0.9rem', color: '#666666', lineHeight: 1.6, margin: 0 }}>{b.desc.substring(0, 100)}...</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  </section>
);

// ============================================
// VERSION 46: Split Contrast
// ============================================
const Version46_SplitContrast = () => (
  <section className="own-section" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', minHeight: '100vh' }}>
    <style>{globalStyles}</style>
    {/* Dark side */}
    <div style={{ background: '#1a1a1a', padding: '4rem 3rem', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
      <div style={{ fontFamily: "'Share Tech Mono', monospace", fontSize: '0.65rem', letterSpacing: '0.2em', color: 'rgba(255,255,255,0.4)', marginBottom: '2rem', textTransform: 'uppercase' }}>Why Own A Helicopter</div>
      <h2 style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: 'clamp(2rem, 4vw, 3rem)', fontWeight: 700, margin: '0 0 3rem', textTransform: 'uppercase', letterSpacing: '-0.02em', lineHeight: 1.1 }}>
        <span style={{ color: '#ffffff' }}>The</span><br />
        <span style={{ color: 'rgba(255,255,255,0.6)' }}>Practical</span><br />
        <span style={{ color: 'rgba(255,255,255,0.3)' }}>Advantage</span>
      </h2>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
        {benefits.filter(b => b.category === 'Practical').map((b, i) => (
          <div key={i} className="own-fade-up" style={{ display: 'flex', gap: '1.5rem', alignItems: 'flex-start', animationDelay: `${i * 0.1}s` }}>
            <div style={{ fontFamily: "'Share Tech Mono', monospace", fontSize: '0.65rem', color: 'rgba(255,255,255,0.3)', letterSpacing: '0.1em', marginTop: '0.25rem' }}>{String(i + 1).padStart(2, '0')}</div>
            <div>
              <h4 style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: '1rem', fontWeight: 700, margin: '0 0 0.5rem', color: '#ffffff', textTransform: 'uppercase', letterSpacing: '0.02em' }}>{b.title}</h4>
              <p style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: '0.9rem', color: 'rgba(255,255,255,0.5)', lineHeight: 1.6, margin: 0 }}>{b.desc}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
    {/* Light side */}
    <div style={{ background: '#faf9f6', padding: '4rem 3rem', display: 'flex', flexDirection: 'column', justifyContent: 'center', position: 'relative' }}>
      {/* Grid accent */}
      <div style={{ position: 'absolute', top: 0, left: 0, width: '1px', height: '100%', background: '#e8e6e2' }} />
      <div style={{ fontFamily: "'Share Tech Mono', monospace", fontSize: '0.65rem', letterSpacing: '0.2em', color: '#999999', marginBottom: '2rem', textTransform: 'uppercase' }}>The Lifestyle</div>
      <h2 style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: 'clamp(2rem, 4vw, 3rem)', fontWeight: 700, margin: '0 0 3rem', textTransform: 'uppercase', letterSpacing: '-0.02em', lineHeight: 1.1 }}>
        <span style={{ color: '#1a1a1a' }}>Beyond</span><br />
        <span style={{ color: '#4a4a4a' }}>Transportation</span>
      </h2>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
        {benefits.filter(b => b.category === 'Lifestyle').slice(0, 4).map((b, i) => (
          <div key={i} className="own-fade-up" style={{ display: 'flex', gap: '1.5rem', alignItems: 'flex-start', animationDelay: `${(i + 4) * 0.1}s` }}>
            <div style={{ fontFamily: "'Share Tech Mono', monospace", fontSize: '0.65rem', color: '#999999', letterSpacing: '0.1em', marginTop: '0.25rem' }}>{String(i + 5).padStart(2, '0')}</div>
            <div>
              <h4 style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: '1rem', fontWeight: 700, margin: '0 0 0.5rem', color: '#1a1a1a', textTransform: 'uppercase', letterSpacing: '0.02em' }}>{b.title}</h4>
              <p style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: '0.9rem', color: '#666666', lineHeight: 1.6, margin: 0 }}>{b.desc}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  </section>
);

// ============================================
// VERSION 47: Vertical Timeline
// ============================================
const Version47_VerticalTimeline = () => (
  <section className="own-section" style={{ padding: '6rem 2rem', background: '#ffffff', position: 'relative' }}>
    <style>{globalStyles}</style>
    <div style={{ maxWidth: '800px', margin: '0 auto' }}>
      {/* Header */}
      <div style={{ textAlign: 'center', marginBottom: '5rem' }}>
        <div style={{ fontFamily: "'Share Tech Mono', monospace", fontSize: '0.65rem', letterSpacing: '0.2em', color: '#999999', marginBottom: '1.5rem', textTransform: 'uppercase' }}>Your Journey Begins</div>
        <h2 style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: 'clamp(2rem, 4vw, 3rem)', fontWeight: 700, margin: 0, textTransform: 'uppercase', letterSpacing: '-0.02em' }}>
          <span style={{ color: '#1a1a1a' }}>Ownership</span>{' '}
          <span style={{ color: '#4a4a4a' }}>Benefits</span>{' '}
          <span style={{ color: '#7a7a7a' }}>Timeline</span>
        </h2>
      </div>
      {/* Timeline */}
      <div style={{ position: 'relative' }}>
        {/* Vertical line */}
        <div style={{ position: 'absolute', left: '50%', top: 0, bottom: 0, width: '1px', background: '#e8e6e2', transform: 'translateX(-50%)' }} />
        {benefits.slice(0, 10).map((b, i) => {
          const isLeft = i % 2 === 0;
          return (
            <div key={i} className="own-fade-up" style={{
              display: 'flex',
              justifyContent: isLeft ? 'flex-end' : 'flex-start',
              paddingRight: isLeft ? 'calc(50% + 2rem)' : 0,
              paddingLeft: isLeft ? 0 : 'calc(50% + 2rem)',
              marginBottom: '3rem',
              position: 'relative',
              animationDelay: `${i * 0.1}s`
            }}>
              {/* Node */}
              <div style={{
                position: 'absolute',
                left: '50%',
                top: '0.5rem',
                transform: 'translateX(-50%)',
                width: '12px',
                height: '12px',
                background: i === 0 ? '#1a1a1a' : '#faf9f6',
                border: '2px solid #1a1a1a',
                borderRadius: '50%'
              }} />
              {/* Content */}
              <div style={{ maxWidth: '320px', textAlign: isLeft ? 'right' : 'left' }}>
                <div style={{ fontFamily: "'Share Tech Mono', monospace", fontSize: '0.6rem', letterSpacing: '0.15em', color: '#999999', marginBottom: '0.5rem' }}>{String(i + 1).padStart(2, '0')}</div>
                <h4 style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: '1.1rem', fontWeight: 700, margin: '0 0 0.75rem', color: '#1a1a1a', textTransform: 'uppercase', letterSpacing: '0.02em' }}>{b.title}</h4>
                <p style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: '0.9rem', color: '#666666', lineHeight: 1.6, margin: 0 }}>{b.desc}</p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  </section>
);

// ============================================
// VERSION 48: Full Bleed Cards
// ============================================
const Version48_FullBleedCards = () => (
  <section className="own-section" style={{ background: '#faf9f6' }}>
    <style>{globalStyles}</style>
    {/* Header */}
    <div style={{ padding: '6rem 2rem 4rem', maxWidth: '1200px', margin: '0 auto', textAlign: 'center' }}>
      <div style={{ fontFamily: "'Share Tech Mono', monospace", fontSize: '0.65rem', letterSpacing: '0.2em', color: '#999999', marginBottom: '1.5rem', textTransform: 'uppercase' }}>Ownership Portfolio</div>
      <h2 style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: 'clamp(2rem, 5vw, 3.5rem)', fontWeight: 700, margin: 0, textTransform: 'uppercase', letterSpacing: '-0.02em' }}>
        <span style={{ color: '#1a1a1a' }}>Expansive</span>{' '}
        <span style={{ color: '#4a4a4a' }}>Horizons</span>
      </h2>
    </div>
    {/* Cards */}
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1px', background: '#e8e6e2' }}>
      {benefits.slice(0, 6).map((b, i) => {
        const isWide = i % 3 === 0;
        return (
          <div key={i} className="own-fade-up" style={{
            display: 'grid',
            gridTemplateColumns: isWide ? '1fr' : '1fr 1fr',
            background: i % 2 === 0 ? '#ffffff' : '#faf9f6',
            animationDelay: `${i * 0.1}s`
          }}>
            <div style={{
              padding: isWide ? '5rem 4rem' : '4rem 3rem',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
              maxWidth: isWide ? '800px' : 'none',
              margin: isWide ? '0 auto' : 0,
              textAlign: isWide ? 'center' : 'left'
            }}>
              <div style={{ fontFamily: "'Share Tech Mono', monospace", fontSize: '0.6rem', letterSpacing: '0.15em', color: '#999999', marginBottom: '1rem' }}>{String(i + 1).padStart(2, '0')} / {b.category.toUpperCase()}</div>
              <h3 style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: isWide ? 'clamp(1.75rem, 3vw, 2.5rem)' : '1.5rem', fontWeight: 700, margin: '0 0 1.5rem', color: '#1a1a1a', textTransform: 'uppercase', letterSpacing: '0.02em' }}>{b.title}</h3>
              <p style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: isWide ? '1.1rem' : '1rem', color: '#666666', lineHeight: 1.8, margin: 0, maxWidth: '500px' }}>{b.desc}</p>
              {isWide && (
                <div style={{ marginTop: '2rem', fontFamily: "'Share Tech Mono', monospace", fontSize: '2rem', fontWeight: 700, color: '#e8e6e2' }}>{b.stat}</div>
              )}
            </div>
            {!isWide && (
              <div style={{ background: '#1a1a1a', padding: '4rem 3rem', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <div style={{ textAlign: 'center' }}>
                  <div style={{ fontFamily: "'Share Tech Mono', monospace", fontSize: '3rem', fontWeight: 700, color: '#ffffff', marginBottom: '0.5rem' }}>{b.stat}</div>
                  <div style={{ fontFamily: "'Share Tech Mono', monospace", fontSize: '0.65rem', letterSpacing: '0.15em', color: 'rgba(255,255,255,0.4)', textTransform: 'uppercase' }}>{b.statLabel}</div>
                </div>
              </div>
            )}
          </div>
        );
      })}
    </div>
  </section>
);

// ============================================
// VERSION 49: Instrument Panel
// ============================================
const Version49_InstrumentPanel = () => (
  <section className="own-section" style={{ padding: '6rem 2rem', background: '#1a1a1a', position: 'relative' }}>
    <style>{globalStyles}</style>
    {/* Grid overlay */}
    <div style={{ position: 'absolute', inset: 0, backgroundImage: 'linear-gradient(rgba(255,255,255,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.03) 1px, transparent 1px)', backgroundSize: '40px 40px' }} />
    <div style={{ position: 'relative', zIndex: 2, maxWidth: '1100px', margin: '0 auto' }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '4rem', borderBottom: '1px solid rgba(255,255,255,0.1)', paddingBottom: '2rem' }}>
        <div>
          <div style={{ fontFamily: "'Share Tech Mono', monospace", fontSize: '0.6rem', letterSpacing: '0.2em', color: 'rgba(255,255,255,0.3)', marginBottom: '1rem', textTransform: 'uppercase' }}>Systems Overview</div>
          <h2 style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: 'clamp(2rem, 4vw, 3rem)', fontWeight: 700, margin: 0, textTransform: 'uppercase', letterSpacing: '-0.02em' }}>
            <span style={{ color: '#ffffff' }}>Ownership</span>{' '}
            <span style={{ color: 'rgba(255,255,255,0.5)' }}>Analytics</span>
          </h2>
        </div>
        <div style={{ fontFamily: "'Share Tech Mono', monospace", fontSize: '0.6rem', letterSpacing: '0.1em', color: 'rgba(255,255,255,0.3)' }}>
          REF: OWN-{new Date().getFullYear()}
        </div>
      </div>
      {/* Instrument gauges */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '1px', background: 'rgba(255,255,255,0.1)' }}>
        {benefits.slice(0, 8).map((b, i) => (
          <div key={i} className="own-fade-up" style={{
            background: '#1a1a1a',
            padding: '2rem 1.5rem',
            display: 'flex',
            flexDirection: 'column',
            animationDelay: `${i * 0.08}s`
          }}>
            {/* Gauge visualization */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
              <div style={{ fontFamily: "'Share Tech Mono', monospace", fontSize: '0.55rem', letterSpacing: '0.1em', color: 'rgba(255,255,255,0.3)' }}>{String(i + 1).padStart(2, '0')}</div>
              <div style={{ width: '60px', height: '60px', border: '2px solid rgba(255,255,255,0.15)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative' }}>
                <div style={{ position: 'absolute', top: '4px', left: '50%', transform: 'translateX(-50%)', width: '2px', height: '8px', background: 'rgba(255,255,255,0.3)' }} />
                <div style={{ fontFamily: "'Share Tech Mono', monospace", fontSize: '0.9rem', fontWeight: 700, color: '#ffffff' }}>{b.stat}</div>
              </div>
            </div>
            <h4 style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: '0.85rem', fontWeight: 700, margin: '0 0 0.5rem', color: '#ffffff', textTransform: 'uppercase', letterSpacing: '0.05em' }}>{b.title}</h4>
            <p style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: '0.75rem', color: 'rgba(255,255,255,0.4)', lineHeight: 1.5, margin: '0 0 auto' }}>{b.desc.substring(0, 70)}...</p>
            <div style={{ fontFamily: "'Share Tech Mono', monospace", fontSize: '0.55rem', letterSpacing: '0.1em', color: 'rgba(255,255,255,0.2)', marginTop: '1rem', textTransform: 'uppercase' }}>{b.statLabel}</div>
          </div>
        ))}
      </div>
      {/* Status bar */}
      <div style={{ marginTop: '2rem', padding: '1rem 1.5rem', background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.05)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div style={{ fontFamily: "'Share Tech Mono', monospace", fontSize: '0.6rem', letterSpacing: '0.15em', color: 'rgba(255,255,255,0.3)', textTransform: 'uppercase' }}>Total Benefits: {benefits.length}</div>
        <div style={{ display: 'flex', gap: '1.5rem' }}>
          {['Practical', 'Experience', 'Lifestyle'].map(cat => (
            <div key={cat} style={{ fontFamily: "'Share Tech Mono', monospace", fontSize: '0.55rem', letterSpacing: '0.1em', color: 'rgba(255,255,255,0.2)' }}>{cat.toUpperCase()}: {benefits.filter(b => b.category === cat).length}</div>
          ))}
        </div>
      </div>
    </div>
  </section>
);

// ============================================
// VERSION 50: Comprehensive Showcase
// ============================================
const Version50_ComprehensiveShowcase = () => (
  <section className="own-section" style={{ background: '#faf9f6', position: 'relative' }}>
    <style>{globalStyles}</style>
    {/* Grid lines */}
    <div style={{ position: 'absolute', inset: 0, backgroundImage: 'linear-gradient(#e8e6e2 1px, transparent 1px), linear-gradient(90deg, #e8e6e2 1px, transparent 1px)', backgroundSize: '100px 100px', opacity: 0.4 }} />

    <div style={{ position: 'relative', zIndex: 2 }}>
      {/* Hero header */}
      <div style={{ padding: '8rem 2rem 6rem', textAlign: 'center', borderBottom: '1px solid #e8e6e2' }}>
        <div style={{ fontFamily: "'Share Tech Mono', monospace", fontSize: '0.65rem', letterSpacing: '0.25em', color: '#999999', marginBottom: '2rem', textTransform: 'uppercase' }}>The Complete Guide</div>
        <h1 style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: 'clamp(3rem, 7vw, 5rem)', fontWeight: 700, margin: '0 0 2rem', textTransform: 'uppercase', letterSpacing: '-0.03em', lineHeight: 0.95 }}>
          <span style={{ color: '#1a1a1a' }}>Helicopter</span><br />
          <span style={{ color: '#4a4a4a' }}>Ownership</span>
        </h1>
        <p style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: '1.1rem', color: '#666666', maxWidth: '550px', margin: '0 auto', lineHeight: 1.8 }}>
          A comprehensive examination of why private helicopter ownership represents the pinnacle of personal aviation.
        </p>
        <div style={{ display: 'flex', justifyContent: 'center', gap: '3rem', marginTop: '3rem' }}>
          {['Practical', 'Experience', 'Lifestyle'].map((cat, i) => (
            <div key={cat} style={{ textAlign: 'center' }}>
              <div style={{ fontFamily: "'Share Tech Mono', monospace", fontSize: '2rem', fontWeight: 700, color: '#1a1a1a' }}>{String(benefits.filter(b => b.category === cat).length).padStart(2, '0')}</div>
              <div style={{ fontFamily: "'Share Tech Mono', monospace", fontSize: '0.6rem', letterSpacing: '0.15em', color: '#999999', textTransform: 'uppercase' }}>{cat}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Featured benefit */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr' }}>
        <div style={{ background: '#1a1a1a', padding: '5rem 4rem', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
          <div style={{ fontFamily: "'Share Tech Mono', monospace", fontSize: '0.6rem', letterSpacing: '0.2em', color: 'rgba(255,255,255,0.3)', marginBottom: '2rem', textTransform: 'uppercase' }}>Featured / 01</div>
          <h2 style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: 'clamp(2rem, 4vw, 2.5rem)', fontWeight: 700, margin: '0 0 1.5rem', color: '#ffffff', textTransform: 'uppercase', letterSpacing: '0.02em' }}>{benefits[0].title}</h2>
          <p style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: '1.1rem', color: 'rgba(255,255,255,0.6)', lineHeight: 1.8, margin: 0 }}>{benefits[0].desc}</p>
        </div>
        <div style={{ background: '#ffffff', padding: '5rem 4rem', display: 'flex', alignItems: 'center', justifyContent: 'center', borderBottom: '1px solid #e8e6e2' }}>
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontFamily: "'Share Tech Mono', monospace", fontSize: '5rem', fontWeight: 700, color: '#e8e6e2' }}>{benefits[0].stat}</div>
            <div style={{ fontFamily: "'Share Tech Mono', monospace", fontSize: '0.7rem', letterSpacing: '0.15em', color: '#999999', textTransform: 'uppercase' }}>{benefits[0].statLabel}</div>
          </div>
        </div>
      </div>

      {/* Benefits grid */}
      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '4rem 2rem' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1px', background: '#e8e6e2' }}>
          {benefits.slice(1).map((b, i) => (
            <div key={i} className="own-fade-up" style={{
              background: '#ffffff',
              padding: '2.5rem',
              animationDelay: `${i * 0.05}s`
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1.5rem' }}>
                <div style={{ fontFamily: "'Share Tech Mono', monospace", fontSize: '0.6rem', letterSpacing: '0.1em', color: '#999999' }}>{String(i + 2).padStart(2, '0')}</div>
                <div style={{ fontFamily: "'Share Tech Mono', monospace", fontSize: '0.55rem', letterSpacing: '0.1em', color: '#cccccc', textTransform: 'uppercase' }}>{b.category}</div>
              </div>
              <h4 style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: '1.1rem', fontWeight: 700, margin: '0 0 1rem', color: '#1a1a1a', textTransform: 'uppercase', letterSpacing: '0.02em' }}>{b.title}</h4>
              <p style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: '0.9rem', color: '#666666', lineHeight: 1.6, margin: '0 0 1.5rem' }}>{b.desc}</p>
              <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.5rem', paddingTop: '1rem', borderTop: '1px solid #e8e6e2' }}>
                <span style={{ fontFamily: "'Share Tech Mono', monospace", fontSize: '1.25rem', fontWeight: 700, color: '#1a1a1a' }}>{b.stat}</span>
                <span style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: '0.65rem', color: '#999999', textTransform: 'uppercase', letterSpacing: '0.05em' }}>{b.statLabel}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* CTA */}
      <div style={{ padding: '4rem 2rem 6rem', textAlign: 'center', borderTop: '1px solid #e8e6e2' }}>
        <a href="#" style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '1rem',
          padding: '1rem 2rem',
          background: '#1a1a1a',
          color: '#ffffff',
          textDecoration: 'none',
          fontFamily: "'Space Grotesk', sans-serif",
          fontSize: '0.75rem',
          fontWeight: 400,
          textTransform: 'uppercase',
          letterSpacing: '0.1em',
          transition: 'background 0.3s ease'
        }}>
          Begin Your Journey <span style={{ fontSize: '1rem', marginLeft: '0.5rem' }}>→</span>
        </a>
      </div>
    </div>
  </section>
);

// ============================================
// VERSION 51: Sticky Image Scroll (Enhanced v32)
// Sticky left with image that changes + read tracking
// ============================================
const Version51_StickyImageScroll = () => {
  const [activeIndex, setActiveIndex] = useState(0);
  const [readItems, setReadItems] = useState(new Set());
  const containerRef = React.useRef(null);
  const images = [
    '/assets/images/lifestyle/heli-sunset.jpg',
    '/assets/images/lifestyle/heli-alps.jpg',
    '/assets/images/lifestyle/heli-yacht.jpg',
    '/assets/images/lifestyle/heli-city.jpg',
  ];

  useEffect(() => {
    const handleScroll = () => {
      if (!containerRef.current) return;
      const items = containerRef.current.querySelectorAll('.scroll-item');
      items.forEach((item, idx) => {
        const rect = item.getBoundingClientRect();
        const viewportCenter = window.innerHeight / 2;
        if (rect.top < viewportCenter && rect.bottom > viewportCenter) {
          setActiveIndex(idx);
        }
        if (rect.bottom < viewportCenter) {
          setReadItems(prev => new Set([...prev, idx]));
        }
      });
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <section ref={containerRef} className="own-section" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', minHeight: '100vh' }}>
      <style>{globalStyles}</style>
      {/* Sticky Left */}
      <div style={{ position: 'sticky', top: 0, height: '100vh', background: '#1a1a1a', display: 'flex', flexDirection: 'column', justifyContent: 'center', padding: '4rem' }}>
        <div style={{ fontFamily: "'Share Tech Mono', monospace", fontSize: '0.65rem', letterSpacing: '0.2em', color: 'rgba(255,255,255,0.4)', marginBottom: '2rem', textTransform: 'uppercase' }}>
          {String(activeIndex + 1).padStart(2, '0')} / {String(benefits.length).padStart(2, '0')}
        </div>
        <h2 style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: 'clamp(2rem, 4vw, 3rem)', fontWeight: 700, margin: '0 0 2rem', textTransform: 'uppercase', letterSpacing: '-0.02em', lineHeight: 1.1 }}>
          <span style={{ color: '#ffffff' }}>Ownership</span><br />
          <span style={{ color: 'rgba(255,255,255,0.5)' }}>Benefits</span>
        </h2>
        {/* Dynamic image */}
        <div style={{ width: '100%', height: '250px', background: '#2a2a2a', borderRadius: '8px', overflow: 'hidden', position: 'relative' }}>
          <div style={{ position: 'absolute', inset: 0, background: `url(${images[activeIndex % images.length]}) center/cover`, transition: 'opacity 0.5s ease', opacity: 1 }} />
          <div style={{ position: 'absolute', bottom: '1rem', left: '1rem', fontFamily: "'Share Tech Mono', monospace", fontSize: '0.6rem', letterSpacing: '0.1em', color: 'rgba(255,255,255,0.5)', textTransform: 'uppercase' }}>
            {benefits[activeIndex]?.category}
          </div>
        </div>
      </div>
      {/* Scrolling Right */}
      <div style={{ background: '#faf9f6', padding: '6rem 3rem' }}>
        {benefits.map((b, i) => (
          <div key={i} className="scroll-item" style={{
            padding: '3rem 2rem',
            marginBottom: '2rem',
            background: readItems.has(i) ? '#f0efec' : '#ffffff',
            borderLeft: activeIndex === i ? '3px solid #1a1a1a' : '3px solid transparent',
            transition: 'all 0.4s ease'
          }}>
            <div style={{ fontFamily: "'Share Tech Mono', monospace", fontSize: '0.6rem', letterSpacing: '0.15em', color: '#999999', marginBottom: '1rem' }}>{String(i + 1).padStart(2, '0')}</div>
            <h3 style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: '1.5rem', fontWeight: 700, margin: '0 0 1rem', color: '#1a1a1a', textTransform: 'uppercase' }}>{b.title}</h3>
            <p style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: '1rem', color: '#666666', lineHeight: 1.8, margin: 0 }}>{b.desc}</p>
          </div>
        ))}
      </div>
    </section>
  );
};

// ============================================
// VERSION 52: Read Progress Tracker
// Items turn grey as you scroll past them
// ============================================
const Version52_ReadProgressTracker = () => {
  const [readItems, setReadItems] = useState(new Set());
  const containerRef = React.useRef(null);

  useEffect(() => {
    const handleScroll = () => {
      if (!containerRef.current) return;
      const items = containerRef.current.querySelectorAll('.benefit-item');
      items.forEach((item, idx) => {
        const rect = item.getBoundingClientRect();
        if (rect.top < window.innerHeight * 0.3) {
          setReadItems(prev => new Set([...prev, idx]));
        }
      });
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <section ref={containerRef} className="own-section" style={{ padding: '6rem 2rem', background: '#faf9f6' }}>
      <style>{globalStyles}</style>
      <div style={{ maxWidth: '900px', margin: '0 auto' }}>
        {/* Header with gradient */}
        <div style={{ textAlign: 'center', marginBottom: '4rem' }}>
          <div style={{ fontFamily: "'Share Tech Mono', monospace", fontSize: '0.65rem', letterSpacing: '0.2em', color: '#999999', marginBottom: '1.5rem', textTransform: 'uppercase' }}>
            {readItems.size} / {benefits.length} Explored
          </div>
          <h2 style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: 'clamp(2rem, 5vw, 3.5rem)', fontWeight: 700, margin: 0, textTransform: 'uppercase', letterSpacing: '-0.02em' }}>
            <span style={{ color: '#1a1a1a' }}>Discover</span>{' '}
            <span style={{ color: '#4a4a4a' }}>Your</span>{' '}
            <span style={{ color: '#7a7a7a' }}>Benefits</span>
          </h2>
          {/* Progress bar */}
          <div style={{ width: '200px', height: '3px', background: '#e8e6e2', margin: '2rem auto 0', borderRadius: '2px', overflow: 'hidden' }}>
            <div style={{ width: `${(readItems.size / benefits.length) * 100}%`, height: '100%', background: '#1a1a1a', transition: 'width 0.3s ease' }} />
          </div>
        </div>
        {/* Benefits list */}
        {benefits.map((b, i) => (
          <div key={i} className="benefit-item" style={{
            padding: '2.5rem',
            marginBottom: '1rem',
            background: readItems.has(i) ? '#f0efec' : '#ffffff',
            border: '1px solid #e8e6e2',
            transition: 'all 0.5s ease',
            opacity: readItems.has(i) ? 0.7 : 1
          }}>
            <div style={{ display: 'flex', gap: '2rem', alignItems: 'flex-start' }}>
              <div style={{ fontFamily: "'Share Tech Mono', monospace", fontSize: '1.5rem', fontWeight: 700, color: readItems.has(i) ? '#cccccc' : '#1a1a1a', transition: 'color 0.3s' }}>{String(i + 1).padStart(2, '0')}</div>
              <div style={{ flex: 1 }}>
                <h3 style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: '1.25rem', fontWeight: 700, margin: '0 0 0.75rem', color: '#1a1a1a', textTransform: 'uppercase' }}>{b.title}</h3>
                <p style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: '1rem', color: '#666666', lineHeight: 1.7, margin: 0 }}>{b.desc}</p>
              </div>
              {readItems.has(i) && <span style={{ color: '#999999', fontSize: '1.25rem' }}>✓</span>}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

// ============================================
// VERSION 53: Gradient Headlines Focus
// Large gradient text with clean layout
// ============================================
const Version53_GradientHeadlines = () => (
  <section className="own-section" style={{ padding: '6rem 2rem', background: '#ffffff', position: 'relative' }}>
    <style>{globalStyles}</style>
    <div style={{ position: 'absolute', inset: 0, backgroundImage: 'linear-gradient(#e8e6e2 1px, transparent 1px)', backgroundSize: '100% 80px', opacity: 0.3 }} />
    <div style={{ position: 'relative', zIndex: 2, maxWidth: '1100px', margin: '0 auto' }}>
      {/* Hero headline */}
      <div style={{ marginBottom: '6rem', textAlign: 'center' }}>
        <h1 style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: 'clamp(3rem, 8vw, 6rem)', fontWeight: 700, margin: 0, textTransform: 'uppercase', letterSpacing: '-0.03em', lineHeight: 0.9 }}>
          <span style={{ color: '#1a1a1a' }}>Why</span><br />
          <span style={{ color: '#3a3a3a' }}>Own A</span><br />
          <span style={{ color: '#5a5a5a' }}>Helicopter</span>
        </h1>
      </div>
      {/* Benefits in large format */}
      {benefits.slice(0, 6).map((b, i) => (
        <div key={i} className="own-fade-up" style={{
          display: 'grid',
          gridTemplateColumns: '120px 1fr',
          gap: '3rem',
          padding: '3rem 0',
          borderBottom: '1px solid #e8e6e2',
          animationDelay: `${i * 0.1}s`
        }}>
          <div style={{ fontFamily: "'Share Tech Mono', monospace", fontSize: '3rem', fontWeight: 700, color: '#e8e6e2' }}>{String(i + 1).padStart(2, '0')}</div>
          <div>
            <h3 style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: 'clamp(1.5rem, 3vw, 2rem)', fontWeight: 700, margin: '0 0 1rem', textTransform: 'uppercase', letterSpacing: '-0.01em' }}>
              <span style={{ color: '#1a1a1a' }}>{b.title.split(' ')[0]}</span>{' '}
              <span style={{ color: '#6a6a6a' }}>{b.title.split(' ').slice(1).join(' ')}</span>
            </h3>
            <p style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: '1.1rem', color: '#666666', lineHeight: 1.8, margin: 0, maxWidth: '600px' }}>{b.desc}</p>
          </div>
        </div>
      ))}
    </div>
  </section>
);

// ============================================
// VERSION 54: Hover Card Expand (Enhanced v42)
// Cards expand with more detail on hover
// ============================================
const Version54_HoverCardExpand = () => {
  const [hoveredIndex, setHoveredIndex] = useState(null);
  return (
    <section className="own-section" style={{ padding: '6rem 2rem', background: '#faf9f6' }}>
      <style>{globalStyles}</style>
      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
        <div style={{ textAlign: 'center', marginBottom: '4rem' }}>
          <h2 style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: 'clamp(2rem, 4vw, 3rem)', fontWeight: 700, margin: 0, textTransform: 'uppercase', letterSpacing: '-0.02em' }}>
            <span style={{ color: '#1a1a1a' }}>Hover</span>{' '}
            <span style={{ color: '#4a4a4a' }}>To</span>{' '}
            <span style={{ color: '#7a7a7a' }}>Explore</span>
          </h2>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1px', background: '#e8e6e2' }}>
          {benefits.slice(0, 9).map((b, i) => (
            <div
              key={i}
              onMouseEnter={() => setHoveredIndex(i)}
              onMouseLeave={() => setHoveredIndex(null)}
              style={{
                background: '#ffffff',
                padding: hoveredIndex === i ? '3rem 2rem' : '2rem',
                minHeight: hoveredIndex === i ? '280px' : '180px',
                transition: 'all 0.4s cubic-bezier(0.16, 1, 0.3, 1)',
                cursor: 'pointer',
                position: 'relative',
                zIndex: hoveredIndex === i ? 10 : 1,
                boxShadow: hoveredIndex === i ? '0 20px 60px rgba(0,0,0,0.15)' : 'none'
              }}
            >
              <div style={{ fontFamily: "'Share Tech Mono', monospace", fontSize: '0.6rem', letterSpacing: '0.15em', color: '#999999', marginBottom: '1rem' }}>{String(i + 1).padStart(2, '0')}</div>
              <h4 style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: hoveredIndex === i ? '1.5rem' : '1.1rem', fontWeight: 700, margin: '0 0 1rem', color: '#1a1a1a', textTransform: 'uppercase', transition: 'font-size 0.3s' }}>{b.title}</h4>
              <p style={{
                fontFamily: "'Space Grotesk', sans-serif",
                fontSize: '0.95rem',
                color: '#666666',
                lineHeight: 1.6,
                margin: 0,
                maxHeight: hoveredIndex === i ? '200px' : '0',
                overflow: 'hidden',
                opacity: hoveredIndex === i ? 1 : 0,
                transition: 'all 0.4s ease'
              }}>{b.desc}</p>
              {hoveredIndex === i && (
                <div style={{ marginTop: '1.5rem', fontFamily: "'Share Tech Mono', monospace", fontSize: '1.5rem', fontWeight: 700, color: '#e8e6e2' }}>{b.stat}</div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

// ============================================
// VERSION 55: Scroll-Synced Image Gallery
// Image changes based on scroll position
// ============================================
const Version55_ScrollSyncedGallery = () => {
  const [activeIndex, setActiveIndex] = useState(0);
  const containerRef = React.useRef(null);

  useEffect(() => {
    const handleScroll = () => {
      if (!containerRef.current) return;
      const items = containerRef.current.querySelectorAll('.gallery-item');
      items.forEach((item, idx) => {
        const rect = item.getBoundingClientRect();
        if (rect.top < window.innerHeight * 0.5 && rect.bottom > window.innerHeight * 0.5) {
          setActiveIndex(idx);
        }
      });
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const images = [
    'linear-gradient(135deg, #1a1a1a 0%, #3a3a3a 100%)',
    'linear-gradient(135deg, #2a2a4a 0%, #4a4a6a 100%)',
    'linear-gradient(135deg, #3a2a2a 0%, #5a4a4a 100%)',
    'linear-gradient(135deg, #2a3a2a 0%, #4a5a4a 100%)',
  ];

  return (
    <section ref={containerRef} className="own-section" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr' }}>
      <style>{globalStyles}</style>
      {/* Sticky image panel */}
      <div style={{ position: 'sticky', top: 0, height: '100vh', background: images[activeIndex % images.length], transition: 'background 0.6s ease', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ textAlign: 'center', color: '#ffffff' }}>
          <div style={{ fontFamily: "'Share Tech Mono', monospace", fontSize: '0.7rem', letterSpacing: '0.2em', marginBottom: '1rem', opacity: 0.5 }}>BENEFIT {String(activeIndex + 1).padStart(2, '0')}</div>
          <h3 style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: 'clamp(2rem, 4vw, 3rem)', fontWeight: 700, margin: 0, textTransform: 'uppercase' }}>{benefits[activeIndex]?.title}</h3>
        </div>
      </div>
      {/* Scrolling content */}
      <div style={{ background: '#faf9f6' }}>
        {benefits.map((b, i) => (
          <div key={i} className="gallery-item" style={{
            minHeight: '100vh',
            padding: '4rem 3rem',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            borderBottom: '1px solid #e8e6e2',
            background: activeIndex === i ? '#ffffff' : '#faf9f6',
            transition: 'background 0.3s'
          }}>
            <div style={{ fontFamily: "'Share Tech Mono', monospace", fontSize: '0.6rem', letterSpacing: '0.15em', color: '#999999', marginBottom: '1.5rem' }}>{b.category.toUpperCase()}</div>
            <h3 style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: '1.75rem', fontWeight: 700, margin: '0 0 1.5rem', textTransform: 'uppercase' }}>
              <span style={{ color: '#1a1a1a' }}>{b.title.split(' ')[0]}</span>{' '}
              <span style={{ color: '#5a5a5a' }}>{b.title.split(' ').slice(1).join(' ')}</span>
            </h3>
            <p style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: '1.1rem', color: '#666666', lineHeight: 1.8, margin: 0 }}>{b.desc}</p>
            <div style={{ marginTop: '2rem', fontFamily: "'Share Tech Mono', monospace", fontSize: '2rem', fontWeight: 700, color: '#e8e6e2' }}>{b.stat}</div>
          </div>
        ))}
      </div>
    </section>
  );
};

// ============================================
// VERSION 56: Hover Slide Reveal
// Content slides in from side on hover
// ============================================
const Version56_HoverSlideReveal = () => {
  const [hoveredIndex, setHoveredIndex] = useState(null);
  return (
    <section className="own-section" style={{ padding: '6rem 2rem', background: '#1a1a1a' }}>
      <style>{globalStyles}</style>
      <div style={{ maxWidth: '1000px', margin: '0 auto' }}>
        <div style={{ textAlign: 'center', marginBottom: '4rem' }}>
          <h2 style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: 'clamp(2rem, 4vw, 3rem)', fontWeight: 700, margin: 0, textTransform: 'uppercase' }}>
            <span style={{ color: '#ffffff' }}>Slide</span>{' '}
            <span style={{ color: 'rgba(255,255,255,0.5)' }}>To Reveal</span>
          </h2>
        </div>
        {benefits.slice(0, 8).map((b, i) => (
          <div
            key={i}
            onMouseEnter={() => setHoveredIndex(i)}
            onMouseLeave={() => setHoveredIndex(null)}
            style={{
              display: 'flex',
              alignItems: 'center',
              padding: '1.5rem 0',
              borderBottom: '1px solid rgba(255,255,255,0.1)',
              cursor: 'pointer',
              overflow: 'hidden'
            }}
          >
            <div style={{ fontFamily: "'Share Tech Mono', monospace", fontSize: '0.6rem', letterSpacing: '0.1em', color: 'rgba(255,255,255,0.3)', width: '40px' }}>{String(i + 1).padStart(2, '0')}</div>
            <h4 style={{
              fontFamily: "'Space Grotesk', sans-serif",
              fontSize: '1.25rem',
              fontWeight: 700,
              margin: 0,
              color: '#ffffff',
              textTransform: 'uppercase',
              flex: '0 0 250px',
              transition: 'transform 0.4s cubic-bezier(0.16, 1, 0.3, 1)',
              transform: hoveredIndex === i ? 'translateX(-20px)' : 'translateX(0)'
            }}>{b.title}</h4>
            <p style={{
              fontFamily: "'Space Grotesk', sans-serif",
              fontSize: '0.95rem',
              color: 'rgba(255,255,255,0.5)',
              margin: 0,
              flex: 1,
              opacity: hoveredIndex === i ? 1 : 0,
              transform: hoveredIndex === i ? 'translateX(0)' : 'translateX(30px)',
              transition: 'all 0.4s cubic-bezier(0.16, 1, 0.3, 1)'
            }}>{b.desc}</p>
          </div>
        ))}
      </div>
    </section>
  );
};

// ============================================
// VERSION 57: Category Sections with Gradient
// Each category has its own gradient header
// ============================================
const Version57_CategoryGradientSections = () => {
  const categories = ['Practical', 'Experience', 'Lifestyle'];
  return (
    <section className="own-section" style={{ background: '#faf9f6' }}>
      <style>{globalStyles}</style>
      {categories.map((cat, catIdx) => {
        const catBenefits = benefits.filter(b => b.category === cat);
        return (
          <div key={cat} style={{ padding: '6rem 2rem', borderBottom: catIdx < 2 ? '1px solid #e8e6e2' : 'none' }}>
            <div style={{ maxWidth: '1000px', margin: '0 auto' }}>
              <div style={{ marginBottom: '3rem' }}>
                <div style={{ fontFamily: "'Share Tech Mono', monospace", fontSize: '0.6rem', letterSpacing: '0.2em', color: '#999999', marginBottom: '1rem' }}>SECTION {String(catIdx + 1).padStart(2, '0')}</div>
                <h2 style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: 'clamp(2rem, 5vw, 3.5rem)', fontWeight: 700, margin: 0, textTransform: 'uppercase', letterSpacing: '-0.02em' }}>
                  <span style={{ color: '#1a1a1a' }}>The</span>{' '}
                  <span style={{ color: '#4a4a4a' }}>{cat}</span>{' '}
                  <span style={{ color: '#7a7a7a' }}>Advantage</span>
                </h2>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '1.5rem' }}>
                {catBenefits.map((b, i) => (
                  <div key={i} className="own-fade-up" style={{
                    padding: '2rem',
                    background: '#ffffff',
                    border: '1px solid #e8e6e2',
                    animationDelay: `${i * 0.1}s`
                  }}>
                    <div style={{ fontFamily: "'Share Tech Mono', monospace", fontSize: '0.55rem', letterSpacing: '0.1em', color: '#999999', marginBottom: '1rem' }}>{String(i + 1).padStart(2, '0')}</div>
                    <h4 style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: '1.1rem', fontWeight: 700, margin: '0 0 0.75rem', color: '#1a1a1a', textTransform: 'uppercase' }}>{b.title}</h4>
                    <p style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: '0.95rem', color: '#666666', lineHeight: 1.6, margin: 0 }}>{b.desc}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        );
      })}
    </section>
  );
};

// ============================================
// VERSION 58: Dual Panel Scroll Sync
// Two panels that scroll in sync
// ============================================
const Version58_DualPanelScroll = () => {
  const [scrollProgress, setScrollProgress] = useState(0);
  const containerRef = React.useRef(null);

  useEffect(() => {
    const handleScroll = () => {
      if (!containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      const progress = Math.max(0, Math.min(1, -rect.top / (rect.height - window.innerHeight)));
      setScrollProgress(progress);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const activeIndex = Math.floor(scrollProgress * benefits.length);

  return (
    <section ref={containerRef} className="own-section" style={{ minHeight: `${benefits.length * 100}vh`, position: 'relative' }}>
      <style>{globalStyles}</style>
      <div style={{ position: 'sticky', top: 0, height: '100vh', display: 'grid', gridTemplateColumns: '1fr 1fr' }}>
        {/* Left - Numbers */}
        <div style={{ background: '#1a1a1a', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontFamily: "'Share Tech Mono', monospace", fontSize: 'clamp(6rem, 15vw, 12rem)', fontWeight: 700, color: 'rgba(255,255,255,0.1)', lineHeight: 1 }}>{String(activeIndex + 1).padStart(2, '0')}</div>
            <div style={{ fontFamily: "'Share Tech Mono', monospace", fontSize: '0.7rem', letterSpacing: '0.2em', color: 'rgba(255,255,255,0.4)', marginTop: '1rem' }}>OF {String(benefits.length).padStart(2, '0')}</div>
          </div>
        </div>
        {/* Right - Content */}
        <div style={{ background: '#faf9f6', display: 'flex', alignItems: 'center', padding: '4rem' }}>
          <div>
            <div style={{ fontFamily: "'Share Tech Mono', monospace", fontSize: '0.6rem', letterSpacing: '0.15em', color: '#999999', marginBottom: '1.5rem' }}>{benefits[activeIndex]?.category?.toUpperCase()}</div>
            <h3 style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: 'clamp(1.5rem, 3vw, 2.5rem)', fontWeight: 700, margin: '0 0 1.5rem', textTransform: 'uppercase', letterSpacing: '-0.01em' }}>
              <span style={{ color: '#1a1a1a' }}>{benefits[activeIndex]?.title.split(' ')[0]}</span>{' '}
              <span style={{ color: '#5a5a5a' }}>{benefits[activeIndex]?.title.split(' ').slice(1).join(' ')}</span>
            </h3>
            <p style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: '1.1rem', color: '#666666', lineHeight: 1.8, margin: 0 }}>{benefits[activeIndex]?.desc}</p>
          </div>
        </div>
      </div>
    </section>
  );
};

// ============================================
// VERSION 59: Hover Border Animation
// Animated borders on hover
// ============================================
const Version59_HoverBorderAnimation = () => {
  const [hoveredIndex, setHoveredIndex] = useState(null);
  return (
    <section className="own-section" style={{ padding: '6rem 2rem', background: '#ffffff' }}>
      <style>{globalStyles}{`
        @keyframes borderDraw {
          0% { stroke-dashoffset: 1000; }
          100% { stroke-dashoffset: 0; }
        }
      `}</style>
      <div style={{ maxWidth: '1100px', margin: '0 auto' }}>
        <div style={{ textAlign: 'center', marginBottom: '4rem' }}>
          <h2 style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: 'clamp(2rem, 4vw, 3rem)', fontWeight: 700, margin: 0, textTransform: 'uppercase' }}>
            <span style={{ color: '#1a1a1a' }}>Interactive</span>{' '}
            <span style={{ color: '#5a5a5a' }}>Benefits</span>
          </h2>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '2rem' }}>
          {benefits.slice(0, 9).map((b, i) => (
            <div
              key={i}
              onMouseEnter={() => setHoveredIndex(i)}
              onMouseLeave={() => setHoveredIndex(null)}
              style={{
                position: 'relative',
                padding: '2.5rem 2rem',
                background: hoveredIndex === i ? '#faf9f6' : '#ffffff',
                transition: 'background 0.3s',
                cursor: 'pointer'
              }}
            >
              {/* Animated border */}
              <svg style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', pointerEvents: 'none' }}>
                <rect
                  x="1" y="1"
                  width="calc(100% - 2px)" height="calc(100% - 2px)"
                  fill="none"
                  stroke={hoveredIndex === i ? '#1a1a1a' : '#e8e6e2'}
                  strokeWidth="2"
                  strokeDasharray="1000"
                  strokeDashoffset={hoveredIndex === i ? 0 : 1000}
                  style={{ transition: 'stroke-dashoffset 0.6s ease, stroke 0.3s' }}
                />
              </svg>
              <div style={{ fontFamily: "'Share Tech Mono', monospace", fontSize: '0.6rem', letterSpacing: '0.15em', color: '#999999', marginBottom: '1rem' }}>{String(i + 1).padStart(2, '0')}</div>
              <h4 style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: '1.15rem', fontWeight: 700, margin: '0 0 1rem', color: '#1a1a1a', textTransform: 'uppercase' }}>{b.title}</h4>
              <p style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: '0.9rem', color: '#666666', lineHeight: 1.6, margin: 0 }}>{b.desc.substring(0, 80)}...</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

// ============================================
// VERSION 60: Progressive Reveal Timeline
// Items reveal with scroll + stay grey
// ============================================
const Version60_ProgressiveReveal = () => {
  const [revealedItems, setRevealedItems] = useState(new Set());
  const containerRef = React.useRef(null);

  useEffect(() => {
    const handleScroll = () => {
      if (!containerRef.current) return;
      const items = containerRef.current.querySelectorAll('.reveal-item');
      items.forEach((item, idx) => {
        const rect = item.getBoundingClientRect();
        if (rect.top < window.innerHeight * 0.7) {
          setRevealedItems(prev => new Set([...prev, idx]));
        }
      });
    };
    window.addEventListener('scroll', handleScroll);
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <section ref={containerRef} className="own-section" style={{ padding: '6rem 2rem', background: '#faf9f6' }}>
      <style>{globalStyles}</style>
      <div style={{ maxWidth: '800px', margin: '0 auto' }}>
        <div style={{ textAlign: 'center', marginBottom: '5rem' }}>
          <h2 style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: 'clamp(2rem, 5vw, 3.5rem)', fontWeight: 700, margin: 0, textTransform: 'uppercase', letterSpacing: '-0.02em' }}>
            <span style={{ color: '#1a1a1a' }}>Scroll</span>{' '}
            <span style={{ color: '#4a4a4a' }}>To</span>{' '}
            <span style={{ color: '#7a7a7a' }}>Discover</span>
          </h2>
        </div>
        <div style={{ position: 'relative' }}>
          {/* Timeline line */}
          <div style={{ position: 'absolute', left: '24px', top: 0, bottom: 0, width: '2px', background: '#e8e6e2' }}>
            <div style={{ width: '100%', background: '#1a1a1a', transition: 'height 0.3s', height: `${(revealedItems.size / benefits.length) * 100}%` }} />
          </div>
          {benefits.map((b, i) => (
            <div key={i} className="reveal-item" style={{
              display: 'flex',
              gap: '2rem',
              marginBottom: '2rem',
              paddingLeft: '60px',
              position: 'relative',
              opacity: revealedItems.has(i) ? 1 : 0.3,
              transform: revealedItems.has(i) ? 'translateX(0)' : 'translateX(-20px)',
              transition: 'all 0.5s cubic-bezier(0.16, 1, 0.3, 1)'
            }}>
              {/* Dot */}
              <div style={{
                position: 'absolute',
                left: '16px',
                top: '8px',
                width: '18px',
                height: '18px',
                borderRadius: '50%',
                background: revealedItems.has(i) ? '#1a1a1a' : '#ffffff',
                border: '2px solid #1a1a1a',
                transition: 'background 0.3s'
              }} />
              <div style={{
                padding: '1.5rem 2rem',
                background: revealedItems.has(i) ? '#f0efec' : '#ffffff',
                border: '1px solid #e8e6e2',
                flex: 1,
                transition: 'background 0.5s'
              }}>
                <div style={{ fontFamily: "'Share Tech Mono', monospace", fontSize: '0.55rem', letterSpacing: '0.1em', color: '#999999', marginBottom: '0.75rem' }}>{String(i + 1).padStart(2, '0')} • {b.category.toUpperCase()}</div>
                <h4 style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: '1.1rem', fontWeight: 700, margin: '0 0 0.5rem', color: '#1a1a1a', textTransform: 'uppercase' }}>{b.title}</h4>
                <p style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: '0.95rem', color: '#666666', lineHeight: 1.6, margin: 0 }}>{b.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

// ============================================
// VERSION 61: Sticky Header + Scroll List
// Gradient header stays, list scrolls with read state
// ============================================
const Version61_StickyHeaderScroll = () => {
  const [readItems, setReadItems] = useState(new Set());
  const containerRef = React.useRef(null);

  useEffect(() => {
    const handleScroll = () => {
      if (!containerRef.current) return;
      const items = containerRef.current.querySelectorAll('.list-item');
      items.forEach((item, idx) => {
        const rect = item.getBoundingClientRect();
        if (rect.top < 200) {
          setReadItems(prev => new Set([...prev, idx]));
        }
      });
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <section ref={containerRef} className="own-section" style={{ background: '#faf9f6' }}>
      <style>{globalStyles}</style>
      {/* Sticky Header */}
      <div style={{ position: 'sticky', top: 0, zIndex: 10, background: '#1a1a1a', padding: '3rem 2rem' }}>
        <div style={{ maxWidth: '1000px', margin: '0 auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h2 style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: 'clamp(1.5rem, 3vw, 2rem)', fontWeight: 700, margin: 0, textTransform: 'uppercase' }}>
            <span style={{ color: '#ffffff' }}>Ownership</span>{' '}
            <span style={{ color: 'rgba(255,255,255,0.4)' }}>Benefits</span>
          </h2>
          <div style={{ fontFamily: "'Share Tech Mono', monospace", fontSize: '0.7rem', letterSpacing: '0.1em', color: 'rgba(255,255,255,0.5)' }}>
            {readItems.size} / {benefits.length} READ
          </div>
        </div>
      </div>
      {/* List */}
      <div style={{ maxWidth: '1000px', margin: '0 auto', padding: '2rem' }}>
        {benefits.map((b, i) => (
          <div key={i} className="list-item" style={{
            padding: '2rem',
            marginBottom: '1rem',
            background: readItems.has(i) ? '#f0efec' : '#ffffff',
            borderLeft: readItems.has(i) ? '3px solid #1a1a1a' : '3px solid transparent',
            transition: 'all 0.4s ease'
          }}>
            <div style={{ display: 'flex', gap: '2rem', alignItems: 'flex-start' }}>
              <div style={{ fontFamily: "'Share Tech Mono', monospace", fontSize: '1.25rem', fontWeight: 700, color: readItems.has(i) ? '#1a1a1a' : '#e8e6e2' }}>{String(i + 1).padStart(2, '0')}</div>
              <div style={{ flex: 1 }}>
                <h4 style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: '1.15rem', fontWeight: 700, margin: '0 0 0.5rem', color: '#1a1a1a', textTransform: 'uppercase' }}>{b.title}</h4>
                <p style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: '0.95rem', color: '#666666', lineHeight: 1.6, margin: 0 }}>{b.desc}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

// ============================================
// VERSION 62: Magazine Spread Scroll
// Full-bleed magazine style with scroll effects
// ============================================
const Version62_MagazineSpread = () => {
  const [activeSpread, setActiveSpread] = useState(0);
  const containerRef = React.useRef(null);

  useEffect(() => {
    const handleScroll = () => {
      if (!containerRef.current) return;
      const spreads = containerRef.current.querySelectorAll('.spread');
      spreads.forEach((spread, idx) => {
        const rect = spread.getBoundingClientRect();
        if (rect.top < window.innerHeight * 0.5 && rect.bottom > window.innerHeight * 0.5) {
          setActiveSpread(idx);
        }
      });
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <section ref={containerRef} className="own-section">
      <style>{globalStyles}</style>
      {benefits.slice(0, 6).map((b, i) => (
        <div key={i} className="spread" style={{
          minHeight: '100vh',
          display: 'grid',
          gridTemplateColumns: i % 2 === 0 ? '1fr 1fr' : '1fr 1fr',
          background: i % 2 === 0 ? '#faf9f6' : '#ffffff'
        }}>
          {i % 2 === 0 ? (
            <>
              <div style={{ background: '#1a1a1a', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '4rem' }}>
                <div style={{ fontFamily: "'Share Tech Mono', monospace", fontSize: 'clamp(8rem, 20vw, 15rem)', fontWeight: 700, color: 'rgba(255,255,255,0.05)' }}>{String(i + 1).padStart(2, '0')}</div>
              </div>
              <div style={{ padding: '6rem 4rem', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                <div style={{ fontFamily: "'Share Tech Mono', monospace", fontSize: '0.6rem', letterSpacing: '0.2em', color: '#999999', marginBottom: '2rem' }}>{b.category.toUpperCase()}</div>
                <h2 style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: 'clamp(2rem, 4vw, 3rem)', fontWeight: 700, margin: '0 0 2rem', textTransform: 'uppercase', lineHeight: 1.1 }}>
                  <span style={{ color: '#1a1a1a' }}>{b.title.split(' ')[0]}</span><br />
                  <span style={{ color: '#5a5a5a' }}>{b.title.split(' ').slice(1).join(' ')}</span>
                </h2>
                <p style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: '1.1rem', color: '#666666', lineHeight: 1.8, margin: 0 }}>{b.desc}</p>
              </div>
            </>
          ) : (
            <>
              <div style={{ padding: '6rem 4rem', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                <div style={{ fontFamily: "'Share Tech Mono', monospace", fontSize: '0.6rem', letterSpacing: '0.2em', color: '#999999', marginBottom: '2rem' }}>{b.category.toUpperCase()}</div>
                <h2 style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: 'clamp(2rem, 4vw, 3rem)', fontWeight: 700, margin: '0 0 2rem', textTransform: 'uppercase', lineHeight: 1.1 }}>
                  <span style={{ color: '#1a1a1a' }}>{b.title.split(' ')[0]}</span><br />
                  <span style={{ color: '#5a5a5a' }}>{b.title.split(' ').slice(1).join(' ')}</span>
                </h2>
                <p style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: '1.1rem', color: '#666666', lineHeight: 1.8, margin: 0 }}>{b.desc}</p>
              </div>
              <div style={{ background: '#1a1a1a', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '4rem' }}>
                <div style={{ fontFamily: "'Share Tech Mono', monospace", fontSize: 'clamp(8rem, 20vw, 15rem)', fontWeight: 700, color: 'rgba(255,255,255,0.05)' }}>{String(i + 1).padStart(2, '0')}</div>
              </div>
            </>
          )}
        </div>
      ))}
    </section>
  );
};

// ============================================
// VERSION 63: Click-to-Expand Grid
// Click cards to expand with full details
// ============================================
const Version63_ClickExpandGrid = () => {
  const [expandedIndex, setExpandedIndex] = useState(null);
  return (
    <section className="own-section" style={{ padding: '6rem 2rem', background: '#faf9f6' }}>
      <style>{globalStyles}</style>
      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
        <div style={{ textAlign: 'center', marginBottom: '4rem' }}>
          <h2 style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: 'clamp(2rem, 4vw, 3rem)', fontWeight: 700, margin: 0, textTransform: 'uppercase' }}>
            <span style={{ color: '#1a1a1a' }}>Click</span>{' '}
            <span style={{ color: '#4a4a4a' }}>To</span>{' '}
            <span style={{ color: '#7a7a7a' }}>Expand</span>
          </h2>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: expandedIndex !== null ? '1fr' : 'repeat(4, 1fr)', gap: '1rem', transition: 'all 0.5s' }}>
          {benefits.slice(0, 8).map((b, i) => (
            <div
              key={i}
              onClick={() => setExpandedIndex(expandedIndex === i ? null : i)}
              style={{
                display: expandedIndex !== null && expandedIndex !== i ? 'none' : 'block',
                padding: expandedIndex === i ? '4rem' : '2rem',
                background: '#ffffff',
                border: '1px solid #e8e6e2',
                cursor: 'pointer',
                transition: 'all 0.5s cubic-bezier(0.16, 1, 0.3, 1)'
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
                <div style={{ fontFamily: "'Share Tech Mono', monospace", fontSize: '0.6rem', letterSpacing: '0.15em', color: '#999999' }}>{String(i + 1).padStart(2, '0')}</div>
                <span style={{ fontSize: '1.25rem', color: '#999999' }}>{expandedIndex === i ? '×' : '+'}</span>
              </div>
              <h4 style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: expandedIndex === i ? '2rem' : '1rem', fontWeight: 700, margin: '0 0 1rem', color: '#1a1a1a', textTransform: 'uppercase', transition: 'font-size 0.3s' }}>{b.title}</h4>
              {expandedIndex === i && (
                <>
                  <p style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: '1.1rem', color: '#666666', lineHeight: 1.8, margin: '0 0 2rem' }}>{b.desc}</p>
                  <div style={{ display: 'flex', gap: '3rem' }}>
                    <div>
                      <div style={{ fontFamily: "'Share Tech Mono', monospace", fontSize: '2.5rem', fontWeight: 700, color: '#1a1a1a' }}>{b.stat}</div>
                      <div style={{ fontFamily: "'Share Tech Mono', monospace", fontSize: '0.65rem', letterSpacing: '0.1em', color: '#999999', textTransform: 'uppercase' }}>{b.statLabel}</div>
                    </div>
                  </div>
                </>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

// ============================================
// VERSION 64: Horizontal Scroll Cards
// Horizontal scrolling with gradient headers
// ============================================
const Version64_HorizontalScrollCards = () => (
  <section className="own-section" style={{ padding: '6rem 0', background: '#1a1a1a', overflow: 'hidden' }}>
    <style>{globalStyles}</style>
    <div style={{ padding: '0 2rem', marginBottom: '4rem' }}>
      <h2 style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: 'clamp(2rem, 4vw, 3rem)', fontWeight: 700, margin: 0, textTransform: 'uppercase' }}>
        <span style={{ color: '#ffffff' }}>Scroll</span>{' '}
        <span style={{ color: 'rgba(255,255,255,0.5)' }}>Horizontally</span>
      </h2>
    </div>
    <div style={{ display: 'flex', gap: '1.5rem', padding: '0 2rem', overflowX: 'auto', scrollSnapType: 'x mandatory', WebkitOverflowScrolling: 'touch' }}>
      {benefits.map((b, i) => (
        <div key={i} className="own-fade-up" style={{
          flex: '0 0 350px',
          padding: '2.5rem',
          background: '#ffffff',
          scrollSnapAlign: 'start',
          animationDelay: `${i * 0.08}s`
        }}>
          <div style={{ fontFamily: "'Share Tech Mono', monospace", fontSize: '0.6rem', letterSpacing: '0.15em', color: '#999999', marginBottom: '1.5rem' }}>{String(i + 1).padStart(2, '0')} • {b.category.toUpperCase()}</div>
          <h4 style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: '1.25rem', fontWeight: 700, margin: '0 0 1rem', textTransform: 'uppercase' }}>
            <span style={{ color: '#1a1a1a' }}>{b.title.split(' ')[0]}</span>{' '}
            <span style={{ color: '#5a5a5a' }}>{b.title.split(' ').slice(1).join(' ')}</span>
          </h4>
          <p style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: '0.95rem', color: '#666666', lineHeight: 1.6, margin: '0 0 2rem' }}>{b.desc}</p>
          <div style={{ fontFamily: "'Share Tech Mono', monospace", fontSize: '1.75rem', fontWeight: 700, color: '#e8e6e2' }}>{b.stat}</div>
        </div>
      ))}
    </div>
  </section>
);

// ============================================
// VERSION 65: Full Screen Takeover
// Each benefit takes full screen on scroll
// ============================================
const Version65_FullScreenTakeover = () => {
  const [activeIndex, setActiveIndex] = useState(0);
  const containerRef = React.useRef(null);

  useEffect(() => {
    const handleScroll = () => {
      if (!containerRef.current) return;
      const sections = containerRef.current.querySelectorAll('.fullscreen-section');
      sections.forEach((section, idx) => {
        const rect = section.getBoundingClientRect();
        if (rect.top < window.innerHeight * 0.5 && rect.bottom > window.innerHeight * 0.5) {
          setActiveIndex(idx);
        }
      });
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <section ref={containerRef} className="own-section">
      <style>{globalStyles}</style>
      {benefits.slice(0, 6).map((b, i) => (
        <div key={i} className="fullscreen-section" style={{
          minHeight: '100vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: i % 2 === 0 ? '#faf9f6' : '#1a1a1a',
          position: 'relative',
          padding: '4rem 2rem'
        }}>
          {/* Large background number */}
          <div style={{
            position: 'absolute',
            fontSize: 'clamp(15rem, 40vw, 30rem)',
            fontFamily: "'Share Tech Mono', monospace",
            fontWeight: 700,
            color: i % 2 === 0 ? 'rgba(0,0,0,0.03)' : 'rgba(255,255,255,0.03)',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            pointerEvents: 'none'
          }}>{String(i + 1).padStart(2, '0')}</div>
          <div style={{ maxWidth: '700px', textAlign: 'center', position: 'relative', zIndex: 2 }}>
            <div style={{ fontFamily: "'Share Tech Mono', monospace", fontSize: '0.7rem', letterSpacing: '0.2em', color: i % 2 === 0 ? '#999999' : 'rgba(255,255,255,0.4)', marginBottom: '2rem' }}>{b.category.toUpperCase()}</div>
            <h2 style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: 'clamp(2.5rem, 6vw, 4rem)', fontWeight: 700, margin: '0 0 2rem', textTransform: 'uppercase', letterSpacing: '-0.02em', lineHeight: 1 }}>
              <span style={{ color: i % 2 === 0 ? '#1a1a1a' : '#ffffff' }}>{b.title.split(' ')[0]}</span><br />
              <span style={{ color: i % 2 === 0 ? '#5a5a5a' : 'rgba(255,255,255,0.5)' }}>{b.title.split(' ').slice(1).join(' ')}</span>
            </h2>
            <p style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: '1.2rem', color: i % 2 === 0 ? '#666666' : 'rgba(255,255,255,0.6)', lineHeight: 1.8, margin: 0 }}>{b.desc}</p>
          </div>
        </div>
      ))}
    </section>
  );
};

// ============================================
// VERSION 66: Tabs + Scroll Tracker
// Category tabs with scroll tracking within each
// ============================================
const Version66_TabsScrollTracker = () => {
  const [activeTab, setActiveTab] = useState('Practical');
  const [readItems, setReadItems] = useState(new Set());
  const categories = ['Practical', 'Experience', 'Lifestyle'];
  const filteredBenefits = benefits.filter(b => b.category === activeTab);

  return (
    <section className="own-section" style={{ padding: '6rem 2rem', background: '#faf9f6' }}>
      <style>{globalStyles}</style>
      <div style={{ maxWidth: '900px', margin: '0 auto' }}>
        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
          <h2 style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: 'clamp(2rem, 4vw, 3rem)', fontWeight: 700, margin: '0 0 2rem', textTransform: 'uppercase' }}>
            <span style={{ color: '#1a1a1a' }}>Explore</span>{' '}
            <span style={{ color: '#4a4a4a' }}>By</span>{' '}
            <span style={{ color: '#7a7a7a' }}>Category</span>
          </h2>
          {/* Tabs */}
          <div style={{ display: 'flex', justifyContent: 'center', gap: '0.5rem' }}>
            {categories.map(cat => (
              <button key={cat} onClick={() => { setActiveTab(cat); setReadItems(new Set()); }} style={{
                padding: '0.75rem 1.5rem',
                background: activeTab === cat ? '#1a1a1a' : 'transparent',
                color: activeTab === cat ? '#ffffff' : '#1a1a1a',
                border: '1px solid #1a1a1a',
                fontFamily: "'Space Grotesk', sans-serif",
                fontSize: '0.75rem',
                fontWeight: 700,
                textTransform: 'uppercase',
                letterSpacing: '0.05em',
                cursor: 'pointer',
                transition: 'all 0.3s'
              }}>{cat}</button>
            ))}
          </div>
        </div>
        {/* Benefits */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {filteredBenefits.map((b, i) => (
            <div
              key={b.title}
              onClick={() => setReadItems(prev => new Set([...prev, i]))}
              style={{
                padding: '2rem',
                background: readItems.has(i) ? '#f0efec' : '#ffffff',
                border: '1px solid #e8e6e2',
                cursor: 'pointer',
                transition: 'all 0.3s'
              }}
            >
              <div style={{ display: 'flex', gap: '1.5rem', alignItems: 'flex-start' }}>
                <div style={{ fontFamily: "'Share Tech Mono', monospace", fontSize: '1rem', fontWeight: 700, color: readItems.has(i) ? '#1a1a1a' : '#e8e6e2', transition: 'color 0.3s' }}>{String(i + 1).padStart(2, '0')}</div>
                <div style={{ flex: 1 }}>
                  <h4 style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: '1.1rem', fontWeight: 700, margin: '0 0 0.5rem', color: '#1a1a1a', textTransform: 'uppercase' }}>{b.title}</h4>
                  <p style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: '0.95rem', color: '#666666', lineHeight: 1.6, margin: 0 }}>{b.desc}</p>
                </div>
                {readItems.has(i) && <span style={{ color: '#1a1a1a' }}>✓</span>}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

// ============================================
// VERSION 67: Masonry Hover Grid
// Masonry layout with hover expand
// ============================================
const Version67_MasonryHoverGrid = () => {
  const [hoveredIndex, setHoveredIndex] = useState(null);
  const heights = ['280px', '350px', '250px', '320px', '290px', '380px', '260px', '340px', '300px'];
  return (
    <section className="own-section" style={{ padding: '6rem 2rem', background: '#ffffff' }}>
      <style>{globalStyles}</style>
      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
        <div style={{ textAlign: 'center', marginBottom: '4rem' }}>
          <h2 style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: 'clamp(2rem, 4vw, 3rem)', fontWeight: 700, margin: 0, textTransform: 'uppercase' }}>
            <span style={{ color: '#1a1a1a' }}>Masonry</span>{' '}
            <span style={{ color: '#5a5a5a' }}>Gallery</span>
          </h2>
        </div>
        <div style={{ columns: '3 300px', columnGap: '1.5rem' }}>
          {benefits.slice(0, 9).map((b, i) => (
            <div
              key={i}
              onMouseEnter={() => setHoveredIndex(i)}
              onMouseLeave={() => setHoveredIndex(null)}
              style={{
                breakInside: 'avoid',
                marginBottom: '1.5rem',
                padding: '2rem',
                background: hoveredIndex === i ? '#1a1a1a' : '#faf9f6',
                minHeight: heights[i % heights.length],
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'flex-end',
                transition: 'all 0.4s cubic-bezier(0.16, 1, 0.3, 1)',
                cursor: 'pointer'
              }}
            >
              <div style={{ fontFamily: "'Share Tech Mono', monospace", fontSize: '0.6rem', letterSpacing: '0.15em', color: hoveredIndex === i ? 'rgba(255,255,255,0.4)' : '#999999', marginBottom: '1rem', transition: 'color 0.3s' }}>{String(i + 1).padStart(2, '0')}</div>
              <h4 style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: '1.25rem', fontWeight: 700, margin: '0 0 1rem', color: hoveredIndex === i ? '#ffffff' : '#1a1a1a', textTransform: 'uppercase', transition: 'color 0.3s' }}>{b.title}</h4>
              <p style={{
                fontFamily: "'Space Grotesk', sans-serif",
                fontSize: '0.9rem',
                color: hoveredIndex === i ? 'rgba(255,255,255,0.7)' : '#666666',
                lineHeight: 1.6,
                margin: 0,
                maxHeight: hoveredIndex === i ? '200px' : '0',
                overflow: 'hidden',
                opacity: hoveredIndex === i ? 1 : 0,
                transition: 'all 0.4s ease'
              }}>{b.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

// ============================================
// VERSION 68: Split Image + Text Scroll
// Image on one side, scrolling text on other with read tracking
// ============================================
const Version68_SplitImageTextScroll = () => {
  const [activeIndex, setActiveIndex] = useState(0);
  const [readItems, setReadItems] = useState(new Set());
  const containerRef = React.useRef(null);

  useEffect(() => {
    const handleScroll = () => {
      if (!containerRef.current) return;
      const items = containerRef.current.querySelectorAll('.text-item');
      items.forEach((item, idx) => {
        const rect = item.getBoundingClientRect();
        const center = window.innerHeight / 2;
        if (rect.top < center && rect.bottom > center) {
          setActiveIndex(idx);
        }
        if (rect.bottom < center) {
          setReadItems(prev => new Set([...prev, idx]));
        }
      });
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <section ref={containerRef} className="own-section" style={{ display: 'grid', gridTemplateColumns: '45% 55%' }}>
      <style>{globalStyles}</style>
      {/* Sticky Image Side */}
      <div style={{ position: 'sticky', top: 0, height: '100vh', background: '#1a1a1a', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', padding: '4rem' }}>
        <div style={{ fontFamily: "'Share Tech Mono', monospace", fontSize: 'clamp(10rem, 25vw, 18rem)', fontWeight: 700, color: 'rgba(255,255,255,0.05)', lineHeight: 1 }}>{String(activeIndex + 1).padStart(2, '0')}</div>
        <h3 style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: 'clamp(1.5rem, 3vw, 2rem)', fontWeight: 700, color: '#ffffff', textTransform: 'uppercase', textAlign: 'center', marginTop: '-3rem' }}>{benefits[activeIndex]?.title}</h3>
      </div>
      {/* Scrolling Text Side */}
      <div style={{ background: '#faf9f6' }}>
        {benefits.map((b, i) => (
          <div key={i} className="text-item" style={{
            minHeight: '60vh',
            padding: '4rem 3rem',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            background: readItems.has(i) ? '#f0efec' : '#faf9f6',
            borderBottom: '1px solid #e8e6e2',
            transition: 'background 0.5s'
          }}>
            <div style={{ fontFamily: "'Share Tech Mono', monospace", fontSize: '0.6rem', letterSpacing: '0.15em', color: '#999999', marginBottom: '1.5rem' }}>{b.category.toUpperCase()}</div>
            <h4 style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: '1.5rem', fontWeight: 700, margin: '0 0 1rem', textTransform: 'uppercase' }}>
              <span style={{ color: '#1a1a1a' }}>{b.title.split(' ')[0]}</span>{' '}
              <span style={{ color: '#5a5a5a' }}>{b.title.split(' ').slice(1).join(' ')}</span>
            </h4>
            <p style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: '1.1rem', color: '#666666', lineHeight: 1.8, margin: 0 }}>{b.desc}</p>
            <div style={{ marginTop: '2rem', fontFamily: "'Share Tech Mono', monospace", fontSize: '2rem', fontWeight: 700, color: readItems.has(i) ? '#cccccc' : '#e8e6e2', transition: 'color 0.3s' }}>{b.stat}</div>
          </div>
        ))}
      </div>
    </section>
  );
};

// ============================================
// VERSION 69: Accordion with Gradient Headers
// Accordion style with gradient title colors
// ============================================
const Version69_GradientAccordion = () => {
  const [openIndex, setOpenIndex] = useState(0);
  return (
    <section className="own-section" style={{ padding: '6rem 2rem', background: '#ffffff' }}>
      <style>{globalStyles}</style>
      <div style={{ maxWidth: '900px', margin: '0 auto' }}>
        <div style={{ textAlign: 'center', marginBottom: '4rem' }}>
          <h2 style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: 'clamp(2rem, 5vw, 3.5rem)', fontWeight: 700, margin: 0, textTransform: 'uppercase', letterSpacing: '-0.02em' }}>
            <span style={{ color: '#1a1a1a' }}>Expand</span>{' '}
            <span style={{ color: '#4a4a4a' }}>Your</span>{' '}
            <span style={{ color: '#7a7a7a' }}>Knowledge</span>
          </h2>
        </div>
        {benefits.map((b, i) => (
          <div key={i} style={{ borderBottom: '1px solid #e8e6e2' }}>
            <button
              onClick={() => setOpenIndex(openIndex === i ? -1 : i)}
              style={{
                width: '100%',
                padding: '1.5rem 0',
                background: 'transparent',
                border: 'none',
                cursor: 'pointer',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                textAlign: 'left'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
                <span style={{ fontFamily: "'Share Tech Mono', monospace", fontSize: '0.7rem', color: '#999999' }}>{String(i + 1).padStart(2, '0')}</span>
                <h4 style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: '1.25rem', fontWeight: 700, margin: 0, textTransform: 'uppercase' }}>
                  <span style={{ color: openIndex === i ? '#1a1a1a' : '#4a4a4a' }}>{b.title.split(' ')[0]}</span>{' '}
                  <span style={{ color: openIndex === i ? '#4a4a4a' : '#7a7a7a' }}>{b.title.split(' ').slice(1).join(' ')}</span>
                </h4>
              </div>
              <span style={{ fontSize: '1.5rem', color: '#999999', transform: openIndex === i ? 'rotate(45deg)' : 'rotate(0)', transition: 'transform 0.3s' }}>+</span>
            </button>
            <div style={{
              maxHeight: openIndex === i ? '300px' : '0',
              overflow: 'hidden',
              transition: 'max-height 0.4s cubic-bezier(0.16, 1, 0.3, 1)'
            }}>
              <p style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: '1rem', color: '#666666', lineHeight: 1.8, margin: 0, padding: '0 0 2rem 3.5rem' }}>{b.desc}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

// ============================================
// VERSION 70: Ultimate Combined
// All favorite features combined
// ============================================
const Version70_UltimateCombined = () => {
  const [activeIndex, setActiveIndex] = useState(0);
  const [readItems, setReadItems] = useState(new Set());
  const [hoveredIndex, setHoveredIndex] = useState(null);
  const containerRef = React.useRef(null);

  useEffect(() => {
    const handleScroll = () => {
      if (!containerRef.current) return;
      const items = containerRef.current.querySelectorAll('.benefit-card');
      items.forEach((item, idx) => {
        const rect = item.getBoundingClientRect();
        const center = window.innerHeight / 2;
        if (rect.top < center && rect.bottom > center) {
          setActiveIndex(idx);
        }
        if (rect.bottom < center - 100) {
          setReadItems(prev => new Set([...prev, idx]));
        }
      });
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <section ref={containerRef} className="own-section" style={{ display: 'grid', gridTemplateColumns: '40% 60%' }}>
      <style>{globalStyles}</style>
      {/* Sticky Left Panel */}
      <div style={{ position: 'sticky', top: 0, height: '100vh', background: '#1a1a1a', display: 'flex', flexDirection: 'column', justifyContent: 'center', padding: '4rem' }}>
        <div style={{ fontFamily: "'Share Tech Mono', monospace", fontSize: '0.65rem', letterSpacing: '0.2em', color: 'rgba(255,255,255,0.3)', marginBottom: '2rem' }}>
          {readItems.size} / {benefits.length} EXPLORED
        </div>
        <h2 style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: 'clamp(2rem, 4vw, 3rem)', fontWeight: 700, margin: '0 0 2rem', textTransform: 'uppercase', lineHeight: 1.1 }}>
          <span style={{ color: '#ffffff' }}>{benefits[activeIndex]?.title.split(' ')[0]}</span><br />
          <span style={{ color: 'rgba(255,255,255,0.4)' }}>{benefits[activeIndex]?.title.split(' ').slice(1).join(' ')}</span>
        </h2>
        <div style={{ fontFamily: "'Share Tech Mono', monospace", fontSize: '4rem', fontWeight: 700, color: 'rgba(255,255,255,0.1)' }}>{String(activeIndex + 1).padStart(2, '0')}</div>
        {/* Progress bar */}
        <div style={{ marginTop: '3rem', width: '100%', height: '2px', background: 'rgba(255,255,255,0.1)' }}>
          <div style={{ width: `${((activeIndex + 1) / benefits.length) * 100}%`, height: '100%', background: '#ffffff', transition: 'width 0.3s' }} />
        </div>
      </div>
      {/* Scrolling Right */}
      <div style={{ background: '#faf9f6' }}>
        {benefits.map((b, i) => (
          <div
            key={i}
            className="benefit-card"
            onMouseEnter={() => setHoveredIndex(i)}
            onMouseLeave={() => setHoveredIndex(null)}
            style={{
              padding: '4rem 3rem',
              background: readItems.has(i) ? '#f0efec' : (hoveredIndex === i ? '#ffffff' : '#faf9f6'),
              borderBottom: '1px solid #e8e6e2',
              borderLeft: activeIndex === i ? '4px solid #1a1a1a' : '4px solid transparent',
              transition: 'all 0.4s ease',
              cursor: 'pointer'
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
              <div style={{ fontFamily: "'Share Tech Mono', monospace", fontSize: '0.6rem', letterSpacing: '0.15em', color: '#999999' }}>{String(i + 1).padStart(2, '0')} • {b.category.toUpperCase()}</div>
              {readItems.has(i) && <span style={{ color: '#1a1a1a', fontSize: '1rem' }}>✓</span>}
            </div>
            <h4 style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: hoveredIndex === i ? '1.5rem' : '1.25rem', fontWeight: 700, margin: '0 0 1rem', textTransform: 'uppercase', transition: 'font-size 0.3s' }}>
              <span style={{ color: '#1a1a1a' }}>{b.title.split(' ')[0]}</span>{' '}
              <span style={{ color: '#5a5a5a' }}>{b.title.split(' ').slice(1).join(' ')}</span>
            </h4>
            <p style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: '1rem', color: '#666666', lineHeight: 1.7, margin: 0 }}>{b.desc}</p>
            {hoveredIndex === i && (
              <div style={{ marginTop: '1.5rem', fontFamily: "'Share Tech Mono', monospace", fontSize: '2rem', fontWeight: 700, color: '#e8e6e2' }}>{b.stat}</div>
            )}
          </div>
        ))}
      </div>
    </section>
  );
};

// ============================================
// VERSION 71: Cinematic Vertical Journey
// Full-screen vertical scroll with cinematic transitions
// ============================================
const Version71_CinematicVerticalJourney = () => {
  const [activeIndex, setActiveIndex] = useState(0);
  const [readItems, setReadItems] = useState(new Set());
  const containerRef = React.useRef(null);

  useEffect(() => {
    const handleScroll = () => {
      if (!containerRef.current) return;
      const sections = containerRef.current.querySelectorAll('.journey-section');
      sections.forEach((section, idx) => {
        const rect = section.getBoundingClientRect();
        if (rect.top < window.innerHeight * 0.4 && rect.bottom > window.innerHeight * 0.4) {
          setActiveIndex(idx);
        }
        if (rect.bottom < window.innerHeight * 0.3) {
          setReadItems(prev => new Set([...prev, idx]));
        }
      });
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <section ref={containerRef} className="own-section">
      <style>{globalStyles}</style>
      {/* Fixed Progress Indicator */}
      <div style={{ position: 'fixed', right: '40px', top: '50%', transform: 'translateY(-50%)', zIndex: 100 }}>
        {benefits.slice(0, 8).map((_, i) => (
          <div key={i} style={{
            width: '12px',
            height: '12px',
            borderRadius: '50%',
            background: readItems.has(i) ? '#999999' : (activeIndex === i ? '#1a1a1a' : 'transparent'),
            border: `2px solid ${activeIndex === i ? '#1a1a1a' : '#e8e6e2'}`,
            margin: '8px 0',
            transition: 'all 0.3s'
          }} />
        ))}
        <div style={{ fontFamily: "'Share Tech Mono', monospace", fontSize: '0.6rem', color: '#999999', marginTop: '1rem', textAlign: 'center' }}>
          {readItems.size}/{benefits.slice(0, 8).length}
        </div>
      </div>
      {benefits.slice(0, 8).map((b, i) => (
        <div key={i} className="journey-section" style={{
          minHeight: '100vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: readItems.has(i) ? '#f0efec' : (i % 2 === 0 ? '#faf9f6' : '#1a1a1a'),
          position: 'relative',
          transition: 'background 0.8s ease'
        }}>
          <div style={{
            position: 'absolute',
            fontSize: 'clamp(20rem, 50vw, 40rem)',
            fontFamily: "'Share Tech Mono', monospace",
            fontWeight: 700,
            color: i % 2 === 0 ? 'rgba(0,0,0,0.02)' : 'rgba(255,255,255,0.02)',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            pointerEvents: 'none'
          }}>{String(i + 1).padStart(2, '0')}</div>
          <div style={{ maxWidth: '800px', textAlign: 'center', padding: '4rem 2rem', position: 'relative', zIndex: 2 }}>
            <div style={{ fontFamily: "'Share Tech Mono', monospace", fontSize: '0.7rem', letterSpacing: '0.25em', color: i % 2 === 0 ? '#999999' : 'rgba(255,255,255,0.4)', marginBottom: '2rem' }}>
              {b.category.toUpperCase()} • {String(i + 1).padStart(2, '0')} OF {String(benefits.slice(0, 8).length).padStart(2, '0')}
            </div>
            <h2 style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: 'clamp(2.5rem, 7vw, 5rem)', fontWeight: 700, margin: '0 0 2rem', textTransform: 'uppercase', letterSpacing: '-0.03em', lineHeight: 0.95 }}>
              <span style={{ color: i % 2 === 0 ? '#1a1a1a' : '#ffffff' }}>{b.title.split(' ')[0]}</span><br />
              <span style={{ color: i % 2 === 0 ? '#5a5a5a' : 'rgba(255,255,255,0.5)' }}>{b.title.split(' ').slice(1).join(' ')}</span>
            </h2>
            <p style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: '1.25rem', color: i % 2 === 0 ? '#666666' : 'rgba(255,255,255,0.65)', lineHeight: 1.8, margin: '0 0 3rem', maxWidth: '600px', marginLeft: 'auto', marginRight: 'auto' }}>{b.desc}</p>
            <div style={{ fontFamily: "'Share Tech Mono', monospace", fontSize: '3rem', fontWeight: 700, color: i % 2 === 0 ? '#e8e6e2' : 'rgba(255,255,255,0.15)' }}>{b.stat}</div>
          </div>
        </div>
      ))}
    </section>
  );
};

// ============================================
// VERSION 72: Triple Panel Sync
// Three-panel layout with synced scroll
// ============================================
const Version72_TriplePanelSync = () => {
  const [activeIndex, setActiveIndex] = useState(0);
  const [readItems, setReadItems] = useState(new Set());
  const containerRef = React.useRef(null);

  useEffect(() => {
    const handleScroll = () => {
      if (!containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      const progress = Math.max(0, Math.min(1, -rect.top / (rect.height - window.innerHeight)));
      const newIndex = Math.min(Math.floor(progress * benefits.length), benefits.length - 1);
      setActiveIndex(newIndex);
      if (newIndex > 0) {
        setReadItems(prev => {
          const updated = new Set(prev);
          for (let i = 0; i < newIndex; i++) updated.add(i);
          return updated;
        });
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <section ref={containerRef} className="own-section" style={{ minHeight: `${benefits.length * 80}vh`, position: 'relative' }}>
      <style>{globalStyles}</style>
      <div style={{ position: 'sticky', top: 0, height: '100vh', display: 'grid', gridTemplateColumns: '1fr 2fr 1fr' }}>
        {/* Left - Category List */}
        <div style={{ background: '#1a1a1a', padding: '3rem 2rem', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
          {['Practical', 'Experience', 'Lifestyle'].map((cat, catIdx) => (
            <div key={cat} style={{
              padding: '1rem 0',
              borderBottom: catIdx < 2 ? '1px solid rgba(255,255,255,0.1)' : 'none',
              opacity: benefits[activeIndex]?.category === cat ? 1 : 0.3,
              transition: 'opacity 0.3s'
            }}>
              <div style={{ fontFamily: "'Share Tech Mono', monospace", fontSize: '0.55rem', letterSpacing: '0.15em', color: 'rgba(255,255,255,0.4)', marginBottom: '0.5rem' }}>0{catIdx + 1}</div>
              <div style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: '1rem', fontWeight: 700, color: '#ffffff', textTransform: 'uppercase' }}>{cat}</div>
            </div>
          ))}
          <div style={{ marginTop: '3rem', fontFamily: "'Share Tech Mono', monospace", fontSize: '0.65rem', color: 'rgba(255,255,255,0.4)' }}>
            {readItems.size} / {benefits.length} READ
          </div>
        </div>
        {/* Center - Main Content */}
        <div style={{ background: '#faf9f6', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '4rem' }}>
          <div style={{ maxWidth: '500px', textAlign: 'center' }}>
            <h2 style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: 'clamp(2rem, 4vw, 3rem)', fontWeight: 700, margin: '0 0 2rem', textTransform: 'uppercase', letterSpacing: '-0.02em', lineHeight: 1.1 }}>
              <span style={{ color: '#1a1a1a' }}>{benefits[activeIndex]?.title.split(' ')[0]}</span><br />
              <span style={{ color: '#5a5a5a' }}>{benefits[activeIndex]?.title.split(' ').slice(1).join(' ')}</span>
            </h2>
            <p style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: '1.1rem', color: '#666666', lineHeight: 1.8, margin: 0 }}>{benefits[activeIndex]?.desc}</p>
          </div>
        </div>
        {/* Right - Number Display */}
        <div style={{ background: '#ffffff', display: 'flex', alignItems: 'center', justifyContent: 'center', borderLeft: '1px solid #e8e6e2' }}>
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontFamily: "'Share Tech Mono', monospace", fontSize: 'clamp(8rem, 15vw, 12rem)', fontWeight: 700, color: '#f0efec', lineHeight: 1 }}>{String(activeIndex + 1).padStart(2, '0')}</div>
            <div style={{ fontFamily: "'Share Tech Mono', monospace", fontSize: '0.7rem', letterSpacing: '0.15em', color: '#999999', marginTop: '1rem' }}>
              {benefits[activeIndex]?.stat}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

// ============================================
// VERSION 73: Horizontal Panoramic Scroll
// Full-screen horizontal scroll with sticky nav
// ============================================
const Version73_HorizontalPanoramic = () => {
  const [activeIndex, setActiveIndex] = useState(0);
  const scrollRef = React.useRef(null);

  const scrollToIndex = (idx) => {
    if (scrollRef.current) {
      const cardWidth = scrollRef.current.scrollWidth / benefits.length;
      scrollRef.current.scrollTo({ left: cardWidth * idx, behavior: 'smooth' });
    }
  };

  const handleScroll = () => {
    if (!scrollRef.current) return;
    const cardWidth = scrollRef.current.scrollWidth / benefits.length;
    const newIndex = Math.round(scrollRef.current.scrollLeft / cardWidth);
    setActiveIndex(Math.min(newIndex, benefits.length - 1));
  };

  return (
    <section className="own-section" style={{ height: '100vh', background: '#1a1a1a', display: 'flex', flexDirection: 'column' }}>
      <style>{globalStyles}</style>
      {/* Top Navigation */}
      <div style={{ padding: '2rem 3rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
        <h2 style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: '1.25rem', fontWeight: 700, color: '#ffffff', textTransform: 'uppercase', margin: 0, letterSpacing: '0.05em' }}>
          <span>Ownership</span>{' '}
          <span style={{ color: 'rgba(255,255,255,0.4)' }}>Benefits</span>
        </h2>
        <div style={{ display: 'flex', gap: '0.5rem' }}>
          {benefits.map((_, i) => (
            <button key={i} onClick={() => scrollToIndex(i)} style={{
              width: activeIndex === i ? '24px' : '8px',
              height: '8px',
              borderRadius: '4px',
              background: activeIndex === i ? '#ffffff' : 'rgba(255,255,255,0.2)',
              border: 'none',
              cursor: 'pointer',
              transition: 'all 0.3s'
            }} />
          ))}
        </div>
      </div>
      {/* Horizontal Scroll Container */}
      <div ref={scrollRef} onScroll={handleScroll} style={{
        flex: 1,
        display: 'flex',
        overflowX: 'auto',
        scrollSnapType: 'x mandatory',
        WebkitOverflowScrolling: 'touch'
      }}>
        {benefits.map((b, i) => (
          <div key={i} style={{
            flex: '0 0 100%',
            height: '100%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            scrollSnapAlign: 'start',
            background: i % 2 === 0 ? '#1a1a1a' : '#0d0d0d',
            padding: '4rem'
          }}>
            <div style={{ maxWidth: '700px', textAlign: 'center' }}>
              <div style={{ fontFamily: "'Share Tech Mono', monospace", fontSize: '0.7rem', letterSpacing: '0.2em', color: 'rgba(255,255,255,0.3)', marginBottom: '2rem' }}>{b.category.toUpperCase()}</div>
              <h3 style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: 'clamp(2.5rem, 6vw, 4rem)', fontWeight: 700, margin: '0 0 2rem', textTransform: 'uppercase', lineHeight: 1 }}>
                <span style={{ color: '#ffffff' }}>{b.title.split(' ')[0]}</span><br />
                <span style={{ color: 'rgba(255,255,255,0.4)' }}>{b.title.split(' ').slice(1).join(' ')}</span>
              </h3>
              <p style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: '1.15rem', color: 'rgba(255,255,255,0.6)', lineHeight: 1.8, margin: 0 }}>{b.desc}</p>
            </div>
          </div>
        ))}
      </div>
      {/* Bottom Stats Bar */}
      <div style={{ padding: '1.5rem 3rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid rgba(255,255,255,0.1)' }}>
        <div style={{ fontFamily: "'Share Tech Mono', monospace", fontSize: '2rem', fontWeight: 700, color: 'rgba(255,255,255,0.15)' }}>{benefits[activeIndex]?.stat}</div>
        <div style={{ fontFamily: "'Share Tech Mono', monospace", fontSize: '0.7rem', letterSpacing: '0.1em', color: 'rgba(255,255,255,0.4)' }}>
          {String(activeIndex + 1).padStart(2, '0')} / {String(benefits.length).padStart(2, '0')}
        </div>
      </div>
    </section>
  );
};

// ============================================
// VERSION 74: Stacked Card Reveal
// Cards stack and reveal on scroll
// ============================================
const Version74_StackedCardReveal = () => {
  const [activeIndex, setActiveIndex] = useState(0);
  const [readItems, setReadItems] = useState(new Set());
  const containerRef = React.useRef(null);

  useEffect(() => {
    const handleScroll = () => {
      if (!containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      const progress = Math.max(0, Math.min(1, -rect.top / (rect.height - window.innerHeight)));
      const newIndex = Math.min(Math.floor(progress * 8), 7);
      setActiveIndex(newIndex);
      for (let i = 0; i < newIndex; i++) {
        setReadItems(prev => new Set([...prev, i]));
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <section ref={containerRef} className="own-section" style={{ minHeight: '600vh', position: 'relative' }}>
      <style>{globalStyles}</style>
      <div style={{ position: 'sticky', top: 0, height: '100vh', background: '#faf9f6', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '2rem' }}>
        {/* Header */}
        <div style={{ position: 'absolute', top: '3rem', left: '3rem' }}>
          <h2 style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: '1.5rem', fontWeight: 700, margin: 0, textTransform: 'uppercase' }}>
            <span style={{ color: '#1a1a1a' }}>Stack</span>{' '}
            <span style={{ color: '#5a5a5a' }}>Reveal</span>
          </h2>
          <div style={{ fontFamily: "'Share Tech Mono', monospace", fontSize: '0.65rem', color: '#999999', marginTop: '0.5rem' }}>{readItems.size} / 8 READ</div>
        </div>
        {/* Stacked Cards */}
        <div style={{ position: 'relative', width: '500px', height: '400px' }}>
          {benefits.slice(0, 8).map((b, i) => {
            const isActive = i === activeIndex;
            const isRead = readItems.has(i);
            const offset = (i - activeIndex) * 20;
            const scale = isActive ? 1 : (1 - Math.abs(i - activeIndex) * 0.05);
            const opacity = i < activeIndex ? 0 : (isActive ? 1 : 0.5);
            return (
              <div key={i} style={{
                position: 'absolute',
                inset: 0,
                background: isRead ? '#f0efec' : '#ffffff',
                border: '1px solid #e8e6e2',
                padding: '3rem',
                transform: `translateY(${offset}px) scale(${scale})`,
                opacity,
                transition: 'all 0.5s cubic-bezier(0.16, 1, 0.3, 1)',
                zIndex: 10 - Math.abs(i - activeIndex)
              }}>
                <div style={{ fontFamily: "'Share Tech Mono', monospace", fontSize: '0.6rem', letterSpacing: '0.15em', color: '#999999', marginBottom: '2rem' }}>
                  {String(i + 1).padStart(2, '0')} • {b.category.toUpperCase()}
                </div>
                <h3 style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: '2rem', fontWeight: 700, margin: '0 0 1.5rem', textTransform: 'uppercase', lineHeight: 1.1 }}>
                  <span style={{ color: '#1a1a1a' }}>{b.title.split(' ')[0]}</span><br />
                  <span style={{ color: '#5a5a5a' }}>{b.title.split(' ').slice(1).join(' ')}</span>
                </h3>
                <p style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: '1rem', color: '#666666', lineHeight: 1.7, margin: 0 }}>{b.desc}</p>
              </div>
            );
          })}
        </div>
        {/* Progress Bar */}
        <div style={{ position: 'absolute', bottom: '3rem', left: '3rem', right: '3rem', height: '2px', background: '#e8e6e2' }}>
          <div style={{ width: `${((activeIndex + 1) / 8) * 100}%`, height: '100%', background: '#1a1a1a', transition: 'width 0.3s' }} />
        </div>
      </div>
    </section>
  );
};

// ============================================
// VERSION 75: Spotlight Focus
// One benefit at a time with dramatic spotlight
// ============================================
const Version75_SpotlightFocus = () => {
  const [activeIndex, setActiveIndex] = useState(0);
  const [readItems, setReadItems] = useState(new Set());
  const containerRef = React.useRef(null);

  useEffect(() => {
    const handleScroll = () => {
      if (!containerRef.current) return;
      const sections = containerRef.current.querySelectorAll('.spotlight-item');
      sections.forEach((section, idx) => {
        const rect = section.getBoundingClientRect();
        if (rect.top < window.innerHeight * 0.5 && rect.bottom > window.innerHeight * 0.5) {
          setActiveIndex(idx);
        }
        if (rect.bottom < window.innerHeight * 0.3) {
          setReadItems(prev => new Set([...prev, idx]));
        }
      });
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <section ref={containerRef} className="own-section" style={{ background: '#0d0d0d' }}>
      <style>{globalStyles}</style>
      {/* Fixed Gradient Spotlight */}
      <div style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        background: 'radial-gradient(ellipse 50% 50% at 50% 50%, rgba(255,255,255,0.03) 0%, transparent 70%)',
        pointerEvents: 'none',
        zIndex: 1
      }} />
      {/* Fixed Counter */}
      <div style={{ position: 'fixed', top: '3rem', right: '3rem', zIndex: 100, textAlign: 'right' }}>
        <div style={{ fontFamily: "'Share Tech Mono', monospace", fontSize: 'clamp(3rem, 6vw, 5rem)', fontWeight: 700, color: 'rgba(255,255,255,0.1)', lineHeight: 1 }}>{String(activeIndex + 1).padStart(2, '0')}</div>
        <div style={{ fontFamily: "'Share Tech Mono', monospace", fontSize: '0.7rem', letterSpacing: '0.1em', color: 'rgba(255,255,255,0.3)', marginTop: '0.5rem' }}>
          {readItems.size} EXPLORED
        </div>
      </div>
      {benefits.slice(0, 8).map((b, i) => (
        <div key={i} className="spotlight-item" style={{
          minHeight: '100vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          position: 'relative',
          zIndex: 2,
          padding: '4rem 2rem'
        }}>
          <div style={{
            maxWidth: '650px',
            textAlign: 'center',
            opacity: activeIndex === i ? 1 : 0.2,
            transform: activeIndex === i ? 'scale(1)' : 'scale(0.95)',
            transition: 'all 0.5s cubic-bezier(0.16, 1, 0.3, 1)'
          }}>
            <div style={{ fontFamily: "'Share Tech Mono', monospace", fontSize: '0.7rem', letterSpacing: '0.25em', color: 'rgba(255,255,255,0.3)', marginBottom: '2rem' }}>{b.category.toUpperCase()}</div>
            <h2 style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: 'clamp(2rem, 5vw, 3.5rem)', fontWeight: 700, margin: '0 0 2rem', textTransform: 'uppercase', letterSpacing: '-0.02em', lineHeight: 1.1 }}>
              <span style={{ color: '#ffffff' }}>{b.title.split(' ')[0]}</span><br />
              <span style={{ color: 'rgba(255,255,255,0.4)' }}>{b.title.split(' ').slice(1).join(' ')}</span>
            </h2>
            <p style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: '1.15rem', color: 'rgba(255,255,255,0.55)', lineHeight: 1.8, margin: 0 }}>{b.desc}</p>
            {readItems.has(i) && (
              <div style={{ marginTop: '2rem', fontFamily: "'Share Tech Mono', monospace", fontSize: '0.7rem', color: 'rgba(255,255,255,0.3)' }}>✓ READ</div>
            )}
          </div>
        </div>
      ))}
    </section>
  );
};

// ============================================
// VERSION 76: Metro Grid Scroll
// Windows Metro-style tiles with scroll tracking
// ============================================
const Version76_MetroGridScroll = () => {
  const [readItems, setReadItems] = useState(new Set());
  const containerRef = React.useRef(null);

  useEffect(() => {
    const handleScroll = () => {
      if (!containerRef.current) return;
      const items = containerRef.current.querySelectorAll('.metro-tile');
      items.forEach((item, idx) => {
        const rect = item.getBoundingClientRect();
        if (rect.top < window.innerHeight * 0.6) {
          setReadItems(prev => new Set([...prev, idx]));
        }
      });
    };
    window.addEventListener('scroll', handleScroll);
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const tileConfigs = [
    { col: 'span 2', row: 'span 2' },
    { col: 'span 1', row: 'span 1' },
    { col: 'span 1', row: 'span 2' },
    { col: 'span 2', row: 'span 1' },
    { col: 'span 1', row: 'span 1' },
    { col: 'span 1', row: 'span 1' },
    { col: 'span 2', row: 'span 2' },
    { col: 'span 1', row: 'span 1' },
  ];

  return (
    <section ref={containerRef} className="own-section" style={{ padding: '4rem 2rem', background: '#faf9f6' }}>
      <style>{globalStyles}</style>
      <div style={{ maxWidth: '1100px', margin: '0 auto' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '3rem' }}>
          <h2 style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: 'clamp(1.5rem, 3vw, 2rem)', fontWeight: 700, margin: 0, textTransform: 'uppercase' }}>
            <span style={{ color: '#1a1a1a' }}>Metro</span>{' '}
            <span style={{ color: '#5a5a5a' }}>Grid</span>
          </h2>
          <div style={{ fontFamily: "'Share Tech Mono', monospace", fontSize: '0.7rem', color: '#999999' }}>{readItems.size} / 8 READ</div>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gridAutoRows: '180px', gap: '1rem' }}>
          {benefits.slice(0, 8).map((b, i) => (
            <div key={i} className="metro-tile" style={{
              gridColumn: tileConfigs[i].col,
              gridRow: tileConfigs[i].row,
              padding: '2rem',
              background: readItems.has(i) ? '#f0efec' : (i % 3 === 0 ? '#1a1a1a' : '#ffffff'),
              border: i % 3 === 0 ? 'none' : '1px solid #e8e6e2',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'flex-end',
              transition: 'all 0.5s ease',
              opacity: readItems.has(i) ? 1 : 0,
              transform: readItems.has(i) ? 'translateY(0)' : 'translateY(30px)'
            }}>
              <div style={{ fontFamily: "'Share Tech Mono', monospace", fontSize: '0.55rem', letterSpacing: '0.1em', color: i % 3 === 0 ? 'rgba(255,255,255,0.4)' : '#999999', marginBottom: '0.75rem' }}>
                {String(i + 1).padStart(2, '0')}
              </div>
              <h4 style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: tileConfigs[i].col === 'span 2' ? '1.5rem' : '1rem', fontWeight: 700, margin: '0 0 0.5rem', color: i % 3 === 0 ? '#ffffff' : '#1a1a1a', textTransform: 'uppercase', lineHeight: 1.2 }}>{b.title}</h4>
              {tileConfigs[i].row === 'span 2' && (
                <p style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: '0.9rem', color: i % 3 === 0 ? 'rgba(255,255,255,0.6)' : '#666666', lineHeight: 1.6, margin: 0 }}>{b.desc}</p>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

// ============================================
// VERSION 77: Sticky Sidebar Categories
// Sticky category sidebar with scrolling content
// ============================================
const Version77_StickySidebarCategories = () => {
  const [activeCategory, setActiveCategory] = useState('Practical');
  const [readItems, setReadItems] = useState(new Set());
  const containerRef = React.useRef(null);
  const categories = ['Practical', 'Experience', 'Lifestyle'];

  useEffect(() => {
    const handleScroll = () => {
      if (!containerRef.current) return;
      const items = containerRef.current.querySelectorAll('.category-section');
      items.forEach((section) => {
        const rect = section.getBoundingClientRect();
        if (rect.top < window.innerHeight * 0.4 && rect.bottom > window.innerHeight * 0.4) {
          setActiveCategory(section.dataset.category);
        }
      });
      const benefitItems = containerRef.current.querySelectorAll('.benefit-item');
      benefitItems.forEach((item, idx) => {
        const rect = item.getBoundingClientRect();
        if (rect.top < window.innerHeight * 0.5) {
          setReadItems(prev => new Set([...prev, idx]));
        }
      });
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <section ref={containerRef} className="own-section" style={{ display: 'grid', gridTemplateColumns: '280px 1fr' }}>
      <style>{globalStyles}</style>
      {/* Sticky Sidebar */}
      <div style={{ position: 'sticky', top: 0, height: '100vh', background: '#1a1a1a', padding: '4rem 2rem', display: 'flex', flexDirection: 'column' }}>
        <h2 style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: '1.25rem', fontWeight: 700, color: '#ffffff', textTransform: 'uppercase', margin: '0 0 3rem', letterSpacing: '0.02em' }}>
          <span>Ownership</span><br />
          <span style={{ color: 'rgba(255,255,255,0.4)' }}>Benefits</span>
        </h2>
        <nav style={{ flex: 1 }}>
          {categories.map((cat, idx) => (
            <a key={cat} href={`#cat-${cat.toLowerCase()}`} onClick={(e) => { e.preventDefault(); document.getElementById(`cat-${cat.toLowerCase()}`).scrollIntoView({ behavior: 'smooth' }); }} style={{
              display: 'block',
              padding: '1rem 0',
              borderLeft: activeCategory === cat ? '2px solid #ffffff' : '2px solid transparent',
              paddingLeft: '1.5rem',
              marginLeft: '-1.5rem',
              transition: 'all 0.3s',
              textDecoration: 'none'
            }}>
              <div style={{ fontFamily: "'Share Tech Mono', monospace", fontSize: '0.55rem', letterSpacing: '0.1em', color: 'rgba(255,255,255,0.3)', marginBottom: '0.25rem' }}>0{idx + 1}</div>
              <div style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: '0.9rem', fontWeight: activeCategory === cat ? 700 : 400, color: activeCategory === cat ? '#ffffff' : 'rgba(255,255,255,0.5)', textTransform: 'uppercase' }}>{cat}</div>
            </a>
          ))}
        </nav>
        <div style={{ fontFamily: "'Share Tech Mono', monospace", fontSize: '0.65rem', color: 'rgba(255,255,255,0.4)' }}>
          {readItems.size} / {benefits.length} READ
        </div>
      </div>
      {/* Main Content */}
      <div style={{ background: '#faf9f6' }}>
        {categories.map(cat => (
          <div key={cat} id={`cat-${cat.toLowerCase()}`} data-category={cat} className="category-section" style={{ padding: '4rem 3rem', borderBottom: '1px solid #e8e6e2' }}>
            <div style={{ fontFamily: "'Share Tech Mono', monospace", fontSize: '0.6rem', letterSpacing: '0.2em', color: '#999999', marginBottom: '1rem' }}>CATEGORY</div>
            <h3 style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: 'clamp(2rem, 4vw, 3rem)', fontWeight: 700, margin: '0 0 3rem', textTransform: 'uppercase' }}>
              <span style={{ color: '#1a1a1a' }}>The</span>{' '}
              <span style={{ color: '#5a5a5a' }}>{cat}</span>{' '}
              <span style={{ color: '#8a8a8a' }}>Advantage</span>
            </h3>
            {benefits.filter(b => b.category === cat).map((b, i) => {
              const globalIdx = benefits.findIndex(x => x.title === b.title);
              return (
                <div key={i} className="benefit-item" style={{
                  padding: '2rem',
                  marginBottom: '1rem',
                  background: readItems.has(globalIdx) ? '#f0efec' : '#ffffff',
                  borderLeft: readItems.has(globalIdx) ? '3px solid #1a1a1a' : '3px solid transparent',
                  transition: 'all 0.4s'
                }}>
                  <h4 style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: '1.15rem', fontWeight: 700, margin: '0 0 0.75rem', color: '#1a1a1a', textTransform: 'uppercase' }}>{b.title}</h4>
                  <p style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: '0.95rem', color: '#666666', lineHeight: 1.6, margin: 0 }}>{b.desc}</p>
                </div>
              );
            })}
          </div>
        ))}
      </div>
    </section>
  );
};

// ============================================
// VERSION 78: Alternating Full Bleed
// Alternating full-width sections with gradient text
// ============================================
const Version78_AlternatingFullBleed = () => {
  const [readItems, setReadItems] = useState(new Set());
  const containerRef = React.useRef(null);

  useEffect(() => {
    const handleScroll = () => {
      if (!containerRef.current) return;
      const items = containerRef.current.querySelectorAll('.fullbleed-section');
      items.forEach((item, idx) => {
        const rect = item.getBoundingClientRect();
        if (rect.top < window.innerHeight * 0.5) {
          setReadItems(prev => new Set([...prev, idx]));
        }
      });
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <section ref={containerRef} className="own-section">
      <style>{globalStyles}</style>
      {/* Fixed Progress */}
      <div style={{ position: 'fixed', top: '50%', left: '24px', transform: 'translateY(-50%)', zIndex: 100 }}>
        {benefits.slice(0, 8).map((_, i) => (
          <div key={i} style={{
            width: '2px',
            height: readItems.has(i) ? '24px' : '12px',
            background: readItems.has(i) ? '#1a1a1a' : '#e8e6e2',
            margin: '6px 0',
            transition: 'all 0.3s'
          }} />
        ))}
      </div>
      {benefits.slice(0, 8).map((b, i) => (
        <div key={i} className="fullbleed-section" style={{
          minHeight: '100vh',
          display: 'grid',
          gridTemplateColumns: i % 2 === 0 ? '55% 45%' : '45% 55%',
          background: readItems.has(i) ? '#f0efec' : (i % 2 === 0 ? '#faf9f6' : '#ffffff'),
          transition: 'background 0.5s'
        }}>
          {i % 2 === 0 ? (
            <>
              <div style={{ padding: '6rem 4rem', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                <div style={{ fontFamily: "'Share Tech Mono', monospace", fontSize: '0.6rem', letterSpacing: '0.2em', color: '#999999', marginBottom: '2rem' }}>
                  {String(i + 1).padStart(2, '0')} • {b.category.toUpperCase()}
                </div>
                <h2 style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: 'clamp(2.5rem, 5vw, 4rem)', fontWeight: 700, margin: '0 0 2rem', textTransform: 'uppercase', letterSpacing: '-0.02em', lineHeight: 1 }}>
                  <span style={{ color: '#1a1a1a' }}>{b.title.split(' ')[0]}</span><br />
                  <span style={{ color: '#4a4a4a' }}>{b.title.split(' ')[1] || ''}</span><br />
                  <span style={{ color: '#7a7a7a' }}>{b.title.split(' ').slice(2).join(' ')}</span>
                </h2>
                <p style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: '1.15rem', color: '#666666', lineHeight: 1.8, margin: 0, maxWidth: '500px' }}>{b.desc}</p>
              </div>
              <div style={{ background: '#1a1a1a', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <div style={{ fontFamily: "'Share Tech Mono', monospace", fontSize: 'clamp(10rem, 20vw, 16rem)', fontWeight: 700, color: 'rgba(255,255,255,0.03)' }}>{String(i + 1).padStart(2, '0')}</div>
              </div>
            </>
          ) : (
            <>
              <div style={{ background: '#1a1a1a', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <div style={{ fontFamily: "'Share Tech Mono', monospace", fontSize: 'clamp(10rem, 20vw, 16rem)', fontWeight: 700, color: 'rgba(255,255,255,0.03)' }}>{String(i + 1).padStart(2, '0')}</div>
              </div>
              <div style={{ padding: '6rem 4rem', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                <div style={{ fontFamily: "'Share Tech Mono', monospace", fontSize: '0.6rem', letterSpacing: '0.2em', color: '#999999', marginBottom: '2rem' }}>
                  {String(i + 1).padStart(2, '0')} • {b.category.toUpperCase()}
                </div>
                <h2 style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: 'clamp(2.5rem, 5vw, 4rem)', fontWeight: 700, margin: '0 0 2rem', textTransform: 'uppercase', letterSpacing: '-0.02em', lineHeight: 1 }}>
                  <span style={{ color: '#1a1a1a' }}>{b.title.split(' ')[0]}</span><br />
                  <span style={{ color: '#4a4a4a' }}>{b.title.split(' ')[1] || ''}</span><br />
                  <span style={{ color: '#7a7a7a' }}>{b.title.split(' ').slice(2).join(' ')}</span>
                </h2>
                <p style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: '1.15rem', color: '#666666', lineHeight: 1.8, margin: 0, maxWidth: '500px' }}>{b.desc}</p>
              </div>
            </>
          )}
        </div>
      ))}
    </section>
  );
};

// ============================================
// VERSION 79: Parallax Depth Scroll
// Parallax layers with depth effect
// ============================================
const Version79_ParallaxDepthScroll = () => {
  const [scrollY, setScrollY] = useState(0);
  const [activeIndex, setActiveIndex] = useState(0);
  const containerRef = React.useRef(null);

  useEffect(() => {
    const handleScroll = () => {
      setScrollY(window.scrollY);
      if (!containerRef.current) return;
      const sections = containerRef.current.querySelectorAll('.parallax-section');
      sections.forEach((section, idx) => {
        const rect = section.getBoundingClientRect();
        if (rect.top < window.innerHeight * 0.5 && rect.bottom > window.innerHeight * 0.5) {
          setActiveIndex(idx);
        }
      });
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <section ref={containerRef} className="own-section" style={{ background: '#0d0d0d', position: 'relative' }}>
      <style>{globalStyles}</style>
      {/* Fixed Background Layer */}
      <div style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        height: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        pointerEvents: 'none',
        zIndex: 1
      }}>
        <div style={{
          fontFamily: "'Share Tech Mono', monospace",
          fontSize: 'clamp(15rem, 40vw, 35rem)',
          fontWeight: 700,
          color: 'rgba(255,255,255,0.02)',
          transform: `translateY(${scrollY * 0.1}px)`,
          transition: 'color 0.5s'
        }}>{String(activeIndex + 1).padStart(2, '0')}</div>
      </div>
      {/* Content */}
      {benefits.slice(0, 8).map((b, i) => (
        <div key={i} className="parallax-section" style={{
          minHeight: '100vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          position: 'relative',
          zIndex: 2
        }}>
          <div style={{
            maxWidth: '700px',
            textAlign: 'center',
            padding: '4rem 2rem',
            transform: `translateY(${(scrollY - i * window.innerHeight) * 0.05}px)`,
            opacity: activeIndex === i ? 1 : 0.3,
            transition: 'opacity 0.5s'
          }}>
            <div style={{ fontFamily: "'Share Tech Mono', monospace", fontSize: '0.7rem', letterSpacing: '0.25em', color: 'rgba(255,255,255,0.3)', marginBottom: '2rem' }}>{b.category.toUpperCase()}</div>
            <h2 style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: 'clamp(2rem, 5vw, 3.5rem)', fontWeight: 700, margin: '0 0 2rem', textTransform: 'uppercase', lineHeight: 1.1 }}>
              <span style={{ color: '#ffffff' }}>{b.title.split(' ')[0]}</span>{' '}
              <span style={{ color: 'rgba(255,255,255,0.5)' }}>{b.title.split(' ').slice(1).join(' ')}</span>
            </h2>
            <p style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: '1.15rem', color: 'rgba(255,255,255,0.55)', lineHeight: 1.8, margin: 0 }}>{b.desc}</p>
          </div>
        </div>
      ))}
    </section>
  );
};

// ============================================
// VERSION 80: Expanding Accordion Stack
// Accordion that expands to full view on click
// ============================================
const Version80_ExpandingAccordionStack = () => {
  const [expandedIndex, setExpandedIndex] = useState(null);
  const [readItems, setReadItems] = useState(new Set());

  const handleExpand = (idx) => {
    if (expandedIndex === idx) {
      setExpandedIndex(null);
    } else {
      setExpandedIndex(idx);
      setReadItems(prev => new Set([...prev, idx]));
    }
  };

  return (
    <section className="own-section" style={{ padding: '4rem 2rem', background: '#faf9f6', minHeight: '100vh' }}>
      <style>{globalStyles}</style>
      <div style={{ maxWidth: '900px', margin: '0 auto' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '3rem' }}>
          <h2 style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: 'clamp(2rem, 4vw, 3rem)', fontWeight: 700, margin: 0, textTransform: 'uppercase' }}>
            <span style={{ color: '#1a1a1a' }}>Expand</span>{' '}
            <span style={{ color: '#4a4a4a' }}>To</span>{' '}
            <span style={{ color: '#7a7a7a' }}>Explore</span>
          </h2>
          <div style={{ fontFamily: "'Share Tech Mono', monospace", fontSize: '0.7rem', color: '#999999' }}>{readItems.size} / {benefits.length} READ</div>
        </div>
        {benefits.map((b, i) => (
          <div key={i} style={{
            marginBottom: '1px',
            background: readItems.has(i) ? '#f0efec' : '#ffffff',
            transition: 'all 0.5s cubic-bezier(0.16, 1, 0.3, 1)',
            overflow: 'hidden'
          }}>
            <button onClick={() => handleExpand(i)} style={{
              width: '100%',
              padding: expandedIndex === i ? '3rem 2rem' : '1.5rem 2rem',
              background: 'transparent',
              border: 'none',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '2rem',
              textAlign: 'left',
              transition: 'padding 0.5s'
            }}>
              <div style={{ fontFamily: "'Share Tech Mono', monospace", fontSize: expandedIndex === i ? '2rem' : '0.8rem', fontWeight: 700, color: expandedIndex === i ? '#1a1a1a' : '#e8e6e2', transition: 'all 0.3s', minWidth: '40px' }}>
                {String(i + 1).padStart(2, '0')}
              </div>
              <div style={{ flex: 1 }}>
                <h4 style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: expandedIndex === i ? '2rem' : '1.1rem', fontWeight: 700, margin: 0, color: '#1a1a1a', textTransform: 'uppercase', transition: 'font-size 0.3s' }}>
                  <span>{b.title.split(' ')[0]}</span>{' '}
                  <span style={{ color: expandedIndex === i ? '#5a5a5a' : '#1a1a1a' }}>{b.title.split(' ').slice(1).join(' ')}</span>
                </h4>
              </div>
              <span style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: '1.5rem', color: '#999999', transform: expandedIndex === i ? 'rotate(45deg)' : 'rotate(0)', transition: 'transform 0.3s' }}>+</span>
            </button>
            <div style={{
              maxHeight: expandedIndex === i ? '400px' : '0',
              opacity: expandedIndex === i ? 1 : 0,
              padding: expandedIndex === i ? '0 2rem 3rem 80px' : '0 2rem 0 80px',
              transition: 'all 0.5s cubic-bezier(0.16, 1, 0.3, 1)'
            }}>
              <p style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: '1.1rem', color: '#666666', lineHeight: 1.8, margin: '0 0 2rem' }}>{b.desc}</p>
              <div style={{ display: 'flex', gap: '3rem' }}>
                <div>
                  <div style={{ fontFamily: "'Share Tech Mono', monospace", fontSize: '0.6rem', letterSpacing: '0.1em', color: '#999999', marginBottom: '0.5rem' }}>{b.statLabel?.toUpperCase()}</div>
                  <div style={{ fontFamily: "'Share Tech Mono', monospace", fontSize: '2rem', fontWeight: 700, color: '#1a1a1a' }}>{b.stat}</div>
                </div>
                <div>
                  <div style={{ fontFamily: "'Share Tech Mono', monospace", fontSize: '0.6rem', letterSpacing: '0.1em', color: '#999999', marginBottom: '0.5rem' }}>CATEGORY</div>
                  <div style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: '1rem', fontWeight: 700, color: '#1a1a1a', textTransform: 'uppercase' }}>{b.category}</div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

// ============================================
// VERSION 81: Split Scroll Gallery
// Image gallery synced with text content
// ============================================
const Version81_SplitScrollGallery = () => {
  const [activeIndex, setActiveIndex] = useState(0);
  const [readItems, setReadItems] = useState(new Set());
  const containerRef = React.useRef(null);
  const images = ['🚁', '⏱', '🎯', '🏝', '🎬', '🔧', '🧭', '💼'];

  useEffect(() => {
    const handleScroll = () => {
      if (!containerRef.current) return;
      const items = containerRef.current.querySelectorAll('.gallery-text-item');
      items.forEach((item, idx) => {
        const rect = item.getBoundingClientRect();
        const center = window.innerHeight / 2;
        if (rect.top < center && rect.bottom > center) {
          setActiveIndex(idx);
        }
        if (rect.bottom < center - 50) {
          setReadItems(prev => new Set([...prev, idx]));
        }
      });
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <section ref={containerRef} className="own-section" style={{ display: 'grid', gridTemplateColumns: '50% 50%' }}>
      <style>{globalStyles}</style>
      {/* Sticky Image Gallery */}
      <div style={{ position: 'sticky', top: 0, height: '100vh', background: '#1a1a1a', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', overflow: 'hidden' }}>
        <div style={{ position: 'relative', width: '100%', height: '60%' }}>
          {benefits.slice(0, 8).map((b, i) => (
            <div key={i} style={{
              position: 'absolute',
              inset: 0,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              opacity: activeIndex === i ? 1 : 0,
              transform: activeIndex === i ? 'scale(1)' : 'scale(0.9)',
              transition: 'all 0.6s cubic-bezier(0.16, 1, 0.3, 1)'
            }}>
              <div style={{ fontSize: 'clamp(8rem, 15vw, 12rem)' }}>{images[i]}</div>
            </div>
          ))}
        </div>
        <div style={{ position: 'absolute', bottom: '3rem', display: 'flex', gap: '0.75rem' }}>
          {benefits.slice(0, 8).map((_, i) => (
            <div key={i} style={{
              width: activeIndex === i ? '24px' : '8px',
              height: '3px',
              background: readItems.has(i) ? 'rgba(255,255,255,0.3)' : (activeIndex === i ? '#ffffff' : 'rgba(255,255,255,0.2)'),
              borderRadius: '2px',
              transition: 'all 0.3s'
            }} />
          ))}
        </div>
      </div>
      {/* Scrolling Text */}
      <div style={{ background: '#faf9f6' }}>
        {benefits.slice(0, 8).map((b, i) => (
          <div key={i} className="gallery-text-item" style={{
            minHeight: '80vh',
            padding: '4rem 3rem',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            background: readItems.has(i) ? '#f0efec' : '#faf9f6',
            transition: 'background 0.5s'
          }}>
            <div style={{ fontFamily: "'Share Tech Mono', monospace", fontSize: '0.6rem', letterSpacing: '0.2em', color: '#999999', marginBottom: '1.5rem' }}>
              {String(i + 1).padStart(2, '0')} / {String(benefits.slice(0, 8).length).padStart(2, '0')}
            </div>
            <h3 style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: 'clamp(1.75rem, 3vw, 2.5rem)', fontWeight: 700, margin: '0 0 1.5rem', textTransform: 'uppercase', lineHeight: 1.1 }}>
              <span style={{ color: '#1a1a1a' }}>{b.title.split(' ')[0]}</span><br />
              <span style={{ color: '#5a5a5a' }}>{b.title.split(' ').slice(1).join(' ')}</span>
            </h3>
            <p style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: '1.1rem', color: '#666666', lineHeight: 1.8, margin: 0 }}>{b.desc}</p>
            {readItems.has(i) && (
              <div style={{ marginTop: '2rem', fontFamily: "'Share Tech Mono', monospace", fontSize: '0.7rem', color: '#999999' }}>✓ EXPLORED</div>
            )}
          </div>
        ))}
      </div>
    </section>
  );
};

// ============================================
// VERSION 82: Diagonal Section Reveal
// Diagonal sections with scroll reveal
// ============================================
const Version82_DiagonalSectionReveal = () => {
  const [readItems, setReadItems] = useState(new Set());
  const containerRef = React.useRef(null);

  useEffect(() => {
    const handleScroll = () => {
      if (!containerRef.current) return;
      const items = containerRef.current.querySelectorAll('.diagonal-section');
      items.forEach((item, idx) => {
        const rect = item.getBoundingClientRect();
        if (rect.top < window.innerHeight * 0.6) {
          setReadItems(prev => new Set([...prev, idx]));
        }
      });
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <section ref={containerRef} className="own-section" style={{ background: '#faf9f6', overflow: 'hidden' }}>
      <style>{globalStyles}</style>
      {/* Fixed Header */}
      <div style={{ position: 'fixed', top: '3rem', left: '3rem', zIndex: 100 }}>
        <h2 style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: '1rem', fontWeight: 700, margin: 0, textTransform: 'uppercase' }}>
          <span style={{ color: '#1a1a1a' }}>Diagonal</span>{' '}
          <span style={{ color: '#5a5a5a' }}>Flow</span>
        </h2>
        <div style={{ fontFamily: "'Share Tech Mono', monospace", fontSize: '0.65rem', color: '#999999', marginTop: '0.5rem' }}>{readItems.size} / 8</div>
      </div>
      {benefits.slice(0, 8).map((b, i) => (
        <div key={i} className="diagonal-section" style={{
          minHeight: '100vh',
          position: 'relative',
          display: 'flex',
          alignItems: i % 2 === 0 ? 'flex-start' : 'flex-end',
          justifyContent: i % 2 === 0 ? 'flex-start' : 'flex-end',
          padding: '8rem 4rem'
        }}>
          {/* Diagonal background */}
          <div style={{
            position: 'absolute',
            inset: 0,
            background: readItems.has(i) ? '#f0efec' : (i % 2 === 0 ? '#ffffff' : '#1a1a1a'),
            clipPath: i % 2 === 0
              ? 'polygon(0 0, 100% 5%, 100% 100%, 0 95%)'
              : 'polygon(0 5%, 100% 0, 100% 95%, 0 100%)',
            transition: 'background 0.5s'
          }} />
          <div style={{
            maxWidth: '550px',
            position: 'relative',
            zIndex: 2,
            opacity: readItems.has(i) ? 1 : 0,
            transform: readItems.has(i) ? 'translateX(0)' : (i % 2 === 0 ? 'translateX(-50px)' : 'translateX(50px)'),
            transition: 'all 0.8s cubic-bezier(0.16, 1, 0.3, 1)'
          }}>
            <div style={{ fontFamily: "'Share Tech Mono', monospace", fontSize: '0.6rem', letterSpacing: '0.2em', color: i % 2 === 0 ? '#999999' : 'rgba(255,255,255,0.4)', marginBottom: '1.5rem' }}>
              {String(i + 1).padStart(2, '0')} • {b.category.toUpperCase()}
            </div>
            <h3 style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: 'clamp(2rem, 4vw, 3rem)', fontWeight: 700, margin: '0 0 1.5rem', textTransform: 'uppercase', lineHeight: 1.1 }}>
              <span style={{ color: i % 2 === 0 ? '#1a1a1a' : '#ffffff' }}>{b.title.split(' ')[0]}</span><br />
              <span style={{ color: i % 2 === 0 ? '#5a5a5a' : 'rgba(255,255,255,0.5)' }}>{b.title.split(' ').slice(1).join(' ')}</span>
            </h3>
            <p style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: '1.1rem', color: i % 2 === 0 ? '#666666' : 'rgba(255,255,255,0.6)', lineHeight: 1.8, margin: 0 }}>{b.desc}</p>
          </div>
        </div>
      ))}
    </section>
  );
};

// ============================================
// VERSION 83: Minimal Typewriter
// Typewriter effect with clean minimal design
// ============================================
const Version83_MinimalTypewriter = () => {
  const [activeIndex, setActiveIndex] = useState(0);
  const [readItems, setReadItems] = useState(new Set());
  const [typedText, setTypedText] = useState('');
  const containerRef = React.useRef(null);

  useEffect(() => {
    const handleScroll = () => {
      if (!containerRef.current) return;
      const sections = containerRef.current.querySelectorAll('.typewriter-section');
      sections.forEach((section, idx) => {
        const rect = section.getBoundingClientRect();
        if (rect.top < window.innerHeight * 0.5 && rect.bottom > window.innerHeight * 0.5) {
          if (activeIndex !== idx) {
            setActiveIndex(idx);
            setTypedText('');
          }
        }
        if (rect.bottom < window.innerHeight * 0.3) {
          setReadItems(prev => new Set([...prev, idx]));
        }
      });
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [activeIndex]);

  useEffect(() => {
    const desc = benefits[activeIndex]?.desc || '';
    let idx = 0;
    const interval = setInterval(() => {
      if (idx < desc.length) {
        setTypedText(desc.slice(0, idx + 1));
        idx++;
      } else {
        clearInterval(interval);
      }
    }, 15);
    return () => clearInterval(interval);
  }, [activeIndex]);

  return (
    <section ref={containerRef} className="own-section" style={{ background: '#ffffff' }}>
      <style>{globalStyles}</style>
      {/* Fixed Progress */}
      <div style={{ position: 'fixed', bottom: '3rem', left: '50%', transform: 'translateX(-50%)', zIndex: 100, display: 'flex', gap: '0.5rem' }}>
        {benefits.slice(0, 8).map((_, i) => (
          <div key={i} style={{
            width: '40px',
            height: '2px',
            background: readItems.has(i) ? '#999999' : (activeIndex === i ? '#1a1a1a' : '#e8e6e2'),
            transition: 'all 0.3s'
          }} />
        ))}
      </div>
      {benefits.slice(0, 8).map((b, i) => (
        <div key={i} className="typewriter-section" style={{
          minHeight: '100vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '4rem 2rem',
          background: readItems.has(i) ? '#faf9f6' : '#ffffff',
          transition: 'background 0.5s'
        }}>
          <div style={{ maxWidth: '700px', textAlign: 'center' }}>
            <div style={{ fontFamily: "'Share Tech Mono', monospace", fontSize: '0.7rem', letterSpacing: '0.25em', color: '#999999', marginBottom: '3rem' }}>
              {String(i + 1).padStart(2, '0')} — {b.category.toUpperCase()}
            </div>
            <h2 style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: 'clamp(2.5rem, 6vw, 4rem)', fontWeight: 700, margin: '0 0 3rem', textTransform: 'uppercase', letterSpacing: '-0.03em', lineHeight: 1 }}>
              <span style={{ color: '#1a1a1a' }}>{b.title}</span>
            </h2>
            <p style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: '1.15rem', color: '#666666', lineHeight: 1.9, margin: 0, minHeight: '4rem' }}>
              {activeIndex === i ? typedText : b.desc}
              {activeIndex === i && typedText.length < b.desc.length && <span style={{ borderRight: '2px solid #1a1a1a', marginLeft: '2px', animation: 'blink 0.8s infinite' }}>|</span>}
            </p>
          </div>
        </div>
      ))}
      <style>{`@keyframes blink { 0%, 50% { opacity: 1; } 51%, 100% { opacity: 0; } }`}</style>
    </section>
  );
};

// ============================================
// VERSION 84: Card Stack Peek
// Stacked cards that peek on scroll
// ============================================
const Version84_CardStackPeek = () => {
  const [activeIndex, setActiveIndex] = useState(0);
  const [readItems, setReadItems] = useState(new Set());
  const containerRef = React.useRef(null);

  useEffect(() => {
    const handleScroll = () => {
      if (!containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      const progress = Math.max(0, Math.min(1, -rect.top / (rect.height - window.innerHeight)));
      const newIndex = Math.min(Math.floor(progress * 8), 7);
      setActiveIndex(newIndex);
      for (let i = 0; i < newIndex; i++) {
        setReadItems(prev => new Set([...prev, i]));
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <section ref={containerRef} className="own-section" style={{ minHeight: '500vh', position: 'relative' }}>
      <style>{globalStyles}</style>
      <div style={{ position: 'sticky', top: 0, height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#1a1a1a', padding: '2rem' }}>
        {/* Counter */}
        <div style={{ position: 'absolute', top: '3rem', left: '3rem' }}>
          <div style={{ fontFamily: "'Share Tech Mono', monospace", fontSize: '4rem', fontWeight: 700, color: 'rgba(255,255,255,0.1)', lineHeight: 1 }}>{String(activeIndex + 1).padStart(2, '0')}</div>
        </div>
        <div style={{ position: 'absolute', top: '3rem', right: '3rem', fontFamily: "'Share Tech Mono', monospace", fontSize: '0.7rem', color: 'rgba(255,255,255,0.4)' }}>
          {readItems.size} / 8 READ
        </div>
        {/* Cards */}
        <div style={{ position: 'relative', width: '550px', height: '450px', perspective: '1000px' }}>
          {benefits.slice(0, 8).map((b, i) => {
            const isActive = i === activeIndex;
            const isPast = i < activeIndex;
            const isFuture = i > activeIndex;
            return (
              <div key={i} style={{
                position: 'absolute',
                inset: 0,
                background: '#faf9f6',
                padding: '3rem',
                borderRadius: '2px',
                transform: isPast
                  ? `translateY(-${(activeIndex - i) * 20}px) translateZ(-${(activeIndex - i) * 50}px) rotateX(5deg)`
                  : (isFuture
                    ? `translateY(${(i - activeIndex) * 40}px) translateZ(-${(i - activeIndex) * 30}px)`
                    : 'translateY(0) translateZ(0)'),
                opacity: isPast ? 0.3 : (isFuture ? Math.max(0.4, 1 - (i - activeIndex) * 0.2) : 1),
                transition: 'all 0.6s cubic-bezier(0.16, 1, 0.3, 1)',
                zIndex: isPast ? i : (isActive ? 10 : 8 - i)
              }}>
                <div style={{ fontFamily: "'Share Tech Mono', monospace", fontSize: '0.6rem', letterSpacing: '0.15em', color: '#999999', marginBottom: '2rem' }}>
                  {String(i + 1).padStart(2, '0')} • {b.category.toUpperCase()}
                </div>
                <h3 style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: '2rem', fontWeight: 700, margin: '0 0 1.5rem', textTransform: 'uppercase', lineHeight: 1.1 }}>
                  <span style={{ color: '#1a1a1a' }}>{b.title.split(' ')[0]}</span><br />
                  <span style={{ color: '#5a5a5a' }}>{b.title.split(' ').slice(1).join(' ')}</span>
                </h3>
                <p style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: '1rem', color: '#666666', lineHeight: 1.7, margin: 0 }}>{b.desc}</p>
                {readItems.has(i) && (
                  <div style={{ position: 'absolute', bottom: '2rem', right: '2rem', fontFamily: "'Share Tech Mono', monospace", fontSize: '0.65rem', color: '#999999' }}>✓</div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

// ============================================
// VERSION 85: Immersive Full Width
// Full-width immersive sections
// ============================================
const Version85_ImmersiveFullWidth = () => {
  const [activeIndex, setActiveIndex] = useState(0);
  const [readItems, setReadItems] = useState(new Set());
  const containerRef = React.useRef(null);

  useEffect(() => {
    const handleScroll = () => {
      if (!containerRef.current) return;
      const sections = containerRef.current.querySelectorAll('.immersive-section');
      sections.forEach((section, idx) => {
        const rect = section.getBoundingClientRect();
        if (rect.top < window.innerHeight * 0.5 && rect.bottom > window.innerHeight * 0.5) {
          setActiveIndex(idx);
        }
        if (rect.bottom < window.innerHeight * 0.2) {
          setReadItems(prev => new Set([...prev, idx]));
        }
      });
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <section ref={containerRef} className="own-section">
      <style>{globalStyles}</style>
      {/* Fixed Side Progress */}
      <div style={{ position: 'fixed', right: '24px', top: '50%', transform: 'translateY(-50%)', zIndex: 100, writingMode: 'vertical-rl' }}>
        <div style={{ fontFamily: "'Share Tech Mono', monospace", fontSize: '0.65rem', letterSpacing: '0.15em', color: 'rgba(255,255,255,0.4)', transform: 'rotate(180deg)' }}>
          {String(activeIndex + 1).padStart(2, '0')} / {String(benefits.slice(0, 8).length).padStart(2, '0')}
        </div>
      </div>
      {benefits.slice(0, 8).map((b, i) => (
        <div key={i} className="immersive-section" style={{
          minHeight: '100vh',
          display: 'flex',
          alignItems: 'center',
          background: readItems.has(i) ? '#f0efec' : (i % 2 === 0 ? '#1a1a1a' : '#faf9f6'),
          transition: 'background 0.5s',
          position: 'relative'
        }}>
          {/* Large Background Number */}
          <div style={{
            position: 'absolute',
            fontSize: 'clamp(20rem, 50vw, 40rem)',
            fontFamily: "'Share Tech Mono', monospace",
            fontWeight: 700,
            color: i % 2 === 0 ? 'rgba(255,255,255,0.02)' : 'rgba(0,0,0,0.02)',
            right: i % 2 === 0 ? '5%' : 'auto',
            left: i % 2 === 0 ? 'auto' : '5%',
            top: '50%',
            transform: 'translateY(-50%)',
            lineHeight: 1,
            pointerEvents: 'none'
          }}>{String(i + 1).padStart(2, '0')}</div>
          <div style={{
            width: '100%',
            maxWidth: '1200px',
            margin: '0 auto',
            padding: '4rem',
            display: 'grid',
            gridTemplateColumns: i % 2 === 0 ? '1fr 1fr' : '1fr 1fr',
            gap: '4rem',
            alignItems: 'center',
            position: 'relative',
            zIndex: 2
          }}>
            {i % 2 === 0 ? (
              <>
                <div>
                  <div style={{ fontFamily: "'Share Tech Mono', monospace", fontSize: '0.6rem', letterSpacing: '0.2em', color: 'rgba(255,255,255,0.4)', marginBottom: '2rem' }}>{b.category.toUpperCase()}</div>
                  <h2 style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: 'clamp(2.5rem, 5vw, 4rem)', fontWeight: 700, margin: '0 0 2rem', textTransform: 'uppercase', lineHeight: 1 }}>
                    <span style={{ color: '#ffffff' }}>{b.title.split(' ')[0]}</span><br />
                    <span style={{ color: 'rgba(255,255,255,0.4)' }}>{b.title.split(' ').slice(1).join(' ')}</span>
                  </h2>
                  <p style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: '1.15rem', color: 'rgba(255,255,255,0.6)', lineHeight: 1.8, margin: 0 }}>{b.desc}</p>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <div style={{ fontFamily: "'Share Tech Mono', monospace", fontSize: '6rem', fontWeight: 700, color: 'rgba(255,255,255,0.1)' }}>{b.stat}</div>
                </div>
              </>
            ) : (
              <>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <div style={{ fontFamily: "'Share Tech Mono', monospace", fontSize: '6rem', fontWeight: 700, color: 'rgba(0,0,0,0.05)' }}>{b.stat}</div>
                </div>
                <div>
                  <div style={{ fontFamily: "'Share Tech Mono', monospace", fontSize: '0.6rem', letterSpacing: '0.2em', color: '#999999', marginBottom: '2rem' }}>{b.category.toUpperCase()}</div>
                  <h2 style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: 'clamp(2.5rem, 5vw, 4rem)', fontWeight: 700, margin: '0 0 2rem', textTransform: 'uppercase', lineHeight: 1 }}>
                    <span style={{ color: '#1a1a1a' }}>{b.title.split(' ')[0]}</span><br />
                    <span style={{ color: '#5a5a5a' }}>{b.title.split(' ').slice(1).join(' ')}</span>
                  </h2>
                  <p style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: '1.15rem', color: '#666666', lineHeight: 1.8, margin: 0 }}>{b.desc}</p>
                </div>
              </>
            )}
          </div>
        </div>
      ))}
    </section>
  );
};

// ============================================
// VERSION 86: Scrolling Ticker
// Continuous ticker with focus on scroll
// ============================================
const Version86_ScrollingTicker = () => {
  const [activeIndex, setActiveIndex] = useState(0);
  const [readItems, setReadItems] = useState(new Set());
  const containerRef = React.useRef(null);

  useEffect(() => {
    const handleScroll = () => {
      if (!containerRef.current) return;
      const items = containerRef.current.querySelectorAll('.ticker-item');
      items.forEach((item, idx) => {
        const rect = item.getBoundingClientRect();
        if (rect.top < window.innerHeight * 0.5 && rect.bottom > window.innerHeight * 0.5) {
          setActiveIndex(idx);
        }
        if (rect.bottom < window.innerHeight * 0.3) {
          setReadItems(prev => new Set([...prev, idx]));
        }
      });
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <section ref={containerRef} className="own-section" style={{ background: '#0d0d0d' }}>
      <style>{globalStyles}</style>
      {/* Fixed Ticker Header */}
      <div style={{ position: 'fixed', top: 0, left: 0, right: 0, zIndex: 100, background: '#0d0d0d', borderBottom: '1px solid rgba(255,255,255,0.1)', padding: '1rem 0', overflow: 'hidden' }}>
        <div style={{ display: 'flex', animation: 'ticker 30s linear infinite', whiteSpace: 'nowrap' }}>
          {[...benefits.slice(0, 8), ...benefits.slice(0, 8)].map((b, i) => (
            <span key={i} style={{
              fontFamily: "'Space Grotesk', sans-serif",
              fontSize: '0.85rem',
              fontWeight: 700,
              color: readItems.has(i % 8) ? 'rgba(255,255,255,0.2)' : (activeIndex === i % 8 ? '#ffffff' : 'rgba(255,255,255,0.4)'),
              textTransform: 'uppercase',
              marginRight: '4rem',
              transition: 'color 0.3s'
            }}>{b.title}</span>
          ))}
        </div>
      </div>
      <style>{`@keyframes ticker { 0% { transform: translateX(0); } 100% { transform: translateX(-50%); } }`}</style>
      {/* Main Content */}
      <div style={{ paddingTop: '60px' }}>
        {benefits.slice(0, 8).map((b, i) => (
          <div key={i} className="ticker-item" style={{
            minHeight: '100vh',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '4rem 2rem',
            background: readItems.has(i) ? 'rgba(255,255,255,0.02)' : 'transparent',
            transition: 'background 0.5s'
          }}>
            <div style={{
              maxWidth: '800px',
              textAlign: 'center',
              opacity: activeIndex === i ? 1 : 0.3,
              transform: activeIndex === i ? 'scale(1)' : 'scale(0.95)',
              transition: 'all 0.5s'
            }}>
              <div style={{ fontFamily: "'Share Tech Mono', monospace", fontSize: '0.7rem', letterSpacing: '0.25em', color: 'rgba(255,255,255,0.3)', marginBottom: '2rem' }}>
                {String(i + 1).padStart(2, '0')} — {b.category.toUpperCase()}
              </div>
              <h2 style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: 'clamp(3rem, 7vw, 5rem)', fontWeight: 700, margin: '0 0 2rem', textTransform: 'uppercase', lineHeight: 0.95 }}>
                <span style={{ color: '#ffffff' }}>{b.title.split(' ')[0]}</span><br />
                <span style={{ color: 'rgba(255,255,255,0.4)' }}>{b.title.split(' ').slice(1).join(' ')}</span>
              </h2>
              <p style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: '1.2rem', color: 'rgba(255,255,255,0.55)', lineHeight: 1.8, margin: 0 }}>{b.desc}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

// ============================================
// VERSION 87: Minimalist Column
// Single column ultra-minimal design
// ============================================
const Version87_MinimalistColumn = () => {
  const [readItems, setReadItems] = useState(new Set());
  const containerRef = React.useRef(null);

  useEffect(() => {
    const handleScroll = () => {
      if (!containerRef.current) return;
      const items = containerRef.current.querySelectorAll('.minimal-item');
      items.forEach((item, idx) => {
        const rect = item.getBoundingClientRect();
        if (rect.top < window.innerHeight * 0.5) {
          setReadItems(prev => new Set([...prev, idx]));
        }
      });
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <section ref={containerRef} className="own-section" style={{ padding: '8rem 2rem', background: '#ffffff' }}>
      <style>{globalStyles}</style>
      <div style={{ maxWidth: '600px', margin: '0 auto' }}>
        {/* Header */}
        <div style={{ marginBottom: '6rem', textAlign: 'center' }}>
          <h1 style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: 'clamp(2.5rem, 6vw, 4rem)', fontWeight: 700, margin: '0 0 1rem', textTransform: 'uppercase', letterSpacing: '-0.03em' }}>
            <span style={{ color: '#1a1a1a' }}>Ownership</span><br />
            <span style={{ color: '#7a7a7a' }}>Benefits</span>
          </h1>
          <div style={{ fontFamily: "'Share Tech Mono', monospace", fontSize: '0.7rem', letterSpacing: '0.15em', color: '#999999' }}>
            {readItems.size} / {benefits.length} EXPLORED
          </div>
        </div>
        {/* Benefits */}
        {benefits.map((b, i) => (
          <div key={i} className="minimal-item" style={{
            marginBottom: '4rem',
            paddingBottom: '4rem',
            borderBottom: i < benefits.length - 1 ? '1px solid #f0efec' : 'none',
            opacity: readItems.has(i) ? 1 : 0.4,
            transform: readItems.has(i) ? 'translateY(0)' : 'translateY(20px)',
            transition: 'all 0.6s ease'
          }}>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: '2rem', marginBottom: '1.5rem' }}>
              <span style={{ fontFamily: "'Share Tech Mono', monospace", fontSize: '0.7rem', color: readItems.has(i) ? '#1a1a1a' : '#e8e6e2', transition: 'color 0.3s' }}>{String(i + 1).padStart(2, '0')}</span>
              <span style={{ fontFamily: "'Share Tech Mono', monospace", fontSize: '0.6rem', letterSpacing: '0.15em', color: '#999999' }}>{b.category.toUpperCase()}</span>
            </div>
            <h3 style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: '1.5rem', fontWeight: 700, margin: '0 0 1rem', color: '#1a1a1a', textTransform: 'uppercase' }}>{b.title}</h3>
            <p style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: '1.05rem', color: '#666666', lineHeight: 1.8, margin: 0 }}>{b.desc}</p>
          </div>
        ))}
      </div>
    </section>
  );
};

// ============================================
// VERSION 88: Fixed Counter Scroll
// Fixed large counter with scrolling content
// ============================================
const Version88_FixedCounterScroll = () => {
  const [activeIndex, setActiveIndex] = useState(0);
  const [readItems, setReadItems] = useState(new Set());
  const containerRef = React.useRef(null);

  useEffect(() => {
    const handleScroll = () => {
      if (!containerRef.current) return;
      const items = containerRef.current.querySelectorAll('.counter-item');
      items.forEach((item, idx) => {
        const rect = item.getBoundingClientRect();
        const center = window.innerHeight / 2;
        if (rect.top < center && rect.bottom > center) {
          setActiveIndex(idx);
        }
        if (rect.bottom < center - 100) {
          setReadItems(prev => new Set([...prev, idx]));
        }
      });
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <section ref={containerRef} className="own-section" style={{ display: 'grid', gridTemplateColumns: '35% 65%' }}>
      <style>{globalStyles}</style>
      {/* Fixed Counter Side */}
      <div style={{ position: 'sticky', top: 0, height: '100vh', background: '#faf9f6', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', borderRight: '1px solid #e8e6e2' }}>
        <div style={{ fontFamily: "'Share Tech Mono', monospace", fontSize: 'clamp(12rem, 25vw, 20rem)', fontWeight: 700, color: '#f0efec', lineHeight: 0.9, transition: 'color 0.3s' }}>
          {String(activeIndex + 1).padStart(2, '0')}
        </div>
        <div style={{ fontFamily: "'Share Tech Mono', monospace", fontSize: '0.7rem', letterSpacing: '0.15em', color: '#999999', marginTop: '2rem' }}>
          OF {String(benefits.length).padStart(2, '0')}
        </div>
        <div style={{ position: 'absolute', bottom: '3rem', fontFamily: "'Share Tech Mono', monospace", fontSize: '0.65rem', color: '#999999' }}>
          {readItems.size} EXPLORED
        </div>
      </div>
      {/* Scrolling Content */}
      <div style={{ background: '#ffffff' }}>
        {benefits.map((b, i) => (
          <div key={i} className="counter-item" style={{
            minHeight: '70vh',
            padding: '4rem 3rem',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            background: readItems.has(i) ? '#faf9f6' : '#ffffff',
            borderBottom: '1px solid #f0efec',
            transition: 'background 0.5s'
          }}>
            <div style={{ fontFamily: "'Share Tech Mono', monospace", fontSize: '0.6rem', letterSpacing: '0.2em', color: '#999999', marginBottom: '2rem' }}>{b.category.toUpperCase()}</div>
            <h3 style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: 'clamp(1.75rem, 3vw, 2.5rem)', fontWeight: 700, margin: '0 0 1.5rem', textTransform: 'uppercase', lineHeight: 1.1 }}>
              <span style={{ color: '#1a1a1a' }}>{b.title.split(' ')[0]}</span>{' '}
              <span style={{ color: '#5a5a5a' }}>{b.title.split(' ').slice(1).join(' ')}</span>
            </h3>
            <p style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: '1.1rem', color: '#666666', lineHeight: 1.8, margin: 0, maxWidth: '500px' }}>{b.desc}</p>
            {readItems.has(i) && (
              <div style={{ marginTop: '2rem', fontFamily: "'Share Tech Mono', monospace", fontSize: '0.7rem', color: '#bbb' }}>✓ READ</div>
            )}
          </div>
        ))}
      </div>
    </section>
  );
};

// ============================================
// VERSION 89: Gallery Lightbox Scroll
// Grid that expands items on scroll
// ============================================
const Version89_GalleryLightboxScroll = () => {
  const [expandedIndex, setExpandedIndex] = useState(null);
  const [readItems, setReadItems] = useState(new Set());

  const handleClick = (idx) => {
    if (expandedIndex === idx) {
      setExpandedIndex(null);
    } else {
      setExpandedIndex(idx);
      setReadItems(prev => new Set([...prev, idx]));
    }
  };

  return (
    <section className="own-section" style={{ padding: '4rem 2rem', background: '#1a1a1a', minHeight: '100vh' }}>
      <style>{globalStyles}</style>
      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '3rem' }}>
          <h2 style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: 'clamp(1.5rem, 3vw, 2rem)', fontWeight: 700, margin: 0, textTransform: 'uppercase' }}>
            <span style={{ color: '#ffffff' }}>Click</span>{' '}
            <span style={{ color: 'rgba(255,255,255,0.4)' }}>To Explore</span>
          </h2>
          <div style={{ fontFamily: "'Share Tech Mono', monospace", fontSize: '0.7rem', color: 'rgba(255,255,255,0.4)' }}>{readItems.size} / {benefits.length}</div>
        </div>
        {/* Grid */}
        <div style={{
          display: expandedIndex !== null ? 'block' : 'grid',
          gridTemplateColumns: 'repeat(4, 1fr)',
          gap: '1rem'
        }}>
          {benefits.map((b, i) => (
            <div
              key={i}
              onClick={() => handleClick(i)}
              style={{
                display: expandedIndex !== null && expandedIndex !== i ? 'none' : 'flex',
                flexDirection: 'column',
                justifyContent: 'flex-end',
                padding: expandedIndex === i ? '4rem' : '2rem',
                background: readItems.has(i) ? 'rgba(255,255,255,0.05)' : 'rgba(255,255,255,0.02)',
                minHeight: expandedIndex === i ? '70vh' : '200px',
                cursor: 'pointer',
                transition: 'all 0.5s cubic-bezier(0.16, 1, 0.3, 1)'
              }}
            >
              <div style={{ fontFamily: "'Share Tech Mono', monospace", fontSize: '0.6rem', letterSpacing: '0.15em', color: 'rgba(255,255,255,0.3)', marginBottom: expandedIndex === i ? '2rem' : '1rem' }}>
                {String(i + 1).padStart(2, '0')}
              </div>
              <h4 style={{
                fontFamily: "'Space Grotesk', sans-serif",
                fontSize: expandedIndex === i ? 'clamp(2rem, 4vw, 3rem)' : '1rem',
                fontWeight: 700,
                margin: '0 0 1rem',
                color: '#ffffff',
                textTransform: 'uppercase',
                lineHeight: 1.1,
                transition: 'font-size 0.3s'
              }}>
                <span>{b.title.split(' ')[0]}</span>
                {expandedIndex === i && <br />}
                <span style={{ color: 'rgba(255,255,255,0.5)' }}>{expandedIndex === i ? '' : ' '}{b.title.split(' ').slice(1).join(' ')}</span>
              </h4>
              {expandedIndex === i && (
                <>
                  <p style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: '1.15rem', color: 'rgba(255,255,255,0.6)', lineHeight: 1.8, margin: '0 0 3rem', maxWidth: '600px' }}>{b.desc}</p>
                  <div style={{ display: 'flex', gap: '4rem' }}>
                    <div>
                      <div style={{ fontFamily: "'Share Tech Mono', monospace", fontSize: '0.6rem', letterSpacing: '0.1em', color: 'rgba(255,255,255,0.3)', marginBottom: '0.5rem' }}>METRIC</div>
                      <div style={{ fontFamily: "'Share Tech Mono', monospace", fontSize: '2.5rem', fontWeight: 700, color: 'rgba(255,255,255,0.2)' }}>{b.stat}</div>
                    </div>
                    <div>
                      <div style={{ fontFamily: "'Share Tech Mono', monospace", fontSize: '0.6rem', letterSpacing: '0.1em', color: 'rgba(255,255,255,0.3)', marginBottom: '0.5rem' }}>CATEGORY</div>
                      <div style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: '1rem', fontWeight: 700, color: '#ffffff', textTransform: 'uppercase' }}>{b.category}</div>
                    </div>
                  </div>
                </>
              )}
              {expandedIndex === i && (
                <div style={{ position: 'absolute', top: '2rem', right: '2rem', fontSize: '2rem', color: 'rgba(255,255,255,0.5)' }}>×</div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

// ============================================
// VERSION 90: Ultimate Sticky Gallery
// Combines all best features: sticky, sync, read tracking
// ============================================
const Version90_UltimateStickyGallery = () => {
  const [activeIndex, setActiveIndex] = useState(0);
  const [readItems, setReadItems] = useState(new Set());
  const [hoveredIndex, setHoveredIndex] = useState(null);
  const containerRef = React.useRef(null);

  useEffect(() => {
    const handleScroll = () => {
      if (!containerRef.current) return;
      const items = containerRef.current.querySelectorAll('.ultimate-item');
      items.forEach((item, idx) => {
        const rect = item.getBoundingClientRect();
        const center = window.innerHeight / 2;
        if (rect.top < center && rect.bottom > center) {
          setActiveIndex(idx);
        }
        if (rect.bottom < center - 100) {
          setReadItems(prev => new Set([...prev, idx]));
        }
      });
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <section ref={containerRef} className="own-section" style={{ display: 'grid', gridTemplateColumns: '45% 55%' }}>
      <style>{globalStyles}</style>
      {/* Sticky Left Panel */}
      <div style={{ position: 'sticky', top: 0, height: '100vh', background: '#1a1a1a', display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
        {/* Header */}
        <div style={{ padding: '2rem', borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
          <h2 style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: '1.25rem', fontWeight: 700, margin: 0, textTransform: 'uppercase' }}>
            <span style={{ color: '#ffffff' }}>Ownership</span>{' '}
            <span style={{ color: 'rgba(255,255,255,0.4)' }}>Benefits</span>
          </h2>
        </div>
        {/* Main Content Area */}
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', padding: '3rem' }}>
          <div style={{ fontFamily: "'Share Tech Mono', monospace", fontSize: '0.6rem', letterSpacing: '0.2em', color: 'rgba(255,255,255,0.3)', marginBottom: '1.5rem' }}>
            {benefits[activeIndex]?.category.toUpperCase()} • {String(activeIndex + 1).padStart(2, '0')}
          </div>
          <h3 style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: 'clamp(2rem, 4vw, 3rem)', fontWeight: 700, margin: '0 0 2rem', textTransform: 'uppercase', lineHeight: 1.1 }}>
            <span style={{ color: '#ffffff' }}>{benefits[activeIndex]?.title.split(' ')[0]}</span><br />
            <span style={{ color: 'rgba(255,255,255,0.4)' }}>{benefits[activeIndex]?.title.split(' ').slice(1).join(' ')}</span>
          </h3>
          <div style={{ fontFamily: "'Share Tech Mono', monospace", fontSize: '4rem', fontWeight: 700, color: 'rgba(255,255,255,0.08)' }}>{benefits[activeIndex]?.stat}</div>
        </div>
        {/* Progress Footer */}
        <div style={{ padding: '2rem', borderTop: '1px solid rgba(255,255,255,0.1)' }}>
          <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1rem' }}>
            {benefits.map((_, i) => (
              <div key={i} style={{
                flex: 1,
                height: '2px',
                background: readItems.has(i) ? 'rgba(255,255,255,0.2)' : (activeIndex === i ? '#ffffff' : 'rgba(255,255,255,0.1)'),
                transition: 'all 0.3s'
              }} />
            ))}
          </div>
          <div style={{ fontFamily: "'Share Tech Mono', monospace", fontSize: '0.65rem', color: 'rgba(255,255,255,0.4)' }}>
            {readItems.size} / {benefits.length} EXPLORED
          </div>
        </div>
      </div>
      {/* Scrolling Right Content */}
      <div style={{ background: '#faf9f6' }}>
        {benefits.map((b, i) => (
          <div
            key={i}
            className="ultimate-item"
            onMouseEnter={() => setHoveredIndex(i)}
            onMouseLeave={() => setHoveredIndex(null)}
            style={{
              minHeight: '60vh',
              padding: '4rem 3rem',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
              background: readItems.has(i) ? '#f0efec' : (hoveredIndex === i ? '#ffffff' : '#faf9f6'),
              borderBottom: '1px solid #e8e6e2',
              borderLeft: activeIndex === i ? '4px solid #1a1a1a' : '4px solid transparent',
              transition: 'all 0.4s ease',
              cursor: 'pointer'
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
              <div style={{ fontFamily: "'Share Tech Mono', monospace", fontSize: '0.6rem', letterSpacing: '0.15em', color: '#999999' }}>{String(i + 1).padStart(2, '0')} • {b.category.toUpperCase()}</div>
              {readItems.has(i) && <span style={{ color: '#999999', fontSize: '0.9rem' }}>✓</span>}
            </div>
            <h4 style={{
              fontFamily: "'Space Grotesk', sans-serif",
              fontSize: hoveredIndex === i ? '1.5rem' : '1.25rem',
              fontWeight: 700,
              margin: '0 0 1rem',
              textTransform: 'uppercase',
              transition: 'font-size 0.3s'
            }}>
              <span style={{ color: '#1a1a1a' }}>{b.title.split(' ')[0]}</span>{' '}
              <span style={{ color: '#5a5a5a' }}>{b.title.split(' ').slice(1).join(' ')}</span>
            </h4>
            <p style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: '1rem', color: '#666666', lineHeight: 1.7, margin: 0 }}>{b.desc}</p>
            {hoveredIndex === i && (
              <div style={{ marginTop: '1.5rem', fontFamily: "'Share Tech Mono', monospace", fontSize: '2rem', fontWeight: 700, color: '#e8e6e2' }}>{b.stat}</div>
            )}
          </div>
        ))}
      </div>
    </section>
  );
};

// ============================================
// SECTIONS DATA FOR PICKER
// ============================================
const sections = {
  layouts: [
    { id: 'v1-cinematic', name: 'Cinematic Split', category: 'Hero', desc: 'Full-height cinematic layout with stats', component: Version1_CinematicSplit },
    { id: 'v2-timeline', name: 'Editorial Timeline', category: 'Vertical', desc: 'Elegant alternating timeline', component: Version2_EditorialTimeline },
    { id: 'v4-magazine', name: 'Magazine Editorial', category: 'Editorial', desc: 'Sophisticated magazine layout', component: Version4_MagazineEditorial },
    { id: 'v8-fullbleed', name: 'Full Bleed Alternating', category: 'Sections', desc: 'Large alternating sections', component: Version8_FullBleedAlternating },
    { id: 'v19-stickyscroll', name: 'Sticky Split Scroll', category: 'Interactive', desc: 'Sticky image with scrolling content', component: Version19_StickySplitScroll },
    { id: 'v22-newspaper', name: 'Newspaper Editorial', category: 'Print', desc: 'Multi-column newspaper style', component: Version22_NewspaperEditorial },
    { id: 'v29-layers', name: 'Overlapping Layers', category: 'Stacked', desc: 'Cascading layered cards', component: Version29_OverlappingLayers },
  ],
  cards: [
    { id: 'v3-stacked', name: 'Stacked Masonry', category: 'Cards', desc: 'Masonry grid with accent card', component: Version3_StackedCards },
    { id: 'v11-icons', name: 'Icon Showcase', category: 'Grid', desc: 'Large icons with descriptions', component: Version11_IconShowcase },
    { id: 'v12-photo', name: 'Photo Grid', category: 'Visual', desc: 'Image-focused card grid', component: Version12_PhotoGrid },
    { id: 'v15-feature', name: 'Feature Hero', category: 'Mixed', desc: 'Hero banner with feature cards', component: Version15_FeatureHero },
    { id: 'v18-bento', name: 'Bento Grid', category: 'Modern', desc: 'Asymmetric bento layout', component: Version18_BentoGrid },
    { id: 'v23-polaroid', name: 'Polaroid Album', category: 'Photo', desc: 'Tilted polaroid-style cards', component: Version23_PolaroidAlbum },
    { id: 'v27-perspective', name: '3D Perspective', category: '3D', desc: 'Depth perspective cards', component: Version27_PerspectiveCards },
    { id: 'v45-documentary', name: 'Documentary Editorial', category: 'Editorial', desc: 'Magazine-style editorial layout', component: Version45_Documentary },
    { id: 'v48-fullbleed', name: 'Full Bleed Cards', category: 'Expansive', desc: 'Large sectioned card layout', component: Version48_FullBleedCards },
  ],
  interactive: [
    { id: 'v9-accordion', name: 'Accordion Elegant', category: 'Interactive', desc: 'Expandable benefit items', component: Version9_AccordionElegant },
    { id: 'v5-comparison', name: 'Luxury Comparison', category: 'Table', desc: 'Commercial vs Private table', component: Version5_LuxuryComparison },
    { id: 'v6-dataviz', name: 'Data Visualization', category: 'Stats', desc: 'Numbers-focused layout', component: Version6_DataViz },
    { id: 'v13-dashboard', name: 'Dashboard', category: 'Analytics', desc: 'Metrics-focused dark design', component: Version13_Dashboard },
    { id: 'v24-flipcards', name: 'Flip Cards', category: 'Reveal', desc: 'Interactive flip-to-reveal cards', component: Version24_FlipCards },
    { id: 'v30-sidebar', name: 'Sidebar Navigation', category: 'Nav', desc: 'Side navigation with detail view', component: Version30_SidebarNav },
    { id: 'v46-split', name: 'Split Contrast', category: 'Dual', desc: 'Dark/light split layout', component: Version46_SplitContrast },
    { id: 'v47-timeline', name: 'Vertical Timeline', category: 'Timeline', desc: 'Benefits on a vertical timeline', component: Version47_VerticalTimeline },
  ],
  testimonial: [
    { id: 'v7-spotlight', name: 'Testimonial Spotlight', category: 'Stories', desc: 'Featured owner quote', component: Version7_TestimonialSpotlight },
    { id: 'v14-quotes', name: 'Quote Grid', category: 'Quotes', desc: 'Multiple owner testimonials', component: Version14_QuoteGrid },
  ],
  minimal: [
    { id: 'v10-list', name: 'Minimal List', category: 'Clean', desc: 'Elegant numbered list', component: Version10_MinimalList },
    { id: 'v16-checklist', name: 'Checklist', category: 'Check', desc: 'Checkmark benefits with CTA', component: Version16_Checklist },
    { id: 'v17-ribbons', name: 'Staggered Ribbons', category: 'Ribbons', desc: 'Offset ribbon layout', component: Version17_StaggeredRibbons },
    { id: 'v25-progress', name: 'Vertical Progress', category: 'Journey', desc: 'Progress timeline with CTA', component: Version25_VerticalProgress },
  ],
  hero: [
    { id: 'v20-hero', name: 'Hero Impact', category: 'Full', desc: 'Full-screen immersive hero', component: Version20_HeroImpact },
    { id: 'v50-showcase', name: 'Comprehensive Showcase', category: 'Ultimate', desc: 'Complete ownership presentation', component: Version50_ComprehensiveShowcase },
  ],
  cinematic: [
    { id: 'v21-gallery', name: 'Horizontal Gallery', category: 'Scroll', desc: 'Horizontal scrolling cards', component: Version21_HorizontalGallery },
    { id: 'v26-filmstrip', name: 'Film Strip', category: 'Cinema', desc: 'Cinematic film reel style', component: Version26_FilmStrip },
    { id: 'v28-radial', name: 'Radial Layout', category: 'Circular', desc: 'Orbital benefit arrangement', component: Version28_RadialLayout },
  ],
  brandCompliant: [
    { id: 'v31-grid', name: 'Grid Precision', category: 'Editorial', desc: 'Clean grid-based layout', component: Version31_GridPrecision },
    { id: 'v32-asymmetric', name: 'Asymmetric Editorial', category: 'Editorial', desc: 'Dynamic asymmetric layout', component: Version32_AsymmetricEditorial },
    { id: 'v33-dark', name: 'Dark Contrast', category: 'Dark', desc: 'High contrast dark theme', component: Version33_DarkContrast },
    { id: 'v34-splithero', name: 'Split Hero', category: 'Hero', desc: 'Split-screen hero layout', component: Version34_SplitHero },
    { id: 'v35-focus', name: 'Focus Selector', category: 'Interactive', desc: 'Interactive focus selection', component: Version35_FocusSelector },
    { id: 'v36-twocolumn', name: 'Two Column Cards', category: 'Cards', desc: 'Clean two-column card grid', component: Version36_TwoColumnCards },
    { id: 'v37-stats', name: 'Stats Focused', category: 'Data', desc: 'Statistics-focused layout', component: Version37_StatsFocused },
    { id: 'v38-fullwidth', name: 'Full Width Sections', category: 'Sections', desc: 'Full-width section layout', component: Version38_FullWidthSections },
    { id: 'v39-minimal', name: 'Minimal Centered', category: 'Minimal', desc: 'Ultra-minimal centered design', component: Version39_MinimalCentered },
    { id: 'v40-threecol', name: 'Three Column Grid', category: 'Grid', desc: 'Clean three-column grid', component: Version40_ThreeColumnGrid },
    { id: 'v41-alternating', name: 'Alternating Sides', category: 'Zigzag', desc: 'Alternating left-right layout', component: Version41_AlternatingSides },
    { id: 'v42-hover', name: 'Hover Expand', category: 'Interactive', desc: 'Expand on hover interaction', component: Version42_HoverExpand },
    { id: 'v43-staggered', name: 'Staggered Cards', category: 'Cards', desc: 'Staggered card arrangement', component: Version43_StaggeredCards },
    { id: 'v44-numbers', name: 'Large Numbers', category: 'Typography', desc: 'Prominent number displays', component: Version44_LargeNumbers },
    { id: 'v49-instrument', name: 'Instrument Panel', category: 'Tech', desc: 'Aviation instrument aesthetics', component: Version49_InstrumentPanel },
  ],
  enhanced: [
    { id: 'v51-stickyimage', name: 'Sticky Image Scroll', category: 'Sticky', desc: 'Sticky left with changing images + read tracking', component: Version51_StickyImageScroll },
    { id: 'v52-readprogress', name: 'Read Progress Tracker', category: 'Scroll', desc: 'Items turn grey as you scroll past', component: Version52_ReadProgressTracker },
    { id: 'v53-gradientheadlines', name: 'Gradient Headlines', category: 'Typography', desc: 'Large gradient text headers', component: Version53_GradientHeadlines },
    { id: 'v54-hovercardexpand', name: 'Hover Card Expand', category: 'Hover', desc: 'Cards expand with details on hover', component: Version54_HoverCardExpand },
    { id: 'v55-scrollsyncgallery', name: 'Scroll Synced Gallery', category: 'Sticky', desc: 'Image panel synced to scroll position', component: Version55_ScrollSyncedGallery },
    { id: 'v56-hoverslide', name: 'Hover Slide Reveal', category: 'Hover', desc: 'Content slides in from side on hover', component: Version56_HoverSlideReveal },
    { id: 'v57-categorygradient', name: 'Category Gradient Sections', category: 'Sections', desc: 'Each category with gradient header', component: Version57_CategoryGradientSections },
    { id: 'v58-dualpanel', name: 'Dual Panel Scroll', category: 'Sticky', desc: 'Two panels synced on scroll', component: Version58_DualPanelScroll },
    { id: 'v59-hoverborder', name: 'Hover Border Animation', category: 'Hover', desc: 'Animated borders on hover', component: Version59_HoverBorderAnimation },
    { id: 'v60-progressivereveal', name: 'Progressive Reveal', category: 'Scroll', desc: 'Items reveal with scroll + stay grey', component: Version60_ProgressiveReveal },
    { id: 'v61-stickyheader', name: 'Sticky Header Scroll', category: 'Sticky', desc: 'Gradient header stays, list scrolls with read state', component: Version61_StickyHeaderScroll },
    { id: 'v62-magazinespread', name: 'Magazine Spread', category: 'Editorial', desc: 'Full-bleed magazine style with scroll', component: Version62_MagazineSpread },
    { id: 'v63-clickexpand', name: 'Click Expand Grid', category: 'Interactive', desc: 'Click cards to expand with full details', component: Version63_ClickExpandGrid },
    { id: 'v64-horizontalscroll', name: 'Horizontal Scroll Cards', category: 'Scroll', desc: 'Horizontal scrolling with gradient headers', component: Version64_HorizontalScrollCards },
    { id: 'v65-fullscreen', name: 'Full Screen Takeover', category: 'Immersive', desc: 'Each benefit takes full screen on scroll', component: Version65_FullScreenTakeover },
    { id: 'v66-tabsscroll', name: 'Tabs + Scroll Tracker', category: 'Interactive', desc: 'Category tabs with scroll tracking', component: Version66_TabsScrollTracker },
    { id: 'v67-masonryhover', name: 'Masonry Hover Grid', category: 'Hover', desc: 'Masonry layout with hover expand', component: Version67_MasonryHoverGrid },
    { id: 'v68-splitimagetext', name: 'Split Image Text Scroll', category: 'Sticky', desc: 'Image on one side, scrolling text with read tracking', component: Version68_SplitImageTextScroll },
    { id: 'v69-gradientaccordion', name: 'Gradient Accordion', category: 'Interactive', desc: 'Accordion style with gradient title colors', component: Version69_GradientAccordion },
    { id: 'v70-ultimate', name: 'Ultimate Combined', category: 'Ultimate', desc: 'All favorite features combined', component: Version70_UltimateCombined },
  ],
  premium: [
    { id: 'v71-cinematicjourney', name: 'Cinematic Vertical Journey', category: 'Immersive', desc: 'Full-screen vertical scroll with cinematic transitions', component: Version71_CinematicVerticalJourney },
    { id: 'v72-triplepanel', name: 'Triple Panel Sync', category: 'Sticky', desc: 'Three-panel layout with synced scroll', component: Version72_TriplePanelSync },
    { id: 'v73-horizontalpanoramic', name: 'Horizontal Panoramic', category: 'Scroll', desc: 'Full-screen horizontal scroll with sticky nav', component: Version73_HorizontalPanoramic },
    { id: 'v74-stackedcardreveal', name: 'Stacked Card Reveal', category: 'Scroll', desc: 'Cards stack and reveal on scroll', component: Version74_StackedCardReveal },
    { id: 'v75-spotlightfocus', name: 'Spotlight Focus', category: 'Immersive', desc: 'Dramatic spotlight with one benefit at a time', component: Version75_SpotlightFocus },
    { id: 'v76-metrogrid', name: 'Metro Grid Scroll', category: 'Grid', desc: 'Windows Metro-style tiles with scroll tracking', component: Version76_MetroGridScroll },
    { id: 'v77-stickysidebar', name: 'Sticky Sidebar Categories', category: 'Sticky', desc: 'Sticky category sidebar with scrolling content', component: Version77_StickySidebarCategories },
    { id: 'v78-alternatingfullbleed', name: 'Alternating Full Bleed', category: 'Immersive', desc: 'Alternating full-width sections with gradient text', component: Version78_AlternatingFullBleed },
    { id: 'v79-parallaxdepth', name: 'Parallax Depth Scroll', category: 'Scroll', desc: 'Parallax layers with depth effect', component: Version79_ParallaxDepthScroll },
    { id: 'v80-expandingaccordion', name: 'Expanding Accordion Stack', category: 'Interactive', desc: 'Accordion that expands to full view on click', component: Version80_ExpandingAccordionStack },
    { id: 'v81-splitscrollgallery', name: 'Split Scroll Gallery', category: 'Sticky', desc: 'Image gallery synced with text content', component: Version81_SplitScrollGallery },
    { id: 'v82-diagonalreveal', name: 'Diagonal Section Reveal', category: 'Scroll', desc: 'Diagonal sections with scroll reveal', component: Version82_DiagonalSectionReveal },
    { id: 'v83-minimaltypewriter', name: 'Minimal Typewriter', category: 'Minimal', desc: 'Typewriter effect with clean minimal design', component: Version83_MinimalTypewriter },
    { id: 'v84-cardstackpeek', name: 'Card Stack Peek', category: 'Scroll', desc: 'Stacked cards that peek on scroll', component: Version84_CardStackPeek },
    { id: 'v85-immersivefullwidth', name: 'Immersive Full Width', category: 'Immersive', desc: 'Full-width immersive sections', component: Version85_ImmersiveFullWidth },
    { id: 'v86-scrollingticker', name: 'Scrolling Ticker', category: 'Scroll', desc: 'Continuous ticker with focus on scroll', component: Version86_ScrollingTicker },
    { id: 'v87-minimalistcolumn', name: 'Minimalist Column', category: 'Minimal', desc: 'Single column ultra-minimal design', component: Version87_MinimalistColumn },
    { id: 'v88-fixedcounter', name: 'Fixed Counter Scroll', category: 'Sticky', desc: 'Fixed large counter with scrolling content', component: Version88_FixedCounterScroll },
    { id: 'v89-gallerylightbox', name: 'Gallery Lightbox Scroll', category: 'Interactive', desc: 'Grid that expands items on scroll', component: Version89_GalleryLightboxScroll },
    { id: 'v90-ultimatesticky', name: 'Ultimate Sticky Gallery', category: 'Ultimate', desc: 'Combines sticky, sync, and read tracking', component: Version90_UltimateStickyGallery },
  ],
};

const tabs = [
  { key: 'layouts', label: 'Layouts', color: 'default' },
  { key: 'cards', label: 'Cards', color: 'copper' },
  { key: 'interactive', label: 'Interactive', color: 'green' },
  { key: 'testimonial', label: 'Testimonial', color: 'purple' },
  { key: 'minimal', label: 'Minimal', color: 'stone' },
  { key: 'hero', label: 'Hero', color: 'default' },
  { key: 'cinematic', label: 'Cinematic', color: 'copper' },
  { key: 'brandCompliant', label: 'Brand Compliant', color: 'default' },
  { key: 'enhanced', label: 'Enhanced', color: 'green' },
  { key: 'premium', label: 'Premium (New)', color: 'purple' },
];

// ============================================
// PICKER STYLES
// ============================================
const pickerStyles = `
  @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,500;0,600;1,400&family=DM+Sans:wght@400;500;600&family=JetBrains+Mono:wght@400;500&display=swap');

  .ownership-picker {
    position: fixed;
    bottom: 24px;
    left: 24px;
    width: 440px;
    background: #fdfcfa;
    border-radius: 20px;
    box-shadow: 0 20px 60px rgba(0,0,0,0.15), 0 0 0 1px rgba(0,0,0,0.05);
    z-index: 100000;
    font-family: 'DM Sans', sans-serif;
    transition: all 0.4s cubic-bezier(0.22, 1, 0.36, 1);
    overflow: hidden;
  }

  .ownership-picker.minimized {
    transform: translateY(calc(100% - 52px));
  }

  .ownership-picker__collapsed-bar {
    display: none;
    height: 52px;
    background: #0d0d0d;
    padding: 0 20px;
    align-items: center;
    justify-content: space-between;
    color: #f8f6f1;
    cursor: pointer;
  }

  .ownership-picker.minimized .ownership-picker__collapsed-bar {
    display: flex;
  }

  .ownership-picker__collapsed-info {
    display: flex;
    align-items: center;
    gap: 16px;
  }

  .ownership-picker__collapsed-name {
    font-weight: 600;
    font-size: 14px;
  }

  .ownership-picker__collapsed-counter {
    opacity: 0.5;
    font-size: 12px;
    font-family: 'JetBrains Mono', monospace;
  }

  .ownership-picker__collapsed-nav {
    display: flex;
    gap: 8px;
  }

  .ownership-picker__collapsed-btn {
    width: 32px;
    height: 32px;
    border: none;
    background: rgba(248,246,241,0.1);
    color: #f8f6f1;
    border-radius: 8px;
    cursor: pointer;
    font-size: 14px;
    transition: background 0.2s;
  }

  .ownership-picker__collapsed-btn:hover {
    background: rgba(248,246,241,0.2);
  }

  .ownership-picker__main {
    display: block;
  }

  .ownership-picker.minimized .ownership-picker__main {
    visibility: hidden;
    height: 0;
    overflow: hidden;
  }

  .ownership-picker__header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 16px 20px;
    border-bottom: 1px solid #e8e4dc;
  }

  .ownership-picker__title {
    font-family: 'Playfair Display', serif;
    font-size: 16px;
    font-weight: 500;
    margin: 0;
    color: #0d0d0d;
  }

  .ownership-picker__minimize {
    width: 32px;
    height: 32px;
    border: 1px solid #e8e4dc;
    background: transparent;
    border-radius: 8px;
    cursor: pointer;
    font-size: 16px;
    color: #8a8580;
    transition: all 0.2s;
  }

  .ownership-picker__minimize:hover {
    border-color: #c17f59;
    color: #c17f59;
  }

  .ownership-picker__tabs {
    display: flex;
    flex-wrap: wrap;
    gap: 6px;
    padding: 16px 20px;
    background: #f8f6f1;
    border-bottom: 1px solid #e8e4dc;
  }

  .ownership-picker__tab {
    padding: 8px 14px;
    font-size: 12px;
    font-weight: 500;
    background: #fdfcfa;
    border: 1px solid #e8e4dc;
    border-radius: 8px;
    cursor: pointer;
    transition: all 0.2s;
    color: #8a8580;
  }

  .ownership-picker__tab:hover {
    border-color: #0d0d0d;
    color: #0d0d0d;
  }

  .ownership-picker__tab.active {
    background: #0d0d0d;
    color: #f8f6f1;
    border-color: #0d0d0d;
  }

  .ownership-picker__tab--copper { background: rgba(193,127,89,0.1); border-color: #c17f59; color: #c17f59; }
  .ownership-picker__tab--copper:hover { background: rgba(193,127,89,0.2); }
  .ownership-picker__tab--copper.active { background: #c17f59; color: #f8f6f1; border-color: #c17f59; }

  .ownership-picker__tab--green { background: rgba(76,143,80,0.1); border-color: #4c8f50; color: #4c8f50; }
  .ownership-picker__tab--green:hover { background: rgba(76,143,80,0.2); }
  .ownership-picker__tab--green.active { background: #4c8f50; color: #f8f6f1; border-color: #4c8f50; }

  .ownership-picker__tab--purple { background: rgba(139,92,159,0.1); border-color: #8b5c9f; color: #8b5c9f; }
  .ownership-picker__tab--purple:hover { background: rgba(139,92,159,0.2); }
  .ownership-picker__tab--purple.active { background: #8b5c9f; color: #f8f6f1; border-color: #8b5c9f; }

  .ownership-picker__tab--stone { background: rgba(138,133,128,0.1); border-color: #8a8580; color: #8a8580; }
  .ownership-picker__tab--stone:hover { background: rgba(138,133,128,0.2); }
  .ownership-picker__tab--stone.active { background: #8a8580; color: #f8f6f1; border-color: #8a8580; }

  .ownership-picker__content {
    padding: 20px;
  }

  .ownership-picker__nav {
    display: flex;
    align-items: center;
    gap: 16px;
    position: relative;
  }

  .ownership-picker__nav-btn {
    width: 44px;
    height: 44px;
    border: 1px solid #e8e4dc;
    background: transparent;
    border-radius: 12px;
    cursor: pointer;
    font-size: 18px;
    color: #0d0d0d;
    transition: all 0.2s;
    flex-shrink: 0;
  }

  .ownership-picker__nav-btn:hover {
    background: #0d0d0d;
    color: #f8f6f1;
    border-color: #0d0d0d;
  }

  .ownership-picker__info {
    flex: 1;
    text-align: center;
    min-width: 0;
  }

  .ownership-picker__category {
    display: block;
    font-family: 'JetBrains Mono', monospace;
    font-size: 10px;
    font-weight: 500;
    text-transform: uppercase;
    letter-spacing: 0.15em;
    color: #c17f59;
    margin-bottom: 4px;
  }

  .ownership-picker__counter {
    font-family: 'JetBrains Mono', monospace;
    font-size: 10px;
    color: #8a8580;
  }

  .ownership-picker__name {
    font-family: 'Playfair Display', serif;
    font-size: 16px;
    font-weight: 500;
    margin: 6px 0;
    color: #0d0d0d;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  .ownership-picker__desc {
    font-size: 12px;
    color: #8a8580;
    margin: 0;
  }

  .ownership-picker__fav-btn {
    position: absolute;
    right: 0;
    top: 50%;
    transform: translateY(-50%);
    width: 44px;
    height: 44px;
    border: 2px solid #e8e4dc;
    background: transparent;
    border-radius: 50%;
    cursor: pointer;
    font-size: 20px;
    color: #e8e4dc;
    transition: all 0.2s;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .ownership-picker__fav-btn:hover {
    border-color: #c17f59;
    color: #c17f59;
  }

  .ownership-picker__fav-btn.active {
    background: #c17f59;
    border-color: #c17f59;
    color: #f8f6f1;
  }

  .ownership-picker__footer {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 16px 20px;
    background: #f8f6f1;
    border-top: 1px solid #e8e4dc;
  }

  .ownership-picker__footer-left {
    display: flex;
    gap: 8px;
  }

  .ownership-picker__btn {
    padding: 8px 16px;
    font-size: 12px;
    font-weight: 500;
    background: #0d0d0d;
    color: #f8f6f1;
    border: none;
    border-radius: 8px;
    cursor: pointer;
    transition: all 0.2s;
  }

  .ownership-picker__btn:hover {
    background: #2a2a2a;
  }

  .ownership-picker__btn--favs {
    background: #8a8580;
  }

  .ownership-picker__btn--favs.has-items {
    background: #c17f59;
  }

  .ownership-picker__btn--copy {
    background: #8b5c9f;
  }

  .ownership-picker__fav-count {
    display: inline-block;
    min-width: 18px;
    padding: 0 6px;
    background: rgba(255,255,255,0.2);
    border-radius: 10px;
    font-size: 10px;
    margin-left: 4px;
  }

  .ownership-picker__hints {
    display: flex;
    gap: 12px;
    font-size: 10px;
    color: #8a8580;
  }

  .ownership-picker__hints kbd {
    background: #fdfcfa;
    border: 1px solid #e8e4dc;
    border-radius: 4px;
    padding: 2px 6px;
    font-family: 'JetBrains Mono', monospace;
    font-size: 9px;
    margin-right: 2px;
  }

  .ownership-picker__grid-overlay {
    position: fixed;
    inset: 0;
    background: rgba(13,13,13,0.9);
    backdrop-filter: blur(10px);
    z-index: 100002;
    display: none;
    flex-direction: column;
  }

  .ownership-picker__grid-overlay.active {
    display: flex;
  }

  .ownership-picker__grid-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 24px 32px;
    background: #fdfcfa;
  }

  .ownership-picker__grid-header h2 {
    font-family: 'Playfair Display', serif;
    margin: 0;
    font-size: 20px;
    font-weight: 500;
    color: #0d0d0d;
  }

  .ownership-picker__grid-close {
    width: 44px;
    height: 44px;
    border: 1px solid #e8e4dc;
    background: transparent;
    border-radius: 12px;
    cursor: pointer;
    font-size: 20px;
    color: #8a8580;
    transition: all 0.2s;
  }

  .ownership-picker__grid-close:hover {
    border-color: #c17f59;
    color: #c17f59;
  }

  .ownership-picker__grid-content {
    flex: 1;
    overflow-y: auto;
    padding: 32px;
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
    gap: 16px;
    align-content: start;
  }

  .ownership-picker__grid-item {
    background: #fdfcfa;
    border-radius: 16px;
    padding: 20px;
    cursor: pointer;
    transition: all 0.3s cubic-bezier(0.22, 1, 0.36, 1);
    border: 1px solid transparent;
  }

  .ownership-picker__grid-item:hover {
    transform: translateY(-4px);
    box-shadow: 0 20px 40px rgba(0,0,0,0.15);
    border-color: #c17f59;
  }

  .ownership-picker__grid-item__name {
    font-family: 'Playfair Display', serif;
    font-weight: 500;
    font-size: 15px;
    margin-bottom: 6px;
    color: #0d0d0d;
  }

  .ownership-picker__grid-item__desc {
    font-size: 12px;
    color: #8a8580;
  }

  /* Has note indicator */
  .ownership-picker__fav-btn.has-note::after {
    content: '';
    position: absolute;
    bottom: -2px;
    right: -2px;
    width: 10px;
    height: 10px;
    background: #3b82f6;
    border-radius: 50%;
    border: 2px solid #fdfcfa;
  }

  /* Copy button states */
  .ownership-picker__btn--copy.success {
    background: #22c55e !important;
  }

  .ownership-picker__btn--copy.error {
    background: #ef4444 !important;
  }

  /* Note Modal */
  .ownership-picker__note-modal {
    position: fixed;
    inset: 0;
    background: rgba(0,0,0,0.5);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 100003;
    animation: pickerFadeIn 0.15s ease-out;
  }

  @keyframes pickerFadeIn {
    from { opacity: 0; }
    to { opacity: 1; }
  }

  .ownership-picker__note-content {
    background: #fdfcfa;
    border-radius: 16px;
    padding: 24px;
    width: 340px;
    box-shadow: 0 20px 60px rgba(0,0,0,0.3);
    animation: pickerSlideUp 0.2s ease-out;
  }

  @keyframes pickerSlideUp {
    from { opacity: 0; transform: translateY(10px); }
    to { opacity: 1; transform: translateY(0); }
  }

  .ownership-picker__note-header {
    display: flex;
    align-items: center;
    gap: 10px;
    font-weight: 600;
    font-size: 15px;
    margin-bottom: 12px;
    color: #0d0d0d;
  }

  .ownership-picker__note-icon {
    color: #c17f59;
    font-size: 20px;
  }

  .ownership-picker__note-name {
    font-size: 13px;
    color: #8a8580;
    margin-bottom: 16px;
    padding: 10px 14px;
    background: #f8f6f1;
    border-radius: 8px;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  .ownership-picker__note-input {
    width: 100%;
    padding: 12px 14px;
    border: 2px solid #e8e4dc;
    border-radius: 10px;
    font-size: 14px;
    font-family: 'DM Sans', sans-serif;
    resize: none;
    transition: border-color 0.2s;
    box-sizing: border-box;
  }

  .ownership-picker__note-input:focus {
    outline: none;
    border-color: #c17f59;
  }

  .ownership-picker__note-actions {
    display: flex;
    gap: 10px;
    margin-top: 16px;
  }

  .ownership-picker__note-cancel,
  .ownership-picker__note-save {
    flex: 1;
    padding: 10px 18px;
    border: none;
    border-radius: 8px;
    font-size: 13px;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.2s;
  }

  .ownership-picker__note-cancel {
    background: #f8f6f1;
    color: #8a8580;
  }

  .ownership-picker__note-cancel:hover {
    background: #e8e4dc;
  }

  .ownership-picker__note-save {
    background: #c17f59;
    color: #f8f6f1;
  }

  .ownership-picker__note-save:hover {
    background: #a66a48;
  }

  /* Favorites Panel */
  .ownership-picker__favs-panel {
    position: fixed;
    bottom: 90px;
    left: 24px;
    width: 380px;
    max-height: 420px;
    background: #fdfcfa;
    border-radius: 16px;
    box-shadow: 0 20px 60px rgba(0,0,0,0.25);
    z-index: 100003;
    display: flex;
    flex-direction: column;
    animation: pickerSlideUp 0.2s ease-out;
  }

  .ownership-picker__favs-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 16px 20px;
    border-bottom: 1px solid #e8e4dc;
    font-size: 15px;
    color: #0d0d0d;
  }

  .ownership-picker__favs-close {
    width: 28px;
    height: 28px;
    border: none;
    background: #f8f6f1;
    border-radius: 50%;
    cursor: pointer;
    font-size: 18px;
    line-height: 1;
    color: #8a8580;
    transition: all 0.2s;
  }

  .ownership-picker__favs-close:hover {
    background: #e8e4dc;
    color: #0d0d0d;
  }

  .ownership-picker__favs-list {
    flex: 1;
    overflow-y: auto;
    max-height: 300px;
  }

  .ownership-picker__favs-item {
    padding: 14px 20px;
    border-bottom: 1px solid #f0f0f0;
    transition: background 0.15s;
  }

  .ownership-picker__favs-item:hover {
    background: #f8f6f1;
  }

  .ownership-picker__favs-item-main {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 6px;
    cursor: pointer;
  }

  .ownership-picker__favs-item-name {
    font-weight: 600;
    font-size: 14px;
    color: #0d0d0d;
  }

  .ownership-picker__favs-item-id {
    font-size: 10px;
    color: #8a8580;
    font-family: 'JetBrains Mono', monospace;
  }

  .ownership-picker__favs-item-note {
    font-size: 13px;
    color: #666;
    padding: 8px 12px;
    background: #f8f6f1;
    border-radius: 6px;
    margin: 8px 0;
  }

  .ownership-picker__favs-item-note.empty {
    color: #bbb;
    font-style: italic;
  }

  .ownership-picker__favs-item-actions {
    display: flex;
    gap: 8px;
    justify-content: flex-end;
  }

  .ownership-picker__favs-item-btn {
    width: 32px;
    height: 32px;
    border: 1px solid #e8e4dc;
    background: #fff;
    border-radius: 8px;
    cursor: pointer;
    font-size: 14px;
    transition: all 0.15s;
  }

  .ownership-picker__favs-item-btn.edit:hover {
    border-color: #3b82f6;
    background: #eff6ff;
  }

  .ownership-picker__favs-item-btn.delete:hover {
    border-color: #ef4444;
    background: #fef2f2;
  }

  .ownership-picker__favs-footer {
    display: flex;
    gap: 10px;
    padding: 16px 20px;
    border-top: 1px solid #e8e4dc;
  }

  .ownership-picker__favs-footer-btn {
    flex: 1;
    padding: 10px 16px;
    border: none;
    border-radius: 8px;
    font-size: 13px;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.15s;
  }

  .ownership-picker__favs-footer-btn.copy {
    background: #8b5c9f;
    color: #fff;
  }

  .ownership-picker__favs-footer-btn.copy:hover {
    background: #7a4f8c;
  }

  .ownership-picker__favs-footer-btn.clear {
    background: #f8f6f1;
    color: #8a8580;
  }

  .ownership-picker__favs-footer-btn.clear:hover {
    background: #fee2e2;
    color: #dc2626;
  }

  @media (max-width: 520px) {
    .ownership-picker {
      left: 16px;
      right: 16px;
      width: auto;
    }

    .ownership-picker__favs-panel {
      left: 16px;
      right: 16px;
      width: auto;
    }
  }
`;

// ============================================
// MAIN PICKER COMPONENT
// ============================================
const OwnershipBenefitsPicker = () => {
  const [currentTab, setCurrentTab] = useState('layouts');
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isMinimized, setIsMinimized] = useState(false);
  const [isGridOpen, setIsGridOpen] = useState(false);
  const [favorites, setFavorites] = useState([]);
  const [showNoteModal, setShowNoteModal] = useState(null);
  const [showFavsPanel, setShowFavsPanel] = useState(false);
  const [copyFeedback, setCopyFeedback] = useState(null);
  const noteInputRef = React.useRef(null);

  const storageKey = 'ownership-benefits-picker-favorites-v3';

  useEffect(() => {
    const stored = localStorage.getItem(storageKey);
    if (stored) {
      try {
        let parsed = JSON.parse(stored);
        // Migrate old format (no notes) to new format
        if (parsed.length > 0 && !parsed[0].hasOwnProperty('note')) {
          parsed = parsed.map(f => ({ ...f, note: '' }));
        }
        setFavorites(parsed);
      } catch (e) {}
    }
  }, []);

  useEffect(() => {
    localStorage.setItem(storageKey, JSON.stringify(favorites));
  }, [favorites]);

  // Focus note input when modal opens
  useEffect(() => {
    if (showNoteModal && noteInputRef.current) {
      noteInputRef.current.focus();
    }
  }, [showNoteModal]);

  const currentItems = sections[currentTab] || [];
  const currentItem = currentItems[currentIndex];
  const tabKeys = tabs.map(t => t.key);

  const goNext = useCallback(() => {
    if (currentIndex < currentItems.length - 1) {
      setCurrentIndex(prev => prev + 1);
    } else {
      let nextTabIdx = (tabKeys.indexOf(currentTab) + 1) % tabKeys.length;
      setCurrentTab(tabKeys[nextTabIdx]);
      setCurrentIndex(0);
    }
  }, [currentIndex, currentItems.length, currentTab, tabKeys]);

  const goPrev = useCallback(() => {
    if (currentIndex > 0) {
      setCurrentIndex(prev => prev - 1);
    } else {
      let prevTabIdx = (tabKeys.indexOf(currentTab) - 1 + tabKeys.length) % tabKeys.length;
      const prevItems = sections[tabKeys[prevTabIdx]] || [];
      setCurrentTab(tabKeys[prevTabIdx]);
      setCurrentIndex(Math.max(0, prevItems.length - 1));
    }
  }, [currentIndex, currentTab, tabKeys]);

  // Favorites helpers
  const isFavorite = useCallback((id) => favorites.some(f => f.id === id), [favorites]);
  const getFavorite = useCallback((id) => favorites.find(f => f.id === id), [favorites]);

  const handleToggleFavorite = () => {
    if (!currentItem) return;
    if (isFavorite(currentItem.id)) {
      setFavorites(prev => prev.filter(f => f.id !== currentItem.id));
    } else {
      setShowNoteModal({ id: currentItem.id, name: currentItem.name });
    }
  };

  const handleSaveFavorite = (note) => {
    if (!showNoteModal) return;
    setFavorites(prev => [...prev, { id: showNoteModal.id, name: showNoteModal.name, note: note || '' }]);
    setShowNoteModal(null);
  };

  const handleEditNote = (idx) => {
    const fav = favorites[idx];
    const newNote = prompt('Edit note:', fav.note || '');
    if (newNote !== null) {
      setFavorites(prev => prev.map((f, i) => i === idx ? { ...f, note: newNote } : f));
    }
  };

  const handleDeleteFavorite = (idx) => {
    setFavorites(prev => prev.filter((_, i) => i !== idx));
  };

  const navigateToFavorite = (fav) => {
    for (const [tabKey, items] of Object.entries(sections)) {
      const idx = items.findIndex(s => s.id === fav.id);
      if (idx !== -1) {
        setCurrentTab(tabKey);
        setCurrentIndex(idx);
        setShowFavsPanel(false);
        break;
      }
    }
  };

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') return;
      if (e.key === 'ArrowRight') { e.preventDefault(); goNext(); }
      if (e.key === 'ArrowLeft') { e.preventDefault(); goPrev(); }
      if (e.key === 'f' || e.key === 'F') { e.preventDefault(); handleToggleFavorite(); }
      if (e.key === 'm' || e.key === 'M') { e.preventDefault(); setIsMinimized(prev => !prev); }
      if (e.key === 'Escape') {
        if (showNoteModal) setShowNoteModal(null);
        else if (showFavsPanel) setShowFavsPanel(false);
        else if (isGridOpen) setIsGridOpen(false);
        else setIsMinimized(prev => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [goNext, goPrev, currentItem, favorites, isGridOpen, showNoteModal, showFavsPanel]);

  const currentFav = currentItem ? getFavorite(currentItem.id) : null;
  const CurrentComponent = currentItem?.component;

  const handleCopyFavorites = () => {
    if (favorites.length === 0) {
      setCopyFeedback({ message: 'No favorites!', success: false });
      setTimeout(() => setCopyFeedback(null), 2000);
      return;
    }
    const lines = favorites.map(f => {
      let line = f.id;
      if (f.name) line += ` (${f.name})`;
      if (f.note) line += `\n   → ${f.note}`;
      return line;
    });
    const text = lines.join('\n\n');
    navigator.clipboard.writeText(text).then(() => {
      setCopyFeedback({ message: `Copied ${favorites.length}!`, success: true });
    }).catch(() => {
      setCopyFeedback({ message: 'Copy failed', success: false });
    });
    setTimeout(() => setCopyFeedback(null), 2000);
  };

  const handleClearFavorites = () => {
    if (confirm('Remove all favorites?')) {
      setFavorites([]);
      setShowFavsPanel(false);
    }
  };

  return (
    <>
      <style>{pickerStyles}</style>
      {CurrentComponent && <CurrentComponent />}

      <div className={`ownership-picker ${isMinimized ? 'minimized' : ''}`}>
        <div className="ownership-picker__collapsed-bar" onClick={() => setIsMinimized(false)}>
          <div className="ownership-picker__collapsed-info">
            <span className="ownership-picker__collapsed-name">{currentItem?.name || 'No item'}</span>
            <span className="ownership-picker__collapsed-counter">{currentIndex + 1} / {currentItems.length}</span>
          </div>
          <div className="ownership-picker__collapsed-nav">
            <button className="ownership-picker__collapsed-btn" onClick={(e) => { e.stopPropagation(); goPrev(); }}>←</button>
            <button className="ownership-picker__collapsed-btn" onClick={(e) => { e.stopPropagation(); goNext(); }}>→</button>
            <button className="ownership-picker__collapsed-btn" onClick={(e) => { e.stopPropagation(); setIsMinimized(false); }}>↑</button>
          </div>
        </div>

        <div className="ownership-picker__main">
          <div className="ownership-picker__header">
            <h3 className="ownership-picker__title">Ownership Benefits</h3>
            <button className="ownership-picker__minimize" onClick={() => setIsMinimized(true)}>−</button>
          </div>

          <div className="ownership-picker__tabs">
            {tabs.map(tab => (
              <button
                key={tab.key}
                className={`ownership-picker__tab ${tab.color ? `ownership-picker__tab--${tab.color}` : ''} ${currentTab === tab.key ? 'active' : ''}`}
                onClick={() => { setCurrentTab(tab.key); setCurrentIndex(0); }}
              >
                {tab.label} ({sections[tab.key]?.length || 0})
              </button>
            ))}
          </div>

          <div className="ownership-picker__content">
            <div className="ownership-picker__nav">
              <button className="ownership-picker__nav-btn" onClick={goPrev}>←</button>
              <div className="ownership-picker__info">
                <span className="ownership-picker__category">{currentItem?.category || ''}</span>
                <span className="ownership-picker__counter">{currentIndex + 1} / {currentItems.length}</span>
                <h3 className="ownership-picker__name">{currentItem?.name || 'No items'}</h3>
                <p className="ownership-picker__desc">{currentItem?.desc || ''}</p>
              </div>
              <button className="ownership-picker__nav-btn" onClick={goNext}>→</button>
              <button
                className={`ownership-picker__fav-btn ${currentFav ? 'active' : ''} ${currentFav?.note ? 'has-note' : ''}`}
                onClick={handleToggleFavorite}
                title={currentFav?.note ? `Note: ${currentFav.note}` : (currentFav ? 'Remove from favorites' : 'Add to favorites')}
              >
                {currentFav ? '★' : '☆'}
              </button>
            </div>
          </div>

          <div className="ownership-picker__footer">
            <div className="ownership-picker__footer-left">
              <button className="ownership-picker__btn" onClick={() => setIsGridOpen(true)}>View All</button>
              <button
                className={`ownership-picker__btn ownership-picker__btn--favs ${favorites.length > 0 ? 'has-items' : ''}`}
                onClick={() => setShowFavsPanel(!showFavsPanel)}
              >
                ★ <span className="ownership-picker__fav-count">{favorites.length}</span>
              </button>
              <button
                className={`ownership-picker__btn ownership-picker__btn--copy ${copyFeedback ? (copyFeedback.success ? 'success' : 'error') : ''}`}
                onClick={handleCopyFavorites}
              >
                {copyFeedback ? copyFeedback.message : '📋 Copy'}
              </button>
            </div>
            <div className="ownership-picker__hints">
              <span><kbd>←</kbd><kbd>→</kbd> Nav</span>
              <span><kbd>F</kbd> Fav</span>
              <span><kbd>M</kbd> Mini</span>
            </div>
          </div>
        </div>
      </div>

      {isGridOpen && (
        <div className="ownership-picker__grid-overlay active">
          <div className="ownership-picker__grid-header">
            <h2>All Ownership Benefit Designs (90)</h2>
            <button className="ownership-picker__grid-close" onClick={() => setIsGridOpen(false)}>×</button>
          </div>
          <div className="ownership-picker__grid-content">
            {Object.entries(sections).map(([tabKey, items]) =>
              items.map((item, idx) => (
                <div
                  key={item.id}
                  className="ownership-picker__grid-item"
                  onClick={() => { setCurrentTab(tabKey); setCurrentIndex(idx); setIsGridOpen(false); }}
                >
                  <div className="ownership-picker__grid-item__name">{item.name}</div>
                  <div className="ownership-picker__grid-item__desc">{item.desc}</div>
                </div>
              ))
            )}
          </div>
        </div>
      )}

      {/* Note Modal */}
      {showNoteModal && (
        <div className="ownership-picker__note-modal" onClick={() => setShowNoteModal(null)}>
          <div className="ownership-picker__note-content" onClick={e => e.stopPropagation()}>
            <div className="ownership-picker__note-header">
              <span className="ownership-picker__note-icon">★</span>
              <span>Add to Favorites</span>
            </div>
            <div className="ownership-picker__note-name">{showNoteModal.name}</div>
            <textarea
              ref={noteInputRef}
              className="ownership-picker__note-input"
              placeholder="Add a note (optional)..."
              rows={2}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  handleSaveFavorite(e.target.value.trim());
                }
                if (e.key === 'Escape') {
                  setShowNoteModal(null);
                }
              }}
            />
            <div className="ownership-picker__note-actions">
              <button className="ownership-picker__note-cancel" onClick={() => setShowNoteModal(null)}>Cancel</button>
              <button
                className="ownership-picker__note-save"
                onClick={() => handleSaveFavorite(noteInputRef.current?.value.trim())}
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Favorites Panel */}
      {showFavsPanel && favorites.length > 0 && (
        <div className="ownership-picker__favs-panel">
          <div className="ownership-picker__favs-header">
            <strong>★ Favorites ({favorites.length})</strong>
            <button className="ownership-picker__favs-close" onClick={() => setShowFavsPanel(false)}>×</button>
          </div>
          <div className="ownership-picker__favs-list">
            {favorites.map((fav, idx) => (
              <div key={fav.id} className="ownership-picker__favs-item">
                <div className="ownership-picker__favs-item-main" onClick={() => navigateToFavorite(fav)}>
                  <span className="ownership-picker__favs-item-name">{fav.name || fav.id}</span>
                  <span className="ownership-picker__favs-item-id">{fav.id}</span>
                </div>
                <div className={`ownership-picker__favs-item-note ${!fav.note ? 'empty' : ''}`}>
                  {fav.note ? `→ ${fav.note}` : 'No note'}
                </div>
                <div className="ownership-picker__favs-item-actions">
                  <button className="ownership-picker__favs-item-btn edit" onClick={() => handleEditNote(idx)}>✏️</button>
                  <button className="ownership-picker__favs-item-btn delete" onClick={() => handleDeleteFavorite(idx)}>🗑️</button>
                </div>
              </div>
            ))}
          </div>
          <div className="ownership-picker__favs-footer">
            <button className="ownership-picker__favs-footer-btn copy" onClick={handleCopyFavorites}>📋 Copy All</button>
            <button className="ownership-picker__favs-footer-btn clear" onClick={handleClearFavorites}>🗑️ Clear All</button>
          </div>
        </div>
      )}
    </>
  );
};

export default OwnershipBenefitsPicker;

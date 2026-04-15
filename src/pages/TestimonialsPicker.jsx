import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

/**
 * Testimonials Picker - 5 Variations
 * Access at: /testimonials-picker
 *
 * Variations:
 * 1. Masonry Wall (default) - Grid layout with featured card
 * 2. Carousel Slider - Horizontal carousel with dots
 * 3. Stacked Cards - Overlapping 3D cards
 * 4. Quote Spotlight - One large quote with thumbnails
 * 5. Minimal List - Clean vertical list
 */

const testimonials = [
  {
    id: 1,
    quote: "HQ is more than a business. It's a community of people who share a passion for helicopters. HQ are the best in the UK as they welcome you from the moment you walk in the door. As well as offering the best service, sales, maintenance and instruction in the UK they have a relaxed and homely atmosphere. This offers an ideal therapy for the mind and body as you step off the busy treadmill of London and take to the freedom of the skies.",
    author: "Patrick Curran",
    role: "Helicopter Owner",
    featured: true
  },
  {
    id: 2,
    quote: "I had a brilliant time with my trial lesson, excellent and encouraging instructor, and amazing little R22.",
    author: "Andy Boniface",
    role: "Trial Lesson Student"
  },
  {
    id: 3,
    quote: "I love this company! I love the way they do all for customers in a proper British way! Well done boys!",
    author: "Luca Lapegna",
    role: "Helicopter Owner"
  },
  {
    id: 4,
    quote: "Q is a legend and rest of the instructing team excellent as well. If you want to learn to fly helicopters this is the place.",
    author: "Geoff Read",
    role: "Pilot"
  },
  {
    id: 5,
    quote: "Best training organization in the UK. Q is the most competent pilot and teacher around!",
    author: "Maxim Kalyuzhny",
    role: "Helicopter Owner"
  }
];

// ========== VARIATION 1: Masonry Wall ==========
const MasonryWall = () => {
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({ name: '', role: '', quote: '' });

  return (
    <div style={{ padding: '4rem 2rem', background: '#faf9f6', minHeight: '100vh' }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
        <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
          <span style={{ fontFamily: "'Share Tech Mono', monospace", fontSize: '0.7rem', letterSpacing: '0.2em', color: 'rgba(26,26,26,0.5)', textTransform: 'uppercase' }}>
            What Our Clients Say
          </span>
          <h2 style={{ fontSize: 'clamp(2rem, 4vw, 3rem)', fontWeight: 700, color: '#1a1a1a', margin: '0.5rem 0' }}>
            The HQ Community
          </h2>
        </div>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
          gap: '1.5rem',
          marginBottom: '2rem'
        }}>
          {testimonials.map((t, i) => (
            <motion.div
              key={t.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              style={{
                background: t.featured ? '#1a1a1a' : '#ffffff',
                color: t.featured ? '#ffffff' : '#1a1a1a',
                padding: '2rem',
                borderRadius: '12px',
                boxShadow: '0 4px 20px rgba(0,0,0,0.06)',
                gridColumn: t.featured ? 'span 2' : 'span 1',
                position: 'relative'
              }}
            >
              <span style={{ position: 'absolute', top: '1rem', right: '1.5rem', fontSize: '4rem', opacity: 0.08, fontFamily: 'Georgia' }}>"</span>
              <p style={{ fontSize: t.featured ? '1.1rem' : '0.95rem', lineHeight: 1.8, marginBottom: '1.5rem', opacity: 0.9 }}>
                "{t.quote}"
              </p>
              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', borderTop: `1px solid ${t.featured ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)'}`, paddingTop: '1rem' }}>
                <div style={{
                  width: '40px', height: '40px', borderRadius: '50%',
                  background: t.featured ? '#faf9f6' : '#1a1a1a',
                  color: t.featured ? '#1a1a1a' : '#ffffff',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontWeight: 600, fontSize: '0.875rem'
                }}>
                  {t.author.split(' ').map(n => n[0]).join('')}
                </div>
                <div>
                  <div style={{ fontWeight: 600 }}>{t.author}</div>
                  <div style={{ fontFamily: "'Share Tech Mono', monospace", fontSize: '0.65rem', letterSpacing: '0.1em', textTransform: 'uppercase', opacity: 0.6 }}>{t.role}</div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        <button
          onClick={() => setShowForm(true)}
          style={{
            display: 'flex', alignItems: 'center', gap: '0.5rem', margin: '0 auto',
            padding: '1rem 2rem', background: '#1a1a1a', color: '#fff',
            border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: 600
          }}
        >
          <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
            <path d="M12 20h9M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"/>
          </svg>
          Share Your Experience
        </button>

        {showForm && (
          <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.6)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 100 }}>
            <div style={{ background: '#fff', padding: '2rem', borderRadius: '12px', maxWidth: '450px', width: '90%', position: 'relative' }}>
              <button onClick={() => setShowForm(false)} style={{ position: 'absolute', top: '1rem', right: '1rem', border: 'none', background: 'none', fontSize: '1.5rem', cursor: 'pointer' }}>×</button>
              <h3 style={{ marginBottom: '1rem' }}>Share Your Story</h3>
              <input placeholder="Your Name" style={{ width: '100%', padding: '0.75rem', marginBottom: '1rem', border: '1px solid #ddd', borderRadius: '6px', boxSizing: 'border-box' }} />
              <input placeholder="Your Role (e.g. Helicopter Owner)" style={{ width: '100%', padding: '0.75rem', marginBottom: '1rem', border: '1px solid #ddd', borderRadius: '6px', boxSizing: 'border-box' }} />
              <textarea placeholder="Your experience..." style={{ width: '100%', padding: '0.75rem', marginBottom: '1rem', border: '1px solid #ddd', borderRadius: '6px', minHeight: '100px', boxSizing: 'border-box' }} />
              <button style={{ width: '100%', padding: '0.75rem', background: '#1a1a1a', color: '#fff', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: 600 }}>Submit</button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

// ========== VARIATION 2: Carousel Slider ==========
const CarouselSlider = () => {
  const [current, setCurrent] = useState(0);
  const [showForm, setShowForm] = useState(false);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrent(c => (c + 1) % testimonials.length);
    }, 6000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div style={{ padding: '4rem 2rem', background: '#1a1a1a', minHeight: '100vh', color: '#fff' }}>
      <div style={{ maxWidth: '900px', margin: '0 auto', textAlign: 'center' }}>
        <span style={{ fontFamily: "'Share Tech Mono', monospace", fontSize: '0.7rem', letterSpacing: '0.2em', color: 'rgba(255,255,255,0.5)', textTransform: 'uppercase' }}>
          Testimonials
        </span>
        <h2 style={{ fontSize: 'clamp(2rem, 4vw, 3rem)', fontWeight: 700, margin: '0.5rem 0 3rem' }}>
          Trusted by Pilots
        </h2>

        <div style={{ position: 'relative', minHeight: '300px' }}>
          <AnimatePresence mode="wait">
            <motion.div
              key={current}
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -50 }}
              transition={{ duration: 0.4 }}
            >
              <span style={{ fontSize: '5rem', opacity: 0.1, display: 'block', lineHeight: 0.5 }}>"</span>
              <p style={{ fontSize: 'clamp(1.1rem, 2vw, 1.35rem)', lineHeight: 1.8, margin: '1.5rem 0 2rem', opacity: 0.9 }}>
                {testimonials[current].quote}
              </p>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '1rem' }}>
                <div style={{ width: '50px', height: '50px', borderRadius: '50%', background: '#faf9f6', color: '#1a1a1a', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700 }}>
                  {testimonials[current].author.split(' ').map(n => n[0]).join('')}
                </div>
                <div style={{ textAlign: 'left' }}>
                  <div style={{ fontWeight: 600, fontSize: '1.1rem' }}>{testimonials[current].author}</div>
                  <div style={{ fontFamily: "'Share Tech Mono', monospace", fontSize: '0.7rem', letterSpacing: '0.1em', opacity: 0.6, textTransform: 'uppercase' }}>
                    {testimonials[current].role}
                  </div>
                </div>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>

        <div style={{ display: 'flex', justifyContent: 'center', gap: '0.5rem', margin: '2rem 0' }}>
          {testimonials.map((_, i) => (
            <button
              key={i}
              onClick={() => setCurrent(i)}
              style={{
                width: current === i ? '24px' : '8px',
                height: '8px',
                borderRadius: '4px',
                background: current === i ? '#fff' : 'rgba(255,255,255,0.3)',
                border: 'none',
                cursor: 'pointer',
                transition: 'all 0.3s'
              }}
            />
          ))}
        </div>

        <button onClick={() => setShowForm(true)} style={{ padding: '1rem 2rem', background: '#faf9f6', color: '#1a1a1a', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: 600 }}>
          Add Your Testimonial
        </button>

        {showForm && (
          <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.8)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 100 }}>
            <div style={{ background: '#fff', color: '#1a1a1a', padding: '2rem', borderRadius: '12px', maxWidth: '450px', width: '90%', position: 'relative' }}>
              <button onClick={() => setShowForm(false)} style={{ position: 'absolute', top: '1rem', right: '1rem', border: 'none', background: 'none', fontSize: '1.5rem', cursor: 'pointer' }}>×</button>
              <h3 style={{ marginBottom: '1rem' }}>Share Your Story</h3>
              <input placeholder="Your Name" style={{ width: '100%', padding: '0.75rem', marginBottom: '1rem', border: '1px solid #ddd', borderRadius: '6px', boxSizing: 'border-box' }} />
              <input placeholder="Your Role" style={{ width: '100%', padding: '0.75rem', marginBottom: '1rem', border: '1px solid #ddd', borderRadius: '6px', boxSizing: 'border-box' }} />
              <textarea placeholder="Your experience..." style={{ width: '100%', padding: '0.75rem', marginBottom: '1rem', border: '1px solid #ddd', borderRadius: '6px', minHeight: '100px', boxSizing: 'border-box' }} />
              <button style={{ width: '100%', padding: '0.75rem', background: '#1a1a1a', color: '#fff', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: 600 }}>Submit</button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

// ========== VARIATION 3: Stacked Cards ==========
const StackedCards = () => {
  const [activeIndex, setActiveIndex] = useState(0);
  const [showForm, setShowForm] = useState(false);

  return (
    <div style={{ padding: '4rem 2rem', background: 'linear-gradient(135deg, #1a1a1a 0%, #2d2d2d 100%)', minHeight: '100vh', color: '#fff' }}>
      <div style={{ maxWidth: '700px', margin: '0 auto', textAlign: 'center' }}>
        <span style={{ fontFamily: "'Share Tech Mono', monospace", fontSize: '0.7rem', letterSpacing: '0.2em', color: 'rgba(255,255,255,0.5)', textTransform: 'uppercase' }}>
          Client Stories
        </span>
        <h2 style={{ fontSize: 'clamp(2rem, 4vw, 2.5rem)', fontWeight: 700, margin: '0.5rem 0 3rem' }}>
          Voices of HQ
        </h2>

        <div style={{ position: 'relative', height: '400px', perspective: '1000px' }}>
          {testimonials.map((t, i) => {
            const offset = i - activeIndex;
            const isActive = i === activeIndex;
            return (
              <motion.div
                key={t.id}
                onClick={() => setActiveIndex(i)}
                animate={{
                  scale: isActive ? 1 : 0.85 - Math.abs(offset) * 0.05,
                  y: offset * 40,
                  z: -Math.abs(offset) * 100,
                  opacity: Math.abs(offset) > 2 ? 0 : 1 - Math.abs(offset) * 0.2,
                  rotateX: offset * 5
                }}
                transition={{ type: 'spring', stiffness: 200, damping: 25 }}
                style={{
                  position: 'absolute',
                  left: '50%',
                  top: '50%',
                  transform: 'translate(-50%, -50%)',
                  width: '100%',
                  maxWidth: '500px',
                  background: '#faf9f6',
                  color: '#1a1a1a',
                  borderRadius: '16px',
                  padding: '2rem',
                  cursor: 'pointer',
                  boxShadow: '0 20px 60px rgba(0,0,0,0.3)',
                  zIndex: testimonials.length - Math.abs(offset)
                }}
              >
                <p style={{ fontSize: '1rem', lineHeight: 1.8, marginBottom: '1.5rem' }}>"{t.quote}"</p>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                  <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: '#1a1a1a', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 600, fontSize: '0.8rem' }}>
                    {t.author.split(' ').map(n => n[0]).join('')}
                  </div>
                  <div style={{ textAlign: 'left' }}>
                    <div style={{ fontWeight: 600 }}>{t.author}</div>
                    <div style={{ fontFamily: "'Share Tech Mono', monospace", fontSize: '0.6rem', letterSpacing: '0.1em', opacity: 0.6, textTransform: 'uppercase' }}>{t.role}</div>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>

        <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem', marginTop: '2rem' }}>
          <button onClick={() => setActiveIndex(Math.max(0, activeIndex - 1))} style={{ width: '40px', height: '40px', borderRadius: '50%', background: 'rgba(255,255,255,0.1)', border: 'none', color: '#fff', cursor: 'pointer', fontSize: '1.2rem' }}>←</button>
          <button onClick={() => setActiveIndex(Math.min(testimonials.length - 1, activeIndex + 1))} style={{ width: '40px', height: '40px', borderRadius: '50%', background: 'rgba(255,255,255,0.1)', border: 'none', color: '#fff', cursor: 'pointer', fontSize: '1.2rem' }}>→</button>
        </div>

        <button onClick={() => setShowForm(true)} style={{ marginTop: '2rem', padding: '1rem 2rem', background: '#faf9f6', color: '#1a1a1a', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: 600 }}>
          Share Your Story
        </button>

        {showForm && (
          <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.8)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 100 }}>
            <div style={{ background: '#fff', padding: '2rem', borderRadius: '12px', maxWidth: '450px', width: '90%', position: 'relative', textAlign: 'left' }}>
              <button onClick={() => setShowForm(false)} style={{ position: 'absolute', top: '1rem', right: '1rem', border: 'none', background: 'none', fontSize: '1.5rem', cursor: 'pointer' }}>×</button>
              <h3 style={{ marginBottom: '1rem' }}>Share Your Story</h3>
              <input placeholder="Your Name" style={{ width: '100%', padding: '0.75rem', marginBottom: '1rem', border: '1px solid #ddd', borderRadius: '6px', boxSizing: 'border-box' }} />
              <input placeholder="Your Role" style={{ width: '100%', padding: '0.75rem', marginBottom: '1rem', border: '1px solid #ddd', borderRadius: '6px', boxSizing: 'border-box' }} />
              <textarea placeholder="Your experience..." style={{ width: '100%', padding: '0.75rem', marginBottom: '1rem', border: '1px solid #ddd', borderRadius: '6px', minHeight: '100px', boxSizing: 'border-box' }} />
              <button style={{ width: '100%', padding: '0.75rem', background: '#1a1a1a', color: '#fff', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: 600 }}>Submit</button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

// ========== VARIATION 4: Quote Spotlight ==========
const QuoteSpotlight = () => {
  const [activeIndex, setActiveIndex] = useState(0);
  const [showForm, setShowForm] = useState(false);

  return (
    <div style={{ padding: '4rem 2rem', background: '#faf9f6', minHeight: '100vh' }}>
      <div style={{ maxWidth: '1000px', margin: '0 auto' }}>
        <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
          <span style={{ fontFamily: "'Share Tech Mono', monospace", fontSize: '0.7rem', letterSpacing: '0.2em', color: 'rgba(26,26,26,0.5)', textTransform: 'uppercase' }}>
            Testimonials
          </span>
          <h2 style={{ fontSize: 'clamp(2rem, 4vw, 3rem)', fontWeight: 700, color: '#1a1a1a', margin: '0.5rem 0' }}>
            In Their Words
          </h2>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 200px', gap: '3rem', alignItems: 'start' }}>
          {/* Main Quote */}
          <AnimatePresence mode="wait">
            <motion.div
              key={activeIndex}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              style={{
                background: '#1a1a1a',
                color: '#fff',
                padding: '3rem',
                borderRadius: '16px',
                position: 'relative'
              }}
            >
              <span style={{ position: 'absolute', top: '2rem', left: '2rem', fontSize: '6rem', opacity: 0.1, fontFamily: 'Georgia', lineHeight: 0.5 }}>"</span>
              <p style={{ fontSize: '1.25rem', lineHeight: 1.9, marginBottom: '2rem', position: 'relative', zIndex: 1 }}>
                {testimonials[activeIndex].quote}
              </p>
              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                <div style={{ width: '56px', height: '56px', borderRadius: '50%', background: '#faf9f6', color: '#1a1a1a', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: '1.1rem' }}>
                  {testimonials[activeIndex].author.split(' ').map(n => n[0]).join('')}
                </div>
                <div>
                  <div style={{ fontWeight: 600, fontSize: '1.1rem' }}>{testimonials[activeIndex].author}</div>
                  <div style={{ fontFamily: "'Share Tech Mono', monospace", fontSize: '0.7rem', letterSpacing: '0.1em', opacity: 0.6, textTransform: 'uppercase' }}>
                    {testimonials[activeIndex].role}
                  </div>
                </div>
              </div>
            </motion.div>
          </AnimatePresence>

          {/* Thumbnail List */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            {testimonials.map((t, i) => (
              <button
                key={t.id}
                onClick={() => setActiveIndex(i)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.75rem',
                  padding: '0.75rem',
                  background: i === activeIndex ? '#1a1a1a' : '#fff',
                  color: i === activeIndex ? '#fff' : '#1a1a1a',
                  border: 'none',
                  borderRadius: '8px',
                  cursor: 'pointer',
                  textAlign: 'left',
                  transition: 'all 0.2s'
                }}
              >
                <div style={{
                  width: '36px', height: '36px', borderRadius: '50%', flexShrink: 0,
                  background: i === activeIndex ? '#faf9f6' : '#1a1a1a',
                  color: i === activeIndex ? '#1a1a1a' : '#fff',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontWeight: 600, fontSize: '0.75rem'
                }}>
                  {t.author.split(' ').map(n => n[0]).join('')}
                </div>
                <div style={{ overflow: 'hidden' }}>
                  <div style={{ fontWeight: 600, fontSize: '0.85rem', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{t.author}</div>
                  <div style={{ fontFamily: "'Share Tech Mono', monospace", fontSize: '0.55rem', letterSpacing: '0.05em', opacity: 0.6, textTransform: 'uppercase' }}>{t.role}</div>
                </div>
              </button>
            ))}
            <button onClick={() => setShowForm(true)} style={{ marginTop: '0.5rem', padding: '0.75rem', background: 'transparent', border: '2px dashed rgba(26,26,26,0.2)', borderRadius: '8px', cursor: 'pointer', fontWeight: 600, color: '#1a1a1a', fontSize: '0.8rem' }}>
              + Add Yours
            </button>
          </div>
        </div>

        {showForm && (
          <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.6)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 100 }}>
            <div style={{ background: '#fff', padding: '2rem', borderRadius: '12px', maxWidth: '450px', width: '90%', position: 'relative' }}>
              <button onClick={() => setShowForm(false)} style={{ position: 'absolute', top: '1rem', right: '1rem', border: 'none', background: 'none', fontSize: '1.5rem', cursor: 'pointer' }}>×</button>
              <h3 style={{ marginBottom: '1rem' }}>Share Your Story</h3>
              <input placeholder="Your Name" style={{ width: '100%', padding: '0.75rem', marginBottom: '1rem', border: '1px solid #ddd', borderRadius: '6px', boxSizing: 'border-box' }} />
              <input placeholder="Your Role" style={{ width: '100%', padding: '0.75rem', marginBottom: '1rem', border: '1px solid #ddd', borderRadius: '6px', boxSizing: 'border-box' }} />
              <textarea placeholder="Your experience..." style={{ width: '100%', padding: '0.75rem', marginBottom: '1rem', border: '1px solid #ddd', borderRadius: '6px', minHeight: '100px', boxSizing: 'border-box' }} />
              <button style={{ width: '100%', padding: '0.75rem', background: '#1a1a1a', color: '#fff', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: 600 }}>Submit</button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

// ========== VARIATION 5: Minimal List ==========
const MinimalList = () => {
  const [showForm, setShowForm] = useState(false);
  const [expandedId, setExpandedId] = useState(null);

  return (
    <div style={{ padding: '4rem 2rem', background: '#faf9f6', minHeight: '100vh' }}>
      <div style={{ maxWidth: '700px', margin: '0 auto' }}>
        <div style={{ marginBottom: '3rem' }}>
          <span style={{ fontFamily: "'Share Tech Mono', monospace", fontSize: '0.7rem', letterSpacing: '0.2em', color: 'rgba(26,26,26,0.5)', textTransform: 'uppercase', display: 'block', marginBottom: '0.5rem' }}>
            05 Testimonials
          </span>
          <h2 style={{ fontSize: 'clamp(2rem, 4vw, 2.5rem)', fontWeight: 700, color: '#1a1a1a', margin: 0 }}>
            What Pilots Say
          </h2>
        </div>

        <div style={{ borderTop: '1px solid rgba(26,26,26,0.1)' }}>
          {testimonials.map((t, i) => (
            <motion.div
              key={t.id}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: i * 0.1 }}
              onClick={() => setExpandedId(expandedId === t.id ? null : t.id)}
              style={{
                borderBottom: '1px solid rgba(26,26,26,0.1)',
                padding: '1.5rem 0',
                cursor: 'pointer'
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '1rem' }}>
                <div style={{ flex: 1 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.75rem' }}>
                    <span style={{ fontFamily: "'Share Tech Mono', monospace", fontSize: '0.7rem', color: 'rgba(26,26,26,0.4)' }}>
                      {String(i + 1).padStart(2, '0')}
                    </span>
                    <span style={{ fontWeight: 600, color: '#1a1a1a' }}>{t.author}</span>
                    <span style={{ fontFamily: "'Share Tech Mono', monospace", fontSize: '0.65rem', letterSpacing: '0.05em', color: 'rgba(26,26,26,0.5)', textTransform: 'uppercase' }}>
                      {t.role}
                    </span>
                  </div>
                  <AnimatePresence>
                    <motion.p
                      initial={false}
                      animate={{
                        height: expandedId === t.id || t.quote.length < 150 ? 'auto' : '1.5rem',
                        opacity: 1
                      }}
                      style={{
                        fontSize: '0.95rem',
                        lineHeight: 1.7,
                        color: 'rgba(26,26,26,0.7)',
                        margin: 0,
                        overflow: 'hidden'
                      }}
                    >
                      "{t.quote}"
                    </motion.p>
                  </AnimatePresence>
                </div>
                {t.quote.length >= 150 && (
                  <span style={{ fontSize: '1.25rem', color: 'rgba(26,26,26,0.3)', transition: 'transform 0.2s', transform: expandedId === t.id ? 'rotate(180deg)' : 'rotate(0)' }}>
                    ↓
                  </span>
                )}
              </div>
            </motion.div>
          ))}
        </div>

        <button onClick={() => setShowForm(true)} style={{
          display: 'flex', alignItems: 'center', gap: '0.5rem',
          marginTop: '2rem', padding: '1rem 0',
          background: 'none', border: 'none', cursor: 'pointer',
          fontWeight: 600, color: '#1a1a1a', fontSize: '0.9rem'
        }}>
          <span style={{ width: '24px', height: '24px', borderRadius: '50%', border: '2px solid #1a1a1a', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1rem' }}>+</span>
          Share your experience
        </button>

        {showForm && (
          <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.6)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 100 }}>
            <div style={{ background: '#fff', padding: '2rem', borderRadius: '12px', maxWidth: '450px', width: '90%', position: 'relative' }}>
              <button onClick={() => setShowForm(false)} style={{ position: 'absolute', top: '1rem', right: '1rem', border: 'none', background: 'none', fontSize: '1.5rem', cursor: 'pointer' }}>×</button>
              <h3 style={{ marginBottom: '1rem' }}>Share Your Story</h3>
              <input placeholder="Your Name" style={{ width: '100%', padding: '0.75rem', marginBottom: '1rem', border: '1px solid #ddd', borderRadius: '6px', boxSizing: 'border-box' }} />
              <input placeholder="Your Role" style={{ width: '100%', padding: '0.75rem', marginBottom: '1rem', border: '1px solid #ddd', borderRadius: '6px', boxSizing: 'border-box' }} />
              <textarea placeholder="Your experience..." style={{ width: '100%', padding: '0.75rem', marginBottom: '1rem', border: '1px solid #ddd', borderRadius: '6px', minHeight: '100px', boxSizing: 'border-box' }} />
              <button style={{ width: '100%', padding: '0.75rem', background: '#1a1a1a', color: '#fff', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: 600 }}>Submit</button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

// ========== MAIN PICKER COMPONENT ==========
const variations = [
  { id: 'masonry', name: 'Masonry Wall', component: MasonryWall },
  { id: 'carousel', name: 'Carousel Slider', component: CarouselSlider },
  { id: 'stacked', name: 'Stacked Cards', component: StackedCards },
  { id: 'spotlight', name: 'Quote Spotlight', component: QuoteSpotlight },
  { id: 'minimal', name: 'Minimal List', component: MinimalList }
];

const TestimonialsPicker = () => {
  const [activeVariation, setActiveVariation] = useState('masonry');
  const [favorites, setFavorites] = useState([]);

  const ActiveComponent = variations.find(v => v.id === activeVariation)?.component || MasonryWall;

  const toggleFavorite = (id) => {
    setFavorites(prev => prev.includes(id) ? prev.filter(f => f !== id) : [...prev, id]);
  };

  return (
    <div style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@400;500;600;700&family=Share+Tech+Mono&display=swap');
      `}</style>

      {/* Picker Controls */}
      <div style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        background: '#ffffff',
        borderBottom: '1px solid rgba(26,26,26,0.1)',
        padding: '1rem 2rem',
        zIndex: 1000,
        display: 'flex',
        alignItems: 'center',
        gap: '1rem',
        flexWrap: 'wrap'
      }}>
        <span style={{ fontFamily: "'Share Tech Mono', monospace", fontSize: '0.7rem', letterSpacing: '0.1em', color: 'rgba(26,26,26,0.5)', textTransform: 'uppercase' }}>
          Testimonials Picker
        </span>
        <div style={{ display: 'flex', gap: '0.5rem', flex: 1, flexWrap: 'wrap' }}>
          {variations.map(v => (
            <button
              key={v.id}
              onClick={() => setActiveVariation(v.id)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                padding: '0.5rem 1rem',
                background: activeVariation === v.id ? '#1a1a1a' : 'transparent',
                color: activeVariation === v.id ? '#fff' : '#1a1a1a',
                border: '1px solid',
                borderColor: activeVariation === v.id ? '#1a1a1a' : 'rgba(26,26,26,0.2)',
                borderRadius: '6px',
                cursor: 'pointer',
                fontSize: '0.8rem',
                fontWeight: 500,
                transition: 'all 0.2s'
              }}
            >
              {v.name}
              <span
                onClick={(e) => { e.stopPropagation(); toggleFavorite(v.id); }}
                style={{ color: favorites.includes(v.id) ? '#f59e0b' : 'inherit', cursor: 'pointer' }}
              >
                {favorites.includes(v.id) ? '★' : '☆'}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Active Variation */}
      <div style={{ paddingTop: '70px' }}>
        <ActiveComponent />
      </div>
    </div>
  );
};

export default TestimonialsPicker;

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

/**
 * Testimonials Page - Masonry Wall Style
 * Access at: /testimonials
 *
 * Features:
 * - Masonry grid with featured testimonial
 * - Submit new testimonial form
 * - Brand identity styling
 */

const initialTestimonials = [
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
    role: "Trial Lesson Student",
    featured: false
  },
  {
    id: 3,
    quote: "I love this company! I love the way they do all for customers in a proper British way! Well done boys!",
    author: "Luca Lapegna",
    role: "Helicopter Owner",
    featured: false
  },
  {
    id: 4,
    quote: "Q is a legend and rest of the instructing team excellent as well. If you want to learn to fly helicopters this is the place.",
    author: "Geoff Read",
    role: "Pilot",
    featured: false
  },
  {
    id: 5,
    quote: "Best training organization in the UK. Q is the most competent pilot and teacher around!",
    author: "Maxim Kalyuzhny",
    role: "Helicopter Owner",
    featured: false
  }
];

const Testimonials = () => {
  const [testimonials] = useState(initialTestimonials);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({ name: '', role: '', quote: '' });
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (formData.name && formData.quote) {
      setSubmitted(true);
      setTimeout(() => {
        setSubmitted(false);
        setShowForm(false);
        setFormData({ name: '', role: '', quote: '' });
      }, 3000);
    }
  };

  return (
    <div style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@400;500;600;700&family=Share+Tech+Mono&display=swap');

        .testimonial-card {
          transition: transform 0.3s ease, box-shadow 0.3s ease;
        }
        .testimonial-card:hover {
          transform: translateY(-4px);
          box-shadow: 0 12px 40px rgba(0, 0, 0, 0.12);
        }
        .write-btn:hover {
          background: #2a2a2a !important;
          transform: translateY(-2px);
        }
        .form-input:focus {
          border-color: #1a1a1a !important;
          outline: none;
        }
        .form-close:hover {
          background: rgba(26, 26, 26, 0.1) !important;
        }
        .form-submit:hover {
          background: #2a2a2a !important;
        }
        @media (max-width: 768px) {
          .testimonials-grid {
            grid-template-columns: 1fr !important;
          }
          .testimonial-featured {
            grid-column: span 1 !important;
          }
        }
      `}</style>

      {/* Hero Section */}
      <section style={{
        background: '#1a1a1a',
        color: '#ffffff',
        padding: '8rem 2rem 6rem',
        textAlign: 'center'
      }}>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <span style={{
            fontFamily: "'Share Tech Mono', monospace",
            fontSize: '0.7rem',
            letterSpacing: '0.2em',
            textTransform: 'uppercase',
            color: 'rgba(255,255,255,0.5)',
            display: 'block',
            marginBottom: '1rem'
          }}>
            What Our Clients Say
          </span>
          <h1 style={{
            fontSize: 'clamp(2.5rem, 6vw, 4rem)',
            fontWeight: 700,
            margin: '0 0 1rem',
            letterSpacing: '-0.02em'
          }}>
            The HQ Community
          </h1>
          <p style={{
            fontSize: '1.125rem',
            color: 'rgba(255,255,255,0.7)',
            maxWidth: '600px',
            margin: '0 auto',
            lineHeight: 1.7
          }}>
            Join hundreds of pilots who've discovered their passion for flight with HQ Aviation.
            Here's what they have to say.
          </p>
        </motion.div>
      </section>

      {/* Testimonials Grid */}
      <section style={{
        padding: '5rem 2rem',
        background: '#faf9f6'
      }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <div
            className="testimonials-grid"
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
              gap: '1.5rem',
              marginBottom: '3rem'
            }}
          >
            {testimonials.map((t, i) => (
              <motion.div
                key={t.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1, duration: 0.5 }}
                className={`testimonial-card ${t.featured ? 'testimonial-featured' : ''}`}
                style={{
                  background: t.featured ? '#1a1a1a' : '#ffffff',
                  color: t.featured ? '#ffffff' : '#1a1a1a',
                  padding: '2.5rem',
                  borderRadius: '16px',
                  boxShadow: '0 4px 24px rgba(0, 0, 0, 0.06)',
                  gridColumn: t.featured ? 'span 2' : 'span 1',
                  position: 'relative',
                  overflow: 'hidden'
                }}
              >
                {/* Quote Icon */}
                <span style={{
                  position: 'absolute',
                  top: '1.5rem',
                  right: '2rem',
                  fontSize: '5rem',
                  opacity: 0.06,
                  fontFamily: 'Georgia, serif',
                  lineHeight: 0.8
                }}>"</span>

                {/* Quote Text */}
                <p style={{
                  fontSize: t.featured ? '1.15rem' : '1rem',
                  lineHeight: 1.85,
                  marginBottom: '2rem',
                  position: 'relative',
                  zIndex: 1,
                  opacity: t.featured ? 0.95 : 0.85
                }}>
                  "{t.quote}"
                </p>

                {/* Author Info */}
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '1rem',
                  borderTop: `1px solid ${t.featured ? 'rgba(255,255,255,0.1)' : 'rgba(26,26,26,0.08)'}`,
                  paddingTop: '1.5rem'
                }}>
                  <div style={{
                    width: '48px',
                    height: '48px',
                    borderRadius: '50%',
                    background: t.featured
                      ? 'linear-gradient(135deg, #faf9f6 0%, #e8e8e8 100%)'
                      : 'linear-gradient(135deg, #1a1a1a 0%, #3a3a3a 100%)',
                    color: t.featured ? '#1a1a1a' : '#ffffff',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontWeight: 700,
                    fontSize: '0.95rem'
                  }}>
                    {t.author.split(' ').map(n => n[0]).join('')}
                  </div>
                  <div>
                    <div style={{ fontWeight: 600, fontSize: '1rem', marginBottom: '0.2rem' }}>
                      {t.author}
                    </div>
                    <div style={{
                      fontFamily: "'Share Tech Mono', monospace",
                      fontSize: '0.65rem',
                      letterSpacing: '0.1em',
                      textTransform: 'uppercase',
                      opacity: 0.5
                    }}>
                      {t.role}
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Share Button */}
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            style={{ textAlign: 'center' }}
          >
            <button
              onClick={() => setShowForm(true)}
              className="write-btn"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.75rem',
                padding: '1.125rem 2.25rem',
                background: '#1a1a1a',
                color: '#ffffff',
                border: 'none',
                borderRadius: '10px',
                fontSize: '0.95rem',
                fontWeight: 600,
                fontFamily: "'Space Grotesk', sans-serif",
                cursor: 'pointer',
                transition: 'all 0.3s ease'
              }}
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M12 20h9" />
                <path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z" />
              </svg>
              Share Your Experience
            </button>
          </motion.div>
        </div>
      </section>

      {/* Stats Section */}
      <section style={{
        padding: '4rem 2rem',
        background: '#1a1a1a',
        color: '#ffffff'
      }}>
        <div style={{
          maxWidth: '1000px',
          margin: '0 auto',
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: '2rem',
          textAlign: 'center'
        }}>
          {[
            { value: '500+', label: 'Pilots Trained' },
            { value: '40+', label: 'Years Experience' },
            { value: '98%', label: 'Satisfaction Rate' },
            { value: '24/7', label: 'Support Available' }
          ].map((stat, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
            >
              <div style={{
                fontFamily: "'Share Tech Mono', monospace",
                fontSize: 'clamp(2.5rem, 5vw, 3.5rem)',
                fontWeight: 700,
                marginBottom: '0.5rem'
              }}>
                {stat.value}
              </div>
              <div style={{
                fontFamily: "'Share Tech Mono', monospace",
                fontSize: '0.7rem',
                letterSpacing: '0.15em',
                textTransform: 'uppercase',
                opacity: 0.5
              }}>
                {stat.label}
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Form Modal */}
      <AnimatePresence>
        {showForm && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={(e) => e.target === e.currentTarget && setShowForm(false)}
            style={{
              position: 'fixed',
              inset: 0,
              background: 'rgba(26, 26, 26, 0.85)',
              backdropFilter: 'blur(8px)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              zIndex: 1000,
              padding: '2rem'
            }}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              style={{
                background: '#ffffff',
                borderRadius: '20px',
                padding: '3rem',
                maxWidth: '480px',
                width: '100%',
                position: 'relative'
              }}
            >
              <button
                onClick={() => setShowForm(false)}
                className="form-close"
                style={{
                  position: 'absolute',
                  top: '1.5rem',
                  right: '1.5rem',
                  width: '36px',
                  height: '36px',
                  border: 'none',
                  background: 'rgba(26, 26, 26, 0.05)',
                  borderRadius: '50%',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '1.25rem',
                  color: '#1a1a1a',
                  transition: 'all 0.2s ease'
                }}
              >
                ✕
              </button>

              {!submitted ? (
                <>
                  <h3 style={{
                    fontSize: '1.75rem',
                    fontWeight: 700,
                    color: '#1a1a1a',
                    marginBottom: '0.5rem'
                  }}>
                    Share Your Story
                  </h3>
                  <p style={{
                    fontSize: '0.95rem',
                    color: 'rgba(26, 26, 26, 0.6)',
                    marginBottom: '2rem',
                    lineHeight: 1.6
                  }}>
                    Your experience matters to us and helps others discover HQ Aviation.
                  </p>

                  <form onSubmit={handleSubmit}>
                    <div style={{ marginBottom: '1.25rem' }}>
                      <label style={{
                        display: 'block',
                        fontFamily: "'Share Tech Mono', monospace",
                        fontSize: '0.7rem',
                        letterSpacing: '0.1em',
                        textTransform: 'uppercase',
                        color: 'rgba(26, 26, 26, 0.6)',
                        marginBottom: '0.5rem'
                      }}>
                        Your Name *
                      </label>
                      <input
                        type="text"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        className="form-input"
                        placeholder="John Smith"
                        required
                        style={{
                          width: '100%',
                          padding: '0.875rem 1rem',
                          border: '2px solid rgba(26, 26, 26, 0.1)',
                          borderRadius: '10px',
                          fontSize: '1rem',
                          fontFamily: "'Space Grotesk', sans-serif",
                          transition: 'border-color 0.2s ease',
                          boxSizing: 'border-box'
                        }}
                      />
                    </div>

                    <div style={{ marginBottom: '1.25rem' }}>
                      <label style={{
                        display: 'block',
                        fontFamily: "'Share Tech Mono', monospace",
                        fontSize: '0.7rem',
                        letterSpacing: '0.1em',
                        textTransform: 'uppercase',
                        color: 'rgba(26, 26, 26, 0.6)',
                        marginBottom: '0.5rem'
                      }}>
                        Your Role (Optional)
                      </label>
                      <input
                        type="text"
                        value={formData.role}
                        onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                        className="form-input"
                        placeholder="e.g. Helicopter Owner, PPL Student"
                        style={{
                          width: '100%',
                          padding: '0.875rem 1rem',
                          border: '2px solid rgba(26, 26, 26, 0.1)',
                          borderRadius: '10px',
                          fontSize: '1rem',
                          fontFamily: "'Space Grotesk', sans-serif",
                          transition: 'border-color 0.2s ease',
                          boxSizing: 'border-box'
                        }}
                      />
                    </div>

                    <div style={{ marginBottom: '1.5rem' }}>
                      <label style={{
                        display: 'block',
                        fontFamily: "'Share Tech Mono', monospace",
                        fontSize: '0.7rem',
                        letterSpacing: '0.1em',
                        textTransform: 'uppercase',
                        color: 'rgba(26, 26, 26, 0.6)',
                        marginBottom: '0.5rem'
                      }}>
                        Your Experience *
                      </label>
                      <textarea
                        value={formData.quote}
                        onChange={(e) => setFormData({ ...formData, quote: e.target.value })}
                        className="form-input"
                        placeholder="Tell us about your experience with HQ Aviation..."
                        required
                        style={{
                          width: '100%',
                          padding: '0.875rem 1rem',
                          border: '2px solid rgba(26, 26, 26, 0.1)',
                          borderRadius: '10px',
                          fontSize: '1rem',
                          fontFamily: "'Space Grotesk', sans-serif",
                          transition: 'border-color 0.2s ease',
                          minHeight: '130px',
                          resize: 'vertical',
                          boxSizing: 'border-box'
                        }}
                      />
                    </div>

                    <button
                      type="submit"
                      className="form-submit"
                      style={{
                        width: '100%',
                        padding: '1rem',
                        background: '#1a1a1a',
                        color: '#ffffff',
                        border: 'none',
                        borderRadius: '10px',
                        fontSize: '1rem',
                        fontWeight: 600,
                        fontFamily: "'Space Grotesk', sans-serif",
                        cursor: 'pointer',
                        transition: 'all 0.3s ease'
                      }}
                    >
                      Submit Testimonial
                    </button>
                  </form>
                </>
              ) : (
                <div style={{ textAlign: 'center', padding: '1rem' }}>
                  <div style={{
                    width: '72px',
                    height: '72px',
                    background: 'linear-gradient(135deg, #22c55e 0%, #16a34a 100%)',
                    borderRadius: '50%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    margin: '0 auto 1.5rem',
                    fontSize: '2rem',
                    color: '#ffffff'
                  }}>
                    ✓
                  </div>
                  <h3 style={{
                    fontSize: '1.5rem',
                    fontWeight: 700,
                    color: '#1a1a1a',
                    marginBottom: '0.5rem'
                  }}>
                    Thank You!
                  </h3>
                  <p style={{ color: 'rgba(26, 26, 26, 0.6)' }}>
                    Your testimonial has been submitted and will appear after review.
                  </p>
                </div>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Testimonials;

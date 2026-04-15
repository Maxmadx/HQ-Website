import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

/**
 * TestimonialsWall Component
 *
 * Displays customer testimonials in an elegant masonry-style grid
 * with the ability to submit new testimonials.
 *
 * Brand Identity:
 * - Typography: Space Grotesk (headings), Share Tech Mono (labels)
 * - Colors: #faf9f6 (warm white), #1a1a1a (charcoal)
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

const TestimonialsWall = () => {
  const [testimonials, setTestimonials] = useState(initialTestimonials);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({ name: '', role: '', quote: '' });
  const [submitted, setSubmitted] = useState(false);
  const formRef = useRef(null);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (formData.name && formData.quote) {
      const newTestimonial = {
        id: Date.now(),
        quote: formData.quote,
        author: formData.name,
        role: formData.role || 'HQ Aviation Client',
        featured: false,
        pending: true
      };
      setTestimonials([...testimonials, newTestimonial]);
      setFormData({ name: '', role: '', quote: '' });
      setSubmitted(true);
      setTimeout(() => {
        setSubmitted(false);
        setShowForm(false);
      }, 3000);
    }
  };

  const styles = {
    section: {
      padding: '6rem 2rem',
      background: '#faf9f6',
      fontFamily: "'Space Grotesk', sans-serif",
      position: 'relative',
      overflow: 'hidden'
    },
    container: {
      maxWidth: '1400px',
      margin: '0 auto'
    },
    header: {
      textAlign: 'center',
      marginBottom: '4rem'
    },
    label: {
      fontFamily: "'Share Tech Mono', monospace",
      fontSize: '0.75rem',
      letterSpacing: '0.2em',
      textTransform: 'uppercase',
      color: 'rgba(26, 26, 26, 0.5)',
      marginBottom: '1rem',
      display: 'block'
    },
    title: {
      fontSize: 'clamp(2.5rem, 5vw, 4rem)',
      fontWeight: 700,
      color: '#1a1a1a',
      margin: '0 0 1rem',
      letterSpacing: '-0.02em'
    },
    subtitle: {
      fontSize: '1.125rem',
      color: 'rgba(26, 26, 26, 0.6)',
      maxWidth: '600px',
      margin: '0 auto',
      lineHeight: 1.6
    },
    grid: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))',
      gap: '1.5rem',
      marginBottom: '3rem'
    },
    card: {
      background: '#ffffff',
      borderRadius: '12px',
      padding: '2rem',
      boxShadow: '0 4px 20px rgba(0, 0, 0, 0.06)',
      transition: 'all 0.3s ease',
      position: 'relative',
      overflow: 'hidden'
    },
    cardFeatured: {
      gridColumn: 'span 2',
      background: '#1a1a1a',
      color: '#ffffff'
    },
    quoteIcon: {
      position: 'absolute',
      top: '1.5rem',
      right: '1.5rem',
      fontSize: '4rem',
      opacity: 0.08,
      fontFamily: 'Georgia, serif',
      lineHeight: 1
    },
    quote: {
      fontSize: '1rem',
      lineHeight: 1.8,
      marginBottom: '1.5rem',
      position: 'relative',
      zIndex: 1
    },
    quoteFeatured: {
      fontSize: '1.125rem'
    },
    authorRow: {
      display: 'flex',
      alignItems: 'center',
      gap: '1rem',
      borderTop: '1px solid rgba(26, 26, 26, 0.1)',
      paddingTop: '1.5rem'
    },
    authorRowFeatured: {
      borderTopColor: 'rgba(255, 255, 255, 0.1)'
    },
    avatar: {
      width: '48px',
      height: '48px',
      borderRadius: '50%',
      background: 'linear-gradient(135deg, #1a1a1a 0%, #3a3a3a 100%)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      color: '#ffffff',
      fontWeight: 600,
      fontSize: '1rem'
    },
    avatarFeatured: {
      background: 'linear-gradient(135deg, #faf9f6 0%, #e0e0e0 100%)',
      color: '#1a1a1a'
    },
    authorInfo: {
      flex: 1
    },
    authorName: {
      fontWeight: 600,
      fontSize: '1rem',
      marginBottom: '0.25rem'
    },
    authorRole: {
      fontFamily: "'Share Tech Mono', monospace",
      fontSize: '0.7rem',
      letterSpacing: '0.1em',
      textTransform: 'uppercase',
      opacity: 0.6
    },
    pendingBadge: {
      fontFamily: "'Share Tech Mono', monospace",
      fontSize: '0.6rem',
      letterSpacing: '0.1em',
      textTransform: 'uppercase',
      background: 'rgba(26, 26, 26, 0.1)',
      padding: '0.25rem 0.5rem',
      borderRadius: '4px',
      marginLeft: 'auto'
    },
    writeButton: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      gap: '0.75rem',
      margin: '0 auto',
      padding: '1rem 2rem',
      background: '#1a1a1a',
      color: '#ffffff',
      border: 'none',
      borderRadius: '8px',
      fontSize: '0.875rem',
      fontWeight: 600,
      fontFamily: "'Space Grotesk', sans-serif",
      cursor: 'pointer',
      transition: 'all 0.3s ease'
    },
    formOverlay: {
      position: 'fixed',
      inset: 0,
      background: 'rgba(26, 26, 26, 0.8)',
      backdropFilter: 'blur(8px)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 1000,
      padding: '2rem'
    },
    formCard: {
      background: '#ffffff',
      borderRadius: '16px',
      padding: '3rem',
      maxWidth: '500px',
      width: '100%',
      position: 'relative'
    },
    formClose: {
      position: 'absolute',
      top: '1.5rem',
      right: '1.5rem',
      width: '32px',
      height: '32px',
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
    },
    formTitle: {
      fontSize: '1.75rem',
      fontWeight: 700,
      color: '#1a1a1a',
      marginBottom: '0.5rem'
    },
    formSubtitle: {
      fontSize: '0.9rem',
      color: 'rgba(26, 26, 26, 0.6)',
      marginBottom: '2rem'
    },
    formGroup: {
      marginBottom: '1.5rem'
    },
    formLabel: {
      display: 'block',
      fontFamily: "'Share Tech Mono', monospace",
      fontSize: '0.7rem',
      letterSpacing: '0.1em',
      textTransform: 'uppercase',
      color: 'rgba(26, 26, 26, 0.6)',
      marginBottom: '0.5rem'
    },
    formInput: {
      width: '100%',
      padding: '0.875rem 1rem',
      border: '2px solid rgba(26, 26, 26, 0.1)',
      borderRadius: '8px',
      fontSize: '1rem',
      fontFamily: "'Space Grotesk', sans-serif",
      transition: 'border-color 0.2s ease',
      outline: 'none',
      boxSizing: 'border-box'
    },
    formTextarea: {
      width: '100%',
      padding: '0.875rem 1rem',
      border: '2px solid rgba(26, 26, 26, 0.1)',
      borderRadius: '8px',
      fontSize: '1rem',
      fontFamily: "'Space Grotesk', sans-serif",
      transition: 'border-color 0.2s ease',
      outline: 'none',
      minHeight: '120px',
      resize: 'vertical',
      boxSizing: 'border-box'
    },
    formSubmit: {
      width: '100%',
      padding: '1rem',
      background: '#1a1a1a',
      color: '#ffffff',
      border: 'none',
      borderRadius: '8px',
      fontSize: '1rem',
      fontWeight: 600,
      fontFamily: "'Space Grotesk', sans-serif",
      cursor: 'pointer',
      transition: 'all 0.3s ease'
    },
    successMessage: {
      textAlign: 'center',
      padding: '2rem'
    },
    successIcon: {
      width: '64px',
      height: '64px',
      background: 'linear-gradient(135deg, #22c55e 0%, #16a34a 100%)',
      borderRadius: '50%',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      margin: '0 auto 1.5rem',
      fontSize: '2rem',
      color: '#ffffff'
    },
    successTitle: {
      fontSize: '1.5rem',
      fontWeight: 700,
      color: '#1a1a1a',
      marginBottom: '0.5rem'
    },
    successText: {
      color: 'rgba(26, 26, 26, 0.6)'
    }
  };

  return (
    <section style={styles.section}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@400;500;600;700&family=Share+Tech+Mono&display=swap');

        .testimonial-card:hover {
          transform: translateY(-4px);
          box-shadow: 0 12px 40px rgba(0, 0, 0, 0.1);
        }

        .write-btn:hover {
          background: #2a2a2a;
          transform: translateY(-2px);
        }

        .form-input:focus {
          border-color: #1a1a1a;
        }

        .form-close:hover {
          background: rgba(26, 26, 26, 0.1);
        }

        .form-submit:hover {
          background: #2a2a2a;
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

      <div style={styles.container}>
        {/* Header */}
        <div style={styles.header}>
          <span style={styles.label}>What Our Clients Say</span>
          <h2 style={styles.title}>The HQ Community</h2>
          <p style={styles.subtitle}>
            Join hundreds of pilots who've discovered their passion for flight with HQ Aviation.
            Here's what they have to say.
          </p>
        </div>

        {/* Testimonials Grid */}
        <div style={styles.grid} className="testimonials-grid">
          {testimonials.map((testimonial, index) => (
            <motion.div
              key={testimonial.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className={`testimonial-card ${testimonial.featured ? 'testimonial-featured' : ''}`}
              style={{
                ...styles.card,
                ...(testimonial.featured ? styles.cardFeatured : {})
              }}
            >
              <span style={{
                ...styles.quoteIcon,
                color: testimonial.featured ? '#ffffff' : '#1a1a1a'
              }}>"</span>

              <p style={{
                ...styles.quote,
                ...(testimonial.featured ? styles.quoteFeatured : {}),
                color: testimonial.featured ? 'rgba(255, 255, 255, 0.9)' : 'rgba(26, 26, 26, 0.8)'
              }}>
                "{testimonial.quote}"
              </p>

              <div style={{
                ...styles.authorRow,
                ...(testimonial.featured ? styles.authorRowFeatured : {})
              }}>
                <div style={{
                  ...styles.avatar,
                  ...(testimonial.featured ? styles.avatarFeatured : {})
                }}>
                  {testimonial.author.split(' ').map(n => n[0]).join('')}
                </div>
                <div style={styles.authorInfo}>
                  <div style={{
                    ...styles.authorName,
                    color: testimonial.featured ? '#ffffff' : '#1a1a1a'
                  }}>
                    {testimonial.author}
                  </div>
                  <div style={{
                    ...styles.authorRole,
                    color: testimonial.featured ? 'rgba(255, 255, 255, 0.6)' : 'rgba(26, 26, 26, 0.5)'
                  }}>
                    {testimonial.role}
                  </div>
                </div>
                {testimonial.pending && (
                  <span style={styles.pendingBadge}>Pending Review</span>
                )}
              </div>
            </motion.div>
          ))}
        </div>

        {/* Write Testimonial Button */}
        <motion.button
          onClick={() => setShowForm(true)}
          className="write-btn"
          style={styles.writeButton}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M12 20h9" />
            <path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z" />
          </svg>
          Share Your Experience
        </motion.button>
      </div>

      {/* Form Modal */}
      <AnimatePresence>
        {showForm && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            style={styles.formOverlay}
            onClick={(e) => e.target === e.currentTarget && setShowForm(false)}
          >
            <motion.div
              ref={formRef}
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              style={styles.formCard}
            >
              <button
                onClick={() => setShowForm(false)}
                style={styles.formClose}
                className="form-close"
              >
                ✕
              </button>

              {!submitted ? (
                <>
                  <h3 style={styles.formTitle}>Share Your Story</h3>
                  <p style={styles.formSubtitle}>
                    Your experience matters to us and helps others discover HQ Aviation.
                  </p>

                  <form onSubmit={handleSubmit}>
                    <div style={styles.formGroup}>
                      <label style={styles.formLabel}>Your Name *</label>
                      <input
                        type="text"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        style={styles.formInput}
                        className="form-input"
                        placeholder="John Smith"
                        required
                      />
                    </div>

                    <div style={styles.formGroup}>
                      <label style={styles.formLabel}>Your Role (Optional)</label>
                      <input
                        type="text"
                        value={formData.role}
                        onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                        style={styles.formInput}
                        className="form-input"
                        placeholder="e.g. Helicopter Owner, PPL Student, Trial Lesson"
                      />
                    </div>

                    <div style={styles.formGroup}>
                      <label style={styles.formLabel}>Your Experience *</label>
                      <textarea
                        value={formData.quote}
                        onChange={(e) => setFormData({ ...formData, quote: e.target.value })}
                        style={styles.formTextarea}
                        className="form-input"
                        placeholder="Tell us about your experience with HQ Aviation..."
                        required
                      />
                    </div>

                    <button type="submit" style={styles.formSubmit} className="form-submit">
                      Submit Testimonial
                    </button>
                  </form>
                </>
              ) : (
                <div style={styles.successMessage}>
                  <div style={styles.successIcon}>✓</div>
                  <h3 style={styles.successTitle}>Thank You!</h3>
                  <p style={styles.successText}>
                    Your testimonial has been submitted and will appear after review.
                  </p>
                </div>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
};

export default TestimonialsWall;

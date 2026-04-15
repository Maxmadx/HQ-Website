import { useState } from 'react';
import { Link } from 'react-router-dom';

function Contact() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: ''
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Handle form submission
    console.log('Form submitted:', formData);
    alert('Thank you for your message. We will be in touch soon!');
  };

  return (
    <>
      {/* Page Header */}
      <div className="page-header">
        <div className="container">
          <div className="page-header__breadcrumb">
            <Link to="/">Home</Link>
            <span>/</span>
            <span>Contact</span>
          </div>
          <h1 className="page-header__title">Contact Us</h1>
          <p className="page-header__description">
            Get in touch with the HQ Aviation team
          </p>
        </div>
      </div>

      {/* Contact Section */}
      <section className="section">
        <div className="container">
          <div className="grid grid--2 gap-8">
            {/* Contact Form */}
            <div>
              <h2>Send a Message</h2>
              <form onSubmit={handleSubmit}>
                <div className="form-group">
                  <label className="form-label" htmlFor="name">Name *</label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    className="form-input"
                    value={formData.name}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="form-group">
                  <label className="form-label" htmlFor="email">Email *</label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    className="form-input"
                    value={formData.email}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="form-group">
                  <label className="form-label" htmlFor="phone">Phone</label>
                  <input
                    type="tel"
                    id="phone"
                    name="phone"
                    className="form-input"
                    value={formData.phone}
                    onChange={handleChange}
                  />
                </div>
                <div className="form-group">
                  <label className="form-label" htmlFor="subject">Subject *</label>
                  <select
                    id="subject"
                    name="subject"
                    className="form-select"
                    value={formData.subject}
                    onChange={handleChange}
                    required
                  >
                    <option value="">Select a subject...</option>
                    <option value="aircraft-sales">Aircraft Sales</option>
                    <option value="training">Flight Training</option>
                    <option value="maintenance">Maintenance</option>
                    <option value="expeditions">Expeditions</option>
                    <option value="other">Other</option>
                  </select>
                </div>
                <div className="form-group">
                  <label className="form-label" htmlFor="message">Message *</label>
                  <textarea
                    id="message"
                    name="message"
                    className="form-textarea"
                    value={formData.message}
                    onChange={handleChange}
                    required
                  ></textarea>
                </div>
                <button type="submit" className="btn btn--primary btn--lg btn--block">
                  Send Message
                </button>
              </form>
            </div>

            {/* Contact Info */}
            <div>
              <h2>Contact Information</h2>
              <div style={{ marginBottom: 'var(--space-8)' }}>
                <h4><i className="fas fa-map-marker-alt text-accent"></i> Address</h4>
                <p>
                  HQ Aviation<br />
                  Denham Aerodrome<br />
                  Tilehouse Lane<br />
                  Denham, UB9 5DF<br />
                  United Kingdom
                </p>
              </div>
              <div style={{ marginBottom: 'var(--space-8)' }}>
                <h4><i className="fas fa-phone text-accent"></i> Phone</h4>
                <p>+44 (0)1895 833373</p>
              </div>
              <div style={{ marginBottom: 'var(--space-8)' }}>
                <h4><i className="fas fa-envelope text-accent"></i> Email</h4>
                <p>info@hqaviation.com</p>
              </div>
              <div style={{ marginBottom: 'var(--space-8)' }}>
                <h4><i className="fas fa-clock text-accent"></i> Opening Hours</h4>
                <p>
                  Monday - Friday: 09:00 - 17:00<br />
                  Saturday: 09:00 - 13:00<br />
                  Sunday: Closed
                </p>
              </div>

              {/* Map placeholder */}
              <div style={{
                background: 'var(--color-background-alt)',
                height: '300px',
                borderRadius: 'var(--border-radius-md)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                <p className="text-muted">Map - Denham Aerodrome</p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

export default Contact;

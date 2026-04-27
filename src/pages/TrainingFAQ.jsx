import { Link } from 'react-router-dom';
import { useState } from 'react';
import { useFaqs } from '../hooks/useFaqs';

function TrainingFAQ() {
  const [openIndex, setOpenIndex] = useState(null);
  const { faqs } = useFaqs('training-faq', { visibleOnly: true });

  const toggleFAQ = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <>
      {/* Page Header */}
      <div className="page-header">
        <div className="container">
          <div className="page-header__breadcrumb">
            <Link to="/">Home</Link>
            <span>/</span>
            <Link to="/training">Training</Link>
            <span>/</span>
            <span>FAQ</span>
          </div>
          <h1 className="page-header__title">Training FAQ</h1>
          <p className="page-header__description">
            Frequently asked questions about helicopter training
          </p>
        </div>
      </div>

      {/* Introduction */}
      <section className="section">
        <div className="container text-center">
          <h2>Got Questions?</h2>
          <p className="text-lg text-muted" style={{ maxWidth: '700px', margin: '0 auto' }}>
            To help you prepare for your journey with HQ Aviation, we've compiled answers
            to the questions we hear most often. If you can't find what you're looking for,
            please don't hesitate to contact us.
          </p>
        </div>
      </section>

      {/* FAQ Accordion */}
      <section className="section section--alt" data-cms-section="faqs-training-faq">
        <div className="container" style={{ maxWidth: '800px' }}>
          <div className="accordion">
            {faqs.map((faq, index) => (
              <div key={faq.id} className="accordion__item">
                <button
                  className={`accordion__header ${openIndex === index ? 'accordion__header--active' : ''}`}
                  onClick={() => toggleFAQ(index)}
                  aria-expanded={openIndex === index}
                >
                  <span className="accordion__title">{faq.question}</span>
                  <i className={`fas ${openIndex === index ? 'fa-minus' : 'fa-plus'} accordion__icon`}></i>
                </button>
                <div
                  className={`accordion__content ${openIndex === index ? 'accordion__content--open' : ''}`}
                  style={{
                    maxHeight: openIndex === index ? '500px' : '0',
                    overflow: 'hidden',
                    transition: 'max-height 0.3s ease'
                  }}
                >
                  <div className="accordion__body">
                    <p>{faq.answer}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Still Have Questions */}
      <section className="section">
        <div className="container">
          <div className="grid grid--2 gap-8 items-center">
            <div>
              <span className="text-accent text-sm text-uppercase font-bold">Need More Info?</span>
              <h2>Still Have Questions?</h2>
              <p>
                Our team is always happy to help answer any questions you might have about
                helicopter training. Whether you're wondering about costs, scheduling, or
                what to expect, we're here to guide you through the process.
              </p>
              <p>
                The best way to understand helicopter flying is to experience it for yourself.
                Book a trial lesson and see what it's all about!
              </p>
              <div className="flex gap-4">
                <Link to="/training/trial-lessons" className="btn btn--outline">
                  Book Trial Lesson
                </Link>
              </div>
            </div>
            <div>
              <img
                src="/assets/images/training/faq-instructor.webp"
                alt="HQ Aviation Instructor answering questions"
                loading="lazy"
                style={{ borderRadius: 'var(--border-radius-md)', width: '100%' }}
              />
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="cta">
        <div className="container">
          <h2 className="cta__title">Ready to Start Your Training?</h2>
          <p className="cta__description">
            Take the first step towards becoming a helicopter pilot today.
          </p>
          <Link to="/training/trial-lessons" className="btn btn--accent btn--lg">
            Book Your Trial Lesson
          </Link>
        </div>
      </section>
    </>
  );
}

export default TrainingFAQ;

import { Link } from 'react-router-dom';
import { useState } from 'react';

function TrainingFAQ() {
  const [openIndex, setOpenIndex] = useState(null);

  const faqs = [
    {
      question: 'How long does it take to get a helicopter license?',
      answer: 'The minimum flight time required for a Private Pilot License (Helicopters) is 45 hours. Most students complete their training in 6-12 months, depending on how frequently they can fly and weather conditions. Intensive courses are also available for those who want to complete training more quickly.'
    },
    {
      question: 'How much does helicopter training cost?',
      answer: 'The total cost for a PPL(H) typically ranges from £15,000 to £20,000, depending on how quickly you progress. This includes all flight time, ground school, and examination fees. We offer flexible payment options and you can pay as you go rather than paying everything upfront.'
    },
    {
      question: 'Do I need any prior experience to learn to fly?',
      answer: 'No prior flying experience is required. Everyone starts somewhere, and our instructors are experienced in training complete beginners. A trial lesson is the perfect way to see if helicopter flying is for you before committing to full training.'
    },
    {
      question: 'What medical requirements are there?',
      answer: 'You will need a Class 2 Medical Certificate, which can be obtained from a CAA-approved Aeromedical Examiner (AME). This is a straightforward medical examination that most people pass. You can start training before obtaining your medical, but you\'ll need it before flying solo.'
    },
    {
      question: 'What helicopters do you train in?',
      answer: 'We primarily train on Robinson R22 and R44 helicopters. The R22 is ideal for initial training due to its responsiveness and lower operating costs. The R44 is used for more advanced training and offers a more comfortable cabin. Both are industry-standard training aircraft.'
    },
    {
      question: 'Can I fly in any weather?',
      answer: 'Helicopter training is conducted under Visual Flight Rules (VFR), which means you need reasonable weather conditions. We can fly in light rain and cloud, but not in fog, heavy rain, or low visibility. Don\'t worry - the UK has plenty of flyable days throughout the year.'
    },
    {
      question: 'What is a trial lesson?',
      answer: 'A trial lesson is an introductory flight where you\'ll actually take the controls and fly the helicopter yourself, under the guidance of an instructor. It includes a pre-flight briefing, approximately 30 minutes of flight time, and counts towards your PPL if you decide to continue training.'
    },
    {
      question: 'Can I bring someone with me for my lesson?',
      answer: 'For trial lessons in the R44, you can bring up to two passengers to share the experience. For regular training lessons, it\'s usually just you and the instructor so you can focus on learning. Family and friends are always welcome to wait in our comfortable clubhouse.'
    },
    {
      question: 'What can I do with a helicopter license?',
      answer: 'A Private Pilot License allows you to fly helicopters for personal use - commuting, sightseeing, visiting friends, or simply enjoying the freedom of flight. You can carry passengers but not for hire or reward. To fly commercially, you\'ll need to progress to a Commercial Pilot License (CPL).'
    },
    {
      question: 'How do I book training or a trial lesson?',
      answer: 'You can book directly through our website, call us, or visit us at Denham Aerodrome. We recommend booking a trial lesson first to experience helicopter flying before committing to full training. Our team is always happy to answer any questions you might have.'
    }
  ];

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
      <section className="section section--alt">
        <div className="container" style={{ maxWidth: '800px' }}>
          <div className="accordion">
            {faqs.map((faq, index) => (
              <div key={index} className="accordion__item">
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
                <Link to="/contact" className="btn btn--primary">
                  Contact Us
                </Link>
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

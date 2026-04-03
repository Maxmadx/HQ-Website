import { Link } from 'react-router-dom';

function Training() {
  const courses = [
    {
      title: 'Trial Lessons',
      description: 'Experience the thrill of helicopter flight with a hands-on trial lesson. Your first step towards becoming a pilot.',
      price: 'From £299',
      link: '/training/trial-lessons',
      featured: true
    },
    {
      title: 'Private Pilot License (PPL)',
      description: 'Full PPL(H) course to achieve your private helicopter license. Fly for pleasure and personal transport.',
      price: 'From £15,000',
      link: '/training/ppl'
    },
    {
      title: 'Commercial License (CPL)',
      description: 'Professional training for a career in helicopter aviation. Become a paid pilot.',
      price: 'Contact us',
      link: '/training/commercial'
    },
    {
      title: 'Type Ratings',
      description: 'Get qualified on specific helicopter types including Robinson R22, R44, and R66 models.',
      price: 'Contact us',
      link: '/training/type-ratings'
    },
    {
      title: 'Instructor Courses',
      description: 'Train to become a flight instructor and share your passion for aviation with the next generation.',
      price: 'Contact us',
      link: '/training/instructor'
    },
    {
      title: 'Night Ratings',
      description: 'Extend your flying privileges to include night operations. Essential for serious pilots.',
      price: 'Contact us',
      link: '/training/night-ratings'
    }
  ];

  return (
    <>
      {/* Page Header */}
      <div className="page-header">
        <div className="container">
          <div className="page-header__breadcrumb">
            <Link to="/">Home</Link>
            <span>/</span>
            <span>Training</span>
          </div>
          <h1 className="page-header__title">Flight Training</h1>
          <p className="page-header__description">
            CAA Declared Training Organisation - Learn to fly with the best at Denham Aerodrome
          </p>
        </div>
      </div>

      {/* Introduction */}
      <section className="section">
        <div className="container">
          <div className="grid grid--2 gap-8 items-center">
            <div>
              <span className="text-accent text-sm text-uppercase font-bold">Learn to Fly</span>
              <h2>Your Journey Starts Here</h2>
              <p>
                Whether you're dreaming of becoming a pilot or looking to advance your existing
                qualifications, HQ Aviation offers comprehensive training programs to suit every
                goal. Our experienced instructors and modern fleet make learning to fly both
                safe and enjoyable.
              </p>
              <p>
                Based at Denham Aerodrome, just west of London, we offer an ideal training
                environment with excellent facilities and diverse flying conditions.
              </p>
              <Link to="/training/trial-lessons" className="btn btn--primary">
                Book a Trial Lesson
              </Link>
            </div>
            <div>
              <img
                src="/assets/images/training/helicopter-training.webp"
                alt="Helicopter Flight Training at HQ Aviation"
                loading="lazy"
                style={{ borderRadius: 'var(--border-radius-md)', width: '100%' }}
              />
            </div>
          </div>
        </div>
      </section>

      {/* Courses Grid */}
      <section className="section section--alt">
        <div className="container">
          <div className="section-header text-center mb-8">
            <span className="text-accent text-sm text-uppercase font-bold">Our Courses</span>
            <h2>Training Programs</h2>
          </div>
          <div className="grid grid--3">
            {courses.map((course) => (
              <div key={course.title} className={`card ${course.featured ? 'card--featured' : ''}`}>
                <div className="card__content">
                  <h3 className="card__title">{course.title}</h3>
                  <p className="card__description">{course.description}</p>
                  <div className="card__footer">
                    <span className="card__price">{course.price}</span>
                    <Link to={course.link} className="btn btn--outline">Learn More</Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* What is a Trial Lesson */}
      <section className="section">
        <div className="container">
          <div className="grid grid--2 gap-8 items-center">
            <div>
              <img
                src="/assets/images/training/trial-lesson.webp"
                alt="Trial Helicopter Lesson"
                loading="lazy"
                style={{ borderRadius: 'var(--border-radius-md)', width: '100%' }}
              />
            </div>
            <div>
              <span className="text-accent text-sm text-uppercase font-bold">Get Started</span>
              <h2>What is a Trial Lesson?</h2>
              <p>
                A trial lesson is the first flight you'll undertake en-route to becoming a pilot.
                It's a 1-on-1 session with one of our experienced instructors where you'll get
                genuine hands-on flying experience.
              </p>
              <p>
                Your session includes:
              </p>
              <ul style={{ marginLeft: '1.5rem', marginBottom: '1.5rem' }}>
                <li>Comprehensive pre-flight briefing</li>
                <li>Full hands-on flight time</li>
                <li>Dual control helicopter - you'll actually fly!</li>
                <li>All insurance included</li>
                <li>Post-flight debrief and Q&A</li>
              </ul>
              <Link to="/training/trial-lessons" className="btn btn--primary">
                Book Your Trial Lesson
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Why Train With Us */}
      <section className="section section--alt">
        <div className="container">
          <div className="section-header text-center mb-8">
            <h2>Why Train With HQ Aviation?</h2>
          </div>
          <div className="features">
            <div className="feature">
              <div className="feature__icon">
                <i className="fas fa-certificate"></i>
              </div>
              <h3 className="feature__title">CAA Approved</h3>
              <p className="feature__description">
                Fully approved Declared Training Organisation with experienced instructors.
              </p>
            </div>
            <div className="feature">
              <div className="feature__icon">
                <i className="fas fa-helicopter"></i>
              </div>
              <h3 className="feature__title">Modern Fleet</h3>
              <p className="feature__description">
                Train on well-maintained Robinson helicopters with the latest avionics.
              </p>
            </div>
            <div className="feature">
              <div className="feature__icon">
                <i className="fas fa-user-tie"></i>
              </div>
              <h3 className="feature__title">Expert Instructors</h3>
              <p className="feature__description">
                Learn from some of the most experienced pilots in the industry.
              </p>
            </div>
            <div className="feature">
              <div className="feature__icon">
                <i className="fas fa-map-marked-alt"></i>
              </div>
              <h3 className="feature__title">Great Location</h3>
              <p className="feature__description">
                Denham Aerodrome offers varied terrain and easy access from London.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Link */}
      <section className="section">
        <div className="container text-center">
          <h2>Have Questions?</h2>
          <p className="text-lg text-muted mb-8" style={{ maxWidth: '600px', margin: '0 auto 2rem' }}>
            We've compiled answers to the questions we hear most often about flight training.
          </p>
          <Link to="/training/faq" className="btn btn--outline">
            View Training FAQ
          </Link>
        </div>
      </section>

      {/* CTA */}
      <section className="cta">
        <div className="container">
          <h2 className="cta__title">Ready to Start Flying?</h2>
          <p className="cta__description">
            Book a trial lesson today and discover the freedom of helicopter flight.
          </p>
          <Link to="/training/trial-lessons" className="btn btn--accent btn--lg">
            Book Trial Lesson
          </Link>
        </div>
      </section>
    </>
  );
}

export default Training;

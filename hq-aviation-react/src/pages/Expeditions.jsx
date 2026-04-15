import { Link } from 'react-router-dom';

function Expeditions() {
  const expeditions = [
    {
      title: 'Scottish Highlands',
      description: 'Explore the dramatic landscapes of Scotland from above. Soar over lochs, glens, and ancient castles on this unforgettable adventure.',
      image: '/assets/images/expeditions/scottish-highlands.webp',
      duration: '5 Days',
      flyingHours: '12 Hours',
      price: 'From £8,500',
      link: '/expeditions/scottish-highlands'
    },
    {
      title: 'Norwegian Fjords',
      description: 'Navigate the stunning fjords of Norway. Experience breathtaking waterfalls, snow-capped peaks, and remote villages.',
      image: '/assets/images/expeditions/norwegian-fjords.webp',
      duration: '7 Days',
      flyingHours: '18 Hours',
      price: 'From £12,500',
      link: '/expeditions/norwegian-fjords'
    },
    {
      title: 'Moroccan Atlas',
      description: 'Discover the beauty of Morocco from the air. Fly over the Atlas Mountains, Sahara Desert, and ancient medinas.',
      image: '/assets/images/expeditions/moroccan-atlas.webp',
      duration: '6 Days',
      flyingHours: '15 Hours',
      price: 'From £14,000',
      link: '/expeditions/moroccan-atlas'
    },
    {
      title: 'Swiss Alps',
      description: 'Experience the majesty of the Swiss Alps. Land at exclusive mountain locations and enjoy world-class hospitality.',
      image: '/assets/images/expeditions/swiss-alps.webp',
      duration: '4 Days',
      flyingHours: '10 Hours',
      price: 'From £9,500',
      link: '/expeditions/swiss-alps'
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
            <span>Expeditions</span>
          </div>
          <h1 className="page-header__title">Helicopter Expeditions</h1>
          <p className="page-header__description">
            Extraordinary adventures with Captain Q - Explore the world from a unique perspective
          </p>
        </div>
      </div>

      {/* Introduction */}
      <section className="section">
        <div className="container text-center">
          <span className="text-accent text-sm text-uppercase font-bold">Adventure Awaits</span>
          <h2>Unforgettable Helicopter Adventures</h2>
          <p className="text-lg text-muted" style={{ maxWidth: '800px', margin: '0 auto' }}>
            Join Captain Q on carefully curated helicopter expeditions to some of the world's
            most spectacular destinations. Each journey combines expert piloting, luxury
            accommodations, and experiences you simply cannot get any other way.
          </p>
        </div>
      </section>

      {/* Expeditions Grid */}
      <section className="section section--alt">
        <div className="container">
          <div className="grid grid--2">
            {expeditions.map((exp) => (
              <div key={exp.title} className="card">
                <div className="card__image">
                  <img src={exp.image} alt={exp.title} loading="lazy" />
                </div>
                <div className="card__content">
                  <h3 className="card__title">{exp.title}</h3>
                  <p className="card__description">{exp.description}</p>
                  <div className="card__meta" style={{ display: 'flex', gap: '1rem', marginBottom: '1rem' }}>
                    <span className="text-sm">
                      <i className="fas fa-calendar-alt text-accent"></i> {exp.duration}
                    </span>
                    <span className="text-sm">
                      <i className="fas fa-helicopter text-accent"></i> {exp.flyingHours}
                    </span>
                  </div>
                  <div className="card__footer">
                    <span className="card__price">{exp.price}</span>
                    <Link to={exp.link} className="btn btn--outline">View Details</Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Bespoke Adventures */}
      <section className="section">
        <div className="container">
          <div className="grid grid--2 gap-8 items-center">
            <div>
              <span className="text-accent text-sm text-uppercase font-bold">Custom Journeys</span>
              <h2>Bespoke Adventures</h2>
              <p>
                Can't find exactly what you're looking for? We specialize in creating custom
                helicopter expeditions tailored to your dreams. Whether it's a special occasion,
                a bucket-list destination, or a corporate event, we can make it happen.
              </p>
              <p>
                From private polar expeditions to multi-country European tours, our team will
                work with you to design the perfect adventure.
              </p>
              <Link to="/expeditions/bespoke" className="btn btn--primary">
                Plan Your Adventure
              </Link>
            </div>
            <div>
              <img
                src="/assets/images/expeditions/bespoke-adventure.webp"
                alt="Bespoke Helicopter Adventure"
                loading="lazy"
                style={{ borderRadius: 'var(--border-radius-md)', width: '100%' }}
              />
            </div>
          </div>
        </div>
      </section>

      {/* Captain Q Section */}
      <section className="section section--alt">
        <div className="container">
          <div className="grid grid--2 gap-8 items-center">
            <div>
              <img
                src="/assets/images/expeditions/helicopter-expeditions-quentin-smith.webp"
                alt="Captain Q on expedition"
                loading="lazy"
                style={{ borderRadius: 'var(--border-radius-md)', width: '100%' }}
              />
            </div>
            <div>
              <span className="text-accent text-sm text-uppercase font-bold">Your Guide</span>
              <h2>Fly with Captain Q</h2>
              <p>
                All HQ Aviation expeditions are led by Captain Quentin Smith - two-time World
                Helicopter Aerobatics Champion and the first person to fly a helicopter to
                both the North and South Poles.
              </p>
              <p>
                With over 30,000 hours of flight time and adventures spanning every continent,
                Captain Q brings unparalleled expertise and passion to every journey. You're
                not just a passenger - you're part of an exclusive aviation experience.
              </p>
              <Link to="/about-us/captain-q" className="btn btn--outline">
                Learn More About Captain Q
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* What's Included */}
      <section className="section">
        <div className="container">
          <div className="section-header text-center mb-8">
            <span className="text-accent text-sm text-uppercase font-bold">Experience</span>
            <h2>What's Included</h2>
          </div>
          <div className="features">
            <div className="feature">
              <div className="feature__icon">
                <i className="fas fa-helicopter"></i>
              </div>
              <h3 className="feature__title">Expert Piloting</h3>
              <p className="feature__description">
                Fly with world-class pilots who know every route intimately.
              </p>
            </div>
            <div className="feature">
              <div className="feature__icon">
                <i className="fas fa-hotel"></i>
              </div>
              <h3 className="feature__title">Luxury Accommodation</h3>
              <p className="feature__description">
                Stay in carefully selected hotels and lodges along the way.
              </p>
            </div>
            <div className="feature">
              <div className="feature__icon">
                <i className="fas fa-utensils"></i>
              </div>
              <h3 className="feature__title">Fine Dining</h3>
              <p className="feature__description">
                Enjoy gourmet meals and local culinary experiences.
              </p>
            </div>
            <div className="feature">
              <div className="feature__icon">
                <i className="fas fa-camera"></i>
              </div>
              <h3 className="feature__title">Unique Experiences</h3>
              <p className="feature__description">
                Access exclusive locations only reachable by helicopter.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="cta">
        <div className="container">
          <h2 className="cta__title">Ready for the Adventure of a Lifetime?</h2>
          <p className="cta__description">
            Contact us to discuss your expedition or reserve your place on an upcoming adventure.
          </p>
          <div className="flex justify-center gap-4">
            <Link to="/contact" className="btn btn--accent btn--lg">
              Enquire Now
            </Link>
            <Link to="/expeditions/calendar" className="btn btn--outline btn--lg">
              View Calendar
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}

export default Expeditions;

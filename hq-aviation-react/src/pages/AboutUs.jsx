import { Link } from 'react-router-dom';

function AboutUs() {
  return (
    <>
      {/* Page Header */}
      <div className="page-header">
        <div className="container">
          <div className="page-header__breadcrumb">
            <Link to="/">Home</Link>
            <span>/</span>
            <span>About Us</span>
          </div>
          <h1 className="page-header__title">About HQ Aviation</h1>
          <p className="page-header__description">
            The Robinson Specialists - Over 30 years of aviation excellence at Denham Aerodrome
          </p>
        </div>
      </div>

      {/* Welcome Section */}
      <section className="section">
        <div className="container">
          <div className="grid grid--2 gap-8 items-center">
            <div>
              <span className="text-accent text-sm text-uppercase font-bold">Welcome</span>
              <h2>Welcome to HQ Aviation</h2>
              <p>
                Located at Denham Aerodrome, HQ Aviation has cultivated a 'clubhouse' vibe where
                aviation enthusiasts and professionals alike feel at home. We are more than just
                a helicopter company - we are a community of aviators who share a passion for flight.
              </p>
              <p>
                Whether you're taking your first steps into aviation or you're an experienced pilot
                looking for your next adventure, HQ Aviation offers the expertise, facilities, and
                camaraderie to support your journey.
              </p>
              <Link to="/contact" className="btn btn--primary">
                Visit Us
              </Link>
            </div>
            <div>
              <img
                src="/assets/images/facility/hq-aviation-helicopter-hangar.webp"
                alt="HQ Aviation Hangar at Denham Aerodrome"
                loading="lazy"
                style={{ borderRadius: 'var(--border-radius-md)', width: '100%' }}
              />
            </div>
          </div>
        </div>
      </section>

      {/* Meet Q Section */}
      <section className="section section--alt">
        <div className="container">
          <div className="grid grid--2 gap-8 items-center">
            <div>
              <img
                src="/assets/images/team/world-helicopter-champion-quentin-smith.webp"
                alt="Captain Quentin Q Smith - World Helicopter Champion"
                loading="lazy"
                style={{ borderRadius: 'var(--border-radius-md)', width: '100%' }}
              />
            </div>
            <div>
              <span className="text-accent text-sm text-uppercase font-bold">Meet Q</span>
              <h2>Captain Quentin "Q" Smith</h2>
              <p>
                At the heart of HQ Aviation is Captain Quentin Smith - a two-time Helicopter
                Aerobatics World Champion, Guinness World Record holder, and the first person
                to pilot a helicopter to both the North and South Poles.
              </p>
              <p>
                With over 30,000 hours of flight time and expeditions spanning every continent,
                Captain Q brings unparalleled experience and passion to everything we do at HQ Aviation.
              </p>
              <Link to="/about-us/captain-q" className="btn btn--primary">
                Learn More About Captain Q
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Robinson Approved Section */}
      <section className="section">
        <div className="container">
          <div className="grid grid--2 gap-8 items-center">
            <div>
              <span className="text-accent text-sm text-uppercase font-bold">Robinson Approved</span>
              <h2>Robinson Authorized Dealer & Service Centre</h2>
              <p>
                HQ Aviation is proud to be a Robinson Helicopter Company Authorized Dealer and
                Service Centre. Our partnership with Robinson ensures that we offer the highest
                standards of sales, training, and maintenance.
              </p>
              <p>
                Led by Chief Engineer David Cross, with over 30 years of experience, our
                factory-trained technicians provide expert care for R22, R44, and R66 helicopters.
                From routine inspections to complete overhauls, your aircraft is in the best hands.
              </p>
              <Link to="/services/maintenance" className="btn btn--outline">
                Explore Maintenance Services
              </Link>
            </div>
            <div>
              <img
                src="/assets/images/facility/g-ccfc-hq-robinson-overhaul.webp"
                alt="Robinson Helicopter Overhaul at HQ Aviation"
                loading="lazy"
                style={{ borderRadius: 'var(--border-radius-md)', width: '100%' }}
              />
            </div>
          </div>
        </div>
      </section>

      {/* You Are Invited Section */}
      <section className="section section--alt">
        <div className="container text-center">
          <span className="text-accent text-sm text-uppercase font-bold">You Are Invited</span>
          <h2>Come and See Us</h2>
          <p className="text-lg text-muted mb-8" style={{ maxWidth: '700px', margin: '0 auto 2rem' }}>
            We invite you to visit HQ Aviation at Denham Aerodrome. Whether you're interested
            in training, purchasing an aircraft, or simply want to experience the world of
            helicopter aviation, our doors are always open.
          </p>
          <div className="flex justify-center gap-4">
            <Link to="/about-us/team" className="btn btn--primary">
              Meet Our Team
            </Link>
            <Link to="/contact" className="btn btn--outline">
              Get Directions
            </Link>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="cta">
        <div className="container">
          <h2 className="cta__title">Ready to Start Your Aviation Journey?</h2>
          <p className="cta__description">
            Contact us today to learn more about our services or schedule a visit.
          </p>
          <Link to="/contact" className="btn btn--accent btn--lg">
            Contact Us
          </Link>
        </div>
      </section>
    </>
  );
}

export default AboutUs;

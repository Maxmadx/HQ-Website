import { Link } from 'react-router-dom';

function Team() {
  const teamMembers = [
    {
      name: 'Captain Quentin "Q" Smith',
      role: 'Founder & Chief Pilot',
      image: '/assets/images/team/quentin-smith.webp',
      description: 'Two-time World Aerobatics Champion and founder of HQ Aviation. Over 30,000 hours flight time.',
      link: '/about-us/captain-q'
    },
    {
      name: 'David Cross',
      role: 'Chief Engineer',
      image: '/assets/images/team/david-cross.webp',
      description: 'Over 30 years experience in helicopter maintenance. Factory-trained Robinson engineer.',
      link: null
    },
    {
      name: 'Flight Training Team',
      role: 'Instructors',
      image: '/assets/images/team/instructors.webp',
      description: 'Experienced CAA-approved flight instructors dedicated to developing the next generation of pilots.',
      link: '/training'
    },
    {
      name: 'Operations Team',
      role: 'Customer Support',
      image: '/assets/images/team/operations.webp',
      description: 'Friendly team managing bookings, enquiries, and ensuring smooth operations at Denham.',
      link: '/contact'
    }
  ];

  const departments = [
    {
      icon: 'fa-graduation-cap',
      title: 'Flight Training',
      description: 'Our experienced instructors offer training from trial lessons through to commercial licenses.',
      link: '/training'
    },
    {
      icon: 'fa-wrench',
      title: 'Maintenance',
      description: 'Factory-trained engineers providing comprehensive maintenance and overhaul services.',
      link: '/services/maintenance'
    },
    {
      icon: 'fa-helicopter',
      title: 'Aircraft Sales',
      description: 'Expert guidance on new and pre-owned Robinson helicopter purchases.',
      link: '/aircraft-sales'
    },
    {
      icon: 'fa-compass',
      title: 'Expeditions',
      description: 'Led by Captain Q, our expedition team organizes adventures worldwide.',
      link: '/expeditions'
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
            <Link to="/about-us">About Us</Link>
            <span>/</span>
            <span>Our Team</span>
          </div>
          <h1 className="page-header__title">Meet Our Team</h1>
          <p className="page-header__description">
            The dedicated professionals behind HQ Aviation
          </p>
        </div>
      </div>

      {/* Introduction */}
      <section className="section">
        <div className="container text-center">
          <h2>A Team of Experts</h2>
          <p className="text-lg text-muted" style={{ maxWidth: '800px', margin: '0 auto' }}>
            At HQ Aviation, our team brings together decades of experience in helicopter aviation.
            From world-champion pilots to factory-trained engineers, we're united by a passion for
            flight and a commitment to excellence.
          </p>
        </div>
      </section>

      {/* Team Grid */}
      <section className="section section--alt">
        <div className="container">
          <div className="grid grid--4">
            {teamMembers.map((member) => (
              <div key={member.name} className="team-member">
                <div className="team-member__image">
                  <img src={member.image} alt={member.name} loading="lazy" />
                </div>
                <h3 className="team-member__name">{member.name}</h3>
                <p className="team-member__role">{member.role}</p>
                <p className="team-member__description text-sm text-muted">
                  {member.description}
                </p>
                {member.link && (
                  <Link to={member.link} className="btn btn--outline btn--sm mt-4">
                    Learn More
                  </Link>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Departments */}
      <section className="section">
        <div className="container">
          <div className="section-header text-center mb-8">
            <span className="text-accent text-sm text-uppercase font-bold">Our Departments</span>
            <h2>How We Can Help You</h2>
          </div>
          <div className="features">
            {departments.map((dept) => (
              <Link key={dept.title} to={dept.link} className="feature" style={{ textDecoration: 'none' }}>
                <div className="feature__icon">
                  <i className={`fas ${dept.icon}`}></i>
                </div>
                <h3 className="feature__title">{dept.title}</h3>
                <p className="feature__description">{dept.description}</p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Join Us Section */}
      <section className="section section--alt">
        <div className="container">
          <div className="grid grid--2 gap-8 items-center">
            <div>
              <span className="text-accent text-sm text-uppercase font-bold">Careers</span>
              <h2>Join Our Team</h2>
              <p>
                We're always looking for talented individuals who share our passion for aviation.
                Whether you're an experienced pilot, engineer, or looking to start your career
                in the aviation industry, we'd love to hear from you.
              </p>
              <Link to="/contact/careers" className="btn btn--primary">
                View Opportunities
              </Link>
            </div>
            <div>
              <img
                src="/assets/images/facility/hq-aviation-team.webp"
                alt="HQ Aviation Team"
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
          <h2 className="cta__title">Ready to Get Started?</h2>
          <p className="cta__description">
            Contact our team today to discuss your aviation needs.
          </p>
          <Link to="/contact" className="btn btn--accent btn--lg">
            Contact Us
          </Link>
        </div>
      </section>
    </>
  );
}

export default Team;

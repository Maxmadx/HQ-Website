import { Link } from 'react-router-dom';

function Services() {
  const services = [
    {
      icon: 'fa-wrench',
      title: 'Part 145 Maintenance',
      description: 'Full EASA Part 145 approved maintenance facility. Factory-trained engineers.',
      link: '/services/maintenance'
    },
    {
      icon: 'fa-warehouse',
      title: 'Hangarage',
      description: 'Secure indoor storage at Denham Aerodrome. Heated hangars available.',
      link: '/services/hangarage'
    },
    {
      icon: 'fa-box',
      title: 'Parts Supply',
      description: 'Extensive stock of Robinson and other helicopter parts. AOG service available.',
      link: '/services/parts'
    },
    {
      icon: 'fa-shield-alt',
      title: 'Fleet Insurance',
      description: 'Competitive insurance packages for helicopter owners through our partners.',
      link: '/services/insurance'
    },
    {
      icon: 'fa-handshake',
      title: 'Leaseback',
      description: 'Generate income from your aircraft through our leaseback programme.',
      link: '/services/leaseback'
    },
    {
      icon: 'fa-plane',
      title: 'Ferry Flights',
      description: 'Worldwide helicopter delivery and ferry flight services.',
      link: '/services/ferry-flights'
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
            <span>Services</span>
          </div>
          <h1 className="page-header__title">Our Services</h1>
          <p className="page-header__description">
            Comprehensive helicopter services from maintenance to management
          </p>
        </div>
      </div>

      {/* Services Grid */}
      <section className="section">
        <div className="container">
          <div className="features">
            {services.map((service) => (
              <Link key={service.title} to={service.link} className="feature" style={{ textDecoration: 'none' }}>
                <div className="feature__icon">
                  <i className={`fas ${service.icon}`}></i>
                </div>
                <h3 className="feature__title">{service.title}</h3>
                <p className="feature__description">{service.description}</p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Certifications */}
      <section className="section section--alt">
        <div className="container text-center">
          <h2>Our Certifications</h2>
          <p className="text-lg text-muted mb-8">
            HQ Aviation is fully approved and certified to the highest industry standards.
          </p>
          <div className="flex justify-center gap-8">
            <div>
              <img src="/assets/images/logos/certifications/caa.jpg" alt="UK CAA" style={{ height: '80px' }} />
              <p className="text-sm text-muted mt-4">CAA Approved</p>
            </div>
            <div>
              <img src="/assets/images/logos/certifications/robinson.jpg" alt="Robinson" style={{ height: '80px' }} />
              <p className="text-sm text-muted mt-4">Robinson Service Centre</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="cta">
        <div className="container">
          <h2 className="cta__title">Need Helicopter Services?</h2>
          <p className="cta__description">
            Contact our team to discuss your requirements.
          </p>
          <Link to="/contact" className="btn btn--accent btn--lg">Get in Touch</Link>
        </div>
      </section>
    </>
  );
}

export default Services;

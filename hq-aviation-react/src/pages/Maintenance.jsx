import { Link } from 'react-router-dom';

function Maintenance() {
  const services = [
    {
      icon: 'fa-tools',
      title: '50/100-Hour Inspections',
      description: 'Routine inspections to keep your aircraft in top condition and compliant with regulations.'
    },
    {
      icon: 'fa-sync-alt',
      title: '2200-Hour Overhauls',
      description: 'Complete overhauls performed by factory-trained technicians using genuine parts.'
    },
    {
      icon: 'fa-wrench',
      title: 'Component Repairs',
      description: 'Expert repair and replacement of components, from avionics to airframe.'
    },
    {
      icon: 'fa-search',
      title: 'Pre-Purchase Inspections',
      description: 'Thorough inspections for buyers to ensure aircraft condition before purchase.'
    },
    {
      icon: 'fa-exclamation-triangle',
      title: 'AOG Support',
      description: 'Aircraft on Ground emergency support to get you flying again quickly.'
    },
    {
      icon: 'fa-paint-roller',
      title: 'Refurbishment',
      description: 'Interior and exterior refurbishment to restore your aircraft to like-new condition.'
    }
  ];

  const helicopterModels = [
    {
      model: 'Robinson R22',
      image: '/assets/images/new-aircraft/r22-beta.webp',
      description: 'Full maintenance support for all R22 variants'
    },
    {
      model: 'Robinson R44',
      image: '/assets/images/new-aircraft/r44-raven.webp',
      description: 'Authorized service for Raven, Cadet, and Clipper models'
    },
    {
      model: 'Robinson R66',
      image: '/assets/images/new-aircraft/r66-turbine.webp',
      description: 'Turbine expertise for the R66 range'
    },
    {
      model: 'Guimbal Cabri G2',
      image: '/assets/images/new-aircraft/cabri-g2.webp',
      description: 'Certified Cabri G2 service centre'
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
            <Link to="/services">Services</Link>
            <span>/</span>
            <span>Maintenance</span>
          </div>
          <h1 className="page-header__title">Aircraft Maintenance</h1>
          <p className="page-header__description">
            EASA Part 145 Approved Maintenance Facility
          </p>
        </div>
      </div>

      {/* Introduction */}
      <section className="section">
        <div className="container">
          <div className="grid grid--2 gap-8 items-center">
            <div>
              <span className="text-accent text-sm text-uppercase font-bold">Part 145 Approved</span>
              <h2>EASA Part 145 Maintenance Facility</h2>
              <p>
                HQ Aviation operates a fully EASA Part 145 approved maintenance facility at
                Denham Aerodrome. With over 85 aircraft under our care, we are one of the
                leading helicopter maintenance providers in the UK.
              </p>
              <p>
                Our team of factory-trained technicians provides comprehensive maintenance
                services for Robinson helicopters and Guimbal Cabri G2 aircraft. From routine
                inspections to complete overhauls, your aircraft is in expert hands.
              </p>
            </div>
            <div>
              <img
                src="/assets/images/facility/hq-aviation-helicopter-hangar.webp"
                alt="HQ Aviation Maintenance Hangar"
                loading="lazy"
                style={{ borderRadius: 'var(--border-radius-md)', width: '100%' }}
              />
            </div>
          </div>
        </div>
      </section>

      {/* Certifications */}
      <section className="section section--alt">
        <div className="container">
          <div className="grid grid--2 gap-8 items-center">
            <div>
              <img
                src="/assets/images/facility/g-ccfc-hq-robinson-overhaul.webp"
                alt="Robinson Helicopter Overhaul at HQ Aviation"
                loading="lazy"
                style={{ borderRadius: 'var(--border-radius-md)', width: '100%' }}
              />
            </div>
            <div>
              <span className="text-accent text-sm text-uppercase font-bold">Robinson Authorized</span>
              <h2>Robinson Helicopter Company Authorized Service Centre</h2>
              <p>
                As a Robinson Authorized Service Centre, HQ Aviation is approved to perform
                all maintenance, repairs, and overhauls on R22, R44, and R66 helicopters.
              </p>
              <p>
                Our Chief Engineer, David Cross, brings over 30 years of experience in
                helicopter maintenance. All our technicians are factory-trained and use
                only genuine Robinson parts, ensuring your aircraft meets the highest
                standards of safety and reliability.
              </p>
              <div className="flex gap-4 mt-8">
                <img
                  src="/assets/images/logos/certifications/robinson-authorized.jpg"
                  alt="Robinson Authorized Service Centre"
                  style={{ height: '60px' }}
                />
                <img
                  src="/assets/images/logos/certifications/easa.png"
                  alt="EASA Approved"
                  style={{ height: '60px' }}
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Services Grid */}
      <section className="section">
        <div className="container">
          <div className="section-header text-center mb-8">
            <span className="text-accent text-sm text-uppercase font-bold">Our Services</span>
            <h2>Maintenance Services</h2>
          </div>
          <div className="features">
            {services.map((service) => (
              <div key={service.title} className="feature">
                <div className="feature__icon">
                  <i className={`fas ${service.icon}`}></i>
                </div>
                <h3 className="feature__title">{service.title}</h3>
                <p className="feature__description">{service.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Supported Aircraft */}
      <section className="section section--alt">
        <div className="container">
          <div className="section-header text-center mb-8">
            <span className="text-accent text-sm text-uppercase font-bold">Aircraft Types</span>
            <h2>Supported Helicopters</h2>
          </div>
          <div className="grid grid--4">
            {helicopterModels.map((heli) => (
              <div key={heli.model} className="card">
                <div className="card__image">
                  <img src={heli.image} alt={heli.model} loading="lazy" />
                </div>
                <div className="card__content">
                  <h3 className="card__title">{heli.model}</h3>
                  <p className="card__description text-sm">{heli.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Guimbal Section */}
      <section className="section">
        <div className="container">
          <div className="grid grid--2 gap-8 items-center">
            <div>
              <span className="text-accent text-sm text-uppercase font-bold">Cabri G2</span>
              <h2>Guimbal Cabri G2 Certified Service Centre</h2>
              <p>
                In addition to our Robinson expertise, HQ Aviation is proud to be a
                certified Guimbal Cabri G2 service centre. The Cabri G2 has become
                increasingly popular for training, and we're fully equipped to support
                this modern training helicopter.
              </p>
              <p>
                Our technicians have completed Guimbal factory training and maintain
                close relationships with the manufacturer to ensure the highest standards
                of service.
              </p>
            </div>
            <div>
              <img
                src="/assets/images/new-aircraft/cabri-g2-maintenance.webp"
                alt="Guimbal Cabri G2 Maintenance"
                loading="lazy"
                style={{ borderRadius: 'var(--border-radius-md)', width: '100%' }}
              />
            </div>
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="section section--alt">
        <div className="container">
          <div className="section-header text-center mb-8">
            <h2>Why Choose HQ Aviation Maintenance?</h2>
          </div>
          <div className="grid grid--3">
            <div className="card">
              <div className="card__content text-center">
                <div className="text-accent text-4xl mb-4">
                  <i className="fas fa-users"></i>
                </div>
                <h3>85+ Aircraft</h3>
                <p className="text-sm text-muted">Under our care - one of the largest fleets in the UK</p>
              </div>
            </div>
            <div className="card">
              <div className="card__content text-center">
                <div className="text-accent text-4xl mb-4">
                  <i className="fas fa-clock"></i>
                </div>
                <h3>30+ Years</h3>
                <p className="text-sm text-muted">Experience in helicopter maintenance</p>
              </div>
            </div>
            <div className="card">
              <div className="card__content text-center">
                <div className="text-accent text-4xl mb-4">
                  <i className="fas fa-award"></i>
                </div>
                <h3>Factory Trained</h3>
                <p className="text-sm text-muted">All technicians trained by Robinson and Guimbal</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="cta">
        <div className="container">
          <h2 className="cta__title">Need Maintenance Support?</h2>
          <p className="cta__description">
            Contact our maintenance team to discuss your requirements or schedule an inspection.
          </p>
          <div className="flex justify-center gap-4">
            <Link to="/contact" className="btn btn--accent btn--lg">
              Contact Maintenance
            </Link>
            <Link to="/services/parts" className="btn btn--outline btn--lg">
              Parts & Spares
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}

export default Maintenance;

import { Link } from 'react-router-dom';

function AircraftSales() {
  const aircraft = [
    {
      name: 'R22 Beta II',
      subtitle: 'Training Excellence',
      description: 'The world\'s most popular training helicopter. Perfect for students and schools.',
      image: '/assets/images/r22.jpg',
      link: '/aircraft-sales/new/r22'
    },
    {
      name: 'R44 Series',
      subtitle: 'Versatile Performance',
      description: 'Available in Raven I, Raven II, and Cadet configurations for various missions.',
      image: '/assets/images/r44.jpg',
      link: '/aircraft-sales/new/r44'
    },
    {
      name: 'R66 Turbine',
      subtitle: 'Turbine Power',
      description: 'The NxG series brings next-generation features to the proven R66 platform.',
      image: '/assets/images/r66.jpg',
      link: '/aircraft-sales/new/r66'
    },
    {
      name: 'R88',
      subtitle: 'Coming Soon',
      description: 'Robinson\'s newest and largest helicopter. Eight seats, turbine powered.',
      image: '/assets/images/r88.jpg',
      link: '/aircraft-sales/new/r88'
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
            <span>Aircraft Sales</span>
          </div>
          <h1 className="page-header__title">Aircraft Sales</h1>
          <p className="page-header__description">
            Official Robinson Helicopter Dealer - New & Used Aircraft
          </p>
        </div>
      </div>

      {/* New Aircraft */}
      <section className="section">
        <div className="container">
          <div className="section-header text-center mb-8">
            <span className="text-accent text-sm text-uppercase font-bold">New Aircraft</span>
            <h2>Robinson Helicopter Range</h2>
          </div>
          <div className="grid grid--4">
            {aircraft.map((item) => (
              <div key={item.name} className="card aircraft-card">
                <div className="card__image">
                  <img src={item.image} alt={item.name} loading="lazy" />
                </div>
                <div className="card__content">
                  <span className="card__subtitle">{item.subtitle}</span>
                  <h3 className="card__title">{item.name}</h3>
                  <p className="card__description">{item.description}</p>
                  <Link to={item.link} className="btn btn--outline">View Details</Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Used Aircraft CTA */}
      <section className="section section--alt">
        <div className="container text-center">
          <h2>Looking for Used Aircraft?</h2>
          <p className="text-lg text-muted mb-8">
            Browse our current inventory of pre-owned helicopters or contact us about off-market opportunities.
          </p>
          <div className="flex justify-center gap-4">
            <Link to="/aircraft-sales/used" className="btn btn--primary btn--lg">
              View Inventory
            </Link>
            <Link to="/contact" className="btn btn--outline btn--lg">
              Contact Sales
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}

export default AircraftSales;

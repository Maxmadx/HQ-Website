import { Link } from 'react-router-dom';

function CaptainQ() {
  const achievements = [
    {
      icon: 'fa-trophy',
      title: 'Guinness World Record Holder',
      description: 'Multiple world records in helicopter aviation'
    },
    {
      icon: 'fa-medal',
      title: '2x Helicopter Aerobatics World Champion',
      description: 'Dominating international helicopter aerobatics competition'
    },
    {
      icon: 'fa-globe',
      title: 'Pioneer of World Helicopter Circumnavigation',
      description: 'Leading groundbreaking expeditions around the globe'
    },
    {
      icon: 'fa-compass',
      title: 'First to Both Poles by Helicopter',
      description: 'The only person to fly a helicopter to both North and South Poles'
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
            <span>Captain Q</span>
          </div>
          <h1 className="page-header__title">Captain Quentin Smith</h1>
          <p className="page-header__description">
            World Renowned Helicopter Pilot, Adventurer & Record Breaker
          </p>
        </div>
      </div>

      {/* Hero Section */}
      <section className="section">
        <div className="container">
          <div className="grid grid--2 gap-8 items-center">
            <div>
              <img
                src="/assets/images/team/world-helicopter-champion-quentin-smith.webp"
                alt="Quentin Smith - World Helicopter Champion"
                loading="lazy"
                style={{ borderRadius: 'var(--border-radius-md)', width: '100%' }}
              />
            </div>
            <div>
              <span className="text-accent text-sm text-uppercase font-bold">Meet Q</span>
              <h2>A Life Dedicated to Flight</h2>
              <p>
                Captain Quentin "Q" Smith is one of the world's most accomplished helicopter pilots.
                With over 30,000 hours of flight time and adventures spanning every continent,
                Q has pushed the boundaries of what's possible in rotary-wing aviation.
              </p>
              <p>
                As the founder of HQ Aviation, Q has built a world-class facility at Denham Aerodrome
                that combines his passion for flight with a commitment to excellence in training,
                sales, and expeditions.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Achievements */}
      <section className="section section--alt">
        <div className="container">
          <div className="section-header text-center mb-8">
            <span className="text-accent text-sm text-uppercase font-bold">Achievements</span>
            <h2>Record-Breaking Accomplishments</h2>
          </div>
          <div className="features">
            {achievements.map((achievement) => (
              <div key={achievement.title} className="feature">
                <div className="feature__icon">
                  <i className={`fas ${achievement.icon}`}></i>
                </div>
                <h3 className="feature__title">{achievement.title}</h3>
                <p className="feature__description">{achievement.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Expeditions Section */}
      <section className="section">
        <div className="container">
          <div className="grid grid--2 gap-8 items-center">
            <div>
              <span className="text-accent text-sm text-uppercase font-bold">Expeditions</span>
              <h2>Adventures to the Ends of the Earth</h2>
              <p>
                From the frozen landscapes of Antarctica to the rugged peaks of the Himalayas,
                Captain Q has led helicopter expeditions to some of the most challenging and
                remote destinations on Earth.
              </p>
              <p>
                His pioneering flight to the South Pole by helicopter marked a historic achievement
                in aviation, demonstrating that with the right preparation, skill, and determination,
                even the most ambitious goals can be achieved.
              </p>
              <Link to="/expeditions" className="btn btn--primary">
                Explore Expeditions
              </Link>
            </div>
            <div>
              <img
                src="/assets/images/expeditions/south-pole-by-helicopter-quentin-smith.webp"
                alt="Quentin Smith at the South Pole by Helicopter"
                loading="lazy"
                style={{ borderRadius: 'var(--border-radius-md)', width: '100%' }}
              />
            </div>
          </div>
        </div>
      </section>

      {/* World Champion Section */}
      <section className="section section--alt">
        <div className="container">
          <div className="grid grid--2 gap-8 items-center">
            <div>
              <img
                src="/assets/images/expeditions/helicopter-expeditions-quentin-smith.webp"
                alt="Captain Q leading helicopter expedition"
                loading="lazy"
                style={{ borderRadius: 'var(--border-radius-md)', width: '100%' }}
              />
            </div>
            <div>
              <span className="text-accent text-sm text-uppercase font-bold">World Champion</span>
              <h2>Aerobatics Excellence</h2>
              <p>
                Captain Q's two World Championship titles in helicopter aerobatics are a testament
                to his extraordinary skill and precision. Competing against the best pilots from
                around the globe, Q has demonstrated mastery in the most demanding flight maneuvers.
              </p>
              <p>
                This competitive excellence translates directly into the training programs at
                HQ Aviation, where students benefit from world-class instruction and techniques
                honed at the highest levels of the sport.
              </p>
              <Link to="/training" className="btn btn--outline">
                Learn to Fly with Us
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Video Section */}
      <section className="section">
        <div className="container text-center">
          <span className="text-accent text-sm text-uppercase font-bold">Watch</span>
          <h2>Captain Q in Action</h2>
          <p className="text-lg text-muted mb-8" style={{ maxWidth: '700px', margin: '0 auto 2rem' }}>
            See Captain Q's incredible flying skills and adventures captured on video.
          </p>
          <div className="video-container" style={{ maxWidth: '800px', margin: '0 auto' }}>
            <div style={{ position: 'relative', paddingBottom: '56.25%', height: 0, overflow: 'hidden', borderRadius: 'var(--border-radius-md)' }}>
              <iframe
                src="https://www.youtube.com/embed/VIDEO_ID"
                title="Captain Q - Helicopter Adventures"
                style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', border: 0 }}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              ></iframe>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="cta">
        <div className="container">
          <h2 className="cta__title">Fly with Captain Q</h2>
          <p className="cta__description">
            Join Captain Q on an unforgettable helicopter expedition or learn to fly at HQ Aviation.
          </p>
          <div className="flex justify-center gap-4">
            <Link to="/expeditions" className="btn btn--accent btn--lg">
              View Expeditions
            </Link>
            <Link to="/training/trial-lessons" className="btn btn--outline btn--lg">
              Book a Trial Lesson
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}

export default CaptainQ;

import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

function Home() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [trainingSlide, setTrainingSlide] = useState(0);
  const [maintenanceSlide, setMaintenanceSlide] = useState(0);
  const [salesSlide, setSalesSlide] = useState(0);

  // Gallery slideshow images - exact list from reference
  const galleryImages = [
    { src: '/assets/images/facility/hq-0745.jpg', alt: 'HQ-0745.jpg' },
    { src: '/assets/images/gallery/events/img_2644.jpeg', alt: 'IMG_2644.jpeg' },
    { src: '/assets/images/facility/hq-0354.jpg', alt: 'HQ-0354.jpg' },
    { src: '/assets/images/facility/hq-0254.jpg', alt: 'HQ-0254.jpg' },
    { src: '/assets/images/facility/hq-0035.jpg', alt: 'HQ-0035.jpg' },
    { src: '/assets/images/facility/hq-0089.jpg', alt: 'HQ-0089.jpg' },
    { src: '/assets/images/facility/hq-0696.jpg', alt: 'HQ-0696.jpg' },
    { src: '/assets/images/facility/hq-0409.jpg', alt: 'HQ-0409.jpg' },
    { src: '/assets/images/facility/hq-0167.jpg', alt: 'HQ-0167.jpg' },
    { src: '/assets/images/facility/hq-0698.jpg', alt: 'HQ-0698.jpg' },
    { src: '/assets/images/gallery/flying/flying--1.jpg', alt: 'flying- (1).jpg' },
    { src: '/assets/images/gallery/carousel/rotating1.jpg', alt: 'rotating1.jpg' },
    { src: '/assets/images/gallery/carousel/rotating6.jpg', alt: 'rotating6.jpg' },
    { src: '/assets/images/training/home-2312.jpg', alt: 'Home 2312.jpg' },
    { src: '/assets/images/gallery/carousel/rotating-3.jpg', alt: 'rotating (3).jpg' },
    { src: '/assets/images/legacy/dated/2015-04-09-16.29.34.jpg', alt: '2015-04-09 16.29.34.jpg' },
    { src: '/assets/images/used-aircraft/r66/gdspz.jpg', alt: 'GDSPZ.JPG' },
  ];

  // Training carousel slides - exact content from reference
  const trainingSlides = [
    {
      title: 'Discovery Flight',
      image: '/assets/images/gallery/carousel/rotating-4.jpg',
      description: 'Flying is the ultimate dream pursued by mankind. Should you want to live it for real, the discovery flight will certainly fulfil your expectations: After a pre-flight briefing, you will enjoy a full hands-on flying experience with one of our instructors.',
      cta: 'Learn More',
      link: '/training/trial-lessons'
    },
    {
      title: 'Private Pilot Licence',
      image: '/assets/images/gallery/carousel/rotating-4.jpg',
      description: 'Let aside the ground exams that most students self study before taking the tests on site, the obtention of a PPL(H) requires a minimum of 45 hrs of flight training, including 10 hrs of solo. The duration varies depending on commitment.',
      cta: 'Learn More',
      link: '/training/ppl'
    },
    {
      title: 'Commercial Pilot Licence',
      image: '/assets/images/gallery/carousel/rotating-4.jpg',
      description: 'Holding a Commercial Pilot Licence, CPL(H) gives you the status of professional helicopter pilot. To achieve this, 155 hrs of flying time post licence is required, of which 50 hrs must be Pilot In Command (PIC).',
      cta: 'Learn More',
      link: '/training'
    },
    {
      title: 'Type Rating',
      image: '/assets/images/gallery/carousel/rotating-4.jpg',
      description: 'Having achieved your PPL(H), you may wish to fly different types of helicopter. A type specific ground training course followed by a minimum of 5 Hrs of flight training will suffice to put you to the Type Rating test.',
      cta: 'Learn More',
      link: '/training'
    },
    {
      title: 'Night Rating',
      image: '/assets/images/gallery/carousel/rotating-4.jpg',
      description: 'Holding a night rating gives you the most flexibility, as sunset will no longer prevent you from flying. To achieve this, 100 hrs of flying post licence is required, of which 60 Hrs must be Pilot In Command.',
      cta: 'Learn More',
      link: '/training'
    },
    {
      title: 'Self-Fly Hire',
      image: '/assets/images/gallery/carousel/rotating-4.jpg',
      description: 'With an impressive fleet of over 30 helicopters, HQ will certainly be able to facilitate your flying requirements, either on a short term hiring or on a long term leasing basis.',
      cta: 'Learn More',
      link: '/services'
    }
  ];

  // Maintenance carousel slides - exact content from reference
  const maintenanceSlides = [
    {
      title: 'Rebuilds',
      image: '/assets/images/gallery/carousel/rotating-4.jpg',
      description: 'At HQ, our experienced and dedicated engineers carry out the highest quality rebuilds on calendar or time expired machines. The 12 years inspection or 2200 Hr overhaul will be tailored to your specific needs.',
      cta: 'Learn More',
      link: '/services/maintenance'
    },
    {
      title: 'Maintenance',
      image: '/assets/images/gallery/carousel/rotating-4.jpg',
      description: 'Being an authorised Part 145 Maintenance Facility, HQ can carry out all types of work on your Robinson or Cabri Helicopter. From small scheduled inspections to unforeseen defects, our engineers will look after your machine.',
      cta: 'Learn More',
      link: '/services/maintenance'
    },
    {
      title: 'Part Sales',
      image: '/assets/images/gallery/carousel/rotating-4.jpg',
      description: 'With an impressive stock of Robinson and Cabri spares, HQ can offer an AOG service to get the parts you need without delay. Our Stores Team are always on hand to give you some assistance.',
      cta: 'Learn More',
      link: '/contact'
    },
    {
      title: 'Hangarage',
      image: '/assets/images/gallery/carousel/rotating-4.jpg',
      description: 'Please enquire if you would like to base your aircraft temporarily or permanently at Denham. Our Operations team are on site 7 days a week, to provide moving in-and-out service and refueling assistance.',
      cta: 'Learn More',
      link: '/contact'
    },
    {
      title: 'Avionics',
      image: '/assets/images/gallery/carousel/rotating-4.jpg',
      description: 'From upgrading your existing radio, to installing USB ports to the instrument console: HQ works with experienced Avionics engineers to ensure the best outcome for the owner and improve the whole flying experience.',
      cta: 'Learn More',
      link: '/contact'
    }
  ];

  // Sales carousel slides - exact content from reference
  const salesSlides = [
    {
      title: 'NEW HELICOPTERS',
      image: '/assets/images/legacy/squarespace/image-asset.jpeg',
      description: 'Global Rotors, a division of HQ Aviation Ltd, are an official approved Robinson Factory distributor. GR will give you the necessary guidance to design your brand new "Robbie". With a great range of optional equipment, your R22, R44 or R66 will be tailored to your needs. Contact us to book a demo at our London showroom.',
      cta: 'Learn More',
      link: '/aircraft-sales'
    },
    {
      title: 'USED HELICOPTERS',
      image: '/assets/images/legacy/squarespace/image-asset-1.jpeg',
      description: 'If you are considering selling your machine, please contact our sales team. HQ will do the necessary arrangements to facilitate the transaction. If on the other hand, we are willing to buy a used aircraft, please let us know your criteria and HQ will look for a suitable machine for you.',
      cta: 'Learn More',
      link: '/aircraft-sales'
    },
    {
      title: 'REBUILT HELICOPTERS',
      image: '/assets/images/facility/sales-rebuild.jpg',
      description: 'Having rebuilt over 40 Robinsons in his career, our expert Chief Engineer has gained the experience to deliver a "like new" product. Attention to details is paramount, fine tuning is a must, and there is no limit to the choice of colours and materials that can be selected to personalise your beloved machine.',
      cta: 'Learn More',
      link: '/services/maintenance'
    }
  ];

  // Auto-rotate main gallery
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % galleryImages.length);
    }, 4000);
    return () => clearInterval(timer);
  }, [galleryImages.length]);

  // Scroll reveal effect
  useEffect(() => {
    const reveals = document.querySelectorAll('.reveal-element');
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible');
          }
        });
      },
      { threshold: 0.1 }
    );
    reveals.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  // Navigation for carousels
  const nextSlide = (setter, current, length) => {
    setter((current + 1) % length);
  };

  const prevSlide = (setter, current, length) => {
    setter((current - 1 + length) % length);
  };

  return (
    <>
      {/* Hero Section - Squarespace Gallery Carousel */}
      <section className="hq-hero-carousel">
        <div className="sqs-gallery-container sqs-gallery-block-slideshow">
          <div className="sqs-gallery sqs-gallery-design-stacked">
            {galleryImages.map((image, index) => (
              <div
                key={index}
                className={`slide content-fill sqs-gallery-design-stacked-slide ${index === currentSlide ? 'active' : ''}`}
                style={{
                  opacity: index === currentSlide ? 1 : 0,
                  visibility: index === currentSlide ? 'visible' : 'hidden',
                  zIndex: index === currentSlide ? 2 : 1
                }}
              >
                <img
                  className="thumb-image loaded"
                  src={image.src}
                  alt={image.alt}
                  loading={index === 0 ? 'eager' : 'lazy'}
                  data-image={image.src}
                  data-type="image"
                />
              </div>
            ))}
          </div>

          {/* Gallery Controls */}
          <div className="sqs-gallery-meta-container">
            <div className="sqs-gallery-controls">
              <button
                className="previous"
                aria-label="Previous Slide"
                onClick={() => prevSlide(setCurrentSlide, currentSlide, galleryImages.length)}
              ></button>
              <button
                className="next"
                aria-label="Next Slide"
                onClick={() => nextSlide(setCurrentSlide, currentSlide, galleryImages.length)}
              ></button>
            </div>
          </div>
        </div>

        {/* Overlay Content */}
        <div className="hq-hero-carousel__overlay"></div>
        <div className="hq-hero-carousel__content">
          <h1 className="hq-hero-carousel__headline">Elevate Your Journey</h1>
          <p className="hq-hero-carousel__tagline">Robinson helicopter specialists since 2010</p>
        </div>

        {/* Scroll Indicator */}
        <div className="hq-hero__scroll">
          <span>Scroll</span>
          <svg viewBox="0 0 24 24">
            <path d="M12 5v14M5 12l7 7 7-7"></path>
          </svg>
        </div>
      </section>

      {/* About Section with Gallery Slideshow */}
      <section id="about" className="Index-page">
        <div className="Index-page-content">
          <div className="sqs-layout sqs-grid-12 columns-12">
            {/* Gallery Slideshow */}
            <div className="sqs-block gallery-block sqs-block-gallery reveal-element">
              <div className="sqs-block-content">
                <div className="sqs-gallery-container sqs-gallery-block-slideshow sqs-gallery-has-controls sqs-gallery-has-thumbnails">
                  <div className="sqs-gallery sqs-gallery-design-stacked">
                    {galleryImages.map((image, index) => (
                      <div
                        key={index}
                        className={`slide content-fill sqs-gallery-design-stacked-slide ${index === currentSlide ? 'active' : ''}`}
                        style={{
                          opacity: index === currentSlide ? 1 : 0,
                          visibility: index === currentSlide ? 'visible' : 'hidden',
                          zIndex: index === currentSlide ? 999 : 888
                        }}
                      >
                        <img
                          className="thumb-image"
                          src={image.src}
                          alt={image.alt}
                          loading="lazy"
                        />
                        <div className="color-overlay"></div>
                      </div>
                    ))}
                  </div>
                  <div className="sqs-gallery-meta-container">
                    <div className="sqs-gallery-controls show-hover-effect">
                      <button
                        className="previous"
                        aria-label="Previous Slide"
                        onClick={() => prevSlide(setCurrentSlide, currentSlide, galleryImages.length)}
                      ></button>
                      <button
                        className="next"
                        aria-label="Next Slide"
                        onClick={() => nextSlide(setCurrentSlide, currentSlide, galleryImages.length)}
                      ></button>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* About Us Text - Exact from reference */}
            <div className="sqs-block html-block sqs-block-html reveal-element">
              <div className="sqs-block-content">
                <div className="sqs-html-content">
                  <h1 style={{ textAlign: 'center', whiteSpace: 'pre-wrap' }}><strong>About us</strong></h1>
                  <p style={{ textAlign: 'center', whiteSpace: 'pre-wrap' }}>
                    Established by <strong>Quentin Smith, HQ Aviation</strong> is offering a new helicopter training concept, based on over 40 years of experience and on the strong belief that flying is above all, a beautiful thing that deserves to be enjoyed as such. We've closely aligned with the Robinson brand, becoming Robinson specialists as we strongly believe in their product lineup. We are a dedicated Robinson Approved Dealership &amp; Service Centre. And we provide support for a myriad of other aircraft based on customer needs being tapped into various rotary markets allows us to to adapt to client needs, whether it be sourcing aircraft or offering type ratings on many helicopter types etc.
                  </p>
                </div>
              </div>
            </div>

            {/* Video Block placeholder */}
            <div className="sqs-block video-block sqs-block-video reveal-element">
              <div className="sqs-block-content">
                <div className="intrinsic" style={{ maxWidth: '100%' }}>
                  <div className="embed-block-wrapper" style={{ paddingBottom: '56.25%' }}>
                    {/* Video embed placeholder */}
                  </div>
                </div>
              </div>
            </div>

            {/* Second paragraph - Exact from reference */}
            <div className="sqs-block html-block sqs-block-html reveal-element">
              <div className="sqs-block-content">
                <div className="sqs-html-content">
                  <p style={{ textAlign: 'center', whiteSpace: 'pre-wrap' }}>
                    Discover the thrilling sensations of having the controls for the very first time, put yourself to the test by taking your private pilot licence, and make the best of it by self-fly hiring one of our machines. Our experienced instructors will help you achieve your goals in a relaxed and friendly atmosphere.
                  </p>
                </div>
              </div>
            </div>

            {/* More about us button */}
            <div className="sqs-block button-block sqs-block-button reveal-element">
              <div className="sqs-block-content">
                <div className="sqs-block-button-container sqs-block-button-container--center">
                  <Link to="/about-us" className="sqs-block-button-element--medium sqs-button-element--primary sqs-block-button-element">
                    More about us
                  </Link>
                </div>
              </div>
            </div>

            <div className="sqs-block horizontalrule-block sqs-block-horizontalrule reveal-element">
              <div className="sqs-block-content"><hr /></div>
            </div>
          </div>
        </div>
      </section>

      {/* Flying Parallax Section */}
      <section
        id="helicopter-flying"
        className="Index-page Index-page--has-image"
        style={{ backgroundImage: 'url(/assets/images/gallery/flying/flying-.jpg)' }}
      >
        <div className="Index-page-content sqs-alternate-block-style-container">
          <div className="sqs-layout sqs-grid-12 columns-12">
            <div className="sqs-block html-block sqs-block-html reveal-element">
              <div className="sqs-block-content">
                <div className="sqs-html-content">
                  <h2 style={{ textAlign: 'center', whiteSpace: 'pre-wrap' }}><strong>FLYING</strong></h2>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Training Section */}
      <section id="helicopter-training" className="Index-page">
        <div className="Index-page-content">
          <div className="sqs-layout sqs-grid-12 columns-12">
            <div className="sqs-block horizontalrule-block sqs-block-horizontalrule reveal-element">
              <div className="sqs-block-content"><hr /></div>
            </div>

            {/* Training Header - Exact from reference */}
            <div className="sqs-block html-block sqs-block-html reveal-element">
              <div className="sqs-block-content">
                <div className="sqs-html-content">
                  <h3 style={{ textAlign: 'center', whiteSpace: 'pre-wrap' }}><strong>1/ </strong>Explore our Training Courses</h3>
                </div>
              </div>
            </div>

            {/* Training intro paragraph - Exact from reference */}
            <div className="sqs-block html-block sqs-block-html reveal-element">
              <div className="sqs-block-content">
                <div className="sqs-html-content">
                  <p style={{ textAlign: 'center', whiteSpace: 'pre-wrap' }}>
                    Unlock your true potential in the skies with HQ Aviation, where world-class helicopter training meets a vibrant club atmosphere at our Denham Aerodrome base. From your very first Trial Lesson to achieving your Private (PPL) or Commercial (CPL) licences, Night Ratings, and Type Ratings, our expert instructors guide you through every rotor-turn using our pristine fleet of Robinson R22, R44, and R66 helicopters. Founded by world-record holder Captain Quentin Smith, we don't just teach you to fly; we welcome you into a passionate aviation family, ensuring your journey—whether for a hobby or a professional career—is as safe as it is exhilarating.
                  </p>
                </div>
              </div>
            </div>

            {/* Training Carousel - Exact structure from reference */}
            <div className="sqs-block embed-block sqs-block-embed reveal-element">
              <div className="sqs-block-content">
                <div className="hq-service-carousel js-hq-carousel">
                  <div className="hq-tabs-container">
                    {trainingSlides.map((slide, index) => (
                      <button
                        key={index}
                        className={`hq-tab ${index === trainingSlide ? 'active' : ''}`}
                        onClick={() => setTrainingSlide(index)}
                      >
                        {slide.title}
                      </button>
                    ))}
                  </div>

                  <div className="hq-carousel-body">
                    <button
                      className="hq-arrow hq-prev js-prev"
                      onClick={() => prevSlide(setTrainingSlide, trainingSlide, trainingSlides.length)}
                    >
                      &#10094;
                    </button>

                    <div className="hq-slides-wrapper">
                      {trainingSlides.map((slide, index) => (
                        <div
                          key={index}
                          className={`hq-slide ${index === trainingSlide ? 'active' : ''} ${
                            index === (trainingSlide + 1) % trainingSlides.length ? 'next' : ''
                          } ${
                            index === (trainingSlide - 1 + trainingSlides.length) % trainingSlides.length ? 'prev' : ''
                          }`}
                        >
                          <h3>{slide.title}</h3>
                          <img src={slide.image} alt={slide.title} className="hq-slide-img" />
                          <p>{slide.description}</p>
                          <Link to={slide.link} className="hq-btn">{slide.cta}</Link>
                        </div>
                      ))}
                    </div>

                    <button
                      className="hq-arrow hq-next js-next"
                      onClick={() => nextSlide(setTrainingSlide, trainingSlide, trainingSlides.length)}
                    >
                      &#10095;
                    </button>
                  </div>
                </div>
              </div>
            </div>

            <div className="sqs-block horizontalrule-block sqs-block-horizontalrule reveal-element">
              <div className="sqs-block-content"><hr /></div>
            </div>
          </div>
        </div>
      </section>

      {/* Maintenance Parallax Section */}
      <section
        id="maintenance"
        className="Index-page Index-page--has-image"
        style={{ backgroundImage: 'url(/assets/images/facility/maintenance-.jpg)' }}
      >
        <div className="Index-page-content sqs-alternate-block-style-container">
          <div className="sqs-layout sqs-grid-12 columns-12">
            <div className="sqs-block html-block sqs-block-html reveal-element">
              <div className="sqs-block-content">
                <div className="sqs-html-content">
                  <h2 style={{ textAlign: 'center', whiteSpace: 'pre-wrap' }}><strong>MAINTENANCE</strong></h2>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Maintenance Services Section */}
      <section id="maintenance-services" className="Index-page">
        <div className="Index-page-content">
          <div className="sqs-layout sqs-grid-12 columns-12">
            <div className="sqs-block horizontalrule-block sqs-block-horizontalrule reveal-element">
              <div className="sqs-block-content"><hr /></div>
            </div>

            {/* Maintenance Header - Exact from reference */}
            <div className="sqs-block html-block sqs-block-html reveal-element">
              <div className="sqs-block-content">
                <div className="sqs-html-content">
                  <h3 style={{ textAlign: 'center', whiteSpace: 'pre-wrap' }}>2/ Complete Helicopter Care: From Routine Maintenance to Factory-Standard Rebuilds</h3>
                </div>
              </div>
            </div>

            {/* Service Grid - Exact from reference */}
            <div className="sqs-block embed-block sqs-block-embed reveal-element">
              <div className="sqs-block-content">
                <div className="hq-service-grid">
                  <div className="service-item">
                    <p>At HQ Aviation, we believe that <strong>world-class engineering is the heartbeat of flying</strong>. As a fully authorised CAA Part 145 maintenance facility and a designated Robinson Service Centre, our Denham-based hangar offers uncompromising care for your aircraft—<strong>our factory-trained engineers treat every helicopter as if it were their own</strong>.</p>
                  </div>

                  <div className="service-item image-container">
                    <img
                      src="/assets/images/logos/certifications/robinson.jpg"
                      alt="Robinson Helicopter Service Centre"
                    />
                  </div>

                  <div className="service-item">
                    <p>From <strong>routine 100-hour inspections</strong> to <strong>complete 12-year overhauls</strong>, we handle every task with precision and a personal touch—because keeping you safe in the air is more than a job; it's our passion. Trust HQ Aviation to keep your rotor turning smoothly for years to come.</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Maintenance Carousel */}
            <div className="sqs-block embed-block sqs-block-embed reveal-element">
              <div className="sqs-block-content">
                <div className="hq-service-carousel js-hq-carousel">
                  <div className="hq-tabs-container">
                    {maintenanceSlides.map((slide, index) => (
                      <button
                        key={index}
                        className={`hq-tab ${index === maintenanceSlide ? 'active' : ''}`}
                        onClick={() => setMaintenanceSlide(index)}
                      >
                        {slide.title}
                      </button>
                    ))}
                  </div>

                  <div className="hq-carousel-body">
                    <button
                      className="hq-arrow hq-prev js-prev"
                      onClick={() => prevSlide(setMaintenanceSlide, maintenanceSlide, maintenanceSlides.length)}
                    >
                      &#10094;
                    </button>

                    <div className="hq-viewport">
                      <div className="hq-slides-container">
                        {maintenanceSlides.map((slide, index) => (
                          <div
                            key={index}
                            className={`hq-slide ${index === maintenanceSlide ? 'active' : ''} ${
                              index === (maintenanceSlide + 1) % maintenanceSlides.length ? 'next' : ''
                            } ${
                              index === (maintenanceSlide - 1 + maintenanceSlides.length) % maintenanceSlides.length ? 'prev' : ''
                            }`}
                          >
                            <h3>{slide.title}</h3>
                            <img src={slide.image} alt={slide.title} className="hq-slide-img" />
                            <p>{slide.description}</p>
                            <Link to={slide.link} className="hq-btn">{slide.cta}</Link>
                          </div>
                        ))}
                      </div>
                    </div>

                    <button
                      className="hq-arrow hq-next js-next"
                      onClick={() => nextSlide(setMaintenanceSlide, maintenanceSlide, maintenanceSlides.length)}
                    >
                      &#10095;
                    </button>
                  </div>
                </div>
              </div>
            </div>

            <div className="sqs-block horizontalrule-block sqs-block-horizontalrule reveal-element">
              <div className="sqs-block-content"><hr /></div>
            </div>
          </div>
        </div>
      </section>

      {/* Sales Parallax Section */}
      <section id="helicopter-sales" className="Index-page Index-page--has-image">
        <div className="Index-page-content sqs-alternate-block-style-container">
          <div className="sqs-layout sqs-grid-12 columns-12">
            <div className="sqs-block html-block sqs-block-html reveal-element">
              <div className="sqs-block-content">
                <div className="sqs-html-content">
                  <h2 style={{ textAlign: 'center', whiteSpace: 'pre-wrap' }}><strong>Sales</strong></h2>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Sales Parallax Section */}
      <section
        id="sales"
        className="Index-page Index-page--has-image"
        style={{ backgroundImage: 'url(/assets/images/facility/main-sales-pic.jpg)' }}
      >
        <div className="Index-page-content sqs-alternate-block-style-container">
          <div className="sqs-layout sqs-grid-12 columns-12">
            <div className="sqs-block html-block sqs-block-html reveal-element">
              <div className="sqs-block-content">
                <div className="sqs-html-content">
                  <h2 style={{ textAlign: 'center', whiteSpace: 'pre-wrap' }}><strong>Sales</strong></h2>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Sales Section */}
      <section id="sales-services" className="Index-page">
        <div className="Index-page-content">
          <div className="sqs-layout sqs-grid-12 columns-12">
            <div className="sqs-block horizontalrule-block sqs-block-horizontalrule reveal-element">
              <div className="sqs-block-content"><hr /></div>
            </div>

            {/* Sales Header - Exact from reference */}
            <div className="sqs-block html-block sqs-block-html reveal-element">
              <div className="sqs-block-content">
                <div className="sqs-html-content">
                  <h3 style={{ textAlign: 'center', whiteSpace: 'pre-wrap' }}><strong>3/ The Complete Ownership Solution: From Sourcing to Support</strong></h3>
                </div>
              </div>
            </div>

            {/* Robinson Direct Grid - Exact from reference */}
            <div className="sqs-block embed-block sqs-block-embed reveal-element">
              <div className="sqs-block-content">
                <div className="robinson-direct-grid">
                  <div className="robinson-item">
                    <p>As a <strong>Robinson Approved Dealer</strong>, we manage the <strong>entire ownership journey</strong>—<strong>matching pilots to machines</strong> through expert brokerage and a strong industry reputation. Our fleet is constantly evolving, allowing us to leverage our vast network of private owners to structure <strong>deals that work for all parties</strong>.</p>
                  </div>

                  <div className="robinson-item image-container">
                    <img
                      src="/assets/images/logos/certifications/robinson.jpg"
                      alt="Robinson Helicopter Company - 2025 Authorized Dealer"
                    />
                  </div>

                  <div className="robinson-item">
                    <p>Whether you are configuring a <strong>bespoke factory-new Robinson</strong>, sourcing a hard-to-find pre-owned machine from our <strong>off-market inventory</strong>, or securing <strong>essential spares</strong>, we provide support that persists from purchase through the entirety of your ownership. We deliver a <strong>seamless, end-to-end experience</strong> designed to match you with the <strong>perfect airframe for your mission</strong>.</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Sales Carousel */}
            <div className="sqs-block embed-block sqs-block-embed reveal-element">
              <div className="sqs-block-content">
                <div className="hq-service-carousel js-hq-carousel">
                  <div className="hq-tabs-container">
                    {salesSlides.map((slide, index) => (
                      <button
                        key={index}
                        className={`hq-tab ${index === salesSlide ? 'active' : ''}`}
                        onClick={() => setSalesSlide(index)}
                      >
                        {slide.title.replace('HELICOPTERS', '').trim()}
                      </button>
                    ))}
                  </div>

                  <div className="hq-carousel-body">
                    <button
                      className="hq-arrow hq-prev js-prev"
                      onClick={() => prevSlide(setSalesSlide, salesSlide, salesSlides.length)}
                    >
                      &#10094;
                    </button>

                    <div className="hq-viewport">
                      <div className="hq-slides-container">
                        {salesSlides.map((slide, index) => (
                          <div
                            key={index}
                            className={`hq-slide ${index === salesSlide ? 'active' : ''} ${
                              index === (salesSlide + 1) % salesSlides.length ? 'next' : ''
                            } ${
                              index === (salesSlide - 1 + salesSlides.length) % salesSlides.length ? 'prev' : ''
                            }`}
                          >
                            <h3>{slide.title}</h3>
                            <img src={slide.image} alt={slide.title} className="hq-slide-img" />
                            <p>{slide.description}</p>
                            <Link to={slide.link} className="hq-btn">{slide.cta}</Link>
                          </div>
                        ))}
                      </div>
                    </div>

                    <button
                      className="hq-arrow hq-next js-next"
                      onClick={() => nextSlide(setSalesSlide, salesSlide, salesSlides.length)}
                    >
                      &#10095;
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="Index-page">
        <div className="Index-page-content">
          <div className="sqs-layout sqs-grid-12 columns-12">
            <div className="sqs-block horizontalrule-block sqs-block-horizontalrule reveal-element">
              <div className="sqs-block-content"><hr /></div>
            </div>

            {/* Contact Header - Exact from reference */}
            <div className="sqs-block html-block sqs-block-html reveal-element">
              <div className="sqs-block-content">
                <div className="sqs-html-content">
                  <h3 style={{ textAlign: 'center', whiteSpace: 'pre-wrap' }}>4/ GET IN TOUCH</h3>
                </div>
              </div>
            </div>

            <div className="row sqs-row">
              {/* Find Us Column */}
              <div className="col sqs-col-4 span-4">
                <div className="sqs-block html-block sqs-block-html reveal-element">
                  <div className="sqs-block-content">
                    <div className="sqs-html-content">
                      <h3 style={{ textAlign: 'center', whiteSpace: 'pre-wrap' }}>find us</h3>
                    </div>
                  </div>
                </div>
              </div>

              {/* Contact Us Column */}
              <div className="col sqs-col-4 span-4">
                <div className="sqs-block html-block sqs-block-html reveal-element">
                  <div className="sqs-block-content">
                    <div className="sqs-html-content">
                      <h3 style={{ textAlign: 'center', whiteSpace: 'pre-wrap' }}>CONTACT US</h3>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Accordion - Contact Details */}
            <div className="row sqs-row">
              <div className="col sqs-col-4 span-4">
                <div className="sqs-block accordion-block sqs-block-accordion reveal-element">
                  <div className="sqs-block-content">
                    <div className="accordion-items-container">
                      <details className="accordion-item">
                        <summary className="accordion-item__title">
                          <span className="accordion-item__title-text">General Enquiries</span>
                        </summary>
                        <div className="accordion-item__description">
                          <p>Email: info@hqaviation.com</p>
                          <p>Phone: +44 1895 833373</p>
                        </div>
                      </details>

                      <details className="accordion-item">
                        <summary className="accordion-item__title">
                          <span className="accordion-item__title-text">Sales Enquiries</span>
                        </summary>
                        <div className="accordion-item__description">
                          <p>Email: sales@hqaviation.com</p>
                          <p>Phone: +44 1895 833373</p>
                        </div>
                      </details>

                      <details className="accordion-item">
                        <summary className="accordion-item__title">
                          <span className="accordion-item__title-text">Training Enquiries</span>
                        </summary>
                        <div className="accordion-item__description">
                          <p>Email: training@hqaviation.com</p>
                          <p>Phone: +44 1895 833373</p>
                        </div>
                      </details>

                      <details className="accordion-item">
                        <summary className="accordion-item__title">
                          <span className="accordion-item__title-text">Maintenance Enquiries</span>
                        </summary>
                        <div className="accordion-item__description">
                          <p>Email: maintenance@hqaviation.com</p>
                          <p>Phone: +44 1895 833373</p>
                        </div>
                      </details>
                    </div>
                  </div>
                </div>
              </div>

              {/* Address Column */}
              <div className="col sqs-col-4 span-4">
                <div className="sqs-block html-block sqs-block-html reveal-element">
                  <div className="sqs-block-content">
                    <div className="sqs-html-content">
                      <p><strong>HQ Aviation Ltd</strong></p>
                      <p>Denham Aerodrome</p>
                      <p>Tilehouse Lane</p>
                      <p>Denham, Buckinghamshire</p>
                      <p>UB9 5DF</p>
                      <p>United Kingdom</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="sqs-block horizontalrule-block sqs-block-horizontalrule reveal-element">
              <div className="sqs-block-content"><hr /></div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

export default Home;

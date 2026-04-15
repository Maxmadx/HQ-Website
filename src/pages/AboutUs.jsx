import { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { useInView } from 'framer-motion';
import { usePageImages } from '../hooks/usePageImages';

const milestones = [
  { year: '1990', title: 'HQ Aviation Founded', desc: 'Captain Quentin Smith establishes HQ Aviation at Denham Aerodrome, beginning a legacy in Robinson helicopter training, sales, and maintenance.' },
  { year: '1994', title: 'World Champion', desc: 'At just 32 years old, Q wins the Freestyle Aerobatics gold medal at the World Helicopter Championships in Moscow — the first British pilot to do so — flying a humble Robinson R22 against Russian turbine helicopters on their home turf.' },
  { year: '1997', title: 'Around the World', desc: 'Q and Jennifer Murray complete the first piston-powered helicopter circumnavigation of the globe. 97 days, 28 countries, 30,000 miles. Their R44, G-MURY, now sits in the Smithsonian.' },
  { year: '2002', title: 'North Pole', desc: 'Q and Steve Brooks become the first to land a piston-powered helicopter at the North Pole, flying Robinson R44 G-NUDE into one of the most hostile environments on earth.' },
  { year: '2005', title: 'South Pole', desc: 'First helicopter crew to reach both the North and South Poles. Minus 26 degrees, 14,000 feet density altitude. A Guinness World Record and a feat of endurance, planning, and courage.' },
  { year: '2012', title: 'World Champion Again', desc: 'Q wins his second Freestyle Aerobatics World Championship, performing a backwards autorotation — an engine-off backward landing from 300 feet — a manoeuvre experts previously deemed impossible.' },
  { year: '2018', title: 'Tom Cruise', desc: 'Q trains Tom Cruise to fly a helicopter for Mission: Impossible — Fallout, compressing 2,000 hours of experience into three months of intensive training.' },
  { year: 'Today', title: '35+ Years of Excellence', desc: 'Over 500 graduates, a fleet of Robinson aircraft, a world-class Part 145 maintenance facility, Robinson Authorized Dealer, and expeditions that continue to push boundaries.' },
];

function AboutUs() {
  const pageImages = usePageImages('about');
  const [activeMs, setActiveMs] = useState(0);
  const timelineRef = useRef(null);
  const timelineInView = useInView(timelineRef, { once: true, amount: 0.15 });
  const storyRef = useRef(null);
  const storyInView = useInView(storyRef, { once: true, amount: 0.2 });
  const captainRef = useRef(null);
  const captainInView = useInView(captainRef, { once: true, amount: 0.2 });
  const servicesRef = useRef(null);
  const servicesInView = useInView(servicesRef, { once: true, amount: 0.15 });
  const statsRef = useRef(null);
  const statsInView = useInView(statsRef, { once: true, amount: 0.3 });
  const clubhouseRef = useRef(null);
  const clubhouseInView = useInView(clubhouseRef, { once: true, amount: 0.15 });
  const robinsonRef = useRef(null);
  const robinsonInView = useInView(robinsonRef, { once: true, amount: 0.2 });
  const locationRef = useRef(null);
  const locationInView = useInView(locationRef, { once: true, amount: 0.2 });
  const safetyRef = useRef(null);
  const safetyInView = useInView(safetyRef, { once: true, amount: 0.15 });
  const fleetRef = useRef(null);
  const fleetInView = useInView(fleetRef, { once: true, amount: 0.15 });
  const explorerRef = useRef(null);
  const explorerInView = useInView(explorerRef, { once: true, amount: 0.15 });
  const opsRef = useRef(null);
  const opsInView = useInView(opsRef, { once: true, amount: 0.15 });
  const [activeFleet, setActiveFleet] = useState(0);

  useEffect(() => {
    if (!timelineInView) return;
    const interval = setInterval(() => {
      setActiveMs(prev => (prev < milestones.length - 1 ? prev + 1 : prev));
    }, 500);
    return () => clearInterval(interval);
  }, [timelineInView]);

  return (
    <div className="au">

      {/* ===== HERO ===== */}
      <section className="au__hero">
        <div className="au__hero-bg">
          <img src="/assets/images/facility/busy-hangar.jpg" alt="" />
          <div className="au__hero-overlay" />
        </div>
        <div className="au__hero-content">
          <span className="au__hero-pre">About HQ Aviation</span>
          <h1 className="au__hero-title">
            <span>The Robinson</span>
            <span>Specialists</span>
            <span>Since 1990</span>
          </h1>
          <div className="au__hero-meta">
            <span>Denham Aerodrome, UK</span>
            <span className="au__hero-divider" />
            <span className="au__hero-coords">51.5751°N / 0.5059°W</span>
          </div>
        </div>
        <div className="au__hero-scroll">
          <span>Scroll</span>
          <div className="au__hero-scroll-line"><span /></div>
        </div>
      </section>

      {/* ===== STATS ===== */}
      <section className="au__stats" ref={statsRef}>
        {[
          { value: '35+', label: 'Years' },
          { value: '500+', label: 'Pilots Trained' },
          { value: '30,000+', label: 'Flight Hours' },
          { value: '7', label: 'Continents' },
        ].map((s, i) => (
          <div key={i} className={`au__stat ${statsInView ? 'au__stat--visible' : ''}`} style={{ transitionDelay: `${i * 0.1}s` }}>
            <span className="au__stat-value">{s.value}</span>
            <span className="au__stat-label">{s.label}</span>
          </div>
        ))}
      </section>


      {/* ===== OUR STORY — Clubhouse-style sticky/scroll ===== */}
      <section className="au__story" ref={storyRef}>
        <div className="au__story-inner">
          <div className="au__story-sticky">
            <span className="au__pretitle">Our Story</span>
            <h2 className="au__story-title">Built On Passion For Flight</h2>
            <p className="au__story-desc">
              HQ Aviation was founded in 1990 by Captain Quentin Smith at Denham Aerodrome, just outside
              London. What started as one pilot's vision to create a world-class helicopter centre has
              grown into the UK's leading Robinson helicopter specialists.
            </p>
            <p className="au__story-desc">
              For over three decades, we've trained hundreds of pilots, sold and maintained Robinson
              helicopters across the fleet — R22, R44, and R66 — and led expeditions to some of the
              most remote places on earth.
            </p>
            <p className="au__story-desc">
              Today, HQ Aviation is a Robinson Authorized Dealer and Service Centre, a CAA Approved
              Training Organisation, and home to a community of pilots, engineers, and adventurers
              who share one thing — a love of flying.
            </p>
            <span className="au__story-tagline">Training. Sales. Maintenance. Expeditions.</span>
          </div>
          <div className="au__story-bg" />
          <div className="au__story-bg-border" />
          <div className="au__story-gallery">
            <div className="au__story-img au__story-img--wide">
              <img src="/assets/images/facility/hq-aviation-helicopter-hangar.webp" alt="HQ Aviation Hangar" loading="lazy" />
            </div>
            <div className="au__story-img">
              <img src="/assets/images/facility/hq-0345.jpg" alt="The clubhouse" loading="lazy" />
            </div>
            <div className="au__story-img">
              <img src="/assets/images/facility/hq-0053.jpg" alt="Aviation memorabilia" loading="lazy" />
            </div>
            <div className="au__story-img au__story-img--tall">
              <img src="/assets/images/facility/hq-0391.jpg" alt="Expedition photos" loading="lazy" />
            </div>
            <div className="au__story-img">
              <img src="/assets/images/facility/hq-0354.jpg" alt="Globe on desk" loading="lazy" />
            </div>
            <div className="au__story-img au__story-img--wide">
              <img src="/assets/images/facility/hq-0300.jpg" alt="R66 cockpit" loading="lazy" />
            </div>
          </div>
        </div>
      </section>


      {/* ===== CAPTAIN Q — Parallax image break ===== */}
      <section className="au__parallax">
        <div className="au__parallax-img">
          <img src="/assets/images/expeditions/south-pole-by-helicopter-quentin-smith.webp" alt="Captain Q — South Pole expedition" />
        </div>
        <h2 className="au__parallax-title">Captain Q</h2>
      </section>

      {/* ===== CAPTAIN Q — Content ===== */}
      <section className="au__captain" ref={captainRef}>
        <div className="au__captain-inner">
          <div className={`au__captain-image ${captainInView ? 'au__captain-image--visible' : ''}`}>
            <img src={pageImages['about-founder']?.[0]?.url ?? '/assets/images/team/world-helicopter-champion-quentin-smith.webp'} alt="Captain Quentin Smith" />
          </div>
          <div className={`au__captain-content ${captainInView ? 'au__captain-content--visible' : ''}`}>
            <span className="au__pretitle">The Founder</span>
            <h2 className="au__captain-title">Captain Quentin Smith</h2>
            <div className="au__captain-text">
              <p>
                Two-time Helicopter Aerobatics World Champion. Guinness World Record holder.
                The first person to fly a helicopter to both the North and South Poles.
                The man Paramount Pictures chose to train Tom Cruise for Mission: Impossible.
                Over 12,000 hours as pilot-in-command across every continent on earth.
              </p>
              <p>
                Q isn't just a pilot — he's a pioneer. His expeditions have rewritten the record
                books. His survival of the Drake Passage crash validates every emergency procedure
                he teaches. His championship victories in underpowered Robinson helicopters
                demonstrate a mastery of the aircraft that no competitor can match. That same
                spirit of adventure, precision, and ambition runs through everything at HQ Aviation.
              </p>
            </div>
            <div className="au__accolades">
              {[
                '2x World Champion',
                'First to Both Poles',
                'Trained Tom Cruise',
                '12,000+ Hours PIC',
              ].map((a, i) => (
                <span key={i} className="au__accolade">{a}</span>
              ))}
            </div>
            <Link to="/about-us/captain-q" className="au__link">
              Explore Captain Q's Story
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
            </Link>
          </div>
        </div>
      </section>


      {/* ===== THE CLUBHOUSE — Parallax Break ===== */}
      <section className="au__parallax au__parallax--club">
        <div className="au__parallax-img">
          <img src="/assets/images/facility/hq-0345.jpg" alt="The HQ Aviation Clubhouse" />
        </div>
        <h2 className="au__parallax-title">The Clubhouse</h2>
      </section>

      {/* ===== THE CLUBHOUSE — Content ===== */}
      <section className="au__clubhouse" ref={clubhouseRef}>
        <div className="au__clubhouse-inner">
          <div className={`au__clubhouse-content ${clubhouseInView ? 'au__clubhouse-content--visible' : ''}`}>
            <span className="au__pretitle">The HQ Vibe</span>
            <h2 className="au__clubhouse-title">Not a Flight School.<br />A Clubhouse.</h2>
            <p className="au__clubhouse-desc">
              Aviation for private fliers shouldn't be clinical. At HQ, we believe in "hangar talk" —
              the conversations between flights, the stories shared over coffee, the knowledge passed
              from experienced pilots to new students. That informal exchange is where real learning happens.
            </p>
            <p className="au__clubhouse-desc">
              Our students don't just train here — they belong here. Former students who are now
              self-fly hiring interact with new students, creating a support network built around a
              shared passion. Car races, go-karting, clay pigeon shooting — we do things together
              beyond the airfield.
            </p>
            <p className="au__clubhouse-desc">
              With engineering on the ground floor and operations on site seven days a week, pilots
              can watch their aircraft being rebuilt, ask questions, and see past the panels into
              the machine they fly. That kind of transparency builds a deeper understanding of aviation
              that no textbook can provide.
            </p>
            <div className="au__clubhouse-features">
              {[
                { label: 'Hangar Talk', detail: 'The informal exchange of knowledge between flights' },
                { label: 'Social Events', detail: 'Car races, go-karting, clay pigeon shooting' },
                { label: 'Pilot Network', detail: 'Former students mentor new ones through the journey' },
                { label: '7 Days a Week', detail: 'Operations team on site every day of the week' },
              ].map((f, i) => (
                <div key={i} className="au__clubhouse-feature">
                  <span className="au__clubhouse-feature-num">{String(i + 1).padStart(2, '0')}</span>
                  <h4>{f.label}</h4>
                  <p>{f.detail}</p>
                </div>
              ))}
            </div>
          </div>
          <div className={`au__clubhouse-gallery ${clubhouseInView ? 'au__clubhouse-gallery--visible' : ''}`}>
            <div className="au__clubhouse-img au__clubhouse-img--main">
              <img src="/assets/images/facility/hq-0391.jpg" alt="HQ Aviation interior" loading="lazy" />
            </div>
            <div className="au__clubhouse-img">
              <img src="/assets/images/gallery/events/img_2131.jpg" alt="HQ social events" loading="lazy" />
            </div>
            <div className="au__clubhouse-img">
              <img src="/assets/images/gallery/events/img_1358-copy-281-29.jpg" alt="Community gathering" loading="lazy" />
            </div>
            <div className="au__clubhouse-img au__clubhouse-img--wide">
              <img src="/assets/images/facility/hq-0300.jpg" alt="R66 cockpit detail" loading="lazy" />
            </div>
          </div>
        </div>
      </section>


      {/* ===== LOCATION ===== */}
      <section className="au__location" ref={locationRef}>
        <div className={`au__location-inner ${locationInView ? 'au__location-inner--visible' : ''}`}>
          <div className="au__location-text">
            <span className="au__pretitle">Denham Aerodrome</span>
            <h2 className="au__location-title">Escape to the Country</h2>
            <p className="au__location-desc">
              Located just inside the M25 on the Buckinghamshire / Greater London border,
              Denham is uniquely positioned — close enough to the city to be practical,
              far enough to feel like a different world. Rolling countryside, open skies,
              and one of England's most charming aerodromes.
            </p>
          </div>
          <div className="au__location-stats">
            {[
              { value: '25 min', label: 'From Central London' },
              { value: 'M25', label: 'Just Inside the Orbital' },
              { value: '1934', label: 'Aerodrome Established' },
            ].map((s, i) => (
              <div key={i} className="au__location-stat">
                <span className="au__location-stat-value">{s.value}</span>
                <span className="au__location-stat-label">{s.label}</span>
              </div>
            ))}
          </div>
        </div>
      </section>


      {/* ===== SAFETY & PHILOSOPHY ===== */}
      <section className="au__safety" ref={safetyRef}>
        <div className="au__safety-inner">
          <div className={`au__safety-left ${safetyInView ? 'au__safety-left--visible' : ''}`}>
            <span className="au__pretitle">Our Philosophy</span>
            <h2 className="au__safety-title">We Don't Teach You<br />to Pass a Test</h2>
            <p className="au__safety-desc">
              We teach you to survive one. When Q Smith teaches a student about ditching procedures
              or survival equipment, it is not theoretical — it is empirical knowledge derived from
              surviving the Drake Passage. That authenticity is something no competitor can manufacture.
            </p>
            <p className="au__safety-desc">
              Flight training is often a commodity — a race to the bottom on price. HQ Aviation is
              different. Students come here not just for flight hours, but for entry into an exclusive
              explorer's club, mentored by a World Champion with real-world survival experience.
            </p>
          </div>
          <div className={`au__safety-right ${safetyInView ? 'au__safety-right--visible' : ''}`}>
            <div className="au__safety-pillars">
              {[
                { num: '01', title: 'Competence First', desc: 'Every procedure taught has been validated in extreme real-world conditions — not just in a textbook.' },
                { num: '02', title: 'World Champion Led', desc: 'The presence of a World Champion at the helm acts as a supreme trust signal for every student.' },
                { num: '03', title: 'End-to-End Support', desc: 'Engineering, operations, and instructors under one roof — flights supported from mechanics to logistics.' },
              ].map((p, i) => (
                <div key={i} className="au__safety-pillar">
                  <span className="au__safety-pillar-num">{p.num}</span>
                  <h4>{p.title}</h4>
                  <p>{p.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>


      {/* ===== TIMELINE ===== */}
      <section className="au__timeline" ref={timelineRef}>
        <div className="au__timeline-inner">
          <div className="au__section-header">
            <span className="au__pretitle">Our Journey</span>
            <h2 className="au__section-title">
              <span>35 Years</span> <span>Of</span> <span>Aviation</span>
            </h2>
          </div>
          <div className="au__timeline-track">
            <div className="au__timeline-line">
              <div className="au__timeline-progress" style={{ height: timelineInView ? `${((activeMs) / (milestones.length - 1)) * 100}%` : '0%' }} />
            </div>
            {milestones.map((ms, i) => (
              <div key={i} className={`au__ms ${i <= activeMs && timelineInView ? 'au__ms--active' : ''}`} style={{ transitionDelay: `${i * 0.08}s` }}>
                <div className="au__ms-dot" />
                <span className="au__ms-year">{ms.year}</span>
                <h3 className="au__ms-title">{ms.title}</h3>
                <p className="au__ms-desc">{ms.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>


      {/* ===== WHAT WE DO ===== */}
      <section className="au__services" ref={servicesRef}>
        <div className="au__services-inner">
          <div className="au__section-header">
            <span className="au__pretitle">What We Do</span>
            <h2 className="au__section-title">
              <span>Training</span> <span>Sales</span> <span>Maintenance</span>
            </h2>
          </div>
          <div className="au__services-grid">
            {[
              { title: 'Flight Training', desc: 'PPL(H), CPL(H), type ratings, night ratings, and instructor ratings. From first flight to career pilot.', link: '/training', cta: 'Explore Training', img: '/assets/images/facility/hq-0053.jpg' },
              { title: 'Aircraft Sales', desc: 'New and pre-owned Robinson helicopters. As an Authorized Dealer, we offer factory-direct R22, R44, and R66 aircraft.', link: '/aircraft-sales', cta: 'View Aircraft', img: '/assets/images/facility/main-sales-pic.jpg' },
              { title: 'Maintenance', desc: 'Robinson Authorized Service Centre. Full overhauls, 100-hour inspections, avionics upgrades, and bespoke rebuilds.', link: '/services/maintenance', cta: 'View Services', img: '/assets/images/facility/g-ccfc-hq-robinson-overhaul.webp' },
              { title: 'Expeditions', desc: 'Helicopter expeditions to the most extraordinary places on earth. Led by Captain Q, from the poles to the peaks.', link: '/expeditions', cta: 'View Expeditions', img: '/assets/images/expeditions/helicopter-expeditions-quentin-smith.webp' },
            ].map((svc, i) => (
              <div key={i} className={`au__svc ${servicesInView ? 'au__svc--visible' : ''}`} style={{ transitionDelay: `${i * 0.1}s` }}>
                <div className="au__svc-img">
                  <img src={svc.img} alt={svc.title} loading="lazy" />
                </div>
                <div className="au__svc-body">
                  <span className="au__svc-num">{String(i + 1).padStart(2, '0')}</span>
                  <h3>{svc.title}</h3>
                  <p>{svc.desc}</p>
                  <Link to={svc.link} className="au__link">
                    {svc.cta}
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>


      {/* ===== FLEET OVERVIEW ===== */}
      <section className="au__fleet" ref={fleetRef}>
        <div className="au__fleet-inner">
          <div className="au__section-header">
            <span className="au__pretitle">The Fleet</span>
            <h2 className="au__section-title">
              <span>Robinson</span> <span>Helicopter</span> <span>Specialists</span>
            </h2>
          </div>
          <div className="au__fleet-tabs">
            {['R22', 'R44', 'R66'].map((tab, i) => (
              <button
                key={i}
                className={`au__fleet-tab ${activeFleet === i ? 'au__fleet-tab--active' : ''}`}
                onClick={() => setActiveFleet(i)}
              >
                {tab}
              </button>
            ))}
          </div>
          <div className={`au__fleet-card ${fleetInView ? 'au__fleet-card--visible' : ''}`}>
            {[
              {
                model: 'Robinson R22',
                tagline: 'If you can fly an R22, you can fly anything.',
                desc: 'The two-seat, piston-engine helicopter that started it all. Powered by a Lycoming O-360-J2A, its design prioritises lightness and simplicity. The standard entry point for civilian helicopter pilots — and the aircraft Q flew to win the World Championship.',
                specs: [
                  { label: 'Seats', value: '2' },
                  { label: 'Engine', value: 'Piston' },
                  { label: 'Range', value: '185 nm' },
                  { label: 'Cruise', value: '96 kts' },
                ],
                img: '/assets/images/fleet/r22-g-ulze.png',
                fallbackImg: '/assets/images/gallery/carousel/rotating1.jpg',
              },
              {
                model: 'Robinson R44',
                tagline: 'The world\'s best-selling helicopter.',
                desc: 'A four-seat, piston-powered helicopter with the iconic teardrop fuselage. From training to touring, the R44 is the most versatile piston helicopter ever built. G-MURY, the R44 that circumnavigated the globe, now sits in the Smithsonian.',
                specs: [
                  { label: 'Seats', value: '4' },
                  { label: 'Engine', value: 'Piston' },
                  { label: 'Range', value: '300 nm' },
                  { label: 'Cruise', value: '110 kts' },
                ],
                img: '/assets/images/fleet/r44-g-mxpi.png',
                fallbackImg: '/assets/images/gallery/carousel/rotating2.jpg',
              },
              {
                model: 'Robinson R66',
                tagline: 'Designed for the owner-operator lifestyle.',
                desc: 'A five-seat turbine helicopter powered by the Rolls-Royce RR300, derated to 270 shp for exceptional reliability and lower fuel burn. The R66 retains the R44\'s proven teardrop fuselage with the performance and altitude capability of a turbine.',
                specs: [
                  { label: 'Seats', value: '5' },
                  { label: 'Engine', value: 'Turbine' },
                  { label: 'Range', value: '350 nm' },
                  { label: 'Cruise', value: '118 kts' },
                ],
                img: '/assets/images/fleet/r66-g-tlmi.png',
                fallbackImg: '/assets/images/gallery/carousel/rotating6.jpg',
              },
            ][activeFleet] && (() => {
              const a = [{
                model: 'Robinson R22',
                tagline: 'If you can fly an R22, you can fly anything.',
                desc: 'The two-seat, piston-engine helicopter that started it all. Powered by a Lycoming O-360-J2A, its design prioritises lightness and simplicity. The standard entry point for civilian helicopter pilots — and the aircraft Q flew to win the World Championship.',
                specs: [
                  { label: 'Seats', value: '2' },
                  { label: 'Engine', value: 'Piston' },
                  { label: 'Range', value: '185 nm' },
                  { label: 'Cruise', value: '96 kts' },
                ],
                img: '/assets/images/gallery/carousel/rotating1.jpg',
              },
              {
                model: 'Robinson R44',
                tagline: 'The world\'s best-selling helicopter.',
                desc: 'A four-seat, piston-powered helicopter with the iconic teardrop fuselage. From training to touring, the R44 is the most versatile piston helicopter ever built. G-MURY, the R44 that circumnavigated the globe, now sits in the Smithsonian.',
                specs: [
                  { label: 'Seats', value: '4' },
                  { label: 'Engine', value: 'Piston' },
                  { label: 'Range', value: '300 nm' },
                  { label: 'Cruise', value: '110 kts' },
                ],
                img: '/assets/images/gallery/carousel/rotating2.jpg',
              },
              {
                model: 'Robinson R66',
                tagline: 'Designed for the owner-operator lifestyle.',
                desc: 'A five-seat turbine helicopter powered by the Rolls-Royce RR300, derated to 270 shp for exceptional reliability and lower fuel burn. The R66 retains the R44\'s proven teardrop fuselage with the performance and altitude capability of a turbine.',
                specs: [
                  { label: 'Seats', value: '5' },
                  { label: 'Engine', value: 'Turbine' },
                  { label: 'Range', value: '350 nm' },
                  { label: 'Cruise', value: '118 kts' },
                ],
                img: '/assets/images/gallery/carousel/rotating6.jpg',
              }][activeFleet];
              return (
                <>
                  <div className="au__fleet-img">
                    <img src={a.img} alt={a.model} />
                  </div>
                  <div className="au__fleet-info">
                    <h3 className="au__fleet-model">{a.model}</h3>
                    <p className="au__fleet-tagline">{a.tagline}</p>
                    <p className="au__fleet-desc">{a.desc}</p>
                    <div className="au__fleet-specs">
                      {a.specs.map((s, j) => (
                        <div key={j} className="au__fleet-spec">
                          <span className="au__fleet-spec-value">{s.value}</span>
                          <span className="au__fleet-spec-label">{s.label}</span>
                        </div>
                      ))}
                    </div>
                    <Link to="/sales/new" className="au__link">
                      View Aircraft
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
                    </Link>
                  </div>
                </>
              );
            })()}
          </div>
        </div>
      </section>


      {/* ===== EXPLORER'S CLUB — Parallax ===== */}
      <section className="au__parallax">
        <div className="au__parallax-img">
          <img src="/assets/images/expeditions/antartica.jpg" alt="Helicopter expedition to Antarctica" />
        </div>
        <h2 className="au__parallax-title">The Explorer's Club</h2>
      </section>

      {/* ===== EXPLORER'S CLUB — Content ===== */}
      <section className="au__explorer" ref={explorerRef}>
        <div className={`au__explorer-inner ${explorerInView ? 'au__explorer-inner--visible' : ''}`}>
          <div className="au__explorer-content">
            <span className="au__pretitle">Beyond the Licence</span>
            <h2 className="au__explorer-title">Don't Just Be a Passenger.<br />Be a Pilot in Command.</h2>
            <p className="au__explorer-desc">
              At HQ Aviation, the client is not a passenger — they are an active part of the flight.
              We specialise in pilot-led expeditions: high-end, experience-driven aviation tourism
              for licensed pilots and aspiring aviators who seek to command their own aircraft across
              international borders, hostile terrains, and historically significant routes.
            </p>
            <p className="au__explorer-desc">
              In joining HQ, you join a select group of highly motivated, passionate adventure seekers.
              From the frozen ice of the Bering Strait to the jungles of Vietnam, HQ members have
              circumnavigated the globe and landed on ice caps. We handle the logistics so you can
              focus on the flying.
            </p>
            <div className="au__explorer-trips">
              {[
                { destination: 'North Pole', type: 'Ice Cap Landing' },
                { destination: 'South Pole', type: 'Antarctic Expedition' },
                { destination: 'Bering Strait', type: 'Ice Challenger Support' },
                { destination: 'Around the World', type: 'Circumnavigation' },
              ].map((t, i) => (
                <div key={i} className="au__explorer-trip">
                  <span className="au__explorer-trip-dest">{t.destination}</span>
                  <span className="au__explorer-trip-type">{t.type}</span>
                </div>
              ))}
            </div>
            <Link to="/expeditions" className="au__link">
              Explore Expeditions
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
            </Link>
          </div>
          <div className="au__explorer-image">
            <img src="/assets/images/expeditions/six-helis-in-North-Pole.jpg" alt="Fleet of helicopters at the North Pole" loading="lazy" />
          </div>
        </div>
      </section>


      {/* ===== OPERATIONS SUPPORT ===== */}
      <section className="au__ops" ref={opsRef}>
        <div className="au__ops-inner">
          <div className="au__section-header">
            <span className="au__pretitle">White-Glove Service</span>
            <h2 className="au__section-title">
              <span>You Fly.</span> <span>We Handle</span> <span>Everything Else.</span>
            </h2>
          </div>
          <div className={`au__ops-grid ${opsInView ? 'au__ops-grid--visible' : ''}`}>
            {[
              {
                icon: (
                  <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#1a1a1a" strokeWidth="1.5">
                    <path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z"/><polyline points="9,22 9,12 15,12 15,22"/>
                  </svg>
                ),
                title: 'Hangar Movements',
                desc: 'Your helicopter is towed from the hangar to the flight line before your arrival and returned to secure storage after your flight.',
              },
              {
                icon: (
                  <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#1a1a1a" strokeWidth="1.5">
                    <path d="M12 2v6m0 8v6M4.93 4.93l4.24 4.24m5.66 5.66l4.24 4.24M2 12h6m8 0h6M4.93 19.07l4.24-4.24m5.66-5.66l4.24-4.24"/>
                  </svg>
                ),
                title: 'Refuelling',
                desc: 'Aircraft fuelled to your required levels before you arrive. No waiting for a bowser or self-fuelling.',
              },
              {
                icon: (
                  <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#1a1a1a" strokeWidth="1.5">
                    <path d="M12 3v18M3 12h18M8 8l8 8M16 8l-8 8"/>
                  </svg>
                ),
                title: 'Valeting',
                desc: 'Exterior washing and interior cabin cleaning. Your helicopter maintained in immaculate cosmetic condition.',
              },
              {
                icon: (
                  <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#1a1a1a" strokeWidth="1.5">
                    <circle cx="12" cy="12" r="10"/><polyline points="12,6 12,12 16,14"/>
                  </svg>
                ),
                title: '7-Day Operations',
                desc: 'Our team is on site every day of the week. Walk in, walk out — your aircraft is always ready.',
              },
            ].map((op, i) => (
              <div key={i} className="au__ops-card" style={{ transitionDelay: `${i * 0.1}s` }}>
                <div className="au__ops-icon">{op.icon}</div>
                <h3>{op.title}</h3>
                <p>{op.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>


      {/* ===== CERTIFICATIONS TRUST BAR ===== */}
      <section className="au__certs">
        <div className="au__certs-inner">
          <span className="au__pretitle" style={{ textAlign: 'center' }}>Accreditations & Memberships</span>
          <div className="au__certs-logos">
            {[
              { src: '/assets/images/logos/certifications/caa.jpg', alt: 'Civil Aviation Authority' },
              { src: '/assets/images/logos/certifications/easa1.png', alt: 'EASA' },
              { src: '/assets/images/logos/certifications/faa-logo.jpg', alt: 'Federal Aviation Administration' },
              { src: '/assets/images/logos/certifications/rhc.png', alt: 'Robinson Helicopter Company' },
              { src: '/assets/images/logos/certifications/hcgb-logo.png', alt: 'Helicopter Club of Great Britain' },
              { src: '/assets/images/logos/certifications/fai-logo.png', alt: 'Fédération Aéronautique Internationale' },
            ].map((logo, i) => (
              <div key={i} className="au__certs-logo">
                <img src={logo.src} alt={logo.alt} loading="lazy" />
              </div>
            ))}
          </div>
        </div>
      </section>


      {/* ===== ROBINSON AUTHORIZED ===== */}
      <section className="au__robinson" ref={robinsonRef}>
        <div className={`au__robinson-inner ${robinsonInView ? 'au__robinson-inner--visible' : ''}`}>
          <div className="au__robinson-badge">
            <img src="/assets/images/logos/certifications/robinson.jpg" alt="Robinson Helicopter Company" />
          </div>
          <div className="au__robinson-content">
            <span className="au__pretitle">Official Partnership</span>
            <h2 className="au__robinson-title">Robinson Authorized Dealer & Service Centre</h2>
            <p className="au__robinson-desc">
              HQ Aviation is one of a select number of Robinson Authorized Dealers worldwide.
              We sell factory-new R22, R44, and R66 helicopters direct from Robinson Helicopter
              Company in Torrance, California. Our Part 145 approved maintenance facility is
              equally authorized as a Robinson Service Centre — qualified to perform full
              overhauls, 100-hour inspections, and factory-standard rebuilds.
            </p>
            <div className="au__robinson-certs">
              {[
                'Authorized Dealer',
                'Authorized Service Centre',
                'Part 145 Approved',
                'CAA Approved ATO',
              ].map((c, i) => (
                <span key={i} className="au__robinson-cert">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#1a1a1a" strokeWidth="2"><path d="M20 6L9 17l-5-5"/></svg>
                  {c}
                </span>
              ))}
            </div>
          </div>
        </div>
      </section>


      {/* ===== CTA ===== */}
      <section className="au__cta">
        <div className="au__cta-bg">
          <img src="/assets/images/facility/hq-0089.jpg" alt="" />
          <div className="au__cta-overlay" />
        </div>
        <div className="au__cta-content">
          <span className="au__pretitle au__pretitle--light">You Are Invited</span>
          <h2 className="au__cta-title">Come and See Us</h2>
          <p className="au__cta-desc">
            Visit HQ Aviation at Denham Aerodrome. Whether you're interested in training,
            purchasing an aircraft, or simply want to experience the world of helicopter
            aviation — our doors are always open.
          </p>
          <div className="au__cta-actions">
            <Link to="/about-us/team" className="au__btn">Meet the Team</Link>
            <Link to="/contact" className="au__btn au__btn--ghost">Get in Touch</Link>
          </div>
        </div>
      </section>


      <style>{`
        /* ===== ROOT ===== */
        .au {
          font-family: 'Space Grotesk', -apple-system, sans-serif;
          color: #1a1a1a;
          background: #faf9f6;
        }

        /* ===== SHARED ===== */
        .au__pretitle {
          font-family: 'Share Tech Mono', monospace;
          font-size: 0.7rem;
          letter-spacing: 0.2em;
          text-transform: uppercase;
          color: #999;
          display: block;
          margin-bottom: 0.75rem;
        }
        .au__pretitle--light { color: rgba(255,255,255,0.5); }

        .au__link {
          display: inline-flex;
          align-items: center;
          gap: 0.5rem;
          font-size: 0.75rem;
          text-transform: uppercase;
          letter-spacing: 0.1em;
          color: #1a1a1a;
          text-decoration: none;
          border-bottom: 1px solid #ccc;
          padding-bottom: 0.25rem;
          transition: border-color 0.3s ease;
        }
        .au__link:hover { border-color: #1a1a1a; }

        .au__section-header {
          text-align: center;
          margin-bottom: 3rem;
        }
        .au__section-header .au__pretitle {
          margin-bottom: 1rem;
        }
        .au__section-title {
          font-family: 'Space Grotesk', sans-serif;
          font-size: clamp(2rem, 5vw, 3.5rem);
          font-weight: 700;
          line-height: 1.1;
          text-transform: uppercase;
          margin: 0;
          display: flex;
          flex-wrap: wrap;
          justify-content: center;
          gap: 0.5rem;
        }
        .au__section-title span:nth-child(1) { color: #1a1a1a; }
        .au__section-title span:nth-child(2) { color: #4a4a4a; }
        .au__section-title span:nth-child(3) { color: #7a7a7a; }


        /* ===== HERO ===== */
        .au__hero {
          position: relative;
          height: 100vh;
          min-height: 600px;
          display: flex;
          align-items: center;
          justify-content: center;
          overflow: hidden;
        }
        .au__hero-bg {
          position: absolute;
          inset: 0;
        }
        .au__hero-bg img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }
        .au__hero-overlay {
          position: absolute;
          inset: 0;
          background: linear-gradient(to bottom, rgba(0,0,0,0.25) 0%, rgba(0,0,0,0.55) 100%);
        }
        .au__hero-content {
          position: relative;
          z-index: 2;
          text-align: center;
          color: #fff;
          padding: 2rem;
        }
        .au__hero-pre {
          font-size: 0.7rem;
          text-transform: uppercase;
          letter-spacing: 0.2em;
          color: rgba(255,255,255,0.6);
          display: block;
          margin-bottom: 2rem;
        }
        .au__hero-title {
          font-size: clamp(2.5rem, 6vw, 4.5rem);
          font-weight: 700;
          line-height: 1;
          text-transform: uppercase;
          letter-spacing: -0.02em;
          margin: 0 0 2rem;
          display: flex;
          flex-direction: column;
          gap: 0.25rem;
        }
        .au__hero-title span:nth-child(1) { color: #ffffff; }
        .au__hero-title span:nth-child(2) { color: rgba(255,255,255,0.75); }
        .au__hero-title span:nth-child(3) { color: rgba(255,255,255,0.5); }
        .au__hero-meta {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 1.5rem;
          font-size: 0.8rem;
          color: rgba(255,255,255,0.5);
        }
        .au__hero-divider {
          width: 1px;
          height: 14px;
          background: rgba(255,255,255,0.2);
        }
        .au__hero-coords {
          font-family: 'Share Tech Mono', monospace;
          font-size: 0.65rem;
          letter-spacing: 0.1em;
        }
        .au__hero-scroll {
          position: absolute;
          bottom: 1.5rem;
          left: 50%;
          transform: translateX(-50%);
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 0.75rem;
          z-index: 2;
        }
        .au__hero-scroll > span {
          font-size: 0.65rem;
          text-transform: uppercase;
          letter-spacing: 0.2em;
          color: rgba(255,255,255,0.4);
        }
        .au__hero-scroll-line {
          width: 1px;
          height: 50px;
          background: rgba(255,255,255,0.15);
          position: relative;
          overflow: hidden;
        }
        .au__hero-scroll-line span {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 30%;
          background: rgba(255,255,255,0.6);
          animation: auScrollLine 2s ease-in-out infinite;
        }
        @keyframes auScrollLine {
          0% { top: -30%; }
          100% { top: 100%; }
        }


        /* ===== STATS ===== */
        .au__stats {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          border-bottom: 1px solid #e8e6e2;
          background: #fff;
        }
        .au__stat {
          text-align: center;
          padding: 3rem 1rem;
          border-right: 1px solid #e8e6e2;
          opacity: 0;
          transform: translateY(15px);
          transition: opacity 0.6s ease, transform 0.6s ease;
        }
        .au__stat:last-child { border-right: none; }
        .au__stat--visible {
          opacity: 1;
          transform: translateY(0);
        }
        .au__stat-value {
          display: block;
          font-family: 'Share Tech Mono', monospace;
          font-size: clamp(1.8rem, 3vw, 2.5rem);
          font-weight: 700;
          color: #1a1a1a;
          margin-bottom: 0.5rem;
        }
        .au__stat-label {
          font-size: 0.7rem;
          text-transform: uppercase;
          letter-spacing: 0.2em;
          color: #999;
        }


        /* ===== STORY — Clubhouse layout ===== */
        .au__story {
          padding: 8px 0 48px;
          background: #fff;
          position: relative;
        }
        .au__story-inner {
          display: grid;
          grid-template-columns: 1fr 1fr;
          align-items: start;
        }
        .au__story-sticky {
          position: sticky;
          top: 30vh;
          max-width: 480px;
          margin: 0 auto;
          padding: 48px 3rem;
        }
        .au__story-title {
          font-family: 'Space Grotesk', sans-serif;
          font-size: 2rem;
          font-weight: 600;
          color: #1a1a1a;
          margin: 0 0 1.25rem;
          letter-spacing: -0.02em;
        }
        .au__story-desc {
          font-size: 0.95rem;
          line-height: 1.75;
          color: #555;
          margin: 0 0 1.25rem;
        }
        .au__story-desc:last-of-type { margin-bottom: 1.5rem; }
        .au__story-tagline {
          font-family: 'Share Tech Mono', monospace;
          font-size: 0.72rem;
          letter-spacing: 0.15em;
          text-transform: uppercase;
          color: #999;
          border-top: 1px solid rgba(0,0,0,0.08);
          padding-top: 1rem;
          display: block;
        }

        .au__story-bg {
          grid-column: 2;
          grid-row: 1;
          background: #d6d2cc;
          border-radius: 8px 0 0 8px;
          pointer-events: none;
          align-self: stretch;
          margin: -1rem -50vw -1rem 0;
        }
        .au__story-bg-border {
          grid-column: 2;
          grid-row: 1;
          border: 1px solid rgba(0,0,0,0.12);
          border-right: none;
          border-radius: 8px 0 0 8px;
          pointer-events: none;
          align-self: stretch;
          margin: -1rem -50vw -1rem 0;
          z-index: 2;
        }
        .au__story-gallery {
          grid-column: 2;
          grid-row: 1;
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 6px;
          z-index: 1;
          padding: 1.5rem 3rem 0.75rem;
        }
        .au__story-img {
          overflow: hidden;
          border-radius: 3px;
        }
        .au__story-img--wide { grid-column: 1 / -1; }
        .au__story-img--tall { grid-row: span 2; }
        .au__story-img img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          display: block;
          aspect-ratio: 1 / 1;
          transition: transform 0.6s cubic-bezier(0.16, 1, 0.3, 1);
          filter: saturate(0.85);
        }
        .au__story-img--wide img { aspect-ratio: 16 / 9; }
        .au__story-img--tall img { aspect-ratio: auto; height: 100%; }
        .au__story-img:hover img {
          transform: scale(1.04);
          filter: saturate(1);
        }


        /* ===== PARALLAX BREAK ===== */
        .au__parallax {
          position: relative;
          height: 50vh;
          min-height: 350px;
          overflow: hidden;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .au__parallax-img {
          position: absolute;
          inset: -20% 0;
        }
        .au__parallax-img img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }
        .au__parallax-title {
          position: relative;
          z-index: 2;
          font-family: 'Space Grotesk', sans-serif;
          font-size: clamp(3rem, 8vw, 7rem);
          font-weight: 700;
          text-transform: uppercase;
          color: #fff;
          text-shadow: 0 4px 40px rgba(0,0,0,0.5);
          margin: 0;
          letter-spacing: -0.02em;
        }


        /* ===== CAPTAIN Q ===== */
        .au__captain {
          padding: 6rem 2rem;
          background: #faf9f6;
        }
        .au__captain-inner {
          max-width: 1100px;
          margin: 0 auto;
          display: grid;
          grid-template-columns: 0.9fr 1.1fr;
          gap: 4rem;
          align-items: start;
        }
        .au__captain-image {
          opacity: 0;
          transform: translateY(30px);
          transition: opacity 0.8s ease, transform 0.8s cubic-bezier(0.16, 1, 0.3, 1);
        }
        .au__captain-image--visible {
          opacity: 1;
          transform: translateY(0);
        }
        .au__captain-image img {
          width: 100%;
          aspect-ratio: 3/4;
          object-fit: cover;
        }
        .au__captain-content {
          padding-top: 2rem;
          opacity: 0;
          transform: translateY(30px);
          transition: opacity 0.8s ease 0.15s, transform 0.8s cubic-bezier(0.16, 1, 0.3, 1) 0.15s;
        }
        .au__captain-content--visible {
          opacity: 1;
          transform: translateY(0);
        }
        .au__captain-title {
          font-family: 'Space Grotesk', sans-serif;
          font-size: clamp(1.8rem, 4vw, 2.8rem);
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: -0.02em;
          margin: 0 0 1.5rem;
          color: #1a1a1a;
        }
        .au__captain-text p {
          font-size: 1.05rem;
          line-height: 1.8;
          color: #666;
          margin: 0 0 1.25rem;
        }
        .au__accolades {
          display: flex;
          flex-wrap: wrap;
          gap: 0;
          margin: 2rem 0;
          border-top: 1px solid #e8e6e2;
          border-bottom: 1px solid #e8e6e2;
        }
        .au__accolade {
          flex: 1 1 50%;
          font-size: 0.75rem;
          font-weight: 500;
          text-transform: uppercase;
          letter-spacing: 0.08em;
          color: #1a1a1a;
          padding: 0.9rem 0;
          border-bottom: 1px solid #e8e6e2;
        }
        .au__accolades .au__accolade:nth-last-child(-n+2) {
          border-bottom: none;
        }
        .au__accolade:nth-child(odd) {
          border-right: 1px solid #e8e6e2;
          padding-right: 1rem;
        }
        .au__accolade:nth-child(even) {
          padding-left: 1rem;
        }


        /* ===== TIMELINE ===== */
        .au__timeline {
          padding: 6rem 2rem;
          background: #fff;
        }
        .au__timeline-inner {
          max-width: 800px;
          margin: 0 auto;
        }
        .au__timeline-track {
          position: relative;
          padding-left: 3rem;
        }
        .au__timeline-line {
          position: absolute;
          left: 6px;
          top: 0;
          bottom: 0;
          width: 1px;
          background: #e8e6e2;
        }
        .au__timeline-progress {
          width: 100%;
          background: #1a1a1a;
          transition: height 0.6s cubic-bezier(0.16, 1, 0.3, 1);
        }
        .au__ms {
          position: relative;
          padding-bottom: 2.5rem;
          opacity: 0;
          transform: translateX(-10px);
          transition: opacity 0.5s ease, transform 0.5s ease;
        }
        .au__ms--active {
          opacity: 1;
          transform: translateX(0);
        }
        .au__ms:last-child { padding-bottom: 0; }
        .au__ms-dot {
          position: absolute;
          left: -3rem;
          top: 4px;
          width: 13px;
          height: 13px;
          border-radius: 50%;
          border: 2px solid #e8e6e2;
          background: #fff;
          transition: all 0.3s ease;
        }
        .au__ms--active .au__ms-dot {
          background: #1a1a1a;
          border-color: #1a1a1a;
        }
        .au__ms-year {
          font-family: 'Share Tech Mono', monospace;
          font-size: 0.65rem;
          letter-spacing: 0.15em;
          color: #999;
          text-transform: uppercase;
          display: block;
          margin-bottom: 0.35rem;
        }
        .au__ms-title {
          font-size: 1.15rem;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 0.02em;
          margin: 0 0 0.4rem;
          color: #1a1a1a;
        }
        .au__ms-desc {
          font-size: 0.95rem;
          line-height: 1.7;
          color: #666;
          margin: 0;
          max-width: 520px;
        }


        /* ===== SERVICES ===== */
        .au__services {
          padding: 6rem 2rem;
          background: #faf9f6;
        }
        .au__services-inner {
          max-width: 1100px;
          margin: 0 auto;
        }
        .au__services-grid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 1px;
          background: #e8e6e2;
          border: 1px solid #e8e6e2;
        }
        .au__svc {
          background: #fff;
          opacity: 0;
          transform: translateY(20px);
          transition: opacity 0.6s ease, transform 0.6s ease;
        }
        .au__svc--visible {
          opacity: 1;
          transform: translateY(0);
        }
        .au__svc-img {
          height: 240px;
          overflow: hidden;
        }
        .au__svc-img img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          transition: transform 0.6s cubic-bezier(0.16, 1, 0.3, 1);
          filter: saturate(0.9);
        }
        .au__svc:hover .au__svc-img img {
          transform: scale(1.04);
          filter: saturate(1);
        }
        .au__svc-body {
          padding: 2rem;
        }
        .au__svc-num {
          font-family: 'Share Tech Mono', monospace;
          font-size: 0.65rem;
          color: #999;
          letter-spacing: 0.1em;
          display: block;
          margin-bottom: 0.75rem;
        }
        .au__svc-body h3 {
          font-size: 1.05rem;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 0.02em;
          margin: 0 0 0.75rem;
        }
        .au__svc-body p {
          font-size: 0.92rem;
          line-height: 1.7;
          color: #666;
          margin: 0 0 1.5rem;
        }


        /* ===== SAFETY & PHILOSOPHY ===== */
        .au__safety {
          padding: 6rem 2rem;
          background: #1a1a1a;
          color: #fff;
        }
        .au__safety-inner {
          max-width: 1100px;
          margin: 0 auto;
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 4rem;
          align-items: start;
        }
        .au__safety-left,
        .au__safety-right {
          opacity: 0;
          transform: translateY(30px);
          transition: opacity 0.8s ease, transform 0.8s cubic-bezier(0.16, 1, 0.3, 1);
        }
        .au__safety-left--visible { opacity: 1; transform: translateY(0); }
        .au__safety-right--visible { opacity: 1; transform: translateY(0); transition-delay: 0.15s; }
        .au__safety .au__pretitle { color: rgba(255,255,255,0.4); }
        .au__safety-title {
          font-family: 'Space Grotesk', sans-serif;
          font-size: clamp(1.8rem, 3.5vw, 2.5rem);
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: -0.02em;
          line-height: 1.15;
          margin: 0 0 1.5rem;
          color: #fff;
        }
        .au__safety-desc {
          font-size: 0.95rem;
          line-height: 1.8;
          color: rgba(255,255,255,0.6);
          margin: 0 0 1.25rem;
        }
        .au__safety-pillars {
          display: flex;
          flex-direction: column;
          gap: 0;
        }
        .au__safety-pillar {
          padding: 1.5rem 0;
          border-bottom: 1px solid rgba(255,255,255,0.1);
        }
        .au__safety-pillar:first-child {
          border-top: 1px solid rgba(255,255,255,0.1);
        }
        .au__safety-pillar-num {
          font-family: 'Share Tech Mono', monospace;
          font-size: 0.6rem;
          color: rgba(255,255,255,0.3);
          letter-spacing: 0.15em;
          display: block;
          margin-bottom: 0.5rem;
        }
        .au__safety-pillar h4 {
          font-size: 0.9rem;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 0.04em;
          margin: 0 0 0.5rem;
          color: #fff;
        }
        .au__safety-pillar p {
          font-size: 0.85rem;
          line-height: 1.65;
          color: rgba(255,255,255,0.5);
          margin: 0;
        }


        /* ===== FLEET ===== */
        .au__fleet {
          padding: 6rem 2rem;
          background: #fff;
        }
        .au__fleet-inner {
          max-width: 1000px;
          margin: 0 auto;
        }
        .au__fleet-tabs {
          display: flex;
          justify-content: center;
          gap: 0;
          margin-bottom: 3rem;
          border: 1px solid #e8e6e2;
          border-radius: 2px;
          overflow: hidden;
          max-width: 360px;
          margin-left: auto;
          margin-right: auto;
        }
        .au__fleet-tab {
          flex: 1;
          padding: 0.75rem 1.5rem;
          font-family: 'Share Tech Mono', monospace;
          font-size: 0.75rem;
          letter-spacing: 0.15em;
          text-transform: uppercase;
          background: transparent;
          border: none;
          border-right: 1px solid #e8e6e2;
          color: #999;
          cursor: pointer;
          transition: all 0.3s ease;
        }
        .au__fleet-tab:last-child { border-right: none; }
        .au__fleet-tab--active {
          background: #1a1a1a;
          color: #fff;
        }
        .au__fleet-card {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 3rem;
          align-items: center;
          opacity: 0;
          transform: translateY(20px);
          transition: opacity 0.6s ease, transform 0.6s ease;
        }
        .au__fleet-card--visible {
          opacity: 1;
          transform: translateY(0);
        }
        .au__fleet-img {
          display: flex;
          align-items: center;
          justify-content: center;
          background: #faf9f6;
          border-radius: 4px;
          padding: 2rem;
          min-height: 280px;
        }
        .au__fleet-img img {
          max-width: 100%;
          max-height: 250px;
          object-fit: contain;
        }
        .au__fleet-model {
          font-family: 'Space Grotesk', sans-serif;
          font-size: 1.6rem;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: -0.01em;
          margin: 0 0 0.35rem;
          color: #1a1a1a;
        }
        .au__fleet-tagline {
          font-family: 'Share Tech Mono', monospace;
          font-size: 0.72rem;
          letter-spacing: 0.08em;
          color: #999;
          margin: 0 0 1.25rem;
          font-style: italic;
        }
        .au__fleet-desc {
          font-size: 0.92rem;
          line-height: 1.75;
          color: #555;
          margin: 0 0 1.5rem;
        }
        .au__fleet-specs {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 0;
          border-top: 1px solid #e8e6e2;
          border-bottom: 1px solid #e8e6e2;
          margin-bottom: 1.5rem;
        }
        .au__fleet-spec {
          text-align: center;
          padding: 0.75rem 0.5rem;
          border-right: 1px solid #e8e6e2;
        }
        .au__fleet-spec:last-child { border-right: none; }
        .au__fleet-spec-value {
          display: block;
          font-family: 'Share Tech Mono', monospace;
          font-size: 1rem;
          font-weight: 700;
          color: #1a1a1a;
          margin-bottom: 0.2rem;
        }
        .au__fleet-spec-label {
          font-size: 0.6rem;
          text-transform: uppercase;
          letter-spacing: 0.15em;
          color: #999;
        }


        /* ===== EXPLORER'S CLUB ===== */
        .au__explorer {
          padding: 6rem 2rem;
          background: #faf9f6;
        }
        .au__explorer-inner {
          max-width: 1100px;
          margin: 0 auto;
          display: grid;
          grid-template-columns: 1.1fr 0.9fr;
          gap: 4rem;
          align-items: center;
          opacity: 0;
          transform: translateY(25px);
          transition: opacity 0.8s ease, transform 0.8s cubic-bezier(0.16, 1, 0.3, 1);
        }
        .au__explorer-inner--visible {
          opacity: 1;
          transform: translateY(0);
        }
        .au__explorer-title {
          font-family: 'Space Grotesk', sans-serif;
          font-size: clamp(1.6rem, 3vw, 2.2rem);
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: -0.02em;
          line-height: 1.15;
          margin: 0 0 1.5rem;
          color: #1a1a1a;
        }
        .au__explorer-desc {
          font-size: 0.95rem;
          line-height: 1.8;
          color: #555;
          margin: 0 0 1.25rem;
        }
        .au__explorer-trips {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 0;
          border-top: 1px solid #e8e6e2;
          margin: 2rem 0 1.5rem;
        }
        .au__explorer-trip {
          padding: 0.9rem 0;
          border-bottom: 1px solid #e8e6e2;
        }
        .au__explorer-trip:nth-child(even) {
          padding-left: 1rem;
          border-left: 1px solid #e8e6e2;
        }
        .au__explorer-trip-dest {
          display: block;
          font-size: 0.8rem;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 0.04em;
          color: #1a1a1a;
          margin-bottom: 0.15rem;
        }
        .au__explorer-trip-type {
          font-size: 0.7rem;
          color: #999;
          letter-spacing: 0.05em;
        }
        .au__explorer-image {
          overflow: hidden;
          border-radius: 3px;
        }
        .au__explorer-image img {
          width: 100%;
          aspect-ratio: 4/3;
          object-fit: cover;
          filter: saturate(0.85);
          transition: transform 0.6s cubic-bezier(0.16, 1, 0.3, 1);
        }
        .au__explorer-image:hover img {
          transform: scale(1.03);
          filter: saturate(1);
        }


        /* ===== OPERATIONS ===== */
        .au__ops {
          padding: 6rem 2rem;
          background: #fff;
          border-top: 1px solid #e8e6e2;
        }
        .au__ops-inner {
          max-width: 1000px;
          margin: 0 auto;
        }
        .au__ops-grid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 0;
          border: 1px solid #e8e6e2;
        }
        .au__ops-grid--visible .au__ops-card {
          opacity: 1;
          transform: translateY(0);
        }
        .au__ops-card {
          padding: 2rem 1.5rem;
          border-right: 1px solid #e8e6e2;
          opacity: 0;
          transform: translateY(20px);
          transition: opacity 0.6s ease, transform 0.6s ease;
        }
        .au__ops-card:last-child { border-right: none; }
        .au__ops-icon {
          margin-bottom: 1.25rem;
        }
        .au__ops-card h3 {
          font-size: 0.85rem;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 0.04em;
          margin: 0 0 0.75rem;
          color: #1a1a1a;
        }
        .au__ops-card p {
          font-size: 0.82rem;
          line-height: 1.65;
          color: #888;
          margin: 0;
        }


        /* ===== CERTIFICATIONS TRUST BAR ===== */
        .au__certs {
          padding: 3rem 2rem;
          background: #faf9f6;
          border-top: 1px solid #e8e6e2;
          border-bottom: 1px solid #e8e6e2;
        }
        .au__certs-inner {
          max-width: 900px;
          margin: 0 auto;
        }
        .au__certs-logos {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 2.5rem;
          flex-wrap: wrap;
          margin-top: 1.5rem;
        }
        .au__certs-logo {
          width: 60px;
          height: 40px;
          display: flex;
          align-items: center;
          justify-content: center;
          opacity: 0.5;
          transition: opacity 0.3s ease;
          filter: grayscale(1);
        }
        .au__certs-logo:hover {
          opacity: 1;
          filter: grayscale(0);
        }
        .au__certs-logo img {
          max-width: 100%;
          max-height: 100%;
          object-fit: contain;
        }


        /* ===== CLUBHOUSE ===== */
        .au__clubhouse {
          padding: 6rem 2rem;
          background: #fff;
        }
        .au__clubhouse-inner {
          max-width: 1200px;
          margin: 0 auto;
          display: grid;
          grid-template-columns: 1.1fr 0.9fr;
          gap: 4rem;
          align-items: start;
        }
        .au__clubhouse-content {
          opacity: 0;
          transform: translateY(30px);
          transition: opacity 0.8s ease, transform 0.8s cubic-bezier(0.16, 1, 0.3, 1);
        }
        .au__clubhouse-content--visible {
          opacity: 1;
          transform: translateY(0);
        }
        .au__clubhouse-title {
          font-family: 'Space Grotesk', sans-serif;
          font-size: clamp(1.8rem, 3.5vw, 2.5rem);
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: -0.02em;
          line-height: 1.15;
          margin: 0 0 1.5rem;
          color: #1a1a1a;
        }
        .au__clubhouse-desc {
          font-size: 0.95rem;
          line-height: 1.8;
          color: #555;
          margin: 0 0 1.25rem;
        }
        .au__clubhouse-features {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 0;
          margin-top: 2rem;
          border-top: 1px solid #e8e6e2;
        }
        .au__clubhouse-feature {
          padding: 1.25rem 1rem 1.25rem 0;
          border-bottom: 1px solid #e8e6e2;
        }
        .au__clubhouse-feature:nth-child(even) {
          padding-left: 1rem;
          border-left: 1px solid #e8e6e2;
        }
        .au__clubhouse-feature-num {
          font-family: 'Share Tech Mono', monospace;
          font-size: 0.6rem;
          color: #bbb;
          letter-spacing: 0.1em;
          display: block;
          margin-bottom: 0.4rem;
        }
        .au__clubhouse-feature h4 {
          font-size: 0.8rem;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 0.04em;
          margin: 0 0 0.3rem;
          color: #1a1a1a;
        }
        .au__clubhouse-feature p {
          font-size: 0.8rem;
          line-height: 1.5;
          color: #888;
          margin: 0;
        }
        .au__clubhouse-gallery {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 6px;
          opacity: 0;
          transform: translateY(30px);
          transition: opacity 0.8s ease 0.2s, transform 0.8s cubic-bezier(0.16, 1, 0.3, 1) 0.2s;
        }
        .au__clubhouse-gallery--visible {
          opacity: 1;
          transform: translateY(0);
        }
        .au__clubhouse-img {
          overflow: hidden;
          border-radius: 3px;
        }
        .au__clubhouse-img--main {
          grid-column: 1 / -1;
        }
        .au__clubhouse-img--wide {
          grid-column: 1 / -1;
        }
        .au__clubhouse-img img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          display: block;
          aspect-ratio: 1/1;
          filter: saturate(0.85);
          transition: transform 0.6s cubic-bezier(0.16, 1, 0.3, 1);
        }
        .au__clubhouse-img--main img {
          aspect-ratio: 16/9;
        }
        .au__clubhouse-img--wide img {
          aspect-ratio: 21/9;
        }
        .au__clubhouse-img:hover img {
          transform: scale(1.04);
          filter: saturate(1);
        }


        /* ===== LOCATION ===== */
        .au__location {
          padding: 5rem 2rem;
          background: #faf9f6;
          border-top: 1px solid #e8e6e2;
          border-bottom: 1px solid #e8e6e2;
        }
        .au__location-inner {
          max-width: 1000px;
          margin: 0 auto;
          display: grid;
          grid-template-columns: 1.2fr 0.8fr;
          gap: 4rem;
          align-items: center;
          opacity: 0;
          transform: translateY(25px);
          transition: opacity 0.8s ease, transform 0.8s cubic-bezier(0.16, 1, 0.3, 1);
        }
        .au__location-inner--visible {
          opacity: 1;
          transform: translateY(0);
        }
        .au__location-title {
          font-family: 'Space Grotesk', sans-serif;
          font-size: clamp(1.6rem, 3vw, 2.2rem);
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: -0.02em;
          margin: 0 0 1.25rem;
          color: #1a1a1a;
        }
        .au__location-desc {
          font-size: 0.95rem;
          line-height: 1.8;
          color: #555;
          margin: 0;
        }
        .au__location-stats {
          display: flex;
          flex-direction: column;
          gap: 0;
        }
        .au__location-stat {
          padding: 1.25rem 0;
          border-bottom: 1px solid #e8e6e2;
          display: flex;
          align-items: baseline;
          gap: 1.5rem;
        }
        .au__location-stat:first-child {
          border-top: 1px solid #e8e6e2;
        }
        .au__location-stat-value {
          font-family: 'Share Tech Mono', monospace;
          font-size: 1.1rem;
          font-weight: 700;
          color: #1a1a1a;
          min-width: 80px;
        }
        .au__location-stat-label {
          font-size: 0.8rem;
          color: #888;
          text-transform: uppercase;
          letter-spacing: 0.08em;
        }


        /* ===== ROBINSON AUTHORIZED ===== */
        .au__robinson {
          padding: 6rem 2rem;
          background: #fff;
          border-top: 1px solid #e8e6e2;
        }
        .au__robinson-inner {
          max-width: 900px;
          margin: 0 auto;
          display: grid;
          grid-template-columns: auto 1fr;
          gap: 3rem;
          align-items: center;
          opacity: 0;
          transform: translateY(25px);
          transition: opacity 0.8s ease, transform 0.8s cubic-bezier(0.16, 1, 0.3, 1);
        }
        .au__robinson-inner--visible {
          opacity: 1;
          transform: translateY(0);
        }
        .au__robinson-badge {
          width: 140px;
          height: 140px;
          display: flex;
          align-items: center;
          justify-content: center;
          border: 1px solid #e8e6e2;
          border-radius: 4px;
          padding: 1rem;
          background: #faf9f6;
        }
        .au__robinson-badge img {
          width: 100%;
          height: 100%;
          object-fit: contain;
        }
        .au__robinson-title {
          font-family: 'Space Grotesk', sans-serif;
          font-size: clamp(1.2rem, 2.5vw, 1.6rem);
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: -0.01em;
          margin: 0 0 1rem;
          color: #1a1a1a;
        }
        .au__robinson-desc {
          font-size: 0.92rem;
          line-height: 1.75;
          color: #555;
          margin: 0 0 1.5rem;
        }
        .au__robinson-certs {
          display: flex;
          flex-wrap: wrap;
          gap: 0.75rem 1.5rem;
        }
        .au__robinson-cert {
          display: inline-flex;
          align-items: center;
          gap: 0.4rem;
          font-size: 0.75rem;
          font-weight: 500;
          text-transform: uppercase;
          letter-spacing: 0.06em;
          color: #1a1a1a;
        }


        /* ===== BUTTON ===== */
        .au__btn {
          display: inline-flex;
          align-items: center;
          gap: 0.75rem;
          padding: 1rem 2rem;
          background: #fff;
          color: #1a1a1a;
          font-family: 'Space Grotesk', sans-serif;
          font-size: 0.75rem;
          font-weight: 400;
          text-transform: uppercase;
          letter-spacing: 0.1em;
          text-decoration: none;
          border: none;
          cursor: pointer;
          transition: all 0.3s ease;
        }
        .au__btn:hover { background: #f0f0f0; }
        .au__btn--ghost {
          background: transparent;
          border: 1px solid rgba(255,255,255,0.4);
          color: #fff;
        }
        .au__btn--ghost:hover {
          background: rgba(255,255,255,0.1);
          border-color: #fff;
        }


        /* ===== CTA ===== */
        .au__cta {
          position: relative;
          min-height: 60vh;
          display: flex;
          align-items: center;
          justify-content: center;
          overflow: hidden;
        }
        .au__cta-bg {
          position: absolute;
          inset: 0;
        }
        .au__cta-bg img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }
        .au__cta-overlay {
          position: absolute;
          inset: 0;
          background: rgba(0,0,0,0.6);
        }
        .au__cta-content {
          position: relative;
          z-index: 2;
          text-align: center;
          color: #fff;
          padding: 4rem 2rem;
          max-width: 700px;
        }
        .au__cta-title {
          font-family: 'Space Grotesk', sans-serif;
          font-size: clamp(2rem, 4vw, 3rem);
          font-weight: 700;
          text-transform: uppercase;
          margin: 0 0 1.5rem;
        }
        .au__cta-desc {
          font-size: 1.05rem;
          line-height: 1.8;
          color: rgba(255,255,255,0.75);
          margin: 0 0 2.5rem;
        }
        .au__cta-actions {
          display: flex;
          justify-content: center;
          gap: 1rem;
          flex-wrap: wrap;
        }


        /* ===== RESPONSIVE ===== */
        @media (max-width: 768px) {
          .au__stats {
            grid-template-columns: repeat(2, 1fr);
          }
          .au__stat:nth-child(-n+2) {
            border-bottom: 1px solid #e8e6e2;
          }
          .au__story-inner {
            grid-template-columns: 1fr;
          }
          .au__story-sticky {
            position: relative;
            top: auto;
            padding: 2rem 1.5rem 2rem;
          }
          .au__story-bg,
          .au__story-bg-border {
            display: none;
          }
          .au__story-gallery {
            grid-column: 1;
            padding: 0 1.5rem 1.5rem;
          }
          .au__captain-inner {
            grid-template-columns: 1fr;
            gap: 2rem;
          }
          .au__captain-content {
            padding-top: 0;
          }
          .au__parallax {
            height: 35vh;
          }
          .au__services-grid {
            grid-template-columns: 1fr;
          }
          .au__hero {
            height: 80vh;
          }
          .au__clubhouse-inner {
            grid-template-columns: 1fr;
            gap: 2rem;
          }
          .au__clubhouse-features {
            grid-template-columns: 1fr;
          }
          .au__clubhouse-feature:nth-child(even) {
            padding-left: 0;
            border-left: none;
          }
          .au__location-inner {
            grid-template-columns: 1fr;
            gap: 2rem;
          }
          .au__safety-inner {
            grid-template-columns: 1fr;
            gap: 2rem;
          }
          .au__fleet-card {
            grid-template-columns: 1fr;
            gap: 2rem;
          }
          .au__explorer-inner {
            grid-template-columns: 1fr;
            gap: 2rem;
          }
          .au__explorer-trips {
            grid-template-columns: 1fr;
          }
          .au__explorer-trip:nth-child(even) {
            padding-left: 0;
            border-left: none;
          }
          .au__ops-grid {
            grid-template-columns: 1fr 1fr;
          }
          .au__ops-card {
            border-bottom: 1px solid #e8e6e2;
          }
          .au__ops-card:nth-child(even) {
            border-right: none;
          }
          .au__robinson-inner {
            grid-template-columns: 1fr;
            text-align: center;
          }
          .au__robinson-badge {
            margin: 0 auto;
          }
          .au__robinson-certs {
            justify-content: center;
          }
          .au__accolade {
            flex: 1 1 100%;
            border-right: none !important;
            padding-left: 0 !important;
            padding-right: 0 !important;
          }
          .au__accolades .au__accolade:nth-last-child(-n+2) {
            border-bottom: 1px solid #e8e6e2;
          }
          .au__accolades .au__accolade:last-child {
            border-bottom: none;
          }
        }

        @media (max-width: 500px) {
          .au__stats {
            grid-template-columns: 1fr 1fr;
          }
          .au__hero-meta {
            flex-direction: column;
            gap: 0.5rem;
          }
          .au__hero-divider { display: none; }
          .au__cta-actions {
            flex-direction: column;
            align-items: center;
          }
          .au__story-gallery {
            grid-template-columns: 1fr;
          }
          .au__story-img--wide,
          .au__story-img--tall {
            grid-column: auto;
            grid-row: auto;
          }
          .au__story-img img,
          .au__story-img--wide img,
          .au__story-img--tall img {
            aspect-ratio: 16/9;
          }
          .au__ops-grid {
            grid-template-columns: 1fr;
          }
          .au__ops-card {
            border-right: none;
          }
          .au__fleet-specs {
            grid-template-columns: repeat(2, 1fr);
          }
          .au__fleet-spec:nth-child(2) {
            border-right: none;
          }
          .au__certs-logos {
            gap: 1.5rem;
          }
          .au__certs-logo {
            width: 45px;
            height: 30px;
          }
        }
      `}</style>
    </div>
  );
}

export default AboutUs;

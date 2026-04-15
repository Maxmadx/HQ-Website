import { useState, useRef } from 'react';
import { Link } from 'react-router-dom';
import { useInView } from 'framer-motion';

const expeditions = [
  {
    year: '1997',
    title: 'Around the World',
    aircraft: 'Robinson R44 Astro',
    detail: '97 days. 28 countries. Co-pilot and instructor alongside Jennifer Murray in G-MURY — the first piston-powered helicopter to circumnavigate the globe. Departed England eastbound through Europe, the Middle East, India, Southeast Asia, Russia, across the Bering Strait to Alaska, down through the USA, up Canada\'s coast, and home via Greenland, Iceland, and the Faroe Islands. The aircraft now sits in the Smithsonian National Air and Space Museum.',
    img: '/assets/images/expeditions/channel.jpg',
  },
  {
    year: '2000',
    title: 'Second Circumnavigation',
    aircraft: 'Robinson R44',
    detail: 'A convoy of two R44 helicopters and a Cessna Caravan supporting Jennifer Murray\'s dream to fly solo around the world. Q flew the backup helicopter. Colin Bodill simultaneously set the Guinness World Record for fastest microlight circumnavigation.',
    img: '/assets/images/expeditions/helicopter-expeditions-quentin-smith.webp',
  },
  {
    year: '2002',
    title: 'North Pole',
    aircraft: 'Robinson R44 Raven II',
    detail: 'First piston-powered helicopter to land at the North Pole. Flew G-NUDE with Steve Brooks into one of the most hostile environments on earth. Guinness World Record confirmed.',
    img: '/assets/images/expeditions/north-pole.jpg',
  },
  {
    year: '2003',
    title: 'Drake Passage',
    aircraft: 'Robinson R44 Raven II',
    detail: 'En route from the North Pole to the South Pole, the engine failed 100 miles from the Antarctic coast over the Drake Passage — 480 miles of the most treacherous weather in the world. Q executed a masterful autorotation onto 5-metre ocean swells. Both men survived over 9 hours in a life-raft before rescue by a Chilean naval icebreaker. Brooks had jumped into the freezing water to retrieve the life-raft — an act Q describes as "one of the greatest heroic acts of behaviour ever."',
    img: '/assets/images/expeditions/antartica.jpg',
  },
  {
    year: '2005',
    title: 'South Pole',
    aircraft: 'Robinson R44 Raven II',
    detail: '18 January 2005. Bright sunshine. Minus 26 degrees. The South Pole sits at 9,300 feet above sea level — Q flew the R44 at up to 14,000 feet density altitude. They built a small igloo around the engine compartment and used an avgas stove to warm it to +2°C before the final approach. With Steve Brooks, they became the first crew to fly a helicopter to both the North and South Poles.',
    img: '/assets/images/expeditions/south-pole-by-helicopter-quentin-smith.webp',
  },
  {
    year: '2007',
    title: 'Ice Challenger',
    aircraft: 'Robinson R44',
    detail: 'Steve Brooks wanted to be the first person to drive across the frozen Bering Strait — from Alaska to Russia — in an amphibious all-terrain vehicle he built called "Snowbird VI," a machine propelled by giant Archimedes screws that could float on open water, climb onto ice floes, and grind across solid pack ice. Q flew the support helicopter, a Robinson R44, scouting the ice ahead for cracks and open water leads, guiding Steve\'s vehicle through a maze of moving ice plates and temperatures dropping to -40\u00B0C.',
    img: '/assets/images/expeditions/north-pole.jpg',
  },
  {
    year: '2015',
    title: 'Three North Poles',
    aircraft: 'Robinson R66',
    detail: 'A fleet of five Robinson R66 helicopters flew from Moscow to Svalbard, then onward to the drifting ice base "Barneo" before heading to all three North Poles — the Geographic North Pole, the Magnetic North Pole, and the Northern Pole of Inaccessibility. At the Pole, the sub-zero temperatures turned their celebratory champagne into solid slush. They ate frozen champagne with a fork.',
    img: '/assets/images/expeditions/six-helis-in-North-Pole.jpg',
  },
  {
    year: '2016',
    title: 'The Polar Triangle',
    aircraft: 'Robinson R44',
    detail: 'First pilot to fly solo to all three North Poles in a single journey — the Geographic North Pole, the North Pole of Inaccessibility (700 miles from the nearest land), and the Magnetic North Pole. Having led the team expedition the year before, Q returned alone to prove it could be done by a single pilot in a single aircraft.',
    img: '/assets/images/expeditions/helicopter-expeditions-quentin-smith.webp',
  },
];

function CaptainQ() {
  const [activeExp, setActiveExp] = useState(0);
  const heroRef = useRef(null);
  const heroInView = useInView(heroRef, { once: true, amount: 0.2 });
  const bioRef = useRef(null);
  const bioInView = useInView(bioRef, { once: true, amount: 0.2 });
  const expRef = useRef(null);
  const expInView = useInView(expRef, { once: true, amount: 0.1 });
  const champRef = useRef(null);
  const champInView = useInView(champRef, { once: true, amount: 0.2 });
  const tomRef = useRef(null);
  const tomInView = useInView(tomRef, { once: true, amount: 0.2 });
  const specialRef = useRef(null);
  const specialInView = useInView(specialRef, { once: true, amount: 0.2 });
  const legacyRef = useRef(null);
  const legacyInView = useInView(legacyRef, { once: true, amount: 0.2 });

  return (
    <div className="cq">

      {/* ===== HERO ===== */}
      <section className="cq__hero" ref={heroRef}>
        <div className="cq__hero-bg">
          <img src="/assets/images/expeditions/south-pole-by-helicopter-quentin-smith.webp" alt="" />
          <div className="cq__hero-overlay" />
        </div>
        <div className={`cq__hero-content ${heroInView ? 'cq__hero-content--visible' : ''}`}>
          <span className="cq__pretitle">The Founder of HQ Aviation</span>
          <h1 className="cq__hero-title">
            <span>Captain</span>
            <span>Quentin</span>
            <span>Smith</span>
          </h1>
          <p className="cq__hero-sub">
            2x World Champion. Guinness World Record Holder. First to Both Poles.
          </p>
          <div className="cq__hero-meta">
            <span>FAI Gold Rotorcraft Medal 2019</span>
            <span className="cq__hero-divider" />
            <span className="cq__hero-coords">12,000+ Hours PIC</span>
          </div>
        </div>
        <div className="cq__hero-scroll">
          <span>Scroll</span>
          <div className="cq__hero-scroll-line"><span /></div>
        </div>
      </section>


      {/* ===== BIO ===== */}
      <section className="cq__bio" ref={bioRef}>
        <div className="cq__bio-inner">
          <div className={`cq__bio-image ${bioInView ? 'cq__bio-image--visible' : ''}`}>
            <img src="/assets/images/team/world-helicopter-champion-quentin-smith.webp" alt="Captain Quentin Smith" />
          </div>
          <div className={`cq__bio-content ${bioInView ? 'cq__bio-content--visible' : ''}`}>
            <span className="cq__pretitle">The Man Behind the Legend</span>
            <h2 className="cq__section-title">A Life in the Air</h2>
            <p>
              Cornish by birth, a physicist by education, a pilot from the age of five.
              Captain Quentin "Q" Smith has spent over 55 years in the air — amassing more
              than 12,000 hours as pilot-in-command across every continent on earth.
            </p>
            <p>
              Aviation runs in the blood. Q's father, Mike Smith, was a celebrated helicopter
              pilot in the Royal Navy's Fleet Air Arm — one of the original Borneo "Junglies"
              with 848 Naval Air Squadron. In one legendary rescue in 1966, Mike was flown for
              seven miles hanging from a strap beneath a helicopter, holding a stretcher during
              an army patrol evacuation in Malaysian Borneo.
            </p>
            <p>
              Q holds an Air Transport Pilot Licence (Helicopters) and is both a helicopter
              instructor and examiner. Having taught thousands of students, he is regarded
              as one of the most experienced rotary-wing instructors in the world. He founded
              HQ Aviation at Denham Aerodrome — a Robinson Authorized Dealer and Service Centre
              that has become the UK's leading helicopter specialists.
            </p>
            <div className="cq__bio-stats">
              {[
                { value: '55+', label: 'Years Flying' },
                { value: '12,000+', label: 'Hours PIC' },
                { value: '7', label: 'Continents' },
                { value: '2x', label: 'World Champion' },
              ].map((s, i) => (
                <div key={i} className="cq__bio-stat">
                  <span className="cq__bio-stat-value">{s.value}</span>
                  <span className="cq__bio-stat-label">{s.label}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>


      {/* ===== WORLD CHAMPION ===== */}
      <section className="cq__parallax">
        <div className="cq__parallax-img">
          <img src="/assets/images/team/helicopter-genius-quentin-smith-great-britain.webp" alt="Q competing for Great Britain" />
        </div>
        <h2 className="cq__parallax-title">World Champion</h2>
      </section>

      <section className="cq__champ" ref={champRef}>
        <div className="cq__champ-inner">
          <div className={`cq__champ-content ${champInView ? 'cq__champ-content--visible' : ''}`}>
            <span className="cq__pretitle">Helicopter Aerobatics</span>
            <h2 className="cq__section-title">Two Gold Medals. One Pilot.</h2>
            <p>
              Moscow, 1994. The World Helicopter Championships. The Cold War had just
              ended and Russian pilots — trained with military rigour, flying powerful
              turbine-driven Mil Mi-2s and Kamov Ka-32s — dominated the sport on home
              turf. Into this arena stepped a 32-year-old British pilot, flying a humble
              Robinson R22.
            </p>
            <p>
              Where his competitors relied on raw turbine power to muscle through manoeuvres,
              Q demonstrated something different: fluidity, precision, and an intimate
              understanding of energy management that made the light, agile Robinson dance.
              He won the gold medal in Freestyle Aerobatics — the first British pilot ever
              to claim the title.
            </p>
            <p>
              Eighteen years later, in 2012, he did it again. His winning routine included
              a manoeuvre previously deemed impossible by experts: a backwards autorotation —
              an engine-off backward landing from just 300 feet. He practised for two years
              with slow, tiny incremental steps to master it. The helicopter is completely
              unstable going backwards; the airflow hits the tail from an awkward direction,
              creating severe stability issues. Q made it look effortless.
            </p>
            <p>
              In 2019, Q was awarded the FAI Gold Rotorcraft Medal — the highest honour in
              international rotorcraft aviation, recognising his lifetime contribution to the sport.
            </p>
            <div className="cq__champ-awards">
              <div className="cq__award">
                <span className="cq__award-year">1994</span>
                <span className="cq__award-title">World Champion</span>
                <span className="cq__award-detail">Freestyle Aerobatics</span>
              </div>
              <div className="cq__award">
                <span className="cq__award-year">2012</span>
                <span className="cq__award-title">World Champion</span>
                <span className="cq__award-detail">Freestyle Aerobatics</span>
              </div>
              <div className="cq__award">
                <span className="cq__award-year">2019</span>
                <span className="cq__award-title">FAI Gold Medal</span>
                <span className="cq__award-detail">Lifetime Achievement</span>
              </div>
            </div>
          </div>
          <div className={`cq__champ-image ${champInView ? 'cq__champ-image--visible' : ''}`}>
            <img src="/assets/images/team/quentin-smith-world-record-holder-helicopter-aerobatics.webp" alt="Q performing helicopter aerobatics" />
          </div>
        </div>
      </section>


      {/* ===== EXPEDITIONS ===== */}
      <section className="cq__parallax">
        <div className="cq__parallax-img">
          <img src="/assets/images/expeditions/north-pole.jpg" alt="Helicopter at the North Pole" />
        </div>
        <h2 className="cq__parallax-title">Expeditions</h2>
      </section>

      <section className="cq__exp" ref={expRef}>
        <div className="cq__exp-inner">
          <div className="cq__section-header">
            <span className="cq__pretitle">To the Ends of the Earth</span>
            <h2 className="cq__headline">
              <span>Record</span> <span>Breaking</span> <span>Journeys</span>
            </h2>
          </div>

          {/* Expedition selector */}
          <div className="cq__exp-nav">
            {expeditions.map((exp, i) => (
              <button
                key={i}
                className={`cq__exp-tab ${i === activeExp ? 'cq__exp-tab--active' : ''}`}
                onClick={() => setActiveExp(i)}
              >
                <span className="cq__exp-tab-year">{exp.year}</span>
                <span className="cq__exp-tab-title">{exp.title}</span>
              </button>
            ))}
          </div>

          {/* Active expedition */}
          <div className="cq__exp-detail">
            <div className="cq__exp-img">
              {expeditions.map((exp, i) => (
                <img
                  key={i}
                  src={exp.img}
                  alt={exp.title}
                  className={i === activeExp ? 'cq__exp-img--active' : ''}
                />
              ))}
            </div>
            <div className="cq__exp-body">
              <span className="cq__exp-aircraft">{expeditions[activeExp].aircraft}</span>
              <h3 className="cq__exp-title">{expeditions[activeExp].year} — {expeditions[activeExp].title}</h3>
              <p className="cq__exp-text">{expeditions[activeExp].detail}</p>
            </div>
          </div>

          <div className="cq__exp-progress">
            <div className="cq__exp-progress-bar" style={{ width: `${((activeExp + 1) / expeditions.length) * 100}%` }} />
          </div>
        </div>
      </section>


      {/* ===== TOM CRUISE / MISSION IMPOSSIBLE ===== */}
      <section className="cq__parallax">
        <div className="cq__parallax-img">
          <img src="/assets/images/gallery/flying/flying-tv.jpg" alt="Helicopter in flight" />
        </div>
        <h2 className="cq__parallax-title">Hollywood</h2>
      </section>

      <section className="cq__tom" ref={tomRef}>
        <div className="cq__tom-inner">
          <div className={`cq__tom-content ${tomInView ? 'cq__tom-content--visible' : ''}`}>
            <span className="cq__pretitle">Mission: Impossible &mdash; Fallout</span>
            <h2 className="cq__section-title">The Man Who Trained Tom Cruise</h2>
            <p>
              When Paramount Pictures needed someone to teach Tom Cruise to fly a helicopter
              for <em>Mission: Impossible &mdash; Fallout</em>, they came to Captain Q. The
              training regimen was designed to compress roughly 2,000 hours of flying
              experience into just three months. Normally, it takes a pilot several years to
              gain the skill level required for the stunts performed in the film.
            </p>
            <p>
              The centrepiece was "The Spiral Dive" — a terrifying descending corkscrew
              manoeuvre performed down a narrow waterfall canyon in New Zealand. Cruise had
              to execute the manoeuvre while acting, maintaining a precise distance from the
              camera helicopter, and flying near mountains. Q designed the training programme
              that made it possible.
            </p>
            <div className="cq__tom-quote">
              <blockquote>
                "Rich people in London will love that they had the opportunity to fly with the
                guy that taught Tom Cruise to fly."
              </blockquote>
            </div>
          </div>
          <div className={`cq__tom-visual ${tomInView ? 'cq__tom-visual--visible' : ''}`}>
            <div className="cq__tom-stats">
              <div className="cq__tom-stat">
                <span className="cq__tom-stat-value">2,000</span>
                <span className="cq__tom-stat-label">Hours compressed</span>
              </div>
              <div className="cq__tom-stat">
                <span className="cq__tom-stat-value">3</span>
                <span className="cq__tom-stat-label">Months of training</span>
              </div>
              <div className="cq__tom-stat">
                <span className="cq__tom-stat-value">2018</span>
                <span className="cq__tom-stat-label">Film release</span>
              </div>
            </div>
            <img src="/assets/images/team/q-dubai.jpg" alt="Captain Q — instructor to the world's biggest stars" />
            <span className="cq__media-caption">The instructor behind the impossible</span>
          </div>
        </div>
      </section>


      {/* ===== SPECIAL TRAINING ===== */}
      <section className="cq__special" ref={specialRef}>
        <div className="cq__special-inner">
          <div className={`cq__special-image ${specialInView ? 'cq__special-image--visible' : ''}`}>
            <img src="/assets/images/team/quentin-smith-profile-picture-2.jpg" alt="Captain Q — advanced training" />
          </div>
          <div className={`cq__special-content ${specialInView ? 'cq__special-content--visible' : ''}`}>
            <span className="cq__pretitle">Beyond Regulation</span>
            <h2 className="cq__section-title">Special Training</h2>
            <p>
              Heliservices in Hong Kong invests in training that goes far beyond standard
              Civil Aviation Department requirements. They send their pilots to Q because
              they want world-champion-level handling skills, not just standard commercial
              competency.
            </p>
            <p>
              Q pushes pilots to the edge of the flight envelope so they know exactly where
              the limit is, rather than fearing it. His approach is born from decades of
              aerobatic competition and polar expeditions — real-world experience that no
              simulator or textbook can replicate. Autorotations from any position, confined
              area operations, advanced emergency procedures. The goal: to be so comfortable
              with autorotating that you could do it in your sleep.
            </p>
            <p>
              It is this experience — surviving the Drake Passage, flying to both Poles,
              winning world championships in underpowered aircraft — that makes Q one of
              the most sought-after advanced instructors in the world.
            </p>
          </div>
        </div>
      </section>


      {/* ===== TOP GEAR / MEDIA ===== */}
      <section className="cq__media" ref={legacyRef}>
        <div className="cq__media-inner">
          <div className={`cq__media-image ${legacyInView ? 'cq__media-image--visible' : ''}`}>
            <img src="/assets/images/team/helicopter-lands-on-a-car-2c-top-gear-2c-quentin-smith.webp" alt="Q landing a helicopter on a moving car — Top Gear" />
            <span className="cq__media-caption">Landing a helicopter on a moving car</span>
          </div>
          <div className={`cq__media-content ${legacyInView ? 'cq__media-content--visible' : ''}`}>
            <span className="cq__pretitle">Beyond the Records</span>
            <h2 className="cq__section-title">The Pioneer</h2>
            <p>
              Q's exploits extend far beyond the record books. He has landed helicopters on
              superyachts, performed on television, and in 2017, when an Airbus H125 crashed
              into Bergen Harbour during a superyacht landing approach, Q's quick actions
              activating emergency floatation gear and rescuing passengers saved lives.
            </p>
            <p>
              His story has been told in magazines including Avaunt, featured in Breitling's
              most famous Emergency watch rescue stories, and documented in Jennifer Murray's
              books about their shared expeditions — including the aircraft G-MURY, which now
              resides in the Smithsonian.
            </p>
            <p>
              But for Q, the greatest reward has always been simpler than records and accolades.
              As he puts it: "Flying is, above all, a beautiful thing that deserves to be enjoyed."
            </p>
          </div>
        </div>
      </section>


      {/* ===== CTA ===== */}
      <section className="cq__cta">
        <div className="cq__cta-bg">
          <img src="/assets/images/facility/busy-hangar.jpg" alt="" />
          <div className="cq__cta-overlay" />
        </div>
        <div className="cq__cta-content">
          <span className="cq__pretitle cq__pretitle--light">HQ Aviation</span>
          <h2 className="cq__cta-title">Fly with Captain Q</h2>
          <p className="cq__cta-desc">
            Train at the school Q built. Fly the helicopters he champions.
            Join the expeditions he leads. This is HQ Aviation.
          </p>
          <div className="cq__cta-actions">
            <Link to="/expeditions" className="cq__btn">View Expeditions</Link>
            <Link to="/training" className="cq__btn cq__btn--ghost">Learn to Fly</Link>
          </div>
        </div>
      </section>


      <style>{`
        .cq {
          font-family: 'Space Grotesk', -apple-system, sans-serif;
          color: #1a1a1a;
          background: #faf9f6;
        }

        /* ===== SHARED ===== */
        .cq__pretitle {
          font-family: 'Share Tech Mono', monospace;
          font-size: 0.7rem;
          letter-spacing: 0.2em;
          text-transform: uppercase;
          color: #999;
          display: block;
          margin-bottom: 0.75rem;
        }
        .cq__pretitle--light { color: rgba(255,255,255,0.5); }

        .cq__section-title {
          font-family: 'Space Grotesk', sans-serif;
          font-size: clamp(1.8rem, 4vw, 2.8rem);
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: -0.02em;
          margin: 0 0 1.5rem;
          color: #1a1a1a;
        }

        .cq__section-header {
          text-align: center;
          margin-bottom: 3rem;
        }
        .cq__section-header .cq__pretitle { margin-bottom: 1rem; }
        .cq__headline {
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
        .cq__headline span:nth-child(1) { color: #1a1a1a; }
        .cq__headline span:nth-child(2) { color: #4a4a4a; }
        .cq__headline span:nth-child(3) { color: #7a7a7a; }

        .cq__link {
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
        .cq__link:hover { border-color: #1a1a1a; }


        /* ===== HERO ===== */
        .cq__hero {
          position: relative;
          height: 100vh;
          min-height: 600px;
          display: flex;
          align-items: center;
          justify-content: center;
          overflow: hidden;
        }
        .cq__hero-bg {
          position: absolute;
          inset: 0;
        }
        .cq__hero-bg img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }
        .cq__hero-overlay {
          position: absolute;
          inset: 0;
          background: linear-gradient(to bottom, rgba(0,0,0,0.3) 0%, rgba(0,0,0,0.6) 100%);
        }
        .cq__hero-content {
          position: relative;
          z-index: 2;
          text-align: center;
          color: #fff;
          padding: 2rem;
          opacity: 0;
          transform: translateY(20px);
          transition: opacity 0.8s ease, transform 0.8s cubic-bezier(0.16, 1, 0.3, 1);
        }
        .cq__hero-content--visible {
          opacity: 1;
          transform: translateY(0);
        }
        .cq__hero-title {
          font-size: clamp(3rem, 7vw, 5.5rem);
          font-weight: 700;
          line-height: 1;
          text-transform: uppercase;
          letter-spacing: -0.02em;
          margin: 0 0 1.5rem;
          display: flex;
          flex-direction: column;
          gap: 0.15rem;
        }
        .cq__hero-title span:nth-child(1) { color: #ffffff; }
        .cq__hero-title span:nth-child(2) { color: rgba(255,255,255,0.75); }
        .cq__hero-title span:nth-child(3) { color: rgba(255,255,255,0.5); }
        .cq__hero-sub {
          font-size: 1rem;
          color: rgba(255,255,255,0.65);
          margin: 0 0 1.5rem;
          line-height: 1.6;
        }
        .cq__hero-meta {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 1.5rem;
          font-size: 0.75rem;
          color: rgba(255,255,255,0.4);
        }
        .cq__hero-divider {
          width: 1px;
          height: 14px;
          background: rgba(255,255,255,0.2);
        }
        .cq__hero-coords {
          font-family: 'Share Tech Mono', monospace;
          font-size: 0.65rem;
          letter-spacing: 0.1em;
        }
        .cq__hero-scroll {
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
        .cq__hero-scroll > span {
          font-size: 0.65rem;
          text-transform: uppercase;
          letter-spacing: 0.2em;
          color: rgba(255,255,255,0.4);
        }
        .cq__hero-scroll-line {
          width: 1px;
          height: 50px;
          background: rgba(255,255,255,0.15);
          position: relative;
          overflow: hidden;
        }
        .cq__hero-scroll-line span {
          position: absolute;
          top: 0; left: 0;
          width: 100%; height: 30%;
          background: rgba(255,255,255,0.6);
          animation: cqScroll 2s ease-in-out infinite;
        }
        @keyframes cqScroll {
          0% { top: -30%; }
          100% { top: 100%; }
        }


        /* ===== BIO ===== */
        .cq__bio {
          padding: 6rem 2rem;
          background: #fff;
        }
        .cq__bio-inner {
          max-width: 1100px;
          margin: 0 auto;
          display: grid;
          grid-template-columns: 0.9fr 1.1fr;
          gap: 4rem;
          align-items: start;
        }
        .cq__bio-image {
          opacity: 0;
          transform: translateY(30px);
          transition: opacity 0.8s ease, transform 0.8s cubic-bezier(0.16, 1, 0.3, 1);
        }
        .cq__bio-image--visible {
          opacity: 1;
          transform: translateY(0);
        }
        .cq__bio-image img {
          width: 100%;
          aspect-ratio: 3/4;
          object-fit: cover;
        }
        .cq__bio-content {
          padding-top: 1rem;
          opacity: 0;
          transform: translateY(30px);
          transition: opacity 0.8s ease 0.15s, transform 0.8s cubic-bezier(0.16, 1, 0.3, 1) 0.15s;
        }
        .cq__bio-content--visible {
          opacity: 1;
          transform: translateY(0);
        }
        .cq__bio-content p {
          font-size: 1.05rem;
          line-height: 1.8;
          color: #666;
          margin: 0 0 1.25rem;
        }
        .cq__bio-stats {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 1px;
          background: #e8e6e2;
          border: 1px solid #e8e6e2;
          margin-top: 2rem;
        }
        .cq__bio-stat {
          background: #fff;
          text-align: center;
          padding: 1.25rem 0.5rem;
        }
        .cq__bio-stat-value {
          display: block;
          font-family: 'Share Tech Mono', monospace;
          font-size: 1.4rem;
          font-weight: 700;
          color: #1a1a1a;
          margin-bottom: 0.25rem;
        }
        .cq__bio-stat-label {
          font-size: 0.65rem;
          text-transform: uppercase;
          letter-spacing: 0.15em;
          color: #999;
        }


        /* ===== PARALLAX ===== */
        .cq__parallax {
          position: relative;
          height: 50vh;
          min-height: 350px;
          overflow: hidden;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .cq__parallax-img {
          position: absolute;
          inset: -20% 0;
        }
        .cq__parallax-img img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }
        .cq__parallax-title {
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


        /* ===== CHAMPION ===== */
        .cq__champ {
          padding: 6rem 2rem;
          background: #faf9f6;
        }
        .cq__champ-inner {
          max-width: 1100px;
          margin: 0 auto;
          display: grid;
          grid-template-columns: 1.1fr 0.9fr;
          gap: 4rem;
          align-items: start;
        }
        .cq__champ-content {
          opacity: 0;
          transform: translateY(30px);
          transition: opacity 0.8s ease, transform 0.8s cubic-bezier(0.16, 1, 0.3, 1);
        }
        .cq__champ-content--visible {
          opacity: 1;
          transform: translateY(0);
        }
        .cq__champ-content p {
          font-size: 1.05rem;
          line-height: 1.8;
          color: #666;
          margin: 0 0 1.25rem;
        }
        .cq__champ-image {
          opacity: 0;
          transform: translateY(30px);
          transition: opacity 0.8s ease 0.15s, transform 0.8s cubic-bezier(0.16, 1, 0.3, 1) 0.15s;
        }
        .cq__champ-image--visible {
          opacity: 1;
          transform: translateY(0);
        }
        .cq__champ-image img {
          width: 100%;
          aspect-ratio: 3/4;
          object-fit: cover;
        }
        .cq__champ-awards {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 1px;
          background: #e8e6e2;
          border: 1px solid #e8e6e2;
          margin-top: 2rem;
        }
        .cq__award {
          background: #faf9f6;
          padding: 1.25rem;
          text-align: center;
        }
        .cq__award-year {
          font-family: 'Share Tech Mono', monospace;
          font-size: 0.65rem;
          letter-spacing: 0.15em;
          color: #999;
          display: block;
          margin-bottom: 0.5rem;
        }
        .cq__award-title {
          font-size: 0.85rem;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 0.02em;
          display: block;
          margin-bottom: 0.25rem;
        }
        .cq__award-detail {
          font-size: 0.72rem;
          color: #999;
          text-transform: uppercase;
          letter-spacing: 0.1em;
        }


        /* ===== EXPEDITIONS ===== */
        .cq__exp {
          padding: 6rem 2rem;
          background: #fff;
        }
        .cq__exp-inner {
          max-width: 1100px;
          margin: 0 auto;
        }
        .cq__exp-nav {
          display: flex;
          border: 1px solid #e8e6e2;
          margin-bottom: 0;
        }
        .cq__exp-tab {
          flex: 1;
          padding: 1rem 0.75rem;
          background: transparent;
          border: none;
          border-right: 1px solid #e8e6e2;
          cursor: pointer;
          text-align: center;
          transition: all 0.3s ease;
        }
        .cq__exp-tab:last-child { border-right: none; }
        .cq__exp-tab:hover { background: #f5f5f2; }
        .cq__exp-tab--active {
          background: #1a1a1a;
        }
        .cq__exp-tab-year {
          font-family: 'Share Tech Mono', monospace;
          font-size: 0.65rem;
          letter-spacing: 0.1em;
          color: #999;
          display: block;
          margin-bottom: 0.25rem;
        }
        .cq__exp-tab--active .cq__exp-tab-year { color: rgba(255,255,255,0.5); }
        .cq__exp-tab-title {
          font-size: 0.72rem;
          font-weight: 600;
          text-transform: uppercase;
          letter-spacing: 0.05em;
          color: #1a1a1a;
        }
        .cq__exp-tab--active .cq__exp-tab-title { color: #fff; }

        .cq__exp-detail {
          display: grid;
          grid-template-columns: 1fr 1fr;
          border: 1px solid #e8e6e2;
          border-top: none;
        }
        .cq__exp-img {
          position: relative;
          height: 400px;
          overflow: hidden;
        }
        .cq__exp-img img {
          position: absolute;
          inset: 0;
          width: 100%;
          height: 100%;
          object-fit: cover;
          opacity: 0;
          transition: opacity 0.5s ease;
        }
        .cq__exp-img--active { opacity: 1 !important; }
        .cq__exp-body {
          padding: 2.5rem;
          display: flex;
          flex-direction: column;
          justify-content: center;
        }
        .cq__exp-aircraft {
          font-family: 'Share Tech Mono', monospace;
          font-size: 0.65rem;
          letter-spacing: 0.15em;
          color: #999;
          text-transform: uppercase;
          display: block;
          margin-bottom: 0.75rem;
        }
        .cq__exp-title {
          font-size: 1.3rem;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 0.02em;
          margin: 0 0 1rem;
        }
        .cq__exp-text {
          font-size: 0.95rem;
          line-height: 1.75;
          color: #666;
          margin: 0;
        }

        .cq__exp-progress {
          height: 3px;
          background: #e8e6e2;
        }
        .cq__exp-progress-bar {
          height: 100%;
          background: #1a1a1a;
          transition: width 0.5s cubic-bezier(0.16, 1, 0.3, 1);
        }


        /* ===== MEDIA ===== */
        .cq__media {
          padding: 6rem 2rem;
          background: #faf9f6;
        }
        .cq__media-inner {
          max-width: 1100px;
          margin: 0 auto;
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 4rem;
          align-items: start;
        }
        .cq__media-image {
          position: relative;
          opacity: 0;
          transform: translateY(30px);
          transition: opacity 0.8s ease, transform 0.8s cubic-bezier(0.16, 1, 0.3, 1);
        }
        .cq__media-image--visible {
          opacity: 1;
          transform: translateY(0);
        }
        .cq__media-image img {
          width: 100%;
          aspect-ratio: 4/3;
          object-fit: cover;
        }
        .cq__media-caption {
          display: block;
          font-family: 'Share Tech Mono', monospace;
          font-size: 0.65rem;
          letter-spacing: 0.1em;
          color: #999;
          text-transform: uppercase;
          margin-top: 0.75rem;
        }
        .cq__media-content {
          padding-top: 1rem;
          opacity: 0;
          transform: translateY(30px);
          transition: opacity 0.8s ease 0.15s, transform 0.8s cubic-bezier(0.16, 1, 0.3, 1) 0.15s;
        }
        .cq__media-content--visible {
          opacity: 1;
          transform: translateY(0);
        }
        .cq__media-content p {
          font-size: 1.05rem;
          line-height: 1.8;
          color: #666;
          margin: 0 0 1.25rem;
        }


        /* ===== TOM CRUISE ===== */
        .cq__tom {
          padding: 6rem 2rem;
          background: #fff;
        }
        .cq__tom-inner {
          max-width: 1100px;
          margin: 0 auto;
          display: grid;
          grid-template-columns: 1.1fr 0.9fr;
          gap: 4rem;
          align-items: start;
        }
        .cq__tom-content {
          padding-top: 1rem;
          opacity: 0;
          transform: translateY(30px);
          transition: opacity 0.8s ease, transform 0.8s cubic-bezier(0.16, 1, 0.3, 1);
        }
        .cq__tom-content--visible {
          opacity: 1;
          transform: translateY(0);
        }
        .cq__tom-content p {
          font-size: 1.05rem;
          line-height: 1.8;
          color: #666;
          margin: 0 0 1.25rem;
        }
        .cq__tom-quote {
          margin-top: 2rem;
          padding: 1.5rem 0;
          border-top: 1px solid #e8e6e2;
          border-bottom: 1px solid #e8e6e2;
        }
        .cq__tom-quote blockquote {
          font-family: 'Space Grotesk', sans-serif;
          font-size: 1.1rem;
          font-weight: 500;
          font-style: italic;
          line-height: 1.7;
          color: #333;
          margin: 0;
        }
        .cq__tom-visual {
          opacity: 0;
          transform: translateY(30px);
          transition: opacity 0.8s ease 0.15s, transform 0.8s cubic-bezier(0.16, 1, 0.3, 1) 0.15s;
        }
        .cq__tom-visual--visible {
          opacity: 1;
          transform: translateY(0);
        }
        .cq__tom-visual img {
          width: 100%;
          aspect-ratio: 4/3;
          object-fit: cover;
          margin-top: 1.5rem;
        }
        .cq__tom-stats {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 1px;
          background: #e8e6e2;
          border: 1px solid #e8e6e2;
        }
        .cq__tom-stat {
          background: #fff;
          padding: 1.25rem 0.75rem;
          text-align: center;
        }
        .cq__tom-stat-value {
          display: block;
          font-family: 'Share Tech Mono', monospace;
          font-size: 1.4rem;
          font-weight: 700;
          color: #1a1a1a;
          margin-bottom: 0.25rem;
        }
        .cq__tom-stat-label {
          font-size: 0.65rem;
          text-transform: uppercase;
          letter-spacing: 0.15em;
          color: #999;
        }


        /* ===== SPECIAL TRAINING ===== */
        .cq__special {
          padding: 6rem 2rem;
          background: #faf9f6;
        }
        .cq__special-inner {
          max-width: 1100px;
          margin: 0 auto;
          display: grid;
          grid-template-columns: 0.9fr 1.1fr;
          gap: 4rem;
          align-items: start;
        }
        .cq__special-image {
          opacity: 0;
          transform: translateY(30px);
          transition: opacity 0.8s ease, transform 0.8s cubic-bezier(0.16, 1, 0.3, 1);
        }
        .cq__special-image--visible {
          opacity: 1;
          transform: translateY(0);
        }
        .cq__special-image img {
          width: 100%;
          aspect-ratio: 3/4;
          object-fit: cover;
        }
        .cq__special-content {
          padding-top: 1rem;
          opacity: 0;
          transform: translateY(30px);
          transition: opacity 0.8s ease 0.15s, transform 0.8s cubic-bezier(0.16, 1, 0.3, 1) 0.15s;
        }
        .cq__special-content--visible {
          opacity: 1;
          transform: translateY(0);
        }
        .cq__special-content p {
          font-size: 1.05rem;
          line-height: 1.8;
          color: #666;
          margin: 0 0 1.25rem;
        }


        /* ===== BUTTON ===== */
        .cq__btn {
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
        .cq__btn:hover { background: #f0f0f0; }
        .cq__btn--ghost {
          background: transparent;
          border: 1px solid rgba(255,255,255,0.4);
          color: #fff;
        }
        .cq__btn--ghost:hover {
          background: rgba(255,255,255,0.1);
          border-color: #fff;
        }


        /* ===== CTA ===== */
        .cq__cta {
          position: relative;
          min-height: 55vh;
          display: flex;
          align-items: center;
          justify-content: center;
          overflow: hidden;
        }
        .cq__cta-bg {
          position: absolute;
          inset: 0;
        }
        .cq__cta-bg img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }
        .cq__cta-overlay {
          position: absolute;
          inset: 0;
          background: rgba(0,0,0,0.6);
        }
        .cq__cta-content {
          position: relative;
          z-index: 2;
          text-align: center;
          color: #fff;
          padding: 4rem 2rem;
          max-width: 700px;
        }
        .cq__cta-title {
          font-family: 'Space Grotesk', sans-serif;
          font-size: clamp(2rem, 4vw, 3rem);
          font-weight: 700;
          text-transform: uppercase;
          margin: 0 0 1.5rem;
        }
        .cq__cta-desc {
          font-size: 1.05rem;
          line-height: 1.8;
          color: rgba(255,255,255,0.75);
          margin: 0 0 2.5rem;
        }
        .cq__cta-actions {
          display: flex;
          justify-content: center;
          gap: 1rem;
          flex-wrap: wrap;
        }


        /* ===== RESPONSIVE ===== */
        @media (max-width: 768px) {
          .cq__bio-inner,
          .cq__champ-inner,
          .cq__media-inner,
          .cq__tom-inner,
          .cq__special-inner {
            grid-template-columns: 1fr;
            gap: 2rem;
          }
          .cq__bio-image img,
          .cq__champ-image img,
          .cq__special-image img {
            aspect-ratio: 16/9;
          }
          .cq__bio-stats {
            grid-template-columns: repeat(2, 1fr);
          }
          .cq__champ-awards {
            grid-template-columns: 1fr;
          }
          .cq__exp-nav {
            flex-wrap: wrap;
          }
          .cq__exp-tab {
            flex: 1 1 33.33%;
            border-bottom: 1px solid #e8e6e2;
          }
          .cq__exp-detail {
            grid-template-columns: 1fr;
          }
          .cq__exp-img {
            height: 250px;
          }
          .cq__parallax {
            height: 35vh;
          }
          .cq__hero {
            height: 80vh;
          }
        }

        @media (max-width: 500px) {
          .cq__exp-tab {
            flex: 1 1 50%;
          }
          .cq__bio-stats {
            grid-template-columns: 1fr 1fr;
          }
          .cq__cta-actions {
            flex-direction: column;
            align-items: center;
          }
        }
      `}</style>
    </div>
  );
}

export default CaptainQ;

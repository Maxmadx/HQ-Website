import { useRef } from 'react';
import { Link } from 'react-router-dom';
import { useInView } from 'framer-motion';

const departments = [
  {
    title: 'Flight Training',
    lead: 'Captain Q & Team',
    description: 'CAA-approved instructors led by a two-time World Champion. From your first trial lesson through PPL(H), type ratings, night ratings, and advanced autorotation courses — training at HQ is anything but ordinary.',
    img: '/assets/images/facility/hq-0153.jpg',
    link: '/training',
  },
  {
    title: 'Engineering',
    lead: 'Dave Cross & Team',
    description: 'Factory-trained Robinson engineers running one of the UK\'s busiest Part 145 maintenance facilities. From 100-hour inspections to full airframe rebuilds, our engineers keep aircraft flying safely across the country.',
    img: '/assets/images/facility/maintenance-.jpg',
    link: '/maintenance',
  },
  {
    title: 'Operations',
    lead: 'Nicola, Alex & Team',
    description: 'The team behind every smooth flight. Hangar movements, refuelling, bookings, and ground handling — our operations crew works seven days a week to ensure your helicopter is ready when you are.',
    img: '/assets/images/facility/hq-0254.jpg',
    link: '/contact',
  },
  {
    title: 'Sales & Expeditions',
    lead: 'HQ Aviation',
    description: 'New and pre-owned Robinson sales, brokerage, acquisition support, and pilot-led expeditions to the most extraordinary places on earth. From configuring a factory-new R66 to organising a flight to Iceland.',
    img: '/assets/images/facility/main-sales-pic.jpg',
    link: '/sales/new',
  },
];

function Team() {
  const heroRef = useRef(null);
  const heroInView = useInView(heroRef, { once: true, amount: 0.2 });
  const qRef = useRef(null);
  const qInView = useInView(qRef, { once: true, amount: 0.2 });
  const deptRef = useRef(null);
  const deptInView = useInView(deptRef, { once: true, amount: 0.1 });
  const cultureRef = useRef(null);
  const cultureInView = useInView(cultureRef, { once: true, amount: 0.2 });

  return (
    <div className="tm">

      {/* ===== HERO ===== */}
      <section className="tm__hero" ref={heroRef}>
        <div className="tm__hero-bg">
          <img src="/assets/images/team/british-helicopter-team.webp" alt="The HQ Aviation team" />
          <div className="tm__hero-overlay" />
        </div>
        <div className={`tm__hero-content ${heroInView ? 'tm__hero-content--visible' : ''}`}>
          <span className="tm__pretitle">HQ Aviation</span>
          <h1 className="tm__hero-title">
            <span>Our</span>
            <span>Team</span>
          </h1>
          <p className="tm__hero-sub">
            Close-knit. Experienced. Friendly. Groovy.
          </p>
        </div>
        <div className="tm__hero-scroll">
          <span>Scroll</span>
          <div className="tm__hero-scroll-line"><span /></div>
        </div>
      </section>


      {/* ===== CAPTAIN Q FEATURE ===== */}
      <section className="tm__q" ref={qRef}>
        <div className="tm__q-inner">
          <div className={`tm__q-image ${qInView ? 'tm__q-image--visible' : ''}`}>
            <img src="/assets/images/team/world-helicopter-champion-quentin-smith.webp" alt="Captain Quentin Smith" />
          </div>
          <div className={`tm__q-content ${qInView ? 'tm__q-content--visible' : ''}`}>
            <span className="tm__pretitle">The Founder</span>
            <h2 className="tm__section-title">Captain Quentin Smith</h2>
            <p className="tm__q-role">Founder & Chief Pilot</p>
            <p>
              Two-time World Aerobatics Champion. First to fly a helicopter to both Poles.
              The man who trained Tom Cruise. Over 12,000 hours as pilot-in-command across
              every continent. Q founded HQ Aviation at Denham Aerodrome to share the joy
              of flight with the world.
            </p>
            <p>
              His reputation and credibility attract the most exceptional group of people
              under one roof — from world-class engineers to pilots who share his passion
              for pushing the boundaries of what a Robinson helicopter can do.
            </p>
            <Link to="/about-us/captain-q" className="tm__link">
              Read Q's Full Story <span>&rarr;</span>
            </Link>
          </div>
        </div>
      </section>


      {/* ===== DEPARTMENTS ===== */}
      <section className="tm__parallax">
        <div className="tm__parallax-img">
          <img src="/assets/images/facility/busy-hangar.jpg" alt="HQ Aviation hangar" />
        </div>
        <h2 className="tm__parallax-title">The Departments</h2>
      </section>

      <section className="tm__dept" ref={deptRef}>
        <div className="tm__dept-inner">
          <div className="tm__section-header">
            <span className="tm__pretitle">Who We Are</span>
            <h2 className="tm__headline">
              <span>Four</span> <span>Pillars.</span> <span>One Team.</span>
            </h2>
          </div>

          <div className="tm__dept-grid">
            {departments.map((dept, i) => (
              <Link
                to={dept.link}
                key={i}
                className={`tm__dept-card ${deptInView ? 'tm__dept-card--visible' : ''}`}
                style={{ transitionDelay: `${i * 0.1}s` }}
              >
                <div className="tm__dept-img">
                  <img src={dept.img} alt={dept.title} />
                  <div className="tm__dept-img-overlay" />
                </div>
                <div className="tm__dept-body">
                  <span className="tm__dept-lead">{dept.lead}</span>
                  <h3 className="tm__dept-title">{dept.title}</h3>
                  <p className="tm__dept-desc">{dept.description}</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>


      {/* ===== CULTURE ===== */}
      <section className="tm__culture" ref={cultureRef}>
        <div className="tm__culture-inner">
          <div className={`tm__culture-content ${cultureInView ? 'tm__culture-content--visible' : ''}`}>
            <span className="tm__pretitle">The HQ Vibe</span>
            <h2 className="tm__section-title">Not a Flight School. A Clubhouse.</h2>
            <p>
              At HQ Aviation, you aren't just a student — you are a member of a community
              that shares a passion for high-end, experience-driven aviation. Our roots are
              clear: this is not a normal flight school and we don't try to be.
            </p>
            <p>
              The clubhouse atmosphere is a deliberate design feature. Having the engineering
              team on the ground floor of the main club allows students to watch helicopters
              being rebuilt, ask questions, and see past the panels into an aircraft. Former
              students who self-fly hire interact with new students, creating a support network
              around a shared passion.
            </p>
            <p>
              We've gone to car races, go-karting tracks, clay pigeon shooting. Aviation for
              private fliers shouldn't be clinical — it should be about hangar talk in the
              social spaces between flights.
            </p>
            <div className="tm__culture-stats">
              <div className="tm__culture-stat">
                <span className="tm__culture-stat-value">7</span>
                <span className="tm__culture-stat-label">Days a Week</span>
              </div>
              <div className="tm__culture-stat">
                <span className="tm__culture-stat-value">30+</span>
                <span className="tm__culture-stat-label">Years Experience</span>
              </div>
              <div className="tm__culture-stat">
                <span className="tm__culture-stat-value">4</span>
                <span className="tm__culture-stat-label">Departments</span>
              </div>
            </div>
          </div>
          <div className={`tm__culture-gallery ${cultureInView ? 'tm__culture-gallery--visible' : ''}`}>
            <img src="/assets/images/facility/hq-0696.jpg" alt="The HQ Aviation clubhouse" className="tm__culture-img-main" />
            <div className="tm__culture-img-row">
              <img src="/assets/images/gallery/events/img_1346.jpg" alt="HQ Aviation community" />
              <img src="/assets/images/facility/hq-0345.jpg" alt="Denham Aerodrome" />
            </div>
          </div>
        </div>
      </section>


      {/* ===== CTA ===== */}
      <section className="tm__cta">
        <div className="tm__cta-bg">
          <img src="/assets/images/gallery/flying/foggy-evening-flying.jpg" alt="" />
          <div className="tm__cta-overlay" />
        </div>
        <div className="tm__cta-content">
          <span className="tm__pretitle tm__pretitle--light">Join the Community</span>
          <h2 className="tm__cta-title">Your Adventure Starts Here</h2>
          <p className="tm__cta-desc">
            Whether you're here for a PPL or a global expedition, you're joining a family
            that supports your wildest dreams.
          </p>
          <div className="tm__cta-actions">
            <Link to="/training" className="tm__btn">Start Training</Link>
            <Link to="/contact" className="tm__btn tm__btn--ghost">Get in Touch</Link>
          </div>
        </div>
      </section>


      <style>{`
        .tm {
          font-family: 'Space Grotesk', -apple-system, sans-serif;
          color: #1a1a1a;
          background: #faf9f6;
        }

        /* ===== SHARED ===== */
        .tm__pretitle {
          font-family: 'Share Tech Mono', monospace;
          font-size: 0.7rem;
          letter-spacing: 0.2em;
          text-transform: uppercase;
          color: #999;
          display: block;
          margin-bottom: 0.75rem;
        }
        .tm__pretitle--light { color: rgba(255,255,255,0.5); }

        .tm__section-title {
          font-family: 'Space Grotesk', sans-serif;
          font-size: clamp(1.8rem, 4vw, 2.8rem);
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: -0.02em;
          margin: 0 0 1.5rem;
          color: #1a1a1a;
        }

        .tm__section-header {
          text-align: center;
          margin-bottom: 3rem;
        }
        .tm__section-header .tm__pretitle { margin-bottom: 1rem; }
        .tm__headline {
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
        .tm__headline span:nth-child(1) { color: #1a1a1a; }
        .tm__headline span:nth-child(2) { color: #4a4a4a; }
        .tm__headline span:nth-child(3) { color: #7a7a7a; }

        .tm__link {
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
          margin-top: 1rem;
          transition: border-color 0.3s ease;
        }
        .tm__link:hover { border-color: #1a1a1a; }


        /* ===== HERO ===== */
        .tm__hero {
          position: relative;
          height: 70vh;
          min-height: 500px;
          display: flex;
          align-items: center;
          justify-content: center;
          overflow: hidden;
        }
        .tm__hero-bg {
          position: absolute;
          inset: 0;
        }
        .tm__hero-bg img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }
        .tm__hero-overlay {
          position: absolute;
          inset: 0;
          background: linear-gradient(to bottom, rgba(0,0,0,0.3) 0%, rgba(0,0,0,0.6) 100%);
        }
        .tm__hero-content {
          position: relative;
          z-index: 2;
          text-align: center;
          color: #fff;
          padding: 2rem;
          opacity: 0;
          transform: translateY(20px);
          transition: opacity 0.8s ease, transform 0.8s cubic-bezier(0.16, 1, 0.3, 1);
        }
        .tm__hero-content--visible {
          opacity: 1;
          transform: translateY(0);
        }
        .tm__hero-title {
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
        .tm__hero-title span:nth-child(1) { color: #ffffff; }
        .tm__hero-title span:nth-child(2) { color: rgba(255,255,255,0.65); }
        .tm__hero-sub {
          font-size: 1rem;
          color: rgba(255,255,255,0.6);
          margin: 0;
          font-style: italic;
        }
        .tm__hero-scroll {
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
        .tm__hero-scroll > span {
          font-size: 0.65rem;
          text-transform: uppercase;
          letter-spacing: 0.2em;
          color: rgba(255,255,255,0.4);
        }
        .tm__hero-scroll-line {
          width: 1px;
          height: 50px;
          background: rgba(255,255,255,0.15);
          position: relative;
          overflow: hidden;
        }
        .tm__hero-scroll-line span {
          position: absolute;
          top: 0; left: 0;
          width: 100%; height: 30%;
          background: rgba(255,255,255,0.6);
          animation: tmScroll 2s ease-in-out infinite;
        }
        @keyframes tmScroll {
          0% { top: -30%; }
          100% { top: 100%; }
        }


        /* ===== CAPTAIN Q FEATURE ===== */
        .tm__q {
          padding: 6rem 2rem;
          background: #fff;
        }
        .tm__q-inner {
          max-width: 1100px;
          margin: 0 auto;
          display: grid;
          grid-template-columns: 0.8fr 1.2fr;
          gap: 4rem;
          align-items: start;
        }
        .tm__q-image {
          opacity: 0;
          transform: translateY(30px);
          transition: opacity 0.8s ease, transform 0.8s cubic-bezier(0.16, 1, 0.3, 1);
        }
        .tm__q-image--visible {
          opacity: 1;
          transform: translateY(0);
        }
        .tm__q-image img {
          width: 100%;
          aspect-ratio: 3/4;
          object-fit: cover;
        }
        .tm__q-content {
          padding-top: 1rem;
          opacity: 0;
          transform: translateY(30px);
          transition: opacity 0.8s ease 0.15s, transform 0.8s cubic-bezier(0.16, 1, 0.3, 1) 0.15s;
        }
        .tm__q-content--visible {
          opacity: 1;
          transform: translateY(0);
        }
        .tm__q-role {
          font-family: 'Share Tech Mono', monospace;
          font-size: 0.7rem;
          letter-spacing: 0.15em;
          text-transform: uppercase;
          color: #999;
          margin: -1rem 0 1.5rem;
        }
        .tm__q-content p {
          font-size: 1.05rem;
          line-height: 1.8;
          color: #666;
          margin: 0 0 1.25rem;
        }


        /* ===== PARALLAX ===== */
        .tm__parallax {
          position: relative;
          height: 50vh;
          min-height: 350px;
          overflow: hidden;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .tm__parallax-img {
          position: absolute;
          inset: -20% 0;
        }
        .tm__parallax-img img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }
        .tm__parallax-title {
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


        /* ===== DEPARTMENTS ===== */
        .tm__dept {
          padding: 6rem 2rem;
          background: #fff;
        }
        .tm__dept-inner {
          max-width: 1100px;
          margin: 0 auto;
        }
        .tm__dept-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 1px;
          background: #e8e6e2;
          border: 1px solid #e8e6e2;
        }
        .tm__dept-card {
          background: #fff;
          text-decoration: none;
          color: inherit;
          display: flex;
          flex-direction: column;
          opacity: 0;
          transform: translateY(20px);
          transition: opacity 0.6s ease, transform 0.6s cubic-bezier(0.16, 1, 0.3, 1), background 0.3s ease;
        }
        .tm__dept-card--visible {
          opacity: 1;
          transform: translateY(0);
        }
        .tm__dept-card:hover {
          background: #faf9f6;
        }
        .tm__dept-img {
          position: relative;
          height: 220px;
          overflow: hidden;
        }
        .tm__dept-img img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          transition: transform 0.6s ease;
        }
        .tm__dept-card:hover .tm__dept-img img {
          transform: scale(1.03);
        }
        .tm__dept-img-overlay {
          position: absolute;
          inset: 0;
          background: linear-gradient(to bottom, transparent 50%, rgba(0,0,0,0.1));
        }
        .tm__dept-body {
          padding: 1.5rem;
          flex: 1;
        }
        .tm__dept-lead {
          font-family: 'Share Tech Mono', monospace;
          font-size: 0.6rem;
          letter-spacing: 0.15em;
          text-transform: uppercase;
          color: #999;
          display: block;
          margin-bottom: 0.5rem;
        }
        .tm__dept-title {
          font-family: 'Space Grotesk', sans-serif;
          font-size: 1.15rem;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 0.02em;
          margin: 0 0 0.75rem;
        }
        .tm__dept-desc {
          font-size: 0.9rem;
          line-height: 1.7;
          color: #666;
          margin: 0;
        }


        /* ===== CULTURE ===== */
        .tm__culture {
          padding: 6rem 2rem;
          background: #faf9f6;
        }
        .tm__culture-inner {
          max-width: 1100px;
          margin: 0 auto;
          display: grid;
          grid-template-columns: 1.1fr 0.9fr;
          gap: 4rem;
          align-items: start;
        }
        .tm__culture-content {
          padding-top: 1rem;
          opacity: 0;
          transform: translateY(30px);
          transition: opacity 0.8s ease, transform 0.8s cubic-bezier(0.16, 1, 0.3, 1);
        }
        .tm__culture-content--visible {
          opacity: 1;
          transform: translateY(0);
        }
        .tm__culture-content p {
          font-size: 1.05rem;
          line-height: 1.8;
          color: #666;
          margin: 0 0 1.25rem;
        }
        .tm__culture-stats {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 1px;
          background: #e8e6e2;
          border: 1px solid #e8e6e2;
          margin-top: 2rem;
        }
        .tm__culture-stat {
          background: #faf9f6;
          text-align: center;
          padding: 1.25rem 0.5rem;
        }
        .tm__culture-stat-value {
          display: block;
          font-family: 'Share Tech Mono', monospace;
          font-size: 1.4rem;
          font-weight: 700;
          color: #1a1a1a;
          margin-bottom: 0.25rem;
        }
        .tm__culture-stat-label {
          font-size: 0.65rem;
          text-transform: uppercase;
          letter-spacing: 0.15em;
          color: #999;
        }
        .tm__culture-gallery {
          opacity: 0;
          transform: translateY(30px);
          transition: opacity 0.8s ease 0.15s, transform 0.8s cubic-bezier(0.16, 1, 0.3, 1) 0.15s;
        }
        .tm__culture-gallery--visible {
          opacity: 1;
          transform: translateY(0);
        }
        .tm__culture-img-main {
          width: 100%;
          aspect-ratio: 4/3;
          object-fit: cover;
          margin-bottom: 1px;
        }
        .tm__culture-img-row {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 1px;
        }
        .tm__culture-img-row img {
          width: 100%;
          aspect-ratio: 3/2;
          object-fit: cover;
        }


        /* ===== BUTTON ===== */
        .tm__btn {
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
        .tm__btn:hover { background: #f0f0f0; }
        .tm__btn--ghost {
          background: transparent;
          border: 1px solid rgba(255,255,255,0.4);
          color: #fff;
        }
        .tm__btn--ghost:hover {
          background: rgba(255,255,255,0.1);
          border-color: #fff;
        }


        /* ===== CTA ===== */
        .tm__cta {
          position: relative;
          min-height: 55vh;
          display: flex;
          align-items: center;
          justify-content: center;
          overflow: hidden;
        }
        .tm__cta-bg {
          position: absolute;
          inset: 0;
        }
        .tm__cta-bg img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }
        .tm__cta-overlay {
          position: absolute;
          inset: 0;
          background: rgba(0,0,0,0.6);
        }
        .tm__cta-content {
          position: relative;
          z-index: 2;
          text-align: center;
          color: #fff;
          padding: 4rem 2rem;
          max-width: 700px;
        }
        .tm__cta-title {
          font-family: 'Space Grotesk', sans-serif;
          font-size: clamp(2rem, 4vw, 3rem);
          font-weight: 700;
          text-transform: uppercase;
          margin: 0 0 1.5rem;
        }
        .tm__cta-desc {
          font-size: 1.05rem;
          line-height: 1.8;
          color: rgba(255,255,255,0.75);
          margin: 0 0 2.5rem;
        }
        .tm__cta-actions {
          display: flex;
          justify-content: center;
          gap: 1rem;
          flex-wrap: wrap;
        }


        /* ===== RESPONSIVE ===== */
        @media (max-width: 768px) {
          .tm__q-inner,
          .tm__culture-inner {
            grid-template-columns: 1fr;
            gap: 2rem;
          }
          .tm__q-image img {
            aspect-ratio: 16/9;
          }
          .tm__dept-grid {
            grid-template-columns: 1fr;
          }
          .tm__parallax {
            height: 35vh;
          }
          .tm__hero {
            height: 60vh;
          }
        }

        @media (max-width: 500px) {
          .tm__culture-stats {
            grid-template-columns: 1fr 1fr 1fr;
          }
          .tm__cta-actions {
            flex-direction: column;
            align-items: center;
          }
        }
      `}</style>
    </div>
  );
}

export default Team;

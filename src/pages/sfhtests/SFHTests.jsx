import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import Picker from './Picker';

/* ============================================================
   SELF-FLY HIRE SECTION — 20 DESIGN VARIATIONS
   Browse with Picker (arrow keys, F to favorite, M to minimize)
   ============================================================ */

// Shared data used across variations
const destinations = [
  { name: 'The Cotswolds', time: '35 min', carTime: '1h 45min', img: '/assets/images/destinations/cotswolds-aerial.jpg' },
  { name: 'Le Touquet', time: '55 min', carTime: '3h 30min', img: '/assets/images/destinations/le-touquet.jpg' },
  { name: 'Scottish Highlands', time: '2h 45min', carTime: '8h+', img: '/assets/images/destinations/scottish-highlands.jpg' },
  { name: 'Cornwall', time: '1h 30min', carTime: '4h 30min', img: '/assets/images/destinations/cornwall.jpg' },
];

const fleet = [
  { model: 'R22', seats: '2 Seats', rate: '£275/hr', img: '/assets/images/new-aircraft/r22/r22-red-volcano-front-alpha-v3.png', link: '/fleet/r22' },
  { model: 'R44', seats: '4 Seats', rate: '£395/hr', img: '/assets/images/new-aircraft/r44/raven-ii-front-alpha.png', link: '/fleet/r44', featured: true },
  { model: 'R66 Turbine', seats: '5 Seats', rate: '£595/hr', img: '/assets/images/new-aircraft/r66/blue-r66-palo-verde-left-v4.png', link: '/fleet/r66' },
];

// ─── VARIATION 1: Clean Minimal Grid ───
const V1 = () => (
  <div className="sfh-v1">
    <style>{`
      .sfh-v1 { background: #faf9f6; }
      .sfh-v1__dest { max-width: 1100px; margin: 0 auto; padding: 4rem 2rem; }
      .sfh-v1__dest-label { display: block; font-size: 0.7rem; text-transform: uppercase; letter-spacing: 0.25em; color: #999; text-align: center; margin-bottom: 2rem; }
      .sfh-v1__dest-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 1.5rem; }
      .sfh-v1__dest-card { border: 1px solid #e8e6e2; overflow: hidden; transition: all 0.3s ease; }
      .sfh-v1__dest-card:hover { border-color: #1a1a1a; transform: translateY(-4px); box-shadow: 0 12px 30px rgba(0,0,0,0.08); }
      .sfh-v1__dest-img { aspect-ratio: 4/3; overflow: hidden; }
      .sfh-v1__dest-img img { width: 100%; height: 100%; object-fit: cover; transition: transform 0.5s ease; }
      .sfh-v1__dest-card:hover img { transform: scale(1.05); }
      .sfh-v1__dest-info { padding: 1rem; display: flex; justify-content: space-between; align-items: center; }
      .sfh-v1__dest-name { font-family: 'Space Grotesk', sans-serif; font-size: 0.85rem; font-weight: 600; text-transform: uppercase; letter-spacing: 0.05em; color: #1a1a1a; }
      .sfh-v1__dest-time { font-family: 'Share Tech Mono', monospace; font-size: 0.85rem; color: #1a1a1a; }
      .sfh-v1__divider { width: 40px; height: 1px; background: #e8e6e2; margin: 0 auto; }
      .sfh-v1__fleet { max-width: 1000px; margin: 0 auto; padding: 4rem 2rem; }
      .sfh-v1__fleet-label { display: block; font-size: 0.7rem; text-transform: uppercase; letter-spacing: 0.25em; color: #999; text-align: center; margin-bottom: 2rem; }
      .sfh-v1__fleet-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 1.5rem; }
      .sfh-v1__fleet-card { background: #fff; border: 1px solid #e8e6e2; padding: 2rem; text-align: center; text-decoration: none; color: inherit; transition: all 0.3s ease; position: relative; }
      .sfh-v1__fleet-card:hover { border-color: #1a1a1a; transform: translateY(-4px); box-shadow: 0 12px 30px rgba(0,0,0,0.08); }
      .sfh-v1__fleet-card--featured { border-color: #1a1a1a; }
      .sfh-v1__fleet-badge { position: absolute; top: 1rem; right: 1rem; font-size: 0.55rem; text-transform: uppercase; letter-spacing: 0.05em; background: #1a1a1a; color: #fff; padding: 0.2rem 0.5rem; }
      .sfh-v1__fleet-img { height: 100px; display: flex; align-items: center; justify-content: center; margin-bottom: 1rem; }
      .sfh-v1__fleet-img img { max-width: 100%; max-height: 100%; object-fit: contain; }
      .sfh-v1__fleet-model { font-family: 'Space Grotesk', sans-serif; font-size: 1.2rem; font-weight: 700; text-transform: uppercase; margin: 0 0 0.25rem; color: #1a1a1a; }
      .sfh-v1__fleet-seats { font-size: 0.75rem; color: #666; margin-bottom: 0.25rem; }
      .sfh-v1__fleet-rate { font-family: 'Share Tech Mono', monospace; font-size: 0.85rem; color: #1a1a1a; }
      .sfh-v1__quote { max-width: 700px; margin: 0 auto; padding: 4rem 2rem; text-align: center; }
      .sfh-v1__quote blockquote { font-family: 'Space Grotesk', sans-serif; font-size: 1.3rem; font-weight: 400; color: #1a1a1a; line-height: 1.7; margin: 0; font-style: italic; }
      .sfh-v1__quote-attr { display: block; font-size: 0.7rem; text-transform: uppercase; letter-spacing: 0.2em; color: #999; margin-top: 1.5rem; }
      .sfh-v1__cta { text-align: center; padding: 0 2rem 5rem; }
      .sfh-v1__cta-btn { display: inline-block; padding: 1rem 2.5rem; background: #1a1a1a; color: #fff; text-decoration: none; font-size: 0.75rem; text-transform: uppercase; letter-spacing: 0.1em; transition: background 0.3s ease; }
      .sfh-v1__cta-btn:hover { background: #333; }
    `}</style>
    <div className="sfh-v1__dest">
      <span className="sfh-v1__dest-label">Where Will You Fly?</span>
      <div className="sfh-v1__dest-grid">
        {destinations.map(d => (
          <div key={d.name} className="sfh-v1__dest-card">
            <div className="sfh-v1__dest-img"><img src={d.img} alt={d.name} /></div>
            <div className="sfh-v1__dest-info">
              <span className="sfh-v1__dest-name">{d.name}</span>
              <span className="sfh-v1__dest-time">{d.time}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
    <div className="sfh-v1__divider" />
    <div className="sfh-v1__fleet">
      <span className="sfh-v1__fleet-label">Our Fleet</span>
      <div className="sfh-v1__fleet-grid">
        {fleet.map(f => (
          <Link key={f.model} to={f.link} className={`sfh-v1__fleet-card ${f.featured ? 'sfh-v1__fleet-card--featured' : ''}`}>
            {f.featured && <span className="sfh-v1__fleet-badge">Most Popular</span>}
            <div className="sfh-v1__fleet-img"><img src={f.img} alt={f.model} /></div>
            <h4 className="sfh-v1__fleet-model">{f.model}</h4>
            <span className="sfh-v1__fleet-seats">{f.seats}</span>
            <span className="sfh-v1__fleet-rate">From {f.rate}</span>
          </Link>
        ))}
      </div>
    </div>
    <div className="sfh-v1__quote">
      <blockquote>"The helicopter isn't just transport — it's a lifestyle. Land at the golf course, arrive at the races, reach your country house for lunch and still be back in London for dinner."</blockquote>
      <span className="sfh-v1__quote-attr">— The Freedom of Flight</span>
    </div>
    <div className="sfh-v1__cta">
      <Link to="/contact?subject=hire" className="sfh-v1__cta-btn">Enquire About Hire</Link>
    </div>
  </div>
);

// ─── VARIATION 2: Dark Immersive Destinations ───
const V2 = () => (
  <div className="sfh-v2">
    <style>{`
      .sfh-v2__dest { background: #1a1a1a; padding: 3rem 2rem; }
      .sfh-v2__dest-header { max-width: 1100px; margin: 0 auto 1.5rem; display: flex; justify-content: space-between; align-items: center; }
      .sfh-v2__dest-label { font-family: 'Space Grotesk', sans-serif; font-size: 0.65rem; text-transform: uppercase; letter-spacing: 0.15em; color: rgba(255,255,255,0.5); }
      .sfh-v2__dest-legend { font-size: 0.6rem; color: rgba(255,255,255,0.4); display: flex; gap: 1rem; align-items: center; }
      .sfh-v2__dest-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 0.75rem; max-width: 1100px; margin: 0 auto; }
      .sfh-v2__dest-card { position: relative; border-radius: 8px; overflow: hidden; cursor: pointer; }
      .sfh-v2__dest-card:hover img { transform: scale(1.08); }
      .sfh-v2__dest-img { aspect-ratio: 3/4; overflow: hidden; }
      .sfh-v2__dest-img img { width: 100%; height: 100%; object-fit: cover; transition: transform 0.5s ease; }
      .sfh-v2__dest-overlay { position: absolute; inset: 0; background: linear-gradient(to top, rgba(0,0,0,0.7) 0%, rgba(0,0,0,0.1) 50%, transparent); }
      .sfh-v2__dest-content { position: absolute; bottom: 0; left: 0; right: 0; padding: 1.25rem; }
      .sfh-v2__dest-name { display: block; font-family: 'Space Grotesk', sans-serif; font-size: 1rem; font-weight: 700; color: #fff; text-transform: uppercase; letter-spacing: 0.05em; }
      .sfh-v2__dest-time { display: block; font-family: 'Share Tech Mono', monospace; font-size: 1.5rem; color: #fff; margin-top: 0.25rem; }
      .sfh-v2__dest-car { font-size: 0.6rem; color: rgba(255,255,255,0.4); margin-top: 0.15rem; }
      .sfh-v2__fleet { background: #faf9f6; padding: 5rem 2rem; }
      .sfh-v2__fleet-inner { max-width: 1000px; margin: 0 auto; display: grid; grid-template-columns: 1fr 1.5fr; gap: 4rem; align-items: center; }
      .sfh-v2__fleet-text h3 { font-family: 'Space Grotesk', sans-serif; font-size: clamp(1.5rem, 3vw, 2.2rem); font-weight: 700; text-transform: uppercase; color: #1a1a1a; margin: 0 0 1rem; line-height: 1.1; }
      .sfh-v2__fleet-text p { font-size: 1rem; color: #666; line-height: 1.7; margin: 0 0 1.5rem; }
      .sfh-v2__fleet-cards { display: flex; flex-direction: column; gap: 1rem; }
      .sfh-v2__fleet-row { display: flex; align-items: center; gap: 1.5rem; padding: 1.25rem; background: #fff; border: 1px solid #e8e6e2; text-decoration: none; color: inherit; transition: all 0.3s ease; }
      .sfh-v2__fleet-row:hover { border-color: #1a1a1a; box-shadow: 0 8px 24px rgba(0,0,0,0.06); }
      .sfh-v2__fleet-row img { width: 80px; height: 50px; object-fit: contain; }
      .sfh-v2__fleet-row-model { font-family: 'Space Grotesk', sans-serif; font-weight: 700; font-size: 1rem; text-transform: uppercase; color: #1a1a1a; }
      .sfh-v2__fleet-row-meta { font-size: 0.75rem; color: #888; margin-top: 0.15rem; }
      .sfh-v2__fleet-row-rate { margin-left: auto; font-family: 'Share Tech Mono', monospace; font-size: 0.9rem; color: #1a1a1a; }
      .sfh-v2__cta { background: #faf9f6; text-align: center; padding: 0 2rem 5rem; }
      .sfh-v2__cta-btn { display: inline-block; padding: 1rem 2.5rem; background: #1a1a1a; color: #fff; text-decoration: none; font-size: 0.75rem; text-transform: uppercase; letter-spacing: 0.1em; transition: background 0.3s; }
      .sfh-v2__cta-btn:hover { background: #333; }
    `}</style>
    <div className="sfh-v2__dest">
      <div className="sfh-v2__dest-header">
        <span className="sfh-v2__dest-label">Journey Time by Helicopter</span>
        <span className="sfh-v2__dest-legend">From Denham Aerodrome</span>
      </div>
      <div className="sfh-v2__dest-grid">
        {destinations.map(d => (
          <div key={d.name} className="sfh-v2__dest-card">
            <div className="sfh-v2__dest-img"><img src={d.img} alt={d.name} /></div>
            <div className="sfh-v2__dest-overlay" />
            <div className="sfh-v2__dest-content">
              <span className="sfh-v2__dest-name">{d.name}</span>
              <span className="sfh-v2__dest-time">{d.time}</span>
              <span className="sfh-v2__dest-car">vs {d.carTime} by car</span>
            </div>
          </div>
        ))}
      </div>
    </div>
    <div className="sfh-v2__fleet">
      <div className="sfh-v2__fleet-inner">
        <div className="sfh-v2__fleet-text">
          <h3>Choose Your Aircraft</h3>
          <p>From training-grade R22s to turbine-powered R66s. Each helicopter maintained in-house, fuelled, washed and ready on the pad.</p>
        </div>
        <div className="sfh-v2__fleet-cards">
          {fleet.map(f => (
            <Link key={f.model} to={f.link} className="sfh-v2__fleet-row">
              <img src={f.img} alt={f.model} />
              <div>
                <div className="sfh-v2__fleet-row-model">{f.model}</div>
                <div className="sfh-v2__fleet-row-meta">{f.seats}</div>
              </div>
              <span className="sfh-v2__fleet-row-rate">From {f.rate}</span>
            </Link>
          ))}
        </div>
      </div>
    </div>
    <div className="sfh-v2__cta">
      <Link to="/contact?subject=hire" className="sfh-v2__cta-btn">Check Availability</Link>
    </div>
  </div>
);

// ─── VARIATION 3: Horizontal Destination Strip + Fleet Hero ───
const V3 = () => (
  <div className="sfh-v3">
    <style>{`
      .sfh-v3 { background: #faf9f6; }
      .sfh-v3__dest { padding: 4rem 0; overflow: hidden; }
      .sfh-v3__dest-label { display: block; font-size: 0.7rem; text-transform: uppercase; letter-spacing: 0.25em; color: #999; text-align: center; margin-bottom: 2rem; }
      .sfh-v3__dest-scroll { display: flex; gap: 1.25rem; overflow-x: auto; scroll-snap-type: x mandatory; padding: 0 2rem 1rem; -webkit-overflow-scrolling: touch; scrollbar-width: none; }
      .sfh-v3__dest-scroll::-webkit-scrollbar { display: none; }
      .sfh-v3__dest-card { flex: 0 0 300px; scroll-snap-align: start; position: relative; border-radius: 12px; overflow: hidden; }
      .sfh-v3__dest-card img { width: 100%; height: 200px; object-fit: cover; transition: transform 0.5s ease; }
      .sfh-v3__dest-card:hover img { transform: scale(1.05); }
      .sfh-v3__dest-overlay { position: absolute; inset: 0; background: linear-gradient(to top, rgba(0,0,0,0.6) 0%, transparent 60%); pointer-events: none; }
      .sfh-v3__dest-content { position: absolute; bottom: 0; left: 0; right: 0; padding: 1.25rem; display: flex; justify-content: space-between; align-items: flex-end; }
      .sfh-v3__dest-name { font-family: 'Space Grotesk', sans-serif; font-size: 0.9rem; font-weight: 600; color: #fff; text-transform: uppercase; }
      .sfh-v3__dest-time { font-family: 'Share Tech Mono', monospace; font-size: 1.1rem; color: #fff; background: rgba(255,255,255,0.15); padding: 0.25rem 0.5rem; border-radius: 4px; backdrop-filter: blur(4px); }
      .sfh-v3__fleet-hero { max-width: 1100px; margin: 0 auto; padding: 4rem 2rem; display: grid; grid-template-columns: 1.2fr 1fr; gap: 3rem; align-items: center; }
      .sfh-v3__fleet-featured { background: #fff; border: 1px solid #e8e6e2; padding: 3rem; text-align: center; position: relative; }
      .sfh-v3__fleet-featured-badge { position: absolute; top: 1rem; left: 1rem; font-size: 0.55rem; text-transform: uppercase; letter-spacing: 0.1em; background: #1a1a1a; color: #fff; padding: 0.3rem 0.6rem; }
      .sfh-v3__fleet-featured img { max-width: 100%; height: 140px; object-fit: contain; margin-bottom: 1.5rem; }
      .sfh-v3__fleet-featured h4 { font-family: 'Space Grotesk', sans-serif; font-size: 1.8rem; font-weight: 700; text-transform: uppercase; margin: 0 0 0.5rem; color: #1a1a1a; }
      .sfh-v3__fleet-featured-meta { font-size: 0.85rem; color: #666; }
      .sfh-v3__fleet-featured-rate { display: block; font-family: 'Share Tech Mono', monospace; font-size: 1.2rem; color: #1a1a1a; margin-top: 0.75rem; }
      .sfh-v3__fleet-side { display: flex; flex-direction: column; gap: 1.25rem; }
      .sfh-v3__fleet-small { display: flex; align-items: center; gap: 1.5rem; padding: 1.25rem; border: 1px solid #e8e6e2; background: #fff; text-decoration: none; color: inherit; transition: all 0.3s ease; }
      .sfh-v3__fleet-small:hover { border-color: #1a1a1a; }
      .sfh-v3__fleet-small img { width: 80px; height: 55px; object-fit: contain; }
      .sfh-v3__fleet-small-model { font-family: 'Space Grotesk', sans-serif; font-weight: 700; text-transform: uppercase; color: #1a1a1a; font-size: 1rem; }
      .sfh-v3__fleet-small-info { font-size: 0.75rem; color: #888; }
      .sfh-v3__fleet-small-rate { font-family: 'Share Tech Mono', monospace; font-size: 0.85rem; color: #1a1a1a; margin-top: 0.25rem; }
      .sfh-v3__bottom { max-width: 700px; margin: 0 auto; padding: 3rem 2rem 5rem; text-align: center; }
      .sfh-v3__bottom blockquote { font-size: 1.15rem; color: #4a4a4a; line-height: 1.7; margin: 0 0 2rem; font-style: italic; }
      .sfh-v3__bottom-btn { display: inline-block; padding: 1rem 2.5rem; background: #1a1a1a; color: #fff; text-decoration: none; font-size: 0.75rem; text-transform: uppercase; letter-spacing: 0.1em; transition: background 0.3s; }
      .sfh-v3__bottom-btn:hover { background: #333; }
    `}</style>
    <div className="sfh-v3__dest">
      <span className="sfh-v3__dest-label">Destinations from Denham</span>
      <div className="sfh-v3__dest-scroll">
        {[...destinations, ...destinations].map((d, i) => (
          <div key={i} className="sfh-v3__dest-card">
            <img src={d.img} alt={d.name} />
            <div className="sfh-v3__dest-overlay" />
            <div className="sfh-v3__dest-content">
              <span className="sfh-v3__dest-name">{d.name}</span>
              <span className="sfh-v3__dest-time">{d.time}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
    <div className="sfh-v3__fleet-hero">
      <Link to="/fleet/r44" className="sfh-v3__fleet-featured" style={{ textDecoration: 'none', color: 'inherit' }}>
        <span className="sfh-v3__fleet-featured-badge">Most Popular</span>
        <img src={fleet[1].img} alt="R44" />
        <h4>R44</h4>
        <span className="sfh-v3__fleet-featured-meta">4 Seats</span>
        <span className="sfh-v3__fleet-featured-rate">From £395/hr</span>
      </Link>
      <div className="sfh-v3__fleet-side">
        {fleet.filter(f => !f.featured).map(f => (
          <Link key={f.model} to={f.link} className="sfh-v3__fleet-small">
            <img src={f.img} alt={f.model} />
            <div>
              <div className="sfh-v3__fleet-small-model">{f.model}</div>
              <div className="sfh-v3__fleet-small-info">{f.seats}</div>
              <div className="sfh-v3__fleet-small-rate">From {f.rate}</div>
            </div>
          </Link>
        ))}
      </div>
    </div>
    <div className="sfh-v3__bottom">
      <blockquote>"Land at the golf course, arrive at the races, reach your country house for lunch and still be back in London for dinner."</blockquote>
      <Link to="/contact?subject=hire" className="sfh-v3__bottom-btn">Enquire About Hire</Link>
    </div>
  </div>
);

// ─── VARIATION 4: Technical Instrument Panel ───
const V4 = () => (
  <div className="sfh-v4">
    <style>{`
      .sfh-v4 { background: #faf9f6; }
      .sfh-v4__panel { max-width: 1100px; margin: 0 auto; padding: 4rem 2rem; }
      .sfh-v4__panel-label { display: block; font-family: 'Share Tech Mono', monospace; font-size: 0.6rem; text-transform: uppercase; letter-spacing: 0.15em; color: #999; margin-bottom: 2.5rem; }
      .sfh-v4__routes { border: 1px solid #e8e6e2; }
      .sfh-v4__route-header { display: grid; grid-template-columns: 2fr 1fr 1fr 1fr; padding: 0.75rem 1.25rem; background: #1a1a1a; }
      .sfh-v4__route-header span { font-family: 'Share Tech Mono', monospace; font-size: 0.6rem; text-transform: uppercase; letter-spacing: 0.1em; color: rgba(255,255,255,0.5); }
      .sfh-v4__route-row { display: grid; grid-template-columns: 2fr 1fr 1fr 1fr; padding: 1rem 1.25rem; border-bottom: 1px solid #e8e6e2; align-items: center; transition: background 0.2s; }
      .sfh-v4__route-row:last-child { border-bottom: none; }
      .sfh-v4__route-row:hover { background: #f5f5f2; }
      .sfh-v4__route-dest { font-family: 'Space Grotesk', sans-serif; font-size: 0.9rem; font-weight: 600; text-transform: uppercase; color: #1a1a1a; }
      .sfh-v4__route-heli { font-family: 'Share Tech Mono', monospace; font-size: 1rem; color: #1a1a1a; font-weight: 700; }
      .sfh-v4__route-car { font-family: 'Share Tech Mono', monospace; font-size: 0.85rem; color: #999; text-decoration: line-through; }
      .sfh-v4__route-saved { font-size: 0.65rem; color: #22c55e; font-weight: 600; background: rgba(34,197,94,0.1); padding: 0.2rem 0.5rem; border-radius: 4px; display: inline-block; }
      .sfh-v4__specs { margin-top: 4rem; }
      .sfh-v4__specs-label { display: block; font-family: 'Share Tech Mono', monospace; font-size: 0.6rem; text-transform: uppercase; letter-spacing: 0.15em; color: #999; margin-bottom: 2rem; }
      .sfh-v4__specs-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 0; border: 1px solid #e8e6e2; }
      .sfh-v4__spec-card { padding: 2rem; text-align: center; text-decoration: none; color: inherit; border-right: 1px solid #e8e6e2; transition: background 0.3s; }
      .sfh-v4__spec-card:last-child { border-right: none; }
      .sfh-v4__spec-card:hover { background: #f5f5f2; }
      .sfh-v4__spec-img { height: 90px; display: flex; align-items: center; justify-content: center; margin-bottom: 1.5rem; }
      .sfh-v4__spec-img img { max-height: 100%; object-fit: contain; }
      .sfh-v4__spec-model { font-family: 'Space Grotesk', sans-serif; font-size: 1.4rem; font-weight: 700; text-transform: uppercase; color: #1a1a1a; margin-bottom: 1rem; }
      .sfh-v4__spec-data { display: grid; grid-template-columns: 1fr 1fr; gap: 0.5rem; text-align: left; max-width: 200px; margin: 0 auto; }
      .sfh-v4__spec-key { font-family: 'Share Tech Mono', monospace; font-size: 0.6rem; text-transform: uppercase; letter-spacing: 0.1em; color: #999; }
      .sfh-v4__spec-val { font-family: 'Share Tech Mono', monospace; font-size: 0.75rem; color: #1a1a1a; text-align: right; }
      .sfh-v4__cta { text-align: center; padding: 3rem 2rem 5rem; }
      .sfh-v4__cta-btn { display: inline-block; padding: 1rem 2.5rem; border: 2px solid #1a1a1a; color: #1a1a1a; text-decoration: none; font-size: 0.75rem; text-transform: uppercase; letter-spacing: 0.1em; transition: all 0.3s; background: transparent; }
      .sfh-v4__cta-btn:hover { background: #1a1a1a; color: #fff; }
    `}</style>
    <div className="sfh-v4__panel">
      <span className="sfh-v4__panel-label">// ROUTE_DATA — FLIGHT_TIMES_FROM_DENHAM</span>
      <div className="sfh-v4__routes">
        <div className="sfh-v4__route-header">
          <span>Destination</span>
          <span>Helicopter</span>
          <span>By Car</span>
          <span>Time Saved</span>
        </div>
        {destinations.map(d => (
          <div key={d.name} className="sfh-v4__route-row">
            <span className="sfh-v4__route-dest">{d.name}</span>
            <span className="sfh-v4__route-heli">{d.time}</span>
            <span className="sfh-v4__route-car">{d.carTime}</span>
            <span className="sfh-v4__route-saved">FASTER</span>
          </div>
        ))}
      </div>
      <div className="sfh-v4__specs">
        <span className="sfh-v4__specs-label">// FLEET_MANIFEST — AVAILABLE_AIRCRAFT</span>
        <div className="sfh-v4__specs-grid">
          {fleet.map(f => (
            <Link key={f.model} to={f.link} className="sfh-v4__spec-card">
              <div className="sfh-v4__spec-img"><img src={f.img} alt={f.model} /></div>
              <div className="sfh-v4__spec-model">{f.model}</div>
              <div className="sfh-v4__spec-data">
                <span className="sfh-v4__spec-key">Seats</span>
                <span className="sfh-v4__spec-val">{f.seats.replace(' Seats','')}</span>
                <span className="sfh-v4__spec-key">Rate</span>
                <span className="sfh-v4__spec-val">{f.rate}</span>
                <span className="sfh-v4__spec-key">Status</span>
                <span className="sfh-v4__spec-val" style={{ color: '#22c55e' }}>AVAIL</span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
    <div className="sfh-v4__cta">
      <Link to="/contact?subject=hire" className="sfh-v4__cta-btn">Request Aircraft Availability</Link>
    </div>
  </div>
);

// ─── VARIATION 5: Magazine Editorial Layout ───
const V5 = () => (
  <div className="sfh-v5">
    <style>{`
      .sfh-v5 { background: #faf9f6; }
      .sfh-v5__editorial { max-width: 1100px; margin: 0 auto; padding: 4rem 2rem; display: grid; grid-template-columns: 1.5fr 1fr; gap: 1.5rem; }
      .sfh-v5__feat-dest { position: relative; border-radius: 8px; overflow: hidden; grid-row: span 2; }
      .sfh-v5__feat-dest img { width: 100%; height: 100%; object-fit: cover; min-height: 400px; }
      .sfh-v5__feat-dest-overlay { position: absolute; inset: 0; background: linear-gradient(to top, rgba(0,0,0,0.7) 0%, rgba(0,0,0,0.2) 40%, transparent); }
      .sfh-v5__feat-dest-content { position: absolute; bottom: 0; left: 0; right: 0; padding: 2rem; }
      .sfh-v5__feat-dest-name { font-family: 'Space Grotesk', sans-serif; font-size: 1.8rem; font-weight: 700; color: #fff; text-transform: uppercase; display: block; }
      .sfh-v5__feat-dest-time { font-family: 'Share Tech Mono', monospace; font-size: 2.5rem; color: #fff; display: block; margin-top: 0.5rem; }
      .sfh-v5__feat-dest-sub { font-size: 0.75rem; color: rgba(255,255,255,0.6); }
      .sfh-v5__side-dest { position: relative; border-radius: 8px; overflow: hidden; }
      .sfh-v5__side-dest img { width: 100%; height: 100%; object-fit: cover; min-height: 180px; }
      .sfh-v5__side-dest-overlay { position: absolute; inset: 0; background: linear-gradient(to top, rgba(0,0,0,0.6) 0%, transparent 60%); }
      .sfh-v5__side-dest-content { position: absolute; bottom: 0; left: 0; right: 0; padding: 1.25rem; display: flex; justify-content: space-between; align-items: flex-end; }
      .sfh-v5__side-dest-name { font-family: 'Space Grotesk', sans-serif; font-size: 0.85rem; font-weight: 600; color: #fff; text-transform: uppercase; }
      .sfh-v5__side-dest-time { font-family: 'Share Tech Mono', monospace; font-size: 1rem; color: #fff; }
      .sfh-v5__fleet-strip { background: #fff; border-top: 1px solid #e8e6e2; border-bottom: 1px solid #e8e6e2; }
      .sfh-v5__fleet-inner { max-width: 1100px; margin: 0 auto; padding: 3rem 2rem; display: flex; align-items: center; gap: 3rem; }
      .sfh-v5__fleet-title { font-family: 'Space Grotesk', sans-serif; font-size: 0.7rem; text-transform: uppercase; letter-spacing: 0.25em; color: #999; white-space: nowrap; }
      .sfh-v5__fleet-row { display: flex; gap: 2rem; flex: 1; justify-content: center; }
      .sfh-v5__fleet-item { text-decoration: none; color: inherit; text-align: center; transition: transform 0.3s; }
      .sfh-v5__fleet-item:hover { transform: translateY(-4px); }
      .sfh-v5__fleet-item img { height: 60px; object-fit: contain; margin-bottom: 0.5rem; }
      .sfh-v5__fleet-item-name { display: block; font-family: 'Space Grotesk', sans-serif; font-size: 0.85rem; font-weight: 700; text-transform: uppercase; color: #1a1a1a; }
      .sfh-v5__fleet-item-rate { display: block; font-family: 'Share Tech Mono', monospace; font-size: 0.7rem; color: #888; }
      .sfh-v5__lifestyle { max-width: 800px; margin: 0 auto; padding: 5rem 2rem; display: grid; grid-template-columns: auto 1fr; gap: 2rem; align-items: start; }
      .sfh-v5__lifestyle-line { width: 1px; height: 100%; background: linear-gradient(to bottom, #e8e6e2, transparent); margin-top: 0.5rem; }
      .sfh-v5__lifestyle-text { font-family: 'Space Grotesk', sans-serif; font-size: 1.5rem; font-weight: 400; color: #4a4a4a; line-height: 1.6; }
      .sfh-v5__lifestyle-attr { display: block; font-size: 0.7rem; text-transform: uppercase; letter-spacing: 0.2em; color: #999; margin-top: 1.5rem; }
      .sfh-v5__cta-bar { text-align: center; padding: 0 2rem 5rem; }
      .sfh-v5__cta-btn { display: inline-block; padding: 1rem 3rem; background: #1a1a1a; color: #fff; text-decoration: none; font-size: 0.75rem; text-transform: uppercase; letter-spacing: 0.1em; }
      .sfh-v5__cta-btn:hover { background: #333; }
    `}</style>
    <div className="sfh-v5__editorial">
      <div className="sfh-v5__feat-dest">
        <img src={destinations[2].img} alt={destinations[2].name} />
        <div className="sfh-v5__feat-dest-overlay" />
        <div className="sfh-v5__feat-dest-content">
          <span className="sfh-v5__feat-dest-name">{destinations[2].name}</span>
          <span className="sfh-v5__feat-dest-time">{destinations[2].time}</span>
          <span className="sfh-v5__feat-dest-sub">vs {destinations[2].carTime} by car</span>
        </div>
      </div>
      {destinations.filter((_, i) => i !== 2).slice(0, 2).map(d => (
        <div key={d.name} className="sfh-v5__side-dest">
          <img src={d.img} alt={d.name} />
          <div className="sfh-v5__side-dest-overlay" />
          <div className="sfh-v5__side-dest-content">
            <span className="sfh-v5__side-dest-name">{d.name}</span>
            <span className="sfh-v5__side-dest-time">{d.time}</span>
          </div>
        </div>
      ))}
    </div>
    <div className="sfh-v5__fleet-strip">
      <div className="sfh-v5__fleet-inner">
        <span className="sfh-v5__fleet-title">Our Fleet</span>
        <div className="sfh-v5__fleet-row">
          {fleet.map(f => (
            <Link key={f.model} to={f.link} className="sfh-v5__fleet-item">
              <img src={f.img} alt={f.model} />
              <span className="sfh-v5__fleet-item-name">{f.model}</span>
              <span className="sfh-v5__fleet-item-rate">From {f.rate}</span>
            </Link>
          ))}
        </div>
      </div>
    </div>
    <div className="sfh-v5__lifestyle">
      <div className="sfh-v5__lifestyle-line" />
      <div>
        <div className="sfh-v5__lifestyle-text">"The helicopter isn't just transport — it's a lifestyle. Land at the golf course, arrive at the races, reach your country house for lunch."</div>
        <span className="sfh-v5__lifestyle-attr">— The Freedom of Flight</span>
      </div>
    </div>
    <div className="sfh-v5__cta-bar">
      <Link to="/contact?subject=hire" className="sfh-v5__cta-btn">Book Your Aircraft</Link>
    </div>
  </div>
);

// ─── VARIATION 6: All-Dark Luxury ───
const V6 = () => (
  <div className="sfh-v6">
    <style>{`
      .sfh-v6 { background: #111; color: #fff; }
      .sfh-v6__dest { max-width: 1100px; margin: 0 auto; padding: 4rem 2rem; }
      .sfh-v6__dest-label { display: block; font-size: 0.65rem; text-transform: uppercase; letter-spacing: 0.3em; color: rgba(255,255,255,0.35); text-align: center; margin-bottom: 2.5rem; }
      .sfh-v6__dest-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 1rem; }
      .sfh-v6__dest-card { border: 1px solid rgba(255,255,255,0.1); padding: 1.5rem; text-align: center; transition: all 0.3s; }
      .sfh-v6__dest-card:hover { border-color: rgba(255,255,255,0.3); background: rgba(255,255,255,0.03); }
      .sfh-v6__dest-name { display: block; font-family: 'Space Grotesk', sans-serif; font-size: 0.8rem; font-weight: 600; text-transform: uppercase; letter-spacing: 0.1em; color: rgba(255,255,255,0.6); margin-bottom: 0.75rem; }
      .sfh-v6__dest-time { display: block; font-family: 'Share Tech Mono', monospace; font-size: 2rem; color: #fff; }
      .sfh-v6__dest-car { display: block; font-size: 0.6rem; color: rgba(255,255,255,0.25); margin-top: 0.5rem; }
      .sfh-v6__divider { width: 1px; height: 60px; background: linear-gradient(to bottom, transparent, rgba(255,255,255,0.15), transparent); margin: 0 auto; }
      .sfh-v6__fleet { max-width: 1000px; margin: 0 auto; padding: 4rem 2rem; }
      .sfh-v6__fleet-label { display: block; font-size: 0.65rem; text-transform: uppercase; letter-spacing: 0.3em; color: rgba(255,255,255,0.35); text-align: center; margin-bottom: 2.5rem; }
      .sfh-v6__fleet-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 1.5rem; }
      .sfh-v6__fleet-card { border: 1px solid rgba(255,255,255,0.1); padding: 2rem; text-align: center; text-decoration: none; color: inherit; transition: all 0.3s; }
      .sfh-v6__fleet-card:hover { border-color: rgba(255,255,255,0.3); }
      .sfh-v6__fleet-img { height: 90px; display: flex; align-items: center; justify-content: center; margin-bottom: 1.5rem; }
      .sfh-v6__fleet-img img { max-height: 100%; object-fit: contain; filter: brightness(0) invert(1); opacity: 0.9; }
      .sfh-v6__fleet-model { font-family: 'Space Grotesk', sans-serif; font-size: 1.3rem; font-weight: 700; text-transform: uppercase; color: #fff; margin-bottom: 0.5rem; }
      .sfh-v6__fleet-meta { font-size: 0.75rem; color: rgba(255,255,255,0.4); }
      .sfh-v6__fleet-rate { display: block; font-family: 'Share Tech Mono', monospace; font-size: 1rem; color: rgba(255,255,255,0.8); margin-top: 0.75rem; }
      .sfh-v6__quote { max-width: 600px; margin: 0 auto; padding: 4rem 2rem; text-align: center; }
      .sfh-v6__quote blockquote { font-size: 1.2rem; color: rgba(255,255,255,0.6); line-height: 1.8; margin: 0; font-style: italic; }
      .sfh-v6__cta { text-align: center; padding: 2rem 2rem 5rem; }
      .sfh-v6__cta-btn { display: inline-block; padding: 1rem 3rem; border: 1px solid rgba(255,255,255,0.3); color: #fff; text-decoration: none; font-size: 0.75rem; text-transform: uppercase; letter-spacing: 0.15em; transition: all 0.3s; background: transparent; }
      .sfh-v6__cta-btn:hover { background: #fff; color: #111; }
    `}</style>
    <div className="sfh-v6__dest">
      <span className="sfh-v6__dest-label">Flight Times from Denham</span>
      <div className="sfh-v6__dest-grid">
        {destinations.map(d => (
          <div key={d.name} className="sfh-v6__dest-card">
            <span className="sfh-v6__dest-name">{d.name}</span>
            <span className="sfh-v6__dest-time">{d.time}</span>
            <span className="sfh-v6__dest-car">{d.carTime} by car</span>
          </div>
        ))}
      </div>
    </div>
    <div className="sfh-v6__divider" />
    <div className="sfh-v6__fleet">
      <span className="sfh-v6__fleet-label">Available Aircraft</span>
      <div className="sfh-v6__fleet-grid">
        {fleet.map(f => (
          <Link key={f.model} to={f.link} className="sfh-v6__fleet-card">
            <div className="sfh-v6__fleet-img"><img src={f.img} alt={f.model} /></div>
            <div className="sfh-v6__fleet-model">{f.model}</div>
            <span className="sfh-v6__fleet-meta">{f.seats}</span>
            <span className="sfh-v6__fleet-rate">From {f.rate}</span>
          </Link>
        ))}
      </div>
    </div>
    <div className="sfh-v6__quote">
      <blockquote>"The helicopter isn't just transport — it's a lifestyle."</blockquote>
    </div>
    <div className="sfh-v6__cta">
      <Link to="/contact?subject=hire" className="sfh-v6__cta-btn">Enquire Now</Link>
    </div>
  </div>
);

// ─── VARIATION 7: Stats-First Impact ───
const V7 = () => (
  <div className="sfh-v7">
    <style>{`
      .sfh-v7 { background: #faf9f6; }
      .sfh-v7__stats { max-width: 1100px; margin: 0 auto; padding: 4rem 2rem; display: grid; grid-template-columns: repeat(4, 1fr); gap: 0; border: 1px solid #e8e6e2; }
      .sfh-v7__stat { padding: 2.5rem 1.5rem; text-align: center; border-right: 1px solid #e8e6e2; }
      .sfh-v7__stat:last-child { border-right: none; }
      .sfh-v7__stat-number { display: block; font-family: 'Share Tech Mono', monospace; font-size: 3rem; color: #1a1a1a; line-height: 1; }
      .sfh-v7__stat-unit { display: block; font-family: 'Share Tech Mono', monospace; font-size: 0.7rem; color: #999; margin-top: 0.25rem; }
      .sfh-v7__stat-label { display: block; font-size: 0.65rem; text-transform: uppercase; letter-spacing: 0.15em; color: #888; margin-top: 0.75rem; }
      .sfh-v7__dest-strip { background: #1a1a1a; padding: 2rem; }
      .sfh-v7__dest-inner { max-width: 1100px; margin: 0 auto; display: flex; justify-content: space-between; align-items: center; }
      .sfh-v7__dest-item { text-align: center; }
      .sfh-v7__dest-item-name { display: block; font-size: 0.65rem; text-transform: uppercase; letter-spacing: 0.15em; color: rgba(255,255,255,0.5); margin-bottom: 0.25rem; }
      .sfh-v7__dest-item-time { font-family: 'Share Tech Mono', monospace; font-size: 1.25rem; color: #fff; }
      .sfh-v7__dest-dot { width: 4px; height: 4px; border-radius: 50%; background: rgba(255,255,255,0.2); }
      .sfh-v7__fleet { max-width: 1100px; margin: 0 auto; padding: 4rem 2rem; }
      .sfh-v7__fleet-label { display: block; font-size: 0.7rem; text-transform: uppercase; letter-spacing: 0.25em; color: #999; text-align: center; margin-bottom: 2.5rem; }
      .sfh-v7__fleet-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 1.5rem; }
      .sfh-v7__fleet-card { background: #fff; border: 1px solid #e8e6e2; padding: 2rem; text-align: center; text-decoration: none; color: inherit; transition: all 0.3s; }
      .sfh-v7__fleet-card:hover { border-color: #1a1a1a; transform: translateY(-3px); box-shadow: 0 8px 24px rgba(0,0,0,0.06); }
      .sfh-v7__fleet-card img { height: 80px; object-fit: contain; margin-bottom: 1rem; }
      .sfh-v7__fleet-card h4 { font-family: 'Space Grotesk', sans-serif; font-size: 1.2rem; font-weight: 700; text-transform: uppercase; margin: 0 0 0.25rem; color: #1a1a1a; }
      .sfh-v7__fleet-card-meta { font-size: 0.75rem; color: #888; }
      .sfh-v7__fleet-card-rate { display: block; font-family: 'Share Tech Mono', monospace; font-size: 0.9rem; color: #1a1a1a; margin-top: 0.5rem; }
      .sfh-v7__cta { text-align: center; padding: 1rem 2rem 5rem; }
      .sfh-v7__cta-btn { display: inline-block; padding: 1rem 2.5rem; background: #1a1a1a; color: #fff; text-decoration: none; font-size: 0.75rem; text-transform: uppercase; letter-spacing: 0.1em; }
      .sfh-v7__cta-btn:hover { background: #333; }
    `}</style>
    <div className="sfh-v7__stats">
      <div className="sfh-v7__stat">
        <span className="sfh-v7__stat-number">3</span>
        <span className="sfh-v7__stat-unit">types</span>
        <span className="sfh-v7__stat-label">Aircraft Available</span>
      </div>
      <div className="sfh-v7__stat">
        <span className="sfh-v7__stat-number">275</span>
        <span className="sfh-v7__stat-unit">£/hr</span>
        <span className="sfh-v7__stat-label">Starting From</span>
      </div>
      <div className="sfh-v7__stat">
        <span className="sfh-v7__stat-number">35</span>
        <span className="sfh-v7__stat-unit">min</span>
        <span className="sfh-v7__stat-label">Cotswolds</span>
      </div>
      <div className="sfh-v7__stat">
        <span className="sfh-v7__stat-number">34</span>
        <span className="sfh-v7__stat-unit">yrs</span>
        <span className="sfh-v7__stat-label">Experience</span>
      </div>
    </div>
    <div className="sfh-v7__dest-strip">
      <div className="sfh-v7__dest-inner">
        {destinations.map((d, i) => (
          <React.Fragment key={d.name}>
            <div className="sfh-v7__dest-item">
              <span className="sfh-v7__dest-item-name">{d.name}</span>
              <span className="sfh-v7__dest-item-time">{d.time}</span>
            </div>
            {i < destinations.length - 1 && <div className="sfh-v7__dest-dot" />}
          </React.Fragment>
        ))}
      </div>
    </div>
    <div className="sfh-v7__fleet">
      <span className="sfh-v7__fleet-label">Our Fleet</span>
      <div className="sfh-v7__fleet-grid">
        {fleet.map(f => (
          <Link key={f.model} to={f.link} className="sfh-v7__fleet-card">
            <img src={f.img} alt={f.model} />
            <h4>{f.model}</h4>
            <span className="sfh-v7__fleet-card-meta">{f.seats}</span>
            <span className="sfh-v7__fleet-card-rate">From {f.rate}</span>
          </Link>
        ))}
      </div>
    </div>
    <div className="sfh-v7__cta">
      <Link to="/contact?subject=hire" className="sfh-v7__cta-btn">Enquire About Self-Fly Hire</Link>
    </div>
  </div>
);

// ─── VARIATION 8: Split Screen ───
const V8 = () => (
  <div className="sfh-v8">
    <style>{`
      .sfh-v8 { background: #faf9f6; }
      .sfh-v8__split { max-width: 1200px; margin: 0 auto; padding: 4rem 2rem; display: grid; grid-template-columns: 1fr 1fr; gap: 3rem; }
      .sfh-v8__left-label { font-size: 0.7rem; text-transform: uppercase; letter-spacing: 0.25em; color: #999; display: block; margin-bottom: 2rem; }
      .sfh-v8__dest-list { display: flex; flex-direction: column; gap: 0; }
      .sfh-v8__dest-row { display: flex; justify-content: space-between; align-items: center; padding: 1.25rem 0; border-bottom: 1px solid #e8e6e2; }
      .sfh-v8__dest-row:first-child { border-top: 1px solid #e8e6e2; }
      .sfh-v8__dest-row-name { font-family: 'Space Grotesk', sans-serif; font-size: 1rem; font-weight: 600; text-transform: uppercase; color: #1a1a1a; }
      .sfh-v8__dest-row-times { display: flex; gap: 1.5rem; align-items: center; }
      .sfh-v8__dest-row-car { font-family: 'Share Tech Mono', monospace; font-size: 0.8rem; color: #ccc; text-decoration: line-through; }
      .sfh-v8__dest-row-heli { font-family: 'Share Tech Mono', monospace; font-size: 1.1rem; color: #1a1a1a; font-weight: 700; }
      .sfh-v8__right-label { font-size: 0.7rem; text-transform: uppercase; letter-spacing: 0.25em; color: #999; display: block; margin-bottom: 2rem; }
      .sfh-v8__fleet-stack { display: flex; flex-direction: column; gap: 1rem; }
      .sfh-v8__fleet-card { display: grid; grid-template-columns: 100px 1fr auto; gap: 1.5rem; align-items: center; padding: 1.25rem; background: #fff; border: 1px solid #e8e6e2; text-decoration: none; color: inherit; transition: all 0.3s; }
      .sfh-v8__fleet-card:hover { border-color: #1a1a1a; box-shadow: 0 4px 16px rgba(0,0,0,0.06); }
      .sfh-v8__fleet-card img { width: 80px; height: 50px; object-fit: contain; }
      .sfh-v8__fleet-card-model { font-family: 'Space Grotesk', sans-serif; font-weight: 700; text-transform: uppercase; color: #1a1a1a; font-size: 1rem; }
      .sfh-v8__fleet-card-seats { font-size: 0.75rem; color: #888; }
      .sfh-v8__fleet-card-rate { font-family: 'Share Tech Mono', monospace; font-size: 0.95rem; color: #1a1a1a; }
      .sfh-v8__bottom { max-width: 1200px; margin: 0 auto; padding: 3rem 2rem 5rem; display: flex; justify-content: space-between; align-items: center; border-top: 1px solid #e8e6e2; }
      .sfh-v8__bottom blockquote { font-size: 1rem; color: #666; font-style: italic; line-height: 1.6; margin: 0; max-width: 500px; }
      .sfh-v8__bottom-btn { display: inline-block; padding: 1rem 2.5rem; background: #1a1a1a; color: #fff; text-decoration: none; font-size: 0.75rem; text-transform: uppercase; letter-spacing: 0.1em; transition: background 0.3s; flex-shrink: 0; }
      .sfh-v8__bottom-btn:hover { background: #333; }
    `}</style>
    <div className="sfh-v8__split">
      <div>
        <span className="sfh-v8__left-label">Destinations</span>
        <div className="sfh-v8__dest-list">
          {destinations.map(d => (
            <div key={d.name} className="sfh-v8__dest-row">
              <span className="sfh-v8__dest-row-name">{d.name}</span>
              <div className="sfh-v8__dest-row-times">
                <span className="sfh-v8__dest-row-car">{d.carTime}</span>
                <span className="sfh-v8__dest-row-heli">{d.time}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
      <div>
        <span className="sfh-v8__right-label">Our Fleet</span>
        <div className="sfh-v8__fleet-stack">
          {fleet.map(f => (
            <Link key={f.model} to={f.link} className="sfh-v8__fleet-card">
              <img src={f.img} alt={f.model} />
              <div>
                <div className="sfh-v8__fleet-card-model">{f.model}</div>
                <div className="sfh-v8__fleet-card-seats">{f.seats}</div>
              </div>
              <span className="sfh-v8__fleet-card-rate">From {f.rate}</span>
            </Link>
          ))}
        </div>
      </div>
    </div>
    <div className="sfh-v8__bottom">
      <blockquote>"Land at the golf course, arrive at the races, reach your country house for lunch and still be back in London for dinner."</blockquote>
      <Link to="/contact?subject=hire" className="sfh-v8__bottom-btn">Enquire Now</Link>
    </div>
  </div>
);

// ─── VARIATION 9: Pricing Tiers ───
const V9 = () => (
  <div className="sfh-v9">
    <style>{`
      .sfh-v9 { background: #faf9f6; }
      .sfh-v9__tiers { max-width: 1100px; margin: 0 auto; padding: 4rem 2rem; }
      .sfh-v9__tiers-label { display: block; font-size: 0.7rem; text-transform: uppercase; letter-spacing: 0.25em; color: #999; text-align: center; margin-bottom: 2.5rem; }
      .sfh-v9__tiers-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 1.5rem; }
      .sfh-v9__tier { background: #fff; border: 1px solid #e8e6e2; padding: 2.5rem 2rem; text-align: center; text-decoration: none; color: inherit; transition: all 0.3s; position: relative; }
      .sfh-v9__tier:hover { border-color: #1a1a1a; transform: translateY(-4px); box-shadow: 0 12px 30px rgba(0,0,0,0.08); }
      .sfh-v9__tier--featured { border-color: #1a1a1a; border-width: 2px; }
      .sfh-v9__tier-badge { position: absolute; top: -12px; left: 50%; transform: translateX(-50%); background: #1a1a1a; color: #fff; font-size: 0.55rem; text-transform: uppercase; letter-spacing: 0.1em; padding: 0.3rem 0.8rem; }
      .sfh-v9__tier img { height: 100px; object-fit: contain; margin-bottom: 1.5rem; }
      .sfh-v9__tier-model { font-family: 'Space Grotesk', sans-serif; font-size: 1.5rem; font-weight: 700; text-transform: uppercase; color: #1a1a1a; margin-bottom: 0.25rem; }
      .sfh-v9__tier-seats { font-size: 0.75rem; color: #888; margin-bottom: 1.5rem; }
      .sfh-v9__tier-price { font-family: 'Share Tech Mono', monospace; font-size: 2rem; color: #1a1a1a; line-height: 1; }
      .sfh-v9__tier-unit { display: block; font-size: 0.7rem; color: #999; margin-top: 0.25rem; }
      .sfh-v9__tier-divider { width: 30px; height: 1px; background: #e8e6e2; margin: 1.5rem auto; }
      .sfh-v9__tier-features { list-style: none; padding: 0; margin: 0; }
      .sfh-v9__tier-features li { font-size: 0.8rem; color: #666; padding: 0.4rem 0; }
      .sfh-v9__tier-btn { display: inline-block; margin-top: 1.5rem; padding: 0.75rem 1.5rem; border: 1px solid #1a1a1a; color: #1a1a1a; text-decoration: none; font-size: 0.7rem; text-transform: uppercase; letter-spacing: 0.1em; transition: all 0.3s; }
      .sfh-v9__tier-btn:hover { background: #1a1a1a; color: #fff; }
      .sfh-v9__dest-bar { background: #1a1a1a; padding: 2rem; margin-top: 4rem; }
      .sfh-v9__dest-bar-inner { max-width: 1100px; margin: 0 auto; display: flex; justify-content: space-around; }
      .sfh-v9__dest-bar-item { text-align: center; }
      .sfh-v9__dest-bar-name { display: block; font-size: 0.6rem; text-transform: uppercase; letter-spacing: 0.15em; color: rgba(255,255,255,0.4); }
      .sfh-v9__dest-bar-time { font-family: 'Share Tech Mono', monospace; font-size: 1.1rem; color: #fff; }
    `}</style>
    <div className="sfh-v9__tiers">
      <span className="sfh-v9__tiers-label">Choose Your Aircraft</span>
      <div className="sfh-v9__tiers-grid">
        {fleet.map(f => (
          <Link key={f.model} to={f.link} className={`sfh-v9__tier ${f.featured ? 'sfh-v9__tier--featured' : ''}`}>
            {f.featured && <span className="sfh-v9__tier-badge">Most Popular</span>}
            <img src={f.img} alt={f.model} />
            <div className="sfh-v9__tier-model">{f.model}</div>
            <div className="sfh-v9__tier-seats">{f.seats}</div>
            <div className="sfh-v9__tier-price">{f.rate.replace('/hr','')}</div>
            <span className="sfh-v9__tier-unit">per hour</span>
            <div className="sfh-v9__tier-divider" />
            <ul className="sfh-v9__tier-features">
              <li>Fuelled & Ready</li>
              <li>Fully Insured</li>
              <li>Available Hourly / Daily</li>
            </ul>
            <span className="sfh-v9__tier-btn">Select Aircraft</span>
          </Link>
        ))}
      </div>
    </div>
    <div className="sfh-v9__dest-bar">
      <div className="sfh-v9__dest-bar-inner">
        {destinations.map(d => (
          <div key={d.name} className="sfh-v9__dest-bar-item">
            <span className="sfh-v9__dest-bar-name">{d.name}</span>
            <span className="sfh-v9__dest-bar-time">{d.time}</span>
          </div>
        ))}
      </div>
    </div>
  </div>
);

// ─── VARIATION 10: Vertical Journey Narrative ───
const V10 = () => (
  <div className="sfh-v10">
    <style>{`
      .sfh-v10 { background: #faf9f6; }
      .sfh-v10__narrative { max-width: 700px; margin: 0 auto; padding: 4rem 2rem 5rem; }
      .sfh-v10__step { display: grid; grid-template-columns: 40px 1fr; gap: 1.5rem; padding-bottom: 3rem; position: relative; }
      .sfh-v10__step::before { content: ''; position: absolute; left: 19px; top: 40px; bottom: 0; width: 1px; background: #e8e6e2; }
      .sfh-v10__step:last-child::before { display: none; }
      .sfh-v10__step-num { width: 40px; height: 40px; border-radius: 50%; border: 1px solid #e8e6e2; display: flex; align-items: center; justify-content: center; font-family: 'Share Tech Mono', monospace; font-size: 0.7rem; color: #999; background: #faf9f6; position: relative; z-index: 1; }
      .sfh-v10__step-content {}
      .sfh-v10__step-title { font-family: 'Space Grotesk', sans-serif; font-size: 1.1rem; font-weight: 700; text-transform: uppercase; color: #1a1a1a; margin-bottom: 0.5rem; }
      .sfh-v10__step-text { font-size: 0.95rem; color: #666; line-height: 1.6; }
      .sfh-v10__step-cards { display: flex; gap: 0.75rem; margin-top: 1rem; }
      .sfh-v10__dest-chip { display: inline-flex; align-items: center; gap: 0.5rem; padding: 0.5rem 0.75rem; border: 1px solid #e8e6e2; font-size: 0.75rem; background: #fff; }
      .sfh-v10__dest-chip-name { font-weight: 600; color: #1a1a1a; }
      .sfh-v10__dest-chip-time { font-family: 'Share Tech Mono', monospace; color: #888; }
      .sfh-v10__fleet-mini { display: flex; align-items: center; gap: 1rem; padding: 0.75rem 1rem; border: 1px solid #e8e6e2; background: #fff; text-decoration: none; color: inherit; transition: border-color 0.3s; margin-top: 0.5rem; }
      .sfh-v10__fleet-mini:hover { border-color: #1a1a1a; }
      .sfh-v10__fleet-mini img { height: 35px; object-fit: contain; }
      .sfh-v10__fleet-mini-model { font-family: 'Space Grotesk', sans-serif; font-weight: 700; text-transform: uppercase; font-size: 0.85rem; color: #1a1a1a; }
      .sfh-v10__fleet-mini-rate { font-family: 'Share Tech Mono', monospace; font-size: 0.75rem; color: #888; margin-left: auto; }
      .sfh-v10__final-cta { text-align: center; padding-top: 1rem; }
      .sfh-v10__final-btn { display: inline-block; padding: 1rem 2.5rem; background: #1a1a1a; color: #fff; text-decoration: none; font-size: 0.75rem; text-transform: uppercase; letter-spacing: 0.1em; }
      .sfh-v10__final-btn:hover { background: #333; }
    `}</style>
    <div className="sfh-v10__narrative">
      <div className="sfh-v10__step">
        <span className="sfh-v10__step-num">01</span>
        <div className="sfh-v10__step-content">
          <div className="sfh-v10__step-title">Choose Your Destination</div>
          <div className="sfh-v10__step-text">Skip the motorway. Fly direct from Denham to wherever you need to be.</div>
          <div className="sfh-v10__step-cards">
            {destinations.slice(0, 3).map(d => (
              <div key={d.name} className="sfh-v10__dest-chip">
                <span className="sfh-v10__dest-chip-name">{d.name}</span>
                <span className="sfh-v10__dest-chip-time">{d.time}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
      <div className="sfh-v10__step">
        <span className="sfh-v10__step-num">02</span>
        <div className="sfh-v10__step-content">
          <div className="sfh-v10__step-title">Select Your Aircraft</div>
          <div className="sfh-v10__step-text">From the nimble R22 to the turbine-powered R66. Each fuelled, washed and waiting on the pad.</div>
          {fleet.map(f => (
            <Link key={f.model} to={f.link} className="sfh-v10__fleet-mini">
              <img src={f.img} alt={f.model} />
              <span className="sfh-v10__fleet-mini-model">{f.model}</span>
              <span className="sfh-v10__fleet-mini-rate">From {f.rate}</span>
            </Link>
          ))}
        </div>
      </div>
      <div className="sfh-v10__step">
        <span className="sfh-v10__step-num">03</span>
        <div className="sfh-v10__step-content">
          <div className="sfh-v10__step-title">Fly</div>
          <div className="sfh-v10__step-text">No crew, no waiting, no compromise. Available by the hour, day or week. Your licence, your aircraft, your schedule.</div>
        </div>
      </div>
      <div className="sfh-v10__final-cta">
        <Link to="/contact?subject=hire" className="sfh-v10__final-btn">Get Started</Link>
      </div>
    </div>
  </div>
);

// ─── VARIATION 11: Cinematic Full-Bleed ───
const V11 = () => (
  <div className="sfh-v11">
    <style>{`
      .sfh-v11__hero { position: relative; height: 70vh; min-height: 450px; overflow: hidden; display: flex; align-items: center; justify-content: center; }
      .sfh-v11__hero-bg { position: absolute; inset: 0; }
      .sfh-v11__hero-bg img { width: 100%; height: 100%; object-fit: cover; }
      .sfh-v11__hero-overlay { position: absolute; inset: 0; background: linear-gradient(to bottom, rgba(0,0,0,0.3) 0%, rgba(0,0,0,0.6) 100%); }
      .sfh-v11__hero-content { position: relative; z-index: 1; text-align: center; color: #fff; max-width: 800px; padding: 2rem; }
      .sfh-v11__hero-label { font-size: 0.65rem; text-transform: uppercase; letter-spacing: 0.3em; color: rgba(255,255,255,0.6); margin-bottom: 1rem; display: block; }
      .sfh-v11__hero-title { font-family: 'Space Grotesk', sans-serif; font-size: clamp(2rem, 5vw, 3.5rem); font-weight: 700; text-transform: uppercase; margin: 0 0 1rem; line-height: 1.1; }
      .sfh-v11__hero-dest-row { display: flex; justify-content: center; gap: 3rem; margin-top: 2rem; }
      .sfh-v11__hero-dest { text-align: center; }
      .sfh-v11__hero-dest-name { display: block; font-size: 0.65rem; text-transform: uppercase; letter-spacing: 0.15em; color: rgba(255,255,255,0.5); }
      .sfh-v11__hero-dest-time { font-family: 'Share Tech Mono', monospace; font-size: 1.5rem; color: #fff; }
      .sfh-v11__fleet { background: #faf9f6; max-width: 1000px; margin: 0 auto; padding: 4rem 2rem; }
      .sfh-v11__fleet-label { display: block; font-size: 0.7rem; text-transform: uppercase; letter-spacing: 0.25em; color: #999; text-align: center; margin-bottom: 2rem; }
      .sfh-v11__fleet-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 1.5rem; }
      .sfh-v11__fleet-card { background: #fff; border: 1px solid #e8e6e2; padding: 2rem; text-align: center; text-decoration: none; color: inherit; transition: all 0.3s; }
      .sfh-v11__fleet-card:hover { border-color: #1a1a1a; transform: translateY(-3px); box-shadow: 0 8px 24px rgba(0,0,0,0.06); }
      .sfh-v11__fleet-card img { height: 80px; object-fit: contain; margin-bottom: 1rem; }
      .sfh-v11__fleet-card h4 { font-family: 'Space Grotesk', sans-serif; font-size: 1.2rem; font-weight: 700; text-transform: uppercase; margin: 0 0 0.25rem; color: #1a1a1a; }
      .sfh-v11__fleet-card span { display: block; font-size: 0.75rem; color: #888; }
      .sfh-v11__fleet-card-rate { font-family: 'Share Tech Mono', monospace !important; font-size: 0.9rem !important; color: #1a1a1a !important; margin-top: 0.5rem; }
      .sfh-v11__cta { text-align: center; padding: 1rem 2rem 5rem; background: #faf9f6; }
      .sfh-v11__cta-btn { display: inline-block; padding: 1rem 2.5rem; background: #1a1a1a; color: #fff; text-decoration: none; font-size: 0.75rem; text-transform: uppercase; letter-spacing: 0.1em; }
    `}</style>
    <div className="sfh-v11__hero">
      <div className="sfh-v11__hero-bg"><img src="/assets/images/destinations/cotswolds-aerial.jpg" alt="Destinations" /></div>
      <div className="sfh-v11__hero-overlay" />
      <div className="sfh-v11__hero-content">
        <span className="sfh-v11__hero-label">Flight Times from Denham Aerodrome</span>
        <h3 className="sfh-v11__hero-title">Where Will You Fly Today?</h3>
        <div className="sfh-v11__hero-dest-row">
          {destinations.map(d => (
            <div key={d.name} className="sfh-v11__hero-dest">
              <span className="sfh-v11__hero-dest-name">{d.name}</span>
              <span className="sfh-v11__hero-dest-time">{d.time}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
    <div className="sfh-v11__fleet">
      <span className="sfh-v11__fleet-label">Our Fleet</span>
      <div className="sfh-v11__fleet-grid">
        {fleet.map(f => (
          <Link key={f.model} to={f.link} className="sfh-v11__fleet-card">
            <img src={f.img} alt={f.model} />
            <h4>{f.model}</h4>
            <span>{f.seats}</span>
            <span className="sfh-v11__fleet-card-rate">From {f.rate}</span>
          </Link>
        ))}
      </div>
    </div>
    <div className="sfh-v11__cta"><Link to="/contact?subject=hire" className="sfh-v11__cta-btn">Enquire About Hire</Link></div>
  </div>
);

// ─── VARIATION 12: Animated Time Comparison Bars ───
const V12 = () => (
  <div className="sfh-v12">
    <style>{`
      .sfh-v12 { background: #faf9f6; }
      .sfh-v12__compare { max-width: 900px; margin: 0 auto; padding: 4rem 2rem; }
      .sfh-v12__compare-label { display: block; font-size: 0.7rem; text-transform: uppercase; letter-spacing: 0.25em; color: #999; margin-bottom: 2.5rem; }
      .sfh-v12__route { margin-bottom: 2rem; }
      .sfh-v12__route-name { font-family: 'Space Grotesk', sans-serif; font-size: 0.9rem; font-weight: 700; text-transform: uppercase; color: #1a1a1a; margin-bottom: 0.75rem; }
      .sfh-v12__bar-row { display: flex; align-items: center; gap: 1rem; margin-bottom: 0.4rem; }
      .sfh-v12__bar-icon { font-size: 0.75rem; width: 20px; text-align: center; }
      .sfh-v12__bar { height: 8px; border-radius: 4px; transition: width 1s ease; }
      .sfh-v12__bar--car { background: #e8e6e2; }
      .sfh-v12__bar--heli { background: #1a1a1a; }
      .sfh-v12__bar-time { font-family: 'Share Tech Mono', monospace; font-size: 0.75rem; color: #666; min-width: 60px; }
      .sfh-v12__fleet { max-width: 900px; margin: 0 auto; padding: 2rem 2rem 4rem; }
      .sfh-v12__fleet-label { display: block; font-size: 0.7rem; text-transform: uppercase; letter-spacing: 0.25em; color: #999; margin-bottom: 2rem; }
      .sfh-v12__fleet-scroll { display: flex; gap: 1.5rem; overflow-x: auto; scroll-snap-type: x mandatory; padding-bottom: 1rem; scrollbar-width: none; }
      .sfh-v12__fleet-scroll::-webkit-scrollbar { display: none; }
      .sfh-v12__fleet-slide { flex: 0 0 280px; scroll-snap-align: start; background: #fff; border: 1px solid #e8e6e2; padding: 2rem; text-align: center; text-decoration: none; color: inherit; transition: all 0.3s; }
      .sfh-v12__fleet-slide:hover { border-color: #1a1a1a; }
      .sfh-v12__fleet-slide img { height: 80px; object-fit: contain; margin-bottom: 1rem; }
      .sfh-v12__fleet-slide h4 { font-family: 'Space Grotesk', sans-serif; font-size: 1.2rem; font-weight: 700; text-transform: uppercase; margin: 0 0 0.25rem; color: #1a1a1a; }
      .sfh-v12__fleet-slide span { display: block; font-size: 0.75rem; color: #888; }
      .sfh-v12__fleet-slide-rate { font-family: 'Share Tech Mono', monospace !important; color: #1a1a1a !important; font-size: 0.9rem !important; margin-top: 0.5rem; }
      .sfh-v12__cta { text-align: center; padding: 0 2rem 5rem; }
      .sfh-v12__cta-btn { display: inline-block; padding: 1rem 2.5rem; background: #1a1a1a; color: #fff; text-decoration: none; font-size: 0.75rem; text-transform: uppercase; letter-spacing: 0.1em; }
    `}</style>
    <div className="sfh-v12__compare">
      <span className="sfh-v12__compare-label">Car vs Helicopter — Time Comparison</span>
      {destinations.map(d => {
        const heliMins = parseInt(d.time);
        const carMins = parseInt(d.carTime) * 60 || 120;
        const maxW = 100;
        return (
          <div key={d.name} className="sfh-v12__route">
            <div className="sfh-v12__route-name">{d.name}</div>
            <div className="sfh-v12__bar-row">
              <span className="sfh-v12__bar-icon">🚗</span>
              <div className="sfh-v12__bar sfh-v12__bar--car" style={{ width: `${maxW}%` }} />
              <span className="sfh-v12__bar-time">{d.carTime}</span>
            </div>
            <div className="sfh-v12__bar-row">
              <span className="sfh-v12__bar-icon" style={{ fontSize: '0.6rem' }}>🚁</span>
              <div className="sfh-v12__bar sfh-v12__bar--heli" style={{ width: `${Math.max(15, (heliMins / carMins) * maxW)}%` }} />
              <span className="sfh-v12__bar-time" style={{ fontWeight: 700, color: '#1a1a1a' }}>{d.time}</span>
            </div>
          </div>
        );
      })}
    </div>
    <div className="sfh-v12__fleet">
      <span className="sfh-v12__fleet-label">Our Fleet</span>
      <div className="sfh-v12__fleet-scroll">
        {fleet.map(f => (
          <Link key={f.model} to={f.link} className="sfh-v12__fleet-slide">
            <img src={f.img} alt={f.model} />
            <h4>{f.model}</h4>
            <span>{f.seats}</span>
            <span className="sfh-v12__fleet-slide-rate">From {f.rate}</span>
          </Link>
        ))}
      </div>
    </div>
    <div className="sfh-v12__cta"><Link to="/contact?subject=hire" className="sfh-v12__cta-btn">Enquire About Hire</Link></div>
  </div>
);

// ─── VARIATION 13: Guided Booking Flow ───
const V13 = () => {
  const [selectedDest, setSelectedDest] = React.useState(null);
  const [selectedAircraft, setSelectedAircraft] = React.useState(null);
  return (
    <div className="sfh-v13">
      <style>{`
        .sfh-v13 { background: #faf9f6; }
        .sfh-v13__flow { max-width: 900px; margin: 0 auto; padding: 4rem 2rem; }
        .sfh-v13__section { margin-bottom: 3rem; }
        .sfh-v13__section-header { display: flex; align-items: center; gap: 1rem; margin-bottom: 1.5rem; }
        .sfh-v13__section-num { width: 32px; height: 32px; border-radius: 50%; background: #1a1a1a; color: #fff; font-family: 'Share Tech Mono', monospace; font-size: 0.7rem; display: flex; align-items: center; justify-content: center; }
        .sfh-v13__section-title { font-family: 'Space Grotesk', sans-serif; font-size: 1rem; font-weight: 700; text-transform: uppercase; letter-spacing: 0.05em; color: #1a1a1a; }
        .sfh-v13__dest-options { display: grid; grid-template-columns: repeat(4, 1fr); gap: 0.75rem; }
        .sfh-v13__dest-opt { padding: 1rem; border: 2px solid #e8e6e2; text-align: center; cursor: pointer; transition: all 0.2s; background: #fff; }
        .sfh-v13__dest-opt:hover { border-color: #1a1a1a; }
        .sfh-v13__dest-opt--active { border-color: #1a1a1a; background: #1a1a1a; color: #fff; }
        .sfh-v13__dest-opt-name { display: block; font-family: 'Space Grotesk', sans-serif; font-size: 0.8rem; font-weight: 600; text-transform: uppercase; }
        .sfh-v13__dest-opt-time { display: block; font-family: 'Share Tech Mono', monospace; font-size: 1rem; margin-top: 0.25rem; }
        .sfh-v13__dest-opt--active .sfh-v13__dest-opt-name,
        .sfh-v13__dest-opt--active .sfh-v13__dest-opt-time { color: #fff; }
        .sfh-v13__aircraft-options { display: grid; grid-template-columns: repeat(3, 1fr); gap: 0.75rem; }
        .sfh-v13__aircraft-opt { padding: 1.5rem; border: 2px solid #e8e6e2; text-align: center; cursor: pointer; transition: all 0.2s; background: #fff; }
        .sfh-v13__aircraft-opt:hover { border-color: #1a1a1a; }
        .sfh-v13__aircraft-opt--active { border-color: #1a1a1a; background: #1a1a1a; color: #fff; }
        .sfh-v13__aircraft-opt img { height: 60px; object-fit: contain; margin-bottom: 0.75rem; }
        .sfh-v13__aircraft-opt--active img { filter: brightness(0) invert(1); }
        .sfh-v13__aircraft-opt-model { display: block; font-family: 'Space Grotesk', sans-serif; font-weight: 700; text-transform: uppercase; font-size: 1rem; }
        .sfh-v13__aircraft-opt-rate { display: block; font-family: 'Share Tech Mono', monospace; font-size: 0.8rem; margin-top: 0.25rem; color: #888; }
        .sfh-v13__aircraft-opt--active .sfh-v13__aircraft-opt-rate { color: rgba(255,255,255,0.6); }
        .sfh-v13__summary { padding: 2rem; border: 2px solid #1a1a1a; background: #fff; text-align: center; }
        .sfh-v13__summary-label { font-size: 0.65rem; text-transform: uppercase; letter-spacing: 0.2em; color: #999; display: block; margin-bottom: 1rem; }
        .sfh-v13__summary-route { font-family: 'Space Grotesk', sans-serif; font-size: 1.2rem; font-weight: 700; text-transform: uppercase; color: #1a1a1a; }
        .sfh-v13__summary-detail { font-family: 'Share Tech Mono', monospace; font-size: 0.85rem; color: #666; margin: 0.5rem 0 1.5rem; }
        .sfh-v13__summary-btn { display: inline-block; padding: 1rem 2.5rem; background: #1a1a1a; color: #fff; text-decoration: none; font-size: 0.75rem; text-transform: uppercase; letter-spacing: 0.1em; border: none; cursor: pointer; }
      `}</style>
      <div className="sfh-v13__flow">
        <div className="sfh-v13__section">
          <div className="sfh-v13__section-header">
            <span className="sfh-v13__section-num">01</span>
            <span className="sfh-v13__section-title">Choose Destination</span>
          </div>
          <div className="sfh-v13__dest-options">
            {destinations.map((d, i) => (
              <div key={d.name} className={`sfh-v13__dest-opt ${selectedDest === i ? 'sfh-v13__dest-opt--active' : ''}`} onClick={() => setSelectedDest(i)}>
                <span className="sfh-v13__dest-opt-name">{d.name}</span>
                <span className="sfh-v13__dest-opt-time">{d.time}</span>
              </div>
            ))}
          </div>
        </div>
        <div className="sfh-v13__section">
          <div className="sfh-v13__section-header">
            <span className="sfh-v13__section-num">02</span>
            <span className="sfh-v13__section-title">Select Aircraft</span>
          </div>
          <div className="sfh-v13__aircraft-options">
            {fleet.map((f, i) => (
              <div key={f.model} className={`sfh-v13__aircraft-opt ${selectedAircraft === i ? 'sfh-v13__aircraft-opt--active' : ''}`} onClick={() => setSelectedAircraft(i)}>
                <img src={f.img} alt={f.model} />
                <span className="sfh-v13__aircraft-opt-model">{f.model}</span>
                <span className="sfh-v13__aircraft-opt-rate">From {f.rate}</span>
              </div>
            ))}
          </div>
        </div>
        {selectedDest !== null && selectedAircraft !== null && (
          <div className="sfh-v13__summary">
            <span className="sfh-v13__summary-label">Your Trip</span>
            <div className="sfh-v13__summary-route">Denham → {destinations[selectedDest].name}</div>
            <div className="sfh-v13__summary-detail">{fleet[selectedAircraft].model} · {destinations[selectedDest].time} flight · From {fleet[selectedAircraft].rate}</div>
            <Link to="/contact?subject=hire" className="sfh-v13__summary-btn">Enquire Now</Link>
          </div>
        )}
      </div>
    </div>
  );
};

// ─── VARIATION 14: Lifestyle Gallery ───
const V14 = () => (
  <div className="sfh-v14">
    <style>{`
      .sfh-v14 { background: #faf9f6; }
      .sfh-v14__gallery { max-width: 1200px; margin: 0 auto; padding: 4rem 2rem; display: grid; grid-template-columns: 1fr 1fr; gap: 1.5rem; }
      .sfh-v14__gallery-large { grid-column: span 2; position: relative; border-radius: 8px; overflow: hidden; aspect-ratio: 21/9; }
      .sfh-v14__gallery-large img { width: 100%; height: 100%; object-fit: cover; }
      .sfh-v14__gallery-large-overlay { position: absolute; inset: 0; background: linear-gradient(to right, rgba(0,0,0,0.6) 0%, rgba(0,0,0,0.2) 50%, transparent); }
      .sfh-v14__gallery-large-content { position: absolute; top: 50%; left: 3rem; transform: translateY(-50%); max-width: 400px; }
      .sfh-v14__gallery-large-quote { font-family: 'Space Grotesk', sans-serif; font-size: 1.5rem; color: #fff; line-height: 1.5; font-weight: 400; font-style: italic; }
      .sfh-v14__gallery-large-attr { display: block; font-size: 0.65rem; text-transform: uppercase; letter-spacing: 0.2em; color: rgba(255,255,255,0.5); margin-top: 1rem; }
      .sfh-v14__gallery-item { position: relative; border-radius: 8px; overflow: hidden; aspect-ratio: 4/3; }
      .sfh-v14__gallery-item img { width: 100%; height: 100%; object-fit: cover; transition: transform 0.5s; }
      .sfh-v14__gallery-item:hover img { transform: scale(1.05); }
      .sfh-v14__gallery-item-overlay { position: absolute; inset: 0; background: linear-gradient(to top, rgba(0,0,0,0.5) 0%, transparent 50%); }
      .sfh-v14__gallery-item-content { position: absolute; bottom: 1rem; left: 1rem; }
      .sfh-v14__gallery-item-name { font-family: 'Space Grotesk', sans-serif; font-size: 0.85rem; font-weight: 600; color: #fff; text-transform: uppercase; }
      .sfh-v14__gallery-item-time { font-family: 'Share Tech Mono', monospace; font-size: 0.9rem; color: rgba(255,255,255,0.8); }
      .sfh-v14__fleet { max-width: 1200px; margin: 0 auto; padding: 3rem 2rem; display: flex; align-items: center; justify-content: center; gap: 3rem; border-top: 1px solid #e8e6e2; border-bottom: 1px solid #e8e6e2; }
      .sfh-v14__fleet-item { text-decoration: none; color: inherit; text-align: center; transition: transform 0.3s; }
      .sfh-v14__fleet-item:hover { transform: translateY(-4px); }
      .sfh-v14__fleet-item img { height: 70px; object-fit: contain; margin-bottom: 0.5rem; }
      .sfh-v14__fleet-item-name { display: block; font-family: 'Space Grotesk', sans-serif; font-size: 0.85rem; font-weight: 700; text-transform: uppercase; color: #1a1a1a; }
      .sfh-v14__fleet-item-rate { font-family: 'Share Tech Mono', monospace; font-size: 0.75rem; color: #888; }
      .sfh-v14__cta { text-align: center; padding: 4rem 2rem 5rem; }
      .sfh-v14__cta-btn { display: inline-block; padding: 1rem 2.5rem; background: #1a1a1a; color: #fff; text-decoration: none; font-size: 0.75rem; text-transform: uppercase; letter-spacing: 0.1em; }
    `}</style>
    <div className="sfh-v14__gallery">
      <div className="sfh-v14__gallery-large">
        <img src={destinations[2].img} alt="Lifestyle" />
        <div className="sfh-v14__gallery-large-overlay" />
        <div className="sfh-v14__gallery-large-content">
          <div className="sfh-v14__gallery-large-quote">"The helicopter isn't just transport — it's a lifestyle."</div>
          <span className="sfh-v14__gallery-large-attr">— The Freedom of Flight</span>
        </div>
      </div>
      {destinations.slice(0, 2).map(d => (
        <div key={d.name} className="sfh-v14__gallery-item">
          <img src={d.img} alt={d.name} />
          <div className="sfh-v14__gallery-item-overlay" />
          <div className="sfh-v14__gallery-item-content">
            <div className="sfh-v14__gallery-item-name">{d.name}</div>
            <div className="sfh-v14__gallery-item-time">{d.time}</div>
          </div>
        </div>
      ))}
    </div>
    <div className="sfh-v14__fleet">
      {fleet.map(f => (
        <Link key={f.model} to={f.link} className="sfh-v14__fleet-item">
          <img src={f.img} alt={f.model} />
          <span className="sfh-v14__fleet-item-name">{f.model}</span>
          <span className="sfh-v14__fleet-item-rate">From {f.rate}</span>
        </Link>
      ))}
    </div>
    <div className="sfh-v14__cta"><Link to="/contact?subject=hire" className="sfh-v14__cta-btn">Enquire About Hire</Link></div>
  </div>
);

// ─── VARIATION 15: Departure Board ───
const V15 = () => (
  <div className="sfh-v15">
    <style>{`
      .sfh-v15 { background: #faf9f6; }
      .sfh-v15__board { background: #0a0a0a; padding: 3rem 2rem; }
      .sfh-v15__board-inner { max-width: 900px; margin: 0 auto; }
      .sfh-v15__board-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 1.5rem; padding-bottom: 1rem; border-bottom: 1px solid rgba(255,255,255,0.1); }
      .sfh-v15__board-title { font-family: 'Share Tech Mono', monospace; font-size: 0.7rem; text-transform: uppercase; letter-spacing: 0.15em; color: rgba(255,255,255,0.4); }
      .sfh-v15__board-status { font-family: 'Share Tech Mono', monospace; font-size: 0.6rem; color: #4ade80; letter-spacing: 0.1em; }
      .sfh-v15__board-cols { display: grid; grid-template-columns: 2fr 1fr 1fr 80px; padding: 0.5rem 1rem; margin-bottom: 0.5rem; }
      .sfh-v15__board-cols span { font-family: 'Share Tech Mono', monospace; font-size: 0.55rem; text-transform: uppercase; letter-spacing: 0.1em; color: rgba(255,255,255,0.25); }
      .sfh-v15__board-row { display: grid; grid-template-columns: 2fr 1fr 1fr 80px; padding: 1rem; background: rgba(255,255,255,0.03); margin-bottom: 2px; align-items: center; }
      .sfh-v15__board-dest { font-family: 'Share Tech Mono', monospace; font-size: 1rem; color: #fff; text-transform: uppercase; letter-spacing: 0.05em; }
      .sfh-v15__board-heli { font-family: 'Share Tech Mono', monospace; font-size: 1.1rem; color: #4ade80; font-weight: 700; }
      .sfh-v15__board-car { font-family: 'Share Tech Mono', monospace; font-size: 0.85rem; color: rgba(255,255,255,0.3); }
      .sfh-v15__board-badge { font-family: 'Share Tech Mono', monospace; font-size: 0.55rem; color: #4ade80; border: 1px solid rgba(74,222,128,0.3); padding: 0.2rem 0.4rem; text-align: center; }
      .sfh-v15__gates { max-width: 900px; margin: 0 auto; padding: 4rem 2rem; }
      .sfh-v15__gates-label { display: block; font-family: 'Share Tech Mono', monospace; font-size: 0.65rem; text-transform: uppercase; letter-spacing: 0.15em; color: #999; margin-bottom: 2rem; }
      .sfh-v15__gates-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 1.5rem; }
      .sfh-v15__gate { border: 1px solid #e8e6e2; padding: 2rem; text-align: center; text-decoration: none; color: inherit; transition: all 0.3s; }
      .sfh-v15__gate:hover { border-color: #1a1a1a; }
      .sfh-v15__gate-num { font-family: 'Share Tech Mono', monospace; font-size: 0.6rem; color: #999; display: block; margin-bottom: 1rem; }
      .sfh-v15__gate img { height: 80px; object-fit: contain; margin-bottom: 1rem; }
      .sfh-v15__gate-model { font-family: 'Space Grotesk', sans-serif; font-size: 1.2rem; font-weight: 700; text-transform: uppercase; color: #1a1a1a; }
      .sfh-v15__gate-info { font-size: 0.75rem; color: #888; margin-top: 0.25rem; }
      .sfh-v15__gate-rate { display: block; font-family: 'Share Tech Mono', monospace; font-size: 0.9rem; color: #1a1a1a; margin-top: 0.75rem; }
      .sfh-v15__cta { text-align: center; padding: 0 2rem 5rem; }
      .sfh-v15__cta-btn { display: inline-block; padding: 1rem 2.5rem; background: #1a1a1a; color: #fff; text-decoration: none; font-size: 0.75rem; text-transform: uppercase; letter-spacing: 0.1em; }
    `}</style>
    <div className="sfh-v15__board">
      <div className="sfh-v15__board-inner">
        <div className="sfh-v15__board-header">
          <span className="sfh-v15__board-title">Departures — Denham Aerodrome (EGLD)</span>
          <span className="sfh-v15__board-status">● ALL AIRCRAFT AVAILABLE</span>
        </div>
        <div className="sfh-v15__board-cols">
          <span>Destination</span><span>By Heli</span><span>By Car</span><span>Status</span>
        </div>
        {destinations.map(d => (
          <div key={d.name} className="sfh-v15__board-row">
            <span className="sfh-v15__board-dest">{d.name}</span>
            <span className="sfh-v15__board-heli">{d.time}</span>
            <span className="sfh-v15__board-car">{d.carTime}</span>
            <span className="sfh-v15__board-badge">READY</span>
          </div>
        ))}
      </div>
    </div>
    <div className="sfh-v15__gates">
      <span className="sfh-v15__gates-label">Gate Assignment — Available Aircraft</span>
      <div className="sfh-v15__gates-grid">
        {fleet.map((f, i) => (
          <Link key={f.model} to={f.link} className="sfh-v15__gate">
            <span className="sfh-v15__gate-num">GATE {String(i + 1).padStart(2, '0')}</span>
            <img src={f.img} alt={f.model} />
            <div className="sfh-v15__gate-model">{f.model}</div>
            <div className="sfh-v15__gate-info">{f.seats}</div>
            <span className="sfh-v15__gate-rate">From {f.rate}</span>
          </Link>
        ))}
      </div>
    </div>
    <div className="sfh-v15__cta"><Link to="/contact?subject=hire" className="sfh-v15__cta-btn">Book Your Departure</Link></div>
  </div>
);

// ─── VARIATION 16: Ultra Minimal ───
const V16 = () => (
  <div className="sfh-v16">
    <style>{`
      .sfh-v16 { background: #faf9f6; }
      .sfh-v16__content { max-width: 600px; margin: 0 auto; padding: 4rem 2rem 5rem; }
      .sfh-v16__dest-label { display: block; font-size: 0.65rem; text-transform: uppercase; letter-spacing: 0.3em; color: #999; margin-bottom: 3rem; }
      .sfh-v16__dest-item { display: flex; justify-content: space-between; align-items: baseline; padding: 1rem 0; border-bottom: 1px solid #e8e6e2; }
      .sfh-v16__dest-item:first-child { border-top: 1px solid #e8e6e2; }
      .sfh-v16__dest-name { font-family: 'Space Grotesk', sans-serif; font-size: 1.2rem; font-weight: 700; text-transform: uppercase; color: #1a1a1a; }
      .sfh-v16__dest-time { font-family: 'Share Tech Mono', monospace; font-size: 1rem; color: #1a1a1a; }
      .sfh-v16__spacer { height: 4rem; }
      .sfh-v16__fleet-label { display: block; font-size: 0.65rem; text-transform: uppercase; letter-spacing: 0.3em; color: #999; margin-bottom: 3rem; }
      .sfh-v16__fleet-item { display: flex; align-items: center; gap: 1.5rem; padding: 1.25rem 0; border-bottom: 1px solid #e8e6e2; text-decoration: none; color: inherit; transition: opacity 0.3s; }
      .sfh-v16__fleet-item:first-child { border-top: 1px solid #e8e6e2; }
      .sfh-v16__fleet-item:hover { opacity: 0.7; }
      .sfh-v16__fleet-item img { height: 40px; object-fit: contain; width: 70px; }
      .sfh-v16__fleet-model { font-family: 'Space Grotesk', sans-serif; font-weight: 700; text-transform: uppercase; color: #1a1a1a; font-size: 1rem; }
      .sfh-v16__fleet-seats { font-size: 0.75rem; color: #999; }
      .sfh-v16__fleet-rate { margin-left: auto; font-family: 'Share Tech Mono', monospace; font-size: 0.9rem; color: #1a1a1a; }
      .sfh-v16__quote-spacer { height: 3rem; }
      .sfh-v16__quote { font-size: 1.1rem; color: #666; line-height: 1.8; font-style: italic; border-left: 2px solid #e8e6e2; padding-left: 1.5rem; margin: 0; }
      .sfh-v16__cta { margin-top: 3rem; }
      .sfh-v16__cta-link { font-size: 0.75rem; text-transform: uppercase; letter-spacing: 0.1em; color: #1a1a1a; border-bottom: 1px solid #ccc; padding-bottom: 0.25rem; text-decoration: none; transition: border-color 0.3s; }
      .sfh-v16__cta-link:hover { border-color: #1a1a1a; }
    `}</style>
    <div className="sfh-v16__content">
      <span className="sfh-v16__dest-label">Destinations</span>
      {destinations.map(d => (
        <div key={d.name} className="sfh-v16__dest-item">
          <span className="sfh-v16__dest-name">{d.name}</span>
          <span className="sfh-v16__dest-time">{d.time}</span>
        </div>
      ))}
      <div className="sfh-v16__spacer" />
      <span className="sfh-v16__fleet-label">Fleet</span>
      {fleet.map(f => (
        <Link key={f.model} to={f.link} className="sfh-v16__fleet-item">
          <img src={f.img} alt={f.model} />
          <div>
            <div className="sfh-v16__fleet-model">{f.model}</div>
            <div className="sfh-v16__fleet-seats">{f.seats}</div>
          </div>
          <span className="sfh-v16__fleet-rate">From {f.rate}</span>
        </Link>
      ))}
      <div className="sfh-v16__quote-spacer" />
      <blockquote className="sfh-v16__quote">"Land at the golf course, arrive at the races, reach your country house for lunch and still be back in London for dinner."</blockquote>
      <div className="sfh-v16__cta">
        <Link to="/contact?subject=hire" className="sfh-v16__cta-link">Enquire about hire →</Link>
      </div>
    </div>
  </div>
);

// ─── VARIATION 17: Asymmetric Editorial ───
const V17 = () => (
  <div className="sfh-v17">
    <style>{`
      .sfh-v17 { background: #faf9f6; }
      .sfh-v17__section { max-width: 1100px; margin: 0 auto; padding: 4rem 2rem; }
      .sfh-v17__dest-row { display: grid; grid-template-columns: 300px 1fr; gap: 3rem; align-items: start; margin-bottom: 4rem; }
      .sfh-v17__dest-text {}
      .sfh-v17__dest-label { display: block; font-size: 0.65rem; text-transform: uppercase; letter-spacing: 0.3em; color: #999; margin-bottom: 1.5rem; }
      .sfh-v17__dest-title { font-family: 'Space Grotesk', sans-serif; font-size: clamp(1.5rem, 3vw, 2.2rem); font-weight: 700; text-transform: uppercase; color: #1a1a1a; line-height: 1.1; margin: 0 0 1rem; }
      .sfh-v17__dest-para { font-size: 0.95rem; color: #666; line-height: 1.7; }
      .sfh-v17__dest-grid { display: grid; grid-template-columns: repeat(2, 1fr); gap: 1rem; }
      .sfh-v17__dest-card { position: relative; border-radius: 8px; overflow: hidden; aspect-ratio: 3/2; }
      .sfh-v17__dest-card img { width: 100%; height: 100%; object-fit: cover; transition: transform 0.5s; }
      .sfh-v17__dest-card:hover img { transform: scale(1.05); }
      .sfh-v17__dest-card-overlay { position: absolute; inset: 0; background: linear-gradient(to top, rgba(0,0,0,0.5) 0%, transparent 50%); }
      .sfh-v17__dest-card-info { position: absolute; bottom: 0.75rem; left: 0.75rem; right: 0.75rem; display: flex; justify-content: space-between; align-items: flex-end; }
      .sfh-v17__dest-card-name { font-family: 'Space Grotesk', sans-serif; font-size: 0.75rem; font-weight: 600; color: #fff; text-transform: uppercase; }
      .sfh-v17__dest-card-time { font-family: 'Share Tech Mono', monospace; font-size: 0.85rem; color: rgba(255,255,255,0.8); }
      .sfh-v17__fleet-row { display: grid; grid-template-columns: 1fr 350px; gap: 3rem; align-items: center; }
      .sfh-v17__fleet-stack { display: flex; flex-direction: column; gap: 0.75rem; }
      .sfh-v17__fleet-card { display: flex; align-items: center; gap: 1.25rem; padding: 1rem; border: 1px solid #e8e6e2; background: #fff; text-decoration: none; color: inherit; transition: border-color 0.3s; }
      .sfh-v17__fleet-card:hover { border-color: #1a1a1a; }
      .sfh-v17__fleet-card img { height: 45px; object-fit: contain; width: 70px; }
      .sfh-v17__fleet-card-model { font-family: 'Space Grotesk', sans-serif; font-weight: 700; text-transform: uppercase; font-size: 0.95rem; color: #1a1a1a; }
      .sfh-v17__fleet-card-info { font-size: 0.7rem; color: #888; }
      .sfh-v17__fleet-card-rate { margin-left: auto; font-family: 'Share Tech Mono', monospace; font-size: 0.85rem; color: #1a1a1a; }
      .sfh-v17__fleet-text {}
      .sfh-v17__fleet-label { display: block; font-size: 0.65rem; text-transform: uppercase; letter-spacing: 0.3em; color: #999; margin-bottom: 1.5rem; text-align: right; }
      .sfh-v17__fleet-quote { font-size: 1.1rem; color: #4a4a4a; line-height: 1.7; text-align: right; font-style: italic; }
      .sfh-v17__cta { text-align: right; margin-top: 2rem; }
      .sfh-v17__cta-btn { display: inline-block; padding: 0.85rem 2rem; background: #1a1a1a; color: #fff; text-decoration: none; font-size: 0.75rem; text-transform: uppercase; letter-spacing: 0.1em; }
    `}</style>
    <div className="sfh-v17__section">
      <div className="sfh-v17__dest-row">
        <div className="sfh-v17__dest-text">
          <span className="sfh-v17__dest-label">Destinations</span>
          <h3 className="sfh-v17__dest-title">Skip the Motorway</h3>
          <p className="sfh-v17__dest-para">Fly direct from Denham to wherever you need to be. No traffic, no waiting, no compromise.</p>
        </div>
        <div className="sfh-v17__dest-grid">
          {destinations.map(d => (
            <div key={d.name} className="sfh-v17__dest-card">
              <img src={d.img} alt={d.name} />
              <div className="sfh-v17__dest-card-overlay" />
              <div className="sfh-v17__dest-card-info">
                <span className="sfh-v17__dest-card-name">{d.name}</span>
                <span className="sfh-v17__dest-card-time">{d.time}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
      <div className="sfh-v17__fleet-row">
        <div className="sfh-v17__fleet-stack">
          {fleet.map(f => (
            <Link key={f.model} to={f.link} className="sfh-v17__fleet-card">
              <img src={f.img} alt={f.model} />
              <div>
                <div className="sfh-v17__fleet-card-model">{f.model}</div>
                <div className="sfh-v17__fleet-card-info">{f.seats}</div>
              </div>
              <span className="sfh-v17__fleet-card-rate">From {f.rate}</span>
            </Link>
          ))}
        </div>
        <div className="sfh-v17__fleet-text">
          <span className="sfh-v17__fleet-label">Our Fleet</span>
          <div className="sfh-v17__fleet-quote">"Each helicopter maintained in-house, fuelled, washed and ready on the pad for you."</div>
          <div className="sfh-v17__cta">
            <Link to="/contact?subject=hire" className="sfh-v17__cta-btn">Enquire Now</Link>
          </div>
        </div>
      </div>
    </div>
  </div>
);

// ─── VARIATION 18: Card Stack Combined ───
const V18 = () => (
  <div className="sfh-v18">
    <style>{`
      .sfh-v18 { background: #faf9f6; }
      .sfh-v18__cards { max-width: 1000px; margin: 0 auto; padding: 4rem 2rem; display: grid; grid-template-columns: repeat(3, 1fr); gap: 1.5rem; }
      .sfh-v18__card { background: #fff; border: 1px solid #e8e6e2; overflow: hidden; text-decoration: none; color: inherit; transition: all 0.3s; }
      .sfh-v18__card:hover { border-color: #1a1a1a; transform: translateY(-4px); box-shadow: 0 12px 30px rgba(0,0,0,0.08); }
      .sfh-v18__card-img { aspect-ratio: 16/9; overflow: hidden; position: relative; }
      .sfh-v18__card-img img { width: 100%; height: 100%; object-fit: contain; padding: 1rem; }
      .sfh-v18__card-body { padding: 1.5rem; }
      .sfh-v18__card-model { font-family: 'Space Grotesk', sans-serif; font-size: 1.5rem; font-weight: 700; text-transform: uppercase; color: #1a1a1a; margin-bottom: 0.25rem; }
      .sfh-v18__card-meta { font-size: 0.75rem; color: #888; margin-bottom: 1rem; }
      .sfh-v18__card-rate { display: block; font-family: 'Share Tech Mono', monospace; font-size: 1.1rem; color: #1a1a1a; margin-bottom: 1.25rem; }
      .sfh-v18__card-divider { height: 1px; background: #e8e6e2; margin-bottom: 1.25rem; }
      .sfh-v18__card-routes-label { font-size: 0.6rem; text-transform: uppercase; letter-spacing: 0.15em; color: #999; margin-bottom: 0.75rem; display: block; }
      .sfh-v18__card-route { display: flex; justify-content: space-between; padding: 0.3rem 0; }
      .sfh-v18__card-route-name { font-size: 0.75rem; color: #666; }
      .sfh-v18__card-route-time { font-family: 'Share Tech Mono', monospace; font-size: 0.75rem; color: #1a1a1a; }
      .sfh-v18__cta { text-align: center; padding: 2rem 2rem 5rem; }
      .sfh-v18__cta-btn { display: inline-block; padding: 1rem 2.5rem; background: #1a1a1a; color: #fff; text-decoration: none; font-size: 0.75rem; text-transform: uppercase; letter-spacing: 0.1em; }
    `}</style>
    <div className="sfh-v18__cards">
      {fleet.map(f => (
        <Link key={f.model} to={f.link} className="sfh-v18__card">
          <div className="sfh-v18__card-img"><img src={f.img} alt={f.model} /></div>
          <div className="sfh-v18__card-body">
            <div className="sfh-v18__card-model">{f.model}</div>
            <div className="sfh-v18__card-meta">{f.seats}</div>
            <span className="sfh-v18__card-rate">From {f.rate}</span>
            <div className="sfh-v18__card-divider" />
            <span className="sfh-v18__card-routes-label">Sample Flight Times</span>
            {destinations.map(d => (
              <div key={d.name} className="sfh-v18__card-route">
                <span className="sfh-v18__card-route-name">{d.name}</span>
                <span className="sfh-v18__card-route-time">{d.time}</span>
              </div>
            ))}
          </div>
        </Link>
      ))}
    </div>
    <div className="sfh-v18__cta"><Link to="/contact?subject=hire" className="sfh-v18__cta-btn">Enquire About Hire</Link></div>
  </div>
);

// ─── VARIATION 19: Full-Width Alternating Bands ───
const V19 = () => (
  <div className="sfh-v19">
    <style>{`
      .sfh-v19__band { padding: 4rem 2rem; }
      .sfh-v19__band--light { background: #faf9f6; }
      .sfh-v19__band--dark { background: #1a1a1a; color: #fff; }
      .sfh-v19__band--white { background: #fff; }
      .sfh-v19__band-inner { max-width: 1100px; margin: 0 auto; }
      .sfh-v19__band-label { display: block; font-size: 0.65rem; text-transform: uppercase; letter-spacing: 0.3em; color: #999; margin-bottom: 2rem; }
      .sfh-v19__band--dark .sfh-v19__band-label { color: rgba(255,255,255,0.4); }
      .sfh-v19__dest-flex { display: flex; justify-content: space-between; align-items: center; gap: 2rem; }
      .sfh-v19__dest-pair { text-align: center; flex: 1; }
      .sfh-v19__dest-name { display: block; font-family: 'Space Grotesk', sans-serif; font-size: 0.8rem; font-weight: 600; text-transform: uppercase; letter-spacing: 0.05em; color: rgba(255,255,255,0.5); margin-bottom: 0.25rem; }
      .sfh-v19__dest-time { display: block; font-family: 'Share Tech Mono', monospace; font-size: 1.8rem; color: #fff; }
      .sfh-v19__dest-vs { font-size: 0.55rem; color: rgba(255,255,255,0.25); }
      .sfh-v19__fleet-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 1.5rem; }
      .sfh-v19__fleet-card { border: 1px solid #e8e6e2; padding: 2rem; text-align: center; text-decoration: none; color: inherit; transition: all 0.3s; }
      .sfh-v19__fleet-card:hover { border-color: #1a1a1a; transform: translateY(-3px); }
      .sfh-v19__fleet-card img { height: 80px; object-fit: contain; margin-bottom: 1rem; }
      .sfh-v19__fleet-card h4 { font-family: 'Space Grotesk', sans-serif; font-size: 1.2rem; font-weight: 700; text-transform: uppercase; margin: 0 0 0.25rem; color: #1a1a1a; }
      .sfh-v19__fleet-card span { display: block; font-size: 0.75rem; color: #888; }
      .sfh-v19__fleet-card-rate { font-family: 'Share Tech Mono', monospace !important; color: #1a1a1a !important; font-size: 0.9rem !important; margin-top: 0.5rem; }
      .sfh-v19__quote-text { font-size: 1.3rem; color: #4a4a4a; line-height: 1.7; font-style: italic; text-align: center; max-width: 700px; margin: 0 auto; }
      .sfh-v19__quote-attr { display: block; font-size: 0.65rem; text-transform: uppercase; letter-spacing: 0.2em; color: #999; text-align: center; margin-top: 1.5rem; }
      .sfh-v19__cta-center { text-align: center; }
      .sfh-v19__cta-btn { display: inline-block; padding: 1rem 2.5rem; background: #1a1a1a; color: #fff; text-decoration: none; font-size: 0.75rem; text-transform: uppercase; letter-spacing: 0.1em; }
    `}</style>
    <div className="sfh-v19__band sfh-v19__band--dark">
      <div className="sfh-v19__band-inner">
        <span className="sfh-v19__band-label">Flight Times from Denham</span>
        <div className="sfh-v19__dest-flex">
          {destinations.map((d, i) => (
            <React.Fragment key={d.name}>
              <div className="sfh-v19__dest-pair">
                <span className="sfh-v19__dest-name">{d.name}</span>
                <span className="sfh-v19__dest-time">{d.time}</span>
                <span className="sfh-v19__dest-vs">vs {d.carTime} by car</span>
              </div>
              {i < destinations.length - 1 && <span style={{ color: 'rgba(255,255,255,0.1)', fontSize: '1.5rem' }}>|</span>}
            </React.Fragment>
          ))}
        </div>
      </div>
    </div>
    <div className="sfh-v19__band sfh-v19__band--light">
      <div className="sfh-v19__band-inner">
        <span className="sfh-v19__band-label">Our Fleet</span>
        <div className="sfh-v19__fleet-grid">
          {fleet.map(f => (
            <Link key={f.model} to={f.link} className="sfh-v19__fleet-card">
              <img src={f.img} alt={f.model} />
              <h4>{f.model}</h4>
              <span>{f.seats}</span>
              <span className="sfh-v19__fleet-card-rate">From {f.rate}</span>
            </Link>
          ))}
        </div>
      </div>
    </div>
    <div className="sfh-v19__band sfh-v19__band--white">
      <div className="sfh-v19__band-inner">
        <div className="sfh-v19__quote-text">"The helicopter isn't just transport — it's a lifestyle. Land at the golf course, arrive at the races, reach your country house for lunch."</div>
        <span className="sfh-v19__quote-attr">— The Freedom of Flight</span>
        <div style={{ height: '2rem' }} />
        <div className="sfh-v19__cta-center">
          <Link to="/contact?subject=hire" className="sfh-v19__cta-btn">Enquire About Hire</Link>
        </div>
      </div>
    </div>
  </div>
);

// ─── VARIATION 20: Interactive Map + Sidebar (Improved UK) ───
const V20 = () => {
  const [hoveredDest, setHoveredDest] = React.useState(null);
  // Denham is NW of London — placed accurately on UK outline. SVG viewBox is 500x700 to fit full UK + northern France
  const denham = { x: 310, y: 482 };
  // Destinations positioned relative to real UK geography
  const destCoords = [
    { name: 'The Cotswolds', x: 265, y: 460, time: '35 min', carTime: '1h 45min' },
    { name: 'Le Touquet', x: 340, y: 555, time: '55 min', carTime: '3h 30min' },
    { name: 'Scottish Highlands', x: 230, y: 180, time: '2h 45min', carTime: '8h+' },
    { name: 'Cornwall', x: 175, y: 530, time: '1h 30min', carTime: '4h 30min' },
  ];
  // Range ring radii: ~120kts cruise. 30min≈60nm, 1hr≈120nm, 2hr≈240nm. Scale: UK ~600mi tall ≈ 520nm, mapped to ~500 SVG units
  const r30 = 58; const r60 = 115; const r120 = 230;
  return (
    <div className="sfh-v20">
      <style>{`
        .sfh-v20 { background: #faf9f6; }
        .sfh-v20__map-section { max-width: 1100px; margin: 0 auto; padding: 4rem 2rem; display: grid; grid-template-columns: 1fr 320px; gap: 3rem; }
        .sfh-v20__map-container { background: #fff; border: 1px solid #e8e6e2; padding: 2rem; position: relative; }
        .sfh-v20__map-label { display: block; font-family: 'Share Tech Mono', monospace; font-size: 0.6rem; text-transform: uppercase; letter-spacing: 0.1em; color: #999; margin-bottom: 1rem; }
        .sfh-v20__map svg { width: 100%; height: auto; }
        .sfh-v20__map-pin { cursor: pointer; }
        .sfh-v20__map-pin text { font-family: 'Space Grotesk', sans-serif; font-size: 9px; font-weight: 600; fill: #1a1a1a; text-transform: uppercase; pointer-events: none; }
        .sfh-v20__range-label { font-family: 'Share Tech Mono', monospace; font-size: 7px; fill: #bbb; }
        .sfh-v20__sidebar-label { display: block; font-size: 0.65rem; text-transform: uppercase; letter-spacing: 0.3em; color: #999; margin-bottom: 2rem; }
        .sfh-v20__sidebar-fleet { display: flex; flex-direction: column; gap: 0.75rem; margin-bottom: 2rem; }
        .sfh-v20__sidebar-card { display: flex; align-items: center; gap: 1rem; padding: 1rem; border: 1px solid #e8e6e2; background: #fff; text-decoration: none; color: inherit; transition: border-color 0.3s; }
        .sfh-v20__sidebar-card:hover { border-color: #1a1a1a; }
        .sfh-v20__sidebar-card img { height: 35px; object-fit: contain; width: 55px; }
        .sfh-v20__sidebar-model { font-family: 'Space Grotesk', sans-serif; font-weight: 700; text-transform: uppercase; font-size: 0.85rem; color: #1a1a1a; }
        .sfh-v20__sidebar-info { font-size: 0.65rem; color: #888; }
        .sfh-v20__sidebar-rate { margin-left: auto; font-family: 'Share Tech Mono', monospace; font-size: 0.8rem; color: #1a1a1a; }
        .sfh-v20__sidebar-dest { padding: 1.5rem; border: 2px solid #1a1a1a; background: #fff; margin-bottom: 1.5rem; }
        .sfh-v20__sidebar-dest-name { font-family: 'Space Grotesk', sans-serif; font-size: 1rem; font-weight: 700; text-transform: uppercase; color: #1a1a1a; }
        .sfh-v20__sidebar-dest-time { font-family: 'Share Tech Mono', monospace; font-size: 1.5rem; color: #1a1a1a; margin-top: 0.25rem; display: block; }
        .sfh-v20__sidebar-dest-car { font-size: 0.7rem; color: #999; margin-top: 0.25rem; display: block; }
        .sfh-v20__sidebar-btn { display: block; width: 100%; padding: 1rem; background: #1a1a1a; color: #fff; text-decoration: none; font-size: 0.75rem; text-transform: uppercase; letter-spacing: 0.1em; text-align: center; }
      `}</style>
      <div className="sfh-v20__map-section">
        <div className="sfh-v20__map-container">
          <span className="sfh-v20__map-label">// RANGE MAP — FROM DENHAM AERODROME (EGLD)</span>
          <div className="sfh-v20__map">
            <svg viewBox="0 0 500 700" fill="none">
              {/* Range rings from Denham */}
              <circle cx={denham.x} cy={denham.y} r={r30} fill="none" stroke="#e8e6e2" strokeWidth="1" strokeDasharray="4 3" />
              <circle cx={denham.x} cy={denham.y} r={r60} fill="none" stroke="#d8d5d0" strokeWidth="1" strokeDasharray="6 4" />
              <circle cx={denham.x} cy={denham.y} r={r120} fill="none" stroke="#ccc8c3" strokeWidth="1" strokeDasharray="8 5" />
              {/* Range labels */}
              <text x={denham.x + r30 + 4} y={denham.y - 4} className="sfh-v20__range-label">30 MIN</text>
              <text x={denham.x + r60 + 4} y={denham.y - 4} className="sfh-v20__range-label">1 HR</text>
              <text x={denham.x + r120 + 4} y={denham.y - 4} className="sfh-v20__range-label">2 HR</text>

              {/* UK mainland — recognisable simplified outline */}
              <path d={`
                M235 95 L240 85 L252 78 L258 82 L255 92
                C253 98 248 108 245 115 L240 130 L238 145
                L233 160 L228 175 L225 185 L230 190 L238 185 L245 178
                L255 175 L262 180 L258 190 L250 198 L248 210
                L255 218 L265 215 L275 220 L278 230 L272 240
                L268 250 L272 258 L280 260 L288 255 L295 258
                L298 268 L292 278 L285 285 L280 295
                L278 308 L282 318 L290 325 L298 320 L305 315
                L312 318 L318 325 L325 332
                L332 340 L340 348 L348 358 L355 370
                L358 380 L355 392 L348 400 L340 410
                L335 420 L330 432 L328 442 L330 450
                L335 458 L340 465 L342 472 L338 478
                L330 482 L320 488 L315 498 L318 508
                L325 515 L328 522 L322 528
                L312 530 L305 525 L298 522 L290 525
                L278 532 L268 538 L258 535
                L248 530 L240 528 L232 535
                L220 542 L210 545 L198 540 L188 535
                L178 538 L168 545 L158 548
                L150 545 L148 535 L155 525
                L162 518 L170 508 L175 498
                L180 488 L185 475 L188 465
                L192 452 L198 440 L205 428
                L210 418 L215 405 L218 395 L215 385
                L210 378 L205 368 L200 355
                L195 342 L192 330 L195 318
                L200 305 L208 290 L215 278
                L220 265 L225 250 L228 238
                L230 225 L232 210 L230 195
                L225 180 L222 165 L225 150
                L228 138 L232 125 L235 112 L235 95 Z
              `} stroke="#d0cdc8" strokeWidth="1.5" fill="#f5f4f0" />

              {/* Scotland */}
              <path d={`
                M235 95 L228 88 L220 82 L215 75 L222 68
                L230 60 L225 52 L218 45 L225 38 L235 35
                L245 32 L252 38 L258 45 L255 55 L260 62
                L265 55 L272 50 L278 55 L275 65 L270 72
                L264 78 L258 82 L252 78 L240 85 L235 95 Z
              `} stroke="#d0cdc8" strokeWidth="1.5" fill="#f5f4f0" />

              {/* Wales bump */}
              <path d={`
                M200 355 L192 352 L182 355 L175 362 L170 372
                L168 382 L172 390 L178 398 L185 405 L192 410
                L198 418 L205 428
              `} stroke="#d0cdc8" strokeWidth="1.5" fill="none" />

              {/* Northern France coast hint */}
              <path d="M280 600 L310 595 L340 590 L370 592 L400 598 L430 605" stroke="#e8e6e2" strokeWidth="1" strokeDasharray="3 3" fill="none" />
              <text x="350" y="615" fontFamily="Share Tech Mono" fontSize="7" fill="#ccc" textAnchor="middle">FRANCE</text>

              {/* Denham base marker */}
              <circle cx={denham.x} cy={denham.y} r="6" fill="#1a1a1a" />
              <circle cx={denham.x} cy={denham.y} r="10" fill="none" stroke="#1a1a1a" strokeWidth="1" opacity="0.3" />
              <text x={denham.x + 14} y={denham.y + 3} fontFamily="Share Tech Mono" fontSize="8" fill="#1a1a1a" fontWeight="700">DENHAM (EGLD)</text>
              <text x={denham.x + 14} y={denham.y + 13} fontFamily="Share Tech Mono" fontSize="6" fill="#999">51.575°N / 0.506°W</text>

              {/* Route lines + destination pins */}
              {destCoords.map((d, i) => (
                <g key={d.name} className="sfh-v20__map-pin" onMouseEnter={() => setHoveredDest(i)} onMouseLeave={() => setHoveredDest(null)}>
                  <line x1={denham.x} y1={denham.y} x2={d.x} y2={d.y} stroke={hoveredDest === i ? '#1a1a1a' : '#ccc'} strokeWidth={hoveredDest === i ? 1.5 : 1} strokeDasharray="4 3" />
                  <circle cx={d.x} cy={d.y} r={hoveredDest === i ? 7 : 5} fill={hoveredDest === i ? '#1a1a1a' : '#999'} style={{ transition: 'all 0.2s' }} />
                  <text x={d.x + (d.x < denham.x ? -8 : 10)} y={d.y + (d.y < denham.y ? -8 : 14)} textAnchor={d.x < denham.x ? 'end' : 'start'}>{d.name}</text>
                </g>
              ))}
            </svg>
          </div>
        </div>
        <div className="sfh-v20__sidebar">
          <span className="sfh-v20__sidebar-label">Fleet</span>
          <div className="sfh-v20__sidebar-fleet">
            {fleet.map(f => (
              <Link key={f.model} to={f.link} className="sfh-v20__sidebar-card">
                <img src={f.img} alt={f.model} />
                <div>
                  <div className="sfh-v20__sidebar-model">{f.model}</div>
                  <div className="sfh-v20__sidebar-info">{f.seats}</div>
                </div>
                <span className="sfh-v20__sidebar-rate">{f.rate}</span>
              </Link>
            ))}
          </div>
          {hoveredDest !== null && (
            <div className="sfh-v20__sidebar-dest">
              <div className="sfh-v20__sidebar-dest-name">{destCoords[hoveredDest].name}</div>
              <span className="sfh-v20__sidebar-dest-time">{destCoords[hoveredDest].time}</span>
              <span className="sfh-v20__sidebar-dest-car">vs {destCoords[hoveredDest].carTime} by car</span>
            </div>
          )}
          <Link to="/contact?subject=hire" className="sfh-v20__sidebar-btn">Enquire About Hire</Link>
        </div>
      </div>
    </div>
  );
};

// ─── VARIATION 21: Dark Map with Glowing Range Rings ───
const V21 = () => {
  const [hoveredDest, setHoveredDest] = React.useState(null);
  const denham = { x: 310, y: 482 };
  const destCoords = [
    { name: 'The Cotswolds', x: 265, y: 460, time: '35 min', carTime: '1h 45min' },
    { name: 'Le Touquet', x: 340, y: 555, time: '55 min', carTime: '3h 30min' },
    { name: 'Scottish Highlands', x: 230, y: 180, time: '2h 45min', carTime: '8h+' },
    { name: 'Cornwall', x: 175, y: 530, time: '1h 30min', carTime: '4h 30min' },
  ];
  const r30 = 58; const r60 = 115; const r120 = 230;
  return (
    <div className="sfh-v21">
      <style>{`
        .sfh-v21 { background: #111; color: #fff; }
        .sfh-v21__wrap { max-width: 1100px; margin: 0 auto; padding: 4rem 2rem; display: grid; grid-template-columns: 1fr 300px; gap: 3rem; }
        .sfh-v21__map-box { background: #0a0a0a; border: 1px solid #222; padding: 2rem; }
        .sfh-v21__map-label { display: block; font-family: 'Share Tech Mono', monospace; font-size: 0.6rem; text-transform: uppercase; letter-spacing: 0.15em; color: #555; margin-bottom: 1rem; }
        .sfh-v21__map svg { width: 100%; height: auto; }
        .sfh-v21__pin { cursor: pointer; }
        .sfh-v21__pin text { font-family: 'Space Grotesk', sans-serif; font-size: 9px; font-weight: 600; fill: #ccc; text-transform: uppercase; }
        .sfh-v21__rlabel { font-family: 'Share Tech Mono', monospace; font-size: 7px; fill: #444; }
        .sfh-v21__sidebar-label { display: block; font-size: 0.65rem; text-transform: uppercase; letter-spacing: 0.3em; color: #555; margin-bottom: 1.5rem; }
        .sfh-v21__fleet-list { display: flex; flex-direction: column; gap: 0.75rem; margin-bottom: 2rem; }
        .sfh-v21__fleet-row { display: flex; align-items: center; gap: 1rem; padding: 0.75rem; border: 1px solid #222; text-decoration: none; color: #fff; transition: border-color 0.3s; }
        .sfh-v21__fleet-row:hover { border-color: #555; }
        .sfh-v21__fleet-row img { height: 32px; object-fit: contain; width: 50px; filter: brightness(1.1); }
        .sfh-v21__fleet-model { font-family: 'Space Grotesk', sans-serif; font-weight: 700; text-transform: uppercase; font-size: 0.8rem; }
        .sfh-v21__fleet-info { font-size: 0.6rem; color: #666; }
        .sfh-v21__fleet-rate { margin-left: auto; font-family: 'Share Tech Mono', monospace; font-size: 0.75rem; color: #aaa; }
        .sfh-v21__dest-detail { padding: 1.25rem; border: 1px solid #333; background: #151515; margin-bottom: 1.5rem; }
        .sfh-v21__dest-name { font-family: 'Space Grotesk', sans-serif; font-size: 0.95rem; font-weight: 700; text-transform: uppercase; }
        .sfh-v21__dest-time { font-family: 'Share Tech Mono', monospace; font-size: 1.4rem; display: block; margin-top: 0.25rem; color: #fff; }
        .sfh-v21__dest-car { font-size: 0.65rem; color: #666; display: block; margin-top: 0.2rem; }
        .sfh-v21__cta-btn { display: block; width: 100%; padding: 1rem; background: #fff; color: #111; text-decoration: none; font-size: 0.75rem; text-transform: uppercase; letter-spacing: 0.1em; text-align: center; font-family: 'Space Grotesk', sans-serif; font-weight: 600; transition: background 0.3s; }
        .sfh-v21__cta-btn:hover { background: #ddd; }
      `}</style>
      <div className="sfh-v21__wrap">
        <div className="sfh-v21__map-box">
          <span className="sfh-v21__map-label">// range map — denham aerodrome (EGLD)</span>
          <div className="sfh-v21__map">
            <svg viewBox="0 0 500 700" fill="none">
              <defs>
                <radialGradient id="v21glow1" cx="50%" cy="50%" r="50%"><stop offset="0%" stopColor="#fff" stopOpacity="0.06"/><stop offset="100%" stopColor="#fff" stopOpacity="0"/></radialGradient>
                <radialGradient id="v21glow2" cx="50%" cy="50%" r="50%"><stop offset="0%" stopColor="#fff" stopOpacity="0.03"/><stop offset="100%" stopColor="#fff" stopOpacity="0"/></radialGradient>
              </defs>
              <circle cx={denham.x} cy={denham.y} r={r30} fill="url(#v21glow1)" stroke="#333" strokeWidth="1" strokeDasharray="4 3" />
              <circle cx={denham.x} cy={denham.y} r={r60} fill="url(#v21glow2)" stroke="#2a2a2a" strokeWidth="1" strokeDasharray="6 4" />
              <circle cx={denham.x} cy={denham.y} r={r120} fill="none" stroke="#222" strokeWidth="1" strokeDasharray="8 5" />
              <text x={denham.x + r30 + 4} y={denham.y - 4} className="sfh-v21__rlabel">30 MIN</text>
              <text x={denham.x + r60 + 4} y={denham.y - 4} className="sfh-v21__rlabel">1 HR</text>
              <text x={denham.x + r120 + 4} y={denham.y - 4} className="sfh-v21__rlabel">2 HR</text>
              <path d="M235 95 L240 85 L252 78 L258 82 L255 92 C253 98 248 108 245 115 L240 130 L238 145 L233 160 L228 175 L225 185 L230 190 L238 185 L245 178 L255 175 L262 180 L258 190 L250 198 L248 210 L255 218 L265 215 L275 220 L278 230 L272 240 L268 250 L272 258 L280 260 L288 255 L295 258 L298 268 L292 278 L285 285 L280 295 L278 308 L282 318 L290 325 L298 320 L305 315 L312 318 L318 325 L325 332 L332 340 L340 348 L348 358 L355 370 L358 380 L355 392 L348 400 L340 410 L335 420 L330 432 L328 442 L330 450 L335 458 L340 465 L342 472 L338 478 L330 482 L320 488 L315 498 L318 508 L325 515 L328 522 L322 528 L312 530 L305 525 L298 522 L290 525 L278 532 L268 538 L258 535 L248 530 L240 528 L232 535 L220 542 L210 545 L198 540 L188 535 L178 538 L168 545 L158 548 L150 545 L148 535 L155 525 L162 518 L170 508 L175 498 L180 488 L185 475 L188 465 L192 452 L198 440 L205 428 L210 418 L215 405 L218 395 L215 385 L210 378 L205 368 L200 355 L195 342 L192 330 L195 318 L200 305 L208 290 L215 278 L220 265 L225 250 L228 238 L230 225 L232 210 L230 195 L225 180 L222 165 L225 150 L228 138 L232 125 L235 112 L235 95 Z" stroke="#2a2a2a" strokeWidth="1.5" fill="#151515" />
              <path d="M235 95 L228 88 L220 82 L215 75 L222 68 L230 60 L225 52 L218 45 L225 38 L235 35 L245 32 L252 38 L258 45 L255 55 L260 62 L265 55 L272 50 L278 55 L275 65 L270 72 L264 78 L258 82 L252 78 L240 85 L235 95 Z" stroke="#2a2a2a" strokeWidth="1.5" fill="#151515" />
              <path d="M280 600 L310 595 L340 590 L370 592 L400 598 L430 605" stroke="#1a1a1a" strokeWidth="1" strokeDasharray="3 3" fill="none" />
              <text x="350" y="615" fontFamily="Share Tech Mono" fontSize="7" fill="#333" textAnchor="middle">FRANCE</text>
              <circle cx={denham.x} cy={denham.y} r="6" fill="#fff" />
              <circle cx={denham.x} cy={denham.y} r="12" fill="none" stroke="#fff" strokeWidth="0.5" opacity="0.2" />
              <circle cx={denham.x} cy={denham.y} r="18" fill="none" stroke="#fff" strokeWidth="0.3" opacity="0.1" />
              <text x={denham.x + 14} y={denham.y + 3} fontFamily="Share Tech Mono" fontSize="8" fill="#fff" fontWeight="700">DENHAM (EGLD)</text>
              {destCoords.map((d, i) => (
                <g key={d.name} className="sfh-v21__pin" onMouseEnter={() => setHoveredDest(i)} onMouseLeave={() => setHoveredDest(null)}>
                  <line x1={denham.x} y1={denham.y} x2={d.x} y2={d.y} stroke={hoveredDest === i ? '#fff' : '#333'} strokeWidth={hoveredDest === i ? 1.5 : 0.75} strokeDasharray="4 3" />
                  <circle cx={d.x} cy={d.y} r={hoveredDest === i ? 7 : 4} fill={hoveredDest === i ? '#fff' : '#666'} style={{ transition: 'all 0.2s' }} />
                  {hoveredDest === i && <circle cx={d.x} cy={d.y} r="14" fill="none" stroke="#fff" strokeWidth="0.5" opacity="0.3" />}
                  <text x={d.x + (d.x < denham.x ? -8 : 10)} y={d.y + (d.y < denham.y ? -8 : 14)} textAnchor={d.x < denham.x ? 'end' : 'start'}>{d.name}</text>
                </g>
              ))}
            </svg>
          </div>
        </div>
        <div className="sfh-v21__sidebar">
          <span className="sfh-v21__sidebar-label">Fleet</span>
          <div className="sfh-v21__fleet-list">
            {fleet.map(f => (
              <Link key={f.model} to={f.link} className="sfh-v21__fleet-row">
                <img src={f.img} alt={f.model} />
                <div><div className="sfh-v21__fleet-model">{f.model}</div><div className="sfh-v21__fleet-info">{f.seats}</div></div>
                <span className="sfh-v21__fleet-rate">{f.rate}</span>
              </Link>
            ))}
          </div>
          {hoveredDest !== null && (
            <div className="sfh-v21__dest-detail">
              <div className="sfh-v21__dest-name">{destCoords[hoveredDest].name}</div>
              <span className="sfh-v21__dest-time">{destCoords[hoveredDest].time}</span>
              <span className="sfh-v21__dest-car">vs {destCoords[hoveredDest].carTime} by car</span>
            </div>
          )}
          <Link to="/contact?subject=hire" className="sfh-v21__cta-btn">Enquire About Hire</Link>
        </div>
      </div>
    </div>
  );
};

// ─── VARIATION 22: Radial Range Diagram ───
const V22 = () => {
  const [activeDest, setActiveDest] = React.useState(null);
  const cx = 250; const cy = 250;
  const destData = [
    { name: 'The Cotswolds', time: '35 min', carTime: '1h 45min', angle: -120, dist: 60 },
    { name: 'Le Touquet', time: '55 min', carTime: '3h 30min', angle: 135, dist: 95 },
    { name: 'Scottish Highlands', time: '2h 45min', carTime: '8h+', angle: -15, dist: 210 },
    { name: 'Cornwall', time: '1h 30min', carTime: '4h 30min', angle: -155, dist: 150 },
  ];
  const toXY = (angle, dist) => ({
    x: cx + dist * Math.cos((angle * Math.PI) / 180),
    y: cy + dist * Math.sin((angle * Math.PI) / 180),
  });
  return (
    <div className="sfh-v22">
      <style>{`
        .sfh-v22 { background: #faf9f6; }
        .sfh-v22__wrap { max-width: 900px; margin: 0 auto; padding: 4rem 2rem 5rem; text-align: center; }
        .sfh-v22__label { display: block; font-size: 0.7rem; text-transform: uppercase; letter-spacing: 0.25em; color: #999; margin-bottom: 2rem; }
        .sfh-v22__diagram { max-width: 500px; margin: 0 auto 3rem; }
        .sfh-v22__diagram svg { width: 100%; height: auto; }
        .sfh-v22__ring-label { font-family: 'Share Tech Mono', monospace; font-size: 8px; fill: #bbb; }
        .sfh-v22__dest-label { font-family: 'Space Grotesk', sans-serif; font-size: 9px; font-weight: 600; fill: #1a1a1a; text-transform: uppercase; cursor: pointer; }
        .sfh-v22__dest-time { font-family: 'Share Tech Mono', monospace; font-size: 8px; fill: #888; }
        .sfh-v22__fleet { display: grid; grid-template-columns: repeat(3, 1fr); gap: 1.5rem; max-width: 800px; margin: 0 auto 2rem; }
        .sfh-v22__fleet-card { border: 1px solid #e8e6e2; padding: 1.5rem; text-align: center; text-decoration: none; color: inherit; transition: border-color 0.3s, transform 0.3s; }
        .sfh-v22__fleet-card:hover { border-color: #1a1a1a; transform: translateY(-2px); }
        .sfh-v22__fleet-card img { height: 60px; object-fit: contain; margin-bottom: 0.75rem; }
        .sfh-v22__fleet-model { font-family: 'Space Grotesk', sans-serif; font-size: 1rem; font-weight: 700; text-transform: uppercase; color: #1a1a1a; }
        .sfh-v22__fleet-meta { font-size: 0.7rem; color: #888; margin-top: 0.25rem; }
        .sfh-v22__fleet-rate { font-family: 'Share Tech Mono', monospace; font-size: 0.85rem; color: #1a1a1a; display: block; margin-top: 0.25rem; }
        .sfh-v22__cta { text-align: center; }
        .sfh-v22__cta-btn { display: inline-block; padding: 1rem 2.5rem; background: #1a1a1a; color: #fff; text-decoration: none; font-size: 0.75rem; text-transform: uppercase; letter-spacing: 0.1em; }
        .sfh-v22__cta-btn:hover { background: #333; }
      `}</style>
      <div className="sfh-v22__wrap">
        <span className="sfh-v22__label">Flight Range From Denham</span>
        <div className="sfh-v22__diagram">
          <svg viewBox="0 0 500 500" fill="none">
            {[60, 95, 150, 210].map((r, i) => (
              <circle key={r} cx={cx} cy={cy} r={r} fill="none" stroke="#e8e6e2" strokeWidth="1" strokeDasharray="4 3" />
            ))}
            <text x={cx + 62} y={cy - 3} className="sfh-v22__ring-label">30 MIN</text>
            <text x={cx + 97} y={cy - 3} className="sfh-v22__ring-label">1 HR</text>
            <text x={cx + 152} y={cy - 3} className="sfh-v22__ring-label">1.5 HR</text>
            <text x={cx + 212} y={cy - 3} className="sfh-v22__ring-label">3 HR</text>
            <circle cx={cx} cy={cy} r="5" fill="#1a1a1a" />
            <text x={cx} y={cy + 18} textAnchor="middle" fontFamily="Share Tech Mono" fontSize="7" fill="#999">DENHAM</text>
            {destData.map((d, i) => {
              const p = toXY(d.angle, d.dist);
              const isActive = activeDest === i;
              return (
                <g key={d.name} onMouseEnter={() => setActiveDest(i)} onMouseLeave={() => setActiveDest(null)} style={{ cursor: 'pointer' }}>
                  <line x1={cx} y1={cy} x2={p.x} y2={p.y} stroke={isActive ? '#1a1a1a' : '#ddd'} strokeWidth={isActive ? 1.5 : 0.75} strokeDasharray="3 3" />
                  <circle cx={p.x} cy={p.y} r={isActive ? 7 : 4} fill={isActive ? '#1a1a1a' : '#999'} style={{ transition: 'all 0.2s' }} />
                  <text x={p.x + (d.angle > 90 || d.angle < -90 ? -10 : 10)} y={p.y - 8} textAnchor={d.angle > 90 || d.angle < -90 ? 'end' : 'start'} className="sfh-v22__dest-label">{d.name}</text>
                  <text x={p.x + (d.angle > 90 || d.angle < -90 ? -10 : 10)} y={p.y + 4} textAnchor={d.angle > 90 || d.angle < -90 ? 'end' : 'start'} className="sfh-v22__dest-time">{d.time} fly / {d.carTime} drive</text>
                </g>
              );
            })}
          </svg>
        </div>
        <div className="sfh-v22__fleet">
          {fleet.map(f => (
            <Link key={f.model} to={f.link} className="sfh-v22__fleet-card">
              <img src={f.img} alt={f.model} />
              <div className="sfh-v22__fleet-model">{f.model}</div>
              <div className="sfh-v22__fleet-meta">{f.seats}</div>
              <span className="sfh-v22__fleet-rate">From {f.rate}</span>
            </Link>
          ))}
        </div>
        <div className="sfh-v22__cta">
          <Link to="/contact?subject=hire" className="sfh-v22__cta-btn">Enquire About Hire</Link>
        </div>
      </div>
    </div>
  );
};

// ─── VARIATION 23: Full-Width Map with Fleet Bar ───
const V23 = () => {
  const [hoveredDest, setHoveredDest] = React.useState(null);
  const denham = { x: 310, y: 482 };
  const destCoords = [
    { name: 'The Cotswolds', x: 265, y: 460, time: '35 min', carTime: '1h 45min' },
    { name: 'Le Touquet', x: 340, y: 555, time: '55 min', carTime: '3h 30min' },
    { name: 'Scottish Highlands', x: 230, y: 180, time: '2h 45min', carTime: '8h+' },
    { name: 'Cornwall', x: 175, y: 530, time: '1h 30min', carTime: '4h 30min' },
  ];
  const r30 = 58; const r60 = 115; const r120 = 230;
  return (
    <div className="sfh-v23">
      <style>{`
        .sfh-v23 { background: #faf9f6; }
        .sfh-v23__map-full { width: 100%; background: #f5f4f0; border-top: 1px solid #e8e6e2; border-bottom: 1px solid #e8e6e2; padding: 2rem 0; display: flex; justify-content: center; position: relative; }
        .sfh-v23__map-full svg { width: 100%; max-width: 700px; height: auto; }
        .sfh-v23__map-pin { cursor: pointer; }
        .sfh-v23__map-pin text { font-family: 'Space Grotesk', sans-serif; font-size: 9px; font-weight: 600; fill: #1a1a1a; text-transform: uppercase; }
        .sfh-v23__rlabel { font-family: 'Share Tech Mono', monospace; font-size: 7px; fill: #bbb; }
        .sfh-v23__dest-tooltip { position: absolute; bottom: 2rem; left: 50%; transform: translateX(-50%); background: #1a1a1a; color: #fff; padding: 1rem 1.5rem; font-family: 'Space Grotesk', sans-serif; font-size: 0.85rem; white-space: nowrap; pointer-events: none; }
        .sfh-v23__dest-tooltip span { font-family: 'Share Tech Mono', monospace; margin-left: 1rem; opacity: 0.7; }
        .sfh-v23__fleet-bar { display: flex; justify-content: center; gap: 2rem; padding: 2.5rem 2rem; max-width: 1100px; margin: 0 auto; }
        .sfh-v23__fleet-item { display: flex; align-items: center; gap: 1rem; text-decoration: none; color: inherit; padding: 0.75rem 1.25rem; border: 1px solid #e8e6e2; transition: border-color 0.3s; }
        .sfh-v23__fleet-item:hover { border-color: #1a1a1a; }
        .sfh-v23__fleet-item img { height: 35px; object-fit: contain; }
        .sfh-v23__fleet-name { font-family: 'Space Grotesk', sans-serif; font-weight: 700; font-size: 0.85rem; text-transform: uppercase; color: #1a1a1a; }
        .sfh-v23__fleet-detail { font-size: 0.65rem; color: #888; }
        .sfh-v23__fleet-rate { font-family: 'Share Tech Mono', monospace; font-size: 0.8rem; color: #1a1a1a; margin-left: 0.5rem; }
        .sfh-v23__cta { text-align: center; padding: 0 2rem 4rem; }
        .sfh-v23__cta-btn { display: inline-block; padding: 1rem 2.5rem; background: #1a1a1a; color: #fff; text-decoration: none; font-size: 0.75rem; text-transform: uppercase; letter-spacing: 0.1em; }
      `}</style>
      <div className="sfh-v23__map-full">
        <svg viewBox="0 0 500 700" fill="none">
          <circle cx={denham.x} cy={denham.y} r={r30} fill="none" stroke="#e0ddd8" strokeWidth="1" strokeDasharray="4 3" />
          <circle cx={denham.x} cy={denham.y} r={r60} fill="none" stroke="#d8d5d0" strokeWidth="1" strokeDasharray="6 4" />
          <circle cx={denham.x} cy={denham.y} r={r120} fill="none" stroke="#d0cdc8" strokeWidth="1" strokeDasharray="8 5" />
          <text x={denham.x + r30 + 4} y={denham.y - 4} className="sfh-v23__rlabel">30 MIN</text>
          <text x={denham.x + r60 + 4} y={denham.y - 4} className="sfh-v23__rlabel">1 HR</text>
          <text x={denham.x + r120 + 4} y={denham.y - 4} className="sfh-v23__rlabel">2 HR</text>
          <path d="M235 95 L240 85 L252 78 L258 82 L255 92 C253 98 248 108 245 115 L240 130 L238 145 L233 160 L228 175 L225 185 L230 190 L238 185 L245 178 L255 175 L262 180 L258 190 L250 198 L248 210 L255 218 L265 215 L275 220 L278 230 L272 240 L268 250 L272 258 L280 260 L288 255 L295 258 L298 268 L292 278 L285 285 L280 295 L278 308 L282 318 L290 325 L298 320 L305 315 L312 318 L318 325 L325 332 L332 340 L340 348 L348 358 L355 370 L358 380 L355 392 L348 400 L340 410 L335 420 L330 432 L328 442 L330 450 L335 458 L340 465 L342 472 L338 478 L330 482 L320 488 L315 498 L318 508 L325 515 L328 522 L322 528 L312 530 L305 525 L298 522 L290 525 L278 532 L268 538 L258 535 L248 530 L240 528 L232 535 L220 542 L210 545 L198 540 L188 535 L178 538 L168 545 L158 548 L150 545 L148 535 L155 525 L162 518 L170 508 L175 498 L180 488 L185 475 L188 465 L192 452 L198 440 L205 428 L210 418 L215 405 L218 395 L215 385 L210 378 L205 368 L200 355 L195 342 L192 330 L195 318 L200 305 L208 290 L215 278 L220 265 L225 250 L228 238 L230 225 L232 210 L230 195 L225 180 L222 165 L225 150 L228 138 L232 125 L235 112 L235 95 Z" stroke="#d0cdc8" strokeWidth="1.5" fill="#edece8" />
          <path d="M235 95 L228 88 L220 82 L215 75 L222 68 L230 60 L225 52 L218 45 L225 38 L235 35 L245 32 L252 38 L258 45 L255 55 L260 62 L265 55 L272 50 L278 55 L275 65 L270 72 L264 78 L258 82 L252 78 L240 85 L235 95 Z" stroke="#d0cdc8" strokeWidth="1.5" fill="#edece8" />
          <path d="M280 600 L310 595 L340 590 L370 592 L400 598 L430 605" stroke="#e8e6e2" strokeWidth="1" strokeDasharray="3 3" fill="none" />
          <circle cx={denham.x} cy={denham.y} r="6" fill="#1a1a1a" />
          <text x={denham.x + 14} y={denham.y + 4} fontFamily="Share Tech Mono" fontSize="8" fill="#1a1a1a" fontWeight="700">DENHAM</text>
          {destCoords.map((d, i) => (
            <g key={d.name} className="sfh-v23__map-pin" onMouseEnter={() => setHoveredDest(i)} onMouseLeave={() => setHoveredDest(null)}>
              <line x1={denham.x} y1={denham.y} x2={d.x} y2={d.y} stroke={hoveredDest === i ? '#1a1a1a' : '#ccc'} strokeWidth={hoveredDest === i ? 1.5 : 1} strokeDasharray="4 3" />
              <circle cx={d.x} cy={d.y} r={hoveredDest === i ? 7 : 5} fill={hoveredDest === i ? '#1a1a1a' : '#999'} style={{ transition: 'all 0.2s' }} />
              <text x={d.x + (d.x < denham.x ? -8 : 10)} y={d.y + (d.y < denham.y ? -8 : 14)} textAnchor={d.x < denham.x ? 'end' : 'start'}>{d.name}</text>
            </g>
          ))}
        </svg>
        {hoveredDest !== null && (
          <div className="sfh-v23__dest-tooltip">
            {destCoords[hoveredDest].name} <span>{destCoords[hoveredDest].time} fly / {destCoords[hoveredDest].carTime} drive</span>
          </div>
        )}
      </div>
      <div className="sfh-v23__fleet-bar">
        {fleet.map(f => (
          <Link key={f.model} to={f.link} className="sfh-v23__fleet-item">
            <img src={f.img} alt={f.model} />
            <div>
              <div className="sfh-v23__fleet-name">{f.model}</div>
              <div className="sfh-v23__fleet-detail">{f.seats}</div>
            </div>
            <span className="sfh-v23__fleet-rate">{f.rate}</span>
          </Link>
        ))}
      </div>
      <div className="sfh-v23__cta">
        <Link to="/contact?subject=hire" className="sfh-v23__cta-btn">Enquire About Hire</Link>
      </div>
    </div>
  );
};

// ─── VARIATION 24: Horizontal Journey Steps ───
const V24 = () => (
  <div className="sfh-v24">
    <style>{`
      .sfh-v24 { background: #faf9f6; }
      .sfh-v24__wrap { max-width: 1100px; margin: 0 auto; padding: 4rem 2rem 5rem; }
      .sfh-v24__steps { display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 0; position: relative; }
      .sfh-v24__steps::before { content: ''; position: absolute; top: 20px; left: 20px; right: 20px; height: 1px; background: #e8e6e2; }
      .sfh-v24__step { padding: 0 1.5rem; position: relative; }
      .sfh-v24__step-num { display: flex; align-items: center; justify-content: center; width: 40px; height: 40px; border-radius: 50%; border: 1px solid #e8e6e2; font-family: 'Share Tech Mono', monospace; font-size: 0.7rem; color: #999; background: #faf9f6; position: relative; z-index: 1; margin-bottom: 1.5rem; }
      .sfh-v24__step-title { font-family: 'Space Grotesk', sans-serif; font-size: 1.1rem; font-weight: 700; text-transform: uppercase; color: #1a1a1a; margin-bottom: 0.5rem; }
      .sfh-v24__step-text { font-size: 0.9rem; color: #666; line-height: 1.6; margin-bottom: 1rem; }
      .sfh-v24__dest-chips { display: flex; flex-wrap: wrap; gap: 0.5rem; }
      .sfh-v24__chip { display: inline-flex; align-items: center; gap: 0.4rem; padding: 0.4rem 0.65rem; border: 1px solid #e8e6e2; font-size: 0.7rem; background: #fff; }
      .sfh-v24__chip-name { font-weight: 600; color: #1a1a1a; }
      .sfh-v24__chip-time { font-family: 'Share Tech Mono', monospace; color: #888; }
      .sfh-v24__fleet-mini { display: flex; align-items: center; gap: 0.75rem; padding: 0.6rem 0.75rem; border: 1px solid #e8e6e2; background: #fff; text-decoration: none; color: inherit; transition: border-color 0.3s; margin-bottom: 0.5rem; }
      .sfh-v24__fleet-mini:hover { border-color: #1a1a1a; }
      .sfh-v24__fleet-mini img { height: 28px; object-fit: contain; }
      .sfh-v24__fleet-model { font-family: 'Space Grotesk', sans-serif; font-weight: 700; text-transform: uppercase; font-size: 0.8rem; color: #1a1a1a; }
      .sfh-v24__fleet-rate { margin-left: auto; font-family: 'Share Tech Mono', monospace; font-size: 0.7rem; color: #888; }
      .sfh-v24__cta-btn { display: inline-block; padding: 0.85rem 2rem; background: #1a1a1a; color: #fff; text-decoration: none; font-size: 0.75rem; text-transform: uppercase; letter-spacing: 0.1em; margin-top: 0.5rem; }
      .sfh-v24__cta-btn:hover { background: #333; }
    `}</style>
    <div className="sfh-v24__wrap">
      <div className="sfh-v24__steps">
        <div className="sfh-v24__step">
          <span className="sfh-v24__step-num">01</span>
          <div className="sfh-v24__step-title">Choose Destination</div>
          <div className="sfh-v24__step-text">Skip the motorway. Fly direct from Denham to wherever you need to be.</div>
          <div className="sfh-v24__dest-chips">
            {destinations.map(d => (
              <div key={d.name} className="sfh-v24__chip">
                <span className="sfh-v24__chip-name">{d.name}</span>
                <span className="sfh-v24__chip-time">{d.time}</span>
              </div>
            ))}
          </div>
        </div>
        <div className="sfh-v24__step">
          <span className="sfh-v24__step-num">02</span>
          <div className="sfh-v24__step-title">Select Aircraft</div>
          <div className="sfh-v24__step-text">From the nimble R22 to the turbine R66. Fuelled and waiting.</div>
          {fleet.map(f => (
            <Link key={f.model} to={f.link} className="sfh-v24__fleet-mini">
              <img src={f.img} alt={f.model} />
              <span className="sfh-v24__fleet-model">{f.model}</span>
              <span className="sfh-v24__fleet-rate">{f.rate}</span>
            </Link>
          ))}
        </div>
        <div className="sfh-v24__step">
          <span className="sfh-v24__step-num">03</span>
          <div className="sfh-v24__step-title">Fly</div>
          <div className="sfh-v24__step-text">No crew, no waiting, no compromise. Available by the hour, day or week. Your licence, your aircraft, your schedule.</div>
          <Link to="/contact?subject=hire" className="sfh-v24__cta-btn">Get Started</Link>
        </div>
      </div>
    </div>
  </div>
);

// ─── VARIATION 25: Narrative with Images ───
const V25 = () => (
  <div className="sfh-v25">
    <style>{`
      .sfh-v25 { background: #faf9f6; }
      .sfh-v25__wrap { max-width: 900px; margin: 0 auto; padding: 4rem 2rem 5rem; }
      .sfh-v25__step { display: grid; grid-template-columns: 1fr 1fr; gap: 3rem; align-items: center; margin-bottom: 4rem; }
      .sfh-v25__step:nth-child(even) { direction: rtl; }
      .sfh-v25__step:nth-child(even) > * { direction: ltr; }
      .sfh-v25__step-img { aspect-ratio: 4/3; overflow: hidden; border: 1px solid #e8e6e2; }
      .sfh-v25__step-img img { width: 100%; height: 100%; object-fit: cover; }
      .sfh-v25__step-num { font-family: 'Share Tech Mono', monospace; font-size: 0.65rem; color: #999; text-transform: uppercase; letter-spacing: 0.2em; margin-bottom: 0.5rem; display: block; }
      .sfh-v25__step-title { font-family: 'Space Grotesk', sans-serif; font-size: 1.3rem; font-weight: 700; text-transform: uppercase; color: #1a1a1a; margin-bottom: 0.75rem; }
      .sfh-v25__step-text { font-size: 0.95rem; color: #666; line-height: 1.7; margin-bottom: 1rem; }
      .sfh-v25__chips { display: flex; flex-wrap: wrap; gap: 0.5rem; }
      .sfh-v25__chip { padding: 0.35rem 0.6rem; border: 1px solid #e8e6e2; font-size: 0.7rem; background: #fff; }
      .sfh-v25__chip strong { color: #1a1a1a; }
      .sfh-v25__chip span { font-family: 'Share Tech Mono', monospace; color: #888; margin-left: 0.35rem; }
      .sfh-v25__fleet-mini { display: flex; align-items: center; gap: 0.75rem; padding: 0.6rem 0.75rem; border: 1px solid #e8e6e2; background: #fff; text-decoration: none; color: inherit; transition: border-color 0.3s; margin-bottom: 0.5rem; }
      .sfh-v25__fleet-mini:hover { border-color: #1a1a1a; }
      .sfh-v25__fleet-mini img { height: 30px; object-fit: contain; }
      .sfh-v25__fleet-model { font-family: 'Space Grotesk', sans-serif; font-weight: 700; text-transform: uppercase; font-size: 0.8rem; }
      .sfh-v25__fleet-rate { margin-left: auto; font-family: 'Share Tech Mono', monospace; font-size: 0.7rem; color: #888; }
      .sfh-v25__cta { text-align: center; }
      .sfh-v25__cta-btn { display: inline-block; padding: 1rem 2.5rem; background: #1a1a1a; color: #fff; text-decoration: none; font-size: 0.75rem; text-transform: uppercase; letter-spacing: 0.1em; }
      .sfh-v25__cta-btn:hover { background: #333; }
    `}</style>
    <div className="sfh-v25__wrap">
      <div className="sfh-v25__step">
        <div className="sfh-v25__step-img"><img src="/assets/images/destinations/cotswolds-aerial.jpg" alt="Destinations" /></div>
        <div>
          <span className="sfh-v25__step-num">Step 01</span>
          <div className="sfh-v25__step-title">Choose Your Destination</div>
          <div className="sfh-v25__step-text">Skip the motorway. Fly direct from Denham to wherever you need to be.</div>
          <div className="sfh-v25__chips">
            {destinations.map(d => (
              <div key={d.name} className="sfh-v25__chip"><strong>{d.name}</strong><span>{d.time}</span></div>
            ))}
          </div>
        </div>
      </div>
      <div className="sfh-v25__step">
        <div className="sfh-v25__step-img"><img src="/assets/images/new-aircraft/r44/raven-ii-front-alpha.png" alt="Fleet" /></div>
        <div>
          <span className="sfh-v25__step-num">Step 02</span>
          <div className="sfh-v25__step-title">Select Your Aircraft</div>
          <div className="sfh-v25__step-text">From the nimble R22 to the turbine-powered R66. Each fuelled, washed and waiting on the pad.</div>
          {fleet.map(f => (
            <Link key={f.model} to={f.link} className="sfh-v25__fleet-mini">
              <img src={f.img} alt={f.model} />
              <span className="sfh-v25__fleet-model">{f.model}</span>
              <span className="sfh-v25__fleet-rate">From {f.rate}</span>
            </Link>
          ))}
        </div>
      </div>
      <div className="sfh-v25__step">
        <div className="sfh-v25__step-img"><img src="/assets/images/destinations/scottish-highlands.jpg" alt="Fly" /></div>
        <div>
          <span className="sfh-v25__step-num">Step 03</span>
          <div className="sfh-v25__step-title">Fly</div>
          <div className="sfh-v25__step-text">No crew, no waiting, no compromise. Available by the hour, day or week. Your licence, your aircraft, your schedule.</div>
          <Link to="/contact?subject=hire" className="sfh-v25__cta-btn">Get Started</Link>
        </div>
      </div>
    </div>
  </div>
);

// ─── VARIATION 26: Accordion Steps ───
const V26 = () => {
  const [openStep, setOpenStep] = React.useState(0);
  const steps = [
    { num: '01', title: 'Choose Your Destination', text: 'Skip the motorway. Fly direct from Denham to wherever you need to be.', type: 'destinations' },
    { num: '02', title: 'Select Your Aircraft', text: 'From the nimble R22 to the turbine-powered R66. Each fuelled, washed and waiting on the pad.', type: 'fleet' },
    { num: '03', title: 'Fly', text: 'No crew, no waiting, no compromise. Available by the hour, day or week. Your licence, your aircraft, your schedule.', type: 'cta' },
  ];
  return (
    <div className="sfh-v26">
      <style>{`
        .sfh-v26 { background: #faf9f6; }
        .sfh-v26__wrap { max-width: 700px; margin: 0 auto; padding: 4rem 2rem 5rem; }
        .sfh-v26__item { border-bottom: 1px solid #e8e6e2; }
        .sfh-v26__header { display: flex; align-items: center; gap: 1rem; padding: 1.5rem 0; cursor: pointer; width: 100%; background: none; border: none; text-align: left; }
        .sfh-v26__header:hover .sfh-v26__title { color: #4a4a4a; }
        .sfh-v26__num { font-family: 'Share Tech Mono', monospace; font-size: 0.7rem; color: #999; width: 30px; flex-shrink: 0; }
        .sfh-v26__title { font-family: 'Space Grotesk', sans-serif; font-size: 1.1rem; font-weight: 700; text-transform: uppercase; color: #1a1a1a; flex: 1; transition: color 0.3s; }
        .sfh-v26__icon { font-family: 'Share Tech Mono', monospace; font-size: 1.2rem; color: #999; transition: transform 0.3s; }
        .sfh-v26__icon--open { transform: rotate(45deg); }
        .sfh-v26__body { overflow: hidden; max-height: 0; transition: max-height 0.4s ease, padding 0.4s ease; padding: 0 0 0 46px; }
        .sfh-v26__body--open { max-height: 500px; padding: 0 0 1.5rem 46px; }
        .sfh-v26__text { font-size: 0.95rem; color: #666; line-height: 1.6; margin-bottom: 1rem; }
        .sfh-v26__chips { display: flex; flex-wrap: wrap; gap: 0.5rem; }
        .sfh-v26__chip { display: inline-flex; gap: 0.4rem; padding: 0.4rem 0.65rem; border: 1px solid #e8e6e2; font-size: 0.7rem; background: #fff; }
        .sfh-v26__chip strong { color: #1a1a1a; }
        .sfh-v26__chip span { font-family: 'Share Tech Mono', monospace; color: #888; }
        .sfh-v26__fleet-row { display: flex; align-items: center; gap: 0.75rem; padding: 0.6rem 0.75rem; border: 1px solid #e8e6e2; background: #fff; text-decoration: none; color: inherit; margin-bottom: 0.5rem; transition: border-color 0.3s; }
        .sfh-v26__fleet-row:hover { border-color: #1a1a1a; }
        .sfh-v26__fleet-row img { height: 30px; object-fit: contain; }
        .sfh-v26__fleet-model { font-family: 'Space Grotesk', sans-serif; font-weight: 700; text-transform: uppercase; font-size: 0.8rem; }
        .sfh-v26__fleet-rate { margin-left: auto; font-family: 'Share Tech Mono', monospace; font-size: 0.7rem; color: #888; }
        .sfh-v26__cta-btn { display: inline-block; padding: 0.85rem 2rem; background: #1a1a1a; color: #fff; text-decoration: none; font-size: 0.75rem; text-transform: uppercase; letter-spacing: 0.1em; }
      `}</style>
      <div className="sfh-v26__wrap">
        {steps.map((s, i) => (
          <div key={s.num} className="sfh-v26__item">
            <button className="sfh-v26__header" onClick={() => setOpenStep(openStep === i ? -1 : i)}>
              <span className="sfh-v26__num">{s.num}</span>
              <span className="sfh-v26__title">{s.title}</span>
              <span className={`sfh-v26__icon ${openStep === i ? 'sfh-v26__icon--open' : ''}`}>+</span>
            </button>
            <div className={`sfh-v26__body ${openStep === i ? 'sfh-v26__body--open' : ''}`}>
              <div className="sfh-v26__text">{s.text}</div>
              {s.type === 'destinations' && (
                <div className="sfh-v26__chips">
                  {destinations.map(d => (
                    <div key={d.name} className="sfh-v26__chip"><strong>{d.name}</strong><span>{d.time}</span></div>
                  ))}
                </div>
              )}
              {s.type === 'fleet' && fleet.map(f => (
                <Link key={f.model} to={f.link} className="sfh-v26__fleet-row">
                  <img src={f.img} alt={f.model} />
                  <span className="sfh-v26__fleet-model">{f.model}</span>
                  <span className="sfh-v26__fleet-rate">From {f.rate}</span>
                </Link>
              ))}
              {s.type === 'cta' && <Link to="/contact?subject=hire" className="sfh-v26__cta-btn">Enquire Now</Link>}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

// ─── VARIATION 27: Tab Switcher ───
const V27 = () => {
  const [activeTab, setActiveTab] = React.useState(0);
  const tabLabels = ['Destinations', 'Fleet', 'Book'];
  return (
    <div className="sfh-v27">
      <style>{`
        .sfh-v27 { background: #faf9f6; }
        .sfh-v27__wrap { max-width: 900px; margin: 0 auto; padding: 4rem 2rem 5rem; }
        .sfh-v27__tabs { display: flex; border-bottom: 1px solid #e8e6e2; margin-bottom: 2.5rem; }
        .sfh-v27__tab { padding: 0.75rem 1.5rem; background: none; border: none; cursor: pointer; font-family: 'Space Grotesk', sans-serif; font-size: 0.8rem; font-weight: 600; text-transform: uppercase; letter-spacing: 0.1em; color: #999; position: relative; transition: color 0.3s; }
        .sfh-v27__tab--active { color: #1a1a1a; }
        .sfh-v27__tab--active::after { content: ''; position: absolute; bottom: -1px; left: 0; right: 0; height: 2px; background: #1a1a1a; }
        .sfh-v27__panel { animation: sfh-v27-fade 0.3s ease; }
        @keyframes sfh-v27-fade { from { opacity: 0; transform: translateY(8px); } to { opacity: 1; transform: translateY(0); } }
        .sfh-v27__dest-grid { display: grid; grid-template-columns: repeat(2, 1fr); gap: 1.25rem; }
        .sfh-v27__dest-card { border: 1px solid #e8e6e2; overflow: hidden; transition: border-color 0.3s; }
        .sfh-v27__dest-card:hover { border-color: #1a1a1a; }
        .sfh-v27__dest-img { aspect-ratio: 16/9; overflow: hidden; }
        .sfh-v27__dest-img img { width: 100%; height: 100%; object-fit: cover; }
        .sfh-v27__dest-info { padding: 0.75rem 1rem; display: flex; justify-content: space-between; align-items: center; }
        .sfh-v27__dest-name { font-family: 'Space Grotesk', sans-serif; font-size: 0.8rem; font-weight: 600; text-transform: uppercase; color: #1a1a1a; }
        .sfh-v27__dest-times { text-align: right; }
        .sfh-v27__dest-fly { font-family: 'Share Tech Mono', monospace; font-size: 0.8rem; color: #1a1a1a; display: block; }
        .sfh-v27__dest-drive { font-size: 0.6rem; color: #999; }
        .sfh-v27__fleet-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 1.5rem; }
        .sfh-v27__fleet-card { border: 1px solid #e8e6e2; padding: 2rem; text-align: center; text-decoration: none; color: inherit; transition: all 0.3s; }
        .sfh-v27__fleet-card:hover { border-color: #1a1a1a; transform: translateY(-3px); }
        .sfh-v27__fleet-card img { height: 70px; object-fit: contain; margin-bottom: 1rem; }
        .sfh-v27__fleet-model { font-family: 'Space Grotesk', sans-serif; font-size: 1.1rem; font-weight: 700; text-transform: uppercase; color: #1a1a1a; }
        .sfh-v27__fleet-seats { font-size: 0.7rem; color: #888; margin: 0.25rem 0; }
        .sfh-v27__fleet-rate { font-family: 'Share Tech Mono', monospace; font-size: 0.9rem; color: #1a1a1a; }
        .sfh-v27__book { text-align: center; padding: 3rem 0; }
        .sfh-v27__book-text { font-size: 1rem; color: #666; line-height: 1.8; max-width: 500px; margin: 0 auto 2rem; }
        .sfh-v27__book-btn { display: inline-block; padding: 1rem 2.5rem; background: #1a1a1a; color: #fff; text-decoration: none; font-size: 0.75rem; text-transform: uppercase; letter-spacing: 0.1em; }
        .sfh-v27__book-btn:hover { background: #333; }
      `}</style>
      <div className="sfh-v27__wrap">
        <div className="sfh-v27__tabs">
          {tabLabels.map((label, i) => (
            <button key={label} className={`sfh-v27__tab ${activeTab === i ? 'sfh-v27__tab--active' : ''}`} onClick={() => setActiveTab(i)}>{label}</button>
          ))}
        </div>
        {activeTab === 0 && (
          <div className="sfh-v27__panel" key="dest">
            <div className="sfh-v27__dest-grid">
              {destinations.map(d => (
                <div key={d.name} className="sfh-v27__dest-card">
                  <div className="sfh-v27__dest-img"><img src={d.img} alt={d.name} /></div>
                  <div className="sfh-v27__dest-info">
                    <span className="sfh-v27__dest-name">{d.name}</span>
                    <div className="sfh-v27__dest-times">
                      <span className="sfh-v27__dest-fly">{d.time}</span>
                      <span className="sfh-v27__dest-drive">vs {d.carTime} drive</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
        {activeTab === 1 && (
          <div className="sfh-v27__panel" key="fleet">
            <div className="sfh-v27__fleet-grid">
              {fleet.map(f => (
                <Link key={f.model} to={f.link} className="sfh-v27__fleet-card">
                  <img src={f.img} alt={f.model} />
                  <div className="sfh-v27__fleet-model">{f.model}</div>
                  <div className="sfh-v27__fleet-seats">{f.seats}</div>
                  <div className="sfh-v27__fleet-rate">From {f.rate}</div>
                </Link>
              ))}
            </div>
          </div>
        )}
        {activeTab === 2 && (
          <div className="sfh-v27__panel sfh-v27__book" key="book">
            <div className="sfh-v27__book-text">Ready to fly? Get in touch to arrange your self-fly hire. Available by the hour, day or week. No crew required — just your licence and a destination.</div>
            <Link to="/contact?subject=hire" className="sfh-v27__book-btn">Enquire About Hire</Link>
          </div>
        )}
      </div>
    </div>
  );
};

// ─── VARIATION 28: Comparison Matrix ───
const V28 = () => {
  const rates = { 'R22': 275, 'R44': 395, 'R66 Turbine': 595 };
  const destTimes = [
    { name: 'The Cotswolds', hours: 0.58 },
    { name: 'Le Touquet', hours: 0.92 },
    { name: 'Scottish Highlands', hours: 2.75 },
    { name: 'Cornwall', hours: 1.5 },
  ];
  return (
    <div className="sfh-v28">
      <style>{`
        .sfh-v28 { background: #faf9f6; }
        .sfh-v28__wrap { max-width: 900px; margin: 0 auto; padding: 4rem 2rem 5rem; }
        .sfh-v28__label { display: block; font-size: 0.7rem; text-transform: uppercase; letter-spacing: 0.25em; color: #999; text-align: center; margin-bottom: 2rem; }
        .sfh-v28__table { width: 100%; border-collapse: collapse; }
        .sfh-v28__table th { font-family: 'Space Grotesk', sans-serif; font-size: 0.75rem; font-weight: 700; text-transform: uppercase; letter-spacing: 0.05em; color: #1a1a1a; padding: 1rem 0.75rem; border-bottom: 2px solid #1a1a1a; text-align: center; }
        .sfh-v28__table th:first-child { text-align: left; }
        .sfh-v28__table td { padding: 0.85rem 0.75rem; border-bottom: 1px solid #e8e6e2; text-align: center; }
        .sfh-v28__table td:first-child { text-align: left; font-family: 'Space Grotesk', sans-serif; font-weight: 600; font-size: 0.85rem; color: #1a1a1a; }
        .sfh-v28__table tr:hover td { background: #f5f4f0; }
        .sfh-v28__cost { font-family: 'Share Tech Mono', monospace; font-size: 0.85rem; color: #1a1a1a; }
        .sfh-v28__time { display: block; font-size: 0.6rem; color: #999; margin-top: 0.15rem; }
        .sfh-v28__table th img { height: 30px; object-fit: contain; display: block; margin: 0 auto 0.4rem; }
        .sfh-v28__table th .sfh-v28__rate { font-family: 'Share Tech Mono', monospace; font-size: 0.6rem; color: #888; font-weight: 400; display: block; margin-top: 0.15rem; }
        .sfh-v28__cta { text-align: center; margin-top: 2.5rem; }
        .sfh-v28__cta-btn { display: inline-block; padding: 1rem 2.5rem; background: #1a1a1a; color: #fff; text-decoration: none; font-size: 0.75rem; text-transform: uppercase; letter-spacing: 0.1em; }
        .sfh-v28__cta-btn:hover { background: #333; }
        .sfh-v28__note { display: block; font-size: 0.65rem; color: #999; text-align: center; margin-top: 0.75rem; }
      `}</style>
      <div className="sfh-v28__wrap">
        <span className="sfh-v28__label">Estimated Flight Costs</span>
        <table className="sfh-v28__table">
          <thead>
            <tr>
              <th>Destination</th>
              {fleet.map(f => (
                <th key={f.model}>
                  <img src={f.img} alt={f.model} />
                  {f.model}
                  <span className="sfh-v28__rate">{f.rate}</span>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {destTimes.map(d => (
              <tr key={d.name}>
                <td>{d.name}</td>
                {fleet.map(f => {
                  const cost = Math.round(rates[f.model] * d.hours);
                  return (
                    <td key={f.model}>
                      <span className="sfh-v28__cost">~£{cost}</span>
                      <span className="sfh-v28__time">{destinations.find(dd => dd.name === d.name)?.time}</span>
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
        <span className="sfh-v28__note">Estimates based on flight time only. Final costs may vary.</span>
        <div className="sfh-v28__cta">
          <Link to="/contact?subject=hire" className="sfh-v28__cta-btn">Get a Quote</Link>
        </div>
      </div>
    </div>
  );
};

// ─── VARIATION 29: Cost Calculator ───
const V29 = () => {
  const [selectedAircraft, setSelectedAircraft] = React.useState(1);
  const [hours, setHours] = React.useState(1);
  const rateValues = [275, 395, 595];
  const total = rateValues[selectedAircraft] * hours;
  return (
    <div className="sfh-v29">
      <style>{`
        .sfh-v29 { background: #faf9f6; }
        .sfh-v29__wrap { max-width: 700px; margin: 0 auto; padding: 4rem 2rem 5rem; }
        .sfh-v29__label { display: block; font-size: 0.7rem; text-transform: uppercase; letter-spacing: 0.25em; color: #999; margin-bottom: 2rem; text-align: center; }
        .sfh-v29__aircraft-select { display: flex; gap: 1rem; margin-bottom: 2.5rem; }
        .sfh-v29__aircraft-btn { flex: 1; padding: 1.25rem; border: 2px solid #e8e6e2; background: #fff; cursor: pointer; text-align: center; transition: all 0.3s; }
        .sfh-v29__aircraft-btn--active { border-color: #1a1a1a; background: #1a1a1a; }
        .sfh-v29__aircraft-btn--active .sfh-v29__ac-model,
        .sfh-v29__aircraft-btn--active .sfh-v29__ac-seats { color: #fff; }
        .sfh-v29__aircraft-btn--active .sfh-v29__ac-rate { color: #ccc; }
        .sfh-v29__aircraft-btn img { height: 50px; object-fit: contain; margin-bottom: 0.5rem; }
        .sfh-v29__aircraft-btn--active img { filter: brightness(10); }
        .sfh-v29__ac-model { font-family: 'Space Grotesk', sans-serif; font-weight: 700; text-transform: uppercase; font-size: 0.9rem; color: #1a1a1a; }
        .sfh-v29__ac-seats { font-size: 0.65rem; color: #888; margin-top: 0.15rem; }
        .sfh-v29__ac-rate { font-family: 'Share Tech Mono', monospace; font-size: 0.75rem; color: #999; margin-top: 0.25rem; display: block; }
        .sfh-v29__slider-section { margin-bottom: 2.5rem; }
        .sfh-v29__slider-header { display: flex; justify-content: space-between; align-items: baseline; margin-bottom: 0.75rem; }
        .sfh-v29__slider-label { font-family: 'Space Grotesk', sans-serif; font-size: 0.8rem; font-weight: 600; text-transform: uppercase; color: #1a1a1a; }
        .sfh-v29__slider-value { font-family: 'Share Tech Mono', monospace; font-size: 1rem; color: #1a1a1a; }
        .sfh-v29__slider { width: 100%; appearance: none; height: 2px; background: #e8e6e2; outline: none; }
        .sfh-v29__slider::-webkit-slider-thumb { appearance: none; width: 18px; height: 18px; border-radius: 50%; background: #1a1a1a; cursor: pointer; }
        .sfh-v29__result { text-align: center; padding: 2.5rem; border: 2px solid #1a1a1a; margin-bottom: 2rem; }
        .sfh-v29__result-label { display: block; font-size: 0.65rem; text-transform: uppercase; letter-spacing: 0.2em; color: #999; margin-bottom: 0.5rem; }
        .sfh-v29__result-total { font-family: 'Space Grotesk', sans-serif; font-size: 3rem; font-weight: 700; color: #1a1a1a; }
        .sfh-v29__result-note { font-size: 0.7rem; color: #888; margin-top: 0.5rem; display: block; }
        .sfh-v29__dests { display: flex; flex-wrap: wrap; gap: 0.5rem; justify-content: center; margin-bottom: 2rem; }
        .sfh-v29__dest-chip { padding: 0.35rem 0.65rem; border: 1px solid #e8e6e2; font-size: 0.7rem; background: #fff; }
        .sfh-v29__dest-chip strong { color: #1a1a1a; }
        .sfh-v29__dest-chip span { font-family: 'Share Tech Mono', monospace; color: #888; margin-left: 0.3rem; }
        .sfh-v29__cta { text-align: center; }
        .sfh-v29__cta-btn { display: inline-block; padding: 1rem 2.5rem; background: #1a1a1a; color: #fff; text-decoration: none; font-size: 0.75rem; text-transform: uppercase; letter-spacing: 0.1em; }
      `}</style>
      <div className="sfh-v29__wrap">
        <span className="sfh-v29__label">Estimate Your Flight Cost</span>
        <div className="sfh-v29__aircraft-select">
          {fleet.map((f, i) => (
            <button key={f.model} className={`sfh-v29__aircraft-btn ${selectedAircraft === i ? 'sfh-v29__aircraft-btn--active' : ''}`} onClick={() => setSelectedAircraft(i)}>
              <img src={f.img} alt={f.model} />
              <div className="sfh-v29__ac-model">{f.model}</div>
              <div className="sfh-v29__ac-seats">{f.seats}</div>
              <span className="sfh-v29__ac-rate">{f.rate}</span>
            </button>
          ))}
        </div>
        <div className="sfh-v29__slider-section">
          <div className="sfh-v29__slider-header">
            <span className="sfh-v29__slider-label">Duration</span>
            <span className="sfh-v29__slider-value">{hours}h</span>
          </div>
          <input type="range" className="sfh-v29__slider" min="1" max="8" step="0.5" value={hours} onChange={e => setHours(parseFloat(e.target.value))} />
        </div>
        <div className="sfh-v29__result">
          <span className="sfh-v29__result-label">Estimated Total</span>
          <div className="sfh-v29__result-total">£{Math.round(total).toLocaleString()}</div>
          <span className="sfh-v29__result-note">{fleet[selectedAircraft].model} at {fleet[selectedAircraft].rate} x {hours} hours</span>
        </div>
        <div className="sfh-v29__dests">
          {destinations.map(d => (
            <div key={d.name} className="sfh-v29__dest-chip"><strong>{d.name}</strong><span>{d.time}</span></div>
          ))}
        </div>
        <div className="sfh-v29__cta">
          <Link to="/contact?subject=hire" className="sfh-v29__cta-btn">Get a Quote</Link>
        </div>
      </div>
    </div>
  );
};

// ─── VARIATION 30: Big Numbers Hero ───
const V30 = () => (
  <div className="sfh-v30">
    <style>{`
      .sfh-v30 { background: #faf9f6; }
      .sfh-v30__numbers { max-width: 1100px; margin: 0 auto; padding: 4rem 2rem; display: grid; grid-template-columns: repeat(4, 1fr); gap: 2rem; }
      .sfh-v30__num-card { text-align: center; padding: 2rem 1rem; }
      .sfh-v30__num-time { font-family: 'Space Grotesk', sans-serif; font-size: clamp(2.5rem, 5vw, 4rem); font-weight: 700; color: #1a1a1a; line-height: 1; }
      .sfh-v30__num-dest { font-family: 'Space Grotesk', sans-serif; font-size: 0.8rem; font-weight: 600; text-transform: uppercase; letter-spacing: 0.05em; color: #1a1a1a; margin-top: 0.75rem; }
      .sfh-v30__num-vs { font-size: 0.65rem; color: #999; margin-top: 0.25rem; }
      .sfh-v30__divider { width: 40px; height: 1px; background: #e8e6e2; margin: 0 auto; }
      .sfh-v30__fleet-strip { display: flex; justify-content: center; gap: 2rem; padding: 3rem 2rem; max-width: 900px; margin: 0 auto; }
      .sfh-v30__fleet-item { display: flex; align-items: center; gap: 0.75rem; text-decoration: none; color: inherit; padding: 0.5rem 1rem; border: 1px solid #e8e6e2; transition: border-color 0.3s; }
      .sfh-v30__fleet-item:hover { border-color: #1a1a1a; }
      .sfh-v30__fleet-item img { height: 30px; object-fit: contain; }
      .sfh-v30__fleet-model { font-family: 'Space Grotesk', sans-serif; font-weight: 700; text-transform: uppercase; font-size: 0.75rem; color: #1a1a1a; }
      .sfh-v30__fleet-meta { font-size: 0.6rem; color: #888; }
      .sfh-v30__fleet-rate { font-family: 'Share Tech Mono', monospace; font-size: 0.7rem; color: #888; }
      .sfh-v30__cta { text-align: center; padding: 1rem 2rem 5rem; }
      .sfh-v30__cta-btn { display: inline-block; padding: 1rem 2.5rem; background: #1a1a1a; color: #fff; text-decoration: none; font-size: 0.75rem; text-transform: uppercase; letter-spacing: 0.1em; }
      .sfh-v30__cta-btn:hover { background: #333; }
    `}</style>
    <div className="sfh-v30__numbers">
      {destinations.map(d => (
        <div key={d.name} className="sfh-v30__num-card">
          <div className="sfh-v30__num-time">{d.time}</div>
          <div className="sfh-v30__num-dest">{d.name}</div>
          <div className="sfh-v30__num-vs">vs {d.carTime} by car</div>
        </div>
      ))}
    </div>
    <div className="sfh-v30__divider" />
    <div className="sfh-v30__fleet-strip">
      {fleet.map(f => (
        <Link key={f.model} to={f.link} className="sfh-v30__fleet-item">
          <img src={f.img} alt={f.model} />
          <div>
            <div className="sfh-v30__fleet-model">{f.model}</div>
            <div className="sfh-v30__fleet-meta">{f.seats}</div>
          </div>
          <span className="sfh-v30__fleet-rate">{f.rate}</span>
        </Link>
      ))}
    </div>
    <div className="sfh-v30__cta">
      <Link to="/contact?subject=hire" className="sfh-v30__cta-btn">Enquire About Hire</Link>
    </div>
  </div>
);

// ─── VARIATION 31: Dashboard Grid (2x2 Bento) ───
const V31 = () => (
  <div className="sfh-v31">
    <style>{`
      .sfh-v31 { background: #faf9f6; }
      .sfh-v31__grid { max-width: 1000px; margin: 0 auto; padding: 4rem 2rem 5rem; display: grid; grid-template-columns: 1fr 1fr; grid-template-rows: auto auto; gap: 1.5rem; }
      .sfh-v31__cell { border: 1px solid #e8e6e2; padding: 2rem; background: #fff; }
      .sfh-v31__cell-label { display: block; font-size: 0.6rem; text-transform: uppercase; letter-spacing: 0.25em; color: #999; margin-bottom: 1.5rem; }
      .sfh-v31__stats { display: grid; grid-template-columns: 1fr 1fr; gap: 1rem; }
      .sfh-v31__stat-val { font-family: 'Space Grotesk', sans-serif; font-size: 2rem; font-weight: 700; color: #1a1a1a; line-height: 1; }
      .sfh-v31__stat-desc { font-size: 0.65rem; color: #888; margin-top: 0.25rem; text-transform: uppercase; letter-spacing: 0.1em; }
      .sfh-v31__dest-list { display: flex; flex-direction: column; gap: 0.75rem; }
      .sfh-v31__dest-row { display: flex; justify-content: space-between; align-items: center; padding-bottom: 0.75rem; border-bottom: 1px solid #f0eeea; }
      .sfh-v31__dest-row:last-child { border-bottom: none; padding-bottom: 0; }
      .sfh-v31__dest-name { font-family: 'Space Grotesk', sans-serif; font-size: 0.8rem; font-weight: 600; text-transform: uppercase; color: #1a1a1a; }
      .sfh-v31__dest-time { font-family: 'Share Tech Mono', monospace; font-size: 0.8rem; color: #1a1a1a; }
      .sfh-v31__dest-car { font-size: 0.6rem; color: #999; margin-left: 0.5rem; }
      .sfh-v31__fleet-list { display: flex; flex-direction: column; gap: 0.75rem; }
      .sfh-v31__fleet-row { display: flex; align-items: center; gap: 1rem; text-decoration: none; color: inherit; padding: 0.5rem; border: 1px solid #f0eeea; transition: border-color 0.3s; }
      .sfh-v31__fleet-row:hover { border-color: #1a1a1a; }
      .sfh-v31__fleet-row img { height: 30px; object-fit: contain; width: 50px; }
      .sfh-v31__fleet-model { font-family: 'Space Grotesk', sans-serif; font-weight: 700; text-transform: uppercase; font-size: 0.8rem; }
      .sfh-v31__fleet-seats { font-size: 0.6rem; color: #888; }
      .sfh-v31__fleet-rate { margin-left: auto; font-family: 'Share Tech Mono', monospace; font-size: 0.75rem; color: #1a1a1a; }
      .sfh-v31__cta-cell { display: flex; flex-direction: column; align-items: center; justify-content: center; text-align: center; background: #1a1a1a; border-color: #1a1a1a; }
      .sfh-v31__cta-text { font-size: 0.95rem; color: #999; line-height: 1.7; margin-bottom: 1.5rem; max-width: 300px; }
      .sfh-v31__cta-btn { display: inline-block; padding: 0.85rem 2rem; border: 2px solid #fff; color: #fff; text-decoration: none; font-size: 0.75rem; text-transform: uppercase; letter-spacing: 0.1em; transition: all 0.3s; }
      .sfh-v31__cta-btn:hover { background: #fff; color: #1a1a1a; }
    `}</style>
    <div className="sfh-v31__grid">
      <div className="sfh-v31__cell">
        <span className="sfh-v31__cell-label">At a Glance</span>
        <div className="sfh-v31__stats">
          <div><div className="sfh-v31__stat-val">3</div><div className="sfh-v31__stat-desc">Aircraft Types</div></div>
          <div><div className="sfh-v31__stat-val">5</div><div className="sfh-v31__stat-desc">Max Seats</div></div>
          <div><div className="sfh-v31__stat-val">35m</div><div className="sfh-v31__stat-desc">Nearest Dest.</div></div>
          <div><div className="sfh-v31__stat-val">£275</div><div className="sfh-v31__stat-desc">From / Hour</div></div>
        </div>
      </div>
      <div className="sfh-v31__cell">
        <span className="sfh-v31__cell-label">Destinations</span>
        <div className="sfh-v31__dest-list">
          {destinations.map(d => (
            <div key={d.name} className="sfh-v31__dest-row">
              <span className="sfh-v31__dest-name">{d.name}</span>
              <div><span className="sfh-v31__dest-time">{d.time}</span><span className="sfh-v31__dest-car">vs {d.carTime}</span></div>
            </div>
          ))}
        </div>
      </div>
      <div className="sfh-v31__cell">
        <span className="sfh-v31__cell-label">Fleet</span>
        <div className="sfh-v31__fleet-list">
          {fleet.map(f => (
            <Link key={f.model} to={f.link} className="sfh-v31__fleet-row">
              <img src={f.img} alt={f.model} />
              <div><div className="sfh-v31__fleet-model">{f.model}</div><div className="sfh-v31__fleet-seats">{f.seats}</div></div>
              <span className="sfh-v31__fleet-rate">From {f.rate}</span>
            </Link>
          ))}
        </div>
      </div>
      <div className="sfh-v31__cell sfh-v31__cta-cell">
        <div className="sfh-v31__cta-text">Ready to fly yourself? No crew, no waiting, no compromise.</div>
        <Link to="/contact?subject=hire" className="sfh-v31__cta-btn">Enquire About Hire</Link>
      </div>
    </div>
  </div>
);

// ─── VARIATION 32: Progress Bars (Time Saved) ───
const V32 = () => {
  const timeData = [
    { name: 'The Cotswolds', fly: 35, drive: 105 },
    { name: 'Le Touquet', fly: 55, drive: 210 },
    { name: 'Scottish Highlands', fly: 165, drive: 480 },
    { name: 'Cornwall', fly: 90, drive: 270 },
  ];
  return (
    <div className="sfh-v32">
      <style>{`
        .sfh-v32 { background: #faf9f6; }
        .sfh-v32__wrap { max-width: 800px; margin: 0 auto; padding: 4rem 2rem; }
        .sfh-v32__label { display: block; font-size: 0.7rem; text-transform: uppercase; letter-spacing: 0.25em; color: #999; text-align: center; margin-bottom: 3rem; }
        .sfh-v32__bar-group { margin-bottom: 2rem; }
        .sfh-v32__bar-header { display: flex; justify-content: space-between; align-items: baseline; margin-bottom: 0.5rem; }
        .sfh-v32__bar-name { font-family: 'Space Grotesk', sans-serif; font-size: 0.85rem; font-weight: 600; text-transform: uppercase; color: #1a1a1a; }
        .sfh-v32__bar-saved { font-family: 'Share Tech Mono', monospace; font-size: 0.75rem; color: #1a1a1a; }
        .sfh-v32__bar-track { height: 8px; background: #e8e6e2; position: relative; overflow: hidden; }
        .sfh-v32__bar-fill { height: 100%; background: #1a1a1a; transition: width 1s ease; }
        .sfh-v32__bar-labels { display: flex; justify-content: space-between; margin-top: 0.35rem; }
        .sfh-v32__bar-fly { font-family: 'Share Tech Mono', monospace; font-size: 0.65rem; color: #1a1a1a; }
        .sfh-v32__bar-drive { font-size: 0.6rem; color: #999; }
        .sfh-v32__divider { width: 40px; height: 1px; background: #e8e6e2; margin: 3rem auto; }
        .sfh-v32__fleet { display: grid; grid-template-columns: repeat(3, 1fr); gap: 1.5rem; margin-bottom: 2.5rem; }
        .sfh-v32__fleet-card { border: 1px solid #e8e6e2; padding: 1.5rem; text-align: center; text-decoration: none; color: inherit; transition: border-color 0.3s; }
        .sfh-v32__fleet-card:hover { border-color: #1a1a1a; }
        .sfh-v32__fleet-card img { height: 55px; object-fit: contain; margin-bottom: 0.5rem; }
        .sfh-v32__fleet-model { font-family: 'Space Grotesk', sans-serif; font-weight: 700; text-transform: uppercase; font-size: 0.9rem; color: #1a1a1a; }
        .sfh-v32__fleet-meta { font-size: 0.65rem; color: #888; margin-top: 0.15rem; }
        .sfh-v32__fleet-rate { font-family: 'Share Tech Mono', monospace; font-size: 0.8rem; color: #1a1a1a; display: block; margin-top: 0.25rem; }
        .sfh-v32__cta { text-align: center; }
        .sfh-v32__cta-btn { display: inline-block; padding: 1rem 2.5rem; background: #1a1a1a; color: #fff; text-decoration: none; font-size: 0.75rem; text-transform: uppercase; letter-spacing: 0.1em; }
      `}</style>
      <div className="sfh-v32__wrap">
        <span className="sfh-v32__label">Time Saved by Helicopter</span>
        {timeData.map(d => {
          const pct = Math.round(((d.drive - d.fly) / d.drive) * 100);
          return (
            <div key={d.name} className="sfh-v32__bar-group">
              <div className="sfh-v32__bar-header">
                <span className="sfh-v32__bar-name">{d.name}</span>
                <span className="sfh-v32__bar-saved">{pct}% faster</span>
              </div>
              <div className="sfh-v32__bar-track">
                <div className="sfh-v32__bar-fill" style={{ width: `${pct}%` }} />
              </div>
              <div className="sfh-v32__bar-labels">
                <span className="sfh-v32__bar-fly">{destinations.find(dd => dd.name === d.name)?.time} fly</span>
                <span className="sfh-v32__bar-drive">{destinations.find(dd => dd.name === d.name)?.carTime} drive</span>
              </div>
            </div>
          );
        })}
        <div className="sfh-v32__divider" />
        <div className="sfh-v32__fleet">
          {fleet.map(f => (
            <Link key={f.model} to={f.link} className="sfh-v32__fleet-card">
              <img src={f.img} alt={f.model} />
              <div className="sfh-v32__fleet-model">{f.model}</div>
              <div className="sfh-v32__fleet-meta">{f.seats}</div>
              <span className="sfh-v32__fleet-rate">From {f.rate}</span>
            </Link>
          ))}
        </div>
        <div className="sfh-v32__cta">
          <Link to="/contact?subject=hire" className="sfh-v32__cta-btn">Enquire About Hire</Link>
        </div>
      </div>
    </div>
  );
};

// ─── VARIATION 33: Bento Grid (Mixed-Size Cards) ───
const V33 = () => (
  <div className="sfh-v33">
    <style>{`
      .sfh-v33 { background: #faf9f6; }
      .sfh-v33__grid { max-width: 1100px; margin: 0 auto; padding: 4rem 2rem 5rem; display: grid; grid-template-columns: repeat(4, 1fr); grid-template-rows: auto auto auto; gap: 1.25rem; }
      .sfh-v33__card { border: 1px solid #e8e6e2; overflow: hidden; background: #fff; position: relative; }
      .sfh-v33__card--lg { grid-column: span 2; grid-row: span 2; }
      .sfh-v33__card--wide { grid-column: span 2; }
      .sfh-v33__dest-lg { height: 100%; display: flex; flex-direction: column; }
      .sfh-v33__dest-lg-img { flex: 1; overflow: hidden; }
      .sfh-v33__dest-lg-img img { width: 100%; height: 100%; object-fit: cover; }
      .sfh-v33__dest-lg-info { padding: 1.25rem; }
      .sfh-v33__dest-lg-name { font-family: 'Space Grotesk', sans-serif; font-size: 1.1rem; font-weight: 700; text-transform: uppercase; color: #1a1a1a; }
      .sfh-v33__dest-lg-time { font-family: 'Share Tech Mono', monospace; font-size: 0.9rem; color: #1a1a1a; display: block; margin-top: 0.2rem; }
      .sfh-v33__dest-sm { padding: 1.25rem; display: flex; flex-direction: column; justify-content: center; }
      .sfh-v33__dest-sm-name { font-family: 'Space Grotesk', sans-serif; font-size: 0.8rem; font-weight: 600; text-transform: uppercase; color: #1a1a1a; }
      .sfh-v33__dest-sm-time { font-family: 'Share Tech Mono', monospace; font-size: 1.3rem; color: #1a1a1a; margin-top: 0.25rem; }
      .sfh-v33__dest-sm-car { font-size: 0.6rem; color: #999; margin-top: 0.15rem; }
      .sfh-v33__fleet-card { padding: 1.5rem; text-align: center; text-decoration: none; color: inherit; display: flex; flex-direction: column; align-items: center; justify-content: center; transition: border-color 0.3s; }
      .sfh-v33__fleet-card:hover { border-color: #1a1a1a; }
      .sfh-v33__fleet-card img { height: 50px; object-fit: contain; margin-bottom: 0.5rem; }
      .sfh-v33__fleet-model { font-family: 'Space Grotesk', sans-serif; font-weight: 700; text-transform: uppercase; font-size: 0.85rem; color: #1a1a1a; }
      .sfh-v33__fleet-meta { font-size: 0.6rem; color: #888; margin-top: 0.1rem; }
      .sfh-v33__fleet-rate { font-family: 'Share Tech Mono', monospace; font-size: 0.75rem; color: #1a1a1a; margin-top: 0.2rem; }
      .sfh-v33__cta-card { display: flex; align-items: center; justify-content: center; background: #1a1a1a; border-color: #1a1a1a; }
      .sfh-v33__cta-btn { padding: 0.75rem 1.5rem; border: 2px solid #fff; color: #fff; text-decoration: none; font-size: 0.7rem; text-transform: uppercase; letter-spacing: 0.1em; transition: all 0.3s; }
      .sfh-v33__cta-btn:hover { background: #fff; color: #1a1a1a; }
    `}</style>
    <div className="sfh-v33__grid">
      <div className="sfh-v33__card sfh-v33__card--lg">
        <div className="sfh-v33__dest-lg">
          <div className="sfh-v33__dest-lg-img"><img src={destinations[0].img} alt={destinations[0].name} /></div>
          <div className="sfh-v33__dest-lg-info">
            <div className="sfh-v33__dest-lg-name">{destinations[0].name}</div>
            <span className="sfh-v33__dest-lg-time">{destinations[0].time}</span>
          </div>
        </div>
      </div>
      {destinations.slice(1).map(d => (
        <div key={d.name} className="sfh-v33__card">
          <div className="sfh-v33__dest-sm">
            <div className="sfh-v33__dest-sm-name">{d.name}</div>
            <div className="sfh-v33__dest-sm-time">{d.time}</div>
            <div className="sfh-v33__dest-sm-car">vs {d.carTime} drive</div>
          </div>
        </div>
      ))}
      {fleet.map(f => (
        <Link key={f.model} to={f.link} className="sfh-v33__card sfh-v33__fleet-card">
          <img src={f.img} alt={f.model} />
          <div className="sfh-v33__fleet-model">{f.model}</div>
          <div className="sfh-v33__fleet-meta">{f.seats}</div>
          <span className="sfh-v33__fleet-rate">From {f.rate}</span>
        </Link>
      ))}
      <div className="sfh-v33__card sfh-v33__cta-card">
        <Link to="/contact?subject=hire" className="sfh-v33__cta-btn">Enquire Now</Link>
      </div>
    </div>
  </div>
);

// ─── VARIATION 34: Two-Column Editorial with Sticky Sidebar ───
const V34 = () => (
  <div className="sfh-v34">
    <style>{`
      .sfh-v34 { background: #faf9f6; }
      .sfh-v34__wrap { max-width: 1000px; margin: 0 auto; padding: 4rem 2rem 5rem; display: grid; grid-template-columns: 1fr 320px; gap: 4rem; align-items: start; }
      .sfh-v34__editorial {}
      .sfh-v34__section-label { display: block; font-size: 0.65rem; text-transform: uppercase; letter-spacing: 0.3em; color: #999; margin-bottom: 1.5rem; }
      .sfh-v34__heading { font-family: 'Space Grotesk', sans-serif; font-size: 1.8rem; font-weight: 700; text-transform: uppercase; color: #1a1a1a; margin: 0 0 1rem; line-height: 1.2; }
      .sfh-v34__text { font-size: 1rem; color: #666; line-height: 1.8; margin-bottom: 2rem; }
      .sfh-v34__dest-cards { display: grid; grid-template-columns: 1fr 1fr; gap: 1rem; margin-bottom: 3rem; }
      .sfh-v34__dest-card { border: 1px solid #e8e6e2; overflow: hidden; }
      .sfh-v34__dest-card-img { aspect-ratio: 16/10; overflow: hidden; }
      .sfh-v34__dest-card-img img { width: 100%; height: 100%; object-fit: cover; }
      .sfh-v34__dest-card-info { padding: 0.75rem; display: flex; justify-content: space-between; align-items: center; }
      .sfh-v34__dest-card-name { font-family: 'Space Grotesk', sans-serif; font-size: 0.75rem; font-weight: 600; text-transform: uppercase; color: #1a1a1a; }
      .sfh-v34__dest-card-time { font-family: 'Share Tech Mono', monospace; font-size: 0.75rem; color: #1a1a1a; }
      .sfh-v34__pull-quote { font-family: 'Space Grotesk', sans-serif; font-size: 1.3rem; font-weight: 400; color: #1a1a1a; line-height: 1.6; font-style: italic; border-left: 2px solid #1a1a1a; padding-left: 1.5rem; margin: 0 0 2rem; }
      .sfh-v34__text-2 { font-size: 1rem; color: #666; line-height: 1.8; }
      .sfh-v34__sidebar { position: sticky; top: 2rem; }
      .sfh-v34__sidebar-label { display: block; font-size: 0.6rem; text-transform: uppercase; letter-spacing: 0.3em; color: #999; margin-bottom: 1.5rem; }
      .sfh-v34__fleet-cards { display: flex; flex-direction: column; gap: 0.75rem; margin-bottom: 2rem; }
      .sfh-v34__fleet-card { display: flex; align-items: center; gap: 1rem; padding: 1rem; border: 1px solid #e8e6e2; text-decoration: none; color: inherit; background: #fff; transition: border-color 0.3s; }
      .sfh-v34__fleet-card:hover { border-color: #1a1a1a; }
      .sfh-v34__fleet-card img { height: 35px; object-fit: contain; width: 55px; }
      .sfh-v34__fleet-model { font-family: 'Space Grotesk', sans-serif; font-weight: 700; text-transform: uppercase; font-size: 0.85rem; color: #1a1a1a; }
      .sfh-v34__fleet-seats { font-size: 0.6rem; color: #888; }
      .sfh-v34__fleet-rate { margin-left: auto; font-family: 'Share Tech Mono', monospace; font-size: 0.8rem; }
      .sfh-v34__sidebar-btn { display: block; width: 100%; padding: 1rem; background: #1a1a1a; color: #fff; text-decoration: none; font-size: 0.75rem; text-transform: uppercase; letter-spacing: 0.1em; text-align: center; }
      .sfh-v34__sidebar-btn:hover { background: #333; }
    `}</style>
    <div className="sfh-v34__wrap">
      <div className="sfh-v34__editorial">
        <span className="sfh-v34__section-label">Self-Fly Hire</span>
        <h3 className="sfh-v34__heading">Skip the Motorway.<br />Fly Direct.</h3>
        <p className="sfh-v34__text">You have earned your licence. Now use it. From Denham Aerodrome, the Cotswolds is thirty-five minutes away, not two hours stuck on the M40. Le Touquet for lunch? Under an hour. Even the Scottish Highlands are reachable before noon.</p>
        <div className="sfh-v34__dest-cards">
          {destinations.map(d => (
            <div key={d.name} className="sfh-v34__dest-card">
              <div className="sfh-v34__dest-card-img"><img src={d.img} alt={d.name} /></div>
              <div className="sfh-v34__dest-card-info">
                <span className="sfh-v34__dest-card-name">{d.name}</span>
                <span className="sfh-v34__dest-card-time">{d.time}</span>
              </div>
            </div>
          ))}
        </div>
        <blockquote className="sfh-v34__pull-quote">"The helicopter isn't just transport — it's a lifestyle."</blockquote>
        <p className="sfh-v34__text-2">Available by the hour, day or week. Each aircraft is fuelled, washed and waiting on the pad. No crew required — just your licence and a destination.</p>
      </div>
      <div className="sfh-v34__sidebar">
        <span className="sfh-v34__sidebar-label">Our Fleet</span>
        <div className="sfh-v34__fleet-cards">
          {fleet.map(f => (
            <Link key={f.model} to={f.link} className="sfh-v34__fleet-card">
              <img src={f.img} alt={f.model} />
              <div><div className="sfh-v34__fleet-model">{f.model}</div><div className="sfh-v34__fleet-seats">{f.seats}</div></div>
              <span className="sfh-v34__fleet-rate">{f.rate}</span>
            </Link>
          ))}
        </div>
        <Link to="/contact?subject=hire" className="sfh-v34__sidebar-btn">Enquire About Hire</Link>
      </div>
    </div>
  </div>
);

// ─── VARIATION 35: Full-Bleed Photo Bands ───
const V35 = () => (
  <div className="sfh-v35">
    <style>{`
      .sfh-v35 { background: #faf9f6; }
      .sfh-v35__band { position: relative; height: 300px; overflow: hidden; display: flex; align-items: center; }
      .sfh-v35__band:nth-child(even) { justify-content: flex-end; }
      .sfh-v35__band-img { position: absolute; inset: 0; }
      .sfh-v35__band-img img { width: 100%; height: 100%; object-fit: cover; }
      .sfh-v35__band-overlay { position: absolute; inset: 0; background: linear-gradient(90deg, rgba(0,0,0,0.65) 0%, rgba(0,0,0,0.2) 60%); }
      .sfh-v35__band:nth-child(even) .sfh-v35__band-overlay { background: linear-gradient(270deg, rgba(0,0,0,0.65) 0%, rgba(0,0,0,0.2) 60%); }
      .sfh-v35__band-content { position: relative; z-index: 1; padding: 2rem 4rem; max-width: 450px; }
      .sfh-v35__band-name { font-family: 'Space Grotesk', sans-serif; font-size: 1.6rem; font-weight: 700; text-transform: uppercase; color: #fff; margin-bottom: 0.25rem; }
      .sfh-v35__band-time { font-family: 'Share Tech Mono', monospace; font-size: 1.2rem; color: #fff; opacity: 0.9; }
      .sfh-v35__band-car { font-size: 0.75rem; color: rgba(255,255,255,0.6); margin-top: 0.25rem; }
      .sfh-v35__fleet-section { max-width: 1000px; margin: 0 auto; padding: 4rem 2rem; }
      .sfh-v35__fleet-label { display: block; font-size: 0.7rem; text-transform: uppercase; letter-spacing: 0.25em; color: #999; text-align: center; margin-bottom: 2rem; }
      .sfh-v35__fleet-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 1.5rem; margin-bottom: 2.5rem; }
      .sfh-v35__fleet-card { border: 1px solid #e8e6e2; padding: 2rem; text-align: center; text-decoration: none; color: inherit; transition: all 0.3s; }
      .sfh-v35__fleet-card:hover { border-color: #1a1a1a; transform: translateY(-3px); }
      .sfh-v35__fleet-card img { height: 65px; object-fit: contain; margin-bottom: 0.75rem; }
      .sfh-v35__fleet-model { font-family: 'Space Grotesk', sans-serif; font-size: 1.05rem; font-weight: 700; text-transform: uppercase; color: #1a1a1a; }
      .sfh-v35__fleet-seats { font-size: 0.65rem; color: #888; margin-top: 0.15rem; }
      .sfh-v35__fleet-rate { font-family: 'Share Tech Mono', monospace; font-size: 0.85rem; color: #1a1a1a; margin-top: 0.25rem; display: block; }
      .sfh-v35__cta { text-align: center; }
      .sfh-v35__cta-btn { display: inline-block; padding: 1rem 2.5rem; background: #1a1a1a; color: #fff; text-decoration: none; font-size: 0.75rem; text-transform: uppercase; letter-spacing: 0.1em; }
    `}</style>
    {destinations.map(d => (
      <div key={d.name} className="sfh-v35__band">
        <div className="sfh-v35__band-img"><img src={d.img} alt={d.name} /></div>
        <div className="sfh-v35__band-overlay" />
        <div className="sfh-v35__band-content">
          <div className="sfh-v35__band-name">{d.name}</div>
          <div className="sfh-v35__band-time">{d.time}</div>
          <div className="sfh-v35__band-car">vs {d.carTime} by car</div>
        </div>
      </div>
    ))}
    <div className="sfh-v35__fleet-section">
      <span className="sfh-v35__fleet-label">Our Fleet</span>
      <div className="sfh-v35__fleet-grid">
        {fleet.map(f => (
          <Link key={f.model} to={f.link} className="sfh-v35__fleet-card">
            <img src={f.img} alt={f.model} />
            <div className="sfh-v35__fleet-model">{f.model}</div>
            <div className="sfh-v35__fleet-seats">{f.seats}</div>
            <span className="sfh-v35__fleet-rate">From {f.rate}</span>
          </Link>
        ))}
      </div>
      <div className="sfh-v35__cta">
        <Link to="/contact?subject=hire" className="sfh-v35__cta-btn">Enquire About Hire</Link>
      </div>
    </div>
  </div>
);

// ─── VARIATION 36: Type-Only Swiss Design ───
const V36 = () => (
  <div className="sfh-v36">
    <style>{`
      .sfh-v36 { background: #faf9f6; }
      .sfh-v36__wrap { max-width: 700px; margin: 0 auto; padding: 5rem 2rem 6rem; }
      .sfh-v36__section { margin-bottom: 4rem; }
      .sfh-v36__section-label { display: block; font-size: 0.6rem; text-transform: uppercase; letter-spacing: 0.35em; color: #999; margin-bottom: 2rem; padding-bottom: 0.75rem; border-bottom: 1px solid #e8e6e2; }
      .sfh-v36__dest-row { display: flex; justify-content: space-between; align-items: baseline; padding: 1rem 0; border-bottom: 1px solid #f0eeea; }
      .sfh-v36__dest-name { font-family: 'Space Grotesk', sans-serif; font-size: 1.3rem; font-weight: 700; text-transform: uppercase; color: #1a1a1a; }
      .sfh-v36__dest-times { text-align: right; }
      .sfh-v36__dest-fly { font-family: 'Share Tech Mono', monospace; font-size: 1.1rem; color: #1a1a1a; display: block; }
      .sfh-v36__dest-drive { font-size: 0.65rem; color: #999; margin-top: 0.1rem; display: block; }
      .sfh-v36__fleet-row { display: flex; justify-content: space-between; align-items: baseline; padding: 1rem 0; border-bottom: 1px solid #f0eeea; text-decoration: none; color: inherit; transition: padding-left 0.3s; }
      .sfh-v36__fleet-row:hover { padding-left: 0.5rem; }
      .sfh-v36__fleet-model { font-family: 'Space Grotesk', sans-serif; font-size: 1.3rem; font-weight: 700; text-transform: uppercase; color: #1a1a1a; }
      .sfh-v36__fleet-seats { font-size: 0.75rem; color: #888; margin-left: 0.75rem; }
      .sfh-v36__fleet-rate { font-family: 'Share Tech Mono', monospace; font-size: 1.1rem; color: #1a1a1a; }
      .sfh-v36__statement { font-family: 'Space Grotesk', sans-serif; font-size: 1.8rem; font-weight: 700; text-transform: uppercase; color: #1a1a1a; line-height: 1.3; margin-bottom: 1.5rem; }
      .sfh-v36__statement span { color: #7a7a7a; }
      .sfh-v36__body { font-size: 0.95rem; color: #666; line-height: 1.8; margin-bottom: 2rem; }
      .sfh-v36__cta-btn { display: inline-block; padding: 1rem 2.5rem; background: #1a1a1a; color: #fff; text-decoration: none; font-size: 0.75rem; text-transform: uppercase; letter-spacing: 0.1em; }
      .sfh-v36__cta-btn:hover { background: #333; }
    `}</style>
    <div className="sfh-v36__wrap">
      <div className="sfh-v36__section">
        <span className="sfh-v36__section-label">Destinations from Denham</span>
        {destinations.map(d => (
          <div key={d.name} className="sfh-v36__dest-row">
            <span className="sfh-v36__dest-name">{d.name}</span>
            <div className="sfh-v36__dest-times">
              <span className="sfh-v36__dest-fly">{d.time}</span>
              <span className="sfh-v36__dest-drive">vs {d.carTime} by car</span>
            </div>
          </div>
        ))}
      </div>
      <div className="sfh-v36__section">
        <span className="sfh-v36__section-label">Fleet</span>
        {fleet.map(f => (
          <Link key={f.model} to={f.link} className="sfh-v36__fleet-row">
            <div><span className="sfh-v36__fleet-model">{f.model}</span><span className="sfh-v36__fleet-seats">{f.seats}</span></div>
            <span className="sfh-v36__fleet-rate">From {f.rate}</span>
          </Link>
        ))}
      </div>
      <div className="sfh-v36__section">
        <div className="sfh-v36__statement">No crew. <span>No waiting.</span><br />No compromise.</div>
        <p className="sfh-v36__body">Available by the hour, day or week. Your licence, your aircraft, your schedule.</p>
        <Link to="/contact?subject=hire" className="sfh-v36__cta-btn">Enquire About Hire</Link>
      </div>
    </div>
  </div>
);

// ─── VARIATION 37: Single-Scroll Alternating List ───
const V37 = () => {
  const items = [
    { type: 'dest', data: destinations[0] },
    { type: 'fleet', data: fleet[0] },
    { type: 'dest', data: destinations[1] },
    { type: 'fleet', data: fleet[1] },
    { type: 'dest', data: destinations[2] },
    { type: 'fleet', data: fleet[2] },
    { type: 'dest', data: destinations[3] },
  ];
  return (
    <div className="sfh-v37">
      <style>{`
        .sfh-v37 { background: #faf9f6; }
        .sfh-v37__wrap { max-width: 600px; margin: 0 auto; padding: 4rem 2rem 5rem; }
        .sfh-v37__item { padding: 2rem 0; border-bottom: 1px solid #e8e6e2; }
        .sfh-v37__item:last-child { border-bottom: none; }
        .sfh-v37__item-type { display: block; font-size: 0.55rem; text-transform: uppercase; letter-spacing: 0.3em; color: #999; margin-bottom: 0.75rem; }
        .sfh-v37__dest-name { font-family: 'Space Grotesk', sans-serif; font-size: 1.5rem; font-weight: 700; text-transform: uppercase; color: #1a1a1a; }
        .sfh-v37__dest-time { font-family: 'Share Tech Mono', monospace; font-size: 1.1rem; color: #1a1a1a; display: block; margin-top: 0.25rem; }
        .sfh-v37__dest-car { font-size: 0.7rem; color: #999; margin-top: 0.15rem; display: block; }
        .sfh-v37__fleet-link { display: flex; align-items: center; gap: 1.5rem; text-decoration: none; color: inherit; }
        .sfh-v37__fleet-link img { height: 55px; object-fit: contain; }
        .sfh-v37__fleet-model { font-family: 'Space Grotesk', sans-serif; font-size: 1.5rem; font-weight: 700; text-transform: uppercase; color: #1a1a1a; }
        .sfh-v37__fleet-info { font-size: 0.7rem; color: #888; margin-top: 0.1rem; }
        .sfh-v37__fleet-rate { font-family: 'Share Tech Mono', monospace; font-size: 1.1rem; color: #1a1a1a; margin-left: auto; }
        .sfh-v37__cta { text-align: center; padding-top: 2rem; }
        .sfh-v37__cta-btn { display: inline-block; padding: 1rem 2.5rem; background: #1a1a1a; color: #fff; text-decoration: none; font-size: 0.75rem; text-transform: uppercase; letter-spacing: 0.1em; }
      `}</style>
      <div className="sfh-v37__wrap">
        {items.map((item, i) => (
          <div key={i} className="sfh-v37__item">
            <span className="sfh-v37__item-type">{item.type === 'dest' ? 'Destination' : 'Aircraft'}</span>
            {item.type === 'dest' ? (
              <div>
                <div className="sfh-v37__dest-name">{item.data.name}</div>
                <span className="sfh-v37__dest-time">{item.data.time}</span>
                <span className="sfh-v37__dest-car">vs {item.data.carTime} by car</span>
              </div>
            ) : (
              <Link to={item.data.link} className="sfh-v37__fleet-link">
                <img src={item.data.img} alt={item.data.model} />
                <div>
                  <div className="sfh-v37__fleet-model">{item.data.model}</div>
                  <div className="sfh-v37__fleet-info">{item.data.seats}</div>
                </div>
                <span className="sfh-v37__fleet-rate">From {item.data.rate}</span>
              </Link>
            )}
          </div>
        ))}
        <div className="sfh-v37__cta">
          <Link to="/contact?subject=hire" className="sfh-v37__cta-btn">Enquire About Hire</Link>
        </div>
      </div>
    </div>
  );
};

// ─── VARIATION 38: Centered Narrow Column ───
const V38 = () => (
  <div className="sfh-v38">
    <style>{`
      .sfh-v38 { background: #faf9f6; }
      .sfh-v38__wrap { max-width: 500px; margin: 0 auto; padding: 5rem 2rem 6rem; }
      .sfh-v38__heading { font-family: 'Space Grotesk', sans-serif; font-size: 1.6rem; font-weight: 700; text-transform: uppercase; color: #1a1a1a; text-align: center; margin: 0 0 0.75rem; line-height: 1.2; }
      .sfh-v38__sub { font-size: 0.95rem; color: #666; text-align: center; line-height: 1.7; margin-bottom: 3rem; }
      .sfh-v38__dest-label { display: block; font-size: 0.6rem; text-transform: uppercase; letter-spacing: 0.3em; color: #999; margin-bottom: 1rem; }
      .sfh-v38__dest-item { display: flex; justify-content: space-between; align-items: center; padding: 0.85rem 0; border-bottom: 1px solid #f0eeea; }
      .sfh-v38__dest-name { font-family: 'Space Grotesk', sans-serif; font-size: 0.85rem; font-weight: 600; text-transform: uppercase; color: #1a1a1a; }
      .sfh-v38__dest-time { font-family: 'Share Tech Mono', monospace; font-size: 0.85rem; color: #1a1a1a; }
      .sfh-v38__spacer { height: 3rem; }
      .sfh-v38__fleet-label { display: block; font-size: 0.6rem; text-transform: uppercase; letter-spacing: 0.3em; color: #999; margin-bottom: 1rem; }
      .sfh-v38__fleet-card { display: flex; align-items: center; gap: 1rem; padding: 1rem; border: 1px solid #e8e6e2; background: #fff; text-decoration: none; color: inherit; margin-bottom: 0.75rem; transition: border-color 0.3s; }
      .sfh-v38__fleet-card:hover { border-color: #1a1a1a; }
      .sfh-v38__fleet-card img { height: 40px; object-fit: contain; width: 65px; }
      .sfh-v38__fleet-model { font-family: 'Space Grotesk', sans-serif; font-weight: 700; text-transform: uppercase; font-size: 0.85rem; color: #1a1a1a; }
      .sfh-v38__fleet-seats { font-size: 0.6rem; color: #888; }
      .sfh-v38__fleet-rate { margin-left: auto; font-family: 'Share Tech Mono', monospace; font-size: 0.8rem; }
      .sfh-v38__spacer2 { height: 3rem; }
      .sfh-v38__quote { font-family: 'Space Grotesk', sans-serif; font-size: 1.15rem; font-style: italic; color: #1a1a1a; line-height: 1.7; text-align: center; margin-bottom: 3rem; }
      .sfh-v38__cta { text-align: center; }
      .sfh-v38__cta-btn { display: inline-block; padding: 1rem 2.5rem; background: #1a1a1a; color: #fff; text-decoration: none; font-size: 0.75rem; text-transform: uppercase; letter-spacing: 0.1em; }
    `}</style>
    <div className="sfh-v38__wrap">
      <h3 className="sfh-v38__heading">Fly Yourself<br />Anywhere</h3>
      <p className="sfh-v38__sub">You have earned your licence. Now use it. Hire from our fleet, fuelled, washed and waiting on the pad.</p>
      <span className="sfh-v38__dest-label">Destinations</span>
      {destinations.map(d => (
        <div key={d.name} className="sfh-v38__dest-item">
          <span className="sfh-v38__dest-name">{d.name}</span>
          <span className="sfh-v38__dest-time">{d.time}</span>
        </div>
      ))}
      <div className="sfh-v38__spacer" />
      <span className="sfh-v38__fleet-label">Fleet</span>
      {fleet.map(f => (
        <Link key={f.model} to={f.link} className="sfh-v38__fleet-card">
          <img src={f.img} alt={f.model} />
          <div><div className="sfh-v38__fleet-model">{f.model}</div><div className="sfh-v38__fleet-seats">{f.seats}</div></div>
          <span className="sfh-v38__fleet-rate">From {f.rate}</span>
        </Link>
      ))}
      <div className="sfh-v38__spacer2" />
      <div className="sfh-v38__quote">"No crew, no waiting, no compromise."</div>
      <div className="sfh-v38__cta">
        <Link to="/contact?subject=hire" className="sfh-v38__cta-btn">Enquire About Hire</Link>
      </div>
    </div>
  </div>
);

// ─── VARIATION 39: Gradient Dark with Glow Accents ───
const V39 = () => (
  <div className="sfh-v39">
    <style>{`
      .sfh-v39 { background: linear-gradient(180deg, #1a1a1a 0%, #0a0a0a 100%); color: #fff; }
      .sfh-v39__wrap { max-width: 1000px; margin: 0 auto; padding: 4rem 2rem 5rem; }
      .sfh-v39__label { display: block; font-size: 0.65rem; text-transform: uppercase; letter-spacing: 0.3em; color: #555; text-align: center; margin-bottom: 2.5rem; }
      .sfh-v39__dest-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 1.25rem; margin-bottom: 3rem; }
      .sfh-v39__dest-card { border: 1px solid #222; padding: 1.5rem; text-align: center; position: relative; overflow: hidden; transition: border-color 0.3s; }
      .sfh-v39__dest-card:hover { border-color: #444; }
      .sfh-v39__dest-card::after { content: ''; position: absolute; bottom: 0; left: 20%; right: 20%; height: 1px; background: radial-gradient(ellipse, rgba(255,255,255,0.15) 0%, transparent 70%); }
      .sfh-v39__dest-name { font-family: 'Space Grotesk', sans-serif; font-size: 0.8rem; font-weight: 600; text-transform: uppercase; color: #fff; letter-spacing: 0.05em; }
      .sfh-v39__dest-time { font-family: 'Share Tech Mono', monospace; font-size: 1.5rem; color: #fff; display: block; margin-top: 0.5rem; }
      .sfh-v39__dest-car { font-size: 0.6rem; color: #555; margin-top: 0.25rem; display: block; }
      .sfh-v39__divider { width: 60px; height: 1px; background: linear-gradient(90deg, transparent, #333, transparent); margin: 0 auto 3rem; }
      .sfh-v39__fleet-label { display: block; font-size: 0.6rem; text-transform: uppercase; letter-spacing: 0.3em; color: #444; text-align: center; margin-bottom: 1.5rem; }
      .sfh-v39__fleet-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 1.25rem; margin-bottom: 3rem; }
      .sfh-v39__fleet-card { border: 1px solid #222; padding: 1.5rem; text-align: center; text-decoration: none; color: #fff; transition: all 0.3s; }
      .sfh-v39__fleet-card:hover { border-color: #444; transform: translateY(-2px); box-shadow: 0 8px 30px rgba(0,0,0,0.5); }
      .sfh-v39__fleet-card img { height: 60px; object-fit: contain; margin-bottom: 0.75rem; filter: brightness(1.2); }
      .sfh-v39__fleet-model { font-family: 'Space Grotesk', sans-serif; font-weight: 700; text-transform: uppercase; font-size: 1rem; }
      .sfh-v39__fleet-seats { font-size: 0.65rem; color: #666; margin-top: 0.1rem; }
      .sfh-v39__fleet-rate { font-family: 'Share Tech Mono', monospace; font-size: 0.85rem; color: #aaa; display: block; margin-top: 0.3rem; }
      .sfh-v39__cta { text-align: center; }
      .sfh-v39__cta-btn { display: inline-block; padding: 1rem 2.5rem; border: 2px solid #fff; color: #fff; text-decoration: none; font-size: 0.75rem; text-transform: uppercase; letter-spacing: 0.1em; transition: all 0.3s; }
      .sfh-v39__cta-btn:hover { background: #fff; color: #0a0a0a; }
    `}</style>
    <div className="sfh-v39__wrap">
      <span className="sfh-v39__label">Destinations from Denham</span>
      <div className="sfh-v39__dest-grid">
        {destinations.map(d => (
          <div key={d.name} className="sfh-v39__dest-card">
            <div className="sfh-v39__dest-name">{d.name}</div>
            <span className="sfh-v39__dest-time">{d.time}</span>
            <span className="sfh-v39__dest-car">vs {d.carTime} by car</span>
          </div>
        ))}
      </div>
      <div className="sfh-v39__divider" />
      <span className="sfh-v39__fleet-label">Fleet</span>
      <div className="sfh-v39__fleet-grid">
        {fleet.map(f => (
          <Link key={f.model} to={f.link} className="sfh-v39__fleet-card">
            <img src={f.img} alt={f.model} />
            <div className="sfh-v39__fleet-model">{f.model}</div>
            <div className="sfh-v39__fleet-seats">{f.seats}</div>
            <span className="sfh-v39__fleet-rate">From {f.rate}</span>
          </Link>
        ))}
      </div>
      <div className="sfh-v39__cta">
        <Link to="/contact?subject=hire" className="sfh-v39__cta-btn">Enquire About Hire</Link>
      </div>
    </div>
  </div>
);

// ─── VARIATION 40: Aviation HUD (Heads-Up Display) ───
const V40 = () => {
  const [selectedDest, setSelectedDest] = React.useState(0);
  return (
    <div className="sfh-v40">
      <style>{`
        .sfh-v40 { background: #0a0f0a; color: #00ff88; font-family: 'Share Tech Mono', monospace; }
        .sfh-v40__wrap { max-width: 1000px; margin: 0 auto; padding: 4rem 2rem 5rem; }
        .sfh-v40__hud-bar { display: flex; justify-content: space-between; align-items: center; border: 1px solid #003d20; padding: 0.5rem 1rem; margin-bottom: 0.5rem; font-size: 0.6rem; text-transform: uppercase; letter-spacing: 0.15em; color: #006633; }
        .sfh-v40__hud-bar span { color: #00ff88; }
        .sfh-v40__grid { display: grid; grid-template-columns: 1fr 1fr; gap: 0.5rem; margin-bottom: 0.5rem; }
        .sfh-v40__panel { border: 1px solid #003d20; padding: 1.5rem; position: relative; }
        .sfh-v40__panel-label { position: absolute; top: -0.5em; left: 1rem; background: #0a0f0a; padding: 0 0.5rem; font-size: 0.55rem; text-transform: uppercase; letter-spacing: 0.2em; color: #006633; }
        .sfh-v40__dest-list { display: flex; flex-direction: column; gap: 0.5rem; }
        .sfh-v40__dest-row { display: flex; justify-content: space-between; align-items: center; padding: 0.5rem 0.75rem; cursor: pointer; border: 1px solid transparent; transition: all 0.2s; }
        .sfh-v40__dest-row:hover { border-color: #003d20; }
        .sfh-v40__dest-row--active { border-color: #00ff88; background: rgba(0,255,136,0.05); }
        .sfh-v40__dest-name { font-size: 0.8rem; text-transform: uppercase; }
        .sfh-v40__dest-time { font-size: 0.85rem; color: #00ff88; }
        .sfh-v40__dest-car { font-size: 0.55rem; color: #006633; }
        .sfh-v40__readout { text-align: center; padding: 1rem 0; }
        .sfh-v40__readout-label { display: block; font-size: 0.5rem; text-transform: uppercase; letter-spacing: 0.2em; color: #006633; margin-bottom: 0.5rem; }
        .sfh-v40__readout-value { font-size: 2.5rem; color: #00ff88; line-height: 1; }
        .sfh-v40__readout-dest { font-size: 0.75rem; color: #00ff88; margin-top: 0.5rem; display: block; text-transform: uppercase; }
        .sfh-v40__readout-compare { font-size: 0.6rem; color: #006633; margin-top: 0.25rem; display: block; }
        .sfh-v40__fleet-panel { grid-column: span 2; }
        .sfh-v40__fleet-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 0.5rem; }
        .sfh-v40__fleet-cell { border: 1px solid #003d20; padding: 1rem; text-align: center; text-decoration: none; color: #00ff88; transition: all 0.2s; display: block; }
        .sfh-v40__fleet-cell:hover { border-color: #00ff88; background: rgba(0,255,136,0.03); }
        .sfh-v40__fleet-cell img { height: 45px; object-fit: contain; margin-bottom: 0.5rem; filter: brightness(0.7) sepia(1) hue-rotate(100deg) saturate(3); }
        .sfh-v40__fleet-model { font-size: 0.9rem; text-transform: uppercase; display: block; }
        .sfh-v40__fleet-seats { font-size: 0.55rem; color: #006633; display: block; margin-top: 0.15rem; }
        .sfh-v40__fleet-rate { font-size: 0.8rem; color: #00ff88; display: block; margin-top: 0.25rem; }
        .sfh-v40__cta-bar { border: 1px solid #003d20; padding: 0.75rem; text-align: center; margin-top: 0.5rem; }
        .sfh-v40__cta-btn { display: inline-block; padding: 0.75rem 2rem; border: 1px solid #00ff88; color: #00ff88; text-decoration: none; font-size: 0.7rem; text-transform: uppercase; letter-spacing: 0.15em; transition: all 0.3s; font-family: 'Share Tech Mono', monospace; }
        .sfh-v40__cta-btn:hover { background: #00ff88; color: #0a0f0a; }
      `}</style>
      <div className="sfh-v40__wrap">
        <div className="sfh-v40__hud-bar">
          <span>HQ AVIATION // SELF-FLY HIRE</span>
          <span>BASE: DENHAM (EGLD)</span>
          <span>STATUS: AVAILABLE</span>
        </div>
        <div className="sfh-v40__grid">
          <div className="sfh-v40__panel">
            <span className="sfh-v40__panel-label">Navigation Targets</span>
            <div className="sfh-v40__dest-list">
              {destinations.map((d, i) => (
                <div key={d.name} className={`sfh-v40__dest-row ${selectedDest === i ? 'sfh-v40__dest-row--active' : ''}`} onClick={() => setSelectedDest(i)}>
                  <div>
                    <div className="sfh-v40__dest-name">{d.name}</div>
                    <div className="sfh-v40__dest-car">ROAD: {d.carTime}</div>
                  </div>
                  <span className="sfh-v40__dest-time">{d.time}</span>
                </div>
              ))}
            </div>
          </div>
          <div className="sfh-v40__panel">
            <span className="sfh-v40__panel-label">Flight Data</span>
            <div className="sfh-v40__readout">
              <span className="sfh-v40__readout-label">Estimated Flight Time</span>
              <div className="sfh-v40__readout-value">{destinations[selectedDest].time}</div>
              <span className="sfh-v40__readout-dest">{destinations[selectedDest].name}</span>
              <span className="sfh-v40__readout-compare">ROAD EQUIVALENT: {destinations[selectedDest].carTime}</span>
            </div>
          </div>
          <div className="sfh-v40__panel sfh-v40__fleet-panel">
            <span className="sfh-v40__panel-label">Available Aircraft</span>
            <div className="sfh-v40__fleet-grid">
              {fleet.map(f => (
                <Link key={f.model} to={f.link} className="sfh-v40__fleet-cell">
                  <img src={f.img} alt={f.model} />
                  <span className="sfh-v40__fleet-model">{f.model}</span>
                  <span className="sfh-v40__fleet-seats">{f.seats}</span>
                  <span className="sfh-v40__fleet-rate">FROM {f.rate}</span>
                </Link>
              ))}
            </div>
          </div>
        </div>
        <div className="sfh-v40__cta-bar">
          <Link to="/contact?subject=hire" className="sfh-v40__cta-btn">// Initiate Booking Sequence</Link>
        </div>
      </div>
    </div>
  );
};

// ─── VARIATION 41: Dark Map + Interactive Journey Timeline ───
const ukPath = "M224.5 476.8 L199.8 492.6 L189.1 490.9 L176.2 478.9 L162.5 480.4 L168.2 474.2 L156.5 468.8 L136.2 476.6 L122.0 459.4 L165.9 429.1 L172.6 414.4 L168.6 410.0 L167.8 389.1 L144.9 396.6 L161.2 373.6 L194.4 360.3 L207.5 365.9 L204.8 356.7 L208.8 354.6 L221.3 362.4 L208.8 348.7 L214.3 333.7 L210.1 331.0 L210.4 322.1 L215.3 318.3 L216.6 303.6 L204.8 307.0 L188.0 277.4 L193.0 263.3 L209.9 251.0 L189.6 251.5 L173.5 262.8 L139.5 258.3 L135.8 268.9 L126.9 257.5 L125.5 248.9 L130.1 248.7 L145.0 214.0 L136.6 200.6 L139.2 184.9 L148.7 184.3 L138.5 176.7 L140.2 169.4 L123.8 187.6 L123.5 175.6 L132.3 164.3 L117.1 178.8 L110.3 221.5 L101.9 223.3 L112.3 193.5 L107.7 192.8 L111.1 163.2 L124.8 128.8 L106.4 144.1 L87.5 131.5 L103.4 122.3 L98.2 118.9 L110.1 96.6 L99.9 82.8 L109.3 75.3 L102.9 67.0 L108.3 52.7 L126.1 52.7 L116.0 39.9 L119.0 28.5 L131.9 26.8 L128.8 18.6 L133.2 5.3 L154.7 9.9 L209.2 1.6 L203.0 22.8 L172.2 47.4 L170.5 54.7 L177.5 56.9 L166.5 73.3 L199.7 64.2 L247.9 64.8 L256.2 70.9 L259.6 80.2 L231.1 137.0 L199.1 155.5 L215.9 153.2 L224.3 162.9 L197.1 178.2 L180.2 173.7 L209.5 183.4 L227.2 178.3 L245.1 186.7 L264.6 209.3 L281.3 268.0 L303.5 281.5 L326.7 307.6 L321.8 314.2 L334.6 342.2 L303.9 334.3 L318.4 336.6 L340.8 360.7 L344.0 372.6 L331.8 389.9 L341.0 396.4 L352.1 385.7 L380.3 388.6 L395.6 400.1 L399.0 412.0 L393.0 443.1 L378.8 453.1 L380.5 461.7 L359.7 469.5 L365.5 472.2 L365.2 480.2 L346.7 487.4 L386.0 494.3 L385.3 506.7 L367.9 524.0 L338.1 535.0 L298.9 534.9 L274.0 526.0 L277.3 531.1 L249.6 537.6 L252.4 544.2 L249.5 545.8 L211.4 538.2 L195.4 543.8 L184.4 570.4 L164.1 560.1 L143.0 567.0 L127.6 584.1 L106.4 581.5 L136.5 550.5 L148.7 534.1 L151.1 520.6 L160.1 517.1 L164.4 506.2 L205.9 505.0 L233.8 468.8 L224.5 476.8 Z";

// Per-aircraft cruise speeds → range ring radii in SVG units
// Scale: UK ~520nm tall ≈ 580 SVG units → ~1.115 SVG/nm
const aircraftRanges = {
  R22:          { label: 'R22',          cruise: '~100 kts', cruiseKts: 100, r30: 56, r60: 112, r120: 223, color: '#666' },
  R44:          { label: 'R44',          cruise: '~120 kts', cruiseKts: 120, r30: 67, r60: 134, r120: 268, color: '#888' },
  'R66 Turbine': { label: 'R66 Turbine', cruise: '~140 kts', cruiseKts: 140, r30: 78, r60: 156, r120: 312, color: '#aaa' },
};
const formatFlightTime = (nm, kts) => {
  const mins = Math.round((nm / kts) * 60);
  if (mins < 60) return `${mins} min`;
  const h = Math.floor(mins / 60);
  const m = mins % 60;
  return m === 0 ? `${h}h` : `${h}h ${m}min`;
};

const V41 = () => {
  const [hoveredDest, setHoveredDest] = React.useState(null);
  const [lockedDest, setLockedDest] = React.useState(null);
  const [selectedAircraft, setSelectedAircraft] = React.useState('R44');
  const activeDest = hoveredDest !== null ? hoveredDest : lockedDest;
  const denham = { x: 310, y: 480 };
  const destCoords = [
    { name: 'The Cotswolds', x: 265, y: 458, nm: 70, carTime: '1h 45min', desc: 'Fly over the rolling hills and honey-stone villages. Lunch at a country pub, back to Denham before dark.' },
    { name: 'Le Touquet', x: 355, y: 548, nm: 110, carTime: '3h 30min', desc: 'Cross the Channel in under an hour. Fresh seafood on the French coast, no passport queues, no ferry timetables.' },
    { name: 'Scottish Highlands', x: 210, y: 175, nm: 330, carTime: '8h+', desc: 'Glens, lochs and castles from the air. Two and a half hours to a landscape most people drive a full day to reach.' },
    { name: 'Cornwall', x: 145, y: 560, nm: 180, carTime: '4h 30min', desc: 'Skip the M5 entirely. Land near the coast for a weekend of surfing, cream teas and dramatic clifftop walks.' },
  ];
  const range = aircraftRanges[selectedAircraft];

  return (
    <div className="sfh-v41">
      <style>{`
        .sfh-v41 { background: #0e0e0e; color: #fff; }
        .sfh-v41__layout { max-width: 1200px; margin: 0 auto; padding: 4rem 2rem 5rem; display: grid; grid-template-columns: 1fr 380px; gap: 3rem; align-items: start; }

        /* ── Map ── */
        .sfh-v41__map-box { background: #0a0a0a; border: 1px solid #1e1e1e; padding: 1.5rem; }
        .sfh-v41__map-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.75rem; }
        .sfh-v41__map-header span { font-family: 'Share Tech Mono', monospace; font-size: 0.6rem; text-transform: uppercase; letter-spacing: 0.12em; color: #444; }
        .sfh-v41__map-header-status { color: #4ade80 !important; }
        .sfh-v41__map-aircraft-label { display: block; font-family: 'Share Tech Mono', monospace; font-size: 0.55rem; text-transform: uppercase; letter-spacing: 0.1em; color: #333; margin-bottom: 1rem; }
        .sfh-v41__map-aircraft-label strong { color: #888; }
        .sfh-v41__map svg { width: 100%; height: auto; display: block; }
        .sfh-v41__pin { cursor: pointer; }
        .sfh-v41__pin text { font-family: 'Space Grotesk', sans-serif; font-size: 9px; font-weight: 600; fill: #555; text-transform: uppercase; pointer-events: none; transition: fill 0.2s; }
        .sfh-v41__pin--active text { fill: #fff; }
        .sfh-v41__rlabel { font-family: 'Share Tech Mono', monospace; font-size: 7px; fill: #333; }
        .sfh-v41__range-ring { transition: r 0.4s ease, stroke 0.3s; }

        /* ── Journey Timeline ── */
        .sfh-v41__journey { position: sticky; top: 2rem; }
        .sfh-v41__journey-label { display: block; font-size: 0.6rem; text-transform: uppercase; letter-spacing: 0.3em; color: #444; margin-bottom: 2rem; font-family: 'Share Tech Mono', monospace; }

        /* Timeline steps (01 Select Destination, 02 Choose Aircraft, 03 Fly) */
        .sfh-v41__tl-step { display: grid; grid-template-columns: 36px 1fr; gap: 1rem; position: relative; }
        .sfh-v41__tl-step::before { content: ''; position: absolute; left: 17px; top: 36px; bottom: 0; width: 1px; background: #222; }
        .sfh-v41__tl-num { width: 36px; height: 36px; border-radius: 50%; border: 1px solid #444; display: flex; align-items: center; justify-content: center; font-family: 'Share Tech Mono', monospace; font-size: 0.65rem; color: #888; background: #0e0e0e; position: relative; z-index: 1; }
        .sfh-v41__tl-step--active .sfh-v41__tl-num { border-color: #fff; color: #fff; }
        .sfh-v41__tl-title { font-family: 'Space Grotesk', sans-serif; font-size: 0.8rem; font-weight: 700; text-transform: uppercase; letter-spacing: 0.05em; color: #888; padding-top: 0.5rem; }
        .sfh-v41__tl-step--active .sfh-v41__tl-title { color: #fff; }

        /* Destination list (unnumbered, nested inside step 01) */
        .sfh-v41__dest-list { padding: 1rem 0 0 0; margin: 0; list-style: none; }
        .sfh-v41__dest-item { display: flex; justify-content: space-between; align-items: center; padding: 0.6rem 0.75rem; cursor: pointer; transition: all 0.2s; border-left: 2px solid transparent; margin-bottom: 2px; }
        .sfh-v41__dest-item:hover { background: rgba(255,255,255,0.03); }
        .sfh-v41__dest-item--active { border-left-color: #fff; background: rgba(255,255,255,0.05); }
        .sfh-v41__dest-name { font-family: 'Space Grotesk', sans-serif; font-size: 0.85rem; font-weight: 600; color: #666; transition: color 0.2s; }
        .sfh-v41__dest-item--active .sfh-v41__dest-name { color: #fff; }
        .sfh-v41__dest-flight { font-family: 'Share Tech Mono', monospace; font-size: 0.7rem; color: #444; }
        .sfh-v41__dest-item--active .sfh-v41__dest-flight { color: #888; }

        /* Destination detail panel — fixed height via CSS grid stack */
        .sfh-v41__dest-detail-wrap { display: grid; margin-top: 0.75rem; border: 1px solid #1e1e1e; background: rgba(255,255,255,0.02); }
        .sfh-v41__dest-detail-wrap > * { grid-area: 1 / 1; padding: 1.25rem; transition: opacity 0.25s; }
        .sfh-v41__dest-detail { opacity: 0; pointer-events: none; }
        .sfh-v41__dest-detail--active { opacity: 1; pointer-events: auto; }
        .sfh-v41__dest-detail--empty { display: flex; align-items: center; justify-content: center; }
        .sfh-v41__dest-detail-hint { font-size: 0.7rem; color: #333; font-family: 'Share Tech Mono', monospace; text-transform: uppercase; letter-spacing: 0.1em; }
        .sfh-v41__dest-detail-endless { display: block; margin-top: 0.75rem; font-family: 'Space Grotesk', sans-serif; font-size: 0.85rem; font-weight: 600; color: #666; }
        .sfh-v41__dest-detail-time { font-family: 'Share Tech Mono', monospace; font-size: 1.8rem; color: #fff; margin-bottom: 0.15rem; }
        .sfh-v41__dest-detail-car { font-size: 0.65rem; color: #555; margin-bottom: 0.75rem; }
        .sfh-v41__dest-detail-desc { font-size: 0.85rem; color: #888; line-height: 1.6; }
        .sfh-v41__dest-detail-name { font-family: 'Space Grotesk', sans-serif; font-size: 0.7rem; font-weight: 700; text-transform: uppercase; letter-spacing: 0.08em; color: #555; margin-bottom: 0.5rem; }

        /* Step 02 & 03 spacing */
        .sfh-v41__tl-step-02 { margin-top: 2rem; }
        .sfh-v41__tl-step-03 { margin-top: 2rem; }
        .sfh-v41__tl-step-03::before { display: none; }
        .sfh-v41__fly-text { font-size: 0.85rem; color: #888; line-height: 1.6; padding-top: 0.5rem; }

        /* ── Fleet ── */
        .sfh-v41__fleet-row { display: flex; align-items: center; gap: 0.75rem; padding: 0.6rem 0.75rem; border: 1px solid #1e1e1e; color: #fff; transition: all 0.3s; margin-bottom: 0.5rem; cursor: pointer; text-decoration: none; }
        .sfh-v41__fleet-row:hover { border-color: #444; }
        .sfh-v41__fleet-row--active { border-color: #fff; background: rgba(255,255,255,0.04); }
        .sfh-v41__fleet-row img { height: 28px; object-fit: contain; width: 48px; }
        .sfh-v41__fleet-model { font-family: 'Space Grotesk', sans-serif; font-weight: 700; text-transform: uppercase; font-size: 0.75rem; }
        .sfh-v41__fleet-info { font-size: 0.6rem; color: #555; }
        .sfh-v41__fleet-rate { margin-left: auto; font-family: 'Share Tech Mono', monospace; font-size: 0.7rem; color: #888; }

        /* ── CTA ── */
        .sfh-v41__cta { display: block; width: 100%; padding: 0.85rem; background: #fff; color: #0e0e0e; text-decoration: none; font-size: 0.7rem; text-transform: uppercase; letter-spacing: 0.1em; text-align: center; font-family: 'Space Grotesk', sans-serif; font-weight: 600; margin-top: 1.5rem; transition: background 0.3s; }
        .sfh-v41__cta:hover { background: #ddd; }

        @media (max-width: 900px) {
          .sfh-v41__layout { grid-template-columns: 1fr; }
        }
      `}</style>
      <div className="sfh-v41__layout">
        {/* LEFT: Dark Map */}
        <div className="sfh-v41__map-box">
          <div className="sfh-v41__map-header">
            <span>Range Map — Denham (EGLD)</span>
          </div>
          <div className="sfh-v41__map-aircraft-label">Showing range for: <strong>{range.label}</strong> at {range.cruise} cruise</div>
          <div className="sfh-v41__map">
            <svg viewBox="0 0 500 620" fill="none">
              <defs>
                <radialGradient id="v41glow30" cx="50%" cy="50%" r="50%"><stop offset="0%" stopColor="#fff" stopOpacity="0.04"/><stop offset="100%" stopColor="#fff" stopOpacity="0"/></radialGradient>
                <radialGradient id="v41glow60" cx="50%" cy="50%" r="50%"><stop offset="0%" stopColor="#fff" stopOpacity="0.02"/><stop offset="100%" stopColor="#fff" stopOpacity="0"/></radialGradient>
              </defs>

              {/* UK landmass — rendered FIRST so rings go on top */}
              <path d={ukPath} stroke="#222" strokeWidth="1.2" fill="#141414" />

              {/* Range rings — ABOVE landmass, sized per selected aircraft */}
              <circle className="sfh-v41__range-ring" cx={denham.x} cy={denham.y} r={range.r30} fill="url(#v41glow30)" stroke="#333" strokeWidth="1" strokeDasharray="4 3" />
              <circle className="sfh-v41__range-ring" cx={denham.x} cy={denham.y} r={range.r60} fill="url(#v41glow60)" stroke="#2a2a2a" strokeWidth="1" strokeDasharray="6 4" />
              <circle className="sfh-v41__range-ring" cx={denham.x} cy={denham.y} r={range.r120} fill="none" stroke="#222" strokeWidth="1" strokeDasharray="8 5" />

              {/* Range labels */}
              <text x={denham.x + range.r30 + 4} y={denham.y - 4} className="sfh-v41__rlabel">30 MIN</text>
              <text x={denham.x + range.r60 + 4} y={denham.y - 4} className="sfh-v41__rlabel">1 HR</text>
              <text x={denham.x + range.r120 + 4} y={denham.y - 4} className="sfh-v41__rlabel">2 HR</text>

              {/* Denham base */}
              <circle cx={denham.x} cy={denham.y} r="5" fill="#fff" />
              <circle cx={denham.x} cy={denham.y} r="10" fill="none" stroke="#fff" strokeWidth="0.5" opacity="0.15" />
              <text x={denham.x + 12} y={denham.y + 3} fontFamily="Share Tech Mono" fontSize="7" fill="#666" fontWeight="700">DENHAM</text>

              {/* Route lines + destination pins — hover to activate (skip entries with no coords) */}
              {destCoords.map((d, i) => {
                if (!d.x) return null;
                const isActive = activeDest === i;
                const dx = d.x - denham.x, dy = d.y - denham.y;
                const dist = Math.sqrt(dx * dx + dy * dy);
                const offset = 14;
                const sx = denham.x + (dx / dist) * offset, sy = denham.y + (dy / dist) * offset;
                return (
                  <g key={d.name} className={`sfh-v41__pin ${isActive ? 'sfh-v41__pin--active' : ''}`} onMouseEnter={() => setHoveredDest(i)} onMouseLeave={() => setHoveredDest(null)} onClick={() => setLockedDest(lockedDest === i ? null : i)} style={{ cursor: 'pointer' }}>
                    {/* Invisible wider hit area for easier hovering */}
                    <line x1={sx} y1={sy} x2={d.x} y2={d.y} stroke="transparent" strokeWidth="16" />
                    <line x1={sx} y1={sy} x2={d.x} y2={d.y} stroke={isActive ? '#fff' : '#2a2a2a'} strokeWidth={isActive ? 1.5 : 0.75} strokeDasharray="4 3" style={{ transition: 'all 0.2s' }} />
                    <circle cx={d.x} cy={d.y} r={isActive ? 7 : 4} fill={isActive ? '#fff' : '#555'} style={{ transition: 'all 0.2s' }} />
                    {isActive && <circle cx={d.x} cy={d.y} r="14" fill="none" stroke="#fff" strokeWidth="0.5" opacity="0.25" />}
                    <text x={d.x + (d.x < denham.x ? -10 : 12)} y={d.y + (d.y < denham.y ? -10 : 16)} textAnchor={d.x < denham.x ? 'end' : 'start'}>{d.name}</text>
                  </g>
                );
              })}
            </svg>
          </div>
        </div>

        {/* RIGHT: Journey Timeline */}
        <div className="sfh-v41__journey">
          <span className="sfh-v41__journey-label">Self-Fly Hire</span>

          {/* ── Step 01: Select Destination ── */}
          <div className={`sfh-v41__tl-step ${activeDest !== null ? 'sfh-v41__tl-step--active' : ''}`}>
            <span className="sfh-v41__tl-num">01</span>
            <div>
              <div className="sfh-v41__tl-title">Select Destination</div>
              <ul className="sfh-v41__dest-list">
                {destCoords.map((d, i) => (
                  <li
                    key={d.name}
                    className={`sfh-v41__dest-item ${activeDest === i ? 'sfh-v41__dest-item--active' : ''}`}
                    onMouseEnter={() => setHoveredDest(i)}
                    onMouseLeave={() => setHoveredDest(null)}
                    onClick={() => setLockedDest(lockedDest === i ? null : i)}
                  >
                    <span className="sfh-v41__dest-name">{d.name}</span>
                    <span className="sfh-v41__dest-flight">{d.nm > 0 ? formatFlightTime(d.nm, range.cruiseKts) : ''}</span>
                  </li>
                ))}
              </ul>

              {/* Detail panel — all destinations stacked in same grid cell, only active one visible */}
              <div className="sfh-v41__dest-detail-wrap">
                <div className={`sfh-v41__dest-detail sfh-v41__dest-detail--empty ${activeDest === null ? 'sfh-v41__dest-detail--active' : ''}`}>
                  <span className="sfh-v41__dest-detail-hint">Hover or click a destination to see details</span>
                </div>
                {destCoords.map((d, i) => (
                  <div key={d.name} className={`sfh-v41__dest-detail ${activeDest === i ? 'sfh-v41__dest-detail--active' : ''}`}>
                    <div className="sfh-v41__dest-detail-name">{d.name}</div>
                    {d.nm > 0 && <div className="sfh-v41__dest-detail-time">{formatFlightTime(d.nm, range.cruiseKts)}</div>}
                    {d.carTime && <div className="sfh-v41__dest-detail-car">vs {d.carTime} by car</div>}
                    <div className="sfh-v41__dest-detail-desc">{d.desc}</div>
                  </div>
                ))}
              </div>
              <span className="sfh-v41__dest-detail-endless">Endless...</span>
            </div>
          </div>

          {/* ── Step 02: Choose Your Aircraft ── */}
          <div className={`sfh-v41__tl-step sfh-v41__tl-step-02 sfh-v41__tl-step--active`}>
            <span className="sfh-v41__tl-num">02</span>
            <div>
              <div className="sfh-v41__tl-title">Choose Your Aircraft</div>
              <div style={{ paddingTop: '1rem' }}>
                {fleet.map(f => (
                  <div key={f.model} className={`sfh-v41__fleet-row ${selectedAircraft === f.model ? 'sfh-v41__fleet-row--active' : ''}`} onClick={() => setSelectedAircraft(f.model)}>
                    <img src={f.img} alt={f.model} />
                    <div>
                      <div className="sfh-v41__fleet-model">{f.model}</div>
                      <div className="sfh-v41__fleet-info">{f.seats} · {aircraftRanges[f.model].cruise}</div>
                    </div>
                    <span className="sfh-v41__fleet-rate">From {f.rate}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* ── Step 03: Fly ── */}
          <div className="sfh-v41__tl-step sfh-v41__tl-step-03 sfh-v41__tl-step--active">
            <span className="sfh-v41__tl-num">03</span>
            <div>
              <div className="sfh-v41__tl-title">Fly</div>
              <div className="sfh-v41__fly-text">No crew, no waiting, no compromise. Available by the hour, day or week. Your licence, your aircraft, your schedule.</div>
            </div>
          </div>

          <Link to="/contact?subject=hire" className="sfh-v41__cta">Enquire About Hire</Link>
        </div>
      </div>
    </div>
  );
};

const V42 = () => {
  const [hoveredDest, setHoveredDest] = React.useState(null);
  const [lockedDest, setLockedDest] = React.useState(null);
  const [selectedAircraft, setSelectedAircraft] = React.useState('R44');
  const activeDest = hoveredDest !== null ? hoveredDest : lockedDest;
  const denham = { x: 310, y: 480 };
  const destCoords = [
    { name: 'The Cotswolds', x: 265, y: 458, nm: 70, carTime: '1h 45min', desc: 'Fly over the rolling hills and honey-stone villages. Lunch at a country pub, back to Denham before dark.' },
    { name: 'Le Touquet', x: 355, y: 548, nm: 110, carTime: '3h 30min', desc: 'Cross the Channel in under an hour. Fresh seafood on the French coast, no passport queues, no ferry timetables.' },
    { name: 'Scottish Highlands', x: 210, y: 175, nm: 330, carTime: '8h+', desc: 'Glens, lochs and castles from the air. Two and a half hours to a landscape most people drive a full day to reach.' },
    { name: 'Cornwall', x: 145, y: 560, nm: 180, carTime: '4h 30min', desc: 'Skip the M5 entirely. Land near the coast for a weekend of surfing, cream teas and dramatic clifftop walks.' },
  ];
  const range = aircraftRanges[selectedAircraft];

  return (
    <div className="sfh-v42">
      <style>{`
        .sfh-v42 { background: #e8e4df; color: #1a1a1a; }
        .sfh-v42__layout { max-width: 1200px; margin: 0 auto; padding: 4rem 2rem 5rem; display: grid; grid-template-columns: 1fr 380px; gap: 3rem; align-items: start; }

        /* ── Map ── */
        .sfh-v42__map-box { background: #f2efea; border: 1px solid #ccc8c1; padding: 1.5rem; }
        .sfh-v42__map-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.75rem; }
        .sfh-v42__map-header span { font-family: 'Share Tech Mono', monospace; font-size: 0.6rem; text-transform: uppercase; letter-spacing: 0.12em; color: #777; }
        .sfh-v42__map-aircraft-label { display: block; font-family: 'Share Tech Mono', monospace; font-size: 0.55rem; text-transform: uppercase; letter-spacing: 0.1em; color: #777; margin-bottom: 1rem; }
        .sfh-v42__map-aircraft-label strong { color: #1a1a1a; }
        .sfh-v42__map svg { width: 100%; height: auto; display: block; }
        .sfh-v42__pin { cursor: pointer; }
        .sfh-v42__pin text { font-family: 'Space Grotesk', sans-serif; font-size: 9px; font-weight: 600; fill: #888; text-transform: uppercase; pointer-events: none; transition: fill 0.2s; }
        .sfh-v42__pin--active text { fill: #1a1a1a; }
        .sfh-v42__rlabel { font-family: 'Share Tech Mono', monospace; font-size: 7px; fill: #999; }
        .sfh-v42__range-ring { transition: r 0.4s ease, stroke 0.3s; }

        /* ── Journey Timeline ── */
        .sfh-v42__journey { position: sticky; top: 2rem; }
        .sfh-v42__journey-label { display: block; font-size: 0.6rem; text-transform: uppercase; letter-spacing: 0.3em; color: #777; margin-bottom: 2rem; font-family: 'Share Tech Mono', monospace; }

        /* Timeline steps */
        .sfh-v42__tl-step { display: grid; grid-template-columns: 36px 1fr; gap: 1rem; position: relative; }
        .sfh-v42__tl-step::before { content: ''; position: absolute; left: 17px; top: 36px; bottom: 0; width: 1px; background: #ccc8c1; }
        .sfh-v42__tl-num { width: 36px; height: 36px; border-radius: 50%; border: 1px solid #aaa; display: flex; align-items: center; justify-content: center; font-family: 'Share Tech Mono', monospace; font-size: 0.65rem; color: #777; background: #e8e4df; position: relative; z-index: 1; }
        .sfh-v42__tl-step--active .sfh-v42__tl-num { border-color: #1a1a1a; color: #1a1a1a; }
        .sfh-v42__tl-title { font-family: 'Space Grotesk', sans-serif; font-size: 0.8rem; font-weight: 700; text-transform: uppercase; letter-spacing: 0.05em; color: #777; padding-top: 0.5rem; }
        .sfh-v42__tl-step--active .sfh-v42__tl-title { color: #1a1a1a; }

        /* Destination list */
        .sfh-v42__dest-list { padding: 1rem 0 0 0; margin: 0; list-style: none; }
        .sfh-v42__dest-item { display: flex; justify-content: space-between; align-items: center; padding: 0.6rem 0.75rem; cursor: pointer; transition: all 0.2s; border-left: 2px solid transparent; margin-bottom: 2px; }
        .sfh-v42__dest-item:hover { background: rgba(0,0,0,0.04); }
        .sfh-v42__dest-item--active { border-left-color: #1a1a1a; background: rgba(0,0,0,0.06); }
        .sfh-v42__dest-name { font-family: 'Space Grotesk', sans-serif; font-size: 0.85rem; font-weight: 600; color: #666; transition: color 0.2s; }
        .sfh-v42__dest-item--active .sfh-v42__dest-name { color: #1a1a1a; }
        .sfh-v42__dest-flight { font-family: 'Share Tech Mono', monospace; font-size: 0.7rem; color: #999; }
        .sfh-v42__dest-item--active .sfh-v42__dest-flight { color: #444; }

        /* Destination detail panel */
        .sfh-v42__dest-detail-wrap { display: grid; margin-top: 0.75rem; border: 1px solid #ccc8c1; background: #f2efea; }
        .sfh-v42__dest-detail-wrap > * { grid-area: 1 / 1; padding: 1.25rem; transition: opacity 0.25s; }
        .sfh-v42__dest-detail { opacity: 0; pointer-events: none; }
        .sfh-v42__dest-detail--active { opacity: 1; pointer-events: auto; }
        .sfh-v42__dest-detail--empty { display: flex; align-items: center; justify-content: center; }
        .sfh-v42__dest-detail-hint { font-size: 0.7rem; color: #999; font-family: 'Share Tech Mono', monospace; text-transform: uppercase; letter-spacing: 0.1em; }
        .sfh-v42__dest-detail-endless { display: block; margin-top: 0.75rem; font-family: 'Space Grotesk', sans-serif; font-size: 0.85rem; font-weight: 600; color: #666; }
        .sfh-v42__dest-detail-time { font-family: 'Share Tech Mono', monospace; font-size: 1.8rem; color: #1a1a1a; margin-bottom: 0.15rem; }
        .sfh-v42__dest-detail-car { font-size: 0.65rem; color: #777; margin-bottom: 0.75rem; }
        .sfh-v42__dest-detail-desc { font-size: 0.85rem; color: #555; line-height: 1.6; }
        .sfh-v42__dest-detail-name { font-family: 'Space Grotesk', sans-serif; font-size: 0.7rem; font-weight: 700; text-transform: uppercase; letter-spacing: 0.08em; color: #777; margin-bottom: 0.5rem; }

        /* Step 02 & 03 spacing */
        .sfh-v42__tl-step-02 { margin-top: 2rem; }
        .sfh-v42__tl-step-03 { margin-top: 2rem; }
        .sfh-v42__tl-step-03::before { display: none; }
        .sfh-v42__fly-text { font-size: 0.85rem; color: #555; line-height: 1.6; padding-top: 0.5rem; }

        /* ── Fleet ── */
        .sfh-v42__fleet-row { display: flex; align-items: center; gap: 0.75rem; padding: 0.6rem 0.75rem; border: 1px solid #ccc8c1; color: #1a1a1a; transition: all 0.3s; margin-bottom: 0.5rem; cursor: pointer; text-decoration: none; }
        .sfh-v42__fleet-row:hover { border-color: #888; }
        .sfh-v42__fleet-row--active { border-color: #1a1a1a; background: rgba(0,0,0,0.04); }
        .sfh-v42__fleet-row img { height: 28px; object-fit: contain; width: 48px; }
        .sfh-v42__fleet-model { font-family: 'Space Grotesk', sans-serif; font-weight: 700; text-transform: uppercase; font-size: 0.75rem; }
        .sfh-v42__fleet-info { font-size: 0.6rem; color: #777; }
        .sfh-v42__fleet-rate { margin-left: auto; font-family: 'Share Tech Mono', monospace; font-size: 0.7rem; color: #555; }

        /* ── CTA ── */
        .sfh-v42__cta { display: block; width: 100%; padding: 0.85rem; background: #1a1a1a; color: #fff; text-decoration: none; font-size: 0.7rem; text-transform: uppercase; letter-spacing: 0.1em; text-align: center; font-family: 'Space Grotesk', sans-serif; font-weight: 600; margin-top: 1.5rem; transition: background 0.3s; }
        .sfh-v42__cta:hover { background: #333; }

        @media (max-width: 900px) {
          .sfh-v42__layout { grid-template-columns: 1fr; }
        }
      `}</style>
      <div className="sfh-v42__layout">
        {/* LEFT: Light Map */}
        <div className="sfh-v42__map-box">
          <div className="sfh-v42__map-header">
            <span>Range Map — Denham (EGLD)</span>
          </div>
          <div className="sfh-v42__map-aircraft-label">Showing range for: <strong>{range.label}</strong> at {range.cruise} cruise</div>
          <div className="sfh-v42__map">
            <svg viewBox="0 0 500 620" fill="none">
              <defs>
                <radialGradient id="v42glow30" cx="50%" cy="50%" r="50%"><stop offset="0%" stopColor="#1a1a1a" stopOpacity="0.03"/><stop offset="100%" stopColor="#1a1a1a" stopOpacity="0"/></radialGradient>
                <radialGradient id="v42glow60" cx="50%" cy="50%" r="50%"><stop offset="0%" stopColor="#1a1a1a" stopOpacity="0.015"/><stop offset="100%" stopColor="#1a1a1a" stopOpacity="0"/></radialGradient>
              </defs>

              {/* UK landmass */}
              <path d={ukPath} stroke="#b5b0a8" strokeWidth="1.2" fill="#d6d1ca" />

              {/* Range rings */}
              <circle className="sfh-v42__range-ring" cx={denham.x} cy={denham.y} r={range.r30} fill="url(#v42glow30)" stroke="#aaa" strokeWidth="1" strokeDasharray="4 3" />
              <circle className="sfh-v42__range-ring" cx={denham.x} cy={denham.y} r={range.r60} fill="url(#v42glow60)" stroke="#bbb" strokeWidth="1" strokeDasharray="6 4" />
              <circle className="sfh-v42__range-ring" cx={denham.x} cy={denham.y} r={range.r120} fill="none" stroke="#ccc8c1" strokeWidth="1" strokeDasharray="8 5" />

              {/* Range labels */}
              <text x={denham.x + range.r30 + 4} y={denham.y - 4} className="sfh-v42__rlabel">30 MIN</text>
              <text x={denham.x + range.r60 + 4} y={denham.y - 4} className="sfh-v42__rlabel">1 HR</text>
              <text x={denham.x + range.r120 + 4} y={denham.y - 4} className="sfh-v42__rlabel">2 HR</text>

              {/* Denham base */}
              <circle cx={denham.x} cy={denham.y} r="5" fill="#1a1a1a" />
              <circle cx={denham.x} cy={denham.y} r="10" fill="none" stroke="#1a1a1a" strokeWidth="0.5" opacity="0.15" />
              <text x={denham.x + 12} y={denham.y + 3} fontFamily="Share Tech Mono" fontSize="7" fill="#666" fontWeight="700">DENHAM</text>

              {/* Route lines + destination pins */}
              {destCoords.map((d, i) => {
                if (!d.x) return null;
                const isActive = activeDest === i;
                const dx = d.x - denham.x, dy = d.y - denham.y;
                const dist = Math.sqrt(dx * dx + dy * dy);
                const offset = 14;
                const sx = denham.x + (dx / dist) * offset, sy = denham.y + (dy / dist) * offset;
                return (
                  <g key={d.name} className={`sfh-v42__pin ${isActive ? 'sfh-v42__pin--active' : ''}`} onMouseEnter={() => setHoveredDest(i)} onMouseLeave={() => setHoveredDest(null)} onClick={() => setLockedDest(lockedDest === i ? null : i)} style={{ cursor: 'pointer' }}>
                    <line x1={sx} y1={sy} x2={d.x} y2={d.y} stroke="transparent" strokeWidth="16" />
                    <line x1={sx} y1={sy} x2={d.x} y2={d.y} stroke={isActive ? '#1a1a1a' : '#b5b0a8'} strokeWidth={isActive ? 1.5 : 0.75} strokeDasharray="4 3" style={{ transition: 'all 0.2s' }} />
                    <circle cx={d.x} cy={d.y} r={isActive ? 7 : 4} fill={isActive ? '#1a1a1a' : '#999'} style={{ transition: 'all 0.2s' }} />
                    {isActive && <circle cx={d.x} cy={d.y} r="14" fill="none" stroke="#1a1a1a" strokeWidth="0.5" opacity="0.25" />}
                    <text x={d.x + (d.x < denham.x ? -10 : 12)} y={d.y + (d.y < denham.y ? -10 : 16)} textAnchor={d.x < denham.x ? 'end' : 'start'}>{d.name}</text>
                  </g>
                );
              })}
            </svg>
          </div>
        </div>

        {/* RIGHT: Journey Timeline */}
        <div className="sfh-v42__journey">
          <span className="sfh-v42__journey-label">Self-Fly Hire</span>

          {/* Step 01: Select Destination */}
          <div className={`sfh-v42__tl-step ${activeDest !== null ? 'sfh-v42__tl-step--active' : ''}`}>
            <span className="sfh-v42__tl-num">01</span>
            <div>
              <div className="sfh-v42__tl-title">Select Destination</div>
              <ul className="sfh-v42__dest-list">
                {destCoords.map((d, i) => (
                  <li
                    key={d.name}
                    className={`sfh-v42__dest-item ${activeDest === i ? 'sfh-v42__dest-item--active' : ''}`}
                    onMouseEnter={() => setHoveredDest(i)}
                    onMouseLeave={() => setHoveredDest(null)}
                    onClick={() => setLockedDest(lockedDest === i ? null : i)}
                  >
                    <span className="sfh-v42__dest-name">{d.name}</span>
                    <span className="sfh-v42__dest-flight">{d.nm > 0 ? formatFlightTime(d.nm, range.cruiseKts) : ''}</span>
                  </li>
                ))}
              </ul>

              <div className="sfh-v42__dest-detail-wrap">
                <div className={`sfh-v42__dest-detail sfh-v42__dest-detail--empty ${activeDest === null ? 'sfh-v42__dest-detail--active' : ''}`}>
                  <span className="sfh-v42__dest-detail-hint">Hover or click a destination to see details</span>
                </div>
                {destCoords.map((d, i) => (
                  <div key={d.name} className={`sfh-v42__dest-detail ${activeDest === i ? 'sfh-v42__dest-detail--active' : ''}`}>
                    <div className="sfh-v42__dest-detail-name">{d.name}</div>
                    {d.nm > 0 && <div className="sfh-v42__dest-detail-time">{formatFlightTime(d.nm, range.cruiseKts)}</div>}
                    {d.carTime && <div className="sfh-v42__dest-detail-car">vs {d.carTime} by car</div>}
                    <div className="sfh-v42__dest-detail-desc">{d.desc}</div>
                  </div>
                ))}
              </div>
              <span className="sfh-v42__dest-detail-endless">Endless...</span>
            </div>
          </div>

          {/* Step 02: Choose Your Aircraft */}
          <div className={`sfh-v42__tl-step sfh-v42__tl-step-02 sfh-v42__tl-step--active`}>
            <span className="sfh-v42__tl-num">02</span>
            <div>
              <div className="sfh-v42__tl-title">Choose Your Aircraft</div>
              <div style={{ paddingTop: '1rem' }}>
                {fleet.map(f => (
                  <div key={f.model} className={`sfh-v42__fleet-row ${selectedAircraft === f.model ? 'sfh-v42__fleet-row--active' : ''}`} onClick={() => setSelectedAircraft(f.model)}>
                    <img src={f.img} alt={f.model} />
                    <div>
                      <div className="sfh-v42__fleet-model">{f.model}</div>
                      <div className="sfh-v42__fleet-info">{f.seats} · {aircraftRanges[f.model].cruise}</div>
                    </div>
                    <span className="sfh-v42__fleet-rate">From {f.rate}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Step 03: Fly */}
          <div className="sfh-v42__tl-step sfh-v42__tl-step-03 sfh-v42__tl-step--active">
            <span className="sfh-v42__tl-num">03</span>
            <div>
              <div className="sfh-v42__tl-title">Fly</div>
              <div className="sfh-v42__fly-text">No crew, no waiting, no compromise. Available by the hour, day or week. Your licence, your aircraft, your schedule.</div>
            </div>
          </div>

          <Link to="/contact?subject=hire" className="sfh-v42__cta">Enquire About Hire</Link>
        </div>
      </div>
    </div>
  );
};

// ============================================================
// VARIATION MAP
// ============================================================
const variationMap = {
  'v1': V1, 'v2': V2, 'v3': V3, 'v4': V4, 'v5': V5,
  'v6': V6, 'v7': V7, 'v8': V8, 'v9': V9, 'v10': V10,
  'v11': V11, 'v12': V12, 'v13': V13, 'v14': V14, 'v15': V15,
  'v16': V16, 'v17': V17, 'v18': V18, 'v19': V19, 'v20': V20,
  'v21': V21, 'v22': V22, 'v23': V23, 'v24': V24, 'v25': V25,
  'v26': V26, 'v27': V27, 'v28': V28, 'v29': V29, 'v30': V30,
  'v31': V31, 'v32': V32, 'v33': V33, 'v34': V34, 'v35': V35,
  'v36': V36, 'v37': V37, 'v38': V38, 'v39': V39, 'v40': V40,
  'v41': V41,
  'v42': V42,
};

// ============================================================
// PICKER SECTIONS & TABS
// ============================================================
const sections = {
  layout: [
    { id: 'v1', name: 'Clean Minimal Grid', category: 'Grid', desc: 'White cards, thin borders, elegant spacing — classic luxury minimal' },
    { id: 'v2', name: 'Dark Immersive + Row Fleet', category: 'Immersive', desc: 'Dark destination cards (3:4), fleet as horizontal rows with split text' },
    { id: 'v3', name: 'Horizontal Scroll + Hero Fleet', category: 'Carousel', desc: 'Scrollable destination strip, featured R44 hero + side stack' },
    { id: 'v5', name: 'Magazine Editorial', category: 'Editorial', desc: 'Asymmetric photo grid, inline fleet strip, vertical quote' },
    { id: 'v8', name: 'Split Screen', category: 'Split', desc: 'Destinations left, fleet right in two columns' },
  ],
  style: [
    { id: 'v4', name: 'Technical Instrument Panel', category: 'Technical', desc: 'Data table routes, monospace labels, spec-grid fleet — aviation instrument feel' },
    { id: 'v6', name: 'All-Dark Luxury', category: 'Dark', desc: 'Full dark background, inverted imagery, ghost borders — night mode luxury' },
    { id: 'v7', name: 'Stats-First Impact', category: 'Data', desc: 'Large numbers at top, dark destination strip, clean fleet grid' },
    { id: 'v9', name: 'Pricing Tiers', category: 'Commercial', desc: 'SaaS-style pricing cards with features, dark destination bar' },
    { id: 'v10', name: 'Vertical Journey Narrative', category: 'Narrative', desc: 'Step-by-step timeline: choose destination → select aircraft → fly' },
  ],
  experience: [
    { id: 'v11', name: 'Cinematic Video Hero', category: 'Cinematic', desc: 'Full-bleed video background destinations, overlay fleet cards' },
    { id: 'v12', name: 'Destination Comparison Slider', category: 'Interactive', desc: 'Car vs heli time bars animated, fleet carousel below' },
    { id: 'v13', name: 'Booking Experience', category: 'Functional', desc: 'Select destination → choose aircraft → see price — guided flow' },
    { id: 'v14', name: 'Lifestyle Gallery', category: 'Lifestyle', desc: 'Large lifestyle photography, overlaid quotes, inline fleet' },
    { id: 'v15', name: 'Departure Board', category: 'Aviation', desc: 'Airport-style departure board for destinations, gate-style fleet' },
  ],
  minimal: [
    { id: 'v16', name: 'Ultra Minimal', category: 'Minimal', desc: 'Maximum whitespace, single centered column, typography-focused' },
    { id: 'v17', name: 'Asymmetric Editorial', category: 'Asymmetric', desc: 'Off-center layouts, mixed alignment, art-directed' },
    { id: 'v18', name: 'Card Stack', category: 'Cards', desc: 'Overlapping stacked cards with fleet + destination info combined' },
    { id: 'v19', name: 'Full-Width Bands', category: 'Bands', desc: 'Alternating full-width color bands, each containing one section' },
    { id: 'v20', name: 'Interactive Map', category: 'Map', desc: 'SVG map of UK with destination pins, fleet sidebar' },
  ],
  mapRadial: [
    { id: 'v21', name: 'Dark Map', category: 'Map', desc: 'Dark #111 background UK map with glowing range rings and destination pins' },
    { id: 'v22', name: 'Radial Range Diagram', category: 'Data Viz', desc: 'Concentric circles from center, destinations at correct angles — pure data visualization' },
    { id: 'v23', name: 'Full-Width Map', category: 'Map', desc: 'UK outline spanning full width, fleet below as horizontal bar' },
    { id: 'v41', name: 'Dark Map + Journey Timeline', category: 'Map+Journey', desc: 'Accurate UK map left, interactive journey narrative right — click destinations to expand details' },
    { id: 'v42', name: 'Light Map + Journey Timeline', category: 'Map+Journey', desc: 'White background version — same interactive map and journey timeline on light theme' },
  ],
  journey: [
    { id: 'v24', name: 'Horizontal Journey', category: 'Journey', desc: 'Step 1-2-3 laid out left to right with connecting line' },
    { id: 'v25', name: 'Narrative with Images', category: 'Narrative', desc: 'Each step paired with a large image, alternating sides' },
    { id: 'v26', name: 'Accordion Steps', category: 'Interactive', desc: 'Expandable sections for each step, one open at a time' },
  ],
  interactive: [
    { id: 'v27', name: 'Tab Switcher', category: 'Tabs', desc: 'Destinations | Fleet | Book tabs with animated panel transitions' },
    { id: 'v28', name: 'Comparison Matrix', category: 'Data', desc: 'Grid with aircraft as columns, destinations as rows, showing estimated costs' },
    { id: 'v29', name: 'Cost Calculator', category: 'Calculator', desc: 'Pick aircraft + duration slider = estimated total cost' },
  ],
  dataForward: [
    { id: 'v30', name: 'Big Numbers Hero', category: 'Data', desc: 'Massive flight times as hero elements, fleet compact below' },
    { id: 'v31', name: 'Dashboard Grid', category: 'Bento', desc: '2x2 bento grid with stats, destinations, fleet, CTA in quadrants' },
    { id: 'v32', name: 'Progress Bars', category: 'Data Viz', desc: 'Destinations as progress bars showing percentage of car time saved' },
  ],
  premium: [
    { id: 'v33', name: 'Bento Grid', category: 'Bento', desc: 'Mixed-size cards combining fleet + destinations in a bento layout' },
    { id: 'v34', name: 'Two-Column Editorial', category: 'Editorial', desc: 'Long text left with sticky fleet sidebar right' },
    { id: 'v35', name: 'Full-Bleed Photo Bands', category: 'Photo', desc: 'Alternating destination photos full-width with overlaid info' },
  ],
  typography: [
    { id: 'v36', name: 'Type-Only Swiss', category: 'Typography', desc: 'No images, pure typography and spacing — very Swiss design' },
    { id: 'v37', name: 'Single-Scroll List', category: 'List', desc: 'One continuous alternating list of destinations and aircraft entries' },
    { id: 'v38', name: 'Centered Narrow', category: 'Minimal', desc: 'Everything in a 500px column, very focused, lots of vertical space' },
  ],
  darkCinematic: [
    { id: 'v39', name: 'Gradient Dark', category: 'Dark', desc: 'Background gradient #1a1a1a to #0a0a0a with subtle glow accents' },
    { id: 'v40', name: 'Aviation HUD', category: 'HUD', desc: 'Heads-up display aesthetic — green-on-dark with technical readouts' },
  ],
};

const tabs = [
  { key: 'layout', label: 'Layout', color: 'default' },
  { key: 'style', label: 'Style', color: 'blue' },
  { key: 'experience', label: 'Experience', color: 'green' },
  { key: 'minimal', label: 'Minimal & Art', color: 'purple' },
  { key: 'mapRadial', label: 'Map & Radial', color: 'default' },
  { key: 'journey', label: 'Journey', color: 'blue' },
  { key: 'interactive', label: 'Interactive', color: 'green' },
  { key: 'dataForward', label: 'Data-Forward', color: 'purple' },
  { key: 'premium', label: 'Premium', color: 'default' },
  { key: 'typography', label: 'Typography', color: 'blue' },
  { key: 'darkCinematic', label: 'Dark & Cinematic', color: 'green' },
];

// ============================================================
// MAIN PAGE COMPONENT
// ============================================================
const SFHTests = () => {
  const [currentItem, setCurrentItem] = useState(null);

  const CurrentVariation = currentItem ? variationMap[currentItem.id] : V41;

  return (
    <div style={{ minHeight: '100vh', background: '#faf9f6' }}>
      <style>{`
        .sfh-tests__intro {
          text-align: center;
          padding: 5rem 2rem 3rem;
          max-width: 800px;
          margin: 0 auto;
        }
        .sfh-tests__pre-title {
          display: block;
          font-size: 0.75rem;
          text-transform: uppercase;
          letter-spacing: 0.3em;
          color: #888;
          margin-bottom: 1rem;
        }
        .sfh-tests__title {
          margin: 0 0 1.5rem;
        }
        .sfh-tests__title-line {
          display: block;
          font-family: 'Space Grotesk', sans-serif;
          font-size: clamp(2.5rem, 5vw, 4rem);
          font-weight: 700;
          text-transform: uppercase;
          line-height: 1;
          letter-spacing: -0.02em;
        }
        .sfh-tests__title-line--1 { color: #1a1a1a; }
        .sfh-tests__title-line--2 { color: #4a4a4a; }
        .sfh-tests__tagline {
          font-size: 1.1rem;
          color: #666;
          line-height: 1.8;
          font-weight: 400;
        }
        .sfh-tests__variation-label {
          text-align: center;
          padding: 1.5rem 2rem;
          font-family: 'Share Tech Mono', monospace;
          font-size: 0.65rem;
          text-transform: uppercase;
          letter-spacing: 0.15em;
          color: #999;
          border-top: 1px solid #e8e6e2;
        }
      `}</style>

      {/* Fixed intro — same across all variations */}
      <div className="sfh-tests__intro">
        <span className="sfh-tests__pre-title">Freedom to Fly Yourself Anywhere</span>
        <h2 className="sfh-tests__title">
          <span className="sfh-tests__title-line sfh-tests__title-line--1">Your Aircraft</span>
          <span className="sfh-tests__title-line sfh-tests__title-line--2">Awaits</span>
        </h2>
        <p className="sfh-tests__tagline">
          You've earned your licence. Now use it. Hire from our fleet of R22s, R44s and R66s — fuelled, washed and waiting on the pad for you, ready to go. Fly yourself to lunch in France, a weekend in the Cotswolds, a business meeting across the country, or just flying around for the beauty and fun of it. Available by the hour, day or week. No crew, no waiting, no compromise.
        </p>
      </div>

      {/* Variation label */}
      <div className="sfh-tests__variation-label">
        {currentItem ? `// ${currentItem.id.toUpperCase()} — ${currentItem.name}` : '// V1 — Clean Minimal Grid'}
      </div>

      {/* Current variation renders here */}
      <CurrentVariation />

      {/* Picker */}
      <Picker
        sections={sections}
        tabs={tabs}
        storageKey="sfh-tests-favorites"
        title="Self-Fly Hire Variations"
        onItemSelect={setCurrentItem}
      />
    </div>
  );
};

export default SFHTests;
